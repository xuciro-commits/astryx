---
schema_version: 3
template_version: 7
kind: component
id: component:StatusDot
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/StatusDot/StatusDot.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/StatusDot.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:theme-tokens,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-094]
---

# StatusDot component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个固定的 8px 状态点，带有必需的、可主题扩展的 `variant` 与必需的 `label`，以及可选的 `isPulsing`、`tooltip` 和 `icon`。                                                                                                                                                                                                              |
| 行为          | 该点是一个由 `label` 命名的图像；可渲染的 `icon` 以该 variant 的墨色绘制在点内，并对辅助技术隐藏；带 tooltip 的独立点是名为 `label` 的按钮，按下它会固定 tooltip（`component:Tooltip` DEC-1），因此该 tooltip 可通过悬停、触摸和键盘访问；在按钮、链接、菜单项或选项内部，该点保持为图像，由宿主的可访问名称承载 tooltip 文本（FR5）。 |
| 最终用户影响  | 屏幕阅读器用户无需悬停即可听到状态；有视觉的用户看到一个颜色信号，可选地脉冲，并可选地携带非颜色标记。在按钮、链接、菜单项或选项内部，有视觉的触摸用户会失去该点可见的 tooltip 文本，而宿主的可访问名称会为屏幕阅读器承载状态（FR5）。                                                                                                 |
| 构建者影响    | StatusDot 依据放置位置决定。带 tooltip 的独立点是切换按钮；在按钮、链接、菜单项或选项内部，由宿主在其可访问名称中承载状态，因此一个控件永远不会嵌套另一个控件（FR5）。由 `aria-label` 命名的宿主（例如带 `isLabelHidden` 的 Tab）不从其内容取名称，因此其调用方需把状态包含进该标签。                                                  |
| 兼容性/就绪度 | 无 API 或默认值变更；一旦 `useTooltip` 的 `show()` 与 `hide()`（`component:Tooltip` DEC-1）交付，带 tooltip 的独立点就成为按钮触发器，按下即固定 tooltip；而交互元素内部的点会把其 tooltip 文本交给宿主（FR5，尚未构建）。三处缺口列在 Current-state impact 下。                                                                       |
| 评审检查      | 拒绝没有可访问名称的点、没有 tooltip 却自带 tab 停靠点的点、暴露给辅助技术的图标、忽略减弱动态效果的脉冲，或第二个目标。                                                                                                                                                                                                               |
| 治理规则      | `architecture:component-theming-surface/INV2,INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:theme-tokens/INV11`；WCAG 2.2 2.1.1。                                                                                                                                                                      |

本表是评审投影；下文正文具有权威性。

## Intent

StatusDot 在解释它的内容旁渲染一个紧凑的、已绘制的状态信号——存在、健康或严重程度。它拥有点的尺寸、色调、可选的脉冲、可选的内部标记，以及它的可访问名称。

## Compatibility and migration

- 已发布默认值是否保留：`yes`
- 兼容性类别：无公共 prop 或默认值变更。FR2 的状态点（`success`、`warning`、`error`）从强状态填充重绘为状态图标角色，以 surface 作为墨色，在每个图标角色与填充角色不同的主题中都会产生可见的颜色变化；在提供 `tooltip` 时，独立点会变成 Tooltip 内部由 `label` 命名的按钮，按下即固定 tooltip，一旦 `useTooltip` 的 `show()` 和 `hide()`（`component:Tooltip` DEC-1）交付即采用；而按钮、链接、菜单项或选项内部的点保持为图像，其 tooltip 文本并入宿主的可访问名称（FR5）。该点只发出规范化的 `status-dot` 目标；`statusdot` 别名不被发出
- 受控/非受控行为：不适用；StatusDot 不持有任何状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **主题新增但未绘制的 variant（FR2）。** `StatusDotVariantMap` 接受主题新增的值，但活动主题不绘制的值会渲染成一个透明的点，没有任何可见信号。可访问名称仍然承载状态。`architecture:component-theming-surface` INV14 要求可扩展的视觉轴必须有一个安全的、与主题无关的基线。
- **Tooltip 无法通过键盘访问（FR5）。** 该点没有 tab 停靠点，因此 Tooltip 不会挂上聚焦触发器，有视觉的键盘用户无法显示 tooltip 文本，而 WCAG 2.2 2.1.1 期望功能可键盘操作。可访问名称仍然承载状态。目前点击会打开点的 tooltip，因为该点不执行任何动作，而 Tooltip 的默认触摸行为（`touchTrigger="auto"`）会在此类点击上打开；并且独立点尚未在按下时固定其 tooltip，因此其 tooltip 没有对触摸或键盘的固定。FR5 会把按钮、链接、菜单项或选项内部的点改为仅在悬停时预览 tooltip 的图像，因此有视觉的触摸用户在那里会失去其可见的 tooltip 文本；宿主的可访问名称会为屏幕阅读器承载状态。
- **强制颜色模式下的 accent 与 neutral 点（FR2）。** `accent` 和 `neutral` 点不绘制边框，因此在强制颜色模式下它们失去底板并消失；当前没有任何记录规定它们的处理方式（OQ1）。可访问名称仍然承载状态。

## Ownership boundary

**拥有**

- 绘制出的点、它的 `status-dot` 主题目标，以及它的固定尺寸。
- variant 的底板与墨色配对。
- 脉冲及其对减弱动态效果的抑制。
- 把可选图标内容放在点内的、对辅助技术隐藏的包裹层。
- 点的图像角色、它在带 tooltip 的独立状态下作为按钮的角色，以及它的可访问名称。

**不拥有 / 非目标**

- 通过 `icon` 提供的美术素材——归调用方所有。
- 提供 `tooltip` 时的 tooltip 表面及其打开触发器——归 Tooltip 所有。
- 每个 variant 的内置图标——默认点保持无子元素。
- 解释状态的可见标签或周围文本——归产品调用点所有。
- 叠加在头像上的状态点——归 `component:AvatarStatusDot` 所有。

## Public concepts

| Concept           | Closed values or states                                        | Meaning                                                                                                     | Availability by variant/orientation/state | Default | Owner                 | Stability | Invalid-value behavior                                                                                     |
| ----------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------- | --------------------- | --------- | ---------------------------------------------------------------------------------------------------------- |
| 色调（`variant`） | `success`、`warning`、`error`、`accent`、`neutral`；主题新增值 | 选择底板颜色以及图标绘制所用的墨色。                                                                        | 所有点                                    | 必需    | `component:StatusDot` | 稳定      | 主题新增的值会反映到 `status-dot` 上，并保持安全的、与主题无关的基线（FR2）；TypeScript 会拒绝未注册的值。 |
| 脉冲              | 静止；脉冲中                                                   | 通过让点淡入淡出，表示正在进行的活动。                                                                      | 所有色调                                  | 静止    | `component:StatusDot` | 稳定      | —                                                                                                          |
| 状态图标          | 当 `icon` 可渲染时存在；不存在                                 | 在点内添加一个非颜色标记。                                                                                  | 所有色调                                  | 不存在  | `component:StatusDot` | 稳定      | `false`、`true`、`null`、`undefined` 和 `''` 都不渲染图标包裹层。                                          |
| Tooltip           | 当 `tooltip` 为非空字符串时存在；不存在                        | 解释状态；独立点会变成按钮，按下即固定它，可通过悬停、触摸和键盘访问；在交互元素内部由宿主承载文本（FR5）。 | 所有色调                                  | 不存在  | `component:StatusDot` | 稳定      | 空字符串不渲染 tooltip。                                                                                   |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Basis                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- |
| FR1 | StatusDot 始终渲染一个内联 flex 的 `span` 点，8×8 CSS 像素，完全圆角，在 flex 行中不收缩，携带 `status-dot` 目标且仅携带该目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试                                       |
| FR2 | `success`、`warning` 和 `error` 是页面上的状态标记：在 `architecture:theme-tokens` INV11 下，它们各自绘制其状态图标角色 `--color-icon-<status>`，以 surface 颜色作为墨色，并在强制颜色模式下保留可见的 `CanvasText` 边框。`accent` 绘制 `--color-accent`，以 `--color-on-accent` 为墨色；`neutral` 绘制 `--color-icon-secondary`，以 surface 颜色为墨色；这两者不是 INV11 的状态角色，当前没有任何记录规定它们的强制颜色处理方式（OQ1）。目标会为每个值反映 `variant`，可扩展的色调具有安全的、与主题无关的基线（`architecture:component-theming-surface` INV14）。实现缺口：活动主题不绘制的主题新增值不会获得任何组件底板或墨色，从而留下一个透明的 8px 盒子（Current-state impact）。                                                                                                                                                                                                                                                         | 当前源码与测试                                       |
| FR3 | `isPulsing` 让点的不透明度在 2 秒内从 1 到 0.5 再返回，缓入缓出，无限循环；在 `prefers-reduced-motion: reduce` 下动画被移除，点保持静止。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                       |
| FR4 | 可渲染的 `icon` 在点内居中的包裹层中渲染，并填满其 8px 区域；它使用 `currentColor`（该 variant 的墨色）绘制。不可渲染的值使点保持无子元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试                                       |
| FR5 | 非空的 `tooltip` 依据放置位置渲染；没有它则不渲染 tooltip。独立点连同该文本被包裹在 Tooltip 中，是一个按钮触发器，按下即固定它，由 `label` 命名，因此悬停和键盘焦点会预览 tooltip，而点击、单击、Enter 或 Space 会固定它（`component:Tooltip` FR9），键盘用户也能到达它（WCAG 2.2 2.1.1）。StatusDot 通过 `useTooltip` 的 `show()` 和 `hide()`（`component:Tooltip` FR12）采用该固定，与 `component:InfoTip` 的做法一致，因此独立点的 tooltip 在触摸上仍然可达。交互元素（按钮、链接、菜单项或选项）内部的点是一个非交互图像，包裹在 Tooltip 中但不带固定，因为一个控件不能嵌套另一个控件：其 tooltip 仅在悬停时预览，且其 tooltip 文本并入宿主的可访问名称，因此宿主为屏幕阅读器承载状态（`architecture:interaction-modality` INV4）。由 `aria-label` 命名的宿主不从其内容取名称，因此其调用方需把状态包含进该标签。实现缺口：该点没有 tab 停靠点，并使用 Tooltip 的默认触摸触发器，因此 tooltip 仅在悬停和触摸时打开（Current-state impact）。 | 当前源码与测试；`component:Tooltip` DEC-1、FR9、FR12 |
| FR6 | `ref` 到达该点。受支持的 DOM、ARIA、data 和事件 prop 在其角色与名称之后到达该点；`xstyle`、`className` 和 `style` 按该顺序在组件样式之后合并。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试                                       |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以通过 `status-dot` 按 `variant` 改变点的视觉属性，而不改变其尺寸、名称或结构。
- **AV2 — 图标美术素材。** 调用方提供的美术素材可以变化，而不创建单独的目标。

### Representative states

| State      | Required invariant                                                                             | Allowed variation |
| ---------- | ---------------------------------------------------------------------------------------------- | ----------------- |
| 普通点     | 由 `label` 命名的无子元素图像；不可聚焦。                                                      | 色调。            |
| 带图标     | 图标位于 `aria-hidden` 包裹层内；点保持其角色与名称。                                          | 美术素材。        |
| 脉冲       | 不透明度脉冲运行；请求减弱动态效果时不运行。                                                   | 色调。            |
| 带 tooltip | 独立点是名为 `label`、带 `aria-expanded` 的按钮；按下会固定 tooltip；Tooltip 拥有表面。        | tooltip 文本。    |
| 控件内部   | 在按钮、链接、菜单项或选项内部，点是没有 tab 停靠点的图像；宿主的可访问名称包含 tooltip 文本。 | 宿主组件。        |

### Transformation and precedence order

- **ORD1 — 点属性。** 角色首先跟随放置位置：带 tooltip 的独立点是切换的 `button`；没有 tooltip 的点，或按钮、链接、菜单项或选项内部的点，是 `role="img"`。然后是 `aria-label` → 组件类与 `data-variant` → 组件样式 → `xstyle` → `className` → `style` → 调用方 prop。

### Performance and resources

- **PR1 — 纯 CSS 动效。** 脉冲是 CSS 动画；除 AR2 对带 tooltip 的独立点所要求的共享命中区监视之外，StatusDot 不注册任何自己的监听器、观察器或定时器。

## Accessibility contract

- **AR1 — 无需悬停的名称。** 对每个 variant，无论有无图标，该点都以 `label` 作为其可访问名称暴露 `role="img"`；带 tooltip 的独立状态它是以相同名称命名的按钮，而在交互元素内部，其 tooltip 文本并入宿主的可访问名称（FR5）。调用方的 `role` 或 `aria-label` 会替换它们（FR6）。
- **AR2 — Tab 停靠点。** 没有 tooltip 的点是静态图像，不自带 tab 停靠点。带 tooltip 的独立点在 tab 顺序中是按钮，按下即固定 tooltip（FR5）；而交互元素内部的点从不添加 tab 停靠点；目前该点不添加 tab 停靠点，这就是 FR5 的缺口。在粗指针下，带 tooltip 的独立点在邻近元素留出空间时，通过共享命中区监视达到 44 px 的不可见命中区：命中区从不与邻近元素的目标重叠，并被限制为相近邻居间距的一半（`spec:AST-094` FR42）；实现缺口：尚未构建。调用方的 `tabIndex` 会透传（FR6）。
- **AR3 — 装饰性图标。** 图标包裹层是 `aria-hidden` 的，因此仅由标签命名状态。
- **AR4 — 颜色不是唯一的载体。** 可访问名称为辅助技术承载状态。在视觉上，默认点是纯颜色信号；非颜色标记来自每个状态的 `icon` 或来自周围 UI，后者归调用点所有。
- **AR5 — 减弱动态效果。** 当读者要求减弱动态效果时，脉冲停止（FR3）。

## Design relationships

| Anatomy or state | Design requirement                       | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------- | ------------------------ | -------------- | ------------------ |
| 点               | 呈现绘制出的语义状态信号。               | 当前源码与公开文档       | 支持性         | FR1–FR3、AR1、AR2  |
| 状态图标         | 在点内呈现可选的、调用方提供的美术素材。 | 当前源码与测试           | 支持性         | FR4、AR3           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Dot": {"target": "status-dot"},
  "Status icon": {"inherits": "status-dot"}
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有结构资格、继承、规范化目标命名以及可扩展的 `variant` 轴；FR2 记录了未主题化的回退。
- `architecture:public-component-api` 拥有 ref、透传和样式输入规则；FR6 把它们应用到该点。
- `architecture:theme-tokens` INV11 拥有状态颜色角色及其强制颜色边框，FR2 的状态底板遵循这些。

## Verification map

| Contract      | Verification                                                                                                                        | Representative states                                                        | Mutation or failure expectation                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Audit section             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| FR1、FR6      | `StatusDot.test.tsx` 渲染、ref、test-id 与目标套件                                                                                  | 每个色调                                                                     | 移除该点、ref 或 test id 丢失，或出现第二个目标，测试失败。缺口：8px 尺寸测试只断言存在性，且样式顺序（ORD1）改变时没有测试失败；尺寸在 `StatusDot.stories.tsx` 中可见。                                                                                                                                                                                                                                                                                                                                           | `audit:StatusDot/anatomy` |
| FR2           | `StatusDot.test.tsx` 的 variant 墨色套件；`extensibleAxes.test.ts`                                                                  | 状态底板与墨色；映射接线                                                     | 丢弃 `variant` 反映会导致失败。variant 墨色测试为每个状态钉住其 `--color-icon-<status>` 底板与 surface 墨色，强制颜色测试断言编译后的 `CanvasText` 轮廓。缺口：其他色调的绘制以及未主题化回退没有自动化检查。                                                                                                                                                                                                                                                                                                      | `audit:StatusDot/theming` |
| FR3、AR5      | 在浏览器中运行 `StatusDot.stories.tsx`，分别带与不带减弱动态效果                                                                    | 静止与脉冲                                                                   | 缺口：脉冲单元测试只断言存在性；脉冲缺失或减弱动态效果规则缺失只能在渲染的测试夹具中看到。                                                                                                                                                                                                                                                                                                                                                                                                                         | `audit:StatusDot/motion`  |
| FR4、AR3      | `StatusDot.test.tsx` 自定义图标套件                                                                                                 | 图标、假值                                                                   | 暴露图标或为假值渲染包裹层会导致失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `audit:StatusDot/anatomy` |
| FR5、AR1、AR2 | `StatusDot.test.tsx` 可聚焦性与可访问名称套件；构建前的证据缺口：独立切换用例与粗指针命中区；Button 内与 MenuItem 内带 tooltip 的点 | 每个色调，带与不带 tooltip；带 tooltip 的独立点；Button 内与 MenuItem 内的点 | 名称缺失、无 tooltip 的点出现 tab 停靠点，或名称依赖 tooltip，都会失败。缺口：tooltip 测试只断言该点被渲染，因此丢弃 Tooltip 包裹也能通过，且没有测试覆盖调用方的 `role` 或 `aria-label` 覆盖。FR5 构建后，带 tooltip 的独立点若不是具名按钮、或点击、单击、Enter、Space 不能固定它，则失败。Button 或 MenuItem 内部的点若渲染嵌套按钮或 tab 停靠点、在点击时打开其 tooltip，或宿主的可访问名称缺少状态，则失败。带 tooltip 的独立点若在邻近元素留出空间时粗指针命中区仍小于 44 px，或触到邻近元素的目标，则失败。 | `audit:StatusDot/a11y`    |
| 主题结构映射  | `scripts/check-knowledge.mjs`                                                                                                       | 规范结构与当前目标                                                           | 缺失、多余、带前缀、过时或以别名为后盾的映射会导致仓库校验失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `audit:StatusDot/theming` |
| AR4、PR1      | 源码评审；`StatusDot.stories.tsx`                                                                                                   | 普通点、带图标的点                                                           | 缺口：没有自动化检查覆盖非颜色标记的指导，也没有检查在 StatusDot 添加自己的监听器、观察器或定时器时失败。                                                                                                                                                                                                                                                                                                                                                                                                          | `audit:StatusDot/a11y`    |
| AR1、AR3      | 可访问性树证据（`spec:AST-009` FR3）                                                                                                | 每个色调，带图标与 tooltip                                                   | 缺口：没有可访问性树检查证明图像角色与名称或隐藏的图标；单元测试查询的是 DOM。                                                                                                                                                                                                                                                                                                                                                                                                                                     | `audit:StatusDot/a11y`    |

## Decision log

无记录。tooltip 的固定遵循 `component:Tooltip` DEC-1。

## Open questions

- **OQ1 — `accent` 与 `neutral` 点应采用什么强制颜色处理？** （`human-design`）在 `architecture:theme-tokens` INV11 下它们不是状态角色，目前它们在强制颜色模式下渲染时没有可见底板。

## Content boundary

本文件不重复使用方的 prop 表与示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的所有者。
