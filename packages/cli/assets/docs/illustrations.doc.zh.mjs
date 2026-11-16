// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for illustrations.doc.mjs.
export const docsZh = {
  "title": "插画",
  "description": "空状态、引导流程和功能亮点的插画指南。",
  "sections": [
    {
      "section": "When to Use",
      "title": "何时使用",
      "content": [
        {
          "type": "prose",
          "text": "一致地使用插画可以强化品牌识别，并帮助用户一眼理解上下文。请在以下场景中使用插画："
        },
        {
          "type": "table",
          "headers": [
            "场景",
            "示例"
          ],
          "rows": [
            [
              "空状态",
              "无数据、首次体验、搜索无结果"
            ],
            [
              "引导",
              "欢迎屏幕、功能介绍、设置向导"
            ],
            [
              "功能亮点",
              "新功能公告、升级提示"
            ],
            [
              "错误状态",
              "权限被拒绝、未找到、服务不可用"
            ]
          ]
        }
      ]
    },
    {
      "section": "Guidelines",
      "title": "指南",
      "content": [
        {
          "type": "list",
          "items": [
            "在整个产品中保持插画风格一致。",
            "使用简洁的扁平插画，在浅色和深色模式下均适用。",
            "插画尺寸应与容器成比例，通常为 120–240px。",
            "将插画居中放置，说明文字置于其下方。"
          ]
        },
        {
          "type": "list",
          "items": [
            "不要混用来自不同来源的插画风格。",
            "不要将插画用作没有目的的装饰。"
          ]
        }
      ]
    },
    {
      "section": "Placement",
      "title": "放置",
      "content": [
        {
          "type": "prose",
          "text": "对于空状态，请将插画传入 `EmptyState` 的 `icon` 插槽，它会在标题和描述上方居中显示。典型插画尺寸从内联空状态的 120px 到整页引导屏幕的 240px 不等。请始终为插画搭配标题和说明下一步操作的描述。"
        },
        {
          "type": "code",
          "label": "带插画的空状态"
        }
      ]
    }
  ]
};
