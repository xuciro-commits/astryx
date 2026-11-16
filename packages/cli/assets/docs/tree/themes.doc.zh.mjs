// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for themes.doc.mjs.
export const docsZh = {
  "title": "主题",
  "summary": "在你的集成中编写主题；应用会像对待任何主题一样安装、应用并扩展它。",
  "slots": {
    "guides": {
      "title": "指南"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "在全局模式下：在任何项目之外，主题列表会包含为计算机安装的集成中的主题，那里的 `theme add` 只会列出它们；在项目内，只列出项目所安装集成中的主题。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
    },
    {
      "i": 1,
      "type": "prose",
      "text": "主题贡献包含可编辑的 `defineTheme` 源码，以及构建后的模块和生产用 CSS。`integration add theme` 会搭建源码并声明包导出；`theme build` 会写入构建产物。应用安装该包，运行 `theme add`，从生成的 app 模块应用主题，并通过 `extends` 自定义主题，而不是复制源码。"
    },
    {
      "i": 2,
      "type": "prose",
      "text": "这些指南覆盖完整流程：搭建源码、生成调色板、定义并构建主题、交付字体和资源、运行 `integration verify`，以及记录应用如何添加和扩展主题。应用主题（包括模式和 SSR）对每个主题都相同；参见 {@link generic:use-a-theme}。"
    }
  ],
  "sections": []
};
