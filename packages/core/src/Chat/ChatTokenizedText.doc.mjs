// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatTokenizedText',
  subComponentOf: 'Chat',
  displayName: 'Chat Tokenized Text',
  isHiddenFromOverview: true,
  description:
    'Renders a text string with token patterns replaced by inline token content. Wrap any message body inside ChatMessageBubble to turn raw @mentions, #tags, or /commands into styled content. When no non-empty token matches or none are provided, the text renders as-is, so you can use ChatTokenizedText unconditionally on every message.',
  props: [
    {
      name: 'children',
      type: 'string',
      description:
        "The plain text message containing serialized token values. Patterns matching a token's value are replaced with inline token content.",
      required: true,
    },
    {
      name: 'tokens',
      type: 'ChatComposerToken[]',
      description:
        'Token definitions using the same type as composer input. Each non-empty value is matched literally. Empty values are ignored. Structured tokens render a Badge, while custom tokens render caller content.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the root text wrapper. Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-chat-tokenized-text'}],
  },
  usage: {
    description:
      'Use ChatTokenizedText inside a chat message when stored plain text contains serialized token values that should be projected as inline badges or caller-rendered token content. Unmatched text is preserved exactly and empty token values are ignored so rendering always finishes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reuse the same token definitions for composer insertion and message rendering so serialized values and visible labels stay aligned.',
      },
      {
        guidance: true,
        description:
          'Use non-empty, stable serialized values so every definition identifies real message text.',
      },
      {
        guidance: false,
        description:
          'Use token labels as a substitute for the surrounding message text; the complete message must remain understandable in reading order.',
      },
      {
        guidance: false,
        description:
          'Put component-owned interaction or accessibility behavior inside a custom token renderer; custom token content remains caller owned.',
      },
    ],
    anatomy: [
      {
        name: 'Tokenized text',
        required: true,
        description:
          'The inline root that preserves unmatched text and carries the chat-tokenized-text theme target.',
      },
      {
        name: 'Rendered token',
        required: false,
        description:
          'Inline token content rendered by Badge for structured tokens or by the caller for custom tokens.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ChatTokenizedText",
  "isHiddenFromOverview": true,
  "displayName": "Chat Tokenized Text",
  "description": "渲染文本字符串，并将其中的令牌模式替换为内联令牌内容。包裹 ChatMessageBubble 内的任意消息正文，可把原始 @提及、#标签或 /命令转换为带样式的内容。当没有非空令牌匹配或未提供令牌时，文本按原样渲染，因此可以对每条消息无条件使用 ChatTokenizedText。",
  "propDescriptions": {
    "children": "包含序列化令牌值的纯文本消息。与令牌值匹配的模式会被替换为内联令牌内容。",
    "tokens": "与输入区使用相同类型的令牌定义。每个非空值按字面匹配。空值会被忽略。结构化令牌渲染为 Badge，自定义令牌则渲染调用方内容。",
    "xstyle": "用于根文本包裹层的 StyleX 样式。必须是 `stylex.create()` 的值：不是 `style={{}}` 这样的内联样式对象。"
  },
  "theming": {
    "targets": [
      {
        "className": "astryx-chat-tokenized-text"
      }
    ]
  },
  "usage": {
    "description": "当存储的纯文本包含序列化令牌值、且这些值应投射为内联徽标或调用方渲染的令牌内容时，在聊天消息中使用 ChatTokenizedText。未匹配的文本会原样保留，空令牌值会被忽略，因此渲染总能完成。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在输入区插入和消息渲染中复用相同的令牌定义，使序列化值与可见标签保持一致。"
      },
      {
        "guidance": true,
        "description": "使用非空且稳定的序列化值，让每个定义都能识别真实的消息文本。"
      },
      {
        "guidance": false,
        "description": "不要用令牌标签替代周围的消息文本；完整消息在阅读顺序上必须保持可理解。"
      },
      {
        "guidance": false,
        "description": "不要在自定义令牌渲染器中放入组件自有的交互或无障碍行为；自定义令牌内容仍归调用方所有。"
      }
    ],
    "anatomy": [
      {
        "name": "令牌化文本",
        "required": true,
        "description": "保留未匹配文本并带有 `chat-tokenized-text` 主题目标的内联根元素。"
      },
      {
        "name": "渲染后的令牌",
        "required": false,
        "description": "结构化令牌由 Badge 渲染、自定义令牌由调用方渲染的内联令牌内容。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatTokenizedText',
  isHiddenFromOverview: true,
  displayName: 'Chat Tokenized Text',
  description:
    'renders text w/ literal token values replaced by inline content; empty values ignored',
  usage: {
    description:
      'Use for stored chat text containing serialized token values; unmatched text is preserved.',
    bestPractices: [
      {
        guidance: true,
        description: 'Reuse composer token definitions for display.',
      },
      {
        guidance: true,
        description: 'Use stable non-empty serialized values.',
      },
      {
        guidance: false,
        description:
          'Replace the surrounding message meaning with token labels.',
      },
      {
        guidance: false,
        description:
          'Move component-owned behavior into custom token renderers.',
      },
    ],
  },
  propDescriptions: {
    children:
      'plain text msg w/ serialized token values; matching patterns become inline content',
    tokens:
      'token defs; literal values matched in caller order; empty values ignored',
    xstyle: 'additional StyleX styles for root wrapper',
  },
};
