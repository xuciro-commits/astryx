// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'TableBody',
  subComponentOf: 'Table',
  displayName: 'Table Body',
  isHiddenFromOverview: true,
  description:
    '<tbody> wrapper for children mode. Holds the data rows. A row must sit inside a section: <table> cannot contain a <tr> directly, because the HTML parser inserts an implied <tbody> when it parses server-rendered markup and React does not when it renders on the client, so rows written straight into Table mismatch on hydration. The data-driven data={...} mode renders this element itself; in children mode it is yours to supply.',
  props: [
    {
      name: 'children',
      type: 'ReactNode',
      description: 'The <tbody> rows.',
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
    targets: [{className: 'astryx-table-body'}],
  },
};

export const docsDense = {
  name: 'TableBody',
  isHiddenFromOverview: true,
  displayName: 'Table Body',
  description: '<tbody> wrapper for children mode; holds the data rows; children mode does not add one for you',
  propDescriptions: {
    children: 'The <tbody> rows.',
    xstyle: 'StyleX styles for layout customization',
  },
};

export const docsZh = {
  "name": "TableBody",
  "displayName": "Table Body",
  "description": "<tbody> 包装器，用于 children 模式。承载数据行。行必须位于某个 section 内：<table> 不能直接包含 <tr>，因为 HTML 解析器解析服务端渲染的标记时会插入隐式的 <tbody>，而 React 在客户端渲染时不会，因此直接写入 Table 的行会在 hydration 时不匹配。数据驱动的 data={...} 模式会自行渲染此元素；在 children 模式下则需要你自行提供。",
  "propDescriptions": {
    "children": "<tbody> 的行。",
    "xstyle": "用于布局自定义的 StyleX 样式。必须是 stylex.create() 的值：不能是 style={{}} 这样的内联样式对象。"
  }
};
