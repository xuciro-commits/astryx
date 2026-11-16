---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-091
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: proposed
owners: [cixzhang]
affects_architecture: []
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Native templates system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

使用由 Astryx 模板启动的原生应用的人，获得与 Web 模板相同的模板行为：在同样的步骤之后，看到相同的文字、取值、校验和状态。每个原生平台用该平台自己的控件和惯例来绘制模板。

原生模板是面向单一平台的纯源码，带有自己的状态，就像目录模板面向 Web 那样。人从 Astryx 仓库手工把它复制进自己的应用，此后由自己拥有；Astryx 不为原生模板发布任何东西。一个脚本化场景让每个原生模板与其所镜像的 Web 模板保持同步。

## Non-goals

- 哪些模板获得原生版本，以及以什么顺序。
- 组件契约，以及组件在某个平台上如何绘制（`spec:AST-082`、`spec:AST-093`）。
- 通过 CLI 把原生模板复制进应用。
- 保存或同步模板的数据、登录和产品后端。
- 用通用组件树而非模板构建的屏幕。
- 等价的内部实现只要满足本契约，依然有效。

## Requirements

- **FR1 — 原生模板镜像一个目录模板。** 原生模板保存在 `@astryxdesign/native` 源码树中，位于其平台包带版本的模板目录里，例如 `swift-ios-<n>/templates/`，并以 id 指明它所镜像的目录页面模板。
- **FR2 — 原生模板是该平台的纯源码。** 它用本平台的语言保存自己的状态和逻辑，并用该平台的 Astryx 组件绘制（`spec:AST-093`）。它与 Web 模板或其他平台不共享任何模板逻辑、状态，也不共享为模板生成的类型。
- **FR3 — 一个场景让 Web 模板与原生模板保持同步。** 原生模板有一个脚本化场景：每一步是按角色和可访问名称定位的手势，以及该步之后人看到的文字、取值、校验和状态。该场景在目录 Web 模板和每个原生版本上原样重放，且每一步之后各自都显示预期结果。它就是 `spec:AST-082/FR12` 下该模板的场景。场景及其检查与原生模板的源码放在一起，随 `@astryxdesign/native` 的测试运行：破坏它的目录变更会让该原生模板失败，后者随之更新以匹配，而绝不阻塞该目录变更。
- **FR4 — 原生模板不改变目录。** 无论是否有原生模板镜像它，目录模板的源码、元数据和 `astryx template` 输出都相同。`@astryxdesign/core` 或 `@astryxdesign/cli` 中没有任何东西导入原生模板（`spec:AST-082/FR14`）。
- **FR5 — 原生模板不发布任何东西。** 原生模板源码、其测试和其场景被排除在每一个已发布产物之外：npm 包的文件、每个包的导出与入口点，以及每个 Swift 产品；npm 包的 `files` 排除每一个模板目录。它们只作为源码存在于 Astryx 仓库中，由人手工复制进自己的应用，应用在运行时不因原生模板而依赖 Astryx。目录模板则不同：它们随 `@astryxdesign/cli` 发布，并通过 `astryx template` 到达使用者（`architecture:template-authoring/INV8`）。

### Platform support

- 支持的功能/引擎下限：每个原生模板以其平台包的下限为目标，例如 `swift-ios-<n>` 的 iOS 17。Web 下限不变。
- 不支持的行为：某个平台没有某模板的原生版本，就没有它的源码，Astryx 也不会以任何东西代替渲染。
- 浏览器证据：FR3 在浏览器中于目录 Web 模板上重放该场景；原生侧的声明由在设备上进行的同一次重放来证明。

## Current-state impact

- 像 `swift-ios-<n>` 这样带版本的平台包在 main 上尚不存在；唯一的平台包是 `packages/native/apple/`，它不含任何模板。当某个平台包获得模板目录时，FR5 要求 `@astryxdesign/native` 的 `files` 将其排除。
- `@astryxdesign/native` 在每个平台包的模板目录中获得原生模板，每个模板都带一个场景。
- 没有任何目录模板、CLI 命令、已发布产物或架构记录发生变化。
- 目前没有任何原生模板拥有场景。

## Verification

| 契约 | 验证                                                                                        | 代表性状态                   | 变更或失败预期                                                          |
| ---- | ------------------------------------------------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------- |
| FR1  | 原生包检查：每个原生模板都指明一个存在的目录模板                                            | 一个带 iOS 版本的模板        | 某个原生模板指明一个不存在的目录 id                                     |
| FR2  | 对每个原生模板做源码审查和依赖检查                                                          | 某模板的状态、校验和文本     | 某个原生模板导入了与 Web 或另一平台共享的模板逻辑或为模板生成的类型     |
| FR3  | 在目录 Web 模板和每个原生版本上重放场景                                                     | 每个模板场景的每一步         | 任何原生版本或 Web 模板在某一步之后显示不同结果，或某个目录变更被它阻塞 |
| FR4  | 在有和无原生模板两种情况下比较目录与 CLI 输出，并做依赖检查                                 | 每个被原生模板镜像的目录模板 | 目录源码、元数据或复制输出不同，或 core 或 CLI 导入了原生模板           |
| FR5  | `@astryxdesign/native` 的 `npm pack` 文件列表、其 `files` 与导出场，以及每个 Swift 包的产品 | 每个原生模板、其测试和其场景 | 某个打包文件、导出、入口点或 Swift 产品包含或暴露原生模板源码           |

## Decision log

### DEC-1 — The catalog web template stays separate from native templates

**Reference:** `spec:AST-091/DEC-1`

**Decider:** cixzhang, 2026-10-23

原生支持是实验性的，因此目录 Web 模板完全保持原样，原生模板保留自己的状态。让 Web 与原生行为保持一致的是一个对等场景，而不是共享实现，Web 使用方不会因原生工作承担任何变化或风险。

推迟项：由 Web 模板与原生模板共享同一实现，在原生支持离开金丝雀通道时再考虑（`spec:AST-082/FR15`）。

### DEC-2 — Native templates are cloned, and nothing ships for them

**Reference:** `spec:AST-091/DEC-2`

**Decider:** cixzhang, 2026-10-23

模板是人一旦克隆就拥有的起点。应用在运行时为某个原生模板从 Astryx 导入的任何东西，无论是代码还是逻辑，都会变成使用方依赖且 Astryx 必须保持稳定的 API，因此原生模板只是源码。

已否决：由某模板的各原生版本共享的可移植视图模型，因为那是 Astryx 需要发布并维护的模板逻辑。

## Open questions

没有未决问题。
