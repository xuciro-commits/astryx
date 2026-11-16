// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableColumnSettings',
  subComponentOf: 'Table',
  displayName: 'useTableColumnSettings',
  description: 'Headless column visibility and ordering management for Table. Provides filtered columns, toggle helpers, and pre-built MultiSelector options for a column picker UI.',
  props: [
    {
      name: 'columns',
      type: 'ColumnSettingsOption[]',
      description: 'All available columns with metadata for the settings UI. Each entry has key, label, optional isAlwaysVisible and group.',
      required: true,
    },
    {
      name: 'activeColumnKeys',
      type: 'string[]',
      description: 'Currently active column keys, in display order. Only columns with keys in this array are shown.',
      required: true,
    },
    {
      name: 'onChangeActiveColumnKeys',
      type: '(keys: string[]) => void',
      description: 'Called when active columns change (toggle, reorder).',
      required: true,
    },
    {
      name: 'defaultColumnKeys',
      type: 'string[]',
      description: 'Default column set for "Reset to default". When omitted, reset shows all columns.',
    },
  ],
};

export const docsZh = {
  "name": "useTableColumnSettings",
  "displayName": "useTableColumnSettings",
  "description": "`Table` 的无头列可见性与排序管理。提供筛选后的列、切换辅助函数，以及用于列选择器 UI 的预构建 `MultiSelector` 选项。",
  "props": [
    {
      "name": "columns",
      "type": "ColumnSettingsOption[]",
      "description": "所有可用列及其用于设置 UI 的元数据。每项包含 `key`、`label`，以及可选的 `isAlwaysVisible` 和 `group`。",
      "required": true
    },
    {
      "name": "activeColumnKeys",
      "type": "string[]",
      "description": "当前激活的列键，按显示顺序排列。仅显示键在此数组中的列。",
      "required": true
    },
    {
      "name": "onChangeActiveColumnKeys",
      "type": "(keys: string[]) => void",
      "description": "激活列发生变化（切换、重新排序）时调用。",
      "required": true
    }
  ],
  "propDescriptions": {
    "columns": "所有可用列及其用于设置 UI 的元数据。每项包含 `key`、`label`，以及可选的 `isAlwaysVisible` 和 `group`。",
    "activeColumnKeys": "当前激活的列键，按显示顺序排列。仅显示键在此数组中的列。",
    "onChangeActiveColumnKeys": "激活列发生变化（切换、重新排序）时调用。",
    "defaultColumnKeys": "“重置为默认值”所使用的默认列集合。省略时，重置会显示所有列。"
  }
};

export const docsDense = {
  name: 'useTableColumnSettings',
  displayName: 'useTableColumnSettings',
  description: 'Headless column visibility/ordering. Provides filtered columns, toggle helpers, MultiSelector options.',
  propDescriptions: {
    columns: 'All available columns w/ metadata (key, label, isAlwaysVisible, group).',
    activeColumnKeys: 'Active column keys in display order.',
    onChangeActiveColumnKeys: 'Called on column toggle/reorder.',
    defaultColumnKeys: 'Default column set for reset. Omit = show all.',
  },
};
