---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavMegaMenuItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNavMegaMenu.test.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:reduced-motion]
architecture:
  [architecture:interaction-modality, architecture:component-theming-surface]
contributing: []
system_specs: []
---

# TopNavMegaMenuItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `TopNavMegaMenuItem` 带有 `title`、`description`、`icon`、`href`、`onClick` 和 `as`；目标 `top-nav-mega-menu-item` 带有一个 `mode` 状态。 |
| Behavior                | Mega 菜单中的一个目标：桌面面板中的富磁贴，以及抽屉中的一行。抽屉行在激活时关闭抽屉，但对链接的修饰点击除外，后者会让抽屉保持打开。       |
| End-user impact         | 用户会看到每个目标的标题、描述和图标。                                                                                                    |
| Builder impact          | 无。                                                                                                                                      |
| Compatibility/readiness | 记录已发布的行为；无公开变更。存在一处实现缺口（见 Current-state impact）。                                                               |
| Review checks           | 拒绝这样的抽屉项：在未修饰的激活之后仍让抽屉保持打开，或丢弃调用方的 props 与样式。                                                       |
| Governing rules         | `architecture:interaction-modality` INV4；WCAG 2.1.1；`component:TopNav` 的渲染模式。                                                     |

本表是审查用的投影；以下正文具有权威性。

## Intent

TopNavMegaMenuItem 是 TopNavMegaMenu 内部的一个目标。它根据 TopNav 渲染模式，为桌面面板或移动抽屉渲染自身。使用方的用法见 `TopNavMegaMenuItem.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认行为：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

- **减弱动态效果下的颜色过渡。** 当请求减弱动态效果时，桌面磁贴的背景色仍会播放动画；`design:reduced-motion` DR3 对精细指针不允许任何动画属性。

## Ownership boundary

**拥有**

- 两种模式下的条目元素、其内容顺序，以及激活时关闭抽屉（FR1–FR4）。

**不拥有 / 非目标**

- 本组件渲染的每个 `href` 的目标接受与阻断——由 `family:navigation-destinations` 拥有。
- 面板布局、网格以及抽屉分组——由 `component:TopNavMegaMenu` 拥有。
- 路由链接渲染——由 `LinkProvider` 和 `as` 拥有。

## Public concepts

除使用方 props 之外，没有组件本地概念。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                 | Basis          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 在抽屉之外，该条目是 `as` 组件；否则是 `LinkProvider` 链接；否则当设置了 `href` 时是 `<a>`，当有 `onClick` 且没有 `href` 时是 `<button type="button">`，其余情况是 `div`。它先显示图标框，再显示标题和描述，带有 `top-nav-mega-menu-item`，并在点击时运行 `onClick`。                     | 当前源码与测试 |
| FR2 | 在 `drawer` 模式下，当设置了 `href` 时该条目是链接，否则是 `<button type="button">`，带有 `data-mode="drawer"`，并在激活时运行 `onClick`，然后关闭 AppShell 抽屉；但链接上的 Ctrl、Cmd、Shift 或 Alt 点击只运行 `onClick` 并让抽屉保持打开，等待下一次操作，除非 `onClick` 取消了该点击。 | 当前源码与测试 |
| FR3 | 两种模式都会转发 `ref`、`tabIndex`、其他 DOM props 和事件处理器，并在组件样式之后合并 `className`、`style` 和 `xstyle`。                                                                                                                                                                  | 当前源码与测试 |
| FR4 | 两种模式都会在键盘聚焦时绘制共享的焦点轮廓，并使用共享的按压反馈。                                                                                                                                                                                                                        | 当前源码与测试 |

### Allowed variation

- **AV1 — 可选部分。** 图标和描述可以缺席。

### Representative states

| State    | Required invariant                                                     | Allowed variation |
| -------- | ---------------------------------------------------------------------- | ----------------- |
| 桌面链接 | 带标题和描述的链接磁贴。                                               | 图标。            |
| 抽屉链接 | 行链接；激活会关闭抽屉，但对链接的修饰点击除外，后者会让抽屉保持打开。 | —                 |
| 抽屉操作 | 按钮行；激活会关闭抽屉。                                               | —                 |

### Transformation and precedence order

- **ORD1 — 链接元素。** `as`，然后是 `LinkProvider`，然后是 `<a>`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 抽屉操作是按钮。** 没有 `href` 的抽屉项是原生按钮。
- **AR2 — 链接名称。** 链接项的名称是其标题与描述文本。

## Design relationships

| Anatomy or state | Design requirement         | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------- | ------------------------ | -------------- | ------------------ |
| 磁贴             | 图标框、标题、描述。       | 当前源码与公开文档       | 支撑性         | FR1                |
| 抽屉行           | 采用导航行样式，描述可选。 | 当前源码                 | 支撑性         | FR2                |

`TopNavMegaMenuItem.doc.mjs` 未声明自身的结构，因此不记录结构-主题映射。

## Family and system relationships

- `family:navigation-destinations` 拥有对本组件渲染的每个目标的接受/阻断决策。
- `component:TopNavMegaMenu` 将条目放入其面板网格和抽屉分组。

## Verification map

| Contract     | Verification                                                                                                  | Representative states                 | Mutation or failure expectation          | Audit section                            |
| ------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| FR1, FR2     | `TopNavMegaMenu.test.tsx` 中的 TopNavMegaMenuItem（包括桌面仅 `onClick` 的原生按钮）与抽屉项测试              | 桌面链接、按钮和占位符；抽屉链接/按钮 | 元素错误或描述丢失即失败。               | `audit:TopNavMegaMenuItem/behavior`      |
| FR3          | `TopNavMegaMenu.test.tsx` 中的 TopNavMegaMenuItem 透传测试                                                    | 两种模式                              | props 或样式被丢弃即失败。               | `audit:TopNavMegaMenuItem/behavior`      |
| FR4          | `TopNavMegaMenu.test.tsx` 中的抽屉焦点环测试                                                                  | 抽屉项                                | 缺少共享焦点环类即失败。                 | `audit:TopNavMegaMenuItem/accessibility` |
| RTL relation | 位于 `TopNavMenu / Mega menu`（面板已打开）的 RTL 审计精选 D2 目标（`apps/storybook/rtl-audit/targets.json`） | 条目图标与文本；LTR 与 RTL            | 图标未位于其文本的行内起始处即 D2 失败。 | `audit:TopNavMegaMenuItem/i18n-rtl`      |

以下内容从源码读取，尚无聚焦测试：抽屉按钮的 `type="button"`（FR2）；桌面条目的 `onClick` 与图标框（FR1）；按压反馈（FR4）；无 `href` 的桌面条目所用的 `div`（FR1）；桌面条目转发的 `tabIndex`（FR3）；转发的 `ref` 以及 `top-nav-mega-menu-item` 目标及其 `mode` 状态（FR1–FR3）；`as` 与 `LinkProvider` 的优先级（FR1、ORD1）；激活时关闭抽屉（FR2）以及桌面焦点轮廓（FR4）。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 props 表或示例。它链接到它们的拥有者。
