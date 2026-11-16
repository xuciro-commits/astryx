---
schema_version: 3
template_version: 7
kind: component
id: component:ButtonGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/ButtonGroup/ButtonGroup.test.tsx,
    packages/core/src/ButtonGroup/__tests__/ButtonGroupCorners.interaction.browser.spec.ts,
    packages/core/src/Layer/layerScopedContext.test.tsx,
    packages/core/src/hooks/useListFocus.test.tsx,
  ]
modules: []
families: [family:buttons]
design_specs: []
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-038, spec:AST-085]
---

# ButtonGroup component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变化。ButtonGroup 接收 `label`、`orientation`、`size`、`elevation`、`isDisabled`，以及 Button 或 IconButton 子元素。                                                       |
| 行为          | 一个带标签的 `role="group"`，把它的 Button 成员连接成一个连续表面，为它们提供默认尺寸与自身的禁用状态，拥有一个共享的 elevation，并且是一个支持方向键漫游的单一 Tab 停留点。 |
| 最终用户影响  | 键盘用户用一次 Tab 即可到达整个组，并用方向键在其中移动。禁用的组保留它的一个 Tab 停留点，因此键盘用户可以找到它，并听到它已禁用。                                           |
| 构建者影响    | 无。                                                                                                                                                                         |
| 兼容性/就绪度 | 没有 API 或默认值变更。Tab 停留点会离开已禁用和仅忙碌的成员，被包裹的成员会失去连接几何；两者都列在 Current-state impact 之下。                                              |
| 审查检查      | 拒绝没有名称的组、成员之间出现间隙、内侧圆角、成员上有阴影、多于一个 Tab 停留点，或方向键从某个成员已打开的菜单中抢走按键。                                                  |
| 管辖规则      | `family:buttons` FR3、FR8、FR10–FR12、AV5；`architecture:component-size-cascade` INV3–INV8；`spec:AST-085` FR1、FR7；`spec:AST-038` FR7、FR8。                               |

本表是审查投影；下面的正文具有权威性。

## Intent

ButtonGroup 把若干相关操作呈现为一个连接在一起控件。它按 `family:buttons` 的分配，拥有组的无障碍名称、连接几何、共享的 elevation、继承的尺寸与禁用状态，以及组的单一 Tab 停留点键盘模型。使用方用法见 `ButtonGroup.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：对鼠标为 `yes`；在触摸呈现下，按下会获得跨按钮滑动的效果；`orientation="horizontal"`、`size="md"`、`elevation="none"`、`isDisabled={false}`
- 兼容性类别：没有公共 prop、默认值或导出变更；在触摸呈现下，DOM 会在每个被追踪的按钮上增加 action-group 条目标记，在组根上增加手势宿主的 `data-astryx-touch-action` 标记与命中层的内嵌属性，并且启用组的根也会是 `position: relative`，因此绝对定位的后代在那里相对它解析
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 组根：role、无障碍名称、方向与禁用暴露，以及 `button-group` 目标。
- 由其 Button 成员绘制的连接几何：仅外侧圆角、前缘分隔线，以及没有按下缩放。
- 一个共享的静置 elevation，以及扁平的成员。
- 它赋予成员的默认尺寸与禁用状态。
- 漫游焦点：一个 Tab 停留点、方向键、Home 与 End。

**不拥有 / 非目标**

- 每个成员自身的表面、命名、激活、pending 与禁用渲染 —— 由 `component:Button` 和 `component:IconButton` 拥有。跨成员滑动的按下作用于被抬起的成员，由 `family:action-groups` 拥有。
- 成员的菜单或其他层，以及在其内部按下的按键 —— 由该成员拥有（例如 `component:DropdownMenu`）。
- 跨切换按钮的选择状态 —— 由 `component:ToggleButtonGroup` 拥有。
- 水平溢出 —— 未纳入契约；组不会换行，也不会折叠。
- 嵌套的 ButtonGroup —— 不受支持；行为未纳入契约。

## Public concepts

| 概念      | 封闭取值或状态               | 含义                       | 按变体/方向/状态的可用性           | 默认值                | 所有者                  | 稳定性 | 无效值行为                  |
| --------- | ---------------------------- | -------------------------- | ---------------------------------- | --------------------- | ----------------------- | ------ | --------------------------- |
| 方向      | `horizontal`、`vertical`     | 行以及方向键的方向。       | 始终可用。                         | `horizontal`          | `component:ButtonGroup` | 稳定   | TypeScript 会拒绝其他取值。 |
| 尺寸      | `sm`、`md`、`lg`             | 成员的默认尺寸。           | 始终可用；成员自身的 `size` 优先。 | 继承的尺寸，否则 `md` | `family:buttons`        | 稳定   | TypeScript 会拒绝其他取值。 |
| Elevation | `none`、`low`、`med`、`high` | 整个连接表面下方的阴影。   | 始终可用；成员不绘制阴影。         | `none`                | `family:buttons`        | 稳定   | TypeScript 会拒绝其他取值。 |
| 禁用      | 关、开                       | 每个 Button 成员都被禁用。 | 始终可用。                         | 关                    | `component:ButtonGroup` | 稳定   | 不适用。                    |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 依据                                                                          |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| FR1  | 根是单一元素，带 `role="group"`，并且 `aria-label` 设为 `label`。它把方向反映为 `data-orientation`，绝不使用 `aria-orientation`，并且仅在禁用时设置 `aria-disabled="true"`。`ref`、`data-testid`、`className`、`style`、`xstyle` 及其他 DOM props 都会到达它。                                                                                                                                                                                                                                                                                                                                            | `family:buttons` FR11；当前源码与测试                                         |
| FR2  | 成员边靠边排列且没有间隙，在交叉轴上拉伸：水平时成行，垂直时成列。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `family:buttons` FR12；当前源码                                               |
| FR3  | 组几何由 Astryx Button 成员绘制；其他子元素保留自己的绘制。只有组的外侧圆角是圆的：第一个成员的前缘角与最后一个成员的后缘角。成员在自身之后渲染的尾随层元素（popover、template 或 dialog）不计为成员，因此真正的最后一个成员保留其圆角。任何其他后续元素，包括 display-contents 包裹器或原生 button，都计为成员。包在 Tooltip 或 HoverCard 中的 Button 成员必须像直接成员一样加入连接表面（`family:buttons` FR12）。实现缺口：在该 display-contents 包裹器内部，Button 既是第一个也是最后一个子元素，因此在两个或更多成员的组中，无论它位于何处，四个角都保持圆角，并且当它不是第一个成员时不绘制分隔线。 | `family:buttons` FR12；当前测试                                               |
| FR4  | 第一个之后的每个 Button 成员都在其前缘绘制分隔线（水平时为 inline-start，垂直时为 block-start），颜色为边框色；在 primary 或 destructive 成员上则使用 on-accent 颜色；被包裹的成员不绘制（FR3 缺口）。成员不采用 Button 的按下缩放。                                                                                                                                                                                                                                                                                                                                                                      | `family:buttons` FR12；当前源码                                               |
| FR5  | 组按其元素圆角为它的 `elevation` 绘制阴影。每个 Button 成员都不绘制阴影，并反映 `data-elevation="none"`，无论其自身的 `elevation` 说什么。                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `family:buttons` FR8、FR10；当前测试                                          |
| FR6  | 组把其解析后的尺寸提供给后代，直到下一个层边界（`spec:AST-038` FR7、FR8）：先是显式的 `size`，然后是最近的外层提供者，最后是 `md`。成员自身的 `size` 优先。                                                                                                                                                                                                                                                                                                                                                                                                                                               | `architecture:component-size-cascade` INV3–INV8；当前源码；`spec:AST-038` FR7 |
| FR7  | 禁用时，每个 Button 成员都必须在 `component:Button` FR10 之下被禁用：可聚焦并带 `aria-disabled`、呈惰性，且绝不执行其动作，因此组保留其 Tab 停留点（`spec:AST-085` FR1、FR7）。                                                                                                                                                                                                                                                                                                                                                                                                                           | `family:buttons` FR3；`spec:AST-085` FR7；当前测试                            |
| FR8  | 组是一个 Tab 停留点。停留点从第一个启用的成员开始，并随方向键导航移动。链接成员计为成员。停留点必须始终正好落在一个成员上，而变为忙碌或禁用的成员必须保留它（`component:Button` FR9、FR10；`spec:AST-085` FR1、FR7）。实现缺口：组仅在自身渲染之后以及焦点进入某个成员时修复停留点，每次修复都保留启用的持有者，或把停留点交给第一个启用的成员。在两次修复之间，停留点可能落在已变为仅忙碌、已禁用或已卸载的成员上，因此组可能有两个停留点或没有；通过指针或代码到达的焦点不会接管停留点，所以下一次 Tab 或 Shift+Tab 可能停在组内部。                                                                    | `family:buttons` AV5；WAI-ARIA APG roving tabindex；当前测试                  |
| FR9  | 水平组按视觉顺序用 Left 和 Right 移动，在 RTL 下反向；垂直组用 Up 和 Down 移动。Home 和 End 跳转到第一个和最后一个启用的成员。移动在两端回绕。                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `family:buttons` AV5；当前测试                                                |
| FR10 | 在成员打开的层（例如 DropdownMenu）内部按下的按键属于该层，组把它的 Tab 停留点保留在自己的成员上。位于 popover 或其他层内部的组仍然处理自己的方向键。组的上下文不会到达渲染在成员层内部的 Button（`spec:AST-038` FR7）。                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试；`spec:AST-038` FR7                                            |
| FR11 | 根带有 `astryx-button-group`，并反映 `data-size`、`data-orientation` 与 `data-elevation`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `family:buttons` FR10；`architecture:component-theming-surface`；测试         |

### Allowed variation

- **AV1 — 成员。** Button、IconButton 以及由 Button 触发的 DropdownMenu 是受支持的成员；成员之间的变体可以不同。
- **AV2 — 主题绘制。** 主题可以通过 `button-group` 和 `button` 重设组与成员表面的样式，而不改变连接几何。

### Representative states

| 状态              | 必需的不变式                                                      | 允许的变体       |
| ----------------- | ----------------------------------------------------------------- | ---------------- |
| 水平、静置        | 有名称的组；第一个成员上有一个 Tab 停留点；仅有外侧圆角。         | 成员变体。       |
| 垂直              | 列；Up 和 Down 移动焦点；block-start 分隔线。                     | ——               |
| 带 elevation      | 组上有阴影；成员扁平。                                            | 层级。           |
| 尾随 DropdownMenu | 菜单触发器保留圆角的后缘角；已打开菜单内的方向键留在其中。        | 菜单内容。       |
| 一个成员被禁用    | 实现缺口：组修复时 Tab 停留点会离开它（FR8）。                    | 是否有 Tooltip。 |
| 组被禁用          | 组上带 `aria-disabled`；每个成员可聚焦且呈惰性；一个 Tab 停留点。 | ——               |

### Transformation and precedence order

- **ORD1 — 成员尺寸。** 成员的 `size`，然后是组解析后的尺寸。
- **ORD2 — 成员 elevation。** 在组内部始终为 `none`；由组的 `elevation` 绘制。
- **ORD3 — 成员可用性。** 当组或该成员被禁用时，成员即被禁用；任何一方都不能重新启用另一方。否则适用 Button 自身的可用性规则。

### Performance and resources

- **PR1 — Tab 停留点修复。** 组在每次自身渲染之后以及焦点进入某个成员时修复 Tab 停留点；除 `family:action-groups` FR5 赋予它的按下追踪之外，它不添加全局监听器。

## Accessibility contract

- **AR1 — 组名称。** 组暴露 `role="group"` 与它的 `label` 作为其无障碍名称；成员保留自己的名称（`family:buttons` FR11）。
- **AR2 — 键盘。** FR8–FR10 是键盘契约。
- **AR3 — 禁用暴露。** 禁用的组在组上暴露 `aria-disabled`；成员按 `component:Button` AR5 暴露禁用。
- **AR4 — 焦点指示器。** 每个成员绘制 Button 的焦点指示器。

## Design relationships

| 解剖结构或状态 | 设计需求                                           | 表示权威       | 层级角色 | 组件契约 |
| -------------- | -------------------------------------------------- | -------------- | -------- | -------- |
| Button         | 成员连接成一个表面，仅有外侧圆角。                 | 当前源码与测试 | 突出     | FR2, FR3 |
| Divider        | 成员之间细的前缘边框；在实心成员上使用 on-accent。 | 当前源码       | 支撑     | FR4      |
| 组阴影         | 连接表面下方的一个阴影。                           | 当前源码与测试 | 支撑     | FR5      |

没有设计记录管辖 ButtonGroup。根带有 `button-group` 目标；Button 与 Divider 解剖部件由每个成员的 `button` 目标绘制。使用方解剖结构未命名任何根部件，因此本记录不携带解剖结构-主题映射。

## Family and system relationships

- `family:buttons` 为 ButtonGroup 分配连接几何、漫游焦点、继承的尺寸与禁用状态，以及一个共享的 elevation（FR8、FR11、FR12）；ButtonGroup 采用它们。
- `component:Button` 从组的上下文绘制连接几何，并拥有每个成员的行为。
- `architecture:component-size-cascade` 拥有尺寸继承（FR6）。
- `spec:AST-085` FR7 适用于组的禁用。

## Verification map

| 契约                 | 验证                                                                                                                                                                                                                                                                          | 代表性状态                                                                                                                                                                                                                                             | 变异或失败预期                                                                                                                                                                                                                                                                                                                                | 审计章节                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1, AR1             | `ButtonGroup.test.tsx` 的 role、label、ref、`data-testid`、方向                                                                                                                                                                                                               | 水平与垂直                                                                                                                                                                                                                                             | 缺失名称、出现 `aria-orientation`、丢掉 ref 或丢掉 `data-testid` 即失败。证据缺口：没有测试传入 `className`、`style` 或 `xstyle`。                                                                                                                                                                                                            | `audit:ButtonGroup/accessibility` |
| FR3                  | `ButtonGroupCorners.interaction.browser.spec.ts` 在 Chromium 交互通道中；`ButtonGroup.test.tsx` 的尾随圆角套件（编译后的选择器形态与成员判定；jsdom 从不接收该规则）                                                                                                          | 两个成员，水平与垂直；成员之后有 popover、template 与 dialog 片段，最多七个；popover 之间的一个成员；display-contents 包裹器、Tooltip 包裹与原生 button 的后续元素；带 tooltip 的与 DropdownMenu 的尾随成员；InputGroup 的 button 附加件位于最后和最先 | 方角的尾随成员，或圆角的内侧成员，即失败；编译后的尾随选择器若使用 `:last-child` 或同级相对的 `:has()` 即失败。证据缺口：jsdom 套件与浏览器 story 只把被包裹的成员渲染在最后，并检查它之前的成员；没有测试检查被包裹成员自身在任何位置上的圆角或分隔线。                                                                                      | `audit:ButtonGroup/layout`        |
| FR5, FR11            | `ButtonGroup.test.tsx` 的 elevation 套件                                                                                                                                                                                                                                      | 每一个层级；带自身 elevation 的成员                                                                                                                                                                                                                    | 两个层级得到相同的类、`data-elevation` 不匹配，或成员未报告 `none`，即失败。                                                                                                                                                                                                                                                                  | `audit:ButtonGroup/theming`       |
| FR11（目标、尺寸）   | 证据缺口：没有测试断言根上的 `astryx-button-group` 或 `data-size`                                                                                                                                                                                                             | 每个尺寸                                                                                                                                                                                                                                               | ——                                                                                                                                                                                                                                                                                                                                            | `audit:ButtonGroup/theming`       |
| FR7, AR3             | `ButtonGroup.test.tsx` 的禁用用例                                                                                                                                                                                                                                             | 组被禁用                                                                                                                                                                                                                                               | 可操作的成员、原生 `disabled` 成员，或没有单一 Tab 停留点的禁用组，即失败。                                                                                                                                                                                                                                                                   | `audit:ButtonGroup/accessibility` |
| FR8, AR2             | `ButtonGroup.test.tsx` 的 roving-tabindex 套件                                                                                                                                                                                                                                | 进入与离开；被禁用的成员；卸载；变为禁用；链接                                                                                                                                                                                                         | 两个 Tab 停留点或丢失停留点即失败。只要仍有启用的成员，套件就断言被禁用的成员不持有停留点，且停留点会从它那里被修复走，这与 FR8 的缺口一致；当所有成员都被禁用时，停留点留在一个被禁用的成员上（"keeps its one tab stop when every member is individually disabled"）。证据缺口：没有测试忙碌或自行卸载的持有者、指针焦点，或挂载后组被禁用。 | `audit:ButtonGroup/accessibility` |
| FR9, FR10, AR2       | `ButtonGroup.test.tsx` 的键盘导航套件；`useListFocus.test.tsx` 的 "useListFocus disabled-item skipping" 针对 Home 和 End（它们到达启用的两端）；`layerScopedContext.test.tsx` 的 "ends group-owned disabled state while preserving explicit and inner-group state" 针对层边界 | 方向键、Home、End、垂直、RTL、打开的菜单、popover 内的组                                                                                                                                                                                               | 方向错误、没有回绕、Home 或 End 落在被禁用成员上、抢走菜单的按键，或组状态泄漏进成员的层，即失败。                                                                                                                                                                                                                                            | `audit:ButtonGroup/accessibility` |
| FR2, FR3, FR4, FR6   | 证据缺口：没有任何断言检查无间隙布局、分隔线绘制、按下缩放的缺失、非 Button 子元素保留自身绘制，或渲染之外的成员尺寸继承                                                                                                                                                      | ——                                                                                                                                                                                                                                                     | ——                                                                                                                                                                                                                                                                                                                                            | `audit:ButtonGroup/layout`        |
| ORD2                 | `ButtonGroup.test.tsx` 的 elevation 套件                                                                                                                                                                                                                                      | 带自身 elevation 的成员                                                                                                                                                                                                                                | 成员未报告 `none` 即失败。                                                                                                                                                                                                                                                                                                                    | `audit:ButtonGroup/theming`       |
| ORD1, ORD3, PR1, AR4 | 证据缺口：没有测试断言成员尺寸优先级、启用组内部的成员 `isDisabled`、Tab 停留点何时被修复，或成员的焦点指示器                                                                                                                                                                 | ——                                                                                                                                                                                                                                                     | ——                                                                                                                                                                                                                                                                                                                                            | `audit:ButtonGroup/behavior`      |

## Current-state impact

- **Tab 停留点（FR8）。** 组修复时，Tab 停留点会离开已禁用或仅忙碌的成员；在两次修复之间，组可能有两个停留点或没有，包括在指针点击某个成员之后，或持有者卸载或自行禁用时，这与 `spec:AST-085` FR1 和 FR7 相悖。
- **被包裹的成员（FR3、FR4）。** 包在 Tooltip 或 HoverCard 中的 Button 在任何位置都保留四个圆角，并且当它不是第一个时不绘制分隔线，这与 `family:buttons` FR12 相悖。

## Decision log

没有组件本地决策。ButtonGroup 应用 `family:buttons`。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的拥有者。
