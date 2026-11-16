// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for font-setup.doc.mjs.
export const docsZh = {
  "title": "字体设置",
  "description": "字体族、自定义字体加载、几何字号和语义字重。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "排版基于几何字号比例：基准字号 × 比例^步进，默认基准为 14px、比例为 1.2。每种文本样式都是一个语义令牌，组合了字号、字重和行高，因此组件表达的是意图（标题、正文、标签），而不是原始数值。"
        },
        {
          "type": "prose",
          "text": "两个层级协同工作：原始字号令牌（--font-size-xs ... --font-size-5xl）构成几何比例，语义排版比例令牌（--text-heading-1-size、--text-body-leading 等）通过 var() 引用它们。主题在 defineTheme 中调整基准和比例即可覆盖整个比例，所有语义令牌会自动重新计算。"
        }
      ]
    },
    {
      "section": "Font Families",
      "title": "字体族",
      "content": [
        {
          "type": "prose",
          "text": "三种字体角色：body（界面文本）、heading（标题和题头）和 code（等宽）。默认情况下，body 和 heading 共享同一系统字体栈；code 使用等宽字体栈。自定义主题可以为每个角色指定不同的字体族；未显式设置时，heading 继承 body。"
        },
        null
      ]
    },
    {
      "section": "Custom fonts",
      "title": "自定义字体",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 从不加载字体文件。defineTheme 和构建后的 CSS 只设置 font-family：指定某种 Web 字体（Fraunces、JetBrains Mono 等）会让每个浏览器去寻找它，而应用尚未加载该字体时会静默回退。当主题指定的字体族既不是 CSS 通用字体族也不是常见系统字体时，`{@command theme build}` 会给出警告并打印需要添加的片段；加载字体始终是应用的责任。"
        },
        {
          "type": "code",
          "label": "Google Fonts：添加到文档的 <head> 中"
        },
        {
          "type": "code",
          "label": "自托管：每个字体族和字重各一个 @font-face"
        },
        {
          "type": "prose",
          "text": "务必将 Web 字体与真正的回退字体栈搭配使用（度量相近的系统字体加一个通用字体族），这样在字体加载前以及字体始终未加载时文本仍然可读：defineTheme({typography: {heading: {family: 'Fraunces', fallbacks: 'Georgia, serif'}}})。"
        }
      ]
    },
    {
      "section": "Font Sizes",
      "title": "字号",
      "content": [
        {
          "type": "prose",
          "text": "几何比例：round(基准 × 比例^步进)，以 rem 表示。默认比例为 14px × 1.2，产生从 4xs（6px）到 5xl（42px）的 12 个步进。在 defineTheme 中调整基准和比例会重新生成每个字号令牌，同时保持比例关系。"
        },
        null
      ]
    },
    {
      "section": "Font Weights",
      "title": "字重",
      "content": [
        {
          "type": "prose",
          "text": "四种语义字重：normal（400，正文/代码）、medium（500，标签/数据）、semibold（600，题头/标题）、bold（700，强调）。排版比例令牌通过 var() 引用这些字重，因此主题可以重新映射数值。"
        },
        null
      ]
    }
  ]
};
