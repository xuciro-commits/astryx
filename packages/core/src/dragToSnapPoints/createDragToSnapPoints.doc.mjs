// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'createDragToSnapPoints',
  displayName: 'createDragToSnapPoints',
  // A factory documented as a hook: listed with the utilities, beside its
  // hook, not as a tile in the components gallery.
  group: 'Utilities',
  keywords: [
    'drag',
    'snap',
    'snap points',
    'detents',
    'drawer',
    'flick',
    'swipe',
    'gesture',
    'vanilla',
    'factory',
  ],
  params: [
    {
      name: 'element',
      type: 'HTMLElement',
      description:
        'The element a drag moves. It moves along `axis` only, by translation, so lay it out at its resting position as usual.',
      required: true,
    },
    {
      name: 'options.axis',
      type: "'x' | 'y'",
      description: 'The axis the element moves along.',
      required: true,
    },
    {
      name: 'options.snapPoints',
      type: 'number[]',
      description:
        "Offsets in px along `axis` from the element's resting position, such as `[0, 240, 480]`, sorted before use (`onSettle` and `settleTo` count in that order); an empty list makes the drag do nothing. Unlike BottomSheet's `snapPoints`, they are not fractions of the viewport.",
      required: true,
    },
    {
      name: 'options.flickThreshold',
      type: 'number',
      description:
        "A release faster than this, in px/s, carries to the next snap point in its direction. The default is the flick speed measured for UIKit's sheet.",
      default: '1008',
      required: false,
    },
    {
      name: 'options.onSettle',
      type: '(index: number) => void',
      description:
        "Called with the snap point's index once the element settles on it, after a drag or `settleTo`. A settle that a new drag interrupts calls nothing.",
      required: true,
    },
  ],
  returns: [
    {
      name: 'settleTo',
      type: '(index: number) => void',
      description:
        'Settles the element on the snap point at `index` without a drag, then calls `onSettle`. Wire it to keys and buttons: it is the keyboard path. An index outside the snap points does nothing and warns in development.',
    },
    {
      name: 'destroy',
      type: '() => void',
      description:
        'Removes every listener and stops the element where it is. Call it when you remove the element.',
    },
  ],
  usage: {
    description:
      "Lets a drag move an element along one axis and settles it on snap points when the finger lifts, the way an iOS sheet settles on its detents: on the nearest snap point to where it is, on the next one in its direction after a quick flick, and back where it started when the finger was moving back. The settle continues the release's velocity. For a bottom sheet, use BottomSheet's `snapPoints`; for a scrolling row, Carousel's `hasSnap`. Use the `useDragToSnapPoints` hook in React.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Offer the same positions without a drag: buttons or keys that call `settleTo`.',
      },
      {
        guidance: true,
        description:
          'Keep the snap points few and far apart, so a release clearly picks one.',
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
  relatedHooks: ['useDragToSnapPoints', 'createPanGesture', 'createAnimator'],
  importPath: '@astryxdesign/core',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'A drag that settles an element on snap points (px offsets) at the release, without React.',
  paramDescriptions: {
    element: 'The element a drag moves.',
    'options.axis': "'x' or 'y'.",
    'options.snapPoints': 'Ascending px offsets from the resting position.',
    'options.flickThreshold':
      'px/s past which a release carries one snap point; 1008.',
    'options.onSettle': '(index) once settled.',
  },
  returnDescriptions: {
    settleTo: '(index) settles without a drag: the keyboard path.',
    destroy: '() removes every listener.',
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
  "name": "createDragToSnapPoints",
  "usage": {
    "description": "让拖动沿一个轴移动元素，并在手指抬起时将其停靠在吸附点上，就像 iOS 面板停靠在其 detent 上一样：停在离当前位置最近的吸附点；快速轻扫后沿其方向停到下一个吸附点；手指回移时返回起始位置。停靠会延续释放时的速度。底部面板请使用 BottomSheet 的 `snapPoints`；滚动行请使用 Carousel 的 `hasSnap`。在 React 中使用 `useDragToSnapPoints` Hook。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "提供无需拖动的相同位置：调用 `settleTo` 的按钮或按键。"
      },
      {
        "guidance": true,
        "description": "保持吸附点数量少且彼此相距较远，使释放时能明确选中一个。"
      },
      {
        "guidance": false,
        "description": "将其用于面板或轮播：它们自己的属性已经按用户预期的方式停靠。"
      }
    ],
    "accessibility": [
      {
        "name": "键盘和辅助技术",
        "category": "Keyboard",
        "criterion": "",
        "description": "拖动只是一种操作方式，绝不是唯一方式。为每个吸附点提供键盘和屏幕阅读器可到达的控件，例如 Expand 和 Collapse 按钮，并从中调用 `settleTo`。当位置改变元素显示的内容时，请播报该变化。"
      },
      {
        "name": "减少动态效果",
        "category": "Content",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "当用户要求减少动态效果时，触摸拖动后的停靠会变为向吸附点的短暂交叉淡化；在主指针为粗略指针的设备（如平板）上，任何停靠也是如此；在其他设备上用鼠标或笔拖动后则会立即落位。`settleTo` 在此类设备上会淡化，而在精细主指针下立即落位。手指按下期间，元素仍会跟随手指。"
      }
    ]
  },
  "paramDescriptions": {
    "element": "拖动所移动的元素。它仅沿 `axis` 通过平移移动，因此请像平常一样将其布局在静止位置。",
    "options.axis": "元素移动所沿的轴。",
    "options.snapPoints": "沿 `axis` 距元素静止位置的偏移量（px），例如 `[0, 240, 480]`，使用前会排序（`onSettle` 和 `settleTo` 按该顺序计数）；空列表使拖动不执行任何操作。与 BottomSheet 的 `snapPoints` 不同，它们不是视口的比例。",
    "options.flickThreshold": "超过此速度（px/s）的释放会滑向该方向的下一个吸附点。默认值为针对 UIKit 面板测得的轻扫速度。",
    "options.onSettle": "元素停靠到吸附点后，以该吸附点的索引调用，无论是拖动还是 `settleTo`。被新拖动中断的停靠不会调用任何内容。"
  },
  "returnDescriptions": {
    "settleTo": "无需拖动即可将元素停靠在 `index` 处的吸附点上，然后调用 `onSettle`。将其连接到按键和按钮：它是键盘路径。吸附点之外的索引不执行任何操作，并在开发环境中发出警告。",
    "destroy": "移除每个监听器并让元素停在当前位置。移除元素时调用它。"
  }
};
