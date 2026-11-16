// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'LineClamp',
  displayName: 'Line Clamp',
  category: 'Layout',
  keywords: [
    'clamp',
    'truncate',
    'ellipsis',
    'overflow',
    'lines',
    'multiline',
    'text',
  ],
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Content to clamp: mixed inline content, nested elements, anything you would rather not wrap in a single Text.',
      required: true,
    },
    {
      name: 'maxLines',
      type: 'number',
      description:
        'Maximum number of lines to show before clamping with an ellipsis.',
      required: true,
    },
    {
      name: 'hasTruncateTooltip',
      type: 'boolean',
      description:
        "Show a tooltip with the full text content on hover or keyboard focus when clamped. A clamped root is focusable (tabindex 0) so keyboard users can reach the tooltip; a tabIndex you pass wins. The tooltip props follow Text's: when Text's hasTruncateTooltip is renamed in a minor, LineClamp follows.",
      default: 'true',
    },
    {
      name: 'truncateTooltipPlacement',
      type: "'above' | 'below' | 'start' | 'end'",
      description: 'Where the truncation tooltip opens.',
      default: "'above'",
    },
    {
      name: 'as',
      type: "'div' | 'span' | 'p'",
      description: 'HTML element to render.',
      default: "'div'",
    },
  ],
  usage: {
    description:
      "Clamps arbitrary content to a fixed number of lines with an ellipsis. Text's maxLines clamps a Text element; LineClamp clamps whatever it wraps and adds no typography of its own, so it suits mixed inline content and nested elements without changing their font, color or wrapping. Truncation detection reuses useTruncation (the same hook Text uses), so overflow is measured correctly even while -webkit-line-clamp clips scrollHeight.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use LineClamp when clamping a block of mixed or composed content (not a single Text node).',
      },
      {
        guidance: true,
        description:
          "Use Text's own maxLines prop when clamping a single Text node — no need to wrap it in LineClamp.",
      },
      {
        guidance: true,
        description:
          'Disable the tooltip (hasTruncateTooltip={false}) when the clamped content is already reachable elsewhere on the page, to avoid a redundant announcement.',
      },
      {
        guidance: true,
        description:
          "LineClamp makes a focusable descendant inert only when both hold: (1) it is in the clamp's own flow. A positioned element is in that flow when its containing block is an element inside the clamp that is itself in the flow, as a control's own positioned wrapper is; the line test then applies to that containing block's box. A fixed element, an absolute element whose containing block is the clamp itself or lies outside it, a top-layer element (a popover or dialog), and anything rendered elsewhere through a portal each start a subtree that is never made inert, at any depth. (2) its box lies wholly beyond the clamp's last visible line. A control any part of which is visible stays reachable. A focusable with no box when LineClamp checks is treated as beyond the last line until it gains a box; LineClamp re-checks then. LineClamp re-checks when its size, its content or its fonts change. Gap: an absolutely placed control that the clamp itself clips stays a tab stop; the author owns positioned content inside a clamp. Inert takes such a control out of the Tab order and the accessibility tree. LineClamp never rewrites your own tabIndex or aria-hidden, and the element that holds focus is never made inert.",
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "LineClamp",
  "displayName": "Line Clamp",
  "usage": {
    "description": "将任意内容以省略号限制为固定行数。Text 的 maxLines 限制单个 Text 元素；LineClamp 限制其包裹的任何内容，且不添加自身排版，因此适用于混合内联内容和嵌套元素，而不会改变它们的字体、颜色或换行方式。截断检测复用 useTruncation（Text 使用的同一 Hook），因此即使 -webkit-line-clamp 裁剪 scrollHeight，溢出也能被正确测量。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当限制混合或组合内容块（而非单个 Text 节点）时使用 LineClamp。"
      },
      {
        "guidance": true,
        "description": "限制单个 Text 节点时使用 Text 自身的 maxLines 属性——无需将其包裹在 LineClamp 中。"
      },
      {
        "guidance": true,
        "description": "当被限制的内容已在页面其他地方可达时，禁用工具提示（hasTruncateTooltip={false}），以避免冗余播报。"
      },
      {
        "guidance": true,
        "description": "仅在以下两个条件同时成立时，LineClamp 才会使可聚焦的后代变为惰性：(1) 它位于 clamp 自身的流中。当定位元素的包含块是 clamp 内部且本身处于流中的元素（例如控件自有的定位包裹层）时，该定位元素就在该流中；此时行测试应用于该包含块的盒。固定元素、包含块为 clamp 自身或位于其外的绝对定位元素、顶层元素（popover 或 dialog），以及通过 portal 渲染到别处的任何内容，都会各自开启一个永远不会变为惰性的子树，无论深度如何。(2) 其盒完全位于 clamp 最后可见行之外。任何部分可见的控件仍可到达。LineClamp 检查时没有盒的可聚焦元素会被视为在最后一行之外，直到它获得盒；LineClamp 届时会重新检查。LineClamp 在其尺寸、内容或字体变化时会重新检查。缺口：被 clamp 自身裁剪的绝对定位控件仍会保留为 Tab 停靠点；clamp 内的定位内容由作者负责。惰性会将此类控件从 Tab 顺序和无障碍树中移除。LineClamp 绝不会改写你自己的 tabIndex 或 aria-hidden，且持有焦点的元素永远不会被设为惰性。"
      }
    ]
  },
  "propDescriptions": {
    "children": "要限制的内容：混合内联内容、嵌套元素，以及任何你不愿包裹在单个 Text 中的内容。",
    "maxLines": "以省略号截断前显示的最大行数。",
    "hasTruncateTooltip": "截断时在悬停或键盘聚焦时显示包含完整文本内容的工具提示。被截断的根元素可聚焦（tabindex 0），以便键盘用户能访问工具提示；你传入的 tabIndex 优先。工具提示属性遵循 Text 的约定：若 Text 的 hasTruncateTooltip 在次版本中重命名，LineClamp 会跟随。",
    "truncateTooltipPlacement": "截断工具提示的打开位置。",
    "as": "要渲染的 HTML 元素。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Clamps arbitrary content to N lines with an ellipsis; composable version of Text maxLines.',
  usage: {
    description:
      'Wrap any children (mixed inline content, nested elements) to clamp the whole block to N lines. Reuses useTruncation for overflow detection.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for clamping a block of mixed/composed content, not a single Text node.',
      },
      {
        guidance: true,
        description: "Use Text's own maxLines for a single Text node instead.",
      },
      {
        guidance: true,
        description:
          'Disable tooltip when content is reachable elsewhere, to avoid redundant announcement.',
      },
      {
        guidance: true,
        description:
          "Inert only for a focusable in the clamp's own flow whose box lies wholly past the last visible line (a positioned element placed against an in-flow containing block in the clamp, like a control's own wrapper, is in the flow and judged by that block's box); never inside a fixed, escaping absolute, top-layer or portaled subtree; a partly visible control stays reachable; a focusable with no box counts as past the last line until it gains a box; re-checked on size, content and font changes. Gap: an absolutely placed control the clamp clips stays a tab stop. Never the focused element, never your own tabIndex or aria-hidden.",
      },
    ],
  },
  propDescriptions: {
    children:
      'Content to clamp. Composable version of maxLines — wraps arbitrary children.',
    maxLines: 'Max lines before clamping with ellipsis.',
    hasTruncateTooltip:
      "Tooltip with full text on hover or focus when clamped. Clamped root is focusable. Follows Text's prop name.",
    truncateTooltipPlacement: "Tooltip placement. Default 'above'.",
    as: "HTML element to render. Default 'div'.",
  },
};
