// Copyright (c) Meta Platforms, Inc. and affiliates.

/**
 * @file useScrollableArea.doc.mjs
 * @input Shared scroll hook's fixed and entry-time keyboard policies
 * @output Consumer guidance for named viewports and safe focus delegation
 * @position Hook documentation consumed by the CLI and docsite
 */

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useScrollableArea',
  displayName: 'useScrollableArea',
  keywords: [
    'scroll',
    'overflow',
    'logical axis',
    'keyboard',
    'overscroll',
    'sticky',
    'resize',
  ],
  params: [
    {
      name: 'options',
      type: 'UseScrollableAreaOptions',
      description:
        'Logical scroll intent, fixed or automatic keyboard owner, overscroll policy, and fitting Sticky containment.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'getViewportProps',
      type: '<E extends HTMLElement>(props?: ScrollableElementProps<E>) => ScrollableElementProps<E>',
      description:
        'Consumes caller viewport props, xstyle, and refs; composes fitting/active overflow, Sticky containment, accessibility, chaining, and owner registration.',
    },
    {
      name: 'getContentProps',
      type: '<E extends HTMLElement>(props?: ScrollableElementProps<E>) => ScrollableElementProps<E>',
      description:
        'Composes caller content-box props, xstyle, and refs with content observation.',
    },
    {
      name: 'state',
      type: 'ScrollableAreaState',
      description:
        'Stable inline and block effective-scroll and logical-edge state.',
    },
  ],
  usage: {
    description:
      'Adds canonical axis-aware scroll behavior to structure owned by the caller. An axis is effective only when its computed overflow is scroll-capable and geometry exceeds the shared 1px tolerance. Both viewport and content boxes are observed.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass already-resolved props and refs through both prop getters, then spread each returned object once.',
      },
      {
        guidance: true,
        description:
          'Use viewport keyboard ownership only when the viewport itself should enter the tab order; provide a concise accessible label.',
      },
      {
        guidance: true,
        description:
          'Use contentOrViewport to delegate forward Tab entry to the first sequential native link or button when it preserves native scroll keys. Inputs, composite widgets, and nested scroll areas retain the named viewport stop. Shift+Tab from the delegated first child skips the viewport; pointer and programmatic focus stay on it.',
      },
      {
        guidance: true,
        description:
          'Use content keyboard ownership when your integration already supplies keyboard access to the full scroll range. Automatic delegation checks current content at each keyboard entry without continuously tracking its focusability.',
      },
      {
        guidance: true,
        description:
          'Pass caller `xstyle` through `getViewportProps`; the getter composes it with fitting clip, active overflow, and Sticky containment.',
      },
      {
        guidance: true,
        description:
          'Give a viewport-owned tab stop a visible focus indicator; compose `focusOutlineStyles.focusVisible` (or an equivalent) into the viewport `xstyle`, as ScrollableArea does.',
      },
      {
        guidance: false,
        description:
          'Attach only the viewport getter. A real observed content box is required for live overflow changes.',
      },
      {
        guidance: false,
        description:
          'Declare overflow through caller props on the viewport; the getter owns overflow declarations and strips conflicting inline values.',
      },
    ],
  },
  relatedComponents: ['ScrollableArea'],
  relatedHooks: ['useScrollOverflow'],
  importPath: '@astryxdesign/core/hooks',
  category: 'layout',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Composes logical-axis scrolling into caller-owned viewport/content elements with stable effective-axis and edge state.',
  paramDescriptions: {
    options:
      'axis, fixed/automatic keyboard owner, allow/contain overscroll policy, and fitting Sticky containment.',
  },
  returnDescriptions: {
    getViewportProps:
      'safe viewport prop/ref/xstyle composition with behavior-owned overflow, accessibility, and chaining.',
    getContentProps: 'safe observed content-box prop/ref/xstyle composition.',
    state: 'inline/block isScrollable, atStart, and atEnd state.',
  },
  usage: {
    description:
      'Use for existing structures that need ScrollableArea behavior without another wrapper.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Spread each prop getter result once on its owner element.',
      },
      {guidance: false, description: 'Skip the real content-box getter.'},
    ],
  },
};

export const docsZh = {
  "name": "useScrollableArea",
  "usage": {
    "description": "为调用方拥有的结构添加规范的、感知轴的滚动行为。仅当某个轴的 computed overflow 可滚动且几何尺寸超过共享的 1px 容差时，该轴才生效。视口和内容盒子都会被观察。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将已解析的属性和 ref 通过两个属性 getter 传入，然后各展开一次返回的对象。"
      },
      {
        "guidance": true,
        "description": "仅当视口本身应进入 Tab 顺序时才使用视口键盘所有权；提供简洁的无障碍标签。"
      },
      {
        "guidance": true,
        "description": "当保留原生滚动按键时，使用 contentOrViewport 将向前 Tab 进入委托给第一个顺序原生链接或按钮。输入框、复合控件和嵌套滚动区域保留命名的视口停靠点。从被委托的第一个子元素按 Shift+Tab 会跳过视口；指针和程序化焦点仍停留在视口上。"
      },
      {
        "guidance": true,
        "description": "当你的集成已为完整滚动范围提供键盘访问时，使用内容键盘所有权。自动委托在每次键盘进入时检查当前内容，而不持续跟踪其可聚焦性。"
      },
      {
        "guidance": true,
        "description": "通过 `getViewportProps` 传入调用方的 `xstyle`；getter 会将其与适配裁剪、活动溢出和 Sticky 包含组合。"
      },
      {
        "guidance": true,
        "description": "为视口拥有的 Tab 停靠点提供可见的焦点指示器；将 `focusOutlineStyles.focusVisible`（或等效项）组合进视口 `xstyle`，就像 ScrollableArea 那样。"
      },
      {
        "guidance": false,
        "description": "只附加视口 getter。实时溢出变化需要真实观察的内容盒子。"
      },
      {
        "guidance": false,
        "description": "通过调用方属性在视口上声明 overflow；getter 拥有 overflow 声明，并会剥离冲突的内联值。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "逻辑滚动意图、固定或自动键盘所有者、过度滚动策略，以及适配的 Sticky 包含。"
  },
  "returnDescriptions": {
    "getViewportProps": "消费调用方视口属性、xstyle 和 ref；组合适配/活动溢出、Sticky 包含、无障碍、链式传递和所有者注册。",
    "getContentProps": "将调用方内容盒子属性、xstyle 和 ref 与内容观察组合。",
    "state": "稳定的行内和块向有效滚动及逻辑边缘状态。"
  }
};
