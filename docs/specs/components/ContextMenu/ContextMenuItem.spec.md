---
schema_version: 3
template_version: 7
kind: component
id: component:ContextMenuItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api]
verified_by: [packages/core/src/ContextMenu/ContextMenu.test.tsx]
modules: []
families: []
design_specs: []
architecture: [architecture:public-component-api]
contributing: []
system_specs: []
---

# ContextMenuItem component contract

## Contract at a glance

| Area                    | Contract                                                                                        |
| ----------------------- | ----------------------------------------------------------------------------------------------- |
| Public contract         | `ContextMenuItem` 是从 ContextMenu 入口以该名称导出的 `DropdownMenuItem`，并带有其 props 类型。 |
| Behavior                | 与 ContextMenu 复合 `menuContent` 内的 `component:DropdownMenuItem` 完全一致。                  |
| End-user impact         | 上下文菜单行在外观和行为上与下拉菜单行完全一致。                                                |
| Builder impact          | 构建者可以组合 ContextMenu 行，而无需从 DropdownMenu 导入。                                     |
| Compatibility/readiness | 记录已发布行为；无 API、默认值或 DOM 变更。                                                     |
| Review checks           | 拒绝与 DropdownMenuItem 不一致的 ContextMenuItem，或该名称背后的单独实现。                      |
| Governing rules         | `component:DropdownMenuItem`；`architecture:public-component-api`。                             |

本表是审查投影；下方正文具有权威性。

## Intent

在不引入第二套行实现的前提下，为 ContextMenu 调用方提供以 ContextMenu 命名的行。

## Compatibility and migration

- 保留已发布默认值：是。
- 兼容类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- `ContextMenuItem` 导出名及其 `ContextMenuItemProps` 类型名。

**不拥有 / 非目标**

- 所有行行为、语义和目标 —— 由 `component:DropdownMenuItem` 拥有。
- 围绕它的菜单 —— 由 `component:ContextMenu` 拥有。

## Public concepts

| Concept  | Closed values or states | Meaning                                 | Availability | Default | Owner                       | Stability | Invalid-value behavior |
| -------- | ----------------------- | --------------------------------------- | ------------ | ------- | --------------------------- | --------- | ---------------------- |
| 别名名称 | `ContextMenuItem`       | ContextMenu 名称下的 DropdownMenuItem。 | 复合模式     | —       | `component:ContextMenuItem` | stable    | 不适用。               |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                        | Basis    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| FR1 | `ContextMenuItem` 与 `DropdownMenuItem` 是同一个组件，`ContextMenuItemProps` 即 `DropdownMenuItemProps`；该行遵循 `component:DropdownMenuItem`。 | 当前源码 |

### Allowed variation

- **AV1 — 无。** 该别名本身不添加任何内容。

### Representative states

| State  | Required invariant                            | Allowed variation |
| ------ | --------------------------------------------- | ----------------- |
| 复合行 | 在 ContextMenu 内渲染为 DropdownMenuItem 行。 | 行内容。          |

### Transformation and precedence order

- **ORD1 — 无。** 该别名没有自身的优先级顺序。

### Performance and resources

- **PR1 — 无自身内容。** 资源属于 DropdownMenuItem。

## Accessibility contract

- **AR1 — 同一行。** 语义和键盘行为属于 `component:DropdownMenuItem`。

## Design relationships

| Anatomy or state | Design requirement | Representation authority     | Hierarchy role | Component contract |
| ---------------- | ------------------ | ---------------------------- | -------------- | ------------------ |
| 行               | 与下拉菜单行相同。 | `component:DropdownMenuItem` | Prominent      | FR1                |

`component:DropdownMenuItem` 拥有该行的目标，`component:ContextMenu` 在其主题化解剖中映射指针操作行，因此本记录不携带解剖-主题化映射。

## Family and system relationships

- `component:DropdownMenuItem` 拥有行契约。
- `component:ContextMenu` 拥有菜单。

## Verification map

| Contract | Verification                                                                                                                                                | Representative states | Mutation or failure expectation                                                                                   | Audit section               |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1, AR1 | `ContextMenu.test.tsx` 复合用例（"renders menuContent as menu items"、"renders ContextMenuItem endContent"、"calls onClick when compound item is clicked"） | 复合行                | 不能作为菜单行渲染或行为的 ContextMenuItem 会失败。证据缺口：没有测试断言该导出与 DropdownMenuItem 是同一个组件。 | `audit:ContextMenuItem/api` |

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例或行契约。

它链接到它们的所有者。
