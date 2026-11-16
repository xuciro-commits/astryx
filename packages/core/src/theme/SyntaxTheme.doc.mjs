// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SyntaxTheme',
  displayName: 'Syntax Theme',
  group: 'Utilities',
  category: 'Utility',
  isHiddenFromOverview: true,
  keywords: [
    'syntax',
    'highlighting',
    'code',
    'theme',
    'codeblock',
    'prism',
    'shiki',
  ],
  playground: {
    defaults: {
      theme: 'github-light',
      children: {
        __element: 'CodeBlock',
        props: {
          code: "const status = response.ok ? 'success' : 'error';",
          language: 'tsx',
          title: 'status.ts',
        },
      },
    },
  },
  usage: {
    description:
      'Applies syntax highlighting colors to CodeBlock and any code component in the subtree. By default, code components use the theme-level syntax colors (set via defineTheme({ syntax: ... })), which derive from the palette (--color-text-accent for keywords, --color-text-green for strings, etc.). SyntaxTheme lets you override those per-region. The system uses 14 semantic tokens (keyword, string, comment, number, function, type, variable, operator, constant, tag, attribute, property, punctuation, background) validated against 11 community themes. Custom themes are created with defineSyntaxTheme() and can use [light, dark] tuples for automatic color-scheme adaptation. Built-in presets: oneDarkPro, dracula, monokai, nord, tokyoNight, catppuccinMocha, githubLight, githubDark, solarizedLight, oneLight (import from @astryxdesign/core/theme/syntax).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use the syntax field in defineTheme() for app-wide code styling. Use SyntaxTheme only when a specific section needs a different look.',
      },
      {
        guidance: true,
        description:
          'Pick from built-in presets or create a custom theme with defineSyntaxTheme() for brand-specific colors.',
      },
      {
        guidance: true,
        description:
          'Syntax themes support light-dark() tuples: each token can have different values for light and dark mode, resolved automatically by the color scheme.',
      },
      {
        guidance: true,
        description:
          'For a single CodeBlock, pass the syntaxTheme prop directly: it is shorthand for wrapping that block in SyntaxTheme. Use the SyntaxTheme wrapper when theming a whole region of code components.',
      },
    ],
  },
  props: [
    {
      name: 'theme',
      type: 'SyntaxTheme',
      required: true,
      description:
        'Syntax highlighting theme: a preset from @astryxdesign/core/theme/syntax or a custom theme created with defineSyntaxTheme().',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'Content subtree. All CodeBlock components within will use this syntax theme.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'Applies syntax highlighting colors to CodeBlock + any code component in subtree. By default code components use theme-level syntax colors (set via defineTheme({ syntax: ... })), which derive from palette (--color-text-accent for keywords, --color-text-green for strings, etc.); SyntaxTheme overrides those per-region. 14 semantic tokens (keyword, string, comment, number, function, type, variable, operator, constant, tag, attribute, property, punctuation, background) validated against 11 community themes. Custom themes created w/ defineSyntaxTheme(), can use [light, dark] tuples for automatic color-scheme adaptation. Built-in presets: oneDarkPro, dracula, monokai, nord, tokyoNight, catppuccinMocha, githubLight, githubDark, solarizedLight, oneLight (import from @astryxdesign/core/theme/syntax).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use syntax field in defineTheme() for app-wide code styling. Use SyntaxTheme only when a specific section needs different look.',
      },
      {
        guidance: true,
        description:
          'Pick from built-in presets or create custom theme w/ defineSyntaxTheme() for brand-specific colors.',
      },
      {
        guidance: true,
        description:
          'Syntax themes support light-dark() tuples: each token can have different values for light/dark mode, resolved automatically by color scheme.',
      },
      {
        guidance: true,
        description:
          'Single CodeBlock: pass syntaxTheme prop (shorthand for wrapping in SyntaxTheme). Whole region of code components: wrap w/ SyntaxTheme.',
      },
    ],
  },
  propDescriptions: {
    theme:
      'syntax highlighting theme: preset from @astryxdesign/core/theme/syntax or custom theme created w/ defineSyntaxTheme()',
  },
};

export const docsZh = {
  "name": "SyntaxTheme",
  "displayName": "Syntax Theme",
  "usage": {
    "description": "为 CodeBlock 及子树中的任何代码组件应用语法高亮颜色。默认情况下，代码组件使用主题级语法颜色（通过 `defineTheme({ syntax: ... })` 设置），这些颜色源自调色板（关键字使用 `--color-text-accent`，字符串使用 `--color-text-green`，等等）。SyntaxTheme 允许你按区域覆盖这些颜色。系统使用 14 个语义令牌（keyword、string、comment、number、function、type、variable、operator、constant、tag、attribute、property、punctuation、background），并针对 11 个社区主题进行了验证。自定义主题通过 `defineSyntaxTheme()` 创建，可使用 `[light, dark]` 元组进行自动配色方案适配。内置预设：oneDarkPro、dracula、monokai、nord、tokyoNight、catppuccinMocha、githubLight、githubDark、solarizedLight、oneLight（从 `@astryxdesign/core/theme/syntax` 导入）。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "应用全局代码样式时，请使用 `defineTheme()` 中的 `syntax` 字段。仅当特定区域需要不同外观时才使用 SyntaxTheme。"
      },
      {
        "guidance": true,
        "description": "从内置预设中选择，或使用 `defineSyntaxTheme()` 创建品牌专属颜色的自定义主题。"
      },
      {
        "guidance": true,
        "description": "语法主题支持 `light-dark()` 元组：每个令牌可以为浅色和深色模式设置不同的值，由配色方案自动解析。"
      },
      {
        "guidance": true,
        "description": "对于单个 CodeBlock，直接传入 `syntaxTheme` 属性：它是将该块包裹在 SyntaxTheme 中的简写。当要为整片区域的代码组件设置主题时，请使用 SyntaxTheme 包裹层。"
      }
    ]
  },
  "propDescriptions": {
    "theme": "语法高亮主题：`@astryxdesign/core/theme/syntax` 中的预设，或使用 `defineSyntaxTheme()` 创建的自定义主题。",
    "children": "内容子树。其中的所有 CodeBlock 组件都将使用此语法主题。"
  }
};
