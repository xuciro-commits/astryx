// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for single-component.doc.mjs.
export const docsZh = {
  "title": "单组件",
  "description": "编写默认组件文档：说明何时使用该组件，记录每个公开属性，并添加有针对性的示例。",
  "sections": [
    {
      "section": "Start from the generated doc",
      "title": "从生成的文档开始",
      "content": [
        {
          "type": "prose",
          "text": "`integration add component` 会为一个公开组件创建常规文档。保留生成的身份标识和导入，然后将其示例文本和属性替换为组件真实的公开契约。"
        },
        {
          "type": "code",
          "label": "components/AcmeCarousel.doc.mjs"
        },
        {
          "type": "list",
          "items": [
            "将 `props` 保留在顶层文档中。私有实现辅助函数无需条目。",
            "以旁边的源码文件命名文档，例如将 `AcmeCarousel.doc.mjs` 放在 `AcmeCarousel.tsx` 旁边，并在同一个拉取请求中同时修改两者。",
            "如果该模块之后暴露多个相关的公开导出，请使用 {@link generic:component-family} 调整此文档。"
          ]
        },
        {
          "type": "prose",
          "text": "每个字段都在 {@link schema:component-doc} 中。"
        }
      ]
    },
    {
      "section": "Explain when to use it",
      "title": "说明何时使用",
      "content": [
        {
          "type": "prose",
          "text": "编写 `usage.description`，让用户或代理无需打开源码就能判断这是否是合适的组件。说明它做什么、何时使用，以及与相邻替代方案之间最重要的边界。"
        },
        null,
        {
          "type": "prose",
          "text": "将 `keywords` 设为人们会搜索的词：同义词以及组件完成的任务，例如 `keywords: ['slider', 'slideshow', 'rotating cards']`。`{@command search}` 会将以组件名称或关键词匹配的结果排在描述匹配之前，因此如果没有关键词，搜索组件用途时可能先列出 Core 组件。请用用户可能输入的说法检查："
        },
        null
      ]
    },
    {
      "section": "Document every public prop",
      "title": "记录每个公开属性",
      "content": [
        {
          "type": "prose",
          "text": "从源码复制公开属性名称和类型。解释调用方可以控制的行为，而不只是 TypeScript 类型。"
        },
        null,
        {
          "type": "list",
          "items": [
            "仅当每个调用方都必须传入该属性时才设置 `required: true`。",
            "按值在文档中应出现的方式准确编写 `default`。",
            "跳过 `xstyle`、`className` 和 `style` 等样式逃逸口。",
            "`{@command doctor integration components}` 会列出代码中缺少的已记录属性、文档遗漏的公开属性以及错误的 `required`。参见 {@link generic:check-the-props}。"
          ]
        }
      ]
    },
    {
      "section": "Add focused examples",
      "title": "添加有针对性的示例",
      "content": [
        {
          "type": "prose",
          "text": "为属性表无法清楚说明的重要用法添加简短示例。每个示例应讲解一个完整的模式，并且只使用公开导入。"
        },
        null,
        {
          "type": "prose",
          "text": "示例的 `kind` 默认为 `'demo'`：它会独立运行，因此文档站点可以将其显示为实时预览。对于无法独立运行的代码，请设置 `kind: 'setup'`，例如应用设置文件、服务端路由或使用别处定义变量的代码片段；它始终仅以代码形式显示。"
        },
        {
          "type": "prose",
          "text": "当示例代码作为 TSX 模块可以编译、以它渲染的 JSX 结尾（或声明组件，或默认导出组件），并且仅导入该包、该包声明的包、React 和 Core 时，演示才能独立运行：不能使用相对路径，也不能包含仅在服务端运行的代码。它使用的每个名称都必须在其内部定义或已导入，但该包文档化的组件、Core 文档化的组件和 Hook、React 的导出以及 `window` 等浏览器全局对象除外。提供一个示例值即可：`const viewer = {name: 'Ada'};`。`{@command doctor integration validate}` 会列出每个无法独立运行的演示及修复方法。"
        }
      ]
    },
    {
      "section": "Read the result",
      "title": "查看结果",
      "content": [
        {
          "type": "prose",
          "text": "每次修改源码或文档后都要重新阅读组件。确认其用途、导入、属性、默认值和示例与源码一致，然后验证打包后的包。"
        },
        null
      ]
    }
  ]
};
