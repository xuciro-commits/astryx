---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-051
authority: current
archive_reason: null
superseded_by: null
approved_by: josephfarina
approved_at: 2026-10-20
phase: accepted
owners: [josephfarina]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: []
affects_consumer_docs: [authoring]
---

# Discover integration manager system spec

## Intent

一个正在构建 Astryx 应用的人或 agent，希望不离开终端就能知道存在哪些集成、每个集成添加什么、应用已经有哪些，以及发布了哪些版本。`astryx discover` 回答的正是这个问题。它是集成的只读管理器：列出项目已具备的内容、官方 Astryx 包，以及其来源所能提供的内容，显示每个包的版本及其添加的内容，并对所有这些内容进行搜索和过滤。安装、更新和删除包由项目的包管理器负责。

本记录负责 discover 显示什么、可用集成列表来自哪里、CLI 自带的那份官方列表，以及当某个来源无法访问时会发生什么。`spec:AST-031` 负责具名导出特性如何组合；discover 的来源遵循它，除非本记录另有说明。

## Non-goals

- 安装、更新或删除包。这些由包管理器完成，而 autolink 会加载新安装的集成，无需 discover 步骤。
- 托管 catalog。官方列表随每个 CLI 发行版本一同发布，且从不被抓取（FR11）。
- 来源如何登录。来源以运行 CLI 的那个人的身份运行，并使用其宿主已有的任何凭据。CLI 从不提示（`architecture:cli-surface` INV1），也不为来源读取任何 Astryx 拥有的环境变量（`spec:AST-017` FR14）。
- `astryx search`，它仍然只针对已安装内容。
- 等效的内部实现只要满足本契约，就仍然有效。

## Requirements

- **FR1 — 列表显示项目已具备的内容和它可以添加的内容。** 在没有查询时，以及在既不加载任何集成、也没有自己的 discover 来源的项目中执行任何查询时，discover 必须列出项目所加载的每一个集成（已配置的或 autolink 的），以及官方列表（FR11）提供的、由项目自身的 `package.json`（即 discover 运行所在文件夹之上最近的那一个）在 `dependencies`、`devDependencies` 或 `optionalDependencies` 中按其名称或某个 npm 别名声明的每一个官方包，每项都带上其版本、按类型分列的一组“它添加的内容”，以及某个来源已知的最新发布版本。随后它必须按集成各列出一次，列出其来源所提供的、项目既未加载也未声明为依赖的每一个包，每个包都附带可添加它的包管理器命令（FR2），并且不得提供这样的包：项目已以另一个名称拥有它的集成。官方包在这两个列表中都排在最前。加载失败的集成会被略去，官方集成也不例外；integration-issues 警告和 Doctor 会报告它。
- **FR2 — 包页面显示其版本以及各版本添加的内容。** `discover <package>` 必须显示所示版本添加的内容（按类型分组）、项目是否已有该包、其最新发布版本，以及从新到旧排列的各版本及其日期和任何无法读取的状态，并且必须统计其预发布版本。`discover <package>@<version>` 显示任意版本，包括预发布版本；默认是已安装版本，否则是最新发布版本。任何来源都未列出的版本必须以 `ERR_NOT_FOUND` 失败，并给出一些版本建议。对于项目没有的包，discover 必须以文本形式打印可添加它的包管理器命令，并且不得执行它；对于项目已有包的别名，它改为指明该包。对于官方列表提供的包，该命令固定 FR11 所指明的版本，并为 shell 给该范围加上引号。
- **FR3 — 条目页面显示单个条目。** 对于已安装的组件，`discover <package>/<Component>` 继续打印其文档。包所添加的任何其他条目，无论已安装还是由某个来源列出，都必须解析出它的类型、名称、包、版本，以及项目是否已有它。
- **FR4 — 搜索覆盖每一种类型和每一个来源。** `discover <words>` 必须按名称、标题、摘要和关键词，匹配已安装组件、项目其他已安装条目、包名称和描述，以及来源为项目可以添加的包所列出的每一个条目。它必须以匹配列表作答，即使某个名称完全匹配或只有一个条目匹配也是如此，因此响应类型取决于查询的形式，而绝不取决于项目拥有什么。匹配按名称匹配的紧密程度排序，相同条件下已安装条目在前。每个匹配都说明其类型以及项目是否已有其包。单个条目通过其包路径打开（FR3）。
- **FR5 — 过滤器沿用 CLI 已有的选项。** `--type <kind>` 只保留一种类型（`component`、`template`、`doc`、`theme`、`codemod`、`agent-doc`）：在列表中保留添加该类型的包；在搜索中保留该类型的条目。`--installed` 和 `--available` 只保留一侧，二者同用时必须以 `ERR_INVALID_OPTION` 拒绝。`--limit <n>` 限制搜索结果数量（默认 20），当它截断了列表时，响应会报告总数。未知的类型或非正整数的 limit 必须以 `ERR_INVALID_OPTION` 失败。在设置了 `experimental.iconSet` 的项目中，`icon-set` 是额外的类型（`spec:AST-084/DEC-8`）；未设置时 discover 保留这六种类型，并以 `ERR_INVALID_OPTION` 拒绝 `--type icon-set`。
- **FR6 — 来源是由项目、集成或 door 提供的函数。** 来源是一个异步函数，接收 `{signal, package?, version?}` 并解析为一个 catalog；`package` 请求一个包及其全部版本，`version` 请求该版本的条目。项目可以把来源设为 `astryx.config` 的 `discover` 字段，每个已加载的集成可以将其作为 `discover` 具名导出，door 也可以传入自己的来源（`spec:AST-081` FR1），discover 会以该 door 的名字命名它。每一个来源都会被调用：先是项目的，然后按加载顺序是各集成的，最后是 door 的；同一个函数只会运行一次；随后 discover 读取官方列表（FR11）。某个来源抛出异常、超过 30 秒（通过 `signal` 发出信号）或返回无效的 catalog 时，只有它自身失败：其他来源仍然有效，discover 会报告哪个来源失败以及原因。来源只进行读取，因此 `spec:AST-031` 的同意门禁不适用于它们。
- **FR7 — catalog 的形状是有版本的。** catalog 为 `{schemaVersion: 1, source, packages}`。`source` 包含 `name`、`generatedAt` 和 `complete`。每个包包含 `package`、`integration`（由发布同一集成的每个包名共享）、`aliases`、可选的 `description`、`latest`、`versions`（每项含 `version`、`publishedAt`、`prerelease` 和 `status`），以及所请求版本或最新版本的 `contributions`（每项含 `kind`、`name`，以及可选的 `title`、`summary` 和 `keywords`）。CLI 必须校验每一个应答，必须忽略它不认识的字段和类型，必须拒绝任何其他 `schemaVersion`，并且必须无论来源以何种顺序返回版本，都按发布时间从新到旧显示版本。当两个来源列出同一个包时，使用较早来源的条目。在设置了 `experimental.iconSet` 的项目中，`icon-set` 贡献还可以带有 `iconCount` 和 `definitions`（`spec:AST-084/DEC-8`）；未设置时 discover 将 `icon-set` 条目及其这些字段视为未知而忽略。
- **FR8 — 保存的副本覆盖不可达的来源。** 来源应答之后，discover 必须按来源、按请求把该应答保存在平台按用户划分的缓存目录中，绝不保存在项目里。当该来源之后失败时，discover 必须对同一请求使用保存的应答，并说明它是在何时保存的。没有保存的应答时，该来源不添加任何内容，discover 会说明这一点。已安装的集成始终会出现，无论有没有来源。
- **FR9 — JSON 保持兼容。** 现有的响应类型和字段保持其含义；新信息是附加的。`discover.list` 的 `data` 列出项目已具备的内容（FR1），带有可选的按类型分列的列表和 `latest`；`meta.available` 列出项目可以添加的内容，`meta.sources` 报告每一个来源，官方列表在最后。`discover.detail` 携带 `installed`，在有来源时还携带 `latest`、`aliases`、`source`、`versions`，以及 `install` 或 `installedAs`。已安装组件以外的条目使用 `discover.item` 类型。`discover.search` 的匹配携带 `kind` 和 `installed`，`component` 对每一种类型都存放条目名称，当 `--limit` 截断了列表时会出现 `data.total`。自由文本查询返回 `discover.search`，绝不返回 `discover.detail.doc`（FR4）。
- **FR10 — 包可以链接其文档站点。** 集成清单可以设置 `docsiteUrl`，即该包文档站点的 URL，以便列出该包的各个 catalog 可以链接到它。CLI 必须将其作为已知键接受，且不产生未知键警告，除此之外不对它做任何事。
- **FR11 — CLI 自带官方列表。** 每个 CLI 发行版本都自带官方包列表：该发行版本发布的、至少添加一个 discover 所列出条目的每一个包。该列表在构建 CLI 时从仓库生成，绝不手工编辑，当它不再匹配仓库时某项检查会失败。它不包含版本。条目的最新发布版本是 CLI 所知道的最新发布版本：在发行版 CLI 上是它自己的版本，或者当项目的 Core 版本是更新的发布版本时，是项目的 Core 版本。对于始终按 Core 版本发布的包，其条目会列出发行版 CLI 自己的版本和项目的 Core 版本（已安装的或精确声明的），因此二者都可以被查询；其添加命令固定项目的 Core 版本，否则固定项目所声明的 Core 范围，否则固定最新发布版本，而在没有 Core 的项目中使用 canary CLI 时则不作固定。只有 canary CLI 会列出仅限 canary 的包，且作为预发布版本：当项目的 Core 版本是预发布版本时按该版本列出，当项目没有 Core 时按 CLI 自己的版本列出，而不会列在已发布的 Core 旁边，也不会列在未带精确版本声明的 Core 旁边，因为无法用这些版本安装它们。对于仅由该列表提供的包，条目未列出的版本或条目会以 `ERR_UNKNOWN_PACKAGE` 失败。discover 在其余每一个来源之后读取该列表，因此对于它列出的官方包，以及对于其集成以另一个名称发布的任何官方包，都会使用来源的条目（FR7）；该列表则补充没有任何来源覆盖的官方包。官方包在两个列表中都排在最前。官方条目读起来与任何其他包一样，没有属于自己的小节，并把其来源命名为 `Astryx`。
- **FR12 — 包可以为其 logo 命名，检查会说明一个 catalog 需要什么。** 集成清单可以设置 `logo: {light, dark?}`，即相对于包根目录的路径，指向该包附带的图片，以便列出该包的各个 catalog 可以显示其 logo。每张图片都是 PNG、JPEG、WebP，或仅用形状绘制的 SVG，最大 512 KB，其文件扩展名指明其格式。CLI 必须将 `logo` 作为已知键接受，并拒绝不是带有字符串 `light` 的对象的 `logo`。`integration check` 会增加两条包级提示。`package_without_logo` 指明未设置、不是此类图片或未被打包的 logo；当清单未设置 `logo` 时，检查以同样的方式读取 package.json 的 `marketplace.logo`，而 npm 无法被询问的 logo 会连同命名它的文件一起列在 `exampleAssets` 中。`package_without_example` 指明这样一个包：在组件示例提示的各项豁免之后，当没有块模板是 showcase（`isShowcase: true` 且带 `exampleFor`，或 `alsoShowcaseFor`）时，其组件需要一个示例。仅由主题、文档或 codemod 组成的包不需要示例，仅由 icon set 组成的包两条提示都不会产生。这两条提示都只是信息，无论是否带有 `--strict` 或 `--next` 都不会让检查失败；它们与组件示例提示是分开的，后者属于 `next` 提示。

### Platform support

- 受支持的功能/引擎下限：每一个受支持的 CLI 运行时。
- 不支持的行为：无。来源从其机器上需要什么，是作者的责任；无法在那里运行的来源会按 FR6 失败。
- 浏览器证据：不适用。

## Current-state impact

- `astryx discover` 之前只列出带组件根目录的已配置集成，并且只匹配组件名称；其 `description` 和 `displayName` 字段从未被填充。本记录以附加方式取代该行为（FR9）。
- `discover <Name>` 之前会在名称完全匹配或为唯一匹配时打开某个已安装组件的文档。现在它列出匹配项，而 `discover <package>/<Name>` 会打开文档（FR4、DEC-4）。
- `architecture:cli-surface`：discover 适配器调用来源并保留保存的副本（INV21）；该保存副本的路径在缓存目录下通过 `assertWithin`（INV10）。
- `spec:AST-031`：`discover` 是第二个具名导出特性，但不带同意门禁（FR6）。
- 使用方文档：`authoring` 增加 `discover` 具名导出和配置字段，`astryx docs authoring` 增加 `discover-source` 小节。
- 在没有配置来源的情况下，`astryx discover` 之前只列出项目的集成。现在它还会列出官方包（排在最前），每个都附带可添加它的命令；官方列表提供的已声明官方包，从项目的任何文件夹看都算作已安装（FR1、FR11）。对于仅由官方列表提供的包，其条目未列出的版本或条目会以 `ERR_UNKNOWN_PACKAGE` 失败，这也是没有任何来源列出某个包时的答案（FR11）。在既不加载任何集成、也没有自己的来源的项目中，查询会以该列表作答，与没有官方列表时一样（FR1）。
- 发行：CLI 构建从该发行版本发布的包生成官方列表，当已提交的列表过期时漂移检查会失败（FR11）。`astryx docs authoring` 的 `discover-source` 说明官方列表先于每一个来源。

## Verification

| 契约 | 验证                                        | 代表性状态                                                                                                                                                                                                         | 变异或失败预期                                                                                                                                                                                                                                                                                            |
| ---- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 列表叶子、catalog 视图、适配器、命令测试    | 仅已安装；仅可用；两者皆有；已知最新版本；已安装包的别名；已声明的依赖；已声明的官方包；官方包与其他包共存；在既无集成也无自有来源的项目中发起查询                                                                 | 缺少某个可用包、提供了某个别名或已声明的包、缺少 latest、已声明的官方包未被视为已安装、官方包未排在最前，或该查询未以列表作答                                                                                                                                                                             |
| FR2  | 详情叶子、适配器与命令测试                  | 已安装；未安装；`@version`；预发布；未发布的版本；别名；带与不带 Core 的官方条目                                                                                                                                   | 某个版本被丢弃、默认值错误、添加命令被执行、提供了别名，或官方条目的添加命令未被固定                                                                                                                                                                                                                      |
| FR3  | 条目叶子与分派器测试                        | 已安装的组件；已安装的模板；来源列出的条目；未知条目                                                                                                                                                               | 已安装的组件丢失其文档，或来源列出的条目未被找到                                                                                                                                                                                                                                                          |
| FR4  | 搜索叶子与命令测试                          | 组件、模板、文档、包；已安装与可用；标题与摘要匹配；一个完全匹配的已安装名称；单个匹配                                                                                                                             | 某种类型未被搜索、已安装状态错误、弱匹配排在最前，或自由文本查询返回文档而不是列表                                                                                                                                                                                                                        |
| FR5  | 分派器、叶子与命令测试                      | 每一种类型；`--installed`；`--available`；两者同时；`--limit`；非法值                                                                                                                                              | 某个过滤器被忽略、该组合被接受，或非法值通过                                                                                                                                                                                                                                                              |
| FR6  | 适配器来源测试                              | 项目与两个集成，然后是官方列表；共享的函数；抛出异常；超时；无效数据                                                                                                                                               | 一次失败掩盖了其他来源、某个函数运行两次、顺序改变，或信号从未中止                                                                                                                                                                                                                                        |
| FR7  | catalog 模式测试                            | 未知字段；未知类型；`schemaVersion: 2`；跨来源的重复包；顺序错误的版本                                                                                                                                             | 未知字段导致失败、接受了另一个版本、较晚的来源胜出，或版本保持来源顺序                                                                                                                                                                                                                                    |
| FR8  | 适配器保存副本与命令测试                    | 新鲜应答；有保存副本时的失败；无保存副本时的失败；另一个请求                                                                                                                                                       | 过期副本掩盖了新鲜应答、缺少保存日期，或写入了项目文件                                                                                                                                                                                                                                                    |
| FR9  | 现有 discover JSON 测试                     | 每种响应类型，带来源与不带来源                                                                                                                                                                                     | 现有字段改变类型或含义                                                                                                                                                                                                                                                                                    |
| FR10 | 清单解析器与 validate 测试                  | 无该字段；一个 URL；不是 URL 的值                                                                                                                                                                                  | 该键产生未知键警告，或有效的 URL 被拒绝                                                                                                                                                                                                                                                                   |
| FR11 | 官方列表生成器、漂移测试、适配器与命令测试  | 稳定版与 canary CLI；Core 比 CLI 旧或新；Core 精确声明、以范围声明、以路径声明；canary Core；无 Core；私有包；不添加任何内容的包；与其文件不匹配的主题文件夹；空文件夹；子文件夹；另一个来源列出某个官方包或其集成 | 列出了私有包或空包、跳过不可读的主题包、已提交列表与仓库漂移、latest 比 CLI 所知道的某个发布版本更旧、无法查询项目的 Core 版本、已声明的范围未被固定或未被加引号、仅限 canary 的包出现在稳定版 CLI 上或出现在已发布的 Core 旁边、官方条目取代了同一集成的某个来源条目，或它未列出的版本以另一个错误码失败 |
| FR12 | 清单解析器、包列表与 integration check 测试 | 无 logo；已打包的浅色 logo；浅色与深色；裸路径；缺失或非图片文件；清单命名的 logo 与仅由 package.json 命名的 logo；带与不带 showcase 的组件；仅主题包、仅文档包与仅 icon set 包                                    | 该键产生未知键警告、裸路径被接受、缺失的 logo 或示例不产生提示、被豁免的包产生了提示、任一提示在任何标志下让检查失败，或 package.json 胜过清单                                                                                                                                                            |

## Decision log

### DEC-1 — Discover shows; the package manager installs

**Reference:** `spec:AST-051/DEC-1`

**Decider:** `josephfarina`, `2026-09-30`

安装是包管理器的职责，而 autolink 已经会加载新安装的集成，因此 discover 只进行读取。对于项目没有的包，它打印可添加该包的命令。

已否决：`discover add`、`update` 和 `remove` 子命令；从 discover 运行包管理器。

### DEC-2 — Other integrations come from sources

**Reference:** `spec:AST-051/DEC-2`

**Decider:** `josephfarina`, `2026-09-30`

除官方列表（DEC-5）之外，项目或集成以函数形式提供来源，discover 合并每一个来源。需要登录的 catalog 宿主通过该函数工作，该函数使用其宿主已有的凭据运行，而项目无需 CLI 发行即可改变其来源所列出的内容。

已否决：把 catalog URL 内建到 CLI，这会把公开 CLI 绑到某一个宿主；把来源作为 URL 交给 CLI 抓取，若不让 CLI 处理凭据，它就无法登录私有宿主。

### DEC-3 — Discover has its own search and filters, in the CLI's existing terms

**Reference:** `spec:AST-051/DEC-3`

**Decider:** `josephfarina`, `2026-09-30`

discover 负责列出、显示单个包、版本或条目，并以带过滤器的方式搜索，使用 CLI 已有的选项名（`--type`、`--limit`）外加 `--installed` 和 `--available`。其响应沿用现有的 discover 类型，因此读 `--json` 的人无需学习任何新东西就能使用它。

已否决：把 discover 的搜索经由 `astryx search` 发出，后者只就已安装内容作答。

### DEC-4 — A free-text query always answers with a list

**Reference:** `spec:AST-051/DEC-4`

**Decider:** `josephfarina`, `2026-09-30`

`discover <words>` 是一次搜索，因此它列出所有包中的每一个匹配，包括项目已有的和它可以添加的，即使某个组件的名称完全匹配或只有一个条目匹配。这样响应类型就只取决于查询的形式。单个条目通过其包路径打开。

已否决：保留早先的快捷方式，即在完全匹配或唯一匹配某个已安装组件时打开该组件的文档。那样同一个查询会依项目及其来源所拥有的内容返回文档或列表。

### DEC-5 — The official list is built into each release and read last

**Reference:** `spec:AST-051/DEC-5`

**Decider:** `josephfarina`, `2026-10-13`

官方包只在 Astryx 发行时变化，因此内建到每个发行版本的列表，与该 CLI 所配合的包一样新。它可离线工作，在空文件夹中也能工作，并且要求的信任不多于 CLI 本身。discover 在其余每一个来源之后读取它，因此项目或集成会保留其自身来源为某个官方包给出的条目，而该列表补齐其余部分。官方包在列表中仍排在最前，读起来是列表的一部分。条目的 latest 保留 CLI 所知道的最新发布版本，因此更新检查仍能看到它，同时条目还列出适合项目的版本，其添加命令会固定该版本；二者都可以被查询。

已否决：在其他来源之前读取该列表，因为这会取代项目或集成的来源所给出的条目；在运行时搜索包注册表，因为那需要网络，而且不运行包的代码就无法知道它添加什么。

## Open questions

无。
