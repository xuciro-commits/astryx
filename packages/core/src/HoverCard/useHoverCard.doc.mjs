// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useHoverCard',
  displayName: 'useHoverCard',
  group: 'HoverCard',
  keywords: [
    'hovercard',
    'hover',
    'preview',
    'card',
    'tooltip',
    'popup',
    'floating',
    'anchor',
  ],
  params: [
    {
      name: 'placement',
      type: "'above' | 'below' | 'start' | 'end'",
      description:
        "Position relative to the trigger. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
      default: "'above'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description:
        "Alignment along the placement axis. Logical: start/end resolve against the popover\'s own inherited direction (RTL mirrors in pure CSS).",
      default: "'center'",
    },
    {
      name: 'delay',
      type: 'number',
      description:
        'Delay before showing the hover card on hover, in milliseconds.',
      default: '300',
    },
    {
      name: 'hideDelay',
      type: 'number',
      description:
        'Delay before hiding after mouse or focus leaves, in milliseconds.',
      default: '200',
    },
    {
      name: 'focusTrigger',
      type: "'auto' | 'always' | 'never'",
      description:
        'When focus should open the hover card. auto opens when the trigger itself takes focus, or focus lands inside a trigger that is focusable at that moment, so a roving-tabindex member opens when the arrow keys reach it.',
      default: "'auto'",
    },
    {
      name: 'touchTrigger',
      type: "'auto' | 'tap' | 'none'",
      description:
        'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own (an aria-disabled control performs none); tap always opens; none never opens on touch.',
      default: "'auto'",
    },
    {
      name: 'isEnabled',
      type: 'boolean',
      description: 'Whether hover and focus triggers are enabled.',
      default: 'true',
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for the hover card popup. When provided, the popup is exposed as a named role="dialog"; when omitted, it falls back to role="group" (a group may validly be unnamed).',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Controlled open state. true force-shows, false force-hides, undefined lets hover/focus manage visibility.',
    },
    {
      name: 'isDefaultOpen',
      type: 'boolean',
      description: 'Whether the hover card should be shown on mount.',
      default: 'false',
    },
    {
      name: 'onShow',
      type: '() => void',
      description: 'Callback fired when the hover card becomes visible.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description: 'Callback fired when the hover card is hidden.',
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<HTMLElement>',
      description:
        'Combined ref that sets both position and interaction on the same trigger element.',
    },
    {
      name: 'positionRef',
      type: 'RefCallback<HTMLElement>',
      description:
        'Ref for the positioning anchor element. Use when position and interaction live on different elements.',
    },
    {
      name: 'interactionRef',
      type: 'RefCallback<HTMLElement>',
      description:
        'Ref for the hover/focus interaction element. Use with positionRef for split trigger patterns.',
    },
    {
      name: 'anchorId',
      type: 'string',
      description: 'CSS anchor name for advanced positioning cases.',
    },
    {
      name: 'describedBy',
      type: 'string',
      description: 'ID to compose into aria-describedby on the trigger.',
    },
    {
      name: 'renderHoverCard',
      type: "(children: ReactNode, props?: Omit<ContextRenderProps, 'positioning'>) => ReactNode",
      description:
        'Render function for the anchor-positioned hover card content. The positioning opt-out is excluded: the hover card always derives its position from placement/alignment.',
    },
    {
      name: 'show',
      type: '() => void',
      description: 'Imperatively show the hover card immediately.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Imperatively hide the hover card immediately.',
    },
  ],
  usage: {
    description:
      'Headless hook for hover-triggered floating cards. Builds on useLayer with hover/focus intent detection, configurable delays, safe hover behavior, and accessible aria-describedby linking. Use for rich previews on hover when you need full control over the trigger or rendered content.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for rich content previews such as user profiles, entity summaries, and link previews.',
      },
      {
        guidance: true,
        description:
          'Prefer the HoverCard component for standard trigger-content pairs; use the hook for custom trigger patterns.',
      },
      {
        guidance: false,
        description:
          'Use for simple text hints: use Tooltip or useTooltip instead.',
      },
    ],
  },
  relatedComponents: ['HoverCard', 'Tooltip', 'Popover'],
  relatedHooks: ['useLayer', 'useTooltip', 'usePopover'],
  importPath: '@astryxdesign/core/HoverCard',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headless hover-triggered floating cards. Builds on useLayer w/ hover/focus intent, delays, safe hover behavior, aria-describedby. Use for rich previews when trigger/content rendering needs full control.',
  paramDescriptions: {
    placement:
      "position relative to trigger. logical: start/end follow the popover's inherited direction (RTL mirrors).",
    alignment:
      "alignment along placement axis. logical: start/end follow the popover's inherited direction (RTL mirrors).",
    delay: 'show delay in ms.',
    hideDelay: 'hide delay after mouse/focus leave in ms.',
    focusTrigger:
      'when focus opens hover card; auto = focus on the trigger, or inside a trigger focusable when focus arrives.',
    touchTrigger:
      'tap behavior with no hover; auto = tap unless trigger acts, tap = always, none = never.',
    isEnabled: 'whether hover/focus triggers are enabled.',
    label:
      'accessible name for popup. with label: named role="dialog"; without: role="group".',
    isOpen:
      'controlled open state: true force-show, false force-hide, undefined unmanaged.',
    isDefaultOpen: 'show on mount.',
    onShow: 'fires when hover card becomes visible.',
    onHide: 'fires when hover card hides.',
  },
  returnDescriptions: {
    ref: 'combined position + interaction ref.',
    positionRef: 'position anchor ref.',
    interactionRef: 'hover/focus interaction ref.',
    anchorId: 'CSS anchor name.',
    describedBy: 'ID for aria-describedby.',
    renderHoverCard: 'renders anchor-positioned hover card content.',
    show: 'show immediately.',
    hide: 'hide immediately.',
  },
  usage: {
    description:
      'Headless hover-triggered floating cards. Builds on useLayer w/ hover/focus intent, delays, safe hover behavior, aria-describedby. Use for rich previews when trigger/content rendering needs full control.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for rich previews: profiles, entity summaries, link previews.',
      },
      {
        guidance: true,
        description:
          'Prefer HoverCard for standard trigger-content pairs; use hook for custom trigger patterns.',
      },
      {
        guidance: false,
        description:
          'Use for simple text hints: use Tooltip / useTooltip instead.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useHoverCard",
  "usage": {
    "description": "用于悬停触发的浮动卡片的无头 Hook。基于 useLayer 构建，提供悬停/焦点意图检测、可配置延迟、安全的悬停行为和可访问的 aria-describedby 关联。当你需要完全控制触发器或渲染内容时，用于悬停时的丰富预览。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于丰富的内容预览，例如用户资料、实体摘要和链接预览。"
      },
      {
        "guidance": true,
        "description": "标准的触发器-内容组合优先使用 HoverCard 组件；自定义触发器模式使用此 Hook。"
      },
      {
        "guidance": false,
        "description": "用于简单的文本提示：请改用 Tooltip 或 useTooltip。"
      }
    ]
  },
  "paramDescriptions": {
    "placement": "相对于触发器的位置。逻辑方向：start/end 依据弹出层自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
    "alignment": "沿放置轴的对齐方式。逻辑方向：start/end 依据弹出层自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
    "delay": "悬停时显示悬浮卡的延迟，单位为毫秒。",
    "hideDelay": "鼠标或焦点离开后隐藏的延迟，单位为毫秒。",
    "focusTrigger": "焦点何时应打开悬浮卡。auto 在触发器自身获得焦点时打开，或焦点落在当时可聚焦的触发器内部时打开，因此 roving-tabindex 成员会在方向键到达它时打开。",
    "touchTrigger": "在没有悬停的情况下，点按会做什么。auto 在点按时打开，除非触发器执行自身的操作（aria-disabled 控件不执行任何操作）；tap 始终打开；none 在触摸时从不打开。",
    "isEnabled": "是否启用悬停和焦点触发。",
    "label": "悬浮卡弹出层的无障碍名称。提供时，弹出层以具名 `role=\"dialog\"` 暴露；省略时，回退为 `role=\"group\"`（组可以合法地不命名）。",
    "isOpen": "受控打开状态。true 强制显示，false 强制隐藏，undefined 让悬停/焦点管理可见性。",
    "isDefaultOpen": "挂载时是否应显示悬浮卡。",
    "onShow": "悬浮卡变为可见时触发的回调。",
    "onHide": "悬浮卡隐藏时触发的回调。"
  },
  "returnDescriptions": {
    "ref": "组合 ref，在同一触发器元素上同时设置定位和交互。",
    "positionRef": "定位锚点元素的 ref。当定位和交互位于不同元素上时使用。",
    "interactionRef": "悬停/焦点交互元素的 ref。与 `positionRef` 搭配用于拆分触发器的模式。",
    "anchorId": "用于高级定位场景的 CSS 锚点名称。",
    "describedBy": "用于组合到触发器 `aria-describedby` 中的 ID。",
    "renderHoverCard": "锚点定位的悬浮卡内容的渲染函数。排除定位退出选项：悬浮卡始终根据 `placement`/`alignment` 推导其位置。",
    "show": "立即以命令方式显示悬浮卡。",
    "hide": "立即以命令方式隐藏悬浮卡。"
  }
};
