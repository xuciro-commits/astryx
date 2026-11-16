// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTablePagination',
  subComponentOf: 'Table',
  displayName: 'useTablePagination',
  description: 'Headless pagination plugin for Table. Call with a config object: `useTablePagination({ page, onPageChange, totalItems })`. Returns a TablePlugin to pass to `<Table plugins={{ pagination: paginationPlugin }} />`.',
  usage: {
    description: 'Call useTablePagination with a config object containing page state and callback. Pass the returned plugin to Table via the plugins prop.',
  },
  props: [
    {
      name: 'page',
      type: 'number',
      description: 'Current page number (1-based).',
      required: true,
    },
    {
      name: 'onPageChange',
      type: '(page: number) => void',
      description: 'Called when the page changes.',
      required: true,
    },
    {
      name: 'totalItems',
      type: 'number',
      description: 'Total number of items across all pages. Used to calculate total page count.',
    },
    {
      name: 'totalPages',
      type: 'number',
      description: 'Total number of pages. Use when you know the page count but not item count.',
    },
    {
      name: 'hasMore',
      type: 'boolean',
      description: 'Whether more pages exist. Use for cursor-based pagination where the total is unknown.',
    },
    {
      name: 'pageSize',
      type: 'number',
      description: 'Number of items per page.',
      default: '10',
    },
    {
      name: 'onPageSizeChange',
      type: '(pageSize: number) => void',
      description: 'Called when the user changes the page size. Shows a page size dropdown when provided with pageSizeOptions.',
    },
    {
      name: 'pageSizeOptions',
      type: 'number[]',
      description: 'Available page size options. Shows a page size selector when provided.',
    },
    {
      name: 'variant',
      type: "'pages' | 'count' | 'compact' | 'dots' | 'none'",
      description: 'Visual variant for the pagination controls.',
      default: "'pages'",
    },
    {
      name: 'position',
      type: "'below' | 'above' | 'both' | 'none'",
      description: 'Where to render pagination controls relative to the table.',
      default: "'below'",
    },
    {
      name: 'align',
      type: "'start' | 'center' | 'end'",
      description: 'Horizontal alignment of the pagination controls.',
      default: "'center'",
    },
    {
      name: 'label',
      type: 'string',
      description: "Accessible name for the pagination nav landmark. With position='both' the two navs get distinct names (the label suffixed as '(top)' and '(bottom)') so same-type landmarks stay unique (axe landmark-unique).",
      default: "'Table pagination'",
    },
  ],
};

export const docsZh = {
  "name": "useTablePagination",
  "displayName": "useTablePagination",
  "description": "用于 Table 的无头分页插件。使用配置对象调用：`useTablePagination({ page, onPageChange, totalItems })`。返回可传给 `<Table plugins={{ pagination: paginationPlugin }} />` 的 TablePlugin。",
  "props": [
    {
      "name": "page",
      "type": "number",
      "description": "当前页码（从 1 开始）。",
      "required": true
    },
    {
      "name": "onPageChange",
      "type": "(page: number) => void",
      "description": "页码变化时调用。",
      "required": true
    },
    {
      "name": "totalItems",
      "type": "number",
      "description": "所有页面的项目总数。用于计算总页数。"
    },
    {
      "name": "pageSize",
      "type": "number",
      "description": "每页项目数。",
      "default": "10"
    },
    {
      "name": "variant",
      "type": "'pages' | 'count' | 'compact' | 'dots' | 'none'",
      "description": "分页控件的视觉变体。",
      "default": "'pages'"
    },
    {
      "name": "position",
      "type": "'below' | 'above' | 'both' | 'none'",
      "description": "分页控件相对于表格的渲染位置。",
      "default": "'below'"
    }
  ],
  "usage": {
    "description": "使用包含页码状态和回调的配置对象调用 useTablePagination。通过 plugins 属性将返回的插件传给 Table。"
  },
  "propDescriptions": {
    "page": "当前页码（从 1 开始）。",
    "onPageChange": "页码变化时调用。",
    "totalItems": "所有页面的项目总数。用于计算总页数。",
    "totalPages": "总页数。已知页数但不知道项目数时使用。",
    "hasMore": "是否还有更多页。用于总数未知的基于游标的分页。",
    "pageSize": "每页项目数。",
    "onPageSizeChange": "用户更改每页条数时调用。与 pageSizeOptions 一起提供时显示每页条数下拉菜单。",
    "pageSizeOptions": "可用的每页条数选项。提供时显示每页条数选择器。",
    "variant": "分页控件的视觉变体。",
    "position": "分页控件相对于表格的渲染位置。",
    "align": "分页控件的水平对齐方式。",
    "label": "分页导航地标的可访问名称。position='both' 时，两个导航会获得不同的名称（标签分别附加 '(top)' 和 '(bottom)'），使同类型地标保持唯一（axe landmark-unique）。"
  }
};

export const docsDense = {
  name: 'useTablePagination',
  displayName: 'useTablePagination',
  description: 'Headless pagination plugin. Client-side slicing, server-side, or cursor-based. Auto-renders Pagination above/below/both.',
  propDescriptions: {
    page: 'Current page (1-based).',
    onPageChange: 'Called on page change.',
    totalItems: 'Total items across all pages.',
    pageSize: 'Items per page. Default 10.',
    variant: "Pagination variant: 'pages'|'count'|'compact'|'dots'|'none'.",
    position: "Render position: 'below'|'above'|'both'|'none'.",
    label: "Accessible name for the nav landmark; position='both' emits '<label> (top)' / '<label> (bottom)'.",
  },
};
