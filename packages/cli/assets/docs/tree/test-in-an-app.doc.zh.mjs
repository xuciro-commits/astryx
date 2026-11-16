// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for test-in-an-app.doc.mjs.
export const docsZh = {
  "title": "在应用中测试集成",
  "description": "将打包后的包安装到应用中，并运行其用户会运行的命令。",
  "sections": [
    {
      "section": "Install the packed package in an app",
      "title": "在应用中安装打包后的包",
      "content": [
        {
          "type": "prose",
          "text": "将包打包到其文件夹旁边，以便下次打包时不会将它一起发布，然后将其与 Core 和 CLI 一起安装到应用中。应用会因它是依赖项而加载你的包。"
        },
        null,
        {
          "type": "list",
          "items": [
            "也在应用中安装 CLI：`astryx` 会从应用的 `node_modules` 运行 CLI。",
            "应用持有的是副本，而不是链接。每次更改后，请重新打包并运行相同的 `{@pm install}`。",
            "在包内读取你的工作内容时看到的是源码。应用显示的则是 npm 将会发布的内容。"
          ]
        }
      ]
    },
    {
      "section": "Check what the app sees",
      "title": "检查应用所看到的内容",
      "content": [
        {
          "type": "prose",
          "text": "在应用文件夹中运行用户会运行的命令。每个命令都应在其包名称下显示你的贡献。"
        },
        null,
        {
          "type": "table",
          "headers": [
            "命令",
            "应查找的内容"
          ],
          "rows": [
            [
              "`component AcmeCarousel`",
              "`import {AcmeCarousel} from '@acme/astryx-widgets/components/AcmeCarousel';`"
            ],
            [
              "`template --list --package`",
              "一个 `acme-dashboard` 条目，其 `package` 为 `@acme/astryx-widgets`"
            ],
            [
              "`theme list --package`",
              "一个 `ocean` 条目，其 `package` 为 `@acme/astryx-widgets`"
            ],
            [
              "`docs acme`",
              "你的章节，包含 `deploying` 等指南"
            ],
            [
              "`search deploying --type doc`",
              "`acme/deploying` 作为第一个结果"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "`--package` 会将 `template --list` 和 `theme list` 缩小到一个包。`component --list` 会忽略它并且也会列出 Core，因此请按名称查找组件。最后，在应用的代码中导入 `AcmeCarousel` 并构建应用，就像你的用户会做的那样。"
        }
      ]
    },
    {
      "section": "Run doctor in the app",
      "title": "在应用中运行 doctor",
      "content": [
        {
          "type": "prose",
          "text": "`{@command doctor}` 会检查整个应用，包括它加载的每个包。`doctor integration validate` 会按应用的安装方式检查你的包。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "`implicit-integrations` 行会列出应用无需配置即加载的每个包。`[info]` 是预期结果。",
            "当你的某个文档章节超过 32 KB 时，`docs-progressive-disclosure` 行会给出警告。`doctor integration` 检查不会测量大小。",
            "当安装的副本完好时，`doctor integration validate @acme/astryx-widgets` 会打印 `[ok] No integration issues found.`。"
          ]
        }
      ]
    }
  ]
};
