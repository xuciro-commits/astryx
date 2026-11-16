---
schema_version: 3
template_version: 7
kind: component
id: component:TableHeaderCell
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Table/TableHeaderCell.test.tsx,
    packages/core/src/Table/tableContextMenu.test.tsx,
    packages/core/src/Table/Table.test.tsx,
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

# TableHeaderCell component contract

## Contract at a glance

| 领域          | 契约                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `children`、`scope`、`contextMenuActions`、`xstyle`（单个样式或列表）、根 `BaseProps`，以及一个 `ref`。                     |
| 行为          | 一个携带 `table-header-cell` 目标的原生 `th`，采用 Table 的密度与列分隔线，始终绘制其底部分隔线，并截断其文本。             |
| 最终用户影响  | 人们看到列标题通过字重、颜色和一条规则线与下方单元格区分开，并与下方单元格对齐。                                            |
| 构建者影响    | 无；本记录描述的是已发布行为。                                                                                              |
| 兼容性/就绪度 | 已发布行为被记录为 current；没有 API、默认值或输出变化。                                                                    |
| 审查检查      | 拒绝缺失的底部分隔线、调用方未设置的 `scope`、丢失的目标或密度反射，或输给上下文样式的调用方 `xstyle`。                     |
| 管辖规则      | `architecture:container-padding`；`architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`。 |

此表是审查用的投影；下文正文具有权威性。

## Intent

TableHeaderCell 是调用方在 children 模式的 Table 内组合使用的表头单元格，可作为列标题，或在 `scope="row"` 时作为行标题，也是 Table 在 data 模式下渲染的列标题单元格。它拥有 `th` 及其表头处理；标题内容归调用方所有。

使用方语法与示例属于 `TableHeaderCell.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes` —— 除非给定，否则没有 `scope`。
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、DOM、目标或样式输出的变化。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `th` 元素，它携带 `table-header-cell` 目标，该目标由 `component:Table` 拥有并映射。
- 表头字重、颜色、底部分隔线、截断，以及表头单元格上的 Table 密度和列分隔线。

**不拥有 / 非目标**

- 表头中的排序、筛选、调整大小和选择控件 —— 由 `component:Table` 及其插件所有。
- 标题内容 —— 归调用方所有。

## Public concepts

| 概念       | 封闭值或状态                                 | 含义                           | 按变体/方向/状态的可用性 | 默认值 | 所有者 | 稳定性 | 无效值行为         |
| ---------- | -------------------------------------------- | ------------------------------ | ------------------------ | ------ | ------ | ------ | ------------------ |
| 作用域     | `col`、`row`、`colgroup`、`rowgroup`；未设置 | 原生表头作用域。               | 始终                     | 未设置 | 调用方 | 稳定   | 封闭联合类型。     |
| 上下文操作 | 操作列表或 getter；未设置                    | 在表头上下文菜单中显示的操作。 | 始终                     | 无     | 调用方 | 稳定   | 空列表不渲染菜单。 |
| 内容       | ReactNode                                    | 标题。                         | 始终                     | —      | 调用方 | 稳定   | —                  |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| FR1 | TableHeaderCell 渲染一个 `th`，携带 `table-header-cell` 目标，该目标反射 Table 的密度，容纳其内容，并且仅在给定时才带 `scope`。在 Table 之外，它不添加任何表头处理。                                                                                                                                                                                                                       | 当前源码与测试                                                |
| FR2 | 在 Table 内，表头单元格使用半粗体的 `--color-text-secondary` 文本并与起始端对齐，按 Table 的密度设置内边距，截断其文本，像 `component:TableCell` FR3 那样将其外侧边缘单元格对齐到容器内缩，并且始终绘制一条 `--border-width` `--color-border` 底部分隔线，即使 Table 的分隔线关闭时也是如此。使用 `columns` 或 `grid` 分隔线时，它绘制一条行内末端分隔线，最后一个表头单元格省略该分隔线。 | 当前源码与测试                                                |
| FR3 | 有上下文操作时，内容位于上下文菜单触发器中。                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试                                                |
| FR4 | `ref` 到达 `th`；受支持的 DOM、data、ARIA 和事件 prop 在组件的目标与样式之前到达它；`xstyle`（单个样式或列表）胜过上下文样式，并且 `className` 和 `style` 与目标一并组合。                                                                                                                                                                                                                 | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 内容。** 任何标题内容都可以填充该单元格。

### Representative states

| 状态       | 必需不变式                               | 允许的变体 |
| ---------- | ---------------------------------------- | ---------- |
| 独立       | 带目标且无处理的 `th`。                  | —          |
| 每种密度   | 密度内边距和 `data-density`。            | —          |
| 分隔线关闭 | 底部分隔线仍然绘制。                     | —          |
| 列分隔线   | 除最后一个表头单元格外的行内末端分隔线。 | —          |

### Transformation and precedence order

- **ORD1 — 样式。** 表头处理 → 列分隔线 → 调用方 `xstyle`、`className` 和 `style`。

### Performance and resources

- **PR1 — 无资源。** TableHeaderCell 读取 Table 的外观，不持有任何状态。

## Accessibility contract

- **AR1 — 原生表头语义。** `th` 保持其原生表头角色 —— 列标题，或在 `scope="row"` 或 `"rowgroup"` 下的行标题 —— 并在给定时带上调用方的 `scope`；截断仅是视觉上的，因此完整标题仍是其可访问内容。

## Design relationships

| 解剖结构或状态 | 设计要求                                                 | 表示权威       | 层级角色 | 组件契约 |
| -------------- | -------------------------------------------------------- | -------------- | -------- | -------- |
| 列标题单元格   | 通过字重、颜色和一条底部分隔线与下方区分开的标题单元格。 | 当前源码与文档 | 支持性   | FR1、FR2 |

主题化：`th` 携带 `table-header-cell` 目标，`Table.doc.mjs` 将其映射为 `component:Table` 的列标题单元格部分。`TableHeaderCell.doc.mjs` 未声明自己的解剖结构，因此此处不声明解剖结构-主题化块。

## Family and system relationships

- `component:Table` 拥有外观设置、表头控件和目标映射。
- `component:TableCell` FR3 定义了表头单元格共享的边缘对齐。

## Verification map

| 契约      | 验证                                                                                                            | 代表性状态                                                                                   | 变异或失败预期                                                                                                                                            | 审计部分                         |
| --------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1、AR1  | `TableHeaderCell.test.tsx` 元素、作用域和 Table 外测试；`Table.test.tsx` 密度反射测试；`themingTargets.test.ts` | 默认；`scope`；独立；各密度                                                                  | 非 `th` 元素、未请求或缺失的 `scope`、Table 之外的样式，或缺失的目标或 `data-density` 都会失败。`themingTargets.test.ts` 只会捕获被重命名或未记录的目标。 | `audit:TableHeaderCell/anatomy`  |
| FR2       | `TableHeaderCell.test.tsx` 密度、字重与颜色、底部分隔线和列分隔线测试                                           | 三种密度；分隔线关闭、行、列、网格                                                           | 错误的密度内边距、字重或颜色、缺失的底部分隔线，或错误的列分隔线都会失败。缺口：截断和边缘对齐没有检查。                                                  | `audit:TableHeaderCell/layout`   |
| FR3       | `tableContextMenu.test.tsx` 表头上下文菜单测试                                                                  | 带操作的表头单元格                                                                           | 带操作的表头单元格不打开其菜单，或不带操作的表头单元格打开了菜单，都会失败。                                                                              | `audit:TableHeaderCell/behavior` |
| FR4、ORD1 | `TableHeaderCell.test.tsx` xstyle、数组 xstyle、ref、属性以及 className 和 style 测试                           | 调用方输入                                                                                   | `ref` 偏离 `th`、丢弃属性、上下文样式胜过 `xstyle`，或丢失调用方 class 或 style 都会失败。                                                                | `audit:TableHeaderCell/api`      |
| PR1       | 源码审查                                                                                                        | 每种状态                                                                                     | 缺口：如果 TableHeaderCell 添加状态，没有自动化检查会失败。                                                                                               | `audit:TableHeaderCell/behavior` |
| RTL 关系  | RTL 审计在 `In Card` 故事上策展的 D2 和 D8 目标（`apps/storybook/rtl-audit/targets.json`）                      | 一个 `padding={0}` 的 Card，其中第一列的逻辑行内起始内边距与其行内末端内边距不同；LTR 和 RTL | 第一列不在行内起始端，或边缘内边距在 RTL 下仍停留在同一物理侧，都会使 D2 或 D8 失败。                                                                     | `audit:TableHeaderCell/i18n-rtl` |

## Decision log

未记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到它们的所有者。
