---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavMegaMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNavMegaMenu.test.tsx,
    apps/storybook/stories/TopNavMenu.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: []
---

# TopNavMegaMenu component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `TopNavMegaMenu` 提供 `label`、`items` 与 `featured` 插槽、`delay`（150）、`hideDelay`（250）以及 `onOpenChange`；目标 `top-nav-mega-menu`，带一个 `mode` 状态。                   |
| Behavior                | 在栏中，是一个按钮，悬停或点击时在整个 TopNav 下方打开一个宽大的链接面板；该面板是带标签的分组，不是 ARIA 菜单。在抽屉中，是一个披露控件，就地展开条目与精选内容。在移动栏中隐藏。 |
| End-user impact         | 用户浏览一个由目的地构成的网格，其中含描述与一张精选卡片；键盘用户可从触发器到达面板的各个链接；抽屉用户就地展开该分组。                                                           |
| Builder impact          | 无。                                                                                                                                                                               |
| Compatibility/readiness | 记录已交付的行为；无公共变更。有四个当前状态缺口（见 Current-state impact）。                                                                                                      |
| Review checks           | 拒绝把面板暴露为 `role="menu"`、用模态对话框包装它、以键盘激活去关闭已打开的面板，或让折叠的抽屉分组仍然可达。                                                                     |
| Governing rules         | `architecture:public-component-api` INV5 与 INV7；`architecture:interaction-modality`；`component:TopNav` 渲染模式。                                                               |

此表是一份审查投影；下述正文具有权威性。

## Intent

TopNavMegaMenu 是一个 TopNav 条目，用于展示大量目的地与精选内容组成的大面板。它负责触发器、面板的打开、关闭与消失行为、面板布局，以及可展开的抽屉分组。使用方用法见 `TopNavMegaMenu.doc.mjs`。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容性类别：记录已交付的行为；无公共变更
- 受控/非受控行为：打开状态是内部的；由 `onOpenChange` 报告
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **触发器宣称自己是一个菜单。** 触发器带有 `aria-haspopup="true"`，WAI-ARIA 1.2 将其定义为菜单弹层，而面板是 `role="group"`（FR5）。
- **减少动态效果下的动画。** 面板的淡入与 4 px 位移、抽屉分组的高度、箭头的旋转，以及触发器的背景与文字颜色，在请求减少动态效果时仍会播放动画。`design:reduced-motion` DR1–DR3 规定：精细指针不得有动画属性，触摸指针只允许短暂的不透明度变化。
- **同名抽屉分组共用 id。** 抽屉分组的 id 由 `label` 派生，因此同一抽屉中两个同名的 mega menu 会产生重复的 id。
- **抽屉触发器丢弃了 ref。** 在 `drawer` 模式下，披露按钮收到调用方的其他 DOM props，但没有 `ref`。`architecture:public-component-api` INV8 要求 ref 到达契约所承诺的元素。

## Ownership boundary

**负责**

- 触发器、面板、打开/关闭与消失行为、面板布局，以及抽屉分组（FR1–FR11）。

**不负责 / 非目标**

- 条目渲染——由 `component:TopNavMegaMenuItem` 负责；精选卡片——由 `component:TopNavMegaMenuFeaturedCard` 或调用方负责。
- 渲染模式与插槽——由 `component:TopNav` 负责。
- 原生 popover 的消失与层托管——由共享的 popover 与层运行时负责。

## Public concepts

除 `TopNavMegaMenu.doc.mjs` 中的使用方 props 外，没有组件本地概念。

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                        | Basis          |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1  | 在 `default` 模式下，触发器是一个 `<button>`，显示 `label` 与一个在打开时转向的箭头；它带有 `top-nav-mega-menu`、转发的 `ref` 及其他 DOM props，暴露 `aria-expanded`，且其 `aria-controls` 指向该面板。                                                                                                                                                                          | 当前源码与测试 |
| FR2  | 面板是一个 auto popover，以触发器作为其原生 invoker，锚定在最近的封闭 `<nav>` 下方，并与触发器的 TopNav 插槽对齐。浏览器的轻触消失会关闭它，打开一个同级 mega menu 也会关闭它。                                                                                                                                                                                                  | 当前源码与测试 |
| FR3  | 在支持悬停的指针上，悬停会在 `delay` 毫秒后打开，且面板保持短暂性：离开触发器和面板会在 `hideDelay` 毫秒后关闭它，重新进入触发器会取消待定的关闭。点击会将其固定打开。在悬停打开后 500 ms 内的点击会固定而非关闭；重新悬停已打开的面板不会重启该窗口。关闭后，指针进入面板不会重新打开它。                                                                                       | 当前源码与测试 |
| FR4  | Enter 与 Space 打开面板，且绝不关闭已打开的面板。Escape 关闭它并把焦点返回触发器。                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR5  | 面板是 `role="group"`，由 `label` 命名，不是 `menu`，也不是模态对话框。该分组之后紧跟一个由 `@astryx.popover.close` 命名的关闭按钮，它在获得焦点之前保持视觉隐藏。点击打开会把焦点移到面板的第一个链接或按钮；悬停打开则不移动焦点。                                                                                                                                             | 当前源码与测试 |
| FR6  | 面板绘制自己的表面：`items` 排成两列网格，然后 `featured` 位于其旁，在窄宽度下换行。面板宽度至多 `min(960px, 100dvw − 16px)`，高度至多导航栏下方的可用空间；更高的内容在面板内部滚动。在没有减少动态效果偏好时，打开会淡入并从上方 4 px 处滑入。                                                                                                                                 | 当前源码       |
| FR7  | 面板显示时 `onOpenChange` 触发 `true`，隐藏时触发 `false`，无论原因如何。                                                                                                                                                                                                                                                                                                        | 当前源码       |
| FR8  | 触发器的调用方 `onClick`、`onMouseEnter` 与 `onMouseLeave` 在内置行为之前运行并与内置行为组合；调用方处理器若调用 `preventDefault()`，则取消该事件的内置打开或切换。                                                                                                                                                                                                             | 当前源码与测试 |
| FR9  | 在 `drawer` 模式下，触发器是一个全宽披露按钮，带有 `aria-expanded`、`aria-controls` 与 `data-mode="drawer"`；激活它会切换该分组，该分组先包含 `items`（渲染其抽屉形态），然后是 `featured`。折叠内容为 `inert` 与 `aria-hidden`，该分组在折叠期间与展开期间都裁剪，完全展开后停止裁剪。在没有减少动态效果偏好时，展开会对分组高度播放动画。触发器的 `aria-controls` 指向该分组。 | 当前源码与测试 |
| FR10 | 在 `mobile-bar` 模式下，TopNavMegaMenu 不渲染任何内容。                                                                                                                                                                                                                                                                                                                          | 当前源码与测试 |
| FR11 | 栏触发器与抽屉触发器绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                                                                                         | 当前源码与测试 |

### Allowed variation

- **AV1 — Slot content.** `items` 可以是任意节点；`featured` 可以是任意节点。

### Representative states

| State            | Required invariant                          | Allowed variation |
| ---------------- | ------------------------------------------- | ----------------- |
| Hover-open       | 短暂；指针离开时关闭。                      | 延迟。            |
| Click-open       | 固定；指针离开时保持打开。                  | —                 |
| Keyboard-open    | 在 Enter 或 Space 上打开；Escape 返回焦点。 | —                 |
| Tall content     | 面板内部滚动；表面边缘保持固定。            | 高度。            |
| Drawer collapsed | 内容 inert 且隐藏。                         | —                 |

### Transformation and precedence order

- **ORD1 — Trigger handlers.** 先调用方处理器，再调用内置处理器。

### Performance and resources

- **PR1 — Timers.** 悬停计时器在关闭与卸载时清除。

## Accessibility contract

- **AR1 — Group, not menu.** 链接网格暴露为具名分组，不是 ARIA 菜单，也不是模态对话框。
- **AR2 — Trigger state.** 触发器暴露其展开状态以及它所控制的面板。
- **AR3 — Drawer disclosure.** 抽屉触发器暴露其展开状态；折叠内容不可达。

## Design relationships

| Anatomy or state | Design requirement                       | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------- | ------------------------ | -------------- | ------------------ |
| Trigger          | 栏条目样式，带一个箭头。                 | 当前源码与公共文档       | 主要           | FR1                |
| Panel            | 导航栏下方的宽表面：条目网格与精选区域。 | 当前源码与公共文档       | 主要           | FR6                |
| Drawer group     | 披露行，含条目与精选内容。               | 当前源码                 | 辅助           | FR9                |

`TopNavMegaMenu.doc.mjs` 未声明自身的解剖结构，因此不记录解剖主题映射。

## Family and system relationships

- `family:overlay-dismissal` 负责该组件 popover 的 Escape 与关闭请求排序。
- `component:TopNav` 提供渲染模式与插槽，并且是面板的锚点。
- `architecture:public-component-api` INV5 与 INV7 管辖转发与处理器组合。

## Verification map

| Contract          | Verification                                                                                               | Representative states                         | Mutation or failure expectation                 | Audit section                        |
| ----------------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | ------------------------------------ |
| FR1, FR5, AR1–AR2 | `TopNavMegaMenu.test.tsx` 默认模式与弹层语义套件                                                           | 关闭与打开                                    | 出现菜单角色、对话框包装或坏的链接即失败。      | `audit:TopNavMegaMenu/accessibility` |
| FR2, FR3          | `TopNavMegaMenu.test.tsx` 悬停/点击防护与消失套件                                                          | 悬停、点击、离开、同级、轻触消失              | 失去防护或残留的打开状态即失败。                | `audit:TopNavMegaMenu/behavior`      |
| FR4               | `TopNavMegaMenu.test.tsx` 键盘套件                                                                         | Enter、Space、Escape                          | 切换为关闭或失去焦点返回即失败。                | `audit:TopNavMegaMenu/accessibility` |
| FR8               | `TopNavMegaMenu.test.tsx` 透传与自有处理器套件                                                             | 栏与抽屉                                      | 处理器被替换即失败。                            | `audit:TopNavMegaMenu/behavior`      |
| FR9–FR11, AR3     | `TopNavMegaMenu.test.tsx` 移动栏、抽屉与焦点环套件                                                         | 折叠与展开                                    | 折叠内容可达或缺少焦点环即失败。                | `audit:TopNavMegaMenu/behavior`      |
| RTL relation      | RTL 审计精选 D4 目标（`apps/storybook/rtl-audit/targets.json`）中的 `TopNavMenu / Mega menu`（面板已打开） | 打开且起始边对齐的 mega menu 面板；LTR 与 RTL | 在 RTL 下未移到页面镜像一侧的面板在 D4 上失败。 | `audit:TopNavMegaMenu/i18n-rtl`      |

从源码读取、尚无专项测试的内容：分组之后视觉隐藏的关闭按钮（FR5）；转发的 `ref`、`top-nav-mega-menu` 目标及其 `mode` 状态，以及栏与抽屉箭头的转向（FR1、FR9）；抽屉分组展开期间的裁剪与其高度动画（FR9）；点击打开把焦点放在何处（FR5）；调用方 `preventDefault()` 的取消（FR8）；在封闭 `<nav>` 下方的锚定与插槽对齐（FR2）；FR6；FR7；以及栏触发器的焦点轮廓（FR11）。

## Decision log

没有记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例或 popover 机制。它链接到它们的所有者。
