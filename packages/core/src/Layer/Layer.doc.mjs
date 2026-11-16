// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'Layer',
  displayName: 'Layer',
  group: 'Utilities',
  category: 'Utility',
  keywords: [
    'layer',
    'overlay',
    'popover',
    'positioning',
    'anchor',
    'floating',
    'dropdown',
    'popper',
    'popup',
    'portal',
  ],
  usage: {
    description:
      'Layer utilities provide the app-level provider used by overlay systems. Use LayerProvider at the app root for toast/layer configuration; use higher-level Popover, HoverCard, or Tooltip APIs for most overlay UI. Rendered layer content, not the provider’s application subtree, uses theme body text defaults and exits ancestor surface/group membership. Establish intentional groups and complete required providers inside each layer. Every anchored layer keeps a gutter from each viewport edge — the spacing-4 step or the device safe-area inset, whichever is larger — and is capped to the viewport, never to the room beside its trigger: an explicit width renders at its size, flips when it does not fit beside the trigger, and slides into view when it fits on neither side. An app that floats a persistent bar over a viewport edge declares it once as inset on LayerProvider (blockStart, blockEnd, inlineStart, inlineEnd); each edge adds to that edge\u2019s gutter for every anchored layer and moves the toast viewport by the same amount, and defaults to zero. The inset is app configuration, not a theme value.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Declare a persistent bar floating over the viewport once, as inset on LayerProvider; every anchored layer and toast then stays clear of it.',
      },
      {
        guidance: true,
        description:
          'Use LayerProvider once near the app root when you need shared toast/layer configuration.',
      },
      {
        guidance: true,
        description:
          'Build on higher-level components like Popover, HoverCard, and Tooltip for common overlay patterns.',
      },
      {
        guidance: false,
        description:
          'Nest a LayerProvider to change toast settings: a nested provider keeps the outer toast configuration and mounts no second toast viewport.',
      },
    ],
  },
  components: [
    {
      name: 'LayerProvider',
      displayName: 'Layer Provider',
      description:
        'App-level configuration for toasts and the viewport inset. A nested provider mounts no second toast viewport and keeps the outer toast configuration; one that declares an inset applies its declared edges to the anchored layers in its subtree.',
      props: [
        {
          name: 'children',
          type: 'ReactNode',
          description:
            'Application subtree that can use the shared layer context.',
          required: true,
        },
        {
          name: 'toast',
          type: 'LayerToastConfig',
          description:
            'Toast viewport configuration. Controls position, maxVisible, and a toast-only inset that overrides the provider inset per edge for toasts shown through useToast.',
        },
        {
          name: 'inset',
          type: 'LayerInset',
          description:
            'A persistent bar floating over a viewport edge, declared once: blockStart, blockEnd, inlineStart, inlineEnd as pixel numbers or CSS lengths. Each edge adds to the gutter every anchored layer keeps from that edge and moves the toast viewport by the same amount. Defaults to zero on every edge.',
        },
      ],
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  usage: {
    description:
      'App-level provider for overlay systems. Use LayerProvider at app root for toast/layer config; use Popover/HoverCard/Tooltip for most overlay UI. Layer content uses theme body defaults and exits ancestor surface/group membership; establish intentional groups and complete required providers inside it. The application subtree is unchanged.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use LayerProvider once near app root for shared toast/layer config.',
      },
      {
        guidance: true,
        description:
          'Use Popover/HoverCard/Tooltip for common overlay patterns.',
      },
      {
        guidance: false,
        description:
          'Nest LayerProvider for toast config: a nested provider keeps the outer toast config.',
      },
    ],
  },
  components: [
    {
      name: 'LayerProvider',
      description: 'App-level provider for toast/layer systems.',
      propDescriptions: {
        children: 'application subtree using shared layer context',
        toast: 'toast viewport config: position, maxVisible, inset',
        inset:
          'persistent bar over a viewport edge, declared once for layers and toasts',
      },
    },
  ],
};

export const docsZh = {
  "name": "Layer",
  "usage": {
    "description": "Layer 工具包提供浮层系统使用的应用级 Provider。在应用根节点使用 LayerProvider 进行 toast/layer 配置；大多数浮层 UI 请使用更高层的 Popover、HoverCard 或 Tooltip API。渲染的 layer 内容（而非 Provider 的应用子树）使用主题正文文本默认值，并退出祖先 surface/group 成员关系。在每个 layer 内建立有意的分组，并补全所需的 Provider。每个锚定 layer 都与每条视口边缘保持间距——取 spacing-4 步进或设备安全区域内缩中较大者——并受视口限制，绝不局限于触发器旁边的空间：显式宽度会按其尺寸渲染，在触发器旁放不下时翻转，两侧都放不下时滑入视野。若应用在视口边缘上浮动持久条，请在 LayerProvider 上以 inset 声明一次（blockStart、blockEnd、inlineStart、inlineEnd）；每条边都会为其上的每个锚定 layer 增加该边的间距，并将 toast 视口按相同量移动，默认值为零。inset 是应用配置，不是主题值。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将视口上浮动的持久条在 LayerProvider 上以 inset 声明一次；之后每个锚定 layer 和 toast 都会避开它。"
      },
      {
        "guidance": true,
        "description": "需要共享 toast/layer 配置时，在应用根节点附近使用一次 LayerProvider。"
      },
      {
        "guidance": true,
        "description": "常见浮层模式请基于 Popover、HoverCard 和 Tooltip 等更高层组件构建。"
      },
      {
        "guidance": false,
        "description": "不要嵌套 LayerProvider 来更改 toast 设置：嵌套 Provider 会保留外层 toast 配置，且不会挂载第二个 toast 视口。"
      }
    ]
  },
  "components": [
    {
      "name": "LayerProvider",
      "description": "toast 和视口 inset 的应用级配置。嵌套 Provider 不会挂载第二个 toast 视口，并会保留外层 toast 配置；声明了 inset 的 Provider 会将其声明的边缘应用到其子树中的锚定 layer。",
      "propDescriptions": {
        "children": "可使用共享 layer 上下文的应用子树。",
        "toast": "Toast 视口配置。控制 position、maxVisible，以及仅用于 toast 的 inset——它会针对通过 useToast 显示的 toast，按边缘覆盖 Provider 的 inset。",
        "inset": "在视口边缘上浮动的持久条，声明一次：blockStart、blockEnd、inlineStart、inlineEnd 为像素数字或 CSS 长度。每条边都会增加每个锚定 layer 与该边保持的间距，并将 toast 视口按相同量移动。每条边默认值为零。"
      }
    }
  ]
};
