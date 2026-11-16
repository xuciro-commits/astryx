// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SideNavItem',
  subComponentOf: 'SideNav',
  displayName: 'Side Nav Item',
  isHiddenFromOverview: true,
  description: 'Navigation item with icon, selected state, optional end content, and nesting support via children.',
  playground: {
    defaults: {label: 'Dashboard', icon: 'viewColumns', isSelected: true},
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Item label.',
      required: true,
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: 'Custom link component.',
    },
    {
      name: 'icon',
      type: 'IconType',
      description: 'Icon displayed in the outline (unselected) variant. See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'selectedIcon',
      type: 'IconType',
      description: 'Icon displayed when the item is selected (filled variant). See `astryx docs icons` for valid semantic names.',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Marks this item as the current page.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Disabled state.',
      default: 'false',
    },
    {
      name: 'href',
      type: 'string',
      description: 'Navigation URL.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'Click handler.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Passive right-side content only (badges, counts). Interactive controls go in actions.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'chevronDown',
            size: 'sm',
          },
        },
        {
          __element: 'Badge',
          props: {
            label: '3',
          },
        },
      ],
    },
    {
      name: 'actions',
      type: 'ReactNode',
      description:
        'Row-level secondary controls (icon buttons, menus) rendered as siblings of the primary element at the trailing edge of the row: after the expand/collapse toggle, before any nested children in DOM and focus order. Each control owns its accessible name and behavior. Controls inherit the row control size through SizeContext, so an unsized icon button matches the built-in expand/collapse toggle; an explicit size still wins. Hidden while the SideNav rail is collapsed. Use endContent for passive content (badges, counts); use actions for anything interactive.',
      slotElements: [
        {
          __element: 'Button',
          props: {label: 'Rename', variant: 'ghost', size: 'sm'},
        },
      ],
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Sub-items for nesting. Nested items span the full width of the nav list, like top-level items; their content is indented one step per nesting level.',
      slotElements: [
        {
          __element: 'SideNavItem',
          props: {
            label: 'Sub Item',
          },
        },
      ],
    },
    {
      name: 'collapsible',
      type: 'boolean | { defaultIsCollapsed?: boolean, isCollapsed?: boolean, onCollapsedChange?: (isCollapsed: boolean) => void }',
      description: 'Enables collapse behavior for items with children. Pass true for uncontrolled (starts expanded), or an object for controlled mode.',
      default: 'false',
    },
    {
      name: 'size',
      type: "'sm' | 'md' | 'lg'",
      description: 'Size variant for the nav item row.',
      default: "'md'",
    },
  ],
};

export const docsZh = {
  "name": "SideNavItem",
  "isHiddenFromOverview": true,
  "displayName": "Side Nav Item",
  "description": "带有图标、选中状态、可选结束内容，并可通过 children 支持嵌套的导航条目。",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "条目标签。",
      "required": true
    },
    {
      "name": "as",
      "type": "LinkComponentType",
      "description": "自定义链接组件。"
    },
    {
      "name": "icon",
      "type": "IconType",
      "description": "在轮廓（未选中）变体中显示的图标。有效语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "selectedIcon",
      "type": "IconType",
      "description": "条目被选中时（填充变体）显示的图标。有效语义名称参见 `astryx docs icons`。"
    },
    {
      "name": "isSelected",
      "type": "boolean",
      "description": "将此条目标记为当前页面。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "禁用状态。",
      "default": "false"
    },
    {
      "name": "href",
      "type": "string",
      "description": "导航 URL。"
    },
    {
      "name": "onClick",
      "type": "(e: MouseEvent) => void",
      "description": "点击处理函数。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "仅限被动的右侧内容（徽章、计数）。交互控件放在 actions 中。"
    },
    {
      "name": "actions",
      "type": "ReactNode",
      "description": "行级辅助控件（图标按钮、菜单），作为主要元素的同级项渲染在行的末端边缘：位于展开/折叠切换之后，在任何嵌套 children 之前的 DOM 和焦点顺序中。每个控件拥有自己的无障碍名称和行为。控件通过 SizeContext 继承行控件尺寸，因此未指定尺寸的图标按钮会与内置展开/折叠切换匹配；显式尺寸仍然优先。SideNav 侧栏折叠时隐藏。被动内容（徽章、计数）使用 endContent；任何交互内容使用 actions。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "用于嵌套的子条目。嵌套条目与顶层条目一样横跨导航列表的整个宽度；其内容每嵌套一层缩进一步。"
    },
    {
      "name": "collapsible",
      "type": "boolean | { defaultIsCollapsed?: boolean, isCollapsed?: boolean, onCollapsedChange?: (isCollapsed: boolean) => void }",
      "description": "为有子条目的条目启用折叠行为。传 true 为非受控（初始展开），或传对象为受控模式。",
      "default": "false"
    },
    {
      "name": "size",
      "type": "'sm' | 'md' | 'lg'",
      "description": "导航条目行的尺寸变体。",
      "default": "'md'"
    }
  ],
  "propDescriptions": {
    "label": "条目标签。",
    "as": "自定义链接组件。",
    "icon": "在轮廓（未选中）变体中显示的图标。有效语义名称参见 `astryx docs icons`。",
    "selectedIcon": "条目被选中时（填充变体）显示的图标。有效语义名称参见 `astryx docs icons`。",
    "isSelected": "将此条目标记为当前页面。",
    "isDisabled": "禁用状态。",
    "href": "导航 URL。",
    "onClick": "点击处理函数。",
    "endContent": "仅限被动的右侧内容（徽章、计数）。交互控件放在 actions 中。",
    "actions": "行级辅助控件（图标按钮、菜单），作为主要元素的同级项渲染在行的末端边缘：位于展开/折叠切换之后，在任何嵌套 children 之前的 DOM 和焦点顺序中。每个控件拥有自己的无障碍名称和行为。控件通过 SizeContext 继承行控件尺寸，因此未指定尺寸的图标按钮会与内置展开/折叠切换匹配；显式尺寸仍然优先。SideNav 侧栏折叠时隐藏。被动内容（徽章、计数）使用 endContent；任何交互内容使用 actions。",
    "children": "用于嵌套的子条目。嵌套条目与顶层条目一样横跨导航列表的整个宽度；其内容每嵌套一层缩进一步。",
    "collapsible": "为有子条目的条目启用折叠行为。传 true 为非受控（初始展开），或传对象为受控模式。",
    "size": "导航条目行的尺寸变体。"
  }
};

export const docsDense = {
  name: 'SideNavItem',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Item',
  description: 'Navigation item w/ icon, selected state, optional end content, nesting via children.',
  propDescriptions: {
    label: 'Item label.',
    as: 'Custom link component.',
    icon: 'Icon displayed in outline (unselected) variant.',
    selectedIcon: 'Icon displayed when item selected (filled variant).',
    isSelected: 'Marks this item as current page.',
    isDisabled: 'Disabled state.',
    href: 'Navigation URL.',
    onClick: 'Click handler.',
    endContent:
      'Passive right-side content only (badges, counts). Interactive controls go in actions.',
    actions:
      'Row-level secondary controls (icon buttons, menus) rendered as siblings of the primary element, after the expand/collapse toggle and before nested children in DOM/focus order. Inherit the row control size via SizeContext (explicit size wins). Hidden when rail collapsed. Passive content goes in endContent; interactive content goes here.',
    children: 'Sub-items for nesting. Nested rows stay full width; content indents one step per level.',
    collapsible: 'Enables collapse for items w/ children. true=uncontrolled, object=controlled mode.',
    size: "Row size variant: 'sm' | 'md' | 'lg'.",
  },
};
