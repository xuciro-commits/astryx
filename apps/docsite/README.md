# Astryx Docsite

Astryx 的开源文档站点，使用 Next.js 和 StyleX 构建。

## 快速开始

```bash
pnpm install     # from repo root
pnpm build       # build all packages (themes need built exports)
cd apps/docsite
pnpm generate    # extract data from the monorepo into src/generated/
pnpm dev         # start the dev server
```

`pnpm dev` 和 `pnpm build` 都会通过 `predev`/`prebuild` 脚本自动运行 `generate`。

## 工作原理

文档站点从不硬编码包列表、组件目录或主题映射。所有内容都流经一个构建时的**数据管道**，它从 monorepo 中提取信息，并将带类型的 TypeScript 注册表写入 `src/generated/`。

### 数据管道

`scripts/generate-data.mjs` 扫描 monorepo 并生成：

| 注册表                        | 来源                                  | 内容                                     |
| ----------------------------- | ------------------------------------- | ---------------------------------------- |
| `packageRegistry.ts`          | `packages/*/package.json`             | 每个已发布包的名称、版本、描述和 README  |
| `componentRegistry.ts`        | Core + CLI 配置的集成 `.doc.mjs` 文件 | 每个包的 props、用法文档、hooks、分组    |
| `componentPreviewRegistry.ts` | 来自这些相同包的组件                  | 共享 Properties 预览的运行时导出         |
| `blockRegistry.ts`            | CLI + 集成模板块                      | 带元数据的展示块和示例块                 |
| `templateRegistry.ts`         | CLI `templates/pages/`                | 页面级模板（例如 dashboard、settings）   |
| `docsRegistry.ts`             | CLI `docs/`                           | 长篇指南和基础主题                       |
| `blogRegistry.ts`             | `src/content/blog/posts/`             | 人工撰写的博客文章（frontmatter 已校验） |
| `themeRegistry.ts`            | 已安装的 `@astryxdesign/theme-*` 包   | 构建后的主题对象，以包名为键             |
| `showcaseRegistry.ts`         | 带 `isShowcase` 的块                  | 复制的展示源文件                         |
| `exampleRegistry.ts`          | 带 `exampleFor` 的块                  | 复制的各组件示例块                       |
| `searchIndex.ts`              | CLI 的搜索，在本站项目中运行          | 搜索 API 排序的候选项                    |

`src/generated/` 目录已被 gitignore。页面从这些注册表导入，并渲染管道找到的任何内容，无需手动接线。

### 规则

**所有数据都来自数据管道。绝不在页面代码中硬编码包名、组件列表或主题对象。** 如果你需要关于 monorepo 的数据，请将其添加到 `generate-data.mjs`，并从注册表中使用它。

这意味着：

- 页面文件中不要使用 `import {fooTheme} from '@astryxdesign/theme-foo/built'`；请使用生成的 `themeRegistry` 中的 `themeObjects`
- 不要手工维护组件名称数组；请使用 `componentRegistry`
- 不要使用 `if (pkg === '@astryxdesign/core')` 这样的分支；让管道对包进行分类

## 版本化内容：latest 与 canary

文档站点只有一个从 `main` 部署的代码库，但数据管道可以根据构建**目标**从两个不同来源读取包文档。这两个目标对应包发布时使用的两个 npm dist-tag：

| 目标     | npm dist-tag | 包文档读取自                    | 部署到                          |
| -------- | ------------ | ------------------------------- | ------------------------------- |
| `latest` | `@latest`    | 最近一次**已发布**的 npm 版本   | 生产环境（`astryx.atmeta.com`） |
| `canary` | `@canary`    | 实时 monorepo（`main`，开发中） | canary 站点 + **每个 PR 预览**  |

目标由 Vercel 的 `VERCEL_ENV` 推导得出：生产部署为 `latest`；预览部署（`main` canary 站点和所有 PR 预览）以及本地开发为 `canary`。`scripts/resolve-content-root.mjs` 将目标映射到管道读取的文件系统根目录——对于 `latest`，它会从 npm 下载已发布包的 tarball（其 `src/` 中包含管道所需的 `.doc.mjs`）；对于 `canary`，它读取实时工作区，并加载 `astryx.config.mjs` 中的组件集成。标记为 `astryx.canaryOnly` 的包会被排除在 `latest` 快照之外。它们生成的组件使用现有的 `isReady: false` 状态，并在 canary 上归组到所属包下，在该包分类上显示一个烧瓶图标，而不是每个组件一个标记。只有文档化的**数据**被固定版本——CLI 模板演示是实时渲染的 React，始终从捆绑的工作区版本解析 `@astryxdesign/core`。

> **⚠️ 贡献者须知：库变更在发布之前不会显示在生产站点上。** 生产环境（`astryx.atmeta.com`）记录的是最近一次**已发布**的版本。如果你添加组件、修改 prop 或更新文档并合并到 `main`，这些变更在下一个版本发布到 npm 之前**不会**出现在生产环境。要在已部署的站点中看到你合并的变更，请使用 **canary** 站点或任意 **PR 预览**（两者都读取 `main`）——或页脚中的 "Canary docs" 链接。canary 横幅会链接回生产环境。

**本地开发不受影响。** `pnpm dev` 没有 `VERCEL_ENV`，因此默认使用 `canary` 并读取实时工作区——你的本地变更会如预期显示。要在本地预览 `latest` 视图，请使用 `DOCSITE_TARGET=latest` 运行管道（需要网络来获取已发布的 tarball）。

## 模板预览图标（实验性）

模板和块预览会渲染其模板导入的图标。若要改用已安装的图标集来绘制图标，请使用 `DOCSITE_ICON_SET=<package>/<set>` 构建。备用图标集按主图标集命名，以逗号分隔：`DOCSITE_ICON_SET=<package>/<set>,<package>/<backup>`。每个图标来自列表中第一个具有该含义的图标集，规则与 `astryx template` 相同；没有任何图标集具有的图标会绘制一个占位符，该占位符由预览的源码声明。请先在文档站点中安装每个图标集对应的包。当某个图标集的库是一个巨大的 barrel 模块时，构建会从各自的文件导入每个图标，因此预览只会编译该图标集用到的图标。更改设置会重新构建预览；无需删除 `.next`。未设置时，构建保持不变。此设置是实验性的：它可能在补丁版本中更改或被移除。

## 模板预览图片

模板和块预览通过 Next.js 图像优化器（`/_next/image`）加载 `public/template-assets` 下的 PNG 和 JPEG 文件。`scripts/template-image-loader.mjs` 会重写预览所渲染模块中的 `/template-assets/` 路径。模板源码和站点展示的代码保留其路径。`astryx template` 和 shadcn Install 项仍会将它们替换为占位符。矢量图像、视频以及没有对应文件的路径保持原样。

每张图片保持其像素尺寸（最大宽度 1920 像素），并以浏览器接受的格式送达。

## 添加新主题

1. 在 `packages/themes/<name>/` 下创建主题包
2. 将 `"@astryxdesign/theme-<name>": "*"` 添加到 `apps/docsite/package.json` 的 dependencies 中
3. 将 `@import "@astryxdesign/theme-<name>/theme.css"` 添加到 `src/app/globals.css`
4. 加载主题的字体（见下文）
5. 运行 `pnpm generate`；主题会自动出现在 `themeRegistry.ts`、`packageRegistry.ts`、侧边栏、craft 页面和包详情页中

> 只向文档站点添加**公开**（非私有）主题包。

### 字体加载

主题按名称引用字体，但不捆绑字体文件。如果字体未加载，主题会静默回退到系统字体。

文档站点通过 `src/app/layout.tsx` 中的单个 `<link>` 标签从 Google Fonts 加载所有自定义字体。添加新主题时，请检查它声明了哪些字体，并将缺失的字体系列添加到该 URL。

每个主题自己的 README 都准确记录了它需要哪些字体以及如何加载它们。请查看主题的 `## Fonts` 部分以获取具体的 Google Fonts URL。

## 添加新包

1. 在 `packages/<name>/` 下创建包
2. 将 `"@astryxdesign/<name>": "*"` 添加到 `apps/docsite/package.json` 的 dependencies 中
3. 对于 Core 以外的组件包，添加 `astryx.integration.mjs` 并设置 `components: './src'`，将该文件（以及 `src`）包含在包的 `files` 中，并在 `apps/docsite/astryx.config.mjs` 中列出该包。可选的展示块也保留在包中，并通过集成的 `templates` 字段暴露其目录；文档站点通过 CLI 模板 API 获取它们。仅发布 canary 的包还要在其 `package.json` 中设置 `astryx.canaryOnly: true`。发布稳定版本的包会加入 `.changeset/config.json` 中的 Changesets `fixed` 组，以便与 Core 一起版本化：生产快照会以 Core 的已发布版本获取每个文档化的包，而一个稳定集成如果使用自身版本，会作为部分发布的版本导致生产构建失败。
4. 运行 `pnpm generate`

该包会出现在侧边栏、库部分，并获得自己的 `/docs/<name>` 详情页。如果包中包含 `.doc.mjs` 文件，其组件也会被提取到 `componentRegistry.ts` 中。仅 canary 的包和组件只出现在 canary 构建中，并带有烧瓶图标。配置的包如果是稳定版本（既不是 `private` 也不是 `astryx.canaryOnly`），也会在生产站点上从其已发布的 tarball 进行文档化，从其第一个稳定版本开始（`scripts/resolve-content-root.mjs`）。

## 添加博客文章

博客位于 `/blog` 和 `/blog/<slug>`。文章是人工撰写的 Markdown 文件，带有 YAML frontmatter，存放在 `src/content/blog/posts/` 下。添加文章几乎只需放入一个文件——发现、校验和排序都是自动的。

完整指南见 **[`src/content/blog/README.md`](src/content/blog/README.md)**：frontmatter 参考、文章类型、作者注册表、封面图片和本地预览。简而言之：

1. 创建 `src/content/blog/posts/<slug>.md`，包含必需的 frontmatter（`title`、`description`、`date`、`type`、`authors`、`tags`）。
2. 如果你是新作者，请将自己添加到 `src/content/blog/authors.ts`。
3. 运行 `pnpm generate && pnpm test && pnpm typecheck`，然后运行 `pnpm dev` 预览。

必需的 frontmatter 会在构建时校验；草稿（`draft: true`）会被排除在生产输出之外。

## 项目结构

```
apps/docsite/
├── scripts/
│   └── generate-data.mjs    # The data pipeline
├── src/
│   ├── generated/            # gitignored — pipeline output
│   ├── app/
│   │   ├── globals.css       # CSS imports (reset, astryx base, theme stylesheets)
│   │   ├── layout.tsx        # Root layout
│   │   ├── providers.tsx     # Theme + client providers
│   │   ├── (docs)/           # Main docs routes (components, packages, docs)
│   │   ├── blog/             # Blog index + post detail (no sidebar)
│   │   └── craft/            # Craft landing (templates, themes, showcases)
│   ├── components/           # Shared UI components
│   ├── content/blog/         # Blog posts (MD + frontmatter) + authors.ts
│   └── lib/blog/             # Blog discovery, validation, and types
├── package.json
└── .gitignore                # Excludes src/generated/
```

## 命令

| 命令              | 作用                                  |
| ----------------- | ------------------------------------- |
| `pnpm generate`   | 运行数据管道                          |
| `pnpm dev`        | 启动 Next.js 开发服务器（自动先生成） |
| `pnpm build`      | 生产构建（自动先生成）                |
| `pnpm typecheck`  | 运行 `tsc --noEmit`                   |
| `pnpm test`       | 运行 vitest                           |
| `pnpm test:watch` | 以 watch 模式运行 vitest              |

## Playground 预览限制

Playground 用于试用 Astryx 代码，而不是保存其运行时数据。生产预览（包括已部署的 PR 预览）是**临时的**，并运行在 `sandbox="allow-scripts"` 下：文档站点同源存储和父页面 DOM 访问不可用。本地存储可能抛出异常；预览的代码没有持久化保证。内存中的交互仍然有效；AI Chat 模板的可调整大小面板在其存储不可用时已有回退。重新加载或替换预览会重置其运行时状态，然后恢复编辑器当前的代码、主题和模式。

生产环境的 Chromium 测试也描述了不透明源带来的这些浏览器后果；它们并不确立单独的 playground 能力策略：

- **剪贴板与麦克风：** Chromium 的权限策略在预览中拒绝剪贴板写入和麦克风访问。复制操作未报告成功；可读文本仍可被选中以手动复制。语音听写在打字正常工作时保持空闲。
- **原生选择器：** 跨源的 `showPicker()` 对日期/时间控件受到限制；键入输入和 Astryx 的 `nativePicker="never"` 界面仍然可用。文件和颜色控件有浏览器定义的例外，仍可响应用户手势。沙箱并非对所有原生选择器的一揽子禁令。
- **导航：** 预览的 Astryx 链接使用原生锚点，而不继承文档站点的 Next 路由。片段链接保留在当前文档中。非片段导航会替换文档并触发预览恢复。

`next dev` 保留原始的 same-origin 沙箱，以便加载开发资源。不能将其作为生产安全边界的证据。不要为了让生产演示正常工作而添加 `allow-same-origin`。

## 测试

测试位于 `src/__tests__/data-extraction.test.ts`，用于校验生成的注册表：包发现、组件提取、主题接线等。运行测试前请先运行 `pnpm generate`，因为测试会从 `src/generated/` 导入。

Playground 预览的浏览器契约位于 `e2e/`，在仓库根目录针对生产构建运行 `pnpm test:docsite-browser`（先在根目录运行 `pnpm build`，然后在此处运行 `pnpm build`）；参见 `playwright.config.ts`。
