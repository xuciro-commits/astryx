---
schema_version: 3
template_version: 7
kind: component
id: component:TableSelectionToolbar
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Table/TableSelectionToolbar.test.tsx,
    apps/storybook/stories/TableSelection.stories.tsx,
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
    architecture:internationalization,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# TableSelectionToolbar component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                    |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `selection`（来自 useTableSelectionState）、`startContent`、`label`、`renderSelectionLabel`、`clearLabel`、`size`、`variant`，以及除 `endContent` 之外的其余 Toolbar 属性。 |
| Behavior                | 一个批量操作 Toolbar，在有行被选中时出现，显示调用方的操作、已选中数量，以及清除选择的一条命令。                                                                            |
| End-user impact         | 人们可以对选中的行一起执行操作，看到已选中多少行，并一步清除选择。                                                                                                          |
| Builder impact          | 无；本记录描述的是已发布的行为。                                                                                                                                            |
| Compatibility/readiness | 已发布行为记录为 current；无 API、默认值或输出变更。有一处实现差距列在“当前状态影响”下。                                                                                    |
| Review checks           | 拒绝以下情况：在没有选择时显示工具栏，默认标签、计数或清除标签未本地化，或清除命令执行后仍保留行选中。                                                                      |
| Governing rules         | `architecture:internationalization` INV1a；`spec:AST-085` FR4；`architecture:public-component-api`。                                                                        |

本表是审查视图；下文正文具有权威性。

## Intent

TableSelectionToolbar 是带行选择的 Table 的批量操作栏。它负责该栏何时显示、选择状态，以及清除命令；操作由调用方负责。

使用方语法与示例属于 `TableSelectionToolbar.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes` —— `sm`、`muted`、已本地化的“Bulk actions”、“{count} selected”和“Unselect All”。
- 兼容性类别：记录已发布行为；无公共 prop、默认值、DOM、target 或样式输出变更。
- 受控/非受控行为：选择状态就是调用方传入的那份共享状态。
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **清除后焦点丢失（FR2）。** 激活清除命令会清除选择，这会连带移除工具栏和持有焦点的那个按钮；焦点落回页面，因此键盘用户会失去位置，而 `spec:AST-085` FR4 要求移除聚焦控件的组件指明焦点的去向。

## Ownership boundary

**负责**

- 仅在有行被选中时显示工具栏、已选中数量的状态，以及清除命令。

**不负责 / 非目标**

- 工具栏布局、尺寸与变体 —— 由 `component:Toolbar` 负责。
- 选择状态 —— 由 useTableSelectionState 负责。
- `startContent` 中的批量操作 —— 由调用方负责。
- 跨服务端页面、匹配某个查询的每一行所构成的选择 —— 由应用负责，应用传入自己的计数与标签（DEC-1）。

## Public concepts

| Concept    | Closed values or states                       | Meaning                                      | Availability by variant/orientation/state | Default       | Owner               | Stability | Invalid-value behavior |
| ---------- | --------------------------------------------- | -------------------------------------------- | ----------------------------------------- | ------------- | ------------------- | --------- | ---------------------- |
| 选择       | 共享的选择状态                                | 是否显示，以及计数什么、清除什么。           | 始终                                      | —             | 调用方              | 稳定      | —                      |
| 标签       | `label`、`clearLabel`、`renderSelectionLabel` | 工具栏的名称、清除命令的标签，以及计数内容。 | 始终                                      | 本地化默认值  | 调用方              | 稳定      | 计数渲染器可能返回空。 |
| 工具栏选项 | `size`、`variant`、其他 Toolbar 属性          | 传递给 Toolbar。                             | 始终                                      | `sm`、`muted` | `component:Toolbar` | 稳定      | —                      |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                | Basis          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 无选择时，TableSelectionToolbar 不渲染任何内容。有选择时，它渲染一个由 `label`（默认本地化为“Bulk actions”）命名的 Toolbar，其中承载调用方的 `startContent`，并在其末尾承载已选中计数内容（默认本地化为“{count} selected”，或 `renderSelectionLabel` 的结果）以及一个标签为 `clearLabel`（默认本地化为“Unselect All”）的 ghost 按钮。默认文本来自消息目录（`architecture:internationalization` INV1a）。 | 当前源码与测试 |
| FR2 | 清除按钮通过共享状态清除整个选择，这会在清除按钮持有焦点时移除工具栏。`spec:AST-085` FR4 要求本记录指明焦点去向；该去向尚未确定（OQ1）。实现差距：工具栏卸载时焦点会丢失（见“当前状态影响”）。                                                                                                                                                                                                           | 当前源码与测试 |
| FR3 | `size` 默认为 `sm`，`variant` 默认为 `muted`；其他 Toolbar 属性传递给 Toolbar，且不接受 `endContent`。                                                                                                                                                                                                                                                                                                   | 当前源码       |

### Allowed variation

- **AV1 — 操作与标签。** 任意操作与产品特定的标签。

### Representative states

| State        | Required invariant                 | Allowed variation |
| ------------ | ---------------------------------- | ----------------- |
| 无选择       | 不渲染任何内容。                   | —                 |
| 有选择       | 具名工具栏、操作、计数、清除按钮。 | 标签。            |
| 自定义空计数 | 计数渲染器可以渲染空内容。         | —                 |

### Transformation and precedence order

- **ORD1 — 标签。** 调用方标签 → 消息目录默认值。

### Performance and resources

- **PR1 — 无资源。** TableSelectionToolbar 自身不持有任何状态。

## Accessibility contract

- **AR1 — 具名工具栏。** 该栏是一个具有可访问名称的 Toolbar，清除命令是一个带标签的原生按钮。

## Design relationships

| Anatomy or state | Design requirement                 | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------- | ------------------------ | -------------- | ------------------ |
| 批量操作栏       | 针对选中行的操作、计数与清除命令。 | 当前源码与文档           | 支撑           | FR1–FR3            |

主题化：TableSelectionToolbar 不新增 target；它渲染的 Toolbar 与 Button 各自携带自己的 target。`TableSelectionToolbar.doc.mjs` 未声明解剖结构，因此此处不声明解剖结构主题化块。

## Family and system relationships

- `component:Toolbar` 负责布局与主题化。
- `spec:AST-085` FR4 负责聚焦控件被移除后的焦点；FR2 记录了该差距。
- `architecture:internationalization` 负责默认文本；FR1 应用 INV1a。

## Verification map

| Contract       | Verification                                                                                            | Representative states      | Mutation or failure expectation                                                                                  | Audit section                          |
| -------------- | ------------------------------------------------------------------------------------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1, ORD1, AR1 | `TableSelectionToolbar.test.tsx` 的无选择、操作与状态、空计数和自定义标签测试                           | 无选择；有选择；自定义标签 | 无选择时出现的工具栏，缺少名称、计数、操作或清除按钮，或忽略自定义标签的工具栏，都会失败。                       | `audit:TableSelectionToolbar/behavior` |
| FR2            | `TableSelectionToolbar.test.tsx` 的清除测试                                                             | 清除                       | 清除后仍保留行选中的行为会失败。差距：没有测试覆盖清除后焦点的去向。                                             | `audit:TableSelectionToolbar/a11y`     |
| FR3, PR1       | `TableSelectionToolbar.test.tsx` 的默认值测试；源码审查                                                 | 默认值                     | 未默认 `sm` 与 `muted` 的工具栏会失败。差距：如果 TableSelectionToolbar 增加状态或监听器，没有自动化检查会失败。 | `audit:TableSelectionToolbar/api`      |
| RTL relation   | RTL 审计策划的 D2 目标（`apps/storybook/rtl-audit/targets.json`）作用于 `TableSelection / Bulk actions` | 选中一行；LTR 与 RTL       | 已选中计数未位于“Unselect All”的行内起始位置，即违反 D2。                                                        | `audit:TableSelectionToolbar/i18n-rtl` |

## Decision log

### DEC-1 — A selection of every matching row stays with the app

**Reference:** `component:TableSelectionToolbar/DEC-1`

**Decider:** `cixzhang`, `2026-11-06`

当用户跨服务端页面选中匹配某个查询的每一行时，由应用保留该选择（“所有匹配行减去排除项”），并向工具栏传入它自己的 `selectedCount` 与 `renderSelectionLabel`。在此模式下 `selectedKeys` 只保存已加载的行，因为完整集合不在客户端上。此类选择的 Core 模型将与 Table 的服务端分页契约一并决定，因为两者都需要一个未被加载的总数。

已否决：在服务端分页契约存在之前，于 `useTableSelectionState` 中提供全匹配模式。

## Open questions

- **OQ1 — 当 Clear 移除工具栏时，焦点去哪里？**（`human-api`）`spec:AST-085` FR4 要求本记录指明该去向；在指明之前，清除选择的键盘用户会失去位置。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 Table 规则。它链接到各自的负责方。
