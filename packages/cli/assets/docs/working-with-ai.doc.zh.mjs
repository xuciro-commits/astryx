// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for working-with-ai.doc.mjs.
export const docsZh = {
  "title": "与 AI 协作",
  "description": "如何配置 AI 编码工具，使其生成正确的组件代码。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "该设计系统以 AI 友好为目标构建：命名一致、属性模式可预测，CLI 还能把结构化文档直接送入 AI 的上下文窗口。但模型仍然需要正确的上下文，否则就会退回到通用的 React 写法，或凭空臆造属性。"
        },
        {
          "type": "prose",
          "text": "CLI 内置了 Agent 文档系统，可为你选择的 AI 工具生成上下文文件。一条命令即可准备好 AI 编写正确组件代码所需的一切。"
        }
      ]
    },
    {
      "section": "Set up agent docs",
      "title": "设置智能体文档",
      "content": [
        {
          "type": "prose",
          "text": "告诉你的 AI 安装 CLI 并完成自我设置："
        },
        {
          "type": "code",
          "label": "将此内容粘贴到你的 AI 中"
        },
        {
          "type": "prose",
          "text": "就这样。`init --features agents` 命令会从已安装的项目中生成 AI 所需的一切（组件索引、行为规则、CLI 参考，以及来自已配置集成的包指南）。依赖升级后，`{@command upgrade --from <old version>}` 会报告过期的区块，加上 `--apply` 即可刷新。"
        },
        {
          "type": "prose",
          "text": "默认情况下，它会把说明写入项目根目录的 `AGENTS.md`（大多数 Agent 都会读取的、与工具无关的标准文件）。项目根目录指最近的、其 `package.json` 声明了 Astryx 包的文件夹；如果没有，则取最近的、包含任意 `package.json` 的文件夹。搜索会止步于仓库根目录。在主目录中，或在主目录内某个项目之外的设置文件夹中，init 不会写入任何 Agent 文档：主目录下名称以点开头的每个文件夹（`~/.claude`、`~/.gemini`、`~/.codex`）都是设置文件夹，这类文件夹本身永远不算项目，即使其中含有 `package.json`；其下带有自己 `package.json` 的项目（例如 Agent 工作树）则会照常设置。当项目含有 `CLAUDE.md` 或 `.claude/CLAUDE.md` 时，Claude Code 会跳过 `AGENTS.md`，因此 init 也会把说明写入该文件，即使该文件导入了 `AGENTS.md` 也是如此：在子文件夹中启动的会话里，Claude Code 不会跟随这个导入。两个文件同时存在时，根目录的 `CLAUDE.md` 会得到副本，而 `.claude/CLAUDE.md` 中的副本会被删除；除非项目忽略了 `CLAUDE.md`，此时项目提交的 `.claude/CLAUDE.md` 会保留一份副本。Gemini CLI 只读取 `GEMINI.md`，因此 init 会在那里添加一行对 `AGENTS.md` 的导入，除非 `GEMINI.md` 已经导入了它。`upgrade` 会让这些副本保持同步。Astryx 标记之间的区块归 Astryx 所有：无论项目的忽略规则或生成的标记如何规定，init 和 `upgrade` 都会写入、刷新并删除它，且永远不会改动它周围的文本。若要改为定位某个特定工具的文件："
        },
        {
          "type": "code",
          "label": "手动选项"
        },
        {
          "type": "prose",
          "text": "使用 `--agent all` 时，`GEMINI.md` 会保留其一行式的 `AGENTS.md` 导入。使用 `--agent claude` 或 `--agent all`（与默认行为相同）时，一旦 `CLAUDE.md` 获得说明，`.claude/CLAUDE.md` 就不会获得任何内容，其中已有的副本会被删除；除非项目忽略了 `CLAUDE.md`：全新克隆的项目没有该文件，因此项目提交的 `.claude/CLAUDE.md` 也会获得一份副本，`--agent claude` 和 `--agent all` 都是如此。`init --remove-agents` 会在项目根目录及其运行所在的文件夹中删除这些说明。"
        },
        {
          "type": "prose",
          "text": "对于在任何单个项目之外工作的 Agent，你的全局安装会保留一个简短的 Astryx 技能文件 `~/.agents/skills/astryx/SKILL.md`，并把它链接到 Agent 工具读取的技能文件夹中，例如 `~/.claude/skills/astryx`。它让 Agent 知道 Astryx 已安装可用，以及何时使用它；`{@command init --user}` 会立即写入该文件，或者配合 `--remove-agents` 将其关闭。在项目内部，Agent 会遵循该项目自己的 Agent 文档。参见 {@link generic:computer-agent-guide}。"
        }
      ]
    },
    {
      "section": "What Gets Generated",
      "title": "生成的内容",
      "content": [
        {
          "type": "prose",
          "text": "生成的上下文会在编写任何 UI 代码之前，教会你的 AI 一套三步工作流："
        },
        {
          "type": "list",
          "items": [
            "`{@command build \"<idea>\"}`：获取作为起点的页面模板（始终只有一个：最接近的匹配项或应用外壳）、另外两个模板，以及它所缺少部分对应的区块和组件",
            "`{@command template <name> <path>}`：将该模板作为起点搭建到项目中，保留其框架和间距，并替换其内容",
            "`{@command component <Name>}`：读取每个所用组件的属性和示例"
          ]
        },
        {
          "type": "prose",
          "text": "它还包括防止常见错误的规则（每个页面都从模板开始、不用原生 div、不用 style={{}}、使用令牌而非魔法值）、一份 CLI 快速参考，以及当已配置的清单声明 `agentDocs` 时按包提供的集成指南。设置完成后，你应该无需再手动纠正 AI 在这些约定上的做法；Agent 文档会在系统层面处理这一点。"
        }
      ]
    },
    {
      "section": "Cursor Setup",
      "title": "Cursor 设置",
      "content": [
        {
          "type": "prose",
          "text": "Cursor 从 `.cursor/rules/` 读取项目规则。若要把 Astryx 上下文保存在独立规则中，请写到那里。提供一个相对于项目根目录的路径，例如 `.cursor/rules/astryx.mdc`；绝对路径会被拒绝。"
        },
        {
          "type": "code",
          "label": "安装为 Cursor 项目规则"
        },
        {
          "type": "prose",
          "text": "重新运行同一条命令只会重写 Astryx 区块，因此你在其上方添加的 frontmatter（例如 `alwaysApply: true`）会保留。"
        }
      ]
    },
    {
      "section": "Checking Your Setup",
      "title": "检查你的设置",
      "content": [
        {
          "type": "prose",
          "text": "在编写任何组件代码之前，将此内容粘贴到你的 AI 中。如果你的 AI 无法回答这些问题，它就会知道需要先安装 Agent 文档。"
        },
        {
          "type": "code",
          "label": "将此内容粘贴到你的 AI 中"
        }
      ]
    },
    {
      "section": "The astryx Pattern",
      "title": "astryx 模式",
      "content": [
        {
          "type": "prose",
          "text": "AI Agent 经常用错误的路径调用 CLI（例如用 node_modules/@astryxdesign/cli/bin/docs.mjs 而不是 astryx.mjs），导致静默失败。添加一个指向正确路径的 npm 脚本别名即可彻底消除这个问题。"
        },
        {
          "type": "code",
          "label": "package.json"
        },
        {
          "type": "prose",
          "text": "有了这个别名，Agent 会运行 `npm run astryx -- component --list`，而不再猜测二进制路径。`--` 分隔符是 npm 向脚本传递标志的标准约定。"
        },
        {
          "type": "code",
          "label": "可靠的 CLI 调用"
        }
      ]
    },
    {
      "section": "Shorter output: --detail and --dense",
      "title": "更短的输出：--detail 与 --dense",
      "content": [
        {
          "type": "prose",
          "text": "如需更短的阅读内容，可加上 `--detail brief`（每个章节一行）或 `--detail compact`。如果文档提供了更短的版本，`--dense` 会换成那个版本。将 CLI 输出粘贴到 ChatGPT 或 Claude 等基于 Web 的 AI 工具时，请使用这些选项。"
        },
        {
          "type": "code",
          "label": "用于粘贴到 AI 对话的简短输出"
        }
      ]
    },
    {
      "section": "MCP Server",
      "title": "MCP 服务器",
      "content": [
        {
          "type": "prose",
          "text": "Astryx 附带一个 Model Context Protocol（MCP）服务器，任何兼容 MCP 的 AI 工具都可以连接。无需手动粘贴 CLI 输出，AI 可以直接查询 Astryx 设计系统：搜索组件、阅读完整文档，并按需获取代码示例。"
        },
        {
          "type": "prose",
          "text": "该 MCP 服务器提供两个工具：search(query) 用于发现组件、文档主题和模板；get(name) 用于获取包含属性、用法和示例的完整文档。"
        },
        {
          "type": "prose",
          "text": "将服务器添加到你的 MCP 配置文件中。该条目是一个远程 HTTP 服务器，具体格式因客户端而异，因此请使用你所运行工具的代码片段。如果条目的传输类型无法识别，它会被跳过并给出警告，而不是报错；这看起来就像服务器已连接，但没有提供任何工具。"
        },
        {
          "type": "code",
          "label": "Claude Code (.mcp.json)"
        },
        {
          "type": "prose",
          "text": "Claude Code 也可以在终端中写入该条目："
        },
        null,
        {
          "type": "code",
          "label": "Cline (cline_mcp_settings.json) - type 为 streamableHttp"
        },
        {
          "type": "code",
          "label": "Cursor (.cursor/mcp.json) - 远程服务器不需要 type 字段"
        },
        {
          "type": "prose",
          "text": "Claude Desktop 是个例外：claude_desktop_config.json 存放本地 stdio 服务器，因此远程服务器要通过「设置」→「连接器」→「添加自定义连接器」添加，并粘贴上面的 URL。"
        },
        {
          "type": "prose",
          "text": "连接后，你的 AI 工具可以用自然语言搜索组件（例如“dropdown menu”、“success message”），并获取完整文档，无需任何手动 CLI 调用。该服务器使用与组件文档相同的关键词索引，因此随着组件文档的更新，搜索质量会自动提高。"
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "全局模式",
      "content": [
        {
          "type": "prose",
          "text": "全局模式：你的全局安装会在主目录中保留一个 Astryx 技能，并链接到 Agent 工具读取的文件夹中，这样在任何项目之外工作的 Agent 都能知道 Astryx 的存在；在项目内部，则优先使用该项目自己的 Agent 文档。参见 {@link namespace:global} 和 {@link generic:computer-agent-guide}。"
        }
      ]
    }
  ]
};
