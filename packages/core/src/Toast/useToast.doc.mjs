// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useToast',
  displayName: 'useToast',
  group: 'Toast',
  keywords: ['toast', 'notification', 'snackbar', 'alert', 'message', 'feedback', 'flash'],
  params: [
    // useToast takes no arguments; returns a show function
  ],
  returns: [
    {
      name: 'showToast',
      type: '(options: ToastOptions) => () => void',
      description: 'Show a toast notification. Returns a dismiss function. Options include body (ReactNode), type ("info" | "error"), isAutoHide, autoHideDuration, endContent, uniqueID, and collisionBehavior.',
    },
  ],
  usage: {
    description: 'Hook for showing toast notifications from anywhere in your component tree. Returns a function that accepts toast options and shows the notification. Works automatically with LayerProvider or self-mounts a fallback viewport.',
    bestPractices: [
      {guidance: true, description: 'Use for transient success/error feedback that does not require user action.'},
      {guidance: true, description: 'Set uniqueID to deduplicate toasts from rapid user actions.'},
      {guidance: false, description: 'Use for critical errors that require acknowledgment; use AlertDialog instead.'},
      {guidance: false, description: 'Call useToast in the same component that renders LayerProvider; it must be called from a child component inside the provider.'},
    ],
  },
  relatedComponents: ['Toast', 'Banner', 'AlertDialog'],
  relatedHooks: [],
  importPath: '@astryxdesign/core/Toast',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description: 'Show toast notifications from anywhere in component tree. Returns function accepting toast options + showing notification. Works automatically w/ LayerProvider / self-mounts fallback viewport.',
  returnDescriptions: {
    showToast: 'show toast notification. Returns dismiss function. Options: body (ReactNode), type ("info" | "error"), isAutoHide, autoHideDuration, endContent, uniqueID, collisionBehavior.',
  },
  usage: {
    description: 'Show toast notifications from anywhere in component tree. Returns function accepting toast options + showing notification. Works automatically w/ LayerProvider / self-mounts fallback viewport.',
    bestPractices: [
      {guidance: true, description: 'Use for transient success/error feedback not requiring user action.'},
      {guidance: true, description: 'Set uniqueID to deduplicate toasts from rapid user actions.'},
      {guidance: false, description: 'Use for critical errors requiring acknowledgment; use AlertDialog instead.'},
      {guidance: false, description: 'Call useToast in same component that renders LayerProvider; must be called from child component inside provider.'},
    ],
  },
};

export const docsZh = {
  "name": "useToast",
  "usage": {
    "description": "用于从组件树中的任何位置显示 Toast 通知的 Hook。返回一个接受 Toast 选项并显示通知的函数。与 LayerProvider 配合可自动工作，或自行挂载回退视口。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于不需要用户操作的短暂成功/错误反馈。"
      },
      {
        "guidance": true,
        "description": "设置 uniqueID 以对快速用户操作产生的 Toast 去重。"
      },
      {
        "guidance": false,
        "description": "将其用于需要确认的严重错误；请改用 AlertDialog。"
      },
      {
        "guidance": false,
        "description": "在渲染 LayerProvider 的同一组件中调用 useToast；必须从 provider 内部的子组件调用。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "showToast": "显示 Toast 通知。返回一个关闭函数。选项包括 body（ReactNode）、type（\"info\" | \"error\"）、isAutoHide、autoHideDuration、endContent、uniqueID 和 collisionBehavior。"
  }
};
