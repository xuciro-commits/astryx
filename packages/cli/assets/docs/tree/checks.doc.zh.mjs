// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for checks.doc.mjs.
export const docsZh = {
  "title": "检查集成",
  "description": "为每个问题选择相应的检查，了解哪些情况会失败、哪些只会警告，并在 CI 中运行所有检查。",
  "sections": [
    {
      "section": "Pick a check",
      "title": "选择检查项",
      "content": [
        {
          "type": "prose",
          "text": "在包文件夹中运行这些命令。四个 `doctor integration` 检查读取你的源代码，`integration check` 会运行全部四个；`integration verify` 检查 npm 将要发布的包。"
        },
        {
          "type": "table",
          "headers": [
            "命令",
            "证明内容",
            "以下情况以退出码 1 结束",
            "以下情况仅警告"
          ],
          "rows": [
            [
              "`{@command doctor integration validate}`",
              "清单能够加载，每个根目录都包含 CLI 可读取的贡献，且每个文档都与其编写类型匹配。备注会列出格式错误的 `cliCommand`（`invalid_cli_command`）；对于每个主题，还会列出使用包运行器编写的命令（`runner_command`）、裸命令（`plain_command`）、针对某个包管理器编写的命令（`package_manager_command`），以及无法解析的令牌（`doc_token`；见 {@link generic:doc-syntax}）。另有两条备注在任何标志下都不会导致失败，它们说明目录列出该包所需的条件：没有 logo（`package_without_logo`）和没有示例块（`package_without_example`；见下文小节）。默认情况下备注不会导致失败；`integration check --strict --next` 会对标记为 `next` 的项失败，下一个次要版本会将它们计入。",
              "声明的根目录缺失（`missing_root`），某个贡献无法加载（`invalid_doc`、`invalid_component`、`invalid_theme`），或包中的两个模板替换同一个 Core id（`ambiguous_template_replacement`）。",
              "清单中包含此 CLI 不认识的键（`unknown_manifest_key`），或文档字段与文档的编写类型不匹配：该类型没有的字段、缺少必填字段，或值超出字段类型。它还会对没有读取器能提供的内容发出警告：重复列出的属性（`duplicate_prop`）、指向未记录属性的 `propDescriptions` 键（`unknown_translated_prop`）、没有内容的节（`empty_section`）、主题中两个节使用同一个键（`duplicate_section_key`），或旁边没有主题文件的 `.doc.zh.mjs` 或 `.doc.dense.mjs` 覆盖层（`orphan_doc_overlay`）。自 0.7.3 起，它还会从源代码中列出（但不会导致失败）包要求应用导入却无法导入的内容：组件的导入（文档中的 `import`，或 CLI 推导出的导入）或模板的公开导入，其子路径未在 package.json 的 `exports` 中声明（`component_import_not_exported`、`template_import_not_exported`），或指向了另一个包（`component_import_other_package`）；示例导入了未声明的子路径（`example_import_not_exported`）；模板导入了模板根目录之外的路径（`template_import_outside_root`），或其包或 Core 未导出的路径（`template_private_import`）。同样会列出的还有：组件的导入所在模块未导出该组件（`component_import_missing_name`）、示例或模板导入了其包未导出的名称（`example_import_missing_name`、`template_import_missing_name`），以及没有默认导出的模板源代码（`template_no_default_export`）。同样会列出的还有每个不是 `kind: 'setup'` 但无法像实时预览那样独立运行的组件示例：无法编译的代码（`example_does_not_compile`）、不渲染任何内容（`example_renders_nothing`）、使用从未定义或导入的名称（`example_undefined_name`）、导入或渲染仅在服务器上运行的代码或读取 `process.env`（`example_server_only`），或导入相对路径或包未声明的包（`example_import_unresolvable`）。每项都是一条备注，随修复建议一起打印；从下一个次要版本起，这些备注会使 `--strict` 失败。它无法判断的导入（例如尚未构建的 `exports` 目标或尚未构建的 `dist/` 深层路径）会在 `publicImports` 下列为未检查；无法判断的示例（例如在未安装 Core 或 React 时无法判断其名称的示例）会列在 `exampleCode` 下。它使用你安装的 `typescript` 检查文档；如果缺少该依赖或它没有 JavaScript 编译器 API（TypeScript 7），则使用已安装的 `@typescript/typescript6`；两者都没有时，它会打印 `[skip] Docs not type-checked`。没有 `astryx.integration.mjs` 时，它会打印一条提示并以 0 退出。"
            ],
            [
              "`{@command doctor integration components}`",
              "没有组件名称与 Core 组件冲突，每个 `replaces` 都指向一个 Core 组件，且每个组件文档的属性与组件的 TypeScript 属性一致。",
              "未安装 Core（`core_not_found`）。在声明了启用替换的 CLI 版本范围的包中，`replaces` 目标缺失（`missing_component_replacement_target`）或无效（`invalid_component_replacement`），或两个组件替换同一个 Core 组件（`ambiguous_component_replacement`）。",
              "名称与 Core 冲突；组件在没有该版本范围的包中设置了 `replaces`（`inactive_component_replacement`，以及以警告形式报告的任何缺失、无效或重复的 `replaces`）；或文档中的属性与代码不一致：代码中缺少该属性（`not_in_code`）、文档遗漏了包声明的属性（`not_in_doc`），或其 `required`（`required_mismatch`）、类型（`type_mismatch`）或字面量 `default`（`default_mismatch`）不一致；或组件文档中的 `{@link}` 未指向任何文档（`invalid_doc_graph`）。它使用你安装的 `typescript` 读取属性；如果没有，则打印 `[skip] Props not compared`。"
            ],
            [
              "`{@command doctor integration templates}`",
              "每个 `replaces` 都指向一个同类型的 Core 模板。",
              "`replaces` 目标缺失（`missing_template_replacement_target`）或类型不符（`invalid_template_replacement`），或两个模板替换同一个 id（`ambiguous_template_replacement`）。",
              "模板 id 与某个 Core id 匹配，但未设置 `replaces`。"
            ],
            [
              "`{@command doctor integration docs}`",
              "你的文档树、每个链接、对照 Core 的主题名称、两个主题逐字重复的段落、填充短语和低密度主题，以及指向文档的书面指引。",
              "主题占用了 Core 主题名却未设置 `replaces` 或 `extends`、文档无效（`invalid_doc`），或命名空间或放置位置校验失败，导致文档被隐藏（`invalid_doc_graph`）。",
              "链接未指向任何文档（`invalid_doc_graph`）、两个主题逐字重复一段内容（`copied_passage`）、正文用列出的短语填充或密度低于下限（`doc_fluff`），或正文、描述、摘要或组件文档文本中写了 `{@command docs <name>}`，而此处本应使用会被检查的链接（`stray_doc_pointer`）。"
            ],
            [
              "`{@command integration check}`",
              "用一条命令，为你的构建证明四个 `doctor integration` 检查所证明的一切。",
              "四个检查中任何一个单独运行时都会以 1 退出。使用 `--strict` 时，任何警告以及任何未运行的检查也会导致退出，例如没有 `astryx.integration.*` 的包。",
              "四个检查警告的任何内容，除非传入 `--strict`。"
            ],
            [
              "`{@command integration verify}`",
              "打包后的包包含每个文件，显示相同的贡献，解析所有公开导入，并声明所需的 CLI。",
              "`validate` 会失败的任何内容、没有清单、文件未包含在 `.tgz` 文件中、导入无法解析，或缺少 CLI peer。",
              "`validate` 警告的任何内容，或组件设置了 `replaces` 而包未声明启用它的 CLI 版本范围（`component_replaces_needs_cli`）。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "也可以传入包名，例如 `{@command doctor integration validate @acme/astryx-widgets}`，从应用中检查已安装的副本。要修复属性相关的问题，请参见 {@link generic:check-the-props}。"
        }
      ]
    },
    {
      "section": "Run every check in every build (required)",
      "title": "在每次构建中运行所有检查（必需）",
      "content": [
        {
          "type": "prose",
          "text": "每个集成都会在自己的构建中运行 `integration check --strict`，因此每次构建都能让文档、类型和链接保持同步；这是必需项，而非可选项。严格检查会对文档检查列出的每个复制段落失败（{@link generic:check-your-docs}）。发布前请运行 `integration verify`。请先安装 devDependencies，因为组件检查需要 Core，而 `tsc --noEmit` 需要 `typescript` 和 `tsconfig.json`。在 package.json 中："
        },
        null,
        {
          "type": "list",
          "items": [
            "`integration check` 按顺序运行 `validate`、`components`、`templates` 和 `docs`，打印每个结果，然后打印摘要，并在其中任何一个会失败时以 1 退出。",
            "`--strict` 还会在任何警告以及任何未运行的检查上以 1 退出。不传该标志时，警告保持退出码 0：在修复包中已有的警告时可以使用它。",
            "其退出码和 JSON 是你的构建契约：新增检查或新的失败代码只会在次要版本中加入，并在发行说明中说明。补丁版本仍可能发布与你的名称冲突的 Core 组件、模板或 CLI 主题。",
            "`integration verify` 会运行 `validate`，但不运行其他三个检查：Core 名称冲突、未指向任何 Core 模板的 `replaces`、占用 Core 名称的主题或隐藏的指南仍能通过它。发布前请同时运行两者：`astryx integration check --strict && astryx integration verify`。",
            "在包中直接运行 `{@command doctor}` 还会对超过 32 KB 的文档节发出警告，上述检查都不会测量这一点。"
          ]
        }
      ]
    },
    {
      "section": "Get your package ready to list",
      "title": "让包做好上架准备",
      "content": [
        {
          "type": "prose",
          "text": "列出你的包的目录会在名称旁显示其 logo，并预览它的一个示例。`{@command integration check}` 中有两条备注会在缺少其中任一项时说明：`package_without_logo` 和 `package_without_example`。它们仅供参考：无论是否使用 `--strict` 或 `--next`，都不会使任何检查失败。"
        },
        {
          "type": "list",
          "items": [
            "在包中添加一个方形 logo，例如 `marketplace/logo.svg`：只能使用形状绘制的 SVG（不含脚本、样式、链接、内嵌图片或外部 URL），也可以是 PNG、JPEG 或 WebP，最大 512 KB。保持简洁，确保在 32 像素下仍可辨认。",
            "将 logo 放在集成文件中、`docsiteUrl` 旁边；如果浅色版本在深色背景上会消失，还要添加深色版本：`logo: {light: './marketplace/logo.svg', dark: './marketplace/logo-dark.svg'}`。路径相对于包根目录。如果集成文件未设置，也会读取 package.json 中 `marketplace.logo` 设置的 logo，但集成文件才是设置它的地方。",
            "确保 npm 会打包它：如果 package.json 中有 `files`，请添加 `\"marketplace\"`。`{@command integration verify}` 和 `{@pm-only npm \"it lists exactly what the registry receives\" pack --dry-run}` 会显示最终发布的内容。",
            "如果包提供组件，请至少添加一个示例：一个渲染组件的块模板，在其 `.doc.mjs` 中用 `exampleFor` 指定该组件，并设置 `isShowcase: true`。每条 `component_without_example` 备注都会给出要添加的两个文件。仅包含主题、文档或 codemod 的包不需要示例：目录会直接从主题本身预览主题。",
            "运行 `{@command integration check}`，直到不再剩下这两类备注。"
          ]
        }
      ]
    },
    {
      "section": "Verify the packed package",
      "title": "验证打包后的包",
      "content": [
        {
          "type": "prose",
          "text": "`integration verify` 使用 npm 打包你的包，将其解包到一个临时应用，并检查该应用能看到你源代码中的所有内容。它不会发布任何内容，也不会留下 `.tgz` 文件或临时文件夹。"
        },
        {
          "type": "list",
          "items": [
            "它按照 `{@pm-only npm \"npm is the client the registry publishes from\" publish}` 的方式运行 `{@pm-only npm \"the tarball the registry receives\" pack}`，包括你的 `prepack` 脚本。",
            "它检查每个贡献文件都在 `.tgz` 文件中。如果某个根目录不在 `files` 中，会以 `Add \"templates\" to \"files\" in package.json.` 失败。",
            "它列出临时应用看到的组件、模板、主题、文档和 codemod，并与你的源代码进行比较。",
            "它按照 Node 的方式解析每个组件的 `import` 和每个模板的公开导入，并检查模块是否以文档中记录的名称导出组件，或为模板提供默认导出。仅类型导出不计入。",
            "对于每个主题，它重新构建源代码，将构建后的模块和生产 CSS 与编写时生成的产物进行比较，并证明模块、CSS 和可选的字体 CSS 导出都能从打包后的包中解析。",
            "如果包需要 `@astryxdesign/cli` peer 却未声明，它会使该包失败：设置 `keywords` 的模板需要 `>=0.6.6`，设置 `replaces`、文档节、放置的指南、带 `id` 的文档节或主题的模板需要 `>=0.6.4`。"
          ]
        },
        {
          "type": "prose",
          "text": "`integration pack --check`（该检查在 0.6.5 发布前的名称）仍会运行它并打印一条备注；它将在后续版本中移除。选项和退出码见 {@link command:integration verify}。"
        }
      ]
    }
  ]
};
