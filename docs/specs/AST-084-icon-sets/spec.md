---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-084
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-10-20
phase: accepted
owners: [josephfarina]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: [contributing:cli-conventions]
affects_consumer_docs: [cli/experimental]
verified_by:
  [
    packages/cli/api/icon/use/use-variant.test.mjs,
    packages/cli/api/icon/look-theme-maps.test.mjs,
    packages/cli/foundation/discovery/template-icons-variant.test.mjs,
  ]
---

# Icon set integrations system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/cli/foundation/discovery/icon-set-theme-maps.mjs"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

图标集是一项实验性集成项：包所导出的图标组件，外加一个数据文件，说明每个图标定义由哪个图标绘制。Astryx 提供图标定义，每个图标可以代表的含义（`close`、`delete`、`rocket`）对应一个带类型的 doc 文件。一个集把它的图标注册到这些定义上，并且可以添加自己的定义。安装了某个集之后：

- agent 或工程师用 `astryx experimental icon <words>` 按含义查找图标，并拿到确切的 import 行；
- 复制进项目的模板，若项目用 `experimental.iconSet` 选择启用，就用该集为模板所声明的定义提供图标，并使用项目用 `experimental.iconVariant` 选定的那一种外观（variant）；以及
- 主题在该外观下，把共享的语义图标名指向该集的美术资源。

CLI 不内置任何图标库：作者或作者的 agent 挑选每个图标，CLI 验证它、写入文件并检查该集。

## Non-goals

- 在渲染时选择 variant；那属于 Icon 组件契约。
- 在数据文件中声明尺寸：图标尺寸由 CSS 决定，美术资源随其盒子缩放。
- 扩展共享的 `IconName` 集合：内置定义恰好就是它的取值。
- 让每个图标成为各自的可发现项：集才是那个项。
- 编辑、重绘或打包美术资源：每个图标都是包导出的组件。
- 满足本契约的等效内部实现仍然有效。

## Requirements

### Experimental placement

- **FR0 — 每个图标集接口都是实验性的且相互隔离。** 在 `spec:AST-017/FR21`–FR27 之下：
  - 命令是 `experimental` 命令组下的 `astryx experimental icon` 及其子命令；没有任何稳定命令获得图标集子命令或选项值，稳定命令上唯一的图标集种类是 discover 的 `icon-set`，且仅在选择启用时读取（FR17、DEC-8）；
  - `astryx experimental` 是一个顶层命令组，在此依据 `spec:AST-042/FR4` 获准。它回答一个问题：当 CLI 中的某个控制项在补丁版本里仍可能变化时，它应放在哪里？现有命令都无法容纳这类控制项，因为 `spec:AST-017/FR27` 把实验性控制项排除在每条稳定命令及其输出之外；扩展 `help` 或任何稳定族都会改变该命令。它的唯一职责是把实验性命令分组。它自身不执行任何操作，因此 `spec:AST-042/FR1` 没有为它命名任何函数；其下每个命令各自命名自己的函数。它自身没有结果：其下每个命令都返回数据，即 agent 和工具会据以行动的带类型 JSON 响应，而实验性功能背后的理由则是 `cli/experimental` 下其文档中的散文；
  - 配置是 `astryx.config` 中的 `experimental.iconSet`，即项目选择启用；其旁是 `experimental.iconVariant`，即其图标绘制的外观；以及集成清单中的 `experimental.iconSets`；
  - 指南与 schema 位于 `cli/experimental` 下（指南、描述符、数据文件与定义 schema 的 `icon-set-files` 参考——稳定字段参考从不列出它们——以及 `icon-definitions` 命名空间）；实验性命令与 API 函数的参考文档则与所有其他命令和函数参考放在一起（`cli/api/functions/...` 与命令文档），仅列在 `astryx docs cli` 清单中，与本需求为 help 所做的是同一个例外；这些文档每一个都带有 `stability: 'experimental'`，API 函数与创作类型带有 `@experimental`；以及
  - 每个变更都以 `[experimental]` 补丁 Changeset 发布。晋升为稳定需要所有者批准以及一个 `[feat]` Changeset（`spec:AST-017/FR23`）。

  在没有 `experimental.iconSet` 时，help（除标记的 `experimental` 组那一行之外）、`astryx manifest`（除该组之外：它的命令，以及它的 `responseTypes` 和 `jsonSupported` 条目）、`astryx docs cli` 清单（除标记的 `experimental` 命名空间以及实验性命令与函数参考之外）、`astryx template`、`astryx discover` 和 Doctor（包括其针对已安装包的 `doctor integration` 子命令），无论安装了哪些集，都给出不启用本功能时的输出；对于未声明 `experimental.iconSets` 的包，`integration check` 和 `verify` 也是如此，但有四处差异。其中两处来自清单键 `experimental`，不启用本功能的 CLI 不认识该键。当安装了声明 `experimental.iconSets` 的包时，那个 CLI 会在 Doctor 的 `integration-issues` 检查中、以及 `doctor integration validate <package>` 中对该键发出警告，并且在文本模式下，每个命令（every command that prints the integration-issue nudge）：`component`、`discover`、`search`、`template`、`theme list`、`theme add`、`theme remove`、`theme use`、`theme eject` 和 `upgrade`）都会向 stderr 打印 “Warning: <package> has 1 integration issue(s)”；本 CLI 两者都不做。另外两处适用于这样的包：其模板声明了 `icons`，无论有没有 `experimental.iconSets`。第三处是 `template_icon_undeclared` 提示（FR10）：`integration check` 会列出它，标记为 `next`，而不启用本功能的 CLI 不会。第四处是 `templateIcons` 未检查清单（FR10）：`integration check` 会列出该检查不判定的每个模板 import，其未检查计数也因此高出相应数量；不启用本功能的 CLI 两者都没有。该提示与清单在 `--strict` 下都不使任何东西失败。Discover 拒绝 `--type icon-set`，并忽略 `icon-set` 目录条目及其字段，与对待任何未知种类或字段完全一样。在选择启用时，`icon-set` 是 discover 的一种种类（FR17）。`astryx search` 从不读取图标集，无论是否选择启用，也不返回任何实验性文档。没有任何稳定文档提到实验性路由、图标集或图标定义，稳定文档节点的上一页与下一页链接会跳过实验性邻居；唯一一处稳定新增是字段参考的 `stability` 字段（FR18），搜索 “experimental” 可以找到它。

### What a set declares

- **FR1 — 一个清单根。** 清单可设置 `experimental.iconSets`，一个相对目录。其下每个 lower-kebab 目录为一个集，以该目录命名；清单从不列出集或图标（`spec:AST-039/FR11`）。
- **FR2 — 一个带类型的描述符。** 每个集目录持有 `<name>.doc.mjs`，一个默认导出的 `IconSetDoc`（`type: 'icon-set'`、`name` 等于该目录、`displayName`、`description`、`maintained`，以及 `license`，一个用于美术资源的 SPDX 表达式）。
- **FR3 — 一个数据文件，由每个图标界面读取。** 每个集目录持有 `<name>.icons.json`（`schemaVersion: 1`）：
  - `module`：每个导出都由其读取的 import 说明符，即包名或其某个 `exports` 子路径；
  - `icons`：每个带有唯一的 lower-kebab `id`、一个 `export`、`words` 中至少一个搜索词、可选的 `variants`（每个都是一个已声明的 variant 以及绘制它的导出，每个 variant 至多一个导出），以及可选的 `matches`，即其他已安装集中经过审阅的等价项，置信度为 `exact`、`strong` 或 `likely`；
  - `map`：图标定义名到图标 `id` 的映射；一个图标可以绘制多个定义；
  - 可选的 `variants`，即该集声明的 lower-kebab variant 名，以及 `default.variant`，即每个图标自身的 `export` 所绘制的那一个。variant 是该集提供的一种具名外观（例如 outline 或 filled）；尺寸来自 CSS，项目按名称挑选一种外观（FR8）；
  - 可选的 `source`（上游库与版本）、`exclude`（不是图标的库导出，FR13）、`generated`（FR13）、`adapter`（FR13）和 `themeMap`（FR12）。

  不符合此形状、重复某个 `id`、映射了一个既不是 Astryx 定义也不是该集自身定义的名字、映射到不存在的图标，或命名了该集未声明的 variant 的数据文件都是无效的，该集会从每个界面撤回。

- **FR4 — 图标定义是文件夹中的带类型 doc 文件。** 一个 `IconDefinitionDoc`（`type: 'icon-definition'`）带有一个 camelCase 的 `name`、一句话的 `description`、`words`，并且恰好对于 `IconName` 而言带有 `builtIn: true`。Astryx 在 CLI 的定义文件夹中为每个定义提供一个文件；一个集在 `<set>/definitions/<name>.doc.mjs` 中添加自己的定义。doc 编译器读取文件夹中的每个文件；没有索引。一个集自己的定义无需对 Astryx 做任何改动，且仅在该集内映射；要为所有集提议它，就是一个把其文件复制进 CLI 文件夹的 pull request。名称冲突时，Astryx 的胜出。实验性的 `icon-definitions` 命名空间列出 Astryx 的定义，以及在设置了 `experimental.iconSet` 的项目中每个已安装集自己的定义。
- **FR5 — 目录就是边界。** Discovery 静态读取描述符、数据文件和定义，从不运行图标模块，并拒绝逃逸出包的路径（`spec:AST-039/FR5`、FR6）。

### Finding and choosing

- **FR6 — `astryx experimental icon <words>` 按含义对图标排序。** 它回答 `icon.search`，每个匹配带有其 `set`、`id`、`package`、`module`、`export`、`import` 行、`words`、`definitions`、`variants`、`reason` 和 `score`：对于该集映射到该图标的定义为 100，对于精确的名称或含义匹配为 90 或 80（被搜索图标多数采用的读法在前），当查询起始于其某个词时为 60，对于部分匹配（一个词内三个或更多字母）为 40。一个词的复数或单数算作精确匹配（`stars` 对应 `star`）；仅以查询开头的词（`start`）只在没有任何词整体匹配时才应答，而部分匹配只在没有任何分数达到 60 或以上时才应答。查询先按原样计分；只有当没有任何内容以完整词应答它时，才在多词查询中剔除仅用于组织它的词（`go`、`the`、`icon`），因此 `go home` 请求的是 `home`，而 `arrow up to line` 仍然命名 `arrow-up-to-line`。一个图标也会应答它所绘制的每个定义的名称与词。分数相同时按集顺序排序（FR8），因此项目的集领先；然后在一个集内，先是对整个 id 的精确名称匹配，再是其复数或单数，然后是对某个 id 部分的精确匹配，接着是按标签位置排序的精确含义匹配；然后按 `id`。`--set` 保留一个集，`--limit` 限制列表长度；`--set` 搭配 `--all-icons` 且无词时列出该集的每个图标（`icon.setIcons`），`--definitions` 列出每个 Astryx 定义（`icon.definitions`），各自带有 `templates`，即 `icons` 提到它的捆绑模板数量（FR9）。当已知一个集时（`--set` 指定的那个，否则是项目的主集，否则是该命令所在图标集包中唯一的集），回答以 `set` 命名它，且每个定义带有 `mapped`，即该集的 `map` 是否提到它。
- **FR7 — 单个图标与已安装的集。** `<set>/<id>` 回答 `icon.detail`，带有每个 variant 的 import 行；`--list` 回答 `icon.list`，带有每个集对内置定义、Astryx 定义及其自身定义的覆盖情况、项目的图标集状态，以及每个已撤回的集。一个集以其名称或 `<package>/<set>` 来命名；两个包都提供的名称需要限定形式。
- **FR8 — 项目的主集与后备集。** `experimental.iconSet` 命名项目的主集（`"<set>"` 或 `"<package>/<set>"`），或先列出主集、再按顺序列出后备集（`["<main>", "<backup>", ...]`；字符串即单条目列表），并使项目选择启用。`astryx experimental icon use <main> [--backup <set>]...` 写入它：没有 `--backup` 时写入字符串，有后备集时按给定顺序写入列表。它命名的每个集都必须已安装且只命名一次；其回执（`icon.use`）添加 `backups`、列表遗漏的已安装集（`unlisted`），以及添加它们的命令（`next`）。该命令与 Doctor 的该命令以同一种方式命名每个集：当没有其他已安装集使用该名称时用其名称，否则用 `<package>/<set>`。在 `astryx experimental icon` 之内，没有该键的项目将其唯一已安装集视为其集；当安装了两个或更多且一个都未选时，`--list` 与不带集名的 `use` 的拒绝都会命名命令 `astryx experimental icon use <main> --backup <set>`。`--list` 添加项目的 `order` 以及每个集的 `role`（`main`、`backup` 或无）和 `rank`，还有每个后备集的状态。两个已安装包都提供的名称不命名任何集。查找时先放主集，再按列表顺序放其后备集，然后是集成加载顺序。只有主集的主题映射供给主题（FR12）。

  `experimental.iconVariant` 命名项目每个图标绘制的外观：主集声明的某个 variant。它需要 `experimental.iconSet`，只设置它的配置会被拒绝。列表中的每个集绘制该名称的 variant，或在未声明时绘制其默认外观。`astryx experimental icon use <main> [--backup <set>]... --variant <variant>` 在与 `experimental.iconSet` 同一次写入中写入它，并在写入之前拒绝主集未声明的 variant（`ERR_INVALID_ARGUMENT`，命名主集的 variants，每个都带上选择它的命令）；不带 `--variant` 的 `use` 会移除它。回执添加 `variant`，即写入的值或 null，以及 `previousVariant`，即它替换掉的值，并且在有 variant 时添加 `looks`（列表中每个集及其绘制的外观）和 `themeMap`（主集针对该外观的主题映射，FR12，及其模块）。`--list` 添加项目的 `variant`，未命名任何 variant 时为 null，并在命名了一个时添加每个集的 `look`：它所绘制的外观，对于列表遗漏的集或只有单一外观的集为 null。

### Templates and themes

- **FR9 — 模板声明定义。** 模板或块描述符在 `icons` 中声明每个导入图标所绘制的定义（`{TrashIcon: 'delete'}`），以具名 import 所读取的名称（`{Trash as TrashIcon}` 是 `Trash`）或默认 import 的本地名作为键。在带有一个集（FR8，已选择启用）的项目中，`astryx template`（打印或复制）把每个已声明的图标、以及另一个已安装集提供的每个图标，改写成项目列表中第一个拥有它的集中的图标：以 `exact` 或 `strong` 匹配命名它的图标，否则是该集的 `map` 为该定义命名的图标。一个图标从不混合多个集，列表顺序在两个都拥有它的集之间做出决定。从列表中某个集所包装的库（其数据中命名为 `source` 的包，或其某个子路径）导入的内容，是项目已选定的图标：当主集包装该库时，图标保留其原样的 import，除非项目命名了 variant；那时它映射到主集为其定义提供的图标，因此绘制该外观。当主集没有为该定义映射任何图标时，主集中重新导出同一库导出的图标在该外观下取而代之（`by: 'variant'`），前提是它绘制该外观；否则图标保留其 import。当列表中的另一个集包装该库，且列表中没有集为其定义提供图标时，它也保留其 import。当列表中没有集为某个已声明的定义提供图标，且列表中没有集包装其库时，模板对该图标的 import 会被移除，文件在其第一条不是 import 的语句之上声明一次本地占位组件：`MissingIcon`，或当文件已使用该名称时用 `MissingIcon2` 及递增编号（FR19）。对该图标的每处引用都渲染该占位组件，并带有命名该定义的注释（`MissingIcon /* missing icon: cut */`）。被复制的文件不导入任何新内容，也不保留来自列表中没有任何集拥有或包装的库的 import。每处引用都使用映射后的导出，名称被占用时使用别名；映射后的默认 import 变成该集的具名 import，并别名到其本地名。不从名称做任何猜测，`likely` 匹配仅作为建议。一个键覆盖从两个模块导入的名称（outline 与 solid 的 `TrashIcon`）；当它的模块属于某个已安装集且所选集的图标具有该 variant 时，各自保留其 variant，否则绘制所选集的默认外观；缺失的外观从不把图标移到后备集。当项目命名了 variant（FR8）时，每个映射后的图标都请求该 variant，而不是其来源所绘制的外观；模板从列表中某个集以另一种外观导入的图标，在该图标拥有该 variant 的导出时移到该导出。映射后或占位图标的元素失去库的尺寸属性（`size`、`strokeWidth`、`absoluteStrokeWidth`）：尺寸来自 CSS（FR14）。被改写 import 行上的注释会被保留。
- **FR10 — 模板报告每个图标。** 结果与复制回执获得 `icons`：集状态、项目列出后备集时的列表 `order`、项目命名了 variant 时的 `variant`、每个图标的 `mapped`（来源、带所用集的目标、规则：`match`、`definition`，或对于在其集内移到项目外观的图标为 `variant`；被丢弃的尺寸属性 `dropped`；以及当所选集的图标缺少所请求外观时的 `variant: {asked, used}`）、`placeholder`（来源、占位组件的本地名、其 `definitions`，以及 `fixes`：`astryx experimental icon map <definition> <icon> --set <main>` 和 `astryx experimental icon use <main> --backup <set>`），或 `kept`（附带原因，存在 `likely` 建议时也附带它），以及 `sets`，即映射后图标的来源集及其许可证。有集时，每个已声明的键都是已映射、占位或保留：仅由命名空间 import、仅类型 import、重新导出，或从 Astryx 包、列表中的集、列表中某个集所包装的库导入的键，或根本没有 import 的键（`module` 为 null），都会被保留并附原因；不绘制任何定义且没有匹配的图标也是如此；副作用 import 不绑定任何东西。文本输出为每个占位组件打印一行，命名该定义及两个修复。打印的源码把报告保留在 stderr。没有选择启用时，没有 `icons` 字段，也没有改写。`integration check` 会记录模板源码从未导入的每个键（`template_icon_not_imported`），从不计数也不失败，在 `--strict` 或 `--next` 下同样如此。在其模板声明了 `icons` 的包中，它会记录模板导入但未声明的每个图标（`template_icon_undeclared`）：从某个模块导入的内容，而该包中某个模板从该模块声明了一个图标，模板将其渲染为无子节点且无选图标属性的 JSX 元素（`<Scissors />`），或作为值传递（`icon={Scissors}`、`[Scissors]`、`{icon: Scissors}`）。从该模块导入的任何其他内容，例如类型、模板调用的函数，或带子节点的 provider，都会被列为未检查（不作为图标渲染），因为已声明的键会使 `astryx template` 将其替换为图标。从名称以 `Icon` 结尾的另一个包导入的内容仅按名称匹配，并被列为未检查；通用渲染器（裸 `Icon`，或每次使用都给它一个图标属性的渲染器）被列为未检查。该提示标记为 `next`（`architecture:cli-surface` DEC-11）：它在 `--strict --next` 下失败，而 `--strict` 不会因它失败。模板未声明任何 `icons` 的包不会得到该提示。捆绑的 Core 模板导入的每个图标都已声明，且同一个捆绑模板中的两个不同图标从不声明相同的定义：一个集为每个定义绘制一个图标，因此它们会绘制同一个图标。
- **FR11 — 搜索保持稳定。** `astryx search` 没有图标域，也没有 `--type icon`，无论是否选择启用都不返回实验性文档。图标只有在晋升时才加入它。

- **FR12 — 主题映射。** 一个集导出 `themeMap` 所命名的映射：`map` 中每个内置定义一个条目，每个条目都是其图标的美术资源，因此主题设置 `icons: themeIcons`。每个条目都由 CSS（`style` 的 width 与 height 为 `1em`）以及属性一起调整到主题的图标盒子尺寸，因此其组件写入自己尺寸属性的图标仍以盒子的尺寸绘制。当 `themeMap` 在带生成模块的集中为 `themeIcons` 时，该模块还会为每个已声明且非默认、且有图标绘制的 variant 导出 `themeIcons<Variant>`（variant 以 PascalCase 表示，正如 variant 的导出采用它：`themeIconsFilled`）：同样的键，每个都是该图标针对该 variant 的导出，没有时则是其自身的导出。项目挑选该外观的主题设置 `icons: themeIconsFilled`。

### Authoring

- **FR13 — CLI 写入该集，一次一个经过验证的图标。** 每个图标命令都会以 `ERR_INVALID_OPTION`、并在写入文件之前，拒绝两个它不会同时遵守的选项：列表类选项（`--list`、`--definitions`、`--all-icons`）搭配查询、另一个列表类选项，或它忽略的选项；`<set>/<id>` 查询搭配 `--set` 或 `--limit`；`add --all` 搭配导出名、`--definition`、`--new-definition`、`--description`、`--words`、`--default` 或 `--id`；`add --definition` 搭配 `--new-definition`；`add --description` 或 `--words` 不带 `--new-definition`；`map --pairs` 搭配定义、图标或 `--remove`，以及 `map --remove` 搭配图标；`new-set --exclude` 不带 `--from`，或 `--default-variant` 不带 `--variants`。每个命令都静态读取模块，其写入是全有或全无：失败时每个文件都保持原样，错误带有稳定代码（写入失败为 `ERR_WRITE_FAILED`）。它只写入该集自己的文件、清单根，以及现有 package.json `files` 中该集的根与清单（architecture:cli-surface INV16）；包所需的每一项其他改动，它都作为要添加的确切文本给出：
  - `experimental icon new-set <name>` 写入描述符、一个空数据文件、生成模块（`generated`）及其声明文件和一个空主题映射，以及清单根。`--adapter ./<path>#<export>` 写入数据文件的 `adapter`；该文件必须存在于包中（`ERR_NOT_FOUND`），其他形式的值是 `ERR_INVALID_ARGUMENT`。已有图标的集只有在带 `--from` 时才接受另一个 adapter（`ERR_INVALID_OPTION`）。进入无图标集的第一个 `--from` 会创建它们：其回执没有 `refreshed`，其文本说明该集已创建（或在试运行中将会创建）。`--from <module>` 包装模块所导出的每个组件，并通过该集的 `adapter` 包装每个数据导出，作为 `<Name>Icon` 导出，仅在某个定义的名字恰好是某个图标的完整 `id` 时填充 `map`，并列出这些条目以供审阅。对于未映射的定义，它返回（从不写入）至多三条建议，按此顺序：`id` 是该定义名带或不带连字符或带复数 `s` 的拼写的图标（`lightbulb` 对应 `light-bulb`，`language` 对应 `languages`）；其库把该定义名作为另一个名称给它的图标；`id` 以按原样书写的该定义名开头、且其余词是它的词或仅表示其尺寸、形状或编号的图标，其多数词在前；`id` 是它的某个词的图标；其库把它的某个词作为另一名称给它的图标；`id` 以该定义名开头的其他图标（`delete-left`、`unlock-pattern`）；然后是两个词的 id，其第一个词恰好是一个单词的词，第二个词仅表示其尺寸、形状或编号（`grid-2x2`、`plus-circle`；绝不是 `card-sim` 或 `fast-forward`）。对于这些词，另一个 Astryx 定义也作为其名称或某个词拥有的词（`store`，`save` 与 `shoppingBag` 的词）排在只有该定义拥有的词之后。复数只连接其自身的单数，从不连接更长的 id（`users` 不是 `user-plus`），也不去掉其他词尾（`drafting` 不是 `draft`）。从不使用 `map` 已用过的图标、`id` 是另一个定义名的图标、否定形式（`lock-open`、`bell-off`）或相反方向（`moreHorizontal` 用 `ellipsis-vertical`）。对于导出名以观感词结尾的库（一种样式、一种尺寸、一种字重：`XOutline24WGHT500Icon`），从其尾部词读取——少数取值几乎填满每个导出、且带编号或包含样式词，但绝不是方向词（`ArrowUp` 与 `ArrowDown` 是两个字形）——为每个字形给出一个图标，命名时不带这些词（`x`、`XIcon`），采用默认 variant 命名的外观，否则采用该库通常的默认外观（`outline`、`regular`），否则取编号序列的中间值；回执命名它找到的外观以及有多少导出绘制这些图标。读取一千个或更多导出的模块时——在此处、在刷新时、以及在 `add` 中——会在文本模式下于 stderr 打印其进度，并按给定原样命名该模块。id 把维度保留为一个词（`Squares2X2Icon` 是 `squares-2x2`），并把单字母词与数字分开（`CalendarX2` 是 `calendar-x-2`）；共享的库前缀从 id 与名称中省略；以多个名称导出的图标只记录一次，其他名称作为词；`…Provider` 与 `…Context` 组件从不是图标；`--exclude` 把不是图标的导出添加到数据文件的 `exclude`，每次刷新都会遵守它。共享前缀去掉后 id 会以数字开头的图标保留该前缀（`fa0` 的 id 是 `fa-0`，导出为 `Fa0Icon`），而没有任何前缀可保留、且以数字开头的 id 会被拒绝并给出 `ERR_INVALID_ARGUMENT`。从已安装包读取时，它记录 `source`（库与版本），把该库的许可证声明复制进该集，并为描述符采用该库的许可证；当该库不提供、且该集与包也都没有时，回执在 `licenseNoticeMissing` 下命名要添加的 NOTICE 文件，且不写入任何内容。其回执作为要添加的确切文本命名：使生成模块公开的入口改动（包中入口文件的 `export *` 行，相对于它；对于没有入口的包，为 `index.js`、`index.d.ts` 及其 package.json 的 `main`、`types` 和 `exports`；对于已构建或 CommonJS 入口，为其构建自的源码行，绝不是已构建文件），它未声明的 `react` 以及可选的 `@types/react` 和 `@astryxdesign/cli` peer，以及在没有时运行 `integration check --strict` 的 `typecheck` 脚本。`--variants` 与 `--default-variant` 声明 `variants` 与 `default`；`--display-name` 与 `--description` 填充描述符。没有 `--from` 时，在现有集上，那四个选项会就地更新它，并保持其图标、`map` 和生成模块原样；图标拥有的 variant 必须保持已声明，有图标的集保留其默认 variant（在外观库中，拒绝会命名移动它的那次 `--from` 运行），回执带有 `updated`。导出名不命名任何外观的集在刷新时也保留其默认 variant，因为其图标保留其导出；拒绝会命名添加该外观的 `add --variant <name> --from <module> --all --set <set>` 运行。在现有集上，`--variants` 不带 `--default-variant` 时，在该集默认 variant 仍保持已声明期间保留它；在外观库中，它采用图标导出所绘制的外观，而 `--variants` 必须列出它。再次以 `--from` 运行时，它刷新该模块提供的图标（生成模块从其重新导出或适配的那些），并保留其图标存在的 `map` 条目；每个其他图标（作者的 `./` 美术资源、另一个库的）连同其 `map` 条目与 variants 一并保留，被其中之一拥有的 `id` 或导出的库图标会被排除并命名，而模块不再导出的、或 `exclude` 现在命名的每个图标都会被移除并为此原因命名，连同命名过它的 `map` 条目。现有图标先按生成模块从其重新导出的库导出被识别，然后按其自身的导出，再按其 `id`；以此匹配的一个保持其导出不变、其 `map` 条目以及每个其他字段，而当前规则对同一库名拼写不同的 `id` 会在 `renamed` 下报告（`add --variant <name> --all` 以同样方式遇到图标）。从包根进行的刷新还会刷新生成模块从该包某个文件读取的图标，以及它刷新的每个该图标 variant，前提是该根导出同一图标：一个解析到同一文件与绑定的导出，或当文件导出无法解析时同名的导出。它移到根 import，保留其 id、导出与其他字段，该图标在 `moved` 下报告。它仅通过该根导出匹配，带有其 id 或导出的根图标会被排除。当该集的另一个导出已读取该根导出，或较早的移动占用了它时，一个导出留在其文件上，回执也如此说明。刷新不再重新写入的每个导出都留在生成模块中。刷新会复制该集缺少的库许可证声明，而首次记录 `source` 的那次运行，在其 `license` 仍是 `new-set` 写入的那个值（包自身的，或 `UNLICENSED`）时，为描述符采用该库的许可证；作者改动过的 `license` 会被保留，回执把两者都命名。之后的运行保留描述符的 `license`。包自身的 `license` 从不写入。在外观库中，该集已包装的外观保留其图标与 `id`，因此一次包装一种外观的集不会丢失或重命名任何东西，而新字形只进来一次；新的 `--default-variant` 把每个字形自身的图标移到它命名的外观，图标保留其 `id` 与导出。不是该库任何观感词的新 `--default-variant` 会被拒绝，观感词会被命名，且不写入任何内容。
  - `experimental icon add <Export> --from <module>` 验证该导出，列出适合它的定义，并在带 `--definition` 或 `--new-definition` 时添加它并映射它；`--variant <name>` 把它添加为现有图标的那个已声明 variant，并用声明它的命令命名该集未声明的 variant，该命令命名该集的默认 variant。它列出的每个命令都以 `--set` 命名该集，并按传入原样重复 `--default` 与 `--id`，因此它按打印出的样子就能运行。新定义以 camelCase 或 kebab-case 命名，并以 camelCase 写入。从外观库中，它按其字形命名图标；当该集已为库的另一个导出导出了该字形的名称时，该导出在其 id 与名称中保留其观感词，或从 `--id` 取名；当它与被包装导出的不同之处中的第一个观感词是已声明且非默认的 variant 时，列表会添加把它添加为该图标 variant 的命令。带 `--variant <name> --all` 且无导出时，它在一次写入中为该模块包中 id 被该模块某导出拥有的每个图标添加该 variant（在外观库中为该字形该名称的外观），并为来自另一个包的每个图标添加该 variant——前提是该模块以相同名称与种类导出其库导出（一个把每种外观作为自己包发布的库）。一旦另一个包的一个图标以此方式匹配，该包的其他图标就按模块包的图标匹配，模块对其没有导出的每一个都被列为缺失：JSON 列出每一个，文本命名前十个以及还有多少个。来自另一个模块的任何其他图标都被放过，且不列为缺失，而在该名称的任何外观中都未绘制、或其自身导出就是该外观的字形，会被列为缺失。对于 package.json `files` 之外的 `./` 文件，它命名发布它的 `files` 数组。
  - `experimental icon map <definition> <icon>` 写入一个 `map` 条目，`--remove` 移除一个，`--pairs` 在一次受检写入中写入多个；在此处以及 `add --definition` 中，定义可以用其 kebab id 命名。`map` 仅以图标的 `id`、任意大小写的导出名，或其库将其导出所用的另一个名称（它带有的、不属于其 `id` 一部分的词）来命名图标；仅作为一个 `id` 一部分的内容（`magnifying-glass` 用 `glass`）会被拒绝，并给出带有它的图标；`new-definition` 写入该集自己的一个定义；`use <set>` 写入 `experimental.iconSet`。
  - 写入之后，`new-set`（带或不带 `--from`）、带导出名的 `add`，以及 `map`（也带 `--pairs`）回答 `templateMeanings`（`{unmapped}`）：捆绑模板使用（FR9）但该集 `map` 未命名的每个定义，形式为 `{definition, templates}`，模板多者在前，然后按名称；当全部映射时为空。试运行不回答任何内容。当列表不为空时，文本回执以一行结束，命名有多少个、前八个及其模板计数，以及带 `--set` 的 `map` 命令。
  - 生成模块重新导出每个库组件，或用 adapter 包装数据导出，并在每次变更时重写其声明文件与主题映射。它与它的声明文件无论格式化工具如何留下它们（带或不带分号）都逐语句读取，因此格式化后的模块会像 CLI 写入的那个一样被重写与检查。
- **FR14 — 导出契约。** 每个图标与 variant 都是包公共入口的一个具名 `<Name>Icon` 导出：一个 React 组件，或一次 adapter 调用，接受 SVG 属性、以 `currentColor` 绘制并填满其盒子。模块、名称与组件形状都被静态检查；颜色与尺寸用一个作者可复制的渲染测试来记录。

### Checks and catalogs

- **FR15 — `integration check` 证明该集与包相符。** 对每个集，它在不运行包的情况下报告：

  | 代码                              | 严重级别 | 何时                                                   |
  | --------------------------------- | -------- | ------------------------------------------------------ |
  | `invalid_icon_set`                | error    | 描述符、数据文件或某个定义文件无效                     |
  | `icon_builtin_definition_missing` | error    | 某个内置定义不在 `map` 中                              |
  | `icon_definition_unused`          | warning  | 该集声明的某个定义不在 `map` 中                        |
  | `icon_definition_shadowed`        | warning  | 该集声明的某个定义与某个 Astryx 定义同名               |
  | `icon_module_not_public`          | error    | 某个图标是从包公共入口之外读取的                       |
  | `icon_export_name`                | warning  | 某个导出未命名为 `<Name>Icon`                          |
  | `icon_not_component`              | error    | 某个导出是字面量，不是组件或 adapter 调用              |
  | `icon_export_missing`             | error    | 某个导出、生成模块、adapter 或某个外观的主题映射不存在 |
  | `icon_module_invalid`             | error    | 该集的模块、它重新导出的某个文件，或生成模块无法解析   |
  | `icon_generated_types_mismatch`   | error    | 生成的声明文件缺失或已过期                             |
  | `icon_theme_map_mismatch`         | error    | 主题映射或某个外观的主题映射与 `map` 的内置条目不一致  |
  | `icon_source_version_drift`       | warning  | 数据所命名的上游版本与包所依赖的不同                   |
  | `icon_license_notice_missing`     | warning  | 带上游的集未提供许可证声明                             |

  定义类发现会命名该定义的描述与词，以及修复它的 `icon map` 命令（带 `--set`），并按 `new-set` 使用的规则（FR13）建议图标，绝不从词的一部分取。当包的入口既不导出该集的主题映射，也不导出其任何图标时，一条 `icon_export_missing` 会命名与 `new-set` 回执相同的入口改动（FR13），代替每个图标一条发现：对于已构建入口，为其构建自的源码，绝不是已构建文件。读取器无法读取的 CommonJS 入口则被列为未检查。每个外观的主题映射（FR12）像主题映射一样受 `map` 约束，每个条目对照该图标针对该 variant 的导出，没有时对照其自身导出。当生成模块缺少一个时，`icon_theme_map_mismatch` 发现会命名写入它的 `experimental icon add --variant <variant> --from <module> --all --set <set>` 运行，`<module>` 是该外观多数导出的来源；当模块有它而包的入口未导出它时，`icon_export_missing` 会如此说明。错误使检查失败；警告在 `--strict` 下失败。仅为这些检查，重新导出会沿相对文件与已安装包被跟随，且导出只在读取器证明其不存在时才失败。以下两项都不是问题，从不计数、从不失败，即使在 `--strict` 或 `--next` 下，位于 validate 结果的附加字段 `iconSets` 中（每个为 `{set, unmappedDefinitions, suggestions, unchecked}`）：某个集未映射的可选 Astryx 定义，打印为 “Unmapped icon definitions (optional)”；以及检查无法判定的内容，每个 `{icon}`、`{adapter}` 或 `{entry}` 带上其 `reason`，打印在 “Not checked” 之下（`architecture:cli-surface` INV35、DEC-7）：其模块是尚未构建的包 `exports` 目标的图标导出；读取器无法证明任何一种情况的图标或 adapter 导出（位于它无法跟随的重新导出之后、绑定到默认或命名空间 import，或从无法解析的包导入）；以及读取器无法读取的主题映射或主题映射条目。读取器完整读取的模块所缺少的导出仍然是 `icon_export_missing`。每个集的条目还有 `templateMeanings`，即创作回执所回答的同一列表（FR13），在 “Template icon meanings not mapped” 下每个集打印一行；它从不计数，也从不让检查失败，即使在 `--strict` 或 `--next` 下。

- **FR16 — 较旧的 CLI。** 已发布的 CLI 0.7.3 拒绝页面与块模板、命名空间文档和主题描述符上的 `stability`，并拒绝模板的 `icons`，丢弃该描述符。本功能所写入的集成描述符都不在那里设置 `stability`。对于正在创作的包，当包的 CLI peer 范围允许 0.7.4 之前的发布版本时，validate 结果的附加字段 `olderCliNotes`（每个为 `{file, kind, field, message}`）会命名每个设置 `stability` 的模板或命名空间文档，以及每个声明 `icons` 的模板；提示从不计数，也从不让检查失败（DEC-9）。0.7.4 之前的 CLI 也会拒绝设置 `experimental.iconSet` 的 astryx.config（“Unrecognized key”），因此加载项目配置的命令（例如 `doctor` 与 `discover`）在该项目中失败；0.7.12 之前的 CLI 拒绝以列表形式写入的 `experimental.iconSet`；0.7.16 之前的 CLI 拒绝设置 `experimental.iconVariant` 的 astryx.config。当项目声明了一个 `@astryxdesign/cli` 范围（在任何依赖字段中）允许某个拒绝它写入值的发布版本时，`experimental icon use` 会在其回执中添加 `warning`，打印为 `[warn]` 行；未声明任何范围的项目，或声明 `workspace:`、`file:` 或 `link:` 范围的项目，都得不到它。CLI 严格读取集的数据文件：它不认识的键会撤回该集，并命名该键（FR17）。`exclude` 只被数据文件参考列出它的 CLI 读取，而 `new-set` 仅在给出 `--exclude` 时写入它；没有它的集会被每个拥有 `astryx experimental icon` 的 CLI 读取。
- **FR17 — Doctor 与 discover 仅在选择启用时读取集。** 在设置了 `experimental.iconSet` 的项目中，列表命名的每个集都是以下之一：有效（`selected`）、未安装（`missing`）、被两个包以该名称提供（`ambiguous`），或已安装但被撤回（`withdrawn`：无效，或其模块无法解析，附带该原因）。Doctor 的 `icon-sets` 检查在列表命名了某个不是有效的主集或后备集时失败，并说明是哪个以及为何；在 `experimental.iconVariant` 命名了主集未声明的 variant 时失败，并命名其 variants 以及选择其中一个的 `use` 命令（对于只有一种外观的主集，则是移除它的 `use` 命令）；在安装了两个以上集而列表遗漏了一个时失败，并给出添加它的 `use` 命令；当另一个已安装集被撤回时发出警告。其通过消息命名项目的外观。Doctor 的 `icon-placeholders` 检查把项目自身的源码（不是依赖或构建输出）作为语法树读取，查找 CLI 所写入确切形状的 FR19 声明（任意名称），以及它的使用；被注释掉或引用的副本从不计数。只要还有任何使用残留它就警告，命名每个文件及其使用的注释所记录的定义，并给出两个修复；没有残留时通过。模板 `icons` 报告与 `experimental icon --list` 带有相同的状态与原因，且带 `--set`（带词或 `--all-icons`）或 `<set>/<id>` 的 `experimental icon`、`experimental icon use` 与 `discover <package>/<set>` 会把撤回的集说成已撤回并给出原因，而不是说成未安装，各自带 `ERR_NOT_FOUND`；`add`、`map` 与 `new-definition` 以同样方式命名正在创作的包中撤回的集。`astryx discover` 把 `icon-set` 读作一种种类：`--type icon-set`、带 `iconCount` 与 `definitions` 的目录条目，以及 `discover <package>/<set>`；撤回的集不会被列出。没有选择启用时，Doctor 没有这样的检查，也不报告图标集问题或占位检查，`doctor integration` 仅在选择启用时检查已安装包的图标集（正在创作的包——由不带包的 `doctor integration validate`、`integration check` 和 `verify` 读取——总会被检查），而 discover 在验证目录之前把 `icon-set` 当作未知种类、把 `iconCount` 与 `definitions` 当作未知字段，因此格式错误的图标集条目不使任何源码失败（`spec:AST-051/FR7`）。

### Placeholder and previews

- **FR19 — 本地占位符。** FR9 写入的占位符是复制文件中一个函数组件，其类型由 `<svg>` 的 props 决定。它绘制一个虚线方块，宽高均为 `1em`，颜色为 `currentColor`，因此它会随周围文本一起确定尺寸，而 CSS 或 `Icon` 会像对待任何图标组件那样为它设定尺寸。除非使用处为它提供 `aria-label` 或 `aria-labelledby`（这会使其成为 `role="img"`），否则它是装饰性的（`aria-hidden`）；使用处传入的 prop 优先。它没有自定义 data 属性。没有包导出它，因此不会改动任何 Astryx 包、路由或依赖（DEC-10）。
- **FR20 — 文档站预览。** 文档站的构建设置 `DOCSITE_ICON_SET` 是实验性的，它指定一个主图标集和可选的备用集，以逗号分隔。设置之后，一个构建期加载器会用文档站中安装的图标集，把每个模板与区块的预览源经 FR9 重写一遍；不可用的主集会令构建失败。重写后的导入从文档站（图标集安装之处）解析，构建缓存以该设置为键，因此设置改变会重新构建预览。未设置时，不添加加载器，预览保留其模板的图标。

### Supporting pieces

- **FR18 — 增量式文档支持。** 除 `ThemeDoc` 和 `IconSetDoc` 之外的每种文档类型，以及每个 schema 字段和枚举值，都接受 `stability: 'experimental'`：help 会把带标记的命令显示为 `[experimental]`，稳定表会略去带标记的字段或值，search 会略去带标记的文档，Doctor 的文档计数也会把带标记的文档排除在外。命名空间的 `source.packages: 'all'` 只有在标记为实验性的 CLI 命名空间（图标定义）上，才会采用来自每个包的文档组；DEC-7 拥有对 `spec:AST-046/FR2` 的这一例外。

### Platform support

- 支持的引擎：CLI 的 Node 下限。
- 不支持的行为：模块无法解析的图标集不应答查找，模板保留其图标。
- 浏览器证据：无；每项行为都是 CLI 输出、写入的源码或模块的导出。

## Current-state impact

- `architecture:cli-surface`：`experimental` 命令组与 `experimental icon` 命令及其响应类型、`experimental.iconSets` 清单根、`icon-set` 与 `icon-definition` 描述符种类、`cli/experimental` 文档命名空间、`icon-sets` 与 `icon-placeholders` 这两项 Doctor 检查、图标集相关的检查、`template_icon_undeclared` 的 next 提示，以及 `iconSets` 与 `olderCliNotes` 这两个 validate 字段。
- 文档站：实验性的 `DOCSITE_ICON_SET` 构建设置。
- `contributing:cli-conventions`：`IconSetDoc`、`IconSetData` 和 `IconDefinitionDoc` 加入创作类型。
- 使用方文档：`cli/experimental/icon-sets`、`cli/experimental/icon-set-files` 和 `cli/experimental/icon-definitions`。
- `spec:AST-051`：discover 的 `icon-set` 种类，仅在主动选择启用时才读取。

## Verification

| 契约      | 验证                                                         | 代表性状态                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 变更或失败预期                                                                                                                                                                                             |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR0, FR11 | 针对未启用该功能的 CLI 输出运行实验性隔离测试                | help；清单；每个稳定的文档主题与树节点、`cli` 列表以及每个稳定的 `cli` 文档节点；对 `delete`、`close`、`icon`、`trash can`、`search`、`experimental` 和 `icon set` 的搜索，分别在未安装图标集与已启用图标集的情况下进行；打印与复制的模板；discover、Doctor 以及 `doctor integration validate <package>`，在有图标集但未启用的情形下；每个会打印集成问题提示的命令的 stderr，在有图标集但未启用的情形下。金标保留标识、结构、计数、每个 `stability`，以及每条命名实验性表面、图标集或图标定义的句子或链接，而不涉及散文 | 稳定的输出多出一个结果、字段、小节、计数、`stability`，或多出一条命名实验性表面的句子或链接，而这些是未启用该功能的 CLI 所没有的（FR18 的 `stability` 字段除外）；或者稳定的命令多出一个图标集子命令或种类 |
| FR1–FR5   | 描述符、数据文件与定义的解析器及发现测试                     | 有效图标集；无效数据；Astryx 与该图标集都有的定义                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 无效的图标集应答，或有定义文件未被读取                                                                                                                                                                     |
| FR6–FR8   | `experimental icon` 的文本与 JSON 测试；`use --variant` 测试 | 定义、名称与含义匹配；`<set>/<id>`；`--list` 在指定顺序、在有两个图标集且未选择任何集时；带备用集的 `use`；同名两个图标集；`--definitions` 在图标集包中、在带有主图标集的项目中、配合 `--set` 以及在未指定集时；`use` 修复在图标集写作 `<package>/<set>` 时、在名称由两个包提供时；`use --variant` 与列表在同一次写入中写入、不在列表中时被移除、对主图标集缺少的变体以及只有一种外观的主图标集被拒绝、在配置无法写入时；仅指定一个变体的配置；带变体的 `--list`                                                        | 排名或并列顺序改变，或者一个裸的歧义名称应答；或者变体在无列表时被写入、主图标集缺少的变体被写入，或者一次失败的写入留下某个键已写入                                                                       |
| FR9–FR10  | 模板映射测试；`integration check` 测试；内置模板声明测试     | 按匹配与按定义映射；一个主图标集和一个备用集；一个由两种含义共用的占位符声明，在 `MissingIcon` 已被占用时使用一个空闲名称；缺失的外观；在带有建议的情况下保留；一个包装模板库的图标集，分别作为主图标集和备用集；一个未声明的图标；一个内置模板中两个不同图标共用同一定义；未启用；一个项目变体：一个已映射的图标，带与不带该外观，一个来自主图标集自身库的图标，已映射或仅重新导出，带与不带该外观，一个从列表中的图标集导入、采用另一种外观的图标，一个不带该外观的备用集                                             | 名称被猜测、某个图标保留了没有任何图标集拥有或包装的库导入、图标集在一个图标内混用，或者未启用的项目被重写；又或者缺失的外观把某个图标移到另一个图标集                                                     |
| FR12–FR14 | 写入器与命令测试                                             | 包装与刷新；适配器；生成的类型与主题映射；针对留下未映射模板含义的图标集的回执，以及针对把它们全部映射的图标集的回执；一次试运行；首次包装进一个没有图标的图标集；`--adapter` 在新图标集上、在没有图标的图标集上，以及格式错误或缺失的情况下；缺失超过十个时的 `add --all`；为一个带有其他词、共有词以及 `bank` 的 id 提供建议；某个外观的主题映射在某个图标绘制该外观后被写入、带类型、其中一个条目的图标缺少该外观、在更旧的模块中缺失、其他图稿、未被该条目导出                                                      | 写入留下半成品，或者主题映射偏离 `map`；又或者某个外观的主题映射偏离 `map` 以及各图标的变体                                                                                                                |
| FR15      | `integration check` 测试，分别带与不带 `--strict`            | 每种代码；未映射的可选定义；`--strict` 下未映射的模板含义                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 模块缺少的导出通过，或者可选列表使检查失败                                                                                                                                                                 |
| FR16      | validate 测试；在已发布的 CLI 0.7.3 上的临时项目             | 模板与命名空间文档上的 `stability`；模板的 `icons`；来自 0.7.4 的 peer 范围；带有来自 0.7.12 的范围的 `experimental.iconVariant`                                                                                                                                                                                                                                                                                                                                                                                        | 一条提示使检查失败，或者被丢弃的描述符未被标注                                                                                                                                                             |
| FR17      | Doctor 与 discover 测试                                      | 已启用；一个正在使用、被注释掉以及被加引号的占位符；已安装图标集但未启用；无效图标集且未启用；主图标集未声明的变体，以及针对只有一种外观的主图标集的变体                                                                                                                                                                                                                                                                                                                                                                | 未启用的项目会看到图标集检查、问题或种类；或者主图标集缺少的变体通过                                                                                                                                       |
| FR19–FR20 | 占位符声明的模板映射测试；文档站加载器与配置测试             | 该声明的尺寸、颜色与标签；没有 data 属性；设置未设置与已设置；一个未被安装的图标集                                                                                                                                                                                                                                                                                                                                                                                                                                      | 占位符在无名称的情况下被播报，或者未设置的构建设置发生改变                                                                                                                                                 |
| FR18      | 文档树、help 与 search 测试                                  | 带标记的命令；带有 `packages: 'all'` 的稳定命名空间与实验性命名空间                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 稳定命名空间采用了另一个包的文档，或者带标记的文档进入 search                                                                                                                                              |

## Decision log

### DEC-1 — The set is the item; its data file is the payload

**Reference:** `spec:AST-084/DEC-1`

**Decider:** `josephfarina`, `2026-10-20`

每个图标集一个描述符，维持了“无目录”规则，且每个界面都读取同一个数据文件，因此查找、模板与主题对某个图标的含义达成一致。

已否决：每个图标一个文档文件，成千上万个手工维护的文件无法与库保持同步。

### DEC-2 — Find icons with a dedicated command

**Reference:** `spec:AST-084/DEC-2`

**Decider:** `josephfarina`, `2026-10-20`

图标答案需要其导入行、变体和定义，因此 `astryx experimental icon` 以完整记录作答。`astryx search` 是实验从不供给的稳定界面；图标在晋升时加入它。

### DEC-3 — An icon no set has becomes a placeholder

**Reference:** `spec:AST-084/DEC-3`

**Decider:** `josephfarina`, `2026-11-09`

项目选择自己的图标。来自项目从未选择的库的图标是游离依赖和错配的外观，因此，若某个图标具有的含义在项目的列表中没有对应图标集，它就会变成占位符，并附上一条提示和两个修复命令，Doctor 会列出项目代码中每个遗留的占位符。来自列表中某个图标集所包装的库的图标就是项目选择的图标，因此它保留其导入。

已否决：保留来自列表中没有任何图标集拥有或包装的库的原始导入，这会留下一个依赖和一个项目并未选择的图标。

### DEC-4 — Astryx owns the definitions; sets map to them

**Reference:** `spec:AST-084/DEC-4`

**Decider:** `josephfarina`, `2026-10-20`

共享定义让模板命名含义，而不是命名库。图标集用自己的文件扩展它们，而 CLI 从不把任何库编码进去。

### DEC-5 — Every icon is a component the package exports

**Reference:** `spec:AST-084/DEC-5`

**Decider:** `josephfarina`, `2026-10-20`

应用、模板与主题映射都从图标集所属的包导入每个图标；生成的模块与适配器让纯数据的库以同样的方式工作。

### DEC-6 — Icon sets ship experimental

**Reference:** `spec:AST-084/DEC-6`

**Decider:** `josephfarina`, `2026-10-20`

在真实图标集验证该设计期间，命令、键、数据文件和输出可能在补丁版本中变化。每个界面都使用其种类的实验性边界，未启用该实验的项目看到的仍是此前的输出。

### DEC-7 — Experimental namespaces may adopt docs from every package

**Reference:** `spec:AST-084/DEC-7`

**Decider:** `josephfarina`, `2026-10-20`

图标集会添加自己的图标定义，它们应当与 Astryx 的定义放在一起，因此命名空间的 `source.packages: 'all'` 会采用来自每个包的文档组。这是对 `spec:AST-046/FR2` 的实验性例外，仅在标记为 `stability: 'experimental'` 的 CLI 命名空间上读取；每个稳定命名空间只采用自己包的文档，与 `spec:AST-046/FR2` 所述完全一致。

已否决：把每个图标集的定义放在它自己的包下，这会把一套词汇拆分到与图标集数量相同的命名空间中。

### DEC-8 — `icon-set` is a seventh discover kind, behind the opt-in

**Reference:** `spec:AST-084/DEC-8`

**Decider:** `josephfarina`, `2026-10-20`

图标集是包添加的一个条目，因此 discover 会像 `spec:AST-051/FR5` 的六种种类那样列出它，并带有增量式目录字段 `iconCount` 和 `definitions`。只有设置了 `experimental.iconSet` 的项目才会读取它们。没有该设置时，`--type icon-set` 会以 `ERR_INVALID_OPTION` 失败，未知种类的错误会列出这六种，而该种类及其字段在 `spec:AST-051/FR7` 下是未知的，因此输出与不含图标集的 CLI 一致。

### DEC-9 — `olderCliNotes` is additive and never fails

**Reference:** `spec:AST-084/DEC-9`

**Decider:** `josephfarina`, `2026-10-20`

如果作者的 peer 范围允许更旧的 CLI，该作者需要知道那个 CLI 会丢弃什么，但该包对执行检查的 CLI 而言是有效的。因此 validate 添加了字段 `olderCliNotes`：它从不会计入摘要，也从不会使检查失败，无论是否使用 `--strict` 或 `--next`。

### DEC-10 — The placeholder is local to the copied file

**Reference:** `spec:AST-084/DEC-10`

**Decider:** `josephfarina`, `2026-11-09`

图标集是实验性的，而复制出的文件不得依赖于某个可能在补丁版本中变化的导出。因此 CLI 会把占位符写入该文件，只写一次，且不改动任何包、注册表路由或依赖。Doctor 能可靠地找到它，因为它从语法树而不是从文本中读取该声明的确切形状。

已否决：一个实验性的 Core 导出，它会为一个只存在于少数复制文件中的缺口标记，给每个 Astryx 项目添加一个公共组件和一条注册表路由。

### DEC-11 — The list decides every icon, one set per icon

**Reference:** `spec:AST-084/DEC-11`

**Decider:** `josephfarina`, `2026-11-09`

主图标集加有序的备用集，让项目可以填补缺口，而在同一含义内不混用外观。选择主图标集即是启用，并由它声明顺序，因此未启用的项目无论安装了哪些图标集都会保持原有输出。启用之后，已安装但被排除在列表之外的图标集会构成 Doctor 失败，否则模板使用哪个图标集将取决于安装顺序。

### DEC-12 — One project look, matched by name

**Reference:** `spec:AST-084/DEC-12`

**Decider:** `josephfarina`, `2026-11-13`

项目为每个图标选定一种外观：其主图标集的一个变体。列表中的每个图标集绘制该名称下的自己的变体，这是模板在图标集之间遵循的规则，因此命名相同外观的图标集绘制出的外观也相同，而主图标集针对该外观的主题映射会绘制其中的内置图标。若某个图标所在的图标集缺少该外观，该图标保留此图标集的默认外观，因为它的含义比它的外观更重要。

已否决：每个图标集一种外观，这会让一个项目混用外观；一份 Astryx 维护的、各图标集映射到的外观名称列表，它与主题列出的变体名称并列，构成第二套词汇（`spec:AST-087/DEC-9`）；以及在渲染时按图标选择外观，那属于 Icon 组件。

## Open questions

无。
