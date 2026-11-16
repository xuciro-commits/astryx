// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useOutlineFromMarkdown',
  displayName: 'useOutlineFromMarkdown',
  keywords: [
    'outline',
    'table of contents',
    'toc',
    'markdown',
    'headings',
    'heading ids',
    'same-page navigation',
  ],
  params: [
    {
      name: 'markdown',
      type: 'string',
      description:
        'The Markdown source. Pass the same string you render with Markdown.',
      required: true,
    },
    {
      name: 'options',
      type: 'ParseOutlineFromMarkdownOptions',
      description:
        'Parse options. Omit them for a document that Markdown renders without plugins.',
      required: false,
    },
    {
      name: 'options.plugins',
      type: 'ReadonlyArray<MarkdownPluginEntry>',
      description:
        'The ordered Markdown plugin list. Pass the same list to Markdown, so transforms, labels and ids agree. The outline is recomputed when the list reference changes.',
      required: false,
    },
    {
      name: 'options.isFinal',
      type: 'boolean',
      description:
        "Whether the source is complete. Pass false while Markdown's isStreaming is true, so both apply the same transforms.",
      default: 'true',
      required: false,
    },
  ],
  returns: [
    {
      name: 'items',
      type: 'OutlineItem[]',
      description:
        "One item per root heading, in document order, ready for Outline's items prop. id is the id Markdown renders on the heading in a complete document without sources, label is the heading's text, and level is its depth from 1 to 6.",
    },
  ],
  usage: {
    description:
      'Extracts the headings of a Markdown string for an Outline next to the rendered document. It uses the parser and heading slugs that Markdown uses, so in a complete document each item links to its heading, and fenced code never counts as a heading. The result is memoized on the source and the options. Outside React, use parseOutlineFromMarkdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the same string, plugin list and finality to Markdown and this hook, so items match the rendered headings once the content is complete.',
      },
      {
        guidance: true,
        description:
          'Declare the plugin list outside the component or memoize it. A new array on each render recomputes the outline.',
      },
      {
        guidance: true,
        description:
          'For several documents on one page, install one createMarkdownHeadingLinks per document with headingIdPrefix, so their ids do not collide.',
      },
      {
        guidance: false,
        description:
          'Write the items by hand or find headings with a regular expression. They drift from the rendered ids.',
      },
      {
        guidance: false,
        description:
          'Expect every item to have a target while content streams. Markdown reveals text gradually and trims unfinished syntax, so a heading can be absent or have another id until the content is complete.',
      },
      {
        guidance: false,
        description:
          "Expect an item to link to a heading that cites a Markdown sources entry. The hook does not receive sources, so the ids differ: for '# Intro [ref]', Markdown renders intro and the hook returns intro-ref.",
      },
      {
        guidance: false,
        description:
          'Expect an item for a nested heading, such as one in a blockquote. Only root headings become items.',
      },
    ],
  },
  relatedComponents: ['Outline', 'Markdown'],
  importPath: '@astryxdesign/core/Outline',
  category: 'Navigation',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headings of a Markdown string as OutlineItem[] for an Outline beside the rendered document. Same parser and heading slugs as Markdown; memoized on source and options.',
  paramDescriptions: {
    markdown: 'Markdown source; the same string you render with Markdown.',
    options: 'parse options; omit for a document without plugins.',
    'options.plugins':
      'ordered plugin list; pass the same list to Markdown. New reference recomputes.',
    'options.isFinal':
      "whether the source is complete; false while Markdown's isStreaming is true.",
  },
  returnDescriptions: {
    items:
      'one item per root heading in document order: id is the rendered id in a complete document without sources, label is its text, level is 1-6.',
  },
  usage: {
    description:
      'Headings of a Markdown string for an Outline next to the rendered document. Same parser and slugs as Markdown, so items link to their headings in a complete document. Outside React, use parseOutlineFromMarkdown.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the same string, plugin list and finality to Markdown and the hook; items match the headings once content is complete.',
      },
      {
        guidance: true,
        description:
          'Keep the plugin list stable; a new array each render recomputes.',
      },
      {
        guidance: true,
        description:
          'Several documents on one page: one createMarkdownHeadingLinks per document with headingIdPrefix.',
      },
      {
        guidance: false,
        description: 'Write items by hand or find headings with a regex.',
      },
      {
        guidance: false,
        description:
          'Expect every item to have a target while content streams; a heading can be absent or have another id until complete.',
      },
      {
        guidance: false,
        description:
          'Expect an item to link to a heading that cites a Markdown sources entry; the hook does not receive sources, so the ids differ.',
      },
      {
        guidance: false,
        description:
          'Expect items for nested headings; only root headings count.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useOutlineFromMarkdown",
  "usage": {
    "description": "提取 Markdown 字符串的标题，供渲染文档旁的 Outline 使用。它使用与 Markdown 相同的解析器和标题 slug，因此在完整文档中每个条目都链接到其标题，且围栏代码绝不会被算作标题。结果会基于源字符串和选项进行记忆化。在 React 之外，请使用 parseOutlineFromMarkdown。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将相同的字符串、插件列表和最终性状态传给 Markdown 和此 Hook，使条目在内容完整后与渲染的标题一致。"
      },
      {
        "guidance": true,
        "description": "在组件外声明插件列表或对其进行记忆化。每次渲染都新建数组会重新计算大纲。"
      },
      {
        "guidance": true,
        "description": "对于同一页面上的多个文档，为每个文档安装一个带 headingIdPrefix 的 createMarkdownHeadingLinks，以免它们的 id 冲突。"
      },
      {
        "guidance": false,
        "description": "手工编写条目或用正则表达式查找标题。它们会与渲染后的 id 漂移。"
      },
      {
        "guidance": false,
        "description": "期望内容流式传输时每个条目都有目标。Markdown 会逐步显示文本并裁剪未完成的语法，因此在内容完整前，标题可能不存在或具有另一个 id。"
      },
      {
        "guidance": false,
        "description": "期望条目链接到引用了 Markdown sources 条目的标题。该 Hook 不接收 sources，因此 id 不同：对于 '# Intro [ref]'，Markdown 渲染 intro，而该 Hook 返回 intro-ref。"
      },
      {
        "guidance": false,
        "description": "期望为嵌套标题（例如引用块中的标题）生成条目。只有根级标题会成为条目。"
      }
    ]
  },
  "paramDescriptions": {
    "markdown": "Markdown 源字符串。传入与传给 Markdown 渲染的相同字符串。",
    "options": "解析选项。对于 Markdown 在不使用插件的情况下渲染的文档，可省略。",
    "options.plugins": "有序的 Markdown 插件列表。将同一个列表传给 Markdown，使转换、标签和 id 保持一致。当列表引用变化时会重新计算大纲。",
    "options.isFinal": "源内容是否完整。当 Markdown 的 isStreaming 为 true 时传入 false，使两者应用相同的转换。"
  },
  "returnDescriptions": {
    "items": "每个根级标题一个条目，按文档顺序排列，可直接用于 Outline 的 items 属性。id 是在无 sources 的完整文档中 Markdown 渲染到标题上的 id，label 是标题文本，level 是其 1 到 6 的深度。"
  }
};
