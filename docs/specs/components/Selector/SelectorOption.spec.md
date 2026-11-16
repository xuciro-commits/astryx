---
schema_version: 3
template_version: 7
kind: component
id: component:SelectorOption
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, layout, theming]
verified_by:
  [
    packages/core/src/Selector/Selector.test.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# SelectorOption component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `SelectorOption` 与 Selector 一同导出，接受 `label`（必需）、`icon`、`description`、`layout`（默认 `stacked`，或 `inline`）、`endContent`、`xstyle`、`className` 与 `style`。 |
| Behavior                | 渲染一个 Item 行：可选图标、标签、可选描述与可选末尾内容，并去掉该行自身的 padding 与圆角，以便其宿主行对它进行布局。                                                         |
| End-user impact         | 用户看到自定义 Selector 选项与选中值，其行形状与内置选项一致；长字符串标签会以省略号截断，而不会溢出狭窄的 popover。                                                          |
| Builder impact          | 构建者从 `renderOption` 或 `renderValue` 返回它，以便在选择内容的同时保留 `selector-option` 目标与共享的行布局。                                                              |
| Compatibility/readiness | 记录已发布行为；无 API、默认值或 DOM 变更。缺失的 `ref` 与 DOM props 列于 Current-state impact 之下。                                                                         |
| Review checks           | 拒绝丢失的图标、描述或末尾内容，拒绝在 InputGroup 之外忽略调用方的布局、或在其中作为 Selector 触发器值却仍保持 stacked 的布局，或拒绝丢失的 `selector-option` 目标。          |
| Governing rules         | `architecture:component-theming-surface`；`architecture:public-component-api` INV5、INV8；`component:Item`（针对它所组合的行）。                                              |

本表是审查用的投影；下文正文具有权威性。

## Intent

让自定义 Selector 选项与值的渲染获得与内置选项相同的行布局和主题化目标，同时不拥有选项语义或选择行为。

## Compatibility and migration

- 已发布默认值保持不变：是
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用；SelectorOption 不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 它通过 `component:Item` 渲染的内容行：图标槽位、标签、描述、布局选择与末尾内容。
- 该行上的 `selector-option` 目标，以及去掉该行自身的 padding、圆角与最小宽度。
- 当其宿主固定行高时折叠为 `inline`。

**不拥有 / 非目标**

- 选项行的 role、name、selected 与 highlighted 状态，以及选择行为 —— 由 `component:Selector` 拥有。
- 触发器围绕所渲染值的尺寸 —— 由 `component:Selector` 拥有。
- Item 的布局、密度与目标 —— 由 `component:Item` 拥有。

## Public concepts

| Concept     | Closed values or states | Meaning                                                                                        | Availability by variant/orientation                                        |
| ----------- | ----------------------- | ---------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| layout      | `stacked`、`inline`     | `stacked` 让描述单独占一行；`inline` 让标签与描述处于同一行。                                  | 由调用方选择，但在 InputGroup 内作为 Selector 触发器值时例外（`inline`）。 |
| icon        | 缺失、存在              | 语义图标名或图标组件会渲染为标签之前的一个小的 secondary Icon；其他 ReactNode 内容按原样渲染。 | 每种布局。                                                                 |
| end content | 缺失、存在              | 标签与描述之后的调用方内容。                                                                   | 每种布局。                                                                 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                  | Basis                                                    |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| FR1 | SelectorOption 渲染一个 `component:Item` 行：`icon` 存在时放在起始槽位（语义图标名或图标组件渲染为小的 secondary Icon，其他 ReactNode 内容按原样），`label`，`description` 存在时，以及 `endContent` 存在时。Selector 的默认选项渲染器也通过 SelectorOption 绘制每个选项。 | 当前源码与测试                                           |
| FR2 | 该行使用调用方的 `layout`（默认 `stacked`）。当其宿主固定行高时（InputGroup 内的 Selector 触发器），无论调用方传入什么，该行都是 `inline`。                                                                                                                                | 当前源码与测试                                           |
| FR3 | 该行携带 `selector-option` 目标。它自身的块级与行内 padding、圆角均为零，最小宽度为零，因此长字符串标签会在狭窄宿主内以省略号截断（ReactNode 标签则换行）。调用方 `xstyle` 在这些基础样式之后合并；`className` 与 `style` 会到达该行。                                     | `architecture:component-theming-surface`；当前源码       |
| FR4 | SelectorOption 必须接受连接到其行的 `ref`，并把受支持的 DOM props 传递给它（`architecture:public-component-api` INV5、INV8）。实现缺口：它既不接受 `ref`，也不接受其他 DOM props。                                                                                         | `architecture:public-component-api` INV5、INV8；当前源码 |

### Allowed variation

- **AV1 — 内容。** 标签、描述、图标与末尾内容都是调用方内容。
- **AV2 — 主题绘制。** 主题可以重新样式化 `selector-option` 目标。

### Representative states

| State                   | Required invariant             | Allowed variation |
| ----------------------- | ------------------------------ | ----------------- |
| 选项，stacked           | 描述位于标签下方。             | 内容。            |
| 选项，inline            | 标签与描述在同一行。           | 内容。            |
| InputGroup 中的触发器值 | `inline`，无论调用方传入什么。 | 内容。            |
| 带末尾内容              | 末尾内容位于标签与描述之后。   | 内容。            |

### Transformation and precedence order

- **ORD1 — 布局。** 宿主固定的 `inline` → 调用方 `layout` → `stacked`。
- **ORD2 — 样式。** 基础行重置 → 调用方 `xstyle` → `className` 与 `style`。

### Performance and resources

- **PR1 — 纯渲染。** SelectorOption 不持有任何状态、effect、监听器、观察器或定时器。

## Accessibility contract

- **AR1 — 仅内容。** SelectorOption 不添加 role、name 或 state；它所在的 Selector 选项行拥有这些。语义名称或图标组件是装饰性的；其他 ReactNode 内容保留其调用方赋予的语义。

## Design relationships

| Anatomy or state | Design requirement           | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------- | ------------------------ | -------------- | ------------------ |
| 行               | 像内置选项一样布局选项内容。 | 当前源码                 | 支撑           | FR1、FR3           |
| 图标             | 一眼识别该选项。             | 当前源码                 | 支撑           | FR1                |
| 标签             | 为选项命名。                 | 当前源码                 | 主要           | FR1、FR3           |
| 描述             | 添加次要细节。               | 当前源码                 | 支撑           | FR1、FR2           |
| 末尾内容         | 在文本之后承载调用方内容。   | 当前源码                 | 支撑           | FR1                |

`Selector.spec.md` 在其主题化解剖中把 `selector-option` 目标映射为“SelectorOption-rendered content”，因此本记录不携带解剖与主题的映射。

## Family and system relationships

- `component:Selector` 拥有选项行、触发器，以及其主题化解剖中的 `selector-option` 映射。
- `component:Item` 拥有 SelectorOption 所组合的行布局。
- `architecture:component-theming-surface` 拥有目标放置。
- `architecture:public-component-api` 拥有样式组合。

## Verification map

| Contract             | Verification                                                                                                    | Representative states              | Mutation or failure expectation                                                                                                         | Audit section                   |
| -------------------- | --------------------------------------------------------------------------------------------------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1                  | `Selector.test.tsx` 的“renders custom option endContent”与“renders the selected option through renderValue”     | 带末尾内容的选项；带图标与描述的值 | 丢失末尾内容、标签、描述或图标即失败。证据缺口：没有测试断言语义图标名或图标组件的“小的 secondary”呈现。                                | `audit:SelectorOption/anatomy`  |
| FR2                  | `Selector.test.tsx` 的“follows the caller's SelectorOption layout, but folds inline in a group”                 | 独立触发器；InputGroup 中的触发器  | InputGroup 中的 stacked 行，或默认情况下独立的 inline 行，即失败。证据缺口：没有测试在 InputGroup 之外传入 `layout="inline"`。          | `audit:SelectorOption/layout`   |
| FR3                  | `Selector.test.tsx` 的“lets a narrow list shrink an option so its label can ellipsize”                          | 狭窄列表中的默认选项               | 缺少 `selector-option` 行或最小宽度非零，即失败。证据缺口：没有测试断言 padding 与圆角重置，或行上的 `xstyle`、`className` 与 `style`。 | `audit:SelectorOption/theming`  |
| ORD1, ORD2, PR1, AR1 | ORD1 由 FR2 行覆盖。证据缺口：没有测试断言 ORD2、PR1 或装饰性图标                                               | —                                  | —                                                                                                                                       | `audit:SelectorOption/behavior` |
| FR4                  | 证据缺口：没有测试，与 FR4 的缺口一致                                                                           | —                                  | —                                                                                                                                       | `audit:SelectorOption/api`      |
| RTL relation         | RTL 审计策划的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `Selector / With icons`（popup 已打开） | 打开选项中的图标与标签；LTR 与 RTL | 不在其标签行内起始处的选项图标会使 D2 失败。                                                                                            | `audit:SelectorOption/i18n-rtl` |

## Current-state impact

- **无 ref 或 DOM props（FR4）。** SelectorOption 既不接受 `ref`，也不接受其他 DOM props，这违反 `architecture:public-component-api` INV5 与 INV8。

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表与示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
