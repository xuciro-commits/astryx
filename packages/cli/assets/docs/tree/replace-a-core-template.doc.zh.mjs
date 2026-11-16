// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for replace-a-core-template.doc.mjs.
export const docsZh = {
  "title": "替换 Core 模板",
  "description": "仅当集成有意更改某个 Core 模板 id 返回的默认源码时，才使用模板替换。",
  "sections": [
    {
      "section": "Replace only on purpose",
      "title": "仅在有意时替换",
      "content": [
        {
          "type": "prose",
          "text": "请谨慎使用：仅当所有使用此集成的应用都应在默认情况下收到你为现有 Core id 提供的源码时，才替换 Core 模板。替代方案、特定产品的变体或不同种类的模板应改用它们自己的 id（{@link generic:start-a-template}）。"
        },
        {
          "type": "list",
          "items": [
            "共享 Core id 而不使用 `replaces` 并不会替换 Core。它会让裸 id 产生歧义，因此 `{@command template <id>}` 会失败，直到应用添加 `--package`，并且 `doctor integration templates` 会报告意外的冲突。",
            "替换可以保留 Core id，也可以使用自己的 id。`replaces` 才是使其成为默认项的关键。"
          ]
        }
      ]
    },
    {
      "section": "Declare the replacement",
      "title": "声明替换",
      "content": [
        {
          "type": "prose",
          "text": "首先找到确切的 Core id 和种类。"
        },
        null,
        {
          "type": "code",
          "label": "templates/acme-app-shell.doc.mjs"
        },
        {
          "type": "prose",
          "text": "所有字段都在 {@link schema:template-doc} 中。"
        },
        {
          "type": "prose",
          "text": "在模板文档上声明 `replaces`，绝不要在 `astryx.integration.mjs` 中声明。"
        }
      ]
    },
    {
      "section": "Require a compatible CLI",
      "title": "要求兼容的 CLI",
      "content": [
        {
          "type": "prose",
          "text": "将 `integration verify` 指定的 CLI 最低版本声明为可选 peer（{@link generic:versioning}）。"
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "prose",
          "text": "当该 peer 缺失或版本过旧时，`integration verify` 会报告 `replaces_needs_cli`。如果没有它，已发布的 0.6.3 及更早版本会丢弃该模板并隐藏你的文档主题。"
        }
      ]
    },
    {
      "section": "What apps receive",
      "title": "应用会收到什么",
      "content": [
        null,
        {
          "type": "prose",
          "text": "当多个集成替换同一个 Core 模板时，只有一个会胜出："
        },
        {
          "type": "list",
          "items": [
            "在 `astryx.config.mjs` 中显式列出的集成优先于仅安装并被自动选取的集成。",
            "当多个显式配置的集成替换同一目标时，后列出的集成胜出，Astryx 会报告此歧义。",
            "当没有显式配置任何集成时，应用 package.json 依赖中后列出的包胜出。请显式配置你想要的集成，而不要依赖这一顺序。"
          ]
        }
      ]
    },
    {
      "section": "Check the replacement",
      "title": "检查替换",
      "content": [
        null,
        {
          "type": "table",
          "headers": [
            "问题",
            "含义"
          ],
          "rows": [
            [
              "`missing_template_replacement_target`",
              "`replaces` 未指定 Core 模板 id。"
            ],
            [
              "`invalid_template_replacement`",
              "替换不可用，或其页面/区块种类与 Core 不同。"
            ],
            [
              "`ambiguous_template_replacement`",
              "一个包为同一目标声明了两个替换，或有多个活动包争用同一目标。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "替换解析默认是安全的。缺失的源码、无效的文档、缺失的目标、错误的种类或冲突的声明，绝不会将 Core id 交给不可靠的替换：Astryx 会报告该问题并保留 Core 模板。发布前请修复所有问题。"
        }
      ]
    }
  ]
};
