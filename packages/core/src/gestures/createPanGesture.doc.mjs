// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'createPanGesture',
  displayName: 'createPanGesture',
  // A factory documented as a hook: listed with the utilities, beside its
  // hook, not as a tile in the components gallery.
  group: 'Utilities',
  keywords: [
    'pan',
    'drag',
    'gesture',
    'touch',
    'swipe',
    'translation',
    'velocity',
    'pointer',
    'vanilla',
    'factory',
  ],
  params: [
    {
      name: 'element',
      type: 'Element',
      description:
        'The element to drag. The pan writes the `touch-action` its axis needs on it and nothing else; it moves nothing itself.',
      required: true,
    },
    {
      name: 'options',
      type: 'PanGestureOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.axis',
      type: "'x' | 'y'",
      description:
        'Limits the drag to one axis. A drag along the other axis is not reported, and that component of every value reads 0, so a scroll across it stays the page’s. Omit it to report both axes; a finger’s scroll that starts on the element then moves the element instead of the page. A trackpad scroll still scrolls the page.',
      required: false,
    },
    {
      name: 'options.onPan',
      type: '(event: PanGestureEvent) => void',
      description:
        "Called with `{state, translation, velocity}` as the drag begins, changes, ends at the release, or is cancelled. `state` is 'began', 'changed', 'ended' or 'cancelled'. `translation` is the movement since the drag began, in pixels, without the travel the drag needed to begin, so an element that follows it does not jump. `velocity` is in pixels per second; at 'ended' it is the release velocity, 0 when the finger rested before lifting, and at 'cancelled' it is 0.",
      required: true,
    },
  ],
  returns: [
    {
      name: 'destroy',
      type: '() => void',
      description:
        'Removes every listener the pan added and its `touch-action`. A drag in progress is cancelled: `onPan` hears `cancelled`.',
    },
  ],
  usage: {
    description:
      "Reports a drag on an element as values, without React, for a surface the product moves itself: a card that follows the finger, a drawer pulled by its handle. A finger, a mouse and a pen all drive it. A mouse or pen drag that starts on selectable text selects that text, and the pan reports nothing. Give that text `user-select: none`. The drag claims its touch at UIKit’s 10 pt, as `UIPanGestureRecognizer` does, so a tap stays a tap and a press or a long press is never reported as a pan. Use the `usePanGesture` hook in React. Where a component already offers the behavior, use its prop instead: BottomSheet's `snapPoints`, Carousel's `hasSnap`. Its example is on the usePanGesture page: one draggable box, made once with the hook and once with createPanGesture.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Move the element from `translation` added to where it was when the drag began, so it moves with the finger from the moment the drag claims it.',
      },
      {
        guidance: true,
        description:
          'At `ended`, hand `velocity` to the animation that settles the element, so a flick carries on at the speed it was released.',
      },
      {
        guidance: true,
        description:
          'Call `destroy` when the element leaves the page, so no listener outlives it.',
      },
      {
        guidance: false,
        description:
          'Read the element’s layout on every `changed` event to place it; `translation` already says where the finger is.',
      },
    ],
    accessibility: [
      {
        name: 'Keyboard and assistive technology',
        category: 'Keyboard',
        criterion: '2.5.7 Dragging Movements',
        description:
          'A drag has no keyboard or assistive-technology path of its own: whatever the drag does needs another way to do it, such as buttons, arrow keys or a menu.',
      },
      {
        name: 'Reduce Motion',
        category: 'Content',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'The pan moves nothing itself, so Reduce Motion applies to the motion you drive from it: a settle or a throw goes to its end without travel when the person asks for reduced motion.',
      },
    ],
  },
  relatedHooks: ['usePanGesture'],
  importPath: '@astryxdesign/core',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Reports a drag on an element as values ({state, translation, velocity}), without React; a finger, a mouse and a pen all drive it, though a mouse or pen drag on selectable text selects it instead (give that text user-select: none). Returns {destroy}.',
  paramDescriptions: {
    element: 'element to drag; the pan writes only its touch-action.',
    options: 'config object.',
    'options.axis':
      "'x' | 'y': limit to one axis; the other is never reported and reads 0.",
    'options.onPan':
      "({state, translation, velocity}): state 'began' | 'changed' | 'ended' | 'cancelled'; translation px since the drag began (no jump); velocity px/s, release velocity at 'ended', 0 at 'cancelled'.",
  },
  returnDescriptions: {
    destroy:
      '() => void; removes every listener and the touch-action, cancels a drag in progress.',
  },
  usage: {
    description:
      'Drag as values without React, for a surface you move. Claims at UIKit’s 10 pt. No keyboard path of its own (WCAG 2.5.7); Reduce Motion applies to what you animate. Prefer component props (BottomSheet snapPoints, Carousel hasSnap); in React, usePanGesture.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Move from translation + the offset at began, so the element moves with the finger from the claim.',
      },
      {
        guidance: true,
        description: 'Hand the ended velocity to the settling animation.',
      },
      {
        guidance: true,
        description: 'Call destroy when the element leaves the page.',
      },
      {
        guidance: false,
        description: 'Read layout on every changed event; use translation.',
      },
    ],
  },
};

export const docsZh = {
  "name": "createPanGesture",
  "usage": {
    "description": "以值的形式报告元素上的拖动，不依赖 React，适用于产品自行移动的表面：跟随手指的卡片、通过手柄拉动的抽屉。手指、鼠标和触控笔都可以驱动它。从可选文本上开始的鼠标或触控笔拖动会选择该文本，平移不会报告任何内容。请为该文本设置 `user-select: none`。拖动在 UIKit 的 10 pt 处声明触摸，与 `UIPanGestureRecognizer` 的行为一致，因此轻点仍是轻点，按压或长按绝不会被报告为平移。在 React 中使用 `usePanGesture` Hook。如果组件已提供此行为，请改用其属性：BottomSheet 的 `snapPoints`、Carousel 的 `hasSnap`。其示例位于 usePanGesture 页面：一个可拖动框，分别用 Hook 和 createPanGesture 各创建一次。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将元素从拖动开始时的位置加上 `translation` 来移动，使元素从拖动声明的那一刻起就跟随手指。"
      },
      {
        "guidance": true,
        "description": "在 `ended` 时，将 `velocity` 交给使元素稳定下来的动画，让轻扫以释放时的速度继续。"
      },
      {
        "guidance": true,
        "description": "元素离开页面时调用 `destroy`，确保没有监听器比元素存活更久。"
      },
      {
        "guidance": false,
        "description": "每次 `changed` 事件都读取元素布局来放置它；`translation` 已经说明手指的位置。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘与辅助技术",
        "category": "Keyboard",
        "criterion": "2.5.7 Dragging Movements",
        "description": "拖动本身没有键盘或辅助技术路径：拖动所做的事情需要另一种完成方式，例如按钮、方向键或菜单。"
      },
      {
        "name": "减少动效",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "平移本身不移动任何东西，因此“减少动效”适用于你由它驱动的运动：当用户要求减少动效时，稳定或抛出动画会直接到达终点而不产生位移。"
      }
    ]
  },
  "paramDescriptions": {
    "element": "要拖动的元素。平移只在该元素上写入其轴所需的 `touch-action`，不写其他内容；它本身不移动任何东西。",
    "options": "配置对象。",
    "options.axis": "将拖动限制在一个轴上。沿另一轴的拖动不会被报告，所有值中该轴的分量都读作 0，因此跨该轴的滚动仍属于页面。省略此选项则报告两个轴；从元素上开始的手指滚动随后会移动元素而不是页面。触控板滚动仍然滚动页面。",
    "options.onPan": "在拖动开始、变化、释放结束或被取消时，以 `{state, translation, velocity}` 调用。`state` 为 'began'、'changed'、'ended' 或 'cancelled'。`translation` 是自拖动开始以来的位移（像素），不包含拖动启动所需的行程，因此跟随它的元素不会跳动。`velocity` 的单位是像素/秒；在 'ended' 时是释放速度，手指抬起前静止时为 0，在 'cancelled' 时为 0。"
  },
  "returnDescriptions": {
    "destroy": "移除平移添加的所有监听器及其 `touch-action`。进行中的拖动会被取消：`onPan` 会收到 `cancelled`。"
  }
};
