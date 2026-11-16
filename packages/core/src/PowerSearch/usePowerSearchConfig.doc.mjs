// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'usePowerSearchConfig',
  displayName: 'usePowerSearchConfig',
  group: 'PowerSearch',
  keywords: [
    'powersearch',
    'search',
    'filter',
    'filters',
    'query builder',
    'table filter',
    'usePowerSearchConfig',
    'createPowerSearchConfig',
  ],
  params: [
    {
      name: 'definitions',
      type: 'ReadonlyArray<FieldDefinition>',
      description:
        'Typed field definitions (key, type, label, enumValues) used to build PowerSearch fields and operators.',
      required: true,
    },
    {
      name: 'configName',
      type: 'string',
      description:
        'Optional name for the PowerSearchConfig object (defaults to "PowerSearchConfig").',
      required: false,
    },
  ],
  returns: [
    {
      name: 'config',
      type: 'PowerSearchConfig',
      description:
        'Memoized PowerSearch configuration object with fields and type-appropriate operators.',
    },
    {
      name: 'applyFilters',
      type: '<T extends InferData<D>>(filters: ReadonlyArray<PowerSearchFilter>, data: ReadonlyArray<T>) => T[]',
      description:
        'Client-side filtering helper that filters a dataset using the active PowerSearch filter rules.',
    },
  ],
  usage: {
    description:
      'Memoizes a PowerSearch configuration built from typed field definitions and returns it along with an applyFilters function for client-side filtering. Automatically maps field types (string, number, boolean, date, enum, etc.) to their canonical operators and provides an efficient predicate evaluator to filter datasets.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Declare field definitions as const outside the component or memoize them so usePowerSearchConfig only recalculates when needed.',
      },
      {
        guidance: true,
        description:
          'Pass the returned config to PowerSearch and use applyFilters to compute the filtered data rows for a Table or List.',
      },
      {
        guidance: false,
        description:
          'Recreate field definitions inline on every render without as const or memoization.',
      },
    ],
  },
  relatedComponents: ['PowerSearch', 'Table'],
  relatedHooks: ['useTableFilterState', 'useTableFiltering'],
  importPath: '@astryxdesign/core/PowerSearch',
  category: 'utilities',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Memoizes PowerSearch config from typed field definitions + returns applyFilters for client filtering. Automatically maps types (string, number, date, enum) to canonical operators.',
  paramDescriptions: {
    definitions: 'Typed field definitions (key, type, label, enumValues).',
    configName: 'Optional config name (defaults to "PowerSearchConfig").',
  },
  returnDescriptions: {
    config: 'Memoized PowerSearchConfig for PowerSearch.',
    applyFilters: 'Filters dataset against active PowerSearch filters.',
  },
  usage: {
    description:
      'Builds memoized PowerSearch config and client filtering function from field definitions.',
    bestPractices: [
      {
        guidance: true,
        description: 'Declare definitions with as const outside component.',
      },
      {
        guidance: true,
        description:
          'Pass config to PowerSearch and use applyFilters for Table/List data.',
      },
      {
        guidance: false,
        description: 'Recreate field definitions inline on every render.',
      },
    ],
  },
};

export const docsZh = {
  "name": "usePowerSearchConfig",
  "usage": {
    "description": "对根据带类型的字段定义构建的 PowerSearch 配置进行记忆化，并连同用于客户端筛选的 applyFilters 函数一起返回。自动将字段类型（string、number、boolean、date、enum 等）映射到其规范运算符，并提供高效的谓词求值器来筛选数据集。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将字段定义以 `as const` 声明在组件外部，或对其进行记忆化，使 usePowerSearchConfig 仅在需要时重新计算。"
      },
      {
        "guidance": true,
        "description": "将返回的 config 传给 PowerSearch，并使用 applyFilters 为 Table 或 List 计算筛选后的数据行。"
      },
      {
        "guidance": false,
        "description": "不要在每次渲染时以内联方式重新创建字段定义，也不要省略 `as const` 或记忆化。"
      }
    ]
  },
  "paramDescriptions": {
    "definitions": "用于构建 PowerSearch 字段和运算符的带类型字段定义（key、type、label、enumValues）。",
    "configName": "PowerSearchConfig 对象的可选名称（默认值为 \"PowerSearchConfig\"）。"
  },
  "returnDescriptions": {
    "config": "经过记忆化的 PowerSearch 配置对象，包含字段和与类型相配的运算符。",
    "applyFilters": "客户端筛选辅助函数，使用当前生效的 PowerSearch 筛选规则筛选数据集。"
  }
};
