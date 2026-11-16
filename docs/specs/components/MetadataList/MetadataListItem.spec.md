---
schema_version: 3
template_version: 7
kind: component
id: component:MetadataListItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/MetadataList/MetadataList.test.tsx,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009]
---

# MetadataListItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------ |
| Public contract         | `label`（字符串）、`children`（值）、可选的 `icon`、根 `BaseProps`，以及 `ref`。                             |
| Behavior                | 一个标签与值的配对，渲染为 `dt` 与 `dd`，二者要么在列表的网格中并排，要么堆叠在包裹元素内。                  |
| End-user impact         | 人们在其值旁边或上方阅读每条事实的标签，辅助技术会将二者配对。                                               |
| Builder impact          | 无；本记录描述已发布的行为。                                                                                 |
| Compatibility/readiness | 已发布行为被记录为当前状态；无 API、默认值或输出变更。                                                       |
| Review checks           | 拒绝不是 `dt` 与 `dd` 的配对、并排布局中出现包裹元素，或使调用方 props 从承载 ref 的元素上移开的写法。       |
| Governing rules         | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`；WCAG 2.2 SC 1.3.1。 |

本表是评审用的投影，正文为准。

## Intent

MetadataListItem 是 MetadataList 中的一个键值条目。它负责该条目的术语与定义标记及其类型；标签、图标与值由调用方负责。

使用方的语法与示例见 `MetadataListItem.doc.mjs`。

## Compatibility and migration

- Released default preserved: `yes` —— 在堆叠列表之外并排显示。
- 兼容性类别：记录已发布行为；不改变公共 prop、默认值、DOM、target 或样式输出。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明见使用方文档与发布说明。

## Ownership boundary

**拥有**

- 条目的 `dt` 与 `dd`、堆叠包裹元素，以及 `component:MetadataList` 映射的 `metadata-list-item` target。
- 标签与值的类型、图标槽位，以及调用方输入落到的位置。

**不拥有 / 非目标**

- 标签位置、列数与方向 —— 由 `component:MetadataList` 拥有。
- 标签、图标与值的内容 —— 由调用方拥有。

## Public concepts

| Concept | Closed values or states | Meaning                        | Availability by variant/orientation/state | Default | Owner                    | Stability | Invalid-value behavior |
| ------- | ----------------------- | ------------------------------ | ----------------------------------------- | ------- | ------------------------ | --------- | ---------------------- |
| Label   | string                  | 条目的键。                     | 始终                                      | —       | 调用方                   | 稳定      | —                      |
| Value   | ReactNode (`children`)  | 条目的值。                     | 始终                                      | —       | 调用方                   | 稳定      | —                      |
| Icon    | ReactNode；未设置       | 显示在标签之前的内容。         | 始终                                      | 未设置  | 调用方                   | 稳定      | —                      |
| Layout  | 并排；堆叠              | 由父列表设置，而非由条目设置。 | 始终                                      | 并排    | `component:MetadataList` | 稳定      | —                      |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                   | Basis                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | 并排时（标签位于起始处，或位于 MetadataList 之外），条目渲染一个承载图标与标签的 `dt`，随后是一个承载值的 `dd`，二者作为列表网格的直接子元素。`dt` 承载 `metadata-list-item` target、`ref`，以及调用方的 props 与样式输入；`data-testid` 会变成 `dt` 上的 `<id>-label` 与 `dd` 上的 `<id>-value`。两个单元格高度至少 24px，并会折断长单词。 | 当前源码与测试                                                |
| FR2 | 堆叠时（标签位于上方，或为水平列表），条目渲染一个 `div` 包裹元素，承载 `metadata-list-item` target、`ref`、`data-testid`，以及调用方的 props 与样式输入，其中 `dt` 在 `dd` 之上，间隔为 `--spacing-0-5`。                                                                                                                                  | 当前源码与测试                                                |
| FR3 | 标签使用中等字重的正文类型，颜色为次要文本色；值使用正文类型，颜色为主要文本色。图标位于标签之前，间隔为 `--spacing-2`。                                                                                                                                                                                                                    | 当前源码与文档                                                |
| FR4 | `xstyle`、`className` 与 `style` 在承载 target 的元素上于组件样式之后合成，调用方 props 在组件自身属性之后到达该元素。                                                                                                                                                                                                                      | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 内容。** 任意字符串都可以作为标签；任意 ReactNode 都可以作为图标或值。

### Representative states

| State  | Required invariant                                               | Allowed variation |
| ------ | ---------------------------------------------------------------- | ----------------- |
| 并排   | `dt` 与 `dd` 作为网格同级元素；target、ref 与 props 在 `dt` 上。 | 内容。            |
| 堆叠   | 一个包裹元素承载 target、ref 与 props，其中 `dt` 在 `dd` 之上。  | 内容。            |
| 带图标 | 图标位于 `dt` 内标签之前。                                       | 图标。            |

### Transformation and precedence order

- **ORD1 — 布局。** 父列表的水平方向或 `top` 标签位置 → 堆叠；否则并排。

### Performance and resources

- **PR1 — 无资源消耗。** MetadataListItem 读取父列表的标签位置与方向，自身不持有状态。

## Accessibility contract

- **AR1 — 术语与定义。** 标签是 `dt`，值是它的 `dd`，因此辅助技术会将二者配对（WCAG 2.2 SC 1.3.1）。图标不添加自身的语义。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 标签             | 次要颜色的中等键。 | 当前源码与文档           | 支撑性         | FR1–FR3            |
| 元数据           | 主要颜色的值。     | 当前源码与文档           | 突出           | FR1–FR3            |

主题：`dt`（并排）或包裹元素（堆叠）承载 `metadata-list-item` target，该 target 由 `MetadataList.doc.mjs` 声明并由 `component:MetadataList` 映射。`MetadataListItem.doc.mjs` 未声明自身的解剖结构，因此这里不声明 anatomy-theming 块。

## Family and system relationships

- `component:MetadataList` 拥有布局、标签位置与 target 映射。
- `architecture:public-component-api` 拥有调用方输入路由；FR4 应用它。
- `spec:AST-009` 拥有无障碍树证据；验证映射中指出了其缺口。

## Verification map

| Contract     | Verification                                                                                       | Representative states          | Mutation or failure expectation                                                                                                                                                                                                                    | Audit section                     |
| ------------ | -------------------------------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1          | `MetadataList.test.tsx` 的条目、标签宽度与透传 target 测试                                         | 并排                           | 缺少标签或值、`dt` 或 `dd` 不是 `dl` 的直接子元素、`-label` 与 `-value` 测试 id 错误，或 props 与点击处理离开 `dt` 时，测试失败。缺口：没有测试附加 `ref`，24px 最小高度没有检查。若并排的 `dt` 丢失 `metadata-list-item` target，没有检查会失败。 | `audit:MetadataListItem/layout`   |
| FR2          | `MetadataList.test.tsx` 的堆叠与堆叠透传测试                                                       | 堆叠                           | 缺少包裹元素、`dt` 或 `dd`，或 props 离开包裹元素时，测试失败。缺口：堆叠间隔没有检查。没有测试为堆叠包裹元素附加 `ref`。                                                                                                                          | `audit:MetadataListItem/layout`   |
| FR3          | `MetadataList.test.tsx` 的图标测试                                                                 | 带图标                         | 缺少图标时测试失败。缺口：标签与值的字体、颜色以及图标间隔没有自动化检查。                                                                                                                                                                         | `audit:MetadataListItem/design`   |
| FR4          | `MetadataList.test.tsx` 的透传测试                                                                 | `aria-label`、`id`、data；点击 | 丢弃属性或处理器时测试失败。缺口：没有测试覆盖 `className`、`style` 或 `xstyle` 的合并顺序。                                                                                                                                                       | `audit:MetadataListItem/api`      |
| AR1          | `MetadataList.test.tsx` 的角色查询                                                                 | 术语与定义                     | DOM 中缺少 `term` 或 `definition` 角色时测试失败。缺口：没有无障碍树检查能证明该配对（`spec:AST-009` FR3）。                                                                                                                                       | `audit:MetadataListItem/a11y`     |
| PR1          | 源码审查                                                                                           | 每种状态                       | 缺口：若 MetadataListItem 添加状态，没有自动化检查会失败。                                                                                                                                                                                         | `audit:MetadataListItem/behavior` |
| RTL relation | RTL 审计策划的 D2 target（`apps/storybook/rtl-audit/targets.json`），作用于 `MetadataList / Basic` | 侧边标签与值；LTR 与 RTL       | 标签不在其值的行内起始处时 D2 失败。                                                                                                                                                                                                               | `audit:MetadataListItem/i18n-rtl` |

## Decision log

无。本记录描述已交付的行为。

## Open questions

None.

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或列表布局规则。它链接到各自的拥有者。
