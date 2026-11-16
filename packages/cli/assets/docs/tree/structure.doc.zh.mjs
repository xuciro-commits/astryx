// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for structure.doc.mjs.
export const docsZh = {
  "title": "结构",
  "description": "为每个区域的内容划分层级，然后选择能将其分组的最弱容器。",
  "sections": [
    {
      "section": "Structure",
      "title": "结构",
      "content": [
        {
          "type": "prose",
          "text": "为每个区域的内容划分层级，然后选择能将其分组的最弱容器。类型层级和 Card 或行涵盖了每一步；这些规则对它们都适用。"
        },
        {
          "type": "list",
          "items": [
            "每个区域一个主引；用字重和颜色划分层级；一个主要操作",
            "正文保持默认样式；通过字重和颜色降级，而不是缩小字号",
            "默认使用 Section；选用能读作一个分组的最弱容器",
            "集合以行（Table 或 List）通栏渲染，用分隔线分隔"
          ]
        },
        {
          "type": "list",
          "items": [
            "把正文变灰并缩小，让整个区域读起来像次要元数据",
            "把禁用色用于内容；它不满足对比度要求，只用于禁用控件",
            "Card 汤：把每条记录包进各自的 Card，而不是按行渲染",
            "Card 套 Card，或把全宽 Card 堆叠成页面结构",
            "Flexbox 汤：用嵌套的临时 flexbox 代替 Grid、Layout、Section 或 FormLayout",
            "同一区域内有两个互相竞争的主要操作",
            "把 Badge 当装饰；状态和元数据请使用 StatusDot 或 Token"
          ]
        }
      ]
    },
    {
      "section": "Type hierarchy",
      "title": "文字层级",
      "content": [
        {
          "type": "prose",
          "text": "给每个区域一个主引，然后用字重和颜色（而不是字号）来划分其余内容的层级。内容只使用两种文本颜色：主要色和次要色，不再使用更暗的颜色；正文完全不需要任何属性。"
        },
        {
          "type": "list",
          "items": [
            "正文（默认）：纯 Text，不设置字体类型、颜色或尺寸属性",
            "主引：与页面层级匹配的 Heading，或字重更重的正文 Text",
            "辅助：改用次要颜色，而不是更小的字号",
            "元数据：辅助文本样式，或用 StatusDot 或 Token 代替正文"
          ]
        },
        {
          "type": "code",
          "label": "正文，然后是一行四个层级"
        },
        {
          "type": "prose",
          "text": "眯眼测试：模糊时，应按主引、辅助、分组的顺序读出。如果所有内容同时涌入，用字重和颜色提高对比，而不是边框或更小的文字。"
        }
      ]
    },
    {
      "section": "Card or rows",
      "title": "卡片或行",
      "content": [
        {
          "type": "prose",
          "text": "选用能读作一个分组的最弱容器，只有它不够用时才升级。从最弱到最强："
        },
        {
          "type": "list",
          "items": [
            "间距和间隙：同一组内的相关条目。默认的节奏",
            "分隔线：密集列表或工具栏中的同级项，或将页眉与可滚动主体隔开",
            "Section：默认的页面结构单元，标题下的相关内容。无边框",
            "Card：自包含的小部件（KPI 卡片、图表、画廊条目），或关键内容周围的硬边界"
          ]
        },
        {
          "type": "code",
          "label": "Section 作为默认单元"
        },
        {
          "type": "prose",
          "text": "决策测试：记录按行渲染，列式数据用 Table，单行数据用 List；自包含的小部件或硬边界用 Card；其余都用 Section。"
        }
      ]
    }
  ]
};
