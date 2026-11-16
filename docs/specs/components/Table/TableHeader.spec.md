---
schema_version: 3
template_version: 7
kind: component
id: component:TableHeader
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/Table/Table.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# TableHeader component contract

## Contract at a glance

| Area                    | Contract                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Public contract         | `children`、根 `BaseProps` 以及一个 `ref`。                                               |
| Behavior                | 将表格的表头区渲染为原生 `thead`，并携带 `table-header` 目标。                            |
| End-user impact         | 辅助技术将表头区作为表格结构的一部分来读取。                                              |
| Builder impact          | 无；本记录描述已发布行为。                                                                |
| Compatibility/readiness | 已发布行为记录为 current；没有 API、默认值或输出变更。                                    |
| Review checks           | 拒绝非 `thead` 元素、丢失的目标，或未落到该元素上的调用方 props 或 `ref`。                |
| Governing rules         | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。 |

本表是审查视角的投影；下方正文具有权威性。

## Intent

TableHeader 是调用方在 children 模式 Table 内组合而成的表头区。它拥有原生 `thead` 元素；其中的行由调用方拥有。

使用方语法与示例属于 `TableHeader.doc.mjs`。

## Compatibility and migration

- 已保留的发布默认值：`yes`
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、DOM、目标或样式输出的变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `thead` 元素，它携带由 `component:Table` 拥有并映射的 `table-header` 目标。

**不拥有 / 非目标**

- 行——由 `component:TableRow` 拥有；单元格——由 `component:TableCell` 和 `component:TableHeaderCell` 拥有；以及调用方的内容。
- 表格外观、数据模式与插件——由 `component:Table` 拥有。

## Public concepts

| Concept | Closed values or states | Meaning      | Availability by variant/orientation/state | Default | Owner  | Stability | Invalid-value behavior |
| ------- | ----------------------- | ------------ | ----------------------------------------- | ------- | ------ | --------- | ---------------------- |
| 内容    | ReactNode (rows)        | 表头区的行。 | children 模式的 Table                     | 无      | 调用方 | 稳定      | —                      |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                       | Basis                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | TableHeader 渲染一个 `thead`，它携带 `table-header` 目标并容纳其 children，且不添加自身样式。                                   | 当前源码与测试                                                |
| FR2 | `ref` 抵达 `thead`；受支持的 DOM、data、ARIA 与事件 props 在组件的属性之后抵达它；`xstyle`、`className` 与 `style` 在其上组合。 | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 行。** 任何行都可以填充表头区。

### Representative states

| State         | Required invariant               | Allowed variation |
| ------------- | -------------------------------- | ----------------- |
| 位于 Table 中 | 表格 children 中的一个 `thead`。 | 行。              |

### Transformation and precedence order

- **ORD1 — 根组合。** 目标样式与调用方样式先组合，然后应用调用方 props。

### Performance and resources

- **PR1 — 无资源。** TableHeader 不持有状态，也不添加监听器或观察器。

## Accessibility contract

- **AR1 — 原生区段语义。** `thead` 保留其原生表格区段角色；TableHeader 不添加自身角色。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 表头区           | 表格的表头区。     | 当前源码与文档           | 支撑           | FR1                |

主题化：`thead` 携带 `table-header` 目标，`Table.doc.mjs` 将其映射为 `component:Table` 的 Header section 部分。`TableHeader.doc.mjs` 未声明自身解剖结构，因此这里不声明 anatomy-theming 块。

## Family and system relationships

- `component:Table` 拥有外观、数据模式、插件以及目标映射。
- `architecture:public-component-api` 拥有调用方输入的路由；FR2 应用它。

## Verification map

| Contract  | Verification                                                        | Representative states | Mutation or failure expectation                                                                                                                                                       | Audit section                |
| --------- | ------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1, AR1  | `Table.test.tsx` 的 children 模式区段测试；`themingTargets.test.ts` | children 模式         | 表格 children 中缺少 `thead` 会导致失败。缺口：没有测试断言 `table-header` 类，也没有测试断言 TableHeader 不添加角色或样式。`themingTargets.test.ts` 仅能捕获被重命名或未记录的目标。 | `audit:TableHeader/anatomy`  |
| FR2, ORD1 | `Table.test.tsx` 的区段剩余属性转发测试                             | `data-testid`, `id`   | 丢失的 `data-testid` 或 `id` 会导致失败。缺口：没有测试覆盖 `ref`、事件 props、`className`、`style` 或 `xstyle`。                                                                     | `audit:TableHeader/api`      |
| PR1       | 源码审查                                                            | 每种状态              | 缺口：如果 TableHeader 添加状态或监听器，没有自动化检查会失败。                                                                                                                       | `audit:TableHeader/behavior` |

## Decision log

未记录。本记录描述已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到它们的拥有者。
