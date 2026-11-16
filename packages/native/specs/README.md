# 原生组件规范

每个原生组件、每种语言各一份简短规范，与 core 组件的规范一起放在 `docs/specs/components/` 下该组件的文件夹中，因此 `docs/specs/components/TabList/` 中会并排放置 `TabList.spec.md` 和 `TabList.swift.spec.md`。规则见 [AST-093（原生组件指南）](../../../docs/specs/AST-093-native-component-guidelines/spec.md)，该规范应用 [AST-082（原生优先界面）](../../../docs/specs/AST-082-native-first-surfaces/spec.md)。

```text
packages/native/
├── specs/
│   ├── TEMPLATE.md            # copy this for a new component spec
│   └── swift/                 # rules shared by every Swift component
│       └── library/           # rules every Swift component or build step shares
└── apple/Sources/Astryx/
    └── <Name>/                # one folder per component, named as core's
        └── <Name>.swift       # declares <Name> in the Astryx module

docs/specs/components/
└── <ComponentRoot>/           # the folder core keeps the component in
    ├── <Name>.spec.md         # the core contract
    └── <Name>.swift.spec.md   # the Swift spec, e.g. Button.swift.spec.md
```

Swift 优先。Kotlin 和其他语言在首个组件启动时获得各自的目录。

## 三项准则（按顺序）

1. **原生优先。** 当平台自带的控件符合组件契约时，就使用它。在 Swift 中：优先 SwiftUI，其次 UIKit 或 AppKit。只有当平台没有相应控件时才绘制自定义控件，并在规范中说明原因。
2. **Apple 人机界面指南。** 在 iOS 和 macOS 上，呈现与交互遵循 HIG：点击目标、Dynamic Type、SF Symbols、材质、动效与“减弱动态效果”、触感反馈、VoiceOver。请写明你遵循的页面。
3. **通过主题体现品牌。** 前两项未规定的一切（颜色、字体族、形状、间距、图标选择）都来自应用的主题：`defineTheme` token 和 `defineNativeTheme` 意图。绝不硬编码品牌值，也绝不为某个平台添加视觉 prop。

core 契约（prop 名称、状态、文案、无障碍语义）在所有平台上保持一致。原生规范绝不重命名或更改它。

## 添加规范

1. 将 `TEMPLATE.md` 复制到 `docs/specs/components/` 下 core 组件的文件夹中，命名为 `<Name>.<language>.spec.md`；对于 Swift，即 `docs/specs/components/<ComponentRoot>/<Name>.swift.spec.md`。
2. 填写每个章节。不要删除章节，而是写 "None"。
3. 提交一个仅更改 `packages/native/` 下文件和原生规范的拉取请求。规范可以单独落地，也可以与它所描述的组件一起落地。

仅更改 `packages/native/` 和原生组件规范（`docs/specs/components/**/<Name>.<language>.spec.md`）、且完全由 AST-093 FR6 所列原生小组编写的拉取请求，在以下条件满足后即获批准：必需检查通过、评审应用在确切的 head 上未发现缺陷，并且对照 AST-082、AST-093 及其涉及组件的规范进行评审后发现所有已定义要求均得到满足。没有规范定义的行为不会阻塞；它会记录为规范缺口。

## 测试与验证

每次原生组件变更都随附 AST-093 FR5 中要求的证据。对于 Swift：

```sh
pnpm vitest run --project node packages/native   # contracts, generated code, theme drift
pnpm -F @astryxdesign/native typecheck
cd packages/native/<swift package> && swift build && swift test   # on a Mac with Xcode
```

CI 会在 macOS 和 iOS 模拟器上构建并测试 `packages/native/` 下的每个 Swift 包。请附上每个状态的截图（来自模拟器或设备），涵盖浅色、深色和最大字号。任何无法截取的内容都会报告为未测量。
