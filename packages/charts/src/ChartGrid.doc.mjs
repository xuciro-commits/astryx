// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChartGrid',
  displayName: 'Chart Grid',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: ['chart', 'grid', 'guides', 'axis', 'ticks', 'data visualization'],

  usage: {
    description:
      'ChartGrid draws horizontal and vertical guide lines from the scales owned by a parent Chart. Use it in the Chart grid slot so guides share the plot dimensions and tick values used by the chart.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pair ChartGrid with ChartAxis when readers need labelled values beside the guide lines.',
      },
      {
        guidance: true,
        description:
          'Use horizontal guides for value comparison and add vertical guides only when they help readers align categories or continuous x values.',
      },
      {
        guidance: false,
        description:
          'Use grid lines as the only way to communicate a value or distinction. Keep meaningful chart information in labels, marks, and the parent Chart alternative.',
      },
      {
        guidance: false,
        description:
          'Expect tickCount to thin categorical band centers. It requests density only for continuous scales; categorical vertical guides render once per band.',
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
          'Chart owns the accessible image name and supported small-data table. Grid lines supplement that chart-level alternative rather than replacing it.',
      },
      {
        name: 'Visual-only guides',
        category: 'Color contrast',
        criterion: '1.4.11 Non-text Contrast',
        requirement: 'Do not carry information alone',
        states: ['Horizontal', 'Vertical', 'Combined'],
        description:
          'Grid lines are supporting guides. Preserve visible labels, marks, or another qualifying cue so understanding does not depend on the grid alone.',
      },
    ],
    anatomy: [
      {
        name: 'Grid lines',
        required: false,
        description:
          'Horizontal lines at continuous y ticks and vertical lines at x ticks or categorical band centers.',
      },
    ],
  },

  props: [
    {
      name: 'horizontal',
      type: 'boolean',
      description:
        'Whether to draw horizontal guides at continuous y ticks other than zero.',
      default: 'true',
    },
    {
      name: 'vertical',
      type: 'boolean',
      description:
        'Whether to draw vertical guides at continuous x ticks or categorical band centers.',
      default: 'false',
    },
    {
      name: 'tickCount',
      type: 'number',
      description:
        'Approximate guide count requested from continuous scales. It does not thin categorical band centers.',
      default: '5',
    },
  ],

  examples: [
    {
      label: 'Horizontal guides',
      code: `import {Chart, ChartGrid, bar} from '@astryxdesign/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid />}
/>;`,
    },
    {
      label: 'Horizontal and vertical guides',
      code: `<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[bar('revenue')]}
  grid={<ChartGrid horizontal vertical tickCount={6} />}
/>;`,
    },
  ],
};

export const docsZh = {
  "name": "ChartGrid",
  "displayName": "Chart Grid",
  "usage": {
    "description": "ChartGrid 从父级 Chart 拥有的比例尺绘制水平和垂直参考线。请在 Chart 的 `grid` 槽位中使用它，使参考线与图表共享相同的绘图区尺寸和刻度值。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当读者需要在参考线旁看到带标签的数值时，将 ChartGrid 与 ChartAxis 搭配使用。"
      },
      {
        "guidance": true,
        "description": "使用水平参考线进行数值比较，仅在垂直参考线有助于读者对齐分类或连续 x 值时添加它们。"
      },
      {
        "guidance": false,
        "description": "不要将网格线作为传达数值或区分的唯一方式。应将有意义的图表信息保留在标签、标记和父级 Chart 的替代内容中。"
      },
      {
        "guidance": false,
        "description": "不要期望 `tickCount` 会减少分类带状中心的数量。它仅对连续比例尺请求密度；分类垂直参考线每个带只渲染一次。"
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
        "description": "Chart 负责无障碍图像名称和支持的小数据表。网格线只是对该图表级替代内容的补充，不能替代它。"
      },
      {
        "name": "仅视觉参考线",
        "category": "Color contrast",
        "criterion": "1.4.11 Non-text Contrast",
        "requirement": "Do not carry information alone",
        "states": [
          "水平",
          "垂直",
          "组合"
        ],
        "description": "网格线是辅助参考线。请保留可见标签、标记或其它合格线索，使理解不单独依赖网格。"
      }
    ],
    "anatomy": [
      {
        "name": "网格线",
        "required": false,
        "description": "位于连续 y 刻度处的水平线，以及位于 x 刻度或分类带状中心处的垂直线。"
      }
    ]
  },
  "propDescriptions": {
    "horizontal": "是否在除零以外的连续 y 刻度处绘制水平参考线。",
    "vertical": "是否在连续 x 刻度或分类带状中心处绘制垂直参考线。",
    "tickCount": "向连续比例尺请求的大致参考线数量。它不会减少分类带状中心的数量。"
  }
};
