// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableSelection',
  subComponentOf: 'Table',
  displayName: 'useTableSelection',
  description:
    'Hook that returns a TablePlugin implementing row selection with checkboxes, select-all, and aria-selected. Uses React Context for independent checkbox re-renders.',
  props: [
    {
      name: 'getIsItemSelected',
      type: '(item: T) => boolean',
      description: 'Returns whether the given item is currently selected.',
      required: true,
    },
    {
      name: 'onSelectItem',
      type: '(event: {item: T; isSelected: boolean}) => void',
      description:
        'Called when a row checkbox is toggled. isSelected is the new desired state.',
      required: true,
    },
    {
      name: 'onSelectAll',
      type: '(event: {isAllSelected: boolean}) => void',
      description: 'Called when the select-all header checkbox is toggled.',
      required: true,
    },
    {
      name: 'getIsAllSelected',
      type: '() => boolean',
      description:
        'Returns whether all selectable items are currently selected.',
      required: true,
    },
    {
      name: 'getIsIndeterminate',
      type: '() => boolean',
      description:
        'Returns whether selection is partial (some but not all). Renders the select-all checkbox in indeterminate state.',
    },
    {
      name: 'getIsItemSelectable',
      type: '(item: T) => boolean',
      description:
        'Returns whether a row should show a checkbox. Non-selectable rows render nothing in the selection cell.',
      default: '() => true',
    },
    {
      name: 'getIsItemEnabled',
      type: '(item: T) => boolean',
      description:
        'Returns whether a row checkbox is interactive. Disabled rows show a disabled checkbox.',
      default: '() => true',
    },
    {
      name: 'getRowLabel',
      type: '(item: T) => string',
      description:
        'Derives a human-readable identity for a row; the row checkbox\'s hidden label becomes `Select ${getRowLabel(item)}` so screen readers announce which row each checkbox selects. Falls back to "Select row" when omitted.',
    },
    {
      name: 'hasRowHighlight',
      type: 'boolean',
      description:
        'Paints checked rows with the accent wash. Set false when the surrounding UI already uses row background to mean something else (a row open in a detail panel, say). The wash is an inline style, so it cannot be overridden from userland. Only the background is dropped: aria-selected is still set on checked rows either way.',
      default: 'true',
    },
  ],
  examples: [
    {
      label: 'Accessible per-row checkbox names',
      code: `
const selectionPlugin = useTableSelection({
  getIsItemSelected: item => selectedIds.has(item.id),
  onSelectItem: ({item, isSelected}) => toggle(item.id, isSelected),
  onSelectAll: ({isAllSelected}) => selectAll(isAllSelected),
  getIsAllSelected: () => selectedIds.size === users.length,
  // Screen readers announce "Select Alice", "Select Bob", ...
  // instead of an undifferentiated "Select row" for every checkbox.
  getRowLabel: item => item.name,
});

<Table
  data={users}
  columns={columns}
  idKey="id"
  plugins={{selection: selectionPlugin}}
/>;
`,
    },
    {
      label: 'Opt out of the checked-row wash',
      code: `
// This table already uses row background to mean "open in the detail
// panel". Turning the selection wash off keeps that meaning unambiguous;
// the checkbox and aria-selected still carry the selection.
const selectionPlugin = useTableSelection({
  getIsItemSelected: item => selectedIds.has(item.id),
  onSelectItem: ({item, isSelected}) => toggle(item.id, isSelected),
  onSelectAll: ({isAllSelected}) => selectAll(isAllSelected),
  getIsAllSelected: () => selectedIds.size === users.length,
  hasRowHighlight: false,
});
`,
    },
  ],
};

export const docsZh = {
  "name": "useTableSelection",
  "displayName": "useTableSelection",
  "description": "返回 TablePlugin 的 Hook，该插件实现带复选框、全选和 aria-selected 的行选择。使用 React Context 实现独立的复选框重渲染。",
  "props": [
    {
      "name": "getIsItemSelected",
      "type": "(item: T) => boolean",
      "description": "返回给定条目当前是否被选中。",
      "required": true
    },
    {
      "name": "onSelectItem",
      "type": "(event: {item: T; isSelected: boolean}) => void",
      "description": "当行复选框被切换时调用。isSelected 是新的期望状态。",
      "required": true
    },
    {
      "name": "onSelectAll",
      "type": "(event: {isAllSelected: boolean}) => void",
      "description": "当全选页眉复选框被切换时调用。",
      "required": true
    },
    {
      "name": "getIsAllSelected",
      "type": "() => boolean",
      "description": "返回当前是否所有可选择条目都被选中。",
      "required": true
    },
    {
      "name": "getIsIndeterminate",
      "type": "() => boolean",
      "description": "返回选择是否为部分状态（选中部分但非全部）。将全选复选框渲染为不确定状态。"
    },
    {
      "name": "getIsItemSelectable",
      "type": "(item: T) => boolean",
      "description": "返回某行是否应显示复选框。不可选择的行在选择单元格中不渲染任何内容。",
      "default": "() => true"
    },
    {
      "name": "getIsItemEnabled",
      "type": "(item: T) => boolean",
      "description": "返回行复选框是否可交互。禁用的行显示禁用的复选框。",
      "default": "() => true"
    },
    {
      "name": "getRowLabel",
      "type": "(item: T) => string",
      "description": "为行派生人类可读的标识；行复选框的隐藏标签会变成 `Select ${getRowLabel(item)}`，以便屏幕阅读器宣布每个复选框选择哪一行。省略时回退到 \"Select row\"。"
    },
    {
      "name": "hasRowHighlight",
      "type": "boolean",
      "description": "用强调色为选中的行着色。当周围 UI 已使用行背景表示其他含义（例如在详情面板中打开的行）时设为 false。该着色是内联样式，因此无法从用户代码覆盖。只会去掉背景：无论哪种方式，选中行上仍会设置 aria-selected。",
      "default": "true"
    }
  ],
  "propDescriptions": {
    "getIsItemSelected": "返回给定条目当前是否被选中。",
    "onSelectItem": "当行复选框被切换时调用。isSelected 是新的期望状态。",
    "onSelectAll": "当全选页眉复选框被切换时调用。",
    "getIsAllSelected": "返回当前是否所有可选择条目都被选中。",
    "getIsIndeterminate": "返回选择是否为部分状态（选中部分但非全部）。将全选复选框渲染为不确定状态。",
    "getIsItemSelectable": "返回某行是否应显示复选框。不可选择的行在选择单元格中不渲染任何内容。",
    "getIsItemEnabled": "返回行复选框是否可交互。禁用的行显示禁用的复选框。",
    "getRowLabel": "为行派生人类可读的标识；行复选框的隐藏标签会变成 `Select ${getRowLabel(item)}`，以便屏幕阅读器宣布每个复选框选择哪一行。省略时回退到 \"Select row\"。",
    "hasRowHighlight": "用强调色为选中的行着色。当周围 UI 已使用行背景表示其他含义（例如在详情面板中打开的行）时设为 false。该着色是内联样式，因此无法从用户代码覆盖。只会去掉背景：无论哪种方式，选中行上仍会设置 aria-selected。"
  }
};

export const docsDense = {
  name: 'useTableSelection',
  displayName: 'useTableSelection',
  description:
    'Hook returning TablePlugin for row selection w/ checkboxes, select-all, aria-selected. Uses React Context for independent checkbox re-renders.',
  propDescriptions: {
    getIsItemSelected: 'Returns whether item is selected.',
    onSelectItem:
      'Called on row checkbox toggle; isSelected = new desired state.',
    onSelectAll: 'Called on select-all header checkbox toggle.',
    getIsAllSelected: 'Returns whether all selectable items are selected.',
    getIsIndeterminate:
      'Returns partial selection state; renders indeterminate checkbox.',
    getIsItemSelectable:
      'Returns whether row shows checkbox; non-selectable rows render nothing.',
    getIsItemEnabled:
      'Returns whether row checkbox is interactive; disabled rows show disabled checkbox.',
    getRowLabel:
      'Derives row identity for the checkbox\'s hidden label: `Select ${getRowLabel(item)}`. Falls back to "Select row" when omitted.',
    hasRowHighlight:
      'false => skip the accent wash on checked rows (inline style, not overridable from userland). aria-selected is unaffected. Defaults to true.',
  },
};
