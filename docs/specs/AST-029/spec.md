---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-029
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:knowledge-contracts]
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Component audit contract backfill and auto-merge system spec

## Intent

只定义安全运行整组件审计所需的附加行为：哪些组件参与，当组件契约缺失或不完整时审计如何进行，哪些修复可以随审计一起提交，以及 Night Watch 审计何时可以自动合并。

本规格建立在现有的组件规格系统之上。组件契约的形状、权威、所有权、批准、冲突处理以及语义 API 规则仍由以下记录拥有：

- [`docs/templates/knowledge/component-spec.md`](../../templates/knowledge/component-spec.md) 以及匹配的带版本的知识 schema；
- [`architecture:knowledge-contracts`](../../architecture/knowledge-contracts.md)；
- [`spec:AST-002`](../AST-002/spec.md)；以及
- 每个组件现有的 `<Name>.spec.md`。

## Non-goals

- 定义第二套组件规格格式、撰写指南、schema 或批准路径。
- 把组件、家族、设计、架构、使用方文档或审计的事实复制进新记录。
- 在观察性回填期间新增、改进、移除或重新解释组件行为。
- 取代评分、晋升或审查模式的 issue 与账本规则。
- 裁决通用的组件测试质量评分标准。

## Requirements

- **FR1 — 单一审计名册。** 审计队列与 Component Audits sandbox 表必须使用同一份已检入的公共组件名册。目标名册包括 Core、Lab、Charts、Rich Text 与 Vega。仅当现有规范知识系统识别并校验了某个包的组件记录位置之后，该包才能进入活跃审计名册；审计不得自行发明仅用于审计的规格路径。
- **FR2 — 现有组件契约保持为规范来源。** 审计必须从最近的当前组件或模块契约开始，并沿其链接追踪到当前的家族、设计、架构与系统权威。审计必须使用现有的组件模板与 schema，而不得创建并行的契约形状。
- **FR3 — 缺失的契约沿用现有规格流程。** 当组件契约缺失或不完整时，审计者可以使用现有模板、schema、权威规则与精确 head 的所有者批准流程，准备或补全一份 `<Name>.spec.md` 草稿。缺失的草稿不得阻止依据当前权威与可检查证据进行评分。
- **FR4 — 回填仅为观察性质。** 审计撰写的组件契约必须描述已核实已发布的行为，且不得新增、改进、移除或重新解释行为。提议的语义仍是悬而未决的问题，或交由所有者另行决策。草稿不能把审计发现当作既定策略予以清结。
- **FR5 — 审计完整性记录在组件契约之外。** 审计 PR 必须附带一份闭环的证据回执。其有限清单来自公共导出与类型、已记录的概念与变体、可通过公共 API 到达的状态与转移，以及可从这些表面到达的实现分支。仅当证据表明具有相同的可观察契约时，等价输入才可以共用一行。每一行都指出相关源码、现有测试、使用方文档、渲染证据、适用的当前权威或客观标准，以及任何冲突或缺口。该回执是审计证据；它不会给组件规格 schema 增加必填小节。
- **FR6 — 现有权威解决冲突。** 审计者必须适用 `architecture:knowledge-contracts` 与 `spec:AST-002`。当前共享权威与客观标准管辖其范围。当前记录之间的冲突，或需要新的 API、兼容性、所有权或设计判断的问题，会中止客观补救并转交所有者。
- **FR7 — 客观补救可以与审计 PR 共用。** 一个 Night Watch PR 可以将观察性的组件契约编辑，与缺失的行为测试、稳定的视觉回归覆盖、使用方文档漂移修复，以及所需结果已确定的实现缺陷合并在同一个 PR 中。基线证据与每项修复的前后对照证明必须保持彼此独立。
- **FR8 — 人工边界以失败关闭收场。** 公共 API 的语义或形状、默认值、兼容性或迁移承诺、所有权边界或冲突，以及主观的表征、比例、密度或交互手感决策，必须保持人工审查，且不得自动合并。
- **FR9 — 审计模式保持彼此区分。** Night Watch 不保留任何常规的逐发现 issue，只记录其修复后账本结果。评分与晋升保留其现有的逐 BLOCK issue 与记录程序。共享审计提示必须保留所选模式。
- **FR10 — 自动合并需要一份精确 head 的资格报告。** Night Watch 审计者必须输出一份带版本、机器可读的报告，其中包含组件与包、审计模式与评分标准版本、被审计的仓库与组件契约 head、FR5 清单闭环、未解决的客观与人工缺口、补救及其前后证据、必需的批准状态、必需的检查状态，以及带理由的失败关闭资格判定。可信检查必须针对当前 PR 与 head 校验该报告，在其摘要中公布每一项未满足的条件，并投影出所需的 `audit-eligibility` 状态。该报告可以存放在可信的 PR/检查元数据中；它不得要求第二份已检入的审计记录。任何缺失、过期、不一致或不合格的报告都会让 PR 保持开放以供人工审查。
- **FR11 — 启用是独立、明确且原子的。** 在本记录同时处于 `authority: current` 与 `phase: shipped`，且启用变更已将审计提示、wiki 程序、规范包/规格覆盖、名册使用方、资格检查与聚焦测试一并落地之前，自动合并始终不可用。缺少完整启用的批准不会改变运行时行为；每一个审计 PR 都保持仅人工审查。本规格不要求组件模板或 schema 迁移，因为 FR5 将仅审计专用的证据保留在组件契约之外。

- **FR13 — 审计数据遵循现有存储权威。** 持久的产品行为保留在组件的 `.spec.md` 中。按照 [`architecture:knowledge-contracts`](../../architecture/knowledge-contracts.md)，自动化 wiki 的 `component-scores.json` 仍是当前修复后分数与未解决发现的运维数据存储；未启用的逐组件审计文件不是迁移目标。审计 PR 保存可审查的运行证据，可信 Check Run 保存 FR10 的精确 head 机器报告。任何未来的数据存储变更都需要单独的自动化迁移与切换契约。

- **FR14 — 评分使用已组装的可适用契约。** 每个审计小节必须对来自当前全局权威与客观标准、当前家族契约，以及当前组件/模块契约的适用要求进行评分。每一项要求映射到一个小节评分和一个证据结果，因此一个缺陷不会被重复计数。`N/A` 要求会被排除；不可用的证据采用评分标准现有的 `not_measured` 行为。现有的严重级别、权重、等级区间与 BLOCK 上限保持不变，除非评分标准明确对评分变更做了版本化。
- **FR15 — 权威变更使受影响的分数失效，而非全局标度。** 对当前组件/模块契约的变更会使该组件的审计失效。当前家族或全局权威的变更会使每一个已链接的可适用组件失效。只有在评分方法、权重、严重级别或证据处理发生变更时，评分标准版本才变更；权威变更本身会在同一标度上触发有针对性的重新审计。

### Platform support

- 支持的 feature/engine 下限：仓库支持的 Node、浏览器与 CI。
- 不支持的行为：无法解析的组件或缺失的证据仍是一个显式审计缺口，而不会消失或通过。
- 浏览器证据：可见性与交互相关的断言使用审计评分标准及适用当前记录所要求的真实浏览器证据。

## Current-state impact

本已接受的规格不改变任何审计自动化或组件契约 schema。后续实现将更新共享审计名册及其 sandbox 视图、审计提示与模式处理、Night Watch 程序，以及失败关闭的资格检查。这些变更与本次规格 PR 保持分离。

## Verification

| Contract  | Verification                                      | Representative states                                                             | Mutation or failure expectation                                                            |
| --------- | ------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| FR1       | 规范知识路径覆盖，加上名册与 sandbox 的一致性测试 | 全部五个目标包；不受支持的包；新组件；私有 helper                                 | 某个包在其组件记录成为规范之前就被审计、队列与 sandbox 出现分歧，或符合条件的组件消失。    |
| FR2–FR6   | 使用现有组件记录的审计测试夹具                    | current；draft；missing；有限的公共状态清单；等价输入；本地漂移；冲突             | 审计发明了第二套契约形状、遗漏了可到达的公共状态、草稿变成了策略，或冲突被奉为定论。       |
| FR7–FR10  | 模式、报告 schema、可信校验与资格测试             | 安全的客观修复；API/默认值/所有权/设计边界；带缺口的回执；过期 head；缺少批准     | 不安全或不完整的工作被自动合并、过期报告清除了状态，或某个模式套用了另一个模式的生命周期。 |
| FR11      | 权威/阶段与启用测试                               | draft；current/proposed；current/accepted；current/shipped 但接线不完整；完全启用 | 自动合并先于显式状态启用，且所有必需表面未一并落地。                                       |
| FR12      | TDD 轨迹与行为测试审查                            | 已确定的接缝；未确定的接缝；红失败；最小绿切片；与实现耦合的测试                  | 生产代码变更先于红失败、发明了未确定的接缝，或测试未观察契约却通过了。                     |
| FR13      | 存储边界测试                                      | wiki 账本；PR 证据；Check Run 报告；尝试的逐组件日志                              | 审计数据被重复、写到了错误的所有者名下，或从未获批准的数据存储中读取。                     |
| FR14–FR15 | 评分与新鲜度测试                                  | 全局/家族/组件要求；N/A；未测量；本地与共享权威变更                               | 缺陷被重复计数、某项要求被遗漏，或受影响的分数错误地保持为当前。                           |

## Decision log

### DEC-1 — Audits reuse the existing component-specification system

**Reference:** `spec:AST-029/DEC-1`

**Decider:** `cixzhang`, `2026-09-06`

审计回填使用现有的组件模板、schema、权威模型与组件记录。仅审计专用的完整性证据保留在审计回执中。

已否决：创建第二套组件规格指南，或给每个组件契约添加审计工作流字段。

### DEC-2 — Backfill and settled remediation may travel together

**Reference:** `spec:AST-029/DEC-2`

**Decider:** `cixzhang`, `2026-09-06`

一个审计 PR 可以在描述已核实已发布行为的同时，用前后对照证明来修复客观缺陷。新的判断仍在该自动路径之外。

已否决：仅因为同一次审计发现了缺失的契约，就把一项安全修复拆开。

### DEC-3 — Auto-merge uses a structured report without a duplicate checked-in record

**Reference:** `spec:AST-029/DEC-3`

**Decider:** `cixzhang`, `2026-09-07`

Night Watch 输出 FR10 中带版本的资格格式。可信检查把它绑定到精确的 PR head，对照仓库状态校验它，并公布所需的状态与理由。报告存放在可信的 PR/检查元数据中，而不是第二份已检入的审计文件里。评分与晋升保留其现有的 issue 与账本规则。

已否决：把非结构化散文作为自动合并的输入、第二份仓库审计记录，或仅凭 CI 全绿就断定资格。

### DEC-4 — Audit-authored behavior tests use Matt Pocock's TDD skill

**Reference:** `spec:AST-029/DEC-4`

**Decider:** `cixzhang`, `2026-09-07`

Night Watch 使用固定版本的公共 `tdd` skill 进行行为测试补救。当前契约或既定的公共接口决定接缝；审计者不自行发明接缝。每个循环都在生产代码变更之前证明红失败，并实现一个贯通可观察行为的最小垂直切片。

已否决：在实现之后写测试、测试内部实现，或在从第一个垂直切片学到东西之前就生成全部测试。

### DEC-5 — Audit data remains split by ownership

**Reference:** `spec:AST-029/DEC-5`

**Decider:** `cixzhang`, `2026-09-07`

自动化 wiki 账本仍是当前组件审计状态的运维数据存储。审计 PR 保存一次运行中可供人工审查的证据，可信 Check Run 保存精确 head 的机器决策。组件契约只保存持久的产品行为。任何未来的数据存储变更都需要显式指定的自动化迁移与切换契约。

已否决：逐组件的影子账本、在组件规格中保存截图或运行矩阵，或把短暂的 CI 产物当作唯一的审查记录。

### DEC-6 — Scoring stays stable while applicable authority is assembled dynamically

**Reference:** `spec:AST-029/DEC-6`

**Decider:** `cixzhang`, `2026-09-07`

评分标准保留其现有小节、权重、严重级别、等级区间与未测量处理。每次审计都依据适用的当前全局、家族、组件与模块要求来填充这些小节。权威变更会使已链接的组件审计失效；只有评分方法变更才会给评分标准标度做版本化。

已否决：把每一条本地要求都复制进 wiki 评分标准、在组件要求更多时悄悄改变权重，或把一次规格编辑当作全局评分版本变更。

## Open questions

无。
