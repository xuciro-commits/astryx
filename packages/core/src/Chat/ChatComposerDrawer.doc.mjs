// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ChatComposerDrawer',
  subComponentOf: 'Chat',
  displayName: 'Chat Composer Drawer',
  isHiddenFromOverview: true,
  description: "Collapsible drawer panel that sits above the chat input inside ChatComposer. Pass it to the composer's `drawer` slot to show attachments, context chips, or any supplementary content. When `count` is provided the drawer gains a collapse toggle: collapsed state shows the default Badge and label or caller-provided `collapsedSummary`, while expanded state shows all children.",
  usage: {
    description:
      'Use ChatComposerDrawer in the ChatComposer drawer slot for supplementary content such as attachments, context chips, or previews. Provide count only when people should be able to collapse that content.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Give label a concrete plural noun such as "Attachments" so the expand and collapse actions have a useful accessible name.',
      },
      {
        guidance: true,
        description:
          'Use controlled isCollapsed with onCollapsedChange when another part of the page owns drawer state; otherwise use defaultIsCollapsed.',
      },
      {
        guidance: false,
        description:
          'Put primary composer actions in the drawer; use ChatComposer footer or send-action slots so those controls remain available when the drawer is collapsed.',
      },
    ],
    anatomy: [
      {
        name: 'Root surface',
        required: true,
        description: 'The drawer surface that composes above the ChatComposer body.',
      },
      {
        name: 'Disclosure toggle',
        required: false,
        description: 'The keyboard- and pointer-operable collapse control rendered when count is provided.',
      },
      {
        name: 'Collapsed summary',
        required: false,
        description: 'The default count Badge and label, or caller-provided visual content, presented while the drawer is collapsed.',
      },
      {
        name: 'Content area',
        required: true,
        description: 'The caller-provided supplementary content; collapsed descendants are unavailable to keyboard and assistive technology.',
      },
    ],
  },
  theming: {
    targets: [
      {
        className: 'astryx-chat-composer-drawer',
        visualProps: ['collapsed'],
      },
    ],
  },
  playground: {
    wrapper: {component: 'Stack', props: {width: 480}},
    defaults: {
      count: 3,
      label: 'Attachments',
      children: [
        {__element: 'Token', props: {label: 'design-spec.pdf'}},
        {__element: 'Token', props: {label: 'api-schema.json'}},
        {__element: 'Token', props: {label: 'screenshot.png'}},
      ],
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Content to render inside the drawer: tokens, chips, previews, or any React elements.',
      required: true,
    },
    {
      name: 'count',
      type: 'number',
      description: 'Total item count shown in the collapsed badge. When provided, the drawer gains a collapse/expand toggle.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Label shown next to the count in the default collapsed summary and used to name the expand/collapse action.',
      default: "'Items'",
    },
    {
      name: 'collapsedSummary',
      type: 'ReactNode',
      description: 'Visual content for the complete Collapsed summary anatomy part. When count enables collapse, this replaces the default neutral Badge and label while the component retains disclosure behavior and accessible naming.',
    },
    {
      name: 'isCollapsed',
      type: 'boolean',
      description: 'Controlled collapsed state. Use with `onCollapsedChange` for external control.',
    },
    {
      name: 'defaultIsCollapsed',
      type: 'boolean',
      description: 'Initial collapsed state for uncontrolled usage.',
      default: 'false',
    },
    {
      name: 'onCollapsedChange',
      type: '(isCollapsed: boolean) => void',
      description: 'Callback fired when the user toggles the drawer.',
    },
  ],
};

export const docsZh = {
  "name": "ChatComposerDrawer",
  "isHiddenFromOverview": true,
  "displayName": "Chat Composer Drawer",
  "description": "位于 ChatComposer 内聊天输入框上方的可折叠抽屉面板。将它传给撰写器的 `drawer` 插槽，以显示附件、上下文标签或任何补充内容。提供 `count` 后，抽屉会获得折叠开关：折叠状态显示默认的 Badge 和标签或调用方提供的 `collapsedSummary`，展开状态显示所有子元素。",
  "propDescriptions": {
    "children": "在抽屉内渲染的内容：令牌、标签、预览或任何 React 元素。",
    "count": "折叠徽标中显示的条目总数。提供后，抽屉会获得折叠/展开开关。",
    "label": "默认折叠摘要中显示在计数旁的标签，也用于命名展开/折叠操作。",
    "collapsedSummary": "用于完整的 Collapsed summary 解剖结构部件的可视内容。当 count 启用折叠时，它会替换默认的中性 Badge 和标签，同时组件保留展开行为和可访问命名。",
    "isCollapsed": "受控的折叠状态。与 `onCollapsedChange` 搭配用于外部控制。",
    "defaultIsCollapsed": "非受控使用的初始折叠状态。",
    "onCollapsedChange": "用户切换抽屉时触发的回调。"
  },
  "usage": {
    "description": "在 ChatComposer 的 drawer 插槽中使用 ChatComposerDrawer 显示补充内容，例如附件、上下文标签或预览。仅当用户应能折叠该内容时才提供 count。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "为 label 提供具体的复数名词，例如 \"Attachments\"，使展开和折叠操作具有有用的可访问名称。"
      },
      {
        "guidance": true,
        "description": "当页面其他部分拥有抽屉状态时，使用受控的 isCollapsed 搭配 onCollapsedChange；否则使用 defaultIsCollapsed。"
      },
      {
        "guidance": false,
        "description": "将撰写器的主要操作放在抽屉中；使用 ChatComposer 的 footer 或 send-action 插槽，使这些控件在抽屉折叠时仍然可用。"
      }
    ],
    "anatomy": [
      {
        "name": "根表面",
        "required": true,
        "description": "在 ChatComposer 主体上方组合的抽屉表面。"
      },
      {
        "name": "折叠开关",
        "required": false,
        "description": "提供 count 时渲染的可用键盘和指针操作的折叠控件。"
      },
      {
        "name": "折叠摘要",
        "required": false,
        "description": "抽屉折叠时呈现的默认计数 Badge 和标签，或调用方提供的可视内容。"
      },
      {
        "name": "内容区域",
        "required": true,
        "description": "调用方提供的补充内容；折叠时，其后代对键盘和辅助技术不可用。"
      }
    ]
  }
};

export const docsDense = {
  name: 'ChatComposerDrawer',
  isHiddenFromOverview: true,
  displayName: 'Chat Composer Drawer',
  description: 'collapsible drawer above chat input; pass to composer `drawer` slot for attachments, context chips, previews. `count` enables collapse toggle',
  propDescriptions: {
    children: 'drawer content: tokens, chips, previews, any React elements',
    count: 'total count for collapsed summary; enables collapse/expand toggle',
    label: 'collapsed label next to the default count badge; names the disclosure action',
    collapsedSummary: 'custom visual content replacing the complete Collapsed summary anatomy; requires count; presentation-only; default keeps Badge + label',
    isCollapsed: 'controlled collapsed state',
    defaultIsCollapsed: 'initial collapsed state (uncontrolled)',
    onCollapsedChange: 'callback on collapse toggle',
  },
};
