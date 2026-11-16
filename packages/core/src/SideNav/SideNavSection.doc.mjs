// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'SideNavSection',
  subComponentOf: 'SideNav',
  displayName: 'Side Nav Section',
  isHiddenFromOverview: true,
  description: 'Section grouping with an optional title, subtitle, and end content.',
  playground: {
    defaults: {
      title: 'Workspace',
      children: [
        {__element: 'SideNavItem', props: {label: 'Dashboard', isSelected: true}},
        {__element: 'SideNavItem', props: {label: 'Projects'}},
        {__element: 'SideNavItem', props: {label: 'Settings'}},
      ],
    },
  },
  props: [
    {
      name: 'title',
      type: 'string',
      description: 'Section title.',
      required: true,
    },
    {
      name: 'subtitle',
      type: 'string',
      description: 'Section subtitle.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Section items.',
      slotElements: [
        {
          __element: 'SideNavItem',
          props: {
            label: 'Item',
          },
        },
      ],
    },
    {
      name: 'endContent',
      type: 'ReactNode',
      description: 'Right-side content in the section header.',
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
      name: 'isHeaderHidden',
      type: 'boolean',
      description: 'Visually hides the section header while keeping it accessible to screen readers.',
      default: 'false',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description: 'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
};

export const docsZh = {
  "name": "SideNavSection",
  "isHiddenFromOverview": true,
  "displayName": "Side Nav Section",
  "description": "带可选标题、副标题和尾部内容的分组区域。",
  "props": [
    {
      "name": "title",
      "type": "string",
      "description": "区域标题。",
      "required": true
    },
    {
      "name": "subtitle",
      "type": "string",
      "description": "区域副标题。"
    },
    {
      "name": "children",
      "type": "ReactNode",
      "description": "区域内的项目。"
    },
    {
      "name": "endContent",
      "type": "ReactNode",
      "description": "区域头部右侧的内容。"
    },
    {
      "name": "isHeaderHidden",
      "type": "boolean",
      "description": "在视觉上隐藏区域头部，同时保持其对屏幕阅读器可访问。",
      "default": "false"
    }
  ],
  "propDescriptions": {
    "title": "区域标题。",
    "subtitle": "区域副标题。",
    "children": "区域内的项目。",
    "endContent": "区域头部右侧的内容。",
    "isHeaderHidden": "在视觉上隐藏区域头部，同时保持其对屏幕阅读器可访问。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  }
};

export const docsDense = {
  name: 'SideNavSection',
  isHiddenFromOverview: true,
  displayName: 'Side Nav Section',
  description: 'Section grouping w/ optional title, subtitle, end content.',
  propDescriptions: {
    title: 'Section title.',
    subtitle: 'Section subtitle.',
    children: 'Section items.',
    endContent: 'Right-side content in section header.',
    isHeaderHidden: 'Visually hides section header while keeping accessible to screen readers.',
    xstyle: 'StyleX styles for layout customization.',
  },
};
