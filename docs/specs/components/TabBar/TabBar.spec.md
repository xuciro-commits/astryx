---
schema_version: 3
template_version: 7
kind: component
id: component:TabBar
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/lab/src/TabBar/TabBar.test.tsx,
    packages/lab/src/TabBar/__tests__/TabBar.interaction.browser.spec.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-085/FR1, spec:AST-085/FR2, spec:AST-085/FR5]
---

# TabBar component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `TabBar` 接受 `moreValue`（默认 `'more'`）；`TabBarMoreList` 接受 `children`、`value` 和 `onChange`；Core 的目录中有 `@astryx.tabBar.more`。       |
| Behavior                | 超过五个标签页时，该栏显示四个标签页和 More（More 列出其余标签页），对所有指针设备都如此，与 UITabBarController 一致。方向键会跳过已禁用的标签页。 |
| End-user impact         | 六个或更多分区在手机的栏上仍可访问，如同在 iOS 上；键盘用户永远不会落到已禁用的标签页上。                                                          |
| Builder impact          | 标签页超过五个的应用会在 `value` 为 `moreValue` 时渲染 `TabBarMoreList`，并在 More 内部显示所选分区。                                              |
| Compatibility/readiness | 五个或更少标签页的渲染与之前相同。草稿。                                                                                                           |
| Review checks           | 否决随指针变化而改变的第 5 个槽位、遗漏或重排标签页的 More 列表，以及可被选中的禁用行或已禁用标签页。                                              |
| Governing rules         | `spec:AST-085` FR1、FR2 和 FR5（已禁用控件保持可聚焦、阻止任何更改，并被宣布为已禁用）。                                                           |

本表是审查投影；下方正文具有权威性。

## Intent

TabBar 是 lab 中顶级分区的浮动栏，仿照 UIKit 的标签栏建模。本记录说明它如何容纳超出容量的分区、已禁用的标签页如何应对键盘，以及 More 标签页的标签。使用方用法见 `TabBar.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认行为：五个或更少标签页的栏为 `yes`。六个或更多标签页的栏（超出文档所述的三到五个）会将其第五个及之后的标签页移入 More（FR1）。
- 兼容性类别：增量式；`moreValue` 和 `TabBarMoreList` 是新增的。
- 受控/非受控行为：不变；`value` 由应用拥有。
- 迁移决策：无需迁移。

## Ownership boundary

**拥有**

- 该栏显示哪些标签页，以及 More 何时取代其余标签页。
- More 何时读作已选中，以及再次选择 More 意味着什么。
- `TabBarMoreList`：More 中其余标签页的列表。

**不拥有 / 非目标**

- More 的导航栈及其内部的屏幕——由应用拥有。
- 重新排列标签页（iOS 的 Edit）——未提供。

## Public concepts

| Concept          | Closed values or states | Meaning                                    | Availability by variant/orientation/state | Default  | Owner              | Stability | Invalid-value behavior             |
| ---------------- | ----------------------- | ------------------------------------------ | ----------------------------------------- | -------- | ------------------ | --------- | ---------------------------------- |
| More tab         | 显示、隐藏              | 第五个槽位，代表第四个之后的所有标签页     | 仅在超过五个标签页时显示                  | 隐藏     | `component:TabBar` | 实验性    | 不适用                             |
| `moreValue`      | 任意字符串              | More 的列表显示期间应用的 `value` 所取的值 | 超过五个标签页时                          | `'more'` | `component:TabBar` | 实验性    | 具有相同值的标签页会被遮蔽         |
| `TabBarMoreList` | 每个标签页一行          | More 的屏幕：第四个之后的标签页，按顺序    | 当 `value` 为 `moreValue` 时              | 无       | `component:TabBar` | 实验性    | 第四个之后没有标签页时会渲染空列表 |

## Behavioral and layout contract

草稿需求会标明其依据，以免把观察到的代码误认为有意的决策。`current` 契约不包含未解决的行。

| ID  | Candidate invariant                                                                                                                                                                                                                           | Basis                                        | Draft review state |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ------------------ |
| FR1 | 超过五个标签页时，该栏显示四个标签页和 More（More 列出其余标签页），对所有指针设备都如此，与 UITabBarController 一致。                                                                                                                        | UITabBarController 的布局                    | 已定               |
| FR2 | 当 `value` 为 `moreValue` 或为第四个之后的任一标签页时，More 必须读作已选中。                                                                                                                                                                 | UITabBarController                           | 已定               |
| FR3 | 在 More 未被选中时选择它，必须用 `moreValue` 调用 `onChange`；在其已被选中时选择它，必须用 `moreValue` 调用 `onReselect`，绝不调用 `onChange`。                                                                                               | UIKit 弹出 More 的栈                         | 已定               |
| FR4 | `TabBarMoreList` 接受该栏的 `TabBarItem` 子元素，并且必须按顺序列出第四个之后的每个标签页，带上其图标、标签、徽标，以及一个指向行内末端（inline end）的展开指示箭头；值等于 `value` 的行读作已选中，选择已启用的行必须用其值调用 `onChange`。 | UIKit 的 More 列表                           | 已定               |
| FR5 | 已禁用标签页的 More 行必须是禁用的，选择它不得调用 `onChange`。                                                                                                                                                                               | `spec:AST-085` FR2                           | 已定               |
| FR6 | 方向键必须跳过已禁用的标签页，该标签页仍被宣布为已禁用。                                                                                                                                                                                      | Core 的 TabList；`spec:AST-085` 非目标与 FR5 | 已定               |
| FR7 | More 标签页的标签和该列表的名称必须来自 Core 的目录消息 `@astryx.tabBar.more`。                                                                                                                                                               | Core 的消息目录                              | 已定               |

### Allowed variation

- **AV1 — More 的图标。** 图标可以随主题变化；槽位和标签不可以。

### Representative states

| State                        | Required invariant                                | Allowed variation |
| ---------------------------- | ------------------------------------------------- | ----------------- |
| 五个标签页                   | 没有 More 标签页（FR1）                           | 无                |
| 六个标签页，选中第五个       | More 已选中；其列表显示第五个为已选中（FR2、FR4） | 无                |
| 第四个之后的一个已禁用标签页 | 其行已禁用（FR5）                                 | 其变暗的绘制      |

### Transformation and precedence order

- **ORD1 — 选择。** 在 lens 自行定位之前，第四个之后的标签页解析为 More（FR2）。

### Performance and resources

- **PR1 — 无额外监听器。** More 标签页不会添加超出普通标签页的监听器。

## Accessibility contract

- **AR1 — 每行一个名称。** 带徽标的 More 行必须像其标签页一样由 `@astryx.tabBar.badgedItem` 命名。
- **AR2 — 命名列表。** `TabBarMoreList` 必须由 `@astryx.tabBar.more` 命名。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| More 标签页      | 无记录             | 规定（UIKit）            | 支撑           | FR1, FR7           |

组件实现设计要求，但不复制其理由。

## Family and system relationships

- `spec:AST-085` 拥有已禁用控件规则；TabBar 将 FR1、FR2 和 FR5 应用于其标签页及其 More 行。
- `spec:AST-085` 将复合控件内部的方向键行为留给其自己的记录：“方向键在复合控件（listbox、menu、grid、tablist、roving group）内部会访问哪些项。由该复合控件自己的记录决定这一点。”FR6 为 TabBar 决定了这一点，正如 Core 的 TabList 所做的那样。

## Verification map

| Contract | Verification                                                                                                                                                                              | Representative states             | Mutation or failure expectation                                              | Audit section |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------- | ------------- |
| FR1      | “超过五个时显示前四个标签页和 More”；“六个标签页：该栏显示前四个和 More……”                                                                                                                | 五个和六个标签页                  | 没有 More 的栏显示六个标签页，两项都失败                                     | 无            |
| FR2      | “为其持有的标签页选中 More，并用其值选择 More”                                                                                                                                            | 选中第五个标签页                  | 直接选中第五个标签页本身会使其失败                                           | 无            |
| FR3      | “为其持有的标签页选中 More，并用其值选择 More”；“在其持有标签页时再次选择 More 属于重新选择，返回其列表”                                                                                  | More 未选中，以及 More 持有标签页 | 在重新选择时用 `moreValue` 调用 `onChange`，或首次选择时未调用，都会使其失败 | 无            |
| FR4      | “列出第四个之后的标签页，点击某行会选择其标签页”；“将所选标签页的 More 行读作已选中，其他行则不是”；“在 More 中选择的分区会在其中打开……”；“从右到左时，More 列表的展开指示箭头指向左侧……” | LTR 与 RTL，选中 Help             | 缺少某行、缺少选中行或箭头未镜像，都会使其失败                               | 无            |
| FR5      | “第四个之后的已禁用标签页在其 More 行中保持禁用……”                                                                                                                                        | Help 已禁用                       | 某行处于启用状态会使其失败                                                   | 无            |
| FR6      | “被方向键跳过”；“已禁用标签页在无障碍树中、在标签页本身上连同其名称被宣布为已禁用（spec:AST-085 FR5）”                                                                                    | 已禁用的第二个标签页              | 焦点落到已禁用标签页上，或缺少已禁用状态，都会使其失败                       | 无            |
| FR7      | “用同一条目录消息命名 More 标签页及其列表，因此翻译可以改变它”；针对该键的 `pnpm check:i18n-catalog`                                                                                      | 在覆盖之下的 More 标签页及其列表  | 硬编码的标签会忽略覆盖，从而使其失败                                         | 无            |

## Decision log

无记录。

## Open questions

无。

## Content boundary

本文件不复制使用方的 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到它们的所有者。
