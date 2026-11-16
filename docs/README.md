# Astryx 知识地图

本目录存放维护者知识，这些知识必须能与其所治理的代码一起审查。消费方文档仍保留在组件 `.doc.mjs` 文件和 `packages/cli/assets/docs/` 中。

## 放置

- `architecture/`：已交付的系统、其边界和不变量。
- `contributing/`：实用的贡献者工作流，它们投影当前所有者记录而不替换它们。
- `design/`：人工拥有的视觉和交互规范。
- `themes/`：包本地主题规范的指南和索引。
- `families/`：由同级组件共享的契约。
- `specs/`：有重大影响的提议或已交付系统变更及其决策。
- `specs/components/`：组件和模块契约，每个组件一个文件夹。
- `templates/knowledge/`：编写模板。模板从不与记录放在一起。
- `schemas/knowledge/`：模板和记录的版本化结构要求。

每个组件的记录（无论哪个包和平台）都集中在一个文件夹 `specs/components/<ComponentRoot>/` 中，该文件夹以存放组件代码的文件夹命名。该树镜像 `scripts/component-packages.cjs` 注册的包的源码树：

- 目录布局的包（`core`、`lab`）保留 `packages/<package>/src/<ComponentRoot>/`，其记录为 `specs/components/<ComponentRoot>/<PublicName>.spec.md`；
- 扁平包（`charts`、`richtext`、`vega`）保留 `packages/<package>/src/<PublicName>.tsx`，其记录为 `specs/components/<PublicName>/<PublicName>.spec.md`；
- 平台实现的记录与核心记录并排放置，形式为 `specs/components/<ComponentRoot>/<PublicName>.<language>.spec.md`，例如 `specs/components/Avatar/Avatar.swift.spec.md`。

`<PublicName>` 通常与根一致；像 `NavMenu/NavHeadingMenu.spec.md` 这样的公共成员，仅当该根中某个确切的顶层或完整内联消费方文档条目声明了相同的公共名称时才有效。在扁平包中，公共命名导出和匹配的 TSX 模块定义组件边界。当两个包保留同名文件夹时，记录属于持有其代码的包。

可独立缔约的公共 hook、插件、工具和子系统使用 `kind: module` 记录，命名为 `<PublicName>.spec.md`，至少位于同一组件文件夹下一级目录，通常在 `modules/`（`specs/components/Dialog/modules/DialogHeader.spec.md`）或插件自己的文件夹中（`specs/components/Table/plugins/rowStatus/useTableRowStatus.spec.md`）。子目录不必与模块代码所在位置一致；查找通过代码的文件名或其 `verified_by` 证据到达记录。它们的规范 ID 是 `module:<ParentComponent>/<PublicName>`；模块的 `parent_component` 和父组件的 `modules` 列表必须一致。私有转换辅助函数不需要记录。

组件记录发现和 PR 路由会忽略隐藏路径段、`*.generated.spec.md`，以及 fixture、test、generated、build-output、coverage 和 `node_modules` 目录。这些文件不是知识记录，也不是仅规范变更。主题契约位于包旁，形式为 `packages/themes/<theme>/<theme>.spec.md`。

## 权威性

每条知识记录都声明 `authority: draft | current | archived`。

- `draft` 文档不是策略；未解决的证据和所有者决策在文档内部记录为阻塞项。
- 首次提升为 `current` 需要记录在文档元数据中的明确所有者批准。任何当前 `.github/ENGOWNERS` 成员都可以批准每种记录类型；当前设计和主题记录以及规范性设计资产也接受当前 `.github/DESIGNOWNERS` 成员。旧版 v1 `owners` 元数据是描述性的，不授予批准权限。
- 创建、更改或归档 `current` 记录的拉取请求会等待审查门禁 `review-required`，直到所有者通过 `/approve-spec <full-sha>` 或一次审查批准其内容（`architecture:knowledge-contracts` DEC-14）。仅草稿记录不需要所有者批准。
- 只有 `current` 文档指导实现和审查。
- 规范描述持久的理想行为，独立于任何单个拉取请求。拉取请求和 issue 只能作为明确的非权威示例、历史证据或引用出现。规范从不用于批准、拒绝、分类、指定或授权某个特定拉取请求。
- 在创建或实质性扩展记录之前，按规范所有者/ID、受影响的路径和导出符号以及语义行为术语搜索当前记录和打开的拉取请求。默认扩展现有规范所有者或对其进行投影；仅当存在不同的事实边界时才创建新记录，并解释原因。
- 当前记录只依赖其他当前记录。`modules` 和 `parent_component` 是结构所有权链接，因此它们可以连接活跃的草稿/当前记录，而不会使草稿行为具有权威性。其他草稿关系列在候选记录上；提升时在所有者审查下更新受影响的反向链接。
- `archived` 文档声明 `archive_reason`（`superseded`、`withdrawn` 或 `historical`），并在存在替代时链接 `superseded_by`。

## 模板与 schema

模板创建文档；schema 使现有文档保持结构一致。它们有意分开：

- `template_version` 记录创建文档所用的编写形式。
- `schema_version` 记录文档必须满足的契约。
- 编辑性模板变更只能递增 `template_version`。
- 添加或更改必需元数据或小节会创建新的 `schema_version`；已发布的 schema 文件不可变。
- 每个活跃记录（`draft` 或 `current`）必须使用定义其类型的最新 schema。添加新类型不会迁移无关记录；对现有类型进行结构性更改只会迁移该类型的活跃记录。归档记录可以保留仍在版本控制中的较旧 schema。

已发布的 schema 版本可以扩展较早的 schema。检查器会组合链并跟踪定义每种记录类型的最新版本。因此新类型是增量的；更改现有类型只会迁移该类型。

可选的 `review-applicability:v1` JSON 块可以将记录中的选定主张路由为横切审查基线。这是一个独立版本化的元数据叠加层，类似于 `anatomy-theming:v1`，因此添加它不会改变记录类型的必需形状，也不会迁移未选择加入的记录。该块必须声明 `scope: "global"`，并将每个语义触发器映射到同一记录中的一个或多个确切主张 ID。验证会拒绝格式错误、为空、重复或过时的主张路由。路由需要受审查的头，验证所提供的基权威提交是其 `origin/main` 合并基，只包含 `authority: current` 的记录，并仅返回匹配的主张；草稿记录和不匹配的路由会被省略。

可选的 `path-applicability:v1` JSON 块列出记录在没有任何放置位置、路径字段、名称或继承链接可达时所治理的仓库路径：`{"paths": ["apps/docsite/**"]}`。模式是仓库相对 glob：`**` 是跨越任意深度的整个路径段，`*` 在一个路径段内匹配，`?` 匹配一个字符。与 `review-applicability:v1` 一样，它是独立版本化的叠加层，因此选择加入不会迁移记录类型。模式必须以字面路径段开头。验证会拒绝格式错误、不安全、重复、整仓库和无匹配的模式。匹配只定位路径对应的记录；主张范围和优先级保持不变。当当前记录无法从任何本身不是记录的受跟踪路径到达时，`pnpm check:knowledge` 也会失败（`architecture:knowledge-contracts` INV25 和 INV26）。

新的记录类型应优先使用一个类型化关系列表，而不是并行字段。如果 `system-spec` 未来获得 schema 修订，将其遗留的 `affects_*` 字段替换为一个类型化的 `affects` 列表，包含 `architecture:*`、`family:*`、`theme:*` 和 `contributing:*` 等 ID；本 PR 不改变 v1 system-spec 形状。

运行 `pnpm specs:for <path>` 可列出与任意仓库路径关联的当前记录：记录自身的放置位置、`applies_to` 和 `verified_by` 条目、家族和设计成员资格、`affects_consumer_docs` ID、文件正文中引用的 system-spec 编号（不在记录路径内），以及这些记录继承的引用。只跟随可见记录，因此除非传入 `--include-draft`，草稿永远不会添加链接。范围限定到单个主张或决策的引用（`spec:AST-NNN/FR3`）列出该主张，而不是整个记录。决定某条关联记录的规范会单独列出，匹配的组件和模块触发器路由的全局主张也是如此（与 `review-global-baselines.mjs` 相同的选择）。使用 `--diff origin/main`（或 `--diff <base>..<head>`）时，它会读取变更，在未指定文件时列出其文件，并将新增行匹配其所属记录的 `concerns` 的主张放在最前面。默认视图列出主张和关联记录 ID；`--records` 显示每条记录如何链接。没有关联记录的路径会按此报告。记录从工作树读取，因此在拉取请求分支上，结果包含该分支提议的记录，且不是审查权威。`pnpm specs:for --unrouted` 列出没有治理记录的受跟踪文件；`--unreached` 列出没有其他路径到达的当前记录。

运行 `pnpm check:knowledge` 以验证模板和记录。纯规范记录拉取请求不添加 Changesets，因为它们不发布包变更。

## 可见性

本仓库及其 wiki 是公开的。内部运营、凭据、服务、路由、计划和私有恢复程序留在访问受控的私有主页中，不得在此命名或链接。
