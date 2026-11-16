---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-026
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: implementing
owners: [cixzhang, josephfarina]
affects_architecture: [architecture:public-component-api]
affects_families: []
affects_contributing: [contributing:templates]
affects_consumer_docs: [shadcn-compatibility, templates, components]
---

# shadcn Registry compatibility system spec

## Intent

让构建者能够通过标准 shadcn Registry 协议安装 Astryx 组件、组件展示、示例块和页面模板，同时不把 Astryx 变成基于 shadcn 的库，也不把 Astryx 组件实现复制到使用方仓库中。

兼容层在构建者已有的 shadcn 工作流中与他们相遇。Astryx CLI 仍是首要且更丰富的界面，用于发现、组合、集成、主题、校验和升级。

本记录管辖已批准的兼容性基础。实现可以在 canary 文档站之后合并，而复制型组合的升级仍是生产端点和公告的发布门禁。

## Non-goals

- 用 shadcn CLI 取代 Astryx CLI。
- 定义第二种 Astryx 专有的注册表格式。
- 在常规安装期间复制 Core 或 Lab 组件实现源码。
- 把生成的示例、块或页面当作字节稳定的公共 API。
- 发布不受支持的服务级别协议，或把复制型组合变成由包控制的实现源码。
- 改变用于深度定制的显式 `astryx swizzle` 逃生舱。

## Requirements

- **FR1 — 标准协议。** 每个注册表条目 MUST 通过标准 shadcn Registry schema 校验，并使用标准的注册表条目类型。标准的 shadcn 客户端 MUST NOT 需要 Astryx 专有代码来读取或安装该条目。
- **FR2 — 保留包边界。** 组件安装 MUST 添加已发布的 Astryx 包依赖，并且只创建面向使用方的导入或再导出源码。它 MUST NOT 复制组件实现、私有辅助函数或未编译的 StyleX 源码。
- **FR3 — 完整覆盖所请求的目录。** 该实验 MUST 覆盖每个公共组件或 hook、每个组件展示与示例块、每个其他块，以及 CLI 和文档站所用的同一目录中可用的每个就绪页面模板。
- **FR4 — 可编辑的组合。** 展示、示例、块和页面条目 MAY 复制应用级组合源码。该源码 MUST 通过已发布的包路径导入 Astryx，声明所有非 React 包依赖，并且不包含任何逃逸出所复制条目的相对导入。
- **FR5 — 确定、稳定的身份。** 条目名称、组织化 URL 路径、目标路径、依赖列表和 JSON 输出 MUST 确定且无冲突。身份 MUST 源自稳定的 doc/catalog 字段，而不是展示名或源文件名。展示名变更 MUST NOT 改变安装 URL。已发布的改名 MUST 把原有路由保留为别名。
- **FR6 — 一个目录，两个客户端。** shadcn 客户端使用标准字段。Astryx CLI MAY 从原始 JSON 读取可选的 `astryx` 元数据，用于集成、来源和升级指引。标准客户端可以丢弃该元数据而不改变安装。
- **FR7 — 可发现的兼容性。** 公共文档站 MUST 描述兼容性边界，并在每个适用的组件、示例、块和页面表面的末尾显示一条次要的可复制安装命令。常规 Astryx 文档仍是人工浏览体验；原始 `/shadcn/` 路径仍是机器端点。
- **FR8 — 分阶段发布。** 预览构建 MUST 从它们自己的 `/shadcn` 源提供完整注册表，并使用 `@canary` 包依赖。生产 MUST 使用确切的已发布包版本，并在复制型组合升级就绪之前保持禁用。
- **FR9 — 升级安全的复制型组合。** 每个复制的展示、示例、块和页面 MUST 安装一个相邻的机器可读回执，其中包含稳定的条目路由、复制目标、安装的确切字节及其哈希。`astryx upgrade` MUST 只应用与已安装 Astryx 发行版匹配的规范条目，自动更新未变化的文件，对编辑进行三方合并，在编辑冲突时保持原文件不变，并且绝不重建已删除或移动的文件。
- **FR10 — 必需的全目录 CI。** 必需的 pull request CI MUST 生成完整的预览目录，在发布前拒绝生产输出，通过固定版本的 shadcn 客户端安装每个规范条目，校验每个路由和确切写入的文件，并针对当前 Astryx 包导出编译每个已安装源码。
- **IR1 — 由当前源码生成。** 注册表输出 MUST 来自现有文档站和 CLI 目录，绝不来自并行的手写条目列表。
- **IR2 — 构建时静态输出。** 文档站构建 MUST 在一个注册表根目录下生成静态 JSON。当一次干净构建可以重现它时，生成的 JSON MUST NOT 被提交。
- **IR3 — 失败要响亮。** 缺失源码、重名、无效 schema、未解析的包版本、逃逸的相对导入以及过期的生成输出 MUST 使生成或校验失败。
- **IR4 — 端到端证据。** 必需校验 MUST 通过固定版本的原始客户端，把每个规范组件、hook、展示、示例、块和页面安装到一个干净的 shadcn 风格应用中，校验确切写入的字节和声明的依赖，并编译每个写入的源码文件。别名路由 MUST 解析为同一规范条目的字节。
- **IR5 — 稳定的路由契约。** 生成的条目名称和规范路径 MUST 与已评审的路由锁一致。展示名编辑 MUST NOT 改变它们。有意的改名 MUST 通过 `registry.aliases` 保留旧路径，除非另行评审的破坏性变更批准移除。

### Platform support

- 支持的 feature/engine 下限：当前 Astryx 的 Node 下限，以及该实验使用的固定 shadcn 版本。
- 不支持的行为：在没有显式 `astryx swizzle` 操作的情况下复制 Astryx 实现源码；安装隐藏的、不完整的或无法解析的目录条目。
- 浏览器证据：在提议发布之前，一个有代表性的已安装页面 MUST 在真实 Chrome 中以浅色和深色两种模式渲染。

## Current-state impact

CLI 已经提供组件、数百个示例与展示以及页面模板。文档站生成器已经能发现组件、单个展示与示例、块、页面、包版本和源码。兼容层在该现有目录之上增加一个序列化器，而不是第二套发现系统。

当前目录生成 970 个条目。其中 700 个复制型组合各自携带一个相邻回执，其基线匹配原始 shadcn 写入的确切字节。必需 CI 通过 shadcn 4.19.0 把全部 970 个条目安装到一个干净的使用方中，校验全部 1,670 个写入的源码与回执文件，并编译全部 970 个源码入口点。十四个编写本地 StyleX 的组合在生成期间被预编译为无需编译器的 JSX；其余所有组合源码保持带类型的 TSX。组件实现的复制失败了，因为私有导入和未编译的 StyleX 越过了包边界；FR2 通过安装包并只创建公共再导出来避开那条路径。

## Verification

| 契约      | 校验                                     | 代表性状态                                 | 变更或失败预期                                |
| --------- | ---------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| FR1, FR5  | shadcn schema 校验与确定性快照           | 组件、展示、示例、块、页面                 | 未知类型、重名或不稳定输出会失败              |
| FR2       | 干净使用方安装与源码检查                 | Core 组件、hook、非 Core 包                | 实现源码或私有导入会失败                      |
| FR3, IR1  | 把注册表计数与名称同生成的文档站目录核对 | 可见与隐藏条目、分组族                     | 缺失或多余目录条目会失败                      |
| FR4, IR3  | 依赖提取与相对导入审计                   | heroicons、recharts、StyleX 导入、页面源码 | 逃逸导入或未声明包会失败                      |
| FR6       | 原始 JSON 与 shadcn 解析测试             | 存在可选的 `astryx` 元数据                 | shadcn 安装发生变化，或 Astryx 元数据变成必需 |
| FR7       | 文档站测试与复制按钮交互                 | 组件、块、页面、兼容性指南                 | 命令缺失、过期，或错误描述复制行为            |
| FR8       | canary 预览与生产目标断言                | 预览与已发布包依赖                         | 生产在升级门禁通过之前启用                    |
| FR9       | 回执变更测试与原始 ShadCN 安装           | 原始、已编辑、冲突、缺失、有别名           | 用户源码被覆盖，或旧路由不再解析              |
| FR10, IR4 | 必需的全目录干净使用方安装与构建         | 每个规范条目、路由、依赖、目标             | 任何条目安装失败、与其回执不匹配或编译失败    |

## Decision log

### DEC-1 — Use shadcn as a compatibility protocol, not an Astryx foundation

**Reference:** `spec:AST-026/DEC-1`

**Decider:** `josephfarina`, `2026-09-02`

生成标准注册表 JSON，使现有 shadcn 用户无需更换工具即可安装 Astryx。保留 Astryx CLI 作为主要产品，以及更丰富知识与维护行为的来源。

已否决：自定义的 Astryx 注册表格式。它不为第三方客户端提供互操作性，并且要求 Astryx 在被发现之前先被采用。

### DEC-2 — Copy composition, not component implementation

**Reference:** `spec:AST-026/DEC-2`

**Decider:** `josephfarina`, `2026-09-02`

常规安装把 `@astryxdesign/core` 或所属的 Astryx 包保留为真实依赖。组件条目创建一个公共再导出；展示、块和页面复制可编辑的组合代码，这些代码导入该包。

已否决：复制 Core 实现源码。它会破坏由包控制的升级，并越过私有导入和未编译 StyleX 的边界。

### DEC-3 — Stage the launch behind the canary docsite

**Reference:** `spec:AST-026/DEC-3`

**Decider:** `josephfarina`, `2026-09-09`

在端到端校验之后合并兼容性基础，但在复制型组合升级就绪之前，保持生产注册表和广泛公告处于禁用状态。

### DEC-4 — Derive stable IDs from docs and organize URLs by item kind

**Reference:** `spec:AST-026/DEC-4`

**Decider:** `josephfarina`, `2026-09-03`

在发布之前把注册表名称和路径视为公共 API。从稳定的组件/hook 名称、块的 `name` 加 `exampleFor`，以及现有模板 slug 派生它们。让 `displayName` 保持编辑性质。使用这些路径族：`components`、`hooks`、`showcases/<component>`、`examples/<component>`、`blocks` 和 `templates`。没有 `exampleFor` 的块是 `blocks` 下的独立块；具有组件归属的块是示例或展示。

允许文档用 `registry.slug` 覆盖其叶子名称，并用 `registry.aliases` 保留旧的相对路径。对照已评审的锁检查所有名称和路径，使改名无法悄悄破坏现有安装命令。

每个条目还会在注册表根目录以 `<name>.json` 提供，带有其规范字节。标准客户端从索引名称构建该地址，在搜索结果和 `@namespace/<name>` 安装中都是如此。每个别名路径也保留它所代表的名称，因此改名的条目仍可按其旧名称安装。

### DEC-5 — Use `/shadcn`, exact releases, and canary previews

**Reference:** `spec:AST-026/DEC-5`

**Decider:** `josephfarina`, `2026-09-09`

使用 `https://astryx.atmeta.com/shadcn` 作为规范的生产根，并把 `/r` 预留给未来的 Astryx 原生协议。生产条目固定确切的已发布 Astryx 包版本；预览条目使用匹配的预览源和 `@canary` 依赖。

### DEC-6 — Install adjacent receipts and reconcile from the canonical registry

**Reference:** `spec:AST-026/DEC-6`

**Decider:** `josephfarina`, `2026-09-10`

每个复制型组合在其源码旁携带一个唯一 JSON 回执。回执存储安装的基线字节和哈希；稳定的条目路由解析该发行版已编译的源码。`astryx upgrade --registry` 拒绝与已安装 Astryx 发行版不匹配的注册表条目，然后更新原始文件，或执行真正的三方合并，而不把可编辑的应用代码当作包拥有的实现。冲突被写入一个单独的产物，绝不替换用户的文件。已删除或移动的文件保持已删除或已移动。

已否决：仅含哈希的回执。在用户编辑文件后，它们无法重建合并基线。同样已否决：在升级时从原始 CLI 模板资产重建最新组合。经 StyleX 预编译的注册表条目需要注册表的已编译字节。

### DEC-7 — Gate every registry item through one clean consumer

**Reference:** `spec:AST-026/DEC-7`

**Decider:** `josephfarina`, `2026-09-10`

必需的 pull request CI 证明发布通道选择器为生产移除兼容性输出，然后把每个规范预览条目传给一个干净使用方中的固定版本 shadcn 客户端。该使用方用当前本地包构建替换 Astryx 包固定版本，使新组件能在该版本存在于 npm 之前证明其导出；所有第三方依赖保留生成的目录所声明的版本。CI 把每个写入文件与其注册表字节比较，并在解析 Astryx 包导出的同时编译每个源码。

已否决：每个条目一个客户端进程。它重复依赖安装数百次，却不增加协议覆盖。同样已否决：只校验有代表性的条目。源码或目标缺陷可能只存在于任何某个生成的组合中。

## Open questions

- **OQ1 — 目录可见性。** （`human-design`）隐藏或未就绪的目录条目应保持可通过 URL 寻址，还是完全省略？
