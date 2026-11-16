// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useSyntaxTheme',
  displayName: 'useSyntaxTheme',
  keywords: [
    'syntax',
    'code',
    'theme',
    'tokens',
    'canvas',
    'highlight',
    'color',
  ],
  params: [],
  returns: [
    {
      name: 'name',
      type: 'string',
      description: 'Name of the syntax theme from the nearest SyntaxTheme.',
    },
    {
      name: 'mode',
      type: "'light' | 'dark'",
      description:
        "The mode used to resolve tokens. The contract is the nearest Theme's effective mode. The hook currently reads prefers-color-scheme instead, so under a Theme with a forced mode these colors can differ from the code around them.",
    },
    {
      name: 'token',
      type: '(name: SyntaxThemeTokenKey) => string',
      description:
        'The CSS color for one syntax token in the current mode, such as keyword.',
    },
    {
      name: 'tokens',
      type: 'Record<SyntaxThemeTokenKey, string>',
      description: 'Every syntax token resolved for the current mode.',
    },
  ],
  usage: {
    description:
      'Reads syntax colors for a canvas or other drawing that cannot use the CSS variables SyntaxTheme sets. Call it under a SyntaxTheme. It returns null when that provider is absent, so the caller can skip drawing.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Render the drawing under the same SyntaxTheme that colors the surrounding code.',
      },
      {
        guidance: true,
        description:
          'Check for null before reading token. The hook returns null with no SyntaxTheme above it.',
      },
      {
        guidance: false,
        description:
          'Copy syntax colors into the canvas by hand. They drift from the active syntax theme.',
      },
    ],
  },
  relatedComponents: ['SyntaxTheme', 'CodeBlock'],
  importPath: '@astryxdesign/core/theme/syntax',
  category: 'Utility',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Syntax colors for canvas drawing under a SyntaxTheme. Null when no provider is present.',
  returnDescriptions: {
    name: 'syntax theme name.',
    mode: 'nearest Theme mode is the contract. The hook reads prefers-color-scheme, so a forced Theme mode can disagree with nearby code.',
    token: 'CSS color for one syntax token in the current mode.',
    tokens: 'every syntax token for the current mode.',
  },
  usage: {
    description:
      'Syntax colors for a canvas under SyntaxTheme. Null when the provider is absent.',
    bestPractices: [
      {
        guidance: true,
        description: 'Draw under the same SyntaxTheme as the surrounding code.',
      },
      {
        guidance: true,
        description: 'Check for null before calling token.',
      },
      {
        guidance: false,
        description: 'Hardcode syntax colors in the canvas.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useSyntaxTheme",
  "usage": {
    "description": "为无法使用 SyntaxTheme 设置的 CSS 变量的画布或其他绘图读取语法颜色。在 SyntaxTheme 下调用。该提供者不存在时返回 null，以便调用方跳过绘制。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在与周围代码相同配色的 SyntaxTheme 下渲染绘图。"
      },
      {
        "guidance": true,
        "description": "读取 token 前检查是否为 null。上方没有 SyntaxTheme 时，该 Hook 返回 null。"
      },
      {
        "guidance": false,
        "description": "不要手动将语法颜色复制到画布中。它们会偏离当前活动的语法主题。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "name": "来自最近 SyntaxTheme 的语法主题名称。",
    "mode": "用于解析令牌的模式。约定是最近 Theme 的有效模式。该 Hook 目前改为读取 prefers-color-scheme，因此在强制模式的 Theme 下，这些颜色可能与周围代码不同。",
    "token": "当前模式下某个语法令牌的 CSS 颜色，例如 keyword。",
    "tokens": "为当前模式解析的所有语法令牌。"
  }
};
