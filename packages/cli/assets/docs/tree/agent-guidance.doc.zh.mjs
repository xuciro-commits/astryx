// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for agent-guidance.doc.mjs.
export const docsZh = {
  "title": "Agent 指南",
  "description": "添加几行指南，供应用展示给在其代码中工作的 AI Agent。",
  "sections": [
    {
      "section": "Add a line of guidance",
      "title": "添加一行指南",
      "content": [
        {
          "type": "prose",
          "text": "`integration add agent-doc` 会为在使用你的包的应用中工作的 AI Agent 添加一行指南。应用会将它显示在自己的 Agent 文件中，例如 `AGENTS.md`。"
        },
        null,
        {
          "type": "prose",
          "text": "这一行会写入清单文件的 `agentDocs.append`："
        },
        null,
        {
          "type": "prose",
          "text": "重复添加同一行不会有任何变化。如需改写或删除某一行，请手动编辑 `agentDocs.append`。"
        }
      ]
    },
    {
      "section": "Keep within the limits",
      "title": "遵守限制",
      "content": [
        {
          "type": "prose",
          "text": "每一行都会占用每个应用 Agent 文件的空间，因此 CLI 会控制指南的数量和长度。详细内容请放进你的文档。"
        },
        {
          "type": "table",
          "headers": [
            "限制",
            "超出后的结果"
          ],
          "rows": [
            [
              "每个包 8 行",
              "`integration add` 失败：`append may contain at most 8 lines`。"
            ],
            [
              "每行 240 个字符",
              "`integration add` 失败：`must contain at most 240 Unicode code points`。"
            ],
            [
              "每个应用 32 行（来自其所有包）",
              "`init` 不写入 Agent 区块，并输出 `Could not install agent docs.`"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "一行就是一行纯文本。换行符、控制字符、首尾空格以及 `<!-- ASTRYX:START -->` 等受管区块标记都会被拒绝。"
        },
        {
          "type": "prose",
          "text": "在行内以单独的 astryx 一词开头编写命令，前面不要加运行器，例如：在完成前运行 astryx doctor。区块会在顶部为下方的每条命令统一指明应用运行一次的命令，因此你写的行在每个应用中都能生效。参见 {@link generic:cli-command}。"
        }
      ]
    },
    {
      "section": "See what agents read",
      "title": "查看 Agent 读取的内容",
      "content": [
        {
          "type": "prose",
          "text": "应用的 `{@command init}` 会把你的行写入其受管 Agent 区块的末尾，每行都标注你的包名。标题、标签和标记都由 CLI 管理。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "该区块会收集应用已安装的所有集成的行，无论是否有 `astryx.config` 条目。"
        }
      ]
    },
    {
      "section": "Refresh the block in an app",
      "title": "在应用中刷新区块",
      "content": [
        {
          "type": "prose",
          "text": "只有当应用运行 `init` 或 `upgrade --from <version> --apply` 时，该区块才会变化。应用安装带有新行的包版本后，会运行其中之一。"
        },
        null,
        null,
        {
          "type": "prose",
          "text": "`upgrade --apply` 会输出该行；`init` 会输出 `[ok] AI agent docs installed -> AGENTS.md`。不带 `--apply` 时，`upgrade` 只会报告 `Agent docs differ from the installed Astryx and integration configuration.`。即使 Core 没有变化，它也会刷新该区块。参见 {@link command:upgrade}。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：CLI 为整台电脑维护的 Agent 指南不包含任何集成的指南，因为它服务于所有文件夹；你的指南会通过安装你的包的应用中 `init` 写入的 Agent 文档传达给 Agent。参见 {@link namespace:global} 和 {@link generic:computer-agent-guide}。"
        }
      ]
    }
  ]
};
