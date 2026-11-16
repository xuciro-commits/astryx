---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:cli-surface
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-10-20
owners: [josephfarina]
applies_to: [packages/cli]
verified_by:
  [
    pnpm check:cli-structure,
    clients/cli/commands/json-contract.test.mjs,
    clients/cli/commands/interactive-guard.test.mjs,
    clients/cli/cli-exit-codes.test.mjs,
    clients/cli/error-envelope-code.test.mjs,
    foundation/response/error-codes.test.mjs,
    foundation/agent-docs/agent-docs.test.mjs,
    foundation/agent-docs/agent-docs.path-safety.test.mjs,
    clients/cli/commands/init.behavior.test.mjs,
    api/init/remove/remove.test.mjs,
    foundation/integrations/autolink.test.mjs,
    foundation/runtime/package-set.test.mjs,
    foundation/runtime/hosted-runtime.test.mjs,
    foundation/integrations/manifest-writer.test.mjs,
    foundation/integrations/contribution-inventory.test.mjs,
    foundation/discovery/theme-discovery.test.mjs,
    authoring/doctypes/doctypes-new.test.mjs,
    scripts/check-cli-theme-bundle.test.mjs,
    clients/cli/commands/integration-authoring.test.mjs,
    clients/cli/commands/integration-real-world.test.mjs,
    api/integration/add-contribution.test.mjs,
    api/integration/pack-check.test.mjs,
    api/integration/validate-integration.test.mjs,
    api/integration/example-code.test.mjs,
    api/integration/example-scope.test.mjs,
    authoring/example/preview.test.mjs,
    foundation/integrations/cli-peer-version.test.mjs,
    api/theme/integration-themes.test.mjs,
    clients/cli/commands/upgrade.integration-policy.test.mjs,
    clients/cli/formatters/index.test.mjs,
  ]
deciding_specs: [spec:AST-017/DEC-4, spec:AST-042/DEC-1, spec:AST-042/DEC-2]
---

# CLI surface architecture

## Purpose

Astryx CLI 是 agent 访问 Astryx 的方式。agent 在使用该设计系统构建时所需的一切——有哪些内容、它们做什么、如何使用、它面前的代码有什么问题——都可以通过一个命令接口、以一种可预测的形态访问，无需人工介入。

CLI 只有一个受众：在子进程中运行它的 agent。终端前的人是受支持的输出阅读者，但绝不是该设计所服务的调用方。下面的每条规则都源自这一事实。

本记录描述随包发布的接口：命令如何被调用、可以输出什么、如何失败，以及其代码位于何处。它不描述命令具体做什么。

## System model

一次运行有五个阶段，每个阶段都是接口被强制执行而不是留给命令作者自行决定的地方。

1. **预检。** `clients/cli/bin/astryx.mjs` 仅使用内置模块校验 Node 版本，然后才导入任何在旧运行时上可能失败的内容。该门禁遵循 `--json`，用携带 `ERR_NODE_VERSION` 的手写信封输出。
2. **版本选择。** `foundation/release/handoff.mjs` 在项目提供的任何内容加载之前，选择响应该文件夹的版本（`spec:AST-081` FR2）。当该版本不是当前副本时，运行会被交接给它一次，使用相同的参数、文件夹和标准流，并以其退出状态结束（`spec:AST-081` FR9）；无法运行的版本会在任何写入之前以 `ERR_VERSIONS_UNAVAILABLE` 使运行失败。
3. **分发。** `clients/cli/index.mjs` 使用 Commander 解析，在任何命令主体运行之前于 `preAction` 中设置 JSON 模式，并在任何副作用之前拒绝不支持 `--json` 的命令。
4. **工作。** 命令解析其参数并调用 `api/` 中的函数。命令是薄包装：解析、调用、渲染。API 函数是可脚本化且带类型的单元，也是其自身信封上 `type` 判别符的事实来源。`spec:AST-042` FR1 将此定为契约；INV20–INV22 固定各部分所在的位置。
5. **渲染。** 恰好两条路径之一。在 `--json` 模式下，`jsonOut` 写入单个信封。否则格式化器从一组封闭的块（INV23）将相同的值渲染为文本。其他任何东西都不得写入 stdout。

组件、模板、主题、codemod 和文档的发现不是按命令进行的。它通过 `foundation/config` 中的 `Project` 接缝进行，该接缝解析 `astryx.config` 中命名的集成，然后自动链接任何随包提供根 `astryx.integration.*` 清单的已声明依赖——配置条目是项目固定集成的方式，而不是 CLI 发现集成的方式。每个集成独立加载。清单加载失败会撤回该包。某一贡献类型的错误不会隐藏其他有效类型，无效的模板或组件文件也不会隐藏有效的同级文件。

程序化宿主（`spec:AST-081` FR1）可以从它保存在别处的包集为 CLI 提供服务：包根目录，其 `node_modules` 各自包含一个 CLI、与之相等的 Core，以及宿主随它们安装的集成。宿主入口 `@astryxdesign/cli/host` 通过 `foundation/runtime` 中的包私有实现，在进程内激活为一次运行提供服务的根。工作文件夹仍是调用方的：项目、其配置、本地主题和正在编写的包会像没有宿主时一样解析，且不会有任何写入落到包根目录中。Core 查找以及项目之外的集成查找，仅在项目自身的解析未命中之后才查询活动根。没有活动集时，每次查找的行为与没有该接缝时完全一致（INV30）。哪个版本响应受宿主运行的请求、宿主入口的输入，以及受宿主运行打印的行，均属于 `spec:AST-081`。

AST-017 DEC-4 拥有稳定的响应条目字段，并要求它们具有完整的类型、测试、适用文本和使用方文档投影。`template.list` 条目可以携带可选的 `replaces`，命名获胜的集成模板所取代的 Core id；Core 条目会从默认列表中省略，并仍可通过显式的 Core 包选择获得。

## Boundaries and invariants

- **INV1 — CLI 从不提问。** 没有提示，没有 TTY 检测，不为控制流读取 stdin。非 TTY 环境是唯一受支持的条件，而不是回退方案。无事可做的命令以结果退出，绝不提问。
- **INV2 — 每次 `--json` 输出都是一个有效信封。** 成功是 `{apiVersion, type, data}`，外加可选的 `package`（INV28）和 `meta`，其中 `meta` 在每次成功时携带 `answeredBy`（`spec:AST-081` FR5）。失败是 `{apiVersion, error, code}`，外加可选的 `suggestions`。没有第三种形状，没有部分写入，也没有原始堆栈跟踪：未捕获的抛出会在 bin 错误边界处变成一个信封。
- **INV3 — 代码是契约；文字不是。** `code` 是稳定的，且只做追加。一旦随包发布，代码的含义永不改变，代码也永不移除。`error` 字符串可以随时改写。使用方基于 `code` 分支。`ERR_PROJECT_REQUIRED` 和 `ERR_VERSIONS_UNAVAILABLE` 承载 `spec:AST-081` FR2 和 FR4 定义的拒绝与失败。
- **INV4 — 人类可读输出是 JSON 的投影，只由格式化器产生。** `emit` 只接受渲染器产生的 `Block`，别的什么都不接受，因此杂散的字符串无法到达 stdout。输出是纯 ASCII：没有颜色，没有 TTY 检测，没有宽度换行，打印或管道传输时逐字节相同。投影可以把散文式字段缩短到其第一句话；命令的 `--verbose`（如果有）会完整打印这样的字段，而 `--json` 携带每个字段。
- **INV5 — 文本字段名与 JSON 键一一对应。** 两种视图不会漂移，每个字段都保持可 grep。
- **INV6 — 一个命令，一个文件。** 命令是 `clients/cli/commands/<name>.mjs`，当它是命令组时是 `clients/cli/commands/<name>/index.mjs`，并有一个同级的 `<name>.doc.mjs`。子命令的文档是 `<parent>-<child>.doc.mjs`。
- **INV7 — 每个命令都随包提供 `CommandDoc`，生成的接口面来自它。** 帮助文本、README 的命令和错误码表以及清单都是生成的。它们都不是手写的。每个命令和子命令的 `CommandDoc` 都声明 `outsideProject`，清单会发布它（`spec:AST-081` FR4）。
- **INV8 — 退出码不依赖输出模式。** 相同的条件在有和没有 `--json` 时以相同方式退出，因此命令可以作为门禁使用而无需解析 stdout。
- **INV32 — 警告只在 `--strict` 下使命令失败。** 没有 `--strict` 时，命令因错误退出 1，绝不会因为它报告为警告的发现而退出，因此警告不能让通过的构建变红。命令自身模式存在就是为了检测的条件，例如 `theme build --check` 下的过期输出，属于错误而不是警告。可以基于警告对构建设门禁的命令提供 `--strict`，它只改变相同发现结束运行的方式：它读取默认运行所报告的完全相同的数据，不添加任何检查，将每个警告以及每个未运行的检查以命令自身的问题格式、用发现自身的代码报告为错误，并退出 1，在文本和 JSON 中方式相同（INV8）。命令只能通过命名它的记录提供 `--strict`；`astryx integration check`（`spec:AST-039` FR14）是唯一这样做的（DEC-4）。
- **INV33 — 文档化的组件 Props 与源码一致。** `astryx doctor integration components` 必须将组件描述符记录的每个 prop 表与其所描述导出的 props 进行比较，使用项目安装的 TypeScript 读取。它必须警告：文档化但代码缺失的 prop、包自身源码声明但表格省略的 prop、代码与之矛盾的 `required` 标记，以及在命令文档所述的宽松比较下与代码不匹配的文档化类型。它不得警告表格省略了 `ref`、React 保留的 `key`、已发布 `ComponentPropDoc` 类型告知作者跳过的内部和样式 props（`xstyle`、`className`、`style` 和 `data-testid`），或其声明标记为 `@internal` 的 prop。它必须将无法判断的文档化类型列为未检查，而不是报告匹配或不匹配。没有项目的 TypeScript 时，它必须说明比较已跳过及其原因，且不得报告通过。
- **INV34 — 每个描述符都满足其发布的编写类型。** `astryx doctor integration validate` 必须检查集成的根所持有的每个描述符，以及描述符携带的每个翻译，对照 `@astryxdesign/cli/authoring` 为该集成中该类型发布的类型，方式如同项目安装的 TypeScript 检查用该类型编写的值；组件或 hook 翻译可以携带 `name` 和 `displayName`，它们在渲染时被忽略。它必须警告每个未知字段、缺失的必填字段以及超出其字段类型的值，指出字段和修复它的更改，包括编译器只有在先前的未知字段消失后才能到达的字段。加载器接受且 CLI 读取的值必须满足该类型。当集成可以编写比 Core 的该类型允许的更多内容时，例如任意模板 `category`，`@astryxdesign/cli/authoring` 必须为该类型发布额外的集成类型，而 Core 的类型必须保持不变。没有项目的 TypeScript 时，它必须说明描述符未进行类型检查及其原因，且不得报告通过。
- **INV37 — 每个条目源都有其描述符。** `astryx doctor integration validate` 必须警告组件根顶层没有同源组件文档的 PascalCase `.tsx`（`source_without_component_doc`），以及模板根顶层没有同源模板文档的 `.tsx`（`source_without_template_doc`）。测试、规格和 story 文件（`.test`、`.spec` 和 `.stories` 词干）以及子文件夹会被跳过，辅助函数应放在子文件夹中。
- **INV35 — 一个命令检查一个集成，并可以对其构建设门禁。** `astryx integration check` 命令不接受包参数，必须对当前文件夹中的集成包运行 `validate`、`components`、`templates` 和 `docs` 检查，报告每项检查自身的结果和摘要，并恰好在其中某项检查单独运行会退出 1 时退出 1。使用 `--strict` 时，它还必须在任何警告以及任何未运行的检查或检查内的比较（例如没有集成清单的包，或需要项目 TypeScript 的比较）时退出 1，将每项从默认运行所报告的相同发现中作为错误报告（INV32）。比较列为未检查的条目，例如无法读取的 prop 类型，不会使 `--strict` 失败。`--strict` 还会因 `docs` 检查在散文中发现的三种文档缺陷而失败（DEC-8）：复制段落，即两个主题逐字重复 10 个或更多单词（大部分为功能词的连续片段，或三个或更多主题共享的片段，不算复制）；废话，即列出的填充短语或内容词占比低于已发布下限的主题；以及多余指针，即恰好为 `astryx docs <name>` 的代码段，或代码段内或外的 `{@command docs <name>}` 标记（DEC-12），针对存在的文档，出现在主题的散文、描述或摘要或组件文档文本中，而指向该文档的 `{@link}` 本应被检查。它还会因读者会静默丢弃的文档结构而失败：同一 prop 被记录两次、命名不存在 prop 的 overlay 键、两个部分使用同一个键、没有主题的 overlay，以及空部分。其退出码和 JSON 形状是运行它的构建的兼容性契约，从随包发布 `integration check` 的第一个稳定版本开始：从那时起，新的检查或新的失败代码只能在一个点版本中加入，且该版本要点名新增内容；而可能使原本通过的构建失败的更改，包括对现有发现的更严格规则，只能在一个点名它的点版本中发布。在该版本之前，其检查和失败代码可以在任何版本中更改。仅对声明实验性清单键的包触发的失败代码（`spec:AST-017/FR27`、`spec:AST-084`）可以在补丁版本中加入，因为没有该键的包永远不会看到它。补丁版本向 Core 或 CLI 添加的名称（组件、模板或主题）可能引发与包自身名称的冲突。每个 `doctor integration` 子命令必须保持其退出码，其 JSON 只能通过新增内容改变。由于构建会因其发现而失败，它不得报告包代码未与之矛盾的发现，但 DEC-8 的文档缺陷、DEC-12 的文档语法发现以及 DEC-13 和 DEC-14 的示例发现除外：无法判断条目的检查会改为将其列为未检查（DEC-7）。会新导致构建失败的发现必须首先在 `validate` 的 `data.notes` 中作为标记 `next` 的注记发布，默认不使任何东西失败：`--next` 将这些注记计为警告，因此 `--strict --next` 今天会因它们而失败，并且每次运行都会报告有多少条并点名该命令。下一个点版本默认计入它们（DEC-11）。当运行的 CLI 超出包的 `@astryxdesign/cli` peer 范围时，`astryx doctor integration validate` 和 `integration check` 必须列出 `cli_peer_version` 注记，它不使任何东西失败，包括在 `--strict` 下，且 `integration verify` 不报告它：低于该范围时，它点名项目命令，以一起安装较新的 Core 和 CLI 并运行 `upgrade --apply`；高于该范围时，它要求发布支持此 CLI 的包版本，或者对于当前文件夹中的包，要求用此 CLI 测试并拓宽该范围。
- **INV36 — 提交缺口报告的人选择它发往哪里。** `astryx gap-report` 必须将报告发送到配置的报告处理器，或者在没有处理器时发送到所属包的 `issuesUrl`（`spec:AST-031` FR8），除非调用方用 `--to <package>` 指定目标。目标是已加载的集成，其清单设置了 `issuesUrl`。使用 `--to` 时，报告只发送到该 `issuesUrl`，方式与零处理器回退发送时相同：GitHub issues URL 只有在 `--confirm-public` 时才提交，否则报告 `consent_required`；任何其他 URL 返回为 `routed_only`。未命名任何目标的 `--to` 必须在发送任何内容之前以 `ERR_UNKNOWN_PACKAGE` 失败，并列出它接受的目标。当至少存在一个目标时，类别列表以及不带 `--to` 运行的收据必须在文本和 JSON 中列出默认目标和每个目标，并且必须告诉 agent 询问提交报告的人发往哪里，并用 `--to` 传入该人的选择。命令的文档和 agent 指南必须说同样的话：agent 询问该人，绝不自行选择包目标，并且当该人没有选择时省略 `--to`（DEC-9）。
- **INV9 — 无法支持 `--json` 的命令会在任何副作用之前被拒绝**，而不是在工作进行到一半时。
- **INV10 — 每次写入都被限制。** 输出路径通过 `assertWithin`，它会规范化符号链接并拒绝 NUL 字节；逃逸是 `ERR_PATH_TRAVERSAL`。有界输入会被限制而不是被信任。项目或输出文件夹之外唯一的写入是 `spec:AST-081` FR7 列出的按用户写入：版本、记录、保留的搜索目录、集成检查结果、模板发现的记录、组件列表、集成的主题记录、文档未找到提示的名称摘要、doctor 的文档检查和主题接线扫描，以及按用户缓存中 jiti 的转译代码、设置和状态文件，以及主文件夹中带链接或副本的计算机级 skill 文件。它们都不在其位置跟随链接，也都不替换 CLI 未创建的任何内容。
- **INV10a — 拒绝写入其受限根之外是兼容性修复。** 当当前记录已将 CLI 操作（命令或其程序化 API）的写入限制到某个根时，使该操作在写入任何内容之前拒绝写入该根之外的更改，是兼容的 `[fix]`，并根据 `spec:AST-017` 发布流程符合补丁资格。这适用于写入经过的每条路径（遍历段、绝对路径、符号链接，或从根之外的输入派生的默认位置），即使最新稳定版本接受了该输入且其文档未禁止该写入：受限根之外的写入不是受支持的工作流，因此依赖它的调用方不是已发布的受害者。Changeset 引用已发布行为违反的限制规则，点名现在被拒绝的每个输入及其失败方式，并给出迁移。写入仍保持在根内的输入继续正常工作。拒绝其中之一、移动输出而不是拒绝，或限制当前没有记录限制的操作，按任何其他更改分类。
- **INV10b — 升级作用于其运行所在的项目；该项目之下的文件夹绝不是单独的根。** `astryx upgrade` 作用于 `spec:AST-040` FR9 找到的项目：其运行位置或之上最近的、`package.json` 声明了 Astryx 包的文件夹，或其被 Astryx 工作区列出的文件夹。安装了 `@astryxdesign/core` 但未声明 Astryx 包且不是所列工作区成员的文件夹不是受支持的升级根：在那里运行只迁移该文件夹的升级会把项目其余部分留在旧版本上，因此依赖它的调用方不是已发布的受害者（`spec:AST-017` FR54）。作用于此类文件夹之上的项目是兼容的 `[fix]`，并符合补丁资格。声明了 Astryx 包的文件夹是其自己的项目，因此在那里运行会作用于该文件夹。
- **INV11 — 损坏的集成会降级命令运行，而不会使其失败。** `Project` 接缝独立加载每个集成并记录失败，命令自身的工作在没有该集成贡献的情况下继续。诊断命令按目的例外（INV29）。自身模块无法加载的命令（损坏的安装）仍会以加载错误应答它的每次运行：无论给它什么其他选项和词语，它都退出 1；`--help` 在打印用法时附带加载错误。
- **INV29 — `astryx doctor` 在已配置集成无法加载时失败。** `astryx.config` 中命名但未安装、没有清单，或其清单抛出或未通过 schema 的集成是失败的 `configured-integrations` 检查，因此 `doctor` 退出 1；可导入但 CLI 无法从中加载项目的 `astryx.config` 是失败的 `config` 检查，退出码相同。已配置指 `astryx.config` 列出的每个名称，包括为 provider-ID 冲突而搁置的包，以及当自身配置命名它时正在编写的包（其加载错误是作为结果计入的错误）。配置未命名的已安装集成保持信息性：它永远不会使 `doctor` 失败（INV14 报告的损坏安装是警告）。该不变量只覆盖加载；`doctor` 对加载成功的集成的贡献报告什么，由读取它们的检查拥有。
- **INV12 — 人类闲聊在 JSON 模式下绝不接触 stdout。** `humanLog` 和 `humanWarn` 是唯一的闲聊原语，两者在 `--json` 下都是空操作。`spec:AST-081` 定义的运行级行（在命令之前或之后打印：谁应答、回退警告、安装进度和更新通知）写入标准错误，并在 `--json` 下不打印任何内容。
- **INV13 — Agent 文档有一个渲染事实来源。** Init 和 upgrade 通过现有的 `Project` 接缝渲染已配置集成的 `agentDocs`。Upgrade 即使 Core 未变也比较完整块字节，并且当 codemod 或 hooks 运行时，只在它们成功后写入准备好的块。`astryx init --user` 写入的计算机级 agent 文本从同一来源渲染（`spec:AST-081` FR8）。
- **INV31 — Agent 文档从项目自己的文件到达每个 agent。** 默认情况下，init 写入 agent-docs 块，使每个 agent CLI 至少读取一份副本，无论它从项目根开始还是在项目之下的文件夹开始，都从项目提交的文件读取（DEC-2）。`--agent` 和 `--agent-docs-path` 改为指定文件；`--agent` 预设仍绝不会在两个 Claude Code 文件中都留下副本，除非如下面的忽略根规则所述。
  - 项目根目录的 `AGENTS.md` 持有该块。Init 在它缺失时创建它。
  - 项目的 Claude Code 文件持有完整副本：根 `CLAUDE.md`，否则 `.claude/CLAUDE.md`。即使它导入了 `AGENTS.md`，它也持有副本，因为 Claude Code 不会跟随对其起始文件夹之上文件的导入。当根 `CLAUDE.md` 持有副本时，`.claude/CLAUDE.md` 不持有副本；除非根 `CLAUDE.md` 未被跟踪且被仓库的忽略规则忽略（包括其本地排除文件和配置的排除项）：此时项目提交的 `.claude/CLAUDE.md`（已跟踪，或未被忽略）也持有副本，正如在默认布局以及 `claude` 和 `all` 预设下仓库无法说明时那样，因此全新克隆仍会给 Claude Code 一份副本。Init 不创建任何 Claude Code 文件，而作为 `AGENTS.md` 另名的 Claude Code 文件不持有第二份副本。
  - `GEMINI.md` 持有 `AGENTS.md` 的一行受管导入。Init 在它缺失时创建它，并且不会向已按 Gemini CLI 读取导入的方式导入 `AGENTS.md` 的 `GEMINI.md` 添加导入。将 Gemini CLI 指向 `AGENTS.md` 的设置不会取代该导入，因为 Gemini CLI 只有在项目根启动时才读取项目的设置。
  - 项目拥有的每个其他 agent 文件都持有完整副本，除非它导入 `AGENTS.md`。当一个 agent 文件导入 `AGENTS.md` 以外的 agent 文件，或两个 agent 文件实际上是同一个文件时，项目保持自己的布局：每个不导入其他 agent 文件的 agent 文件都持有副本。
  - 受管导入只有在 `AGENTS.md` 持有该块时才计为副本。当它不持有时，Doctor 失败。
  - Init 在项目根写入：工作文件夹或之上最近的、`package.json` 声明了 `@astryxdesign` 包的文件夹，否则是最近的含 `package.json` 的文件夹，否则是工作文件夹。搜索在仓库根停止，且绝不把主文件夹计入。使用 `--agent-docs-path` 给出的路径保持相对于工作文件夹。
  - 任何模式都不会在项目之外把 agent 文档写入主文件夹、其中的设置文件夹，或主文件夹下方名称以点开头的文件夹。设置文件夹内的文件夹属于某个项目，当它本身，或它之上、设置文件夹之下的某个文件夹有 `package.json` 时；设置文件夹本身永远没有。Init 报告它拒绝的文件夹并仍然成功，而移除那里的块仍然允许。`spec:AST-081` FR8 写入的计算机级 skill 文件（`~/.agents/skills/astryx/SKILL.md`，以及其在其他 agent 的 skill 文件夹中的文件夹链接或副本）不是项目的 agent 文档：只有 `astryx init --user` 和全局副本的后台步骤写入它，正如 INV10 和 FR8 所述。
  - Upgrade 刷新每个副本所在的位置，不移动任何副本。
  - 受管块归 Astryx 所有：`spec:AST-040` 的保护覆盖使用方拥有的内容，而不是该块；INV10 仍限制每次写入。
  - `--remove-agents` 移除项目根和工作文件夹中的块。它将更改的每个文件都在其自己的文件夹内解析，否则它不更改任何内容。
- **INV14 — 已安装的集成无需配置即可被发现，自动链接它只会增加。** 项目在 package.json 中声明且随包提供根 `astryx.integration.*` 清单的依赖会被加载；`node_modules` 从不遍历，因此项目未声明的任何内容都不能贡献。枚举只读取依赖的 KEY，绝不读取其值，因此 npm 别名或非 semver 协议会像任何其他依赖一样解析。配置条目对同一自动链接的包保持优先，清单加载失败的依赖会被丢弃，而不是作为使用项目的问题提出，但有一个例外：当加载失败是因为依赖要求其使用方安装的包（`dependencies` 条目，或未标记为可选的 `peerDependencies` 条目）缺失时，安装已损坏且项目可以修复它，因此该失败是该包的 `integration_error` 问题。它只是警告：除了新增的问题条目外，退出码和 JSON 形状不变。开发或可选依赖，或未声明的依赖，从不触发它。在项目之外，受宿主运行也会按名称从为其服务的包根加载宿主批准的每个集成（INV30）。为计算机安装的集成（`spec:AST-081` FR12）只在项目之外贡献，来自安装在全局副本旁边的包。在项目内它们不贡献任何内容：`discover` 和 `doctor` 加载项目未安装的每个集成的清单，只是为了列出那些 peer 范围允许应答版本且清单可加载的集成作为可用项。
- **INV15 — 集成编写写入一个完整、可发现的贡献。** `integration add <kind> <name>` 及其按类型的类型化 API 共享一个收据契约。试运行报告相同的计划路径而不写入。实际运行拒绝覆盖已有文件，原子地暂存相关写入，仅在有有效字节支持时才声明贡献根，并通过使用方使用的同一发现接缝验证可见性。
- **INV16 — 编写保留包策略，本地源码在被编辑期间优先。** 写入器从不创建 `files` 或 `exports`；当任一字段已存在时，它们只添加所需的清单、根或公共子路径，并保留每个作者拥有的条目。生成的组件和模板导出键是无扩展名的公共子路径，即使它们指向编写的 `.ts` 或 `.tsx` 源码。当前 package.json 旁边的集成会就地替换相同的已安装包，在使工作字节成为权威的同时保留其配置的顺序。
- **INV17 — 打包验证检查使用方收到的产物。** `integration verify` 通过 `npm pack` 运行包生命周期，将所需文件清单与实际 tarball 比较，将该 tarball 解压到临时使用方中，并重新运行贡献发现。它拒绝以 `.ts` 或 `.tsx` 结尾的已宣传组件导入，通过 Node 的包解析器解析每个精确宣传的组件和推断的模板导入，并在打包产物没有可用公共导出时失败。此契约不要求项目本地 TypeScript，也不承诺在 TypeScript 的 Node16 或 bundler 解析模式下进行验证。
- **INV18 — 集成诊断是只读且针对贡献的。** Doctor 报告格式错误或不可达的根以及贡献冲突，而不重写包。清单加载失败会撤回该包。某贡献类型的错误保持可见，而不隐藏其他有效类型。无效的模板和组件文件不会隐藏有效的同级文件。包作用域的主题查找仍会暴露该包的阻塞目录错误，而不是错误地将主题报告为未知。
- **INV19 — 集成主题是可导入的包；可编辑源码是显式 eject。** 清单的 `themes` 根为每个 slug 包含一个目录。每个主题源码都有一个强制性的同源、强类型 `ThemeDoc`；没有根条目目录。发现从共享词干派生源条目和所需命名导出，解析源码而不执行它，并拒绝逃逸的本地导入以及缺失或仅类型导出。主题目录是递归复制和打包边界；点条目和 npm 从不发布的文件不属于任何主题。点文件夹，或既不含描述符也不含 `<name>Theme` 源文件的文件夹，不是主题，既不读取也不打包，doctor 会对看起来像主题的此类文件夹发出警告；有主题源文件但没有描述符的文件夹会失败。唯一的例外是项目的本地 `src/themes` 根：由已发布 `theme add` 制作但没有描述符的源副本会被报告为未迁移，跳过而不使主题命令失败，并保持不受管理，直到 upgrade 添加其缺失的描述符。`integration add theme` 创建公共内置模块和样式表导出，并保持 CSS 有副作用。包还可以导出字体样式表。`integration verify` 重建源码，比较本地内置模块和样式表，并证明每个声明的主题导出都能从打包后的包解析。`theme list` 保留包所有权，而 `theme add --import` 记录该所有者并只导入构建产物。已弃用的普通 `theme add` 继续复制源码，直到其计划清理。`theme eject` 是显式的源码分支；它复制完整的主题目录和同源描述符，并将本地描述符标记为不由包所有者维护。`theme targets` 过滤器会去掉前导 `.` 和周围空格，因此类选择器按其输出形式（`.astryx-switch`）匹配。
- **INV20 — 命令的 API 主体只有一种布局。** 命令的行为位于 `api/<subject>/`。`<subject>.mjs` 是主体的入口，`api/index.mjs` 重新导出它所导出的内容。有多个操作的主体将每个操作放入叶子 `<leaf>/<leaf>.mjs`，入口分发到叶子。每个导出的函数都有一个同位置的 `FunctionDoc`——入口函数为 `<subject>.doc.mjs`，其他为 `<function>.doc.mjs`——响应 typedef 位于 `*.type.mjs` 文件中。测试与其覆盖的模块放在一起，名为 `<module>.test.mjs`。私有辅助函数是以下划线开头的文件，例如 `_site.mjs`。`api/blog` 是参考布局。
- **INV21 — API 主体只通过其适配器接触环境。** 在 `api/<subject>/` 内，读写文件、网络请求、子进程、加载项目或其模块，以及读取磁盘的发现，都发生在该主体的适配器中：`_adapter.mjs` 以及只有它导入的任何下划线前缀辅助函数。适配器可以调用 `Project` 接缝和 `assertWithin` 等基础接缝。入口和叶子塑造输入和结果并调用适配器；它们不导入文件系统、网络或子进程模块、`Project` 接缝，或发现和加载器函数。不需要环境访问的主体没有适配器。`api/blog/_adapter.mjs` 是参考适配器。
- **INV22 — 命令处理器解析、调用并渲染。** `clients/cli/commands/` 中的处理器通过 `defineCommand` 及其 `CommandDoc` 注册，可执行命令的 `CommandDoc` 在 `fn` 中命名它调用的 API 函数。处理器解析其参数，调用该函数，并通过 `jsonOut` 或格式化器工具包渲染结果。它不读取文件、不加载项目、不运行发现，也不启动子进程或网络请求；它可以用命令名措辞提示，由 `spec:AST-081` FR5 的选择器选择。只有命令处理器、它们的 `CommandDoc` 文件及其测试位于该目录中。`clients/cli/commands/blog.mjs` 是参考处理器。
- **INV23 — 格式化器工具包是封闭的。** 文本输出只由 `clients/cli/formatters/index.mjs` 中的块构造器构建——`section`、`text`、`list`、`record`、`records` 和 `code`——并通过 `emit` 打印。处理器不把字符串填充到某个宽度、不对齐列或绘制表格，也不定义自己的渲染器；它将其数据映射到记录、列表和部分。只有 `spec:AST-042` FR3 允许时，才会向工具包添加块类型及其测试和帮助“Output format”列表中的对应行。
- **INV24 — 每个可发现的集成条目拥有一个类型化描述符。** 新的编写会在其描述的源码或载荷旁边生成 `<source-stem>.doc.mjs`，用来自 `@astryxdesign/cli/authoring` 的公共类型注解。描述符是唯一的按条目元数据权威；`astryx.integration.*` 定位根和集成级能力，但从不编目条目：根下没有目录文件，清单中也没有按条目的映射或列表（`spec:AST-039/FR11`）。已发布的替代读取器是隔离的兼容路径，而不是第二套编写约定。组件描述符的 `name` 是它所记录的运行时导出：当同源源码导出它而不是词干时，发现以该名称记录组件；当描述符导入的模块导出它时，发现将描述符在 `components` 中列出的每个完整条目以其自己的名称记录（`spec:AST-039/FR4`）。仅以这种方式记录的名称绝不会占用 Core、旧版文档包或以其源码命名的组件所应答的非作用域查找：该所有者保留它，除非声明的替换声明它。
- **INV25 — 每个 CLI 文档都命名读取它的分组。** CLI 随包提供的每个命令、API 函数、schema 和枚举文档都声明 `namespace`。文档树采用 `cli/commands` 和 `cli/api` 文档，每个在 `cli/commands` 和 `cli/api/<kind>s` 下各有一条路由；`authoring` 文档是字段参考 `astryx docs authoring/field-reference` 的部分，并出现在其列表中；`astryx docs authoring <name>` 读取一个。当 CLI 文档没有 namespace、命名了无人读取的内容，或与 authoring 列表不一致时，`astryx doctor` 失败，因此 CLI 随包提供的每个文档都保持可从 CLI 读取。
- **INV26 — 文档树给每个文档一个归属（`spec:AST-046`）。** 该树在 `foundation/doc-compiler/tree.mjs` 中由 namespace 文档、它们放置的指南及其采用的类型化文档编译而成；CLI 自己的树文件位于 `assets/docs/tree/`。namespace 从不列出或扫描其子项。`astryx docs <route>` 一次读取一层，`astryx doctor` 对任何树错误诊断或未放置的 CLI 文档发出警告。集成的 namespace 文档和已放置指南加入同一棵树，由其 provider id 命名；CLI 自己的文档保留有争议的路由。每个扁平主题都位于其类别（Guides 或 Foundations）的生成层级中，以自己的名称命名，因此每个文档在树中都有命名的归属。集成作者阅读的所有内容都位于 `authoring` 下。
- **INV27 — 每次读取都说明下一步去哪里（`spec:AST-047`）。** 一次读取命名其位置，并以可运行的命令形式结束其移动（向上、向下、横向和向外），其 JSON 以 `links` 携带相同的移动；搜索命中携带 `parent`。读取所显示的任何内容都不会过时：移动是派生的，测试证明文档显示的每个命令都是真实的。`astryx docs` 和 `astryx search` 首先满足这一点。文档之间的链接按文档身份命名其目标，并在每次读取时解析；Doctor 对未命名任何文档的链接发出警告。
- **INV28 — 每个结果都命名每个产物来自的包。** 关于一个产物（组件、文档、模板或 hook）的 `--json` 结果在其信封中携带 `package`，紧随 `type` 之后。列出产物的结果为每个列出的产物提供自己的 `package`，而文档的每个部分都命名编写它的包。Core 的组件、hooks、模板和 codemod 命名为 `@astryxdesign/core`；CLI 随包提供的文档命名为 `@astryxdesign/cli`；集成的产物命名集成的包，且集成作者无需为其编写任何内容。两个纯名称列表 `hook --list` 和 `swizzle --list` 只包含 Core 的产物，并在信封中命名一次 `package`；`build` 的 `frame` 和 `foundation` 是 Core 组件名称的固定列表。文本输出命名相同的包。逐字源码输出（`--source`、`--showcase` 和模板的源码）让 stdout 只保留源码，因此它逐字节通过管道，并在 stderr 中命名该包。

- **INV30 — 宿主的包集只从一个根填充项目留下的空白。** 包集是一个包根，其 `node_modules` 包含一个 CLI、与之相等的 Core，以及随它们安装的集成。程序化宿主通过宿主入口（`spec:AST-081` FR1）按其偏好顺序传入其包集；哪个版本应答受宿主运行，以及受宿主运行打印的每一行，均属于 `spec:AST-081` FR2、FR3、FR5 和 FR9。只有宿主入口会激活包集：没有任何 CLI 标志、环境变量、配置键或命令会这样做，也没有导出任何 `foundation/runtime` 模块。
  - 项目安装的包始终从项目解析。在项目内，根只填充项目未安装的 `@astryxdesign/*` 包中那些其根内副本不随包提供集成清单的包，因此它不贡献任何集成（`spec:AST-081` FR12）。一次运行最多从一个根解析，因此 CLI 绝不会与另一个包集中的 Core 或集成配对。交接给项目自己的 CLI 的运行（`spec:AST-081` FR9）不使用根。
  - 只要启动运行的副本应答——在项目之外、在未安装自己 CLI 的项目中、作为 `spec:AST-081` FR2 命名的版本，或作为 FR2 的回退——持有该副本的根就为该运行服务。
  - 当 `spec:AST-081` FR2 让项目中的受宿主运行由启动运行的副本以外的命名版本应答时——匹配的版本或宿主拒绝的项目 CLI 的版本——根只有在其 CLI 是该版本，并且对于项目声明且根可填充的每个包，它持有项目将安装的版本时才合格：有效的 lockfile 版本，否则是满足声明范围的已发布版本。不是版本范围的声明值（例如路径或协议）只通过其 lockfile 版本匹配，而未请求的预发布版本不满足范围。宿主顺序中第一个合格的根提供服务。
  - 受宿主运行不安装任何东西：`spec:AST-081` FR2 命名的版本只来自启动运行的副本（当它是该版本时），或来自合格的根；两者都不满足时，该版本无法获得，并适用 FR2 的回退。
  - 在项目之外，宿主批准的每个集成按名称从为运行服务的根解析，作为 `spec:AST-081` FR12 在那里找到内容的补充，并按照 FR12 的验证、peer 范围检查和 provider 身份规则加载。该根不持有的已批准名称会被排除。
  - 通过根进行的枚举只读取 INV14 或 `spec:AST-081` FR12 命名的包，且从不读取根自身的配置。
  - 包集服务的每次运行都会为它解析的每个包记录其名称、版本，以及它来自项目还是包集，宿主入口随运行结果返回该记录（`spec:AST-081` FR1）；结果仍命名每个产物的包（INV28）。
  - 项目健康 API（`doctor` 及其集成检查）只判断项目自己的安装：包集绝不会满足或使项目检查失败，`spec:AST-081` FR12 决定它们列出什么为可用。

有些模块早于 INV20–INV23 且尚未满足它们；`spec:AST-042` 列出了已知缺口。

## Deprecation and cleanup records

### CLN-0029 — The CLI's Core peer names its own release

| 字段      | 值                                                                                                                                                                                                                                                                            |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `CLN-0029`                                                                                                                                                                                                                                                                    |
| lifecycle | 无弃用：为更窄的已发布范围分阶段进行的 `[breaking]` 更改（`spec:AST-017` FR12）                                                                                                                                                                                               |
| delta     | CLI 的可选 `@astryxdesign/core` peer 从 `*` 变为 CLI 自己的发布版本，即每个主题命名的确切 Core 版本。npm 随后拒绝将 CLI 安装到另一版本的 Core 旁边，pnpm 会警告，因此迁移说明告知使用方一起升级 CLI 和 Core。该版本的已发布清单检查放弃其唯一的例外，该例外允许此 peer 的 `*` |
| rollback  | 从最终补丁基线恢复 `*` peer 和检查的例外                                                                                                                                                                                                                                      |
| state     | `pending` — 随 0.8.0（下一个点版本）及其 `[breaking]` Changeset 落地                                                                                                                                                                                                          |

## Change coupling

对以下任意一项的改动都要求重新阅读本记录，并且当该改动移动了某项不变式时，在同一个 pull request 中更新本记录：

- 新增、删除或重命名命令或子命令；
- 新增错误码，或改变现有错误码的含义；
- 对稳定的 JSON 信封或带判别标记的响应条目字段的改动，遵循 `spec:AST-017/DEC-4`；
- 新增格式化器或块类型（INV23、`spec:AST-042` FR3），或从 `emit` 与 `jsonOut` 之外的任何位置写入 stdout；
- 改变 `clients/cli/commands` 下的文件布局；
- 新增 API 主体、叶子、适配器或导出函数，或让某个 API 模块获得对环境访问的能力（INV20–INV21）；
- 新增命令、API 函数、schema 或枚举文档，或新增某个 CLI 文档可以声明的命名空间（INV25）；
- 新增文档树命名空间或指南，或改变文档获得其归属位置或路由的方式（INV26）；
- 新增不提供任何可选行动的读取，或改变某项移动在文本或 JSON 中的拼写方式（INV27）；
- 改变集成写入器的回执、no-clobber/回滚行为、package.json 变更策略或公共子路径拼写；
- 改变 `integration verify` 对 tarball 执行、解析或证明的内容；
- 向命令新增 `--strict`，或任何其他因警告而失败的方式（INV32）；
- 改变本地、已配置或自动链接的集成优先级；
- 改变宿主的包集合与项目的匹配方式、它贡献哪些集成、它所服务的运行记录哪些内容，或哪些查找会咨询它（INV30）；
- 改变集成项描述符、主题目录边界或使用方副本契约；
- 改变哪些文件承载 agent 文档块、init 如何找到项目根目录、它拒绝在何处写入 agent 文档，或它在何处移除这些文档（INV31）；
- 新增一种缺口报告目的地，或改变由谁选择目的地（INV36）；
- 改变使组件示例能够独立运行的条件，或它在无需导入的情况下可以使用什么（DEC-14）。

`pnpm check:cli-structure` 会强制执行该布局。`verified_by` 中列出的契约测试会强制执行信封、退出码、错误码以及非交互保证。

## Owning code

- `clients/cli/bin/astryx.mjs` —— Node 版本下限闸门，以及把未捕获的抛出转换为信封的错误边界。
- `foundation/release` —— 发布版本的选择、按用户的发布缓存、交接、`meta.answeredBy`，以及更新检查及其通知（`spec:AST-081`）。
- `clients/cli/index.mjs` —— Commander 接线、JSON 模式闸门、分发。
- `clients/cli/commands/<name>.mjs` —— 一条命令：解析、调用 API、渲染。
- `clients/cli/commands/<name>.doc.mjs` —— 生成帮助与已发布表格的 `CommandDoc`。
- `clients/cli/formatters/index.mjs` —— `Block`、`emit`、`section`、`text`、`list`、`record`、`records`、`code`，以及共享的 ASCII 词汇。
- `foundation/response/json.mjs` —— `API_VERSION`、`jsonOut`、`jsonError`、`toErrorEnvelope`、`humanLog`、`humanWarn`，以及 JSON 模式标志。
- `foundation/response/error-codes.mjs` —— 冻结的、仅追加的错误码集合。
- `foundation/config` —— `Project` 发现接缝与集成优先级。
- `host/index.mjs` 和 `host/index.d.ts` —— 受支持的编程式宿主入口 `@astryxdesign/cli/host`（`spec:AST-081` FR1）。
- `foundation/runtime` —— 包私有的包集合实现：活动集合与查询它的查找（`package-root.mjs`）、把项目匹配到根目录、已批准的集成与来源信息（`package-set.mjs`），以及锁文件固定版本（`locked-versions.mjs`）。
- `foundation/integrations/manifest-writer.mjs` —— 安全的清单根修补、验证与回滚。
- `foundation/integrations/contribution-inventory.mjs` —— 共享的本地与已打包贡献身份/文件契约。
- `api/integration` —— 贡献写入器、诊断，以及打包产物验证。
- `foundation/discovery/theme-discovery.mjs` 和 `api/theme` —— 类型化集成主题描述符的发现、包感知的选择、源文件复制与构建。
- `foundation/agent-docs` —— init 与 upgrade 使用的共享期望块渲染器和受管文件写入器，以及决定哪些文件承载该块的布局（INV31）。
- `api/index.mjs` —— 公共编程式 API `@astryxdesign/cli/api`，它重新导出每个主体的函数。
- `api/<subject>/…` —— 命令所包装的可脚本化函数，按 INV20 所述组织；每个函数拥有自己信封上的 `type`。
- `api/<subject>/_adapter.mjs` —— 该主体对环境的唯一访问途径（INV21）。
- `authoring/example/preview.mjs` —— `previewableExample`，判断某个组件示例是否独立运行的规则，Doctor 与预览工具共用该规则（DEC-14）。
- `foundation/integrations/example-code.mjs` 和 `api/integration/example-scope.mjs` —— 读取某个包的示例时所依据的作用域，由 Doctor 构建，并由 `integrationExampleScope` 返回（DEC-14）。

## Deciding specs

- `spec:AST-017/DEC-4` —— 稳定的响应字段及其完整投影是当前的兼容性权威。
- `spec:AST-042/DEC-1` —— 每条命令都是某个编程式函数之上的薄层。
- `spec:AST-042/DEC-2` —— 每条命令的文本输出都使用同一套共享块词汇。
- `spec:AST-081` —— 哪次发布为某次运行作答、交接、每条命令在项目之外做什么，以及 `meta.answeredBy`。

### DEC-1 — Doctor is the one command a broken configured integration fails

**Decider:** `cixzhang`, `2026-10-12`

在 `astryx.config` 中指定某个集成、之后却无法加载它的项目所有者——未安装、没有清单、清单抛出异常或未通过其 schema——会得到一次红色的 `doctor` 运行，其中指出该包与原因，而不是在所有命令都静默地不使用该集成的组件、模板和文档运行时得到一次绿色的运行。命令运行会继续降级（INV11）：损坏的集成绝不能连带拖垮一次构建或一次读取，而 `doctor` 的存在就是为了说明出了什么问题。已否决：`doctor` 只警告并以退出码 0 结束（所有者的 CI 在项目配置错误时仍保持绿色）；每条命令都因损坏的集成而失败（一次读取或构建会因一个它本可绕过的问题而停止）；只统计恰好加载成功的集成（被搁置或被正在创作的包替换掉的包集合会从统计中消失）。

### DEC-2 — Every agent gets the agent docs, and an extra copy beats none

**Decider:** `josephfarina`, `2026-10-14`

Agent CLI 读取不同的文件。Codex CLI 只读 `AGENTS.md`；Claude Code 读取自己的文件，并且仅当项目没有这些文件时才读 `AGENTS.md`；Gemini CLI 读取 `GEMINI.md`；Copilot CLI 会一起读取 `AGENTS.md`、`CLAUDE.md` 和 `GEMINI.md`。没有任何一种放置方式能让每个 agent 在每个项目里都恰好拥有一份副本，因此 agent 文档从项目所提交的文件中为每个 agent 提供至少一份，并在 agent 共享文件的地方接受多余副本（INV31）。已否决：仅在 `.claude/CLAUDE.md` 中保留 Claude Code 副本——许多项目将该文件排除在版本控制之外，因此全新克隆会一份都没有。

### DEC-3 — Refusing a write outside its confined root is a fix

**Decider:** `josephfarina`, `2026-10-15`

在其受限根目录之外的写入会落在其路径所指向的任何位置，并带有调用方的文件权限，还可能替换调用方从未指定为输出的文件：源代码、配置或另一个项目的文件。Agent 会无人值守地运行 CLI 并传入生成的路径，因此一个错误路径就会丢失工作成果且无从撤销。若把拒绝留到某个次版本、或在写入仍然发生的同时发出警告，就会为了保护一种受限机制本就禁止的用法而让该暴露继续存在，因此该拒绝作为 `[fix]` 交付（INV10a）。边界很窄：受限机制已是当前状态，拒绝发生在任何写入之前，Changeset 列出每个被拒绝的输入及其迁移方式，而根目录内的写入照常工作。

已否决：以补丁形式发出警告并把拒绝留到某个次版本（警告在文件已被替换之后才打印）；以及让每一项当前不变式都优先于已发布的文档（这样任何更正都能声称自己属于补丁层级）。

### DEC-4 — A command fails on warnings only when its caller asks, with `--strict`

**Decider:** `josephfarina`, `2026-10-16`

一条会改变退出码的警告，会在某个发布新增检查或发现项时立刻让运行该命令的每次构建变红，因此默认情况下没有命令会因警告而失败。希望自己的构建被警告拦住的包通过 `--strict` 来要求这一点，它会以失败信息本已使用的格式把同样的发现项报告为错误：严格运行绝不会知道默认运行不知道的东西，而读懂一次严格失败也不需要任何新知识。已否决：默认就因警告而失败的命令（一次 CLI 升级会把绿色构建变成红色）；为每种情况另设一个不同名字的门禁标志或命令（每一个都是需要维护的新契约）。

### DEC-5 — Integration doc checks are command contracts

**Decider:** `josephfarina`, `2026-10-18`

INV33、INV34 和 INV35 说明了 `doctor integration` 所运行的 prop 与描述符类型检查，以及构建所运行的 `integration check` 命令。它们是与 INV32 并列的命令契约，因此本记录管辖它们，而 `spec:AST-039` 的 FR12、FR13 和 FR14 指向此处。已否决：仅由 `spec:AST-039` 管辖它们（草稿记录不具备管辖力）。

### DEC-6 — Integration authoring guidance requires the strict check in every build

**Decider:** `josephfarina`, `2026-10-19`

集成创作指南要求每个集成包在自己的构建中运行 `astryx integration check --strict`；CLI 标志仍保持可选加入（DEC-4）。已否决：让该检查保持可选的指南（包会带着用户最先发现的漂移发布）。

### DEC-7 — The integration check reports only what the code contradicts

**Decider:** `josephfarina`, `2026-10-19`

每个集成都在其构建中运行 `integration check --strict`（DEC-6），因此一次误报会因某个包并不存在的缺陷而使其失败，而它唯一的出路——去掉 `--strict`——也会去掉对所有真实缺陷的检查。无法判断代码是否与文档相矛盾的检查会将该项列为未检查，而 `--strict` 不会因此失败。例外是 DEC-8 的文档质量发现项、DEC-12 的文档语法发现项，以及 DEC-13 与 DEC-14 的示例发现项。已否决：把存疑项作为警告报告（`--strict` 会使其失败）。

### DEC-8 — The strict check fails on copied passages, fluff and stray pointers in docs

**Decider:** `josephfarina`, `2026-10-20`

人与 agent 都在有限的预算下阅读集成文档。写进两个主题的事实会在下次编辑时于其中一个主题里过时，而冗余内容会让每位读者付出代价。因此这些文档质量发现项经所有者决定会使 `--strict` 失败，作为 DEC-7 的例外，与 DEC-12 的文档语法发现项以及 DEC-13 和 DEC-14 的示例发现项并列。复制的段落（一段完全相同的词，在过滤掉功能词连串以及三个或更多主题共有的样板文字之后）与列出的冗余短语（代码和引文之外）都是精确匹配。密度下限是一个阈值，而不是矛盾，而某个没有任何内容的章节就是冗余内容，也就是它的极限情形。读者会静默丢弃的文档结构也会作为文档质量使 `--strict` 失败：同一个 prop 被记录两次、某个 overlay 键不指向任何 prop、两个章节使用同一个键，以及 overlay 旁边没有任何主题。短语列表与下限发布在该检查的文档中，且每个发现项都会指出该短语，或指出实测密度与下限，因此其修复是机械性的。游离指针（一个恰好为 `astryx docs <name>` 的代码片段，或一个出现在代码片段中或不在代码片段中的 `{@command docs <name>}` token（DEC-12），针对一个确实存在的文档，出现在某个主题的正文、描述或摘要中，或出现在某个组件文档的文本中）同样是精确的：替换它的 `{@link}` 会打印出打开该文档的命令，而 doctor 的链接检查随后会在该文档消失时使其失败。一条包含更多词、或位于代码块中的命令是演练，而不是指针。每一项都是警告，因此 `integration check --strict` 会因其失败，运行构建的 agent 会修复它，而 `doctor integration docs` 仍保持退出码 0。`integration check` 随这些规则首次发布，因此此前通过的构建不会新增失败。已否决：仅将它们列为信息，而 agent 会将其视为可选。

### DEC-9 — The person chooses where a gap report goes

**Decider:** `josephfarina`, `2026-10-20`

报告处理器通常汇入一个共享位置，而集成会在 `issuesUrl` 中指定自己的跟踪器。报告该送往哪个位置是对缺口的判断，因此由人来决定：CLI 列出各个位置，agent 询问，而 `--to` 承载答案。没有选择时，报告送往共享默认位置。已否决：自动把每份报告复制到集成自己的 `issuesUrl`（报告会落到没人选择的位置）；让 agent 选择目的地。

### DEC-10 — An upgrade migrates the whole project it runs in

**Decider:** `josephfarina`, `2026-10-21`

只作用于项目某个文件夹的升级不会读取该项目的任何配置，不会刷新它的任何 agent 文档，也只迁移其源代码的一部分，使项目一半停留在每个发布上却无任何提示。`spec:AST-040` FR9 让项目成为升级的单位，而一个安装了 Core 却未声明它的文件夹属于提升安装或游离的 `node_modules`，不是独立的应用，因此在那里遵循 FR9 是一个 `[fix]`（INV10b）。边界很窄：声明了 Astryx 包的文件夹保留自己的升级。

已否决：把每个安装了 Core 的文件夹都当作项目（这样工作区成员会针对其工作区并未使用的 Core 进行迁移）。

### DEC-11 — A new failing check ships under `--next` first

**Decider:** `josephfarina`, `2026-10-21`

一个会使 `integration check --strict` 新增失败的检查会先作为 `next` 注记到达各个包，这样每个包都可以运行 `integration check --strict --next`，修复它发现的问题，并领先于把注记变成警告的那个次版本发布。默认运行会给出数量与命令，因为每个包的构建都会运行它。

已否决：只在次版本发布中交付新的失败检查（包会在构建中断时才知道它），以及为每个检查单独写草案（下一个次版本的变更于是散落在许多地方）。

### DEC-12 — Doc-syntax findings are listed now and fail in the next minor

**Decider:** `josephfarina`, `2026-10-21`

Docs 使用 `spec:AST-081` FR5 的 token 来写命令，使每位读者看到自己的运行器与包管理器。`validate` 会列出某个主题针对单个包管理器写入的每条命令（`package_manager_command`）、裸写的命令（`plain_command`）或带运行器的命令（`runner_command`），以及每个无法解析或不指向任何命令的 token（`doc_token`），以 `next` 注记的形式给出应写入的 token：`integration check --strict --next` 现在就会因它们失败，而 `--strict` 从下一个次版本发布起生效（DEC-11）。它们是包的代码并不与之矛盾的文档缺陷，是 DEC-7 在 DEC-8 之后的第二个例外。

已否决：在补丁中就让 `--strict` 因它们失败（已运行该检查的包会在更新时中断），以及让它们不被检查（文档会漂移回单一包管理器）。

### DEC-13 — A package's examples are checked, listed now and failing in the next minor

**Decider:** `josephfarina`, `2026-10-21`

模板列表、文档页和目录卡片通过示例来展示一个包，每个块都单独呈现并来自已打包的包，因此包必须像 Core 那样交付它们所需的内容。`validate` 会以 `next` 注记的形式列出（并给出可粘贴的修复）：某个已发布组件没有任何块模板通过 `exampleFor` 及 `isShowcase: true` 展示它，也没有在 `alsoShowcaseFor` 中命名它（`component_without_example`；隐藏文档、家族成员、`isHiddenFromOverview` 文档和 `Utility` 组件豁免）；某个模板类别被写成路径，例如 `components/X`（`template_category`；INV34 仍允许包创作任意类别，而该注记只指出 `"<Group> - <Variant>"` 这种形式）；某个 showcase 导入了仅限服务端的代码，或在 `NODE_ENV` 之外读取 `process.env`（`showcase_not_standalone`；通过应用获取实时数据没有问题）；以及某个通过 `new URL(…, import.meta.url)` 加载的资产缺失，或被 `npm pack --dry-run` 排除（`template_asset_not_packed`；当 npm 无法作答时，没有任何 `files` 条目能够到达的资产仍会被报告，其他资产则列为未检查，INV35）。每一项现在都会使 `--strict --next` 失败，并从下一个次版本发布起使 `--strict` 失败（DEC-11）。CLI 会先通过 `exampleFor`、再通过文件夹与 `componentsUsed` 找到组件的 showcase。

已否决：在补丁中就让它们失败（已运行该检查的包会在更新时中断），以及为单个包做特殊处理（需要特殊处理的包正是检查应当覆盖的包）。

由 DEC-14 针对组件示例修订。

### DEC-14 — A component example runs on its own, by one exported rule

**Decider:** `josephfarina`, `2026-11-13`，针对 Doctor 与预览工具共享的一条规则；其细节是该决策之下 CLI 维护者的选择。

不在 `kind: 'setup'` 的组件示例会作为实时预览显示在文档页或目录中，因此它必须独立运行。`@astryxdesign/cli/authoring` 中的 `previewableExample(example, scope)` 是唯一的规则，Doctor 与预览工具都通过它读取示例，因此它们在每个示例上保持一致。`@astryxdesign/cli/api` 中的 `integrationExampleScope(pkg)` 以 JSON 返回 Doctor 读取某个包示例时所依据的作用域：`ExampleScope` 是契约，因此目录可以存储它，而预览工具可以像 Doctor 一样用它读取示例。它把示例读取为一个 TSX 模块，该模块渲染其默认导出，否则渲染它结尾的 JSX，否则渲染它声明的最后一个组件：一个函数或类，或对其中之一调用 `memo`、`forwardRef` 或 `lazy`。示例可以在不导入的情况下使用它所属包所记录的组件、Core 所记录的组件与 hook、React 的导出，以及 `globals` 包的 JavaScript 与浏览器全局对象；一个元素的名称只来自该示例或那些组件，因为诸如 `Image` 这样的全局对象并不是组件。它可以导入该包、该包在 `dependencies`、`peerDependencies` 和 `optionalDependencies` 中声明的包、React 以及 Core。仅限服务端的代码是 `showcase_not_standalone` 所指的内容（配以相同的已声明包）、该包中导入了 `server-only` 的模块，以及该包的异步组件。`validate` 会以带修复的 `next` 注记列出该规则拒绝的每个示例：`example_does_not_compile`、`example_renders_nothing`、`example_undefined_name`、`example_server_only` 和 `example_import_unresolvable`。每一项现在都会使 `--strict --next` 失败，并从下一个次版本发布起使 `--strict` 失败（DEC-11）。检查无法判断的示例，例如因无法在包旁读取 Core 的文档或 React 而无法判断其名称的示例，会列为未检查（DEC-7）。

已否决：在不导入的情况下就把该包的每个导出都纳入作用域（复制该示例的应用需要那条导入），以及为示例未定义的名称提供替身值（它们会掩盖预览所显示的内容）。

## Verification

| 不变式 | 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 失效信号                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1   | `clients/cli/commands/interactive-guard.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                          | 子进程挂起：`signal === 'SIGTERM'` 且 `status === null`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| INV2   | `clients/cli/commands/json-contract.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                              | `--json` 的标准输出无法解析，或解析出的形状不属于那两者之一。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| INV3   | `foundation/response/error-codes.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                 | 已发布的错误码消失，或某个信封携带了未注册的错误码。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV4   | `clients/cli/formatters/index.test.mjs`、`clients/cli/commands/search.test.mjs`、类型测试                                                                                                                                                                                                                                                                                                                                                                                  | `emit` 接受裸字符串，输出在管道与 TTY 之间发生变化，或文本中缩略的某个字段在 `--verbose` 或 `--json` 中缺失。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| INV6   | `pnpm check:cli-structure`                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 某个命令的文件或其文档缺失，或位于错误的路径。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV8   | `clients/cli/cli-exit-codes.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                      | 同一条件在带与不带 `--json` 时的退出行为不同。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV10b | `api/upgrade/run/run.test.mjs`（安装 Core 但未声明它的文件夹会升级其上层项目；工作区列出的成员和声明了 Astryx 的成员各自保有自身）、`clients/cli/commands/upgrade.subfolder-path.test.mjs`                                                                                                                                                                                                                                                                                 | 安装 Core 但未声明 Astryx 的文件夹只升级自身，或声明了 Astryx 的文件夹或被列出的成员升级了其上层项目。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| INV14  | `foundation/integrations/autolink.test.mjs`、`foundation/config/project.test.mjs`、`foundation/integrations/missing-dependency.test.mjs`、`test/packed-gather-cache.records.test.mjs`（一个已声明但缺失的包）                                                                                                                                                                                                                                                              | 未声明的包参与贡献，或已配置与本地的优先级发生变化。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV15  | `api/integration/add-contribution.test.mjs`、`clients/cli/commands/integration-authoring.test.mjs`                                                                                                                                                                                                                                                                                                                                                                         | 试运行路径与写入路径不同，写入器覆盖了字节，或新的贡献无法被发现。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| INV16  | `foundation/integrations/manifest-writer.test.mjs`、`api/integration/add-contribution.test.mjs`                                                                                                                                                                                                                                                                                                                                                                            | 写入器自行发明包策略、替换了作者条目，或本地字节失去了优先级。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV17  | `api/integration/pack-check.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                      | 生命周期输出、打包文件、标识或公共导入出现分歧，却未使闸门失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| INV18  | `api/integration/validate-integration.test.mjs`、`api/theme/integration-themes.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                   | 诊断会修改文件，或被选中的损坏主题包仅被报告为未知。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV19  | `clients/cli/commands/integration-real-world.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                     | 由 CLI 创作的主题、嵌套调色板或指南在 pack、install、list、add 与 build 各环节失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV20  | `pnpm check:cli-structure` 检查每个 subject 是否具有 `FunctionDoc`、typedefs 和一项测试；逐函数覆盖率与叶子布局在审查中检查                                                                                                                                                                                                                                                                                                                                                | 某个 subject 或导出函数缺少其 `FunctionDoc`、typedefs 或测试，或某个操作位于其 subject 之外。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| INV21  | 审查 `api/**` 下的导入；尚无机械检查                                                                                                                                                                                                                                                                                                                                                                                                                                       | 除 subject 的适配器之外的模块读取或写入文件、访问网络、启动子进程、加载项目或运行发现流程。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| INV22  | 审查 `clients/cli/commands/**` 下的导入；文档漂移测试装置会用实际命令校验每个 `CommandDoc`                                                                                                                                                                                                                                                                                                                                                                                 | 处理函数自行接触环境，可执行命令的 `CommandDoc` 未指明 `fn`，或目录中存在非命令文件。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| INV23  | `clients/cli/formatters/index.test.mjs` 覆盖工具集；审查处理函数；尚无机械检查                                                                                                                                                                                                                                                                                                                                                                                             | 处理函数自行填充、对齐或绘制文本，或帮助的“Output format”列表中缺少某种块类型。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| INV24  | `api/integration/add-contribution.test.mjs`、`api/integration/add-theme.test.mjs`、`foundation/discovery/theme-discovery.test.mjs`                                                                                                                                                                                                                                                                                                                                         | 新的创作产出无类型或非 `.doc.mjs` 的条目，添加一个条目就会编辑共享文件，或条目目录成为权威来源。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| INV25  | `foundation/discovery/cli-self-docs.test.mjs`、`api/doctor/doctor.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                | 没有命名空间的 CLI 文档、没有任何主题读取的命名空间，或其主题中没有任何章节，却通过了 doctor。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV28  | `test/inv28-package-provenance.test.mjs`、`clients/cli/commands/text-json-parity.test.mjs`、`cli-api-types-verify`                                                                                                                                                                                                                                                                                                                                                         | 关于某个产物的结果缺少信封 `package`，被列出的产物缺少 `package`，或文本遗漏了信封所指明的包。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV29  | `api/doctor/doctor.test.mjs`（configured-integrations：未安装、无清单、清单抛出异常；自命名的创作包，直接引用以及通过符号链接的 `node_modules` 或 `cwd`；提供方冲突搁置；一个能导入但无法加载项目的 astryx.config → `config` 检查失败）                                                                                                                                                                                                                                    | 无法加载的已配置集成让 `doctor` 停留在退出码 0，或已安装但未命名的集成使其失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| INV30  | `foundation/runtime/package-set.test.mjs`、`foundation/runtime/hosted-runtime.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                    | 一次运行从两个根解析；某个根在项目内部贡献了一个集成，包括一个随附集成清单的 `@astryxdesign/*` 包；起始副本能够回答的运行却从并非持有它的那个根解析，或在那个副本正是 `spec:AST-081` FR2 所指的发布版时被宣告为回退；另一个具名发布版能够回答的运行，却从 CLI 不是该发布版的根解析、从缺少项目将要安装的某个版本的根解析，或在更早的根已符合条件时从更晚的根解析；托管运行安装了一个发布版，或没有符合条件根的具名发布版运行未按 FR2 所述回退；查找在项目自身安装之前查询了某个根，或在没有激活的集合时进行查找；已批准的集成从另一个根解析或跳过其校验；读取了某个根的配置；一次运行写入包根内或写入了 `spec:AST-081` FR7 所列位置之外的地方；宿主条目的结果缺少已解析的包或其来源；或项目检查评判了包集合。 |
| INV31  | `foundation/agent-docs/agent-docs.test.mjs`、`foundation/agent-docs/agent-docs.path-safety.test.mjs`、`clients/cli/commands/init.behavior.test.mjs`、`api/init/remove/remove.test.mjs`、`clients/cli/commands/doctor.test.mjs`                                                                                                                                                                                                                                             | 布局测试发现 INV31 所列的某个文件缺少该区块，或在其排除的某个文件中存在该区块；对不含区块的 `AGENTS.md` 的托管导入通过了 doctor；agent 文档落到主目录或项目之外的设置目录；或 `--remove-agents` 在项目根目录或工作目录中留下了区块。                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV32  | `test/cli-strict-guard.test.mjs` 列出每个提供 `--strict` 的命令以及每个退出依赖警告的命令；`api/integration/check/check.test.mjs` 将严格运行与默认运行进行比较                                                                                                                                                                                                                                                                                                             | 第二个命令提供了 `--strict`，命令在没有 `--strict` 时仅因警告就以 1 退出，或严格运行报告了默认运行未报告的发现，或报告的发现不在该命令的问题格式之内。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| INV33  | `foundation/discovery/prop-drift.test.mjs`、`foundation/discovery/doc-consistency.test.mjs`、`foundation/discovery/type-text.test.mjs`、`clients/cli/commands/doctor-integration.test.mjs`、`test/core-prop-docs.test.mjs`                                                                                                                                                                                                                                                 | 移除或重命名的 prop 或变更的联合类型未被报告而通过，缺失的编译器被读作通过，或遗漏了 `ref`、`key`、`xstyle`、`className`、`style`、`data-testid` 或 `@internal` prop 的表格触发了警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV34  | `foundation/discovery/doc-types.test.mjs`、`foundation/discovery/doc-consistency.test.mjs`、`clients/cli/commands/doctor-integration.test.mjs`、`test/core-doc-types.test.mjs`                                                                                                                                                                                                                                                                                             | 未知、缺失或类型错误的字段未被报告而通过，或缺失的编译器被读作通过。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| INV35  | `api/integration/check/check.test.mjs`、`clients/cli/commands/integration-check.test.mjs`、`test/integration-check-failures.test.mjs`、`api/search/search.integration-check.test.mjs`、`foundation/discovery/prop-drift.test.mjs`、`foundation/discovery/type-match.test.mjs`、`foundation/discovery/doc-types.test.mjs`、`api/integration/authoring-checks.test.mjs`、`foundation/discovery/stray-pointers.test.mjs`、`foundation/integrations/cli-peer-version.test.mjs` | 默认退出码与检查自身的退出码不同；警告或被跳过的比较通过了 `--strict`；文本与 JSON 的退出不同；新增了失败的发现而列表未变化；对 ci 的搜索未能最先找到该命令；发现被报告在代码并未与之矛盾的文档上（对于类型而言，是 TypeScript 接受的类型）；或复制的段落或空泛的发现通过了 `--strict`；或功能词片段或共享样板被报告为复制；或 CLI 超出某个包的 `@astryxdesign/cli` peer 范围却被报告为警告、未通过 `--strict`、进入 `integration verify` 或未被列出；或 `next` 注记未通过 `--strict`（在缺少 `--next` 时）、在 `--strict --next` 时通过，或在默认运行中未被报告。                                                                                                                                            |
| INV36  | `api/gap-report/gap-report.test.mjs`、`clients/cli/commands/gap-report.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                           | 不带 `--to` 的运行到达了处理函数并未选择的 `issuesUrl`；`--to` 在没有 `--confirm-public` 时运行处理函数或在 GitHub 上提交文件；未知的 `--to` 发送了任何内容；或在存在目的地时，目的地列表或其中告知 agent 询问当事人的那一行缺失。                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| INV37  | `api/integration/validate-integration.test.mjs`、`api/integration/validate-integration-fixes.test.mjs`、`api/integration/pack-check.test.mjs`                                                                                                                                                                                                                                                                                                                              | 没有文档的顶层源码通过了 `--strict`（包括形如 `landing.page` 的点分模板 id），或测试、spec 或 story 文件或子文件夹辅助文件被标记出来。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

## Open questions

- **OQ1 — 信封的 `meta` 是否应携带已解析的集成集合？** （`human-api`）agent 目前无法从输出中判断：一个内容单薄的结果意味着“没有任何匹配”，还是“某个集成加载失败”。
