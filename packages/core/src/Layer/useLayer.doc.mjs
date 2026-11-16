// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useLayer',
  displayName: 'useLayer',
  group: 'Utilities',
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
  params: [
    {
      name: 'mode',
      type: "'context' | 'fixed'",
      description:
        'Positioning strategy: context uses CSS anchor positioning relative to a trigger ref; fixed uses explicit x/y coordinates.',
      required: true,
    },
    {
      name: 'onShow',
      type: '() => void',
      description: 'Callback fired when the layer becomes visible.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description: 'Callback fired when the layer is hidden.',
    },
    {
      name: 'lightDismiss',
      type: 'boolean',
      description:
        'Whether clicking outside should dismiss the layer using native popover light-dismiss behavior.',
      default: 'false',
    },
    {
      name: 'lazyMount',
      type: 'boolean',
      description:
        'Context mode only. Wait until show() to resolve the inline/portal position and mount content; hide unmounts the content while the inert marker remains.',
      default: 'false',
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<HTMLElement> | undefined',
      description: 'Trigger ref for context mode. Undefined in fixed mode.',
    },
    {
      name: 'anchorId',
      type: 'string',
      description: 'CSS anchor name for context mode positioning.',
    },
    {
      name: 'show',
      type: '() => void',
      description: 'Imperatively show the layer.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Imperatively hide the layer.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the layer is currently open.',
    },
    {
      name: 'id',
      type: 'string',
      description:
        'Unique ID for aria-describedby or other ARIA relationships.',
    },
    {
      name: 'render',
      type: '(children: ReactNode, props: ContextRenderProps | FixedRenderProps) => ReactNode',
      description:
        'Render function for the popover element. Pass placement/alignment in context mode or x/y in fixed mode. Placement/alignment are logical: they map to the self-* position-area keyword family, which resolves against the popover\'s own inherited direction, so RTL contexts mirror automatically in pure CSS. Pass `positioning: "custom"` in context mode to author position styles yourself via `style` (e.g. explicit anchor() insets or an anchor-size() cover): the hook keeps the popover behavior and position-anchor wiring but derives no position styles, including the automatic RTL mirroring, which becomes your responsibility. Pass `offset` (a CSS length; a number is px) in context mode for clearance from the anchor: it applies to both edges of the placement axis, so the gap survives a flip. Layers are flush by default. Context mode first renders an inert `<template>` marker in matching server and client markup. The final layer stays at that JSX position if its parent is safe; otherwise it is portaled to the nearest ancestor outside paragraphs, links, buttons, inline formatting, and structurally restricted containers. The nearest safe host keeps CSS custom properties inheriting live, while the layer preserves direction and writing mode from its JSX position. By default this resolution occurs after hydration so closed-layer DOM remains available, and it re-renders only the slot that holds the marker and the layer, not the component that called the hook (which renders again only when a resolved mount is replaced by a render call that moved to another host); `lazyMount` defers it until `show()` and unmounts the content again on hide while the marker remains. The Popover API promotes the layer to the top layer when shown, so it escapes ancestor clipping and stacking wherever it is hosted. When the layer would overflow the viewport, position-try fallbacks flip it to the opposite side; centered layers additionally slide along the alignment axis (span fallbacks) so they stay on-screen near viewport edges.',
    },
  ],
  usage: {
    description:
      'Core positioning hook for rendering overlay content using CSS Anchor Positioning and the Popover API. Use it as the foundation for custom popovers, hover cards, tooltips, and fixed-position layers when higher-level components are not enough. Both modes use theme body text defaults and end ancestor surface/group membership as a whole, including group-owned state. Explicit props and unrelated contexts remain unchanged. Apply intentional formatting through render styles or content, and establish complete content-local providers inside the rendered layer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use context mode for anchor-positioned overlays relative to a trigger element, and fixed mode for manually positioned overlays at specific coordinates.',
      },
      {
        guidance: true,
        description:
          'Build on higher-level components like Popover, HoverCard, and Tooltip for common overlay patterns.',
      },
      {
        guidance: true,
        description:
          "Rely on the Popover API top layer to escape ancestor clipping and stacking, and host the layer near its trigger rather than in the body so it inherits the trigger's theme cascade and keeps a natural focus order.",
      },
      {
        guidance: false,
        description:
          'Implement ARIA patterns directly in a Layer unless you also own the full accessibility behavior.',
      },
    ],
  },
  relatedComponents: ['LayerProvider', 'Popover', 'HoverCard', 'Tooltip'],
  relatedHooks: ['usePopover', 'useHoverCard', 'useTooltip'],
  importPath: '@astryxdesign/core/Layer',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Core positioning hook for overlay content via CSS Anchor Positioning + Popover API. Foundation for custom popovers, hover cards, tooltips, fixed-position layers. Both modes use theme body defaults and end ancestor surface/group membership as a whole. Explicit props and unrelated contexts remain unchanged; establish intentional groups and complete required providers inside the rendered layer.',
  paramDescriptions: {
    mode: 'positioning strategy: context = CSS anchor relative to trigger; fixed = explicit x/y coords',
    onShow: 'fires when layer becomes visible.',
    onHide: 'fires when layer hides.',
    lightDismiss: 'whether native outside-click light-dismiss is enabled.',
    lazyMount:
      'context only: defer position resolution/content mounting until show; unmount on hide.',
  },
  returnDescriptions: {
    ref: 'trigger ref for context mode; undefined in fixed mode.',
    anchorId: 'CSS anchor name.',
    show: 'show layer.',
    hide: 'hide layer.',
    isOpen: 'whether layer is open.',
    id: 'unique ARIA id.',
    render:
      'renders popover element; pass placement/alignment or x/y. Placement/alignment logical: mapped to self-* position-area keywords resolved against the popover\'s inherited direction (RTL mirrors in pure CSS). `positioning: "custom"` (context mode) = author position styles yourself via `style`; keeps popover behavior + position-anchor wiring, derives nothing (incl. RTL mirroring, which becomes yours). `offset` (context mode) = clearance from the anchor as a CSS length (number = px), applied to both edges of the placement axis so it survives a flip; layers are flush by default. Context mode begins with an inert `<template>` marker for stable SSR/hydration, then keeps the final layer inline at a safe JSX position or portals it to the nearest safe ancestor; CSS custom properties keep inheriting from that host while direction and writing mode are preserved from the JSX position. `lazyMount` waits for show and unmounts content on hide while the marker remains. The Popover API top layer escapes clipping/stacking wherever it is hosted. Viewport overflow: flips to opposite side; centered layers also slide along the alignment axis (span fallbacks).',
  },
  usage: {
    description:
      'Core positioning hook for overlay content via CSS Anchor Positioning + Popover API. Foundation for custom popovers, hover cards, tooltips, fixed-position layers. Both modes use theme body defaults and end ancestor surface/group membership as a whole. Explicit props and unrelated contexts remain unchanged; establish intentional groups and complete required providers inside the rendered layer.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use context mode for trigger-anchored overlays; fixed mode for explicit coordinates.',
      },
      {
        guidance: true,
        description:
          'Build on Popover/HoverCard/Tooltip for common overlay patterns.',
      },
      {
        guidance: true,
        description:
          'Rely on the Popover API top layer to escape clipping/stacking; host the layer near its trigger (not in the body) to inherit the trigger theme cascade and natural focus order.',
      },
      {
        guidance: false,
        description:
          'Implement ARIA directly in Layer unless you own full accessibility behavior.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useLayer",
  "usage": {
    "description": "使用 CSS 锚点定位和 Popover API 渲染浮层内容的核心定位 Hook。当更高层组件不够用时，将其作为自定义 popover、悬浮卡片、工具提示和固定定位浮层的基础。两种模式都使用主题正文文本默认值，并整体终止祖先表面/组成员关系，包括组拥有的状态。显式传入的属性和无关上下文保持不变。通过渲染样式或内容施加有意的格式，并在渲染的浮层内建立完整的内容局部 Provider。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "对于相对于触发器元素锚定的浮层，使用 context 模式；对于在特定坐标手动定位的浮层，使用 fixed 模式。"
      },
      {
        "guidance": true,
        "description": "常见浮层模式请基于 Popover、HoverCard 和 Tooltip 等更高层组件构建。"
      },
      {
        "guidance": true,
        "description": "依靠 Popover API 顶层来摆脱祖先裁剪和堆叠上下文，并将浮层托管在触发器附近而非 body 中，这样它能继承触发器的主题级联并保持自然的焦点顺序。"
      },
      {
        "guidance": false,
        "description": "除非你也负责完整的无障碍行为，否则不要在 Layer 中直接实现 ARIA 模式。"
      }
    ]
  },
  "paramDescriptions": {
    "mode": "定位策略：context 使用相对于触发器 ref 的 CSS 锚点定位；fixed 使用显式的 x/y 坐标。",
    "onShow": "浮层变为可见时触发的回调。",
    "onHide": "浮层被隐藏时触发的回调。",
    "lightDismiss": "点击外部时是否使用原生 popover 轻触关闭行为来关闭浮层。",
    "lazyMount": "仅 context 模式。等到 show() 时才解析内联/传送位置并挂载内容；hide 会卸载内容，但保留惰性标记。"
  },
  "returnDescriptions": {
    "ref": "context 模式的触发器 ref。fixed 模式下为 undefined。",
    "anchorId": "用于 context 模式定位的 CSS 锚点名称。",
    "show": "以命令方式显示浮层。",
    "hide": "以命令方式隐藏浮层。",
    "isOpen": "浮层当前是否打开。",
    "id": "用于 aria-describedby 或其他 ARIA 关系的唯一 ID。",
    "render": "popover 元素的渲染函数。context 模式下传入 placement/alignment，fixed 模式下传入 x/y。placement/alignment 是逻辑值：它们映射到 self-* position-area 关键字族，依据 popover 自身继承的方向解析，因此 RTL 上下文在纯 CSS 下会自动镜像。在 context 模式下传入 `positioning: \"custom\"`，可通过 `style` 自行编写定位样式（例如显式的 anchor() 内边距或 anchor-size() 覆盖）：该 Hook 保留 popover 行为和 position-anchor 接线，但不推导任何定位样式，包括自动 RTL 镜像，这由你自行负责。在 context 模式下传入 `offset`（CSS 长度；数字表示 px）以设置与锚点之间的间隙：它应用于放置轴的两侧，因此翻转后间隙仍然存在。浮层默认紧贴。context 模式首先在服务器和客户端标记中渲染相匹配的惰性 `<template>` 标记。如果父级安全，最终浮层保留在该 JSX 位置；否则会传送到最近的、位于段落、链接、按钮、内联格式和结构受限容器之外的祖先。最近的安全宿主会让 CSS 自定义属性保持实时继承，同时浮层保留其 JSX 位置的方向和书写模式。默认情况下，此解析在水合后发生，因此关闭状态的浮层 DOM 仍然可用，并且只重新渲染包含标记和浮层的插槽，而不是调用该 Hook 的组件（仅当已解析的挂载点被移动到另一宿主的渲染调用替换时，该组件才会再次渲染）；`lazyMount` 将其推迟到 `show()`，并在隐藏时再次卸载内容而保留标记。Popover API 在显示时将浮层提升到顶层，因此无论托管在哪里都能摆脱祖先裁剪和堆叠。当浮层将溢出视口时，position-try 回退会将其翻转到对侧；居中的浮层还会沿对齐轴滑动（span 回退），以便在视口边缘附近保持可见。"
  }
};
