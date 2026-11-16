// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TimeInput',
  displayName: 'Time Input',
  category: 'Form Controls',
  keywords: [
    'timeinput',
    'timepicker',
    'time',
    'clock',
    'hour',
    'minute',
    'ampm',
    'timeselect',
    'timefield',
    'schedule',
  ],

  usage: {
    description:
      "TimeInput uses a browser/OS time picker on coarse pointers by default and Astryx's typed field on fine pointers. It converts values to a standard format and supports arrow-key adjustment on the typed surface. Use it in forms, scheduling flows, or any interface where users need to select a specific time.",
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the time input, the element that is focused and announced. A DOM handler runs after TimeInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          "Leave hourFormat unset so the field follows the InternationalizationProvider locale's hour cycle (12-hour in en-US, 24-hour in en-GB or de-DE). Set it only when the field itself needs a fixed format, and carry a person's own 12/24-hour preference on the provider locale (e.g. 'en-US-u-hc-h23') rather than on each field.",
      },
      {
        guidance: true,
        description:
          'Set min and max constraints when the context has a valid range, like business hours or event windows, so users cannot submit an out-of-bounds time.',
      },
      {
        guidance: true,
        description:
          'Provide a description or placeholder that hints at the expected format or purpose, like "Business hours: 9 AM \u2013 5 PM".',
      },
      {
        guidance: true,
        description:
          'Use the status prop to surface validation errors inline: show a message like "Time must be during business hours" so users know exactly what to fix.',
      },
      {
        guidance: true,
        description:
          'Enable hasClear when the field is optional, so users can remove a previously selected time.',
      },
      {
        guidance: true,
        description:
          'Place TimeInput inside InputGroup when the time needs a single-line prefix or suffix addon, like a start/end label or timezone marker.',
      },
      {
        guidance: false,
        description:
          "Don't use TimeInput for combined date-and-time selection; pair it with a separate DateInput instead.",
      },
      {
        guidance: false,
        description:
          "Don't hide the label; even when space is tight, keep the label visible or provide a description so the purpose is clear.",
      },
      {
        guidance: false,
        description:
          'Wrap a disabled TimeInput in Tooltip to explain why it is disabled. Use the disabledMessage prop instead, which ties the reason to the field.',
      },
    ],
    anatomy: [
      {
        name: 'Clock icon',
        required: false,
        description:
          'A leading clock icon that identifies the field and opens the browser/OS picker in native mode.',
      },
      {
        name: 'Time control',
        required: true,
        description:
          'A real input type=time in native modes, or Astryx\'s editable text field for fine pointers, presentation="text-input", seconds, and custom increments.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A trailing button to reset the value, shown when hasClear is true and a value is set.',
      },
      {
        name: 'Status icon',
        required: false,
        description:
          'A trailing icon indicating error, warning, or success state.',
      },
      {
        name: 'Spinner',
        required: false,
        description:
          'Replaces trailing content during loading to show an async action is in progress.',
      },
    ],
  },

  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text for the input (required for accessibility).',
      required: true,
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
      description: 'Description text displayed between the label and input.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Shows an "(optional)" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Marks the field as required and sets aria-required. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disables the input and suppresses interactions. The input stays focusable and exposes `aria-disabled`.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and describes the input (activation stays blocked). Use this instead of wrapping a disabled TimeInput in Tooltip.',
    },
    {
      name: 'value',
      type: 'ISOTimeString',
      description: 'Controlled time value in ISO format (HH:MM or HH:MM:SS).',
    },
    {
      name: 'onChange',
      type: '(value: ISOTimeString | undefined) => void',
      description:
        'Callback fired when the time changes. Receives undefined when the input is cleared.',
    },
    {
      name: 'changeAction',
      type: '(value: ISOTimeString | undefined) => void | Promise<void>',
      description:
        'Async action fired after onChange. Wrapped in a React transition to provide optimistic UI; triggers the loading spinner while pending.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description: 'Puts the input into a loading state, displaying a spinner.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISOTimeString',
      description:
        'Minimum selectable time in ISO format. Values outside the range are rejected.',
    },
    {
      name: 'max',
      type: 'ISOTimeString',
      description:
        'Maximum selectable time in ISO format. Values outside the range are rejected.',
    },
    {
      name: 'hasSeconds',
      type: 'boolean',
      description: 'Includes seconds in the time display and parsing.',
      default: 'false',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear button when a value is set and the input is not disabled.',
      default: 'false',
    },
    {
      name: 'hourFormat',
      type: "'12h' | '24h'",
      description:
        "Controls the display format. '12h' shows the locale's day period (e.g. '2:30 PM', '오후 2:30'); '24h' uses 24-hour notation (e.g. '14:30'). When unset, follows the InternationalizationProvider locale's hour cycle: en-US reads 12-hour, en-GB and de-DE read 24-hour. To honor a person's own preference, pass it on the locale tag (e.g. 'en-US-u-hc-h23') rather than per field.",
      default: "the locale's hour cycle",
    },
    {
      name: 'increment',
      type: 'number',
      description:
        'Number of minutes to add or subtract when the user presses the up or down arrow key. Steps are whole minutes; a fractional value leaves the time unchanged.',
      default: '1',
    },
    {
      name: 'presentation',
      type: "'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "Which surface selects the time. 'adaptive-native' (the default) uses Astryx's typed field on a fine pointer and the browser/OS input type=time on a coarse pointer — except hasSeconds or increment other than 1, which retain the typed field because iOS has no seconds wheel and treats step as validation rather than picker cadence; 'native' always uses the browser/OS control with no Astryx fallback; 'adaptive-bottom-sheet' uses the typed field on a fine pointer and Astryx's bottom-sheet time wheels on a coarse pointer; 'bottom-sheet' forces the wheels on every pointer; 'text-input' (like 'popover', which has no distinct TimeInput surface) keeps only the typed field. Native mode forwards min/max and enforces them on commit. hourFormat formats the closed value; the open OS picker follows the device locale.",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "Deprecated: use presentation ('touch' = 'adaptive-native', 'always' = 'native', 'never' = 'text-input'). Still works exactly as released; presentation wins when both are set.",
      default: "'touch'",
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder text shown when no time is selected. When the input is focused and empty, a format hint overrides this text.',
      default: "'Select a time'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Controls the height of the input element.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        "Status indicator that colors the border and displays an icon. When a message is provided it is rendered below the input. A typed time the field rejects, and a native edit outside min or max, show the field's own error message instead; an error status with a message shows in its place, and the rejection is still announced. A warning or success never replaces a rejection.",
    },
    {
      name: 'onEntryErrorChange',
      type: "(error: {kind: 'unreadable' | 'outOfRange', text: string, value?: ISOTimeString} | null) => void",
      description:
        "Called each time the field's rejection of typed text changes, and with null when the rejection ends. kind is 'unreadable' (text that is not a time) or 'outOfRange' (a time before min or after max); text is the typed text; value is the ISO time the text names, for 'outOfRange'. Under entryErrorBehavior 'complete', a rejection shows once the typed time is complete (in 12-hour text, with its day period unless the hour reads 0 or 13–23), or at Enter or blur; under 'blur-or-enter', only at Enter or blur. Rejected text stays in the field. It also runs when a new min, max, or value, or disabling the field, changes the rejection, never twice for the same rejection, and with null when the field unmounts while a rejection stands. The native and bottom-sheet surfaces take no typed text, so they never report.",
    },
    {
      name: 'entryErrorBehavior',
      type: "'complete' | 'blur-or-enter'",
      description:
        "When the field shows its own entry error: a typed time it rejects, as onEntryErrorChange reports it, or a native edit outside min or max. It sets when the error shows, not when validation runs, so it is not React Aria's validationBehavior (native versus ARIA validation), and it never changes a caller status. 'complete' shows a complete typed time outside min or max, and a native edit outside them, at once, and other rejected text at Enter or blur. 'blur-or-enter' holds every rejection until Enter or blur: the message, aria-invalid, the invalid styling, the announcement, and the onEntryErrorChange report then appear together. Under both values, an edit the field accepts or empties clears the error at once; under 'blur-or-enter', an edit that leaves the entry wrong keeps the shown error until the next Enter or blur. The field's own value wins over the nearest FormLayout's defaultEntryErrorBehavior.",
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
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text rendered as an info icon at the end of the label row.',
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
        'StyleX styles for the Field box around the label, control, and status. containerClassName and containerStyle take a class name and inline styles for the same box. No effect (development warning) where no Field box renders: inside InputGroup (style the group) and in a horizontal-labels FormLayout.',
    },
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the visual control box: the bordered element that holds the text, icons, and end controls, never the native input. controlClassName and controlStyle take a class name and inline styles for the same box. Replaces root xstyle, className, and style, which this component does not accept.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-time-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "TimeInput",
  "displayName": "Time Input",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "输入框的标签文本（无障碍所必需）。",
      "required": true
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "视觉上隐藏标签，同时保持屏幕阅读器可访问。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签和输入框之间的描述文本。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "在标签旁显示 \"(optional)\" 指示器。与 isRequired 互斥。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "将字段标记为必填并设置 aria-required。与 isOptional 互斥。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用输入框并禁止交互。输入框保持可聚焦并暴露 `aria-disabled`。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "解释输入框为何禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示并描述输入框（激活仍被阻止）。请使用它，而不是用 Tooltip 包裹禁用的 TimeInput。"
    },
    {
      "name": "value",
      "type": "ISOTimeString",
      "description": "ISO 格式的受控时间值（HH:MM 或 HH:MM:SS）。"
    },
    {
      "name": "onChange",
      "type": "(value: ISOTimeString | undefined) => void",
      "description": "时间变化时触发的回调。输入框被清空时收到 undefined。"
    },
    {
      "name": "changeAction",
      "type": "(value: ISOTimeString | undefined) => void | Promise<void>",
      "description": "onChange 之后触发的异步操作。包裹在 React transition 中以提供乐观 UI；挂起时触发加载旋转图标。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "使输入框进入加载状态，显示旋转图标。",
      "default": "false"
    },
    {
      "name": "min",
      "type": "ISOTimeString",
      "description": "ISO 格式的最早可选时间。超出范围的值会被拒绝。"
    },
    {
      "name": "max",
      "type": "ISOTimeString",
      "description": "ISO 格式的最晚可选时间。超出范围的值会被拒绝。"
    },
    {
      "name": "hasSeconds",
      "type": "boolean",
      "description": "在时间显示和解析中包含秒。",
      "default": "false"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "当已设置值且输入框未禁用时显示清除按钮。",
      "default": "false"
    },
    {
      "name": "hourFormat",
      "type": "'12h' | '24h'",
      "description": "控制显示格式。'12h' 显示区域设置的日间时段（例如 '2:30 PM'、'오후 2:30'）；'24h' 使用 24 小时制（例如 '14:30'）。未设置时，遵循 InternationalizationProvider 区域设置的时制：en-US 为 12 小时制，en-GB 和 de-DE 为 24 小时制。要遵循个人偏好，请将其放在 locale 标签上（例如 'en-US-u-hc-h23'），而不是按字段设置。",
      "default": "区域设置的小时制"
    },
    {
      "name": "increment",
      "type": "number",
      "description": "用户按向上或向下方向键时要加或减的分钟数。步进为整分钟；小数值会使时间保持不变。",
      "default": "1"
    },
    {
      "name": "presentation",
      "type": "'text-input' | 'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      "description": "选择时间的界面。'adaptive-native'（默认）在细指针上使用 Astryx 的键入字段，在粗指针上使用浏览器/操作系统的 input type=time——但 hasSeconds 或 increment 不为 1 时保留键入字段，因为 iOS 没有秒轮，并将 step 视为校验而不是选择器节奏；'native' 始终使用浏览器/操作系统控件，没有 Astryx 回退；'adaptive-bottom-sheet' 在细指针上使用键入字段，在粗指针上使用 Astryx 的底部抽屉时间轮；'bottom-sheet' 在所有指针上强制使用时间轮；'text-input'（与 'popover' 相同，后者没有独立的 TimeInput 界面）只保留键入字段。原生模式会转发 min/max 并在提交时强制执行。hourFormat 格式化关闭后的值；打开的操作系统选择器遵循设备区域设置。",
      "default": "'adaptive-native'"
    },
    {
      "name": "nativePicker",
      "type": "'touch' | 'always' | 'never'",
      "description": "已弃用：请使用 presentation（'touch' = 'adaptive-native'，'always' = 'native'，'never' = 'text-input'）。仍按已发布行为正常工作；同时设置时 presentation 优先。",
      "default": "'touch'"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "未选择时间时显示的占位文本。当输入框聚焦且为空时，格式提示会覆盖此文本。",
      "default": "'Select a time'"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "控制输入元素的高度。",
      "default": "'md'"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "为边框着色并显示图标的状态指示器。提供消息时，消息渲染在输入框下方。字段拒绝的键入时间，以及超出 min 或 max 的原生编辑，会改为显示字段自身的错误消息；带消息的错误状态会取而代之显示，拒绝仍会被宣布。警告或成功状态永远不会替换拒绝。"
    },
    {
      "name": "onEntryErrorChange",
      "type": "(error: {kind: 'unreadable' | 'outOfRange', text: string, value?: ISOTimeString} | null) => void",
      "description": "每当字段对键入文本的拒绝发生变化时调用，拒绝结束时以 null 调用。kind 为 'unreadable'（不是时间的文本）或 'outOfRange'（早于 min 或晚于 max 的时间）；text 是键入的文本；value 是文本所指的 ISO 时间，仅用于 'outOfRange'。在 entryErrorBehavior 为 'complete' 时，拒绝会在键入时间完整时显示（在 12 小时文本中，除非小时为 0 或 13–23，否则包含其日间时段），或在 Enter 或失焦时显示；在 'blur-or-enter' 下，仅在 Enter 或失焦时显示。被拒绝的文本保留在字段中。当新的 min、max 或 value，或禁用字段，改变拒绝时它也会运行；同一拒绝绝不运行两次；当字段在拒绝仍然存在时卸载，会以 null 调用。原生和底部抽屉界面不接受键入文本，因此从不报告。"
    },
    {
      "name": "entryErrorBehavior",
      "type": "'complete' | 'blur-or-enter'",
      "description": "字段何时显示自身的输入错误：它拒绝的键入时间（由 onEntryErrorChange 报告），或超出 min 或 max 的原生编辑。它设置错误何时显示，而不是校验何时运行，因此不是 React Aria 的 validationBehavior（原生 vs ARIA 校验），也从不改变调用方的 status。'complete' 会立即显示超出 min 或 max 的完整键入时间和超出范围的原生编辑，其他被拒绝文本则在 Enter 或失焦时显示。'blur-or-enter' 将所有拒绝保留到 Enter 或失焦：消息、aria-invalid、无效样式、宣布和 onEntryErrorChange 报告会一起出现。在这两种值下，字段接受或清空的编辑会立即清除错误；在 'blur-or-enter' 下，仍使输入错误的编辑会保留已显示的错误，直到下一次 Enter 或失焦。字段自身的值优先于最近 FormLayout 的 defaultEntryErrorBehavior。",
      "default": "最近的 FormLayout 的 defaultEntryErrorBehavior，否则为 'complete'"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 作为独立元素在下方浮动并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中显示它。",
      "default": "'attached'"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "渲染为标签行末尾信息图标的工具提示文本。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "用于字段盒子（围绕标签、控件和状态）的 StyleX 样式。containerClassName 和 containerStyle 为同一个盒子提供类名和内联样式。在没有渲染 Field 盒子的地方无效（开发环境警告）：在 InputGroup 内（请为分组设置样式）以及水平标签的 FormLayout 中。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "用于视觉控件盒子的 StyleX 样式：即包含文本、图标和末端控件（绝不是原生输入框）的带边框元素。controlClassName 和 controlStyle 为同一个盒子提供类名和内联样式。会替换根级 xstyle、className 和 style，本组件不接受这些属性。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-time-input",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled"
        ]
      }
    ]
  },
  "usage": {
    "description": "TimeInput 在粗指针上默认使用浏览器/操作系统时间选择器，在细指针上使用 Astryx 的键入字段。它将值转换为标准格式，并支持在键入界面上用方向键调整。可用于表单、日程安排流程或任何用户需要选择具体时间的界面。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "ref、id、data-*、aria-* 等基础属性和 DOM 事件处理函数会传到时间输入框，即被聚焦和宣布的元素。DOM 处理函数在 TimeInput 自身的同事件处理函数之后运行，并且仍会收到它已处理的事件（包括调用过 preventDefault 的事件），因此无法取消内置行为。"
      },
      {
        "guidance": true,
        "description": "让 hourFormat 保持未设置，使字段遵循 InternationalizationProvider 区域设置的时制（en-US 为 12 小时制，en-GB 或 de-DE 为 24 小时制）。仅当字段本身需要固定格式时才设置它，并将个人的 12/24 小时偏好放在 provider 的 locale 上（例如 'en-US-u-hc-h23'），而不是每个字段上。"
      },
      {
        "guidance": true,
        "description": "当上下文有有效范围（如营业时间或活动时间窗）时设置 min 和 max 约束，使用户无法提交超出范围的时间。"
      },
      {
        "guidance": true,
        "description": "提供 description 或 placeholder，提示预期格式或用途，例如 \"Business hours: 9 AM – 5 PM\"。"
      },
      {
        "guidance": true,
        "description": "使用 status 属性内联展示校验错误：显示类似 \"Time must be during business hours\" 的消息，让用户明确知道需要修正什么。"
      },
      {
        "guidance": true,
        "description": "当字段可选时启用 hasClear，以便用户移除先前选择的时间。"
      },
      {
        "guidance": true,
        "description": "当时间需要单行前缀或后缀附加项（如开始/结束标签或时区标记）时，将 TimeInput 放在 InputGroup 中。"
      },
      {
        "guidance": false,
        "description": "不要将 TimeInput 用于日期和时间的组合选择；请改为与单独的 DateInput 搭配。"
      },
      {
        "guidance": false,
        "description": "不要隐藏标签；即使空间紧张，也要保持标签可见或提供描述，使用途清晰。"
      },
      {
        "guidance": false,
        "description": "不要用 Tooltip 包裹禁用的 TimeInput 来解释其禁用原因。请改用 disabledMessage 属性，它将原因与字段关联起来。"
      }
    ],
    "anatomy": [
      {
        "name": "时钟图标",
        "required": false,
        "description": "位于起始位置、标识字段并在原生模式下打开浏览器/操作系统选择器的时钟图标。"
      },
      {
        "name": "时间控件",
        "required": true,
        "description": "原生模式下是真正的 input type=time，或在细指针、presentation=\"text-input\"、带秒和自定义增量时使用 Astryx 的可编辑文本字段。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "用于重置值的末尾按钮，在 hasClear 为 true 且已设置值时显示。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "指示错误、警告或成功状态的末尾图标。"
      },
      {
        "name": "加载旋转图标",
        "required": false,
        "description": "加载期间替换末尾内容，以显示异步操作正在进行。"
      }
    ]
  },
  "propDescriptions": {
    "label": "输入框的标签文本（无障碍所必需）。",
    "isLabelHidden": "视觉上隐藏标签，同时保持屏幕阅读器可访问。",
    "description": "显示在标签和输入框之间的描述文本。",
    "isOptional": "在标签旁显示 \"(optional)\" 指示器。与 isRequired 互斥。",
    "isRequired": "将字段标记为必填并设置 aria-required。与 isOptional 互斥。",
    "isDisabled": "禁用输入框并禁止交互。输入框保持可聚焦并暴露 `aria-disabled`。",
    "disabledMessage": "解释输入框为何禁用。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示并描述输入框（激活仍被阻止）。请使用它，而不是用 Tooltip 包裹禁用的 TimeInput。",
    "value": "ISO 格式的受控时间值（HH:MM 或 HH:MM:SS）。",
    "onChange": "时间变化时触发的回调。输入框被清空时收到 undefined。",
    "changeAction": "onChange 之后触发的异步操作。包裹在 React transition 中以提供乐观 UI；挂起时触发加载旋转图标。",
    "isLoading": "使输入框进入加载状态，显示旋转图标。",
    "min": "ISO 格式的最早可选时间。超出范围的值会被拒绝。",
    "max": "ISO 格式的最晚可选时间。超出范围的值会被拒绝。",
    "hasSeconds": "在时间显示和解析中包含秒。",
    "hasClear": "当已设置值且输入框未禁用时显示清除按钮。",
    "hourFormat": "控制显示格式。'12h' 显示区域设置的日间时段（例如 '2:30 PM'、'오후 2:30'）；'24h' 使用 24 小时制（例如 '14:30'）。未设置时，遵循 InternationalizationProvider 区域设置的时制：en-US 为 12 小时制，en-GB 和 de-DE 为 24 小时制。要遵循个人偏好，请将其放在 locale 标签上（例如 'en-US-u-hc-h23'），而不是按字段设置。",
    "increment": "用户按向上或向下方向键时要加或减的分钟数。步进为整分钟；小数值会使时间保持不变。",
    "presentation": "选择时间的界面。'adaptive-native'（默认）在细指针上使用 Astryx 的键入字段，在粗指针上使用浏览器/操作系统的 input type=time——但 hasSeconds 或 increment 不为 1 时保留键入字段，因为 iOS 没有秒轮，并将 step 视为校验而不是选择器节奏；'native' 始终使用浏览器/操作系统控件，没有 Astryx 回退；'adaptive-bottom-sheet' 在细指针上使用键入字段，在粗指针上使用 Astryx 的底部抽屉时间轮；'bottom-sheet' 在所有指针上强制使用时间轮；'text-input'（与 'popover' 相同，后者没有独立的 TimeInput 界面）只保留键入字段。原生模式会转发 min/max 并在提交时强制执行。hourFormat 格式化关闭后的值；打开的操作系统选择器遵循设备区域设置。",
    "nativePicker": "已弃用：请使用 presentation（'touch' = 'adaptive-native'，'always' = 'native'，'never' = 'text-input'）。仍按已发布行为正常工作；同时设置时 presentation 优先。",
    "placeholder": "未选择时间时显示的占位文本。当输入框聚焦且为空时，格式提示会覆盖此文本。",
    "size": "控制输入元素的高度。",
    "status": "为边框着色并显示图标的状态指示器。提供消息时，消息渲染在输入框下方。字段拒绝的键入时间，以及超出 min 或 max 的原生编辑，会改为显示字段自身的错误消息；带消息的错误状态会取而代之显示，拒绝仍会被宣布。警告或成功状态永远不会替换拒绝。",
    "onEntryErrorChange": "每当字段对键入文本的拒绝发生变化时调用，拒绝结束时以 null 调用。kind 为 'unreadable'（不是时间的文本）或 'outOfRange'（早于 min 或晚于 max 的时间）；text 是键入的文本；value 是文本所指的 ISO 时间，仅用于 'outOfRange'。在 entryErrorBehavior 为 'complete' 时，拒绝会在键入时间完整时显示（在 12 小时文本中，除非小时为 0 或 13–23，否则包含其日间时段），或在 Enter 或失焦时显示；在 'blur-or-enter' 下，仅在 Enter 或失焦时显示。被拒绝的文本保留在字段中。当新的 min、max 或 value，或禁用字段，改变拒绝时它也会运行；同一拒绝绝不运行两次；当字段在拒绝仍然存在时卸载，会以 null 调用。原生和底部抽屉界面不接受键入文本，因此从不报告。",
    "entryErrorBehavior": "字段何时显示自身的输入错误：它拒绝的键入时间（由 onEntryErrorChange 报告），或超出 min 或 max 的原生编辑。它设置错误何时显示，而不是校验何时运行，因此不是 React Aria 的 validationBehavior（原生 vs ARIA 校验），也从不改变调用方的 status。'complete' 会立即显示超出 min 或 max 的完整键入时间和超出范围的原生编辑，其他被拒绝文本则在 Enter 或失焦时显示。'blur-or-enter' 将所有拒绝保留到 Enter 或失焦：消息、aria-invalid、无效样式、宣布和 onEntryErrorChange 报告会一起出现。在这两种值下，字段接受或清空的编辑会立即清除错误；在 'blur-or-enter' 下，仍使输入错误的编辑会保留已显示的错误，直到下一次 Enter 或失焦。字段自身的值优先于最近 FormLayout 的 defaultEntryErrorBehavior。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 作为独立元素在下方浮动并留有间距；tooltip 隐藏消息框，并在状态图标上的工具提示中显示它。",
    "labelTooltip": "渲染为标签行末尾信息图标的工具提示文本。",
    "width": "字段的宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。调整整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "containerXstyle": "用于字段盒子（围绕标签、控件和状态）的 StyleX 样式。containerClassName 和 containerStyle 为同一个盒子提供类名和内联样式。在没有渲染 Field 盒子的地方无效（开发环境警告）：在 InputGroup 内（请为分组设置样式）以及水平标签的 FormLayout 中。",
    "controlXstyle": "用于视觉控件盒子的 StyleX 样式：即包含文本、图标和末端控件（绝不是原生输入框）的带边框元素。controlClassName 和 controlStyle 为同一个盒子提供类名和内联样式。会替换根级 xstyle、className 和 style，本组件不接受这些属性。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Time input with browser/OS picker on touch by default and Astryx typed-field fallbacks for seconds or custom increments.',
  usage: {
    description:
      'TimeInput uses a browser/OS picker on coarse pointers by default and Astryx typed entry on fine pointers. It standardizes values and supports arrow-key adjustment on the typed surface.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the time input, the element that is focused and announced. A DOM handler runs after TimeInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          "Leave hourFormat unset to follow the provider locale's hour cycle; put a person's 12/24h preference on the locale tag (en-US-u-hc-h23), not on each field.",
      },
      {
        guidance: true,
        description:
          'Set min/max constraints for valid ranges like business hours.',
      },
      {
        guidance: true,
        description:
          'Provide description or placeholder hinting at expected format.',
      },
      {
        guidance: true,
        description: 'Use status prop for inline validation errors.',
      },
      {guidance: true, description: 'Enable hasClear for optional fields.'},
      {
        guidance: true,
        description:
          'Place inside InputGroup for a single-line prefix or suffix addon, like a label or timezone marker.',
      },
      {
        guidance: false,
        description:
          "Don't use for date-and-time; pair with DateInput instead.",
      },
      {
        guidance: false,
        description: "Don't hide the label; keep it visible for clarity.",
      },
      {
        guidance: false,
        description:
          "Don't wrap a disabled TimeInput in Tooltip; use the disabledMessage prop instead.",
      },
    ],
  },
  propDescriptions: {
    label: 'Label text (required for a11y).',
    isLabelHidden: 'Visually hides label; keeps screen reader access.',
    description: 'Description text between label+input.',
    isOptional:
      'Shows "(optional)" indicator. Mutually exclusive w/ isRequired.',
    isRequired:
      'Marks required+sets aria-required. Mutually exclusive w/ isOptional.',
    isDisabled: 'Disables input, suppresses interactions.',
    disabledMessage:
      'Reason shown in a tooltip on hover/focus when disabled; describes the input.',
    value: 'Controlled time in ISO format (HH:MM or HH:MM:SS).',
    onChange: 'Fired on time change. Receives undefined when cleared.',
    changeAction:
      'Async action after onChange in React transition; triggers spinner while pending.',
    isLoading: 'Loading state w/ spinner.',
    min: 'Min selectable time in ISO format. Out-of-range rejected.',
    max: 'Max selectable time in ISO format. Out-of-range rejected.',
    hasSeconds: 'Includes seconds in display+parsing.',
    hasClear: 'Shows clear button when value set+not disabled.',
    hourFormat:
      "Display format. '12h' shows the locale's day period; '24h' uses 24-hour notation. Unset follows the provider locale's hour cycle (a -u-hc- tag carries a user preference).",
    increment:
      'Minutes to add/subtract on arrow up/down. Whole minutes only; a fractional value leaves the time unchanged.',
    presentation:
      "picker surface: 'adaptive-native' (default) = typed field fine / browser/OS coarse (hasSeconds or increment!=1 retains typed); 'native' = browser/OS always, no fallback; 'adaptive-bottom-sheet' = typed fine / Astryx wheel sheet coarse; 'bottom-sheet' = sheet always; 'text-input'/'popover' = typed field only.",
    nativePicker:
      "deprecated, use presentation: 'touch'='adaptive-native', 'always'='native', 'never'='text-input'. still works as released; presentation wins if both set.",
    placeholder: 'Placeholder when empty. Focused+empty shows format hint.',
    size: 'Input element height.',
    status:
      'Colored border+icon. Message rendered below input. A rejected typed time or native edit outside min/max shows its own error instead; an error status w/ message wins (rejection still announced); warning/success never hide a rejection.',
    onEntryErrorChange:
      "(error|null) on each typed-rejection change: kind 'unreadable'|'outOfRange' (min/max), text, value (ISO time, outOfRange); shows when the typed time is complete (12h: day period unless hour 0/13-23) or at Enter/blur under complete, only at Enter/blur under blur-or-enter, text kept; also on new min/max/value, disable; never twice for one rejection; null on unmount mid-rejection; never on native/sheet",
    entryErrorBehavior:
      "'complete'|'blur-or-enter': when the field's own rejection shows (not when validation runs; not React Aria validationBehavior; never changes status). complete: complete out-of-range typed time and native out-of-range edit at once, other text at Enter/blur. blur-or-enter: message, aria-invalid, styling, announcement and onEntryErrorChange report all wait for Enter/blur. Accepted or emptied entry clears at once; still-wrong edit keeps a shown error (blur-or-enter). Default: nearest FormLayout defaultEntryErrorBehavior, else complete",
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'Tooltip as info icon at label row end.',
    containerXstyle:
      'Field box (label+control+status); also containerClassName/containerStyle. no effect in InputGroup or horizontal-labels FormLayout',
    controlXstyle:
      'visual control box (border/bg/icons), never the native input; also controlClassName/controlStyle. no root xstyle/className/style',
  },
};
