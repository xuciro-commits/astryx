// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for computer-agent-guide.doc.mjs.
export const docsZh = {
  "title": "你电脑上的 Agent 指南",
  "description": "全局安装会在你的主目录中保留一个简短的 Astryx 技能文件，并将其链接到 Agent 工具读取的文件夹中，这样任何位置的 Agent 都知道 Astryx 就在那里。`{@command init --user}` 会立即写入该文件，或将其关闭。",
  "sections": [
    {
      "section": "What it is",
      "title": "它是什么",
      "content": [
        {
          "type": "prose",
          "text": "项目的 Agent 文档只能触达在该项目中工作的 Agent。全局安装还会保留一个技能文件 `~/.agents/skills/astryx/SKILL.md`，大多数编程 Agent 都会读取它。它告诉 Agent：这台电脑上装有 Astryx、何时相关（构建或更改 UI 时），以及应当从 `{@command search}` 开始。它不指定任何版本号，因此永远不会过时。在项目内部，项目自己的 Agent 文档优先。"
        },
        {
          "type": "prose",
          "text": "它会在首次运行时于后台写入，并在你升级后再次写入，因此任何命令都不会等待它。安装包本身不会写入它，因为某些包管理器会跳过安装脚本。"
        }
      ]
    },
    {
      "section": "Where agents find it",
      "title": "Agent 在哪里找到它",
      "content": [
        {
          "type": "prose",
          "text": "只读取自己技能文件夹的 Agent 会获得指向该技能文件夹的链接，因此它们读取的是同一个文件：一个带相对目标的文件夹符号链接（Windows 上为联接点，两者都无法创建时为副本）。Continue 的扫描器会跳过链接，因此它获得的是副本，并随文件一起刷新："
        },
        {
          "type": "table",
          "headers": [
            "文件夹",
            "何时"
          ],
          "rows": [
            [
              "`~/.claude/skills/astryx`",
              "始终"
            ],
            [
              "`~/.kiro/skills/astryx`",
              "当 `~/.kiro` 存在时"
            ],
            [
              "`~/.codeium/windsurf/skills/astryx`",
              "当 `~/.codeium/windsurf` 存在时"
            ],
            [
              "`~/.letta/skills/astryx`",
              "当 `~/.letta` 存在时"
            ],
            [
              "`~/Library/Developer/Xcode/CodingAssistant/ClaudeAgentConfig/skills/astryx`",
              "当 Xcode 的编程助手文件夹存在时"
            ],
            [
              "`~/.config/agents/skills/astryx`",
              "当 `~/.config/agents/skills` 存在时"
            ],
            [
              "`~/.continue/skills/astryx`（副本）",
              "当 `~/.continue` 存在时"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "Astryx 绝不会替换它在这些文件夹中未曾创建的任何内容，也绝不会写入由其他工具管理的文件夹；`{@command doctor}` 会列出它跳过的文件夹，以及技能文件夹缺失的任何链接，例如只挂载了某个 Agent 文件夹的容器中。"
        }
      ]
    },
    {
      "section": "Cloud agents and apps",
      "title": "云端 Agent 与应用",
      "content": [
        {
          "type": "list",
          "items": [
            "云端和后台 Agent 只读取代码仓库，因此项目的 Agent 文档——即 `{@command init}` 写入 AGENTS.md 或 CLAUDE.md 的块——才是能够触达它们的内容。",
            "对于接受上传技能的应用：上传 `~/.agents/skills/astryx/SKILL.md`，或其所在文件夹的 zip 包。"
          ]
        }
      ]
    },
    {
      "section": "Other agents",
      "title": "其他 Agent",
      "content": [
        {
          "type": "prose",
          "text": "如果你的 Agent 从其他文件夹读取技能，请将其链接到该技能："
        },
        null,
        {
          "type": "prose",
          "text": "在 Windows 上，使用 PowerShell："
        },
        null
      ]
    },
    {
      "section": "Write it now, or turn it off",
      "title": "立即写入，或关闭它",
      "content": [
        null,
        {
          "type": "list",
          "items": [
            "`init --user` 会立即写入该文件及相应链接。",
            "`--remove-agents` 会移除该文件以及 Astryx 创建的所有链接，并关闭该功能，直到你再次运行 `{@command init --user}`。",
            "你编辑过的文件绝不会被覆盖或移除；删除它即可获取当前文本。",
            "在项目之外，`{@command doctor}` 会说明该技能是否存在、是否为当前版本、是否被编辑过或已关闭，以及它链接到哪里。"
          ]
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "关于全局模式的更多内容",
      "content": [
        {
          "type": "prose",
          "text": "本页属于 {@link namespace:global} 的一部分，该命名空间说明了什么是全局模式以及各个部分如何工作。项目自己的 Agent 文档：{@link command:init}。"
        }
      ]
    }
  ]
};
