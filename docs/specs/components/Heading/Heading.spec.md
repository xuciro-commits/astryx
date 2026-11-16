---
schema_version: 3
template_version: 7
kind: component
id: component:Heading
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/Heading/Heading.test.tsx,
    packages/core/src/Text/useTruncation.test.tsx,
    packages/core/src/Text/__tests__/TextReflow.a11y.chromium.spec.ts,
    scripts/text-overflow-wrap-anywhere.test.mjs,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/Heading.stories.tsx,
    packages/core/src/Heading/__tests__/HeadingAudit.a11y.chromium.spec.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009, spec:AST-024]
---

# Heading component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个语义标题，具有必需的 `level`，可选的、可在主题中扩展的视觉 `type`、`weight`、`accessibilityLevel`，以及 `Heading.doc.mjs` 中记录的共享文本控件。                                                                                                                                                                                                           |
| 行为          | `level` 选择 `h1`–`h6` 与默认视觉字号层级；`type` 与 `weight` 只改变外观；`accessibilityLevel` 在其与 `level` 不同时设置 `aria-level`。                                                                                                                                                                                                                        |
| 最终用户影响  | 屏幕阅读器用户所浏览的文档大纲与页面的各个章节一致，无论每个标题实际绘制成多大。                                                                                                                                                                                                                                                                               |
| 构建者影响    | 未截断的 Heading 中，一个长的不可断词元会换行。在 flex 行内，flex 子项需要 `min-width: 0` 换行才会生效，而调用方自己设置 `overflow-wrap: anywhere` 的容器影响不到 Heading 的文本；Core 的 `anywhere` 容器会把自己的换行传递给它。截断 Tooltip 在首次悬停、完成的点按或焦点时挂载（AR3）。                                                                      |
| 兼容性/就绪度 | 已发布行为记为 current，包含一处样式输出变更和一处 DOM 变更：未截断的 Heading 会设置 `overflow-wrap`（`break-word`，在 Core 的 `anywhere` 容器内则为 `anywhere`）。截断 Tooltip 在首次悬停、完成的点按或焦点时挂载，因此在此之前，被钳制的 Heading 没有 tooltip 层，也没有 `aria-describedby`（AR3）。API 无变更。有一处实现缺口列在 Current-state impact 下。 |
| 审查检查      | 拒绝会改变元素或层级的视觉 `type` 或 `weight`、渲染时缺失层级基线的标题，或用于截断的重复原生 tooltip。                                                                                                                                                                                                                                                        |
| 治理规则      | `spec:AST-024`（自定义视觉类型、字重优先级、无障碍不变）；`architecture:component-theming-surface/INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV8`。                                                                                                                                                                                            |

本表是审查用的投影；下方正文才是权威。

## Intent

Heading 用原生标题语义与主题化字体标记一个章节或页面标题。它把文档大纲（`level`、`accessibilityLevel`）与外观（`type`、`weight`）分开。它的使用方文档位于 `Text/Heading.doc.mjs`，作为 Text 文档的成员；本记录是 Heading 自己的契约。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：一处样式输出变更和一处 DOM 变更，公共 prop 或默认值均无变更：未截断的 Heading 会设置 `overflow-wrap`（`break-word`，在 Core 的 `anywhere` 容器内则为 `anywhere`），因此长的不可断词元会换行（FR3）。截断 Tooltip 在首次悬停、完成的点按或焦点时挂载（AR3）：在此之前，被钳制的 Heading 没有已关闭的 tooltip 层，DOM 中也没有 tooltip 描述。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **截断 tooltip 无法通过键盘访问（FR4）。** 被截断的 Heading 不可获得焦点，因此 Tooltip 不附带焦点触发器，视力正常的键盘用户无法显示被裁剪的文本，而 WCAG 2.2 2.1.1 期望功能可键盘操作。完整文本仍保留在 DOM 中供辅助技术使用。

## Ownership boundary

**拥有**

- `h1`–`h6` 元素、其 `heading` 主题目标，以及 `aria-level`。
- 基于层级的与内置 display 类型的尺寸、字重默认值、颜色，以及标题元素上的共享文本布局控件。
- 测量截断，并决定何时组合截断 Tooltip。

**不拥有 / 非目标**

- 主题注册与自定义视觉类型生成的声明——由 `spec:AST-024` 与主题构建拥有。
- 非标题文本——由 `component:Text` 拥有。
- 截断 tooltip 的表面、层与 `tooltip` 目标——由 Tooltip 拥有。
- Heading 内容——由调用方拥有。

## Public concepts

| 概念       | 封闭值或状态                                                      | 含义                                      | 按变体/方向/状态的可用性 | 默认值           | 所有者              | 稳定性 | 无效值行为                                                                    |
| ---------- | ----------------------------------------------------------------- | ----------------------------------------- | ------------------------ | ---------------- | ------------------- | ------ | ----------------------------------------------------------------------------- |
| 层级       | 1–6                                                               | 选择 `h1`–`h6` 以及该层级的视觉字号层级。 | 始终                     | 必需             | `component:Heading` | 稳定   | TypeScript 拒绝其他值。                                                       |
| 视觉类型   | `display-1`、`display-2`、`display-3`；主题新增                   | 替换该层级的视觉字号层级，而不改变语义。  | 始终                     | 未设置           | `component:Heading` | 稳定   | 主题新增的值会反映到 `heading` 上，并保留该层级的基线（`spec:AST-024` FR4）。 |
| 字重       | `normal`、`medium`、`semibold`、`bold`                            | 覆盖类型或层级的默认字重。                | 始终                     | 类型或层级默认值 | `component:Heading` | 稳定   | TypeScript 拒绝其他值。                                                       |
| 无障碍层级 | 1–6                                                               | 暴露给辅助技术的大纲层级。                | 始终                     | `level`          | `component:Heading` | 稳定   | TypeScript 拒绝其他值。                                                       |
| 截断       | `maxLines` 为 0（不截断）、1 或更多；tooltip 开启、关闭或指定位置 | 钳制行数，并在 Tooltip 中提供完整文本。   | 始终                     | 0；tooltip 开启  | `component:Heading` | 稳定   | —                                                                             |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 依据           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | `level` 渲染 `h1`–`h6`。`accessibilityLevel` 仅在其与 `level` 不同时添加 `aria-level`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试 |
| FR2 | 标题带有反映 `level`、`color` 以及所提供 `type` 与 `weight` 的 `heading` 目标。内置 `type` 应用其 display 字号与默认字重；否则应用该层级的字号。主题新增的 `type` 保留该层级字号作为其基线。显式 `weight` 优先于类型与层级默认值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR3 | `color` 默认为 `primary`；主题新增的颜色在主题为它上色之前保持 primary 基线。`hasCapsize` 渲染 `block` 并裁剪到大写字母高度；否则 `maxLines` 大于 1 时渲染行钳制盒，`maxLines={1}` 渲染 `block`，其余情况应用 `display`（默认 `block`）。`justify` 使用逻辑值；默认的 `start` 不设置对齐，因此元素跟随其容器。`textWrap` 与 `hasStrikethrough` 应用各自的文本处理。未截断时，比其行更长的词元会换行，因此在常规流中文本在 320 CSS px 下不会强制水平滚动（`spec:AST-020` FR1，WCAG 2.2 1.4.10 Reflow）。标题的 `overflow-wrap` 为 `break-word`，它保持 min-content，因此表格与自动尺寸列排版普通单词时保持不变；在以 `anywhere` 包裹其内容的 Core 容器内（CommandPaletteEmpty、Toast、FieldStatus、Banner），它变为 `anywhere`，与容器自身文本一致。flex 子项需要其容器提供 `min-width: 0`，而调用方自己设置 `overflow-wrap: anywhere` 的容器影响不到标题的文本。 | 当前源码与测试 |
| FR4 | `maxLines={1}` 用省略号裁掉一行；更大的值会钳制到该行数，除非设置了 `hasCapsize`，其 `block` 显示会移除钳制。截断时，`wordBreak` 对单行默认为 `break-all`，其余情况为 `break-word`。当文本被测量为已截断且 `hasTruncateTooltip` 不为 `false` 时，一个懒加载的 Tooltip 锚定到标题，在给定位置（默认 `above`）显示完整文本；不添加原生 `title`。`hasTruncateTooltip={false}` 不做任何测量。截断 tooltip 可从键盘打开（WCAG 2.2 2.1.1）。实现缺口：tooltip 仅在悬停与触摸时打开，因为标题不可获得焦点（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试 |
| FR5 | `ref` 到达标题元素。受支持的 DOM、ARIA、data 与事件 props 在派生出的 `aria-level` 之后到达该元素，因此调用方的 `aria-level` 优先；`xstyle`、`className` 与 `style` 按此顺序在组件样式之后合并，行钳制在 `style` 之后应用。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `level`、`color`、`type` 与 `weight` 重设 `heading` 样式，而不改变元素或层级。
- **AV2 — 视觉复用。** 任何层级都可以使用任何视觉类型。

### Representative states

| 状态               | 必需的不变式                                                                   | 允许的变化 |
| ------------------ | ------------------------------------------------------------------------------ | ---------- |
| 仅层级             | 按该层级的字号渲染 `h{level}`。                                                | 层级。     |
| Display 类型       | 同一元素；display 字号与字重；`data-type` 被反映。                             | 类型。     |
| 主题新增类型       | 同一元素；层级基线；`data-type` 被反映。                                       | 主题绘制。 |
| 无障碍层级覆盖     | `aria-level` 与该元素的层级不同。                                              | —          |
| 带 tooltip 的截断  | 被钳制的标题锚定一个带完整文本的 Tooltip，在首次悬停、完成的点按或焦点时挂载。 | 位置。     |
| 截断，tooltip 关闭 | 被钳制的标题；无测量；无 Tooltip。                                             | —          |

### Transformation and precedence order

- **ORD1 — 字重。** 显式 `weight` → 内置类型默认值 → 层级默认值（`spec:AST-024` FR8）。
- **ORD2 — 字号。** 内置 `type` → 层级字号（也是主题新增类型的基线）。
- **ORD3 — 显示。** `hasCapsize`（`block`）→ `maxLines` 大于 1（行钳制盒）→ `maxLines={1}`（`block`）→ `display` prop。

### Performance and resources

- **PR1 — 仅在需要时测量。** 仅当 `maxLines` 为正且 tooltip 启用时才测量截断；重新测量随尺寸与内容变化进行，无需为每个标题设置观察器；Tooltip 模块仅在文本被截断时加载，且 Tooltip 本身仅在首次悬停、完成的点按或焦点时挂载，因此在第一次交互之前，一页被钳制的文本不会挂载任何已关闭的 tooltip 层。

## Accessibility contract

- **AR1 — 原生标题。** 该元素是原生 `h1`–`h6`；视觉类型或字重绝不改变角色、层级或名称（`spec:AST-024` FR15）。
- **AR2 — 大纲覆盖。** `accessibilityLevel` 通过 `aria-level` 暴露不同的大纲层级，而不改变元素。
- **AR3 — 截断文本。** 完整文本保留在标题的 DOM 中；截断 Tooltip 是唯一的 tooltip，它添加的任何描述都属于 Tooltip。Tooltip 在首次悬停、完成的点按或被钳制标题上的焦点时挂载，且该交互会按 Tooltip 自身规则（Tooltip FR3–FR5）打开它，如同它已挂载时那样；在此之前标题不携带 tooltip 描述，因为其完整文本已在其 DOM 中。只有键盘焦点才算作挂载 tooltip 的焦点意图（`:focus-visible`，而不是触摸或笔按压自身的焦点）；点按也算，并会打开它，包括聚焦到可获得焦点的子项的点按，但文本输入控件上的点按除外，它只会聚焦该控件（Tooltip FR5）。

## Design relationships

| 结构或状态   | 设计要求                           | 表现权威       | 层级角色 | 组件契约          |
| ------------ | ---------------------------------- | -------------- | -------- | ----------------- |
| Heading      | 按层级或类型字号的章节或页面标题。 | 当前源码与文档 | 显著     | FR1–FR3、AR1、AR2 |
| 截断 tooltip | 标题被钳制时的完整文本。           | Tooltip        | 辅助     | FR4、AR3          |

主题化：标题元素是唯一的 `heading` 目标。它的使用方文档是 `Text/Heading.doc.mjs` 的成员，且未列出任何结构，因此不声明结构主题化块；截断 tooltip 的目标属于 Tooltip。

## Family and system relationships

- `spec:AST-024` 拥有自定义视觉类型、字重优先级，以及“视觉变更不改变无障碍”这一规则；FR2、ORD1 与 AR1 应用它。
- `component:Text` 与 Heading 共享类型样式与截断机制。
- `architecture:component-theming-surface` 设定 `heading` 目标遵循的规则（INV6），并把 `type` 限定为可主题扩展的轴（INV14）。

## Verification map

| 契约                     | 验证                                                                                                                                                                                                                         | 代表性状态                                                                                      | 变更或失败预期                                                                                                                                                                                                                                                           | 审计章节                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| FR1, AR2                 | `Heading.test.tsx` 的 level 与 `accessibilityLevel` 测试                                                                                                                                                                     | 层级 1–6；不同与相同的覆盖                                                                      | 错误的元素、不同覆盖时缺失 `aria-level`，或为相同覆盖添加 `aria-level` 都算失败。                                                                                                                                                                                        | `audit:Heading/a11y`     |
| FR2                      | `Heading.test.tsx` 的目标、类型、主题新增类型、字重与省略类型测试；`extensibleAxes.test.ts`；`HeadingAudit.a11y.chromium.spec.ts` 在 AuditMatrix story 上                                                                    | display 类型、主题新增类型、字重                                                                | 丢失 `heading` class 或 `data-level`、`data-color`、`data-type`、`data-weight` 的反映，被反映的省略类型，或主题新增类型丢失其层级基线都算失败。display 尺寸顺序错乱，或显式 `bold` 不比 display 默认值更粗，则浏览器规格失败。缺口：层级字号与层级默认字重没有绘制检查。 | `audit:Heading/theming`  |
| FR3                      | 稳定视觉基线 `core-heading--level-1`；`Heading.stories.tsx`；`HeadingAudit.a11y.chromium.spec.ts`                                                                                                                            | 层级 1 默认；次要颜色；`center` 与 `end` 对齐                                                   | 层级 1 的字号、颜色或显示发生变更会以变更形式返回审查；`justify` 未解析为逻辑 `center` 或 `end`，或标题文本低于其 WCAG 对比度阈值，则浏览器规格失败。缺口：`display` 优先级、`textWrap`、大写高度裁剪、删除线与主题新增颜色的基线都没有自动检查。                        | `audit:Heading/behavior` |
| FR3 (reflow)             | `Heading.test.tsx` 长的不可断词元；`TextReflow.a11y.chromium.spec.ts`；`scripts/text-overflow-wrap-anywhere.test.mjs`                                                                                                        | 一个长的不可断词元，未截断与单行截断，在 320 CSS px 下；CommandPaletteEmpty 与 Banner 内的 Text | 未截断标题中不换行的词元、在 320 px 下横向滚动的页面、不再在单行上裁剪的单行截断、CommandPaletteEmpty 或 Banner 内丢失容器 `anywhere` 换行或越过行内边界的 Text，或设置 `overflow-wrap: anywhere` 却不把它传递给 Text 的 Core 样式，都算失败。                           | `audit:Heading/a11y`     |
| FR4, PR1                 | `Heading.test.tsx` 截断测量测试；`useTruncation.test.tsx`；`HeadingAudit.a11y.chromium.spec.ts`                                                                                                                              | tooltip 开启与关闭；内容变更；一行与两行                                                        | tooltip 关闭时测量、开启时不测量，或漏掉重新测量都算失败。单行标题没有省略号、两行钳制未保持两行，或被裁剪标题悬停时不显示完整文本 tooltip，则浏览器规格失败。缺口：`wordBreak` 默认值与 tooltip 位置没有自动检查。                                                      | `audit:Heading/behavior` |
| AR3 (tooltip mount), PR1 | `Heading.test.tsx` 的 "the truncation tooltip mounts on the first interaction" 用例：任何交互前没有 tooltip 层，首次悬停时有一个；共享的挂载行为由 `Text.test.tsx` 的用例覆盖，因为 Text 与 Heading 共享 `TruncationTooltip` | 首次悬停、点按或焦点之前与之后的截断                                                            | 首次交互前出现 tooltip 层或描述，或首次悬停、点按、焦点未按 Tooltip 自身规则打开它，都算失败。缺口：没有对描述做无障碍树检查（`spec:AST-009` FR3）。                                                                                                                     | `audit:Heading/a11y`     |
| FR5                      | `Heading.test.tsx` 的 ref、`id`、透传、`aria-level` 优先级、样式输入与行钳制测试                                                                                                                                             | 重新渲染；`id`；`data-testid`；调用方 `aria-level`；`className`、`xstyle` 与 `style`            | 脱离的 ref、丢失的 `id` 或测试 id、覆盖调用方的派生 `aria-level`、被丢弃或在组件样式之前合并的 `className` 或 `xstyle`，或替换钳制的调用方 `WebkitLineClamp` 都算失败。                                                                                                  | `audit:Heading/behavior` |
| AR1                      | `Heading.test.tsx` display 类型元素测试                                                                                                                                                                                      | 带 display 与主题新增类型的层级                                                                 | 改变元素的视觉类型算失败。                                                                                                                                                                                                                                               | `audit:Heading/a11y`     |
| AR3                      | `Heading.test.tsx` 截断 title 测试；`HeadingAudit.a11y.chromium.spec.ts`                                                                                                                                                     | 被截断的标题                                                                                    | 被截断标题上的原生 `title` 在两者中都算失败。                                                                                                                                                                                                                            | `audit:Heading/a11y`     |
| AR1, AR2                 | `HeadingAudit.a11y.chromium.spec.ts` 读取 Chromium 的无障碍树（`spec:AST-009` FR3）                                                                                                                                          | 层级、相同与不同的覆盖、display 类型                                                            | 标题暴露的角色或层级不同于其元素或所需的 `aria-level` 时，浏览器规格失败。                                                                                                                                                                                               | `audit:Heading/a11y`     |

## Decision log

无记录。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到这些内容的拥有者。
