// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTableSortableState',
  displayName: 'useTableSortableState',
  group: 'Table',
  keywords: [
    'table',
    'sort',
    'sorting',
    'multi-sort',
    'sort state',
    'comparator',
    'useTableSortable',
    'local sort',
  ],
  params: [
    {
      name: 'config',
      type: 'UseTableSortableStateConfig<T, TSortKey>',
      description: 'The rows to sort and how the sort state is owned.',
      required: true,
    },
    {
      name: 'config.data',
      type: 'T[]',
      description:
        'Rows to sort. The hook returns a sorted copy and never mutates the array.',
      required: true,
    },
    {
      name: 'config.defaultSort',
      type: "Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>",
      description:
        'Initial sort state when the hook owns it. Ignored when sort is passed.',
      default: '[]',
      required: false,
    },
    {
      name: 'config.sort',
      type: "Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>",
      description:
        'Controlled sort state. Pass it with onSortChange to own the state yourself.',
      required: false,
    },
    {
      name: 'config.onSortChange',
      type: "(sort: Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>) => void",
      description:
        'Called with the next sort state. Required when sort is passed.',
      required: false,
    },
    {
      name: 'config.comparators',
      type: 'Partial<Record<TSortKey, (a: T, b: T) => number>>',
      description:
        'Ascending comparators per sort key; the hook flips the result for descending. Keys without one compare numbers numerically, compare other values as strings with a numeric collator in the active InternationalizationProvider locale, and put null, undefined and NaN last in ascending order and first in descending.',
      required: false,
    },
    {
      name: 'config.allowUnsortedState',
      type: 'boolean',
      description:
        "Passed to useTableSortable: a third click on a header returns the column to unsorted instead of 'ascending'.",
      default: 'true',
      required: false,
    },
    {
      name: 'config.isMultiSortEnabled',
      type: 'boolean',
      description:
        'Passed to useTableSortable: Shift+click on a header adds that column as the next sort key, or steps its direction if it is already sorted, instead of replacing the sort.',
      default: 'false',
      required: false,
    },
  ],
  returns: [
    {
      name: 'sortedData',
      type: 'T[]',
      description:
        'A sorted copy of data, memoized on data and the sort state. Ties keep their order in data.',
    },
    {
      name: 'sort',
      type: "Array<{sortKey: TSortKey, direction: 'ascending' | 'descending'}>",
      description: 'The current sort state, first entry first.',
    },
    {
      name: 'sortConfig',
      type: 'UseTableSortableConfig<TSortKey>',
      description:
        'Pass to useTableSortable(sortConfig) and give the resulting plugin to Table.',
    },
    {
      name: 'applySort',
      type: '(data: T[]) => T[]',
      description:
        'Sorts another array with the current sort state and comparators, for a second data source or a subset.',
    },
  ],
  usage: {
    description:
      "Owns a Table's sort state and sorts the rows locally, as a convenience layer over useTableSortable. Pass the rows in, render sortedData, and hand sortConfig to useTableSortable. The hook keeps the state (or reads it from sort and onSortChange when controlled), so header clicks re-sort the rows with no sort code in the component. With isMultiSortEnabled, Shift+click adds tiebreaker columns. For data sorted on a server, use useTableSortable directly and sort where the data lives.",
    bestPractices: [
      {
        guidance: true,
        description:
          'Use it when the full data set is in memory, and pass sortedData to Table.',
      },
      {
        guidance: true,
        description:
          'Add a comparator for values whose order is not their string or number value, such as a status rank.',
      },
      {
        guidance: false,
        description:
          'Use it for server-side or paginated-on-server data; the hook only sorts the rows it is given.',
      },
    ],
  },
  relatedComponents: ['Table'],
  relatedHooks: ['useTableSortable', 'useCollator'],
  importPath: '@astryxdesign/core/Table',
  category: 'utilities',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Owns a Table's sort state + sorts rows locally; convenience layer over useTableSortable. Render sortedData, pass sortConfig to useTableSortable. Uncontrolled or controlled (sort + onSortChange). isMultiSortEnabled: Shift+click adds tiebreakers. Server-sorted data: use useTableSortable directly.",
  paramDescriptions: {
    config: 'rows + how sort state is owned.',
    'config.data': 'rows; returns a sorted copy, never mutates.',
    'config.defaultSort':
      'initial uncontrolled sort state; ignored when sort passed.',
    'config.sort': 'controlled sort state; pair with onSortChange.',
    'config.onSortChange': 'called with next sort state; required with sort.',
    'config.comparators':
      'ascending comparators per key (flipped for descending). Else numbers numeric, others numeric-collator strings in provider locale; null/undefined/NaN last ascending, first descending.',
    'config.allowUnsortedState':
      'to useTableSortable: third click returns to unsorted.',
    'config.isMultiSortEnabled':
      'to useTableSortable: Shift+click appends a sort key or steps its direction.',
  },
  returnDescriptions: {
    sortedData: 'sorted copy, memoized on data + sort; ties keep data order.',
    sort: 'current sort state.',
    sortConfig: 'pass to useTableSortable; plugin goes to Table.',
    applySort: 'sort another array with current state + comparators.',
  },
  usage: {
    description:
      'Local sort state + sorted rows for Table over useTableSortable: render sortedData, pass sortConfig to useTableSortable. Shift+click adds tiebreakers with isMultiSortEnabled. Server-sorted data: use useTableSortable.',
    bestPractices: [
      {
        guidance: true,
        description: 'Use with in-memory data; pass sortedData to Table.',
      },
      {
        guidance: true,
        description:
          'Add comparators for non-natural orders (e.g. status rank).',
      },
      {
        guidance: false,
        description: 'Use for server-side sorted/paginated data.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useTableSortableState",
  "usage": {
    "description": "负责 Table 的排序状态并在本地对行排序，是 useTableSortable 之上的便利层。传入行数据，渲染 `sortedData`，并将 `sortConfig` 交给 useTableSortable。该 Hook 保存状态（受控时从 `sort` 和 `onSortChange` 读取），因此表头点击会重新排序行，组件中无需任何排序代码。启用 `isMultiSortEnabled` 时，Shift+点击会添加次级排序列。对于在服务器上排序的数据，请直接使用 useTableSortable 并在数据所在处排序。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当完整数据集在内存中时使用它，并将 `sortedData` 传给 Table。"
      },
      {
        "guidance": true,
        "description": "为顺序不等于其字符串或数值的值添加比较器，例如状态等级。"
      },
      {
        "guidance": false,
        "description": "不要用于服务器端数据或服务器端分页数据；该 Hook 只对传入的行排序。"
      }
    ]
  },
  "paramDescriptions": {
    "config": "要排序的行以及排序状态的归属方式。",
    "config.data": "要排序的行。该 Hook 返回排序后的副本，绝不会修改原数组。",
    "config.defaultSort": "当 Hook 自己持有状态时的初始排序状态。传入 `sort` 时忽略。",
    "config.sort": "受控排序状态。与 `onSortChange` 一起传入以自行持有状态。",
    "config.onSortChange": "以下一个排序状态调用。传入 `sort` 时必填。",
    "config.comparators": "每个排序键的升序比较器；降序时 Hook 会翻转结果。没有比较器的键会按数字比较数字，其他值按字符串比较（使用活动 InternationalizationProvider 区域设置的数字排序器），并将 null、undefined 和 NaN 在升序中排在最后、降序中排在最前。",
    "config.allowUnsortedState": "传给 useTableSortable：第三次点击表头会使该列回到未排序状态，而不是 'ascending'。",
    "config.isMultiSortEnabled": "传给 useTableSortable：Shift+点击表头会将该列添加为下一个排序键，或在其已排序时切换方向，而不是替换排序。"
  },
  "returnDescriptions": {
    "sortedData": "`data` 的排序副本，基于 `data` 和排序状态进行记忆化。并列项保持它们在 `data` 中的顺序。",
    "sort": "当前排序状态，首项在前。",
    "sortConfig": "传给 `useTableSortable(sortConfig)`，并将生成的插件交给 Table。",
    "applySort": "使用当前排序状态和比较器对另一个数组排序，适用于第二个数据源或子集。"
  }
};
