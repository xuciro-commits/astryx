// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useFocusTrap',
  displayName: 'useFocusTrap',
  keywords: ['focus', 'trap', 'modal', 'dialog', 'accessibility', 'a11y', 'keyboard', 'tab', 'escape', 'wai-aria'],
  params: [
    {
      name: 'options',
      type: 'UseFocusTrapOptions',
      description: 'Configuration object for the focus trap.',
      required: true,
    },
    {
      name: 'options.isActive',
      type: 'boolean',
      description: 'Whether the focus trap is currently active.',
      required: true,
    },
    {
      name: 'options.onEscape',
      type: '() => void',
      description: 'Callback when Escape key is pressed inside the trapped container.',
      required: false,
    },
  ],
  returns: [
    {
      name: 'containerRef',
      type: 'React.RefObject<HTMLElement | null>',
      description: 'Ref to attach to the container element that should trap focus.',
    },
    {
      name: 'focusFirst',
      type: '() => void',
      description: 'Focuses the first focusable element inside the container.',
    },
  ],
  usage: {
    description:
      'Traps focus within a container element following the WAI-ARIA dialog focus trap pattern. Listens to focus events on the document and redirects focus back into the container if a Tab from inside it moves focus out. Handles both Tab and Shift+Tab wrapping. A Tab pressed while focus is outside the container is left to the page, so an open non-modal surface never takes over the focus order of the page. When the trap deactivates or unmounts, focus is restored to the element that was focused before activation, unless focus was already moved elsewhere or never entered the trap (so popups that keep focus on their trigger, like comboboxes, are unaffected). Mouse clicks outside the container are not intercepted; use a light-dismiss handler for that.',
    bestPractices: [
      { guidance: true, description: 'Call focusFirst() when opening a dialog/modal to move focus into the trapped region.' },
      { guidance: true, description: 'Provide an onEscape callback to close the dialog when Escape is pressed.' },
      { guidance: true, description: 'Rely on the built-in focus restoration on close; only add your own onHide focus handling when you need to send focus somewhere other than the previously-focused element.' },
      { guidance: false, description: 'Use on non-modal content like tooltips or dropdowns; those need light-dismiss, not focus trapping.' },
    ],
  },
  relatedComponents: ['Dialog', 'DatePicker'],
  relatedHooks: ['useListFocus', 'useScrollLock'],
  importPath: '@astryxdesign/core/hooks',
  category: 'focus',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Traps focus within container element following WAI-ARIA dialog focus trap pattern. Listens to document focus events + redirects focus back into container if a Tab from inside moves focus out. Handles both Tab + Shift+Tab wrapping. Tab pressed while focus outside container left to the page. Mouse clicks outside container not intercepted; use light-dismiss handler for that.',
  paramDescriptions: {
    options: 'config for focus trap.',
    'options.isActive': 'whether focus trap currently active.',
    'options.onEscape': 'callback when Escape key pressed inside trapped container.',
  },
  returnDescriptions: {
    containerRef: 'ref to attach to container element that should trap focus.',
    focusFirst: 'focuses first focusable element inside container.',
  },
  usage: {
    description:
      'Traps focus within container element following WAI-ARIA dialog focus trap pattern. Listens to document focus events + redirects focus back into container if a Tab from inside moves focus out. Handles both Tab + Shift+Tab wrapping. Tab pressed while focus outside container left to the page. On deactivate/unmount, restores focus to the element focused before activation unless focus already moved elsewhere or never entered the trap. Mouse clicks outside container not intercepted; use light-dismiss handler for that.',
    bestPractices: [
      { guidance: true, description: 'Call focusFirst() when opening dialog/modal to move focus into trapped region.' },
      { guidance: true, description: 'Provide onEscape callback to close dialog when Escape pressed.' },
      { guidance: true, description: 'Rely on built-in focus restoration on close; add own onHide focus handling only to send focus somewhere other than previously-focused element.' },
      { guidance: false, description: 'Use on non-modal content like tooltips / dropdowns; those need light-dismiss, not focus trapping.' },
    ],
  },
};

export const docsZh = {
  "name": "useFocusTrap",
  "usage": {
    "description": "按照 WAI-ARIA 对话框焦点陷阱模式，将焦点限制在容器元素内。监听文档上的焦点事件，如果从容器内部按 Tab 使焦点移出，则将焦点重定向回容器。同时处理 Tab 和 Shift+Tab 的循环。焦点在容器外时按下的 Tab 会交给页面处理，因此打开的非模态表面绝不会接管页面的焦点顺序。陷阱停用或卸载时，焦点会恢复到激活前聚焦的元素，除非焦点已被移到别处或从未进入陷阱（因此像组合框这类将焦点保留在触发器上的弹出层不受影响）。容器外的鼠标点击不会被拦截；请为此使用轻量关闭处理器。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "打开对话框/模态框时调用 `focusFirst()`，将焦点移入陷阱区域。"
      },
      {
        "guidance": true,
        "description": "提供 `onEscape` 回调，在按下 Escape 时关闭对话框。"
      },
      {
        "guidance": true,
        "description": "关闭时依赖内置的焦点恢复；仅当需要将焦点发送到先前聚焦元素以外的位置时，才添加自己的 `onHide` 焦点处理。"
      },
      {
        "guidance": false,
        "description": "用于工具提示或下拉菜单等非模态内容；这些内容需要轻量关闭，而不是焦点陷阱。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "焦点陷阱的配置对象。",
    "options.isActive": "焦点陷阱当前是否激活。",
    "options.onEscape": "在陷阱容器内按下 Escape 键时的回调。"
  },
  "returnDescriptions": {
    "containerRef": "要附加到应捕获焦点的容器元素的 ref。",
    "focusFirst": "将焦点移到容器内第一个可聚焦元素。"
  }
};
