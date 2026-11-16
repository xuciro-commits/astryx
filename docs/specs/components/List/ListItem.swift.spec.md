---
schema_version: 3
template_version: 7
kind: component
id: component:swift/ListItem
platform_of: component:ListItem
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/ListItemTests.swift,
    packages/native/src/contract/contracts.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# ListItem (Swift) component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                       |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `ListItem(_ label:, description:, align:, href:, isDisabled:, isSelected:, startContent:, endContent:, onClick:)` 与 `ListItem(_ props: ListItemProps, startContent:, endContent:)`，一个泛型 SwiftUI `View`。 |
| Behavior                | 在 `List` 周围以该列表的密度、标记、分隔线与边缘绘制 `component:swift/Item`：标签首行上的圆点、圆环或其编号；分隔线之间为直角；齐边列表中没有内联内缩。                                                        |
| End-user impact         | 用户在 iPhone 上看到的项目符号列表、编号列表、设置列表与分隔列表，其布局与 Web 上一致，且无论行如何换行，每个标记都位于其行首行旁边。                                                                          |
| Builder impact          | 应用把 `ListItem` 放入 `List`；行采用列表的外观。滑动操作、`target` 与 `rel` 没有 Swift 形式。                                                                                                                 |
| Compatibility/readiness | 增量式：一个新视图与生成的 `ListItemProps`，以及 `Item` 上的内部列表钩子。草稿；已在 macOS 与 iOS 模拟器上构建并测试；设备截图附加在变更中。                                                                   |
| Review checks           | 拒绝以下情况：标记离开标签首行、行忽略其列表的密度、分隔线带圆角、齐边列表中出现内缩，或列表样式泄漏到插槽中嵌套的行。                                                                                         |
| Governing rules         | `spec:AST-082` FR3、FR4、FR7；`spec:AST-093` FR1–FR5；`component:swift/Item`；`packages/native/specs/swift/library/` 下的 Swift 组件 API、插槽、主题环境与可访问性记录。                                       |

本表是评审投影；以下正文具有权威性。

## Intent

Apple 平台上的 ListItem 是属于某个列表的行：它绘制为 `Item`，并采用该列表的密度、标记、分隔线与边缘，因此列表的每一行都一致，无需应用重复设置。

## Compatibility and migration

- 已发布默认值保持不变：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- 读取其周围的列表，并把密度、标记、内联内缩与圆角交给 `Item`。
- 绘制标记：圆点、圆环或行的编号。

**不负责 / 非目标**

- 行的布局、文字、状态与点击——由 `component:swift/Item` 负责。
- 编号、行间分隔线与列表边缘——由持有这些行的列表负责。
- 滑动操作——目前仅限 Web（`component:swift/Item` DEC-1）。

## Public concepts

| 概念   | 封闭取值或状态          | 含义                                              | 按变体/方向/状态的可用性 | 默认值 | 所有者                     | 稳定性       | 无效值行为 |
| ------ | ----------------------- | ------------------------------------------------- | ------------------------ | ------ | -------------------------- | ------------ | ---------- |
| marker | none, dot, ring, number | 该行的列表标记，来自其列表样式                    | 位于带标记样式的列表中   | none   | `component:ListItem`       | experimental | none       |
| list   | 位于列表中；单独        | 在列表中时行采用列表的外观；单独时它是普通 `Item` | 始终                     | 单独   | `component:swift/ListItem` | experimental | none       |

## Behavioral and layout contract

| ID  | Candidate invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Basis                                         | Draft review state |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ------------------ |
| FR1 | 该行 MUST 绘制为 `component:swift/Item`，带自己的标签、描述、对齐、链接、点击与状态，并采用其周围列表的密度；单独时它 MUST 与那个 `Item` 绘制得完全一致。                                                                                                                                                                                                                                                                                                                                                                                                                           | core `ListItem`                               | verify             |
| FR2 | 在带标记样式的列表中，该行 MUST 在其起始内容之前、宽度为 `space.s4` 的列中绘制一个标记，该列随 Dynamic Type 增大且在每一行上相同：`disc` 为以 `color.textPrimary` 填充的 6 点圆点，`circle` 为以 `color.textPrimary` 描边 1 点的 6 点圆环，`decimal` 为其编号加一个句点，使用正文字体与等宽数字，并在列末结束，使列表中每个句点对齐，与 core 的编号标记一致。宽于该列的编号会伸入行的内联内缩；宽于两者的编号会同样加宽列表中每一行的该列，因此任何编号都不会移动自己行的文字、与之重叠或被截断，且每一行都保持列表的文本边缘。对于每种对齐方式，标记的中心都位于标签首行盒的中心。 | core `ListItem` markers                       | verify             |
| FR3 | 在带分隔线的列表中，该行 MUST 以直角绘制其背景；在齐边列表中，它 MUST 没有内联内缩，因此其内容与背景延伸到列表的边缘。                                                                                                                                                                                                                                                                                                                                                                                                                                                              | core `ListItem` 的 `withDivider`、`edgeFlush` | verify             |
| FR4 | 列表的处理方式、外观与编号 MUST 仅应用于该行，而不应用于其起始或结束内容中嵌套的行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | core `ListContext` 作用域                     | verify             |
| FR5 | 两个初始化器 MUST 构建相同的 `ListItemProps`。插槽是带空默认值的泛型 `@ViewBuilder` 闭包；单个尾随闭包是起始内容，`onClick` 最后。基础属性通过 `ListItemProps` 传入。由逻辑核心发送的 ListItem 节点会在这些插槽中绘制其起始与结束内容节点（`spec:AST-082` FR19）。                                                                                                                                                                                                                                                                                                                  | Swift 组件 API A2–A4、A7；插槽 S3             | verify             |

### Allowed variation

- **AV1 — 标记绘制。** 圆点与圆环是 core 尺寸的 SwiftUI 形状，而非 CSS 盒子。

### Representative states

| 状态                       | 必需不变式                   | 允许的变化 |
| -------------------------- | ---------------------------- | ---------- |
| 单独                       | 与 `Item` 相同               | none       |
| 在列表中：每种密度         | 列表的内边距                 | none       |
| disc、circle、decimal 标记 | 在每种对齐方式下位于标签首行 | AV1        |
| 分隔线；齐边               | 直角；无内联内缩             | none       |
| 浅色与深色                 | 各主题的颜色                 | none       |

### Transformation and precedence order

- **ORD1 — 密度。** 列表的密度 → `balanced`。

### Performance and resources

- **PR1 — 一次额外测量。** 在带标记的列表内，居中对齐的行会测量其文字，以便把标记放在首行；其他行不测量任何内容。
- **PR2 — 编号。** 在列表内，行向列表报告其身份一次，列表按行出现的顺序为其编号。带编号的行还会报告其编号的宽度，列表据此确定一个共享列的尺寸。

## Accessibility contract

- **AR1 — 单行。** 行是 `Item` 的单个元素；编号标记最先被朗读，作为行的一部分（“3. Mix the batter”）；圆点或圆环被隐藏（Swift 可访问性 X5）。
- **AR2 — 不测量渲染树。** 测试断言视图所设置的内容；在存在应用托管的测试目标之前，不测量渲染后的可访问性树。

## Design relationships

| 解剖结构或状态 | 设计要求                                             | 表示权威     | 层级角色 | 组件契约 |
| -------------- | ---------------------------------------------------- | ------------ | -------- | -------- |
| 行与标记       | Apple Human Interface Guidelines 的 Lists and tables | 由 core 规定 | 支持性   | FR1–FR3  |

组件实现设计要求，但不复制其理由。

平台控件：没有自己的控件；该行是 `component:swift/Item`，它指明所使用的 SwiftUI 控件（`spec:AST-093` FR2）。指南页面：Apple Human Interface Guidelines 中的 Lists and tables 与 Accessibility。

读取的主题值：`space.s4`、`color.textPrimary`、正文字体，以及通过 `Item` 读取其令牌。

## Family and system relationships

- `component:swift/Item` 负责该行；本记录只说明列表行额外增加的内容。
- `component:ListItem` 负责属性与标记。

## Verification map

| 契约     | 验证                                                                                           | 代表性状态                                                                                                                               | 变更或失败预期                                                                                                               | 审计章节                      |
| -------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR1      | `ListItemTests.swift` 的单独与密度渲染                                                         | 单独；紧凑与宽松列表                                                                                                                     | 单独时与 `Item` 不同或忽略密度的行失败                                                                                       | `audit:swift/ListItem/row`    |
| FR2, AR1 | `ListItemTests.swift` 的编号、编号编排、列、句点对齐、共享列、首行、最大文本、双主题与朗读测试 | decimal；从 3 开始编号；“1.” 与 “10.”；宽于列与内缩的编号；最大文本尺寸下的 “9.”；每种对齐方式及最大文本尺寸下的 disc；neutral 与 butter | 缺少或错误的编号、未对齐的句点、为适合内缩的编号而加宽或未对每一行加宽的列、偏离首行的标记、自有颜色，或可朗读的圆点，均失败 | `audit:swift/ListItem/marker` |
| FR3      | `ListItemTests.swift` 的齐边与分隔线渲染                                                       | 有内边距与齐边；有分隔线与无分隔线                                                                                                       | 齐边列表中的内缩或分隔线之间的圆角失败                                                                                       | `audit:swift/ListItem/edge`   |
| FR4      | `ListItemTests.swift` 的嵌套行测试                                                             | 行结束内容中的一行                                                                                                                       | 带列表标记或内缩的嵌套行失败                                                                                                 | `audit:swift/ListItem/scope`  |
| FR5      | `ListItemTests.swift` 的初始化器与接线插槽测试；`contracts.test.ts`                            | 两个初始化器；带起始内容的接线节点                                                                                                       | 属性不一致，或插槽不绘制的接线节点，失败                                                                                     | `audit:swift/ListItem/api`    |

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方属性表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到其所有者。
