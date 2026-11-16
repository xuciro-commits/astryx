// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableSelectionState',
  subComponentOf: 'Table',
  displayName: 'useTableSelectionState',
  description:
    'State management companion for useTableSelection. Returns selectionConfig for the behaviour plugin plus selectionState for selection-aware UI such as TableSelectionToolbar. Handles disabled/selectable row filtering for select-all automatically: disabled rows are frozen (preserved across select-all/deselect-all), non-selectable rows are excluded.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description: 'The full data array rendered in the table.',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string)',
      description:
        'Key extractor: property name or function returning a unique string ID.',
      required: true,
    },
    {
      name: 'selectedKeys',
      type: 'Set<string>',
      description: 'Controlled set of selected item IDs.',
      required: true,
    },
    {
      name: 'setSelectedKeys',
      type: 'Dispatch<SetStateAction<Set<string>>>',
      description: 'Setter for the controlled selected keys.',
      required: true,
    },
    {
      name: 'getIsItemSelectable',
      type: '(item: T) => boolean',
      description:
        'Should this row show a checkbox? Non-selectable rows are excluded from select-all.',
      default: '() => true',
    },
    {
      name: 'getIsItemEnabled',
      type: '(item: T) => boolean',
      description:
        'Is this row checkbox interactive? Disabled rows are frozen: select-all preserves their state.',
      default: '() => true',
    },
  ],
};

export const docsDense = {
  name: 'useTableSelectionState',
  displayName: 'useTableSelectionState',
  description:
    'State companion for useTableSelection. Returns selectionConfig for the behavior plugin + selectionState for selection-aware UI. Handles disabled/selectable row filtering for select-all automatically: disabled rows frozen (state preserved across select-all/deselect-all), non-selectable rows excluded.',
  propDescriptions: {
    data: 'full data array rendered in table',
    idKey: 'key extractor: property name or fn returning unique string ID',
    selectedKeys: 'controlled set of selected item IDs',
    setSelectedKeys: 'setter for controlled selected keys',
    getIsItemSelectable:
      'Returns whether row shows checkbox; non-selectable rows excluded from select-all. Defaults to () => true.',
    getIsItemEnabled:
      'Returns whether row checkbox is interactive; disabled rows frozen: select-all preserves their state. Defaults to () => true.',
  },
};

export const docsZh = {
  "name": "useTableSelectionState",
  "description": "useTableSelection 的状态管理配套 Hook。返回用于行为插件的 selectionConfig，以及用于 TableSelectionToolbar 等感知选择的 UI 的 selectionState。自动处理全选时的禁用/可选行筛选：禁用行被冻结（在全选/取消全选时保留），不可选行被排除。",
  "propDescriptions": {
    "data": "表格中渲染的完整数据数组。",
    "idKey": "键提取器：属性名或返回唯一字符串 ID 的函数。",
    "selectedKeys": "受控的已选项 ID 集合。",
    "setSelectedKeys": "受控选中键的设置函数。",
    "getIsItemSelectable": "此行是否应显示复选框？不可选行会从全选中排除。",
    "getIsItemEnabled": "此行的复选框是否可交互？禁用行会被冻结：全选会保留其状态。"
  }
};
