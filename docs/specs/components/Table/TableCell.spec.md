---
schema_version: 3
template_version: 7
kind: component
id: component:TableCell
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Table/Table.test.tsx,
    packages/core/src/Table/tableContextMenu.test.tsx,
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.test.tsx,
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.glide.test.tsx,
    packages/core/src/Table/__tests__/TableRowGlide.a11y.browser.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:container-padding,
  ]
contributing: []
system_specs: []
---

# TableCell component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `children`、`scope`、`headers`、`colSpan`、`rowSpan`、`contextMenuActions`、`xstyle`（一个样式或一个列表）、根级 `BaseProps`，以及一个 `ref`。 |
| 行为          | 一个原生 `td`，承载 `table-cell` target，接受所在 Table 的密度、溢出、对齐与分隔线处理，可选地处于上下文菜单之内。                             |
| 最终用户影响  | 人们以与周围容器对齐的一致间距读取单元格内容，并且可以从单元格打开行或单元格操作。                                                             |
| 构建者影响    | 无；该记录描述已发布的行为。                                                                                                                   |
| 兼容性/就绪度 | 已发布行为记录为 current；无 API、默认值或输出变更。一处实现缺口列在 Current-state impact 下。                                                 |
| 审查检查      | 拒绝丢失的 target 或密度反映、忽略容器 inset 的边缘内边距、未填满单元格的上下文菜单触发器，或未到达单元格的调用方 props。                      |
| 治理规则      | `architecture:container-padding`；`architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。                    |

本表是审查投影；下文正文具有权威性。

## Intent

TableCell 是调用方在 children 模式 Table 中组合的正文单元格，也是 Table 在 data 模式下渲染的单元格。它拥有 `td` 以及 Table 所要求的单元格处理；内容由调用方拥有。

使用方语法与示例属于 `TableCell.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：yes
- 兼容性类别：记录已发布的行为；无公开 prop、默认值、DOM、target 或样式输出的变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **带操作的边缘单元格将边缘内边距保留在触发器之外（FR3、FR4）。** 在一行的第一个和最后一个单元格中，容器 inset 内边距留在 `td` 上，而上下文菜单触发器携带自己的密度内边距，因此在该区域上的次要点击会打开浏览器菜单，内容位于 inset 内部一个密度内边距处。

## Ownership boundary

**拥有**

- `td` 元素，它承载 `component:Table` 拥有并映射的 `table-cell` target。
- 应用 Table 的密度、溢出、垂直对齐与分隔线，并在给出操作时将内容包进上下文菜单。

**不拥有 / 非目标**

- 密度、溢出、对齐与分隔线设置 — 由 `component:Table` 拥有。
- 上下文菜单的行为 — 由 `component:ContextMenu` 拥有。
- 单元格内容 — 由调用方拥有。

## Public concepts

| 概念       | 封闭取值或状态                           | 含义                               | 按变体/方向/状态的可用性 | 默认值 | 所有者 | 稳定性 | 无效值行为         |
| ---------- | ---------------------------------------- | ---------------------------------- | ------------------------ | ------ | ------ | ------ | ------------------ |
| 表格关系   | `scope`、`headers`、`colSpan`、`rowSpan` | 原生单元格关联与跨行跨列。         | 始终                     | 无     | 调用方 | 稳定   | —                  |
| 上下文操作 | 操作列表或 getter；未设置                | 在单元格的上下文菜单中显示的操作。 | 始终                     | 无     | 调用方 | 稳定   | 空列表不渲染菜单。 |
| 内容       | ReactNode                                | 单元格的内容。                     | 始终                     | —      | 调用方 | 稳定   | —                  |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 依据                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| FR1 | TableCell 渲染一个承载 `table-cell` target 的 `td`，该 target 反映 Table 的密度，并容纳其内容。在 Table 之外，它不添加任何单元格处理。                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与测试                                                |
| FR2 | 在 Table 内部，单元格在正文尺寸下按密度填充（`compact` 为 `--spacing-1` 乘 `--spacing-2`，`balanced` 为 `--spacing-2` 乘 `--spacing-3`，`spacious` 为 `--spacing-3` 乘 `--spacing-4`），按 Table 的 `textOverflow` 换行或截断文本，按其 `verticalAlign` 垂直对齐，并按其 `dividers` 绘制分隔线：使用 `rows` 或 `grid` 时，以 `--color-border` 绘制 `--border-width` 的底边框，section 的最后一行不绘制；使用 `columns` 或 `grid` 时，绘制 inline-end 边框，该行的最后一个单元格不绘制。当 glide 移动其行时，底边框变为透明，该行的一个单元格在整行底边绘制一个替代线（`component:Table` FR14）。 | 当前源码与测试                                                |
| FR3 | 一行的第一个和最后一个单元格将其外侧 inline 边缘填充到所在容器发布的 inset，至少为 `--spacing-2`；在容器之外回退到密度内边距。实现缺口：在带上下文操作的第一个或最后一个单元格中，边缘内边距留在触发器之外的 `td` 上，因此内容位于 inset 内部一个密度内边距处（FR4；Current-state impact）。                                                                                                                                                                                                                                                                                                     | 当前源码；`architecture:container-padding`                    |
| FR4 | 存在上下文操作（非空列表或 getter）时，内容位于填满单元格并承载密度内边距的上下文菜单触发器中，因此整个单元格都会打开菜单；getter 在菜单打开时解析操作。实现缺口：在第一个和最后一个单元格中，边缘内边距留在触发器之外的 `td` 上，因此在该区域上的次要点击会打开浏览器菜单（Current-state impact）。                                                                                                                                                                                                                                                                                             | 当前源码与测试                                                |
| FR5 | `ref` 到达 `td`；受支持的 DOM、data、ARIA 与事件 props 在组件的 target 与样式之前到达它；`xstyle`（一个样式或一个列表）、`className` 与 `style` 在组件样式之后合成。                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 内容。** 任意内容均可填充单元格。

### Representative states

| 状态     | 必需的不变式                       | 允许的变体 |
| -------- | ---------------------------------- | ---------- |
| 独立     | 一个带 target 且无处理的 `td`。    | —          |
| 每种密度 | 密度内边距与 `data-density`。      | —          |
| 在容器内 | 外侧边缘单元格与容器 inset 对齐。  | —          |
| 带操作   | 一个填满单元格的上下文菜单触发器。 | 操作。     |

### Transformation and precedence order

- **ORD1 — 样式。** Table 处理 → 上下文菜单调整 → glide 的分隔线处理 → 调用方的 `xstyle`、`className` 与 `style`。

### Performance and resources

- **PR1 — 无资源。** TableCell 读取 Table 的外观；仅当给出操作时才加载上下文菜单。

## Accessibility contract

- **AR1 — 原生单元格语义。** `td` 保留其原生单元格角色以及调用方的 `scope`、`headers` 与跨度；TableCell 不添加任何角色。

## Design relationships

| 解剖结构或状态 | 设计要求                           | 表示权威       | 层级角色 | 组件契约 |
| -------------- | ---------------------------------- | -------------- | -------- | -------- |
| 单元格         | 带密度内边距与分隔线的正文单元格。 | 当前源码与文档 | 支撑     | FR1–FR4  |

主题化：`td` 承载 `table-cell` target，`Table.doc.mjs` 将其映射为 `component:Table` 的 Cell 部件。`TableCell.doc.mjs` 不声明自己的解剖结构，因此此处不声明解剖-主题化块。

## Family and system relationships

- `component:Table` 拥有外观设置与 target 映射。
- `architecture:container-padding` 拥有 FR3 读取的已发布 inset。
- `component:ContextMenu` 拥有上下文菜单。

## Verification map

| 契约      | 验证                                                                                                                             | 代表性状态                                                                                             | 变更或失败预期                                                                                                                                                                                                                                         | 审计章节                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| FR1, AR1  | `Table.test.tsx` 的 children 模式与密度反映测试；`themingTargets.test.ts`                                                        | children 模式；每种密度                                                                                | 缺少单元格、丢失 target 或缺少 `data-density` 会失败。`themingTargets.test.ts` 只能捕获被重命名或未记录的 target。                                                                                                                                     | `audit:TableCell/anatomy`  |
| FR2       | `Table.test.tsx` 的密度、溢出、分隔线与垂直对齐测试；`TableRowGlide.a11y.browser.spec.ts`；`useTableRowExpansion.glide.test.tsx` | 各密度；换行与截断；分隔线；glide 过程中、固定单元格、主题化与被覆盖的分隔线                           | 分隔线在 glide 过程中不随其行移动，或画在错误的单元格上，会在 glide 检查中失败。截断的 Table 中 data 模式单元格丢失其截断文本包装，或单元格缺少所要求的 `vertical-align`，会失败。缺口：密度与分隔线测试只断言表格渲染，没有测试覆盖单元格自身的截断。 | `audit:TableCell/layout`   |
| FR3       | 源码审查                                                                                                                         | 在 Card、Section、Layout 内                                                                            | 缺口：没有测试覆盖边缘单元格与容器 inset 的对齐。                                                                                                                                                                                                      | `audit:TableCell/layout`   |
| FR4       | `tableContextMenu.test.tsx` 的正文单元格行操作与整单元格测试；`useTableRowExpansion.test.tsx` 的上下文菜单操作测试               | 带列表的正文单元格；带 getter 的正文单元格（可展开行）；整单元格触发器                                 | 忽略其操作列表或 getter 的正文单元格会失败。缺口：整单元格测试只检查触发器是否有 class，因此未填满单元格的触发器会通过；没有测试覆盖空列表或触发器之外的边缘单元格内边距。                                                                             | `audit:TableCell/behavior` |
| FR5, ORD1 | `Table.test.tsx` 的 TableCell `ref`、`colSpan` 与 `rowSpan` 测试                                                                 | `ref`；`colSpan`、`rowSpan`                                                                            | `ref` 不在 `td` 上，或 `colSpan`、`rowSpan` 被丢弃，会失败。缺口：没有 TableCell 测试覆盖事件 props、`xstyle`、`className`、`style`，或调用方样式跟随 Table 处理的顺序。                                                                               | `audit:TableCell/api`      |
| PR1       | 源码审查                                                                                                                         | 每个状态                                                                                               | 缺口：没有自动化检查覆盖上下文菜单的惰性加载。                                                                                                                                                                                                         | `audit:TableCell/behavior` |
| RTL 关系  | `In Card` story 上 RTL 审计选定的 D2 与 D8 target（`apps/storybook/rtl-audit/targets.json`）                                     | 一个 `padding={0}` 的 Card，其中第一列的逻辑 inline-start 内边距与其 inline-end 内边距不同；LTR 与 RTL | 第一列不在 inline 起始处，或边缘内边距在 RTL 中仍停留在同一物理侧，会使 D2 或 D8 失败。                                                                                                                                                                | `audit:TableCell/i18n-rtl` |

## Decision log

未记录。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到它们的所有者。
