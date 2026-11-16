// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'ScrollableArea',
  displayName: 'Scrollable Area',
  category: 'Layout',
  keywords: ['scroll', 'overflow', 'viewport', 'logical axis', 'keyboard', 'overscroll', 'sticky', 'scrollbar', 'padding', 'full bleed', 'scrollarea', 'scrollview'],
  usage: {
    description: 'Provides a native scroll viewport and a real observed content box. The viewport enters the tab order only while a requested logical axis is effectively scrollable, and containment applies only to effective axes.',
    bestPractices: [
      {guidance: true, description: 'Give every area a concise label that identifies the content keyboard users will scroll.'},
      {guidance: true, description: 'Leave `role` unset (it renders `group`) for ordinary scroll containers. Choose `role="region"` only when the area is significant enough to appear in screen-reader landmark navigation; every `region` adds an entry to that list.'},
      {guidance: true, description: 'Choose `inline`, `block`, or `both` from content intent; the component maps the logical axes through writing mode and direction.'},
      {guidance: true, description: 'Keep the default `overscroll="allow"` for nested areas unless the interaction deliberately needs containment.'},
      {guidance: true, description: 'Use `useScrollableArea` instead when a component already owns both a viewport and a suitable content box, or when children must remain direct flex/grid items or retain a definite percentage block-size basis.'},
      {guidance: true, description: 'ScrollableArea owns one normal block content box with a 100% minimum size. Inline and both-axis modes use max-content inline sizing, so intrinsic inline layout is intentionally wider than the viewport.'},
      {guidance: true, description: 'Use logical padding props on the content box so nested full-bleed components receive the same inset geometry.'},
      {guidance: true, description: 'Set `isFullBleed` only when the viewport itself should reach an ancestor container edge; it is off by default.'},
      {guidance: true, description: 'Set `stickyContainment="always"` only when a fitting viewport should intentionally remain a Sticky boundary.'},
      {guidance: false, description: 'Hide the native scrollbar without another visible and operable overflow affordance.'},
      {guidance: false, description: 'Add another overflow wrapper around ScrollableArea; one native viewport should own scrolling.'},
    ],
    anatomy: [
      {name: 'Viewport', required: true, description: 'The root native scroll container, accessible name owner, focus target while effective, and `astryx-scrollable-area` theme target.'},
      {name: 'Content box', required: true, description: 'A real inner layout box observed together with the viewport. For inline scrolling it uses max-content inline sizing with a 100% minimum.'},
    ],
  },
  props: [
    {name: 'axis', type: "'inline' | 'block' | 'both'", description: 'Logical axis or axes where native scrolling is allowed.', default: "'block'"},
    {name: 'label', type: 'string', description: 'Accessible name for the viewport when it becomes keyboard scrollable.', required: true},
    {name: 'role', type: "'group' | 'region'", description: 'Semantics for the named viewport; use `region` only for areas that belong in landmark navigation.', default: "'group'"},
    {name: 'overscroll', type: "'allow' | 'contain'", description: 'Whether effective axes continue scrolling an ancestor at their edge.', default: "'allow'"},
    {name: 'width', type: 'SizeValue', description: 'Width of the viewport; a number is interpreted as pixels, a string is used as-is.'},
    {name: 'height', type: 'SizeValue', description: 'Height of the viewport; a number is interpreted as pixels, a string is used as-is.'},
    {name: 'maxWidth', type: 'SizeValue', description: 'Maximum width of the viewport.'},
    {name: 'minHeight', type: 'SizeValue', description: 'Minimum height of the viewport.'},
    {name: 'stickyContainment', type: "'whenScrollable' | 'always'", description: 'Whether fitting content passes Sticky ownership to an outer container or deliberately keeps this viewport as the CSS Sticky boundary.', default: "'whenScrollable'"},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Content padding on every logical edge; publishes matching inset geometry.', default: '0'},
    {name: 'paddingInline', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-axis content padding; overrides `padding` on that axis.'},
    {name: 'paddingInlineStart', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-start content padding; overrides broader padding values.'},
    {name: 'paddingInlineEnd', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical inline-end content padding; overrides broader padding values.'},
    {name: 'paddingBlock', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-axis content padding; overrides `padding` on that axis.'},
    {name: 'paddingBlockStart', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-start content padding; overrides broader padding values.'},
    {name: 'paddingBlockEnd', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Logical block-end content padding; overrides broader padding values.'},
    {name: 'isFullBleed', type: 'boolean', description: 'Lets the viewport escape inherited container padding without changing content padding.', default: 'false'},
    {name: 'children', type: 'ReactNode', description: 'Content rendered inside the observed content box.'},
    {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX sizing and native scrollbar presentation overrides for the viewport. Must be a `stylex.create()` value, not an inline style object.'},
  ],
  playground: {
    defaults: {
      axis: 'block',
      label: 'Scrollable example',
      children: 'Add enough content to exceed a constrained viewport.',
    },
  },
  theming: {
    targets: [
      {className: 'astryx-scrollable-area', visualProps: ['axis']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'native logical-axis scroll viewport with conditional keyboard access, live edge state, and observed content geometry',
  usage: {
    description: 'Use for a complete viewport/content composition; use useScrollableArea for existing structure.',
    bestPractices: [
      {guidance: true, description: 'Always provide a concise label.'},
      {guidance: true, description: 'Prefer overscroll allow; contain only deliberate nested interactions.'},
      {guidance: true, description: 'Use content padding props to publish inset; use isFullBleed only for viewport escape.'},
      {guidance: false, description: 'Nest another overflow wrapper around it.'},
    ],
    anatomy: [
      {name: 'Viewport', required: true, description: 'native scrolling, conditional tab stop, and theme target'},
      {name: 'Content box', required: true, description: 'real observed layout box'},
    ],
  },
  propDescriptions: {
    axis: "logical scroll intent: 'inline' | 'block' (default) | 'both'",
    label: 'required accessible viewport name',
    role: "named viewport semantics: 'group' (default) | 'region' (landmark-navigation entries only)",
    overscroll: "edge behavior: 'allow' (default) | 'contain' on effective axes only",
    width: 'viewport width',
    height: 'viewport height',
    maxWidth: 'viewport maximum width',
    minHeight: 'viewport minimum height',
    stickyContainment: "fitting Sticky ownership: 'whenScrollable' (default) | 'always'",
    padding: 'content inset on every edge; defaults to 0 and publishes geometry',
    paddingInline: 'logical inline-axis content inset',
    paddingInlineStart: 'logical inline-start content inset',
    paddingInlineEnd: 'logical inline-end content inset',
    paddingBlock: 'logical block-axis content inset',
    paddingBlockStart: 'logical block-start content inset',
    paddingBlockEnd: 'logical block-end content inset',
    isFullBleed: 'opt-in viewport escape from inherited container padding',
    children: 'content inside the observed box',
    xstyle: 'viewport sizing and native scrollbar presentation overrides',
  },
};

export const docsZh = {
  "name": "ScrollableArea",
  "displayName": "Scrollable Area",
  "usage": {
    "description": "提供原生滚动视口和真实的可观察内容盒。只有当所请求的逻辑轴实际可滚动时，视口才会进入 Tab 顺序；包含约束也只应用于实际可滚动的轴。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个区域提供一个简洁的标签，说明键盘用户将要滚动的内容。"
      },
      {
        "guidance": true,
        "description": "对于普通滚动容器，保持 `role` 未设置（会渲染 `group`）。仅当区域重要到应出现在屏幕阅读器地标导航中时，才选择 `role=\"region\"`；每个 `region` 都会向该列表添加一个条目。"
      },
      {
        "guidance": true,
        "description": "根据内容意图选择 `inline`、`block` 或 `both`；组件会通过书写模式和方向映射逻辑轴。"
      },
      {
        "guidance": true,
        "description": "对于嵌套区域，除非交互确实需要包含约束，否则保持默认的 `overscroll=\"allow\"`。"
      },
      {
        "guidance": true,
        "description": "当组件已经同时拥有视口和合适的内容盒，或子元素必须保持为直接 flex/grid 项，或需要保留确定的百分比块尺寸基准时，请改用 `useScrollableArea`。"
      },
      {
        "guidance": true,
        "description": "ScrollableArea 拥有一个普通的块级内容盒，最小尺寸为 100%。行内和双轴模式使用 max-content 行内尺寸，因此固有行内布局会有意宽于视口。"
      },
      {
        "guidance": true,
        "description": "在内容盒上使用逻辑内边距属性，以便嵌套的通栏组件获得相同的内缩几何。"
      },
      {
        "guidance": true,
        "description": "仅当视口本身应到达祖先容器边缘时，才设置 `isFullBleed`；默认关闭。"
      },
      {
        "guidance": true,
        "description": "仅当合适的视口应有意保持为 Sticky 边界时，才设置 `stickyContainment=\"always\"`。"
      },
      {
        "guidance": false,
        "description": "在没有其他可见且可操作的溢出提示的情况下隐藏原生滚动条。"
      },
      {
        "guidance": false,
        "description": "在 ScrollableArea 外再添加一个溢出包裹层；应只由一个原生视口负责滚动。"
      }
    ],
    "anatomy": [
      {
        "name": "视口",
        "required": true,
        "description": "根原生滚动容器、无障碍名称的拥有者、生效时的焦点目标，以及 `astryx-scrollable-area` 主题目标。"
      },
      {
        "name": "内容盒",
        "required": true,
        "description": "与视口一起观察的真实内部布局盒。对于行内滚动，它使用 max-content 行内尺寸，最小值为 100%。"
      }
    ]
  },
  "propDescriptions": {
    "axis": "允许原生滚动的逻辑轴或轴组。",
    "label": "视口在成为键盘可滚动时的无障碍名称。",
    "role": "命名视口的语义；仅对属于地标导航的区域使用 `region`。",
    "overscroll": "实际可滚动的轴到达边缘时是否继续滚动祖先元素。",
    "width": "视口宽度；数字按像素解释，字符串按原样使用。",
    "height": "视口高度；数字按像素解释，字符串按原样使用。",
    "maxWidth": "视口的最大宽度。",
    "minHeight": "视口的最小高度。",
    "stickyContainment": "合适的内容是将 Sticky 所有权传递给外层容器，还是有意保持此视口作为 CSS Sticky 边界。",
    "padding": "每个逻辑边的内容内边距；会发布匹配的内缩几何。",
    "paddingInline": "行内逻辑轴的内容内边距；在该轴上覆盖 `padding`。",
    "paddingInlineStart": "行内起始逻辑内容内边距；覆盖更宽泛的内边距值。",
    "paddingInlineEnd": "行内末端逻辑内容内边距；覆盖更宽泛的内边距值。",
    "paddingBlock": "块级逻辑轴的内容内边距；在该轴上覆盖 `padding`。",
    "paddingBlockStart": "块级起始逻辑内容内边距；覆盖更宽泛的内边距值。",
    "paddingBlockEnd": "块级末端逻辑内容内边距；覆盖更宽泛的内边距值。",
    "isFullBleed": "让视口突破继承的容器内边距，而不改变内容内边距。",
    "children": "在可观察内容盒内渲染的内容。",
    "xstyle": "视口的 StyleX 尺寸和原生滚动条呈现覆盖。必须是 `stylex.create()` 的值，而不是内联样式对象。"
  }
};
