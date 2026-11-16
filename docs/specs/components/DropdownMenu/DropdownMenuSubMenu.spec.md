---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuSubMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, layout, testing]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx,
    packages/core/src/__tests__/BusyOwnerAnnouncement.test.tsx,
    packages/core/src/DropdownMenu/__tests__/SubMenuHeaderFooter.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/DropdownMenuDrillIn.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/DropdownMenuSubMenuAudit.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs: [spec:AST-020, spec:AST-086]
---

# DropdownMenuSubMenu component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                        |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个 `menuitem` 行：标签、子项；可选图标、描述、加载插入符、禁用状态、飞出层宽度、呈现方式、`delay`、`hideDelay`、头部、尾部、打开回调、测试 id、根输入、一个 ref。                         |
| 行为          | 该行把其子项展示为它旁边的飞出层，或展示为由返回行引导的钻入视图；当带有头部或尾部时，该表面是一个由该行命名的模态对话框。                                                                  |
| 最终用户影响  | 指针、键盘与触摸用户都能从一行到达嵌套命令；辅助技术会听到该行的弹窗类型与展开状态，Escape 或关闭箭头会返回该行。                                                                           |
| 构建者影响    | 把该行放在 DropdownMenu 或 ContextMenu 内，并为它提供标签与若干行；数据驱动的菜单通过嵌套的 `items` 数组获得它。                                                                            |
| 兼容性/就绪度 | 记录已发布的行为；按已发布的时序新增可选的 `delay` 与 `hideDelay`（FR11）；禁用的行获得 `tabindex="-1"`（FR7）。                                                                            |
| 审查检查      | 拒绝第二个键盘所有者、丢失的弹窗状态、在 RTL 下不翻转的飞出层、会打开的禁用行、被丢弃的调用方输入，或漏掉一次状态转换的打开回调。                                                           |
| 管辖规则      | `spec:AST-020` FR15；`architecture:public-component-api/INV5–INV8`；`architecture:react-component-runtime/INV2`；`architecture:layer-runtime`；`spec:AST-020/FR1,FR2`；`spec:AST-086/FR8`。 |

本表是审查用的投影；下文正文具有权威性。

## Intent

DropdownMenuSubMenu 把一行菜单变成嵌套菜单的入口。该行拥有它的 `menuitem` 语义、弹窗状态、插入符或 spinner、禁用绘制，以及其子项渲染所在的表面：由层运行时定位在该行旁边的飞出层，或根菜单代替自身行所显示的视图。每一层拥有自己的漫游焦点、typeahead 与按压模型。DropdownMenu 拥有根表面、钻入视图栈，以及带头部或尾部的子菜单所渲染进入的表面宿主。

## Compatibility and migration

- 保留的已发布默认值：是（`isDisabled=false`、`hasSpinner=false`、`presentation='adaptive'`、`delay=150`、`hideDelay=200`）。
- 兼容性类别：增量式；该行新增可选的 `delay` 与 `hideDelay`（FR11），其默认值即已发布的时序；禁用的行获得 `tabindex="-1"`（FR7）。
- 受控行为：打开状态是内部的；`onOpenChange` 报告它。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个行根，带有 `role="menuitem"`、`aria-haspopup`（`menu`，或带头部/尾部时为 `dialog`）、`aria-expanded`，以及打开期间的 `aria-controls`。
- 飞出层菜单、其受视口限制的尺寸、其键盘处理及其悬停意图；钻入列表及其返回行。
- 头部与尾部区域，以及容纳它们的模态对话框。
- ref、受支持的宿主输入、`className`、`style`、`xstyle` 的根组合，以及组合后的 `onClick`、`onKeyDown`、`onPointerMove`、`onMouseEnter` 与 `onMouseLeave` 处理器。

**不拥有 / 非目标**

- 根菜单表面、钻入视图栈及其在菜单关闭时的重置，以及表面宿主——由 `component:DropdownMenu` 拥有。
- 叶子行行为——由 `component:DropdownMenuItem` 及可选中项契约拥有。
- 位置、翻转与视口内缩——由 `architecture:layer-runtime` 拥有。

## Public concepts

| 概念     | 封闭取值或状态                                 | 含义                                                  | 按变体/方向/状态的可用性        | 默认值   | 所有者                          | 稳定性 | 无效值行为                           |
| -------- | ---------------------------------------------- | ----------------------------------------------------- | ------------------------------- | -------- | ------------------------------- | ------ | ------------------------------------ |
| 呈现方式 | flyout；drill-in；adaptive                     | 子项渲染的位置；当用手指打开菜单时，adaptive 会钻入。 | 每一行；drill-in 需要一个菜单根 | adaptive | `component:DropdownMenuSubMenu` | stable | 未知值会被公共类型拒绝。             |
| 可用性   | enabled；disabled                              | 该行能否打开。                                        | 每一行                          | enabled  | `component:DropdownMenuSubMenu` | stable | 禁用的行永不打开。                   |
| 加载     | caret；spinner                                 | 当该行的行正在加载时，其末端是否显示 spinner。        | 每一行                          | caret    | `component:DropdownMenuSubMenu` | stable | 该行仍会打开；空飞出层自己获取焦点。 |
| 区域     | none；header；footer；both                     | 子菜单的菜单旁的内容，它把该表面变成对话框。          | 在 DropdownMenu 根内            | none     | `component:DropdownMenuSubMenu` | stable | 没有表面宿主时，这些区域不会渲染。   |
| 打开报告 | open；close                                    | `onOpenChange` 报告该行表面的每一次转换。             | 每一行                          | 省略     | `component:DropdownMenuSubMenu` | stable | 记录的缺口见 FR6。                   |
| 根表面   | ref；DOM/data/ARIA；class/style/xstyle；处理器 | 扩展该行根，同时保留其角色与弹窗接线。                | 每一行                          | 省略     | 公共组件 API                    | stable | 不接受 `role` 与 `tabIndex`。        |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                   | 依据                                                          |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1  | 该行暴露 `role="menuitem"`、`aria-haspopup="menu"`（带头部或尾部时为 `"dialog"`）、与其表面一致的 `aria-expanded`，以及打开期间命名该表面的 `aria-controls`。该表面由该行标注。                          | `spec:AST-020`；当前源码与测试                                |
| FR2  | 点击、Enter、Space 或行内末端箭头（RTL 下为行内起始端）会打开该表面；键盘打开会把焦点放在其第一个启用行上。Escape 或关闭箭头只关闭本层，并把焦点返回该行。悬停在意图延迟之后打开飞出层。                 | `spec:AST-020`；`architecture:interaction-modality`；当前测试 |
| FR3  | 飞出层位于该行旁的行内末端一侧，随方向翻转，并保持在视口内；其块向尺寸以自身上限与视口中较小者为上限。                                                                                                   | `architecture:layer-runtime`；当前源码                        |
| FR4  | 钻入视图用一行以父菜单命名的返回行、随后是该行的子项替换根的行；返回、Escape 与关闭箭头都返回该行。                                                                                                      | 当前源码与聚焦测试                                            |
| FR5  | 在表面内选中一个叶子行会关闭每一层与根菜单。                                                                                                                                                             | 当前源码与测试                                                |
| FR6  | `onOpenChange` 必须在表面打开时报告一次 `true`、在关闭时报告一次 `false`，且来自引起该变化的动作。实现缺口：被根菜单关闭所重置的钻入视图不会报告 `false`（OQ1）。                                        | 已记录的承诺；`architecture:react-component-runtime` INV2     |
| FR7  | 禁用的行暴露 `aria-disabled="true"`，带有 `tabindex="-1"` 以便父级的键盘模型能到达它（`component:DropdownMenu` FR17），不获取悬停焦点，不在任何输入下打开，也不运行调用方的 `onClick`。                  | 当前源码与测试                                                |
| FR8  | 带 `hasSpinner` 时，该行以装饰性 spinner 代替插入符，并在根菜单显示后宣告一次忙碌开始。                                                                                                                  | `spec:AST-086` FR8；当前源码与测试                            |
| FR9  | ref、受支持的宿主属性与处理器、`className`、`style` 与 `xstyle` 在该行自身行为之后到达或组合到行根上；打开键与禁用状态下的点击会在调用方的处理器之前停止。                                               | `architecture:public-component-api` INV5–INV8；当前测试       |
| FR10 | 当自身没有 `header` 或 `footer`、且其上层也没有时，飞出层中某行上的 Tab 或 Shift+Tab 会在此键冒泡到菜单时关闭本层，而菜单会关闭整个菜单（`component:DropdownMenu` FR23，`component:ContextMenu` FR11）。 | WAI-ARIA Menu Button 模式；当前测试                           |
| FR11 | 在支持悬停的指针上，飞出层在 `delay` 之后打开，并在指针离开该行、飞出层及其通向路径（`component:DropdownMenu` FR13）之后 `hideDelay` 时关闭，单位为毫秒（默认 150 与 200）。键盘焦点与触摸从不等待。     | 所有者决策，2026-11-06                                        |

### Allowed variation

- **AV1 — 内容。** 标签、图标、描述与子项可变化；过长的字符串标签在一行内截断。
- **AV2 — 尺寸。** 该行的内边距遵循父菜单的尺寸。
- **AV3 — 宽度。** `menuWidth` 在视口上限之内设置飞出层的最小宽度。

### Representative states

| 状态 | 必需不变式                                               | 允许的变体               |
| ---- | -------------------------------------------------------- | ------------------------ |
| 关闭 | `aria-expanded=false`；该行末端为插入符或 spinner。      | 内容、尺寸、主题与模式。 |
| 打开 | `aria-expanded=true`；飞出层在该行旁，由它标注。         | 指针、键盘或按压打开。   |
| 钻入 | 返回行在前，然后是子项，位于根的盒内。                   | 嵌套钻入深度。           |
| 区域 | 由该行命名的模态对话框；Tab 走过头部、行、尾部，并循环。 | 仅头部或仅尾部。         |
| 禁用 | `aria-disabled=true`，无 tab 停靠点，半透明度，不打开。  | 加载与否。               |
| RTL  | 插入符镜像一次；飞出层向行内末端打开。                   | 在视口边缘翻转位置。     |

### Transformation and precedence order

- **ORD1 — 点击。** 禁用守卫 → 钻入压栈或飞出层切换 → 调用方 `onClick`。
- **ORD2 — 按键。** 处理并停止打开键 → 其他任何键交给调用方 `onKeyDown`。
- **ORD3 — 叶子选中。** 叶子动作 → 本层关闭 → 父层关闭 → 根菜单关闭。

### Performance and resources

- **PR1 — 拥有的资源。** 该行唯一的计时器是悬停意图与失焦时一次零延迟的焦点检查；飞出层的溢出观察遵循共享的菜单溢出 hook。

## Accessibility contract

- **AR1 — 单一入口行。** 该行是一个菜单项，其弹窗类型与状态通过 ARIA 暴露；其插入符与 spinner 是装饰性的。
- **AR2 — 按层限定按键。** 每一层拥有自己的箭头、typeahead 与 Escape；更深层的键从不对其父级起作用。
- **AR3 — 禁用的可发现性。** 键盘按 `component:DropdownMenu` FR17 所述到达禁用的行。
- **AR4 — 焦点可见性。** 键盘焦点在该行内部绘制共享焦点环，按焦点环自身的宽度内缩，在所有颜色模式下如此，包括强制颜色；在指针输入之后，该行只显示叠加着色（`architecture:interaction-modality` INV1、INV3）。共享的行处理见 `component:DropdownMenuItem` FR8。

## Design relationships

| 结构解剖或状态   | 设计要求                                       | 表示权威              | 层级角色 | 组件契约 |
| ---------------- | ---------------------------------------------- | --------------------- | -------- | -------- |
| 行               | 菜单行绘制、圆角与尺寸内边距；焦点绘制见 AR4。 | 当前源码与菜单 token  | 结构性   | FR1、AR4 |
| 插入符 / spinner | 镜像插入符，或加载期间的装饰性 spinner。       | 图标与 Spinner 所有者 | 辅助性   | FR3、FR8 |
| 飞出层           | Popover 表面、低阴影、容器圆角、视口上限。     | 当前源码与层运行时    | 突出性   | FR3      |
| 钻入视图         | 位于根的盒内的行，由镜像的返回行引导。         | 当前源码              | 结构性   | FR4      |
| 禁用             | 半透明度的行，带默认光标。                     | 当前源码              | 辅助性   | FR7      |

未记录组件本地的视觉决策。

## Family and system relationships

- `component:DropdownMenu` 拥有根表面、钻入栈、表面宿主、`dropdown-menu`、`dropdown-menu-item` 与 `dropdown-menu-indicator-icon` 目标清单，以及禁用行的键盘可达性（其 FR17）。
- `architecture:layer-runtime` 拥有飞出层的位置、翻转与内缩。
- `architecture:public-component-api` 拥有根输入与处理器组合。
- `architecture:react-component-runtime` 拥有回调时序。
- `spec:AST-086` 拥有加载宣告。

## Verification map

| 契约     | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 代表性状态                          | 变更或失败预期                                                                                                                                                                                                  | 审计部分                                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1、AR1 | `DropdownMenuSubMenu.test.tsx` 的 "renders the trigger with aria-haspopup and collapsed aria-expanded"、"names the flyout from its trigger via aria-labelledby"、"the row keeps its own popup state and tab stop"；带头部与尾部的用例 "holds the header, the rows and the footer in a dialog named by the row, outside every menu"                                                                                                                                                                                        | 关闭与打开；带区域                  | 缺少 `aria-haspopup`、`aria-expanded` 或表面上的行标签即失败。证据缺口：没有测试断言打开期间的 `aria-controls`。                                                                                                | `audit:DropdownMenuSubMenu/semantics`     |
| FR2、AR2 | `DropdownMenuSubMenu.test.tsx` 的 "opens the flyout on trigger click and exposes its items"、"opens on ArrowRight and returns focus to the trigger on ArrowLeft"、"mirrors its indicator and keyboard directions under RTL"、"closes only the submenu on Escape and restores focus to the trigger"、"supports first-character type-ahead within the flyout"、"navigates a two-level nested submenu without double-stepping"、"moves focus to the submenu trigger on hover, keeping a single highlight"；悬停/点击防护用例 | 点击、箭头、RTL、Escape、悬停、嵌套 | 不打开或不关闭的键、错误的焦点目标、重复跨层或反向的 RTL 箭头即失败。证据缺口：没有测试断言 Enter 或 Space 打开该行。                                                                                           | `audit:DropdownMenuSubMenu/accessibility` |
| FR3      | `DropdownMenuSubMenu.test.tsx` 的 "caps the flyout width and height to the available viewport"；`apps/storybook/rtl-audit/targets.json` 中的 DropdownMenuSubMenu 条目                                                                                                                                                                                                                                                                                                                                                     | 视口上限；RTL                       | 超出视口的飞出层即失败。证据缺口：没有测试断言行内末端位置或其翻转。                                                                                                                                            | `audit:DropdownMenuSubMenu/layout`        |
| FR4      | `DropdownMenuSubMenu.test.tsx` 的钻入用例；`DropdownMenuDrillIn.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                    | 钻入视图；返回                      | 缺少返回行或返回无效即失败。                                                                                                                                                                                    | `audit:DropdownMenuSubMenu/behavior`      |
| FR5      | `DropdownMenuSubMenu.test.tsx` 的 "closes the whole menu after selecting a nested item" 与 "activates a nested item with the Enter key and closes the menu"                                                                                                                                                                                                                                                                                                                                                               | 指针与 Enter                        | 选中叶子后仍打开的层即失败。                                                                                                                                                                                    | `audit:DropdownMenuSubMenu/behavior`      |
| FR6      | `DropdownMenuSubMenu.test.tsx` 的 "reports each flyout open and close to onOpenChange once"                                                                                                                                                                                                                                                                                                                                                                                                                               | 飞出层打开与关闭                    | 缺失或重复的报告即失败。证据缺口：钻入重置的缺口未被断言。                                                                                                                                                      | `audit:DropdownMenuSubMenu/behavior`      |
| FR10     | `DropdownMenuSubMenu.test.tsx` 的 "Tab from a flyout leaves the whole menu" 套件；`ContextMenu.test.tsx` 的对应用例                                                                                                                                                                                                                                                                                                                                                                                                       | 向下的一层与两层，Shift+Tab         | Tab 之后仍打开的飞出层即失败。                                                                                                                                                                                  | `audit:DropdownMenuSubMenu/accessibility` |
| FR11     | `DropdownMenuSubMenu.test.tsx` 的 "opens 150 ms after a hover and closes 200 ms after the pointer leaves by default"、"waits the `delay` it is given before a hover opens the flyout" 与 "keeps the flyout open for the `hideDelay` it is given after the pointer leaves"                                                                                                                                                                                                                                                 | `delay`；`hideDelay`；默认值        | 早于 `delay` 打开或早于 `hideDelay` 关闭的飞出层即失败。                                                                                                                                                        | `audit:DropdownMenuSubMenu/behavior`      |
| FR7、FR9 | `DropdownMenuSubMenu.test.tsx` 的 "does not open a disabled submenu"、"a disabled row does not pass a click on to the caller's onClick"、宿主属性与 ref 用例（"aria-\*, data-\* and id reach the trigger row, and the flyout stays labelled by it"、"a ref reaches the trigger row"、"a caller's handlers run after the row's own, and the row still opens and takes the hover focus"）                                                                                                                                   | 禁用；调用方处理器与属性            | 禁用行打开或调用方点击生效，或属性、ref、处理器被丢弃即失败。证据缺口：没有测试断言该行上的 `className`、`style` 或 `xstyle`、禁用行的 `tabindex="-1"`，或父级的键盘能到达它（`component:DropdownMenu` FR17）。 | `audit:DropdownMenuSubMenu/api`           |
| FR8      | `BusyOwnerAnnouncement.test.tsx` 的 "DropdownMenuSubMenu loading state" 用例；`DropdownMenuSubMenu.test.tsx` 的加载飞出层用例                                                                                                                                                                                                                                                                                                                                                                                             | 加载关闭与打开                      | 关闭时宣告忙碌开始、重复宣告或完全不宣告，或宣告了 Spinner，即失败。                                                                                                                                            | `audit:DropdownMenuSubMenu/accessibility` |
| AR4、PR1 | `DropdownMenuForcedColors.test.tsx`（该行的 `:focus-visible` 环与 token 内缩）；`DropdownMenuAudit.a11y.chromium.spec.ts` 的强制颜色帧。证据缺口：没有测试断言计时器边界                                                                                                                                                                                                                                                                                                                                                  | —                                   | —                                                                                                                                                                                                               | `audit:DropdownMenuSubMenu/visual`        |

## Current-state impact

- **钻入关闭报告（FR6）。** 当根菜单关闭一个钻入视图时，`onOpenChange(false)` 不会运行（OQ1）。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 当根菜单关闭时，由哪个所有者报告钻入视图的关闭？**（`human-api`）飞出层通过其层报告每一次关闭，但根重置钻入栈时没有告知该行，因此那次关闭时 `onOpenChange(false)` 从不运行。该栈由 `component:DropdownMenu` 拥有。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计得分、截图矩阵、实现步骤或根/叶子契约。它链接到它们的所有者。
