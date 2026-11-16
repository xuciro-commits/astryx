// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CodeBlock',
  displayName: 'Code Block',
  category: 'Content',
  keywords: [
    'code',
    'syntax',
    'highlight',
    'snippet',
    'prism',
    'shiki',
    'pre',
    'monospace',
    'codeblock',
    'inline',
  ],
  description:
    'Fenced code block with syntax highlighting. Use for multi-line code snippets.',
  props: [
    {
      name: 'code',
      type: 'string',
      description: 'The code string to display.',
      required: true,
    },
    {
      name: 'language',
      type: 'string | CodeLanguage',
      description:
        'Language for syntax highlighting. A string selects a built-in: ts, js, tsx, jsx, json, html, xml, svg, css, scss, less, python, bash/sh/zsh/shell, php, hack, yaml, markdown, c, cpp (c++, cc, cxx, hpp, hh), sql, rust, kotlin, swift, go. Any other language is a value you import on its own and pass here: graphql, java, thrift, objectiveC, toml, powershell, ruby, lua, dockerfile from @astryxdesign/core/CodeBlock/languages/<path> (e.g. languages/graphql, languages/objective-c), or your own made with createCodeLanguage({name, identifiers, tokenize}). A value labels with its name and reflects its first identifier as data-language. Use "plaintext" to disable.',
      default: "'plaintext'",
    },
    {
      name: 'title',
      type: 'string',
      description: 'Filename or label shown in the header bar.',
    },
    {
      name: 'hasLanguageLabel',
      type: 'boolean',
      description:
        'Show the language name in the header bar. Hidden when language is "plaintext".',
      default: 'true',
    },
    {
      name: 'hasLineNumbers',
      type: 'boolean',
      description: 'Show a line number gutter.',
      default: 'false',
    },
    {
      name: 'startLineNumber',
      type: 'number',
      description:
        'First line number shown in the gutter. The gutter shows file coordinates (startLineNumber + index) so a code excerpt reads with its real line numbers. highlightLines uses the same file coordinates. Values below 1 clamp to 1.',
      default: '1',
    },
    {
      name: 'highlightLines',
      type: 'number[]',
      description:
        '1-indexed line numbers to highlight, in the same file coordinates as the gutter (see startLineNumber). Out-of-range entries render no highlight.',
    },
    {
      name: 'isDiff',
      type: 'boolean',
      default: 'false',
      description:
        'Render the code as a unified diff over `language`: lines starting with + are added, - removed, @@ is a hunk header (a `--- `/`+++ ` file-header pair directly before one is a header too), anything else is context. The language label reads `diff` or `<language> diff`. The glyph sits in its own column and the rest of each line keeps syntax highlighting; copy returns the exact source. Markdown ```diff and ```diff-<lang> fences set this.',
    },
    {
      name: 'hasCopyButton',
      type: 'boolean',
      description: 'Show a copy-to-clipboard button.',
      default: 'true',
    },
    {
      name: 'onCopy',
      type: '() => void',
      description: 'Callback after the code is copied.',
    },
    {
      name: 'onCopyError',
      type: '(error: unknown) => void',
      description:
        'Called once with the rejection when the clipboard write fails. The copy button shows a cross and is named and announced as "Failed to copy value to clipboard."; the error is not shown.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Your own controls, shown just before Copy: in the header when the block has one, otherwise beside the code in the top inline-end corner, never over it. It never creates a header and never collapses the block. Ghost sm IconButtons match Copy’s size and variant.',
      slotElements: [
        {
          __element: 'IconButton',
          props: {
            variant: 'ghost',
            size: 'sm',
            label: 'Run in terminal',
          },
        },
      ],
    },
    {
      name: 'isWrapped',
      type: 'boolean',
      description: 'Wrap long lines instead of enabling horizontal scroll.',
      default: 'false',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Max height before the block scrolls vertically.',
    },
    {
      name: 'size',
      type: "'sm' | 'md'",
      description: 'Text size variant.',
      default: "'md'",
    },
    {
      name: 'width',
      type: 'string',
      description:
        "Width of the code block. Any CSS width value. 'fit-content' (default) shrinks to longest line. '100%' fills parent width.",
      default: "'fit-content'",
    },
    {
      name: 'container',
      type: "'card' | 'section'",
      description:
        "Container presentation style. 'card' (default): border and radius with the muted syntax background for a standalone card look. 'section': no border or radius and a transparent background so the block blends into the card or panel it's embedded in.",
      default: "'card'",
    },
    {
      name: 'tokenizer',
      type: '(code: string, language: string) => Array<{type: string; start: number; end: number}>',
      description:
        'Deprecated: pass language={createCodeLanguage({name, identifiers, tokenize})} with this same function instead. Still works exactly as released and wins over the language; astryx upgrade rewrites static uses.',
    },
    {
      name: 'syntaxTheme',
      type: 'SyntaxThemeDefinition',
      description:
        'Per-instance syntax theme override. Shorthand for wrapping the block in <SyntaxTheme theme={...}>. Accepts a preset from @astryxdesign/core/theme/syntax or a theme created with defineSyntaxTheme(). Defaults to the nearest SyntaxTheme ancestor or the theme-level syntax colors.',
    },
    {
      name: 'highlightMode',
      type: "'auto' | 'ranges' | 'spans'",
      description: 'Syntax highlighting rendering mode.',
      default: "'auto'",
    },
    {
      name: 'isCollapsible',
      type: 'boolean',
      description:
        'Allow collapsing the code body into just the header bar. Starts expanded; a visible header becomes clickable when the code exceeds collapsibleThreshold lines. Headerless blocks never collapse, and removing the header expands a previously collapsed block.',
      default: 'false',
    },
    {
      name: 'collapsibleThreshold',
      type: 'number',
      description:
        'Minimum number of lines before the collapse toggle appears. Below this threshold the code block renders normally even when isCollapsible is true.',
      default: '10',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLPreElement>',
      description: 'Ref forwarded to the root code-block element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value.',
    },
    {
      name: 'className',
      type: 'string',
      description:
        'CSS class name for the root element. Prefer xstyle for styling.',
    },
    {
      name: 'style',
      type: 'CSSProperties',
      description: 'Inline styles. Prefer xstyle for StyleX-optimized styling.',
    },
    {
      name: 'data-testid',
      type: 'string',
      description: 'Test selector for automated testing frameworks.',
    },
  ],
  components: [{name: 'Code'}],
  playground: {
    defaults: {
      code: 'import {Button} from \'@astryxdesign/core/Button\';\n\nexport function App() {\n  return <Button label="Hello" variant="primary" />;\n}',
      language: 'tsx',
      hasCopyButton: true,
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-code-block',
        visualProps: ['size', 'language', 'container'],
      },
      {
        className: 'astryx-code-block-header',
        visualProps: ['size', 'language', 'container'],
      },
      {className: 'astryx-code-block-title', visualProps: ['size', 'language']},
      {className: 'astryx-code-block-copy-button'},
    ],
    vars: [
      {
        name: '--_codeblock-gutter-width',
        description:
          'Width of the line-number gutter, computed from the digit count of the last line so the code column starts at a stable offset.',
        default: '2ch',
        private: true,
      },
    ],
    componentIcons: [
      {
        slot: 'code-block-copy',
        description: 'The copy button icon.',
        fallback:
          '`copy`; `check` while copied; `close` while a failed copy shows',
        state: [
          {
            name: 'copied',
            type: 'boolean',
            description:
              'True while the copied feedback shows after a successful copy. False while a failed copy shows, so a theme that maps the slot draws its rest glyph then; the button is still named and announced as the failure.',
          },
        ],
        whenNull:
          'Hides the glyph. The button keeps its size, name, tooltip, and copy action.',
      },
    ],
  },
  usage: {
    description:
      'CodeBlock renders syntax-highlighted code with line numbers, a copy button, and optional collapsible sections. Use CodeBlock for multi-line snippets like source files, terminal commands, and configuration examples. Use Code for inline references to function names, variables, or CLI flags within body text.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set the language prop to match the code content so syntax highlighting is accurate. Use "plaintext" when the language is unknown.',
      },
      {
        guidance: true,
        description:
          'Add a title when the code represents a file. It gives readers context and appears in the header bar alongside the copy button.',
      },
      {
        guidance: true,
        description:
          'Use Code for short inline references like function names or CLI flags, and CodeBlock for standalone multi-line snippets.',
      },
      {
        guidance: false,
        description:
          'Enable line numbers on short snippets (under 5 lines) where they add clutter without helping navigation.',
      },
      {
        guidance: false,
        description:
          'Nest a code block inside a scrollable container. Use the maxHeight prop instead, which handles overflow natively.',
      },
    ],
    anatomy: [
      {
        name: 'Header Bar',
        required: false,
        description:
          'Shows the title, visible language label, endContent, and copy button when a header is present. A title or visible language label creates the header at every line count. With no title and hasLanguageLabel={false}, endContent and the copy button sit in their own column beside the code, centred on the first line, and never cover it; a one-line block then reads as a single row.',
      },
      {
        name: 'Header Title',
        required: false,
        description:
          'Groups the optional title, visible language label, and collapsible chevron inside the header bar.',
      },
      {
        name: 'Line Numbers',
        required: false,
        description:
          'Numbered gutter along the left edge. Enable with hasLineNumbers.',
      },
      {
        name: 'Code Body',
        required: true,
        description: 'The syntax-highlighted code content.',
      },
      {
        name: 'Highlighted Lines',
        required: false,
        description: 'Background accent on specific lines to draw attention.',
      },
      {
        name: 'Copy Button',
        required: false,
        description:
          'Copies the code string to the clipboard. Shown by default.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "CodeBlock 渲染带语法高亮、行号、复制按钮和可选折叠区域的代码。用于源文件、终端命令和配置示例等多行片段。正文中对函数名、变量或 CLI 标志的行内引用请使用 Code。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 language 属性设置为与代码内容匹配，确保语法高亮准确。语言未知时使用 \"plaintext\"。"
      },
      {
        "guidance": true,
        "description": "当代码表示文件时添加 title。它为读者提供上下文，并显示在标题栏中复制按钮旁边。"
      },
      {
        "guidance": true,
        "description": "短小行内引用（如函数名或 CLI 标志）使用 Code，独立的多行片段使用 CodeBlock。"
      },
      {
        "guidance": false,
        "description": "在不足 5 行的短片段上启用行号，它们只会增加杂乱而无助于导航。"
      },
      {
        "guidance": false,
        "description": "将代码块嵌套在可滚动容器中。请改用 maxHeight 属性，它原生处理溢出。"
      }
    ],
    "anatomy": [
      {
        "name": "标题栏",
        "required": false,
        "description": "存在标题栏时显示标题、可见语言标签、endContent 和复制按钮。标题或可见语言标签会在任意行数下创建标题栏。无标题且 hasLanguageLabel={false} 时，endContent 和复制按钮位于代码旁边独立的列中，首行居中且绝不会覆盖代码；此时单行代码块呈现为单行。"
      },
      {
        "name": "标题栏标题",
        "required": false,
        "description": "将可选标题、可见语言标签和折叠尖角符号组合在标题栏内。"
      },
      {
        "name": "行号",
        "required": false,
        "description": "左边缘的编号装订线。通过 hasLineNumbers 启用。"
      },
      {
        "name": "代码主体",
        "required": true,
        "description": "经过语法高亮的代码内容。"
      },
      {
        "name": "高亮行",
        "required": false,
        "description": "针对特定行的背景强调，用于吸引注意。"
      },
      {
        "name": "复制按钮",
        "required": false,
        "description": "将代码字符串复制到剪贴板。默认显示。"
      }
    ]
  },
  "name": "CodeBlock",
  "displayName": "Code Block",
  "description": "带语法高亮的围栏代码块。用于多行代码片段。",
  "propDescriptions": {
    "code": "要显示的代码字符串。",
    "language": "用于语法高亮的语言。字符串可选择内置语言：ts、js、tsx、jsx、json、html、xml、svg、css、scss、less、python、bash/sh/zsh/shell、php、hack、yaml、markdown、c、cpp（c++、cc、cxx、hpp、hh）、sql、rust、kotlin、swift、go。其他语言需要单独导入后传入：graphql、java、thrift、objectiveC、toml、powershell、ruby、lua、dockerfile，来自 @astryxdesign/core/CodeBlock/languages/<path>（例如 languages/graphql、languages/objective-c），或用 createCodeLanguage({name, identifiers, tokenize}) 自行创建。值会用其名称标注，并将首个标识符反映为 data-language。使用 \"plaintext\" 可禁用高亮。",
    "title": "显示在标题栏中的文件名或标签。",
    "hasLanguageLabel": "在标题栏中显示语言名称。language 为 \"plaintext\" 时隐藏。",
    "hasLineNumbers": "显示行号装订线。",
    "startLineNumber": "装订线中显示的第一行行号。装订线显示文件坐标（startLineNumber + index），因此代码摘录能按其真实行号阅读。highlightLines 使用相同的文件坐标。小于 1 的值会钳制为 1。",
    "highlightLines": "要高亮的行号（从 1 开始），与装订线使用相同的文件坐标（见 startLineNumber）。超出范围的条目不会渲染高亮。",
    "isDiff": "将代码渲染为基于 `language` 的统一 diff：以 + 开头的行表示新增，- 表示删除，@@ 是 hunk 头（紧邻其前的 `--- `/`+++ ` 文件头对也算文件头），其他内容为上下文。语言标签显示为 `diff` 或 `<language> diff`。字形位于独立列中，每行其余部分保留语法高亮；复制会返回精确的原始内容。Markdown 的 ```diff 和 ```diff-<lang> 围栏会启用此功能。",
    "hasCopyButton": "显示复制到剪贴板按钮。",
    "onCopy": "复制代码后的回调。",
    "onCopyError": "剪贴板写入失败时以拒绝原因调用一次。复制按钮会显示叉号，并被命名为并播报为 \"Failed to copy value to clipboard.\"；错误本身不会显示。",
    "endContent": "自定义控件，显示在 Copy 之前：代码块有标题栏时位于标题栏中，否则位于代码旁边右上角的行内末端，绝不会覆盖代码。它不会创建标题栏，也不会折叠代码块。Ghost sm IconButton 与 Copy 的尺寸和变体一致。",
    "isWrapped": "换行显示长行，而不是启用水平滚动。",
    "maxHeight": "代码块垂直滚动前的最大高度。",
    "size": "文本尺寸变体。",
    "width": "代码块的宽度。任意 CSS 宽度值。'fit-content'（默认）收缩到最长行。'100%' 填满父元素宽度。",
    "container": "容器呈现样式。'card'（默认）：带边框和圆角，使用弱化的语法背景，呈现独立卡片外观。'section'：无边框或圆角，背景透明，使代码块融入其嵌入的卡片或面板。",
    "tokenizer": "已弃用：请改为传入 language={createCodeLanguage({name, identifiers, tokenize})}，使用同一个函数。它仍按已发布的方式工作，并优先于 language；astryx upgrade 会重写静态用法。",
    "syntaxTheme": "按实例覆盖语法主题。将代码块包裹在 <SyntaxTheme theme={...}> 中的简写。接受 @astryxdesign/core/theme/syntax 中的预设，或用 defineSyntaxTheme() 创建的主题。默认为最近的 SyntaxTheme 祖先或主题级语法颜色。",
    "highlightMode": "语法高亮渲染模式。",
    "isCollapsible": "允许将代码主体折叠为仅标题栏。初始为展开；当代码超过 collapsibleThreshold 行时，可见标题栏变为可点击。无标题栏的代码块永不折叠，移除标题栏会展开先前折叠的代码块。",
    "collapsibleThreshold": "折叠切换出现前的最小行数。低于此阈值时，即使 isCollapsible 为 true，代码块也正常渲染。",
    "ref": "转发到根代码块元素的 ref。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 `stylex.create()` 值。",
    "className": "根元素的 CSS 类名。样式设置请优先使用 xstyle。",
    "style": "内联样式。StyleX 优化样式请优先使用 xstyle。",
    "data-testid": "用于自动化测试框架的测试选择器。"
  },
  "components": [
    {
      "name": "Code",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'syntax-highlighted code block via CSS Custom Highlight API (0-DOM overhead); span-based fallback; Code for inline code in prose',
  usage: {
    description:
      'CodeBlock renders syntax-highlighted code with line numbers, a copy button, and optional collapsible sections. Use CodeBlock for multi-line snippets like source files, terminal commands, and configuration examples. Use Code for inline references to function names, variables, or CLI flags within body text.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Set the language prop to match the code content so syntax highlighting is accurate. Use "plaintext" when the language is unknown.',
      },
      {
        guidance: true,
        description:
          'Add a title when the code represents a file. It gives readers context and appears in the header bar alongside the copy button.',
      },
      {
        guidance: true,
        description:
          'Use Code for short inline references like function names or CLI flags, and CodeBlock for standalone multi-line snippets.',
      },
      {
        guidance: false,
        description:
          'Enable line numbers on short snippets (under 5 lines) where they add clutter without helping navigation.',
      },
      {
        guidance: false,
        description:
          'Nest a code block inside a scrollable container. Use the maxHeight prop instead, which handles overflow natively.',
      },
    ],
  },
};
