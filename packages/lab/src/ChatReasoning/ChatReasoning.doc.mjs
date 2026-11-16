// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatReasoning',
  displayName: 'Chat Reasoning',
  group: 'Chat',
  category: 'Chat',
  keywords: ['reasoning', 'thinking', 'thought', 'chain-of-thought', 'chat', 'llm', 'ai'],

  usage: {
    description:
      'Compact collapsible container for displaying model reasoning or chain-of-thought details. Shows a single-line summary when collapsed and expands to reveal full reasoning text.',
  },

  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Reasoning content string or custom ReactNode.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Header label displayed in the trigger line.',
      default: "'Thinking'",
    },
    {
      name: 'duration',
      type: 'string',
      description: 'Duration string shown next to the label (e.g. "12s").',
    },
    {
      name: 'isStreaming',
      type: 'boolean',
      description: 'Whether reasoning content is actively streaming. Displays animated shimmer effect.',
      default: 'false',
    },
    {
      name: 'isExpanded',
      type: 'boolean',
      description: 'Controlled expanded state.',
    },
    {
      name: 'defaultIsExpanded',
      type: 'boolean',
      description: 'Default expanded state for uncontrolled usage.',
      default: 'false',
    },
    {
      name: 'onExpandedChange',
      type: '(isExpanded: boolean) => void',
      description: 'Callback fired when the expanded state changes.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
  ],
};

export const docsZh = {
  "name": "ChatReasoning",
  "displayName": "Chat Reasoning",
  "usage": {
    "description": "紧凑的可折叠容器，用于显示模型推理或思维链细节。收起时显示单行摘要，展开后显示完整的推理文本。"
  },
  "propDescriptions": {
    "children": "推理内容字符串或自定义 ReactNode。",
    "label": "显示在触发行中的标题标签。",
    "duration": "显示在标签旁的时长字符串（例如 \"12s\"）。",
    "isStreaming": "推理内容是否正在流式传输。显示动画微光效果。",
    "isExpanded": "受控的展开状态。",
    "defaultIsExpanded": "非受控用法下的默认展开状态。",
    "onExpandedChange": "展开状态变化时触发的回调。",
    "xstyle": "用于布局自定义的 StyleX 样式。"
  }
};
