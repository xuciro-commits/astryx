// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentAnatomyElement[]} */
const anatomy = [
  {
    name: 'Table',
    required: true,
    description:
      'Semantic table element that groups the table sections, rows, and cells.',
  },
  {
    name: 'Scroll region',
    required: true,
    description:
      'Outer region that scrolls horizontally when columns overflow. Fixed-height virtualization also enables block scrolling; the region enters keyboard order while either applicable axis overflows.',
  },
  {
    name: 'Header section',
    required: false,
    description:
      'Column-heading section generated when data-driven columns are present or supplied with TableHeader in children mode.',
  },
  {
    name: 'Column header cell',
    required: false,
    description:
      'Cell that identifies one column and may contain sorting or bulk-selection controls.',
  },
  {
    name: 'Sort control',
    required: false,
    description:
      "Button that wraps a sortable column label and changes that column's sort direction.",
  },
  {
    name: 'Sort indicator glyph',
    required: false,
    description: 'Directional symbol rendered by Icon inside a Sort control.',
  },
  {
    name: 'Sort priority',
    required: false,
    description:
      'Number shown for a sorted column when multi-column sorting is active.',
  },
  {
    name: 'Selection control',
    required: false,
    description:
      'CheckboxInput rendered in the header and selectable body rows by the selection plugin.',
  },
  {
    name: 'Body section',
    required: true,
    description:
      'Section containing data rows or the current empty state; data-driven mode renders it automatically.',
  },
  {
    name: 'Row',
    required: false,
    description:
      'Repeated TableRow that groups cells in a standard header, body, or footer row.',
  },
  {
    name: 'Cell',
    required: false,
    description:
      'TableCell containing one value or caller-provided content in a standard body or footer row.',
  },
  {
    name: 'Default empty state',
    required: false,
    description:
      'Compact EmptyState shown for an empty data array unless it is replaced or disabled.',
  },
  {
    name: 'Expansion control',
    required: false,
    description:
      'Button in a leading cell that expands or collapses one expandable row.',
  },
  {
    name: 'Expansion glyph',
    required: false,
    description:
      'Directional symbol rendered by Icon inside an Expansion control.',
  },
  {
    name: 'Expanded detail panel',
    required: false,
    description:
      'Detail row and spanning cell rendered below an expanded row around caller-provided content.',
  },
  {
    name: 'Footer section',
    required: false,
    description:
      'Optional summary or totals section supplied with TableFooter in children mode.',
  },
];

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'Table',
  displayName: 'Table',
  group: 'Table',
  category: 'Table & List',
  keywords: [
    'table',
    'datatable',
    'datagrid',
    'spreadsheet',
    'sorting',
    'virtualized',
    'columns',
    'rows',
    'selection',
    'pinning',
  ],
  playground: {
    defaults: {
      data: [
        {name: 'Alice Chen', role: 'Engineer', status: 'Active'},
        {name: 'Bob Smith', role: 'Designer', status: 'Active'},
        {name: 'Carol Wu', role: 'PM', status: 'Away'},
      ],
      columns: [
        {key: 'name', header: 'Name'},
        {key: 'role', header: 'Role'},
        {key: 'status', header: 'Status'},
      ],
    },
  },
  theming: {
    targets: [
      {className: 'astryx-table'},
      {className: 'astryx-table-scroll-wrapper'},
      {className: 'astryx-table-header'},
      {className: 'astryx-table-body'},
      {className: 'astryx-table-footer'},
      {className: 'astryx-table-row', states: ['selected']},
      {className: 'astryx-table-cell', visualProps: ['density']},
      {className: 'astryx-table-header-cell', visualProps: ['density']},
    ],
    componentIcons: [
      {
        slot: 'table-sort-indicator',
        description:
          "The sort direction glyph beside a sortable column's label (`useTableSortable`).",
        fallback:
          '`arrowUp` ascending; `arrowDown` descending; `arrowsUpDown` unsorted',
        state: [
          {
            name: 'direction',
            type: "'ascending' | 'descending' | 'none'",
            description:
              "The column's sort direction; `none` while the column is not sorted.",
          },
        ],
        whenNull:
          'Hides the glyph. The Sort control keeps its label and its click and keyboard sorting; the column header keeps `aria-sort`.',
      },
      {
        slot: 'table-row-expand',
        description:
          "The glyph in a row's expansion toggle (`useTableRowExpansion`). The toggle turns the glyph a quarter turn while the row is expanded and mirrors it in right-to-left layouts, so map a glyph that points toward the inline end.",
        fallback: '`chevronRight`, turned while expanded',
        state: [
          {
            name: 'expanded',
            type: 'boolean',
            description: "True while the row's detail panel is open.",
          },
        ],
        whenNull:
          'Hides the glyph. The toggle keeps its size, its "Expand row" or "Collapse row" name, `aria-expanded`, and its click and keyboard toggling.',
      },
    ],
  },
  description:
    'Styled, data-driven table with density, dividers, hover highlight, striped rows, and named plugin support. T must extend Record<string, unknown>.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'Array of data items to render as rows. T must extend Record<string, unknown> (use `interface MyRow extends Record<string, unknown>` for custom types).',
    },
    {
      name: 'columns',
      type: 'TableColumn<T>[]',
      description:
        'Column definitions: each column has {key, header, width?, align?, renderCell?}. The `header` field sets the column heading text. If omitted, columns are auto-generated from data object keys. The `width` field is typed as `ColumnWidth` (not a number); use `proportional(n)` or `pixel(n)` helpers imported from `@astryxdesign/core/Table`. Omitting `width` keeps an equal flexible share with a compact 60px readability floor. To give one column a different floor, set `width: proportional(1, {minWidth: 80})`; its `minWidth` replaces the 60px floor for that column. Example: `width: pixel(120)` for 120px fixed, `width: proportional(1)` for a flexible column with a 120px default minimum.',
    },
    {
      name: 'idKey',
      type: '(keyof T & string) | ((item: T) => string | number)',
      description:
        'Canonical row identity: a property name projects valid strings and finite numbers to strings; a function retains string/number type. Optional legacy tables fall back to index. Virtualization requires explicit unique valid keys.',
    },
    {
      name: 'density',
      type: "'compact' | 'balanced' | 'spacious'",
      description: 'Row density controlling cell padding and font size.',
      default: "'balanced'",
    },
    {
      name: 'dividers',
      type: "'rows' | 'columns' | 'grid' | 'none'",
      description: 'Divider style rendered between cells.',
      default: "'rows'",
    },
    {
      name: 'isStriped',
      type: 'boolean',
      description: 'Applies a background wash to even-numbered rows.',
      default: 'false',
    },
    {
      name: 'hasHover',
      type: 'boolean',
      description:
        'Applies a hover highlight background to rows on pointer devices.',
      default: 'false',
    },
    {
      name: 'verticalAlign',
      type: "'middle' | 'top' | 'bottom'",
      description:
        'Vertical alignment for body row cells. Controls `vertical-align` on the `<td>` elements.',
      default: "'middle'",
    },
    {
      name: 'textOverflow',
      type: "'wrap' | 'truncate'",
      description:
        "How body cell text behaves when it exceeds the column width. 'wrap' lets text wrap and the row grow taller; 'truncate' clips with an ellipsis (default-rendered cells show a tooltip on hover when truncated). Header cells always truncate.",
      default: "'wrap'",
    },
    {
      name: 'virtualization',
      type: 'TableVirtualizationCapability | TableVirtualizationCapability[]',
      description:
        "Geometry-only capability from useTableRowsVirtualization or useTableColumnsVirtualization, or a list with at most one of each; any other list renders without windowing. useTableColumnsVirtualization({initialViewportWidth}) mounts only the unpinned columns near the viewport. useTableRowsVirtualization({rowHeight, initialViewportHeight}) takes sizes that are both positive finite CSS pixels; the Table scrolls inside the height its parent gives it, and initialViewportHeight only sizes the first window. Give the Table's parent a height, fixed or relative, or a flex child, so windowing can bound the rows; with no height every row renders. Pass complete flat data and an explicit idKey. Default text truncates; custom renderers, wrapping, structural plugins, incompatible offsets, invalid identity or unrepresentable geometry use full rendering. Logical row positions include the header.",
    },
    {
      name: 'plugins',
      type: 'Record<string, TablePlugin<T>>',
      description:
        'Named plugins that extend table behavior via the transform pipeline. Converted to an ordered array internally.',
    },
    {
      name: 'rowIndexStart',
      type: 'number',
      description:
        'ARIA row index (1-based) for the first rendered body row. The row ordinal is an accessibility concern independent of any visible index column, so setting this (or rowCount) makes the table emit aria-rowindex on body rows and aria-rowcount on the table. For a paginated/windowed view, pass the offset of the first visible row (e.g. (page - 1) * pageSize + 1) so aria-rowindex reflects position in the full dataset. Data-driven mode only.',
      default: '1',
    },
    {
      name: 'rowCount',
      type: 'number',
      description:
        'Total number of body rows across all pages/windows, used for aria-rowcount so assistive tech can announce "row X of Y" against the full dataset. When omitted but rowIndexStart is set (windowed view with an unknown total), aria-rowcount is set to -1 per the ARIA unknown-count convention. Data-driven mode only.',
    },
    {
      name: 'children',
      type: 'ReactNode',
      description:
        'Children mode: compose the table yourself from TableHeader / TableBody / TableFooter, each holding TableRow and TableCell, instead of using data-driven rendering. The children are passed straight to the <table>, so the section is yours to supply. A TableRow placed directly in Table emits <table><tr>, which is invalid HTML and mismatches on hydration (the parser inserts an implied <tbody> for server-rendered markup; React does not on the client). Data-driven mode renders the sections for you.',
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization (margins, positioning, sizing). Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  components: [
    {name: 'TableHeader'},
    {name: 'TableBody'},
    {name: 'TableFooter'},
    {name: 'TableRow'},
    {name: 'TableCell'},
    {name: 'TableHeaderCell'},
    {name: 'useTableSelection'},
    {name: 'useTableSelectionState'},
    {name: 'TableSelectionToolbar'},
    {name: 'useTableSortable'},
    {name: 'useTableTreeData'},
    {name: 'useTableTreeState'},
    {name: 'useTablePagination'},
    {name: 'useTableColumnSettings'},
    {name: 'useTableFiltering'},
    {name: 'useTableFilterState'},
  ],
  usage: {
    description:
      'Table displays structured data in rows and columns with consistent dimensionality. It supports rich cell content, sorting, selection, pagination, and column management through a composable plugin system. Use Table for data sets with uniform structure; for simpler or inconsistent data, consider a list or card layout instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use density and divider variants to match the information density and scanning needs of your data.',
      },
      {
        guidance: true,
        description:
          'Compose rich cell content with Astryx components like Badge, StatusDot, and Avatar via renderCell.',
      },
      {
        guidance: true,
        description:
          'In children mode, put every row inside TableHeader, TableBody, or TableFooter. <table> cannot contain a <tr> directly: the HTML parser inserts an implied <tbody> for server-rendered markup and React does not on the client, so unwrapped rows mismatch on hydration.',
      },
      {
        guidance: true,
        description:
          'Omit width for equal flexible columns with a compact 60px readability floor. Give one column its own floor with proportional(1, {minWidth}), weight columns with proportional(n), and fix widths with pixel(); the Table scroll region activates when the combined floors no longer fit.',
      },
      {
        guidance: true,
        description:
          'Use the data-driven API from React Server Components: proportional(), pixel(), and column definitions without function props are server-safe. Columns using renderCell (or any function prop) need the table wrapped in a "use client" component, since functions cannot cross the server-client boundary.',
      },
      {
        guidance: false,
        description:
          'Use a table for data without consistent columns. Use a list or card layout for heterogeneous content.',
      },
      {
        guidance: false,
        description:
          'Enable every plugin at once. Add only the features your use case requires to keep the interface focused.',
      },
      {
        guidance: false,
        description:
          'Rely on the 60px omitted-width floor when a text-heavy column needs more room; set proportional(1, {minWidth}) on that column instead.',
      },
    ],
    anatomy,
  },
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsZh = {
  "usage": {
    "description": "Table 以行列形式显示维度一致的结构化数据。它通过可组合的插件系统支持丰富的单元格内容、排序、选择、分页和列管理。结构统一的数据集使用 Table；对于更简单或不一致的数据，请考虑改用列表或卡片布局。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "使用 density 和 divider 变体来匹配数据的信息密度和浏览需求。"
      },
      {
        "guidance": true,
        "description": "通过 renderCell 使用 Badge、StatusDot 和 Avatar 等 Astryx 组件组合丰富的单元格内容。"
      },
      {
        "guidance": true,
        "description": "在 children 模式下，将每一行放在 TableHeader、TableBody 或 TableFooter 内。<table> 不能直接包含 <tr>：HTML 解析器会为服务端渲染的标记插入隐式的 <tbody>，而 React 在客户端不会，因此未包裹的行会在水合时不一致。"
      },
      {
        "guidance": true,
        "description": "省略 width 可获得等宽弹性列，并带有紧凑的 60px 可读性下限。用 proportional(1, {minWidth}) 为某一列设置专属下限，用 proportional(n) 对列加权，用 pixel() 固定宽度；当合并后的下限不再适配时，Table 的滚动区域会启用。"
      },
      {
        "guidance": true,
        "description": "从 React Server Components 使用数据驱动 API：proportional()、pixel() 以及不含函数属性的列定义在服务端是安全的。使用 renderCell（或任何函数属性）的列需要将表格包裹在 \"use client\" 组件中，因为函数无法跨越服务端-客户端边界。"
      },
      {
        "guidance": false,
        "description": "对列不一致的数据使用表格。异构内容应使用列表或卡片布局。"
      },
      {
        "guidance": false,
        "description": "一次性启用所有插件。只添加用例所需的功能，让界面保持专注。"
      },
      {
        "guidance": false,
        "description": "文本密集的列需要更多空间时仍依赖 60px 的省略宽度下限；应改为在该列上设置 proportional(1, {minWidth})。"
      }
    ],
    "anatomy": [
      {
        "name": "表格",
        "required": true,
        "description": "将表格各区段、行和单元格分组的语义化 table 元素。"
      },
      {
        "name": "滚动区域",
        "required": true,
        "description": "列溢出时水平滚动的外层区域。固定高度虚拟化还会启用块级滚动；任一适用轴溢出时，该区域会进入键盘顺序。"
      },
      {
        "name": "表头区段",
        "required": false,
        "description": "存在数据驱动列时自动生成，或在 children 模式下通过 TableHeader 提供的列标题区段。"
      },
      {
        "name": "列标题单元格",
        "required": false,
        "description": "标识某一列的单元格，可能包含排序或批量选择控件。"
      },
      {
        "name": "排序控件",
        "required": false,
        "description": "包裹可排序列标签并更改该列排序方向的按钮。"
      },
      {
        "name": "排序指示符号",
        "required": false,
        "description": "在排序控件内由 Icon 渲染的方向符号。"
      },
      {
        "name": "排序优先级",
        "required": false,
        "description": "多列排序激活时，为已排序列显示的数字。"
      },
      {
        "name": "选择控件",
        "required": false,
        "description": "由选择插件在表头和可选主体行中渲染的 CheckboxInput。"
      },
      {
        "name": "主体区段",
        "required": true,
        "description": "包含数据行或当前空状态的区段；数据驱动模式会自动渲染。"
      },
      {
        "name": "行",
        "required": false,
        "description": "在标准表头、主体或页脚行中组合单元格的重复 TableRow。"
      },
      {
        "name": "单元格",
        "required": false,
        "description": "在标准主体或页脚行中包含一个值或调用方提供内容的 TableCell。"
      },
      {
        "name": "默认空状态",
        "required": false,
        "description": "数据数组为空时显示的紧凑 EmptyState，除非被替换或禁用。"
      },
      {
        "name": "展开控件",
        "required": false,
        "description": "前置单元格中用于展开或折叠某个可展开行的按钮。"
      },
      {
        "name": "展开符号",
        "required": false,
        "description": "在展开控件内由 Icon 渲染的方向符号。"
      },
      {
        "name": "展开详情面板",
        "required": false,
        "description": "在展开行下方围绕调用方提供内容渲染的详情行和跨列单元格。"
      },
      {
        "name": "页脚区段",
        "required": false,
        "description": "children 模式下通过 TableFooter 提供的可选摘要或总计区段。"
      }
    ]
  },
  "name": "Table",
  "description": "带样式、数据驱动的表格，支持密度、分隔线、悬停高亮、斑马纹行和具名插件。T 必须扩展 Record<string, unknown>。",
  "propDescriptions": {
    "data": "要作为行渲染的数据项数组。T 必须扩展 Record<string, unknown>（自定义类型请使用 `interface MyRow extends Record<string, unknown>`）。",
    "columns": "列定义：每列包含 {key, header, width?, align?, renderCell?}。`header` 字段设置列标题文本。省略时，列会根据数据对象的键自动生成。`width` 字段类型为 `ColumnWidth`（不是数字）；请使用从 `@astryxdesign/core/Table` 导入的 `proportional(n)` 或 `pixel(n)` 辅助函数。省略 `width` 会保留等宽弹性份额，并带有紧凑的 60px 可读性下限。要为某一列设置不同的下限，请设置 `width: proportional(1, {minWidth: 80})`；其 `minWidth` 会替代该列的 60px 下限。示例：`width: pixel(120)` 表示固定 120px，`width: proportional(1)` 表示默认最小值为 120px 的弹性列。",
    "idKey": "规范的行标识：属性名会将有效字符串和有限数字投影为字符串；函数则保留字符串/数字类型。可选的传统表格回退到索引。虚拟化需要显式、唯一且有效的键。",
    "density": "控制单元格内边距和字号的行密度。",
    "dividers": "在单元格之间渲染的分隔线样式。",
    "isStriped": "为偶数行应用背景色。",
    "hasHover": "在指针设备上为行应用悬停高亮背景。",
    "verticalAlign": "主体行单元格的垂直对齐方式。控制 `<td>` 元素上的 `vertical-align`。",
    "textOverflow": "主体单元格文本超出列宽时的行为。'wrap' 允许文本换行并让行增高；'truncate' 用省略号截断（默认渲染的单元格被截断时会在悬停时显示工具提示）。表头单元格始终截断。",
    "virtualization": "来自 useTableRowsVirtualization 或 useTableColumnsVirtualization 的仅几何能力，或一个每种最多包含一项的列表；任何其他列表都会在不使用窗口化的情况下渲染。useTableColumnsVirtualization({initialViewportWidth}) 仅挂载视口附近未固定的列。useTableRowsVirtualization({rowHeight, initialViewportHeight}) 接受均为正有限 CSS 像素的尺寸；Table 在父级给定的高度内滚动，initialViewportHeight 仅用于确定第一个窗口的尺寸。请为 Table 的父级提供固定或相对高度，或将其作为 flex 子项，以便窗口化能限定行数；没有高度时每一行都会渲染。传入完整的扁平数据和显式的 idKey。默认文本会被截断；自定义渲染器、换行、结构插件、不兼容的偏移、无效标识或无法表示的几何会使用完整渲染。逻辑行位置包括表头。",
    "plugins": "通过转换管线扩展表格行为的具名插件。内部会转换为有序数组。",
    "rowIndexStart": "第一个渲染的主体行的 ARIA 行索引（从 1 开始）。行序号是可访问性关注点，与任何可见索引列无关，因此设置此属性（或 rowCount）会让表格在主体行上输出 aria-rowindex，并在表格上输出 aria-rowcount。对于分页/窗口化视图，传入第一个可见行的偏移量（例如 (page - 1) * pageSize + 1），使 aria-rowindex 反映其在完整数据集中的位置。仅限数据驱动模式。",
    "rowCount": "所有页面/窗口中主体行的总数，用于 aria-rowcount，使辅助技术能针对完整数据集播报 \"row X of Y\"。省略但设置了 rowIndexStart（总数未知的窗口化视图）时，按照 ARIA 的未知计数约定将 aria-rowcount 设为 -1。仅限数据驱动模式。",
    "children": "children 模式：使用 TableHeader / TableBody / TableFooter 自行组合表格，每个区段包含 TableRow 和 TableCell，而不是使用数据驱动渲染。children 会直接传给 <table>，因此区段由你提供。直接放在 Table 中的 TableRow 会输出 <table><tr>，这是无效 HTML，并会在水合时不一致（解析器会为服务端渲染的标记插入隐式 <tbody>；React 在客户端不会）。数据驱动模式会为你渲染各区段。",
    "xstyle": "用于布局自定义（外边距、定位、尺寸）的 StyleX 样式。必须是 stylex.create() 的值，而不是 style={{}} 这样的内联样式对象。"
  },
  "components": [
    {
      "name": "TableHeader",
      "description": ""
    },
    {
      "name": "TableBody",
      "description": ""
    },
    {
      "name": "TableFooter",
      "description": ""
    },
    {
      "name": "TableRow",
      "description": ""
    },
    {
      "name": "TableCell",
      "description": ""
    },
    {
      "name": "TableHeaderCell",
      "description": ""
    },
    {
      "name": "useTableSelection",
      "description": ""
    },
    {
      "name": "useTableSelectionState",
      "description": ""
    },
    {
      "name": "TableSelectionToolbar",
      "description": ""
    },
    {
      "name": "useTableSortable",
      "description": ""
    },
    {
      "name": "useTableTreeData",
      "description": ""
    },
    {
      "name": "useTableTreeState",
      "description": ""
    },
    {
      "name": "useTablePagination",
      "description": ""
    },
    {
      "name": "useTableColumnSettings",
      "description": ""
    },
    {
      "name": "useTableFiltering",
      "description": ""
    },
    {
      "name": "useTableFilterState",
      "description": ""
    }
  ]
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Data-driven table w/ rich cell content via renderCell. Compose cells w/ Badge, StatusDot, Text, Avatar, layout primitives. BaseTable provides unstyled structural core w/ composable plugin pipeline.',
  usage: {
    description:
      'Table displays structured data in rows and columns with consistent dimensionality. It supports rich cell content, sorting, selection, pagination, and column management through a composable plugin system. Use Table for data sets with uniform structure; for simpler or inconsistent data, consider a list or card layout instead.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use density and divider variants to match the information density and scanning needs of your data.',
      },
      {
        guidance: true,
        description:
          'Compose rich cell content with Astryx components like Badge, StatusDot, and Avatar via renderCell.',
      },
      {
        guidance: true,
        description:
          'Children mode: wrap rows in TableHeader/TableBody/TableFooter. <table> cannot hold a <tr> directly; the parser adds an implied <tbody> for SSR markup, React does not on the client, so unwrapped rows mismatch on hydration.',
      },
      {
        guidance: true,
        description:
          'Omitted width = equal flex w/ compact 60px readability floor. Per-column floor: proportional(1, {minWidth}). Weighted: proportional(n). Fixed: pixel(). Table scrolls when combined floors do not fit.',
      },
      {
        guidance: true,
        description:
          'Data-driven API is RSC-safe: proportional(), pixel(), column defs w/o function props work in Server Components. renderCell (any function prop) requires a "use client" wrapper.',
      },
      {
        guidance: false,
        description:
          'Use a table for data without consistent columns. Use a list or card layout for heterogeneous content.',
      },
      {
        guidance: false,
        description:
          'Enable every plugin at once. Add only the features your use case requires to keep the interface focused.',
      },
      {
        guidance: false,
        description:
          'Rely on the 60px omitted-width floor for a text-heavy column that needs more room; set proportional(1, {minWidth}) on it instead.',
      },
    ],
    anatomy,
  },
};
