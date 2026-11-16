// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for other-libraries.doc.mjs.
export const docsZh = {
  "title": "其他库",
  "description": "Panda、Chakra、MUI、Emotion、styled-components、Theme UI、UnoCSS 以及互操作检查清单。",
  "sections": [
    {
      "section": "Panda, Chakra, and Other Semantic Token Systems",
      "title": "Panda、Chakra 及其他语义令牌系统",
      "content": [
        {
          "type": "prose",
          "text": "Panda CSS 和 Chakra UI 等库提供一等公民的语义令牌对象。将系统 CSS 变量放在这些对象的叶子节点上，这样产品代码可以使用该库的语义名称，而值仍由系统掌控。"
        },
        {
          "type": "code",
          "label": "语义令牌别名"
        },
        {
          "type": "code",
          "label": "Panda 风格用法"
        },
        {
          "type": "prose",
          "text": "如果语义令牌库需要从原始值生成自己的浅色/深色 CSS，请将其模式选择器与 Theme 对齐（`data-theme=\"light|dark\"`），并基于系统主题数据生成该适配器。否则它可能会偏离嵌套主题或运行时主题。"
        }
      ]
    },
    {
      "section": "MUI and Palette-Based Themes",
      "title": "MUI 与基于调色板的主题",
      "content": [
        {
          "type": "prose",
          "text": "`MUI` 需要 primary、background、text 和 divider 等调色板槽位。普通组件样式应将这些槽位映射到系统变量。仅当 MUI 或你的代码需要进行对比度、alpha、变亮或变暗计算而解析颜色时，才使用原始值。"
        },
        {
          "type": "code",
          "label": "映射到系统变量的 MUI 调色板"
        },
        {
          "type": "prose",
          "text": "如果应用由 MUI 掌控颜色模式，请基于系统主题数据生成浅色和深色调色板值，并保持 Theme 模式同步。如果由 Theme 掌控颜色模式，请让两个 MUI 配色方案都指向相同的系统 CSS 变量。"
        }
      ]
    },
    {
      "section": "Emotion, styled-components, Theme UI, and Styled System",
      "title": "Emotion、styled-components、Theme UI 与 Styled System",
      "content": [
        {
          "type": "prose",
          "text": "`Emotion` 和 `styled-components` 等运行时 CSS-in-JS 库通常接受任意主题对象。让这些对象保持语义化，但将系统 CSS 变量引用作为值存储。这样可以在系统通过 CSS 级联更新值时保持生成的类名稳定。"
        },
        {
          "type": "code",
          "label": "通用 CSS-in-JS 主题对象"
        },
        {
          "type": "prose",
          "text": "避免在每次模式切换时用原始颜色值重建 CSS-in-JS 主题对象。CSS 变量可以让类名保持不变，而由浏览器解析当前生效的值。"
        }
      ]
    },
    {
      "section": "UnoCSS and Custom Utility Systems",
      "title": "UnoCSS 与自定义工具类系统",
      "content": [
        {
          "type": "prose",
          "text": "UnoCSS 等工具类生成器可以将系统变量放入其主题配置或快捷方式中。保持类名语义化（`bg-surface`、`text-primary`），并让值指向系统令牌。"
        },
        {
          "type": "code",
          "label": "UnoCSS 风格配置"
        },
        {
          "type": "prose",
          "text": "静态工具类提取器无法识别动态构造的类名。应优先使用显式类名字符串或该库的安全列表/源注册机制。"
        }
      ]
    },
    {
      "section": "Interop Checklist",
      "title": "互操作检查清单",
      "content": [
        {
          "type": "list",
          "items": [
            "在首次绘制之前足够早地导入重置/基础 CSS 和主题 CSS 文件。对于生产环境 SSR，优先使用 `{@command theme build}` 构建的主题，或已发布的 `/built` 主题导入加 `theme.css`。",
            "为颜色模式选择一个所有者。Theme 使用 `data-theme=\"light|dark\"` 和 `color-scheme` 来解析 `light-dark()` 令牌。",
            "按意图而非精确命名将外部库的语义层映射到系统变量。例如，MUI 的 `background.paper` 映射到 `--color-background-surface`。",
            "构建映射时使用 {@link namespace:tokens} 和专项令牌文档。初始映射保持精简：文本、表面/正文/卡片/浮层、边框、强调色、状态、间距、圆角、排版、阴影。",
            "仅在需要已解析值的非 CSS API 中使用令牌解析器 API。"
          ]
        }
      ]
    }
  ]
};
