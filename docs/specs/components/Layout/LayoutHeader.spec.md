---
schema_version: 3
template_version: 7
kind: component
id: component:LayoutHeader
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

# LayoutHeader component contract

## Contract at a glance

| 领域          | 契约                                                                                                                         |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `children`、`hasDivider`、`height`、`padding`、`paddingBlockEnd`、`label`、`role`、根 `BaseProps`，以及根 `ref`。            |
| 行为          | 一个不收缩的页头区域，其内部包装元素应用并发布 Layout 内嵌边距，并与 Layout 的内容宽度对齐。                                 |
| 终端用户影响  | 用户看到的页头在滚动内容之上保持自身高度，且内容与页面的可读宽度对齐。                                                       |
| 构建者影响    | 无；该记录描述的是已发布行为。                                                                                               |
| 兼容性/就绪度 | 已发布行为记录为 current；API、默认值或输出均无变化。没有未决的实现缺口（当前状态影响）。                                    |
| 审查检查      | 拒绝会收缩的页头、与所应用内边距不一致的已发布内嵌边距、被推断出的地标（landmark），或丢失的分隔线默认值。                   |
| 管辖规则      | `family:layout-regions` FR1、FR4–FR6、FR8；`architecture:container-padding`；`architecture:public-component-api` INV5–INV8。 |

本表是审查视角的投影；以下正文具有权威性。

## Intent

LayoutHeader 是调用方放入 Layout `header` 槽位的可选页头区域。它负责页头的尺寸、内嵌边距、分隔线，以及调用方提供的地标语义；其内容由调用方负责。

使用方语法与示例属于 `LayoutHeader.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes` —— 除非 Layout 默认值另有规定，否则没有分隔线；自动内嵌边距；没有地标 role。
- 兼容性类别：记录已发布行为；不改变任何公共 prop、默认值、DOM、target 或样式输出。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

无。

## Ownership boundary

**负责**

- 页头根元素（承载 `component:Layout` 所映射的 `layout-header` target）及其内部 padding 包装元素。
- 页头高度、分隔线、内嵌边距，以及调用方提供的 role 与 label。

**不负责 / 非目标**

- 槽位放置、Layout 边缘内嵌边距、内容宽度与分隔线默认值 —— 由 `component:Layout` 负责。
- 页头内容及其含义 —— 由调用方负责。

## Public concepts

| 概念         | 封闭取值或状态                     | 含义                                                 | 按变体/方向/状态的可用性 | 默认值                | 负责方                   | 稳定性 | 无效值行为                     |
| ------------ | ---------------------------------- | ---------------------------------------------------- | ------------------------ | --------------------- | ------------------------ | ------ | ------------------------------ |
| 分隔线       | `true`、`false`、未设置            | 在页头的块末边缘绘制一条线。                         | 始终                     | Layout 默认值，否则无 | `component:LayoutHeader` | 稳定   | —                              |
| 高度         | 数字（px）；CSS 长度字符串；未设置 | 固定页头的块尺寸。                                   | 始终                     | 内容高度              | `component:LayoutHeader` | 稳定   | —                              |
| 内嵌边距     | 间距档位；`0`；未设置              | 统一的 padding，替代自动内嵌边距；`0` 表示满幅出血。 | 始终                     | 自动                  | `component:LayoutHeader` | 稳定   | 封闭联合类型；由类型系统拒绝。 |
| 块末内嵌边距 | 间距档位；未设置                   | 仅替换块末 padding。                                 | 始终                     | 自动                  | `component:LayoutHeader` | 稳定   | 封闭联合类型；由类型系统拒绝。 |
| 地标         | 调用方的 `role` 与 `label`         | 以调用方指定的 role 暴露页头，并使用该无障碍名称。   | 始终                     | 无                    | 调用方                   | 稳定   | —                              |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 依据                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| FR1 | LayoutHeader 渲染一个不收缩的根 `div`，承载 `layout-header` target，其内部 `div` 容纳 children，以 Layout 的内容宽度为最大宽度，并在根元素内居中。`height` 固定根元素的块尺寸，数字按像素处理。                                                                                                                                                                                                                                                                | 当前源码与测试                                                                |
| FR2 | 未设置 `padding` 时，内部包装元素的行内与块首 padding 是 Layout 边缘内嵌边距，其块末 padding 是内部内嵌边距；其中 Layout 边缘内嵌边距来自 Layout 的 `padding`，否则来自最近的 padding 容器；内部内嵌边距来自最近的 padding 容器（Card、Section、Dialog、Drawer 或 BottomSheet）；两者否则均为间距档位 4。一个 `padding` 档位会替换全部四条边，`0` 则移除它们。`paddingBlockEnd` 仅替换块末边缘。包装元素会发布与其所应用 padding 相等的 container-padding 值。 | 当前源码与测试；`family:layout-regions` FR4；`architecture:container-padding` |
| FR3 | 分隔线在根元素的块末边缘绘制一条 1px 实线 `--color-border` 线，并反映为 `data-divider="true"`。由 `hasDivider` 决定；未设置时，由同一图层中最近的 Layout `defaultHasDividers` 决定（该默认值止于图层边界，`spec:AST-038` FR7）；否则没有分隔线。没有分隔线的页头会让其下方中间行折叠自身的块首间距。该折叠在每处 Layout 停止，因此嵌套于该中间行的 Layout（包括在由其打开的 Dialog、Drawer 或 BottomSheet 内部）会保留自身的间距（`spec:AST-038` FR7）。       | 当前源码与测试；`family:layout-regions` FR6                                   |
| FR4 | `role` 与 `label` 设置根元素的 `role` 与 `aria-label`；LayoutHeader 不自行添加任何 role。                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试；`family:layout-regions` FR8                                   |
| FR5 | `ref` 抵达根元素。受支持的 DOM、data、ARIA 与事件 props 抵达根元素，`xstyle`、`className` 与 `style` 在组件样式之后合成，且所反映的 `data-divider` 始终归组件所有：调用方的 `data-divider` 永不替换它，因此相邻的间距折叠始终跟随分隔线状态（`architecture:public-component-api` INV5）。                                                                                                                                                                      | 当前源码与测试；`architecture:public-component-api` INV5–INV8                 |

### Allowed variation

- **AV1 — 内容。** 任意调用方内容都可填充页头。
- **AV2 — 地标。** 由调用方选择页头是否为地标以及是哪一种地标。

### Representative states

| 状态                | 必需不变式                                  | 允许的变化 |
| ------------------- | ------------------------------------------- | ---------- |
| Layout 中的默认状态 | 自动内嵌边距、无分隔线、无 role。           | 内容。     |
| 带分隔线            | 块末线条与 `data-divider="true"`。          | —          |
| 显式 padding        | 统一 padding，并发布给子元素。              | 档位。     |
| `paddingBlockEnd`   | 仅块末边缘变化。                            | 档位。     |
| Banner 地标         | 根元素上的 `role="banner"` 与调用方的名称。 | 名称。     |

### Transformation and precedence order

- **ORD1 — 分隔线。** `hasDivider` → Layout `defaultHasDividers` → 无。
- **ORD2 — padding。** 块末用 `paddingBlockEnd` → `padding` → 自动内嵌边距。

### Performance and resources

- **PR1 — 无外部生命周期。** LayoutHeader 从其 Layout 读取分隔线默认值，不添加任何监听器、观察器、定时器或测量。

## Accessibility contract

- **AR1 — 仅显式地标。** 只有当调用方提供 `role` 时，页头才是地标，并且仅由调用方的 `label` 命名（`family:layout-regions` FR8）。

## Design relationships

| 结构或状态 | 设计要求                             | 表示权威       | 层级角色 | 组件契约 |
| ---------- | ------------------------------------ | -------------- | -------- | -------- |
| 页头       | 一条固定的页头带，可选带块末分隔线。 | 当前源码与文档 | 支撑性   | FR1–FR3  |

主题：根元素承载 `layout-header` target，该 target 由 `Layout.doc.mjs` 声明，并由 `component:Layout` 映射。`LayoutHeader.doc.mjs` 未声明自身的结构，因此此处不声明任何结构主题化区块。

## Family and system relationships

- `family:layout-regions` 负责区域边界、padding 替换、分隔线间距与地标规则；FR2–FR4 与 AR1 应用这些规则。
- `architecture:container-padding` 负责内嵌边距的发布；FR2 应用它。
- `component:Layout` 负责槽位放置、Layout 边缘内嵌边距、内容宽度、分隔线默认值，以及 `layout-header` target 映射。
- `architecture:public-component-api` 负责调用方输入的转发；FR5 应用它。

## Verification map

| 契约      | 验证                                                                                                                                                                                                                                                                                                | 代表性状态                                                              | 变异或失败预期                                                                                                                                                                                                                                                                                                                                 | 审计章节                           |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1       | `LayoutSlots.test.tsx` 的 class、height 与内部包装元素测试；`contentWidth.test.tsx` 的 LayoutHeader 内部包装元素与分隔线测试；`headerFooterXstyle.test.tsx` 的 `keeps the own styles that xstyle does not set`（不收缩的根元素）                                                                    | 默认；数字高度                                                          | 丢失 `layout-header` class、缺少像素高度、children 被直接放在根元素上，或分隔线脱离外层元素，都会失败。会收缩的页头根元素会失败。缺口：内容宽度上限与居中尚无检查。                                                                                                                                                                            | `audit:LayoutHeader/layout`        |
| FR2, ORD2 | `Layout.test.tsx` 的 `paddingBlockEnd` 测试；`LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的各用例内嵌边距与已发布值                                                                                                                                                                              | 单独使用 `paddingBlockEnd`，以及与 `padding` 一起使用                   | 未添加 class、改动超出块末边缘，或脱离共享的按边 family 的 `paddingBlockEnd` 会失败。任意边缘（自动、`padding`、满幅出血或嵌套 Layout）的内嵌边距与预期档位不一致，或已发布值与所应用 padding 不一致，都会失败。缺口：取自周围 Card、Section、Dialog、Drawer 或 BottomSheet 的自动内嵌边距尚无具名检查；边缘测试规范在普通框架中渲染每个用例。 | `audit:LayoutHeader/layout`        |
| FR3, ORD1 | `LayoutSlots.test.tsx` 与 `Layout.test.tsx` 的分隔线测试，包括 `stops the default at a layer boundary`；`LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的线条绘制以及页头下方内容的折叠，包括其在嵌套 Layout 处停止的情形                                                                           | 默认；`hasDivider`；Layout 默认值；显式 `false`                         | 缺失或出现意外的 `data-divider`、被忽略的 Layout 默认值，或失效的显式 `false`，都会失败。不是 1px 实线 `--color-border` 的线条、没有 `data-divider="true"` 的线条、无分隔线时页头下方内容不折叠，或折叠越过嵌套 Layout，都会失败。                                                                                                             | `audit:LayoutHeader/layout`        |
| FR4, AR1  | `LayoutSlots.test.tsx` 的地标测试与 `exposes no role or name without a caller role` 测试；`Layout.a11y.test.tsx` 与 `Layout.a11y.chromium.spec.ts` 的 `header-banner` 状态                                                                                                                          | 调用方的 `banner` role 与 label；无调用方 role                          | 丢失 role 或名称会失败，包括在无障碍树中。没有调用方 `role` 却暴露了 role 或名称的页头会失败。                                                                                                                                                                                                                                                 | `audit:LayoutHeader/accessibility` |
| FR5       | `LayoutSlots.test.tsx` 的 ref、className、`passes style, DOM, data, and event props to the root` 与 `keeps data-divider when a caller passes its own value` 测试；`headerFooterXstyle.test.tsx` 的 `xstyle` 合并顺序测试；`LayoutHeaderFooterEdges.a11y.browser.spec.ts` 的 `caller-attribute` 用例 | Ref；调用方 class、style、DOM、data 与事件 props；调用方 `data-divider` | ref 落在其他元素上、丢失 class 或调用方 prop，或调用方的 `data-divider` 替换或移除了所反映的值，都会失败。输给页头自身样式的 `xstyle`，或改变页头下方间距的调用方 `data-divider`，都会失败。                                                                                                                                                   | `audit:LayoutHeader/api`           |
| PR1       | 源码审查                                                                                                                                                                                                                                                                                            | 每种状态                                                                | 缺口：若 LayoutHeader 添加监听器、定时器或测量，没有自动化检查会失败。                                                                                                                                                                                                                                                                         | `audit:LayoutHeader/behavior`      |

## Decision log

未记录任何决策。该记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤、Layout 槽位规则或 container-padding 机制。它链接到这些内容的负责方。
