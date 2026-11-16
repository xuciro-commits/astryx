// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableFooter',
  subComponentOf: 'Table',
  displayName: 'Table Footer',
  isHiddenFromOverview: true,
  description:
    '<tfoot> wrapper for children mode. Holds summary or total rows beneath the body. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so the two trees mismatch on hydration. Children mode only: the data-driven data={...} path renders a header and a body, never a footer.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <tfoot> rows.',
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
    targets: [{className: 'astryx-table-footer'}],
  },
};

export const docsDense = {
  name: 'TableFooter',
  isHiddenFromOverview: true,
  displayName: 'Table Footer',
  description: '<tfoot> wrapper for children mode; holds summary rows',
  propDescriptions: {
    children: 'The <tfoot> rows.',
    xstyle: 'StyleX styles for layout customization',
  },
};

export const docsZh = {
  "name": "TableFooter",
  "displayName": "Table Footer",
  "description": "用于 children 模式的 <tfoot> 包装器。在主表体下方承载汇总行或总计行。行必须位于某个分区内：<table> 不能直接包含 <tr>，因为 HTML 解析器在解析服务端渲染的标记时会插入一个隐含的 <tbody>，而 React 在客户端渲染时不会，导致两棵树在 hydration 时不一致。仅限 children 模式：数据驱动的 data={...} 路径只渲染表头和表体，从不渲染表尾。",
  "propDescriptions": {
    "children": "<tfoot> 行。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 值，而不是 style={{}} 这样的内联样式对象。"
  }
};
