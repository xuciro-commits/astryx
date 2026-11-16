# 无障碍契约（Swift）

- Status: draft
- Relation: 扩展 AST-093 FR3 和 FR5。将核心无障碍记录 AST-085（可聚焦的禁用控件）和 AST-086（状态播报）应用于 VoiceOver 和 Apple 的无障碍设置。

## 摘要

VoiceOver 用户在 iPhone 上从 Astryx 组件听到的名称、角色、状态和消息，与屏幕阅读器用户在 Web 上听到的完全相同：出现的新消息只播报一次，而打开时已在屏幕上的消息不播报。开启“减弱动态效果”（Reduce Motion）、“降低透明度”（Reduce Transparency）、“粗体文本”（Bold Text）、“按钮形状”（Button Shapes）或“不以颜色区分”（Differentiate Without Color）的用户，会得到遵循各项设置的组件。

## 要求

- **X1 — 名称、角色和状态来自核心契约。** 契约的无障碍名称成为 `accessibilityLabel`，其角色成为匹配的特征（`.isButton`、`.isHeader` 配合 `accessibilityHeading`、`.isToggle`、`.isSelected`、`.isLink`），其值成为 `accessibilityValue`。基于 SwiftUI 控件构建的组件保留该控件自身的特征，不添加重复的特征。有系统对应物的自定义控件通过 `accessibilityRepresentation` 暴露它。
- **X2 — 禁用控件保持可达（AST-085）。** 禁用的控件保留在 VoiceOver 的遍历顺序中，并被读作变暗状态。当契约给出了原因时，该原因就是控件的 `accessibilityHint`。
- **X3 — 播报遵循 AST-086。** AST-086 FR11 覆盖的组件在其出现时或屏幕加载后其文字发生变化时，用 `AccessibilityNotification.Announcement` 将自身消息播报一次；当屏幕加载时该消息已存在则不播报，除非该消息只能通过其播报被 VoiceOver 触及，此时即使屏幕加载时已存在也会播报（FR11）。错误和时效性故障以高优先级播报（FR5），重新渲染同一条消息不会再次播报（FR6）。Banner、FieldStatus 以及分组字段的状态遵循各自的规则，如 FR11 所述：Banner 的状态仅用于视觉呈现，Banner 从不播报自身；应用在结果发生时进行播报（`component:Banner` FR8）。
- **X4 — 图标除非有标签，否则仅作装饰（AST-082 FR17）。** 图标没有标签时对 VoiceOver 隐藏。仅含图标的控件必须有标签。
- **X5 — 人阅读的每样东西对应一个元素。** 作为一个整体被阅读的组件，例如横幅或列表行，是一个无障碍元素。容器上的标签不会合并容器所包含的内容：位于带标签祖先内部的文本子元素保留自己的元素和静态文本角色，而该元素发布祖先的标签来代替子元素自身的文字，于是同一个名称可以被触及两次，而子元素绘制的文字永远不会被读出。作为一个整体被阅读的组件显式合并其子元素，而不是依赖容器标签：`accessibilityElement(children: .combine)`、带自身标签的 `.ignore` 以及 `accessibilityRepresentation` 都能做到这一点，任何其他能暴露一个以组件自身文字命名的元素的方式同样如此。只能通过手势（滑动、长按、拖拽）触达的每个操作，也必须是 `accessibilityAction`。
- **X6 — 各项设置得到遵循。**
  - 减弱动态效果：运动变为交叉淡入淡出或无动画。
  - 降低透明度：半透明表面变为不透明。
  - 粗体文本：字重来自系统字体或文本样式字体，因此会遵循 `legibilityWeight`。
  - 不以颜色区分：每个用颜色表示的状态也都有形状、图标或文字。
  - 按钮形状：绘制时没有可见边缘的控件会显示边缘。
- **X7 — 目标区域至少为 44 × 44 点，** 即使绘制的控件更小。控件的渲染尺寸遵循其祖先所建立的环境，因此目标区域应在组件交付时所在的环境中测量，并覆盖默认字号和最大字号，而不是孤立测量。

## 验收检查

| 要求   | 检查                                                                                                                                                                                                                                                              |
| ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| X1     | 单元测试断言每个组件在其契约命名的每一种状态下的标签、特征和值。                                                                                                                                                                                                  |
| X2     | 一项测试禁用一个已聚焦的控件，发现它仍然保持聚焦、被读作变暗状态，并以其原因作为提示。                                                                                                                                                                            |
| X3     | 一项测试在加载后显示被覆盖组件的消息，观察到恰好一次播报，错误时为高优先级；时效性故障同样为高优先级；第二次渲染不播报任何内容；加载时已存在的同一条消息不播报；加载后显示的 Banner 不播报。只能通过其播报被 VoiceOver 触及的消息，若在加载时已存在，会播报一次。 |
| X4, X5 | UI 测试在默认字号和最大字号下对每个组件的屏幕运行 `performAccessibilityAudit()`，且没有失败。                                                                                                                                                                     |
| X5     | 一项测试将文本子元素放入带标签的容器中，发现恰好一个元素，只能触及一次，其名称是组件作为整体阅读的文字。审计本身无法确认这一点，因此测试对此进行断言。                                                                                                            |
| X6     | 在减弱动态效果下的截图不显示任何运动；在降低透明度下显示不透明表面；在粗体文本下每个组件的文字都更粗；在不以颜色区分下每个用颜色表示的状态也显示形状、图标或文字；在按钮形状下每个绘制时没有可见边缘的控件都会显示边缘。                                          |
| X7     | 审计的点击区域检查对每个控件均通过，测量在组件交付时所在的环境中进行，并覆盖默认字号和最大字号。                                                                                                                                                                  |

## 当前状态

- 在 `main` 上，Swift 包 `packages/native/apple` 包含生成的属性、wire 和逻辑宿主，没有任何 SwiftUI 视图。
- 没有任何 Swift 组件有无障碍测试或审计。

## 开放问题

- **OQ1 — 由谁为播报的状态和状态撰写措辞？** 建议：由库负责，在其自己的 String Catalog 中，含义与核心在 Web 上的默认字符串相同。

## 参考文献

- HIG，Accessibility：https://developer.apple.com/design/human-interface-guidelines/accessibility
- HIG，VoiceOver：https://developer.apple.com/design/human-interface-guidelines/voiceover
- `accessibilityRepresentation`：https://developer.apple.com/documentation/swiftui/view/accessibilityrepresentation(representation:)
- `AccessibilityNotification.Announcement`：https://developer.apple.com/documentation/accessibility/accessibilitynotification/announcement
- WWDC24，Catch up on accessibility in SwiftUI：https://developer.apple.com/videos/play/wwdc2024/10073/
- WWDC23，Perform accessibility audits for your app：https://developer.apple.com/videos/play/wwdc2023/10035/
