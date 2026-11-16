---
schema_version: 3
template_version: 4
kind: module
id: module:Markdown/sourceLines
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-09
owners: [cixzhang]
review_triggers: [public-api, behavior]
verified_by: [packages/core/src/Markdown/plugins/sourceLines.test.tsx]
parent_component: component:Markdown
references: [spec:AST-036/DEC-1, spec:AST-036/DEC-11, component:Markdown/DEC-2]
---

# Markdown source-lines module contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `markdownSourceLinesPlugin` 是从 `@astryxdesign/core/Markdown/plugins` 导出的一个固定的第一方插件值。安装它之后，`components` 块渲染器会收到一个可选的 `sourceLines` prop。             |
| 行为          | Markdown 渲染的每个块（包括嵌套块）都带有 `data-source-line` 与 `data-source-line-end`：即解析出它的、从 1 开始计数且包含首尾的源行号。行内元素则不带任何此类属性。                     |
| 最终用户影响  | 宿主中按行定位的功能（查找、高亮、评审评论）的读者，得到的结果会指向确切的 Markdown 行，包括列表和引用内部。未安装该插件时则没有任何变化。                                              |
| 构建者影响    | 构建者通过向 `plugins` 添加一个值来选择启用。使用自定义块渲染器的构建者把收到的 `sourceLines` 放在自己的元素上；插件块渲染器则从其节点的 `position` 读取行号。                          |
| 兼容性/就绪度 | 附加式且可选启用。省略或为空的插件列表会保持已发布的 AST、DOM、解析开销与流式复用不变。                                                                                                 |
| 评审检查      | 拒绝以下情况：给 Markdown 增加 prop、在行内元素上打标记、未安装插件却进行行号处理、Markdown 在自定义或插件输出外围添加包装元素、完整解析与流式解析所得行号不一致，或 DOM 中出现偏移量。 |
| 约束规则      | [`spec:AST-036` FR3, FR9, FR15, FR40](../../../AST-036/spec.md)；[`component:Markdown` FR3, FR12, FR15](../Markdown.spec.md)。                                                          |

本表是评审用的投影；下方正文才具有权威性。

## Intent

宿主若要把渲染后文档中的某个对象映射回其 Markdown 源（选区、搜索命中、diff 片段、评论锚点），就需要知道每个渲染块来自哪些源行。以行为单位，是因为 diff、blame 和编辑都以行为地址，而且嵌套在列表项或引用中的块有行、却没有连续的字符范围。该模块为 Markdown 渲染的每个块给出行号，因此宿主可以用插件和宿主代码构建这些功能，而不必分叉渲染器。

## Compatibility and migration

- 已发布默认行为保持不变：`yes`
- 兼容性类别：附加式且可选启用
- 迁移决策：`module:Markdown/sourceLines/DEC-1`

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 导出的插件值及其稳定的插件名。
- 插件安装期间，Markdown 渲染的块上的 `data-source-line` 与 `data-source-line-end` 属性，以及给予 `components` 块渲染器的 `sourceLines` prop。
- 插件安装期间，有源文件依据的块节点（包括嵌套块）的规范 `position` 上的行号。
- 针对这些行号的完整解析、流式解析与服务端渲染证据。

**不拥有 / 非目标**

- 聚合插件协议、顺序与组合 —— 由 `component:Markdown` 和 `spec:AST-036` 拥有。
- 把 DOM 选区或搜索命中映射到行、高亮，或任何其他基于这些标记构建的宿主功能 —— 由产品调用点拥有。
- 行内节点、表格行或表格单元格上的行号或列位置。
- DOM 中的字符偏移量，以及已发布的 `range` 投影 —— `parseMarkdown(source, {sourceRanges: true})` 保持其已发布行为。
- 自定义渲染器或插件渲染器拥有的元素；Markdown 不会添加包装元素来在其上放置标记。

## Public API and concepts

| 概念                        | 封闭取值或状态                                                                                                            | 含义                                                                  | 默认值 | 拥有者                        | 稳定性 |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ------ | ----------------------------- | ------ |
| `markdownSourceLinesPlugin` | 一个 `MarkdownPluginEntry<never>`                                                                                         | 把它传给哪个 Markdown、parser 或 Outline 调用，就为该调用开启源行号。 | 缺失   | `module:Markdown/sourceLines` | 稳定   |
| 源行号                      | `{start, end}`：指向解析器所接收字符串的、从 1 开始计数且包含首尾的行号                                                   | 块自身源码所占据的行，从其第一行到最后一个非空行。                    | 无     | `module:Markdown/sourceLines` | 稳定   |
| 已打标记的块                | Heading、Paragraph、列表项、Code block、Blockquote、Table、Divider，以及默认路径上的块级 Image                            | 带有 `data-source-line="<start>"` 与 `data-source-line-end="<end>"`。 | 无     | `module:Markdown/sourceLines` | 稳定   |
| `sourceLines` prop          | `{start: number, end: number}`，出现在 `heading`、`paragraph`、`code`、`blockquote`、`hr`、`image` 和块级 `math` 渲染器上 | 被替换块的源行号，供渲染器放在自己的元素上。                          | 缺失   | `module:Markdown/sourceLines` | 稳定   |

## Behavioral contract

| ID  | 不变式                                                                                                                                                                                                                                                         | 依据                        | 草案评审状态 |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------ |
| FR1 | 安装插件后，每个被标记的块（无论嵌套多深）都带有 `data-source-line` 与 `data-source-line-end`，其值为十进制整数形式的源行号。行内元素、表格行和表格单元格都不带这两个属性。                                                                                    | 宿主按行定位的功能          | 已定案       |
| FR2 | 行号按解析器所接收的确切字符串统计 LF 与 CRLF 行尾，包括原生 frontmatter 块所占据的行，因此第 1 行就是该字符串的第一行。                                                                                                                                       | `spec:AST-036` FR9          | 已定案       |
| FR3 | 块的行范围从其第一行源码行延伸到其最后一个非空源码行，包括它自身的容器标记（`>`、列表标记）、惰性续行，以及代码围栏的开闭行。                                                                                                                                  | `component:Markdown` FR23   | 已定案       |
| FR4 | 传入的 `components` 块渲染器会收到 `sourceLines`，并由它决定自己的元素是否以及在何处携带这些属性。Markdown 不添加包装元素，也不把属性强加给替换结果。行内数学公式（`display: 'inline'`）以及短语内容中的图片没有 `sourceLines`，因为二者都不是块。             | `component:Markdown` FR3    | 已定案       |
| FR5 | 规范树中所有有源文件依据的块节点（包括扩展块和语义围栏提案的节点）都在 `position.start` 与 `position.end` 上带有 `line`，因此插件块渲染器和 transform 可以从节点读取行号。                                                                                     | `spec:AST-036` FR9          | 已定案       |
| FR6 | 流式解析在每个分块边界上都收敛到同一文本完整解析所得的行号，且已定案的块在更多文本到达时保持其行号与已渲染元素。                                                                                                                                               | `spec:AST-036` FR15, FR21   | 已定案       |
| FR7 | 未安装插件时，规范树不带 `line`，DOM 不带任何源行属性，`components` 渲染器收不到 `sourceLines`，解析也不做任何行号处理。安装后，源行号来自 Markdown 本就执行的那一次解析所得的位置：插件不增加解析轮次，也不做逐块重新分词，未安装时不运行任何位置或行号处理。 | `spec:AST-036` FR2, FR3     | 已定案       |
| FR8 | 该插件不引入任何扩展节点、渲染器、元素、主题目标或源码改动，并可与任意顺序的其他插件组合。                                                                                                                                                                     | `spec:AST-036` FR40, DEC-11 | 已定案       |

### Transformation and precedence order

- **ORD1 — 行号是解析输出。** 核心在解析时写入这些行号；transform 观察有源文件依据节点上的行号，不能写入、移动或伪造它们（`spec:AST-036` FR11）。transform 创建的节点没有位置，其渲染块也不带标记。

### Performance and resources

- **PR1 — 开销有界。** 行号处理在既有解析过程中记录，在完整与流式模式下都保持在 `spec:AST-036` FR23 针对单个辅助的第一方辅助预算之内。安装插件后的流式解析与未安装时的流式解析一样复用已定案的块。

## Accessibility contract

- **AR1 — 仅使用 data 属性。** 这些标记不添加 role、名称、焦点目标或文本，也不改变阅读顺序。

## Design relationships

该模块不新增解剖结构、样式或主题目标。

## Parent and system relationships

- `component:Markdown` 拥有解析、渲染、`components` 接缝与回退。
- `spec:AST-036` 拥有插件协议、规范 `position` 与第一方插件规则；DEC-11 允许本模块使用的内部接缝，因为本记录拥有该结果，且空管道保持不变。

## Verification map

| 契约    | 验证                                            | 代表性状态                                                                        | 变异或失败预期                                                                               |
| ------- | ----------------------------------------------- | --------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1–FR3 | `sourceLines.test.tsx` DOM 与 AST 测试夹具      | 每种被标记的块类型；嵌套列表与引用块；惰性续行；CRLF；frontmatter；行内强调；表格 | 标记缺失、位置偏移，或标记出现在行内元素上，即失败。                                         |
| FR4–FR5 | `sourceLines.test.tsx` 渲染器测试夹具           | 每个 `components` 块渲染器；一个插件块渲染器；一个被认领的语义围栏                | 渲染器收不到 `sourceLines`、Markdown 添加了包装元素，或节点没有行号，即失败。                |
| FR6     | `sourceLines.test.tsx` 逐字符流式测试           | 在每一字符处切分的顶层、嵌套与围栏块                                              | 流式行号与完整解析不一致，或已定案块被重新挂载，即失败。                                     |
| FR7–FR8 | `sourceLines.test.tsx` 与现有 Markdown 测试套件 | 省略插件、空列表、带标题链接和软换行的插件                                        | 未安装插件却出现任何行号、属性或 prop，默认 DOM 发生变化，或安装插件后多了一次解析，即失败。 |
| 性能    | Markdown 性能的空插件/插件配对运行              | 完整与流式模式                                                                    | 超出单辅助预算，或失去已定案块复用，都会阻止验收。                                           |

## Decision log

### DEC-1 — Source lines ship as one fixed plugin value

**Reference:** `module:Markdown/sourceLines/DEC-1`

**Decider:** `cixzhang`, `2026-10-09`

需要源行号的宿主功能像其他所有 Markdown 功能一样，通过安装插件实现，而该插件只有一个含义，无需任何配置。Markdown 给它渲染的块打上标记，并把行号交给替换其块的渲染器，因为那是它唯一拥有的元素；宿主或插件渲染器再把它们放在自己的元素上。进入 DOM 的是行号而不是偏移量，因为嵌套块没有连续的字符范围。

已否决：在 Markdown 上加布尔 prop；在默认路径上给每个渲染器提供位置，这会让每个调用方付出代价；插件 DOM 钩子，`spec:AST-036` 已排除该方案。

## Open questions

无。

## Content boundary

本记录不重复使用方签名或示例、父级解析或渲染机制、基于这些标记构建的宿主功能，也不重复当前审计结果。它链接到它们的规范拥有者。
