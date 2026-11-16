// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableGroupedRows',
  subComponentOf: 'Table',
  displayName: 'useTableGroupedRows',
  description:
    'Hook that groups a flat data array into collapsible section rows. Each distinct groupBy value becomes a full-width section-header row with a chevron toggle, the group label, and a member count; collapsing hides that group\'s data rows while keeping the header visible. The disclosure state lives on the chevron button, not the native table row. Mirrors useTableTreeState: the consumer owns the collapsedGroups set and the hook returns {data, plugin, idKey}: pass them to Table as data, plugins, and idKey respectively. Grouping runs on the rows you hand it, so with pagination the order is filter, sort, slice, then group: sort by the group key first and the user\'s keys second, so a section\'s rows stay contiguous and each page appends to the bottom of the table instead of splicing rows in above the reader. A page that ends on a row count still cuts mid-section, and the heading then counts what has loaded rather than what exists: "6" quietly becoming "10". Where the full result set is in hand, carry the cut forward to the end of the section it lands in: every rendered section is then whole and its count is a total.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description: 'The flat data to group.',
      required: true,
    },
    {
      name: 'groupBy',
      type: '(item: T) => string',
      description:
        'Derive the group key for a row. Rows with the same key share a section.',
      required: true,
    },
    {
      name: 'collapsedGroups',
      type: 'Set<string>',
      description: 'Set of currently-collapsed group keys.',
      required: true,
    },
    {
      name: 'onToggleGroup',
      type: '(groupKey: string) => void',
      description: 'Called with a group key when its header is toggled.',
      required: true,
    },
    {
      name: 'renderGroupHeader',
      type: '(groupKey: string, count: number, collapsed: boolean) => ReactNode',
      description:
        "Custom renderer for a group header's content (right of the chevron). Defaults to `<groupKey> (<count>)`.",
    },
    {
      name: 'getRowKey',
      type: '(item: T) => string',
      description:
        'Stable key for a real row. Falls back to a positional key when omitted.',
    },
    {
      name: 'groupOrder',
      type: 'string[]',
      description:
        'Explicit group ordering; groups not listed keep first-seen order after these.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Groups a flat data array into collapsible section rows. Each groupBy value becomes a full-width header (chevron + label + count); collapsing hides its rows, and aria-expanded stays on the button rather than the native row. Returns {data, plugin, idKey}: pass them to Table data / plugins / idKey. Consumer owns the collapsedGroups set. Under pagination the order is filter, sort, slice, group: sort by the group key first so sections stay contiguous and pages append at the bottom. A row-count cut lands mid-section and the heading counts the page, not the section; where the whole result set is in hand, carry the cut to the end of the section it lands in so every rendered section is complete.',
  propDescriptions: {
    data: 'The flat data to group.',
    groupBy: "Derive a row's group key. Same key = same section.",
    collapsedGroups: 'Set of currently-collapsed group keys.',
    onToggleGroup: 'Called with the group key when a header is toggled.',
    renderGroupHeader:
      "Custom header content (right of chevron). Default '<key> (<count>)'. Args: (key, count, collapsed).",
    getRowKey: 'Stable key for a real row; positional fallback when omitted.',
    groupOrder: 'Pin these group keys first; others keep first-seen order.',
  },
};

export const docsZh = {
  "name": "useTableGroupedRows",
  "description": "将扁平数据数组分组为可折叠区块行的 Hook。每个不同的 groupBy 值都会变成一个全宽的分区标题行，包含尖角符号切换按钮、分组标签和成员数量；折叠会隐藏该分组的数据行，同时保持标题可见。展开状态保存在尖角按钮上，而不是原生表格行上。与 useTableTreeState 类似：使用方拥有 collapsedGroups 集合，该 Hook 返回 {data, plugin, idKey}：分别作为 data、plugins 和 idKey 传给 Table。分组只对传入的行运行，因此在分页时顺序是筛选、排序、切片，然后分组：先按分组键排序，再按用户指定的键排序，使一个分区的行保持连续，每页追加到表格底部，而不是在读者上方拼接行。按行数截断的页面仍会从分区中间切断，此时标题统计的是已加载的数量而非实际存在的数量：\"6\" 会悄悄变成 \"10\"。如果可以拿到完整结果集，请将截断位置顺延到所在分区的末尾：这样每个渲染的分区都是完整的，其计数也是总数。",
  "propDescriptions": {
    "data": "要分组的扁平数据。",
    "groupBy": "为行推导分组键。键相同的行共享一个分区。",
    "collapsedGroups": "当前已折叠的分组键集合。",
    "onToggleGroup": "切换分组标题时以该分组键调用。",
    "renderGroupHeader": "分组标题内容（尖角符号右侧）的自定义渲染器。默认为 `<groupKey> (<count>)`。",
    "getRowKey": "真实行的稳定键。省略时回退为位置键。",
    "groupOrder": "显式分组顺序；未列出的分组按首次出现的顺序排在这些之后。"
  }
};
