---
schema_version: 3
template_version: 7
kind: component
id: component:LayoutFooter
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
    packages/core/src/Layout/Layout.test.tsx,
    packages/core/src/Layout/__tests__/contentWidth.test.tsx,
    packages/core/src/Layout/__tests__/Layout.a11y.test.tsx,
    packages/core/src/Layout/__tests__/Layout.a11y.chromium.spec.ts,
    packages/core/src/Layout/__tests__/LayoutHeaderFooterEdges.a11y.browser.spec.ts,
    packages/core/src/Layout/__tests__/headerFooterXstyle.test.tsx,
    scripts/check-knowledge.mjs,
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

# LayoutFooter component contract

## Contract at a glance

| 方面          | 契约                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `children`、`hasDivider`、`height`、`padding`、`label`、`role`、根级 `BaseProps`，以及根级 `ref`。                           |
| 行为          | 一个不收缩的页脚区域，其内部包装元素应用并发布 Layout 的内边距，并对齐到 Layout 的内容宽度。                                 |
| 最终用户影响  | 用户看到的页脚在滚动内容下方保持自身高度，其内容对齐到页面的可读宽度。                                                       |
| 构建者影响    | 无；本记录描述的是已发布行为。                                                                                               |
| 兼容性/就绪度 | 已发布行为记录为现行；无 API、默认值或输出变更。没有未决的实现缺口（当前状态影响）。                                         |
| 审查检查      | 拒绝以下情况：页脚收缩、发布的内边距与应用的内边距不一致、推断出的地标，或丢失的分隔线默认值。                               |
| 管辖规则      | `family:layout-regions` FR1、FR4–FR6、FR8；`architecture:container-padding`；`architecture:public-component-api` INV5–INV8。 |

本表是审查投影；下方正文具有权威性。

## Intent

LayoutFooter 是使用方放置在 Layout 的 `footer` 插槽中的可选页脚区域。它拥有页脚的尺寸、内边距、分隔线以及使用方提供的地标语义；而内容由使用方拥有。

使用方语法与示例属于 `LayoutFooter.doc.mjs`。

## Compatibility and migration

- 保留的发布默认值：`yes` —— 除非 Layout 的默认值另有规定，否则无分隔线；自动内边距；无地标角色。
- 兼容性类别：记录已发布行为；无公开 prop、默认值、DOM、target 或样式输出的变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

无。

## Ownership boundary

**拥有**

- 页脚根元素，它承载 `component:Layout` 所映射的 `layout-footer` target，以及其内部的 padding 包装元素。
- 页脚高度、分隔线、内边距，以及使用方提供的 role 与 label。

**不拥有 / 非目标**

- 插槽位置、Layout 边缘内边距、内容宽度与分隔线默认值 —— 由 `component:Layout` 拥有。
- 页脚内容及其含义 —— 由使用方拥有。

## Public concepts

| 概念   | 封闭取值或状态                       | 含义                                             | 按变体/方向/状态的可适用性 | 默认值                | 所有者                   | 稳定性 | 无效值行为                 |
| ------ | ------------------------------------ | ------------------------------------------------ | -------------------------- | --------------------- | ------------------------ | ------ | -------------------------- |
| 分隔线 | `true`、`false`、未设置              | 在页脚的块起始边缘绘制一条线。                   | 始终                       | Layout 默认值，否则无 | `component:LayoutFooter` | 稳定   | —                          |
| 高度   | number（px）；CSS 长度字符串；未设置 | 固定页脚的块尺寸。                               | 始终                       | 内容高度              | `component:LayoutFooter` | 稳定   | —                          |
| 内边距 | 间距步进；`0`；未设置                | 替换自动内边距的统一内边距；`0` 表示满出血。     | 始终                       | 自动                  | `component:LayoutFooter` | 稳定   | 封闭联合类型；由类型拒绝。 |
| 地标   | 使用方的 `role` 与 `label`           | 以使用方指定的角色暴露页脚，并使用该可访问名称。 | 始终                       | 无                    | 使用方                   | 稳定   | —                          |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 依据                                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| FR1 | LayoutFooter 渲染一个不收缩的根 `div`，它承载 `layout-footer` target，并围绕一个容纳 children 的内部 `div`；该内部元素以 Layout 的内容宽度作为其最大宽度，并在根元素内居中。`height` 固定根元素的块尺寸，数字按像素处理。                                                                                                                                                                                                                                                    | 当前源码与测试                                                                |
| FR2 | 在没有 `padding` 时，内部包装元素的行内方向与块结束方向内边距为 Layout 边缘内边距，其块起始方向内边距为内层内边距；其中 Layout 边缘内边距来自 Layout 的 `padding`，否则来自最近的 padding 容器，而内层内边距来自最近的 padding 容器（Card、Section、Dialog、Drawer 或 BottomSheet），两者在都没有时各自取间距步进 4。`padding` 步进会替换全部四个边缘，`0` 会移除它们。该包装元素发布的 container-padding 值等于它所应用的内边距。                                           | 当前源码与测试；`family:layout-regions` FR4；`architecture:container-padding` |
| FR3 | 分隔线在根元素的块起始边缘绘制一条 1px solid `--color-border` 的线，并反映为 `data-divider="true"`。由 `hasDivider` 决定；未设置时，由同一层内最近的 Layout `defaultHasDividers` 决定（该默认值在层边界处停止，`spec:AST-038` FR7）；否则没有分隔线。没有分隔线的页脚会让其上方中间行折叠其块结束方向间距。该折叠在每个 Layout 处停止，因此嵌套在该中间行中的 Layout（包括从其中打开的 Dialog、Drawer 或 BottomSheet 内部的 Layout）会保留自己的间距（`spec:AST-038` FR7）。 | 当前源码与测试；`family:layout-regions` FR6                                   |
| FR4 | `role` 与 `label` 设置根元素的 `role` 与 `aria-label`；LayoutFooter 不自行添加任何 role。                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试；`family:layout-regions` FR8                                   |
| FR5 | `ref` 到达根元素。受支持的 DOM、data、ARIA 与事件 props 到达根元素，`xstyle`、`className` 与 `style` 在组件样式之后合成，并且反映的 `data-divider` 归组件所有：使用方的 `data-divider` 永远不会替换它，因此相邻的间距折叠始终跟随分隔线状态（`architecture:public-component-api` INV5）。                                                                                                                                                                                    | 当前源码与测试；`architecture:public-component-api` INV5–INV8                 |

### Allowed variation

- **AV1 — 内容。** 任何使用方内容都可以填充页脚。
- **AV2 — 地标。** 使用方决定页脚是否为地标，以及是哪一个地标。

### Representative states

| 状态                | 必需不变式                                         | 允许的变化 |
| ------------------- | -------------------------------------------------- | ---------- |
| Layout 中的默认状态 | 自动内边距，无分隔线，无 role。                    | 内容。     |
| 带分隔线            | 块起始线以及 `data-divider="true"`。               | —          |
| 显式内边距          | 统一内边距，发布给子元素。                         | 步进。     |
| Contentinfo 地标    | 根元素上的 `role="contentinfo"` 以及使用方的名称。 | 名称。     |

### Transformation and precedence order

- **ORD1 — 分隔线。** `hasDivider` → Layout `defaultHasDividers` → 无。
- **ORD2 — 内边距。** `padding` → 自动内边距。

### Performance and resources

- **PR1 — 无外部生命周期。** LayoutFooter 从其 Layout 读取分隔线默认值，并且不添加任何监听器、观察器、定时器或测量。

## Accessibility contract

- **AR1 — 仅显式地标。** 仅当使用方提供 `role` 时，页脚才是地标；并且它仅由使用方的 `label` 命名（`family:layout-regions` FR8）。

## Design relationships

| 结构或状态 | 设计要求                         | 表示权威       | 层级角色 | 组件契约 |
| ---------- | -------------------------------- | -------------- | -------- | -------- |
| 页脚       | 带可选块起始分隔线的固定页脚带。 | 当前源码与文档 | 支撑性   | FR1–FR3  |

主题化：根元素承载 `layout-footer` target，它由 `Layout.doc.mjs` 声明，并由 `component:Layout` 映射。`LayoutFooter.doc.mjs` 不声明自己的结构，因此此处不声明任何结构-主题化块。

## Family and system relationships

- `family:layout-regions` 拥有区域边界、内边距替换、分隔线间距与地标规则；FR2–FR4 与 AR1 应用它们。
- `architecture:container-padding` 拥有内边距发布；FR2 应用它。
- `component:Layout` 拥有插槽位置、Layout 边缘内边距、内容宽度、分隔线默认值，以及 `layout-footer` target 映射。
- `architecture:public-component-api` 拥有使用方输入的转发；FR5 应用它。

## Verification map

| 契约      | 验证                                                                                                                                                                                                                                                                                                         | 代表性状态                                                                  | 变异或失败预期                                                                                                                                                                                                                                                  | 审计小节                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1       | `LayoutSlots.test.tsx` 的 class 测试与 `applies a numeric height as pixels on the root` 测试；`contentWidth.test.tsx` 的 LayoutFooter 内部包装元素与分隔线测试；`headerFooterXstyle.test.tsx` 的 `keeps the own styles that xstyle does not set`（不收缩的根元素）                                           | 默认；数值高度；内容宽度                                                    | 丢失 `layout-footer` class、缺少像素高度、children 被放在根元素而非内部包装元素上，或分隔线偏离外层元素，均判为失败。页脚根元素收缩也判为失败。缺口：内容宽度上限与居中没有任何检查。                                                                           | `audit:LayoutFooter/layout`        |
| FR2, ORD2 | `LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的逐用例内边距与发布值                                                                                                                                                                                                                                        | 自动、显式与零内边距                                                        | 任一边缘上的内边距与预期步进不一致（自动、`padding`、满出血或嵌套 Layout），或发布值与所应用的内边距不一致，均判为失败。缺口：取自外层 Card、Section、Dialog、Drawer 或 BottomSheet 的自动内边距没有具名检查；边缘规格会在普通 frame 中渲染每个用例。           | `audit:LayoutFooter/layout`        |
| FR3, ORD1 | `LayoutSlots.test.tsx` 与 `Layout.test.tsx` 的分隔线测试，包括 `an explicit hasDivider={false} on a footer overrides the context default` 与 `stops the footer default at a layer boundary`；`LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的线绘制以及页脚上方内容的折叠，包括其在嵌套 Layout 处停止的情形 | 默认；`hasDivider`；Layout 默认值；显式 `false`；跨层边界的 Layout 默认值   | 缺失或意外的 `data-divider`、被忽略的 Layout 默认值、落败的显式 `false`，或跨越层边界的 Layout 默认值，均判为失败。不是 1px solid `--color-border` 的线、没有 `data-divider="true"` 的线，或在无分隔线时页脚上方内容不折叠、或折叠越过嵌套 Layout，均判为失败。 | `audit:LayoutFooter/layout`        |
| FR4, AR1  | `LayoutSlots.test.tsx` 的地标测试与 `exposes no role or name without a caller role` 测试；`Layout.a11y.test.tsx` 与 `Layout.a11y.chromium.spec.ts` 的 `footer-contentinfo` 状态                                                                                                                              | 使用方的 `contentinfo` role 与 label；无使用方 role                         | 丢失 role 或名称判为失败，包括在可访问性树上。没有使用方 `role` 却暴露 role 或名称的页脚判为失败。                                                                                                                                                              | `audit:LayoutFooter/accessibility` |
| FR5       | `LayoutSlots.test.tsx` 的 ref 测试、`passes className, style, DOM, data, and event props to the root` 测试与 `keeps data-divider when a caller passes its own value` 测试；`headerFooterXstyle.test.tsx` 的 `xstyle` 合并顺序测试；`LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的 `caller-attribute` 用例 | Ref；使用方的 class、style、DOM、data 与事件 props；使用方的 `data-divider` | ref 落在其他元素上、使用方 prop 被丢弃，或使用方 `data-divider` 替换或移除了所反映的值，均判为失败。`xstyle` 输给页脚自身样式，或使用方 `data-divider` 改变了页脚上方间距，均判为失败。                                                                         | `audit:LayoutFooter/api`           |
| PR1       | 源码审查                                                                                                                                                                                                                                                                                                     | 每个状态                                                                    | 缺口：若 LayoutFooter 添加监听器、定时器或测量，没有任何自动化检查会失败。                                                                                                                                                                                      | `audit:LayoutFooter/behavior`      |

## Decision log

无记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤、Layout 插槽规则或 container-padding 机制。它链接到它们的拥有者。
