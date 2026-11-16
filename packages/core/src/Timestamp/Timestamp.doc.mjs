// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file Timestamp.doc.mjs
 * @input Timestamp public props, theming targets, and usage patterns
 * @output Consumer documentation for formatted times and hover/keyboard details
 * @position Timestamp documentation consumed by the CLI and doc site
 */

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Timestamp',
  displayName: 'Timestamp',
  category: 'Content',
  keywords: [
    'date',
    'time',
    'datetime',
    'relative',
    'ago',
    'clock',
    'format',
    'duration',
    'relativetime',
  ],
  playground: {
    // `value` is required but has no semantic default, so the properties-tab
    // preview fell back to the literal string "value" — which
    // `new Date("value")` rejects, crashing the preview with "Invalid time
    // value". Seed a valid ISO 8601 date so the interactive preview renders.
    defaults: {
      value: '2026-02-19T17:00:00Z',
    },
  },
  props: [
    {
      name: 'value',
      type: 'string | number',
      description:
        'The date/time to display. Accepts Unix timestamps (seconds) or ISO 8601 strings.',
      required: true,
    },
    {
      name: 'format',
      type: "'relative' | 'relative_short' | 'auto' | 'date' | 'date_long' | 'date_weekday' | 'date_time' | 'time' | 'system_date' | 'system_date_time' | 'system_time' | 'unix_seconds'",
      description:
        "Display format. 'relative' uses the locale's native long relative-time wording ('2 hours ago' in English), 'relative_short' uses its narrow pattern ('2h ago' in English) for compact surfaces, 'date' shows 'Mar 21, 2025', 'date_long' shows 'March 21, 2025', 'date_weekday' shows 'Wed, Mar 21, 2025', 'date_time' shows 'Mar 21, 2025, 2:51 PM', 'time' shows '2:51 PM', 'system_*' variants use ISO-style formatting, 'unix_seconds' shows the Unix time in whole seconds since the epoch (an absolute, zone-independent value), 'auto' switches from relative to date_time based on recency. Absolute formats never read the current time. 'relative', 'relative_short' and 'auto' read it on the client only: a server render or static prerender shows the full date and time in UTC, labelled, and the client switches to the format's normal output after hydration. Date-bearing formats ('date', 'date_long', 'date_weekday', 'date_time', and the full date in the hover card and the accessible name) use the InternationalizationProvider calendar, such as calendar=\"persian\"; 'time', the relative formats, 'system_*', and 'unix_seconds' do not change.",
      default: "'auto'",
    },
    {
      name: 'timezoneID',
      type: 'string',
      description:
        "IANA time zone the absolute formats render in, such as 'UTC' or 'America/Los_Angeles'. Omit (or pass 'local') for the viewer's own zone. An explicit zone renders identically on the server and the client, so it is the way to show an absolute time without a hydration mismatch; relative formats' visible text ignores it, while configured tooltipEntries rows still follow it. An unknown identifier warns once in development and falls back to the viewer's zone.",
    },
    {
      name: 'autoThreshold',
      type: 'number',
      description:
        "Threshold in seconds for 'auto' format to switch from relative to date_time.",
      default: '604800',
    },
    {
      name: 'hasTooltip',
      type: 'boolean',
      description:
        'Whether to show a copyable hover card with the full date/time on hover or keyboard focus. Applies to relative timestamps and to any format once tooltipEntries is configured.',
      default: 'true',
    },
    {
      name: 'tooltipEntries',
      type: 'ReadonlyArray<{timezoneID?: string; format?: TimestampTooltipFormat; label?: string; isCopyable?: boolean}>',
      description:
        "Lines to show on hover, so one instant can be read (and optionally copied) in several time zones and/or formats at once. Each entry is one line, in the order given. An entry without timezoneID follows the Timestamp timezoneID when set, else the viewer's zone; 'local' always means the viewer's zone; format defaults to the full absolute style and also accepts 'full' alongside every non-relative TimestampFormat. Rows are read-only unless they set isCopyable (default false); copyable rows show a copy button in a dedicated trailing action column so buttons align, and the column is only present when some row is copyable. With no entries the card shows a single default row with the full absolute time, which is copyable. Configuring entries also attaches the surface to absolute formats, which otherwise have none.",
    },
    {
      name: 'isTimezoneShown',
      type: 'boolean',
      description:
        "Whether to append the timezone abbreviation to the visible text. Applies to the date_time and time formats; system_* formats stay machine-readable and never carry one. Use tooltipEntries to control the tooltip's time zones.",
      default: 'false',
    },
    {
      name: 'isLive',
      type: 'boolean',
      description:
        'Whether the relative time should update live (e.g. "2 min ago" \u2192 "3 min ago").',
      default: 'false',
    },
    {
      name: 'type',
      type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
      description:
        'Semantic text type from Text. Determines size, weight, and line-height.',
      default: "'supporting'",
    },
    {
      name: 'size',
      type: "'4xs' | '3xs' | '2xs' | 'xsm' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'",
      description: 'Explicit font size override. Overrides the size from type.',
    },
    {
      name: 'color',
      type: "'primary' | 'secondary' | 'disabled' | 'placeholder' | 'accent' | 'inherit'",
      description: 'Text color.',
      default: "'secondary'",
    },
    {
      name: 'weight',
      type: "'normal' | 'medium' | 'semibold' | 'bold'",
      description: 'Font weight override.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-timestamp', visualProps: ['type', 'color', 'format']},
      {className: 'astryx-timestamp-copy-button'},
    ],
    componentIcons: [
      {
        slot: 'timestamp-copy',
        description: 'The copy button icon on a hover card row.',
        fallback:
          '`copy`; `check` while copied; `close` while a failed copy shows',
        state: [
          {
            name: 'copied',
            type: 'boolean',
            description:
              'True while the copied feedback shows after a successful copy. False while a failed copy shows, so a theme-mapped slot keeps its rest glyph then.',
          },
        ],
        whenNull:
          'Hides the glyph. The button keeps its size, name, tooltip, and copy action.',
      },
    ],
  },
  usage: {
    description:
      'Timestamp formats a date or time value into human-readable text. Use it to show when something was created, updated, or is scheduled; picking relative for recency, absolute for precision, or auto to let the component decide.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the auto format in feeds and lists so recent items show "2 hours ago" and older items show the full date automatically.',
      },
      {
        guidance: true,
        description:
          'Keep formatting consistent within the same list or table; mixing relative and absolute timestamps in the same column confuses scanning.',
      },
      {
        guidance: true,
        description:
          'Enable isTimezoneShown when the audience spans multiple time zones, like a global team calendar or audit log.',
      },
      {
        guidance: true,
        description:
          "Use tooltipEntries when readers must compare zones, such as an incident log where the reader's time and the event's origin zone both matter.",
      },
      {
        guidance: true,
        description:
          'Pass timezoneID when an absolute time must read the same for every viewer and on the server, like an incident log timestamp or anything server-rendered; without it the server markup depends on the server zone.',
      },
      {
        guidance: true,
        description:
          'Label every entry once a tooltip shows more than one zone; a bare abbreviation is not always recognizable (Tokyo renders as "GMT+9", not "JST").',
      },
      {
        guidance: true,
        description:
          'Use isLive for active dashboards or real-time feeds so the relative time stays accurate without a page refresh.',
      },
      {
        guidance: true,
        description:
          'Reach for tooltipEntries when readers need to grab an exact value: an incident log or deploy record where someone pastes the UTC time or Unix seconds elsewhere; configuring entries turns the hover into copy-to-clipboard rows.',
      },
      {
        guidance: false,
        description:
          "Don't display raw Unix timestamps or ISO strings to users; always pass them through Timestamp to get a human-readable format.",
      },
      {
        guidance: false,
        description:
          'Avoid system_date or system_time formats in user-facing UI; they are meant for developer tools, logs, and machine-readable contexts.',
      },
      {
        guidance: false,
        description:
          'Don\'t disable the hover card on relative timestamps; users expect to hover for the full date when they see "3 hours ago".',
      },
      {
        guidance: false,
        description:
          "Don't stack many zones into one card; it is capped at 300px wide and long labelled lines wrap. Two or three entries read well.",
      },
      {
        guidance: false,
        description:
          'Don\'t pass a fixed-offset abbreviation like "EST" as timezoneID; it is a valid identifier but never observes daylight saving, so it reads an hour wrong for half the year. Use the region id, "America/New_York".',
      },
    ],
    anatomy: [
      {
        name: 'Formatted text',
        required: true,
        description:
          'The rendered date, time, or relative label like "2 hours ago" or "Mar 21, 2025".',
      },
      {
        name: 'Hover card',
        required: false,
        description:
          'A copyable hover card showing the full absolute date and time when the display is relative, or the rows configured via tooltipEntries. Its default single row carries the full absolute time.',
      },
      {
        name: 'Hover card row',
        required: false,
        description:
          'One row of the card: an optional label beside the instant rendered in one time zone and format. Rows opt into a copy button via isCopyable.',
      },
      {
        name: 'Copy button',
        required: true,
        description:
          "Per-row copy-to-clipboard button in the hover card; copies that row's formatted value.",
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "propDescriptions": {
    "value": "要显示的日期/时间。接受 Unix 时间戳（秒）或 ISO 8601 字符串。",
    "format": "显示格式。'relative' 使用区域设置的长格式相对时间措辞（英语中为 '2 hours ago'），'relative_short' 使用其窄格式（英语中为 '2h ago'）以适配紧凑表面，'date' 显示 'Mar 21, 2025'，'date_long' 显示 'March 21, 2025'，'date_weekday' 显示 'Wed, Mar 21, 2025'，'date_time' 显示 'Mar 21, 2025, 2:51 PM'，'time' 显示 '2:51 PM'，'system_*' 变体使用 ISO 风格格式，'unix_seconds' 显示自纪元以来的整秒 Unix 时间（一个绝对的、与时区无关的值），'auto' 根据时间远近从相对格式切换为 date_time。绝对格式从不读取当前时间。'relative'、'relative_short' 和 'auto' 仅在客户端读取当前时间：服务端渲染或静态预渲染会显示带标签的 UTC 完整日期和时间，hydration 后客户端会切换为该格式的正常输出。带日期的格式（'date'、'date_long'、'date_weekday'、'date_time'，以及悬停卡片和无障碍名称中的完整日期）使用 InternationalizationProvider 的日历，例如 calendar=\"persian\"；'time'、相对格式、'system_*' 和 'unix_seconds' 不会改变。",
    "autoThreshold": "'auto' 格式从相对格式切换为 date_time 的阈值（秒）。",
    "hasTooltip": "是否在悬停或键盘聚焦时显示包含完整日期/时间的可复制悬停卡片。适用于相对时间戳，以及配置 tooltipEntries 后的任何格式。",
    "tooltipEntries": "悬停时显示的行，使一个时刻可以同时在多个时区和/或格式中读取（并可选复制）。每个条目一行，按给定顺序排列。未设置 timezoneID 的条目会遵循 Timestamp 的 timezoneID（如已设置），否则使用查看者的时区；'local' 始终表示查看者的时区；format 默认使用完整的绝对样式，并且在所有非相对 TimestampFormat 之外还接受 'full'。除非设置 isCopyable（默认 false），否则行是只读的；可复制的行会在专用的尾随操作列中显示复制按钮，以便按钮对齐，并且仅当某些行可复制时才存在该列。没有条目时，卡片显示单个包含完整绝对时间的默认行，该行可复制。配置条目还会将该表面附加到绝对格式，否则绝对格式没有悬停卡片。",
    "isTimezoneShown": "是否在可见文本后附加时区缩写。适用于 date_time 和 time 格式；system_* 格式保持机器可读，从不携带时区缩写。使用 tooltipEntries 控制工具提示的时区。",
    "isLive": "相对时间是否应实时更新（例如 \"2 min ago\" → \"3 min ago\"）。",
    "type": "来自 Text 的语义文本类型。决定大小、字重和行高。",
    "size": "显式字号覆盖。覆盖 type 中的大小。",
    "color": "文本颜色。",
    "weight": "字重覆盖。",
    "timezoneID": "绝对格式渲染所用的 IANA 时区，例如 'UTC' 或 'America/Los_Angeles'。省略（或传入 'local'）表示查看者自己的时区。显式时区在服务端和客户端渲染结果完全相同，因此这是显示绝对时间而不会出现 hydration 不匹配的方式；相对格式的可见文本会忽略它，而配置的 tooltipEntries 行仍会遵循它。未知标识符会在开发环境中警告一次，并回退到查看者的时区。"
  },
  "usage": {
    "description": "Timestamp 将日期或时间值格式化为人类可读的文本。用于显示某事物的创建、更新或计划时间；近期内容选用相对格式，需要精确时选用绝对格式，或者交给 auto 让组件决定。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在信息流和列表中使用 auto 格式，使近期项目自动显示 \"2 hours ago\"，较早项目显示完整日期。"
      },
      {
        "guidance": true,
        "description": "在同一列表或表格中保持格式一致；在同一列中混用相对和绝对时间戳会妨碍扫读。"
      },
      {
        "guidance": true,
        "description": "当受众跨越多个时区时启用 isTimezoneShown，例如全球团队日历或审计日志。"
      },
      {
        "guidance": true,
        "description": "当读者必须比较时区时使用 tooltipEntries，例如读者所在时区和事件起源时区都很重要的事件日志。"
      },
      {
        "guidance": true,
        "description": "当绝对时间必须对每个查看者和服务器读取一致时传入 timezoneID，例如事件日志时间戳或任何服务端渲染的内容；否则服务端标记会取决于服务器时区。"
      },
      {
        "guidance": true,
        "description": "一旦工具提示显示多个时区，就为每个条目添加标签；裸缩写并不总是容易识别（Tokyo 渲染为 \"GMT+9\"，而不是 \"JST\"）。"
      },
      {
        "guidance": true,
        "description": "对活跃的仪表盘或实时信息流使用 isLive，使相对时间无需刷新页面即可保持准确。"
      },
      {
        "guidance": true,
        "description": "当读者需要获取精确值时使用 tooltipEntries：例如事件日志或部署记录，有人要把 UTC 时间或 Unix 秒数粘贴到别处；配置条目会将悬停卡片变为可复制到剪贴板的行。"
      },
      {
        "guidance": false,
        "description": "不要向用户显示原始 Unix 时间戳或 ISO 字符串；始终通过 Timestamp 传递它们以获得人类可读的格式。"
      },
      {
        "guidance": false,
        "description": "避免在面向用户的 UI 中使用 system_date 或 system_time 格式；它们用于开发者工具、日志和机器可读的上下文。"
      },
      {
        "guidance": false,
        "description": "不要在相对时间戳上禁用悬停卡片；当用户看到 \"3 hours ago\" 时，他们期望悬停查看完整日期。"
      },
      {
        "guidance": false,
        "description": "不要在一张卡片中堆叠太多时区；其宽度上限为 300px，较长的带标签行会换行。两到三个条目阅读效果良好。"
      },
      {
        "guidance": false,
        "description": "不要将 \"EST\" 这样的固定偏移缩写作为 timezoneID 传入；它是有效的标识符，但从不遵守夏令时，因此一年中有半年会读错一小时。请使用区域 id \"America/New_York\"。"
      }
    ],
    "anatomy": [
      {
        "name": "格式化文本",
        "required": true,
        "description": "渲染的日期、时间或相对标签，如 \"2 hours ago\" 或 \"Mar 21, 2025\"。"
      },
      {
        "name": "悬停卡片",
        "required": false,
        "description": "可复制的悬停卡片，当显示为相对时间时展示完整的绝对日期和时间，或展示通过 tooltipEntries 配置的行。其默认单行包含完整的绝对时间。"
      },
      {
        "name": "悬停卡片行",
        "required": false,
        "description": "卡片的一行：在某一时区和格式中渲染的时刻旁边可选一个标签。行通过 isCopyable 选择是否显示复制按钮。"
      },
      {
        "name": "复制按钮",
        "required": true,
        "description": "悬停卡片中每行的复制到剪贴板按钮；复制该行格式化后的值。"
      }
    ]
  },
  "name": "Timestamp"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'formatted timestamp with relative/absolute/auto modes, live updates, timezone display, and a copyable multi-zone hover card (default single full-time row, customized via tooltipEntries)',
  usage: {
    description:
      'Timestamp formats a date or time into readable text. Use for creation dates, update times, or schedules; relative for recency, absolute for precision, auto to switch automatically.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Auto format in feeds and lists; recent shows relative, older shows date_time.',
      },
      {
        guidance: true,
        description:
          'Consistent formatting within the same list or table column.',
      },
      {
        guidance: true,
        description: 'isTimezoneShown for multi-timezone audiences.',
      },
      {
        guidance: true,
        description:
          'tooltipEntries to compare zones when the reader time and event zone both matter.',
      },
      {
        guidance: true,
        description:
          'Label each entry once a tooltip shows more than one zone; a bare abbreviation is not always recognizable (Tokyo renders "GMT+9", not "JST").',
      },
      {
        guidance: true,
        description: 'isLive for dashboards so relative time stays current.',
      },
      {
        guidance: true,
        description:
          'tooltipEntries when readers must grab an exact value: an incident log or deploy record where someone pastes the UTC time or Unix seconds; entries turn the hover into copy-to-clipboard rows.',
      },
      {
        guidance: false,
        description:
          "Don't show raw Unix timestamps or ISO strings; always use Timestamp.",
      },
      {
        guidance: false,
        description:
          'Avoid system_* formats in user-facing UI; those are for dev tools and logs.',
      },
      {
        guidance: false,
        description:
          "Don't disable the hover card on relative timestamps; users expect the full date on hover.",
      },
      {
        guidance: false,
        description:
          "Don't stack many zones in one card; it caps at 300px and long labels wrap. Two or three read well.",
      },
      {
        guidance: false,
        description:
          'Don\'t use fixed-offset ids like "EST" for timezoneID; they skip DST. Use region ids like "America/New_York".',
      },
    ],
  },
  propDescriptions: {
    value: 'date/time as unix seconds or ISO string',
    format:
      "display mode: 'relative' (locale-native long wording), 'relative_short' (locale-native narrow wording), 'auto', 'date', 'date_long', 'date_weekday', 'date_time', 'time', 'system_date', 'system_date_time', 'system_time', 'unix_seconds'; date-bearing formats use the provider calendar, system_* and time do not",
    autoThreshold: 'seconds threshold for auto relative\u2192date_time switch',
    hasTooltip:
      'show copyable full-time hover card on hover or keyboard focus (relative mode, or any format with tooltipEntries)',
    tooltipEntries:
      "hover rows across zones/formats: [{timezoneID?, format?, label?}]; an entry without timezoneID follows the Timestamp timezoneID when set, else the viewer zone ('local' always means the viewer zone), format defaults to 'full'; the hover surface is always a copy-to-clipboard card, these customize its rows (default: a single full-time row), and configuring entries enables the card on absolute formats",
    isTimezoneShown:
      'append timezone abbreviation to visible text (date_time and time only)',
    isLive: 'live-update relative time',
    type: 'Text semantic type',
    size: 'font size override',
    color: 'text color',
    weight: 'font weight override',
  },
};
