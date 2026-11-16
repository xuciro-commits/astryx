// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'usePanGesture',
  displayName: 'usePanGesture',
  keywords: [
    'pan',
    'drag',
    'gesture',
    'touch',
    'swipe',
    'translation',
    'velocity',
    'pointer',
    'createPanGesture',
    'uikit',
  ],
  params: [
    {
      name: 'ref',
      type: 'RefObject<Element | null>',
      description:
        'The element to drag. The hook creates one pan for the element behind the ref, creates a new one when the ref moves to another node or `axis` changes, and destroys it at unmount; a drag in progress then ends without a `cancelled` event, since an effect never calls `onPan`.',
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
        'Limits the drag to one axis. A drag along the other axis is not reported, and that component of every value reads 0. Omit it to report both axes.',
      required: false,
    },
    {
      name: 'options.onPan',
      type: '(event: PanGestureEvent) => void',
      description:
        "Called with `{state, translation, velocity}` as the drag begins, changes, ends at the release, or is cancelled. `state` is 'began', 'changed', 'ended' or 'cancelled'. `translation` is the movement since the drag began, in pixels: the travel the drag needed to begin is not part of it, so an element that follows it does not jump. `velocity` is in pixels per second; at 'ended' it is the release velocity (0 when the finger rested before lifting), and at 'cancelled' it is 0. Read through a ref: a new function each render re-creates nothing.",
      required: true,
    },
  ],
  returns: [
    {
      name: 'void',
      type: 'void',
      description:
        'Nothing: the hook hands out no recognizer. Without React, `createPanGesture(element, options)` takes the same options and returns `{destroy}`, which removes every listener it added and cancels a drag in progress.',
    },
  ],
  usage: {
    description:
      'Reports a drag on an element as values, for a surface the product moves itself: a card that follows the finger, a drawer pulled by its handle. A finger, a mouse and a pen all drive it. A mouse or pen drag that starts on selectable text selects that text, and the pan reports nothing. Give that text `user-select: none`. The drag claims its touch at UIKit’s 10 pt, as `UIPanGestureRecognizer` does, so a tap stays a tap, and a press or a long press is never reported as a pan. With `axis`, a scroll across that axis that starts on the element stays the page’s; without it, the pan takes a drag in any direction, so a finger’s scroll that starts on the element moves the element instead of the page. A trackpad scroll still scrolls the page. The hook is a thin layer over `createPanGesture`, the same API for code without React. A drag has no keyboard or assistive-technology path of its own: whatever the drag does needs another way to do it, such as buttons or arrow keys (WCAG 2.5.7). The pan moves nothing itself, so Reduce Motion applies to the motion you drive from it: honor the user’s reduced-motion setting in the animation that moves the element. Where a component already offers the behavior, use its prop instead: BottomSheet’s `snapPoints`, Carousel’s `hasSnap`.',
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
          'Give every drag another way to do the same thing from a keyboard and from assistive technology, such as buttons, arrow keys or a menu.',
      },
      {
        guidance: true,
        description:
          "Use a component's own prop when it covers the job: BottomSheet's `snapPoints` for a sheet, Carousel's `hasSnap` for paging.",
      },
      {
        guidance: false,
        description:
          'Hold the drag offset in a large component’s state: each `changed` event renders the component that holds it.',
      },
      {
        guidance: false,
        description:
          'Recognize taps or long presses with it; `useLongPress` and the components’ own press handling own those.',
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
  relatedComponents: ['BottomSheet', 'Carousel'],
  relatedHooks: ['useLongPress', 'createPanGesture'],
  importPath: '@astryxdesign/core/hooks',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Reports a drag as values ({state, translation, velocity}) for a surface you move yourself; a finger, a mouse and a pen all drive it, though a mouse or pen drag on selectable text selects it instead (give that text user-select: none). Claims at UIKit’s 10 pt; taps, presses and long presses are never a pan, and with axis a scroll across it stays the page’s. Thin layer over createPanGesture(element, options) → {destroy}. No keyboard path of its own: give the drag another way (WCAG 2.5.7). Reduce Motion: honor it in the animation you drive. Prefer BottomSheet snapPoints / Carousel hasSnap when they fit.',
  paramDescriptions: {
    ref: 'element to drag; one pan per node, re-created when the ref moves, destroyed at unmount.',
    options: 'config object.',
    'options.axis':
      "'x' | 'y': limit to one axis; the other is never reported and reads 0.",
    'options.onPan':
      "({state, translation, velocity}): state 'began' | 'changed' | 'ended' | 'cancelled'; translation px since the drag began (threshold travel excluded, no jump); velocity px/s, release velocity at 'ended', 0 at 'cancelled'. Read through a ref.",
  },
  returnDescriptions: {
    void: 'nothing (no recognizer). createPanGesture returns {destroy}: removes every listener, cancels a drag in progress.',
  },
  usage: {
    description:
      'Drag as values for a card, a drawer handle, any surface you move. Thin layer over createPanGesture. No keyboard path of its own (WCAG 2.5.7); Reduce Motion applies to what you animate. Prefer component props (BottomSheet snapPoints, Carousel hasSnap).',
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
        description:
          'Give every drag a keyboard and assistive-technology alternative.',
      },
      {
        guidance: true,
        description: "Use a component's own prop when it covers the job.",
      },
      {
        guidance: false,
        description: 'Hold the drag offset in a large component’s state.',
      },
      {guidance: false, description: 'Recognize taps or long presses with it.'},
    ],
  },
};

export const docsZh = {
  "name": "usePanGesture",
  "usage": {
    "description": "将元素上的拖拽以数值形式报告，供产品自行移动的表面使用：跟随手指的卡片、通过手柄拉动的抽屉。手指、鼠标和触控笔都可驱动。从可选文本上开始的鼠标或触控笔拖拽会选中该文本，而平移不报告任何内容。请为该文本设置 `user-select: none`。该拖拽按 UIKit 的 10 pt 认领触摸，与 `UIPanGestureRecognizer` 一样，因此点按仍是点按，按压或长按绝不会被报告为平移。使用 `axis` 时，从该元素开始、跨该轴的滚动仍归属于页面；不使用它时，平移会接管任意方向的拖拽，因此从元素开始的手指滚动会移动元素而不是页面。触控板滚动仍会滚动页面。该 Hook 是 `createPanGesture` 之上的薄层，后者为不使用 React 的代码提供相同 API。拖拽本身没有键盘或辅助技术路径：拖拽所做的任何事都需要另一种方式来完成，例如按钮或方向键（WCAG 2.5.7）。平移本身不移动任何内容，因此“减少动态效果”适用于由它驱动的运动：在移动元素的动画中遵循用户的“减少动态效果”设置。如果组件已提供该行为，请改用其属性：BottomSheet 的 `snapPoints`、Carousel 的 `hasSnap`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "从 `translation` 加上拖拽开始时的位置来移动元素，使其从拖拽被认领的那一刻起就跟随手指。"
      },
      {
        "guidance": true,
        "description": "在 `ended` 时，将 `velocity` 交给使元素停稳的动画，让轻扫以释放时的速度继续。"
      },
      {
        "guidance": true,
        "description": "为每次拖拽提供键盘和辅助技术的等价操作方式，例如按钮、方向键或菜单。"
      },
      {
        "guidance": true,
        "description": "当组件自身的属性可以完成工作时就使用它：BottomSheet 的 `snapPoints` 用于抽屉，Carousel 的 `hasSnap` 用于分页。"
      },
      {
        "guidance": false,
        "description": "将拖拽偏移保存在大型组件的 state 中：每个 `changed` 事件都会重新渲染持有它的组件。"
      },
      {
        "guidance": false,
        "description": "用它识别点按或长按；`useLongPress` 和组件自身的按压处理负责这些。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘与辅助技术",
        "category": "Keyboard",
        "criterion": "2.5.7 Dragging Movements",
        "description": "拖拽本身没有键盘或辅助技术路径：拖拽所做的任何事都需要另一种方式来完成，例如按钮、方向键或菜单。"
      },
      {
        "name": "减少动态效果",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "平移本身不移动任何内容，因此“减少动态效果”适用于由它驱动的运动：当用户要求减少动态效果时，停稳或抛出动画会直接到达终点而不产生位移。"
      }
    ]
  },
  "paramDescriptions": {
    "ref": "要拖拽的元素。该 Hook 会为 ref 背后的元素创建一个平移手势；当 ref 移到另一个节点或 `axis` 变化时创建新的手势，并在卸载时销毁；此时进行中的拖拽会结束且不会触发 `cancelled` 事件，因为 effect 从不调用 `onPan`。",
    "options": "配置对象。",
    "options.axis": "将拖拽限制在一个轴上。沿另一个轴的拖拽不会被报告，且每个值中该轴的分量读取为 0。省略则报告两个轴。",
    "options.onPan": "在拖拽开始、变化、释放结束或被取消时，以 `{state, translation, velocity}` 调用。`state` 为 'began'、'changed'、'ended' 或 'cancelled'。`translation` 是自拖拽开始以来的位移（像素）：拖拽启动所需的行程不包含在内，因此跟随它的元素不会跳动。`velocity` 单位为像素/秒；在 'ended' 时是释放速度（手指停留后抬起则为 0），在 'cancelled' 时为 0。通过 ref 读取：每次渲染都新建函数不会重新创建任何东西。"
  },
  "returnDescriptions": {
    "void": "没有返回值：该 Hook 不发出识别器。不使用 React 时，`createPanGesture(element, options)` 接受相同选项并返回 `{destroy}`，它会移除添加的所有监听器并取消进行中的拖拽。"
  }
};
