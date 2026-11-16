// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for document-the-theme.doc.mjs.
export const docsZh = {
  "title": "为主题编写文档",
  "description": "通过扩展核心的 theme 主题来为主题编写文档，让应用能在 {@link generic:theme} 中看到你的主题。",
  "sections": [
    {
      "section": "Extend the core theme topic",
      "title": "扩展核心的 theme 主题",
      "content": [
        {
          "type": "prose",
          "text": "为你的主题提供一个文档主题，让它扩展核心的 `theme` 主题，这样列出你的包的应用就能在 {@link generic:theme} 末尾看到你的主题。用 `extends: 'theme'` 添加它（{@link generic:extend-or-replace}）。"
        },
        null,
        {
          "type": "prose",
          "text": "让这一节保持简短：如何安装包、运行 `theme add`、应用生成的模块（{@link generic:use-a-theme-in-an-app}），以及用 `extends` 自定义。当主题使用自定义字体时，写明字体家族，以及 `theme add` 会导入的可选导出字体样式表（{@link generic:fonts-and-assets}）。应扩展 `theme`，而不要扩展另一个包会替换的主题；否则，先加载你的包、后加载那个包的应用会丢掉你添加的这一节。"
        }
      ]
    },
    {
      "section": "Not agent guidance",
      "title": "不要写入智能体指南",
      "content": [
        {
          "type": "prose",
          "text": "不要把主题用法放进 `agentDocs`。Agent 行会进入每个应用的 agent 文件，只用于每次会话都需要的指导；主题的安装和使用步骤应放在一个供人和 agent 按需阅读的文档主题中。参见 {@link generic:agent-guidance}。"
        }
      ]
    }
  ]
};
