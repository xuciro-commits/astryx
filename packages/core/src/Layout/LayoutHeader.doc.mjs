// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'LayoutHeader',
  subComponentOf: 'Layout',
  displayName: 'Layout Header',
  keywords: ['pageheader', 'appheader', 'header'],
  isHiddenFromOverview: true,
  description: 'Top bar for page titles, app bars, and toolbars.',
  playground: {
    defaults: {
      children: 'Page Title',
      hasDivider: true,
    },
    wrapper: {
      component: 'Layout',
    },
  },
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Header content.',
    },
    {
      name: 'hasDivider',
      type: 'boolean',
      description:
        "Border at bottom edge. When unset, the parent Layout's defaultHasDividers decides.",
      default: 'false',
    },
    {
      name: 'height',
      type: 'SizeValue',
      description:
        'Header height. Numbers are treated as pixels, strings are used as-is.',
    },
    {
      name: 'label',
      type: 'string',
      description: 'Accessible label for the landmark element.',
    },
    {
      name: 'padding',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Internal padding on every edge, using the spacing scale. Replaces the inset from the layout; 0 is full bleed.',
    },
    {
      name: 'paddingBlockEnd',
      type: '0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10',
      description:
        'Block-end (bottom) padding, using the spacing scale. Overrides padding on that edge only; paddingBlockEnd={0} docks the last child on the header bottom edge.',
    },
    {
      name: 'role',
      type: 'AriaRole',
      description: 'ARIA landmark role.',
    },
    {
      name: 'ref',
      type: 'React.Ref<HTMLDivElement>',
      description: 'Ref forwarded to the header element.',
    },
  ],
};

export const docsZh = {
  "name": "LayoutHeader",
  "isHiddenFromOverview": true,
  "displayName": "Layout Header",
  "description": "用于页面标题、应用栏和工具栏的顶部栏。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "头部内容。"
    },
    {
      "name": "hasDivider",
      "type": "boolean",
      "description": "底边边框。未设置时，由父级 Layout 的 defaultHasDividers 决定。",
      "default": "false"
    },
    {
      "name": "height",
      "type": "SizeValue",
      "description": "头部高度。数字按像素处理，字符串按原样使用。"
    },
    {
      "name": "label",
      "type": "string",
      "description": "地标元素的无障碍标签。"
    },
    {
      "name": "padding",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "每条边的内部内边距，使用间距刻度。会替换来自布局的内缩；设为 0 即为通栏。"
    },
    {
      "name": "paddingBlockEnd",
      "type": "0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10",
      "description": "块级末端（底部）内边距，使用间距刻度。仅覆盖该边的 padding；paddingBlockEnd={0} 会让最后一个子元素紧贴头部底边。"
    },
    {
      "name": "role",
      "type": "AriaRole",
      "description": "ARIA 地标角色。"
    },
    {
      "name": "ref",
      "type": "React.Ref<HTMLDivElement>",
      "description": "转发到头部元素的 ref。"
    }
  ],
  "propDescriptions": {
    "children": "头部内容。",
    "hasDivider": "底边边框。未设置时，由父级 Layout 的 defaultHasDividers 决定。",
    "height": "头部高度。数字按像素处理，字符串按原样使用。",
    "label": "地标元素的无障碍标签。",
    "padding": "每条边的内部内边距，使用间距刻度。会替换来自布局的内缩；设为 0 即为通栏。",
    "paddingBlockEnd": "块级末端（底部）内边距，使用间距刻度。仅覆盖该边的 padding；paddingBlockEnd={0} 会让最后一个子元素紧贴头部底边。",
    "role": "ARIA 地标角色。",
    "ref": "转发到头部元素的 ref。"
  }
};

export const docsDense = {
  name: 'LayoutHeader',
  isHiddenFromOverview: true,
  displayName: 'Layout Header',
  description: 'Top bar for page titles, app bars, toolbars.',
  propDescriptions: {
    children: 'Header content.',
    hasDivider: 'Border at bottom edge; unset uses the Layout default.',
    height: 'Header height.',
    label: 'Accessible label for landmark element.',
    padding:
      'Padding on every edge; replaces the layout inset. 0 is full bleed.',
    paddingBlockEnd:
      'Block-end (bottom) padding override; wins over padding on that edge. 0 docks the last child on the header bottom edge.',
    role: 'ARIA landmark role.',
    ref: 'Ref forwarded to the header element.',
  },
};
