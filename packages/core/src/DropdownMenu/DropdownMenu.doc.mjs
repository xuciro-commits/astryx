// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Trigger button',
    required: true,
    description: 'Button that opens and closes the selected menu presentation.',
  },
  {
    name: 'Trigger indicator icon',
    required: false,
    description:
      'Optional trailing chevron shown by a labeled trigger when hasChevron is enabled.',
  },
  {
    name: 'Pointer menu surface',
    required: false,
    description:
      'Anchored top-level or nested menu panel used by the pointer presentation.',
  },
  {
    name: 'Pointer action row',
    required: false,
    description:
      'Action, selectable option, or submenu trigger row in an anchored menu.',
  },
  {
    name: 'Icon-rendered item icon',
    required: false,
    description:
      'Optional semantic or component icon rendered through Icon at the start of an action row.',
  },
  {
    name: 'Caller-rendered item start content',
    required: false,
    description:
      'Optional arbitrary React content rendered directly at the start of an action row.',
  },
  {
    name: 'Checkbox indicator',
    required: false,
    description:
      'Decorative shared checkbox indicator for a checkbox action row.',
  },
  {
    name: 'Radio indicator',
    required: false,
    description:
      'Decorative shared radio indicator with an additional menu-owned target.',
  },
  {
    name: 'Pointer section heading',
    required: false,
    description:
      'Heading that labels a group of rows in an anchored menu: a data-driven section or a compound DropdownMenuGroup.',
  },
  {
    name: 'Pointer divider',
    required: false,
    description: 'Divider between groups in an anchored menu.',
  },
  {
    name: 'Pointer submenu indicator icon',
    required: false,
    description:
      'Trailing chevron that identifies an action row as a nested flyout trigger.',
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
      'Menu-owned content panel rendered inside the touch sheet frame.',
  },
  {
    name: 'Touch heading',
    required: false,
    description:
      'Current action-sheet title, updated when a nested action view is opened.',
  },
  {
    name: 'Touch action list',
    required: false,
    description: 'Spacious List that groups actions in the touch presentation.',
  },
  {
    name: 'Touch action row',
    required: false,
    description:
      'ListItem button used for an action or drill-in entry in the touch presentation.',
  },
  {
    name: 'Touch divider',
    required: false,
    description: 'Divider between action groups in the touch presentation.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenu',
  displayName: 'Dropdown Menu',
  group: 'DropdownMenu',
  category: 'Action',
  keywords: [
    'dropdown',
    'menu',
    'popover',
    'select',
    'actions',
    'contextmenu',
    'overflow',
    'kebab',
    'menubutton',
  ],
  playground: {
    // `items` is required; without seeded entries the properties-tab preview
    // renders an empty trigger button. Provide a few actions so the preview
    // is meaningful.
    defaults: {
      button: {label: 'Actions'},
      presentation: 'popover',
      items: [
        {label: 'Edit project', icon: 'wrench'},
        {label: 'Duplicate project', icon: 'copy'},
        {label: 'Share project', icon: 'externalLink'},
        {label: 'Archive project', icon: 'stop'},
      ],
    },
  },
  theming: {
    targets: [
      {
        className: 'astryx-dropdown-menu',
        visualProps: ['presentation'],
      },
      {
        className: 'astryx-dropdown-menu-item',
        visualProps: ['size', 'variant'],
      },
      {
        className: 'astryx-dropdown-menu-radio',
        visualProps: ['size'],
        states: ['checked', 'disabled'],
      },
      {className: 'astryx-dropdown-menu-section-heading'},
      {className: 'astryx-dropdown-menu-divider'},
      {className: 'astryx-dropdown-menu-indicator-icon'},
    ],
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
    'Action menu with a trigger button and anchored, bottom-sheet, or adaptive presentation.',
  props: [
    {
      name: 'button',
      type: 'DropdownMenuButtonProps',
      description:
        'Props for the trigger button (Button props except onClick). Mutually exclusive with `renderTrigger`.',
      default: "{ label: 'Menu' }",
    },
    {
      name: 'renderTrigger',
      type: '(props: DropdownMenuTriggerProps) => ReactNode',
      description:
        'Render the control the menu hangs off — an IconButton, a chip, an avatar, a list row — instead of the built-in Button. Spread the given props onto it: they carry the press model (a mouse opens on press-down, a finger or a pen opens as it presses), the keyboard opens, the toggle click, and `aria-haspopup`/`aria-expanded`/`aria-controls`/`id`; the menu is then named by that control through `aria-labelledby`. Mutually exclusive with `button`.',
    },

    {
      name: 'items',
      type: 'DropdownMenuOption[]',
      description:
        'Array of menu entries. Each entry is one of: an action item `{label, onClick?, href?, target?, rel?, icon?, description?, endContent?, isDisabled?, variant?, hasCloseOnSelect?, id?}` (`href` makes the row a real link, so a modified click keeps the browser\'s meaning; variant `"destructive"` renders it in the error color; `endContent` holds trailing content such as a keyboard-shortcut hint; `id` is the row\'s stable React key, needed only when the array reorders or filters), a divider `{type: "divider"}`, or a section `{type: "section", title?, id?, items: [...action items]}`.',
      required: true,
    },
    {
      name: 'presentation',
      type: "'popover' | 'bottom-sheet' | 'adaptive'",
      description:
        "Presentation surface for data-driven items. 'popover' stays anchored, 'bottom-sheet' always renders the actions in a modal BottomSheet, and 'adaptive' uses a BottomSheet on compact coarse-pointer layouts while remaining anchored elsewhere. Compound children currently support popover only. Omitted, the menu is anchored, and under a finger or a pen, on every device, its trigger opens as it is pressed (inside a scroll view, after the 150 ms content-touch delay), and the opening finger picks after moving 10 px. Pass 'popover' to keep the pointer behavior on every device, a 500 ms hold included.",
    },
    {
      name: 'isMenuOpen',
      type: 'boolean',
      description:
        'Controlled open state for the menu. Mounting with true renders the menu open without moving focus into it; focus moves to the first item only when the menu opens after mount.',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the open state changes.',
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description:
        'Minimum width for the popover presentation. Length values may grow for content; intrinsic and CSS-wide keywords select the preferred inline size. Every form is capped to the available viewport space. Defaults to matching the trigger width up to that cap.',
    },
    {
      name: 'menuMaxHeight',
      type: 'number',
      description:
        'Maximum height in pixels for the popover presentation, for a menu that must fit its rows. Lifts the default 300px cap; the viewport still bounds it.',
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'Content above the rows and outside the menu itself — a filter field, a toggle. A menu holds only its rows, so a control that is not a row goes here or in `footer`, never among the rows. It keeps its own keys and presses. With a header or footer the popover is a modal dialog around the menu: Tab and Shift+Tab move through the header, the menu and the footer and wrap at either end, and Escape closes. The bottom sheet shows it above the actions.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        'Content below the rows and outside the menu itself — a "Create" button. Tab from the menu moves into it, and Tab past its last control wraps to the start of the dialog (see `header`). The bottom sheet shows it below the actions.',
    },
    {
      name: 'placement',
      type: "'above' | 'below' | 'start' | 'end'",
      description:
        "Popover placement relative to the trigger. Ignored by the bottom-sheet presentation. Logical: start/end resolve against the menu's own inherited direction (RTL mirrors).",
      default: "'below'",
    },
    {
      name: 'alignment',
      type: "'start' | 'center' | 'end'",
      description:
        "Popover alignment along the placement axis. Ignored by the bottom-sheet presentation. Logical: start/end follow the menu's own inherited direction (RTL mirrors).",
      default: "'start'",
    },
    {
      name: 'onClick',
      type: '() => void',
      description:
        'Callback fired for accepted trigger activation. The trailing click from the same press that light-dismissed the menu is ignored.',
    },
    {
      name: 'hasChevron',
      type: 'boolean',
      description:
        'Whether to show a chevron icon on the trigger button. Set to false for icon-only triggers.',
      default: 'true',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Compound-mode menu content: DropdownMenuItem, DropdownMenuDivider, DropdownMenuSubMenu (a flyout on a laptop, a drilled-in view with a Back row on a phone), and the selectable items. Mutually exclusive with `items`.',
    },
  ],
  components: [{name: 'DropdownMenuItem'}],
  usage: {
    anatomy,
    description:
      'A dropdown menu that displays a list of actionable items in a popup triggered by a button. Use to present action options as a next step in a process, or to offer contextual actions without cluttering the interface. Like the menus of macOS and iOS, the row under the pointer when it is released is the row that acts, the highlight follows a held mouse or finger, a mouse opens it on press and can drag straight into it, and a finger held on the trigger opens it with the finger down.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented so users can scan options quickly.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'For a short, flat action set, use presentation="bottom-sheet" when product policy calls for a modal touch surface.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the same short action set should remain anchored on pointer layouts and become a BottomSheet on compact coarse-pointer layouts.',
      },
      {
        guidance: true,
        description:
          'For a hierarchy that cannot fit as adjacent flyouts on a compact touch surface, a product may explicitly use a drill-in interaction with a Back action.',
      },
      {
        guidance: true,
        description:
          'Choose presentation explicitly in product code. A compact, coarse-pointer, hover-free media query is one useful policy, but DropdownMenu does not impose a universal device breakpoint.',
      },
      {
        guidance: true,
        description:
          'When the content is no longer a short list of immediate actions, reevaluate the interaction and choose a component that matches the actual task; content traits alone do not determine the component.',
      },
      {
        guidance: false,
        description:
          'Use a DropdownMenu for navigation; use a navigation component instead.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "下拉菜单，通过按钮触发弹出层并显示可操作项列表。用于在流程的下一步呈现操作选项，或在不使界面杂乱的情况下提供上下文操作。与 macOS 和 iOS 的菜单一样，释放时指针所在的行即为执行操作的行；高亮跟随按住的鼠标或手指；鼠标按下即打开，并可直接拖入菜单；手指按住触发器时，菜单在手指按下状态下打开。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "保持菜单项简洁且面向操作，让用户能快速扫读选项。"
      },
      {
        "guidance": true,
        "description": "当菜单项较多时，使用分区和分隔线对相关操作分组。"
      },
      {
        "guidance": true,
        "description": "对于简短扁平的操作集，当产品策略要求使用模态触摸表面时，请使用 presentation=\"bottom-sheet\"。"
      },
      {
        "guidance": true,
        "description": "当同一简短操作集需要在指针布局中保持锚定、在紧凑的粗指针布局中变为 BottomSheet 时，请使用 presentation=\"adaptive\"。"
      },
      {
        "guidance": true,
        "description": "对于在紧凑触摸表面上无法以相邻浮出层容纳的层级结构，产品可显式采用带“返回”操作的钻取式交互。"
      },
      {
        "guidance": true,
        "description": "在产品代码中显式选择 presentation。紧凑、粗指针、无悬停的媒体查询是一种有用的策略，但 DropdownMenu 不会强加通用的设备断点。"
      },
      {
        "guidance": true,
        "description": "当内容不再是简短即时操作列表时，请重新评估交互，并选择与实际任务相符的组件；仅凭内容特征并不能决定组件选型。"
      },
      {
        "guidance": false,
        "description": "将 DropdownMenu 用于导航；请改用导航组件。"
      },
      {
        "guidance": false,
        "description": "在单个菜单中放置超过 10–12 个项且不将其分组为分区。"
      }
    ],
    "anatomy": [
      {
        "name": "触发按钮",
        "required": true,
        "description": "用于打开和关闭所选菜单呈现方式的按钮。"
      },
      {
        "name": "触发指示图标",
        "required": false,
        "description": "启用 hasChevron 时，带标签的触发器显示的可选尾部 chevron。"
      },
      {
        "name": "指针菜单表面",
        "required": false,
        "description": "指针呈现方式使用的锚定顶层或嵌套菜单面板。"
      },
      {
        "name": "指针操作行",
        "required": false,
        "description": "锚定菜单中的操作行、可选选项行或子菜单触发行。"
      },
      {
        "name": "由 Icon 渲染的项图标",
        "required": false,
        "description": "操作行开头通过 Icon 渲染的可选语义图标或组件图标。"
      },
      {
        "name": "调用方渲染的项起始内容",
        "required": false,
        "description": "直接渲染在操作行开头的可选任意 React 内容。"
      },
      {
        "name": "复选框指示器",
        "required": false,
        "description": "复选框操作行使用的装饰性共享复选框指示器。"
      },
      {
        "name": "单选指示器",
        "required": false,
        "description": "带额外菜单自有目标的装饰性共享单选指示器。"
      },
      {
        "name": "指针分区标题",
        "required": false,
        "description": "为锚定菜单中的一组行加标签的标题：数据驱动分区或复合 DropdownMenuGroup。"
      },
      {
        "name": "指针分隔线",
        "required": false,
        "description": "锚定菜单中各组之间的分隔线。"
      },
      {
        "name": "指针子菜单指示图标",
        "required": false,
        "description": "标识操作行为嵌套浮出层触发器的尾部 chevron。"
      },
      {
        "name": "触摸面板框架",
        "required": false,
        "description": "承载触摸操作的 BottomSheet 面板、内容区域、手柄和可选遮罩。"
      },
      {
        "name": "触摸菜单表面",
        "required": false,
        "description": "渲染在触摸面板框架内的菜单自有内容面板。"
      },
      {
        "name": "触摸标题",
        "required": false,
        "description": "当前操作面板标题，打开嵌套操作视图时更新。"
      },
      {
        "name": "触摸操作列表",
        "required": false,
        "description": "触摸呈现方式中对操作进行分组的宽松 List。"
      },
      {
        "name": "触摸操作行",
        "required": false,
        "description": "触摸呈现方式中用于操作或钻取入口的 ListItem 按钮。"
      },
      {
        "name": "触摸分隔线",
        "required": false,
        "description": "触摸呈现方式中各操作组之间的分隔线。"
      }
    ]
  },
  "name": "DropdownMenu",
  "displayName": "Dropdown Menu",
  "description": "带触发按钮的操作菜单，支持锚定、底部面板或自适应呈现方式。",
  "propDescriptions": {
    "button": "触发按钮的属性（除 onClick 外的 Button 属性）。与 `renderTrigger` 互斥。",
    "renderTrigger": "渲染菜单所挂接的控件——IconButton、chip、头像、列表行——而不是内置 Button。将给定的属性展开到该控件上：这些属性承载按压模型（鼠标按下即打开，手指或笔按下时打开）、键盘打开、切换点击，以及 `aria-haspopup`/`aria-expanded`/`aria-controls`/`id`；随后菜单通过 `aria-labelledby` 以该控件命名。与 `button` 互斥。",
    "items": "菜单项数组。每一项为：操作项 `{label, onClick?, href?, target?, rel?, icon?, description?, endContent?, isDisabled?, variant?, hasCloseOnSelect?, id?}`（`href` 使该行成为真实链接，因此带修饰键的点击保留浏览器的语义；variant `\"destructive\"` 以错误色渲染；`endContent` 存放键盘快捷键提示等尾部内容；`id` 是该行的稳定 React key，仅在数组重排或筛选时需要）、分隔线 `{type: \"divider\"}`，或分区 `{type: \"section\", title?, id?, items: [...action items]}`。",
    "presentation": "数据驱动项的呈现表面。'popover' 保持锚定，'bottom-sheet' 始终在模态 BottomSheet 中渲染操作，'adaptive' 在紧凑粗指针布局中使用 BottomSheet，其他布局中保持锚定。复合子元素目前仅支持 popover。省略时，菜单为锚定式，且在手指或笔下（所有设备），其触发器在按下时打开（在滚动视图内，经过 150 ms 的内容触摸延迟后），打开时的手指在移动 10 px 后即可选取。传入 'popover' 可在所有设备上保持指针行为，包括 500 ms 长按。",
    "isMenuOpen": "菜单的受控打开状态。以 true 挂载时菜单呈现为打开状态，但不会将焦点移入其中；只有在挂载后菜单打开时，焦点才会移到第一项。",
    "onOpenChange": "打开状态变化时触发的回调。",
    "menuWidth": "popover 呈现方式的最小宽度。长度值可随内容增长；固有尺寸和 CSS 全局关键字选择首选的 inline 尺寸。所有形式都会限制在可用视口空间内。默认与触发器宽度一致，直至该上限。",
    "menuMaxHeight": "popover 呈现方式的最大高度（像素），适用于必须完整容纳各行的菜单。会提高默认的 300px 上限；视口仍会限制它。",
    "header": "行上方且位于菜单之外的内容——筛选字段、开关。菜单只容纳行，因此不是行的控件应放在这里或 `footer` 中，绝不能放在行之间。它保留自己的按键和按压行为。带 header 或 footer 时，popover 成为围绕菜单的模态对话框：Tab 和 Shift+Tab 在 header、菜单和 footer 间移动，并在两端循环，Escape 关闭。底部面板会在操作上方显示它。",
    "footer": "行下方且位于菜单之外的内容——例如“创建”按钮。从菜单按 Tab 会进入其中，Tab 越过其最后一个控件后会循环到对话框开头（参见 `header`）。底部面板会在操作下方显示它。",
    "placement": "popover 相对于触发器的放置位置。底部面板呈现方式会忽略。逻辑方向：start/end 依据菜单自身继承的方向解析（RTL 下镜像）。",
    "alignment": "popover 沿放置轴的对齐方式。底部面板呈现方式会忽略。逻辑方向：start/end 遵循菜单自身继承的方向（RTL 下镜像）。",
    "onClick": "触发器被接受激活时触发的回调。同一次按压因轻触关闭菜单而产生的尾随点击会被忽略。",
    "hasChevron": "是否在触发按钮上显示 chevron 图标。仅图标触发器请设为 false。",
    "children": "复合模式菜单内容：DropdownMenuItem、DropdownMenuDivider、DropdownMenuSubMenu（在笔记本电脑上为浮出层，在手机上为带“返回”行的钻取视图）以及可选中的项。与 `items` 互斥。"
  },
  "components": [
    {
      "name": "DropdownMenuItem",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'dropdown menu for actionable items in popup',
  usage: {
    anatomy,
    description:
      'A dropdown menu that displays a list of actionable items in a popup triggered by a button. Use to present action options as a next step in a process, or to offer contextual actions without cluttering the interface.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Keep menu items concise and action-oriented so users can scan options quickly.',
      },
      {
        guidance: true,
        description:
          'Use sections and dividers to group related actions when the menu has many items.',
      },
      {
        guidance: true,
        description:
          'For a short, flat action set, use presentation="bottom-sheet" when product policy calls for a modal touch surface.',
      },
      {
        guidance: true,
        description:
          'Use presentation="adaptive" when the same short action set should remain anchored on pointer layouts and become a BottomSheet on compact coarse-pointer layouts.',
      },
      {
        guidance: true,
        description:
          'For a hierarchy that cannot fit as adjacent flyouts on a compact touch surface, a product may explicitly use a drill-in interaction with a Back action.',
      },
      {
        guidance: true,
        description:
          'Choose presentation explicitly in product code. A compact, coarse-pointer, hover-free media query is one useful policy, but DropdownMenu does not impose a universal device breakpoint.',
      },
      {
        guidance: true,
        description:
          'When the content is no longer a short list of immediate actions, reevaluate the interaction and choose a component that matches the actual task; content traits alone do not determine the component.',
      },
      {
        guidance: false,
        description:
          'Use a DropdownMenu for navigation; use a navigation component instead.',
      },
      {
        guidance: false,
        description:
          'Place more than 10–12 items in a single menu without grouping them into sections.',
      },
    ],
  },
};
