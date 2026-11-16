// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useCalendarConstraints',
  displayName: 'useCalendarConstraints',
  group: 'Calendar',
  keywords: [
    'calendar',
    'constraints',
    'isDateDisabled',
    'dateConstraints',
    'min',
    'max',
    'rangeSpan',
    'rangeAnchor',
    'disabled dates',
    'hotel booking',
  ],
  params: [
    {
      name: 'options',
      type: 'UseCalendarConstraintsOptions',
      description: 'Configuration for date bounds, range-span limits, and custom rules.',
      required: true,
    },
    {
      name: 'options.min',
      type: 'ISODateString',
      description:
        'Earliest selectable date in ISO format (YYYY-MM-DD). Dates strictly before this are disabled.',
      required: false,
    },
    {
      name: 'options.max',
      type: 'ISODateString',
      description:
        'Latest selectable date in ISO format (YYYY-MM-DD). Dates strictly after this are disabled.',
      required: false,
    },
    {
      name: 'options.dateConstraints',
      type: 'ReadonlyArray<(date: Date) => boolean>',
      description:
        'Custom date constraint predicates. Receives a native Date; if any returns false, the date is disabled.',
      required: false,
    },
    {
      name: 'options.maxRangeSpan',
      type: 'number',
      description:
        'Maximum days a range may span, counting both endpoints (a value of 7 allows a 7-day window). Inactive until rangeAnchor is set.',
      required: false,
    },
    {
      name: 'options.minRangeSpan',
      type: 'number',
      description:
        'Minimum days a range must span, counting both endpoints. Disables dates that would make the range shorter than minRangeSpan days (except rangeAnchor itself, which remains enabled so pickers forbidding single-day selections must refuse a second click on the anchor).',
      required: false,
    },
    {
      name: 'options.rangeAnchor',
      type: 'PlainDate | null',
      description:
        'The in-progress range start date. Span constraints are measured from this date. Null when no selection is underway.',
      required: false,
    },
  ],
  returns: [
    {
      name: 'isDateDisabled',
      type: '(date: PlainDate) => boolean',
      description:
        'Predicate returning true when a PlainDate falls outside min/max bounds, is closer to rangeAnchor than minRangeSpan allows (except rangeAnchor itself), exceeds maxRangeSpan relative to rangeAnchor, or fails any dateConstraints predicate.',
    },
    {
      name: 'minDate',
      type: 'PlainDate | null',
      description: 'Parsed minimum date as a PlainDate object, or null if min was not provided.',
    },
    {
      name: 'maxDate',
      type: 'PlainDate | null',
      description: 'Parsed maximum date as a PlainDate object, or null if max was not provided.',
    },
  ],
  usage: {
    description:
      'Provides date constraint validation for calendar views and custom range pickers. It combines boundary dates, span limits measured from an in-progress range start, and custom rules (such as weekly closures or blackout dates) into an isDateDisabled predicate. Calendar uses it internally to disable day buttons; use it directly when building bespoke scheduling interfaces or range pickers.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass rangeAnchor only after the user selects an initial range start, so all eligible start dates remain selectable before the first click.',
      },
      {
        guidance: true,
        description:
          'Use dateConstraints for recurring or dynamic rules, such as disabling closed weekdays, past holidays, or sold-out dates.',
      },
      {
        guidance: false,
        description:
          'Perform slow network calls or heavy calculations inside dateConstraints predicates, because isDateDisabled is evaluated synchronously for each day rendered in the grid.',
      },
    ],
  },
  relatedComponents: ['Calendar'],
  relatedHooks: ['useCalendarDays', 'useCalendarNavigation'],
  importPath: '@astryxdesign/core/Calendar',
  category: 'utilities',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Provides date constraint validation combining min/max bounds, range-span caps relative to rangeAnchor, and custom rule functions into isDateDisabled.',
  paramDescriptions: {
    options: 'Date constraint configuration.',
    'options.min': 'Earliest selectable ISO date.',
    'options.max': 'Latest selectable ISO date.',
    'options.dateConstraints': 'Array of predicates returning false for disabled dates.',
    'options.maxRangeSpan': 'Max days in range counting endpoints, measured from rangeAnchor.',
    'options.minRangeSpan': 'Min days in range counting endpoints, measured from rangeAnchor.',
    'options.rangeAnchor': 'Active range start PlainDate for span constraints.',
  },
  returnDescriptions: {
    isDateDisabled: 'Function returning true if PlainDate violates any constraint.',
    minDate: 'Parsed min PlainDate or null.',
    maxDate: 'Parsed max PlainDate or null.',
  },
  usage: {
    description:
      'Combines bounds, spans, and predicates into isDateDisabled for calendar and date-picker layouts.',
    bestPractices: [
      {
        guidance: true,
        description: 'Set rangeAnchor only while actively picking a range end.',
      },
      {
        guidance: true,
        description: 'Use dateConstraints for recurring blackout dates or closures.',
      },
      {
        guidance: false,
        description: 'Run expensive computation inside dateConstraints.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useCalendarConstraints",
  "usage": {
    "description": "为日历视图和自定义范围选择器提供日期约束校验。它将边界日期、从进行中的范围起点开始衡量的跨度限制以及自定义规则（例如每周停业日或不可预约日期）合并为一个 `isDateDisabled` 谓词。Calendar 在内部使用它来禁用日期按钮；在构建定制排程界面或范围选择器时可直接使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "仅在用户选择初始范围起点后才传入 `rangeAnchor`，这样在第一次点击前所有符合条件的起始日期都保持可选。"
      },
      {
        "guidance": true,
        "description": "将 `dateConstraints` 用于重复性或动态规则，例如禁用停业的工作日、过去的节假日或售罄日期。"
      },
      {
        "guidance": false,
        "description": "不要在 `dateConstraints` 谓词中执行缓慢的网络请求或繁重计算，因为 `isDateDisabled` 会针对网格中渲染的每一天同步求值。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "日期边界、范围跨度限制和自定义规则的配置。",
    "options.min": "ISO 格式（YYYY-MM-DD）的最早可选日期。严格早于此日期的日期将被禁用。",
    "options.max": "ISO 格式（YYYY-MM-DD）的最晚可选日期。严格晚于此日期的日期将被禁用。",
    "options.dateConstraints": "自定义日期约束谓词。接收原生 `Date`；如果任一谓词返回 false，则该日期被禁用。",
    "options.maxRangeSpan": "范围可跨越的最大天数，包含两端点（值为 7 时允许 7 天的窗口）。在设置 `rangeAnchor` 前不生效。",
    "options.minRangeSpan": "范围必须跨越的最小天数，包含两端点。禁用会使范围短于 `minRangeSpan` 天的日期（`rangeAnchor` 本身除外，它保持启用，因此禁止单日选择的选择器必须拒绝在锚点上进行第二次点击）。",
    "options.rangeAnchor": "进行中的范围起始日期。跨度约束从此日期开始衡量。未进行选择时为 null。"
  },
  "returnDescriptions": {
    "isDateDisabled": "当 PlainDate 超出 `min`/`max` 边界、与 `rangeAnchor` 的距离小于 `minRangeSpan` 允许值（`rangeAnchor` 本身除外）、相对于 `rangeAnchor` 超过 `maxRangeSpan`，或未通过任何 `dateConstraints` 谓词时，返回 true 的谓词。",
    "minDate": "解析后的最小日期，类型为 PlainDate 对象；如果未提供 `min`，则为 null。",
    "maxDate": "解析后的最大日期，类型为 PlainDate 对象；如果未提供 `max`，则为 null。"
  }
};
