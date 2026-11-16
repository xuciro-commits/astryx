---
schema_version: 3
template_version: 7
kind: component
id: component:LayoutContent
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layout/LayoutSlots.test.tsx,
    packages/core/src/Layout/__tests__/contentWidth.test.tsx,
    packages/core/src/Layout/__tests__/Layout.a11y.test.tsx,
    packages/core/src/Layout/__tests__/Layout.a11y.chromium.spec.ts,
    packages/core/src/Layout/__tests__/LayoutContentAudit.a11y.chromium.spec.ts,
    packages/core/src/hooks/useScrollRegionProps.test.tsx,
    packages/core/src/hooks/__tests__/scrollRegionName.a11y.chromium.spec.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:layout-regions]
design_specs: []
architecture:
  [
    architecture:container-padding,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-038]
---

# LayoutContent component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `children`、`isScrollable`、`padding`、`label`、`role`、根 `BaseProps`，以及根 `ref`。                                                   |
| 行为          | 主内容区域填满 Layout 的中部区域，默认滚动，并使其子元素与相邻区域和开放边缘保持内缩。                                                   |
| 最终用户影响  | 用户滚动主内容，而页眉、页脚和面板保持不动，滚动条位于内容区域的开放边缘。                                                               |
| 构建者影响    | 无：没有 API 变更；滚动区域在无需改动代码的情况下获得角色和名称（AR3）。                                                                 |
| 兼容性/就绪度 | 无 API 或默认值变更；滚动区域的角色和名称（AR3）属于补丁 `[fix]`。没有未决的实现缺口（当前状态影响）。                                   |
| 评审检查      | 拒绝在子元素外再套一层包裹、滚动条移离开放边缘、推断出的地标，以及进一步的发布值不匹配。                                                 |
| 治理规则      | `family:layout-regions` FR1、FR3、FR4、FR7、FR8、FR12；`architecture:container-padding`；`architecture:public-component-api` INV5–INV8。 |

本表是评审视角的投影；以下正文才是权威。

## Intent

LayoutContent 是调用方放置在 Layout 的 `content` 插槽中的主内容区域。它拥有该区域的滚动、内缩，以及调用方提供的地标语义；调用方拥有其内容。

使用方语法和示例属于 `LayoutContent.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes` —— 可滚动、自动内缩、无地标角色。
- 兼容类别：补丁。没有公开 prop、默认值、target 或样式输出的变更。当它滚动时，没有调用方 `role` 的区域会获得 `role="group"` 和 `aria-label`（DOM；AR3，在 `spec:AST-017` FR53 下属于 `[fix]`）。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

无。在单个起始面板旁，开放的 inline-end 边缘采用 Layout 边缘内缩，因此 Layout 上的 `padding={0}` 会让它全出血；每条边缘都发布它所应用的 padding，因此全出血的子元素能在结束面板旁，以及在没有分隔线的页眉或页脚旁对齐；并且每个 Layout 都会清除外层页眉或页脚的塌缩，因此嵌套的 Layout（包括位于 Dialog、Drawer 或 BottomSheet 内的那个）会保留自己的块间距（FR2）。

## Ownership boundary

**拥有**

- 内容根节点，它携带 `component:Layout` 所映射的 `layout-content` target，并且既是滚动容器，又是子元素的直接父节点。
- 该区域的内缩、滚动，以及调用方提供的角色和标签。

**不拥有 / 非目标**

- 插槽放置、Layout 边缘内缩和内容宽度 —— 由 `component:Layout` 拥有。
- 内容及其含义 —— 由调用方拥有。

## Public concepts

| 概念 | 封闭取值或状态           | 含义                                               | 按变体/方向/状态的可用性 | 默认值 | 所有者                    | 稳定性 | 无效值行为                 |
| ---- | ------------------------ | -------------------------------------------------- | ------------------------ | ------ | ------------------------- | ------ | -------------------------- |
| 滚动 | `true`、`false`          | 滚动溢出内容，或将其裁剪。                         | 始终                     | `true` | `component:LayoutContent` | 稳定   | —                          |
| 内缩 | 间距步长；`0`；未设置    | 替换自动内缩的统一 padding；`0` 表示全出血。       | 始终                     | 自动   | `component:LayoutContent` | 稳定   | 封闭联合类型；由类型拒绝。 |
| 地标 | 调用方 `role` 和 `label` | 以调用方指定的角色暴露该区域，并使用该可访问名称。 | 始终                     | 无     | 调用方                    | 稳定   | —                          |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 依据                                                                                                       |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| FR1 | LayoutContent 渲染一个 `div`，它携带 `layout-content` target，填满中部区域的高度和剩余宽度，并直接承载子元素。默认滚动溢出内容；`isScrollable={false}` 会将其裁剪。                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码和测试；`family:layout-regions` FR7                                                                |
| FR2 | 在没有 `padding` 时，每条面向其他区域（面板、页眉或页脚）的边缘具有内缩，每条开放边缘具有 Layout 边缘内缩，其中 Layout 边缘内缩来自 Layout 的 `padding`，否则来自最近的 padding 容器，内缩则来自最近的 padding 容器（Card、Section、Dialog、Drawer 或 BottomSheet），否则每个间距步长为 4；紧邻无分隔线的页眉或页脚的块级边缘塌缩为零。`padding` 步长会替换全部四条边缘，`0` 则移除它们。该区域发布的 container-padding 值等于它所应用的 padding，但不包含 FR3 的内容宽度对齐槽，后者会被应用但不发布。塌缩只适用于与其页眉或页脚相邻的那个 Layout；嵌套的 Layout（包括跨层边界的那个）不会继承它。 | 当前源码和审计回执；`family:layout-regions` FR4、FR6；`architecture:container-padding`；`spec:AST-038` FR7 |
| FR3 | 当 Layout 设置内容宽度时，该区域保留自己的盒子和滚动条，位置由 `component:Layout` FR6 决定，并通过其行内 padding 将子元素对齐到该宽度，且绝不小于其内缩。使用 `padding={0}` 时它保持全出血。                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码和测试；`family:layout-regions` FR12                                                               |
| FR4 | `role` 和 `label` 设置根节点的 `role` 和 `aria-label`；LayoutContent 仅在滚动时添加自己的角色和名称（AR3）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码和测试；`family:layout-regions` FR8                                                                |
| FR5 | `ref` 到达根节点。受支持的 DOM、data、ARIA 和事件 prop 在组件自身属性之后到达根节点；`xstyle`、`className` 和 `style` 在组件样式之后组合。                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码和测试；`architecture:public-component-api` INV5–INV8                                              |

### Allowed variation

- **AV1 — 内容。** 任何调用方内容都可以填满该区域。
- **AV2 — 地标。** 调用方选择该区域是否为地标以及是哪一个地标。

### Representative states

| 状态               | 必需的不变式                              | 允许的变体 |
| ------------------ | ----------------------------------------- | ---------- |
| 单独位于 Layout 中 | 每条边缘都有 Layout 边缘内缩；滚动。      | 内容。     |
| 位于面板旁         | 朝向每个面板的内缩。                      | 面板数量。 |
| 内容宽度，无面板   | 全宽滚动口；子元素对齐到该宽度。          | 宽度。     |
| 全出血             | 无 padding；发布的 inset 为零。           | —          |
| 主地标             | 根节点上为 `role="main"` 和调用方的名称。 | 名称。     |

### Transformation and precedence order

- **ORD1 — Padding。** `padding` → 每条边缘的自动内缩（朝向区域的一侧为内缩，开放侧为 Layout 边缘，紧邻无分隔线的页眉或页脚处为零）；内容宽度对齐只会增加行内 padding。

### Performance and resources

- **PR1 — 无外部生命周期。** LayoutContent 读取其 Layout 填充了哪些插槽。除它可能滚动时 AR3 的溢出观察外，它不添加任何监听器、观察器、定时器或测量。

## Accessibility contract

- **AR1 — 仅显式地标。** 只有当调用方提供 `role` 时该区域才是地标，且仅由调用方的 `label` 命名（`family:layout-regions` FR8）。
- **AR2 — 键盘滚动。** 滚动区域是浏览器滚动容器，因此一旦焦点位于其内部或其上，其溢出内容就可以用键盘滚动。
- **AR3 — 滚动区域有名称。** 当区域滚动时，其滚动元素具有 `role="group"`（除非调用方设置了 `role`）和可访问名称（调用方的 `label`，或翻译后的 "Content"），因此到达它的屏幕阅读器（包括作为浏览器生成的 Tab 停靠点）会朗读它；Tab 行为由浏览器决定（所有者决策，2026-11-04）。调用方的 `role` 只接受调用方的 `label`（AR1），因此单个主地标依赖其角色（`spec:AST-025` FR12）。在浏览器不将其作为 Tab 停靠点的地方，内容中没有任何可聚焦元素的滚动区域无法从键盘滚动。此时调用方应添加一个可聚焦的子元素，或使用 ScrollableArea。

## Design relationships

| 解剖结构或状态 | 设计要求              | 表征权威       | 层级角色 | 组件契约 |
| -------------- | --------------------- | -------------- | -------- | -------- |
| 内容区域       | Layout 的主滚动区域。 | 当前源码和文档 | 显著     | FR1–FR3  |

主题化：根节点携带 `layout-content` target，该 target 由 `Layout.doc.mjs` 声明，并由 `component:Layout` 映射。`LayoutContent.doc.mjs` 没有声明自己的解剖结构，因此此处不声明解剖结构主题化块。

## Family and system relationships

- `family:layout-regions` 拥有区域滚动、padding 替换、分隔线间距、地标，以及内容宽度滚动条放置；FR1–FR4 和 AR1 应用它们。
- `architecture:container-padding` 拥有内缩发布；FR2 应用它。
- `component:Layout` 拥有插槽放置、Layout 边缘内缩、内容宽度，以及 `layout-content` target 映射。

## Verification map

| 契约      | 验证                                                                                                                                                                              | 代表性状态                                                                                        | 变异或失败预期                                                                                                                                                                                                                                                                                                                                                                 | 审计章节                            |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------- |
| FR1       | `LayoutSlots.test.tsx` 的 class、scroll-owner 和 Layout 插槽测试                                                                                                                  | 单独；在 Layout 中                                                                                | 丢失 `layout-content` class、默认不滚动，或在子元素外再套一层包裹，都会失败。缺口：`isScrollable={false}` 和填充尺寸没有检查。                                                                                                                                                                                                                                                 | `audit:LayoutContent/layout`        |
| FR2, ORD1 | `LayoutSlots.test.tsx` 的 padding 测试；`LayoutContentAudit.a11y.chromium.spec.ts` 的 `content-insets` 回执                                                                       | `padding={0}`；数值 padding；起始面板；结束面板；无分隔线的页眉；全出血起始面板；嵌套 Layout；RTL | 当某条边缘应用的内缩与预期不符，或发布的值与其应用的 padding 不符时，审计回执会失败。缺口：没有始终运行的检查覆盖按边缘的自动内缩、起始面板的 inline-end 内缩、紧邻无分隔线页眉或页脚的塌缩、嵌套 Layout，或发布值；浏览器 spec 只在 LayoutContent 审计 pull request 时运行，因此它们只有审计回执，且没有回执覆盖跨层边界的嵌套 Layout。padding 单元测试只检查该区域能够渲染。 | `audit:LayoutContent/layout`        |
| FR3       | `contentWidth.test.tsx`；稳定的视觉基线 `core-layout--content-width-scrollbar-placement`                                                                                          | 无面板、一个面板、两者都有；零 padding                                                            | 在没有面板时内容区域不是全宽、子元素未对齐，或丢失全出血，都会失败；滚动条移离其边缘时会以变更形式返回以供评审。                                                                                                                                                                                                                                                               | `audit:LayoutContent/layout`        |
| FR4, AR1  | `LayoutSlots.test.tsx` 的地标测试和 `exposes no role or name of its own when it does not scroll`；`Layout.a11y.test.tsx` 和 `Layout.a11y.chromium.spec.ts` 的 `content-main` 状态 | 调用方 `main` 角色和标签；无调用方角色                                                            | 丢失角色或名称会失败，包括在可访问性树上；在不滚动且调用方未提供 `role` 的区域上出现角色或名称会失败。                                                                                                                                                                                                                                                                         | `audit:LayoutContent/accessibility` |
| FR5       | `LayoutSlots.test.tsx` 的 ref、className/style，以及 `forwards DOM, data, and event props to the root` 测试                                                                       | Ref；调用方 class 和 style；DOM、data 和事件 props                                                | ref 指向其他元素，或丢弃 class、style、DOM、data 或事件 prop，都会失败。缺口：没有测试固定 `xstyle` 的合并顺序。                                                                                                                                                                                                                                                               | `audit:LayoutContent/api`           |
| AR2, PR1  | 源码审查                                                                                                                                                                          | 滚动区域                                                                                          | 缺口：没有自动化检查覆盖键盘滚动，也没有检查在 LayoutContent 添加超出 AR3 的监听器或测量时失败。                                                                                                                                                                                                                                                                               | `audit:LayoutContent/behavior`      |
| AR3       | `useScrollRegionProps.test.tsx` 的 LayoutContent 测试；`scrollRegionName.a11y.chromium.spec.ts`                                                                                   | 滚动、适配、已标记、`main`、不可滚动                                                              | 在溢出时缺少 group 角色或名称，或在适配或无法滚动时仍然存在，都会失败，在 Chromium 的可访问性树中也是如此；丢失调用方角色或标签、默认地标名称，或 tab index，都会失败。                                                                                                                                                                                                        | `audit:LayoutContent/accessibility` |
| RTL 关系  | RTL 审计精选的 D8 目标（`apps/storybook/rtl-audit/targets.json`）作用于 `Content width with start panel` story                                                                    | 带居中内容宽度的起始面板（逻辑 padding 起始 16px、结束 144px）；LTR 和 RTL                        | 在 RTL 中逻辑 start/end padding 对未交换物理侧时，会使 D8 失败。                                                                                                                                                                                                                                                                                                               | `audit:LayoutContent/i18n-rtl`      |

## Decision log

无记录。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤、Layout 插槽规则或 container-padding 机制。它链接到它们的所有者。
