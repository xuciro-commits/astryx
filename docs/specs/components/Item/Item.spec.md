---
schema_version: 3
template_version: 7
kind: component
id: component:Item
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-16
owners: [cixzhang]
review_triggers: [public-api, layout, theming]
verified_by:
  [
    packages/core/src/Item/Item.test.tsx,
    packages/core/src/hooks/nestedTouchPress.adopters.test.tsx,
    packages/core/src/List/List.test.tsx,
    packages/core/src/RadioList/RadioList.test.tsx,
    packages/core/src/CheckboxList/CheckboxList.test.tsx,
    apps/storybook/stories/Item.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:internationalization,
  ]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-017/FR3, spec:AST-057]
---

# Item component contract

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

本记录规定 Item 如何让其起始与结束内容相对标签对齐。Item 的滑动操作由 `spec:AST-057` 管治，其链接与导航语义由 `family:navigation-destinations` 管治；在某个记录声明管辖之前，Item 的其他行为仍由其源码、测试与 `Item.doc.mjs` 描述。

## Contract at a glance

| 领域         | 契约                                                                                                                                     |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约     | Item、ListItem、RadioListItem 与 CheckboxListItem 上的 `align?: 'center' \| 'start' \| 'first-line'`；默认 `center`。                    |
| 行为         | `first-line` 将每个起始与结束槽位居中到标签首行，适用于任意槽位高度；高于该行的槽位会把文本下移，而不是让槽位离开该行。                  |
| 最终用户影响 | 小状态圆点、单选按钮或年龄与换行标签的首行保持齐平，而不是漂移到行中部（`center`）或高悬于该行之上（`start`）。                          |
| 构建者影响   | 默认无影响。构建者按行用 `align="first-line"` 选择性启用；主题作者可以为 `item` 目标的 `first-line` 对齐设置样式。                       |
| 兼容性/就绪  | 增量式：在既有封闭轴上新增一个取值，并为既有的运行时透传补上类型化转发。省略 `align` 的行保持不变。                                      |
| 审查检查     | 拒绝以下变更：改变默认值、改变 `center`/`start` 的几何、使用 JavaScript 测量、把槽位推出行外、新增第二个主题目标，或让组合行丢弃该取值。 |
| 管治规则     | 下文 FR1–FR8；`architecture:component-theming-surface/INV6`；`spec:AST-017/FR3`。                                                        |

本表是审查用的投影；下文正文具有权威性。

## Intent

Item 是列表、菜单、选择器与选项行背后的共享行。其标签可以换行，而它的起始与结束内容往往是与单行等大的标记：状态圆点、单选按钮或复选框、图标、短时间戳。这些标记属于它们所注释文本的首行。对齐由 Item 拥有，因为只有 Item 知道其标签首行的位置；调用方若不复制 Item 的排版，就无法把槽位对齐到该行。

## Compatibility and migration

- 保留已发布的默认值：`yes`；省略 `align` 时解析为 `center`。
- 兼容性类别：封闭轴上的增量取值；在三个组合行上新增类型化 prop，这些行在运行时已把未知 prop 转发给 Item。
- 受控/非受控行为：不适用。
- 迁移决策：`component:Item/DEC-1`。

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `align` 轴：它的取值、默认值，以及每个取值对起始与结束内容槽位的几何。
- 在 `item` 主题目标上反映解析后的对齐。
- 在 `item` 主题目标上反映高亮、选中与禁用状态。
- 对组合 Item 并暴露 `align` 的行的转发规则。

**不拥有 / 非目标**

- `marker` 槽位的对齐 —— 由渲染该标记的一方拥有；ListItem 把自己的标记对齐到首行。
- `label` 内调用方内容的排版 —— 由调用方拥有。
- 主题级的默认对齐 —— 主题为取值设置样式，而不选择组件的 prop 默认值（`architecture:component-theming-surface`）。
- 槽位自身内容内部的对齐（例如头像堆叠）—— 由该内容拥有。

## Public concepts

| 概念 | 封闭取值或状态                  | 含义                                                                                                  | 按变体/方向/状态的可用性                       | 默认值   | 所有者           | 稳定性 | 无效值行为             |
| ---- | ------------------------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------- | -------- | ---------------- | ------ | ---------------------- |
| 对齐 | `center`、`start`、`first-line` | `center`：槽位在整个文本块上居中。`start`：槽位顶部对齐文本块顶部。`first-line`：槽位居中于首行中心。 | 所有密度、布局、交互模式与方向；起始与结束槽位 | `center` | `component:Item` | 稳定   | 其他取值被公共类型拒绝 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 依据                                                                                                                           | 草案审查状态           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| FR1  | Item 必须接受 `align`，且取值恰为 `center`、`start` 与 `first-line`，省略取值时必须解析为 `center`。`center` 与 `start` 的几何不得改变。                                                                                                                                                                                                                                                                                                                                                    | `component:Item/DEC-1`                                                                                                         | 已确定                 |
| FR2  | 在 `first-line` 下，每个已渲染的起始内容槽位与结束内容槽位的块轴中心必须与标签首行盒的块轴中心重合，适用于每种槽位块尺寸。                                                                                                                                                                                                                                                                                                                                                                  | 所有者指示                                                                                                                     | 已确定                 |
| FR3  | 在 `first-line` 下，高于标签首行的槽位必须留在行的内容盒内：标签与描述按差值下移，行增高以容纳。任何槽位都不得被裁剪，也不得绘制到行的块级内边距中。                                                                                                                                                                                                                                                                                                                                        | 所有者指示                                                                                                                     | 已确定                 |
| FR4  | 标签只渲染一行且没有描述的行，在 `first-line` 与 `center` 下必须渲染得完全相同，适用于每种槽位块尺寸。                                                                                                                                                                                                                                                                                                                                                                                      | 由 FR2 与 FR3 推出                                                                                                             | 已确定                 |
| FR5  | 首行盒是按 Item 样式渲染的标签行，源自当前主题的正文文本尺寸与行距。改变这些 token 的主题会随之一并移动对齐。`label` 内自行设置字号或行高的调用方内容不在 FR2 的保证范围内。                                                                                                                                                                                                                                                                                                                | 共享的排版来源                                                                                                                 | 已确定                 |
| FR6  | `first-line` 必须在所有密度下、在 `stacked` 与 `inline` 布局中、在 `labelLines` 截断时，以及在普通行、按钮行、链接行、link-root 行、委托行与父级角色行中成立。在从右到左文本中，它必须产生相同的块轴位置，槽位按逻辑顺序镜像，且不重排 DOM。                                                                                                                                                                                                                                                | `architecture:internationalization`                                                                                            | 已确定                 |
| FR7  | `item` 主题目标必须把解析后的对齐反映为其既有的 `align` 选择器轴，包含 `first-line`；Item 的公共主题化元数据必须列出该取值。对齐轴不新增目标，也不新增主题级默认值。                                                                                                                                                                                                                                                                                                                        | `architecture:component-theming-surface/INV6`；`component:Item/DEC-2`                                                          | 已确定                 |
| FR8  | ListItem、RadioListItem 与 CheckboxListItem 必须暴露 `align`，其取值与默认值和 Item 一致，并将其原样转发给它们渲染的 Item 行。组合行不得丢弃、重映射或收窄该取值。                                                                                                                                                                                                                                                                                                                          | 所有者指示                                                                                                                     | 已确定                 |
| FR9  | 交互行（`onClick` 行、`href` 行，或带 `interactiveRef` 的委托行）只对会激活它的按压显示触摸按压绘制：手指按在行表面或其自身动作上（其不可见的按钮或链接，或它所委托到的控件）会绘制该行，而手指按在行内另一个交互元素上则不会绘制任何内容。在带父级提供的 `role` 的行中，或根元素为链接的行中，按压嵌套控件会激活该行，因此会绘制。在拥有控件盒的行上（如 CheckboxList 或 RadioList 行），鼠标或触控笔按在另一个交互元素上同样不显示触摸按压绘制。这种鼠标按压会保留该行的 `:active` 绘制。 | 所有者指示，2026-11-03：容器不因不会激活它的按压而呈现按压态；所有者决策，2026-11-11：在拥有控件盒的行上，鼠标与触控笔同样如此 | 已确定                 |
| FR10 | `item` 主题目标必须把高亮、选中或禁用的行反映为 `data-highlighted`、`data-selected` 与 `data-disabled`，每个属性仅在其状态成立时存在，名称与 CommandPaletteItem 使用的相同。组合 Item 的行反映它传给 Item 的状态。                                                                                                                                                                                                                                                                          | `architecture:component-theming-surface/INV6`；已发布的源码与专项测试，未经所有者审查                                          | 已确定；未经所有者审查 |

### Allowed variation

- **AV1 — 槽位内容。** 任何槽位内容与尺寸都可以出现；FR2 对每个槽位独立成立，因此高度不同的起始槽位与结束槽位各自在首行居中。
- **AV2 — 主题排版。** 正文文本尺寸与行距可随主题变化；首行盒随之变化（FR5）。
- **AV3 — 行高。** 在 `first-line` 下，当槽位高于首行且存在描述或标签第二行时，行可能比同一行在 `center` 下更高（FR3）。

### Representative states

| 状态                               | 必需不变式                             | 允许的变化                  |
| ---------------------------------- | -------------------------------------- | --------------------------- |
| 换行标签、6px 圆点起始、短文本结束 | 两个槽位中心都在首行中心。             | 密度、主题排版、方向。      |
| 单行标签、无描述、任意槽位         | 与 `center` 相同。                     | 槽位尺寸。                  |
| 标签与描述、40px 头像起始          | 头像中心在首行中心；文本下移；行增高。 | 头像尺寸。                  |
| 带换行标签的单选按钮或复选框行     | 控件在首行居中。                       | 控件尺寸随 Field 尺寸变化。 |
| 从右到左                           | 相同的块轴位置；槽位按逻辑顺序镜像。   | 书写方向。                  |
| 省略 `align`                       | 与今天的 `center` 相同。               | 无。                        |

### Transformation and precedence order

- **ORD1 — 解析。** 组合行上显式的 `align` 会原样转发给 Item；Item 把省略的取值解析为 `center`；解析后的取值同时驱动几何与 `item` 目标的选择器轴，因此两者从不矛盾。

### Performance and resources

- **PR1 — 仅 CSS 几何。** 每种对齐取值都必须在 CSS 中实现：不使用测量、observer、监听器、状态、Effect 或额外的渲染轮次。

## Accessibility contract

- **AR1 — 仅呈现。** 对齐不得改变该行或其槽位的 DOM 顺序、角色、可访问名称或描述、焦点目标、Tab 顺序或点击目标。
- **AR2 — 不暴露文本。** 任何实现 `first-line` 的构造都不得向可访问性树贡献文本。

## Design relationships

| 解剖或状态     | 设计要求                 | 表示权威   | 层级角色 | 组件契约 |
| -------------- | ------------------------ | ---------- | -------- | -------- |
| 起始与结束内容 | 注释它所依附的标签首行。 | 所有者指示 | 支撑     | FR2–FR4  |
| 标签首行       | 槽位所对齐的参考行。     | Item 排版  | 突出     | FR5      |

## Family and system relationships

- `spec:AST-057` 拥有 Item 的滑动操作及其面板；对齐不改变它们，因为面板位于行的流之外。
- `family:navigation-destinations` 拥有 Item 的链接与导航语义；对齐不改变它们。
- `architecture:component-theming-surface` 拥有视觉轴如何到达主题目标；本记录向 Item 既有的 `align` 轴新增一个取值。
- `architecture:public-component-api` 拥有 prop 准入；FR8 为既有的运行时透传补上类型，而非新增一个并行概念。
- `architecture:internationalization` 拥有逻辑方向行为；FR6 应用它。
- `spec:AST-017/FR3` 将此归类为非破坏性功能：它新增一个取值和一个类型化 prop，不收窄任何内容，从不设置 `align` 的调用方看不到任何变化。

## Verification map

| 契约     | 验证                                                                                                                                                                  | 代表状态                                                                                              | 变异或失败预期                                                    | 审计小节              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | --------------------- |
| FR1, FR7 | `Item.test.tsx` 对齐与主题反映套件；公共类型测试                                                                                                                      | 省略、`center`、`start`、`first-line`                                                                 | 默认值改变、缺少 `data-align="first-line"` 或类型被放宽都会失败。 | `audit:Item/api`      |
| FR2–FR6  | 针对 Item 对齐 story 的真实 Chromium 几何断言                                                                                                                         | 带圆点与年龄的换行标签；头像；密度；RTL；主题                                                         | 槽位中心偏离首行中心超过 0.5px，或槽位被裁剪，即失败。            | `audit:Item/layout`   |
| FR8      | `List.test.tsx`、`RadioList.test.tsx`、`CheckboxList.test.tsx` 的转发用例                                                                                             | 每个带 `align="first-line"` 的组合行                                                                  | Item 根缺少 `data-align="first-line"` 的行失败。                  | `audit:Item/api`      |
| FR9      | `nestedTouchPress.adopters.test.tsx`；`Item.nestedPress.test.tsx`；`CheckboxList.test.tsx`、`RadioList.test.tsx` 与 `useClickableContainer.test.tsx` 中的嵌套控件用例 | 手指按在委托控件上；手指按在行内另一控件上；在 CheckboxList 或 RadioList 行上用鼠标与触控笔按另一控件 | 按在另一控件上却绘制的行，或按在其委托控件上却不绘制的行，失败。  | `audit:Item/behavior` |
| FR10     | `Item.test.tsx` 的“reflects highlighted, selected, and disabled on the item theme target”用例                                                                         | 普通、仅高亮、仅选中、仅禁用，以及三者同时                                                            | 缺少属性，或属性留在状态不成立的行上，失败。                      | `audit:Item/theming`  |
| AR1, AR2 | `first-line` 行对 `center` 行的可访问性树快照                                                                                                                         | 普通行与选项行                                                                                        | 名称、角色、描述或顺序上的任何差异都失败。                        | `audit:Item/a11y`     |
| PR1      | 对 Item 对齐样式的源码审查                                                                                                                                            | 所有取值                                                                                              | 为对齐新增 ref、observer 或 Effect 会在审查中失败。               | `audit:Item/layout`   |

## Decision log

<!-- Record the boundary or requirement, not how it was reached. A rejected alternative is at most one line here, kept only when it is consequential and likely to recur. -->

### DEC-1 — `first-line` is an opt-in value; `center` stays the default

**引用：** `component:Item/DEC-1`

**决策者：** cixzhang, 2026-10-16

带单行等大标记的换行标签需要把该标记放在其首行，而既有两个取值都做不到：`center` 把标记落到行中部，`start` 把标记顶部固定，这会让小标记位于该行中心之上。新增一个取值可以修好这些行，而不移动任何依赖今天默认值的行。

已否决：把 `first-line` 设为默认值，因为与整个文本块等大的槽位（例如标签与描述旁的头像）在 `center` 下才是正确的。

### DEC-2 — The theme setting is the `item` target's alignment axis

**引用：** `component:Item/DEC-2`

**决策者：** cixzhang, 2026-10-16

主题通过 `item` 目标既有的 `align` 选择器轴到达 `first-line` 行，与它们到达 `center` 和 `start` 的方式相同。主题可以为这些行设置样式；它不选择某行接收哪个取值。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
