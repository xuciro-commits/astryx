// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for host-entry.doc.mjs.
export const docsZh = {
  "title": "宿主入口",
  "description": "从你自己的命令行工具运行 Astryx CLI：`runHostedCli` 接受的输入、返回的内容，以及进程何时改为结束。",
  "sections": [
    {
      "section": "Start a run",
      "title": "启动一次运行",
      "content": [
        {
          "type": "prose",
          "text": "为自己的用户内置 CLI 的工具，会在每个进程中通过 `@astryxdesign/cli/host` 的 `runHostedCli` 启动一次运行。该运行的行为与 CLI 自身命令在相同文件夹中使用相同参数时一致，其打印的命令会以你的工具的命令开头。"
        },
        null
      ]
    },
    {
      "section": "Options",
      "title": "选项",
      "content": [
        {
          "type": "table",
          "headers": [
            "选项",
            "默认值",
            "含义"
          ],
          "rows": [
            [
              "`argv`",
              "无",
              "命令行参数，不包含命令名称。"
            ],
            [
              "`cwd`",
              "进程的工作文件夹",
              "运行所用的文件夹。该文件夹必须存在。"
            ],
            [
              "`cliCommand`",
              "包管理器的名称",
              "用户输入的命令，例如 `acme astryx`：一行非空文本，最多 120 个字符，且首尾不能有空格。"
            ],
            [
              "`declinedProjectCli`",
              "无",
              "你没有运行项目自带 CLI 的原因，例如 `untrusted`：一行非空文本，最多 120 个字符。此后该 CLI 永远不会运行。"
            ],
            [
              "`roots`",
              "无",
              "你的包集合，按优先级排列：每个文件夹的 `node_modules` 各包含一个 CLI、同一发布版本的 Core 以及集成。运行绝不会安装发布版本；它会从第一个包含该发布版本的集合中取用项目所需的版本。"
            ],
            [
              "`integrations`",
              "无",
              "你批准在项目外使用的集成，以包名称指定。"
            ],
            [
              "`discoverSources`",
              "无",
              "你自己的发现源。`{@command discover}` 会将每个源报告为宿主提供的源。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Result and errors",
      "title": "结果与错误",
      "content": [
        {
          "type": "list",
          "items": [
            "它会解析为 `{status, packages}` 结果：即 CLI 自身命令将会返回的退出状态，以及该次运行使用的每个包及其版本，以及该包来自项目还是包集合。",
            "当另一个发布版本通过自己的宿主入口从你的某个包集合中响应时，该入口会在同一进程中使用相同输入运行，调用会以其结果完成。",
            "对于未知选项或无效值，它会在任何内容运行之前以 `TypeError` 拒绝；如果该进程中已经启动了一次运行，则会以 `Error` 拒绝。请在新的进程中启动每次运行。"
          ]
        }
      ]
    },
    {
      "section": "When the process ends instead",
      "title": "进程提前结束的情形",
      "content": [
        {
          "type": "prose",
          "text": "与 CLI 自身的命令一样，在以下情况下，运行会以退出状态结束进程，且调用永远不会返回结果："
        },
        {
          "type": "list",
          "items": [
            "打印帮助或版本（`--help`、`-h`、`help`、`--version`、`-V`、`--version --json`）；",
            "拒绝命令行，例如未知命令或选项；",
            "报告导致其停止的错误，包括 `--json` 模式下的每个错误；",
            "遇到意外错误；",
            "将运行交给另一个 CLI 自身的命令：当你未传入 `declinedProjectCli` 时交给项目的 CLI，或交给其 CLI 没有宿主入口的包集合。"
          ]
        }
      ]
    }
  ]
};
