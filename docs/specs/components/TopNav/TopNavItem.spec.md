---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNav.test.tsx,
    apps/storybook/stories/TopNav.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# TopNavItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `TopNavItem`，带 `label`、`href`、`target`、`as`、`isSelected`、`isDisabled`、`isIconOnly`、`icon`、`children` 和 `size`；目标 `top-nav-item` 带 `mode` 与 `selected` 状态。 |
| Behavior                | TopNav 栏或抽屉中的一个链接。选中表示当前页面；禁用则丢弃该目标；在抽屉中，激活它会关闭抽屉，但链接上带修饰键的点击除外，此时抽屉保持打开。                                  |
| End-user impact         | 用户能看到并听到哪个目标是当前目标；禁用项无法通过任何输入导航；抽屉用户在选定目标后回到页面。                                                                               |
| Builder impact          | 无。                                                                                                                                                                         |
| Compatibility/readiness | 记录已发布行为；没有 prop、默认值、目标或导出变更。有两处实现缺口（见 Current-state impact）。                                                                               |
| Review checks           | 拒绝以下情况：禁用项仍保留 `href` 或触发 `onClick`；选中项没有 `aria-current="page"`；纯图标项没有可访问名称；抽屉项在未带修饰键的激活后仍让抽屉保持打开。                   |
| Governing rules         | `component:TopNav` 的渲染模式；`spec:AST-085`（禁用项）；`architecture:interaction-modality`（共享焦点指示器）；`architecture:component-theming-surface`。                   |

这张表是审查投影；下方正文具有权威性。

## Intent

TopNavItem 是 TopNav 内的一个目标链接。它负责链接的选中、禁用和纯图标状态，以及它在栏中和移动端抽屉中的渲染。使用方用法见 `TopNavItem.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：不适用；选择由调用方拥有
- 迁移决策：无

使用方迁移说明应放在使用方文档和发布说明中。

## Current-state impact

- **调用方 prop 可以替换项状态。** 其他 DOM prop 在 `aria-current`、`aria-disabled` 和 `tabIndex` 之后展开到链接上，因此调用方的值会替换它们；调用方的 `aria-disabled` 可能掩盖禁用项的状态。`architecture:public-component-api` INV5 防止组件自身拥有的可访问性被意外覆盖。
- **减少动态效果下的颜色过渡。** 在请求减少动态效果时，栏链接的背景色和文字颜色仍会有动画；`design:reduced-motion` DR3 规定，对于精细指针不允许任何动画属性。

## Ownership boundary

**负责**

- 链接元素、它的选中、禁用和纯图标状态，以及它在栏和抽屉中的渲染（FR1–FR7）。

**不负责 / 非目标**

- 本组件渲染的每个 `href` 的目标接受与阻止——由 `family:navigation-destinations` 负责。
- 哪一项被选中——由调用方负责。
- 栏的槽位与渲染模式——由 `component:TopNav` 和 `component:AppShell` 负责。
- 路由链接渲染——由 `LinkProvider` 和 `as` 组件负责。

## Public concepts

| Concept | Closed values or states | Meaning                               | Availability by variant/orientation/state | Default | Owner                  | Stability | Invalid-value behavior    |
| ------- | ----------------------- | ------------------------------------- | ----------------------------------------- | ------- | ---------------------- | --------- | ------------------------- |
| 选中    | `true`、`false`         | 该项是当前页面。                      | 所有模式。                                | `false` | `component:TopNavItem` | 稳定      | 不适用。                  |
| 禁用    | `true`、`false`         | 该项无法导航。                        | 所有模式。                                | `false` | `component:TopNavItem` | 稳定      | 不适用。                  |
| 纯图标  | `true`、`false`         | 隐藏可见文字；由 `label` 命名该链接。 | 所有模式。                                | `false` | `component:TopNavItem` | 稳定      | 没有 `icon` 时链接为空。  |
| 尺寸    | `sm`、`md`、`lg`        | 抽屉行高与内边距。                    | 仅抽屉模式；在栏中无效果。                | `md`    | `component:TopNavItem` | 稳定      | TypeScript 会拒绝其他值。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                           | Basis          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 启用的项渲染 `as` 组件，否则渲染 `LinkProvider` 链接组件，再否则渲染 `<a>`，并带上 `href` 和 `target`、转发的 `ref` 以及其他 DOM prop。它显示 `icon`，若有 `children` 则显示 `children`，否则显示 `label`。在带 `onClick` 且无 `href` 时，启用的项对辅助技术和键盘而言是一个按钮：它带有 `role="button"`，没有 `href`，处于 Tab 顺序中，并在 Enter 和松开 Space 时激活（Space 不会滚动页面），同时保持其 `HTMLAnchorElement` 类型。 | 当前源码与测试 |
| FR2 | `isSelected` 设置 `aria-current="page"` 和选中样式；选中填充在悬停和触摸按下时保持不变，且不叠加覆盖层。                                                                                                                                                                                                                                                                                                                            | 当前源码与测试 |
| FR3 | `isDisabled` 设置 `aria-disabled="true"` 并抑制点击，因此任何输入都无法导航或触发 `onClick`。禁用的链接渲染为不带 `href` 和不带 `target` 的普通 `<a>`。禁用且仅带 `onClick` 的项保留其宿主、`role="button"` 和 tab 停靠点。禁用项必须保留其启用时所具有的 tab 停靠点（`spec:AST-085` FR1）。                                                                                                                                        | 当前源码与测试 |
| FR4 | `isIconOnly` 隐藏文字，并把 `aria-label` 设为 `label`。                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR5 | 在 `default` 和 `mobile-bar` 模式下，该项是带 `top-nav-item` 的水平栏链接。在 `drawer` 模式下，它是按 `size` 设定尺寸的全宽行，带有 `data-mode="drawer"`，激活时先调用 `onClick`，然后关闭 AppShell 抽屉；但链接上的 Ctrl-、Cmd-、Shift- 或 Alt-点击会执行 `onClick` 并保持打开以等待下一次点击，除非 `onClick` 取消了该点击。                                                                                                      | 当前源码与测试 |
| FR6 | 两种渲染在键盘聚焦时都绘制共享焦点轮廓，并使用共享按压反馈。                                                                                                                                                                                                                                                                                                                                                                        | 当前源码       |
| FR7 | `className`、`style` 和 `xstyle` 在组件样式之后合并。                                                                                                                                                                                                                                                                                                                                                                               | 当前源码       |

### Allowed variation

- **AV1 — 主题样式。** 主题可以按模式和选中状态重新设置 `top-nav-item` 的样式。

### Representative states

| State  | Required invariant                                                     | Allowed variation |
| ------ | ---------------------------------------------------------------------- | ----------------- |
| 静止   | 带标签的链接。                                                         | 主题样式。        |
| 选中   | `aria-current="page"`；选中填充。                                      | 填充颜色。        |
| 禁用   | 无 `href`，无点击；保留其 tab 停靠点。                                 | 弱化样式。        |
| 纯图标 | `aria-label` 来自 `label`；无可见文字。                                | 图标。            |
| 抽屉   | 全宽行；激活会关闭抽屉，但链接上带修饰键的点击除外，此时抽屉保持打开。 | 行尺寸。          |

### Transformation and precedence order

- **ORD1 — 根元素。** 对于禁用的链接，为普通 `<a>`；否则依次为 `as`、`LinkProvider`、`<a>`。
- **ORD2 — 内容。** 先 `children`，后 `label`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 当前页面。** 选中项暴露 `aria-current="page"`。
- **AR2 — 禁用。** 禁用项被暴露为禁用，并保留其 tab 停靠点（`spec:AST-085` FR1、FR5）。
- **AR3 — 名称。** 纯图标项由 `label` 命名。

## Design relationships

| Anatomy or state | Design requirement     | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------- | ------------------------ | -------------- | ------------------ |
| 链接             | 带可选前置图标的标签。 | 当前源码与公共文档       | 突出           | FR1、FR4           |
| 选中状态         | 中性填充与更强的文字。 | 当前源码                 | 突出           | FR2                |

`TopNavItem.doc.mjs` 不声明自身的解剖结构，因此不记录解剖结构主题映射。

## Family and system relationships

- `family:navigation-destinations` 负责本组件渲染的每个目标接受/阻止的判定。
- `component:TopNav` 提供渲染模式；`component:AppShell` 提供抽屉关闭动作。
- `architecture:interaction-modality` 提供共享焦点指示器。

## Verification map

| Contract           | Verification                                                                                     | Representative states                | Mutation or failure expectation           | Audit section                    |
| ------------------ | ------------------------------------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------- | -------------------------------- |
| FR1, ORD1          | `TopNav.test.tsx` 的 TopNavItem 锚点、`as`、LinkProvider 和仅 `onClick` 的键盘按钮测试           | 默认、`as`、provider                 | 元素错误或优先级丢失即失败。              | `audit:TopNavItem/behavior`      |
| FR2–FR4, AR1–AR3   | `TopNav.test.tsx` 的 TopNavItem 状态测试                                                         | 选中、禁用、纯图标                   | 缺少属性或禁用项仍可导航即失败。          | `audit:TopNavItem/accessibility` |
| FR5                | `TopNav.test.tsx` 两种模式下的禁用导航测试                                                       | 默认与抽屉                           | 点击转发丢失或 `href` 处理丢失即失败。    | `audit:TopNavItem/behavior`      |
| RTL relation (FR1) | RTL 审计中精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`）在 `TopNav / Full example` 上 | `Dashboard` 项的前置图标；LTR 与 RTL | 前置图标不在其项的行内起始处即未通过 D2。 | `audit:TopNavItem/i18n-rtl`      |

从源码读取，尚无针对性测试：禁用链接的普通 `<a>` 优先于 `as` 和 `LinkProvider`（ORD1、FR3）；其他 DOM prop 到达链接（FR1）；`top-nav-item` 目标及其 `mode` 与 `selected` 状态（FR5）；悬停和按压下的选中填充（FR2）；抽屉行尺寸、`data-mode="drawer"` 以及激活时关闭抽屉（FR5）；FR6；以及 FR7。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表和示例。它链接到它们的所有者。
