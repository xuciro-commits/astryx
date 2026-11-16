// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'CheckboxInput',
  playground: {
    defaults: {label: 'Add to calendar', value: true},
  },
  displayName: 'Checkbox Input',
  group: 'Checkbox',
  category: 'Form Controls',
  keywords: [
    'checkbox',
    'check',
    'toggle',
    'tick',
    'indeterminate',
    'boolean',
    'tristate',
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
        'Label text for the checkbox (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Whether to visually hide the label (still accessible to screen readers).',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed below the label.',
    },
    {
      name: 'value',
      type: "boolean | 'indeterminate'",
      description:
        'Whether the checkbox is checked, unchecked, or indeterminate.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox state changes.',
    },
    {
      name: 'changeAction',
      type: '(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>',
      description:
        'Async action on change. Fires after onChange if not prevented. Shows loading spinner while pending.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the checkbox is in a loading state. Shows spinner and prevents interaction.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the checkbox is disabled.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'The HTML name attribute for the underlying checkbox input, useful for form submissions (submits "on" when checked).',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the checkbox is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the checkbox focusable via aria-disabled (toggling stays blocked). Use this instead of wrapping a disabled CheckboxInput in Tooltip. Disabled controls swallow the hover events an external Tooltip needs.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Whether the checkbox is read-only. Displays the current state at full opacity but prevents interaction. Unlike `isDisabled`, read-only checkboxes are not visually dimmed.',
      default: 'false',
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
        'Whether the checkbox is required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description:
        'The size of the checkbox. sm for compact layouts, md for default. Under a coarse pointer a labelled checkbox’s target grows toward 44 px through an invisible hit area. It never shrinks below the row and stops at half the gap to a closer neighbour; nothing changes size.',
      default: "'md'",
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the checkbox loses focus.',
    },
    {
      name: 'labelIcon',
      type: 'ReactNode | IconType',
      description:
        'Semantic icon name or custom content displayed before the label text. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'status',
      type: "{ type: 'error' | 'warning' | 'success', message: string }",
      description:
        'Status indicator. Displays a colored message box below the checkbox and sets aria-invalid for errors.',
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
      {className: 'astryx-checkbox-input', visualProps: ['size']},
      {
        className: 'astryx-checkbox-indicator',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'astryx-checkbox-label'},
    ],
    vars: [
      {
        name: '--_indicator-press-image',
        description:
          "The row's press image, handed down to a first-party indicator that paints its own press. Set from the press paint only while the row itself is pressed, or, under a CheckboxList row that owns the press, from that row's press paint. Only this row declares it.",
        default: 'none',
        private: true,
      },
      {
        name: '--_indicator-active-press',
        description:
          "Transparent while the press controller paints the row's press, and always under a CheckboxList row that owns the press, so a first-party indicator that paints its own press draws no `:active` fill under the press image. Only this row declares it.",
        default: 'var(--color-overlay-pressed)',
        private: true,
      },
    ],
  },
  usage: {
    accessibility: [
      {
        name: 'Checkbox box',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1',
        states: ['Rest', 'Hover', 'Pointer down', 'Checked'],
        description:
          'The box edge (unchecked) and fill (checked) must have at least 3:1 contrast with the surface behind them. For Hover and Pointer down, measure the final colors after the tint and the pressed overlay are applied.',
      },
    ],
    description:
      'CheckboxInput toggles a single on/off value. Use it for settings like "Enable notifications", terms acceptance, or opt-in choices. For multiple checkboxes in a group, use CheckboxList instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Always provide a visible label so the user knows what they are toggling. Use isLabelHidden only when surrounding context makes it obvious.',
      },
      {
        guidance: true,
        description:
          'Add a description for choices that need extra context, like explaining what "Share usage data" actually shares.',
      },
      {
        guidance: true,
        description:
          'Use the indeterminate state for "select all" checkboxes when only some items in a group are selected.',
      },
      {
        guidance: false,
        description:
          'Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected.',
      },
      {
        guidance: false,
        description:
          'Use a checkbox for actions that take effect immediately; use a toggle switch or button instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
    anatomy: [
      {
        name: 'Checkbox',
        required: true,
        description:
          'The check box itself: unchecked, checked, or indeterminate.',
      },
      {
        name: 'Label',
        required: true,
        description:
          'Text describing what the checkbox controls. Always present for accessibility.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Helper text below the label with additional context.',
      },
      {
        name: 'Status message',
        required: false,
        description:
          'An error, warning, or success message below the checkbox.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "CheckboxInput",
  "displayName": "Checkbox Input",
  "usage": {
    "description": "CheckboxInput 用于切换单个开/关值。适用于“启用通知”、接受条款或选择加入等设置。若一组中有多个复选框，请改用 CheckboxList。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "始终提供可见标签，让用户知道自己正在切换什么。仅当周围上下文已足够明确时才使用 `isLabelHidden`。"
      },
      {
        "guidance": true,
        "description": "为需要额外说明的选项添加描述，例如解释“共享使用数据”究竟会共享哪些内容。"
      },
      {
        "guidance": true,
        "description": "当一组中只有部分项目被选中时，为“全选”复选框使用不确定（indeterminate）状态。"
      },
      {
        "guidance": false,
        "description": "不要用复选框表示互斥选择；当只能选择一个选项时，请使用 RadioList。"
      },
      {
        "guidance": false,
        "description": "不要用复选框表示立即生效的操作；请改用开关（toggle switch）或按钮。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的复选框来解释其禁用原因；禁用控件会吞掉包裹层所需的悬停事件。请改用 `disabledMessage` 属性。"
      }
    ],
    "accessibility": [
      {
        "name": "复选框方框",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1",
        "states": [
          "静止",
          "悬停",
          "指针按下",
          "选中"
        ],
        "description": "方框边缘（未选中）和填充（选中）与背后表面之间必须至少有 3:1 的对比度。对于悬停（Hover）和指针按下（Pointer down），请测量应用色调与按下叠加层后的最终颜色。"
      }
    ],
    "anatomy": [
      {
        "name": "复选框",
        "required": true,
        "description": "复选框本身：未选中、已选中或不确定。"
      },
      {
        "name": "标签",
        "required": true,
        "description": "描述复选框所控制内容的文本。为满足无障碍要求，始终存在。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "位于标签下方、提供额外上下文的辅助文本。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "位于复选框下方的错误、警告或成功消息。"
      }
    ]
  },
  "props": [
    {
      "name": "ref",
      "type": "React.Ref<HTMLInputElement>",
      "description": "转发到底层 `<input>` 元素的 ref。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "复选框的标签文本（为满足无障碍要求始终渲染）。",
      "required": true
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "是否在视觉上隐藏标签（屏幕阅读器仍可访问）。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签下方的描述文本。"
    },
    {
      "name": "value",
      "type": "boolean | 'indeterminate'",
      "description": "复选框是选中、未选中还是不确定状态。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void",
      "description": "复选框状态变化时触发的回调。"
    },
    {
      "name": "changeAction",
      "type": "(checked: boolean, e: ChangeEvent<HTMLInputElement>) => void | Promise<void>",
      "description": "变更时执行的异步操作。若未被阻止，会在 onChange 之后触发。等待期间显示加载旋转图标。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "复选框是否处于加载状态。显示旋转图标并阻止交互。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "复选框是否被禁用。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "底层复选框输入的 HTML name 属性，适用于表单提交（选中时提交 \"on\"）。"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释复选框为何被禁用。与 `isDisabled` 一起使用时，在悬停/键盘聚焦时显示提示，并通过 `aria-disabled` 保持复选框可聚焦（切换仍会被阻止）。请使用此属性，而不要用 Tooltip 包裹禁用的 CheckboxInput。禁用控件会吞掉外部 Tooltip 所需的悬停事件。"
    },
    {
      "name": "isReadOnly",
      "type": "boolean",
      "description": "复选框是否为只读。以完全不透明度显示当前状态，但阻止交互。与 `isDisabled` 不同，只读复选框不会在视觉上变暗。",
      "default": "false"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "该字段是否为可选。与 `isRequired` 互斥。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "复选框是否为必填。与 `isOptional` 互斥。",
      "default": "false"
    },
    {
      "name": "size",
      "type": "'sm' | 'md'",
      "description": "复选框的尺寸。`sm` 用于紧凑布局，`md` 为默认值。在粗指针设备上，带标签复选框的点击目标会通过不可见的命中区域扩展到接近 44 px。该区域不会缩小到小于所在行，且在与更近邻居的间距一半处停止；视觉尺寸保持不变。",
      "default": "'md'"
    },
    {
      "name": "onFocus",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "复选框获得焦点时触发的回调。"
    },
    {
      "name": "onBlur",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "复选框失去焦点时触发的回调。"
    },
    {
      "name": "labelIcon",
      "type": "ReactNode | IconType",
      "description": "显示在标签文本之前的语义图标名称或自定义内容。有效语义名称请参阅 `astryx docs icons`。"
    },
    {
      "name": "status",
      "type": "{ type: 'error' | 'warning' | 'success', message: string }",
      "description": "状态指示器。在复选框下方显示带颜色的消息框，并在出错时设置 `aria-invalid`。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-checkbox-input",
        "visualProps": [
          "size"
        ]
      },
      {
        "className": "astryx-checkbox-indicator",
        "visualProps": [
          "size"
        ],
        "states": [
          "checked",
          "disabled"
        ]
      },
      {
        "className": "astryx-checkbox-label"
      }
    ],
    "vars": [
      {
        "name": "--_indicator-press-image",
        "description": "复选框行的按下图像，传递给自行绘制按下效果的第一方指示器。仅在该行自身被按下时根据按下涂层设置；在拥有按下效果的 CheckboxList 行中，取该行的按下涂层。只有该行声明它。",
        "default": "none",
        "private": true
      },
      {
        "name": "--_indicator-active-press",
        "description": "按下控制器绘制该行的按下效果时为透明；在拥有按下效果的 CheckboxList 行中始终为透明。因此自行绘制按下效果的第一方指示器不会在按下图像下方再绘制 `:active` 填充。只有该行声明它。",
        "default": "var(--color-overlay-pressed)",
        "private": true
      }
    ]
  },
  "propDescriptions": {
    "ref": "转发到底层 `<input>` 元素的 ref。",
    "label": "复选框的标签文本（为满足无障碍要求始终渲染）。",
    "isLabelHidden": "是否在视觉上隐藏标签（屏幕阅读器仍可访问）。",
    "description": "显示在标签下方的描述文本。",
    "value": "复选框是选中、未选中还是不确定状态。",
    "onChange": "复选框状态变化时触发的回调。",
    "changeAction": "变更时执行的异步操作。若未被阻止，会在 onChange 之后触发。等待期间显示加载旋转图标。",
    "isLoading": "复选框是否处于加载状态。显示旋转图标并阻止交互。",
    "isDisabled": "复选框是否被禁用。",
    "htmlName": "底层复选框输入的 HTML name 属性，适用于表单提交（选中时提交 \"on\"）。",
    "disabledMessage": "解释复选框为何被禁用。与 `isDisabled` 一起使用时，在悬停/键盘聚焦时显示提示，并通过 `aria-disabled` 保持复选框可聚焦（切换仍会被阻止）。请使用此属性，而不要用 Tooltip 包裹禁用的 CheckboxInput。禁用控件会吞掉外部 Tooltip 所需的悬停事件。",
    "isReadOnly": "复选框是否为只读。以完全不透明度显示当前状态，但阻止交互。与 `isDisabled` 不同，只读复选框不会在视觉上变暗。",
    "isOptional": "该字段是否为可选。与 `isRequired` 互斥。",
    "isRequired": "复选框是否为必填。与 `isOptional` 互斥。",
    "size": "复选框的尺寸。`sm` 用于紧凑布局，`md` 为默认值。在粗指针设备上，带标签复选框的点击目标会通过不可见的命中区域扩展到接近 44 px。该区域不会缩小到小于所在行，且在与更近邻居的间距一半处停止；视觉尺寸保持不变。",
    "onFocus": "复选框获得焦点时触发的回调。",
    "onBlur": "复选框失去焦点时触发的回调。",
    "labelIcon": "显示在标签文本之前的语义图标名称或自定义内容。有效语义名称请参阅 `astryx docs icons`。",
    "status": "状态指示器。在复选框下方显示带颜色的消息框，并在出错时设置 `aria-invalid`。",
    "width": "字段宽度（数字表示像素，字符串按原样使用，例如 \"100%\"）。会调整整个字段（标签、控件和状态）的尺寸，使其保持对齐。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'single on/off toggle for settings, terms, and opt-in choices',
  usage: {
    description:
      'CheckboxInput toggles a single on/off value. Use for settings, terms acceptance, opt-in choices. Use CheckboxList for groups.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Always provide a visible label so user knows what they're toggling. Use isLabelHidden only when surrounding context makes it obvious.",
      },
      {
        guidance: true,
        description:
          'Add a description for choices that need extra context, e.g. what "Share usage data" actually shares.',
      },
      {
        guidance: true,
        description:
          'Use the indeterminate state for "select all" checkboxes when only some items in a group are selected.',
      },
      {
        guidance: false,
        description:
          'Use a checkbox for mutually exclusive choices; use RadioList when only one option can be selected.',
      },
      {
        guidance: false,
        description:
          'Use a checkbox for actions that take effect immediately; use a toggle switch or button instead.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled checkbox in Tooltip to explain why it is disabled; disabled controls swallow the hover events the wrapper needs. Use the disabledMessage prop instead.',
      },
    ],
  },
  propDescriptions: {
    ref: 'ref forwarded to underlying <input>',
    label: 'label text; always rendered for a11y',
    isLabelHidden: 'visually hide label (still accessible to screen readers)',
    description: 'text below label',
    value: 'checked, unchecked, or indeterminate',
    onChange: 'callback on state change',
    changeAction:
      'async action; fires after onChange, shows spinner while pending',
    isLoading: 'shows spinner + prevents interaction',
    isDisabled: 'disable checkbox',
    htmlName: 'HTML name attr for the checkbox; submits "on" when checked.',
    isOptional: 'mark field as optional (mutually exclusive w/ isRequired)',
    isRequired: 'mark field as required (mutually exclusive w/ isOptional)',
    size: 'sm (compact) or md (default)',
    onFocus: 'callback on focus',
    onBlur: 'callback on blur',
    labelIcon: 'semantic icon name or custom content before label text',
    status: 'error/warning/success with message; sets aria-invalid on error',
  },
};
