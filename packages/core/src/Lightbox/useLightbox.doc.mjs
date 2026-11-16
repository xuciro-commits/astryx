// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useLightbox',
  displayName: 'useLightbox',
  group: 'Lightbox',
  keywords: [
    'lightbox',
    'gallery',
    'viewer',
    'image',
    'video',
    'media',
    'modal',
    'overlay',
    'trigger',
  ],
  params: [
    {
      name: 'options',
      type: 'UseLightboxOptions',
      description: 'Configuration options for the lightbox.',
      required: true,
    },
    {
      name: 'options.media',
      type: 'LightboxMedia | LightboxMedia[]',
      description:
        'Media to display in the lightbox. Pass a single object for one item, or an array for gallery mode.',
      required: true,
    },
    {
      name: 'options.hasZoom',
      type: 'boolean',
      description:
        'Enable zoom on double-click, or Enter/Space/+/- via keyboard (images only). When zoomed, drag or use arrow keys to pan.',
      default: 'false',
      required: false,
    },
    {
      name: 'options.hasAutoPlay',
      type: 'boolean',
      description: 'Whether video should autoplay when the lightbox opens.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'open',
      type: '(index?: number) => void',
      description:
        'Open the lightbox, optionally at a specific gallery index (defaults to 0).',
    },
    {
      name: 'close',
      type: '() => void',
      description: 'Close the lightbox.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the lightbox is currently open.',
    },
    {
      name: 'index',
      type: 'number',
      description: 'Current gallery index.',
    },
    {
      name: 'element',
      type: 'ReactNode',
      description:
        'Pre-wired Lightbox component element to render in your JSX tree.',
    },
    {
      name: 'triggerProps',
      type: "{role: 'button', tabIndex: 0, 'aria-haspopup': 'dialog', onClick: () => void, onKeyDown: (e: React.KeyboardEvent) => void}",
      description:
        'Props to spread onto a single trigger element to open the lightbox at index 0 on click, Enter, or Space.',
    },
    {
      name: 'getTriggerProps',
      type: "(index: number) => {role: 'button', tabIndex: 0, 'aria-haspopup': 'dialog', onClick: () => void, onKeyDown: (e: React.KeyboardEvent) => void}",
      description:
        'Returns trigger props to spread onto an element to open the lightbox at a specific gallery index on click, Enter, or Space.',
    },
  ],
  usage: {
    description:
      'State management and accessible trigger wiring for Lightbox. Eliminates boilerplate for managing open state and current index. Returns trigger props with button role, tabIndex={0}, aria-haspopup="dialog", and keyboard activation handlers, along with a pre-wired Lightbox element that handles dismissal, next/previous navigation, and focus restoration.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Spread getTriggerProps(index) onto image or thumbnail elements to give them accessible button semantics and keyboard activation.',
      },
      {
        guidance: true,
        description:
          'Render lightbox.element once in your component JSX tree alongside the triggers.',
      },
      {
        guidance: false,
        description:
          'Manage separate isOpen or index state alongside useLightbox; the hook already tracks both.',
      },
      {
        guidance: false,
        description:
          'Add custom click or keydown handlers to open the lightbox when using triggerProps or getTriggerProps.',
      },
    ],
  },
  relatedComponents: ['Lightbox', 'Grid', 'Thumbnail'],
  relatedHooks: [],
  importPath: '@astryxdesign/core/Lightbox',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'State management and accessible trigger wiring for Lightbox. Eliminates boilerplate for open state and index. Returns trigger props and pre-wired Lightbox element.',
  paramDescriptions: {
    options: 'configuration options for the lightbox.',
    'options.media':
      'media to display (single item or array for gallery mode).',
    'options.hasZoom':
      'enable zoom on double-click or Enter/Space/+/- (images only).',
    'options.hasAutoPlay': 'whether video should autoplay when opened.',
  },
  returnDescriptions: {
    open: 'open the lightbox, optionally at a specific gallery index.',
    close: 'close the lightbox.',
    isOpen: 'whether the lightbox is currently open.',
    index: 'current gallery index.',
    element: 'pre-wired Lightbox element to render in JSX tree.',
    triggerProps:
      'trigger attributes to spread onto a single trigger element.',
    getTriggerProps:
      '(index) => props: returns trigger attributes for opening at index on click, Enter, or Space.',
  },
  usage: {
    description:
      'State management and trigger wiring for Lightbox. Returns trigger props and pre-wired element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Spread getTriggerProps(index) onto image elements for accessible button semantics.',
      },
      {
        guidance: true,
        description:
          'Render lightbox.element once in JSX alongside the triggers.',
      },
      {
        guidance: false,
        description:
          'Manage separate isOpen or index state alongside useLightbox.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useLightbox",
  "usage": {
    "description": "用于 Lightbox 的状态管理和无障碍触发器接线。消除管理打开状态和当前索引的样板代码。返回带 button 角色、`tabIndex={0}`、`aria-haspopup=\"dialog\"` 和键盘激活处理器的触发器属性，以及一个预先接好线的 Lightbox 元素，处理关闭、上一项/下一项导航和焦点恢复。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 `getTriggerProps(index)` 展开到图片或缩略图元素上，使其具备无障碍的按钮语义和键盘激活能力。"
      },
      {
        "guidance": true,
        "description": "在组件的 JSX 树中，与触发器一起渲染一次 `lightbox.element`。"
      },
      {
        "guidance": false,
        "description": "在 useLightbox 之外另行管理 `isOpen` 或 `index` 状态；该 Hook 已经同时跟踪这两者。"
      },
      {
        "guidance": false,
        "description": "使用 `triggerProps` 或 `getTriggerProps` 时添加自定义 click 或 keydown 处理器来打开 Lightbox。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "Lightbox 的配置选项。",
    "options.media": "要在 Lightbox 中显示的媒体。单个项目传入单个对象，图库模式传入数组。",
    "options.hasZoom": "启用双击缩放，或通过键盘使用 Enter/Space/+/- 缩放（仅限图片）。缩放后，可拖动或使用方向键平移。",
    "options.hasAutoPlay": "Lightbox 打开时视频是否应自动播放。"
  },
  "returnDescriptions": {
    "open": "打开 Lightbox，可选指定图库索引（默认为 0）。",
    "close": "关闭 Lightbox。",
    "isOpen": "Lightbox 当前是否打开。",
    "index": "当前图库索引。",
    "element": "可在 JSX 树中渲染的、预先接好线的 Lightbox 组件元素。",
    "triggerProps": "展开到单个触发器元素上的属性，用于在点击、Enter 或 Space 时以索引 0 打开 Lightbox。",
    "getTriggerProps": "返回可展开到元素上的触发器属性，用于在点击、Enter 或 Space 时以指定图库索引打开 Lightbox。"
  }
};
