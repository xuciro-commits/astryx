// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatUnreadDivider',
  subComponentOf: 'Chat',
  group: 'Chat',
  category: 'Chat',
  displayName: 'Chat Unread Divider',
  description: 'Error-colored rule with a trailing label marking where unread messages begin in a chat thread. Rendered as an aria separator with an accessible label. Distinct from ChatSystemMessage\'s divider variant, which is for neutral date breaks.',
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Divider label shown at the end of the rule and used in the accessible name ("New messages below").',
      default: "'New'",
    },
  ],
};

export const docsZh = {
  "name": "ChatUnreadDivider",
  "displayName": "Chat Unread Divider",
  "description": "使用错误色的分隔线，带有尾随标签，标记聊天线程中未读消息开始的位置。渲染为带有可访问标签的 aria 分隔符。与 ChatSystemMessage 的分隔线变体不同，后者用于中性日期分隔。",
  "propDescriptions": {
    "label": "显示在分隔线末尾的分隔线标签，也用于可访问名称（\"New messages below\"）。"
  }
};

export const docsDense = {
  name: 'ChatUnreadDivider',
  displayName: 'Chat Unread Divider',
  description: 'error-colored rule + trailing label marking first unread msg; aria separator; use ChatSystemMessage divider for neutral date breaks',
  propDescriptions: {
    label: "trailing label + aria name; default 'New'",
  },
};
