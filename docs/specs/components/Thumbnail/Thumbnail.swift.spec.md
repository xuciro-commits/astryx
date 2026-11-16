---
schema_version: 3
template_version: 7
kind: component
id: component:swift/Thumbnail
platform_of: component:Thumbnail
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/ThumbnailTests.swift,
    packages/native/src/contract/contracts.test.ts,
    packages/native/src/theme/swiftIOSStrings.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# Thumbnail (Swift) component contract

## Contract at a glance

| Area            | Contract                                                                                                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `Thumbnail(src:, alt:, label:, isLoading:, isDisabled:, showRemoveOn:, onClick:, onRemove:)` 与 `Thumbnail(_ props: ThumbnailProps)`，二者是模块 `Astryx` 中的 SwiftUI `View`。 |
| 行为            | 主题中性色底板上的 64 点见方图块，显示图像，否则显示占位剪影；无图像且加载中时显示骨架屏，有图像时在其上叠加一层上传外观；右上角有一个移除按钮；点击可打开缩略图。              |
| 最终用户影响    | 在 iPhone 上附加图像的人看到的预览与 Web 上相同，可以打开或移除每一张，VoiceOver 会按文件名与描述读出每一张，并在上传开始时播报一次。                                           |
| 构建者影响      | 应用传入图像 URL、文件名一类的标签，以及它支持的操作。单个尾随闭包即 `onClick`。                                                                                                |
| 兼容性/就绪状态 | 增量式：一个新视图、生成的 `ThumbnailProps`，以及 core 的四条消息在 Swift 字符串目录中的条目。草案；已在 macOS 与 iOS 模拟器上构建并测试；设备截图附在该变更中。                |
| 审查检查        | 拒绝以下情形：在触摸设备上隐藏移除按钮、禁用时点击或移除仍然生效、加载时点击仍然生效、未命名的缩略图、每次渲染都播报上传、颜色不是主题 token。                                  |
| 治理规则        | `spec:AST-082` FR3、FR7；`spec:AST-086` FR8；`spec:AST-093` FR1–FR5；`packages/native/specs/swift/library/` 下的 Swift 组件 API、主题环境与无障碍（X1、X3、X4、X6、X7）记录。   |

该表是审查投影；下文正文具有权威性。

## Intent

Apple 平台上的 Thumbnail 是 core 对图像附件的预览，用 SwiftUI 自带的图像加载、进度视图与按钮绘制。

## Compatibility and migration

- 保持已发布的默认值：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 64 点的图块，及其图像、占位符、骨架屏与上传外观。
- 移除按钮、其可见性，以及打开点击。
- 缩略图的名称及其上传播报。

**不拥有 / 非目标**

- props 的含义与文案——由 `component:Thumbnail` 与 core 的消息目录拥有。
- 多个缩略图的布局，这属于承载它们的屏幕。

## Public concepts

| 概念         | 封闭取值或状态                       | 含义                                                                    | 按变体/方向/状态的可用性 | 默认值   | 拥有者                | 稳定性       | 无效值行为               |
| ------------ | ------------------------------------ | ----------------------------------------------------------------------- | ------------------------ | -------- | --------------------- | ------------ | ------------------------ |
| picture      | image, placeholder, skeleton, upload | 图块显示的内容                                                          | 始终                     | —        | `component:Thumbnail` | experimental | 图像加载失败时显示占位符 |
| showRemoveOn | `hover`, `always`                    | `hover` 在指针下显示移除、在触摸设备上始终显示；`always` 在静止时也显示 | 配合 `onRemove` 时       | `hover`  | `component:Thumbnail` | experimental | 无                       |
| name         | label and alt, label, alt, fallback  | VoiceOver 为缩略图读出的内容                                            | 始终                     | fallback | `component:Thumbnail` | experimental | 空字符串视为缺失         |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                         | 草案审查状态 |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------------ |
| FR1 | 图块 MUST 为 64 × 64 点，按 `radius.element` 裁剪，位于 `color.neutral` 上。它 MUST 将 `src` 处的图像裁剪填满图块显示，并在图块四边各有一条 1 点宽的 `color.border` 内嵌边；没有 `src`，或图像加载失败时，显示 `color.iconSecondary` 中 24 点的图像剪影。                                                                                                                                                                                                                                      | core `Thumbnail` 样式                                        | verify       |
| FR2 | 无 `src` 时，`isLoading` MUST 以 25% 不透明度显示 `color.skeleton` 骨架屏；1 秒之后，它在 core 默认的 550 ms medium 时长内以十个等长的保持步进升至 92.5% 再返回，如此重复，与 core 的行为一致；在 Reduce Motion 下，它停留在 25%；在 Increase Contrast 下，其颜色向 `color.textPrimary` 移动 30%，与 core 在 `prefers-contrast: more` 下的行为一致。有 `src` 时，`isLoading` MUST 在图像上绘制 `color.overlay`，并以 `color.onDark` 呈现平台的小型进度视图，该视图在任何文字大小下保持其尺寸。 | core `Thumbnail`；Swift 无障碍 X6                            | verify       |
| FR3 | 存在 `onRemove` 时，一个 20 点的移除按钮 MUST 位于 `color.overlay` 上、距右上角 `space.s1`，使用共享的 `close` `Icon`、尺寸为 `xsm`、颜色为 `color.onDark`；主题可以重映射该颜色，且该图标在任何文字大小下保持其尺寸。使用 `always` 时与在触摸设备上，它在静止时可见；在指针下使用 `hover` 时，当指针位于启用的缩略图上，或其打开或移除按钮获得键盘焦点时，它出现；在禁用的缩略图上，指针不显示任何内容，因为 core 在那里关闭了指针事件。                                                      | core `Thumbnail` `showRemoveOn`；`spec:AST-082` FR3          | verify       |
| FR4 | 存在 `onClick`、未禁用且未加载时，图块 MUST 是一个 SwiftUI `Button`，按下时绘制 `color.overlayPressed`。`isDisabled` MUST 以半不透明度绘制缩略图，并关闭其点击与移除按钮。加载中或禁用时的打开按钮，以及禁用时的移除按钮，MUST 保持挂载但惰性，以便焦点停留在其上，且 VoiceOver 将其读为变暗（`spec:AST-085`；Swift 无障碍 X2）；在上传期间，移除按钮保持可用，与 core 的行为一致。                                                                                                            | core `Thumbnail`                                             | verify       |
| FR5 | 存在 `label` 时，缩略图 MUST 通过 Astryx tooltip（`architecture:native-swift-library-tooltip`）显示它，正如 core 的 tooltip 包裹整个缩略图：它自身不是制表位，打开或移除按钮获得键盘焦点时会显示该标签，直接点击会打开它，同时打开操作仍会执行，如下文的 Tooltip by input 表所述。禁用的缩略图不显示任何内容，且该标签不是提示，因为它已包含在缩略图的名称中。                                                                                                                                 | core `Thumbnail` `label`；core `Tooltip`；`spec:AST-082` FR3 | verify       |
| FR6 | 两个初始化器 MUST 构建相同的 `ThumbnailProps`；单个尾随闭包即 `onClick`。基础 props 通过 `ThumbnailProps` 传入：使用 `isHidden` 时视图不绘制任何内容；`id` 成为无障碍标识符。                                                                                                                                                                                                                                                                                                                  | Swift 组件 API A2–A4、A7；`spec:AST-082` FR7                 | verify       |

**Tooltip by input (FR5)。** 适用 Astryx tooltip 的规则；该表陈述 Thumbnail 的选择。

| 输入      | 存在 `label` 时                                                                                                                | 禁用，或无 `label` |
| --------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| 指针      | 200 ms 后气泡在图块上方显示标签，指针位于其上时保持显示，按下则将其隐藏                                                        | 无                 |
| 键盘焦点  | 键盘焦点位于打开或移除按钮时立即显示标签，正如 core 的 tooltip 包裹层所示；缩略图本身不是制表位                                | 无                 |
| 触摸点击  | 直接点击会打开带标签的气泡，同时打开操作与所在行仍会执行；再次点击它，或点击其他任何位置，会将其关闭，且该次点击仍会到达其落点 | 无                 |
| VoiceOver | 标签在缩略图的名称中被读一次；气泡被隐藏，点击不受干预                                                                         | 无                 |

### Allowed variation

- **AV1 — 字形与加载指示器。** 占位符是 SF Symbol `photo.fill`，加载指示器是平台的进度视图。

### Representative states

| 状态                   | 必需不变式                            | 允许的变化 |
| ---------------------- | ------------------------------------- | ---------- |
| 图像                   | 图像带内嵌边填满图块                  | 图像内容   |
| 无图像、图像加载失败   | 占位剪影                              | AV1        |
| 无图像与有图像时的加载 | 骨架屏；带进度视图的上传覆盖层        | AV1        |
| 移除，hover 与 always  | 在触摸设备上可见；`always` 时静止可见 | 无         |
| 可点击、禁用           | 按钮；变暗且无点击或移除              | 无         |
| 浅色与深色、两个主题   | 各主题的颜色                          | 无         |

### Transformation and precedence order

- **ORD1 — 图像。** 骨架屏（加载中、无 `src`）→ 图像 → 占位符。
- **ORD2 — 名称。** `label — alt` → `label` → `alt` → core 的回退词。

### Performance and resources

- **PR1 — 系统加载。** 图像通过 `AsyncImage` 与系统 URL 缓存加载。

## Accessibility contract

- **AR1 — 命名分组。** 缩略图是一个由 ORD2 命名的容器。图像以其 `alt` 读出，没有 `alt` 时隐藏（X4）。存在 `onClick` 时，打开按钮覆盖图像，其名称（带缩略图名称的 “Open”）代表图像，因此 VoiceOver 不会单独读出图像，正如 core 的打开按钮包裹图像，而按钮的内容仅作呈现。
- **AR2 — 命名操作。** 打开按钮读出带名称的 “Open”，移除按钮读出带名称的 “Remove”，二者来自 core 的消息目录，并使用用户的语言（X1）。
- **AR3 — 上传只播报一次。** 每次上传开始——包括缩略图出现时已在进行的上传——都播报一次 core 的 “Loading”，与 core 一致；加载指示器被隐藏（`spec:AST-086` FR8；X3）。
- **AR4 — 目标。** 移除按钮在 44 × 44 点范围内响应点击，而不移动其绘制（X7）。
- **AR5 — 不测量渲染树。** 测试断言视图所设置的内容；在存在应用托管的目标之前，不测量渲染出的无障碍树、命中区域与播报。

## Design relationships

| 结构或状态   | 设计要求                                 | 表现权威     | 层级角色 | 组件契约 |
| ------------ | ---------------------------------------- | ------------ | -------- | -------- |
| 图像、覆盖层 | Apple Human Interface Guidelines, Images | 由 core 规定 | 支撑     | FR1–FR4  |

该组件实现设计要求，但不复制其理由。

平台控件：图像用 SwiftUI `AsyncImage`，上传加载指示器用 `ProgressView`，打开点击与移除操作用 `Button`（`spec:AST-093` FR2）。SwiftUI 没有缩略图控件，因此图块及其覆盖层在此绘制。指南页面：Apple Human Interface Guidelines 中的 Images、Progress indicators、Buttons 与 Accessibility。

读取的主题值：`color.neutral`、`color.border`、`color.iconSecondary`、`color.overlay`、`color.onDark`、`color.overlayPressed`、`radius.element`、`space.s1`、`color.skeleton`、`color.textPrimary`、主题的 `close` 图标、Reduce Motion 与 Increase Contrast；以及，对于 Astryx tooltip 的气泡，`color.textPrimary`、`color.backgroundSurface`、`space.s1`、`space.s2`、`radius.container`，还有正文字号与字重。

## Family and system relationships

- `component:Thumbnail` 拥有 props、文案与外观；本记录只陈述 Swift 如何绘制它们。

## Verification map

| 契约     | 验证                                                                                                                     | 代表性状态                                           | 变异或失败预期                                                                                                                                                    | 审计章节                        |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1      | `ThumbnailTests.swift` 尺寸、底板与双主题渲染                                                                            | 无图像；default、neutral、butter；最大文字尺寸       | 错误的尺寸或其自有的颜色会失败                                                                                                                                    | `audit:swift/Thumbnail/tile`    |
| FR2      | `ThumbnailTests.swift` 加载状态、骨架屏颜色、对比度混合与最大文字渲染                                                    | 有与无 `src` 的加载；Increase Contrast；最大文字尺寸 | 图像上出现骨架屏、没有上传外观、骨架屏颜色错误，或图块变大，都会失败                                                                                              | `audit:swift/Thumbnail/loading` |
| FR3, FR4 | `ThumbnailTests.swift` 的移除、点击、禁用与挂载但惰性测试及渲染                                                          | `always`、`hover`；禁用；加载                        | 在触摸设备上或键盘焦点下隐藏移除、硬编码移除字形，或禁用/加载时仍可点击，都会失败；加载中或禁用时打开或移除按钮卸载会失败；在禁用的缩略图上指针显示移除按钮会失败 | `audit:swift/Thumbnail/actions` |
| FR5      | 针对每种输入的 `TooltipPresenterTests.swift`；`ThumbnailTests.swift` 的名称与 focus-within 测试                          | 启用与禁用；空白标签                                 | 禁用的缩略图上出现 tooltip，或其打开或移除按钮获得键盘焦点时没有 tooltip，都会失败；图块在禁用切换或上传结束时是否保持同一结构不被测量，因为测试无法看到重建      | `audit:swift/Thumbnail/tooltip` |
| FR6      | `ThumbnailTests.swift` 的初始化器、尾随闭包与隐藏测试；`contracts.test.ts`                                               | 两个初始化器；`isHidden`                             | props 不同，或绘制出隐藏的缩略图，都会失败                                                                                                                        | `audit:swift/Thumbnail/api`     |
| AR1, AR2 | `ThumbnailTests.swift` 的名称与打开按钮测试（`hasOpenButton` 决定图像是否隐藏）；`swiftIOSStrings.test.ts`；不测量渲染树 | 单独有 label、单独有 alt、两者都无；有与无 `onClick` | 名称错误或缺少目录消息会失败                                                                                                                                      | `audit:swift/Thumbnail/a11y`    |

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不复制使用方 props 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
