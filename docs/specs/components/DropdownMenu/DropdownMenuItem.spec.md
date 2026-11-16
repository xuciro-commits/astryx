---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/DropdownMenu/__tests__/Menu.a11y.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuItem component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 一条用于操作或目标的复合指针菜单行，包含标签、辅助内容、禁用状态、破坏性绘制、可选的关闭抑制、根级输入以及转发的 ref。                                                         |
| 行为          | 父菜单拥有漫游焦点与键盘激活；该行拥有点击顺序、禁用抑制、选中后关闭、目标交接、悬停焦点以及其可见内容的组合。                                                                 |
| 最终用户影响  | 操作与目标保留键盘、指针与浏览器链接行为，而不可用的行保持惰性，破坏性操作仍可辨识。                                                                                           |
| 构建者影响    | 目标使用 `href`；辅助内容保持非交互；`hasCloseOnSelect=false` 保留给就地结果反馈。                                                                                             |
| 兼容性/就绪度 | 记录已发布的行为；无 API 变更；禁用的行获得 `tabindex="-1"`（FR7）。                                                                                                           |
| 审查检查      | 拒绝嵌套控件、禁用状态下的激活、目标安全性丢失、修饰键点击行为损坏、根级输入被丢弃、出现第二个键盘所有者，或将状态/目标反射移出该行。                                          |
| 管辖规则      | `family:navigation-destinations/FR1–FR5`；`architecture:public-component-api/INV5–INV9`；`architecture:component-theming-surface/INV3–INV6`；`spec:AST-020/FR1,FR2,FR6,FR15`。 |

本表是审查投影；下方正文才是权威。

## Intent

DropdownMenuItem 在 DropdownMenu 的指针呈现中渲染一行复合模式的行。它拥有行元素、内容槽位、操作与目标的分支、激活顺序、禁用与破坏性状态、根级组合，以及 `dropdown-menu-item` 主题目标。DropdownMenu 拥有外层菜单、键盘集合、焦点移动、typeahead、呈现方式选择以及关闭生命周期。

## Compatibility and migration

- 保留已发布的默认值：是。
- 兼容性类别：记录已发布的行为；无公共 prop 或导出变更；禁用的行获得 `tabindex="-1"`（FR7）。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个 `role="menuitem"` 根，及其标签、描述、图标、末端内容、禁用状态、破坏性变体、ref、受支持的宿主输入与样式输入。
- 操作回调顺序与 `hasCloseOnSelect` 行为。
- 链接行渲染、目标交接、修饰键/中键点击保留、target 与关系处理，以及禁用链接的惰性。
- 指针悬停焦点，以及该行的按下/悬停/焦点绘制。
- `dropdown-menu-item` 目标及其尺寸/变体状态反射。

**不拥有 / 非目标**

- 菜单命名、打开/关闭状态、焦点进入、漫游焦点、typeahead 与键盘点击合成——由 DropdownMenu 及其共享 hook 拥有。
- 触摸与底部面板的行渲染——父级呈现将这些行委托给 List。
- 目标的接受与阻止——由 `family:navigation-destinations` 拥有。
- 标签、描述或末端内容内部的交互控件。控件属于菜单旁侧，或作为单独的行。

## Public concepts

| 概念     | 封闭取值或状态                                      | 含义                                                | 可用性         | 默认值  | 所有者       | 稳定性 | 非法值行为                                           |
| -------- | --------------------------------------------------- | --------------------------------------------------- | -------------- | ------- | ------------ | ------ | ---------------------------------------------------- |
| 行行为   | action; destination                                 | 运行回调，或从该行本身暴露浏览器/路由目标。         | 每个启用的行   | action  | 组件与导航族 | stable | 被阻止的目标为惰性；禁用的链接没有 href。            |
| 可用性   | enabled; disabled                                   | 控制该行能否激活；禁用的行仍可接受键盘焦点（FR7）。 | 每一行         | enabled | 组件与父菜单 | stable | 禁用抑制激活与目标，但不抑制键盘焦点。               |
| 关闭策略 | close; remain open                                  | 成功激活是否关闭父菜单。                            | 操作行与目标行 | close   | 组件         | stable | 省略时关闭。                                         |
| 视觉状态 | default; destructive; hover; focus; press; disabled | 绘制行的含义与交互状态，不改变 menuitem 语义。      | 指针行         | default | 组件         | stable | 未知变体由公共类型拒绝。                             |
| 根级表面 | ref; DOM/data/ARIA; class/style/xstyle/events       | 在保留组件拥有的 role 与键盘状态的前提下扩展行根。  | 每个指针行     | omitted | 公共组件 API | stable | 接受的输入参与组合；拥有的 role/tab 停靠点保持固定。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                | 依据                                                     |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| FR1 | 指针行暴露一个 `role="menuitem"` 根。标签、描述、图标与末端内容是该行的呈现性内容，而非嵌套控件。                                                                                                                                                                                                     | `spec:AST-020` FR15；当前源码与文档                      |
| FR2 | 启用状态下的激活先运行行回调，再执行可选的关闭。禁用的行暴露 `aria-disabled=true`，移除链接目标，既不运行回调也不关闭。                                                                                                                                                                               | 当前行为与测试                                           |
| FR3 | 目标行通过 LinkProvider 渲染为链接根。普通激活先运行回调，然后关闭并导航；修饰键点击不运行回调，关闭菜单，并交由浏览器处理；中键点击关闭菜单（`hasCloseOnSelect`），然后运行调用方的 `onAuxClick`；被阻止的协议为惰性。                                                                               | `family:navigation-destinations` FR1–FR5；当前测试       |
| FR4 | 父菜单是唯一的键盘所有者。它合成带修饰键的点击激活、移动焦点并运行 typeahead；该行在鼠标悬停时自行获得焦点，不创建第二个漫游焦点模型。                                                                                                                                                                | `architecture:interaction-modality`；当前父级测试        |
| FR5 | 可见根携带 `dropdown-menu-item`；尺寸与破坏性状态反射在其上（`data-size`、`data-variant`）；语义 token 在调用方样式输入参与组合之前拥有布局与绘制。                                                                                                                                                   | `architecture:component-theming-surface`；当前源码与测试 |
| FR6 | Ref、受支持的宿主属性与处理器、`className`、`style` 与 `xstyle` 会到达或在行根上组合，而不替换拥有的 role、tab 停靠点、禁用行为、目标处理或激活顺序。                                                                                                                                                 | `architecture:public-component-api` INV5–INV9；当前测试  |
| FR7 | 禁用的菜单行保持惰性，父菜单的键盘按 `component:DropdownMenu` FR17 所述的方式到达它们。                                                                                                                                                                                                               | `component:DropdownMenu` FR17、DEC-11                    |
| FR8 | 键盘焦点在行内绘制共享焦点环，并按环自身宽度内缩，在每种颜色模式下都如此；强制颜色模式保留该环作为焦点指示器。指针输入之后，该行只显示其悬停背景（`architecture:interaction-modality` INV1），或在手指或触控笔按住并点亮它时显示按下叠加层（`spec:AST-094` FR27）；获得焦点的行拥有该指示器（INV3）。 | 当前源码；`architecture:interaction-modality` INV1、INV3 |

### Allowed variation

- **AV1 — 内容。** 非交互的图标、文本、描述、快捷键、徽章与状态文本可以变化，而不改变该行的 menuitem 语义。
- **AV2 — 主题绘制。** 主题可以重新设置该目标被允许的属性，同时保留可见的状态区分与强制颜色焦点。
- **AV3 — 父级尺寸。** 父菜单提供 `sm`、`md` 或 `lg`；该行反射该状态，并可以改变其 token 化的内距。

### Representative states

| 状态         | 必需的不变式                                         | 允许的变化                          |
| ------------ | ---------------------------------------------------- | ----------------------------------- |
| 启用的操作   | 运行回调，然后按关闭策略关闭。                       | 内容、尺寸与视觉变体。              |
| 就地结果操作 | 运行回调且菜单保持打开。                             | 标签/末端内容可以更新。             |
| 禁用的操作   | `aria-disabled=true`；回调、悬停焦点与关闭均被抑制。 | 内容保持可见。                      |
| 目标         | 一个锚点根保留安全目标与浏览器激活行为。             | target、rel、路由 provider 与内容。 |
| 破坏性       | 错误角色绘制应用于标签、图标与描述，而不改变行为。   | 其余行内容仍由使用方编写。          |
| 键盘焦点     | 父级焦点落到该行并保持可见。                         | 主题拥有的确切绘制可以变化。        |
| RTL / 窄视口 | 逻辑内距与起始对齐遵循书写方向，且不产生水平溢出。   | 菜单位置仍由父级拥有。              |

### Transformation and precedence order

- **ORD1 — 激活。** 禁用守卫 → 浏览器导航分类 → 适用的行回调 → 关闭策略 → 浏览器/路由导航。
- **ORD2 — 根级组合。** 父级尺寸 → 基础行样式 → 变体/禁用状态 → 调用方 `xstyle`；目标元数据与调用方 class/style 在同一根上组合。

### Performance and resources

- **PR1 — 共享按下监听器。** 该行共享按下控制器的 window 与 document 监听器；它不新增任何逐行监听器、观察器、定时器或请求。

## Accessibility contract

- **AR1 — 菜单项语义。** 根是一个具名的 `menuitem`；辅助内容不引入嵌套的交互后代。
- **AR2 — 禁用状态。** 禁用的行暴露状态，且无法激活或导航。
- **AR3 — 键盘所有权。** DropdownMenu 拥有焦点集合与激活；该项在该模型中仍是单独一行。
- **AR4 — 焦点感知。** 键盘输入之后，获得焦点的行在每种颜色模式下（包括强制颜色）沿其边缘内侧绘制共享焦点环；指针输入之后，其背景遵循 FR8。

## Design relationships

| 结构或状态 | 设计要求                                                     | 呈现权威                         | 层级角色   | 组件契约      |
| ---------- | ------------------------------------------------------------ | -------------------------------- | ---------- | ------------- |
| 行         | 一个全宽的操作/目标目标区域，具有 token 化的内距与起始对齐。 | 当前源码与父菜单组合             | prominent  | FR1–FR6       |
| 辅助文本   | 描述与末端内容从属于行标签。                                 | 委托的 Item 布局与当前使用方文档 | supporting | FR1           |
| 交互       | 悬停、焦点、按下、禁用与破坏性状态保持可区分。               | 当前源码；FR8                    | prominent  | FR5, FR8, AR4 |

未记录组件本地的视觉决策。

## Family and system relationships

- `family:navigation-destinations` 拥有目标的接受与被阻止协议的行为；本组件提供承载目标的行。
- `architecture:public-component-api` 拥有根级输入组合、ref 与已发布的兼容性。
- `architecture:component-theming-surface` 拥有目标放置与状态反射。
- `architecture:component-test-sufficiency` 拥有相称的可观察证据。
- `architecture:interaction-modality` 与 DropdownMenu 拥有父级键盘行为。
- `spec:AST-020` 提供 WCAG/APG 的采用方式与证据层边界。

## Verification map

| 契约           | 验证                                                                                                                                                                                                                                                                                                                 | 代表状态                                   | 变更或失败预期                                                                                                                            | 审查小节                               |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1, AR1       | `DropdownMenu.test.tsx` 的复合模式用例（"renders JSX children as menu items"、"renders endContent after the item label"）；`Menu.a11y.test.tsx` 的菜单绑定用例                                                                                                                                                       | 带内容的操作行                             | 不是 `menuitem` 或丢失内容的行会失败。证据缺口：没有测试断言辅助内容不包含嵌套控件。                                                      | `audit:DropdownMenuItem/semantics`     |
| FR2, AR2, ORD1 | `DropdownMenu.test.tsx` 的项用例（"calls onClick when item is clicked"、"closes the menu after an item is activated"、"keeps the menu open when the item opts out of closing"、"does not call onClick when disabled"）、"has aria-disabled on disabled compound items" 以及 "a disabled href row renders no address" | 启用、禁用、关闭与保持打开                 | 禁用时运行回调、缺失 `aria-disabled`、忽略策略的关闭，或带地址的禁用行都会失败。证据缺口：没有测试断言回调先于关闭的顺序。                | `audit:DropdownMenuItem/behavior`      |
| FR3            | `DropdownMenu.test.tsx` 的 "DropdownMenuItem href" 与 "link rows — the browser's own clicks" 用例；"a middle click on a link row runs the caller's onAuxClick and still closes the menu"                                                                                                                             | 普通、修饰键、中键、右键点击；被阻止的目标 | 非锚点行、运行回调的修饰键点击、不关闭的中键点击，或仍然生效的被阻止目标都会失败。                                                        | `audit:DropdownMenuItem/behavior`      |
| FR4, AR3       | `DropdownMenu.test.tsx` 的键盘访问用例（"moves focus to the item the mouse hovers, keeping a single highlight"、"does not move focus on hover for a disabled item"、"does not move focus for a non-mouse (touch) pointer"）以及 "keeps the row's own role, tab stop and hover focus beside a caller's onPointerMove" | 鼠标悬停、触摸、禁用                       | 出现第二个高亮、禁用行或触摸下的悬停焦点，或丢失 tab 停靠点都会失败。                                                                     | `audit:DropdownMenuItem/accessibility` |
| FR5            | `DropdownMenu.test.tsx` 的破坏性变体用例；`themingTargets.test.ts`                                                                                                                                                                                                                                                   | 默认与破坏性；数据与复合模式               | 缺失 `data-variant` 会失败；渲染出的 class 未见于已记录的目标也会失败。证据缺口：没有测试断言 `dropdown-menu-item` class 或 `data-size`。 | `audit:DropdownMenuItem/theming`       |
| FR6            | `DropdownMenu.test.tsx` 的 ref 与宿主属性用例（"a ref reaches the menuitem element"、"puts aria-\*, data-\* and id on the row root, a link row included"、"runs the DOM handlers the caller attaches, such as a drop target"）                                                                                       | Ref；宿主属性；调用方处理器                | 丢失 ref、属性或处理器会失败。证据缺口：没有测试断言行上的 `className`、`style` 或 `xstyle`。                                             | `audit:DropdownMenuItem/api`           |
| FR7            | `DropdownMenu.test.tsx` 的禁用行键盘用例（`component:DropdownMenu` FR17）                                                                                                                                                                                                                                            | 禁用的行                                   | 激活、关闭菜单，或被父级方向键或 type-ahead 跳过的禁用行会失败。                                                                          | `audit:DropdownMenuItem/accessibility` |
| FR8, AR4, PR1  | `DropdownMenuForcedColors.test.tsx`（每行的 `:focus-visible` 环与 token 内距）；`DropdownMenuAudit.a11y.chromium.spec.ts` 的强制颜色帧                                                                                                                                                                               | 操作行与破坏性行；浅色、深色、强制颜色     | 键盘输入后没有环的行，或未按环宽度内缩的环都会失败。证据缺口：没有测试断言监听器的绑定。                                                  | `audit:DropdownMenuItem/visual`        |
| RTL            | `apps/storybook/rtl-audit/verified-not-applicable.json` 的 DropdownMenuItem 条目                                                                                                                                                                                                                                     | LTR 与 RTL                                 | 源码哈希变更会使回执失败。                                                                                                                | `audit:DropdownMenuItem/rtl`           |

## Current-state impact

无。

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审查评分、截图矩阵、实现步骤或族/系统规则。它链接到它们的所有者。
