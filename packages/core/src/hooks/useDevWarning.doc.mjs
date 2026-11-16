// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').HookDoc} */
export const docs = {
  name: 'useDevWarning',
  displayName: 'useDevWarning',
  keywords: [
    'warning',
    'dev',
    'development',
    'console',
    'guardrail',
    'misuse',
    'invariant',
    'debug',
    'devWarn',
  ],
  params: [
    {
      name: 'component',
      type: 'string',
      description: 'Component or hook name, used as the message prefix.',
      required: true,
    },
    {
      name: 'message',
      type: 'string',
      description: 'What went wrong and how to fix it.',
      required: true,
    },
    {
      name: 'condition',
      type: 'boolean',
      description: 'Whether to warn.',
      default: 'true',
    },
  ],
  returns: [],
  usage: {
    description:
      'Fires a dev-only "Component: message" console warning once per mount while the condition holds. It is the render-safe way for a component to flag misuse: warning straight from the render body repeats on every render, and gating it with state adds a re-render, so this uses a ref and an effect instead. For a warning outside a component, use the imperative devWarn utility.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Say what is wrong and what the builder should do instead; the message is the whole value of the warning.',
      },
      {
        guidance: true,
        description:
          'Warn about combinations the types cannot express, such as two mutually exclusive props being set together.',
      },
      {
        guidance: false,
        description:
          'Use it for anything a user could see or for runtime error handling; it is stripped from production builds.',
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
    'Dev-only "Component: message" console warning, once per mount while condition holds. Ref + effect, so it never repeats per render nor causes a re-render. Outside a component, use the imperative devWarn utility.',
  paramDescriptions: {
    component: 'component / hook name, used as message prefix.',
    message: 'what went wrong + how to fix it.',
    condition: 'whether to warn.',
  },
  usage: {
    description:
      'Render-safe guardrail warning from inside a component. Stripped from production builds.',
    bestPractices: [
      {
        guidance: true,
        description:
          'Say what is wrong + what to do instead; the message is the value.',
      },
      {
        guidance: true,
        description:
          'Warn about combinations types cannot express (mutually exclusive props set together).',
      },
      {
        guidance: false,
        description:
          'Use for user-visible problems / runtime error handling; it is dev-only.',
      },
    ],
  },
};

export const docsZh = {
  "name": "useDevWarning",
  "usage": {
    "description": "在条件成立期间，每次挂载触发一次仅开发环境的“Component: message”控制台警告。它是组件标记误用的渲染安全方式：直接从渲染主体发出警告会在每次渲染时重复，而用状态来控制又会增加一次重新渲染，因此这里改用 ref 和 Effect。对于组件之外的警告，请使用命令式的 devWarn 工具。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "说明哪里有问题以及构建者应如何修正；消息是警告的全部价值。"
      },
      {
        "guidance": true,
        "description": "对类型无法表达的组合作出警告，例如两个互斥属性被同时设置。"
      },
      {
        "guidance": false,
        "description": "不要将其用于用户可见的任何内容或运行时错误处理；它会从生产构建中移除。"
      }
    ]
  },
  "paramDescriptions": {
    "component": "组件或 Hook 名称，用作消息前缀。",
    "message": "出了什么问题以及如何修复。",
    "condition": "是否发出警告。"
  },
  "returnDescriptions": {}
};
