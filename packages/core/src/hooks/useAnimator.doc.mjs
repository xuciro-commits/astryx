// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useAnimator',
  displayName: 'useAnimator',
  keywords: [
    'animate',
    'animation',
    'animator',
    'spring',
    'decay',
    'momentum',
    'fling',
    'motion',
    'transform',
    'opacity',
    'drag',
    'card',
  ],
  params: [
    {
      name: 'ref',
      type: 'RefObject<HTMLElement | null>',
      description:
        'The ref of the one element to animate, the same ref you pass to the element: another hook, such as a gesture hook, can take it too, so a drag and an animation share one element. After every render the animator follows the element behind it. When the element unmounts its motion stops and its values return to rest, so a remount starts at rest, and so does a node that replaces it. Before the element mounts, and while it is unmounted, every call does nothing and `animate` and `decay` resolve at once.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'animator',
      type: 'AnimatorHandle',
      description:
        "The element's animator, the same object on every render: `animate(target, {velocity?})` springs channels to a target on the state-change motion Astryx's components use, `decay(velocity)` coasts them from a release velocity, `set(values)` jumps them, `get()` and `getVelocity()` read them, and `stop()` halts them. The channels are `x` and `y` (px), `scale` (1 at the element's size), `rotate` (degrees) and `opacity` (0 to 1). `animate` and `decay` return a promise that resolves when the motion ends. Calling it never re-renders the component. Calls before the ref attaches do nothing and resolve at once.",
    },
  ],
  usage: {
    description:
      "Animates one element with the motion Astryx's own components use. Call `animator.animate` to spring an element to new values on the state-change motion, `animator.decay` to fling it with the momentum of a released scroll view, and `animator.set` to move it directly, so a card can follow a finger, snap back and be thrown away. To animate an area's layout as its items change, use `useAnimatedLayout`; for what a component already animates, such as a sheet's detents or a carousel's snapping, use the component's own props. Outside React, use `createAnimator`.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Call the animator from event handlers and effects: it lives outside render, so animating never re-renders the component.',
      },
      {
        guidance: true,
        description:
          'Start every `animate` that follows a drag with the release velocity, so the element carries on as it was thrown.',
      },
      {
        guidance: true,
        description:
          'Reach every state an animation shows without the animation too: a key, a button or a menu item that calls the same code.',
      },
      {
        guidance: false,
        description:
          'Keep the animated values in React state: read them with `animator.get()` when you need them.',
      },
    ],
    accessibility: [
      {
        name: 'Keyboard and assistive technology',
        category: 'Keyboard',
        description:
          'An animator moves an element; it adds no way to act. Give every action an animation stands for a control a keyboard and a screen reader can reach, such as a button that discards a card, and have it call `animate`, which Reduce Motion turns into a fade in place. Keep `decay` for a throw the person made: Reduce Motion keeps the momentum of a coast, as it continues that throw. Keep focus on an element that stays on screen: move it before you fling its element away.',
      },
      {
        name: 'Reduce Motion',
        category: 'Content',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'When the person asks for reduced motion, every call is planned for them. On a touch screen a move or a scale becomes a short opacity cross-fade: the element fades out where it was and fades back in where it lands. With a mouse it lands at once. A decay of `x` and `y` keeps its momentum, as it continues the throw the person made; a decay of `scale`, `rotate` or `opacity` is planned like a move. No option turns this off.',
      },
    ],
  },
  relatedHooks: ['useAnimatedLayout'],
  importPath: '@astryxdesign/core/hooks',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Animates the element behind ref (x, y, scale, rotate, opacity) with Astryx's motion; returns the animator.",
  paramDescriptions: {
    ref: 'The element ref; share it with a gesture hook to drag and animate one element.',
  },
  returnDescriptions: {
    animator:
      'animate(target, {velocity?}), decay(velocity), set, get, getVelocity, stop; stable, never re-renders.',
  },
  usage: {
    description:
      'Spring with animate, fling with decay, follow a finger with set. Reduce Motion: a cross-fade on touch, at once with a mouse; decay keeps its momentum.',
    bestPractices: [
      {
        guidance: true,
        description: 'Pass the release velocity to animate after a drag.',
      },
      {
        guidance: false,
        description: 'Keep animated values in state; read animator.get().',
      },
    ],
  },
};

export const docsZh = {
  "name": "useAnimator",
  "usage": {
    "description": "使用 Astryx 自身组件所用的动效为一个元素添加动画。调用 `animator.animate` 让元素以状态变化动效弹性过渡到新值，调用 `animator.decay` 以释放的滚动视图的动量甩动它，调用 `animator.set` 直接移动它，因此卡片可以跟随手指、回弹并被甩开。要在项目变化时对区域的布局添加动画，请使用 `useAnimatedLayout`；对于组件已经内置的动画（例如工作表的分段停靠或轮播的吸附），请使用组件自身的属性。在 React 之外，请使用 `createAnimator`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在事件处理函数和 Effect 中调用 animator：它位于渲染之外，因此添加动画永远不会重新渲染组件。"
      },
      {
        "guidance": true,
        "description": "每次在拖动之后调用 `animate` 时都传入释放速度，让元素延续被甩出时的运动。"
      },
      {
        "guidance": true,
        "description": "动画展示的每种状态也必须能在没有动画的情况下到达：通过按键、按钮或菜单项调用相同的代码。"
      },
      {
        "guidance": false,
        "description": "不要将动画值保存在 React 状态中：需要时用 `animator.get()` 读取它们。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘和辅助技术",
        "category": "Keyboard",
        "criterion": "",
        "description": "Animator 只移动元素，不增加任何操作方式。请为动画代表的每个操作提供一个键盘和屏幕阅读器可触达的控件，例如一个丢弃卡片的按钮，并让它调用 `animate`，减少动效会将其变为原地淡入淡出。将 `decay` 保留给人发起的甩出：减少动效会保留滑行惯性，因为它是该甩出的延续。将焦点保持在仍留在屏幕上的元素上：在把其元素甩走之前先移动焦点。"
      },
      {
        "name": "减少动效",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "当用户要求减少动效时，每次调用都会按此规划。在触摸屏上，移动或缩放会变为短暂的透明度交叉淡入淡出：元素在原位置淡出，并在落点淡入。使用鼠标时则立即到达。`x` 和 `y` 的 decay 会保留其惯性，因为它延续了用户发起的甩出；`scale`、`rotate` 或 `opacity` 的 decay 则按移动来规划。没有任何选项可以关闭此行为。"
      }
    ]
  },
  "paramDescriptions": {
    "ref": "要添加动画的单个元素的 ref，与传给该元素的是同一个 ref：其他 Hook（例如手势 Hook）也可以使用它，因此拖动和动画共享同一个元素。每次渲染后，animator 会跟随其后的元素。当元素卸载时，其运动停止，值回到静止状态，因此重新挂载会从静止开始，替换它的节点也是如此。在元素挂载之前以及卸载期间，每次调用都不执行任何操作，`animate` 和 `decay` 会立即 resolve。"
  },
  "returnDescriptions": {
    "animator": "元素的 animator，在每次渲染中都是同一个对象：`animate(target, {velocity?})` 将各通道以 Astryx 组件使用的状态变化动效弹跳到目标值，`decay(velocity)` 从释放速度开始滑行，`set(values)` 直接跳变，`get()` 和 `getVelocity()` 读取它们，`stop()` 停止它们。通道为 `x` 和 `y`（px）、`scale`（元素尺寸时为 1）、`rotate`（度）和 `opacity`（0 到 1）。`animate` 和 `decay` 返回一个在运动结束时 resolve 的 Promise。调用它永远不会重新渲染组件。在 ref 附加之前的调用不执行任何操作并立即 resolve。"
  }
};
