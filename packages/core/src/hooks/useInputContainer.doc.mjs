// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useInputContainer',
  displayName: 'useInputContainer',
  keywords: ['input', 'container', 'focus', 'delegate', 'wrapper', 'text', 'textarea', 'click', 'icon', 'padding'],
  params: [
    {
      name: 'options',
      type: 'UseInputContainerOptions',
      description: 'Configuration object for the input container.',
      required: true,
    },
    {
      name: 'options.containerRef',
      type: 'RefObject<HTMLElement | null>',
      description: 'Ref to the outer container/wrapper element.',
      required: true,
    },
    {
      name: 'options.inputRef',
      type: 'RefObject<HTMLInputElement | HTMLTextAreaElement | HTMLElement | null>',
      description: 'Ref to the inner input or textarea element.',
      required: true,
    },
    {
      name: 'options.disabled',
      type: 'boolean',
      description: 'Whether the input is disabled.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'onClick',
      type: '(event: MouseEvent<HTMLElement>) => void',
      description: 'Click handler to attach to the container wrapper.',
    },
    {
      name: 'onMouseUp',
      type: '(event: MouseEvent<HTMLElement>) => void',
      description: 'Mouse up handler to attach to the container wrapper.',
    },
  ],
  usage: {
    description:
      'Makes an input container wrapper clickable, delegating focus to the inner input/textarea when the user clicks non-interactive areas (icons, padding, status indicators). Built on top of useClickableContainer, so nested interactive elements (clear buttons, calendar toggles, links) are handled safely; clicking them does NOT steal focus from the input. Automatically detects input type: text-like inputs receive .focus(), while other types (checkbox, radio, file) receive .click().',
    bestPractices: [
      { guidance: true, description: 'Use inside input wrapper components (TextInput, NumberInput, TimeInput, TextArea) to make the full container area clickable.' },
      { guidance: true, description: 'Attach both onClick and onMouseUp to the wrapper div for full interaction handling.' },
      { guidance: false, description: 'Use on bare inputs without a wrapper; there is no benefit if the input already fills the full clickable area.' },
    ],
  },
  relatedComponents: ['TextInput', 'NumberInput', 'TimeInput', 'TextArea'],
  relatedHooks: ['useClickableContainer'],
  importPath: '@astryxdesign/core/hooks',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Makes input container wrapper clickable, delegating focus to inner input/textarea when user clicks non-interactive areas (icons, padding, status indicators). Built on useClickableContainer, so nested interactive elements (clear buttons, calendar toggles, links) handled safely; clicking them does NOT steal focus from input. Automatically detects input type: text-like inputs receive .focus(), other types (checkbox, radio, file) receive .click().',
  paramDescriptions: {
    options: 'config for input container.',
    'options.containerRef': 'ref to outer container/wrapper element.',
    'options.inputRef': 'ref to inner input / textarea element.',
    'options.disabled': 'whether input disabled.',
  },
  returnDescriptions: {
    onClick: 'click handler for container wrapper.',
    onMouseUp: 'mouse up handler for container wrapper.',
  },
  usage: {
    description:
      'Makes input container wrapper clickable, delegating focus to inner input/textarea when user clicks non-interactive areas (icons, padding, status indicators). Built on useClickableContainer, so nested interactive elements (clear buttons, calendar toggles, links) handled safely; clicking them does NOT steal focus from input. Automatically detects input type: text-like inputs receive .focus(), other types (checkbox, radio, file) receive .click().',
    bestPractices: [
      { guidance: true, description: 'Use inside input wrapper components (TextInput, NumberInput, TimeInput, TextArea) to make full container area clickable.' },
      { guidance: true, description: 'Attach both onClick + onMouseUp to wrapper div for full interaction handling.' },
      { guidance: false, description: 'Use on bare inputs w/o wrapper; no benefit if input already fills full clickable area.' },
    ],
  },
};

export const docsZh = {
  "name": "useInputContainer",
  "usage": {
    "description": "使输入框容器包装元素可点击，当用户点击非交互区域（图标、内边距、状态指示器）时，将焦点委托给内部 input/textarea。构建在 useClickableContainer 之上，因此嵌套的交互式元素（清除按钮、日历切换按钮、链接）会被安全处理；点击它们不会从输入框抢走焦点。自动检测输入类型：类文本输入框接收 .focus()，其他类型（checkbox、radio、file）接收 .click()。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在输入框包装组件（TextInput、NumberInput、TimeInput、TextArea）内使用，使整个容器区域可点击。"
      },
      {
        "guidance": true,
        "description": "将 onClick 和 onMouseUp 都附加到包装 div，以获得完整的交互处理。"
      },
      {
        "guidance": false,
        "description": "不要在没有包装层的裸输入框上使用；如果输入框已经填满整个可点击区域，则没有收益。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "输入框容器的配置对象。",
    "options.containerRef": "指向外部容器/包装元素的 ref。",
    "options.inputRef": "指向内部 input 或 textarea 元素的 ref。",
    "options.disabled": "输入框是否禁用。"
  },
  "returnDescriptions": {
    "onClick": "要附加到容器包装层的点击处理函数。",
    "onMouseUp": "要附加到容器包装层的鼠标抬起处理函数。"
  }
};
