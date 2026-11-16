// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useDragToSnapPoints',
  displayName: 'useDragToSnapPoints',
  keywords: [
    'drag',
    'snap',
    'snap points',
    'detents',
    'drawer',
    'flick',
    'swipe',
    'gesture',
  ],
  params: [
    {
      name: 'ref',
      type: 'RefObject<HTMLElement | null>',
      description: 'A ref to the element a drag moves, along `axis` only.',
      required: true,
    },
    {
      name: 'options.axis',
      type: "'x' | 'y'",
      description:
        'The axis the element moves along. A new one creates the drag again, starting where the element is.',
      required: true,
    },
    {
      name: 'options.snapPoints',
      type: 'number[]',
      description:
        "Offsets in px along `axis` from the element's resting position, such as `[0, 240, 480]`, sorted before use (`onSettle` and `settleTo` count in that order); an empty list makes the drag do nothing. Unlike BottomSheet's `snapPoints`, they are not fractions of the viewport. New ones create the drag again and nothing more: the element stays where it is, a settle in flight included, and the next drag or `settleTo` starts there.",
      required: true,
    },
    {
      name: 'options.flickThreshold',
      type: 'number',
      description:
        "A release faster than this, in px/s, carries to the next snap point in its direction. The default is the flick speed measured for UIKit's sheet. A new one creates the drag again, as new snap points do.",
      default: '1008',
      required: false,
    },
    {
      name: 'options.onSettle',
      type: '(index: number) => void',
      description:
        "Called with the snap point's index once the element settles on it. The latest function is the one called, so it may be new on every render.",
      required: true,
    },
  ],
  returns: [
    {
      name: 'settleTo',
      type: '(index: number) => void',
      description:
        'Settles the element on the snap point at `index` without a drag: the keyboard path. The same function on every render.',
    },
  ],
  usage: {
    description:
      "Lets a drag move an element along one axis and settles it on snap points when the finger lifts, the way an iOS sheet settles on its detents: on the nearest snap point to where it is, on the next one in its direction after a quick flick, and back where it started when the finger was moving back. The settle continues the release's velocity. For a bottom sheet, use BottomSheet's `snapPoints`; for a scrolling row, Carousel's `hasSnap`. Outside React, use `createDragToSnapPoints`.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Offer the same positions without a drag: buttons or keys that call `settleTo`.',
      },
      {
        guidance: true,
        description:
          'Keep the settled index in state from `onSettle`, and render what the position means from it.',
      },
      {
        guidance: false,
        description:
          'Use it for a sheet or a carousel: their own props already settle the way people expect.',
      },
    ],
    accessibility: [
      {
        name: 'Keyboard and assistive technology',
        category: 'Keyboard',
        description:
          'A drag is one way in, never the only one. Give each snap point a control a keyboard and a screen reader can reach, such as Expand and Collapse buttons, and call `settleTo` from it. When a position changes what the element shows, announce the change.',
      },
      {
        name: 'Reduce Motion',
        category: 'Content',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'When the person asks for reduced motion, the settle after a touch drag becomes a short cross-fade into the snap point, as does any settle on a device whose primary pointer is coarse, such as a tablet; after a mouse or pen drag elsewhere it lands at once. `settleTo` fades on such a device and lands at once with a fine primary pointer. While the finger is down, the element still follows it.',
      },
    ],
  },
  relatedComponents: ['BottomSheet', 'Carousel'],
  relatedHooks: ['usePanGesture', 'useAnimator'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'A drag that settles the element at ref on snap points (px offsets): {settleTo}.',
  paramDescriptions: {
    ref: 'Ref to the dragged element.',
    'options.axis': "'x' or 'y'.",
    'options.snapPoints': 'Ascending px offsets from the resting position.',
    'options.flickThreshold':
      'px/s past which a release carries one snap point; 1008.',
    'options.onSettle': '(index) once settled; latest one is called.',
  },
  returnDescriptions: {
    settleTo: '(index) settles without a drag; stable.',
  },
  usage: {
    description:
      'Nearest snap point, the next on a flick, the start when moving back; the settle keeps the release velocity. Sheets and carousels: use their props.',
    bestPractices: [
      {guidance: true, description: 'Wire settleTo to buttons and keys.'},
      {guidance: false, description: 'Rebuild a sheet or carousel with it.'},
    ],
  },
};

export const docsZh = {
  "name": "useDragToSnapPoints",
  "usage": {
    "description": "让拖动沿单轴移动元素，并在手指抬起时将其停靠在吸附点上，就像 iOS 表单在其 detent 上停靠：停在离当前位置最近的吸附点、快速轻扫后停在其方向上的下一个吸附点，而手指回移时则回到起始位置。停靠会延续释放时的速度。底部表单请使用 BottomSheet 的 `snapPoints`；可滚动行请使用 Carousel 的 `hasSnap`。在 React 之外，请使用 `createDragToSnapPoints`。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "也提供不使用拖动的相同位置：调用 `settleTo` 的按钮或按键。"
      },
      {
        "guidance": true,
        "description": "在状态中通过 `onSettle` 保留停靠后的索引，并据此渲染该位置的含义。"
      },
      {
        "guidance": false,
        "description": "不要将其用于表单或轮播：它们自己的属性已经按人们预期的方式停靠。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘与辅助技术",
        "category": "Keyboard",
        "criterion": "",
        "description": "拖动只是其中一种方式，绝不是唯一方式。为每个吸附点提供一个键盘和屏幕阅读器可到达的控件，例如展开和收起按钮，并从该控件调用 `settleTo`。当位置改变元素显示的内容时，请播报该变化。"
      },
      {
        "name": "减少动态效果",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "当用户要求减少动态效果时，触摸拖动后的停靠会变为短交叉淡入到吸附点；在主指针为粗粒度的设备（例如平板）上，任何停靠也会如此；而在其他设备上用鼠标或触控笔拖动后则会立即落位。`settleTo` 在此类设备上会淡入，在主指针为细粒度时则立即落位。手指按下期间，元素仍会跟随手指。"
      }
    ]
  },
  "paramDescriptions": {
    "ref": "指向被拖动元素的 ref，仅在 `axis` 方向上移动。",
    "options.axis": "元素移动所沿的轴。传入新值会重新创建拖动，并从元素当前位置开始。",
    "options.snapPoints": "沿 `axis` 距元素静止位置的偏移量（px），例如 `[0, 240, 480]`，使用前会排序（`onSettle` 和 `settleTo` 按该顺序计数）；空列表会使拖动不执行任何操作。与 BottomSheet 的 `snapPoints` 不同，它们不是视口的比例。传入新值只会重新创建拖动，不会做其他事：元素保持原位（包括进行中的停靠），下一次拖动或 `settleTo` 会从那里开始。",
    "options.flickThreshold": "释放速度快于该值（px/s）时，会沿其方向移动到下一个吸附点。默认值是 UIKit 表单测得的轻扫速度。传入新值会像新吸附点一样重新创建拖动。",
    "options.onSettle": "元素停靠到吸附点后，以该吸附点的索引调用。调用的是最新函数，因此它可能在每次渲染时都是新的。"
  },
  "returnDescriptions": {
    "settleTo": "在不拖动的情况下将元素停靠到 `index` 处的吸附点：键盘路径。每次渲染都是同一个函数。"
  }
};
