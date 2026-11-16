// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'ContextMenuItem',
  subComponentOf: 'ContextMenu',
  displayName: 'Context Menu Item',
  isHiddenFromOverview: true,
  description: 'Menu item component for compound mode. Re-exported from DropdownMenuItem for discoverability.',
  props: [
    {
      name: 'icon',
      type: 'IconType',
      description: 'Icon to display before the label.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Primary label text.',
    },
    {
      name: 'description',
      type: 'ReactNode',
      description: 'Secondary description text displayed below the label.',
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Additional content rendered after the label and description.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization.',
    },
  ],
  playground: {
    defaults: {
      label: 'Edit',
      description: 'Modify this item',
    },
  },
};

export const docsZh = {
  "name": "ContextMenuItem",
  "isHiddenFromOverview": true,
  "displayName": "Context Menu Item",
  "description": "复合模式使用的菜单项组件。为便于发现，从 DropdownMenuItem 重新导出。",
  "props": [
    {
      "name": "icon",
      "type": "IconType",
      "description": "显示在标签之前的图标。"
    },
    {
      "name": "label",
      "type": "ReactNode",
      "description": "主标签文本。"
    },
    {
      "name": "description",
      "type": "ReactNode",
      "description": "显示在标签下方的辅助描述文本。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "渲染在标签和描述之后的附加内容。"
    },
    {
      "name": "xstyle",
      "type": "StyleXStyles",
      "description": "用于布局自定义的 StyleX 样式。"
    }
  ],
  "propDescriptions": {
    "icon": "显示在标签之前的图标。",
    "label": "主标签文本。",
    "description": "显示在标签下方的辅助描述文本。",
    "endContent": "渲染在标签和描述之后的附加内容。",
    "xstyle": "用于布局自定义的 StyleX 样式。"
  }
};

export const docsDense = {
  name: 'ContextMenuItem',
  isHiddenFromOverview: true,
  displayName: 'Context Menu Item',
  description: 're-exported DropdownMenuItem for compound mode',
  propDescriptions: {
    icon: 'icon before label',
    label: 'primary label text',
    description: 'secondary text below label',
    endContent: 'additional content after label+description',
    xstyle: 'StyleX styles for root container',
  },
};
