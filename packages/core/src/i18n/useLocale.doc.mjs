// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useLocale',
  displayName: 'useLocale',
  category: 'utilities',
  keywords: [
    'i18n',
    'internationalization',
    'localization',
    'locale',
    'language',
    'provider',
    'hook',
  ],
  params: [],
  returns: [
    {
      name: 'locale',
      type: 'Locale',
      description:
        "The active InternationalizationProvider BCP 47 locale. Falls back to 'en' when no provider is present.",
    },
  ],
  usage: {
    description:
      'Reads the authoritative Astryx locale. Use it to thread the provider locale into pure formatting helpers and sibling-package APIs; do not derive a second locale from navigator.language or a hardcoded literal.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Pass the returned locale to pure Astryx helpers or package APIs that require an explicit locale.',
      },
      {
        guidance: false,
        description:
          'Use navigator.language or a hardcoded display locale as a fallback; InternationalizationProvider is the locale source.',
      },
    ],
  },
  relatedComponents: ['InternationalizationProvider'],
  relatedHooks: ['useCollator', 'useTranslator', 'useDirection'],
  importPath: '@astryxdesign/core',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    "Returns the active InternationalizationProvider locale, falling back to 'en' without a provider.",
  usage: {
    description:
      'Use as the sole locale source for pure formatting helpers and sibling-package APIs.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Thread this locale into pure helpers requiring an explicit locale.',
      },
      {
        guidance: false,
        description:
          'Fall back to navigator.language or a hardcoded display locale.',
      },
    ],
  },
  returnDescriptions: {
    locale: "active provider BCP 47 locale; 'en' without a provider.",
  },
};

export const docsZh = {
  "name": "useLocale",
  "usage": {
    "description": "读取权威的 Astryx 区域设置。使用它将提供程序的区域设置传入纯格式化辅助函数和同级包 API；不要从 navigator.language 或硬编码字面量派生第二个区域设置。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "将返回的区域设置传给需要显式区域设置的纯 Astryx 辅助函数或包 API。"
      },
      {
        "guidance": false,
        "description": "不要使用 navigator.language 或硬编码的显示区域设置作为回退；InternationalizationProvider 才是区域设置来源。"
      }
    ]
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "locale": "活动的 InternationalizationProvider BCP 47 区域设置。没有提供程序时回退到 'en'。"
  }
};
