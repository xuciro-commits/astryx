// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useCollator',
  displayName: 'useCollator',
  category: 'utilities',
  keywords: [
    'i18n',
    'internationalization',
    'locale',
    'collation',
    'compare',
    'sort',
    'table',
    'hook',
  ],
  params: [
    {
      name: 'options',
      type: 'Intl.CollatorOptions',
      description:
        'Optional collation behavior such as numeric ordering, sensitivity, punctuation handling, and case order.',
      required: false,
    },
  ],
  returns: [
    {
      name: 'collator',
      type: 'Intl.Collator',
      description:
        'A memoized collator bound to the active InternationalizationProvider locale.',
    },
  ],
  usage: {
    description:
      'Returns the sanctioned locale-aware comparator for custom sorting. The collator is recreated when the provider locale or an option changes.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reuse collator.compare in custom Table comparators and other user-visible string ordering.',
      },
      {
        guidance: false,
        description:
          'Construct Intl.Collator directly or call localeCompare; those bypass the provider-backed locale contract.',
      },
    ],
  },
  relatedComponents: ['InternationalizationProvider', 'Table'],
  relatedHooks: ['useLocale'],
  importPath: '@astryxdesign/core',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Returns a memoized Intl.Collator bound to the active InternationalizationProvider locale.',
  paramDescriptions: {
    options:
      'optional Intl.CollatorOptions: numeric ordering, sensitivity, punctuation, case order, etc.',
  },
  returnDescriptions: {
    collator:
      'memoized provider-bound collator for locale-aware comparison and sorting.',
  },
  usage: {
    description:
      'Use collator.compare for custom user-visible string ordering instead of raw Intl.Collator or localeCompare.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Reuse collator.compare in custom Table comparators and string sorting.',
      },
      {
        guidance: false,
        description:
          'Construct raw Intl.Collator or call localeCompare directly.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useCollator",
  "usage": {
    "description": "返回用于自定义排序的、经批准的 locale 感知比较器。当 provider locale 或某个选项变化时会重新创建 collator。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "在自定义 Table 比较器及其他用户可见的字符串排序中复用 `collator.compare`。"
      },
      {
        "guidance": false,
        "description": "不要直接构造 `Intl.Collator` 或调用 `localeCompare`；它们会绕过由 provider 支撑的 locale 契约。"
      }
    ]
  },
  "paramDescriptions": {
    "options": "可选的排序行为，例如数字排序、敏感度、标点处理和大小写顺序。"
  },
  "returnDescriptions": {
    "collator": "绑定到当前 InternationalizationProvider locale 的记忆化 collator。"
  }
};
