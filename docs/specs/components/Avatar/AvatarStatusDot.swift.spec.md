---
schema_version: 3
template_version: 7
kind: component
id: component:swift/AvatarStatusDot
platform_of: component:AvatarStatusDot
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/AvatarStatusDotTests.swift,
    packages/native/src/contract/contracts.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# AvatarStatusDot (Swift) component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                           |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `AvatarStatusDot(variant: AvatarStatusDotVariant? = nil, label: String? = nil)` 与 `AvatarStatusDot(_ props: AvatarStatusDotProps)`，一个 SwiftUI `View`，放置在 `Avatar` 的 `status` 槽位中。 |
| 行为          | 按头像的尺寸层级绘制 core 的圆点：`success` 为实心，`neutral` 为圆环，`error` 为减号条，各自使用主题令牌并带一层 surface 边框。它的标签并入头像的姓名。                                        |
| 终端用户影响  | 用户通过形状与颜色看出某人在线、离开还是忙碌，VoiceOver 会连同该人的姓名一起朗读它（“Ada Lovelace, Online”）。                                                                                 |
| 构建者影响    | 应用把圆点放进头像的尾随闭包并附带一个标签。圆点内部的自定义图标在 Swift 中没有对应形式。                                                                                                      |
| 兼容性/就绪度 | 增量式：一个新视图、生成的 `AvatarStatusDotProps`，以及 Swift 字符串目录中 core 的“姓名加状态”消息。草稿；已在 macOS 和 iOS 模拟器上构建并测试；设备截图已附上。                               |
| 审查检查项    | 拒绝仅靠颜色表示的状态、会改变尺寸或移动头像的圆点、在头像内部被 VoiceOver 单独朗读的圆点，或不是主题令牌的颜色。                                                                              |
| 管辖规则      | `spec:AST-082` FR4、FR7；`spec:AST-093` FR1–FR5；`packages/native/specs/swift/library/` 下的 Swift 组件 API、槽位（S4）、主题环境与可访问性（X1、X6）记录。                                    |

本表是审查投影；以下正文才是权威。

## Intent

在 Apple 平台上，AvatarStatusDot 通过形状与颜色在头像上显示一个人的状态，尺寸取自头像，并为头像提供它的文字。

## Compatibility and migration

- 保留的已发布默认值：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 圆点的尺寸层级、填充、边框，以及每个 variant 的形状字形。
- 向持有它的头像报告自己的标签。

**不拥有 / 非目标**

- 圆点位于何处以及姓名如何组成——由
  `component:swift/Avatar` 拥有（FR7、AR6）。
- 各 variant 的含义——由 `component:AvatarStatusDot` 拥有。

## Public concepts

| 概念    | 封闭值或状态                  | 含义                                                         | 可用性（按 variant/orientation/state） | 默认值    | 所有者                      | 稳定性       | 无效值行为 |
| ------- | ----------------------------- | ------------------------------------------------------------ | -------------------------------------- | --------- | --------------------------- | ------------ | ---------- |
| variant | `success`, `neutral`, `error` | 实心圆点、圆环、减号条                                       | 始终                                   | `success` | `component:AvatarStatusDot` | experimental | 无         |
| tier    | small, medium, large          | 对不超过 36、72 以及更大尺寸的头像分别为 10、20、32 点的圆点 | 取自头像；单独时使用 small             | small     | `component:AvatarStatusDot` | experimental | 无         |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 依据                            | 草稿审查状态 |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------------ |
| FR1 | 圆点必须采用 core 针对其头像边长设定的层级：不超过 36 点时，圆点为 10 点、边框 1 点、字形描边 1 点；不超过 72 点时，圆点 20 点、边框 2 点、描边 1.5 点；更大时，圆点 32 点、边框 4 点、描边 2 点。在头像之外时它使用 small。                                                                                                                                                                                                                                                      | core `AvatarStatusDot` 尺寸层级 | verify       |
| FR2 | `success` 必须用 `color.success` 填充且不绘制字形；`neutral` 必须用 `color.backgroundSurface` 填充，并在内部区域绘制 `color.textSecondary` 的圆环；`error` 必须用 `color.error` 填充，并在内部区域四分之三的范围上绘制 `color.onError` 的圆头条。每个圆点都有一层 `color.backgroundSurface` 边框。底板采用强状态填充色 `color.success` 与 `color.error`，其墨水色是对应的内容角色 `color.onSuccess` 与 `color.onError`，与 core 的做法一致（`architecture:theme-tokens` INV11）。 | core `AvatarStatusDot` 样式     | verify       |
| FR3 | 两个初始化器都必须构建相同的 `AvatarStatusDotProps`。基础 props 通过 `AvatarStatusDotProps` 传入：带有 `isHidden` 时视图不绘制任何内容；`id` 成为可访问性标识符。                                                                                                                                                                                                                                                                                                                 | Swift 组件 API A2、A3、A7       | verify       |

### Allowed variation

- **AV1 — 字形绘制。** 圆环与条是使用 core 描边宽度的 SwiftUI 形状，
  而不是 core 的 SVG。

### Representative states

| 状态                 | 必需的不变式                     | 允许的变化 |
| -------------------- | -------------------------------- | ---------- |
| 每个 variant         | 其填充、字形与边框               | AV1        |
| 每个层级             | 其圆点、边框与描边               | 无         |
| 在圆形与方形上       | 由 `component:swift/Avatar` 放置 | 无         |
| 浅色与深色、两个主题 | 各主题的颜色                     | 无         |

### Transformation and precedence order

- **ORD1 — 层级。** 头像的边长 → 头像之外为 small。

### Performance and resources

- **PR1 — 仅形状。** 圆点绘制 SwiftUI 形状，不加载任何内容。

## Accessibility contract

- **AR1 — 位于头像内部。** 圆点的标签通过头像的姓名传达给 VoiceOver，
  并且圆点不是一个独立的元素（Swift 可访问性 X5）。
- **AR2 — 单独存在。** 头像之外带标签的圆点是一个以其标签命名的图像元素；
  不带标签的则被隐藏（X1）。
- **AR3 — 不单靠颜色。** 每个 variant 都有自己的形状（X6，Differentiate
  Without Color）。
- **AR4 — 不测量渲染树。** 测试断言视图所设置的内容；在存在由应用承载的目标之前，
  不测量渲染后的可访问性树。

## Design relationships

| 解剖结构或状态 | 设计要求                                        | 表示权威     | 层级角色 | 组件契约 |
| -------------- | ----------------------------------------------- | ------------ | -------- | -------- |
| 圆点与字形     | Apple Human Interface Guidelines，Accessibility | 由 core 规定 | 支撑性   | FR1、FR2 |

组件实现设计要求，但不复制其理由。

平台控件：SwiftUI 没有用于图像的状态徽标控件，因此圆点由 SwiftUI 形状绘制（`spec:AST-093` FR2）。指南页面：
Apple Human Interface Guidelines 中的 Accessibility。

读取的主题值：`color.success`、`color.error`、`color.onSuccess`、`color.onError`、`color.backgroundSurface`、
`color.textSecondary`。

## Family and system relationships

- `component:AvatarStatusDot` 拥有各 variant 与层级；本记录只陈述
  Swift 如何绘制它们。
- `component:swift/Avatar` 拥有圆点的放置位置与组合后的姓名。

## Verification map

| 契约     | 验证                                                                                                                                  | 代表状态                                                                               | 变更或失败预期                                                                | 审计小节                           |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ---------------------------------- |
| FR1      | `AvatarStatusDotTests.swift` 层级测试                                                                                                 | 36、48、128 点；无头像                                                                 | 圆点、边框或描边错误则失败                                                    | `audit:swift/AvatarStatusDot/tier` |
| FR2      | `AvatarStatusDotTests.swift` 的 variant 渲染、圆环边，以及 Y2K 中的忙碌条                                                             | 大层级下的每个 variant；neutral、butter、dark；Y2K 浅色，其中 on-error 与 surface 不同 | 填充错误、缺少圆环边或字形、条不是 on-error 色，或 success 上出现字形，则失败 | `audit:swift/AvatarStatusDot/look` |
| FR3      | `AvatarStatusDotTests.swift` 的初始化器测试；`contracts.test.ts`                                                                      | 两个初始化器                                                                           | props 不同则失败                                                              | `audit:swift/AvatarStatusDot/api`  |
| AR1, AR2 | `AvatarStatusDotTests.swift` 的组合姓名、独立特征与隐藏测试；圆点在渲染树中向其头像报告的标签不被测量（`component:swift/Avatar` AR3） | 带状态与不带状态的姓名；单独的圆点，带标签与不带标签                                   | 组合姓名缺少状态标签，或单独圆点缺少其标签与图像特征，则失败                  | `audit:swift/AvatarStatusDot/a11y` |

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 圆点中的自定义图标。** （`human-api`）core 的 `icon` 是自由形式的内容；
  一旦契约拥有共享的图标名槽位，它就会进入 Swift。

## Content boundary

本文件不重复使用方 props 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
