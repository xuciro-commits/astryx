// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for typography-best-practices.doc.mjs.
export const docsZh = {
  "title": "最佳实践",
  "description": "使用字号阶梯、标题、展示文字和语义令牌时的推荐与禁止规则。",
  "sections": [
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "文档标题使用 Heading，其他内容使用 Text；它们会自动应用完整的字号阶梯。",
            "整体调整排版：在 defineTheme 中修改 base 和 ratio 即可改变整个阶梯（例如 { base: 16, ratio: 1.25 } 适合偏编辑风格，{ base: 12, ratio: 1.125 } 适合信息密集的界面）。",
            "当展示文字用作页面标题时，为 display 类型设置 as=\"h1\"（或 h2/h3）；这样既保留无障碍语义，又获得展示级字号。更推荐使用 `<Heading level={1} type=\"display-1\">`，它同时处理语义和样式。",
            "让行高通过字号阶梯对齐到 4px 网格；expandTypeScale 会根据 base 和 ratio 自动计算行距。",
            "次要信息使用辅助字号：时间戳、帮助文本、元数据、图注。",
            "当视觉层级与文档大纲不一致时（例如侧边栏或卡片标题），在 Heading 上使用 accessibilityLevel。"
          ]
        },
        {
          "type": "list",
          "items": [
            "不要手动设置 font-size 或 line-height；应使用语义字号阶梯令牌，让整个阶梯保持一致并对齐 4px 网格。",
            "不要跳过标题层级（例如从 h1 直接到 h3）；屏幕阅读器依赖连续的层级结构。使用 accessibilityLevel 将视觉层级与语义层级解耦。",
            "不要将 display 类型用于正文内容或页面内区块；它们只适用于主视觉、营销和数据突出展示等场景。",
            "不要通过覆盖单个字号令牌（--font-size-lg）来“微调”标题；应调整 base/ratio，让整个阶梯的比例保持协调。",
            "不要直接使用原始数值字重（400、600）；应引用语义字重令牌，以便主题重新映射。"
          ]
        }
      ]
    }
  ]
};
