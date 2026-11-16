---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:knowledge-contracts
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang]
applies_to:
  [
    AGENTS.md,
    .github/PULL_REQUEST_TEMPLATE/,
    .github/pull_request_template.md,
    .github/scripts/api-tagalong.mjs,
    scripts/lib/knowledge-status-phrases.mjs,
    docs/,
    packages/,
  ]
verified_by:
  [
    scripts/check-knowledge.test.mjs,
    scripts/specs-for-file.test.mjs,
    scripts/lib/review-diff.test.mjs,
    .github/scripts/change-scope.test.mjs,
    .github/scripts/component-design-decisions.test.mjs,
    .github/scripts/lib/classify-visual.test.mjs,
    .github/scripts/review-clear-workflow.test.mjs,
    .github/scripts/review-signal-decision.test.mjs,
    .github/scripts/review-signal-workflow.test.mjs,
    .github/scripts/spec-owner-decision.test.mjs,
    .github/scripts/api-tagalong.test.mjs,
    scripts/lib/knowledge-status-phrases.test.mjs,
    apps/docsite/src/__tests__/example-coverage.test.ts,
  ]
deciding_specs: []
---

# Knowledge contracts and decisions

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "specification": [
      "INV9",
      "INV11",
      "INV14",
      "INV16",
      "INV18",
      "INV20",
      "INV21",
      "INV25",
      "INV26",
      "DEC-9",
      "INV27",
      "DEC-10",
      "DEC-12",
      "DEC-13",
      "DEC-15",
      "INV28",
      "INV31"
    ]
  }
}
```

<!-- path-applicability:v1 -->

```json
{
  "paths": ["apps/docsite/**"]
}
```

## Purpose

审查者应当无需重读旧 pull request，就能回答两个问题：

1. 哪些行为已经由人工做出决定？
2. 这个 pull request 是否正在做出需要人工介入的新决定？

## System model

Astryx 把不同的事实存放在不同的地方：

- 组件契约描述一个组件承诺的整体行为。
- 模块契约描述由某个组件拥有的、可独立契约化的公共 hook、插件、工具或子系统。私有实现辅助函数不需要记录。一个新的内部模块或 hook，若其他组件可以导入它——例如包的 `internal/` 导出，或在拥有它的组件之外使用的 hook——就不是私有辅助函数：在记录定义它之前，它需要一位所有者的决定（契约先于升级步骤 5，DEC-22）。
- 组件或模块契约内可选的 `Design decisions` 表记录该所有者本地的持久视觉意图。它不承载精确的像素调参，也不承载跨组件共享的规则。
- 家族契约描述兄弟组件共享的行为。
- 设计规格记录由人拥有的视觉与交互决策，包括用于判断 token/颜色配对的跨主题无障碍与对比度方法学。
- 主题规格记录一个包主题的意图、继承的基线、选定的 token 与调色板映射、必需的配对/状态、主题特定例外、实测凭据、已知缺口、兼容性与产物。
- 系统规格记录跨组件、跨主题或改变架构的决策。
- 使用方文档解释 prop、示例与用法。
- 审计记录承载当前证据与发现。其操作存储是自动化 wiki `component-scores.json`，它向沙箱提供当前修复后评分与未解决的发现。引导阶段预留了同目录的 `<PublicName>.audit.json` 文件，但没有任何 schema 或记录激活该路径；它不是审计数据存储，也不是当前的迁移目标。

审查者从改动的代码与最近的当前组件或模块契约开始。他们只沿着回答问题所需的链接前进：

```text
changed code or theme source
  → nearest current component, module, or theme contract
  → relevant family or design requirement
  → architecture or system decision only when referenced
  → mapped tests and audit evidence
```

一次查找也可以从任意仓库路径开始。`pnpm specs:for <path>` 列出链接到该路径的每条当前记录、决定这些记录的系统规格，以及该路径的组件触发条件所路由的全局声明；配合 `--diff` 时，改动所涉关注点路由的声明排在最前（INV20）。它只遵循记录与文件声明过的链接：

- 放置：记录本身，或其规范位置包含该路径的组件、模块或主题记录（组件或模块记录的位置，是它在 `docs/specs/components/` 下的文件夹所镜像的源目录）；
- 路径字段：`applies_to`、`verified_by` 与 `path-applicability:v1` 模式；
- 名称：家族 `members`、设计 `components`，以及 `affects_consumer_docs` 中命名该路径组件或使用方文档主题的 id；
- 引用：写在文件正文（如 Markdown 文档）中的系统规格编号（如 `AST-030`）或声明（如 `AST-108 FR4`）。查找也会读取写在源码注释中的一处引用，但 INV29 会在注释被删除之前把每一条此类链接移入记录，因此删除注释绝不会丢掉文件到记录的唯一链接；
- 继承：被链接记录所依赖的引用。

当前记录可以引用先前的人工决定。当新情形处于该决定所述范围内时，审查者直接应用它，无需再次询问。

主题记录位于共享主题化架构与下游记录之间。跨主题 API、词汇、继承、校验、编译器行为与产物策略保留在架构或系统规格中。用于对比度的跨主题人工视觉与无障碍方法学属于当前设计记录；共享的测量/工具实现属于架构或工具。一个主题选定的 token/调色板映射、必需配对与状态、例外、实测凭据、已知缺口、迁移与产物属于其包内主题记录。组件与家族继续拥有可观察行为；使用方文档继续拥有受支持的语法与示例。

每条记录要么是：

- `draft`：对审查有用，但不是规则；
- `current`：显式批准且可安全依赖；
- `archived`：为历史保留，存在替代记录时链接到它。

## Boundaries and invariants

- **INV1 — 当前即已批准。** 只有 `current` 记录指导实现与审查。
- **INV2 — 一个事实只有一个所有者。** 组件或主题记录不复制家族、设计、系统、使用方、审计或工具内容。跨主题 API 与编译器行为留在架构/系统记录中；人工对比度方法学留在设计中；共享测量实现留在架构/工具中；主题特定的映射、状态、例外、凭据与缺口留在包内主题记录中；组件整体可观察行为留在组件/家族记录中；可独立契约化的公共组件模块行为留在模块记录中；使用方语法留在使用方文档中。
- **INV3 — 既有决定可复用。** 审查者引用一项适用的决定，然后继续，无需再次询问人工。
- **INV4 — 新判断必须显式。** 当没有适用的当前决定、既有决定相互冲突，或该选择有意归人所有时，审查者询问人工。
- **INV5 — 空白表单不是策略。** 模板只创建草稿。搜索与审查绝不把模板文本当作已批准的 Astryx 决定来呈现。
- **INV6 — 必需结构随类型而变。** 模板措辞可以在不触碰既有记录的情况下改动。新增一种类型不会迁移无关类型。从既有类型中添加或移除必需字段或小节，会为该类型创建后续的 schema 定义，并在同一个 pull request 中迁移该类型的每一条活跃记录。
- **INV7 — 只有纯规格改动才走轻量 CI。** 每个改动文件都必须是组件、模块、家族、设计、主题或系统规格。对代码、架构、指导、模板、schema、审计或任何未知路径的改动都会运行常规 CI。
- **INV8 — 私有操作保持私有。** 公共记录绝不命名或链接私有的发布或自动化系统。
- **INV9 — 当前记录之间没有隐式优先级。** 更新、更窄或更局部的当前记录不会静默覆盖另一条当前记录。
- **INV10 — 记录描述理想行为，而非 pull request 的裁决。** 当前记录独立于任何一次实现改动，陈述持久的需求、禁止项、兼容性、所有权与证据。它绝不为了批准某个 pull request 而存在，也绝不批准、否决、分类、指定或授权某个具体的 pull request。pull request 与 issue 不是常设内容：记录陈述一次改动所确立的事实，而不是那项改动，并且在不再引用任何 pull request 或 issue 时仍然完整。支撑某项决定的研究——一份调查、一次选项比较、一项基准、一个测试的设计或评分——是从 pull request 链接的产物，而不是记录内容；记录把结论保留在它所支撑的决定之内。归其他所有者拥有的事实，通过链接拥有它的记录来委派。审查者依据当前权威拥有每一项改动的处置权。
- **INV11 — 每个公共增量都有权威结论。** 每个公共 API 更新与每处公共行为改动，在接受之前都要匹配到已提交的当前权威。包的导出形态不是唯一的触发条件：可达的支撑类型、context 成员、hook 返回值、默认值与可观察行为同样参与其中。
- **INV12 — 审计状态只有一个自动化数据存储。** wiki `component-scores.json` 是当前评分与未解决发现的操作来源。未激活的 `<PublicName>.audit.json` 约定已退役。未来的存储变更需要一项显式的系统决策、带版本的数据契约、自动化迁移与对账、沙箱读取器切换以及回滚证据；它不得按约定创建逐组件的影子账本。
- **INV13 — 作者在创建权威之前先搜索。** 在创建或实质性扩展一条记录之前，按提议的规范所有者/id、受影响路径与导出符号、以及语义行为术语，搜索当前记录与未关闭的 pull request。默认应扩展或投影既有的规范所有者。新记录需要独立的事实边界，并显式说明为何没有既有所有者能容纳它。未关闭的 pull request 用于协调重叠的工作；它们仍是非权威证据。
- **INV14 — 当前权威是声明作用域的。** `authority: current` 批准记录所述所有权边界内的显式声明。它并不承诺已命名组件、模块、家族或代码路径的每种行为都已订立契约。审查不得把一项窄决定扩展为相邻的未契约化行为，除非该 pull request 的确切增量依赖该行为。
- **INV15 — 围绕一个可落地的意图审查契约。** 作者确定一个主要意图，审查者分别归类每一处可观察增量。违反当前权威或需要新的人工决定的可分离增量，会在审查要求主要改动承载新权威之前被移除或拆分。规格是有意的持久决定的路径，而不是审查中发现的无关范围的默认补救办法。没有任何当前记录决定的、新增或改动的公共 API 行是例外：它反而进入人工审查，由所有者决定（改动耦合步骤 6）。
- **INV16 — 规格治理；生成的审查上下文只提供信息。** 已提交的当前组件、模块、家族、设计、主题、架构与系统记录拥有预期的产品行为。审查者生成的摘要、小节、检查清单、测试、截图、测量与建议只是上下文或证据。它们可以证明符合、矛盾或实现缺陷；它们不得发明方向、授权增量、推翻人工搁置，或提升权威结论。
- **INV17 — 缺失的审查上下文紧贴问题。** 审查先读 pull request 与当前权威，然后只补充缺失的上下文。它追溯问题为何发生、为何损害受影响的任务、为何这种损害重要；把提议的解决方案与每个主要或支撑增量映射回该问题；并识别可独立移除的搭车改动。产品影响仍归适用的产品记录所有。审查可以解释谁受影响、在何种受支持状态下、以及改动启用或阻止了什么，但在当前规范所有者记录该行为之前，这种生成的解释仍是上下文。
- **INV18 — 产品契约保留实现自由。** 组件、模块、家族、设计、主题与系统规格拥有可观察的输入、输出、状态、保证、失败、兼容性与调用方可见的所有权。新增或实质性修改的需求不得规定内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议或 CI 作业/工作流拓扑，除非该确切机制本身就是有意的公共契约。内部所有权、接缝与机制属于架构记录。验证映射命名足以证明某项声明的证据；它不授权产生该证据的实现或 CI 结构。既有当前记录继续治理其显式声明，直到其人工所有者有意迁移它们；本不变式不会静默使这些记录失效或重新解释它们。
- **INV19 — 自动化规格审查为人工决定提供信息。** 主要意图为创建、修改、采用或取代产品契约的 pull request，在具名人工所有者做出决定之前会收到书面建议分析。该分析识别规范知识所有者、适用的当前声明、重叠的当前工作与未关闭工作、所有权冲突或缺失所有者、声明作用域缺口、行为与架构的泄漏，以及要保留、移除、移动或澄清的确切声明。自动化可以报告矛盾、证据缺口与提议的修改；它不得批准、采用、核准或使契约成为 current。即使建议分析未发现缺陷，仍需要人工批准。
- **INV20 — 全局审查路由是显式且声明作用域的。** 一条横切基线只有在它的 `review-applicability:v1` 块声明 `scope: "global"`、并把一个语义触发条件或一个关注点映射到该记录内确切的声明 id 时，才会在没有组件反向链接的情况下参与。审查在更窄的记录之前加载匹配的当前全局声明，然后在该增量由直接组件、模块或家族所有者治理时优先解析该所有者。标记绝不会让整条记录、相邻声明、草稿或提议 head 的权威生效。每个路由匹配记录基础权威 commit、记录摘要、记录 id、路径、触发条件或关注点、声明 id、声明标题与确定性的匹配原因。拥有共享关注点的记录可以在块的 `concerns` 映射中列出它：共享工具的名称、重新实现它的代码模式，以及它路由的声明。若一次改动新增的交付源码行匹配某个关注点，则该改动会路由那些声明，无论组件记录的 `review_triggers` 列表如何，并且每个匹配都指明匹配的行。
- **INV21 — 组件本地视觉意图保持本地且持久。** `## Design relationships` 下可选的 `### Design decisions` 表只属于组件或模块本地的外观意图，未来的重新设计必须重新考虑它。作者在新增一行之前，先引用、复用或修订稳定的 `DD1`、`DD2`、……行。精确的像素调参通常保留在代码与视觉证据中；共享或跨组件的规则保留在 `docs/design/`。团队设计所有者可以在一个仅涉及外观的原子 pull request 中，把一行连同其像素与证据一起提交。外部贡献者遵循常规贡献流程，且不得被要求撰写规格；维护者拥有任何缺失的权威。人工请求提供意图，但只有通过所有者批准当前规格内容，才成为已提交的当前权威（DEC-14）。

### Review evidence placement

- **INV22 — 一次性证据留在改动旁。** 临时截图、录屏、测量、传感器凭据与运行日志附加或链接在用到它们的 pull request 上，而不是作为一次性资产提交到 `main` 的 `docs/pr-assets/` 或其他源码目录。公共 GitHub 附件是人工发布的一次性证据的首选存放处。常设记录保留持久结论与验证关系，而不是逐次运行的清单。已接受的视觉基线、可复用的 story 与测试夹具、已交付的文档媒体，以及由当前所有者显式允许的仓库自有凭据，仍随代码版本化。
- **INV23 — 清理保留历史证据。** 从当前树中移除一次性资产不得重写历史，也不得破坏已有的提交固定证据链接。删除之前，每个被移除的文件都要有一份经过验证的公共保留副本。链接到保留的 `main` 历史之外的提交，需要在该确切提交处有持久的保留锚点；仅一个提交哈希或临时分支是不够的。当附件发布不可用时，一个不可变的非发布 `evidence/` 标签可以保留由 Git 托管的历史证据。它的名称保持在发布标签约定与自动清理之外，并且在证据被引用期间不得移动或删除。清理在移除源文件之前，会验证远程锚点、确切字节与已有链接。
- **INV24 — 存储不改变证明或权威。** pull request 的文本陈述声明、受测构建、相关状态、观察到的结果与证据链接；图像或会过期的产物不是结论的唯一记录。附件仍是 INV16 下的证据，而非权威。所有者特定的凭据要求、操作审计存储与 CI 产物生命周期仍归其当前所有者。[AST-009](../specs/AST-009/spec.md) 拥有真实 AT 凭据；INV12 拥有操作审计数据存储。[AST-029](../specs/AST-029/spec.md) FR5 与 FR10 拥有审计 pull request 的证据凭据与确切 head 资格报告。[AST-030](../specs/AST-030/spec.md) FR12 拥有共享的视觉回归执行与基线采用。本放置规则不新增捕获所有者，也不要求永久归档每次 CI 运行。

### Path discovery

- **INV25 — 每条当前记录都能从某个路径到达。** 每条当前记录都从至少一个本身不是知识记录的仓库路径被链接，方式可以是放置、路径字段、名称、引用、继承或决定链接。路径优先的查找会把没有链接记录的路径报告为未路由。它绝不从文件名、扩展名或目录名推断链接。
- **INV26 — 路径适用性定位记录；仍由声明决定。** 若一条记录的规则适用于其他链接都无法到达的路径，则在唯一的 `path-applicability:v1` 块中声明这些路径。匹配的路径会列出该记录。该匹配不会把任何声明扩展到其所述范围之外（INV14），不会让该记录排在更窄的所有者之上（INV9），也不要求行为位于所命名的文件中（INV18）。每个模式至少匹配一个受跟踪文件。

### Record coverage

- **INV27 — 仓库中的每份规格都是知识记录。** 规格，即陈述系统任何部分必须做什么的文件，区别于解释如何使用它的使用方文档、指南与 README，就是本记录所列某一类型的记录，无论它位于今天存在的包还是以后新增的包中。它承载该类型的 frontmatter，遵循 `docs/templates/knowledge/` 中该类型的模板，并位于该类型的规范位置（拥有代码）。任何包都不得定义自己的规格格式、模板或位置。发现逻辑把每个名为 `*.spec.md` 的受跟踪 Markdown 文件、以及名为 `specs` 的目录下的每个受跟踪 Markdown 文件视为记录候选，不是有效记录的候选会使 `pnpm check:knowledge` 失败。`README.md` 索引文件、`plan.md` 实现计划，以及发现逻辑已经忽略的路径，都不是候选。

### Consumer docs

- **INV28 — 每个公共 hook 都有一个最小的可运行示例来演示它。** 公共 hook 是由已发布包从已发布入口点导出的 hook，正如构建出的 API 表面所列出的那样（`architecture:public-component-api` INV24）。其文档至少包含一个真实、可运行的示例：一个实时渲染的模板块，把该 hook 命名为它的示例目标（`exampleFor`，或当该块还服务另一页面时用 `alsoExampleFor`）。该示例：
  - 在解决其文档所述用例的组件中展示该 hook；
  - 只通过公共入口点导入包自身的代码；
  - 覆盖该 hook 的主要参数与返回值；
  - 通过文档构建；
  - 从 hook 自身获得其可见行为，因此移除该 hook 就会破坏示例所展示的内容；以及
  - 是最小的：只包含展示该用例所需的代码，没有无关的 UI 或样式。

  文档页面如何选择并排序其示例块属于 `architecture:template-authoring`。没有符合要求的示例的公共 hook 是文档缺口，作为 issue 记录在仓库的 issue 队列中（DEC-16）。

### Source comments

- **INV29 — 源码注释只解释非显而易见的工作。** 名称、结构与控制流让源码自我解释。复述代码做什么的注释是缺陷：修复方式是更清晰的代码，而不是注释。源码注释只解释读者在代码中看不到的内容：原因、约束、不变式，或浏览器或平台怪癖。它绝不叙述代码、复述名称或类型、命名 pull request、issue 或日期，也不引用或援引知识记录。记录链接代码，因此 `pnpm specs:for <path>` 能找到治理该代码的记录，而组件的 `{Name}.spec.md` 持有其记录 id。当注释中的引用是文件到记录或声明的唯一链接时，先由记录链接该文件，然后才移除注释，因此 `pnpm specs:for <path>` 在前后列出相同的记录与被引用的声明。整条记录的引用（如 `AST-108`）在被引用记录中变成 `applies_to`、`verified_by` 或 `path-applicability:v1` 链接。这些链接到达整条记录，因此无法保留被引用的声明（如 `AST-108 FR4`）。文件自身组件、模块或主题记录中的声明作用域引用可以保留该声明，写在被引用记录类型的引用字段中，例如 `Spinner.tsx` 的 `Spinner` 记录中的 `system_specs: [spec:AST-108/FR4]`。`pnpm check:knowledge` 只解析主题或模块记录 `references` 中的 `/DEC-N` 声明，因此主题或模块文件中的声明引用（如 `butterTheme.ts` 中的 `AST-079 FR2`）会一直保留，直到该检查能解析任意声明后缀。在记录持有这些链接之一之前，引用保留。注释遵循 ASD-STE100 简化技术英语风格：指令中最多 20 个词，描述中最多 25 个词，一句一个主题，主动语态，现在时，用词简单且每个词只表一义，无习语或填充语。以下注释保留：
  - 版权行；
  - 文件头：`@input`、`@output`、`@position` 与 `SYNC:` 提醒，最多约 12 行，且没有重复主要 JSDoc 的散文；
  - 导出的组件、prop、hook 与工具上的 JSDoc，使用不带标签的 `@example` 围栏；
  - 每个 Effect 上说明它所同步的外部系统的注释（`architecture:react-component-runtime` INV3）；
  - 工具读取的指令：lint 与 TypeScript 指令、`spec:AST-030` FR12 所读取的浏览器无障碍规格文件头注释中的 `@pr-a11y` 路由行，以及仓库工具解析的任何其他注释行。

示例。这条注释违反 INV29。它援引了一条记录，把多个主题塞进长句，并复述了它下方的 `finalFocusRef` 行：

```ts
// The returned focus shows the focus-visible ring only after keyboard
// input (`architecture:interaction-modality` INV1). The native close
// may already have restored focus to the target with a ring; the helper
// clears it first.
//
// With a sheet still open beneath this one, focus returns into that
// sheet: to the opener when it is there, else to the sheet's panel.
//
// An explicit `finalFocusRef` always receives focus, as released. The
// recorded opener of a non-modal sheet does so only if the person was
// still in the sheet when it closed (`hidePopover()` never moves
// focus, and the page behind it was live, so focus the person took
// elsewhere stays there).
```

这条注释遵循 INV29。每句陈述一个事实，其余由代码陈述：

```ts
// The native close can show a focus ring on the target. Clear it. The ring
// shows only after keyboard input.
//
// If a sheet is open below, focus goes to this sheet's opener when it is in
// that sheet, else to that sheet's panel.
//
// A non-modal sheet returns focus to its opener only if focus was still in
// the sheet. The page behind it stays live, so the person can move focus
// away first.
```

### External links

- **INV30 — 来自团队之外的新外部链接需要一位人工所有者。** 作者不在团队内、且向 docsite 或包文档添加外部 URL（指向本仓库与 Astryx 自有站点之外站点的链接）的 pull request，绝不由自动化批准或合并。由一位人工所有者批准，审查者检查每条新链接是否恰当。团队撰写的链接遵循常规闸门（DEC-17）。在本规则中：
  - **团队** 是 `main` 上 `.github/ENGOWNERS` 或 `.github/DESIGNOWNERS` 中列出的账号。机器人账号绝不属于团队。
  - **Astryx 自有站点** 是本仓库在 GitHub 上的地址、Astryx docsite、Astryx 预览部署，以及 npm 上的 `@astryxdesign` 包。指向 Web 标准与平台参考（W3C、WHATWG、MDN、TC39）以及保留示例域名的链接，在本规则中不是外部链接。
  - **人工所有者** 是指 `cixzhang` 或 DESIGNOWNER，批准确切 head。

### Approval lines

- **INV31 — 记录的批准行只能追加。** 更改或删除既有决定 Decider 行、或用另一个账号替换记录 `approved_by` 的 pull request，需要原决定者在确切 head 上的批准；`cixzhang` 自己的 pull request 算作她本人的批准。添加决定或批准者无需额外操作（DEC-18）。在本规则中：
  - **原决定者** 是既有行所指名的账号。
  - **批准** 是来自该账号、在确切 head 上的批准审查，或 `/approve-spec <full head SHA>` 评论。除 `cixzhang` 之外的任何决定者也会在自己的 pull request 上批准确切 head。
  - **改动** 是对该行的编辑或删除，删除某条决定亦在其内。仅移动行、在未改动的 Decider 行之后添加文字，以及用真实决定者替换占位决定者，都不算改动。

### Record status

- **INV32 — 记录陈述行为与决策，而非项目状态。** 记录陈述预期行为、边界、所有者、证据与决策。它不陈述其背后工作已进行到哪一步，也不陈述该工作的进行顺序（DEC-20）。这在每个小节中都成立，包括缺口或当前状态小节。在本规则中：
  - **构建状态** 是对目前编写、构建或交付了什么的陈述：“构建尚未开始”、“还没有代码”、“还没有模块”、“未构建”、“尚未实现”、“后续工作”。
  - **排序** 是对工作顺序的陈述：“第一个使用方”、“第一个采用方”、“采用顺序”、“Table 先采用它”、“先于……落地”、“阶段 1”。系统自身遵循的顺序，例如弃用先于移除的发布规则，是行为，不是排序。
  - **需求缺口** 允许以 `<FR or INV id> gap: <observable mismatch>` 的形式出现。它命名系统今天做了需求所禁止的事，且不陈述构建状态或排序。
  - **状态行** 允许出现：最多一行，例如 `Status: in progress`，只说明该记录仍在进行中。
  - **生命周期字段** 允许出现：知识模板要求的字段，例如系统规格的 `phase` 或 `Released default preserved` 行，陈述记录自身的生命周期，而非构建进度，予以保留。
  - 实现计划（`plan.md`）跟踪工作，不在本规则范围内。

### Public API scope

- **INV33 — pull request 新增或改动的每个公共 API 行都在其范围内具名。** pull request 命名它改动的组件与模块，并按组件列出其公共 API 行。该具名范围之外、且没有当前所有者批准记录决定的行，会连同该行一起发送给所有者，pull request 在该行被具名并获得所有者批准、或拆分为独立 pull request 之前不合并。范围内、由当前记录决定的行无需进一步步骤（INV25），但状态仍把它列为范围之外，以便审查者看到。在范围之外添加行为处理器（使组件对输入做出反应的公共事件或回调 prop，例如 `onClick`）会发出警告。

## Path applicability

当一条记录治理的路径无法通过其放置、路径字段、名称与继承链接到达时，使用此可选块。已能从它治理的每条路径到达的记录保持不标记。

<!-- path-applicability-example:v1 -->

```json
{
  "paths": ["apps/docsite/**", "packages/**/*.doc.mjs"]
}
```

在已选择加入的记录中，把示例标记替换为 `path-applicability:v1`。模式相对于仓库，区分大小写。`**` 是跨越任意数量段的整段，`*` 在一个段内匹配，`?` 在一个段内匹配一个字符。模式只使用字母、数字、`_ . @ - /` 以及这些通配符。单独的 `**` 会被拒绝。签入的校验器会拒绝格式错误的块、不安全或重复的模式，以及不匹配任何受跟踪文件的模式。

## Global review applicability

仅当具名声明跨原本无关的组件所有者适用时，才使用此可选块。普通的组件、模块、家族、设计、架构、主题与系统记录保持不标记。

<!-- review-applicability-example:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "public-api": ["FR1", "DEC-2"],
    "accessibility": ["AR1"]
  }
}
```

在已选择加入的记录中，把示例标记替换为 `review-applicability:v1`。触发条件名称使用以下封闭词汇：`accessibility`、`behavior`、`compatibility`、`component-slots`、`docsite`、`interaction`、`layering`、`layout`、`motion`、`navigation`、`platform`、`public-api`、`react-runtime`、`responsive`、`scrolling`、`specification`、`styling`、`testing`、`theming`、`tokens` 与 `visual`。每个触发条件都有一个非空的唯一声明 id 列表，且每个 id 都能解析为该记录中一条显式编号的声明。块可以添加 `concerns` 映射，或用它代替 `triggers`（INV20）。每个小写 kebab 形式的关注点列出 `claims`，以及 `names`（共享工具的标识符）与 `patterns`（重新实现它的代码的正则表达式）中的至少一项：

```json
{
  "scope": "global",
  "concerns": {
    "slot-presence": {
      "names": ["isRenderable"],
      "patterns": ["typeof [\\w.]+ !== 'boolean'"],
      "claims": ["INV16"]
    }
  }
}
```

一个关注点存在于拥有其声明的记录中，因此一条声明只有一个路由来源。签入的校验器会拒绝不受支持的触发条件、格式错误的块、缺失或重复的声明、无效的模式以及空的路由。`scripts/review-global-baselines.mjs` 同时要求确切受审 head 与其完整的基础权威 commit，验证该 commit 是 head 的 `origin/main` 合并基点，输出确定性排序的匹配行，并在 `concernMatches` 中列出其关注点被 head 新增行匹配的声明。因此它不能把提议的 head 当作自身权威来读取。使用方在窄查找之前加载这些行，在审查回执中保留其来源，并在解析出直接所有者之后只应用被引用的声明。

## Writing specifications and contracts

这些规则在把读者需要的决定放在前面的同时，保留语义保真。它们是撰写指导，不是关于人类可读性的量化声明。它们前瞻性地适用于新增或实质性修订的架构、组件与模块规格；不要求回溯重写历史文档。

撰写之前：

1. 按行为、公共符号、受影响路径与提议的规范所有者/id 搜索当前记录。
2. 按相同的所有者路径、符号与语义术语搜索未关闭的 pull request。
3. 更新规范所有者，或与重叠的工作协调。只有当事实有独立所有者时，才创建新记录，并在 pull request 摘要中解释该边界。

在每个组件或模块契约的标题之后，以如下读者优先的投影开始：

| 领域            | 契约                                                                         |
| --------------- | ---------------------------------------------------------------------------- |
| 公共契约        | 陈述确切的公共 API、概念或语法增量；没有变化时写 `None`。                    |
| 行为            | 陈述可观察的治理行为，包括决定性的默认值、边界或优先级规则。                 |
| 终端用户影响    | 命名谁受影响、在何种状态下、以及什么改善、恶化或保持不变。                   |
| 构建者影响      | 命名迁移工作与每个新的调用方选择；没有新负担时写 `None`。                    |
| 兼容性/就绪情况 | 陈述默认兼容性、增量/破坏性状态、权威、需求缺口（INV32）与仍待补的材料证据。 |
| 审查检查        | 列出使实现或提议在本契约下可被拒绝的少数具体条件。                           |
| 治理规则        | 链接规范所有者，以及仅为证明该投影所需的当前条款。                           |

架构记录使用相同的位置与页脚，但使用面向架构的行：

| 领域            | 契约                                                                       |
| --------------- | -------------------------------------------------------------------------- |
| 治理契约        | 命名本架构所服务的可观察当前决策；没有产品契约变化时写 `None`。            |
| 系统行为        | 陈述已交付的系统行为，包括决定性的不变式、边界或优先级规则。               |
| 终端用户影响    | 命名谁受影响、在何种状态下、以及什么改善、恶化或保持不变。                 |
| 构建者影响      | 命名本架构移除或新增的实现决策、协调工作或变通办法。                       |
| 兼容性/就绪情况 | 陈述兼容性影响、权威、需求缺口（INV32）与仍待补的材料证据。                |
| 审查检查        | 列出边界违规、产品 API 机制泄漏，或使改动可被拒绝的丢失的不变式/证据区分。 |
| 治理规则        | 链接决定规格，以及仅为证明该投影所需的当前条款。                           |

该表是审查投影；正文仍是权威。投影本身不会让记录变短。只有当作者从正文中移除真正的重复而不丢弃契约语义时，篇幅才会下降。`Review checks` 从正文投影已确定的需求与边界；它们不发明策略，也不重新开启决定。引用列表项形式的条款（如某条 AST-002 FR）时，使用其确切可见标签与规范文件链接。不要为没有稳定标题或显式锚点的条款发明片段 URL。

然后编写权威正文：

- 用现在时描述系统，而不是描述产生它的项目。`docs/contributing/spec-writing.md` 把本规则与 INV10 转成评分标准；创建或改动记录的 pull request 在审查之前于其描述中报告该评分标准的结果。
- 陈述预期行为与决策，而非项目状态：不写构建状态，也不写工作顺序（INV32）。需求缺口的写法为 `<FR or INV id> gap: <observable mismatch>`，可以有一行如 `Status: in progress` 说明记录仍在进行中，并且模板要求的生命周期字段保留。
- 使用熟悉的词与简短、直接的句子。
- 每条规则完整陈述一次，放在控制它的条件与例外旁边。后续小节引用其 ID 或规范所有者，而不是复述散文。
- 只为正在决定的语义切片订立契约。把相邻行为命名为非目标或未契约化缺口；不要仅为让记录成为 `current` 而填充它。
- 不要复制使用方 prop 表、用法配方、共享系统机制、当前审计转储或实现步骤。链接其规范所有者。
- 当可读的表格或状态矩阵能改善扫读时使用它们。绝不要仅为缩短记录而移除契约内容。

对于常规的本地外观意图，组件或模块记录可以在 `Design relationships` 下包含可选的带版本 `Design decisions` 表。每行使用稳定、唯一的 `DD` id，陈述该决定、其意图或原因、适用范围以及允许的变化。只有当意图足够持久、未来重新设计必须重新考虑时，才添加一行。先复用或修订既有行。不要把确切的像素调参从代码/证据中复制出来，也不要把共享规则从 `docs/design/` 中复制出来。仅有表头的表在模板中是有效的；已撰写的块至少有一行完整行。

平实的语言必须保留规范效力、谓词、基数、默认值、兼容性、权威、所有者、ID、证据状态与决定状态。不要删除、削弱、合并或隐藏不同的规范内容。只有当本记录的所有权规则把某事实分配给另一规范所有者时，才用链接替换本地事实。

限定词与权威动词是契约语义，不是润色。诸如 `only`、`every`、`consistently`、`current`、`records`、`owns`、`delegates` 与 `inherits` 之类的词在改写中不得被丢弃、泛化、削弱或升级。重塑一条规则时，把它的动作、激活条件、例外或非目标、所有者与证据状态，与它们所限制的声明放在同一行或同一项目符号中。

不要为行数、词数、字节数或百分比缩减目标做优化。先移除真正的重复，在不改变含义的前提下缩短散文，使用可读的表格或列表，并按 INV2 的要求链接真正共享的权威。保留每一处承重的条件、限定词、边界、决定与证据区分。人类的可扫读性与语义保真胜过篇幅。

### Same rule, plainer form

Dense:

> 当 `items` 恰好包含一个可见项时，组件必须恰好播报该项一次；当 `items` 包含零个或多于一个可见项时，它不得播报任何项，而省略 `items` 的使用方必须保留既有的静默行为。

Plain:

| 条件           | 必需行为                 |
| -------------- | ------------------------ |
| 省略 `items`   | 必须保留既有的静默行为。 |
| 恰有一个可见项 | 必须恰好播报该项一次。   |
| 零个或多于一个 | 不得播报任何项。         |

平实版本改变的是形态，不是含义。

### Before review

- [ ] 将编辑后的文本与其源文本比较，确认上文列出的每条契约属性仍然显式。
- [ ] 确认每条规则的动作、条件、限定词、例外或非目标、所有者、权威动词与证据状态仍然显式，并且紧邻它们所限制的声明。
- [ ] 确认投影陈述了公共增量、行为、终端用户与构建者影响、兼容性/就绪情况、拒绝检查与治理规则，且未替换或抵触权威正文。
- [ ] 确认表格与列表改善了扫读而未隐藏内容，并且没有仅为满足篇幅目标而移除内容。

### When current records disagree

1. 草稿只是上下文，不能与当前策略冲突。
2. 从事实的范围识别规范所有者：组件整体行为、独立公共模块行为、家族行为、设计表示、单一主题的语义/映射、跨主题架构、使用方用法，或审计证据。
3. 若两条当前记录做出不同声明，审查停止。不要按新旧、路径邻近或具体程度来选择；记录一个 `novel-human` 缺口。
4. 通过改动规范所有者并移除被复制的声明来解决缺口。有意例外由该所有者记录；受影响的记录改为链接到它，而不是复述它。
5. 系统规格的决定可以授权该改动，但在审查者依赖它之前，当前拥有的契约必须在同一个 pull request 中改动。

## Change coupling

文档仅靠约定无法保持当前。

在任何组件、模块、家族、设计、主题或架构记录成为 `current` 之前，仓库必须支持以下流程：

1. 记录点名可能影响它的代码面，以及验证它的那些检查。
2. 触及该代码面的 pull request 会触发一次聚焦的契约审查。
3. 审查从 pull request 声明的主要意图开始，并把每个公开增量独立归类为五种结果之一：
   - `preserves`：该精确增量恢复或保留当前权威，且不增加超出它的公共 API 或行为；
   - `settled`：已有的当前人工决策覆盖该精确增量，并且被引用；
   - `violates`：该精确增量与当前权威矛盾；
   - `novel-human`：没有任何当前权威裁定精确的公共 API、行为、所有权、兼容性或设计增量；或
   - `out-of-scope`：它归另一个组件、模块、族、系统或产品所有。
4. `preserves` 与 `settled` 进入常规正确性审查。仅当实现与证据也通过时，它们才有资格获得批准。
5. `violates` 会收到请求更改，并附带最小的合规补救措施：更改或移除违规的增量。审查不会仅仅为了挽救矛盾的实现而建议一份规格；所有者可以另行选择提议政策变更。
6. 可分离的 `novel-human` 附带改动会从主要意图中移除或拆分。审查可以要求这种收缩，而不裁定该附带改动的语义，然后继续审查剩余的改动。仅当 `novel-human` 增量本身就是主要意图、与它不可分离，或作者或所有者明确选择追求它时，该增量才进入人工私下搁置。反过来，pull request 公共 API 增量（`architecture:public-component-api` INV24）中新增或更改且属于 `novel-human` 的行，会让该 pull request 带着该行进入人工审查，无论它是否可分离；该记录的所有者接受、拆分或移除它，审查绝不会仅就那一行请求更改。
7. 仅当 bug 修复恢复现有的当前权威，且不改变超出该契约的公共 API 或公共行为时，它才是 `preserves`。任何可分离的 API、视觉、布局或交互附带改动都遵循步骤 5 或 6，而不是让该恢复等待一份更广泛的规格。
8. 当当前的组件、族、设计、主题或客观无障碍权威覆盖其确切结果时，视觉修正可以是 `preserves` 或 `settled`。真实的渲染证据必须证明受影响的状态以及具有代表性的未变状态。新的视觉表现仍属 `novel-human`；称其为改进并不能裁定它。
9. 审计新鲜度由同一套代码与测试关系计算得出，因此相关的代码改动不会让审计看起来仍是最新的。

审计存储迁移是一项单独的契约变更。它要求版本化的数据契约、对既有 wiki 行的自动转换与核对、迁移期间明确指定的唯一事实来源、沙箱读取器切换，以及回滚证据。仓库本地的按组件文件本身并不是迁移计划。

### Contract before escalation

审查与构建应收敛于能够落地的最小理想改动：

1. 说明 pull request 的主要意图，并划分其可观察的增量。
2. 对每个增量适用当前权威。即使组件记录没有逐项列举其确切绘制，既有设计与客观标准也可以裁定一项视觉修正。
3. 对于矛盾，使其合规或移除它。除非改变政策本身就是有意为之且可单独审查的目标，否则不要提议修改规格。
4. 对于未被裁定但可分离的增量，移除或拆分它。继续推进主要改动，而不要求贡献者去解决相邻的系统设计。未声明的公共 API 行是例外：它进入人工审查，由所有者接受、拆分或移除（变更耦合第 6 步）。
5. 仅升级仍然存续且有意为之的 `novel-human` 增量、未声明的公共 API 行，或没有任何记录定义的新内部模块或钩子（System model，DEC-22）。只记录该增量所需的确切决策；相邻模块的行为可以保持未被契约化。

可操作的审查结果会点名该可落地收缩的验收标准，而不只是报告权威缺失。

### Recording a new human decision

1. 贡献者用常规的 pull request 语言说明预期行为与主要意图，并回应审查。外部贡献者保持常规贡献流程：他们永远不会被要求撰写或更新规格。
2. 审查者或 agent 应用上述收缩路径。只有仍然存续且有意为之的 `novel-human` 问题才会继续；贡献者不编造答案，也不规定无关的相邻行为。未声明的公共 API 行同样会继续，如变更耦合第 6 步所述，而不是被审查移除或拆分。
3. 经授权的所有者在 pull request 审查中作答。
4. 维护者或 agent 将该裁定记录到规范所属记录中。
   - 当维护者可以更新该分支时，优先在同一 pull request 中提交一次 commit。
   - 如果维护者无法更新贡献者分支，就在其下方开启一份小型的、链接的规格 pull request，并在该决策落地后对实现进行 rebase。
   - 如果方向被接受，贡献者在需要时更新代码。
   - 如果方向被否决，被否决的实现会被移除或更改。仅当该边界具有重大影响且很可能再次出现时，才记录被否决的备选方案。
5. 最终提交会使先前的批准失效。所有者在记录与实现一致后批准确切的 head。

如果没有接受任何实现方向，则关闭贡献者的 pull request。仅当该裁定可独立使用时，维护者拥有的规格 pull request 才会保留。

审查评论是对话的证据；提交入库的记录才是规范决策。

记录持久的结果，而不是审查记录。当至少满足以下一项时，裁定才应写入规范记录：

- 它更改或澄清某个所属组件、模块、族或系统边界；
- 它确立未来工作必须保留的要求或禁止事项；或
- 它否决了一个具有重大影响且很可能再次出现的备选方案。

来自已放弃 pull request 的 prop 名称、实现机制或失败的视觉实验，会留在审查历史中，除非该细节本身通过了这一检验。

仅当该裁定更改了超出贡献者改动的共享契约，并且应独立落地或被复用时，才使用一份单独的、位于下层的规格 pull request。实现 pull request 随后会 rebase 到该决策之上。

示例：

- NumberInput 更改其步进计算。其当前契约规定最终操作会钳制到 `min`/`max`，且映射的测试仍然通过。结果：`preserves`；继续常规正确性审查，无需人工提问。
- 新增的 NumberInput 路径使用此前已批准的同一转换顺序。结果：`settled`；引用该 `DEC` 并继续常规正确性审查。
- 一个从包导出的上下文更改了某个必填的函数参数，而其当前契约保留先前的操作形态。结果：`violates`；请求最小的合规更改。新的兼容性政策是一项单独的提议，而不是默认修复。
- 一个滚动溢出的修复还引入了新的悬停披露。溢出恢复在其当前布局权威下继续推进。如果披露缺少权威，就移除或拆分该可分离的视觉附带改动；不要要求该 bug 修复去规定整个交互模块。
- Selector 以其主要意图移除空指示器空间，但没有任何当前决策说明选项标签是否必须保持对齐。结果：`novel-human`；私下搁置，由所有者决定确切的对齐契约。
- 某个产品为族所拥有的输入布局规则请求一个一次性的宽度 prop。结果：`out-of-scope`；将该改动路由到族契约，而不是创建组件专属 API。

草稿记录不能消除审查缺口。只有经过验证的 `current` 契约或适用的决策才能产生 `preserves` 或 `settled`。

在该流程通过历史审查基准并在 pull request 上强制执行之前，bootstrap 不会将任何组件、模块或族记录标记为 current。

## Owning code

- `AGENTS.md` 将审查者指向最窄的相关记录。
- `docs/templates/knowledge/` 包含唯一的撰写表单；任何包都不保留自己的模板（INV27）。
- 组件记录位于 `docs/specs/components/<ComponentRoot>/`，每个组件根一个文件夹，作为直接的 `<PublicName>.spec.md` 子项（DEC-15）。文件夹树镜像该组件的源码树：组件根是 Core（`packages/core/src/`）或 Lab（`packages/lab/src/`）的组件目录，或是 `scripts/component-packages.cjs` 注册的扁平组件包（Charts、RichText 和 Vega）的顶层模块，后者的记录为 `docs/specs/components/<PublicName>/<PublicName>.spec.md`。拥有某条记录的包，是其源码树中含有该组件根的那个包；当两个包都有同名根时，就是持有该记录代码的那个包。平台实现的记录与 `<PublicName>.<language>.spec.md` 位于同一文件夹（例如 `docs/specs/components/Button/Button.swift.spec.md`），其 id 为 `component:<language>/<PublicName>`（例如 `component:swift/Button`），在 `platform_of`（`component:<PublicName>`）中点名其核心组件，并且只陈述该平台新增的内容或必须以不同方式完成的内容；核心记录保留共享契约（INV2）。在核心组件拥有自己的记录之前，其公共源码与文档代行该契约。公共名称通常与根一致；父/成员例外要求该根中存在精确的顶层条目或完整的内联 consumer-doc 条目。公共语义模块记录至少嵌套在 `<PublicName>.spec.md` 所在文件夹下一层的目录中，通常位于 `modules/`，或位于插件自己的文件夹中，例如 `Table/plugins/rowStatus/`。该子目录不必与模块代码所在位置一致：查找通过代码的文件名或其 `verified_by` 证据到达记录。父组件的 `modules` 列表与模块的 `parent_component` 字段必须一致。组件包的源码树和 `packages/native/apple/Sources/` 都不持有 `*.spec.md`。隐藏、测试夹具、测试、生成、构建产物、覆盖率、依赖以及 `*.generated.spec.md` 路径会被发现与 PR 路由一致地忽略。
- Wiki 的 `component-scores.json` 是当前的运行审计数据存储。历史上的 `<PublicName>.audit.json` 预留从未获得 schema 或活跃记录，已由 INV12 废止。
- 管辖某个包跨组件规则的记录，位于该包的 `specs/` 目录下，形如 `<slug>.spec.md`，kind 为 `architecture`，id 为 `architecture:` 后接包名、`specs/` 与该文件之间的每一级目录，以及 slug，用连字符连接。例如 `packages/native/specs/swift/accessibility.spec.md` 为 `architecture:native-swift-accessibility`。仓库范围的架构仍留在 `docs/architecture/`。
- `packages/themes/<theme>/<theme>.spec.md` 包含该包主题的规范记录；`docs/themes/README.md` 只是指引与索引。
- `docs/schemas/knowledge/` 定义必需的结构。
- `scripts/check-knowledge.mjs` 校验模板、记录、批准元数据、可选的组件/模块设计决策表、`path-applicability:v1` 块，以及 INV25 可达性。
- `scripts/specs-for-file.mjs`（`pnpm specs:for`）解析链接到某个路径的记录。`--unrouted` 列出没有链接到当前记录的已跟踪路径；`--unreached` 列出没有任何路径可达的当前记录。
- `.github/scripts/component-design-decisions.cjs` 依据可信 base 与 head 字节，将当前的组件/模块改动归类为无 DD 改动、仅 DD 改动或混合改动。仅 DD 要求路径、kind、authority 以及有效可选块之外的每一个字节都不变。
- `.github/scripts/knowledge-paths.cjs` 持有那份唯一的记录路径清单。它点名 `check:knowledge` 发现的记录与所有者门控路径：每一条记录；`docs/specs/` 或某个包的 `specs/` 或 `docs/architecture/` 下的每个 Markdown 文件（含 README）；族、设计、架构与主题文档文件夹中的每个 Markdown 文件，除各文件夹的 `README.md` 索引外；主题包中的每个 `*.spec.md`；以及规范性设计资产。被忽略的位置仍被忽略。
- `.github/scripts/change-scope.cjs` 识别纯规格记录改动与某次改动触及的所有者门控路径，并为工作流之外的调用方归类路径（`--classify-paths`）。
- `.github/workflows/review-signal.yml` 发布唯一的审查门禁 `review-required`，它也承载规格所有者的批准（DEC-14）。一次所有者批准覆盖 pull request 中的每一处知识记录改动，并绑定已批准的规格内容，而不是某个 commit。对每种记录类型的批准来自 `.github/ENGOWNERS`；当前的设计与主题记录、规范性设计资产，以及仅 DD 的当前组件/模块改动还额外接受 `.github/DESIGNOWNERS`，但设计所有者的批准（一次审查或 `/approve-spec`）本身并不批准无障碍要求或弃用，即使在当前的设计或主题记录内部也是如此（DEC-14）。混合的 DD 加其他组件/模块编辑需要同时获得两组批准。没有任何自身权威的所有者门控 Markdown 文件，例如规格旁边的生成表格，需要一名工程所有者。记录元数据永远不会自我授权。该门禁只决定批准；它从不启用自动合并。该门禁不会检测来自团队之外的新外部链接（INV30）；见验证部分下的执行缺口。
- `.github/workflows/review-signal.yml` 允许 DESIGNOWNER 作者绕过工程门禁，仅当可信 base 代码依据抓取的 base/head 源码字节，把每一处被改动的 Core 行验证为真实 `stylex.create` 调用内部的保守声明，并且不适用任何其他代码原因时。分类器还会在任一 diff 侧拒绝直接的交互、可操作性以及滚动控制声明——包括命中测试、触摸行为、选择、调整大小、光标、可见性、溢出、吸附与滚动条可供性。贡献者以及混合或行为性改动仍受门控。安全空间归类同时考虑当前路径与先前路径：只有每一条路径都是安全的改动才会被排除，而任何跨越该边界的重命名都构成工程原因。工程与设计审查仅当其 `commit_id` 等于当前 pull request head 时才计入。直接协调器只清除已由 `review-signal` 拥有的当前 head 门禁；生效的 ENGOWNER `CHANGES_REQUESTED` 或 `DISMISSED` 状态会先把硬状态门禁恢复为 pending，然后恢复其咨询标签。状态写入失败时不会执行任何先前的标签变更。批准、撤回与驳回都会在变更前立即重新检查 head，而未受门控的 head 绝不会仅凭审查状态获得门禁。对于实时仓库权限为 write 或 admin 的作者，`REVIEW_APP` 仓库变量中点名的审查应用也会在 DEC-11 下满足工程门禁。只有该应用最新的、`commit_id` 等于当前 head 的 `APPROVED`、`CHANGES_REQUESTED` 或 `DISMISSED` 审查才计入。两个工作流在每次评估时都读取作者的权限，并使用自己的 Actions token 发布状态。

## Deciding specs

### DEC-1 — Current-record conflicts do not resolve by precedence

**Reference:** `architecture:knowledge-contracts/DEC-1`

**Decider:** `cixzhang`, `2026-08-30`

当前记录不会因为更新、更窄或更贴近代码就覆盖另一条记录。审查会停止，确定规范所有者，并在所有者处解决冲突。其他记录链接到该拥有决策，而不是复制它。

已否决：静默选择最新或最具体的记录，因为那会把文档顺序变成未经审查的系统政策。

### DEC-2 — New rulings normally stay in the contributor pull request

**Reference:** `architecture:knowledge-contracts/DEC-2`

**Decider:** `cixzhang`, `2026-08-30`

人工裁定通常在暴露该缺口的 pull request 中讨论。贡献者负责说明意图并修改自己的代码；维护者与审查 agent 负责规格系统。他们尽可能在同一分支中记录该裁定，或在贡献者分支无法更新时，在一份小型的、链接到其下方的规格 PR 中记录。被否决的实现会被移除或更改；仅当被否决的备选方案能保护某个重大边界不再被反复争论时，才记录它。所有者对当前规格内容的最终批准，证明决策与实现一致。

已否决：要求所有者为每项裁定另开第二个 pull request，因为那会把答案与改动分开，并增加不必要的审查工作。

### DEC-3 — Search overlapping authority before writing

**Reference:** `architecture:knowledge-contracts/DEC-3`

**Decider:** `cixzhang`, `2026-09-07`

在起草新记录或实质性扩充某条记录之前，用不止提议标题的线索搜索当前记录与未关闭的 pull request：规范所有者/id、受影响路径、导出符号，以及语义行为术语。当该事实已属于规范所有者时，扩充或投影它。仅为不同的事实边界创建新记录，并说明为什么现有所有者无法容纳它。

已否决：只搜索文件名或已落地的记录。语义重叠可能使用不同的标题，而未完成的工作可能已经在该所有者落地之前就在改动它。未关闭的 pull request 协调工作并提供证据；它们不会成为权威。

### DEC-4 — Contraction precedes new authority

**Reference:** `architecture:knowledge-contracts/DEC-4`

**Decider:** `cixzhang`, `2026-09-11`

当一项本可审查的改动带有可分离的矛盾或未裁定的决策时，移除或拆分该增量，并让主要意图继续推进。仅当存续的增量被有意作为持久行为追求时，才建议编写规格，而不是因为审查发现了相邻的不完整。未声明的公共 API 行是例外：变更耦合第 6 步将其送交人工审查由所有者决策，审查不会移除或拆分它。

已否决：把每个未契约化的附带改动都变成规格项目，因为那会让一次窄范围修复吸收无关的设计工作，并使贡献者没有可落地的路径。

### DEC-5 — Current approval is claim-scoped

**Reference:** `architecture:knowledge-contracts/DEC-5`

**Decider:** `cixzhang`, `2026-09-11`

当前记录只授权其所述所有权边界内的明确声明。它可以有意让相邻行为保持未契约化。审查者不会把 `current` 当作整个组件或公共模块已被完整规格化的证明，也不会在应用某项窄范围已批准决策之前要求无关的覆盖。

已否决：要求某项窄范围的视觉或行为决策去契约化所指模块的每一项 API、组合、无障碍与实现事实。

### DEC-6 — Product specs govern; generated review context informs

**Reference:** `architecture:knowledge-contracts/DEC-6`

**Decider:** `cixzhang`, `2026-09-12`

已提交的当前产品记录决定预期行为。审查从这些声明开始，只使用生成的上下文、检查清单、测试、截图、测量与建议来证明一致性、矛盾或具体缺陷。生成的完整性与通过的检查永远不会创造权威，也不会升级权威结果。

当 pull request 或当前记录把上下文留作隐含时，审查可以通过三个“为什么”追问来追踪问题、把解决方案映射回该问题，并点名附带改动，从而填补缺口。它还可以解释受影响的用户、受支持的状态、被启用或被阻止的行为，以及调用方负担。除非规范产品所有者将其记录为当前行为，否则这些解释仍只是上下文。

已否决：把完整的审查表单、有说服力的影响叙述或通过的校验矩阵当作产品方向的替代来源。

### DEC-7 — Product specs contract behavior, not internal architecture

**Reference:** `architecture:knowledge-contracts/DEC-7`

**Decider:** `cixzhang`, `2026-09-12`

新增或实质性修订的产品规格陈述合规实现必须满足的可观察契约，并让等效的内部实现保持自由。仅当调用方或互操作系统有意将该机制作为公共行为依赖时，它才点名确切机制。否则，内部所有权与接缝属于架构记录，验证仍是证据，而不是被规定的 CI 或测试拓扑。

这条撰写规则面向未来。既有的当前记录在指名的所有者迁移它们之前保留其明确权威；新增这条规则不能静默地使某项要求（例如遗留的实现约束）失效。当修订触及此类要求时，所有者要么证明该机制可公开观察，要么将其移入适用的架构记录。

已否决：仅因为某个实现提供了决策证据，就把成功原型的模块图、算法、清单、日志、锁、事务设计、文件系统布局或 CI 作业提升为产品要求。

### DEC-8 — Spec review is advisory analysis for the human owner

**Reference:** `architecture:knowledge-contracts/DEC-8`

**Decider:** `cixzhang`, `2026-09-12`

对规格的自动审查不会止步于把改动路由给人工。它首先产出有证据支持的书面反馈，涉及规范所有者、既有与重叠的声明、所有权冲突、声明范围、错位的架构以及确切的契约编辑。该分析帮助所有者审视决策；它绝不会替代所有者的批准，也不会成为权威。

已否决：因为检查通过就自动批准一份规格，或只返回“需要人工”而不把审查者已掌握的契约与所有权分析交给所有者。

### DEC-9 — Global applicability routes exact claims, not whole records

**Reference:** `architecture:knowledge-contracts/DEC-9`

**Decider:** `cixzhang`, `2026-09-19`

没有组件反向链接的横切规则，只能通过经过校验的 `review-applicability:v1` 块被发现。每个语义触发条件点名确切的本地声明 id。审查者在更窄的记录之前，从 base 权威 commit 加载匹配的当前声明，保留匹配来源，然后在该增量的直接所有者管辖它时优先解析该所有者。

已否决：把 `global` 标记当作文件中每条陈述的权威，因为那会抹除声明边界，并让无关或草稿材料静默地管辖某项改动。

### DEC-10 — Routine visual intent lives with its component or module

**Reference:** `architecture:knowledge-contracts/DEC-10`

**Decider:** `cixzhang`, `2026-09-23`

所属组件或模块规格中一张小型结构化 `Design decisions` 表，只记录持久的本地视觉意图。一行可以覆盖一个连贯的本地方向；细小的视觉调参不会为每次微调各建一条决策记录。新增行之前，先引用、复用或修改既有行。确切的像素留在代码与证据中，而共享与跨组件方向留在 `docs/design/` 中。

团队 DESIGNOWNER 可以把该本地决策、实现与证据放进一个只改外观的原子 pull request。仅 DD 的当前记录改动路由到设计批准；把 DD 编辑与其他组件/模块契约编辑混在一起，则需要设计组与工程组同时批准。DESIGNOWNER 与其他所有者一样，用 `/approve-spec <sha>` 批准。仅当可信 base 归类证明某次改动是既有文件上仅含声明的对外观 diff，且不适用任何其他代码原因时，Core 代码门禁才被绕过。任何不确定、贡献者撰写的改动、行为、JSX、API、包、barrel、新组件或未知运行时路径，都会闭合失败并转工程审查。

外部贡献者说明意图并提供常规证据；维护者拥有规格工作，永远不会要求贡献者撰写它。一个请求或一次对话是决策输入，不是已提交的权威。被编辑的当前记录只有在所有者批准其内容后才可复用（DEC-14）。

已否决：sidecar 记录（伴随记录）或为每次像素微调各建一条设计记录，因为它们把日常意图与它的所有者拆开；在所有者批准之前就把设计请求当作权威，因为可审查的意图还不是已提交的政策。

### DEC-11 — A review-app approval clears the code gate for write-access authors

**Reference:** `architecture:knowledge-contracts/DEC-11`

**Decider:** `cixzhang`, `2026-10-15`

在仓库上拥有 write 或 admin 权限的作者是内部贡献者，无论其是否为工程或设计所有者；拥有 write 访问权的设计师与合作伙伴也包括在内。对这些作者，配置的审查应用最新的精确 head 结论决定工程门禁：一次批准会清除它，而之后的请求更改、驳回或新 commit 会使其重新变为 pending。针对精确 head 的生效 ENGOWNER 请求更改会让门禁在应用批准之上保持 pending，而 ENGOWNER 的批准仍会为每位作者清除门禁。

没有 write 权限的作者，包括只读成员与 fork 贡献者，仍以 ENGOWNER 批准为清除门禁的唯一方式。权限来自评估时刻仓库的协作者权限，而不是所有者列表、组织成员身份或作者关联。`REVIEW_APP` 未设置、权限不可读或任何更低权限，都会使该应用的审查不生效。状态由工作流自己的身份发布，绝不由某个人的账户发布。

已否决：计入 pull request 上的任何应用批准，因为对更早 head 的批准，或其后又出现请求更改的批准，都会让门禁保持清除。

### DEC-12 — Records declare the paths they govern in an optional overlay

**Reference:** `architecture:knowledge-contracts/DEC-12`

**Decider:** `cixzhang`, `2026-10-21`

管辖无其他链接可达路径的记录，在可选的 `path-applicability:v1` 块中声明 glob 模式，该块位于 `review-applicability:v1` 旁边。该覆盖层独立版本化，因此选择加入不会改变某种记录 kind 的必需形状，也不会迁移其他记录。按路径优先的查找会列出匹配的记录；声明范围、优先级与实现自由均不变。

已否决：为每种 kind 都要求一个 `applies_to` 字段，因为那会迁移每一条活跃记录，让它们声明大多已通过放置或继承可达的路径。已否决：使用正则表达式，因为审查者无法一眼读懂其覆盖范围，而且它们会静默地过度匹配。

### DEC-13 — Every spec is a knowledge record, wherever it lives

**Reference:** `architecture:knowledge-contracts/DEC-13`

**Decider:** `cixzhang`, `2026-10-23`

任何包中的规格记录，包括之后新增的包，都使用本记录定义的记录 kind、frontmatter、模板与放置方式，而发现过程会让不是有效记录的规格形状文件失败。平台实现的组件记录是一条 `component` 记录，其 id 带有语言限定并点名其核心组件，因此核心记录保留共享契约，平台记录只持有平台自己的部分。在核心组件拥有自己的记录之前，其公共源码与文档代行该契约。

已否决：包本地的规格格式，因为其记录会跳过结构校验、所有者门禁与路径路由。

### DEC-14 — One owner approval binds a pull request's spec content

**Reference:** `architecture:knowledge-contracts/DEC-14`

**Decider:** `cixzhang`, `2026-10-28`

一位规格所有者一起审查 pull request 的知识记录改动，并作为整体批准或返工。该批准绑定 **规格内容**：对每一条被改动的所有者门控路径计算一个指纹，每条路径在某个 commit 上读取。在 Markdown 记录中，指纹省略 front-matter 的 `authority`、`approved_by` 与 `approved_at` 值，因此记录一次批准并把记录从 `draft` 移到 `current` 永远不会改变它。工作流从 pull request 的文件计算每个指纹；没有任何评论、标签或状态提供它。

- **批准动作。** 由符合条件的所有者做出的下列每一项，都批准其点名 commit 的内容，并在该 commit 的指纹等于当前 head 的指纹时计入：
  - 一条点名完整 commit SHA 的 `/approve-spec <sha>` 评论；该 SHA 说明所有者审查的是哪份内容；
  - 针对其 commit 的 GitHub 批准审查。

  `/revoke-spec`（带或不带 SHA），以及对其他规格内容的请求更改，会撤回该所有者的批准，直到其再次批准。针对当前规格内容的请求更改会持有门禁，直到该所有者再次批准。表态回应（reaction）不算批准。资格遵循上述所有者分组。ENGOWNER 作者可以用 `/approve-spec` 批准自己的 pull request；作者本人的批准审查从不计入。`.github/DESIGNOWNERS` 中列出的设计所有者批准设计与主题记录（设计规则与决策：视觉与交互外观），包括通过 `/approve-spec` 批准自己的 pull request。公共 API、行为规则、无障碍要求与弃用需要工程所有者（`.github/ENGOWNERS`）：设计所有者的批准（一次审查或 `/approve-spec`）本身并不批准无障碍要求或弃用，即使在当前的设计或主题记录内部也是如此。当前缺口：门禁按记录 kind 路由批准，因此设计所有者单独的批准会清除一条当前设计或主题记录，即使该改动带有无障碍要求或弃用——无论是其在 pull request 上的 `/approve-spec`，还是其在贡献者 pull request 上的批准审查。`.github/scripts/spec-owner-decision.cjs` 只按记录 kind 选择所有者分组，没有任何针对无障碍要求或弃用的检查。

- **什么会保留批准。** 只改动其他路径的 commit、来自 base 分支的合并、rebase 以及批准簿记都会保留指纹，因此它们保留每一次批准。
- **什么会重置它。** 对已批准规格文本的改动、新增被改动的规格路径，或丢弃某项已批准规格改动的 head；先前的批准会停止计入，直到所有者批准一个载有当前内容的 commit。
- **单一审查门禁。** `review-required` 同时承载代码审查与规格批准。代码审查缺失时由它领先；一旦它满足，缺失的规格批准会显示在同一状态上；成功需要两者。缺失的批准是 `pending`，绝不是失败。该状态会点名谁可以批准：

  | 仍缺少的规格分组                            | `review-required` 文本                                                                    |
  | ------------------------------------------- | ----------------------------------------------------------------------------------------- |
  | engineering（单独，或与 design/theme 一起） | `⏳ Waiting for human spec approval: an eng owner can reply /approve-spec <sha>`          |
  | 仅 design 或 theme                          | `⏳ Waiting for human spec approval: a design or eng owner can reply /approve-spec <sha>` |

  持有门禁的请求更改会改为点名其所有者：`…: @owner requested changes and can reply /approve-spec <sha>`。已批准的规格改动会在代码审查结果旁显示 `✅ Spec approved by @owner`。一名 ENGOWNER 的批准满足所有分组。

- **细节。** 门禁的细节会给出可供复制的 head 命令，列出被改动的记录（id、标题、authority 变化，以及各自需要的分组）、被改动的路径与指纹，并说明先前的动作为何不再计入：规格在批准后发生改动、被撤回，或命令格式错误。
- **决策记录。** `spec-owner-approval` 以最小描述报告规格这一半，而 `review-required` 的其他写入者从它读取规格这一半。它不是必需检查，也不会决定任何 `review-required` 尚未显示的内容。
- **事件覆盖。** 每个 pull request 事件、同仓库审查以及所有者命令都会重新评估门禁，每次评估都会为其读取的 head 发布终态。fork 审查携带只读 token 并被跳过，因此所有者用命令批准 fork pull request。不是所有者命令的评论不会启动 runner。若一次运行会超出规格所有者作业的请求预算，门禁会因规模过大而无法自动协调，保持 pending，并由一名维护者触发的运行来决定它（`spec:AST-030` FR15）。

已否决：精确 head 绑定（记录批准以及每次 base 合并都会迫使对未改动文本重新批准）；按记录或按小节的批准（规格审查是全有或全无）；不带 SHA 的命令（就在其之前的一次 push 会在未被审阅的情况下被批准）；单独的规格状态（一个门禁，一条消息）；表态回应批准（没有事件，因此需要轮询作业）；由工作流推送的 `draft`→`current` 改动（它不启动检查，也无法写入 fork）。

### DEC-15 — A component's records live in one folder under docs, for every platform

**Reference:** `architecture:knowledge-contracts/DEC-15`

**Decider:** `cixzhang`, `2026-10-28`

每一条组件记录与模块记录都位于 `docs/specs/components/<ComponentRoot>/`，结构与该组件的源码树一致，因此在任何平台上处理某个组件的人都能在一个文件夹里并排找到其核心契约与各平台的记录。查找仍以路径优先：发现过程读取该树，放置方式把每条记录映射到其文件夹所镜像的源码目录。记录的 id 与内容不随这次搬移而改变。

已否决：把记录放在各包的代码旁边，因为那样某组件的核心记录与平台记录会位于不同的包中，而每个平台包都需要自己的规格位置。

### DEC-16 — Hook examples are governed by spec, and gaps are issues

**Reference:** `architecture:knowledge-contracts/DEC-16`

**Decider:** `cixzhang`, `2026-11-01`

钩子文档由本记录管辖，每个公共钩子的文档都带有一个最小、可运行的示例来演示该钩子（INV28）。缺失或不合规的示例是仓库 issue 队列中的一个 issue，规模定为贡献者的首次接手项。所有者的方向：“应由规格管辖，任何缺口都应成为 astryx issue 队列中的 issue。它们会是贡献者很好的首次接手项”，以及“对于任何示例，确保它确实演示了该钩子。理想情况下它应该显得相当精简”。

示例覆盖率报告检查钩子示例的方式与其检查组件文档示例的方式相同：它报告缺失与不合规的示例，并且从不门禁合并或发布（所有者决策，2026-09-30）。

已否决：一个渲染某个内部调用该钩子的组件的示例，因为读者永远看不到该钩子被接线。

### DEC-17 — An outside contributor's new external link needs a human owner

**Reference:** `architecture:knowledge-contracts/DEC-17`

**Decider:** `cixzhang`, `2026-11-08`

来自团队之外作者的 pull request，若向 docsite 或包文档添加外部 URL，须由人工所有者批准，绝不由自动化批准（INV30）。自动批准绝不能发布外部贡献者添加、却没有人检查过的链接。团队撰写的链接遵循常规门禁。

### DEC-18 — A record's approval lines are append-only

**Reference:** `architecture:knowledge-contracts/DEC-18`

**Decider:** `cixzhang`, `2026-11-08`

既有决策的 Decider 行与记录的 `approved_by` 仅在原始决定者于精确 head 批准时才改变（INV31）。批准行记录的是谁做了决定，因此在没有该人的情况下重写，就等于点名一个并未做出该决定的人。只有 `cixzhang` 自己的 pull request 才算批准她自己的行；其他每位决定者都须批准确切 head。新决策与新增的批准者遵循常规门禁。

### DEC-19 — A Lab-only pull request needs no owner decision

**Reference:** `architecture:knowledge-contracts/DEC-19`

**Decider:** `cixzhang`, `2026-11-04`

所有者说：“任何仅限 lab 的东西都可以通过”。仅限 Lab 的 pull request（如 `spec:AST-030` FR26 所定义）就其 Lab 行为或 Lab API 而言无需所有者决策（INV4）。它所改动的一条 Lab 记录仍须在 pull request 的 head 处获得工程所有者的 `/approve-spec`（DEC-14）。在 FR26 下不属于仅限 Lab 的 pull request，对其改动的每一部分都遵循常规所有者规则；把非 Lab 部分拆出去，可使其余部分成为仅限 Lab。

已否决：把同时改动 Core 或其他包的 pull request 当作仅限 Lab。

### DEC-20 — Records state behavior and decisions, not project status

**Reference:** `architecture:knowledge-contracts/DEC-20`

**Decider:** `cixzhang`, `2026-11-09`

所有者说：“我们还要把准则写下来：规格应避免包含项目的临时状态，比如已经写了什么或先做什么。不过它可以有一句类似‘仍在进行中’的声明”。记录陈述预期行为与决策（INV32）。构建状态与工作顺序会随工作推进而过时，后来的读者无法分辨一条过时的状态行与一条要求。要求缺口以 `<FR or INV id> gap: <observable mismatch>` 的形式保留，因为它点名系统必须改变的行为。可以有一行状态，例如 `Status: in progress`，说明该记录仍在进行中。实现计划与 pull request 承载工作的进度与顺序。

已否决：一项对状态措辞失败的校验，因为同样的词也会描述行为（“焦点落位”“当 Action 处于 pending 时”）。

### DEC-21 — A public API row outside a pull request's scope needs a decision

**Reference:** `architecture:knowledge-contracts/DEC-21`

**Decider:** `cixzhang`, `2026-11-09`

所有者说：“我认为对于像 3280 这样的大型 PR，我们需要更好的防护栏来防止附带改动”。曾有一次大型 import 携带了 Item 的 `onClick` 行与容器点击，却没有记录任何决策。上述规则让此类附带改动在合并前就可见。已否决：依赖审查来捕捉大型 pull request 中的附带改动。

### DEC-22 — An undefined internal module or hook needs an owner decision

**Decider:** `cixzhang`, `2026-11-10`

所有者说：“本质上，我们不应该批准任何 API 含糊且规格未定义的东西。那些都进入人工审查”。未声明的公共 API 行已经进入所有者审查。其他组件可以 import 的新内部模块或钩子也是组件之间的 API，因此对于没有任何记录定义的那个，审查会请求更改，直到所有者作出决策，并附上该增量作为用法、为何需要它，以及为何既有模块不够用。

已否决：把每个内部模块或钩子都当作私有辅助项。

## Verification

| 不变式                        | 证据                                                                                                                                                                                                       | 失败信号                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| INV1, INV6                    | `scripts/check-knowledge.test.mjs`                                                                                                                                                                         | 未获批准的 current 记录或未迁移的 active 记录通过了校验                                                                                                                                                                                                                                                                                                                                                                                          |
| INV5, INV7                    | `.github/scripts/change-scope.test.mjs`                                                                                                                                                                    | 模板、schema、指导、架构、代码改动、不安全的改名或被截断的列表被算作仅涉及规格的改动                                                                                                                                                                                                                                                                                                                                                             |
| 批准跟随规格内容              | `.github/scripts/spec-owner-decision.test.mjs`                                                                                                                                                             | 对其他规格内容的批准清除了门禁，自封的所有者成为审批者，或错误的所有者组批准了 current 记录                                                                                                                                                                                                                                                                                                                                                      |
| INV3, INV4, INV11             | 盲测的历史审查基准                                                                                                                                                                                         | 审查者重新追问已定决策、发明新的决策、批准未定的公开差异，或把矛盾当作保持不变                                                                                                                                                                                                                                                                                                                                                                   |
| INV10                         | 记录内容与审查处置的测试夹具                                                                                                                                                                               | 规格给出 PR 结论，或审查者把 PR 链接当作权威                                                                                                                                                                                                                                                                                                                                                                                                     |
| INV13                         | 盲测的规格撰写测试夹具，外加重叠检索回执                                                                                                                                                                   | 作者创建平行权威、只检索已落地的记录或文件名、漏掉规范所有者上的未完成工作，或把尚未合并的 PR 当作权威                                                                                                                                                                                                                                                                                                                                           |
| INV14, INV15                  | 窄决策与混合意图的审查测试夹具                                                                                                                                                                             | current 的视觉切片被强迫收缩其整个模块、可分离的搭车项阻塞了修复，或审查报告了缺口却没有可落地的补救方案                                                                                                                                                                                                                                                                                                                                         |
| INV16, INV17                  | 规格优先审查与缺失上下文的测试夹具                                                                                                                                                                         | 生成的检查清单完整性压过权威、审查发明产品方向、复述已提供的上下文，或未能识别无关的搭车项或受影响的调用方状态                                                                                                                                                                                                                                                                                                                                   |
| INV18                         | 规格审查机制分析，外加所有者迁移回执                                                                                                                                                                       | 新增或修订的产品规格要求某个私有机制却未证明其公开、静默地使现有 current 记录失效，或把被触及的架构措辞留在产品契约中                                                                                                                                                                                                                                                                                                                            |
| INV19                         | 规格审查的归属冲突回执与人工决策                                                                                                                                                                           | 自动审查批准产品契约、遗漏 current 与未合并的所有者重叠、漏掉冲突或架构泄漏，或只返回人工挂起而没有可执行的书面分析                                                                                                                                                                                                                                                                                                                              |
| INV20, DEC-9                  | `scripts/check-knowledge.test.mjs` 与 `scripts/review-global-baselines.mjs`                                                                                                                                | 匹配的审查漏掉 current 的全局声明、加载了草稿或不匹配的声明、丢失 base-commit 溯源，或把被路由记录的其余部分当作权威                                                                                                                                                                                                                                                                                                                             |
| INV21, DEC-10                 | `.github/scripts/component-design-decisions.test.mjs`、`.github/scripts/review-signal-decision.test.mjs`、`.github/scripts/spec-owner-decision.test.mjs` 与 `.github/scripts/lib/classify-visual.test.mjs` | 格式错误或本地的 DD 逃过校验、过期的批准清除了新的 head、所有者路由丢失混合改动的门禁，或可执行/API/未知运行时被错误归类为仅外观改动                                                                                                                                                                                                                                                                                                             |
| DEC-14                        | `.github/scripts/spec-owner-reconcile.test.mjs`、`.github/scripts/spec-owner-decision.test.mjs`、`.github/scripts/spec-owner-workflow.test.mjs` 与 `.github/scripts/knowledge-paths.test.mjs`              | 非规格的提交、基线合并、变基或状态翻转会重置批准；规格文本变更或新的规格路径则保持批准；以其他规格内容命名的命令、表情回应、非所有者的操作或作者的自我审查即可批准；`review-required` 在缺少规格批准或规格决策尚未发布时就成功；以其他规格内容命名的撤销或请求改动被忽略；缺少批准时报告失败；一次评估让它的 head 没有终态；或 `check:knowledge` 发现的 current 记录、或本身没有权威的受所有者门禁的 Markdown 文件，在没有所有者的情况下发生更改 |
| DEC-14（设计所有者自己的 PR） | `.github/scripts/spec-owner-reconcile.test.mjs` 中的“接受 DESIGNOWNER 作者对设计记录自行执行 /approve-spec”；无障碍要求与弃用限制没有门禁检查（DEC-14 中的 Current gap）                                   | DESIGNOWNER 作者自己的 `/approve-spec` 不能批准其自己 PR 上的 current 设计记录；无障碍要求与弃用限制没有失败信号，因为门禁不检查它（Current gap）                                                                                                                                                                                                                                                                                                |
| DEC-11                        | `.github/scripts/review-signal-decision.test.mjs`、`.github/scripts/review-clear-workflow.test.mjs` 与 `.github/scripts/review-signal-workflow.test.mjs`                                                   | 应用批准清除了只读作者、来自 fork 的作者或更早的 head；之后应用的请求改动或驳回仍让门禁保持放行；应用批准覆盖了 ENGOWNER 的请求改动；或未配置的应用或不可读的权限清除了门禁                                                                                                                                                                                                                                                                      |

| 不变式               | 证据                                                                                                                                                                                                                                                                                                     | 失败信号                                                                                                                                                                                                                                                                                                    |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV22–INV24          | 贡献者/审查者的证据清单；公开链接与字节校验；保留的远程引用；未改动的测试夹具/基线/媒体路径                                                                                                                                                                                                              | 一次性捕获物进入源码树、清理丢失了被引用的图片、临时分支被当作持久分支，或存储改动覆盖了所有者的证据或保留契约                                                                                                                                                                                              |
| INV25, INV26, DEC-12 | `scripts/specs-for-file.test.mjs`、`scripts/check-knowledge.test.mjs` 与 `pnpm check:knowledge`                                                                                                                                                                                                          | current 记录没有任何受跟踪的非记录路径可达、查找从名称推断出链接、模式什么都匹配不到或匹配整个仓库，或模式匹配放宽了某条声明或压过更窄的所有者                                                                                                                                                              |
| INV27, DEC-13        | `scripts/check-knowledge.test.mjs`、`.github/scripts/change-scope.test.mjs` 与 `pnpm check:knowledge`                                                                                                                                                                                                    | 一个 `*.spec.md` 文件或 `specs` 目录下的 Markdown 文件，若 frontmatter 记录无效、不在其 kind 对应的位置、或遵循包本地模板，仍能通过                                                                                                                                                                         |
| INV28, DEC-16        | `apps/docsite/src/lib/exampleCoverage.mjs` 针对已构建表面的 hook 行，以及 `apps/docsite/src/__tests__/example-coverage.test.ts`（仅作提示：报告会打印但从不把门禁卡住），外加对照 INV28 各项标准对每个 hook 示例的审查                                                                                   | 报告漏掉某个没有 hook 文档或没有符合规范的示例块的公开 hook，或缺失或不符合规范的 hook 示例导致合并或发布失败                                                                                                                                                                                               |
| INV29                | 对包源码（非构建产物）中注释的基线化 lint：记录 id、pull request 与 issue 编号、日期戳和长引用块在新注释中会失败，既有位置已被基线化。审查把叙述性注释与超过约 12 行的文件头报告为非阻塞问题。清理按区域分别以不改行为的 pull request 落地，每项都在改动前后对每个被触及文件运行 `pnpm specs:for` 作对比 | 新注释引用记录、pull request、issue 或日期，引用记录，或叙述代码；文件头增长超过约 12 行，却没有 lint 失败或审查发现；删除注释导致某条记录或所引声明从该文件的 `pnpm specs:for` 结果中消失，因为该注释是该文件指向它的唯一链接；或清理删除或改写了工具会读取的指令，例如 `@pr-a11y` 行                      |
| INV30, DEC-17        | 由人工所有者审查团队外部作者在 pull request 中新增的每个外部 URL，该项由仓库之外的审查与合并工具执行；仓库内没有 CI 检查（见下文 INV30 的执行缺口）                                                                                                                                                      | 团队之外的 pull request 在包文档或 docsite 下新增外部 URL，却未经人工所有者对精确 head 的批准就被批准或合并；或团队自身的 pull request 新增此类 URL 时被要求等待人工所有者                                                                                                                                  |
| INV31, DEC-18        | `scripts/check-knowledge.test.mjs` 的“approval line history”；`pnpm check:knowledge --base <base>` 列出每条被改动的批准行及其原始决定者；仓库之外的审查与合并工具要求该决定者对精确 head 的批准（见下文 INV31 的执行缺口）                                                                               | 改动或删除现有 Decider 或 `approved_by` 行的 pull request，未经原始决定者对精确 head 的批准就被批准或合并；或仅新增一条决策或一位审批者的 pull request 被要求等待                                                                                                                                           |
| INV32, DEC-20        | `scripts/lib/knowledge-status-phrases.test.mjs`；`pnpm check:knowledge` 对规格或架构记录中的每个构建状态或排序措辞给出警告且不失败（DEC-20）；按 `docs/contributing/spec-writing.md` 中的评分项 R7 审查每条被改动记录，并在 `## Writing rubric results` 下报告                                           | 被改动记录在需求缺口或单条状态行之外陈述构建状态或工作顺序，却没有 R7 发现；或采用 `<FR or INV id> gap:` 形式的需求缺口、单条状态行，或模板要求生命周期字段，却被报告为 R7 发现                                                                                                                             |
| INV33, DEC-21        | `.github/scripts/api-tagalong.test.mjs`                                                                                                                                                                                                                                                                  | 新增或改动的行，其组件不在标题范围与 `Components:` 行之内、未在代码段或 `## Scope` 下的 `Components:` 行中具名，也未被 current 记录决定，却未列为搭车项；范围内的、已具名的、被删除的或被决定的行被列为搭车项；已决定但超出范围的行在摘要中缺失；某行匹配了另一个包的组件；或不可读的 API 改动文件以 0 退出 |
| DEC-15               | `.github/scripts/knowledge-paths.test.mjs`、`.github/scripts/change-scope.test.mjs`、`scripts/check-knowledge.test.mjs`、`scripts/specs-for-file.test.mjs` 与 `pnpm check:knowledge`                                                                                                                     | 组件或模块记录位于 `docs/specs/components/<ComponentRoot>/` 之外、某个 `*.spec.md` 留在组件包的源码树中或某个 Swift 视图旁、两个包共享根目录时记录被匹配到错误的包、某记录的组件根在已注册包的源码树中不存在、平台记录的 id 或其 `platform_of` 与其路径不匹配，或平台记录的改动跳过了 spec-owner 门禁       |

证据的放置由贡献者和审查者执行。本地的 `docs/pr-assets/` 忽略规则可防止意外暂存；它不是阻塞性的 CI 检查，也无法阻止在别处强制添加证据。

发现机制会读取每个包的架构记录（`packages/<package>/specs/…/<slug>.spec.md`）：`pnpm check:knowledge` 会像检查任何架构记录那样检查它们，此外还检查它们的 kind 及其路径给出的 id，而 spec-owner 门禁会把它们当作 `docs/architecture/` 下的记录来处理。

当前的执行缺口：发现机制尚未读取 `docs/`、themes 与包 `specs/` 记录之外的其它记录候选，例如位于 `specs` 目录下但不是 `<slug>.spec.md` 的 Markdown；组件记录在下一个 schema 版本之前没有 `platform_of` 字段；组件 id 模式也尚不接受诸如 `component:swift/Button` 这类带语言限定的 id。在这三者全部落地之前，那些其它候选只能由审查来检查。`pnpm check:knowledge` 会像检查核心组件记录那样检查平台记录（`docs/specs/components/<ComponentRoot>/<PublicName>.<language>.spec.md`）（其文件夹与公开名称、schema 规则、适用性块和 id），接受其带语言限定的 id，并还会检查 `platform_of` 是否指向其核心组件以及其 `verified_by` 路径是否存在。它的主题目标块没有可对照检查的核心主题契约。spec-owner 门禁与 `pnpm specs:for` 会把平台记录当作旁边的核心记录一样对待。

审查会强制要求检索未合并的 pull request（INV13）：pull request 摘要会记录检索词、规范所有者/路径，以及所检查的重叠未完成工作。

当前的执行缺口：示例覆盖报告会列出每个没有 hook 文档或没有具名示例块的公开 hook，但它看不出某个示例是否演示了其 hook，因此由审查来检查 INV28 的这一部分。每个没有符合规范示例的公开 hook 都是 INV28 下的一个未解决文档缺口，在仓库的 issue 队列中跟踪。

当前的执行缺口：仓库内没有 CI 检查能发现团队外部作者在 pull request 中新增的外部 URL（INV30）。该限制由仓库之外的审查与合并工具执行。

当前的执行缺口：仓库内没有检查会读取批准记录（INV31）。`pnpm check:knowledge --base <base>` 会把每条被改动的批准行报告为警告，并且不会失败。仓库之外的审查与合并工具要求原始决定者的批准。

当前的执行缺口：`.github/scripts/api-tagalong.mjs` 会列出 pull request 具名范围之外每条新增或改动的公开 API 行（INV33），并在其调用方提供这些行时，把 current 记录判定为超出范围的行列出，但不把它算作搭车项。目前还没有 CI 任务运行该脚本，因此审查会把未决定的行交给所有者。该脚本只读取 API 行：审查负责检查所有者对具名行的批准，以及范围之外、不新增 API 行的行为处理器改动。

当前的执行缺口：`pnpm check:knowledge` 会对规格或架构记录中的每个构建状态或排序措辞给出警告（INV32），并且不会失败（DEC-20）。每一行由对照评分项 R7 的审查来判定。
