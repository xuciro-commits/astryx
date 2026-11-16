# 拉取请求：单一主要意图

一个拉取请求应当为一个原因做出一个可审查的变更。选择与其主要意图匹配的模板；配套的测试和文档属于该意图，但无关的 API、视觉、布局、行为或策略变更不属于。

GitHub 会自动使用默认模板。要选择其他模板，请在新拉取请求 URL 后添加 `?template=<file>.md`，或将 `.github/PULL_REQUEST_TEMPLATE/` 中匹配的文件复制到描述中。

任何创建或更改知识记录的拉取请求——`docs/specs/<id>/spec.md`、family、design、theme 或 architecture 记录，或 `docs/specs/components/` 下的组件或模块记录——无论使用哪个模板，都要在描述中报告[编写规范记录](spec-writing.md)中评分准则的结果。`specification.md` 带有 `## Writing rubric results` 部分；当该拉取请求同时涉及记录时，请将它复制到另一个模板中。

| 主要意图                      | 模板               | 最低证据                                                                                   |
| ----------------------------- | ------------------ | ------------------------------------------------------------------------------------------ |
| 恢复损坏的行为                | `bug-fix.md`       | 复现、预期的权威依据、变更前后结果、未变化的代表性路径                                     |
| 纠正或有意更改外观            | `visual-update.md` | 当前视觉权威依据或所有者决定、真实浏览器变更前后像素、相关状态矩阵                         |
| 添加能力                      | `new-feature.md`   | 用户需求、当前规范、完整的公共增量、行为与兼容性证据                                       |
| 纠正贡献者或使用者文档        | `documentation.md` | 读者影响、事实来源、渲染或生成的结果                                                       |
| 记录一项持久决定              | `specification.md` | 确切未解决的声明、已搜索的现有权威、决定、被拒绝的替代方案、明确的非目标、写作评分准则结果 |
| 更改工具、测试、CI 或仓库维护 | `maintenance.md`   | 运维问题、失败证明、成功证明、未改变的产品行为                                             |
| 其他任何内容                  | `other.md`         | 主要意图、用户或维护者影响、权威依据、证据                                                 |

## 只解释权威尚未说明的内容

拉取请求和当前记录是上下文的第一来源。不要将它们复制到另一份摘要中。只填写缺失的内容：

- 通过三个 why 问题追踪问题：为什么发生、为什么损害受影响的任务，以及为什么这种损害重要。
- 将提议的解决方案以及每一个主要或支持性增量映射回该问题。移除或拆分没有明确贡献的搭车变更。
- 说明谁受影响、处于什么受支持状态，以及该变更启用或阻止什么行为。
- 当公共 API 变化时，展示代表性的变更前后调用点、默认值与兼容性，以及调用方必须做出的每一项额外决定。

这些解释帮助审查者应用当前权威；它们不会创建权威。产品行为仍由适用的当前 component、module、family、design、theme、architecture 或 system 记录拥有。API 调用方负担遵循 `spec:AST-002`。

审查还会加载任何 `current` 的横切声明，其机器可读的全局路由与变更的语义触发条件匹配。直接组件、模块或家族所有者仍首先解析确切的增量；全局路由只贡献其列出的声明，且从不授予该记录其余部分的权威。审查回执标识匹配的记录、声明、触发条件和原因。

## 保持意图原子化

在请求审查之前，划分每个可观察的增量：

- **主要：** 该拉取请求存在的原因。
- **支持：** 使主要变更完整所需的证据或文档。
- **搭车：** 可独立移除的行为、视觉、API、布局、策略或清理。

移除或拆分搭车变更。一个 bug 修复不会因为附近的一处可供性也可能改善就变成功能。一个功能不会因为同一个文件已打开就吸收无关的清理。

## 审查收缩范围，而不是扩大范围

初始的主要意图设定范围上限。首次提交的实现是检测后续由审查驱动的增长的基线，而不是对其搭车变更的批准。审查请求可以使该意图正确且安全、要求它所需的证据，或移除/拆分已在拉取请求中的增量。它不得仅仅因为审查发现了相邻的策略、迁移、同级一致性、新 API 或清理，就让一个狭窄的变更吸收这些内容。

如果较早的审查导致拉取请求增长，下一轮应当回退或拆分这些新增内容，而不是将它们当作新的主要意图。更广泛的工作只有在原始变更没有它就无法正确或安全时才保留；此时应请求最小的安全修正或更窄的机制。

## 最后使用规范，而不是最先

审查应产生可以落地的最小理想变更：

1. 将当前 component、module、family、design、theme、architecture 和 system 权威应用到每个增量。
2. 如果增量违反当前权威，使其符合或移除它。不要仅仅为了挽救实现而提议更改规范。
3. 如果增量尚未确定但可分离，移除或拆分它，并继续审查主要意图；未声明的公共 API 行除外，这类行交由人工审查由所有者决定，而不是移除或拆分（`architecture:knowledge-contracts` 变更耦合第 6 步）。
4. 仅为团队希望推进的、存续的、有意的持久决定提议规范。

当前记录仅在其所有权边界内管辖其明确声明。它不意味着整个具名组件或模块都已完全规范化。

## 视觉修正

视觉变更不会自动需要新规范。当当前 component、family、design、theme 或目标无障碍权威已经确定了确切结果时，它可以作为修正继续进行。展示该权威，并用真实浏览器像素验证受影响状态，以及代表性的未改变状态。

对于常规的组件局部或模块局部意图，在适用时引用并重用现有 `DD` 行。团队 DESIGNOWNER 可以在与像素和证据相同的原子性仅外观拉取请求中，修改或添加组件/模块规范中的可选 `Design decisions` 表。仅为未来重新设计必须重新考虑的稳定意图添加行；确切的像素调整留在代码和证据中，共享或跨组件的规则留在 `docs/design/` 中。

外部贡献者遵循正常贡献流程，永远不会被要求编写规范。如果缺少权威，由维护者记录所有者裁决。人工请求提供意图，但只有在所有者批准其内容后才成为当前已提交的权威。

新的视觉表现、主观方向或交互模型仍然是设计决定。将共享决定放在其自己的设计规范中；将持久的组件局部决定保留在拥有该组件的 component/module 表中。

## 审查证据

[知识契约：审查证据的放置](../architecture/knowledge-contracts.md#review-evidence-placement)拥有一次性证据的存放位置，以及清理如何保留历史链接。将手动截图及其回执附加到拉取请求，或链接实现分支之外的公开保留副本。将可复用夹具、已接受的基线和公共文档使用的媒体保留在其拥有的源路径中。证据存储不会放宽匹配模板的证据标准。

## 在请求审查之前审查你的变更

审查会将每个拉取请求与当前记录和下面的检查清单进行对照。先运行同样的流程。你在审查前修复的每个发现都能节省一轮审查。

### 运行预审查报告

```bash
pnpm review:pre                       # the working tree against origin/main
pnpm review:pre --base upstream/main  # a fork whose main remote is upstream
pnpm review:pre --head HEAD           # committed work only
pnpm review:pre --json                # the same report as JSON
```

报告只读取本地仓库。它会打印：

- 每个更改的文件及其类别：record、owner-gated record、published package code、other package file、Lab 或 repository；
- 管辖这些文件的当前记录，以及文件引用或新增行路由到的声明；
- 链接组件的审查触发条件所路由的全局基线声明，在合并基处读取；
- 编写的行数，当模板之外的行超过规模指引时给出建议，以及变更是否合并到基线；
- 条目 i 到 l 的发现，每个都带有其文件和行号、规则和修复方法；
- 适用于此变更的检查清单条目，每个都带有原因。

报告是一个查找工具。记录决定是否接受，而不是报告。发现是待检查的线索，而不是裁决。

### 手动查找管辖记录

| 命令                                                                                                               | 它回答的问题                                                   |
| ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| `pnpm specs:for <path>`                                                                                            | 链接到单个路径的记录、决定这些记录的规范，以及路由到的全局声明 |
| `pnpm specs:for --diff origin/main`                                                                                | 对每个更改文件执行相同操作，并首先列出新增行路由到的声明       |
| `node scripts/review-global-baselines.mjs --authority-commit <base-sha> --review-head <head-sha> --triggers <a,b>` | 审查触发条件对应的当前全局声明，在合并基处读取                 |
| `pnpm check:knowledge`                                                                                             | 编辑记录后，记录和模板是否有效                                 |
| `git diff --name-only origin/main... \| node .github/scripts/change-scope.cjs --classify-paths`                    | 哪些更改路径是规范记录，以及哪些需要规范所有者批准             |

### 预审查检查清单

先应用上面的协议：单一主要意图、无搭车变更、规范最后。然后检查报告列出的每个条目。条目 d 适用于每个拉取请求。报告会自动检查条目 i 到 l，并在每个发现处列出其文件和行号。

- **a. API 增量。** 当前记录决定拉取请求 API 增量的每一新增或更改行，审查机器人会在其摘要说明的开头发布该增量。该记录在合并基时是当前的，或在同一拉取请求中更改。没有任何记录决定的行交由所有者决定；审查不会要求你移除它
  （[`architecture:public-component-api`](../architecture/public-component-api.md#boundaries-and-invariants)
  INV24 和 INV25）。
  另一个组件可以导入的新内部模块或 hook（包的 `internal/` 导出，或在拥有它的组件之外使用的 hook），且没有任何记录定义它，会得到 REQUEST_CHANGES：
  它需要所有者的 API 决定，增量的用途、为什么需要它，以及为什么现有模块不够
  （[`architecture:knowledge-contracts`](../architecture/knowledge-contracts.md#contract-before-escalation)
  第 5 步和 DEC-22）。
- **b. 行为。** 已发布包中的每个可观察行为变更，都引用确定它的当前记录和条款。如果没有改变行为，请在描述中写 "No behavior change"。条款仅确定其文本所述的内容。仅命名 prop、key 或 slot 的条款，或仅命名 WCAG 级别之类的一般基线的条款，不确定最终发布的措辞、默认值、回退或结果。Catalog、Changeset、story 和注释不是记录。未确定的行为交由所有者。Lab 不是稳定的公共承诺，因此仅 Lab 的变更跳过此条目
  （[权威依据](../../AGENTS.md#authority)；
  [`architecture:knowledge-contracts` 升级前的契约](../architecture/knowledge-contracts.md#contract-before-escalation)）。
- **c. 行为 prop。** 选择组件如何响应输入的 prop 命名为 `<thing>Behavior`，并采用行为名称的封闭联合类型。当其值可以命名行为时，其名称不包含任何输入词（press、touch、tap、hover、mouse、click）。一个行为对应一个 prop。当行为因设备而异时，该 prop 提供 `'adaptive'` 或 `'adaptive-<target>'`。新的行为 prop 默认采用已发布的行为。`is…` 或 `has…` 布尔值仅命名真/假的开关
  （[`architecture:public-component-api`](../architecture/public-component-api.md#boundaries-and-invariants)
  INV2 和 INV3）。
- **d. 公共边界。** 源代码、测试、夹具、Changeset、提交消息、分支名称或拉取请求文本中不得包含内部或私有上下文
  （[公共仓库边界](#public-repository-boundary)）。
- **e. 新的公共 hook。** 每个公共 hook 都有一个最小、可运行的示例：一个在 `exampleFor` 或 `alsoExampleFor` 中命名该 hook 的实时模板块。公共 hook 是指包从已发布入口点导出的 hook，因此新的 hook 导出就会产生一个公共 hook。动效和手势 hook 也计入。没有符合规范的示例的公共 hook 是文档缺口，由 issue 跟踪
  （[`architecture:knowledge-contracts`](../architecture/knowledge-contracts.md#consumer-docs)
  INV28 和 DEC-16）。
- **f. 注释。** `packages/*/src/**`（包括 Lab）中新增或更改的注释只解释原因、约束、不变量或平台怪癖。它们不叙述代码、不重述名称，也不引用拉取请求、issue、日期或记录。它们遵循 ASD-STE100 简化技术英语：指令最多 20 个词，描述最多 25 个词，每句一个主题，使用主动语态。文件头保持在约 12 行以内
  （[`architecture:knowledge-contracts`](../architecture/knowledge-contracts.md#source-comments)
  INV29）。
- **g. 记录。** 对 owner-gated 路径的更改会等待 `review-required`，直到规范所有者通过 `/approve-spec <sha>` 或批准审查来批准其规范内容。基线合并、rebase 以及对其他路径的提交会保留该批准。后续更改已批准的规范文本会重置它
  （[`architecture:knowledge-contracts`](../architecture/knowledge-contracts.md#dec-14--one-owner-approval-binds-a-pull-requests-spec-content)
  DEC-14）。描述还会报告 `## Writing rubric results`
  （[编写规范记录](spec-writing.md)）。
- **h. 规模（指引）。** 优先使用约 2,000 个编写行以内的拉取请求，不含 lockfile、快照或生成文件。当更小的变更更易于审查时，审查者可以建议拆分。规模本身从不是阻塞性发现。`packages/cli/assets/templates/` 下的模板可以超过此指引，因为每个模板都是完整示例。对于堆叠的拉取请求，将 `--base` 传为其下方的分支，以便计数仅覆盖其自身的行。
- **i. 共享所有者（自动）。** 在 Core 源代码中，新增的 resize observer、document 或 window 监听器、模块级 warn-once 集合，或跨 shadow root 的父级遍历，都是发现：请调用 `observeResize`、`subscribeInput`、`useDevWarning` 或 `parentAcrossShadow`
  （[`architecture:react-component-runtime`](../architecture/react-component-runtime.md#boundaries-and-invariants)
  INV16）。
- **j. Effect（自动）。** 交互逻辑位于回调中，且没有任何 Effect 响应交互状态。以下情况都是发现：新增的 Effect 没有注释说明它同步的系统；仅将 prop 或 state 复制到其他 state 的 Effect；仅将值复制到 ref 的 Effect（使用 `packages/core/src/hooks/useCommittedRef.ts` 中的 `useCommittedRef` 或 `useCommittedRefInto` 保留最新 prop 或回调）；在渲染期间或 `useMemo` 中读取此类 ref 的 `current`；在渲染期间写入 `ref.current`，但延迟初始化除外，例如 `if (ref.current == null) ref.current = value`；以及将 DOM 节点放入 React state
  （[`architecture:react-component-runtime`](../architecture/react-component-runtime.md#boundaries-and-invariants)
  INV1、INV2、INV3 和 INV17）。
  该检查只读取变更新增或更改的行。以下两处渲染时写入不是发现：Markdown 的流式淡入 ref（`component:Markdown` DEC-7 允许的例外），以及 `useTableSortable` 的 config ref（作为 INV17 的具名缺口豁免，直到所有者决定）。
- **k. 发布说明和记录（自动）。** 发布变更但没有 Changeset 的包；对没有任何发布内容变化的包（例如仅更改测试或工具）使用 `[fix]`、`[feat]` 或 `[perf]` Changeset；以及在本变更所构建的声明上留下缺口行的记录，都是发现。
- **l. 可合并（自动）。** 与基线的冲突是发现。对于工作树，检查会合并最后一个提交。它不会向仓库写入任何内容。

### 为智能体的变更使用全新会话

变更的作者会把意图读进去。审查者只阅读 diff。当智能体编写了该变更时：

1. 启动一个对编写该变更没有记忆的新智能体会话。检出该拉取请求分支。
2. 运行 `pnpm review:pre`。
3. 阅读报告列出的每条记录和声明。
4. 将上述协议和每个列出的检查清单条目应用到 diff。
5. 修复每个发现，或将其拆分出去。再次运行 `pnpm review:pre`。
6. 当没有剩余发现时，请求审查。

## 公共仓库边界

描述、截图、提交、测试和规范记录都是公开的。不要包含内部链接、标识符、主机名、工具或运维上下文。
