---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-064
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
affects_consumer_docs: [RichTextEditor, RichTextView, Markdown]
---

# Markdown plugins in RichText system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

用插件扩展 Markdown 的产品只需编写一次插件。相同的行内语法，以及文档顶层的相同块语法，都会成为同一个节点，并由同一个渲染器绘制，无论一个人是在 `Markdown` 中阅读文档、在 `RichTextView` 中查看它，还是在 `RichTextEditor` 中编辑它。每个界面只使用其调用方传给它的插件，而 RichText 无法精确兑现的插件会被拒绝，而不是被半途应用。界面未采用的语法保持作者书写时的样子。

## Non-goals

- 嵌套在列表项、引用或表格单元格内部的块扩展语法。它在 RichText 中保持为字面文本。
- 在扩展节点内部编辑、插件提供的编辑命令或工具栏，以及从编辑器界面插入新的扩展节点。
- 在编辑时运行插件的不可变文档变换，以及由插件派生的标题投影或大纲。需要这些能力的插件会被拒绝（FR4）。
- 把 RichText 自身的 Markdown 导入迁移到 core 的解析器上。core 的解析器只识别已采用的插件语法（FR5）；RichText 的转换器负责导入其余全部内容。
- 弃用或移除 `transformers` prop 与选项。
- 为扩展节点提供公共主题目标；每个插件的渲染器掌管其节点的视觉表现。
- 在 Server Components 中渲染 RichText 界面、对 `RichTextView` 的内容做服务端渲染（该内容仍在浏览器中填充），以及可序列化的扩展 props。
- 通过 RichText 的公共 API 暴露编辑器引擎自身的插件、节点或扩展类型；包发现；全局注册；流式输入。

## Requirements

- **FR1 — One definition.** 插件就是 core 的 `createMarkdownPlugin` 返回的那个条目。RichText 通过 `createRichTextExtension(plugin)`（FR3）采用同一个条目，该调用返回一个不透明的 `RichTextMarkdownExtension`。RichText 用 core 的解析器识别该插件的语法，并用 core 自身的扩展渲染绘制其节点（FR8）；不存在 RichText 专用的插件格式，也不存在插件解析或渲染的第二份副本。插件条目始终保持不透明：RichText 只读取 core 的插件协议所暴露的内容。
- **FR2 — Adopted per surface, never globally.** RichText 界面恰好使用其调用方传给它的那些扩展：`RichTextEditor` 与 `RichTextView` 上的 `markdownExtensions`，以及 `markdownToEditorStateJSON` 的 `extensions` 选项。导入时、全局范围或通过发现机制都不会发生注册。同一页面上扩展不同的界面互不影响。
- **FR3 — A server-safe entry point.** `createRichTextExtension`、`RichTextMarkdownExtension`、`RichTextExtensionError`、`markdownToEditorStateJSON`、`editorStateJSONToMarkdown` 及其选项类型都从 `@astryxdesign/richtext/markdown` 导出，该模块不导入任何 React、DOM 或仅客户端模块：它从 core 导入解析器与服务端安全的插件协议，绝不导入插件渲染器（FR8）。该包的主条目仍是客户端模块，并为客户端代码重新导出它们；服务端与 Node 代码则从 `@astryxdesign/richtext/markdown` 导入它们。扩展持有其插件的函数与渲染器，因此它不可序列化：客户端模块创建它们传给 `RichTextEditor` 与 `RichTextView` 的扩展，无头代码则用插件与服务端安全条目自行创建。
- **FR4 — Default-deny.** `createRichTextExtension` 用 `getMarkdownPluginCapabilities(plugin)` 读取插件的能力；该函数从 core 的服务端安全子路径 `@astryxdesign/core/Markdown/plugins` 导出，只报告插件是否声明了语法、是否声明了不可变变换，对其定义不再报告其他任何信息。RichText 采用语法；声明了变换的插件会被拒绝：在任何界面使用它之前，`createRichTextExtension` 就抛出 `RichTextExtensionError`，指明该插件与该能力。节点名没有渲染器的语法匹配绝不会成为节点——core 的解析器会拒绝它并报告语法失败——因此其源保持为文本。被拒绝或不存在的插件，其语法作为字面文本导入（`spec:AST-062` FR5）。
- **FR5 — Core recognizes plugin syntax first.** 在 RichText 自身的 Markdown 导入读取某个顶层块之前，core 的解析器在恰好给定已采用插件的情况下，先在其中找到它们的节点。每个节点的确切源都会对 RichText 的导入加以屏蔽，并成为一个扩展节点；RichText 的转换器像没有插件时那样导入其余全部内容。在 core 识别出插件语法的地方，该区间内以插件的节点为准。被识别的区间就是 core `Markdown` 在相同插件下识别出的区间——相同的起点、终点、显示形式、节点名与数据，且不包含代码内部、转义反斜杠之后或 core 对插件加以屏蔽的任何其他位置的内容——行内语法适用于任何导入行内内容之处，块语法适用于顶层。
- **FR6 — Extensions and transformers never own the same node.** `transformers` prop 与选项在已采用的扩展认领其区间之后（FR5）导入基础 Markdown。普通的语法重叠不算冲突：在 core 为某个插件识别出的区间内，以该插件的节点为准，因此插件源内部的链接、列表、强调或任何其他转换器语法都不会妨碍文档打开。若某个转换器导入或导出扩展的节点类型，或两个扩展采用同一个插件，那么该界面或序列化器在被配置时即被拒绝——它抛出 `RichTextExtensionError`，指明该插件、该转换器或第二个扩展，以及该能力。
- **FR7 — Extension nodes are atomic.** 在编辑器中，被识别的区间是一个不可键入的节点。插入符一步跨过它；它被选中、删除、剪切、复制、粘贴、移动、撤销与重做时都是整体进行。行内节点位于其所在文本行中；块节点是顶层块。辅助技术按文档顺序、带着其渲染器赋予它的语义遇到每个节点一次；该节点自身不增加制表位。
- **FR8 — Rendering matches core.** 节点通过 `MarkdownPluginNodeRenderer` 渲染，该导出位于 core 的仅客户端子路径 `@astryxdesign/core/Markdown/plugin-renderer`，它用给定插件渲染一个已解析的扩展节点，其 DOM、可访问性、主题目标、回退与失败报告与 `Markdown` 为同一节点所呈现的完全一致——在 core 的错误边界与 suspense 回退内部，由其插件为该节点名提供的渲染器——并且自身不添加任何元素或主题目标。`RichTextEditor` 与 `RichTextView` 导入它；服务端安全条目绝不导入。什么也不返回的渲染器什么也不渲染。若渲染器在调用时或在渲染过程中抛出异常，该节点就地显示其可读文本——其源，或某个没有源的节点由渲染器的 `toText` 给出——并在渲染器挂起期间显示同样的文本。缺少该节点插件的界面显示其源。失败绝不会破坏界面的其余部分。
- **FR9 — Diagnostics match core.** RichText 像 `Markdown` 一样，通过 core 的插件失败报告来报告插件的失败：每个插件与每个阶段一次，`plugin "<name>" failed in <phase>; rendered readable fallback.`。它不添加自己的诊断通道。
- **FR10 — The authored source is authoritative.** 扩展节点无论位于何处都恰好导出其源字节，因此含插件语法的文档保持 `spec:AST-062` FR1–FR5：未改动的文档逐字节往返；在节点周围编辑绝不会改写它；移动它就是移动它的字节。在没有该插件的情况下导入的文档，把该语法保留为字面文本，并原样导出它。
- **FR11 — Stored state is re-derived from source.** 存储的编辑器状态保留每个扩展节点的确切源、其插件的名称与协议版本（`apiVersion`），以及为渲染而派生出的数据。界面载入存储状态时，用已采用的插件从其源重新派生每个节点，绝不单独渲染存储的数据。若已采用的插件不再把某个节点的源识别为该节点——插件的语法或协议版本发生变化而没有迁移，或插件不存在——该节点就按其源载入，即原样导出的字面文本。
- **FR12 — Headless use is server-safe.** 从 `@astryxdesign/richtext/markdown` 导入的识别、导入、导出与 `createRichTextExtension` 可在 Node 与服务端代码中无 DOM 运行。RichText 的界面是客户端组件：它们不作为 Server Components 渲染，扩展也不是可序列化的 props（FR3）。`RichTextView` 保持其客户端边界——其内容在浏览器中填充——而采用扩展后，包含它的服务端渲染页面水合时不会出现不匹配。

### Platform support

- 受支持的功能/引擎下限：只要 RichText 能渲染的地方都适用；识别、导入与导出还可通过 `@astryxdesign/richtext/markdown` 在 Node 中无头运行。
- 不受支持的行为：除上述非目标之外没有其他。
- 浏览器证据：FR7 与 FR8 需要（编辑器中的键盘、选区、剪贴板、历史记录、渲染与辅助技术顺序），FR12 的水合也需要。

## Current-state impact

RichText 不采用 Markdown 插件：插件语法作为字面文本导入，并按撰写时的样子导出（`spec:AST-062` FR5），而 `RichTextEditor`、`RichTextView` 与 `markdownToEditorStateJSON` 都不接受 Markdown 插件。它们的 `nodes`、`plugins` 与 `transformers` props 与选项分别接受编辑器引擎节点、React 插件与编辑器引擎的 Markdown 转换器，并在 `markdownExtensions` 之外继续有效。该包只有一个入口点，是一个客户端模块，Markdown 序列化器只能通过它到达；`@astryxdesign/richtext/markdown` 增加了服务端安全的那个入口。core 的服务端安全子路径 `@astryxdesign/core/Markdown/plugins` 导出插件构造、第一方辅助工具（文本变换、语义围栏、源装饰、frontmatter、软换行、标题链接）以及协议类型（`component:Markdown` 列出了它们）；它们都不报告插件的能力，也不渲染单个节点，条目保持不透明。core 只在 `Markdown` 内部渲染扩展节点。`getMarkdownPluginCapabilities` 与仅客户端的子路径 `@astryxdesign/core/Markdown/plugin-renderer` 及其 `MarkdownPluginNodeRenderer` 都是新增的。

## Verification

| 契约 | 验证                                                                                                                      | 代表性状态                                                                                                                                                                                                                       | 变异或失败预期                                                                                                                                             |
| ---- | ------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 同一个插件条目既传给 `Markdown` 也传给 `createRichTextExtension`                                                          | 一个带行内与块贡献以及数据的插件                                                                                                                                                                                                 | RichText 专用定义，或第二套 tokenizer 或渲染器，即判为失败                                                                                                 |
| FR2  | 同一页面上的两个界面，一个有该扩展、一个没有；分别在有与无该扩展时导入                                                    | 编辑器与视图；带与不带 `extensions` 的 `markdownToEditorStateJSON`                                                                                                                                                               | 一个界面的扩展改变了另一个界面，或未经显式扩展就发生识别，即判为失败                                                                                       |
| FR3  | 各包的构建导出、类型与导入图，分别在 Node、服务端模块与客户端模块中加载                                                   | 无 DOM 下的 `@astryxdesign/richtext/markdown` 与 `@astryxdesign/core/Markdown/plugins`；作为客户端模块的 `@astryxdesign/core/Markdown/plugin-renderer`；重新导出服务端安全条目的 RichText 主条目；只导入服务端安全条目的生产构建 | 服务端安全条目导入 React 组件、DOM、客户端模块或插件渲染器；渲染器子路径缺少其客户端边界；缺少某个导出或类型；或仅服务端的构建中出现客户端代码，即判为失败 |
| FR4  | 在能力矩阵上运行 `getMarkdownPluginCapabilities` 与 `createRichTextExtension`                                             | 带渲染器的语法；一个变换；带语法的变换；节点名没有渲染器的匹配；文档中被拒绝插件的语法                                                                                                                                           | 接受变换；拒绝时未指明插件与能力；能力报告暴露了语法与变换之外的信息；没有渲染器的匹配成为节点；或语法被丢弃，即判为失败                                   |
| FR5  | 一个语料由 core 解析、并由 RichText 在相同插件下导入，逐节点比较                                                          | 行内与块匹配；一个延迟匹配与一个失败匹配；行内代码与围栏代码内部的语法；被转义的起始符；基础 Markdown 也会读取的插件语法（类似强调的分隔符）；列表、引用与表格单元格中的行内语法；嵌套块语法                                     | 区间、显示形式、节点名或数据与 core 不同；插件区间内部被基础 Markdown 读取；或嵌套块语法被识别，即判为失败                                                 |
| FR6  | 界面与序列化器的配置，以及在配置下打开的文档                                                                              | 导入或导出扩展节点类型的转换器；同一个插件的两个扩展；源中含链接、列表标记与强调的便签插件，在默认转换器下打开；一个无关的自定义转换器                                                                                           | 冲突配置不抛出异常；错误遗漏插件、转换器或扩展、或能力；或因基础语法位于插件源内部而导致文档打不开，即判为失败                                             |
| FR7  | 在真实浏览器中编辑行内节点与块节点                                                                                        | 跨节点的方向键、Shift 选择、Backspace 与 Delete、剪切、复制、粘贴到另一个带与不带该扩展的编辑器、撤销、重做、在节点旁输入                                                                                                        | 插入符进入节点内部；部分删除；节点被编辑拆分，即判为失败                                                                                                   |
| FR8  | 同一节点分别由 `Markdown`、由 `MarkdownPluginNodeRenderer` 以及在两个 RichText 界面中渲染，在 `Markdown` 的块包装之下比较 | 返回内容的渲染器；什么也不返回的渲染器；调用时抛出的渲染器；其组件抛出的渲染器；挂起的渲染器；没有源的节点；没有该扩展的界面                                                                                                     | 节点的 DOM、可访问性树、主题目标、回退或失败报告有任何差异；或渲染器添加了元素或主题目标，即判为失败                                                       |
| FR9  | 来自两个界面的失败报告                                                                                                    | 一次语法失败；一次重复的渲染失败                                                                                                                                                                                                 | 报告与 core 的消息或频次不同；或出现 RichText 专用诊断，即判为失败                                                                                         |
| FR10 | `spec:AST-062` 的一致性语料加上插件语法                                                                                   | 未改动的文档；节点旁的编辑；被移动的节点；没有该插件的导入                                                                                                                                                                       | 节点源的任何一个字节发生变化；或没有该插件时源丢失，即判为失败                                                                                             |
| FR11 | 在插件已变更的情况下载入存储状态                                                                                          | 同一个插件；协议版本变化；语法变化而不再匹配；存储数据被编辑成与源不一致；没有插件                                                                                                                                               | 渲染过时的存储数据；或源字节丢失或改变，即判为失败                                                                                                         |
| FR12 | 无头运行与水合                                                                                                            | 从子路径导入扩展并在 Node 中导入导出；无 DOM 时调用 `createRichTextExtension`；对含行内与块节点的 `RichTextView` 做服务端渲染后水合                                                                                              | 创建、导入或导出期间依赖浏览器；或水合不匹配，即判为失败                                                                                                   |

## Decision log

### DEC-1 — A plugin is written once, in core's protocol

**Reference:** `spec:AST-064/DEC-1`
**Decider:** cixzhang, 2026-10-06

core 的插件协议已经限定了语法、屏蔽了内建构造、校验了节点，并以回退方式渲染。RichText 原样采用这些条目，通过 core 的解析器识别语法，并用插件的渲染器绘制节点，因此一个插件不会在阅读时是一种含义、在编辑时又是另一种含义。已否决：RichText 插件格式，因为它会复制每个插件的解析与渲染，并使两者逐渐偏离。

### DEC-2 — Each surface adopts plugins explicitly

**Reference:** `spec:AST-064/DEC-2`
**Decider:** cixzhang, 2026-10-06

界面的扩展就是其调用方传给它的那些，正如 `Markdown` 的 `plugins` 那样。已否决：全局注册表，因为它会让一个产品的插件改变另一个界面的文档，并使行为取决于导入顺序。

### DEC-3 — Default-deny: adopt only what RichText honors exactly

**Reference:** `spec:AST-064/DEC-3`
**Decider:** cixzhang, 2026-10-06

一个静默跳过插件某部分（比如其变换）的编辑器，会为同一份源显示出与 `Markdown` 不同的文档。RichText 只在它能兑现每一项能力时才采用插件，否则就醒目地拒绝它，让其语法保持为文本。已否决：带警告的部分采用。

### DEC-4 — Core recognizes plugin syntax; RichText imports the rest

**Reference:** `spec:AST-064/DEC-4`
**Decider:** cixzhang, 2026-10-06

插件语法的含义就是 core 的解析器所说的含义，因此 core 先找到它，其区间对 RichText 的导入是封闭的；基础 Markdown 仍归 RichText 的转换器处理。插件源内部的基础语法属于该插件，只有拥有某个扩展节点类型的转换器才与之冲突，而这一冲突在配置界面时就被拒绝，绝不在文档打开时被拒绝。已否决：在本记录中把 RichText 的全部导入迁移到 core 的解析器上；在扩展与转换器之间采用后写者胜；以及因插件源中出现基础语法而判定文档失败。

### DEC-5 — Extension nodes are atomic, and their source is the truth

**Reference:** `spec:AST-064/DEC-5`
**Decider:** cixzhang, 2026-10-06

core 的协议把语法读入节点并渲染它们；它无法把改动过的节点写回 Markdown。原子节点保留其撰写的源、恰好导出它，并在每次载入时从它重新派生，因此存储的数据绝不会与文档偏离。存储状态只通过插件条目所暴露的内容来指明该插件，即其名称与协议版本：由重新派生而非存储的身份决定一个节点是什么。已否决：可编辑的扩展内容（那将需要为每个插件配一个序列化器），以及跨插件版本信任存储的数据。

### DEC-6 — Core exposes only the facts RichText needs

**Reference:** `spec:AST-064/DEC-6`
**Decider:** cixzhang, 2026-10-06

插件条目不透明，以便每个使用方都经过 core 的校验、屏蔽与回退。RichText 需要 core 提供两件事：知道某个插件是否声明了变换，以及以 `Markdown` 的方式渲染单个节点。core 恰好暴露这两者：服务端安全插件子路径中的只读能力报告，以及仅客户端子路径中的一个单节点渲染器，该渲染器完全按 `Markdown` 的方式呈现节点，自身不带任何元素；在 core 内部共享同一条渲染路径，使两者不会偏离。已否决：把渲染器放进服务端安全插件子路径，那会把客户端代码拉进服务端导入；暴露插件定义，那会招致解析与渲染的复制；以及把每个节点当作整份 `Markdown` 文档来渲染，那会在编辑器内部添加一个文档元素和 `Markdown` 的主题目标。

## Open questions

- 无。
