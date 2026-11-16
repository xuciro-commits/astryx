// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useCollapsible',
  displayName: 'useCollapsible',
  group: 'Collapsible',
  keywords: ['collapsible', 'collapse', 'expand', 'toggle', 'accordion', 'disclosure', 'fold'],
  params: [
    {
      name: 'isCollapsible',
      type: "boolean | CollapsibleConfig",
      description: 'Enable collapsible behavior. true = self-managed (starts open). Pass config object for controlled mode or custom defaults.',
    },
    {
      name: 'value',
      type: 'string',
      description: 'Unique identifier within an CollapsibleGroup. When present and inside a group, state is managed by the group.',
    },
  ],
  returns: [
    {
      name: 'isEnabled',
      type: 'boolean',
      description: 'Whether collapsible behavior is active.',
    },
    {
      name: 'isOpen',
      type: 'boolean',
      description: 'Whether the content is currently expanded.',
    },
    {
      name: 'toggle',
      type: '() => void',
      description: 'Toggle open/closed state. Dispatches to group, controlled callback, or internal state.',
    },
  ],
  usage: {
    description: 'Reusable hook that encapsulates the collapsible state machine. Supports three modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), and uncontrolled (self-managed with defaultIsOpen). Used internally by Card and Section.',
    bestPractices: [
      {guidance: true, description: 'Use the hook directly when building custom collapsible components that need Astryx collapsible behavior without Collapsible wrapper.'},
      {guidance: true, description: 'For accordion behavior, wrap items in CollapsibleGroup and pass unique value props.'},
      {guidance: false, description: 'Pass local isOpen, defaultIsOpen, or onOpenChange expecting them to run for a value-bound group item; the group owns that state and notification path.'},
      {guidance: false, description: 'Implement your own open/close state when useCollapsible already provides it; the hook handles group coordination automatically.'},
    ],
  },
  relatedComponents: ['Collapsible', 'Card', 'Section'],
  relatedHooks: [],
  importPath: '@astryxdesign/core/Collapsible',
  category: 'interaction',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description: 'Encapsulates collapsible state machine. 3 modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), uncontrolled (self-managed w/ defaultIsOpen). Used internally by Card + Section.',
  paramDescriptions: {
    isCollapsible: 'enable collapsible behavior. true = self-managed (starts open). Pass config object for controlled mode / custom defaults.',
    value: 'unique id within CollapsibleGroup. When present + inside group, state managed by group.',
  },
  returnDescriptions: {
    isEnabled: 'whether collapsible behavior active.',
    isOpen: 'whether content currently expanded.',
    toggle: 'toggle open/closed. Dispatches to group, controlled callback / internal state.',
  },
  usage: {
    description: 'Encapsulates collapsible state machine. 3 modes: group-controlled (inside CollapsibleGroup), controlled (isOpen + onOpenChange), uncontrolled (self-managed w/ defaultIsOpen). Used internally by Card + Section.',
    bestPractices: [
      {guidance: true, description: 'Use directly when building custom collapsible components needing Astryx collapsible behavior w/o Collapsible wrapper.'},
      {guidance: true, description: 'For accordion behavior, wrap items in CollapsibleGroup + pass unique value props.'},
      {guidance: false, description: 'Pass local open state or callbacks expecting them to run for a value-bound group item; the group owns state + notifications.'},
      {guidance: false, description: 'Implement your own open/close state when useCollapsible already provides it; hook handles group coordination automatically.'},
    ],
  },
};

export const docsZh = {
  "name": "useCollapsible",
  "usage": {
    "description": "可复用的 Hook，封装了折叠状态机。支持三种模式：组控制（位于 CollapsibleGroup 内）、受控（isOpen + onOpenChange）和非受控（使用 defaultIsOpen 自行管理）。由 Card 和 Section 内部使用。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在构建自定义折叠组件、需要 Astryx 折叠行为但不使用 Collapsible 包装时，直接使用该 Hook。"
      },
      {
        "guidance": true,
        "description": "要实现手风琴行为，将各项包裹在 CollapsibleGroup 中，并传入唯一的 value 属性。"
      },
      {
        "guidance": false,
        "description": "不要传入局部 isOpen、defaultIsOpen 或 onOpenChange，并期望它们对绑定 value 的组项生效；该状态和通知路径由组管理。"
      },
      {
        "guidance": false,
        "description": "不要在使用 useCollapsible 已提供能力时自行实现展开/关闭状态；该 Hook 会自动处理组协调。"
      }
    ]
  },
  "paramDescriptions": {
    "isCollapsible": "启用折叠行为。true = 自行管理（初始为展开）。传入配置对象可使用受控模式或自定义默认值。",
    "value": "在 CollapsibleGroup 内的唯一标识符。当存在且位于组内时，状态由组管理。"
  },
  "returnDescriptions": {
    "isEnabled": "折叠行为是否处于活动状态。",
    "isOpen": "内容当前是否已展开。",
    "toggle": "切换展开/关闭状态。分派到组、受控回调或内部状态。"
  }
};
