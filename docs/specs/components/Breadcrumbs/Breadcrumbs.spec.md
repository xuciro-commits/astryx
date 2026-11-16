---
schema_version: 3
template_version: 7
kind: component
id: component:Breadcrumbs
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Breadcrumbs/Breadcrumbs.test.tsx,
    packages/core/src/Breadcrumbs/__tests__/Breadcrumbs.a11y.test.tsx,
    packages/core/src/Breadcrumbs/__tests__/Breadcrumbs.a11y.chromium.spec.ts,
    apps/storybook/stories/Breadcrumbs.stories.tsx,
  ]
modules: []
families: []
design_specs: [design:bidirectionality]
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-038]
---

# Breadcrumbs component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 带 `children`、`separator`（默认 `/`）、`variant`（`default`、`supporting` 或扩充值；默认 `default`）以及 `label` 的 `Breadcrumbs`；目标 `breadcrumbs` 带 `variant`。 |
| 行为          | 一个带标签的导航地标，持有一份由 BreadcrumbItem 子项组成的有序列表；它向自身表面内的每个条目告知要使用的分隔符与 variant。                                            |
| 最终用户影响  | 屏幕阅读器用户会把这串路径识别为一个名为“Breadcrumb”的地标，并把它当作有序列表来听；视力正常的用户则看到整串路径使用一致的分隔符与尺寸。                              |
| 构建者影响    | 无。                                                                                                                                                                  |
| 兼容性/就绪度 | 记录已发布的行为；无公开变更。                                                                                                                                        |
| 审查检查项    | 拒绝未加标签的地标、不是有序列表的路径，或路径自身表面内忽略其分隔符或 variant 的条目。                                                                               |
| 治理规则      | `component:BreadcrumbItem`（每个条目）；`design:bidirectionality` DR4（分隔符镜像）；`architecture:component-theming-surface`。                                       |

此表是审查投影；以下正文具有权威性。

## Intent

Breadcrumbs 显示页面在层级中所处的位置。它拥有路径的地标、列表、标签、分隔符与 variant；每个碎屑的行为属于 BreadcrumbItem。使用方用法见 `Breadcrumbs.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 导航地标及其标签、有序列表、其换行布局，以及其自身表面内每个条目所接收的分隔符与 variant（FR1–FR4）。

**不拥有 / 非目标**

- 每个碎屑的元素、当前页状态、分隔符渲染、菜单，以及 `breadcrumb-item`、`breadcrumb-item-menu-trigger` 和 `breadcrumb-menu` 目标——由 `component:BreadcrumbItem` 拥有。
- 目标位置处理——由 `family:navigation-destinations` 通过 BreadcrumbItem 拥有。
- 截断或折叠长路径——不提供；列表会换行。

## Public concepts

| 概念   | 封闭值或状态                    | 含义                                       | 按 variant/方向/状态的可用性 | 默认值    | 所有者                  | 稳定性 | 无效值行为                                     |
| ------ | ------------------------------- | ------------------------------------------ | ---------------------------- | --------- | ----------------------- | ------ | ---------------------------------------------- |
| 变体   | `default`、`supporting`、扩充值 | 每个条目的正文或辅助文字尺寸。             | 整串路径。                   | `default` | `component:Breadcrumbs` | 稳定   | 除 `supporting` 以外的值会让条目使用默认尺寸。 |
| 分隔符 | 任意节点；默认 `/`              | 除第一个条目外，在每个条目之前显示的字符。 | 整串路径。                   | `/`       | `component:Breadcrumbs` | 稳定   | 按给定内容渲染。                               |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                           | 依据           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | Breadcrumbs 渲染一个 `<nav>`，其名称取自 `label`，否则取翻译后的 `@astryx.breadcrumbs.label`（“Breadcrumb”）；调用方传入的 `aria-label` 或 `aria-labelledby` 会替换该名称。它携带带 `variant` 的 `breadcrumbs`、转发的 `ref`、`data-testid` 以及其他 DOM props。 | 当前源码与测试 |
| FR2 | `<nav>` 包含一个持有 `children` 的 `<ol>`；该列表没有标记、无内缩，并将条目排成一行、可换行。                                                                                                                                                                    | 当前源码与测试 |
| FR3 | 路径自身表面内的每个后代 BreadcrumbItem 都会收到该路径的 `separator` 与 `variant`；在层内渲染的碎屑会得到默认值，正如 `spec:AST-038` FR7 所要求的。                                                                                                              | 当前源码与测试 |
| FR4 | `className`、`style` 和 `xstyle` 在组件样式之后合并到 `<nav>` 上。                                                                                                                                                                                               | 当前源码       |

### Allowed variation

- **AV1 — 分隔符。** 任意节点都可以替换 `/`。
- **AV2 — 主题样式。** 主题按 variant 为 `breadcrumbs` 重新设定样式。

### Representative states

| 状态            | 必需的不变式                     | 允许的变化 |
| --------------- | -------------------------------- | ---------- |
| 默认路径        | 具名地标；有序列表；`/` 分隔符。 | 条目内容。 |
| Supporting 变体 | 条目使用辅助尺寸。               | —          |
| 自定义分隔符    | 条目显示给定的分隔符。           | 字符。     |
| 窄容器          | 条目换行到更多行。               | 行数。     |

### Transformation and precedence order

- **ORD1 — 标签。** 先是调用方的 `aria-label` 或 `aria-labelledby`，然后是 `label`，最后是翻译后的默认值。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 地标与列表。** FR1 与 FR2：一个具名导航地标，带有由碎屑组成的有序列表。

## Design relationships

| 解剖结构或状态 | 设计要求                     | 表示权威                   | 层级角色 | 组件契约 |
| -------------- | ---------------------------- | -------------------------- | -------- | -------- |
| 路径           | 可换行的碎屑行。             | 当前源码与公开文档         | 支撑级   | FR1, FR2 |
| 条目           | 一个碎屑。                   | `component:BreadcrumbItem` | 支撑级   | FR3      |
| 分隔符         | 碎屑之间贯穿整串路径的字符。 | `component:BreadcrumbItem` | 支撑级   | FR3      |
| 图标           | 可选的碎屑起始内容。         | `component:BreadcrumbItem` | 支撑级   | —        |

尚未记录解剖结构-主题映射；该块在迁移期间是可选的。将四个解剖部件与 `Breadcrumbs.doc.mjs` 列出的四个目标（其中三个由 BreadcrumbItem 通过委托拥有）进行映射的工作，已推迟。

## Family and system relationships

- `component:BreadcrumbItem` 渲染每个碎屑及其分隔符。
- `design:bidirectionality` DR4 治理默认分隔符的镜像，由 BreadcrumbItem 实现。

## Verification map

| 契约     | 验证                                                           | 代表性状态                     | 变更或失败预期               | 审计部分                          |
| -------- | -------------------------------------------------------------- | ------------------------------ | ---------------------------- | --------------------------------- |
| FR1, AR1 | `Breadcrumbs.test.tsx` 的地标测试；`Breadcrumbs.a11y.test.tsx` | 默认与自定义标签               | 缺失地标或名称则失败。       | `audit:Breadcrumbs/accessibility` |
| FR2      | `Breadcrumbs.test.tsx` 的有序列表测试                          | 多个条目                       | 非列表路径则失败。           | `audit:Breadcrumbs/anatomy`       |
| FR3      | `Breadcrumbs.test.tsx` 的分隔符与 variant 测试                 | 默认、自定义分隔符、supporting | 忽略路径设置的条目则失败。   | `audit:Breadcrumbs/behavior`      |
| FR1      | `Breadcrumbs.test.tsx` 的 ref 与 test-id 测试                  | 根 props                       | 丢失 ref 或 test id 则失败。 | `audit:Breadcrumbs/api`           |

以下内容从源码读取，尚无针对性测试：层内碎屑获得默认值（FR3）；`breadcrumbs` 目标及其 `variant` 状态、其他 DOM props，以及调用方 `aria-label` 或 `aria-labelledby` 替换名称（FR1）；列表的标记、内缩与可换行行（FR2）；以及 FR4。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例或条目行为。它链接到其所有者。
