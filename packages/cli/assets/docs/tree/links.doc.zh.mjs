// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for links.doc.mjs.
export const docsZh = {
  "title": "链接",
  "description": "把一个文档链接到另一个文档，使文档移动后链接仍然有效。",
  "sections": [
    {
      "section": "Link another doc",
      "title": "链接另一个文档",
      "content": [
        {
          "type": "prose",
          "text": "在正文、列表项和表格单元格中写 `{@link [provider:]kind:name}` 来链接另一个文档。CLI 会打印打开它的命令，因此文档移动后链接仍然有效。"
        },
        null,
        {
          "type": "prose",
          "text": "每个链接读起来就是一条命令。这个链接 {@link generic:extend-or-replace} 会打开下一篇指南。"
        },
        {
          "type": "list",
          "items": [
            "种类（kind）的取值：`generic` 用于主题或指南，`namespace` 表示文档分区，`command` 或 `function` 表示 CLI 命令或 API 函数，`schema` 或 `enum` 表示模式或一组固定值，`component` 表示组件，`page` 或 `block` 表示模板。",
            "组件用其导出名指定，模板用其 id 指定。它的链接读起来就是打开它的命令，例如 `{@command component AcmeCarousel --package @acme/widgets}`。",
            "在反引号或代码块内，链接语法按原样输出。"
          ]
        }
      ]
    },
    {
      "section": "Link another package's docs",
      "title": "链接其他包的文档",
      "content": [
        {
          "type": "prose",
          "text": "不带 provider 的链接会在你自己的包中解析。要链接 CLI 的文档或其他包的文档，请把目标的包名放在前面，例如 `@astryxdesign/cli:`。"
        },
        null,
        {
          "type": "list",
          "items": [
            "按输入 CLI 命令的原样指定它，包含空格，例如 `@astryxdesign/cli:command:doctor integration docs`。",
            "在 `extends` 另一个包主题的主题中，你的各节仍会在自己的包中解析，因此指向基础主题文档的链接需要带上它的 provider。"
          ]
        }
      ]
    },
    {
      "section": "Fix a link that names no doc",
      "title": "修复未指向任何文档的链接",
      "content": [
        {
          "type": "prose",
          "text": "没有指向任何文档的链接会按原样输出，`doctor integration docs` 会给出警告。警告中会给出一个能找到正确目标的搜索。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "该警告不会改变退出码（仍为 0），因此发布前请先读报告；参见 {@link generic:check-your-docs}。",
            "已发布的 0.6.4 及以后版本会解析链接。较旧的 CLI（例如已发布的 0.6.3）会把每个链接按原样输出；参见 {@link generic:versioning}。"
          ]
        }
      ]
    }
  ]
};
