// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableRow',
  subComponentOf: 'Table',
  displayName: 'Table Row',
  isHiddenFromOverview: true,
  description: '<tr> wrapper that reads TableContext to apply striped, hover, and divider styles when used inside Table.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'Row cell elements.',
      required: true,
    },
  ],
};

export const docsZh = {
  "name": "TableRow",
  "isHiddenFromOverview": true,
  "displayName": "Table Row",
  "description": "<tr> 包装组件，在 Table 内使用时会读取 TableContext 以应用斑马纹、悬停和分隔线样式。",
  "props": [
    {
      "name": "children",
      "type": "ReactNode",
      "description": "行单元格元素。",
      "required": true
    }
  ],
  "propDescriptions": {
    "children": "行单元格元素。"
  }
};

export const docsDense = {
  name: 'TableRow',
  isHiddenFromOverview: true,
  displayName: 'Table Row',
  description: '<tr> wrapper; reads TableContext for striped/hover/divider styles.',
  propDescriptions: {
    children: 'Row cell elements.',
  },
};
