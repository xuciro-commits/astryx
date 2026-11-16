// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for debug-and-gap-reports.doc.mjs.
export const docsZh = {
  "title": "调试与缺口报告",
  "description": "在使用你的包的应用中接收每次 CLI 运行的记录，并处理它们就此发送的缺口报告。",
  "sections": [
    {
      "section": "Record runs with debug",
      "title": "使用 debug 记录运行",
      "content": [
        {
          "type": "prose",
          "text": "从 `astryx.integration.mjs` 导出 `debug` 函数；在加载你的包的应用中，CLI 每次运行命令都会调用它一次。"
        },
        null,
        {
          "type": "prose",
          "text": "事件是一个 `DebugEvent`，包含 `command`、`outcome`、`exitCode`、`durationMs`、`error` 等字段，其值已脱敏（`redacted: true`）。所有字段见 {@link schema:debug-event}。"
        },
        {
          "type": "prose",
          "text": "让该函数保持同步：CLI 在进程退出时调用它，从不会等待 Promise。应用自己的 `debug` 处理程序先运行，然后是你的。抛异常的处理程序会被跳过，命令的输出和退出码保持不变。"
        },
        {
          "type": "prose",
          "text": "只有当应用的 `astryx.config` 列出 `integrations` 或 `debug`（例如列出你的包）时，应用才会记录每条命令。否则你的处理程序只在加载应用项目的命令（如 `component` 和 `docs`）中运行，从不为 `--version` 或拼错的命令运行。在配置中两个词都未出现的应用里，这些命令还会向 stderr 打印警告。"
        },
        {
          "type": "prose",
          "text": "`debug` 是具名导出，不是清单字段，因此旧版 CLI 会忽略它并加载清单的其余部分。"
        }
      ]
    },
    {
      "section": "Turn off debug in an app",
      "title": "在应用中关闭 debug",
      "content": [
        {
          "type": "prose",
          "text": "应用可以拒绝所有集成包的 `debug` 处理程序，只保留自己的。它在 package.json 中设置 `inheritDebug`："
        },
        null,
        {
          "type": "prose",
          "text": "此后你的处理程序不再在该应用中运行。"
        }
      ]
    },
    {
      "section": "Handle gap reports",
      "title": "处理缺口报告",
      "content": [
        {
          "type": "prose",
          "text": "导出一个 `gapReport` 处理程序，应用中的 `{@command gap-report}` 会把每份缺口报告（例如缺失的组件或变体）发送给它。该处理程序归档报告并返回回执。"
        },
        null,
        {
          "type": "prose",
          "text": "应用中的每个处理程序都会收到每份报告，因此请检查 `report.target.package`，并跳过关于其他包的报告。"
        },
        {
          "type": "prose",
          "text": "所有字段见 {@link schema:gap-report-handler}。"
        },
        {
          "type": "prose",
          "text": "CLI 会等待 30 秒，然后中止 `signal`。抛异常、超时或回执无效都会使你的投递失败，命令以退出码 1 结束；其他处理程序仍会运行。与 `debug` 一样，`gapReport` 是具名导出，旧版 CLI 会忽略它。"
        }
      ]
    },
    {
      "section": "Ask before filing in public",
      "title": "公开提交前先询问",
      "content": [
        {
          "type": "prose",
          "text": "当你的处理程序写入公众可读的位置时，设置 `audience: 'public'`。只有调用方传入 `--confirm-public` 时 CLI 才会运行它；`'internal'` 处理程序则始终运行。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "加上 `--confirm-public` 后，同一次投递会显示 `status: filed` 并展示你的 `url`。报告会发送到 `--package` 指定的包，否则发送到拥有该组件的包，再否则发送到 Core。"
        }
      ]
    },
    {
      "section": "Fall back to issuesUrl",
      "title": "回退到 issuesUrl",
      "content": [
        {
          "type": "prose",
          "text": "当应用中没有 `gapReport` 处理程序时，CLI 会把报告路由到目标包清单中的 `issuesUrl`。"
        },
        {
          "type": "list",
          "items": [
            "GitHub issues URL（如 `https://github.com/acme/widgets/issues`）会在调用方传入 `--confirm-public` 后，通过 GitHub CLI `gh` 提交一个 issue。",
            "任何其他 URL 都会以 `routed_only` 回执返回，由调用方自行打开。",
            "没有 `issuesUrl` 时，命令失败：`Package \"@acme/astryx-widgets\" provides neither a report handler nor an issues URL.`"
          ]
        },
        {
          "type": "prose",
          "text": "只要应用中任意位置（来自应用或任何包）有一个处理程序，就会对所有报告关闭回退。列出的包加载失败也一样：CLI 无法判断它是否有处理程序，因此该包的报告会失败，而不会转到其他跟踪器。见 {@link command:gap-report}。"
        }
      ]
    },
    {
      "section": "Let the person choose where a report goes",
      "title": "让用户选择报告去向",
      "content": [
        {
          "type": "prose",
          "text": "当应用加载了声明各自 `issuesUrl` 的包时，报告可以发送到默认位置（处理程序或上面的回退），也可以发送到其中某个包。`{@command gap-report --list-categories}` 以及未传 `--to` 时提交报告的回执都会列出所有目标位置，并附一行提示，要求智能体询问用户。"
        },
        {
          "type": "list",
          "items": [
            "智能体会询问用户要提交到哪里，绝不会自行选择包目标。",
            "`--to <package>` 承载用户的选择：报告只会发送到该包的 `issuesUrl`，遵循同样的 `--confirm-public` 规则，且不会运行任何处理程序。",
            "没有选择时，省略 `--to`；报告会发送到默认位置。",
            "如果 `--to` 未指定任何目标，会在发送任何内容之前失败并列出可用的目标。"
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
          "text": "全局模式：当用户把包安装到自己的电脑上、与全局 CLI 并存时，其 `debug` 函数也会接收任何项目之外文件夹中的运行；在项目内，只有项目安装了该包时才会接收。见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
