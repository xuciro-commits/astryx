---
schema_version: 3
template_version: 7
kind: component
id: component:CheckboxIndicator
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, visual]
verified_by:
  [
    packages/core/src/CheckboxInput/CheckboxInput.test.tsx,
    packages/core/src/Indicator/Indicator.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: []
---

# CheckboxIndicator component contract

## Contract at a glance

| Area            | Contract                                                                                                                                                                                  |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `CheckboxIndicator` 从 `@astryxdesign/core/Indicator` 导出；`state` 为必填，`size` 默认为 `md`，`isDisabled` 默认为 `false`，`children` 可以替换内置标记。                                |
| 行为            | 装饰性复选框外壳始终会渲染。选中态与不确定态绘制各自对应的标记，除非浅层 `isRenderable()` 判定把 `children` 视为替换内容。                                                                |
| 最终用户影响    | 用户获得一个可见的复选框状态提示，而归属控件保留所有语义、焦点、键盘与激活行为。                                                                                                          |
| 构建者影响      | 构建者可以重新设置规范目标的样式，或替换该具名指示器，而无需接管归属控件的语义。                                                                                                          |
| 兼容性/就绪状态 | 记录已发布的行为；没有 API、默认值或 DOM 变更。只输出规范目标 `checkbox-indicator`。                                                                                                      |
| 审查检查        | 拒绝以下情形：`aria-hidden` 丢失、状态标记缺失、透传/ref/样式被丢弃、替换优先级改变，或根元素上出现第二个目标别名。                                                                       |
| 治理规则        | `architecture:public-component-api/INV1,INV5,INV6,INV8,INV9`；`architecture:component-theming-surface/INV3–INV8,INV12`；`architecture:component-test-sufficiency/INV1–INV7,INV10–INV11`。 |

本表是审查投影；下文正文具有权威性。

## Intent

渲染可替换的装饰性视觉，用来传达复选框归属控件的未选中、选中或不确定状态，同时不接管复选框的语义或交互。

## Compatibility and migration

- 已发布的默认值保持：是
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用；`state` 由归属方提供
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 装饰性复选框外壳、状态标记、禁用外观、尺寸、替换内容优先级，以及组件主题化目标。
- 根 DOM ref 以及受支持的中性 DOM 与样式透传。

**不拥有 / 非目标**

- 复选框 role、无障碍名称、焦点、键盘、激活、表单参与或忙碌语义——由组合控件拥有。
- 行放置与逻辑边缘布局——由宿主组件拥有。
- 使用方提供的替换内容的行为或无障碍性。

## Public concepts

| 概念     | 封闭取值或状态                          | 含义                                                                                                           | 按变体/方向/状态的可用性 | 默认值       | 所有者                        | 稳定性                      | 无效值行为                      |
| -------- | --------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------ | ----------------------------- | --------------------------- | ------------------------------- |
| state    | `unchecked`、`checked`、`indeterminate` | 选择内置的视觉状态。                                                                                           | 所有渲染路径。           | 必填         | `component:CheckboxIndicator` | 稳定                        | 被公共类型拒绝                  |
| size     | `sm`、`md`                              | 选择 20px 或 24px 的视觉方框及匹配的标记几何。                                                                 | 所有状态。               | `md`         | `component:CheckboxIndicator` | 稳定                        | 被公共类型拒绝                  |
| 禁用外观 | 启用、禁用                              | 镜像归属控件的禁用呈现，但不产生语义。                                                                         | 所有状态。               | 启用         | `component:CheckboxIndicator` | 稳定                        | 仅布尔值                        |
| 替换内容 | 浅层可渲染或空                          | 当 `isRenderable(children)` 返回 true 时替换两个内置标记。React 元素与容器走此分支，即使其后代不渲染任何内容。 | 所有状态。               | 内置标记路径 | `component:CheckboxIndicator` | 稳定；空容器策略未定（OQ1） | 不支持的取值遵循 React 渲染行为 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                            | 依据                                                           |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| FR1 | 组件必须在每种状态下渲染一个装饰性 span 外壳，并且必须在调用方透传之后设置自身的 `aria-hidden="true"`。                                                           | 已发布源码；`architecture:public-component-api/INV5`           |
| FR2 | `unchecked` 必须不显示任何内置标记，`checked` 必须显示对勾，`indeterminate` 必须显示短横。                                                                        | 已发布源码、文档、测试与 story                                 |
| FR3 | 替换采用浅层 `isRenderable(children)` 优先级：nullish 值、布尔值与空字符串保留状态标记；React 元素与容器则替换它，即使后代不渲染任何内容（OQ1）。                 | 已发布源码与回归测试                                           |
| FR4 | 根元素必须保留受支持的 DOM props、`ref`、`className`、`style` 与 `xstyle`，同时保持组件自有的无障碍优先级。                                                       | `architecture:public-component-api/INV5,INV6,INV8`             |
| FR5 | 根目标必须是 `checkbox-indicator`，且是该元素上唯一的目标；不输出别名目标。                                                                                       | `architecture:component-theming-surface/INV4,INV6`；当前测试   |
| FR6 | 尺寸、选中或不确定（`data-checked`）以及禁用状态必须反映在根目标上；对勾与短横必须保留其专用的 `checkbox-indicator-check` 与 `checkbox-indicator-dash` 绘制目标。 | 已发布源码；`architecture:component-theming-surface/INV4,INV6` |
| FR7 | 状态过渡必须遵循减少动效设置，选中/不确定标记必须在强制颜色模式下保持可感知。                                                                                     | 已发布源码与 WCAG 2.2 1.4.11                                   |

### Allowed variation

- **AV1 — 主题绘制。** Token 与规范组件目标可以改变颜色、边框、圆角、不透明度以及其他允许的视觉属性，而不改变状态或语义归属。
- **AV2 — 替换组件。** 主题可以替换具名的复选框指示器，前提是替换件保留此公共 prop 与装饰性归属契约。

### Representative states

| 状态          | 必需不变式                                                     | 允许的差异               |
| ------------- | -------------------------------------------------------------- | ------------------------ |
| unchecked     | 外壳保持可见且无内置标记。                                     | 主题自有的绘制与形状。   |
| checked       | 外壳与对勾保持可见。                                           | 主题自有的绘制与形状。   |
| indeterminate | 外壳与短横保持可见。                                           | 主题自有的绘制与形状。   |
| disabled      | 所请求的状态在弱化处理下保持可辨识，且没有宿主驱动的悬停响应。 | 主题自有的非活跃处理。   |
| 替换内容      | 浅层可渲染内容在同一外壳内替换两个内置标记。                   | 调用方自有的装饰性内容。 |

### Transformation and precedence order

- **ORD1 — 渲染优先级。** 调用方透传 → 组件自有的 `aria-hidden` → 合并的主题/样式输入 → 浅层替换内容判定 → 内置状态标记。

### Performance and resources

- **PR1 — 纯渲染。** 组件不拥有任何状态、Effect、监听器、观察器、定时器或外部资源。

## Accessibility contract

- **AR1 — 装饰性归属。** 根元素保持 `aria-hidden`；组合控件拥有 role、名称、状态、焦点、键盘、激活与表单语义。
- **AR2 — 强制颜色。** 当作者颜色被强制时，选中与不确定标记仍保持可区分。
- **AR3 — 替换边界。** 替换内容在隐藏的根元素内属于装饰性内容，且不得成为归属控件状态的唯一语义表达。

## Design relationships

| 解剖结构或状态 | 设计要求                      | 呈现权威             | 层级角色       | 组件契约     |
| -------------- | ----------------------------- | -------------------- | -------------- | ------------ |
| 外壳           | 语义主题 token 与规范绘制目标 | 由当前主题化架构规定 | 支撑性控件视觉 | FR1, FR5–FR7 |
| 对勾           | 可见的选中状态标记            | 观察到的已发布呈现   | 支撑性状态提示 | FR2, FR6–FR7 |
| 不确定标记     | 可见的部分状态标记            | 观察到的已发布呈现   | 支撑性状态提示 | FR2, FR6–FR7 |

共享的 `Indicator.doc.mjs` 一并列出 CheckboxIndicator、CheckIndicator 与 RadioIndicator 的解剖结构与目标，因此本记录不携带解剖结构主题化映射。

## Family and system relationships

- `architecture:component-theming-surface` 拥有目标放置与反映状态的职责。
- `component:Indicator` 拥有注册表名称 `checkbox` 与主题替换。
- `architecture:public-component-api` 拥有导出、透传、样式组合、ref 与兼容性要求。
- `architecture:component-test-sufficiency` 拥有每个关键承诺与不同风险分区所需的证据。

## Verification map

| 契约      | 验证                                                                                                                                                                                                                | 代表状态                                              | 变异或失败预期                                                                                                                                                                                                                                                                                           | 审查章节                                |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| FR1, AR1  | `Indicator.test.tsx` 装饰性契约用例                                                                                                                                                                                 | 选中状态；调用方设置 `aria-hidden={false}`            | 一个调用方能将其暴露的选中指示器即失败。证据缺口：没有测试检查未选中或不确定状态下的 `aria-hidden`，也没有测试检查替换内容不是唯一的状态表达（AR3）。                                                                                                                                                    | `audit:CheckboxIndicator/accessibility` |
| FR2, FR3  | `Indicator.test.tsx` 默认指示器、替换与假值 children 用例                                                                                                                                                           | 带假值与真实 children 的选中态；带替换 child 的选中态 | 对勾元素被移除、假值 child 抑制了它、或真实 children 未能替换它，即失败。证据缺口：没有测试查找短横元素；由于两个标记在每种状态下都会渲染并切换各自的 display，没有测试断言每种状态下哪个标记可见。                                                                                                      | `audit:CheckboxIndicator/behavior`      |
| FR4       | `Indicator.test.tsx` 装饰性契约 “仍透传普通 props” 用例                                                                                                                                                             | 中性 DOM props                                        | 丢弃 `data-testid`、`id` 或 `dir` 即失败。证据缺口：没有测试在根元素上断言 `ref`、`className`、`style` 或 `xstyle`。                                                                                                                                                                                     | `audit:CheckboxIndicator/api`           |
| FR5, FR6  | `Indicator.test.tsx` 复选框目标与规范目标用例；`themingTargets.test.ts`                                                                                                                                             | `sm` 下的不确定状态；规范目标                         | `checkbox-indicator` 目标缺失或被别名化，或缺少 `data-checked="indeterminate"` 或 `data-size`，即失败。证据缺口：没有测试在选中状态下断言 `data-checked`、复选框的 `data-disabled`（禁用状态用例渲染的是 RadioIndicator），也没有测试断言 `checkbox-indicator-check` 与 `checkbox-indicator-dash` 目标。 | `audit:CheckboxIndicator/theming`       |
| FR7, AR2  | `CheckboxInput.test.tsx` 强制颜色用例（"compiles a forced-colors fill so the indeterminate mark survives Windows High Contrast"、"compiles a forced-colors color so the checkmark survives Windows High Contrast"） | 强制颜色下的选中与不确定状态                          | 证据缺口：强制颜色用例只要有一条匹配的注入规则就会通过，因此删除对勾与短横的 `CanvasText` 规则仍会通过；没有测试断言减少动效过渡。                                                                                                                                                                       | `audit:CheckboxIndicator/visual`        |
| ORD1, PR1 | 由 FR1–FR4 各行覆盖。证据缺口：没有测试断言状态、副作用或监听器不存在                                                                                                                                               | —                                                     | —                                                                                                                                                                                                                                                                                                        | `audit:CheckboxIndicator/behavior`      |

## Decision log

没有组件本地决策。

## Open questions

- **OQ1 — `children` 中的空 React 容器是否应继续抑制内置状态标记？**（`human-api`）FR3 记录今天确实如此。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审查结果、实现步骤或 family/系统规则。它链接到它们的拥有者。
