---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-042
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-09-24
phase: accepted
owners: [josephfarina]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: [contributing:cli-conventions]
affects_consumer_docs: []
---

# CLI command admission and programmatic parity system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/cli/clients/cli/**", "packages/cli/api/**"]
}
```

## Intent

Agent 从 Astryx CLI 的帮助、清单以及自己的笔记中学习它，并通过程序化 API 为同样的操作编写脚本。每发布一个命令、子命令和选项，都会成为 agent 所依赖的表面，删除其中任何一个都是破坏性变更。在编写代码之前，贡献者需要知道新行为应归属于现有命令、新选项、新子命令还是新顶级命令，以及它们各自需要什么。

本记录规定每类 CLI 表面在添加之前需要什么，规定“每个命令都是一个有文档、有测试的程序化函数之上的薄层”这条规则，并规定人类可读输出可以使用的词汇。

## Non-goals

- 命令、API、适配器和格式化器代码位于何处，以及哪些模块可以读取环境。`architecture:cli-surface` INV20–INV23 拥有该结构。
- 可发现性、环境变量、全局选项和配置。`spec:AST-017` FR14–FR20 拥有这些规则。
- 对删除、重命名、行为变更、弃用或不兼容修复进行分类。[`spec:AST-017`](../AST-017/spec.md) 拥有兼容性与发布生命周期。
- JSON 封装、错误码和生成的帮助。`architecture:cli-surface` INV2、INV3 和 INV7 拥有它们。
- 等效的内部实现只要满足本契约，仍然有效。

## Requirements

- **FR1 — 每个命令都是一个程序化函数之上的薄层。** 执行某项操作的每个命令或子命令，MUST 通过调用从 `@astryxdesign/cli/api` 导出的一个函数来执行该操作。以相同输入调用时，该函数 MUST 执行相同的操作，并返回该命令在 `--json` 下输出的相同结果。命令只增加参数解析、渲染和退出状态；渲染 MAY 利用 CLI 的调用方式（例如包管理器的运行前缀）来组织提示语。它 MUST NOT 读取项目状态、更改文件、访问网络，或产生该函数不会产生的结果字段或效果。只对子命令进行分组的命令不受此限，仅描述 CLI 自身的命令（例如 help、版本或能力清单）也不受此限。本需求点名 `@astryxdesign/cli/api`，因为自动化在 `spec:AST-017` FR14 下依赖它。
- **FR2 — 程序化 API 有文档且有测试。** 从 `@astryxdesign/cli/api` 导出的每个函数 MUST 有参考文档，说明其参数、每个选项及其默认值、其结果类型、它可以返回的错误码，以及至少一个示例。测试 MUST 覆盖每个成文选项、每种结果类型和每个成文错误码，并且在该行为被移除时 MUST 失败。每个命令还 MUST 有测试，用于运行 CLI 并检查其 `--json` 结果、人类可读输出和退出状态，至少覆盖一个成功案例和一个失败案例。
- **FR3 — 人类可读输出使用同一套共享词汇。** 人类可读输出 MUST 只使用生成的帮助所记载的块类型：Record、Section、List、Text 和 Code。Text 块承载散文式文字。条目和字段值 MUST 使用 Record、Section 或 List 块，绝不使用命令自己用字符拼出的列或表格。在文档来源中撰写的内容，例如参考文档中的标题或表格，遵循同一规则。命令 MUST NOT 定义自己的输出格式。当没有现有块能在不丢失读者所需信息的前提下表达某种输出时，例如一张大到无法按记录阅读的表格，答案是新增一种共享块类型，而不是某个命令专用的渲染器。新增块类型会改变每个命令的输出，因此它 MUST 由该证据证明其必要性，MUST 对每个命令可用，并且 MUST 在同一次变更中出现在生成的帮助里。
- **FR4 — 新表面按层级准入。** 每项新增在合并之前 MUST 通过其所在层级的测试。
  - **顶级命令。** 新的 `astryx <command>` MUST 引用一份授权它的当前系统规格，且该规格已由审批负责人（知识 schema 的 `approvalOwners` 中列出的负责人）批准。该规格 MUST 说明：使用方或 agent 有一个现有命令无法回答的问题；最接近回答该问题的现有命令，以及为何扩展该命令是错误的；该命令承担的单一职责，且该职责的表述不使用 “and” 连接；为何它的结果是数据而非散文，散文属于 docs 主题；以及 FR1 所要求的那个函数。
  - **子命令。** 新子命令 MUST 停留在其父命令的单一职责之内。其 pull request MUST 说明它回答的问题、为何父命令上的选项或现有子命令上的选项无法回答该问题，以及 FR1 所要求的那个函数。CLI 包的一位代码所有者 MUST 批准它。
  - **选项。** 现有命令上的新选项 MUST 满足 FR5 和 `spec:AST-017` FR14–FR15。常规审查即可。

  未通过其层级测试的行为不会在该层级准入。它转而成为一个选项、一个子命令、一个 docs 主题，或对现有命令的改进。

- **FR5 — 选项以可预测的方式改变命令的产出。** 选项 MUST 收窄或重定向其命令已经在做的工作，且 MUST NOT 给命令增加第二项职责。其默认值 MUST 是对大多数调用者正确的结果。布尔选项 MUST 默认关闭；默认开启的行为应提供一个具名的退出选项，而不是一个默认为 true 的标志。只改变同一结果呈现方式的选项属于全局呈现选项，MUST 满足 `spec:AST-017` FR15。同一个选项名在拥有它的每个命令上 MUST 含义相同、拼写相同，并且任何命令都不得仅仅因为同级命令有某个选项就携带该选项。选项 MUST NOT 为了绕开某个缺陷而存在。命令上的每一对选项都 MUST 有已决定的结果：它们可以组合且有测试证明，它们会被一起拒绝并返回稳定的错误码，或者已有另一条规则阻止该组合。
- **FR6 — 移动表面也是一次准入。** 重命名命令、把行为移入新命令，或将子命令提升为顶级命令，都是在新的层级上准入，MUST 通过该层级的测试。删除和重命名还遵循 `spec:AST-017` FR1–FR8 和 FR31：删除落在已声明的小版本中，并带有其 `[breaking]` Changeset；当下一个发布是补丁版本时，该命令先被弃用（FR28）。
- **FR7 — 精确查找的准入先对批量能力分类。** 在编写代码之前，每个带精确选择器位置的命令或子命令 MUST 依据 `spec:AST-053` FR11 E1-E5 对该位置进行分类。符合条件的表面 MUST 在其首个公开版本中使用 AST-053 的批量契约。不符合条件的顶级命令 MUST 引用一条当前命令归属记录，该记录点名了未通过的条件；草稿不能使该排除获得准入。不符合条件的子命令 MUST 在其准入 pull request 中点名该条件，并仍遵循 FR4 的代码所有者批准门槛。在类型化准入元数据落地后，其 CommandDoc MUST 保留相同的分类。现有的符合条件命令遵循 AST-053 的增量迁移规则。隐藏选项 MUST NOT 使批量能力变为可选，也不得绕过本分类。

### Platform support

- 支持的 feature/engine 下限：每个受支持的 CLI 运行时。
- 不支持的行为：无。
- 浏览器证据：不适用。

## Current-state impact

`architecture:cli-surface` INV20–INV23 把 FR1–FR3 落实到代码中：API 主体的布局、作为主体访问环境唯一途径的适配器、薄命令处理器，以及封闭的格式化器套件。`contributing:cli-conventions` 为贡献者重述了 FR4 和 FR5。它尚未重述 FR7，且 CommandDoc 没有类型化的 AST-053 资格字段；把该规则投射到那里并添加仓库检查属于已知的执行缺口，将单独落地。

CLI 有 17 个顶级命令。28 个命令和子命令的命令文档都点名了它们所调用的函数。已知缺口如下，本记录不为它们分配迁移：

- component、discover、layout、search、template 和 theme 处理器自行读取项目状态或文件（FR1）；
- theme 处理器用字符拼出它的目标表格，docs 处理器用自己的代码渲染撰写的标题和表格（FR3）；两者都是 FR3 下一个共享块类型的候选，而不是两个命令专用渲染器；
- 若干 API 主体在适配器之外读取或写入环境，且 `integration` 主体保留着没有叶节点的扁平模块（`architecture:cli-surface` INV20–INV21）；
- 14 个导出函数的参考文档没有说明它们可以返回的错误码，其中大多数位于 `integration` 主体（FR2）；
- 结构检查确认每个 API 主体至少有一份参考文档、一个 typedef 文件和一项测试，但不确认每个导出函数或命令都被覆盖（FR2）。

目前没有任何机械检查强制执行 FR1、FR2 中按函数划分的部分、FR3、FR4、FR5、FR7、`architecture:cli-surface` INV21，或 INV22 与 INV23 的大部分。审查会把这些规则应用到每项新变更；在机械检查落地之前，新的违规只会在审查中失败。检查本身以及上述缺口的闭合将作为单独变更落地。

本规格变更不改变任何运行时行为或已发布的包，也不需要 Changeset。

## Verification

| Contract | Verification                                                                                   | Representative states                                      | Mutation or failure expectation                                                        |
| -------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| FR1      | 从清单生成命令清单，并与 `@astryxdesign/cli/api` 的导出相匹配；在同一输入上成对运行 CLI 与 API | 每个可执行的命令和子命令；一个分组；清单                   | 某个命令没有对应的导出函数，或输出了其函数不会产生的字段或效果                         |
| FR2      | 针对每个导出的参考文档清单；逐函数测试；命令级 CLI 测试                                        | 每个选项、结果类型和成文错误码；每个命令一个成功与一个失败 | 移除某个成文行为后，所有测试仍然通过                                                   |
| FR3      | 每个命令的文本输出快照；帮助快照                                                               | 每种块类型；一个条目列表；一个形如表格的结果               | 某个命令打印出成文档块之外的布局，或新块类型没有出现在帮助中                           |
| FR4, FR6 | 准入 pull request 及其引用的权威                                                               | 顶级命令、子命令、选项、重命名、提升                       | 顶级命令在没有当前规格的情况下落地，或子命令在没有明确案例和代码所有者批准的情况下落地 |
| FR5      | 每个命令的选项组合测试                                                                         | 每个选项对；一个布尔默认值；一个共享选项名                 | 某一对选项没有已决定的结果、布尔选项默认为开，或同一个名称有两种含义                   |
| FR7      | 依据 AST-053 E1-E5 及其层级所需证据进行准入审查                                                | 符合条件的新查找；顶级命令与子命令的排除；草稿             | 符合条件的表面仅支持单条，或某项排除缺少其层级所需的证据                               |

## Decision log

### DEC-1 — Commands are thin layers over the programmatic API

**Reference:** `spec:AST-042/DEC-1`

**Decider:** `josephfarina`, `2026-09-24`

一个函数拥有每项操作。运行命令的 agent 与为 API 编写脚本的 agent 得到相同的结果，而行为只在它所在之处测试一次。命令只负责把参数变成一次调用，把结果变成输出。

已否决：在命令处理器中实现行为，以及只有该命令才提供的功能。两者都会与 API 产生偏移，且自动化无法触达它们。

### DEC-2 — One output vocabulary for every command

**Reference:** `spec:AST-042/DEC-2`

**Decider:** `josephfarina`, `2026-09-24`

agent 会对文本输出执行 grep，而人们阅读它。一小组块让每个命令的输出保持可预测，并让它始终是 JSON 结果的一个视图。

已否决：命令专用渲染器和用字符拼出的表格。它们会与 JSON 结果以及彼此之间产生偏移，而且每一个都是 agent 必须单独学习的格式。

### DEC-3 — Admission bars scale with permanence

**Reference:** `spec:AST-042/DEC-3`

**Decider:** `josephfarina`, `2026-09-24`

顶级命令是每个 agent 工作集中一个永久的概念，因此它需要一份来自审批负责人的当前规格。子命令存在于某个命令的职责之内，因此一个明确的案例加上代码所有者的批准就足够。选项收窄命令已经在做的工作，因此选项规则和常规审查就足够。

已否决：对所有新增采用同一门槛，这要么挡住小选项，要么让顶级命令过于容易进入；以及为了让行为更容易被找到而新增顶级命令，因为在 `spec:AST-017` FR14 下，帮助和文档已经让行为可发现。

### DEC-4 — Exact lookups classify batching during admission

**Reference:** `spec:AST-042/DEC-4`

**Decider:** `josephfarina`, `2026-10-01`

批量形态是查找公开表面的一部分，因此准入在实现之前就应用 AST-053 E1-E5。证据仍遵循 DEC-3 的永久性层级：顶级命令需要一份当前记录，子命令需要 pull request 加上代码所有者批准；在类型化元数据落地后，CommandDoc 保留该结果。

已否决：让每个符合条件的命令保持仅支持单条，或把批量能力藏在选项之后，这会使等效的只读查找得到不同的自动化契约；以及为每个子命令排除要求一条新的系统记录，这会使分层门槛失效。

## Deprecation and cleanup descriptions

这些表格为读者描述弃用与移除；移除的关卡是已声明的小版本及其 `[breaking]` Changeset（`spec:AST-017` FR31）。

### DEP-0006 — Deprecate the `astryx layout` command group

| Field            | Value                                                                                                                                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id               | `DEP-0006`                                                                                                                                                                                                                           |
| cleanup          | `CLN-0006`                                                                                                                                                                                                                           |
| package          | `@astryxdesign/cli`                                                                                                                                                                                                                  |
| surface          | CLI 命令组：`astryx layout`（`expand`、`check`、`grammar`），它的三种 JSON 响应类型（`layout.expand`、`layout.check`、`layout.grammar`），以及从 `@astryxdesign/cli` 导出的程序化 API `layoutExpand`、`layoutCheck`、`layoutGrammar` |
| old contract     | 解析、校验压缩的 XLE/XLO 表达式并展开为 XDS TSX；带规范表面回显的表达式校验；带别名表的语法速查表                                                                                                                                    |
| replacement      | `astryx build` 选择最接近的模板作为起点。`astryx template <name> <path>` 为其生成脚手架。`astryx docs layout` 讲解布局原则（脚手架、结构、间距、断点）。                                                                             |
| warning          | 人类模式：每次调用输出一行 stderr，点名 DEP-0006 和替代命令。JSON 模式：响应封装中的 `meta.deprecations` 数组，每个条目为 `{id, replacements}`，与成文的封装 schema 一致。                                                           |
| migration        | 非机械式。XLE/XLO 表达式语言在替代命令中没有源码层面的等价物。使用 `astryx build` 找到合适的模板，用 `astryx template <name>` 为其生成脚手架，然后直接编辑脚手架代码。                                                               |
| codemod          | 无 —— 空泛：表达式是临时输入，不是 codemod 可以重写的已持久化源代码。                                                                                                                                                                |
| downstream       | 维护中的 agent 文档把 `build` 教作入口。布局指南（`astryx docs layout`）不受影响。                                                                                                                                                   |
| direct authority | `spec:AST-042`（CLI 命令准入与程序化一致性）                                                                                                                                                                                         |
| state            | `deprecated`                                                                                                                                                                                                                         |

### CLN-0006 — Remove the `astryx layout` command group

| Field     | Value                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ |
| id        | `CLN-0006`                                                                                                                     |
| lifecycle | `DEP-0006`                                                                                                                     |
| delta     | 移除命令注册、API 导出（`layoutExpand`、`layoutCheck`、`layoutGrammar`）、CLI 绑定、命令文档、测试，以及 `layout.*` 响应类型。 |
| rollback  | 用与最终补丁基线相同的 API、响应类型和测试重新注册该命令组。                                                                   |
| state     | `pending` —— 落在已声明的小版本中，并带有其 `[breaking]` Changeset                                                             |

## Open questions

无。
