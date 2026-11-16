// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for theme.doc.mjs.
export const docsZh = {
  "title": "主题",
  "description": "要创建或修改主题，请使用实验性的主题编辑器：`astryx experimental theme editor new <name> --like neutral`，然后使用 `editor set` / `editor how \"<what you want>\"`，再用 `astryx theme add <name>` 接入，每次修改后用 `astryx experimental theme editor show <name> --png` 查看效果（它会拍摄真实组件的图片）：没看过效果就不算完成主题修改。主题的使用与创建：应用主题见「使用主题」，创建和自定义主题见「创作主题」。",
  "sections": [
    {
      "section": "Wrap your app in a theme",
      "title": "用主题包裹应用",
      "content": [
        {
          "type": "prose",
          "text": "安装主题，用 CLI 导入它，并一次性接入生成的模块。完整指南——可用主题、集成主题、深色模式、嵌套主题和生产构建——见 {@link generic:use-a-theme}。"
        },
        {
          "type": "code",
          "label": "接入生成的模块一次"
        }
      ]
    },
    {
      "section": "Create a custom theme",
      "title": "创建自定义主题",
      "content": [
        {
          "type": "prose",
          "text": "使用 `defineTheme`，配合令牌覆盖、刻度配置和组件样式覆盖。完整指南——调色板生成、扩展主题、适配、自定义变体和生产构建——见 {@link generic:author-a-theme}。"
        },
        {
          "type": "code",
          "label": "快速开始"
        },
        {
          "type": "prose",
          "text": "要创建一套新的协调配色系统，请运行 `{@command theme palette generate palette.config.json --out palette.generated.ts}`。检查并提交生成的调色板模块和回执，导入它的 `palette` 导出，然后从语义令牌引用稳定的色阶。重新生成已接受的调色板时，会更新所有保留这些引用的映射令牌；生成过程不会重写主题。"
        },
        {
          "type": "code",
          "label": "将语义令牌映射到生成的调色板色阶"
        }
      ]
    },
    {
      "section": "Icon sizes",
      "title": "图标尺寸",
      "content": [
        {
          "type": "prose",
          "text": "主题会在其样式表中为每个 Icon 尺寸设定尺寸：`components.icon['size:sm']`（或 `xsm`、`md`、`lg`）上的 `width` 和 `height` 会调整该尺寸的字形大小，无论是对语义图标名称还是传给 `Icon` 的 SVG 组件都如此。尺寸请用 `px` 或 `rem` 指定：语义图标会从中获取字号，因此使用 `em` 值也会撑大其盒子。主题未设置的尺寸在 16px 根字号下保持 12、16、20 或 24px（`xsm`、`sm`、`md`、`lg`），并随根字号缩放；`rem` 会保留这种缩放。四个尺寸名称是固定的。"
        },
        {
          "type": "code",
          "label": "设置 Icon 尺寸"
        }
      ]
    },
    {
      "section": "Dark mode",
      "title": "深色模式",
      "content": [
        {
          "type": "prose",
          "text": "浅色、深色和系统模式：{@link generic:use-a-theme}。"
        },
        {
          "type": "code",
          "label": "浅色/深色元组"
        }
      ]
    },
    {
      "section": "Integration themes",
      "title": "集成主题",
      "content": [
        {
          "type": "prose",
          "text": "安装集成包后，Astryx 会自动发现其主题。使用 `{@command theme add <name> --package <integration>}` 导入其中一个。只有在需要独立的源代码分支时才使用 `theme eject`。完整演练见 {@link generic:use-a-theme}。"
        }
      ]
    }
  ]
};
