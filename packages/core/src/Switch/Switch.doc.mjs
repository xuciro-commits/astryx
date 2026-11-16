// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Field',
    required: true,
    description: 'Container arranging the switch, label, and feedback.',
  },
  {
    name: 'Track',
    required: true,
    description: 'Pill-shaped surface that shows the off or on state.',
  },
  {
    name: 'Thumb',
    required: true,
    description: 'Indicator that moves across the track when state changes.',
  },
  {
    name: 'Label',
    required: true,
    description: 'Text identifying the setting controlled by the switch.',
  },
  {
    name: 'Description',
    required: false,
    description: 'Helper text below the label.',
  },
  {
    name: 'Spinner',
    required: false,
    description: 'Loading indicator shown inside the thumb while busy.',
  },
  {
    name: 'Status message',
    required: false,
    description: 'Error, warning, or success message below the switch.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Switch',
  playground: {
    defaults: {label: 'Notify my team', value: true},
  },
  displayName: 'Switch',
  category: 'Form Controls',
  keywords: [
    'switch',
    'toggle',
    'onoff',
    'flipswitch',
    'boolean',
    'toggleswitch',
  ],
  props: [
    {
      name: 'ref',
      type: 'React.Ref<HTMLInputElement>',
      description: 'Ref forwarded to the underlying <input> element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the switch (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'boolean',
      description: 'Whether the switch is on or off.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch state changes.',
    },
    {
      name: 'changeAction',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action fired after onChange. Triggers optimistic UI and shows a loading spinner until the promise resolves.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the switch is in a loading state, showing a spinner inside the thumb.',
      default: 'false',
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hides the label while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the switch is disabled.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description:
        'Size variant controlling track and thumb dimensions. sm (32x20px) matches sm checkbox/radio vertical rhythm; md (40x24px, default) matches md checkbox/radio vertical rhythm.',
      default: "'md'",
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the underlying checkbox input, useful for form submissions (submits "on" when the switch is on).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the switch is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the switch focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled Switch in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Whether the field is optional. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Whether the switch is required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator with type and message. Displays a colored message box below the switch and sets aria-invalid when type is "error".',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the switch loses focus.',
    },
    {
      name: 'labelIcon',
      type: 'IconType',
      description:
        'Icon displayed before the label text. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text shown in an info icon at the end of the label.',
    },
    {
      name: 'labelPosition',
      type: "'start' | 'end'",
      description:
        'Which side of the switch the label appears on. "start" places the label before the switch.',
      default: "'end'",
    },
    {
      name: 'labelSpacing',
      type: "'hug' | 'spread'",
      description:
        'Spacing behavior between label and switch. "hug" places them next to each other; "spread" pushes them to opposite ends of the container (full width).',
      default: "'hug'",
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-switch',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {
        className: 'astryx-switch-thumb',
        visualProps: ['size'],
        states: ['checked'],
      },
      {
        className: 'astryx-switch-field',
        visualProps: ['labelPosition', 'labelSpacing'],
      },
      {className: 'astryx-switch-label'},
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Track and thumb',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down'],
        description:
          'The on and off tracks must each have at least 3:1 contrast with the surface behind them, and the thumb with its track. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    anatomy,
    description:
      'A toggle control for on/off states that take effect immediately. Supports labels, descriptions, loading states, and validation. Use it for settings or preferences that apply instantly. For changes requiring a form submission, use a checkbox instead. Under a finger it moves like the iOS switch on every touch screen: a press lifts the thumb, a drag across flips it, lifting the finger commits, and a tap toggles through the browser’s click. The thumb keeps its circle and size on every device, and under a coarse pointer the invisible hit area grows toward 44 × 44 px, stopping halfway to any neighbouring control so a tap goes to the nearer one. With reduced motion on, a change cross-fades on a touch screen and is immediate with a mouse.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for settings that apply immediately; the toggle should take effect without a separate save action.',
      },
      {
        guidance: true,
        description:
          'Pair with a clear, concise label that describes the setting being controlled.',
      },
      {
        guidance: false,
        description:
          'Use for options that require a form submission to take effect; use a checkbox instead.',
      },
      {
        guidance: false,
        description:
          "Use a switch for multi-state values; it's strictly on/off.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Switch",
  "displayName": "Switch",
  "props": [
    {
      "name": "ref",
      "type": "React.Ref<HTMLInputElement>",
      "description": "转发到底层 <input> 元素的 ref。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "开关的标签文本（为无障碍始终渲染）。",
      "required": true
    },
    {
      "name": "value",
      "type": "boolean",
      "description": "开关处于开启还是关闭状态。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void",
      "description": "开关状态变化时触发的回调。"
    },
    {
      "name": "changeAction",
      "type": "(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>",
      "description": "在 onChange 之后触发的异步操作。触发乐观 UI，并显示加载指示器直到 Promise 解析。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "开关是否处于加载状态，在滑块内显示加载指示器。",
      "default": "false"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签，同时保持屏幕阅读器可访问。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签下方的描述文本。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "开关是否禁用。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "底层复选框输入的 HTML name 属性，适用于表单提交（开关开启时提交 \"on\"）。"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释开关为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持开关可聚焦（切换仍被阻止）。请使用此属性，而不是将禁用的 Switch 包裹在 Tooltip 中。禁用控件会吞掉外部 Tooltip 所需的悬停事件。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "字段是否可选。与 isRequired 互斥。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "开关是否必填。与 isOptional 互斥。",
      "default": "false"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "带类型和消息的状态指示器。在开关下方显示彩色消息框，并在 type 为 \"error\" 时设置 aria-invalid。"
    },
    {
      "name": "onFocus",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "开关获得焦点时触发的回调。"
    },
    {
      "name": "onBlur",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "开关失去焦点时触发的回调。"
    },
    {
      "name": "labelIcon",
      "type": "IconType",
      "description": "显示在标签文本前的图标。有效语义名称见 `astryx docs icons`。"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "在标签末尾信息图标中显示的工具提示文本。"
    },
    {
      "name": "labelPosition",
      "type": "'start' | 'end'",
      "description": "标签显示在开关的哪一侧。\"start\" 将标签放在开关之前。",
      "default": "'end'"
    },
    {
      "name": "labelSpacing",
      "type": "'hug' | 'spread'",
      "description": "标签与开关之间的间距行为。\"hug\" 将它们紧挨放置；\"spread\" 将它们推向容器的两端（全宽）。",
      "default": "'hug'"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-switch",
        "visualProps": [
          "size"
        ],
        "states": [
          "checked",
          "disabled"
        ]
      },
      {
        "className": "astryx-switch-thumb",
        "visualProps": [
          "size"
        ],
        "states": [
          "checked"
        ]
      },
      {
        "className": "astryx-switch-field",
        "visualProps": [
          "labelPosition",
          "labelSpacing"
        ]
      },
      {
        "className": "astryx-switch-label"
      }
    ]
  },
  "usage": {
    "description": "用于立即生效的开关控件。支持标签、描述、加载状态和校验。用于立即应用的设置或偏好。需要提交表单才生效的更改请改用复选框。手指操作时，它在所有触摸屏上都像 iOS 开关一样移动：按压会抬起滑块，横向拖动能翻转它，抬起手指即提交，点击则通过浏览器的 click 切换。滑块在所有设备上都保持圆形和尺寸不变，在粗指针下，不可见的命中区域会增大到接近 44 × 44 px，并在接近相邻控件时停在半途，因此点击会落到更近的那个控件上。开启减少动态效果时，触摸屏上的变化会交叉淡化，鼠标操作则即时生效。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于立即应用的设置；开关应在没有单独保存操作的情况下生效。"
      },
      {
        "guidance": true,
        "description": "搭配清晰简洁的标签，说明所控制的设置。"
      },
      {
        "guidance": false,
        "description": "用于需要提交表单才能生效的选项；请改用复选框。"
      },
      {
        "guidance": false,
        "description": "将开关用于多状态值；它严格只有开/关。"
      },
      {
        "guidance": false,
        "description": "将禁用开关包裹在 Tooltip 中来解释禁用原因；禁用控件会吞掉包装器所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "accessibility": [
      {
        "name": "轨道和滑块",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "静止",
          "悬停",
          "指针按下"
        ],
        "description": "开启和关闭的轨道分别与背后表面之间必须至少有 3:1 的对比度，滑块与其轨道之间也是如此。对于悬停和指针按下，请测量应用色调和按下叠加层后的最终颜色。"
      }
    ],
    "anatomy": [
      {
        "name": "字段",
        "required": true,
        "description": "排列开关、标签和反馈的容器。"
      },
      {
        "name": "轨道",
        "required": true,
        "description": "显示关闭或开启状态的胶囊形表面。"
      },
      {
        "name": "滑块",
        "required": true,
        "description": "状态变化时沿轨道移动的指示器。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "标识开关所控制设置的文本。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标签下方的辅助文本。"
      },
      {
        "name": "加载指示器",
        "required": false,
        "description": "忙碌时显示在滑块内的加载指示器。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "开关下方的错误、警告或成功消息。"
      }
    ]
  },
  "propDescriptions": {
    "ref": "转发到底层 <input> 元素的 ref。",
    "label": "开关的标签文本（为无障碍始终渲染）。",
    "value": "开关处于开启还是关闭状态。",
    "onChange": "开关状态变化时触发的回调。",
    "changeAction": "在 onChange 之后触发的异步操作。触发乐观 UI，并显示加载指示器直到 Promise 解析。",
    "isLoading": "开关是否处于加载状态，在滑块内显示加载指示器。",
    "isLabelHidden": "在视觉上隐藏标签，同时保持屏幕阅读器可访问。",
    "description": "显示在标签下方的描述文本。",
    "isDisabled": "开关是否禁用。",
    "size": "控制轨道和滑块尺寸的尺寸变体。sm（32x20px）匹配 sm 复选框/单选按钮的垂直节奏；md（40x24px，默认）匹配 md 复选框/单选按钮的垂直节奏。",
    "htmlName": "底层复选框输入的 HTML name 属性，适用于表单提交（开关开启时提交 \"on\"）。",
    "disabledMessage": "解释开关为何被禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持开关可聚焦（切换仍被阻止）。请使用此属性，而不是将禁用的 Switch 包裹在 Tooltip 中。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isOptional": "字段是否可选。与 isRequired 互斥。",
    "isRequired": "开关是否必填。与 isOptional 互斥。",
    "status": "带类型和消息的状态指示器。在开关下方显示彩色消息框，并在 type 为 \"error\" 时设置 aria-invalid。",
    "onFocus": "开关获得焦点时触发的回调。",
    "onBlur": "开关失去焦点时触发的回调。",
    "labelIcon": "显示在标签文本前的图标。有效语义名称见 `astryx docs icons`。",
    "labelTooltip": "在标签末尾信息图标中显示的工具提示文本。",
    "labelPosition": "标签显示在开关的哪一侧。\"start\" 将标签放在开关之前。",
    "labelSpacing": "标签与开关之间的间距行为。\"hug\" 将它们紧挨放置；\"spread\" 将它们推向容器的两端（全宽）。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。会调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Toggle switch for boolean values w/ integrated label support.',
  usage: {
    description:
      'A toggle control for on/off states that take effect immediately. Supports labels, descriptions, loading states, and validation. Use it for settings or preferences that apply instantly. For changes requiring a form submission, use a checkbox instead. Under a finger it moves like the iOS switch on every touch screen: a press lifts the thumb, a drag across flips it, lifting the finger commits, and a tap toggles through the browser’s click. The thumb keeps its circle and size on every device, and under a coarse pointer the invisible hit area grows toward 44 × 44 px, stopping halfway to any neighbouring control so a tap goes to the nearer one. With reduced motion on, a change cross-fades on a touch screen and is immediate with a mouse.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for settings that apply immediately; the toggle should take effect without a separate save action.',
      },
      {
        guidance: true,
        description:
          'Pair with a clear, concise label that describes the setting being controlled.',
      },
      {
        guidance: false,
        description:
          'Use for options that require a form submission to take effect; use a checkbox instead.',
      },
      {
        guidance: false,
        description:
          "Use a switch for multi-state values; it's strictly on/off.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled switch in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    ref: 'ref forwarded to underlying <input>',
    label: 'Label text (always rendered for a11y).',
    value: 'Whether switch is on or off.',
    onChange: 'Fired when switch state changes.',
    changeAction:
      'Async action after onChange; triggers optimistic UI + loading spinner until resolved.',
    isLoading: 'Loading state; shows spinner in thumb.',
    isLabelHidden: 'Visually hides label; still accessible to screen readers.',
    description: 'Description text below label.',
    isDisabled: 'Whether switch is disabled.',
    htmlName: 'HTML name attr for the checkbox; submits "on" when on.',
    isOptional: 'Whether field is optional; mutually exclusive w/ isRequired.',
    isRequired: 'Whether switch is required; mutually exclusive w/ isOptional.',
    status:
      'Status indicator w/ type + message; colored message box, sets aria-invalid on error.',
    onFocus: 'Fired when switch receives focus.',
    onBlur: 'Fired when switch loses focus.',
    labelIcon: 'Icon before label text.',
    labelTooltip: 'Tooltip text in info icon at label end.',
    labelPosition: 'Which side label appears; "start" places before switch.',
    labelSpacing:
      'Spacing behavior; "hug" places next to each other, "spread" pushes to opposite ends (full width).',
  },
};
