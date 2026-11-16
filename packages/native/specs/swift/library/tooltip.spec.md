---
schema_version: 1
template_version: 3
kind: architecture
id: architecture:native-swift-library-tooltip
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
applies_to: [packages/native/apple/Sources/Astryx/Tooltip/]
verified_by:
  [packages/native/apple/Tests/AstryxTests/TooltipPresenterTests.swift]
deciding_specs: []
---

# Swift tooltip architecture

## Contract at a glance

| 领域            | 契约                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 主导契约        | `spec:AST-082` FR3：平台像核心那样遵循核心的 prop，这里指核心组件通过 `useTooltip` 和 `Tooltip` 展示 tooltip 的方式，包括其 `touchTrigger`；`spec:AST-093` FR4。                |
| 系统行为        | 一个内部修饰符 `astryxTooltip` 按核心的方式展示每个 Swift 组件的 tooltip：位于视图上方，在指针停留、键盘焦点或直接轻触时显示；按压、Escape 或离开时隐藏；VoiceOver 永远看不到。 |
| 终端用户影响    | iPhone、iPad 或 Mac 上的用户在每个组件中读取 tooltip 的方式都与 Web 上相同，VoiceOver 用户只听到一次其文字。                                                                    |
| 构建者影响      | 组件传入其文字、其提示，以及焦点和触摸如何到达它；组件不自行构建 tooltip。                                                                                                      |
| 兼容性/就绪状态 | 内部实现；无公共 API。草稿；在存在应用托管的 UI 测试之前，hover、focus、Escape 和 tap 作为逻辑进行测试。                                                                        |
| 审查检查        | 拒绝以下情况：在 `astryxTooltip` 之外构建的组件 tooltip；包内任何位置使用 SwiftUI 的 `.help`；VoiceOver 能读到的气泡；阻止外层行执行的轻触；或重建被修饰视图的改动。            |
| 主导规则        | `spec:AST-082` FR3；`spec:AST-093` FR2、FR4。                                                                                                                                   |

本表是审查投影；以下正文具有权威性。

## Purpose

核心的组件通过一个 hook 展示 tooltip，因此 Web 上的每个 tooltip 都以相同方式打开、定位和关闭。本记录说明 Swift 如何实现同样的效果：一个内部修饰符，供每个 Swift 组件使用，这样组件只需记录其文字以及哪些输入会触达其 tooltip。

## System model

组件在 tooltip 所描述的视图上调用 `astryxTooltip(_ text:, hint:, focus:, touch:, isDisabled:)`。

- `text` 是 tooltip 的文字。文字为空以及视图被禁用时不显示任何内容。
- `hint` 是 VoiceOver 作为提示朗读的文字，正如核心将给定的 tooltip 文字放入描述中；对于已在视图名称中的文字，其为 `nil`。
- `focus` 说明键盘焦点如何到达 tooltip，与核心的 `focusTrigger` 相同：`none`（焦点不显示任何内容，如同在不可聚焦的元素上）、`control`（视图本身是已可获取焦点的控件）或 `tabStop`（静态视图在有文字时会被设为 tab stop，正如核心为带 tooltip 的静态元素提供 tab stop）。
  `inside` 标记自身持有控件的视图，例如缩略图的打开和移除按钮，并携带其中一个控件是否拥有焦点：那里的焦点会显示 tooltip，正如核心 tooltip 包装器内的焦点一样。
- `touch` 说明直接轻触的行为，与核心的 `touchTrigger` 相同：`auto`（默认值）在视图不是控件时打开 tooltip，`tap` 总是打开，`none` 从不打开。

气泡是以核心 tooltip 外观绘制的覆盖层，在任何输入方式下都相同。SwiftUI 的 `.help` 并不适合：它同时也是 VoiceOver 提示，因此会把已在视图名称中的文字读两次，而且它以系统自带的外观和延迟显示，从不在键盘焦点或轻触时显示。

## Boundaries and invariants

- **INV1 — 放置与尺寸。** 气泡位于视图上方 `space.s1` 处，与核心的放置方式一致；当气泡及其间隙在窗口安全顶部加上核心的 `space.s4` 下限之下放不下时，则位于下方；并横向滑动以保持在容纳该视图的窗口安全区域内，同样遵循该下限，正如核心的层始终留在视口内。其文字在超过核心的 300 点宽度后换行。气泡绘制在视图自身的层中，因此视图周围的滚动视图或其他裁剪容器会将其裁掉，而核心的顶层从不会被裁剪。
  气泡挂在视图的顶部或底部边缘，因此从第一帧起就与视图保持 `space.s1` 的间距。在首次显示时，在窗口安全区域和气泡自身尺寸尚未确定之前，它打开在视图上方；若连间隙在 `space.s4` 下限之下都放不下，则打开在下方，且不滑动，并在下一帧翻转或滑动到位。
- **INV2 — 指针。** 指针停留在视图上时，在核心的 200 毫秒后显示气泡。当指针位于视图或气泡上时保持显示，指针离开两者后 100 毫秒隐藏，按压会将其隐藏。
  即使是由键盘焦点打开的气泡，指针离开视图或气泡后也会在桥接延迟后将其隐藏，正如核心的 `mouseleave` 一样，直到焦点离开并返回。
- **INV3 — 键盘焦点。** 在焦点能到达 tooltip 的地方，键盘带来的焦点会立即显示气泡，正如核心的 `focusin`；焦点离开后 100 毫秒隐藏。是否由键盘带来焦点，会在焦点到达时一次性判定，正如核心的 `:focus-visible` 检查：当指针停留在视图上时到达的焦点，或在按压后半秒内到达的焦点，不显示任何内容，直到焦点离开并返回。SwiftUI 不会说明是谁移动了焦点，因此由代码移动的焦点按键盘焦点计算。
  指针在被点击聚焦的视图上打开的气泡，会在指针离开时隐藏；只有键盘焦点能保持它。
- **INV4 — Escape。** Escape 会在焦点所在之处隐藏已显示的气泡，并且不会进一步传递，正如核心的最顶层接收该按压。
- **INV5 — 触摸。** `auto` 是核心的默认值，会在轻触时打开 tooltip，除非视图是控件（`focus: control`），此时轻触属于其动作；`tap` 和 `none` 会覆盖它，与核心相同。直接轻触会立即打开气泡；触控板或鼠标的点击会先悬停，不打开任何内容。轻触是同时手势，因此视图自身的动作以及外层行的按钮或链接仍会执行。再次轻触视图会将其关闭；轻触视图或气泡以外的任何位置，或在气泡以外的任何位置滚动或捏合，都会将其关闭，并且仍会传递到落点，正如核心的外部关闭行为。
- **INV6 — 禁用与空白。** 被禁用的视图和空白文字在任何输入下都不显示 tooltip。
- **INV7 — VoiceOver。** VoiceOver 永远看不到气泡，VoiceOver 运行时不会处理轻触；`hint` 即为提示。
- **INV8 — 外观。** 气泡在 `color.textPrimary` 上以 `color.backgroundSurface` 绘制正文文字，纵向内边距为 `space.s1`，横向内边距为 `space.s2`，圆角为 `radius.container`。
- **INV9 — 单一结构。** 无论文字或禁用状态如何，该修饰符都保持同一视图结构，因此变更永远不会重建它所修饰的视图。

## Change coupling

对核心 `useTooltip`、`Tooltip` 或 `useTouchTrigger` 行为的更改，或对 Swift 组件调用 `astryxTooltip` 方式的更改，都会触发对本记录的审查。tooltip 测试证明其保持最新。

## Owning code

- `packages/native/apple/Sources/Astryx/Tooltip/TooltipPresenter.swift` — 修饰符、气泡、Escape 快捷键以及外部轻触监视器。

## Deciding specs

- `spec:AST-082` FR3 — 平台像核心那样遵循核心的 prop，这里指核心的 `useTooltip`、`Tooltip` 和 `touchTrigger`。

## Verification

| 不变量     | 证据                                                                                                                                                                              | 失败信号                                                                                                  |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| INV1       | `TooltipPresenterTests.swift`：除非没有空间，否则在上方；在窗口内滑动；长文字在 300 点内换行；渲染会将气泡放在视图上方或下方 4 点处，绝不覆盖视图                                 | 上方有空间却显示在下方，或有一行超过 300 点                                                               |
| INV2       | `TooltipPresenterTests.swift`：延迟与桥接；指针位于视图或气泡上时保持显示；指针离开会让键盘打开的气泡隐藏的规则，仅作为逻辑，因为 hover 路径需要应用托管的测试                    | 悬停时隐藏，或在指针下立即显示的气泡                                                                      |
| INV3       | `TooltipPresenterTests.swift`：`control` 和 `tabStop` 的焦点会立即显示，`none` 从不显示；只有键盘焦点会打开或保持它                                                               | 延迟的焦点气泡、在焦点无法到达的视图上显示的气泡，或由点击焦点打开或保持的气泡                            |
| INV5       | `TooltipPresenterTests.swift`：`auto` 按核心的方式解析；只有 tap 触发器上的直接触摸会打开它；在别处轻触会关闭它，轻触视图会切换它，在视图上滚动或捏合会关闭它，而气泡上的手势不会 | 由指针点击、在 VoiceOver 下或在 `auto` 下的控件上出现的气泡；在别处做手势或在视图上滚动后仍保持打开的气泡 |
| INV6       | `TooltipPresenterTests.swift`：空白文字和被禁用的视图不显示任何内容                                                                                                               | 被禁用视图上出现 tooltip                                                                                  |
| INV8       | `TooltipPresenterTests.swift`：两个主题下气泡的颜色和内边距                                                                                                                       | 其他颜色的气泡                                                                                            |
| INV9       | `TooltipPresenterTests.swift`：带 tooltip 的视图的绘制与不带时相同                                                                                                                | 被修饰视图的绘制出现差异                                                                                  |
| 无 `.help` | `TooltipPresenterTests.swift`：没有 Swift 源代码使用 `.help(`                                                                                                                     | 通过 `.help` 显示 tooltip 文字的视图                                                                      |
| INV2–INV7  | 未测量：hover、focus、Escape 和 tap 需要应用托管的 UI 测试，而该包目前缺少此类测试                                                                                                | 在该测试存在之前没有                                                                                      |
