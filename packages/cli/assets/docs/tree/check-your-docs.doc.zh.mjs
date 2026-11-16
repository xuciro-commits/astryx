// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for check-your-docs.doc.mjs.
export const docsZh = {
  "title": "检查你的文档",
  "description": "检查文档树、链接、重叠、文档字段、读取大小和 CLI 对等依赖。",
  "sections": [
    {
      "section": "Run the docs check",
      "title": "运行文档检查",
      "content": [
        {
          "type": "prose",
          "text": "在包中运行 `doctor integration docs`，以检查文档树、每个链接以及与 Core 主题的重叠，并列出任意两个主题重复的段落。传入包名可检查已安装的包。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "将每个事实写在一个主题中。当你的两个主题之间，或你的某个主题与某个 Core 主题之间，逐字重复 10 个或以上正文单词时，检查会将该对列为 `copied_passage` 警告。它会指出保留该文本的主题（某个 Core 主题，或你的两个主题中更适合该段落的那个），以及另一个主题中应改为放置链接的行（{@link generic:links}）。代码和示例不参与比较，主题也可以承载它所替换的 Core 主题的文本。若某次重复的不同内容词（除 \"the\"、\"in\"、\"it\" 等虚词之外的词）少于 4 个，或该文本由三个或更多主题共享（系列引导语），则不会列出。每个列出的对也是警告（`copied_passage`）：`doctor integration docs` 仍以 0 退出，而 `integration check --strict` 会在你修复之前失败。"
        },
        {
          "type": "prose",
          "text": "保持文档精炼。检查会将正文中的每个填充短语列为 `doc_fluff` 警告，并给出其文件行号和应改写的内容；对于 80 个或以上正文单词且其中携带内容的词（除 the、and、in 等虚词之外的词）少于一半的主题，则给出实测占比和 0.5 的下限。`doctor integration docs` 仍以 0 退出，而 `integration check --strict` 会在你删减之前失败。代码、示例和引用文本不读取。这些短语包括：`it's important to note`、`it is important to note`、`important to note that`、`it's worth noting`、`it is worth noting`、`worth noting that`、`it should be noted`、`please note`、`note that`（作为句子开头）、`as mentioned above`、`as mentioned earlier`、`as mentioned before`、`as noted above`、`as you can see`、`needless to say`、`in order to`、`due to the fact that`、`for the purpose of`、`at this point in time`、`in other words`、`basically`、`essentially`、`obviously`。"
        },
        {
          "type": "prose",
          "text": "使用链接指向另一个文档，绝不要在正文中写 `{@command docs <name>}`：`{@link generic:<name>}` 用于你包中的某个主题，`{@link @astryxdesign/cli:generic:<name>}` 用于 Core 文档（Core 命名空间使用 `namespace:`）。CLI 会将链接打印为打开该文档的命令，doctor 会检查该文档是否存在。检查会将每个指向已存在文档的书面指针列为 `stray_doc_pointer` 警告，并给出应改写的链接。包含更多单词的命令，或代码块中的命令，属于演练过程，不会列出。"
        },
        {
          "type": "prose",
          "text": "其参数和退出码见 {@link command:doctor integration docs}。"
        }
      ]
    },
    {
      "section": "Know what fails the check",
      "title": "了解什么会导致检查失败",
      "content": [
        {
          "type": "prose",
          "text": "无法加载的文档、意外的 Core 重叠、未指向任何文档的 `reference` 区块，或命名空间/放置失败，都会使检查以退出码 1 失败。指向不存在文档的链接只会警告，退出码仍为 0。"
        },
        {
          "type": "table",
          "headers": [
            "问题",
            "报告为",
            "退出码"
          ],
          "rows": [
            [
              "无法加载的文档，例如未知的章节字段或区块类型",
              "`[fail]` `invalid_doc`",
              "1"
            ],
            [
              "与某个 Core 主题同名且没有 `replaces` 或 `extends` 的主题",
              "`[fail]` `accidental`",
              "1"
            ],
            [
              "放置失败导致文档被隐藏",
              "`[fail]` `invalid_doc_graph`",
              "1"
            ],
            [
              "目标未指向任何文档的 `reference` 区块",
              "`[fail]` `invalid_doc_reference`",
              "1"
            ],
            [
              "指向不存在文档的链接",
              "`[warn]` `invalid_doc_graph`",
              "0"
            ],
            [
              "设置了 `replaces` 或 `extends` 的主题",
              "`[info]` `replaces` 或 `extends`",
              "0"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "发布前请阅读警告。使用 `--json` 时，它们位于 `data.issues` 中，`severity: \"warning\"`。"
        }
      ]
    },
    {
      "section": "Check each doc against its type",
      "title": "按类型检查每个文档",
      "content": [
        {
          "type": "prose",
          "text": "`doctor integration validate` 会像 `tsc` 那样，按照 `@astryxdesign/cli/authoring` 为其种类发布的类型，读取你的包所附带的每个文档：`hidden` 文档和同一名称的第二个文档也不例外。组件根目录或文档根目录下 `__tests__` 中的测试夹具会被这些读取器跳过，但仍会计数，不会检查。它会报告类型中不存在的字段（`unknown_field`）、缺失的必填字段（`missing_field`），以及超出字段类型的值（`wrong_type`）。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "文件夹决定类型：组件根目录中为 `ComponentDoc`，模板根目录中为 `IntegrationTemplateDoc`，主题根目录中为 `ThemeDoc`，文档根目录中则使用文档 `type` 指定的类型。请同时保留每个文档导出上方的 `@type` 注释，以便编辑器在你输入时显示同样的问题。",
            "每项发现都是警告，因此退出码保持为 0。使用 `--json` 时，它们位于 `data.docTypes.findings`。",
            "它使用你的包所安装的 `typescript`。如果 `typescript` 缺失或没有 JavaScript 编译器 API（如 TypeScript 7 那样），而你的包安装了 `@typescript/typescript6`（TypeScript 6 API 包），则使用后者。两者都没有时，它会打印 `[skip] Docs not type-checked` 及原因。",
            "所有文档类型的所有字段见 {@link generic:field-reference}。"
          ]
        }
      ]
    },
    {
      "section": "Check read size",
      "title": "检查读取大小",
      "content": [
        {
          "type": "prose",
          "text": "`{@command doctor}` 还会测量每次读取，并对超过 32 KB 的读取发出警告。请在包中或安装它的应用中运行；`doctor integration docs` 不检查大小。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "将超过限制的章节拆分为更小的章节，每个章节使用自己的键。参见 {@link command:doctor}。"
        }
      ]
    },
    {
      "section": "Check the CLI peer",
      "title": "检查 CLI 对等依赖",
      "content": [
        {
          "type": "prose",
          "text": "`integration verify` 会使附带文档章节、已放置指南或带 `id` 的文档章节，但没有 `>=0.6.4` 的 `@astryxdesign/cli` 对等依赖的包失败。它不会运行文档检查，因此请两者都运行。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "`integration add doc --parent` 会为你写入对等依赖。",
            "`integration verify` 会放过隐藏的指南和意外的 Core 重叠；只有 `doctor integration docs` 能捕获它们。",
            "它检查的其他所有内容见 {@link command:integration verify} 和 {@link generic:checks}。"
          ]
        }
      ]
    }
  ]
};
