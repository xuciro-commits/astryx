// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Stat',
  displayName: 'Stat',
  category: 'Content',
  keywords: ["stat","kpi","metric","number","value","delta","trend","dashboard","statistic","measure"],
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Metric name shown above the value, e.g. "Total requests".',
      required: true,
    },
    {
      name: 'value',
      type: 'ReactNode',
      description:
        'Headline metric rendered large with tabular numerals. Pass a pre-formatted string like "1.2M".',
      required: true,
    },
    {
      name: 'delta',
      type: "{value: string, direction: 'up' | 'down' | 'flat', sentiment?: 'positive' | 'negative' | 'neutral'}",
      description:
        'Change indicator next to the value: an up/down/flat glyph plus colored text. sentiment overrides the direction color mapping (up=positive, down=negative, flat=neutral) for inverted metrics like error rate.',
    },
    {
      name: 'description',
      type: 'string',
      description:
        'Muted supporting line under the value, e.g. "vs. previous 30 days".',
    },
    {
      name: 'media',
      type: 'ReactNode',
      description:
        'Trend slot rendered below the text content, e.g. a sparkline or mini chart. Stat does not render a chart itself.',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: "Size variant controlling the value's font size.",
      default: "'md'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-stat', visualProps: ['size']},
    ],
  },
  usage: {
    description:
      'A KPI/metric display for dashboards and summary rows: metric name, large tabular-nums value, an optional sentiment-aware delta, a supporting description, and a media slot for a sparkline or mini chart. Compose several in a Grid for a KPI row.',
    bestPractices: [
      { guidance: true, description: 'Pass pre-formatted strings for value and delta ("1.2M", "+12.4%"); Stat does not format numbers.' },
      { guidance: true, description: 'Set `sentiment` explicitly for inverted metrics where down is good, like error rate or latency.' },
      { guidance: true, description: 'Wrap Stat in a Card and lay out KPI rows with Grid columns={{minWidth: 240, max: 4}}.' },
      { guidance: false, description: 'Put a full-size chart in the media slot; it is meant for compact sparklines or trend glyphs.' },
      { guidance: false, description: 'Rely on delta color alone to convey meaning; the direction glyph and screen-reader text carry it too.' },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "Stat",
  "usage": {
    "description": "用于仪表盘和摘要行的 KPI/指标显示：指标名称、大型 tabular-nums 数值、可选的情感感知差值、支持性描述，以及用于迷你走势图或小型图表的媒体槽位。在 Grid 中组合多个 Stat 以形成 KPI 行。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为 value 和 delta 传递预格式化的字符串（\"1.2M\"、\"+12.4%\"）；Stat 不格式化数字。"
      },
      {
        "guidance": true,
        "description": "对于下降为好的反向指标（如错误率或延迟），显式设置 `sentiment`。"
      },
      {
        "guidance": true,
        "description": "将 Stat 包裹在 Card 中，并使用 Grid columns={{minWidth: 240, max: 4}} 布局 KPI 行。"
      },
      {
        "guidance": false,
        "description": "不要在媒体槽位中放置全尺寸图表；它旨在用于紧凑的迷你走势图或趋势字形。"
      },
      {
        "guidance": false,
        "description": "不要仅依赖差值颜色来传达含义；方向字形和屏幕阅读器文本也会传达。"
      }
    ]
  },
  "propDescriptions": {
    "label": "显示在数值上方的指标名称，例如 \"Total requests\"。",
    "value": "以 tabular 数字大号渲染的头条指标。传递预格式化字符串，如 \"1.2M\"。",
    "delta": "数值旁的变化指示器：上/下/持平字形加上彩色文本。对于错误率等反向指标，sentiment 会覆盖方向颜色映射（up=positive、down=negative、flat=neutral）。",
    "description": "数值下方的弱化支持性文本，例如 \"vs. previous 30 days\"。",
    "media": "渲染在文本内容下方的趋势槽位，例如迷你走势图或小型图表。Stat 本身不渲染图表。",
    "size": "控制数值字号的尺寸变体。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这类内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'KPI/metric display: label, large tabular-nums value, sentiment-aware delta, and trend media slot.',
  usage: {
    description:
      'A KPI/metric display for dashboards and summary rows: metric name, large tabular-nums value, an optional sentiment-aware delta, a supporting description, and a media slot for a sparkline or mini chart. Compose several in a Grid for a KPI row.',
    bestPractices: [
      { guidance: true, description: 'Pass pre-formatted strings for value and delta ("1.2M", "+12.4%"); Stat does not format numbers.' },
      { guidance: true, description: 'Set `sentiment` explicitly for inverted metrics where down is good, like error rate or latency.' },
      { guidance: true, description: 'Wrap Stat in a Card and lay out KPI rows with Grid columns={{minWidth: 240, max: 4}}.' },
      { guidance: false, description: 'Put a full-size chart in the media slot; it is meant for compact sparklines or trend glyphs.' },
      { guidance: false, description: 'Rely on delta color alone to convey meaning; the direction glyph and screen-reader text carry it too.' },
    ],
  },
  propDescriptions: {
    label: 'Metric name above the value.',
    value: 'Pre-formatted headline metric; tabular numerals.',
    delta: 'Direction glyph + colored change text; sentiment overrides direction colors.',
    description: 'Muted supporting line under the value.',
    media: 'Trend slot below the text (sparkline/mini chart).',
    size: "Value font size: 'sm' | 'md' | 'lg'.",
    xstyle: 'StyleX layout styles; must be stylex.create() value.',
  },
};
