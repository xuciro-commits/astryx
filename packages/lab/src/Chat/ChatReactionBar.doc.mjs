// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatReactionBar',
  subComponentOf: 'Chat',
  group: 'Chat',
  category: 'Chat',
  displayName: 'Chat Reaction Bar',
  description: 'Row of emoji reaction pills under a chat message. Each pill shows an emoji and count; the current user\'s own reactions get an accent tint and aria-pressed. Provide onAdd to render a trailing add-reaction button that opens a ChatEmojiPicker popover.',
  props: [
    {
      name: 'reactions',
      type: '{emoji: string; count: number; isSelected?: boolean; label?: string}[]',
      description: 'Reactions to render, in display order. isSelected marks the current user\'s own reactions (accent tint + aria-pressed). label is a human-readable description like "Ana and Dana reacted with 🎉", used as the pill tooltip and accessible label.',
      required: true,
    },
    {
      name: 'onToggle',
      type: '(emoji: string) => void',
      description: 'Called with the pill\'s emoji when the user toggles a reaction on or off.',
    },
    {
      name: 'onAdd',
      type: '(emoji: string) => void',
      description: 'Called with the picked emoji when the user adds a reaction from the emoji picker. The trailing add-reaction button renders only when provided.',
    },
    {
      name: 'emojis',
      type: 'readonly ChatEmojiOption[]',
      description: 'Emoji options for the add-reaction picker. Defaults to DEFAULT_CHAT_EMOJIS.',
    },
    {
      name: 'addLabel',
      type: 'string',
      description: 'Accessible label for the add-reaction button and picker dialog.',
      default: "'Add reaction'",
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the reaction group.',
      default: "'Reactions'",
    },
  ],
};

export const docsZh = {
  "name": "ChatReactionBar",
  "displayName": "Chat Reaction Bar",
  "description": "聊天消息下方的一行 emoji 反应胶囊。每个胶囊显示一个 emoji 和计数；当前用户自己的反应会获得强调色调和 aria-pressed。提供 onAdd 以渲染一个尾随的添加反应按钮，打开 ChatEmojiPicker 浮层。",
  "propDescriptions": {
    "reactions": "要渲染的反应，按显示顺序排列。isSelected 标记当前用户自己的反应（强调色调 + aria-pressed）。label 是人类可读的描述，如 \"Ana and Dana reacted with 🎉\"，用作胶囊工具提示和可访问标签。",
    "onToggle": "当用户切换反应开/关时，以胶囊的 emoji 调用。",
    "onAdd": "当用户从 emoji 选择器添加反应时，以所选 emoji 调用。仅当提供时才会渲染尾随的添加反应按钮。",
    "emojis": "添加反应选择器的 emoji 选项。默认为 DEFAULT_CHAT_EMOJIS。",
    "addLabel": "添加反应按钮和选择器对话框的可访问标签。",
    "label": "反应组的可访问标签。"
  }
};

export const docsDense = {
  name: 'ChatReactionBar',
  displayName: 'Chat Reaction Bar',
  description: 'emoji reaction pills under a message; own reactions accent-tinted w/ aria-pressed; onAdd renders trailing add button opening ChatEmojiPicker popover',
  propDescriptions: {
    reactions: '{emoji,count,isSelected?,label?}[]; label doubles as tooltip + aria label',
    onToggle: '(emoji)=>void on pill click',
    onAdd: '(emoji)=>void from picker; enables add button',
    emojis: 'picker option override; default DEFAULT_CHAT_EMOJIS',
    addLabel: 'add button + picker dialog label',
    label: 'group aria label',
  },
};
