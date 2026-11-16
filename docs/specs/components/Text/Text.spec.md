---
schema_version: 3
template_version: 7
kind: component
id: component:Text
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
    packages/core/src/Text/Text.test.tsx,
    packages/core/src/Text/useTruncation.test.tsx,
    packages/core/src/Text/__tests__/TextReflow.a11y.chromium.spec.ts,
    scripts/text-overflow-wrap-anywhere.test.mjs,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Text.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009]
---

# Text component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 一个多态文本元素，具有语义化的 `type`、可选的 `size`、`color` 和 `weight` 覆盖、`as` 元素选择，以及 `Text.doc.mjs` 中记录的文本布局控制项。                                                                                                                                                                                                                    |
| 行为          | `type` 从主题设置尺寸、字重和默认颜色；主题新增的类型和颜色回退到 body 与 primary 基线；被截断的文本在 Tooltip 中提供其完整内容。                                                                                                                                                                                                                              |
| 最终用户影响  | 读者在整个产品中获得一致的字型；被裁剪的文本在悬停时和 DOM 中都保留其完整内容。                                                                                                                                                                                                                                                                                |
| 构建者影响    | 未被截断的 Text 中，一个很长且无断点的 token 会换行。在 flex 行内，flex 子项需要 `min-width: 0` 才能应用换行；调用方自己的容器设置 `overflow-wrap: anywhere` 不会作用到 Text 的文本；Core 的 `anywhere` 容器会将其换行传递给它。截断 Tooltip 在首次悬停、完成的点按或聚焦时挂载（AR2）。                                                                       |
| 兼容性/就绪度 | 已发布的行为记录为 current，包含一处样式输出变更和一处 DOM 变更：未被截断的 Text 设置 `overflow-wrap`（`break-word`，或在 Core 的 `anywhere` 容器内为 `anywhere`）。截断 Tooltip 在首次悬停、完成的点按或聚焦时挂载，因此在此之前，被裁剪的 Text 没有 tooltip 层，也没有 `aria-describedby`（AR2）。无 API 变更。Current-state impact 一节列出了一处实现缺口。 |
| 审查检查      | 否决渲染为无样式的主题新增类型或颜色、在截断 Tooltip 之外另加原生 `title`、或在 tooltip 关闭时进行测量。                                                                                                                                                                                                                                                       |
| 管辖规则      | `architecture:component-theming-surface/INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV8`。                                                                                                                                                                                                                                                      |

此表是审查投影；下文正文具有权威性。

## Intent

Text 渲染主题化的正文、标签、说明文字和展示文本。它拥有从语义类型到主题排版的映射、它所渲染的元素，以及该元素的截断行为。Heading 在 `Text.doc.mjs` 中与 Text 并列记录，但它是一个独立组件，拥有自己的记录。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：一处样式输出变更和一处 DOM 变更，没有公开 prop 或默认值变更：未被截断的 Text 设置 `overflow-wrap`（`break-word`，或在 Core 的 `anywhere` 容器内为 `anywhere`），因此一个很长且无断点的 token 会换行（FR3）。截断 Tooltip 在首次悬停、完成的点按或聚焦时挂载（AR2）：在此之前，被裁剪的 Text 没有已关闭的 tooltip 层，DOM 中也没有 tooltip 描述
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **截断 tooltip 无法通过键盘访问（FR4）。** 被截断的 Text 不可聚焦，因此 Tooltip 不附加聚焦触发器，有视力的键盘用户无法显示被裁剪的文本，而 WCAG 2.2 2.1.1 期望功能可通过键盘操作。完整文本留在 DOM 中供辅助技术使用。

## Ownership boundary

**拥有**

- 多态文本元素及其 `text` 主题化目标。
- 基于类型的尺寸、字重和默认颜色；尺寸、颜色和字重覆盖；以及该元素上的文本布局控制项。
- 测量截断，并决定何时组合截断 Tooltip。
- 它为其内容提供的裁剪。被裁剪的 Text 中的 Link 以内联方式布局，以便裁剪将其截断，并将其可见的聚焦环保留为内嵌环（`component:Link` FR6）；Text 通过内部 context 提供该裁剪。块级内容（例如组合 stack 的 Link）在被裁剪的 Text 中不受支持，因为它会破坏裁剪。

**不拥有 / 非目标**

- Heading、其 `h1`–`h6` 元素及其 `heading` 目标——由 `component:Heading` 拥有。`Text.doc.mjs` 中列出的 `heading` 目标和 Heading 解剖结构属于该记录。
- 截断 tooltip 表面、层和 `tooltip` 目标——由 Tooltip 拥有。
- 排版 token 值——由当前主题拥有。
- 文本内容——由调用方拥有。

## Public concepts

| 概念      | 封闭取值或状态                                                                                             | 含义                                                                                      | 按变体/方向/状态的可用性 | 默认值                                                                | 所有者           | 稳定性 | 无效值行为                                                 |
| --------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------ | --------------------------------------------------------------------- | ---------------- | ------ | ---------------------------------------------------------- |
| 类型      | `body`、`large`、`label`、`supporting`、`code`、`display-1`、`display-2`、`display-3`、`inherit`；主题新增 | 选择尺寸、字重、行高和默认颜色。                                                          | 始终                     | `body`                                                                | `component:Text` | 稳定   | 主题新增的类型会反映在 `text` 上，并以 body 基线样式渲染。 |
| 颜色      | 内置文本颜色；主题新增                                                                                     | 文本颜色。                                                                                | 始终                     | `supporting` 为 `secondary`，`inherit` 为 `inherit`，其余为 `primary` | `component:Text` | 稳定   | 主题新增的颜色会反映在 `text` 上，并以 primary 基线渲染。  |
| 元素      | `span`、`p`、`div`、`label`、`h1`、`h2`、`h3`                                                              | 所渲染的元素。                                                                            | 始终                     | `span`                                                                | `component:Text` | 稳定   | TypeScript 拒绝其他值。                                    |
| 截断      | `maxLines` 为 0（无）、1 或更多；tooltip 开启、关闭或位于某个位置                                          | 裁剪行并在 Tooltip 中提供完整文本。                                                       | 始终                     | 0；tooltip 开启                                                       | `component:Text` | 稳定   | —                                                          |
| 截断 hook | `useTruncation` 选项：`maxLines`，以及 `isExpanded` 为 true 或 false                                       | `isExpanded`：在文本完整显示期间传入 true；当被裁剪时，该 hook 会持续报告文本是否被截断。 | 始终                     | `isExpanded` 为 false                                                 | `component:Text` | 稳定   | —                                                          |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| FR1 | Text 渲染由 `as` 选择的一个元素（默认 `span`），该元素携带 `text` 目标，反映 `type`、`size` 和解析后的 `color`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试 |
| FR2 | 内置 `type` 应用其尺寸、行高和默认字重；主题新增的类型应用 body 基线。`size` 覆盖该类型的尺寸，同时保留其其他属性；`weight` 覆盖该类型的默认字重。解析后的颜色是 `color`，否则是该类型的默认值；主题新增的颜色应用 primary 基线。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试 |
| FR3 | `hasCapsize` 渲染 `block` 并裁剪到大写字母高度；否则，大于 1 的 `maxLines` 渲染行裁剪盒，`maxLines={1}` 渲染 `block`，其余情况下应用 `display`（默认 `inline`）。`justify` 使用逻辑值；默认值 `start` 不设置对齐，因此元素遵循其容器的对齐方式。`textWrap`、`hasStrikethrough` 和 `hasTabularNumbers` 应用各自的文本处理。在未截断的情况下，长于其行的 token 会换行，因此在常规流中，文本在 320 CSS px 下不会强制水平滚动（`spec:AST-020` FR1，WCAG 2.2 1.4.10 Reflow）。该元素的 `overflow-wrap` 为 `break-word`，这会保留 min-content，因此表格和自动调整尺寸的列会按原样布局普通单词；在 Core 中用 `anywhere` 换行其内容的容器内（CommandPaletteEmpty、Toast、FieldStatus、Banner），它为 `anywhere`，与该容器自身的文本一致。flex 子项需要其容器提供 `min-width: 0`；调用方自己设置 `overflow-wrap: anywhere` 的容器不会作用到该元素的文本。 | 当前源码与测试 |
| FR4 | `maxLines={1}` 用省略号裁剪一行；更大的值裁剪到相应行数，除非设置了 `hasCapsize`，其 `block` 显示会移除裁剪。在截断情况下，`wordBreak` 对单行默认为 `break-all`，否则为 `break-word`。当文本被测量为已截断且 `hasTruncateTooltip` 不为 `false` 时，一个锚定到该元素的惰性加载 Tooltip 在给定位置显示完整文本（默认 `above`），并且 Text 不添加原生 `title`。`hasTruncateTooltip={false}` 不进行测量。截断 tooltip 可以从键盘打开（WCAG 2.2 2.1.1）。实现缺口：tooltip 仅在悬停和触摸时打开，因为该元素不可聚焦（见 Current-state impact）。当内容变化而没有调整尺寸时，截断会重新测量。                                                                                                                                                                                                                                                          | 当前源码与测试 |
| FR5 | `ref` 到达该元素。受支持的 DOM、ARIA、data 和事件 prop 都会到达它；`xstyle`、`className` 和 `style` 在组件样式之后按该顺序合并，行裁剪在 `style` 之后应用。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `type`、`size` 和 `color` 重新设置 `text` 的样式，并定义新增的类型和颜色，而无需更改元素。
- **AV2 — 元素。** 调用方选择任何受支持的 `as` 元素。

### Representative states

| 状态               | 必需不变式                                                                         | 允许的变体 |
| ------------------ | ---------------------------------------------------------------------------------- | ---------- |
| 默认               | 带 body 类型和 primary 颜色的 `span`。                                             | 内容。     |
| Supporting         | 带 secondary 颜色的 supporting 类型。                                              | 颜色覆盖。 |
| 主题新增类型       | body 基线；`data-type` 命名新增的类型。                                            | 主题绘制。 |
| 带 tooltip 的截断  | 被裁剪的元素锚定一个 Tooltip，在首次悬停、完成的点按或聚焦时挂载；无原生 `title`。 | 位置。     |
| 截断，tooltip 关闭 | 被裁剪的元素；无测量；无 Tooltip。                                                 | —          |

### Transformation and precedence order

- **ORD1 — 颜色。** `color` → 类型默认值 → `primary`；主题新增的值从 primary 基线进行样式化。
- **ORD2 — 尺寸与字重。** `size` 和 `weight` → 类型值 → 主题新增类型的 body 基线。
- **ORD3 — 显示。** `hasCapsize`（`block`）→ 大于 1 的 `maxLines`（行裁剪盒）→ `maxLines={1}`（`block`）→ `display` prop。

### Performance and resources

- **PR1 — 仅在需要时测量。** 仅当 `maxLines` 为正且 tooltip 启用时才测量截断；重新测量随尺寸和内容变化进行，不使用逐元素 observer；Tooltip 模块仅在文本被截断时加载，而 Tooltip 本身仅在首次悬停、完成的点按或聚焦时挂载，因此在首次交互之前，一页被裁剪的文本不会挂载任何已关闭的 tooltip 层。

## Accessibility contract

- **AR1 — 调用方选择的语义。** Text 不添加 role；其语义即 `as` 元素的语义。用于小节标题的 Heading 语义来自 `component:Heading`。
- **AR2 — 被截断的文本。** 完整文本留在该元素的 DOM 中；截断 Tooltip 是唯一的 tooltip，它添加的任何描述都属于 Tooltip。Tooltip 在被裁剪元素的首次悬停、完成的点按或聚焦时挂载，该交互会按 Tooltip 自身的规则（Tooltip FR3–FR5）以挂载后的方式打开它；在此之前，该元素不携带 tooltip 描述，因为其完整文本已在其 DOM 中。只有键盘聚焦才算作挂载 tooltip 的聚焦意图（`:focus-visible`，而非触摸或笔按压自身的聚焦）；点按算作打开，包括聚焦可聚焦子项的点按，但文本输入控件上的点按除外，它只会聚焦该控件（Tooltip FR5）。

## Design relationships

| 解剖或状态   | 设计要求                     | 表示权威            | 层级角色 | 组件契约     |
| ------------ | ---------------------------- | ------------------- | -------- | ------------ |
| Text         | 主题化排版中的调用方内容。   | 当前源码与文档      | 突出     | FR1–FR3、AR1 |
| Heading      | 与 Text 并列记录的独立组件。 | `component:Heading` | 突出     | —            |
| 截断 tooltip | 元素被裁剪时的完整文本。     | Tooltip             | 辅助     | FR4、AR2     |

主题化：该元素是唯一的 `text` 目标。`Text.doc.mjs` 还列出了 `heading` 目标和 Heading 解剖结构，它们由 `component:Heading` 拥有，因此本记录不声明解剖结构-主题化区块，而不是将 `heading` 指派给 Text。

## Family and system relationships

- `component:Heading` 共享 Text 的类型样式和截断机制，并拥有自己的元素、目标和无障碍。
- `architecture:component-theming-surface` 设定 `text` 目标遵循的规则（INV6）以及主题新增类型和颜色的安全基线（INV14）。
- `architecture:public-component-api` 拥有 ref、透传和样式输入规则；FR5 应用它们。

## Verification map

| 契约                     | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 代表性状态                                                                                              | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                    | 审计小节              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| FR1、AR1                 | `Text.test.tsx` 的元素、目标和反映测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 默认 `span`；`p`、`div`、`label`                                                                        | 错误的元素、丢失的 `text` 类，或丢失 `data-type`、`data-size` 或 `data-color` 反映都会失败。缺口：没有测试断言 Text 不添加 role，也没有无障碍树检查证明该元素的 role（`spec:AST-009` FR3）。                                                                                                                                                                                                                                      | `audit:Text/behavior` |
| FR2                      | `Text.test.tsx` 的主题新增类型和颜色测试；稳定视觉基线 `core-text--body`                                                                                                                                                                                                                                                                                                                                                                                                                                        | 主题新增类型和颜色；内置颜色；body 默认值                                                               | 主题新增类型或颜色失去其反映、主题新增颜色失去其 primary 基线，或丢失颜色覆盖，都会失败；body 字号或颜色的改变会作为变更返回供审查。缺口：没有测试断言主题新增类型的 body 基线（自定义类型测试只检查类和 `data-type`），内置类型测试只断言存在性，因此每种类型的尺寸、行高和字重，以及 `size` 和 `weight` 覆盖在绘制中的表现，都没有自动化检查。每种类型的默认颜色和内置颜色的绘制也没有自动化检查；颜色测试只断言 `data-color`。 | `audit:Text/theming`  |
| FR3                      | `Text.stories.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 显示、大写高度裁剪、换行、删除线、等宽数字                                                              | 缺口：prop 测试只断言存在性，因此 `display` 优先级、`justify` 和每种文本处理都没有自动化检查。                                                                                                                                                                                                                                                                                                                                    | `audit:Text/behavior` |
| FR3（重排）              | `Text.test.tsx` 的长且无断点 token；`TextReflow.a11y.chromium.spec.ts`；`scripts/text-overflow-wrap-anywhere.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                          | 在 320 CSS px 下内联和块级、未截断和单行截断的长且无断点 token；CommandPaletteEmpty 和 Banner 内的 Text | 未截断文本中的 token 不换行、页面在 320 px 下横向滚动、单行截断不再在一行内裁剪、CommandPaletteEmpty 或 Banner 内的 Text 失去容器的 `anywhere` 换行或越过内联边界，或 Core 样式设置 `overflow-wrap: anywhere` 却不将其传递给 Text，都会失败。                                                                                                                                                                                     | `audit:Text/a11y`     |
| FR4、AR2、PR1            | `Text.test.tsx` 的原生 title 和截断测量测试；`useTruncation.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                           | 带 tooltip 的截断；tooltip 关闭；内容变化                                                               | 原生 `title`、tooltip 关闭时进行测量、tooltip 开启时不测量，或漏掉重新测量，都会失败。缺口：省略号和行裁剪、`wordBreak` 默认值，以及 tooltip 的外观和位置都没有自动化检查。                                                                                                                                                                                                                                                       | `audit:Text/a11y`     |
| AR2（tooltip 挂载）、PR1 | `Text.test.tsx` 的“截断 tooltip 在首次交互时挂载”用例：任何交互之前没有 tooltip 层或描述；首次悬停挂载并在悬停延迟后打开它；先离开的指针不打开任何东西；挂载它的点按会打开它，外部点按会关闭它；变成滚动的触摸不挂载任何东西；被裁剪元素内的键盘聚焦会挂载它；聚焦可聚焦子项的点按仍会打开 Tooltip，文本框上的点按只聚焦它，在 Tooltip 挂载前后都是如此，且用键盘 Tab 到文本框会挂载它；调用方的 `preventDefault` 不会阻止挂载。`ManyTruncatedRows` story 上的真实浏览器挂载计数（500 行：加载时无 tooltip 层） | 首次悬停、点按或聚焦之前和之后被截断                                                                    | 首次交互之前出现 tooltip 层或描述，或首次悬停、点按或聚焦未能按 Tooltip 自身的规则打开它，都会失败。缺口：没有对描述的无障碍树检查（`spec:AST-009` FR3）。                                                                                                                                                                                                                                                                        | `audit:Text/a11y`     |
| FR5                      | `Text.test.tsx` 的 ref 和透传测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 重新渲染；`data-testid`                                                                                 | 分离的 ref 或丢失的 test id 都会失败。缺口：没有测试覆盖其他 DOM 透传、样式输入合并顺序，或 `style` 之后的行裁剪。                                                                                                                                                                                                                                                                                                                | `audit:Text/behavior` |

## Decision log

无记录。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤，或家族/系统规则。它链接到它们的所有者。
