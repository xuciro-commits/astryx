// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for extend-or-replace.doc.mjs.
export const docsZh = {
  "title": "扩展或替换主题",
  "description": "接管一个主题或指南，或向其中合并区块。",
  "sections": [
    {
      "section": "Replace a topic",
      "title": "替换主题",
      "content": [
        {
          "type": "prose",
          "text": "设置 `replaces` 可接管现有主题，例如 Core 的 `getting-started`。打开旧名称的读者会看到你的主题。"
        },
        null,
        {
          "type": "code",
          "label": "docs/acme-getting-started.doc.mjs"
        },
        {
          "type": "prose",
          "text": "文档列表会用你的主题替代旧主题。由于你的主题有自己的 `name`，旧名称仍会解析到它，因此记住了旧名称的链接和 Agent 仍会落到你的主题上。"
        }
      ]
    },
    {
      "section": "Extend a topic",
      "title": "扩展主题",
      "content": [
        {
          "type": "prose",
          "text": "设置 `extends` 可将区块合并到现有主题中，而不是接管它。区块会替换与其匹配的基础区块，未匹配任何基础区块的区块会添加到末尾。"
        },
        null,
        {
          "type": "code",
          "label": "docs/acme-theming.doc.mjs"
        },
        {
          "type": "list",
          "items": [
            "用 `--index` 查看基础主题的键，并为要替换某个基础区块的区块指定该键作为 `id`。替换基础区块的区块会保留其位置。没有 `id` 的区块只会匹配标题完全相同的基础区块，或 `id` 等于其标题生成键的基础区块，因此 `Integration Themes` 会添加在没有 `id` 的基础区块 `Integration themes` 旁边。",
            "将 `before` 或 `after` 设为基础区块的键，可在该位置添加新区块，而不是添加到末尾。不指向任何区块的键会把它添加到末尾，`astryx doctor integration validate` 会列出一条提示。旧版 CLI 会拒绝这些字段，因此请声明从读取它们的版本开始的 `@astryxdesign/cli` peer 范围；没有该范围时 `astryx integration verify` 会发出警告。",
            "主题保留基础的标题和描述，读者通过基础名称打开它。",
            "替换 `integration add` 写入的 `Overview` 占位区块，否则它会被添加到基础主题中。",
            "需要修正或补充时请扩展主题。用 `replaces` 制作的副本将不再获得所有者的修复。"
          ]
        }
      ]
    },
    {
      "section": "Replace or extend a CLI guide",
      "title": "替换或扩展 CLI 指南",
      "content": [
        {
          "type": "prose",
          "text": "CLI 文档树中的指南使用路由而不是主题名称。将 `replaces` 或 `extends` 设置为该路由，即可为安装你的包的每个应用更改该指南：在 Agent 已经阅读的页面上说明你的用户有哪些不同之处。"
        },
        {
          "type": "code",
          "label": "docs/acme-quick-start.doc.mjs"
        },
        {
          "type": "list",
          "items": [
            "你的文档仍是扁平主题：不要为它设置 `placement`。读者通过路由打开指南，绝不会通过你的 `name`。",
            "使用 `replaces` 时，该路由的读者会看到你包下的文档。使用 `extends` 时，你添加或替换的每个区块都会标注你的包名。",
            "不包含主题或指南的名称（例如命名空间）不会产生任何变化；`astryx doctor integration validate` 会将其列为提示，并连同命名空间下的指南一起列出。"
          ]
        },
        null
      ]
    },
    {
      "section": "Check overlaps with Core topics",
      "title": "检查与 Core 主题的重叠",
      "content": [
        {
          "type": "prose",
          "text": "主题应设置 `replaces` 或 `extends`，绝不能两者都设；已放置的指南两者都不设。使用 Core 主题名称但两者都未设置的主题属于意外冲突：应用仍会读取 Core 主题。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "有意的重叠会输出为 `[info]`。意外重叠会以退出码 1 失败。",
            "同时设置两者的主题会以 `invalid_doc` 失败，设置了其中任一项的已放置指南也会如此。"
          ]
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：扩展或替换为整台电脑安装的包中主题的文档，会在任何项目之外的文件夹中生效；在项目内，只有项目安装的包中的文档会生效。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
