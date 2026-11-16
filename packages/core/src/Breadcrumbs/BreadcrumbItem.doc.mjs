// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'BreadcrumbItem',
  subComponentOf: 'Breadcrumbs',
  displayName: 'Breadcrumb Item',
  isHiddenFromOverview: true,
  description: 'Individual breadcrumb item that renders as a link when href is provided, or as plain text for the current page.',
  usage: {
    description:
      'BreadcrumbItem represents one destination, action, current location, or sibling-menu trigger inside a Breadcrumbs trail.',
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Label content for the breadcrumb item.',
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description: 'URL the breadcrumb links to; omit for non-navigable items.',
    },
    {
      name: 'onClick',
      type: '(e: MouseEvent) => void',
      description: 'Click handler for the breadcrumb item.',
    },
    {
      name: 'isCurrent',
      type: 'boolean',
      description:
        'Marks this item as the current page, applying aria-current="page". When omitted, the last item is auto-detected if no item is explicitly current; pass false to opt out.',
    },
    {
      name: 'startIcon',
      type: 'ReactNode',
      description: 'Icon rendered before the item label.',
      slotElements: [
        {
          __element: 'Icon',
          props: {
            icon: 'check',
            size: 'sm',
          },
        },
      ],
    },
    {
      name: 'menu',
      type: 'DropdownMenuOption[] | ReactNode',
      description:
        'Menu opened when the item is activated, using the same item API as DropdownMenu/MoreMenu/ContextMenu (a DropdownMenuOption[] array or composed DropdownMenuItem children). Renders a link-styled menu trigger with a chevron and aria-haspopup="menu". Takes precedence over href/onClick.',
    },
    {
      name: 'menuSize',
      type: "'sm' | 'md' | 'lg'",
      description:
        "Size passed to the menu items. Defaults from the breadcrumb variant ('supporting' → 'sm', otherwise 'md').",
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: 'Custom link component to render instead of <a>. Overrides the provider-level default from LinkProvider. Only applies to non-current items.',
    },
  ],
};

export const docsZh = {
  "name": "BreadcrumbItem",
  "isHiddenFromOverview": true,
  "displayName": "Breadcrumb Item",
  "description": "单个面包屑项：提供 href 时渲染为链接，当前页则渲染为纯文本。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "面包屑项的标签内容。",
      "required": true
    },
    {
      "name": "href",
      "type": "string",
      "description": "面包屑链接指向的 URL；不可导航的项请省略。"
    },
    {
      "name": "onClick",
      "type": "(e: MouseEvent) => void",
      "description": "面包屑项的点击处理函数。"
    },
    {
      "name": "isCurrent",
      "type": "boolean",
      "description": "将此标记为当前页面，并应用 aria-current=\"page\"。省略时，若没有显式标记为当前项的项，则自动检测最后一项；传入 false 可退出该行为。"
    },
    {
      "name": "startIcon",
      "type": "ReactNode",
      "description": "渲染在项标签之前的图标。"
    },
    {
      "name": "menu",
      "type": "DropdownMenuOption[] | ReactNode",
      "description": "在项被激活时打开的菜单，使用与 DropdownMenu/MoreMenu/ContextMenu 相同的项 API（DropdownMenuOption[] 数组或组合的 DropdownMenuItem 子元素）。渲染带 chevron 和 aria-haspopup=\"menu\" 的链接样式菜单触发器。优先于 href/onClick。"
    },
    {
      "name": "menuSize",
      "type": "'sm' | 'md' | 'lg'",
      "description": "传递给菜单项的尺寸。默认值来自面包屑变体（'supporting' → 'sm'，否则为 'md'）。"
    },
    {
      "name": "as",
      "type": "LinkComponentType",
      "description": "用于替代 <a> 渲染的自定义链接组件。覆盖 LinkProvider 提供的提供程序级默认值。仅适用于非当前项。"
    }
  ],
  "usage": {
    "description": "BreadcrumbItem 表示 Breadcrumbs 路径中的一个目标、操作、当前位置或同级菜单触发器。"
  },
  "propDescriptions": {
    "children": "面包屑项的标签内容。",
    "href": "面包屑链接指向的 URL；不可导航的项请省略。",
    "onClick": "面包屑项的点击处理函数。",
    "isCurrent": "将此标记为当前页面，并应用 aria-current=\"page\"。省略时，若没有显式标记为当前项的项，则自动检测最后一项；传入 false 可退出该行为。",
    "startIcon": "渲染在项标签之前的图标。",
    "menu": "在项被激活时打开的菜单，使用与 DropdownMenu/MoreMenu/ContextMenu 相同的项 API（DropdownMenuOption[] 数组或组合的 DropdownMenuItem 子元素）。渲染带 chevron 和 aria-haspopup=\"menu\" 的链接样式菜单触发器。优先于 href/onClick。",
    "menuSize": "传递给菜单项的尺寸。默认值来自面包屑变体（'supporting' → 'sm'，否则为 'md'）。",
    "as": "用于替代 <a> 渲染的自定义链接组件。覆盖 LinkProvider 提供的提供程序级默认值。仅适用于非当前项。"
  }
};

export const docsDense = {
  name: 'BreadcrumbItem',
  isHiddenFromOverview: true,
  displayName: 'Breadcrumb Item',
  description: 'individual breadcrumb; link w/ href, plain text for current page',
  propDescriptions: {
    children: 'label content',
    href: 'link URL; omit for non-navigable items',
    onClick: 'click handler',
    isCurrent:
      'marks current page w/ aria-current="page"; omitted auto-detects the last item; false opts out',
    startIcon: 'icon before label',
    menu: 'DropdownMenuOption[] | children; opens a menu trigger (aria-haspopup="menu"); reuses the DropdownMenu item API',
    menuSize: "menu item size; defaults from variant (supporting→sm, else md)",
    as: 'custom link component; overrides LinkProvider default',
  },
};
