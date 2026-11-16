# Swift 库规范

每个 Astryx Swift 组件或 Swift 构建步骤共同遵循的规则，一个文件对应一个关注点。组件规范（`<Name>.swift.spec.md`，位于核心组件规范旁边，例如 `docs/specs/components/Button/Button.swift.spec.md`，由 `../../TEMPLATE.md` 生成）遵循这些规则，只记录组件不同之处。

这些规范适用 AST-082（native-first surfaces）和 AST-093（native component guidelines）。如果其中某一项与已批准的记录不一致，以记录为准。

| 文件                      | 关注点                                                     |
| ------------------------- | ---------------------------------------------------------- |
| `accessibility.md`        | 核心的无障碍语义如何传达至 VoiceOver 和 Apple 的无障碍设置 |
| `augmentable-variants.md` | 主题自有的变体如何以开放类型的形式到达 Swift               |
| `component-api.md`        | SwiftUI 视图如何命名并接受其生成的契约                     |
| `slots.md`                | 每种插槽类型（文本、图标、内容）如何在 SwiftUI 中呈现      |
| `styles.md`               | Astryx 的外观如何以 SwiftUI 样式交付                       |
| `tooltip.spec.md`         | 核心的提示框如何触达指针、键盘、触摸和 VoiceOver（内部）   |
| `theme-environment.md`    | 主题如何双向搭载于 SwiftUI 的环境                          |
| `theme-generator.md`      | 任意 Astryx 主题如何变成 Swift `Theme`                     |
