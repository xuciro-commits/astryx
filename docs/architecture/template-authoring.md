---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:template-authoring
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [josephfarina, cixzhang]
applies_to:
  [
    packages/cli/assets/templates/,
    packages/cli/authoring/doctypes/template/,
    packages/cli/foundation/discovery/template-adapter.mjs,
    packages/cli/foundation/config/project.mjs,
    packages/cli/api/template/,
    apps/docsite/src/components/templateComponents.ts,
    apps/docsite/scripts/generate-data.mjs,
    scripts/sync-templates.js,
  ]
verified_by:
  [
    packages/cli/authoring/doctypes/template/parse.test.mjs,
    packages/cli/foundation/discovery/template-adapter.test.mjs,
    packages/cli/foundation/config/project.test.mjs,
    packages/cli/api/init/init.test.mjs,
    packages/cli/api/template/template.test.mjs,
    packages/cli/api/template/template-integration.test.mjs,
    packages/cli/api/template/template-suffix.test.mjs,
    packages/cli/clients/cli/e2e-smoke.test.mjs,
    apps/docsite/src/__tests__/data-extraction.test.ts,
  ]
deciding_specs: [spec:AST-017/DEC-2]
---

# Template authoring architecture

## Purpose

Astryx 模板是可复制的起点。页面模板搭建完整的内容表面。块模板提供聚焦的模式和组件示例。本记录负责它们的源形态、目录身份标识、验证边界、使用方投影以及复制语义。

它不复制贡献者说明或内部审计发布工作流。随附的模板质量指南负责公开评分标准，公开贡献者指南则链接到该来源。

## System model

### Shipped state

Astryx 随附两种模板类型。展示是块持有的一种角色，而不是第三种类型。

| 类型或角色 | 当前源形态                                                                                | 当前身份标识与用途                                    |
| ---------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 内置页面   | `pages/<slug>/page.tsx` 加上 `template.doc.mjs`                                           | 目录 slug 就是 CLI id。该页面是完整的路由起点。       |
| 内置块     | `blocks/` 下成对的 `<Name>.tsx` 和 `<Name>.doc.mjs`                                       | 文件名主干就是 CLI id。该块是聚焦的示例或可复用模式。 |
| 外部块     | 通过 `astryx.blocks` 声明的包下相同的成对文件                                             | 包、类型和文件名主干共同标识该条目。                  |
| 集成模板   | 配置的集成 `templates` 根目录下成对的 `<id>.tsx` 和 `<id>.template.*` 或旧式 `<id>.doc.*` | 包、类型和相对于根目录的 id 标识该条目。支持嵌套 id。 |
| 主展示     | 带有 `isShowcase: true` 的块                                                              | 为其 `exampleFor` 目标提供主示例。                    |
| 次展示     | 在 `alsoShowcaseFor` 中命名目标的块                                                       | 为额外的组件或 hook 页面复用与主示例相同的源。        |
| 额外示例   | 在 `alsoExampleFor` 中命名目标的块                                                        | 在额外的 Examples 章节中复用相同的源。                |

`name` 和 `displayName` 是面向人的标签，而不是目录身份标识。它们可以重复。可解析的身份标识是 `(package, type, id)`；调用方会收窄跨包或跨类型存在的 id。

已发布的加载器尚未共享同一个验证边界：

- 内置页面直接加载元数据，并为某些缺失值提供默认值。
- 内置块和外部块要求成对的源文件，但除此之外直接加载元数据，并为某些缺失值提供默认值。
- 集成模板经过 `parseTemplate()` 处理，并报告缺少源、加载错误或信封（envelope）错误。

已发布的使用方也收集不同的集合：

- `discoverAll()` 为模板 API、搜索和布局提供数据。
- `Project.templates()` 为项目诊断和去重独立重新收集集成模板。
- `listTemplates()` 返回每个内置页面目录而不读取元数据；程序化 `init` 在应用指定的起始页面时使用该列表。
- 沙箱和 docsite 独立生成元数据/源注册表。
- docsite 总览读取生成的元数据，而实时页面预览依赖 `templateComponents.ts` 中单独手工维护的懒加载映射。

复制会把源输出到采用它的项目中。它不会与目录保持实时关系，后续模板版本也不会重写已复制的项目。

### Normalized catalog contract

在本记录成为 `current` 之前，每个源都必须规范化为一个目录条目，并通过同一个验证边界。该边界使用以下要求：

| 范围     | 必需                                                                                                     | 可选或条件性                                                          |
| -------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 每个条目 | `id`、`package`、`type`、`name`、`displayName`、非空的 `description`、显式的 `isReady`，以及存在的源文件 | `keywords`；源特定的来源信息和诊断                                    |
| 页面     | 上述所有内容；有资格进入总览时还须 `category`                                                            | `scaffold`、`isHiddenFromOverview`；隐藏的专用页面可以省略 `category` |
| 块       | 上述所有内容，加上 `exampleFor`、正的 `aspectRatio` 和完整的 `componentsUsed`                            | `scale`、`isShowcase`、`alsoExampleFor`、`alsoShowcaseFor`            |
| 主展示   | 块的要求加上 `isShowcase: true`；每个 `(package, target)` 最多解析出一个主展示                           | 同一个块可以通过 `alsoShowcaseFor` 服务于额外目标                     |
| 额外放置 | 有效的块，以及由 `alsoExampleFor` 或 `alsoShowcaseFor` 命名的有效目标                                    | 放置不会创建另一个模板身份标识                                        |

页面和块元数据可以使用更丰富的第一方类型或更窄的集成信封来编写。源适配器将这些源特定形态转换为公共条目。**投影**是面向某个使用方的目录过滤视图；它不会另外发现成员列表。

收敛后的投影包括：

- CLI 模板和搜索表面选择所有符合条件的页面和块。
- 布局只选择块。
- `init` 选择每个具名的内置页面。
- docsite 总览选择未标记 `scaffold` 或 `isHiddenFromOverview` 的就绪页面。
- docsite 实时预览选择相同的合格页面条目，并导入其目录源。
- 组件和 hook 文档从块元数据中选择普通示例、主展示和显式的次展示放置。
- 项目诊断使用相同的目录错误，而不是重新收集集成成员关系。

无效的必需数据会产生诊断。它不会被隐式默认值修复，也不会被静默跳过。TypeScript 检查仍然是额外的第一方编写检查；它不会取代运行时目录验证。

## Boundaries and invariants

- **INV1 — 页面和块是仅有的模板类型。** 展示和额外示例放置是块角色，而不是单独的源类型或身份标识。
- **INV2 — 身份标识与标签分离。** `(package, type, id)` 解析一个模板。`name` 和 `displayName` 可以更改或重复，而不会成为身份标识。
- **INV3 — 角色要求是显式的。** 每个被接受的条目都满足上面的规范化字段矩阵。源配对和投影元数据在使用方收到条目之前得到验证。
- **INV4 — 源特定的编写在一个边界处收敛。** 内置、外部和集成源可以有不同的适配器，但都不绕过规范化验证。
- **INV5 — 一个目录负责成员关系。** CLI、搜索、布局、项目、`init`、沙箱和 docsite 的差异来自已声明的投影，而不是独立的文件系统扫描或手工维护的成员列表。
- **INV6 — 预览源就是发布源。** 页面预览导入目录所提供的同一个 `page.tsx`。生成的懒加载映射可以实现该投影，但不决定成员关系。
- **INV7 — 页面保持可由宿主组合。** 普通页面只负责页面内容，而不是宿主应用的全局外框。处于显式 `Shell -` 类别的页面可以拥有 `AppShell` 和全局导航，因为展示该外框就是它的目的。贡献者指南负责准确的根组件配方。
- **INV8 — 复制是自包含的快照。** 输出的源属于采用它的项目。复制期间，仅存在于仓库中的演示资产和演示内容元素会被替换为通用占位符，仅用于文档的展示包装器会被移除；`template copy` 和 docsite 的 shadcn Install 项都是复制。`template show` 返回与复制写入相同的源。其他不经过复制而直接提供的示例源只替换演示内容元素并移除仅用于文档的展示包装器。实时预览渲染原始内容。后续目录更新不会改动已复制的项目。
- **INV9 — 目录值可以演进。** 模板 id、标签、元数据、类别、示例数据和起始源都是 `spec:AST-017/DEC-2` 下的可变目录数据。
- **INV10 — 目录周边的操作仍受契约约束。** `template` 命令、支持的选项、退出行为以及机器可读的响应 schema 仍由 CLI 契约管理。
- **INV11 — 共享行为需要共享契约。** 相似的模板不会隐式形成一个家族。共享的状态、交互、响应式行为和约束需要一份已批准的家族、设计或系统记录。
- **INV12 — 证据特定于修订版本。** 评分标准分数标明它所测量的确切模板 commit 和评分标准版本。它可以支持评审，但不能授予设计批准、实现批准或当前记录权威。

## Delegated authority

本记录不吸收相邻事实：

- 随附的 `authoring/building-blocks/templates/write-good-templates` 指南负责公开评分规则、评分标准版本、评分档位、类别、权重和 agent 工作流。公开的 [Contributing Templates](https://github.com/meta/astryx/wiki/Contributing-Templates) 指南负责贡献者工作流和评分台账发布程序，并链接到随附的评分标准而不是复制它。其当前关于重命名属于破坏性变更的陈述已被 `spec:AST-017/DEC-2` 取代。
- `design:template-composition` 负责共享的人类视觉、层级、响应式和交互意图。在其权威为 `draft` 期间，它仍是候选记录。
- 组件、模块和家族记录负责由模板组合的组件的行为。良好的评分标准分数不会推翻这些契约。
- `spec:AST-017/DEC-2` 负责可变目录值与稳定的周边 CLI 操作之间的兼容性划分。
- `TemplateDoc` 类型和 `parseTemplate()` 实现编写信封。它们必须收敛到本记录的字段要求；当两者不一致时，任何一方都不会静默成为策略。

## Change coupling

- 模板源或元数据变更会重新运行其源适配器、规范化验证以及每个受影响的投影检查。
- 对必需元数据或模板角色的更改会同时更新 TypeScript 类型、运行时解析器、贡献者字段表、生成器、API 响应和活动记录。实质性形态变更遵循仓库的 schema 版本和迁移规则。
- 页面新增、移除或投影标志变更会更新生成的沙箱和 docsite 数据，并证明每个被接纳页面的实时预览覆盖。
- 展示或示例放置变更会验证每个目标解析出一个主展示，并重新生成展示/示例注册表。
- 视觉或交互变更遵循适用的当前设计、家族和组件记录。一次评审不能替代另一次评审。
- 评分标准评分变更会同时更新随附模板质量指南的版本和评分台账契约。只有当它移动系统边界时，才会改变本架构。
- 跨多个模板共享行为的提议会更新相关的家族、设计或系统记录，而不是从相似性推断契约。

## Owning code

- `packages/cli/assets/docs/tree/template-quality.doc.mjs` 及其子指南 — 规范的公开评分标准和 agent 评分工作流。
- `scripts/template-score-ledger.mjs` — 评分标准分数持久化；从指南导入规范版本、评分档位、类别和权重。
- `packages/cli/assets/templates/` — 内置页面和块的源及元数据。
- `packages/cli/authoring/doctypes/template/` — 第一方编写类型和运行时模板信封。
- `packages/cli/foundation/discovery/template-adapter.mjs` — 当前的源加载器、规范化、投影和共享模板 IO。
- `template-adapter.mjs` 中的 `replaceDemoMedia` — 复制和展示代码共享的 INV8 替换步骤。它替换 `/template-assets/` 媒体 URL。在运动和手势示例中，真实的 Astryx 组件包裹仅用于文档的内容时（例如 `<Card><PlayingCardContents /></Card>`），它还会将每个演示内容元素替换为通用占位符，并保留外层组件。演示内容元素是从唯一的仓库专用演示内容模块导入的元素；该步骤会丢弃该导入。该模块和导入规则属于内部机制，而不是公共契约（`architecture:knowledge-contracts/INV18`）；`spec:AST-028` FR13 陈述其结果。`template copy`、`template show` 和 docsite 的 shadcn Install 项运行两遍处理；复制回执和 `template show` 响应将元素数量报告为 `demoContentReplaced`。docsite 的 Code 标签页、Open in Playground、Sandbox 代码视图、docsite MCP 服务器的 `get()` 以及 `astryx component <Name> --showcase` 只运行元素遍历，因此它们保留其示例媒体素材（`spec:AST-033` FR23）。实现缺口：演示内容模块、元素遍历和 `demoContentReplaced` 尚未构建，且 shadcn Install 项不运行任何一遍。
- `packages/cli/foundation/config/project.mjs` — 项目诊断和当前集成模板的重新收集。
- `packages/cli/api/template/` — list、show、skeleton 和 copy 操作。
- `scripts/sync-templates.js` — 当前的沙箱注册表和预览路由。
- `apps/docsite/scripts/generate-data.mjs` — 当前的 docsite 页面、块、示例和展示注册表。
- `apps/docsite/src/components/templateComponents.ts` — 当前手工维护的页面预览加载器；其独立成员关系是一个迁移缺口。

## Deciding specs

- `spec:AST-017/DEC-2` — 模板身份标识、元数据和起始源是可变目录数据；周边的 CLI 操作仍受契约约束。

## Verification

| 范围               | 当前证据                                                                      | 在成为 `current` 之前缺失的内容                                                                                                                                                                                                                                                                                  |
| ------------------ | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 源形态与集成解析   | `parse.test.mjs`、`template-suffix.test.mjs`、`template-integration.test.mjs` | 一项语料库检查，让每个已发布页面和块都通过规范化边界                                                                                                                                                                                                                                                             |
| 目录成员关系与诊断 | `template-adapter.test.mjs`、`project.test.mjs`                               | 一个目录实现；没有重复收集；每个无效源都被一致报告                                                                                                                                                                                                                                                               |
| `init` 投影        | `init.test.mjs`                                                               | 从目录中选择每个具名内置页面，而不是扫描目录                                                                                                                                                                                                                                                                     |
| docsite 与沙箱投影 | `data-extraction.test.ts`、生成的注册表检查                                   | 从目录元数据派生的成员一致性及实时预览覆盖                                                                                                                                                                                                                                                                       |
| 复制边界           | `template.test.mjs`、`template-suffix.test.mjs`                               | 针对仅预览资产移除和快照独立性的变异覆盖                                                                                                                                                                                                                                                                         |
| 演示内容替换       | 无；尚未构建                                                                  | 复制、`template show`、shadcn Install 项、Code 标签页、Open in Playground、Sandbox 代码视图、MCP `get()` 和 `--showcase` 输出不包含演示内容元素或演示内容导入；复制回执和 `template show` 统计元素数量；shadcn Install 项不包含 `/template-assets/` 引用；仅分发源的表面保留其示例媒体素材；实时预览渲染原始内容 |
| 评分标准证据       | 携带 `commit` 和 `rubricVersion` 的版本化记分卡                               | 架构方面无；分数仍是审计证据而非权威                                                                                                                                                                                                                                                                             |

## Shipped-catalog audit

在 `067b176` 进行的精确源审计发现：

- 53 对页面源/元数据。全部通过当前的 `parseTemplate()` 边界。其中四十个是总览投影中可见的就绪、非脚手架页面。其中一个 `work-item-detail` 缺少实时预览加载器。
- 全部四十个总览可见页面都保持宿主外框边界。唯一的源形态例外是未完成的 `messaging-shell`；`blank` 是有意的最小脚手架，而不是画廊页面。
- 644 对块源/元数据，没有孤立的源文件或元数据文件。每个块都声明了 `type`、`name`、`displayName`、`isReady`、`exampleFor`、正的 `aspectRatio` 和非空的 `componentsUsed`。审计未证明每个数组都列出了其源导入的每个组件；该完整性仍需要可执行检查。
- 158 个主展示块解析为 158 个不同的主目标。十四个块添加次展示目标，二十个块添加次示例目标；174 个扩展展示目标没有冲突。
- 三十五个主展示省略了 `description`。当前内置发现会将其转换为空字符串，而 `parseTemplate()` 会拒绝它。这是元数据回填缺口，而不是有意的展示例外。
- 核心块的文件名主干 id 是唯一的。三对共享面向人的 `name` 值；INV2 允许这一点，并且不会造成 CLI 歧义。
- TypeScript 类型、运行时解析器和贡献者字段表对于 `displayName`、`description`、`isReady`、`exampleFor`、`aspectRatio` 和 `componentsUsed` 是否必需存在分歧。解析器还接受 TypeScript 类型未声明的 `preview`。必须在本记录成为 `current` 之前将它们对齐。

## Decision log

### Catalog convergence direction — 2026-09-05

一个经过验证的目录负责模板成员关系。源特定的编写形态可以保持不同，但每个源都通过相同的验证边界规范化。CLI、`init`、项目、沙箱和 docsite 行为成为显式的元数据驱动投影。并行收集器和手工维护的成员关系都是迁移缺口。

### Corpus audit — 2026-09-09

每个已发布页面和块都在 `067b176` 被枚举。审计添加了上面的角色矩阵，并识别出执行、元数据和预览注册方面的缺口。这些缺口阻碍升级为 `current`；它们不会让清单消失，也不会将现有审计分数变成架构权威。

## Open questions

- **OQ1 — 批准路由。** 哪些仓库所有者必须批准同时跨越模板视觉意图和编写/运行时行为的变更，本记录才能成为 `current`？
- **OQ2 — 评分标准的归属。** 版本化评分标准是否应移入自己的仓库记录，同时 wiki 成为面向贡献者的参考，还是 wiki 应保留其权威？
