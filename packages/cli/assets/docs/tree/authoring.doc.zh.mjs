// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for authoring.doc.mjs.
export const docsZh = {
  "title": "编写",
  "summary": "构建一个 npm 包，为 Astryx 应用添加组件、模板、主题、文档和 codemod，并查阅其中每个文件的每个字段。",
  "slots": {
    "guides": {
      "title": "构建集成"
    },
    "reference": {
      "title": "参考"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "在全局模式下：用户可以为自己的计算机安装你的集成，与全局 CLI 并列。此后它在任何项目之外的文件夹中生效；在项目内，只有项目安装了该集成时才生效。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
    },
    {
      "i": 1,
      "type": "prose",
      "text": "集成是与 Astryx 用户分享内容的一种方式：一个由你拥有和维护的包，构建在 Astryx 提供的框架之上。发布一个、多个或任意组合，用户一步即可安装。它与 Astryx CLI 及 Core 协同工作。各类集成的说明见 {@link namespace:building-blocks}。"
    },
    {
      "i": 2,
      "type": "prose",
      "text": "例如，把轮播组件作为集成发布。任何安装了该集成的应用都可以用 `{@command search carousel}` 找到它，CLI 会像使用任何 Astryx Core 组件一样使用它。"
    },
    {
      "i": 3,
      "type": "prose",
      "text": "集成还可以替换内置模板或文档。开始前，请先安装 `@astryxdesign/cli`，并打开 {@link generic:quick-start}。"
    },
    {
      "i": 4,
      "type": "prose",
      "text": "你为集成编写的每个文件的每个字段，详见 {@link generic:field-reference}。"
    },
    {
      "i": 5,
      "type": "prose",
      "text": "每个集成都会在自己的构建中运行 `{@command integration check --strict}`：这是必需步骤，而非可选步骤，因此当文档、属性或链接与代码不再匹配时，你的构建会失败，而不会让用户的应用出问题。参见 {@link generic:checks}。"
    }
  ],
  "sections": []
};
