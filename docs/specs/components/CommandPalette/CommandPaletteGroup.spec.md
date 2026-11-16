---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteGroup.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# CommandPaletteGroup component contract

## Contract at a glance

| 领域          | 契约                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `CommandPaletteGroup`，以及必需的字符串 `heading`、`children`、`ref`、`xstyle`、`className`、`style` 与根 DOM props。 |
| 行为          | 由 `heading` 命名的一组命令结果，标题在这些结果上方显示为视觉标签。                                                   |
| 最终用户影响  | 相关命令出现在可见标题之下，屏幕阅读器用户进入该组时会听到组名。                                                      |
| 构建者影响    | 无。                                                                                                                  |
| 兼容性/就绪度 | 记录已发布行为；无公共变更。                                                                                          |
| 审查检查      | 拒绝未命名的组、被朗读两次的标题，或与组目标合并的标题目标。                                                          |
| 治理规则      | `component:CommandPalette`；`architecture:public-component-api` INV5；`architecture:component-theming-surface`。      |

本表是审查投影；下方正文具有权威性。

## Intent

CommandPaletteGroup 在 CommandPalette 列表内把一个标题下的相关命令结果汇集起来。使用方的用法见 `CommandPaletteGroup.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

无。

## Ownership boundary

**拥有**

- 组根、它的角色与名称，以及 `command-palette-group` 目标（FR1、FR3）。
- 视觉标题及其 `command-palette-group-heading` 目标（FR2、FR3）。
- 根 ref、DOM props 与样式（FR4）。

**不拥有 / 非目标**

- 选项语义与激活 —— 由 `component:CommandPaletteItem` 拥有。
- 列表、搜索与键盘导航 —— 由 `component:CommandPalette` 与 `component:CommandPaletteList` 拥有。

## Public concepts

除使用方 props 之外，没有组件本地概念。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                | 依据           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 根具有 `role="group"`，并通过 `aria-label` 由 `heading` 命名，除非调用方提供自己的 `role` 或 `aria-label`（FR4）；根把标题与子项排布在一列中。        | 当前源码与测试 |
| FR2 | 标题在子项之前把 `heading` 渲染为辅助文本，并对辅助技术隐藏，因此名称只被朗读一次。                                                                   | 当前源码与测试 |
| FR3 | 根携带 `command-palette-group`，标题携带单独的 `command-palette-group-heading` 目标。                                                                 | 当前源码与测试 |
| FR4 | `ref`、DOM props、`className`、`style` 与 `xstyle` 到达根，调用方显式的 `role` 或 `aria-label` 也到达根（`architecture:public-component-api` INV5）。 | 当前源码       |

### Allowed variation

- **AV1 — 内容。** 标题文本与分组条目可变。
- **AV2 — 主题。** 主题分别重新设置组与标题的样式。

### Representative states

| 状态     | 必需不变式                       | 允许的变化 |
| -------- | -------------------------------- | ---------- |
| 分组结果 | 具名的组，带一个隐藏的视觉标题。 | 条目。     |

### Transformation and precedence order

- 无优先级规则。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 具名的组。** 组由 `heading` 命名（FR1），除非调用方提供自己的 `aria-label`（FR4）。
- **AR2 — 单次朗读。** 视觉标题对辅助技术隐藏，因此名称不会被重复（FR2）。

## Design relationships

| 解剖结构或状态 | 设计要求               | 表示权威 | 层级角色 | 组件契约 |
| -------------- | ---------------------- | -------- | -------- | -------- |
| 组             | 在一列中汇集相关结果。 | 当前源码 | 支撑     | FR1、FR3 |
| 组标题         | 用辅助文本标记该组。   | 当前源码 | 支撑     | FR2、FR3 |

由 `component:CommandPalette` 拥有的聚合 CommandPalette 解剖结构图，把 Group 与 Group heading 部分映射到这些目标。

## Family and system relationships

- `component:CommandPalette` 拥有聚合解剖结构与复合键盘模型；`component:CommandPaletteItem` 拥有其中的选项。

## Verification map

| 契约     | 验证                                                                      | 代表状态   | 变异或失败预期                                                                                           | 审计章节                                  |
| -------- | ------------------------------------------------------------------------- | ---------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1、AR1 | `CommandPaletteGroup.test.tsx` "has group role with aria-label"           | 分组结果   | 缺少 role 或名称会失败。                                                                                 | `audit:CommandPaletteGroup/accessibility` |
| FR2、AR2 | `CommandPaletteGroup.test.tsx` 的 heading、`aria-hidden` 与装饰性标题测试 | 分组结果   | 暴露给辅助技术的标题会失败。                                                                             | `audit:CommandPaletteGroup/accessibility` |
| FR3      | `CommandPaletteGroup.test.tsx` 的标题目标测试；`themingTargets.test.ts`   | 分组结果   | 缺失或合并的目标会失败。                                                                                 | `audit:CommandPaletteGroup/theming`       |
| FR4      | 源码审查                                                                  | 调用方输入 | 缺口：没有测试覆盖 `ref`、DOM props、`className`、`style`、`xstyle`，或调用方的 `role` 或 `aria-label`。 | `audit:CommandPaletteGroup/api`           |

从源码读取，尚无聚焦测试：

- FR1：单列布局。
- FR4：根上的 `ref`、DOM props、`className`、`style` 与 `xstyle`。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 props 表或示例，也不重复 CommandPalette 的搜索与键盘行为。它链接到这些内容的所有者。
