// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'RadioList',
  displayName: 'Radio List',
  group: 'Radio',
  category: 'Form Controls',
  keywords: [
    'radiolist',
    'radio',
    'radiogroup',
    'radiobutton',
    'optionlist',
    'singlechoice',
    'choicelist',
  ],
  theming: {
    targets: [
      {className: 'astryx-radio-list', visualProps: ['orientation', 'size']},
      {
        className: 'astryx-radio-list-item',
        visualProps: ['size'],
        states: ['selected', 'disabled'],
      },
      {
        className: 'astryx-radio-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'astryx-radio-indicator-dot', visualProps: ['size']},
    ],
  },
  description:
    'Radio group container with field integration for label, description, and status.',
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the radio group (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'string',
      description: 'The currently selected value.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: string) => void',
      description: 'Callback fired when the selected value changes.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'RadioListItem elements.',
      slotElements: [
        {
          __element: 'RadioListItem',
          props: {
            label: 'Option',
            value: 'option',
          },
        },
      ],
      required: true,
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
      name: 'orientation',
      type: "'vertical' | 'horizontal'",
      description: 'Layout direction of the radio items.',
      default: "'vertical'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether all radio items are disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute shared by the radio inputs, useful for form submissions. When omitted, a unique internal name still groups the radios.',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the group is disabled. Applies to the whole-group disabled state (isDisabled), not per item. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the radios focusable via aria-disabled (selection stays blocked). Use this instead of wrapping a disabled RadioList in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Whether the radio group is required.',
      default: 'false',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Whether the field is optional (mutually exclusive with isRequired).',
      default: 'false',
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator ({ type, message }).',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Size of the radio controls.',
      default: "'md'",
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description: 'Tooltip text for an info icon next to the label.',
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
  components: [{name: 'RadioListItem'}],
  usage: {
    accessibility: [
      {
        name: 'Radio circle',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Selected'],
        description:
          'The circle edge (unselected) and fill (selected) must have at least 3:1 contrast with the surface behind them. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    description:
      'A group of options where only one can be selected at a time. All options are visible at once, making it easy to compare choices. Use it when users need to pick one option from a small set.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the number of options small: typically 2 to 7 choices.',
      },
      {
        guidance: true,
        description:
          'Use clear, concise labels that differentiate each option at a glance.',
      },
      {
        guidance: true,
        description:
          "Pre-select a default option when there's a sensible default; don't leave the group empty unless the choice is optional.",
      },
      {
        guidance: false,
        description:
          'Use when multiple selections are needed; use CheckboxList instead.',
      },
      {
        guidance: false,
        description:
          'Use for long lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description:
          'Use horizontal layout with more than 4 options; it wraps awkwardly.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Header',
        required: false,
        description: 'Optional heading above the radio list.',
      },
      {
        name: 'Children',
        required: true,
        description: 'The radio list items rendered as selectable options.',
      },
      {
        name: 'Label/Value',
        required: true,
        description: 'The text label and associated value for each radio item.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "一组选项，同一时间只能选择一个。所有选项同时可见，便于比较选择。当用户需要从一小组选项中挑选一个时使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持选项数量较少：通常为 2 到 7 个选择。"
      },
      {
        "guidance": true,
        "description": "使用清晰、简洁的标签，让每个选项一眼就能区分。"
      },
      {
        "guidance": true,
        "description": "如果有合理的默认值，预先选择一个默认选项；除非选择是可选的，否则不要让组为空。"
      },
      {
        "guidance": false,
        "description": "不要用于需要多选的情况；请改用 CheckboxList。"
      },
      {
        "guidance": false,
        "description": "不要用于长列表；请改用 Selector 以获得更好的可发现性。"
      },
      {
        "guidance": false,
        "description": "不要在选项超过 4 个时使用水平布局；它会换行得不自然。"
      },
      {
        "guidance": false,
        "description": "不要将禁用的 RadioList 包裹在 Tooltip 中以解释禁用原因；禁用控件会吞掉包装器所需的悬停事件。请改用 disabledMessage 属性。"
      }
    ],
    "anatomy": [
      {
        "name": "页眉",
        "required": false,
        "description": "单选列表上方的可选标题。"
      },
      {
        "name": "子元素",
        "required": true,
        "description": "作为可选选项渲染的单选列表项。"
      },
      {
        "name": "标签/值",
        "required": true,
        "description": "每个单选列表项的文字标签及关联值。"
      }
    ],
    "accessibility": [
      {
        "name": "单选圆点",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "静止",
          "悬停",
          "指针按下",
          "已选中"
        ],
        "description": "圆点边缘（未选中）和填充（选中）与背后表面的对比度至少为 3:1。对于悬停和指针按下状态，请测量应用色调和按下覆盖层后的最终颜色。"
      }
    ]
  },
  "name": "RadioList",
  "displayName": "Radio List",
  "description": "单选组容器，集成字段功能以提供标签、描述和状态。",
  "propDescriptions": {
    "label": "单选组的标签文本（为无障碍始终渲染）。",
    "value": "当前选中的值。",
    "onChange": "选中值变化时触发的回调。",
    "children": "RadioListItem 元素。",
    "isLabelHidden": "是否在视觉上隐藏标签。",
    "description": "显示在标签下方的描述文本。",
    "orientation": "单选项的布局方向。",
    "isDisabled": "是否禁用所有单选项。",
    "htmlName": "单选输入共享的 HTML name 属性，便于表单提交。省略时，唯一的内部名称仍会将单选按钮分组。",
    "disabledMessage": "解释组被禁用的原因。适用于整组禁用状态（isDisabled），而非单个选项。配合 isDisabled 使用时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持单选按钮可聚焦（选择仍被阻止）。请使用此项，而不是将禁用的 RadioList 包裹在 Tooltip 中。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isRequired": "单选组是否必填。",
    "isOptional": "字段是否可选（与 isRequired 互斥）。",
    "status": "状态指示器（{ type, message }）。",
    "size": "单选控件的尺寸。",
    "labelTooltip": "标签旁信息图标的工具提示文本。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。会调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "containerXstyle": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内（请改为设置 InputGroup 样式）或 `horizontal-labels` FormLayout 中无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。作用范围与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。作用范围与 `containerXstyle` 相同。",
    "controlXstyle": "视觉控件框的 StyleX 样式：绘制边框和背景并容纳图标和末端控件的元素。绝不是原生 input。",
    "controlClassName": "视觉控件框的类名。",
    "controlStyle": "视觉控件框的内联样式。"
  },
  "components": [
    {
      "name": "RadioListItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Radio group component for single-value selection from list of options.',
  usage: {
    description:
      'A group of options where only one can be selected at a time. All options are visible at once, making it easy to compare choices. Use it when users need to pick one option from a small set.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the number of options small: typically 2 to 7 choices.',
      },
      {
        guidance: true,
        description:
          'Use clear, concise labels that differentiate each option at a glance.',
      },
      {
        guidance: true,
        description:
          "Pre-select a default option when there's a sensible default; don't leave the group empty unless the choice is optional.",
      },
      {
        guidance: false,
        description:
          'Use when multiple selections are needed; use CheckboxList instead.',
      },
      {
        guidance: false,
        description:
          'Use for long lists; use Selector for better discoverability.',
      },
      {
        guidance: false,
        description:
          'Use horizontal layout with more than 4 options; it wraps awkwardly.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled RadioList in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Header',
        required: false,
        description: 'Optional heading above the radio list.',
      },
      {
        name: 'Children',
        required: true,
        description: 'The radio list items rendered as selectable options.',
      },
      {
        name: 'Label/Value',
        required: true,
        description: 'The text label and associated value for each radio item.',
      },
    ],
  },
};
