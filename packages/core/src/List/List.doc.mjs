// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'List',
  displayName: 'List',
  group: 'List',
  category: 'Table & List',
  keywords: [
    'list',
    'listitem',
    'listbox',
    'menu',
    'collection',
    'items',
    'ul',
    'navlist',
  ],
  theming: {
    targets: [
      {className: 'astryx-list', visualProps: ['density', 'listStyle']},
      {className: 'astryx-list-item'},
    ],
    vars: [
      {
        name: '--_hit-border-bottom',
        description:
          "Width of the divider below a divided row, 0 on the last row. The row's touch hit layer adds it to its offset, so its band starts past the divider. ListItem sets it on the row's own ::after from --border-width under hasDividers, so content inside the row never inherits it, and a theme changes the divider through that token.",
        default: '0px',
        private: true,
      },
    ],
  },
  description: 'List container with density, dividers, and header support.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'List items (ListItem components).',
      slotElements: [
        {
          __element: 'ListItem',
          props: {
            label: 'List item',
          },
        },
      ],
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description:
        "Spacing density for items. Under a finger, an interactive row's hit target reaches 44px where its neighbors leave room, with no change to how rows look or lay out.",
      default: "'balanced'",
    },
    {
      name: 'hasDividers',
      type: 'boolean',
      description: 'Show dividers between items.',
      default: 'false',
    },
    {
      name: 'animatedLayout',
      type: 'AnimatedLayout',
      description:
        'The handle from useAnimatedLayout({containerRef}). With it, when rows are inserted, removed or reordered, an inserted row enters, a removed row collapses in place, a row that crosses rows moving the other way rides above them with the surface color behind it, and the rows after a change and the content after the list, up to that container, glide to their new places, all on one shared motion, under every pointer. Under Reduce Motion nothing travels. A row is identified by its itemKey: a row without one changes at once. Without a handle the list changes at once.',
    },
    {
      name: 'reorderable',
      type: 'Reorderable',
      description:
        "Makes the rows reorderable, with the object createReorderable({onReorder, isReorderable}) makes: each ListItem with an itemKey gets a reorder handle at its end, and each committed move calls onReorder once with the row's key and its index after the move ({key, to}); render the rows in the new order to apply it. A row the object's isReorderable rejects has no handle and keeps its place; one at either end of the list also bounds the others. The object may be made on every render. On a touch screen, a finger held still on a handle for a moment picks up its row (a flick on it still scrolls): the row stays in its place, dimmed, while a copy of it follows the finger and an accent line marks where it would land; the other rows stay still, the page scrolls near the edges, and on release the rows rearrange, gliding to their new places. A mouse drags a handle at once with the same copy and line, and the rows take their places without motion; a drag reports once, at the drop, and a cancelled drag puts everything back at once. In reorder mode the line marks the row's new place after each move. Without a drag, the handle is a toggle: a click, Space or Enter turns on reorder mode for its row (aria-pressed), in which each Up or Down arrow moves the row a place at once and reports it, and Escape or another activation ends the mode, keeping the moves. Each move is announced once it renders, with the row's place and its neighbours ('Milk, position 3 of 5, after Eggs, before Bread'), and a move into a row that keeps its place is refused and announced. While the mode is on, a hint anchored to the handle shows the moves and Done as buttons that do what the keys do, so a row can also be reordered by taps alone. The object's start(key) enters the same mode from your own UI, such as a row's context menu. A disabled row's handle stays focusable but moves nothing.",
    },
    {
      name: 'edge',
      type: "'padded' | 'flush' | 'outset' | 'bleed'",
      description:
        "Where each row's text, dividers, and hover and selection backgrounds sit, relative to the list's edges and the container around it. 'padded' keeps text inside each row's padding, so it starts a little in from a heading above the list and backgrounds have room around it. 'flush' drops the rows' side padding: text starts on the heading's line, and dividers and backgrounds stop at the row's content, with no room beyond it on either side. It works anywhere and suits static rows. 'outset' puts text on the heading's line and reaches dividers and backgrounds a little past it into the container's padding; it suits interactive rows in a container. 'bleed' puts text on the heading's line and reaches dividers and backgrounds to the container's edges, like Table rows in a Card. Rows are square, except that when the list is the first or last child of a rounded Card or Dialog that holds no other Table or bleeding List deeper inside, its first row (when it has no header) or last row takes the container's corner, less the container padding above or below it. A row's first content is what lines up with the heading: its marker, icon, or avatar when it has one, otherwise its label. 'outset' and 'bleed' reach into the padding of the nearest container that shares its padding: a Card, Section, Dialog, or BottomSheet, or a transparent container such as a Layout region with explicit padding or a padded ScrollableArea. Place the List directly in that container's padding: padding that Stack, Center, or your own styles add in between is not counted. Drawers and the automatic padding of LayoutContent and LayoutPanel aren't supported yet. With no such container, including in a Popover, they look like 'padded'. In a container with less padding than the rows' own, text starts a little after the heading's line. A theme's inline padding on `item` replaces the row padding of every value, including the zero padding of flush.",
      default: "'padded'",
    },
    {
      name: 'edgeCompensation',
      type: "'inline'",
      description:
        'Deprecated: use edge="outset", which this sets. Still works; edge wins when both are set. `astryx upgrade` rewrites existing usage.',
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'Header content, associated with the list via aria-labelledby.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Header',
        },
      ],
    },
    {
      name: 'listStyle',
      type: "'none' | 'disc' | 'decimal' | 'circle'",
      description:
        "List marker style. 'decimal' renders an <ol> element instead of <ul>.",
      default: "'none'",
    },
    {
      name: 'start',
      type: 'number',
      description:
        "Starting number for ordered lists (listStyle='decimal'). Sets the CSS counter to begin at this value.",
      default: '1',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [{name: 'ListItem'}],
  usage: {
    description:
      'A vertical collection of items with consistent spacing, dividers, and optional markers. Supports headers, icons, avatars, badges, and interactive items with click or link behavior. Use it to display ordered or unordered groups of related content.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a header to label the list and give context to screen readers.',
      },
      {
        guidance: true,
        description:
          'Use start and end content slots to add icons, avatars, or badges to each item.',
      },
      {
        guidance: true,
        description:
          'Set edge to line row text up with a heading above the list: flush for static rows, outset or bleed for rows in a Card, Section, or Dialog.',
      },
      {
        guidance: true,
        description:
          'To line text up with a heading and keep room around the highlight where there is no Card, such as a sidebar, put the heading and the list in a Section with variant="transparent" and set edge="outset".',
      },
      {
        guidance: false,
        description:
          'Place interactive elements inside an interactive list item; it creates nested click targets and confusing focus behavior.',
      },
      {
        guidance: false,
        description:
          'Use a list for a single item or for laying out unrelated content; lists imply a meaningful collection.',
      },
      {
        guidance: false,
        description:
          'Mix clickable and non-clickable items in the same list without clear visual distinction.',
      },
    ],
    anatomy: [
      {
        name: 'Header',
        required: false,
        description:
          'Optional content above the rows, from the header prop. It labels the list, and screen readers announce it as the list name.',
      },
      {
        name: 'List items',
        required: true,
        description: 'Individual entries, which may include icons or images.',
      },
      {
        name: 'Item description',
        required: false,
        description: 'Additional detail for an individual list item.',
      },
      {
        name: 'Reorder handle',
        required: false,
        description:
          'With reorderable: the button at the end of each row that can move. It drags the row, and toggles its reorder mode.',
      },
      {
        name: 'Reorder hint',
        required: false,
        description:
          "While a row is in reorder mode: the hint below its handle, like Core's keyboard hint, whose moves and Done are buttons.",
      },
    ],
  },
};
/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "具有一致间距、分隔线和可选标记的垂直条目集合。支持页眉、图标、头像、徽章，以及带点击或链接行为的交互条目。用于显示有序或无序的相关内容分组。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供 header 来标记列表，并为屏幕阅读器提供上下文。"
      },
      {
        "guidance": true,
        "description": "使用起始和结束内容插槽为每个条目添加图标、头像或徽章。"
      },
      {
        "guidance": true,
        "description": "设置 edge 使行文本与列表上方的标题对齐：静态行用 flush，Card、Section 或 Dialog 中的行用 outset 或 bleed。"
      },
      {
        "guidance": true,
        "description": "在没有 Card 的地方（如侧边栏）让文本与标题对齐并保留高亮周围的空间时，将标题和列表放入 variant=\"transparent\" 的 Section 中，并设置 edge=\"outset\"。"
      },
      {
        "guidance": false,
        "description": "不要在交互式列表条目内放置交互元素；这会产生嵌套的点击目标和令人困惑的焦点行为。"
      },
      {
        "guidance": false,
        "description": "不要将列表用于单个条目或布局不相关的内容；列表意味着有意义的集合。"
      },
      {
        "guidance": false,
        "description": "不要在同一列表中混用可点击和不可点击的条目而没有清晰的视觉区分。"
      }
    ],
    "anatomy": [
      {
        "name": "页眉",
        "required": false,
        "description": "来自 header 属性的行上方可选内容。它为列表加标签，屏幕阅读器会将其宣布为列表名称。"
      },
      {
        "name": "列表条目",
        "required": true,
        "description": "各个条目，可包含图标或图像。"
      },
      {
        "name": "条目描述",
        "required": false,
        "description": "单个列表条目的补充详情。"
      },
      {
        "name": "重排手柄",
        "required": false,
        "description": "使用 reorderable 时：每行末尾可移动的按钮。它拖动该行，并切换其重排模式。"
      },
      {
        "name": "重排提示",
        "required": false,
        "description": "当行处于重排模式时：其手柄下方的提示，类似 Core 的键盘提示，其“移动”和“完成”是按钮。"
      }
    ]
  },
  "name": "List",
  "description": "支持密度、分隔线和页眉的列表容器。",
  "propDescriptions": {
    "children": "列表条目（ListItem 组件）。",
    "density": "条目的间距密度。在手指操作下，交互行的点击目标会在相邻条目留出空间时达到 44px，而行的外观和布局不变。",
    "hasDividers": "在条目之间显示分隔线。",
    "animatedLayout": "来自 useAnimatedLayout({containerRef}) 的句柄。提供后，当行被插入、删除或重排时：插入的行会进入，删除的行在原位折叠，向相反方向移动并越过其他行的行会从它们上方滑过、背后带有表面颜色，变更后的行以及列表之后直到该容器的内容都会以同一套共享动效滑向新位置，适用于所有指针。在“减少动态效果”下不会有任何移动。行由 itemKey 标识：没有 itemKey 的行会立即变化。没有句柄时，列表会立即变化。",
    "reorderable": "使行可重排，使用 createReorderable({onReorder, isReorderable}) 创建的对象：每个带有 itemKey 的 ListItem 会在末尾获得一个重排手柄，每次提交的移动会以该行的键及其移动后的索引（{key, to}）调用一次 onReorder；按新顺序渲染行即可应用。被该对象的 isReorderable 拒绝的行没有手柄并保持原位；位于列表任一端的行也会限制其他行。该对象可以在每次渲染时创建。在触摸屏上，手指在手柄上保持片刻即可拾取其行（在其上快速滑动仍会滚动）：行留在原位并变暗，其副本跟随手指，强调线标记它将落到的位置；其他行保持不动，页面在靠近边缘时滚动，松开后行会重新排列并滑向新位置。鼠标拖动会立即拾取手柄，使用相同的副本和线条，行会无动效地就位；一次拖动只在放下时报告一次，取消的拖动会立即恢复一切。在重排模式下，线条在每次移动后标记行的新位置。没有拖动时，手柄是一个切换开关：点击、Space 或 Enter 会为其行开启重排模式（aria-pressed），此时每次按 Up 或 Down 方向键会立即将行移动一个位置并报告，Escape 或再次激活会结束该模式并保留移动。每次移动在渲染后宣布一次，包含行的位置及其相邻项（'Milk, position 3 of 5, after Eggs, before Bread'），移动到保持原位的行会被拒绝并宣布。模式开启时，锚定在手柄上的提示会将移动和“完成”显示为按钮，执行与按键相同的操作，因此仅通过点按也能重排行。对象的 start(key) 可从你自己的 UI（例如行的上下文菜单）进入相同模式。禁用行的手柄保持可聚焦但不移动任何内容。",
    "edge": "每行文本、分隔线以及悬停和选中背景相对于列表边缘及其周围容器的位置。'padded' 将文本保留在每行的内边距内，因此文本会从列表上方标题略微内缩开始，背景周围也有空间。'flush' 去掉行的侧内边距：文本从标题的行首开始，分隔线和背景止于行的内容，两侧没有多余空间。它适用于任何位置，适合静态行。'outset' 将文本放在标题的行首，并让分隔线和背景略微越过该行首进入容器的内边距；适合容器中的交互行。'bleed' 将文本放在标题的行首，并让分隔线和背景延伸到容器边缘，就像 Card 中的 Table 行。行是方角的，但当列表是圆角 Card 或 Dialog 的第一个或最后一个子元素，且其内部没有其他 Table 或出血列表时，其第一行（没有页眉时）或最后一行会采用容器的圆角，并减去其上下的容器内边距。行的第一个内容是与标题对齐的部分：其标记、图标或头像（若有），否则为其标签。'outset' 和 'bleed' 会延伸到与其共享内边距的最近容器的内边距中：Card、Section、Dialog 或 BottomSheet，或带显式内边距的透明容器（如 Layout 区域）或带内边距的 ScrollableArea。将 List 直接放在该容器的内边距中：Stack、Center 或你自己的样式在中间添加的内边距不计入。Drawer 以及 LayoutContent 和 LayoutPanel 的自动内边距尚不支持。没有此类容器时（包括在 Popover 中），它们看起来与 'padded' 相同。在比行自身内边距更小的容器中，文本会从标题行首略微之后开始。主题在 `item` 上的行内内边距会替换所有值的行内内边距，包括 flush 的零内边距。",
    "edgeCompensation": "已弃用：请使用 edge=\"outset\"，此属性即设置它。仍然有效；同时设置时 edge 优先。`astryx upgrade` 会重写现有用法。",
    "header": "页眉内容，通过 aria-labelledby 与列表关联。",
    "listStyle": "列表标记样式。'decimal' 渲染 <ol> 元素而不是 <ul>。",
    "start": "有序列表的起始编号（listStyle='decimal'）。将 CSS 计数器设置为从该值开始。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值：而不是像 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "ListItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Vertical list for rendering item collections w/ consistent spacing, dividers, marker styles. Composition model: List wraps ListItem sub-components.',
  usage: {
    description:
      'A vertical collection of items with consistent spacing, dividers, and optional markers. Supports headers, icons, avatars, badges, and interactive items with click or link behavior. Use it to display ordered or unordered groups of related content.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Provide a header to label the list and give context to screen readers.',
      },
      {
        guidance: true,
        description:
          'Use start and end content slots to add icons, avatars, or badges to each item.',
      },
      {
        guidance: true,
        description:
          'Set edge to line row text up with a heading above the list: flush for static rows, outset or bleed for rows in a Card, Section, or Dialog.',
      },
      {
        guidance: true,
        description:
          'To line text up with a heading and keep room around the highlight where there is no Card, such as a sidebar, put the heading and the list in a Section with variant="transparent" and set edge="outset".',
      },
      {
        guidance: false,
        description:
          'Place interactive elements inside an interactive list item; it creates nested click targets and confusing focus behavior.',
      },
      {
        guidance: false,
        description:
          'Use a list for a single item or for laying out unrelated content; lists imply a meaningful collection.',
      },
      {
        guidance: false,
        description:
          'Mix clickable and non-clickable items in the same list without clear visual distinction.',
      },
    ],
    anatomy: [
      {
        name: 'Header',
        required: false,
        description:
          'Optional content above the rows, from the header prop. It labels the list, and screen readers announce it as the list name.',
      },
      {
        name: 'List items',
        required: true,
        description: 'Individual entries, which may include icons or images.',
      },
      {
        name: 'Item description',
        required: false,
        description: 'Additional detail for an individual list item.',
      },
      {
        name: 'Reorder handle',
        required: false,
        description:
          'With reorderable: the button at the end of each row that can move. It drags the row, and toggles its reorder mode.',
      },
      {
        name: 'Reorder hint',
        required: false,
        description:
          "While a row is in reorder mode: the hint below its handle, like Core's keyboard hint, whose moves and Done are buttons.",
      },
    ],
  },
};
