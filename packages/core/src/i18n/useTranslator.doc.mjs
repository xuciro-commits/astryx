// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useTranslator',
  displayName: 'useTranslator',
  category: 'utilities',
  keywords: [
    'i18n',
    'internationalization',
    'localization',
    'translation',
    'translate',
    'locale',
    'hook',
  ],
  params: [],
  returns: [
    {
      name: 'value',
      type: '(key: string, values?: Record<string, string | number | Date>) => string',
      description:
        'A stable translator function bound to the current InternationalizationProvider context. Call it with a message key and optional ICU MessageFormat values to get the formatted string in the active locale. Safe to use in render, event handlers, effects, or any code that runs during the parent component\'s lifecycle.',
    },
  ],
  usage: {
    description:
      'Returns a translator function that resolves keys against the current locale, provider overrides, and the shipped English fallback catalog. Call inside a component; the returned function can be used anywhere within that component\'s scope.',
  },
  relatedComponents: ['InternationalizationProvider'],
  importPath: '@astryxdesign/core',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Hook returning a translator function bound to the current InternationalizationProvider context. Call with an ICU MessageFormat key and values to get the formatted string for the active locale.',
  usage: {
    description:
      'Returns a translator function that resolves keys against the current locale, provider overrides, and the shipped English fallback catalog.',
  },
  returnDescriptions: {
    value:
      'translator function bound to current InternationalizationProvider context. Call with message key + optional ICU MessageFormat values; returns formatted string in active locale. Safe in render, event handlers, effects.',
  },
};

export const docsZh = {
  "name": "useTranslator",
  "usage": {
    "description": "返回一个翻译函数，它根据当前区域设置、provider 覆盖和随附的英文回退目录解析键。在组件内调用；返回的函数可在该组件作用域内的任何地方使用。"
  },
  "paramDescriptions": {},
  "returnDescriptions": {
    "value": "绑定到当前 InternationalizationProvider 上下文的稳定翻译函数。用消息键和可选的 ICU MessageFormat 值调用它，即可获得活动区域设置下的格式化字符串。可安全用于渲染、事件处理函数、effect 或任何在父组件生命周期内运行的代码。"
  }
};
