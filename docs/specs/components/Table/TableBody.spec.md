---
schema_version: 3
template_version: 7
kind: component
id: component:TableBody
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

# TableBody component contract

## Contract at a glance

| 领域          | 契约                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------- |
| 公共契约      | `children`、根 `BaseProps`，以及一个 `ref`。                                              |
| 行为          | 将表格的主体区段渲染为原生 `tbody`，并携带 `table-body` 目标。                            |
| 最终用户影响  | 辅助技术将主体区段作为表格结构的一部分读取。                                              |
| 构建者影响    | 无；本条记录描述的是已发布行为。                                                          |
| 兼容性/就绪度 | 已发布行为被记录为 current；无 API、默认值或输出变更。                                    |
| 审查检查      | 拒绝非 `tbody` 元素、丢失的目标，或未落到该元素上的调用方 props 或 `ref`。                |
| 治理规则      | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。 |

此表是审查侧的投影；下方正文具有权威性。

## Intent

TableBody 是调用方在 children 模式的 Table 内部组合的主体区段。它拥有原生 `tbody` 元素；其内部的行由调用方拥有。

使用方的语法与示例属于 `TableBody.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容类别：记录已发布行为；无公共 prop、默认值、DOM、目标或样式输出的变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `tbody` 元素，它携带由 `component:Table` 拥有并映射的 `table-body` 目标。

**不拥有 / 非目标**

- 行 —— 由 `component:TableRow` 拥有；单元格 —— 由 `component:TableCell` 和 `component:TableHeaderCell` 拥有；以及调用方的内容。
- 表格外观、数据模式和插件 —— 由 `component:Table` 拥有。

## Public concepts

| 概念 | 封闭取值或状态  | 含义           | 按变体/方向/状态的实际可用性 | 默认值 | 所有者 | 稳定性 | 无效值行为 |
| ---- | --------------- | -------------- | ---------------------------- | ------ | ------ | ------ | ---------- |
| 内容 | ReactNode（行） | 主体区段的行。 | children 模式的 Table        | 无     | 调用方 | 稳定   | —          |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                  | 依据                                                          |
| --- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | TableBody 渲染一个 `tbody`，它携带 `table-body` 目标并容纳其 children，且自身不添加任何样式。                                           | 当前源码与测试                                                |
| FR2 | `ref` 会到达 `tbody`；受支持的 DOM、data、ARIA 和事件 props 在组件自身属性之后到达该元素；`xstyle`、`className` 和 `style` 在其上组合。 | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 行。** 任何行都可以填充主体区段。

### Representative states

| 状态          | 必需的不变式                     | 允许的变化 |
| ------------- | -------------------------------- | ---------- |
| 位于 Table 中 | 表格 children 中的一个 `tbody`。 | 行。       |

### Transformation and precedence order

- **ORD1 — 根组合。** 目标与调用方样式先组合，随后应用调用方 props。

### Performance and resources

- **PR1 — 无资源。** TableBody 不持有状态，也不添加监听器或观察器。

## Accessibility contract

- **AR1 — 原生区段语义。** `tbody` 保留其原生表格区段角色；TableBody 不添加自身的角色。

## Design relationships

| 结构或状态 | 设计要求         | 表征权威       | 层级角色 | 组件契约 |
| ---------- | ---------------- | -------------- | -------- | -------- |
| 主体区段   | 表格的主体区段。 | 当前源码与文档 | 支撑性   | FR1      |

主题化：`tbody` 携带 `table-body` 目标，`Table.doc.mjs` 将其映射为 `component:Table` 的 Body section 部分。`TableBody.doc.mjs` 未声明自身的结构，因此此处不声明结构主题化区块。

## Family and system relationships

- `component:Table` 拥有外观、数据模式、插件以及目标映射。
- `architecture:public-component-api` 拥有调用方输入路由；FR2 应用该规则。

## Verification map

| 契约      | 验证                                                                | 代表性状态          | 变异或失败预期                                                                                                                                                          | 审计区段                   |
| --------- | ------------------------------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1, AR1  | `Table.test.tsx` 的 children 模式区段测试；`themingTargets.test.ts` | children 模式       | 表格 children 中缺少 `tbody` 会失败。缺口：没有测试断言 `table-body` 类名，或断言 TableBody 不添加角色或样式。`themingTargets.test.ts` 只能捕获被重命名或未记录的目标。 | `audit:TableBody/anatomy`  |
| FR2, ORD1 | `Table.test.tsx` 的区段剩余属性转发测试                             | `data-testid`、`id` | 丢失 `data-testid` 或 `id` 会失败。缺口：没有测试覆盖 `ref`、事件 props、`className`、`style` 或 `xstyle`。                                                             | `audit:TableBody/api`      |
| PR1       | 源码审查                                                            | 每个状态            | 缺口：如果 TableBody 添加了状态或监听器，没有任何自动化检查会失败。                                                                                                     | `audit:TableBody/behavior` |

## Decision log

未记录任何决策。本条记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不复制使用方的 prop 表格/示例、当前审计结果、实现步骤或 Table 规则，而是链接到这些内容的所属记录。
