// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DateRangeInput',
  displayName: 'Date Range Input',
  group: 'DateInput',
  category: 'Form Controls',
  keywords: [
    'daterangepicker',
    'daterange',
    'range',
    'calendar',
    'filter',
    'analytics',
    'period',
    'schedule',
  ],
  props: [
    {name: 'label', type: 'string', description: 'Label text.', required: true},
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
      description: 'Show an "(optional)" indicator.',
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
        'Disable the trigger and picker. The trigger stays focusable and exposes `aria-disabled`; opening is blocked.',
      default: 'false',
    },
    {
      name: 'disabledMessage',
      type: 'string',
      description:
        'Explains why the input is disabled. With isDisabled, shows a tooltip on hover/keyboard focus and describes the trigger (activation stays blocked). Use this instead of wrapping a disabled DateRangeInput in Tooltip.',
    },
    {
      name: 'value',
      type: 'DateRange | null',
      description:
        'Selected date range or null. Import the `DateRange` type from `@astryxdesign/core/DateRangeInput`; it is `{start: ISODateString, end: ISODateString}`. Do NOT redeclare your own DateRange type; use the exported one so TypeScript structurally matches.',
      required: true,
    },
    {
      name: 'onChange',
      type: '(value: DateRange | null) => void',
      description:
        'Callback when the range changes. Called with null on clear.',
      required: true,
    },
    {
      name: 'changeAction',
      type: '(value: DateRange | null) => void | Promise<void>',
      description:
        'Async action fired after onChange. Drives optimistic UI updates via useTransition.',
    },
    {
      name: 'isLoading',
      type: 'boolean',
      description:
        'Whether the input is in a loading state. Disables interaction and shows a spinner.',
      default: 'false',
    },
    {
      name: 'min',
      type: 'ISODateString',
      description:
        'Minimum selectable date. `ISODateString` is a template literal type (`\\`${number}${number}${number}${number}-${number}${number}-${number}${number}\\``). Pass a string literal like `"2026-01-28"`, not a runtime string variable. Import it from `@astryxdesign/core/Calendar` or use `as ISODateString` if computing the value dynamically.',
    },
    {
      name: 'max',
      type: 'ISODateString',
      description:
        'Maximum selectable date. Same template literal type as `min`: use a YYYY-MM-DD string literal or cast with `as ISODateString`.',
    },
    {
      name: 'dateConstraints',
      type: 'Array<(date: Date) => boolean>',
      description: 'Custom constraint functions to disable specific dates.',
    },
    {
      name: 'maxRangeSpan',
      type: 'number',
      description:
        'Maximum days a selected range may span, counting both endpoints (`7` = a 7-day window, start + 6). Once a start is picked, days beyond this distance are disabled so the range cannot stretch past the cap. Rolling window relative to the start; for fixed calendar bounds use `min`/`max`. Constrains selection only; it never rewrites a `value` already wider than the cap (flag that with `status`).',
    },
    {
      name: 'minRangeSpan',
      type: 'number',
      description:
        'Minimum days a selected range must span, counting both endpoints (`2` forbids a single-day range). Once a start is picked, days closer than this are disabled. Clicking the start again commits a one-day range when allowed, or cancels the in-progress selection when the minimum is longer. Defaults to 1 (same-day start and end allowed).',
    },
    {
      name: 'presets',
      type: 'Array<DateRangePreset>',
      description:
        'Preset ranges shown as quick-select options beside the calendar, or above it when the two do not fit side by side. A preset is disabled when either endpoint violates min, max, or dateConstraints, or when its span violates minRangeSpan or maxRangeSpan.',
    },
    {
      name: 'hasClear',
      type: 'boolean',
      description: 'Shows a clear button when a range is selected.',
      default: 'true',
    },
    {
      name: 'placeholder',
      type: 'string',
      description: 'Placeholder text when no range is selected.',
      default: "'Select date range'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of the trigger.',
      default: "'md'",
    },
    {
      name: 'status',
      type: "{type: 'warning' | 'error' | 'success', message?: string}",
      description: 'Status indicator for error, warning, or success states.',
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
      description: 'Tooltip text via info icon at label end.',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description: 'Number of months in the calendar.',
      default: '2',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'First day of week in the calendar. A number (0 = Sunday to 6 = Saturday) or a three-letter day name.',
      default: '0',
    },
    {
      name: 'calendar',
      type: "'gregory' | 'iso8601' | 'buddhist' | 'roc' | 'japanese' | 'persian' | 'indian' | 'hebrew' | 'chinese' | 'dangi' | 'coptic' | 'ethiopic' | 'ethioaa' | 'islamic-civil' | 'islamic-tbla' | 'islamic-umalqura'",
      description:
        "The calendar the trigger text and the popover calendar show, such as persian, hebrew, or buddhist. value, onChange, min, max, and presets stay Gregorian ISO dates. The field has no typed entry. Calendars other than gregory, iso8601, buddhist, roc, and japanese need Temporal, native or a polyfill the application loads; without it the field shows Gregorian dates and warns in development. Month starts in the Chinese and Dangi calendars come from the runtime's Temporal; when you render on the server, load the same Temporal implementation on the server and in the browser.",
      default: "the InternationalizationProvider's calendar, else 'gregory'",
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
        className: 'astryx-date-range-input',
        visualProps: ['size', 'status'],
        states: ['disabled'],
      },
      {className: 'astryx-date-range-input-toggle-icon', states: ['state']},
      {className: 'astryx-date-range-input-presets'},
      {
        className: 'astryx-date-range-input-preset',
        states: ['selected', 'disabled'],
      },
    ],
  },
  usage: {
    description:
      'DateRangeInput lets users select a start and end date from a dual-month calendar popover. Use it for filtering data by time period, report generation, analytics dashboards, and booking flows.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the range trigger, the element that is focused and announced. A DOM handler runs after DateRangeInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          'Use presets for common ranges like "Last 7 days" to speed up selection.',
      },
      {
        guidance: true,
        description:
          'Use min/max to constrain selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Keep hasClear enabled (default) so users can reset the filter.',
      },
      {
        guidance: true,
        description:
          'Provide clear labels and descriptions so users understand what the range controls.',
      },
      {
        guidance: false,
        description:
          'Use DateRangeInput when only a single date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateRangeInput in Tooltip to explain why it is disabled. Use the disabledMessage prop instead, which ties the reason to the field.',
      },
    ],
    anatomy: [
      {
        name: 'Label',
        required: true,
        description:
          'Text above the trigger describing what date range is expected.',
      },
      {
        name: 'Field surface',
        required: true,
        description:
          'Bordered control containing the calendar toggle, range trigger, and end affordances.',
      },
      {
        name: 'Trigger button',
        required: true,
        description:
          'A button showing the formatted range or placeholder. Clicking opens the popover.',
      },
      {
        name: 'Calendar icon',
        required: true,
        description: 'A trailing icon that also opens the popover.',
      },
      {
        name: 'Calendar popover',
        required: true,
        description:
          'A dual-month calendar grid with range selection and hover preview.',
      },
      {
        name: 'Preset sidebar',
        required: false,
        description:
          'A list of preset range options beside the calendar, or above it when the two do not fit side by side.',
      },
      {
        name: 'Preset button',
        required: false,
        description:
          'A quick-select action for one preset range, reflecting current and disabled states.',
      },
      {
        name: 'Clear button',
        required: false,
        description: 'A × button that resets the range to null.',
      },
      {
        name: 'Status message',
        required: false,
        description: 'An error, warning, or success message below the trigger.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'date range picker with dual-month calendar popover and preset ranges',
  usage: {
    description:
      'DateRangeInput lets users select start+end dates from a dual-month calendar. Use for filtering, reports, analytics, and booking.',
    bestPractices: [
      {
        guidance: true,
        description:
          "Base props such as ref, id, data-*, aria-*, and DOM event handlers go to the range trigger, the element that is focused and announced. A DOM handler runs after DateRangeInput's own handler for the same event and still receives events it handled (including ones it called preventDefault on), so it cannot cancel built-in behavior.",
      },
      {
        guidance: true,
        description:
          'Use presets for common ranges like "Last 7 days" to speed up selection.',
      },
      {
        guidance: true,
        description:
          'Use min/max to constrain selectable dates to valid ranges.',
      },
      {
        guidance: true,
        description:
          'Keep hasClear enabled (default) so users can reset the filter.',
      },
      {
        guidance: true,
        description:
          'Provide clear labels + descriptions so users understand what the range controls.',
      },
      {
        guidance: false,
        description:
          'Use DateRangeInput when only a single date is needed; use DateInput instead.',
      },
      {
        guidance: false,
        description:
          'Hide the label without surrounding context that makes the purpose obvious.',
      },
      {
        guidance: false,
        description:
          'Wrap a disabled DateRangeInput in Tooltip to explain why it is disabled. Use the disabledMessage prop instead, which ties the reason to the field.',
      },
    ],
  },
  propDescriptions: {
    label: 'label text',
    isLabelHidden: 'visually hide label',
    description: 'helper text below label',
    isOptional: 'show "(optional)" indicator',
    isRequired: 'mark field required',
    isDisabled: 'disable trigger+picker',
    disabledMessage:
      'reason shown in a tooltip on hover/focus when disabled; describes the trigger',
    value:
      'selected range {start, end} or null; import DateRange type from @astryxdesign/core/DateRangeInput (do not redeclare)',
    onChange: 'callback on range change; null on clear',
    min: 'min selectable date: ISODateString template literal type (YYYY-MM-DD); use string literal or cast `as ISODateString`',
    max: 'max selectable date: ISODateString template literal type (YYYY-MM-DD); use string literal or cast `as ISODateString`',
    dateConstraints: 'custom constraint fns to disable dates',
    maxRangeSpan:
      'max days a range may span, both endpoints counted (7 = a 7-day window); caps the window from the picked start. Selection-only; does not rewrite an over-wide value',
    minRangeSpan:
      'min days a range must span, both endpoints counted (2 forbids a single-day range); repeated start click commits one day when allowed, otherwise cancels; default 1',
    presets:
      'preset ranges as quick-select options; disabled when an endpoint or span violates the corresponding constraints',
    hasClear: 'clear button when range is set (default true)',
    placeholder: 'placeholder when empty',
    size: 'trigger size',
    status: 'error/warning/success status',
    statusVariant:
      'How status message is placed: attached overlaps below input; detached floats below w/ spacing; tooltip hides the box and shows it on the status icon.',
    labelTooltip: 'tooltip via info icon at label end',
    numberOfMonths: 'months in calendar (default 2)',
    calendar:
      "calendar for the trigger text + popover calendar (default: provider's, else 'gregory'); values and presets stay Gregorian ISO; no typed entry; non-Gregorian-aligned calendars need Temporal (native or app-loaded polyfill), else Gregorian",
    weekStartsOn:
      'first day of week in calendar (0=Sunday, or name e.g. "mon")',
    changeAction:
      'async action fired after onChange; drives optimistic UI updates via useTransition',
    isLoading: 'loading state; disables interaction + shows a spinner',
    containerXstyle:
      'Field box (label+control+status); also containerClassName/containerStyle. no effect in InputGroup or horizontal-labels FormLayout',
    controlXstyle:
      'visual control box (border/bg/icons), never the native input; also controlClassName/controlStyle. no root xstyle/className/style',
  },
};

export const docsZh = {
  "name": "DateRangeInput",
  "displayName": "Date Range Input",
  "usage": {
    "description": "DateRangeInput 让用户从双月日历弹出层中选择开始和结束日期。用于按时间段筛选数据、生成报表、分析仪表盘和预订流程。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "`ref`、`id`、`data-*`、`aria-*` 和 DOM 事件处理器等基础属性会传到范围触发器，也就是获得焦点并被播报的元素。针对同一事件，DOM 处理器在 DateRangeInput 自身的处理器之后运行，并且仍会收到它已处理的事件（包括它调用过 `preventDefault` 的事件），因此无法取消内置行为。"
      },
      {
        "guidance": true,
        "description": "对“最近 7 天”等常用范围使用预设，以加快选择速度。"
      },
      {
        "guidance": true,
        "description": "使用 `min`/`max` 将可选日期限制在有效范围内。"
      },
      {
        "guidance": true,
        "description": "保持 `hasClear` 启用（默认启用），以便用户重置筛选条件。"
      },
      {
        "guidance": true,
        "description": "提供清晰的标签和描述，让用户理解该范围控制的内容。"
      },
      {
        "guidance": false,
        "description": "仅需单个日期时使用 DateRangeInput；这种情况下应改用 DateInput。"
      },
      {
        "guidance": false,
        "description": "在没有能让用途显而易见的上下文时隐藏标签。"
      },
      {
        "guidance": false,
        "description": "用 Tooltip 包裹已禁用的 DateRangeInput 来解释禁用原因。请改用 `disabledMessage` 属性，它会把原因与该字段关联起来。"
      }
    ],
    "anatomy": [
      {
        "name": "标签",
        "required": true,
        "description": "触发器上方的文本，用于说明期望的日期范围。"
      },
      {
        "name": "字段表面",
        "required": true,
        "description": "带边框的控件，包含日历切换按钮、范围触发器和末端辅助控件。"
      },
      {
        "name": "触发按钮",
        "required": true,
        "description": "显示格式化范围或占位符的按钮。点击后打开弹出层。"
      },
      {
        "name": "日历图标",
        "required": true,
        "description": "尾部图标，也可打开弹出层。"
      },
      {
        "name": "日历弹出层",
        "required": true,
        "description": "双月日历网格，支持范围选择和悬停预览。"
      },
      {
        "name": "预设侧栏",
        "required": false,
        "description": "日历旁的预设范围选项列表；当两者无法并排显示时，显示在日历上方。"
      },
      {
        "name": "预设按钮",
        "required": false,
        "description": "用于快速选择一个预设范围的操作，会反映当前和禁用状态。"
      },
      {
        "name": "清除按钮",
        "required": false,
        "description": "一个 × 按钮，将范围重置为 `null`。"
      },
      {
        "name": "状态消息",
        "required": false,
        "description": "触发器下方的错误、警告或成功消息。"
      }
    ]
  },
  "propDescriptions": {
    "label": "标签文本。",
    "isLabelHidden": "在视觉上隐藏标签。",
    "description": "显示在标签下方的辅助文本。",
    "isOptional": "显示“(可选)”指示符。",
    "isRequired": "将字段标记为必填。",
    "isDisabled": "禁用触发器和选择器。触发器仍可聚焦并暴露 `aria-disabled`；打开操作会被阻止。",
    "disabledMessage": "说明输入框为何被禁用。与 `isDisabled` 一起使用时，在悬停/键盘聚焦时显示提示，并描述该触发器（激活仍被阻止）。请使用此属性，而不是用 Tooltip 包裹已禁用的 DateRangeInput。",
    "value": "选中的日期范围或 `null`。从 `@astryxdesign/core/DateRangeInput` 导入 `DateRange` 类型；其结构为 `{start: ISODateString, end: ISODateString}`。不要自行重新声明 DateRange 类型；请使用导出的类型，以便 TypeScript 在结构上匹配。",
    "onChange": "范围变化时的回调。清除时以 `null` 调用。",
    "changeAction": "在 `onChange` 之后触发的异步操作。通过 `useTransition` 驱动乐观 UI 更新。",
    "isLoading": "输入框是否处于加载状态。禁用交互并显示加载指示器。",
    "min": "可选的最早日期。`ISODateString` 是模板字面量类型（`\\`${number}${number}${number}${number}-${number}${number}-${number}${number}\\``）。请传入 `\"2026-01-28\"` 这样的字符串字面量，而不是运行时字符串变量。从 `@astryxdesign/core/Calendar` 导入该类型，或在动态计算值时使用 `as ISODateString`。",
    "max": "可选的最晚日期。与 `min` 使用相同的模板字面量类型：使用 YYYY-MM-DD 字符串字面量，或用 `as ISODateString` 进行类型断言。",
    "dateConstraints": "用于禁用特定日期的自定义约束函数。",
    "maxRangeSpan": "选中范围最多可跨越的天数，包含两个端点（`7` = 7 天窗口，开始日期 + 6 天）。选定开始日期后，超出该距离的日期会被禁用，因此范围不能超过上限。窗口相对于开始日期滚动；如需固定的日历边界，请使用 `min`/`max`。此属性仅约束选择，不会改写已经超过上限的 `value`（请通过 `status` 标记）。",
    "minRangeSpan": "选中范围必须跨越的最少天数，包含两个端点（`2` 禁止单日范围）。选定开始日期后，距离更近的日期会被禁用。再次点击开始日期时，如果允许，将提交单日范围；如果最小天数更长，则取消进行中的选择。默认为 1（允许开始和结束为同一天）。",
    "presets": "以快速选择选项形式显示在日历旁（当两者无法并排时显示在上方）的预设范围。如果任一端点违反 `min`、`max` 或 `dateConstraints`，或其跨度违反 `minRangeSpan` 或 `maxRangeSpan`，该预设会被禁用。",
    "hasClear": "选中范围时显示清除按钮。",
    "placeholder": "未选择范围时的占位文本。",
    "size": "触发器尺寸。",
    "status": "错误、警告或成功状态的状态指示符。",
    "statusVariant": "状态消息相对于输入框的放置方式。`attached` 直接重叠在输入框下方（带边框处理）；`detached` 作为独立元素浮在下方并留有间距；`tooltip` 隐藏消息框，改为在状态图标的工具提示中显示。",
    "labelTooltip": "通过标签末尾信息图标显示的提示文本。",
    "numberOfMonths": "日历中显示的月份数。",
    "weekStartsOn": "日历中每周的第一天。可以是数字（0 = 星期日到 6 = 星期六）或三字母的星期名称。",
    "calendar": "触发文本和弹出层日历所显示的历法，例如 persian、hebrew 或 buddhist。`value`、`onChange`、`min`、`max` 和 `presets` 仍使用公历 ISO 日期。该字段没有文本输入。除 `gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的历法需要 Temporal（原生或应用加载的 polyfill）；缺少时字段显示公历日期，并在开发环境中给出警告。中国历和 Dangi 历的月份起始来自运行时的 Temporal；在服务端渲染时，请在服务端和浏览器中加载相同的 Temporal 实现。",
    "width": "字段宽度（数字 = 像素，字符串按原样使用，例如 `\"100%\"`）。用于设置整个字段（标签、控件和状态）的尺寸，使它们保持对齐。",
    "containerXstyle": "用于标签、控件和状态外层 Field 盒子的 StyleX 样式。`containerClassName` 和 `containerStyle` 为同一盒子接收类名和内联样式。在没有渲染 Field 盒子的地方无效（会在开发环境警告）：InputGroup 内（请为该组设置样式）以及水平标签的 FormLayout 中。",
    "controlXstyle": "用于视觉控件盒子的 StyleX 样式：即承载文本、图标和末端控件的带边框元素，绝不是原生输入框。`controlClassName` 和 `controlStyle` 为同一盒子接收类名和内联样式。它会替代根级 `xstyle`、`className` 和 `style`，本组件不接受这些属性。"
  }
};
