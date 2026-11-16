// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNavMegaMenu',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Mega Menu',
  description: 'Navigation item that displays a full-width mega menu panel on hover. Uses a slots API with items and featured props. TopNavMegaMenuItem renders itself in both desktop and mobile drawer modes. Supports inline collapsible drawer via render mode context.',
  // The panel anchors to the nearest <nav>; wrap the preview in a TopNav so
  // it opens below the bar instead of pinning to the viewport corner (#4905).
  playground: {
    wrapper: {component: 'TopNav'},
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Visible label for the trigger button.',
      required: true,
    },
    {
      name: 'items',
      type: 'ReactNode',
      description: 'Menu items slot: typically TopNavMegaMenuItem components, but accepts any ReactNode.',
      slotElements: [
        {
          __element: 'TopNavItem',
          props: {
            label: 'Item',
            href: '#',
          },
        },
      ],
    },
    {
      name: 'featured',
      type: 'ReactNode',
      description: 'Featured content slot: rendered in the right panel on desktop, below items in the mobile drawer.',
      slotElements: [
        {
          __element: 'Card',
          props: {
            padding: 4,
          },
          children: 'Featured content',
        },
      ],
    },
    {
      name: 'delay',
      type: 'number',
      description: 'Delay in milliseconds before showing the menu on hover.',
      default: '150',
    },
    {
      name: 'hideDelay',
      type: 'number',
      description: 'Delay in milliseconds before hiding the menu after the mouse leaves.',
      default: '250',
    },
    {
      name: 'onOpenChange',
      type: '(isOpen: boolean) => void',
      description: 'Callback fired when the mega menu opens or closes. Useful for coordinating wrapper styles.',
    },
  ],
};

export const docsZh = {
  "name": "TopNavMegaMenu",
  "displayName": "Top Nav Mega Menu",
  "description": "悬停时显示全宽大型菜单面板的导航项。使用包含 `items` 和 `featured` 属性的插槽 API。`TopNavMegaMenuItem` 在桌面和移动抽屉模式下都会自行渲染。支持通过渲染模式上下文实现内联可折叠抽屉。",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "触发按钮的可见标签。",
      "required": true
    },
    {
      "name": "items",
      "type": "ReactNode",
      "description": "菜单项插槽：通常为 `TopNavMegaMenuItem` 组件，但也接受任意 `ReactNode`。"
    },
    {
      "name": "featured",
      "type": "ReactNode",
      "description": "精选内容插槽：在桌面端渲染在右侧面板中，在移动抽屉中渲染在菜单项下方。"
    },
    {
      "name": "delay",
      "type": "number",
      "description": "悬停显示菜单前的延迟，单位为毫秒。",
      "default": "150"
    },
    {
      "name": "hideDelay",
      "type": "number",
      "description": "鼠标离开后隐藏菜单前的延迟，单位为毫秒。",
      "default": "250"
    },
    {
      "name": "onOpenChange",
      "type": "(isOpen: boolean) => void",
      "description": "大型菜单打开或关闭时触发的回调。适合用于协调外层包装样式。"
    }
  ],
  "propDescriptions": {
    "label": "触发按钮的可见标签。",
    "items": "菜单项插槽：通常为 `TopNavMegaMenuItem` 组件，但也接受任意 `ReactNode`。",
    "featured": "精选内容插槽：在桌面端渲染在右侧面板中，在移动抽屉中渲染在菜单项下方。",
    "delay": "悬停显示菜单前的延迟，单位为毫秒。",
    "hideDelay": "鼠标离开后隐藏菜单前的延迟，单位为毫秒。",
    "onOpenChange": "大型菜单打开或关闭时触发的回调。适合用于协调外层包装样式。"
  }
};

export const docsDense = {
  name: 'TopNavMegaMenu',
  displayName: 'Top Nav Mega Menu',
  description: 'Nav item w/ full-width mega menu panel on hover. Slots API w/ items+featured ReactNode props. Mobile drawer inline collapsible.',
  propDescriptions: {
    label: 'Trigger button visible label.',
    items: 'Menu items slot: typically TopNavMegaMenuItem, accepts any ReactNode.',
    featured: 'Featured content slot: right panel desktop, below items in drawer.',
    delay: 'Show delay ms on hover.',
    hideDelay: 'Hide delay ms after mouse leaves.',
    onOpenChange: 'Fired on open/close. For coordinating wrapper styles.',
  },
};
