---
schema_version: 3
template_version: 7
kind: component
id: component:VisuallyHidden
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/VisuallyHidden/VisuallyHidden.test.tsx,
    apps/storybook/stories/VisuallyHidden.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009, spec:AST-071]
---

# VisuallyHidden component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 一个包装组件：`children` 必填，`as` 元素可选；无障碍属性与 data 属性透传。它不接受 `className` 或 `style`，且当前忽略 `xstyle`（FR3 缺口，OQ1）。 |
| 行为          | 内容由一个固定的样式块从视觉上裁剪，任何调用方输入都无法取代它，并保留在无障碍树中，除非调用方传入 `hidden`、`inert` 或 `aria-hidden`。           |
| 最终用户影响  | 屏幕阅读器用户会听到视力正常用户无需看到的名称与播报。                                                                                            |
| 构建者影响    | 无；本文档描述的是已交付行为。                                                                                                                    |
| 兼容性/就绪度 | 已发布行为被记录为 current；无 API、默认值或输出变更。一项实现缺口列在“当前状态影响”小节下；OQ1 仍未关闭。                                        |
| 审查检查      | 拒绝以 `display: none` 或 `visibility: hidden` 实现隐藏、拒绝会取代裁剪的调用方输入，也拒绝丢失 `aria-*` 透传。                                   |
| 治理规则      | `architecture:public-component-api/INV5,INV6,INV8`；`spec:AST-071` FR2。                                                                          |

此表是审查投影；以下正文为准。

## Intent

VisuallyHidden 把内容暴露给辅助技术，同时让它不可见：图标按钮的名称、实时播报区域，以及补充性的屏幕阅读器上下文。它拥有隐藏技术，并保证被隐藏的节点无法被样式化为可见。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：记录已交付行为；无公开 prop、默认值或 DOM 输出变更。`xstyle` 被类型接受但被忽略；`className` 和 `style` 不被接受；样式接口即 FR3 缺口（OQ1）
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **不接受样式输入（FR3）。** VisuallyHidden 丢弃 `className` 和 `style` 并忽略 `xstyle`，因此调用方无法为元素设置样式，而 `architecture:public-component-api` INV6 与 `spec:AST-071` FR2 要求根样式输入可组合。使用方文档计划移除 `xstyle`；OQ1 决定该组件是遵从该规则，还是由 INV6 的所有者将其记录为例外。

## Ownership boundary

**拥有**

- 渲染出的元素及其固定的裁剪样式块。
- 透传无障碍、标识、data 与事件属性。

**不拥有 / 非目标**

- 隐藏内容表达了什么、它是否为实时区域——由调用方通过 `children`、`as` 和 ARIA 属性拥有。
- 共享状态播报——由 `spec:AST-086` 及其共享通道拥有。
- 主题化——VisuallyHidden 没有主题化目标。

## Public concepts

| 概念 | 封闭取值或状态                                                       | 含义                       | 按变体/方向/状态划分的可用性 | 默认值 | 所有者                     | 稳定性 | 无效值行为                                                                        |
| ---- | -------------------------------------------------------------------- | -------------------------- | ---------------------------- | ------ | -------------------------- | ------ | --------------------------------------------------------------------------------- |
| 元素 | 一个固有元素，或一个把 `className` 和 `ref` 转发给它所渲染元素的组件 | 渲染出的元素，行内或块级。 | 始终                         | `span` | `component:VisuallyHidden` | 稳定   | 不转发 `className` 和 `ref` 的组件会以未裁剪的方式渲染其内容，且 ref 保持未设置。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 依据           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | VisuallyHidden 在 `as` 指定的元素（默认 `span`）中渲染 `children`。它自身的隐藏会让内容保留在无障碍树中；调用方的 `hidden`、`inert` 或 `aria-hidden` 会透传并移除它，这由调用方选择。                                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR2 | 当 `as` 是固有元素，或把 `className` 转发给它所渲染的元素时，该元素被绝对定位在其包含块的行内起点与块起点，尺寸为 1px × 1px、外边距为 −1px，无内边距、无边框，以隐藏溢出裁剪为空矩形，不换行，并忽略指针事件与选择。                                                                                                                                                                                                                                              | 当前源码与测试 |
| FR3 | `ref` 能到达该元素（对于组件 `as`，前提是它转发 `ref`），受支持的 `aria-*`、`role`、`id`、`data-*` 与事件属性也能到达它。裁剪样式在每个调用方输入之后应用，因此没有任何输入能取代裁剪。根样式输入在该元素上组合（`architecture:public-component-api` INV6，`spec:AST-071` FR2）。实现缺口：不接受 `className` 和 `style`，且 `xstyle` 被忽略；使用方文档计划移除 `xstyle`，OQ1 决定 VisuallyHidden 是遵从该规则，还是成为一条已记录的 INV6 例外（当前状态影响）。 | 当前源码与测试 |

### Allowed variation

- **AV1 — 元素选择。** 调用方选择行内或块级元素，例如对块级内容使用 `div`，或使用实时区域。

### Representative states

| 状态         | 必需的不变式                                        | 允许的变化 |
| ------------ | --------------------------------------------------- | ---------- |
| 仅图标标签   | 隐藏的 `span` 为该控件提供无障碍名称。              | 文本。     |
| 实时区域     | 带调用方 `aria-live` 的块级元素保持隐藏并被播报。   | 礼貌级别。 |
| 尝试设置样式 | 裁剪仍然胜出；调用方样式当前无效（FR3 缺口，OQ1）。 | —          |

### Transformation and precedence order

- **ORD1 — 属性。** 调用方属性 → 固定裁剪样式，因此裁剪胜出。

### Performance and resources

- **PR1 — 静态渲染。** VisuallyHidden 不持有状态，也不使用 hook。

## Accessibility contract

- **AR1 — 可被辅助技术感知。** 隐藏使用裁剪，绝不使用 `display: none`、`visibility: hidden` 或 `aria-hidden`，因此内容会被朗读，并能命名或描述其他元素。
- **AR2 — 实时区域与按调用方选择隐藏。** VisuallyHidden 不自行添加 role 或实时区域；调用方的 `role`、`aria-live`、`hidden`、`inert` 和 `aria-hidden` 会透传。

## Design relationships

| 结构或状态 | 设计要求                   | 表达权威       | 层级角色 | 组件契约          |
| ---------- | -------------------------- | -------------- | -------- | ----------------- |
| 隐藏内容   | 呈现给辅助技术，但不可见。 | 当前源码与文档 | 支撑性   | FR1–FR3、AR1、AR2 |

主题化：按设计，VisuallyHidden 没有主题化目标；给隐藏节点加上可见样式会破坏其目的。

## Family and system relationships

- `architecture:public-component-api` 拥有透传、ref 与样式输入规则；FR3 应用 INV5、INV6 和 INV8，并记录 INV6 缺口。

## Verification map

| 契约     | 验证                                                                                  | 代表性状态                                                                               | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                 | 审计小节                        |
| -------- | ------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| FR1, AR1 | `VisuallyHidden.test.tsx` 的渲染与图标标签测试                                        | 默认、`as`、仅图标控件                                                                   | 内容离开无障碍树或丢失无障碍名称即失败。缺口：没有测试覆盖调用方 `hidden`、`inert` 或 `aria-hidden` 的透传。                                                                                                                                                                                                                                                                                                                   | `audit:VisuallyHidden/a11y`     |
| FR2      | `VisuallyHidden.test.tsx` 的裁剪样式测试；稳定视觉基线 `core-visuallyhidden--default` | 默认                                                                                     | 出现 `hidden` 属性会使单元测试失败；变为可见的内容会在视觉基线中以变更形式返回。缺口：没有单元测试断言裁剪声明，尽管测试环境会暴露这些声明。                                                                                                                                                                                                                                                                                   | `audit:VisuallyHidden/behavior` |
| FR3, AR2 | `VisuallyHidden.test.tsx` 的 `as`、ref、透传与样式测试                                | 带 `aria-live` 的 `as`；ref；`id`、`role`、`data-testid`；`className`、`style`、`xstyle` | 丢失 `aria-live`、ref 未命中所指元素，或丢掉 `id` 或 `role` 即失败。样式测试固定了当前丢弃 `className`、`style` 和 `xstyle` 属性的行为，这固定的是已记录的 FR3 缺口，而非契约。缺口：没有测试断言 VisuallyHidden 不自行添加 role 或实时区域；当包装组件接收到 ref 时 ref 测试仍然通过；没有测试断言其他 `aria-*` 或事件属性；没有测试检查裁剪是否胜过调用方样式；也没有测试覆盖转发或不转发 `className` 和 `ref` 的组件 `as`。 | `audit:VisuallyHidden/behavior` |
| PR1      | 源码审查                                                                              | 每个状态                                                                                 | 缺口：若 VisuallyHidden 增加状态或 hook，没有自动化检查会失败。                                                                                                                                                                                                                                                                                                                                                                | `audit:VisuallyHidden/behavior` |
| AR1      | 无障碍树证据（`spec:AST-009` FR3）                                                    | 仅图标标签；实时区域                                                                     | 缺口：没有无障碍树检查证明隐藏内容保留在树中；单元测试查询的是 DOM。                                                                                                                                                                                                                                                                                                                                                           | `audit:VisuallyHidden/a11y`     |

## Decision log

未记录。本文档描述已交付行为；OQ1 仍未关闭。

## Open questions

- **OQ1 — VisuallyHidden 应接受根样式输入吗？**（`human-api`）`architecture:public-component-api` INV6 要求根样式输入可组合，除非有 family 决策指明例外，且使用方文档计划移除 `xstyle`；在所有者决定之前，无样式接口就是 FR3 缺口。如果“无样式”是刻意的例外，INV6 的所有者会记录它（并在 `spec:AST-071` 加一条已知缺口条目），FR3 链接到它，而调用方始终没有为元素设置样式的途径。如果组合是方向，FR3 保持原样，由符合规范的实现关闭该缺口。

## Content boundary

本文件不复述使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则，而是链接到它们的拥有者。
