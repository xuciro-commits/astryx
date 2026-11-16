---
schema_version: 3
template_version: 7
kind: component
id: component:SideNavItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/SideNav/SideNav.test.tsx,
    packages/core/src/SideNav/__tests__/SideNavTextSize.interaction.browser.spec.ts,
    apps/storybook/stories/SideNav.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations, family:overlay-dismissal]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-size-cascade,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# SideNavItem component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                      |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `SideNavItem` 提供 `label`、`href`、`as`、`onClick`、`icon`、`selectedIcon`、`isSelected`、`isDisabled`、`endContent`、`actions`、`children`、`collapsible` 和 `size`；目标为带 `size`、`selected` 和 `disabled` 状态的 `side-nav-item`。 |
| 行为          | SideNav 中的一行：一个链接或按钮，带可选图标与被动尾部内容，旁边带可选的行级操作，以及可展开与折叠的可选嵌套子项。在折叠导轨中它只显示图标，并带工具提示或浮出层。                                                                        |
| 终端用户影响  | 用户能看到并听到当前页面，在嵌套子项之前到达行操作，在不发生导航的情况下展开或折叠分组，并在移动端抽屉中选择目标后返回该页面。                                                                                                            |
| 构建者影响    | 无。                                                                                                                                                                                                                                      |
| 兼容性/就绪度 | 记录已交付的行为；无公开变更。存在三处实现缺口（见 Current-state impact）。                                                                                                                                                               |
| 审查检查      | 拒绝以下情况：在主元素内部渲染交互式控件，链接同时切换折叠，切换按钮或操作会激活该行，折叠后的子项仍可到达，或抽屉激活未作修改而导致抽屉仍然打开。                                                                                        |
| 管辖规则      | `component:SideNav` FR1–FR5、DD1（嵌套与行几何）；`family:navigation-destinations`；`architecture:interaction-modality`；`architecture:public-component-api`。                                                                            |

该表是审查视角的投影；下面的正文具有权威性。

## Intent

SideNavItem 是 SideNav 中的一个目标行或分组行。它拥有该行的主元素、其选中与禁用状态、其图标替换、被动尾部内容与行级操作的放置、其嵌套子项的展开与折叠行为、其折叠导轨中的工具提示与浮出层交互，以及激活时关闭移动端抽屉。使用方的用法见 `SideNavItem.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已交付的行为；无公开变更
- 受控/非受控行为：嵌套子项初始为展开，且该项拥有该状态，除非定义了 `collapsible.isCollapsed`；受控项通过 `onCollapsedChange` 上报切换意图，并且仅在 prop 变化时才翻转（FR6）
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

- **禁用父项在折叠导轨中仍可操作。** 在折叠导轨中，带子项的禁用项渲染其浮出层触发器时不带 `disabled` 也不带 `aria-disabled`，因此它保留 Tab 停靠点且不宣告禁用状态；点击无任何效果，而 Enter 会打开其浮出层。`spec:AST-085` FR2 和 FR5 规定禁用的控件会阻止激活并暴露其禁用状态。
- **禁用的拆分行的切换按钮只响应键盘。** 在同时带有 `href` 或 `onClick` 以及子项的禁用项上，展开切换按钮继承了该行的指针阻止，但不携带 `disabled` 也不携带 `aria-disabled`，因此点击无任何效果，而 Tab 能到达它、Enter 会折叠该分组。其指针行为与键盘行为不一致，且其禁用状态未被暴露（`spec:AST-085` FR5）。OQ1 询问禁用项的子项是否保持可展开。
- **减少动态效果下触摸屏上的变化是瞬时的。** 在减少动态效果下，尖角箭头的旋转与分组高度在每种指针上都会瞬时变化；`design:reduced-motion` DR2 要求触摸屏上的变化在 200 ms 内交叉淡化。

## Ownership boundary

**拥有**

- 主元素、状态、图标、尾部内容与操作放置（FR1–FR5）。
- 嵌套子项的展开与折叠，包括独立的切换按钮（FR6、FR7）。
- 折叠导轨中的工具提示与浮出层交互（FR8、FR9）。
- 激活时关闭移动端抽屉（FR10）。
- 焦点轮廓与减少动态效果行为（FR11、FR12）。

**不拥有 / 非目标**

- 嵌套分组的标签、其折叠后的惰性状态、折叠导轨的渲染规则、行宽、缩进、缩进目标与分组裁剪——由 `component:SideNav` FR1–FR5 和 DD1 拥有。
- 目标的接受与阻止——由 `family:navigation-destinations` 拥有。
- 导轨的折叠状态——由 SideNav 和 `component:SideNavCollapseButton` 拥有。
- `actions` 中的每个控件——由该控件拥有（名称、键盘、禁用状态）。
- 各尺寸下的行填充色、圆角、最小高度与内边距——由共享的导航项样式拥有（这些样式以该高度作为最小值），并由 `side-nav-item` 目标拥有。

## Public concepts

| 概念   | 封闭取值或状态                                                          | 含义                                                         | 按变体/方向/状态的可选性 | 默认值       | 所有者                  | 稳定性 | 无效值行为     |
| ------ | ----------------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------ | ------------ | ----------------------- | ------ | -------------- |
| 可折叠 | `false`、`true`、`{defaultIsCollapsed, isCollapsed, onCollapsedChange}` | 嵌套子项是否以及如何展开和折叠。                             | 带子项的项，展开导轨。   | 可折叠、展开 | `component:SideNavItem` | 稳定   | 无子项时忽略。 |
| 行形态 | 整行、拆分（链接或 `onClick` 加切换按钮）、带操作                       | 由 `href`/`onClick`、子项、`collapsible` 和 `actions` 推导。 | 展开导轨与抽屉。         | 整行         | `component:SideNavItem` | 稳定   | 不适用。       |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 依据           |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1  | 当设置了 `href` 且该项已启用时，主元素依次是 `as` 组件、`LinkProvider` 链接、`<a>`；否则是 `<button type="button">`。禁用项通过 `aria-disabled="true"` 保持可聚焦，保留其 Tab 停靠点，并在变为禁用时保留焦点（`spec:AST-085` FR1、FR4）。它显示图标（选中且已提供时用 `selectedIcon`）、标签、`endContent`，对于整行可折叠项还显示一个尖角箭头。`endContent` 是被动内容，渲染在主元素内部。                                                                                              | 当前源码与测试 |
| FR2  | 在展开导轨中以及在折叠导轨的叶子项上，`isSelected` 会在主元素上设置 `aria-current="page"`，而绝不会设置在行包裹元素上。折叠父项的浮出层触发器不携带 `aria-current`。                                                                                                                                                                                                                                                                                                                     | 当前源码与测试 |
| FR3  | 禁用项不会触发 `onClick`，也不会导航。它的行操作仍可操作。                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR4  | `actions` 渲染为主元素的同级元素，位于行的尾缘，在 DOM 与焦点顺序中排在切换按钮之后、嵌套子项之前，尺寸采用行的控件尺寸（`sm`），除非某个控件自行设定（`architecture:component-size-cascade`）。点击操作既不会激活也不会切换该行。仅当存在操作或独立的切换按钮时才存在行包裹元素；`actions` 为假值时不添加任何包裹元素。                                                                                                                                                                 | 当前源码与测试 |
| FR5  | 转发的 `ref`、其他 DOM 属性、`className` 和 `style` 会到达主元素；`data-testid` 在有行包裹元素时标记该包裹元素，否则标记主元素；`xstyle` 为该项的外层盒子设置样式。                                                                                                                                                                                                                                                                                                                      | 当前源码与测试 |
| FR6  | 带子项的项能否折叠遵循 `component:SideNav` FR1。可折叠项初始为展开，除非 `defaultIsCollapsed` 为 true；受控项以即将进入的状态调用 `onCollapsedChange`，并且仅在 `isCollapsed` 变化时才改变。                                                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR7  | 在展开导轨中，如果带有 `href` 或 `onClick`，可折叠项会被拆分：主元素执行导航或触发 `onClick`，绝不切换，而一个由 `@astryx.sideNavItem.expand` 或 `.collapse` 命名的独立切换按钮拥有 `aria-expanded` 和 `aria-controls`。二者都没有时，整个主元素负责切换，并携带 `aria-expanded` 和 `aria-controls`。                                                                                                                                                                                    | 当前源码与测试 |
| FR8  | 在折叠导轨中，叶子项会在行内末端显示带有其标签的工具提示，锚定到该项，包括导轨在挂载时即处于折叠状态的情况。                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR9  | 在折叠导轨中，带子项的项（按 `component:SideNav` FR2 渲染）会打开其浮出层：在支持悬停的指针上，经过悬停意图延迟后打开，指针离开会关闭由悬停打开的浮出层，而由点击打开的浮出层会保持打开；静止指针下的点击不会使它重新弹出；在粗指针上不运行任何悬停计时器。键盘打开会把焦点移入浮出层，Escape 将焦点恢复到触发器；悬停打开不移动焦点。浮出层以 `@astryx.sideNavItem.submenuLabel` 作为标签，把父项标签显示为标题，支持轻量关闭，并在点击其中任何内容时关闭。其中的方向键交给浏览器处理。 | 当前源码与测试 |
| FR10 | 在移动端抽屉内，激活链接或按钮项会调用 `onClick`，然后关闭抽屉；例外是对链接进行 Ctrl-、Cmd-、Shift- 或 Alt- 点击时会运行 `onClick` 并为下一次操作保持抽屉打开，除非 `onClick` 取消了该点击。切换可折叠父项、点击行操作，或在抽屉外部激活，都不会关闭抽屉。                                                                                                                                                                                                                              | 当前源码与测试 |
| FR11 | 每个可聚焦部件都会绘制共享焦点轮廓；带操作的行在主元素获得焦点时把轮廓绘制在包裹元素上。                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试 |
| FR12 | 展开尖角箭头的旋转与嵌套分组的高度变化只在没有减少动态效果偏好时才执行动画。在减少动态效果下，对于精细指针它们会立即变化；在触摸屏上它们必须在 200 ms 内交叉淡化（`design:reduced-motion` DR2、DR3）。实现缺口：在触摸屏上它们也会立即变化。                                                                                                                                                                                                                                             | 当前源码       |

### Allowed variation

- **AV1 — 尺寸。** `sm`、`md` 和 `lg` 改变展开行的最小高度及其内边距；展开行会随更大的文字尺寸而增高，使其标签与尾部内容保持在其内部（`spec:AST-102` FR4）。折叠导轨中的行保持其正方形尺寸。
- **AV2 — 主题样式。** 主题按尺寸、选中和禁用状态重新设置 `side-nav-item` 的样式。

### Representative states

| 状态                 | 必需的不变式                                             | 允许的变化 |
| -------------------- | -------------------------------------------------------- | ---------- |
| 链接，已选中         | 链接上带 `aria-current="page"`；若提供则使用选中图标。   | 填充。     |
| 禁用的按钮           | `aria-disabled`；可聚焦；无 `onClick`。                  | 弱化样式。 |
| 无操作的可折叠项     | 整行切换；尖角箭头旋转。                                 | —          |
| 带 `href` 的可折叠项 | 链接执行导航；独立的切换按钮执行折叠。                   | —          |
| 操作                 | 操作位于切换按钮之后、子项之前；绝不激活该行。           | 操作内容。 |
| 折叠导轨叶子项       | 仅图标；带标签的工具提示。                               | —          |
| 折叠导轨父项         | 仅图标的触发器；浮出层含标题与子项。                     | 延迟。     |
| 移动端抽屉           | 激活会关闭抽屉，但对链接的修饰键点击例外，它会保持打开。 | —          |

### Transformation and precedence order

- **ORD1 — 主元素。** 禁用或没有 `href` → 按钮；否则先 `as`，再 `LinkProvider`，最后 `<a>`。
- **ORD2 — 图标。** 选中且已提供时用 `selectedIcon`，否则用 `icon`。

### Performance and resources

- **PR1 — 计时器。** 浮出层的悬停计时器在关闭和卸载时清除，并且在粗指针上不安排任何计时器。

## Accessibility contract

- **AR1 — 当前页面。** FR2。
- **AR2 — 展开披露。** 恰好一个元素为嵌套分组拥有 `aria-expanded` 和 `aria-controls`（FR7）。
- **AR3 — 焦点顺序。** 行操作位于主元素和切换按钮之后、嵌套子项之前（FR4）。
- **AR4 — 折叠态名称。** 折叠导轨中的项按 `component:SideNav` FR2 保持名称。

## Design relationships

| 解剖结构或状态 | 设计要求                                 | 表现权威           | 层级角色 | 组件契约 |
| -------------- | ---------------------------------------- | ------------------ | -------- | -------- |
| 主元素         | 图标、标签、被动尾部内容、可选尖角箭头。 | 当前源码与公开文档 | 突出     | FR1      |
| 切换按钮       | 行控件尺寸的尾部尖角箭头按钮。           | 当前源码           | 辅助     | FR7      |
| 操作           | 尾部的行控件。                           | 当前源码与公开文档 | 辅助     | FR4      |
| 浮出层         | 父项标签标题覆盖在子项之上。             | 当前源码           | 辅助     | FR9      |

`SideNavItem.doc.mjs` 不声明自己的解剖结构，因此没有记录解剖结构与主题的映射。行几何的视觉意图是 `component:SideNav` DD1。

## Family and system relationships

- `family:overlay-dismissal` 拥有本组件 popover 的 Escape 与关闭请求顺序。
- `component:SideNav` 拥有本组件遵循的嵌套几何与折叠导轨渲染规则。
- `family:navigation-destinations` 拥有对 `href` 的接受/阻止决策。
- `architecture:interaction-modality` 提供共享焦点指示器。

## Verification map

| 契约          | 验证                                                                                     | 代表性状态                                                                                                      | 变异或失败预期                                                    | 审计小节                          |
| ------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------------------- |
| FR1–FR3、FR5  | `SideNav.test.tsx` 的 SideNavItem 套件                                                   | 链接、按钮、`as`、provider、禁用                                                                                | 元素错误、丢失 `aria-current`，或禁用项仍执行 `onClick`，即失败。 | `audit:SideNavItem/behavior`      |
| FR4–FR7、AR3  | `SideNav.test.tsx` 的 actions 槽套件                                                     | 带切换按钮的操作、endContent、禁用；行包裹元素的 `data-testid`；`defaultIsCollapsed` 配合整行的 `aria-controls` | 操作位于主元素内部或顺序错误即失败。                              | `audit:SideNavItem/behavior`      |
| AV1 文字尺寸  | `SideNavTextSize.interaction.browser.spec.ts` 在 200% 与 250% 默认字号下                 | 默认行；尾部内容                                                                                                | 标签或尾部内容离开该行，或与下一行重叠，即失败。                  | `audit:SideNavItem/behavior`      |
| FR6、FR7、AR2 | `SideNav.test.tsx` 的可折叠 + href 套件                                                  | 拆分、整行、受控                                                                                                | 链接执行切换或 `aria-expanded` 重复，即失败。                     | `audit:SideNavItem/accessibility` |
| FR8、FR9      | `SideNav.test.tsx` 的折叠、悬停意图与导轨工具提示套件                                    | 叶子项、父项、悬停、点击、键盘、粗指针                                                                          | 丢失延迟、焦点恢复或工具提示锚点，即失败。                        | `audit:SideNavItem/behavior`      |
| FR10          | `SideNav.test.tsx` 的移动端抽屉激活关闭套件                                              | 链接、按钮、切换按钮、操作、抽屉外部                                                                            | 关闭行为错误即失败。                                              | `audit:SideNavItem/behavior`      |
| FR11          | `SideNav.test.tsx` 的焦点环套件                                                          | 普通行、拆分行、带操作的行                                                                                      | 缺少共享环类名即失败。                                            | `audit:SideNavItem/accessibility` |
| FR3、FR7、FR9 | `SideNav.test.tsx` 的键盘操作与焦点管理套件                                              | Tab 顺序、Enter/Space 切换、浮出层 Escape                                                                       | 丢失顺序、焦点滞留或焦点未返回，即失败。                          | `audit:SideNavItem/accessibility` |
| RTL 关系      | `SideNav / Default` 上 RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`） | 项图标与标签；LTR 与 RTL                                                                                        | 图标未位于其标签的行内起始处，即失败 D2。                         | `audit:SideNavItem/i18n-rtl`      |

以下内容从源码读取，尚无专门的测试：

- FR1 与 ORD1–ORD2：按钮的 `type="button"`、图标、选中图标替换，以及整行尖角箭头。
- FR4：操作的尾缘放置，以及无操作时独立切换按钮所用的包裹元素。
- FR5：转发到外层盒子的 `ref` 与 `xstyle`。
- FR7：切换按钮的已翻译名称。
- FR8：工具提示的行内末端放置。
- FR9：浮出层的轻量关闭，以及内部点击时关闭。
- FR12；PR1 在关闭时清除计时器；以及 `size` 和 `selected` 主题状态。

## Decision log

没有记录组件本地的决策。

## Open questions

- **OQ1 — 禁用项的子项是否保持可展开？**（`human-api`）目前禁用拆分行的切换按钮忽略指针而响应键盘（见 Current-state impact）。

## Content boundary

本文件不重复使用方的 prop 表、示例或 SideNav 的嵌套几何。它链接到这些内容的所有者。
