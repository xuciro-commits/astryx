// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useOutlineFromDOM',
  displayName: 'useOutlineFromDOM',
  keywords: [
    'outline',
    'table of contents',
    'toc',
    'headings',
    'dom',
    'same-page navigation',
  ],
  params: [
    {
      name: 'containerRef',
      type: 'React.RefObject<HTMLElement | null>',
      description:
        'The element that holds the headings. The hook reads h1 through h6 inside it.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'items',
      type: 'OutlineItem[]',
      description:
        "One item per heading that has both an id and text, in document order, ready for Outline's items prop. id is the heading's id, label is its trimmed text, and level is its depth from 1 to 6.",
    },
  ],
  usage: {
    description:
      'Builds outline items from the headings already in the page. Use it when the article is not a Markdown string, and pass the items to Outline. The list updates when headings are added, removed, renamed, or given a new id. A null ref returns an empty list.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Put an id on every heading the outline should list. A heading with no id, or with no text, is omitted.',
      },
      {
        guidance: true,
        description:
          'Point the ref at the article, not the page, so headings outside the article stay out of the outline.',
      },
      {
        guidance: false,
        description:
          'Expect the hook to invent ids. It only reads the ids the headings already have.',
      },
      {
        guidance: false,
        description:
          'Use it for a Markdown string. useOutlineFromMarkdown follows the same parser and slugs as Markdown.',
      },
    ],
  },
  relatedComponents: ['Outline'],
  relatedHooks: ['useOutlineFromMarkdown'],
  importPath: '@astryxdesign/core/Outline',
  category: 'Navigation',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Outline items from h1-h6 inside a DOM element. Updates when those headings change. Empty when the ref is null.',
  paramDescriptions: {
    containerRef: 'element that holds the headings.',
  },
  returnDescriptions: {
    items:
      'one item per heading with an id and text, in order: id, trimmed label, level 1-6.',
  },
  usage: {
    description:
      'Outline items from headings already in the page. Pass them to Outline. A heading needs an id and text.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give each listed heading an id. A heading without one is omitted.',
      },
      {
        guidance: true,
        description: 'Point the ref at the article, not the whole page.',
      },
      {
        guidance: false,
        description: 'Expect the hook to invent heading ids.',
      },
      {
        guidance: false,
        description:
          'Use it for a Markdown string. useOutlineFromMarkdown matches Markdown.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useOutlineFromDOM",
  "usage": {
    "description": "根据页面中已有的标题构建大纲项。当文章不是 Markdown 字符串时使用它，并将这些项传给 Outline。当标题被添加、删除、重命名或赋予新 id 时，列表会更新。null ref 返回空列表。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为大纲应列出的每个标题设置 id。没有 id 或没有文本的标题会被省略。"
      },
      {
        "guidance": true,
        "description": "将 ref 指向文章，而不是页面，使文章外的标题不进入大纲。"
      },
      {
        "guidance": false,
        "description": "期望 Hook 自行生成 id。它只读取标题已有的 id。"
      },
      {
        "guidance": false,
        "description": "将其用于 Markdown 字符串。useOutlineFromMarkdown 遵循与 Markdown 相同的解析器和 slug。"
      }
    ]
  },
  "paramDescriptions": {
    "containerRef": "包含标题的元素。Hook 读取其中的 h1 到 h6。"
  },
  "returnDescriptions": {
    "items": "每个同时具有 id 和文本的标题对应一个项，按文档顺序排列，可直接用于 Outline 的 items 属性。id 是标题的 id，label 是其修剪后的文本，level 是其深度（1 到 6）。"
  }
};
