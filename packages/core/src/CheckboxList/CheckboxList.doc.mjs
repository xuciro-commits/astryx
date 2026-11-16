// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Group',
    required: true,
    description: 'Container for the labeled checkbox group.',
  },
  {
    name: 'Group label',
    required: true,
    description: 'Text identifying what the checkbox options represent.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text below the group label.',
  },
  {
    name: 'Options list',
    required: true,
    description: 'List containing the available checkbox options.',
  },
  {
    name: 'Option row',
    required: true,
    description: 'Selectable row containing one option.',
  },
  {
    name: 'Checkbox',
    required: true,
    description: 'Selection indicator for an option.',
  },
  {
    name: 'Option label',
    required: true,
    description: 'Primary content identifying an option.',
  },
  {
    name: 'Option description',
    required: false,
    description: 'Secondary text below an option label.',
  },
  {
    name: 'End content',
    required: false,
    description: 'Caller-provided content at the end of an option row.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown inside the pending checkbox.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the group.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CheckboxList',
  displayName: 'Checkbox List',
  group: 'Checkbox',
  category: 'Form Controls',
  isHiddenFromOverview: true,
  keywords: [
    'checkboxlist',
    'checkbox',
    'checkboxgroup',
    'multichoice',
    'multiselect',
    'checklist',
  ],
  description:
    'Checkbox group container with field integration for label, description, and status.',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the checkbox group (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'CheckboxListItem elements.',
      slotElements: [
        {
          __element: 'CheckboxListItem',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
      required: true,
    },
    {
      name: 'value',
      type: 'string[]',
      description: 'The currently selected values (collection mode).',
    },
    {
      name: 'onChange',
      type: '(values: string[]) => void',
      description: 'Callback fired when the selected values change.',
    },
    {
      name: 'changeAction',
      type: '(values: string[]) => void | Promise<void>',
      description:
        'Async action on change with optimistic updates. While the promise is pending, the toggled item shows a spinner inside its checkbox and is marked aria-busy.',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Whether to visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Whether the group is optional. Shows the optional indicator after the group label, unless a surrounding FormLayout already makes fields optional by default.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Whether the group needs at least one checked box. Shows the required indicator after the group label by the same rules as every input field. While no box is checked, the browser blocks submit and moves focus to the first box that is neither disabled nor read-only, with its own message. A disabled or read-only group requires nothing. Show your own error text through status. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Spacing density for list items.',
      default: "'balanced'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Whether to show dividers between items.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether all checkbox items are disabled.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the group is disabled. Applies to the whole-group disabled state (isDisabled), not per item. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the checkboxes focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled CheckboxList in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Whether all checkbox items are read-only. Displays the current state at full opacity but prevents interaction. Unlike isDisabled, read-only checkboxes are not visually dimmed.',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator ({ type, message }).',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'containerXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the field container (label, control, and status together). No effect inside InputGroup (style the InputGroup instead) or in a `horizontal-labels` FormLayout. Root `xstyle`, `className`, and `style` are not accepted.',
    },
    {
      name: 'containerClassName',
      type: 'string',
      description:
        'Class name for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'containerStyle',
      type: 'CSSProperties',
      description:
        'Inline styles for the field container. Same targeting as `containerXstyle`.',
    },
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the visual control box: the element that paints the border and background and holds icons and end controls. Never the native input.',
    },
    {
      name: 'controlClassName',
      type: 'string',
      description: 'Class name for the visual control box.',
    },
    {
      name: 'controlStyle',
      type: 'CSSProperties',
      description: 'Inline styles for the visual control box.',
    },
  ],
  components: [{name: 'CheckboxListItem'}],
  usage: {
    anatomy,
    description:
      'CheckboxList shows a small group of checkboxes so users can turn several options on or off at once. Place it in settings pages, filter panels, or forms where every choice should be visible without scrolling. For a single standalone checkbox (like "I agree to the terms"), use CheckboxInput instead. If only one option can be picked, use RadioList. If the list is long enough to need searching or scrolling, use MultiSelector instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the list short: three to seven options is the sweet spot. Beyond that, switch to MultiSelector which adds search and scrolling.',
      },
      {
        guidance: true,
        description:
          'Turn on dividers (hasDividers) when items have helper text underneath; without them the labels and descriptions blur together.',
      },
      {
        guidance: true,
        description:
          'Write a group label that says what the choices represent: "Export formats" tells users more than "Options".',
      },
      {
        guidance: false,
        description:
          'Show a CheckboxList when the user can only pick one thing; that is what RadioList is for.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the trailing slot (endContent); the whole row is already tappable, so a nested button creates two competing click targets.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled CheckboxList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  theming: {
    targets: [{className: 'astryx-checkbox-list'}],
    vars: [
      {
        name: '--_checkbox-row-press-paint',
        description:
          "The press paint a row that owns its checkbox's press hands that checkbox's box: none at rest, and the press paint at the press's strength while the press controller presses that row, for every pointer. Set on the row by its own press arms; the box reads its nearest row's value, so a list placed in a row's content keeps its own rows' paint.",
        default: 'none',
        private: true,
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "CheckboxList 显示一小组复选框，让用户一次开启或关闭多个选项。可将其放在设置页、筛选面板或表单中，适合每个选项都应无需滚动即可看到的情况。单个独立复选框（例如“我同意条款”）请改用 CheckboxInput。如果只能选择一个选项，请使用 RadioList。如果列表较长、需要搜索或滚动，请改用 MultiSelector。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持列表简短：三到七个选项最为合适。超过此数量时，请改用带搜索和滚动功能的 MultiSelector。"
      },
      {
        "guidance": true,
        "description": "当各项下方带有辅助文本时，请开启分隔线（hasDividers）；否则标签和描述会混在一起。"
      },
      {
        "guidance": true,
        "description": "编写能说明选项含义的组标签：“导出格式”比“选项”更能让用户理解。"
      },
      {
        "guidance": false,
        "description": "不要在用户只能选择一项时显示 CheckboxList；那正是 RadioList 的用途。"
      },
      {
        "guidance": false,
        "description": "不要将按钮或链接放入尾部插槽（endContent）；整行已经可点击，嵌套按钮会形成两个相互竞争的点击目标。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 CheckboxList 来解释禁用原因；禁用控件会吞掉包裹层所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "组",
        "required": true,
        "description": "带标签的复选框组的容器。"
      },
      {
        "name": "组标签",
        "required": true,
        "description": "说明复选框选项含义的文本。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "组标签下方的辅助文本。"
      },
      {
        "name": "选项列表",
        "required": true,
        "description": "包含可用复选框选项的列表。"
      },
      {
        "name": "选项行",
        "required": true,
        "description": "包含一个选项的可选择行。"
      },
      {
        "name": "复选框",
        "required": true,
        "description": "选项的选择指示器。"
      },
      {
        "name": "选项标签",
        "required": true,
        "description": "标识选项的主要内容。"
      },
      {
        "name": "选项描述",
        "required": false,
        "description": "选项标签下方的辅助文本。"
      },
      {
        "name": "末端内容",
        "required": false,
        "description": "选项行末尾由调用方提供的内容。"
      },
      {
        "name": "Spinner 加载指示器",
        "required": false,
        "description": "显示在待处理复选框内部的加载指示器。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "组下方的错误、警告或成功消息。"
      }
    ]
  },
  "name": "CheckboxList",
  "displayName": "Checkbox List",
  "description": "复选框组容器，集成了 label、description 和 status 的字段功能。",
  "propDescriptions": {
    "label": "复选框组的标签文本（始终为无障碍而渲染）。",
    "children": "CheckboxListItem 元素。",
    "value": "当前选中的值（集合模式）。",
    "onChange": "选中值变化时触发的回调。",
    "changeAction": "变更时执行的异步操作，带乐观更新。Promise 挂起期间，被切换的项会在其复选框内显示加载指示器，并标记为 aria-busy。",
    "isLabelHidden": "是否在视觉上隐藏标签。",
    "description": "显示在标签下方的描述文本。",
    "isOptional": "该组是否可选。会在组标签后显示可选指示器，除非外层 FormLayout 已默认将字段设为可选。",
    "isRequired": "该组是否至少需要勾选一个复选框。会按照与所有输入字段相同的规则在组标签后显示必填指示器。未勾选任何复选框时，浏览器会阻止提交并将焦点移到第一个既未禁用也非只读的复选框，并显示其自带消息。禁用或只读的组不要求任何内容。请通过 status 显示自定义错误文本。与 isOptional 互斥。",
    "density": "列表项的间距密度。",
    "hasDividers": "是否在各项之间显示分隔线。",
    "isDisabled": "是否禁用所有复选框项。",
    "disabledMessage": "说明该组为何被禁用。适用于整组禁用状态（isDisabled），而非单个项。与 isDisabled 一起使用时，会在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持复选框可聚焦（切换仍会被阻止）。请使用此属性，而不是用 Tooltip 包裹禁用的 CheckboxList。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isReadOnly": "是否将所有复选框项设为只读。会以完全不透明显示当前状态，但阻止交互。与 isDisabled 不同，只读复选框不会在视觉上变暗。",
    "status": "状态指示器（{ type, message }）。",
    "width": "字段宽度（数字表示像素，字符串按原样使用，例如 \"100%\"）。会设置整个字段（标签、控件和状态）的尺寸，使其保持对齐。",
    "containerXstyle": "用于字段容器（标签、控件和状态整体）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 的样式），在 `horizontal-labels` FormLayout 中也无效。根级的 `xstyle`、`className` 和 `style` 不被接受。",
    "containerClassName": "字段容器的类名。作用目标与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。作用目标与 `containerXstyle` 相同。",
    "controlXstyle": "用于视觉控件框的 StyleX 样式：该元素绘制边框和背景，并容纳图标和末端控件。绝不是原生 input。",
    "controlClassName": "视觉控件框的类名。",
    "controlStyle": "视觉控件框的内联样式。"
  },
  "components": [
    {
      "name": "CheckboxListItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Checkbox group component for multi-value selection. Collection mode (parent state) + standalone mode (per-item state).',
  usage: {
    description:
      'CheckboxList shows a small group of checkboxes so users can turn several options on or off at once. Place it in settings pages, filter panels, or forms where every choice should be visible without scrolling. For a single standalone checkbox (like "I agree to the terms"), use CheckboxInput instead. If only one option can be picked, use RadioList. If the list is long enough to need searching or scrolling, use MultiSelector instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the list short: three to seven options is the sweet spot. Beyond that, switch to MultiSelector which adds search and scrolling.',
      },
      {
        guidance: true,
        description:
          'Turn on dividers (hasDividers) when items have helper text underneath; without them the labels and descriptions blur together.',
      },
      {
        guidance: true,
        description:
          'Write a group label that says what the choices represent: "Export formats" tells users more than "Options".',
      },
      {
        guidance: false,
        description:
          'Show a CheckboxList when the user can only pick one thing; that is what RadioList is for.',
      },
      {
        guidance: false,
        description:
          'Put buttons or links inside the trailing slot (endContent); the whole row is already tappable, so a nested button creates two competing click targets.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled CheckboxList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};
