// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useEntryAnimation',
  displayName: 'useEntryAnimation',
  keywords: ['animation', 'entry', 'mount', 'transition', 'slide', 'fade', 'scale', 'motion', 'stylex'],
  params: [
    {
      name: 'preset',
      type: "'slideDown' | 'slideUp' | 'fadeIn' | 'scaleIn'",
      description: 'Animation preset to apply on mount.',
      default: "'slideDown'",
      required: false,
    },
  ],
  returns: [
    {
      name: 'entryStyle',
      type: 'StyleXStyles | null',
      description: 'A StyleX style object for the entry animation, or null if the element was rendered on initial page load or hydrated from server HTML (no animation needed).',
    },
  ],
  usage: {
    description:
      'Returns a StyleX style for animating an element on mount. Only animates when the element is dynamically inserted after the initial page paint; elements rendered on page load are not animated. Uses Astryx motion tokens (duration, easing) for consistent animation timing. Server-rendered elements hydrate without the entry style and never animate; elements mounted after hydration animate.',
    bestPractices: [
      { guidance: true, description: 'Use for conditionally rendered elements like validation messages, toasts, or expanding sections.' },
      { guidance: true, description: 'Spread the returned style into stylex.props() alongside other styles.' },
      { guidance: false, description: 'Use for elements that should be visible on initial page load; they will not animate.' },
    ],
  },
  relatedComponents: ['FieldStatus'],
  relatedHooks: [],
  importPath: '@astryxdesign/core/hooks',
  category: 'motion & gestures',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Returns StyleX style for animating element on mount. Only animates when element dynamically inserted after initial page paint; elements rendered on page load not animated. Uses Astryx motion tokens (duration, easing) for consistent timing. Server-rendered elements hydrate without entry style, never animate; elements mounted after hydration animate.',
  paramDescriptions: {
    preset: 'animation preset applied on mount.',
  },
  returnDescriptions: {
    entryStyle: 'StyleX style object for entry animation / null if element rendered on initial page load (no animation needed).',
  },
  usage: {
    description:
      'Returns StyleX style for animating element on mount. Only animates when element dynamically inserted after initial page paint; elements rendered on page load not animated. Uses Astryx motion tokens (duration, easing) for consistent timing. Server-rendered elements hydrate without entry style, never animate; elements mounted after hydration animate.',
    bestPractices: [
      { guidance: true, description: 'Use for conditionally rendered elements like validation messages, toasts, expanding sections.' },
      { guidance: true, description: 'Spread returned style into stylex.props() alongside other styles.' },
      { guidance: false, description: 'Use for elements that should be visible on initial page load; they will not animate.' },
    ],
  },
};

export const docsZh = {
  "name": "useEntryAnimation",
  "usage": {
    "description": "返回用于在挂载时对元素进行动画的 StyleX 样式。仅当元素在初始页面绘制后动态插入时才播放动画；页面加载时渲染的元素不会播放动画。使用 Astryx 动效令牌（时长、缓动）以获得一致的动画时序。服务器渲染的元素在水合时不带入场样式，且绝不播放动画；水合后挂载的元素会播放动画。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于条件渲染的元素，例如校验消息、toast 或展开区块。"
      },
      {
        "guidance": true,
        "description": "将返回的样式与其他样式一起展开到 stylex.props() 中。"
      },
      {
        "guidance": false,
        "description": "用于在初始页面加载时就应可见的元素；它们不会播放动画。"
      }
    ]
  },
  "paramDescriptions": {
    "preset": "挂载时要应用的动画预设。"
  },
  "returnDescriptions": {
    "entryStyle": "用于入场动画的 StyleX 样式对象；若元素在初始页面加载时渲染或从服务器 HTML 水合（无需动画），则为 null。"
  }
};
