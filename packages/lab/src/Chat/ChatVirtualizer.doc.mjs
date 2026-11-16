// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatVirtualizer',
  subComponentOf: 'Chat',
  group: 'Chat',
  category: 'Chat',
  displayName: 'Chat Virtualizer',
  description:
    'Windowed message list for long transcripts: only the rows near the viewport are rendered, and the rest is represented by two spacer elements, so a thread of thousands of messages costs a viewport of DOM. Rows stay in normal document flow. While a finger scrolls the list, position corrections are written as spacer height rather than a scrollTop jump, so nothing moves under the finger; they settle when that scroll ends. Outside a touch gesture the list writes scrollTop. Follows the newest message by default, re-engaging that follow when a user scroll lands within endThreshold of the bottom. Renders its own scroll container, or nests inside one the caller already owns (see scrollElement).',
  props: [
    {
      name: 'data',
      type: 'readonly T[]',
      description:
        'Rows to render, oldest first. Changes are detected by REFERENCE, so replace the array instead of mutating it — a mutation leaves the geometry stale.',
      required: true,
    },
    {
      name: 'getRowKey',
      type: '(item: T, index: number) => string',
      description:
        'Stable identity per row, coerced with String(). The size cache and the running size averages are keyed by it, so deriving a key from the index discards every measurement whenever the list shifts.',
      required: true,
    },
    {
      name: 'renderItem',
      type: '(info: {item: T; index: number}) => ReactNode',
      description:
        'Renders one row. Row spacing must live inside what this returns (padding) — container gap and margins are invisible to measurement, so the geometry would drift by one gap per row.',
      required: true,
    },
    {
      name: 'estimatedItemSize',
      type: 'number | ((item: T, index: number) => number)',
      description:
        'Height assumed for rows that have not been measured yet; a function is authoritative and is never overridden by the running averages. Bias it LOW — an estimate that is too small lets content grow below you and leaves your position valid, while one that is too large shrinks the scroll range and the browser clamps your position into it.',
      default: '120',
    },
    {
      name: 'handleRef',
      type: 'Ref<ChatVirtualizerHandle>',
      description:
        'Imperative handle exposing scrollToDistanceFromBottomPx and anchorToKey. Both DECLARE a reference frame rather than performing one scroll: the list keeps restoring the declared position as rows measure in, so a landing is not lost to content that arrives after it.',
    },
    {
      name: 'getItemType',
      type: '(item: T, index: number) => string',
      description:
        'Classifies a row so measured sizes feed a running average per type. A transcript mixing one-line tool stubs with long markdown then converges to an honest price per shape instead of one blended number.',
    },
    {
      name: 'scrollElement',
      type: 'HTMLElement | null',
      description:
        "Attach mode: the scroll container the caller already owns, into which spacers and rows render as one content block instead of the list creating its own scroller. Pass the ELEMENT, not a ref: a parent's ref attaches after its children's layout effects, so a ref still reads null on the commit that first needs the scroller, and a ref mutation is invisible to React — nothing re-renders and no effect re-runs when it lands, while an element in state makes its arrival a render and a real dependency (scroll listeners, observation, and the gesture state machine are rebuilt when the container changes). Read it in a passive effect and hold it in state. Pass null (not undefined) while it is still pending: undefined means own-container mode, and one commit of that inside an unbounded parent mounts every row.",
    },
    {
      name: 'endThreshold',
      type: 'number',
      description:
        'How close to the bottom, in px, a user scroll must land to re-engage following the newest message; disengaging is any upward movement past it. Too tight and a user who stops visually at the bottom (trackpad inertia, fractional row heights, page zoom) silently stops following while output grows below them.',
      default: '24',
    },
    {
      name: 'overscanTop',
      type: 'number',
      description:
        'Extra px of rows kept mounted above the viewport, absorbing upward scrolls before a new window has to be computed.',
      default: '1600',
    },
    {
      name: 'overscanBottom',
      type: 'number',
      description: 'Extra px of rows kept mounted below the viewport.',
      default: '600',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name of the scroll container the list creates, which keyboard users can focus and scroll. Own-container mode only; in attach mode the caller names its own scroller.',
      default: "'Messages' (translated)",
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Applied to the scroll container the list creates. Own-container mode only.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'Applied to the scroll container the list creates. Own-container mode only.',
    },
  ],
};

export const docsZh = {
  "name": "ChatVirtualizer",
  "displayName": "Chat Virtualizer",
  "description": "用于长对话记录的窗口化消息列表：仅渲染视口附近的行，其余部分由两个占位元素表示，因此包含数千条消息的线程只消耗一个视口的 DOM。行保持在正常文档流中。手指滚动列表时，位置修正以占位高度而不是 scrollTop 跳转的形式写入，手指下方不会有任何移动；滚动结束后它们会稳定下来。在触摸手势之外，列表会写入 scrollTop。默认跟随最新消息，当用户的滚动落在距底部 endThreshold 以内时会重新启用跟随。渲染自己的滚动容器，或嵌套在调用方已拥有的容器中（参见 scrollElement）。",
  "propDescriptions": {
    "data": "要渲染的行，最旧的在前。变更按引用检测，因此请替换数组而不是修改它——修改会使几何信息过期。",
    "getRowKey": "每行的稳定标识，用 String() 强制转换。尺寸缓存和运行中的尺寸平均值都以它为键，因此从索引派生键会在列表每次变动时丢弃所有测量结果。",
    "renderItem": "渲染一行。行间距必须放在其返回值内部（内边距）——容器 gap 和外边距对测量不可见，几何信息会按每行一个 gap 的误差漂移。",
    "estimatedItemSize": "尚未测量的行的假定高度；函数值是权威的，永远不会被运行中的平均值覆盖。请将其低估——估计值太小会让内容在下方增长而你的位置仍然有效，而估计值太大则会缩小滚动范围，浏览器会将你的位置限制在其中。",
    "handleRef": "命令式句柄，暴露 scrollToDistanceFromBottomPx 和 anchorToKey。两者都是声明一个参考系，而不是执行一次滚动：列表会在行测量时持续恢复声明的定位，因此落点不会因之后到达的内容而丢失。",
    "getItemType": "对行进行分类，使已测量的尺寸按类型进入运行平均值。混合了单行工具存根和长 Markdown 的对话记录会收敛到每种形态的诚实价格，而不是一个混合的数字。",
    "scrollElement": "附加模式：调用方已拥有的滚动容器，占位元素和行会作为一个内容块渲染到其中，而不是由列表创建自己的滚动器。传入元素本身，而不是 ref：父级的 ref 会在其子级的布局 effect 之后附加，因此在首次需要滚动器的提交中 ref 仍读取为 null，而 ref 变更对 React 不可见——它落地时不会重新渲染，也不会重新运行 effect；而放在 state 中的元素会让其到达成为一次渲染和真正的依赖（容器变化时会重建滚动监听器、观察和手势状态机）。在被动 effect 中读取它并保存在 state 中。在尚待定时传入 null（而不是 undefined）：undefined 意味着自有容器模式，在一个无界父级中提交一次该模式就会挂载每一行。",
    "endThreshold": "用户的滚动必须落在距底部多少像素以内才重新启用跟随最新消息；任何向上移动超过该值即为脱离。太紧的话，在视觉上停在底部的用户（触控板惯性、小数行高、页面缩放）会在输出于下方增长时悄悄停止跟随。",
    "overscanTop": "在视口上方保持挂载的额外像素行，用于在需要计算新窗口之前吸收向上滚动。",
    "overscanBottom": "在视口下方保持挂载的额外像素行。",
    "label": "列表创建的滚动容器的无障碍名称，键盘用户可以聚焦并滚动它。仅用于自有容器模式；在附加模式下调用方为自己的滚动器命名。",
    "style": "应用于列表创建的滚动容器。仅用于自有容器模式。",
    "className": "应用于列表创建的滚动容器。仅用于自有容器模式。"
  }
};

export const docsDense = {
  name: 'ChatVirtualizer',
  displayName: 'Chat Virtualizer',
  description:
    'windowed msg list; rows near viewport + 2 spacers => viewport-sized DOM for 1000s of msgs; rows in document flow; during a finger scroll corrections go to spacer height not scrollTop (nothing moves under the finger, settled when the scroll ends), otherwise scrollTop; follows newest by default, re-engages within endThreshold of bottom; own scroller or attach to caller (scrollElement)',
  propDescriptions: {
    data: 'rows oldest-first; REFERENCE change detection — replace, never mutate',
    getRowKey:
      'stable id per row; keys the size cache + running averages — never index-derived',
    renderItem:
      'renders one row; spacing MUST be padding inside the row, not container gap/margin',
    estimatedItemSize:
      'height for unmeasured rows (fn = authoritative); bias LOW — too large shrinks the range and the browser clamps you',
    handleRef:
      'scrollToDistanceFromBottomPx + anchorToKey; both DECLARE a frame, restored as rows measure in',
    getItemType:
      'per-type running averages; keeps tool stubs from blending with long markdown',
    scrollElement:
      "attach mode: caller's scroller, rows render in one content block; pass the ELEMENT not a ref (parent ref attaches after child layout effects + ref writes are invisible to React) — read it in a passive effect, hold it in state; null (not undefined) while pending, else one commit mounts every row",
    endThreshold:
      'px from bottom for a user scroll to re-engage follow; too tight = silent unfollow',
    overscanTop: 'px of rows mounted above the viewport',
    overscanBottom: 'px of rows mounted below the viewport',
    label:
      "name of the created scroller (keyboard-focusable group); default 'Messages'; own-container mode only",
    style: 'on the created scroller; own-container mode only',
    className: 'on the created scroller; own-container mode only',
  },
};
