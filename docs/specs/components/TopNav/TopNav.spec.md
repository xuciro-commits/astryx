---
schema_version: 3
template_version: 7
kind: component
id: component:TopNav
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNav.test.tsx,
    packages/core/src/TopNav/__tests__/TopNavMobileLongHeading.a11y.chromium.spec.ts,
    packages/core/src/TopNav/__tests__/TopNavMobileLongHeading.interaction.browser.spec.ts,
    packages/core/src/TopNav/__tests__/TopNavTextSize.interaction.browser.spec.ts,
    packages/core/src/AppShell/AppShell.test.tsx,
    apps/storybook/stories/TopNav.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# TopNav component contract

## Contract at a glance

| 区域             | 契约                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约         | 带 `heading`、`startContent`（别名 `children`）、`centerContent`、`endContent` 和 `label` 的 `TopNav`；目标 `top-nav`，带一个 `mode` 状态。                                                |
| 行为             | 一个带名称的导航地标，包含起始区、可选的中间区和结束区。在 AppShell 的移动端布局中，它变成一个紧凑条（标题、结束内容，以及在自动开关开启时的一个抽屉开关），其起始内容和中间内容移入抽屉。 |
| 对最终用户的影响 | 屏幕阅读器用户会得到一个有名称的导航地标；手机宽度的用户仍能看到产品标题、结束控件，以及在自动开关开启时的一个抽屉开关，而导航项则移入抽屉。                                               |
| 对构建者的影响   | 无。调用方填充槽位；接受 `children`，因此导航项不会被丢弃。                                                                                                                                |
| 兼容性/就绪度    | 记录已发布的行为；没有 prop、默认值、目标或导出的改动。存在两处实现缺口（见当前状态影响）。                                                                                                |
| 审查检查项       | 在 `startContent` 缺失时丢弃 `children`、在存在 `centerContent` 时丢弃三区布局、地标无名称，或在存在抽屉内容且自动开关开启时移动端条隐藏该开关（FR5）—— 这些情况均应否决。                 |
| 治理规则         | `component:AppShell` FR9–FR10 选择渲染模式；MobileNav 拥有抽屉对话框；`architecture:component-theming-surface`。                                                                           |

本表是审查用的投影；下方正文具有权威性。

## Intent

TopNav 是应用页眉的水平导航条。它拥有该条的地标、其槽位布局，以及该条及其内容在 AppShell 所选择的三种模式（完整条、移动端条和抽屉）中各自的渲染方式。使用方的用法见 `TopNav.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；没有公共 prop、默认值、目标或导出的改动
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档和发布说明。

## Current-state impact

- **调用方 props 可以替换地标的角色和名称。** 其他 DOM 属性在 `role` 和 `aria-label` 之后展开到 `<nav>` 上，因此调用方的 `role` 或 `aria-label` 会替换它们。`architecture:public-component-api` INV5 防止组件拥有的可访问性被意外覆盖。
- **较宽的结束内容会使中间区偏移。** 结束内容宽于其份额时会加宽结束区域，并将中间内容向起始方向移动。

## Ownership boundary

**拥有**

- 导航地标及其默认名称（FR1、AR1）。
- 槽位解析以及 flex 和三区布局（FR2–FR4）。
- 该条自身的移动端条和抽屉渲染（FR5、FR6）。
- `<nav>` 的定位和样式输入（FR8、FR9）。
- 每个后代所处的槽位，TopNav 菜单据此读取弹出层对齐信息（FR7）。

**不拥有 / 非目标**

- 每个条目在每种模式下的渲染 —— 由 `component:TopNavItem`、`component:TopNavMenu`、`component:TopNavMegaMenu`、`component:TopNavMegaMenuItem`、`component:TopNavMegaMenuFeaturedCard` 和 `component:TopNavHeading` 拥有。
- 适用哪种渲染模式以及何时适用 —— 由 `component:AppShell` 拥有。
- 抽屉对话框、其页眉、焦点行为和关闭 —— 由 MobileNav 拥有；开关是 MobileNav 的 `MobileNavToggle`。
- 导出的 `TopNavRenderContext` 和 `useTopNavRenderMode` —— 一个未纳入契约的模块；本记录只涵盖 TopNav 如何响应该模式。

## Public concepts

| 概念     | 封闭取值或状态                    | 含义                           | 按变体/方向/状态的可用性         | 默认值    | 拥有者               | 稳定性 | 无效值行为                       |
| -------- | --------------------------------- | ------------------------------ | -------------------------------- | --------- | -------------------- | ------ | -------------------------------- |
| 渲染模式 | `default`、`mobile-bar`、`drawer` | 完整条、紧凑手机条或抽屉内容。 | 由 AppShell 或导出的上下文设置。 | `default` | `component:AppShell` | 稳定   | TypeScript 拒绝其他值。          |
| 槽位     | `start`、`center`、`end`          | 后代所渲染的区域。             | `default` 模式。                 | `start`   | `component:TopNav`   | 稳定   | 调用方不可设置；由 TopNav 设置。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                              | 依据           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 在 `default` 和 `mobile-bar` 模式下，TopNav 渲染一个 `<nav role="navigation">`，其名称来自 `label`；当 `label` 省略时，来自已翻译的 `@astryx.topNav.landmarkLabel`（“Top navigation”）。它携带 `top-nav`、转发的 `ref` 以及其他 DOM 属性；`mobile-bar` 会添加 `data-mode="mobile-bar"`。            | 当前源码和测试 |
| FR2 | `startContent` 优先于 `children`；仅当 `startContent` 为 `null` 或 `undefined` 时，`children` 才作为起始内容渲染。                                                                                                                                                                                  | 当前源码和测试 |
| FR3 | 没有 `centerContent` 时，该条是一行 flex：标题然后是行内起始处的起始内容，结束内容被推到行内结束处。任何区域都不与另一区域重叠；当各区域无法容入一行时，该条换行，结束内容移到第二行，而宽于整条的区域会换行自身的条目（`spec:AST-102` FR4）。                                                      | 当前源码和测试 |
| FR4 | 有 `centerContent` 时，该条有三个区域，在起始区和结束区各自容入其等分的一行份额时使中间内容居中；当它们无法容入一行时，该条按 FR3 所述换行。                                                                                                                                                        | 当前源码和测试 |
| FR5 | `mobile-bar` 模式先渲染标题，然后是结束内容，并且在存在抽屉内容且自动开关开启时，在行内结束处渲染移动端导航开关。起始内容和中间内容不渲染。标题首先让出宽度，使结束内容和开关留在屏幕上；纯文本标题保持在一行并以省略号结尾。当存在起始或中间内容，或 AppShell 传入侧边导航内容时，抽屉内容即存在。 | 当前源码和测试 |
| FR6 | `drawer` 模式渲染一个 MobileNav，其页眉为 `heading`，其主体先是起始内容然后是中间内容，呈垂直列表；当条目和侧边导航内容都存在时有一个分隔线，然后是 AppShell 传入的任何侧边导航内容。两者都没有时，TopNav 不渲染任何内容。                                                                          | 当前源码和测试 |
| FR7 | 在 `default` 模式下，TopNav 告诉起始、中间和结束后代它们位于哪个槽位。                                                                                                                                                                                                                              | 当前源码       |
| FR8 | `<nav>` 本身不是定位元素，因此不创建层叠上下文。                                                                                                                                                                                                                                                    | 当前源码和测试 |
| FR9 | 在 `default` 和 `mobile-bar` 模式下，`className`、`style` 和 `xstyle` 在组件样式之后合并到 `<nav>` 上。                                                                                                                                                                                             | 当前源码       |

### Allowed variation

- **AV1 — 槽位内容。** 调用方内容可以变化，而不会成为 TopNav 的解剖结构。
- **AV2 — 主题样式。** 主题可按模式重新设置 `top-nav` 的样式，而不改变区域、顺序或地标。

### Representative states

| 状态                   | 必需的不变式                                  | 允许的变化     |
| ---------------------- | --------------------------------------------- | -------------- |
| 标题和条目，无中间区   | 一行 flex；结束内容位于行内结束处。           | 间隙和内边距。 |
| 存在中间内容           | 三个区域；在每侧容入其份额时中间居中（FR4）。 | 列内容。       |
| 带长标题的移动端条     | 自动开关开启时，开关和结束内容留在条内。      | 标题截断。     |
| 无抽屉内容的移动端条   | 无开关。                                      | —              |
| 带条目和侧边导航的抽屉 | 条目、分隔线、侧边导航内容。                  | 条目模式。     |

### Transformation and precedence order

- **ORD1 — 起始内容。** `startContent`，然后是 `children`（FR2）。

### Performance and resources

- **PR1 — 不测量。** TopNav 不观察尺寸，也不注册监听器。

## Accessibility contract

- **AR1 — 具名地标。** 每个渲染出的条都是一个具有可访问名称的导航地标（FR1）。
- **AR2 — 开关可到达。** 在存在抽屉内容且自动开关开启的 `mobile-bar` 模式下，即使标题很长，开关也完全留在屏幕上，并且在打开的抽屉内部，关闭按钮完全留在视口内。

## Design relationships

| 解剖结构或状态 | 设计要求                                        | 表示权威           | 层级角色 | 组件契约     |
| -------------- | ----------------------------------------------- | ------------------ | -------- | ------------ |
| 产品图标和名称 | 行内起始处的标题槽位。                          | 当前源码和公共文档 | 显著     | FR3, FR5     |
| 导航条目       | 起始或中间内容。                                | 当前源码和公共文档 | 显著     | FR2–FR4, FR6 |
| More 菜单      | 由调用方放置的菜单；TopNav 自身不渲染任何菜单。 | 公共文档           | 支撑     | FR2          |
| Flex 区域      | 用于搜索、操作或用户资料的结束内容。            | 当前源码和公共文档 | 支撑     | FR3, FR5     |

尚未记录解剖结构-主题映射；该区块在迁移期间是可选的。将 TopNav 的四个解剖部分映射到该家族的七个目标——其中某个部分属于子组件时按委托处理——推迟进行。每个家族组件的记录都会命名其自己的目标。

## Family and system relationships

- `component:AppShell` 选择渲染模式并传入侧边导航内容。
- MobileNav 渲染 TopNav 填充的抽屉。
- `architecture:component-theming-surface` 拥有目标资格。

## Verification map

| 契约              | 验证                                                                                            | 代表性状态                                          | 变异或失败预期                                                                                     | 审计章节                     |
| ----------------- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1, AR1          | `TopNav.test.tsx` 地标测试                                                                      | 默认和移动端条；默认和自定义名称                    | 缺少 role 或名称即失败。                                                                           | `audit:TopNav/accessibility` |
| FR2–FR4, FR8      | `TopNav.test.tsx` 槽位测试                                                                      | 每个槽位；所有槽位；无起始/结束的中间区             | 槽位被丢弃、优先级错误，或 nav 被定位，即失败。                                                    | `audit:TopNav/layout`        |
| FR3, FR4 换行     | `TopNavTextSize.interaction.browser.spec.ts` 在 1280 px 以及 100%、200% 和 250% 默认字号下      | Full Example；Centered With Start Content           | 导航条目被另一区域覆盖、页面横向滚动，或在 100% 下布局改变，即失败。                               | `audit:TopNav/layout`        |
| FR5, FR6          | `AppShell.test.tsx` 移动端套件                                                                  | 仅标题；条目；带侧边导航的条目                      | 开关缺失或条目重复，即失败。                                                                       | `audit:TopNav/behavior`      |
| AR2               | `TopNavMobileLongHeading.a11y.chromium.spec.ts`                                                 | 手机宽度下的长标题                                  | 开关或关闭按钮离开视口。                                                                           | `audit:TopNav/accessibility` |
| FR5, AR2 手机宽度 | `TopNavMobileLongHeading.interaction.browser.spec.ts` 在 390、375 和 320 px，Chromium 和 WebKit | Long Heading On Mobile；Long Text Heading On Mobile | 标题超过一行或没有省略号、徽标、结束控件或开关位于条外或尺寸改变、条更高，或页面横向滚动，即失败。 | `audit:TopNav/layout`        |
| RTL 关系          | RTL 审计策展的 D2 目标（`apps/storybook/rtl-audit/targets.json`）针对 `TopNav / Full example`   | 标题和第一个导航条目；LTR 和 RTL                    | 标题不在导航条目的行内起始处，即未通过 D2。                                                        | `audit:TopNav/i18n-rtl`      |

以下内容读自源码，尚无针对性的测试：移动端条的部件顺序（FR5）；抽屉的 `heading` 页眉（FR6）；到达 `<nav>` 的其他 DOM 属性（FR1）；自动开关的条件（FR5）；`drawer` 模式下无内容时不渲染任何内容（FR6）；`top-nav` 目标及其 `mode` 状态（FR1）；默认字号下的 flex 和三区布局几何（FR3、FR4）；起始和中间内容在移动端条中不渲染（FR5）；抽屉的内容顺序和分隔线（FR6）；FR7；以及 FR9。

## Decision log

未记录任何组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例、条目行为或抽屉的对话框行为。它链接到它们的所有者。
