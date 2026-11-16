---
schema_version: 3
template_version: 7
kind: component
id: component:TypeaheadItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, theming]
verified_by:
  [
    packages/core/src/Typeahead/TypeaheadItem.test.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:public-component-api, architecture:component-theming-surface]
contributing: []
system_specs: []
---

# TypeaheadItem component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | Typeahead 的默认结果内容：`item`（必填）、`icon`、`description`、`isDisabled`、`group`、根输入，以及一个 ref。                              |
| 行为          | 在 `typeahead-item` 目标下渲染可选的图标、条目标签，以及可选的描述；禁用时变暗；当条目自带 `item.element` 时改为原样渲染该元素。            |
| 终端用户影响  | 人们能在同一种一致的行布局中看到每个结果的标签、图标和支持性文本。                                                                          |
| 构建方影响    | 构建方在自定义 `renderItem` 中复用它，以保留默认布局与目标。                                                                                |
| 兼容性/就绪度 | 记录已发布的行为；无 API、默认值或 DOM 变化。在 `item.element` 路径上被丢弃的根输入列在 Current-state impact 下。                           |
| 审查检查      | 若丢失 `typeahead-item` 目标、在未提供描述时渲染描述元素，或向此内容添加选项语义，应予以否决。                                              |
| 治理规则      | `architecture:public-component-api` INV5、INV6；`architecture:component-theming-surface`；`component:BaseTypeahead`（负责其外围的选项行）。 |

此表是审查投影；下文才是权威。

## Intent

为 Typeahead 结果，以及想要相同外观的自定义渲染器，提供统一的“标签加支持性内容”布局。

## Compatibility and migration

- 已发布的默认值是否保留：是。
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变化。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- 结果内容布局：图标、标签和描述。
- `typeahead-item` 目标与禁用时的变暗。

**不负责 / 非目标**

- 选项角色、高亮、选中和键盘行为——由 `component:BaseTypeahead` 的结果行负责。
- 调用方提供的 `item.element` 内容。
- 分组。`group` prop 不起作用：TypeaheadItem 会忽略它，而 BaseTypeahead 按 `item.auxiliaryData.group` 对结果分组。

## Public concepts

| 概念     | 封闭取值或状态           | 含义                           | 可用性   | 默认值   | 归属方    | 稳定性 | 无效值行为            |
| -------- | ------------------------ | ------------------------------ | -------- | -------- | --------- | ------ | --------------------- |
| 内容来源 | 默认布局；`item.element` | 条目自带的元素是否替换该布局。 | 每个结果 | 默认布局 | component | stable | `item.element` 优先。 |
| 可用性   | 启用；禁用               | 内容是否变暗。                 | 默认布局 | 启用     | component | stable | 不适用。              |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                    | 依据                                                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| FR1 | 在没有 `item.element` 时，内容先渲染 `icon`，再渲染一列，其中包含条目的 `label`，以及（若提供）`description`；未提供描述时不渲染描述元素。                                                                                | 当前源码与测试                                                 |
| FR2 | 根元素带有 `typeahead-item` 目标；`isDisabled` 将其变暗至半透明。                                                                                                                                                         | `architecture:component-theming-surface`；当前源码与测试       |
| FR3 | 根输入到达根元素：`className` 与组件的类合并，`style` 与 `xstyle` 组合，其他 props 透传，ref 到达根元素。                                                                                                                 | `architecture:public-component-api`；当前测试                  |
| FR4 | 有 `item.element` 时，该元素原样渲染并取代布局。调用方根输入仍必须到达渲染出的根元素（`architecture:public-component-api` INV5、INV6）。实现缺口：在此路径上，ref、`className`、`style`、`xstyle` 以及其他 props 被丢弃。 | `architecture:public-component-api` INV5、INV6；当前源码与测试 |

### Allowed variation

- **AV1 — 内容。** 图标、标签和描述都是调用方数据。
- **AV2 — 主题涂装。** 主题可以重新设定 `typeahead-item` 目标的样式。

### Representative states

| 状态           | 必需的不变式                   | 允许的变化   |
| -------------- | ------------------------------ | ------------ |
| 仅标签         | 标签，无描述元素。             | 标签文本。   |
| 带图标和描述   | 图标，然后是标签位于描述之上。 | 内容。       |
| 禁用           | 变暗至半透明。                 | —            |
| `item.element` | 该元素原样渲染。               | 调用方内容。 |

### Transformation and precedence order

- **ORD1 — 内容。** `item.element` → 默认布局。

### Performance and resources

- **PR1 — 仅渲染。** 此内容不拥有任何 state、effect、监听器或观察器。

## Accessibility contract

- **AR1 — 仅内容。** TypeaheadItem 不添加角色或状态；其外围的选项行负责这些。

## Design relationships

| 结构或状态 | 设计要求             | 表示权威   | 层级角色 | 组件契约 |
| ---------- | -------------------- | ---------- | -------- | -------- |
| 图标       | 让人一眼识别该结果。 | 调用方内容 | 辅助     | FR1      |
| 标签       | 命名该结果。         | 当前源码   | 突出     | FR1      |
| 描述       | 补充次要细节。       | 当前源码   | 辅助     | FR1      |

`component:Typeahead` 和 `component:BaseTypeahead` 在其主题结构中将 `typeahead-item` 目标映射为“Default item content”，因此本记录不携带结构-主题映射。

## Family and system relationships

- `component:BaseTypeahead` 负责选项行，并默认选用此内容。
- `architecture:public-component-api` 负责根输入的组合。

## Verification map

| 契约            | 验证                                                                                                                                                                                                            | 代表性状态                               | 变更或失败预期                                                                    | 审计小节                       |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------ |
| FR1             | `TypeaheadItem.test.tsx` “renders the item label”、“renders the description below the label when provided”、“renders no description element when none is provided”、“renders the icon before the label content” | 标签、描述、图标                         | 缺少标签、描述或图标，出现多余的描述元素，或图标排在标签之后，均失败。            | `audit:TypeaheadItem/anatomy`  |
| FR2             | `TypeaheadItem.test.tsx` “dims the row when isDisabled is set” 与 “does not dim the row by default”                                                                                                             | 启用与禁用                               | 缺少变暗或默认变暗均失败。证据缺口：没有测试断言 `typeahead-item` 类。            | `audit:TypeaheadItem/theming`  |
| FR3             | `TypeaheadItem.test.tsx` “forwards pass-through props to the item element”、“merges a caller className with its own classes”、“forwards ref to the row element”                                                 | 透传、className、ref                     | 丢弃 prop、类或 ref 均失败。证据缺口：没有测试断言 `style` 或 `xstyle`。          | `audit:TypeaheadItem/api`      |
| FR4, ORD1       | `TypeaheadItem.test.tsx` “renders item.element raw in place of the label layout”                                                                                                                                | `item.element`                           | 保留默认布局的元素会失败。证据缺口：没有测试断言此路径上的根输入（即 FR4 缺口）。 | `audit:TypeaheadItem/api`      |
| PR1, AR1        | 证据缺口：没有测试断言缺少生命周期资源或角色                                                                                                                                                                    | —                                        | —                                                                                 | `audit:TypeaheadItem/behavior` |
| RTL 关系（FR1） | RTL 审计策展的 D2 目标（`apps/storybook/rtl-audit/targets.json`）位于 `Typeahead / Parts / TypeaheadItem with icon` 上（已展开结果）                                                                            | 开放结果中的图标、标签和描述；LTR 与 RTL | 结果图标不在其内容的内联起始处则失败 D2。                                         | `audit:TypeaheadItem/i18n-rtl` |

## Current-state impact

- **`item.element` 上的根输入（FR4）。** 当条目自带元素时，传给 TypeaheadItem 的 ref、`className`、`style`、`xstyle` 以及其他 props 会被丢弃，这违反了 `architecture:public-component-api` INV5 和 INV6。

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例或选项行契约。它链接到它们的所有者。
