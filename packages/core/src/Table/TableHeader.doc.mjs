// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableHeader',
  subComponentOf: 'Table',
  displayName: 'Table Header',
  isHiddenFromOverview: true,
  description:
    '<thead> wrapper for children mode. Holds the header row, whose cells are TableHeaderCell. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so the two trees mismatch on hydration. The data-driven data={...} mode renders this element itself whenever columns are supplied; in children mode it is yours to supply.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <thead> rows.',
      required: true,
    },
    {
      name: 'xstyle',
      type: 'StyleXStyles',
      description:
        'StyleX styles for layout customization. Must be a stylex.create() value: not an inline style object like style={{}}.',
    },
  ],
  theming: {
    targets: [{className: 'astryx-table-header'}],
  },
};

export const docsDense = {
  name: 'TableHeader',
  isHiddenFromOverview: true,
  displayName: 'Table Header',
  description: '<thead> wrapper for children mode; holds the header row',
  propDescriptions: {
    children: 'The <thead> rows.',
    xstyle: 'StyleX styles for layout customization',
  },
};

export const docsZh = {
  "name": "TableHeader",
  "displayName": "Table Header",
  "description": "children 模式的 <thead> 包装器。它持有表头行，其单元格为 TableHeaderCell。行必须位于 section 内：<table> 不能直接包含 <tr>，因为 HTML 解析器在解析服务端渲染的标记时会插入隐含的 <tbody>，而 React 在客户端渲染时不会，导致两棵树在水合时不一致。数据驱动的 data={...} 模式在提供 columns 时会自行渲染此元素；在 children 模式下则由你提供。",
  "propDescriptions": {
    "children": "<thead> 的行。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值：不是 style={{}} 这样的内联样式对象。"
  }
};
