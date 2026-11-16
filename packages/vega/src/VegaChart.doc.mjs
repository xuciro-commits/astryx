// Copyright (c) Meta Platforms, Inc. and affiliates.

/** @type {import('@astryxdesign/cli/authoring').ComponentDoc} */
export const docs = {
  name: 'VegaChart',
  displayName: 'Vega Chart',
  category: 'Data Visualization',
  keywords: ['vega', 'vega-lite', 'chart', 'data visualization'],
  props: [
    {
      name: 'spec',
      type: 'AnySpec',
      description:
        'A Vega or Vega-Lite specification with an official $schema URL.',
      required: true,
    },
    {
      name: 'data',
      type: 'ViewData',
      description:
        'Initial values for datasets named by the spec. Read when the view is created; later updates should use the live View.',
    },
    {
      name: 'compileOptions',
      type: 'CompileOptions',
      description:
        'Options passed to Vega-Lite compilation. Ignored for native Vega specs.',
    },
    {
      name: 'parseConfig',
      type: 'Config',
      description: 'Vega configuration passed to vega.parse().',
    },
    {
      name: 'parseOptions',
      type: 'ParseOptions',
      description: 'Options passed to vega.parse().',
    },
    {
      name: 'viewOptions',
      type: "Omit<ViewOptions, 'container'>",
      description:
        'Options passed to the Vega View. The component always supplies the container.',
    },
    {
      name: 'onReady',
      type: '(view: View) => void',
      description: 'Called with the live Vega View after the first render.',
    },
    {
      name: 'onError',
      type: '(error: Error) => void',
      description:
        'Called when schema validation, compilation, or rendering fails.',
    },
  ],
  usage: {
    description:
      'Renders Vega and Vega-Lite specifications through the Vega runtime. Experimental component in @astryxdesign/vega (canary).',
    bestPractices: [
      {
        guidance: true,
        description:
          'Only render specifications you authored or reviewed. For untrusted specs, configure the interpreter and a restricted loader as described in the package README.',
      },
      {
        guidance: true,
        description:
          'Keep spec and option objects stable to avoid recreating the Vega View unnecessarily.',
      },
    ],
  },
};

export const docsZh = {
  "name": "VegaChart",
  "displayName": "Vega Chart",
  "usage": {
    "description": "通过 Vega 运行时渲染 Vega 和 Vega-Lite 规范。@astryxdesign/vega 中的实验性组件（canary）。",
    "bestPractices": [
      {
        "guidance": true,
        "description": "仅渲染你编写或审核过的规范。对于不受信任的规范，请按包 README 所述配置解释器和受限加载器。"
      },
      {
        "guidance": true,
        "description": "保持 spec 和 option 对象稳定，以免不必要地重新创建 Vega View。"
      }
    ]
  },
  "propDescriptions": {
    "spec": "带有官方 $schema URL 的 Vega 或 Vega-Lite 规范。",
    "data": "按规范命名的数据集的初始值。在创建视图时读取；后续更新应使用实时 View。",
    "compileOptions": "传给 Vega-Lite 编译的选项。对原生 Vega 规范忽略。",
    "parseConfig": "传给 vega.parse() 的 Vega 配置。",
    "parseOptions": "传给 vega.parse() 的选项。",
    "viewOptions": "传给 Vega View 的选项。组件始终提供容器。",
    "onReady": "首次渲染后以实时 Vega View 调用。",
    "onError": "当模式校验、编译或渲染失败时调用。"
  }
};
