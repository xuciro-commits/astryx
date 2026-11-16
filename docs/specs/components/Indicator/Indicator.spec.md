---
schema_version: 3
template_version: 7
kind: component
id: component:Indicator
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/Indicator/Indicator.test.tsx,
    packages/core/src/Indicator/indicatorRegistry.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:theme-authoring-contract,
  ]
contributing: []
system_specs: []
---

# Indicator component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变化。`@astryxdesign/core/Indicator` 导出三个内置指示器（`CheckboxIndicator`、`CheckIndicator`、`RadioIndicator`）、共享的指示器 props 与类型、默认注册表，以及按名称解析。            |
| 行为          | 宿主按名称（`check`、`checkbox`、`radio`）绘制装饰性控件视觉。主题中该名称对应的 `indicators` 条目会在每个按名称解析指示器的宿主中替换它；否则渲染内置实现。每个指示器都对辅助技术隐藏。 |
| 终端用户影响  | 在按名称解析指示器的各组件中，人们看到的是针对所选选项、复选框或单选钮的一致标记；屏幕阅读器用户听到的是宿主控件的语义，绝不会听到重复的语义。                                           |
| 构建方影响    | 无。                                                                                                                                                                                     |
| 兼容性/就绪度 | 记录已发布行为；没有 API、默认值或 DOM 变化。有三个宿主直接渲染内置实现，而不是按名称解析；列在 Current-state impact 下。                                                                |
| 审查检查      | 拒绝以下情况：指示器暴露给辅助技术；按名称解析的宿主忽略了主题覆盖；假值 `children` 抑制了内置标记；指示器上带有 role 或 Tab 停靠点。                                                    |
| 管辖规则      | `architecture:component-theming-surface`；`architecture:public-component-api` INV5；`architecture:theme-authoring-contract`。                                                            |

本表是审查投影；下方正文具有权威性。

## Intent

Indicator 是共享的、可替换的装饰性控件视觉集合：所选选项上的标记、复选框绘制的方框，以及单选钮绘制的圆圈。它拥有指示器名称、按名称进行的主题替换、共享的装饰性 prop 契约，以及 RadioIndicator。使用方用法见 `Indicator.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：`yes`；在没有主题覆盖时，`check`、`checkbox` 和 `radio` 解析为内置实现
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、导出或 DOM 变化
- 受控/非受控行为：不适用；由宿主提供 `state`
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 核心指示器名称，以及将它们映射到内置实现的默认注册表。
- 按名称进行的主题替换，以及共享的指示器 prop 契约。
- RadioIndicator，作为 `Indicator.doc.mjs` 的内联组件记录，带有 `radio-indicator` 与 `radio-indicator-dot` 目标。
- 宿主放在元素上的 `indicatorScope` 标记，该元素的悬停会驱动指示器的悬停着色。

**不拥有 / 非目标**

- CheckboxIndicator —— 由 `component:CheckboxIndicator` 拥有。
- CheckIndicator —— 由 `component:CheckIndicator` 拥有。
- 宿主控件的 role、名称、状态、焦点、键盘与激活 —— 由各宿主拥有（CheckboxInput、RadioList、Selector、菜单行）。
- 作为 API 的 `useIndicator` 与 `getIndicator` —— 一个公共 hook 与函数，没有各自的模块记录；除解析相关的 FR2 所述内容外未纳入契约。

## Public concepts

| 概念       | 封闭取值或状态                                      | 含义                         | 按变体/方向/状态的可用性 | 默认值 | 所有者                | 稳定性 | 无效值行为                                        |
| ---------- | --------------------------------------------------- | ---------------------------- | ------------------------ | ------ | --------------------- | ------ | ------------------------------------------------- |
| 指示器名称 | `check`、`checkbox`、`radio`，以及增强名称          | 宿主绘制哪种视觉。           | 始终可用。               | —      | `component:Indicator` | 稳定   | 没有主题提供的增强名称解析为空。                  |
| 状态       | `unchecked`、`checked` 与 `indeterminate`（复选框） | 宿主的选择状态。             | 按指示器族而定。         | 必填   | `component:Indicator` | 稳定   | TypeScript 拒绝该族之外的值。                     |
| 尺寸       | `sm`、`md`                                          | 指示器方框尺寸。             | 始终可用。               | `md`   | `component:Indicator` | 稳定   | TypeScript 拒绝其他值。                           |
| 替换内容   | 可渲染的 `children`                                 | 代替内置状态标记绘制的内容。 | 始终可用。               | 无     | `component:Indicator` | 稳定   | nullish、布尔值与空字符串 children 保留内置标记。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                              | 依据                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| FR1 | 默认注册表恰好映射 `check` → CheckIndicator、`checkbox` → CheckboxIndicator、`radio` → RadioIndicator。                                                                                                                                                                                                                                             | 当前测试                                           |
| FR2 | 宿主从最近的主题中按名称解析指示器：该名称对应的主题 `indicators` 条目优先，否则使用内置实现。一处覆盖会到达每个解析该名称的宿主。Tokenizer 底部面板直接渲染 CheckboxIndicator 与 RadioIndicator，因此主题的 `checkbox` 或 `radio` 条目不会到达它。增强名称只有在主题提供时才会解析。                                                               | `architecture:theme-authoring-contract`；当前测试  |
| FR3 | 每个内置指示器的根元素都在调用方 props 之后设置 `aria-hidden="true"`，因此调用方无法将其暴露；公共 props 类型拒绝 `role` 与 `tabIndex`。指示器接收 `state`、`size`、`isDisabled` 与 `children`，不接收任何会赋予其语义的内容。                                                                                                                      | `architecture:public-component-api` INV5；当前测试 |
| FR4 | 可渲染的 `children` 会在指示器内部替换内置状态标记；nullish、布尔值与空字符串 children 保留该标记，而 `0` 计为内容。                                                                                                                                                                                                                                | 当前测试                                           |
| FR5 | RadioIndicator 渲染一个圆形 span（20 或 24 CSS px），其边框与填充随状态变化：未选中时在表面上呈现强调边框，选中时呈强调色填充，内部带一个位于强调色之上的圆点（8 或 10 CSS px）。禁用时透明度减半并弱化边框（未选中时也弱化填充）。在支持悬停的指针下，悬停宿主的 `indicatorScope` 会为其着色。圆点在强制颜色模式下保持可见。减少动效下过渡为即时。 | 当前源码与测试                                     |
| FR6 | RadioIndicator 的根元素带有 `astryx-radio-indicator`，并带有 `data-size`、`data-checked` 与 `data-disabled`；圆点带有 `astryx-radio-indicator-dot` 与 `data-size`。不输出任何别名目标。调用方 props、`ref`、`className`、`style` 与 `xstyle` 到达根元素。                                                                                           | `architecture:component-theming-surface`；当前测试 |

### Allowed variation

- **AV1 — 替换。** 主题可以用遵守 FR3 的组件替换任何具名指示器。
- **AV2 — 主题绘制。** 主题可以通过其目标重新设定内置实现的样式，而不替换它们。

### Representative states

| 状态          | 必需的不变式                         | 允许的变化 |
| ------------- | ------------------------------------ | ---------- |
| 无主题覆盖    | 每个名称都渲染内置实现。             | —          |
| 主题覆盖      | 每个解析该名称的宿主都绘制覆盖实现。 | 覆盖设计。 |
| 单选钮选中    | 带圆点的强调色圆圈；`data-checked`。 | 尺寸。     |
| 假值 children | 内置标记仍然渲染。                   | —          |

### Transformation and precedence order

- **ORD1 — 解析。** 最近的主题的 `indicators[name]`，然后是内置实现，对未提供的增强名称则为空。
- **ORD2 — 属性。** 调用方 props，然后是指示器自身的 `aria-hidden`。

### Performance and resources

- **PR1 — 纯渲染。** 指示器不拥有任何状态、effect、监听器或观察器。

## Accessibility contract

- **AR1 — 装饰性。** 指示器对辅助技术隐藏；所有语义由宿主拥有（FR3）。
- **AR2 — 强制颜色。** 单选钮圆点在强制颜色模式下保持可见。

## Design relationships

| 解剖结构或状态 | 设计要求                                 | 呈现权威 | 层级角色 | 组件契约 |
| -------------- | ---------------------------------------- | -------- | -------- | -------- |
| 单选钮圆圈     | 未选中时为强调边框；选中时为强调色填充。 | 当前源码 | 支撑     | FR5, FR6 |
| 单选钮圆点     | 选中时为位于强调色之上的圆点。           | 当前源码 | 支撑     | FR5, FR6 |

没有设计记录管辖 Indicator。复选框与勾选视觉由各自的记录拥有。

## Family and system relationships

- `architecture:theme-authoring-contract` 拥有主题如何提供 `indicators`。
- `component:CheckboxIndicator` 与 `component:CheckIndicator` 拥有另外两个内置实现。
- CheckboxInput、RadioListItem、Selector 与菜单选择行承载指示器。

## Verification map

| 契约            | 验证                                                                    | 代表性状态                                                                                           | 变异或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                        | 审计小节                        |
| --------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1, FR2        | `indicatorRegistry.test.tsx`；`Indicator.test.tsx` useIndicator 套件    | 无主题；主题覆盖；增强名称                                                                           | 错误的默认值、被忽略的覆盖，或被解析的未提供名称会失败。                                                                                                                                                                                                                                                                                                                                                                              | `audit:Indicator/behavior`      |
| FR3             | `Indicator.test.tsx` 装饰性契约套件                                     | 每个处于选中状态的内置实现；调用方的 `aria-hidden={false}`；作为字面量 props 的 `role` 与 `tabIndex` | 调用方可以暴露的指示器、被丢弃的普通 prop，或被接受的 `role` 或 `tabIndex` 字面量会失败。证据缺口：没有测试检查未选中状态下的 `aria-hidden`。                                                                                                                                                                                                                                                                                         | `audit:Indicator/accessibility` |
| FR4             | `Indicator.test.tsx` 假值 children 套件                                 | `null`、`false`、`''`、`0`、真实 children                                                            | 抑制任一内置实现标记的假值 child（`false`、`null`、`undefined` 或 `''`）会失败，CheckIndicator 把 `0` 当作空也会失败。证据缺口：没有测试把 `0` 作为 CheckboxIndicator 或 RadioIndicator 的 children 渲染。                                                                                                                                                                                                                            | `audit:Indicator/behavior`      |
| FR5, FR6, AR2   | `Indicator.test.tsx` 的单选钮圆点、禁用与目标名称用例                   | 选中与未选中；禁用；规范目标                                                                         | 未选中时出现圆点、选中时没有圆点、选中时缺少 `data-checked`、禁用时缺少 `data-disabled`，或出现别名目标会失败。证据缺口：没有测试断言单选钮尺寸、状态颜色（强调边框、强调色填充、位于强调色之上的圆点）、减少动效下的即时过渡、禁用时的透明度与边框、悬停着色、强制颜色下的圆点（RadioList 的强制颜色用例在任何匹配规则下都会通过）、根元素与圆点上的单选钮 `data-size`、`ref`，或根元素上调用方的 `className`、`style` 与 `xstyle`。 | `audit:Indicator/theming`       |
| ORD1, ORD2, PR1 | 由 FR2 与 FR3 行覆盖。证据缺口：没有测试断言状态、effect 或监听器不存在 | —                                                                                                    | —                                                                                                                                                                                                                                                                                                                                                                                                                                     | `audit:Indicator/behavior`      |

## Current-state impact

- **直接导入的指示器（FR2）。** Tokenizer 底部面板直接渲染 CheckboxIndicator 与 RadioIndicator，因此主题的 `checkbox` 或 `radio` 覆盖不会到达它。

## Decision log

没有组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或族/系统规则。它链接到它们的所有者。
