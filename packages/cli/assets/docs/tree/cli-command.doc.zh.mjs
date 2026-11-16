// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for cli-command.doc.mjs.
export const docsZh = {
  "title": "CLI 命令",
  "description": "指定用户运行 CLI 时使用的命令，使 CLI 在其应用中打印的每条命令都以该命令开头。",
  "sections": [
    {
      "section": "When to set it",
      "title": "何时设置",
      "content": [
        {
          "type": "prose",
          "text": "CLI 在大多数回答末尾都会给出下一步要运行的命令：一段提示、一个错误修复、一个 Doctor 修复或一个文档示例。默认情况下，每条命令都以能到达应答版本的那条命令开头：如果应答的是应用自己的 CLI，就用应用包管理器运行的命令，例如 `pnpm exec astryx` 或 `yarn astryx`；否则就用固定到该版本的 CLI 包，例如 `{@pm dlx @astryxdesign/cli@0.7.2}`。"
        },
        {
          "type": "prose",
          "text": "只有当你的用户以其他方式运行 CLI 时才设置 `cliCommand`，例如通过你公司发布的包装器，在加载你的包的情况下运行它。否则 CLI 打印的命令会把用户及其 Agent 引导到一个能应答但没有加载你的包的 CLI。大多数包都会省略这个字段。"
        }
      ]
    },
    {
      "section": "Set it",
      "title": "设置 cliCommand",
      "content": [
        {
          "type": "prose",
          "text": "在 `astryx.integration.mjs` 中添加 `cliCommand`：命令本身，不带子命令。"
        },
        null,
        {
          "type": "prose",
          "text": "在安装了你的包的应用中，CLI 之后打印的每条命令都会带上它："
        },
        null,
        {
          "type": "prose",
          "text": "这涵盖提示、错误、建议、Doctor 修复、`--help`、设置提醒、`init` 写入的 Agent 区块以及文档文本。`--json` 输出会保留每条不带运行器的命令，例如 `\"command\": \"astryx theme add ocean\"`，因此脚本在每个应用中读取到的字段都相同。"
        }
      ]
    },
    {
      "section": "How the CLI picks the command",
      "title": "CLI 如何选择命令",
      "content": [
        {
          "type": "list",
          "items": [
            "应用加载的包所声明的 `cliCommand`，前提是它们都指明同一个命令。",
            "宿主工具在代替应用运行 CLI 时指定的命令。普通项目中的任何内容都不会指定命令。",
            "能到达应答版本的一条命令：如果应答的是应用自己的 CLI，就用应用包管理器运行的命令，例如 `pnpm exec astryx` 或 `yarn astryx`；如果应答的是为电脑安装的 CLI，则在项目之外用 `astryx`；否则用固定到该版本的 CLI 包，例如 `{@pm dlx @astryxdesign/cli@0.7.2}`（参见 {@link generic:who-answers}）。"
          ]
        },
        {
          "type": "prose",
          "text": "两个包设置了相同命令时即为一致，CLI 会使用该命令。"
        }
      ]
    },
    {
      "section": "When two packages disagree",
      "title": "两个包不一致时",
      "content": [
        {
          "type": "prose",
          "text": "如果应用加载的两个包设置了不同的命令，CLI 两个都不用：它会用应用包管理器运行的命令来打印命令，即使某个宿主工具指定了命令也是如此。`{@command doctor}` 会在其 `cli-command` 检查中给出警告，并列出这两个包："
        },
        null,
        {
          "type": "prose",
          "text": "应用可以通过移除非该应用所需的包来解决，或者让这些包就同一个命令达成一致。"
        }
      ]
    },
    {
      "section": "Check it",
      "title": "检查配置",
      "content": [
        {
          "type": "prose",
          "text": "无效值会被忽略，清单的其余部分仍会加载。`{@command doctor integration validate}` 会将其报告为 `invalid_cli_command`。有效的 `cliCommand` 是一行纯文本，两端没有空格，最多 120 个字符。"
        },
        {
          "type": "prose",
          "text": "在安装了你的包的应用中，`{@command doctor}` 会通过其 `cli-command` 检查，并把你的包列为设置该命令的包。在此字段出现之前发布的 CLI 会把 `cliCommand` 报告为未知键，并打印包管理器的命令。"
        },
        null
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式：在项目之外，`cliCommand` 适用于为电脑安装的集成；如果未声明任何命令，命令会以本机安装的 CLI 的裸命令开头。在项目内部，只有项目的集成才算数，因此为电脑安装的包所提供的 `cliCommand` 永远不会改变项目打印的命令。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
