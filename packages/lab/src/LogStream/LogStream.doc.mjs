// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'LogStream',
  displayName: 'Log Stream',
  group: 'LogStream',
  category: 'Content',
  keywords: ['log', 'stream', 'terminal', 'console', 'output', 'logs', 'tail'],

  usage: {
    description:
      'Experimental streaming log viewer: mono grid rows (timestamp | level | source | message) with token-derived level accents, expandable per-row detail panels, follow-scroll live tailing with a "Jump to latest" affordance, and an always-dark terminal variant. In the default variant, warning and error labels use their plain-surface status foreground roles. Appended rows fade in via @starting-style. Live announcements follow the pinning state: the role="log" region is aria-live="polite" only while following the tail, and aria-live="off" while unfollowed, so a busy stream never floods assistive tech.',
  },

  props: [
    {
      name: 'entries',
      type: 'LogEntry[]',
      description: 'Array of log entry objects to render.',
      required: true,
    },
    {
      name: 'variant',
      type: "'default' | 'terminal'",
      description: "Visual variant style: 'default' uses theme surface background, 'terminal' uses fixed dark background.",
      default: "'default'",
    },
    {
      name: 'isFollowing',
      type: 'boolean',
      description: 'Controlled follow-pinning state to auto-scroll to the newest entry.',
    },
    {
      name: 'onFollowChange',
      type: '(following: boolean) => void',
      description: 'Callback fired when follow-pinning state changes.',
    },
    {
      name: 'maxHeight',
      type: 'number | string',
      description: 'Maximum container height before vertical scrolling.',
    },
    {
      name: 'hasTimestamps',
      type: 'boolean',
      description: 'Show or hide the timestamp column.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the log region.',
      default: "'Log stream'",
    },
    {
      name: 'renderEntry',
      type: '(entry: LogEntry) => ReactNode',
      description: 'Custom render function for replacing individual row layout.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
  ],
};

export const docsZh = {
  "name": "LogStream",
  "displayName": "Log Stream",
  "usage": {
    "description": "实验性流式日志查看器：等宽网格行（timestamp | level | source | message），带令牌派生的级别强调色、可展开的每行详情面板、带 \"Jump to latest\" 提示的跟随滚动实时尾随，以及始终为深色的终端变体。在默认变体中，警告和错误标签使用其普通表面状态前景角色。追加的行通过 @starting-style 淡入。实时播报遵循固定状态：role=\"log\" 区域仅在跟随尾部时为 aria-live=\"polite\"，未跟随时为 aria-live=\"off\"，因此繁忙的流永远不会淹没辅助技术。"
  },
  "propDescriptions": {
    "entries": "要渲染的日志条目对象数组。",
    "variant": "视觉变体样式：'default' 使用主题表面背景，'terminal' 使用固定的深色背景。",
    "isFollowing": "受控的跟随固定状态，用于自动滚动到最新条目。",
    "onFollowChange": "跟随固定状态变化时触发的回调。",
    "maxHeight": "垂直滚动前的最大容器高度。",
    "hasTimestamps": "显示或隐藏时间戳列。",
    "label": "日志区域的无障碍标签。",
    "renderEntry": "用于替换单行布局的自定义渲染函数。",
    "xstyle": "用于布局自定义的 StyleX 样式。"
  }
};
