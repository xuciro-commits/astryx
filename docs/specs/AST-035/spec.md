---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-035
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-10-09
phase: accepted
owners: [josephfarina, cixzhang]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: [contributing:templates, contributing:api-conventions]
affects_consumer_docs: [authoring]
---

# Integration template and component replacement system spec

## Intent

让已安装的集成能够为 Core 模板或 Core 组件提供项目特定的实现，同时不使通用查找产生歧义，也不移除对 Core 原始实现的访问。

## Non-goals

- 替换参考文档主题。该接口面拥有自己的契约。
- 改写使用方已经复制到应用中的模板或组件源码。
- 在其源码或元数据无效时，仍让集成模板或组件可用。
- 选择项目既未配置也未自动链接的集成。

## Requirements

- **FR1 — 模板自行声明其替换目标。** 集成模板可以在自己的元数据中把 `replaces` 设置为一个已有的 Core 模板 id。没有任何包级映射表声明替换（`spec:AST-039/FR11`）。该字段是严格模板元数据对象的一部分，因此 0.6.4 之前的稳定 CLI 会拒绝它；使用该字段的集成必须声明一个 `@astryxdesign/cli` peer 范围，其最低可接受版本至少为 0.6.4，即第一个应用该字段的稳定版本（DEC-7）。
- **FR2 — 有效的替换接管默认发现。** 当一个有效声明生效时，无修饰的模板查找与默认模板投影必须针对该 Core id 使用集成模板。该集成模板必须仍可通过自己的 id 寻址。列表、搜索、构建建议、Project 发现以及块布局查找必须投影同一个胜出者。
- **FR3 — 显式的包选择保留替代项。** 选择 `@astryxdesign/core` 必须寻址原始的 Core 模板。选择某个集成包必须保留通过其自身 id 访问被遮蔽或被拒绝的模板的能力。
- **FR4 — 无效声明采用失效关闭（fail closed）。** 缺少 Core 目标、模板类型不匹配、在无法使用的模板上出现声明，或同一包内对同一目标存在多于一个声明，都必须报错。无效的集合不得替换 Core。当仅替换元数据无效时，有效的集成模板仍可通过各自的 id 使用。
- **FR5 — 优先级是确定性的。** 当多个显式配置的集成均有效替换同一目标时，后配置的集成胜出，CLI 会报告一条警告。显式配置的替换必须优先于自动链接的替换。当只有自动链接的集成有效替换同一目标时，在 package.json 中后列出的依赖胜出并附带警告；在 `astryx.config` 中点名预期的包可使优先级显式化。无效的自动链接声明仍会报告，但不得禁用有效的显式替换。
- **FR6 — 省略该字段时，有效集成的选择行为保持不变。** 不设置 `replaces` 时，有效的模板选择与包感知的歧义处理保持不变。无论有无该字段，FR9 都会有意改变故障隔离。
- **FR7 — 诊断在支持开始之前保留已发布的契约。** 现有的同 id 冲突必须在整个 0.6.x 期间保持已发布的仅警告响应形状。替换专用的诊断可以为发布前验证而实现，但其 `relationship`、可选的 `replaces` 以及 `severity: 'info'` 字段直到 0.7.0 才进入稳定冲突 API。到达 0.7.0 不得仅凭版本号扩展 schema：一次有意的投影变更必须同时更新响应类型、生成的参考文档、终端输出、使用方文档与测试。从该受支持的边界开始，`astryx doctor integration templates` 必须报告有意替换、缺失目标、在无法使用的模板上的声明、类型不匹配以及同包歧义。错误发现必须产生退出码 1，且其后不得跟随虚假的成功消息。
- **FR8 — 公共 schema 投影在其受支持的边界上是完整的。** 有效的 `template.list` 条目可以包含可选的 `replaces`；添加该可选字段是非破坏性的。在 0.7.0 及之后，一次显式的投影更新必须同时改变响应类型、生成的清单、终端投影、使用方文档与测试；仅提升包版本必须让仅警告的响应保持不变。
- **FR9 — 故障隔离保留有效的贡献项。** 某一贡献类型的错误必须仍可报告，同时不移除该集成其他有效的贡献类型。在模板与组件发现中，一个不可用的文件不得移除有效的同级项。其他类型保持其现有的按类型原子性。清单加载失败仍会撤回该集成，因为此时没有任何贡献根是可信的。无论是否有模板声明 `replaces`，本规则都适用。
- **FR10 — 组件自行声明其替换目标，并由 CLI 下限开启。** 集成组件可以在自己的 ComponentDoc 中把 `replaces` 设置为 Core 组件目录中某个组件的精确 `name`。仅当该组件所在的包声明了一个 `@astryxdesign/cli` peer 范围、且其最低可接受版本至少为第一个应用组件替换的稳定 CLI 版本（`COMPONENT_REPLACES_CLI`）时，替换才会生效。该范围即为该包的选择加入（opt-in）。在该版本之前的稳定 CLI 会接受该字段，并让组件保留自己的名称。
- **FR11 — 已应用的组件替换接管无修饰的组件查找。** 替换组件在组件详情与批量选择器中以 Core 组件的名称应答，在每个组件列表详情层级上占据 Core 组件的位置，是该名称对应的组件搜索结果，是无修饰的 `swizzle <Name>` 所复制的组件，也是 gap-report 路由为该名称发送报告的目标。它仍可通过自己的名称寻址。上述每一项结果都会标明替换组件自己所属的包（`architecture:cli-surface` INV28）。
- **FR12 — 显式的 Core 选择保留原始组件。** 在组件详情、批量选择器与 swizzle 中选择 `@astryxdesign/core` 必须寻址原始的 Core 组件。`swizzle --list` 列出 Core 的组件，其中包含被替换的那个。
- **FR13 — 对于选择加入的包，无效的组件声明采用失效关闭。** 对于具备 FR10 范围的包，以下情形每一种都必须在 `astryx doctor integration components` 中报错，随后该命令以 1 退出：`replaces` 未指向任何 Core 目录组件；值不是非空字符串；组件自身的名称是另一个 Core 组件；包内对同一目标存在多于一个声明。无效的集合不得替换 Core。有效组件仍可通过各自的名称使用（FR9）。
- **FR14 — 组件优先级是确定性的。** 当多个具备 FR10 范围的包均有效替换同一 Core 组件时，由 FR5 的顺序决定胜出者：显式配置的包优先于自动链接的包；在显式配置的包之间，后配置的包胜出；在自动链接的包之间，后列出的依赖胜出。只要多于一个包参与竞争，Doctor 就会警告。无效的自动链接声明不得禁用有效的显式替换。来自另一个包的集成组件，若其自身名称正是被替换的 Core 名称，则在无修饰查找中被遮蔽，仍可通过其所属包寻址，且 Doctor 会警告。
- **FR15 — 未达到下限的包保持其已发布的行为。** 其组件的 `replaces` 声明永不生效，加载该包的应用不会因此看到任何新的输出。关于它们的每一项发现，包括点名 FR10 范围的那一项，都是由 `astryx doctor integration components` 报告给包作者的警告，因此任何命令的结果或退出码都不会因它们而改变。当某个组件设置了 `replaces` 而该包的范围允许更早的稳定 CLI 时，`integration pack --check` 会警告，且永不失败。

### Platform support

- 对于模板声明了 `replaces` 的集成，最低受支持的 CLI 为：`@astryxdesign/cli >=0.6.4`。更早的稳定 CLI 会严格解析模板元数据：它们拒绝该字段、打印一条警告、丢弃该模板，并扣留该包的文档主题，而该包的其他模板与其组件仍会加载。
- 稳定版 0.6.x 的冲突响应保留其仅警告的形状。替换专用的冲突 schema 在 0.7.0 才有资格进行显式、完整的投影更新；仅凭版本号不会激活它。
- 组件替换：`@astryxdesign/cli >=0.6.7` 既是受支持的最低 CLI，也是选择加入的门槛（FR10）。更早的稳定 CLI 接受组件的 `replaces`，并让该组件保留自己的名称，同时 Core 组件仍被选中。
- 浏览器证据：不适用于目录选择。当使用方生成的应用所选模板渲染由集成提供的导航时，该应用仍必须能够构建或运行。

## Current-state impact

模板元数据类型与解析器接受一个可选字段 `replaces`。共享的模板解析负责替换校验、优先级、别名以及默认发现视图。模板命令、search/build、Project、布局、Doctor、响应文档以及集成创作指南都会投影该结果。Project 报告无效的贡献项，同时保留其他有效的贡献类型以及有效的模板或组件同级项。

该字段是可选的，有效的模板在其缺席时保持原有选择行为。自 0.6.4 起的稳定版本会应用已声明的替换，使用替换的集成包需要 `@astryxdesign/cli >=0.6.4`，该范围排除了所有拒绝该字段的稳定版本。模板胜出者是可变目录数据，因此替换选择不会造成任何已发布的使用方受损。可选的 `TemplateListEntry.replaces` 字段是增量式的。

已发布的 `IntegrationTemplateConflict` 响应则不同：现有的同 id 冲突已经稳定。最终的 0.6.x 保留其仅警告的形状。必需的 `relationship` 字段与 `severity: 'info'` 值仍为在 0.7.0 及之后进行的一次有意的完整投影更新而处于暂存状态。仅提升包版本会让仅警告的投影维持原状。依据 `spec:AST-017/FR1`、FR2、FR5、FR7 与 FR9–FR13，该能力连同其兼容性门槛属于 `[feat]` 补丁，而非破坏性的次版本变更。

组件发现会从每个有效的组件文档中读取 `replaces`，并由同一个解析器决定组件替换、优先级与发现项。组件详情、批量选择器、每个列表详情层级、搜索、swizzle 复制、gap-report 路由、Project 问题以及 `astryx doctor integration components` 都读取它的结果。在 `COMPONENT_REPLACES_CLI` 之前的稳定 CLI 版本接受组件的 `replaces` 并忽略它。范围允许其中之一的那类包会保留其组件的名称，Core 组件仍被选中，加载它的应用不会看到新的输出，其作者会在包检查中看到警告。范围起点已经更晚的包（例如更早的 `integration add theme` 与 `integration add doc --parent` 所写入的 `>=0.7.0`）则原样选择加入；其范围排除了所有忽略该字段的 CLI，因此没有任何受支持的组合发生变化。依据 `spec:AST-017/FR1`、FR5 与 FR12，组件替换属于 `[feat]` 补丁。

## Verification

| Contract   | Verification                                                                   | Representative states                                                              | Mutation or failure expectation                                                |
| ---------- | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| FR1, FR6   | 模板解析器与发现测试、下限表测试、已发布 CLI 的使用方运行                      | 字段存在、字段缺失、已发布的 0.6.3 与 0.6.4 CLI、peer 范围处于下限及低于下限       | 替换从模板自身元数据以外的任何位置被采纳，或校验接受了低于下限的范围           |
| FR2, FR3   | 模板 API/CLI 与真实使用方应用的测试                                            | 目标 id、自身 id、Core 包、集成包                                                  | 查找变得有歧义，或 Core 原始实现无法访问                                       |
| FR4, FR7   | Doctor 与发现测试，外加一个 0.6.x 响应形状测试夹具                             | 缺少本地文件/源码、缺少目标、类型错误、重复、同 id 拒绝、发布前替换                | 无效元数据激活了替换、Doctor 报告成功，或 0.6.x 冲突获得了暂存字段             |
| FR5        | 多集成与自动链接测试                                                           | 配置顺序、显式与自动链接的对比、无效的落败者                                       | 文件/显示顺序决定了胜出者，或无效的自动链接禁用了显式意图                      |
| FR2, FR8   | 列表、search/build、Project、布局、响应与生成文档检查                          | 别名加上未声明的精确 id 冲突、页面与块、显式的 0.7 schema 投影                     | 两个投影不一致、某个公共字段缺少文档，或仅凭版本号扩展了冲突 schema            |
| FR9        | Project 发现与问题顺序测试                                                     | 无效的组件/模板同级项、有效的贡献类型与同级项                                      | 一个坏贡献移除了无关的有效输出                                                 |
| FR10, FR15 | 下限表测试、解析器测试，以及已发布 CLI 的使用方运行                            | 范围处于下限、无范围、更低的范围；带该字段的最新稳定 CLI                           | 未设置该范围的包获得了替换、产生错误，或退出码发生变化                         |
| FR11, FR12 | 组件、批量、列表、搜索、swizzle 与 gap-report 测试，外加一次打包后的使用方运行 | 目标名称、自身名称、Core 包选择器、每个列表详情层级                                | 某个接口面选出的所有者与组件详情不同、某项结果遗漏了所有者包，或 Core 无法访问 |
| FR13       | 解析器与 `doctor integration components` 测试                                  | 缺少目标、无效值、自身名称是另一个 Core 组件、一个包内有两个声明                   | 无效元数据替换了 Core，或 Doctor 在存在错误发现时以 0 退出                     |
| FR14       | 多集成解析器测试                                                               | 配置顺序、显式与自动链接的对比、仅自动链接、无效的自动链接落败者、被遮蔽的同名组件 | 文件或显示顺序决定了胜出者，或无效的自动链接声明禁用了显式意图                 |

## Decision log

### DEC-1 — Replacement declarations live on the integration manifest

**Reference:** `spec:AST-035/DEC-1`
**Proposed by:** `josephfarina`, `2026-09-11`
**Superseded by:** `spec:AST-035/DEC-3` and `spec:AST-039/DEC-4`, `2026-09-24`

在集成清单上使用 `templateReplacements: Record<integrationTemplateId, coreTemplateId>`。这样可以让意图显式化。自 0.5.3 起的 CLI 在字段未知时会忽略它，而不会拒绝已理解的贡献；使用该字段的集成不得声称兼容 0.5.2 或更早版本。受支持的集成用法从 0.7.0 开始；实现可以更早发布以进行前向验证。

已否决：直接向 `TemplateDoc` 添加 `replaces`。在该字段之前发布的 CLI 会拒绝严格的元数据对象，使集成模板不可用，而不是干净降级。

### DEC-2 — Explicit project configuration owns replacement precedence

**Reference:** `spec:AST-035/DEC-2`
**Proposed by:** `josephfarina`, `2026-09-11`

当多于一个显式配置的包替换同一目标时，使用配置顺序，并优先采用任何显式替换而非自动链接。这使使用方编写的配置保持权威，同时让有效的冲突确定且可见。

已否决：把每一处跨包替换都变为歧义。那会阻止使用方按声明的顺序有意组合多个集成。同样否决：仅因为自动链接稍后被追加到发现流程中，就让其覆盖显式配置。

### DEC-3 — A template declares its own replacement

**Reference:** `spec:AST-035/DEC-3`
**Proposed by:** `josephfarina`, `2026-09-24`

把 `replaces` 放在集成模板自己的元数据中。每个集成项都把自己的逐项元数据保留在自己的描述文件中（`spec:AST-039/FR11`），而文档主题已经用同一个字段声明替换。代价是：0.6.4 之前的稳定 CLI 会拒绝这个未知字段、丢弃该模板，并扣留该包的文档主题，而在清单映射方案下它本可以回退到按自身 id 访问。集成主题、section id 与命名空间文档本来就需要 0.6.4 的 CLI，因此这并未新增任何类型的破坏；使用 `replaces` 的集成在 DEC-7 中声明 CLI 下限。

已否决：在清单中使用 `templateReplacements`（DEC-1）。它是逐项数据的中央目录，而 `spec:AST-039/FR11` 对每一种类型都禁止这种做法。

### DEC-4 — Pre-publication replacement support is patch-compatible

**Reference:** `spec:AST-035/DEC-4`
**Decider:** `josephfarina`, `2026-09-29`
**Superseded in part by:** `spec:AST-035/DEC-7`, `2026-10-09`

在受支持的 0.7.0 集成包边界之前，集成模板替换并不是完全发布的 API。因此，在最终的 0.6.x 中交付其实现属于增量式且补丁兼容的：不存在任何有效的、最新稳定版集成使用方，其受支持行为会发生变化。模板胜出者是可变目录数据，且可选的列表字段是增量式的。

这并不放松围绕该未发布能力的稳定 CLI schema。现有的同 id `IntegrationTemplateConflict` 响应在整个 0.6.x 期间保持其仅警告的形状。在 0.7.0 及之后，替换专用的 `relationship`、`replaces` 与 `severity: 'info'` 需要一次横跨运行时、类型、生成的参考文档、终端输出、文档与测试的有意投影变更；仅凭版本号不会激活它们。使用 `replaces` 的集成包仍需要 `@astryxdesign/cli >=0.7.0`，从而保护更早的严格元数据读取器。

已否决：仅仅因为其未来 schema 不同就把未发布的替换行为称为破坏性变更；在 0.6.x 中暴露扩展后的冲突 schema；或在受支持的包边界与稳定 schema 适配器已经保护已发布使用方的情况下，对所有替换实现加以门控。

### DEC-5 — A component declares its own replacement, and the CLI floor is the opt-in

**Reference:** `spec:AST-035/DEC-5`
**Decider:** `josephfarina`, `2026-10-07`

组件的 `replaces` 放在它自己的 ComponentDoc 中，正如模板所做的那样（DEC-3）。在下限之前的稳定版本接受该字段并记录替换而不应用它，因此一次性应用所有声明会改变那些范围允许这些版本使用的包的选择结果。仅当某个包的 `@astryxdesign/cli` peer 范围从第一个应用组件替换的版本开始时，CLI 才会应用该包的组件替换。范围允许更早 CLI 的包保持其行为；起点已经更晚的范围（例如 `>=0.7.0`）排除了所有忽略该字段的 CLI，因此没有任何受支持的组合发生变化。新包获得一个已有文档记录的开关，而它们本就为其他功能管理着这个开关。

已否决：立即应用每一个已声明的 `replaces`——这会在包未请求的情况下改变已发布的选择结果。
已否决：增加应用配置键——包已经声明了自己的意图，而 `spec:AST-017/FR19` 仅在证据充分时才允许配置。

### DEC-6 — Component replacement uses template replacement's precedence and failure rules

**Reference:** `spec:AST-035/DEC-6`
**Decider:** `josephfarina`, `2026-10-07`

同一个解析器把 FR4、FR5 与 FR9 连同 FR13 的组件专用检查应用到组件上，每个组件接口面都读取它的结果。集成作者只需为两种类型学习一套规则，并且任意两个组件接口面都不会就胜出者产生分歧。

已否决：按接口面分别解析——组件、搜索与 swizzle 会逐渐彼此偏离。

### DEC-7 — The template replacement floor is the first release that applies it

**Reference:** `spec:AST-035/DEC-7`
**Decider:** `josephfarina`, `2026-10-09`

模板设置了 `replaces` 的集成应声明一个从 0.6.4 开始的 `@astryxdesign/cli` peer 范围，取代 DEC-4 的 `>=0.7.0`。已发布的 0.6.4 至 0.6.7 会对已声明的替换应用 FR2 与 FR3，而已发布的 0.6.3 及更早版本会拒绝该字段。若某一下限没有任何已发布版本满足，则 npm 会在安装该包的应用中让 CLI 保持未安装状态。从 0.6.4 起，`replaces` 声明、替换选择以及可选的列表投影都是 `spec:AST-017/FR24` 下的已发布接口面；扩展后的冲突字段在 0.7.0 及之后 FR7 与 FR8 的投影变更之前仍处于发布前状态。

已否决：在 0.7.0 发布之前一直保留 `>=0.7.0`，因为 npm 会在 0.6.x 上安装此类包的应用中移除 CLI。

## Open questions

无。
