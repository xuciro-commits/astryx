# @astryxdesign/richtext

# 0.7.16

#### 新功能

- `RichTextEditorToolbar` 的 Link 按钮以及编辑器中的 Cmd/Ctrl+K，会打开一个锚定到该按钮的 popover，而不是模态对话框。popover 包含一个 URL 输入框（按 Enter 应用），以及带 tooltip 的 Apply、Remove（当选区位于链接中时）和 Cancel 图标按钮。它不是模态的：按 Escape 或 Cancel 会关闭它，并将焦点和选区交还给编辑器；无法生成链接的 URL 会在输入框下方显示错误，并保持焦点。URL 规则（`sanitizeUrl`）、`hasNewTabLinks` 和 `promptForUrl` 保持不变；使用 `promptForUrl` 时，Link 按钮不会打开 popover，正如它此前不会打开对话框。([#8717](https://github.com/meta/astryx/pull/8717))
  popover 在工具栏上方打开，只有在上面没有空间时才翻转到下方。Apply 和 Cancel 使用共享的 `check` 和 `close` 图标，因此会重设这些图标样式的主题也会同时重设它们；Remove 的字形是固定图稿。`RICHTEXT_ICON_KEYS` 保持不变。

#### 问题修复

- 向 `RichTextEditor` 的表格中粘贴时，不再丢弃粘贴内容或清空单元格。粘贴的表格会从光标所在单元格开始逐个填充单元格，或在选中的单元格范围内填充。其中的合并单元格只填充它起始的那个单元格，而不会清空它覆盖的单元格；各行长度不一的表格也能完整粘贴。与网页复制时一样，连同其他内容一起粘贴的表格会作为文本进入单元格，而不会被丢弃。([#8577](https://github.com/meta/astryx/pull/8577))
- 输入的链接如果没有协议，但其主机名含点号或为 `localhost`，且后面跟着端口，例如 `example.com:8080`、`www.example.com:8080/docs` 或 `localhost:3000`，现在会像 `example.com` 一样获得默认的 `https://`，而不会被当作未知协议并变成 `about:blank` ([#11042](https://github.com/meta/astryx/pull/11042))

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @emilyhorsman
- @ernestt
- @kevin9327

---

# 0.7.15

#### 问题修复

- useLinkify 和 RichTextEditorAutoLinkPlugin：电子邮件检测现在改为线性时间。一个不包含电子邮件地址的长单词（例如粘贴的哈希或 base64 字符串）不再让页面卡住数秒。有效的电子邮件地址仍像以前一样生成链接，但有三处例外。在富文本编辑器中，紧跟在句点后面的地址不再生成链接，带引号的本地部分会在下一个引号处结束。在 useLinkify 中，粘在较早地址末尾的片段不再单独生成链接。(#11306)
- RichTextEditor：导入 Markdown 时，如果某个块包含一个反引号，且其首行下方有一行包含 `|`、一个破折号和一大串空格，页面不再卡死。表格分隔行的检查现在改为线性时间；哪些行算作分隔行的判定不变。(#11338)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @ChenyangLi4288
- @cixzhang

---

# 0.7.14

---

# 0.7.13

---

# 0.7.12

#### 新功能

- 在 `RichTextEditor` 中，代码块内的 Tab 和 Shift+Tab 会按该块已经使用的缩进量，对选区触及的每一行进行缩进或反缩进（如果其中一行以制表符开头，则使用制表符；否则使用任一缩进行最少的行首空格数，保持在 2 到 8 之间，否则使用 2 个空格）。选区仍停留在相同的字符上，每次按键都是一个撤销步骤。以前 Tab 会用制表符替换选区，Shift+Tab 也是如此。先按 Escape 再按 Tab 仍会将焦点移出编辑器。(#8579)

#### 问题修复

- 声明渲染器拥有的 DOM 边界，使装饰器浮层挂载到受管理内容之外，同时不改变安全的行内宿主方式。RichTextEditor 还会将其 `dir` 属性镜像到可编辑表面外层的包装元素上，因此编辑表面及其内容块、占位符、通过 `plugins` 渲染的 UI 以及被重新定位的浮层都会遵循 `dir`；此前编辑表面会沿用周围的方向。(#7633)
- `RichTextEditorAutoLinkPlugin` 不再将代码块中的 URL 变成链接。在代码块中输入或粘贴的 URL，或导入的围栏代码块中的 URL，现在都保持为代码。以前，链接会嵌套在代码块内部，导出的 Markdown 围栏代码块则会丢失它。(#10664)
- 在 `RichTextEditor` 中，向代码块粘贴富内容时会插入纯文本：剪贴板中的纯文本；如果没有纯文本，则将每个粘贴的块作为其文本的一行。以前，标题、列表、表格和格式会落入代码块内部，Markdown 导出会把它们写成围栏代码块中的普通行，导致文档读回时与编辑器显示的内容不同。(#8580)
- 处于禁用状态的 `RichTextEditor` 中的链接不再导航，不显示手型光标，也不是 Tab 停靠点。以前，禁用编辑器的链接会像活动链接一样工作：单击或按 Enter 会打开它们，Tab 会在每个链接上停留。(#10679)
- TextInput、TextArea、NumberInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、Tokenizer、Typeahead、PowerSearch、ChatComposer 和 RichTextEditor：当主指针为粗指针（手机或平板）时，焦点外观会立即显示，没有淡入淡出，因此点击的输入框在键盘升起时只重绘一次。对于精细主指针（例如鼠标），点击和 Tab 键仍保留淡入淡出效果。在减少动态效果（reduced motion）下，ChatComposer 的焦点深度也会立即显示，与其他输入框的焦点外观已有行为一致。(#10611)

#### 文档

- `RichTextView`、`RichTextEditorToolbar` 和 `RichTextEditorAutoLinkPlugin` 各自附带一个 doc 文件，因此 `astryx component`、`astryx discover` 和文档会列出它们的 props、默认值和用法。(#10407)
- 编辑器主题中的一处源码注释现在说明，核心 `Markdown` 会让每个块采用其自身文本的方向，而编辑器会让块保持表面方向。(#10293)
- RichTextEditor 文档说明了如何在不重排的情况下就地切换阅读和编辑：用 `xstyle` 将输入框的内边距和边框设置在阅读宽度之外，这样每个段落在切换前后都能保持行数。独立编辑器会保持其表单宽度。(#10429)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @emilyhorsman
- @ernestt
- @freddymeta
- @vjeux

---

# 0.7.11

#### 问题修复

- 在 `RichTextEditor` 中，在代码块的最开头按 Backspace 会将其变成一个包含其各行内容的段落，光标位于开头。以前它会将代码合并到上面的块中，因此上方若有标题，代码会被并入标题，Markdown 读回时变成一个更长的标题和一个多余的段落。上方没有任何内容的代码块本来就会变成段落，现在其 Markdown 读回时会保留各行内容。(#8581)
- RichText：Markdown 中的图片，无论行内形式（`![alt](url)`）还是引用形式（`![alt][ref]`），在你编辑其周围文本后都会原样返回；直接跟在一个链接后面的快捷引用图片（`![alt]`）会以其折叠形式（`![alt][]`）写出，因此该链接仍保持为链接。以前，在图片所在段落中编辑可能会使其方括号被转义（`!\[\](…)`），导致其他 Markdown 阅读器看到的是文本而不是图片。RichText 没有图片节点：图片显示为其 Markdown 源码，是一个 Backspace 可整体删除、自动链接会跳过的 token。放在图片内部的插入点会移到其边缘，因此输入会在图片旁添加文本而不是替换它。复制它，或拆分、合并其段落，都会保留源码。(#10356)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @emilyhorsman
- @ernestt

---

# 0.7.10

---

# 0.7.9

#### 问题修复

- RichTextExtensionNode 现在可以在不传参数的情况下构造，这是已注册节点类的必备条件。Yjs 协作绑定会以无参数方式为每个已注册节点类构建一个实例，以读取其默认属性，因此在此包默认节点之上创建绑定时，会在任何文档加载之前抛出 `TypeError: Cannot read properties of undefined (reading 'display')`。其 `facts` 现在默认使用该类读取损坏的已存储状态时已经使用的相同空值，因此无参数节点会报告一个空的行内扩展，而不是抛出异常。使用 facts 构建的节点保持不变。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @potatowagon

---

# 0.7.8

#### 新功能

- 在 `RichTextEditor` 中，代码块或表格单元格内的 Cmd+A（其他平台为 Ctrl+A）现在会先选中代码或单元格文本，再按一次则选中整个文档。在其他位置，它仍会一次选中整个文档。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @emilyhorsman
- @ernestt

---

# 0.7.7

#### 问题修复

- RichTextEditorToolbar：在没有选中任何内容时，Insert link 不会在光标处插入链接。在空段落中什么也不会插入；当光标位于文本中时，它周围的整段文本都会被加上链接，而对话框却像成功了一样关闭。现在，当光标位于链接之外时，Insert link 会在光标处将输入的 URL 作为链接文本插入；当选区非空时，它会为选中的文本添加链接；当光标位于链接内时，它会更新该链接，与以前一致。

#### 性能

- 在 `RichTextEditor` 代码块中输入时，不再对整个代码块重新分词。在 TypeScript、JavaScript、Python 和 shell 代码中，一行内的编辑只会对该行以及至多其上一行重新分词，并且只替换所编辑文本节点内部的颜色范围，因此在 2,000 行的代码块中按键，分词工作量与在短代码块中一样少。跨行开启或关闭字符串或注释的编辑，以及其他语言，仍会对整个代码块重新分词。颜色不变，唯一例外是：文本节点被相同文本的其他节点替换的代码块现在会重新着色，而不是保持无颜色。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @emilyhorsman
- @ernestt

---

# 0.7.6

#### 问题修复

- RichTextEditor 的 `toolbar` 现在将 `''` 视为空，就像它已经将 `null`、`undefined` 和布尔值视为空一样，因此 `toolbar=""` 不再向编辑表面添加工具栏的顶部边框。RichTextEditorToolbar 的 `endContent` 将 `''`、`false` 和 `true` 视为空，因此不再添加尾部分隔符。`0` 仍计为内容并显示为 "0"。(#9265)
- 已发布的包不再包含仓库中的测试和基准测试文件，在不改变导出的情况下减小安装体积。(#9153)

#### 其他变更

- RichTextEditor：`statusVariant` 在自己的类型中明确写出 `'tooltip'`，因此在 FieldStatus 于下一个小版本中移除已弃用的 `tooltip` 变体后，它仍会接受 `statusVariant="tooltip"`。无行为变化。(#9196)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @ernestt
- @parinith-web
- @potatowagon

---

# 0.7.5

#### 新功能

- 状态色在所有出现的位置都清晰可读，并且 Info 成为独立的状态。每个状态（info、success、warning、error）现在都有一个强填充色（`--color-<status>`）及其上的内容色（`--color-on-<status>`，至少 4.5:1）、一个浅填充色（`--color-<status>-muted`）及其内容色（`--color-on-<status>-muted`），以及用于页面和卡片的可读文本色（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认为可读文本色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning` 和 `--color-error` 以及 `bg-<status>` 继续保持其作为强填充色的含义。在 Tailwind 中，`bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>` 是新增的；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文本色，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变保留强填充色。例如，Core 浅色主题的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。若要在文本上保留填充色，请写 `text-[var(--color-warning)]`。

  屏幕上会发生的变化：

  - Core 深色模式的 Error 内容色（`--color-on-error`）现在是 `#0A1317`，而不是白色，因此深色模式错误填充色上的文本达到 4.5:1。Core 的 Info Badge 使用 `#0064E0`，而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 的状态字形以及 Chat 的工具调用状态图标使用可读色。Core 浅色模式的 success 图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色。Core 浅色模式的 warning 边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 浅色模式的 success 和 warning 输入框边框达到 3:1。
  - Banner 使用 on-muted 颜色绘制其标题、描述、图标和控件，并用 `--color-info-muted` 填充 Info。
  - 在强制颜色（forced-colors）模式下，状态填充色保留可见的边缘。
  - Chocolate 和 Matcha 的 success 与 error 填充色上，以及 Stone 的 success、warning 和 error 填充色上的内容色，现在达到 4.5:1。
  - 每个第一方主题都设置了蓝色的 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 颜色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在是其 Badge 早已显示的填充色，其 `--color-info` 为 `#0074E2`（深色模式下为 `#6D9CFE`）。其 Badge、StatusDot、进度填充和 Stepper 徽章外观不变；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色，而不是蓝色。
  - Neutral 不再定义其未文档化的本地状态令牌。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` 令牌 → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值，但已弃用。

  自定义主题会获得它们未设置的内容色和文本色角色：这些角色由主题的状态填充色推导而来。要保留某个组件之前的颜色，请设置对应的角色，例如将 `--color-icon-success` 设置为你原来的 `--color-success`。

- `RichTextEditor` 和 `RichTextView` 接受 `codeLanguages`，与 `Markdown` 接受的列表相同，因此阅读和编辑时代码的外观一致。

#### 问题修复

- 在使用 `moduleResolution: NodeNext` 的项目中，类型声明现在可以正确解析。
- 在 `RichTextEditor` 和 `RichTextView` 中，没有语言的代码块会为其 Copy 按钮留出空间，因此长行会在按钮前换行。该块的高度与 `Markdown` 中相同，因此在阅读和编辑之间切换不再使页面跳动。

#### 文档

- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @harjothkhara
- @rubyycheung

---

# 0.7.4

---

# 0.7.3

---

# 0.7.2

#### 新功能

- 在 `Markdown` 和 RichText 两个表面上，表格现在会在每个单元格边缘绘制线条，而不只是行与行之间，并且网格会在表格外缘闭合。读者沿一行横向阅读时从来不需要竖线，但编辑表格的人必须瞄准某个单元格并判断选区在哪里结束，而工具栏插入操作生成的空白 3×3 表格曾是三条横线，看不出它有三列。该线条就是行间已经使用的同一种 `--color-border`，外缘会与之合并成一条线，而不是在边缘处加倍；两个表面一起变化——阅读和编辑的渲染逐块一致，比以往更接近。

#### 文档

- `RichTextEditor` 文档现在列出 `isOptional`、`isRequired`、`labelTooltip` 和 `namespace` 这四个编辑器早已接受的 props，因此 `astryx component RichTextEditor` 和 docsite 的 props 表会显示 Required/Optional 指示、`aria-required`、标签 tooltip 和 Lexical namespace。

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang
- @potatowagon

---

# 0.7.1

#### 新功能

- `@astryxdesign/richtext` 现在是一个稳定包，与 `@astryxdesign/core` 以相同版本一起发布。安装时无需 `@canary` 标签：`npm install @astryxdesign/richtext`。它提供 `RichTextEditor`、`RichTextView`、`RichTextEditorToolbar`、`RichTextEditorAutoLinkPlugin`、无头 Markdown 序列化器（也位于 `@astryxdesign/richtext/markdown`），以及通过 `createRichTextExtension` 提供的 Markdown 插件支持。`RichTextView` 和核心 `Markdown` 以相同方式渲染同一文档，未经编辑即导入再导出的 Markdown 会逐字节保持不变。`lexical` 和 `@lexical/*` 包仍是可选的 peer 依赖。(#7224)

#### 问题修复

- `@astryxdesign/richtext`（以及 Lab 和 Charts 包）现在将其样式表声明为副作用，因此，会剔除无副作用导入的打包器仍会保留 `import '@astryxdesign/richtext/richtext.css'`，而不是将其丢弃并导致编辑器没有样式。JavaScript 模块仍然可 tree-shake。(#7586)
- `astryx.css`、`reset.css` 以及所有其他包样式表（`richtext.css`、`lab.css`、`charts.css`）现在都以 `@layer reset, astryx-base, astryx-theme;` 开头，与主题样式表所带的同一行一致。无论哪个 Astryx 样式表先加载，Astryx 的层顺序都成立：在 `astryx.css` 之后加载 `reset.css` 不再让 reset 覆盖组件样式，主题覆盖仍然胜出。已经在自己的第一行声明该顺序的配置保持不变。(#7585)

#### 文档

- `@astryxdesign/richtext` 的 README 展示了完整的样式表设置：Core 的 `reset.css` 和 `astryx.css`、你的主题 CSS，以及 `richtext.css`。其中说明该包附带预构建的 CSS，因此你无需编译其源码；并说明 `richtext.css` 位于 `@layer astryx-base` 中，因此只要 `reset.css`（或层顺序声明行）先加载，主题覆盖就会胜出。(#7582)

#### 贡献者

感谢所有为本次发布做出贡献的人：

- @cixzhang

---

# 0.1.9
