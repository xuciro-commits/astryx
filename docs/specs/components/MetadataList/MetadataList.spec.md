---
schema_version: 3
template_version: 7
kind: component
id: component:MetadataList
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
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
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

# MetadataList component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `children`（MetadataListItem 条目）、`columns`、`label`（`position`、`width`）、`maxNumOfItems`、`orientation`、`title`、根元素 `BaseProps`、`ref`。 |
| 行为          | 一个由标签与值配对组成的描述列表，可排成一列、多列或一个换行行，并带有可选的“显示更多”与“显示更少”切换。                                             |
| 最终用户影响  | 人们在可预期的网格中浏览带标签的事实，辅助技术将每个标签与其值一起朗读。                                                                             |
| 构建者影响    | 无；该记录描述已发布的行为。                                                                                                                         |
| 兼容性/就绪度 | 作为 current 记录的已发布行为；无 API、默认值或输出变更。                                                                                            |
| 审查检查      | 拒绝以下情况：不是 `dl` 的列表、缺少展开状态或受控列表的切换、未本地化的切换标签、可被覆盖的反射。                                                   |
| 治理规则      | `architecture:public-component-api` INV5–INV8；`architecture:component-theming-surface`；WCAG 2.2 SC 1.3.1 与 4.1.2。                                |

该表是审查投影；下方正文具有权威性。

## Intent

MetadataList 以描述列表的形式呈现只读的键值事实。它负责其条目的排布、传递给它条目的标签位置，以及折叠长列表的可选披露控件；事实本身由调用方负责。

使用方语法与示例属于 `MetadataList.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes` —— 单列、垂直、标签位于起始处、不折叠。
- 兼容性类别：记录已发布的行为；无公开 prop、默认值、DOM、目标或样式输出的变更。
- 受控/非受控行为：披露控件的展开状态为非受控。
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 根元素、其 `metadata-list` 目标、可选标题、`dl`，以及“显示更多”与“显示更少”切换。
- 列布局、方向，以及其条目所读取的标签位置与宽度。

**不拥有 / 非目标**

- 每个条目的标签与值标记——由 `component:MetadataListItem` 拥有。
- 所展示的事实及其格式——由调用方拥有。
- 可编辑字段——由表单组件拥有。

## Public concepts

| 概念     | 封闭取值或状态               | 含义                                                                  | 按变体/方向/状态的可用性                   | 默认值                                          | 拥有者                   | 稳定性 | 无效值行为                                          |
| -------- | ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- | ------------------------ | ------ | --------------------------------------------------- |
| 列       | `single`；`multi`；正数      | 单列、自动填充列，或恰好 N 列。                                       | 仅垂直                                     | `single`                                        | `component:MetadataList` | 稳定   | 1 视作 `single`；小于 1 的数字回落到 `multi` 模板。 |
| 方向     | `vertical`；`horizontal`     | 条目的网格，或一个由堆叠条目组成的换行行。                            | 始终                                       | `vertical`                                      | `component:MetadataList` | 稳定   | 封闭联合；被类型拒绝。                              |
| 标签位置 | `start`；`top`               | 标签位于其值旁，或堆叠在其上方。                                      | 仅垂直                                     | `multi` 或大于 1 的数字为 `top`，否则为 `start` | `component:MetadataList` | 稳定   | 水平方向始终堆叠。                                  |
| 标签宽度 | number（px）；CSS 长度字符串 | 标签轨道的宽度；在 `multi` 上，它以每行一对标签与值取代自动填充网格。 | 使用起始标签的垂直方向，位于单列或 `multi` | 内容宽度                                        | `component:MetadataList` | 稳定   | —                                                   |
| 折叠     | 正数；未设置                 | 在出现“显示更多”切换之前展示的条目数。                                | 仅垂直                                     | 未设置                                          | `component:MetadataList` | 稳定   | 水平方向时忽略。                                    |
| 标题     | ReactNode；未设置            | 展示在列表上方的内容。                                                | 始终                                       | 未设置                                          | `component:MetadataList` | 稳定   | —                                                   |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | MetadataList 渲染一个携带 `metadata-list` 目标的根 `div`，该目标反射 `columns` 与 `orientation`，其中装有可选标题、由条目组成的 `dl`，以及列表折叠时出现的切换按钮。标题以纯内容的形式、以 `--spacing-3` 的间距渲染在列表上方；它不是一个标题元素，也不为列表命名。                                                                                                                                                                                                                                                                                        | 当前源码与测试                                                |
| FR2 | 垂直、单列且使用起始标签时，是一个双轨道网格（标签 `auto`，值 `minmax(0, 1fr)`），行间距为 `--spacing-2`、列间距为 `--spacing-4`，并采用基线对齐；标签 `width` 会替换标签轨道，而在使用起始标签的 `multi` 上，`width` 会用相同的两条轨道取代自动填充网格。单列且使用顶部标签时是单轨道，间距为 `--spacing-3`。`multi` 以 280px 为最小列宽自动填充，间距为 `--spacing-4`。大于 1 的数字 N 会生成恰好 N 列：使用顶部标签时每列为 `1fr`，使用起始标签时每列为标签 `auto` 与值 `minmax(0, 1fr)` 的配对，并忽略标签 `width`；小于 1 的数字回落到 `multi` 模板。 | 当前源码与测试                                                |
| FR3 | 对 `multi` 或大于 1 的数字，标签位置默认为 `top`，其余情况（包括小于 1 的数字）默认为 `start`，且调用方提供的 `position` 优先。水平方向将条目排成一个带 `--spacing-4` 间距的换行行，把每个标签堆叠在其值上方，并忽略 `columns` 与 `maxNumOfItems`。                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                                |
| FR4 | 当处于垂直方向且条目数超过 `maxNumOfItems` 时，只渲染前 `maxNumOfItems` 个条目，其后是一个带有本地化“显示更多”文案的原生按钮，其 `aria-expanded="false"`，并由 `aria-controls` 指向该 `dl`。激活它后渲染全部条目，切换为“显示更少”并令 `aria-expanded="true"`；再次激活则折叠。焦点保持在按钮上。                                                                                                                                                                                                                                                          | 当前源码与测试；`architecture:public-component-api`           |
| FR5 | `ref`、DOM、data、ARIA 与事件 prop，以及 `xstyle`、`className` 和 `style`，都到达根元素或在其上组合；被反射的 `data-columns` 与 `data-orientation` 会替换调用方的值。                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 事实。** 任何 MetadataListItem 内容都可以填充该列表。
- **AV2 — 标题。** 任何 ReactNode，包括调用方提供的标题元素，都可以作为该标题。

### Representative states

| 状态 | 必需的不变式                                                     | 允许的变化 |
| ---- | ---------------------------------------------------------------- | ---------- |
| 单列 | 标签轨道与值轨道；标签位于起始处。                               | 标签宽度。 |
| N 列 | 恰好 N 列；默认标签在顶部。                                      | N。        |
| 水平 | 一个换行行；标签堆叠；无切换。                                   | —          |
| 折叠 | 前 `maxNumOfItems` 个条目；“显示更多”；`aria-expanded="false"`。 | 语言区域。 |
| 展开 | 全部条目；“显示更少”；`aria-expanded="true"`。                   | 语言区域。 |

### Transformation and precedence order

- **ORD1 — 标签位置。** 水平 → 顶部；否则调用方的 `position` → 对 `multi` 或大于 1 的数字为 `top` → `start`。
- **ORD2 — 列。** 水平 → 无网格；大于 1 的 N → 恰好 N 列（使用顶部标签时为 N 条轨道，使用起始标签时为 N 对标签与值）；使用起始标签时 `width` → 该标签轨道；否则使用静态模板。

### Performance and resources

- **PR1 — 仅本地状态。** MetadataList 持有一个展开标志和一个生成的 id，且不添加任何监听器、观察器、定时器或测量。

## Accessibility contract

- **AR1 — 描述列表语义。** 条目是位于同一个 `dl` 内的一对对 `dt` 与 `dd`，因此辅助技术会将每个标签与其值一起朗读（WCAG 2.2 SC 1.3.1）。
- **AR2 — 披露状态。** 切换是一个原生按钮，它暴露自身的展开状态及其所控制的列表（WCAG 2.2 SC 4.1.2）。
- **AR3 — 本地化标签。** 切换的文本来自翻译目录，绝不在组件内拼装。

## Design relationships

| 结构或状态 | 设计要求                             | 表现权威                     | 层级角色 | 组件契约 |
| ---------- | ------------------------------------ | ---------------------------- | -------- | -------- |
| 标题       | 列表上方的可选内容。                 | 当前源码与文档               | 支撑     | FR1      |
| 标签       | 每个条目的键。                       | `component:MetadataListItem` | 支撑     | FR2, FR3 |
| 元数据     | 每个条目的值。                       | `component:MetadataListItem` | 突出     | FR2, FR3 |
| 披露控件   | 以强调色呈现“显示更多”或“显示更少”。 | 当前源码与文档               | 支撑     | FR4      |

主题化：根元素携带 `metadata-list` 目标，该目标反射 `columns` 与 `orientation`，并且每个条目携带 `metadata-list-item` 目标（`component:MetadataListItem`）。`MetadataList.doc.mjs` 未为 `metadata-list` 目标命名任何根结构部位，因此此处不声明结构-主题化块；标题、值单元与披露控件都不携带目标。

## Family and system relationships

- `component:MetadataListItem` 拥有条目标记，并读取本记录解析出的标签位置。
- `architecture:component-theming-surface` 拥有目标与结构映射。
- `architecture:public-component-api` 拥有调用方输入的路由；FR5 应用它。
- `spec:AST-009` 拥有可访问性树证据；验证映射标明了它的缺口。

## Verification map

| 契约          | 验证                                                                                                               | 代表状态                                         | 变更或失败预期                                                                                                                                                                                                          | 审计小节                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR1, AR1      | `MetadataList.test.tsx` 的描述列表、`dl` 与标题测试；稳定视觉基线 `core-metadatalist--basic`（中性主题与探针主题） | 条目；标题                                       | 缺少 `dl`、`dt` 或 `dd`，或缺少标题，即失败；默认布局发生变化会以变更形式返回供审查。缺口：没有可访问性树检查能证明术语与定义的配对（`spec:AST-009` FR3）。                                                             | `audit:MetadataList/a11y`     |
| FR2, ORD2     | `MetadataList.test.tsx` 的数字列与标签宽度测试                                                                     | 带顶部标签与起始标签的 N 列；`multi`；自定义宽度 | N 列或标签宽度的内联网格模板错误，或 `multi` 出现 `repeat(` 内联模板，即失败。缺口：静态单列与 `multi` 模板以及间距，除默认基线外没有单元检查。没有测试覆盖起始标签下 N 列旁的宽度、`multi` 上的宽度，或小于 1 的数字。 | `audit:MetadataList/layout`   |
| FR3, ORD1     | `MetadataList.test.tsx` 的方向与默认位置测试                                                                       | 水平；省略 position；`columns={2}`               | 水平列表没有堆叠标签或带有切换，或默认位置错误，即失败。没有测试覆盖 `multi` 的顶部标签默认值，或小于 1 的数字的起始标签默认值。                                                                                        | `audit:MetadataList/layout`   |
| FR4, AR2, AR3 | `MetadataList.test.tsx` 的显示更多、切换与本地化测试                                                               | 折叠；展开；法语目录                             | 缺少切换、隐藏条目仍被渲染、切换无法展开与折叠，或在法语目录下出现英文文本，即失败。缺口：没有测试断言 `aria-expanded`、`aria-controls`，或焦点保持在按钮上。                                                           | `audit:MetadataList/behavior` |
| FR5           | `MetadataList.test.tsx` 的根透传、事件与自有元数据测试                                                             | `aria-label`、`id`、data；点击；冲突的反射       | 属性或处理器被丢弃，或调用方的 `data-columns` 或 `data-orientation` 获胜，即失败。缺口：没有测试覆盖 `ref`、`className`、`style`，或 `xstyle` 的合并顺序。                                                              | `audit:MetadataList/api`      |
| PR1           | 源码审查                                                                                                           | 每个状态                                         | 缺口：如果 MetadataList 添加监听器、定时器或测量，没有任何自动化检查会失败。                                                                                                                                            | `audit:MetadataList/behavior` |
| 主题化目标    | `themingTargets.test.ts`                                                                                           | 根目标与条目目标                                 | 目标被重命名或未记录，即失败。缺口：如果并排的 `dt` 丢失 `metadata-list-item` 目标，没有检查会失败。                                                                                                                    | `audit:MetadataList/theming`  |
| RTL 关系      | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`）应用于 `MetadataList / Basic`                     | 侧边标签；LTR 与 RTL                             | 标签列不位于值列的行内起始处，即 D2 失败。                                                                                                                                                                              | `audit:MetadataList/i18n-rtl` |

## Decision log

无记录。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表和示例、当前审计结果、实现步骤或条目标记。它链接到它们的拥有者。
