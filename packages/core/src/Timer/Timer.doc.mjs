// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Elapsed time',
    required: true,
    description:
      'Semantic time element containing a standardized elapsed duration.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Timer',
  displayName: 'Timer',
  category: 'Content',
  keywords: [
    'timer',
    'elapsed',
    'duration',
    'seconds',
    'minutes',
    'hours',
    'stopwatch',
    'waiting',
    'loading',
    'processing',
  ],
  props: [
    {
      name: 'startTime',
      type: 'number',
      description:
        "Unix time in milliseconds when the measured operation began. Omit it to start from this Timer's mount.",
    },
    {
      name: 'format',
      type: "'elapsed' | 'clock'",
      description:
        'Standard duration representation. Elapsed uses compact units and drops seconds after one hour; clock uses m:ss or h:mm:ss.',
      default: "'elapsed'",
    },
    {
      name: 'type',
      type: "'body' | 'large' | 'label' | 'supporting' | 'code' | 'display-1' | 'display-2' | 'display-3' | 'inherit'",
      description:
        'Semantic text type. Uses the same typography behavior as Timestamp.',
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
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the Text wrapper. Must be a stylex.create() value.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the Text wrapper. Prefer xstyle for styling.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the Text wrapper. Prefer xstyle for styling.',
    },
  ],
  examples: [
    {
      label: 'Elapsed duration',
      code: '<Timer />',
    },
    {
      label: 'Stopwatch clock',
      code: '<Timer format="clock" />',
    },
    {
      label: 'Operation that started before mount',
      code: '<Timer startTime={operationStartedAt} />',
    },
    {
      label: 'Match surrounding text',
      code: `<Text>
  Processing for <Timer type="inherit" color="inherit" />
</Text>`,
    },
    {
      label: 'Prominent elapsed time',
      code: '<Timer type="body" size="lg" color="primary" weight="semibold" />',
    },
  ],
  theming: {
    targets: [{className: 'astryx-timer'}],
  },
  usage: {
    anatomy,
    description:
      'Displays a standardized elapsed duration for active work without scheduling a React render on every tick. Elapsed format updates by second below one hour and by minute after one hour; clock format remains second-precise.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use elapsed for compact duration text that may span seconds, minutes, or hours.',
      },
      {
        guidance: true,
        description:
          'Use clock for stopwatch-like surfaces where seconds remain meaningful after an hour.',
      },
      {
        guidance: true,
        description:
          'Pass startTime when the operation began before Timer mounted so the display reflects the complete wait.',
      },
      {
        guidance: false,
        description:
          'Do not use Timer for dates, time zones, or relative calendar language; use Timestamp instead.',
      },
      {
        guidance: false,
        description:
          'Do not add aria-live unless hearing an announcement every tick is appropriate for the specific task.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Standardized elapsed or stopwatch duration with clock-derived, non-rendering DOM updates.',
  propDescriptions: {
    startTime:
      "operation start as Unix milliseconds; omit to count from Timer's mount",
    format: 'elapsed compact units or clock stopwatch notation',
    type: 'semantic text type; defaults to supporting like Timestamp',
    size: 'explicit font size override',
    color: 'text color; defaults to secondary like Timestamp',
    weight: 'font weight override',
    xstyle: 'StyleX styles for the Text wrapper',
    className: 'CSS class for the Text wrapper',
    style: 'inline styles for the Text wrapper',
  },
  usage: {
    anatomy,
    description:
      'Use for active-operation elapsed time when periodic React renders would add avoidable work.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use elapsed for compact durations and clock for stopwatch UI.',
      },
      {
        guidance: true,
        description: 'Pass startTime for work that began before mount.',
      },
      {
        guidance: false,
        description: 'Use Timestamp for dates and relative calendar language.',
      },
    ],
  },
};

export const docsZh = {
  "name": "Timer",
  "usage": {
    "description": "显示活动工作的标准化已用时长，而不会在每个计时周期调度 React 渲染。elapsed 格式在一小时以下按秒更新，一小时后按分钟更新；clock 格式保持秒级精度。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 elapsed 显示可能跨越秒、分钟或小时的紧凑时长文本。"
      },
      {
        "guidance": true,
        "description": "在秒数在一小时后仍有意义的秒表式界面中使用 clock。"
      },
      {
        "guidance": true,
        "description": "当操作在 Timer 挂载之前就已开始时传入 startTime，使显示反映完整等待时间。"
      },
      {
        "guidance": false,
        "description": "不要将 Timer 用于日期、时区或相对日历语言；请改用 Timestamp。"
      },
      {
        "guidance": false,
        "description": "除非每个计时周期的播报适合特定任务，否则不要添加 aria-live。"
      }
    ],
    "anatomy": [
      {
        "name": "已用时间",
        "required": true,
        "description": "包含标准化已用时长的语义 time 元素。"
      }
    ]
  },
  "propDescriptions": {
    "startTime": "被测量操作开始时的 Unix 时间（毫秒）。省略则从此 Timer 挂载时开始。",
    "format": "标准时长表示。elapsed 使用紧凑单位并在一小时后丢弃秒；clock 使用 m:ss 或 h:mm:ss。",
    "type": "语义文本类型。使用与 Timestamp 相同的排版行为。",
    "size": "显式字体大小覆盖。覆盖 type 中的大小。",
    "color": "文本颜色。",
    "weight": "字重覆盖。",
    "xstyle": "Text 包装层的 StyleX 样式。必须是 stylex.create() 的值。",
    "className": "Text 包装层的 CSS 类名。样式设置优先使用 xstyle。",
    "style": "Text 包装层的内联样式。样式设置优先使用 xstyle。"
  }
};
