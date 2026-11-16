// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for building-blocks.doc.mjs.
export const docsZh = {
  "title": "构建模块",
  "summary": "添加组件、模板、主题、文档和 codemod，并配置其行为方式。",
  "slots": {
    "guides": {
      "title": "构建模块"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "在全局模式下：当用户将你的包安装到自己的计算机上（与全局 CLI 并列）时，你的包添加的每一类内容也会在任何项目之外生效；在项目内，仅当项目安装该包时才生效。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
    },
    {
      "i": 1,
      "type": "prose",
      "text": "这些是你能够添加到集成中的所有内容。你可以随意组合，不受限于任何单一类型。"
    },
    {
      "i": 2,
      "type": "list",
      "items": [
        "一个组件，或一整套组件库。",
        "组件，以及配套的主题和模板。",
        "只需要文档时，仅添加文档。",
        "Agent 指南，让应用中的 AI Agent 遵循你的组件库。",
        "codemod，用于在你的破坏性变更中更新应用代码。"
      ]
    },
    {
      "i": 3,
      "type": "prose",
      "text": "下面每一类内容都有独立的指南。打开其中一篇，深入了解如何添加该类内容，以及如何在包不断壮大的过程中保持其健康。"
    }
  ],
  "sections": []
};
