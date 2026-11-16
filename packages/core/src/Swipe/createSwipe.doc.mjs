// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'createSwipe',
  displayName: 'createSwipe',
  // A constructor documented as a hook: listed with the utilities, beside the
  // rows that take its value, not as a tile in the components gallery.
  group: 'Utilities',
  keywords: [
    'swipe',
    'swipe actions',
    'row actions',
    'trailing actions',
    'leading actions',
    'list row',
    'archive',
    'delete',
    'gesture',
    'touch',
  ],
  params: [
    {
      name: 'options.leading',
      type: 'ReadonlyArray<SwipeAction<Id>>',
      description:
        "The verbs a drag toward the inline end uncovers (rightward in left-to-right text), outermost last. Each is `{id, label, icon?, onActivate, isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`: `id` names the action, and the swipe's type carries the ids, so an id it does not have fails to compile. `label` names the state the verb reaches and is the button's accessible name. `onActivate({id, itemKey})` fires on a tap on a resting entry, on a full swipe, or on a `commit` release, once the row's content has left its box when the row slides out; `itemKey` is the `ListItem`'s, `undefined` on a plain `Item`. `hasRemoval` only says the row holds out after the action fires instead of springing back.",
      required: false,
    },
    {
      name: 'options.trailing',
      type: 'ReadonlyArray<SwipeAction<Id>>',
      description:
        'The verbs a drag toward the inline start uncovers (leftward in left-to-right text), outermost last, in the same shape as `leading`.',
      required: false,
    },
    {
      name: 'options.swipeBehavior',
      type: "'reveal' | 'commit'",
      description:
        'What a swipe does, on both sides. `reveal` rests the row open with every entry a real button. As in a UIKit list, a fast release goes the way it moves, and a slow one past half the panel opens the row. A fling never fires an entry. A long drag fires the outermost: past the confirm point the row runs ahead and the outermost entry covers its place. Letting go there fires it. Backing out closes the row, and a disabled outermost entry never confirms. On a side with two or more entries, only a drag that starts on the open row fires. `commit` fires the one entry of a side on a full swipe, sliding the row out, with nothing resting and a presentational panel. On a side with two or more entries it fires none and warns in development.',
      default: "'reveal'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'Swipe',
      type: 'Swipe<Id>',
      description:
        'The row’s swipe actions, with nothing in them to read; its type carries the actions’ ids. Pass the value as `swipe` on `Item` or `ListItem`; a value made any other way swipes nothing. A new value with the same ids keeps an open row as it is, and one with other ids closes it.',
    },
  ],
  usage: {
    description:
      'Gives a list row the verbs a sideways swipe uncovers, the way a mail row reveals Archive and Delete on a phone: `const mail = createSwipe({trailing: [{id: \'archive\', label: \'Archive\', onActivate: ({itemKey}) => archive(itemKey)}]})`, then `<ListItem label="Inbox" itemKey={message.id} swipe={mail} />`. A finger, a pen or a trackpad’s two-finger swipe drags the row; a mouse never does. A plain function, not a hook, pure and cheap: define the swipe once at module scope, where each handler reads the row from `itemKey`, or in `useMemo` when its handlers need component state. A new value with the same ids neither closes an open row nor restarts its settle, and it does no DOM work. The swipe’s code comes with this function, so a row given `swipe` is swipeable at its first paint and an app that never imports it ships none of it.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give every swipe action a second home in the row, such as a menu or a button in endContent: a verb reachable only by swipe is unreachable by keyboard and by mouse.',
      },
      {
        guidance: true,
        description:
          'Put the rows in a List, which clips them in the inline axis; any other container sets overflow-inline: clip once.',
      },
      {
        guidance: false,
        description:
          'Give a `commit` side more than one entry: it fires none of them.',
      },
    ],
    accessibility: [
      {
        name: 'Keyboard and assistive technology',
        category: 'Keyboard',
        description:
          'The swipe is a touch accelerator. A closed row’s panels are out of the accessibility tree and the tab order; an open row’s entries are real buttons under `reveal`, named by their labels, and Escape closes the row. Every verb must also be reachable through the row’s own content.',
      },
      {
        name: 'Reduce Motion',
        category: 'Content',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'When the person asks for reduced motion, the row reaches its resting place with no travel or spring and cross-fades when a finger started the swipe.',
      },
    ],
  },
  relatedComponents: ['Item', 'List'],
  importPath: '@astryxdesign/core/Swipe',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Makes a row's swipe actions: pass the value as swipe on Item or ListItem.",
  paramDescriptions: {
    'options.leading':
      'Entries a drag toward the inline end uncovers, outermost last.',
    'options.trailing':
      'Entries a drag toward the inline start uncovers, outermost last.',
    'options.swipeBehavior':
      "'reveal' (rest open, entries tappable; default) or 'commit' (a full swipe fires the one entry of a side).",
  },
  returnDescriptions: {
    Swipe: 'Opaque; pass as swipe.',
  },
  usage: {
    description:
      'Touch accelerator for list rows; a mouse never swipes. Define once at module scope (handlers get {id, itemKey}) or in useMemo; no DOM work; its code ships only where it is imported.',
    bestPractices: [
      {guidance: true, description: 'Give each verb a second home in the row.'},
      {guidance: false, description: 'Several entries on a commit side.'},
    ],
  },
};

export const docsZh = {
  "name": "createSwipe",
  "usage": {
    "description": "为列表行提供侧滑可揭示的操作，就像手机邮件行可显示“归档”和“删除”：`const mail = createSwipe({trailing: [{id: 'archive', label: 'Archive', onActivate: ({itemKey}) => archive(itemKey)}]})`，然后 `<ListItem label=\"Inbox\" itemKey={message.id} swipe={mail} />`。手指、触控笔或触控板的双指滑动会拖动该行；鼠标永远不会。它是普通函数而非 Hook，纯粹且开销低：在模块作用域中定义一次 swipe，让每个处理函数通过 `itemKey` 读取对应行；当处理函数需要组件状态时，则在 `useMemo` 中定义。具有相同 id 的新值既不会关闭已打开的行，也不会重新开始其稳定过程，而且不会执行任何 DOM 操作。Swipe 的代码随此函数一起加载，因此设置了 `swipe` 的行在首次绘制时即可滑动，而从不导入它的应用不会携带任何相关代码。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为每个滑动操作在行中提供第二个入口，例如 endContent 中的菜单或按钮：只能通过滑动触达的动词，键盘和鼠标都无法触达。"
      },
      {
        "guidance": true,
        "description": "将行放在 List 中，它会沿行内轴裁剪它们；任何其他容器都需设置一次 overflow-inline: clip。"
      },
      {
        "guidance": false,
        "description": "不要为 `commit` 一侧提供多个条目：它一个都不会触发。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘和辅助技术",
        "category": "Keyboard",
        "criterion": "",
        "description": "Swipe 是触摸加速器。关闭行的面板不在无障碍树和 Tab 顺序中；打开行的条目是 `reveal` 下的真实按钮，以其标签命名，按 Escape 可关闭该行。每个操作动词也必须能通过行自身的内容访问。"
      },
      {
        "name": "减少动效",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "当用户要求减少动效时，行会以无位移、无弹性的方式到达静止位置；如果滑动由手指发起，则会交叉淡入淡出。"
      }
    ]
  },
  "paramDescriptions": {
    "options.leading": "向行内末端拖动（从左到右文本中为向右）所揭示的操作动词，最外侧的排在最后。每个为 `{id, label, icon?, onActivate, isDisabled?, variant?: ItemSwipeActionVariant, hasRemoval?}`：`id` 命名操作，swipe 的类型携带这些 id，因此不存在的 id 无法通过编译。`label` 命名该动词到达的状态，也是按钮的无障碍名称。`onActivate({id, itemKey})` 在轻点静止条目、完整滑动或 `commit` 释放时触发；如果行滑出，则在行内容离开其盒子后触发；`itemKey` 是 `ListItem` 的，在普通 `Item` 上为 `undefined`。`hasRemoval` 仅表示操作触发后行会保持移出状态，而不是弹回。",
    "options.trailing": "向行内起始方向拖动（从左到右文本中为向左）所揭示的操作动词，最外侧的排在最后，形状与 `leading` 相同。",
    "options.swipeBehavior": "滑动在两侧的行为。`reveal` 会让行保持打开，每个条目都是真实按钮。与 UIKit 列表一样，快速释放会沿移动方向继续，而缓慢释放超过面板一半时则打开该行。快速甩动绝不会触发条目。长距离拖动会触发最外侧操作：越过确认点后，行会向前跑出，最外侧条目占据其位置。在那里松开即触发。返回则关闭该行，禁用的最外侧条目永远不会确认。一侧有两个或更多条目时，只有从已打开行开始的拖动才会触发。`commit` 会在完整滑动时触发一侧的唯一一个条目，使行滑出，没有静止状态，仅有一个呈现式面板。一侧有两个或更多条目时，它不会触发任何条目，并在开发环境中发出警告。"
  },
  "returnDescriptions": {
    "Swipe": "行的滑动操作，其中没有可读取的内容；其类型携带操作 id。将该值作为 `swipe` 传给 `Item` 或 `ListItem`；以其他方式构造的值不会产生任何滑动。具有相同 id 的新值会保持打开的行不变，而具有其他 id 的值会关闭它。"
  }
};
