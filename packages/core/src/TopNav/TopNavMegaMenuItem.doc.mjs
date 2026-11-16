// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNavMegaMenuItem',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Mega Menu Item',
  isHiddenFromOverview: true,
  description: 'An individual item inside an TopNavMegaMenu. Renders itself in both desktop (popover grid) and mobile drawer modes via render mode context.',
  props: [
    {
      name: 'title',
      type: 'string',
      description: 'Display title for the menu item.',
      required: true,
    },
    {
      name: 'description',
      type: 'string',
      description: 'Optional description text displayed below the title.',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Optional icon element displayed to the left.',
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
      name: 'href',
      type: 'string',
      description: 'URL to navigate to when clicked.',
    },
    {
      name: 'onClick',
      type: '() => void',
      description: 'Callback when item is clicked.',
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: 'Custom component to render instead of <a> for link items. Overrides the provider-level default set by LinkProvider.',
    },
  ],
};

export const docsZh = {
  "name": "TopNavMegaMenuItem",
  "isHiddenFromOverview": true,
  "displayName": "Top Nav Mega Menu Item",
  "description": "TopNavMegaMenu 中的单个项。通过渲染模式上下文，在桌面（弹出层网格）和移动抽屉两种模式下渲染自身。",
  "props": [
    {
      "name": "title",
      "type": "string",
      "description": "菜单项的显示标题。",
      "required": true
    },
    {
      "name": "description",
      "type": "string",
      "description": "显示在标题下方的可选描述文本。"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "显示在左侧的可选图标元素。"
    },
    {
      "name": "href",
      "type": "string",
      "description": "点击时要导航到的 URL。"
    },
    {
      "name": "onClick",
      "type": "() => void",
      "description": "点击项时的回调。"
    },
    {
      "name": "as",
      "type": "LinkComponentType",
      "description": "用于替代 <a> 渲染链接项的自定义组件。覆盖由 LinkProvider 设置的 Provider 级默认值。"
    }
  ],
  "propDescriptions": {
    "title": "菜单项的显示标题。",
    "description": "显示在标题下方的可选描述文本。",
    "icon": "显示在左侧的可选图标元素。",
    "href": "点击时要导航到的 URL。",
    "onClick": "点击项时的回调。",
    "as": "用于替代 <a> 渲染链接项的自定义组件。覆盖由 LinkProvider 设置的 Provider 级默认值。"
  }
};

export const docsDense = {
  name: 'TopNavMegaMenuItem',
  isHiddenFromOverview: true,
  displayName: 'Top Nav Mega Menu Item',
  description: 'Individual mega menu item. Renders in desktop popover grid + mobile drawer modes via context.',
  propDescriptions: {
    title: 'Display title.',
    description: 'Description below title.',
    icon: 'Left icon element.',
    href: 'Navigation URL.',
    onClick: 'Click callback.',
    as: 'Custom link component, overrides LinkProvider default.',
  },
};
