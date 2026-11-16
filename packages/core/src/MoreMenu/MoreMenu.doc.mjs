// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger button',
    required: true,
    description:
      'Icon-only Button that provides the visible overflow-menu entry point.',
  },
  {
    name: 'Icon-resolved trigger icon',
    required: false,
    description:
      'Default semantic three-dot artwork resolved from the active Icon registry.',
  },
  {
    name: 'Caller-rendered trigger content',
    required: false,
    description:
      'Arbitrary React content supplied directly as the trigger icon override.',
  },
  {
    name: 'Menu surface',
    required: true,
    description:
      'DropdownMenu panel that also carries MoreMenu’s current public target.',
  },
  {
    name: 'Pointer action row',
    required: false,
    description:
      'Action or nested-action trigger row rendered by DropdownMenu in the anchored presentation.',
  },
  {
    name: 'Touch action row',
    required: false,
    description:
      'ListItem button rendered by DropdownMenu in the BottomSheet presentation.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'MoreMenu',
  displayName: 'More Menu',
  category: 'Action',
  keywords: ["moremenu","overflow","kebab","dotmenu","threedot","ellipsis","dropdown","contextmenu","actionmenu"],
  props: [
    {
      name: 'items',
      type: 'DropdownMenuOption[]',
      description:
        'Menu items: data array of actions, dividers, and sections. Same type as DropdownMenu items prop.',
      required: true,
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible label for the trigger button (aria-label) and tooltip text.',
      default: "'More options'",
    },
    {
      name: 'variant',
      type: 'ButtonVariant',
      description: 'Visual style variant of the trigger button.',
      default: "'ghost'",
    },
    {
      name: 'size',
      type: 'ButtonSize',
      description: 'Size of the trigger button.',
      default: "'md'",
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description:
        'Override the default three-dot icon. Accepts any ReactNode.',
      slotElements: [{__element: 'Icon', props: {icon: 'check', size: 'sm'}}],
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the menu trigger is disabled.',
      default: 'false',
    },
    {
      name: 'placement',
      type: "'above' | 'below' | 'start' | 'end'",
      description:
        "Position of the menu relative to the trigger. Logical: start/end resolve against the menu's own inherited direction (RTL mirrors).",
      default: "'below'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description:
        "Alignment along the placement axis. Use 'end' to align the menu with the trigger's trailing edge, which is usually what an overflow menu wants.",
      default: "'start'",
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description: 'Presentation policy forwarded to DropdownMenu. `adaptive` keeps the anchored popover on pointer-based layouts and uses a BottomSheet on a compact touch screen: a coarse primary pointer, and a viewport narrower than the theme `md` breakpoint (768px by default) or shorter than 500px. Omitted, the menu is the anchored popover, and under a finger or a pen, on every device, its trigger opens as it is pressed (inside a scroll view, after the 150 ms content-touch delay), and the opening finger picks after moving 10 px. Pass \'popover\' to keep the pointer behavior on every device, a 500 ms hold included.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the menu opens or closes.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.',
    },
  ],
  playground: {
    defaults: {
      items: [
        {label: 'Edit', value: 'edit'},
        {label: 'Duplicate', value: 'duplicate'},
        {label: 'Delete', value: 'delete'},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-more-menu'},
    ],
  },
  usage: {
    anatomy,
    description:
      'MoreMenu is a three-dot button that opens a list of actions. Use it for secondary actions that don\'t need to be always visible, like in table rows, card headers, or toolbars. Host `data-*` attributes reach the trigger button; its accessible name, `id`, and menu disclosure attributes stay component-owned.',
    bestPractices: [
      { guidance: true, description: 'Use for overflow or secondary actions; keep primary actions visible outside the menu.' },
      { guidance: true, description: 'Use dividers or sections to group related actions when the menu has many items.' },
      { guidance: true, description: 'Use `presentation="adaptive"` when the visible overflow trigger should open a thumb-reachable BottomSheet on compact touch devices.' },
      { guidance: false, description: 'Hide primary actions inside a MoreMenu; they should be directly visible.' },
    ],
  },
};
/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docsZh = {
  "name": "MoreMenu",
  "displayName": "More Menu",
  "props": [
    {
      "name": "items",
      "type": "DropdownMenuOption[]",
      "description": "菜单项：由操作、分隔线和分区组成的数据数组。类型与 DropdownMenu 的 items 属性相同。",
      "required": true
    },
    {
      "name": "label",
      "type": "string",
      "description": "触发按钮的可访问标签（aria-label）和工具提示文本。",
      "default": "'More options'"
    },
    {
      "name": "variant",
      "type": "ButtonVariant",
      "description": "触发按钮的视觉样式变体。",
      "default": "'ghost'"
    },
    {
      "name": "size",
      "type": "ButtonSize",
      "description": "触发按钮的尺寸。",
      "default": "'md'"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "覆盖默认的三点图标。接受任意 ReactNode。"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "菜单触发器是否禁用。",
      "default": "false"
    },
    {
      "name": "placement",
      "type": "'above' | 'below' | 'start' | 'end'",
      "description": "菜单相对于触发器的位置。逻辑值：start/end 根据菜单自身继承的方向解析（RTL 下镜像）。",
      "default": "'below'"
    },
    {
      "name": "alignment",
      "type": "'start' | 'center' | 'end'",
      "description": "沿放置轴的对齐方式。使用 'end' 使菜单与触发器的尾边缘对齐，这通常是溢出菜单所需的对齐方式。",
      "default": "'start'"
    },
    {
      "name": "presentation",
      "type": "'popover' | 'bottom-sheet' | 'adaptive'",
      "description": "转发给 DropdownMenu 的呈现策略。`adaptive` 在基于指针的布局中保留锚定弹出层，在紧凑触摸屏上使用 BottomSheet：主指针为粗略指针，且视口窄于主题 `md` 断点（默认 768px）或高度小于 500px。省略时，菜单为锚定弹出层；在手指或触控笔下，无论何种设备，其触发器一经按下即打开（在滚动视图内为 150 ms 内容触摸延迟之后），打开的手指移动 10 px 后即可选取。传入 'popover' 可在所有设备上保留指针行为，包括 500 ms 长按。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
    }
  ],
  "theming": {
    "targets": [
      {
        "className": "astryx-more-menu"
      }
    ]
  },
  "usage": {
    "description": "MoreMenu 是一个打开操作列表的三点按钮。用于无需始终可见的次要操作，例如表格行、卡片标题或工具栏中的操作。宿主传入的 `data-*` 属性会传到触发按钮；其可访问名称、`id` 和菜单展开属性仍由组件管理。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "用于溢出或次要操作；主要操作应保持在菜单外可见。"
      },
      {
        "guidance": true,
        "description": "菜单项较多时，使用分隔线或分区对相关操作进行分组。"
      },
      {
        "guidance": true,
        "description": "当可见的溢出触发器应在紧凑触摸设备上打开便于拇指操作的 BottomSheet 时，使用 `presentation=\"adaptive\"`。"
      },
      {
        "guidance": false,
        "description": "将主要操作隐藏在 MoreMenu 内；它们应直接可见。"
      }
    ],
    "anatomy": [
      {
        "name": "触发按钮",
        "required": true,
        "description": "提供可见溢出菜单入口的纯图标 Button。"
      },
      {
        "name": "图标解析的触发器图标",
        "required": false,
        "description": "从活动 Icon 注册表解析的默认语义三点图标。"
      },
      {
        "name": "调用方渲染的触发器内容",
        "required": false,
        "description": "直接作为触发器图标覆盖提供的任意 React 内容。"
      },
      {
        "name": "菜单表面",
        "required": true,
        "description": "同时承载 MoreMenu 当前公共目标的 DropdownMenu 面板。"
      },
      {
        "name": "指针操作行",
        "required": false,
        "description": "在锚定呈现中由 DropdownMenu 渲染的操作行或嵌套操作触发行。"
      },
      {
        "name": "触摸操作行",
        "required": false,
        "description": "在 BottomSheet 呈现中由 DropdownMenu 渲染的 ListItem 按钮。"
      }
    ]
  },
  "propDescriptions": {
    "items": "菜单项：由操作、分隔线和分区组成的数据数组。类型与 DropdownMenu 的 items 属性相同。",
    "label": "触发按钮的可访问标签（aria-label）和工具提示文本。",
    "variant": "触发按钮的视觉样式变体。",
    "size": "触发按钮的尺寸。",
    "icon": "覆盖默认的三点图标。接受任意 ReactNode。",
    "isDisabled": "菜单触发器是否禁用。",
    "placement": "菜单相对于触发器的位置。逻辑值：start/end 根据菜单自身继承的方向解析（RTL 下镜像）。",
    "alignment": "沿放置轴的对齐方式。使用 'end' 使菜单与触发器的尾边缘对齐，这通常是溢出菜单所需的对齐方式。",
    "presentation": "转发给 DropdownMenu 的呈现策略。`adaptive` 在基于指针的布局中保留锚定弹出层，在紧凑触摸屏上使用 BottomSheet：主指针为粗略指针，且视口窄于主题 `md` 断点（默认 768px）或高度小于 500px。省略时，菜单为锚定弹出层；在手指或触控笔下，无论何种设备，其触发器一经按下即打开（在滚动视图内为 150 ms 内容触摸延迟之后），打开的手指移动 10 px 后即可选取。传入 'popover' 可在所有设备上保留指针行为，包括 500 ms 长按。",
    "onOpenChange": "菜单打开或关闭时触发的回调。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  }
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Overflow menu w/ three-dot icon trigger. Convenience wrapper composing icon-only Button w/ dropdown menu, eliminating boilerplate for state management, positioning, accessibility.',
  usage: {
    anatomy,
    description:
      'MoreMenu is a three-dot button that opens a list of actions. Use it for secondary actions that don\'t need to be always visible, like in table rows, card headers, or toolbars. Host data-* attrs reach the trigger button; name, id, disclosure attrs stay owned.',
    bestPractices: [
      { guidance: true, description: 'Use for overflow or secondary actions; keep primary actions visible outside the menu.' },
      { guidance: true, description: 'Use dividers or sections to group related actions when the menu has many items.' },
      { guidance: true, description: 'Use `presentation="adaptive"` when the visible overflow trigger should open a thumb-reachable BottomSheet on compact touch devices.' },
      { guidance: false, description: 'Hide primary actions inside a MoreMenu; they should be directly visible.' },
    ],
  },
  propDescriptions: {
    items: 'Menu items (actions, dividers, sections). Same type as DropdownMenu items.',
    label: 'Accessible label (aria-label) + tooltip text.',
    variant: 'Trigger button visual style variant.',
    size: 'Trigger button size.',
    icon: 'Override default three-dot icon. Accepts any ReactNode.',
    isDisabled: 'Whether menu trigger disabled.',
    placement: 'Menu position relative to trigger. Logical (RTL mirrors).',
    alignment:
      "Alignment along the placement axis. 'end' aligns with the trigger's trailing edge.",
    presentation:
      'Popover, BottomSheet, or adaptive compact-touch presentation.',
    xstyle:
      'StyleX styles for layout customization (margins, positioning, sizing). Must be stylex.create() value.',
  },
};
