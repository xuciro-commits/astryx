// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChartAxis',
  displayName: 'Chart Axis',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: ['chart', 'axis', 'ticks', 'labels', 'scale', 'data visualization'],

  usage: {
    description:
      'ChartAxis renders tick labels and optional edge and tick lines from the scales owned by a parent Chart. Use it in the Chart axes slot for physical top, right, bottom, or left plot edges.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use ChartAxis inside Chart so its labels, ticks, and edge line share the same scales and plot dimensions as the marks.',
      },
      {
        guidance: true,
        description:
          'Use tickFormat for product-specific units or locale formatting, and maxTicks or truncate when dense category labels need a bounded presentation.',
      },
      {
        guidance: false,
        description:
          'Use axis labels or a pointer tooltip as the only way to obtain important values. Give Chart an accessible name and preserve an equivalent data view or summary.',
      },
      {
        guidance: false,
        description:
          'Hide the edge line while showing tick marks. showTicks intentionally keeps the line visible so each mark has a grounded edge.',
      },
    ],
    accessibility: [
      {
        name: 'Chart alternative',
        category: 'Content',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required on the parent Chart',
        states: ['All'],
        description:
          'Chart owns the accessible image name and supported small-data table. Tick labels supplement that chart-level alternative rather than replacing it.',
      },
      {
        name: 'Label text integrity',
        category: 'Content',
        criterion: 'Unicode grapheme clusters',
        requirement: 'Required when truncate is set',
        states: ['Truncated labels'],
        description:
          'Truncation keeps emoji, joined emoji sequences, flags, and combining marks intact before appending the ellipsis.',
      },
    ],
    anatomy: [
      {
        name: 'Axis edge line',
        required: false,
        description:
          'Line along the selected plot edge. It is shown by default only on the bottom edge and whenever tick marks are shown.',
      },
      {
        name: 'Tick marks',
        required: false,
        description:
          'Short lines extending outward from each retained tick position.',
      },
      {
        name: 'Tick labels',
        required: true,
        description:
          'Formatted scale values or categories positioned outside the selected plot edge.',
      },
    ],
  },

  props: [
    {
      name: 'position',
      type: "'top' | 'right' | 'bottom' | 'left'",
      description: 'Physical plot edge on which to render the axis.',
      required: true,
    },
    {
      name: 'tickCount',
      type: 'number',
      description:
        'Approximate continuous-scale tick count. d3 chooses the final values.',
      default: '5',
    },
    {
      name: 'maxTicks',
      type: 'number',
      description:
        'Maximum displayed label count. Labels are evenly skipped when the generated set is larger.',
    },
    {
      name: 'tickFormat',
      type: '(value: unknown) => string',
      description:
        'Formats each retained tick. When omitted, continuous scales use d3 formatting and band scales use their category strings.',
    },
    {
      name: 'truncate',
      type: 'number',
      description:
        'Maximum content characters retained before an ellipsis is appended. User-perceived characters remain intact.',
    },
    {
      name: 'animated',
      type: 'boolean',
      description:
        'Whether tick position and visibility changes use the built-in transition.',
      default: 'true',
    },
    {
      name: 'showAxisLine',
      type: 'boolean',
      description:
        'Whether to draw the edge line. Tick marks force the line on so they remain grounded.',
      default: 'true for bottom; false for top, right, and left',
    },
    {
      name: 'showTicks',
      type: 'boolean',
      description: 'Whether to draw an outward mark at each retained tick.',
      default: 'false',
    },
  ],

  examples: [
    {
      label: 'Bottom and left axes',
      code: `import {Chart, ChartAxis, ChartGrid, bar} from '@astryxdesign/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid horizontal />}
  axes={
    <>
      <ChartAxis position="bottom" />
      <ChartAxis position="left" tickFormat={value => String(value)} />
    </>
  }
/>;`,
    },
    {
      label: 'Dense category labels',
      code: `<ChartAxis
  position="bottom"
  maxTicks={8}
  truncate={12}
  showTicks
/>;`,
    },
  ],
};

export const docsZh = {
  "name": "ChartAxis",
  "displayName": "Chart Axis",
  "usage": {
    "description": "ChartAxis 从父级 Chart 拥有的比例尺渲染刻度标签以及可选的边缘线和刻度线。请在 Chart 的 `axes` 槽位中使用它，分别对应绘图区的顶部、右侧、底部或左侧物理边缘。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在 Chart 内使用 ChartAxis，使其标签、刻度和边缘线与标记共享相同的比例尺和绘图区尺寸。"
      },
      {
        "guidance": true,
        "description": "使用 `tickFormat` 处理产品特定的单位或本地化格式；当密集的分类标签需要限制展示量时，使用 `maxTicks` 或 `truncate`。"
      },
      {
        "guidance": false,
        "description": "不要将坐标轴标签或指针工具提示作为获取重要数值的唯一途径。应为 Chart 提供无障碍名称，并保留等效的数据视图或摘要。"
      },
      {
        "guidance": false,
        "description": "不要在显示刻度线时隐藏边缘线。`showTicks` 会有意保持线条可见，使每个标记都有清晰的基准边缘。"
      }
    ],
    "accessibility": [
      {
        "name": "图表替代内容",
        "category": "Content",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Required on the parent Chart",
        "states": [
          "全部"
        ],
        "description": "Chart 负责无障碍图像名称和支持的小数据表。刻度标签只是对该图表级替代内容的补充，不能替代它。"
      },
      {
        "name": "标签文本完整性",
        "category": "Content",
        "criterion": "Unicode grapheme clusters",
        "requirement": "Required when truncate is set",
        "states": [
          "截断的标签"
        ],
        "description": "截断会保持 emoji、组合 emoji 序列、旗帜和组合字符完整，然后再追加省略号。"
      }
    ],
    "anatomy": [
      {
        "name": "坐标轴边缘线",
        "required": false,
        "description": "沿选定绘图区边缘绘制的线条。默认仅在底部边缘显示，以及在显示刻度线时显示。"
      },
      {
        "name": "刻度线",
        "required": false,
        "description": "从每个保留的刻度位置向外延伸的短线。"
      },
      {
        "name": "刻度标签",
        "required": true,
        "description": "位于选定绘图区边缘外侧的格式化比例尺数值或分类。"
      }
    ]
  },
  "propDescriptions": {
    "position": "渲染坐标轴所在的物理绘图区边缘。",
    "tickCount": "连续比例尺的大致刻度数量。最终值由 d3 决定。",
    "maxTicks": "显示标签的最大数量。当生成的标签集合更大时，会均匀跳过标签。",
    "tickFormat": "格式化每个保留的刻度。省略时，连续比例尺使用 d3 格式化，带状比例尺使用其分类字符串。",
    "truncate": "追加省略号前保留的最大内容字符数。用户感知的字符会保持完整。",
    "animated": "刻度位置和可见性变化是否使用内置过渡。",
    "showAxisLine": "是否绘制边缘线。启用刻度线时会强制显示，使标记有清晰的基准边缘。",
    "showTicks": "是否在每个保留的刻度处绘制向外标记。"
  }
};
