---
schema_version: 3
template_version: 7
kind: component
id: component:swift/TextInput
platform_of: component:TextInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by: [packages/native/apple/Tests/AstryxTests/TextInputTests.swift]
modules: []
families: [family:input-fields]
design_specs: []
architecture: [architecture:public-component-api]
contributing: []
system_specs: [spec:AST-082, spec:AST-093, spec:AST-085]
---

# TextInput (Swift) component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | `TextInput(label:value:type:onChange:size:isLabelHidden:description:isOptional:isRequired:onEnter:isDisabled:isReadOnly:disabledMessage:isLoading:placeholder:labelTooltip:status:statusVariant:hasClear:hasAutoFocus:base:)` 与 `TextInput(_ props: TextInputProps)`，是模块 `Astryx` 中的 SwiftUI `View`。 |
| Behavior                | 可编辑字段是 SwiftUI 的 `TextField`，密码则是 `SecureField`。只读或禁用字段绘制其值，保留焦点停靠点而不唤起键盘，并且对 VoiceOver 而言读作 SwiftUI 的文本字段。                                                                                                                                              |
| End-user impact         | 使用者在平台自身的字段中输入；键盘用户仍能到达只读或禁用字段及其原因；VoiceOver 用户听到名称、任何错误、描述和状态。                                                                                                                                                                                         |
| Builder impact          | 应用按契约声明的方式传入 `value` 和 `onChange`，而不是 `Binding`。                                                                                                                                                                                                                                           |
| Compatibility/readiness | 对 canary 调用方为破坏性变更：`Binding` 让位于按契约声明方式的 `value` 和 `onChange`。已在 macOS 和 iOS 模拟器上构建并测试。                                                                                                                                                                                 |
| Review checks           | 拒绝以下情况：只读字段唤起键盘或接受编辑；禁用字段失去焦点；只读密码显示其字符；错误只出现在提示中，或用 `.help` 提供提示；契约携带字段会忽略的键盘 prop 或 `type` 值。                                                                                                                                      |
| Governing rules         | `component:TextInput` FR3–FR10、FR13、FR15、FR16；`family:input-fields` FR4；`spec:AST-085`；`spec:AST-082` FR3、FR7、FR11、DEC-14；`spec:AST-093` FR1–FR5；以及 `packages/native/specs/swift/library/` 下的 Swift 组件 API、tooltip 与无障碍记录。                                                          |

本表是审查视角的投影；下文正文才是权威。

## Intent

Apple 平台上的 TextInput 是用 SwiftUI 自身字段绘制的 core 文本字段，用于输入，因此输入法、自动填充和键盘都按平台的方式工作；而其只读和禁用状态则保留 core 的焦点与朗读行为，这是 SwiftUI 字段做不到的。

## Compatibility and migration

- 保留的发布默认值：`not yet released`
- 兼容性类别：对 canary 调用方为破坏性变更（`Binding` → `value` 和 `onChange`）
- 受控/非受控行为：受控；仅 `value` 和 `onChange`
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**负责**

- Swift 在各状态中使用哪个平台字段，只读或禁用字段如何保留焦点并向 VoiceOver 朗读，以及它的状态播报。

**不负责 / 非目标**

- TextInput 的 prop 与状态的含义——由 `component:TextInput` 和 `family:input-fields` 负责。
- Tooltip 行为——由 Swift tooltip 记录负责。

## Public concepts

| Concept | Closed values or states | Meaning                                                  | Availability by variant/orientation/state | Default | Owner                       | Stability | Invalid-value behavior |
| ------- | ----------------------- | -------------------------------------------------------- | ----------------------------------------- | ------- | --------------------------- | --------- | ---------------------- |
| 字段    | 可编辑；绘制            | SwiftUI `TextField`/`SecureField`，或绘制的只读/禁用字段 | 始终                                      | 可编辑  | `component:swift/TextInput` | 实验性    | 无                     |
| 可用性  | 可编辑；只读；禁用      | 禁用优先于只读                                           | 始终                                      | 可编辑  | `component:TextInput`       | 实验性    | 无                     |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Basis                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| FR1 | 两个初始化器 MUST 构建相同的 `TextInputProps`。仅当字段可编辑时，编辑才会到达 `onChange`；当字段可编辑或只读时，Return 键运行 `onEnter`。                                                                                                                                                                                                                                                                                                                                                                                             | Swift 组件 API A2、A3、A5；`component:TextInput` FR3、FR10                     |
| FR2 | 只读或禁用字段 MUST 绘制其值（密码为掩码，空时显示占位符），保留焦点停靠点而不唤起键盘（字段在聚焦时变为只读或禁用仍保留焦点：可编辑部分与绘制部分处于同一视图结构，焦点在两者之间移动），不接受编辑，并且对 VoiceOver 而言读作 SwiftUI 的文本字段（`accessibilityRepresentation`）：禁用时变暗，密码为安全字段，其描述中包含“Read only”或禁用原因。                                                                                                                                                                                  | `component:TextInput` FR6、FR8；`spec:AST-085`；`family:input-fields` FR4；AV1 |
| FR3 | 错误 MUST 出现在字段 VoiceOver 标签中其名称之后；描述和状态消息 MUST 作为文本可读，并出现在描述中。状态消息以及“Loading”在字段首次出现时及其变化时播报，错误以高优先级播报。                                                                                                                                                                                                                                                                                                                                                          | `component:TextInput` FR4、FR9；`component:FieldStatus` AR1                    |
| FR4 | 标签提示、tooltip 变体状态、清除按钮和禁用原因 MUST 通过共享的 Astryx tooltip 呈现；任何视图都不使用 `.help`。tooltip 变体状态提示是一个按钮，如 core 的状态图标那样，以其状态命名，并在 VoiceOver 激活时朗读其消息。每个尾部控件各自在独立的 44 点目标范围内布局。                                                                                                                                                                                                                                                                   | `component:TextInput` FR5、FR7、FR15；`spec:AST-082` FR11；Swift tooltip 记录  |
| FR5 | 基础 `id` 和 `isHidden` MUST 应用于字段控件，即 TextInput 的基础目标：`id` 是其无障碍标识符，`isHidden` 将控件及其按钮移出布局与焦点（包括自动聚焦），而标签、描述和状态保留，标签及其注释由 VoiceOver 作为文本朗读。                                                                                                                                                                                                                                                                                                                 | `component:TextInput` FR13；`spec:AST-082` FR7                                 |
| FR6 | Swift 契约 MUST 只携带 Swift 字段会应用的 `type` 值和键盘 prop。它携带 `text`、`password` 和 `email`；`email` 应用电子邮件键盘和内容类型，且不自动纠错、不自动大写。`search`、`tel` 和 `url` 类型以及 core 的 `enterKeyHint`、`inputMode`、`autoCapitalize`、`hasAutoCorrect` 和 `hasSpellCheck`（`component:TextInput` FR16）只有在字段将每一项应用为其平台键盘类型、回车键、大小写、自动纠错或拼写检查特性时才加入；携带字段所忽略的某项的契约不符合本规则。实现缺口：Swift 字段不应用其中任何一项，因此 Swift 调用方无法选择键盘。 | `spec:AST-082` FR3、DEC-14；`component:TextInput` FR16；当前源码               |

### Allowed variation

- **AV1 — 绘制的只读与禁用字段。** 没有平台字段能同时适配两个平台上的这两种状态，因此 Swift 绘制该值，并在其位置向 VoiceOver 提供 SwiftUI 的文本字段。考虑过的字段：
  - SwiftUI `TextField` 和 `SecureField`：没有只读模式，且 `.disabled` 会移除 core 保留的焦点停靠点（`spec:AST-085`）。
  - UIKit `UITextField` 通过其委托拒绝编辑：除非替换其输入视图，否则聚焦会唤起键盘，其文本和颜色必须手工从主题桥接，且 SwiftUI 的图像渲染器和预览不会绘制它。
  - 关闭编辑、开启选择的 AppKit `NSTextField`：在 macOS 上是真正的只读字段，但没有 iOS 对应物，因此两个平台会不一致。

### Representative states

| State    | Required invariant                                | Allowed variation |
| -------- | ------------------------------------------------- | ----------------- |
| 可编辑   | 平台字段；编辑到达 `onChange`                     | 无                |
| 只读     | 显示值；焦点停靠点；无键盘；Return 运行 `onEnter` | 无                |
| 只读密码 | 掩码；不可选择                                    | 无                |
| 禁用     | 变暗；焦点停靠点；读作变暗的文本字段              | 无                |
| 错误     | 标签中有错误；消息可读                            | 无                |

### Transformation and precedence order

- **ORD1 — 可用性。** 禁用，然后只读，然后可编辑，与 core 一致。

### Performance and resources

- **PR1 — 空闲时不做任何工作。** 视图不持有定时器；播报只在首次出现或发生变化时触发。

## Accessibility contract

- **AR1 — 名称、错误、描述。** 名称是标签及其注释；错误在标签中紧随其后；描述、其他状态消息、“Read only”以及禁用原因都属于描述。
- **AR2 — 未测量渲染树。** 测试断言视图所设置的内容；在存在应用宿主的测试目标之前，不测量渲染出的无障碍树和键盘焦点。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 字段             | 平台的文本字段     | 由平台规定               | 主要           | FR1, FR2           |

组件实现设计要求，但不复制其理由。

平台控件：编辑使用 SwiftUI `TextField` 和 `SecureField`；只读和禁用使用 AV1 中的绘制字段（`spec:AST-093` FR2）。指南页面：Apple Human Interface Guidelines 中的 Text fields 与 Accessibility（`spec:AST-093` FR3）。

读取的主题值（`spec:AST-093` FR4）：`color.textPrimary`、`color.textSecondary`、`color.textDisabled`、`color.borderEmphasized`，`architecture:theme-tokens` INV11 分配的 status 角色（边框用 `color.borderError`、`color.borderWarning`、`color.borderSuccess`；图标用 `color.iconError`、`color.iconWarning`、`color.iconSuccess`；消息底色用 `color.errorMuted`、`color.warningMuted`、`color.successMuted`，其文本用 `color.onErrorMuted`、`color.onWarningMuted`、`color.onSuccessMuted`），`size.elementSm`、`size.elementMd`、`size.elementLg`、`size.borderWidth`、`radius.element`、`space` 各级、`font.body`、`font.label`、`font.supporting`、`font.weight.medium`、`font.weight.normal`、`font.family.body`、主题的图标，以及 Dynamic Type 缩放。

## Family and system relationships

- `component:TextInput` 和 `family:input-fields` 负责 prop 和状态；本记录只说明 Swift 如何绘制它们。

## Verification map

| Contract | Verification                                                                                                                                                                                       | Representative states                                | Mutation or failure expectation                                                          | Audit section                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------- | ------------------------------ |
| FR1      | `TextInputTests.swift` 初始化器与编辑测试                                                                                                                                                          | 两个初始化器；可编辑、只读、禁用                     | prop 不一致，或在非可编辑状态下编辑到达 `onChange`，即失败                               | `audit:swift/TextInput/api`    |
| FR2      | `TextInputTests.swift` 的只读、密码、占位符和焦点停靠点测试，以及各状态提供给 `accessibilityRepresentation` 的 VoiceOver 字段（文本或安全、禁用时变暗、标签、值、描述）；未测量渲染树和焦点        | 只读；只读密码；空；禁用；禁用密码；错误             | 显示密码、缺失占位符、安全字段读作文本、未变暗的禁用字段，或没有停靠点的禁用字段，即失败 | `audit:swift/TextInput/states` |
| FR3      | `TextInputTests.swift` 标签、描述与播报测试                                                                                                                                                        | 有消息和无消息的错误；警告；类型变更                 | 标签中缺失错误，或漏掉播报变化，即失败                                                   | `audit:swift/TextInput/a11y`   |
| FR4      | `TooltipPresenterTests.swift` 的 `.help` 守卫；`TextInputTests.swift` 检查该行以按钮结尾，且状态提示是一个以其状态命名并带有其消息的按钮；在应用宿主的测试能做命中测试之前，不测量 44 点目标的重叠 | 清除与 tooltip 状态同时出现；tooltip、附着和分离状态 | 视图中出现 `.help`，或状态提示缺少按钮特性，即失败                                       | `audit:swift/TextInput/tips`   |
| FR5      | `TextInputTests.swift` 基础测试：`isHidden` 使控件脱离布局；`id` 与控件基础目标；在存在应用宿主测试之前，不测量绘制控件上的标识符                                                                  | `id`；`isHidden`                                     | `isHidden` 让控件留在布局中或隐藏标签，即失败                                            | `audit:swift/TextInput/base`   |
| FR6      | 对每个契约的按平台 prop 检查（`spec:AST-082` FR1、FR3）；`TextInputTests.swift` 电子邮件初始化器测试；在存在应用宿主测试之前，不测量所应用的键盘特性                                               | `email`；每个被省略的 prop 和 `type` 值              | Swift 类型接受字段不应用的键盘 prop 或 `type` 值，即失败                                 | `audit:swift/TextInput/api`    |

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到这些内容的所有者。
