// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for versioning.doc.mjs.
export const docsZh = {
  "title": "版本管理",
  "description": "为你的包设定版本号、声明其 peer 依赖，并让使用旧版 CLI 的应用继续正常工作。",
  "sections": [
    {
      "section": "Pick a version",
      "title": "选择版本号",
      "content": [
        {
          "type": "prose",
          "text": "使用 semver 为你的包设定版本号：破坏性变更升主版本号，新功能升次版本号，修复升补丁版本号。"
        },
        null,
        {
          "type": "list",
          "items": [
            "在 1.0.0 之前，npm 会把每个次版本号都视为破坏性变更：如果应用要求 `^0.6.0`，就永远不会得到 `0.7.0`。破坏性变更请升次版本号，其他情况升补丁版本号。",
            "每次破坏性变更都随附一个代码改写脚本，以便应用迁移；详见 {@link generic:codemods}。"
          ]
        }
      ]
    },
    {
      "section": "Know what breaks apps",
      "title": "了解哪些改动会破坏应用",
      "content": [
        {
          "type": "prose",
          "text": "破坏性变更是指升级后，原本在应用中可用的代码、命令或链接不再可用。对于集成而言，下列名称都是其 API 的一部分。"
        },
        {
          "type": "table",
          "headers": [
            "你更改或移除的内容",
            "应用中随之失效的内容"
          ],
          "rows": [
            [
              "组件名，例如 `AcmeCarousel`",
              "导入语句，以及 `{@command component AcmeCarousel}`"
            ],
            [
              "模板 id，例如 `acme-dashboard`",
              "`{@command template acme-dashboard}`"
            ],
            [
              "主题 slug，例如 `ocean`",
              "`{@command theme add ocean}`"
            ],
            [
              "主题名或路由，例如 `acme/deploying`",
              "对旧名称的读取，以及其他文档中指向它的链接"
            ],
            [
              "组件的 `import` 路径",
              "按旧路径编写的导入语句"
            ],
            [
              "`exports` 条目",
              "对该路径的导入，会以 `ERR_PACKAGE_PATH_NOT_EXPORTED` 失败"
            ],
            [
              "一个属性",
              "传入该属性的代码"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "在发布说明中列出每一项破坏性变更，并附上负责迁移的代码改写脚本。任何变更日志工具都可以。如果 `package.json` 有 `files` 允许列表，请把 `CHANGELOG.md` 加进去，以便 npm 打包它。"
        }
      ]
    },
    {
      "section": "Declare peer ranges",
      "title": "声明 peer 版本范围",
      "content": [
        {
          "type": "prose",
          "text": "将你的代码所导入的 Astryx 包声明为 `peerDependencies` 中的 peer 依赖，这样应用只会安装每个包的一份副本。版本范围应尽可能放宽，但以你的测试能够证明的范围为限。"
        },
        {
          "type": "table",
          "headers": [
            "Peer",
            "何时声明",
            "版本范围"
          ],
          "rows": [
            [
              "`@astryxdesign/core`",
              "你的代码导入了 Core，例如主题通过 `@astryxdesign/core/theme` 导入",
              "你测试过的 Core 版本，例如 `^0.6.0`"
            ],
            [
              "`@astryxdesign/theme-*`",
              "你的代码导入了该主题包",
              "你测试过的版本"
            ],
            [
              "`@astryxdesign/cli`",
              "你发布文档分区、放置式指南、设置了 `replaces` 或 `keywords` 的模板、设置了 `replaces` 的组件、带 `id` 的文档分区或主题",
              "发布设置了 `keywords` 的模板时为 `>=0.6.6`，组件设置了 `replaces` 时为 `>=0.6.7`，其他情况为 `>=0.6.4`。可在 `peerDependenciesMeta` 中设为可选"
            ]
          ]
        },
        null,
        {
          "type": "prose",
          "text": "如果某个包需要 CLI peer 却没有声明，或者其版本范围允许某个稳定版 CLI 过旧、不足以支持它所发布的内容，`integration verify` 会使其失败。`integration add doc --parent` 和 `integration add theme` 会为你写入该 peer。"
        },
        {
          "type": "prose",
          "text": "当 CLI 不在该范围内时，`doctor integration validate` 和 `integration check` 会列出一条指明你的包的 `cli_peer_version` 提示。提示不会导致任何失败（即使使用 `--strict`），`integration verify` 也不会报告它。当 CLI 低于该范围时，提示会给出相关命令：在你的包目录中将较新的 Core 和 CLI 作为开发依赖一起安装，然后运行 `upgrade --apply`。当 CLI 高于该范围时，在应用中，提示会要求发布一个支持该 CLI 的包版本；在你自己的包目录中，则会要求你用该 CLI 测试你的包并放宽版本范围。"
        }
      ]
    },
    {
      "section": "Support older CLIs",
      "title": "支持较旧的 CLI",
      "content": [
        {
          "type": "prose",
          "text": "应用运行的 CLI 可能比你构建时使用的版本旧。CLI 会读取它认识的内容并跳过其余部分，但某些较新的文件会让旧版 CLI 隐藏你的文档。"
        },
        {
          "type": "list",
          "items": [
            "`astryx.integration.mjs` 中的未知字段会被忽略，并产生 `unknown_manifest_key` 警告，清单的其余部分仍会正常加载。",
            "CLI 不认识的具名导出会被静默忽略，因此可以安全地添加 `debug` 和 `gapReport`。",
            "已发布的 0.6.3 及更早版本会把每个 `{@link ...}` 按原样显示出来。",
            "已发布的 0.6.3 及更早版本会拒绝设置了 `replaces` 或 `keywords` 的模板，丢弃该模板，并隐藏你的包发布的所有文档主题。已发布的 0.6.4 和 0.6.5 仍会丢弃设置了 `keywords` 的模板。",
            "已发布的 0.6.3 及更早版本无法读取文档分区、分区 `id`，或 `integration add theme` 写入的主题文件夹。它们随后可能会隐藏你的包发布的所有文档主题。",
            "已发布的 0.6.2 和 0.6.3 仍会加载你的组件，但已发布的 0.6.0 和 0.6.1 无法读取 `integration add component` 写入的组件文档：在那里执行 `component AcmeCarousel` 会失败。",
            "使用旧版 CLI 的应用在组件的文档提到该文件的其他导出时，会以文件名列出该组件，并且不列出任何家族成员，因此在那里执行 `component AcmeCarousel` 会失败。"
          ]
        },
        {
          "type": "prose",
          "text": "`integration verify` 会为文档分区、放置式指南、模板的 `replaces` 或 `keywords`、带 `id` 的文档分区以及主题要求 CLI peer。对其中某项而言过旧的 CLI 无法读取它，而当它隐藏你的主题时，`docs` 不会给出警告。"
        }
      ]
    },
    {
      "section": "Name codemod folders after Core versions",
      "title": "按照 Core 版本命名代码改写脚本文件夹",
      "content": [
        {
          "type": "prose",
          "text": "每个代码改写脚本文件夹都应以应运行它的 Core 升级版本命名，而不是以你的包版本命名。应用会运行哪些文件夹以及何时运行，见 {@link generic:codemods} 中的「选择代码改写脚本的运行时机」。"
        }
      ]
    }
  ]
};
