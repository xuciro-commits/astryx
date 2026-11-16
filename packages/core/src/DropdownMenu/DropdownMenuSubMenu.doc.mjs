// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'DropdownMenuSubMenu',
  subComponentOf: 'DropdownMenu',
  displayName: 'Dropdown Menu Submenu',
  isHiddenFromOverview: true,
  description:
    'A single menu row that reveals a nested flyout of its own items. The row adopts DropdownMenuItem semantics (label / icon / description / isDisabled); its children become the flyout content. Opens inline-end with viewport auto-flip; Right/Enter/Space opens and focuses the first item, Left/Escape closes and returns focus to the trigger (Right/Left swap in RTL). On a phone (a coarse pointer, decided when the menu opened) the row drills in instead: its rows replace the menu\'s rows in the same box, led by a Back row named "Back to <parent>", and Back, Escape or ArrowLeft return to the row. Host attributes and DOM event handlers (aria-*, data-*, id) reach the trigger row, the element carrying role="menuitem" and aria-haspopup="menu"; a caller\'s handlers run after the row\'s own, except for the keys that open the flyout (the open arrow, Enter, Space) and a click on a disabled row. For data-driven menus, give a menu item a nested `items` array instead of using this component directly.',
  playground: {
    defaults: {label: 'Move to'},
  },
  props: [
    {
      name: 'label',
      type: 'ReactNode',
      required: true,
      description: 'Primary label text for the trigger row.',
    },
    {
      name: 'icon',
      type: 'IconType',
      description:
        'Icon to display before the label. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      required: true,
      description:
        'The flyout menu items: the same components used at the top level (DropdownMenuItem, nested DropdownMenuSubMenu, selectable items).',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      default: 'false',
      description:
        'A disabled submenu renders its trigger row but never opens the flyout.',
    },
    {
      name: 'hasSpinner',
      type: 'boolean',
      default: 'false',
      description:
        "Show a spinner in place of the caret, e.g. while a lazy submenu's children are loading.",
    },
    {
      name: 'menuWidth',
      type: 'number | string',
      description:
        'Minimum flyout width. The flyout may grow for its content, but it is capped to the available viewport space. Defaults to intrinsic sizing (min 160px).',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Called when the flyout opens or closes.',
    },
    {
      name: 'presentation',
      type: "'flyout' | 'drill-in' | 'adaptive'",
      description:
        "How the sub-menu shows its rows. 'flyout' opens them beside the row; 'drill-in' replaces the menu's rows with them and a Back row, in the same box; 'adaptive' drills in when a finger opened the menu (a coarse pointer, decided when the menu opened) and flies out otherwise.",
      default: "'adaptive'",
    },
    {
      name: 'delay',
      type: 'number',
      description:
        'How long a hovering pointer waits before the flyout opens, in milliseconds. Keyboard focus and touch never wait.',
      default: '150',
    },
    {
      name: 'hideDelay',
      type: 'number',
      description:
        'How long the flyout stays open after the pointer leaves, in milliseconds.',
      default: '200',
    },
    {
      name: 'header',
      type: 'ReactNode',
      description:
        'Content above the sub-menu\'s rows and outside its menu, a field that filters them, say. It keeps its own keys and presses. With a header or footer the sub-menu\'s surface (the flyout, or the drilled-in view on a phone) is a modal dialog named by the row, beside the menu rather than inside it: the row says aria-haspopup="dialog", Tab and Shift+Tab move through the header, the rows and the footer and wrap, Escape returns to the row, and a pointer leaving the flyout closes it only once focus leaves too. A ContextMenu does not show it.',
    },
    {
      name: 'footer',
      type: 'ReactNode',
      description:
        "Content below the sub-menu's rows and outside its menu, a door to where the options are managed, say. Same rules as header.",
    },
    {
      name: 'menuDataTestId',
      type: 'string',
      description:
        'Test id for the sub-menu\'s own role="menu" element: the flyout, or the drilled-in list on a phone. The trigger row takes data-testid.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for the trigger row. Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLElement>',
      description:
        'Ref forwarded to the trigger row, the element carrying role="menuitem" and aria-haspopup="menu" ("dialog" with a header or footer).',
    },
  ],
};

export const docsDense = {
  name: 'DropdownMenuSubMenu',
  isHiddenFromOverview: true,
  displayName: 'Dropdown Menu Submenu',
  description:
    'menu row that reveals a nested flyout of its own children/items (single component, not Sub/SubTrigger/SubContent); drills in on a phone',
  propDescriptions: {
    label: 'primary label text for the trigger row',
    icon: 'icon before label',
    description: 'secondary text below label',
    children: 'flyout menu items (same components as top level)',
    isDisabled: 'renders trigger but never opens',
    hasSpinner: 'spinner instead of caret for async children',
    menuWidth:
      'minimum flyout width, capped to the viewport (default: content, min 160px)',
    onOpenChange: 'called when flyout opens/closes',
    presentation:
      "'flyout' beside the row | 'drill-in' replaces the rows + Back row | 'adaptive' (default) drills in on a coarse pointer",
    delay: 'hover wait before the flyout opens, ms (default 150)',
    hideDelay: 'how long the flyout stays after the pointer leaves, ms (default 200)',
    header:
      'content above the rows, outside the menu; surface becomes a modal dialog named by the row (Tab wraps, Escape returns to the row)',
    footer: 'content below the rows, outside the menu; same rules as header',
    menuDataTestId: 'test id for the flyout or drilled-in role="menu"',
    xstyle: 'StyleX styles for the trigger row',
    ref: 'ref to the trigger row (role="menuitem")',
  },
};

export const docsZh = {
  "name": "DropdownMenuSubMenu",
  "displayName": "Dropdown Menu Submenu",
  "description": "一个菜单行，激活后会显示其自身项目的嵌套浮出菜单。该行沿用 DropdownMenuItem 的语义（label / icon / description / isDisabled）；其子元素成为浮出菜单内容。浮出菜单在行尾方向打开，并会随视口自动翻转；Right/Enter/Space 打开并聚焦第一个项目，Left/Escape 关闭并将焦点返回触发行（RTL 下 Right/Left 互换）。在手机（粗指针，在菜单打开时判定）上，该行改为钻取：它的行在同一盒子中替换菜单的行，顶部是一个名为 \"Back to <parent>\" 的返回行，Back、Escape 或 ArrowLeft 返回该行。宿主属性和 DOM 事件处理器（aria-*、data-*、id）会传到触发行，即承载 role=\"menuitem\" 和 aria-haspopup=\"menu\" 的元素；调用方的处理器在该行自身的处理器之后运行，打开浮出菜单的按键（打开方向键、Enter、Space）以及点击禁用行除外。对于数据驱动的菜单，请给菜单项一个嵌套的 `items` 数组，而不是直接使用此组件。",
  "propDescriptions": {
    "label": "触发行的主标签文本。",
    "icon": "显示在标签前的图标。有效语义名称见 `astryx docs icons`。",
    "description": "显示在标签下方的辅助描述文本。",
    "children": "浮出菜单项目：与顶层使用的相同组件（DropdownMenuItem、嵌套的 DropdownMenuSubMenu、可选择项）。",
    "isDisabled": "禁用的子菜单会渲染其触发行，但永不打开浮出菜单。",
    "hasSpinner": "在尖角符号位置显示加载指示器，例如惰性子菜单的子元素正在加载时。",
    "menuWidth": "浮出菜单的最小宽度。浮出菜单可随内容增长，但上限为可用视口空间。默认为固有尺寸（最小 160px）。",
    "onOpenChange": "浮出菜单打开或关闭时调用。",
    "presentation": "子菜单如何显示其行。'flyout' 在行旁打开；'drill-in' 在同一盒子中用这些行和返回行替换菜单的行；'adaptive' 在手指打开菜单时（粗指针，在菜单打开时判定）钻取，否则浮出。",
    "delay": "悬停指针等待浮出菜单打开的时间，以毫秒为单位。键盘焦点和触摸从不等待。",
    "hideDelay": "指针离开后浮出菜单保持打开的时间，以毫秒为单位。",
    "header": "子菜单行上方、菜单之外的内容，例如用于筛选这些行的字段。它保留自己的按键和按压。有 header 或 footer 时，子菜单的表面（浮出菜单，或手机上的钻取视图）是一个以该行命名的模态对话框，位于菜单旁而不是菜单内：该行声明 aria-haspopup=\"dialog\"，Tab 和 Shift+Tab 在 header、行和 footer 之间移动并循环，Escape 返回该行，指针离开浮出菜单时仅在焦点也离开后才关闭。ContextMenu 不显示它。",
    "footer": "子菜单行下方、菜单之外的内容，例如通往选项管理位置的入口。规则与 header 相同。",
    "menuDataTestId": "子菜单自身 role=\"menu\" 元素的测试 id：浮出菜单，或手机上的钻取列表。触发行接受 data-testid。",
    "xstyle": "用于触发行的 StyleX 样式。必须是 stylex.create() 值：不是像 style={{}} 这样的内联样式对象。",
    "ref": "转发到触发行的 ref，即承载 role=\"menuitem\" 和 aria-haspopup=\"menu\"（有 header 或 footer 时为 \"dialog\"）的元素。"
  }
};
