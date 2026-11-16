// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for troubleshooting.doc.mjs.
export const docsZh = {
  "title": "故障排查",
  "description": "查找 CLI 在构建、校验或安装集成时输出的消息，并应用相应的修复方法。",
  "sections": [
    {
      "section": "Fix setup errors",
      "title": "修复安装错误",
      "content": [
        {
          "type": "prose",
          "text": "这些错误会在你启动包或在包中运行 CLI 时出现。每一行都引用了 CLI 打印的内容。"
        },
        {
          "type": "table",
          "headers": [
            "消息",
            "修复方法"
          ],
          "rows": [
            [
              "`No package.json found. Run this command inside an integration package.`",
              "先在包文件夹中运行 `{@pm-only npm \"writes package.json\" init -y}` 和 `{@pm-only npm \"edits package.json\" pkg set name=@acme/astryx-widgets}`。"
            ],
            [
              "`Error: Could not find @astryxdesign/core package`",
              "组件命令会读取 Core。请在包中运行 `{@pm install @astryxdesign/core --dev}`。"
            ],
            [
              "`core_not_found`: `Could not resolve @astryxdesign/core, so component names could not be checked.`",
              "同样的修复方法。检查会以退出码 1 结束。"
            ],
            [
              "`Error: unknown subcommand 'integration verify'`, or `Error: Pass --check to verify the integration tarball.`",
              "你的 CLI 版本低于 `integration verify`。请运行 `{@pm install @astryxdesign/cli@latest --dev}`。在旧版 CLI 上，同样的检查是 `integration pack --check`。"
            ],
            [
              "注意：`integration pack --check` 已弃用。",
              "旧名称仍会执行同样的检查。请改用 `{@command integration verify}`；旧名称将在后续版本中移除。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Fix integration verify failures",
      "title": "修复 integration verify 检查失败",
      "content": [
        {
          "type": "prose",
          "text": "`{@command integration verify}` 会将每个失败项打印为一行 `[fail]`。添加 `--json` 可以查看其问题代码，例如 `component_export_missing`。"
        },
        {
          "type": "table",
          "headers": [
            "消息",
            "修复方法"
          ],
          "rows": [
            [
              "`component_export_missing`: `Component \"AcmeCarousel\" advertises import \"@acme/astryx-widgets/components/AcmeCarousel\", but that packed module does not export \"AcmeCarousel\".`",
              "package.json 中没有 `exports` 映射，或者模块没有导出该名称。保留 `export function AcmeCarousel`，并添加条目：`{@pm-only npm \"edits package.json\" pkg set 'exports[./components/AcmeCarousel]=./components/AcmeCarousel.tsx'}`。如果引用的名称是文件名（例如 `acme-carousel`），请将该文档的 `name` 设置为文件所导出的组件。仅类型导出不算数。"
            ],
            [
              "`template_export_missing`: `Template \"acme-dashboard\" public import \"@acme/astryx-widgets/templates/acme-dashboard\" does not have a default export.`",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'exports[./templates/acme-dashboard]=./templates/acme-dashboard.tsx'}`，并在源码中保留 `export default`。新建包时使用 `\"exports\": {}`，这样每次添加都会写入这些条目。"
            ],
            [
              "`component_import_unresolvable` or `template_import_unresolvable`: `…Package subpath './components/AcmeCarousel' is not defined by \"exports\"…`",
              "`exports` 映射中没有它的条目。请运行 `{@pm-only npm \"edits package.json\" pkg set 'exports[./components/AcmeCarousel]=./components/AcmeCarousel.tsx'}`，如果是模板则运行 `'exports[./templates/acme-dashboard]=./templates/acme-dashboard.tsx'`。"
            ],
            [
              "`component_import_unresolvable`: `…but a consumer cannot resolve it: Cannot find package '@acme/old-name'`",
              "你在 add 写入每个文档的 `import` 之后重命名了包。请将每个组件文档中的 `import` 改为新名称。"
            ],
            [
              "`Declared templates root \"templates\" has 0 of 2 expected files in the pack list. Add \"templates\" to \"files\" in package.json.`",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'files[]=templates'}`。"
            ],
            [
              "`docs_tree_needs_cli`: `The package ships a namespace doc or a placed guide but declares no @astryxdesign/cli peer.`",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.6.4'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}`。"
            ],
            [
              "`replaces_needs_cli`: 包中有一个模板设置了 `replaces`，但未声明 @astryxdesign/cli 对等依赖。",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.6.4'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}`。0.6.4 之前的稳定版 CLI 会拒绝 `replaces`、丢弃该模板，并隐藏你的文档主题。"
            ],
            [
              "`component_replaces_needs_cli`（警告）：包中有一个组件设置了 `replaces`，但未声明 @astryxdesign/cli 对等依赖，或者声明的对等依赖范围允许更早的 CLI。",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.6.7'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}` 以启用替换。在此之前，应用看不到任何变化（{@link generic:replace-a-core-component}）。"
            ],
            [
              "`keywords_needs_cli`: 包中有一个模板设置了 `keywords`，但未声明 @astryxdesign/cli 对等依赖。",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.6.6'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}`。旧版 CLI 如何处理该字段，见 {@link generic:template-doc-overview}。"
            ],
            [
              "`themes_need_cli`: 包中附带一个主题，但未声明 @astryxdesign/cli 对等依赖。",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.6.4'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}`。低于已发布 0.6.4 的 CLI 无法读取带类型的主题描述符，因此会丢弃你的主题，并可能隐藏你的文档主题。"
            ],
            [
              "`section_ids_need_cli`: 包中有一个文档 section 设置了 `id`，但未声明 @astryxdesign/cli 对等依赖。",
              "与 `themes_need_cli` 相同的修复方法，或者去掉 section 的 `id`：低于已发布 0.6.4 的 CLI 会拒绝它们，并隐藏你的文档主题。"
            ],
            [
              "`doc_tokens_need_cli`: 包的文档中写有文档令牌（`{@@command …}`、`{@@pm …}`、`{@@pm-only …}`），但其 @astryxdesign/cli 对等依赖允许 0.7.4 之前的 CLI。",
              "运行 `{@pm-only npm \"edits package.json\" pkg set 'peerDependencies.@astryxdesign/cli=>=0.7.4'}` 和 `{@pm-only npm \"edits package.json\" pkg set 'peerDependenciesMeta.@astryxdesign/cli.optional=true' --json}`。0.7.4 之前的 CLI 会按原样打印每个令牌，因此读者会看到原始令牌。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Fix problems in an app",
      "title": "修复应用中的问题",
      "content": [
        {
          "type": "prose",
          "text": "这些内容出现在安装了你的包的应用中，或者出现在预测这些问题的 doctor 检查中。"
        },
        {
          "type": "table",
          "headers": [
            "症状",
            "修复方法"
          ],
          "rows": [
            [
              "对于你的包所记录的组件，出现 `Error: No component named \"AcmeCarousel\"`。",
              "它的文档仍然引用其文件名。将 `name` 设置为导出名，例如在 `acme-carousel.doc.mjs` 中设置 `name: 'AcmeCarousel'`。只有当家族文档所导入的模块导出了该成员时，该家族成员才会被列出（{@link generic:component-family}）。"
            ],
            [
              "`{@command component Dialog}` 打开的是 Core 的 `Dialog`，而不是你的组件。",
              "Core、旧版文档包或另一个包的文件已经占用的名称仍归它们所有。请运行 `{@command component Dialog --package @acme/astryx-widgets}`，或者给你的组件起一个独有的名称。"
            ],
            [
              "`Error: Template \"dashboard\" is ambiguous — narrow it with --type and/or --package.`",
              "你的模板 id 与某个 Core id 相同。请重命名，例如 `acme-dashboard`，或者设置 `replaces: 'dashboard'` 来取代它。`{@command doctor integration templates}` 会在你发布之前发出警告。"
            ],
            [
              "`invalid_doc_graph`: `placement.parent \"namespace:nope\" names no namespace; @acme/astryx-widgets declares \"acme\".`",
              "该指南会保持隐藏，直到它的 `placement` 指定了你的包所声明的命名空间和槽位。对于 `\"…\" names no doc`，请修复链接目标。"
            ],
            [
              "错误：未知主题 \"acme\"。@acme/astryx-widgets 的文档未能加载；请在该包中运行 `{@command doctor integration docs}` 查看原因。",
              "一个无效文档会隐藏你的所有文档。请在包中运行 `{@command doctor integration docs}`，并修复它指出的 `invalid_doc`。"
            ],
            [
              "`cli-command` 警告：`Loaded integrations declare different CLI commands`",
              "应用加载的两个包设置了不同的 `cliCommand` 值，因此 CLI 会打印包管理器的命令。请统一为一个命令，或移除不属于此处的包。参见 {@link generic:cli-command}。"
            ],
            [
              "`invalid_cli_command`",
              "你的 `cliCommand` 不是一行不超过 120 个字符的纯文本，因此被忽略。请修正该值；清单的其余部分仍会加载。"
            ],
            [
              "`{@command upgrade}` 不会运行你的任何 codemod",
              "应用必须在 `astryx.config` 的 `integrations` 中列出你的包，或者传入 `--integration @acme/astryx-widgets`。只有当 codemod 文件夹的版本晚于 `--from` 且不高于已安装的 `@astryxdesign/core` 时，它才会运行该文件夹。"
            ],
            [
              "你的文档 section、模板或主题只在部分应用中缺失",
              "这些应用运行的 CLI 版本太旧，无法读取它们（{@link generic:checks} 列出了每个字段需要哪个 CLI 版本）。请在那里更新 `@astryxdesign/cli`，并保留可选的 `@astryxdesign/cli` 对等依赖，这样当应用安装你的包时，npm 会对照它检查应用的 CLI。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "每项检查能捕获什么，见 {@link generic:checks}。"
        }
      ]
    }
  ]
};
