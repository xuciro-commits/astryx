// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for sections-and-placement.doc.mjs.
export const docsZh = {
  "title": "文档分区与放置",
  "description": "为你的包创建独立的文档分区，并在其中放置指南。",
  "sections": [
    {
      "section": "Add a docs section",
      "title": "添加文档分区",
      "content": [
        {
          "type": "prose",
          "text": "使用 `integration add doc <name> --parent <section>` 在文档树中为你的包创建独立分区。首次运行还会写入该分区的命名空间文档。"
        },
        null,
        {
          "type": "code",
          "label": "docs/acme.doc.mjs"
        },
        {
          "type": "list",
          "items": [
            "编辑其 `title` 和 `summary`：读者会在文档列表和你的分区顶部看到它们。",
            "指南 `docs/deploying.doc.mjs` 会获得 `placement: {parent: 'namespace:acme', slot: 'guides'}`。之后使用 `--parent acme` 运行时将复用该命名空间文档。",
            "`package.json` 会获得可选 peer `\"@astryxdesign/cli\": \">=0.6.4\"`，因为旧版 CLI 无法读取分区；参见 {@link generic:versioning}。"
          ]
        }
      ]
    },
    {
      "section": "Place a doc",
      "title": "放置文档",
      "content": [
        {
          "type": "prose",
          "text": "指南通过 `placement` 指定其唯一归属：你的包的一个命名空间、其中的一个槽位，以及一个 `order`。其路由由分区名和指南名依次组成。"
        },
        null,
        {
          "type": "list",
          "items": [
            "所有字段见 {@link schema:authored-doc-graph-fields}。",
            "放置后的指南只能通过其路由 `acme/deploying` 打开。仅用其名称不再能打开它。"
          ]
        },
        null
      ]
    },
    {
      "section": "Fix a failed placement",
      "title": "修复失败的放置",
      "content": [
        {
          "type": "prose",
          "text": "`placement` 失败会隐藏该文档：它不会获得路由，也不会出现在文档列表中。`doctor integration docs` 会以 `invalid_doc_graph` 失败，并指出需要修复的内容。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "你的包未提供的 `parent`（例如 `namespace:cli`）会报「names no namespace」。",
            "命名空间未声明的 `slot` 会报「is not a slot of namespace」；消息中会列出已声明的槽位。",
            "该检查会以退出码 1 结束；参见 {@link generic:check-your-docs}。"
          ]
        }
      ]
    }
  ]
};
