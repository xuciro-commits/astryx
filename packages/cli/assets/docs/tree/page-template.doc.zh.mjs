// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for page-template.doc.mjs.
export const docsZh = {
  "title": "页面模板",
  "description": "帮助用户找到页面：为 `{@command search}` 和模板列表提供一个分类，并把内容稀疏的起始外壳标记为脚手架。",
  "sections": [
    {
      "section": "Start from the generated page doc",
      "title": "从生成的页面文档开始",
      "content": [
        {
          "type": "prose",
          "text": "`integration add template` 默认会写入一份页面文档。替换其中的示例描述，然后添加下面这些页面专属字段。"
        },
        {
          "type": "code",
          "label": "templates/acme-dashboard.doc.mjs"
        }
      ]
    },
    {
      "section": "Help people find the page",
      "title": "帮助用户找到页面",
      "content": [
        {
          "type": "prose",
          "text": "每个字段都参见 {@link schema:template-doc}。"
        },
        {
          "type": "list",
          "items": [
            "把 `category` 设为支持范围内最具体的 `{Group} - {Variant}` 值。其中的词语会成为 `{@command search}` 的搜索词，并且它会出现在 JSON 模板列表中。",
            "仅当起始外壳有意保持稀疏时，才设置 `scaffold: true`。JSON 模板列表会报告这一点，因此工具和图库可以区分脚手架和完整页面。",
            "只有 Astryx 自己的图库会读取的字段（例如 `isHiddenFromOverview`）对集成模板没有影响。"
          ]
        }
      ]
    }
  ]
};
