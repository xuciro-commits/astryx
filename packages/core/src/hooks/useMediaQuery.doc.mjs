// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useMediaQuery',
  displayName: 'useMediaQuery',
  keywords: ['responsive', 'breakpoint', 'media', 'mobile', 'desktop', 'screen', 'matchmedia'],
  params: [
    {
      name: 'query',
      type: 'string',
      description: 'CSS media query string to evaluate.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'matches',
      type: 'boolean',
      description: 'Whether the media query currently matches. Always false on first render (SSR-safe).',
    },
  ],
  usage: {
    description: 'SSR-safe media query hook that subscribes to window.matchMedia changes. Returns whether the given media query matches. Always returns false on first render for SSR compatibility. Where `window.matchMedia` is missing, it returns its server default and never throws.',
    bestPractices: [
      { guidance: true, description: 'Use for responsive layout switching based on viewport width, color scheme, or motion preferences.' },
      { guidance: true, description: 'Prefer Astryx responsive tokens and component props over manual breakpoint logic when possible.' },
      { guidance: false, description: 'Use for server-rendered content that must match on first paint; the hook always returns false initially.' },
    ],
  },
  relatedComponents: [],
  relatedHooks: ['useImageMode'],
  importPath: '@astryxdesign/core/hooks',
  category: 'media',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description: 'SSR-safe media query hook subscribing to window.matchMedia changes. Returns whether given media query matches. Always returns false on first render for SSR compatibility.',
  paramDescriptions: {
    query: 'CSS media query string to evaluate.',
  },
  returnDescriptions: {
    matches: 'whether media query currently matches. Always false on first render (SSR-safe).',
  },
  usage: {
    description: 'SSR-safe media query hook subscribing to window.matchMedia changes. Returns whether given media query matches. Always returns false on first render for SSR compatibility. Where `window.matchMedia` is missing, returns its server default and never throws.',
    bestPractices: [
      { guidance: true, description: 'Use for responsive layout switching based on viewport width, color scheme, or motion preferences.' },
      { guidance: true, description: 'Prefer Astryx responsive tokens + component props over manual breakpoint logic when possible.' },
      { guidance: false, description: 'Use for server-rendered content that must match on first paint; hook always returns false initially.' },
    ],
  },
};

export const docsZh = {
  "name": "useMediaQuery",
  "usage": {
    "description": "SSR 安全的媒体查询 Hook，订阅 `window.matchMedia` 的变化。返回给定媒体查询是否匹配。为兼容 SSR，首次渲染始终返回 false。缺少 `window.matchMedia` 时，返回其服务端默认值，且从不抛出异常。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于基于视口宽度、配色方案或动效偏好进行响应式布局切换。"
      },
      {
        "guidance": true,
        "description": "尽可能优先使用 Astryx 的响应式令牌和组件属性，而不是手写断点逻辑。"
      },
      {
        "guidance": false,
        "description": "不要用于首次绘制必须一致的服务端渲染内容；该 Hook 初始始终返回 false。"
      }
    ]
  },
  "paramDescriptions": {
    "query": "要评估的 CSS 媒体查询字符串。"
  },
  "returnDescriptions": {
    "matches": "媒体查询当前是否匹配。首次渲染始终为 false（SSR 安全）。"
  }
};
