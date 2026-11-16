// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for field-reference.doc.mjs.
export const docsZh = {
  "title": "字段参考",
  "description": "逐个字段介绍集成作者需要编写的每个文件：集成清单、astryx.config、codemod、身份标识以及每种文档类型。使用这些文件的指南位于 {@link namespace:authoring} 的其余部分。",
  "sections": [
    {
      "section": "Astryx Integration",
      "title": "Astryx 集成清单",
      "content": [
        {
          "type": "prose",
          "text": "位于集成包的 package.json 旁边的 astryx.integration.* 清单。它可以在包重命名时保留稳定的提供方身份，并向 CLI 指明该包的组件、模板、codemod、文档主题、源主题、托管式智能体指南、问题跟踪器，以及用户运行 CLI 时使用的命令。所有字段均为可选。"
        },
        {
          "type": "prose",
          "text": "适用于：astryx.integration.{ts,mjs,js}"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "providerId",
              "string",
              "no",
              "将此包标记为其所有贡献内容来源的名称。省略该项则使用 package.json 中的包名。仅在重命名期间将其设为旧名称，以便该包已贡献内容的 ID 保持不变。如果两个包在此使用相同名称，则你正在处理的包优先；否则以 CLI 先读取到的为准，CLI 会针对另一个发出警告。示例：'@acme/widgets'。"
            ],
            [
              "components",
              "string",
              "no",
              "存放组件及其文档的文件夹，相对于 package.json。示例：'./src/components'。"
            ],
            [
              "templates",
              "string",
              "no",
              "存放模板的文件夹，相对于 package.json。示例：'./src/templates'。"
            ],
            [
              "codemods",
              "string",
              "no",
              "存放 codemod 的文件夹，相对于 package.json。示例：'./codemods'。"
            ],
            [
              "docs",
              "string",
              "no",
              "存放文档主题的文件夹，相对于 package.json。其中的每个 {topic}.doc.{ts,mjs,js} 都会出现在 `{@command docs}` 中：作为内置主题旁边的扁平主题，可设置 `replaces` 或 `extends` 来接管内置主题或对其补充；带有 `placement` 的指南则位于文档树中自己的路由下，归属于同一包的命名空间文档。示例：'./docs'。"
            ],
            [
              "themes",
              "string",
              "no",
              "存放主题的文件夹，相对于 package.json，每个主题一个文件夹。每个主题文件夹包含主题源文件以及同名的 .doc.mjs 文件。已安装的主题会出现在 `{@command theme list}` 中；`theme add` 导入其构建后的包导出，`theme eject` 创建可编辑的本地副本。示例：'./themes'。"
            ],
            [
              "agentDocs",
              "{ append?: readonly string[] }",
              "no",
              "你的包追加到 CLI 管理的智能体指令末尾的指引行。标题、标签、项目符号以及写入哪些文件均由 CLI 掌控。示例：{ append: ['Run acme verify.'] }。"
            ],
            [
              "issuesUrl",
              "string",
              "no",
              "人们为此包提交问题的位置：一个绝对 URL，例如其 GitHub issues 页面。不是 URL 的值会使整个清单加载失败；不检查协议。缺少该字段时不会有警告，但如果没有它，关于此包的 `{@command gap-report}` 会失败，除非项目或已加载的集成提供了 gapReport 处理器；并且 `{@command swizzle}` 不会为此包的组件打印反馈链接。未加载任何处理器时，github.com 的 issues URL 会在报告者传入 `--confirm-public` 后通过 GitHub CLI 提交；其他 URL 则返回给报告者自行打开。示例：'https://github.com/acme/widgets/issues'。"
            ],
            [
              "docsiteUrl",
              "string",
              "no",
              "指向此集成文档站点的链接，例如其首页。列出该包的目录可能会显示它。示例：'https://widgets.acme.dev'。"
            ],
            [
              "logo",
              "{ light: string; dark?: string }",
              "no",
              "目录在包名旁显示的方形徽标：相对于包根目录的路径，指向包随附的图像。每个图像为 PNG、JPEG 或 WebP，或仅含形状的 SVG，最大 512 KB，其扩展名（`.png`、`.jpg`、`.jpeg`、`.webp`、`.svg`）表明格式。为深色背景绘制的版本设置 `dark`；未设置时，各处均使用 `light`。`{@command integration check}` 会指出缺失、不是上述图像或未打包进包的徽标。在 SVG 中，任何属性值都不得包含 `<`、`>`、`&` 或 `\\`，因此在标签中写 `and` 而不是 `&amp;`。未设置此字段时，也会读取 package.json 的 `marketplace.logo`。示例：{ light: './marketplace/logo.svg', dark: './marketplace/logo-dark.svg' }。"
            ],
            [
              "cliCommand",
              "string",
              "no",
              "用户运行 Astryx CLI 时使用的命令（当其不是包管理器时），例如贵公司提供的封装命令。在加载你的包的应用中，CLI 打印的每条命令都以它开头，替代 `pnpm exec astryx` 或 `yarn astryx`：提示、错误、Doctor 修复建议和文档文本均如此。单行，不含子命令。如果两个已加载的包设置了不同的命令，则两者都不使用，`{@command doctor}` 会发出警告。无效值会被忽略并给出 `invalid_cli_command` 警告，清单的其余部分仍会加载。JSON 输出保持命令原样。示例：'acme astryx'。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "典型示例"
        },
        {
          "type": "prose",
          "text": "在全局模式下：当用户为计算机安装你的包（与全局 CLI 并列）时，清单以相同方式加载，随后在任何项目之外的文件夹中生效；在项目内，仅当项目安装该包时才生效。`@astryxdesign/core` 和 `@astryxdesign/cli` 的对等版本范围会对照全局 CLI 的发行版进行检查。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        },
        {
          "type": "prose",
          "text": "提供方名称默认为 package.json 中的包名。重命名期间，将 `providerId` 设为旧包名，以便该包已贡献内容的 ID 保持不变。包版本始终来自 package.json。"
        },
        {
          "type": "prose",
          "text": "`agentDocs.append` 最多可包含八行。每行是经过修剪的非空字符串，最多 240 个 Unicode 码点，不得包含行分隔符、控制字符、NUL 或 Astryx/XDS 托管标记文本。所配置的项目总共最多可包含 32 条集成行。行中的每个命令请写成裸 `astryx` 命令；托管块会在你的行之前统一说明应用如何启动 CLI。"
        },
        {
          "type": "prose",
          "text": "仅当用户使用包管理器以外的命令运行 CLI 时（例如 `acme astryx`）才设置 `cliCommand`。CLI 按以下顺序选择要打印的命令：已加载集成在指定同一命令时的 `cliCommand`，然后是宿主工具指定的命令，最后是包管理器的命令。两个不同的 `cliCommand` 值会相互抵消，`{@command doctor}` 会在其 `cli-command` 检查中发出警告。参见 `{@command docs authoring/building-blocks/configuration/cli-command}`。"
        },
        {
          "type": "prose",
          "text": "主题根目录受版本限制：较旧的 CLI 不会列出或添加其中的任何主题。取决于其版本新旧，该 CLI 可能忽略 `themes` 并给出 `unknown_manifest_key` 警告，同时加载其他所有贡献类型；或者因为它期望早期的 `manifest.json` 主题目录而将根目录报告为无效；又或者，如果它旧到将未知字段视为错误，则会拒绝整个清单，导致该包在那里不贡献任何内容。"
        },
        {
          "type": "prose",
          "text": "使用 `{@command doctor integration validate}` 验证清单。在加载边界，已知字段类型错误会报错，issuesUrl 和 docsiteUrl 必须是有效的 URL，未知字段会变为警告，以便较旧的 CLI 仍能加载它理解的字段。发布前，还请在同一 `doctor integration` 组下运行 `templates`、`components` 和 `docs`。这些叶子命令会将编写的身份标识与 Core 进行比较，并说明重叠是有意为之还是需要重命名。"
        }
      ]
    },
    {
      "section": "astryx.config",
      "title": "astryx.config",
      "content": [
        {
          "type": "prose",
          "text": "项目根目录下可选的 astryx.config.* 文件。声明要加载哪些集成、将问题链接路由到何处、codemod 之后的 Hook、本地调试日志与缺口报告处理器、发现源以及实验性布局组件。全部可选；{} 有效。"
        },
        {
          "type": "prose",
          "text": "适用于：astryx.config.{ts,mjs,js}"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "integrations",
              "string[]",
              "no",
              "与核心一起加载的 Astryx 集成的包名。示例：['@acme/astryx-widgets']。"
            ],
            [
              "issuesUrl",
              "string",
              "no",
              "关于 Core 的报告的去向：未加载处理器时，`{@command gap-report}` 会将 Core 报告路由到这里；gapReport 处理器会将其作为 `report.target.issuesUrl` 接收；`{@command swizzle}` 会将其打印为 Core 组件的反馈链接。针对集成组件的报告或 swizzle 使用该集成自己的 issuesUrl，绝不会使用此项。必须是绝对 URL；不是 URL 的值会使配置无效。默认值：'https://github.com/meta/astryx/issues/new'。"
            ],
            [
              "hooks",
              "{ postCodemod?: PostCodemodHook[] }",
              "no",
              "生命周期 Hook。"
            ],
            [
              "hooks.postCodemod",
              "PostCodemodHook[]",
              "no",
              "在 `{@command upgrade}` 更改文件后运行的命令（例如重新运行格式化程序）。每个 Hook 是一个对象 `{name?, buildCommand}`：buildCommand 接收 `{packageDir, files}` 并返回要运行的 `{command, args?, options?}`，或返回 null 跳过。试运行只打印每个命令而不执行。"
            ],
            [
              "debug",
              "(event: DebugEvent) => void",
              "no",
              "记录每次命令运行。处理器是同步的；不会等待 Promise，输出发送到 stderr。请直接在此文件中声明 `debug`，以便早期命令能够发现它。集成也可以提供，作为其清单的 `debug` 命名导出。每个处理器都会运行：先运行你的，然后按加载顺序运行每个集成的（`integrations` 列表，然后是自动链接的）。抛出异常的处理器会被跳过；其他处理器仍会运行，命令结果不变。在 package.json 中设置 `{\"astryx\": {\"inheritDebug\": false}}` 以仅采用你自己的处理器。示例：event => appendFileSync('runs.ndjson', JSON.stringify(event) + '\\n')。"
            ],
            [
              "gapReport",
              "GapReportHandler",
              "no",
              "除每个已加载的集成处理器外，还处理显式缺口报告。项目处理器先运行。公开处理器需要调用方同意；内部处理器始终运行。示例：{ audience: 'internal', async handle(report, {signal}) { return sendGap(report, {signal}); } }。"
            ],
            [
              "discover",
              "DiscoverSource",
              "no",
              "告诉 `{@command discover}` 此项目可以添加哪些集成：一个返回目录的异步函数。集成也可以提供，作为其清单的 `discover` 命名导出。discover 会调用每个源，先调用你的；一个源失败绝不会掩盖其他源。discover 只读取；由你的包管理器安装。示例：async ({signal, package: name, version}) => fetchCatalog({signal, name, version})。"
            ],
            [
              "experimental",
              "{ xle?: { components?: Record<string, XleComponent> } }",
              "no",
              "不稳定的功能；可能会在没有破坏性版本升级的情况下发生变化。"
            ],
            [
              "experimental.xle.components",
              "Record<string, XleComponent>",
              "no",
              "已移除的布局扩展器所用的自定义组件，以组件名称为键。CLI 仍会验证该字段，因此缺少字符串 `from` 的条目会使 `astryx.config` 无效，但没有任何代码读取它。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "最小示例"
        },
        {
          "type": "code",
          "label": "将每次命令运行记录到你自己的位置"
        },
        {
          "type": "prose",
          "text": "配置在加载时用严格 schema 验证：未知键（包括拼写错误）或类型错误的值会使整个文件无效。`{@command gap-report}`、`{@command discover}` 和 `{@command upgrade}` 会因该错误停止，`{@command doctor}` 的 `config` 检查会失败（退出码 1）。`component`、`docs`、`search`、`template` 和 `theme` 等读取操作会静默继续，就像没有配置和集成一样，也不会运行任何调试处理器，因此编辑文件后请运行 `{@command doctor}`。"
        }
      ]
    },
    {
      "section": "DebugEvent",
      "title": "DebugEvent",
      "content": [
        {
          "type": "prose",
          "text": "一次记录的 CLI 运行：`debug` 处理器收到的内容，无论它是在 astryx.config 中设置还是由集成清单导出。每次运行恰好一个事件，处理器看到它时所有字段都已存在。"
        },
        {
          "type": "prose",
          "text": "适用于：`debug` 处理器的参数"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "schemaVersion",
              "DebugSchemaVersion",
              "yes",
              "记录结构的版本：1、2 或 3。含义发生变化的字段会获得新版本，因此请根据此字段进行分支处理。"
            ],
            [
              "id",
              "string",
              "yes",
              "每次运行唯一。用它去重。"
            ],
            [
              "startedAt",
              "string",
              "yes",
              "运行开始的时间，采用 ISO 8601 格式。"
            ],
            [
              "endedAt",
              "string",
              "yes",
              "运行结束的时间，采用 ISO 8601 格式。"
            ],
            [
              "durationMs",
              "number",
              "yes",
              "运行所用的时长，以毫秒为单位。"
            ],
            [
              "command",
              "string",
              "yes",
              "完整命令名。astryx 未带命令运行时为空。示例：'theme build'。"
            ],
            [
              "commandPath",
              "string[]",
              "yes",
              "命令名拆分后的各个段。示例：['theme', 'build']。"
            ],
            [
              "argv",
              "string[]",
              "yes",
              "二进制之后的参数，已脱敏。"
            ],
            [
              "args",
              "Record<string, unknown>",
              "yes",
              "位置参数，以其声明的名称作为键。"
            ],
            [
              "options",
              "Record<string, unknown>",
              "yes",
              "命令选项，按 CLI 解析后的结果。"
            ],
            [
              "optionSources",
              "Record<string, DebugOptionSource>",
              "yes",
              "每个选项值的来源：'cli'、'default'、'env'、'config' 或 'implied'。键与 `options` 匹配。"
            ],
            [
              "globalOptions",
              "Record<string, unknown>",
              "yes",
              "根级标志，例如 --json、--detail 和 --lang。"
            ],
            [
              "outcome",
              "DebugOutcome",
              "yes",
              "运行的结束方式：'ok'、'error'、'parse-error'、'fatal'、'rejected' 或 'incomplete'。"
            ],
            [
              "exitCode",
              "number",
              "yes",
              "进程退出码。信号结束运行时，为 128 加信号编号。"
            ],
            [
              "signal",
              "string",
              "yes",
              "结束运行的信号，例如 'SIGINT'。否则为 null。"
            ],
            [
              "error",
              "DebugEventError",
              "yes",
              "失败信息：`name`、`message`、`code` 和 `stack`。请根据 `code` 分支，绝不要根据 `message`。未发生失败时为 null。"
            ],
            [
              "output",
              "DebugEventOutput",
              "yes",
              "运行返回的内容：JSON 模式、信封类型、结果数量和类型，以及它打印的 stdout 和 stderr（已脱敏，并在捕获上限处截断）。"
            ],
            [
              "env",
              "DebugEventEnv",
              "yes",
              "运行时信息：CLI 和 Node 版本、平台、CI、包管理器，以及命令是由人、AI 智能体还是自动化运行的。它绝不包含主机名、用户名或原始会话 ID。"
            ],
            [
              "project",
              "DebugEventProject",
              "yes",
              "命令运行所在的项目，以标志和计数表示。它绝不包含包名。"
            ],
            [
              "redacted",
              "boolean",
              "yes",
              "记录中的值是否已脱敏。处理器收到的每个事件中该值均为 true。当它为 false 时，请将日志视为敏感信息。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "将失败的运行记录到本地日志"
        },
        {
          "type": "prose",
          "text": "该结构只会增长：字段会增加，绝不会删除或赋予新含义。当必须更改含义时，`schemaVersion` 会获得新值。在版本 3 中，`output.resultKind` 为 null 表示运行从未得出答案，因此不要将其与版本 1 或 2 的 null 一起统计。"
        },
        {
          "type": "prose",
          "text": "处理器在进程退出时同步运行，因此不会等待它返回的 Promise。它获得事件的副本，其抛出的任何内容都会被忽略。"
        },
        {
          "type": "prose",
          "text": "从 @astryxdesign/cli/authoring 导入 DebugEventOutput、DebugEventEnv、DebugEventProject 和 DebugEventError，以获取 `output`、`env`、`project` 和 `error` 的字段类型。"
        }
      ]
    },
    {
      "section": "GapReportHandler",
      "title": "GapReportHandler",
      "content": [
        {
          "type": "prose",
          "text": "`{@command gap-report}` 的处理器：一个带有 `audience` 和 `handle` 函数的普通对象。可在 astryx.config 中将其设为 `gapReport`，或从集成清单将其导出为 `gapReport`。处理器会累加而非相互替换：先运行项目处理器，然后按加载顺序运行每个已加载集成的处理器（`integrations` 列表，然后是自动链接的），无论报告涉及哪个包。"
        },
        {
          "type": "prose",
          "text": "适用于：astryx.config.* 中的 `gapReport`，或 astryx.integration.* 的 `gapReport` 命名导出"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "audience",
              "'internal' | 'public'",
              "yes",
              "目标是组织内部的还是公开的。公开处理器仅在调用方同意时运行；内部处理器始终运行。"
            ],
            [
              "handle",
              "(report: GapReport, context: GapReportHandlerContext) => GapReportHandlerReceipt | Promise<GapReportHandlerReceipt>",
              "yes",
              "接收报告并返回回执。它可以是异步的，CLI 最多等待 30 秒。抛出异常、超时或回执无效均视为投递失败，其他处理器仍会运行。"
            ],
            [
              "report",
              "GapReport",
              "yes",
              "报告。每个处理器获得自己的副本。"
            ],
            [
              "report.schemaVersion",
              "1",
              "yes",
              "报告结构的版本。"
            ],
            [
              "report.component",
              "string",
              "yes",
              "缺口涉及的组件。"
            ],
            [
              "report.category",
              "GapReportCategory",
              "yes",
              "缺口的类型：'missing_component'、'missing_variant'、'layout_gap'、'styling_gap'、'a11y_gap'、'api_friction'、'docs_gap' 或 'other'。"
            ],
            [
              "report.categoryLabel",
              "string",
              "yes",
              "类别的可读名称。"
            ],
            [
              "report.intention",
              "string",
              "yes",
              "调用方当时想做什么。"
            ],
            [
              "report.detail",
              "string",
              "no",
              "更多细节（如果调用方提供了）。"
            ],
            [
              "report.source",
              "DebugInvocationSource",
              "yes",
              "报告的发送者：'human'、'ai'、'automation' 或 'unknown'。"
            ],
            [
              "report.timestamp",
              "string",
              "yes",
              "报告发送的时间，采用 ISO 8601 格式。"
            ],
            [
              "report.target",
              "GapReportTarget",
              "yes",
              "报告涉及的包。"
            ],
            [
              "report.target.package",
              "string",
              "yes",
              "包名。"
            ],
            [
              "report.target.version",
              "string",
              "yes",
              "集成在其 package.json 中的版本。对于 Core，以及 package.json 中没有版本时，为 null。"
            ],
            [
              "report.target.issuesUrl",
              "string",
              "yes",
              "包接收问题的位置。未说明时为 null。"
            ],
            [
              "context",
              "GapReportHandlerContext",
              "yes",
              "本次调用的上下文。"
            ],
            [
              "context.signal",
              "AbortSignal",
              "yes",
              "当处理器运行超过 30 秒时中止。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "astryx.config 中的项目处理器"
        },
        {
          "type": "table",
          "headers": [
            "回执字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "status",
              "'filed' | 'routed_only' | 'skipped'",
              "yes",
              "'filed'：处理器已创建或排队该报告。'routed_only'：它指向提交报告的位置，必须返回 `url`。'skipped'：它选择不采取行动，例如遇到重复报告。"
            ],
            [
              "url",
              "string",
              "no",
              "一个 http 或 https URL。当 status 为 routed_only 时必需。"
            ],
            [
              "message",
              "string",
              "no",
              "一条可读的消息，最多 2000 个字符。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "回执是严格的：未知字段、不是 http 或 https 的 URL，或既无 `url` 也无 `message` 的 filed 或 routed_only 回执，均视为无效。"
        }
      ]
    },
    {
      "section": "DiscoverSource",
      "title": "DiscoverSource",
      "content": [
        {
          "type": "prose",
          "text": "`{@command discover}` 的源：一个异步函数，返回项目可以添加的包目录、它们的版本以及每个版本新增的内容。可在 astryx.config 中将其设为 `discover`，或从集成清单将其导出为 `discover`。discover 会调用每个源（先调用项目的），然后读取 CLI 自带的官方列表；另一个源对官方包的条目会被保留。抛出异常、运行超过 30 秒或返回无效目录的源绝不会掩盖其他源；随后 discover 会使用该源对同一请求给出的最后一次有效答案，如果它未保存任何答案，则将该源报告为失败。discover 只读取：它打印添加包的命令，但绝不运行该命令。"
        },
        {
          "type": "prose",
          "text": "适用于：astryx.config.* 中的 `discover`，或 astryx.integration.* 的 `discover` 命名导出"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "context",
              "DiscoverSourceContext",
              "yes",
              "调用源时传入的唯一参数。"
            ],
            [
              "context.signal",
              "AbortSignal",
              "yes",
              "当源运行超过 30 秒时中止。"
            ],
            [
              "context.package",
              "string",
              "no",
              "当 discover 显示单个包时设置：返回该包的所有版本。"
            ],
            [
              "context.version",
              "string",
              "no",
              "与 `package` 一起使用：返回该版本的贡献内容。不提供时，返回最新发行版的贡献内容。"
            ],
            [
              "returns",
              "Promise<DiscoverCatalog>",
              "yes",
              "目录。discover 会检查它，忽略它不认识的字段和条目类型，并拒绝除 1 以外的任何 schemaVersion。"
            ],
            [
              "schemaVersion",
              "1",
              "yes",
              "目录结构的版本。"
            ],
            [
              "source",
              "{name: string, generatedAt: string, complete: boolean}",
              "yes",
              "回答者是谁、数据生成的时间（ISO 8601），以及当源知道其列表不完整时为 false。"
            ],
            [
              "packages",
              "DiscoverPackage[]",
              "yes",
              "每个 npm 包一个条目。当两个源列出同一个包时，靠前的源优先。"
            ],
            [
              "packages[].package",
              "string",
              "yes",
              "npm 名称。"
            ],
            [
              "packages[].integration",
              "string",
              "yes",
              "由发布同一集成的所有 npm 名称共享。discover 只列出集成一次。"
            ],
            [
              "packages[].aliases",
              "string[]",
              "yes",
              "该集成的其他 npm 名称。discover 绝不会提供项目已以其他名称拥有的包。"
            ],
            [
              "packages[].description",
              "string",
              "no",
              "一行说明，用于列表和搜索。"
            ],
            [
              "packages[].latest",
              "string | null",
              "yes",
              "最新发行版。仅有预发行版时为 null。"
            ],
            [
              "packages[].versions",
              "DiscoverVersion[]",
              "yes",
              "所有版本，最新的在前：`{version, publishedAt, prerelease, status}`，其中 status 为 `ok` 或该版本无法读取的原因。"
            ],
            [
              "packages[].contributions",
              "DiscoverContribution[]",
              "yes",
              "所请求（否则为最新）版本新增的内容：`{kind, name, title?, summary?, keywords?}`，其中 kind 为 `component`、`template`、`doc`、`theme`、`codemod` 或 `agent-doc`（DiscoverKind），name 是 CLI 为其使用的名称。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "astryx.config 中的项目源"
        },
        {
          "type": "prose",
          "text": "在全局模式下：为计算机安装的集成的 discover 源会在任何项目之外的文件夹中调用；在项目内，仅调用项目所安装集成的源。参见 {@link namespace:global} 和 {@link generic:global-integrations}。"
        }
      ]
    },
    {
      "section": "ExampleScope",
      "title": "ExampleScope",
      "content": [
        {
          "type": "prose",
          "text": "`@astryxdesign/cli/authoring` 中的 `previewableExample(example, scope)` 用作读取组件文档示例的 JSON 依据。`@astryxdesign/cli/api` 中的 `integrationExampleScope()` 构建 Doctor 读取包示例时使用的 scope，因此目录可以存储它，预览工具也能完全按 Doctor 的方式读取示例。将示例显示为实时预览的工具会调用它，`{@command doctor integration validate}` 使用同一规则，因此两者保持一致。`kind: 'setup'` 的示例仅是代码。其他任何示例必须能独立运行：其代码作为 TSX 模块编译；它会渲染某些内容（先是默认导出，然后是末尾的 JSX，再然后是它声明的最后一个组件）；它只导入该包、该包声明的包、React 和 Core，绝不导入相对路径或仅在服务器上运行的代码；它使用的每个名称都在其中定义、通过导入引入、在 scope 中命名，或是 JavaScript 或浏览器全局变量（元素名称只能来自示例或 scope，像 `Image` 这样的全局变量不是组件）。结果为 `{previewable: true, module}`（一个导入其使用的每个 scope 名称并默认导出其所渲染内容的模块，因此打包器可以直接构建它）、`{previewable: false, setup: true}`，或 `{previewable: false, setup: false, problems}`，每个 problem 包含 `code`（`example_does_not_compile` 带 `line` 和 `column`、`example_renders_nothing`、`example_undefined_name` 带 `names`、`example_server_only`，或 `example_import_unresolvable` 带 `specifier`）、`message` 和 `fix`。"
        },
        {
          "type": "prose",
          "text": "适用于：`previewableExample` 的第二个参数，来自 `@astryxdesign/cli/authoring`"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "packageName",
              "string",
              "yes",
              "示例所记录的包。它可以导入自身。"
            ],
            [
              "packageNames",
              "ExampleScopeName[]",
              "yes",
              "该包记录的每个组件，格式为 `{name, import}`：名称，以及应用从中导入它的说明符。其名称优先于 Core 和 React 的名称。"
            ],
            [
              "coreNames",
              "ExampleScopeName[]",
              "yes",
              "Core 记录的每个组件和 Hook。其名称优先于 React 的名称。"
            ],
            [
              "reactNames",
              "string[]",
              "yes",
              "React 的命名导出。示例也可以使用命名空间 `React`。"
            ],
            [
              "dependencies",
              "string[]",
              "yes",
              "该包在 `dependencies`、`peerDependencies` 和 `optionalDependencies` 中声明的包。始终可以导入 React 和 Core。"
            ],
            [
              "serverOnlyModules",
              "string[]",
              "no",
              "该包自身的导入说明符，其模块仅在服务器上运行：它会导入 `server-only`。每个 scope 还会计入 `server-only`、`next/headers`、`next/server`、`next/cache`，以及该包未安装的 Node 内置模块。"
            ],
            [
              "serverComponents",
              "string[]",
              "no",
              "该包记录的仅由服务器渲染的组件：异步函数组件。渲染此类组件但未导入它、也未通过导入该包来引入的示例无法预览。"
            ]
          ]
        }
      ]
    },
    {
      "section": "Astryx Codemod",
      "title": "Astryx 代码改写脚本",
      "content": [
        {
          "type": "prose",
          "text": "CLI 在 `{@command upgrade}` 期间运行的 codemod 模块。默认导出一个带有 `type` 判别字段的普通对象：'code' 重写源文件，'config' 重写 astryx.config.* 文件。没有可调用的工厂函数。"
        },
        {
          "type": "prose",
          "text": "适用于：集成包中的 `<codemods>/<version>/<id>.{ts,mjs,js}`：`<codemods>` 是 astryx.integration.* 的 codemods 根目录，`<version>` 是运行该 codemod 的升级所对应的确切 @astryxdesign/core 版本（例如 0.7.0）。直接放在根目录中的文件永远不会运行。"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "title",
              "string",
              "yes",
              "在升级输出中显示的简短、可读标题。示例：'Rename Button prop kind to variant'。"
            ],
            [
              "description",
              "string",
              "no",
              "可选的较长说明。"
            ],
            [
              "isOptional",
              "boolean",
              "no",
              "为 true 时，仅当明确请求时才运行该 codemod。默认值：false。"
            ],
            [
              "fileExtensions",
              "string[]",
              "no",
              "此 codemod 适用的文件扩展名。仅用于代码 codemod；配置 codemod 始终以 astryx.config.* 为目标。默认值：['.tsx', '.ts', '.jsx', '.js', '.mjs', '.cjs']。示例：['.tsx', '.ts']。"
            ],
            [
              "transform",
              "(file: AstryxCodemodFile, api: AstryxCodemodApi) => string | null | undefined",
              "yes",
              "转换函数。返回新源码以重写文件，或返回 null/undefined 保持不变。"
            ],
            [
              "file",
              "AstryxCodemodFile",
              "yes",
              "传给转换函数的源文件。"
            ],
            [
              "file.path",
              "string",
              "yes",
              "正在被转换的文件的绝对路径。"
            ],
            [
              "file.source",
              "string",
              "yes",
              "文件当前的源码内容。"
            ],
            [
              "api",
              "AstryxCodemodApi",
              "yes",
              "作为第二个参数传入的辅助工具和上下文。"
            ],
            [
              "api.jscodeshift",
              "unknown",
              "yes",
              "一个 jscodeshift 实例，已为该文件配置解析器。"
            ],
            [
              "api.stats",
              "(...args: unknown[]) => void",
              "yes",
              "为兼容 jscodeshift 而接受。调用不执行任何操作，升级也不会为其显示任何内容。"
            ],
            [
              "api.report",
              "(...args: unknown[]) => void",
              "yes",
              "为兼容 jscodeshift 而接受。调用不执行任何操作，升级也不会为其显示任何内容。"
            ],
            [
              "type",
              "'code' | 'config'",
              "yes",
              "文件转换变体的判别字段。若 codemod 改为重写 astryx.config.*，请使用 'config'（参见说明）。示例：'code'。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "代码 codemod（type: code）"
        },
        {
          "type": "code",
          "label": "配置 codemod（type: config）"
        },
        {
          "type": "prose",
          "text": "配置 codemod 变体（type: 'config'）携带与代码 codemod 相同的字段，但除外 fileExtensions：它始终以 astryx.config.* 文件为目标，而不是一组源文件。"
        },
        {
          "type": "prose",
          "text": "作者编写普通对象并使用 `type` 判别字段将其默认导出；没有工厂函数。CLI 在加载边界通过 parseCodemod 以严格 schema 验证它，isOptional 默认为 false。"
        }
      ]
    },
    {
      "section": "Provider and artifact identity",
      "title": "提供方与产物身份",
      "content": [
        {
          "type": "prose",
          "text": "将稳定的提供方/产物身份与包实例和运行时生命周期状态分开。提供方身份为集成清单命名并解决提供方冲突。文档树节点由文档身份标识；该树涵盖 CLI 的文档和每个集成的文档。文档树之外的种类、提供方实例和编译器输入条目的产物 ID 为每个提供方拥有的产物定义；没有命令会构建它们。"
        },
        {
          "type": "prose",
          "text": "适用于：集成清单、提供方冲突和文档树节点 ID。"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "ProviderId",
              "string",
              "yes",
              "规范的逻辑提供方 ID。默认为小写的 npm 包名；Core 使用相同模型，但不发布集成清单。"
            ],
            [
              "ArtifactId",
              "string",
              "yes",
              "提供方 ID、贡献类型和稳定产物名称的带版本序列化。每一段都使用 RFC 3986 转义。"
            ],
            [
              "DocId",
              "ArtifactId",
              "yes",
              "限于某一编写文档种类的产物 ID。导航变化不会改变它。"
            ],
            [
              "ProviderInstance",
              "{ id; providerId; packageName; packageVersion; sourceDigest }",
              "yes",
              "一个不可变的包版本和源/内容摘要。它不携带已安装、已配置、已加载、已选中或健康状态。"
            ],
            [
              "AuthoredDocEntry",
              "{ id; provider; kind; stableName; source; authored }",
              "yes",
              "规范化的编译器输入。`stableName`（其文档 ID 中的键）与编写的显示名称分开提供；源路径保持相对于包，提供方来源信息加上编写的快照不可变。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "提供方包重命名需要显式映射：ProviderInstance 可以在 packageName 变化时保留其稳定的 providerId。不会推断隐式的身份变化。"
        }
      ]
    },
    {
      "section": "Authored doc graph fields",
      "title": "编写的文档树字段",
      "content": [
        {
          "type": "prose",
          "text": "每种编写的文档类型都可以为文档树声明以下字段：`placement`、`stability`，以及两个保留字段 `aliases` 和 `audience`。文档树会为每个指南和命名空间文档读取 `placement`，包括 CLI 的和每个集成的。目前没有任何代码读取 `aliases` 或 `audience`：设置其中之一的参考主题会加载失败（无论是否放置在文档树中），其他文档类型则接受并忽略它们。"
        },
        {
          "type": "prose",
          "text": "适用于：每种编写文档类型的 .doc.mjs 对象。主题描述符不接受这些字段中的任何一个。"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "placement",
              "DocPlacement",
              "no",
              "指定文档在文档树中的唯一父级：同一包的命名空间、它的一个槽位以及顺序。会为每个指南（CLI 的和每个集成的）以及每个命名空间文档读取：带有 `placement` 的指南会在树中获得路由，而不是扁平主题名，并且不能同时设置 `replaces` 或 `extends`；带有 `placement` 的命名空间文档会嵌套在该父级下。在 CLI 自己的主题目录中，设置该字段的主题会加载失败：CLI 将其指南保存在自己的文档树目录中。命令、API 函数、schema 和枚举不设置它：文档树按各自的 `namespace` 接纳它们。"
            ],
            [
              "placement.parent",
              "string",
              "yes",
              "父命名空间：同一包中的 `namespace:<name>`。"
            ],
            [
              "placement.slot",
              "string",
              "no",
              "父命名空间声明的槽位；它必须接受此文档的类型。父级只有一个槽位时可选。"
            ],
            [
              "placement.order",
              "number",
              "no",
              "槽位内的整数同级顺序。没有顺序的文档排在有序文档之后，并按标题排序。同一顺序还决定每个文档的“上一个”和“下一个”链接。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "保留：文档树将保持解析到此文档的先前名称或路由，而不会创建另一个身份。目前没有任何代码读取它，设置它的主题会加载失败。"
            ],
            [
              "audience",
              "'public' | 'internal'",
              "no",
              "保留：哪个文档包包含此文档（省略时为 'public'）。目前没有任何代码读取它，设置它的主题会加载失败。默认值：'public'。"
            ],
            [
              "stability",
              "'experimental'",
              "no",
              "标记实验性表面的文档：其形状仍可能在任何补丁版本中变化或消失。命令的帮助会将其显示为 `[experimental]`。文档自身文本仍会说明这一点。稳定表面请省略该字段。"
            ]
          ]
        },
        {
          "type": "prose",
          "text": "未知字段：`component`、`function`、`generic`、`schema`、`command` 和 `enum` 文档接受它们不认识的字段，并且没有任何代码读取它，因此为较新 CLI 编写的文档仍可在这里加载。`page`、`block` 和 `namespace` 文档会拒绝未知字段，`theme` 描述符也是如此。所有文档中的节和内容块都会拒绝未知字段。"
        }
      ]
    },
    {
      "section": "ComponentDoc",
      "title": "ComponentDoc",
      "content": [
        {
          "type": "prose",
          "text": "组件目录中 {Name}.doc.mjs 的文档类型。它是 SingleComponentDoc（属性直接放在文档上）、MultiComponentDoc（`components` 数组）和 SubComponentDoc（`subComponentOf` 指针）的判别联合。三者共享下面的 ComponentBaseDoc 字段；变体由你设置 props / components / subComponentOf 中的哪一个来决定。"
        },
        {
          "type": "prose",
          "text": "适用于：{Name}.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'component'",
              "no",
              "带标记默认导出格式的文档类型判别字段。可选：旧式 `export const docs = {...}` 文档省略它，解析器会回退到形状探测。"
            ],
            [
              "name",
              "string",
              "yes",
              "不带 Astryx 前缀的稳定机器身份，采用 PascalCase。例如 'Button'、'TextInput'、'AppShell'。对于集成组件，它是应用导入的导出名：文档位于导出该组件的文件旁边，当该文件没有以其自身名称导出任何内容时，`name` 可以指代它实际拥有的导出。要编辑可见标签，请更改 `displayName`，而不是 `name`；registry URL 默认由此身份派生。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的显示名称，单词之间用空格（'AppShell' → 'App Shell'）。驱动 docsite 图库和侧边栏标签。"
            ],
            [
              "registry",
              "RegistryDocIdentity",
              "no",
              "可选的公共 registry 身份。转换器从 `name` 派生稳定的 kebab-case 短标识；仅在需要覆盖时才设置 `slug`，发布后重命名时请将先前的相对路径保留在 `aliases` 中。"
            ],
            [
              "import",
              "string",
              "no",
              "使用者导入集成拥有的组件时使用的确切公共包说明符。打包包检查会解析此说明符，并验证它导出了组件名称。"
            ],
            [
              "replaces",
              "string",
              "no",
              "仅用于集成组件：此组件为无修饰查找而接管的 Core ComponentDoc 的确切 `name`，因此每个加载该集成的应用都能从组件详情、组件列表、搜索、`swizzle <Name>` 和问题路由中获得它；`swizzle --list` 仍会列出 Core 名称。使用 `--package @astryxdesign/core` 仍可访问 Core 原始组件。仅当包的对等版本范围从应用它的发行版开始（\"@astryxdesign/cli\": \">=0.6.7\" 或更高）时才生效；范围较低时不发生任何变化，且 `doctor integration components` 会发出警告（{@link generic:replace-a-core-component}）。仅在有意拥有某个 Core 身份时才设置它；替代方案或变体请改为赋予自己的名称。"
            ],
            [
              "deprecated",
              "{replacement: string; description: string}",
              "no",
              "标记已弃用的组件：它继续工作并保留文档，同时标注替代者。`replacement` 是应改用的已记录组件的 `name`；`description` 用一两句话说明现代化路径。docsite 会在组件页面标题和索引卡片中显示“已弃用”徽章，标记其搜索结果，并添加链接到替代者的提示；`astryx search` 结果和 `astryx build` 套件条目会携带该字段。未弃用的组件请省略该字段。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "用于 CLI 发现的搜索关键词：来自其他设计系统（MUI、Chakra、Radix 等）的同义词和相关 UI 概念。小写。`astryx search` 会匹配它们；`astryx component <term>` 也会按关键词推荐 Core 组件。"
            ],
            [
              "hiddenComponents",
              "string[]",
              "no",
              "要从面向人的 UI（CLI 列表、文档目录）中隐藏的子组件名称。它们仍是公开且可导入的；智能体和工具仍可通过源码发现它们。在集成中，它仅隐藏此文档 `components` 中的完整条目，CLI 随后既不会列出也不会打开它们；对于拥有自己文档的子组件，请在该文档中使用 `hidden` 隐藏。"
            ],
            [
              "hidden",
              "boolean",
              "no",
              "从面向人的 UI 中隐藏整个组件。它仍是公开且可导入的。适用于仅在父级内部才有意义的共享基础组件。"
            ],
            [
              "group",
              "string",
              "no",
              "可选的侧边栏/文档分组。将相关组件聚在一起；未分组组件按字母顺序平铺显示。"
            ],
            [
              "category",
              "'Action' | 'Chat' | 'Container' | 'Content' | 'Form Controls' | 'Data Input' | 'Data Visualization' | 'Feedback & Status' | 'Layout' | 'Navigation' | 'Overlay' | 'Table & List' | 'Utility'",
              "no",
              "概述图库类别，表示组件的功能角色。独立于 `group`（后者用于侧边栏）。`Data Input` 是 `Form Controls` 的已弃用兼容别名。"
            ],
            [
              "isHiddenFromOverview",
              "boolean",
              "no",
              "从分类概述页面排除，同时将组件保留在侧边栏和 CLI 中。适用于子组件或内部基础组件。"
            ],
            [
              "theming",
              "{ container?: boolean; targets: ComponentThemingTarget[]; vars?: ComponentThemingVar[]; derived?: ComponentThemingDerivedVar[]; componentIcons?: ComponentIconSlotDoc[] }",
              "no",
              "主题配置：稳定的选择器表面（astryx-* 类名 + data 属性映射），主题通过 defineTheme 中的 @scope 选择器定位它。"
            ],
            [
              "theming.container",
              "boolean",
              "no",
              "标记容器组件。目前没有任何代码读取它：主题管道通过 `theming.derived` 条目 `{property: 'padding', expand: 'container'}` 将 `padding` 映射到容器令牌。"
            ],
            [
              "theming.targets",
              "ComponentThemingTarget[]",
              "yes",
              "此组件渲染的选择器目标。每个条目对应源码中的一次 themeProps() 调用。"
            ],
            [
              "theming.vars",
              "ComponentThemingVar[]",
              "no",
              "为主题公开的 CSS 自定义属性。"
            ],
            [
              "theming.derived",
              "ComponentThemingDerivedVar[]",
              "no",
              "将标准 CSS 属性映射到内部变量，供主题管道展开。按优先级排序：靠前的条目先输出。管道只读取 Core 组件的条目，因此集成的不起作用。"
            ],
            [
              "theming.componentIcons",
              "ComponentIconSlotDoc[]",
              "no",
              "组件的图标槽位，主题通过 `defineTheme({componentIcons})` 映射它们：每个槽位的名称、角色、各状态的回退值、槽函数接收的状态，以及 `null` 的作用。每个条目对应 `ComponentIconSlotMap` 中的一个槽位。"
            ],
            [
              "usage",
              "UsageDoc",
              "no",
              "组件用法文档：简明摘要、最佳实践、组件特定的无障碍要求以及可选的可视结构图。组件文档中必需；子组件文档（`subComponentOf`）中可选，后者改用其 description。"
            ],
            [
              "usage.description",
              "string",
              "yes",
              "用 2-3 个短句说明组件是什么以及何时使用它。"
            ],
            [
              "usage.bestPractices",
              "ComponentBestPractice[]",
              "no",
              "3-4 条“应/不应”设计指引条目（{guidance: boolean, description: string}）。description 切勿以 'Do' 或 'Don't' 开头。"
            ],
            [
              "usage.accessibility",
              "ComponentAccessibilityRequirement[]",
              "no",
              "组件特定要求，显示在共享的“无障碍”选项卡中。请以约七年级阅读水平、使用短句、常用词和主动语态撰写。对于颜色对比度，将比值放在 `requirement` 中；在 `description` 中指明确切的前景、背景、状态和任何叠加层；用平实语言解释例外；并向人或智能体提供足够细节以重现检查。仓库审计流程请保留在 wiki 评分标准中。"
            ],
            [
              "usage.accessibilityThemeCoverage",
              "ComponentAccessibilityThemeCoverage[]",
              "no",
              "已验证的各主题无障碍测量结果，显示在共享的“无障碍”选项卡中。分别记录浅色和深色模式，包含渲染后的颜色对，并标记未通过的测量。将排除在审计之外的可视元素放入 `notMeasured` 并附简短原因；不要将它们作为表格测量添加。每个主题为测量值声明 `applicability`，依据组件契约，绝不从比值推断：`Conditional` 仅在某些上下文中必需，`Supplemental` 增加另一个有意义的线索，`Decorative` 没有必需含义。这些值不会改变行的状态。当一个单元格汇总多个组合时，请提供完整分解，并用自动审计保护派生值。"
            ],
            [
              "usage.anatomy",
              "ComponentAnatomyElement[]",
              "no",
              "按阅读顺序排列的结构/视觉部分（{name, required, description}）。"
            ],
            [
              "examples",
              "ComponentExampleDoc[]",
              "no",
              "简短的代码示例（{label?, code, kind?}），由 CLI 在属性表之后渲染。`kind` 为 `'demo'`（默认；可渲染为实时预览）或 `'setup'`（作为代码显示，绝不实时渲染）。"
            ],
            [
              "playground",
              "ComponentPlaygroundConfig",
              "no",
              "交互式预览配置：初始属性 `defaults`、仅模态组件的 `overlay`、受 AppShell 移动端上下文限制的组件的 `appShellMobile`，以及依赖上下文的子组件的 `wrapper`。"
            ],
            [
              "props",
              "ComponentPropDoc[]",
              "no",
              "SingleComponentDoc 变体（在该变体中必需）：唯一的首要组件的所有公开属性。每个属性为 {name, type, description, default?, required?, slotElements?, stability?}。跳过 xstyle/className/style 等样式属性。SubComponentDoc 中也会出现。"
            ],
            [
              "components",
              "(ComponentEntry | ComponentRef)[]",
              "no",
              "MultiComponentDoc 变体（在该变体中必需）：该目录导出的每个公开组件/Hook 一个条目。每个条目要么是完整的 ComponentEntry（内联：name、displayName、description、props | params+returns），要么是仅含名称、指向同级 {Name}.doc.mjs 的 ComponentRef。在集成中，`import` 指定的模块所导出的每个完整条目都是以其自身名称命名的组件。"
            ],
            [
              "subComponentOf",
              "string",
              "no",
              "SubComponentDoc 变体（在该变体中必需）：父组件的 `name`（例如 'Chat'）。将此文件标记为子组件文档。CLI 不会从父组件向集成的子组件复制家族字段（group、category、keywords、theming、playground）：其详情、列表分组和搜索只使用自身文档设置的内容。子组件需要的任何字段请在其自己的文档中设置。"
            ],
            [
              "description",
              "string",
              "no",
              "SubComponentDoc 变体（在该变体中必需）：用一句话说明子组件在父级组合中的角色。Single/Multi 文档没有顶层 description；它们从 `usage` 派生摘要。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "SingleComponentDoc（属性放在文档上）"
        },
        {
          "type": "code",
          "label": "MultiComponentDoc（components 数组）"
        },
        {
          "type": "prose",
          "text": "加载时，带标记的组件文档的检查宽松程度与未标记文档大致相同，因此向遵循该类型的文档添加 `type: 'component'` 绝不会使其失效：`displayName` 可以缺失，`category` 可以是任意字符串，不检查 `usage`、`theming` 和 `playground`，`examples` 只需是数组。与未标记文档不同的是，组文档 `components` 中的每个条目必须具有 `name`，且 `import` 和 `replaces`（若设置）必须是非空字符串。无论如何都请按类型编写；它就是契约。"
        },
        {
          "type": "prose",
          "text": "ComponentDoc 是三种形状的判别联合，它们都扩展 ComponentBaseDoc。根据你设置的键选择变体：`props`（单组件）、`components`（多组件）或 `subComponentOf`（子组件）。"
        },
        {
          "type": "list",
          "items": [
            "SingleComponentDoc：一个首要组件；通过 `props` 将属性直接放在文档上。适用于 Switch、Badge、Spinner、TextInput。",
            "MultiComponentDoc：导出多个组件/Hook 的目录；在 `components` 中列出它们（内联 ComponentEntry 或仅名称的 ComponentRef）。适用于 Table、Dialog、TabList。",
            "SubComponentDoc：父目录内自己的 {Name}.doc.mjs 中的单个子组件；将 `subComponentOf` 设为父组件名称。它不继承父级的家族字段，并且可以省略 `usage`。"
          ]
        },
        {
          "type": "code",
          "label": "SubComponentDoc"
        },
        {
          "type": "prose",
          "text": "带标记的格式是 `export default { type: 'component', ... }`，由 `astryx integration add component` 写入；旧式文档使用 `export const docs = {...}` 并省略 `type`（解析器会进行形状探测）。属于组件 API 的 Hook 会列在 MultiComponentDoc 的 `components` 数组中：以内联 ComponentEntry 形式（带 `params`/`returns`），或以名称引用其自己的 SubComponentDoc 文件，就像 Core 的 useTableSelection 那样。"
        }
      ]
    },
    {
      "section": "HookDoc",
      "title": "HookDoc",
      "content": [
        {
          "type": "prose",
          "text": "独立 React Hook（例如 useMediaQuery、useFocusTrap、useOverflow）的文档类型，它拥有自己的 `.doc.mjs`。属于组件 API 的 Hook（例如 useImperativeDialog）应改为放在该组件的 MultiComponentDoc `components` 数组中。`HookDoc` 是共享 `type: 'function'` 类型的 Hook 风格视图。`astryx hook` 只读取 Core 的 Hook 文档；集成在其组件文档的 `components` 数组中列出其 Hook。"
        },
        {
          "type": "prose",
          "text": "适用于：{useX}.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'function'",
              "no",
              "文档类型判别字段（与 FunctionDoc 共享）。旧式 `export const docs = {...}` 文档省略它。"
            ],
            [
              "name",
              "string",
              "yes",
              "与导出完全一致的稳定 Hook 名称，例如 'useMediaQuery'、'useFocusTrap'。要编辑可见标签，请更改 `displayName`，而不是 `name`；registry URL 默认由此身份派生。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的显示名称。Hook 以原始标识符（'useMediaQuery'）阅读比加空格更好，因此请原样保留标识符。"
            ],
            [
              "registry",
              "RegistryDocIdentity",
              "no",
              "可选的公共 registry 身份。转换器从 `name` 派生稳定的 kebab-case 短标识；仅在需要覆盖时才设置 `slug`，发布后重命名时请将先前的相对路径保留在 `aliases` 中。"
            ],
            [
              "group",
              "string",
              "no",
              "可选的侧边栏/文档组织分组；与 ComponentDoc.group 相同。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "用于 CLI 发现的搜索关键词。"
            ],
            [
              "params",
              "HookParamDoc[]",
              "yes",
              "Hook 参数或选项对象字段。"
            ],
            [
              "params[].name",
              "string",
              "yes",
              "参数或选项字段名称。"
            ],
            [
              "params[].type",
              "string",
              "yes",
              "TypeScript 类型签名（字符串形式）。"
            ],
            [
              "params[].description",
              "string",
              "yes",
              "此参数的作用。1-2 句话。"
            ],
            [
              "params[].default",
              "string",
              "no",
              "默认值（字符串形式），如果可选且有默认值。"
            ],
            [
              "params[].required",
              "boolean",
              "no",
              "必需时为 true。可选时省略。"
            ],
            [
              "returns",
              "HookReturnDoc[]",
              "yes",
              "返回值文档。对于对象返回值，列出每个字段；对于原始值返回，使用单个条目。"
            ],
            [
              "returns[].name",
              "string",
              "yes",
              "返回对象上的字段名，或原始值返回时的 'value'。"
            ],
            [
              "returns[].type",
              "string",
              "yes",
              "TypeScript 类型。"
            ],
            [
              "returns[].description",
              "string",
              "yes",
              "此返回值提供的内容。"
            ],
            [
              "usage",
              "UsageDoc",
              "yes",
              "用法文档：说明和最佳实践。"
            ],
            [
              "usage.description",
              "string",
              "yes",
              "用 2-3 个短句说明该 Hook 是什么以及何时使用它。"
            ],
            [
              "usage.bestPractices",
              "ComponentBestPractice[]",
              "no",
              "3-4 条“应/不应”设计指引条目（{guidance: boolean, description: string}）。"
            ],
            [
              "usage.accessibility",
              "ComponentAccessibilityRequirement[]",
              "no",
              "使用该 Hook 特有的无障碍要求（{name, description}）。"
            ],
            [
              "usage.anatomy",
              "ComponentAnatomyElement[]",
              "no",
              "结构/视觉结构元素（Hook 很少使用）。"
            ],
            [
              "relatedComponents",
              "string[]",
              "no",
              "此 Hook 常与之搭配使用的组件名称。支持交叉引用（例如 `astryx hook useToast` 会链接回 Toast）。"
            ],
            [
              "relatedHooks",
              "string[]",
              "no",
              "此 Hook 常与之搭配使用的其他 Hook 名称。"
            ],
            [
              "importPath",
              "string",
              "no",
              "导入路径，例如 '@astryxdesign/core/hooks' 或 '@astryxdesign/core/Toast'。"
            ],
            [
              "category",
              "string",
              "no",
              "用于列表分组显示的类别。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "独立 Hook 文档"
        },
        {
          "type": "prose",
          "text": "`parseDoc` 接受没有 `displayName` 的带标记 Hook 文档，并且不检查其 `usage`，`astryx hook` 打印 Hook 文档时则完全不检查。无论如何都请按类型编写；它就是契约。"
        },
        {
          "type": "prose",
          "text": "Hook 的判别字段是 `type: 'function'`：HookDoc 和 FunctionDoc 共享泛化的函数类型。HookDoc 是 Hook 风格视图：具有命名的 `returns` 字段和必需的 `usage` 块。"
        },
        {
          "type": "prose",
          "text": "属于组件 API 的 Hook 会列在该组件的 MultiComponentDoc `components` 数组中：以内联形式带 `params`/`returns`，或以名称引用其自己的 SubComponentDoc 文件，就像 Core 的 useTableSelection 那样。"
        }
      ]
    },
    {
      "section": "FunctionDoc",
      "title": "FunctionDoc",
      "content": [
        {
          "type": "prose",
          "text": "泛化的 `type: 'function'` 文档类型，同时覆盖 React Hook 和 CLI/API 函数。Hook（HookDoc）是同一类型的 Hook 风格视图；FunctionDoc 增加了 API 函数需要的字段（{type, data} 返回信封、抛出的错误码、包装它的 CLI 命令）。CLI 绑定本身位于单独的 CommandDoc 中。"
        },
        {
          "type": "prose",
          "text": "适用于：api/<dir>/<name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'function'",
              "no",
              "文档类型判别字段（与 Hook 共享）。"
            ],
            [
              "name",
              "string",
              "yes",
              "导出名称，例如 'search' | 'useMediaQuery'。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的显示名称，例如 'search()'。"
            ],
            [
              "kind",
              "'hook' | 'api'",
              "no",
              "哪种风格。目前没有任何代码读取它：没有读取器按它划分文档，也不会从 `importPath` 推断它。CLI 的 API 函数文档设置为 'api'。"
            ],
            [
              "summary",
              "string",
              "no",
              "单行摘要。"
            ],
            [
              "description",
              "string",
              "no",
              "较长的说明。"
            ],
            [
              "namespace",
              "string",
              "no",
              "在类型中可选，但 CLI 发布的每个文档都声明它。读取此文档的分组。CLI 的 API 函数使用 'cli/api'，文档树按类型接纳：每个都是叶子 `cli/api/functions/<name>`，名称为 kebab case（`themeUse` 是 `theme-use`）。CLI 发布的每个函数文档都声明一个，`astryx doctor` 会对缺失或没有任何代码读取的文档报错。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "保留：此文档的其他名称。目前没有任何代码读取它，因此它们不会解析到此文档。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "用于发现的搜索关键词。"
            ],
            [
              "importPath",
              "string",
              "no",
              "导入路径，例如 '@astryxdesign/cli/api' | '@astryxdesign/core/hooks'。"
            ],
            [
              "signature",
              "string",
              "no",
              "完整的签名（字符串形式），例如 'search(query, options?): Promise<SearchResponse>'。"
            ],
            [
              "params",
              "HookParamDoc[]",
              "yes",
              "参数 / 选项对象字段。"
            ],
            [
              "params[].name",
              "string",
              "yes",
              "参数或选项字段名称。"
            ],
            [
              "params[].type",
              "string",
              "yes",
              "TypeScript 类型签名（字符串形式）。"
            ],
            [
              "params[].description",
              "string",
              "yes",
              "此参数的作用。1-2 句话。"
            ],
            [
              "params[].default",
              "string",
              "no",
              "默认值（字符串形式），如果可选且有默认值。"
            ],
            [
              "params[].required",
              "boolean",
              "no",
              "必需时为 true。可选时省略。"
            ],
            [
              "returns",
              "FunctionReturnDoc[]",
              "yes",
              "返回值文档。Hook 列出命名的返回字段（设置了 `name`）；API 函数列出 {type, data} 信封条目，其中 `type` 是响应判别字段，`name` 省略。"
            ],
            [
              "returns[].name",
              "string",
              "no",
              "字段名称（Hook）；API 信封条目请省略。"
            ],
            [
              "returns[].type",
              "string",
              "yes",
              "TS 类型（Hook）或响应类型判别字段（API），以字符串形式。"
            ],
            [
              "returns[].description",
              "string",
              "yes",
              "此返回值 / 信封条目提供的内容。"
            ],
            [
              "throws",
              "FunctionThrowsDoc[]",
              "no",
              "函数抛出的错误（API 函数），以 ERROR_CODES 为键。"
            ],
            [
              "throws[].code",
              "string",
              "yes",
              "抛出的 ERROR_CODES 成员。"
            ],
            [
              "throws[].when",
              "string",
              "yes",
              "抛出该错误的条件。"
            ],
            [
              "examples",
              "FunctionExampleDoc[]",
              "no",
              "用法示例。"
            ],
            [
              "examples[].label",
              "string",
              "no",
              "显示在代码片段上方的可选标题。"
            ],
            [
              "examples[].code",
              "string",
              "yes",
              "语言层面的用法，例如 \"await search('button')\"。"
            ],
            [
              "examples[].result",
              "string",
              "no",
              "可选的示例结果。"
            ],
            [
              "examples[].kind",
              "'demo' | 'setup'",
              "no",
              "`'demo'`（默认）可渲染为实时预览；`'setup'` 作为代码显示，绝不实时渲染。"
            ],
            [
              "usage",
              "UsageDoc",
              "no",
              "用法文档（Hook）：说明、最佳实践、无障碍要求和结构图。形状与 HookDoc.usage 相同。"
            ],
            [
              "command",
              "string",
              "no",
              "包装此函数的 CLI 命令，例如 'search'。"
            ],
            [
              "related",
              "string[]",
              "no",
              "相关的函数名称；CLI 会将每个链接到其文档。CLI 命令请通过 `command` 指定，而不是这里。"
            ],
            [
              "relatedComponents",
              "string[]",
              "no",
              "此函数常与之搭配使用的组件名称（Hook）。"
            ],
            [
              "relatedHooks",
              "string[]",
              "no",
              "此函数常与之搭配使用的其他 Hook 名称（Hook）。"
            ],
            [
              "category",
              "string",
              "no",
              "用于列表分组显示的类别。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "API 函数文档（信封返回，无字段名称）"
        },
        {
          "type": "prose",
          "text": "`parseDoc` 接受没有 `displayName` 的带标记函数文档，并且不检查其 `usage`，CLI 读取自己的函数文档时也不检查。无论如何都请按类型编写；它就是契约。"
        },
        {
          "type": "prose",
          "text": "两种风格的 `type` 判别字段都是 'function'。`kind: 'hook'` 或 `kind: 'api'` 指定风格；目前没有任何代码读取它。"
        },
        {
          "type": "prose",
          "text": "两种风格在 `returns` 上不同：Hook 列出命名字段（设置了 `name`），而 API 函数列出 {type, data} 信封条目，其 `type` 是响应判别字段，`name` 省略。`throws`（以 ERROR_CODES 为键）适用于 API 函数。"
        },
        {
          "type": "prose",
          "text": "函数本身不知道它有一个 CLI。终端绑定（参数、标志、退出码）位于单独的 CommandDoc 中，通过 `fn` 引用此函数；这里只需通过 `command` 注明包装命令的名称。"
        }
      ]
    },
    {
      "section": "CommandDoc",
      "title": "CommandDoc",
      "content": [
        {
          "type": "prose",
          "text": "CLI 命令的文档类型：操作的终端绑定。命令不是自己的行为；它是暴露在 CLI 上的 FunctionDoc，通过 `fn` 引用，仅携带 CLI 表面的事实（参数、标志、子命令、示例、退出码）。`defineCommand` 转换器将其转化为 Commander 配置 + `--help`。"
        },
        {
          "type": "prose",
          "text": "适用于：clients/cli/commands/<name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'command'",
              "no",
              "文档类型判别字段。将此文件标记为命令文档。"
            ],
            [
              "name",
              "string",
              "yes",
              "命令路径，例如 'search' | 'theme build'。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的显示名称，例如 'astryx search'。"
            ],
            [
              "summary",
              "string",
              "yes",
              "单行摘要 → Commander `.description()` + 文档列表。"
            ],
            [
              "description",
              "string",
              "no",
              "较长的正文 / 何时使用。`astryx docs` 在摘要之后打印它；`--help` 只显示摘要。"
            ],
            [
              "namespace",
              "string",
              "no",
              "在类型中可选，但 CLI 发布的每个文档都声明它。读取此文档的分组。CLI 的命令使用 'cli/commands'，文档树会接纳：每个都是叶子 `cli/commands/<name>`，空格替换为连字符（`theme build` 是 `cli/commands/theme-build`）。CLI 发布的每个命令文档都声明一个，`astryx doctor` 会对缺失或没有任何代码读取的文档报错。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "保留：此文档的其他名称。目前没有任何代码读取它，因此它们不会解析到此文档。"
            ],
            [
              "fn",
              "string",
              "no",
              "此命令包装的 FunctionDoc（以及 `@astryxdesign/cli/api` 导出）的名称。示例：'search'。"
            ],
            [
              "args",
              "CommandArgDoc[]",
              "no",
              "位置参数。"
            ],
            [
              "args[].name",
              "string",
              "yes",
              "参数名称。"
            ],
            [
              "args[].param",
              "string",
              "no",
              "此参数绑定到的 FunctionDoc 参数；当参数没有说明时，`astryx docs` 显示该参数的说明。"
            ],
            [
              "args[].description",
              "string",
              "no",
              "覆盖说明。`--help` 仅在参数设置了此项时才显示其说明。"
            ],
            [
              "args[].required",
              "boolean",
              "no",
              "位置参数是否必须提供。"
            ],
            [
              "args[].variadic",
              "boolean",
              "no",
              "参数是否收集可变数量的值。"
            ],
            [
              "options",
              "CommandOptionDoc[]",
              "no",
              "标志/选项。"
            ],
            [
              "options[].flag",
              "string",
              "yes",
              "Commander 标志规范，例如 '-l, --limit <n>' | '--json'。"
            ],
            [
              "options[].param",
              "string",
              "no",
              "此标志映射到的 FunctionDoc 参数（继承其说明）。"
            ],
            [
              "options[].description",
              "string",
              "no",
              "覆盖/显式说明。没有任何要求：既没有此项也没有 `param` 的标志不显示说明。"
            ],
            [
              "options[].choices",
              "string[]",
              "no",
              "标志的允许值。"
            ],
            [
              "options[].default",
              "string | boolean | string[]",
              "no",
              "默认值：字符串、布尔值或字符串列表。"
            ],
            [
              "options[].cliOnly",
              "boolean",
              "no",
              "对于没有函数参数的 CLI 专用标志（例如 --verbose）为 true。没有任何代码读取它。"
            ],
            [
              "subcommands",
              "string[]",
              "no",
              "子命令名称（用于 `theme` / `layout` 等命令组）。"
            ],
            [
              "examples",
              "CommandExampleDoc[]",
              "no",
              "终端示例。"
            ],
            [
              "examples[].label",
              "string",
              "no",
              "显示在调用上方的可选标题。"
            ],
            [
              "examples[].cli",
              "string",
              "yes",
              "完整的终端调用，例如 'astryx search button --json'。"
            ],
            [
              "examples[].output",
              "string",
              "no",
              "可选的示例输出。"
            ],
            [
              "exitCodes",
              "{ code: number; when: string }[]",
              "no",
              "文档化的退出码。"
            ],
            [
              "exitCodes[].code",
              "number",
              "yes",
              "进程退出码。"
            ],
            [
              "exitCodes[].when",
              "string",
              "yes",
              "产生此退出码的条件。"
            ],
            [
              "outsideProject",
              "'same' | 'refuse' | 'own'",
              "no",
              "命令在项目之外的行为。`same`：它在新项目中给出的答案。`refuse`：它不写入任何内容并失败，同时指明它需要的应用项目或集成包。`own`：其他行为。每个 `refuse` 和 `own` 命令还在其 `notes` 中带有 `In global mode:` 说明，准确告诉读者它会做什么。每个命令和子命令都声明一个，`astryx manifest` 会发布它；仅用于分组子命令的命令不声明。CLI 测试会在空文件夹中运行每个命令，并对照此值检查其行为；`astryx doctor` 不检查它。"
            ],
            [
              "deprecated",
              "string",
              "no",
              "弃用通知——一个 DEP-* id 和替代者。"
            ],
            [
              "related",
              "string[]",
              "no",
              "相关的命令名称。"
            ],
            [
              "notes",
              "ReferenceContentBlock[]",
              "no",
              "自由形式的正文/备注。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "包装 search() 函数的命令"
        },
        {
          "type": "prose",
          "text": "命令仅携带 CLI 表面的事实。行为、参数、返回值和抛出的错误位于它通过 `fn` 指向的 FunctionDoc 中；函数本身不知道它有一个 CLI。"
        },
        {
          "type": "prose",
          "text": "通过 `param` 将参数/选项绑定到函数参数，使其继承该参数的说明：选项的说明会在 `--help` 和 `astryx docs` 中显示，参数的说明仅在 `astryx docs` 中显示。对于没有函数参数的标志（例如 `--verbose`），标记 `cliOnly: true` 并给它自己的 `description`；两者都不检查。`--json` 是全局标志，因此命令文档不声明它。"
        }
      ]
    },
    {
      "section": "EnumDoc",
      "title": "EnumDoc",
      "content": [
        {
          "type": "prose",
          "text": "封闭词汇表的文档类型：一组固定的字面量值，例如错误码或响应类型判别字段。与其所记录的事实来源一起放在旁边的 `.doc.mjs` 中。只有 CLI 会读取枚举文档，且仅从其自身源码读取：集成文档目录中的枚举文档会加载失败，该包的其他文档也会如此。"
        },
        {
          "type": "prose",
          "text": "适用于：<enum>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'enum'",
              "no",
              "文档类型判别字段。在类型中可选，但 CLI 仅在其设置时才将文档读取为枚举文档；没有它，文档会从文档树中掉出。"
            ],
            [
              "name",
              "string",
              "yes",
              "URL 安全的标识符，用作其命名空间内的文档 slug。示例：'error-codes'。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的标题。示例：'Error Codes'。"
            ],
            [
              "description",
              "string",
              "yes",
              "列表中显示的单行摘要。"
            ],
            [
              "namespace",
              "string",
              "no",
              "在类型中可选，但 CLI 发布的每个文档都声明它。读取此文档的分组。CLI 的枚举使用 'cli/api'，文档树按类型接纳：每个都是叶子 `cli/api/enums/<name>`。CLI 发布的每个枚举文档都声明一个，`astryx doctor` 会对缺失或没有任何代码读取的文档报错。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "保留：此文档的备用 slug。目前没有任何代码读取它，因此 `astryx docs <alias>` 不会打开它。"
            ],
            [
              "members",
              "EnumMemberDoc[]",
              "yes",
              "枚举成员：每个字面量值一个条目。"
            ],
            [
              "members[].value",
              "string",
              "yes",
              "字面量值，例如 'ERR_UNKNOWN_TOPIC' | 'component.list'。"
            ],
            [
              "members[].description",
              "string",
              "yes",
              "该值的含义 / 何时出现。"
            ],
            [
              "members[].deprecated",
              "string",
              "no",
              "弃用原因（如果已弃用）。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "错误码枚举文档"
        },
        {
          "type": "prose",
          "text": "枚举文档是源码中其他地方定义的封闭词汇表的人类可读镜像（例如 ERROR_CODES 映射或响应类型联合）。请保持成员与该事实来源同步。"
        },
        {
          "type": "prose",
          "text": "用 `deprecated`（迁移提示）标记值，而不是删除它，这样旧代码仍保留文档，同时读者会被指向替代者。"
        }
      ]
    },
    {
      "section": "NamespaceDoc",
      "title": "NamespaceDoc",
      "content": [
        {
          "type": "prose",
          "text": "声明文档树的一个层级：命名槽位，以及已发现文档的接纳规则。它绝不扫描文件夹、列出子项或复制子文档：子文档通过 `placement` 指明其父级，或者命名空间接纳一个发现组。`astryx docs <route>` 向下列出每个槽位一层的子项。CLI 将其命名空间文档保存在自己的文档树目录中；集成在其文档目录中提供自己的文档，它们会与 CLI 的文档一起出现在 `astryx docs` 中。"
        },
        {
          "type": "prose",
          "text": "适用于：<namespace>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'namespace'",
              "yes",
              "文档类型判别字段。"
            ],
            [
              "name",
              "string",
              "yes",
              "稳定的提供方本地身份。移动命名空间不会改变此值。"
            ],
            [
              "title",
              "string",
              "yes",
              "人类可读的页面标题。"
            ],
            [
              "summary",
              "string",
              "yes",
              "用于列表和搜索结果的单行摘要。"
            ],
            [
              "placement",
              "DocPlacement",
              "no",
              "可选的规范父级：{parent, slot?, order?}。`parent` 以 `namespace:<name>` 指定同一包的命名空间。无效的 placement 会撤回该命名空间并给出诊断；绝不会回退。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "文档树将保持解析到此文档的先前名称或路由。尚未读取。"
            ],
            [
              "audience",
              "'public' | 'internal'",
              "no",
              "保留：文档包受众。目前没有任何代码读取它：设置 'internal' 的命名空间仍会显示在 `astryx docs` 中。默认值：'public'。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "标题或摘要中尚未包含的搜索词。"
            ],
            [
              "slots",
              "Record<string, NamespaceSlot>",
              "yes",
              "命名的放置和收集目标。每个槽位声明一个标题及其接受的文档类型。`accepts.providers` 尚未读取：只有命名空间自身包中的文档才能放置到槽位中。"
            ],
            [
              "adopts",
              "NamespaceAdoptionRule[]",
              "no",
              "提供方本地规则，用于从逻辑发现组中接纳原本未放置的文档。它们绝不扫描文件夹。"
            ],
            [
              "blocks",
              "(ReferenceContentBlock | GraphContentBlock)[]",
              "no",
              "命名空间页面的有序布局内容。仅图的 workflow、collection 和 reference 块可在此使用，而不会扩展现有主题渲染器使用的稳定 ReferenceContentBlock 联合。`astryx docs <route>` 会在槽位上方打印正文、标题、代码、表格和列表块，`--json` 返回每个块及其链接已解析。collection 块尚未渲染，`astryx doctor` 会对其发出警告。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "带有一个已接纳来源组的 CLI 命名空间"
        },
        {
          "type": "prose",
          "text": "文档树会从 CLI 和每个已配置的集成读取命名空间文档。没有 `placement` 的集成命名空间文档是树的顶层层级，其指南通过 `placement` 指明它；文档只能放置在其自身包的命名空间中。当两个包声明同一路由时，CLI 自己的文档优先，其次是按配置顺序排列的集成，`astryx doctor` 会指明失败者。"
        },
        {
          "type": "prose",
          "text": "子文档通过 placement 请求一个规范归宿。collection 块通过稳定引用引用这些文档，绝不创建第二个身份或父级。它尚未渲染：`astryx doctor` 会对其发出警告。"
        },
        {
          "type": "list",
          "items": [
            "使用目录作为隐式导航。",
            "在文档中放置 JSX、HTML、ANSI、回调或自定义渲染器代码。",
            "在完整的块扩展契约存在之前使用 choice、callout 或 checklist 块。"
          ]
        }
      ]
    },
    {
      "section": "ReferenceDoc",
      "title": "ReferenceDoc",
      "content": [
        {
          "type": "prose",
          "text": "参考/主题文档的文档类型：令牌、原则、主题化、模式、无障碍、迁移指南。与 ComponentDoc 不同，它不绑定到组件：将 `.doc.mjs` 放入文档目录，它就会显示在 `astryx docs` 中。内容由混合内容块的有序节构成。"
        },
        {
          "type": "prose",
          "text": "适用于：集成清单 `docs` 指定文件夹中的 <topic>.doc.{ts,mjs,js}"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'generic'",
              "no",
              "文档类型判别字段。保持为 'generic'（参考/主题判别字段）。旧式 `export const docs = {...}` 文档省略它。"
            ],
            [
              "name",
              "string",
              "yes",
              "URL 安全的标识符，用作 CLI 主题名称。例如 'tokens'、'principles'。"
            ],
            [
              "title",
              "string",
              "yes",
              "人类可读的标题。例如 'All Tokens'。（参考文档使用 `title`，而不是 `displayName`。）"
            ],
            [
              "description",
              "string",
              "yes",
              "主题列表中显示的单行摘要。"
            ],
            [
              "category",
              "string",
              "no",
              "导航类别：'guide' 或 'foundations'。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "读者可能搜索但标题和节中未使用的词：同义词、任务，或其他库对同一事物的名称。`astryx search` 会将每个词作为整个主题的关键词匹配，因此精确匹配的词会像主题自身标题那样为其排名。示例：['dark mode', 'color scheme']。"
            ],
            [
              "replaces",
              "string",
              "no",
              "此文档取代的现有主题名称。由提供自己指南而非内置指南的集成编写：同名文档会替换内容，而不同名的文档还会将旧名称保留为别名，使 `astryx docs <old>` 仍可解析。与 `extends` 互斥。示例：'getting-started'。"
            ],
            [
              "extends",
              "string",
              "no",
              "此文档逐节合并到的现有主题名称。节会替换具有相同 `id` 的基础节，或在两者之一没有 `id` 时替换标题完全相同的节。由标题派生的键只与 `id` 比较：没有 `id` 的节也会匹配其 `id` 为该标题派生键的基础节，而带有 `id` 的节也会匹配标题派生该 `id` 且没有 `id` 的基础节。两个不同的 `id` 绝不匹配，两个没有 `id` 且标题仅在大小写或标点上不同的节保持独立，不匹配任何节的节会追加到末尾。主题保留基础的标题和说明。用于修正或补充主题，而不是拥有它。与 `replaces` 互斥。示例：'theme'。"
            ],
            [
              "sections",
              "ReferenceSection[]",
              "yes",
              "构成文档的有序节。每个节在完整输出中成为 h2，并可通过 `astryx docs <topic> <section>` 检索。"
            ],
            [
              "sections[].id",
              "string",
              "no",
              "稳定的节锚点。新文档应设置它，而不是依赖可变的标题。已发布的 @astryxdesign/cli 0.6.3 及更早版本会拒绝该字段并隐藏该包发布的所有文档主题，因此 `astryx integration verify` 会使设置该字段的集成失败，直到它声明 `@astryxdesign/cli` 对等版本为 `>=0.6.4`。"
            ],
            [
              "sections[].title",
              "string",
              "yes",
              "节标题，例如 \"Spacing Tokens\"、\"Light/Dark Mode\"。"
            ],
            [
              "sections[].category",
              "string",
              "no",
              "导航类别（'guide' | 'foundations'）。镜像父文档的 category，因此节可以独立分组。"
            ],
            [
              "sections[].content",
              "(ReferenceContentBlock | ReferenceDocBlock)[]",
              "yes",
              "有序内容块：prose、heading、code、table、list、token-ref 和 reference。`reference` 块（`{type: 'reference', target, projection?, presentation?}`）从其规范来源包含另一个文档，而不是副本：按 `astryx docs` 打印的方式包含 schema、命令、函数或枚举文档，然后是打开它的命令。`projection.fields` 仅保留 schema 的那些字段；`presentation` 为 `full`（默认）、`compact`（无代码块）或 `summary`（仅文档的标题、摘要和命令）。任何其他文档显示为摘要。仅图的 workflow 和 collection 块可通过 NamespaceDoc 上的 GraphContentBlock 使用，而不会扩展稳定的 ReferenceContentBlock 联合。在文本中，`{@link <target>}` 按身份（`[<provider>:]<kind>:<name>`）链接另一个文档：CLI 打印打开它的命令，`astryx doctor` 会对未命名任何文档的链接发出警告。"
            ],
            [
              "sections[].previewType",
              "ReferenceTokenPreviewType",
              "no",
              "此节中令牌表的预览类型。CLI 会拒绝不在下面列表中的值，并在 `astryx docs --json` 中返回该值，但不会据此绘制预览。非令牌节请省略。"
            ],
            [
              "tokenCategory",
              "string",
              "no",
              "映射到令牌节的基础文档的令牌类别（例如 'color'）。`astryx docs --json` 按编写内容返回它；没有令牌页面通过它链接到该文档。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "包含一个节的参考文档"
        },
        {
          "type": "prose",
          "text": "没有 `title`、`description` 或 `sections` 的带标记泛型文档仍会加载，就像较旧的 codemod 输出那样；其标题回退到 `displayName` 或 `name`。没有 description 和 sections 时，它不是可用的主题，`astryx doctor` 会报告它。"
        },
        {
          "type": "prose",
          "text": "每个 `sections[].content` 都是 ReferenceContentBlock 的有序数组，即 prose、heading、code、table、list 和 token-ref 加上 reference 块（ReferenceDocBlock）的稳定判别联合。读取时会把 reference 块内联，就像内联 token-ref 一样，因此 `astryx docs`（文本和 `--json`）只返回稳定的块类型。仅文档图的 workflow 和 collection 块作为 GraphContentBlock 单独导出，并由 NamespaceDoc 接受。choice、callout 和 checklist 仍然无效。ReferenceContentBlock 也会被 SchemaDoc 和 CommandDoc 的 `notes` 字段复用。在文本中，`{@link <target>}` 按身份（`[<provider>:]<kind>:<name>`）链接另一个文档：CLI 打印打开它的命令，`astryx doctor` 会对未命名任何文档的链接发出警告。在文本、shell 代码或表格单元格中将 CLI 命令写为裸 `astryx` 命令：文本读取会在其前面添加读者使用的运行器，而 `--json` 按原样返回。"
        },
        {
          "type": "prose",
          "text": "reference 块会包含内容，而链接只指向它：当其目标未命名任何文档、`projection.fields` 指定了 schema 没有的字段，或文档无法接受其设置的 projection 或 presentation 时，`astryx doctor integration docs` 会失败，读取时也会标记缺失的内容。没有提供方的目标命名编写它的包中的文档，因此集成用 CLI 的提供方来命名 CLI 的文档，例如 `@astryxdesign/cli:schema:integration`。"
        },
        {
          "type": "code",
          "label": "包含集成清单两个字段的节"
        },
        {
          "type": "code",
          "label": "ReferenceContentBlock 联合"
        },
        {
          "type": "prose",
          "text": "`token-ref` 块（例如 {type: 'token-ref', topic: 'tokens', section: 'Color Tokens'}）引用另一主题中的令牌表；CLI 在读取时解析并内联它，以便 docsite 渲染实时主题值。"
        },
        {
          "type": "prose",
          "text": "节可以将 `previewType`（其令牌表的预览提示）设置为 'swatch' | 'shadow-box' | 'radius-box' | 'spacing-bar' | 'size-bar' | 'border-line' | 'duration-bar' | 'easing-curve' | 'font-sample' 之一；CLI 会拒绝任何其他值。"
        }
      ]
    },
    {
      "section": "SchemaDoc",
      "title": "SchemaDoc",
      "content": [
        {
          "type": "prose",
          "text": "记录编写的/接收的 OBJECT 形状（astryx.config、codemod 载荷、文档类型本身）的文档类型。与其描述的 schema 一起放在旁边的 `.doc.mjs` 中。字段递归嵌套，因此整个形状是一棵树。"
        },
        {
          "type": "prose",
          "text": "适用于：<schema>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'schema'",
              "no",
              "文档类型判别字段。将此文件标记为 schema 文档。"
            ],
            [
              "name",
              "string",
              "yes",
              "URL 安全的标识符，用作其命名空间内的文档 slug。示例：'config'。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "人类可读的标题。示例：'Astryx Config'。"
            ],
            [
              "description",
              "string",
              "yes",
              "列表中显示的单行摘要。"
            ],
            [
              "namespace",
              "string",
              "no",
              "读取此文档的分组：'authoring' 用于作者编写的文件（{@link generic:field-reference} 的一节），或 'cli/api' 用于 CLI 返回的形状（文档树按类型接纳它，作为叶子 `cli/api/schemas/<name>`）。CLI 发布的每个 schema 文档都声明一个，`astryx doctor` 会对缺失或没有任何代码读取的文档报错。"
            ],
            [
              "aliases",
              "string[]",
              "no",
              "保留：此文档的备用 slug。目前没有任何代码读取它：`astryx docs` 仅按 `name` 查找 schema 文档。"
            ],
            [
              "appliesTo",
              "string",
              "no",
              "此 schema 适用于什么，例如 'astryx.config.{ts,mjs,js}' | 'AstryxConfig'。"
            ],
            [
              "fields",
              "SchemaFieldDoc[]",
              "yes",
              "构成形状的字段。对象类型的字段通过每个字段自己的 `fields` 递归嵌套其成员，因此整个形状是一棵树。"
            ],
            [
              "fields[].name",
              "string",
              "yes",
              "字段名称，或嵌套字段的点分路径（例如 'hooks.postCodemod'）。"
            ],
            [
              "fields[].type",
              "string",
              "yes",
              "TypeScript 类型签名（字符串形式），例如 'string[]' | \"'a' | 'b'\"。"
            ],
            [
              "fields[].description",
              "string",
              "yes",
              "字段的用途，用 1-2 句话说明。"
            ],
            [
              "fields[].required",
              "boolean",
              "no",
              "字段必须提供时为 true。可选时省略（不要设为 false）。"
            ],
            [
              "fields[].default",
              "string",
              "no",
              "默认值（字符串形式），如果有。"
            ],
            [
              "fields[].example",
              "string",
              "no",
              "简短的内联示例值。"
            ],
            [
              "fields[].deprecated",
              "string",
              "no",
              "弃用原因（如果字段已弃用）。"
            ],
            [
              "fields[].fields",
              "SchemaFieldDoc[]",
              "no",
              "嵌套对象字段，用于对象类型的字段。递归。"
            ],
            [
              "examples",
              "{ label?: string; code: string }[]",
              "no",
              "完整的示例对象/代码片段。"
            ],
            [
              "examples[].label",
              "string",
              "no",
              "显示在代码片段上方的可选标题。"
            ],
            [
              "examples[].code",
              "string",
              "yes",
              "示例源码。"
            ],
            [
              "notes",
              "ReferenceContentBlock[]",
              "no",
              "在字段表和示例之后渲染的自由形式正文/备注。稳定的 ReferenceContentBlock 联合（prose、heading、code、table、list、token-ref），不包括 ReferenceDoc 节也接受的 reference 块；token-ref 备注会被接受但不会渲染。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "带嵌套对象字段的小型 schema 文档"
        },
        {
          "type": "prose",
          "text": "SchemaFieldDoc 是递归的：对象类型的字段在其自己的 `fields` 中列出成员，因此整个嵌套形状（包括 `hooks.postCodemod` 或 `experimental.xle.components` 等路径）都作为一棵树记录。"
        },
        {
          "type": "prose",
          "text": "用从根开始的点分路径命名嵌套字段（例如 `hooks.postCodemod`），以便读者看到每个字段在形状中的位置。"
        },
        {
          "type": "list",
          "items": [
            "仅为必需字段设置 `required: true`。",
            "让 `type` 尽量贴近真实 TS 类型；字符串字面量联合使用单引号。"
          ]
        },
        {
          "type": "list",
          "items": [
            "为可选字段设置 `required: false`；更好的做法是完全省略 `required`。"
          ]
        }
      ]
    },
    {
      "section": "TemplateDoc",
      "title": "TemplateDoc",
      "content": [
        {
          "type": "prose",
          "text": "模板元数据的文档类型。它是 PageTemplateDoc（type: 'page'，用于整页模板）和 BlockTemplateDoc（type: 'block'，用于可编辑组合）的判别联合。块可以独立存在，或使用 `exampleFor` 附加到一个组件；`isShowcase` 要求该组件所有权。"
        },
        {
          "type": "prose",
          "text": "适用于：<Name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'page' | 'block'",
              "yes",
              "选择变体的判别字段：'page' 表示整页模板，'block' 表示可独立或归组件所有的可编辑组合。"
            ],
            [
              "name",
              "string",
              "yes",
              "块模板的稳定标识符；要编辑其在图库中的可见标签，请更改 `displayName`，而不是 `name`。对于页面模板，它是人类可读的标签，而现有模板目录/CLI slug 拥有默认 registry 路径。`astryx template --list` 和 `astryx search` 将两者的 `name` 作为标签打印，`astryx template <id>` 按 id 查找模板，绝不按 `name`：集成模板的 id 是其在 templates 文件夹下的路径，去掉 `.doc.*` 后缀。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "图库的人类可读标签。CLI 改为打印 `name`；`astryx template --list --json` 也会返回集成模板的 `displayName`。对于镜像 PascalCase 组件的块名称，用空格分隔（'ChatMessageMetadata' → 'Chat Message Metadata'）。"
            ],
            [
              "registry",
              "RegistryDocIdentity",
              "no",
              "可选的公共 registry 身份。转换器从 `name`（或现有页面模板 slug）派生稳定的 kebab-case 短标识；仅在需要覆盖时才设置 `slug`，发布后重命名时请将先前的相对路径保留在 `aliases` 中。"
            ],
            [
              "description",
              "string",
              "no",
              "用一句话说明模板提供的内容。"
            ],
            [
              "keywords",
              "string[]",
              "no",
              "用于 CLI 发现的搜索关键词：构建者可能用来描述模板所服务内容的想法、领域和其他名称（例如服务健康仪表盘的 ['monitoring', 'uptime', 'on-call']）。小写。一个关键词命名一个概念：多个词应写成单独的关键词（['kpi', 'tiles']，而不是 'kpi tiles'）。仅当这些词分开时不表示某含义时才将多个词写成一个关键词，例如 'table of contents' 或 'reading pane'：当 `astryx build` 选择起点及其替代项时，此类关键词仅当请求按顺序命名整个短语时才计入，绝不会仅通过其单词计入。在短语内，build 会跳过搜索的停用词和单字母词，因此 'sign in' 按 'sign' 匹配，'on-call' 按 'call' 匹配。`astryx search` 会像匹配 description 那样匹配它们，`astryx build` 会据此为页面模板排名，因此请将它们排除在 `description` 之外。集成模板需要 @astryxdesign/cli 0.6.6 或更高版本：较早的 CLI 会拒绝该字段并丢弃该模板，0.6.4 之前的 CLI 还会隐藏该包的文档主题。"
            ],
            [
              "replaces",
              "string",
              "no",
              "仅用于集成模板：此模板为无修饰查找而替换的 Core 模板的确切 id。使用 `astryx --json template --list --package @astryxdesign/core` 查找它；使用 `--package @astryxdesign/core` 仍可选择 Core 原始模板。页面只能替换 Core 页面，块只能替换 Core 块。需要 @astryxdesign/cli 0.6.4 或更高版本：较早的 CLI 会拒绝该字段、丢弃该模板并隐藏该包的文档主题。"
            ],
            [
              "isReady",
              "boolean",
              "no",
              "模板是否可供使用。false 会在图库和 CLI 中显示为 '(WIP)'。"
            ],
            [
              "scaffold",
              "boolean",
              "no",
              "仅用于脚手架的模板（例如空白页）：可通过 CLI 使用，但从可浏览图库中隐藏。"
            ],
            [
              "category",
              "TemplateCategory",
              "no",
              "遵循 'Group - Variant' 约定的功能图库类别（例如 'Dashboard - Analytics'、'Table - Basic'、'Form - Wizard'）。概览按 ' - ' 之前的文本分组。"
            ],
            [
              "isHiddenFromOverview",
              "boolean",
              "no",
              "退出 Templates 概览图库，同时仍可通过 CLI 使用。适用于重复/实验性变体。脚手架模板会自动隐藏。"
            ],
            [
              "exampleFor",
              "string",
              "no",
              "仅用于块模板：可选的组件所有权。当块专门是某个组件的示例时设置它。独立组合请省略。"
            ],
            [
              "alsoExampleFor",
              "string[]",
              "no",
              "仅用于块模板：其他组件/Hook 文档页面，其 Examples 部分应包含此块。"
            ],
            [
              "alsoShowcaseFor",
              "string[]",
              "no",
              "仅用于块模板：其他文档页面，其主展示应复用此块（次要放置；不会改变主展示）。"
            ],
            [
              "aspectRatio",
              "number",
              "no",
              "仅用于块模板（必需）：预览容器的宽高比（例如 16/9、1、3/4）。"
            ],
            [
              "scale",
              "number",
              "no",
              "仅用于块模板：块预览的缩放系数。默认值：1。"
            ],
            [
              "componentsUsed",
              "string[]",
              "no",
              "仅用于块模板：此块使用的组件名称，用于 'See also'/'Used in' 交叉引用（不是主要归属）。"
            ],
            [
              "isShowcase",
              "boolean",
              "no",
              "仅用于块模板：为 true 时，此块是其 `exampleFor` 组件的规范主展示。需要 `exampleFor`。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "页面模板"
        },
        {
          "type": "code",
          "label": "块模板（组件示例）"
        },
        {
          "type": "prose",
          "text": "加载时，模板可以省略 `displayName` 和 `aspectRatio` 并使用自己的 `category`，就像已发布的集成模板那样；没有 `aspectRatio` 的块按 1 预览。无论如何都请按类型编写；它就是契约，`astryx doctor integration validate` 会对省略 `displayName` 或 `aspectRatio` 的集成模板发出警告。"
        },
        {
          "type": "prose",
          "text": "TemplateDoc 是按键 `type` 判别的联合。整页模板设置 `type: 'page'`。可编辑组合设置 `type: 'block'`；仅当某个组件拥有该示例时才添加 `exampleFor`。"
        },
        {
          "type": "list",
          "items": [
            "PageTemplateDoc（type: 'page'）：整页模板；`name` 同时作为其显示值。",
            "BlockTemplateDoc（type: 'block'）：可编辑组合。`exampleFor` 是可选的组件所有权；独立块请省略。`isShowcase` 需要 `exampleFor`。"
          ]
        },
        {
          "type": "prose",
          "text": "`category` 使用共享的 TemplateCategory 分类法：'Group - Variant' 字符串（例如 'Table - Bulk Actions'）。并非每个值都映射到现有模板；未使用的值被保留，以便作者获得整个分类法的自动补全。"
        }
      ]
    },
    {
      "section": "IntegrationTemplateDoc",
      "title": "IntegrationTemplateDoc",
      "content": [
        {
          "type": "prose",
          "text": "集成包模板元数据的文档类型。它具有 TemplateDoc 的每个字段和规则，但 `category` 是包自己的字符串，而不是 TemplateCategory 值。"
        },
        {
          "type": "prose",
          "text": "适用于：<Name>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "category",
              "string",
              "no",
              "包自己的类别。裸 `astryx template` 会按它分组该包的模板。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "集成包中的块模板"
        },
        {
          "type": "prose",
          "text": "其他所有字段以及页面和块变体都属于 TemplateDoc。Core 自己的模板使用 TemplateDoc，其 `category` 是 TemplateCategory 值。`astryx doctor integration validate` 依据 IntegrationTemplateDoc 检查集成的模板文档。"
        }
      ]
    },
    {
      "section": "ThemeDoc",
      "title": "ThemeDoc",
      "content": [
        {
          "type": "prose",
          "text": "一个源主题的强类型描述符：与 CLI 捆绑、由集成提供，或保存在项目的 src/themes 中（`theme eject` 会在那里写入一个）。"
        },
        {
          "type": "prose",
          "text": "适用于：<theme-source-stem>.doc.mjs"
        },
        {
          "type": "table",
          "headers": [
            "字段",
            "类型",
            "必需",
            "说明"
          ],
          "rows": [
            [
              "type",
              "'theme'",
              "yes",
              "文档类型判别字段。"
            ],
            [
              "name",
              "string",
              "yes",
              "小写 kebab 的 CLI 主题身份。必须与描述符父目录匹配。示例：'ocean'。"
            ],
            [
              "displayName",
              "string",
              "yes",
              "主题列表显示的人类可读名称。示例：'Ocean'。"
            ],
            [
              "description",
              "string",
              "yes",
              "主题列表显示的单行摘要。"
            ],
            [
              "maintained",
              "boolean",
              "yes",
              "所属包是否积极维护此主题。"
            ]
          ]
        },
        {
          "type": "code",
          "label": "oceanTheme.ts 旁边的主题描述符"
        },
        {
          "type": "prose",
          "text": "ThemeDoc 是静态元数据。描述符包含一个默认导出的、由字面量字符串和布尔字段组成的对象，直接位于 `/** @type {import('@astryxdesign/cli/authoring').ThemeDoc} */` 注释下方，不含其他内容：没有该注释，或包含任何其他语句，都会加载失败。发现过程会在不执行描述符或主题源码的情况下验证它。"
        },
        {
          "type": "prose",
          "text": "描述符和源码共享一个词干。对于 oceanTheme.doc.mjs，发现过程要求恰好有一个 oceanTheme 源模块和一个名为 oceanTheme 的运行时导出。"
        },
        {
          "type": "prose",
          "text": "父主题目录（包括此描述符）是完整的复制和打包边界。嵌套的源码、调色板、资源和收据无需第二个文件列表。"
        }
      ]
    }
  ]
};
