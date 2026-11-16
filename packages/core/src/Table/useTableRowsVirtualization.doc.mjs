// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'useTableRowsVirtualization',
  subComponentOf: 'Table',
  displayName: 'useTableRowsVirtualization',
  description:
    "Returns an opaque capability for fixed-height flat-row Table windowing. Pass the capability to Table.virtualization and keep the complete data, columns, explicit stable idKey and plugins on Table. Sizes are positive finite CSS pixels. The Table scrolls inside the height its parent gives it and fills all of it. Give the Table's parent a height, fixed or relative, or a flex child, so windowing can bound the rows; with no height every row renders. Make the Table the parent's only child, or a flex child with min-height: 0 beside a heading or toolbar. Supported rows use single-line content; explicit wrapping, arbitrary custom renderers, non-flat rows or invalid identity use ordinary full rendering. Windowing uses the Table-owned scroll wrapper; a caller-provided scrollWrapper takes diagnostic full-render fallback. Mounted rows retain native table semantics and full-table positions; unmounted rows are not promised screen-reader discovery.",
  props: [
    {
      name: 'rowHeight',
      type: 'number',
      required: true,
      description:
        'Total body-row pitch in CSS pixels, including existing density padding and collapsed borders. Must fit text and supported controls without reducing their size. When every row measures taller, as with enlarged text or zoom, the Table windows at the measured height and warns in development; rows of unequal height render every row.',
    },
    {
      name: 'initialViewportHeight',
      type: 'number',
      required: true,
      description:
        'The viewport height in CSS pixels that the first window plans for, on the server and before the viewport is measured. It does not size the Table: the Table scrolls inside the height its parent gives it, and after mount the measured viewport sets the window. Table accounts for its headers and chrome.',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Geometry-only fixed-height flat-row opt-in for Table.virtualization. Keep full data and stable idKey on Table. Positive finite CSS-pixel sizes; unsupported content, geometry, identity or a caller scrollWrapper falls back to full rendering. Native mounted-row semantics, not discovery of unmounted rows.',
  propDescriptions: {
    rowHeight:
      'Total body-row pitch including density padding and borders; text and supported controls must fit. Taller equal rows window at their measured height.',
    initialViewportHeight:
      'First-frame viewport height for the window plan; does not size the Table; measured viewport wins after mount.',
  },
};

export const docsZh = {
  "name": "useTableRowsVirtualization",
  "description": "返回一个不透明能力，用于固定高度、扁平行的 Table 窗口化渲染。将该能力传给 Table.virtualization，并在 Table 上保留完整数据、列、显式且稳定的 idKey 和插件。尺寸为正的有限 CSS 像素值。Table 在父级给定的高度内滚动并填满该高度。为 Table 的父级设置高度（固定或相对），或将其设为 flex 子项，以便窗口化能界定行数；没有高度时所有行都会渲染。让 Table 成为父级的唯一子元素，或作为 flex 子项并设置 min-height: 0，与标题或工具栏并排。支持的行使用单行内容；显式换行、任意自定义渲染器、非扁平行或无效标识会使用普通的完整渲染。窗口化使用 Table 自有的滚动包裹层；调用方提供 scrollWrapper 时会采用诊断性的完整渲染回退。已挂载的行保留原生表格语义和全表位置；未挂载的行不承诺可被屏幕阅读器发现。",
  "propDescriptions": {
    "rowHeight": "正文行总间距（CSS 像素），包含现有的密度内边距和折叠边框。必须能容纳文本和受支持的控件，且不缩小它们。当所有行实际测量得更高时（例如放大文本或缩放），Table 会按测量高度进行窗口化，并在开发环境发出警告；高度不相等的行会渲染每一行。",
    "initialViewportHeight": "服务器端、视口测量之前，首个窗口计划使用的视口高度（CSS 像素）。它不设置 Table 的尺寸：Table 在父级给定的高度内滚动，挂载后由测得的视口决定窗口。Table 会考虑其表头和界面框架。"
  }
};
