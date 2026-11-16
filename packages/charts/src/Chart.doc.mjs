// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Chart',
  displayName: 'Chart',
  group: 'Charts',
  category: 'Data Visualization',
  keywords: [
    'chart',
    'graph',
    'plot',
    'visualization',
    'bar chart',
    'line chart',
    'data',
  ],

  usage: {
    description:
      'Chart lays out one or more mark definitions against shared responsive x and y scales. Use it for data visualizations that combine Astryx chart marks, axes, grids, legends, tooltips, and custom interaction layers.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give the chart a concise title that states what is measured, and use subtitle for the comparison, time range, or other context needed to interpret it.',
      },
      {
        guidance: true,
        description:
          'Use the same series array for Chart and any directly composed ChartTooltip so labels, colors, and resolved points stay aligned.',
      },
      {
        guidance: false,
        description:
          'Use color as the only way to distinguish series or communicate status. Pair color with labels, mark shapes, direct annotations, or another visible cue.',
      },
      {
        guidance: false,
        description:
          'Reuse one mark definition object across multiple Chart instances. Mark definitions currently carry per-chart layout metadata and are single-use.',
      },
    ],
    accessibility: [
      {
        name: 'Accessible chart name',
        category: 'Semantics',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required',
        states: ['All'],
        description:
          'Provide title when a product-specific name is available. Without it, Chart derives a localized name from the primary series labels and xKey.',
      },
      {
        name: 'Small-data table',
        category: 'Content',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required for supported small datasets',
        states: ['1–100 row × series cells'],
        description:
          'Chart mirrors small datasets into a visually hidden table. For larger datasets, provide an equivalent nearby summary or data view because the built-in table is intentionally omitted.',
      },
      {
        name: 'Meaningful chart graphics',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: '3:1 when the graphic carries information',
        states: ['Light', 'Dark', 'Supported themes'],
        description:
          'Measure meaningful marks and state indicators against their rendered backdrop. Decorative grid lines are not required to meet the non-text threshold.',
      },
      {
        name: 'Tooltip information',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard and 2.5.1 Pointer Gestures',
        requirement: 'Supplemental only',
        states: ['Tooltip enabled'],
        description:
          'Do not make hover-only tooltip content the only way to obtain important values. Keep the hidden table or another equivalent data view available.',
      },
    ],
    anatomy: [
      {
        name: 'Header',
        required: false,
        description:
          'Optional visible title and supporting subtitle above the plot.',
      },
      {
        name: 'Plot',
        required: true,
        description:
          'Responsive SVG coordinate space containing the clipped series marks.',
      },
      {
        name: 'Grid and axes',
        required: false,
        description:
          'Caller-supplied ChartGrid and ChartAxis elements that share the plot scales.',
      },
      {
        name: 'Legend',
        required: false,
        description:
          'Derived or caller-supplied series labels and swatches placed above, below, at the start, or at the end of the plot.',
      },
      {
        name: 'Tooltip and interactions',
        required: false,
        description:
          'Pointer-driven overlays that consume the chart interaction stream.',
      },
      {
        name: 'Data table',
        required: false,
        description:
          'Visually hidden tabular alternative rendered for small datasets.',
      },
    ],
  },

  props: [
    {
      name: 'data',
      type: 'Record<string, unknown>[]',
      description:
        'Rows to visualize. Each row may contain the x field and one or more series fields.',
      required: true,
    },
    {
      name: 'xKey',
      type: 'string',
      description: 'Field name read from each data row for the shared x scale.',
      required: true,
    },
    {
      name: 'series',
      type: 'SeriesDef[]',
      description:
        'Mark definitions created by helpers such as bar(), line(), area(), or dot(). Build a fresh array for each Chart.',
      required: true,
    },
    {
      name: 'height',
      type: 'number',
      description: 'Chart height in CSS pixels.',
      default: '300',
    },
    {
      name: 'margin',
      type: 'Partial<ChartMargin>',
      description:
        'Plot inset overrides in CSS pixels for top, right, bottom, and left.',
      default: '{top: 24, right: 24, bottom: 32, left: 48}',
    },
    {
      name: 'yBaseline',
      type: "'auto' | 'zero' | 'data'",
      description:
        'How Chart derives the y-domain when yDomain is omitted: mark-aware zero/headroom, symmetric around zero, or tight to the data extent.',
      default: "'auto'",
    },
    {
      name: 'yDomain',
      type: '[number, number]',
      description:
        'Explicit y-domain. When set, it takes precedence over yBaseline, automatic headroom, and scale nicening.',
    },
    {
      name: 'xDomain',
      type: '[number, number]',
      description:
        'Explicit x-domain for numeric scales, including an empty streaming window. Categorical scales ignore it.',
    },
    {
      name: 'grid',
      type: 'ReactNode',
      description:
        'Grid content rendered behind the series, normally ChartGrid.',
      slotElements: [{__element: 'ChartGrid', props: {horizontal: true}}],
    },
    {
      name: 'axes',
      type: 'ReactNode',
      description:
        'Axis content rendered after the series, normally one or more ChartAxis elements.',
      slotElements: [
        {__element: 'ChartAxis', props: {position: 'bottom'}},
        {__element: 'ChartAxis', props: {position: 'left'}},
      ],
    },
    {
      name: 'legend',
      type: 'boolean | ChartLegendProps',
      description:
        'Set true for a derived bottom legend, or pass items, position, and alignment.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: "boolean | Omit<ChartTooltipProps, 'series'>",
      description:
        'Set true for the grouped pointer tooltip, or pass render and presentation options.',
      default: 'false',
    },
    {
      name: 'interactions',
      type: 'ReactNode',
      description:
        'Interaction overlays rendered above the pointer-capture layer.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Additional SVG content rendered after the built-in tooltip for advanced composition.',
    },
    {
      name: 'title',
      type: 'string',
      description:
        'Visible heading and accessible name for the chart image. A localized fallback is derived when omitted.',
    },
    {
      name: 'subtitle',
      type: 'string',
      description:
        'Visible supporting text that also describes the chart image.',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root chart container.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description: 'CSS class name appended to the root chart container.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles merged onto the root chart container after the component styles.',
    },
  ],

  examples: [
    {
      label: 'Bar and trend line',
      code: `import {Chart, ChartAxis, ChartGrid, bar, line} from '@astryxdesign/charts';

const series = [
  bar('revenue', {label: 'Revenue'}),
  line('trend', {label: 'Trend'}),
];

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={series}
  title="Monthly revenue"
  grid={<ChartGrid horizontal />}
  axes={
    <>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" />
    </>
  }
  legend
  tooltip
/>;`,
    },
    {
      label: 'Stable numeric window',
      code: `<Chart
  data={streamedValues}
  xKey="timestamp"
  series={[line('value')]}
  xDomain={[windowStart, windowEnd]}
  yDomain={[0, 100]}
  title="Live utilization"
/>;`,
    },
  ],
};

export const docsZh = {
  "name": "Chart",
  "usage": {
    "description": "Chart 将一个或多个标记定义排布在共享的响应式 x、y 比例尺上。适用于组合 Astryx 图表标记、坐标轴、网格、图例、工具提示和自定义交互层的数据可视化。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为图表提供简洁的标题，说明所度量的内容；使用 `subtitle` 说明比较对象、时间范围或解读所需的其它背景信息。"
      },
      {
        "guidance": true,
        "description": "让 Chart 与任何直接组合的 ChartTooltip 使用同一个 `series` 数组，使标签、颜色和解析后的数据点保持一致。"
      },
      {
        "guidance": false,
        "description": "不要将颜色作为区分序列或传达状态的唯一方式。应将颜色与标签、标记形状、直接标注或其它可见线索搭配使用。"
      },
      {
        "guidance": false,
        "description": "不要在多个 Chart 实例之间复用同一个标记定义对象。标记定义目前携带按图表区分的布局元数据，仅供单次使用。"
      }
    ],
    "accessibility": [
      {
        "name": "无障碍图表名称",
        "category": "Semantics",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Required",
        "states": [
          "全部"
        ],
        "description": "当存在产品特定的名称时，请提供 `title`。若未提供，Chart 会根据主要序列标签和 `xKey` 推导出本地化名称。"
      },
      {
        "name": "小数据表",
        "category": "Content",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Required for supported small datasets",
        "states": [
          "1–100 行 × 序列单元格"
        ],
        "description": "Chart 会将小数据集镜像到视觉上隐藏的表格中。对于更大的数据集，请在附近提供等效的摘要或数据视图，因为内置表格会被有意省略。"
      },
      {
        "name": "有意义的图表图形",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "3:1 when the graphic carries information",
        "states": [
          "浅色",
          "深色",
          "支持的主题"
        ],
        "description": "对照实际渲染的背景，测量有意义的标记和状态指示器。装饰性网格线无需满足非文本对比度阈值。"
      },
      {
        "name": "工具提示信息",
        "category": "Keyboard",
        "criterion": "2.1.1 Keyboard and 2.5.1 Pointer Gestures",
        "requirement": "Supplemental only",
        "states": [
          "已启用工具提示"
        ],
        "description": "不要将仅在悬停时显示的工具提示内容作为获取重要数值的唯一途径。请保留隐藏表格或其它等效的数据视图。"
      }
    ],
    "anatomy": [
      {
        "name": "标题区",
        "required": false,
        "description": "绘图区上方的可选可见标题和辅助副标题。"
      },
      {
        "name": "绘图区",
        "required": true,
        "description": "包含裁剪后序列标记的响应式 SVG 坐标空间。"
      },
      {
        "name": "网格与坐标轴",
        "required": false,
        "description": "由调用方提供的 ChartGrid 和 ChartAxis 元素，它们共享绘图区的比例尺。"
      },
      {
        "name": "图例",
        "required": false,
        "description": "派生或由调用方提供的序列标签和色块，可放置在绘图区的上方、下方、起始处或末尾。"
      },
      {
        "name": "工具提示与交互",
        "required": false,
        "description": "接收图表交互流的指针驱动覆盖层。"
      },
      {
        "name": "数据表",
        "required": false,
        "description": "为小数据集渲染的视觉隐藏表格替代内容。"
      }
    ]
  },
  "propDescriptions": {
    "data": "要可视化的数据行。每行可包含 x 字段以及一个或多个序列字段。",
    "xKey": "从每个数据行中读取、用于共享 x 比例尺的字段名。",
    "series": "由 `bar()`、`line()`、`area()` 或 `dot()` 等辅助函数创建的标记定义。请为每个 Chart 构建全新的数组。",
    "height": "图表高度，单位为 CSS 像素。",
    "margin": "绘图区内边距覆盖值，单位为 CSS 像素，分别对应上、右、下、左。",
    "yBaseline": "省略 `yDomain` 时 Chart 推导 y 定义域的方式：按标记类型处理零值和留白、围绕零对称，或紧贴数据范围。",
    "yDomain": "显式的 y 定义域。设置后，它的优先级高于 `yBaseline`、自动留白和比例尺刻度取整。",
    "xDomain": "数值比例尺的显式 x 定义域，包括空的流式窗口。分类比例尺会忽略此设置。",
    "grid": "渲染在序列后方的网格内容，通常为 ChartGrid。",
    "axes": "渲染在序列之后的坐标轴内容，通常为一个或多个 ChartAxis 元素。",
    "legend": "设为 `true` 时显示派生的底部图例，或传入 `items`、`position` 和 `alignment`。",
    "tooltip": "设为 `true` 时启用分组的指针工具提示，或传入 `render` 和展示选项。",
    "interactions": "渲染在指针捕获层之上的交互覆盖层。",
    "children": "在内置工具提示之后渲染的额外 SVG 内容，用于高级组合。",
    "title": "图表图像的可见标题和无障碍名称。省略时会推导出本地化回退名称。",
    "subtitle": "可见的辅助文本，同时也描述图表图像。",
    "ref": "转发到根图表容器的 `ref`。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是 `style={{}}` 之类的内联样式对象。",
    "className": "追加到根图表容器的 CSS 类名。",
    "style": "在组件样式之后合并到根图表容器的内联样式。"
  }
};
