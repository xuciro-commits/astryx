// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'createAnimator',
  displayName: 'createAnimator',
  // A factory documented as a hook: listed with the utilities, beside its
  // hook, not as a tile in the components gallery.
  group: 'Utilities',
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
    'vanilla',
    'factory',
  ],
  params: [
    {
      name: 'element',
      type: 'HTMLElement',
      description:
        'The element to animate. The animator writes its `translate`, `scale`, `rotate` and `opacity`, and while it moves an inline `will-change` for them, merged with any it already has and restored 500 ms after its last motion; nothing else, so lay it out and style it as usual. Use one animator per element: two on one element overwrite each other.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'animate',
      type: '(target: {x?, y?, scale?, rotate?, opacity?}, options?: {velocity?}) => Promise<void>',
      description:
        "Springs the given channels to `target` from wherever they are on screen, on the state-change motion Astryx's components use, and resolves when they arrive (or as soon as a later call takes them over). `x` and `y` are px, `scale` is 1 at the element's size, `rotate` is degrees and `opacity` runs from 0 to 1. Pass `velocity` (units per second, such as a drag's release velocity) to start with it; without it a channel keeps the velocity it has on screen, so interrupting a motion never jumps.",
    },
    {
      name: 'decay',
      type: '(velocity: {x?, y?, scale?, rotate?, opacity?}) => Promise<void>',
      description:
        "Coasts the given channels from a release velocity in their units per second, slowing as a scroll view's momentum does, and resolves when they stop (or as soon as a later call takes any of them over); opacity stops at 0 or 1. The distance follows from the velocity: use it to fling something away, then remove or reset it.",
    },
    {
      name: 'set',
      type: '(values: {x?, y?, scale?, rotate?, opacity?}) => void',
      description:
        'Puts the given channels at these values at once, ending their motion: follow a finger with it, frame by frame.',
    },
    {
      name: 'get',
      type: '() => {x, y, scale, rotate, opacity}',
      description: "Every channel's value on screen now.",
    },
    {
      name: 'getVelocity',
      type: '() => {x, y, scale, rotate, opacity}',
      description:
        "Every channel's velocity on screen now, in units per second.",
    },
    {
      name: 'stop',
      type: '() => void',
      description: 'Halts every channel where it is on screen.',
    },
    {
      name: 'destroy',
      type: '() => void',
      description:
        'Stops every motion and lets the element go; the element keeps the values it shows. Call it when you remove the element or no longer animate it.',
    },
  ],
  usage: {
    description:
      "Animates one element with the motion Astryx's own components use, without React. `animate` springs an element to new values on the state-change motion, `decay` flings it with the momentum of a released scroll view, and `set` moves it directly, so a card can follow a finger, snap back and be thrown away. Use the `useAnimator` hook in React. To animate an area's layout as its items change, use `useAnimatedLayout`; for what a component already animates, such as a sheet's detents or a carousel's snapping, use the component's own props.",
    bestPractices: [
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
        guidance: true,
        description:
          '`await` the promise before removing an element you animate out, and call `destroy` once it is gone.',
      },
      {
        guidance: false,
        description:
          'Read the element\u2019s position from layout while it moves: `get` gives the value on screen, wherever the motion runs.',
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
  relatedHooks: ['useAnimator', 'useAnimatedLayout'],
  importPath: '@astryxdesign/core',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Animates one element (x, y, scale, rotate, opacity) with Astryx's motion, without React.",
  paramDescriptions: {
    element: 'The element to animate; one animator per element.',
  },
  returnDescriptions: {
    animate:
      '(target, {velocity?}) => Promise<void>; springs on the state-change motion.',
    decay:
      '({x?, y?, scale?, rotate?, opacity?}) => Promise<void>; coasts from a release velocity.',
    set: '(values) => void; jumps, ending motion.',
    get: '() => every value on screen.',
    getVelocity: '() => every velocity on screen.',
    stop: '() => void; halts where it is.',
    destroy: '() => void; lets the element go.',
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
        description: 'Read layout for the position mid-motion; use get.',
      },
    ],
  },
};

export const docsZh = {
  "name": "createAnimator",
  "usage": {
    "description": "无需 React，即可使用 Astryx 自身组件所用的动效来为一个元素添加动画。`animate` 会以状态变化动效将元素弹跳到新值，`decay` 会以释放滚动的惯性甩出元素，`set` 则直接移动元素，因此卡片可以跟随手指、回弹并被甩开。在 React 中使用 `useAnimator` Hook。要在项目变化时为某个区域的布局添加动画，请使用 `useAnimatedLayout`；对于组件本身已有的动画（例如抽屉的档位或轮播的吸附），请使用组件自身的属性。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "每次跟随拖拽的 `animate` 都应以释放速度开始，让元素延续被甩出时的运动。"
      },
      {
        "guidance": true,
        "description": "动画所展示的每个状态，也都要能在无动画的情况下到达：例如一个按键、按钮或菜单项调用同一段代码。"
      },
      {
        "guidance": true,
        "description": "移除要动画退出的元素前先 `await` 其 Promise，元素消失后调用 `destroy`。"
      },
      {
        "guidance": false,
        "description": "元素移动时从布局读取其位置：`get` 返回屏幕上的值，无论动效在哪里运行。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘和辅助技术",
        "category": "Keyboard",
        "criterion": "",
        "description": "动画器只是移动元素，并不会增加可操作的方式。为动画所代表的每个操作提供一个键盘和屏幕阅读器都能访问的控件，例如一个丢弃卡片的按钮，并让它调用 `animate`；在减少动态效果下，`animate` 会变为原地淡出。`decay` 仅用于用户主动甩出的操作：减少动态效果下仍保留滑行惯性，因为它延续的是这次甩出。将焦点保留在仍留在屏幕上的元素上：在甩走其元素之前先移动焦点。"
      },
      {
        "name": "减少动态效果",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "当用户要求减少动态效果时，每次调用都会为其重新规划。在触摸屏上，移动或缩放会变成短暂的透明度交叉淡化：元素在原处淡出，并在落点处淡入。使用鼠标时则立即到达。对 `x` 和 `y` 的衰减会保留惯性，因为它延续的是用户做出的甩出；对 `scale`、`rotate` 或 `opacity` 的衰减则按移动的方式重新规划。没有选项可以关闭此行为。"
      }
    ]
  },
  "paramDescriptions": {
    "element": "要添加动画的元素。动画器会写入其 `translate`、`scale`、`rotate` 和 `opacity`，并在移动期间为它们写入内联 `will-change`，与元素已有的 `will-change` 合并，并在最后一次运动 500 ms 后恢复；除此之外不写入其他内容，因此可照常布局和设置样式。每个元素只使用一个动画器：同一元素上的两个动画器会互相覆盖。"
  },
  "returnDescriptions": {
    "animate": "以 Astryx 组件使用的状态变化动效，将指定通道从屏幕上的当前位置弹跳到 `target`，并在到达时（或被后续调用接管时）resolve。`x` 和 `y` 的单位是 px，`scale` 在元素原始尺寸时为 1，`rotate` 的单位是度，`opacity` 从 0 到 1。传入 `velocity`（单位/秒，例如拖拽的释放速度）可从此速度开始；不传时，通道会保留其在屏幕上的速度，因此中断动效不会跳变。",
    "decay": "以释放速度（各通道的单位/秒）让指定通道滑行，像滚动视图的惯性那样逐渐减速，并在停止时（或被后续调用接管任一通道时）resolve；透明度会在 0 或 1 处停止。距离由速度决定：可用它来甩开某物，然后移除或重置。",
    "set": "立即将指定通道设为此值，并结束其运动：可逐帧用它跟随手指。",
    "get": "当前每个通道在屏幕上的值。",
    "getVelocity": "当前每个通道在屏幕上的速度，单位为每秒。",
    "stop": "让每个通道停在当前屏幕位置。",
    "destroy": "停止所有运动并释放元素；元素会保留其当前显示的值。在移除元素或不再为其添加动画时调用。"
  }
};
