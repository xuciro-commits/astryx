// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Document',
    required: true,
    description: 'Root container for block or inline Markdown content.',
  },
  {
    name: 'Heading',
    required: false,
    description:
      'Rendered semantic heading block; a custom heading renderer replaces the built-in part.',
  },
  {
    name: 'Paragraph',
    required: false,
    description:
      'Rendered paragraph block; a custom paragraph renderer replaces the default part.',
  },
  {
    name: 'List',
    required: false,
    description:
      'Ordered, unordered, or task-list block rendered from Markdown items.',
  },
  {
    name: 'Code block',
    required: false,
    description:
      'Fenced code block; long lines wrap rather than scroll sideways. A custom code renderer replaces the default part.',
  },
  {
    name: 'Blockquote',
    required: false,
    description:
      'Quoted block; a custom blockquote renderer replaces the default part.',
  },
  {
    name: 'Table',
    required: false,
    description:
      'Table block rendered from Markdown rows and columns; its Table child owns horizontal scrolling.',
  },
  {
    name: 'Divider',
    required: false,
    description:
      'Horizontal rule block; a custom hr renderer replaces the default part.',
  },
  {
    name: 'Image',
    required: false,
    description:
      'Block image or unsafe-URL fallback; a custom image renderer replaces a safe default image.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Markdown',
  displayName: 'Markdown',
  category: 'Content',
  keywords: [
    'markdown',
    'rich text',
    'prose',
    'renderer',
    'streaming',
    'markup',
    'formatted text',
    'md',
    'markdown renderer',
  ],
  props: [
    {
      name: 'children',
      type: 'string',
      description: 'The markdown string to render.',
      required: true,
    },
    {
      name: 'display',
      type: "'block' | 'inline'",
      description:
        "Display type. Markdown defaults to block. Use 'inline' for markdown spans embedded inside text.",
      default: "'block'",
    },
    {
      name: 'density',
      type: "\'default\' | \'compact\'",
      description: 'Controls spacing between block-level elements.',
      default: "\'default\'",
    },
    {
      name: 'headingLevelStart',
      type: '1 | 2 | 3 | 4 | 5 | 6',
      description:
        'The HTML heading level that markdown # maps to. Shifts all heading levels down to fit the surrounding page hierarchy. Levels exceeding h6 are clamped to h6.',
      default: '1',
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description:
        'Enables streaming mode; it uses incremental parsing and a smooth fade-in animation for chunk-by-chunk text delivery.',
      default: 'false',
    },
    {
      name: 'onLinkClick',
      type: '(href: string, event: MouseEvent) => void | false',
      description:
        'Handler for link clicks. Return false to prevent the default navigation behavior. Link destinations in the markdown follow the shared navigation rule described on the Link `href` prop, and Markdown also rejects every data: URL in a link or an image: a rejected destination renders as plain text and never reaches this handler or a custom link renderer.',
    },
    {
      name: 'sources',
      type: 'Record<string, MarkdownSource>',
      description:
        'Citation sources keyed by ID. When provided, [id] and 【id】 markers in the markdown that match a key are rendered as citation chips.',
    },
    {
      name: 'citationStyle',
      type: "'label' | 'number'",
      description:
        "How citations are displayed inline. 'label' shows a chip with source title, icon, and border. 'number' shows a compact numbered badge.",
      default: "'label'",
    },
    {
      name: 'contentWidth',
      type: 'number | string',
      description:
        'Max width for prose content (paragraphs, headings, lists, blockquotes). Tables and code blocks are unconstrained and can expand to the full container width. Use for readable line lengths in wide layouts.',
      default: '680',
    },
    {
      name: 'contentAlign',
      type: "'start' | 'center'",
      description:
        'Alignment of prose content within the container when contentWidth is narrower than the available space.',
      default: "'start'",
    },
    {
      name: 'plugins',
      type: 'readonly MarkdownPluginEntry[]',
      description:
        'Ordered extensions created by createMarkdownPlugin(). Plugins may add bounded syntax, immutable typed AST transforms, and typed extension renderers. Use isMarkdownExtensionNode() to narrow extension data observed from other plugins. Renderer callbacks are pure; return a child component when hooks are needed. Omitted and empty lists preserve the released Markdown behavior.',
    },
    {
      name: 'inlinePlugins',
      type: 'MarkdownInlinePlugin[]',
      description:
        'Transforms regex matches in parsed text nodes into custom inline React elements. Use for prefixed identifiers, mentions, and other shorthand patterns. Inline code, fenced code blocks, and math are unaffected.',
    },
    {
      name: 'autolink',
      type: "'gfm'",
      description:
        "Opt-in autolinking of bare URLs and emails. 'gfm' applies GitHub-Flavored Markdown autolink-literal rules: bare https?://..., www...., <scheme:url>, <email>, and user@host all become links. Trailing sentence punctuation and unbalanced trailing close-parens are excluded; matches inside code spans, code blocks, existing links, and image alt text are skipped. Default behavior (option unset) is unchanged.",
    },
    {
      name: 'codeLanguages',
      type: 'ReadonlyArray<CodeLanguage>',
      description:
        "CodeBlock language values a fence may name, each imported on its own (e.g. graphql from @astryxdesign/core/CodeBlock/languages/graphql) or made with createCodeLanguage. A fence whose language word is one of a listed value's identifiers renders with it, ahead of a built-in; a diff-<identifier> fence takes the diff layer over it; a later entry wins. Pass the same list to RichTextEditor or RichTextView so read and edit match.",
    },
    {
      name: 'components',
      type: 'MarkdownComponents',
      description:
        'Custom React component overrides for rendered Markdown elements (code, inlineCode, math, link, heading, paragraph, image, blockquote, hr, citation). Providing math enables `$…$` inline and `$$…$$` display parsing and receives `{value, display}`; omit it when dollar text should stay literal.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the root element. Prefer xstyle for styling; className is provided for integration with non-StyleX systems.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description:
        'Inline styles for the root element. Prefer xstyle for styling; inline styles bypass StyleX optimization.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  playground: {
    defaults: {
      children:
        "## Getting Started\n\nInstall the package:\n\n```bash\nnpm install @astryxdesign/core\n```\n\nThen import and use any component:\n\n```tsx\nimport {Button} from '@astryxdesign/core/Button';\n```\n\n**Bold**, *italic*, and `inline code` all work.",
    },
  },
  theming: {
    targets: [
      {className: 'astryx-markdown', visualProps: ['density']},
      {
        className: 'astryx-markdown-heading',
        visualProps: ['density', 'level'],
      },
      {
        className: 'astryx-markdown-paragraph',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-list',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-codeblock',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-blockquote',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-table',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-hr',
        visualProps: ['density'],
      },
      {
        className: 'astryx-markdown-image',
        visualProps: ['density'],
      },
    ],
  },
  usage: {
    anatomy,
    description:
      'Renders a markdown string as Astryx-styled components. Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set headingLevelStart to match the page hierarchy, e.g. start at 3 if the markdown sits inside an h2 section.',
      },
      {
        guidance: true,
        description:
          'Use contentWidth to keep prose at a readable line length in wide layouts.',
      },
      {
        guidance: true,
        description:
          'Emphasis and strong pair as CommonMark specifies, so *see **bold** more* puts the bold inside the emphasis. ***text*** renders as strong around emphasis, the order RichText draws, and is announced as both. Emphasis nested more than 100 levels deep stays as written text.',
      },
      {
        guidance: true,
        description:
          'Use plugins created by createMarkdownPlugin for reusable syntax, immutable AST transforms, and typed extension rendering. Keep the ordered list stable while its syntax configuration is unchanged.',
      },
      {
        guidance: true,
        description:
          'To render a plugin node outside Markdown, as another surface showing the same document does, read what the plugin declares with getMarkdownPluginCapabilities (syntax and transform, nothing else), and render each parsed extension node with MarkdownPluginNodeRenderer from the client-only @astryxdesign/core/Markdown/plugin-renderer subpath. It presents the node exactly as Markdown does, fallbacks and failure reports included, with no element of its own.',
      },
      {
        guidance: true,
        description:
          'Add markdownSoftBreaksPlugin when single line endings are meaningful. It matches remark-breaks for supported Markdown, including multiline link labels, while code and other opaque content stay unchanged.',
      },
      {
        guidance: true,
        description:
          'Add markdownSourceLinesPlugin when a feature maps the rendered document back to Markdown source lines (find, highlights, review comments). Every block Markdown renders, nested blocks included, then carries data-source-line and data-source-line-end (1-based, inclusive); components block renderers receive sourceLines to place on their own element, and plugin renderers read node.position lines. Inline elements, table rows, and cells carry none. Without the plugin no line work runs.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownTextTransform for prose matching; it preserves code, links, images, citations, math, and accepted extension syntax as protected contexts. Provide requiredSubstrings only when they conservatively cover every possible match.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFenceTransform for declared code-fence languages with semantic data. createNode returns an owned block extension node; its standard plugin renderer and toText own presentation. A claimed fence renders through that plugin even when components.code is supplied; components.code renders every unclaimed fence and is the fallback when the plugin renderer declines, throws, or suspends, and without it the accessible, copyable CodeBlock is that fallback.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownSourceDecoration to attach non-visual metadata — search hits, review annotations — to the blocks a source range touches, and getMarkdownSourceDecorations to read it back in a later plugin. Decorations appear on the settled document rather than on partial streaming chunks, and never change rendering, copyable text, accessible names, ids, focus order, or navigation.',
      },
      {
        guidance: true,
        description:
          'Import parseMarkdownAst or parseInlineAst from @astryxdesign/core/Markdown/parser when server or React Server Component code needs to run plugins against the canonical readonly tree. The parser and plugin subpaths have no use-client boundary. The Markdown component remains client-owned, so function-bearing plugin entries must not be passed across an RSC serialization boundary.',
      },
      {
        guidance: true,
        description:
          'Use decodeMarkdownCharacterReferences (from @astryxdesign/core/Markdown/parser or @astryxdesign/core/Markdown) to show text the way Markdown renders its character references: &copy;, &#169;, and &#xA9; become ©, while unknown names and references without their semicolon stay as written. It decodes plain text and knows nothing of Markdown, so skip code and backslash-escaped references yourself. It uses the same table Markdown renders with.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFrontmatter for typed document metadata. Its parse() method gives the host metadata directly; its plugin removes a complete leading block before rendering and withholds an unfinished block during streaming.',
      },
      {
        guidance: true,
        description:
          "Import createMarkdownRemarkTransform from '@astryxdesign/core/Markdown/remark' only to reuse an existing synchronous transform-only Remark plugin; it stays out of every other bundle. Prove each plugin with fixtures: anything outside the supported MDAST subset — async work, parser or compiler plugins, processor state, raw HTML, unsupported nodes, forged positions, or metadata Astryx cannot represent — keeps the last valid document and reports one diagnostic.",
      },
      {
        guidance: true,
        description:
          'Use inlinePlugins for prefixed identifiers, mentions, and other prose-only shorthand instead of preprocessing the markdown string.',
      },
      {
        guidance: true,
        description:
          'Provide components.math only for documents that use dollar-delimited math. The renderer owns typesetting and accessible output; Astryx passes the expression as text and never executes raw HTML.',
      },
      {
        guidance: true,
        description:
          'For direct parsing, use MathParseOptions and handle InlineNodeWithMath or BlockNodeWithMath. Incremental math parsing also uses createIncrementalState<true>() and IncrementalParseState<true>; default calls and ParseOptions annotations keep the legacy unions.',
      },
      {
        guidance: true,
        description:
          'Install createMarkdownHeadingLinks() through plugins when a document needs copyable h1–h6 permalinks. The returned entry carries its validated namespace and URL base across compatible Core package copies. Each built-in heading keeps its incoming fragment ID and gains an inline trailing # copy button: it is hidden at fine-pointer rest through useContainerReveal, reveals on heading-row hover or keyboard focus, and stays visible under the hook’s coarse/touch semantics. Unmodified tap, click, Enter, or Space copies the canonical URL without navigation, hash mutation, or scrolling; a check confirms success for 1.5 seconds. The no-plugin path stays unchanged, and nested headings use the same depth-first identity projection as Markdown-derived Outline.',
      },
      {
        guidance: true,
        description:
          'For multiple documents, create one heading-links plugin per document with headingIdPrefix and pass that same plugin to Markdown and useOutlineFromMarkdown. Use the same stable value for Markdown id when the root also needs a DOM id; permalinkBaseUrl may supply a safe caller-owned URL before the fragment.',
      },
      {
        guidance: false,
        description:
          'Use Markdown for hand-authored layouts; use Text and Heading directly when you control the content.',
      },
    ],
  },
  examples: [
    {
      label: 'Inline display',
      code: `
import {Text} from '@astryxdesign/core/Text';

<Text>
  This description includes{' '}
  <Markdown display="inline">{'\`inline code\` and **bold text**'}</Markdown>
  .
</Text>;
`,
    },
    {
      label: 'GFM autolinks',
      code: `
<Markdown autolink="gfm">
  {'Visit https://example.com or email contact@example.com. ' +
    'You can also bracket links: <https://docs.example.com>.'}
</Markdown>;
`,
    },
    {
      label: 'Linkable headings',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {createMarkdownHeadingLinks} from '@astryxdesign/core/Markdown/plugins';
import {Outline, useOutlineFromMarkdown} from '@astryxdesign/core/Outline';

const documentId = 'guide';
const headingLinks = createMarkdownHeadingLinks({
  headingIdPrefix: documentId,
});
const plugins = [headingLinks];

function Guide({source}) {
  const items = useOutlineFromMarkdown(source, {plugins});
  return (
    <>
      <Markdown id={documentId} plugins={plugins}>{source}</Markdown>
      <Outline items={items} />
    </>
  );
}
`,
    },
    {
      label: 'First-party soft breaks',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {markdownSoftBreaksPlugin} from '@astryxdesign/core/Markdown/plugins';

<Markdown plugins={[markdownSoftBreaksPlugin]}>
  {'First line\\nSecond line'}
</Markdown>;
`,
    },
    {
      label: 'Source-line stamps',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {markdownSourceLinesPlugin} from '@astryxdesign/core/Markdown/plugins';

// Each rendered block carries data-source-line / data-source-line-end.
<Markdown plugins={[markdownSourceLinesPlugin]}>
  {'# Title\\n\\n- one\\n- two'}
</Markdown>;
`,
    },
    {
      label: 'Text transform helper',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {
  createMarkdownPlugin,
  createMarkdownTextTransform,
} from '@astryxdesign/core/Markdown/plugins';

const finalLabels = createMarkdownPlugin({
  name: 'final-labels',
  apiVersion: 1,
  transform: createMarkdownTextTransform({
    pattern: /\\bDraft\\b/g,
    requiredSubstrings: ['Draft'],
    replace: () => ({type: 'text', value: 'Final'}),
  }),
});

<Markdown plugins={[finalLabels]}># Draft</Markdown>;
`,
    },
    {
      label: 'Semantic fence helper',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {
  createMarkdownFenceTransform,
  createMarkdownPlugin,
  type MarkdownExtensionNode,
} from '@astryxdesign/core/Markdown/plugins';

type DiagramNode = MarkdownExtensionNode<
  'diagrams',
  'diagram',
  {readonly code: string; readonly label?: string},
  'block'
>;

const diagrams = createMarkdownPlugin<'diagrams', DiagramNode>({
  name: 'diagrams',
  apiVersion: 1,
  transform: createMarkdownFenceTransform({
    languages: ['mermaid'],
    createNode: ({code, meta}) => ({
      type: 'extension',
      plugin: 'diagrams',
      name: 'diagram',
      display: 'block',
      data: {code, ...(meta == null ? {} : {label: meta})},
    }),
  }),
  renderers: {
    diagram: {
      render: ({node}) => (
        <Diagram source={node.data.code} label={node.data.label} />
      ),
      toText: node => node.data.code,
    },
  },
});

<Markdown plugins={[diagrams]}>
  {'\`\`\`mermaid Checkout flow\\ngraph LR; A-->B\\n\`\`\`'}
</Markdown>;
`,
    },
    {
      label: 'Source decoration helper',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {
  createMarkdownPlugin,
  createMarkdownSourceDecoration,
  getMarkdownSourceDecorations,
} from '@astryxdesign/core/Markdown/plugins';

// Ranges are UTF-16 offsets into the same string Markdown renders. Every
// block a range touches is annotated; rendering, copyable text, and ids
// never change.
const searchHits = createMarkdownPlugin({
  name: 'search-hits',
  apiVersion: 1,
  transform: createMarkdownSourceDecoration({
    name: 'search-hit',
    ranges: [{start: 0, end: 15, data: {query: 'release'}}],
  }),
});

const readDecorations = createMarkdownPlugin({
  name: 'read-decorations',
  apiVersion: 1,
  transform: root => {
    report(root.children.map(getMarkdownSourceDecorations));
    return root;
  },
});

<Markdown plugins={[searchHits, readDecorations]}>{source}</Markdown>;
`,
    },
    {
      label: 'Native frontmatter',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {createMarkdownFrontmatter} from '@astryxdesign/core/Markdown/plugins';

const frontmatter = createMarkdownFrontmatter({
  name: 'document-metadata',
  parse: fields => ({
    title: fields.title ?? 'Untitled',
    draft: fields.draft === 'true',
  }),
});

const source = '---\\ntitle: Release notes\\ndraft: true\\n---\\n# Shipped';
const result = frontmatter.parse(source);

<Markdown plugins={[frontmatter.plugin]}>{source}</Markdown>;
`,
    },
    {
      label: 'Compatible Remark plugin',
      code: `
import {Markdown} from '@astryxdesign/core/Markdown';
import {createMarkdownPlugin} from '@astryxdesign/core/Markdown/plugins';
import {createMarkdownRemarkTransform} from '@astryxdesign/core/Markdown/remark';

// A synchronous transform-only Remark plugin in the usual attacher shape.
const remarkRename =
  ({from, to}) =>
  tree => {
    const rename = node => {
      if (node.type === 'text') {
        node.value = node.value.split(from).join(to);
      }
      node.children?.forEach(rename);
    };
    rename(tree);
  };

const productName = createMarkdownPlugin({
  name: 'product-name',
  apiVersion: 1,
  transform: createMarkdownRemarkTransform(remarkRename, {
    from: 'Astryx',
    to: 'Astryx Design',
  }),
});

<Markdown plugins={[productName]}># Astryx release notes</Markdown>;
`,
    },
    {
      label: 'Entity links',
      code: `
import {Link} from '@astryxdesign/core/Link';

const entityPlugins = [
  {
    pattern: /\\b([A-Z][A-Z0-9]+-\\d+)\\b/g,
    render: (match, key) => (
      <Link key={key} href={\`/entities/\${match[1]}\`}>
        {match[0]}
      </Link>
    ),
  },
];

<Markdown inlinePlugins={entityPlugins}>
  {'See DOC-2048. Inline code stays plain: \`DOC-9999\`.'}
</Markdown>;
`,
    },
    {
      label: 'Math renderer',
      code: `
import {BlockMath, InlineMath} from 'react-katex';

function MathExpression({value, display}) {
  const Component = display === 'block' ? BlockMath : InlineMath;
  return <Component math={value} />;
}

<Markdown components={{math: MathExpression}}>
  {'Inline $x_1 + y$ and display math:\\n\\n$$\\n\\\\sum_i x_i\\n$$'}
</Markdown>;
`,
    },
  ],
};

export const docsZh = {
  "name": "Markdown",
  "displayName": "Markdown",
  "props": [
    {
      "name": "children",
      "type": "string",
      "description": "要渲染的 Markdown 字符串。",
      "required": true
    },
    {
      "name": "display",
      "type": "'block' | 'inline'",
      "description": "显示类型。Markdown 默认为 block。对于嵌入文本中的 Markdown 片段，使用 'inline'。",
      "default": "'block'"
    },
    {
      "name": "density",
      "type": "'default' | 'compact'",
      "description": "控制块级元素之间的间距。",
      "default": "'default'"
    },
    {
      "name": "headingLevelStart",
      "type": "1 | 2 | 3 | 4 | 5 | 6",
      "description": "Markdown 的 # 映射到的 HTML 标题级别。会整体下移所有标题级别，以适应周围的页面层级。超过 h6 的级别会被限制为 h6。",
      "default": "1"
    },
    {
      "name": "isStreaming",
      "type": "boolean",
      "description": "启用流式模式；它使用增量解析和平滑淡入动画，逐块交付文本。",
      "default": "false"
    },
    {
      "name": "onLinkClick",
      "type": "(href: string, event: MouseEvent) => void | false",
      "description": "链接点击处理函数。返回 false 可阻止默认导航行为。Markdown 中的链接目标遵循 Link `href` 属性所述的共享导航规则，且 Markdown 还会拒绝链接或图像中的每个 data: URL：被拒绝的目标会渲染为纯文本，绝不进入此处理函数或自定义链接渲染器。"
    },
    {
      "name": "sources",
      "type": "Record<string, MarkdownSource>",
      "description": "按 ID 索引的引用来源。提供后，Markdown 中与某个键匹配的 [id] 和 【id】 标记会渲染为引用标签。"
    },
    {
      "name": "citationStyle",
      "type": "'label' | 'number'",
      "description": "引用在内联显示时的样式。'label' 显示带来源标题、图标和边框的标签。'number' 显示紧凑的编号徽标。",
      "default": "'label'"
    },
    {
      "name": "contentWidth",
      "type": "number | string",
      "description": "正文内容（段落、标题、列表、引用）的最大宽度。表格和代码块不受约束，可扩展到容器全宽。用于在宽布局中保持可读的行长。",
      "default": "680"
    },
    {
      "name": "contentAlign",
      "type": "'start' | 'center'",
      "description": "当 contentWidth 窄于可用空间时，正文内容在容器内的对齐方式。",
      "default": "'start'"
    },
    {
      "name": "plugins",
      "type": "readonly MarkdownPluginEntry[]",
      "description": "由 createMarkdownPlugin() 创建的有序扩展。插件可以添加有界语法、不可变的带类型 AST 转换和带类型的扩展渲染器。使用 isMarkdownExtensionNode() 收窄从其他插件观察到的扩展数据。渲染器回调是纯函数；需要 Hook 时请返回子组件。省略或空列表会保留已发布的 Markdown 行为。"
    },
    {
      "name": "inlinePlugins",
      "type": "MarkdownInlinePlugin[]",
      "description": "将解析后文本节点中的正则匹配转换为自定义内联 React 元素。用于带前缀的标识符、提及和其他简写模式。内联代码、围栏代码块和数学公式不受影响。"
    },
    {
      "name": "autolink",
      "type": "'gfm'",
      "description": "可选启用裸 URL 和电子邮件的自动链接。'gfm' 应用 GitHub Flavored Markdown 的 autolink-literal 规则：裸 https?://...、www....、<scheme:url>、<email> 和 user@host 都会成为链接。末尾的句子标点和未配对的尾部右括号会被排除；代码段、代码块、现有链接和图像替代文本内的匹配会被跳过。默认行为（未设置该选项）保持不变。"
    },
    {
      "name": "codeLanguages",
      "type": "ReadonlyArray<CodeLanguage>",
      "description": "代码围栏可指定的 CodeBlock 语言值，每个值单独导入（例如从 @astryxdesign/core/CodeBlock/languages/graphql 导入 graphql），或用 createCodeLanguage 创建。若围栏的语言词是某个列出的值的标识符之一，则会用该值渲染，优先于内置项；diff-<identifier> 围栏会在其上应用 diff 层；靠后的条目优先。将同一个列表传给 RichTextEditor 或 RichTextView，使读取与编辑保持一致。"
    },
    {
      "name": "components",
      "type": "MarkdownComponents",
      "description": "用于渲染后 Markdown 元素的自定义 React 组件覆盖（code、inlineCode、math、link、heading、paragraph、image、blockquote、hr、citation）。提供 math 会启用 `$…$` 内联和 `$$…$$` 块级解析，并接收 `{value, display}`；当美元文本应保持字面形式时请省略它。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值，而不是 style={{}} 这样的内联样式对象。"
    },
    {
      "name": "className",
      "type": "string",
      "description": "根元素的 CSS 类名。样式优先使用 xstyle；className 用于与非 StyleX 系统集成。"
    },
    {
      "name": "style",
      "type": "CSSProperties",
      "description": "根元素的内联样式。样式优先使用 xstyle；内联样式会绕过 StyleX 优化。"
    },
    {
      "name": "data-testid",
      "type": "string",
      "description": "用于自动化测试框架的测试选择器。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-markdown",
        "visualProps": [
          "density"
        ]
      },
      {
        "className": "astryx-markdown-heading",
        "visualProps": [
          "density",
          "level"
        ],
        "description": "每个渲染的标题块（h1–h6）。覆盖 marginBlockStart/marginBlockEnd 可调整标题周围的间距；反映 data-density 和 data-level，因此主题可按密度和标题层级设置间距。仅适用于默认标题渲染——自定义的 components.heading 拥有自己的样式。"
      },
      {
        "className": "astryx-markdown-paragraph",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的段落块。覆盖 marginBlockStart/marginBlockEnd 可调整段落之间的间距。反映 data-density，因此主题可以为不同密度设置不同的间距。"
      },
      {
        "className": "astryx-markdown-list",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的列表块（有序、无序和任务列表）。覆盖 marginBlockStart/marginBlockEnd 可调整列表周围的间距；反映 data-density。"
      },
      {
        "className": "astryx-markdown-codeblock",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的代码块外层容器。覆盖 marginBlockStart/marginBlockEnd 可调整代码块周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.code 拥有自己的样式。"
      },
      {
        "className": "astryx-markdown-blockquote",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的引用块（与 astryx-blockquote 目标共用同一元素）。覆盖 marginBlockStart/marginBlockEnd 可调整引用块周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.blockquote 拥有自己的样式。"
      },
      {
        "className": "astryx-markdown-table",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的表格外层容器。覆盖 marginBlockStart/marginBlockEnd 可调整表格周围的间距；反映 data-density。"
      },
      {
        "className": "astryx-markdown-hr",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的水平分隔线。覆盖 marginBlockStart/marginBlockEnd 可调整分隔线周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.hr 拥有自己的样式。"
      },
      {
        "className": "astryx-markdown-image",
        "visualProps": [
          "density"
        ],
        "description": "每个渲染的块级图片外层容器（以及损坏图片的占位符）。覆盖 marginBlockStart/marginBlockEnd 可调整图片周围的间距；反映 data-density。仅适用于默认渲染——自定义的 components.image 拥有自己的样式。"
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "文档",
        "required": true,
        "description": "用于块级或内联 Markdown 内容的根容器。"
      },
      {
        "name": "标题",
        "required": false,
        "description": "渲染后的语义标题块；自定义标题渲染器会替换内置部件。"
      },
      {
        "name": "段落",
        "required": false,
        "description": "渲染后的段落块；自定义段落渲染器会替换默认部件。"
      },
      {
        "name": "列表",
        "required": false,
        "description": "由 Markdown 项渲染的有序、无序或任务列表块。"
      },
      {
        "name": "代码块",
        "required": false,
        "description": "围栏代码块；长行会换行而不是横向滚动。自定义代码渲染器会替换默认部件。"
      },
      {
        "name": "引用块",
        "required": false,
        "description": "引用块；自定义引用渲染器会替换默认部件。"
      },
      {
        "name": "表格",
        "required": false,
        "description": "由 Markdown 行和列渲染的表格块；其 Table 子元素负责横向滚动。"
      },
      {
        "name": "分隔线",
        "required": false,
        "description": "水平分割线块；自定义 hr 渲染器会替换默认部件。"
      },
      {
        "name": "图像",
        "required": false,
        "description": "块级图像或不安全 URL 的回退；自定义图像渲染器会替换安全的默认图像。"
      }
    ],
    "description": "将 Markdown 字符串渲染为 Astryx 样式的组件。用于用户生成内容、AI 回复和文档；它能处理标题、列表、表格、代码块和引用，并保持一致的样式。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "设置 headingLevelStart 以匹配页面层级，例如当 Markdown 位于 h2 区块内时从 3 开始。"
      },
      {
        "guidance": true,
        "description": "使用 contentWidth 在宽布局中将正文保持在可读的行长。"
      },
      {
        "guidance": true,
        "description": "强调和加粗按 CommonMark 的规定配对，因此 *see **bold** more* 会将加粗置于强调内部。***text*** 渲染为强调外层包裹加粗，即 RichText 绘制的顺序，并会作为两者一并播报。嵌套超过 100 层的强调保持为原文文本。"
      },
      {
        "guidance": true,
        "description": "使用 createMarkdownPlugin 创建的插件来实现可复用语法、不可变 AST 转换和带类型的扩展渲染。在语法配置未变化时保持有序列表稳定。"
      },
      {
        "guidance": true,
        "description": "如需在 Markdown 之外渲染插件节点（例如另一个展示同一文档的界面），请通过 getMarkdownPluginCapabilities 读取插件声明的内容（仅语法和转换，不包含其他内容），并使用仅客户端可用的 @astryxdesign/core/Markdown/plugin-renderer 子路径中的 MarkdownPluginNodeRenderer 渲染每个解析后的扩展节点。它会完全按照 Markdown 的方式呈现该节点，包括回退和失败报告，且自身不产生任何元素。"
      },
      {
        "guidance": true,
        "description": "当单换行具有意义时，添加 markdownSoftBreaksPlugin。它在受支持的 Markdown 中与 remark-breaks 一致，包括多行链接标签，而代码和其他不透明内容保持不变。"
      },
      {
        "guidance": true,
        "description": "当某项功能需要将渲染后的文档映射回 Markdown 源行（查找、高亮、评审评论）时，添加 markdownSourceLinesPlugin。此时 Markdown 渲染的每个块（包括嵌套块）都会携带 data-source-line 和 data-source-line-end（从 1 开始，含端点）；components 的块渲染器会收到 sourceLines，用于放到自己的元素上，插件渲染器则读取 node.position 的行号。内联元素、表格行和单元格不携带这些属性。未使用该插件时不会执行任何行号处理。"
      },
      {
        "guidance": true,
        "description": "使用 createMarkdownTextTransform 进行正文匹配；它会将代码、链接、图像、引用、数学公式和已接受的扩展语法作为受保护上下文保留。仅当 requiredSubstrings 能保守覆盖所有可能匹配时才提供它。"
      },
      {
        "guidance": true,
        "description": "对于带语义数据的已声明代码围栏语言，使用 createMarkdownFenceTransform。createNode 返回一个自有块扩展节点；其标准插件渲染器和 toText 负责呈现。即使提供了 components.code，被认领的围栏仍通过该插件渲染；components.code 渲染所有未被认领的围栏，并在插件渲染器拒绝、抛出或挂起时作为回退，若未提供它，则可访问、可复制的 CodeBlock 就是回退。"
      },
      {
        "guidance": true,
        "description": "使用 createMarkdownSourceDecoration 将非视觉元数据（搜索命中、评审注释）附加到源范围触及的块上，并使用 getMarkdownSourceDecorations 在后续插件中读回。装饰会出现在稳定后的文档上，而不是流式传输中的部分块上，且绝不会改变渲染、可复制文本、无障碍名称、id、焦点顺序或导航。"
      },
      {
        "guidance": true,
        "description": "当服务器或 React Server Component 代码需要针对规范只读树运行插件时，从 @astryxdesign/core/Markdown/parser 导入 parseMarkdownAst 或 parseInlineAst。解析器和插件子路径没有 use-client 边界。Markdown 组件仍由客户端拥有，因此带函数的插件条目不得跨 RSC 序列化边界传递。"
      },
      {
        "guidance": true,
        "description": "使用 decodeMarkdownCharacterReferences（来自 @astryxdesign/core/Markdown/parser 或 @astryxdesign/core/Markdown）按 Markdown 渲染字符引用的方式显示文本：&copy;、&#169; 和 &#xA9; 会变为 ©，而未知名称和缺少分号的引用保持原样。它解码纯文本，不了解 Markdown，因此请自行跳过代码和反斜杠转义的引用。它使用与 Markdown 渲染时相同的表。"
      },
      {
        "guidance": true,
        "description": "使用 createMarkdownFrontmatter 处理带类型的文档元数据。其 parse() 方法直接向宿主提供元数据；其插件在渲染前移除完整的前置块，并在流式传输期间暂缓未完成的块。"
      },
      {
        "guidance": true,
        "description": "仅为了复用现有的同步且仅做转换的 Remark 插件，才从 '@astryxdesign/core/Markdown/remark' 导入 createMarkdownRemarkTransform；它不会进入其他任何 bundle。用测试夹具验证每个插件：任何超出受支持 MDAST 子集的内容——异步工作、解析器或编译器插件、处理器状态、原始 HTML、不支持的节点、伪造的位置，或 Astryx 无法表示的元数据——都会保留最后一个有效文档并报告一条诊断信息。"
      },
      {
        "guidance": true,
        "description": "对于带前缀的标识符、提及和其他仅正文使用的简写，请使用 inlinePlugins，而不是预处理 Markdown 字符串。"
      },
      {
        "guidance": true,
        "description": "仅为使用美元符号定界数学公式的文档提供 components.math。渲染器负责排版和无障碍输出；Astryx 以文本形式传递表达式，绝不执行原始 HTML。"
      },
      {
        "guidance": true,
        "description": "对于直接解析，请使用 MathParseOptions 并处理 InlineNodeWithMath 或 BlockNodeWithMath。增量数学解析还使用 createIncrementalState<true>() 和 IncrementalParseState<true>；默认调用和 ParseOptions 注解保留旧版联合类型。"
      },
      {
        "guidance": true,
        "description": "当文档需要可复制的 h1–h6 永久链接时，通过 plugins 安装 createMarkdownHeadingLinks()。返回的条目会在兼容的 Core 包副本之间携带其经过校验的命名空间和 URL 基址。每个内置标题保留其传入的片段 ID，并增加一个行内尾随 # 复制按钮：在精细指针静止时通过 useContainerReveal 隐藏，在标题行悬停或键盘聚焦时显现，并在该 Hook 的粗指针/触摸语义下保持可见。未经修饰的点按、点击、Enter 或 Space 会复制规范 URL，且不导航、不改变哈希、不滚动；勾选标记会确认成功 1.5 秒。无插件路径保持不变，嵌套标题使用与 Markdown 派生的 Outline 相同的深度优先标识投影。"
      },
      {
        "guidance": true,
        "description": "对于多个文档，为每个文档创建一个带 headingIdPrefix 的标题链接插件，并将同一个插件传给 Markdown 和 useOutlineFromMarkdown。当根元素还需要 DOM id 时，为 Markdown 的 id 使用同一个稳定值；permalinkBaseUrl 可在片段前提供调用方自有的安全 URL。"
      },
      {
        "guidance": false,
        "description": "将 Markdown 用于手工编写的布局；当你掌控内容时，请直接使用 Text 和 Heading。"
      }
    ]
  },
  "propDescriptions": {
    "children": "要渲染的 Markdown 字符串。",
    "display": "显示类型。Markdown 默认为 block。对于嵌入文本中的 Markdown 片段，使用 'inline'。",
    "density": "控制块级元素之间的间距。",
    "headingLevelStart": "Markdown 的 # 映射到的 HTML 标题级别。会整体下移所有标题级别，以适应周围的页面层级。超过 h6 的级别会被限制为 h6。",
    "isStreaming": "启用流式模式；它使用增量解析和平滑淡入动画，逐块交付文本。",
    "onLinkClick": "链接点击处理函数。返回 false 可阻止默认导航行为。Markdown 中的链接目标遵循 Link `href` 属性所述的共享导航规则，且 Markdown 还会拒绝链接或图像中的每个 data: URL：被拒绝的目标会渲染为纯文本，绝不进入此处理函数或自定义链接渲染器。",
    "sources": "按 ID 索引的引用来源。提供后，Markdown 中与某个键匹配的 [id] 和 【id】 标记会渲染为引用标签。",
    "citationStyle": "引用在内联显示时的样式。'label' 显示带来源标题、图标和边框的标签。'number' 显示紧凑的编号徽标。",
    "contentWidth": "正文内容（段落、标题、列表、引用）的最大宽度。表格和代码块不受约束，可扩展到容器全宽。用于在宽布局中保持可读的行长。",
    "contentAlign": "当 contentWidth 窄于可用空间时，正文内容在容器内的对齐方式。",
    "plugins": "由 createMarkdownPlugin() 创建的有序扩展。插件可以添加有界语法、不可变的带类型 AST 转换和带类型的扩展渲染器。使用 isMarkdownExtensionNode() 收窄从其他插件观察到的扩展数据。渲染器回调是纯函数；需要 Hook 时请返回子组件。省略或空列表会保留已发布的 Markdown 行为。",
    "inlinePlugins": "将解析后文本节点中的正则匹配转换为自定义内联 React 元素。用于带前缀的标识符、提及和其他简写模式。内联代码、围栏代码块和数学公式不受影响。",
    "autolink": "可选启用裸 URL 和电子邮件的自动链接。'gfm' 应用 GitHub Flavored Markdown 的 autolink-literal 规则：裸 https?://...、www....、<scheme:url>、<email> 和 user@host 都会成为链接。末尾的句子标点和未配对的尾部右括号会被排除；代码段、代码块、现有链接和图像替代文本内的匹配会被跳过。默认行为（未设置该选项）保持不变。",
    "codeLanguages": "代码围栏可指定的 CodeBlock 语言值，每个值单独导入（例如从 @astryxdesign/core/CodeBlock/languages/graphql 导入 graphql），或用 createCodeLanguage 创建。若围栏的语言词是某个列出的值的标识符之一，则会用该值渲染，优先于内置项；diff-<identifier> 围栏会在其上应用 diff 层；靠后的条目优先。将同一个列表传给 RichTextEditor 或 RichTextView，使读取与编辑保持一致。",
    "components": "用于渲染后 Markdown 元素的自定义 React 组件覆盖（code、inlineCode、math、link、heading、paragraph、image、blockquote、hr、citation）。提供 math 会启用 `$…$` 内联和 `$$…$$` 块级解析，并接收 `{value, display}`；当美元文本应保持字面形式时请省略它。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的返回值，而不是 style={{}} 这样的内联样式对象。",
    "className": "根元素的 CSS 类名。样式优先使用 xstyle；className 用于与非 StyleX 系统集成。",
    "style": "根元素的内联样式。样式优先使用 xstyle；内联样式会绕过 StyleX 优化。",
    "data-testid": "用于自动化测试框架的测试选择器。"
  }
};

export const docsDense = {
  description:
    'Renders markdown string as Astryx-styled components. Use for user-generated content, AI responses, docs. Headings, lists, tables, code, citations w/ consistent styling.',
  usage: {
    anatomy,
    description:
      'Renders a markdown string as Astryx-styled components. Use Markdown for user-generated content, AI responses, and documentation; it handles headings, lists, tables, code blocks, and citations with consistent styling.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set headingLevelStart to match the page hierarchy, e.g. start at 3 if the markdown sits inside an h2 section.',
      },
      {
        guidance: true,
        description:
          'Use contentWidth to keep prose at a readable line length in wide layouts.',
      },
      {
        guidance: true,
        description:
          'Emphasis and strong pair as CommonMark specifies, so *see **bold** more* puts the bold inside the emphasis. ***text*** renders as strong around emphasis, the order RichText draws, and is announced as both. Emphasis nested more than 100 levels deep stays as written text.',
      },
      {
        guidance: true,
        description:
          'Use plugins created by createMarkdownPlugin for reusable syntax, immutable AST transforms, and typed extension rendering. Keep the ordered list stable while its syntax configuration is unchanged.',
      },
      {
        guidance: true,
        description:
          'To render a plugin node outside Markdown, as another surface showing the same document does, read what the plugin declares with getMarkdownPluginCapabilities (syntax and transform, nothing else), and render each parsed extension node with MarkdownPluginNodeRenderer from the client-only @astryxdesign/core/Markdown/plugin-renderer subpath. It presents the node exactly as Markdown does, fallbacks and failure reports included, with no element of its own.',
      },
      {
        guidance: true,
        description:
          'Add markdownSoftBreaksPlugin when single line endings are meaningful. It matches remark-breaks for supported Markdown, including multiline link labels, while code and other opaque content stay unchanged.',
      },
      {
        guidance: true,
        description:
          'Add markdownSourceLinesPlugin when a feature maps the rendered document back to Markdown source lines (find, highlights, review comments). Every block Markdown renders, nested blocks included, then carries data-source-line and data-source-line-end (1-based, inclusive); components block renderers receive sourceLines to place on their own element, and plugin renderers read node.position lines. Inline elements, table rows, and cells carry none. Without the plugin no line work runs.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownTextTransform for prose matching; it preserves code, links, images, citations, math, and accepted extension syntax as protected contexts. Provide requiredSubstrings only when they conservatively cover every possible match.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFenceTransform for declared code-fence languages with semantic data. createNode returns an owned block extension node; its standard plugin renderer and toText own presentation. A claimed fence renders through that plugin even when components.code is supplied; components.code renders every unclaimed fence and is the fallback when the plugin renderer declines, throws, or suspends, and without it the accessible, copyable CodeBlock is that fallback.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownSourceDecoration to attach non-visual metadata — search hits, review annotations — to the blocks a source range touches, and getMarkdownSourceDecorations to read it back in a later plugin. Decorations appear on the settled document rather than on partial streaming chunks, and never change rendering, copyable text, accessible names, ids, focus order, or navigation.',
      },
      {
        guidance: true,
        description:
          'Import parseMarkdownAst or parseInlineAst from @astryxdesign/core/Markdown/parser when server or React Server Component code needs to run plugins against the canonical readonly tree. The parser and plugin subpaths have no use-client boundary. The Markdown component remains client-owned, so function-bearing plugin entries must not be passed across an RSC serialization boundary.',
      },
      {
        guidance: true,
        description:
          'Use createMarkdownFrontmatter for typed document metadata. Its parse() method gives the host metadata directly; its plugin removes a complete leading block before rendering and withholds an unfinished block during streaming.',
      },
      {
        guidance: true,
        description:
          "Import createMarkdownRemarkTransform from '@astryxdesign/core/Markdown/remark' only to reuse a synchronous transform-only Remark plugin; it stays out of every other bundle and unsupported behavior keeps the last valid document with one diagnostic.",
      },
      {
        guidance: true,
        description:
          'Use inlinePlugins for prefixed identifiers, mentions, and other prose-only shorthand instead of preprocessing the markdown string.',
      },
      {
        guidance: true,
        description:
          'Provide components.math only for documents that use dollar-delimited math; the renderer owns typesetting and accessible output.',
      },
      {
        guidance: true,
        description:
          'Direct math parser calls use MathParseOptions and the explicit WithMath node unions; incremental calls also use createIncrementalState<true>() and IncrementalParseState<true>. Default calls keep the legacy unions.',
      },
      {
        guidance: true,
        description:
          'Install createMarkdownHeadingLinks() through plugins to add all-depth stable IDs and inline trailing # copy buttons to built-in headings. useContainerReveal keeps each button hidden at fine-pointer rest and keyboard/touch reachable. Unmodified activation copies the canonical URL without navigation, hash mutation, or scrolling and shows a 1.5-second check; failures stay silent. Pass the same plugin entry to Markdown-derived Outline; use headingIdPrefix for multiple instances.',
      },
      {
        guidance: false,
        description:
          'Use Markdown for hand-authored layouts; use Text and Heading directly when you control the content.',
      },
    ],
  },
  propDescriptions: {
    children: 'markdown string',
    density: "Block spacing. 'default'|'compact'. Default: 'default'.",
    headingLevelStart:
      'Maps # to this heading level (1-6). Clamped to h6. Default: 1.',
    isStreaming:
      'Incremental parse + fade-in for streamed chunks. Default: false.',
    onLinkClick:
      '(href, event) => void|false. Return false prevents navigation. Link destinations follow the shared navigation rule (see Link href), and every data: link or image URL is also dropped; rejected ones render as text.',
    sources:
      'Record<string, MarkdownSource>. Citation sources by ID. [id]/【id】 markers render as chips.',
    citationStyle:
      "'label'|'number'. label=chip w/ title+icon, number=compact badge. Default: 'label'.",
    contentWidth:
      'number|string. Max width for prose (headings, paragraphs, lists). Tables/code unconstrained.',
    contentAlign:
      "'start'|'center'. Prose alignment when contentWidth < container. Default: 'start'.",
    plugins:
      'readonly MarkdownPluginEntry[]. Ordered syntax, immutable AST transforms, and typed extension renderers from createMarkdownPlugin(), plus first-party helpers such as createMarkdownHeadingLinks(). Default: omitted or empty.',
    inlinePlugins:
      'MarkdownInlinePlugin[]. Regex matches in text nodes -> custom inline React elements. Skips inline/fenced code and math.',
    autolink:
      "'gfm'. Opt-in GFM autolinking: bare URLs (https?://, www.), <scheme:url>, <email>, user@host. Skips code, code blocks, existing links. Default: off.",
    components:
      'MarkdownComponents. Custom renderers; math({value, display}) opts into $…$/$$…$$ parsing. Renderer owns output and accessibility.',
    xstyle: 'stylex.create() for layout (margins, sizing).',
    className: 'CSS class. Prefer xstyle.',
    style: 'Inline styles. Prefer xstyle.',
    'data-testid': 'Test selector.',
  },
};
