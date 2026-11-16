// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'NumberInput',
  playground: {
    defaults: {label: 'Count', value: 3},
  },
  displayName: 'Number Input',
  category: 'Form Controls',
  keywords: [
    'numberinput',
    'numberfield',
    'stepper',
    'spinner',
    'counter',
    'increment',
    'decrement',
    'quantity',
    'numberpicker',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the input (always rendered for accessibility).',
      required: true,
    },
    {
      name: 'value',
      type: 'number | null | undefined',
      description: 'Current value of the input.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: number) => void',
      description:
        'Callback fired when a valid text edit commits on blur or Enter, or when a step or clear control changes the value.',
      required: true,
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant.',
      default: "'md'",
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hide the label (still accessible to screen readers).',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Whether the field is optional (mutually exclusive with isRequired).',
    },
    {
      name: 'onKeyDown',
      type: '(e: KeyboardEvent<HTMLInputElement>) => void',
      description: 'Callback fired on keydown events on the input.',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Whether the field is required (mutually exclusive with isOptional).',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the input is disabled.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Makes the input read-only: the value is shown at full opacity and still submits with the form, but cannot be edited. Unlike isDisabled, a read-only input is not dimmed and keeps its form value. Stepping is off in every form while read-only: arrow keys, the wheel, and the number steppers. isDisabled takes precedence when both are set.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and keeps the input focusable via aria-disabled (the field becomes read-only). Use this instead of wrapping a disabled NumberInput in Tooltip.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text.',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text to display in an info icon at the end of the label.',
    },
    {
      name: 'startIcon',
      type: 'IconType',
      description:
        'Icon to display at the start of the input. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'labelIcon',
      type: 'IconType',
      description:
        'Icon to display before the label text. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'status',
      type: "{type: 'error' | 'warning' | 'success', message?: string}",
      description:
        'Validation status with optional message. Typing never shows a rejection: a typed number is complete only at commit. When Enter or blur meets text that is not a number, a fraction in an integer-only field, or any number while min is above max, the text stays in the field and the field shows its own error message in place of status. An error status with a message shows instead of that message, and the rejection is still announced and marks the field invalid. A warning or success status, or an error status without a message, never replaces it. A number outside an ordinary range clamps instead.',
    },
    {
      name: 'onEntryErrorChange',
      type: "(error: {kind: 'unreadable' | 'fractional' | 'outOfRange', text: string, value?: number} | null) => void",
      description:
        "Called each time the field's rejection of typed text changes, and with null when the rejection ends. A rejection starts only at Enter or blur. kind is 'unreadable' (text that is not a number), 'fractional' (a fraction when isIntegerOnly), or 'outOfRange' (any number while min is above max); text is the typed text; value is the number it names, for 'fractional' and 'outOfRange'. It also runs when an edit makes the text valid or empty, when a new value, min, max, or isIntegerOnly changes or ends the rejection, and when disabling the field drops the text, and never twice for the same rejection; it reports null when the field unmounts while a rejection stands. Pass an error status with a message to word the rejection yourself.",
    },
    {
      name: 'entryErrorBehavior',
      type: "'complete' | 'blur-or-enter'",
      description:
        "When the field shows its own entry error: typed text it rejects, as onEntryErrorChange reports it. It sets when the error shows, not when validation runs, so it is not React Aria's validationBehavior (native versus ARIA validation), and it never changes a caller status. A typed number is complete only at Enter or blur, so 'complete' and 'blur-or-enter' behave the same: the message, aria-invalid, the invalid styling, the announcement, and the onEntryErrorChange report appear together at Enter or blur, never while a person types, and an edit that makes the text valid or empty clears the error at once. Set it to match the other fields of a form; the field's own value wins over the nearest FormLayout's defaultEntryErrorBehavior.",
      default:
        "the nearest FormLayout's defaultEntryErrorBehavior, else 'complete'",
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status message is placed relative to the input. attached overlaps directly below the input (bordered treatment); detached floats below as a separate element with spacing; tooltip hides the message box and surfaces it in a tooltip on the status icon.',
      default: "'attached'",
    },
    {
      name: 'min',
      type: 'number | null',
      description:
        'Minimum value allowed. A smaller entry commits at this value on blur or Enter.',
    },
    {
      name: 'max',
      type: 'number | null',
      description:
        'Maximum value allowed. A larger entry commits at this value on blur or Enter.',
    },
    {
      name: 'step',
      type: 'number | null',
      description: 'Step increment for the input.',
      default: '1',
    },
    {
      name: 'formatValue',
      type: '(value: number) => string',
      description:
        'Formats the committed value while the input is not focused. The raw numeric value is shown on focus for editing and the formatted value is exposed through aria-valuetext.',
    },
    {
      name: 'isWheelEnabled',
      type: 'boolean',
      description:
        'Whether scrolling the wheel over the focused input steps the value. Disable this when page scrolling should always take priority.',
      default: 'true',
    },
    {
      name: 'hasNumberSteppers',
      type: 'boolean',
      description:
        'Shows increment and decrement buttons at the end of the input on fine pointers. Hidden on coarse pointers (such as touch screens); text entry and keyboard stepping remain available. Holding a button with a mouse or a pen repeats the step and commits once, when the hold ends.',
      default: 'false',
    },
    {
      name: 'units',
      type: 'string | null',
      description:
        'Units text to display at the end of the input (e.g., "%" or "GB").',
    },
    {
      name: 'isIntegerOnly',
      type: 'boolean',
      description: 'Only allow integer values (no floating point).',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (\u00d7) button when the input has a value. When true, the onChange callback also accepts null to signal the user cleared the input.',
      default: 'false',
    },
    {
      name: 'htmlName',
      type: 'string',
      description:
        'HTML name attribute for form submissions. While blur keeps rejected text, the form posts the committed number, until the person edits the text or a new value replaces it.',
    },
    {
      name: 'autoComplete',
      type: 'string',
      description: 'HTML autocomplete attribute.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description:
        'Width of the field (number = pixels, string used as-is, e.g. "100%"). Sizes the whole field (label, control, and status) so they stay aligned.',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Whether to focus the input on mount.',
    },
    {
      name: 'onFocus',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the input receives focus.',
    },
    {
      name: 'onBlur',
      type: '(e: FocusEvent<HTMLInputElement>) => void',
      description: 'Callback fired when the input loses focus.',
    },
    {
      name: 'onEnter',
      type: '() => void',
      description: 'Callback fired when the user presses the Enter key.',
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
  theming: {
    targets: [
      {
        className: 'astryx-number-input',
        visualProps: ['size', 'status'],
        states: ['disabled', 'readonly'],
      },
    ],
    derived: [
      // `padding` in any spelling — the shorthand, `paddingBlock`, or a lone
      // `paddingBlockStart` — is parsed by the shared container expansion and
      // emitted as normalized per-side `--astryx-number-input-padding-*`
      // tokens. The wrapper and the number-stepper column both read those, so
      // the column stays flush with the field edges under a themed padding.
      {property: 'padding', expand: 'container'},
      // Scoped to this component's own subtree: the stepper column's outer
      // corners follow the field radius, so a themed `number-input`
      // borderRadius has to reach the var the column reads, not just the
      // wrapper's own `border-radius`.
      {property: 'borderRadius', vars: ['--_field-radius']},
    ],
  },
  usage: {
    description:
      'A form input for numeric values with built-in validation, min/max constraints, and step controls. Use NumberInput for quantities, measurements, percentages, and similar inputs.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Let people paste formatted numbers: a pasted 1,234,234,234 is read under the field's locale and commits as 1234234234 on blur. Typing is never intercepted.",
      },
      {
        guidance: true,
        description:
          'Set min, max, and step to guide users toward valid values.',
      },
      {
        guidance: true,
        description:
          'Show units (e.g. "%" or "GB") so users know what the number represents.',
      },
      {
        guidance: true,
        description:
          'Set isWheelEnabled={false} when the input appears in a scrolling surface where wheel gestures should always scroll the page.',
      },
      {
        guidance: false,
        description:
          'Use NumberInput for free-form text that happens to contain numbers; use TextInput instead.',
      },
      {
        guidance: false,
        description: 'Set both isOptional and isRequired on the same field.',
      },
      {
        guidance: false,
        description:
          "Wrap a disabled NumberInput in Tooltip to explain why it's disabled. Use the disabledMessage prop, which attaches the reason to the field itself.",
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'The label for the number input.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Additional description text below the label.',
      },
      {
        name: 'Icon',
        required: false,
        description: 'An optional icon within the input.',
      },
      {
        name: 'Placeholder',
        required: false,
        description: 'Placeholder text shown when the input is empty.',
      },
      {
        name: 'Number steppers',
        required: false,
        description:
          'Optional buttons that increment or decrement by the configured step.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "NumberInput",
  "displayName": "Number Input",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "输入框的标签文本（始终为无障碍而渲染）。",
      "required": true
    },
    {
      "name": "value",
      "type": "number | null | undefined",
      "description": "输入框的当前值。",
      "required": true
    },
    {
      "name": "onChange",
      "type": "(value: number) => void",
      "description": "当有效的文本编辑在失焦或 Enter 时提交，或当步进或清除控件更改值时触发的回调。",
      "required": true
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "尺寸变体。",
      "default": "'md'"
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签（屏幕阅读器仍可访问）。"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签和输入框之间的描述文本。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "字段是否可选（与 isRequired 互斥）。"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "字段是否必填（与 isOptional 互斥）。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "输入框是否禁用。"
    },
    {
      "name": "isReadOnly",
      "type": "boolean",
      "description": "使输入框只读：值以完全不透明显示，仍随表单提交，但无法编辑。与 isDisabled 不同，只读输入框不会变暗，并保留其表单值。只读时所有表单中的步进都关闭：方向键、滚轮和数字步进器。两者都设置时，isDisabled 优先。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释输入框为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹禁用的 NumberInput。"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "占位文本。"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "在标签末尾的信息图标中显示的工具提示文本。"
    },
    {
      "name": "startIcon",
      "type": "IconType",
      "description": "在输入框起始处显示的图标。有效语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "labelIcon",
      "type": "IconType",
      "description": "在标签文本之前显示的图标。有效语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "status",
      "type": "{type: 'error' | 'warning' | 'success', message?: string}",
      "description": "带可选消息的校验状态。键入时从不显示拒绝：键入的数字仅在提交时才完整。当 Enter 或失焦遇到非数字文本、仅整数字段中的小数，或 min 大于 max 时的任何数字时，文本会留在字段中，字段会用自己的错误消息替代 status。带消息的错误状态会替代该消息显示，拒绝仍会被播报并将字段标记为无效。警告或成功状态，或不带消息的错误状态，绝不会替换它。超出普通范围的数字会被钳制。"
    },
    {
      "name": "onEntryErrorChange",
      "type": "(error: {kind: 'unreadable' | 'fractional' | 'outOfRange', text: string, value?: number} | null) => void",
      "description": "每当字段对键入文本的拒绝发生变化时调用，拒绝结束时以 null 调用。拒绝仅在 Enter 或失焦时开始。kind 为 'unreadable'（非数字文本）、'fractional'（isIntegerOnly 时的小数）或 'outOfRange'（min 大于 max 时的任何数字）；text 是键入的文本；value 是它表示的数字，适用于 'fractional' 和 'outOfRange'。当编辑使文本变为有效或为空、当新的 value、min、max 或 isIntegerOnly 更改或结束拒绝、以及当禁用字段丢弃文本时，它也会运行，且同一拒绝绝不会重复调用；当字段在拒绝仍然存在时卸载，它报告 null。传入带消息的错误状态可自行表述拒绝。"
    },
    {
      "name": "entryErrorBehavior",
      "type": "'complete' | 'blur-or-enter'",
      "description": "字段何时显示自己的条目错误：它拒绝的键入文本，即 onEntryErrorChange 报告的内容。它设置错误何时显示，而不是校验何时运行，因此不是 React Aria 的 validationBehavior（原生还是 ARIA 校验），也从不更改调用方状态。键入的数字仅在 Enter 或失焦时才完整，因此 'complete' 和 'blur-or-enter' 行为相同：消息、aria-invalid、无效样式、播报和 onEntryErrorChange 报告会在 Enter 或失焦时一起出现，绝不在用户键入时出现，而使文本有效或为空的编辑会立即清除错误。设置它使其与表单的其他字段匹配；字段自身的值优先于最近的 FormLayout 的 defaultEntryErrorBehavior。",
      "default": "最近的 FormLayout 的 defaultEntryErrorBehavior，否则为 'complete'"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为单独元素浮动在下方并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中展示。",
      "default": "'attached'"
    },
    {
      "name": "min",
      "type": "number | null",
      "description": "允许的最小值。较小的输入会在失焦或 Enter 时以该值提交。"
    },
    {
      "name": "max",
      "type": "number | null",
      "description": "允许的最大值。较大的输入会在失焦或 Enter 时以该值提交。"
    },
    {
      "name": "step",
      "type": "number | null",
      "description": "输入框的步进增量。",
      "default": "1"
    },
    {
      "name": "formatValue",
      "type": "(value: number) => string",
      "description": "在输入框未聚焦时格式化已提交的值。聚焦时显示原始数值以供编辑，格式化后的值通过 aria-valuetext 暴露。"
    },
    {
      "name": "isWheelEnabled",
      "type": "boolean",
      "description": "在聚焦的输入框上滚动滚轮是否步进值。当页面滚动应始终优先时，禁用此功能。",
      "default": "true"
    },
    {
      "name": "hasNumberSteppers",
      "type": "boolean",
      "description": "在精细指针上显示输入框末尾的递增和递减按钮。在粗略指针（如触摸屏）上隐藏；文本输入和键盘步进仍可用。用鼠标或笔按住按钮会重复步进，并在按住结束时提交一次。",
      "default": "false"
    },
    {
      "name": "units",
      "type": "string | null",
      "description": "在输入框末尾显示的单位文本（例如 \"%\" 或 \"GB\"）。"
    },
    {
      "name": "isIntegerOnly",
      "type": "boolean",
      "description": "仅允许整数值（无浮点数）。"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "输入框有值时显示清除（×）按钮。为 true 时，onChange 回调还接受 null，表示用户清除了输入框。",
      "default": "false"
    },
    {
      "name": "htmlName",
      "type": "string",
      "description": "用于表单提交的 HTML name 属性。在失焦保留被拒绝文本期间，表单提交已提交的数字，直到用户编辑文本或新值替换它。"
    },
    {
      "name": "autoComplete",
      "type": "string",
      "description": "HTML autocomplete 属性。"
    },
    {
      "name": "hasAutoFocus",
      "type": "boolean",
      "description": "是否在挂载时聚焦输入框。"
    },
    {
      "name": "onFocus",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "输入框获得焦点时触发的回调。"
    },
    {
      "name": "onBlur",
      "type": "(e: FocusEvent<HTMLInputElement>) => void",
      "description": "输入框失去焦点时触发的回调。"
    },
    {
      "name": "onEnter",
      "type": "() => void",
      "description": "用户按下 Enter 键时触发的回调。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "字段容器的类名。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "可视控件框的类名。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "可视控件框的内联样式。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-number-input",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled",
          "readonly"
        ]
      }
    ],
    "derived": [
      {
        "property": "padding",
        "expand": "container"
      },
      {
        "property": "borderRadius",
        "vars": [
          "--_field-radius"
        ]
      }
    ]
  },
  "usage": {
    "description": "用于数值的表单输入框，内置校验、min/max 约束和步进控件。数量、度量、百分比及类似输入请使用 NumberInput。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "允许用户粘贴带格式的数字：粘贴的 1,234,234,234 会按字段的区域设置读取，并在失焦时提交为 1234234234。键入过程从不被拦截。"
      },
      {
        "guidance": true,
        "description": "设置 min、max 和 step，引导用户输入有效值。"
      },
      {
        "guidance": true,
        "description": "显示单位（例如 \"%\" 或 \"GB\"），让用户知道数字代表什么。"
      },
      {
        "guidance": true,
        "description": "当输入框位于滚动表面、滚轮手势应始终滚动页面时，设置 isWheelEnabled={false}。"
      },
      {
        "guidance": false,
        "description": "将 NumberInput 用于恰好包含数字的自由文本；请改用 TextInput。"
      },
      {
        "guidance": false,
        "description": "在同一字段上同时设置 isOptional 和 isRequired。"
      },
      {
        "guidance": false,
        "description": "用 Tooltip 包裹禁用的 NumberInput 来解释其禁用原因。请使用 disabledMessage 属性，它会将原因附加到字段本身。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "数字输入框的标签。"
      },
      {
        "name": "描述",
        "required": false,
        "description": "标签下方的附加描述文本。"
      },
      {
        "name": "图标",
        "required": false,
        "description": "输入框内的可选图标。"
      },
      {
        "name": "占位文本",
        "required": false,
        "description": "输入框为空时显示的占位文本。"
      },
      {
        "name": "数字步进器",
        "required": false,
        "description": "按配置的 step 递增或递减的可选按钮。"
      }
    ]
  },
  "propDescriptions": {
    "label": "输入框的标签文本（始终为无障碍而渲染）。",
    "value": "输入框的当前值。",
    "onChange": "当有效的文本编辑在失焦或 Enter 时提交，或当步进或清除控件更改值时触发的回调。",
    "size": "尺寸变体。",
    "isLabelHidden": "在视觉上隐藏标签（屏幕阅读器仍可访问）。",
    "description": "显示在标签和输入框之间的描述文本。",
    "isOptional": "字段是否可选（与 isRequired 互斥）。",
    "onKeyDown": "输入框上 keydown 事件触发的回调。",
    "isRequired": "字段是否必填（与 isOptional 互斥）。",
    "isDisabled": "输入框是否禁用。",
    "isReadOnly": "使输入框只读：值以完全不透明显示，仍随表单提交，但无法编辑。与 isDisabled 不同，只读输入框不会变暗，并保留其表单值。只读时所有表单中的步进都关闭：方向键、滚轮和数字步进器。两者都设置时，isDisabled 优先。",
    "disabledMessage": "解释输入框为何被禁用。与 isDisabled 搭配时，在悬停/键盘聚焦时显示工具提示，并通过 aria-disabled 保持输入框可聚焦（字段变为只读）。请使用此属性，而不是用 Tooltip 包裹禁用的 NumberInput。",
    "placeholder": "占位文本。",
    "labelTooltip": "在标签末尾的信息图标中显示的工具提示文本。",
    "startIcon": "在输入框起始处显示的图标。有效语义名称参见 `astryx docs icons`。",
    "labelIcon": "在标签文本之前显示的图标。有效语义名称参见 `astryx docs icons`。",
    "status": "带可选消息的校验状态。键入时从不显示拒绝：键入的数字仅在提交时才完整。当 Enter 或失焦遇到非数字文本、仅整数字段中的小数，或 min 大于 max 时的任何数字时，文本会留在字段中，字段会用自己的错误消息替代 status。带消息的错误状态会替代该消息显示，拒绝仍会被播报并将字段标记为无效。警告或成功状态，或不带消息的错误状态，绝不会替换它。超出普通范围的数字会被钳制。",
    "onEntryErrorChange": "每当字段对键入文本的拒绝发生变化时调用，拒绝结束时以 null 调用。拒绝仅在 Enter 或失焦时开始。kind 为 'unreadable'（非数字文本）、'fractional'（isIntegerOnly 时的小数）或 'outOfRange'（min 大于 max 时的任何数字）；text 是键入的文本；value 是它表示的数字，适用于 'fractional' 和 'outOfRange'。当编辑使文本变为有效或为空、当新的 value、min、max 或 isIntegerOnly 更改或结束拒绝、以及当禁用字段丢弃文本时，它也会运行，且同一拒绝绝不会重复调用；当字段在拒绝仍然存在时卸载，它报告 null。传入带消息的错误状态可自行表述拒绝。",
    "entryErrorBehavior": "字段何时显示自己的条目错误：它拒绝的键入文本，即 onEntryErrorChange 报告的内容。它设置错误何时显示，而不是校验何时运行，因此不是 React Aria 的 validationBehavior（原生还是 ARIA 校验），也从不更改调用方状态。键入的数字仅在 Enter 或失焦时才完整，因此 'complete' 和 'blur-or-enter' 行为相同：消息、aria-invalid、无效样式、播报和 onEntryErrorChange 报告会在 Enter 或失焦时一起出现，绝不在用户键入时出现，而使文本有效或为空的编辑会立即清除错误。设置它使其与表单的其他字段匹配；字段自身的值优先于最近的 FormLayout 的 defaultEntryErrorBehavior。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框的处理）；detached 作为单独元素浮动在下方并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中展示。",
    "min": "允许的最小值。较小的输入会在失焦或 Enter 时以该值提交。",
    "max": "允许的最大值。较大的输入会在失焦或 Enter 时以该值提交。",
    "step": "输入框的步进增量。",
    "formatValue": "在输入框未聚焦时格式化已提交的值。聚焦时显示原始数值以供编辑，格式化后的值通过 aria-valuetext 暴露。",
    "isWheelEnabled": "在聚焦的输入框上滚动滚轮是否步进值。当页面滚动应始终优先时，禁用此功能。",
    "hasNumberSteppers": "在精细指针上显示输入框末尾的递增和递减按钮。在粗略指针（如触摸屏）上隐藏；文本输入和键盘步进仍可用。用鼠标或笔按住按钮会重复步进，并在按住结束时提交一次。",
    "units": "在输入框末尾显示的单位文本（例如 \"%\" 或 \"GB\"）。",
    "isIntegerOnly": "仅允许整数值（无浮点数）。",
    "hasClear": "输入框有值时显示清除（×）按钮。为 true 时，onChange 回调还接受 null，表示用户清除了输入框。",
    "htmlName": "用于表单提交的 HTML name 属性。在失焦保留被拒绝文本期间，表单提交已提交的数字，直到用户编辑文本或新值替换它。",
    "autoComplete": "HTML autocomplete 属性。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "hasAutoFocus": "是否在挂载时聚焦输入框。",
    "onFocus": "输入框获得焦点时触发的回调。",
    "onBlur": "输入框失去焦点时触发的回调。",
    "onEnter": "用户按下 Enter 键时触发的回调。",
    "containerXstyle": "字段容器（标签、控件和状态一起）的 StyleX 样式。在 InputGroup 内无效（请改为设置 InputGroup 样式），在 `horizontal-labels` FormLayout 中也无效。不接受根级 `xstyle`、`className` 和 `style`。",
    "containerClassName": "字段容器的类名。定位方式与 `containerXstyle` 相同。",
    "containerStyle": "字段容器的内联样式。定位方式与 `containerXstyle` 相同。",
    "controlXstyle": "可视控件框的 StyleX 样式：绘制边框和背景并容纳图标和结束控件的元素。绝不是原生输入框。",
    "controlClassName": "可视控件框的类名。",
    "controlStyle": "可视控件框的内联样式。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Number input component for collecting numeric user input w/ validation.',
  usage: {
    description:
      'A form input for numeric values with built-in validation, min/max constraints, and step controls. Use NumberInput for quantities, measurements, percentages, and similar inputs.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Pasted formatted numbers parse: 1,234,234,234 commits as 1234234234 under the field's locale. Typing is never intercepted.",
      },
      {
        guidance: true,
        description:
          'Set min, max, and step to guide users toward valid values.',
      },
      {
        guidance: true,
        description:
          'Show units (e.g. "%" or "GB") so users know what the number represents.',
      },
      {
        guidance: true,
        description:
          'Set isWheelEnabled={false} when the input appears in a scrolling surface where wheel gestures should always scroll the page.',
      },
      {
        guidance: false,
        description:
          'Use NumberInput for free-form text that happens to contain numbers; use TextInput instead.',
      },
      {
        guidance: false,
        description: 'Set both isOptional and isRequired on the same field.',
      },
      {
        guidance: false,
        description:
          "Wrap a disabled NumberInput in Tooltip to explain why it's disabled. Use the disabledMessage prop, which attaches the reason to the field itself.",
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'The label for the number input.',
      },
      {
        name: 'Description',
        required: false,
        description: 'Additional description text below the label.',
      },
      {
        name: 'Icon',
        required: false,
        description: 'An optional icon within the input.',
      },
      {
        name: 'Placeholder',
        required: false,
        description: 'Placeholder text shown when the input is empty.',
      },
      {
        name: 'Number steppers',
        required: false,
        description:
          'Optional buttons that increment or decrement by the configured step.',
      },
    ],
  },
  propDescriptions: {
    containerXstyle:
      'StyleX styles for the field container; no effect in InputGroup or horizontal-labels FormLayout. No root xstyle/className/style.',
    containerClassName: 'Class name for the field container.',
    containerStyle: 'Inline styles for the field container.',
    controlXstyle:
      'StyleX styles for the visual control box (border, background, icons); not the native input.',
    controlClassName: 'Class name for the visual control box.',
    controlStyle: 'Inline styles for the visual control box.',
    label: 'Label text (always rendered for accessibility).',
    value: 'Current input value.',
    onChange:
      'Callback when a valid text edit commits on blur/Enter, or a step/clear control changes the value.',
    size: 'Size variant.',
    isLabelHidden: 'Visually hide label (still accessible to screen readers).',
    description: 'Text between label + input.',
    isOptional: 'Field optional (mutually exclusive w/ isRequired).',
    isRequired: 'Field required (mutually exclusive w/ isOptional).',
    isDisabled: 'Input disabled.',
    isReadOnly:
      'Read-only: value visible + still submits, but not editable. Unlike isDisabled: not dimmed.',
    disabledMessage:
      'Explains why input is disabled. With isDisabled, shows tooltip on hover/focus + keeps input focusable via aria-disabled (field becomes read-only). Use instead of wrapping a disabled NumberInput in Tooltip.',
    placeholder: 'Placeholder text.',
    labelTooltip: 'Tooltip text in info icon at label end.',
    startIcon: 'Icon at input start.',
    labelIcon: 'Icon before label text.',
    status:
      "Validation status w/ optional message; nothing shows while typing; at Enter/blur, unreadable text, a fraction when isIntegerOnly, or any number while min > max stays w/ the field's own error message in place of status, unless status is an error w/ message (still announced + aria-invalid); warning/success never hide it; out-of-range numbers clamp.",
    onEntryErrorChange:
      "(error|null) on each typed-rejection change, starting only at Enter/blur: kind 'unreadable'|'fractional' (isIntegerOnly)|'outOfRange' (min > max), text, value (fractional/outOfRange); also on an edit to valid/empty, new value/min/max/isIntegerOnly, disable; never twice for one rejection; null on unmount mid-rejection; word it via an error status w/ message",
    entryErrorBehavior:
      "'complete'|'blur-or-enter': when the field's own rejection shows (not when validation runs; not React Aria validationBehavior; never changes status). A typed number is complete only at Enter/blur, so both values behave the same: message, aria-invalid, styling, announcement and onEntryErrorChange report wait for Enter/blur; valid or emptied text clears at once. Default: nearest FormLayout defaultEntryErrorBehavior, else complete",
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    min: 'Minimum value allowed.',
    max: 'Maximum value allowed.',
    step: 'Step increment.',
    formatValue:
      'Formats committed value at rest; raw number is shown while editing.',
    isWheelEnabled:
      'Allow focused wheel gestures to step value. Defaults to true.',
    hasNumberSteppers:
      'Show increment + decrement buttons on fine pointers; hidden on coarse pointers. Defaults to false.',
    units: 'Units suffix (e.g. "%" or "GB").',
    isIntegerOnly: 'Only allow integer values.',
    hasClear:
      'Shows clear button when input has value. onChange also accepts null on clear.',
    htmlName:
      'HTML name for form submissions; while blur keeps rejected text, posts the committed number until an edit or a new value.',
    autoComplete: 'HTML autocomplete attribute.',
    hasAutoFocus: 'Focus input on mount.',
    onFocus: 'Callback on focus.',
    onBlur: 'Callback on blur.',
    onEnter: 'Callback on Enter key.',
  },
};
