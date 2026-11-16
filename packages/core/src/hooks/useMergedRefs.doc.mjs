// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useMergedRefs',
  displayName: 'useMergedRefs',
  keywords: [
    'ref',
    'refs',
    'merge',
    'forwardRef',
    'callback ref',
    'stable ref',
  ],
  params: [
    {
      name: 'refs',
      type: 'Array<Ref<T> | undefined>',
      description: 'Up to six refs that should all receive the same element.',
      required: true,
    },
  ],
  returns: [
    {
      name: 'ref',
      type: 'RefCallback<T>',
      description:
        'A merged callback ref that remains stable until an input ref changes.',
    },
  ],
  usage: {
    description:
      'Combines multiple object or callback refs into one stable callback ref. Use it when a component must forward a consumer ref while also attaching internal refs. Unlike calling mergeRefs during render, the callback identity stays stable across unrelated rerenders, so React does not detach and reattach the element.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use useMergedRefs when one element must receive both a forwarded ref and one or more internal refs.',
      },
      {
        guidance: false,
        description:
          'Call mergeRefs directly in a JSX ref prop; that creates a new callback on every render and forces unnecessary detach and attach work.',
      },
    ],
  },
  relatedComponents: [],
  relatedHooks: [],
  importPath: '@astryxdesign/core/hooks',
  category: 'utility',
};

/** @type {import('@astryxdesign/cli/authoring').HookTranslationDoc} */
export const docsDense = {
  description:
    'Combines object/callback refs into one stable callback ref. Identity changes only when an input ref changes, avoiding detach/attach churn from inline mergeRefs calls.',
  paramDescriptions: {
    refs: 'refs that should all receive the same element.',
  },
  returnDescriptions: {
    ref: 'stable merged callback ref; changes only when an input ref changes.',
  },
  usage: {
    description:
      'Use when one element needs a forwarded consumer ref plus internal refs. Keeps the callback stable across unrelated rerenders.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Use for a forwarded ref plus internal measurement, focus, or anchor refs.',
      },
      {
        guidance: false,
        description:
          'Call mergeRefs inline in JSX; it forces ref detach/attach on every render.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useMergedRefs",
  "usage": {
    "description": "将多个对象 ref 或回调 ref 合并为一个稳定的回调 ref。当组件必须转发使用方 ref 同时还要附加内部 ref 时使用。与在渲染期间调用 mergeRefs 不同，回调标识在无关的重新渲染之间保持稳定，因此 React 不会分离并重新附加元素。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "当一个元素必须同时接收转发 ref 和一个或多个内部 ref 时，使用 useMergedRefs。"
      },
      {
        "guidance": false,
        "description": "在 JSX 的 ref 属性中直接调用 mergeRefs；这会在每次渲染时创建新回调，并强制进行不必要的分离和附加工作。"
      }
    ]
  },
  "paramDescriptions": {
    "refs": "最多六个 ref，它们都应接收同一个元素。"
  },
  "returnDescriptions": {
    "ref": "合并后的回调 ref，在输入 ref 变化之前保持稳定。"
  }
};
