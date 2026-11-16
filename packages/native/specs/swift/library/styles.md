# SwiftUI 样式（Swift）

- Status: draft
- Relation: 扩展 `packages/native/specs/swift/library/component-api.md`，
  按 `packages/native/specs/swift/library/theme-environment.md`
  所述读取主题，并应用 AST-093 FR2（原生优先：组件建立在平台自己的
  控件之上）。它决定 Astryx 的外观如何到达 SwiftUI 自己的控件。

## 摘要

已经使用 SwiftUI 按钮、开关和进度视图的应用可以逐个控件地采用 Astryx 的外观，
使用 `.buttonStyle(.astryx(variant: .primary))`，而不必替换整个
屏幕。应用的使用者保留系统控件的无障碍和行为，现在带上了品牌外观。
Astryx 自己的视图也构建在相同的样式之上，因此主题变化会同时到达两者。

## 要求

- **Y1 — Astryx 外观作为 SwiftUI 样式。** 对于核心契约匹配某个 SwiftUI 控件、
  且该控件的样式协议接受自定义遵循的每个组件，Astryx 提供一个对该控件样式协议的遵循，
  参数仅为组件的核心视觉 props。为单个组件
  设置样式的协议以 `.astryx` 到达该组件（`ButtonStyle`、`LabelStyle`、
  `MenuStyle`、`GroupBoxStyle`、`LabeledContentStyle`、`ControlGroupStyle`）；
  为多个组件设置样式的协议以 `.astryx<Component>` 分别到达每个组件（`.astryxSwitch`、
  `.astryxCheckbox`、`.astryxProgressBar`、`.astryxSpinner`）。每个样式从
  环境读取主题。组件的视图是带有该样式的 SwiftUI 控件，
  加上契约的行为 props。Astryx 不声明自己的样式协议。
- **Y2 — 样式只负责外观。** 样式的参数是组件的核心视觉
  props（例如 `variant`、`size` 和 `elevation`），使用生成的
  类型和默认值。行为 props（例如 `isLoading`、`disabledMessage`、
  `tooltip` 和 `href`）绝不是样式参数；它们留在视图上。
- **Y3 — 样式。**

  | SwiftUI 样式          | 成员                                          | Astryx 外观                                                                                                              |
  | --------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
  | `ButtonStyle`         | `.astryx(variant:size:elevation:)`            | Button、IconButton；还包括 SwiftUI 自己的 `Link`、`NavigationLink` 和 `ShareLink`，SwiftUI 用 `ButtonStyle` 为其设置样式 |
  | `ToggleStyle`         | `.astryxSwitch`；macOS 上为 `.astryxCheckbox` | Switch；CheckboxInput                                                                                                    |
  | `ProgressViewStyle`   | `.astryxProgressBar`；`.astryxSpinner`        | ProgressBar（确定或不确定）；Spinner                                                                                     |
  | `LabelStyle`          | `.astryx`                                     | Button 和 Badge 的图标加标签布局                                                                                         |
  | `MenuStyle`           | `.astryx`                                     | DropdownMenu 触发器（菜单内容保持系统）                                                                                  |
  | `GroupBoxStyle`       | `.astryx`                                     | Card                                                                                                                     |
  | `LabeledContentStyle` | `.astryx`                                     | Field：标签位于其控件旁边或上方                                                                                          |
  | `ControlGroupStyle`   | `.astryx`                                     | ButtonGroup                                                                                                              |

  `PickerStyle` 和 `TextFieldStyle` 不接受自定义遵循，因此 Selector 和 TextInput 使用系统样式，并从主题环境获取主题的
  tint 和文字颜色。以后新增的组件在其核心契约匹配某个
  样式协议接受自定义遵循的 SwiftUI 控件时加入此表。

- **Y4 — 样式类型保留前缀。** 样式的类型是
  `Astryx<Control>Style`（`AstryxButtonStyle`），因为无前缀的名称是
  SwiftUI 自己的协议；调用方通过其 Y3 静态成员到达它，而不写出
  该类型。
- **Y5 — 无障碍来自系统控件。** 样式只负责绘制；
  控件保留其名称、特征、操作和焦点。`ToggleStyle` 是
  例外：自定义开关样式自行绘制控件并切换其开启状态，
  因此 Astryx 的开关样式还会为 VoiceOver 保留开关特征及其
  开/关值，并在点按或默认操作时执行动作。用 `.astryx` 设置样式的
  系统原生控件获得外观，但不获得视图的行为契约
  （例如，加载只播报一次）。

## 验收检查

| 要求 | 检查                                                                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Y1   | 编译测试通过其 Y3 成员将每个 Y3 样式应用于其 SwiftUI 控件；源码检查找不到 Astryx 声明的名称以 `Style` 结尾的公开协议。                                                                                                                                                         |
| Y1   | 截图测试在两个主题、浅色和深色下将 `SwiftUI.Button("x") {}.buttonStyle(.astryx(variant: .primary))` 与 `Button("x", variant: .primary) {}` 绘制得完全相同。带有 `.buttonStyle(.astryx(variant: .primary))` 的 `SwiftUI.Link`、`NavigationLink` 和 `ShareLink` 绘制相同的外观。 |
| Y2   | 源码检查找不到不是其组件核心视觉 prop 的样式参数。                                                                                                                                                                                                                             |
| Y3   | Y3 表中的每个组件都有其样式；主题内的 Selector 和 TextInput 绘制主题的 tint。                                                                                                                                                                                                  |
| Y5   | 为系统原生控件设置样式后的无障碍断言与同一未设置样式的系统原生控件相等。带有 `.astryxSwitch` 的 `Toggle` 被读作带有其值的开关，并在点按和 VoiceOver 默认操作时切换。                                                                                                           |

## 当前状态

- 在 `main` 上，Swift 包 `packages/native/apple` 持有生成的 props、
  wire 和逻辑宿主。没有 SwiftUI 视图或样式。

## 开放问题

无。

## 参考文献

- `ButtonStyle`：https://developer.apple.com/documentation/swiftui/buttonstyle
- `ToggleStyle`：https://developer.apple.com/documentation/swiftui/togglestyle
- `ProgressViewStyle`：https://developer.apple.com/documentation/swiftui/progressviewstyle
- `LabelStyle`：https://developer.apple.com/documentation/swiftui/labelstyle
- `MenuStyle`：https://developer.apple.com/documentation/swiftui/menustyle
