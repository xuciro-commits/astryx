// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableTreeData',
  subComponentOf: 'Table',
  displayName: 'useTableTreeData',
  description:
    'Headless tree plugin for Table: renders nested rows with per-level indentation and expand/collapse chevrons in the tree column (the first column by default), and reflects hierarchy with aria-level on body rows and aria-expanded on each expand/collapse button. Composable with the other Table plugins: the canonical plugin order places tree before selection, so the checkbox column lands left of the indented tree column. Feed it the treeConfig from useTableTreeState, or construct the config directly for server-driven or pre-flattened trees. When no row is expandable (flat data), every transform is a pass-through and the table renders identically to one without the plugin. Known limitation: the tree column wraps its cell content, so textOverflow="truncate" tooltips do not apply within the tree column.',
  props: [
    {
      name: 'getRowMeta',
      type: '(item: T) => TableTreeRowMeta | undefined',
      description:
        'Structural meta for a visible row: {id, level (0-based), hasChildren, isExpanded}.',
      required: true,
    },
    {
      name: 'onToggleItem',
      type: '(item: T) => void',
      description: "Toggle a row's expansion.",
      required: true,
    },
    {
      name: 'getRowLabel',
      type: '(item: T) => string',
      description:
        'Derive a human-readable row identity for the expander. Astryx combines it with localized expand/collapse wording. Omit it, or return blank text, to keep the generic "Expand row" and "Collapse row" labels.',
    },
    {
      name: 'hasExpandableRows',
      type: 'boolean',
      description:
        'Whether any row in the dataset is expandable. When false the plugin is a no-op: no expanders, no indent, no tree ARIA.',
      required: true,
    },
    {
      name: 'hasExpandAllControl',
      type: 'boolean',
      description:
        'Show an expand-all/collapse-all toggle in the tree column header. Requires isAllExpanded plus onExpandAll/onCollapseAll (all supplied by useTableTreeState).',
      default: 'false',
    },
    {
      name: 'isAllExpanded',
      type: "boolean | 'indeterminate'",
      description:
        'Aggregate expansion state across every expandable row, driving the header expand-all toggle. true when all are expanded, false when none are, indeterminate when some are.',
    },
    {
      name: 'onExpandAll',
      type: '() => void',
      description: 'Expand every expandable row. Wired to the header control.',
    },
    {
      name: 'onCollapseAll',
      type: '() => void',
      description: 'Collapse every row. Wired to the header control.',
    },
    {
      name: 'indent',
      type: "'sm' | 'md' | 'lg'",
      description:
        'Indent step per level, mapped to the spacing-3 / spacing-4 / spacing-6 tokens.',
      default: "'md'",
    },
    {
      name: 'treeColumnKey',
      type: 'string',
      description:
        'Column that carries the indent + expander. Defaults to the first column.',
    },
    {
      name: 'hasRowClickExpansion',
      type: 'boolean',
      description:
        'When true, clicking anywhere on an expandable row toggles its expansion, in addition to the chevron. A pointer-only convenience: keyboard and assistive-tech users toggle via the chevron button. Clicks on interactive cell content (buttons, links, form controls) or a text selection do not toggle. Leaf rows stay inert, and it is a no-op on flat data.',
      default: 'false',
    },
  ],
  examples: [
    {
      label: 'File tree with expandable folders',
      code: `const {visibleData, treeConfig} = useTableTreeState({
  data: files,          // rows may nest under 'children'
  idKey: 'id',
  defaultExpandedIds: ['src'],
});
const tree = useTableTreeData({
  ...treeConfig,
  getRowLabel: item => item.name,
});

<Table data={visibleData} columns={columns} idKey="id" plugins={{tree}} />;`,
    },
  ],
};

export const docsDense = {
  name: 'useTableTreeData',
  displayName: 'useTableTreeData',
  description:
    'Headless tree plugin: indent + expander chevron on the tree column (first column by default), aria-level on body rows, aria-expanded on each expander button. Canonical plugin order puts tree before selection (checkbox column lands left of tree column). Consume treeConfig from useTableTreeState, or construct directly for server-driven trees. hasExpandableRows=false => full no-op (flat-data migration).',
  propDescriptions: {
    getRowMeta:
      'structural meta per visible row: {id, level (0-based), hasChildren, isExpanded}',
    onToggleItem: 'toggle row expansion',
    getRowLabel:
      'derive a row identity for the localized expand/collapse accessible name. Blank or omitted values keep the generic row label.',
    hasExpandableRows: 'false => plugin is a no-op (no expanders/indent/ARIA)',
    indent:
      "indent step per level: 'sm' | 'md' | 'lg' (spacing-3/4/6). Defaults to 'md'.",
    treeColumnKey:
      'column carrying indent + expander. Defaults to first column.',
    hasExpandAllControl:
      'show expand-all/collapse-all toggle in tree column header. Needs isAllExpanded + onExpandAll/onCollapseAll (from useTableTreeState). Defaults to false.',
    isAllExpanded:
      "aggregate state driving the header toggle: true (all) | false (none) | 'indeterminate' (some).",
    onExpandAll: 'expand every expandable row (header control)',
    onCollapseAll: 'collapse every row (header control)',
    hasRowClickExpansion:
      'true => clicking an expandable row body toggles it (in addition to the chevron). Leaves stay inert; no-op on flat data. Defaults to false.',
  },
};

export const docsZh = {
  "name": "useTableTreeData",
  "description": "Table 的无头树插件：在树列（默认为第一列）中渲染带逐级缩进和展开/折叠箭头的嵌套行，并通过正文行上的 aria-level 和每个展开/折叠按钮上的 aria-expanded 反映层级。可与其他 Table 插件组合：规范的插件顺序将 tree 放在 selection 之前，因此复选框列会落在缩进的树列左侧。向它传入来自 useTableTreeState 的 treeConfig，或为服务端驱动或预先展平的树直接构造配置。当没有可展开的行（扁平数据）时，所有转换都是直通操作，表格渲染与不使用该插件时完全相同。已知限制：树列会包裹其单元格内容，因此 textOverflow=\"truncate\" 的 Tooltip 在树列内不适用。",
  "propDescriptions": {
    "getRowMeta": "可见行的结构元数据：{id, level（从 0 开始）, hasChildren, isExpanded}。",
    "onToggleItem": "切换行的展开状态。",
    "getRowLabel": "为展开器推导可读的行标识。Astryx 会将其与本地化的展开/折叠措辞组合。省略它或返回空白文本，可保留通用的 \"Expand row\" 和 \"Collapse row\" 标签。",
    "hasExpandableRows": "数据集中是否有任何行可展开。为 false 时插件为空操作：没有展开器、没有缩进、没有树形 ARIA。",
    "hasExpandAllControl": "在树列标题中显示全部展开/全部折叠切换。需要 isAllExpanded 以及 onExpandAll/onCollapseAll（均由 useTableTreeState 提供）。",
    "isAllExpanded": "所有可展开行的聚合展开状态，驱动标题栏的全部展开切换。全部展开时为 true，全部未展开时为 false，部分展开时为 indeterminate。",
    "onExpandAll": "展开每个可展开行。连接到标题栏控件。",
    "onCollapseAll": "折叠所有行。连接到标题栏控件。",
    "indent": "每级缩进步长，映射到 spacing-3 / spacing-4 / spacing-6 令牌。",
    "treeColumnKey": "承载缩进和展开器的列。默认为第一列。",
    "hasRowClickExpansion": "为 true 时，除箭头外，点击可展开行的任意位置也会切换其展开状态。这是仅为指针设备提供的便利：键盘和辅助技术用户通过箭头按钮切换。点击交互式单元格内容（按钮、链接、表单控件）或文本选择时不会切换。叶子行保持惰性，在扁平数据上为空操作。"
  }
};
