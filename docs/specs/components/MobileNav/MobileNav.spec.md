---
schema_version: 3
template_version: 7
kind: component
id: component:MobileNav
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/MobileNav/MobileNav.test.tsx,
    packages/core/src/MobileNav/MobileNavToggle.test.tsx,
    packages/core/src/MobileNav/MobileNavFocus.test.tsx,
    packages/core/src/MobileNav/MobileNavCloseEdgeCases.test.tsx,
    packages/core/src/MobileNav/MobileNavCloseVisibility.test.tsx,
    packages/core/src/MobileNav/MobileNavCloseTiming.test.ts,
    packages/core/src/MobileNav/MobileNavEntryAnimation.test.tsx,
    packages/core/src/MobileNav/MobileNavReopen.test.tsx,
    packages/core/src/MobileNav/MobileNavScrollbarGutter.test.tsx,
    packages/core/src/MobileNav/MobileNavPinchZoom.a11y.chromium.spec.ts,
    packages/core/src/Layer/layerDismissalFamilies.test.tsx,
    packages/core/src/MobileNav/__tests__/MobileNavWidth.a11y.chromium.spec.ts,
    packages/core/src/MobileNav/__tests__/MobileNavTouchPresentation.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
    packages/core/src/__tests__/modalBackdrop.test.tsx,
    packages/core/src/__tests__/ModalBackdrop.a11y.browser.spec.ts,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: [design:bidirectionality, design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-094/FR13, spec:AST-094/FR35]
---

# MobileNav component contract

## Contract at a glance

| Area            | Contract                                                                                                                                                                                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约        | `MobileNav` 提供 `isOpen`、`onOpenChange`、`header`、`width`（320）、`side`（`start`、`end`、`auto`；默认 `auto`）、`label` 和 `children`；目标 `mobile-nav` 带一个 `side` 状态；`MobileNavToggle` 提供 `label` 和 `children`。                           |
| 行为            | 一个模态原生 dialog，带有从某条行内边缘滑入的抽屉、含 Close 按钮的头部，以及可滚动的内容区域。Escape、背景遮罩和 Close 会请求关闭；抽屉开始滑出期间 dialog 保持打开，并在滑出过程中关闭（FR5），随后焦点返回打开者。                                      |
| 最终用户影响    | 手机用户在抽屉中打开导航：焦点被限制在抽屉内，其后的页面被锁定，可以用任何惯常方式关闭，并落回当初打开它的控件。                                                                                                                                          |
| 构建者影响      | 无。                                                                                                                                                                                                                                                      |
| 兼容性/就绪状态 | 记录已交付的行为；无公开变更。六处实现差距：自动侧选择使用物理位置、reduced motion 下仍有动画、自建顶层、关闭保持和背景遮罩、调用方的 `id` 会断开 Toggle，以及调用方的 `aria-label` 与 `onCancel` 被丢弃（见 Current-state impact）。                     |
| 审查检查        | 拒绝非模态抽屉、在滑出动画运行前就隐藏抽屉的关闭、焦点未返回到仍处于连接的打开者、抽屉内部点击背景遮罩即关闭，以及在未启用的 AppShell 移动端布局之外渲染的 Toggle。                                                                                       |
| 治理规则        | `family:overlay-dismissal`; `architecture:layer-runtime` INV14; `component:AppShell` FR10–FR13; `design:bidirectionality` DR7; `design:reduced-motion` DR1–DR3; `architecture:public-component-api` INV5, INV7; `architecture:component-theming-surface`. |

本表是审查用的投影；下方正文具有权威性。

## Intent

MobileNav 以模态抽屉呈现移动端导航，并导出一个感知 AppShell 的 Toggle 按钮，用于打开和关闭它。它拥有抽屉的 dialog、放置位置、动效、关闭时机、焦点返回、页面滚动锁定，以及 Toggle 与抽屉之间的关联。使用方用法见 `MobileNav.doc.mjs`。

## Compatibility and migration

- 保留已发布默认值：`yes`
- 兼容性类别：记录已交付的行为；运行时、DOM、样式、目标、别名和公开 API 均保持不变
- 受控/非受控行为：`isOpen` 与 `onOpenChange` 控制抽屉；未提供时，它跟随外层 AppShell 的抽屉状态（FR2）
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **自动侧选择跟随物理位置。** 当 `side="auto"` 时，中心位于视口左半边的触发器会在行内起点打开抽屉，否则在行内终点。在从右到左的布局中，行内起点是右边缘，因此每个触发器都会把抽屉开在远端。`design:bidirectionality` DR7 要求分层表面保持其与触发器的起点与终点关系。
- **调用方的 `id` 会断开 Toggle。** 调用方的 `id` prop（即便是 `undefined`）会替换 dialog 上的抽屉 id，因此在 AppShell 内部，Toggle 的 `aria-controls` 不指向任何元素，破坏了 `component:AppShell` FR13 和 AR3。`architecture:public-component-api` INV5 要求组件自有的无障碍信息不被意外覆写。
- **调用方的 `aria-label` 被丢弃。** MobileNav 自己的名称（FR10）替换了 dialog 上调用方的 `aria-label`。`architecture:public-component-api` INV5 要求受支持的 ARIA 输入到达元素。
- **调用方的 `onCancel` 永不执行。** MobileNav 自己的 cancel 处理器替换了 dialog 上调用方的 `onCancel`。`architecture:public-component-api` INV5 和 INV7 要求受支持的事件输入到达元素并可组合。
- **MobileNav 自建顶层、关闭保持与背景遮罩。** MobileNav 自己调用 `showModal()`，用自己的计时器在关闭过程中保持 dialog 打开，并自行绘制背景遮罩的渐变。`architecture:layer-runtime` INV14 要求层使用运行时的顶层挂载、呈现保持和背景遮罩着色，而不是自建。
- **reduced motion 下的动效。** 在 reduced motion 下，Drawer 的滑动和背景遮罩的渐变仍会运行 0.01 秒，而不是在精细指针下立即变化、在触摸下交叉淡变。`design:reduced-motion` DR2 和 DR3 不允许位移，且对精细指针不允许任何动画属性。

## Ownership boundary

**拥有**

- Navigation 覆盖层及其当前的 `mobile-nav` 目标。
- Drawer 的放置与动效、稳定的 Header 与 Content 区域，以及 AppShell 状态、MobileNav 与 MobileNavToggle 之间的连接（FR1–FR12）。
- 背景遮罩的外观（FR13）。
- 抽屉的导航地标（FR14）。
- 两个导出组件的规范解剖结构。`component:MobileNav` 是父所有者；MobileNavToggle 没有自己的使用方文档，也没有单独的组件契约。

**不拥有 / 非目标**

- Close 与 Toggle 按钮的表面 —— 委托给 `component:Button`。
- 由调用方提供的 Header 或导航内容。
- 为绘制出的 Drawer、Header 或 Content 区域提供公开目标；不存在这样的目标。
- AppShell 的响应式策略、抽屉何时渲染，以及其关闭保持 —— 由 `component:AppShell` 拥有。
- 共享的 Escape 与关闭请求顺序 —— 由 `family:overlay-dismissal` 拥有；共享的层托管 —— 由 `architecture:layer-runtime` 拥有。

## Public concepts

| Concept | Closed values or states | Meaning                                                 | Availability by variant/orientation/state | Default | Owner                 | Stability | Invalid-value behavior    |
| ------- | ----------------------- | ------------------------------------------------------- | ----------------------------------------- | ------- | --------------------- | --------- | ------------------------- |
| Side    | `start`, `end`, `auto`  | 抽屉进入时所处的行内边缘；`auto` 依据打开者的位置选择。 | 每次打开。                                | `auto`  | `component:MobileNav` | 稳定      | TypeScript 会拒绝其他值。 |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                           | Basis                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| FR1  | MobileNav 渲染一个原生 `<dialog>` Navigation 覆盖层，其中包含 Drawer，以及稳定的 Header、Close 按钮和可滚动的 Content 区域。该覆盖层带有 `mobile-nav` 与解析后的 `side`；Drawer、Header 和 Content 不携带任何 MobileNav 公开目标。                                                                                                                                  | 当前源码、文档与测试                                                 |
| FR2  | 给定 `isOpen` 与 `onOpenChange` 时以它们为准；否则抽屉读取并改变外层 AppShell 的抽屉状态。当存在 AppShell 的抽屉 id 时，dialog 使用它，否则使用自己的 id；调用方的 `id` 会替换其中任一（见 Current-state impact）。                                                                                                                                                 | 当前源码与测试                                                       |
| FR3  | 打开时调用 `showModal()`，并把当前聚焦元素记录为打开者；焦点在打开的抽屉内部落在何处，此处不作约定。打开期间，页面的滚动容器裁剪其溢出并保留其滚动条槽位：作用于根元素，或在 `<body>` 自行设置 overflow 而根元素保持 `visible` 时作用于 `<body>`。下拉刷新与页面回弹停止，因为模态之下的滚动锁会固定页面（`spec:AST-094` FR19）。关闭时释放这三项。                 | 当前源码与测试                                                       |
| FR4  | 原生 cancel 请求（Escape）经由共享的关闭栈路由，且仅当此抽屉位于最顶层时才请求关闭。在 Drawer 之外的覆盖层上点击会请求关闭；在内部点击则不会。由 `@astryx.mobileNav.closeNavigation` 命名的 Close 按钮会请求关闭。dialog 上调用方的 `onClick` 在背景遮罩检查之前运行；调用 `preventDefault()` 的那个 `onClick` 会取消该次背景遮罩关闭。                             | 当前源码与测试                                                       |
| FR5  | 收到关闭请求后，抽屉滑出，同时 dialog 保持打开，且 dialog 在其滑出过渡之内、并且不晚于请求后 250 ms 关闭（在 reduced motion 或过渡长度为零的情况下于下一个任务中关闭，绝不在发起该请求的那次提交中关闭）。在此之前重新打开会取消该关闭。卸载会关闭 dialog。dialog 关闭之后，滑出的剩余部分为惰性。                                                                  | 当前源码与测试                                                       |
| FR6  | 当 dialog 关闭时，若记录下的打开者仍处于连接状态且不是 document body，焦点返回给它；否则焦点保持原状。打断关闭的重新打开会保留最初的打开者。                                                                                                                                                                                                                        | 当前源码与测试                                                       |
| FR7  | 在没有 reduced-motion 偏好时，Drawer 从其解析出的行内边缘、从屏幕外进入屏幕内，背景遮罩从透明渐显。在 reduced motion 下，动效遵循 `design:reduced-motion` DR1–DR3（Current-state impact 记录了当前的不足）。该覆盖层裁剪屏幕外的抽屉，但不成为滚动容器，并允许双指缩放。                                                                                            | 当前源码与测试                                                       |
| FR8  | `side="start"` 或 `"end"` 设定边缘。`side="auto"` 必须保持抽屉与其打开元素之间的起点与终点关系（`design:bidirectionality` DR7）。实现差距：它在每次打开时依据聚焦元素在视口中的物理半边解析（左半边取 `start`，否则取 `end`）；打开时若无元素聚焦，则保持上一次的取值，而在任何一次打开之前其为 `end`。                                                             | 当前源码                                                             |
| FR9  | Drawer 宽度为 `width` 像素（默认 320），最大不超过视口的 85%，因此其旁始终留有页面的一条。                                                                                                                                                                                                                                                                          | 当前源码与测试                                                       |
| FR10 | dialog 的名称取自 `label`，否则取字符串形式的 `header`，否则取 `@astryx.mobileNav.navigation`；调用方的 `aria-labelledby` 优先于这三者。字符串形式的 `header` 渲染为二级标题；其他 header 内容按给定内容渲染。                                                                                                                                                      | 当前源码与测试                                                       |
| FR11 | MobileNavToggle 仅在 AppShell 报告其移动端布局且移动导航已启用时渲染。它是一个仅图标的幽灵 Button，默认由 `@astryx.mobileNav.toggle.open` 命名，除非 `children` 替换它，否则带一个菜单图标；它切换抽屉、暴露 `aria-expanded`，其 `aria-controls` 携带 AppShell 的抽屉 id，该 AppShell 内的 MobileNav 会把该 id 应用到自己的 dialog 上，除非调用方的 `id` 将其替换。 | 当前源码、文档与测试                                                 |
| FR12 | MobileNav 将其 `ref`、`data-testid`、其他 DOM props、`className`、`style` 和 `xstyle` 转发到 dialog，但其自身的 `aria-label`（FR10）会替换调用方的对应值（见 Current-state impact），调用方的 `onCancel` 永不执行（见 Current-state impact），且调用方的 `id` 会替换它的 id（FR2）。                                                                                | 当前源码与测试                                                       |
| FR13 | MobileNav 的背景遮罩在所有指针下都是主题的 `--color-overlay` 变暗，不加模糊；在强制颜色模式下，抽屉保留可见边缘。                                                                                                                                                                                                                                                   | 所有者决策，2026-10-25：该覆盖层在所有指针下均由主题控制且不加模糊。 |
| FR14 | Content 区域是一个与 dialog 同名的导航地标（FR10），因此依靠地标导航的人在手机上找到抽屉的链接，就像在宽屏上找到 SideNav 的链接一样。填充它的内容——SideNav 条目或 TopNav 的抽屉内容——都位于这一个地标之内。                                                                                                                                                         | 所有者决策 DEC-1                                                     |

### Allowed variation

- **AV1 — Drawer 边缘。** Drawer 可以通过显式或由触发器派生的侧行为，解析为逻辑起点或终点。
- **AV2 — Header 内容。** Header 可以包含经 Heading 渲染的字符串、调用方提供的内容，或仅有 Close 按钮。
- **AV3 — 导航内容。** 调用方提供的导航内容可以变化，而不成为 MobileNav 拥有的解剖结构。
- **AV4 — Toggle 是否存在。** 在已启用的 AppShell 移动端上下文之外，Toggle 按钮不出现。

### Representative states

| State                  | Required invariant                                                          | Allowed variation                  |
| ---------------------- | --------------------------------------------------------------------------- | ---------------------------------- |
| 独立抽屉               | Navigation 覆盖层包含 Drawer、Header、Close 按钮和 Content。                | 调用方控制打开状态，并可选择边缘。 |
| AppShell 抽屉          | 同一套抽屉解剖结构消费 AppShell 的移动端状态。                              | Header 与导航内容仍归调用方所有。  |
| AppShell 移动端 Toggle | Toggle 按钮控制并引用当前抽屉。                                             | 自定义按钮内容可以替换菜单字形。   |
| 非移动端/已禁用的宿主  | Toggle 按钮不渲染。                                                         | MobileNav 仍归父契约所有。         |
| 关闭中                 | 抽屉开始滑出期间 dialog 保持打开，并在滑出过程中关闭（FR5）；随后焦点返回。 | 时长由主题决定。                   |
| 关闭中途重新打开       | 待处理的关闭被取消；焦点留在抽屉中。                                        | —                                  |

### Transformation and precedence order

- **ORD1 — 打开状态。** 先 `isOpen`，再 AppShell 的抽屉状态。
- **ORD2 — 名称。** 依次为调用方的 `aria-labelledby`、`label`、字符串 `header`，最后是已翻译的默认值。
- **ORD3 — 关闭延迟。** 由 dialog 的滑出过渡和 250 ms 共同约束；在 reduced motion 或零长度过渡下为下一个任务。

### Performance and resources

- **PR1 — 清理。** 待处理的关闭计时器在重新打开和卸载时清除，页面滚动容器的裁剪、过度滚动停止与滚动条槽位在关闭和卸载时释放。

## Accessibility contract

- **AR1 — 模态 dialog。** 打开的抽屉是一个带无障碍名称的模态原生 dialog（FR3、FR10）；其后的页面为惰性。
- **AR2 — 焦点返回。** FR6。
- **AR3 — Toggle 的接线。** FR11 的 `aria-expanded` 与 `aria-controls`。
- **AR4 — 缩放。** 抽屉打开期间双指缩放始终可用。
- **AR5 — 导航地标。** FR14。

## Design relationships

| Anatomy or state  | Design requirement                                | Representation authority | Hierarchy role | Component contract |
| ----------------- | ------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| Navigation 覆盖层 | 承载模态导航层及其背景遮罩。                      | 当前源码与公开文档       | 支撑性         | FR1, FR4, FR13     |
| Drawer            | 绘制滑动的移动端导航表面。                        | 当前源码与公开文档       | 突出           | FR1, FR7–FR9       |
| Header            | 将可选的 header 内容与常驻的 Close 按钮一同排布。 | 当前源码与公开文档       | 支撑性         | FR1, FR10          |
| Content           | 为调用方提供的导航内容提供滚动区域。              | 当前源码与公开文档       | 突出           | FR1                |
| Close 按钮        | 关闭当前抽屉。                                    | `component:Button`       | 支撑性         | FR4                |
| Toggle 按钮       | 打开或关闭 AppShell 拥有的移动端抽屉状态。        | `component:Button`       | 支撑性         | FR11               |

Drawer 是主要的绘制表面，但当前唯一的 MobileNav 目标位于全视口 dialog 覆盖层上。它的 `none` 处置是一个事实性的可达性差距，而非“Drawer 必须保持不可主题化”的决策。Header 和 Content 同样没有当前的本地目标。Close 与 Toggle 保留 Button 的所有权。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Navigation overlay": {"target": "mobile-nav"},
  "Drawer": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the painted drawer panel"
    }
  },
  "Header": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the stable header row"
    }
  },
  "Content": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the scrollable content region"
    }
  },
  "Close button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Toggle button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格判定、目标映射、委托以及事实性的 `none` 处置。
- `architecture:layer-runtime` INV14 将顶层挂载、关闭请求投递、呈现保持、共享的退出副本和背景遮罩着色交给运行时；MobileNav 决定何时关闭以及如何呈现，包括其抽屉动效和背景遮罩的颜色（Current-state impact 记录了当前的不足）。
- `design:reduced-motion` DR1–DR3 治理 reduced motion 下的抽屉动效；`architecture:public-component-api` INV5 和 INV7 治理调用方 `id` 与 `onCancel` 的差距。
- `family:overlay-dismissal` 拥有共享的 Escape 与平台关闭顺序，并将 MobileNav 记录为采用方。
- `component:AppShell` 决定抽屉何时渲染，并在关闭过程中使其保持可见。
- `design:bidirectionality` DR7 治理自动侧选择的差距。

## Verification map

| Contract             | Verification                                                                                                                       | Representative states                                            | Mutation or failure expectation                                                                                                                   | Audit section                   |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1, FR2, FR10, FR12 | `MobileNav.test.tsx`                                                                                                               | 打开与关闭；字符串 header 与无 header；独立抽屉上的调用方 `id`   | 丢失 dialog、名称、Close 或转发的 props 即失败。                                                                                                  | `audit:MobileNav/anatomy`       |
| FR2, FR3, FR4        | `MobileNav.test.tsx`; `MobileNavCloseEdgeCases.test.tsx`; `MobileNavScrollbarGutter.test.tsx`; `MobileNavRootScrollClaim.test.tsx` | Escape、背景遮罩、内容点击、Close                                | 错误的关闭来源或残留的滚动锁即失败。                                                                                                              | `audit:MobileNav/behavior`      |
| FR4                  | `layerDismissalFamilies.test.tsx` 中的 MobileNav 用例                                                                              | 在必需的 Dialog 之上按 Escape；位于最顶层与不在最顶层时的 cancel | 不在最顶层时关闭，或位于最顶层时不关闭，即失败。                                                                                                  | `audit:MobileNav/behavior`      |
| FR5, ORD3            | `MobileNavCloseVisibility.test.tsx`; `MobileNavCloseEdgeCases.test.tsx`; `MobileNavCloseTiming.test.ts`                            | 关闭、reduced motion、重新打开、卸载、250 ms 上限                | 在滑出之前关闭，或 dialog 卡住，即失败。                                                                                                          | `audit:MobileNav/behavior`      |
| FR5                  | `MobileNavTouchPresentation.a11y.chromium.spec.ts`（关闭之后的滑出）                                                               | 已关闭的 dialog，抽屉仍在滑出；打开的抽屉                        | 点按落到正在离场的抽屉上，或关闭后浏览器的无障碍树仍暴露该 dialog 或其链接，即失败。                                                              | `audit:MobileNav/behavior`      |
| FR6, AR2             | `MobileNavFocus.test.tsx`                                                                                                          | 独立、AppShell、Escape、已移除的打开者                           | 焦点未返回，或返回过早，即失败。                                                                                                                  | `audit:MobileNav/accessibility` |
| FR7                  | `MobileNavEntryAnimation.test.tsx`                                                                                                 | 起点与终点边缘                                                   | 缺少起始样式，或覆盖层成为滚动容器，即失败。                                                                                                      | `audit:MobileNav/behavior`      |
| FR11, AR3            | `MobileNavToggle.test.tsx`; `MobileNavReopen.test.tsx`                                                                             | 已关闭、打开、重新打开                                           | 展开状态或 id 关联损坏即失败。                                                                                                                    | `audit:MobileNav/accessibility` |
| AR4                  | `MobileNavPinchZoom.a11y.chromium.spec.ts`                                                                                         | 触摸视口上打开的抽屉                                             | 双指缩放被阻止即失败。                                                                                                                            | `audit:MobileNav/accessibility` |
| FR9                  | `MobileNav.test.tsx` 的抽屉宽度上限测试；`MobileNavWidth.a11y.chromium.spec.ts`                                                    | 窄视口上的默认与较宽 `width`                                     | 抽屉宽于视口的 85% 即失败。                                                                                                                       | `audit:MobileNav/behavior`      |
| FR14                 | 用 SideNav 条目和 TopNav 的抽屉内容对打开的抽屉做 Chromium 无障碍树检查                                                            | 来自 SideNav 抽屉模式与来自 TopNav 抽屉的抽屉                    | 树中没有导航地标、地标未命名、名称与 dialog 不同，或出现两个嵌套地标，即失败（`spec:AST-009` FR3：计算角色与名称需要无障碍树证据）                | `audit:MobileNav/accessibility` |
| Theming anatomy map  | `scripts/check-knowledge.mjs`; `themingTargets.test.ts`                                                                            | 规范的父解剖结构与当前目标                                       | 缺失、多余、带前缀、过时或重复分配的映射会使仓库校验失败。                                                                                        | `audit:MobileNav/theming`       |
| RTL relation         | `MobileNav / Default`（抽屉已打开）上的 RTL 审计策展 D4 目标（`apps/storybook/rtl-audit/targets.json`）                            | 打开的抽屉；LTR 与 RTL                                           | 在 RTL 下抽屉未移动到页面的镜像一侧，即 D4 失败。证据差距：该 story 将其打开者居中，因此文档所述的 `side="auto"` 远端 RTL 抽屉（FR8）未被观察到。 | `audit:MobileNav/i18n-rtl`      |
| FR13                 | 在 Chromium 与 WebKit 中的 `modalBackdrop.test.tsx`; `ModalBackdrop.a11y.browser.spec.ts`                                          | 手机宽度下的手指；桌面宽度下的鼠标；任一指针下的强制颜色         | 在任一宽度下背景遮罩出现 `backdrop-filter`，或在强制颜色下没有可见边缘，即失败。                                                                  | `audit:MobileNav/theming`       |

从源码读取、尚无专门测试：

- FR1：彼此独立的 Drawer、Header 和 Content 元素，以及带 `side` 状态的 `mobile-nav` 目标。
- FR2 与 FR11：AppShell 之外 dialog 自己的 id，以及 AppShell 内部调用方 `id` 替换 AppShell 抽屉 id 的行为。
- FR4：调用方 `onClick` 在背景遮罩检查之前运行，以及其 `preventDefault()` 的取消效果。
- FR8 已交付的解析方式。
- FR10 与 ORD2：`label` prop、优先于名称的调用方 `aria-labelledby`、字符串 `header` 的二级标题，以及其他 header 内容按给定内容渲染。
- FR11：仅在已启用的 AppShell 移动端布局中渲染、仅图标的幽灵 Button、替换默认名称的 Toggle `label`、菜单图标，以及替换它的 `children`。
- FR12：转发的 `ref` 与 `xstyle`，以及被替换的调用方 `aria-label` 与 `onCancel`。

## Decision log

### DEC-1 — The drawer's links sit in a navigation landmark

**Reference:** `component:MobileNav/DEC-1`

**Decider:** `cixzhang`，等待所有者审查

依靠地标导航的手机用户在抽屉中找到导航，正如桌面用户找到 SideNav 的一样。抽屉是一个模态 dialog，而 dialog 不是地标，因此其 Content 区域承载该地标，并取用 dialog 的名称。一个地标覆盖填充抽屉的全部内容。

已否决：让抽屉不带地标，这样手机上的地标导航将完全找不到导航。

## Open questions

- **OQ1 — Drawer 是否应获得一个稳定的公开主题化目标？**（`human-api`）当前目标到达的是 Navigation 覆盖层，而不是主要的绘制抽屉表面；这是一个审计差距，而非已确定的意图。

## Content boundary

本文件不重复使用方 prop 表/示例、AppShell 响应式策略、共享层规则、当前审计结果或实现步骤。它链接到它们的所有者。
