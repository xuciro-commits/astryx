// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useLinkify',
  displayName: 'useLinkify',
  keywords: [
    'linkify',
    'link',
    'autolink',
    'url',
    'email',
    'mailto',
    'plain text',
    'custom pattern',
    'issue reference',
    'LinkProvider',
    'routing',
  ],
  params: [
    {
      name: 'text',
      type: 'string',
      description:
        'The plain text to scan. Empty text returns a single-element array of itself.',
      required: true,
    },
    {
      name: 'options',
      type: 'UseLinkifyOptions',
      description: 'Configuration object.',
      required: false,
    },
    {
      name: 'options.patterns',
      type: 'LinkifyPattern[]',
      description:
        'Custom patterns to detect, in addition to (or, with hasBuiltins false, replacing) the built-in URL and email detection. Each pattern is a global-flag regex plus an href builder (capture groups available) and an optional label builder and isExternal flag. When matches overlap, the earliest one wins; at the same start, custom patterns win over the built-in ones.',
      required: false,
    },
    {
      name: 'options.hasBuiltins',
      type: 'boolean',
      description:
        'Include the built-in http(s) URL and email detection. Default true; set false when patterns should fully define what links.',
      default: 'true',
      required: false,
    },
  ],
  returns: [
    {
      name: '(return value)',
      type: 'ReactNode[]',
      description:
        'The text as a mix of plain strings and Link elements, one per match, ready to render inside a text container. Matched URLs open externally (isExternal), emails link as mailto:, and every link renders through Link — so a LinkProvider routes clicks client-side the same as a hand-written Link.',
    },
  ],
  usage: {
    description:
      'Finds URLs, email addresses and custom patterns in plain text and returns React nodes with a Link for each match; the links respect LinkProvider for client-side routing. Use it wherever user- or tool-authored plain text should grow safe, styled links without pre-parsing it into markup: activity feeds, comment threads, description fields. Custom patterns turn project-specific references (issue numbers like #123, ticket IDs) into links by supplying a regex plus an href builder — e.g. an issue tracker pattern that maps captures onto its URL scheme. When matches overlap, the earliest one wins, and at the same start a custom pattern wins over the built-in ones, so a custom #123 pattern coexists with URL detection in the same string.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Render the returned nodes directly inside a text container (<p>{nodes}</p>); the hook already interleaves the unmatched plain text.',
      },
      {
        guidance: true,
        description:
          'Wrap the app (or the region) in LinkProvider so detected links route client-side instead of full-page navigating.',
      },
      {
        guidance: true,
        description:
          'Give a custom pattern the global flag (g). Without it the scan never advances, and when the text contains a match the render never finishes.',
      },
      {
        guidance: false,
        description:
          'Pre-parse the text into your own markup before linkifying — the hook exists so the plain string can be rendered as-is with links composed in.',
      },
    ],
  },
  relatedComponents: ['Link', 'LinkProvider'],
  importPath: '@astryxdesign/core',
  category: 'link',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Finds URLs, emails and custom patterns in plain text; returns ReactNode[] interleaving plain strings and Link elements that respect LinkProvider routing. Built-in URL/email detection, custom global-regex patterns with href/label builders, overlaps resolved earliest-match-first (custom wins at the same start).',
  paramDescriptions: {
    text: 'plain text to scan; empty returns [text].',
    options: 'config object.',
    'options.patterns':
      'custom LinkifyPatterns added before the builtins; each is a /g regex + href builder (+ optional label, isExternal).',
    'options.hasBuiltins':
      'include built-in URL/email detection (default true).',
  },
  returnDescriptions: {
    '(return value)':
      'mixed plain strings and Link elements, ready inside a text container; URLs external, emails mailto:, all via Link/LinkProvider.',
  },
  usage: {
    description:
      'Grow safe styled links in plain authored text (feeds, comments, descriptions) without pre-parsing. Custom patterns map project references (#123, ticket IDs) onto a URL scheme via capture groups. Overlaps: earliest match wins; custom wins at the same start.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Render the nodes as-is; plain text is already interleaved.',
      },
      {
        guidance: true,
        description: 'LinkProvider around the region for client-side routing.',
      },
      {guidance: true, description: 'Custom patterns need the g flag.'},
      {
        guidance: false,
        description: 'Pre-parse text into markup before linkifying.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useLinkify",
  "usage": {
    "description": "在纯文本中查找 URL、电子邮件地址和自定义模式，并返回为每个匹配项附带 Link 的 React 节点；这些链接遵循 LinkProvider 以实现客户端路由。凡是用户或工具撰写的纯文本需要生成安全、带样式的链接而又不想预先解析为标记的地方，都可使用它：动态流、评论线程、描述字段。自定义模式通过提供正则表达式加 href 构建函数，将项目特定引用（如 #123 的问题编号、工单 ID）转换为链接——例如将捕获组映射到其 URL 方案的问题跟踪器模式。当匹配项重叠时，最早的胜出；起点相同时，自定义模式优先于内置模式，因此自定义的 #123 模式可与同一字符串中的 URL 检测共存。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在文本容器中直接渲染返回的节点（<p>{nodes}</p>）；该 Hook 已经将未匹配的纯文本穿插其中。"
      },
      {
        "guidance": true,
        "description": "将应用（或该区域）包裹在 LinkProvider 中，使检测到的链接使用客户端路由而不是整页导航。"
      },
      {
        "guidance": true,
        "description": "为自定义模式提供全局标志（g）。没有它，扫描永远不会前进，当文本包含匹配项时渲染也永远不会结束。"
      },
      {
        "guidance": false,
        "description": "不要在生成链接前将文本预先解析为自己的标记——该 Hook 存在的意义就是让纯字符串可以原样渲染并组合链接。"
      }
    ]
  },
  "paramDescriptions": {
    "text": "要扫描的纯文本。空文本返回只包含它本身的单元素数组。",
    "options": "配置对象。",
    "options.patterns": "除内置 URL 和电子邮件检测之外要检测的自定义模式（当 hasBuiltins 为 false 时则替代它们）。每个模式由一个带全局标志的正则表达式、一个 href 构建函数（可使用捕获组）、一个可选的标签构建函数和 isExternal 标志组成。当匹配项重叠时，最早的胜出；起点相同时，自定义模式优先于内置模式。",
    "options.hasBuiltins": "是否包含内置的 http(s) URL 和电子邮件检测。默认 true；当 patterns 应完全定义哪些内容成为链接时设为 false。"
  },
  "returnDescriptions": {
    "(return value)": "以纯字符串和 Link 元素混合形式返回的文本，每个匹配项一个 Link，可直接在文本容器内渲染。匹配的 URL 在外部打开（isExternal），电子邮件链接为 mailto:，并且每个链接都通过 Link 渲染——因此 LinkProvider 会像手写 Link 一样将点击路由到客户端。"
  }
};
