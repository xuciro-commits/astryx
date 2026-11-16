# Astryx 示例：Next.js + StyleX（Dist）

参考应用，演示如何以预构建的 dist 包形式使用 **@astryxdesign/core**，并用 **StyleX** 编写产品级样式。

Astryx 组件的 CSS 已预先构建，无需编译 Astryx 源码。StyleX 仅用于你自己应用级的布局和自定义样式，通过 PostCSS 插件在构建时编译。

## CSS 图层集成

本示例使用 StyleX 的 `useCSSLayers.before` 选项，在 StyleX 应用图层之前声明 Astryx dist 图层：

```js
// postcss.config.js
useCSSLayers: {
  before: ['reset', 'astryx-base', 'astryx-theme'],
}
```

这会产生如下图层顺序：

```
reset < astryx-base < astryx-theme < stylex.base < stylex.1 < stylex.2 < ...
```

产品级 StyleX 样式始终优先于 Astryx 组件的默认样式，无需 `!important` 或额外提高特异性。

## 与源码构建的主要区别

|                     | 本示例（dist + StyleX）                               | 源码构建                                            |
| ------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Astryx CSS          | 通过 `@import "@astryxdesign/core/astryx.css"` 预构建 | 通过 StyleX babel 插件从源码编译                    |
| PostCSS `include`   | 仅 `src/**/*`（你的代码）                             | `src/**/*` + `node_modules/@astryxdesign/core/**/*` |
| StyleX `aliases`    | 不需要                                                | `createTheme` 解析所必需                            |
| `transpilePackages` | 不需要                                                | next.config 中必需                                  |
| 图层顺序            | `useCSSLayers.before` 声明 Astryx 图层                | `useCSSLayers: true`（Astryx 图层混入）             |

## 安装步骤

### 1. 安装依赖

```bash
npm install @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral next react react-dom
npm install --save-dev @stylexjs/babel-plugin @stylexjs/postcss-plugin \
  @babel/preset-react @babel/preset-typescript typescript @types/react @types/react-dom
```

### 2. Browserslist

```json
{
  "browserslist": ["last 1 Chrome version"]
}
```

### 3. Babel 配置

`babel.config.js`：StyleX 仅用于应用级样式：

```js
module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@stylexjs/babel-plugin',
      {
        dev: process.env.NODE_ENV === 'development',
        runtimeInjection: false,
        genConditionalClasses: true,
        treeshakeCompensation: true,
        unstable_moduleResolution: {
          type: 'commonJS',
          rootDir: __dirname,
        },
      },
    ],
  ],
};
```

> 无需 `aliases` 配置；我们没有编译 Astryx 源码。

### 4. PostCSS 配置

`postcss.config.js`：扫描你的应用源码，在 StyleX 图层之前声明 Astryx 图层：

```js
module.exports = {
  plugins: {
    '@stylexjs/postcss-plugin': {
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      babelConfig: {/* ... */},
      useCSSLayers: {
        before: ['reset', 'astryx-base', 'astryx-theme'],
      },
    },
  },
};
```

### 5. CSS 入口

`src/app/globals.css`：

```css
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/core/astryx.css';
@import '@astryxdesign/theme-neutral/theme.css';

@stylex;
```

### 6. 主题 + Link provider

```tsx
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

## 相关

- [纯 dist 示例](../example-nextjs/)：无 CSS 框架，使用内联样式进行布局
- [Dist + Tailwind 示例](../example-nextjs-tailwind/)：使用 Tailwind 进行布局样式
