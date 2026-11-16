// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for describe-the-component.doc.mjs.
export const docsZh = {
  "title": "描述组件",
  "summary": "编写并维护默认的组件文档，并在一个组件家族拥有多个导出、或某个成员需要独立文件时调整文档形态。",
  "slots": {
    "guides": {
      "title": "描述组件"
    }
  },
  "blocks": [
    {
      "i": 0,
      "type": "prose",
      "text": "组件的 `.doc.mjs` 是集成公开契约的一部分，而不是可有可无的注释。Astryx 用它生成 CLI 输出和搜索，人们和 Agent 也会阅读它，以判断组件是否适用以及如何使用。"
    },
    {
      "i": 1,
      "type": "list",
      "items": [
        "同时修改源码及其 `.doc.mjs`。",
        "当公开名称、导入方式、行为、属性、默认值、示例或无障碍要求发生变化时，更新文档。",
        "`integration verify` 检查文档形态和打包后的导入，`doctor integration components` 会将每个属性表与组件的 TypeScript 属性进行比对（{@link generic:check-the-props}）。两者都无法证明文字描述仍与组件一致。"
      ]
    },
    {
      "i": 2,
      "type": "prose",
      "text": "每个组件文档都有一个稳定的身份标识，并提供足够的使用指南，让读者能正确选择它。请选择与你的模块匹配的下方形态。"
    },
    {
      "i": 3,
      "type": "prose",
      "text": "每次更改源码或文档后，都重新读取组件。这个输出就是人们和 Agent 所看到的内容。"
    }
  ],
  "sections": []
};
