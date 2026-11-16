// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableSortable',
  subComponentOf: 'Table',
  displayName: 'useTableSortable',
  description: 'Headless multi-sort plugin for Table. Call with a config object: `useTableSortable({ sort, onSortChange })`. Returns a TablePlugin to pass to `<Table plugins={{ sort: sortPlugin }} />`.',
  usage: {
    description: 'Call useTableSortable with a config object containing sort state and callback. Pass the returned plugin to Table via the plugins prop.',
  },
  props: [
    {
      name: 'sort',
      type: "Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>",
      description: "Current sort state (TableSortState<TSortKey>). Ordered array of entries; the first is the primary sort, the rest are tiebreakers. An empty array means unsorted. Direction is the full word: 'ascending' / 'descending', not 'asc' / 'desc'.",
      required: true,
    },
    {
      name: 'onSortChange',
      type: "(sort: Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>) => void",
      description: 'Called when the user clicks a header cell to change sort. Receives the next sort state.',
      required: true,
    },
    {
      name: 'allowUnsortedState',
      type: 'boolean',
      description: "Allow cycling back to unsorted. When true: 'ascending', 'descending', unsorted. When false: 'ascending', 'descending', 'ascending'.",
      default: 'false',
    },
    {
      name: 'isMultiSortEnabled',
      type: 'boolean',
      description: 'Enable multi-sort via Shift+click. Regular click still replaces the entire sort state.',
      default: 'false',
    },
  ],
};

export const docsZh = {
  "name": "useTableSortable",
  "displayName": "useTableSortable",
  "description": "Table 的无头多列排序插件。使用配置对象调用：`useTableSortable({ sort, onSortChange })`。返回一个 TablePlugin，可传给 `<Table plugins={{ sort: sortPlugin }} />`。",
  "props": [
    {
      "name": "sort",
      "type": "Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>",
      "description": "当前排序状态（TableSortState<TSortKey>）。有序的条目数组；第一个是主排序，其余是次级排序。空数组表示未排序。方向使用完整单词：'ascending' / 'descending'，而不是 'asc' / 'desc'。",
      "required": true
    },
    {
      "name": "onSortChange",
      "type": "(sort: Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>) => void",
      "description": "当用户点击表头单元格以更改排序时调用。接收下一个排序状态。",
      "required": true
    },
    {
      "name": "allowUnsortedState",
      "type": "boolean",
      "description": "允许循环回到未排序状态。为 true 时：'ascending'、'descending'、未排序。为 false 时：'ascending'、'descending'、'ascending'。",
      "default": "false"
    },
    {
      "name": "isMultiSortEnabled",
      "type": "boolean",
      "description": "通过 Shift+点击启用多列排序。常规点击仍会替换整个排序状态。",
      "default": "false"
    }
  ],
  "usage": {
    "description": "使用包含排序状态和回调的配置对象调用 useTableSortable。通过 plugins 属性将返回的插件传给 Table。"
  },
  "propDescriptions": {
    "sort": "当前排序状态（TableSortState<TSortKey>）。有序的条目数组；第一个是主排序，其余是次级排序。空数组表示未排序。方向使用完整单词：'ascending' / 'descending'，而不是 'asc' / 'desc'。",
    "onSortChange": "当用户点击表头单元格以更改排序时调用。接收下一个排序状态。",
    "allowUnsortedState": "允许循环回到未排序状态。为 true 时：'ascending'、'descending'、未排序。为 false 时：'ascending'、'descending'、'ascending'。",
    "isMultiSortEnabled": "通过 Shift+点击启用多列排序。常规点击仍会替换整个排序状态。"
  }
};

export const docsDense = {
  name: 'useTableSortable',
  displayName: 'useTableSortable',
  description: 'Headless multi-sort plugin. Consumer owns sort state + callback. Shift+click for secondary sort. Sort indicators auto-render in header cells.',
  propDescriptions: {
    sort: "Current sort state; ordered array of {sortKey, direction: 'ascending'|'descending'} entries. Not 'asc'/'desc'.",
    onSortChange: 'Called on header click to change sort.',
    allowUnsortedState: "Allow cycling to unsorted. true: ascending>descending>unsorted. false: ascending>descending>ascending.",
    isMultiSortEnabled: 'Enable multi-sort via Shift+click. Regular click replaces sort state.',
  },
};
