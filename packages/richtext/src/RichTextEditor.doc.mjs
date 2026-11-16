// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'RichTextEditor',
  displayName: 'Rich Text Editor',
  category: 'Form Controls',
  keywords: [
    'richtext',
    'rich text',
    'wysiwyg',
    'editor',
    'lexical',
    'formatting',
    'contenteditable',
    'prose',
  ],
  props: [
    {
      name: 'label',
      type: 'string',
      description:
        'Label text for the editor. Always rendered for accessibility.',
      required: true,
    },
    {
      name: 'isLabelHidden',
      type: 'boolean',
      description:
        'Visually hide the label (still accessible to screen readers).',
      default: 'false',
    },
    {
      name: 'description',
      type: 'string',
      description: 'Description text displayed between the label and editor.',
    },
    {
      name: 'isOptional',
      type: 'boolean',
      description:
        'Displays an "Optional" indicator next to the label. Mutually exclusive with isRequired.',
      default: 'false',
    },
    {
      name: 'isRequired',
      type: 'boolean',
      description:
        'Displays a "Required" indicator next to the label and sets aria-required on the editable surface. Mutually exclusive with isOptional.',
      default: 'false',
    },
    {
      name: 'labelTooltip',
      type: 'string',
      description:
        'Tooltip text displayed in an info icon at the end of the label.',
    },
    {
      name: 'defaultValue',
      type: 'string',
      description:
        'Initial serialized editor state (JSON string from editorState.toJSON()). Read once on mount; the editor is uncontrolled.',
    },
    {
      name: 'onChange',
      type: '(editorState: EditorState, editor: LexicalEditor) => void',
      description:
        'Fired when content changes. Serialize with editorState.toJSON() for persistence.',
    },
    {
      name: 'placeholder',
      type: 'string',
      description:
        'Placeholder text shown when the editor is empty. Uses the same responsive body typography and text inset as the editable content.',
    },
    {
      name: 'isReadOnly',
      type: 'boolean',
      description:
        'Whether the editor is read-only (non-editable). Content stays at full opacity, in the tab order, and announced as read-only. Takes effect when changed after mount.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'Whether the editor is disabled: non-editable, dimmed, out of the tab order, and announced as disabled. Its links do not navigate and are not tab stops. Wins when isReadOnly is also set. Takes effect when changed after mount.',
      default: 'false',
    },
    {
      name: 'status',
      type: '{ type: "warning" | "error" | "success"; message?: string }',
      description:
        'Validation status. Shows a colored border and status icon; an optional message follows the statusVariant placement. Error also sets aria-invalid.',
    },
    {
      name: 'statusVariant',
      type: "'attached' | 'detached' | 'tooltip'",
      description:
        'How the status is presented: attached keeps the icon in the editor and overlaps the message below; detached floats the message below with its own icon; tooltip hides the message box and reveals it from the focusable in-editor status icon.',
      default: "'attached'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'The size of the editor, affecting internal padding.',
      default: "'md'",
    },
    {
      name: 'nodes',
      type: 'ReadonlyArray<Klass<LexicalNode>>',
      description:
        'Additional Lexical nodes to register beyond the default OSS set (Heading, Quote, List, Link, Code). Extension point for custom nodes (mentions, images) without forking.',
    },
    {
      name: 'toolbar',
      type: 'ReactNode',
      description:
        'Toolbar content rendered edge-to-edge at the top of the field, before the padded editing surface. Pass RichTextEditorToolbar here for correct visual and keyboard order.',
    },
    {
      name: 'plugins',
      type: 'ReactNode',
      description:
        'Additional Lexical plugins rendered inside the composer. Compose mentions, autolink, and other editor behavior on top of the base editor.',
    },
    {
      name: 'hasMarkdownShortcuts',
      type: 'boolean',
      description:
        'Enable Markdown shortcut typing (e.g. "# " for a heading). Uses the transformers prop (defaults to thematic breaks, the standard @lexical/markdown transformers, hard line breaks, and GFM tables). The same markers work at the start of a list item: "- ", "1. ", or "[ ] " switches its list between bullets, numbers, and tasks (so "- [ ] " typed in a paragraph makes a task item), and "# " or "> " takes a top-level item out of its list as a heading or a quote, the rest of the list continuing after it. Each change is one undo step, back to the marker as typed.',
      default: 'true',
    },
    {
      name: 'markdownExtensions',
      type: 'ReadonlyArray<RichTextMarkdownExtension>',
      description:
        'Markdown plugins whose nodes the editor draws, each adopted with createRichTextExtension. A plugin node renders exactly as core Markdown renders it and edits as one unit; a node whose plugin is not given here shows its source. Pass the extensions the content was converted with, and create them in a client module. RichTextView takes the same prop.',
    },
    {
      name: 'codeLanguages',
      type: 'ReadonlyArray<CodeLanguage>',
      description:
        'CodeBlock language values a fence may name, each imported on its own (e.g. graphql from @astryxdesign/core/CodeBlock/languages/graphql) or made with createCodeLanguage. Pass the same list as Markdown codeLanguages so a matched fence paints and labels the same while reading and editing. RichTextView takes the same prop.',
    },
    {
      name: 'transformers',
      type: 'ReadonlyArray<Transformer>',
      description:
        'Markdown transformers: the single source of truth for markdown behaviour. Defaults to thematic breaks, the standard @lexical/markdown TRANSFORMERS (with each nested list written at the content column of the item above it, so it reads back nested), hard line breaks (a line break typed with Shift+Enter exports as a backslash before the line ending, so it reads back as a line break), and GFM tables; a custom array replaces the default, thematic breaks and tables included. In Lexical the same array drives all three markdown operations (shortcut typing, markdown->state import, state->markdown export); this prop wires shortcut typing today and is the intended input for the serialization APIs added in later phases. Pass a custom array to support additional node types (e.g. transformers layered in via the nodes extension point) consistently across all three. Shortcut typing is only applied when hasMarkdownShortcuts is true.',
      default: 'TRANSFORMERS',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description: 'Automatically focus the editor on mount.',
      default: 'false',
    },
    {
      name: 'tabEscapeHint',
      type: 'string',
      description:
        'Screen-reader hint describing how to move focus out of the editor, since Tab is bound to indentation (press Escape, then Tab). Visually hidden, wired via aria-describedby. Translated for the active locale; override to change the text, or pass "" to omit.',
      default:
        "'Press Escape then Tab to move focus out of the editor.' (translated)",
    },
    {
      name: 'maxLength',
      type: 'number',
      description:
        'Maximum number of characters. When set, a character counter (current/max) is displayed below the editor. Like TextArea, does not enforce the limit natively; the counter shows error styling when the plain-text length exceeds the limit.',
    },
    {
      name: 'width',
      type: 'number | string',
      description:
        'Width of the field. Numbers are pixels, strings used as-is (e.g. "100%").',
    },
    {
      name: 'minHeight',
      type: 'SizeValue',
      description:
        'Minimum height of the editable content surface. Numbers are pixels; strings are used as CSS lengths. Content continues growing beyond this height.',
      default: "'4.5rem'",
    },
    {
      name: 'namespace',
      type: 'string',
      description: 'The Lexical composer namespace, used for editor identity.',
      default: "'astryx-editor'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value, not an inline style object.',
    },
  ],
  theming: {
    targets: [
      {
        className: 'astryx-rich-text-editor',
        // RichTextEditor.tsx reflects both through
        // themeProps('rich-text-editor', {size, status}) as `data-size` and
        // `data-status`, the same axes TextArea declares for the input visuals
        // this field container shares.
        visualProps: ['size', 'status'],
      },
    ],
  },
  usage: {
    description:
      'A WYSIWYG rich-text editor built on Lexical, styled with Astryx design tokens. Its field container shares TextArea input visuals for the resting border, hover ring, focus-within ring, disabled state, and status colors. Ships from @astryxdesign/richtext; lexical and @lexical/* are optional peer dependencies. The editor is deliberately minimal and extensible: pass toolbar, nodes, and plugins to layer richer behaviour (formatting, mentions, hover cards) on top without forking. Use RichTextView to render serialized content read-only.',
    bestPractices: [
      {
        guidance: true,
        description:
          'RichText is built on Lexical and exposes it: nodes and transformers take Lexical types, plugins takes Lexical React plugins, and onChange and getEditorState() report Lexical types. Install the lexical and @lexical/* peers (optional peers) at the Lexical minor named in the package peer ranges before importing from @astryxdesign/richtext.',
      },
      {
        guidance: true,
        description:
          'Persist content by serializing editorState.toJSON() in onChange; rehydrate via defaultValue / RichTextView value.',
      },
      {
        guidance: true,
        description:
          'Register custom node types via the nodes prop on BOTH the editor and the RichTextView so serialized content round-trips.',
      },
      {
        guidance: true,
        description:
          'Use a ref (RichTextEditorRef) to imperatively focus(), clear(), read the state via getEditorState(), serialize to Markdown via getMarkdown() or HTML via getHTML(), or reach the LexicalEditor via getEditor(). The handle is available after mount. getMarkdown() uses the same transformers prop the editor is configured with, and returns imported content as it was written: blocks nobody changed come back byte for byte, and only blocks that were edited or added are written in canonical Markdown. focus() and clear() are no-ops when the editor is read-only or disabled, and clear() resets to a single empty paragraph.',
      },
      {
        guidance: true,
        description:
          'GFM pipe tables import, edit, and export by default. The first row renders as header cells, delimiter-row colons set each column alignment, rows shorter than the widest row gain empty cells, and a wide table scrolls inside its own wrapper. Arrow keys move between cells; Tab keeps its editor meaning, so Escape then Tab still leaves the editor. Pasting a table into a table fills its cells one by one from the cell holding the caret, or within the selected cells, adding rows and columns as needed; a cell the paste does not fill keeps its text, and a table pasted with other content goes into the cell as text. Tables export in the canonical form: outer pipes and three-dash delimiters. RichTextView renders the same tables. Install @lexical/table with the other lexical peers.',
      },
      {
        guidance: true,
        description:
          'In a code block, Tab and Shift+Tab indent and outdent every line the selection touches, by the indent the block already uses: a tab when one of its lines starts with a tab, otherwise the fewest spaces an indented line starts with (2 to 8), otherwise 2 spaces. The selection stays on the same characters, and each press is one undo step. Escape then Tab still moves focus out of the editor.',
      },
      {
        guidance: true,
        description:
          'Backspace at the very start of a code block turns it into a paragraph holding its lines, each on its own line, with the caret at its start. The code never merges into the block above, so a heading above keeps its own text. Backspace anywhere else in a code block deletes as usual.',
      },
      {
        guidance: true,
        description:
          'Pasting into a code block inserts plain code. Rich content, such as a web page, a word processor document, or blocks copied from another editor, goes in as the plain text on the clipboard; when the clipboard has no plain text, each pasted block goes in as one line of its text. Headings, lists, tables, and formatting never land inside a code block.',
      },
      {
        guidance: true,
        description:
          'Cmd+A (Ctrl+A on other platforms) in a code block or a table cell selects the code or the cell text first; pressing it again selects the whole document. Anywhere else it selects the whole document at once.',
      },
      {
        guidance: true,
        description:
          'Thematic breaks (---, ***, ___, with or without spaces between) import as horizontal rules and export as ---. A dash line directly under a paragraph line stays with that paragraph, as in Markdown. Click a rule or arrow onto it to select it; Backspace removes it. RichTextView draws the same rules. Install @lexical/extension with the other lexical peers.',
      },
      {
        guidance: true,
        description:
          'To produce a defaultValue from Markdown without mounting an editor (e.g. on the server), use markdownToEditorStateJSON(markdown). Convert the other way with editorStateJSONToMarkdown(json). Both run headless via @lexical/headless and accept the same transformers/nodes options as the editor. The round trip keeps the Markdown as written: exporting unchanged content returns the input exactly, including indentation, escapes, character references, fence metadata, and constructs the editor shows as plain text, and an edit regenerates only the blocks it changed. On the server or in Node, import them from @astryxdesign/richtext/markdown, which loads no React or client code.',
      },
      {
        guidance: true,
        description:
          "To recognize a Markdown plugin made with createMarkdownPlugin, adopt it with createRichTextExtension(plugin) and pass the result in the extensions option of markdownToEditorStateJSON. Core's parser finds the plugin's syntax, and each node keeps its exact source, which is what it exports; base Markdown inside plugin source stays part of the node. A plugin that declares a transform is refused with a RichTextExtensionError, and so is a configuration that adopts one plugin twice. Without the extension, plugin syntax stays text. createRichTextExtension and the serializers are also exported from @astryxdesign/richtext/markdown for server code. Pass the same extensions to the markdownExtensions prop of RichTextEditor and RichTextView to draw the nodes: each renders as core Markdown renders it, edits as one unit (the caret steps over it; Backspace, cut, copy, and paste take it whole), and exports its exact source.",
      },
      {
        guidance: true,
        description:
          'Add a formatting toolbar with toolbar={<RichTextEditorToolbar />}. The dedicated slot places it edge-to-edge at the top of the field, before the padded editing surface, with a RichText-owned 4px control gutter and correct keyboard order. It uses small Astryx Toolbar controls: undo/redo, a divided block-format Selector for paragraphs/headings/lists/quotes, then divided inline ToggleButtons for bold/italic/underline/strikethrough/code and links. The complete action row scrolls horizontally when space is tight, keeping every control directly available without a More menu. The Selector keeps its default adaptive placement. Compose extra controls via endContent.',
      },
      {
        guidance: true,
        description:
          'Links: the toolbar Link button (on by default; disable with hasLink={false}) and Cmd/Ctrl+K open a non-modal Astryx Popover anchored to the button. It holds one URL field, applied with Enter, and Apply, Remove (when the selection is in a link), and Cancel icon buttons with tooltips. It keeps the Lexical selection while focus is in the field: Escape or Cancel closes it and returns focus and the selection to the editor, and a URL that cannot be linked shows an error under the field, which keeps focus. Pass promptForUrl only when integrating an existing synchronous URL flow; it replaces the popover. Entered URLs are sanitized (only http/https/mailto/tel are written; javascript:/data: are rejected). Links open in a new tab by default: target=_blank and rel=noopener noreferrer are written into the link node data; set hasNewTabLinks={false} for same-tab links. The toolbar takes base props and passes them to the Astryx Toolbar it renders: ref, className, style and xstyle on its root; data-*, other aria-* attributes and DOM handlers on the toolbar element (name it with label, not aria-label).',
      },
      {
        guidance: true,
        description:
          'Auto-linking: render RichTextEditorAutoLinkPlugin in the plugins slot to turn typed/pasted URLs and emails into links automatically. Created links open in a new tab by default (target=_blank, rel=noopener noreferrer, baked into the node). Pass matchers to recognize additional patterns (build them with createLinkMatcherWithRegExp).',
      },
      {
        guidance: true,
        description:
          "The toolbar's glyphs are themeable. Each control resolves its icon from the core icon registry under a stable richtext:* key (see RICHTEXT_ICON_KEYS), falling back to a bundled inline SVG. A theme restyles any glyph without forking the toolbar by naming its key: defineTheme({icons: {'richtext:bold': <MyBoldIcon />}}). Undo and redo mirror under right-to-left direction, whichever glyph draws them.",
      },
      {
        guidance: true,
        description:
          "To switch between reading (Markdown or RichTextView) and editing the same document in place, give the editor's field its inset and border outside the reading width, so every paragraph keeps its line count across the switch. Define the frame with stylex.create, for example const inPlace = stylex.create({editorFrame: {marginInline: `calc(-1 * (${spacingVars['--spacing-2']} + ${borderVars['--border-width']}))`}}), with spacingVars and borderVars from @astryxdesign/core/theme/tokens.stylex, and pass xstyle={inPlace.editorFrame} to the RichTextEditor. The recipe assumes no status: a status icon reserves another spacing-6 at the inline end. The field then extends past the column on both sides; leave room for it in the surrounding padding. A standalone editor in a form keeps its default width, so its border lines up with the fields around it.",
      },
      {
        guidance: false,
        description:
          'Use for single-line input or plain text; use TextInput or TextArea for those.',
      },
    ],
  },
};

export const docsZh = {
  "name": "RichTextEditor",
  "displayName": "Rich Text Editor",
  "usage": {
    "description": "基于 Lexical 构建的 WYSIWYG 富文本编辑器，使用 Astryx 设计令牌设置样式。其字段容器沿用 TextArea 的输入框视觉效果，包括静止边框、悬停环、focus-within 环、禁用状态和状态颜色。从 @astryxdesign/richtext 发布；lexical 和 @lexical/* 是可选 peer 依赖。该编辑器刻意保持精简且可扩展：传入 toolbar、nodes 和 plugins，即可在不分叉的情况下叠加更丰富的行为（格式、提及、悬停卡片）。使用 RichTextView 以只读方式渲染序列化内容。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "RichText 基于 Lexical 构建并暴露它：nodes 和 transformers 接受 Lexical 类型，plugins 接受 Lexical React 插件，onChange 和 getEditorState() 报告 Lexical 类型。在从 @astryxdesign/richtext 导入之前，请安装包 peer 范围中指定的 Lexical 次版本的 lexical 和 @lexical/* peer（可选 peer）。"
      },
      {
        "guidance": true,
        "description": "在 onChange 中序列化 editorState.toJSON() 来持久化内容；通过 defaultValue / RichTextView value 重新水合。"
      },
      {
        "guidance": true,
        "description": "通过编辑器与 RichTextView 两者上的 nodes 属性注册自定义节点类型，使序列化内容能够往返。"
      },
      {
        "guidance": true,
        "description": "使用 ref（RichTextEditorRef）以命令式地 focus()、clear()、通过 getEditorState() 读取状态、通过 getMarkdown() 序列化为 Markdown 或通过 getHTML() 序列化为 HTML，或通过 getEditor() 访问 LexicalEditor。句柄在挂载后可用。getMarkdown() 使用编辑器配置的同一个 transformers 属性，并按原样返回导入的内容：没有人改动过的块会逐字节返回，只有被编辑或添加的块才会以规范 Markdown 写出。当编辑器为只读或禁用时，focus() 和 clear() 为无操作，clear() 会重置为单个空段落。"
      },
      {
        "guidance": true,
        "description": "GFM 管道表格默认支持导入、编辑和导出。第一行渲染为表头单元格，分隔行的冒号设置各列对齐，比最宽行短的行会获得空单元格，宽表格会在自己的包装内滚动。方向键在单元格之间移动；Tab 保留其编辑器含义，因此 Escape 后按 Tab 仍会离开编辑器。将表格粘贴到表格中时，会从光标所在单元格开始逐个填充单元格，或在选中的单元格内填充，并按需添加行和列；粘贴未填充的单元格保留其文本，与其他内容一起粘贴的表格会作为文本进入单元格。表格以规范形式导出：外管道符和三短横分隔符。RichTextView 渲染相同的表格。请与其他 lexical peer 一起安装 @lexical/table。"
      },
      {
        "guidance": true,
        "description": "在代码块中，Tab 和 Shift+Tab 会按该块已使用的缩进，对选区触及的每一行进行缩进和反缩进：若其中一行以制表符开头则用制表符，否则使用有缩进行中最少的空格数（2 到 8），否则使用 2 个空格。选区保持在相同字符上，每次按压是一个撤销步骤。Escape 后按 Tab 仍会将焦点移出编辑器。"
      },
      {
        "guidance": true,
        "description": "在代码块最开头按 Backspace 会将其变为包含其各行内容的段落，每行单独一行，光标位于开头。代码绝不会合并到上方块中，因此上方的标题会保留自己的文本。在代码块的其他任何位置按 Backspace 会照常删除。"
      },
      {
        "guidance": true,
        "description": "粘贴到代码块中会插入纯代码。富内容（例如网页、文字处理文档或从其他编辑器复制的块）会以剪贴板上的纯文本插入；当剪贴板没有纯文本时，每个粘贴的块会作为其文本的一行插入。标题、列表、表格和格式绝不会落入代码块内。"
      },
      {
        "guidance": true,
        "description": "在代码块或表格单元格中按 Cmd+A（其他平台为 Ctrl+A）会先选择代码或单元格文本；再次按压会选择整个文档。在其他任何位置，它会一次选择整个文档。"
      },
      {
        "guidance": true,
        "description": "主题分隔线（---、***、___，中间可有或没有空格）会导入为水平线，并导出为 ---。紧挨在段落行下方的短横线会保留在该段落中，与 Markdown 中一致。点击分隔线或用方向键移到其上即可选中；按 Backspace 可移除。RichTextView 绘制相同的分隔线。请与其他 lexical peer 一起安装 @lexical/extension。"
      },
      {
        "guidance": true,
        "description": "要在不挂载编辑器的情况下（例如在服务器上）从 Markdown 生成 defaultValue，请使用 markdownToEditorStateJSON(markdown)。反向转换请使用 editorStateJSONToMarkdown(json)。两者都通过 @lexical/headless 无头运行，并接受与编辑器相同的 transformers/nodes 选项。往返会保留 Markdown 的原样：导出未更改的内容会精确返回输入，包括缩进、转义、字符引用、围栏元数据，以及编辑器显示为纯文本的构造；编辑只会重新生成更改过的块。在服务器或 Node 中，请从 @astryxdesign/richtext/markdown 导入它们，该入口不加载任何 React 或客户端代码。"
      },
      {
        "guidance": true,
        "description": "要识别用 createMarkdownPlugin 创建的 Markdown 插件，请用 createRichTextExtension(plugin) 采纳它，并将结果传入 markdownToEditorStateJSON 的 extensions 选项。核心解析器会找到该插件的语法，每个节点会保留其精确源文本，也就是它导出的内容；插件源中的基础 Markdown 仍是节点的一部分。声明 transform 的插件会被 RichTextExtensionError 拒绝，重复采纳同一插件的配置也会被拒绝。没有该扩展时，插件语法会保持为文本。createRichTextExtension 和序列化器也从 @astryxdesign/richtext/markdown 导出，供服务器代码使用。将相同的 extensions 传给 RichTextEditor 和 RichTextView 的 markdownExtensions 属性以绘制这些节点：每个节点会像核心 Markdown 一样渲染，作为一个整体编辑（光标会跨过它；Backspace、剪切、复制和粘贴会整体处理它），并导出其精确源文本。"
      },
      {
        "guidance": true,
        "description": "通过 toolbar={<RichTextEditorToolbar />} 添加格式工具栏。专用插槽会将其贴边放在字段顶部、带内边距的编辑表面之前，带有 RichText 自有的 4px 控件间隔和正确的键盘顺序。它使用小型 Astryx Toolbar 控件：撤销/重做，一个带分隔的块格式 Selector（段落/标题/列表/引用），然后是带分隔的行内 ToggleButton（粗体/斜体/下划线/删除线/代码）和链接。完整的操作行在空间紧张时会水平滚动，使每个控件都直接可用，无需“更多”菜单。Selector 保留其默认自适应放置。通过 endContent 组合额外控件。"
      },
      {
        "guidance": true,
        "description": "链接：工具栏的链接按钮（默认开启；可通过 hasLink={false} 禁用）和 Cmd/Ctrl+K 会打开一个锚定到该按钮的非模态 Astryx Popover。它包含一个 URL 字段，按 Enter 应用，以及带工具提示的 Apply、Remove（当选区位于链接中时）和 Cancel 图标按钮。焦点在字段中时，它会保留 Lexical 选区：Escape 或 Cancel 会关闭它，并将焦点和选区返回到编辑器；无法链接的 URL 会在字段下方显示错误，并保持焦点。仅在集成现有同步 URL 流程时传入 promptForUrl；它会替代该弹出层。输入的 URL 会被净化（仅写入 http/https/mailto/tel；javascript:/data: 会被拒绝）。链接默认在新标签页打开：target=_blank 和 rel=noopener noreferrer 会写入链接节点数据；同标签页链接请设置 hasNewTabLinks={false}。工具栏接受基础属性并传递给其渲染的 Astryx Toolbar：ref、className、style 和 xstyle 作用于其根元素；data-*、其他 aria-* 属性和 DOM 处理函数作用于工具栏元素（用 label 命名，而不是 aria-label）。"
      },
      {
        "guidance": true,
        "description": "自动链接：在 plugins 插槽中渲染 RichTextEditorAutoLinkPlugin，可将输入/粘贴的 URL 和电子邮件自动转换为链接。创建的链接默认在新标签页打开（target=_blank、rel=noopener noreferrer，已写入节点）。传入 matchers 以识别其他模式（使用 createLinkMatcherWithRegExp 构建）。"
      },
      {
        "guidance": true,
        "description": "工具栏的图形可主题化。每个控件都会从核心图标注册表中按稳定的 richtext:* 键解析其图标（见 RICHTEXT_ICON_KEYS），并回退到内置的内联 SVG。主题可通过命名其键来重新设置任何图形的样式，而无需分叉工具栏：defineTheme({icons: {'richtext:bold': <MyBoldIcon />}})。撤销和重做在从右到左方向下会镜像，无论使用哪种图形绘制。"
      },
      {
        "guidance": true,
        "description": "要在同一文档的就地阅读（Markdown 或 RichTextView）与编辑之间切换，请在阅读宽度之外为编辑器的字段提供内缩和边框，使每个段落在切换时保持其行数。使用 stylex.create 定义框架，例如 const inPlace = stylex.create({editorFrame: {marginInline: `calc(-1 * (${spacingVars['--spacing-2']} + ${borderVars['--border-width']}))`}})，其中 spacingVars 和 borderVars 来自 @astryxdesign/core/theme/tokens.stylex，并将 xstyle={inPlace.editorFrame} 传给 RichTextEditor。该方案假设没有状态：状态图标会在行内末端再占用 spacing-6。字段随后会在两侧超出列；请在周围内边距中为其留出空间。表单中的独立编辑器会保持默认宽度，因此其边框会与周围字段对齐。"
      },
      {
        "guidance": false,
        "description": "不要用于单行输入或纯文本；这些请使用 TextInput 或 TextArea。"
      }
    ]
  },
  "propDescriptions": {
    "label": "编辑器的标签文本。始终为无障碍而渲染。",
    "isLabelHidden": "在视觉上隐藏标签（屏幕阅读器仍可访问）。",
    "description": "显示在标签和编辑器之间的描述文本。",
    "isOptional": "在标签旁显示“可选”指示器。与 isRequired 互斥。",
    "isRequired": "在标签旁显示“必填”指示器，并在可编辑表面设置 aria-required。与 isOptional 互斥。",
    "labelTooltip": "显示在标签末端信息图标中的工具提示文本。",
    "defaultValue": "初始序列化编辑器状态（来自 editorState.toJSON() 的 JSON 字符串）。仅在挂载时读取一次；编辑器是非受控的。",
    "onChange": "内容变化时触发。使用 editorState.toJSON() 序列化以持久化。",
    "placeholder": "编辑器为空时显示的占位文本。使用与可编辑内容相同的响应式正文排版和文本内缩。",
    "isReadOnly": "编辑器是否只读（不可编辑）。内容保持完全不透明、保留在 Tab 顺序中，并播报为只读。挂载后更改会生效。",
    "isDisabled": "编辑器是否禁用：不可编辑、变暗、移出 Tab 顺序，并播报为禁用。其链接不会导航，也不是 Tab 停靠点。同时设置 isReadOnly 时此项优先。挂载后更改会生效。",
    "status": "验证状态。显示彩色边框和状态图标；可选消息遵循 statusVariant 的放置方式。Error 还会设置 aria-invalid。",
    "statusVariant": "状态如何呈现：attached 将图标保留在编辑器内，并将消息重叠在下方；detached 将消息浮动在下方并带自己的图标；tooltip 隐藏消息框，并通过编辑器内可聚焦的状态图标显示。",
    "size": "编辑器尺寸，影响内部内边距。",
    "nodes": "除默认 OSS 集合（Heading、Quote、List、Link、Code）之外要注册的额外 Lexical 节点。用于自定义节点（提及、图片）的扩展点，无需分叉。",
    "toolbar": "在字段顶部、带内边距的编辑表面之前贴边渲染的工具栏内容。此处传入 RichTextEditorToolbar 以获得正确的视觉和键盘顺序。",
    "plugins": "在 composer 内渲染的额外 Lexical 插件。在基础编辑器之上组合提及、自动链接和其他编辑器行为。",
    "hasMarkdownShortcuts": "启用 Markdown 快捷输入（例如输入“# ”创建标题）。使用 transformers 属性（默认为主题分隔线、标准 @lexical/markdown transformers、硬换行和 GFM 表格）。相同的标记在列表项开头也有效：“- ”、“1. ”或“[ ] ”会在项目符号、编号和任务之间切换其列表（因此在段落中输入“- [ ] ”会创建任务项），而“# ”或“> ”会将顶层项移出列表，变为标题或引用，列表其余部分在其后继续。每次更改都是一个撤销步骤，可回到输入时的标记。",
    "markdownExtensions": "编辑器绘制其节点的 Markdown 插件，每个都用 createRichTextExtension 采纳。插件节点会完全按照核心 Markdown 的渲染方式渲染，并作为一个整体编辑；未在此处提供其插件的节点会显示其源文本。传入内容转换时使用的 extensions，并请在客户端模块中创建它们。RichTextView 接受相同的属性。",
    "codeLanguages": "围栏可命名的 CodeBlock 语言值，每个单独导入（例如从 @astryxdesign/core/CodeBlock/languages/graphql 导入 graphql）或用 createCodeLanguage 创建。将相同的列表作为 Markdown codeLanguages 传入，使匹配的围栏在阅读和编辑时以相同方式绘制和标注。RichTextView 接受相同的属性。",
    "transformers": "Markdown transformers：markdown 行为的唯一事实来源。默认为主题分隔线、标准 @lexical/markdown TRANSFORMERS（每个嵌套列表写在其上方项的内容列处，因此可以读回嵌套结构）、硬换行（用 Shift+Enter 输入的换行在行尾前导出为反斜杠，因此可以读回为换行）和 GFM 表格；自定义数组会替换默认值，包括主题分隔线和表格。在 Lexical 中，同一个数组驱动所有三个 markdown 操作（快捷输入、markdown->state 导入、state->markdown 导出）；此属性目前接入快捷输入，并且是后续阶段添加的序列化 API 的预期输入。传入自定义数组可支持其他节点类型（例如通过 nodes 扩展点分层的 transformers），并在所有三个操作中保持一致。仅当 hasMarkdownShortcuts 为 true 时才应用快捷输入。",
    "hasAutoFocus": "挂载时自动聚焦编辑器。",
    "tabEscapeHint": "描述如何将焦点移出编辑器的屏幕阅读器提示，因为 Tab 绑定到缩进（按 Escape，然后按 Tab）。视觉上隐藏，通过 aria-describedby 关联。已针对当前语言环境翻译；可覆盖以更改文本，或传入 \"\" 省略。",
    "maxLength": "最大字符数。设置后，编辑器下方会显示字符计数器（当前/最大）。与 TextArea 一样，不会原生强制执行限制；当纯文本长度超过限制时，计数器会显示错误样式。",
    "width": "字段宽度。数字表示像素，字符串按原样使用（例如 \"100%\"）。",
    "minHeight": "可编辑内容表面的最小高度。数字表示像素；字符串用作 CSS 长度。内容会在此高度之外继续增长。",
    "namespace": "Lexical composer 命名空间，用于编辑器标识。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 `stylex.create()` 的值，不能是内联样式对象。"
  }
};
