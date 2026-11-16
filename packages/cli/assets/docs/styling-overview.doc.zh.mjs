// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for styling-overview.doc.mjs.
export const docsZh = {
  "title": "样式方案概览",
  "description": "如何设置 CSS——三条路径的确切导入方式：普通 CSS、Tailwind，以及用于你自己代码的 StyleX——外加每个 Astryx 包附带的样式表。",
  "sections": [
    {
      "section": "Pick a path",
      "title": "选择一条路径",
      "content": [
        {
          "type": "table",
          "headers": [
            "路径",
            "适合",
            "需要构建步骤？"
          ],
          "rows": [
            [
              "普通 CSS",
              "大多数应用。可用 className、xstyle 或任意 CSS 库设置样式。",
              "无。"
            ],
            [
              "Tailwind",
              "使用 Tailwind v4 的应用。CSS 桥接层会将工具类映射到设计令牌。",
              "除 Tailwind 自身的构建外，无。"
            ],
            [
              "用于自己代码的 StyleX",
              "你自己的 `stylex.create()` 样式以及 swizzle（eject）后的组件。Astryx 本身保持预构建。",
              "需要——为你自己的代码添加 StyleX 插件。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "三条路径都会加载相同的预构建 Astryx 样式表，解析到相同的设计令牌，并支持主题和深色模式。它们都不会编译 Astryx 包源码。你可以在一个应用中混用它们。"
        }
      ]
    },
    {
      "section": "Plain CSS",
      "title": "普通 CSS",
      "content": [
        {
          "type": "code",
          "label": "安装"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "prose",
          "text": "完成。组件开箱即用——可以用 `className`、`xstyle` 或 `style` 设置样式。将 `theme-neutral` 换成任意主题包（`{@command theme list}` 会显示可用的主题）。"
        }
      ]
    },
    {
      "section": "Tailwind",
      "title": "Tailwind",
      "content": [
        {
          "type": "code",
          "label": "安装"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "prose",
          "text": "`@layer` 声明至关重要——没有它，组件样式会压过 Tailwind 工具类，`className` 覆盖就会失效。桥接层（`tailwind-theme.css`）无需 JS 就能将 `text-primary`、`bg-surface` 和 `rounded-lg` 等类映射到设计令牌。"
        },
        {
          "type": "prose",
          "text": "已经配置好 Tailwind 的项目只需较小的改动，{@link generic:tailwind} 展示了做法。对于 Tailwind v3，请参见 {@link generic:migration-setup} 中的层级变通方案。"
        }
      ]
    },
    {
      "section": "StyleX for your own code",
      "title": "用于自己代码的 StyleX",
      "content": [
        {
          "type": "prose",
          "text": "仅当你编写自己的 StyleX（`stylex.create()`）或 swizzle 组件（`{@command swizzle <Component>}`）时才需要，后者会将其 StyleX 源码复制到你的应用中。普通路径已经支持 `xstyle` 覆盖——这条路径是为你自己的 StyleX 代码准备的。一些内置页面模板也使用 StyleX 进行布局；如果你搭建了这样的模板并看到“Unexpected stylex.create call at runtime”，请添加下方适用于你的打包器的编译器插件。"
        },
        {
          "type": "code",
          "label": "安装"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "prose",
          "text": "保留 `astryx.css`：Astryx 组件样式始终来自预构建样式表。只让 StyleX 编译器处理你自己的源码，绝不要指向 `node_modules/@astryxdesign`。为你的打包器添加插件："
        },
        {
          "type": "table",
          "headers": [
            "打包器",
            "插件"
          ],
          "rows": [
            [
              "Webpack",
              "@stylexjs/webpack-plugin"
            ],
            [
              "Vite / Rollup",
              "@stylexjs/rollup-plugin"
            ],
            [
              "Babel（任意）",
              "@stylexjs/babel-plugin + @stylexjs/postcss-plugin"
            ],
            [
              "Next.js（保留 next/font）",
              "@stylexswc/nextjs-plugin"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "如果 swizzle 后的组件在运行时因 `stylex.create` 错误而失败，说明应用缺少 StyleX 编译器：请参见 {@link generic:tokens-and-setup} 中的“StyleX 构建设置”一节。"
        },
        {
          "type": "prose",
          "text": "`{@command swizzle <Component>}` 会在它拥有的输出文件夹中写入 `astryx-swizzle.json` 标记（该文件夹可以是副本创建的、空的，或者之前已标记过的）；随后该文件夹下的每个模块都会作为 Astryx 源码编译，因此请将副本放在单独的文件夹中，例如默认的 `components/astryx`。对于已经存放其他文件的文件夹，它不会写入标记，并会说明如何手动添加。使用 `@astryxdesign/build` 的 Babel、PostCSS 和 Vite 集成，或 webpack 下的 `withAstryx()` 时，该文件夹中的副本会编译进 `astryx-base`，位于 `astryx-theme` 之下，因此主题组件覆盖会像作用于包组件一样作用于它。在 Turbopack 下，以及使用上述标准 StyleX 插件时，副本的规则会进入你自己的样式，位于 `astryx-theme` 之上，主题组件覆盖不会作用于它。"
        }
      ]
    },
    {
      "section": "Other Astryx packages",
      "title": "其他 Astryx 包",
      "content": [
        {
          "type": "prose",
          "text": "每个带有组件样式的 Astryx 包都会附带自己的预构建样式表。对于你使用的每个包，请在 `astryx.css` 之后导入它。它们都会将规则放在同一个 `astryx-base` 层中，因此你的主题覆盖会优先于每个包。"
        },
        {
          "type": "code",
          "label": "globals.css"
        },
        {
          "type": "table",
          "headers": [
            "包",
            "样式表"
          ],
          "rows": [
            [
              "@astryxdesign/core",
              "@astryxdesign/core/astryx.css"
            ],
            [
              "@astryxdesign/richtext",
              "@astryxdesign/richtext/richtext.css"
            ],
            [
              "@astryxdesign/lab",
              "@astryxdesign/lab/lab.css"
            ],
            [
              "@astryxdesign/charts",
              "@astryxdesign/charts/charts.css"
            ]
          ]
        }
      ]
    },
    {
      "section": "What each import does",
      "title": "每个导入的作用",
      "content": [
        {
          "type": "table",
          "headers": [
            "导入",
            "层",
            "用途"
          ],
          "rows": [
            [
              "reset.css",
              "reset",
              "跨浏览器重置（box-sizing、margins、color-scheme）。通过 :where() 实现零特异性。"
            ],
            [
              "astryx.css",
              "astryx-base",
              "预构建的组件样式。每条路径都必须加载。"
            ],
            [
              "richtext.css, lab.css, charts.css",
              "astryx-base",
              "你使用的每个其他 Astryx 包的预构建样式。在 astryx.css 之后加载。"
            ],
            [
              "theme.css",
              "astryx-theme",
              "以 CSS 自定义属性形式提供的设计令牌（颜色、间距、圆角、排版）。替换该包即可换用其他主题。"
            ],
            [
              "tailwind-theme.css",
              "—",
              "Tailwind v4 桥接层。将工具类映射到设计令牌。纯 CSS，无 JS。仅用于 Tailwind 路径。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Further reading",
      "title": "延伸阅读",
      "content": [
        {
          "type": "list",
          "items": [
            "{@link namespace:styling} — xstyle、className、数据属性选择器、代码中的设计令牌。",
            "{@link namespace:styling-libraries} — Tailwind 桥接层细节、Panda、Chakra、MUI、CSS Modules，以及非 CSS 的令牌解析。",
            "{@link generic:use-a-theme} — 应用主题、深色模式、嵌套主题。{@link generic:author-a-theme} — defineTheme、覆盖、生产构建。",
            "{@link namespace:migration} — 级联层审计、Tailwind v3 共存，以及基础冒烟测试。"
          ]
        }
      ]
    }
  ]
};
