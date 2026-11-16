// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useLongPress',
  displayName: 'useLongPress',
  keywords: [
    'long press',
    'touch',
    'press and hold',
    'context menu',
    'mobile',
    'ios',
    'safari',
    'gesture',
    'tap',
  ],
  params: [
    {
      name: 'options',
      type: 'UseLongPressOptions',
      description: 'Configuration object.',
      required: true,
    },
    {
      name: 'options.onLongPress',
      type: '(point: {x: number; y: number}) => void',
      description:
        'Fired with the touch start point once the press is held for delayMs.',
      required: true,
    },
    {
      name: 'options.disabled',
      type: 'boolean',
      description: 'When true, the returned touch handlers are inert.',
      default: 'false',
    },
    {
      name: 'options.delayMs',
      type: 'number',
      description: 'Hold duration before the press fires, in milliseconds.',
      default: '500',
    },
    {
      name: 'options.moveCancelPx',
      type: 'number',
      description:
        'Movement past this distance on either axis cancels the press, treating it as a scroll or drag.',
      default: '10',
    },
  ],
  returns: [
    {
      name: 'handlers',
      type: 'UseLongPressHandlers',
      description:
        'onTouchStart, onTouchMove, onTouchEnd and onTouchCancel to spread onto the target element.',
    },
  ],
  usage: {
    description:
      'Detects a single-finger press-and-hold and reports where it happened, so touch users can reach affordances that a pointer gets from right-click. iOS Safari never synthesizes a contextmenu event on long-press, which makes this the only touch route into a cursor-positioned surface such as ContextMenu. The press cancels on movement, lift, multi-touch or unmount. The hold is timed on the touch events\u2019 own timestamps: when a busy page handles the lift late, a finger held for the full delay still reports its long press, before the lift acts.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the reported point to position the surface you open, so it appears under the finger.',
      },
      {
        guidance: true,
        description:
          'Pair it with the pointer contextmenu handler rather than replacing it; this hook only covers touch.',
      },
      {
        guidance: false,
        description:
          'Use it for the primary action of a control; press-and-hold is undiscoverable as the only way to do something.',
      },
    ],
  },
  relatedComponents: ['ContextMenu'],
  relatedHooks: ['useClickableContainer', 'useHotkeys'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Single-finger press-and-hold detection reporting the touch point. iOS Safari never fires contextmenu on long-press, so this is the only touch route to cursor-positioned surfaces. Cancels on move / lift / multi-touch / unmount.',
  paramDescriptions: {
    options: 'config.',
    'options.onLongPress': 'fired w/ touch start point after delayMs.',
    'options.disabled': 'true = handlers inert.',
    'options.delayMs': 'hold duration before firing, ms.',
    'options.moveCancelPx':
      'movement past this (px, either axis) cancels as scroll / drag.',
  },
  returnDescriptions: {
    handlers:
      'onTouchStart / onTouchMove / onTouchEnd / onTouchCancel to spread onto the element.',
  },
  usage: {
    description:
      "Touch press-and-hold for affordances a pointer reaches by right-click (e.g. ContextMenu). Reports the point so the surface opens under the finger. Timed on the touch events' timestamps: a busy page delays the report, never drops it.",
    bestPractices: [
      {
        guidance: true,
        description: 'Position the opened surface at the reported point.',
      },
      {
        guidance: true,
        description:
          'Pair w/ pointer contextmenu handler; this covers touch only.',
      },
      {
        guidance: false,
        description:
          'Make press-and-hold the only way to reach an action; it is undiscoverable.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useLongPress",
  "usage": {
    "description": "检测单指长按并报告发生位置，让触屏用户也能使用指针用户通过右键获得的交互能力。iOS Safari 从不因长按合成 contextmenu 事件，因此这是进入 ContextMenu 这类光标定位浮层的唯一触屏途径。移动、抬起、多指触摸或卸载都会取消按压。长按时长依据触摸事件自身的时间戳计时：当繁忙页面延迟处理抬起时，按满延时的手指仍会先报告长按，随后才执行抬起动作。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用报告的位置来定位要打开的浮层，使其出现在手指下方。"
      },
      {
        "guidance": true,
        "description": "将其与指针的 contextmenu 处理函数配合使用，而不是替换它；此 Hook 只覆盖触摸。"
      },
      {
        "guidance": false,
        "description": "不要将其用于控件的主要操作；长按作为完成某事的唯一方式难以被发现。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "配置对象。",
    "options.onLongPress": "按压持续 delayMs 后触发，并传入触摸起点。",
    "options.disabled": "为 true 时，返回的触摸处理函数不起作用。",
    "options.delayMs": "触发长按前的按住时长，以毫秒为单位。",
    "options.moveCancelPx": "在任一轴上移动超过此距离会取消按压，将其视为滚动或拖动。"
  },
  "returnDescriptions": {
    "handlers": "可展开到目标元素上的 onTouchStart、onTouchMove、onTouchEnd 和 onTouchCancel。"
  }
};
