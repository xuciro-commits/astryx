---
schema_version: 3
template_version: 7
kind: component
id: component:ListItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming]
verified_by:
  [
    packages/core/src/List/List.test.tsx,
    packages/core/src/List/listLayoutUpdates.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-057, spec:AST-103]
---

# ListItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `ListItem` 带有 `label`、`description`、`startContent`、`endContent`、`onClick`、`interactiveRef`、`href`、`target`、`rel`、`align`、`isDisabled`、`isSelected`、`itemKey`、`swipe`、`xstyle`、`className`、`style` 和 `ref`，并在 `spec:AST-057` CLN-0025 之前带有已弃用的 `swipeActions` 与 `swipeBehavior`；该行承载 `component:List` 的 `list-item` 目标。`itemKey` 是该条目的键（`spec:AST-103` DEC-4）。 |
| Behavior                | 由 `component:Item` 渲染的一行 `<li>`，它接收每一个行 prop。在 List 内，该行采用列表的密度、分隔线、边缘处理和标记；在 List 外，它使用 Item 的默认值，不绘制标记。                                                                                                                                                                                                                                             |
| End-user impact         | 每个列表条目读作一个列表项，其前面是列表的项目符号、编号或任务复选框，并具有 Item 赋予任何行的相同交互。                                                                                                                                                                                                                                                                                                       |
| Builder impact          | 已弃用的 `swipeActions` 与 `swipeBehavior` 在 `spec:AST-057` DEP-0017 下迁移到 `swipe={createSwipe(…)}`；其 `astryx upgrade` codemod 是从弃用版本开始的可选提前迁移，并会在 0.8.0 的升级中随 CLN-0025 的移除再次运行。                                                                                                                                                                                         |
| Compatibility/readiness | 记录已发布的行为；`itemKey` 是新增的。有一处实现缺口，列在 Current-state impact 之下。                                                                                                                                                                                                                                                                                                                         |
| Review checks           | 拒绝不是 `<li>` 的行、ListItem 级别的边缘、密度或分隔线 prop、在带标记的 List 之外绘制的标记，以及被丢弃的 Item prop。                                                                                                                                                                                                                                                                                         |
| Governing rules         | `component:Item`（用于起始与结束内容的 `align`）；`component:List`；`family:navigation-destinations`；`spec:AST-057`；`spec:AST-103`；`architecture:component-theming-surface`；`architecture:component-style-authoring` INV7。                                                                                                                                                                                |

此表是审查投影；以下正文具有权威性。

## Intent

ListItem 是 List 为每个条目渲染的行。它负责把一行变成列表项：`<li>` 元素、它从所属 List 读取什么、它前面绘制的标记，以及它如何应用 `component:List` 的 `list-item` 目标。一行作为行所做的一切都来自 `component:Item`。使用方用法见 `ListItem.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：不适用；`isSelected` 与 `isDisabled` 由调用方拥有
- 迁移决策：`spec:AST-057` DEP-0017，其 `astryx upgrade` codemod 把 `swipeActions` 与 `swipeBehavior` 改写为 `swipe={createSwipe(…)}`；它是从弃用版本开始的可选提前迁移，并会在 0.8.0 的升级中随 `spec:AST-057` CLN-0025 的移除再次运行

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **标记是额外元素。** 项目符号标记绘制为两个装饰性 `span` 元素，编号标记绘制为一个携带计数器伪元素的 `span`，位于行内容旁。`architecture:component-style-authoring` INV7 要求把无语义角色的装饰放在伪元素上，而不是新增元素。

## Ownership boundary

**拥有**

- 通过 `component:Item` 把该行渲染为 `<li>`，并向它传递每一个行 prop（FR1）。
- 从所属 List 读取密度、分隔线、边缘处理和标记，以及在 List 之外时的默认值（FR2、FR3）。
- 绘制标记或任务条目的只读复选框（FR4）。
- 把 `component:List` 的 `list-item` 目标应用到该行（FR5）。

**不拥有 / 非目标**

- `align`，即起始与结束内容的对齐——由 `component:Item` 拥有；滑动操作——由 `spec:AST-057` 拥有；链接目标——由 `family:navigation-destinations` 拥有，ListItem 是其成员。
- Item 的标签、描述、插槽、不可见按钮、委托激活，以及禁用和选中语义——属于 Item 已发布的行为，此处未作约定。
- 每种边缘处理对行几何与行内缩的影响，以及触摸目标、按下绘制、行动效和行菜单——由 `component:List` 拥有。
- 为 Markdown 的嵌套列表设置标记或任务状态的 `ListMarkerScope`——属于内部实现，此处未作约定。
- Markdown 列表的整数编号标记与文本对齐——由 `spec:AST-061` FR11 和 `component:List` DEC-5 拥有。

## Public concepts

除使用方 props 外，没有组件本地概念；行 props 属于 `component:Item`。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                | Basis          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | ListItem 把 `component:Item` 渲染为 `<li>`，并原样向它传递 `label`、`description`、`startContent`、`endContent`、`onClick`、`interactiveRef`、`href`、`target`、`rel`、`align`、`isDisabled`、`isSelected`、`swipe`、已弃用的 `swipeActions` 与 `swipeBehavior`（`spec:AST-057` DEP-0017）以及 `ref`，其他 DOM 与数据 props 也到达该行。 | 当前源码与测试 |
| FR2 | 在 List 内，该行采用列表的 `density`、其 `hasDividers` 设置（在行之间绘制分隔线，不增加额外元素，并使用直角；但 `bleed` 列表的首行或末行采用圆角宿主的圆角，`component:List` FR5），以及其 `edge` 处理。                                                                                                                                 | 当前源码与测试 |
| FR3 | 在 List 外，该行使用 `balanced` 密度、无分隔线、`padded` 处理且没有标记，保持 Item 的内联内缩。                                                                                                                                                                                                                                          | 当前源码与测试 |
| FR4 | 在 `listStyle` 为 `disc`、`circle` 或 `decimal` 的 List 中，该行在其内容前绘制该标记：一个圆盘或圆环形状，或一个计数器编号。为行设置的任务状态会在标记的位置绘制一个只读、带标签的复选框。每个标记和任务复选框都位于标签的首行。`listStyle` 为 `none` 的 List 两者都不绘制。为 Markdown 的嵌套列表在内部设置的其他标记，此处未作约定。   | 当前源码与测试 |
| FR5 | 该行承载 `component:List` 的 `list-item` 目标，并与调用方的 `className` 和 `style` 合并；`xstyle` 在 ListItem 自身的样式之后应用。                                                                                                                                                                                                       | 当前源码       |

### Allowed variation

- **AV1 — 行内容。** 标签、描述与插槽内容可变。
- **AV2 — 主题样式。** 主题重新设置 `list-item` 的样式。

### Representative states

| State          | Required invariant                                                                  | Allowed variation |
| -------------- | ----------------------------------------------------------------------------------- | ----------------- |
| 列表中的静态行 | 一个 `<li>`；没有按钮或锚点。                                                       | 内容。            |
| 可交互行       | Item 的不可见按钮或锚点；一个 Tab 停靠点。                                          | 内容。            |
| 带分隔线的列表 | 行之间有分隔线；直角，但圆角宿主中的 `bleed` 列表端行除外（`component:List` FR5）。 | 密度。            |
| 编号列表       | 每行前有一个计数器编号。                                                            | 编号样式。        |
| 任务行         | 标记的位置上是一个只读复选框。                                                      | 选中状态。        |
| List 之外的行  | Item 的内联内缩；没有标记。                                                         | 内容。            |

### Transformation and precedence order

- **ORD1 — 标记。** 当 List 的 `listStyle` 为 `none` 时没有标记；否则当该行具有任务状态时是任务复选框，然后是标记。
- **ORD2 — 样式。** 先是 ListItem 自身的样式，然后是调用方的 `xstyle`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 列表语义。** 在 List 内，每一行是 List 的 `<ul>` 或 `<ol>` 中的一个 `<li>`（FR1）。
- **AR2 — 行语义。** Item 的交互、禁用与选中语义原样适用；它们属于 Item 已发布的行为，此处未作约定。
- **AR3 — 任务状态。** 任务行的复选框是只读且带标签的（FR4）。

## Design relationships

| Anatomy or state | Design requirement                   | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------ | ------------------------ | -------------- | ------------------ |
| 行               | 通过 Item 呈现一个列表条目。         | `component:Item`         | 主导           | FR1, FR5           |
| 标记             | 显示列表的项目符号、编号或任务状态。 | 当前源码                 | 辅助           | FR4                |

目前尚未记录解剖结构-主题映射；该块在迁移期间是可选的，因此该映射被推迟。

## Family and system relationships

- `component:Item` 拥有 `align`，即起始与结束内容的对齐；其其他行行为未作约定。`spec:AST-057` 拥有滑动操作，`family:navigation-destinations` 拥有链接目标。
- `component:List` 拥有边缘处理及其行几何与内缩；其记录未对密度、分隔线和标记样式设置作约定，此处的 FR2 与 FR4 涵盖行如何使用它们。
- `architecture:component-theming-surface` 拥有目标资格认定；`component:List` 拥有 `list-item` 目标，FR5 涵盖该行如何应用它。

## Verification map

| Contract     | Verification                                                                                   | Representative states            | Mutation or failure expectation               | Audit section                  |
| ------------ | ---------------------------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------- | ------------------------------ |
| FR1, AR1     | `List.test.tsx` 的行元素、对齐、data 属性与滑动透传测试                                        | 静态行与可交互行                 | 不是 `<li>` 的行，或被丢弃的 prop，失败。     | `audit:ListItem/behavior`      |
| FR2          | `List.test.tsx` 的密度、分隔线、圆角与边缘处理测试                                             | 每种密度；分隔线开与关；每种边缘 | 忽略其 List 设置的行失败。                    | `audit:ListItem/layout`        |
| FR3          | `List.test.tsx` 的 "keeps the inset of a ListItem outside a List"                              | List 之外的行                    | List 之外丢失内缩的行失败。                   | `audit:ListItem/layout`        |
| FR4, AR3     | `List.test.tsx` 的标记与 ListMarkerScope 测试                                                  | 有标记、无标记、作用域标记、任务 | 缺失、多余或无标签的标记失败。                | `audit:ListItem/anatomy`       |
| AR2          | `List.test.tsx` 的不可见按钮、锚点、禁用与选中测试                                             | 点击、href、禁用、已选中         | 丢失行语义的失败。                            | `audit:ListItem/accessibility` |
| RTL relation | `apps/storybook/rtl-audit/targets.json` 中经整理的 RTL 审计 D2 目标，针对 `List / Interactive` | 起始图标与结尾箭头；LTR 与 RTL   | 起始内容不在结束内容的内联起始处则未通过 D2。 | `audit:ListItem/i18n-rtl`      |

从源码读取，尚无聚焦测试：

- FR1：`interactiveRef`、`rel` 和 `ref` 到达 Item 行。
- FR2：分隔线边框与直角。`bleed` 端行的圆角例外由 `ContainerCorners.a11y.chromium.spec.ts` 检查（`component:List` FR5）。
- FR4：每个标记与任务复选框位于标签的首行。
- FR3：在 List 之外使用 `balanced` 密度、无分隔线且无标记。
- FR4：每个项目符号标记的形状（圆盘的填充、圆环的环线），以及编号标记及其计数器。
- FR5：`list-item` 目标，以及 `xstyle` 在 ListItem 的样式之后应用。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、Item 的行行为，或 List 的边缘与几何规则。它链接到这些内容的所有者。
