---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-061
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
affects_consumer_docs: [Markdown, RichTextEditor, RichTextView]
---

# Markdown document surface parity system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

当核心 `Markdown` 与 RichText 表面（`RichTextEditor` 和 `RichTextView`）显示同一份 Markdown 文档时，一个人看到的是一份文档：在每个表面上都是相同的排版、块间距、行宽、结构与方向。当产品就地在这份文档的阅读与编辑之间切换时，该切换不移动任何块相对于其他块的位置，也不重排任何一行；只有编辑可供性出现或消失。

## Non-goals

- 字节完全一致的 DOM。当渲染结果及其语义一致时，每个表面保留自己的标记。
- Markdown 方言本身，以及 RichText 如何导入和导出 Markdown 源文本。本记录规定受支持的构造在渲染之后长什么样、意味着什么，而不规定哪种源文本产生它或源文本如何往返。唯一的例外是 DEC-5 共享的字符引用解码器。
- 协作、持久化、文档托管，以及 Markdown 插件与编辑器之间的插件适配器。
- 产品选择哪种编辑器引擎来编辑整份文档，以及该产品存储的值。本记录规定各表面如何渲染同一份文档；RichText 自身的角色与值由 DEC-7 规定。
- RichText 的发布通道。包的发布通道元数据决定它（spec:AST-033 FR4），晋级遵循 spec:AST-017 FR23；本记录不决定。
- 等价的内部实现在满足本契约时仍然有效，例外是字符引用解码器，DEC-5 使它成为一个共享的公共函数。

## Requirements

- **FR1 — 契约决定，而不是任一渲染器。** 当 `Markdown` 与某个 RichText 表面就同一受支持内容出现分歧时，CommonMark 语义决定含义，共享的字号阶梯、间距与颜色 token 决定呈现。任一表面的当前输出都不是基准：不一致要按契约判定为错误的那一侧来修复，而那一侧可能是 `Markdown`。
- **FR2 — 排版一致。** 正文使用 `--text-body-size` 与 `--text-body-leading`；标题级别 N 在 1–6 级使用标题字体族，以及 `--text-heading-N-size`、`--text-heading-N-weight` 与 `--text-heading-N-leading`。粗体文本使用 `--font-weight-semibold`。内联代码在每个表面上使用相同的 chip 尺寸、字体族与内边距。
- **FR3 — 块间距一致。** 块之间按每档密度一张间距表分隔。默认密度：标题 1–3 前为 `--spacing-6`、后为 `--spacing-3`；标题 4–6 前为 `--spacing-4`、后为 `--spacing-2`；段落与列表两侧均为 `--spacing-3`；围栏代码、引用块与表格为 `--spacing-4`；主题分隔线为 `--spacing-6`。紧凑密度使用同一张表的紧凑列。第一个块的前置外边距与最后一个块的后置外边距为零。
- **FR4 — 行宽一致。** 行文块的内容宽度上限相同，默认 `680px`；宽块（围栏代码、表格）在每个表面上都占满可用宽度。作者设定过列宽的 RichText 表格在 `RichTextEditor` 与 `RichTextView` 中保留这些列宽（`spec:AST-106/DEC-3`）。
- **FR5 — 结构一致。** 段落中的软换行合并为一行连续文本；硬换行则断开。引用块中的多行延续为一个段落。有序与无序列表按 CommonMark 的缩进嵌套，每个条目显示一个标记，标记样式由其深度决定（DEC-6）。无序列表在每一级嵌套保持相同的主题内缩。在每个列表中，同方向阅读的兄弟条目共享同一条行内起始线；与其兄弟方向相反的条目从对侧边缘开始，如 FR6 所要求。嵌套在这些条目之下的列表以其自身条目的行作为锚点；编号列表的内缩遵循 FR11。任务列表条目、围栏代码、表格与主题分隔线渲染为这些结构，绝不渲染为其字面源文本。围栏代码在每个表面上对长行换行；代码行绝不横向滚动或被裁切（DEC-9）。
- **FR6 — 方向跟随承载它的文本。** 行文块——段落、标题、引用或列表条目——在每个表面上都按其自身文本的方向布局，包括 `Markdown`、`RichTextEditor` 与 `RichTextView`，且在任意嵌套深度。文本中没有强方向字符的块采用周围国际化提供方的方向，这覆盖空块、数字、标点与图片。

  容纳多个块的行文块——一个引用，或一个含多个段落的列表条目——其方向取自其下所有文本的第一个强方向字符，而它内部的每个块以同样方式取各自的方向。

  容器不是行文，无论容纳什么都采用其父级的方向：顶层取提供方的，嵌套时取其包裹条目的。列表以此排列其标记与内缩，表格以此读取其列，围栏代码块以此框定其行，并让每一行从该行的第一个强字符取得自己的方向。

  表格单元格是容器，随其表格排列，而单元格的文本在每个表面上按其自身方向阅读。当某个表面把该文本包裹在块中时，由该块承载方向；当它不包裹时，由单元格承载，因此同一个单元格在三个表面上读起来都一样。

  方向决定块的对齐、其逻辑内缩，以及其光标移动的方向。若某个表面从提供方取得这些，而块的文本方向相反，就会把从右到左段落的光标放在错误的一侧，并让它与方向键的移动相反。

- **FR7 — 语义一致。** 粗体、强调、删除线、内联代码与链接在每个表面上暴露相同的元素语义。链接的目标绝不包含其标题；标题作为链接的标题暴露。文本中的命名与数字字符引用，例如 `&copy;` 与 `&#169;`，在每个表面上渲染为其所指的字符；在内联代码与围栏代码内则保持字面。每个表面都用 `Markdown` 导出的那一个解码器解码它们（DEC-5）。
- **FR8 — 代码块外框一致。** 围栏代码块在阅读与编辑模式下以相同高度显示相同的外框——其头部，或没有头部时的角部集群，以及语言标签与复制操作，按 `component:CodeBlock` FR3 与 FR11 的位置放置，因此切换不会移动代码。在编辑模式下，外框——头部或角部集群——位于可编辑文本之外：它不是文档的一部分，不能被编辑。
- **FR9 — 就地阅读与编辑。** 编辑模式可以添加光标、选区、占位符、焦点环、字段边框与内缩，以及一个工具栏。这些合起来把整份文档偏移一个固定量：在该偏移之后，每个块的顶部与高度在 2 px 以内与阅读模式一致，每个段落保持其行数。工具栏要么覆盖内容，要么占据阅读模式也预留的空间，因此编辑时该偏移不变。
- **FR10 — 滚动位置在切换后保留。** 在阅读与编辑之间切换之前位于视口顶部的块，在切换之后仍位于视口顶部，处于 FR9 的偏移之内。
- **FR11 — 编号列表的缩进在列表内共享。** 编号列表可以将标记空间从常规的主题列表内缩加宽，以容纳该列表中渲染最宽的计数器。同方向阅读的兄弟条目从同一条行内起始线开始其文本；单个计数器不得移动其条目的文本或嵌套在其下的列表。计数器在一行内保持完整，不被裁切、截断，也不与条目文本重叠。同一深度的不同列表在其最宽计数器不同时可以有不同内缩；每个嵌套列表从其父条目文本的起点解析自己的内缩。该许可既不改变源嵌套，也不改变 DEC-6 的编号与标记样式。它不免除渲染器一致性：对同一个列表、主题、密度与可用行宽，Markdown 与 RichText 表面保持一致的文本起点与嵌套内缩，且 FR9 的阅读/编辑几何与重排要求仍然成立。

### Platform support

- 支持的功能/引擎下限：仓库的浏览器支持矩阵。
- 不受支持的行为：某个表面尚不能渲染为结构的构造，渲染为其字面源文本。它绝不会被丢弃。
- 浏览器证据：共享一致性测试夹具在手机与桌面宽度、浅色与深色、从左到右与从右到左下的真实浏览器块几何，以及一份在下半部分于阅读与编辑之间切换的长文档。

## Current-state impact

`Markdown` 已经为其自身输出渲染 FR2–FR4，以及除其对侧边缘条款之外的 FR5，例外之处是 FR7 命名链接标题与 FR7 命名字符引用的地方。`RichTextEditor` 与 `RichTextView` 就其渲染的构造受 FR2–FR11 管辖；它们的默认编辑器主题遵循 FR2 与 FR3。实现差距：`Markdown` 与 RichText 都按提供方的方向布局每个块（FR6，以及 FR5 的对侧边缘条款）；RichText 在 `editorTheme.ts` 中的 `direction: inherit` 覆盖是该差距的一部分。围栏代码行在两个表面上都采用外框的方向，因此两者都尚未满足 FR6 的逐行规则。`component:CodeBlock` 保持代码块的方向不变（FR9），并把行内排序留给平台文本引擎，因此补上该差距会同时改变那条记录与这些表面。`@astryxdesign/core/Markdown/parser` 与 `@astryxdesign/core/Markdown` 导出 `decodeMarkdownCharacterReferences`，即 RichText 表面导入使用的 DEC-5 解码器。`Markdown` 在每一深度绘制实心圆点与十进制标记，RichText 把第二级项目符号绘制为实心圆点；两者都采用 DEC-6 的标记循环。RichText 采用 DEC-8：其包入口停止导出 `sharedEditorTheme`、`URL_MATCHER`、`EMAIL_MATCHER` 与 `Transformer`；`RichTextEditorToolbar` 获得 `BaseProps` 与 `ref`，并将 `linkOpensInNewTab` 改名为 `hasNewTabLinks`；其 Lexical 对等版本范围移至 Lexical 0.52 次版本。`Markdown` 不换行地渲染围栏代码并横向滚动，现采用 FR5 的换行；RichText 已经对围栏代码换行。就地切换的产品通过把字段的内缩与边框设在其外部，使编辑器的文本与阅读表面一样宽，如 RichTextEditor 文档所示；独立编辑器保持其表单宽度。`Markdown` 通过 `component:CodeBlock`，与 RichText 表面一样，把 Copy 悬浮在未命名语言的围栏代码之上；两者都采用 `component:CodeBlock` FR11 所放置的 FR8 角部集群。RichText 代码块使用 `component:CodeBlock` 的 tokenizer 着色，`RichTextEditor` 与 `RichTextView` 接受与 `Markdown`（`component:Markdown` FR30）相同的 `codeLanguages` 列表，即 `component:CodeBlock` 的语言模块（FR13），并用其中匹配项的 `name`（一个逐字显示的标识符，`component:CodeBlock` FR13）为围栏加标签，如同 `Markdown` 所做的那样，因此阅读与编辑为相同的语言着色并加标签，但首个词超出字母、数字与下划线之外的围栏除外，例如 `c++`、`c#`、`objective-c`、`rust,ignore` 或 `diff-ts`：`Markdown` 按围栏的前导词字符读取（`component:Markdown` FR29），而 RichText 保留整个首个词。

## Verification

| 契约       | 验证                                                                        | 代表性状态                                                                                                                                                     | 变异或失败预期                                                                                                                         |
| ---------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| FR2–FR4    | `Markdown` 与 RichText 上一致性测试夹具的真实浏览器计算样式与块几何         | 390px 与 1440px；浅色与深色；默认密度                                                                                                                          | 恢复硬编码的标题尺寸或不同的块外边距会使某个块移动超过 2 px 而失败                                                                     |
| FR5        | 一致性测试夹具的真实浏览器结构与行数                                        | 2 空格与 3 空格缩进的嵌套列表；软换行；引用块延续                                                                                                              | 展平嵌套列表或把软换行变成换行会失败                                                                                                   |
| FR6        | 每个块的真实浏览器计算方向、对齐与光标移动                                  | 从右到左提供方配从左到右文本及其反向；一份混合文档；只含数字、标点或图片的块；条目双向阅读的嵌套列表；含方向不同段落的引用与列表条目；单元格双向阅读的表格     | 行文块或表格单元格的计算方向与其自身文本不一致、中性块不跟随提供方，或列表、表格或围栏从内容取方向，均失败                             |
| FR7        | 每个表面上内联标记、链接与字符引用的语义 DOM                                | 带标题的链接、裸链接、粗体、强调、删除线；文本中与代码中的 `&amp;`、`&copy;`、`&#169;`                                                                         | 目标内出现标题、用带样式的 span 替代语义元素，或文本中未解码的引用，均失败                                                             |
| FR7, DEC-5 | 经 `Markdown` 渲染与 RichText 导入的共享一致性用例                          | 命名、十进制与十六进制引用；未知名称；缺少分号；无效码点                                                                                                       | 出现第二张引用表，或解码器改变了未知名称或未终止的引用，均失败                                                                         |
| FR5, DEC-9 | 两个表面上长行代码夹具在阅读与编辑下的真实浏览器行盒与水平溢出              | 390px 与 1440px；浅色与深色；从左到右与从右到左                                                                                                                | 代码块的滚动宽度超过其客户端宽度，或长行在一种模式下比另一种更高，均失败                                                               |
| FR5, DEC-6 | 两个表面上每个深度的真实浏览器标记样式                                      | 嵌套 0–8 层且类型混合的项目符号与编号列表；在 alpha 与 roman 深度处起始值为 0、−1、26、27、3999 与 4000；从右到左；浅色与深色                                  | 某一层级绘制了另一层级的标记，或一个表面与另一个不同，均失败                                                                           |
| FR5, FR11  | `Markdown` 与 RichText 上计数器的真实浏览器行盒、兄弟文本起点与嵌套列表内缩 | 同一深度的短计数器与宽计数器列表；十进制 9–10 与 99–100；alpha z–aa；roman vi–viii；相邻父级其子列表的最宽计数器不同；手机/桌面；LTR/RTL；浅色/深色；阅读/编辑 | 计数器被拆分、裁切或重叠，同方向阅读的条目之间文本位移，嵌套列表锚点偏离其自身条目的文本起始线，或跨渲染器/阅读-编辑内缩不一致，均失败 |
| FR8        | 两种模式下代码块头部的真实浏览器几何                                        | 带 info string 的围栏代码；带语言的一行围栏；无语言的长围栏                                                                                                    | 头部或角部集群只出现在一种模式、任一模式下有控件覆盖代码，或某行在两种模式间换行方式不同，均失败                                       |
| FR9–FR10   | 一致性测试夹具与长文档的真实浏览器阅读/编辑切换                             | 位于开头的短文档；位于下半部分的长文档                                                                                                                         | 逐块位移超出固定偏移，或锚定块离开视口顶部，均失败                                                                                     |

## Decision log

### DEC-1 — Parity is a shared contract, not a copy of `Markdown`

**Reference:** `spec:AST-061/DEC-1`
**Decider:** cixzhang, 2026-10-06

读者在同一份文档的阅读与编辑表面之间移动，因此文档在两边必须看起来一致、含义一致。契约是 CommonMark 语义加上共享 token，因为读者的预期正来自这些。当 `Markdown` 是偏离它们的那一侧时，`Markdown` 改变。已否决：把当前 `Markdown` 的输出当作基准，因为那会把它的缺陷复制到每一个编辑器表面。

### DEC-2 — Editing affordances offset the document but never reflow it

**Reference:** `spec:AST-061/DEC-2`
**Decider:** cixzhang, 2026-10-06

编辑器需要光标、工具栏与字段外框，因此编辑模式不可能与阅读模式逐像素相同。固定偏移保住了读者的位置：每一行相对其他行的位置不变，滚动锚点仍在视口顶部。2 px 吸收渲染器之间的亚像素舍入；它并不允许不同的间距取值。

### DEC-3 — Character references render decoded

**Reference:** `spec:AST-061/DEC-3`
**Decider:** cixzhang, 2026-10-06

在一个表面上看到 `&copy;`、在另一个表面上看到 `©` 的读者，看到的是两份文档。CommonMark 把引用渲染为其所指的字符，因此两个表面都如此；代码则精确显示所输入的内容。

### DEC-4 — Read and edit share the code block header

**Reference:** `spec:AST-061/DEC-4`
**Decider:** cixzhang, 2026-10-06

语言标签在两种模式下都告诉读者代码是什么，而只存在于一种模式的头部会在切换时移动每一行代码。头部是围绕文档的外框，而不是文档内容，因此编辑永远触及不到它。

### DEC-5 — One decoder for character references

**Reference:** `spec:AST-061/DEC-5`
**Decider:** cixzhang, 2026-10-06

`decodeMarkdownCharacterReferences(text)`，从服务器安全的 `@astryxdesign/core/Markdown/parser` 子路径以及 `@astryxdesign/core/Markdown` 导出，返回把每个有效的命名或数字字符引用替换为其所指字符后的 `text`，并按 CommonMark 的规定，把指向 NUL、代理项或超出 U+10FFFF 的码点的数字引用替换为 U+FFFD；未知名称、缺少分号的引用以及所有其他文本保持原样。它作用于纯文本，对 Markdown 一无所知：每个调用方决定它在哪里应用，因此反斜杠转义与代码保持字面。它就是 `Markdown` 自身渲染所用的解码器：一个实现与一张命名的引用表，为 `Markdown` 私有，因此各表面无法彼此漂移。这是本记录关于导入机制与等价内部实现的非目标的一处狭窄例外；其他所有内部实现仍然自由，且不导出任何通用 HTML 实体工具。

### DEC-6 — List markers cycle by depth

**Reference:** `spec:AST-061/DEC-6`
**Decider:** cixzhang, 2026-10-06

列表的深度是包裹它的列表（项目符号或编号）的层数；顶层列表深度为 0。项目符号列表在其深度对 3 取余为 0、1 或 2 时分别绘制实心圆点、空心圆或方形标记；编号列表以同样方式把其数字写为十进制、小写字母或小写罗马数字。该循环无休止地重复，因此每一级都与其相邻层级不同，读者在每个表面上都能分辨深度。编号保留列表的起始值并计数相同的条目；改变的只是每个数字的书写方式。`z` 之后的字母继续为 `aa`、`ab` 等等。超出其样式范围的数字——小写字母或小写罗马数字样式下的零或负数（起始值为 0 或更低时即如此），或小写罗马数字下超过 3999 的数字——以十进制书写，正如 CSS 计数器样式的回退；起始值与条目保持原样。任务列表条目显示复选框而不是标记。标记是呈现：列表保留其列表语义，源不改变。

### DEC-7 — RichText is a form-field editor whose value is Lexical editor state

**Reference:** `spec:AST-061/DEC-7`
**Decider:** cixzhang, 2026-10-14

`RichTextEditor` 是一个公共表单字段编辑器：一个带标签的字段，人在其中撰写带格式的文本。其值是序列化的 Lexical `EditorState` JSON：`defaultValue` 接受它，`onChange` 报告序列化为它的编辑器状态，而 `RichTextView` 渲染它。Markdown 是一种导入与导出格式，而不是该值：`markdownToEditorStateJSON` 与 `editorStateJSONToMarkdown` 在两者之间转换，该转换返回什么由 `spec:AST-062` 拥有。RichText 不是文档宿主：协作、持久化与文档托管留在产品侧，产品把它们围绕编辑器带来，或通过 `plugins` 带来。RichText 提供 `spec:AST-106` 允许的选入式文档可供性，每一项都通过 `plugins` 作为插件；在全部关闭的情况下，它就是本决策所描述的表单字段。本记录仍然是 RichText 与 `Markdown` 共享的那一份视觉契约。

### DEC-8 — RichText's public surface is Lexical's, kept small

**Reference:** `spec:AST-061/DEC-8`
**Decider:** cixzhang, 2026-10-14

RichText 构建在 Lexical 之上并如实说明：`nodes` 与 `transformers` 接受 Lexical 类型，`plugins` 接受 Lexical React 插件，`onChange(editorState, editor)` 与编辑器 ref 的 `getEditorState()` 报告 Lexical 类型，因此调用方直接用 Lexical 扩展编辑器。该包支持一个 Lexical 次版本，并在其 Lexical 对等版本范围中声明它；`spec:AST-017` 对该次版本的变更进行分类。该包只导出调用方构建所需的内容：生成的编辑器主题类、自动链接正则表达式，以及 Lexical `Transformer` 类型的再导出都是内部的，而 `Transformer` 来自 `@lexical/markdown`。`RichTextEditorToolbar` 接受 `BaseProps` 与 `ref`，并把它们传给其渲染的核心 `Toolbar`，后者按放置自己属性的方式放置它们：`ref` 与样式放在其根上，其他基础 props 放在其 `role="toolbar"` 元素上。它关于在新标签页打开的链接的选项是 `hasNewTabLinks`。`RichTextEditorAutoLinkPlugin` 不渲染自己的任何元素，因此不接受 `BaseProps`。已否决：用 Astryx 的文档、节点与插件类型替代 Lexical 的，因为它们会重复 Lexical 的扩展模型，而对调用方没有收益。

### DEC-9 — Fenced code wraps

**Reference:** `spec:AST-061/DEC-9`
**Decider:** cixzhang, 2026-10-14

窄屏上的读者无需横向滚动就能看到一个完整的代码行，长行在阅读与编辑模式下占据相同高度，因此切换不会移动其下方的块（FR9）。换行是呈现：代码的文本、其行号，以及复制所返回的内容都不改变。已否决：两个表面都横向滚动，因为在横向滚动的区域内编辑会隐藏光标的上下文。

## Open questions

- 无。
