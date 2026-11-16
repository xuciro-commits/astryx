// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChartTooltip',
  displayName: 'Chart Tooltip',
  group: 'Charts',
  category: 'Data Visualization',
  isHiddenFromOverview: true,
  keywords: [
    'chart',
    'tooltip',
    'hover',
    'series',
    'crosshair',
    'data visualization',
  ],

  usage: {
    description:
      'ChartTooltip shows grouped values for the chart position nearest the pointer. Use Chart’s tooltip prop or its configuration object for the standard integration; direct composition remains available when you need explicit child composition.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Treat tooltip content as supplemental pointer detail. Give the parent Chart an accessible name and preserve its equivalent data table or another complete data view.',
      },
      {
        guidance: true,
        description:
          'When composing ChartTooltip directly, pass the same series definitions used by Chart so rows, swatches, and hover dots stay aligned with the plotted marks.',
      },
      {
        guidance: false,
        description:
          'Put information required to understand the chart only in the tooltip. The current interaction is pointer-driven and does not establish a focus trigger or aria-describedby relationship.',
      },
      {
        guidance: false,
        description:
          'Render interactive controls inside the custom tooltip body. The surface is presentational and does not accept pointer input.',
      },
    ],
    accessibility: [
      {
        name: 'Supplemental detail',
        category: 'Content',
        criterion: '1.1.1 Non-text Content',
        requirement: 'Required on the parent Chart',
        states: ['All'],
        description:
          'The tooltip supplements the parent Chart. It does not replace the Chart accessible name, hidden data table, summary, or another equivalent data view.',
      },
      {
        name: 'Tooltip semantics',
        category: 'Semantics',
        criterion: '1.3.1 Info and Relationships',
        requirement: 'Built in with a documented limitation',
        states: ['Hovered'],
        description:
          'The visible card uses role tooltip. Chart does not currently expose a focusable data-point trigger or an aria-describedby relationship, so required information must remain available outside this pointer-only surface.',
      },
    ],
    anatomy: [
      {
        name: 'Layer host',
        required: true,
        description:
          'Layer host mounted under the chart’s nearest HTML container so nested Theme and MediaTheme scopes remain inherited. It uses the browser top layer when the Popover API is available and otherwise keeps the card visible through Layer’s reduced fallback.',
      },
      {
        name: 'Tooltip card',
        required: true,
        description:
          'Non-interactive surface containing the current x value and series values.',
      },
      {
        name: 'Series row',
        required: false,
        description:
          'For multi-series charts, a decorative swatch, visible label, and value.',
      },
      {
        name: 'Hover indicator',
        required: false,
        description:
          'Band highlight for bar series on a band scale, or a vertical crosshair otherwise.',
      },
      {
        name: 'Hover dot',
        required: false,
        description:
          'Point marker for each eligible non-bar series at the hovered data index.',
      },
    ],
  },

  props: [
    {
      name: 'series',
      type: 'readonly SeriesDef[]',
      description:
        'Series definitions used to derive tooltip rows and hover dots. Chart supplies this automatically through its tooltip prop; direct composition should pass the same array used by Chart.',
      default: '[]',
    },
    {
      name: 'render',
      type: '(xValue: unknown, seriesValues: TooltipSeriesValue[]) => ReactNode',
      description:
        'Replaces the default card body. Return null to hide the card while preserving enabled hover indicators and dots.',
      default: 'Default grouped value content',
    },
    {
      name: 'hoverIndicator',
      type: 'boolean',
      description:
        'Shows a band highlight for bar series on a band scale, or a vertical crosshair for other series.',
      default: 'true',
    },
    {
      name: 'showHoverDots',
      type: 'boolean',
      description:
        'Shows a point marker for each eligible non-bar series at the hovered index.',
      default: 'true',
    },
    {
      name: 'placement',
      type: "'auto' | 'right' | 'left' | 'top'",
      description:
        'Selects one of the shipped placement algorithms. The current implementation positions from the hovered x coordinate and the plot top; whether placement should instead be point-relative on both axes remains unresolved. Custom renderers own their content sizing.',
      default: "'auto'",
    },
  ],

  examples: [
    {
      label: 'Generated chart tooltip',
      code: `import {Chart, bar, line} from '@astryxdesign/charts';

<Chart
  data={monthlyRevenue}
  xKey="month"
  series={[
    bar('revenue', {label: 'Revenue'}),
    line('forecast', {label: 'Forecast'}),
  ]}
  tooltip
/>;`,
    },
    {
      label: 'Direct composition',
      code: `import {Chart, ChartTooltip, line} from '@astryxdesign/charts';

const series = [line('revenue', {label: 'Revenue'})];

<Chart data={monthlyRevenue} xKey="month" series={series}>
  <ChartTooltip
    series={series}
    placement="top"
    showHoverDots={false}
  />
</Chart>;`,
    },
  ],
};

export const docsZh = {
  "name": "ChartTooltip",
  "displayName": "Chart Tooltip",
  "usage": {
    "description": "ChartTooltip 显示距离指针最近的图表位置的分组数值。标准集成请使用 Chart 的 `tooltip` 属性或其配置对象；需要显式的子级组合时，仍可直接组合。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将工具提示内容视为补充性的指针细节。应为父级 Chart 提供无障碍名称，并保留其等效的数据表或其它完整数据视图。"
      },
      {
        "guidance": true,
        "description": "直接组合 ChartTooltip 时，请传入与 Chart 相同的序列定义，使行、色块和悬停点与绘制的标记保持一致。"
      },
      {
        "guidance": false,
        "description": "不要将理解图表所需的信息仅放在工具提示中。当前交互由指针驱动，不会建立焦点触发器或 `aria-describedby` 关系。"
      },
      {
        "guidance": false,
        "description": "不要在自定义工具提示主体内渲染交互控件。该表面仅用于展示，不接受指针输入。"
      }
    ],
    "accessibility": [
      {
        "name": "补充细节",
        "category": "Content",
        "criterion": "1.1.1 Non-text Content",
        "requirement": "Required on the parent Chart",
        "states": [
          "全部"
        ],
        "description": "工具提示是父级 Chart 的补充。它不能替代 Chart 的无障碍名称、隐藏数据表、摘要或其它等效数据视图。"
      },
      {
        "name": "工具提示语义",
        "category": "Semantics",
        "criterion": "1.3.1 Info and Relationships",
        "requirement": "Built in with a documented limitation",
        "states": [
          "悬停"
        ],
        "description": "可见卡片使用 `tooltip` 角色。Chart 目前不暴露可聚焦的数据点触发器或 `aria-describedby` 关系，因此必需信息必须在此仅支持指针操作的表面之外仍然可用。"
      }
    ],
    "anatomy": [
      {
        "name": "层宿主",
        "required": true,
        "description": "挂载在图表最近的 HTML 容器下的层宿主，以便继承嵌套的 Theme 和 MediaTheme 作用域。在 Popover API 可用时使用浏览器的顶层，否则通过 Layer 的精简回退保持卡片可见。"
      },
      {
        "name": "工具提示卡片",
        "required": true,
        "description": "包含当前 x 值和序列值的非交互表面。"
      },
      {
        "name": "序列行",
        "required": false,
        "description": "对于多序列图表，包含装饰性色块、可见标签和值。"
      },
      {
        "name": "悬停指示器",
        "required": false,
        "description": "带状比例尺上的条形序列显示带状高亮，否则显示垂直十字准线。"
      },
      {
        "name": "悬停点",
        "required": false,
        "description": "在悬停数据索引处，为每个符合条件的非条形序列显示的点标记。"
      }
    ]
  },
  "propDescriptions": {
    "series": "用于推导工具提示行和悬停点的序列定义。Chart 会通过其 `tooltip` 属性自动提供；直接组合时应传入与 Chart 相同的数组。",
    "render": "替换默认的卡片主体。返回 `null` 可隐藏卡片，同时保留已启用的悬停指示器和悬停点。",
    "hoverIndicator": "对于带状比例尺上的条形序列显示带状高亮，或为其它序列显示垂直十字准线。",
    "showHoverDots": "在悬停索引处为每个符合条件的非条形序列显示点标记。",
    "placement": "选择内置的放置算法之一。当前实现基于悬停的 x 坐标和绘图区顶部定位；放置方式是否应改为在两个轴上都相对于数据点，仍未确定。自定义渲染器自行负责内容尺寸。"
  }
};
