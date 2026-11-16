// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for template-doc-overview.doc.mjs.
export const docsZh = {
  "title": "模板文档概览",
  "description": "了解模板文档控制什么，在 UI 变化时保持其准确，并检查 Astryx 如何列出该模板。",
  "sections": [
    {
      "section": "Understand the two files",
      "title": "了解这两个文件",
      "content": [
        {
          "type": "prose",
          "text": "每个模板都有一个源文件和一个文档文件。对于 `acme-dashboard`，源文件是 `templates/acme-dashboard.tsx`，文档是 `templates/acme-dashboard.doc.mjs`。两者都以 `acme-dashboard` 开头，Astryx 据此知道它们属于同一模板。"
        },
        {
          "type": "table",
          "headers": [
            "文件",
            "控制内容"
          ],
          "rows": [
            [
              "`templates/acme-dashboard.tsx`",
              "应用复制并随后拥有的 UI 源码。"
            ],
            [
              "`templates/acme-dashboard.doc.mjs`",
              "Astryx 在复制模板前如何为其命名、描述、分类、预览和解析。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "集成清单将 Astryx 指向 `templates` 目录，而不会列出每个模板。当用途、预览、就绪状态或替换行为发生变化时，请同时修改源文件和文档。没有任何自动化检查能判断文档是否仍在描述实际渲染的 UI。"
        }
      ]
    },
    {
      "section": "Document the shared fields",
      "title": "说明共享字段",
      "content": [
        {
          "type": "prose",
          "text": "以下字段适用于每个页面和区块。页面、区块和替换指南会补充各自特有的字段。"
        },
        {
          "type": "prose",
          "text": "每个字段都在 {@link schema:template-doc} 中。"
        },
        {
          "type": "list",
          "items": [
            "将 `type` 设为你在 {@link generic:start-a-template} 中选择的类型。它决定文档接受哪些其他字段。",
            "文件名决定模板 id（{@link generic:start-a-template}）。显示标签位于文档中：终端列表打印 `name`，JSON 列表打印 `displayName`。更改其中任何一个都不会改变 id。",
            "针对在多个模板之间做选择的读者编写描述。{@link generic:template-grading-rubric} 中的 Doc 元数据类别定义了完整描述应涵盖的内容。",
            "在 `keywords` 中列出模板服务的概念：构建者可能用来称呼它的领域、任务和其他名称，使用小写，例如服务健康仪表盘的 `['monitoring', 'uptime', 'on-call']`。用用户会使用的词语描述页面：根据源码和用途说明页面是什么、用来做什么。每个关键词只表达一个概念。{@link generic:field-reference} 说明了如何编写短语以及搜索和构建如何使用关键词，因此描述可以专注于布局。",
            "生成文档后立即添加 `isReady: false`，因为不含 `isReady` 的文档会被列为已就绪。请保持该设置，直到模板通过 {@link generic:test-template-in-app} 和质量审查。"
          ]
        },
        {
          "type": "prose",
          "text": "注意：`keywords` 需要 `@astryxdesign/cli` 0.6.6 或更高版本。0.6.6 之前的稳定版 CLI 会拒绝该字段并丢弃该模板，0.6.4 之前的版本还会隐藏你的文档主题：`template --list` 和 `search` 会打印一条警告，而 `docs` 和 `build` 不显示任何提示。请将 CLI 最低版本声明为可选 peer（{@link generic:versioning}）；在此之前 `integration verify` 会失败。"
        }
      ]
    },
    {
      "section": "Check how Astryx lists it",
      "title": "查看 Astryx 如何列出它",
      "content": [
        {
          "type": "prose",
          "text": "每次修改文档后都要阅读包级模板列表。确认 id、可见名称、描述、类型、就绪状态和包。"
        },
        null,
        {
          "type": "code",
          "label": "相关列表结果"
        }
      ]
    }
  ]
};
