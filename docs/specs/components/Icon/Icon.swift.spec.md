---
schema_version: 3
template_version: 7
kind: component
id: component:swift/Icon
platform_of: component:Icon
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/IconTests.swift,
    packages/native/src/contract/contracts.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-size-cascade,
    architecture:icon-resolution-and-component-slots,
  ]
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# Icon (Swift) component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                          |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Icon(_ icon: IconName, color: IconColor? = nil, size: IconSize? = nil, label: String? = nil)` 与 `Icon(_ props: IconProps)`，是模块 `Astryx` 中的一个 SwiftUI `View`。`IconName` 是以字符串为底层的名称，每个内置名称都是其静态成员（`.search`、`.close`）。 |
| 行为          | 绘制主题或平台将该名称映射到的图像（一个 SF Symbol，或应用自带的资源），置于核心图标尺寸的正方形盒子中，并随 Dynamic Type 放大，使用核心的图标颜色 token 或周围的前景色。没有任何映射的名称，或应用未自带的资源，不绘制任何内容。                             |
| 终端用户影响  | 用户看到每个共享图标对应平台自己的符号，或在主题映射了自有图像处看到应用自己的图形，其尺寸与颜色与 web 上一致，并且 VoiceOver 只朗读带标签的图标。                                                                                                            |
| 构建者影响    | 应用传入一个共享名称（`.search`），或一个在其主题中映射的名称（`"acme:rocket"`）。web 也接受的 SVG 组件在 Swift 中没有对应形式。                                                                                                                              |
| 兼容性/就绪度 | 增量式：一个新视图和一个新生成的 `IconName` 类型。草稿；已在 macOS 和 iOS Simulator 上构建并测试；设备截图附在变更中。                                                                                                                                        |
| 审查检查项    | 拒绝：为未知名称使用替代符号、图标槽位的图像或富文本形式、契约之外的视觉参数、VoiceOver 会朗读的无标签图标，或所有者的尺寸压过显式 `size`。                                                                                                                   |
| 治理规则      | `spec:AST-082` FR4、FR7、FR17；`spec:AST-093` FR1–FR5；`packages/native/specs/swift/library/` 下的 Swift 组件 API、样式、槽位、主题环境和无障碍记录。                                                                                                         |

本表是审查用的投影；以下正文具有权威性。

## Intent

Icon 在 Apple 平台上把 Astryx 的共享图标名称绘制为 SF Symbols，或在主题映射处绘制为应用自带的图像，因此系统控件旁的图标看起来像平台自己的图标，同时其尺寸、颜色和无障碍遵循核心 `Icon` 契约。

## Compatibility and migration

- 已发布默认值保持不变：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 将共享图标名称解析为图像：主题的映射（一个 SF Symbol 或一个应用资源），否则为平台的默认 SF Symbol。
- 在核心图标尺寸的正方形盒子中绘制图像，随 Dynamic Type 放大，使用核心的图标颜色 token。当资源目录将其渲染为模板图像时，资源采用该颜色 token；当渲染为原始图像时，资源保留自己的颜色。
- 图标的 VoiceOver 暴露。

**不拥有 / 非目标**

- `icon`、`color`、`size` 和 `label` 以及内置名称的含义 —— 由 `component:Icon` 和 `spec:AST-082` FR17 拥有。
- 所有者在自己的图标槽位中为图标指定哪个尺寸 —— 由每个所有者组件和 `architecture:component-size-cascade` 拥有。
- 每个名称的默认 SF Symbol —— 由 `@astryxdesign/native` 的图标默认值拥有，测试使其与 Swift 映射保持一致。

## Public concepts

| 概念     | 封闭取值或状态                                                                                                     | 含义                                                                  | 按变体/方向/状态的可用性 | 默认值                      | 拥有者                 | 稳定性 | 无效值行为                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------ | --------------------------- | ---------------------- | ------ | -------------------------------------------------------- |
| 图标名称 | 内置名称；主题映射的 `<library>:<name>`                                                                            | `IconName`，在传输中是字符串，每个内置名称都是一个静态成员            | 始终                     | 必填                        | `component:Icon`       | 实验性 | 未映射的名称会中止开发构建，并在发布构建中不绘制任何内容 |
| 符号来源 | 主题映射；平台默认                                                                                                 | `Theme(icons:)` 用 SF Symbol 或应用资源替换内置名称，或注册一个库名称 | 始终                     | 平台默认                    | `component:swift/Icon` | 实验性 | 主题条目优先于默认值                                     |
| 尺寸     | `xsm`、`sm`、`md`、`lg`；未设置                                                                                    | 在默认文本尺寸下为 12、16、20、24 点                                  | 始终                     | 所有者的图标尺寸，否则为 md | `component:Icon`       | 实验性 | 未设置时取所有者的尺寸，再取 `md`                        |
| 颜色     | `primary`、`secondary`、`tertiary`、`disabled`、`accent`、`info`、`success`、`error`、`warning`、`inherit`；未设置 | 核心的图标颜色 token；`inherit` 保留周围的前景色                      | 始终                     | `inherit`                   | `component:Icon`       | 实验性 | 未设置即 `inherit`                                       |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                          | 依据                                                  | 草稿审查状态 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ------------ |
| FR1 | 该视图 MUST 绘制主题的 `icons` 将该名称映射到的图像，即一个 SF Symbol 或应用自带的资源，否则为内置名称的平台默认值。既未映射的名称，或应用未自带的资源，MUST 在开发构建中以指明该名称的消息中止，并在发布构建中不绘制任何内容，绝不使用替代物。                                     | `spec:AST-082` FR17；Swift slots S2                   | verify       |
| FR2 | 该符号 MUST 适配一个正方形盒子，其边长为核心的点数尺寸（`xsm`、`sm`、`md`、`lg` 分别为 12、16、20、24），再乘以主题环境读取的 Dynamic Type 缩放。                                                                                                                                   | 核心 `Icon` 尺寸；`spec:AST-093` FR3；主题环境 E1     | verify       |
| FR3 | 该视图 MUST 使用自己的 `size`，否则使用其所有者组件在已记录图标槽位中为图标指定的尺寸，再否则使用 `md`。                                                                                                                                                                            | `architecture:component-size-cascade`；Swift slots S4 | verify       |
| FR4 | 该视图 MUST 使用核心为其 `color` 定义的 token 绘制 —— primary 与 secondary 图标 token、`tertiary` 使用 secondary 图标 token、disabled 图标 token、强调色，以及 `info`、`success`、`error` 和 `warning` 状态图标角色 —— 并且，对于 `inherit` 或没有颜色，MUST 保留周围的前景色样式。 | 核心 `Icon` 颜色映射； `spec:AST-093` FR4             | verify       |
| FR5 | 两个初始化器 MUST 构建相同的 `IconProps`；带标签的初始化器以生成的类型和默认值接收契约的属性，基础属性（`id`、`isHidden`）通过 `IconProps` 传入。使用 `isHidden` 时视图不绘制任何内容；`id` 成为无障碍标识符。                                                                      | Swift 组件 API A2、A3、A7；`spec:AST-082` FR7         | verify       |

### Allowed variation

- **AV1 — 字形形状。** 字形是平台的 SF Symbol，而不是 web 的 SVG；主题可以将任意名称映射到另一个 SF Symbol，或映射到应用自带的图像（`spec:AST-082` FR17）。

### Representative states

| 状态                   | 必需不变式                                  | 允许的变化         |
| ---------------------- | ------------------------------------------- | ------------------ |
| 每个尺寸               | 在 Large 文本下盒子边长为 12、16、20、24 点 | 每个符号的字形比例 |
| 每种颜色，浅色与深色   | 当前模式下该颜色的 token                    | 无                 |
| 位于所有者的图标槽位内 | 所有者的尺寸，除非图标设置了自己的尺寸      | 无                 |
| 最大文本尺寸           | 盒子随 Dynamic Type 增大                    | 无                 |
| 带标签与不带标签       | VoiceOver 只朗读带标签的图标                | 无                 |

### Transformation and precedence order

- **ORD1 — 图像。** 主题映射（SF Symbol 或应用资源）→ 平台默认 SF Symbol → 无。
- **ORD2 — 尺寸。** 显式 `size` → 所有者的图标尺寸 → `md`，然后 × Dynamic Type 缩放。

### Performance and resources

- **PR1 — 没有自己的图像数据。** 该视图按名称绘制系统符号，或按名称从应用的主 bundle 绘制资源；它不持有图像数据，也不从网络加载任何内容。

## Accessibility contract

- **AR1 — 除非带标签，否则为装饰性。** 没有 `label`，或 `label` 为空时，该视图对 VoiceOver 隐藏。带标签时，它是一个由该标签命名的图像元素，保留 SwiftUI 的图像特征且不添加其他特征（`spec:AST-082` FR17；Swift 无障碍 X1、X4）。在头像的状态槽位中，带标签的图标还会命名该状态，该名称并入头像的名称（`component:swift/Avatar` AR6）。
- **AR2 — 不测量渲染树。** 测试断言视图设置了什么；在存在应用宿主目标之前，不测量渲染出的无障碍树。

## Design relationships

| 构型或状态 | 设计要求                                                       | 表现权威   | 层级角色 | 组件契约 |
| ---------- | -------------------------------------------------------------- | ---------- | -------- | -------- |
| 字形       | SF Symbols（Apple Human Interface Guidelines），或一个应用资源 | 由平台规定 | 支撑性   | FR1, FR2 |

该组件实现设计要求，但不复制其理由。

平台控件：SwiftUI `Image(systemName:)`，或对应用资源使用 `Image(_:bundle:)`。它是平台自己的图标视图并满足契约，因此不需要自定义绘制（`spec:AST-093` FR2）。指南页面：Apple Human Interface Guidelines 中的 SF Symbols 与 Accessibility。

读取的主题值：`color.iconPrimary`、`color.iconSecondary`、`color.iconDisabled`、`color.accent`、`color.iconInfo`、`color.iconSuccess`、`color.iconError`、`color.iconWarning`、主题的 `icons` 映射，以及 Dynamic Type 缩放。

## Family and system relationships

- `component:Icon` 拥有属性、内置名称、尺寸刻度和颜色映射；本记录只说明 Swift 如何绘制它们。
- `architecture:component-size-cascade` 拥有所有者的图标尺寸何时适用；所有者通过该视图读取的一个内部环境值来设置它。

## Verification map

| 契约     | 验证                                                                                                      | 代表性状态                                                                               | 变更或失败预期                                                                   | 审计小节                   |
| -------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------- |
| FR1      | `IconTests.swift` 的符号与资源测试（测试 bundle 代替应用的 bundle）；`contracts.test.ts` 的 IconName 测试 | 每个内置名称；主题替换；库名称；一个自带的资源；一个缺失资源不绘制并上报（发布构建路径） | 缺失的默认值、平台上不存在的符号、会绘制或不上报的缺失资源，或一个替代物，均失败 | `audit:swift/Icon/symbols` |
| FR2, FR3 | `IconTests.swift` 的尺寸与 Dynamic Type 渲染                                                              | 每个尺寸；所有者尺寸；显式尺寸；AX5                                                      | 错误的边长，或所有者尺寸压过显式尺寸，均失败                                     | `audit:swift/Icon/size`    |
| FR4      | `IconTests.swift` 的颜色映射与双主题渲染                                                                  | 每种颜色；neutral 与 butter                                                              | 错误的 token，或视图自有的颜色，均失败                                           | `audit:swift/Icon/color`   |
| FR5      | `IconTests.swift` 的初始化器与隐藏测试                                                                    | 两个初始化器；`isHidden`                                                                 | 属性不一致，或绘制了隐藏图标，均失败                                             | `audit:swift/Icon/api`     |
| AR1      | `IconTests.swift` 的无障碍断言                                                                            | 带标签、不带标签、空标签                                                                 | 无标签却带标签的图标，或带标签却没有标签，均失败                                 | `audit:swift/Icon/a11y`    |

## Decision log

没有记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的拥有者。
