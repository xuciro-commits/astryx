// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for doc-syntax.doc.mjs.
export const docsZh = {
  "title": "文档语法",
  "description": "文档中用于链接、Astryx 命令和包管理器步骤的令牌；CLI 会按每位读者自己的包管理器来展示它们。",
  "sections": [
    {
      "section": "The tokens",
      "title": "令牌",
      "content": [
        {
          "type": "prose",
          "text": "文档从不点名某个包管理器或运行器：读者使用 npm、pnpm、Yarn 或 Bun，并通过自己的包管理器运行 CLI。请改为编写令牌，CLI 会向每位读者显示其实际运行的命令。令牌可用于正文、列表项、表格单元格和代码块。"
        },
        {
          "type": "table",
          "headers": [
            "编写",
            "用途",
            "pnpm 读者会看到"
          ],
          "rows": [
            [
              "`{@@link generic:deploying}`",
              "另一篇文档",
              "打开该文档的命令"
            ],
            [
              "`{@@command docs theme}`",
              "一条 Astryx 命令",
              "`pnpm exec astryx docs theme`"
            ],
            [
              "`{@@pm install @acme/widgets --dev}`",
              "一个包管理器步骤",
              "`pnpm add -D @acme/widgets`"
            ],
            [
              "`{@@pm-only npm \"why\" pkg set name=x}`",
              "只有某一种包管理器能执行的步骤",
              "`npm pkg set name=x`（仅在使用 npm 时：why）"
            ],
            [
              "`{@@@pm install x}`",
              "按原样显示的令牌",
              "`{@@pm install x}`"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "在正文中，令牌会打印为行内代码；在代码片段或代码块中，则只打印命令本身。`--json` 携带相同的命令：`{@@command}` 令牌会作为以 astryx 开头的裸命令出现，由展示该文档的读取方自行加上前缀。"
        }
      ]
    },
    {
      "section": "Package-manager steps",
      "title": "包管理器步骤",
      "content": [
        {
          "type": "prose",
          "text": "`{@@pm}` 令牌由动词、名词以及它接受的标志组成。下表中的每一行在每个包管理器中的运行效果都相同；CLI 会写入读者自己的那一版。"
        },
        {
          "type": "table",
          "headers": [
            "令牌",
            "npm",
            "pnpm",
            "Yarn",
            "Bun"
          ],
          "rows": [
            [
              "`{@@pm install}`",
              "`npm install`",
              "`pnpm install`",
              "`yarn install`",
              "`bun install`"
            ],
            [
              "`{@@pm install x}`",
              "`npm install x`",
              "`pnpm add x`",
              "`yarn add x`",
              "`bun add x`"
            ],
            [
              "`{@@pm install x --dev}`",
              "`npm install -D x`",
              "`pnpm add -D x`",
              "`yarn add -D x`",
              "`bun add -d x`"
            ],
            [
              "`{@@pm install x --global}`",
              "`npm install -g x`",
              "`pnpm add -g x`",
              "`yarn global add x`（Yarn 1）；Yarn 2 及更高版本使用 npm",
              "`bun add -g x`"
            ],
            [
              "`{@@pm remove x}`",
              "`npm uninstall x`",
              "`pnpm remove x`",
              "`yarn remove x`",
              "`bun remove x`"
            ],
            [
              "`{@@pm update x --latest}`",
              "`npm install x@latest`",
              "`pnpm update --latest x`",
              "`yarn up x`",
              "`bun update --latest x`"
            ],
            [
              "`{@@pm run build --watch}`",
              "`npm run build -- --watch`",
              "`pnpm run build --watch`",
              "`yarn run build --watch`",
              "`bun run build --watch`"
            ],
            [
              "`{@@pm exec tsc}`",
              "`npx tsc`",
              "`pnpm exec tsc`",
              "`yarn run tsc`",
              "`bunx tsc`"
            ],
            [
              "`{@@pm dlx @astryxdesign/cli init}`",
              "`npx @astryxdesign/cli init`",
              "`pnpm dlx @astryxdesign/cli init`",
              "`yarn dlx …`（Yarn 1 上为 `npx`）",
              "`bunx @astryxdesign/cli init`"
            ],
            [
              "`{@@pm create vite}`",
              "`npm create vite`",
              "`pnpm create vite`",
              "`yarn create vite`",
              "`bun create vite`"
            ]
          ]
        },
        {
          "type": "list",
          "items": [
            "标志：`--dev` 和 `--exact` 与 `install` 搭配，`--global` 与 `install` 和 `remove` 搭配，`--latest` 与 `update` 搭配。`--exact` 只接受一个版本，绝不接受范围：只有 npm 会锁定传入的范围。",
            "脚本（`run`）、二进制文件（`exec`）或包（`dlx`、`create`）名称之后的所有内容，都会按原样传递给它。",
            "在 pnpm 上使用 `{@@pm install x --global}` 需要每台电脑运行一次 `pnpm setup`。"
          ]
        }
      ]
    },
    {
      "section": "A step only one package manager can do",
      "title": "仅单个包管理器可执行的步骤",
      "content": [
        {
          "type": "prose",
          "text": "有些命令只存在于某一个包管理器中，例如 `npm pkg set` 或 `pnpm setup`。请编写 `{@@pm-only <manager> \"<reason>\" <command>}`：manager 是 npm、pnpm、yarn、yarn-classic 或 bun 之一，双引号中的 reason 会显示在命令旁边供读者查看。仅当没有任何 `{@@pm}` 步骤能完成同样的事情时才使用它：如果某个仅限单一包管理器的步骤其实每种包管理器都能运行，doctor 会指出它，并给出应改写的 `{@@pm}` 令牌。"
        }
      ]
    },
    {
      "section": "What doctor checks",
      "title": "doctor 检查的内容",
      "content": [
        {
          "type": "prose",
          "text": "`doctor integration validate`，以及 `integration check`，会将以下每一项列为一个提示，包含其文件、行号和应编写的令牌。目前这些提示不会导致任何失败；下一个次版本会把它们变成警告，因此 `integration check --strict --next` 现在就会因它们而失败。运行它即可提前修复。"
        },
        {
          "type": "table",
          "headers": [
            "提示",
            "触发条件"
          ],
          "rows": [
            [
              "`package_manager_command`",
              "为某一种包管理器编写的代码片段或 shell 行，例如 `npm install -D x`"
            ],
            [
              "`runner_command`",
              "使用运行器编写的 Astryx 命令，例如 `pnpm exec astryx docs`"
            ],
            [
              "`plain_command`",
              "以裸形式编写的 Astryx 命令，此时 `{@@command docs}` 会检查该命令是否存在"
            ],
            [
              "`doc_token`",
              "无法解析的令牌，或不是文档令牌的名称"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "在全局模式下：在项目之外，`{@@command}` 令牌会按全局安装打印每条命令的方式来打印，而 `{@@pm}` 步骤会按 npm 打印，除非 CLI 检测到其他包管理器。在项目内部，则由项目自己的运行器和包管理器决定。参见 {@link namespace:global}。"
        }
      ]
    }
  ]
};
