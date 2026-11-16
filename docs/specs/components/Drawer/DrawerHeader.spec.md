---
schema_version: 3
template_version: 7
kind: component
id: component:DrawerHeader
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Drawer/DrawerHeader.test.tsx,
    apps/storybook/stories/DrawerHeader.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-regions]
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:container-padding]
contributing: []
system_specs: []
---

# DrawerHeader component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `DrawerHeader` 带 `title`、`subtitle`、`onOpenChange`、`startContent`、`endContent`、`endContentEdgeCompensation`（`inline`、`block`、`all`）和 `hasDivider`；五个 `drawer-header` 目标。 |
| 行为          | Drawer 的 Layout 标题行：可选的起始内容、带可选副标题的 h2 标题、可选的结束内容，以及仅当提供 `onOpenChange` 时才出现的关闭按钮。                                                         |
| 最终用户影响  | 用户看到抽屉的标题，以及调用方提供时的具名关闭按钮；标题挂载时焦点不移动。                                                                                                                |
| 构建者影响    | 无。                                                                                                                                                                                      |
| 兼容性/就绪度 | 记录已交付行为；无公共变更。                                                                                                                                                              |
| 审查检查      | 拒绝在没有 `onOpenChange` 时渲染的关闭按钮、在挂载时命名 Drawer 或移动焦点的标题，或不是 h2 的标题。                                                                                      |
| 管辖规则      | `component:Drawer`（面板与命名）；`family:layout-regions`；`architecture:component-theming-surface`。                                                                                     |

本表是审查用的投影；下方正文具有权威性。

## Intent

DrawerHeader 是调用方在 Drawer 的 Layout 标题槽中组合的可选标题行。它拥有该行的各部分、其关闭按钮及其目标。使用方用法位于 `DrawerHeader.doc.mjs`。

## Compatibility and migration

- 已交付默认值保留：`yes`
- 兼容性类别：记录已交付行为；无公共变更
- 受控/非受控行为：关闭按钮调用调用方的 `onOpenChange(false)`，自身不拥有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 标题行、其槽位、标题语义、关闭按钮、结束内容的边缘补偿，以及五个目标（FR1–FR5）。

**不拥有 / 非目标**

- Drawer 的名称、焦点进入和打开状态 —— 由 `component:Drawer` 拥有。
- 标题区域的内边距、分隔线默认值及其在 Layout 中的位置 —— 由 `family:layout-regions` 通过 `LayoutHeader` 拥有。
- 关闭 Button —— 由 `component:Button` 拥有。

## Public concepts

| 概念         | 封闭取值或状态                 | 含义                                                   | 按变体/方向/状态的可用性 | 默认值                                     | 所有者                   | 稳定性 | 无效值行为                |
| ------------ | ------------------------------ | ------------------------------------------------------ | ------------------------ | ------------------------------------------ | ------------------------ | ------ | ------------------------- |
| 结束内容补偿 | `inline`、`block`、`all`、省略 | 结束槽的哪些边缘向外拉伸，以让尾部控件与容器边缘对齐。 | 结束槽。                 | 设置 `onOpenChange` 时为两个轴，否则不拉伸 | `component:DrawerHeader` | 稳定   | TypeScript 拒绝其他取值。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                            | 依据           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | DrawerHeader 渲染在接收 `ref`、`hasDivider`、`xstyle`、`className`、`style` 及其他 DOM props 的 LayoutHeader 内。其行带有 `drawer-header`，并按顺序显示起始内容、标题块和结束槽。 | 当前源码与测试 |
| FR2 | 标题渲染为 h2；可渲染的 `subtitle`（包括 `0`）在其下方作为次要小号正文文本渲染，空值则不渲染任何内容。起始和结束槽在其内容可渲染时（包括 `0`）渲染。                              | 当前源码与测试 |
| FR3 | 提供 `onOpenChange` 时，结束槽以一个仅图标的 ghost Button 结尾，其名称与 tooltip 由 `@astryx.dialog.close` 给出，并调用 `onOpenChange(false)`；未提供时没有关闭按钮。             | 当前源码与测试 |
| FR4 | 结束槽按 `endContentEdgeCompensation` 在块轴、行内末端边缘或两者上向外拉伸 `--spacing-2`；省略时，仅当存在关闭按钮才两者都适用。                                                  | 当前源码       |
| FR5 | 起始槽、标题块、结束槽和关闭图标分别携带 `drawer-header-start-content`、`drawer-header-title-block`、`drawer-header-end-content` 和 `drawer-header-close-icon`。                  | 当前源码与测试 |
| FR6 | 挂载标题不移动焦点，且标题不命名 Drawer。                                                                                                                                         | 当前源码与测试 |

### Allowed variation

- **AV1 — 槽位。** 起始、结束和副标题内容可变或缺失。

### Representative states

| 状态              | 必需不变式                       | 允许的变化 |
| ----------------- | -------------------------------- | ---------- |
| 仅标题            | h2 标题；无关闭按钮。            | —          |
| 带 `onOpenChange` | 末尾有具名关闭按钮；边缘已补偿。 | 结束内容。 |
| 起始和结束槽      | 顺序：起始、标题块、结束。       | 内容。     |

### Transformation and precedence order

- **ORD1 — 补偿。** 先 `endContentEdgeCompensation`，然后是关闭按钮默认值（FR4）。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 标题。** 标题是 h2。
- **AR2 — 关闭名称。** FR3 的翻译名称与 tooltip。
- **AR3 — 焦点。** FR6。

## Design relationships

| 结构或状态 | 设计要求                     | 表示权威           | 层级角色 | 组件契约 |
| ---------- | ---------------------------- | ------------------ | -------- | -------- |
| 标题行     | 起始、标题块、结束位于一行。 | 当前源码与公共文档 | 支撑     | FR1      |
| 起始内容   | 前置的调用方内容。           | 当前源码与公共文档 | 支撑     | FR2, FR5 |
| 标题块     | 标题与可选副标题。           | 当前源码与公共文档 | 突出     | FR2, FR5 |
| 结束内容   | 尾部的调用方内容和关闭按钮。 | 当前源码与公共文档 | 支撑     | FR3–FR5  |
| 关闭图标   | 按钮内的关闭图标。           | 当前源码与公共文档 | 支撑     | FR3, FR5 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Header row": {"target": "drawer-header"},
  "Start content": {"target": "drawer-header-start-content"},
  "Title block": {"target": "drawer-header-title-block"},
  "End content": {"target": "drawer-header-end-content"},
  "Close icon": {"target": "drawer-header-close-icon"}
}
```

## Family and system relationships

- `component:Drawer` 在其 Layout 中承载标题，并拥有命名与焦点。
- `family:layout-regions` 拥有它所渲染进的标题区域。

## Verification map

| 契约          | 验证                                     | 代表性状态                 | 变异或失败预期                         | 审计章节                           |
| ------------- | ---------------------------------------- | -------------------------- | -------------------------------------- | ---------------------------------- |
| FR1, FR2, AR1 | `DrawerHeader.test.tsx` 的标题与槽位测试 | 标题、副标题、`0` 值、空槽 | 错误的标题级别或内容丢失会失败。       | `audit:DrawerHeader/anatomy`       |
| FR3, AR2      | `DrawerHeader.test.tsx` 的关闭按钮测试   | 带与不带 `onOpenChange`    | 没有回调的按钮，或无名称，会失败。     | `audit:DrawerHeader/accessibility` |
| FR5           | `DrawerHeader.test.tsx` 的主题目标测试   | 所有槽位                   | 缺失目标会失败。                       | `audit:DrawerHeader/theming`       |
| FR6, AR3      | `DrawerHeader.test.tsx` 的焦点测试       | 挂载                       | 挂载时移动焦点会失败。                 | `audit:DrawerHeader/accessibility` |
| 主题结构映射  | `scripts/check-knowledge.mjs`            | 使用方结构与当前目标       | 缺失、多余或过期的映射会导致校验失败。 | `audit:DrawerHeader/theming`       |

FR4 从源码读取；尚无聚焦测试检查它。

从源码读取，尚无聚焦测试：

- FR1：`ref`、`hasDivider`、`xstyle`、`className`、`style` 及其他 DOM props 到达 LayoutHeader。
- FR3：关闭按钮的 tooltip。
- FR4：结束槽的边缘补偿。
- FR6：标题不命名 Drawer。

## Decision log

未记录组件本地决策。

## Open questions

- `endContentEdgeCompensation` 的 `inline`、`block` 和 `all` 轴取值如何映射到 `endContentEdge` 的处理取值（`architecture:container-padding`），旧 prop 何时进入其兼容窗口？目前该 prop 按已交付状态继续受支持。

## Content boundary

本文件不重复使用方 prop 表、示例或 Drawer 行为。它链接到其所有者。
