// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for subcomponent.doc.mjs.
export const docsZh = {
  "title": "子组件",
  "description": "将组件家族中的一个成员移到独立的同级文档中，而无需在父文档中重复描述。",
  "sections": [
    {
      "section": "Choose a separate doc",
      "title": "选择独立文档",
      "content": [
        {
          "type": "prose",
          "text": "先编写组件家族文档。当某个公开成员拥有自己的源码，并且有足够的行为、属性或使用说明需要单独维护时，将它移到同级文档中。父文档仍会列出该成员，但只保留名称。"
        },
        {
          "type": "list",
          "items": [
            "如果小型成员的完整契约在家族文档中就能说清楚，就保留为内联条目。",
            "当成员需要独立的搜索结果、示例、使用说明或单独维护时，使用同级文档。",
            "每个成员只能有一个文档归属。不要为同一个名称同时保留完整的父文档条目和同级文档。"
          ]
        }
      ]
    },
    {
      "section": "Reference it from the parent",
      "title": "从父文档引用",
      "content": [
        {
          "type": "code",
          "label": "components/AcmeDialog.doc.mjs"
        },
        {
          "type": "prose",
          "text": "仅含名称的条目让 `AcmeDialogHeader` 保留在家族中。它的描述和属性只来自同级文件。"
        }
      ]
    },
    {
      "section": "Write the subcomponent doc",
      "title": "编写子组件文档",
      "content": [
        {
          "type": "code",
          "label": "components/AcmeDialogHeader.doc.mjs"
        },
        {
          "type": "prose",
          "text": "所有字段见 {@link schema:component-doc}。"
        },
        {
          "type": "list",
          "items": [
            "`subComponentOf` 必须与父文档的 `name` 完全一致。",
            "`description` 说明该成员在家族中的角色。`usage` 是可选项；当成员需要超出这一句的说明时再添加。",
            "CLI 不会把 `group`、`category`、`keywords` 等家族字段从父文档复制到子文档。子文档需要哪些字段，就在自己的文档中设置。"
          ]
        }
      ]
    }
  ]
};
