---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [behavior, accessibility, public-api, theming]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteList.test.tsx,
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/CommandPaletteList.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: []
---

# CommandPaletteList component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `CommandPaletteList`，接受 `label`、`children`、`ref`、`xstyle`、`className`、`style` 以及根 DOM 属性：它既是 CommandPalette 渲染的具名结果 listbox，也可作为独立的结果列表。                                                           |
| 行为            | 根元素是一个 `listbox`，其名称取自调用方的 `aria-label`，否则取 `label`，否则取已翻译的默认值（调用方的 `aria-label` 目前是 FR2 缺口）；在 CommandPalette 内部，仅当存在可选结果时它才是 listbox，并携带查询字段所控制的上下文列表 id。 |
| 最终用户影响    | 屏幕阅读器用户可以从查询字段到达具名结果列表；溢出的结果在列表内部滚动，而不是让命令面板增高。                                                                                                                                          |
| 构建者影响      | 构建者显式提供的 `aria-label` 本应用于命名该列表；目前组件的名称会取代它（FR2 缺口）。                                                                                                                                                  |
| 兼容性/就绪状态 | 记录已发布的行为；无公共变更。存在两处实现缺口，列在“当前状态影响”下；一个所有者问题仍未解决。                                                                                                                                          |
| 审查检查        | 拒绝以下情况：出现第二个 list-id 所有者、调用方可替换的 `listbox` 角色、无法到达根元素的调用方 `aria-label`、丢失的原生或样式输入，或列表目标被移出滚动根元素。                                                                         |
| 治理规则        | `architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface`；WAI-ARIA 1.2 `listbox`。                                                                                                                  |

此表是审查投影；下文的正文具有权威性。

## Intent

CommandPaletteList 是命令面板的滚动结果容器。在 CommandPalette 内部，它是查询字段所控制的 listbox。独立使用时，它围绕调用方提供的选项内容呈现一个具名结果 listbox。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用；该列表不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档和发行说明。

## Current-state impact

- **独立的列表没有键盘模型。** 独立列表暴露一个选项 listbox，但没有所属的键盘模型，因此键盘用户无法在其选项中移动；WAI-ARIA 1.2 将 listbox 的键盘交互归属于其所有者（AR3、OQ1）。
- **列表会取代调用方的名称（FR2）。** 使用方属性在组件的可访问名称之前展开，因此构建者显式的 `aria-label` 永远无法命名该列表，而 `architecture:public-component-api` 的 INV5 允许它这样做。

## Ownership boundary

**拥有**

- listbox 根元素及其可访问名称：来自调用方的 `aria-label`，否则 `label`，否则已翻译的默认值（FR2）；在 CommandPalette 内部且不存在可选结果时丢弃这两者。
- 将 CommandPalette 上下文列表 id 应用到根元素。
- 根元素上的原生透传、`ref` 与样式输入组合。
- 对溢出的子元素进行块轴滚动，并使用间距刻度（spacing-scale）的内边距与间隙。

**不拥有 / 非目标**

- List-id 生成、查询字段焦点、活动后代（active descendant）、方向键导航、悬停高亮、回车选择、搜索，以及结果与空状态之间的选择——由 `component:CommandPalette` 拥有。
- 聚合 List 解剖条目及其 `command-palette-list` 目标映射——由 `component:CommandPalette` 拥有。
- 选项语义、状态与激活；分组语义与标题——由 CommandPaletteItem 和 CommandPaletteGroup 拥有。
- 独立的组合键盘模型；其方向仍为 OQ1。

## Public concepts

| 概念       | 封闭取值或状态                                    | 含义                                       | 按变体/方向/状态的可用性      | 默认值                                                   | 所有者                         | 稳定性 | 无效值行为                                                   |
| ---------- | ------------------------------------------------- | ------------------------------------------ | ----------------------------- | -------------------------------------------------------- | ------------------------------ | ------ | ------------------------------------------------------------ |
| 可访问名称 | 调用方 `aria-label`；调用方 `label`；已翻译默认值 | 为结果 listbox 播报的名称。                | 所有用法                      | `@astryx.commandPalette.list.label`（英文为 “Commands”） | `component:CommandPaletteList` | 稳定   | 空的 `label` 会让 listbox 保持未命名；调用方应提供真实名称。 |
| 列表身份   | 上下文列表 id；调用方 `id`                        | CommandPalette 的查询字段所引用的 DOM id。 | CommandPalette 内部；独立使用 | CommandPalette 内部使用上下文 id；独立使用调用方 `id`    | `component:CommandPalette`     | 稳定   | 在 CommandPalette 内部，调用方 `id` 会被上下文 id 取代。     |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| FR1 | 原生属性与 `ref` 到达 listbox 根元素，使用方的 `className` 和 `style` 与列表目标及基础样式合并。在 CommandPalette 内部，根元素 id 是上下文列表 id；独立使用时保留调用方 `id`。                                                                                                                                                                                                                                                                                                 | 当前源码与测试 |
| FR2 | 独立使用时，以及在 CommandPalette 内部至少存在一个可选结果时，根元素暴露 `role=listbox`，调用方的 `role` 不会取代它：在 CommandPalette 内部是因为组合语义由组件拥有并取代透传，正如 `component:CommandPaletteInput` 的 AR3 所记录；独立使用时则依据本记录自身的规则，其名称取自调用方显式的 `aria-label`，否则 `label`，否则已翻译的默认值（`architecture:public-component-api` 的 INV5）。实现缺口：组件的名称取代了调用方的 `aria-label`（见“当前状态影响”）。否则适用 AR4。 | 当前源码与测试 |
| FR3 | 在 CommandPalette 内部，查询字段的 `aria-controls` 指明该 listbox 的 id。                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试 |
| FR4 | 根元素以单列布局排列子元素，使用间距刻度的内边距和间隙，在 flex 父元素内增长，将高度上限设为父元素的高度，并在自身内部滚动溢出的子元素。                                                                                                                                                                                                                                                                                                                                       | 当前源码       |

### Allowed variation

- **AV1 — 子元素。** 条目、分组和空状态可在数量、顺序和内容上变化而不改变根元素，但 AR4 所述情况除外。
- **AV2 — 布局。** 使用方的 `xstyle`、class 和 style 可以调整根元素，但不取代其 role、id 或目标。

### Representative states

| 状态                | 必需不变式                                                                                              | 允许的变化           |
| ------------------- | ------------------------------------------------------------------------------------------------------- | -------------------- |
| 独立结果            | listbox 的名称取自调用方 `aria-label`，否则 `label`，否则已翻译的默认值（`aria-label` 存在 FR2 缺口）。 | 条目数量与分组。     |
| CommandPalette 内部 | 根元素 id 等于查询字段的 `aria-controls` 值。                                                           | 结果数量与分组。     |
| 溢出的结果          | 结果在列表内部滚动，而不是超出容器继续增长。                                                            | 容器与条目高度。     |
| 空的面板结果        | 在 CommandPalette 内部且无可选结果时，根元素没有 role，也没有名称。                                     | 空消息或待处理消息。 |

### Transformation and precedence order

- **ORD1 — 根属性。** 先使用方原生属性，然后是组件拥有的 id 和 `listbox` 角色；可访问名称适用，除非调用方提供自己的 `aria-label`（FR2；目前它会取代调用方提供的）。
- **ORD2 — 样式。** 先列表目标，然后带 `xstyle` 的基础样式，然后使用方 class，最后使用方 style。

### Performance and resources

- **PR1 — 渲染之外无额外工作。** 该列表不增加状态、effect、监听器或观察器；它仅在渲染期间读取翻译和 CommandPalette 上下文。

## Accessibility contract

- **AR1 — 名称。** listbox 以调用方显式的 `aria-label`，否则 `label`，否则已翻译的默认值作为其可访问名称（FR2 缺口）。
- **AR2 — 关系。** 在 CommandPalette 内部，查询字段通过其 id 控制 listbox；CommandPalette 在其 combobox 模型下拥有焦点和键盘导航。
- **AR3 — 独立使用缺口。** 独立列表暴露一个选项 listbox，但没有所属的键盘模型（当前状态影响；OQ1）。
- **AR4 — 空内容。** 在 CommandPalette 内部且不存在可选结果时，根元素没有 role 也没有可访问名称，因此屏幕阅读器将空消息或待处理消息当作普通内容读取，而不会遇到空弹层；WAI-ARIA 1.2 要求 listbox 拥有选项。独立列表保持为 listbox，由调用方提供选项。

## Design relationships

| 解剖或状态 | 设计要求                                               | 表现形式权威       | 层级角色 | 组件契约 |
| ---------- | ------------------------------------------------------ | ------------------ | -------- | -------- |
| List       | 在一个滚动列中呈现结果选项，带间距刻度的内边距和间隙。 | 当前源码与公共文档 | 支撑     | FR1、FR4 |

## Family and system relationships

- `component:CommandPalette` 拥有 list-id 生成、键盘导航、悬停高亮、聚合解剖，以及 `command-palette-list` 目标映射；本组件应用该 id 并绘制 List。
- `architecture:public-component-api` 拥有原生透传、样式组合和 ref。
- `architecture:component-theming-surface` 拥有目标资格与聚合 List 解剖映射。
- `architecture:component-test-sufficiency` 拥有下方验证映射所依据的证据规则。

## Verification map

| 契约          | 验证                                                     | 代表性状态                                 | 变更或失败预期                                                                                                                | 审计部分                                 |
| ------------- | -------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| FR1           | `CommandPaletteList.test.tsx`                            | 带 ref、class 和 style 的独立根元素        | 断开 `ref`，或丢弃使用方 class 或列表目标，会使聚焦的 DOM 断言失败。                                                          | `audit:CommandPaletteList/api`           |
| FR2, AR1, AR4 | `CommandPaletteList.test.tsx`                            | 默认标签与调用方标签；有结果和无结果的面板 | 移除 role 或名称，或在空的命令面板表面上保留它们，会使 role 与名称断言失败。缺口：没有测试覆盖调用方 `role` 或 `aria-label`。 | `audit:CommandPaletteList/a11y`          |
| FR3, AR2      | `CommandPaletteList.test.tsx`, `CommandPalette.test.tsx` | 内联 CommandPalette                        | 丢弃上下文 id 会破坏查询字段关系的断言。                                                                                      | `audit:CommandPaletteList/a11y`          |
| FR4           | `themingTargets.test.ts`；RTL 验证为不适用               | 独立列表                                   | 丢失目标会使目标清单失败。                                                                                                    | `audit:CommandPaletteList/theming`       |
| AR3           | 源码审查                                                 | 独立列表                                   | 缺口：不存在可供测试的独立键盘模型（OQ1）。                                                                                   | `audit:CommandPaletteList/accessibility` |
| PR1           | 源码审查                                                 | 每种状态                                   | 缺口：如果列表增加状态、effect、监听器或观察器，没有自动化检查会失败。                                                        | `audit:CommandPaletteList/behavior`      |

从源码阅读得出，尚无聚焦的测试：

- FR4：单列布局、间距、高度上限与内部滚动。
- PR1：没有状态、Effect、监听器或观察器。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 独立使用时 CommandPaletteList 应暴露什么键盘契约？**（`human-api`）独立列表暴露一个选项 listbox，但没有所属的键盘模型。需决定：是由公共的组合所有者提供该模型，还是独立组合采用不同的 role，抑或独立使用保持为仅指针呈现。

## Content boundary

本文件不重复使用方属性表/示例、实现步骤或家族/系统规则。它链接到这些内容的所有者。
