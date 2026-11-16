// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TopNavItem',
  subComponentOf: 'TopNav',
  displayName: 'Top Nav Item',
  isHiddenFromOverview: true,
  description: 'Navigation link item for use in TopNav startContent: renders as an anchor with hover and selected states.',
  playground: {
    defaults: {label: 'Projects', href: '#', isSelected: true},
  },
  props: [
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the nav item. Rendered as visible text by default. When isIconOnly is true, used as aria-label instead.',
      required: true,
    },
    {
      name: 'href',
      type: 'string',
      description: 'Navigation target URL.',
    },
    {
      name: 'isSelected',
      type: 'boolean',
      description: 'Whether this nav item is currently selected. Sets aria-current="page" and applies highlighted styles.',
      default: 'false',
    },
    {
      name: 'isDisabled',
      type: 'boolean',
      description: 'Whether the nav item is disabled. Sets aria-disabled, drops href/target so the item cannot navigate, and prevents interaction.',
      default: 'false',
    },
    {
      name: 'isIconOnly',
      type: 'boolean',
      description: 'Renders the item as a square icon-only element. When true, label becomes the aria-label and visible text is hidden. Requires icon to be set.',
      default: 'false',
    },
    {
      name: 'icon',
      type: 'ReactNode',
      description: 'Optional icon to display before the label.',
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
      description: 'Custom content to render instead of the label text.',
    },
    {
      name: 'as',
      type: 'LinkComponentType',
      description: 'Custom component to render instead of <a>. Overrides the provider-level default set by LinkProvider. Must accept href, className, style, and children props.',
    },
  ],
};

export const docsZh = {
  "name": "TopNavItem",
  "isHiddenFromOverview": true,
  "displayName": "Top Nav Item",
  "description": "用于 TopNav startContent 的导航链接条目：渲染为带悬停和选中状态的锚点。",
  "props": [
    {
      "name": "label",
      "type": "string",
      "description": "导航条目的无障碍标签。默认渲染为可见文本。当 isIconOnly 为 true 时，改为用作 aria-label。",
      "required": true
    },
    {
      "name": "href",
      "type": "string",
      "description": "导航目标 URL。"
    },
    {
      "name": "isSelected",
      "type": "boolean",
      "description": "此导航条目当前是否被选中。设置 aria-current=\"page\" 并应用高亮样式。",
      "default": "false"
    },
    {
      "name": "isDisabled",
      "type": "boolean",
      "description": "导航条目是否禁用。设置 aria-disabled，移除 href/target 使条目无法导航，并阻止交互。",
      "default": "false"
    },
    {
      "name": "icon",
      "type": "ReactNode",
      "description": "显示在标签之前的可选图标。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "代替标签文本渲染的自定义内容。"
    },
    {
      "name": "as",
      "type": "LinkComponentType",
      "description": "代替 <a> 渲染的自定义组件。覆盖 LinkProvider 设置的 provider 级默认值。必须接受 href、className、style 和 children 属性。"
    }
  ],
  "propDescriptions": {
    "label": "导航条目的无障碍标签。默认渲染为可见文本。当 isIconOnly 为 true 时，改为用作 aria-label。",
    "href": "导航目标 URL。",
    "isSelected": "此导航条目当前是否被选中。设置 aria-current=\"page\" 并应用高亮样式。",
    "isDisabled": "导航条目是否禁用。设置 aria-disabled，移除 href/target 使条目无法导航，并阻止交互。",
    "isIconOnly": "将条目渲染为方形仅图标元素。为 true 时，label 成为 aria-label，可见文本被隐藏。要求设置 icon。",
    "icon": "显示在标签之前的可选图标。",
    "children": "代替标签文本渲染的自定义内容。",
    "as": "代替 <a> 渲染的自定义组件。覆盖 LinkProvider 设置的 provider 级默认值。必须接受 href、className、style 和 children 属性。"
  }
};

export const docsDense = {
  name: 'TopNavItem',
  isHiddenFromOverview: true,
  displayName: 'Top Nav Item',
  description: 'Nav link for TopNav startContent; renders as anchor w/ hover+selected states.',
  propDescriptions: {
    label: 'Visible text or aria-label when isIconOnly is true.',
    href: 'Navigation URL.',
    isSelected: 'Sets aria-current="page"+highlighted styles.',
    isDisabled: 'Sets aria-disabled, drops href/target (no navigation), prevents interaction.',
    icon: 'Icon before label.',
    children: 'Custom content instead of label text.',
    as: 'Custom link component. Overrides LinkProvider default. Must accept href, className, style, children.',
  },
};
