// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatMessage',
  subComponentOf: 'Chat',
  displayName: 'Chat Message',
  description:
    'Sender context wrapper: handles avatar, name, metadata, and alignment based on sender role.',
  playground: {
    defaults: {
      sender: 'assistant',
      children: {
        __element: 'ChatMessageBubble',
        children: 'Here is the summary you asked for.',
      },
      avatar: {__element: 'Avatar', props: {name: 'Astra', size: 'sm'}},
    },
    wrapper: {component: 'Stack', props: {width: 480}},
  },
  props: [
    {
      name: 'sender',
      type: "'user' | 'assistant' | 'system'",
      description: 'Who sent this message: controls alignment and layout.',
      required: true,
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Free-form content: bubbles, asset lists, tool calls, images. Custom (non-bubble) children render flush with the message edge; wrap them in a ghost ChatMessageBubble to align them with the bubble text column.',
      required: true,
      slotElements: [
        {
          __element: 'ChatMessageBubble',
          children: 'Message text',
        },
      ],
    },
    {
      name: 'avatar',
      type: 'ReactNode',
      description:
        'Avatar element rendered beside the message. Typically Avatar. `null`, booleans, and empty strings create no slot; any other content that renders nothing collapses its slot.',
      slotElements: [
        {
          __element: 'Avatar',
          props: {
            name: 'User',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'name',
      type: 'ReactNode',
      description:
        "Sender name rendered above the message body; it labels the message. `null`, booleans, and empty strings create no slot, and any other content that renders nothing collapses its slot; either way the message is labelled by the translated sender fallback. Use when the first child is raw content (not a bubble). If the first child is a bubble, put the name on the bubble's `name` prop instead.",
    },
    {
      name: 'metadata',
      type: 'ReactNode',
      description:
        "Metadata rendered below the message body. `null`, booleans, and empty strings create no slot; any other content that renders nothing collapses its slot. Use when the last child is raw content (not a bubble). If the last child is a bubble, put metadata on the bubble's `metadata` prop instead.",
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
          },
          children: 'Metadata',
        },
      ],
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Visual density. Inherited from list context if not set.',
      default: "'balanced'",
    },
  ],
};

export const docsZh = {
  "name": "ChatMessage",
  "displayName": "Chat Message",
  "description": "发送者上下文包装组件：根据发送者角色处理头像、名称、元数据和对齐。",
  "propDescriptions": {
    "sender": "消息的发送者：控制对齐方式和布局。",
    "children": "自由格式内容：气泡、资产列表、工具调用、图片。自定义（非气泡）子元素与消息边缘齐平渲染；将它们包裹在 ghost ChatMessageBubble 中，即可与气泡文本列对齐。",
    "avatar": "在消息旁渲染的头像元素。通常为 Avatar。`null`、布尔值和空字符串不创建槽位；其他渲染不出任何内容的元素会收拢其槽位。",
    "name": "在消息正文上方渲染的发送者名称；它为消息提供标签。`null`、布尔值和空字符串不创建槽位；其他渲染不出任何内容的元素会收拢其槽位；无论哪种情况，消息都会使用翻译后的发送者回退名称进行标注。当第一个子元素是原始内容（非气泡）时使用。如果第一个子元素是气泡，请改为在气泡的 `name` 属性上设置名称。",
    "metadata": "在消息正文下方渲染的元数据。`null`、布尔值和空字符串不创建槽位；其他渲染不出任何内容的元素会收拢其槽位。当最后一个子元素是原始内容（非气泡）时使用。如果最后一个子元素是气泡，请改为在气泡的 `metadata` 属性上设置元数据。",
    "density": "视觉密度。未设置时从列表上下文继承。"
  }
};

export const docsDense = {
  name: 'ChatMessage',
  displayName: 'Chat Message',
  description:
    'sender context wrapper; handles avatar+name+metadata+alignment by sender role',
  propDescriptions: {
    sender: 'who sent; controls alignment+layout',
    children:
      'free-form: bubbles, assets, tool calls, images; wrap non-bubble content in a ghost bubble to align with bubble text column',
    avatar:
      'avatar beside msg; null/boolean/"" omit slot; content rendering nothing collapses slot',
    name: 'sender name above body; labels msg; null/boolean/"" omit slot, content rendering nothing collapses it; both fall back to translated sender label; use when first child is raw',
    displayName:
      'sender name above body; use when first child is raw (not bubble)',
    metadata:
      'metadata below body; null/boolean/"" omit slot; content rendering nothing collapses slot; use when last child is raw',
    density: 'visual density; inherited from list context if unset',
  },
};
