// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableRowExpansion',
  subComponentOf: 'Table',
  displayName: 'useTableRowExpansion',
  description:
    'Hook that returns a TablePlugin which expands a full-width detail panel below a row, rendered by the consumer via renderExpanded(item). Adds a leading chevron column and a right-click "Expand/Collapse row" action; the consumer owns the expandedKeys set. The panel spans the row but starts its content at the first column, past the chevron, so detail lines up with the labels above it; the inset follows the table density. Use it for master-detail rows (order details, forms, charts, nested tables). For hierarchical data where child rows reuse the parent columns, use useTableTreeData + useTableTreeState instead.',
  props: [
    {
      name: 'expandedKeys',
      type: 'Set<string>',
      description: 'Set of currently-expanded row keys. Consumer-owned.',
      required: true,
    },
    {
      name: 'onToggle',
      type: '(key: string) => void',
      description:
        'Called with a row key when its expansion is toggled (chevron click or context-menu action).',
      required: true,
    },
    {
      name: 'getRowKey',
      type: '(item: T) => string',
      description: 'Derive a stable unique key from a row item.',
      required: true,
    },
    {
      name: 'getRowLabel',
      type: '(item: T) => string',
      description:
        'Derive a human-readable row identity for the chevron accessible name. Astryx combines it with localized expand/collapse wording. Omit it, or return blank text, to keep the generic "Expand row" and "Collapse row" labels.',
    },
    {
      name: 'renderExpanded',
      type: '(item: T) => ReactNode',
      description:
        'Render the detail content shown in a full-width panel below the row when it is expanded. Receives the row item.',
      required: true,
    },
    {
      name: 'getIsItemExpandable',
      type: '(item: T) => boolean',
      description:
        'Control which rows are expandable. Non-expandable rows show no chevron, no context-menu action, and never render a panel. Defaults to all rows expandable.',
    },
    {
      name: 'panelVariant',
      type: "'muted' | 'transparent'",
      description:
        "Background behind the detail panel. 'transparent' (default) paints nothing: the panel is the row's continuation and takes whatever surface the table sits on, so a Card shows through and a striped table's zebra reads on unchanged. 'muted' washes it, marking it as commentary rather than another row of data — reach for it in a bare table with no card, dividers or striping, where nothing else makes that distinction. The wash is a low-alpha near-black, so it is close to invisible over a dark card: 'muted' is largely a light-theme effect.",
      default: "'transparent'",
    },
    {
      name: 'hasRowClickExpansion',
      type: 'boolean',
      description:
        'Toggle a row by clicking anywhere on it, not only on its chevron. A pointer-only convenience layered over the chevron, which stays the accessible control for keyboard and assistive tech. Clicks on interactive cell content (buttons, links, form controls) or on a text selection do not toggle, and non-expandable rows stay inert.',
      default: 'false',
    },
    {
      name: 'animatedLayout',
      type: 'AnimatedLayout',
      description:
        "A handle from useAnimatedLayout. With it, opening or closing a panel glides the rows after it (and the content after the table) to their new places instead of jumping, the opening panel plays in on the same motion, and each row's divider moves with it. Under Reduce Motion the rows fade in place on a touch screen and change at once with a mouse; in a table with column lines (dividers columns or grid, which do not move yet) they change at once. Without it, rows jump.",
    },
  ],
  examples: [
    {
      label: 'Master-detail order rows',
      code: `const [expandedKeys, setExpandedKeys] = useState(new Set());
const expansion = useTableRowExpansion({
  expandedKeys,
  onToggle: key =>
    setExpandedKeys(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    }),
  getRowKey: item => item.id,
  getRowLabel: item => item.name,
  renderExpanded: item => <OrderDetails order={item} />,
});

<Table data={orders} columns={columns} idKey="id" plugins={{expansion}} />;`,
    },
    {
      label: 'Migrating from tree rows to the tree plugin',
      code: `// useTableRowExpansion is now for DETAIL PANELS, not tree rows. If you used
// it to render nested child rows that reuse the parent columns, move to
// useTableTreeData + useTableTreeState.

// BEFORE (tree rows via useTableRowExpansion + useTableRowExpansionState):
const {data, expansionConfig} = useTableRowExpansionState({
  baseData: tree,
  getChildren: item => item.children ?? [],
  getRowKey: item => item.id,
  expandedKeys,
  setExpandedKeys,
});
const expansion = useTableRowExpansion(expansionConfig);
<Table data={data} columns={columns} idKey="id" plugins={{expansion}} />;

// AFTER (tree rows via the tree plugin):
const {visibleData, treeConfig} = useTableTreeState({
  data: tree,                   // nested data
  idKey: 'id',                  // or a function: idKey={item => item.id}
  childrenKey: 'children',      // replaces getChildren
  defaultExpandedIds: ['root'], // or controlled: expandedIds + onExpandedIdsChange
});
const tree = useTableTreeData({
  ...treeConfig,
  hasExpandAllControl: true,    // was isAllExpanded + onToggleExpandAll
  hasRowClickExpansion: true,   // same prop name
});
<Table data={visibleData} columns={columns} idKey="id" plugins={{tree}} />;`,
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Returns a TablePlugin that expands a full-width detail panel below a row via renderExpanded(item). Adds a chevron column + right-click expand/collapse action; consumer owns expandedKeys. Panel content starts at the first column (past the chevron), inset by density. For nested child rows that reuse parent columns, use useTableTreeData + useTableTreeState instead.',
  propDescriptions: {
    expandedKeys: 'Set of currently-expanded row keys. Consumer-owned.',
    onToggle: 'Called with a row key when its expansion is toggled.',
    getRowKey: 'Derive a stable unique key from a row item.',
    getRowLabel:
      'Derive a row identity for the localized expand/collapse control label. Blank or omitted values keep the generic row label.',
    renderExpanded:
      'Render the full-width detail panel below an expanded row. Receives the row item.',
    getIsItemExpandable:
      'Control which rows are expandable. Defaults to all rows expandable.',
    panelVariant:
      "Detail panel background: 'transparent' (default) paints nothing, so the panel takes the surface behind the table and leaves a striped table's zebra alone; 'muted' washes it, for a bare table where nothing else separates the panel from the data.",
    hasRowClickExpansion:
      'Toggle a row by clicking anywhere on it, not just the chevron; pointer-only, skips interactive cell content and text selections. Defaults to false.',
    animatedLayout:
      'Handle from useAnimatedLayout: opening or closing a panel glides the rows after it instead of jumping them. Under Reduce Motion they fade in place on touch and change at once with a mouse; with column lines they change at once.',
  },
};

export const docsZh = {
  "name": "useTableRowExpansion",
  "description": "返回 TablePlugin 的 Hook，该插件在行下方展开一个全宽详情面板，由使用方通过 renderExpanded(item) 渲染。添加一个前置尖角符号列和一个右键 \"Expand/Collapse row\" 操作；expandedKeys 集合由使用方持有。面板横跨整行，但内容从第一列开始（越过尖角符号），因此详情与上方标签对齐；缩进遵循表格密度。用于主从行（订单详情、表单、图表、嵌套表格）。如果子行复用父列，请改用 useTableTreeData + useTableTreeState。",
  "propDescriptions": {
    "expandedKeys": "当前已展开行的键集合。由使用方持有。",
    "onToggle": "行的展开状态切换时（点击尖角符号或上下文菜单操作）以该行的键调用。",
    "getRowKey": "从行项目派生稳定唯一的键。",
    "getRowLabel": "为尖角符号的无障碍名称派生人类可读的行标识。Astryx 会将其与本地化的展开/折叠措辞组合。省略它或返回空白文本，以保留通用的 \"Expand row\" 和 \"Collapse row\" 标签。",
    "renderExpanded": "行展开时渲染显示在行下方全宽面板中的详情内容。接收行项目。",
    "getIsItemExpandable": "控制哪些行可展开。不可展开的行不显示尖角符号、不显示上下文菜单操作，也永不渲染面板。默认所有行可展开。",
    "panelVariant": "详情面板背景。'transparent'（默认）不绘制任何内容：面板是行的延续，采用表格所在的表面，因此 Card 会透出，条纹表格的斑马纹也保持不变。'muted' 会对其着色，将其标记为注释而不是另一行数据——在无卡片、无分隔线或条纹的裸表格中，其他元素无法做出这种区分时使用。该着色是低透明度的近黑色，因此在深色卡片上几乎不可见：'muted' 主要是浅色主题效果。",
    "hasRowClickExpansion": "点击行的任意位置即可切换该行，而不仅限于尖角符号。这是在尖角符号之上叠加的指针便捷方式，尖角符号仍是键盘和辅助技术使用的无障碍控件。点击交互式单元格内容（按钮、链接、表单控件）或文本选择不会切换，不可展开的行保持惰性。",
    "animatedLayout": "来自 useAnimatedLayout 的句柄。提供后，打开或关闭面板会让其后的行（以及表格后的内容）平滑移动到新位置而不是跳跃，打开的面板以相同动态效果播放，每行的分隔线也随之移动。在减少动态效果下，触摸屏上的行原地淡入，鼠标操作则即时变化；在带列线（分隔线列或网格，目前不会移动）的表格中，它们即时变化。不提供时，行会跳跃。"
  }
};
