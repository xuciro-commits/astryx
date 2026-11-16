// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'SelectableCardGroup',
  displayName: 'Selectable Card Group',
  category: 'Form Controls',
  keywords: [
    'card',
    'selectable',
    'group',
    'radio',
    'radiogroup',
    'checkbox',
    'single choice',
    'multiple choice',
    'plan picker',
    'selection',
  ],
  description:
    'A set of selectable cards with the semantics of its selection. One choice (the default) is a radio group: the cards are native radios sharing one name, so the set is one tab stop, the arrow keys move and select, and screen readers speak the position ("2 of 3"). Several choices are a named group of checkboxes. Each SelectableCardGroupItem is a SelectableCard whose input, name and selection come from the group.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: "The group's visible label and accessible name.",
      required: true,
    },
    {
      name: 'selectionMode',
      type: "'single' | 'multiple'",
      description:
        '`single`: a radio group with one value. `multiple`: a group of checkboxes with any number of values.',
      default: "'single'",
    },
    {
      name: 'value',
      type: 'string | null | ReadonlyArray<string>',
      description:
        'The chosen value (`single`, `null` while none is chosen) or values (`multiple`).',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void | (value: string[]) => void',
      description:
        'Called with the chosen value (`single`) or the new list of values (`multiple`).',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Hides the label visually; it still names the group.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text under the label, linked to the group.',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        "The name the group's value is submitted under. The radios group by a generated name. Defaults to a generated one.",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables every card; they stay focusable and announce disabled.',
      default: 'false',
    },
    {
      name: 'orientation',
      type: "'horizontal' | 'vertical'",
      description:
        '`horizontal` wraps the cards in rows; `vertical` stacks them.',
      default: "'horizontal'",
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'SelectableCardGroupItem cards. Each takes a `value` and the SelectableCard props other than isSelected and onChange.',
      required: true,
    },
    {
      name: 'containerXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the Field box around the label, description and cards (margins, positioning, sizing). The group composes Field, so it takes no root xstyle, className or style.',
    },
    {
      name: 'containerClassName',
      type: 'string',
      description:
        'Class name for the Field box. Same targeting as containerXstyle.',
    },
    {
      name: 'containerStyle',
      type: 'CSSProperties',
      description:
        'Inline styles for the Field box. Same targeting as containerXstyle.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-selectable-card-group',
        visualProps: ['orientation', 'selectionMode'],
      },
    ],
  },
  usage: {
    description:
      'Use it for a choice among a few rich options shown as cards: a plan, an appearance, a layout. One choice gives users the radio-group keyboard and the position they expect; use `multiple` when several cards can be on.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give every card a `label` that names its option; it is the radio or checkbox name screen readers speak.',
      },
      {
        guidance: true,
        description:
          'Start a single choice with a value when the product has a sensible default, so the tab stop lands on it.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the cards; the whole card is the radio or checkbox target.',
      },
      {
        guidance: false,
        description:
          'Use it for navigation or actions; use ClickableCard for those.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "SelectableCardGroup",
  "displayName": "Selectable Card Group",
  "description": "一组可选卡片，带有其选择语义。一个选择（默认）是单选组：卡片是共享同一名称的原生单选按钮，因此该组是一个 Tab 停靠点，方向键移动并选择，屏幕阅读器会读出位置（\"2 of 3\"）。多个选择是命名的复选框组。每个 SelectableCardGroupItem 都是一个 SelectableCard，其 input、name 和选择状态来自该组。",
  "usage": {
    "description": "用于在几个以卡片呈现的丰富选项之间做选择：套餐、外观、布局。一个选择能带给用户预期的单选组键盘操作和位置；当多张卡片可以同时开启时使用 `multiple`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "给每张卡片一个命名其选项的 `label`；它是屏幕阅读器读出的单选按钮或复选框名称。"
      },
      {
        "guidance": true,
        "description": "当产品有合理默认值时，为单选初始化一个 value，使 Tab 停靠点落在它上面。"
      },
      {
        "guidance": false,
        "description": "将按钮或链接放在卡片内；整张卡片是单选按钮或复选框的目标。"
      },
      {
        "guidance": false,
        "description": "不要用它进行导航或操作；那些请使用 ClickableCard。"
      }
    ]
  },
  "propDescriptions": {
    "label": "组的可见标签和可访问名称。",
    "selectionMode": "`single`：带有单个值的单选组。`multiple`：可包含任意数量值的复选框组。",
    "value": "所选的值（`single`，未选择时为 `null`）或值列表（`multiple`）。",
    "onChange": "以所选值（`single`）或新的值列表（`multiple`）调用。",
    "isLabelHidden": "视觉隐藏标签；它仍会命名该组。",
    "description": "标签下方的辅助文本，与组关联。",
    "htmlName": "组的 value 提交时使用的名称。单选按钮按生成的名称分组。默认为生成的名称。",
    "isDisabled": "禁用每张卡片；它们仍可聚焦并宣布为禁用。",
    "orientation": "`horizontal` 将卡片按行排列；`vertical` 将它们堆叠。",
    "children": "SelectableCardGroupItem 卡片。每张接受 `value` 以及除 isSelected 和 onChange 之外的 SelectableCard 属性。",
    "containerXstyle": "围绕标签、描述和卡片的 Field 盒的 StyleX 样式（外边距、定位、尺寸）。该组组合了 Field，因此不接受根级 xstyle、className 或 style。",
    "containerClassName": "Field 盒的类名。定位方式与 containerXstyle 相同。",
    "containerStyle": "Field 盒的内联样式。定位方式与 containerXstyle 相同。"
  }
};
