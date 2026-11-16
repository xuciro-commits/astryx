---
schema_version: 3
template_version: 7
kind: component
id: component:swift/Avatar
platform_of: component:Avatar
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/native/apple/Tests/AstryxTests/AvatarTests.swift,
    packages/native/apple/Tests/AstryxTests/AvatarStatusDotTests.swift,
    packages/native/src/contract/contracts.test.ts,
    packages/native/src/contract/parseDocType.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: []
contributing: []
system_specs: [spec:AST-082, spec:AST-093]
---

# Avatar (Swift) component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Avatar(_ name: String? = nil, src:, fallbackSrc:, alt:, size: AvatarSize?, shape: AvatarShape?, tooltip: AvatarTooltip?, href:, status:, onClick:)` 与 `Avatar(_ props: AvatarProps, status:)`，模块 `Astryx` 中的一个 SwiftUI `View`。`size` 为具名尺寸 `xsm` 至 `xl`。 |
| 行为          | 在 `src` 处绘制图片，否则绘制 `fallbackSrc`，否则在主题的中性底板上绘制来自 `name` 的首字母，否则绘制人形符号，并将其裁剪为自身形状。带 `href` 时它是 SwiftUI `Link`；仅带 `onClick` 时它是按钮；两种情况下绘制完全相同。                                                 |
| 最终用户影响  | 用户看到的图片、首字母与形状与网页上相同，VoiceOver 朗读头像的名称，或跳过装饰性头像。                                                                                                                                                                                    |
| 构建者影响    | 应用传入名称与一个图片 URL，并可选传入提示词语与一个 `AvatarStatusDot`。像素尺寸、`target` 与 `rel` 没有 Swift 形式；`href` 必须是绝对 URL。                                                                                                                              |
| 兼容性/就绪度 | 增量式：一个新视图与生成的 `AvatarProps`。草稿；已在 macOS 与 iOS 模拟器上构建并测试；设备截图已附加到变更中。                                                                                                                                                            |
| 审查检查      | 拒绝超出契约的尺寸或形状、禁用状态、与静态头像绘制不同的链接或按钮、为触控目标而变大的布局，或静态头像在 VoiceOver 中未被朗读名称。                                                                                                                                       |
| 管辖规则      | `spec:AST-082` FR3、FR4、FR7；`spec:AST-093` FR1–FR5；`packages/native/specs/swift/library/` 下的 Swift 组件 API（A1–A9）、主题环境与无障碍记录。                                                                                                                         |

此表是审查投影；下文正文具有权威性。

## Intent

Apple 平台上的 Avatar 使用 core 的回退顺序、尺寸、形状与命名，展示一个人或一个实体的图片，并用 SwiftUI 自带的图片加载以及链接与按钮控件绘制。

## Compatibility and migration

- 保留的已发布默认值：`not yet released`
- 兼容性类别：增量式
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发行说明。

## Ownership boundary

**拥有**

- 用 SwiftUI `AsyncImage` 加载 `src`，然后加载 `fallbackSrc`。
- 首字母、人形符号、底板颜色与形状裁剪。
- 为 `href` 或 `onClick` 切换到 SwiftUI `Link` 或 `Button`，且不改变绘制。
- 头像的 VoiceOver 名称及其触控目标。

**不拥有 / 非目标**

- props 的含义、首字母规则与尺寸标度——由 `component:Avatar` 拥有。
- 头像组，它们没有 Swift 视图。

## Public concepts

| 概念    | 封闭值或状态                                      | 含义                                        | 按变体/方向/状态的可用性 | 默认     | 所有者                   | 稳定性       | 无效值行为                                        |
| ------- | ------------------------------------------------- | ------------------------------------------- | ------------------------ | -------- | ------------------------ | ------------ | ------------------------------------------------- |
| size    | `xsm`, `sm`, `md`, `lg`, `xl`                     | 默认文本尺寸下为 20、24、36、48、128 points | always                   | `md`     | `component:Avatar`       | experimental | core 的像素尺寸没有 Swift 形式                    |
| shape   | `circle`, `rounded`, `square`                     | 全圆、主题的元素圆角、无圆角                | always                   | `circle` | `component:Avatar`       | experimental | 无                                                |
| picture | 图片、回退图片、首字母、人形符号                  | 按该顺序第一个可用的                        | always                   | —        | `component:Avatar`       | experimental | 空或无法加载的 URL 会前进到下一个                 |
| control | `static`、`link`（`href`）、`button`（`onClick`） | 轻点的行为方式；绘制相同                    | always                   | static   | `component:swift/Avatar` | experimental | 不是绝对 URL 的 `href` 会让头像保持静态或作为按钮 |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 依据                                                        | 草稿审查状态 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- | ------------ |
| FR1 | 视图 MUST 显示 `src` 处的图片；当它缺失或加载失败时，显示 `fallbackSrc` 处的图片；然后是来自非空 `name` 的首字母；然后是一个人形符号。回退图片仅在 `src` 失败或没有 `src` 时才加载；图片加载期间，显示首字母或人形符号。                                                                                                                                                                                                                                                                                                                                                                              | core `Avatar` 回退顺序；`spec:AST-093` FR2                  | verify       |
| FR2 | 首字母 MUST 遵循 core 的规则：取第一个和最后一个包含此类字符的单词中的字母、数字或 emoji，转为大写，跳过前导标点，保留完整的一个 emoji、旗帜或组合的 emoji 序列。若名称中没有任何此类字符，则显示人形符号，并且仍然为头像提供名称。                                                                                                                                                                                                                                                                                                                                                                   | core `Avatar` 首字母                                        | verify       |
| FR3 | 在默认文本尺寸下，头像 MUST 是 20、24、36、48 或 128 points 的正方形，对应 `xsm` 到 `xl`，并随 Dynamic Type 最多放大到 1.6 倍且绝不缩小，从而它及其首字母能与其旁边的名称一起变大，而不会吞掉一行（`spec:AST-082` FR11）。它被裁剪为圆形、主题的 `radius.element` 或正方形。                                                                                                                                                                                                                                                                                                                          | core `Avatar` 尺寸与形状                                    | verify       |
| FR4 | 首字母与人形符号 MUST 在 `color.neutral` 上以 `color.textSecondary` 绘制；首字母使用主题的正文字体族、中等字重，尺寸为边长的 40%。                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | core `Avatar` 回退样式；`spec:AST-093` FR4                  | verify       |
| FR5 | 当 `href` 是绝对 URL（带有 scheme）时，头像 MUST 是 SwiftUI `Link`，例外是脚本 URL（`javascript:`、`vbscript:`）或 `data:` URL 中的 HTML 文档，它们 MUST 让头像不带链接，而是作为带 `onClick` 的按钮或静态头像（`family:navigation-destinations` FR4）；若同时带有 `onClick`，`onClick` 在打开时运行，随后 URL 交给应用自己的 URL 处理器，或系统的处理器。不是绝对 URL 的 `href`，例如 web 路径，MUST 让开发构建停止并给出指明它的消息；发布构建绘制不带链接的头像，作为带 `onClick` 的按钮或静态头像。仅带 `onClick` 时，是一个 SwiftUI `Button`。两者绘制得与静态头像完全相同，且头像没有禁用状态。 | Swift 组件 API A4                                           | verify       |
| FR6 | 两个初始化器 MUST 构建相同的 `AvatarProps`；`name` 是无标签的第一个参数，单个尾随闭包是 status，`onClick` 位于最后。基础 props 通过 `AvatarProps` 传入：使用 `isHidden` 时视图不绘制任何内容；`id` 成为无障碍标识符。                                                                                                                                                                                                                                                                                                                                                                                 | Swift 组件 API A2–A4、A7；`spec:AST-082` FR7                | verify       |
| FR7 | `status` 插槽 MUST 在头像的裁剪区域之外绘制其内容，通常是一个 `AvatarStatusDot`，按内容自身的尺寸定位，并在同一次布局过程中完成，与 core 放置任何状态的方式相同：在圆形头像上，以圆心位于圆形边缘的右下 45° 点为中心；在圆角或方形头像上，悬出右下角，悬出量为自身尺寸的四分之一；在从右到左的布局中镜像。它 MUST NOT 改变头像的尺寸或布局，按尺寸层级为圆点取头像边长作为其尺寸，并允许其他内容随 Dynamic Type 增长的速度不快于头像，最多到其 1.6 倍增长时的文本尺寸：内容仍然随 Dynamic Type 增长（`spec:AST-082` FR11），上限为其所有者的增长，因为所有者决定其容纳内容的尺寸（Swift 插槽 S4）。   | core `Avatar` 状态位置；Swift 插槽 S4                       | verify       |
| FR8 | `tooltip` MUST 像 core 那样解析：`nil` 或 `true` 解析为名称，字符串解析为给定的词语，`false` 或空白词语解析为无，并且 MUST 通过 Astryx tooltip（`architecture:native-swift-library-tooltip`）显示，其焦点与触摸行为见下方“按输入划分的 Tooltip”表：静态头像恰好在显示 tooltip 时是一个 Tab 停靠点，正如 core 仅在那时给其根元素一个 Tab 停靠点，并在轻点时打开；链接或按钮保留其焦点与轻点。获得焦点的头像显示平台的焦点环，正如 core 显示其 focus-visible 环。给定的词语是 VoiceOver 提示。在传输格式上，它是 web 的值，即一个字符串或一个 Bool。                                                    | core `Avatar` `tooltip`；core `Tooltip`；`spec:AST-082` FR3 | verify       |

**按输入划分的 Tooltip（FR8）。** 适用 Astryx tooltip 的规则；此表说明 Avatar 的选择。

| 输入      | 默认名称                                                                                                                                               | 给定词语                                   | 关闭（`false` 或空白）      |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------ | --------------------------- |
| 指针      | 气泡在 200 ms 后在头像上方显示名称，指针停留在其上时保持显示，按下则隐藏它                                                                             | 相同，但换成给定词语                       | 无                          |
| 键盘焦点  | 气泡立即显示名称，Escape 隐藏它；静态头像是一个 Tab 停靠点                                                                                             | 相同，但换成给定词语                       | 无；静态头像不是 Tab 停靠点 |
| 触摸轻点  | 直接轻点静态头像会用名称打开气泡；再次轻点它，或轻点其他任何位置，会关闭气泡，且该轻点仍然会到达它落到的对象；轻点会与外层行共享；链接或按钮保留其轻点 | 相同，但换成给定词语                       | 无                          |
| VoiceOver | 名称被朗读一次，作为头像自身的名称；气泡被隐藏，轻点不受干预                                                                                           | 这些词语是提示，正如 core 把它们放进描述中 | 无                          |

### Allowed variation

- **AV1 — 加载。** 图片加载期间，显示首字母或人形符号，而不是空底板。
- **AV2 — 字形。** 人形符号是 SF Symbol `person.fill`，而不是 core 的 SVG。

- **AV3 — Tooltip 表面。** 在每种输入下，tooltip 都是采用 core 的 tooltip 颜色的 Astryx tooltip 气泡。SwiftUI 的 `.help` 不合适：它同时也是 VoiceOver 提示，因此会朗读名称两次，而且它以系统的外观与延迟显示，从不在键盘焦点或轻点时出现。

### Representative states

| 状态                   | 必需的不变式           | 允许的变化 |
| ---------------------- | ---------------------- | ---------- |
| 图片                   | 图片填满形状           | 图片内容   |
| 带回退的失败图片       | 回退图片               | 无         |
| 首字母，每种尺寸与形状 | 首字母居中于中性底板   | 字形度量   |
| 无名称                 | 人形符号，边长的 60%   | 无         |
| 链接与按钮             | 与静态相同的绘制       | 无         |
| 浅色与深色，两个主题   | 各主题的底板与文本颜色 | 无         |

### Transformation and precedence order

- **ORD1 — 图片。** `src` → `fallbackSrc` → 首字母 → 人形符号。
- **ORD2 — 名称。** `alt` → `name`，其中空白字符串视为无；然后与状态标签（AR6）组合，圆点的标签优先于其他元素的标签。
- **ORD3 — 控件。** `href`（链接）→ `onClick`（按钮）→ 静态。

### Performance and resources

- **PR1 — 系统加载。** 图片通过 `AsyncImage` 与系统 URL 缓存加载；视图不保留自己的图片缓存。

## Accessibility contract

- **AR1 — 有名称或装饰性。** 有名称的静态头像是一个图像元素，其名称来自 `alt`，否则来自 `name`，并与其状态标签（AR6）组合；没有名称也没有状态标签时，它对 VoiceOver 隐藏。链接或按钮头像是一个元素，带有链接或按钮特征，并具有相同的名称；首字母绝不是它们自己的元素（Swift 无障碍 X1、X5）。
- **AR2 — 触控目标。** 链接或按钮头像，以及轻点会打开其 tooltip 的静态头像，在至少 44 × 44 points 的范围内响应轻点，且不改变其绘制尺寸或布局（X7）。
- **AR3 — 渲染树未测量。** 测试断言视图所设置的内容；在存在应用宿主目标之前，不测量渲染出的无障碍树与命中区域。
- **AR4 — 无名称轻点会被标记。** 没有 `alt` 或 `name` 的链接或按钮头像会记录一条开发警告，如同 core 的警告。
- **AR5 — 首字母对比度。** 首字母以 core 的 token 绘制，即 `color.neutral` 上的 `color.textSecondary`，与 core 的 Avatar 相同。在默认主题与中性主题的深色外观中，该组合低于 4.5:1，core 中也是如此；修复属于主题 token。
- **AR6 — 名称中的状态。** 状态标签按 core 的消息组合方式并入头像的名称（“Ada Lovelace, Online”）；仅有状态标签也能为原本无名称的头像提供名称。标签来自插槽中的 `AvatarStatusDot` 或带标签的 `Icon`，任意深度均可，正如 core 读取作为 `status` 传入的元素的 `label`，且圆点的标签优先，与 core 报告的圆点标签相同；SwiftUI 无法从其他视图读取标签，因此它们的标签不会并入。

## Design relationships

| 解剖或状态   | 设计要求                                 | 表示权威     | 层级角色 | 组件契约 |
| ------------ | ---------------------------------------- | ------------ | -------- | -------- |
| 照片、首字母 | Apple Human Interface Guidelines、Images | 由 core 规定 | 显著     | FR1–FR4  |

组件实现设计要求，而不复制其理由。

平台控件：图片使用 SwiftUI `AsyncImage`，`href` 使用 SwiftUI `Link`，`onClick` 使用 SwiftUI `Button`（`spec:AST-093` FR2）。SwiftUI 没有头像控件，因此底板、首字母与裁剪在此绘制。指南页面：Apple Human Interface Guidelines 中的 Images、Buttons 与 Accessibility。

读取的主题值：`color.neutral`、`color.textSecondary`、`radius.element`、`font.family.body`、`font.weight.medium` 与 Bold Text；tooltip 气泡还读取 `color.textPrimary`、`color.backgroundSurface`、`space.s1`、`space.s2`、`radius.container` 以及正文文本尺寸与字重。

## Family and system relationships

- `component:Avatar` 拥有 props、尺寸、首字母规则与回退顺序；此记录只说明 Swift 如何绘制它们。
- 在插槽中持有 Avatar 的所有者会让未指定尺寸的 Avatar 保持 `md`（Swift 插槽 S4）。

## Verification map

| 契约          | 验证                                                                                                                                                                                 | 代表性状态                                                                                                | 变更或失败预期                                                                                                                                                                                  | 审计章节                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1、FR2      | `AvatarTests.swift` 的首字母与回退测试                                                                                                                                               | core 的首字母用例；空白与符号名称                                                                         | 错误的初始字母，或缺失的人形符号，会失败                                                                                                                                                        | `audit:swift/Avatar/picture` |
| FR3、FR4      | `AvatarTests.swift` 的尺寸、文本尺寸增长、形状与双主题渲染                                                                                                                           | 每种尺寸；xx-large 与最大文本尺寸；圆形与方形；light、dark、butter                                        | 错误的边长、不增长或增长超过 1.6 倍、未裁剪的角，或自有颜色，会失败                                                                                                                             | `audit:swift/Avatar/look`    |
| FR5、AR2、AR4 | `AvatarTests.swift` 的链接与按钮渲染；轻点、特征、轻点区域、警告、`linkURL`、web 路径与被拒绝目标的测试                                                                              | static、link、button；格式错误、相对与空的 `href`；`javascript:`、`vbscript:` 与 `data:text/html` 的 href | 绘制不同的链接或按钮、把格式错误的 `href` 做成链接、未标记的 web 路径、未标记的无名称轻点，或把被拒绝的目标做成链接，会失败                                                                     | `audit:swift/Avatar/control` |
| FR8           | `AvatarTests.swift` 的 tooltip 词语、焦点与触摸、VoiceOver 提示与传输格式测试；每种输入的 `TooltipPresenterTests.swift`；`contracts.test.ts`；`parseDocType.test.ts`                 | 名称、`true`、词语、`false`、空白、无名称；static、link、button                                           | 错误的 tooltip、不是 Tab 停靠点或不轻点打开的静态头像、丢失轻点的控件，或传输格式上的值不是 web 的值，会失败；在存在测试之前不测量：不显示 tooltip 却获取焦点的静态头像，或没有焦点环的聚焦头像 | `audit:swift/Avatar/tooltip` |
| FR6           | `AvatarTests.swift` 的初始化器与隐藏测试；`contracts.test.ts`                                                                                                                        | 两个初始化器；`isHidden`；具名尺寸                                                                        | props 不同、绘制出隐藏的头像，或 Swift 中出现像素尺寸，会失败                                                                                                                                   | `audit:swift/Avatar/api`     |
| FR7、AR6      | `AvatarStatusDotTests.swift` 的放置渲染：圆点与其他内容绘制在其测量位置、尺寸，图标在最大文本尺寸下的增长，圆点标签优先，以及名称测试；将标签带入渲染名称的标签优先级未被测量（AR3） | `lg` 的圆形与方形；带状态与不带状态的名称                                                                 | 改变头像尺寸、偏离边缘，或使名称缺少其标签的圆点，会失败                                                                                                                                        | `audit:swift/Avatar/status`  |
| AR1           | `AvatarTests.swift` 的命名与特征测试                                                                                                                                                 | `alt`、`name`、空白、无                                                                                   | 错误的名称，或被命名的装饰性头像，会失败                                                                                                                                                        | `audit:swift/Avatar/a11y`    |
| AR5           | `AvatarTests.swift` 的双主题渲染以 core 的 token 绘制首字母                                                                                                                          | 默认与中性，浅色与深色                                                                                    | 使用非 core token 的首字母，会失败                                                                                                                                                              | `audit:swift/Avatar/look`    |

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不复制使用方 props 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
