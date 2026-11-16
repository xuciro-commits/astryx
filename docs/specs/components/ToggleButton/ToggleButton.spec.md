---
schema_version: 3
template_version: 7
kind: component
id: component:ToggleButton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/ToggleButton/ToggleButton.test.tsx,
    packages/core/src/ToggleButton/__tests__/ToggleButton.a11y.test.tsx,
    packages/core/src/ToggleButton/__tests__/ToggleButton.a11y.chromium.spec.ts,
  ]
modules: []
families: [family:buttons]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# ToggleButton component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 无变更。ToggleButton 接收 `label`、`isPressed`、`onPressedChange`、`pressedChangeAction`、`icon`、`pressedIcon`、`isIconOnly`、`children`、`size`、`elevation`、`isDisabled`、`isLoading`、`tooltip` 和 `value`。                                         |
| Behavior                | 一个带 `aria-pressed` 的 ghost Button。作为独立控件时，它向调用方请求下一个按下值，并且可以在乐观按下状态下运行一个可中断的 Action。作为带值的 ToggleButtonGroup 成员时，由分组同时拥有这两者。                                                           |
| End-user impact         | 人们能看到并听到某个开关是否处于开启状态。待处理的开关会立刻显示其新状态，并且可以再次点击撤回。按下时标签宽度不会移动。禁用的开关仍留在 Tab 键顺序中。                                                                                                   |
| Builder impact          | 无。                                                                                                                                                                                                                                                      |
| Compatibility/readiness | 记录已发布行为；无 API、默认值或 DOM 变更。Button 的减弱动效缺口在此适用；预先被阻止的点击会跳过 Action；调用方的按下属性会覆盖 ToggleButton 自身的属性；标签会渲染两次；使用方文档承诺了一个并不存在的工具提示。以上各项均列在 Current-state impact 下。 |
| Review checks           | 拒绝以下情况：没有 `aria-pressed` 的开关；调用方 `onClick` 取代了开关请求；回调被阻止后仍运行 Action；从过期的已提交值推导出的再次点击；按下状态改变了外部尺寸。                                                                                          |
| Governing rules         | `family:buttons` FR1–FR11、AV1–AV4；`component:Button`；`spec:AST-085` FR1、FR4；`design:reduced-motion` DR1、DR3；`architecture:public-component-api` INV5；`architecture:component-style-authoring` INV7。                                              |

本表是审查投影；下方正文具有权威性。

## Intent

ToggleButton 是该家族中用于持续按压的控件。它复用 Button 的外观，并按照 `family:buttons` 的指派，增加受控的按下状态、按下态涂装、可选的按下图标，以及一个可中断的按下 Action。使用方用法位于 `ToggleButton.doc.mjs` 中。

## Compatibility and migration

- 保留的已发布默认值：`yes`；未按下、`size="md"`、`elevation="none"`
- 兼容性类别：记录已发布行为；无公开 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：仅受控。`isPressed`（默认 `false`）是已提交值；ToggleButton 自身不持有任何已提交状态，只在 Action 待处理期间持有一个乐观值
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 生效的按下状态、`aria-pressed`，以及下一状态请求。
- 独立开关的回调、调用方 `onClick` 与 Action 的顺序。
- Action 待处理期间的乐观按下值。
- 按下态涂装、按下图标替换、按下标签字重，以及按下期间稳定的外部尺寸。
- `toggle-button` 目标及其对 `isPressed` 与 `elevation` 的反射。
- 带值成员如何让位于其 ToggleButtonGroup。

**不拥有 / 非目标**

- 外观、命名规则、尺寸高度、待处理呈现、禁用渲染、工具提示、链接模式与反馈 —— 由 `component:Button` 拥有。
- 分组选择状态、单选或多选模式，以及分组布局 —— 由 `component:ToggleButtonGroup` 拥有。
- 开/关设置 —— 由 `component:Switch` 拥有。
- 继承外部尺寸提供者 —— 不提供（OQ1）。

## Public concepts

| Concept     | Closed values or states      | Meaning                               | Availability by variant/orientation/state            | Default             | Owner                    | Stability | Invalid-value behavior                |
| ----------- | ---------------------------- | ------------------------------------- | ---------------------------------------------------- | ------------------- | ------------------------ | --------- | ------------------------------------- |
| 按下        | 按下、未按下                 | 保留的开/关状态。                     | 独立使用时来自 `isPressed`；带值分组成员来自其分组。 | 未按下              | `component:ToggleButton` | 稳定      | 不适用。                              |
| 按下 Action | 缺失、空闲、待处理           | 为独立开关运行的异步工作。            | 仅在独立使用时；对带值分组成员忽略。                 | 缺失                | `component:ToggleButton` | 稳定      | 不适用。                              |
| 按下图标    | 调用方节点                   | 按下时显示的图标。                    | 按下时；回退到 `icon`。                              | `icon`              | `component:ToggleButton` | 稳定      | 不适用。                              |
| 分组值      | string                       | 向所属 ToggleButtonGroup 标识该成员。 | 在 ToggleButtonGroup 内部。                          | 无                  | `component:ToggleButton` | 稳定      | 没有 `value` 时，成员按独立方式运行。 |
| 尺寸        | `sm`、`md`、`lg`             | 控件高度。                            | 始终。                                               | 分组尺寸，否则 `md` | `family:buttons`         | 稳定      | TypeScript 拒绝其他值。               |
| 阴影高度    | `none`、`low`、`med`、`high` | 静息阴影深度。                        | 独立使用时以及在 ToggleButtonGroup 内部。            | `none`              | `family:buttons`         | 稳定      | TypeScript 拒绝其他值。               |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | Basis                                                                                                           |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| FR1  | ToggleButton 渲染一个采用 `ghost` 变体和 Button 可中断待处理模式的 Button，并将 `aria-pressed` 设为生效的按下值。其他传入的 prop 会传递到 Button。                                                                                                                                                                                                                                                                                                                                                 | `family:buttons` FR2、FR6、AV3；当前源码                                                                        |
| FR2  | 生效的按下值：对 ToggleButtonGroup 内的带值成员而言是分组的选择，否则为 `isPressed`（默认 `false`）；当独立 Action 待处理时，由乐观值替代它。                                                                                                                                                                                                                                                                                                                                                      | `family:buttons` FR6、FR11；当前测试                                                                            |
| FR3  | 独立激活：调用方 `onClick` 先运行。如果该 `onClick` 调用了 `preventDefault()`，则其余都不运行。否则同步运行 `onPressedChange(next, event)`，其中 `next` 是生效值的相反值。如果它调用 `preventDefault()`，Action 不运行。在调用方 `onClick` 运行之前就已被阻止的点击仍会调用 `onPressedChange`，且 `pressedChangeAction` 必须随后运行（`family:buttons` FR5）。实现缺口：Button 对任何已被阻止的点击都会跳过其 `clickAction`，因此 `pressedChangeAction` 不会运行，仅含 Action 的开关会忽略该点击。 | `family:buttons` FR5；当前测试                                                                                  |
| FR4  | 带有 `pressedChangeAction` 时，独立激活会把乐观值设为 `next`，并通过 Button 的 `clickAction` 运行 Action；Button 在 Action 落定前处于待处理状态。无论是否有 `onPressedChange`，Action 都会运行。待处理期间的再次点击会被接受，并从乐观值推导 `next`。落定后，显示已提交的 `isPressed`。                                                                                                                                                                                                            | `family:buttons` FR4–FR6；当前测试                                                                              |
| FR5  | 没有 `pressedChangeAction` 时，激活是同步的，且不报告待处理状态。                                                                                                                                                                                                                                                                                                                                                                                                                                  | `family:buttons` FR5；当前测试                                                                                  |
| FR6  | ToggleButtonGroup 内的带值成员在每次启用的激活时都会请求分组切换其值；这发生在任何调用方 `onClick` 之后，且无论该 `onClick` 是否阻止了默认行为。它从不调用自己的 `onPressedChange` 或 `pressedChangeAction`，也从不报告 Action 待处理。                                                                                                                                                                                                                                                            | `family:buttons` FR11；当前测试                                                                                 |
| FR7  | 当自身的 `isDisabled` 或其分组的 `isDisabled` 为 true 时禁用；启用的分组绝不会重新启用一个自行禁用的成员。禁用的开关从不请求状态变更，并遵循 `component:Button` FR10。                                                                                                                                                                                                                                                                                                                             | `family:buttons` FR3；当前测试                                                                                  |
| FR8  | 按下时，外观涂装按下叠加色；在强制颜色模式下涂装 `Highlight` 与 `HighlightText`。按下时可见标签以半粗体渲染，且按下不得改变外部尺寸。内容必须只渲染一次，不得有用于预留宽度的隐藏副本（`architecture:component-style-authoring` INV7）。实现缺口：带标签的开关会把标签包在一个 span 中，并与一个用于预留宽度的隐藏半粗体副本并排，因此标签会渲染两次，`children` 也会挂载两次。仅图标的开关不渲染副本。                                                                                            | `family:buttons` FR7、FR9；当前源码与测试；`architecture:component-style-authoring` INV7                        |
| FR9  | 按下时且提供了 `pressedIcon` 时，图标槽显示 `pressedIcon`；否则显示 `icon`。                                                                                                                                                                                                                                                                                                                                                                                                                       | `family:buttons` AV2；当前测试                                                                                  |
| FR10 | 尺寸依次取显式的 `size`、外层 ToggleButtonGroup 的 `size`，然后是 `md`；ToggleButton 不读取外部尺寸提供者。                                                                                                                                                                                                                                                                                                                                                                                        | `family:buttons` FR7；当前源码                                                                                  |
| FR11 | `elevation` 在独立使用时以及在 ToggleButtonGroup 内部都会涂装 Button 的阴影。                                                                                                                                                                                                                                                                                                                                                                                                                      | `family:buttons` FR8、FR12；当前测试                                                                            |
| FR12 | 根元素同时带有 `astryx-button` 和 `astryx-toggle-button`，将 `data-is-pressed` 反射为 `"true"` 或 `"false"`，并反射 `data-elevation`。调用方的 `className` 会与它们并存保留。调用方的 `data-is-pressed` 不得替换反射值。实现缺口：调用方 props 最后展开，因此调用方的 `aria-pressed` 或 `data-is-pressed` 会覆盖 ToggleButton 自身的值。                                                                                                                                                           | `family:buttons` FR10；`architecture:component-theming-surface`；测试；`architecture:public-component-api` INV5 |
| FR13 | 可见内容在提供时为 `children`，否则为 `label`；仅图标不显示任何可见文本。当 `label` 非空时，它就是无障碍名称，因为 Button 会将其设为 `aria-label`（`component:Button` ORD4）。                                                                                                                                                                                                                                                                                                                     | `family:buttons` FR1；当前测试                                                                                  |
| FR14 | 待处理呈现与按压反馈遵循 `component:Button` FR8 与 FR15：无论 ToggleButton 位于 ToggleButtonGroup 内部还是外部，它都是一个独立 Button，因此会采用按压缩放，而该缩放在减弱动效下不得应用（`design:reduced-motion` DR1）；其可中断 Spinner 会等待中等延迟，且在减弱动效下使用精细指针时必须立即出现（DR3）。实现缺口：在减弱动效下按压缩放与 Spinner 淡入仍会生效，且自行涂装颜色的内容在 Spinner 旁仍然可见。                                                                                       | `component:Button`；`design:reduced-motion`；当前源码                                                           |

### Allowed variation

- **AV1 — 按下态涂装。** 主题可以通过 `toggle-button[data-is-pressed="true"]` 重新设置按下状态的样式；按下态必须与未按下保持可区分，包括在强制颜色模式下。
- **AV2 — 图标。** 任何调用方节点都可以填充 `icon` 与 `pressedIcon`。

### Representative states

| State            | Required invariant                                          | Allowed variation |
| ---------------- | ----------------------------------------------------------- | ----------------- |
| 未按下           | `aria-pressed="false"`；ghost 外观；常规字重。              | 图标。            |
| 按下             | `aria-pressed="true"`；按下涂装；半粗体标签；相同外部尺寸。 | 按下图标。        |
| Action 待处理    | 乐观按下值；Spinner 与 `aria-busy`；仍可操作。              | Spinner 延迟。    |
| 带值分组成员     | 按下状态来自分组；激活调用分组；无 Action。                 | 阴影高度。        |
| 带工具提示的禁用 | `aria-disabled`；可聚焦；无状态请求。                       | —                 |
| 禁用且无工具提示 | 带 `aria-disabled` 可聚焦；无状态请求。                     | —                 |

### Transformation and precedence order

- **ORD1 — 生效的按下值。** 对带值成员而言先取分组选择，然后取待处理的乐观值，然后取 `isPressed`，最后是 `false`。
- **ORD2 — 独立激活。** 调用方 `onClick`，然后 `onPressedChange`，然后 Action；新发生的阻止会停止其后的步骤。在调用方 `onClick` 之前就被阻止的点击仍会到达 `onPressedChange`（Action 的 FR3 缺口）。
- **ORD3 — 禁用。** 分组禁用或自身禁用；任一即可。

### Performance and resources

- **PR1 — 宽度预留。** 带标签的开关在仅需标签文本即可之处渲染了三个元素：一个包装器、可见标签和一个隐藏副本；使用 `children` 时，子节点子树会挂载两次。不进行测量。此开销即 FR8 缺口。

## Accessibility contract

- **AR1 — 状态。** `aria-pressed` 必须反映生效的按下值（FR2），包括待处理期间的乐观值；调用方 prop 不得替换它（`architecture:public-component-api` INV5）。实现缺口：调用方 props 最后展开，因此调用方的 `aria-pressed` 会覆盖它。
- **AR2 — 名称。** 非空的 `label` 就是无障碍名称（FR13）；宽度预留副本（FR8 缺口）对辅助技术隐藏。
- **AR3 — 强制颜色。** 按下状态在强制颜色模式下仍然可见（FR8），符合 WCAG 1.4.11 的要求。
- **AR4 — 可见提示。** 仅图标的开关仅在调用方设置 `tooltip` 时才显示工具提示。
- **AR5 — 其余一切。** 键盘、焦点指示器、加载播报、busy 与禁用状态的暴露，以及目标尺寸遵循 `component:Button` AR2–AR6。

## Design relationships

| Anatomy or state | Design requirement                                         | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 图标             | 前置图标；按下时被按下图标替换。                           | 当前源码与测试           | 辅助           | FR9                |
| 按下图标         | 按下时的替代图标。                                         | 当前源码与测试           | 辅助           | FR9                |
| 标签             | 可见文本，按下时为半粗体，宽度稳定（FR8 缺口：隐藏副本）。 | 当前源码与测试           | 主要           | FR8、FR13          |
| Spinner          | Action 运行时覆盖在隐藏内容之上的 Button Spinner。         | 当前源码                 | 辅助           | FR4                |
| 按下外观         | 按下叠加填充；强制颜色下为 `Highlight`。                   | 当前源码与测试           | 主要           | FR8                |

`design:reduced-motion` 管辖继承而来的按压缩放与 Spinner 显示（FR14）；没有其他设计记录管辖 ToggleButton。根元素带有 `toggle-button`（以及 Button 的 `button`）；图标、按下图标与标签从中取色，Spinner 是一个 Spinner 实例。使用方解剖结构未命名任何根部件，因此本记录不携带解剖-主题映射。

## Family and system relationships

- `family:buttons` 拥有持续按压语义、回调与 Action 顺序，以及对带值成员的分组所有权（FR5、FR6、FR11）；ToggleButton 采用它们。家族的阴影高度轴已在 ToggleButton 上发布（FR11）。
- `component:Button` 拥有所渲染的外观，以及待处理、禁用与工具提示行为。
- `component:ToggleButtonGroup` 拥有带值成员的选择。
- `spec:AST-085` 通过 Button 适用。

## Verification map

| Contract            | Verification                                                                                                                                             | Representative states                                 | Mutation or failure expectation                                                                                                                                              | Audit section                      |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1、FR2、ORD1、AR1 | `ToggleButton.test.tsx`；`ToggleButton.a11y.chromium.spec.ts` 的独立与分组状态                                                                           | 未按下、按下、仅图标、组合标签                        | `aria-pressed` 缺失或过期则失败。                                                                                                                                            | `audit:ToggleButton/accessibility` |
| FR3–FR5、ORD2       | `ToggleButton.test.tsx` 的回调、Action 与调用方-`onClick` 套件                                                                                           | 仅回调、仅 Action、两者皆有、被阻止、待处理时再次点击 | 顺序翻转、被阻止的回调仍运行 Action，或仅回调却报告待处理，均失败。证据缺口：没有测试在开关处理器之前被阻止的点击上运行 `pressedChangeAction`。                              | `audit:ToggleButton/behavior`      |
| FR6                 | `ToggleButton.test.tsx` 的分组所有权用例                                                                                                                 | 带独立处理器的成员；带 `onClick` 的成员               | 成员运行自己的处理器或跳过分组切换则失败。                                                                                                                                   | `audit:ToggleButton/behavior`      |
| FR7、ORD3           | `ToggleButton.test.tsx` 的禁用套件；`ToggleButton.a11y.test.tsx` 与 `ToggleButton.a11y.chromium.spec.ts` 的禁用状态                                      | 成员与分组禁用；带工具提示的禁用                      | 禁用的开关发生切换，或启用的分组重新启用了成员，均失败。                                                                                                                     | `audit:ToggleButton/accessibility` |
| FR8、FR9、AR3       | `ToggleButton.test.tsx` 的宽度预留、按下图标与强制颜色用例                                                                                               | 带标签与仅图标；按下与未按下                          | 图标错误或强制颜色下缺少按下涂装则失败。宽度预留用例断言了隐藏副本，与 FR8 缺口相符。                                                                                        | `audit:ToggleButton/visual`        |
| FR11、FR12          | `ToggleButton.test.tsx` 的阴影高度与 className 用例                                                                                                      | 独立与分组下的阴影高度；调用方 className              | 阴影高度丢失、目标缺失或调用方 class 被丢弃则失败。证据缺口：没有测试读取所涂装的阴影，也没有测试传入调用方的 `aria-pressed` 或 `data-is-pressed`。                          | `audit:ToggleButton/theming`       |
| FR8（外部尺寸）     | 证据缺口：没有测试测量按下是否保持外部尺寸                                                                                                               | 带标签的开关按下与未按下                              | —                                                                                                                                                                            | `audit:ToggleButton/layout`        |
| FR8、FR12（缺口）   | 证据缺口：没有测试断言按下叠加涂装、半粗体按下标签或 `data-is-pressed`                                                                                   | 按下与未按下                                          | —                                                                                                                                                                            | `audit:ToggleButton/theming`       |
| FR14                | 证据缺口：没有 ToggleButton 测试在 `prefers-reduced-motion: reduce` 下进行按压或加载，也没有测试加载自行着色的内容；已发布的缩放与淡入违反了减弱动效条款 | 鼠标与触摸按压；使用精细指针时的待处理 Action         | 按压期间计算出的 transform 不是 `none` 或 `scale(1)`，或 Spinner 出现后不透明度低于 1。                                                                                      | `audit:ToggleButton/behavior`      |
| FR10                | 证据缺口：没有测试 ToggleButton 的尺寸优先级                                                                                                             | —                                                     | —                                                                                                                                                                            | `audit:ToggleButton/layout`        |
| FR13、AR2           | `ToggleButton.test.tsx` 的 children、仅图标与宽度预留用例；`ToggleButton.a11y.chromium.spec.ts` 针对实际渲染的可见标签的状态清单检查                     | 带标签；自定义 children；仅图标                       | 带标签的开关缺少其可见标签、children 未能替换它、仅图标开关缺少 `aria-label`，或宽度副本未对辅助技术隐藏，均失败。证据缺口：没有 jsdom 测试断言带标签开关上的 `aria-label`。 | `audit:ToggleButton/accessibility` |
| AR5                 | `ToggleButton.a11y.test.tsx` 与 `ToggleButton.a11y.chromium.spec.ts` 的可操作与可聚焦事实                                                                | 独立与分组                                            | 开关不可操作或 Tab 无法到达则失败。证据缺口：没有测试断言焦点指示器或目标尺寸。                                                                                              | `audit:ToggleButton/accessibility` |
| AR4、PR1            | 证据缺口：没有测试断言不存在自动工具提示，或宽度副本的开销                                                                                               | —                                                     | —                                                                                                                                                                            | `audit:ToggleButton/behavior`      |

## Current-state impact

- **重复标签（FR8、PR1）。** 带标签的开关会渲染一个隐藏的半粗体标签副本以预留宽度，因此 `children` 会挂载两次，违反 `architecture:component-style-authoring` INV7。
- **预先被阻止的点击（FR3）。** 在开关处理器之前就已被阻止的点击会调用 `onPressedChange`，但不调用 `pressedChangeAction`，因此仅含 Action 的开关会忽略它，违反 `family:buttons` FR5。
- **减弱动效（FR14）。** 当用户偏好减弱动效时，ToggleButton 在按压时仍缩放到 0.98，其 Spinner 仍会淡入，违反 `design:reduced-motion` DR1 与 DR3，正如 `component:Button` FR8 与 FR15 所记录。
- **待处理期间自行着色的内容（FR14）。** 自行涂装颜色的内容在 Spinner 旁仍然可见，正如 `component:Button` FR8 所记录。
- **使用方文档。** `ToggleButton.doc.mjs` 称没有 children 的图标会使开关变为仅图标，且仅图标会从标签添加一个自动工具提示；其解剖结构行与 `ToggleButton.tsx` 中 `isIconOnly` 的 JSDoc 也承诺了同样的自动工具提示。仅图标只取决于 `isIconOnly`，且没有 `tooltip` 就不会出现工具提示（FR13、AR4）。
- **调用方按下属性（FR12、AR1）。** 调用方的 `aria-pressed` 或 `data-is-pressed` 会替换 ToggleButton 自身的值，违反 `architecture:public-component-api` INV5。
- **家族采用表。** `family:buttons` 将 ToggleButton 的阴影高度列为采用缺口；该轴已发布（FR11）。

## Decision log

没有组件本地决策。ToggleButton 应用 `family:buttons` 与 `component:Button`。

## Open questions

- **OQ1 — ToggleButton 是否应像 Button 一样继承外部尺寸提供者？**（`human-api`）它只读取自己的 `size` 与其分组的 `size`（FR10）；Button 与 IconButton 还会读取最近的尺寸提供者。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到这些内容的所有者。
