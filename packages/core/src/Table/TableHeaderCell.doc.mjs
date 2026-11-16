// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableHeaderCell',
  subComponentOf: 'Table',
  displayName: 'Table Header Cell',
  isHiddenFromOverview: true,
  description: '<th> wrapper that reads TableContext to apply density padding, semibold weight, secondary text color, and divider borders when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Header cell content.',
    },
  ],
};

export const docsZh = {
  "name": "TableHeaderCell",
  "isHiddenFromOverview": true,
  "displayName": "Table Header Cell",
  "description": "<th> 包装组件，在 Table 内使用时读取 TableContext 以应用密度内边距、半粗字重、次要文本颜色和分隔边框。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "表头单元格内容。"
    }
  ],
  "propDescriptions": {
    "children": "表头单元格内容。"
  }
};

export const docsDense = {
  name: 'TableHeaderCell',
  isHiddenFromOverview: true,
  displayName: 'Table Header Cell',
  description: '<th> wrapper; reads TableContext for density padding, semibold weight, secondary color, dividers.',
  propDescriptions: {
    children: 'Header cell content.',
  },
};
