---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-039
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: implementing
owners: [josephfarina]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: [contributing:cli-conventions]
affects_consumer_docs: [authoring]
---

# Integration contribution descriptor system spec

## Intent

Astryx 集成所提供的每一项可发现项，都在它所描述的那一项旁边拥有一份本地、强类型的描述。贡献者无需编辑包内其他位置的第二个目录，就能理解、编写、校验、移动并打包单个项。

规范描述符是 `<source-stem>.doc.mjs`。它是逐项元数据的唯一来源。集成清单定位贡献根并持有集成级能力；它不对某个根之下的项进行编目。任何位置都不存在任何形式的项的中央目录（FR11）：0.6 曾误为主题发布过一个，后来不得不将其作为破坏性变更移除。

## Non-goals

- 在正常的破坏性变更与迁移流程允许之前，移除已发布的兼容读取器。
- 把 `debug` 或 `gapReport` 这类运行时集成特性变成项贡献。它们带类型的命名导出契约仍由 `spec:AST-031` 拥有。
- 把构建回执、生成产物清单或使用方运行时数据放进编写描述符。
- 对 `.doc.mjs` 本身就是完整载荷的参考文档，要求单独的可执行源文件。
- 在发现过程中执行贡献的源，以获知其元数据。

## Requirements

- **FR1 — Every discoverable item owns one canonical descriptor.** 新的或新编写的组件、模板、主题、文档主题、codemod 或未来的项贡献，必须恰好拥有一份 `<source-stem>.doc.mjs` 描述符。当该项有主源文件或载荷文件时，描述符必须位于它旁边，并且必须使用相同的词干。参考文档既是描述符也是载荷。
- **FR2 — Descriptors are strongly typed authoring modules.** 每种描述符类别都必须从 `@astryxdesign/cli/authoring` 导出一个公开的 TypeScript 类型，在 JSDoc 注解中使用该类型，并通过该类别的规范导出暴露其值（新的描述符类别使用带标记的默认导出）。发现流程必须在加载边界上，通过该类别公开的编写解析器解析已加载的值。新的类别若缺少其类型、解析器、自文档和解析器测试，就是不完整的。
- **FR3 — The descriptor is the sole item-metadata authority.** 逐项名称、标签、描述、就绪或维护状态、源关系以及复制元数据，不得重复出现在根 JSON 目录、`astryx.integration.*` 中的数组或任何其他包级注册表中。集成清单可以定位根，并声明集成级元数据或运行时能力。它不得枚举某个根之下的项。逐项选项（例如 `replaces` 和 `extends`）属于该项自己的描述符。
- **FR4 — Pair identity is structural.** 配对身份是结构性的。当该关系是结构性的时候，发现流程必须从共享的描述符/源词干推导出主源路径以及任何与源绑定的运行时导出身份。描述符拥有稳定的公开项身份。组件描述符的 `name` 就是它所记录的运行时导出：当同词干源中没有以该词干命名的运行时导出时，该 `name` 可以指向该源的另一运行时导出，发现流程以该名称记录该组件。组件描述符在 `components` 中列出的每个完整条目，在该描述符的 import 所指名的模块导出它时，就是以其自身名称存在的一个组件。当 pack 生命周期写入该 import 所指名的文件时，`integration verify` 会按发现流程在 pack 之后列出的成员来比较该描述符。每个表面（FR7）都按这些名称列出、查找并校验这些组件，而导出自身词干的源保留该词干。仅以这种方式被记录的名称，不得抢占 Core、旧版文档包或以自身源命名的组件能够回答的精确无作用域查找；以另一名称记录的描述符的词干，对 Core 和对以自身源命名的组件同样让位：除非已声明的替换占用了该名称，此类查找返回该所有者的组件；限定到包的查找返回包内的组件；而 Doctor 会报告 Core 也共享的已记录名称。精确名称（包括以这种方式发现的名称）优先于 Core 的关键词回退。发现流程必须拒绝缺失的源、多于一个符合条件的同词干源、无效的推导导出名，或编写的身份与要求的目录身份冲突的描述符。当模板的显示名称包含它所展示组件的每个词时，该模板也响应其显示名称；仅有一个变体标签则不行。
- **FR5 — Multi-file items have one confined ownership boundary.** 多文件项拥有一个受约束的所有权边界。若某类别的项需要嵌套的源、令牌、调色板、资产或回执文件，该类别必须定义单一的项本地复制与打包边界。发现与编写必须在没有第二个目录的情况下枚举该边界，将每条路径保持在其内部，并复制完整的已拥有集合。缺失的本地依赖、越界的路径以及意外的符号链接目标，必须在向使用方写入之前失败。
- **FR6 — Discovery does not execute contributed payload source.** 发现流程不执行贡献的载荷源。加载描述符遵循既有的文档模块边界。可执行的组件、主题、模板与 codemod 载荷，必须在发现过程中以不运行它们的方式被检查或解析。当运行时绑定是契约的一部分时，静态校验必须拒绝仅类型导出或缺失的运行时导出。
- **FR7 — One discovery seam serves every downstream surface.** 单一的发现接缝服务于每个下游表面。列举、包所有权、歧义处理、编写校验、Doctor、包清单、打包后使用方校验以及物化，都必须消费同一个归一化的已发现记录。写入器必须通过该接缝校验其输出，而不是重新实现该格式。
- **FR8 — Authoring emits only the canonical form.** 编写只产出规范形式。`astryx integration add` 及其带类型的 API 必须写出 `.doc.mjs`、公开的 JSDoc 类型注解以及约定的导出。它们不得创建新的旧版别名、中央项目录、无类型对象或重复的元数据来源。
- **FR9 — Released aliases are compatibility inputs, not authoring precedent.** 已发布的别名是兼容性输入，而非编写先例。在兼容性策略要求期间，读取器可以保留已发布的替代后缀或合并模块。新的写入器与示例必须使用规范描述符。每个保留的别名都必须被隔离、作为兼容路径进行测试，并排除在新贡献类别的设计之外。仅在金丝雀中发布的格式不主张兼容性。
- **FR10 — Theme registration is the first clean application.** 主题注册是第一个干净的应用。主题根按每个 lower-kebab 短名包含一个目录。该目录包含一个主题源和必需的 same-stem `.doc.mjs`。`ThemeDoc` 拥有 `name`、`displayName`、`description` 和 `maintained`；源入口与命名的运行时导出来自共享词干。该目录是递归复制与打包边界。`themes/manifest.json` 不得作为回退读取器保留。该目录随稳定版 `0.6.3` 发布，因此其移除属于破坏性变更：该移除在一个次版本中发布，并附带一个 codemod，将每条目录项转换为该主题的描述符；仍持有该目录的主题根会以一条指明迁移的消息失败。
- **FR11 — Never catalog items centrally.** 绝不要集中编目项。任何变更都不得为任何类别新增：某个根之下列出该根各项的文件（`themes/manifest.json`、`components/index.json` 或类似文件）、`astryx.integration.*` 中的逐项映射或列表（例如模板替换的映射或主题列表），或由作者手工保持同步的注册表。新增一个项不得改变其同级项共享的文件；只有集成清单和 `package.json` 可以改变，以声明新的根。审查必须拒绝新增中央目录的变更，写入器测试必须在出现此类目录时失败。
- **FR12 — Documented component props agree with the source.** 文档化的组件 props 与源一致。由 `architecture:cli-surface` INV33 治理。
- **FR13 — Every descriptor satisfies its published authoring type.** 每份描述符都满足其已发布的编写类型。由 `architecture:cli-surface` INV34 治理。
- **FR14 — One command checks an integration, and can gate its build.** 一条命令检查一个集成，并可为它的构建设置门禁。由 `architecture:cli-surface` INV35 治理。

### Compatibility transition

最后一条规则适用于每个类别。既有的已发布输入向它迁移，而不会假装它们从未发布过：

- 组件与参考文档已经使用 `.doc.*`；新的编写收窄为强类型的 `.doc.mjs`，而已发布的后缀保持可读；
- 模板保留其已发布的 `.template.*` 读取器，但新的编写与示例使用已支持的 `.doc.mjs` 配对；
- 主题以破坏性变更替换随 `0.6.3` 发布的 JSON 目录：不保留双读取器，并由 codemod 转换每个包；
- 合并的 codemod 模块与内联 `agentDocs` 仍是已发布的兼容性输入，直到其配对描述符迁移发布为止；它们不允许其他贡献类别省略描述符。

## Current-state impact

本规格拥有一个当前任何系统规格都未覆盖的独立边界。`spec:AST-031` 明确排除默认清单的项贡献，而 `architecture:cli-surface` 描述了实现，却无法授权新的跨类别编写规则。

本规格用一份必需的逐主题描述符替换 `architecture:cli-surface/INV19` 中的目录主张。它向 CLI 架构与贡献者检查清单新增一条通用的描述符不变式。主题变更会更新公开编写类型、发现、内置资产、集成编写、包清单、打包校验、使用方文档，以及真实的提供方到使用方测试。

该契约不改变 `DefineThemeInput` 或 `DefinedTheme`。主题包元数据保持在 Core 运行时编写之外，与 `architecture:theme-authoring-contract/INV11` 一致。

## Verification

| 契约    | 校验                                                                                                | 代表性状态                                                                                                                 | 变更或失败预期                                                                                                                                            |
| ------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1–FR4 | 编写解析器、发现与写入器测试                                                                        | 有效配对；缺失或重复的源；错误的身份；格式错误或缺失的文档                                                                 | 缺少其带类型同词干描述符的源变得可见，或重复的元数据可以胜出                                                                                              |
| FR4     | 发现、查找、搜索、Doctor 与 pack-check 测试                                                         | 一份文档指向其文件的另一导出；一个文件导出其词干；一个 import 导出的家族成员；一个它未导出的；一个 Core 也拥有的已记录名称 | 某个表面漏掉组件的名称、以文件命名的文档读取方式不同，或 Core 能够回答的无作用域查找返回了另一个包的组件                                                  |
| FR5–FR7 | 贡献清单、pack-check、物化与真实世界集成测试                                                        | 嵌套文件；符号链接或越界；缺失的 import；本地对打包后；重复的包 slug                                                       | 嵌套文件被遗漏、越界文件被复制，或两个表面在所有权上不一致                                                                                                |
| FR6     | 静态源图与运行时导出测试                                                                            | 直接导出；再导出；仅类型导出；源副作用                                                                                     | 发现流程执行了源，或接受了无运行时绑定的情况                                                                                                              |
| FR8–FR9 | integration-add 快照与兼容性测试夹具                                                                | 新的写入器输出；已发布的模板、codemod 或 agent 指导输入                                                                    | 写入器产出了无类型或非 `.doc.mjs` 的项，或兼容读取器成为新的规范形式                                                                                      |
| FR10    | 内置主题、集成主题与提供方到使用方测试                                                              | 全部内置主题；多主题包；list/add/build；无 JSON 目录                                                                       | 移除主题文档后仍通过，或恢复 `manifest.json` 变得必要                                                                                                     |
| FR11    | integration-add 写入器测试；目录 codemod 测试                                                       | 某类别的第二个项；残留的 0.6 目录                                                                                          | 新增项写入了共享文件，或残留目录被读取而非被拒绝                                                                                                          |
| FR12    | prop 漂移单元测试；`doctor integration components` 测试；覆盖每份已发布组件描述符的仓库测试         | 每种发现类型；写法不同但相等的类型；在另一个包中声明的 props；未安装 TypeScript                                            | 被移除或重命名的 prop 或变更的联合类型未经报告就通过，或缺失编译器被读作通过                                                                              |
| FR13    | 文档类型单元测试；`doctor integration validate` 测试；覆盖每份已发布描述符与译文的仓库测试          | 每种发现类型；被未知字段遮挡的字段；位于另一类别根中的描述符；指向另一类型的注解；未安装 TypeScript                        | 未知、缺失或类型错误的字段未经报告就通过，或缺失编译器被读作通过                                                                                          |
| FR14    | 带与不带 `--strict` 的 `integration check` 文本与 JSON 测试；列出所有使其失败的发现的测试；搜索测试 | 一个干净的包；仅有警告；某次检查中有错误；无清单；跳过的比较；搜索 ci                                                      | 默认退出码与某次检查自身的退出码不同、警告或跳过的比较通过了 `--strict`、文本与 JSON 的退出码不同、新增了失败发现而清单未变，或搜索 ci 未能最先找到该命令 |

## Decision log

### DEC-1 — Use one typed same-stem descriptor per contribution item

**Reference:** `spec:AST-039/DEC-1`

**Decider:** `joeyfarina`, `2026-09-12`

贡献的描述应当放在它所描述的源或载荷旁边。一个带类型的模块让编辑器与 CLI 获得同一契约，使该项可作为整体移动，并防止根目录偏离源。集成清单仍是根定位器与集成能力边界。

已否决：中央 JSON 目录。它制造了一种仅用于主题的编写语言，重复了源身份，并让 CLI 接受了一种不遵循仓库 `.doc.mjs` 约定的格式。

已否决：在 JSON 目录之上叠加可选描述符。两个元数据来源需要优先级与漂移规则，并且保留了该设计缺陷。

### DEC-2 — Infer theme source identity and own the whole theme directory

**Reference:** `spec:AST-039/DEC-2`

**Decider:** `joeyfarina`, `2026-09-12`

主题源与描述符共用一个词干。该词干标识入口与必需的命名运行时导出。lower-kebab 父目录与 `ThemeDoc.name` 在 CLI slug 上保持一致。完整的主题目录（包括其描述符）是复制与打包边界，因此嵌套文件不需要编写的允许列表。

已否决：把 `entry`、`exportName` 和 `files` 继续带进 `ThemeDoc`。这些字段重申了发现流程可以直接证明的结构，并在每个文件中重建了该目录。

### DEC-3 — Preserve released readers without weakening new authoring

**Reference:** `spec:AST-039/DEC-3`

**Decider:** `joeyfarina`, `2026-09-12`

稳定版 `0.6.0` 已经读取先于本规则存在的模板、codemod 与内联 agent 指导形式。兼容读取器保留到其正常迁移路径允许移除为止。所有新的写入器与新贡献类别立即使用规范描述符。误随稳定版 `0.6.3` 发布的主题目录不获得兼容读取器；它作为破坏性变更随 codemod 一起移除（DEC-4）。

已否决：把每种历史形式都视为永久且同等的约定。为兼容而保留的读取器并不定义编写系统接下来应当创建什么。

### DEC-4 — No central catalog or manifest map, for any kind

**Reference:** `spec:AST-039/DEC-4`

**Decider:** `joeyfarina`, `2026-09-24`

`integration add theme` 在 0.6 中写出的主题目录是个缺陷：它把逐项细节放进一个中央文件，违背了其他每个类别都遵循的规则。它在任何人发现之前就进入了稳定版 `0.6.3`。它被作为破坏性变更移除，并附带转换每个包的 codemod，而 FR11 现在彻底禁止该模式，以免任何类别重蹈覆辙。

这取代了 `spec:AST-035/DEC-1`——一份把模板替换保留为集成清单中映射的草稿：模板的 `replaces` 属于其自己的描述符。

已否决：仅为替换保留的清单映射。它是同一个中央目录，只是一次一个字段地出现。

## Open questions

无。
