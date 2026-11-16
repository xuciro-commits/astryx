// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Dot',
    required: true,
    description:
      'Painted status dot that carries the selected semantic variant.',
  },
  {
    name: 'Status icon',
    required: false,
    description: 'Optional caller-supplied icon rendered inside the dot.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'StatusDot',
  playground: {
    defaults: {label: 'Online'},
  },
  displayName: 'Status Dot',
  category: 'Feedback & Status',
  keywords: [
    'statusdot',
    'dot',
    'indicator',
    'status',
    'signal',
    'presence',
    'availability',
    'online',
    'pip',
  ],
  props: [
    {
      name: 'variant',
      type: "'success' | 'warning' | 'error' | 'accent' | 'neutral'",
      description: 'Semantic color variant.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label surfaced via aria-label.',
      required: true,
    },
    {
      name: 'isPulsing',
      type: 'boolean',
      description:
        'Enables a pulse animation; respects prefers-reduced-motion: reduce.',
      default: 'false',
    },
    {
      name: 'tooltip',
      type: 'string',
      description: 'Tooltip text shown on hover to explain the status meaning.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        "Optional icon rendered centered inside the dot, painted in currentColor (the variant's ink). Gives the status a non-color mark, so use a different icon per status. Booleans and empty strings are ignored, so `cond && <Icon />` is safe. Same contract as AvatarStatusDot.",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-status-dot', visualProps: ['variant']}],
  },
  usage: {
    anatomy,
    description:
      'A small colored dot that communicates status like online/offline presence or severity levels. Supports five semantic variants and an optional pulse animation. Always pair with a visible text label, as color alone should not carry meaning.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use StatusDot as a binary present/absent signal; avoid encoding many distinct states in a single dot, since color and size alone cannot reliably distinguish them.',
      },
      {
        guidance: true,
        description:
          'Always pair with a visible text label so status is not conveyed by color alone.',
      },
      {
        guidance: true,
        description:
          'Provide a descriptive `label` prop for screen reader accessibility.',
      },
      {
        guidance: true,
        description:
          'Pair the dot with an icon that carries the status as a distinct shape when it must stand on its own without adjacent text, so meaning survives without color.',
      },
      {
        guidance: true,
        description:
          "If you can't add a label or an icon, make sure the status is conveyed elsewhere accessibly (e.g. adjacent text, a table column, or a live region).",
      },
      {
        guidance: false,
        description:
          'Rely on color alone to communicate status; StatusDot is not fully accessible in isolation, so the builder must make the status distinguishable in context via a label, an icon, or an accessible alternative.',
      },
      {
        guidance: false,
        description:
          'Use the pulse animation for purely decorative purposes; reserve it for states that require immediate attention.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "StatusDot",
  "displayName": "Status Dot",
  "props": [
    {
      "name": "variant",
      "type": "'success' | 'warning' | 'error' | 'accent' | 'neutral'",
      "description": "语义颜色变体。",
      "required": true
    },
    {
      "name": "label",
      "type": "string",
      "description": "通过 aria-label 呈现的无障碍标签。",
      "required": true
    },
    {
      "name": "isPulsing",
      "type": "boolean",
      "description": "启用脉冲动画；遵循 prefers-reduced-motion: reduce。",
      "default": "false"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "可选图标，居中渲染在圆点内，使用 currentColor（变体的墨色）绘制。它为状态提供非颜色标记，因此请为每种状态使用不同的图标。布尔值和空字符串会被忽略，因此 `cond && <Icon />` 是安全的。契约与 AvatarStatusDot 相同。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-status-dot",
        "visualProps": [
          "variant"
        ]
      }
    ]
  },
  "usage": {
    "anatomy": [
      {
        "name": "圆点",
        "required": true,
        "description": "绘制的状态圆点，承载所选语义变体。"
      },
      {
        "name": "状态图标",
        "required": false,
        "description": "可选，由调用方提供并渲染在圆点内的图标。"
      }
    ],
    "description": "一个小型彩色圆点，用于传达在线/离线状态或严重级别等状态。支持五种语义变体和可选的脉冲动画。始终搭配可见文本标签，因为颜色本身不应承载含义。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 StatusDot 用作存在/不存在的二元信号；避免用单个圆点编码过多不同状态，因为仅凭颜色和尺寸无法可靠区分它们。"
      },
      {
        "guidance": true,
        "description": "始终搭配可见文本标签，以免仅通过颜色传达状态。"
      },
      {
        "guidance": true,
        "description": "提供描述性的 `label` 属性，以满足屏幕阅读器无障碍需求。"
      },
      {
        "guidance": true,
        "description": "当圆点必须在没有相邻文本的情况下独立表达含义时，搭配一个以独特形状承载状态的图标，使含义不依赖颜色也能保留。"
      },
      {
        "guidance": true,
        "description": "如果无法添加标签或图标，请确保状态在其他地方以无障碍方式传达（例如相邻文本、表格列或实时区域）。"
      },
      {
        "guidance": false,
        "description": "不要仅依赖颜色传达状态；StatusDot 单独使用时并非完全无障碍，因此构建者必须通过标签、图标或无障碍替代方案让状态在上下文中可区分。"
      },
      {
        "guidance": false,
        "description": "不要将脉冲动画用于纯装饰目的；将其保留给需要立即关注的状态。"
      }
    ]
  },
  "propDescriptions": {
    "variant": "语义颜色变体。",
    "label": "通过 aria-label 呈现的无障碍标签。",
    "isPulsing": "启用脉冲动画；遵循 prefers-reduced-motion: reduce。",
    "tooltip": "悬停时显示的工具提示文本，用于解释状态含义。",
    "icon": "可选图标，居中渲染在圆点内，使用 currentColor（变体的墨色）绘制。它为状态提供非颜色标记，因此请为每种状态使用不同的图标。布尔值和空字符串会被忽略，因此 `cond && <Icon />` 是安全的。契约与 AvatarStatusDot 相同。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Small colored dot indicator for status display (online/offline, severity, etc).',
  usage: {
    anatomy,
    description:
      'A small colored dot that communicates status like online/offline presence or severity levels. Supports five semantic variants and an optional pulse animation. Always pair with a visible text label, as color alone should not carry meaning.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use StatusDot as a binary present/absent signal; avoid encoding many distinct states in a single dot, since color and size alone cannot reliably distinguish them.',
      },
      {
        guidance: true,
        description:
          'Always pair with a visible text label so status is not conveyed by color alone.',
      },
      {
        guidance: true,
        description:
          'Provide a descriptive `label` prop for screen reader accessibility.',
      },
      {
        guidance: true,
        description:
          'Pair the dot with an icon that carries the status as a distinct shape when it must stand on its own without adjacent text, so meaning survives without color.',
      },
      {
        guidance: true,
        description:
          "If you can't add a label or an icon, make sure the status is conveyed elsewhere accessibly (e.g. adjacent text, a table column, or a live region).",
      },
      {
        guidance: false,
        description:
          'Rely on color alone to communicate status; StatusDot is not fully accessible in isolation, so the builder must make the status distinguishable in context via a label, an icon, or an accessible alternative.',
      },
      {
        guidance: false,
        description:
          'Use the pulse animation for purely decorative purposes; reserve it for states that require immediate attention.',
      },
    ],
  },
  propDescriptions: {
    variant: 'Semantic color variant.',
    label: 'Accessible label via aria-label.',
    isPulsing: 'Pulse animation; respects prefers-reduced-motion: reduce.',
    tooltip: 'Tooltip text on hover to explain status meaning.',
    icon: 'Optional ReactNode rendered centered in the dot (currentColor ink); a non-color mark for the status, use a different icon per status. Booleans/empty strings ignored (safe for cond && <Icon/>). Same contract as AvatarStatusDot.',
    xstyle: 'StyleX layout styles; must be stylex.create() value.',
  },
};
