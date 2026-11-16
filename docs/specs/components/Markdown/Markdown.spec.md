---
schema_version: 3
template_version: 3
kind: component
id: component:Markdown
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-03
owners: [cixzhang]
review_triggers: [api, theming, behavior, layout, accessibility]
verified_by:
  [
    packages/core/src/Markdown/Markdown.test.tsx,
    packages/core/src/Markdown/Markdown.renderBoundary.test.tsx,
    packages/core/src/Markdown/Markdown.rerender.test.tsx,
    packages/core/src/Markdown/Markdown.public.test.ts,
    packages/core/src/Markdown/MarkdownTable.a11y.chromium.spec.ts,
    packages/core/src/Markdown/parser.test.ts,
    packages/core/src/Markdown/urlSchemes.test.ts,
    packages/core/src/Markdown/incremental.test.ts,
    packages/core/src/Markdown/remark.test.tsx,
    packages/core/src/Markdown/plugins/softBreaks.test.tsx,
    packages/core/src/Outline/parseOutlineFromMarkdown.test.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules:
  [
    module:Markdown/headingLinks,
    module:Markdown/remark,
    module:Markdown/softBreaks,
    module:Markdown/sourceLines,
  ]
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs:
  [
    spec:AST-002/DEC-1,
    spec:AST-002/DEC-5,
    spec:AST-005/DEC-1,
    spec:AST-005/DEC-2,
    spec:AST-005/DEC-3,
    spec:AST-025/DEC-1,
    spec:AST-025/DEC-4,
    spec:AST-036/DEC-1,
    spec:AST-036/DEC-2,
    spec:AST-036/DEC-3,
    spec:AST-036/DEC-4,
    spec:AST-061/DEC-5,
    spec:AST-061/DEC-6,
    spec:AST-061/DEC-9,
    spec:AST-061/FR6,
    spec:AST-064/DEC-6,
    spec:AST-036/DEC-12,
  ]
---

# Markdown component contract

## Intent

Markdown 在 Document 中渲染解析后的内容，具备稳定的默认块部件与受约束的渲染器接缝。调用方可以选择启用规范插件协议，以获得受限的源语法、不可变的文档转换、类型化的扩展渲染，以及原生的类型化文档起始 frontmatter。他们也可以单独选择启用美元符号分隔的数学公式，只需为行内与显示两种表达式提供同一个类型化渲染器。解析器接受与之匹配的显式选项。他们还可以在 `codeLanguages` 中列出 CodeBlock 语言值，让这些语言的围栏代码块用这些值着色（FR30）。缺失时，插件、数学公式与 `codeLanguages` 不改变任何行为；默认 Code block 路径把 `diff` 与 `diff-<language>` 围栏渲染为 CodeBlock 的 diff 层（FR29），对每个围栏的长行进行换行（`spec:AST-061` FR5、DEC-9），按 CodeBlock 的方式布置没有表头的围栏（`component:CodeBlock` FR11），并让每个散文块按其自身文字的方向布局（`spec:AST-061` FR6）；其余所有解析、渲染、样式与流式行为都保持已发布版本的行为。

## Compatibility and migration

- 已发布默认行为保留：`yes`，但 `diff` 围栏的默认 Code block 路径（见下文 FR29）、其长行换行（见下文）、其无表头布局（见下文）、按块的文字方向（见下文），以及 `data:` 链接与图片 URL（见下文）除外
- 兼容性类别：增量式、可选加入的公共 API，带有五处可见的默认路径渲染变更（下文的 FR29 diff 层、围栏代码块换行、无表头布局、按块文字方向，以及 `data:` URL）；除下文所述（`data:` URL 与规范化目标地址）之外，现有解析器节点、DOM（除下文的方向标记外）、样式、目标、美元符号分隔文本、`components` 与 `inlinePlugins` 均保持不变，除非调用方提供 `plugins`、提供 `components.math`、提供 `codeLanguages`，或传入匹配的显式解析器选项。
- 受控/非受控行为：不适用
- 迁移决策：无
- 增量式可选 prop（FR30）：`codeLanguages` 让较少见语言的围栏代码块用 `component:CodeBlock` 语言模块着色；不提供它时行为不变。
- `data:` URL 的默认路径变更（`spec:AST-005/DEC-3`），是安全修复而非破坏性变更：解析器丢弃每个 `data:` 链接与图片 URL，因此 `<Markdown>` 把它们各自渲染为源文本，公共解析器函数也不再在 `link.href` 或 `image.src` 中返回 `data:` URL。去除控制字符与首尾空白后变为空的目标地址就是空目标地址，仍渲染为文本，或渲染为图片的替代文本回退。
- 规范化目标地址（`spec:AST-005/DEC-3`）：解析器在保存每个链接与图片目标地址时移除控制字符与首尾空白，无论它们来自 Markdown 源、插件转换还是 Remark 插件，因此 `[a](< b(c) d >)` 得到 `b(c) d`。不含这类字符的目标地址保持不变。
- `diff` 围栏的默认路径渲染变更（FR29），是可见的默认变更而非破坏性变更：原本渲染为纯文本的 `diff` 围栏，现在渲染为纯文本之上的 CodeBlock diff 层，并带 `diff` 标签；而 `diff-<language>` 围栏——原本渲染为带 `diff` 标签与视口名称的纯文本，其首个单词就是 Markdown 读到的全部内容——现在渲染为该语言之上的 diff 层，并带 `<language> diff` 标签；表头、复制、展开与视口名称与其他任何围栏保持一致，所提供 `code` 渲染器的契约不变。回到纯文本的方式是使用 `text` 围栏或自定义 `code` 渲染器。除下文所述的换行与无表头布局外，其他每个围栏都不变。
- 默认路径换行变更（`spec:AST-061` FR5、DEC-9），是视觉变更而非破坏性变更：默认 Code block 对长行进行换行，而不是让它们横向滚动，因此行不再溢出的围栏也不再占用条件性滚动区域的 Tab 停靠点。文本、行号、语法着色、复制输出，以及所提供 `code` 渲染器的契约均不变。回到横向滚动的方式是自定义 `code` 渲染器。
- 默认路径方向变更（`spec:AST-061` FR6），是视觉变更而非破坏性变更：散文块——段落、标题、引用或列表项——按其自身文字的方向布局，而不是按 Internationalization 提供者的方向，因此在从左到右的文档中，一个希伯来语段落从右边缘开始。文字不含强方向性字符的块或表格单元格，在任何嵌套深度都采用提供者的方向。列表、表格或围栏按其父级的方向排列其内容：顶层用提供者的方向，嵌套时用其所在项的方向。每个表格单元格中的文字按自身方向阅读。文字具有方向性的每个散文块与表格单元格都以 `dir` 属性承载该方向；而没有方向的块或单元格，在其外围块按另一方向阅读时，以 `dir` 承载提供者的方向；该标记是唯一的 DOM 变更。解析、样式目标，以及所提供渲染器的契约均不变。围栏代码行保持框架的方向；FR6 的逐行规则是本记录尚未填补的缺口。
- 默认路径无表头布局（`component:CodeBlock` FR11），是视觉变更而非破坏性变更：没有语言标签的围栏把 Copy 显示在代码旁边的独立列中，因此长行在它之前换行。标明了 `plaintext` 以外语言的围栏在任何行数下都保留其表头。文本、复制输出、语法着色、视口名称，以及所提供 `code` 渲染器的契约均不变。
- 默认路径布局变更（FR26–FR28）：默认表格的列可能变得比已发布的固定分档更宽，绝不会更窄；表头标签换行而不是截断；原本把列压扁的表格现在可以滚动。公共 API、选项与主题目标均不变，Table 面向数据驱动调用方的已发布换行模式也不变。此路径上的 DOM 确实发生变化：Markdown 的 `markdown-table` 块放弃它重复提供的水平溢出、`role`、可访问名称和 Tab 停靠点，使嵌套 Table 的 Scroll 区域成为唯一的滚动视口、可访问名称与条件性键盘停靠点。因此，表格此前暴露两个命名区域和两个条件性 Tab 停靠点，现在只暴露一个，而该块保留其目标及其间距、尺寸与对齐所有权。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 块级与行内显示中的 Document 及其当前 `markdown` 目标。
- 默认 Heading、Paragraph、List、Code block、Blockquote、Table、Divider 与 Image 块的表现形式，以及下文记录的八个当前块目标。
- 在默认渲染路径上把块间距与反射的密度（以及 Heading 层级）应用到这些目标。
- 可选启用的 `$…$` 行内数学与 `$$…$$` 显示数学识别，包括分隔符边界、转义行为、解析器节点与流式一致性。
- 把每个已识别的表达式作为惰性文本，连同 `inline` 或 `block` 的 display 值，传给调用方唯一的数学渲染器。
- 按固定的“语法 → 不可变转换 → 渲染”顺序应用规范 `plugins` 协议，同时保留内置词法屏蔽、Core 拥有的语义，以及本地可读回退。
- 在后续转换或渲染观察到替换文档根之前，对这些根进行校验与冻结。
- 与由 Markdown 派生的 Outline 工具共享启用插件后的解析配置、转换后的标题投影，以及防冲突的标题 ID。
- 把可选的文档起始 frontmatter 块解码为调用方定义的类型化元数据，在流式处理期间暂不输出未完成的 frontmatter，并把已完成的 frontmatter 语法从渲染内容中排除。

**不拥有 / 非目标**

- 由自定义渲染器提供的输出；每个自定义组件拥有其替代内容的结构、样式与可访问性语义。
- 把行内强调、链接、行内代码、引用、插件或数学渲染器的输出当作额外的默认块解剖结构。
- CodeBlock、Blockquote、List、CheckboxList 或 Table 拥有的嵌套解剖结构或目标。
- 执行或净化渲染器的数学或插件输出、原始 HTML 解析、可变或不受限制的 AST 插件、包发现，或新增的列表/表格/行内样式覆盖槽位。

## Public concepts

`plugins` 是一个可选的有序不透明条目列表，由 `createMarkdownPlugin()` 创建。插件只声明它使用的 `syntax`、`transform` 与 `renderers` 能力。带语法的条目提供稳定的解析身份。解析、转换、渲染与 Outline 使用同一棵稳定、严格类型化、与 MDAST 对齐的规范树；`parseMarkdownAst()` 与 `parseInlineAst()` 从服务器安全的 `@astryxdesign/core/Markdown/parser` 子路径暴露该树，而 `@astryxdesign/core/Markdown/plugins` 在服务器或 RSC 代码中构建与运行插件时保持服务器安全。渲染出的 `Markdown` 组件仍是客户端入口：带函数的插件条目不是可序列化的 prop，无法跨越 RSC 边界。`MarkdownAstNodeMap` 与 `visitMarkdownNodes` 提供节点种类收窄。已发布的解析器函数通过兼容性投影保留其既有结果形状。转换返回经过校验的替换根，而不进入解析身份。由语法或转换引入的每个扩展节点都拥有完整的渲染器所有权与确定性的文本投影。文本匹配、语义围栏、源装饰与原生 frontmatter 是编译为转换的辅助手段，而不是独立的协议阶段。Frontmatter 是文档元数据：它没有渲染器，使用有界的第一方键/值语法而不是 Remark 兼容，并通过创建它的辅助函数暴露类型化元数据。`spec:AST-036` 拥有共享协议与受限的 Remark 兼容配置，`module:Markdown/remark` 拥有该配置的适配器，`module:Markdown/headingLinks` 拥有其可选启用的身份投影与永久链接组合，而本组件拥有聚合应用与回退。

`decodeMarkdownCharacterReferences(text)` 是 `Markdown` 渲染时使用的字符引用解码器，从服务器安全的 `@astryxdesign/core/Markdown/parser` 子路径以及 `@astryxdesign/core/Markdown` 导出，使 RichText 各界面与 `Markdown` 完全一致地解码引用。它解码纯文本中合法的具名引用与数字引用，其余内容保持写出的原样；具名引用表保持私有。`spec:AST-061/DEC-5` 拥有其契约。

`module:Markdown/sourceLines` 拥有渲染块上可选启用的源行标记，以及在它的插件安装期间 `components` 块渲染器所接收的可选 `sourceLines` prop；没有它时，任何渲染器都收不到该 prop。

`getMarkdownPluginCapabilities(plugin)` 从服务器安全的 `@astryxdesign/core/Markdown/plugins` 子路径导出，只报告某个条目是否声明语法、是否声明转换；该条目保持不透明。`MarkdownPluginNodeRenderer` 从仅客户端的 `@astryxdesign/core/Markdown/plugin-renderer` 子路径导出，用给定的插件渲染一个已解析的扩展节点，其 DOM、可访问性、主题目标、回退与失败上报，与 `Markdown` 对同一节点的呈现完全一致——即其插件的渲染器位于 Markdown 的错误边界与 suspense 回退内——并且不添加自己的元素或主题目标。`spec:AST-064/DEC-6` 拥有二者，因此 RichText 各界面无需读取插件定义或复制其渲染即可采用插件。

### Acceptance and implementation state

下文的插件条款是 AST-036 推行的已接受目标契约，并不表示这些 API 已经发布。在每个条款的实现与验证落地之前，当前已发布的无插件、解析器、`components` 与 `inlinePlugins` 行为仍是唯一可用的契约。每个实现 PR 都必须指明它完成了哪些条款，同时不得削弱零破坏基线。

`MarkdownComponents.math` 是一个可选渲染器，签名为 `({value: string, display: 'inline' | 'block'}) => ReactNode`。提供它即让组件选择启用数学解析，因为调用方同时拥有两件事的决定权：美元符号语法是否表示数学公式，以及公式如何渲染。直接调用解析器的调用方用 `MathParseOptions`（`{math: true}`）做出同样的选择；增量调用方把该选项与 `createIncrementalState<true>()` 配对使用，后者返回导出的 `IncrementalParseState<true>`。默认调用与标注为 `ParseOptions` 的值保留已发布的 `InlineNode` 与 `BlockNode` 联合。启用的调用返回显式的 `InlineNodeWithMath` 与 `BlockNodeWithMath` 超集，其新增叶子为 `MathInlineNode` 与 `MathBlockNode`。确切的语法与示例仍见 `Markdown.doc.mjs`。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 块级与行内显示都渲染一个 Document 根，承载当前 `markdown` 目标。行内显示不渲染任何块解剖结构。                                                                                                                                                                                                                                                                                                                                                                                                      |
| FR2  | 在默认块渲染路径上，Heading、Paragraph、List、Code block、Blockquote、Table、Divider 与 Image 承载下文记录的八个当前局部块目标。                                                                                                                                                                                                                                                                                                                                                                    |
| FR3  | 所提供的 `heading`、`paragraph`、`code`、`blockquote`、`hr` 或安全 URL 的 `image` 渲染器会替换对应的默认部件，因此 Markdown 不会把该部件的局部目标强加于替代内容。                                                                                                                                                                                                                                                                                                                                  |
| FR4  | 已发布的 Code block 目标仍为 `markdown-codeblock`；这一兼容性异常既不改名，也不加别名。                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR5  | 密度与 Heading 层级仍是其所属目标上的反射能力。显示模式、流式状态与渲染器选择不会成为独立的解剖条目。                                                                                                                                                                                                                                                                                                                                                                                               |
| FR6  | 没有 `components.math` 时，Markdown 不识别数学语法。默认、legacy-set、`math: false` 以及标注为 `ParseOptions` 的解析器调用保留已发布的 `InlineNode` / `BlockNode` 结果联合；只有 `MathParseOptions` 返回显式的启用数学的联合。                                                                                                                                                                                                                                                                      |
| FR7  | 启用数学后，`$…$` 产生行内 `math` 节点，`$$…$$` 产生块级 `math` 节点。渲染器接收去掉分隔符的源作为 `value`，并接收其位置作为 `display`。                                                                                                                                                                                                                                                                                                                                                            |
| FR8  | 行内数学保持在一行，两个分隔符的任一侧都不能有空白，且不能紧跟在数字之后开启，也不能紧挨数字之前结束。`$$` 保留给显示数学。这些边界使成对的货币金额保持字面。                                                                                                                                                                                                                                                                                                                                       |
| FR9  | 反斜杠转义的美元符号在数学之外是字面量，在数学内部不会关闭数学。未匹配的行内或显示分隔符在非流式输出中保持字面。                                                                                                                                                                                                                                                                                                                                                                                    |
| FR10 | 代码段与围栏代码块对数学解析不透明。链接目标地址不透明；链接标签可以包含行内数学。行内插件只作用于散文文本，从不在数学内部运行。                                                                                                                                                                                                                                                                                                                                                                    |
| FR11 | 在每个分块边界，流式都收敛到与完整解析相同的节点，包括嵌套在普通列表、任务列表、引用块及其受支持组合中的显示数学，无论使用 LF 还是 CRLF，也无论有无源范围。不完整的数学只在其确切的所属容器仍处于打开状态时被暂缓；列表/引用退出或引用深度变化会恢复字面解析。启用数学的增量调用要求 `IncrementalParseState<true>`，因此缓存与返回的联合共享同一契约。                                                                                                                                              |
| FR12 | 省略 `plugins` 与传入空列表是同一个语义空管道，具有相同的解析器联合、AST、DOM、样式、目标、ID 与流式行为。Core 可以跳过空的准备与分配，而不创建单独的行为模型。`components`、`inlinePlugins`、引用、自动链接、源与数学保留其已发布含义。                                                                                                                                                                                                                                                            |
| FR13 | 启用插件的解析遵循内置词法屏蔽与有序语法声明，然后使用一棵稳定、严格类型化、与 MDAST 对齐的规范树进行转换、渲染与 Outline。`MarkdownAstNodeMap` 与 `visitMarkdownNodes` 按节点种类收窄回调。已发布的解析器函数通过兼容性投影保留其既有结果形状。每个返回的根在后续插件或渲染观察到它之前，都是有限、无环、可表示、经过校验且被冻结的。                                                                                                                                                              |
| FR14 | 插件失败保留最后有效文档与可读的作者源。Core 保留标题、导航、图片、列表、表格与文档语义，并且不暴露原始标记解析通道、注册表、包发现、可变共享 AST 或不受限制的 DOM 钩子。类似 URL 的插件数据保持不受信任；Astryx 拥有的汇点遵循 `family:navigation-destinations`。                                                                                                                                                                                                                                  |
| FR15 | 增量解析身份包含每个影响解析的 Markdown 选项，并且只包含有序的带语法插件名称、协议版本与 `parseKey`。转换或渲染器变更复用已稳定的解析输出，重新运行转换，并且不重新挂载未受影响的扩展输出。                                                                                                                                                                                                                                                                                                         |
| FR16 | 启用插件的 Markdown 与由 Markdown 派生的 Outline 使用相同的解析选项、有序转换、扩展文本投影与已安装的标题投影，因此每个 Outline 目标都与渲染身份一致。第一方模块只能在其自身当前模块契约下组合不同的标题投影；Markdown 只拥有这一共享调用接缝。受限的 Remark 适配器只能运行同步转换插件，且其输入与输出都必须通过所记录的支持 MDAST 子集往返。                                                                                                                                                      |
| FR17 | 扩展节点把 `content` 声明为 `'none'`、`'phrasing'`、`'flow'`，或声明为显式的 `{allow, min?, max?}` 允许列表，以收窄其 `display` 所暗示的类别。Markdown 在同一语法与屏蔽之下解析每个容器的内部源范围，在每个转换边界校验子节点，通过同样的内置渲染器与 `components` 接缝渲染子节点，把嵌套计入内置深度上限，使用 FR16 投影，并在容器渲染器失败时原位渲染子节点。                                                                                                                                     |
| FR18 | 转换可以读取并移除另一个插件的扩展节点（包括包含它们的子树），也可以插入或移除标题；它不得创建、编辑、内部重排或复制另一个插件的节点，不得改变源标题的深度，也不得伪造或复制标题身份。`dependsOn` 在准备阶段被校验；未满足或顺序错误的依赖只跳过该插件的转换。每次拒绝都指明规则与所属插件。                                                                                                                                                                                                        |
| FR19 | `onPluginDiagnostic` 在组件与解析器选项上都可用，它对每次失败、提示或静默降级接收一个不含源的事件——插件、阶段、稳定代码、严重程度——在开发与生产环境中都如此，并带抑制代码做速率限制。准入、重名与协议版本失败在组件与每个解析器入口处表现一致：调用以最后有效配置成功，绝不向调用方抛出异常。                                                                                                                                                                                                       |
| FR20 | `parseMarkdownAst()` 与 `parseInlineAst()` 返回规范树，并接受与组件相同的选项与插件列表；`@astryxdesign/core/Markdown/parser` 暴露解析、规范 AST 类型与插件准入，没有客户端边界。`createMarkdownPlugin()` 推断扩展节点联合，因此没有任何调用点需要显式类型参数，而产生不出可用扩展类型的声明是类型错误，而不是静默的 `never`。                                                                                                                                                                      |
| FR21 | 每个流式更新都会再次运行转换，转换必须幂等且收敛；效果需要完整输入的转换使用最终输入信号。语义相等的插件列表复用已准备的工作，无论数组引用是否稳定，并且开发环境在重建的列表妨碍复用时报告一条诊断。                                                                                                                                                                                                                                                                                                |
| FR22 | 扩展渲染器可以选择启用 Markdown 拥有的扩展主题目标，使主题能够触达插件输出。选择退出则输出不被打上主题目标。除 Core 已应用的块间距与内容宽度外，该目标不添加任何默认样式或解剖结构。                                                                                                                                                                                                                                                                                                                |
| FR23 | Markdown 拥有一个显式支持的方言，而不是声称完全符合 CommonMark 或 GFM。相邻的兼容有序或无序项无论是否有任务标记都保持为一个列表；每一项都独立保留其勾选状态或普通列表项语义，包括在嵌套层级。默认语法保留已发布的任务列表与表格支持，而 `autolink: 'gfm'` 只添加所记录的自动链接行为，不切换任何其他语法。                                                                                                                                                                                          |
| FR24 | `createMarkdownFrontmatter()` 只识别由唯一 `key: value` 行组成的前导 `---` 块，通过调用方的类型化解析器解码它，把有限的类 JSON 元数据保存在规范文档上，并从渲染内容中移除该语法。未完成的前导块在流式处理时不产生可见 Markdown；畸形或未完成的最终输入保持为普通 Markdown。Frontmatter 没有渲染器，也不需要 Remark 兼容。                                                                                                                                                                           |
| FR25 | 规范解析器与插件构建子路径保持服务器安全，并且可以完全在服务器或 RSC 代码中运行带函数的插件。客户端拥有的 `Markdown` 组件支持传统 SSR 与流式 SSR，但包含函数的插件条目无法从 Server Component 序列化进该客户端边界；直接进行 RSC 渲染需要未来的增量式服务器渲染器，而不是削弱插件协议。                                                                                                                                                                                                             |
| FR26 | 在默认表格路径上，每列都有一个由内容推导的宽度下限：取该列自身最长不可断词元与由该列内容推导的可读最小值中的较大者，并施加上界，使短列组成的表格仍能放进容器。该下限作用于单元格的文本，而不是其带内边距的盒子，因此在任何密度下它都代表相同的内容量。表头标签对可读最小值的比较也有自己的贡献。下限超出容器的表格会增长并滚动，而不是均分容器。                                                                                                                                                    |
| FR27 | 默认表头单元格从不截断：没有省略号，也没有宽度钳制。表头完整阅读，在有界宽度内保持一行，超出后换行。默认表格单元格内的行内代码保持词元完整，而不是在词元中间断开；所提供的 `inlineCode` 渲染器拥有自己的换行方式。                                                                                                                                                                                                                                                                                  |
| FR28 | Markdown 的 Table 块拥有间距、尺寸与对齐。嵌套 Table 自身的 Scroll 区域仍是表格水平溢出、其可访问名称与条件性键盘可聚焦性的唯一拥有者；Markdown 不添加自己的第二个滚动容器、名称或 Tab 停靠点。                                                                                                                                                                                                                                                                                                     |
| FR29 | 在默认 Code block 路径上，围栏完整的第一词选择 CodeBlock 的 diff 层（`component:CodeBlock` FR9）：`diff` 在纯文本之上渲染该层，`diff-<language>` 在 `<language>` 之上渲染该层（该语言由与其他任何围栏相同的首词规则读取）；其他每个围栏都不采用 diff 层。所提供 `code` 渲染器的契约不变：它仍然接收首词字符作为 `language`——对 `diff` 与 `diff-<language>` 围栏都是 `diff`——且不新增任何内容。                                                                                                      |
| FR30 | `codeLanguages` 列出 `component:CodeBlock` 语言值（FR13）：Astryx 模块或自定义语言。在默认 Code block 路径上，若围栏的语言词——与其他任何围栏相同的首词读取（FR29）——是所列模块的标识符之一，则用该值作为其 `language` 渲染，并优先于具有相同标识符的内置语言；`diff-<identifier>` 围栏在该值之上采用 diff 层；其他每个围栏照旧解析。当两个条目列出相同标识符时，后一个条目获胜。没有 `codeLanguages` 时，围栏按今天的方式渲染。所提供 `code` 渲染器的契约不变：它仍然接收语言词，且不新增任何内容。 |

FR23 包含引用块内部以及有序、无序或任务列表项内部与 CommonMark 兼容的惰性段落延续。省略重复的引用标记或项缩进不会关闭最深的打开段落；空行或阻断性的块起始才会。所属顶层块的源范围包含这些惰性行。

FR23 还包含行内代码段内部的表格级转义：`\|` 把竖线保留在其作者书写的单元格内，对代码值与渲染文本只贡献 `|`，并且在完整解析与增量解析中产生相同的结果。已完成的行内代码段把其定界反引号从解析值中排除，只把该值渲染在 `<code>` 内；未匹配的反引号保持为字面文本。在表格单元格外，行内代码保留其作者书写的反斜杠。

### Allowed variation

- **AV1 — 解析后的内容。** 块部件的数量与顺序可以随 Markdown 源变化，而不改变其所有权。
- **AV2 — 列表。** 有序、无序与任务列表共享 List 解剖结构与当前 `markdown-list` 目标。每一级的标记样式由其深度固定，正如 `spec:AST-061/DEC-6` 所定义，不属于可变范围。
- **AV3 — 自定义渲染器。** 受支持的自定义块渲染器可以替换其默认部件并拥有其样式，而不接收 Markdown 块目标。
- **AV4 — 嵌套原语。** 默认块内使用的 Astryx 原语可以改变内部元素形状，同时保留其自身的公共契约与 Markdown 的外层块目标。
- **AV5 — 数学渲染器。** 调用方可以使用任何接受原始表达式与 display 值的渲染器。其 DOM、样式、排版引擎、错误 UI 与可访问性表示都不属于 Markdown 的所有权。
- **AV6 — 已安装插件。** 宿主可以提供任意有序的兼容不透明插件条目集合。语法、不可变转换行为、渲染器拥有的输出与辅助实现可以变化，而校验、可读回退、Core 语义与标题身份保持不变。

### Representative states

| 状态             | 必需不变式                                                                                                       | 允许的变化                                                         |
| ---------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| 默认块内容       | 每个已解析块使用其对应的当前 Markdown 目标。                                                                     | 块数量、顺序、密度、内容宽度与对齐。                               |
| 自定义块渲染器   | 被替换的 Heading、Paragraph、Code block、Blockquote、Divider 或 Image 不带有对应的 Markdown 目标。               | 替代内容的结构与样式。                                             |
| 有序/无序列表    | List 承载 `markdown-list`；每一级的标记样式遵循其深度（`spec:AST-061/DEC-6`）。                                  | 起始值、项数量与嵌套内容。                                         |
| 任务列表         | 每个带任务标记的项承载其自身的勾选状态；任务项与普通项混合时仍留在同一个兼容列表内，并保留文档顺序与嵌套。       | 勾选值、项内容与相邻的普通项。                                     |
| 安全块图片       | 默认 Image 承载 `markdown-image`，或由自定义图片渲染器替换它。                                                   | 源与替代文本。                                                     |
| 空块图片 URL     | Markdown 用 `markdown-image` 渲染其回退 Image 部件。不安全的 URL 永远不会到达渲染器：解析器会丢弃它。            | 回退所显示的替代文本。                                             |
| 行内显示         | Document 承载 `markdown`；不渲染任何块目标。                                                                     | 行内文本、链接、代码、引用、插件，以及可选启用的行内数学。         |
| 数学渲染器缺失   | 美元符号分隔的源遵循已发布的 Markdown 语法，不存在 `math` 节点或渲染器输出。                                     | 货币、未匹配的分隔符与普通散文。                                   |
| 数学渲染器存在   | 完整的受支持分隔符对 Markdown 格式化不透明，并作为惰性文本传给渲染器。                                           | 行内或块级显示，以及任何渲染器拥有的输出。                         |
| 流式数学         | 不完整的数学被暂缓；一旦完整，流式节点在顶层与列表/引用容器内部都等于完整解析的节点。                            | 分隔符与表达式文本可能分块到达；源范围仍是可选的。                 |
| 插件省略         | 已发布的解析器联合、AST、DOM、目标、标题 ID 与性能保持不变。                                                     | 省略或空列表；两者都是同一个空转换管道。                           |
| 插件启用         | 固定的“语法 → 不可变转换 → 渲染”顺序、经过校验的根、可读回退，以及与 Markdown/Outline 一致的标题身份都保持不变。 | 语法、转换、渲染器、辅助执行计划、插件顺序，以及解析后的实时状态。 |
| 原生 frontmatter | 完整的前导块不出现在渲染内容中，并产生类型化元数据；未完成的流式输入被暂缓。                                     | 元数据 schema 与值是调用方定义的有限数据。                         |

### Transformation and precedence order

- 围栏代码与行内代码在数学之前占据其内容。
- 完整的显示数学在标题、表格、列表与段落之前占据一个块。完整的行内数学在引用、链接、强调、自动链接与行内插件之前占据其源。
- 自定义渲染器只接收去掉分隔符的表达式字符串及其 display 值。Markdown 绝不把它变成 HTML，也不执行它。
- 现有的 URL 净化对链接与图片仍然有效；数学不新增导航或原始 HTML 汇点。
- 内置语法与受保护上下文优先占据；扩展语法只占据符合条件的源；随后有序转换接收深度只读的文档根；Core 在渲染前校验每个返回的根。
- 配置好的原生 frontmatter 辅助函数只占据文档起始分隔符。它在流式处理期间暂缓未完成的块，在后续转换渲染文档之前移除已完成的块，并让类型化元数据可供这些后续转换与该辅助函数的调用方使用。
- 语义围栏提案在 `components.code` 之前渲染。`components.code` 渲染没有任何提案占据的每个围栏；而某个已被占据的围栏，其插件渲染器缺失、返回空、抛出异常或挂起时，在提供 `components.code` 的情况下回退到它，否则回退到默认 Code block（`spec:AST-036` FR17）。
- 文本匹配、语义围栏与源装饰使用转换辅助函数。Core 可以把这些辅助函数编译为带索引的内部计划，而不暴露额外的公共阶段。

### Performance and resources

- 除非请求，否则不执行数学扫描。
- GFM 自动链接扫描的耗时与输入长度成线性关系：邮箱与 URL 的字面量扫描都是锚定的，因此一段很长的纯文本所花的代价大约与一次普通解析相当。
- 行内匹配是对单行的有界前向扫描。显示数学匹配只从候选的 `$$` 起始标记扫描到它的结束标记。
- 增量解析器缓存已完成的块，把未闭合的显示数学视同未闭合的代码围栏，并精确跟踪列表与引用容器的深度，使缩进的结束标记不会变成新的起始标记，深度切换也不会吞掉字面内容。工厂创建的状态携带与解析器调用相同的、旧版或启用数学后的节点契约。
- 稳定且语义相等的插件列表会复用已准备好的语法与转换计划。只有语法进入解析身份；转换与渲染器的变化复用已解析的输出。零工作量与代表性转换都保持在 `spec:AST-036` FR21–FR23 的预算之内，包括插件编写的路径与流式路径。
- Remark 兼容适配器、一致性测试套件与可选渲染器都留在 Core 包之外，除非被显式导入。

## Accessibility contract

默认的文档语义、标题 ID、段落 role、列表语义、可滚动的 Table 包装层以及图片替代文本保持不变。Math 没有 Astryx 自有的默认输出：调用方的渲染器负责给出与其排版引擎相称的无障碍表示（例如 MathML，或带标签的 `role="math"` 元素）。Markdown 不会在渲染器输出周围添加包装层、ARIA 属性或 HTML 注入。插件渲染器同样负责其完整且有文档记载的语义模式，而 Core 保留自己的文档、标题、导航、图片、列表与表格语义。转换不能抹除必需的无障碍含义，也不能让含义仅靠颜色表达。

## Design relationships

| 结构或状态 | 设计要求                                                  | 表示权威           | 层级角色 | 组件契约      |
| ---------- | --------------------------------------------------------- | ------------------ | -------- | ------------- |
| Document   | 包含块级或行内渲染的 Markdown 内容。                      | 当前源码与公开文档 | 支撑     | FR1, FR5      |
| Heading    | 呈现一个已解析的标题，包含其解析后的层级与可选的生成 ID。 | 当前源码与公开文档 | 突出     | FR2, FR3, FR5 |
| Paragraph  | 使用默认的组合安全段落结构呈现一个散文块。                | 当前源码与公开文档 | 突出     | FR2, FR3      |
| List       | 将有序、无序或任务列表项作为一个块呈现。                  | 当前源码与公开文档 | 突出     | FR2, FR5      |
| Code block | 呈现围栏代码，并在默认路径上拥有外层间距目标。            | 当前源码与公开文档 | 突出     | FR2, FR3, FR4 |
| Blockquote | 在默认路径上呈现引用的块内容。                            | 当前源码与公开文档 | 突出     | FR2, FR3      |
| Table      | 在可键盘滚动的块包装层中呈现已解析的行与列。              | 当前源码与公开文档 | 突出     | FR2           |
| Divider    | 呈现块之间的水平分隔。                                    | 当前源码与公开文档 | 支撑     | FR2, FR3      |
| Image      | 呈现块级图片，或空图片 URL 的回退内容。                   | 当前源码与公开文档 | 突出     | FR2, FR3      |
| Math       | 将显式启用的表达式作为惰性文本交给调用方的渲染器。        | 组件契约           | 支撑     | FR6–FR11      |

自定义渲染器替换既有的默认部件，而不会变成嵌套的 Markdown 结构。可选启用的数学渲染器同样不是默认结构，也不会获得 Markdown 主题目标或包装层。List 与 Table 没有对应的自定义块渲染器。Document 在每种显示模式下仍归 Markdown 所有。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Document": {"target": "markdown"},
  "Heading": {"target": "markdown-heading"},
  "Paragraph": {"target": "markdown-paragraph"},
  "List": {"target": "markdown-list"},
  "Code block": {"target": "markdown-codeblock"},
  "Blockquote": {"target": "markdown-blockquote"},
  "Table": {"target": "markdown-table"},
  "Divider": {"target": "markdown-hr"},
  "Image": {"target": "markdown-image"}
}
```

该映射记录了 Markdown 默认渲染路径上的全部九个当前目标。对于 Heading、Paragraph、Code block、Blockquote、Divider 与安全的 Image，自定义渲染器会替换默认部件，因而替换其本地目标。`markdown-codeblock` 这一拼写是已发布的兼容性异常：当前的命名规则本会产出 `markdown-code-block`，但已发布的目标已冻结，本次变更精确保留现有拼写。

## Family and system relationships

- `architecture:component-theming-surface` 拥有结构限定、目标映射、目标能力状态、组合边界，以及冻结目标的兼容性。
- `architecture:public-component-api` 与 `spec:AST-002/DEC-1` 拥有 API 准入。调用方知道美元符号语法是否为数学，并且必须选择渲染器；若不改变既有文档的含义，Markdown 无法从源码推导出这两者中的任何一个。
- `spec:AST-002/DEC-5` 要求这份已接受的组件本地契约与实现保持同步。
- `family:navigation-destinations` 拥有已解析链接与每个 Astryx 自有导航汇聚点的共享接受/阻止结果。`spec:AST-005/DEC-1` 要求 Markdown 解析与链接渲染保留与其他 Core 链接相同的规范化导航决策。被拒绝的链接保持惰性，不会到达自定义链接渲染器；被接受的链接保留其通常行为。
- `spec:AST-005/DEC-2` 将嵌入资源策略保持独立。解析器拥有 Markdown 链接与图片 URL 的安全性（`spec:AST-005/DEC-3`）：它会丢弃每个 `javascript:`、`vbscript:` 与 `data:` URL，而渲染器只渲染它已解析的节点。
- `module:Markdown/headingLinks` 拥有其可选启用的公共工厂、标题投影、内置同级渲染器、i18n、样式、无障碍行为与证据。Markdown 只提供通用插件与内置标题的组合接缝。
- `spec:AST-036` 拥有不透明的语法/转换/渲染器协议、不可变 AST 校验、受限的 Remark 兼容性、性能与资源边界。本记录在 FR12–FR22 中拥有聚合的 Markdown 行为；`module:Markdown/remark` 拥有单独导入的 Remark 适配器所支持的子集、拒绝与诊断；`module:Outline/parseOutlineFromMarkdown` 拥有对应的 Outline 投影。
- `component:Table/DEC-1` 与 `spec:AST-025/DEC-1` 拥有嵌套 Scroll 区域的行为：Table 在自己的视口上采用共享的可滚动区域组合，并由该组合——而非 Markdown——决定该区域如何滚动、如何命名自己以及如何容纳其溢出。`spec:AST-025/DEC-4` 拥有键盘所有权，使该区域只在实际滚动时才成为 Tab 停靠点。FR28 把这些主张投射到 Markdown 的表格块上：它要求 Markdown 不添加相竞争的滚动容器、名称或 Tab 停靠点，既不重述也不收窄 Table 与共享行为所拥有的内容。
- `spec:AST-064` 拥有 RichText 各表面如何采用 Markdown 插件。其 DEC-6 把本组件为它们暴露的内容限制为能力报告与上文的单节点渲染器。
- 嵌套的 Astryx 原语保留对其自身结构与目标的所有权；Markdown 拥有此处列出的外层块目标。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                                                               | 代表性状态                                                                                        | 失败信号                                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| FR1–FR5          | `Markdown.test.tsx`、主题目标测试以及 `scripts/check-knowledge.mjs`                                                                                                                                                                                                | 默认的块级/行内输出与所有当前目标                                                                 | 既有 DOM、目标、间距或渲染器行为发生变化。                                                                                             |
| FR6–FR10         | `parser.test.ts` 与 `Markdown.test.tsx`                                                                                                                                                                                                                            | 未启用、行内/显示数学、转义、货币符号、代码、链接、插件                                           | 在未启用时认领了分隔符，TeX 被当作 Markdown 格式化，或不透明上下文发生泄漏。                                                           |
| FR11             | `incremental.test.ts` 与 `Markdown.test.tsx`                                                                                                                                                                                                                       | 逐字符的顶层/列表/任务列表/引用分割、CRLF、源范围                                                 | 流式结果偏离完整解析、显示部分语法、把嵌套的结束标记误认为起始标记，或跨越已关闭的容器。                                               |
| FR12–FR16        | 插件、转换、适配器、性能与 Outline 解析器测试                                                                                                                                                                                                                      | 省略/空列表、不可变转换、无效输出、实时更新、一个兼容的 Remark 插件、重复标题                     | 空行为出现分叉、输入被修改、无效结构逃逸、转换触发重新解析、适配器丢失内容、预算失败，或标题目标出现分歧。                             |
| FR17–FR18        | 容器解析/校验、所有权与依赖测试                                                                                                                                                                                                                                    | 叶子/容器声明、嵌套容器、外部读取/移除/创建/编辑、未满足或顺序错误的依赖                          | 插件构建的已解析子节点、无效内容、丢失的回退子节点、外部创建/编辑，或通用的所有权代码。                                                |
| FR19             | 开发与生产环境中的诊断通道测试                                                                                                                                                                                                                                     | 每个阶段、建议性报告、频率抑制、无处理函数、格式错误的列表、重复的 Core、版本偏差                 | 生产环境出现静默失败、诊断中携带文档内容，或某个入口抛出异常而另一个入口能恢复。                                                       |
| FR20–FR22        | 规范/服务端导入、类型推导、流式、准备、主题测试                                                                                                                                                                                                                    | 服务端导入、无显式类型参数、分块边界、重建的列表、有主题/无主题的扩展                             | 客户端引用、显式类型的绕过写法、振荡、每次渲染重新准备，或无法到达的可选启用输出。                                                     |
| FR23             | 解析器、增量、渲染器、嵌套与公共选项测试                                                                                                                                                                                                                           | 混合列表；转义的散文/代码表格单元格、嵌套行内代码、完整与流式的一致性；自动链接省略/启用          | 混合列表被拆分或丢失状态、转义的表格竖线改变单元格或暴露其反斜杠，或自动链接改变了其他语法。                                           |
| FR24             | `plugins/frontmatter.test.tsx`、Storybook 与服务端渲染                                                                                                                                                                                                             | 完整、格式错误、非开头位置、LF/CRLF、未完成的流式、完整插件栈                                     | 元数据语法在完成后仍被渲染、未完成的语法在流式过程中泄漏、类型信息丢失，或后续插件停止组合。                                           |
| FR25             | `parser.public.test.ts`、插件 SSR 测试与包导出检查                                                                                                                                                                                                                 | 带插件的服务端/RSC 解析、同步 SSR、会挂起的渲染器流式边界                                         | 服务端导入被加上 `use client`、插件执行需要序列化、SSR 丢失回退，或直接 RSC 渲染被错误表述为受支持。                                   |
| FR26–FR28        | `Markdown.test.tsx` 以及覆盖已签入的窄宽度 story 的真实浏览器层                                                                                                                                                                                                    | 简短、散文与 token 密集的表格；仅有表头的行与空单元格；长表头配短表体；从手机到文档宽度读取各列   | 列收缩到其内容下限之下、单元格内边距吃掉下限、表头被截断、行内代码 token 在中间断开，或表格周围出现第二个滚动视口、名称或 Tab 停靠点。 |
| FR29             | `Markdown.test.tsx`（一个 `diff` 围栏 → 纯文本 + 层，一个 `diff-tsx` 围栏 → tsx + 层，一个普通围栏保持不变，自定义 `code` 渲染器对两个 diff 围栏都收到 `language="diff"` 且不收到新内容）                                                                          | 默认路径与自定义渲染器、`diff` 与 `diff-<language>` 围栏                                          | 不是 `diff`/`diff-<language>` 的围栏词进入该层，或自定义渲染器收到新 prop 或不同的 `language`                                          |
| FR30             | `Markdown.test.tsx`（命名某个已列出模块的围栏用它来绘制并以它的名称作为标签；同一围栏在没有 `codeLanguages` 时保持普通样式；后出现的条目在共享标识符上胜出；`diff-<identifier>` 围栏优先采用 diff 层而非已列出的值；自定义 `code` 渲染器收到语言词且不收到新内容） | 已列出与未列出的模块、共享标识符、`diff-<identifier>` 围栏、自定义 `code` 渲染器                  | 已列出模块的围栏被渲染成普通样式、未列出的标识符被解析为某个模块，或自定义渲染器收到模块或新 prop                                      |
| 公共语法/类型    | `Markdown.public.test.ts`、core 类型检查与 `Markdown.doc.mjs`                                                                                                                                                                                                      | 旧版穷尽式 switch、数学的可选启用、推导出的扩展节点联合类型                                       | 已发布的联合类型被放宽、已启用的联合类型丢失节点，或文档与声明脱节。                                                                   |
| 导航契约         | `parser.test.ts`、`urlSchemes.test.ts`、`Markdown.test.tsx` 与 `Markdown.renderBoundary.test.tsx`                                                                                                                                                                  | 已解析与已渲染的链接，包括经过转换的内置链接；被接受的普通 scheme；被拒绝的目标；链接与图片之分   | 被阻止的目标到达导航或自定义链接渲染器，或资源策略收窄了被接受的导航。                                                                 |
| 安全/无障碍      | `parser.test.ts`、`Markdown.test.tsx` 与渲染器指导                                                                                                                                                                                                                 | 惰性表达式字符串与渲染器自有的语义                                                                | Astryx 把数学当作 HTML 执行，或悄悄认领渲染器自有的无障碍职责。                                                                        |
| 自动链接扫描成本 | `parser.perf.test.ts` 的“GFM 自动链接扫描的耗时与输入长度成线性关系”（100,000 字符的输入在固定预算内完成带自动链接的解析）与 `parser.test.ts` 的“从每个字符开始扫描都能找到相同的裸邮箱”                                                                           | 一段很长的纯文本、含 `@` 但没有带点域名的文本、后接邮箱与 URL 的文本，以及被一长串 `)` 闭合的 URL | 耗时随文本长度平方增长的扫描超出预算；锚定扫描若找到不同邮箱则比较失败                                                                 |

聚焦测试继续固定全部九个当前目标名称与默认块位置。Math 有意不添加任何目标，也不添加默认结构。

## Decision log

### DEC-1 — Math is an opt-in renderer contract

**参考：** `component:Markdown/DEC-1`

**决策者：** `cixzhang`、`2026-09-13`

提供 `components.math` 的调用方会让组件进入受限的美元数学语法，并通过一个渲染器接收每个完整表达式，同时获得其源值与行内/块级位置。直接的解析器调用方使用 `MathParseOptions`；增量调用方还要通过 `createIncrementalState<true>()` 创建 `IncrementalParseState<true>`，使缓存与结果暴露同一个启用数学后的节点联合类型。

这通过了 API 准入，因为其他方面完全相同的美元符号分隔的源既可能是散文也可能是数学公式，只有文档宿主知道哪种含义适用，而 Astryx 无法替宿主选择排版或无障碍实现。把可选启用与必需的渲染器绑定，可防止出现已启用但无法渲染的状态。默认值仍完全是已发布的 Markdown 语法。

已否决：通用 AST/插件逃生舱口、原始 HTML 渲染、在没有使用方证据的情况下新增列表/表格槽位，或在组件上增加一个单独的布尔值，使数学可在没有渲染器时被启用。

### DEC-2 — Immutable transformation is the canonical Markdown extension seam

**参考：** `component:Markdown/DEC-2`

**决策者：** `cixzhang`、`2026-09-15`

Markdown 接受一个有序的 `plugins` 列表，其不透明条目由 `createMarkdownPlugin()` 创建。公共协议只暴露有界的 `syntax`、不可变的 `transform` 与带类型的 `renderers`。Core 在 FR12–FR22 中拥有深度只读输入、替换根的校验与冻结、可读回退、仅语法的解析身份、准备复用、共享标题身份、容器、诊断、规范/服务端解析与主题化。既有的 `components`、`inlinePlugins`、数学公式、引用、自动链接与解析器调用保持兼容。

文本匹配、语义围栏与源装饰是转换辅助方法，而不是单独的协议阶段。可 tree-shake 的适配器只可在有文档记载的 MDAST 子集上运行同步的仅转换 Remark 插件；不受支持的行为按失败关闭处理，而不是近似处理。

这会把 `spec:AST-036/DEC-1` 至 `DEC-4` 投射到组件所有者。它否决注册表、包发现、可变的共享 AST、原始标记、第二个插件 prop，或不受限的 Unified 运行时。

### DEC-3 — Containers, diagnostics, and canonical APIs are Markdown-owned

**参考：** `component:Markdown/DEC-3`

**决策者：** `cixzhang`、`2026-09-16`

Markdown 自己解析每个扩展容器的内部区间，并按照插件声明的内容形状校验子节点，因此标注块（callout）可承载真正的 Markdown，而标题身份、受保护上下文、导航策略与 Outline 范围仍归 Core 所有。容器改变的是文档能表达什么，而不是由哪个投影拥有标题身份：已发布的顶层遍历仍是默认值，任何可选启用的放宽都属于单独的当前模块契约。失败的容器渲染器会显示其子节点，而不是字面源码。所有权拒绝会指出规则与所有者；移除另一个插件的节点是被允许的，只有创建、编辑、内部重排、复制与身份伪造不是。

Markdown 也拥有该协议的可观测性与入口表面：`onPluginDiagnostic` 让每个失败在生产环境中可见，同时不携带文档内容；准入失败在任何入口都降级而不是抛出；规范解析入口与服务器安全解析器与已发布投影并存；扩展类型会被推导；扩展输出可选启用一个主题目标，而不会成为默认结构。

这会把 `spec:AST-036/DEC-5` 至 `DEC-11` 投射到组件所有者，覆盖 FR17–FR22。它否决仅叶子扩展、插件编写的已解析子节点、独立的文档外壳、仅开发环境或自由文本的诊断、只能通过客户端 barrel 到达的解析器、必需手写的扩展别名，以及插件输出的默认结构。

### DEC-4 — Own an explicit Markdown dialect, not a profile switch

**参考：** `component:Markdown/DEC-4`

**决策者：** `cixzhang`、`2026-09-19`

Markdown 已发布的语法是 Astryx 自有的显式子集。任务列表标记是普通有序或无序列表结构中的项语义，因此任务项与普通项混排时仍留在同一个兼容列表中，且每个项在每个嵌套层级上都保留自己的状态。已发布的表格与任务列表语法默认保持启用。表格单元格内反斜杠转义的竖线是结构性源语法：它把竖线保留在该单元格中，并且只把字面竖线贡献给渲染后的散文或行内代码，完整解析与增量解析的结果相同。可选的 `autolink: 'gfm'` 值只添加有文档记载的自动链接行为；它既不启用其他语法特性，也不改变列表结构。

这使文档在 Astryx 增加或拒绝个别生态特性时保持稳定。它否决笼统的 CommonMark 或 GFM 一致性声明、聚合的“全任务/全普通”分类、隐式的整语法模式切换，以及在既有自动链接选项下悄悄启用未来的 GFM 特性。

### DEC-5 — Frontmatter is typed document metadata

**参考：** `component:Markdown/DEC-5`

**决策者：** `cixzhang`、`2026-09-19`

原生 frontmatter 是有序插件管线中的一个第一方辅助工具。它只识别位于开头的定界块，通过调用方提供的带类型解码器解析一套刻意保持很小的键/值语法，并把该语法从渲染后的文档中移除。它不创建可视化扩展节点，也不要求 Remark 的 frontmatter 格式。在流式过程中，未完成的 frontmatter 会被暂缓，使原始元数据绝不会闪显为内容；一旦闭合，后续插件便可正常消费该元数据与其余文档。

### DEC-6 — A Markdown table column is floored by its own content, on Markdown's own Table part

**参考：** `component:Markdown/DEC-6`

**决策者：** `nynexman4464`、`2026-09-28`

Markdown 表格的各列按该列自身的内容而非固定宽度桶来定宽，并且下限是针对单元格文本而非其带内边距的盒子来表达的。由内容推导的下限让标识符、路由或状态 token 在任意阅读宽度下都可读，而文本盒上的下限意味着相同的内边距在每种密度下都对应相同的内容量，Markdown 也无须重述 Table 自己的间距。

Markdown 在 Table 已发布的换行模式默认值之上，把这一点应用于自己的默认 Table 部件，而不是改变那些默认值。Table 的换行模式是面向数据驱动表格的已发布契约，而 Markdown 已经拥有它所渲染部件的样式；把变更收窄到该部件，就不会触及任何其他 Table 调用方。

嵌套 Table 的 Scroll 区域仍是表格水平溢出、名称与条件性键盘可聚焦性的唯一所有者，因此 Markdown 自己的块放弃了它重复的溢出、`role`、名称与 Tab 停靠点。围绕一个表格的两个嵌套滚动容器会产生一个从不会滚动的焦点停靠点，以及第二个同名区域，而且当外层容器吸收溢出时，列下限也不可观测。

已否决：改为改变 Table 的换行模式默认值，那会为了修正一个部件的布局而移动每个数据驱动调用方的已发布行为；通过测量渲染后文本加宽各列，那会给纯声明式路径增加观察者与重排；以及为列定宽添加 prop 或选项，那会把默认路径的缺陷变成调用方的决策。

### DEC-7 — Streaming fade-in starts may come from refs written during render

**参考：** `component:Markdown/DEC-7`

**决策者：** `cixzhang`、`2026-11-09`

当 Markdown 流式渲染时，渲染期间写入的 ref 决定每个新淡入区间的起始位置。它们持有最近的淡入边界，以及最后渲染的块或行内节点。`architecture:react-component-runtime` INV4 记录了这一例外。

该例外是装饰性的。Markdown 只从其已提交、已平滑的子节点渲染文本，绝不从这些 ref 渲染。被 React 丢弃的一次渲染（例如挂起的过渡）最多只会按它添加上去的文本移动淡入区间。最新的淡入开始得更晚。当所有区间都在使用时，最旧的淡入文本会提前一步稳定。流式文本本身保持精确。

已否决：在提交阶段同步这些 ref，那会为了一处装饰性差异给每次流式更新增加提交阶段的工作。

## Open questions

- **OQ1 — 哪些聚焦测试应当为其余五条自定义块替换路径固定“目标不存在”？**（`checkable`）

## Content boundary

本文件不重复使用方 prop 表/示例、解析器机制、流式实现、嵌套原语契约、当前审计结果或系统主题化规则。它链接到这些内容的拥有者。
