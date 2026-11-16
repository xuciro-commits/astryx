// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Schedule',
  displayName: 'Schedule',
  group: 'Schedule',
  category: 'Content',

  usage: {
    description:
      "Schedule is a calendar surface that renders events as a month grid, a day or week time grid, or a list grouped by day: the layout comes from a view object you pass in. It handles timezone-aware date math, paging between ranges, and async event loading, and exposes header slots that plugins fill with navigation controls. Use it to display an existing schedule; build the week, day, or month view with renderPopover to let people open an event's details in a popover the view manages. It has no event selection, creation, or editing affordances.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Hold the rendered date in state and wire onChangeDate to it. Schedule never advances the date itself, so without that handler the built-in previous/Today/next controls render but nothing moves.',
      },
      {
        guidance: true,
        description:
          'Match the view to the density of the data: a month grid for at-a-glance load, a day or week time grid when start and end times matter, a list when the schedule is sparse.',
      },
      {
        guidance: true,
        description:
          'Wrap Schedule in InternationalizationProvider to choose the language, numbering, and field order used by its date and time labels; the provider calendar, such as calendar="persian", writes those labels in another calendar. Schedule date values, its grids, and its date navigation stay Gregorian in every calendar and locale.',
      },
      {
        guidance: true,
        description:
          'Give each event a category string that matches a categories entry so its color is meaningful and screen readers announce the category name. An unmatched name still renders, but always in blue.',
      },
      {
        guidance: false,
        description:
          'Reach for Schedule when the user has to pick a date. It has no selection model; use DateInput, DateRangeInput, or Calendar instead.',
      },
      {
        guidance: false,
        description:
          'Rely on event color alone to carry meaning. Only ten colors exist, so they repeat on larger category sets; the accessible label already announces title, category, and time.',
      },
      {
        guidance: true,
        description:
          'When your page already pages the range with its own controls, keep date in your state and pass plugins={[]}: Schedule then renders the range title with no controls of its own, and your controls call the same setter as onChangeDate.',
      },
      {
        guidance: false,
        description:
          "Pass a custom plugins array without useSchedulePaginationPlugin when you still want Schedule's previous, Today, and next controls; a custom array replaces the default set rather than extending it.",
      },
    ],
    anatomy: [
      {
        name: 'Header start slot',
        required: false,
        description:
          'Leading header region filled by plugins. The default plugin set renders a previous / Today / next button group here.',
      },
      {
        name: 'Header title',
        required: true,
        description:
          'A level-2 heading naming the range on screen, e.g. "May 2026". The same text is the accessible name of the schedule region.',
      },
      {
        name: 'Loading spinner',
        required: false,
        description:
          'Sits beside the title while an async events loader is still pending, labelled "Loading events".',
      },
      {
        name: 'Header end slot',
        required: false,
        description:
          'Trailing header region, empty by default. The view selector plugin renders its menu here.',
      },
      {
        name: 'View body',
        required: true,
        description:
          'Whatever the view renders: a month grid, a day/week time grid with an hour gutter and an all-day row, or a list grouped under day headings. Grid views expose ARIA grid, columnheader, and gridcell roles and are marked aria-readonly. The day/week time grid scrolls inside one keyboard-reachable region named after the range; its day header, all-day row, and hour gutter stay pinned while the columns scroll. The all-day row also holds timed events that last 24 hours or more, as one span across their days.',
      },
      {
        name: 'Event',
        required: false,
        description:
          'One pill (grid views) or row with a color dot (list view) per event, tinted by its category and dimmed once it is in the past. In the day and week grids, events that happen at the same time share the column side by side, and when the view is built with renderPopover each event with content is a button that opens the view\'s popover. In the month grid a week row shows at most three levels of chips; a busy day shows two and a "+N more" button that opens a popover listing every event of that day. A month chip leads with the title; the start time of a timed event follows it only when both fit. When the month view is built with renderPopover, each chip with content is a button that opens the same popover as its day\'s "+N more", and each later day a chip covers names its event for screen readers.',
      },
      {
        name: 'Current time line',
        required: false,
        description:
          'A line across the day or week time grid at the current time, on the current day only. It ticks once a minute and is absent during server rendering. When the rendered range includes today, the grid opens scrolled to one hour before this line (clamped to the grid) once per range, and then leaves the scroll position alone until the person pages to another range or switches views.',
      },
    ],
  },

  props: [
    {
      name: 'view',
      type: 'ScheduleView<Options>',
      description:
        "The view object that owns the layout and the date range each page covers. Build one with createScheduleMonthlyView, createScheduleWeeklyView, createScheduleDayView, or createScheduleListView; each factory takes its own options (weekStartsOn, minHour/maxHour/hourHeight, days). The week, day, and month factories also take renderPopover(event): return the content for an event and the view renders that event as a button that opens a popover it manages — one popover for the view, named by the event title, with the system's standard surface, padding, Escape and light dismiss, and focus return; return null to leave an event read-only. In the month view that popover also shows a busy day's list, and a row in the list opens its event in place. The list view has no interaction option.",
      required: true,
    },
    {
      name: 'events',
      type: 'ReadonlyArray<CalendarEvent> | ((start: Instant, end: Instant) => Promise<ReadonlyArray<CalendarEvent>>)',
      description:
        "Either a static array, filtered to the events overlapping the rendered range and sorted by start, or a loader called with that range's start and end epoch milliseconds. A loader suspends while pending; the header shows a spinner and the view renders empty. Results are cached per loader identity and range, so keep the loader reference stable (useCallback) or every re-render refetches. When your page already holds the events, pass them as an array; Schedule picks out each range's events without a loader.",
      required: true,
    },
    {
      name: 'categories',
      type: "ReadonlyArray<{label: string, color: 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'cyan' | 'blue' | 'purple' | 'pink' | 'gray'}>",
      description:
        'Category definitions matched to each event by label === event.category. The match supplies the event\'s color and the category name in its accessible label. An event whose category names no entry keeps that name but falls back to blue; an event with no category is announced as "Event" in blue. A category can stand for any grouping you color by — an event kind, a calendar, or a team; to color events by calendar, give each calendar its own entry.',
      default: '[]',
    },
    {
      name: 'date',
      type: 'Instant',
      description:
        'Unix epoch milliseconds anywhere inside the range to render; the view expands it to a full month, week, day, or list window. Fully controlled; Schedule never changes it, so pair it with onChangeDate.',
      required: true,
    },
    {
      name: 'focusDate',
      type: 'Instant',
      description:
        'Unix epoch milliseconds marking the day treated as "today": in the month, week, and day views that cell gets aria-current="date" and the highlighted styling. The list view ignores it. When omitted it is captured once at mount and never advances afterwards.',
      default: 'Date.now() at mount',
    },
    {
      name: 'onChangeDate',
      type: '(date: Instant) => void',
      description:
        'Called with the epoch milliseconds to render next when a pagination plugin pages backward or forward, or when Today is pressed. Paging preserves the time of day; Today passes the current time.',
    },
    {
      name: 'timezoneID',
      type: 'string',
      description:
        'IANA timezone ID (e.g. "America/Los_Angeles") used for every date calculation and every formatted label, so the same events regroup across days when it changes.',
      default: 'Intl.DateTimeFormat().resolvedOptions().timeZone',
    },
    {
      name: 'plugins',
      type: 'ReadonlyArray<SchedulePlugin>',
      description:
        'Header plugins, applied in order; each may wrap or replace the start, center, and end header content. Supplying an array replaces the default pagination controls; compose useSchedulePaginationPlugin and useScheduleViewSelectorPlugin to keep both.',
      default: 'defaultSchedulePlugins',
    },
    {
      name: 'headingLevel',
      type: '2 | 3 | 4 | 5 | 6',
      description:
        'Heading level for sub-headings inside the schedule (the weekday and day column headers in the grid views, and the day headings in the list view), so the schedule nests correctly under the surrounding page outline. The header range title is always a level-2 heading.',
      default: '3',
    },
  ],
};

export const docsZh = {
  "name": "Schedule",
  "usage": {
    "description": "Schedule 是一个日历表面，可将事件渲染为月网格、日/周时间网格，或按天分组的列表：布局来自传入的 view 对象。它处理时区感知的日期运算、范围之间的翻页以及异步事件加载，并暴露由插件填充导航控件的页眉插槽。用于显示已有的日程安排；通过 `renderPopover` 构建周、日或月视图，让人们可以在视图管理的弹出面板中打开事件详情。它不提供事件选择、创建或编辑功能。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将渲染的日期保存在状态中，并将 `onChangeDate` 连接到它。Schedule 从不自行推进日期，因此没有该处理器时，内置的上一页/今天/下一页控件会渲染但不会有任何移动。"
      },
      {
        "guidance": true,
        "description": "使视图与数据密度匹配：月网格用于一目了然地查看负载，开始和结束时间重要时使用日或周时间网格，日程稀疏时使用列表。"
      },
      {
        "guidance": true,
        "description": "将 Schedule 包裹在 InternationalizationProvider 中，以选择其日期和时间标签使用的语言、数字系统和字段顺序；provider 的日历（例如 `calendar=\"persian\"`）会用另一种日历书写这些标签。Schedule 的日期值、网格和日期导航在任何日历和区域设置下都保持为格里高利历。"
      },
      {
        "guidance": true,
        "description": "为每个事件提供一个与 `categories` 条目匹配的类别字符串，使其颜色有意义的，并让屏幕阅读器朗读类别名称。不匹配的名称仍会渲染，但始终为蓝色。"
      },
      {
        "guidance": false,
        "description": "不要在选择日期的场景使用 Schedule。它没有选择模型；请改用 DateInput、DateRangeInput 或 Calendar。"
      },
      {
        "guidance": false,
        "description": "不要仅依赖事件颜色来传达含义。只有十种颜色，因此在较大的类别集合中会重复；无障碍标签已经朗读标题、类别和时间。"
      },
      {
        "guidance": true,
        "description": "当页面已经用自己的控件翻页范围时，将日期保留在状态中并传入 `plugins={[]}`：Schedule 随后只渲染范围标题而不带自己的控件，你的控件调用与 `onChangeDate` 相同的 setter。"
      },
      {
        "guidance": false,
        "description": "当仍希望保留 Schedule 的上一页、今天和下一页控件时，不要传入不带 `useSchedulePaginationPlugin` 的自定义 `plugins` 数组；自定义数组会替换默认集合，而不是扩展它。"
      }
    ],
    "anatomy": [
      {
        "name": "页眉起始插槽",
        "required": false,
        "description": "由插件填充的页眉前部区域。默认插件集在此渲染上一页 / 今天 / 下一页按钮组。"
      },
      {
        "name": "页眉标题",
        "required": true,
        "description": "命名屏幕上范围的 2 级标题，例如 \"May 2026\"。同一文本也是日程区域的无障碍名称。"
      },
      {
        "name": "加载旋转图标",
        "required": false,
        "description": "当异步事件加载器仍在等待时位于标题旁，标注为 \"Loading events\"。"
      },
      {
        "name": "页眉末尾插槽",
        "required": false,
        "description": "页眉尾部区域，默认空。视图选择器插件在此渲染其菜单。"
      },
      {
        "name": "视图主体",
        "required": true,
        "description": "视图渲染的任何内容：月网格；带小时栏和全天行的日/周时间网格；或在日期标题下分组的列表。网格视图暴露 ARIA grid、columnheader 和 gridcell 角色，并标记为 aria-readonly。日/周时间网格在一个以范围命名的、可通过键盘到达的区域内滚动；其日期标题、全天行和小时栏在列滚动时保持固定。全天行还容纳持续 24 小时或更长的时间事件，作为跨其天数的一个跨度。"
      },
      {
        "name": "事件",
        "required": false,
        "description": "每个事件一个药丸（网格视图）或带颜色圆点的行（列表视图），按其类别着色，并在过去后变暗。在日和周网格中，同时发生的事件并排共享列；当视图使用 `renderPopover` 构建时，每个有内容的事件都是一个按钮，打开视图的弹出面板。在月网格中，一周行最多显示三层芯片；繁忙的一天显示两个和一个 \"+N more\" 按钮，打开列出当天所有事件的弹出面板。月芯片以标题开头；仅当两者都能容纳时，定时事件的开始时间才跟在标题后。当月视图使用 `renderPopover` 构建时，每个有内容的芯片都是一个按钮，打开与其当天 \"+N more\" 相同的弹出面板；芯片覆盖的后续每一天都会为其事件向屏幕阅读器命名。"
      },
      {
        "name": "当前时间线",
        "required": false,
        "description": "在当天日或周时间网格上、当前时间处的一条线，仅在当天。它每分钟跳动一次，服务器渲染期间不存在。当渲染范围包含今天时，网格会在每个范围打开一次并滚动到该线前一小时处（限制在网格内），然后保持滚动位置不变，直到用户翻页到另一个范围或切换视图。"
      }
    ]
  },
  "propDescriptions": {
    "view": "拥有布局和每页覆盖日期范围的视图对象。使用 `createScheduleMonthlyView`、`createScheduleWeeklyView`、`createScheduleDayView` 或 `createScheduleListView` 构建；每个工厂接受自己的选项（`weekStartsOn`、`minHour`/`maxHour`/`hourHeight`、`days`）。周、日和月工厂还接受 `renderPopover(event)`：返回事件的内容，视图便将该事件渲染为一个打开其管理的弹出面板的按钮——视图只有一个弹出面板，以事件标题命名，使用系统标准表面、内边距、Escape 和轻触关闭以及焦点返回；返回 `null` 则使事件保持只读。在月视图中，该弹出面板还显示繁忙一天的列表，列表中的行会就地打开其事件。列表视图没有交互选项。",
    "events": "要么是静态数组（筛选为与渲染范围重叠的事件，并按开始时间排序），要么是以该范围开始和结束的 epoch 毫秒调用的加载器。加载器在等待时挂起；页眉显示旋转图标，视图渲染为空。结果按加载器标识和范围缓存，因此请保持加载器引用稳定（使用 `useCallback`），否则每次重新渲染都会重新获取。当页面已持有事件时，将其作为数组传入；Schedule 无需加载器即可选出每个范围的事件。",
    "categories": "按 `label === event.category` 与每个事件匹配的类别定义。匹配提供事件的颜色及其无障碍标签中的类别名称。类别名称没有对应条目的事件会保留该名称，但回退为蓝色；没有类别的事件朗读为蓝色 \"Event\"。类别可以代表任何你按颜色分组的东西——事件类型、日历或团队；要按日历给事件着色，请为每个日历提供自己的条目。",
    "date": "范围内任意位置的 Unix epoch 毫秒，用于渲染；视图会将其扩展为完整的月、周、日或列表窗口。完全受控；Schedule 从不更改它，因此请与 `onChangeDate` 搭配。",
    "focusDate": "Unix epoch 毫秒，标记被视为“今天”的日期：在月、周和日视图中，该单元格获得 `aria-current=\"date\"` 和高亮样式。列表视图会忽略它。省略时，它在挂载时捕获一次，之后永不推进。",
    "onChangeDate": "当分页插件向前或向后翻页，或按下 Today 时，以接下来要渲染的 epoch 毫秒调用。翻页保留一天中的时间；Today 传递当前时间。",
    "timezoneID": "IANA 时区 ID（例如 \"America/Los_Angeles\"），用于每次日期计算和每个格式化标签，因此当它变化时，相同的事件会跨天重新分组。",
    "plugins": "页眉插件，按顺序应用；每个插件可以包裹或替换起始、中间和末尾的页眉内容。提供数组会替换默认分页控件；组合 `useSchedulePaginationPlugin` 和 `useScheduleViewSelectorPlugin` 可同时保留两者。",
    "headingLevel": "日程内部子标题的标题级别（网格视图中的星期和日期列标题，以及列表视图中的日期标题），使日程能正确嵌套在周围页面大纲下。页眉范围标题始终是 2 级标题。"
  }
};
