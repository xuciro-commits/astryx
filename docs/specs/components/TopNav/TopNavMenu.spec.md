---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNavMenu.test.tsx,
    packages/core/src/hooks/useMenuHover.test.tsx,
    apps/storybook/stories/TopNavMenu.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families:
  [
    family:navigation-destinations,
    family:overlay-dismissal,
    family:action-groups,
  ]
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

# TopNavMenu component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                             |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `TopNavMenu`，接受 `label`、`items`（`{title, description?, icon?, href?, onClick?}`）、`delay`（150）与 `hideDelay`（200）；目标为 `top-nav-menu`。 |
| Behavior                | 在栏中，是一个在悬停或点击时打开富条目菜单的按钮，支持 APG 菜单键盘操作。在抽屉中，是一个就地展开其条目的展开控件。在移动端栏中隐藏。                |
| End-user impact         | 鼠标用户在悬停时预览目标；键盘用户用方向键与输入即定位在条目间移动；抽屉用户就地展开分组。                                                           |
| Builder impact          | 无。                                                                                                                                                 |
| Compatibility/readiness | 记录已发布行为；无公共变更。存在两处当前状态缺口（见 Current-state impact）。                                                                        |
| Review checks           | 拒绝把弹出层包进模态对话框、条目中存在多个 tab 停靠点、折叠的抽屉分组仍可访问，或调用方的触发器处理器替换内置处理器。                                |
| Governing rules         | `architecture:public-component-api` INV5 与 INV7；`architecture:interaction-modality`；`component:TopNav` 渲染模式。                                 |

本表是审查投影；以下正文才具有权威性。

## Intent

TopNavMenu 是一个 TopNav 入口，把一个标签下的多个目标分组。它拥有触发器、栏中悬停或点击打开的菜单弹出层，以及移动端抽屉中的可展开分组。使用方用法见 `TopNavMenu.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：打开与展开状态是内部状态
- 迁移决策：无

使用方迁移说明应放在使用方文档与发行说明中。

## Current-state impact

- **减弱动效时的动画。** 在请求减弱动效时，抽屉分组的高度、栏与抽屉箭头的旋转、触发器的背景与文字颜色、以及每个栏条目的背景色仍会播放动画；`design:reduced-motion` DR1–DR3 对精细指针不允许任何动画属性，对触摸只允许短暂的透明度变化。
- **抽屉触发器丢失 ref。** 在 `drawer` 模式下，展开按钮会接收调用方的其他 DOM props，但不接收 `ref`。`architecture:public-component-api` INV8 要求 ref 到达契约所承诺的元素。

## Ownership boundary

**Owns**

- 触发器按钮、菜单弹出层及其条目、键盘处理，以及抽屉分组（FR1–FR10）。

**Does not own / non-goals**

- 本组件渲染的每个 `href` 的目标接受与拦截——由 `family:navigation-destinations` 拥有。
- 渲染模式与插槽——由 `component:TopNav` 拥有。
- 弹出层定位、原生轻触关闭与层托管——由共享的 popover 与 layer 运行时拥有。
- 富面板布局——由 `component:TopNavMegaMenu` 拥有。

## Public concepts

| Concept  | Closed values or states                                  | Meaning          | Availability by variant/orientation/state | Default | Owner                  | Stability | Invalid-value behavior          |
| -------- | -------------------------------------------------------- | ---------------- | ----------------------------------------- | ------- | ---------------------- | --------- | ------------------------------- |
| 菜单条目 | `title`、可选的 `description`、`icon`、`href`、`onClick` | 一个目标或动作。 | 栏与抽屉。                                | —       | `component:TopNavMenu` | 稳定      | 被拒绝的 `href` 不渲染 `href`。 |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Basis                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1  | 在 `default` 模式下，触发器是一个 `<button>`，显示 `label` 与一个在打开时转向的箭头；它带有 `top-nav-menu`、转发的 `ref` 与其他 DOM props，并播报一个弹出菜单及其展开状态。                                                                                                                                                                                                                                                                                                 | Current source and tests |
| FR2  | 在支持悬停的指针上，悬停触发器会在 `delay` 毫秒后打开菜单，离开触发器与菜单会在 `hideDelay` 毫秒后关闭它；悬停打开不会移动焦点。点击会打开菜单并把焦点移到第一个条目；在悬停打开后 500 毫秒内的点击会保持其打开。                                                                                                                                                                                                                                                           | Current source and tests |
| FR3  | 弹出层是触发器下方的非模态 popover，与触发器的 TopNav 插槽对齐（start、center 或 end）。它包含一个由 `label` 命名的 `role="menu"`，之后是一个由 `@astryx.popover.close` 命名的关闭按钮，该按钮在获得焦点前保持视觉隐藏。                                                                                                                                                                                                                                                    | Current source and tests |
| FR4  | 每个条目是一个 `role="menuitem"`：设置了 `href` 时为 `<a>`（仅当 URL 被接受时才渲染其 `href`），否则为 `div`。栏条目渲染原生 `<a>`，而不是 `LinkProvider` 链接。它显示图标框、标题与描述，并在激活时运行条目的 `onClick`。                                                                                                                                                                                                                                                  | Current source and tests |
| FR5  | 条目使用漫游 tab index，只有一个 tab 停靠点。ArrowDown 与 ArrowUp 移动焦点并在两端回绕；输入字符会移动到匹配的条目；Enter 或 Space 激活当前焦点条目；Escape 关闭菜单并把焦点返回触发器。                                                                                                                                                                                                                                                                                    | APG menu pattern; tests  |
| FR6  | 触发器上调用方的 `onClick`、`onMouseEnter` 与 `onMouseLeave` 先于内置打开行为运行，并与它组合而不是替换它；调用方处理器若调用 `preventDefault()`，会取消该事件的内置打开或切换。调用方属性绝不覆盖弹出层的接线。                                                                                                                                                                                                                                                            | Current source and tests |
| FR7  | 在 `drawer` 模式下，触发器是一个全宽的展开按钮，带有 `aria-expanded` 与 `aria-controls`；激活它会切换分组。折叠的条目为 `inert` 与 `aria-hidden`，分组在折叠时与展开过程中都会裁剪，完全展开后停止裁剪。在无减弱动效偏好时，展开会对分组高度播放动画。                                                                                                                                                                                                                      | Current source and tests |
| FR8  | 抽屉条目通过 `LinkProvider` 链接组件渲染，带有 `onClick` 且无 `href` 的条目渲染 `<button type="button">`；激活其中一个会运行条目的 `onClick`，然后关闭 AppShell 抽屉，但对链接的 Ctrl、Cmd、Shift 或 Alt 点击会运行 `onClick` 并为下一次操作保持其打开，除非 `onClick` 取消该点击。                                                                                                                                                                                         | Current source           |
| FR9  | 在 `mobile-bar` 模式下 TopNavMenu 不渲染任何内容。                                                                                                                                                                                                                                                                                                                                                                                                                          | Current source           |
| FR10 | 触发器、每个栏条目与每个抽屉控件都会绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                                                                                                                                                                    | Current source and tests |
| FR11 | 在打开的菜单中，一次落在某个可用条目上并滑过各条目的按压（手指、笔或鼠标）会通过该条目自身的激活方式作用于它抬起时所处的那个条目，只作用一次，高亮跟随指针；在外部抬起则不作任何操作，鼠标在外部释放会关闭菜单。菜单为此采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。链接条目不可拖动，因此鼠标滑动不是拖拽；对链接条目的 Ctrl、Cmd 或 Shift 点击或中键点击仍归浏览器处理；键盘与辅助技术行为不变。 | Current source and tests |

### Allowed variation

- **AV1 — 时序。** `delay` 与 `hideDelay` 因调用方而异。

### Representative states

| State            | Required invariant                                                     | Allowed variation |
| ---------------- | ---------------------------------------------------------------------- | ----------------- |
| Closed           | 触发器处于折叠状态。                                                   | 主题样式。        |
| Hover-open       | 菜单打开；焦点不移动。                                                 | 延迟。            |
| Click-open       | 菜单打开；焦点在第一个条目上。                                         | —                 |
| Drawer collapsed | 条目为 inert 并对辅助技术隐藏。                                        | —                 |
| Drawer expanded  | 条目可访问；激活会关闭抽屉，但带修饰键点击链接除外，该点击保持其打开。 | 动画。            |

### Transformation and precedence order

- **ORD1 — 触发器处理器。** 先调用调用方处理器，再调用内置处理器（FR6）。

### Performance and resources

- **PR1 — 定时器。** 悬停定时器在关闭时与卸载时清除。

## Accessibility contract

- **AR1 — 菜单语义。** 弹出层不是模态对话框；触发器播报一个弹出菜单；条目是一个具名 `menu` 内的 `menuitem`。
- **AR2 — 键盘。** FR5 的按键遵循 APG 菜单模式。
- **AR3 — 抽屉展开控件。** 抽屉触发器暴露其展开状态并控制该分组；折叠的条目不可访问。

## Design relationships

| Anatomy or state | Design requirement   | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------- | ------------------------ | -------------- | ------------------ |
| Trigger          | 带箭头的栏条目样式。 | 当前源码与公开文档       | 突出           | FR1                |
| Menu item        | 图标框、标题、描述。 | 当前源码与公开文档       | 辅助           | FR4                |
| Drawer group     | 带缩进条目的展开行。 | 当前源码                 | 辅助           | FR7                |

`TopNavMenu.doc.mjs` 未声明自己的 anatomy，因此不记录 anatomy 与主题的映射。

## Family and system relationships

- `family:overlay-dismissal` 拥有本组件弹出层的 Escape 与关闭请求排序。
- `family:navigation-destinations` 拥有本组件渲染的每个目标的接受/拦截决策。
- `component:TopNav` 提供渲染模式与插槽。
- `architecture:public-component-api` INV5 与 INV7 管辖转发与处理器组合。
- `architecture:interaction-modality` 提供共享的焦点指示器。

## Verification map

| Contract            | Verification                                                                                                | Representative states                      | Mutation or failure expectation                                  | Audit section                    |
| ------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------- | -------------------------------- |
| FR1, FR3, AR1       | `TopNavMenu.test.tsx` 触发器与语义测试                                                                      | 关闭与打开                                 | 包一层 dialog 或弹出层类型错误会失败。                           | `audit:TopNavMenu/accessibility` |
| FR4, FR5, AR2       | `TopNavMenu.test.tsx` 键盘测试                                                                              | 方向键、回绕、输入即定位、Enter、Escape    | 多出 tab 停靠点或丢失激活会失败。                                | `audit:TopNavMenu/accessibility` |
| FR6                 | `TopNavMenu.test.tsx` 透传与自有处理器测试                                                                  | 栏与抽屉触发器                             | 内置处理器被替换或 prop 丢失会失败。                             | `audit:TopNavMenu/behavior`      |
| FR7, FR8, FR10, AR3 | `TopNavMenu.test.tsx` 抽屉测试，包括仅有 `onClick` 的条目的原生按钮                                         | 折叠与展开；一个仅有 `onClick` 的抽屉条目  | 折叠条目可访问或缺少焦点环会失败。                               | `audit:TopNavMenu/behavior`      |
| Shared menu focus   | `useMenuHover.test.tsx`                                                                                     | 悬停打开、点击打开、Escape、Enter 与 Space | 悬停时移动焦点、点击时未移入焦点，或 Escape 时未返回焦点会失败。 | `audit:TopNavMenu/accessibility` |
| FR11                | `TopNavMenu.test.tsx` 动作分组测试套件（触摸与鼠标滑动）                                                    | 跨条目触摸与鼠标滑动；不可拖动的链接条目   | 移除该采用会导致滑动测试失败。                                   | —                                |
| RTL relation        | 在 `TopNavMenu / Default`（菜单已打开）上的 RTL 审查精选 D4 目标（`apps/storybook/rtl-audit/targets.json`） | 一个打开的起始对齐菜单面板；LTR 与 RTL     | 面板在 RTL 下未移到页面镜像侧会失败 D4。                         | `audit:TopNavMenu/i18n-rtl`      |

从源码读取、尚无聚焦测试：菜单之后的视觉隐藏关闭按钮（FR3）；栏条目的原生 `<a>`、图标框与描述（FR4）；转发的 `ref`、`top-nav-menu` 目标，以及栏与抽屉箭头的转向（FR1、FR7）；抽屉分组在展开过程中的裁剪与其高度动画（FR7）；调用方 `preventDefault()` 的取消（FR6）；带 `delay` 与 `hideDelay` 的悬停打开与关闭（FR2）；插槽对齐（FR3）；FR9；以及 FR10 中栏触发器与条目的部分。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 栏菜单条目是否应像抽屉条目那样通过 `LinkProvider` 链接渲染？**（`human-api`）目前栏条目渲染原生 `<a>`，抽屉条目渲染 `LinkProvider` 链接（FR4、FR8）。

## Content boundary

本文件不重复使用方 prop 表、示例或 popover 机制。它链接到它们的拥有者。
