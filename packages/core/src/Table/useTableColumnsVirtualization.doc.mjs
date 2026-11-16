// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'useTableColumnsVirtualization',
  subComponentOf: 'Table',
  displayName: 'useTableColumnsVirtualization',
  description:
    "Returns an opaque capability for Table column windowing. Pass the capability to Table.virtualization and keep the complete data, columns, explicit stable idKey and plugins on Table. Columns keep their declared widths: an overflowing Table renders at its minimum width, and the window uses the width each column has there. Pinned columns from useTableStickyColumns always mount; only the columns between the pinned runs window, with a few overscan columns on each side. When the Table's scroll area is at least as wide as the Table's minimum width, every column mounts. A focused cell keeps its column mounted while it scrolls out of view, until focus leaves the Table or moves to another cell. Changing column order, widths, visibility or pinning keeps the first visible column and its scroll offset. Supported tables have one header row, flat rows, no cell that spans columns and single-line content; explicit wrapping, arbitrary custom renderers, non-flat rows, invalid identity, a caller-provided scrollWrapper or a min-width wider than the column floors render every column. To window rows and columns together, pass both capabilities as a list: Table.virtualization={[rows, columns]}. Mounted cells keep native table semantics and full-table column positions; unmounted columns are not promised screen-reader discovery. Keep the capability on the Table for its whole life: adding or removing it remounts the table, which resets focus and scroll position. Changing initialViewportWidth does not remount it.",
  props: [
    {
      name: 'initialViewportWidth',
      type: 'number',
      required: true,
      description:
        "The inline viewport width in CSS pixels that the first window plans for, on the server and before the viewport is measured. It does not size the Table: after mount, the measured width of the Table's scroll area sets the window. Table accounts for its pinned columns.",
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Geometry-only column windowing opt-in for Table.virtualization. Keep full data, columns and a stable idKey on Table. Declared widths set the window; pinned columns always mount; a wide enough scroll area mounts every column. Unsupported content or structure renders every column. Native mounted-cell semantics, not discovery of unmounted columns. Adding or removing the capability remounts the table.',
  propDescriptions: {
    initialViewportWidth:
      'First-frame inline viewport width for the window plan; does not size the Table; measured scroll area wins after mount.',
  },
};

export const docsZh = {
  "name": "useTableColumnsVirtualization",
  "description": "返回用于 Table 列窗口化的不透明能力。将该能力传给 Table.virtualization，并在 Table 上保留完整数据、列、显式稳定的 idKey 和插件。列保持其声明的宽度：溢出的 Table 按其最小宽度渲染，窗口使用各列在该宽度下的宽度。来自 useTableStickyColumns 的固定列始终挂载；只有固定区段之间的列会进入窗口化，两侧各有少量过扫描列。当 Table 的滚动区域至少与 Table 的最小宽度一样宽时，所有列都会挂载。聚焦的单元格在其滚动出视图时仍保持其列挂载，直到焦点离开 Table 或移到另一个单元格。更改列顺序、宽度、可见性或固定状态时，会保留第一个可见列及其滚动偏移。受支持的表格具有一个表头行、扁平行、没有跨列单元格且内容为单行；显式换行、任意自定义渲染器、非扁平行、无效标识、调用方提供的 scrollWrapper 或比列宽下限更宽的 min-width 都会渲染每一列。要同时窗口化行和列，请将两个能力作为列表传入：Table.virtualization={[rows, columns]}。已挂载的单元格保留原生表格语义和全表列位置；未挂载的列不承诺可被屏幕阅读器发现。请在 Table 的整个生命周期内保留该能力：添加或移除它会重新挂载表格，从而重置焦点和滚动位置。更改 initialViewportWidth 不会重新挂载。",
  "propDescriptions": {
    "initialViewportWidth": "第一个窗口在服务器上、测量视口之前所规划的 CSS 像素内联视口宽度。它不会设置 Table 的尺寸：挂载后，Table 滚动区域的测量宽度会决定窗口。Table 会考虑其固定列。"
  }
};
