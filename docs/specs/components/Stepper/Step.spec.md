---
schema_version: 3
template_version: 7
kind: component
id: component:Step
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/Stepper/Stepper.test.tsx,
    apps/storybook/stories/Stepper.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:interaction-modality, architecture:component-theming-surface]
contributing: []
system_specs: [spec:AST-085]
---

# Step component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Step` 具有 `step`、`label`、`description`、`children`、`status`、`indicator`（`auto`、`number`、`none`，或一个节点；默认 `auto`）、`isDisabled`、`isOptional`、`endContent` 和 `density`。                                                    |
| 行为          | Stepper 的一个列表项。其进度（已完成、进行中、未开始）由它的 `step` 索引对照 Stepper 的活动步骤推导得出；当 Stepper 具有 `onStepClick` 且不处于紧凑模式时，它是一个请求跳转到该步骤的按钮；禁用的步骤保留其按钮、`aria-disabled`，且永不激活。 |
| 最终用户影响  | 用户看到每个步骤的进度（数字、圆环或对勾）以及适用时的状态提示；屏幕阅读器用户在可点击步骤上听到当前步骤、状态词、“Go to step N”名称和该步骤的描述；键盘用户在可点击步骤之间用 Tab 移动，禁用的步骤也包含在内。                                |
| 构建者影响    | 无。                                                                                                                                                                                                                                           |
| 兼容性/就绪度 | 记录已交付行为，并在 step-indicator 上新增禁用选择器（FR6）；不更改任何 prop 或默认值。存在两处实现缺口（见当前状态影响）。                                                                                                                    |
| 审查检查      | 拒绝在 `indicator="auto"` 下仅用颜色传达状态、拒绝向辅助技术暴露指示器、拒绝会激活的禁用步骤，以及拒绝在非进行中步骤上出现 `aria-current`。                                                                                                    |
| 治理规则      | `component:Stepper`（目标、连接线、标签绘制、紧凑布局）；`architecture:interaction-modality`。                                                                                                                                                 |

本表是审查投影；下文正文具有权威性。

## Intent

Step 是 Stepper 流程中的一个阶段。它负责自身的进度推导、指示器选择、状态提示与文本替代、可点击形态、可选提示，以及其内容的渲染位置。使用方用法见 `Step.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已交付行为；以新增方式在 step-indicator 上添加禁用选择器（FR6）
- 受控/非受控行为：进度跟随 Stepper 的活动步骤
- 迁移决策：无

使用方迁移说明应放在使用方文档和发布说明中。

## Current-state impact

- **其他指示器模式仅靠颜色显示状态，或完全不显示。** 在 `indicator="number"` 下，已到达的步骤仅通过徽章颜色显示状态，未开始的步骤则不显示任何状态。自定义节点在每个步骤上都仅通过其包装器的颜色显示状态。`indicator="none"` 不显示指示器，而在 `auto` 下，当前步骤的圆环和标签无论其 `status` 为何都保持进度颜色，因此这两种情况下状态只出现在视觉隐藏的词里。WCAG 1.4.1 要求信息不得仅靠颜色传达。
- **可点击步骤的名称会隐藏其其他文本。** 按钮的名称是步骤编号、标签和状态词，且只有描述对其加以描述，因此“Optional”提示和 `endContent` 在可点击步骤上永远无法到达辅助技术。WCAG 1.3.1 要求展示的信息可通过程序获得。

## Ownership boundary

**拥有**

- 进度推导、指示器选择、状态图标与文本、可点击按钮、禁用与可选处理，以及密度回退（FR1–FR7）。
- `children` 的渲染位置及其保持挂载的方式（FR8），以及焦点轮廓（FR9）。

**不拥有 / 非目标**

- `step`、`step-bar`、`step-connector`、`step-indicator`、`step-label` 和 `step-description` 目标，连接线几何与间距，Label 与 Description 的绘制，以及紧凑横向呈现——由 `component:Stepper` FR1–FR16 拥有。
- 活动步骤、方向、指示器位置和 `onStepClick`——由 Stepper 及其调用方拥有。
- 自定义指示器图形、`endContent` 和 `children`——由调用方拥有。

## Public concepts

| 概念   | 封闭取值或状态                            | 含义                                      | 按变体/方向/状态的可用性 | 默认值             | 所有者           | 稳定性 | 无效值行为                                                       |
| ------ | ----------------------------------------- | ----------------------------------------- | ------------------------ | ------------------ | ---------------- | ------ | ---------------------------------------------------------------- |
| 进度   | `completed`、`in-progress`、`not-started` | 由 `step` 与 Stepper 的活动步骤推导得出。 | 每个步骤。               | —                  | `component:Step` | 稳定   | 调用方不可设置。                                                 |
| 状态   | `accent`、`success`、`warning`、`error`   | 指示器的语义颜色与图标。                  | 每个步骤。               | 未设置（进度颜色） | `component:Step` | 稳定   | TypeScript 会拒绝其他值。                                        |
| 指示器 | `auto`、`number`、`none`、节点            | 指示器显示的内容。                        | 每个步骤。               | `auto`             | `component:Step` | 稳定   | 非字符串节点按给定内容渲染；其他字符串先显示圆环，然后显示对勾。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 依据                                                                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| FR1 | 一个 Step 渲染一个 `<li>`。当其 `step` 等于 Stepper 的活动步骤时进度为 `in-progress`，更小时为 `completed`，更大时为 `not-started`；只有进行中的步骤带有 `aria-current="step"`。它向 Stepper 注册自己的索引和实时禁用检查。                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试                                                                                                      |
| FR2 | 当 Stepper 上具有 `onStepClick` 时，非紧凑模式下启用的 Step 会将其指示器、标签和描述包裹在 `<button>` 中（内容槽位仍留在其外部），其名称由 `@astryx.step.goToStep`（“Go to step N: label”）或适用状态词时的 `.goToStepWithStatus` 提供；激活（点击、Enter、Space）会调用 `onStepClick(step)`。已完成、进行中和即将到来的步骤全部可点击。任何没有 `onStepClick` 的 Step 都不渲染按钮。非紧凑模式下可点击 Stepper 中的禁用 Step 保留其按钮，可聚焦并带有 `aria-disabled="true"` 和相同名称，保留其 Tab 停靠点，并在聚焦时变为禁用后保留焦点，且不激活（`spec:AST-085` FR1、FR4）。可点击 Step 的描述会描述其按钮，因此禁用步骤的原因可到达辅助技术（`spec:AST-085` FR5）。 | 当前源码与测试                                                                                                      |
| FR3 | `indicator="auto"` 在未开始时显示数字，在进行中时显示圆环，完成一次后显示对勾；`number` 始终显示数字；`none` 不显示任何内容；非字符串节点按给定内容渲染；任何其他字符串在未开始或进行中时回退为圆环，完成一次后回退为对勾，且不带数字、状态图标或状态颜色。指示器为 `aria-hidden`。                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试                                                                                                      |
| FR4 | `status` 永不重着色进度条。在 `indicator="auto"` 下，它用 `success`、`warning` 或 `error` 为非当前步骤重着色，并显示一个独特的状态图标（在未开始的步骤上替换数字）；当前步骤的圆环和 `accent` 保持进度颜色。在 `number` 下，它仅重着色已到达的徽章。                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试                                                                                                      |
| FR5 | 每个 Step 都暴露一个视觉隐藏的状态词：这些状态为 `error` 或 `warning`，完成或 `success` 时为 `completed`，在所有布局中皆如此。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与测试                                                                                                      |
| FR6 | `isDisabled` 使指示器变暗，并在 `step-indicator` 上反映 `disabled`（标签的禁用绘制及其 `disabled` 选择器属于 `component:Stepper` FR10），并阻止激活（FR2）。`isOptional` 在标签之后追加翻译后的 `@astryx.step.optional`（“Optional”）。`endContent` 位于标签行的末尾。                                                                                                                                                                                                                                                                                                                                                                                                   | 与 `architecture:component-theming-surface` INV6 保持一致：指示器和标签（`component:Stepper` FR10）都带有禁用绘制。 |
| FR7 | `density` 设置 Step 的内边距：每种布局中的块向内边距，加上宽松分离步骤的行内边距，以及竖向轨道上步骤的双轴内边距；它回退到 Stepper 的密度。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码                                                                                                            |
| FR8 | `children` 渲染在标签和描述下方；在紧凑横向 Stepper 中它们保持挂载，与展开的详情一同隐藏，因此本地状态得以保留。标签保持在一行并省略号截断；其完整文本保留在可访问名称中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码、文档与测试                                                                                                |
| FR9 | 步骤按钮绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码                                                                                                            |

### Allowed variation

- **AV1 — 指示器图形。** 自定义节点可替换指示器。
- **AV2 — 布局。** 方向与指示器位置来自 Stepper。

### Representative states

| 状态           | 必需的不变式                                      | 允许的变化 |
| -------------- | ------------------------------------------------- | ---------- |
| 已完成、可点击 | 对勾指示器；“completed”文本；具名按钮。           | 状态颜色。 |
| 进行中         | `aria-current="step"`；圆环指示器。               | —          |
| 有错误的未开始 | 错误图标替换数字；“error”文本。                   | —          |
| 禁用           | 变暗；可聚焦且有 `aria-disabled`；不激活（FR2）。 | —          |
| 紧凑横向       | 无按钮；内容挂载但隐藏。                          | —          |

### Transformation and precedence order

- **ORD1 — 状态词。** `error`，然后 `warning`，然后 `completed`（完成的进度或 `success`）。
- **ORD2 — 密度。** Step 的 `density`，然后是 Stepper 的。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 当前步骤。** FR1 的 `aria-current="step"`。
- **AR2 — 非颜色状态。** 在 `indicator="auto"` 下，FR4 的图标与 FR5 的隐藏文本承载颜色之外的状态；指示器对辅助技术保持隐藏。实现缺口：在 `number`、自定义节点和 `none` 模式下，以及在 `auto` 的当前步骤上，状态仅靠颜色显示或只出现在隐藏词中（当前状态影响）。
- **AR3 — 可点击名称。** FR2 的按钮名称包含步骤编号、标签和状态词，且该步骤的描述会描述它。实现缺口：可点击步骤的可选提示和 `endContent` 未被暴露（当前状态影响）。
- **AR4 — 键盘。** 可点击步骤（包括禁用的）按文档顺序用 Tab 到达；启用的步骤用 Enter 或 Space 激活。

## Design relationships

| 解剖结构或状态 | 设计要求                                 | 表示权威           | 层级角色 | 组件契约 |
| -------------- | ---------------------------------------- | ------------------ | -------- | -------- |
| 指示器         | 数字、对勾、状态图标、圆环或自定义节点。 | 当前源码与公开文档 | 突出     | FR3、FR4 |
| 可选提示       | 标签之后的“Optional”。                   | 当前源码           | 辅助     | FR6      |

`Step.doc.mjs` 不声明自己的解剖结构；Step 的解剖结构与目标位于 `component:Stepper` 的主题映射中。

## Family and system relationships

- `component:Stepper` 拥有本组件渲染于其中的目标、连接线、Label 与 Description 绘制，以及紧凑布局。

## Verification map

| 契约         | 验证                                                                                               | 代表性状态                   | 变异或失败预期                                                                                                   | 审计部分                   |
| ------------ | -------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1          | `Stepper.test.tsx` 列表与 aria-current 测试                                                        | 每种进度                     | 当前步骤错误即失败。                                                                                             | `audit:Step/accessibility` |
| FR2, AR3–AR4 | `Stepper.test.tsx` 的 onStepClick、键盘与可访问名称测试                                            | 已完成、活动、即将到来、禁用 | 按钮缺失或名称错误即失败；禁用步骤离开 Tab 顺序、在变为禁用时丢失焦点、缺少 `aria-disabled` 或激活，也同样失败。 | `audit:Step/behavior`      |
| FR3, FR4     | `Stepper.test.tsx` 的步骤编号、指示器与状态图标测试                                                | 每种指示器模式与状态         | 图标错误或进度条被重着色即失败。                                                                                 | `audit:Step/behavior`      |
| FR8          | `Stepper.test.tsx` 的紧凑内容挂载测试                                                              | 两种指示器位置               | 步骤内容在紧凑 Stepper 中隐藏时丢失状态即失败。                                                                  | `audit:Step/behavior`      |
| FR5, AR2     | `Stepper.test.tsx` 的隐藏状态文本测试                                                              | 分离式与轨道上               | 缺少状态文本即失败。                                                                                             | `audit:Step/accessibility` |
| RTL 关系     | RTL 审计精选 D2 目标（`apps/storybook/rtl-audit/targets.json`）中的 `Stepper / Default horizontal` | 步骤指示器与标签；LTR 与 RTL | 指示器不在其标签的行内起始处即未通过 D2。                                                                        | `audit:Step/i18n-rtl`      |

从源码读取，尚无针对性测试：

- FR3：`auto` 下未开始步骤上的数字与完成后的对勾，`none` 下的空指示器，以及字符串回退。
- FR6：变暗的禁用绘制、可选提示和 `endContent`。
- FR7。
- FR8：单行标签。
- FR9。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例或 Stepper 布局规则。它链接到它们的所有者。
