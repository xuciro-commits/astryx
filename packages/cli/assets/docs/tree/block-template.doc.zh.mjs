// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for block-template.doc.mjs.
export const docsZh = {
  "title": "区块模板",
  "description": "描述一种较小的组合，选择其预览形状，并且仅当这种关系确实存在时，才将其与组件示例关联。",
  "sections": [
    {
      "section": "Start with a standalone block",
      "title": "从独立区块开始",
      "content": [
        {
          "type": "prose",
          "text": "大多数区块是独立存在的。除非该区块专门作为某个组件的示例或展示，否则请从这种形态开始。"
        },
        {
          "type": "code",
          "label": "templates/acme-stat-card.doc.mjs"
        },
        {
          "type": "prose",
          "text": "不要仅因为区块使用了某个组件就添加 `exampleFor`。`componentsUsed` 记录的是组合关系；`exampleFor` 声明的是某个组件拥有该示例。"
        }
      ]
    },
    {
      "section": "Choose the component relationship",
      "title": "选择组件关系",
      "content": [
        {
          "type": "prose",
          "text": "每个字段都在 {@link schema:template-doc} 中。"
        },
        {
          "type": "prose",
          "text": "保持一个明确的主要归属组件。仅将 `also*` 字段用于有意的次要放置。"
        },
        {
          "type": "code",
          "label": "templates/acme-status-card-showcase.doc.mjs"
        },
        {
          "type": "prose",
          "text": "然后检查包级模板列表（{@link generic:template-doc-overview}），确认条目带有你设置的关系。`{@command component}` 不会显示集成区块，因此列表才是检查的地方。"
        }
      ]
    },
    {
      "section": "Choose a useful preview",
      "title": "选择实用的预览",
      "content": [
        {
          "type": "prose",
          "text": "每个字段都在 {@link schema:template-doc} 中。"
        },
        {
          "type": "prose",
          "text": "根据下表中与形状最接近的项设置 `aspectRatio`，按该比例渲染区块，并不断调整，直到它既不裁切内容，也不留下大片空白。这些是起始值，不是约定默认值。"
        },
        {
          "type": "table",
          "headers": [
            "区块形状",
            "起始值"
          ],
          "rows": [
            [
              "宽导航、横幅、工具栏或标签页",
              "`16 / 4`"
            ],
            [
              "方形按钮、徽章、头像、图标、加载指示器或状态",
              "`1`"
            ],
            [
              "竖向导航、日历、列表或树",
              "`3 / 4`"
            ],
            [
              "内容卡片、对话框、表格或表单组",
              "`4 / 3`"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "`scale` 只影响 Astryx 自己的区块预览。集成区块可以省略它。"
        }
      ]
    }
  ]
};
