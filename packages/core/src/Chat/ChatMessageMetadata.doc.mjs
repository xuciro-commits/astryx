// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatMessageMetadata',
  subComponentOf: 'Chat',
  displayName: 'Chat Message Metadata',
  description:
    'Composable metadata row for chat messages. Renders timestamp, footer content, and delivery status in a single row. Direction reverses for user sender. Omits the row when both slots are omitted or non-rendering scalars and status is omitted.',
  props: [
    {
      name: 'timestamp',
      type: 'ReactNode',
      description: 'Timestamp content: a string or Timestamp component.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Just now',
        },
      ],
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description: 'Footer content: model info, reaction buttons, copy button.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Footer content',
        },
      ],
    },
    {
      name: 'status',
      type: "'sending' | 'sent' | 'delivered' | 'read' | 'error'",
      description: 'Message delivery status. Shows icon + label.',
    },
  ],
  usage: {
    description:
      'Place ChatMessageMetadata below a message or in the last ChatMessageBubble metadata slot to show a timestamp, footer content, and optional delivery status. Non-rendering scalar slots (booleans and empty strings) create no separator; numeric zero remains visible. Composite React content remains caller-owned.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Put metadata in the last bubble metadata slot when the message uses bubbles, so it follows the bubble content.',
      },
      {
        guidance: true,
        description:
          'Pass timestamp and footer content independently; separators are omitted for non-rendering scalar slots. Composite React nodes are used as supplied.',
      },
      {
        guidance: false,
        description:
          'Do not supply footer actions without their own accessible names and interaction behavior; the metadata row does not own those controls.',
      },
      {
        guidance: false,
        description:
          'Do not put the same metadata on both a bubble and its enclosing message.',
      },
    ],
    anatomy: [
      {
        name: 'Metadata row',
        required: true,
        description: 'Sender-aware line containing the visible metadata items.',
      },
      {
        name: 'Timestamp',
        required: false,
        description:
          'Caller-supplied time content at the start of the logical sequence.',
      },
      {
        name: 'Footer',
        required: false,
        description:
          'Caller-supplied information or actions between time and status.',
      },
      {
        name: 'Status',
        required: false,
        description:
          'Localized delivery icon and text when a status is supplied.',
      },
    ],
  },
};

export const docsZh = {
  "name": "ChatMessageMetadata",
  "displayName": "Chat Message Metadata",
  "description": "聊天消息的可组合元数据行。在单行中渲染时间戳、页脚内容和送达状态。发送者为用户时方向反转。当两个插槽都省略或为非渲染标量且省略了状态时，不渲染该行。",
  "propDescriptions": {
    "timestamp": "时间戳内容：字符串或 Timestamp 组件。",
    "footer": "页脚内容：模型信息、回应按钮、复制按钮。",
    "status": "消息送达状态。显示图标 + 标签。"
  },
  "usage": {
    "description": "将 ChatMessageMetadata 放在消息下方或最后一个 ChatMessageBubble 的 metadata 插槽中，以显示时间戳、页脚内容和可选的送达状态。非渲染标量插槽（布尔值和空字符串）不会创建分隔符；数字零仍然可见。组合 React 内容仍由调用方负责。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当消息使用气泡时，将元数据放在最后一个气泡的 metadata 插槽中，使其跟随气泡内容。"
      },
      {
        "guidance": true,
        "description": "独立传入时间戳和页脚内容；非渲染标量插槽会省略分隔符。组合 React 节点按原样使用。"
      },
      {
        "guidance": false,
        "description": "不要提供没有自身可访问名称和交互行为的页脚操作；元数据行不拥有这些控件。"
      },
      {
        "guidance": false,
        "description": "不要同时在气泡和包裹它的消息上放置相同的元数据。"
      }
    ],
    "anatomy": [
      {
        "name": "元数据行",
        "required": true,
        "description": "包含可见元数据项、感知发送者的一行。"
      },
      {
        "name": "时间戳",
        "required": false,
        "description": "位于逻辑序列起始处、由调用方提供的时间内容。"
      },
      {
        "name": "页脚",
        "required": false,
        "description": "位于时间和状态之间、由调用方提供的信息或操作。"
      },
      {
        "name": "状态",
        "required": false,
        "description": "提供状态时本地化的送达图标和文本。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatMessageMetadata',
  displayName: 'Chat Message Metadata',
  description:
    'composable metadata row; renders timestamp · footer · status; reverses for user sender',
  propDescriptions: {
    timestamp: 'timestamp content; string or Timestamp',
    footer: 'footer content; model info, reaction btns, copy btn',
    status: 'delivery status; shows icon+label',
  },
};
