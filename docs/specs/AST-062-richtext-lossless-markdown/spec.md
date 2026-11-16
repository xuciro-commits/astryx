---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-062
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-06
phase: accepted
owners: [cixzhang]
affects_architecture: []
affects_families: []
affects_contributing: []
affects_consumer_docs: [RichTextEditor, RichTextView]
---

# Lossless Markdown round trip in RichText system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

一个人用 RichText 编辑器打开 Markdown，然后再导出一次。若他没有改动任何内容，导出的结果就是他打开时的那些字节，一个字节都不差。若他改动了一部分，那么所有他没碰过的部分都会原样返回。不会因为编辑器无法表示某段源文本就让它消失。

## Non-goals

- 由哪种编辑器引擎承担文档编辑，以及编辑器读写的存储值是什么。本记录管辖的是 RichText 的 Markdown 导入与导出返回什么，以及代码块在粘贴之后持有什么（FR3），而不是某个产品究竟存储 Markdown、编辑器状态还是别的东西。
- 哪些构造渲染为结构。`spec:AST-061` 管辖受支持的构造在渲染之后外观如何、含义是什么。
- 一个人所写或所改内容的形式。重新生成的 Markdown 使用写入方转换器的规范形式。
- 协作、持久化与文档托管。
- 满足本契约的等效内部实现仍然有效。

## Requirements

- **FR1 — Exporting unchanged content returns the authored bytes.** 未作编辑而导入 RichText 并导出的 Markdown，对任何输入（受支持的、不受支持的、格式错误的）都与输入逐字节相同。这既适用于 `markdownToEditorStateJSON` 之后接 `editorStateJSONToMarkdown`，也适用于编辑器在载入导入内容之后的 `getMarkdown()`。编辑是指一个人或调用方对文档内容所做的改动。载入、导入规范化、自动链接、已注册的节点变换、选区、历史记录以及其他簿记工作都不算编辑，也不会改变导出结果。
- **FR2 — An edit regenerates only what it changed.** 编辑之后，凡内容未被该编辑改动的顶层块，都按其撰写时的样子原样导出，包括其后的空行与空白。只有被该编辑改动或新建的块才以规范形式导出。
- **FR3 — Regenerated Markdown means what the editor showed.** 重新生成的块的 Markdown 再次导入时，与编辑器当时显示的结构相同：原本是字面量的文本保持字面量，因此一个以转义 `\#` 开头的被编辑段落绝不会被重新载入为标题。代码块只存放代码，因此把富文本粘贴进代码块会落为纯文本：其中不会嵌套任何标题、列表、表格、格式或插件节点。
- **FR4 — The document's envelope and line endings survive.** 字节顺序标记以及第一个块之前的所有内容都原样保留，最后一个块之后的字节也随之一并保留。重新生成的块沿用其撰写时的行尾风格；新块使用文档的第一个行尾，若没有则使用 LF，因此导出的结果绝不会混入输入中本不存在的行尾。
- **FR5 — Unsupported source is kept, never dropped.** RichText 无法表示为结构的源内容会作为可见的字面量文本导入。未经改动时，它按撰写的原样导出（FR1、FR2）；被编辑后，导出结果保留人未删除的每一个字符。
- **FR6 — Every shipped transformer conforms.** FR1–FR5 对 RichText 随附的每一个转换器、节点与插件都成立，包括它们注册的变换。调用方的自定义转换器对所不改变的那些块获得同样的保留效果。

### Platform support

- 受支持的功能/引擎下限：只要 RichText 的 Markdown 导入与导出能运行的地方都适用，包括 Node 中的无头运行。
- 不受支持的行为：无；FR1 与 FR5 覆盖了每一种输入。
- 浏览器证据：不要求。导入与导出是字符串进、字符串出。FR3 的粘贴条款在挂载的编辑器中证明，该编辑器在 jsdom 中接收编辑器的粘贴命令。

## Current-state impact

RichText 的 Markdown 导入与导出采用 FR1–FR6。在本契约之前导入的内容不携带其撰写形式的记录，并且会以规范形式导出，直到它被再次导入。

## Verification

| Contract | Verification                                                                                                       | Representative states                                                                                                                                                                                                    | Mutation or failure expectation                                                            |
| -------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| FR1      | 至少 30 个文档的一致性语料，在不作任何编辑的情况下导入并导出，既有无头运行，也有通过挂载的编辑器并使用随附插件运行 | 缩进为 2 个与 3 个空格的嵌套列表；`\#` 之类的反斜杠转义；`&#169;` 之类的字符引用；带 info string 与元数据的围栏代码；表格；不受支持的 HTML、引用定义与 setext 标题；尾随空白与缺失的最后一个换行；自动链接插件下的裸 URL | 任何块以规范形式而非其撰写字节导出，即判为失败                                             |
| FR2      | 同一语料，编辑其中一个块                                                                                           | 在第一个块、中间一个块与最后一个块中的编辑；插入新块；删除一个块                                                                                                                                                         | 任何未被改动的块改变一个字节即判为失败                                                     |
| FR3      | 导出被编辑的块并再次导入；在挂载的编辑器中进行向代码块的富文本粘贴                                                 | 以转义 `\#` 开头、包含转义 `*` 与 `[`、或以 `1.` 开头的被编辑段落；同时含 HTML 与纯文本的粘贴、仅含 HTML 的粘贴、从编辑器复制的块，以及一个 Markdown 插件节点                                                            | 重新生成的块再次导入时结构不同，或粘贴在代码块中留下元素、装饰器或带格式的文本，即判为失败 |
| FR4      | 包络与行尾，未改动与已编辑                                                                                         | 字节顺序标记；开头的空行；CRLF、LF 以及缺失的最后一个换行，并分别编辑第一个、中间一个与最后一个块以及新增一个块                                                                                                          | 丢失包络中的一个字节，或在 CRLF 文档中出现 LF，即判为失败                                  |
| FR5      | 被编辑与未改动的受不支持构造                                                                                       | 原始 HTML 块；引用定义；脚注                                                                                                                                                                                             | 导出结果中缺失编辑未删除的某个字符，即判为失败                                             |
| FR6      | 以默认转换器与随附插件运行该语料，包括表格与自动链接                                                               | 每个随附转换器都被覆盖                                                                                                                                                                                                   | 任何随附转换器绕过保留机制，即判为失败                                                     |

## Decision log

### DEC-1 — Keep the author's bytes

**Reference:** `spec:AST-062/DEC-1`

**Decider:** cixzhang, 2026-10-06

一份在无人编辑时仍会变化的文档会破坏 diff、审查与对编辑器的信任，而规范形式会丢失作者的选择：缩进、转义、引用、围栏元数据。RichText 保留其未改动内容的撰写形式，只对它改动过的内容写出规范 Markdown。已否决：在导入时做规范化，因为那样每次保存都会重写未改动的行。

### DEC-2 — The top-level block is the unit of preservation

**Reference:** `spec:AST-062/DEC-2`

**Decider:** cixzhang, 2026-10-06

人一次编辑一个段落、列表、表格或代码块，而顶层块可以在不触碰相邻块的情况下重新生成。块内任何位置的编辑都会重新生成该块；在被改动的块内部保留更细的片段属于兼容的细化，而不是要求。

## Open questions

- 无。
