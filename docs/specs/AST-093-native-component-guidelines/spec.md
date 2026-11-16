---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-093
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [cixzhang]
affects_architecture: []
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Native component guidelines system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

使用 `@astryxdesign/native` 构建的应用的人，得到的控件在外观与行为上与本平台自有的控件一致，在平台留有余地之处承载应用的品牌，并且每次都按同样的方式接受检查。

构建原生组件的贡献者在一处、以一种形状为其编写简短的规格，按固定顺序遵循三条准则（原生优先，然后是平台自身的设计指南，其余一切由主题决定），并用与其他每个原生组件相同的测试和截图来证明结果。原生组件以 Swift 起步，面向 iOS 和 macOS。

本记录把 `spec:AST-082` 应用于在 `@astryxdesign/native` 仅发布到 canary 通道期间（`spec:AST-082/FR15`）对单个原生组件进行规格编写、构建、验证和审查的工作。

## Non-goals

- 哪种构建平台的路线胜出。`spec:AST-082/FR12` 通过测量来决定。
- 受支持的 OS 版本（`spec:AST-082/OQ4`）和性能阈值（`spec:AST-082/OQ1`）。
- 组件的核心契约：其共享 props、状态、文案和无障碍语义。组件自身的记录和 `spec:AST-082/FR3` 拥有它们。
- 面向 Android 和 Windows 的准则（OQ1）。
- Web 组件和 `@astryxdesign/core`。
- 等价的内部实现在满足本契约时依然有效。

## Requirements

- **FR1 — 原生组件的规格与核心组件的规格放在一起。** 每个原生组件的视图位于其语言的实现中，处于镜像其核心组件根目录（核心源码目录）的文件夹：`<ComponentRoot>`，当核心把组件放在自己的文件夹中时它就是 `<Name>`，因此核心的 `Avatar/AvatarStatusDot` 会把 Swift 的 AvatarStatusDot 视图也放在 `Avatar/` 中。规格查找按该文件夹把原生视图路由到其组件的记录，这就是该文件夹属于契约一部分的原因。其规格是 `docs/specs/components/` 下核心组件文件夹中的 `<Name>.<language>.spec.md`，与核心记录（`docs/specs/components/<ComponentRoot>/<Name>.spec.md`）并列，正如 `architecture:knowledge-contracts` DEC-15 放置每个组件记录那样。每种语言有一个实现包；对 Swift 而言是 `packages/native/apple/`，组件的视图位于 `packages/native/apple/Sources/Astryx/<ComponentRoot>/`，其规格是 `docs/specs/components/<ComponentRoot>/<Name>.swift.spec.md`。`<Name>` 是核心组件的名称，`<ComponentRoot>` 是核心存放它的文件夹。该规格是 kind 为 `component`、id 为 `component:<language>/<Name>` 的知识记录，在 `platform_of` 中指明其核心组件，按 `docs/templates/knowledge/component-spec.md` 构建（`architecture:knowledge-contracts` INV27）。在核心组件拥有自己的记录之前，`platform_of` 仍然指名 `component:<Name>`，核心组件的公共源码与文档充当其契约。一份规格覆盖该组件在该语言中的每个实现，覆盖该语言所服务的每个平台（Swift 服务 `ios` 和 `macos`）。跨某语言各组件适用的规则是 `packages/native/specs/<language>/` 下的架构记录，命名为 `<slug>.spec.md`。已合并的原生组件规格描述该组件在该语言中的实现。它绝不改变核心契约，也绝不与 `spec:AST-082` 或本记录矛盾；若确有矛盾，以它们为准。
- **FR2 — 原生优先排在第一位。** 当平台自有的控件满足其契约（`spec:AST-082/FR11`）时，原生组件就使用它。在 Swift 中这是 SwiftUI 控件，或在 SwiftUI 没有时使用 UIKit 或 AppKit 控件。组件只在平台没有可用控件时才自绘控件，其规格要指明它寻找过的平台控件以及为何不适用。
- **FR3 — Apple 平台遵循 Apple Human Interface Guidelines。** 在 `ios` 和 `macos` 上，呈现与交互遵循 Apple Human Interface Guidelines：布局与间距约定、最小点击目标、Dynamic Type、SF Symbols（`spec:AST-082/FR17`）、系统材质、包含 Reduce Motion 的动效、触感反馈和 VoiceOver。每份规格指明它遵循的指南页面。核心契约保留组件的含义、文案、状态和无障碍语义；指南决定平台如何呈现它们，但按屏幕尺寸在呈现方式之间做选择时，使用 `spec:AST-012` FR9 的 compact 定义而不是 size classes。
- **FR4 — 品牌通过主题在所有其余之处显现。** FR2 和 FR3 未作规定的部分，例如强调色与填充色、字体族、圆角形状、间距和图标选择，来自应用的主题：来自其 `defineTheme` 定义的 token（`spec:AST-082/FR18`），以及来自 `defineNativeTheme` 的原生意图和平台条目（`spec:AST-082/FR10`）。组件从主题读取每一个这样的值，绝不硬编码任何一个，也绝不为某个平台新增视觉 prop（`spec:AST-082/DEC-2`）。每份规格列出组件读取的主题值。
- **FR5 — 每个原生组件都以相同方式接受测试和验证。** 对原生组件的改动随附：
  - 其包的测试 target 中的单元测试，覆盖参数映射、默认值和状态变化，并在该包支持的每个平台上构建和运行；
  - 按平台为该组件生成的契约来命名和标注类型的参数（`spec:AST-082/FR5`）：每个平台都遵循的核心 props 加上该平台自身的 props（`spec:AST-082/FR3`），绝不保留仅为对齐而存在的 prop，且契约漂移测试通过，Current-state impact 中列出的临时 Swift 视图除外；
  - 核心契约所要求的 label、traits 和 value 的无障碍断言，外加在最大 Dynamic Type 尺寸下的检查；
  - 一项检查：组件从两个不同主题渲染，其间不含任何自身的值；
  - 来自模拟器或设备的每个状态的截图，涵盖浅色与深色以及最大文本尺寸，附在改动中。原生优先、指南和品牌的论断都以这些截图为准，绝不以源码或样式值为准（`spec:AST-082/FR12`）。无法截取的论断报告为未测量。
- **FR6 — 来自原生组的原生改动在规格审查后获批。** 一个 pull request，若其每个改动文件都在 `packages/native/` 下，或属于原生组件规格（`docs/specs/components/**/<Name>.<language>.spec.md`），且其作者与每个提交作者都是原生组成员，则在其确切 head 上由工程 owner 批准，无需单独的代码或设计审查，前提是以下三条全部成立：其必需检查通过；审查应用已审查过该确切 head 且未指明任何缺陷；对照 `spec:AST-082`、本记录以及它所触及的每个组件的原生规格对该改动进行审查，发现它们定义的每条要求都得到满足。规格定义的行为必须与其一致，违反此类要求的改动不予批准。尚无规格定义的行为不阻碍批准，如同在 lab 包中那样：审查把每个此类行为记为规格缺口，以便后续补上规格。原生组是 GitHub 账号 `cixzhang`、`ejc3`、`ejhammond`、`ernestt`、`imdreamrunner` 和 `vjeux`。任何改动上述路径之外文件的 pull request，或带有其他任何人的提交的 pull request，遵循仓库的常规审查闸门。任何审查者提出的改动请求仍然阻止合并。更改该组即是对本记录的更改。

### Platform support

- 受支持的功能/引擎下限：在 `spec:AST-082/OQ4` 确定之前，每个 Swift 包声明自己的平台和 OS 版本。
- 不受支持的行为：比运行中的 OS 更新的能力按 `spec:AST-082/FR11` 的要求降级；组件绝不渲染空白或破损状态。
- 浏览器证据：无。原生论断由来自模拟器或设备的截图证明（FR5）。

## Current-state impact

- `@astryxdesign/native` 新增 `packages/native/specs/`，每种语言一个目录，起始为 `swift/`。该目录不发布。
- `packages/native/specs/swift/` 下的 Swift 规格和包模板 `packages/native/specs/TEMPLATE.md` 早于 FR1 的记录形式。它们在一次改动中转换为知识记录，该改动会移除模板。在此之前，包的 README 仍然指名模板，而新的组件规格改为遵循 FR1。
- 没有架构、family、contributing 或使用方文档记录的改动。
- 目前尚不存在原生组件规格。
- 组件文件夹位于某语言的实现包内。对 Swift 而言是 `packages/native/apple/`，其 `Astryx` product 存放 SwiftUI 视图。
- `Astryx` product 中的首批 Swift 视图（Banner、Button、Card、Heading、Text 和 TextInput）采用手写参数，包括用于契约中 `onClick` 的 `action`，直到它们迁移到生成的契约。在此之前，它们是唯一豁免 FR5 生成参数要求的原生组件；FR5 的其他每项检查都适用于它们。新视图绝不获得这一豁免。
- Swift 测试作为 Swift 包测试运行，其中 SwiftUI 不暴露无障碍树，因此 FR5 的无障碍断言检查的是视图所设置的 label、traits 和 value，而不是 VoiceOver 读取的树。在存在由应用托管的 iOS 测试 target 之前，改动把渲染树的无障碍报告为未测量，正如 FR5 报告其无法截取的论断那样。FR5 的其他每项检查都适用。

## Verification

| Contract | Verification                                                                                                                | Representative states                                                                                                                                                          | Mutation or failure expectation                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR1      | 审查视图所在文件夹，审查规格路径与核心组件规格并列，并对其记录 frontmatter、id 和 `platform_of` 运行 `pnpm check:knowledge` | 每种语言一份规格；一份针对没有核心契约的组件的规格；核心保留在另一组件文件夹中的成员组件                                                                                       | 以下情形也能通过：视图位于镜像核心组件根目录的文件夹之外；组件规格位于 `docs/specs/components/` 下核心组件文件夹之外；没有有效的记录 frontmatter；id 不同；未指名任何核心组件；或重命名核心 prop |
| FR2      | 规格对它所基于的平台控件的说明，或对为何没有适用控件的说明，以及状态截图                                                    | 基于平台控件构建的组件；没有平台控件的组件                                                                                                                                     | 在平台控件适用时组件自绘控件，而其规格中没有理由                                                                                                                                                 |
| FR3      | 规格对其遵循的平台指南的说明，以及截图                                                                                      | 点击目标尺寸；最大 Dynamic Type；Reduce Motion；VoiceOver 焦点                                                                                                                 | 截图显示点击目标低于平台最小值，或文本不随尺寸缩放                                                                                                                                               |
| FR4      | 使用两个主题的主题测试，外加对字面量的源码审查                                                                              | 默认主题；颜色、字体和形状不同的第二个主题                                                                                                                                     | 某个品牌值在两个主题下保持不变，或被新增仅限平台的视觉 prop                                                                                                                                      |
| FR5      | 该包在每个受支持平台上的测试，以及附在改动中的截图                                                                          | 浅色；深色；最大文本；核心契约指名的每个状态                                                                                                                                   | 改动在没有测试、没有截图的情况下合并，或基于截图的论断仅由源码支撑                                                                                                                               |
| FR6      | 改动的路径、提交作者、审查应用的确切 head 审查、规格审查的发现以及批准                                                      | 全部由组成员提交的原生路径；一条规格定义的要求未满足；尚无规格定义的行为；`docs/specs/components/` 下的原生组件规格；`packages/native/` 和那些规格之外的路径；来自其他人的提交 | 批准时缺少确切 head 的审查应用通过或缺少规格审查；批准时存在未满足的规格定义要求；范围之外的 pull request 未经审查即获批；或范围内的 pull request 仅因尚无规格定义的行为而被阻止                 |

## Decision log

### DEC-1 — Platform conventions decide first; the theme fills what they leave open

**Reference:** `spec:AST-093/DEC-1`

**Decider:** cixzhang, 2026-10-23

iOS 或 macOS 上的人期望控件看起来和表现得像其设备的其余部分，因此平台自有的控件和 Apple Human Interface Guidelines 先行决定。应用的身份仍然重要，因此平台留有余地的一切都来自应用已为每个 surface 定义一次的主题。

已否决：与 Web 渲染逐像素对齐，因为它会覆盖使用者所依赖的平台约定。

### DEC-2 — Native changes from the native group merge on a spec review

**Reference:** `spec:AST-093/DEC-2`

**Decider:** cixzhang, 2026-10-23

`@astryxdesign/native` 只发布到 canary 通道，因此没有稳定用户会收到原生改动。实验运行期间，构建它的人需要快速落地组件，因此原生改动不等待单独的代码或设计审查。规格仍是契约：每个改动在批准前都对照它们审查，它违反的规格定义要求会阻止它。尚无规格覆盖的行为是受欢迎的，如同在 lab 包中那样，它成为待补的规格缺口，而不是等待的理由。必需检查、截图和任何审查者的改动请求仍然保护该分支。

已否决：仅凭检查通过就批准，因为违反规格的改动会未经审查即合并。

## Open questions

- **OQ1 — 哪些指南适用于 Android 和 Windows？**（`human-design`）每个平台的第一个原生组件在合并前需要 FR3 的对应物。
