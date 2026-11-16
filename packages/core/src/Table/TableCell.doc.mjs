// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableCell',
  subComponentOf: 'Table',
  displayName: 'Table Cell',
  isHiddenFromOverview: true,
  description: '<td> wrapper that reads TableContext to apply density padding, font size, and divider borders when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Cell content.',
    },
  ],
};

export const docsZh = {
  "name": "TableCell",
  "isHiddenFromOverview": true,
  "displayName": "Table Cell",
  "description": "`<td>` 包装组件，在 `Table` 内部使用时读取 `TableContext`，应用密度内边距、字号和分隔边框。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "单元格内容。"
    }
  ],
  "propDescriptions": {
    "children": "单元格内容。"
  }
};

export const docsDense = {
  name: 'TableCell',
  isHiddenFromOverview: true,
  displayName: 'Table Cell',
  description: '<td> wrapper; reads TableContext for density padding, font size, divider borders.',
  propDescriptions: {
    children: 'Cell content.',
  },
};
