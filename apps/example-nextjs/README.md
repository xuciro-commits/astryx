# Astryx 示例：Next.js（Dist）

参考应用，演示如何在 Next.js 项目中以预构建的 dist 包形式使用 **@astryxdesign/core**。

无需 StyleX 构建插件；Astryx 提供预编译的 CSS 和 JS。这是最简单的入门方式。

## 安装步骤

### 1. 安装依赖

```bash
npm install @astryxdesign/core @astryxdesign/theme-neutral next react react-dom
npm install --save-dev @types/react @types/react-dom typescript
```

### 2. CSS 导入

在 `src/app/globals.css` 中导入 reset、组件样式和主题：

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';
```

CSS 导入顺序很重要：

1. `reset.css`：基线重置（`@layer reset`）
2. `astryx.css`：所有组件样式（`@layer astryx-base`）
3. `theme.css`：主题令牌覆盖（`@layer astryx-theme`）

在根布局中导入该 CSS 文件：

```tsx
import './globals.css';
```

### 3. 主题 + Link provider（客户端边界）

```tsx
// src/app/providers.tsx
'use client';
import Link from 'next/link';
import {Theme} from '@astryxdesign/core/theme';
import {LinkProvider} from '@astryxdesign/core/Link';
import {neutralTheme} from '@astryxdesign/theme-neutral/built';

export function Providers({children}) {
  return (
    <Theme theme={neutralTheme}>
      <LinkProvider component={Link}>{children}</LinkProvider>
    </Theme>
  );
}
```

`LinkProvider` 为所有基于链接的 Astryx 组件（Link、带 href 的 Button、TopNav、SideNav、Breadcrumbs、TabList）接入 Next.js 客户端导航。

### 4. Next.js 配置（webpack 构建）

```js
// next.config.mjs
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@astryxdesign/core'],
  },
};

export default nextConfig;
```

使用 webpack（`next build --webpack`）时，从包根导入的 Server Component 否则会打包所有客户端组件；此配置让首次加载仅包含页面实际使用的内容。在 Server Components 中，还应从组件自身的入口导入，例如 `@astryxdesign/core/Button`。Turbopack 无需更改。

## 常见问题

| 问题                           | 现象                                       | 修复                                  |
| ------------------------------ | ------------------------------------------ | ------------------------------------- |
| CSS 导入顺序错误               | 缺少主题令牌或图层失效                     | 按 reset → astryx → theme 的顺序导入  |
| provider 上没有 `'use client'` | `createContext` 导致 Server Component 报错 | 在 provider 文件中标记 `'use client'` |

## 在 monorepo 之外测试

本示例为了方便起见位于 Astryx monorepo 中，但它应能代表从 npm 使用 `@astryxdesign/core` 的真实应用。Monorepo 的工作区解析可能会悄悄绕过外部使用方遇到的问题。

**在合并对本示例的更改之前，请以外部使用方的身份测试它。** 完整流程见 [Testing Example Apps](https://github.com/meta/astryx/wiki/Testing-Example-Apps) wiki 页面。

## 相关

- [Issue #145：新增 example-nextjs 项目](https://github.com/meta/astryx/issues/145)
- [Astryx + Tailwind 示例](../example-nextjs-tailwind/)：同样采用 dist 方式，并用 Tailwind 编写自定义布局样式
