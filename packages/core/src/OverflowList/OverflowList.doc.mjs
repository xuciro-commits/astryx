// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'List',
    required: true,
    description: 'Visible horizontal list container for the currently shown content.',
  },
  {
    name: 'Items',
    required: true,
    description:
      'Caller-supplied items selected for visible display by the current width and count limits.',
  },
  {
    name: 'Overflow indicator',
    required: false,
    description:
      'Optional caller-rendered indicator for items collapsed by width or count limits.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'OverflowList',
  displayName: 'Overflow List',
  category: 'Table & List',
  keywords: [
    'overflow',
    'truncate',
    'collapse',
    'breadcrumb',
    'toolbar',
    'tag-list',
    'pill-list',
    'more',
    'clamp',
    'responsive',
  ],
  playground: {
    // children is required; without seeded items the properties-tab preview
    // renders an empty list. Provide a few items so the preview is meaningful.
    // `observeParent` measures the (full-width) preview container instead of
    // the list's own collapsed content box, so the row shows all items rather
    // than collapsing to one.
    defaults: {
      behavior: 'observeParent',
      children: [
        {__element: 'Button', props: {label: 'Overview', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Activity', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Settings', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Members', variant: 'secondary'}},
        {__element: 'Button', props: {label: 'Billing', variant: 'secondary'}},
      ],
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Items to render. Each child should be a single element.',
      required: true,
    },
    {
      name: 'overflowRenderer',
      type: '(overflowItems: OverflowItem[]) => ReactNode',
      description:
        'Render function for the overflow indicator. Receives the list of hidden items (each with child and index). Only called when items are overflowing.',
    },
    {
      name: 'onOverflowChange',
      type: '(overflowItems: OverflowItem[]) => void',
      description:
        'Called whenever the collapsed set changes: with the collapsed items once something collapses, and with an empty array once the row widens back out. Membership and order changes report even when the count stays the same; unrelated re-renders and callback identity changes do not. Silent while nothing overflows, including on mount. Use stable React keys for dynamic items.',
    },
    {
      name: 'gap',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Gap between items as a spacing token step (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10).',
      default: '2',
    },
    {
      name: 'minVisibleItems',
      type: 'number',
      description:
        'Minimum number of items to always show, even when overflowing.',
      default: '0',
    },
    {
      name: 'maxVisibleItems',
      type: 'number',
      description:
        'Maximum number of items to ever show, even when they all fit. The ceiling partner to minVisibleItems; extra items collapse into the overflow indicator. If less than minVisibleItems, the floor wins.',
      default: 'undefined (no cap)',
    },
    {
      name: 'maxRows',
      type: 'number',
      description:
        'Wrap items across up to this many rows before collapsing the rest into the overflow indicator. A number, not a boolean. Leave undefined (or set 1) for single-line behavior. Assumes uniform row height.',
      default: 'undefined (single line)',
    },
    {
      name: 'collapseFrom',
      type: "'start' | 'end'",
      description: 'Which end to collapse items from when overflow occurs.',
      default: "'end'",
    },
    {
      name: 'behavior',
      type: "'observeSelf' | 'observeParent'",
      description:
        "Controls which element is measured for available width. 'observeSelf' uses the container's own width. 'observeParent' observes the parent element, useful when the list should stay content-sized while still detecting available space.",
      default: "'observeSelf'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-overflow-list'}],
  },
  usage: {
    anatomy,
    description:
      'A horizontal list that automatically hides items when they exceed the available width. Use OverflowList for breadcrumbs, toolbars, tag lists, or any row that needs to collapse gracefully at smaller sizes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a meaningful overflowRenderer: a "+N more" badge, a dropdown, or a count indicator.',
      },
      {
        guidance: true,
        description:
          'When the row already has its own menu, use onOverflowChange to feed the collapsed items into it instead of adding a second anchor with overflowRenderer.',
      },
      {
        guidance: true,
        description:
          'Set minVisibleItems to keep key items visible, and maxVisibleItems to cap the row at a fixed count regardless of available width.',
      },
      {
        guidance: true,
        description:
          'Use maxRows to let items wrap onto a bounded number of rows (e.g. a two-row tag cloud) before collapsing the rest into the indicator.',
      },
      {
        guidance: false,
        description:
          'Use OverflowList for a vertical stack; horizontal multi-row wrap is supported via maxRows, but items still flow left-to-right, not top-to-bottom.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "OverflowList",
  "displayName": "Overflow List",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "要渲染的项目。每个子元素应为单个元素。",
      "required": true
    },
    {
      "name": "overflowRenderer",
      "type": "(overflowItems: OverflowItem[]) => ReactNode",
      "description": "溢出指示器的渲染函数。接收隐藏项目列表（每项包含 `child` 和 `index`）。仅在项目溢出时调用。"
    },
    {
      "name": "onOverflowChange",
      "type": "(overflowItems: OverflowItem[]) => void",
      "description": "折叠集合发生变化时调用：有项目折叠时传入折叠的项目，行重新变宽后传入空数组。即使数量不变，成员或顺序变化也会报告；无关的重渲染和回调标识变化不会触发。没有溢出时保持静默，包括挂载时。为动态项目使用稳定的 React key。"
    },
    {
      "name": "gap",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "项目之间的间距，以间距令牌步长表示（0、0.5、1、1.5、2、3、4、5、6、8、10）。",
      "default": "2"
    },
    {
      "name": "minVisibleItems",
      "type": "number",
      "description": "始终显示的最小项目数，即使发生溢出也是如此。",
      "default": "0"
    },
    {
      "name": "maxVisibleItems",
      "type": "number",
      "description": "最多显示的项目数，即使它们全部放得下也是如此。它是 `minVisibleItems` 的上限搭档；多出的项目会折叠到溢出指示器中。如果小于 `minVisibleItems`，以下限为准。",
      "default": "undefined（无上限）"
    },
    {
      "name": "maxRows",
      "type": "number",
      "description": "在将剩余项目折叠到溢出指示器之前，项目最多可换行到这么多行。是数字，不是布尔值。留空（或设为 1）表示单行行为。假定行高一致。",
      "default": "undefined（单行）"
    },
    {
      "name": "collapseFrom",
      "type": "'start' | 'end'",
      "description": "发生溢出时，从哪一端折叠项目。",
      "default": "'end'"
    },
    {
      "name": "behavior",
      "type": "'observeSelf' | 'observeParent'",
      "description": "控制测量哪个元素的可用宽度。`'observeSelf'` 使用容器自身的宽度。`'observeParent'` 观察父元素，适用于列表应保持内容尺寸但仍需检测可用空间的场景。",
      "default": "'observeSelf'"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局定制（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是内联样式对象。"
    }
  ],
  "usage": {
    "anatomy": [
      {
        "name": "列表",
        "required": true,
        "description": "用于显示当前内容的可见水平列表容器。"
      },
      {
        "name": "项目",
        "required": true,
        "description": "调用方提供的项目，根据当前宽度和数量限制选择可见显示。"
      },
      {
        "name": "溢出指示器",
        "required": false,
        "description": "可选，由调用方渲染，用于表示因宽度或数量限制而折叠的项目。"
      }
    ],
    "description": "`OverflowList` 是一个水平列表，当项目超出可用宽度时会自动隐藏。适用于面包屑、工具栏、标签列表，或任何需要在较小尺寸下优雅折叠的行。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供有意义的 `overflowRenderer`：“+N 更多”徽标、下拉菜单或计数指示器。"
      },
      {
        "guidance": true,
        "description": "当该行已有自己的菜单时，使用 `onOverflowChange` 将折叠的项目提供给该菜单，而不是通过 `overflowRenderer` 再添加一个锚点。"
      },
      {
        "guidance": true,
        "description": "设置 `minVisibleItems` 以保持关键项目可见，设置 `maxVisibleItems` 以将行限制为固定数量，不受可用宽度影响。"
      },
      {
        "guidance": true,
        "description": "使用 `maxRows` 让项目换行到有限行数（例如两行标签云），再将剩余项目折叠到指示器中。"
      },
      {
        "guidance": false,
        "description": "将 `OverflowList` 用于垂直堆叠；通过 `maxRows` 支持水平多行换行，但项目仍从左到右排列，而不是从上到下。"
      }
    ]
  },
  "propDescriptions": {
    "children": "要渲染的项目。每个子元素应为单个元素。",
    "overflowRenderer": "溢出指示器的渲染函数。接收隐藏项目列表（每项包含 `child` 和 `index`）。仅在项目溢出时调用。",
    "onOverflowChange": "折叠集合发生变化时调用：有项目折叠时传入折叠的项目，行重新变宽后传入空数组。即使数量不变，成员或顺序变化也会报告；无关的重渲染和回调标识变化不会触发。没有溢出时保持静默，包括挂载时。为动态项目使用稳定的 React key。",
    "gap": "项目之间的间距，以间距令牌步长表示（0、0.5、1、1.5、2、3、4、5、6、8、10）。",
    "minVisibleItems": "始终显示的最小项目数，即使发生溢出也是如此。",
    "maxVisibleItems": "最多显示的项目数，即使它们全部放得下也是如此。它是 `minVisibleItems` 的上限搭档；多出的项目会折叠到溢出指示器中。如果小于 `minVisibleItems`，以下限为准。",
    "maxRows": "在将剩余项目折叠到溢出指示器之前，项目最多可换行到这么多行。是数字，不是布尔值。留空（或设为 1）表示单行行为。假定行高一致。",
    "collapseFrom": "发生溢出时，从哪一端折叠项目。",
    "behavior": "控制测量哪个元素的可用宽度。`'observeSelf'` 使用容器自身的宽度。`'observeParent'` 观察父元素，适用于列表应保持内容尺寸但仍需检测可用空间的场景。",
    "xstyle": "用于布局定制（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'horizontal list w/ overflow indicator: hides items beyond container width',
  usage: {
    anatomy,
    description:
      'A horizontal list that automatically hides items when they exceed the available width. Use OverflowList for breadcrumbs, toolbars, tag lists, or any row that needs to collapse gracefully at smaller sizes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a meaningful overflowRenderer: a "+N more" badge, a dropdown, or a count indicator.',
      },
      {
        guidance: true,
        description:
          'When the row already has its own menu, use onOverflowChange to feed the collapsed items into it instead of adding a second anchor with overflowRenderer.',
      },
      {
        guidance: true,
        description:
          'Set minVisibleItems to keep key items visible, and maxVisibleItems to cap the row at a fixed count regardless of available width.',
      },
      {
        guidance: true,
        description:
          'Use maxRows to let items wrap onto a bounded number of rows (e.g. a two-row tag cloud) before collapsing the rest into the indicator.',
      },
      {
        guidance: false,
        description:
          'Use OverflowList for a vertical stack; horizontal multi-row wrap is supported via maxRows, but items still flow left-to-right, not top-to-bottom.',
      },
    ],
  },
  propDescriptions: {
    children: 'items to render, each child should be a single element',
    overflowRenderer:
      'renders overflow indicator, receives hidden items w/ index',
    onOverflowChange:
      'fires w/ collapsed items when membership/order changes (empty once the row fits again); ignores unrelated renders/callback identity; stable React keys required for dynamic items',
    gap: 'item gap as spacing step',
    minVisibleItems: 'min items always shown even when overflowing',
    maxVisibleItems:
      'max items ever shown (cap); extra items collapse to indicator; min wins if smaller',
    maxRows:
      'wrap items across up to N rows then collapse rest (number, not boolean); undefined = single line',
    collapseFrom: 'which end to collapse from',
    behavior:
      'observeSelf (default) or observeParent for content-sized containers',
    xstyle: 'StyleX styles, use stylex.create() values only',
  },
};
