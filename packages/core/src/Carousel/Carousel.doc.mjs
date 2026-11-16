// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Carousel',
  displayName: 'Carousel',
  category: 'Container',
  keywords: ['carousel', 'slider', 'scroll', 'gallery', 'filmstrip', 'swiper', 'horizontal', 'overflow', 'snap'],
  usage: {
    description:
      'Carousel scrolls a row of items horizontally when they overflow the available width. Use it for card grids, image galleries, product lists, or any set of items that should be browsable without taking up the full page.',
    bestPractices: [
      {guidance: true, description: 'Enable scroll-snap when each item should land precisely at the start edge, like a gallery or product list.'},
      {guidance: true, description: "For iOS paging under a finger and on a trackpad swipe, pass hasSnap={useSnapPaging()} from @astryxdesign/core/SnapPaging. A flick moves one view, or one item with useSnapPaging({pages: 'item'}). A mouse wheel keeps native snapping. Only a carousel given it loads the paging code."},
      {guidance: true, description: 'Reach for hasLoop on small, cyclable sets like a photo gallery, where wrapping past the last item back to the first feels natural.'},
      {guidance: true, description: 'Always provide an aria-label that describes what the carousel contains, like "Featured products" or "Team members".'},
      {guidance: true, description: 'Carousel implements the WAI-ARIA APG carousel pattern (https://www.w3.org/WAI/ARIA/apg/patterns/carousel/) without auto-rotation: the region is labelled and carries aria-roledescription="carousel", each item is a group named "Slide N of M", and the scroll container is a tab stop while its content overflows, so keyboard users can pan it with the arrow keys; while everything fits it stays out of the tab order.'},
      {guidance: true, description: 'Use a consistent gap and item width so the carousel looks intentional, not like content overflowing by accident.'},
      {guidance: true, description: 'Trust the built-in navigation: trackpad users can swipe horizontally, and mouse users can hold Shift while scrolling the wheel to move through items.'},
      {guidance: false, description: 'Use a carousel for content every user must see. Not everyone scrolls horizontally, so put critical content above the fold.'},
      {guidance: false, description: 'Auto-advance items. Let the user scroll at their own pace.'},
      {guidance: false, description: 'Nest carousels. A carousel inside a carousel is confusing and breaks keyboard navigation.'},
    ],
    anatomy: [
      {name: 'Scroll container', required: true, description: 'The horizontal overflow area that holds all items.'},
      {name: 'Items', required: true, description: 'The children rendered in a row inside the scroll container. With hasSnap, each item snaps to the start edge.'},
      {name: 'Fade edges', required: false, description: 'Gradient fades on the left and right edges that indicate more content is available. Enabled by default, disable with hasEdgeFade={false}.'},
      {name: 'Navigation buttons', required: false, description: 'Prev/next buttons that appear when the content can scroll in that direction. Enabled by default, disable with hasButtons={false}.'},
    ],
  },
  props: [
    {name: 'children', type: 'ReactNode', description: 'Carousel items rendered in a horizontal scroll container.', required: true},
    {name: 'gap', type: "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4", description: 'Gap between items using the spacing token scale.', default: '1'},
    {name: 'hasButtons', type: 'boolean', description: 'Show prev/next navigation buttons when content is scrollable.', default: 'true'},
    {name: 'hasEdgeFade', type: 'boolean', description: 'Show a gradient edge-fade mask when content overflows, signalling that more items exist off-screen.', default: 'true'},
    {name: 'hasLoop', type: 'boolean', description: 'Wrap-around scrolling: next at the end scrolls to the start, prev at the start scrolls to the end. Buttons stay visible at both edges. Only engages when content overflows.', default: 'false'},
    {name: 'hasSnap', type: 'boolean | SnapPaging', description: "Snap each child to the start edge. hasSnap uses native CSS scroll snap. hasSnap={useSnapPaging()} adds iOS paging under a finger and on a trackpad swipe, on the same stops: a flick moves one view, or one item with useSnapPaging({pages: 'item'}). Only that value loads the paging code.", default: 'false'},
    {name: 'padding', type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10', description: 'Inline padding inside the scroll container, with matching scroll-padding so snap points align to the content edge.'},
    {name: 'aria-label', type: 'string', description: 'Accessible label for the carousel region.', default: "\'Carousel\'"},
    {name: 'ref', type: 'React.Ref<HTMLDivElement>', description: 'Ref forwarded to the root element.'},
    {name: 'handleRef', type: 'React.Ref<CarouselHandle>', description: 'Imperative handle exposing scrollNext(), scrollPrev(), scrollTo(index), canScrollNext(), and canScrollPrev() for programmatic scroll control.'},
    {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value.'},
    {name: 'className', type: 'string', description: 'CSS class name for the root element. Prefer xstyle for styling.'},
    {name: 'style', type: 'CSSProperties', description: 'Inline styles for the root element. Prefer xstyle.'},
    {name: 'data-testid', type: 'string', description: 'Test selector for automated testing frameworks.'},
  ],
  playground: {
    defaults: {
      children: [
        {__element: 'Card', props: {padding: 4}, children: 'Slide 1'},
        {__element: 'Card', props: {padding: 4}, children: 'Slide 2'},
        {__element: 'Card', props: {padding: 4}, children: 'Slide 3'},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-carousel'},
      {className: 'astryx-carousel-scroller', visualProps: ['gap', 'padding', 'snap', 'edgeFade']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "`Carousel` 在项目超出可用宽度时，将一行项目水平滚动。适用于卡片网格、图片画廊、产品列表，或任何需要可浏览但不占满整个页面的项目集合。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当每个项目都应精确停在起始边缘时（例如画廊或产品列表），启用 scroll-snap。"
      },
      {
        "guidance": true,
        "description": "若要在手指拖动和触控板轻扫时实现 iOS 分页，请传入来自 `@astryxdesign/core/SnapPaging` 的 `hasSnap={useSnapPaging()}`。轻扫一次移动一屏，使用 `useSnapPaging({pages: 'item'})` 时移动一个项目。鼠标滚轮保持原生吸附。只有传入该值的轮播才会加载分页代码。"
      },
      {
        "guidance": true,
        "description": "对于小型可循环集合（例如照片画廊），使用 `hasLoop`；在这种场景下，从最后一项绕回第一项会更自然。"
      },
      {
        "guidance": true,
        "description": "始终提供描述轮播内容的 `aria-label`，例如“精选产品”或“团队成员”。"
      },
      {
        "guidance": true,
        "description": "`Carousel` 实现 WAI-ARIA APG 轮播模式（https://www.w3.org/WAI/ARIA/apg/patterns/carousel/），但不自动轮播：区域带有标签和 `aria-roledescription=\"carousel\"`，每个项目是名为“第 N 张，共 M 张”的分组，滚动容器在内容溢出时作为 Tab 停靠点，键盘用户可以用方向键平移；内容完全放得下时，它不会进入 Tab 顺序。"
      },
      {
        "guidance": true,
        "description": "使用一致的间距和项目宽度，让轮播看起来是有意设计的，而不是内容意外溢出。"
      },
      {
        "guidance": true,
        "description": "信赖内置导航：触控板用户可以水平轻扫，鼠标用户可以按住 Shift 滚动滚轮来浏览项目。"
      },
      {
        "guidance": false,
        "description": "将轮播用于每个用户都必须看到的内容。并非所有人都会水平滚动，因此请将关键内容放在首屏。"
      },
      {
        "guidance": false,
        "description": "自动切换项目。让用户按自己的节奏滚动。"
      },
      {
        "guidance": false,
        "description": "嵌套轮播。轮播内再放轮播会令人困惑，并破坏键盘导航。"
      }
    ],
    "anatomy": [
      {
        "name": "滚动容器",
        "required": true,
        "description": "存放所有项目的水平溢出区域。"
      },
      {
        "name": "项目",
        "required": true,
        "description": "在滚动容器内以一行渲染的子元素。启用 `hasSnap` 时，每个项目会吸附到起始边缘。"
      },
      {
        "name": "边缘渐隐",
        "required": false,
        "description": "左右边缘的渐变淡出效果，表示还有更多内容。默认启用，可通过 `hasEdgeFade={false}` 禁用。"
      },
      {
        "name": "导航按钮",
        "required": false,
        "description": "当内容可以朝某个方向滚动时出现的上一页/下一页按钮。默认启用，可通过 `hasButtons={false}` 禁用。"
      }
    ]
  },
  "propDescriptions": {
    "children": "在水平滚动容器中渲染的轮播项目。",
    "gap": "项目之间的间距，使用间距令牌刻度。",
    "hasButtons": "内容可滚动时显示上一页/下一页导航按钮。",
    "hasEdgeFade": "内容溢出时显示渐变边缘遮罩，提示屏幕外还有更多项目。",
    "hasLoop": "循环滚动：在末尾点击下一页会滚动到开头，在开头点击上一页会滚动到末尾。按钮在两个边缘都保持可见。仅在内容溢出时生效。",
    "hasSnap": "将每个子元素吸附到起始边缘。`hasSnap` 使用原生 CSS scroll snap。`hasSnap={useSnapPaging()}` 会在手指拖动和触控板轻扫时添加 iOS 分页，并沿用相同的停靠点：轻扫一次移动一屏，使用 `useSnapPaging({pages: 'item'})` 时移动一个项目。只有该值会加载分页代码。",
    "padding": "滚动容器内部的内联内边距，并匹配 `scroll-padding`，使吸附点对齐到内容边缘。",
    "aria-label": "轮播区域的无障碍标签。",
    "handleRef": "命令式句柄，暴露 `scrollNext()`、`scrollPrev()`、`scrollTo(index)`、`canScrollNext()` 和 `canScrollPrev()`，用于以编程方式控制滚动。",
    "ref": "转发到根元素的 ref。",
    "xstyle": "用于布局定制（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值。",
    "className": "根元素的 CSS 类名。样式优先使用 `xstyle`。",
    "style": "根元素的内联样式。优先使用 `xstyle`。",
    "data-testid": "用于自动化测试框架的测试选择器。"
  },
  "name": "Carousel"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'horizontal scroll container w/ fade edges, nav buttons, scroll-snap',
  usage: {
    description:
      'Carousel scrolls items horizontally when they overflow. Use for card grids, galleries, product lists.',
    bestPractices: [
      {guidance: true, description: 'Enable scroll-snap when each item should land precisely at the start edge: gallery, product list.'},
      {guidance: true, description: 'Reach for hasLoop on small cyclable sets (photo gallery) where wrapping past the last item back to the first feels natural.'},
      {guidance: true, description: 'Always provide an aria-label describing what the carousel contains: "Featured products", "Team members".'},
      {guidance: true, description: 'Use consistent gap + item width so the carousel looks intentional, not like content overflowing by accident.'},
      {guidance: true, description: 'Trust built-in navigation: trackpad users swipe horizontally, mouse users hold Shift + wheel to move through items.'},
      {guidance: false, description: 'Use a carousel for content every user must see. Not everyone scrolls horizontally, so put critical content above the fold.'},
      {guidance: false, description: 'Auto-advance items. Let the user scroll at their own pace.'},
      {guidance: false, description: 'Nest carousels. A carousel inside a carousel is confusing and breaks keyboard navigation.'},
    ],
  },
  propDescriptions: {
    children: 'carousel items in horizontal scroll',
    gap: 'item spacing via spacing token scale',
    hasButtons: 'prev/next buttons when content is scrollable',
    hasEdgeFade: 'gradient edge-fade mask on overflow',
    hasLoop: 'wrap-around: next at end -> start, prev at start -> end; buttons stay visible; only when overflowing',
    hasSnap: "scroll-snap; children snap to start edge. hasSnap={useSnapPaging()}: iOS paging under a finger or trackpad swipe, one view per flick ({pages: 'item'}: one item); only that value loads the pager",
    padding: 'inline padding; scroll-padding keeps snap points on content edge',
    'aria-label': 'accessible label for carousel region',
    handleRef: 'imperative handle: scrollNext/scrollPrev/scrollTo(index)/canScrollNext/canScrollPrev',
    'data-testid': 'test selector for automated testing frameworks',
  },
};
