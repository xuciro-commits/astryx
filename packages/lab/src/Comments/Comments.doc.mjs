// Copyright (c) Meta Platforms, Inc. and affiliates.

// @ts-check

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Comments',
  displayName: 'Comments',
  group: 'Comments',
  category: 'Chat',
  keywords: [
    'discussion',
    'comments',
    'comment thread',
    'threads',
    'replies',
    'reactions',
    'activity',
    'timeline',
    'inline comments',
    'annotations',
    'review',
    'conversation',
  ],
  description:
    'The comments on one item: comment threads with one level of replies, reactions, edit history, controlled typing and seen metadata, inline-comment quotes, and activity events in time order, with a composer for new comments. Controlled: your app owns the data and every mutation; the panel owns presentation, selection, and focus.',
  usage: {
    description:
      'The Comments panel shows the conversation about a document, task, or record: its comment threads and activity, with a composer for new comments. Use it as a side panel or section that fills a sized container, or embedded at its content height inside a card or popover. Render a single thread with CommentThread and a standalone composer with CommentComposer.',
    anatomy: [
      {
        name: 'Thread',
        required: true,
        description:
          'An outlined Card on a section parent, or an edge-to-edge Section with 1px dividers on a card parent. Selecting it opens the thread: the body unclamps, replies show, and the reply composer opens, taking focus on a pointer press.',
      },
      {
        name: 'Avatar',
        required: true,
        description:
          'A 28×28 picture or initials: a circle for people, a rounded square for agents. In an open thread a 2px rail joins the avatars in segments.',
      },
      {
        name: 'Header',
        required: true,
        description:
          'One avatar tall: name, relative time, Edited (opens the edit history), and Resolved. Mark as resolved or Reopen, Add reaction, Reply, Copy link, and the more menu (Edit, Delete) appear while the pointer or focus is on the thread, collapsing into the more menu when room runs out.',
      },
      {
        name: 'Quoted passage',
        required: false,
        description:
          'An inline comment quotes its passage as an italic blockquote whose rule takes the highlight color. A passage edited away keeps a neutral rule and an Outdated badge.',
      },
      {
        name: 'Body',
        required: true,
        description:
          'Markdown, clamped to three lines until the thread opens. Images open in a Lightbox. A comment still being written shows its progress instead.',
      },
      {
        name: 'Reactions',
        required: false,
        description:
          'A toggle for each reaction, pressed where the viewer reacted; its tooltip names who reacted.',
      },
      {
        name: 'Replies',
        required: false,
        description:
          'One level, behind View replies. A host-marked unread reply reveals without selecting the thread, moving focus, or opening the reply composer. Replying to a reply posts to the thread.',
      },
      {
        name: 'Live state',
        required: false,
        description:
          'Controlled typing state appears at the end of an open thread, with its pulsing dots in the avatar column and its label on the comment-text line. Controlled `seenBy` metadata is available to comment render callbacks but has no default presentation.',
      },
      {
        name: 'Activity event',
        required: false,
        description:
          'A timeline row for a status change or other event, interleaved with threads by time.',
      },
      {
        name: 'Composer',
        required: false,
        description:
          'A two-row CommentComposer docked at the bottom (or top): the input above attach and emoji buttons and Post.',
      },
    ],
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the data controlled: update `comments` after each callback. Return a Promise so the panel shows the pending state and, when it rejects, an error with Retry.',
      },
      {
        guidance: true,
        description:
          'Match the surface: give a pane a definite height, use `layout="embedded"` inside a card or popover, and set `container="card"` on a card parent so cards never nest.',
      },
      {
        guidance: true,
        description:
          'For inline comments, keep anchoring in your app: pass each thread its `anchor`, mark it `orphaned` when it no longer resolves, and sync `selectedThreadId` with the passage you highlight.',
      },
      {
        guidance: true,
        description:
          'Keep live state controlled and transport-neutral: map your collaboration layer to `typingUsers` and `seenBy`, and use `onComposerDraftChange` to publish local activity. `seenBy` stays hidden unless a comment render callback presents it. Debounce and expire transient activity in your app.',
      },
      {
        guidance: false,
        description:
          'Put data fetching, authorization, or telemetry in render slots. Keep them in your app and pass the results as data.',
      },
      {
        guidance: false,
        description:
          'Assume `selectedThreadId` moves focus or opens a composer. It reveals and scrolls the controlled thread without interrupting the viewer; only their Reply action opens the reply composer.',
      },
    ],
    accessibility: [
      {
        name: 'Comment list',
        category: 'Semantics',
        description:
          'The threads sit in a log named after the region, such as "Threads in Launch plan", so screen readers hear new comments politely. Each comment is an article named by its author, and the region reports busy while comments load.',
      },
      {
        name: 'Live updates',
        category: 'Content',
        criterion: '4.1.3 Status Messages',
        description:
          'Typing is a polite status message with reduced-motion-safe dots. `seenBy` metadata has no default presentation and introduces no additional live region.',
      },
      {
        name: 'Thread toggle',
        category: 'Keyboard',
        criterion: '2.1.1 Keyboard',
        description:
          'Each thread has one toggle button (the WAI-ARIA Button pattern, with aria-pressed) named "Thread by" and its author. Enter or Space opens or closes it and keeps focus on it; a pointer press on the thread opens it with focus in the reply composer. The whole surface takes the system focus ring while the toggle has focus.',
      },
      {
        name: 'Replies and actions',
        category: 'Keyboard',
        description:
          'View replies is a disclosure button with aria-expanded and aria-controls (the WAI-ARIA Disclosure pattern). The more menu follows the Menu Button pattern; when an edit is saved or cancelled, or the delete dialog closes, focus returns to it.',
      },
      {
        name: 'Focus after changes',
        category: 'Keyboard',
        criterion: '2.4.3 Focus Order',
        description:
          'Focus never drops to the page. After a delete it moves to the next thread, or to the thread when a reply was deleted. Load earlier comments keeps focus on itself, or on the Retry that replaces it when loading fails. A thread selected when the panel mounts opens without taking focus.',
      },
      {
        name: 'Busy actions',
        category: 'Keyboard',
        description:
          'Post and reactions stay focusable while a request is in flight and refuse a second press, so focus never drops to the page mid-request.',
      },
      {
        name: 'Errors',
        category: 'Content',
        criterion: '4.1.3 Status Messages',
        description:
          'Failures show in error Banners next to the thing that failed, each with Retry when the action can be repeated. A Banner carries no live role of its own: its failure is announced once, assertively, through the shared announcement channel, unless it sits inside the chat log, which delivers it. The progress label of a comment still being written follows the same rule, politely. The edit-history dialog announces its failure through an alert region inside the dialog. A failed delete is announced once, assertively, as the confirmation dialog changes its text.',
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-comments',
        visualProps: ['layout', 'density', 'container'],
      },
      {
        className: 'astryx-comment-thread',
        visualProps: ['container'],
      },
      {
        className: 'astryx-comment-composer',
      },
    ],
  },
  components: [
    {
      name: 'Comments',
      displayName: 'Comments',
      description:
        'Comment threads and activity events in time order, with a composer for new comments and the dialogs threads open.',
      props: [
        {
          name: 'comments',
          type: 'readonly CommentThreadData[]',
          required: true,
          description:
            'The threads: each thread’s first comment, carrying `replies` (one level), `reactions`, transient `typingUsers`, hidden per-comment `seenBy` metadata, `anchor` for inline comments, `isResolved`, `status`, `progress`, and per-comment permissions. `seenBy` remains available to comment render callbacks. Shown in time order with `events`.',
        },
        {
          name: 'events',
          type: 'readonly CommentActivityEvent[]',
          description:
            'Activity on the item, interleaved with the threads by `createdAt` as compact timeline rows.',
        },
        {
          name: 'currentUser',
          type: 'CommentUser',
          description:
            'The viewer: their own comments get Edit and Delete, and their avatar sits beside the reply composer. Authorization stays with your app.',
        },
        {
          name: 'mode',
          type: "'interactive' | 'non-editable' | 'read-only'",
          default: "'interactive'",
          description:
            '`interactive` enables every permitted action; `non-editable` keeps create, reply, and react but removes edit and delete; `read-only` removes every control that changes data.',
        },
        {
          name: 'label',
          type: 'string',
          description:
            'Accessible name of the Comments region. Defaults to the localized "Comments".',
        },
        {
          name: 'composerPosition',
          type: "'top' | 'bottom' | 'none'",
          default: "'bottom'",
          description: 'Where the composer for new comments renders.',
        },
        {
          name: 'density',
          type: "'compact' | 'balanced'",
          default: "'balanced'",
          description: 'Spacing between threads and around the list.',
        },
        {
          name: 'container',
          type: "'section' | 'card'",
          default: "'section'",
          description:
            'The parent surface. `section` renders each thread as an outlined Card; `card` renders divider-bounded Sections whose dividers overlap into single lines.',
        },
        {
          name: 'layout',
          type: "'pane' | 'embedded'",
          default: "'pane'",
          description:
            '`pane` fills its container and scrolls, with the composer docked. `embedded` takes its content’s height inside a host surface: no scroll area or dock, and on a card parent no outer rules.',
        },
        {
          name: 'composerPlaceholder',
          type: 'string',
          description:
            'Placeholder of the new-comment composer. Defaults to the localized "Write a comment…", with replies saying "Reply to <name>…"; a custom value replaces both.',
        },
        {
          name: 'selectedThreadId',
          type: 'string | null',
          description:
            'The open thread, controlled, for hosts that sync threads with a document. A host-selected thread opens its body and replies and scrolls into view without moving focus or opening the reply composer.',
        },
        {
          name: 'onSelectedThreadChange',
          type: '(threadId: string | null) => void',
          description:
            'Called when the viewer opens a thread or closes the open one.',
        },
        {
          name: 'composerAnchor',
          type: 'CommentAnchor',
          description:
            'The passage a new comment will attach to, quoted in the composer. An anchor that arrives while the panel is on screen moves focus to the composer.',
        },
        {
          name: 'onComposerAnchorDismiss',
          type: '() => void',
          description:
            'Adds Remove quoted text to the composer’s quote; clear `composerAnchor` when it is called.',
        },
        {
          name: 'composerControls',
          type: 'ReactNode',
          description:
            'Product-owned controls in the new-comment composer’s footer, after its attach and emoji buttons.',
        },
        {
          name: 'highlightColor',
          type: "'blue' | 'cyan' | 'gray' | 'green' | 'orange' | 'pink' | 'purple' | 'red' | 'teal' | 'yellow'",
          default: "'yellow'",
          description:
            'The palette color your app highlights passages in. Quotes draw their rule in its `--color-border-<color>` token.',
        },
        {
          name: 'isLoading',
          type: 'boolean',
          default: 'false',
          description:
            'Shows comment-shaped placeholders and reports the region busy.',
        },
        {
          name: 'loadError',
          type: 'string',
          description:
            'Shows an error Banner above the threads, for comments that failed to load.',
        },
        {
          name: 'onRetryLoad',
          type: '() => void | Promise<void>',
          description:
            'Adds Retry to the `loadError` Banner; a Promise keeps Retry busy until it settles.',
        },
        {
          name: 'hasOlderComments',
          type: 'boolean',
          default: 'false',
          description: 'Shows Load earlier comments above the threads.',
        },
        {
          name: 'isLoadingOlder',
          type: 'boolean',
          default: 'false',
          description:
            'Holds Load earlier comments busy while your app fetches the page. A Promise from `onLoadOlder` does the same on its own.',
        },
        {
          name: 'onLoadOlder',
          type: '() => void | Promise<void>',
          description:
            'Loads the previous page: prepend it to `comments`. A rejected Promise shows an error Banner whose Retry takes the button’s place.',
        },
        {
          name: 'isSubmitting',
          type: 'boolean',
          default: 'false',
          description:
            'Host-controlled pending state for the composers. Promise callbacks get a built-in pending state as well.',
        },
        {
          name: 'onComposerDraftChange',
          type: '(value: string, context: CommentComposerContext) => void',
          description:
            'Reports drafts owned inside Comments: new comments, replies, and edits. It includes programmatic seeds and reports an empty value after submit, cancel, or a target switch. Route each update by `context`; debounce and expire typing in your app.',
        },
        {
          name: 'composerError',
          type: 'string',
          description:
            'Host-controlled error above the new-comment composer. A rejected `onSubmit` shows its own error with Retry.',
        },
        {
          name: 'reactionOptions',
          type: 'readonly CommentReactionOption[]',
          default: 'DEFAULT_COMMENT_REACTIONS',
          description:
            'The reactions Add reaction offers: Like, Love, Haha, Wow, Sad, and Celebrate by default, named in the viewer’s language. Give your own options a `description` to name them.',
        },
        {
          name: 'onSubmit',
          type: '(content: string, parentCommentId?: string) => void | Promise<void>',
          description:
            'Posts a comment or a reply. Replies always receive the thread’s first comment as the parent. A rejected Promise restores the draft and shows an error with Retry.',
        },
        {
          name: 'onSaveEdit',
          type: '(commentId: string, content: string) => void | Promise<void>',
          description:
            'Adds Edit to the viewer’s own comments and saves the new Markdown. A rejected Promise shows an error Banner with Retry.',
        },
        {
          name: 'onDelete',
          type: '(commentId: string) => void | Promise<void>',
          description:
            'Adds Delete to the viewer’s own comments, confirmed in a dialog first. A rejected Promise keeps the dialog open with the error.',
        },
        {
          name: 'onRetryComment',
          type: '(commentId: string) => void | Promise<void>',
          description: 'Adds Retry to a comment whose `status` is `error`.',
        },
        {
          name: 'onReact',
          type: '(commentId: string, reactionKey: string, option?: CommentReactionOption) => void | Promise<void>',
          description: 'Toggles the viewer’s reaction by its stable key.',
        },
        {
          name: 'onResolveThread',
          type: '(commentId: string) => void | Promise<void>',
          description:
            'Adds Mark as resolved to open threads. Set `isResolved` when the call succeeds, and filter resolved threads where they should not show.',
        },
        {
          name: 'onReopenThread',
          type: '(commentId: string) => void | Promise<void>',
          description:
            'Adds Reopen to resolved threads. Clear `isResolved` when the call succeeds.',
        },
        {
          name: 'loadVersions',
          type: '(commentId: string) => Promise<readonly CommentVersion[]>',
          description:
            'Loads a comment’s edit history, newest first. `previousVersions` works when the data is already loaded.',
        },
        {
          name: 'onUploadImages',
          type: '(files: readonly File[], context: CommentComposerContext) => CommentUploadedImage[] | Promise<CommentUploadedImage[]>',
          description:
            'Uploads images attached, pasted, or dropped in a composer and appends them as Markdown images. Your endpoint authorizes the viewer and validates the files.',
        },
        {
          name: 'composerTriggers',
          type: 'readonly ChatComposerTrigger[]',
          description:
            'Typeahead triggers for every composer, such as an `@` people search whose tokens your Markdown plugins render.',
        },
        {
          name: 'agentCommands',
          type: 'readonly CommentAgentCommand[]',
          description:
            'Agents a comment can address: typing `/` lists them, and a posted comment shows the command as the agent’s chip. Your app runs the agent.',
        },
        {
          name: 'markdownPlugins',
          type: 'readonly MarkdownPluginEntry[]',
          description:
            'Block Markdown plugins for comment bodies, such as embeds for your own entities.',
        },
        {
          name: 'markdownInlinePlugins',
          type: 'readonly MarkdownInlinePlugin[]',
          description:
            'Inline Markdown plugins for comment bodies, such as the mentions your triggers insert.',
        },
        {
          name: 'getReplyMention',
          type: '(author: CommentUser) => string | undefined',
          description:
            'Seeds a reply to a reply with a mention of its author in your mention format.',
        },
        {
          name: 'hasEmojiPicker',
          type: 'boolean',
          default: 'true',
          description: 'Whether composers offer the emoji picker.',
        },
        {
          name: 'emptyState',
          type: 'ReactNode',
          description: 'Replaces the default no-comments state.',
        },
        {
          name: 'renderAnchor',
          type: '(comment: CommentThreadData, defaultAnchor: ReactNode) => ReactNode',
          description:
            'Replaces a thread’s quoted passage, for example to link it back to the document.',
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
          name: 'renderEvent',
          type: '(event: CommentActivityEvent) => ReactNode',
          description: 'Replaces an activity event’s timeline row.',
        },
        {
          name: 'renderAdditionalActions',
          type: '(comment: CommentData) => ReactNode',
          description:
            'Adds product actions to a comment’s header, after the built-in ones.',
        },
        {
          name: 'renderComposer',
          type: '(props: CommentComposerRenderProps) => ReactNode',
          description:
            'Replaces every composer’s input while the panel keeps its draft, pending, error, and context state. Your composer owns its own focus and keyboard handling.',
        },
      ],
    },
    {name: 'CommentThread'},
    {name: 'CommentComposer'},
  ],
  playground: {
    defaults: {
      comments: [
        {
          id: 'preview-root',
          author: {id: 'avery', name: 'Avery Kim'},
          body: 'The final states are ready for review.',
          createdAt: '2026-09-30T19:00:00Z',
          reactions: [
            {
              key: 'like',
              label: '👍',
              count: 2,
              reactedByViewer: true,
            },
          ],
          replies: [
            {
              id: 'preview-reply',
              author: {id: 'maya', name: 'Maya Chen'},
              body: 'Reviewed the empty and error states.',
              createdAt: '2026-09-30T19:10:00Z',
            },
          ],
        },
      ],
      events: [
        {
          id: 'preview-event',
          label: 'Status changed to Ready for review',
          createdAt: '2026-09-30T19:15:00Z',
        },
      ],
      currentUser: {id: 'avery', name: 'Avery Kim'},
      mode: 'read-only',
      density: 'compact',
      container: 'section',
    },
  },
  examples: [
    {
      label: 'Comments panel',
      code: `import {useState} from 'react';
import {VStack} from '@astryxdesign/core/Layout';
import {Comments} from '@astryxdesign/lab';

const viewer = {id: 'avery', name: 'Avery Kim'};

export default function Example() {
  const [comments, setComments] = useState([
    {
      id: 'root',
      author: {id: 'maya', name: 'Maya Chen'},
      body: 'Can you review the rollout plan before Friday?',
      createdAt: '2026-09-30T19:00:00Z',
    },
  ]);
  const post = (body, parentId) => {
    const comment = {
      id: 'comment-' + Date.now(),
      author: viewer,
      body,
      createdAt: new Date().toISOString(),
    };
    setComments(current =>
      parentId == null
        ? [...current, comment]
        : current.map(root =>
            root.id === parentId
              ? {...root, replies: [...(root.replies ?? []), comment]}
              : root,
          ),
    );
  };
  return (
    <VStack width={560} height={420}>
      <Comments
        comments={comments}
        currentUser={viewer}
        density="compact"
        onSubmit={post}
      />
    </VStack>
  );
}`,
    },
    {
      label: 'Inside a card',
      code: `import {Card} from '@astryxdesign/core/Card';
import {Comments} from '@astryxdesign/lab';

<Card padding={0} width={360} height={440}>
  <Comments
    comments={comments}
    currentUser={viewer}
    container="card"
    density="compact"
    onSubmit={post}
  />
</Card>`,
    },
    {
      label: 'Inline comments',
      code: `import {Comments} from '@astryxdesign/lab';

<Comments
  comments={[
    {
      id: 'inline',
      author: {id: 'maya', name: 'Maya Chen'},
      body: 'Should this say three days?',
      createdAt: '2026-09-30T19:00:00Z',
      anchor: {quote: 'The final cohort completes rollout in two days.'},
    },
  ]}
  currentUser={viewer}
  selectedThreadId={selectedThreadId}
  onSelectedThreadChange={setSelectedThreadId}
  composerAnchor={selection}
  onComposerAnchorDismiss={() => setSelection(undefined)}
  onSubmit={post}
/>`,
    },
    {
      label: 'Live collaboration state',
      code: `import {Comments} from '@astryxdesign/lab';

<Comments
  comments={comments.map(thread => ({
    ...thread,
    typingUsers: typingUsersByThread[thread.id] ?? [],
    seenBy: seenByComment[thread.id] ?? [],
    replies: thread.replies?.map(reply => ({
      ...reply,
      seenBy: seenByComment[reply.id] ?? [],
    })),
  }))}
  currentUser={viewer}
  onSubmit={post}
  onComposerDraftChange={(value, context) =>
    publishTyping({context, isTyping: value.trim() !== ''})
  }
/>`,
    },
    {
      label: 'Resolved threads',
      code: `import {Comments} from '@astryxdesign/lab';

<Comments
  comments={showResolved ? comments : comments.filter(c => !c.isResolved)}
  currentUser={viewer}
  onSubmit={post}
  onResolveThread={id => setResolved(id, true)}
  onReopenThread={id => setResolved(id, false)}
/>`,
    },
  ],
};

export const docsZh = {
  "name": "Comments",
  "description": "单个项目上的评论：支持一级回复的评论线程、表情回应、编辑历史、受控的输入中状态和已读元数据、行内评论引用，以及按时间顺序排列的活动事件，并提供用于新评论的撰写器。受控：你的应用持有数据和每次变更；面板负责展示、选择和焦点。",
  "usage": {
    "description": "Comments 面板显示关于文档、任务或记录的对话：评论线程和活动，以及用于新评论的撰写器。可将其用作填充有尺寸容器的侧面板或分区，也可嵌入卡片或弹出层中并按其内容高度显示。使用 CommentThread 渲染单个线程，使用 CommentComposer 渲染独立撰写器。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持数据受控：每次回调后更新 `comments`。返回 Promise，以便面板显示等待状态，并在拒绝时显示带 Retry 的错误。"
      },
      {
        "guidance": true,
        "description": "匹配表面：为面板指定明确高度，在卡片或弹出层内使用 `layout=\"embedded\"`，并在卡片父级上设置 `container=\"card\"`，以免卡片嵌套。"
      },
      {
        "guidance": true,
        "description": "对于行内评论，将锚定逻辑保留在你的应用中：为每个线程传入 `anchor`，当它无法再解析时标记为 `orphaned`，并让 `selectedThreadId` 与你高亮的段落同步。"
      },
      {
        "guidance": true,
        "description": "保持实时状态受控且与传输无关：将你的协作层映射到 `typingUsers` 和 `seenBy`，并使用 `onComposerDraftChange` 发布本地活动。除非评论渲染回调呈现，否则 `seenBy` 保持隐藏。在你的应用中对瞬时活动做防抖和过期处理。"
      },
      {
        "guidance": false,
        "description": "不要在渲染槽中放置数据获取、授权或遥测逻辑。将它们保留在你的应用中，并以数据形式传入结果。"
      },
      {
        "guidance": false,
        "description": "不要假设 `selectedThreadId` 会移动焦点或打开撰写器。它会显示并滚动到受控线程，而不会打断查看者；只有其 Reply 操作才会打开回复撰写器。"
      }
    ],
    "accessibility": [
      {
        "name": "评论列表",
        "category": "Semantics",
        "criterion": "",
        "description": "线程位于一个按区域命名的 log 中，例如 “Threads in Launch plan”，因此屏幕阅读器会以礼貌方式朗读新评论。每条评论是一个以其作者命名的 article，区域会在评论加载时报告繁忙。"
      },
      {
        "name": "实时更新",
        "category": "Content",
        "criterion": "4.1.3 Status Messages",
        "description": "输入中状态是一条礼貌的状态消息，带有对减少动态效果安全的圆点。`seenBy` 元数据没有默认呈现方式，也不引入额外的 live region。"
      },
      {
        "name": "线程切换按钮",
        "category": "Keyboard",
        "criterion": "2.1.1 Keyboard",
        "description": "每个线程有一个切换按钮（WAI-ARIA Button 模式，带 aria-pressed），名称为 “Thread by” 加上作者。按 Enter 或 Space 可打开或关闭它，并将焦点保持在它上面；用指针按下线程会打开它，并将焦点放入回复撰写器。当切换按钮拥有焦点时，整个表面会采用系统焦点环。"
      },
      {
        "name": "回复和操作",
        "category": "Keyboard",
        "criterion": "",
        "description": "View replies 是一个带 aria-expanded 和 aria-controls 的展开按钮（WAI-ARIA Disclosure 模式）。更多菜单遵循 Menu Button 模式；保存或取消编辑，或删除对话框关闭后，焦点会返回到它。"
      },
      {
        "name": "变更后的焦点",
        "category": "Keyboard",
        "criterion": "2.4.3 Focus Order",
        "description": "焦点永远不会掉到页面上。删除后，焦点会移到下一个线程；如果删除的是回复，则移到该线程。Load earlier comments 会将焦点保持在自身，或在加载失败时保持在替代它的 Retry 上。面板挂载时选中的线程会打开，但不会夺取焦点。"
      },
      {
        "name": "忙碌操作",
        "category": "Keyboard",
        "criterion": "",
        "description": "Post 和表情回应在请求进行期间保持可聚焦，并拒绝第二次按下，因此请求进行中焦点不会掉到页面上。"
      },
      {
        "name": "错误",
        "category": "Content",
        "criterion": "4.1.3 Status Messages",
        "description": "失败会显示在出错对象旁边的错误 Banner 中，每个都带有 Retry（当操作可重复时）。Banner 自身没有 live 角色：其失败会通过共享播报通道以 assertive 方式朗读一次，除非它位于聊天日志内（由日志负责送达）。仍在撰写的评论的进度标签遵循相同规则，但使用礼貌方式。编辑历史对话框会通过对话框内的 alert 区域朗读其失败。删除失败会在确认对话框更改文本时以 assertive 方式朗读一次。"
      }
    ],
    "anatomy": [
      {
        "name": "线程",
        "required": true,
        "description": "在 section 父级上是一个带轮廓的 Card，在 card 父级上则是带 1px 分隔线的通栏 Section。选中它会打开线程：正文取消截断，回复显示，回复撰写器打开，并在指针按下时获得焦点。"
      },
      {
        "name": "头像",
        "required": true,
        "description": "28×28 的图片或首字母：人员为圆形，代理为圆角方形。在线程打开时，一条 2px 的轨道会将各段头像连接起来。"
      },
      {
        "name": "头部",
        "required": true,
        "description": "高度与一个头像相当：姓名、相对时间、Edited（打开编辑历史）和 Resolved。当指针或焦点位于线程上时，会显示 Mark as resolved 或 Reopen、Add reaction、Reply、Copy link 以及更多菜单（Edit、Delete），空间不足时会折叠进更多菜单。"
      },
      {
        "name": "引用段落",
        "required": false,
        "description": "行内评论会以斜体 blockquote 引用其段落，其标线采用高亮颜色。被编辑掉的段落会保留中性标线并显示 Outdated 徽章。"
      },
      {
        "name": "正文",
        "required": true,
        "description": "Markdown，在线程打开前截断为三行。图片在 Lightbox 中打开。仍在撰写的评论会改为显示其进度。"
      },
      {
        "name": "表情回应",
        "required": false,
        "description": "每个表情回应都有一个切换按钮，查看者已回应时为按下状态；其提示会说明回应者是谁。"
      },
      {
        "name": "回复",
        "required": false,
        "description": "只有一级，位于 View replies 之后。宿主标记的未读回复会在不选中线程、不移动焦点、也不打开回复撰写器的情况下显示。回复某条回复会发布到线程中。"
      },
      {
        "name": "实时状态",
        "required": false,
        "description": "受控的输入中状态会显示在打开的线程末尾，其脉动圆点在头像列中，标签在评论文本行上。受控的 `seenBy` 元数据可供评论渲染回调使用，但没有默认呈现方式。"
      },
      {
        "name": "活动事件",
        "required": false,
        "description": "用于状态变化或其他事件的时间线行，按时间与线程交错排列。"
      },
      {
        "name": "撰写器",
        "required": false,
        "description": "停靠在底部（或顶部）的两行 CommentComposer：输入框在上方，附件和表情按钮以及 Post 在下方。"
      }
    ]
  },
  "components": [
    {
      "name": "Comments",
      "description": "按时间顺序排列的评论线程和活动事件，以及用于新评论的撰写器和线程打开的对话框。",
      "propDescriptions": {
        "comments": "线程：每个线程的第一条评论，携带 `replies`（一级）、`reactions`、瞬时的 `typingUsers`、每条评论隐藏的 `seenBy` 元数据、行内评论的 `anchor`、`isResolved`、`status`、`progress` 以及每条评论的权限。`seenBy` 仍可供评论渲染回调使用。与 `events` 一起按时间顺序显示。",
        "events": "项目上的活动，按 `createdAt` 以紧凑时间线行的形式与线程交错。",
        "currentUser": "查看者：其自己的评论会获得 Edit 和 Delete，其头像位于回复撰写器旁。授权仍由你的应用负责。",
        "mode": "`interactive` 启用所有允许的操作；`non-editable` 保留创建、回复和表情回应，但移除编辑和删除；`read-only` 移除所有会更改数据的控件。",
        "label": "Comments 区域的无障碍名称。默认为本地化的 “Comments”。",
        "composerPosition": "新评论撰写器的渲染位置。",
        "density": "线程之间以及列表周围的间距。",
        "container": "父级表面。`section` 会将每个线程渲染为带轮廓的 Card；`card` 会渲染由分隔线界定、且分隔线重叠为单线的 Section。",
        "layout": "`pane` 填满其容器并滚动，撰写器停靠。`embedded` 在宿主表面内按内容高度显示：没有滚动区域或停靠，在卡片父级上也没有外框线。",
        "composerPlaceholder": "新评论撰写器的占位文本。默认为本地化的 “Write a comment…”，回复时显示 “Reply to <name>…”；自定义值会同时替换两者。",
        "selectedThreadId": "受控的打开线程，供将线程与文档同步的宿主使用。宿主选中的线程会打开其正文和回复并滚动到可见位置，但不会移动焦点或打开回复撰写器。",
        "onSelectedThreadChange": "查看者打开线程或关闭已打开线程时调用。",
        "composerAnchor": "新评论将附加的段落，会引用在撰写器中。面板显示期间出现的锚点会将焦点移到撰写器。",
        "onComposerAnchorDismiss": "为撰写器的引用添加 Remove quoted text；调用时应清除 `composerAnchor`。",
        "composerControls": "新评论撰写器页脚中由产品拥有的控件，位于附件和表情按钮之后。",
        "highlightColor": "你的应用用于高亮段落的调色板颜色。引用会使用其 `--color-border-<color>` 令牌绘制标线。",
        "isLoading": "显示评论形状的占位符，并将区域报告为繁忙。",
        "loadError": "在线程上方显示错误 Banner，用于加载失败的评论。",
        "onRetryLoad": "为 `loadError` Banner 添加 Retry；Promise 会让 Retry 保持忙碌直到其完成。",
        "hasOlderComments": "在线程上方显示 Load earlier comments。",
        "isLoadingOlder": "在你的应用获取页面时让 Load earlier comments 保持忙碌。来自 `onLoadOlder` 的 Promise 也会自动如此。",
        "onLoadOlder": "加载上一页：将其前插到 `comments`。被拒绝的 Promise 会显示错误 Banner，其 Retry 会取代按钮的位置。",
        "isSubmitting": "宿主控制的撰写器等待状态。Promise 回调也会获得内置的等待状态。",
        "onComposerDraftChange": "报告 Comments 内部拥有的草稿：新评论、回复和编辑。它包括程序化种子，并在提交、取消或切换目标后报告空值。按 `context` 路由每次更新；在你的应用中对输入中状态做防抖和过期处理。",
        "composerError": "宿主控制的新评论撰写器上方错误。被拒绝的 `onSubmit` 会显示自己的错误并带 Retry。",
        "reactionOptions": "Add reaction 提供的表情回应：默认包括 Like、Love、Haha、Wow、Sad 和 Celebrate，以查看者的语言命名。为你自己的选项提供 `description` 来命名它们。",
        "onSubmit": "发布评论或回复。回复始终以线程的第一条评论作为父级。被拒绝的 Promise 会恢复草稿并显示带 Retry 的错误。",
        "onSaveEdit": "为查看者自己的评论添加 Edit，并保存新的 Markdown。被拒绝的 Promise 会显示带 Retry 的错误 Banner。",
        "onDelete": "为查看者自己的评论添加 Delete，并先通过对话框确认。被拒绝的 Promise 会保持对话框打开并显示错误。",
        "onRetryComment": "为 `status` 为 `error` 的评论添加 Retry。",
        "onReact": "按稳定键切换查看者的表情回应。",
        "onResolveThread": "为打开的线程添加 Mark as resolved。调用成功时设置 `isResolved`，并在不应显示已解决线程的地方过滤它们。",
        "onReopenThread": "为已解决的线程添加 Reopen。调用成功时清除 `isResolved`。",
        "loadVersions": "加载评论的编辑历史，按最新优先。`previousVersions` 在数据已加载时可用。",
        "onUploadImages": "上传在撰写器中附加、粘贴或拖放的图片，并将其作为 Markdown 图片追加。你的端点负责授权查看者并校验文件。",
        "composerTriggers": "每个撰写器的输入联想触发器，例如由你的 Markdown 插件渲染令牌的 `@` 人员搜索。",
        "agentCommands": "评论可以面向的代理：输入 `/` 会列出它们，已发布的评论会将该命令显示为代理的 chip。你的应用负责运行代理。",
        "markdownPlugins": "评论正文的块级 Markdown 插件，例如为自有实体提供嵌入。",
        "markdownInlinePlugins": "评论正文的行内 Markdown 插件，例如触发器插入的提及。",
        "getReplyMention": "在你的提及格式中用作者提及为对回复的回复提供种子。",
        "hasEmojiPicker": "撰写器是否提供表情选择器。",
        "emptyState": "替换默认的无评论状态。",
        "renderAnchor": "替换线程的引用段落，例如将其链接回文档。",
        "renderBody": "替换评论的 Markdown 正文。",
        "renderVersionBody": "替换编辑历史中某个版本的正文。",
        "renderEvent": "替换活动事件的时间线行。",
        "renderAdditionalActions": "在内置操作之后，为评论头部添加产品操作。",
        "renderComposer": "替换每个撰写器的输入框，同时面板保留其草稿、等待、错误和上下文状态。你的撰写器负责自己的焦点和键盘处理。"
      }
    },
    {
      "name": "CommentThread",
      "description": ""
    },
    {
      "name": "CommentComposer",
      "description": ""
    }
  ]
};
