// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableStickyColumns',
  subComponentOf: 'Table',
  displayName: 'useTableStickyColumns',
  description:
    'Hook that returns a TablePlugin which pins a contiguous run of columns to the start and/or end edge of the table. Pinned columns get cumulative offsets and a soft, scroll-aware shadow over the scrolling content. An empty config ({}) is a valid no-op that pins nothing.',
  props: [
    {
      name: 'startKeys',
      type: 'string[]',
      description:
        'Column keys pinned to the start (inline-start / left in LTR) edge: the contiguous run from the first column through the last listed key.',
    },
    {
      name: 'endKeys',
      type: 'string[]',
      description:
        'Column keys pinned to the end (inline-end / right in LTR) edge: the contiguous run from the first listed key through the last column.',
    },
  ],
};

export const docsZh = {
  "name": "useTableStickyColumns",
  "displayName": "useTableStickyColumns",
  "description": "返回 TablePlugin 的 Hook，该插件将连续的一组列固定在表格的起始和/或结束边缘。固定列获得累积偏移量，并在滚动内容上显示柔和的、感知滚动的阴影。空配置（{}）是有效的无操作配置，不固定任何列。",
  "props": [
    {
      "name": "startKeys",
      "type": "string[]",
      "description": "固定在起始（行内起始 / LTR 中为左）边缘的列键：从第一列到所列最后一个键的连续区间。"
    },
    {
      "name": "endKeys",
      "type": "string[]",
      "description": "固定在结束（行内结束 / LTR 中为右）边缘的列键：从所列第一个键到最后一列的连续区间。"
    }
  ],
  "propDescriptions": {
    "startKeys": "固定在起始（行内起始 / LTR 中为左）边缘的列键：从第一列到所列最后一个键的连续区间。",
    "endKeys": "固定在结束（行内结束 / LTR 中为右）边缘的列键：从所列第一个键到最后一列的连续区间。"
  }
};

export const docsDense = {
  name: 'useTableStickyColumns',
  displayName: 'useTableStickyColumns',
  description:
    'Hook returning TablePlugin that pins contiguous column runs to start/end edges w/ cumulative offsets + scroll-aware shadow. Empty config = no-op.',
  propDescriptions: {
    startKeys:
      'Column keys pinned to the start edge (contiguous run from column 0 through the last listed key).',
    endKeys:
      'Column keys pinned to the end edge (contiguous run from the first listed key through the last column).',
  },
};
