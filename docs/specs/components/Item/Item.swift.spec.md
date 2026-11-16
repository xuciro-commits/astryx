---
schema_version: 3
template_version: 7
kind: component
id: component:swift/Item
platform_of: component:Item
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/ItemTests.swift,
    packages/native/src/contract/contracts.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# Item (Swift) component contract

## Contract at a glance

| 领域         | 契约                                                                                                                                                                                                                                                                                      |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约     | `Item(_ label:, description:, align:, density:, labelLines:, descriptionLines:, layout:, href:, isHighlighted:, isSelected:, isDisabled:, startContent:, endContent:, marker:, onClick:)` 与 `Item(_ props: ItemProps, startContent:, endContent:, marker:)`，是一个泛型 SwiftUI `View`。 |
| 行为         | 绘制 core 的行：marker、起始内容、位于描述之上或旁边的标签、结束内容，并带有 core 的密度内边距、对齐、行数限制以及高亮、选中与禁用外观。带 `href` 时是 SwiftUI `Link`；仅有 `onClick` 时是 SwiftUI `Button`。                                                                             |
| 最终用户影响 | 用户看到与 Web 端一样对齐、一样易读的列表行、菜单行和设置行，可以轻点整行，VoiceOver 按插槽顺序朗读一行，并读出其选中或变暗状态。                                                                                                                                                         |
| 构建者影响   | 插槽通过闭包接受任意 SwiftUI 视图；单个尾随闭包即起始内容。滑动操作、`target`、`rel` 与 `data-testid` 没有 Swift 形式。                                                                                                                                                                   |
| 兼容性/就绪  | 增量式：一个新视图和生成的 `ItemProps`。草稿；已在 macOS 与 iOS 模拟器上构建并测试；设备截图附在该改动中。                                                                                                                                                                                |
| 审查检查     | 拒绝以下情况：插槽被声明为 `AnyView`；作为链接或按钮时绘制不同的行；被撑到触摸目标尺寸的静态行；仍会打开的禁用链接；不是主题 token 的颜色；或者行无法履行的滑动 prop。                                                                                                                    |
| 管治规则     | `spec:AST-082` FR3、FR4、FR7；`spec:AST-093` FR1–FR5；`packages/native/specs/swift/library/` 下的 Swift 组件 API（A2–A4、A7、A9）、插槽（S1、S3–S5）、主题环境与无障碍（X1、X2、X5、X7）记录。                                                                                            |

本表是审查用的投影；下文正文具有权威性。

## Intent

Apple 平台上的 Item 是 core 的行原语：它是列表行、菜单行和设置行的共享布局，用主题 token 与 SwiftUI 自带的链接和按钮控件绘制。

## Compatibility and migration

- 保留的已发布默认值：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 行的插槽顺序、间距、按密度划分的内边距，以及起始内容与结束内容相对文字的对齐。
- 行数限制、标签与描述的字体样式，以及高亮、选中与禁用外观。
- 在不改变绘制的前提下切换为 SwiftUI `Link` 或 `Button`，以及行的无障碍元素。

**不拥有 / 非目标**

- 各 prop 的含义 —— 由 `component:Item` 拥有。
- 列表标记、分隔线与边缘 —— 由持有这些行的列表拥有。
- 插槽绘制什么：`Icon`、`Avatar` 或任意视图都保持自身的尺寸与外观（Swift 插槽 S4：未指定尺寸的 Avatar 保持 `md`）。

## Public concepts

| 概念 | 封闭取值或状态                          | 含义                                                       | 按变体/方向/状态的可用性 | 默认值     | 所有者                 | 稳定性 | 无效值行为                      |
| ---- | --------------------------------------- | ---------------------------------------------------------- | ------------------------ | ---------- | ---------------------- | ------ | ------------------------------- |
| 插槽 | marker、startContent、endContent        | 通过 `@ViewBuilder` 闭包传入的任意 SwiftUI 视图            | 始终                     | 空         | `component:Item`       | 实验性 | 无                              |
| 密度 | `compact`、`balanced`、`spacious`       | 间距 1、2、3 的块向内边距；行内内边距为 2，spacious 时为 3 | 始终                     | `balanced` | `component:Item`       | 实验性 | 无                              |
| 对齐 | `center`、`start`、`firstLine`          | 插槽在文字上居中、位于文字顶部，或位于标签首行             | 始终                     | `center`   | `component:Item`       | 实验性 | 无                              |
| 布局 | `stacked`、`inline`                     | 描述位于标签之下或旁边                                     | 带描述时                 | `stacked`  | `component:Item`       | 实验性 | 无                              |
| 控件 | 静态、链接（`href`）、按钮（`onClick`） | 轻点的行为方式；绘制相同                                   | 始终                     | 静态       | `component:swift/Item` | 实验性 | 不是绝对 URL 的 `href` 不是链接 |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 依据                                    | 草稿审查状态 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- | ------------ |
| FR1 | 行必须按该顺序排布 marker、起始内容、文字与结束内容，间隔为 `space.s2`，文字占据剩余宽度，位于 `compact`、`balanced` 或 `spacious` 对应的 `space.s1`、`s2` 或 `s3` 块向内边距之内，行内内边距为 `space.s2`，spacious 时为 `s3`。                                                                                                                                                                                                                                                                                                                                                                                                                   | core `Item` 样式                        | verify       |
| FR2 | 标签必须以正文字体样式与 `color.textPrimary` 绘制，描述以辅助字体样式与 `color.textSecondary` 绘制，各自限制为 `labelLines` 或 `descriptionLines` 行并在其后截断：未设置时为一行，为零时为所有行，与 core 的行相同。每一行采用主题的行距，并随 Dynamic Type 增大。使用 `inline` 且带描述时，描述位于标签旁边，间隔为 `space.s1`，且标签不收缩；没有描述时，标签保持其行数限制。                                                                                                                                                                                                                                                                    | core `Item` 样式                        | verify       |
| FR3 | `center` 必须让每个插槽在文字上居中；`start` 必须让每个插槽的顶部对齐文字顶部；`firstLine` 必须让每个插槽在标签首行上居中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | core `Item` `align`                     | verify       |
| FR4 | `isSelected` 必须在行背后绘制 `color.accentMuted`，`isHighlighted` 绘制 `color.overlayHover`，在元素圆角内以选中优先。`isDisabled` 必须以半不透明度绘制文字与结束内容，与 core 相同；marker 与起始内容保持各自的外观。被按下的按钮行或链接行在其选中或高亮填充之上绘制 `color.overlayPressed`，与 core 相同。                                                                                                                                                                                                                                                                                                                                      | core `Item` 样式                        | verify       |
| FR5 | 当 `href` 是绝对 URL（带有 scheme）时，行必须是 SwiftUI `Link`，且 `onClick` 不运行。在 core 中，链接是标签，行上其他位置的点击会运行 `onClick`；SwiftUI `Link` 占据整行，因此 Swift 行没有这样的区域。脚本 URL（`javascript:`、`vbscript:`）或 `data:` URL 中的 HTML 文档必须让行保持惰性，绝不作为链接，正如 core 的导航目标拒绝它们（`family:navigation-destinations` FR4）。不是绝对 URL 的 `href`，例如 web 路径，必须让开发构建停止并给出指明它的消息；发布构建绘制不带链接的行。仅有 `onClick` 时，是一个 SwiftUI `Button`。可轻点的行至少 44 points 高；静态行保持 core 的高度。禁用的链接或按钮仍然可到达，读作变暗，并且不执行任何操作。 | Swift 组件 API A4；Swift 无障碍 X2、X7  | verify       |
| FR6 | 两个初始化器必须构建相同的 `ItemProps`。插槽是带空默认值的泛型 `@ViewBuilder` 闭包，绝不是 `AnyView`；单个尾随闭包是起始内容，`onClick` 位于最后。基础 props 通过 `ItemProps` 传入：使用 `isHidden` 时视图不绘制任何内容；`id` 成为无障碍标识符。                                                                                                                                                                                                                                                                                                                                                                                                  | Swift 组件 API A2–A4、A7；Swift 插槽 S3 | verify       |

### Allowed variation

- **AV1 — 触摸高度。** 可轻点的行至少 44 points 高，这可能高于 core 的 compact 或 balanced 行。
- **AV2 — 行度量。** 一行的高度来自主题行距叠加在系统字体自身的行高之上，因此自定义字体可能相差一个 point。

### Representative states

| 状态                 | 必需不变式                           | 允许的变化 |
| -------------------- | ------------------------------------ | ---------- |
| 每种密度             | core 的块向与行内内边距              | 无         |
| 标签与描述、两种布局 | 描述位于标签之下或旁边               | 无         |
| 带高插槽的每种对齐   | 插槽居中、位于顶部，或位于首行       | 无         |
| 选中、高亮、禁用     | 来自主题的各自外观；选中优先         | 无         |
| 静态、链接、按钮     | 相同的绘制；可轻点的行至少 44 points | AV1        |
| 浅色与深色、两套主题 | 每套主题的颜色                       | 无         |

### Transformation and precedence order

- **ORD1 — 背景。** 选中 → 高亮 → 无。
- **ORD2 — 控件。** `href`（链接） → `onClick`（按钮） → 静态。

### Performance and resources

- **PR1 — 无类型擦除。** 插槽是泛型的，因此行不引入任何 `AnyView` 装箱。

## Accessibility contract

- **AR1 — 每行一个元素。** 静态行是一个元素，其标签按顺序朗读各插槽：marker、起始内容、标签、描述、结束内容。链接行或按钮行是一个链接或按钮元素，以相同方式朗读（Swift 无障碍 X5；Swift 插槽 S5）。
- **AR2 — 状态。** 选中的行读作已选中。禁用的行留在 VoiceOver 顺序中，并读作变暗（X1、X2）。
- **AR3 — 触摸目标。** 可轻点的行至少 44 points 高（X7）。
- **AR4 — 不测量渲染树。** 测试断言视图所设置的内容；在存在由应用托管的目标之前，不测量渲染后的无障碍树。

## Design relationships

| 解剖或状态 | 设计要求                                           | 表示权威     | 层级角色 | 组件契约 |
| ---------- | -------------------------------------------------- | ------------ | -------- | -------- |
| 行         | Apple Human Interface Guidelines，Lists and tables | 由 core 规定 | 支撑     | FR1–FR5  |

组件实现设计要求，而不复制其理由。

平台控件：曾考虑 SwiftUI `List`，但它并不合适：它是一个拥有自己行的滚动容器，而 core 的 Item 是可以位于任何容器中的行，包括 Card、Section 或对话框（`spec:AST-093` FR2）。该行使用 SwiftUI `Link` 与 `Button` 处理轻点，并自行绘制布局。指南页面：Apple Human Interface Guidelines 中的 Lists and tables、Buttons 与 Accessibility。

读取的主题值：`space.s1`、`space.s2`、`space.s3`、`radius.element`、`color.textPrimary`、`color.textSecondary`、`color.accentMuted`、`color.overlayHover`、`color.overlayPressed`、正文字体样式与辅助字体样式，以及 Dynamic Type。

## Family and system relationships

- `component:Item` 拥有各 prop、插槽与行的外观；本记录只说明 Swift 如何绘制它们。
- 列表拥有其各行的标记、分隔线与边缘。

## Verification map

| 契约     | 验证                                                                              | 代表性状态                                                                                | 变异或失败预期                                                                  | 审计小节                   |
| -------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------- |
| FR1、FR2 | `ItemTests.swift` 的密度、行距、行数限制与最大文本渲染                            | 每种密度；一行与三行标签；最大文本尺寸                                                    | 内边距、行距或行数限制错误，或者行不增高，失败                                  | `audit:swift/Item/layout`  |
| FR3      | `ItemTests.swift` 的对齐渲染                                                      | 带描述的 `start` 与 `center`；插槽高于一行的 `firstLine`                                  | 插槽偏离文字顶部、中部或标签首行，失败                                          | `audit:swift/Item/align`   |
| FR4      | `ItemTests.swift` 的背景、双主题与禁用渲染                                        | 选中、高亮、两者同时；neutral、butter；禁用                                               | token 错误、高亮盖过选中，或禁用行未变暗，失败                                  | `audit:swift/Item/states`  |
| FR5、AR2 | `ItemTests.swift` 的触摸高度渲染；轻点、trait、`linkURL` 与被拒绝目标的测试       | 静态、按钮、链接；选中；空 `href`；`javascript:`、`vbscript:` 与 `data:text/html` 的 href | 可轻点的行过矮、静态行增高，或缺少选中 trait，失败；被拒绝的目标变成链接，失败  | `audit:swift/Item/control` |
| FR6      | `ItemTests.swift` 的初始化器、尾随闭包、隐藏与 wire 插槽测试；`contracts.test.ts` | 两个初始化器；每个插槽；`isHidden`                                                        | props 不同、闭包填错插槽，或隐藏的行仍被绘制，失败；wire 节点的插槽不绘制，失败 | `audit:swift/Item/api`     |

## Decision log

### DEC-1 — Swipe actions are web-only for now

**引用：** `component:swift/Item/DEC-1`

**决策者：** cixzhang，2026-10-31

`swipeActions` 没有 Swift 形式。SwiftUI 的滑动操作只对 SwiftUI `List` 内的行生效，因此位于其他任何位置的 Item 都无法履行它们；iPhone 或 Mac 上的用户改用行自身的操作或其结束内容。Swift 形式要等到行在任何位置都能履行滑动操作时才会出现。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
