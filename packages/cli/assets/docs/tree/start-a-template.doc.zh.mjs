// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for start-a-template.doc.mjs.
export const docsZh = {
  "title": "开始创建模板",
  "description": "将你的 UI 想法变成完整页面或页面分区，帮助他人更快构建应用，并共享一致的视觉语言。",
  "sections": [
    {
      "section": "What a template is",
      "title": "什么是模板",
      "content": [
        {
          "type": "prose",
          "text": "与组件不同，模板会成为应用代码：应用会将其复制到自己的代码中，并根据产品进行调整。"
        },
        {
          "type": "prose",
          "text": "组件始终是包的依赖项，并随包更新。复制后的模板则不会，因此更新包绝不会重写应用中的副本。"
        },
        null
      ]
    },
    {
      "section": "Why share one",
      "title": "为什么要共享模板",
      "content": [
        {
          "type": "prose",
          "text": "模板能帮助他人更快构建应用，同时让各产品保持一致的视觉语言。当人们需要不止一个组件才能上手时，就共享一个模板：模板已经将合适的组件、布局、内容结构和交互连接组装好了。"
        },
        {
          "type": "prose",
          "text": "不要只是为了共享结构，就把产品特有的页面做成死板的组件。把它作为模板共享，让每个应用自行调整其副本。"
        }
      ]
    },
    {
      "section": "Choose a page or block",
      "title": "选择页面或区块",
      "content": [
        {
          "type": "table",
          "headers": [
            "类型",
            "用途"
          ],
          "rows": [
            [
              "页面",
              "一个完整的屏幕，例如仪表盘、设置页面或结账流程。"
            ],
            [
              "区块",
              "可以放入页面内的较小分区，例如主视觉区、表单或数据面板。区块也可以是组件的示例或展示。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Pick a template id",
      "title": "选择模板 id",
      "content": [
        {
          "type": "prose",
          "text": "选择一个稳定的小写 kebab-case id，例如 `acme-dashboard`。该 id 会成为源文件和文档文件名、包的导出名，以及应用传给 `{@command template}` 的值。要更改标签，请编辑文档（{@link generic:template-doc-overview}）；绝不要重命名该 id。"
        },
        {
          "type": "list",
          "items": [
            "以你的产品或包名开头，然后为可复用模式命名，使该 id 与 Core 及其他集成保持区分。",
            "不要以 `-page`、`-app`、`-view` 或 `-screen` 结尾。",
            "不要意外复用 Core 的 id：在安装了你的包的每个应用中，裸 id 都会产生歧义。若要刻意接管某个 Core 模板，请声明 `replaces`（{@link generic:replace-a-core-template}）。"
          ]
        },
        null
      ]
    },
    {
      "section": "Run the add command",
      "title": "运行 add 命令",
      "content": [
        {
          "type": "prose",
          "text": "页面是默认类型。传入 `--type block` 可添加区块。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "该命令会为 UI 写入 `templates/<id>.tsx`，为其元数据写入 `templates/<id>.doc.mjs`，并在 `astryx.integration.mjs` 中声明模板目录。当 `package.json` 有 `exports` 映射时，还会添加 `./templates/<id>` 导出（{@link generic:export-template-assets}）。"
        },
        {
          "type": "prose",
          "text": "它绝不会覆盖已有的源文件或文档文件。添加 `--dry-run` 可先查看所有计划写入。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式下",
      "content": [
        {
          "type": "prose",
          "text": "全局模式下：当用户为他们的电脑安装你的包（与全局 CLI 并存）时，你的模板会在任何项目之外的文件夹中显示；在项目内部，仅当项目安装了你的包时才显示。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
