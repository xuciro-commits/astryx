<!-- Copyright (c) Meta Platforms, Inc. and affiliates. -->

# 模板查看器

一个小型 Vite 应用，可在浏览器中渲染 `packages/cli/assets/templates` 里的任意
模板。它取代了较为笨重的 `apps/sandbox`，用于预览模板。

## 用法

```bash
pnpm -F @astryxdesign/template-viewer dev
```

然后以 URL 形式打开某个模板目录的路径，例如：

- http://localhost:5173/packages/cli/assets/templates/pages/ai-chat
- http://localhost:5173/packages/cli/assets/templates/blocks/components/Avatar

打开 `/` 会列出所有可用模板。

## 工作原理

`src/App.tsx` 会用 glob 匹配 `packages/cli/assets/templates` 下的所有 `.tsx` 文件，匹配
URL 路径所指目录中的那个文件，并在 `<Theme>` 内惰性渲染它。
StyleX 由 `astryxStylex()` 从 `@astryxdesign/core` 源码编译——
无需代码生成，也不依赖 Babel/PostCSS/Next.js。

## 前置条件

`@astryxdesign/build`、`@astryxdesign/core` 和 `@astryxdesign/theme-neutral`
包必须先构建一次（它们从 `dist` 发布）：

```bash
pnpm -F @astryxdesign/build build
pnpm -F @astryxdesign/core build
pnpm -F @astryxdesign/theme-neutral build
```
