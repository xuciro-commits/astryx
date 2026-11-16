# Astryx Sandbox

组件沙箱是一个不依赖适配器的 Vite 应用。它的路由清单会自动发现手写的页面模块，以及由 CLI 模板目录生成的包装器。生产构建会将每个页面及其路由组布局预渲染为 **每一个** 以斜杠结尾的路由对应的真实 `index.html`，然后在浏览器中水合。未知路由会得到一个静态 `404.html`，而不是 SPA 的兜底路由。

<!-- SYNC: 当此目录中的文件发生变化时，请更新本文档。 -->

## 设置与开发

在仓库根目录下，先用 pnpm 安装依赖并构建工作区：

```bash
pnpm install
pnpm build
pnpm dev:sandbox
```

`dev:sandbox` 会构建一次 core，运行 Sandbox 生成器，并启动 Vite。`AGENTS.md` 文件在 postinstall 时由 `astryx init --features agents` 生成，包含组件编写指南。若要对 core 源码进行热重载，请使用 `pnpm dev:sandbox:source`（`source` 条件，不保证有主题层）；若需要编译后的 CSS 层和接近热重载的体验，请在第二个终端中同时运行 `pnpm -F @astryxdesign/core dev` 与 `pnpm -F @astryxdesign/sandbox dev`。

## 构建与路由

```bash
pnpm -F @astryxdesign/sandbox build
pnpm -F @astryxdesign/sandbox typecheck
pnpm -F @astryxdesign/sandbox test
```

构建会先运行 `sync-templates`、changelog、CLI/foundation 文档、XLE、score-ledger、motion-audit 和 theme-family 生成器。score-ledger 生成器会尝试在五秒超时内获取公开 wiki 快照；其浏览器页面使用 `no-store` 的 fetch 刷新，并回退到该快照或 TBD。此过程不涉及后端或凭据。随后 Vite 使用 `@astryxdesign/build/vite` 编译 StyleX，`scripts/prerender.mjs` 将每个页面和布局渲染到 `out/`，而 `scripts/verify-export.mjs` 会对照 `scripts/next-export-routes.json`（保留的 Next 15 导出 oracle）检查 **每一个** 页面主体、HTML 路由和资源。

根路径本地开发使用 `/`。若要在 docsite 下进行暂存，请运行 `SANDBOX_BASE_PATH=/sandbox pnpm -F @astryxdesign/sandbox build`；此时输出的 HTML、JS、CSS、模板资源、tokenizer 和导航都将使用 `/sandbox/`。当宿主有要求时，`SANDBOX_TEMPLATE_ASSETS_BASE_PATH` 可以覆盖图片位置。此框架变更**不会**迁移任何生产或 PR 部署，也不会修改 Vercel 配置；当前的 Pages 链接保持原样。

### 添加页面

对于带侧边栏框架的页面，添加 `src/app/(sandbox)/pages/<slug>/page.tsx`；对于模板/预览外壳，使用 `(fullscreen)`；对于无框架页面，使用 `(raw)`。当页面属于目录时，请将导航条目添加到 `src/app/sandboxPages.ts`。路由清单会自动发现页面。生成的模板包装器由 `scripts/sync-templates.js` 管理，而非手工编写。添加或有意移除公共深链接时，请同时审查并更新已检入的 `scripts/next-export-routes.json` 路由列表；在该差异得到解释之前，契约测试会失败。

## 关键文件

- `vite.config.mts`、`src/main.tsx`、`src/route-entry.tsx`、`src/RouteView.tsx`、`src/entry-server.tsx`、`src/router.tsx`：预渲染路由、匹配的水合、分组布局、导航与基础路径。
- `index.html`、`src/app/globals.css`、`src/app/layers.css`：元数据、字体、全局 CSS 与主题层。
- `src/app/providers.tsx`：主题与模式状态（包括嵌入同步）。
- `scripts/route-manifest.mjs`、`scripts/prerender.mjs`、`scripts/verify-export.mjs`、`src/route-manifest.test.ts`：精确路径导出契约与 404 行为。
- `src/generated/`、`src/app/(fullscreen)/templates/`、`public/template-assets/`：生成的注册表、包装器与镜像的公共图片（由 git 忽略）。
