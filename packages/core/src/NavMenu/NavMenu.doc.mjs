// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Menu',
    required: true,
    description:
      'Menu container for nav-heading actions, with menu semantics and keyboard navigation.',
  },
  {
    name: 'Item',
    required: true,
    description: 'Selectable action or navigation link inside the Menu.',
  },
  {
    name: 'Icon',
    required: false,
    description: 'Optional Icon-rendered artwork shown before an Item label.',
  },
  {
    name: 'Text-rendered item label',
    required: false,
    description: 'String Item label rendered through Text.',
  },
  {
    name: 'Caller-rendered item label',
    required: false,
    description: 'Non-string Item label content rendered directly by the caller.',
  },
  {
    name: 'Item description',
    required: false,
    description: 'Optional supporting description rendered through Text.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'NavHeadingMenu',
  displayName: 'Nav Heading Menu',
  group: 'Navigation',
  category: 'Navigation',
  isHiddenFromOverview: true,
  hidden: false,
  keywords: ['nav', 'menu', 'navigation', 'heading', 'menu-item', 'popover'],
  usage: {
    anatomy,
    description:
      'Accessible menu container and items for nav heading popovers. ' +
      'NavHeadingMenu provides role="menu" with keyboard navigation; ' +
      'NavHeadingMenuItem renders individual selectable items. ' +
      'Pass as the menu prop of SideNavHeading or TopNavHeading.',
  },
  playground: {
    defaults: {
      children: [
        {__element: 'NavHeadingMenuItem', props: {label: 'Dashboard', href: '#'}},
        {__element: 'NavHeadingMenuItem', props: {label: 'Analytics', href: '#'}},
        {__element: 'NavHeadingMenuItem', props: {label: 'Settings', href: '#'}},
      ],
    },
  },
  props: [
    {name: 'children', type: 'ReactNode', required: true, description: 'Menu items.'},
    {name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Controls min-width and item padding.'},
    {name: 'minWidth', type: 'number | string', description: 'Minimum width override.'},
    {name: 'xstyle', type: 'StyleXStyles', description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value, not an inline style object like style={{}}.'},
  ],
  theming: {
    targets: [
      {className: 'astryx-nav-heading-menu', visualProps: ['size']},
      {className: 'astryx-nav-heading-menu-item', visualProps: ['size']},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Accessible menu container + items for nav heading popovers. NavHeadingMenu = role="menu" w/ keyboard nav; NavHeadingMenuItem renders selectable items.',
  usage: {
    anatomy,
    description:
      'Accessible menu container + items for nav heading popovers. NavHeadingMenu provides role="menu" w/ keyboard navigation; NavHeadingMenuItem renders individual selectable items. Pass as menu prop of SideNavHeading or TopNavHeading.',
  },
  propDescriptions: {
    size: 'controls min-width + item padding',
    minWidth: 'minimum width override',
  },
};

export const docsZh = {
  "name": "NavHeadingMenu",
  "displayName": "Nav Heading Menu",
  "usage": {
    "description": "用于导航标题弹出层的无障碍菜单容器和菜单项。NavHeadingMenu 提供带键盘导航的 `role=\"menu\"`；NavHeadingMenuItem 渲染单个可选项。作为 SideNavHeading 或 TopNavHeading 的 `menu` 属性传入。",
    "anatomy": [
      {
        "name": "菜单",
        "required": true,
        "description": "用于导航标题操作的菜单容器，具备菜单语义和键盘导航。"
      },
      {
        "name": "菜单项",
        "required": true,
        "description": "菜单内可选择的操作或导航链接。"
      },
      {
        "name": "图标",
        "required": false,
        "description": "可选的、通过 Icon 渲染的图形，显示在菜单项标签之前。"
      },
      {
        "name": "文本渲染的菜单项标签",
        "required": false,
        "description": "通过 Text 渲染的字符串菜单项标签。"
      },
      {
        "name": "调用方渲染的菜单项标签",
        "required": false,
        "description": "由调用方直接渲染的非字符串菜单项标签内容。"
      },
      {
        "name": "菜单项描述",
        "required": false,
        "description": "可选的、通过 Text 渲染的辅助描述。"
      }
    ]
  },
  "propDescriptions": {
    "children": "菜单项。",
    "size": "控制最小宽度和菜单项内边距。",
    "minWidth": "最小宽度覆盖值。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 `stylex.create()` 的值，而不是像 `style={{}}` 这样的内联样式对象。"
  }
};
