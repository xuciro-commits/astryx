// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'createReorderable',
  displayName: 'createReorderable',
  // A factory documented as a hook: listed with the utilities, as useLayer
  // is, not as a tile in the components gallery.
  group: 'Utilities',
  keywords: [
    'reorder',
    'reorderable',
    'drag',
    'sort',
    'list',
    'handle',
    'grip',
    'move',
    'UIKit',
    'UITableView',
    'touch',
    'keyboard',
  ],
  params: [
    {
      name: 'onReorder',
      type: '(move: {key: Key; to: number}) => void',
      description:
        "Called once per committed move (a drop, or each move in reorder mode) with the moved item's key and its index after the move, in the full order of the collection's items. Apply it by rendering the items in their new order. A cancelled move calls nothing. The latest function given is the one called, so the object may be made on every render.",
      required: true,
    },
    {
      name: 'isReorderable',
      type: '(key: Key) => boolean',
      description:
        'Whether the item with this key can move. An item it rejects shows no handle and cannot be picked up; one at either end of the collection also bounds the others, so nothing drops beyond it and a keyboard move into it is refused. Every item moves without it.',
    },
  ],
  returns: [
    {
      name: 'reorderable',
      type: 'Reorderable',
      description:
        "The collection's reorder behavior: pass it as `List`'s `reorderable` prop, with an `itemKey` on each `ListItem`. Make it once per collection (with useMemo); one made on every render still works. Its one method, `start(key)`, enters reorder mode for that item from your own UI (a Move item in its context menu, a toolbar button): the focus moves to its handle, as activating it does; a key that cannot move or is not mounted does nothing and warns in development. One object may serve several collections, each reordering on its own; `start` then uses the one mounted last.",
    },
  ],
  usage: {
    description:
      "Makes a collection's rows reorderable. On a touch screen a finger held still on a row's handle for a moment picks it up (a flick on the handle still scrolls): the row stays in its place, dimmed, while a copy of it follows the finger and an accent line marks where it would land; the other rows stay still, the page scrolls near its edges, and on release the rows rearrange. A pen held still on a handle where the primary pointer is coarse picks the row up as a finger does. A mouse, or a pen where the primary pointer is fine, drags a handle at once the same way, and the rows take their places without motion; a cancelled drag puts everything back at once. Without a drag, the handle toggles reorder mode for its row (a click, Space or Enter): each arrow key moves the row a place at once, and Escape or another activation ends the mode, keeping the moves; screen readers hear each move with the row's place and neighbours, and a hint shows the moves and Done as buttons, for taps alone. The reorder code ships with this function: a collection without the prop loads none of it.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Give each row a stable key from your data, a string or a number (`itemKey={item.id}`), and apply each move by rendering the items in their new order in the same task.',
      },
      {
        guidance: true,
        description:
          'Use `isReorderable` for rows that must stay put, such as a pinned first row.',
      },
      {
        guidance: true,
        description:
          "Offer reorder mode from your own UI too, such as a row's context menu, with `reorderable.start(item.id)`.",
      },
      {
        guidance: false,
        description:
          "Use React's `key` as the reorder key, or index-based keys: a move changes every index after it.",
      },
    ],
  },
  relatedComponents: ['List'],
  importPath: '@astryxdesign/core',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "A collection's reorder behavior, for List's reorderable prop; ListItem itemKey on each row.",
  paramDescriptions: {
    onReorder:
      '({key, to}) once per committed move; to is the index after the move.',
    isReorderable:
      '(key) => boolean; a rejected row has no handle, and at an end bounds the drop.',
  },
  returnDescriptions: {
    reorderable:
      "pass as List's reorderable prop; start(key) enters reorder mode from your own UI.",
  },
  usage: {
    description:
      'UIKit edit-mode reorder: hold then drag (finger; pen on a coarse primary pointer), drag at once (mouse; pen on a fine one); without a drag, the handle toggles reorder mode (click, Space, Enter), arrows move, Escape ends.',
    bestPractices: [
      {
        guidance: true,
        description: 'Stable data keys as itemKey; apply the move at once.',
      },
      {
        guidance: false,
        description: "React's key or indexes as reorder keys.",
      },
    ],
  },
};

export const docsZh = {
  "name": "createReorderable",
  "usage": {
    "description": "使集合的行可重新排序。在触摸屏上，手指在行的手柄上保持片刻即可拾起该行（在手柄上快速滑动仍会滚动）：该行留在原位并变暗，其副本跟随手指，一条强调线标记其落点；其他行保持不动，页面在靠近边缘时会滚动，释放后各行重新排列。当主指针为粗糙指针时，笔在手柄上保持不动也会像手指一样拾起该行。鼠标（或主指针为精细指针时的笔）直接拖动手柄，行为相同，各行会立即就位且无动画；取消拖拽会立即还原一切。不使用拖拽时，手柄会切换该行的重新排序模式（点击、Space 或 Enter）：每次按方向键立即将行移动一个位置，按 Escape 或再次激活会结束模式并保留移动结果；屏幕阅读器会朗读每次移动及行的位置和相邻项，另有提示将移动和“完成”显示为按钮，仅供轻点使用。重新排序代码随此函数一起打包：未使用该属性的集合不会加载任何相关代码。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每行提供一个来自数据的稳定 key（字符串或数字，`itemKey={item.id}`），并在同一任务中按新顺序渲染项目以应用每次移动。"
      },
      {
        "guidance": true,
        "description": "对于必须固定不动的行（例如固定的首行），使用 `isReorderable`。"
      },
      {
        "guidance": true,
        "description": "也可从自己的 UI 提供重新排序模式，例如行的上下文菜单，使用 `reorderable.start(item.id)`。"
      },
      {
        "guidance": false,
        "description": "将 React 的 `key` 用作重新排序的 key，或使用基于索引的 key：一次移动会改变其后所有索引。"
      }
    ]
  },
  "paramDescriptions": {
    "onReorder": "每次已提交的移动（放置，或重新排序模式下的每次移动）调用一次，传入被移动项的 key 及其移动后的索引，顺序为集合所有项目的完整顺序。通过按新顺序渲染项目来应用它。取消的移动不会调用。调用的是最近一次传入的函数，因此该对象可以在每次渲染时创建。",
    "isReorderable": "具有此 key 的项目是否可以移动。被拒绝的项目不会显示手柄，也无法被拾起；位于集合任一端的项目还会限制其他项目，因此不会有项目落到它之外，键盘移动也无法移入。未设置时所有项目都可移动。"
  },
  "returnDescriptions": {
    "reorderable": "集合的重新排序行为：将其作为 `List` 的 `reorderable` 属性传入，并在每个 `ListItem` 上设置 `itemKey`。每个集合只创建一次（使用 `useMemo`）；每次渲染都创建也仍然可用。其唯一方法 `start(key)` 可从自己的 UI（上下文菜单中的“移动项目”、工具栏按钮）进入该项目的重新排序模式：焦点会像激活手柄一样移到手柄；无法移动或未挂载的 key 不会执行任何操作，并在开发环境下发出警告。一个对象可服务多个集合，每个集合独立重新排序；此时 `start` 使用最后挂载的那个。"
  }
};
