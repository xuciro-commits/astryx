# 可扩展变体（Swift）

- Status: draft
- Relation: 将 AST-082 FR4 关于可扩展 prop 的规则（`docs/specs/AST-082-native-first-surfaces/spec.md`，经修订的 FR4）（一种由字符串支撑的值，带有内置常量，由主题生成器扩展，可解码任意名称，并将未知名称绘制为基础外观）以原生形式应用于 Swift，并扩展 `packages/native/specs/swift/library/theme-generator.md`。原生样式数据来自 `defineNativeTheme` 平台条目（AST-082 FR10、FR18；AST-093 FR4）。

## 摘要

添加自有按钮或徽标变体的品牌在 iOS 上会得到相同的变体名称：iOS 开发者编写 `Button("Save", variant: .primaryMuted)`，由于主题声明了它，代码可以编译，应用使用者看到的外观符合品牌原生主题的定义。没有任何样式定义的变体名称会绘制组件的基础外观（不带值样式），而不是报错失败。

## 要求

- **V1 — 可扩展 prop 是开放的、由字符串支撑的类型。** 对于平台契约保留且核心契约标记为可扩展的每个 prop，契约生成器会生成一个 `struct <Name><Prop>: RawRepresentable, Hashable, Codable, Sendable, ExpressibleByStringLiteral`，以原始字符串保存 Web 值，而不是封闭的 `enum`。每个内置值都是按主题生成器的命名规则命名的静态常量（`.primary`、`.ghost`）；属于 Swift 关键字的名称用反引号书写，因此 Card 的内置 `default` 写作 `` .`default` ``。解码接受任意字符串，因此应用没有对应常量的值仍可解码；wire 对原始字符串的编码和解码保持不变。代码从不对所有值做穷举 switch。
- **V2 — 每个主题新增的值成为静态成员。** 对于每个可扩展轴，主题生成器收集主题新增的值，并将每个值作为静态成员输出到扩展中（`extension ButtonVariant { public static let primaryMuted: ButtonVariant = "primary-muted" }`）。每个值在每次生成运行中只声明一次，无论有多少主题添加它，都声明在主题文件旁边生成的 `Variants.swift` 中，且内置值从不声明。产品的生成运行会跳过包已声明的值。Swift 关键字用反引号书写，与 V1 相同。Swift 名称与其他值冲突的值会使运行失败，并同时报告两个值。
- **V3 — 原生样式数据来自平台条目。** 某个值的原生样式来自原生主题中针对所构建平台的平台条目（iOS 上为 `platforms.ios`，macOS 上为 `platforms.macos`）。在条目的 `components` 中，目标除了自身的样式键外，还持有一个键 `'<axis>:<value>'`，其值为该值的样式映射（`components.button['variant:primary-muted'] = {backgroundColor: …}`）；`PlatformEntry.components` 类型允许这种嵌套映射。每个主题文件保留所有此类条目及其平台、`minVersion` 和 `maxVersion`，并按模式保留以原始值为键的类型化样式数据：颜色（前景、背景、边框）、边框宽度、圆角半径、字体族、字号和字重，以及内边距。值按模式解析，对 token 的引用会被替换为 token 的值（主题生成器 G1、G7）。运行时，某个值的样式由 AST-082 FR10 的条目规则选择：只有适用于当前运行平台且其范围包含当前操作系统版本的条目才生效，后匹配的条目会替换先前的条目。主题的 Web 组件覆盖永远不会被读取。Swift 不绘制的样式键会被报告并省略；绘制的键中 Swift 无法读取的值会使运行失败。
- **V4 — 组件按名称查找样式。** 组件根据环境中的主题、按原始值为可扩展 prop 读取样式。内置值始终具有内置外观，主题的平台条目可以重新设计该外观。没有内置外观且没有任何生效条目为其设置样式的值，会绘制组件的基础外观，正如 AST-082 FR4 所述、Web 上所做的那样：组件完全不使用值样式，而不是采用另一个值的外观。平台条目针对组件自身目标（而非针对某个值）的样式仍然生效。开发构建会记录该回退一次，并指明组件、prop 和值。
- **V5 — 无障碍不依赖变体。** 自定义值只改变 V3 所承载的内容：颜色、形状、字体和内边距，绝不改变行为。名称、角色和状态来自核心契约，与内置值相同。

## 验收检查

| 要求  | 检查                                                                                                                                                                                                                                                                                                                                                                                      |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| V1    | 生成的 `ButtonVariant` 是一个结构体，每个内置值都是静态常量；Card 的内置 `default` 生成为 `` .`default` `` 并可编译；带有 `"variant": "primary-muted"` 的 wire 节点在有或没有对应常量的情况下都能解码并原样重新编码。                                                                                                                                                                     |
| V2    | 添加 `variant:primary-muted` 的夹具主题会生成 `ButtonVariant.primaryMuted`；两个主题添加它时只声明一次；使用 `Button("x", variant: .primaryMuted) {}` 的编译测试通过类型检查；`variant:class` 生成为 `` .`class` ``；同一次运行中同时出现 `variant:primary-muted` 和 `variant:primary_muted` 会失败，并报告两个值。                                                                       |
| V3    | 一个夹具原生主题的 `platforms.ios` 条目为 `variant:primary-muted` 设置样式，会生成其浅色和深色背景；带有 `minVersion` 的后续 `platforms.ios` 条目仅在其范围内的操作系统版本上替换它；macOS 构建读取 `platforms.macos`，而不读取 `platforms.ios`；`var(--color-accent)` 引用会生成 accent 的值；`transition` 键会被报告并省略；同一值的 Web `components` 覆盖在 Swift 中不会产生任何影响。 |
| V4    | 在 neutral 下，`.primary` 和 `.ghost` 的 Button 绘制其内置外观，且没有警告；没有任何样式定义的已添加变体会绘制不带值样式的 Button，而不是默认变体的外观，并记录一条开发警告；当生效的 `platforms.ios` 条目为 `button` 目标本身设置样式时，该未设置样式的已添加变体会随其绘制。带有已添加 `type` 且没有任何样式定义的 Heading 会绘制为不带类型样式。                                       |
| V5    | 自定义变体的无障碍断言与默认变体相同。                                                                                                                                                                                                                                                                                                                                                    |
| Drift | 主题生成器的漂移检查会重新生成 `Variants.swift` 和每个主题的样式数据，并在出现任何差异时失败。                                                                                                                                                                                                                                                                                            |

## 当前状态

- 生成的契约将每个封闭集合（包括视觉轴）声明为封闭的 `enum`（`ButtonVariant`、`BadgeVariant`）。
- `PlatformEntry.components` 目前是扁平的：一个目标映射到一个样式映射，没有 `'<axis>:<value>'` 键。
- 已发布主题在其 Web 组件覆盖中为可扩展轴上的值设置样式（例如 butter 的 `variant:muted`）；没有已发布主题拥有带平台条目的原生主题，也没有任何 Swift 主题为任何组件承载样式数据。

## 开放问题

无。
