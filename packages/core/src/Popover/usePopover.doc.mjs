// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'usePopover',
  displayName: 'usePopover',
  group: 'Popover',
  keywords: [
    'popover',
    'popup',
    'dropdown',
    'floating',
    'anchor',
    'dialog',
    'overlay',
    'flyout',
  ],
  params: [
    {
      name: 'onShow',
      type: '() => void',
      description: 'Callback fired when the popover becomes visible.',
    },
    {
      name: 'onHide',
      type: '() => void',
      description:
        'Callback fired when the popover is hidden. Use this to return focus to the trigger when needed.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles applied to the popover content wrapper, after the default surface styles.',
    },
    {
      name: 'hasLightDismiss',
      type: 'boolean',
      description: 'Whether clicking outside dismisses the popover.',
      default: 'true',
    },
    {
      name: 'hasEscapeDismiss',
      type: 'boolean',
      description:
        'Whether pressing Escape dismisses the popover. Only takes full effect together with hasLightDismiss: false, since native light dismiss also closes on Escape.',
      default: 'true',
    },
    {
      name: 'hasAutoFocus',
      type: 'boolean',
      description:
        'Whether to focus the first genuine content control when opened. Dialogs with none fall back to the labeled surface; the generated close control is excluded from initial focus.',
      default: 'true',
    },
    {
      name: 'hasCloseButton',
      type: 'boolean',
      description:
        'Whether to include a hidden close button that appears for keyboard users.',
      default: 'true',
    },
    {
      name: 'closeButtonLabel',
      type: 'string',
      description: 'Accessible label for the hidden close button.',
      default: "'Close popover'",
    },
    {
      name: 'dialogLabel',
      type: 'string',
      description:
        'Accessible label for the popover dialog (only applies when role is "dialog"). Provide one when there is no visible title.',
    },
    {
      name: 'role',
      type: "'dialog' | 'none'",
      description:
        'ARIA role on the content wrapper. Use "dialog" for genuine dialog content; use "none" for listbox/menu popups whose own content role should be exposed and whose trigger keeps DOM focus.',
      default: "'dialog'",
    },
    {
      name: 'isModal',
      type: 'boolean',
      description:
        'Whether a dialog-role popover is modal (aria-modal). Only applies when role is "dialog".',
      default: 'true',
    },
    {
      name: 'hasSurface',
      type: 'boolean',
      description:
        'Whether to apply the default popover surface background, radius, and shadow.',
      default: 'true',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Inner padding of the painted surface on the spacing scale (0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10). Omit it and the hook paints no padding of its own; Popover passes 3 by default and 0 for a flush surface.',
    },
    {
      name: 'surfaceTarget',
      type: 'string',
      description:
        'Optional component-owned refinement target on the painted surface, without the astryx- prefix. Use and document one when a direct hook composition needs distinct theme reachability.',
    },
  ],
  returns: [
    {
      name: 'triggerRef',
      type: '(el: HTMLElement | null) => void',
      description:
        'Ref callback to attach to the trigger element for CSS anchor positioning.',
    },
    {
      name: 'contentRef',
      type: 'RefObject<HTMLDivElement | null>',
      description:
        'Ref for the popover content container used by focus trapping.',
    },
    {
      name: 'anchorId',
      type: 'string',
      description: 'CSS anchor name for advanced positioning cases.',
    },
    {
      name: 'show',
      type: '(options?: {skipAutoFocus?: boolean}) => void',
      description:
        'Imperatively show the popover. skipAutoFocus preserves current focus for input-triggered popovers.',
    },
    {
      name: 'hide',
      type: '() => void',
      description: 'Imperatively hide the popover.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'Toggle the popover open or closed.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the popover is currently open.',
    },
    {
      name: 'id',
      type: 'string',
      description: 'Unique ID for aria-describedby or aria-controls.',
    },
    {
      name: 'render',
      type: '(children: ReactNode, props?: ContextRenderProps) => ReactNode',
      description:
        "Render function for anchor-positioned popover content. Pass placement and alignment here. Logical: start/end resolve against the popover's own inherited direction (RTL mirrors in pure CSS).",
    },
    {
      name: 'triggerProps',
      type: '{aria-haspopup: "dialog" | "true"; aria-expanded: boolean; aria-controls: string}',
      description:
        'ARIA attributes to spread onto the trigger element. aria-haspopup reflects the popover role.',
    },
  ],
  usage: {
    description:
      'Headless hook for click-triggered popovers with focus trapping. Combines useLayer with useFocusTrap, auto-focus, light dismiss, Escape handling, and an optional hidden close button for accessible dialog-like popover behavior. Every painted surface emits the canonical popover target. A custom composition needing a distinct stable seam should pass and document its own surfaceTarget.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for interactive content such as menus, pickers, forms, and command panels that need focus management.',
      },
      {
        guidance: true,
        description:
          'Prefer the Popover component for standard trigger-content pairs; use the hook for custom trigger patterns.',
      },
      {
        guidance: true,
        description: 'Use popover as the broad canonical surface target.',
      },
      {
        guidance: true,
        description:
          'When a custom composition needs its own theme refinement, pass and document an owned surfaceTarget such as selector-popup. It refines the Popover surface rather than creating another anatomy part.',
      },
      {
        guidance: false,
        description:
          'Use for non-interactive hover previews: use useHoverCard or useTooltip instead.',
      },
    ],
  },
  relatedComponents: ['Popover', 'DropdownMenu', 'HoverCard'],
  relatedHooks: ['useLayer', 'useFocusTrap', 'useHoverCard', 'useTooltip'],
  importPath: '@astryxdesign/core/Popover',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Headless click-triggered popovers w/ focus trap, auto-focus, light dismiss, Escape, optional hidden close button. Every surface emits the canonical popover target. Custom compositions needing a distinct seam pass/document an owned surfaceTarget.',
  paramDescriptions: {
    onShow: 'fires when popover becomes visible.',
    onHide: 'fires when popover hides; use to return focus when needed.',
    xstyle: 'StyleX styles for content wrapper, after default surface.',
    hasLightDismiss: 'whether outside click dismisses popover.',
    hasEscapeDismiss:
      'whether Escape dismisses; full effect only w/ hasLightDismiss false.',
    hasAutoFocus:
      'focus genuine content on open; dialog surface fallback; generated close excluded.',
    hasCloseButton: 'whether hidden keyboard close button is included.',
    closeButtonLabel: 'label for hidden close button.',
    dialogLabel: 'accessible label for popover dialog (role="dialog" only).',
    role: 'content wrapper ARIA role; "none" for listbox/menu popups.',
    isModal: 'whether a dialog-role popover is modal (aria-modal).',
    hasSurface: 'apply default surface background/radius/shadow.',
    padding: 'spacing-scale padding on the painted surface; omit for none.',
    surfaceTarget:
      'optional owned refinement target; document it when distinct reachability is needed.',
  },
  returnDescriptions: {
    triggerRef: 'trigger ref for CSS anchor positioning.',
    contentRef: 'content container ref for focus trap.',
    anchorId: 'CSS anchor name.',
    show: 'show popover; skipAutoFocus preserves current focus.',
    hide: 'hide popover.',
    toggle: 'toggle open/closed.',
    isOpen: 'whether currently open.',
    id: 'unique ARIA id.',
    render: 'renders anchor-positioned popover content.',
    triggerProps: 'ARIA attrs for trigger.',
  },
  usage: {
    description:
      'Headless click-triggered popovers w/ focus trap, auto-focus, light dismiss, Escape, optional hidden close button. Every surface emits the canonical popover target. Custom compositions needing a distinct seam pass/document an owned surfaceTarget.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for menus, pickers, forms, command panels needing focus management.',
      },
      {
        guidance: true,
        description:
          'Prefer Popover for standard trigger-content pairs; use hook for custom trigger patterns.',
      },
      {
        guidance: true,
        description:
          'Use the canonical popover target for broad surface theming.',
      },
      {
        guidance: true,
        description:
          'For component-specific reachability, pass and document an owned surfaceTarget; it refines the same surface.',
      },
      {
        guidance: false,
        description:
          'Use for non-interactive hover previews: use useHoverCard / useTooltip instead.',
      },
    ],
  },
};

export const docsZh = {
  "name": "usePopover",
  "usage": {
    "description": "用于点击触发的弹出层并带焦点捕获的无头 Hook。组合了 useLayer 与 useFocusTrap、自动聚焦、轻触关闭、Escape 处理以及可选的隐藏关闭按钮，以实现类似对话框的无障碍弹出层行为。每个绘制表面都会发出规范的弹出层目标。需要独特稳定接缝的自定义组合应传入并记录自己的 surfaceTarget。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于菜单、选择器、表单和命令面板等需要焦点管理的交互式内容。"
      },
      {
        "guidance": true,
        "description": "标准触发-内容配对优先使用 Popover 组件；自定义触发模式使用此 Hook。"
      },
      {
        "guidance": true,
        "description": "将 popover 用作广泛的规范表面目标。"
      },
      {
        "guidance": true,
        "description": "当自定义组合需要自己的主题细化时，传入并记录拥有的 surfaceTarget，例如 selector-popup。它细化 Popover 表面，而不是创建另一个解剖结构部件。"
      },
      {
        "guidance": false,
        "description": "将其用于非交互式悬停预览：请改用 useHoverCard 或 useTooltip。"
      }
    ]
  },
  "paramDescriptions": {
    "onShow": "弹出层变为可见时触发的回调。",
    "onHide": "弹出层隐藏时触发的回调。需要时将焦点返回触发元素。",
    "xstyle": "在默认表面样式之后应用于弹出层内容包装器的 StyleX 样式。",
    "hasLightDismiss": "点击外部是否关闭弹出层。",
    "hasEscapeDismiss": "按 Escape 是否关闭弹出层。仅在搭配 hasLightDismiss: false 时完全生效，因为原生轻触关闭也会在 Escape 时关闭。",
    "hasAutoFocus": "打开时是否聚焦第一个真正的内容控件。没有此类控件的对话框回退到带标签的表面；生成的关闭控件不参与初始焦点。",
    "hasCloseButton": "是否包含一个为键盘用户显示的隐藏关闭按钮。",
    "closeButtonLabel": "隐藏关闭按钮的可访问标签。",
    "dialogLabel": "弹出层对话框的可访问标签（仅在 role 为 \"dialog\" 时适用）。没有可见标题时请提供。",
    "role": "内容包装器上的 ARIA role。真正的对话框内容使用 \"dialog\"；listbox/menu 弹出层使用 \"none\"，以便暴露其自身的内容 role，并由触发元素保留 DOM 焦点。",
    "isModal": "dialog role 的弹出层是否为模态（aria-modal）。仅在 role 为 \"dialog\" 时适用。",
    "hasSurface": "是否应用默认的弹出层表面背景、圆角和阴影。",
    "padding": "绘制表面的内边距，采用间距刻度（0, 0.5, 1, 1.5, 2, 3, 4, 5, 6, 8, 10）。省略时 Hook 不绘制自己的内边距；Popover 默认传 3，齐平表面传 0。",
    "surfaceTarget": "绘制表面上的可选组件自有细化目标，不带 astryx- 前缀。当直接使用 Hook 的组合需要独特的主题可达性时，使用并记录一个。"
  },
  "returnDescriptions": {
    "triggerRef": "附加到触发元素以进行 CSS 锚点定位的 Ref 回调。",
    "contentRef": "用于焦点捕获的弹出层内容容器 Ref。",
    "anchorId": "用于高级定位场景的 CSS 锚点名称。",
    "show": "以命令方式显示弹出层。skipAutoFocus 为输入触发的弹出层保留当前焦点。",
    "hide": "以命令方式隐藏弹出层。",
    "toggle": "切换弹出层的打开或关闭。",
    "isOpen": "弹出层当前是否打开。",
    "id": "用于 aria-describedby 或 aria-controls 的唯一 ID。",
    "render": "锚点定位弹出层内容的渲染函数。在此传入 placement 和 alignment。逻辑值：start/end 依据弹出层自身继承的方向解析（RTL 在纯 CSS 中镜像）。",
    "triggerProps": "要展开到触发元素上的 ARIA 属性。aria-haspopup 反映弹出层的 role。"
  }
};
