---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-041
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-10-09
phase: accepted
owners: [josephfarina]
affects_architecture: []
affects_families: []
affects_contributing: []
affects_consumer_docs: [is-my-code-good]
---

# Consumer documentation audience boundary system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/cli/assets/docs/**",
    "packages/**/*.doc.mjs",
    "packages/**/*.doc.*.mjs"
  ]
}
```

## Intent

Astryx 交付给调用方的文档，服务于使用 Astryx 构建产品的人与 agent。这些文档通过 `astryx docs`、`astryx search`、组件、hook 与模板文档、`--json` API、生成的 agent 指导以及文档站点触达他们。调用方必须能够对他们在其中读到的每项内容采取行动。关于构建 Astryx 本身的内容属于贡献者知识。

本记录拥有通过上述使用方面向交付的每个文档的受众边界，包括由集成贡献的文档。

## Non-goals

- 贡献者文档、知识记录与仓库指令。
- 文档结构、图谱标识，以及调用方文档的质量标准；这些由文档契约拥有。
- 满足本契约的等价内部实现仍然有效。

## Requirements

- **FR1 — 交付的文档是给调用方的。** 交付文档的每个小节 MUST 描述调用方能够使用或依赖的内容：用途与备选方案、API 与默认值、可观察行为及其保证、组合方式、调用方继承的成本与义务、主题接缝、迁移，或他们能够依据公开证据用于其用 Astryx 创建的产品界面或产物的质量标准。
- **FR2 — 维护者流程被排除在外。** 交付文档 MUST NOT 要求读者为 Astryx 维护者产出证据、满足 Astryx 的内部评分或晋升标准、遵循 Astryx 的贡献生命周期，或运行 Astryx 自己的测试与 CI 工具。此类材料属于拥有该主题的贡献者面向，或在不存在特定面向时属于贡献指南。它绝不会默认回到交付文档。
- **FR3 — 系统保证保留，作为保证。** 调用方能够依赖的关于系统行为的事实 MUST 保留在交付文档中，并作为对调用方的保证来陈述。例如，“主题目标一旦发布即稳定”是面向调用方的；“审查者必须检查主题目标是否稳定”则不是。对调用方事实的维护者式措辞，其修复方式是重写，而不是搬移。
- **FR4 — 分发受众不是读者角色。** 文档的分发受众决定哪个编译产物包含它，例如公共产物或内部产物。它 MUST NOT 允许维护者流程材料进入任何产物。内部产物仍然是为使用 Astryx 构建产品的人准备的。
- **FR5 — 强制校验衡量的是所面向的读者。** 为 FR2 把关的自动检查 MUST 按它面向的读者对内容分类，而不是按某个词是否出现。在把关之前，它 MUST 在交付语料上显示零发现，并至少捕获一个真实违规。包含被标记术语的调用方指令，例如“animate transforms to keep compositor promotion”，MUST 通过。每个发现 MUST 指明文档与小节，并说明该材料归属何处。该检查 MUST 为合法的面向调用方用法提供显式、可审查的豁免。
- **FR6 — 贡献的文档遵循同一边界。** 集成贡献到使用方面向的文档 MUST 满足 FR1–FR4。集成创作参考 MUST 声明此规则。
- **FR7 — 共享的调用方评分标准只有一个所有者。** 交付的 `is-my-code-good` 指南 MUST 拥有共享标准，用于判断调用方创建的产品代码是否良好地使用 Astryx。专门评分标准 MAY 增加权重与产物特定检查，但 MUST 链接到共享标准，而不是重新定义它们。调用方评分标准 MUST 使用公开输入，并 MUST 将缺失的证据报告为未检查，而不是报告为通过。

### Platform support

- 支持的功能/引擎下限：Intent 中列出的每个使用方文档面向。
- 不支持的行为：无。
- 浏览器证据：不适用。

## Current-state impact

交付的主题目录有一个 README，其中陈述了调用方行动测试、维护者式写作的常见迹象，以及这些材料的归属位置。仓库指令声明了相同的受众。FR7 将共享的面向调用方评分标准指派给 `is-my-code-good`；其指南与专门链接属于本次仅规格变更之外的配套实现。目前还没有自动检查强制受众边界。创作类型为文档图谱声明了一个分发受众字段，取值为 public 与 internal；目前还没有任何东西读取它。FR4 使该字段与读者边界保持分离。

本次仅规格的变更不改变任何运行时行为或已发布包，也不需要 Changeset。

## Verification

| Contract | Verification                         | Representative states                                            | Mutation or failure expectation                          |
| -------- | ------------------------------------ | ---------------------------------------------------------------- | -------------------------------------------------------- |
| FR1–FR3  | 对编译器枚举的每个交付文档的审查     | 组件、hook、模板、主题、agent 指导；以维护者口吻表述的调用方事实 | 某小节面向维护者，或调用方保证被删除而不是重写           |
| FR4      | 编译后的公共与内部产物测试           | 公共文档、内部文档、标记为内部的维护者材料                       | 维护者材料出现在任何产物中                               |
| FR5      | 检查测试夹具与在交付语料上的一次运行 | 干净语料、真实违规、含被标记术语的调用方指令、豁免               | 语料失败、违规通过、调用方指令失败，或豁免是静默的       |
| FR6      | 集成文档测试夹具                     | 面向维护者的贡献主题                                             | 贡献的文档绕过了边界                                     |
| FR7      | 文档图谱与评分标准审查               | 共享代码评分标准、专门模板评分、缺失的渲染证据                   | 共享标准有两个所有者、专门评分标准未链接，或缺失证据通过 |

## Decision log

### DEC-1 — The caller-action test defines the boundary

**Reference:** `spec:AST-041/DEC-1`

**Decider:** `josephfarina`, `2026-09-23`

交付文档触达使用 Astryx 构建产品的 agent 与人，每多一个小节都会消耗他们的注意力。测试标准是调用方是否会就内容采取行动。系统保证通过该测试，即使它们听起来像流程，因此它们被改写为面向调用方，而不是被搬移。

已否决：因准确而将维护者材料留在交付文档中，以及因调用方保证以流程口吻表述而将其移出。

### DEC-2 — Enforce by the reader addressed, with measured precision

**Reference:** `spec:AST-041/DEC-2`

**Decider:** `josephfarina`, `2026-09-23`

嘈杂的检查会被压制，而不是被采纳执行。把关必须证明它能捕获真实违规，并让与维护者流程共用词汇的调用方指令通过。

已否决：把单纯的词表当作把关，以及把分发受众当作维护者材料的存放处。

### DEC-3 — Caller-owned quality review stays in shipped docs

**Reference:** `spec:AST-041/DEC-3`

**Decider:** `josephfarina`, `2026-10-09`

使用 Astryx 构建产品的人或 agent 能够依据公开标准来评估其自己的产品代码。`is-my-code-good` 指南拥有共享标准；产物特定的指南链接到它，只添加自己的检查或评分。缺失的证据保持可见，而不是变成通过。

已否决：把每个质量评分标准都当作维护者流程，以及把共享标准复制到每个产物特定指南中。

## Open questions

无。
