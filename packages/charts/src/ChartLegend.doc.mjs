// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChartLegend',
  displayName: 'Chart Legend',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: ['chart', 'legend', 'series', 'key', 'label', 'data visualization'],

  usage: {
    description:
      'ChartLegend pairs series labels with decorative mark-shaped color swatches. Use Chart legend options for the generated legend, or render ChartLegend directly when the caller already owns the legend items.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give every item a concise label that identifies the corresponding series without relying on its color name.',
      },
      {
        guidance: true,
        description:
          'Use start or end for a vertical legend and top or bottom for a wrapping horizontal legend.',
      },
      {
        guidance: false,
        description:
          'Use the legend as the chart’s only text alternative. Give the parent Chart an accessible name and preserve an equivalent data view or summary when the data requires one.',
      },
      {
        guidance: false,
        description:
          'Assume arbitrary series colors will remain distinguishable in every theme. Verify the complete chart and legend together against the surfaces where they render.',
      },
    ],
    accessibility: [
      {
        name: 'Named list',
        category: 'Semantics',
        criterion: '1.3.1 Info and Relationships',
        requirement: 'Built in',
        states: ['Non-empty'],
        description:
          'Entries render as items in a localized Chart legend list. Each visible label supplies the series name while its swatch stays hidden from assistive technology.',
      },
      {
        name: 'Chart alternative',
        category: 'Content',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required on the parent Chart',
        states: ['All'],
        description:
          'The legend supplements the parent Chart. It does not replace the Chart accessible name, data table, summary, or other equivalent alternative.',
      },
      {
        name: 'Series distinction',
        category: 'Color contrast',
        criterion: '1.4.1 Use of Color; 1.4.11 Non-text Contrast',
        requirement: 'Consumer verification required',
        states: ['Non-empty'],
        description:
          'Caller-supplied series colors must remain distinguishable on the rendered surface. Do not depend on color alone when otherwise identical marks need to be matched across the chart and legend.',
      },
    ],
    anatomy: [
      {
        name: 'Legend list',
        required: true,
        description:
          'Wrapping horizontal or stacked vertical list that groups the legend entries.',
      },
      {
        name: 'Legend entry',
        required: true,
        description: 'One series label paired with its decorative swatch.',
      },
      {
        name: 'Series swatch',
        required: true,
        description:
          'Decorative square for bar marks or short line for other mark types, painted with the item color.',
      },
      {
        name: 'Series label',
        required: true,
        description: 'Supporting text that names the series.',
      },
    ],
  },

  props: [
    {
      name: 'items',
      type: 'LegendItem[]',
      description:
        'Series entries to render. Each entry supplies a label, color, and optional mark type. An omitted or empty array renders nothing.',
      default: '[]',
    },
    {
      name: 'position',
      type: "'top' | 'bottom' | 'start' | 'end'",
      description:
        'Logical placement used by Chart and the legend orientation: top and bottom are horizontal; start and end are vertical.',
      default: "'bottom'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description:
        'For top and bottom, distributes the row along its inline axis. For start and end, aligns each entry horizontally within the vertical list.',
      default: "'start'",
    },
  ],

  examples: [
    {
      label: 'Generated chart legend',
      code: `import {Chart, bar, line} from '@astryxdesign/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[
    bar('revenue', {label: 'Revenue'}),
    line('forecast', {label: 'Forecast'}),
  ]}
  legend={{position: 'top', alignment: 'start'}}
/>;`,
    },
    {
      label: 'Standalone legend',
      code: `import {ChartLegend} from '@astryxdesign/charts';

<ChartLegend
  items={[
    {label: 'Revenue', color: '#3b82f6', type: 'bar'},
    {label: 'Forecast', color: '#f59e0b', type: 'line'},
  ]}
  position="start"
  alignment="center"
/>;`,
    },
  ],
};

export const docsZh = {
  "name": "ChartLegend",
  "displayName": "Chart Legend",
  "usage": {
    "description": "ChartLegend 将序列标签与装饰性的标记形状色块配对。使用 Chart 的 `legend` 选项生成图例，或在调用方已拥有图例项时直接渲染 ChartLegend。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个项提供简洁的标签，用于标识对应的序列，而不依赖其颜色名称。"
      },
      {
        "guidance": true,
        "description": "垂直图例使用 `start` 或 `end`，可换行的水平图例使用 `top` 或 `bottom`。"
      },
      {
        "guidance": false,
        "description": "不要将图例作为图表唯一的文本替代内容。应为父级 Chart 提供无障碍名称，并在数据需要时保留等效的数据视图或摘要。"
      },
      {
        "guidance": false,
        "description": "不要假设任意序列颜色在每个主题中都能保持可区分。应结合实际渲染表面，将完整图表与图例放在一起验证。"
      }
    ],
    "accessibility": [
      {
        "name": "命名列表",
        "category": "Semantics",
        "criterion": "1.3.1 Info and Relationships",
        "requirement": "Built in",
        "states": [
          "非空"
        ],
        "description": "各项会作为本地化 Chart 图例列表中的项渲染。每个可见标签提供序列名称，而色块对辅助技术保持隐藏。"
      },
      {
        "name": "图表替代内容",
        "category": "Content",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Required on the parent Chart",
        "states": [
          "全部"
        ],
        "description": "图例是父级 Chart 的补充。它不能替代 Chart 的无障碍名称、数据表、摘要或其它等效替代内容。"
      },
      {
        "name": "序列区分",
        "category": "Color contrast",
        "criterion": "1.4.1 Use of Color; 1.4.11 Non-text Contrast",
        "requirement": "Consumer verification required",
        "states": [
          "非空"
        ],
        "description": "调用方提供的序列颜色必须在实际渲染表面上保持可区分。当需要跨图表和图例匹配其它方面相同的标记时，不要仅依赖颜色。"
      }
    ],
    "anatomy": [
      {
        "name": "图例列表",
        "required": true,
        "description": "对图例项进行分组的可换行水平列表或堆叠垂直列表。"
      },
      {
        "name": "图例项",
        "required": true,
        "description": "一个序列标签及其配对的装饰性色块。"
      },
      {
        "name": "序列色块",
        "required": true,
        "description": "条形标记使用装饰性方块，其它标记类型使用短线，均以该项颜色绘制。"
      },
      {
        "name": "序列标签",
        "required": true,
        "description": "为序列命名的辅助文本。"
      }
    ]
  },
  "propDescriptions": {
    "items": "要渲染的序列项。每个项提供标签、颜色和可选的标记类型。省略或空数组时不渲染任何内容。",
    "position": "Chart 使用的逻辑放置位置，同时决定图例方向：`top` 和 `bottom` 为水平；`start` 和 `end` 为垂直。",
    "alignment": "对于 `top` 和 `bottom`，沿行内轴分布该行。对于 `start` 和 `end`，在垂直列表中水平对齐每个项。"
  }
};
