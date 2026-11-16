// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'RichTextEditorToolbar',
  subComponentOf: 'RichTextEditor',
  description: 'Formatting toolbar for the toolbar slot of RichTextEditor.',
  displayName: 'Rich Text Editor Toolbar',
  keywords: ['richtext', 'toolbar', 'formatting', 'bold', 'link', 'heading'],
  props: [
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description:
        'Ref to the toolbar\'s root element. The ref, className, style and xstyle reach the root of the Astryx Toolbar it renders; data-*, other aria-* attributes and DOM handlers reach its role="toolbar" element.',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the toolbar element. Pass label rather than aria-label.',
      default: "'Text formatting' (translated)",
    },
    {
      name: 'headingLevels',
      type: "ReadonlyArray<'h1' | 'h2' | 'h3'>",
      description:
        'Which heading levels the block-format selector offers, in order.',
      default: "['h1', 'h2', 'h3']",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description:
        "Size of the toolbar's controls; it also sets the toolbar's padding.",
      default: "'sm'",
    },
    {
      name: 'hasLink',
      type: 'boolean',
      description:
        'Whether to show the link button. It opens a link popover anchored to the button, with one URL field applied with Enter and Remove when the selection is in a link. The popover is not modal; Escape or Cancel returns focus and the selection to the editor. With a collapsed selection the URL is inserted as link text; otherwise the selected text is linked. Only http, https, mailto and tel URLs are written.',
      default: 'true',
    },
    {
      name: 'promptForUrl',
      type: '(selectedText: string) => string | null | undefined',
      description:
        'A synchronous URL prompt that replaces the built-in link popover when the link button is pressed on a selection that is not a link. It gets the selected text; return the URL, or null or an empty string to cancel.',
    },
    {
      name: 'hasNewTabLinks',
      type: 'boolean',
      description:
        'Whether links made with the toolbar open in a new tab. When true, target="_blank" and rel="noopener noreferrer" are written into the link node, so they serialize.',
      default: 'true',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Extra items at the end of the toolbar, after a divider, such as mention or AI controls.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: "StyleX styles for the toolbar's root.",
    },
  ],
  usage: {
    description:
      "A formatting toolbar for RichTextEditor, built from Astryx Toolbar, Selector and ToggleButton controls: undo and redo, a block-format selector for paragraphs, headings, lists and quotes, inline bold, italic, underline, strikethrough and code, and links. Render it in the editor's toolbar slot; it reaches the editor through the editor's Lexical composer, so it must live inside it.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass it as toolbar={<RichTextEditorToolbar />}. The slot places it at the top of the field, before the editing surface, in the right keyboard order.',
      },
      {
        guidance: true,
        description:
          "Restyle a glyph from a theme by its richtext:* icon key (see RICHTEXT_ICON_KEYS), for example defineTheme({icons: {'richtext:bold': <MyBoldIcon />}}).",
      },
      {
        guidance: false,
        description:
          "Render it outside RichTextEditor's toolbar slot: it needs the editor's Lexical composer.",
      },
    ],
  },
};

export const docsZh = {
  "name": "RichTextEditorToolbar",
  "displayName": "Rich Text Editor Toolbar",
  "description": "用于 RichTextEditor 工具栏槽的格式工具栏。",
  "usage": {
    "description": "用于 RichTextEditor 的格式工具栏，由 Astryx Toolbar、Selector 和 ToggleButton 控件构建：撤销和重做、用于段落、标题、列表和引用的块格式选择器，行内粗体、斜体、下划线、删除线和代码，以及链接。将其渲染在编辑器的工具栏槽中；它通过编辑器的 Lexical composer 访问编辑器，因此必须位于其中。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将其作为 toolbar={<RichTextEditorToolbar />} 传入。该槽会把它放在字段顶部、编辑表面之前，并处于正确的键盘顺序中。"
      },
      {
        "guidance": true,
        "description": "通过主题按 richtext:* 图标键（参见 RICHTEXT_ICON_KEYS）重新设置字形样式，例如 defineTheme({icons: {'richtext:bold': <MyBoldIcon />}})。"
      },
      {
        "guidance": false,
        "description": "不要在 RichTextEditor 的工具栏槽之外渲染它：它需要编辑器的 Lexical composer。"
      }
    ]
  },
  "propDescriptions": {
    "ref": "指向工具栏根元素的 ref。ref、className、style 和 xstyle 会到达其渲染的 Astryx Toolbar 根元素；data-*、其他 aria-* 属性和 DOM 事件处理器会到达其 role=\"toolbar\" 元素。",
    "label": "工具栏元素的无障碍标签。请传入 label 而不是 aria-label。",
    "headingLevels": "块格式选择器提供的标题级别，按顺序排列。",
    "size": "工具栏控件的尺寸；它也会设置工具栏的内边距。",
    "hasLink": "是否显示链接按钮。它会打开锚定到按钮的链接弹出层，包含一个 URL 字段，按 Enter 应用；当选区位于链接中时显示 Remove。弹出层不是模态的；按 Escape 或 Cancel 会将焦点和选区返回到编辑器。折叠选区时，URL 会作为链接文本插入；否则会为选中的文本添加链接。仅写入 http、https、mailto 和 tel URL。",
    "promptForUrl": "同步 URL 提示，当在非链接选区上按下链接按钮时替代内置链接弹出层。它会获得选中的文本；返回 URL，或返回 null 或空字符串以取消。",
    "hasNewTabLinks": "使用工具栏创建的链接是否在新标签页中打开。为 true 时，会将 target=\"_blank\" 和 rel=\"noopener noreferrer\" 写入链接节点，因此它们会被序列化。",
    "endContent": "工具栏末尾、分隔线之后的额外项目，例如提及或 AI 控件。",
    "xstyle": "工具栏根元素的 StyleX 样式。"
  }
};
