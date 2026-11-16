// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DateInput',
  displayName: 'Date Input',
  group: 'DateInput',
  category: 'Form Controls',
  keywords: [
    'dateinput',
    'datepicker',
    'datefield',
    'calendar',
    'dateselect',
    'dateentry',
    'datechooser',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Label text.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description: 'Visually hide the label.',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Helper text displayed below the label.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description: 'Show an "(optional)" indicator next to the label.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description: 'Mark the field as required.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Disable the input and calendar. The field stays focusable and exposes `aria-disabled`; typing and opening are blocked.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus (activation stays blocked). Use this instead of wrapping a disabled DateInput in Tooltip.',
    },
    {
      name: 'value',
      type: 'ISODateString',
      description: 'Selected date in YYYY-MM-DD format.',
    },
    {
      name: 'onChange',
      type: '(value: ISODateString | undefined) => void',
      description: 'Callback invoked when the selected date changes.',
    },
    {
      name: 'changeAction',
      type: '(value: ISODateString | undefined) => void | Promise<void>',
      description:
        'Async action fired after onChange. Drives optimistic UI updates via useTransition.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the input is in a loading state. The field stays focusable and exposes `aria-busy` with a spinner; typing, picking, and clearing are blocked until loading ends.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISODateString',
      description: 'Minimum selectable date (YYYY-MM-DD).',
    },
    {
      name: 'max',
      type: 'ISODateString',
      description: 'Maximum selectable date (YYYY-MM-DD).',
    },
    {
      name: 'dateConstraints',
      type: 'ReadonlyArray<(date: Date) => boolean>',
      description:
        'Array of custom constraint functions that disable specific dates.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder text shown in the text input. A caller placeholder replaces the calendar format hint.',
      default: "'Select a date'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the input control.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description:
        'Status indicator object for error, warning, or success states with a message. For a date the field rejects, typed or picked in the native control, and for unreadable or unfinished text that Enter or blur keeps, the field shows its own error message instead; with onEntryErrorChange, an error status with a message shows in place of that message. A warning or success never replaces a rejection.',
    },
    {
      name: 'onEntryErrorChange',
      type: "(error: {kind: 'unreadable' | 'incomplete' | 'nonexistent' | 'outOfRange' | 'unavailable', text: string, date?: ISODateString} | null) => void",
      description:
        "Called each time the field's rejection of typed text changes, and with null when the rejection ends. kind is 'unreadable', 'incomplete' (part of a date that Enter or blur cannot finish), 'nonexistent' (a date the calendar does not have), 'outOfRange' (before min or after max), or 'unavailable' (a day dateConstraints rules out); text is the typed text; date is the Gregorian ISO date the text names, for 'outOfRange' and 'unavailable'. It also runs when a new min, max, dateConstraints, or value, a calendar pick, disabling the field, or Enter or blur changes the rejection, and never twice for the same rejection; it reports null when the typed field leaves while its rejection stands, as when a presentation or pointer change shows the native or touch picker. With it, an error status with a message replaces the field's own message, and a rejection that starts under an unchanged error message announces that message once. The native and touch pickers take no typed text, so it never reports a rejection there.",
    },
    {
      name: 'entryErrorBehavior',
      type: "'complete' | 'blur-or-enter'",
      description:
        "When the field shows its own entry error: a typed date it rejects, as onEntryErrorChange reports it. It sets when the error shows, not when validation runs, so it is not React Aria's validationBehavior (native versus ARIA validation), and it never changes a caller status. 'complete' shows a date the calendar does not have, or one outside min, max, or dateConstraints, as soon as the typed date is complete, and unreadable or unfinished text at Enter or blur. 'blur-or-enter' holds every rejection until Enter or blur: the message, aria-invalid, the invalid styling, the announcement, and the onEntryErrorChange report then appear together. Under both values, an edit that makes the text a date or empties it clears the error at once; under 'blur-or-enter', an edit that leaves the text wrong keeps the shown error until the next Enter or blur. A date the native control refuses shows at Enter or blur under both values. The field's own value wins over the nearest FormLayout's defaultEntryErrorBehavior.",
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
        'Tooltip text displayed via an info icon at the end of the label.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description:
        'Shows a clear (\u00d7) button when a date value is set. Clicking it clears the value and returns focus to the input.',
      default: 'false',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description:
        'Number of months displayed simultaneously in the calendar popover.',
      default: '1',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'First day of week in Astryx calendar surfaces. A number (0 = Sunday to 6 = Saturday) or a three-letter day name; native pickers remain browser/OS-owned.',
      default: '0',
    },
    {
      name: 'format',
      type: "'date' | 'date_long' | 'date_weekday' | 'system_date' | ((value: ISODateString) => string)",
      description:
        "How the committed date value is displayed. Named values are reused from Timestamp's format vocabulary: 'date' shows 'Mar 21, 2026', 'date_long' shows 'March 21, 2026', 'date_weekday' shows 'Wed, Mar 21, 2026', 'system_date' shows '2026-03-21'. 'date', 'date_long', and 'date_weekday' write the date in the field's calendar; 'system_date' stays the Gregorian ISO date. A function receives the ISO value and returns a custom string; the field cannot re-commit text it cannot read back. Applies only to the committed value, never to text being typed.",
      default: "'date_long'",
    },
    {
      name: 'calendar',
      type: "'gregory' | 'iso8601' | 'buddhist' | 'roc' | 'japanese' | 'persian' | 'indian' | 'hebrew' | 'chinese' | 'dangi' | 'coptic' | 'ethiopic' | 'ethioaa' | 'islamic-civil' | 'islamic-tbla' | 'islamic-umalqura'",
      description:
        'The calendar the text field reads and writes dates in, and the calendar its popover and bottom sheet show. value, onChange, min, and max stay Gregorian ISO dates. People type a date the way the locale writes it in this calendar, in any decimal digits; the field reports a date only once it is complete, and names a date the calendar does not have. Years are years of this calendar: a Buddhist field reads 2026 as Buddhist year 2026, so set min and max on Buddhist and Minguo calendar fields to catch a Gregorian year typed by mistake. Calendars other than gregory, iso8601, buddhist, roc, and japanese need Temporal, native or a polyfill the application loads; without it the field shows Gregorian dates. With a calendar other than gregory or iso8601, a presentation that would show the native date control shows the popover on a fine pointer and the bottom sheet on a coarse pointer, because the native control is Gregorian; the bottom sheet shows the months, leap months, and era years of the calendar. A year in which the era changes is labeled with the era of the shown month, such as 平成31 in January 2019 and 令和元 in July.',
      default: "the InternationalizationProvider's calendar, else 'gregory'",
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      description:
        "Which surface draws the date picker. 'adaptive-native' (the default) uses Astryx's calendar popover on a fine pointer and the browser/OS picker (input type=date) on a coarse pointer, keeping Astryx fallbacks where a native control cannot express the value; 'native' always uses the browser/OS picker with no fallback; 'adaptive-bottom-sheet' uses the popover on a fine pointer and Astryx's bottom-sheet picker on a coarse pointer; 'popover' and 'bottom-sheet' force that Astryx surface on every pointer. Every value opens a picker; a typed-only field is TimeInput's alone. Use a non-native presentation for a field that needs weekStartsOn, numberOfMonths or dateConstraints, none of which a native picker can express. With a calendar other than gregory or iso8601, 'native' and 'adaptive-native' use the popover on a fine pointer and the bottom sheet on a coarse pointer, and an explicit 'native' warns in development.",
      default: "'adaptive-native'",
    },
    {
      name: 'nativePicker',
      type: "'touch' | 'always' | 'never'",
      description:
        "Deprecated: use presentation ('touch' = 'adaptive-native', 'always' = 'native', 'never' = 'adaptive-bottom-sheet'). Still works exactly as released; presentation wins when both are set. With a calendar other than gregory or iso8601, 'touch' and 'always' use the popover on a fine pointer and the bottom sheet on a coarse pointer.",
      default: "'touch'",
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
    {
      name: 'controlXstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the visual control box: the bordered element that holds the text, icons, and end controls, never the native input. controlClassName and controlStyle take a class name and inline styles for the same box. Replaces root xstyle, className, and style, which this component does not accept.',
    },
    {
      name: 'controlClassName',
      type: 'string',
      description:
        'Class name for the visual control box. Same targeting as controlXstyle.',
    },
    {
      name: 'controlStyle',
      type: 'CSSProperties',
      description:
        'Inline styles for the visual control box. Same targeting as controlXstyle.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-date-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
      {className: 'astryx-date-input-toggle-icon', states: ['state']},
    ],
  },
  usage: {
    description:
      'DateInput lets the user type or pick a date from a calendar popover. Use it for scheduling, deadlines, booking dates, or any form field that needs a specific calendar date.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the date input, the element that is focused and announced. A DOM handler runs after DateInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          'Provide clear labels and descriptions so users understand what date is expected.',
      },
      {
        guidance: true,
        description:
          'Use min, max, and dateConstraints to restrict selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Set min and max on a Buddhist or Minguo calendar field, so a Gregorian year typed by mistake shows an error instead of a date centuries away.',
      },
      {
        guidance: true,
        description:
          'Use hasClear when the date is optional so the user can reset it.',
      },
      {
        guidance: true,
        description:
          'Show a loading state with changeAction when the date triggers a server-side save.',
      },
      {
        guidance: true,
        description:
          'On a fine pointer the field follows the WAI-ARIA combobox pattern with a dialog popup, as in the APG date picker combobox: ArrowDown or Alt+ArrowDown opens the calendar, and Escape closes it and returns focus to the field.',
      },
      {
        guidance: true,
        description:
          'Use DateInput inside InputGroup when adding a short static prefix or suffix, such as a due-date hint.',
      },
      {
        guidance: false,
        description:
          'Use a DateInput for free-form text that does not represent a calendar date.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the field purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Rely on the calendar alone; the text input lets users type dates directly, which is faster for known dates.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateInput in Tooltip to explain why it is disabled. Use the disabledMessage prop instead, which ties the reason to the field.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description: 'Text above the input describing what date is expected.',
      },
      {
        name: 'Text input',
        required: true,
        description:
          "A field where the user can type a date directly, written the way the locale writes it in the field's calendar.",
      },
      {
        name: 'Calendar icon',
        required: true,
        description:
          'A button that opens the calendar popover for visual date picking.',
      },
      {
        name: 'Calendar popover',
        required: false,
        description:
          'A month grid that appears when the icon or the input is clicked, or when ArrowDown is pressed in the input.',
      },
      {
        name: 'Clear button',
        required: false,
        description:
          'A × button that resets the date value. Shown when hasClear is true and a date is set.',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the input.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "DateInput",
  "displayName": "Date Input",
  "usage": {
    "description": "DateInput 允许用户输入日期或从日历弹出层中选择日期。用于日程安排、截止日期、预订日期，或任何需要特定日历日期的表单字段。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "基础属性（如 ref、id、data-*、aria-* 和 DOM 事件处理函数）会传给日期输入框，即被聚焦和播报的元素。对于同一事件，DOM 处理函数在 DateInput 自身的处理函数之后运行，并且仍会收到它已处理的事件（包括调用了 preventDefault 的事件），因此无法取消内置行为。"
      },
      {
        "guidance": true,
        "description": "提供清晰的标签和描述，让用户了解期望的日期。"
      },
      {
        "guidance": true,
        "description": "使用 min、max 和 dateConstraints 将可选日期限制在有效范围内。"
      },
      {
        "guidance": true,
        "description": "在佛历或民国历字段上设置 min 和 max，这样误输入的格里高利年份会显示错误，而不是一个相差几个世纪的日期。"
      },
      {
        "guidance": true,
        "description": "当日期可选时使用 hasClear，以便用户可以重置它。"
      },
      {
        "guidance": true,
        "description": "当日期触发服务器端保存时，使用 changeAction 显示加载状态。"
      },
      {
        "guidance": true,
        "description": "在精确指针设备上，该字段遵循 WAI-ARIA 组合框模式并带有对话框弹出层，如同 APG 日期选择器组合框：ArrowDown 或 Alt+ArrowDown 打开日历，Escape 关闭它并将焦点返回字段。"
      },
      {
        "guidance": true,
        "description": "在 InputGroup 内使用 DateInput 来添加简短的静态前缀或后缀，例如截止日期提示。"
      },
      {
        "guidance": false,
        "description": "对不代表日历日期的自由格式文本使用 DateInput。"
      },
      {
        "guidance": false,
        "description": "在没有能说明字段用途的周围上下文时隐藏标签。"
      },
      {
        "guidance": false,
        "description": "仅依赖日历；文本输入让用户可以直接输入日期，对于已知日期更快。"
      },
      {
        "guidance": false,
        "description": "将禁用的 DateInput 包裹在 Tooltip 中以解释其禁用原因。请改用 disabledMessage 属性，它会把原因与字段关联起来。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "输入框上方描述期望日期的文本。"
      },
      {
        "name": "文本输入框",
        "required": true,
        "description": "用户可直接输入日期的字段，按区域设置在字段日历中的书写方式书写。"
      },
      {
        "name": "日历图标",
        "required": true,
        "description": "打开日历弹出层以进行可视化日期选择的按钮。"
      },
      {
        "name": "日历弹出层",
        "required": false,
        "description": "点击图标或输入框，或在输入框中按 ArrowDown 时出现的月份网格。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "重置日期值的 × 按钮。当 hasClear 为 true 且已设置日期时显示。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "输入框下方的错误、警告或成功消息。"
      }
    ]
  },
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "标签文本。",
      "required": true
    },
    {
      "name": "isLabelHidden",
      "type": "boolean",
      "description": "在视觉上隐藏标签。",
      "default": "false"
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标签下方的辅助文本。"
    },
    {
      "name": "isOptional",
      "type": "boolean",
      "description": "在标签旁显示“(可选)”指示符。",
      "default": "false"
    },
    {
      "name": "isRequired",
      "type": "boolean",
      "description": "将字段标记为必填。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用输入框和日历。字段仍可聚焦并暴露 `aria-disabled`；输入和打开操作被阻止。",
      "default": "false"
    },
    {
      "name": "disabledMessage",
      "type": "string",
      "description": "说明输入框被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示（激活仍被阻止）。请使用此属性，而不要将禁用的 DateInput 包裹在 Tooltip 中。"
    },
    {
      "name": "value",
      "type": "ISODateString",
      "description": "所选日期，格式为 YYYY-MM-DD。"
    },
    {
      "name": "onChange",
      "type": "(value: ISODateString | undefined) => void",
      "description": "所选日期更改时调用的回调。"
    },
    {
      "name": "changeAction",
      "type": "(value: ISODateString | undefined) => void | Promise<void>",
      "description": "onChange 之后触发的异步操作。通过 useTransition 驱动乐观 UI 更新。"
    },
    {
      "name": "isLoading",
      "type": "boolean",
      "description": "输入框是否处于加载状态。字段仍可聚焦并暴露 `aria-busy` 和加载指示器；在加载结束前，输入、选择和清除都被阻止。",
      "default": "false"
    },
    {
      "name": "min",
      "type": "ISODateString",
      "description": "可选的最小日期（YYYY-MM-DD）。"
    },
    {
      "name": "max",
      "type": "ISODateString",
      "description": "可选的最大日期（YYYY-MM-DD）。"
    },
    {
      "name": "dateConstraints",
      "type": "ReadonlyArray<(date: Date) => boolean>",
      "description": "禁用特定日期的自定义约束函数数组。"
    },
    {
      "name": "placeholder",
      "type": "string",
      "description": "文本输入框中显示的占位符文本。调用方提供的占位符会替换日历格式提示。",
      "default": "'Select a date'"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "输入控件的大小。",
      "default": "'md'"
    },
    {
      "name": "status",
      "type": "{type: 'warning' | 'error' | 'success', message?: string}",
      "description": "用于错误、警告或成功状态及其消息的状态指示符对象。对于字段拒绝的日期（通过输入或在原生控件中选择），以及按 Enter 或失焦时保留的无法读取或不完整的文本，字段会显示自己的错误消息；使用 onEntryErrorChange 时，带消息的错误状态会替代该消息显示。警告或成功永远不会取代拒绝。"
    },
    {
      "name": "onEntryErrorChange",
      "type": "(error: {kind: 'unreadable' | 'incomplete' | 'nonexistent' | 'outOfRange' | 'unavailable', text: string, date?: ISODateString} | null) => void",
      "description": "每次字段对输入文本的拒绝发生变化时调用，并在拒绝结束时以 null 调用。kind 为 'unreadable'、'incomplete'（按 Enter 或失焦无法补全的日期的一部分）、'nonexistent'（日历中不存在的日期）、'outOfRange'（早于 min 或晚于 max）或 'unavailable'（dateConstraints 排除的日期）；text 是输入的文本；date 是文本所指的格里高利 ISO 日期，适用于 'outOfRange' 和 'unavailable'。当新的 min、max、dateConstraints 或 value、日历选择、禁用字段，或 Enter 或失焦改变了拒绝状态时，它也会运行，且同一拒绝绝不会运行两次；当输入字段离开但其拒绝仍存在时（例如 presentation 或指针变化显示原生或触摸选择器），它报告 null。使用它时，带消息的错误状态会替换字段自己的消息，而在错误消息不变的情况下开始的拒绝会播报该消息一次。原生和触摸选择器不接受输入文本，因此从不在那里报告拒绝。"
    },
    {
      "name": "entryErrorBehavior",
      "type": "'complete' | 'blur-or-enter'",
      "description": "字段何时显示其自身的输入错误：它拒绝的输入日期，正如 onEntryErrorChange 所报告的那样。它设置错误何时显示，而不是验证何时运行，因此不是 React Aria 的 validationBehavior（原生验证与 ARIA 验证），它也永远不会改变调用方的状态。'complete' 会在输入的日期完整时立即显示日历中不存在的日期，或超出 min、max 或 dateConstraints 的日期，并在按 Enter 或失焦时显示无法读取或不完整的文本。'blur-or-enter' 会将每个拒绝都保留到按 Enter 或失焦：消息、aria-invalid、无效样式、播报以及 onEntryErrorChange 报告会一起出现。在两种取值下，使文本成为日期或清空文本的编辑会立即清除错误；在 'blur-or-enter' 下，使文本保持错误的编辑会保留已显示的错误，直到下一次按 Enter 或失焦。原生控件拒绝的日期在两种取值下都会在按 Enter 或失焦时显示。字段自身的值优先于最近的 FormLayout 的 defaultEntryErrorBehavior。",
      "default": "最近的 FormLayout 的 defaultEntryErrorBehavior，否则为 'complete'"
    },
    {
      "name": "statusVariant",
      "type": "'attached' | 'detached' | 'tooltip'",
      "description": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 以带间距的独立元素浮动在下方；tooltip 隐藏消息框，并在状态图标的工具提示中显示它。",
      "default": "'attached'"
    },
    {
      "name": "labelTooltip",
      "type": "string",
      "description": "通过标签末尾的信息图标显示的工具提示文本。"
    },
    {
      "name": "hasClear",
      "type": "boolean",
      "description": "设置日期值时显示清除（×）按钮。点击它清除值并将焦点返回输入框。",
      "default": "false"
    },
    {
      "name": "numberOfMonths",
      "type": "1 | 2",
      "description": "日历弹出层中同时显示的月份数。",
      "default": "1"
    },
    {
      "name": "weekStartsOn",
      "type": "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      "description": "Astryx 日历界面中每周的第一天。一个数字（0 = 星期日到 6 = 星期六）或三个字母的星期名称；原生选择器仍由浏览器/操作系统控制。",
      "default": "0"
    },
    {
      "name": "format",
      "type": "'date' | 'date_long' | 'date_weekday' | 'system_date' | ((value: ISODateString) => string)",
      "description": "已提交日期值的显示方式。命名值复用 Timestamp 的格式词汇：'date' 显示 'Mar 21, 2026'，'date_long' 显示 'March 21, 2026'，'date_weekday' 显示 'Wed, Mar 21, 2026'，'system_date' 显示 '2026-03-21'。'date'、'date_long' 和 'date_weekday' 按字段的日历书写日期；'system_date' 保持格里高利 ISO 日期。函数接收 ISO 值并返回自定义字符串；字段无法重新提交它无法读回的文本。仅适用于已提交的值，绝不适用于正在输入的文本。",
      "default": "'date_long'"
    },
    {
      "name": "calendar",
      "type": "'gregory' | 'iso8601' | 'buddhist' | 'roc' | 'japanese' | 'persian' | 'indian' | 'hebrew' | 'chinese' | 'dangi' | 'coptic' | 'ethiopic' | 'ethioaa' | 'islamic-civil' | 'islamic-tbla' | 'islamic-umalqura'",
      "description": "文本字段读写日期所用的日历，也是其弹出层和底部工作表显示的日历。value、onChange、min 和 max 保持格里高利 ISO 日期。人们按区域设置在该日历中的书写方式输入日期，可使用任意十进制数字；字段仅在日期完整时才报告日期，并会指出日历中不存在的日期。年份是该日历的年份：佛历字段会将 2026 读作佛历 2026 年，因此请在佛历和民国历字段上设置 min 和 max，以捕获误输入的格里高利年份。除 gregory、iso8601、buddhist、roc 和 japanese 之外的日历需要 Temporal、原生或应用加载的 polyfill；没有它，字段显示格里高利日期。使用 gregory 或 iso8601 之外的日历时，本应显示原生日期控件的 presentation 会在精确指针上显示弹出层，在粗略指针上显示底部工作表，因为原生控件是格里高利的；底部工作表会显示该日历的月份、闰月和纪元年份。纪元发生变化的年份会以所显示月份的纪元标注，例如 2019 年 1 月的平成31 和 7 月的令和元。",
      "default": "InternationalizationProvider 的历法，否则为 'gregory'"
    },
    {
      "name": "presentation",
      "type": "'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'",
      "description": "由哪个界面绘制日期选择器。'adaptive-native'（默认）在精确指针上使用 Astryx 的日历弹出层，在粗略指针上使用浏览器/操作系统选择器（input type=date），并在原生控件无法表达该值时保留 Astryx 回退；'native' 始终使用浏览器/操作系统选择器且无回退；'adaptive-bottom-sheet' 在精确指针上使用弹出层，在粗略指针上使用 Astryx 的底部工作表选择器；'popover' 和 'bottom-sheet' 在所有指针上强制使用该 Astryx 界面。每个值都会打开选择器；仅输入字段是 TimeInput 独有的。对于需要 weekStartsOn、numberOfMonths 或 dateConstraints 的字段，请使用非原生 presentation，因为原生选择器无法表达这些。使用 gregory 或 iso8601 之外的日历时，'native' 和 'adaptive-native' 在精确指针上使用弹出层，在粗略指针上使用底部工作表，而显式的 'native' 会在开发环境中发出警告。",
      "default": "'adaptive-native'"
    },
    {
      "name": "nativePicker",
      "type": "'touch' | 'always' | 'never'",
      "description": "已弃用：请使用 presentation（'touch' = 'adaptive-native'，'always' = 'native'，'never' = 'adaptive-bottom-sheet'）。仍完全按已发布的方式工作；同时设置时 presentation 优先。使用 gregory 或 iso8601 之外的日历时，'touch' 和 'always' 在精确指针上使用弹出层，在粗略指针上使用底部工作表。",
      "default": "'touch'"
    },
    {
      "name": "width",
      "type": "SizeValue",
      "description": "字段的宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使其保持对齐。"
    },
    {
      "name": "containerXstyle",
      "type": "StyleXStyles",
      "description": "用于标签、控件和状态周围 Field 盒子的 StyleX 样式。containerClassName 和 containerStyle 为同一盒子接受类名和内联样式。在不渲染 Field 盒子的地方无效（开发环境警告）：在 InputGroup 内（请为组设置样式）和水平标签的 FormLayout 中。"
    },
    {
      "name": "containerClassName",
      "type": "string",
      "description": "Field 盒子的类名。定位方式与 containerXstyle 相同。"
    },
    {
      "name": "containerStyle",
      "type": "CSSProperties",
      "description": "Field 盒子的内联样式。定位方式与 containerXstyle 相同。"
    },
    {
      "name": "controlXstyle",
      "type": "StyleXStyles",
      "description": "用于视觉控件盒子的 StyleX 样式：容纳文本、图标和末尾控件的带边框元素，绝不是原生输入框。controlClassName 和 controlStyle 为同一盒子接受类名和内联样式。替换根级 xstyle、className 和 style，此组件不接受它们。"
    },
    {
      "name": "controlClassName",
      "type": "string",
      "description": "视觉控件盒子的类名。定位方式与 controlXstyle 相同。"
    },
    {
      "name": "controlStyle",
      "type": "CSSProperties",
      "description": "视觉控件盒子的内联样式。定位方式与 controlXstyle 相同。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-date-input",
        "visualProps": [
          "size",
          "status"
        ],
        "states": [
          "disabled"
        ]
      },
      {
        "className": "astryx-date-input-toggle-icon",
        "states": [
          "state"
        ]
      }
    ]
  },
  "propDescriptions": {
    "label": "标签文本。",
    "isLabelHidden": "在视觉上隐藏标签。",
    "description": "显示在标签下方的辅助文本。",
    "isOptional": "在标签旁显示“(可选)”指示符。",
    "isRequired": "将字段标记为必填。",
    "isDisabled": "禁用输入框和日历。字段仍可聚焦并暴露 `aria-disabled`；输入和打开操作被阻止。",
    "disabledMessage": "说明输入框被禁用的原因。与 isDisabled 一起使用时，在悬停/键盘聚焦时显示工具提示（激活仍被阻止）。请使用此属性，而不要将禁用的 DateInput 包裹在 Tooltip 中。",
    "value": "所选日期，格式为 YYYY-MM-DD。",
    "onChange": "所选日期更改时调用的回调。",
    "changeAction": "onChange 之后触发的异步操作。通过 useTransition 驱动乐观 UI 更新。",
    "isLoading": "输入框是否处于加载状态。字段仍可聚焦并暴露 `aria-busy` 和加载指示器；在加载结束前，输入、选择和清除都被阻止。",
    "min": "可选的最小日期（YYYY-MM-DD）。",
    "max": "可选的最大日期（YYYY-MM-DD）。",
    "dateConstraints": "禁用特定日期的自定义约束函数数组。",
    "placeholder": "文本输入框中显示的占位符文本。调用方提供的占位符会替换日历格式提示。",
    "size": "输入控件的大小。",
    "status": "用于错误、警告或成功状态及其消息的状态指示符对象。对于字段拒绝的日期（通过输入或在原生控件中选择），以及按 Enter 或失焦时保留的无法读取或不完整的文本，字段会显示自己的错误消息；使用 onEntryErrorChange 时，带消息的错误状态会替代该消息显示。警告或成功永远不会取代拒绝。",
    "onEntryErrorChange": "每次字段对输入文本的拒绝发生变化时调用，并在拒绝结束时以 null 调用。kind 为 'unreadable'、'incomplete'（按 Enter 或失焦无法补全的日期的一部分）、'nonexistent'（日历中不存在的日期）、'outOfRange'（早于 min 或晚于 max）或 'unavailable'（dateConstraints 排除的日期）；text 是输入的文本；date 是文本所指的格里高利 ISO 日期，适用于 'outOfRange' 和 'unavailable'。当新的 min、max、dateConstraints 或 value、日历选择、禁用字段，或 Enter 或失焦改变了拒绝状态时，它也会运行，且同一拒绝绝不会运行两次；当输入字段离开但其拒绝仍存在时（例如 presentation 或指针变化显示原生或触摸选择器），它报告 null。使用它时，带消息的错误状态会替换字段自己的消息，而在错误消息不变的情况下开始的拒绝会播报该消息一次。原生和触摸选择器不接受输入文本，因此从不在那里报告拒绝。",
    "entryErrorBehavior": "字段何时显示其自身的输入错误：它拒绝的输入日期，正如 onEntryErrorChange 所报告的那样。它设置错误何时显示，而不是验证何时运行，因此不是 React Aria 的 validationBehavior（原生验证与 ARIA 验证），它也永远不会改变调用方的状态。'complete' 会在输入的日期完整时立即显示日历中不存在的日期，或超出 min、max 或 dateConstraints 的日期，并在按 Enter 或失焦时显示无法读取或不完整的文本。'blur-or-enter' 会将每个拒绝都保留到按 Enter 或失焦：消息、aria-invalid、无效样式、播报以及 onEntryErrorChange 报告会一起出现。在两种取值下，使文本成为日期或清空文本的编辑会立即清除错误；在 'blur-or-enter' 下，使文本保持错误的编辑会保留已显示的错误，直到下一次按 Enter 或失焦。原生控件拒绝的日期在两种取值下都会在按 Enter 或失焦时显示。字段自身的值优先于最近的 FormLayout 的 defaultEntryErrorBehavior。",
    "statusVariant": "状态消息相对于输入框的放置方式。attached 直接重叠在输入框下方（带边框处理）；detached 以带间距的独立元素浮动在下方；tooltip 隐藏消息框，并在状态图标的工具提示中显示它。",
    "labelTooltip": "通过标签末尾的信息图标显示的工具提示文本。",
    "hasClear": "设置日期值时显示清除（×）按钮。点击它清除值并将焦点返回输入框。",
    "numberOfMonths": "日历弹出层中同时显示的月份数。",
    "weekStartsOn": "Astryx 日历界面中每周的第一天。一个数字（0 = 星期日到 6 = 星期六）或三个字母的星期名称；原生选择器仍由浏览器/操作系统控制。",
    "format": "已提交日期值的显示方式。命名值复用 Timestamp 的格式词汇：'date' 显示 'Mar 21, 2026'，'date_long' 显示 'March 21, 2026'，'date_weekday' 显示 'Wed, Mar 21, 2026'，'system_date' 显示 '2026-03-21'。'date'、'date_long' 和 'date_weekday' 按字段的日历书写日期；'system_date' 保持格里高利 ISO 日期。函数接收 ISO 值并返回自定义字符串；字段无法重新提交它无法读回的文本。仅适用于已提交的值，绝不适用于正在输入的文本。",
    "calendar": "文本字段读写日期所用的日历，也是其弹出层和底部工作表显示的日历。value、onChange、min 和 max 保持格里高利 ISO 日期。人们按区域设置在该日历中的书写方式输入日期，可使用任意十进制数字；字段仅在日期完整时才报告日期，并会指出日历中不存在的日期。年份是该日历的年份：佛历字段会将 2026 读作佛历 2026 年，因此请在佛历和民国历字段上设置 min 和 max，以捕获误输入的格里高利年份。除 gregory、iso8601、buddhist、roc 和 japanese 之外的日历需要 Temporal、原生或应用加载的 polyfill；没有它，字段显示格里高利日期。使用 gregory 或 iso8601 之外的日历时，本应显示原生日期控件的 presentation 会在精确指针上显示弹出层，在粗略指针上显示底部工作表，因为原生控件是格里高利的；底部工作表会显示该日历的月份、闰月和纪元年份。纪元发生变化的年份会以所显示月份的纪元标注，例如 2019 年 1 月的平成31 和 7 月的令和元。",
    "presentation": "由哪个界面绘制日期选择器。'adaptive-native'（默认）在精确指针上使用 Astryx 的日历弹出层，在粗略指针上使用浏览器/操作系统选择器（input type=date），并在原生控件无法表达该值时保留 Astryx 回退；'native' 始终使用浏览器/操作系统选择器且无回退；'adaptive-bottom-sheet' 在精确指针上使用弹出层，在粗略指针上使用 Astryx 的底部工作表选择器；'popover' 和 'bottom-sheet' 在所有指针上强制使用该 Astryx 界面。每个值都会打开选择器；仅输入字段是 TimeInput 独有的。对于需要 weekStartsOn、numberOfMonths 或 dateConstraints 的字段，请使用非原生 presentation，因为原生选择器无法表达这些。使用 gregory 或 iso8601 之外的日历时，'native' 和 'adaptive-native' 在精确指针上使用弹出层，在粗略指针上使用底部工作表，而显式的 'native' 会在开发环境中发出警告。",
    "nativePicker": "已弃用：请使用 presentation（'touch' = 'adaptive-native'，'always' = 'native'，'never' = 'adaptive-bottom-sheet'）。仍完全按已发布的方式工作；同时设置时 presentation 优先。使用 gregory 或 iso8601 之外的日历时，'touch' 和 'always' 在精确指针上使用弹出层，在粗略指针上使用底部工作表。",
    "width": "字段的宽度（数字 = 像素，字符串按原样使用，例如 \"100%\"）。设置整个字段（标签、控件和状态）的尺寸，使其保持对齐。",
    "containerXstyle": "用于标签、控件和状态周围 Field 盒子的 StyleX 样式。containerClassName 和 containerStyle 为同一盒子接受类名和内联样式。在不渲染 Field 盒子的地方无效（开发环境警告）：在 InputGroup 内（请为组设置样式）和水平标签的 FormLayout 中。",
    "containerClassName": "Field 盒子的类名。定位方式与 containerXstyle 相同。",
    "containerStyle": "Field 盒子的内联样式。定位方式与 containerXstyle 相同。",
    "controlXstyle": "用于视觉控件盒子的 StyleX 样式：容纳文本、图标和末尾控件的带边框元素，绝不是原生输入框。controlClassName 和 controlStyle 为同一盒子接受类名和内联样式。替换根级 xstyle、className 和 style，此组件不接受它们。",
    "controlClassName": "视觉控件盒子的类名。定位方式与 controlXstyle 相同。",
    "controlStyle": "视觉控件盒子的内联样式。定位方式与 controlXstyle 相同。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'text input w/ calendar popover for picking a date',
  usage: {
    description:
      'DateInput lets the user type or pick a date from a calendar popover. Use for scheduling, deadlines, booking dates, or any form field needing a calendar date.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the date input, the element that is focused and announced. A DOM handler runs after DateInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          'Provide clear labels + descriptions so users understand what date is expected.',
      },
      {
        guidance: true,
        description:
          'Use min, max, and dateConstraints to restrict selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Set min and max on a Buddhist or Minguo calendar field, so a Gregorian year typed by mistake shows an error instead of a date centuries away.',
      },
      {
        guidance: true,
        description:
          'Use hasClear when the date is optional so the user can reset it.',
      },
      {
        guidance: true,
        description:
          'Show a loading state with changeAction when the date triggers a server-side save.',
      },
      {
        guidance: true,
        description:
          'On a fine pointer the field follows the WAI-ARIA combobox pattern with a dialog popup, as in the APG date picker combobox: ArrowDown or Alt+ArrowDown opens the calendar, and Escape closes it and returns focus to the field.',
      },
      {
        guidance: true,
        description:
          'Use inside InputGroup for a short static prefix or suffix, such as a due-date hint.',
      },
      {
        guidance: false,
        description:
          'Use a DateInput for free-form text that does not represent a calendar date.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the field purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Rely on the calendar alone; the text input lets users type dates directly, which is faster for known dates.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateInput in Tooltip to explain why it is disabled. Use the disabledMessage prop instead, which ties the reason to the field.',
      },
    ],
  },
  propDescriptions: {
    label: 'label text',
    isLabelHidden: 'visually hide label',
    description: 'helper text below label',
    isOptional: 'show "(optional)" indicator',
    isRequired: 'mark field required',
    isDisabled: 'disable input+calendar',
    disabledMessage:
      "reason shown in a tooltip on hover/focus when disabled; describes the field's focusable controls",
    value: 'selected date YYYY-MM-DD',
    onChange: 'callback on date change',
    changeAction: 'async action after onChange; drives optimistic UI',
    isLoading:
      'loading state; stays focusable w/ aria-busy + spinner; blocks typing, picking, clearing',
    min: 'min selectable date (YYYY-MM-DD)',
    max: 'max selectable date (YYYY-MM-DD)',
    dateConstraints: 'custom constraint fns to disable specific dates',
    placeholder: 'placeholder text in input',
    size: 'input control size',
    status:
      'error/warning/success status w/ message; a rejected date (typed or native) or kept unreadable/unfinished text shows its own error instead, unless onEntryErrorChange is set and status is an error w/ message',
    onEntryErrorChange:
      "(error|null) on each typed-rejection change: kind 'unreadable'|'incomplete'|'nonexistent'|'outOfRange' (min/max)|'unavailable' (dateConstraints), text, date (Gregorian ISO, outOfRange/unavailable); also on new min/max/dateConstraints/value, calendar pick, disable, Enter/blur; never twice for one rejection; null when the typed field leaves mid-rejection (presentation/pointer switch); with it an error status w/ message replaces the field's own message, re-announced once if unchanged when a rejection starts; never a rejection on native/touch pickers",
    entryErrorBehavior:
      "'complete'|'blur-or-enter': when the field's own rejection shows (not when validation runs; not React Aria validationBehavior; never changes status). complete: nonexistent/out-of-range date as soon as complete, unreadable/unfinished at Enter/blur. blur-or-enter: message, aria-invalid, styling, announcement and onEntryErrorChange report all wait for Enter/blur. Valid or emptied text clears at once; still-wrong edit keeps a shown error (blur-or-enter). Native refusals wait for Enter/blur under both. Default: nearest FormLayout defaultEntryErrorBehavior, else complete",
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'tooltip text via info icon at label end',
    hasClear: 'Shows clear button when date is set. Clears value on click.',
    numberOfMonths: 'months shown simultaneously in calendar popover',
    weekStartsOn:
      'first day of week in calendar (0=Sunday, or name e.g. "mon")',
    format:
      "committed-value display: 'date_long' (default, March 21, 2026), 'date' (Mar 21, 2026), 'date_weekday' (Wed, Mar 21, 2026), 'system_date' (2026-03-21, always Gregorian ISO), or (iso)=>string; reuses Timestamp vocabulary; named formats write the field's calendar. Committed value only, not while typing.",
    calendar:
      "calendar for typed + committed text, the popover, and the bottom sheet (months, leap months, era years; an era-change year follows the shown month, e.g. 平成31 in Jan 2019, 令和元 in Jul) (default: provider's, else 'gregory'); values stay Gregorian ISO; years are the calendar's, so set min/max on buddhist/roc fields; non-Gregorian-aligned calendars need Temporal (native or app-loaded polyfill), else Gregorian; non-gregory/iso8601 never shows the native control: popover fine / sheet coarse",
    presentation:
      "which surface draws the picker: 'adaptive-native' (default) = Astryx popover on fine, browser/OS on coarse w/ Astryx fallbacks; 'native' = browser/OS always, no fallback; 'adaptive-bottom-sheet' = popover fine / Astryx sheet coarse; 'popover'/'bottom-sheet' force Astryx. every value opens a picker (no text-only value; that is TimeInput's). use non-native for weekStartsOn/numberOfMonths/dateConstraints. non-gregory/iso8601 calendar: native + adaptive-native become popover fine / sheet coarse; explicit 'native' warns in dev.",
    nativePicker:
      "deprecated, use presentation: 'touch'='adaptive-native', 'always'='native', 'never'='adaptive-bottom-sheet'. still works as released, except that a calendar other than gregory or iso8601 never shows the native control; presentation wins if both set.",
    containerXstyle:
      'Field box (label+control+status); also containerClassName/containerStyle. no effect in InputGroup or horizontal-labels FormLayout',
    containerClassName:
      'class name for the Field box; same target as containerXstyle',
    containerStyle:
      'inline styles for the Field box; same target as containerXstyle',
    controlXstyle:
      'visual control box (border/bg/icons), never the native input; also controlClassName/controlStyle. no root xstyle/className/style',
    controlClassName:
      'class name for the visual control box; same target as controlXstyle',
    controlStyle:
      'inline styles for the visual control box; same target as controlXstyle',
  },
};
