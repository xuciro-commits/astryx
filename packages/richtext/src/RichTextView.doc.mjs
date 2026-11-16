// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'RichTextView',
  displayName: 'Rich Text View',
  category: 'Content',
  keywords: [
    'richtext',
    'rich text',
    'viewer',
    'read-only',
    'lexical',
    'render',
    'serialized',
  ],
  props: [
    {
      name: 'value',
      type: 'string',
      description:
        'Serialized editor state to render: the JSON string from JSON.stringify(editorState.toJSON()). The view updates when value changes.',
      required: true,
    },
    {
      name: 'nodes',
      type: 'ReadonlyArray<Klass<LexicalNode>>',
      description:
        'Lexical nodes to register beyond the default set. Pass the same nodes the content was authored with, so custom node types deserialize.',
    },
    {
      name: 'markdownExtensions',
      type: 'ReadonlyArray<RichTextMarkdownExtension>',
      description:
        'Markdown plugins whose nodes this view draws, each adopted with createRichTextExtension. A plugin node renders as core Markdown renders it; a node whose plugin is not passed shows its source. Pass the extensions the content was converted with, created in a client module.',
    },
    {
      name: 'codeLanguages',
      type: 'ReadonlyArray<CodeLanguage>',
      description:
        "CodeBlock languages a fence may name, such as graphql from @astryxdesign/core/CodeBlock/languages/graphql. Pass the same list as Markdown's codeLanguages, so reading and editing label and paint the same languages.",
    },
    {
      name: 'plugins',
      type: 'ReactNode',
      description:
        'Read-only Lexical plugins to render inside the view, such as hover cards or decorators.',
    },
    {
      name: 'namespace',
      type: 'string',
      description: 'The Lexical composer namespace.',
      default: "'astryx-view'",
    },
    {
      name: 'onParseError',
      type: '(error: Error) => void',
      description:
        'Called when value cannot be parsed or rendered, for example malformed JSON or a node type that is not registered through nodes. Use it to log or report the failure.',
    },
    {
      name: 'errorFallback',
      type: 'ReactNode',
      description:
        'What to render when value cannot be parsed or rendered. The view renders it instead of throwing.',
      default: 'null',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for the view root.',
    },
  ],
  usage: {
    description:
      'Renders serialized RichTextEditor content read-only, with the same nodes, tables, code blocks and Markdown plugin nodes the editor draws. Ships from @astryxdesign/richtext, with lexical and @lexical/* as optional peer dependencies.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Store editorState.toJSON() from RichTextEditor onChange, and pass the stringified JSON as value.',
      },
      {
        guidance: true,
        description:
          'Register the same custom nodes and markdownExtensions on the editor and the view, so stored content round-trips.',
      },
      {
        guidance: true,
        description:
          'Pass onParseError and an errorFallback when the stored content can come from an older or a foreign schema. By default a parse failure renders nothing instead of throwing.',
      },
      {
        guidance: false,
        description:
          'Use RichTextView to render Markdown source; use core Markdown for that.',
      },
    ],
  },
};

export const docsZh = {
  "name": "RichTextView",
  "displayName": "Rich Text View",
  "usage": {
    "description": "以只读方式渲染序列化的 RichTextEditor 内容，使用与编辑器相同的节点、表格、代码块和 Markdown 插件节点。从 @astryxdesign/richtext 发布，lexical 和 @lexical/* 为可选 peer 依赖。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "存储来自 RichTextEditor onChange 的 editorState.toJSON()，并将字符串化后的 JSON 作为 value 传入。"
      },
      {
        "guidance": true,
        "description": "在编辑器和视图上注册相同的自定义节点和 markdownExtensions，使存储的内容能够往返。"
      },
      {
        "guidance": true,
        "description": "当存储的内容可能来自较旧或外来的 schema 时，请传入 onParseError 和 errorFallback。默认情况下，解析失败会渲染为空，而不是抛出异常。"
      },
      {
        "guidance": false,
        "description": "不要用 RichTextView 渲染 Markdown 源文本；请使用核心 Markdown 来实现。"
      }
    ]
  },
  "propDescriptions": {
    "value": "要渲染的序列化编辑器状态：来自 JSON.stringify(editorState.toJSON()) 的 JSON 字符串。value 变化时视图会更新。",
    "nodes": "除默认集合之外要注册的 Lexical 节点。传入内容创作时使用的相同节点，使自定义节点类型能够反序列化。",
    "markdownExtensions": "此视图绘制其节点的 Markdown 插件，每个都用 createRichTextExtension 采纳。插件节点会按照核心 Markdown 的渲染方式渲染；未传入其插件的节点会显示其源文本。传入内容转换时使用的 extensions，并请在客户端模块中创建。",
    "codeLanguages": "围栏可命名的 CodeBlock 语言，例如来自 @astryxdesign/core/CodeBlock/languages/graphql 的 graphql。传入与 Markdown 的 codeLanguages 相同的列表，使阅读和编辑时以相同方式标注和绘制这些语言。",
    "plugins": "在视图内渲染的只读 Lexical 插件，例如悬停卡片或装饰器。",
    "namespace": "Lexical composer 命名空间。",
    "onParseError": "当 value 无法解析或渲染时调用，例如 JSON 格式错误或节点类型未通过 nodes 注册。用于记录或报告失败。",
    "errorFallback": "当 value 无法解析或渲染时渲染的内容。视图会渲染它而不是抛出异常。",
    "xstyle": "用于视图根元素的 StyleX 样式。"
  }
};
