// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for elevation.doc.mjs.
export const docsZh = {
  "title": "阴影高度",
  "description": "用于营造视觉高度和内嵌状态环的阴影令牌。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "高度令牌通过 box-shadow 营造深度。三个级别（low、med、high）为浮动元素建立视觉层次。内嵌阴影为交互组件提供焦点环和选中环。"
        }
      ]
    },
    {
      "section": "Elevation Scale",
      "title": "高度阶梯",
      "content": [
        {
          "type": "prose",
          "text": "每个级别都会增强偏移和扩散。阴影颜色通过 light-dark() 自动适配深色模式。"
        },
        null
      ]
    },
    {
      "section": "Choosing a level",
      "title": "选择层级",
      "content": [
        {
          "type": "prose",
          "text": "选择级别时，应看表面距离页面有多远，而不是看你想要多少阴影。高度编码了堆叠顺序：级别越高，表示该表面叠在越多 UI 之上。每个表面只使用一个级别，只有当表面确实位于其他内容上方时，才将其提升到 `none` 以上。"
        },
        {
          "type": "table",
          "headers": [
            "级别",
            "使用场景",
            "示例"
          ],
          "rows": [
            [
              "none",
              "组件是扁平的，嵌入在表面中；它是页面的一部分，而不是叠在其上方。这是除 ChatComposer 外所有表面的默认值。",
              "网格中的 Card、内联 Banner、标准 Button"
            ],
            [
              "low",
              "组件处于正常页面流中，但应与背景区分开来。用于强调，或将组件与其背后的表面分隔开；组件仍位于页面上，并未浮在其他内容之上。",
              "需要强调的抬升 Card、ChatComposer"
            ],
            [
              "med",
              "组件位于同一页面上的其他内容之上；它浮在附近元素上方，但不会覆盖整个屏幕。",
              "Popover、浮动 Banner、浮动操作 Button"
            ],
            [
              "high",
              "组件覆盖整个 UI；它是最顶层，通常带有遮罩，或从其他所有内容中夺取焦点。",
              "模态 Dialog、全屏覆盖表面"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "如果两个表面重叠，位于上方的表面采用更高的级别。如果表面不与任何内容重叠，则为 `none` 或 `low`，绝不要使用 `med` 或 `high`。"
        }
      ]
    },
    {
      "section": "The elevation prop",
      "title": "elevation 属性",
      "content": [
        {
          "type": "prose",
          "text": "可配置表面提供单一的 `elevation` 属性，而不是让使用者手写 box-shadow。它接受分级枚举 `none | low | med | high`，并按组件收窄到该表面需要的档位：Card、ClickableCard、SelectableCard、Button、IconButton、ButtonGroup、ToggleButton 和 Banner 暴露完整刻度，而 ChatComposer 只暴露 `none | low`。`none` 是扁平字面量（`box-shadow: none`）；其他级别映射到上面的 `--shadow-*` 令牌，因此表面保持与主题无关。"
        },
        {
          "type": "prose",
          "text": "属性默认值保持当前外观：除 ChatComposer 外，每个表面都默认为 `none`；ChatComposer 默认为 `low`，以保持其抬升外观。设置 `elevation=\"none\"` 可将其压平；扁平化的输入框会绘制边框，并具有与文本输入框相同的静止/悬停/焦点处理。"
        },
        {
          "type": "code",
          "label": "使用 elevation 属性抬升表面"
        },
        {
          "type": "prose",
          "text": "始终浮动，无属性：固有浮层（Dialog、Popover、Tooltip、Toast、HoverCard、DropdownMenu 以及组合它们的组件）已将高度内置，永不暴露该属性。流式内容（输入框、Text、布局）从不具有高度；输入字段使用内嵌环，这是与高度分开的概念。"
        }
      ]
    },
    {
      "section": "Usage",
      "title": "用法",
      "content": [
        {
          "type": "prose",
          "text": "构建自定义表面时，请从令牌刻度中读取高度，而不是手动编写阴影；这些令牌与 elevation 属性解析到的令牌相同。"
        },
        {
          "type": "code",
          "label": "应用高度"
        }
      ]
    },
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "在编写任何自定义阴影之前，先考虑可配置表面上的 `elevation` 属性。",
            "根据表面距离页面的远近选择级别：扁平/嵌入时用 `none`，处于流中但需要区分时用 `low`，位于页面内容之上时用 `med`，覆盖整个 UI 时用 `high`。参见“选择级别”。",
            "输入框的焦点/选中状态请使用内嵌阴影；它们比轮廓线组合得更好。"
          ]
        },
        {
          "type": "list",
          "items": [
            "在应用代码中手写 `box-shadow`；应改为设置 `elevation` 属性或读取 `shadowVars`。",
            "抬升一个并不位于其他内容上方的表面；不重叠的表面是 `none` 或 `low`，绝不是 `med` 或 `high`。",
            "在同一元素上堆叠多个高度级别。",
            "将高度阴影用于装饰性边框。应改用 --color-border 令牌。"
          ]
        }
      ]
    }
  ]
};
