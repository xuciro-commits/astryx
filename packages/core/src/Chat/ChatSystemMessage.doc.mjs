// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatSystemMessage',
  subComponentOf: 'Chat',
  displayName: 'Chat System Message',
  description:
    'Centered system message for non-sender content like date separators, membership changes, and status notices. It is not a chat bubble; it has no avatar, no alignment, and no sender context. Use the divider variant for temporal breaks and default for inline status updates.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'System message content: factual text or React content such as a date, join/leave notice, or status change. Long default content wraps within the available width.',
      required: true,
    },
    {
      name: 'variant',
      type: "'default' | 'divider'",
      description:
        "Visual variant. 'default' renders centered text. 'divider' adds horizontal lines on each side via Divider: use for date separators and section breaks.",
      default: "'default'",
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Optional caller-provided icon content. Rendered before the message in the default variant; the divider variant currently does not render it. Wrap in Icon for consistent sizing.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [
      {className: 'astryx-chat-system-message', visualProps: ['variant']},
    ],
  },
  usage: {
    description:
      'Use ChatSystemMessage for concise, non-sender content inside a chat transcript. Choose the default variant for factual status notices and the divider variant for date or section breaks. Long default content wraps within the available width. It carries no live role: inside a ChatMessageList, the log announces new notices. The divider branch includes a labelled separator.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep the visible message concise and self-contained so it remains understandable without an icon.',
      },
      {
        guidance: true,
        description:
          'Use the divider variant for temporal or section boundaries and the default variant for factual status notices.',
      },
      {
        guidance: false,
        description:
          'Use ChatSystemMessage for sender-authored content; use ChatMessage and ChatMessageBubble instead.',
      },
      {
        guidance: false,
        description:
          'Use caller-provided icon artwork as the only source of meaning; the visible message must carry the same information.',
      },
    ],
    anatomy: [
      {
        name: 'System message',
        required: true,
        description:
          'The noninteractive status row that carries the chat-system-message theme target.',
      },
      {
        name: 'Content',
        required: true,
        description: 'The concise caller-provided message or divider label.',
      },
      {
        name: 'Icon content',
        required: false,
        description:
          'Rendered before the message in the default variant; the divider variant currently does not render it.',
      },
      {
        name: 'Divider',
        required: false,
        description:
          'A labelled horizontal Divider rendered by the divider variant.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ChatSystemMessage",
  "displayName": "Chat System Message",
  "description": "居中的系统消息，用于日期分隔、成员变更和状态通知等非发送者内容。它不是聊天气泡；没有头像、没有对齐方式，也没有发送者上下文。时间分隔请使用 divider 变体，行内状态更新请使用 default 变体。",
  "propDescriptions": {
    "children": "系统消息内容：事实性文本，或日期、加入/离开通知、状态变更等 React 内容。较长的 default 内容会在可用宽度内换行。",
    "variant": "视觉变体。'default' 渲染居中文本。'divider' 通过 Divider 在两侧添加水平线：用于日期分隔和章节分隔。",
    "icon": "可选的调用方图标内容。在 default 变体中渲染于消息之前；divider 变体目前不渲染它。请包裹在 Icon 中以获得一致的尺寸。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 `stylex.create()` 的值：不能是 `style={{}}` 这样的内联样式对象。"
  },
  "theming": {
    "targets": [
      {
        "className": "astryx-chat-system-message",
        "visualProps": [
          "variant"
        ]
      }
    ]
  },
  "usage": {
    "description": "在聊天记录中使用 ChatSystemMessage 呈现简洁的非发送者内容。事实性状态通知请选择 default 变体，日期或章节分隔请选择 divider 变体。较长的 default 内容会在可用宽度内换行。它本身不携带实时区域角色：在 ChatMessageList 内，由日志播报新的通知。divider 分支包含一个带标签的分隔线。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持可见消息简洁且自成一体，使其在没有图标时仍可理解。"
      },
      {
        "guidance": true,
        "description": "时间或章节边界请使用 divider 变体，事实性状态通知请使用 default 变体。"
      },
      {
        "guidance": false,
        "description": "不要将 ChatSystemMessage 用于发送者编写的内容；请改用 ChatMessage 和 ChatMessageBubble。"
      },
      {
        "guidance": false,
        "description": "不要将调用方提供的图标图案作为唯一的信息来源；可见消息必须传达相同的信息。"
      }
    ],
    "anatomy": [
      {
        "name": "系统消息",
        "required": true,
        "description": "承载 chat-system-message 主题目标（theme target）的非交互状态行。"
      },
      {
        "name": "内容",
        "required": true,
        "description": "调用方提供的简洁消息或分隔线标签。"
      },
      {
        "name": "图标内容",
        "required": false,
        "description": "在 default 变体中渲染于消息之前；divider 变体目前不渲染它。"
      },
      {
        "name": "分隔线",
        "required": false,
        "description": "由 divider 变体渲染的带标签水平 Divider。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatSystemMessage',
  displayName: 'Chat System Message',
  description:
    'centered non-sender msg; divider variant for date breaks, default for status notices; accepts optional icon content',
  usage: {
    description:
      'Use for concise non-sender content in chat. Default is a factual status row; divider is a labelled date/section break.',
    bestPractices: [
      {
        guidance: true,
        description: 'Keep visible content concise and self-contained.',
      },
      {
        guidance: true,
        description:
          'Use divider for temporal/section boundaries and default for factual notices.',
      },
      {
        guidance: false,
        description:
          'Use for sender-authored content; use ChatMessage and ChatMessageBubble.',
      },
      {
        guidance: false,
        description: 'Rely on icon artwork as the only source of meaning.',
      },
    ],
  },
  propDescriptions: {
    children:
      'factual React content: date, join/leave, status change; long default content wraps',
    variant:
      'default=centered text, divider=horizontal lines via Divider for date/section breaks',
    icon: 'optional caller icon; rendered before default message; divider currently does not render it',
    xstyle: 'additional StyleX layout styles',
  },
};
