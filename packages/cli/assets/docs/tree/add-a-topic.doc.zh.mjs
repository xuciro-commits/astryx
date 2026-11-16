// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for add-a-topic.doc.mjs.
export const docsZh = {
  "title": "添加文档主题",
  "description": "向你的包添加一个文档主题，并编写它的各个小节。",
  "sections": [
    {
      "section": "Add a topic with the CLI",
      "title": "使用 CLI 添加主题",
      "content": [
        {
          "type": "prose",
          "text": "在包中运行 `integration add doc` 来添加主题。它会写入主题文件，并在 `astryx.integration.mjs` 中声明 `docs` 根目录。"
        },
        null,
        null,
        {
          "type": "list",
          "items": [
            "使用小写 kebab-case 命名主题，例如 `deploying`。读者会将名称作为命令参数输入，因此名称只能包含字母、数字、`_` 和 `-`。",
            "保持名称稳定：读者和链接都通过它来查找主题。",
            "选择 `{@command docs}` 尚未列出的名称：不能与 Core 主题重名，也不能与 `tokens` 或 `layout` 等 section 重名。要接管或扩展某个 Core 主题，请参见 {@link generic:extend-or-replace}。"
          ]
        }
      ]
    },
    {
      "section": "Write the sections",
      "title": "编写小节",
      "content": [
        {
          "type": "prose",
          "text": "主题是一个普通对象，包含 `type: 'generic'`、`name`、`title`、一句话的 `description` 以及 `sections`。每个 section 都有一个 `title` 和一组 `content` 块。"
        },
        {
          "type": "code",
          "label": "docs/deploying.doc.mjs"
        },
        {
          "type": "prose",
          "text": "示例设置了 section 的 `id`，因此 `package.json` 需要 CLI 对等依赖 `\"@astryxdesign/cli\": \">=0.6.4\"`。已发布的 0.6.3 及更早版本会拒绝 `id` 并隐藏你的包附带的所有文档主题，而且没有该对等依赖时 `integration verify` 会失败；请参见 {@link generic:versioning}。"
        },
        {
          "type": "list",
          "items": [
            "替换 `integration add` 写入的 `Overview` 占位内容。",
            "所有字段见 {@link schema:reference-doc}。"
          ]
        }
      ]
    },
    {
      "section": "Write commands for every reader",
      "title": "为每位读者编写命令",
      "content": [
        {
          "type": "prose",
          "text": "将 Astryx 命令写成 `{@@command doctor}`，将包管理器步骤写成 `{@@pm install @acme/widgets}`，绝不要在它们前面加上 npx、pnpm exec 之类的运行器，或包管理器自身的命令。CLI 会按读者实际运行的命令来显示每一项：`pnpm exec astryx doctor` 或 `yarn astryx doctor`，`pnpm add @acme/widgets` 或 `npm install @acme/widgets`，或者集成设置的 `cliCommand`。{@link generic:doc-syntax} 列出了所有令牌。直接书写的命令（astryx 一词加命令）也会以同样的方式显示。`doctor integration validate`（以及 `integration check`）会指出每个以其他方式书写的命令，并给出应替换它的令牌；{@link generic:doc-syntax} 列出了它会检查的内容。安装步骤在 CLI 安装之前运行，应写成 `{@@pm dlx @astryxdesign/cli init}`。"
        },
        {
          "type": "code",
          "label": "docs/deploying.doc.mjs"
        },
        {
          "type": "code",
          "label": "在集成设置 cliCommand: 'acme astryx' 的应用中读取"
        },
        {
          "type": "list",
          "items": [
            "CLI 会为以下行内代码片段加前缀：以 astryx 一词开头的片段；位于行首或 `&&`、`||`、`;`、`|` 之后的命令；`bash`、`sh`、`shell`、`zsh`、`console`、`text` 或 `markdown` 代码块或无语言代码块中的命令；以及只包含一条命令的表格单元格。",
            "其他语言的代码（例如 `js` 示例）以及普通正文中的 astryx 一词保持原样。",
            "`--json` 按原样返回文档，因此显示该文档的读取方需要自行给命令加前缀。"
          ]
        }
      ]
    },
    {
      "section": "Pick the doc kind",
      "title": "选择文档类型",
      "content": [
        {
          "type": "prose",
          "text": "每个文档都是一个 `.doc.mjs` 文件，其 `type` 说明它描述的对象。`integration add` 会为每种类型写入正确的 `type` 和文件。"
        },
        {
          "type": "table",
          "headers": [
            "你记录的内容",
            "`type`",
            "`integration add` 写入的文件"
          ],
          "rows": [
            [
              "指南或主题",
              "`'generic'`",
              "`docs/deploying.doc.mjs`"
            ],
            [
              "你的包的文档 section",
              "`'namespace'`",
              "`docs/acme.doc.mjs`"
            ],
            [
              "组件",
              "`'component'`",
              "`components/AcmeCarousel.doc.mjs`，与 `AcmeCarousel.tsx` 并列"
            ],
            [
              "模板",
              "`'page'` 或 `'block'`",
              "`templates/acme-dashboard.doc.mjs`，与 `acme-dashboard.tsx` 并列"
            ],
            [
              "主题",
              "`'theme'`",
              "`themes/ocean/oceanTheme.doc.mjs`，与 `oceanTheme.ts` 并列"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "只有指南、主题和你的文档 section 放在 `docs` 根目录中。其他类型有各自的指南：{@link namespace:components}、{@link namespace:templates} 和 {@link namespace:themes}。"
        }
      ]
    },
    {
      "section": "Keep topics in the docs root",
      "title": "将主题放在 docs 根目录中",
      "content": [
        {
          "type": "prose",
          "text": "`astryx.integration.mjs` 中的 `docs` 字段指定存放主题的文件夹。CLI 会读取该文件夹下的每个 `.doc.mjs` 文件，包括子文件夹中的文件。"
        },
        {
          "type": "code",
          "label": "astryx.integration.mjs"
        },
        {
          "type": "list",
          "items": [
            "读者通过 `name` 打开主题，而不是文件名。请按文档命名文件：`<name>.doc.mjs`，这样每个文件都容易找到。",
            "没有 `placement` 的主题是扁平主题：文档列表会将其显示在 Topics 下，读者通过名称打开它。",
            "要在文档树中创建自己的 section，请参见 {@link generic:sections-and-placement}。"
          ]
        }
      ]
    },
    {
      "section": "In global mode",
      "title": "在全局模式下",
      "content": [
        {
          "type": "prose",
          "text": "在全局模式下：当用户将你的包安装到他们的电脑上（与全局 CLI 并列）时，你的文档主题会出现在任何项目之外的文件夹中；在项目内部，只有当项目安装你的包时才会出现。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    }
  ]
};
