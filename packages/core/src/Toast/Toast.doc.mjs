// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Toast',
  displayName: 'Toast',
  group: 'Toast',
  category: 'Overlay',
  hiddenComponents: ['ToastViewport'],
  keywords: [
    'toast',
    'notification',
    'snackbar',
    'alert',
    'message',
    'feedback',
    'status',
  ],

  playground: {
    defaults: {body: 'Changes saved'},
  },

  props: [
    {
      name: 'body',
      type: 'ReactNode',
      description: 'Primary message content.',
      required: true,
      slotElements: [
        {__element: 'Text', props: {type: 'body'}, children: 'Toast message'},
      ],
    },
    {
      name: 'type',
      type: "'info' | 'error'",
      description:
        'Toast type controlling background color. Error toasts persist until dismissed.',
      default: "'info'",
    },
    {
      name: 'isAutoHide',
      type: 'boolean',
      description:
        'Whether the toast auto-dismisses. Defaults to true for info, false for error.',
    },
    {
      name: 'autoHideDuration',
      type: 'number',
      description:
        'Duration in ms before auto-dismiss. Timed content must satisfy WCAG 2.2.1.',
      default: '5000',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description:
        'Content rendered at the trailing end (e.g. Undo button, link). Keep action labels short.',
      slotElements: [
        {__element: 'Icon', props: {icon: 'chevronDown', size: 'sm'}},
        {__element: 'Badge', props: {label: '3'}},
      ],
    },
    {
      name: 'uniqueID',
      type: 'string',
      description: 'Unique identifier for deduplication.',
    },
    {
      name: 'collisionBehavior',
      type: "'overwrite' | 'ignore'",
      description:
        'Behavior when a toast with matching uniqueID already exists.',
      default: "'overwrite'",
    },
    {
      name: 'onHide',
      type: '(reason: "auto" | "manual") => void',
      description: 'Callback fired when the toast is removed.',
    },
    {
      name: 'onDismiss',
      type: '(reason: "auto" | "manual") => void',
      description: 'Callback fired when the toast is dismissed.',
      required: true,
    },
    {
      name: 'renderContent',
      type: '(toast: ToastContentRenderProps) => ReactNode',
      description:
        "Replaces the content of this toast's card with your own layout. Astryx keeps the card, its astryx-toast theme target and auto-hide behavior (inside a ToastViewport the viewport announces the toast, over a modal too, and the card itself is not a live region), then hands the renderer the message, endContent, resolved toast settings and a dismiss callback. The custom renderer owns every control in its layout: compose the control you want and call dismiss from it. Astryx does not inject a fallback close into custom content. Per-toast: an app shares one layout by wrapping useToast and passing it on every call, while a toast raised by library code that never passes it renders as an ordinary Astryx toast. The argument is {body, endContent, type, isAutoHide, autoHideDuration, dismiss}, where type is 'info' | 'error'.",
    },
  ],
  theming: {
    targets: [{className: 'astryx-toast', visualProps: ['type']}],
    vars: [
      {
        name: '--_toast-slide-y',
        description:
          'Private block-axis offset inherited from ToastViewport for entry and exit motion',
        default: 'var(--spacing-2)',
        private: true,
      },
      {
        name: '--_toast-swipe-y',
        description: 'Private active swipe offset along the block axis',
        default: '0px',
        private: true,
      },
      {
        name: '--_toast-swipe-exit-y',
        description: 'Private completed-swipe exit offset',
        default: 'var(--_toast-swipe-y)',
        private: true,
      },
      {
        name: '--_toast-swipe-opacity',
        description: 'Private opacity feedback during an accepted swipe',
        default: '1',
        private: true,
      },
      {
        name: '--_toast-swipe-scale',
        description: 'Private scale feedback during an accepted swipe',
        default: '1',
        private: true,
      },
    ],
  },

  usage: {
    description:
      'Toast shows a brief, non-blocking notification to confirm an action or present temporary information. Use it for scenarios where the user needs feedback but not a decision, such as saving, deleting, or changing a status.\n\nFor production use, prefer the `useToast()` hook; it handles positioning, stacking, auto-dismiss, and deduplication via `ToastViewport`. Toasts stay within viewport and safe-area gutters, wrap long message content, and enter, exit, or swipe-dismiss toward their configured top or bottom edge. The vertical swipe uses the same spatial model as placement motion: top Toasts leave upward and bottom Toasts leave downward. Swipe waits for dominant edge-directed intent before cancelling native touch movement and reports the existing manual dismissal reason. Pen is supported as direct-contact input; mouse drag is excluded to avoid conflicting with desktop text selection, where the visible close control remains available. Set `isAutoHide: false` explicitly when an action or message must remain available. The `Toast` component renders the visual toast element inline and is useful for previews, documentation, and static showcases where the viewport lifecycle is not needed. Host `data-*` attributes on `Toast` reach the toast element; its role, live-region attributes, and theme attributes stay component-owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep messages short: only a few words that tell the user what happened, like "Changes saved" or "Message sent".',
      },
      {
        guidance: true,
        description:
          'Add a short undo action in the endContent slot for reversible operations. Set isAutoHide to false when the action must remain available.',
      },
      {
        guidance: true,
        description:
          'Use uniqueID to deduplicate toasts that fire from repeated actions, like clicking a save button multiple times.',
      },
      {
        guidance: true,
        description:
          "Use error type for failures that need attention but not immediate action; it persists until dismissed so the user won't miss it.",
      },
      {
        guidance: false,
        description:
          "Don't use a toast for critical errors that block the user. Use Banner for persistent, in-context messaging that requires acknowledgment.",
      },
      {
        guidance: false,
        description:
          "Don't put long or multi-line content in a toast; it disappears after 5 seconds and the user may not finish reading.",
      },
      {
        guidance: false,
        description:
          "Don't show form validation errors as toasts. Use inline field validation so the user can see exactly which field needs fixing.",
      },
    ],
    anatomy: [
      {
        name: 'Body',
        required: true,
        description:
          'The primary message text describing what happened or what the user should know.',
      },
      {
        name: 'End content',
        required: false,
        description:
          'A trailing action like an Undo button or a link, placed after the body text.',
      },
      {
        name: 'Dismiss button',
        required: true,
        description:
          'A close button that lets the user manually dismiss the toast before auto-hide.',
      },
    ],
  },
};

// -------------------------------------------------------
// Auto-generated translations below. Do not edit manually.
// Regenerate with the dense compression protocol.
// See .context/decisions/dense-compression-protocol.md
// -------------------------------------------------------

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "propDescriptions": {
    "body": "主要消息内容。",
    "type": "控制背景颜色的 Toast 类型。error Toast 会一直保留到被关闭。",
    "isAutoHide": "Toast 是否自动消失。info 默认为 true，error 默认为 false。",
    "autoHideDuration": "自动消失前的持续时间（毫秒）。定时内容必须满足 WCAG 2.2.1。",
    "endContent": "在尾端渲染的内容（例如撤销按钮、链接）。保持操作标签简短。",
    "uniqueID": "用于去重的唯一标识符。",
    "collisionBehavior": "当具有匹配 uniqueID 的 Toast 已存在时的行为。",
    "onHide": "Toast 被移除时触发的回调。",
    "renderContent": "用你自己的布局替换此 Toast 卡片的内容。Astryx 保留卡片、其 astryx-toast 主题目标和自动隐藏行为（在 ToastViewport 内由视口播报 Toast，在模态框上方也是如此，卡片本身不是 live region），然后将消息、endContent、解析后的 Toast 设置和 dismiss 回调交给渲染器。自定义渲染器负责其布局中的每个控件：组合所需的控件，并从该控件调用 dismiss。Astryx 不会向自定义内容注入后备关闭按钮。按 Toast 生效：应用可以通过包装 useToast 并在每次调用时传入同一布局来共享布局，而库代码触发且从未传入该布局的 Toast 会渲染为普通的 Astryx Toast。参数为 {body, endContent, type, isAutoHide, autoHideDuration, dismiss}，其中 type 为 'info' | 'error'。",
    "onDismiss": "Toast 被关闭时触发的回调。"
  },
  "usage": {
    "description": "Toast 显示简短的非阻塞通知，用于确认操作或呈现临时信息。适用于用户需要反馈但不需要做决定的情景，例如保存、删除或更改状态。\n\n生产环境中，优先使用 `useToast()` Hook；它通过 `ToastViewport` 处理定位、堆叠、自动消失和去重。Toast 会保持在视口和安全区间距内，长消息内容会换行，并朝其配置的顶部或底部边缘进入、退出或滑动消失。垂直滑动使用与放置动效相同的空间模型：顶部 Toast 向上离开，底部 Toast 向下离开。滑动会等待主导的边缘方向意图，然后才取消原生触摸移动，并报告现有的手动关闭原因。支持触控笔作为直接接触输入；鼠标拖动被排除，以避免与桌面文本选择冲突，此时仍可使用可见的关闭控件。当操作或消息必须保持可用时，请显式设置 `isAutoHide: false`。`Toast` 组件以内联方式渲染视觉 Toast 元素，适用于不需要视口生命周期的预览、文档和静态展示。`Toast` 上宿主传入的 `data-*` 属性会到达 Toast 元素；其 role、live-region 属性和主题属性仍由组件管理。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持消息简短：只用几个词告诉用户发生了什么，例如 \"Changes saved\" 或 \"Message sent\"。"
      },
      {
        "guidance": true,
        "description": "对于可逆操作，在 endContent 槽中添加简短的撤销操作。当操作必须保持可用时，将 isAutoHide 设为 false。"
      },
      {
        "guidance": true,
        "description": "使用 uniqueID 对重复操作（如多次点击保存按钮）触发的 Toast 去重。"
      },
      {
        "guidance": true,
        "description": "对于需要关注但无需立即处理的失败，使用 error 类型；它会一直保留到被关闭，因此用户不会错过。"
      },
      {
        "guidance": false,
        "description": "不要将 Toast 用于阻塞用户的严重错误。需要用户确认的持续、上下文内消息请使用 Banner。"
      },
      {
        "guidance": false,
        "description": "不要在 Toast 中放置过长或多行内容；它会在 5 秒后消失，用户可能读不完。"
      },
      {
        "guidance": false,
        "description": "不要将表单验证错误显示为 Toast。使用内联字段验证，让用户准确看到需要修正的字段。"
      }
    ],
    "anatomy": [
      {
        "name": "正文",
        "required": true,
        "description": "描述发生了什么或用户需要知道什么的主要消息文本。"
      },
      {
        "name": "末端内容",
        "required": false,
        "description": "放置在正文之后的尾随操作，例如撤销按钮或链接。"
      },
      {
        "name": "关闭按钮",
        "required": true,
        "description": "让用户在自动隐藏之前手动关闭 Toast 的关闭按钮。"
      }
    ]
  },
  "name": "Toast"
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'toast notification w/ auto-dismiss, stacking, dedup, smooth animations; MediaTheme inverted surface',
  usage: {
    description:
      'Brief non-blocking notification for action confirmations and temporary info. Use where user needs feedback not decisions: saves, deletes, status changes. useToast() hook for production (safe-area positioning, responsive message wrapping, stacking, auto-dismiss, dedup via ToastViewport). Enters, exits, or swipe-dismisses toward configured edge; touch is claimed only after dominant edge-directed intent; swipe reports manual. Pen uses the direct-contact gesture; mouse drag stays off to preserve text selection and the close control remains available. Set isAutoHide false explicitly for must-remain actions/messages. Toast renders inline for previews/docs/static showcases. Host data-* attrs on Toast reach the toast element; role, live-region, theme attrs stay owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Short messages, a few words: "Changes saved", "Message sent".',
      },
      {
        guidance: true,
        description:
          'Short Undo action in endContent for reversible ops; set isAutoHide false when it must remain available.',
      },
      {
        guidance: true,
        description: 'uniqueID to dedup repeated action toasts.',
      },
      {
        guidance: true,
        description:
          'Error type for failures needing attention; persists until dismissed.',
      },
      {
        guidance: false,
        description:
          "Don't use for critical blocking errors. Use Banner for persistent in-context messaging.",
      },
      {
        guidance: false,
        description:
          "Don't put long/multi-line content; disappears in 5s, user may not finish reading.",
      },
      {
        guidance: false,
        description:
          "Don't show form validation errors. Use inline field validation instead.",
      },
    ],
  },
  propDescriptions: {
    body: 'primary message content',
    type: 'toast type; controls bg color; error persists until dismissed',
    isAutoHide: 'auto-dismiss; true for info, false for error',
    autoHideDuration:
      'ms before auto-dismiss; timed content must satisfy WCAG 2.2.1',
    endContent:
      'trailing end content (undo btn, link); keep action labels short',
    uniqueID: 'unique id for dedup',
    collisionBehavior: 'behavior when matching uniqueID exists',
    onHide: 'callback when toast removed',
    renderContent:
      'custom inner layout; receives content, resolved settings + dismiss callback; no injected fallback control',
  },
};
