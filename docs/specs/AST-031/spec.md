---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-031
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: proposed
owners: [josephfarina, cixzhang]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: []
affects_consumer_docs: [authoring]
---

# Runtime integration feature composition system spec

## Intent

为运行时集成功能定义可复用的组合规则——即集成除默认清单之外还可贡献的 CLI 能力。每个功能都是集成模块的一个命名导出，并可在 `astryx.config` 中有一个配套字段。多个处理程序以叠加方式组合：每个已配置且符合条件的处理程序都在隔离中运行，失败按处理程序分别报告，而该功能定义一个聚合的命令结果，不让某个处理程序使其他处理程序沉默。

本规格先阐述通用的组合契约，然后记录针对 `gapReport` 的需求，后者是构建在该契约之上的第一个功能。

## Non-goals

- 替换默认导出的清单或其贡献模型（组件、模板、codemod、文档）。这些由 `Project` 接缝加载，不在本规格范围内。
- 为任何处理程序定义传输协议、网络目标或持久化格式。
- 提供带生命周期钩子、依赖排序或处理程序间通信的插件系统。

---

## Requirements

### General composition rules

以下规则适用于每个遵循本规格的运行时集成功能。一个功能由 `astryx.integration.{ts,mjs,js}` 中的一个命名导出标识，并可选地在 `astryx.config` 中对应一个字段。

#### Named export + matching project config field

功能以集成模块中的**命名导出**形式声明。同一功能也可以作为项目级处理程序，出现在使用方的 `astryx.config` 字段中。不认识该命名导出的较旧 CLI 版本会忽略它，并继续加载默认清单。

#### Additive composition

有效集合中的每个处理程序都会收到一份有顺序的投递结果。项目处理程序最先，随后按各集成在 `astryx.config` 中出现的顺序，依次是每个集成处理程序。符合条件的处理程序会运行；未获同意的 public 处理程序会记录 `consent_required`，而不会被调用。任何处理程序都不会覆盖或取代另一个处理程序。

#### Identity dedupe by handle function

当同一个 `handle` 函数引用在有效集合中出现多次时（例如项目配置重新导出了某个集成的处理程序），它只运行一次，位置在其首次出现处。

#### Per-handler structuredClone copy

每个处理程序都会收到事件的一份属于自己的 `structuredClone` 副本。修改自身输入的处理程序无法影响任何其他处理程序。

#### Failure isolation + aggregate response

抛出异常、超时或行为异常的处理程序会产生该处理程序的失败投递。后续处理程序仍会运行。命令的聚合响应会收集每个处理程序的投递记录，使调用方能够准确看到哪些处理程序成功、哪些失败以及原因。

#### Lifecycle / async

- **超时：** 每个处理程序有 30 秒的实际耗时超时，并会收到一个在该预算耗尽时触发的 `AbortSignal`。
- **异步：** 处理程序可以是异步的；CLI 会逐一等待每个处理程序完成。
- **执行顺序：** 处理程序按有效集合的顺序串行运行。某个处理程序失败不会跳过后续处理程序。

#### Per-handler consent metadata

每个处理程序声明 `audience` 为 `'internal'` 或 `'public'`。CLI 按处理程序执行同意检查：除非调用方已明确确认 public 写入，否则不会调用 `public` audience 的处理程序。`internal` 处理程序无需额外确认。

#### Inspectable consent (consent_required delivery)

当调用方尚未确认同意而某个处理程序需要同意时，CLI 会为该处理程序记录一条 `consent_required` 投递，而不调用它。调用方可以查看哪些处理程序需要同意，然后再带确认重新运行。

#### Fallback behavior

内置回退（例如通过 `issuesUrl` 打开 GitHub issue）**仅**在去重后有效处理程序集合为空时启用。只要存在任何已配置的处理程序——项目级或集成级——就会完全抑制该回退。

#### issuesUrl is target metadata

集成清单或项目配置上的 `issuesUrl` 描述人类可读 issue 链接的目标。它是关于目标包的元数据，而不是处理程序实现。处理程序将其用作上下文；CLI 将其用于回退路由。

#### Mutation-sensitive tests

基于该组合模型构建的功能，其测试必须覆盖扇出顺序、隔离、去重、超时、同意门禁、consent-required 检查、回退抑制以及聚合响应形状。移除任何 fail-closed 守卫都必须使某个测试失败。

---

### Gap-report-specific requirements

`gapReport` 是构建在上述通用组合规则之上的第一个功能。

- **FR1 — 处理程序类型。** gap 报告处理程序是一个符合 `GapReportHandler` 的普通对象：`{ audience: 'internal' | 'public', handle: (event: GapReport, context: { signal: AbortSignal }) => GapReportHandlerReceipt | Promise<GapReportHandlerReceipt> }`。`GapReportHandler` 取代 `GapReportWriter`。

- **FR2 — 事件形状。** `GapReport` 事件携带 `schemaVersion: 1`、纯 camelCase 字段名、归一化后的值，以及一个包含 `{ package, version, issuesUrl }` 的 `target` 对象。不使用 snake_case，不使用缩写，不带嵌套的调试上下文。

- **FR3 — 回执契约。** 处理程序必须返回 `GapReportHandlerReceipt`：`{ status: 'filed' | 'routed_only' | 'skipped', url?: string, message?: string }`。不接受其他 status 值。`url` 与 `message` 是可选字段，承载人类可读的上下文。

- **FR4 — 处理程序隔离。** 每个处理程序都在隔离中运行：
  - 每个处理程序在自己的 worker 中运行。`stdout` 被重定向到 `stderr`，`process.exit`、`process.exitCode` 以及延迟的 promise 后续执行都被限制在该 worker 内。
  - 抛出异常或超时（30 s）会产生该处理程序的失败投递。CLI 会中止该处理程序的 signal，然后在启动下一个处理程序之前终止其 worker。
  - 失败的处理程序不影响命令自身的退出码，也不影响其他处理程序。

- **FR5 — 没有继承式处理程序退出机制。** gap 报告处理程序没有类似 `inheritDebug` 的退出机制。有效集合中的每个 internal 处理程序都会运行，每个 public 处理程序都会收到结果，且仅受显式同意门禁约束。`package.json` 中的 `inheritDebug` 字段是 `debug` 功能特有的兼容性例外（见决策日志 DEC-2）；它不为其他功能开创先例。

- **FR6 — 有效集合。** 有效处理程序集合为：项目配置的 `gapReport` 处理程序在前（若存在），然后按 `astryx.config` 中的集成顺序，依次是每个集成的 `gapReport` 命名导出。去重依据 `handle` 函数标识。

- **FR7 — 目标选择。** gap 报告的目标包按以下方式选择：显式 `--package` 标志 → 当只有一个包拥有该组件时的唯一组件所有者 → 默认的 Core。目标选择不基于处理程序数量或处理程序来源。

- **FR8 — 内置 GitHub 回退。** 当有效处理程序集合为空（去重后零个处理程序），且目标具有 GitHub `issuesUrl` 时，CLI 会提议通过 `gh issue create` 提交。该回退受同意门禁约束（`public` audience）。任何其他 `issuesUrl` 方案只会产生 `routed_only` 回执。只要存在至少一个处理程序，该回退就会被完全抑制。当 `gh` 在 PATH 上时，无论其登录状态如何，`astryx swizzle` 的回执都会提供其 `gh issue create` 行。未登录的 `gh` 会在该行运行时请求自行登录。文本回执显示该命令；JSON 回执保留该命令与 issues URL。

- **FR9 — 项目配置字段。** `astryx.config` 新增 `gapReport` 字段，接受一个 `GapReportHandler`。这是项目级处理程序，在有效集合中最先运行。

- **FR10 — 集成命名导出。** 集成在其集成模块中以 `export const gapReport: GapReportHandler` 声明其处理程序。该命名导出故意不是默认清单字段，这与 `debug` 功能的导出约定一致。

- **FR11 — 按处理程序的同意。** 每个处理程序的 `audience` 独立评估。受众混合的扇出会无条件调用 `internal` 处理程序，并对 `public` 处理程序施加调用方同意门禁。即使某个受门禁约束的兄弟处理程序被阻止，未受门禁约束的处理程序仍会运行。

- **FR12 — 聚合响应。** 命令的响应包含 `deliveries` 数组，每个有效处理程序或回退对应一个条目。每条投递记录 `handlerType`、`handler`、`audience`、`status`、`url` 与 `message`。响应形状在 `--json` 与人类可读输出模式下相同。

- **FR13 — 调用方指定的目标。** 当调用方用 `--to` 指定目标时，该目标会替换该报告的处理程序与 FR8 回退。`architecture:cli-surface` 的 INV36 规定该选项以及由谁选择目标。

#### Platform support

- 支持：Node >= 22.13，以及 CLI 支持的任何操作系统。
- 不支持：依赖网络访问、原生二进制或平台特定 API 的处理程序由处理程序作者负责；CLI 提供隔离，但不提供能力检测。

---

## Current-state impact

`debug` 已经把每个集成命名导出与一个项目函数组合起来，采用项目优先、配置顺序的投递方式，并具备标识去重与按处理程序的副本。其同步的进程退出生命周期与现有的 `inheritDebug` 兼容性开关保持不变。

PR #6200 最初选择单个可执行的 gap writer。本规格在发布前取代该模型：`gapReport` 变成一个项目处理程序加上每个已加载的集成处理程序，每个处理程序返回自己的回执。没有处理程序的现有使用方仍保留受同意门禁的 `issuesUrl` 回退。由于单 writer 形态尚未发布，没有已发布的配置或集成 API 需要迁移。

---

## Verification

| 契约     | 验证                                  | 代表性状态                                                                                   | 变更或失败预期                                                     |
| -------- | ------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| FR1–FR3  | gap 报告处理程序类型与回执契约测试    | 有效处理程序；缺少 audience；错误的 status 值；返回非对象                                    | 无效的处理程序形状或回执被静默接受                                 |
| FR4      | 处理程序隔离测试                      | 处理程序写 stdout；处理程序调用 process.exit；处理程序抛异常；处理程序超过 30 s              | stdout 污染进入 JSON 信封，或退出/抛异常使后续处理程序停止         |
| FR5      | 无退出机制断言测试                    | 项目在 package.json 中设置 `inheritDebug: false`；gap 报告处理程序仍运行                     | 退出机制抑制了 gap 报告处理程序                                    |
| FR6      | 有效集合排序与去重测试                | 项目 + 两个集成；重复的 handle 引用；仅项目；仅集成                                          | 顺序错误、重复执行或缺少处理程序                                   |
| FR7      | 目标选择测试                          | 显式 package；唯一所有者；需要 `--package` 的歧义所有者；无组件匹配                          | 处理程序数量影响目标、歧义被猜测，或未知组件未默认到 Core          |
| FR8      | 回退启用与抑制测试                    | 零处理程序 + GitHub issuesUrl；零处理程序 + 非 GitHub issuesUrl；存在一个处理程序            | 存在处理程序时回退仍触发，或非 GitHub issuesUrl 声称已提交         |
| FR9–FR10 | 配置字段与命名导出加载测试            | 带 gapReport 的项目配置；带命名导出的集成；两者都存在；两者都不存在                          | 配置字段被忽略、命名导出被忽略，或旧 CLI 在命名导出上出错          |
| FR11     | 混合受众同意测试                      | 全部 internal；全部 public 且已同意；全部 public 且未同意；混合且部分同意                    | public 处理程序未获同意即运行，或 internal 处理程序被同意门禁阻止  |
| FR12     | 聚合响应形状测试                      | 全部成功；一个失败；一个超时；consent_required 条目；空集合（回退）                          | 缺少投递条目、来源归属错误，或 --json 与人类可读输出的响应形状不同 |
| FR13     | 指定目标测试                          | `--to` 指定带 GitHub issuesUrl 的集成，含已同意与未同意两种情况；非 GitHub issuesUrl；未知包 | 处理程序在 `--to` 下运行，或未知目标发送了任何内容                 |
| General  | 变更敏感的组合测试（structuredClone） | 处理程序修改事件字段；处理程序向事件添加属性                                                 | 变更泄漏到后续处理程序                                             |

---

## Decision log

### DEC-1 — Handlers compose additively; no single-writer selection

**参考：** `spec:AST-031/DEC-1`

**决策者：** `josephfarina`，`2026-09-10`

每个已配置的处理程序都会运行。先前的模型基于目标所有权选择一个 writer，这意味着集成无法观察到与其不拥有的组件相关的报告。叠加式组合让每个相关方都能收到每份报告，同时把失败隔离到单个投递。

已否决：按目标所有权进行单 writer 选择；由项目处理程序压制集成处理程序的优先级覆盖；“先匹配者胜出”路由。

### DEC-2 — No general opt-out mechanism for runtime features

**参考：** `spec:AST-031/DEC-2`

**决策者：** `josephfarina`，`2026-09-10`

`debug` 功能现有的 `inheritDebug` 开关仍是该功能拥有的兼容性例外。它不建立通用的 `inherit<Feature>` 约定。gap 报告是一个显式命令，其目的就是通知每个已配置的处理程序，因此加载一个集成即表示选用其处理程序。任何未来的退出机制都需要单独的所有者决策。

已否决：把 `inheritDebug` 自动克隆为通用的 package.json 模式；新增 gap 报告退出机制，静默阻止已加载的集成收到显式报告。

### DEC-3 — Target selection uses component ownership, not handler count

**参考：** `spec:AST-031/DEC-3`

**决策者：** `josephfarina`，`2026-09-10`

gap 报告的目标包是拥有该组件的那个包。当多个包声称拥有同名组件时，CLI 要求显式提供 `--package`，而不是猜测。没有精确所有者的名称默认归为 Core。处理程序数量与处理程序顺序从不改变目标归属。

已否决：按处理程序数量或集成顺序选择目标；静默选择歧义所有者中的一个；把目标所有权分发给每个提供处理程序的包。

## Open questions

无。
