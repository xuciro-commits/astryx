// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatLayoutScrollButton',
  subComponentOf: 'Chat',
  displayName: 'Chat Layout Scroll Button',
  isHiddenFromOverview: true,
  description: 'Floating scroll-to-bottom button that appears when the user scrolls away from the latest messages. It fades in as a compact icon button and expands to show a label when new messages arrive. ChatLayout renders this by default: pass a custom element to the scrollButton prop to override, or null to hide it entirely.',
  props: [
    {
      name: 'isVisible',
      type: 'boolean',
      description: 'Whether the button is visible. Bind to a scroll-position check so the button only appears when the user has scrolled up.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Optional label that expands the button (e.g. "New messages"). Use to signal unread content below the fold.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Click handler: typically scrolls to bottom and dismisses the new message indicator.',
      required: true,
    },
  ],
};

export const docsZh = {
  "name": "ChatLayoutScrollButton",
  "isHiddenFromOverview": true,
  "displayName": "Chat Layout Scroll Button",
  "description": "浮动“滚动到底部”按钮，当用户滚动离开最新消息时出现。它以紧凑图标按钮的形式淡入，并在有新消息到达时展开显示标签。ChatLayout 默认渲染此组件：向 scrollButton 属性传入自定义元素可覆盖，传入 null 则完全隐藏。",
  "propDescriptions": {
    "isVisible": "按钮是否可见。绑定到滚动位置检查，使按钮仅在用户向上滚动时出现。",
    "label": "用于展开按钮的可选标签（例如 \"New messages\"）。用于提示折叠区域下方有未读内容。",
    "onClick": "点击处理函数：通常滚动到底部并关闭新消息指示器。"
  }
};

export const docsDense = {
  name: 'ChatLayoutScrollButton',
  isHiddenFromOverview: true,
  displayName: 'Chat Layout Scroll Button',
  description: 'floating scroll-to-bottom btn; fades in when scrolled up, expands w/ label for new msgs. Default in ChatLayout; override via scrollButton prop.',
  propDescriptions: {
    isVisible: 'btn visibility: bind to scroll-position check',
    label: 'optional label; expands btn (e.g. "New messages")',
    onClick: 'click handler',
  },
};
