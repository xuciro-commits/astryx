# Astryx 示例：Vite

在 Vite + React 项目中从源码构建 **@astryxdesign/core** 的参考应用。

大多数应用不需要从源码构建。Astryx 提供预构建的 CSS：导入 `@astryxdesign/core/reset.css`、`@astryxdesign/core/astryx.css` 以及某个主题的 `theme.css`，无需任何构建插件（参见 [Vite 快速开始](../../packages/core/README.md#vite)）。本示例展示另一条路径：它使用 `@astryxdesign/build/vite` 中的 `astryxStylex()` 在应用中编译 Astryx 的 TypeScript 与 StyleX 源码，该函数封装了 `@stylexjs/unplugin`。

[Next.js 示例](../example-nextjs/) 使用预构建 CSS 这条路径。

## 设置步骤

### 1. 安装依赖

```bash
npm install @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral react react-dom
npm install --save-dev @astryxdesign/build @stylexjs/unplugin @vitejs/plugin-react \
  typescript @types/react @types/react-dom vite
```

### 2. Browserslist

在 `package.json` 中添加 `browserslist`，让 Vite 的 CSS 管道面向现代浏览器。Astryx 令牌使用原生 `light-dark()`（2024 年进入基线）；若没有现代浏览器目标，lightningcss 会将其降级为 polyfill 变量，从而破坏主题功能：

```json
{
  "browserslist": ["last 1 Chrome version"]
}
```

> 对于面向最新版 Chrome 的内部工具，`"last 1 Chrome version"` 已足够。若需支持更广泛的浏览器，请使用包含 Chrome 123+ / Firefox 120+ / Safari 17.5+ 的目标（即 `light-dark()` 发布之时）。

### 3. Vite 配置

`vite.config.ts`：

```ts
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {astryxStylex} from '@astryxdesign/build/vite';

export default defineConfig({
  plugins: [...astryxStylex(), react()],
});
```

`astryxStylex()` 负责设置 StyleX 编译、CSS 层顺序（reset < astryx-base < astryx-theme < product）、指向 `@astryxdesign/core` 源码的 `resolve.alias`、避免 Vite 预打包 Astryx 的 `optimizeDeps.exclude`，以及保留 `light-dark()` 的 Lightning CSS 目标。插件顺序很重要：请在 `react()` 之前展开 `astryxStylex()`。

### 4. CSS 入口点

`src/index.css`：一个最小化的 CSS 文件，让 Vite 输出一个可供 StyleX 追加样式的 CSS 资源：

```css
:root {
  --stylex-injection: 0;
}
```

在 `src/main.tsx` 中导入它，同时导入基础 reset 与主题 CSS：

```tsx
import '@astryxdesign/core/reset.css';
import '@astryxdesign/theme-neutral/theme.css';
import './index.css';
```

CSS 导入顺序很重要：

1. `reset.css`：基线重置（`@layer reset`）
2. `theme.css`：主题令牌覆盖（`@layer astryx-theme`）
3. `index.css`：StyleX 提取占位符

源码构建会编译组件样式，因此本示例不导入 `@astryxdesign/core/astryx.css`。

### 5. 主题提供者

用 `Theme` 和默认主题包裹你的应用：

```tsx
import {Theme} from '@astryxdesign/core/theme';
import {neutralTheme} from '@astryxdesign/theme-neutral';

export default function App() {
  return <Theme theme={neutralTheme}>{/* your app */}</Theme>;
}
```

不需要 `'use client'`；Vite 没有服务端/客户端边界。

## 命令

```bash
# Start dev server with HMR
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview
```

## 注意事项

| 问题              | 症状                             | 修复                                                            |
| ----------------- | -------------------------------- | --------------------------------------------------------------- |
| 过旧的浏览器目标  | 颜色异常：`light-dark()` 被降级  | 保留上面的 `browserslist`；不要传入更旧的 `lightningcssTargets` |
| 缺少 CSS 入口点   | StyleX 没有可追加的 CSS 资源     | 创建一个最小化的 `index.css` 并在 `main.tsx` 中导入             |
| 插件顺序          | 样式未被提取或 HMR 失效          | 在 plugins 数组中于 `react()` 之前展开 `astryxStylex()`         |
| 重复的 React 类型 | monorepo 中出现 JSX 组件类型错误 | `@types/react` 提升导致的已知 monorepo 问题；不影响运行时       |

## 在 monorepo 外测试

本示例出于方便放在 Astryx monorepo 中，但它应能代表从 npm 使用 `@astryxdesign/core` 的真实应用。monorepo 的工作区符号链接可能会悄悄绕过外部使用者会遇到的问题（Vite 依赖预打包、缺少依赖、解析路径错误）。

**在合并对本示例的更改之前，请以外部使用者的身份进行测试。** 完整流程见 [Testing Example Apps](https://github.com/meta/astryx/wiki/Testing-Example-Apps) wiki 页面。

## 相关

- [Issue #145：面向源码分发包使用者的示例应用](https://github.com/meta/astryx/issues/145)
- [StyleX Vite React 示例](https://github.com/facebook/stylex/tree/main/examples/example-vite-react)
- [Astryx 示例：Next.js](../example-nextjs/)
