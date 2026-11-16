// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for use-a-theme.doc.mjs.
export const docsZh = {
  "title": "使用主题",
  "description": "为应用配置主题：安装主题、通过 CLI 导入、接入生成的模块、切换深色模式、嵌套主题，并为生产环境选择运行时主题或构建后主题。",
  "sections": [
    {
      "section": "Wrap your app in a theme",
      "title": "用主题包裹应用",
      "content": [
        {
          "type": "code",
          "label": "安装并添加主题"
        },
        {
          "type": "code",
          "label": "接入生成的模块一次"
        },
        {
          "type": "code",
          "label": "在已添加的主题之间切换"
        },
        {
          "type": "prose",
          "text": "`theme add` 会记录已安装的包主题，并用其构建模块、生产 CSS 和可选字体 CSS 重新生成 `src/astryx-themes.ts` 或 `.js`。在没有 `src` 的项目中，该模块位于项目根目录。第一个导入的主题会成为默认主题。`theme use <slug>` 可更改该默认主题，`theme remove <slug>` 可移除非默认的主题。"
        },
        {
          "type": "prose",
          "text": "使用 `defineTheme({extends: importedTheme, ...})` 自定义包主题，然后构建并添加该本地主题。只有当你想要一个不再接收包维护方更新的独立源码分支时，才使用 `theme eject`。完整编写指南见 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "Migrating Earlier Theme Copies",
      "title": "迁移早期主题副本",
      "content": [
        {
          "type": "prose",
          "text": "由已发布版本的 `theme add` 复制的主题仍作为应用源码保留。升级不会移动、删除或重写它，只会写入缺失的同名描述符并标记 `maintained: false`，因此该副本会成为本地主题。"
        },
        {
          "type": "code",
          "label": "为早期副本添加描述符"
        },
        {
          "type": "prose",
          "text": "在升级运行之前，主题命令会跳过 `src/themes` 中没有描述符的副本。`theme list` 和 doctor 会将其标记为未迁移并显示升级命令。原本打算复制源码的脚本现在改用相同参数运行 `theme eject`。原本打算让应用使用某个主题的脚本则运行 `theme add`。"
        },
        {
          "type": "prose",
          "text": "`ASTRYX_THEME` 不再被读取。请运行 `theme add <slug>` 和 `theme use <slug>`，在生成的应用主题模块中选择默认主题。该模块存在时，组件元数据会读取其中记录的默认主题。没有该模块时，已发布版本中 `package.json#astryx.theme` 的查找方式仍保持原有含义。"
        }
      ]
    },
    {
      "section": "Available Themes",
      "title": "可用主题",
      "content": [
        {
          "type": "prose",
          "text": "使用 `{@pm install @astryxdesign/theme-<name>}` 安装所需的主题包，然后用 `theme add <slug>` 导入其 slug。CLI 会为你导入该包的构建产物。"
        },
        {
          "type": "table",
          "headers": [
            "主题",
            "添加命令",
            "说明"
          ],
          "rows": [
            [
              "Neutral",
              "{@command theme add neutral}",
              "低调、极简的美学，使用 Figtree 字体。是一个不错的起点。"
            ],
            [
              "Butter",
              "astryx theme add butter",
              "金黄色、如黄油般的表面，搭配蓝色点缀；Sarina + Outfit 字体。"
            ],
            [
              "Chocolate",
              "astryx theme add chocolate",
              "温暖的棕色调和舒适米色；Fraunces + Albert Sans 字体。"
            ],
            [
              "Gothic",
              "astryx theme add gothic",
              "仅深色的氛围主题；深蓝灰色表面，做旧展示字体。"
            ],
            [
              "Matcha",
              "astryx theme add matcha",
              "泥土感的绿色；DM Sans + Playwrite US Trad 字体。"
            ],
            [
              "Stone",
              "astryx theme add stone",
              "温暖的石材和板岩色调；Montserrat + Figtree 字体。"
            ],
            [
              "Y2K",
              "astryx theme add y2k",
              "俏皮的 Y2K 流行风；长春花蓝正文，全息点缀，Poppins + Crimson Text。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "每个第一方包都会在 `@astryxdesign/theme-{name}/built` 导出其构建主题，生产 CSS 位于 `/theme.css`，字体加载 CSS 位于 `/fonts.css`。`theme add` 会把这些导入写入生成的应用模块。"
        }
      ]
    },
    {
      "section": "Theme Props",
      "title": "Theme 属性",
      "content": [
        {
          "type": "prose",
          "text": "`<Theme>` 接收 `theme`（必填）、`mode`（默认 `'system'`，或 `'light'`/`'dark'`）和 `children`。每个属性的详情请运行 `{@command component Theme}`。"
        }
      ]
    },
    {
      "section": "Using a Theme from an Integration",
      "title": "使用集成中的主题",
      "content": [
        {
          "type": "prose",
          "text": "将集成安装为直接依赖。Astryx 无需 `astryx.config` 条目即可发现其主题和指南。只有当已安装的包导出其构建模块和生产样式表时，才能添加该主题。"
        },
        {
          "type": "code",
          "label": "安装、检查并添加"
        },
        {
          "type": "prose",
          "text": "`theme add` 会在应用记录中保留所属包，并导入其构建模块、样式表和可选字体样式表。包的更新会继续到达应用。只有在需要把源码和描述符复制到 `src/themes/ocean` 作为独立本地分支时，才运行 `theme eject ocean --package @acme/brand-integration`。"
        }
      ]
    },
    {
      "section": "Dark mode",
      "title": "深色模式",
      "content": [
        {
          "type": "prose",
          "text": "在令牌值中使用 [light, dark] 元组即可自动切换模式。在 Theme 上使用 mode='system'（默认值）以跟随操作系统偏好。仅有一种颜色模式的主题（其构建模块导出 `colorModes`）会列在生成模块的 `themeModes` 中，而 `theme add` 打印的接入代码会传入 `mode={themeModes[defaultThemeSlug] ?? 'system'}`，因此所选主题会显示其自身的模式。"
        },
        {
          "type": "code",
          "label": "浅色/深色元组"
        },
        {
          "type": "code",
          "label": "用按钮切换"
        },
        {
          "type": "prose",
          "text": "要创建带自定义深色模式颜色的主题，请参阅 {@link generic:author-a-theme}。"
        }
      ]
    },
    {
      "section": "Nested themes",
      "title": "嵌套主题",
      "content": [
        {
          "type": "prose",
          "text": "将不同区域包裹在各自的 `<Theme>` 提供器中。"
        },
        {
          "type": "code",
          "label": "深色侧边栏配浅色内容"
        }
      ]
    },
    {
      "section": "Runtime vs Built Themes",
      "title": "运行时主题与构建主题",
      "content": [
        {
          "type": "prose",
          "text": "主题有两种工作模式："
        },
        {
          "type": "table",
          "headers": [
            "",
            "运行时（源码）",
            "构建后"
          ],
          "rows": [
            [
              "导入（已发布主题）",
              "@astryxdesign/theme-{name}",
              "@astryxdesign/theme-{name}/built + theme.css"
            ],
            [
              "导入（自定义主题）",
              "直接使用 defineTheme()",
              "由 `{@command theme build}` 生成的构建 .js + .css"
            ],
            [
              "工作方式",
              "useInsertionEffect 在 hydration 时注入 <style>",
              "随页面加载预编译的 .css 文件"
            ],
            [
              "组件覆盖",
              "仅在客户端注入",
              "位于静态 CSS 中：SSR 期间即存在"
            ],
            [
              "SSR 安全",
              "令牌安全，组件覆盖在 hydration 时会闪烁",
              "完全 SSR 安全：无闪烁"
            ],
            [
              "最适合",
              "作为 `{@command theme build}` 的编写输入",
              "应用接入，适用于开发和生产环境"
            ]
          ]
        },
        {
          "type": "list",
          "items": [
            "生产应用请使用 `theme add`；它会接入构建模块和 CSS。",
            "从生成模块中一次性导入 `themes` 和 `defaultThemeSlug`，并在开发环境中也保持该接入方式。",
            "编辑本地主题时，运行 `{@command theme build --watch}`，让构建文件保持最新。",
            "为自定义主题运行 `{@command theme build}` 以获取构建产物。"
          ]
        },
        {
          "type": "list",
          "items": [
            "在生产 SSR 应用中使用运行时主题；组件覆盖会在 hydration 时闪烁。",
            "导入 /built 但不导入 CSS 文件；组件覆盖将不会生效。",
            "将包主题源码导入应用运行时代码。",
            "手动编辑生成的主题模块；`theme add`、`theme remove` 和 `theme use` 会重新生成它。"
          ]
        },
        {
          "type": "prose",
          "text": "要为生产环境构建自定义主题，请参阅 {@link generic:author-a-theme} 的“构建”部分。"
        }
      ]
    }
  ]
};
