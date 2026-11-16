// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useClickableContainer',
  displayName: 'useClickableContainer',
  keywords: ['click', 'container', 'card', 'pressable', 'interactive', 'nested', 'link', 'button', 'delegate'],
  params: [
    {
      name: 'options',
      type: 'UseClickableContainerOptions',
      description: 'Configuration object for the clickable container.',
      required: true,
    },
    {
      name: 'options.containerRef',
      type: 'RefObject<HTMLElement | null>',
      description: 'Ref to the outer container element.',
      required: true,
    },
    {
      name: 'options.interactiveRef',
      type: 'RefObject<HTMLElement | null>',
      description: 'Ref to the primary interactive element inside (link, button). If no onClick or href is provided, clicks are proxied to this element.',
      required: false,
    },
    {
      name: 'options.onClick',
      type: '(event: MouseEvent<HTMLElement>) => void',
      description: 'Click handler fired when the container surface (not a nested interactive element) is clicked.',
      required: false,
    },
    {
      name: 'options.href',
      type: 'string',
      description: 'Navigation URL. When provided, clicking the container navigates to this URL.',
      required: false,
    },
    {
      name: 'options.target',
      type: 'string',
      description: "Link target (e.g., '_blank'). Used with href for navigation behavior.",
      required: false,
    },
    {
      name: 'options.disabled',
      type: 'boolean',
      description: 'Whether the container is disabled.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'onClick',
      type: '(event: MouseEvent<HTMLElement>) => void',
      description: 'Click handler to attach to the container element.',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<HTMLElement>) => void',
      description: 'Mouse up handler to attach to the container (handles middle-click navigation for href).',
    },
    {
      name: 'onPointerDown',
      type: '(event: PointerEvent<HTMLElement>) => void',
      description: 'Pointer down handler to attach to the container. On a container that paints its press with usePressFeedback, it drops a touch press that starts on a nested interactive element, which does not activate the container. A mouse :active press paint is unchanged. Without it, the container keeps its click rules and its pressed state for every press.',
    },
  ],
  usage: {
    description:
      'Makes a container element clickable while preserving nested interactive element behavior. Solves the "nested interactive elements" problem: when a card is clickable but contains buttons/links, clicking those should NOT trigger the card\'s action. Detects interactive ancestors between the click target and the container, and ignores text selections. Supports href navigation (including middle-click and Ctrl/Cmd+click for new tabs).',
    bestPractices: [
      { guidance: true, description: 'Attach onClick, onMouseUp and onPointerDown to the container element: full click handling including middle-click, and no touch pressed state for a press on a nested control.' },
      { guidance: true, description: 'Use inside ClickableCard or SelectableCard for the standard card interaction pattern.' },
      { guidance: true, description: 'For a pressable surface without Card chrome, such as a quoted message that jumps on press, compose it yourself: this hook on the surface; `usePressFeedback()` and `interactionOverlayStyles.backgroundColor` (from `@astryxdesign/core/utils`) on the same element for the hover tint and touch press; a native `<button>` (or an `<a>` for a destination) inside `VisuallyHidden` as the named control and interactiveRef; and `focusOutlineStyles.focusWithin` (from `@astryxdesign/core/utils`) on the surface for the shared focus ring, the one ClickableCard draws. The `Core/Hooks/useClickableContainer` story has the full recipe.' },
      { guidance: false, description: 'Use when the entire container is a single interactive element; just use a <button> or <a> directly.' },
    ],
  },
  relatedComponents: ['ClickableCard', 'SelectableCard'],
  relatedHooks: ['useInputContainer'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Makes container element clickable while preserving nested interactive element behavior. Solves "nested interactive elements" problem: when card is clickable but contains buttons/links, clicking those must NOT trigger card\'s action. Detects interactive ancestors between click target + container, ignores text selections. Supports href navigation (incl. middle-click + Ctrl/Cmd+click for new tabs).',
  paramDescriptions: {
    options: 'config for clickable container.',
    'options.containerRef': 'ref to outer container element.',
    'options.interactiveRef': 'ref to primary interactive element inside (link, button). If no onClick / href provided, clicks proxied to this element.',
    'options.onClick': 'click handler fired when container surface (not nested interactive element) clicked.',
    'options.href': 'navigation URL. When provided, clicking container navigates to it.',
    'options.target': "link target (e.g. '_blank'). Used w/ href for navigation behavior.",
    'options.disabled': 'whether container disabled.',
  },
  returnDescriptions: {
    onClick: 'click handler for container element.',
    onMouseUp: 'mouse up handler for container (handles middle-click navigation for href).',
    onPointerDown: 'pointer down handler for container: drops usePressFeedback touch press starting on nested interactive element; mouse :active paint unchanged.',
  },
  usage: {
    description:
      'Makes container element clickable while preserving nested interactive element behavior. Solves "nested interactive elements" problem: when card is clickable but contains buttons/links, clicking those must NOT trigger card\'s action. Detects interactive ancestors between click target + container, ignores text selections. Supports href navigation (incl. middle-click + Ctrl/Cmd+click for new tabs).',
    bestPractices: [
      { guidance: true, description: 'Attach onClick + onMouseUp + onPointerDown to container element: full click handling incl. middle-click, no touch pressed state for press on nested control.' },
      { guidance: true, description: 'Use inside ClickableCard / SelectableCard for standard card interaction pattern.' },
      { guidance: true, description: 'Pressable surface w/o Card chrome (e.g. quoted message jumping on press): this hook on surface; usePressFeedback() + interactionOverlayStyles.backgroundColor on same element; native <button> (or <a> for destination) inside VisuallyHidden as named control + interactiveRef; focusOutlineStyles.focusWithin on surface for shared focus ring (the one ClickableCard draws). Full recipe: Core/Hooks/useClickableContainer story.' },
      { guidance: false, description: 'Use when entire container is single interactive element; just use <button> / <a> directly.' },
    ],
  },
};

export const docsZh = {
  "name": "useClickableContainer",
  "usage": {
    "description": "使容器元素可点击，同时保留嵌套交互元素的行为。解决“嵌套交互元素”问题：当卡片可点击但包含按钮/链接时，点击这些元素不应触发卡片的操作。检测点击目标与容器之间的交互祖先，并忽略文本选择。支持 href 导航（包括中键点击和 Ctrl/Cmd+点击以打开新标签页）。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将 `onClick`、`onMouseUp` 和 `onPointerDown` 挂到容器元素上：完整的点击处理（包括中键点击），并且按下嵌套控件时不会出现触摸按下状态。"
      },
      {
        "guidance": true,
        "description": "在 ClickableCard 或 SelectableCard 内使用，以实现标准的卡片交互模式。"
      },
      {
        "guidance": true,
        "description": "对于没有 Card 外观的可按压表面（例如按下即跳转的引用消息），请自行组合：在此表面上使用该 Hook；在同一元素上使用 `usePressFeedback()` 和 `interactionOverlayStyles.backgroundColor`（来自 `@astryxdesign/core/utils`）实现悬停色调和触摸按下；在 `VisuallyHidden` 内放置原生 `<button>`（或用于目标地址的 `<a>`）作为具名控件和 `interactiveRef`；并在表面上使用 `focusOutlineStyles.focusWithin`（来自 `@astryxdesign/core/utils`）实现共享焦点环，即 ClickableCard 绘制的那个。`Core/Hooks/useClickableContainer` story 包含完整配方。"
      },
      {
        "guidance": false,
        "description": "当整个容器就是一个交互元素时不要使用它；直接使用 <button> 或 <a> 即可。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "可点击容器的配置对象。",
    "options.containerRef": "指向外部容器元素的 ref。",
    "options.interactiveRef": "指向内部主要交互元素（链接、按钮）的 ref。如果未提供 `onClick` 或 `href`，点击会被代理到该元素。",
    "options.onClick": "点击容器表面（而非嵌套交互元素）时触发的点击处理器。",
    "options.href": "导航 URL。提供后，点击容器会导航到该 URL。",
    "options.target": "链接目标（例如 '_blank'）。与 `href` 一起用于导航行为。",
    "options.disabled": "容器是否被禁用。"
  },
  "returnDescriptions": {
    "onClick": "要挂到容器元素上的点击处理器。",
    "onMouseUp": "要挂到容器上的鼠标抬起处理器（处理 `href` 的中键点击导航）。",
    "onPointerDown": "要挂到容器上的指针按下处理器。对于使用 usePressFeedback 绘制按压效果的容器，它会丢弃从嵌套交互元素开始的触摸按下，因为该按下不会激活容器。鼠标 `:active` 按压绘制保持不变。不使用它时，容器会保留其点击规则以及每次按下的按下状态。"
  }
};
