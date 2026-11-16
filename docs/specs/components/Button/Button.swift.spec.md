---
schema_version: 3
template_version: 7
kind: component
id: component:swift/Button
platform_of: component:Button
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by: [packages/native/apple/Tests/AstryxTests/ButtonTests.swift]
modules: []
families: [family:buttons, family:navigation-destinations]
design_specs: []
architecture: [architecture:public-component-api]
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# Button (Swift) component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `Button(label:variant:size:elevation:isLoading:isInterruptible:isDisabled:width:tooltip:href:base:onClick:)` 与 `Button(_ props: ButtonProps)`，即模块 `Astryx` 中的一个 SwiftUI `View`。                                                                                                                                                                                                                        |
| 行为          | 一个用 Astryx 按钮样式绘制的 SwiftUI `Button`；当处于启用状态的 Button 带有 `href` 时，则是一个 SwiftUI `Link`。加载期间，一个加载指示器覆盖在标签之上，标签保持原位，且除非它可中断，否则按压会等待。在 iOS 与 iPadOS 26 及更高版本上，处于系统栏中或在浮动玻璃选项下时，它绘制系统的 Liquid Glass 来代替自身的填充：未设置的 `variant` 为 `secondary`，与 core 中一致，并且每个 `variant` 在玻璃中保持其语义。 |
| 最终用户影响  | 用户得到的是一个操作控件，其宽度在加载期间保持不变，并且绝不会意外执行两次；链接型 Button 在忙碌期间仍保持为链接，因此 VoiceOver 与键盘焦点都停留在它上面。在栏与浮动控件中，它的外观与行为同旁边的系统按钮一致，是一层玻璃而非玻璃内部的填充，主操作或破坏性操作依然一眼可辨。                                                                                                                                  |
| 构建者影响    | 应用直接传入 core 的 Button 属性；`href` 让同一个视图通过系统打开某个目标。栏中的 Button 无需额外代码；在浮动容器上使用 `.astryxFloating()` 即可让其 Button 选用玻璃。调用点设置的 `variant` 始终会被遵循。                                                                                                                                                                                                      |
| 兼容性/就绪度 | 对 canary 调用方是破坏性变更：`action:`、`fillsWidth:`、`icon:` 以及手写的 `AstryxButtonVariant` 与 `AstryxButtonSize` 让位于生成的 `ButtonProps`（`onClick:`、`width:`、`ButtonVariant`、`ButtonSize`）。草稿；已在 macOS 与 iOS 模拟器上构建并测试。                                                                                                                                                           |
| 评审检查      | 拒绝下列情况：加载中的链接切换成按钮；加载中的 Button 在不可中断时执行 `onClick` 或打开其链接；加载期间尺寸发生变化；带 `href` 的禁用 Button 仍会打开。拒绝在栏的玻璃内部绘制 Astryx 填充；拒绝玻璃覆盖或丢弃已设置的 `variant`；拒绝在“降低透明度”或“增强对比度”下绘制玻璃；拒绝未经模拟器截图闸门就合并的玻璃改动。                                                                                            |
| 治理规则      | `component:Button` FR7–FR11；`spec:AST-082` FR3；`spec:AST-093` FR1–FR5；位于 `packages/native/specs/swift/library/` 下的 Swift 组件 API 记录（A2–A5）；下文 DEC-1。                                                                                                                                                                                                                                             |

本表是评审用的投影，以下正文具有权威性。

## Intent

Apple 平台上的 Button 是用 SwiftUI 自带的按钮与链接绘制的 core 操作控件，因此按压、焦点与 VoiceOver 都按平台的方式工作，而外观、加载与链接行为则遵循 core 的 `Button` 契约。

## Compatibility and migration

- 保留的已发布默认值：`not yet released`
- 兼容性等级：对 canary 调用方为破坏性变更（手写参数 → 生成的 `ButtonProps`）
- 受控/非受控行为：不适用
- 迁移决定：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- Swift 如何绘制 core 的 Button：所使用的 SwiftUI 控件、加载呈现、按压何时生效，以及 `href` 何时使其成为链接。
- Button 在 Apple 平台上如何适配系统的 Liquid Glass：位于系统栏中、浮动玻璃选项下，以及“降低透明度”或“增强对比度”下（FR7–FR11）。

**不负责 / 非目标**

- Button 属性的语义、其变体与尺寸，以及其待定与禁用状态——由 `component:Button` 负责。
- 链接可以打开哪些目标——由 `family:navigation-destinations` 负责。
- 属性一般如何切换到另一个 SwiftUI 控件——由 Swift 组件 API 记录（A2）负责。
- 玻璃本身、栏如何对其条目分组，以及滚动边缘效果——由系统负责。
- 导航上下文中的搜索——不属于 Button 的关切。
- macOS 工具栏与浮动控件——FR7–FR10 覆盖 iOS 与 iPadOS 26；在 macOS 上保留 token 外观（FR10）。

## Public concepts

| 概念          | 封闭值或状态                            | 含义                                                               | 按变体/方向/状态可用                       | 默认值   | 负责方                   | 稳定性       | 无效值行为                      |
| ------------- | --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------ | -------- | ------------------------ | ------------ | ------------------------------- |
| control       | button; link                            | 一个 SwiftUI `Button`，或在 `href` 处于启用状态时为 SwiftUI `Link` | 始终                                       | button   | `component:swift/Button` | experimental | 不是 URL 的 `href` 仍保留为按钮 |
| loading       | idle; loading                           | `isLoading`：加载指示器覆盖在标签之上，按压会等待                  | 始终                                       | idle     | `component:Button`       | experimental | 无                              |
| interruptible | off; on                                 | `isInterruptible`：加载期间按压与链接打开会生效                    | 加载期间                                   | off      | `component:Button`       | experimental | 无                              |
| availability  | operable; busy-only; disabled           | 禁用优先于加载                                                     | 始终                                       | operable | `component:Button`       | experimental | 无                              |
| surface       | token; bar glass; floating glass; solid | Button 所在的位置决定其标签背后绘制什么（FR7–FR10）                | 玻璃取值适用于 iOS 与 iPadOS 26 及更高版本 | token    | `component:swift/Button` | experimental | 无                              |

## Behavioral and layout contract

| ID   | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 依据                                                                       | 草稿评审状态 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------ |
| FR1  | 两个初始化器必须构建相同的 `ButtonProps`；基础属性（`id`、`isHidden`）经由 `ButtonProps` 传入。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Swift 组件 API A2、A3                                                      | verify       |
| FR2  | 加载期间，视图必须在标签之上绘制加载指示器，保持标签原位以使其尺寸不变，保持完全不透明，并对 VoiceOver 呈现为忙碌（“Loading”，core 的目录消息）。除非可中断，否则加载期间不得执行 `onClick`；可中断的加载中 Button 会在每次按压时执行 `onClick`。                                                                                                                                                                                                                                                                                                                                                                          | `component:Button` FR7–FR9                                                 | verify       |
| FR3  | 带 `href` 的启用 Button 必须以 Astryx 按钮样式绘制指向该目标的 SwiftUI `Link`，VoiceOver 会将其读作链接。带 `href` 的禁用 Button 必须绘制其禁用按钮，且该按钮永不打开。                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `component:Button` FR11；`spec:AST-082` FR3                                | verify       |
| FR4  | 带 `href` 的加载中 Button 必须保持为 `Link`：它保持焦点、显示其加载指示器、读作忙碌，并且在加载结束前不打开其目标；除非该 Button 可中断，此时每次激活都会打开它。忙碌期间它绝不会切换成按钮。                                                                                                                                                                                                                                                                                                                                                                                                                              | `component:Button` FR9（“链接模式的 Button 在仅忙碌期间保持为链接”）、FR11 | verify       |
| FR5  | 其 `href` 为脚本 URL（`javascript:`、`vbscript:`）或 `data:` URL 中的 HTML 文档的 Button，在 core 规范化之后（移除控制字符、裁剪空白、协议以小写比较且冒号后不含空格），绝不得打开它：它绘制其启用按钮，该按钮执行 `onClick` 且看起来并非禁用状态。                                                                                                                                                                                                                                                                                                                                                                        | `component:Button` FR11；`family:navigation-destinations`                  | verify       |
| FR6  | 禁用的 Button 必须保留其键盘焦点停靠点并在获得焦点时显示其工具提示，绘制其禁用外观，对 VoiceOver 读作变暗的按钮，并且绝不执行 `onClick`；一个获得焦点后变为禁用的 Button 保持单一视图结构与其焦点。带 `href` 的 Button 在同一种结构中保留其 `Link` 与其禁用按钮，当它变为禁用时焦点从链接移到按钮，重新启用时又移回，因此焦点始终留在组件内部。                                                                                                                                                                                                                                                                            | `component:Button` FR10；`family:buttons` FR3                              | verify       |
| FR7  | 在 iOS 与 iPadOS 26 及更高版本上，承载于系统栏（导航栏或工具栏）中的 Button 必须不绘制自身的填充或边框，因此栏的玻璃是它唯一的外壳（设置的 `elevation` 仍绘制其阴影，见 FR11）；其标签与任何着色遵循 FR8。未设置的 `variant` 为 `secondary`，与 core 中一致，因此它绘制 `secondary` 的栏处理方式：仅标签，使用 `color.textPrimary`，位于栏的玻璃之上。这不需要新的属性或修饰符。                                                                                                                                                                                                                                           | DEC-1；Apple 的 Liquid Glass 指南（移除栏中的自定义背景）                  | verify       |
| FR8  | 调用点设置的 `variant` 必须始终被遵循。在 iOS 与 iPadOS 26 及更高版本上，在系统栏中以及在浮动选项下（FR9），它会映射到最接近且能保持其语义的玻璃处理方式，绝不会以另一个变体的处理方式绘制（在栏中，`secondary` 与 `ghost` 共享栏的玻璃）：`primary` → 以 `color.accent` 着色的醒目玻璃，标签 `color.onAccent`；`destructive` → 以 `color.error` 着色的醒目玻璃，标签 `color.onError`；`secondary` → 常规玻璃（在栏中即栏自身的玻璃），标签 `color.textPrimary`，不使用 `color.neutral` 填充；`ghost` → 浮动时：通透玻璃，标签 `color.textPrimary`；在栏中：栏自身的玻璃，标签 `color.textPrimary`（栏负责其条目的背景）。 | DEC-1                                                                      | verify       |
| FR9  | 在 iOS 与 iPadOS 26 及更高版本上，仅 Apple 平台的修饰符 `.astryxFloating()` 必须只把容器标记为浮动（控件位于滚动内容之上）；其中的 Button 绘制 FR8 的浮动处理方式，受主题的 `material`（ORD2）与 FR10 约束，未设置的 `variant` 绘制为 `secondary`。不使用该修饰符时，系统栏之外的 Button 保留其 token 外观。该修饰符不是属性，不改变任何 `ButtonProps`（Swift 组件 API A2）。                                                                                                                                                                                                                                              | DEC-1；Swift 组件 API A1c（修饰符的 `astryx` 前缀）                        | verify       |
| FR10 | 在“降低透明度”或“增强对比度”下，本会绘制玻璃的 Button（FR7–FR9）必须不绘制玻璃：改用其变体的 token 填充（`primary` 用 `color.accent`，`destructive` 用 `color.error`，`secondary` 与未设置的 `variant` 用 `color.neutral`，`ghost` 用 `color.backgroundSurface`）并带 `color.borderEmphasized` 边缘，使其标签保有实心、可见的背景。在 iOS 26 之前以及在 macOS 上（FR7–FR9 不覆盖它们），保留 token 外观。                                                                                                                                                                                                                  | DEC-1；`spec:AST-093` FR2                                                  | verify       |
| FR11 | 在玻璃中，每个属性都保持 core 的语义：`isLoading`、`isInterruptible`、`isDisabled`、`href` 与 `tooltip` 的行为如 FR2–FR6；`size` 设置控件的最小高度与标签字号（`component:Button` FR4）；显式的 `width` 会生效，上限为栏或容器所提供的空间（`component:Button` FR5）；`elevation` 在玻璃之下绘制其阴影（`component:Button` FR13）。在空间足够的栏中，Button 的标签绝不得因 Astryx 的内边距而被截断。                                                                                                                                                                                                                       | `component:Button` FR4、FR5、FR7–FR11、FR13；DEC-1                         | verify       |

### Variant mapping in glass

FR7–FR9 汇总在一张表中。“最不意外”意味着调用点得到其 `variant` 已经承诺的东西，并以系统的玻璃作为其表面。

| `variant`     | 系统栏中（iOS 与 iPadOS 26）                                    | 浮动且已选择启用（iOS 与 iPadOS 26）                 | 最不意外的原因                                                                 |
| ------------- | --------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| 未设置        | 同 `secondary`：栏的玻璃，标签 `color.textPrimary`，无填充      | 常规玻璃，标签 `color.textPrimary`（同 `secondary`） | core 的默认值为 `secondary`，因此未设置的 Button 在所有平台上都是 secondary 的 |
| `primary`     | 以 `color.accent` 着色的醒目玻璃，标签 `color.onAccent`         | 同上                                                 | 仍是唯一填充的、强调色的主操作，正如系统的醒目栏按钮那样                       |
| `secondary`   | 栏的玻璃，标签 `color.textPrimary`，不使用 `color.neutral` 填充 | 常规玻璃，标签 `color.textPrimary`                   | 仍是中性操作；玻璃取代了中性填充，因此只有一个表面，而不是两个                 |
| `ghost`       | 栏的玻璃，标签 `color.textPrimary`（栏负责其条目的背景）        | 通透玻璃，标签 `color.textPrimary`                   | 仍是最安静的操作；通透玻璃是在移动内容之上保持标签可读的最不显眼的表面         |
| `destructive` | 以 `color.error` 着色的醒目玻璃，标签 `color.onError`           | 同上                                                 | 在按压之前仍然读作破坏性操作                                                   |

### Allowed variation

- **AV1 — 平台控件。** 控件是 SwiftUI 的 `Button` 或 `Link`，因此焦点环、按压反馈以及系统打开目标的方式都由平台自身决定。
- **AV2 — 系统的玻璃。** 在玻璃中（FR7–FR9），折射、栏如何对其条目分组与变形、按压效果以及滚动边缘效果均由系统自身决定，并可能随每次 iOS 版本而变化。

### Representative states

| 状态                     | 必需不变式                                   | 允许的变化           |
| ------------------------ | -------------------------------------------- | -------------------- |
| 加载中                   | 与空闲时尺寸相同；加载指示器；忙碌；按压等待 | 加载指示器由系统提供 |
| 加载中且可中断           | 按压会生效                                   | 无                   |
| 启用且带 `href`          | 一个 `Link`                                  | 无                   |
| 禁用且带 `href`          | 一个永不打开的变暗按钮                       | 无                   |
| 加载中且带 `href`        | 在加载结束前不打开的 `Link`                  | 无                   |
| 在栏中，`variant` 未设置 | `secondary` 的栏处理方式；无 Astryx 填充     | 系统的玻璃与分组     |
| 在栏中，`variant` 已设置 | 该变体的 FR8 处理方式                        | 系统的玻璃与分组     |
| 浮动，已选择启用         | FR8 的处理方式；未设置时采用 `secondary` 的  | 系统的玻璃           |
| 降低透明度或增强对比度   | 带边缘的实心 token 填充，无玻璃              | 无                   |

### Transformation and precedence order

- **ORD1 — 可用性。** 先是禁用，然后是加载（除非可中断，否则为仅忙碌），再是可操作，与 core 中一致。
- **ORD2 — 表面。** 先看“降低透明度”或“增强对比度”（实心，FR10）；然后是主题的 `material`（`spec:AST-082` FR10）：`opaque` 在本会绘制浮动玻璃（FR9）的位置绘制 FR10 的实心表面，而栏中的 Button 仍不绘制自身填充；`translucent`、`ios` 条目的 `liquidGlass` 或缺失 `material` 则保留 FR7–FR9；然后是 `variant` 的处理方式（FR8，未设置的 `variant` 视为 `secondary`）；最后是栏与浮动容器之外的 token 外观。放置位置绝不会覆盖已设置的 `variant`。

### Performance and resources

- **PR1 — 空闲时不做工作。** 视图不持有任何计时器或任务；加载是调用方设置的属性。

## Accessibility contract

- **AR1 — 名称与状态。** 标签在每种状态下都为该控件命名；加载中的 Button 会将 core 的“Loading”消息作为其值加入，并在加载开始时播报它。链接型 Button 读作链接，禁用型读作变暗。
- **AR3 — 玻璃保留名称与角色。** 在玻璃中，Button 保留其标签、其按钮或链接角色，以及其加载与禁用状态（AR1）；系统只绘制标签背后的内容。
- **AR2 — 不测量渲染树。** 测试断言视图所设置的内容；在存在应用托管的测试目标之前，渲染出的无障碍树不被测量。

## Design relationships

| 结构或状态 | 设计要求                                | 表现形式权威 | 层级角色 | 组件契约 |
| ---------- | --------------------------------------- | ------------ | -------- | -------- |
| 加载指示器 | 系统的活动指示器                        | 由平台规定   | 支持性   | FR2、FR4 |
| 玻璃表面   | 系统的 Liquid Glass（常规、通透、醒目） | 由平台规定   | 支持性   | FR7–FR10 |

组件实现设计要求，但不复制其理由。

平台控件：SwiftUI `Button` 与 `Link` 配合 `ProgressView`；它们是平台自身的控件，满足契约（`spec:AST-093` FR2）。`tooltip` 通过共享的 Astryx 工具提示显示（`library/tooltip.spec.md`）。指南页面：Apple Human Interface Guidelines 中的 Buttons、Progress indicators、Materials (Liquid Glass)、Toolbars 与 Accessibility（Reduce Transparency、Increase Contrast）（`spec:AST-093` FR3）。

读取的主题值（`spec:AST-093` FR4）：`color.accent`、`color.onAccent`、`color.error`、`color.onError`、`color.neutral`、`color.textPrimary`、`color.backgroundSurface` 与 `color.borderEmphasized`（实心回退），原生主题的 `material` 意图，包括 `ios` 条目的 `material`（`spec:AST-082` FR10；ORD2），`size.elementSm`、`size.elementMd`、`size.elementLg`、`radius.element`、用于内边距的 `space` 步长、`font.label` 与 `font.family.body`、`shadow.low`、`shadow.med` 与 `shadow.high` 层，以及 Dynamic Type 缩放。

## Family and system relationships

- `component:Button` 负责属性、待定与禁用状态以及链接模式；本记录只说明 Swift 如何绘制它们。
- `family:navigation-destinations` 负责链接的目标处理。

## Verification map

| 契约 | 验证                                                                                                                                                                                                                               | 代表性状态                                                                                                                                 | 变更或失败预期                                                                                          | 审计章节                      |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR1  | `ButtonTests.swift` 初始化器测试                                                                                                                                                                                                   | 两个初始化器                                                                                                                               | 属性不同则失败                                                                                          | `audit:swift/Button/api`      |
| FR2  | `ButtonTests.swift` 的加载、宽度与可中断测试                                                                                                                                                                                       | 加载中；加载中且可中断                                                                                                                     | 加载期间按压生效、尺寸变化或变暗均失败                                                                  | `audit:swift/Button/loading`  |
| FR3  | `ButtonTests.swift` 的 `href` 测试                                                                                                                                                                                                 | 启用与禁用且带 `href`                                                                                                                      | 禁用的 Button 仍会打开，或启用的 Button 不是链接，均失败                                                | `audit:swift/Button/link`     |
| FR4  | `ButtonTests.swift` 带加载、以及带加载且可中断的 `href` 测试                                                                                                                                                                       | 加载中且带 `href`；可中断                                                                                                                  | 忙碌中的链接切换为按钮或在加载结束前打开则失败                                                          | `audit:swift/Button/link`     |
| FR5  | `ButtonTests.swift` 的拒绝目标与规范化测试                                                                                                                                                                                         | `javascript:`、`vbscript:`、`data:text/html`、带填充、大小写混合、含控制字符，以及 `data: text/html`；仍会打开的 `data:image` 与 `mailto:` | 被拒绝的目标仍会打开、未规范化的目标漏过，或被拒绝的目标看起来像禁用，均失败                            | `audit:swift/Button/link`     |
| FR6  | `ButtonTests.swift` 的禁用测试，包括带 `href` 的禁用 Button 在单一结构中保留其目标；在应用托管的测试能够观察之前，不测量焦点停靠点与焦点移动                                                                                       | 禁用且带/不带工具提示；禁用且带 `href`                                                                                                     | 禁用的 Button 执行 `onClick` 或打开其链接，或被标记为未保留其焦点停靠点，均失败                         | `audit:swift/Button/disabled` |
| AR1  | `ButtonTests.swift` 的无障碍断言                                                                                                                                                                                                   | 空闲；加载中；链接                                                                                                                         | 缺少名称、值或播报均失败                                                                                | `audit:swift/Button/a11y`     |
| FR7  | 模拟器截图闸门：在导航栏与底部工具栏中、浅色与深色下、每个新 iOS 版本上的未设置 Button；一个单元测试验证栏中的 Button 不绘制填充。证据缺口：SwiftUI 没有公开信号表明视图位于栏中，因此在检测在该处通过闸门之前，底部工具栏尚未验证 | 导航栏；底部工具栏                                                                                                                         | 在栏的玻璃内绘制 Astryx 填充则失败                                                                      | `audit:swift/Button/glass`    |
| FR8  | 模拟器截图闸门：每个变体在栏中与浮动状态下、浅色与深色下；一个关于变体到处理方式映射的单元测试                                                                                                                                     | primary; secondary; ghost; destructive                                                                                                     | 已设置的变体以另一变体的处理方式绘制则失败，但在栏中 `secondary` 与 `ghost` 共享栏的玻璃除外            | `audit:swift/Button/glass`    |
| FR9  | 模拟器截图闸门：带与不带该修饰符的浮动 Button；一个单元测试验证该修饰符不改变任何 `ButtonProps`                                                                                                                                    | 已选择启用；未选择启用                                                                                                                     | 不带修饰符却绘制玻璃，或带修饰符却使用 token 填充，均失败                                               | `audit:swift/Button/glass`    |
| FR10 | 开启“降低透明度”与“增强对比度”的模拟器截图闸门                                                                                                                                                                                     | 每个变体在栏中与浮动状态下                                                                                                                 | 绘制任何玻璃，或标签没有实心背景，均失败                                                                | `audit:swift/Button/glass`    |
| FR11 | `ButtonTests.swift` 在玻璃中的加载与禁用测试；针对栏中与浮动状态下标签截断、`size`、`width` 与 `elevation` 的模拟器截图闸门                                                                                                        | 加载中；禁用；长标签；每种尺寸；填满宽度；每种高度                                                                                         | 有空间却截断标签、丢失加载或禁用状态，或 core 会遵循而玻璃丢弃的 `size`、`width` 或 `elevation`，均失败 | `audit:swift/Button/glass`    |

## Decision log

### DEC-1 — Button meets the system's glass, and a set variant is always obeyed

**引用：** `component:swift/Button/DEC-1`

**决定者：** cixzhang，2026-10-31

在 iOS 与 iPadOS 26 及更高版本上，系统栏中的 Button 不绘制自身填充，因此栏的玻璃是它唯一的外壳；在仅 Apple 平台的修饰符标记为浮动的容器中，Button 绘制 SwiftUI 的玻璃；而“降低透明度”或“增强对比度”下则绘制实心的 token 表面。调用点设置的 `variant` 在玻璃中保持其语义（FR8）：`primary` 与 `destructive` 仍是唯一填充的、有色的操作，`secondary` 与 `ghost` 保持中性。未设置的 `variant` 为 `secondary`，正如 core 所定义，因此未设置的栏中 Button 具有中性标签，而原生栏条目则采用着色。

已否决：不使用 Astryx 玻璃，而让应用在栏与浮动控件中使用 SwiftUI 自身的按钮。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的负责方。
