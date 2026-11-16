---
schema_version: 3
template_version: 4
kind: module
id: module:Table/useTableTreeData
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-04
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/Table/plugins/tree/useTableTreeData.test.tsx,
    apps/storybook/stories/TableTree.stories.tsx,
    scripts/check-i18n-catalog.mjs,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    architecture:internationalization,
    architecture:public-component-api,
    architecture:react-component-runtime,
    spec:AST-009,
    module:Table/useTableRowExpansion,
  ]
---

# useTableTreeData accessible-name contract

## Contract at a glance

| Area                    | Contract                                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| Public contract         | 可选参数 `getRowLabel?: (item: T) => string` 为展开控件提供树行的身份标识。                      |
| Behavior                | 经修剪后非空的身份标识为本地化的展开/折叠按钮提供具名标签；省略或文本为空白时使用通用名称。      |
| End-user impact         | 顶层与嵌套的展开控件都能标识各自控制的行。                                                       |
| Builder impact          | 调用方通过行身份文本主动启用该能力；展开状态与动词保持分离。                                     |
| Compatibility/readiness | 增量的可选 API；现有树状态、数据与控制语义保持不变。实现层面的发布验证另行进行。                 |
| Review checks           | 拒绝由索引或列推导出的名称、新增的可见内容，以及标签/语言区域更新后残留的旧名称。                |
| Governing rules         | Table 拥有聚合组合；internationalization 与 React runtime 拥有各自的共享机制；本模块只涉及命名。 |

本表是审查用的投影视图；下方正文具有权威性。

## Intent

树展开按钮在每一层都能标识它所控制的行。本记录只约定可访问名称与可选的命名回调，不约定完整的树插件或树视图解剖结构。

## Compatibility and migration

- 已发布的默认行为得以保留：是；省略回调时保留通用的本地化展开名称。
- 兼容性类别：可选的增量 API，不改变树数据、行键、展开状态或交互行为。
- 迁移决策：DEC-1。使用方的用法说明属于 `useTableTreeData.doc.mjs`。
- 已知的验证例外：正文行不携带 `aria-expanded`（展开按钮携带它，AR1），但它们在 treegrid 之外仍保留 `aria-level`。Chromium 将其暴露为行的深度，叶子行也不例外。无障碍检查器会报告该问题，当树表格获得 treegrid 语义后它便会消失。

## Ownership boundary

**拥有：** 行标签输入、空白规范化、具名消息、对被渲染的展开器翻译上下文的消费、语义标签刷新以及命名证据。

**不拥有：** internationalization provider 的作用域与更新语义、Table 聚合协议、树扁平化、行键、展开状态、层级/选择语义、控件可见性、动效、行点击行为或完整的 hook 配置。此处不改变任何选择标签规则。

## Public API and concepts

| Concept    | Values                     | Meaning                    | Default          | Owner  | Stability                |
| ---------- | -------------------------- | -------------------------- | ---------------- | ------ | ------------------------ |
| 行身份文本 | 为该行条目返回的字符串     | 不含动作动词的人类可读名称 | 回调缺失         | 调用方 | 自首次发布起即为增量能力 |
| 生效标签   | 修剪后非空的字符串，或缺失 | 具名或通用的控件标签       | 通用             | 本模块 | 稳定                     |
| 名称状态   | 已折叠或已展开             | 本地化的展开/折叠措辞      | 跟随现有展开状态 | 本模块 | 稳定                     |

## Behavioral contract

| ID  | Invariant                                                                                                                                                                              | Basis                              | Evidence state       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------- |
| FR1 | `UseTableTreeDataConfig<T>` 接受可选的 `getRowLabel?: (item: T) => string`。它在任意层级接收现有条目，且从不提供行键或展开状态。文本不从被渲染的列中推断。                             | 调用方拥有的身份；DEC-1            | 已批准；实现另行验证 |
| FR2 | 修剪首尾空白。非空的结果按现有展开状态向 `@astryx.tableTree.expandRowNamed` 或 `collapseRowNamed` 提供 `{label}`。省略或仅含空白的结果则选用现有的 `expandRow` 或 `collapseRow` 消息。 | DEC-1；internationalization 所有权 | 已批准；实现另行验证 |
| FR3 | 每个被渲染的树展开器使用自己的 internationalization provider。语言区域/覆盖的变更以及生效行标签文本的变更都会更新可访问名称，包括仅标签文本发生变化而不改变树展开状态的情形。          | Provider 与语义快照约定            | 需要验证             |
| FR4 | 命名不会改变哪些行拥有展开器、不新增可见文本，也不改变原生按钮角色、`aria-expanded`、树数据、选择、键盘交互、焦点或行点击行为。没有展开控件的叶子行不会因此获得展开控件。              | 增量兼容性                         | 需要验证             |

### Transformation and precedence order

- **ORD1：** 调用方的行文本在消息插值之前先被规范化；现有展开状态决定使用哪个动词，被渲染的展开器的 provider 提供措辞。
- **ORD2：** 缺失或空白的身份文本选用通用措辞。这一针对展开的回退不会改变选择插件中同名回调的行为。

### Performance and resources

- **PR1：** 行标签更新参与该行现有的语义通知。命名不引入独立的树存储、观察者、监听器或异步加载器；未变化的语义快照保持其身份不变。

## Accessibility contract

- **AR1：** 展开按钮暴露完整的本地化动作/名称，并在顶层与嵌套层级保留独立的 `aria-expanded` 状态。
- **AR2：** 计算得到的无障碍树/浏览器名称确立角色/状态/名称的暴露方式，而非某个特定的朗读短语或新的树导航模型。

## Design relationships

| Anatomy      | Requirement                            | Owner                  | Contract |
| ------------ | -------------------------------------- | ---------------------- | -------- |
| 现有树展开器 | 名称改变但不新增视觉内容或控件解剖结构 | 现有树控件；本命名切片 | FR2-FR4  |

## Parent and system relationships

`component:Table` 保留聚合组合与渲染器的所有权。`architecture:internationalization` 拥有 ICU 消息、provider 更新与目录回退。`architecture:react-component-runtime` 拥有外部存储快照的稳定性。行展开命名模块使用相同的规范化边界，但拥有独立的 hook 生命周期。

## Verification map

| Contract | Verification                     | States                                    | Failure expectation                          |
| -------- | -------------------------------- | ----------------------------------------- | -------------------------------------------- |
| FR1-FR2  | 树插件测试与浏览器可访问名称检查 | 顶层/嵌套、已折叠/已展开、省略/空白/具名  | 移除规范化/插值会改变预期的名称              |
| FR3      | 仅标签变更与 provider 更新测试   | 相同的树数据与展开状态；文本/语言区域变更 | 语义刷新中遗漏生效文本会保留过期的可访问名称 |
| FR4      | 现有树状态/性能/键盘测试         | 叶子行、展开切换与具名控件                | 命名不得引入控件或改变状态/数据/焦点         |

## Decision log

### DEC-1 — Caller identity; localized component action

**Reference:** `module:Table/useTableTreeData/DEC-1`

**Decider:** humbertovirtudes, 2026-11-04.

该回调只提供身份标识。修剪后为空的文本使用通用的展开措辞，与明细行展开器保持一致，而不强加新的选择规则。已否决：完整动作标签回调，或从显示列内容推断。

## Open questions

无。

## Content boundary

本记录在此不约定树 hook 的其余部分；使用方签名/示例、实现计划、审计结果以及父级/共享规则仍保留在各自的位置。
