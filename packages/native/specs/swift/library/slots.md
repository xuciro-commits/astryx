# 类型化插槽（Swift）

- Status: draft
- Relation: 将 AST-082 FR4
  （`docs/specs/AST-082-native-first-surfaces/spec.md`：类型化插槽——text、
  icon 和 content——以及平台对含义相同的 content 插槽采用更宽的形式）和 FR17（共享图标名称）应用于 Swift。它决定每种插槽类型在
  SwiftUI 中如何呈现；它不定义这些类型。

## 摘要

iOS 开发者可以在按钮中放一个图标、在列表行的开头放一个头像，或在行的末尾放任何
SwiftUI 视图，就像 SwiftUI 自己的 `Label` 接受
图标视图那样，而组件仍会为其内容设定尺寸并排序，因此每一行都对齐并以相同方式阅读。
图标始终是平台能够绘制的图标。应用的使用者看到的部件及其位置
与 Web 上相同，VoiceOver 以相同顺序阅读它们。

## 要求

- **S1 — 每个 AST-082 插槽类型都有一种 Swift 形式。**
  - **text** 插槽是 `String`，即契约的确切类型（AST-093 FR5）。本地化的
    文字写法不在本记录范围内。
  - **icon** 插槽是 `IconName`（S2）。
  - **content** 插槽通过 `@ViewBuilder`
    闭包接受任何 SwiftUI 视图（S3）。核心的 content 插槽持有具名的 Astryx 组件；Swift
    依据 AST-082 FR4 接受这种更宽的形式，该条允许平台对含义相同的 content 插槽
    接受更宽的形式，就如 Web 接受 React 节点。组件的原生附加项仍会列出核心插槽
    所持有的 Astryx 组件，以及它持有的是一个还是多个（列表项的 `startContent` 持有 `Icon`、`Avatar` 或 `CheckboxInput` 之一；卡片持有多个）。
    text 和 icon 插槽不采用更宽形式（不支持富文本，不支持图片），因此
    它们在 Swift 上与在核心中含义相同；如上所述，本地化的文字
    写法仍不在本记录范围内。没有插槽类型的自由形式 Web
    prop 只保留在 Web 契约中。
- **S2 — 图标名称是由字符串支撑的类型，内置名称作为成员。**
  `IconName` 是 `RawRepresentable`、`ExpressibleByStringLiteral`、
  `Hashable`、`Codable`、`Sendable` 值。每个内置语义名称都是
  静态成员（`.search`、`.close`），由 AST-082 FR17 的共享
  图标名称生成，在构建时通过 AST-082 FR16 列出的图标名称
  读取方式读取（以后通过核心的可移植入口），绝不从核心的 Web 图标注册表读取。
  带命名空间的名称（`"acme:rocket"`）在主题将其映射到
  图像后有效。`Theme(icons:)` 将共享或命名空间名称映射到 `IconImage`：
  `.systemName(_:)` 用于 SF Symbol，`.assetName(_:)` 用于
  应用资源目录中的图像，正如 AST-082 FR17 以 `systemName` 或
  `assetName` 命名原生图标；字符串字面量是 SF Symbol 名称。未知名称，或
  应用未提供的资源，会使开发构建停止并给出指明它的消息，
  在发布构建中不绘制任何内容，绝不使用替代品。
- **S3 — content 插槽是开放的，遵循 SwiftUI 的方式。** content 插槽是一个泛型
  `@ViewBuilder` 闭包参数，按核心 prop 命名
  （`startContent: () -> StartContent`，其中 `StartContent: View`），如
  SwiftUI 的 `Label { } icon: { }`，绝不使用 `AnyView`。对于
  核心插槽列出的每个 Astryx 组件，视图还有一个便利
  初始化器直接接收该组件的 props（例如行的
  `startContent: AvatarProps`）。props 初始化器将该插槽作为匹配的
  生成节点类型接收。
- **S4 — 所有者为其内容设定尺寸。** 组件根据自身的尺寸提出
  每个插槽的尺寸，并对插槽绘制的内容进行裁剪或对齐，
  无论其中是什么视图。Astryx 子级只有在核心如此时才继承其所有者的尺寸：
  所有者文档化的 icon 插槽中的 `Icon`（小号 `IconButton` 中的 `Icon` 是小号），
  以及契约采用尺寸级联的组件的子级。其他每个子级都保持自己的默认值（列表项中未指定尺寸的 `Avatar`
  保持 `md`）。子级上显式指定的尺寸在核心如此的地方优先，而在核心中为其成员
  设定尺寸的组件继续保持该行为：核心的 `AvatarGroup`
  会设置每个成员 `Avatar` 的尺寸，无论是否显式指定。
- **S5 — 阅读顺序遵循插槽顺序。** VoiceOver 按核心契约的顺序阅读组件的插槽
  （对于列表项：`marker`、`startContent`、
  `label`、`description`、`endContent`），无论它们持有什么视图。插槽中的装饰性
  图标除非带有标签，否则隐藏（AST-082 FR17）。
- **S6 — 插槽是声明的，不是猜的。** 每个组件的原生附加项
  为其保留的每个自由形式 prop 声明插槽类型，对于 content 插槽还要声明核心
  插槽所持有的 Astryx 组件；当保留的自由形式 prop 没有这些声明时，
  契约生成器失败。

## 验收检查

| 要求   | 检查                                                                                                                                                                                                         |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| S1, S6 | 生成器测试在以下夹具组件上失败：保留没有插槽类型的自由形式 prop，或保留未列出任何组件的 content 插槽；夹具中未保留的自由形式 prop 保持仅 Web，没有 Swift 形式；具有全部三种类型的夹具会生成每种 Swift 形式。 |
| S2     | 每个内置名称都映射到包的最低 iOS 版本上存在的 SF Symbol；注册 `acme:rocket` 会使 `"acme:rocket"` 绘制它；未注册的名称会停止开发构建，并在发布版中不绘制任何内容。                                            |
| S3     | 编译测试通过闭包将 `Avatar(…)` 传入列表项的 `startContent`，通过 `AvatarProps` 便利初始化器传入，并通过闭包传入一个普通 SwiftUI `Image`；`AnyView` 不出现在组件模块中。                                      |
| S4     | 一项测试读取小号和大号所有者的 icon 插槽中未指定尺寸的图标解析后的尺寸，发现列表项中未指定尺寸的 `Avatar` 为 `md`，并发现 `startContent` 中过大的 SwiftUI 视图的绘制边界位于插槽内。                         |
| S5     | 一项 UI 测试按顺序读取带有 marker、`startContent`、标签、描述和 `endContent` 的列表项，分别使用 Astryx 徽标和 `endContent` 中的普通 SwiftUI 文本。                                                           |

## 当前状态

- 契约生成器知道两种插槽类型：`text` 和 `content`；icon
  prop 没有可移植形式，因此 Button 和 Badge 的 icon props
  仅 Web。
- 内置图标名称仅在 TypeScript 中映射到 SF Symbols。

## 开放问题

无。

## 参考文献

- HIG，SF Symbols：https://developer.apple.com/design/human-interface-guidelines/sf-symbols
- `ViewBuilder`：https://developer.apple.com/documentation/swiftui/viewbuilder
- SwiftUI `Label`（开放的 icon 插槽）：https://developer.apple.com/documentation/swiftui/label
