// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Calendar',
  displayName: 'Calendar',
  category: 'Form Controls',
  keywords: [
    'calendar',
    'datepicker',
    'date picker',
    'rangepicker',
    'date range',
    'monthview',
    'daypicker',
  ],
  usage: {
    description:
      'Calendar lets the user pick a date or date range from a month grid. Use it in booking flows, scheduling UIs, date filters, or anywhere the user needs to see surrounding dates for context.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set min and max dates to limit selection to a valid window, like only future dates for a booking or the current quarter for a report.',
      },
      {
        guidance: true,
        description:
          'Use range mode when the user needs to pick a start and end date, like a trip or a time-off request.',
      },
      {
        guidance: true,
        description:
          'Use dateConstraints to disable specific dates like weekends or holidays, and explain why they are unavailable.',
      },
      {
        guidance: true,
        description:
          'Show two months side by side when the user frequently selects dates that span a month boundary.',
      },
      {
        guidance: true,
        description:
          'For a custom month view, use useCalendarNavigation and useCalendarDays from @astryxdesign/core/Calendar. To show another calendar system, pass the same calendar to both and feed visibleCalendarMonths into useCalendarDays. The hooks default to gregory and never read the InternationalizationProvider calendar.',
      },
      {
        guidance: false,
        description:
          'Use a calendar for dates far in the past or future like a birth date. A text input is faster for open-ended entry.',
      },
      {
        guidance: false,
        description:
          'Disable large blocks of dates without context. The user should understand why dates are unavailable.',
      },
    ],
    anatomy: [
      {
        name: 'Calendar root',
        required: true,
        description:
          'The container that holds the month header and the day grid.',
      },
      {
        name: 'Month header',
        required: true,
        description:
          'The month name and year with navigation arrows to move between months. The arrows mirror automatically under dir="rtl".',
      },
      {
        name: 'Day grid',
        required: true,
        description:
          'A 7-column grid of days with column headers for the day names.',
      },
      {
        name: 'Day button',
        required: true,
        description: 'One day in the grid; the control a date is picked with.',
      },
      {
        name: 'Selected day',
        required: false,
        description:
          'The currently selected date, highlighted. In range mode, the start and end dates plus the days between them.',
      },
      {
        name: 'Today marker',
        required: false,
        description: 'A subtle indicator on the current date for orientation.',
      },
    ],
  },
  props: [
    {
      name: 'mode',
      type: "'single' | 'range'",
      description: 'Selection mode.',
      default: "'single'",
    },
    {
      name: 'value',
      type: 'ISODateString | DateRange | null',
      description:
        'Controlled selected value. Use null for no selection; omit value or pass undefined for uncontrolled mode.',
    },
    {
      name: 'defaultValue',
      type: 'ISODateString | DateRange',
      description: 'Uncontrolled default value.',
    },
    {
      name: 'onChange',
      type: 'Function',
      description: 'Selection callback.',
    },
    {
      name: 'numberOfMonths',
      type: '1 | 2',
      description: 'Number of months to display.',
      default: '1',
    },
    {
      name: 'min',
      type: 'ISODateString',
      description: 'Minimum selectable date.',
    },
    {
      name: 'max',
      type: 'ISODateString',
      description: 'Maximum selectable date.',
    },
    {
      name: 'dateConstraints',
      type: 'Array<(date: Date) => boolean>',
      description: 'Custom constraint functions.',
    },
    {
      name: 'maxRangeSpan',
      type: 'number',
      description:
        'Range mode: max days a range may span, both endpoints counted (7 = a 7-day window). Caps the window from the picked start; before a start is picked every day stays selectable.',
    },
    {
      name: 'minRangeSpan',
      type: 'number',
      description:
        'Range mode: min days a range must span, both endpoints counted (2 forbids a single-day range). Clicking the start again commits a one-day range when allowed, or cancels the in-progress selection when the minimum is longer. Default 1.',
    },
    {
      name: 'focusDate',
      type: 'ISODateString',
      description:
        'Controlled visible month. Unset, the calendar opens on the selected date, else on today clamped into the min/max window.',
    },
    {
      name: 'onFocusDateChange',
      type: '(focusDate: ISODateString) => void',
      description: 'Navigation callback.',
    },
    {
      name: 'handleRef',
      type: 'React.Ref<CalendarHandle>',
      description:
        'Imperative handle for calendar navigation, including navigateTo().',
    },
    {
      name: 'hasOutsideDays',
      type: 'boolean',
      description: 'Show days from adjacent months.',
      default: 'true',
    },
    {
      name: 'hasWeekNumbers',
      type: 'boolean',
      description:
        'Show ISO 8601 week numbers. They are ISO 8601 week numbers in every calendar system.',
      default: 'false',
    },
    {
      name: 'hasVariableRowCount',
      type: 'boolean',
      description:
        'Give each month only the rows it needs. The default fixed 6-row grid keeps the same height from month to month; a variable row count trades that fixed height for a more compact grid.',
      default: 'false',
    },
    {
      name: 'weekStartsOn',
      type: "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      description:
        'First day of week. Accepts a number (0=Sunday) or a three-letter day name (e.g. "mon").',
      default: '0',
    },
    {
      name: 'calendar',
      type: "'gregory' | 'iso8601' | 'buddhist' | 'roc' | 'japanese' | 'persian' | 'indian' | 'hebrew' | 'chinese' | 'dangi' | 'coptic' | 'ethiopic' | 'ethioaa' | 'islamic-civil' | 'islamic-tbla' | 'islamic-umalqura'",
      description:
        "Calendar system the grid shows, such as 'persian', 'hebrew', or 'islamic-umalqura'. It sets the months, their names, and month and year navigation. value, min, max, focusDate, and every callback stay Gregorian ISO dates. Calendars other than gregory, iso8601, buddhist, roc, and japanese need Temporal; where the runtime lacks it, load a polyfill such as temporal-polyfill/full/global on the server and in the browser, or the grid shows Gregorian months. Month starts in the Chinese and Dangi calendars come from the runtime's Temporal, and some polyfills start a few months one day apart from native Temporal; when server and browser markup must match, use one implementation on both sides, such as installImplementation() from temporal-polyfill/full/shim, which replaces a native Temporal.",
      default: 'the InternationalizationProvider calendar, else gregory',
    },
  ],
  examples: [
    {
      label: 'A custom month view in the Persian calendar',
      code: `import {Button} from '@astryxdesign/core/Button';
import {
  useCalendarDays,
  useCalendarNavigation,
} from '@astryxdesign/core/Calendar';

function PersianMonth() {
  const {monthYearLabel, visibleCalendarMonths, navigateMonth} =
    useCalendarNavigation({initialValue: '2026-10-30', calendar: 'persian'});
  // visibleCalendarMonths[0] is {year: 1405, month: 8}: Aban 1405.
  const {weeks} = useCalendarDays({
    ...visibleCalendarMonths[0],
    calendar: 'persian',
  });
  return (
    <section aria-label={monthYearLabel}>
      <Button label="Previous month" onClick={() => navigateMonth(-1)} />
      <Button label="Next month" onClick={() => navigateMonth(1)} />
      {weeks.map(week => (
        <div key={week[0].iso}>
          {week.map(day => (
            <span key={day.iso} data-date={day.iso}>
              {day.isOutside ? '' : day.dayNumber}
            </span>
          ))}
        </div>
      ))}
    </section>
  );
}`,
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-calendar', visualProps: ['mode']},
      {
        className: 'astryx-calendar-nav',
        visualProps: ['nav'],
        states: ['disabled'],
      },
      {
        className: 'astryx-calendar-day',
        states: ['selected', 'today', 'disabled', 'in-range', 'marker'],
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Calendar",
  "displayName": "Calendar",
  "usage": {
    "description": "Calendar 让用户从月历网格中选择一个日期或日期范围。用于预订流程、日程安排界面、日期筛选，或任何需要用户看到周边日期作为参考的场景。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "设置 `min` 和 `max` 日期，将可选范围限制在有效窗口内，例如预订场景只允许未来日期，报表场景只允许当前季度。"
      },
      {
        "guidance": true,
        "description": "当用户需要选择开始和结束日期时，使用范围模式，例如行程或休假申请。"
      },
      {
        "guidance": true,
        "description": "使用 `dateConstraints` 禁用周末或节假日等特定日期，并说明这些日期不可选的原因。"
      },
      {
        "guidance": true,
        "description": "当用户经常选择跨月的日期时，并排显示两个月。"
      },
      {
        "guidance": true,
        "description": "如需自定义月视图，请使用 `@astryxdesign/core/Calendar` 中的 `useCalendarNavigation` 和 `useCalendarDays`。要显示其他历法，请向两者传入相同的 `calendar`，并将 `visibleCalendarMonths` 传入 `useCalendarDays`。这些 Hook 默认使用 `gregory`，且从不读取 `InternationalizationProvider` 的历法。"
      },
      {
        "guidance": false,
        "description": "为出生日期这类很久以前或很久以后的日期使用日历；开放式录入用文本输入框更快。"
      },
      {
        "guidance": false,
        "description": "在没有上下文说明的情况下禁用大块日期。用户应能理解日期不可用的原因。"
      }
    ],
    "anatomy": [
      {
        "name": "日历根容器",
        "required": true,
        "description": "容纳月份标题栏和日期网格的容器。"
      },
      {
        "name": "月份标题栏",
        "required": true,
        "description": "月份名称和年份，以及用于切换月份的导航箭头。在 `dir=\"rtl\"` 下箭头会自动镜像。"
      },
      {
        "name": "日期网格",
        "required": true,
        "description": "7 列的日期网格，带有星期名称的列标题。"
      },
      {
        "name": "日期按钮",
        "required": true,
        "description": "网格中的一天；用于选择日期的控件。"
      },
      {
        "name": "选中日期",
        "required": false,
        "description": "当前选中的日期，会高亮显示。在范围模式下，包括开始日期、结束日期及两者之间的日期。"
      },
      {
        "name": "今天标记",
        "required": false,
        "description": "当前日期上的细微指示标记，用于定位。"
      }
    ]
  },
  "props": [
    {
      "name": "mode",
      "type": "'single' | 'range'",
      "description": "选择模式。",
      "default": "'single'"
    },
    {
      "name": "value",
      "type": "ISODateString | DateRange | null",
      "description": "受控的选中值。无选中项时使用 `null`；非受控模式请省略 `value` 或传入 `undefined`。"
    },
    {
      "name": "defaultValue",
      "type": "ISODateString | DateRange",
      "description": "非受控模式下的默认值。"
    },
    {
      "name": "onChange",
      "type": "Function",
      "description": "选择变更回调。"
    },
    {
      "name": "numberOfMonths",
      "type": "1 | 2",
      "description": "要显示的月份数。",
      "default": "1"
    },
    {
      "name": "min",
      "type": "ISODateString",
      "description": "可选的最早日期。"
    },
    {
      "name": "max",
      "type": "ISODateString",
      "description": "可选的最晚日期。"
    },
    {
      "name": "dateConstraints",
      "type": "Array<(date: Date) => boolean>",
      "description": "自定义约束函数。"
    },
    {
      "name": "maxRangeSpan",
      "type": "number",
      "description": "范围模式：范围最多可跨越的天数，包含两个端点（`7` = 7 天窗口）。从选中的开始日期起限制窗口；在选择开始日期之前，每天仍可选择。"
    },
    {
      "name": "minRangeSpan",
      "type": "number",
      "description": "范围模式：范围必须跨越的最少天数，包含两个端点（`2` 表示禁止单日范围）。再次点击开始日期时，如果允许，将提交一个单日范围；如果最小天数更长，则取消进行中的选择。默认为 1。"
    },
    {
      "name": "focusDate",
      "type": "ISODateString",
      "description": "受控的可见月份。未设置时，日历会打开在选中日期所在的月份；否则打开在今天，并限制在 `min`/`max` 窗口内。"
    },
    {
      "name": "onFocusDateChange",
      "type": "(focusDate: ISODateString) => void",
      "description": "导航回调。"
    },
    {
      "name": "handleRef",
      "type": "React.Ref<CalendarHandle>",
      "description": "用于日历导航的命令式句柄，包括 `navigateTo()`。"
    },
    {
      "name": "hasOutsideDays",
      "type": "boolean",
      "description": "显示相邻月份的日期。",
      "default": "true"
    },
    {
      "name": "hasWeekNumbers",
      "type": "boolean",
      "description": "显示 ISO 8601 周数。在每个历法系统中，它们都是 ISO 8601 周数。",
      "default": "false"
    },
    {
      "name": "hasVariableRowCount",
      "type": "boolean",
      "description": "让每个月只使用所需行数。默认的固定 6 行网格使各月份高度保持一致；可变行数则用更紧凑的网格换取固定高度。",
      "default": "false"
    },
    {
      "name": "weekStartsOn",
      "type": "0 | 1 | 2 | 3 | 4 | 5 | 6 | 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'",
      "description": "每周的第一天。接受数字（0 = 星期日）或三字母的星期名称（例如 `\"mon\"`）。",
      "default": "0"
    },
    {
      "name": "calendar",
      "type": "'gregory' | 'iso8601' | 'buddhist' | 'roc' | 'japanese' | 'persian' | 'indian' | 'hebrew' | 'chinese' | 'dangi' | 'coptic' | 'ethiopic' | 'ethioaa' | 'islamic-civil' | 'islamic-tbla' | 'islamic-umalqura'",
      "description": "网格显示的历法系统，例如 `'persian'`、`'hebrew'` 或 `'islamic-umalqura'`。它决定月份、月份名称以及月份和年份导航。`value`、`min`、`max`、`focusDate` 以及所有回调仍使用公历 ISO 日期。除 `gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的历法需要 Temporal；如果运行时缺少 Temporal，请在服务端和浏览器中加载 polyfill（如 `temporal-polyfill/full/global`），否则网格会显示公历月份。中国历和韩国历（Dangi）的月份起始来自运行时的 Temporal，而某些 polyfill 与原生 Temporal 的月份起始可能相差一天；当服务端和浏览器的标记必须一致时，请在两端使用同一实现，例如 `temporal-polyfill/full/shim` 中的 `installImplementation()`，它会替换原生 Temporal。",
      "default": "InternationalizationProvider 的历法，否则为 gregory"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-calendar",
        "visualProps": [
          "mode"
        ]
      },
      {
        "className": "astryx-calendar-nav",
        "visualProps": [
          "nav"
        ],
        "states": [
          "disabled"
        ]
      },
      {
        "className": "astryx-calendar-day",
        "states": [
          "selected",
          "today",
          "disabled",
          "in-range",
          "marker"
        ]
      }
    ]
  },
  "propDescriptions": {
    "mode": "选择模式。",
    "value": "受控的选中值。无选中项时使用 `null`；非受控模式请省略 `value` 或传入 `undefined`。",
    "defaultValue": "非受控模式下的默认值。",
    "onChange": "选择变更回调。",
    "numberOfMonths": "要显示的月份数。",
    "min": "可选的最早日期。",
    "max": "可选的最晚日期。",
    "dateConstraints": "自定义约束函数。",
    "maxRangeSpan": "范围模式：范围最多可跨越的天数，包含两个端点（`7` = 7 天窗口）。从选中的开始日期起限制窗口；在选择开始日期之前，每天仍可选择。",
    "minRangeSpan": "范围模式：范围必须跨越的最少天数，包含两个端点（`2` 表示禁止单日范围）。再次点击开始日期时，如果允许，将提交一个单日范围；如果最小天数更长，则取消进行中的选择。默认为 1。",
    "focusDate": "受控的可见月份。未设置时，日历会打开在选中日期所在的月份；否则打开在今天，并限制在 `min`/`max` 窗口内。",
    "onFocusDateChange": "导航回调。",
    "handleRef": "用于日历导航的命令式句柄，包括 `navigateTo()`。",
    "hasOutsideDays": "显示相邻月份的日期。",
    "hasWeekNumbers": "显示 ISO 8601 周数。在每个历法系统中，它们都是 ISO 8601 周数。",
    "hasVariableRowCount": "让每个月只使用所需行数。默认的固定 6 行网格使各月份高度保持一致；可变行数则用更紧凑的网格换取固定高度。",
    "weekStartsOn": "每周的第一天。接受数字（0 = 星期日）或三字母的星期名称（例如 `\"mon\"`）。",
    "calendar": "网格显示的历法系统，例如 `'persian'`、`'hebrew'` 或 `'islamic-umalqura'`。它决定月份、月份名称以及月份和年份导航。`value`、`min`、`max`、`focusDate` 以及所有回调仍使用公历 ISO 日期。除 `gregory`、`iso8601`、`buddhist`、`roc` 和 `japanese` 之外的历法需要 Temporal；如果运行时缺少 Temporal，请在服务端和浏览器中加载 polyfill（如 `temporal-polyfill/full/global`），否则网格会显示公历月份。中国历和韩国历（Dangi）的月份起始来自运行时的 Temporal，而某些 polyfill 与原生 Temporal 的月份起始可能相差一天；当服务端和浏览器的标记必须一致时，请在两端使用同一实现，例如 `temporal-polyfill/full/shim` 中的 `installImplementation()`，它会替换原生 Temporal。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'month grid for picking a date or date range',
  usage: {
    description:
      'Calendar lets the user pick a date or date range from a month grid. Use in booking, scheduling, date filters.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set min/max to limit selection to a valid window: only future dates for booking, current quarter for a report.',
      },
      {
        guidance: true,
        description:
          'Use range mode when user picks start + end dates: trip, time-off request.',
      },
      {
        guidance: true,
        description:
          'Use dateConstraints to disable specific dates (weekends/holidays); explain why unavailable.',
      },
      {
        guidance: true,
        description:
          'Show two months side by side when user frequently selects dates spanning a month boundary.',
      },
      {
        guidance: true,
        description:
          'Custom month view: useCalendarNavigation + useCalendarDays; pass the same calendar to both, feed visibleCalendarMonths into useCalendarDays. Default gregory; never read the provider calendar.',
      },
      {
        guidance: false,
        description:
          'Use for dates far in the past/future; text input is faster.',
      },
      {guidance: false, description: 'Disable dates without explaining why.'},
    ],
  },
  propDescriptions: {
    mode: 'selection mode',
    value: 'controlled selected value',
    defaultValue: 'uncontrolled default value',
    onChange: 'selection callback',
    numberOfMonths: 'months to display',
    min: 'minimum selectable date',
    max: 'maximum selectable date',
    dateConstraints: 'custom constraint fns',
    maxRangeSpan:
      'range mode: max days a range may span, both ends counted (7 = 7-day window)',
    minRangeSpan:
      'range mode: min days a range must span, both ends counted; repeated start click commits one day when allowed, otherwise cancels (default 1)',
    focusDate:
      'controlled visible month (default: selected date, else today clamped into min/max)',
    onFocusDateChange: 'navigation callback',
    handleRef: 'imperative navigation handle',
    hasOutsideDays: 'show days from adjacent months',
    hasWeekNumbers: 'show ISO 8601 week numbers, in every calendar system',
    hasVariableRowCount:
      'only the rows each month needs; trades the fixed 6-row height for a compact grid',
    weekStartsOn: 'first day of week (0=Sunday, or name e.g. "mon")',
    calendar:
      'calendar system shown (default: provider calendar, else gregory); values stay Gregorian ISO; non-Gregorian-aligned calendars need Temporal',
  },
};
