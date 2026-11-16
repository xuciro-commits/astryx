// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNav',
  displayName: 'Top Nav',
  group: 'Navigation',
  category: 'Navigation',
  keywords: ["topnav","navbar","appbar","header","toolbar","navigation","menubar","topbar"],
  playground: {
    defaults: {
      label: 'Navigation',
      heading: {__element: 'TopNavHeading', props: {heading: 'My App'}},
      children: [
        {__element: 'TopNavItem', props: {label: 'Home', href: '#', isSelected: true}},
        {__element: 'TopNavItem', props: {label: 'Projects', href: '#'}},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-top-nav', states: ['mode']},
      {className: 'astryx-top-nav-item', states: ['mode', 'selected']},
      {className: 'astryx-top-nav-heading'},
      {className: 'astryx-top-nav-mega-menu', states: ['mode']},
      {className: 'astryx-top-nav-mega-menu-item', states: ['mode']},
      {className: 'astryx-top-nav-mega-menu-featured-card'},
      {className: 'astryx-top-nav-menu'},
    ],
  },
  description: 'Main navigation bar container with slot-based layout. Children are accepted as an alias for startContent.',
  props: [
    {
      name: 'heading',
      type: 'ReactNode',
      description: 'Heading slot content (logo, brand): positioned at the left edge of the nav bar.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
            weight: 'bold',
          },
          children: 'Heading',
        },
      ],
    },
    {
      name: 'startContent',
      type: 'ReactNode',
      description: 'Start content slot for navigation items or breadcrumbs: positioned after the heading, left-aligned.',
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
      name: 'children',
      type: 'ReactNode',
      description: 'Alias for startContent. Prefer startContent when composing with heading, centerContent, or endContent; children keeps the common React nav-item pattern from silently dropping items.',
      slotElements: [
        {
          __element: 'TopNavItem',
          props: {
            label: 'Home',
            href: '#',
          },
        },
      ],
    },
    {
      name: 'centerContent',
      type: 'ReactNode',
      description: 'Center content slot (tabs, search bar, primary navigation): when provided, switches the layout to three regions that keep it at the middle of the bar while they fit one row; the bar wraps when they do not.',
      slotElements: [
        {
          __element: 'Text',
          props: {
            type: 'body',
            weight: 'bold',
          },
          children: 'Center',
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'End content slot for search, icons, or user profile: positioned at the right edge.',
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
      name: 'label',
      type: 'string',
      description: 'Accessible label for the navigation landmark, applied as aria-label on the <nav> element.',
      default: "'Top navigation'",
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'TopNavHeading'},
    {name: 'TopNavItem'},
    {name: 'TopNavMenu'},
    {name: 'TopNavMegaMenu'},
    {name: 'TopNavMegaMenuItem'},
    {name: 'TopNavMegaMenuFeaturedCard'},
  ],
  usage: {
    description:
      'TopNav is a horizontal navigation bar for product-level navigation in application headers. Use TopNav for 5 or fewer always-visible navigation items, or minimal navigation paired with search and controls. For complex navigation hierarchies, use a sidebar; to filter content, use tabs or filter buttons instead.',
    bestPractices: [
      {guidance: true, description: 'Include a product logo and name in the heading slot to clearly identify the application.'},
      {guidance: true, description: 'Limit primary navigation items to 5 or fewer for quick scanning and minimal cognitive load.'},
      {guidance: false, description: 'Avoid using TopNav to filter page content; use Tabs or filter controls instead.'},
      {guidance: false, description: 'Avoid deeply nested navigation hierarchies; keep menus to one level of depth.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: true, description: 'Identifies the product in the navigation bar.'},
      {name: 'Navigation items', required: true, description: 'Primary links for product-level destinations.'},
      {name: 'More menu', required: false, description: 'Overflow menu for additional navigation items.'},
      {name: 'Flex area', required: false, description: 'Flexible region for search, primary action buttons, or other controls.'},
    ],
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "TopNav 是用于应用页头中产品级导航的水平导航栏。当始终可见的导航项不超过 5 个，或导航极简并搭配搜索和控件时，使用 TopNav。对于复杂的导航层级，请使用侧边栏；要筛选内容，请改用标签页或筛选按钮。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在 heading 插槽中包含产品徽标和名称，以清楚标识应用。"
      },
      {
        "guidance": true,
        "description": "将主导航项限制在 5 个或更少，以便快速浏览并降低认知负荷。"
      },
      {
        "guidance": false,
        "description": "避免使用 TopNav 筛选页面内容；请改用 Tabs 或筛选控件。"
      },
      {
        "guidance": false,
        "description": "避免深层嵌套的导航层级；菜单保持一层深度。"
      }
    ],
    "anatomy": [
      {
        "name": "产品图标和名称",
        "required": true,
        "description": "在导航栏中标识产品。"
      },
      {
        "name": "导航项",
        "required": true,
        "description": "指向产品级目的地的主链接。"
      },
      {
        "name": "更多菜单",
        "required": false,
        "description": "用于额外导航项的溢出菜单。"
      },
      {
        "name": "弹性区域",
        "required": false,
        "description": "用于搜索、主要操作按钮或其他控件的弹性区域。"
      }
    ]
  },
  "name": "TopNav",
  "displayName": "Top Nav",
  "description": "基于插槽布局的主导航栏容器。children 作为 startContent 的别名被接受。",
  "propDescriptions": {
    "heading": "heading 插槽内容（徽标、品牌）：位于导航栏左边缘。",
    "startContent": "用于导航项或面包屑的起始内容插槽：位于 heading 之后，左对齐。",
    "children": "startContent 的别名。与 heading、centerContent 或 endContent 组合时优先使用 startContent；children 可避免常见的 React 导航项模式悄悄丢弃项目。",
    "centerContent": "中间内容插槽（标签页、搜索栏、主导航）：提供后，布局切换为三个区域，在能容纳一行时将其中置于栏的中间；容不下时栏会换行。",
    "endContent": "用于搜索、图标或用户资料的结束内容插槽：位于右边缘。",
    "label": "导航地标的无障碍标签，作为 aria-label 应用于 <nav> 元素。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 值，而不是像 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "TopNavHeading",
      "description": ""
    },
    {
      "name": "TopNavItem",
      "description": ""
    },
    {
      "name": "TopNavMenu",
      "description": ""
    },
    {
      "name": "TopNavMegaMenu",
      "description": ""
    },
    {
      "name": "TopNavMegaMenuItem",
      "description": ""
    },
    {
      "name": "TopNavMegaMenuFeaturedCard",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description: 'Top navigation bar for app headers w/ slot-based layout+companion nav item components.',
  usage: {
    description:
      'TopNav is a horizontal navigation bar for product-level navigation in application headers. Use TopNav for 5 or fewer always-visible navigation items, or minimal navigation paired with search and controls. For complex navigation hierarchies, use a sidebar; to filter content, use tabs or filter buttons instead.',
    bestPractices: [
      {guidance: true, description: 'Include a product logo and name in the heading slot to clearly identify the application.'},
      {guidance: true, description: 'Limit primary navigation items to 5 or fewer for quick scanning and minimal cognitive load.'},
      {guidance: false, description: 'Avoid using TopNav to filter page content; use Tabs or filter controls instead.'},
      {guidance: false, description: 'Avoid deeply nested navigation hierarchies; keep menus to one level of depth.'},
    ],
    anatomy: [
      {name: 'Product icon and name', required: true, description: 'Identifies the product in the navigation bar.'},
      {name: 'Navigation items', required: true, description: 'Primary links for product-level destinations.'},
      {name: 'More menu', required: false, description: 'Overflow menu for additional navigation items.'},
      {name: 'Flex area', required: false, description: 'Flexible region for search, primary action buttons, or other controls.'},
    ],
  },
};
