---
schema_version: 3
template_version: 7
kind: component
id: component:TableFooter
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

# TableFooter component contract

## Contract at a glance

| Area                    | Contract                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| Public contract         | `children`、根 `BaseProps` 和一个 `ref`。                                                 |
| Behavior                | 将表格的页脚区域渲染为原生 `tfoot`，承载 `table-footer` 目标。                            |
| End-user impact         | 辅助技术把页脚区域作为表格结构的一部分读取。                                              |
| Builder impact          | 无；该记录描述已交付的行为。                                                              |
| Compatibility/readiness | 已发布行为记录为 current；无 API、默认值或输出变更。                                      |
| Review checks           | 拒绝非 `tfoot` 的元素、丢失的目标，或未到达该元素的调用方 props 或 `ref`。                |
| Governing rules         | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。 |

此表是审查投影；下面的正文具有权威性。

## Intent

TableFooter 是调用方在 children 模式的 Table 内组合的页脚区域。它拥有原生 `tfoot` 元素；调用方拥有其中的行。

使用方语法与示例属于 `TableFooter.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：记录已交付行为；无公共 prop、默认值、DOM、目标或样式输出变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `tfoot` 元素，它承载 `table-footer` 目标，该目标由 `component:Table` 拥有并映射。

**不拥有 / 非目标**

- 行——由 `component:TableRow` 拥有；单元格——由 `component:TableCell` 和 `component:TableHeaderCell` 拥有；以及调用方的内容。
- 表格外观、数据模式和插件——由 `component:Table` 拥有。

## Public concepts

| Concept | Closed values or states | Meaning        | Availability by variant/orientation/state | Default | Owner  | Stability | Invalid-value behavior |
| ------- | ----------------------- | -------------- | ----------------------------------------- | ------- | ------ | --------- | ---------------------- |
| 内容    | ReactNode（行）         | 页脚区域的行。 | children 模式的 Table                     | 无      | 调用方 | 稳定      | —                      |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                         | Basis                                                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | TableFooter 渲染一个承载 `table-footer` 目标并持有其子元素的 `tfoot`，且不添加自身的样式。                                        | 当前源码与测试                                                |
| FR2 | `ref` 到达 `tfoot`；受支持的 DOM、data、ARIA 和事件 props 在组件的属性之后到达它；`xstyle`、`className` 和 `style` 在它上面组合。 | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 行。** 任何行都可以填充页脚区域。

### Representative states

| State       | Required invariant           | Allowed variation |
| ----------- | ---------------------------- | ----------------- |
| 在 Table 中 | 表格子元素中的一个 `tfoot`。 | 行。              |

### Transformation and precedence order

- **ORD1 — 根组合。** 目标与调用方样式先组合，然后应用调用方 props。

### Performance and resources

- **PR1 — 无资源。** TableFooter 不持有状态，也不添加监听器或观察器。

## Accessibility contract

- **AR1 — 原生区域语义。** `tfoot` 保留其原生表格区域角色；TableFooter 不添加自身的角色。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 页脚区域         | 表格的页脚区域。   | 当前源码与文档           | 支撑级         | FR1                |

主题化：`tfoot` 承载 `table-footer` 目标，`Table.doc.mjs` 将其映射为 `component:Table` 的页脚区域部分。`TableFooter.doc.mjs` 不声明自身的结构，因此此处不声明任何结构主题化块。

## Family and system relationships

- `component:Table` 拥有外观、数据模式、插件以及目标映射。
- `architecture:public-component-api` 拥有调用方输入的路由；FR2 应用它。

## Verification map

| Contract  | Verification                                                            | Representative states | Mutation or failure expectation                                                                                                                                                  | Audit section                |
| --------- | ----------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1, AR1  | `Table.test.tsx` section rest-forwarding test；`themingTargets.test.ts` | 在一个普通 `table` 内 | 缺少 `tfoot` 会失败。缺口：没有测试把 TableFooter 渲染在 Table 内、断言其 `table-footer` 类，或断言它不添加角色或样式。`themingTargets.test.ts` 只能捕获被重命名或未记录的目标。 | `audit:TableFooter/anatomy`  |
| FR2, ORD1 | `Table.test.tsx` section rest-forwarding test                           | `data-testid`、`id`   | 丢失 `data-testid` 或 `id` 会失败。缺口：没有测试覆盖 `ref`、事件 props、`className`、`style` 或 `xstyle`。                                                                      | `audit:TableFooter/api`      |
| PR1       | 源码审查                                                                | 每个状态              | 缺口：如果 TableFooter 添加状态或监听器，没有自动化检查会失败。                                                                                                                  | `audit:TableFooter/behavior` |

## Decision log

未记录。该记录描述已交付行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到它们的拥有者。
