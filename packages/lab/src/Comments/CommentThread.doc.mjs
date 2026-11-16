// Copyright (c) Meta Platforms, Inc. and affiliates.

// @ts-check

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'CommentThread',
  displayName: 'Comment Thread',
  group: 'Comments',
  category: 'Chat',
  keywords: [
    'comment',
    'comment thread',
    'thread',
    'replies',
    'margin comment',
    'annotation',
  ],
  description:
    'One comment thread on its own: its first comment, one level of replies, reactions, edit history, controlled typing and seen metadata, and a reply composer. For a margin comment beside a document, a popover under a highlight, or any surface that shows a single thread.',
  usage: {
    description:
      'A comment thread shows one conversation: its first comment and the replies under it. Use it where a surface shows a single thread, such as a margin card beside a document or a popover opened from a highlight. To show many threads with a composer for new ones, use Comments.',
    anatomy: [
      {
        name: 'Surface',
        required: true,
        description:
          'An outlined Card on a page, or a Section without outer rules inside a card or popover. A press anywhere on it opens the thread; a visually hidden toggle carries its name and focus.',
      },
      {
        name: 'Quoted passage',
        required: false,
        description:
          'The passage an inline comment discusses, as an italic blockquote ruled in the highlight color, with an Outdated badge once the passage is edited away.',
      },
      {
        name: 'First comment',
        required: true,
        description:
          'Avatar, header (name, time, Edited, Resolved, and the actions shown on hover or focus), Markdown body clamped to three lines until the thread opens, and reactions.',
      },
      {
        name: 'Replies',
        required: false,
        description:
          'One level of replies behind View replies, joined to the first comment by an avatar rail while the thread is open. A host-marked unread reply reveals without selecting the thread, moving focus, or opening the reply composer.',
      },
      {
        name: 'Live state',
        required: false,
        description:
          'Controlled typing state follows the conversation while the thread is open, with its pulsing dots in the avatar column and its label on the comment-text line. Controlled `seenBy` metadata remains available to comment render callbacks but has no default presentation.',
      },
      {
        name: 'Reply composer',
        required: false,
        description:
          'A CommentComposer that opens with the thread, beside the viewer’s avatar.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Inside a card or popover, set `container="card"` and give the card no padding: the thread supplies its own insets and draws no outer rules.',
      },
      {
        guidance: true,
        description:
          'Control `isSelected` when the thread opens from elsewhere, such as its highlight in a document. Controlled selection reveals the body and replies without moving focus or opening the reply composer.',
      },
      {
        guidance: true,
        description:
          'In a Popover over a document, pass `onDismiss` and pair it with `hasLightDismiss={false}` and `hasEscapeDismiss={false}` on the host Popover. A press outside the thread or Escape then closes it, except that the first one over an unsaved reply or edit shakes the thread and keeps the draft.',
      },
      {
        guidance: true,
        description:
          'Map your collaboration state to `typingUsers` and `seenBy`, then publish local reply and edit activity with `onComposerDraftChange`. `seenBy` stays hidden unless a comment render callback presents it. The thread never opens a connection or expires participants.',
      },
      {
        guidance: false,
        description:
          'Stack several CommentThreads with a composer to build a discussion. Use Comments, which keeps one thread open at a time and orders threads with activity.',
      },
      {
        guidance: false,
        description:
          'Wrap the thread in your own button or link to open it. The thread is already one toggle; a second control nests interactive elements.',
      },
      {
        guidance: false,
        description:
          'Leave the host Popover’s light dismiss on while passing `onDismiss`. The browser closes the Popover before the thread can keep a draft.',
      },
    ],
    accessibility: [
      {
        name: 'Escape',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard',
        description:
          'With `onDismiss`, Escape dismisses the thread only when no layer inside it is open. An open emoji picker, menu, or dialog closes first, one Escape at a time.',
      },
      {
        name: 'Unsaved draft warning',
        category: 'Semantics',
        criterion: '4.1.3 Status Messages',
        description:
          'When a dismissal would discard an unsaved reply or edit, the thread stays open, focus returns to the draft, and a polite live region says the draft is unsaved and that dismissing again discards it. The shake is never the only signal.',
      },
      {
        name: 'Reduced motion',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'Under `prefers-reduced-motion: reduce` the thread does not shake. Focus and the announcement still mark the kept draft.',
      },
    ],
  },
  props: [
    {
      name: 'comment',
      type: 'CommentThreadData',
      required: true,
      description:
        'The thread: its first comment, carrying its replies, reactions, optional anchor, transient `typingUsers`, and per-comment `seenBy` metadata. `seenBy` is not rendered by default but remains available to comment render callbacks.',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description:
        'Whether the thread is open, controlled: body unclamped and replies shown. Omit it to let the thread own selection. Host-controlled selection never moves focus or opens the reply composer; a viewer Reply action does.',
    },
    {
      name: 'onSelectedChange',
      type: '(isSelected: boolean) => void',
      description: 'Called when the viewer opens or closes the thread.',
    },
    {
      name: 'onDismiss',
      type: '() => void',
      description:
        'Hands the thread its anchored host’s light dismissal. A press outside the thread, or an Escape no layer inside it handled, calls it. While a reply or edit holds unsaved text, the first request instead shakes the thread, returns focus to the draft, and announces; the next consecutive request dismisses, and typing or pressing inside the thread re-arms the warning. Pair it with `hasLightDismiss={false}` and `hasEscapeDismiss={false}` on the host Popover. Omit it and the thread never dismisses anything.',
    },
    {
      name: 'currentUser',
      type: 'CommentUser',
      description: 'The viewer, for own-comment actions and the reply avatar.',
    },
    {
      name: 'mode',
      type: "'interactive' | 'non-editable' | 'read-only'",
      default: "'interactive'",
      description: 'Which actions show, as on Comments.',
    },
    {
      name: 'container',
      type: "'section' | 'card'",
      default: "'section'",
      description:
        'The parent surface: an outlined Card on a page, or a Section without outer rules inside a card or popover.',
    },
    {
      name: 'onSubmit',
      type: '(content: string, parentCommentId?: string) => void | Promise<void>',
      description:
        'Posts a reply, always with the thread’s first comment as the parent. A rejected Promise restores the draft and shows an error with Retry.',
    },
    {
      name: 'onComposerDraftChange',
      type: '(value: string, context: CommentComposerContext) => void',
      description:
        'Reports internally owned reply and edit drafts, including seeds and an empty value after submit, cancel, or a target switch. Route updates by `context` and own transport timing in your app.',
    },
    {
      name: 'onSaveEdit',
      type: '(commentId: string, content: string) => void | Promise<void>',
      description:
        'Adds Edit to the viewer’s own comments and saves the new Markdown.',
    },
    {
      name: 'onDelete',
      type: '(commentId: string) => void | Promise<void>',
      description:
        'Adds Delete to the viewer’s own comments, confirmed in a dialog first.',
    },
    {
      name: 'onReact',
      type: '(commentId: string, reactionKey: string, option?: CommentReactionOption) => void | Promise<void>',
      description: 'Toggles the viewer’s reaction by its stable key.',
    },
    {
      name: 'onRetryComment',
      type: '(commentId: string) => void | Promise<void>',
      description: 'Adds Retry to a comment whose `status` is `error`.',
    },
    {
      name: 'onResolveThread',
      type: '(commentId: string) => void | Promise<void>',
      description: 'Adds Mark as resolved to an open thread.',
    },
    {
      name: 'onReopenThread',
      type: '(commentId: string) => void | Promise<void>',
      description: 'Adds Reopen to a resolved thread.',
    },
    {
      name: 'loadVersions',
      type: '(commentId: string) => Promise<readonly CommentVersion[]>',
      description: 'Loads a comment’s edit history, newest first.',
    },
    {
      name: 'onUploadImages',
      type: '(files: readonly File[], context: CommentComposerContext) => CommentUploadedImage[] | Promise<CommentUploadedImage[]>',
      description:
        'Uploads images attached, pasted, or dropped in the reply composer and appends them as Markdown images.',
    },
    {
      name: 'isSubmitting',
      type: 'boolean',
      default: 'false',
      description: 'Host-controlled pending state for the reply composer.',
    },
    {
      name: 'composerPlaceholder',
      type: 'string',
      description:
        'Placeholder of the reply composer. Defaults to the localized "Reply to <name>…".',
    },
    {
      name: 'highlightColor',
      type: "'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
      default: "'yellow'",
      description:
        'The palette color your app highlights the thread’s passage in.',
    },
    {
      name: 'reactionOptions',
      type: 'readonly CommentReactionOption[]',
      default: 'DEFAULT_COMMENT_REACTIONS',
      description: 'The reactions Add reaction offers.',
    },
    {
      name: 'agentCommands',
      type: 'readonly CommentAgentCommand[]',
      description: 'Agents a reply can address with a `/` command.',
    },
    {
      name: 'composerTriggers',
      type: 'readonly ChatComposerTrigger[]',
      description:
        'Typeahead triggers for the reply composer, such as an `@` people search.',
    },
    {
      name: 'markdownPlugins',
      type: 'readonly MarkdownPluginEntry[]',
      description: 'Block Markdown plugins for comment bodies.',
    },
    {
      name: 'markdownInlinePlugins',
      type: 'readonly MarkdownInlinePlugin[]',
      description:
        'Inline Markdown plugins for comment bodies, such as mentions.',
    },
    {
      name: 'getReplyMention',
      type: '(author: CommentUser) => string | undefined',
      description: 'Seeds a reply to a reply with a mention of its author.',
    },
    {
      name: 'hasEmojiPicker',
      type: 'boolean',
      default: 'true',
      description: 'Whether the reply composer offers the emoji picker.',
    },
    {
      name: 'renderAnchor',
      type: '(comment: CommentThreadData, defaultAnchor: ReactNode) => ReactNode',
      description: 'Replaces the thread’s quoted passage.',
    },
    {
      name: 'renderBody',
      type: '(comment: CommentData) => ReactNode',
      description: 'Replaces a comment’s Markdown body.',
    },
    {
      name: 'renderVersionBody',
      type: '(version: CommentVersion) => ReactNode',
      description: 'Replaces the body of a version in the edit history.',
    },
    {
      name: 'renderAdditionalActions',
      type: '(comment: CommentData) => ReactNode',
      description: 'Adds product actions to a comment’s header.',
    },
    {
      name: 'renderComposer',
      type: '(props: CommentComposerRenderProps) => ReactNode',
      description:
        'Replaces the reply composer’s input while the thread keeps its draft and state.',
    },
  ],
  examples: [
    {
      label: 'Margin comment',
      code: `import {Card} from '@astryxdesign/core/Card';
import {CommentThread} from '@astryxdesign/lab';

<Card padding={0} width={320}>
  <CommentThread
    comment={{
      id: 'margin',
      author: {id: 'maya', name: 'Maya Chen'},
      body: 'Should this say three days? The dry run adds one.',
      createdAt: '2026-09-30T19:00:00Z',
      anchor: {quote: 'The final cohort completes rollout in two days.'},
    }}
    currentUser={{id: 'avery', name: 'Avery Kim'}}
    container="card"
    onSubmit={(body, parentId) => postReply(parentId, body)}
  />
</Card>`,
    },
    {
      label: 'In a popover that keeps unsaved drafts',
      code: `import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {Popover} from '@astryxdesign/core/Popover';
import {CommentThread} from '@astryxdesign/lab';

function CommentPopover({thread, viewer}) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      hasLightDismiss={false}
      hasEscapeDismiss={false}
      label="Comment"
      padding={0}
      width={340}
      content={
        <CommentThread
          comment={thread}
          currentUser={viewer}
          container="card"
          isSelected
          onSubmit={(body, parentId) => postReply(parentId, body)}
          onDismiss={() => setIsOpen(false)}
        />
      }>
      <Button label="1 comment" variant="secondary" />
    </Popover>
  );
}`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "name": "CommentThread",
  "displayName": "Comment Thread",
  "description": "一个独立的评论线程：它的第一条评论、一级回复、反应、编辑历史、受控的输入状态和已读元数据，以及一个回复编辑器。适用于文档旁边的边距评论、高亮下方的浮层，或任何显示单个线程的表面。",
  "usage": {
    "description": "评论线程显示一个对话：它的第一条评论及其下的回复。在展示单个线程的表面使用它，例如文档旁边的边距卡片或从高亮打开的浮层。要显示多个线程并为新线程提供编辑器，请使用 Comments。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在卡片或浮层内，设置 `container=\"card\"` 并让卡片没有内边距：线程会提供自己的内边距，并且不绘制外部边框线。"
      },
      {
        "guidance": true,
        "description": "当线程从别处打开时（例如文档中的高亮）控制 `isSelected`。受控选择会显示正文和回复，而不会移动焦点或打开回复编辑器。"
      },
      {
        "guidance": true,
        "description": "在文档上方的 Popover 中，传入 `onDismiss` 并在宿主 Popover 上搭配 `hasLightDismiss={false}` 和 `hasEscapeDismiss={false}`。线程外部的按压或 Escape 会关闭它；例外的是，当存在未保存的回复或编辑时，第一次操作会让线程抖动并保留草稿。"
      },
      {
        "guidance": true,
        "description": "将你的协作状态映射到 `typingUsers` 和 `seenBy`，然后通过 `onComposerDraftChange` 发布本地回复和编辑活动。除非评论渲染回调呈现它，`seenBy` 保持隐藏。线程永远不会打开连接或使参与者过期。"
      },
      {
        "guidance": false,
        "description": "堆叠多个 CommentThread 并带一个编辑器来构建讨论。请使用 Comments，它会一次保持一个线程打开，并按活动对线程排序。"
      },
      {
        "guidance": false,
        "description": "将线程包在你自己的按钮或链接中以打开它。线程本身已经是一个切换控件；第二个控件会嵌套交互元素。"
      },
      {
        "guidance": false,
        "description": "在传入 `onDismiss` 时保持宿主 Popover 的轻触关闭开启。浏览器会在、线程来得及保留草稿之前关闭 Popover。"
      }
    ],
    "accessibility": [
      {
        "name": "Esc 键",
        "category": "Keyboard",
        "criterion": "2.1.1 Keyboard",
        "description": "使用 `onDismiss` 时，仅当线程内部没有打开任何图层时，Escape 才会关闭线程。打开的 emoji 选择器、菜单或对话框会先关闭，一次一个 Escape。"
      },
      {
        "name": "未保存草稿警告",
        "category": "Semantics",
        "criterion": "4.1.3 Status Messages",
        "description": "当关闭操作将丢弃未保存的回复或编辑时，线程保持打开，焦点返回草稿，礼貌的实时区域会说明草稿未保存，并说明再次关闭会丢弃它。抖动永远不是唯一的信号。"
      },
      {
        "name": "减弱运动",
        "criterion": "2.3.3 Animation from Interactions",
        "description": "在 `prefers-reduced-motion: reduce` 下，线程不会抖动。焦点和公告仍会标记保留的草稿。"
      }
    ],
    "anatomy": [
      {
        "name": "表面",
        "required": true,
        "description": "页面上的带边框 Card，或卡片/浮层内不带外部边框线的 Section。在其任何位置按压都会打开线程；视觉隐藏的切换控件承载其名称和焦点。"
      },
      {
        "name": "引用的段落",
        "required": false,
        "description": "行内评论所讨论的段落，以高亮色边框的斜体 blockquote 呈现，段落被编辑掉后显示 Outdated 徽章。"
      },
      {
        "name": "第一条评论",
        "required": true,
        "description": "头像、头部（名称、时间、Edited、Resolved 以及悬停或聚焦时显示的操作），Markdown 正文在线程打开前钳制为三行，以及反应。"
      },
      {
        "name": "回复",
        "required": false,
        "description": "View replies 背后的一级回复，在线程打开时通过头像轨道与第一条评论连接。宿主标记的未读回复会显示，但不会选择线程、移动焦点或打开回复编辑器。"
      },
      {
        "name": "实时状态",
        "required": false,
        "description": "受控的输入状态在线程打开时跟随对话，其脉动点位于头像列，其标签位于评论文本行。受控的 `seenBy` 元数据仍可供评论渲染回调使用，但没有默认呈现。"
      },
      {
        "name": "回复编辑器",
        "required": false,
        "description": "随线程打开的 CommentComposer，位于查看者头像旁边。"
      }
    ]
  },
  "propDescriptions": {
    "comment": "线程：它的第一条评论，携带其回复、反应、可选锚点、临时 `typingUsers` 以及每条评论的 `seenBy` 元数据。`seenBy` 默认不渲染，但仍可供评论渲染回调使用。",
    "isSelected": "线程是否打开，受控：正文取消钳制并显示回复。省略它以让线程自己管理选择。宿主控制的选择永远不会移动焦点或打开回复编辑器；查看者的 Reply 操作会。",
    "onSelectedChange": "当查看者打开或关闭线程时调用。",
    "onDismiss": "将线程的锚定宿主的轻触关闭交给它。线程外部的按压，或线程内部没有图层处理的 Escape 会调用它。当回复或编辑持有未保存文本时，第一次请求会改为抖动线程、将焦点返回草稿并发出公告；下一次连续请求会关闭，在线程内输入或按压会重新启用警告。请在宿主 Popover 上搭配 `hasLightDismiss={false}` 和 `hasEscapeDismiss={false}`。省略它，线程永远不会关闭任何东西。",
    "currentUser": "查看者，用于自己的评论操作和回复头像。",
    "mode": "显示哪些操作，与 Comments 相同。",
    "container": "父级表面：页面上的带边框 Card，或卡片/浮层内不带外部边框线的 Section。",
    "onSubmit": "发布回复，始终以线程的第一条评论为父级。被拒绝的 Promise 会恢复草稿并显示带 Retry 的错误。",
    "onComposerDraftChange": "报告内部拥有的回复和编辑草稿，包括种子，以及提交、取消或目标切换后的空值。在你的应用中按 `context` 路由更新，并自行负责传输时机。",
    "onSaveEdit": "为查看者自己的评论添加 Edit，并保存新的 Markdown。",
    "onDelete": "为查看者自己的评论添加 Delete，先在对话框中确认。",
    "onReact": "按稳定键切换查看者的反应。",
    "onRetryComment": "为 `status` 为 `error` 的评论添加 Retry。",
    "onResolveThread": "为打开的线程添加 Mark as resolved。",
    "onReopenThread": "为已解决的线程添加 Reopen。",
    "loadVersions": "加载评论的编辑历史，最新在前。",
    "onUploadImages": "上传在回复编辑器中附加、粘贴或拖入的图片，并将其作为 Markdown 图片追加。",
    "isSubmitting": "回复编辑器的宿主控制待处理状态。",
    "composerPlaceholder": "回复编辑器的占位符。默认为本地化的 \"Reply to <name>…\"。",
    "highlightColor": "你的应用用来高亮线程段落的调色板颜色。",
    "reactionOptions": "Add reaction 提供的反应。",
    "agentCommands": "回复可以通过 `/` 命令寻址的代理。",
    "composerTriggers": "回复编辑器的 typeahead 触发器，例如 `@` 人员搜索。",
    "markdownPlugins": "评论正文的块级 Markdown 插件。",
    "markdownInlinePlugins": "评论正文的行内 Markdown 插件，例如提及。",
    "getReplyMention": "为回复的回复预填一条提及其作者的回复。",
    "hasEmojiPicker": "回复编辑器是否提供 emoji 选择器。",
    "renderAnchor": "替换线程的引用段落。",
    "renderBody": "替换评论的 Markdown 正文。",
    "renderVersionBody": "替换编辑历史中某个版本的正文。",
    "renderAdditionalActions": "为评论头部添加产品操作。",
    "renderComposer": "替换回复编辑器的输入框，同时线程保留其草稿和状态。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'One comment thread alone: first comment, one reply level, reactions, edit history, controlled typing/seen metadata, reply composer. For margin comments, highlight popovers, any single-thread surface.',
  usage: {
    description:
      'One conversation: first comment plus replies. For margin cards or highlight popovers. Many threads with a new-comment composer: use Comments.',
    bestPractices: [
      {
        guidance: true,
        description:
          'In a card or popover: `container="card"`, card padding 0. Thread owns insets, draws no outer rules.',
      },
      {
        guidance: true,
        description:
          'Control `isSelected` when opened from elsewhere (a document highlight). Reveals body and replies without moving focus or opening the composer.',
      },
      {
        guidance: true,
        description:
          'In a Popover over a document: pass `onDismiss`, set `hasLightDismiss={false}` and `hasEscapeDismiss={false}` on the host. Outside press or Escape closes; the first over an unsaved reply/edit shakes and keeps the draft.',
      },
      {
        guidance: true,
        description:
          'Map collaboration state to `typingUsers`/`seenBy`; publish local drafts via `onComposerDraftChange`. `seenBy` hidden unless a render callback shows it. No connections, no participant expiry.',
      },
      {
        guidance: false,
        description:
          'Stack CommentThreads plus a composer as a discussion. Use Comments.',
      },
      {
        guidance: false,
        description:
          'Wrap the thread in your own button/link. It is already one toggle.',
      },
      {
        guidance: false,
        description:
          'Keep host Popover light dismiss on with `onDismiss`. The browser closes it before the thread can keep a draft.',
      },
    ],
    accessibility: [
      {
        name: 'Escape',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard',
        description:
          'With `onDismiss`, Escape dismisses only when no inner layer is open. Picker, menu, or dialog closes first, one per Escape.',
      },
      {
        name: 'Unsaved draft warning',
        category: 'Semantics',
        criterion: '4.1.3 Status Messages',
        description:
          'A dismissal over an unsaved reply/edit keeps the thread open, refocuses the draft, and announces politely. Shake is never the only signal.',
      },
      {
        name: 'Reduced motion',
        criterion: '2.3.3 Animation from Interactions',
        description:
          'No shake under `prefers-reduced-motion: reduce`; focus and announcement remain.',
      },
    ],
  },
  propDescriptions: {
    comment:
      'The thread: first comment with replies, reactions, optional anchor, transient `typingUsers`, per-comment `seenBy` (not rendered by default).',
    isSelected:
      'Controlled open state. Omit for uncontrolled. Never moves focus or opens the composer.',
    onSelectedChange: 'Viewer opened or closed the thread.',
    onDismiss:
      'Thread owns its anchored host’s light dismissal: outside press or unhandled Escape calls it. Over an unsaved reply/edit, the first request shakes, refocuses the draft, announces; the next consecutive one dismisses. Typing or pressing inside re-arms. Pair with host `hasLightDismiss={false}` and `hasEscapeDismiss={false}`.',
    currentUser: 'Viewer: own-comment actions, reply avatar.',
    mode: 'Which actions show, as on Comments.',
    container:
      'Parent surface: outlined Card on a page, or rule-less Section in a card/popover.',
    onSubmit:
      'Posts a reply; parent is always the first comment. Rejection restores the draft with Retry.',
    onComposerDraftChange:
      'Reports reply/edit drafts, seeds, and empty values after submit, cancel, or target switch. Route by `context`.',
    onSaveEdit: 'Adds Edit to own comments; saves new Markdown.',
    onDelete: 'Adds Delete to own comments, confirmed in a dialog.',
    onReact: 'Toggles the viewer’s reaction by stable key.',
    onRetryComment: 'Adds Retry to `status: error` comments.',
    onResolveThread: 'Adds Mark as resolved to an open thread.',
    onReopenThread: 'Adds Reopen to a resolved thread.',
    loadVersions: 'Loads edit history, newest first.',
    onUploadImages: 'Uploads composer images; appends Markdown images.',
    isSubmitting: 'Host pending state for the reply composer.',
    composerPlaceholder:
      'Reply placeholder. Default: localized "Reply to <name>…".',
    highlightColor: 'Palette color of the passage highlight.',
    reactionOptions: 'Reactions Add reaction offers.',
    agentCommands: 'Agents a reply can address with `/`.',
    composerTriggers: 'Reply typeahead triggers, e.g. `@` people search.',
    markdownPlugins: 'Block Markdown plugins for bodies.',
    markdownInlinePlugins: 'Inline Markdown plugins for bodies, e.g. mentions.',
    getReplyMention: 'Seeds a reply-to-reply with an author mention.',
    hasEmojiPicker: 'Whether the reply composer offers the emoji picker.',
    renderAnchor: 'Replaces the quoted passage.',
    renderBody: 'Replaces a comment’s Markdown body.',
    renderVersionBody: 'Replaces a history version’s body.',
    renderAdditionalActions: 'Adds product actions to a comment header.',
    renderComposer: 'Replaces the reply input; thread keeps draft and state.',
  },
};
