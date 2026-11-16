// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DiffViewer',
  displayName: 'Diff Viewer',
  group: 'DiffViewer',
  category: 'Content',
  keywords: [
    'diff',
    'patch',
    'code review',
    'changes',
    'split',
    'unified',
    'side by side',
    'compare',
    'word diff',
    'inline highlight',
  ],

  theming: {
    targets: [
      {className: 'astryx-diff-viewer', visualProps: ['viewMode']},
      {className: 'astryx-diff-viewer-header'},
      {className: 'astryx-diff-viewer-path'},
    ],
  },

  usage: {
    description:
      'Read-only, syntax-highlighted diff of one file for code review surfaces. Renders a file header (path, Added/Deleted/Renamed token, +/− line counts, a headerEnd slot, and an optional disclosure) over the file\'s hunks in unified or split (side-by-side) view. Rows use the same syntax-theme diff slots as CodeBlock with isDiff, so one syntax theme styles both. renderLineAnnotation adds a full-width row under any line (for review comments) and onLineNumberClick turns line numbers into buttons. Build the file model with parseUnifiedDiff(patch), which returns one file per file in a git or diff -u patch, or with createDiffFile({oldValue, newValue}) when you hold two versions of a text. Display options cover how a change is marked (classic +/− glyphs, bars, or none), whether changed rows are tinted, and word- or character-level highlighting of what changed inside each removed/added line pair. Each changed line carries a visually hidden "Added"/"Removed" label, so the change reads without colour in every mode. Unwrapped, line numbers and change indicators stay pinned while the code scrolls; in split view each side is its own scroller, so the split stays fixed at half and half, the sides scroll sideways in lockstep, and a row is as tall as its taller side. While code overflows sideways, sideways overscroll is off, so trackpads neither bounce past a line nor swipe the browser back. In right-to-left pages the hunk area stays left-to-right, like a code editor: annotation content reads in the page direction, and annotation rows scroll with the code. When a change is too large to compare line by line, createDiffFile marks its hunk with isReplacedBlock: it lists every old line as removed and every new line as added. DiffViewer folds those lines behind a "Large change: N lines" row, where N counts the block\'s removed plus added lines, with a Show full diff button. A file with more than 2,000 other changed lines starts folded the same way, because every row costs render time. Its line diff is still there when the reader opens it. A fold opens by itself when a line it would hide has an annotation, so no review comment is hidden. Rows are plain DOM with no virtualization: collapse or window very large files.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Render one DiffViewer per file and lay out the list yourself; parseUnifiedDiff(patch).map(file => <DiffViewer key={file.newPath ?? file.oldPath} file={file} />) is the multi-file case.',
      },
      {
        guidance: true,
        description:
          'Anchor review comments with the DiffViewerLineRef side + lineNumber pair: it is the same in unified and split view.',
      },
      {
        guidance: true,
        description:
          'Put file-level actions such as a "Viewed" checkbox in headerEnd, and drive isCollapsed from the same state if viewed files should fold away.',
      },
      {
        guidance: false,
        description:
          'Use DiffViewer for a short diff inside prose or a chat message; a CodeBlock with isDiff (or a ```diff fence in Markdown) is the lighter fit there.',
      },
    ],
  },

  examples: [
    {
      label: 'Unified diff from a patch',
      code: `const [file] = parseUnifiedDiff(patch);

<DiffViewer file={file} />`,
    },
    {
      label: 'Split view',
      code: '<DiffViewer file={file} viewMode="split" />',
    },
    {
      label: 'Diff two versions of a text',
      code: `const file = createDiffFile({oldValue: before, newValue: after, path: 'src/app.ts'});

<DiffViewer file={file} />`,
    },
    {
      label: 'Bars, character highlighting, no row tint',
      code: `<DiffViewer
  file={file}
  viewMode="split"
  changeIndicator="bars"
  inlineHighlight="char"
  hasChangeBackground={false}
/>`,
    },
    {
      label: 'Review comments',
      code: `<DiffViewer
  file={file}
  onLineNumberClick={(ref) => startComment(ref.side, ref.lineNumber)}
  renderLineAnnotation={(ref) => {
    const thread = threads.get(\`\${ref.side}:\${ref.lineNumber}\`);
    return thread ? <CommentThread thread={thread} /> : null;
  }}
/>`,
    },
  ],

  props: [
    {
      name: 'file',
      type: 'DiffViewerFile',
      description:
        'The file to render: paths, status, binary flag, and hunks of numbered lines. Build it with parseUnifiedDiff or createDiffFile.',
      required: true,
    },
    {
      name: 'viewMode',
      type: "'unified' | 'split'",
      description:
        "'unified' shows one column with removed lines above their replacements; 'split' shows the old file on the left and the new file on the right, pairing each removed line with the added line that replaced it.",
      default: "'unified'",
    },
    {
      name: 'language',
      type: 'string | CodeLanguage',
      description:
        'Syntax-highlighting language: a built-in identifier, or a CodeBlock language value imported on its own (e.g. graphql from @astryxdesign/core/CodeBlock/languages/graphql) or made with createCodeLanguage. Defaults to one inferred from the file name or extension among the built-ins and codeLanguages; an unmatched file renders as plain text.',
    },
    {
      name: 'codeLanguages',
      type: 'ReadonlyArray<CodeLanguage>',
      description:
        'Language values the file name or extension may infer, such as [graphql, dockerfile]; a later entry wins. Pass the same list to every DiffViewer on a review page.',
    },
    {
      name: 'hasLineNumbers',
      type: 'boolean',
      description: 'Show the old and new line-number gutters.',
      default: 'true',
    },
    {
      name: 'isWrapped',
      type: 'boolean',
      description:
        'Wrap long lines instead of scrolling them horizontally. Unwrapped, line numbers and change indicators stay pinned while the code scrolls; in split view each side is its own scroller, the split stays fixed at half and half, and the two sides scroll sideways in lockstep. While code overflows sideways, sideways overscroll (elastic bounce, swipe navigation) is off.',
      default: 'false',
    },
    {
      name: 'changeIndicator',
      type: "'classic' | 'bars' | 'none'",
      description:
        "How changed lines are marked beside their code: 'classic' +/− glyphs, 'bars' (a solid bar for added lines, a dashed bar for removed lines), or 'none'. Screen readers hear \"Added\"/\"Removed\" in every mode.",
      default: "'classic'",
    },
    {
      name: 'inlineHighlight',
      type: "'word' | 'char' | 'none'",
      description:
        'Highlight the changed words (or characters) inside each removed line and the added line that replaced it, paired as in split view. Lines that share nothing but whitespace get no inline highlight.',
      default: "'word'",
    },
    {
      name: 'hasChangeBackground',
      type: 'boolean',
      description:
        'Tint the rows of added and removed lines. Without it only the change indicator, the line numbers, and the inline highlight mark a change.',
      default: 'true',
    },
    {
      name: 'isCollapsible',
      type: 'boolean',
      description:
        'Make the file header a disclosure that hides and shows the hunks. Applies when the file has a path to name the control.',
      default: 'true',
    },
    {
      name: 'isCollapsed',
      type: 'boolean',
      description: 'Controlled collapsed state. Pair with onCollapsedChange.',
    },
    {
      name: 'defaultIsCollapsed',
      type: 'boolean',
      description: 'Initial collapsed state when uncontrolled.',
      default: 'false',
    },
    {
      name: 'onCollapsedChange',
      type: '(isCollapsed: boolean) => void',
      description:
        'Called with the next collapsed state when the header is toggled.',
    },
    {
      name: 'headerEnd',
      type: 'ReactNode',
      description:
        'Content at the end of the file header, such as a "Viewed" checkbox or a file actions menu.',
    },
    {
      name: 'renderLineAnnotation',
      type: '(ref: DiffViewerLineRef) => ReactNode',
      description:
        "Render content in a full-width row under a line, such as review comments; return null for lines with nothing to show. In split view the row sits under the line's own side.",
    },
    {
      name: 'onLineNumberClick',
      type: '(ref: DiffViewerLineRef, event: MouseEvent<HTMLButtonElement>) => void',
      description:
        "Makes each line's number a button, for example to start a comment on that line. The button is the number the line is anchored to: the original number of a removed line, and the changed-file number of an added or unchanged line (an unchanged line's original number stays plain text). Each line number is its own Tab stop.",
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum height of the hunk area before it scrolls.',
    },
    {
      name: 'syntaxTheme',
      type: 'SyntaxThemeDefinition',
      description:
        'Per-instance syntax theme, as on CodeBlock. Without it the nearest SyntaxTheme or the theme syntax colors apply.',
    },
    {
      name: 'ref',
      type: 'Ref<HTMLDivElement>',
      description: 'Ref forwarded to the root element.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
  ],
};

export const docsZh = {
  "name": "DiffViewer",
  "displayName": "Diff Viewer",
  "usage": {
    "description": "用于代码审查界面的只读、语法高亮单文件 diff。在文件的各个 hunk 上方渲染文件头（路径、Added/Deleted/Renamed 令牌、+/− 行数、`headerEnd` 槽位和可选展开器），支持统一或分栏（并排）视图。各行使用与启用 `isDiff` 的 CodeBlock 相同的语法主题 diff 槽位，因此一个语法主题可同时为两者设置样式。`renderLineAnnotation` 可在任意行下方添加整行（用于审查评论），`onLineNumberClick` 将行号变为按钮。使用 `parseUnifiedDiff(patch)` 构建文件模型，它为 git 或 `diff -u` 补丁中的每个文件返回一个文件；或者当你持有两个版本的文本时，使用 `createDiffFile({oldValue, newValue})`。显示选项涵盖变更的标记方式（经典 +/− 字形、竖条或无）、变更行是否着色，以及每个删除/添加行对内部变化的词级或字符级高亮。每个变更行都带有视觉隐藏的 \"Added\"/\"Removed\" 标签，因此在任何模式下不依赖颜色也能读出变更。不换行时，行号和变更指示符在代码滚动时保持固定；在分栏视图中，每一侧都有自己的滚动容器，因此分栏固定为各占一半，两侧横向滚动保持同步，行高取其较高一侧。当代码横向溢出时，横向过滚动被关闭，因此触控板既不会越过某行弹跳，也不会触发浏览器返回。在从右到左的页面中，hunk 区域保持从左到右，如同代码编辑器：注释内容按页面方向阅读，注释行与代码一起滚动。当变更过大而无法逐行比较时，`createDiffFile` 会将其 hunk 标记为 `isReplacedBlock`：它将每一行旧行列为删除，每一行新行列添加。DiffViewer 会将这些行折叠在一个 \"Large change: N lines\" 行之后，其中 N 是该块删除行数与添加行数之和，并提供 Show full diff 按钮。一个文件如果另有超过 2,000 行变更，也会以同样方式初始折叠，因为每一行都会消耗渲染时间。读者打开它时，其行 diff 仍然存在。如果折叠会隐藏的某行带有注释，折叠会自动展开，因此不会隐藏任何审查评论。行是普通 DOM，没有虚拟化：请折叠非常大的文件或为其设置窗口化。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "每个文件渲染一个 DiffViewer，并自行布局列表；多文件场景即 `parseUnifiedDiff(patch).map(file => <DiffViewer key={file.newPath ?? file.oldPath} file={file} />)`。"
      },
      {
        "guidance": true,
        "description": "使用 DiffViewerLineRef 的 side + lineNumber 组合定位审查评论：它在统一和分栏视图中相同。"
      },
      {
        "guidance": true,
        "description": "将文件级操作（例如 \"Viewed\" 复选框）放在 `headerEnd` 中，并在已查看文件应折叠时用同一状态驱动 `isCollapsed`。"
      },
      {
        "guidance": false,
        "description": "不要在正文或聊天消息中的短 diff 使用 DiffViewer；在这些场景中，启用 `isDiff` 的 CodeBlock（或 Markdown 中的 ```diff 围栏）更轻量。"
      }
    ]
  },
  "propDescriptions": {
    "file": "要渲染的文件：路径、状态、二进制标志和带编号行的 hunk。使用 `parseUnifiedDiff` 或 `createDiffFile` 构建。",
    "viewMode": "'unified' 显示单列，删除行在其替换行上方；'split' 左侧显示旧文件、右侧显示新文件，将每个删除行与其替换的添加行配对。",
    "language": "语法高亮语言：内置标识符，或单独导入的 CodeBlock 语言值（例如从 @astryxdesign/core/CodeBlock/languages/graphql 导入的 graphql），或使用 `createCodeLanguage` 创建。默认从文件名或扩展名在内置语言和 `codeLanguages` 中推断；无法匹配的文件按纯文本渲染。",
    "codeLanguages": "可由文件名或扩展名推断的语言值，例如 `[graphql, dockerfile]`；后面的条目优先。请将同一列表传给审查页面上的每个 DiffViewer。",
    "hasLineNumbers": "显示旧行号和新行号栏。",
    "isWrapped": "换行显示长行，而不是横向滚动。不换行时，行号和变更指示符在代码滚动时保持固定；在分栏视图中每一侧都有自己的滚动容器，分栏固定为各占一半，两侧横向滚动保持同步。当代码横向溢出时，横向过滚动（弹性回弹、滑动导航）被关闭。",
    "changeIndicator": "如何在代码旁标记变更行：'classic' +/− 字形、'bars'（添加行用实心竖条，删除行用虚线竖条）或 'none'。屏幕阅读器在任何模式下都会听到 \"Added\"/\"Removed\"。",
    "inlineHighlight": "高亮每个删除行及其替换添加行内部变化的词（或字符），配对方式与分栏视图一致。除空白外没有共同内容的行不会获得行内高亮。",
    "hasChangeBackground": "为添加和删除行着色。没有它时，只有变更指示符、行号和行内高亮标记变更。",
    "isCollapsible": "使文件头成为一个可隐藏和显示 hunk 的展开器。仅当文件有可用于命名该控件的路径时适用。",
    "isCollapsed": "受控的折叠状态。与 `onCollapsedChange` 搭配使用。",
    "defaultIsCollapsed": "非受控时的初始折叠状态。",
    "onCollapsedChange": "切换文件头时以新的折叠状态调用。",
    "headerEnd": "文件头末尾的内容，例如 \"Viewed\" 复选框或文件操作菜单。",
    "renderLineAnnotation": "在行下方渲染整行内容，例如审查评论；没有内容可显示的行返回 null。在分栏视图中，该行位于所属一侧的行下方。",
    "onLineNumberClick": "使每一行的行号成为按钮，例如在该行开始评论。按钮是行所锚定的编号：删除行的原始编号，添加或未变更行的变更后文件编号（未变更行的原始编号仍为纯文本）。每个行号都是独立的 Tab 停靠点。",
    "maxHeight": "hunk 区域滚动前的最大高度。",
    "syntaxTheme": "实例级语法主题，与 CodeBlock 上相同。否则应用最近的 SyntaxTheme 或主题语法颜色。",
    "ref": "转发到根元素的 ref。",
    "xstyle": "用于布局自定义的 StyleX 样式。"
  }
};
