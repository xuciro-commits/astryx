// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-and-setup.doc.mjs.
export const docsZh = {
  "title": "令牌与设置",
  "description": "在自定义样式中使用设计令牌、为 swizzle 后的组件配置 StyleX 编译器，以及让 Next.js webpack 构建保持精简。",
  "sections": [
    {
      "section": "Design Tokens",
      "title": "设计令牌",
      "content": [
        {
          "type": "prose",
          "text": "编写自定义样式时，请使用设计令牌而不是硬编码值。令牌是能适应活动主题和颜色模式的 CSS 自定义属性。系统提供了用于间距、颜色、圆角、阴影、排版和大小的令牌。"
        },
        {
          "type": "code",
          "label": "在 stylex.create 中使用令牌"
        },
        {
          "type": "code",
          "label": "在 stylex.create 中使用带类型的令牌导入"
        },
        {
          "type": "prose",
          "text": "两种方式都可行：`var()` 字符串或从 `tokens.stylex` 进行带类型的导入。带类型的导入提供自动补全，并在构建时捕获拼写错误。"
        },
        {
          "type": "prose",
          "text": "完整令牌参考（所有间距、颜色、圆角、阴影和排版令牌及其值）请参见 {@link namespace:tokens}。如何通过 defineTheme 覆盖令牌，请参见 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "StyleX Build Setup (required for swizzled components)",
      "title": "StyleX 构建设置（swizzle 后的组件必需）",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 组件以预编译形式发布：`astryx.css` 和每个包自己的样式表包含其全部样式，因此使用已发布的包无需任何 StyleX 设置。但 `{@command swizzle <Component>}` 会将原始 StyleX *源码*复制到你的应用中，而 StyleX 源码需要构建时的 StyleX 编译器来生成原子 CSS。没有编译器时，导入该组件会抛出以 `Unexpected 'stylex.create' call at runtime` 开头的错误，页面无法渲染。如果某个 swizzle 后的组件抛出该错误，说明应用缺少 StyleX 编译器。如果你使用 `stylex.create()` 编写自己的 StyleX，情况同样如此。"
        },
        {
          "type": "table",
          "headers": [
            "打包工具",
            "StyleX 插件"
          ],
          "rows": [
            [
              "Webpack",
              "@stylexjs/webpack-plugin"
            ],
            [
              "Vite / Rollup",
              "@stylexjs/rollup-plugin（或社区 Vite 插件）"
            ],
            [
              "Babel（任意打包工具）",
              "@stylexjs/babel-plugin + @stylexjs/postcss-plugin"
            ],
            [
              "Next.js（App Router，SWC）",
              "基于 SWC 的转换；参见下文 Next.js 说明"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "Next.js（App Router）是最棘手的地方。StyleX 的标准编译器是 Babel 插件，但在 Next.js 中引入 Babel 配置会禁用 SWC 编译器，进而禁用依赖 SWC 的功能，例如 `next/font`。"
        },
        {
          "type": "prose",
          "text": "仓库中的 `apps/example-nextjs-stylex` 采用 Babel 方案（`next/babel`、`@stylexjs/babel-plugin`、`@stylexjs/postcss-plugin`）。Babel 会关闭 SWC，因此该应用不使用 `next/font`。若要保留 `next/font`，请使用基于 SWC 的转换，例如 `@stylexswc/nextjs-plugin`。"
        },
        {
          "type": "code",
          "label": "next.config.mjs：基于 SWC 的 StyleX 转换（可保持 next/font 正常工作）"
        },
        {
          "type": "list",
          "items": [
            "缺少编译器的症状：导入 swizzle 后的组件会抛出以 `Unexpected 'stylex.create' call at runtime` 开头的错误，页面无法渲染。",
            "Babel 配置会在 Next.js 中关闭 SWC；如果需要 `next/font`，请跳过它。",
            "纯主题定制（defineTheme + astryx theme build）不需要 StyleX 编译器；只有 swizzle 后的或自行编写的 StyleX 源码才需要。",
            "在启用 StyleX 编译器的情况下继续加载 `astryx.css`。编译器只构建你自己编写的源码和 swizzle 后的源码；切勿将 `node_modules/@astryxdesign` 添加到其输入中。"
          ]
        }
      ]
    },
    {
      "section": "Next.js with webpack",
      "title": "使用 webpack 的 Next.js",
      "content": [
        {
          "type": "prose",
          "text": "如果你的 Next.js 应用使用 webpack 构建（`next build --webpack`），请将 `@astryxdesign/core` 添加到 `experimental.optimizePackageImports`。在 webpack 下，如果没有该设置，从包根导入的服务器组件会把每个客户端组件都打包进来；启用后首次加载仅包含页面实际使用的内容。Turbopack（Next.js 16 的默认打包工具）无需更改，且该设置在那里可安全保留。"
        },
        {
          "type": "code",
          "label": "next.config.mjs"
        },
        {
          "type": "prose",
          "text": "在服务器组件中，还请从每个组件各自的入口导入，例如 `import {Button} from '@astryxdesign/core/Button'`。`{@command component <Name>}` 会打印该入口。以 `'use client'` 开头的文件不受影响。"
        }
      ]
    }
  ]
};
