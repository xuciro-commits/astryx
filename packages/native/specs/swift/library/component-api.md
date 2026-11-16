# 组件 API（Swift）

- Status: draft
- Relation: 扩展 AST-093 FR1 和 FR5，以及 AST-082 FR3、FR4、FR5、FR7、FR8。
  它决定一个 SwiftUI 视图如何暴露其组件的生成契约。

## 摘要

iOS 开发者编写 `import Astryx`，然后使用
`Button("Save", variant: .primary) { save() }`，或者在同时也导入了 SwiftUI 的文件中
写作 `Astryx.Button(…)`。它读起来像 SwiftUI 自己的
`Button`，自动补全与 Web 相同的 prop 名称，并拒绝契约不允许的值。应用的使用者
获得与 Web 相同的措辞、状态和行为，因为每个 Swift 视图都由
同一个生成契约驱动。

## 要求

- **A1 — 核心名称，位于名为 `Astryx` 的模块中。** 库产物和
  持有视图的 Swift 模块都名为 `Astryx`。组件的
  SwiftUI 视图使用核心组件的名称，不加前缀（`Button`、`Text`、
  `Card`），遵循 `View`，并位于组件自己的文件夹中。同一
  规则也命名主题类型（`Theme`、`Tokens`）和生成的
  契约类型（`ButtonProps`、`ButtonVariant`）。由逻辑核心
  驱动视图的生成 wire 类型（`AstryxNode`、`AstryxAction`、
  `AstryxBaseProps`）没有核心名称，保留自己的名称。该模块
  重新导出 SwiftUI 和生成的契约，因此 `import Astryx` 是
  应用文件唯一需要的导入。模块内没有任何类型名为 `Astryx`，因此
  模块限定名总能解析。
- **A1a — 两种写法，一个视图。** `Button(…)` 和模块限定的
  `Astryx.Button(…)` 命名同一个视图。
  - 在导入 `Astryx` 而不导入 SwiftUI 的文件中，未限定的共享名称
    （A1b）指 Astryx 的类型，因为 SwiftUI 只通过 Astryx 的
    重新导出到达该文件。系统类型写作 `SwiftUI.Button`。
  - 在同时直接导入 SwiftUI，或导入另一个声明了同名名称的模块的
    文件中，该文件写作 `Astryx.Button` 和
    `SwiftUI.Button`。在那里，Swift 会将类型位置上的未限定共享名称
    视为有歧义而拒绝。调用则通过重载排名解析：两个模块的初始化器都接受的
    字符串字面量调用会无错误地解析为 Astryx 的视图，因为字符串字面量的默认类型
    `String` 排名高于 SwiftUI 的 `LocalizedStringKey`；而只有一个
    模块的初始化器接受的调用会针对该模块编译。因此对于
    调用，限定符是这条规则，而不是编译器错误。
  - 文档和示例在同一个文件中出现 SwiftUI 同名视图的任何地方
    都写作 `Astryx.Button`。
- **A1b — 包内代码始终限定系统视图。** 在 `Astryx`
  模块内部，未限定的名称指 Astryx 类型，因此 Astryx 也命名的每个
  SwiftUI 类型的使用都以其所属模块书写。如今在 `import SwiftUI` 下
  可见的 Astryx 名称有 `Button`、`ContextMenu`、
  `Divider`、`Grid`、`Layout`、`Link`、`List`、`Section`、`Slider`、`Stepper`、
  `Tab`、`Table`、`TableRow` 和 `Text`（写作 `SwiftUI.<Name>`），`Calendar` 和 `Timer`（写作 `Foundation.<Name>`），以及
  `Selector`（写作 `ObjectiveC.Selector`）；新组件的名称若被这些模块中的
  任何一个声明，就加入此列表。
- **A1c — 修饰符保留前缀。** 视图修饰符位于 SwiftUI 的 `View`
  上，并与所有其他库共用一个命名空间，因此带前缀：
  `.astryxTheme(_:)`。
- **A2 — 契约就是参数列表。** 正在构建的平台（iOS 上为 `ios`，macOS 上为 `macos`，例如 Selector 的 `menuStyle`）所对应生成的 `<Name>Props` 中的每个核心 prop 和每个
  平台 prop，都是视图的一个参数，具有相同的名称、
  相同的生成类型和相同的默认值。核心契约只包含所有平台都遵循的
  prop（AST-082 FR3），每个 prop 在每个 Apple 设备上都保持其完整含义，
  并在设备有差异时按设备适配；绝不接受没有该含义的
  prop（`architecture:public-component-api` INV2）。只有一个平台
  能遵循的 prop 是该平台的 prop，例如 Switch 的 `size`，
  只有 macOS 能用系统开关实现它。Switch 的 `labelPosition` 和
  `labelSpacing` 在 Apple 契约中不存在：Apple 的开关行遵循系统开关
  布局，标签在前，开关在后，两者之间的间距由系统决定。`content` 插槽在
  `<Name>Props` 中被省略，转而作为两个初始化器的参数：带标签的
  初始化器将其作为 `@ViewBuilder` 闭包，props 初始化器将其作为该插槽的
  生成节点类型（A3、A4）。视图
  导入生成的契约类型，绝不声明自己的一份生成枚举副本。契约缺少的 prop
  绝不在 Swift 中添加；这是契约缺口。
- **A3 — 两种入口，一种含义。** 视图有一个接收 `<Name>Props` 的初始化器，
  供生成的调用方和 wire 驱动的调用方使用；还有一个带标签参数的
  SwiftUI 风格初始化器。两者都接收每个 content 插槽——带标签的初始化器将其作为
  `@ViewBuilder` 闭包，props 初始化器将其作为该插槽的生成节点类型，
  如 `packages/native/specs/swift/library/slots.md` 所述——并且两者都用相同的
  `<Name>Props` 值构建视图；视图的 `body`
  只读取这些值和插槽。这两个初始化器，以及接收插槽组件 props 的便利
  初始化器（slots S3），是同一个 API 的多种 Swift
  写法（`architecture:public-component-api` INV21）：每个都构建相同的
  `<Name>Props`，便利初始化器用其 props 描述的组件填充其插槽。
- **A4 — SwiftUI 概念采用 SwiftUI 形态。**
  - 组件的主词在前且不带标签，如 `Button` 和
    `Text`。
  - `content` 插槽（AST-082 FR4，及其允许平台对 content 插槽
    接受更宽形式的修订）是一个泛型 `@ViewBuilder`
    闭包参数，接受任何视图，如
    `packages/native/specs/swift/library/slots.md` 所述，绝不使用 `AnyView`。`text` 插槽是文字，即
    `<Name>Props` 的 `String` 字段（A5）；`icon` 插槽是
    `IconName` 字段。
  - 没有默认值的参数位于有默认值的参数之前，但必需的动作参数除外；
    它放在最后，以便作为尾随闭包。
  - 原生形式是另一个 SwiftUI 控件的 prop 会切换
    控件：设置 `href` 时，Button、Avatar 和 Item 绘制 SwiftUI `Link`，
    于是由系统打开它，VoiceOver 将其读作
    链接。各自保持自己的外观：Button 通过 Astryx 按钮样式，
    Avatar 和 Item 与没有 `href` 时绘制的外观相同。禁用遵循核心：
    带 `href` 的禁用 Button 绘制其禁用按钮，而不是链接，正如核心
    绘制禁用 `<button>`；带 `href` 的禁用 Item 仍是链接，
    VoiceOver 将其读作变暗且不会打开，正如核心保留禁用
    链接；Avatar 没有禁用状态。
    带 `href` 的加载中 Button 的行为是 Button 自己的规则
    （`component:swift/Button` FR4）。
- **A5 — 文字和值采用契约的类型。** 文字 prop 是契约的 `String`，
  值 prop 及其变更回调是契约的两个参数，如 AST-093 FR5 要求。文字的可本地化
  写法与值的 `Binding` 写法是 OQ1。
- **A6 — 契约之外没有样式参数。** 契约自身的视觉 prop
  （例如 `color`、`padding` 和 `elevation`）如 A2 所述作为参数。视图不添加契约缺少的视觉参数（没有 SwiftUI
  `Color`、`Font`、`CGFloat` 内边距、圆角或阴影参数），也没有
  公开的 `*Style` 协议；其他一切视觉内容都来自主题
  （AST-082 DEC-2）。组件周围的布局留给调用方自己的
  修饰符。
- **A7 — 基础 props 映射一次。** `id` 成为 `accessibilityIdentifier`，
  `isHidden` 将视图从布局和无障碍树中移除，作用于契约 `baseTarget`
  指定的部分（AST-082 FR7）。
- **A8 — 每个公开声明都有一句话的文档注释**，并在存在对应核心 prop 时
  点明它映射到的核心 prop；没有核心 prop 的声明
  （初始化器、content 插槽、样式或修饰符）则点明它服务的契约
  部分。
- **A9 — SwiftUI 已提供的布局不再提供。** Swift 公开 API
  不提供 HStack 或 VStack 视图；应用使用 SwiftUI 自己的栈并配合
  token 间距（`theme.space.s4`）。Apple 宿主上的逻辑核心树保留其
  `HStack` 和 `VStack` wire 节点（AST-082 FR19），由逻辑宿主
  用 SwiftUI 的栈绘制。

## 验收检查

| 要求 | 检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A1   | 包清单将库产物和模块命名为 `Astryx`；源码检查在其中找不到名为 `Astryx` 的类型。                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| A1a  | 一个包含两个应用文件的编译测试：一个只导入 `Astryx`，检查 `let a: Button = Button("x") {}` 是 `Astryx.Button`，且 `SwiftUI.Button("x") {}` 是 SwiftUI 的；另一个导入 SwiftUI 和 `Astryx`，检查 `Astryx.Button` 和 `SwiftUI.Button` 都能解析，`let t: Text` 在那里无法编译（类型位置有歧义），`let a = Text("x")` 在那里可以编译且随后 `let _: Astryx.Text = a` 通过类型检查（两个初始化器都接受的字符串字面量调用解析为 Astryx 的），并且只有 Astryx 的初始化器接受的调用 `Button("x", variant: .primary) {}` 作为 `Astryx.Button` 编译。 |
| A1b  | 当模块中的文件使用 A1b 列表中的名称、含义是系统类型却未加其模块限定时，源码检查失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| A1c  | 源码检查找不到任何不带 `astryx` 前缀的公开 `View` 扩展成员。                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| A2   | 当组件文件声明一个与生成枚举具有相同 case 的 `enum`，或声明一个既不是生成的 `<Name>Props` 的 prop、也不是 `<Name>Props` 值本身、也不是契约的 content 插槽的公开参数时，源码检查失败。                                                                                                                                                                                                                                                                                                                                                     |
| A2   | 一个编译测试在 iOS 和 macOS 上，用其生成的 `<Name>Props`（每个 prop 都设值）再加上每个 content 插槽的生成节点类型构建每个视图，并通过带标签的初始化器为每个 content 插槽传入构建器来构建。源码检查找不到视图接受却忽略的参数；Switch 的 `size` 只存在于 macOS。                                                                                                                                                                                                                                                                           |
| A3   | 一项测试通过每个初始化器（包括插槽组件的便利初始化器）以相同参数构建视图，并发现每个 `<Name>Props` 字段在它们之间相同，通过调用回调来比较回调；便利初始化器的插槽持有其 props 描述的组件。                                                                                                                                                                                                                                                                                                                                                |
| A4   | `AnyView` 不出现在组件模块中。启用且带 `href` 的 Button 在视图树中是 `Link`，VoiceOver 将其读作链接；禁用且带 `href` 的 Button 被读作变暗的按钮；带 `href` 的 Avatar 绘制得与不带时相同。带 `href` 的禁用 Item 被读作变暗的链接且不会打开。                                                                                                                                                                                                                                                                                               |
| A5   | A2 的源码检查通过：没有生成 `<Name>Props` 和契约的 content 插槽之外的公开参数。                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| A6   | 源码检查在组件上找不到公开的 SwiftUI `Color`、`Font`、`CGFloat` 内边距或 `*Style` 参数；契约自身的视觉 prop 允许存在。                                                                                                                                                                                                                                                                                                                                                                                                                    |
| A7   | UI 测试按其 `id` 找到视图，并在 `isHidden` 为 true 时找不到它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| A8   | DocC 构建时对公开组件符号没有缺失文档警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| A9   | `Astryx` 产物不声明公开的 `HStack` 或 `VStack` 视图；逻辑宿主用 SwiftUI 的栈绘制 `HStack` 和 `VStack` wire 节点。                                                                                                                                                                                                                                                                                                                                                                                                                         |
| A2   | Swift 的 Switch 视图不接受 `labelPosition` 或 `labelSpacing` 参数，截图显示其行在浅色、深色和最大文字尺寸下都是标签在前、开关在后。                                                                                                                                                                                                                                                                                                                                                                                                       |

## 当前状态

- `packages/native/apple/` 是一个 Swift 包，包含 `Astryx` 产物
  （使用核心名称的 SwiftUI 视图，`Button`、`Text` 等，重新导出
  SwiftUI 和契约）和 `AstryxNative` 产物（生成的契约
  类型，不加前缀：`ButtonProps`、`ButtonVariant`）。
- Avatar、AvatarStatusDot、Button、Card、Heading、Icon、Item、ListItem、Text、TextInput 和 Thumbnail 采用其生成的 `<Name>Props`；Banner 没有生成的
  契约。
- `AstryxNodeView` 绘制 Avatar（及其状态点）、AvatarStatusDot、Button、Card、Heading、Icon、Item、ListItem、Text、TextInput 和 Thumbnail wire 节点。任何其他
  节点（包括 HStack 和 VStack）会在其位置渲染为不支持，其同级节点
  仍会渲染，直到逻辑宿主绘制栈（A9）。
- 生成的 iOS `SwitchProps` 仍声明 `size`，`HStackProps` 和
  `VStackProps` 仍为 iOS 和 macOS 生成。

## 开放问题

- **OQ1 — AST-093 FR5 是否应允许映射到契约类型的 SwiftUI 写法？**
  FR5 要求参数“按生成的
  契约命名和类型化”，因此文字的 `LocalizedStringResource` 写法与值及其变更回调的 `Binding`
  写法目前不被允许。
  建议：修订 AST-093 FR5，允许转换为
  契约确切类型的附加写法，因为每个 SwiftUI 控件都以这种方式接收文字和
  值；该修订会更改 `packages/native/` 之外的一条记录，
  并在那里决定。
- **OQ2 — Swift 调用方会看到 Web 的回调名称吗？** 建议：
  带标签的初始化器将动作作为不带标签的尾随闭包接收，如
  SwiftUI 所做；`<Name>Props` 初始化器保留 `onClick`。

## 参考文献

- Swift API Design Guidelines：https://www.swift.org/documentation/api-design-guidelines/
- SwiftUI `Button`：https://developer.apple.com/documentation/swiftui/button
- `LocalizedStringResource`：https://developer.apple.com/documentation/foundation/localizedstringresource
- WWDC24，SwiftUI essentials：https://developer.apple.com/videos/play/wwdc2024/10150/
- WWDC21，Demystify SwiftUI（身份与 `AnyView`）：https://developer.apple.com/videos/play/wwdc2021/10022/
