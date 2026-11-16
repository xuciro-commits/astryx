# Astryx 示例：Next.js（源码构建）

参考应用：将 **@astryxdesign/core** 从原始 TypeScript + StyleX 源码与产品代码一起编译。使用 `@astryxdesign/build` 实现独立的 CSS 层分离。

> **运行在 webpack 上，而非 Turbopack。** 源码构建通过
> `nextConfig.webpack` 配置解析，而 Turbopack 从不调用它——在 Turbopack 下，应用会加载
> `dist`，而 PostCSS 却从 `source` 编译该库，页面会渲染成无样式状态
> 但不会报错。
>
> 此示例固定 Next 16，并向 `next dev` 和
> `next build` 显式传递 `--webpack`。Next 16 默认使用 Turbopack，但此源码构建需要
> webpack，因为 `nextConfig.webpack` 设置了它的源码解析条件。

## 为什么用源码构建？

|          | 源码构建                                           | dist 构建               |
| -------- | -------------------------------------------------- | ----------------------- |
| CSS 输出 | 仅包含你导入组件的样式（约 22KB）                  | 所有组件样式（约 77KB） |
| 层控制   | 完整：reset < astryx-base < astryx-theme < product | 基础：导入顺序          |
| 构建时间 | 较慢（通过 Babel 编译 Astryx 源码）                | 较快（预构建的 CSS）    |
| 配置     | 更多配置（babel + postcss + next.config）          | 最少（CSS 导入）        |

## 工作原理

`@astryxdesign/build` 提供两个协同工作的插件：

1. **`@astryxdesign/build/babel`**：包装 StyleX babel 插件，将 Astryx 库文件路由到 `astryx` 类前缀，将产品文件路由到默认的 `x` 前缀
2. **`@astryxdesign/build/postcss`**：分两遍以不同前缀编译 StyleX CSS，并各自包裹在自己的 `@layer` 中

这会创建完全独立的类命名空间：

- `@layer astryx-base` 中的 `.astryx78zum5 { display: flex }`
- `@layer product` 中的 `.x78zum5 { display: flex }`

主题位于它们之间的 `@layer astryx-theme` 中，因此：

- 主题会覆盖库默认值 ✓
- 产品在需要时覆盖主题 ✓
- 无需 `!important` ✓

## 配置

### 1. 安装

```bash
npm install @stylexjs/stylex @astryxdesign/core @astryxdesign/theme-neutral next react react-dom
npm install -D @astryxdesign/build @stylexjs/babel-plugin @babel/core autoprefixer typescript
```

### 2. babel.config.js

```js
const path = require('path');

module.exports = {
  presets: ['next/babel'],
  plugins: [
    [
      '@astryxdesign/build/babel',
      {
        dev: process.env.NODE_ENV !== 'production',
        runtimeInjection: false,
        enableInlinedConditionalMerge: true,
        treeshakeCompensation: true,
        aliases: {
          '@astryxdesign/core/*': [
            path.join(__dirname, 'node_modules/@astryxdesign/core/*'),
          ],
          '@astryxdesign/core': [
            path.join(__dirname, 'node_modules/@astryxdesign/core'),
          ],
        },
        unstable_moduleResolution: {type: 'commonJS'},
      },
    ],
  ],
};
```

### 3. postcss.config.js

```js
const path = require('path');

module.exports = {
  plugins: {
    '@astryxdesign/build/postcss': {
      appDir: 'src',
      babelPlugins: [
        [
          '@stylexjs/babel-plugin',
          {
            dev: process.env.NODE_ENV !== 'production',
            runtimeInjection: false,
            enableInlinedConditionalMerge: true,
            treeshakeCompensation: true,
            aliases: {
              '@astryxdesign/core/*': [
                path.join(__dirname, 'node_modules/@astryxdesign/core/*'),
              ],
              '@astryxdesign/core': [
                path.join(__dirname, 'node_modules/@astryxdesign/core'),
              ],
            },
            unstable_moduleResolution: {type: 'commonJS'},
          },
        ],
      ],
    },
    autoprefixer: {},
  },
};
```

### 4. next.config.mjs

```js
const nextConfig = {
  transpilePackages: ['@astryxdesign/core', '@astryxdesign/theme-neutral'],
  webpack: config => {
    config.resolve.conditionNames = ['source', 'import', 'require', 'default'];
    return config;
  },
};

export default nextConfig;
```

### 5. CSS 文件

`src/app/layers.css` 必须是独立文件（webpack 会提升 `@import` 内容）：

```css
@layer reset, astryx-base, astryx-theme, product;
```

`src/app/globals.css`：

```css
@import './layers.css';
@import '@astryxdesign/core/reset.css';
@import '@astryxdesign/theme-neutral/theme.css';

@stylex;
```

## 层演示

此示例包含一个可视化演示，展示：

1. **astryx-base**：Astryx 组件默认样式
2. **astryx-theme**：主题覆盖（次要按钮背景）
3. **product**：应用覆盖（胶囊形状、绿色背景、全宽）
4. **类前缀验证**：Astryx 组件使用 `astryx` 前缀，产品使用 `x`

打开 devtools → CSS layers 面板查看分离效果。

## 注意事项

| 问题                  | 症状                                     | 修复                                                               |
| --------------------- | ---------------------------------------- | ------------------------------------------------------------------ |
| 缺少 `conditionNames` | Astryx 解析到 dist（没有 `astryx` 前缀） | 在 webpack 配置中添加 `['source', 'import', 'require', 'default']` |
| 缺少 `aliases`        | `defineVars` 解析失败                    | 为 `@astryxdesign/core` 和 `@astryxdesign/core/*` 添加别名         |
| `layers.css` 内联     | 层顺序被忽略                             | 保持为独立文件（webpack 会提升 `@import`）                         |
| 缺少 `browserslist`   | `light-dark()` 被降级                    | 添加 `["last 1 Chrome version"]`                                   |

## 相关

- [纯 dist 示例](../example-nextjs/)：最简单的配置
- [Dist + Tailwind](../example-nextjs-tailwind/)：使用 Tailwind 处理布局
- [Dist + StyleX](../example-nextjs-stylex/)：仅产品使用 StyleX
- [`@astryxdesign/build`](../../packages/build/)：构建插件源码
