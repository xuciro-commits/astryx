// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for reference.doc.mjs.
export const docsZh = {
  "title": "全局模式参考",
  "description": "全局模式在每个系统上使用的所有文件夹、它读取的环境变量、它添加的 JSON 字段、错误代码，以及一份简短术语表。",
  "sections": [
    {
      "section": "Folders and files",
      "title": "文件夹与文件",
      "content": [
        {
          "type": "table",
          "headers": [
            "内容",
            "Linux",
            "macOS",
            "Windows"
          ],
          "rows": [
            [
              "缓存文件夹",
              "`~/.cache/astryx`（或 `$XDG_CACHE_HOME/astryx`）",
              "`~/Library/Caches/astryx`",
              "`%LOCALAPPDATA%\\astryx\\Cache`"
            ],
            [
              "项目使用的版本",
              "`<cache>/releases/<version>`",
              "`<cache>/releases/<version>`",
              "`<cache>\\releases\\<version>`"
            ],
            [
              "设置文件夹",
              "`~/.config/astryx`（或 `$XDG_CONFIG_HOME/astryx`）",
              "`~/Library/Application Support/astryx`",
              "`%APPDATA%\\astryx`"
            ],
            [
              "更新检查与通知，以及上一次通知或检查未发生的原因（仅限 `{@command doctor}`）",
              "`<settings>/state.json`",
              "`<settings>/state.json`",
              "`<settings>\\state.json`"
            ],
            [
              "Agent 指南设置，以及 Astryx 创建的链接",
              "`<settings>/settings.json`",
              "`<settings>/settings.json`",
              "`<settings>\\settings.json`"
            ],
            [
              "Agent 指南",
              "`~/.agents/skills/astryx/SKILL.md`，从 `~/.claude/skills/astryx` 等位置链接",
              "同上",
              "同上，位于 `%USERPROFILE%` 下"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "Agent 指南链接到的每个文件夹：{@link generic:computer-agent-guide}。"
        }
      ]
    },
    {
      "section": "Environment variables",
      "title": "环境变量",
      "content": [
        {
          "type": "table",
          "headers": [
            "变量",
            "作用"
          ],
          "rows": [
            [
              "`CI`",
              "设置为除空值、`0` 或 `false` 之外的任何值：不检查更新，也不显示通知。"
            ],
            [
              "`NO_UPDATE_NOTIFIER`",
              "设置为任何值：不检查更新，也不显示通知。"
            ],
            [
              "`XDG_CACHE_HOME`, `XDG_CONFIG_HOME`",
              "在 Linux 上，移动缓存和设置文件夹；仅在为绝对路径时使用。"
            ],
            [
              "`LOCALAPPDATA`, `APPDATA`",
              "在 Windows 上，指定缓存和设置文件夹；仅在为绝对路径时使用。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "Astryx 不读取任何自身专属的环境变量。npm 自身的设置（例如其注册表和代理）适用于它为项目安装的版本。"
        }
      ]
    },
    {
      "section": "JSON fields",
      "title": "JSON 字段",
      "content": [
        {
          "type": "list",
          "items": [
            "每个成功的 `--json` 结果中的 `meta.answeredBy`：`cli`（作出回答的版本）、`core`（它使用的 Core，或 `null`），以及 `copy`：`project`（项目自身的 CLI）、`starting`（在没有自身 CLI 的项目中，你启动的 astryx 命令）、`matched`（当项目自身的 CLI 无法启动时，与项目 Core 相等的 CLI 版本）、`carried`（在项目之外），或 `fallback`（无法获取该版本，因此由你启动的 astryx 命令代为回答）。",
            "来自 `{@command discover}` 且 `source: \"installed for this computer\"` 的 `meta.available` 条目：安装在全局安装旁边的集成，项目可以添加它，其安装命令位于 `install` 中。"
          ]
        }
      ]
    },
    {
      "section": "Error codes",
      "title": "错误码",
      "content": [
        {
          "type": "list",
          "items": [
            "`ERR_VERSIONS_UNAVAILABLE`：没有任何版本可以回答，例如在项目外执行需要 Core 的命令，而该环境无法安装 Core。只有匹配版本缺失时，运行仍会给出答案，并附带警告。{@link generic:problems}",
            "`ERR_PROJECT_REQUIRED`：只能在项目中工作的命令在项目外运行。全局模式之前发布的命令保留其原有的错误码：`theme use`、`theme remove` 和 `theme add <slug>` 使用 `ERR_THEME_INVALID`，`integration add` 使用 `ERR_FILE_NOT_FOUND`，`swizzle` 使用 `ERR_CORE_NOT_FOUND`，`upgrade` 使用 `ERR_VERSION_DETECT`。"
          ]
        }
      ]
    },
    {
      "section": "What changes in global mode",
      "title": "全局模式下的变化",
      "content": [
        {
          "type": "list",
          "items": [
            "哪个版本作答：在项目中，是项目自身的 CLI（仅安装 Core 时，则是你启动的 astryx 命令）；在项目外，是你的全局版本。{@link generic:who-answers}",
            "更改项目的命令在项目外不写入任何内容；`doctor`、`init` 和 `theme add` 在项目外会做别的事情。{@link namespace:commands}",
            "全局安装的集成仅在项目外工作。{@link generic:computer-integrations}",
            "编程 API 使用你导入的包在你的进程中运行，绝不会交给另一个版本；当 `cwd` 位于项目外时，其函数的行为与命令在该处的行为一致。{@link namespace:api}"
          ]
        }
      ]
    },
    {
      "section": "Glossary",
      "title": "术语表",
      "content": [
        {
          "type": "list",
          "items": [
            "**全局安装**：使用 `npm i -g` 或其他包管理器为你计算机安装的 CLI。",
            "**项目版本**：项目自身的 CLI；它响应该项目中的每个命令。仅有 Core 的项目没有项目版本，因此由你启动的 astryx 命令作答。",
            "**缓存**：Astryx 存放项目需要但未安装的版本的文件夹。"
          ]
        }
      ]
    },
    {
      "section": "More on global mode",
      "title": "更多关于全局模式",
      "content": [
        {
          "type": "prose",
          "text": "本页是 {@link namespace:global} 的一部分，该主题解释全局模式是什么以及各个部分如何工作。"
        }
      ]
    }
  ]
};
