# 主题环境（Swift）

- Status: draft
- Relation: 扩展 AST-093 FR4 和 AST-082 FR10、FR11；基于
  `packages/native/specs/swift/library/theme-generator.md`（它生成的 `Theme` 和
  `Tokens`，以及它的字体族读取器）和
  `packages/native/specs/swift/library/component-api.md`（名称）。

## 摘要

在使用 Astryx 构建的应用中，系统自带的控件与 Astryx 组件保持一致，用户的系统设置处处得到遵循：深色模式、增强对比度、文字大小、减弱动态效果、降低透明度、粗体文本以及从右到左布局，全部来自 SwiftUI 自己的环境。在 Astryx 主题内，原生 SwiftUI 控件在可读的情况下以主题的强调色作为 tint，否则保留自己的颜色。Astryx 不会为应用额外增加一套需要保持同步的设置系统。

## 要求

- **E1 — 设置从 SwiftUI 读取，绝不重复。** 组件和主题读取这些环境值，Astryx 不为其中任何一项提供自己的 API：

  | SwiftUI 值                        | Astryx 用它做什么                                                                                                                                                                                                                                     |
  | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `colorScheme`                     | 选择主题的浅色或深色令牌，因此 `.preferredColorScheme(_:)` 和系统设置驱动模式；单一模式主题除外，它在自己的子树中设置 `colorScheme`（E2）                                                                                                             |
  | `colorSchemeContrast`             | 当对比度增强时，边框和分隔线使用 `color.borderEmphasized` 而不是 `color.border`                                                                                                                                                                       |
  | `dynamicTypeSize`                 | 通过相对于文字样式的字体缩放文字，并通过 `@ScaledMetric` 缩放文字旁边的度量                                                                                                                                                                           |
  | `accessibilityReduceMotion`       | 运动变为交叉淡化或无动画                                                                                                                                                                                                                              |
  | `accessibilityReduceTransparency` | 半透明表面变为不透明                                                                                                                                                                                                                                  |
  | `layoutDirection`                 | 前缘和后缘跟随它                                                                                                                                                                                                                                      |
  | `legibilityWeight`                | 粗体文本：系统和文字样式字体自行跟随；来自主题字体族列表的自定义字面在 `.bold` 时绘制得更重：ultra light → thin，thin → light，light → regular，regular → semibold，medium → semibold，semibold → bold，bold → heavy，heavy → black，black 保持 black |

- **E2 — 主题在存在原生等价物的地方写入 SwiftUI 自己的值。** `.astryxTheme(_:)` 在当前模式下为子树设置：

  | SwiftUI 值  | 来自主题                                                                                                                   |
  | ----------- | -------------------------------------------------------------------------------------------------------------------------- |
  | `.tint(_:)` | `color.accent`，但仅限于白色与它的对比度达到 3:1 的模式，因为原生控件会在其 tint 上绘制白色；在任何其他模式下使用系统 tint |

  如果一个主题的页面底色、卡片底色、主文本和强调色在浅色与深色下相同（即单一模式主题，例如 Gothic），它还会把子树的 `colorScheme` 设置为其页面底色所属的模式——深色底对应深色——以便其中的原生控件在其底色上绘制该外观。

  因此，原生 SwiftUI 控件（`Toggle`、`Picker`、`ProgressView`、`Menu`、`List`、`Slider`、`Link`）在任何仍然清晰可读的地方使用品牌的强调色绘制。主题只通过 tint 影响原生 SwiftUI 控件，不写入任何前景样式：继承的前景样式会覆盖原生控件自己的标签颜色，把链接变成普通文本，并把 prominent 按钮的白色标签变成深色。原生纯文本保留系统的主色；Astryx 自己的文本使用主题的颜色。（由 cixzhang 决定，2026-10-25。）
  主题是否还设置默认字体是 OQ1。没有 SwiftUI 环境等价物的主题值由 Astryx 组件和 Astryx 的 SwiftUI 样式读取（圆角、间距、元素高度、边框和背景），应用也可以从带类型的令牌（`theme.space.s4`）为自己的 SwiftUI 堆栈读取间距。控件尺寸没有干净的映射：Astryx 的尺寸是逐组件的 prop，因此主题不设置 `controlSize`。

- **E3 — 模式始终跟随 SwiftUI。** 令牌值在读取它的地方根据环境的 `colorScheme` 选择，因此带有自己的 `.preferredColorScheme` 或 `.environment(\.colorScheme, …)` 的子树会获得该模式的令牌。
- **E4 — 没有修饰符仍然意味着使用平台的设置。** 没有 `.astryxTheme(_:)` 时，组件使用核心的默认主题，并且仍然跟随 `colorScheme` 和每一个 E1 值；只是缺少 E2 的写入。
- **E5 — 子树可以更改主题。** 子树上的 `.astryxTheme(_:)` 只替换该子树的主题，包括 E2 的写入。
- **E6 — 主题是一个环境值。** 主题作为单个用 `@Entry` 声明的环境值传递；组件用 `@Environment` 读取它，从不通过单例。

## 验收检查

| 要求   | 检查                                                                                                                                                                                                                                                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| E1、E3 | 一个只设置 `.preferredColorScheme(.dark)`（没有任何其他 Astryx 设置）的视图测试会用深色令牌绘制 Astryx 组件；在 `colorSchemeContrast` 增强时，Card 绘制 `color.borderEmphasized`。在 `legibilityWeight` 设为 `.bold` 时，使用 butter 注册的正文字面、regular 字重的 Astryx Text 解析为 semibold，而 bold 字重解析为 heavy。 |
| E2     | 在浅色下，`.astryxTheme(.butter)` 内的原生 SwiftUI `Toggle` 绘制 butter 的强调色；在深色下，butter 的浅色强调色与白色的对比度低于 3:1，因此使用系统 tint；原生 `Link` 和无边框 `Button` 用 tint 绘制标签，prominent `Button` 保持其白色标签；在浅色外观下，`.astryxTheme(.gothic)` 内的原生表面绘制为深色。                 |
| E4     | 没有 `.astryxTheme(_:)` 时，`.preferredColorScheme(.dark)` 下的 Astryx 组件绘制核心的默认深色令牌。                                                                                                                                                                                                                         |
| E5     | 在 `.astryxTheme(.butter)` 内，一个使用 `.astryxTheme(.neutral)` 的子树绘制 neutral 的强调色，其中的原生 `Toggle` 也是如此。                                                                                                                                                                                                |
| E6     | 源码检查找不到静态或单例的主题状态；环境键用 `@Entry` 声明。                                                                                                                                                                                                                                                                |

## 当前状态

- `packages/native/apple` 包含 `Astryx` 产品：`Theme` 和 `Tokens`
  类型、`.astryxTheme(_:)` 修饰符（它设置 tint 和单一模式主题的
  colorScheme），以及从 `astryx` 环境值读取主题的 SwiftUI 组件。组件从
  `colorScheme` 选择浅色或深色令牌，无论有没有修饰符；它们用
  `dynamicTypeSize` 缩放文字，并在粗体文本下把自定义字面绘制得重一个字重。

## 开放问题

- **OQ1 — 主题是否应该为其子树中的所有文本设置默认字体？**
  这会给原生 SwiftUI 文本打上品牌，也会改变应用自己绘制的文本。
  建议：设置，因为主题的字体是其身份的一部分，而且应用仍然可以在任何视图上设置自己的 `.font(_:)`。
