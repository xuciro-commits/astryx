// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTheme',
  displayName: 'useTheme',
  group: 'Utilities',
  category: 'Utility',
  keywords: [
    'theme',
    'tokens',
    'color',
    'mode',
    'dark',
    'light',
    'provider',
    'data visualization',
    'canvas',
    'svg',
    'chart',
  ],
  params: [],
  returns: [
    {
      name: 'name',
      type: 'string',
      description:
        'Name of the nearest theme, or default when no provider is present.',
    },
    {
      name: 'mode',
      type: "'light' | 'dark'",
      description:
        'Resolved effective color mode. system mode is resolved to light or dark.',
    },
    {
      name: 'token',
      type: '(name: string) => string',
      description:
        'Resolve a single design token to its current CSS value for the effective mode.',
    },
    {
      name: 'tokens',
      type: 'Record<string, string>',
      description:
        'All tokens resolved for the current mode, including defaults and theme overrides. Stable until the active theme or mode changes; uses the same resolution logic as resolveThemeTokens(theme, {mode}).',
    },
  ],
  usage: {
    description:
      'Programmatic access to theme tokens for non-CSS consumers like SVG, canvas, Vega, D3, maps, or chart libraries that need values in JavaScript instead of CSS custom property references.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use tokens or token(name) when integrating theme colors into SVG attributes, canvas drawing, chart options, or other non-CSS configuration objects inside React components.',
      },
      {
        guidance: true,
        description:
          'Use resolveThemeTokens(theme, {mode}) for the same token resolution outside React hooks.',
      },
      {
        guidance: true,
        description:
          'Prefer CSS variables or StyleX tokens for ordinary component styling; use this hook only when JavaScript needs token values.',
      },
      {
        guidance: true,
        description:
          'Use data visualization tokens such as --color-data-categorical-blue for chart series instead of arbitrary UI colors.',
      },
      {
        guidance: false,
        description:
          'Hardcode light/dark colors in data visualizations: resolve them through the current theme instead.',
      },
      {
        guidance: false,
        description:
          'Assume the hook reflects every CSS cascade override. It resolves tokens for the current Theme mode; local media-surface overrides and arbitrary external CSS may not be represented.',
      },
    ],
  },
  relatedComponents: ['Theme'],
  relatedHooks: ['useMediaQuery'],
  importPath: '@astryxdesign/core/theme',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Programmatic access to theme tokens for SVG/canvas/charts needing JS values instead of CSS vars.',
  returnDescriptions: {
    name: 'nearest theme name or default.',
    mode: 'resolved light/dark mode.',
    token: 'resolve one design token for effective mode.',
    tokens:
      'all tokens resolved for current mode; stable until theme/mode changes; same resolver as resolveThemeTokens.',
  },
  usage: {
    description:
      'Programmatic access to theme tokens for SVG/canvas/charts needing JS values instead of CSS vars.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use tokens/token(name) for SVG/canvas/chart config theme colors in React.',
      },
      {
        guidance: true,
        description:
          'Use resolveThemeTokens(theme, {mode}) outside React hooks.',
      },
      {
        guidance: true,
        description:
          'Prefer CSS vars / StyleX tokens for ordinary styling; use hook when JS needs values.',
      },
      {
        guidance: true,
        description: 'Use --color-data-* tokens for chart series.',
      },
      {
        guidance: false,
        description: 'Hardcode light/dark chart colors: resolve from current theme.',
      },
      {
        guidance: false,
        description:
          'Assume hook reflects arbitrary CSS cascade/media-surface overrides.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useTheme",
  "usage": {
    "description": "为 SVG、canvas、Vega、D3、地图或图表库等非 CSS 使用方提供对主题令牌的编程访问，它们需要 JavaScript 中的值而不是 CSS 自定义属性引用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在 React 组件中将主题颜色集成到 SVG 属性、canvas 绘制、图表选项或其他非 CSS 配置对象时，使用 tokens 或 token(name)。"
      },
      {
        "guidance": true,
        "description": "在 React Hook 之外进行相同令牌解析时，使用 resolveThemeTokens(theme, {mode})。"
      },
      {
        "guidance": true,
        "description": "普通组件样式请优先使用 CSS 变量或 StyleX 令牌；仅在 JavaScript 需要令牌值时使用此 Hook。"
      },
      {
        "guidance": true,
        "description": "图表系列请使用 --color-data-categorical-blue 等数据可视化令牌，而不是任意 UI 颜色。"
      },
      {
        "guidance": false,
        "description": "在数据可视化中硬编码浅色/深色颜色：请改为通过当前主题解析它们。"
      },
      {
        "guidance": false,
        "description": "假设该 Hook 会反映所有 CSS 级联覆盖。它为当前 Theme 模式解析令牌；局部媒体表面覆盖和任意外部 CSS 可能无法体现。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "name": "最近主题的名称；没有提供程序时为 default。",
    "mode": "解析后的有效颜色模式。system 模式会解析为 light 或 dark。",
    "token": "将单个设计令牌解析为有效模式下的当前 CSS 值。",
    "tokens": "为当前模式解析的所有令牌，包括默认值和主题覆盖。在活动主题或模式变化之前保持稳定；使用与 resolveThemeTokens(theme, {mode}) 相同的解析逻辑。"
  }
};
