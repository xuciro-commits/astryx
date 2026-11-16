// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTooltip',
  displayName: 'useTooltip',
  group: 'Tooltip',
  keywords: ['tooltip', 'hint', 'label', 'hover', 'info', 'title', 'floating'],
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
      description: 'Delay before showing on hover, in milliseconds.',
      default: '200',
    },
    {
      name: 'hideDelay',
      type: 'number',
      description:
        'Delay before hiding after mouse or focus leaves, in milliseconds.',
      default: '0',
    },
    {
      name: 'focusTrigger',
      type: "'auto' | 'always' | 'never'",
      description:
        'When focus should open the tooltip. auto opens when the trigger itself takes focus, or focus lands inside a trigger that is focusable at that moment, so a roving-tabindex member opens when the arrow keys reach it.',
      default: "'auto'",
    },
    {
      name: 'touchTrigger',
      type: "'auto' | 'tap' | 'none'",
      description:
        'What a tap does where there is no hover. auto opens on tap unless the trigger performs an action of its own (an aria-disabled control performs none); tap always opens (a button whose only job is revealing the tooltip); none never opens on touch.',
      default: "'auto'",
    },
    {
      name: 'isEnabled',
      type: 'boolean',
      description: 'Whether hover and focus triggers are enabled.',
      default: 'true',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description:
        'Controlled open state. true force-shows; false force-hides, and focus that would show it calls onShow; undefined lets hover/focus manage visibility.',
    },
    {
      name: 'isDefaultOpen',
      type: 'boolean',
      description: 'Whether the tooltip should be shown on mount.',
      default: 'false',
    },
    {
      name: 'onShow',
      type: '() => void',
      description:
        'Callback fired when the tooltip becomes visible. Under isOpen={false}, it reports focus that would show the tooltip.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description: 'Callback fired when the tooltip is hidden.',
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
      description: 'Ref for the positioning anchor element.',
    },
    {
      name: 'interactionRef',
      type: 'RefCallback<HTMLElement>',
      description: 'Ref for the hover/focus interaction element.',
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
      name: 'renderTooltip',
      type: "(children: ReactNode, props?: Omit<ContextRenderProps, 'positioning'>) => ReactNode",
      description:
        'Render function for the anchor-positioned tooltip content. The positioning opt-out is excluded: the tooltip always derives its position from placement/alignment.',
    },
    {
      name: 'show',
      type: '() => void',
      description:
        'Opens the tooltip now and keeps it open until hide(), Escape, a press outside, or focus leaving its trigger. Its text is announced once, and onShow fires. Under a controlled isOpen it only calls onShow. Does nothing while isEnabled is false.',
    },
    {
      name: 'hide',
      type: '() => void',
      description:
        'Closes the tooltip now, and onHide fires. Under a controlled isOpen it only calls onHide.',
    },
  ],
  usage: {
    description:
      'Headless hook for hover/focus-triggered tooltips. Builds on useLayer with hover intent, keyboard focus handling, and accessible aria-describedby linking. Use for custom trigger elements that need tooltip behavior without the wrapper component.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for brief text labels that describe icon buttons, truncated text, abbreviations, or compact controls.',
      },
      {
        guidance: true,
        description:
          'Prefer the Tooltip component for standard wrapping; use the hook when the trigger is not a simple child.',
      },
      {
        guidance: true,
        description:
          'For a toggle-style trigger, have your own button call show() and hide() on each press. Give it aria-describedby and aria-controls set to describedBy, and aria-expanded (true while show() holds the tooltip, false after hide() or onHide), and keep its own accessible name. For an info icon, use InfoTip instead.',
      },
      {
        guidance: false,
        description:
          'Put interactive content inside tooltips: use Popover or HoverCard instead.',
      },
    ],
  },
  relatedComponents: ['Tooltip', 'HoverCard', 'Popover'],
  relatedHooks: ['useLayer', 'useHoverCard', 'usePopover'],
  importPath: '@astryxdesign/core/Tooltip',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headless hover/focus tooltip hook. Builds on useLayer w/ hover intent, keyboard focus handling, aria-describedby. Use for custom triggers without wrapper component.',
  paramDescriptions: {
    placement:
      "position relative to trigger. logical: start/end follow the popover's inherited direction (RTL mirrors).",
    alignment:
      "alignment along placement axis. logical: start/end follow the popover's inherited direction (RTL mirrors).",
    delay: 'show delay in ms.',
    hideDelay: 'hide delay after mouse/focus leave in ms.',
    focusTrigger:
      'when focus opens tooltip; auto = focus on the trigger, or inside a trigger focusable when focus arrives.',
    touchTrigger:
      'tap behavior with no hover; auto = tap unless trigger acts, tap = always, none = never.',
    isEnabled: 'whether hover/focus triggers are enabled.',
    isOpen:
      'controlled open state: true force-show, false force-hide, undefined unmanaged.',
    isDefaultOpen: 'show on mount.',
    onShow: 'fires when tooltip becomes visible.',
    onHide: 'fires when tooltip hides.',
  },
  returnDescriptions: {
    ref: 'combined position + interaction ref.',
    positionRef: 'position anchor ref.',
    interactionRef: 'hover/focus interaction ref.',
    anchorId: 'CSS anchor name.',
    describedBy: 'ID for aria-describedby.',
    renderTooltip: 'renders anchor-positioned tooltip content.',
    show: 'opens + holds until hide()/Escape/outside press/focus leave; announces once; onShow. Controlled: onShow only. No-op when disabled.',
    hide: 'closes; onHide. Controlled: onHide only.',
  },
  usage: {
    description:
      'Headless hover/focus tooltip hook. Builds on useLayer w/ hover intent, keyboard focus handling, aria-describedby. Use for custom triggers without wrapper component.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for brief text labels describing icon buttons, truncated text, abbreviations, compact controls.',
      },
      {
        guidance: true,
        description:
          'Prefer Tooltip for standard wrapping; use hook when trigger is not simple child.',
      },
      {
        guidance: true,
        description:
          'Toggle-style trigger: own button calls show()/hide() per press, sets aria-describedby + aria-controls={describedBy}, aria-expanded (true while held), keeps its own name. Info icon: use InfoTip.',
      },
      {
        guidance: false,
        description:
          'Put interactive content in tooltips: use Popover / HoverCard instead.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useTooltip",
  "usage": {
    "description": "用于悬停/聚焦触发工具提示的无头 Hook。基于 `useLayer` 构建，包含悬停意图、键盘焦点处理和可访问的 `aria-describedby` 关联。适用于需要工具提示行为但不想使用包装组件的自定义触发元素。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于描述图标按钮、截断文本、缩写或紧凑控件的简短文本标签。"
      },
      {
        "guidance": true,
        "description": "标准包装场景优先使用 `Tooltip` 组件；当触发器不是简单子元素时使用此 Hook。"
      },
      {
        "guidance": true,
        "description": "对于切换式触发器，让你自己的按钮在每次按下时调用 `show()` 和 `hide()`。为其设置 `aria-describedby` 和 `aria-controls` 为 `describedBy`，并设置 `aria-expanded`（`show()` 保持工具提示打开时为 `true`，`hide()` 或 `onHide` 之后为 `false`），同时保留其自身的无障碍名称。对于信息图标，请改用 `InfoTip`。"
      },
      {
        "guidance": false,
        "description": "在工具提示内放置交互式内容：请改用 `Popover` 或 `HoverCard`。"
      }
    ]
  },
  "paramDescriptions": {
    "placement": "相对于触发器的位置。逻辑值：`start`/`end` 根据浮层自身继承的方向解析（RTL 下通过纯 CSS 镜像）。",
    "alignment": "沿放置轴的对齐方式。逻辑值：`start`/`end` 根据浮层自身继承的方向解析（RTL 下通过纯 CSS 镜像）。",
    "delay": "悬停后显示前的延迟，单位为毫秒。",
    "hideDelay": "鼠标或焦点离开后隐藏前的延迟，单位为毫秒。",
    "focusTrigger": "何时应在聚焦时打开工具提示。`auto` 会在触发器本身获得焦点，或焦点落在当时可聚焦的触发器内部时打开，因此 roving-tabindex 成员在方向键到达时会打开。",
    "touchTrigger": "在没有悬停的场景下，点按会做什么。`auto` 在点按时打开，除非触发器本身执行某项操作（`aria-disabled` 控件不执行任何操作）；`tap` 始终打开（仅用于显示工具提示的按钮）；`none` 在触摸时从不打开。",
    "isEnabled": "是否启用悬停和聚焦触发。",
    "isOpen": "受控打开状态。`true` 强制显示；`false` 强制隐藏，此时本应显示它的焦点会调用 `onShow`；`undefined` 则由悬停/聚焦管理可见性。",
    "isDefaultOpen": "是否在挂载时显示工具提示。",
    "onShow": "工具提示变为可见时触发的回调。在 `isOpen={false}` 下，它会报告本应显示工具提示的焦点。",
    "onHide": "工具提示隐藏时触发的回调。"
  },
  "returnDescriptions": {
    "ref": "组合 ref，在同一触发元素上同时设置定位和交互。",
    "positionRef": "定位锚点元素的 ref。",
    "interactionRef": "悬停/聚焦交互元素的 ref。",
    "anchorId": "用于高级定位场景的 CSS 锚点名称。",
    "describedBy": "要组合到触发器 `aria-describedby` 中的 ID。",
    "renderTooltip": "用于渲染锚点定位工具提示内容的函数。已排除定位退出选项：工具提示始终根据 `placement`/`alignment` 推导位置。",
    "show": "立即打开工具提示，并保持打开直到调用 `hide()`、按 Escape、在外部按下，或焦点离开其触发器。其文本会朗读一次，并触发 `onShow`。在受控 `isOpen` 下仅调用 `onShow`。`isEnabled` 为 `false` 时不做任何事。",
    "hide": "立即关闭工具提示，并触发 `onHide`。在受控 `isOpen` 下仅调用 `onHide`。"
  }
};
