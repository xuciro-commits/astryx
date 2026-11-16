// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableFiltering',
  subComponentOf: 'Table',
  displayName: 'useTableFiltering',
  isHiddenFromOverview: true,
  description: 'Table plugin that adds inline column filters with popover or inline controls. Pairs with useTableFilterState for managed state. Supports text, select, multi-select, date, and number filter types via PowerSearch field definitions.',
  props: [
    {
      name: 'filters',
      type: 'TableFilterState',
      description: 'Current filter state: map from column key to filter value.',
      required: true,
    },
    {
      name: 'onFilterChange',
      type: '(columnKey: string, value: TableFilterValue | null) => void',
      description: 'Called when the user changes a filter value. null clears the filter.',
      required: true,
    },
    {
      name: 'variant',
      type: "'popover' | 'inline' | 'inline-compact'",
      description: 'Display variant for filter controls.',
      default: "'popover'",
    },
  ],
};

export const docsZh = {
  "name": "useTableFiltering",
  "isHiddenFromOverview": true,
  "displayName": "useTableFiltering",
  "description": "Table 插件，添加内联列筛选器，支持弹出层或内联控件。与 useTableFilterState 搭配以实现受管状态。通过 PowerSearch 字段定义支持文本、选择、多选、日期和数字筛选类型。",
  "props": [
    {
      "name": "filters",
      "type": "TableFilterState",
      "description": "当前筛选状态：从列键到筛选值的映射。",
      "required": true
    },
    {
      "name": "onFilterChange",
      "type": "(columnKey: string, value: TableFilterValue | null) => void",
      "description": "用户更改筛选值时调用。`null` 清除筛选。",
      "required": true
    },
    {
      "name": "variant",
      "type": "'popover' | 'inline' | 'inline-compact'",
      "description": "筛选控件的显示变体。",
      "default": "'popover'"
    }
  ],
  "propDescriptions": {
    "filters": "当前筛选状态：从列键到筛选值的映射。",
    "onFilterChange": "用户更改筛选值时调用。`null` 清除筛选。",
    "variant": "筛选控件的显示变体。"
  }
};

export const docsDense = {
  name: 'useTableFiltering',
  isHiddenFromOverview: true,
  displayName: 'useTableFiltering',
  description: 'Table filtering plugin: inline column filters (popover/inline). Pairs w/ useTableFilterState.',
  propDescriptions: {
    filters: 'Current filter state map (columnKey → value).',
    onFilterChange: 'Called on filter change. null clears.',
    variant: 'Filter control display variant.',
  },
};
