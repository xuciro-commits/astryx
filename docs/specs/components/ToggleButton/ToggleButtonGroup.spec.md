---
schema_version: 3
template_version: 7
kind: component
id: component:ToggleButtonGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, accessibility]
verified_by:
  [
    packages/core/src/ToggleButton/ToggleButton.test.tsx,
    packages/core/src/ToggleButton/ToggleButtonGroupTracking.test.tsx,
    packages/core/src/ToggleButton/__tests__/ToggleButtonGroupTracking.interaction.browser.spec.ts,
    packages/core/src/ToggleButton/__tests__/ToggleButton.a11y.test.tsx,
    packages/core/src/ToggleButton/__tests__/ToggleButton.a11y.chromium.spec.ts,
    packages/core/src/Layer/layerScopedContext.test.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:buttons]
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-085, spec:AST-038]
---

# ToggleButtonGroup component contract

## Contract at a glance

| 区域          | 约定                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开约定      | 无变化。ToggleButtonGroup 接受 `label`、`type`（`single` 或 `multiple`）、受控的 `value` 与 `onChange`、`orientation`、`size`、`isDisabled`、`xstyle` 以及 `data-testid`。 |
| 行为          | 一个带名称的 `role="group"`，由彼此独立的 ToggleButton 组成。有值的成员显示组的选择，并向组请求切换；组通过 `onChange` 报告下一次选择。                                    |
| 最终用户影响  | 用户挑选一个或多个选项；触摸按压可以滑过，且只有抬手处的开关才有作用。每个成员都是自己的 Tab 停靠点，禁用组的成员仍保留各自的停靠点。                                      |
| 构建者影响    | 无。                                                                                                                                                                       |
| 兼容性/就绪度 | 无 API 或默认值变化。                                                                                                                                                      |
| 审查检查      | 拒绝没有名称的组、按压状态与 `value` 不一致的成员、由组激活触发的成员 Action、包装层阴影，以及相连的表面。                                                                 |
| 管辖规则      | `family:buttons` FR8、FR11、FR12、AV5；`spec:AST-085` FR1、FR7。                                                                                                           |

本表是审查用的投影；下面的正文具有权威性。

## Intent

ToggleButtonGroup 负责一组 ToggleButton 上的单选或多选，并按 `family:buttons` 的指派把它们布局为彼此独立的表面。使用方用法见 `ToggleButtonGroup.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：鼠标下为 `yes`；在触摸表现下，按压会获得滑过各个开关的效果；`type="single"`、`orientation="horizontal"`、`isDisabled={false}`
- 兼容性类别：没有公开 prop、默认值或导出的变化；在触摸表现下，DOM 会为每个被跟踪的开关增加 action-group 条目标记，在组根上增加手势宿主的 `data-astryx-touch-action` 标记与命中层的 inset 属性，且启用组的根还会是 `position: relative`，因此绝对定位的后代在此处相对它解析
- 受控/非受控行为：仅受控；组自身不持有选择
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- 组根：角色、无障碍名称、布局，以及 `toggle-button-group` 目标。
- 选择：哪些有值的成员处于按压状态，以及成员激活所请求的下一次选择。
- 有值与无值成员所读取的默认尺寸和禁用状态。
- 在跟踪被保持的指针期间跨成员的按压（`family:action-groups`）：绘制在指针下成员上的按压效果、只触发该成员点击的抬手，以及把成员触摸目标向 44 px 扩大的命中层。

**不负责 / 非目标**

- 每个成员的表面、`aria-pressed`、悬停与选中绘制，以及禁用渲染——由 `component:ToggleButton` 与 `component:Button` 负责。
- 相连的几何形态与共享高度——不提供；成员是彼此独立的表面（`family:buttons` FR12）。
- 漫游焦点——不提供；每个成员都是 Tab 停靠点（`family:buttons` AV5）。
- 单模式下强制要求选择——不提供；激活的成员会取消选中。

## Public concepts

| 概念 | 封闭取值或状态               | 含义                         | 按变体/方向/状态的可用性           | 默认值       | 所有者                        | 稳定性 | 无效值行为                                              |
| ---- | ---------------------------- | ---------------------------- | ---------------------------------- | ------------ | ----------------------------- | ------ | ------------------------------------------------------- |
| 类型 | `single`、`multiple`         | 可以有多少成员处于按压状态。 | 始终可用；决定 `value` 的形态。    | `single`     | `component:ToggleButtonGroup` | 稳定   | TypeScript 会拒绝与类型不匹配的 `value` 或 `onChange`。 |
| 取值 | `string \| null`、`string[]` | 已选成员的取值。             | 始终可用；必填。                   | 必填         | `component:ToggleButtonGroup` | 稳定   | 没有任何成员携带的取值不会选中任何可见内容。            |
| 方向 | `horizontal`、`vertical`     | 行或列的布局。               | 始终可用。                         | `horizontal` | `component:ToggleButtonGroup` | 稳定   | TypeScript 会拒绝其他取值。                             |
| 尺寸 | `sm`、`md`、`lg`             | 成员的默认尺寸。             | 始终可用；成员自身的 `size` 优先。 | 成员的 `md`  | `family:buttons`              | 稳定   | TypeScript 会拒绝其他取值。                             |
| 禁用 | 关、开                       | 每个成员都被禁用。           | 始终可用。                         | 关           | `component:ToggleButtonGroup` | 稳定   | 不适用。                                                |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                         | 依据                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ |
| FR1 | 根是一个元素，带 `role="group"`，`aria-label` 设为 `label`，并携带 `astryx-toggle-button-group`、`data-testid` 与 `xstyle`。它不暴露自己的方向或禁用属性。                                                                     | `family:buttons` FR11；当前源码与测试      |
| FR2 | 成员排成一行（垂直时为列），以 `--spacing-1` 间距分隔。包装层不绘制表面也不绘制阴影；每个成员保留自己的表面与高度。                                                                                                            | `family:buttons` FR8、FR12；当前源码与测试 |
| FR3 | `value` 在选择中的成员渲染为按压状态；其他所有有值的成员渲染为未按压状态。                                                                                                                                                     | `family:buttons` FR11；当前测试            |
| FR4 | 单模式：激活未按压成员时以它的值调用 `onChange`；激活已按压成员时调用 `onChange(null)`。                                                                                                                                       | 当前测试                                   |
| FR5 | 多模式：激活未按压成员时，以当前取值加上追加其值调用 `onChange`；激活已按压成员时，以移除该值后的取值调用它。                                                                                                                  | 当前测试                                   |
| FR6 | 成员激活只是请求一个选择。按压状态在调用方传入新的 `value` 时改变，绝不会更早，也不会运行任何成员 Action 或 Action 待定状态（`component:ToggleButton` FR6）。                                                                  | `family:buttons` FR11；当前测试            |
| FR7 | 成员把组的 `size` 读作自己的默认尺寸，并读取组的禁用状态。禁用时，每个成员必须按 `component:ToggleButton` FR7 被禁用：可用 `aria-disabled` 获得焦点且保持惰性（`spec:AST-085` FR1、FR7）；启用的组不会重新启用自行禁用的成员。 | `family:buttons` FR3、FR11；当前测试       |
| FR8 | 每个成员按 DOM 顺序都是自己的 Tab 停靠点；组不添加方向键处理。                                                                                                                                                                 | `family:buttons` AV5；当前源码             |
| FR9 | 组的选择、尺寸与禁用上下文不会到达在由成员打开的层内渲染的 ToggleButton（`spec:AST-038` FR7、FR8）。                                                                                                                           | 当前源码                                   |

### Allowed variation

- **AV1 — 成员。** 成员是 ToggleButton；没有 `value` 的成员只读取组的尺寸与禁用状态，其他行为与独立使用时相同。

### Representative states

| 状态               | 必需的不变式                                       | 允许的变化         |
| ------------------ | -------------------------------------------------- | ------------------ |
| 单选，未选中任何项 | 每个成员未按压；激活其中一个会请求它的值。         | 方向。             |
| 单选，选中一项     | 该成员为按压状态；激活它会请求 `null`。            | —                  |
| 多选，选中若干项   | 每个被选中的成员为按压状态；激活会添加或移除一个。 | —                  |
| 成员禁用           | 该成员保持惰性；其他成员可选。                     | 是否存在 Tooltip。 |
| 组禁用             | 每个成员可聚焦且保持惰性。                         | —                  |

### Transformation and precedence order

- **ORD1 — 成员按压状态。** 对有值的成员，取组的选择；成员自身的 `isPressed` 被忽略。
- **ORD2 — 成员尺寸。** 成员的 `size`，然后是组的 `size`，最后是 `md`。
- **ORD3 — 成员禁用。** 组禁用或成员禁用。

### Performance and resources

- **PR1 — 仅按压跟踪带来布局读取与监听器。** 每个组，包括禁用的组，都通过 `useTouchPresentation` 读取触摸表现，它会监听两个媒体查询。只有在触摸表现下启用的组才会跟踪按压并监视其命中区域。其他任何组都不读取盒子。按压开始时，跟踪器读取组盒子一次。对手指，它读取每个启用开关的盒子三次，以挑选最近的目标；对笔则读取两次。手指按压还会读取每个禁用开关的盒子一次。它还会读取组不跟踪的每个成员的盒子一次，例如没有值的开关。手指按压组的自身盒子或命中层时，先再读取每个成员的盒子一次。组只在开关的目标与其重合处接受该按压。按压不会读取组之外的任何盒子。移动过程中与抬手时都不读取任何内容。命中区域监视（`utils/hitArea.ts`）在组布局变化时读取被跟踪的启用开关的盒子，而不是在按压时。它每页监听一次 `(pointer: coarse)` 查询。它针对页面的交互元素，把命中层的每一边扩展到该边上开关所能扩展的范围。它在最外侧开关的目标处结束，即使组的盒子伸过了它们。只要组跟踪按压，该层就存在；没有扩展时它不覆盖任何内容。除了 `family:action-groups` FR5 赋予它的按压跟踪之外，组不添加其他观察器或监听器。

## Accessibility contract

- **AR1 — 组名称。** 组暴露 `role="group"`，以 `label` 作为其名称；成员保留自己的名称与 `aria-pressed`。
- **AR2 — 键盘。** Tab 按顺序在成员间移动（FR8）；每个成员像 Button 一样用 Enter 和 Space 激活。
- **AR3 — 禁用。** 成员按 `component:Button` AR5 暴露禁用；组根不携带禁用状态。

## Design relationships

| 解剖或状态 | 设计要求                                 | 表示权威 | 层级角色 | 组件约定 |
| ---------- | ---------------------------------------- | -------- | -------- | -------- |
| 成员       | 彼此独立的 ToggleButton 表面，带小间距。 | 当前源码 | 主要     | FR2      |
| 组包装层   | 仅布局；不绘制也不加阴影。               | 当前源码 | 辅助     | FR2      |

没有设计记录管辖 ToggleButtonGroup。其根携带 `toggle-button-group` 目标，不反射任何视觉 prop。

## Family and system relationships

- `family:buttons` 指派了选择所有权、有间距的布局、无包装层高度，以及开关组自身的键盘模型（FR11、FR12、AV5）；ToggleButtonGroup 采用它们。
- 对有值的成员，`component:ToggleButton` 把按压状态与请求交给组处理（`component:ToggleButton` FR6）。
- `spec:AST-085` FR7 适用于组禁用。

## Verification map

| 约定                   | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 代表性状态                             | 变异或失败预期                                                                                                                                                                  | 审计小节                                |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| FR1、AR1               | `ToggleButton.test.tsx` 的组角色与标签用例                                                                                                                                                                                                                                                                                                                                                                                                                                          | 单选与多选                             | 缺少名称或角色即失败。证据缺口：没有测试断言根目标、`data-testid` 或 `xstyle`。                                                                                                 | `audit:ToggleButtonGroup/accessibility` |
| FR3–FR5、ORD1          | `ToggleButton.test.tsx` 的单选与多选用例集                                                                                                                                                                                                                                                                                                                                                                                                                                          | 选中、切换、取消选中、添加、移除       | 按压成员错误或 `onChange` 负载错误即失败。                                                                                                                                      | `audit:ToggleButtonGroup/behavior`      |
| FR6                    | `ToggleButton.test.tsx` 的组所有权用例                                                                                                                                                                                                                                                                                                                                                                                                                                              | 带独立处理器与 `onClick` 的成员        | 运行了成员 Action，或按压状态在 `value` 之前改变，即失败。                                                                                                                      | `audit:ToggleButtonGroup/behavior`      |
| FR7、ORD3、AR3         | `ToggleButton.test.tsx` 的禁用用例集；`ToggleButton.a11y.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                  | 成员禁用；组禁用；带 Tooltip 的成员    | 禁用的成员发生切换，或被重新启用的成员，即失败。                                                                                                                                | `audit:ToggleButtonGroup/accessibility` |
| FR2                    | `ToggleButton.test.tsx` 的分组高度用例                                                                                                                                                                                                                                                                                                                                                                                                                                              | 带自身高度的成员                       | 成员在组内失去自身高度即失败。证据缺口：没有测试断言间距或未绘制的包装层。证据缺口：没有测试读取成员绘制的阴影。                                                                | `audit:ToggleButtonGroup/layout`        |
| FR9（选择）            | `layerScopedContext.test.tsx` 的 "ends ancestor selection and callbacks while honoring explicit toggle props" 用例                                                                                                                                                                                                                                                                                                                                                                  | 位于固定 Layer 与内联 Dialog 内的成员  | 层内成员跟随外部组的选择或回调即失败。                                                                                                                                          | `audit:ToggleButtonGroup/behavior`      |
| FR8、FR9（尺寸与禁用） | 证据缺口：没有测试覆盖成员的 Tab 顺序，或在层处的尺寸与禁用作用域                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                      | —                                                                                                                                                                               | `audit:ToggleButtonGroup/accessibility` |
| FR7（尺寸）、ORD2      | 证据缺口：没有测试断言组尺寸默认值或成员尺寸优先级                                                                                                                                                                                                                                                                                                                                                                                                                                  | —                                      | —                                                                                                                                                                               | `audit:ToggleButtonGroup/behavior`      |
| PR1                    | `ToggleButtonGroupTracking.test.tsx` 的 "marks each toggle as a tracked action, and marks none while the group is disabled"、每次按压只标记一次的用例，以及计数用例 "reads each box a fixed number of times as a press begins (PR1)"，还有色带用例 "draws each tracked toggle's touch band on the group's hit layer: a tracked toggle draws none of its own, and a toggle without a value keeps its own"；`ToggleButtonGroupTracking.interaction.browser.spec.ts` 的 44 px 目标用例 | 手指与笔下组跟踪；组禁用；没有值的开关 | 禁用的组仍在跟踪、手指下目标未达到 44 px 的开关、按压开始时读取次数不同、每次移动都读取盒子，或被跟踪开关带自己的触摸色带，均失败。证据缺口：没有测试统计触摸表现的监听器数量。 | `audit:ToggleButtonGroup/behavior`      |
| AR2                    | `ToggleButton.a11y.test.tsx` 与 `ToggleButton.a11y.chromium.spec.ts` 针对单选组与多选组状态的可操作与可聚焦事实                                                                                                                                                                                                                                                                                                                                                                     | 组成员                                 | 组成员不可操作或 Tab 无法到达即失败。                                                                                                                                           | `audit:ToggleButtonGroup/accessibility` |
| RTL 关联               | RTL 审计在 `ToggleButton / Group single` 上精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`）                                                                                                                                                                                                                                                                                                                                                                                | 两个相邻的开关按钮；LTR 与 RTL         | 较早的按钮不在下一个按钮的行内起始位置即失败 D2。                                                                                                                               | `audit:ToggleButtonGroup/i18n-rtl`      |

## Current-state impact

无。

## Decision log

没有组件本地决策。ToggleButtonGroup 应用 `family:buttons`。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审计结果、实现步骤，或家族/系统规则。它链接到它们的所有者。
