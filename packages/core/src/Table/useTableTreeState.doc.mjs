// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableTreeState',
  subComponentOf: 'Table',
  displayName: 'useTableTreeState',
  description:
    'State management companion for useTableTreeData. Owns the expanded set (controlled or uncontrolled) and flattens nested data into the visible row array; collapsed subtrees are unmounted, not hidden, so the table body contains exactly the visible rows. Returns expandAll/collapseAll helpers, the aggregate isAllExpanded state (true/false/indeterminate) for a header expand-all control, and a ready-to-use config for the tree plugin. Note: because collapsed rows unmount, cell-local React state inside collapsed subtrees is lost on collapse; lift state that must survive.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'Nested data: rows may carry child rows under childrenKey. Flat data (no children anywhere) makes the plugin a no-op, so it can be adopted before the data becomes hierarchical.',
      required: true,
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description:
        'Row ID accessor: property name or function returning a unique id.',
      required: true,
    },
    {
      name: 'childrenKey',
      type: 'string',
      description: 'Property holding each row\'s children array.',
      default: "'children'",
    },
    {
      name: 'defaultExpandedIds',
      type: 'Iterable<string>',
      description:
        'Initial expanded row ids for uncontrolled mode. Ignored when expandedIds is provided.',
    },
    {
      name: 'expandedIds',
      type: 'ReadonlySet<string>',
      description:
        'Controlled set of expanded row ids. Pair with onExpandedIdsChange.',
    },
    {
      name: 'onExpandedIdsChange',
      type: '(ids: ReadonlySet<string>) => void',
      description:
        'Called with the next expanded set whenever expansion changes (both modes). In lazy-loading setups, trigger the children fetch here.',
    },
    {
      name: 'isItemExpandable',
      type: '(item: T) => boolean',
      description:
        'Should this row show an expander? Overrides the default non-empty-children check; use for lazy loading, where a row is expandable before its children have been fetched.',
    },
    {
      name: 'sortSiblings',
      type: '(siblings: T[]) => T[]',
      description:
        'Sort each sibling group independently during flattening; children always stay directly under their parent. Pass applySort from useTableSortableState to compose with column sorting.',
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Indent step per level (spacing-3 / spacing-4 / spacing-6), forwarded to useTableTreeData.',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description:
        'Column that carries the indent + expander, forwarded to useTableTreeData. Defaults to the first column.',
    },
  ],
};

export const docsDense = {
  name: 'useTableTreeState',
  displayName: 'useTableTreeState',
  description:
    'State companion for useTableTreeData. Owns expanded set (controlled or uncontrolled), flattens nested data to visible rows (collapsed subtrees unmounted, not hidden). Returns {visibleData, treeConfig, expandedIds, isAllExpanded, expandAll, collapseAll} (isAllExpanded = true/false/indeterminate for a header expand-all control). Cell-local state in collapsed subtrees is lost on collapse; lift state that must survive.',
  propDescriptions: {
    data: 'nested data; rows carry child rows under childrenKey. Flat data => plugin is a no-op.',
    idKey: 'row ID accessor: property name or fn returning unique id',
    childrenKey: "property holding children array. Defaults to 'children'.",
    defaultExpandedIds: 'initial expanded ids (uncontrolled)',
    expandedIds: 'controlled expanded set; pair with onExpandedIdsChange',
    onExpandedIdsChange:
      'called with next expanded set on change (both modes); trigger lazy children fetch here',
    isItemExpandable:
      'overrides non-empty-children expandability check (lazy loading)',
    sortSiblings:
      'sorts each sibling group during flattening; pass applySort from useTableSortableState',
    indent: "indent step per level: 'sm' | 'md' | 'lg'. Defaults to 'md'.",
    treeColumnKey: 'column carrying indent + expander. Defaults to first column.',
  },
};

export const docsZh = {
  "name": "useTableTreeState",
  "description": "useTableTreeData 的状态管理配套 Hook。拥有展开集合（受控或非受控），并将嵌套数据展平为可见行数组；折叠的子树会被卸载而非隐藏，因此表格正文恰好包含可见行。返回 expandAll/collapseAll 辅助函数、用于表头全展开控件的聚合 isAllExpanded 状态（true/false/不确定），以及可直接用于树插件的配置。注意：由于折叠行会被卸载，折叠子树内单元格局部的 React 状态会在折叠时丢失；必须保留的状态请提升。",
  "propDescriptions": {
    "data": "嵌套数据：行可以在 childrenKey 下携带子行。扁平数据（任何地方都没有 children）会使插件成为空操作，因此可以在数据变为层级结构之前就采用它。",
    "idKey": "行 ID 访问器：属性名或返回唯一 id 的函数。",
    "childrenKey": "保存每行子数组的属性。",
    "defaultExpandedIds": "非受控模式的初始展开行 id。提供 expandedIds 时忽略。",
    "expandedIds": "受控的展开行 id 集合。与 onExpandedIdsChange 配合使用。",
    "onExpandedIdsChange": "每当展开状态变化（两种模式）时，以新的展开集合调用。在懒加载设置中，可在此触发子项获取。",
    "isItemExpandable": "此行是否应显示展开器？覆盖默认的非空子项检查；用于懒加载，其中行在其子项获取之前就可展开。",
    "sortSiblings": "展平期间独立地对每个同级组排序；子项始终直接位于其父项下。传入 useTableSortableState 的 applySort 以与列排序组合。",
    "indent": "每级的缩进步长（spacing-3 / spacing-4 / spacing-6），转发给 useTableTreeData。",
    "treeColumnKey": "承载缩进 + 展开器的列，转发给 useTableTreeData。默认为第一列。"
  }
};
