// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'WeightedSVGIcon',
  displayName: 'Weighted SVG Icon',
  group: 'SVGIcon',
  category: 'Content',
  keywords: ['icon', 'svg', 'weight', 'font-weight', 'sprite', 'variable'],

  usage: {
    description:
      'An SVG icon that holds one drawing per weight (300-700) and shows the one matching the surrounding font-weight, so an icon in bold text draws its bold version with no prop. Weight switching happens in CSS; the drawings themselves are static. Render WeightedIconSprite once and pass `sprite` to draw each icon as a lightweight reference.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Let the icon follow the text around it; use `weight` only when the icon must differ from that text.',
      },
      {
        guidance: true,
        description:
          'Use sprite mode when the same icon repeats many times on a page, such as in list rows.',
      },
      {
        guidance: true,
        description:
          'Build each icon with the exported buildWeightedIcon from one drawing per weight, and keep only the weights the type scale can reach (its `weights` option).',
      },
      {
        guidance: false,
        description:
          'Expect smooth in-between weights: a weight between two drawings, such as 450, shows one of its two neighbours (400 or 500), depending on how the browser rounds the measurement.',
      },
    ],
  },

  props: [
    {
      name: 'icon',
      type: 'WeightedIconDef',
      description: 'The icon: one drawing per weight range.',
      required: true,
    },
    {
      name: 'size',
      type: "'xsm' | 'sm' | 'md' | 'lg'",
      description: 'Icon size.',
      default: "'md'",
    },
    {
      name: 'color',
      type: 'SVGIconColor',
      description: 'Semantic color.',
      default: "'primary'",
    },
    {
      name: 'weight',
      type: '300 | 400 | 500 | 600 | 700',
      description:
        'Pin the drawing to one weight instead of following the surrounding font-weight.',
    },
    {
      name: 'sprite',
      type: 'boolean',
      description:
        'Reference the symbol from a WeightedIconSprite on the page instead of drawing inline.',
      default: 'false',
    },
  ],
};

export const docsZh = {
  "name": "WeightedSVGIcon",
  "displayName": "Weighted SVG Icon",
  "usage": {
    "description": "一种 SVG 图标，为每个字重（300-700）保存一幅图形，并显示与周围字体字重匹配的那一幅，因此粗体文本中的图标无需属性即可绘制其粗体版本。字重切换在 CSS 中完成；图形本身是静态的。渲染一次 WeightedIconSprite，并传入 `sprite` 以将每个图标绘制为轻量引用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "让图标跟随其周围的文本；仅当图标必须与该文本不同时才使用 `weight`。"
      },
      {
        "guidance": true,
        "description": "当同一图标在页面上重复多次时使用 sprite 模式，例如在列表行中。"
      },
      {
        "guidance": true,
        "description": "使用导出的 buildWeightedIcon 为每个字重构建一幅图形，并且只保留字号比例能够达到的字重（其 `weights` 选项）。"
      },
      {
        "guidance": false,
        "description": "不要期望平滑的中间字重：两幅图形之间的字重（例如 450）会显示其两个相邻字重之一（400 或 500），具体取决于浏览器如何舍入测量值。"
      }
    ]
  },
  "propDescriptions": {
    "icon": "图标：每个字重范围一幅图形。",
    "size": "图标尺寸。",
    "color": "语义颜色。",
    "weight": "将图形固定到某个字重，而不是跟随周围的字体字重。",
    "sprite": "引用页面上 WeightedIconSprite 中的符号，而不是内联绘制。"
  }
};
