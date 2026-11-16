---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-083
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
affects_consumer_docs: [cli]
---

# Search and build result order system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

`astryx search` 与 `astryx build` 会在候选之间做挑选。每个答案包含什么是一份契约：哪些条目匹配、它们的得分、它们的理由以及它们的计数。而强度相同的匹配之间的顺序则不是。那个顺序是一种经过度量的质量，只要某次度量显示新顺序至少与旧顺序一样好，它就可以改变。

`astryx component`、`astryx template` 与 `astryx docs` 的未找到错误以同样的方式工作：建议列表的事实成立，而列表内部的顺序是一种经过度量的质量（FR7）。

本记录拥有这一划分：每个答案必须保留的事实，以及改变其内部顺序的规则。search 拥有自己的匹配。`spec:AST-048` 拥有 build 推荐什么，并将其各块的顺序委托给本记录，因为同一条规则同时管辖两个命令的顺序。`spec:AST-017` 拥有响应字段与兼容性。

## Non-goals

- 哪种排序方法或权重胜出。它们是度量出来的，并会在 FR6 下改变。
- search 如何匹配或给条目打分。
- build 的起始模板、替代方案以及页面调用（`spec:AST-048`）。
- 只要满足本契约，等价的内部实现就仍然有效。

## Requirements

- **FR1 — search 以词法匹配作答。** 每个结果都是词法排序器匹配到的条目，带有该排序器的得分与理由，且 `matchCount` 等于它的匹配数量。对于同一查询与同一限制，search 返回的结果绝不多于词法排序器。
- **FR2 — 分段之间不交叉。** search 只在一个同分数分段且同类型（doc 或非 doc）的连续段内部对匹配排序；分段是词法得分的区间，因此在同一分段内部，较低分可以领先较高分。匹配绝不越过另一分段或另一类型的匹配；在各连续段之间，词法顺序成立，包括其域优先级。
- **FR3 — 完整名称保持今天的答案。** 若查询是某条目的完整名称或标题，且破折号与空格同样看待，则得到词法排序器原样不变的答案。
- **FR4 — build 为其块槽位排序块目录。** `spec:AST-048` 拥有 build 列出哪些块，并在此委托它们的顺序。build 的 `blocks` 持有的块数与 build 自身列出的块数一样多，每块各一次，且每块都来自项目能够脚手架生成的块目录。build 自身列出的块保留其条目，search 返回的块保留 search 的条目，而任何其他块携带选择器自身的得分与理由。块按其自身的文档排序，因此固定值从未拟合过的块也以同样方式排序。请求以其精确块名指名的块，以及来自集成包的块，保留 build 给予它们的位置。新增块的描述会被缩短，但绝不是块的取舍，因此任何答案都不会比 build 此前给出的最长答案更长。
- **FR5 — 顺序是局部的、确定性的且静态的。** 连续段内部的顺序来自普通代码与随 CLI 一起发布的固定值。不运行任何模型运行时，不使用网络，相同的输入给出相同的顺序。同名的条目在每个宿主上以相同方式排序：宿主的语言设置绝不改变结果或列表的顺序。
- **FR6 — 顺序只在度量之后改变。** 对连续段内部顺序的改变，无论是新权重、新搜索器还是新规则，只有当针对留出集、新采集集、合成集与冷启动评测集进行度量后显示没有任何一行比先前顺序更差时才会发布。冷启动集对拟合时隐藏的目录条目按其自身文档进行排序。当某一行变化的配对 95% 置信区间完全低于零时，该行即为更差。FR1–FR5 对每次改变都成立。
- **FR7 — 未找到建议保持其事实。** 当 `astryx component`、`astryx template` 或 `astryx docs` 未指名任何内容时，它建议的条目数量不超过其候选集所给出的数量：对于组件，是组件匹配器的近顶端匹配（至多五个，且当存在两个时至少两个）；对于模板，是每一个模板；对于 docs，是其错误给出的路由（对于未知路由，是 `spec:AST-046` FR6 所指名的集合）。每条建议都是该命令的一个真实目录条目，只有一个例外：当 docs 参数在任何大小写下、且不含空格与连字符时，等于某个组件、hook（带或不带 `use`）或模板的精确名称，则第一条 docs 建议是读取该条目的命令（`astryx component Button`），并且最后一条路由会被丢弃；当它建议的路由中没有一条与参数共享同一个词时，该命令就是唯一的建议。能解析的名称会持续解析到同一条目。组件在另一种大小写下的精确名称即属于该组件：仅仅拼写相同的模块绝不会为其解析。哪些候选填满组件列表，以及每个列表的顺序，只在 FR6 下改变，并在留出集与新采集的失败查找评测集上度量。FR5 对此顺序成立。

## Current-state impact

- `architecture:cli-surface`：对其规则没有任何影响；search 与 build 保持它们的 JSON 形状。
- 使用方文档：`search()` 的文档与 `score` 字段描述随版本发布的顺序。

## Verification

| 契约     | 验证                                                                                                                                   | 代表性状态                                                                       | 变更或失败预期                                                                                     |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| FR1, FR2 | `api/search/_order.test.mjs` 针对词法排序器；对每个真实查询与合成查询的重放                                                            | 多词查询、文档小节、域优先级合并                                                 | 非词法结果、改变了的得分、理由或计数、跨分段移动，或多余结果，均失败                               |
| FR3      | `api/search/_main-searcher.test.mjs` 的完整名称用例                                                                                    | 精确名称、以空格代替破折号输入的名称                                             | 与词法排序器的答案不同则失败                                                                       |
| FR4      | `api/build/blocks/blocks.test.mjs`、`api/build/tree.test.mjs`                                                                          | 精确指名的块、集成块、未拟合的块                                                 | 目录之外的块、重复的块、改变了的条目、没有得分与理由的条目、移动了的精确指名块，或更多的块，均失败 |
| FR5      | `_main-searcher.test.mjs` 与 `tree.test.mjs` 的离线与重复检查；`component.host-locale.test.mjs` 与 `build.test.mjs` 的宿主语言环境检查 | 网络被桩为抛出异常；重复运行；在英语、捷克语与夏威夷语宿主语言环境下执行相同命令 | 网络调用或不同的重复运行失败；在宿主语言环境之间不同的顺序失败                                     |
| FR6      | 在评测集上做度量比较，并在该变更的描述中报告                                                                                           | 留出集、新采集集、合成集、冷启动集                                               | 配对置信区间低于零的行会阻止该变更                                                                 |
| FR7      | `foundation/text/suggest-order.test.mjs`；组件、docs 与模板命令测试；对每个已标注的失败查找的重放                                      | 复合名称、其他库的名称、命名空间下的路由                                         | 更长的列表、不是条目的建议、改变了的解析，或度量更差的行，均失败                                   |

## Decision log

### DEC-1 — matches inside a score band are ordered by measured, static weights

**Reference:** `spec:AST-083/DEC-1`

**Decider:** `josephfarina`, `2026-10-20`

CLI 负责人选择用普通、带类型的分支持续改进顺序，并在答案薄弱处调参：“为薄弱之处扩展出树的分支并在那里调参”，“强类型且统一……然后我们就可以爬山并持续提升这些数字”，使用不含模型运行时的普通算法。因此，匹配分段内部的顺序才是会被改进的部分。

已否决：在 CLI 中使用模型运行时，它会增加安装体积，并给出无法追溯到代码的答案。

### DEC-2 — the answer's facts are the contract; the order is measured

**Reference:** `spec:AST-083/DEC-2`

**Decider:** `josephfarina`, `2026-10-20`

用 CLI 负责人的话说，“search 的顺序大体上只在它针对我们的数据经过测试、并且比之前更好或相同时才重要”。顺序受度量约束（FR6）。读者或调用方所依赖的事实则无条件成立（FR1–FR4）。

## Open questions

无。
