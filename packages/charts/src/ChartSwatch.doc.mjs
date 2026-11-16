// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChartSwatch',
  displayName: 'Chart Swatch',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: [
    'chart',
    'swatch',
    'series',
    'legend',
    'tooltip',
    'data visualization',
  ],

  usage: {
    description:
      'ChartSwatch renders the small decorative mark that pairs a chart series color with its visible label. Use a square for bar series and a short line for other series, including line, dot, and area marks.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Place every swatch next to visible text that names the corresponding series. ChartSwatch is decorative and stays hidden from assistive technology.',
      },
      {
        guidance: true,
        description:
          'Use the square variant for bar series and the line variant for other mark types so legends and tooltips echo the plotted marks consistently.',
      },
      {
        guidance: false,
        description:
          'Use ChartSwatch as the accessible name or data alternative for a series. Its surrounding legend, tooltip, or chart must provide that information.',
      },
      {
        guidance: false,
        description:
          'Rely on arbitrary colors alone when multiple same-shaped series must be matched across a chart. Verify the complete chart and its labels together.',
      },
    ],
    accessibility: [
      {
        name: 'Decorative mark',
        category: 'Semantics',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Built in',
        states: ['All'],
        description:
          'The swatch is hidden from assistive technology. Pair it with visible series text that supplies the accessible meaning.',
      },
      {
        name: 'Series distinction',
        category: 'Color contrast',
        criterion: '1.4.1 Use of Color; 1.4.11 Non-text Contrast',
        requirement: 'Consumer verification required',
        states: ['All'],
        description:
          'Choose colors and, when necessary, additional labels or mark distinctions that remain understandable on the rendered chart surface.',
      },
    ],
    anatomy: [
      {
        name: 'Series swatch',
        required: true,
        description:
          'Decorative square or short line painted with a caller-owned series color.',
      },
    ],
  },

  playground: {
    defaults: {
      color: '#3b82f6',
      variant: 'square',
    },
  },

  props: [
    {
      name: 'color',
      type: 'string',
      description:
        'CSS color used to paint the swatch. The caller owns palette selection and contrast on the rendered surface.',
      required: true,
    },
    {
      name: 'variant',
      type: "'square' | 'line'",
      description:
        'Mark shape: use square for bar series and line for other series types.',
      default: "'square'",
    },
  ],

  examples: [
    {
      label: 'Bar series swatch',
      code: `import {ChartSwatch} from '@astryxdesign/charts';

<ChartSwatch color="#3b82f6" variant="square" />;`,
    },
    {
      label: 'Series-driven swatch',
      code: `import {
  ChartSwatch,
  swatchVariantForType,
} from '@astryxdesign/charts';

<ChartSwatch
  color={series.color}
  variant={swatchVariantForType(series.type)}
/>;`,
    },
  ],
};

export const docsZh = {
  "name": "ChartSwatch",
  "displayName": "Chart Swatch",
  "usage": {
    "description": "ChartSwatch 渲染将图表序列颜色与其可见标签配对的小型装饰性标记。条形序列使用方块，其它序列（包括折线、点和面积标记）使用短线。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将每个色块放在能够标明对应序列的可见文本旁边。ChartSwatch 是装饰性的，对辅助技术保持隐藏。"
      },
      {
        "guidance": true,
        "description": "条形序列使用 `square` 变体，其它标记类型使用 `line` 变体，使图例和工具提示与绘制的标记保持一致。"
      },
      {
        "guidance": false,
        "description": "不要将 ChartSwatch 作为序列的无障碍名称或数据替代内容。其周围的图例、工具提示或图表必须提供该信息。"
      },
      {
        "guidance": false,
        "description": "当需要在图表中匹配多个形状相同的序列时，不要仅依赖任意颜色。应结合完整图表及其标签一起验证。"
      }
    ],
    "accessibility": [
      {
        "name": "装饰性标记",
        "category": "Semantics",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Built in",
        "states": [
          "全部"
        ],
        "description": "色块对辅助技术隐藏。请将其与提供无障碍含义的可见序列文本搭配使用。"
      },
      {
        "name": "序列区分",
        "category": "Color contrast",
        "criterion": "1.4.1 Use of Color; 1.4.11 Non-text Contrast",
        "requirement": "Consumer verification required",
        "states": [
          "全部"
        ],
        "description": "选择在实际渲染的图表表面上仍可理解的颜色，并在必要时增加标签或标记区分。"
      }
    ],
    "anatomy": [
      {
        "name": "序列色块",
        "required": true,
        "description": "用调用方拥有的序列颜色绘制的装饰性方块或短线。"
      }
    ]
  },
  "propDescriptions": {
    "color": "用于绘制色块的 CSS 颜色。调用方负责在实际渲染表面上选择调色板并保证对比度。",
    "variant": "标记形状：条形序列使用 `square`，其它序列类型使用 `line`。"
  }
};
