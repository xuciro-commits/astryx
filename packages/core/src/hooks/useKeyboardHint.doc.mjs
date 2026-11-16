// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useKeyboardHint',
  displayName: 'useKeyboardHint',
  keywords: ['keyboard', 'hint', 'arrow', 'navigation', 'roving', 'tabindex', 'focus', 'discoverability', 'toolbar', 'tabs', 'segmented', 'affordance', 'a11y'],
  params: [
    {
      name: 'options',
      type: 'UseKeyboardHintOptions',
      description: 'Configuration object for the keyboard hint.',
      required: false,
    },
    {
      name: 'options.orientation',
      type: "'horizontal' | 'vertical' | 'both'",
      description: 'Which arrow-key axis the composite navigates, controlling which arrow icons the hint shows (← → for horizontal, ↑ ↓ for vertical, all four for both).',
      default: "'horizontal'",
      required: false,
    },
    {
      name: 'options.dismissAfterMs',
      type: 'number',
      description: 'Milliseconds before the hint dismisses itself after appearing. Leave it unset: by default the hint stays until an arrow press, Escape, or blur. A time limit can remove the hint before someone has read it (WCAG 1.4.13).',
      default: 'undefined (no time limit)',
      required: false,
    },
    {
      name: 'options.isEnabled',
      type: 'boolean',
      description: 'Whether the hint is enabled. Set to false to suppress it for a specific instance (e.g. a disabled or read-only widget).',
      default: 'true',
      required: false,
    },
  ],
  returns: [
    {
      name: 'hintElement',
      type: 'ReactNode',
      description: 'The popover hint element to render inside the composite container (as the last child). Portals to the top layer via popover="manual", renders arrow keys with Kbd, and manages its own visibility; render it unconditionally.',
    },
    {
      name: 'onFocus',
      type: '(e: React.FocusEvent) => void',
      description: 'Attach to the container onFocus. Shows the hint on the first keyboard-focus (:focus-visible) entry from outside the composite.',
    },
    {
      name: 'onBlur',
      type: '(e: React.FocusEvent) => void',
      description: 'Attach to the container onBlur. Hides the hint when focus leaves the composite entirely, and re-anchors when focus moves within.',
    },
    {
      name: 'onKeyDown',
      type: '(e: React.KeyboardEvent) => void',
      description: 'Attach to the container onKeyDown. Dismisses the hint on the first arrow press (the user has discovered the interaction). Never prevents default or stops propagation.',
    },
  ],
  usage: {
    description:
      'Shows an ephemeral "← → to navigate" hint anchored to the focused item the first time a roving-tabindex composite (Toolbar, TabList, SegmentedControl, etc.) receives keyboard focus. It teaches sighted keyboard users that arrow keys move within the group. The hint renders arrow keys with Kbd in the top layer (popover="manual") and is CSS-anchor-positioned to the focused element, so overflow containers never clip it. It stays until the first arrow press, Escape, or blur, and does not re-show for that instance. Escape closes only the hint, through the shared layer dismissal stack, and keeps focus where it is. Toolbar, TabList, and SegmentedControl wire this in automatically; reach for the hook directly only when building a custom roving-tabindex widget.',
    bestPractices: [
      { guidance: true, description: 'Compose the returned onFocus/onKeyDown with your existing focus handlers rather than replacing them: call onKeyDown first (it only dismisses, never prevents), then your navigation handler.' },
      { guidance: true, description: 'Render hintElement as the last child of the composite container; it is position:fixed in the top layer and aria-hidden, so it never affects layout or the accessibility tree.' },
      { guidance: true, description: 'Match orientation to the arrow keys your widget actually responds to so the hint shows the correct icons.' },
      { guidance: false, description: 'Use for single controls or widgets without roving-tabindex navigation; the hint only makes sense where arrows move focus within a group.' },
    ],
  },
  relatedComponents: ['Toolbar', 'TabList', 'SegmentedControl'],
  relatedHooks: ['useListFocus', 'useGridFocus', 'useTreeFocus'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Ephemeral "← → to navigate" hint anchored to the focused item on first keyboard focus of a roving-tabindex composite (Toolbar/TabList/SegmentedControl). Teaches sighted keyboard users that arrows move within the group. Kbd-rendered arrows in a top-layer popover="manual", CSS-anchor-positioned (never clipped by overflow), aria-hidden. Stays until first arrow press, Escape, or blur; never re-shows for that instance.',
  paramDescriptions: {
    options: 'config for the keyboard hint.',
    'options.orientation': "arrow axis: 'horizontal' (← →), 'vertical' (↑ ↓), 'both' (all four). Controls shown icons.",
    'options.dismissAfterMs': 'ms before self-dismiss. Leave unset (default: no time limit, WCAG 1.4.13).',
    'options.isEnabled': 'whether the hint is enabled; false suppresses it (e.g. disabled/read-only widget).',
  },
  returnDescriptions: {
    hintElement: 'popover hint to render as last child of the container. Kbd-rendered arrows, top-layer, self-managing; render unconditionally.',
    onFocus: 'container onFocus: shows hint on first :focus-visible entry from outside.',
    onBlur: 'container onBlur: hides on leaving the composite; re-anchors on internal moves.',
    onKeyDown: 'container onKeyDown: dismisses on first arrow press. Never prevents default.',
  },
  usage: {
    description:
      'Ephemeral "← → to navigate" hint on first keyboard focus of a roving-tabindex composite. Top-layer anchored popover, aria-hidden. Stays until first arrow press, Escape, or blur; no re-show. Toolbar/TabList/SegmentedControl wire it in automatically.',
    bestPractices: [
      { guidance: true, description: 'Compose returned onFocus/onKeyDown with existing handlers (call onKeyDown first; it only dismisses).' },
      { guidance: true, description: 'Render hintElement as last child; top-layer + aria-hidden, no layout/a11y impact.' },
      { guidance: true, description: 'Match orientation to the arrows the widget responds to.' },
      { guidance: false, description: 'Use for single controls / non-roving widgets.' },
    ],
  },
};

export const docsZh = {
  "name": "useKeyboardHint",
  "usage": {
    "description": "当 roving-tabindex 复合组件（Toolbar、TabList、SegmentedControl 等）首次获得键盘焦点时，显示锚定到聚焦项上的临时“← → to navigate”提示。它教会视力正常的键盘用户方向键可在组内移动。该提示在顶层（popover=\"manual\"）用 Kbd 渲染方向键，并通过 CSS 锚点定位到聚焦元素，因此溢出容器绝不会裁剪它。它会一直保留到首次按下方向键、Escape 或失焦，并且对该实例不再重新显示。Escape 仅关闭提示（通过共享的浮层关闭栈），并将焦点保持在原处。Toolbar、TabList 和 SegmentedControl 会自动接入此 Hook；仅在构建自定义 roving-tabindex 组件时才需要直接使用该 Hook。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将返回的 onFocus/onKeyDown 与现有焦点处理函数组合，而不是替换它们：先调用 onKeyDown（它只关闭提示，绝不阻止默认行为），再调用你的导航处理函数。"
      },
      {
        "guidance": true,
        "description": "将 hintElement 作为复合容器的最后一个子元素渲染；它在顶层使用 position:fixed 并带有 aria-hidden，因此绝不会影响布局或无障碍树。"
      },
      {
        "guidance": true,
        "description": "将 orientation 与你的组件实际响应的方向键匹配，以便提示显示正确的图标。"
      },
      {
        "guidance": false,
        "description": "用于单个控件或不带 roving-tabindex 导航的组件；提示仅在方向键于组内移动焦点时才有意义。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "键盘提示的配置对象。",
    "options.orientation": "复合组件导航的箭头键轴，控制提示显示哪些箭头图标（水平为 ← →，垂直为 ↑ ↓，两者为全部四个）。",
    "options.dismissAfterMs": "提示出现后自动消失前的毫秒数。保持未设置：默认情况下提示会保留到按下方向键、Escape 或失焦。时间限制可能在用户读完之前就移除提示（WCAG 1.4.13）。",
    "options.isEnabled": "是否启用提示。设为 false 可对特定实例（例如禁用或只读组件）抑制提示。"
  },
  "returnDescriptions": {
    "hintElement": "要在复合容器内（作为最后一个子元素）渲染的 popover 提示元素。通过 popover=\"manual\" 传送到顶层，用 Kbd 渲染方向键，并自行管理可见性；请无条件渲染它。",
    "onFocus": "附加到容器的 onFocus。当从复合组件外部首次通过键盘焦点（:focus-visible）进入时显示提示。",
    "onBlur": "附加到容器的 onBlur。当焦点完全离开复合组件时隐藏提示，并在焦点于内部移动时重新锚定。",
    "onKeyDown": "附加到容器的 onKeyDown。首次按下方向键时关闭提示（用户已发现该交互）。绝不阻止默认行为或停止传播。"
  }
};
