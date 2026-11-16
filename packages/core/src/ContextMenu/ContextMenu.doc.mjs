// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger area',
    required: true,
    description:
      'Caller-provided region that accepts right-click, keyboard context-menu, and long-press input.',
  },
  {
    name: 'Pointer menu surface',
    required: false,
    description:
      'Cursor-positioned menu panel used by the pointer presentation.',
  },
  {
    name: 'Pointer action row',
    required: false,
    description:
      'DropdownMenu-owned action, selectable option, or submenu row in the pointer presentation.',
  },
  {
    name: 'Touch sheet frame',
    required: false,
    description:
      'BottomSheet panel, content area, handle, and optional scrim that host touch actions.',
  },
  {
    name: 'Touch menu surface',
    required: false,
    description:
      'ContextMenu-owned content panel rendered inside the touch sheet frame.',
  },
  {
    name: 'Touch action list',
    required: false,
    description: 'Spacious List that groups data-driven touch actions.',
  },
  {
    name: 'Touch action row',
    required: false,
    description:
      'ListItem button used for a data-driven action or drill-in entry in the touch presentation.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ContextMenu',
  displayName: 'Context Menu',
  group: 'ContextMenu',
  category: 'Action',
  isHiddenFromOverview: true,
  keywords: [
    'contextmenu',
    'right-click',
    'menu',
    'popover',
    'actions',
    'context',
  ],
  theming: {
    targets: [{className: 'astryx-context-menu'}],
    vars: [
      {
        name: '--_dropdown-menu-radius',
        description: 'Border radius of the menu popup',
        default: 'var(--radius-container)',
        private: true,
      },
      {
        name: '--_dropdown-menu-padding',
        description: 'Inner padding of the menu popup',
        default: 'var(--spacing-1)',
        private: true,
      },
    ],
    derived: [
      {property: 'borderRadius', vars: ['--_dropdown-menu-radius']},
      {property: 'padding', vars: ['--_dropdown-menu-padding']},
    ],
  },
  description:
    'A context menu that appears on right-click at the cursor position. Wraps trigger content as children.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'The trigger area: right-click on this content to open the menu.',
      required: true,
    },
    {
      name: 'items',
      type: 'ContextMenuOption[]',
      description:
        'Data-driven menu entries. Pass exactly one of `items` or `menuContent`. Each entry is one of: an action item `{label, onClick?, icon?, isDisabled?, variant?, items?}` (nested `items` open a flyout in popover presentation and drill into a new view in bottom-sheet presentation; variant `"destructive"` renders it in the error color), a divider `{type: "divider"}`, or a section `{type: "section", title?, items: [...action items]}`.',
    },
    {
      name: 'menuContent',
      type: 'ReactNode',
      description:
        'Custom JSX menu content for compound mode. Pass exactly one of `menuContent` or `items`.',
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description: 'Custom menu width.',
      default: "'160px'",
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size of menu items: controls padding density.',
      default: "'md'",
    },
    {
      name: 'label',
      type: 'string',
      description:
        'Accessible name for the menu surface, announced when it opens.',
      default: "'Context menu'",
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the menu opens or closes.',
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        'Presentation policy. `popover` opens at the pointer position, `bottom-sheet` always uses an action sheet, and `adaptive` uses the BottomSheet on a compact touch screen: a coarse primary pointer, and a viewport narrower than the theme `md` breakpoint (768px by default) or shorter than 500px.',
      default: "'popover'",
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description:
        'When true, right-click shows the native browser context menu instead.',
      default: 'false',
    },
    {
      name: 'triggerXstyle',
      type: 'StyleXStyles | StyleXStyles[]',
      description:
        'Styles applied to the trigger wrapper. Accepts `stylex.create()` values, not inline style objects.',
    },
    {
      name: 'triggerAs',
      type: "'div' | 'span'",
      description:
        "The element the trigger wrapper renders as. 'div' is a block; 'span' an inline wrapper, so a reference inside prose can own a context menu without breaking the text flow.",
      default: "'div'",
    },
  ],
  components: [{name: 'ContextMenuItem'}],
  usage: {
    anatomy,
    description:
      'A right-click context menu that appears at the cursor position. Use to provide contextual actions for specific elements or regions without cluttering the UI with visible buttons.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented; users expect quick access to contextual actions.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'Use `presentation="adaptive"` when right-click should remain cursor-positioned on desktop while long-press opens a reachable BottomSheet on compact touch devices.',
      },
      {
        guidance: true,
        description:
          'Ensure all context menu actions are also accessible via other UI elements for keyboard-only users.',
      },
      {
        guidance: true,
        description:
          'Keep a visible MoreMenu or equivalent trigger for important mobile actions; long-press must not be the only route.',
      },
      {
        guidance: false,
        description:
          'Use a ContextMenu as the only way to access important actions; not all users know to right-click.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
  playground: {
    defaults: {
      children: {
        __element: 'Card',
        props: {padding: 6},
        children: {
          __element: 'Text',
          props: {color: 'secondary'},
          children: 'Right-click this area',
        },
      },
      items: [
        {label: 'Edit'},
        {label: 'Duplicate'},
        {type: 'divider'},
        {label: 'Delete'},
      ],
    },
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "在光标位置出现的右键上下文菜单。用于为特定元素或区域提供上下文操作，而无需用可见按钮弄乱界面。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "菜单项应简洁且以操作为导向；用户期望快速访问上下文操作。"
      },
      {
        "guidance": true,
        "description": "当菜单项较多时，使用分区和分隔线对相关操作分组。"
      },
      {
        "guidance": true,
        "description": "当桌面端右键应保持光标定位、而紧凑触摸设备上长按应打开易于触达的 BottomSheet 时，使用 `presentation=\"adaptive\"`。"
      },
      {
        "guidance": true,
        "description": "确保仅使用键盘的用户也能通过其他 UI 元素访问所有上下文菜单操作。"
      },
      {
        "guidance": true,
        "description": "为重要的移动端操作保留可见的 MoreMenu 或等效触发器；长按不能是唯一入口。"
      },
      {
        "guidance": false,
        "description": "不要将 ContextMenu 作为访问重要操作的唯一方式；并非所有用户都知道要右键点击。"
      },
      {
        "guidance": false,
        "description": "不要在单个菜单中放置超过 10–12 个菜单项而不将其分组到各分区。"
      }
    ],
    "anatomy": [
      {
        "name": "触发区域",
        "required": true,
        "description": "调用方提供的区域，接受右键、键盘上下文菜单键和长按输入。"
      },
      {
        "name": "指针菜单表面",
        "required": false,
        "description": "指针呈现方式使用的、定位在光标处的菜单面板。"
      },
      {
        "name": "指针操作行",
        "required": false,
        "description": "指针呈现方式中由 DropdownMenu 拥有的操作、可选项或子菜单行。"
      },
      {
        "name": "触摸面板框架",
        "required": false,
        "description": "承载触摸操作的 BottomSheet 面板、内容区、把手和可选遮罩。"
      },
      {
        "name": "触摸菜单表面",
        "required": false,
        "description": "渲染在触摸面板框架内、由 ContextMenu 拥有的内容面板。"
      },
      {
        "name": "触摸操作列表",
        "required": false,
        "description": "对数据驱动的触摸操作进行分组、间距宽松的 List。"
      },
      {
        "name": "触摸操作行",
        "required": false,
        "description": "触摸呈现方式中用于数据驱动操作或下钻入口的 ListItem 按钮。"
      }
    ]
  },
  "name": "ContextMenu",
  "displayName": "Context Menu",
  "description": "在右键点击处、光标位置出现的上下文菜单。将触发内容包裹为 children。",
  "propDescriptions": {
    "children": "触发区域：在此内容上右键点击以打开菜单。",
    "items": "数据驱动的菜单条目。`items` 或 `menuContent` 必须且只能传入一个。每个条目为以下之一：操作条目 `{label, onClick?, icon?, isDisabled?, variant?, items?}`（嵌套 `items` 在 popover 呈现方式中打开飞出菜单，在 bottom-sheet 呈现方式中下钻到新视图；`variant` 为 `\"destructive\"` 时以错误色渲染）、分隔线 `{type: \"divider\"}`，或分区 `{type: \"section\", title?, items: [...action items]}`。",
    "menuContent": "复合模式下自定义的 JSX 菜单内容。`menuContent` 或 `items` 必须且只能传入一个。",
    "menuWidth": "自定义菜单宽度。",
    "size": "菜单项的尺寸：控制内边距密度。",
    "label": "菜单表面的可访问名称，打开时会被朗读。",
    "onOpenChange": "菜单打开或关闭时触发的回调。",
    "presentation": "呈现策略。`popover` 在指针位置打开，`bottom-sheet` 始终使用操作面板，`adaptive` 在紧凑触摸屏幕上使用 BottomSheet：主指针为粗指针，且视口宽度小于主题 `md` 断点（默认 768px）或高度小于 500px。",
    "isDisabled": "为 true 时，右键点击改为显示浏览器原生上下文菜单。",
    "triggerXstyle": "应用于触发包裹层的样式。接受 `stylex.create()` 的值，而不是内联样式对象。",
    "triggerAs": "触发包裹层渲染为的元素。`div` 为块级元素，`span` 为内联包裹层，因此正文中的引用可以拥有上下文菜单而不破坏文本流。"
  },
  "components": [
    {
      "name": "ContextMenuItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'right-click context menu at cursor position',
  usage: {
    anatomy,
    description:
      'A right-click context menu that appears at the cursor position. Use to provide contextual actions for specific elements or regions.',
    bestPractices: [
      {guidance: true, description: 'Keep items concise and action-oriented.'},
      {
        guidance: true,
        description: 'Group related actions with sections and dividers.',
      },
      {
        guidance: true,
        description:
          'Use adaptive presentation for cursor popover on desktop and BottomSheet on compact touch.',
      },
      {
        guidance: true,
        description:
          'Ensure actions are also accessible via other UI elements.',
      },
      {
        guidance: true,
        description: 'Keep a visible mobile entry point for important actions.',
      },
      {
        guidance: false,
        description: 'Use as the only way to access important actions.',
      },
      {
        guidance: false,
        description: 'Place more than 10–12 items without grouping.',
      },
    ],
  },
};
