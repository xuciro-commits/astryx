# 面向 Apple 平台的 Astryx

> **实验性。仅 Canary 渠道。** 属于 `@astryxdesign/native` 的一部分。API
> 可能随时变更，恕不另行通知。

一个包含两个产品的 Swift 包：

- **`Astryx`**：使用主题 token 绘制的 SwiftUI 视图、主题环境，以及 core 的本地化消息。它是 AST-082 实验的 A 臂（纯原生：用 Astryx 的 token 绘制的平台视图）。
- **`AstryxNative`**：由 core 组件文档生成的契约类型、TypeScript 逻辑核心发送的通信协议（wire），以及运行逻辑核心的逻辑宿主（arm C）。

由这些视图构建的页面模板是一个没有产品的独立包，因为模板只能克隆，从不发布。

## 目录结构

```text
apple/
├── Package.swift          # products Astryx and AstryxNative
├── Sources/
│   ├── Astryx/            # SwiftUI views (module Astryx)
│   │   ├── Theme/         # tokens, the theme environment, Dynamic Type
│   │   │   └── Generated/ # typed tokens and every published theme, generated; do not edit
│   │   ├── Resources/     # core's messages per locale, generated; do not edit
│   │   ├── Localization/
│   │   ├── Icon/          # Icon
│   │   ├── Avatar/        # Avatar
│   │   ├── Item/          # Item
│   │   ├── List/          # ListItem
│   │   ├── Text/          # Text
│   │   ├── Heading/       # Heading
│   │   ├── Button/        # Button
│   │   ├── TextInput/     # TextInput
│   │   ├── Thumbnail/     # Thumbnail
│   │   ├── Card/          # Card
│   │   └── Banner/        # Banner
│   └── AstryxNative/      # contracts, wire, logic host (module AstryxNative)
│       └── Generated/     # generated; do not edit
├── Tests/
│   ├── AstryxTests/
│   └── AstryxNativeTests/
└── Templates/             # page templates to copy; its own package, never published
    ├── Package.swift      # no products; compiles and tests the templates
    ├── Login/             # LoginTemplate, from `astryx template login`
    └── Tests/
```

每个组件的 Swift 规范与其 core 规范放在一起，位于 `docs/specs/components/<ComponentRoot>/<Name>.swift.spec.md`。

- **`Sources/Astryx/<Name>/`** 每个组件一个文件夹，命名方式与 `packages/core/src/<Name>/` 中一致。每个视图在 `Astryx` 模块中使用 core 的组件名（`Button`、`Text`），该模块会重新导出 SwiftUI 和生成的契约，因此应用文件只需写 `import Astryx` 即可。在同时导入 SwiftUI 的文件中，请写 `Astryx.Button` 和 `SwiftUI.Button`。组件的参数使用 core 的 prop 名称和值（`variant: .primary`、`size: .lg`、`isLoading`），因此代码在 Web 和原生端读起来是一样的。每个有 core 契约的视图都会接收其生成的 `<Name>Props`（AST-093 FR5），并带有构建相同 props 的带标签初始化器；`Banner` 目前还没有原生契约（生成的契约不包含它），因此其参数是手写的。
- **`Templates/`** 每个页面模板一个文件夹，以 `astryx template` 的 id 命名。模板与 Web 端一样只能克隆：你将模板的文件夹复制到应用中，从此便归你所有。它们是一个没有产品的独立包，因此没有任何东西导入它们，`@astryxdesign/native` 也不会将其纳入 npm 包。模板仅由 `Astryx` 视图和 SwiftUI 布局构建，并与 Web 模板的内容和状态保持一致。模板所需的规则（例如校验）放在视图旁边的一个普通值类型中，这样测试无需屏幕即可检查。

## 使用方法

依赖 `Astryx` 产品。要从模板开始，请将其文件夹（例如 `Templates/Login/`）复制到应用的源码目录中；此后它就属于你的应用。

```swift
import Astryx

@main
struct DemoApp: App {
  var body: some Scene {
    WindowGroup {
      LoginTemplate().astryxTheme() // copied from Templates/Login/
    }
  }
}
```

`astryxTheme(_:)` 用某个主题绘制子树；不使用它时，组件使用 core 的默认主题。无论哪种方式，它们都遵循深色模式和用户的文字大小。

在 iOS 和 iPadOS 26 及更高版本中，导航栏或工具栏中的 `Button` 不绘制自己的填充，以便显示栏的 Liquid Glass 效果；对滚动内容上方的一组控件容器使用 `astryxFloating()`，可让其 Button 获得系统的玻璃效果。`variant` 在玻璃效果中仍保持其含义，而“减弱透明度”或“增强对比度”会改为绘制实心 token 填充。在其他平台以及 macOS 上，Button 保持其 token 外观。

## 主题 token

组件从 `astryx` 环境值读取每一种颜色、尺寸和字体，从不使用自己的常量。`astryx.tokens` 以类型化成员的形式保存当前模式下主题的 token（`tokens.color.textPrimary`、`tokens.space.s4`、`tokens.font.body.size`），因此拼错的 token 会导致编译失败。字体 token 是分组的：每种文字样式（`tokens.font.body`、`tokens.font.heading1`）包含其 `size`、`weight` 和 `leading`，而 `tokens.font.family`、`.size` 和 `.weight` 保存各个尺度。文字大小会随 Dynamic Type 增大。应用在自己的 SwiftUI 布局中读取相同的成员，例如堆栈间距（`astryx.tokens.space.s4`）。

`Icon(.search)` 将共享的图标名称绘制为平台的 SF Symbol，使用 core 的图标尺寸和颜色；除非带有 `label`，否则对 VoiceOver 隐藏。`IconName` 将所有内置名称保存为静态成员；主题可通过 `Theme(…, icons: ["acme:rocket": "airplane", "close": .assetName("brand.close")])` 将某个名称映射到另一个符号或应用自带的图像，或注册一个 `<library>:<name>` 名称。应用未自带的资源会在开发构建中中止并给出包含该资源名称的消息，在发布构建中则不绘制任何内容。

字体族来自主题的 `font-family-*` 序列：设备拥有的第一个字体族生效，而 `-apple-system` 或 `sans-serif` 等系统字体族即系统字体。图标使用 core 的共享图标名称（`success`、`warning` 等），默认绘制为 SF Symbol；主题可通过 `Theme(…, icons: ["success": "checkmark.seal.fill"])` 替换其中某个图标。

`Sources/Astryx/Theme/Generated/` 由 Swift 主题生成器（`../specs/swift/library/theme-generator.md`）根据 core 自身的解析器生成，涵盖浅色和深色：

- `Tokens.swift`：类型化的 token 接口，来自 core 的 token 名称。
- 每个主题一个 `<Name>Theme.swift`，声明 `Theme.<name>`：core 的默认主题（`.default`）以及每个已发布的主题包（`.butter`、`.chocolate`、`.gothic`、`.matcha`、`.neutral`、`.stone`、`.y2k`）。

```swift
LoginTemplate().astryxTheme(.neutral)
```

在主题或 core token 变更后重新生成：

```sh
pnpm -F @astryxdesign/native generate:swift-ios
```

产品也可以用同样的方式，从其主题的模块和导出生成自己的主题：

```sh
node packages/native/scripts/swift-ios-theme.mjs --theme ./src/acmeTheme.ts#acmeTheme --out ./Sources/Theme
```

生成器读取其规范（`specs/swift/library/theme-generator.md`，G7）列出的 CSS 形式：十六进制和命名颜色、`rgb()`、`hsl()`、`hwb()`、Lab、LCH、OKLab、OKLCH、所列色彩空间中的 `color()`、`color-mix()` 以及相对颜色（广色域颜色保留为 Display P3）、带 `calc()` 的长度，以及 `[light, dark]` 元组。它只能近似表示的值（例如 Display P3 之外的颜色，会像浏览器绘制那样被裁剪）会在运行后打印警告；没有静态形式的值（例如 `currentColor` 或 `50%`）会采用 core 对该 token 的默认值并给出警告，若 core 没有默认值则中止运行。生成器尚不读取的形式会中止运行并说明原因。添加 `--strict` 可在出现任何警告时失败。

主题的本地 token 尚未生成；生成器会列出它遗漏的每一个 token。

**字体。** 主题的字体族以数据形式携带。Astryx 从不捆绑字体：组件按顺序遍历主题的字体族列表，并使用应用已注册的第一个字体族；列表中的系统字体族（例如 `-apple-system` 或 `sans-serif`）即系统字体，若列表中没有已注册的字体族则回退到系统字体。要绘制主题的品牌字体，请在应用中捆绑并注册它。已发布主题指定的字体（正文、标题、代码）：

| 主题         | 需要捆绑的字体                             |
| ------------ | ------------------------------------------ |
| `.default`   | 无（系统字体）                             |
| `.butter`    | Outfit, JetBrains Mono                     |
| `.chocolate` | Albert Sans, Fraunces, JetBrains Mono      |
| `.gothic`    | Fustat, JetBrains Mono                     |
| `.matcha`    | DM Sans, Playwrite US Trad, JetBrains Mono |
| `.neutral`   | Figtree                                    |
| `.stone`     | Figtree, Montserrat, JetBrains Mono        |
| `.y2k`       | Poppins, JetBrains Mono                    |

同一条命令还会根据 core 的语言区域目录写入 `Sources/Astryx/Resources/<locale>.lproj/Localizable.strings`，因此组件向辅助技术播报的词语（例如加载中按钮的 "Loading"）会跟随用户的语言。当任一提交的输出与 core 不一致时，`@astryxdesign/native` 中的测试会失败。

## 参与开发

在装有 Xcode 或 Swift 命令行工具的 Mac 上：

```sh
cd packages/native/apple
swift test                 # both products
cd Templates && swift test # templates, against the Astryx product
```

两个包还声明了 macOS 14，因此可以在没有模拟器的 Mac 上构建和测试；目标平台是 iOS 17。在 Xcode 中打开 `Templates/Package.swift`，即可通过其预览在 iOS 模拟器中运行 `LoginTemplate`。

要添加组件，请创建 `Sources/Astryx/<Name>/<Name>.swift`，用 core 的 prop 名称声明 `<Name>`，凡是表示系统类型的地方写 `SwiftUI.<Name>`，从 `astryx` 读取其 token，并在 `Tests/AstryxTests/` 下添加测试。要添加模板，请根据 `astryx template <id>` 的输出创建 `Templates/<Name>/<Name>Template.swift`，并在 `Templates/Tests/` 下添加测试。

## 尚未支持

- 与 Web 组件的像素和行为一致性尚未测量。
- 主题本地 token 和平台主题条目（`defineNativeTheme`，保留为 `Theme.native`）尚未接入。
