// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNavMenu',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Menu',
  description: 'Navigation item that displays a hover-triggered popover menu with rich items containing an icon, title, and optional description.',
  playground: {
    defaults: {
      label: 'Products',
      items: [
        {title: 'Analytics', description: 'Usage metrics and trends', href: '#'},
        {title: 'Automation', description: 'Workflows and rules', href: '#'},
        {title: 'Billing', href: '#'},
      ],
    },
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
      type: 'TopNavMenuItemData[]',
      description: 'Menu items to display in the hover popover. Item href values follow the shared navigation rule described on Link; rejected destinations remain visible without navigation.',
      required: true,
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
      default: '200',
    },
  ],
};

export const docsZh = {
  "name": "TopNavMenu",
  "displayName": "Top Nav Menu",
  "description": "显示悬停触发弹出菜单的导航项，菜单项内容丰富，包含图标、标题和可选描述。",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "触发按钮的可见标签。",
      "required": true
    },
    {
      "name": "items",
      "type": "TopNavMenuItemData[]",
      "description": "在悬停弹出框中显示的菜单项。项的 href 值遵循 Link 上所述的共享导航规则；被拒绝的目标仍可见但不可导航。",
      "required": true
    },
    {
      "name": "delay",
      "type": "number",
      "description": "悬停时显示菜单前的延迟（毫秒）。",
      "default": "150"
    },
    {
      "name": "hideDelay",
      "type": "number",
      "description": "鼠标离开后隐藏菜单前的延迟（毫秒）。",
      "default": "200"
    }
  ],
  "propDescriptions": {
    "label": "触发按钮的可见标签。",
    "items": "在悬停弹出框中显示的菜单项。项的 href 值遵循 Link 上所述的共享导航规则；被拒绝的目标仍可见但不可导航。",
    "delay": "悬停时显示菜单前的延迟（毫秒）。",
    "hideDelay": "鼠标离开后隐藏菜单前的延迟（毫秒）。"
  }
};

export const docsDense = {
  name: 'TopNavMenu',
  displayName: 'Top Nav Menu',
  description: 'Nav item w/ hover-triggered popover menu containing rich items w/ icon, title, optional description.',
  propDescriptions: {
    label: 'Trigger button visible label.',
    items: 'Menu items in hover popover. href follows the Link navigation rule; rejected destinations do not navigate.',
    delay: 'Show delay ms on hover.',
    hideDelay: 'Hide delay ms after mouse leaves.',
  },
};
