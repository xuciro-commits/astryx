// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for color.doc.mjs.
export const docsZh = {
  "title": "颜色",
  "description": "用于表面、文本、图标、边框和状态指示的语义颜色令牌。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "颜色是语义化的：令牌描述的是用途，而不是外观。每种颜色都会通过 CSS light-dark() 在浅色和深色模式之间自动适配。主题会覆盖解析后的值，因此你的代码永远不会引用原始十六进制颜色。每个主题都定义自己的值：`{@command theme list}` 会列出可用的主题。"
        }
      ]
    },
    {
      "section": "Color Tokens",
      "title": "颜色令牌",
      "content": [
        {
          "type": "prose",
          "text": "分层表面层级：body → surface → card → popover。每一层在视觉上都位于上一层之上。"
        },
        null
      ]
    },
    {
      "section": "Use color tokens in StyleX",
      "title": "在 StyleX 中使用颜色令牌",
      "content": [
        {
          "type": "prose",
          "text": "导入带类型的颜色令牌，并在 `stylex.create()` 中使用它们；它们会解析为当前主题和颜色模式。"
        },
        {
          "type": "code",
          "label": "应用颜色令牌"
        }
      ]
    },
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "使用语义令牌（--color-text-primary），而不是原始十六进制值。",
            "依靠表面层级（body → surface → card → popover）来实现分层。",
            "仅在符合其语义含义时使用状态颜色（success、error、warning）。"
          ]
        },
        {
          "type": "list",
          "items": [
            "硬编码十六进制值，因为它们无法适配深色模式或自定义主题。",
            "在同一场景中混用强调色和状态颜色。",
            "在非强调背景上使用 --color-on-accent。"
          ]
        }
      ]
    }
  ]
};
