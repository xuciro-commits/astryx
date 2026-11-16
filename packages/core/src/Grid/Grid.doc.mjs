// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Grid container',
    required: true,
    description:
      'Two-dimensional layout container that arranges caller-supplied items in rows and columns.',
  },
  {
    name: 'Spanning item',
    required: false,
    description:
      "Optional GridSpan wrapper that changes one item's column or row participation.",
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Grid',
  displayName: 'Grid',
  group: 'Layout',
  category: 'Layout',
  keywords: ["grid","columns","responsive","auto-fill","auto-fit","masonry","tiles","row","col","simplegrid","responsive grid","card grid"],
  usage: {
    anatomy,
    description:
      'A CSS grid layout container for arranging children in rows and columns. Use Grid for card galleries, dashboards, and any multi-column layout. For columns that reflow on small screens, use `columns={{minWidth, max}}`; a numeric `columns` is exactly N columns at every width and never reflows.',
    bestPractices: [
      { guidance: true, description: 'Default to responsive columns for anything that must survive a phone: `columns={{minWidth: 240, max: 4}}` renders at most 4 columns, each at least 240px, and drops to one full-width column when narrow.' },
      { guidance: false, description: 'Use `columns={4}` for a row that must work on small screens; a number never reflows and renders four narrow tracks on a phone. Reserve numbers for rows that must stay fixed, such as a 7-day week.' },
      { guidance: true, description: 'Always pair `minWidth` with `max`: `max` caps the count on wide screens and lets the last column shrink to a narrow container; `{minWidth}` alone overflows a phone narrower than `minWidth`.' },
      { guidance: true, description: 'Use `repeat: \'fill\'` (the default) for consistent item widths. Use `\'fit\'` when items should stretch to fill leftover space.' },
      { guidance: false, description: 'Write manual CSS grid; Grid handles spacing and responsive behavior for you.' },
      { guidance: false, description: 'Use `HStack` with wrapping for grids; use Grid instead.' },
      { guidance: true, description: 'Track templates use CSS-variable indirection (not raw inline styles), so `xstyle` overrides of `gridTemplateColumns` (including inside `@media` queries) take effect.' },
    ],
  },
  theming: {
    targets: [
      {className: 'astryx-grid', visualProps: ['align', 'columns', 'gap', 'justify']},
      {className: 'astryx-grid-span'},
    ],
  },
  playground: {
    defaults: {
      columns: 3,
      gap: 2,
      children: [
        {__element: 'Card', props: {padding: 4}, children: 'Item 1'},
        {__element: 'Card', props: {padding: 4}, children: 'Item 2'},
        {__element: 'Card', props: {padding: 4}, children: 'Item 3'},
      ],
    },
  },
  description: 'Grid container with fixed or responsive columns; `{minWidth, max}` reflows, a number never does.',
  props: [
    {
      name: 'columns',
      type: "number | {minWidth: number, max?: number, repeat?: 'fill' | 'fit'}",
      description: 'Column configuration. A number creates exactly N `1fr` tracks at every width and never reflows (e.g. `columns={3}`); a child\'s minimum content may widen its track. For columns that reflow on small screens, use `{minWidth, max}`. Use an object for responsive columns: `minWidth` sets the minimum column width in px, `repeat` controls track behavior (`"fill"` preserves empty tracks for consistent widths, `"fit"` collapses empty tracks so items stretch; defaults to `"fill"`), and `max` caps the maximum number of columns.',
    },
    {
      name: 'width',
      type: 'SizeValue',
      description: 'Container width. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description: 'Container height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'maxWidth',
      type: 'SizeValue',
      description: 'Maximum container width. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description: 'Minimum container height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Spacing between all items.',
    },
    {
      name: 'rowGap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Row spacing; overrides `gap` for the row axis.',
    },
    {
      name: 'columnGap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description: 'Column spacing; overrides `gap` for the column axis.',
    },
    {
      name: 'rowHeight',
      type: 'number',
      description:
        'Height of each implicit row track in pixels. Pair with `GridSpan rows={N}` for masonry-style layouts.',
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description:
        'Vertical alignment of items (`align-items`). Unset leaves the browser default, `normal`, which stretches items that have no natural size or aspect ratio.',
    },
    {
      name: 'justify',
      type: "'start' | 'center' | 'end' | 'stretch'",
      description:
        'Horizontal alignment of items (`justify-items`). Unset leaves the browser default, `normal`, which stretches items that have no natural size or aspect ratio.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Grid content.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'GridSpan'},
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "anatomy": [
      {
        "name": "网格容器",
        "required": true,
        "description": "二维布局容器，按行和列排列调用方提供的项目。"
      },
      {
        "name": "跨步项目",
        "required": false,
        "description": "可选的 GridSpan 包装器，用于改变单个项目的列或行参与方式。"
      }
    ],
    "description": "用于按行和列排列子元素的 CSS 网格布局容器。可用于卡片画廊、仪表盘以及任何多列布局。需要在窄屏上重排的列请使用 `columns={{minWidth, max}}`；数字 `columns` 在任何宽度下都恰好是 N 列，且永不重排。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "凡是必须在手机上正常显示的布局，默认使用响应式列：`columns={{minWidth: 240, max: 4}}` 最多渲染 4 列，每列至少 240px，窄屏时降为单列全宽。"
      },
      {
        "guidance": false,
        "description": "不要在小屏上必须可用的行中使用 `columns={4}`；数字不会重排，在手机上会渲染出四条窄轨道。数字应保留给必须固定的行，例如 7 天的一周。"
      },
      {
        "guidance": true,
        "description": "始终将 `minWidth` 与 `max` 搭配使用：`max` 限制宽屏上的列数，并让最后一列可以收窄到较窄的容器；单独使用 `{minWidth}` 会在比 `minWidth` 更窄的手机上溢出。"
      },
      {
        "guidance": true,
        "description": "需要一致的项宽度时使用 `repeat: 'fill'`（默认）。需要项目拉伸填满剩余空间时使用 `'fit'`。"
      },
      {
        "guidance": false,
        "description": "不要手写 CSS 网格；Grid 会为你处理间距和响应式行为。"
      },
      {
        "guidance": false,
        "description": "不要用带换行的 `HStack` 实现网格；请改用 Grid。"
      },
      {
        "guidance": true,
        "description": "轨道模板使用 CSS 变量间接引用（而非原始内联样式），因此对 `gridTemplateColumns` 的 `xstyle` 覆盖（包括在 `@media` 查询内）能够生效。"
      }
    ]
  },
  "name": "Grid",
  "description": "支持固定列或响应式列的网格容器；`{minWidth, max}` 会重排，数字永不重排。",
  "propDescriptions": {
    "columns": "列配置。数字会在任何宽度下创建恰好 N 条 `1fr` 轨道且永不重排（例如 `columns={3}`）；子元素的最小内容可能会加宽其轨道。需要在窄屏上重排的列请使用 `{minWidth, max}`。响应式列请使用对象：`minWidth` 设置最小列宽（px），`repeat` 控制轨道行为（`\"fill\"` 保留空轨道以获得一致宽度，`\"fit\"` 折叠空轨道使项目拉伸；默认为 `\"fill\"`），`max` 限制最大列数。",
    "width": "容器宽度。数字按像素处理，字符串按原样使用。",
    "height": "容器高度。数字按像素处理，字符串按原样使用。",
    "maxWidth": "容器最大宽度。数字按像素处理，字符串按原样使用。",
    "minHeight": "容器最小高度。数字按像素处理，字符串按原样使用。",
    "gap": "所有项目之间的间距。",
    "rowGap": "行间距；在行轴上覆盖 `gap`。",
    "columnGap": "列间距；在列轴上覆盖 `gap`。",
    "rowHeight": "每个隐式行轨道的高度，单位为像素。与 `GridSpan rows={N}` 搭配可实现瀑布流式布局。",
    "align": "项目的垂直对齐（`align-items`）。未设置时保留浏览器默认值 `normal`，它会拉伸没有自然尺寸或宽高比的项目。",
    "justify": "项目的水平对齐（`justify-items`）。未设置时保留浏览器默认值 `normal`，它会拉伸没有自然尺寸或宽高比的项目。",
    "children": "网格内容。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "GridSpan",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'CSS Grid-based layout w/ responsive column support.',
  usage: {
    anatomy,
    description: 'A CSS grid layout container for arranging children in rows and columns. Use Grid for card galleries, dashboards, and any multi-column layout. For columns that reflow on small screens, use `columns={{minWidth, max}}`; a numeric `columns` is exactly N columns at every width and never reflows.',
    bestPractices: [
      { guidance: true, description: 'Default to responsive columns for anything that must survive a phone: columns={{minWidth: 240, max: 4}} = at most 4 columns, each >= 240px, one full-width column when narrow.' },
      { guidance: false, description: 'Use columns={4} for rows that must work on small screens; a number never reflows (4 narrow tracks on a phone). Numbers only for rows that must stay fixed, e.g. a 7-day week.' },
      { guidance: true, description: 'Always pair minWidth with max: max caps the count on wide screens and lets the last column shrink to a narrow container; {minWidth} alone overflows a phone narrower than minWidth.' },
      { guidance: true, description: 'Use repeat: \'fill\' (the default) for consistent item widths. Use \'fit\' when items should stretch to fill leftover space.' },
      { guidance: false, description: 'Write manual CSS grid; Grid handles spacing and responsive behavior for you.' },
      { guidance: false, description: 'Use HStack with wrapping for grids; use Grid instead.' },
      { guidance: true, description: 'track templates use CSS-var indirection, not inline styles, so xstyle/@media overrides of gridTemplateColumns work.' },
    ],
  },
};
