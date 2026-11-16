// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */

export const docs = {
  name: 'useTableRowIndex',
  subComponentOf: 'Table',
  displayName: 'useTableRowIndex',
  description:
    'Hook that returns a TablePlugin which prepends a right-aligned, monospaced row-number column, starting at 1 by default. Without data, Table supplies row positions; with data, ordinary numbers follow that array. Windowed rows use the parent Table logical position directly; nondefault startFrom values use full rendering.',
  props: [
    {
      name: 'data',
      type: 'T[]',
      description:
        'Optional: the array whose order the numbers follow. Omit it to number rows from the positions Table gives them.',
    },
    {
      name: 'getRowKey',
      type: '(item: T) => string',
      description:
        'Optional key extractor used with data, returning a unique string per row. When provided, rows match data by the returned string; otherwise by reference identity. Memoize with useCallback for a stable plugin identity.',
    },
    {
      name: 'label',
      type: 'ReactNode',
      description: 'Header label for the index column.',
      default: "'#'",
    },
    {
      name: 'startFrom',
      type: 'number',
      description: 'First index value.',
      default: '1',
    },
  ],
};

/** @type {import('@astryxdesign/cli/authoring').ComponentTranslationDoc} */
export const docsDense = {
  description:
    'Returns a TablePlugin with a right-aligned monospaced row-number column, 1-based by default. Without data, Table supplies positions; with data, ordinary numbers follow it. Windowed rows use the parent logical position, and nondefault startFrom falls back to full rendering.',
  propDescriptions: {
    data: 'Optional array whose order ordinary numbers follow; omit to use Table row positions.',
    getRowKey:
      'Optional key extractor used with data; otherwise items match by reference.',
    label: "Header label for the index column. Default '#'.",
    startFrom: 'First index value. Default 1.',
  },
};

export const docsZh = {
  "name": "useTableRowIndex",
  "description": "返回 TablePlugin 的 Hook，该插件会前置一个右对齐、等宽的航号列，默认从 1 开始。没有 data 时，Table 提供行位置；有 data 时，普通数字跟随该数组。窗口化的行直接使用父 Table 的逻辑位置；非默认的 startFrom 值使用完整渲染。",
  "propDescriptions": {
    "data": "可选：数字顺序所遵循的数组。省略它则根据 Table 给行的位置编号。",
    "getRowKey": "可选键提取器，与 data 一起使用，返回每行唯一的字符串。提供时，行按返回的字符串与 data 匹配；否则按引用标识匹配。使用 useCallback 记忆化以获得稳定的插件标识。",
    "label": "索引列的页眉标签。",
    "startFrom": "第一个索引值。"
  }
};
