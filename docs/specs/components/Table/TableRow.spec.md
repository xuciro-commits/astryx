---
schema_version: 3
template_version: 7
kind: component
id: component:TableRow
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
    packages/core/src/Table/plugins/selection/useTableSelection.test.tsx,
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.glide.test.tsx,
    packages/core/src/Table/__tests__/TableRowGlide.a11y.browser.spec.ts,
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

# TableRow component contract

## Contract at a glance

| 领域          | 合约                                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共合约      | `children`、`isHeaderRow`、`xstyle`（一组 StyleX 样式）、根 `BaseProps` 以及 `ref`。                                                         |
| 行为          | 一个原生 `tr`，承载 `table-row` 目标，接受外层 Table 的条纹与悬停处理，并在滑动期间保持其单元格的分隔线。                                    |
| 最终用户影响  | 用户可以借助条纹或悬停高亮在表格中追踪某一行，辅助技术会将其读作一行。                                                                       |
| 构建者影响    | 主题通过 `table-row` 目标的 `selected` 状态为选中的行设置样式（FR5）。                                                                       |
| 兼容性/就绪度 | 新增式：选中的行会获得 `data-selected="selected"`，且 `table-row` 目标会获得 `selected` 主题状态（FR5）；不改变任何 prop、默认值或样式输出。 |
| 评审检查      | 拒绝把展开面板计入条纹、拒绝在表头行上应用悬停或条纹、拒绝目标丢失、拒绝调用方 prop 未到达该行。                                             |
| 管辖规则      | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。                                                    |

此表是一份评审投影；以下正文具有权威性。

## Intent

TableRow 是调用方在 children 模式的 Table 中组合出来的行，也是 Table 在数据模式下渲染的行。它拥有 `tr` 以及 Table 所要求的行处理；单元格由调用方拥有。

使用方语法与示例应放在 `TableRow.doc.mjs` 中。

## Compatibility and migration

- 保留已发布的默认值：`yes`——正文行。
- 兼容类别：新增式；选中的行会获得 `data-selected="selected"`，且 `table-row` 目标会获得 `selected` 主题状态（FR5）；不改变任何 prop、默认值或样式输出。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- `tr` 元素，它承载 `table-row` 目标，该目标由 `component:Table` 拥有并映射。
- 把 Table 的条纹与悬停处理应用到该行，并在滑动移动该行时为其单元格的替代分隔线提供承载。

**不拥有 / 非目标**

- Table 是否带条纹、是否可悬停或是否带分隔线——由 `component:Table` 拥有。
- 单元格——它们绘制行分隔线——由 `component:TableCell`、`component:TableHeaderCell` 与调用方拥有。

## Public concepts

| 概念   | 封闭取值或状态    | 含义                                                              | 按变体/方向/状态的可用性                 | 默认   | 所有者               | 稳定性 | 无效值行为 |
| ------ | ----------------- | ----------------------------------------------------------------- | ---------------------------------------- | ------ | -------------------- | ------ | ---------- |
| 行类型 | body; header      | 表头行跳过条纹与悬停。                                            | 位于 Table 内                            | body   | `component:TableRow` | 稳定   | —          |
| 内容   | ReactNode (cells) | 该行的单元格。                                                    | 始终                                     | —      | 调用方               | 稳定   | —          |
| 选中   | selected          | 被选择插件选中的行会承载 `table-row` 目标的 `selected` 主题状态。 | 位于使用 `useTableSelection` 的 Table 内 | 未选中 | `component:TableRow` | 稳定   | —          |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                       | Basis                                                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | TableRow 渲染一个 `tr`，承载 `table-row` 目标并容纳其子级。在 Table 之外，它不添加任何行处理。                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试                                                |
| FR2 | 在 Table 内，正文行接受 Table 的处理：开启条纹时，每个偶数正文行绘制 `--color-background-muted`，且只计正文行，因此展开面板行不会使条纹错位；开启悬停时，支持悬停的指针会绘制 `--color-overlay-hover`；两者都开启时，悬停颜色取代条纹；带 `aria-disabled="true"` 的行不响应悬停。表头行（`isHeaderRow`）两者都不接受。                                                                                                                          | 当前源码与测试                                                |
| FR3 | 在带 `rows` 或 `grid` 分隔线的 Table 内，每一行（包括表头行）在其单元格的替代分隔线随滑动移动时，都是该分隔线的包含块；分隔线由单元格绘制（`component:Table` FR14）。                                                                                                                                                                                                                                                                           | 当前源码与测试；`component:Table` FR14                        |
| FR4 | `ref` 到达该 `tr`；受支持的 DOM、data、ARIA 与事件 prop 在组件的目标与样式之前到达它；`xstyle`、`className` 与 `style` 在其上组合。                                                                                                                                                                                                                                                                                                             | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |
| FR5 | 被 `useTableSelection` 选中的行会在 `aria-selected` 之外承载 `table-row` 目标的 `selected` 主题状态（`data-selected="selected"`，与其他主题状态的写法一致），并在取消选中时失去它，无论 `hasRowHighlight` 为何值。该状态是公共主题表面（`architecture:public-component-api` DEC-2）：主题正是通过它来为选中的行设置样式，因为选中底色是内联样式，主题规则无法替换；主题在该状态中设置 `--color-accent-muted` 来重新着色底色，内联背景会读取它。 | 当前源码与测试；`component:Table` FR6                         |

### Allowed variation

- **AV1 — Cells.** 任意单元格都可以填充该行。

### Representative states

| 状态       | 必需的不变式                             | 允许的变化 |
| ---------- | ---------------------------------------- | ---------- |
| 独立       | 一个带目标且无任何处理的 `tr`。          | —          |
| 条纹正文行 | 偶数正文行使用弱化底色；展开面板不计入。 | —          |
| 悬停正文行 | 在支持悬停的指针下显示悬停覆盖层。       | —          |
| 表头行     | 无条纹或悬停。                           | —          |

### Transformation and precedence order

- **ORD1 — Treatment.** 表头行 → 无条纹或悬停；其他行 → 来自 Table 的条纹，然后是悬停；每一行 → 作为其单元格分隔线在滑动期间的包含块；然后是调用方的 `xstyle`、`className` 与 `style`。

### Performance and resources

- **PR1 — No resources.** TableRow 只读取 Table 的外观，不持有任何状态。

## Accessibility contract

- **AR1 — Native row semantics.** `tr` 保持其原生行角色；条纹与悬停仅为视觉效果。

## Design relationships

| 解剖结构或状态 | 设计要求                         | 表示权威       | 层级角色 | 组件合约 |
| -------------- | -------------------------------- | -------------- | -------- | -------- |
| 行             | 一行可带可选条纹与悬停的表格行。 | 当前源码与文档 | 支撑性   | FR1–FR3  |

主题化：`tr` 承载 `table-row` 目标，`Table.doc.mjs` 将其映射为 `component:Table` 的 Row 部分。`TableRow.doc.mjs` 未声明自己的解剖结构，因此此处不声明任何解剖-主题化块。

## Family and system relationships

- `component:Table` 拥有条纹、悬停与分隔线设置以及目标映射。
- `architecture:public-component-api` 拥有调用方输入的路由；FR4 应用它。

## Verification map

| 合约      | 验证                                                                                 | 代表性状态                                                        | 变异或失败预期                                                                                                                                                                                         | 审计小节                  |
| --------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| FR1, AR1  | `Table.test.tsx` 的行数、行 class 与独立行测试；`themingTargets.test.ts`             | 数据模式；独立                                                    | 缺失的行或丢失 `table-row` class 会失败。`themingTargets.test.ts` 只能捕获被重命名或未记录的目标；若独立行不再承载其目标，则没有检查会失败。                                                           | `audit:TableRow/anatomy`  |
| FR2, ORD1 | `Table.test.tsx` 的表头悬停与条纹测试                                                | 悬停开启；条纹开启                                                | 接受悬停样式的表头行会失败。缺口：条纹测试只断言行渲染，没有测试覆盖展开面板周围的条纹奇偶，也没有测试覆盖条纹与悬停的颜色。没有测试覆盖悬停颜色取代条纹，或带 `aria-disabled="true"` 的行不响应悬停。 | `audit:TableRow/visual`   |
| FR3       | `TableRowGlide.a11y.browser.spec.ts`；`useTableRowExpansion.glide.test.tsx`          | 滑动中；固定单元格；主题化与被覆盖的分隔线                        | 不随其滑动行移动的分隔线，或画在错误单元格上的线，会失败。缺口：没有检查把表头行单独作为滑动期间的包含块来验证。                                                                                       | `audit:TableRow/visual`   |
| FR4       | `Table.test.tsx` 的行 className 与 style 测试，以及 TableRow 的 ref 与 HTML 属性测试 | 位于 Table 内；独立；`ref`；`aria-label`、`data-testid`           | 未到达该行的调用方 class、style、ref 或 DOM 属性会失败。缺口：没有测试覆盖 `xstyle`，也没有覆盖调用方样式在 Table 处理之后应用的顺序。                                                                 | `audit:TableRow/api`      |
| FR5       | `plugins/selection/useTableSelection.test.tsx` 的选中状态测试                        | 选中；取消选中；`hasRowHighlight={false}`；主题的 `selected` 规则 | 取消选中后仍保留该状态的行、未选中却承载该状态的行、在 `hasRowHighlight` 为 false 时不带该状态的行，或不匹配选中行的主题 `selected` 规则，会失败。                                                     | `audit:TableRow/api`      |
| PR1       | 源码审查                                                                             | 每种状态                                                          | 缺口：若 TableRow 增添状态或监听器，没有自动化检查会失败。                                                                                                                                             | `audit:TableRow/behavior` |

## Decision log

未记录。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到各自的所有者。
