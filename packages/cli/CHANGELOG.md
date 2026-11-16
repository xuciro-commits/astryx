# @xds/cli

# 0.7.16

#### 实验性 API

- `astryx experimental theme editor`：新的强调色或中性色会在选中项和行、拖放区、编号引用和分段控件标签上保留基础主题自有的次要文本色阶，只要该色阶的对比度仍达到 4.5:1；只有当它不再达标时才会调整，说明中会指出为保持可读而保留了它。重复基础主题已显示内容的写入不再列为样式化变更。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：`src/themes/<theme>/` 中的应用副本会完全按照其源的 `theme build` 写出的样子写入（构建头部会注明该源），因此 `theme build --check` 和 `astryx doctor` 会将其视为最新，对它的稳定重建也会让它保持为编辑器的副本（下一次变更会再次写入）。构建之后失败的变更不再把被拒绝的构建留在应用副本中：只有在变更保存之后才会写入副本。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor show`：被拒绝（或渲染失败）的 show 会让 `src/themes/<theme>/` 中的应用副本保持原样；只有在 show 成功后才会写入副本。副本文件夹中的 .DS_Store 等系统文件不再妨碍复制；但那里若有你自己的文件则会妨碍，`wiring` 随后会手动给出步骤，并指明该文件。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：按当前规范的语法读取 CSS。([#11378](https://github.com/meta/astryx/pull/11378))

  - 编辑器还会从 `@csstools/css-syntax-patches-for-csstree`（新增的锁定版本依赖）读取当前规范的语法。它会让安装体积增加约 0.1 MB（解包后，一个 79 KB 的 JSON 文件，自身无依赖），并且只在编辑器检查 CSS 值时加载；其他命令都不会加载它，启动时间不变。MDN 标记为过时但规范仍有定义、浏览器也照此实现的属性会被接受：`font-stretch`，因此字体简写拆分出的名称是一条可用的命令。
  - 当前语法规定范围为 0 或以上的负数会在部件上被拒绝（`line-height -1`、`gap -2px`），并建议使用其正值。
  - 超出 0% 到 100% 的 `color-mix()` 占比在 token、部件颜色和颜色调节器上会被拒绝，并建议使用占比处于极限值的混合。
  - 在部件上单独给 `font` 指定字号或字重（`small`、`1rem`、`700`）时，会建议改用 `font-size` 或 `font-weight`，绝不会建议作为字体族。
  - 保留自身通道的相对颜色（`rgb(from red r g b)`）以及两次使用同一颜色的 `light-dark()` 都会按该颜色读取。编辑器不进行混合的色彩空间中的 `color-mix()`，或会改变通道的相对颜色，会说明该情况并建议它能算出的最接近颜色。

- `astryx experimental theme editor`：更多准确无误的拒绝与说明。([#11378](https://github.com/meta/astryx/pull/11378))

  - 当前 CSS 语法规定范围为 0 或以上的负百分比会在部件上被拒绝（`line-height -50%`、`gap -10%`）。
  - `color-mix()` 的占比可以写成任意 CSS 百分比（`5e1%`、`+50%`、`calc(50%)`）。
  - 行高 token（`--text-*-leading`）接受无单位数字，因为 Core 会用文本大小乘以它们；`1.5em` 和 `150%` 会建议改为 `1.5`。
  - 大小写不同或写成字重数字的 `headings` 会建议其本意词（`BOLD` 就是 bold），而字重数字会建议最近的字重档位（`800` 和 `900` 都是 heavy），绝不会建议更轻的。
  - 为 body 和 headings 设置了字体时，其下的全主题字体会说明它位于哪些角色字体之下，以及如何清除它们。
  - 编辑器自带预设作为首选给出的字体（Comic Sans MS）不会得到“必须加载”的说明。
  - 在调节器范围端点处的 `text-size more` 或 `less` 会建议基础字号 token，绝不会建议调节器会拒绝的大小。
  - 部件上由关键字组成的 CSS 字体值（`italic bold`、`bold 1rem`）会拆分为各长属性，绝不会当作字体族；按 CSS 的读取方式，大小之后的部分是字体族（`1rem bold` 表示大小 1rem、字体族 bold）。

- `astryx experimental theme editor`：数字 token 按 CSS 的读取方式读取。([#11378](https://github.com/meta/astryx/pull/11378))

  - 只有 Core 样式表在 calc() 内会乘以大小的 token（即行高）才拒绝单位；字重 token 重新接受 font-weight 关键字（`bold`、`normal`），因此用其中之一保存的主题仍可编辑。
  - 数字按浏览器的读取方式读取：`1.5e0`、`+1.5`、`15E-1` 和 `1.5EM` 都是数字，而像 `50.%` 这样的 `color-mix()` 占比会被拒绝。
  - 部件上带大小和行高的 CSS 字体值（`1rem/1.5`）或以算式书写的大小（`calc(1rem + 2px)`）会拆分为各长属性；重复两次的名称（`bold bold`）会被拒绝，绝不会写成字体族。

- `astryx experimental theme editor`：手机上的字重，以及按 CSS 读取方式读取的值。([#11419](https://github.com/meta/astryx/pull/11419))

  - 标题和文本字重（`headings` 字重调节器、`--text-*-weight` token）现在也会在手机上生效：它们会和字体族一样，写入基础主题设置的手机规则中。
  - 设置为 `var(--x, <fallback>)` 的 token 会按该 token 自身的类型检查回退值。
  - 大小 token 和颜色通道按 CSS 的方式读取数字：`1.px` 和 `rgb(255. 0 0)` 会被拒绝（若只是这种问题则建议 `1px`），而 `+4px` 和 `4e+1px` 会被接受。
  - `vibrancy` 会建议其本意值（`MORE` 就是 more，`70%` 和 `7e1` 就是 70），当主题没有可饱和的颜色时不建议任何值。
  - `headings` 的结果会用文字列出其字重，而不是 `[object Object]`。
  - 全主题和角色的 `font` 只接受字体族：大小、字重或完整 CSS 字体值会被拒绝，并附带字体族建议，以及适用时的基础大小或 headings 命令。

- `astryx experimental theme editor set`：当部件不读取所指定的 token 时，建议只会列出同类型的 token（字重只会建议字重 token，绝不会建议大小或行高）。`var()` 回退值无论位于何处（`calc()`、`max()`、`color-mix()` 内）都会被检查，带类型的 token 上的空回退值会被拒绝。给大小 token 一个裸数字会建议该数字加 px（`16` → `16px`），而 `text-size 20px`、`2e1`、`+20` 和 `1.25rem` 会建议 `text-size 20`。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：回退值、已保存的字体调节器和大小建议。([#11419](https://github.com/meta/astryx/pull/11419))

  - 部件值的 `var()` 回退值会按属性检查（`padding 'var(--nope, red)'` 会被拒绝），与 token 回退值一样。
  - 已保存但 `set` 会拒绝的 `font` 调节器值（如 `inherit` 这样的 CSS 关键字、大小、完整 CSS 字体值）会被报告，并给出修复命令，绝不会被构建。
  - 与有效值只差一点的大小会建议该大小：`16 px` 和 `16pxx` 建议 `16px`，`1,5rem` 建议 `1.5rem`。`text-size` 会建议它接受的最接近大小：`20 px` 和 `125%` 都是 20，超出任一端的大小就是该端值。

- `astryx experimental theme editor`：`font math` 作为它本来就是的 CSS 通用字体族被接受；通用字体族从 CSS 语法中读取。设置了精确的 `--font-size-base` 后，`how 'bigger text'` 会按步进调整该 token（从 14px 到 17.5px），而不是给出一个会被该 token 遮蔽的 `text-size`。手工把颜色调节器编辑为半透明、系统或变量颜色（`#2563ebcc`、`transparent`、`Canvas`、`var(--x)`）时，会按名称拒绝，并给出移除它的 undo，而不是构建出灰色强调色。使用全角字符、末尾句点或 CSS 注释输入的值（`１８`、`18.`、`＃2563eb`、`#2563eb /* brand */`）会建议其本意值。`set` 会拒绝通过主题自己的 `<theme>.theme.ts` 中某个 token 闭合的 `var()` 循环。`show` 会说明主题自身源设置的、同时又被全主题调节器写入的每个 token。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：建议保留本意值，小数文本大小会说明其构建方式。([#11419](https://github.com/meta/astryx/pull/11419))

  - 仅因值输入方式（末尾 `;`、注释、外加引号、全角 `＃`）而被拒绝的精确 token，会建议同一个值，而不是现成的值。
  - 在字体 token 或部件的 `font-family` 上需要引号的字体名（`Font Awesome 6 Free`）会建议加引号，与字体调节器写入的方式一致。
  - 小数 `text-size`（`15.5`）会按字号阶梯构建出的整数像素保存，结果中会说明这一点。

- `astryx experimental theme editor how`：模式短语、关于当前设置的问题、焦点环，以及按量变更。([#11378](https://github.com/meta/astryx/pull/11378))

  - “The same accent in light and dark”会设置两种模式，末尾的“and dark mode only”仍会使主题变为仅深色。
  - 无法再移动的步进（徽章已经是完全圆形）会说明这一点，且不会给出会被拒绝的命令。
  - 关于当前设置或可选项的问题（“how round are the cards now?”、“what are the available corner values”）会得到 `show` 和查询结果，绝不会是变更。
  - “Remove the focus outline”会把其宽度设为 0，并说明这样做的代价；“outline offset”和“focus ring offset”会设置 `--focus-outline-offset`。
  - “Decrease the radius by 2px”会从主题当前的自身半径（应用其 corners 设置后）移动圆角；对部件按量变更会指向其当前值，而不是把该量设为值。
  - “Caret color”会设置 `caret-color`；占位符文本和选中高亮会说明它们没有相应设置。
  - 屏幕尺寸、打印和设备条件（“below 600px”、“on tablets”、“the print version”）会说明编辑器没有这类条件，而不是把“600px”读成半径、把“tablets”读成表格。
  - “Text less black”会让文本变浅。
  - 列表中的每一项都保留自己的值：“headings 32px bold, body 16px regular, captions 12px”会按要求设置标题和正文，不会互相矛盾，而“captions”（无对应部件）不会从相邻项取得任何值。

- `astryx experimental theme editor how`：否定模式、CSS 光标、请求旁的设备词和标签。([#11378](https://github.com/meta/astryx/pull/11378))

  - “Don't touch dark mode, make the accent orange”只会更改浅色模式。
  - `cursor: pointer` 会设置 CSS 光标；只有“caret”或“cursor color”指文本光标颜色。
  - 设备或打印词（“cramped on mobile”、“when printing”）不再丢弃请求：其余部分会得到回答，并说明编辑器没有这类条件。
  - 关于某个部件的状态或组的问题（“which parts are in the inputs group”、“how round are the cards now?”）会得到该部件的查询结果以及 `show`。
  - “Not so round”是减少一档；“avoid pure black text”会选择近黑色；“flat cards, not flat buttons”只会更改卡片。
  - `NaNpx` 和 `Infinitypx` 因不是数字而被拒绝；`1e3px` 是 1000px。
  - 标签指字段标签部件（若指明，则是复选框或开关自身的标签）；“visited links”会说明链接没有 set 能指定的已访问状态。
  - Tailwind 的 `border-2` 是 2px 边框宽度，`rounded-full` 是胶囊形；`.btn-primary { … }` 仅指主按钮。
  - “Remove all my changes”会撤回所有设置；how 无法读取的脚本中的问题不会得到猜测。

- `astryx experimental theme editor how`：“2px rounder”是从当前圆角开始的变更，“all corners like the buttons”会复制按钮的半径。([#11378](https://github.com/meta/astryx/pull/11378))

  - 带比较级的量（“2px rounder”、“2px sharper”、“8px larger”）是从当前值开始的变更：主题的圆角从其自身当前半径（应用其设置后，而非基础主题的）移动，部件的圆角从其读取的半径 token 移动。在其他地方（“4px wider”），how 会说明 set 接受的是新值，而不是把该量设为值。
  - “All corners like the buttons”会把其他所有半径 token 设置为按钮读取的那个。

- `astryx experimental theme editor how`：否定的深色模式、对已设置内容的撤销、输入的时长和变换，以及正确的目标。([#11419](https://github.com/meta/astryx/pull/11419))

  - “Except in dark mode”、“but not in dark mode”和“leave dark mode alone”只会更改浅色模式；“not pure black”是近黑色，“not pure white”是近白色。
  - 在没有设置圆角的主题上执行“Undo the corners”会说明没有可撤销的内容。
  - “animation-duration 0s”是 0ms；“translateY(-2px) on hover”是悬停时的变换；“shrink headings by 20%”会说明 set 接受新值；“fade in tooltips”会说明提示框自身没有动效。
  - “Why are my buttons black”是查询，绝不是变更；“is my theme valid”、“how many dials”和“list every change”会得到回答它们的命令。
  - “radius sm/lg”、“setRadius(4)”和“½rem”会按值读取；“#22c55e in light, #4ade80 in dark”会为各模式设置强调色；两词 CSS 颜色名（“midnight blue”）会按 CSS 颜色读取。
  - “Text on the accent is hard to read”会设置在各模式下都可读的强调色上文本颜色；“5 lines tall text box”会按行数设置文本区域的高度；“dropdown shadow”指下拉菜单；“checkboxes green”指选中填充色。

- `astryx experimental theme editor how`：带比较级的 rem 或 em 量（“0.5rem rounder”）是从当前值开始的变更，按 16px 根字号计算，“tighter”、“roomier”、“looser”、“bolder”和“heavier”也按比较级读取。how 无法算出新值时，会说明将当前值加或减该量后 set。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：置信度门限，以及不喜欢、撤回和深色模式选择器的读取。([#11419](https://github.com/meta/astryx/pull/11419))

  - 当一句话是问题（“is the card too round?”）、包含“tell me”或“but not too”，或要求“stop”某事时，how 会给出查询结果并要求用文字说明变更，而不是猜测写入；“explain X”是 X 的查询。
  - 当整个请求就是“I hate the shadows”、“skip …”和“not a fan of …”时，它们表示完全不要该项。
  - 对组中某个成员（“the text area”）的变更会带上 `--only`，因此不会影响整个组。
  - “3 pixels sharper”、“take 2px off”和“remove 4px from”会把值从当前位置下调。
  - “darkmode”、`html.dark .card {…}` 和 `@media (prefers-color-scheme: dark) {…}` 会把变更限定到深色模式。
  - “Take back the shadow change”和“shadows like before”只会撤销主题设置的内容，否则会说明没有可撤回的内容。
  - “Pointer cursor on hover”会设置光标；“opened accordion title”是打开状态；“squre”和“eckiger”是方形；“cards look flat”会增加层次感；“darker while being clicked”是按下状态。

- `astryx experimental theme editor how`：每个按量或按方向的变更都从主题自身开始，而不是基础主题。更深或更浅的颜色会从主题在各模式下的自身颜色开始，并在已经达到最深或最浅时说明；部件上更大的文本大小会从主题在该处设置的大小开始；按量移动的部件圆角会从主题在其上设置的半径开始。Token 查询显示主题自身的值。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：置信度门限按子句生效，单模式变更绝不会移除某个模式。([#11419](https://github.com/meta/astryx/pull/11419))

  - 属于问题、“tell me”、“stop …”或“don't touch …”的子句只会抑制自身：“stop making the buttons so round, make them square”会把按钮变成方形，“don't explain, just set the accent to crimson”会把强调色设为猩红色，“don't touch spacing, just make text larger”只会更改文本。整个句子是问题（“can the cards be rounder?”、“are buttons too round?!”）时会得到查询结果；“can you make …”是请求。
  - 没有问号的问题（“are my corners too round”、“does it use a shadow on cards”）是查询；建议（“why not square buttons”、“what about a teal accent”、“is there a way to …”）是请求。讽刺（“yeah, because …”、“just what I wanted”、“…, nice”）不会产生写入。
  - “Enough with X”、“quit with X”、“nobody asked for X”、“who needs X”、“loathe X”、“X 👎”和“❌ X”都表示完全不要 X；描述之后的“I hate it”会让描述本身成为请求。
  - “Too airy”是更紧凑，“headings too thin”是更粗，“not bright enough”是更亮。
  - “Keep the dark mode accent, change only light to violet”会设置浅色强调色；只有当请求涉及主题的模式时，才会把主题变为仅浅色或仅深色。
  - “Links not underlined until hover”会移除下划线，并在悬停时添加。

- `astryx experimental theme editor how`：“bolder”或“a bit lighter”的标题会从主题设置的 headings 档位移动一档（没有更远的档位时会说明），而“a bit bigger”文本会按调节器自身的步进移动数字文本大小。`how <theme> <question>` 会把命名现有主题的第一个词当作主题，与 `set`、`show` 和 `undo` 一样。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：只为直接请求写入。属于条件的子句（“if the corners are round, …”、“unless …”）、间接问题（“I wonder if …”、“is 4px a good radius”、“would #333 work”、“should corners be 6px or 8px”）、双重否定（“don't not round …”）或检查（“can you check if …”、“just checking: …”）会得到查询结果，并要求以请求的形式说明，而不是猜测变更。礼貌用语（“if you can, …”）不是条件。“Can the buttons be rounder?”和“can I get a serif font?”是请求；问题后跟请求（“whats the padding on cards make it 12”、“do badges have borders? remove them either way”）会回答该请求，其中“it”或“them”按问题所指的内容理解；“dark page #0b0b0f”会设置深色页面。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：“more muted”、“pastel”、“duller”和“subdued”会降低鲜艳度，“less muted”会提高它（`--color-background-muted` 这样的 token 名称绝不会按该词读取）；“less light”或“less thin”的标题会加粗一档，“less heavy”会减轻一档，“less tight”会加大字距；字重问题只会列出部件读取的字重 token；“too dark”要求更浅，“too light”要求更深；“no big gaps”是更少间距；问题中任何位置的讽刺（“great, even more shadows, just what I wanted”、“…, nice”）都会抑制所有子句。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：读作请求的子句才写入：祈使句、带值的事物、带部件的样式词、关于具名事物的愿望，或对所需外观的描述（“the page is white”）。反意问句（“cards have a shadow, right?”）、假设（“imagine …”、“consider …”）、条件（“whenever …”、“once …”、“should the cards …”）、讽刺或双重否定则会得到查询结果。“nuke”、“zero out”、“sharpen”、“flatten”、`X++` / `X--` 和 `X: off` 会说明往哪个方向走；“dark.page=#…”和“dark mode only: accent #…”会设置深色模式。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor how`：“show me …”和“give me …”是查询。“decrease”、“shrink”、“trim”、“minimize”和“scale down”表示更少。“Only when dark mode is on”和“except in dark mode”会保留其模式。其他语言的删除词和 🚫 表示移除；“X are heavy”会减淡；“don't touch the buttons”和“leave the corners”绝不会写入被排除的部件。行内列表编号（“1. … 2. …”）是分隔；长说明中为某个部件请求的颜色会留在该部件；“tooltips darker”仍按颜色处理。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme`：第十三轮修复。([#11378](https://github.com/meta/astryx/pull/11378))

  - `undo` 在回退到的步骤中会略去此 Core 拒绝的内容。没有指定设计 token 或 CSS 属性、或指定了无部件的属性的已保存设置会被报告。
  - `show` 会构建主题自身对 `<name>.theme.ts` 的变更，并指明不再能构建的主题源。其颜色会说明主题源在哪里胜过生成的色调。
  - 被之后一个扩展到其部件的设置所覆盖的设置，会在 `set` 和 `show` 中指明。
  - `corners 2e1px` 和 `+4px` 是尺寸。对于 Core 只根据普通值设置内边距的部件，带状态的内边距会被拒绝。`--state disabled` 也会匹配内部输入控件才是禁用项的外层容器。`how <part>` 会列出 `set` 在该处接受的状态。
  - `new` 的建议会保留给出的每个选项；两次给出 `--like` 会被拒绝。更多建议按 JSON 中打印的内容执行。合并片段的路径从生成的主题模块文件夹开始。帮助中会指明用 `experimental theme compile` 重新构建编辑器主题。

- `astryx experimental theme editor`：为状态设置圆角（`corners pill --on button --state hover`）会被接受，结果会指明该部件派生的半径变量，Core 只会根据普通值设置它。部件会扩展为容器间距的内边距在带状态时会被拒绝，按所指的部件判断（`--only` 会将其限制在组的一个成员上）。`focus-within` 在包含内容的部件上会被接受。不是颜色的单模式值会首先因该原因被拒绝。([#11378](https://github.com/meta/astryx/pull/11378))
  `show` 在主题源无法构建时会让每个文件保持原位，并指明不是文本的 token 值。以路径或大写命名的主题（`use ./themes/t`、`use T`）会得到编辑器主题的答复。

- `astryx experimental theme`：`show` 会在主题源导入的模块中构建变更，无法读取且源行损坏的构建会说明要恢复什么。从子文件夹编译编辑器主题的 `compile` 会指明从应用根目录运行。`--state disabled` 只会在样式写在 wrapper 上的表单控件上触达内部控件，绝不会涉及整个按钮组。回退一步会写入相同的颜色文件。([#11378](https://github.com/meta/astryx/pull/11378))
- `astryx experimental theme editor`：拒绝给出的每个建议都能运行并做到其所述之事。`undo t Corners` 会以任意大小写读取设置名，相近的名称（`undo t corner`）会建议 `undo t corners`，绝不会建议裸的 `undo t` 而回退另一个变更。手工编辑的设置只有在 token 的值类型错误时才会建议一个要设置的值。重复给出的标志会建议该标志接受的第一个值（`--like neutral`、`--corners small`、`--section actions`，对于颜色调节器则是第一个颜色值：`--accent banana --accent red` 建议 `--accent red`），或者将其丢弃。由你自己的文件组成的文件夹会建议一个可用且有效的主题名（`u-2`）。设置损坏或丢失后，说明会指出 `undo` 会回退到最后一次变更之前的设置，且最后一次变更本身不会被保留。修正后的 `new` 会保留给出的所有其他选项，其他大小写的 `--like` 会按其命名的内置主题读取。([#11378](https://github.com/meta/astryx/pull/11378))
- `astryx experimental theme editor`：`--state disabled` 只会在包含单个控件的部件（typeahead）上触达内部控件，绝不会涉及单选列表、输入组或字段。`corners none`、`sharp`、`zero` 和 `0%` 是方形；`spacing none` 指最紧的一档。撤销部件的状态设置会指明该组同一状态的设置。`focus-within` 在通过 prop（聊天编辑器的输入框）或子元素（popover）包含内容的部件上会被接受。([#11419](https://github.com/meta/astryx/pull/11419))
  你自己主题源中不是文本的 token，无论是单独还是成对，都会在写入任何内容之前被拒绝，并给出该 token 自身类型的示例。以 `./x.js` 导入的辅助文件在只有 `x.ts` 存在时也会计入。因你自己的文件而被拒绝的 `set` 会建议读取它。compile 帮助会列出编辑器主题的拒绝项。

- `astryx experimental theme editor`：无效主题名会建议一个 `new` 接受的名字（内置主题名建议 `my-neutral`，已占用文件夹建议一个可用的编号名），且只有当另一个大小写下的同名主题存在时才说“a theme here already”。对现有主题执行 `new` 会建议 `set <theme> base <the --like given>` 以及带相同选项的可用名称。手工列出两次的设置会指明两个值，将其设为单个值或撤销即可修复列表，而不会回退另一个变更。构建模块缺失时，`set` 和 `undo` 会说明未列出 token 变更，绝不会说变更没有显示任何内容。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor show` 会跟随主题源读取的每个本地文件，按构建解析它们的方式（`./tok` 解析为 `tok/index.tsx`、`./c.cjs` 解析为 `c.cts`、`./j.jsx` 解析为 `j.tsx`），包括主题 `tokens/` 文件夹中你自己的文件；那里只有编辑器生成的调色板文件保持各自的标记。带引号的值对如 `['600', '700']` 不再被称为“not text”；以无单位数字给出的大小会被指明，并附一个通过的示例，`{light, dark}` 对象会被指明，而不是原始错误。在主题编辑器创建的文件夹中执行 `experimental theme template` 只会保护编辑器自己的文件：那里较早的模板会用 `--overwrite` 替换，对于编辑器文件，跳过会指明一个可用路径而不是 `--overwrite`。`undo` 会拒绝设置未带有的 `--only`，无论逗号间距如何都能匹配值（`rgb(255,0,0)`），`undo <theme> mode`/`base` 会在历史无法追溯到主题的创建方式时说明。失败的构建会把文件放回并说明未更改任何内容，`show` 不再声称构建了其源无法承载的主题。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：长度上的裸数字（`padding 4`）会建议 `4px`，并保留所有标志，绝不会建议属性的重置值。通过类名（`.astryx-card`）或组件名（`<Card>`）指明的部件会建议该部件。buttons 和 surfaces 调节器写入的内容会从构建中读取，因此它们下面的精确属性会在 `set` 和 `show` 中指明，撤销它会指明适用的调节器。未知状态会建议其本意状态（`pressed` 就是 active），或说明如何查看部件的状态。在变更及其撤销之后，设置表不再显示为过期。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor show`：缺少一半的浅色/深色值对会被指明，即使另一半包含逗号（`rgb(0, 0, 0)`）。主题源通过 `require()` 或 `import x = require()` 触达的辅助文件算作源的一部分。另一个主题的构建写入的样式表或模块（`compile other.theme.ts --out themes/g/g.css`）会依据编辑器的设置重新构建。([#11419](https://github.com/meta/astryx/pull/11419))
  赋给部件属性的数字会为每个裸数字加上 px（`4 8px`、`8 / 4`、`4 px`），并处于属性范围内，绝不会回退到其重置值。`--on checkboxes` 会像 `how` 那样指定 checks 组。`corners sharper` 和 `spacing roomier` 会从当前值步进。其他拼写的状态（`focusVisible`、`focus_visible`）就是该状态。

  当应用中的 `themes` 是文件（或指向文件的链接）时，每个编辑器命令都会拒绝并说明将其重命名或移动，而不是以原始错误失败。

- `astryx experimental theme`：任意磁盘上的模板覆盖，以及真实的撤销答复。([#11419](https://github.com/meta/astryx/pull/11419))

  - `experimental theme template … --overwrite` 绝不会替换其名称其他拼写下的主题编辑器文件（在不区分大小写的磁盘上 `themes/t/T.theme.ts`，或通过链接）。
  - 在没有已保存变更的主题上执行 `undo <theme> mode` 或 `base` 会说明这一点，而不是声称其历史无法追溯；在每一步都撤销之后，会说明该值从未更改。
  - 只有另一半设置时，`undo <theme> headings <word>` 会指明已设置的那一半。
  - 拼写错误的 `base` 只会建议该项目已安装的基础主题，并在该名称是本处制作的主题（不能作为基础主题）时说明。
  - `undo <thing> <value>` 会以任一种引号样式匹配保存的值，并忽略 `/` 周围的任意间距。

- `astryx experimental theme editor`：拼写错误的 `--like` 或 `base` 只会建议应用已安装的基础主题，若附近没有，则建议 `base none` 和已安装的基础主题。变更及其反向操作之后的 `undo <theme> base` 或 `mode` 会说明已回到主题创建时的值。`new` 会像其他编辑器命令一样，拒绝它不接受的选项并附带帮助。手工复制或重命名的主题文件夹会指明要重命名的文件。部件上在四边之后设置的 padding（或其他）简写会按其说明移除这些边，`undo` 会把它们恢复。手工编辑的部件属性值若被其 CSS 语法拒绝，会像调节器一样被指明。当输出缺失或被手工编辑时，`show` 会重新构建，正如 `compile --check` 所发现的那样。([#11419](https://github.com/meta/astryx/pull/11419))
  当你自己的 `<theme>.theme.ts` 无法解析时，`set`、`undo` 和 `show` 会在写入或删除任何内容之前拒绝（`tokens/` 下的调色板文件保持原样），并附上该文件的 `cat`；删除 `tokens/` 文件夹的失败变更会把它放回。命令在构建中途停止留下的构建临时文件会在十分钟后被清理。

- `astryx experimental theme editor show` 仅在其预览页显示的内容发生变化（CLI、Core、页面或主题构建）时才重新渲染这些页面：没有任何新内容的 show 大约耗时一秒。无法读取的构建输出，或代替它的文件夹，会在 `show` 和 `compile` 中被按名称拒绝，并给出检查它的命令。show 检查构建时会计入编辑器构建写入的每个文件，包括生成的颜色引用；生成设置模块内部的手工编辑会根据设置重新构建（`compile` 会拒绝它）。无法运行的输出检查不再被读作匹配。忙于另一个命令的主题会建议在另一个命令结束后再次运行同一命令。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：主题文件是文件夹或无法读取（其设置、源、样式表、模块或撤销历史）时，会指明问题所在和 `ls -la <file>`，而不是崩溃或“damaged”/“not valid JSON”；任何消息都不会建议删除文件（损坏的历史会被移出主题文件夹）。`./t` 和 `.\t` 都指主题 `t`。以其他字母写出的模式或基础主题（`Dark-Only`、`Neutral`）会被修正后提供，只有已安装的基础主题才会被建议。缺少参数时会指明命令接受什么以及实际给出什么（`set corners small` 会把 `corners` 读作主题），并附上用法和 `--help`。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：设置文件的 `lifted` 字段不是文本列表时会被指明，并给出恢复它的 undo，而不是崩溃。设置全主题调节器时会说明你自己的 `<theme>.theme.ts` 自行设置的每个 token，它们胜过调节器，因此不会显示的变更会得到解释。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor show` 在其运行所用的 Core 或基础主题包发生变化时（即使版本相同，例如链接或打过补丁的副本），以及页面被手工编辑时，会重新渲染其页面：页面会在其渲染键旁记录自身的哈希。对于仅某些主题构建才写入的输出，若被文件夹替代（variants 类型），会像其他输出一样被按名称拒绝。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：被文件夹替代的构建类型文件（`<theme>.d.ts`、`.css.d.ts`、`.variants.d.ts`）会用 `ls -la <file>` 指明，绝不会用编辑器没有的 `--out`。与现有主题相差一个字母的主题名会建议同一命令并先给出该主题名（`set brnad corners small` → `set brand corners small`），之后才用输入的名称执行 `new`。空主题名（`''`、`-`、未设置的变量）会说明名称为空，并列出此处的主题，而不是建议 `new my-theme`。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：你自己的 `<theme>.theme.ts` 仅在某个作用域（`onDark`、`components`）中设置的 token 不再算作页面级，因此绝不会遮蔽调节器或闭合 token 循环；只有其顶层 `tokens` 才会。渲染标记之后添加了文本的预览页会重新渲染。`editor show` 文档列出了 ERR_FILE_EXISTS 和 ERR_WRITE_FAILED，说明 ERR_UNKNOWN_THEME 也涵盖未安装的基础主题包，退出码行会列出每个拒绝项。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：`show` 中失败的渲染（两份 React、抛错的组件）无论发生在哪里，都会以 `doctor` 和“Nothing was written”拒绝；`show` 再次生成的输出会先被放回。两份 React 现在会被指明为原因（Core 自带的 React 从其入口找到）。在工作区根目录不使用 `@astryxdesign/core`（Core 被提升到根目录）的工作区中，根目录和没有自己 `package.json` 的文件夹会被拒绝，并指明使用 Core 的工作区应用及要在其中运行的 `cd`，因此主题不会落到应用之外。`undo <theme> radius-element` 和 `undo <theme> padding` 会建议 token（`--radius-element`）或带其 `--on <part>` 的属性，绝不会建议会撤销另一个变更的回退步骤。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：命名 JavaScript 对象内建成员（`constructor`、`__proto__`、`toString` 等）的词，无论是作为值、作用域、状态、标志还是 `how` 问题给出，都会像其他未知词一样被拒绝，而不是以 `ERR_UNKNOWN` 崩溃。编辑器读取输入文本的每个词表现在只针对自己的条目作答。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor` 按一条规则查找应用：工作文件夹或其上层最近的、其 package.json 列出 `@astryxdesign/core`（在 dependencies、devDependencies 或 peerDependencies 中）的文件夹。不使用 Core 的工作区成员、未列出它的应用子文件夹、带深层 glob 或任何 pnpm-workspace.yaml 形式的工作区根目录都会被拒绝，并附带 Core 的解析位置和列出它的工作区应用，以及各自要运行的 `cd`；不会向错误的文件夹写入任何内容。应用内的嵌套仓库不再遮蔽其上层的应用。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：主文件夹自身的 package.json 列出 Core 时即为应用；node_modules 内的文件夹绝不算应用；不是对象的依赖字段按没有 Core 读取，而不是失败；安装建议使用应用的包管理器；Yarn Plug'n'Play 应用从其任何文件夹都会得到它自己的拒绝；工作区拒绝会指明最多六层文件夹深的应用，并把以 `-` 开头的文件夹写成 `./-name`；无法解析的 package.json 会指明解析器错误及其位置。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：在某个部件上（`--on`）设置并读取全主题 token 的 token，只在其设置所处的作用域内检查循环。部件先读取自己的设置，再读取全主题的设置，而全主题的值绝不会读取部件的值，因此 `--color-accent var(--color-text-primary)` 与 `--color-text-primary var(--color-accent) --on top-nav-heading` 无论顺序如何都会被接受，保存的设置也不再让 `show` 和每个 `set` 拒绝；一个部件内或全主题内的循环仍会被拒绝。作为另一个 token 的 `var()` 给出的精确强调色（或其他填充色）、双颜色 `light-dark()` 或由 token 组成的颜色函数，会按其在各模式中显示的颜色读取，因此其上的文本会按该颜色的可读性选取，说明中也会指明（`var(--color-warning) = #ffce2f`）；仍无法读作单一颜色的值会指明为未检查，而不是使用生成的色调。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：手工删除的主题自身 `<theme>.theme.ts` 会由 `show` 或下一次 `set` 重新写入，并说明这一点，对其执行 `compile` 会建议 `editor show`。`text-size` 和 `type` 会指明它们保留的精确角色大小（`--text-body-size`、标题大小），角色或全主题字体会指明它保留的精确 `--font-family-<role>`，并给出释放它的 undo；撤销角色字体会指明该 token 是实际生效者。粘贴时带 `!important` 的值会说明它未被使用，并建议去掉它的值；字体调节器会把粘贴的 `Georgia, serif;` 或注释读取为本意字体。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor` 从构建对你自己 `<theme>.theme.ts` 的处理结果读取其中的 token，因此任何书写文件的方式都算数（命名空间导入、重命名的 `defineTheme`、模板、共享对象的展开）；在首次构建之前，文件按书写内容读取，下一次构建显示会使 token 相互读取的变更会被拒绝，并把文件放回。基础主题自身的值绝不算作你的值，它们会闭合 token 循环，并使部件按基础主题的规则读取 token。主题文件设置的强调色是调色板为其选取文字的颜色，你的主题文件同时设置的精确 token 会说明文件的值生效。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：设置文件中被手工编辑为不指定任何设计 token（且无回退值）的 `var()` 的精确 token，会由 `show` 和之后每个命令指明，并给出移除它的 `undo`，正如 `set` 拒绝它那样；它绝不会被构建。`font` 调节器会把字体族名内任意连续空格或制表符读作一个空格，因此 `font 'Open  Sans'` 指 Open Sans。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：Yarn Plug'n'Play 工作区（其 `.pnp.cjs` 位于工作区根目录）会从成员应用或其子文件夹得到 Plug'n'Play 拒绝；主文件夹中应用内的仓库会被拒绝并指明该应用及其 `cd`，绝不会安装到仓库中；建议的 `new my-<name>` 是可用且有效的名称，若用户已有自己的 `my-<name>` 则会指明它；以包名（`@astryxdesign/theme-butter`、`theme-butter`）或其他字母输入的基础主题会在建议中保持该基础主题，未安装时会附在其安装行之后。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：font、text-size 和 type 调节器不再说你的主题文件设置了它们写入的 token；你的主题文件设置的调色板 token 不会得到色调说明，且你的主题文件在每个说明中都排在最前（在精确设置之前、调节器之前），并在 undo 之后也如此。一个部件内的 token 循环若通过基础主题或你的主题文件为该部件设置的规则闭合，会被拒绝；你的主题文件也在部件上设置的设置会说明文件的值生效；undo 只计入它仍能回退的步骤。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor set`：缺少逗号的字体族列表（`"Open Sans" serif`）会被拒绝，并恢复逗号（`"Open Sans", serif`），使用 css-tree 读取；建议绝不会把列表折叠为包含转义引号的单个字体族。带属性名粘贴的字体（`font-family: Georgia, serif;` 或 `font:` 简写）会按其指定的字体族列表读取，适用于 `font` 调节器和精确字体 token。带回退值的 `var()` 绝不会因读取不到内容而被拒绝；当其名称与设计 token 有笔误时，说明会指出回退值始终生效。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme editor`：你的主题文件在更多地方排在前面。部件状态或变体规则内的 token 循环若通过该部件的普通规则（基础主题的或你的文件的）闭合，会被拒绝；你的文件在部件上设置的部件调节器、组或变体设置会说明这一点；撤销你的文件也设置的部件设置会指明文件的值；`show` 会指明你的文件自行设置的每个精确设置；说明中若说要移除你文件中的某个 token，会指明随后显示的精确设置。编辑过的主题文件 `compile` 之后，当 `compile --check` 会认为构建为最新时，`show` 也如此读取，而不是重新构建。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor`：`undo <theme> headings Tracking`（或 `TRACKING`、`Tight`）会移除字距那一半，绝不会移除字重那一半；变更只会移除编辑器拍摄的图片（且仅在它们仍是编辑器写入的样子时），绝不会移除用户的文件，并把 `show --section` 生成的分节表标记为过期（在 `sheetStale` 中），而不是删除它们；主题文件夹中目标已消失的链接会被指明其指向，`set` 和 `undo` 都如此，而不是失败的复制步骤或“Nothing to undo”。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor set`：字体文件或链接（`./fonts/My.woff2`、`Inter.woff2`、字体服务 URL、`url(…)`）以及包含冒号的名称会作为字体族名被拒绝，适用于 `font` 调节器和精确字体 token，并给出加载文件的方法（`@font-face` 或字体包），绝不会建议给它们加引号。带属性名粘贴的值（`color: #e11d48;`、`font-weight: 700`、`font-size: 18px`）会按给出的值提供，带回退值的 `var()` 按其回退值提供，颜色调节器上的 `light-dark()` 按其浅色提供并附说明；没有值的 `font-family: ;` 会因无值被拒绝。大小建议是 token 自身的默认值，而不是 `6px`；带冒号输入的 token（`--color-accent:`）会先提供去掉冒号的形式。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor`：其手机规则只重复你的精确字体设置，说明会指出手机显示的效果（在基础主题之上，手机显示的是基础主题为你文件以普通 token 设置的字体所用的字体；说明会指出要在主题的 typography 上设置它们，或在针对相同屏幕的规则中设置）。你的主题文件给不是颜色的 token（字体、大小、字重）设置的 `[light, dark]` 值对会被按名称拒绝，正如 `--mode` 在这些 token 上那样；你的文件通过 `typography` 设置的字体被视为文件的值。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor`：`--png` 只会覆盖编辑器拍摄的图片（且此后未变）；同名属于用户的文件会被指明并保持原样，不会拍摄图片。编辑器图片的记录是主题的一个文件（`<theme>.pictures.json`），因此会随主题移动和复制。因名称被拒绝的 `new` 绝不会建议调节器会拒绝的调节器值：该值会被省略，拒绝说明会指出这一点。分节表的过期通知会指明 `show <theme> --section <section>`，即重新生成它的命令。手工重命名的主题文件夹会被拒绝，并给出在新名称下编辑它所需的每个步骤：文件重命名以及 `<theme>.theme.ts` 内部的名称。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor set`：在字体族名中，每个 Unicode 空格（不换行空格、窄空格）都算一个空格，零宽字符会被丢弃，因此 `Open<no-break space>Sans` 指 Open Sans。带属性名粘贴的调节器值（`border-radius: pill`、text-size 的 `font-size: 18px;`、accent 的 `color: #e11d48`）会按值读取，所有调节器走同一条路径。作为单个参数粘贴的声明（`set b '--color-accent: #e11d48'` 或 `--color-accent:#e11d48`）会把该 token 设为该值；`set` 的用法现在将值显示为 `[value...]`，无值的 set 会给出与之前相同的缺少值错误。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme editor`：不是颜色的 token（阴影也算）上的 `[light, dark]` 值对，无论你的主题文件如何书写（常量、`as const`、`satisfies`、从导入模块展开），都会被 `set`、`show` 和 `undo` 以及 `experimental theme compile` 和 `--check` 拒绝。你的主题文件在部件上设置的状态规则（`:hover`）会像变体一样被指明：在 `set`、`show`（不会显示的设置不会得到对比度提示）和 `undo` 中。已保存设置包含编辑器拒绝的值的主题，其 `compile` 会指明移除它的 `undo`；手机说明会指出要在主题的 typography 上或在针对相同屏幕的规则中设置字体，以便在手机上保持。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：一个条目规范化器会在任何检查之前读取每个设置，无论输入的还是保存的。每个 Unicode 空格（不换行、窄空格）都会变为普通空格，零宽字符会被去掉，适用于所有值类型；包含这些字符的已保存值会连同要设置的干净值一起指明。完整或拆分输入的声明（`accent: #e11d48`、`--color-accent=#e11d48`、`font:inter`、`accent:` 后跟值）会作为设置及其值，适用于调节器和 token；用破折号或 `var(--x)` 输入的 token 就是该 token，未带破折号输入的会补上破折号后提供。被拒绝值的建议来自该设置自身的检查：`text-size 14pt` 会建议像素大小，`type large` 或 `type 18px` 会建议 text-size（绝不会是 corners），`mode` 会列出其模式，已保存的大小 token 会建议其自身带单位的值。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：空主题文件夹（或只包含 .DS_Store 等系统文件的文件夹）还不算主题：`set`、`show` 和 `undo` 会说明这一点并建议 `new <theme>`，后者会在该处创建它，而不是称其为编辑器未创建的主题。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：`new` 和 `show` 以 `wiring` 结束，即把主题放入此应用的步骤：为其应用副本执行 `astryx theme add <theme>`（单模式主题还要为 `<Theme>` 设置 `mode`），以及构建它的内容；只有当你的某个文件夹占据了副本的位置时，才会手动给出根文件的导入和 `<Theme>`。编辑器帮助中也是这么说的。在组上设置的 token 会指明读取它并接受变更的成员，以及其他成员改为读取什么；从不读取它的部件仍会被拒绝。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：主题的每次构建（new、set、undo、show，以及对其源执行的 `experimental theme compile`）还会写入其应用副本 `src/themes/<theme>/`：一个标准的本地主题（描述符、重新导出构建模块的源、构建模块、其样式表和字体样式表），标记为由编辑器写入且绝不会手工编辑。随后 `astryx theme add <theme>` 会把主题放入应用，`theme use`、`remove` 和 `list` 会像任何本地主题一样对待它；`new` 和 `show` 会在 `wiring` 中说明。首次写入副本时（由 `new`，或对之前创建的主题的首次构建），结果会指明其文件（JSON 中的 `appCopy`）；之后的构建会静默写入。那里的文件夹若不是编辑器自己的副本，绝不会被写入，wiring 会改为手动给出导入。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：为一个模式保存的部件设置不再锁定切换为单模式的主题（它会保持保存、被指明为不适用，并在两种模式下再次应用）；部件的长度（内边距、圆角半径、间隙）若读取另一类型的设计 token（颜色、字体、时长），会像 token 形式一样被拒绝，并指明一个可用的长度 token；名称不是 CSS 变量的 `var()`（`var(color-x)`、`var(-x)`、`var()`）会对每个值被拒绝，并给出修复形式。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor`：以编辑器在输入时会清理的形式书写的已保存设置（`Corners`、`var(--radius-element)`、破折号、`backgroundColor`、状态 `Hover`）会由其拒绝所建议的 undo 移除，且只移除该设置：清理后名称也匹配的有效设置（corners = pill、真正的 hover 规则）会保留。已保存值的清理形式只有在 set 接受时才作为 set 行提供。任何值中的弯引号都会变成 CSS 读取的直引号（弯引号中的字体族不再连同引号保存在名称中），带引号的 CSS 字符串会保留其不换行空格，token 名称开头任意连续的破折号类字符（长破折号或短破折号、不换行连字符、减号、全角连字符）都会变成它的两个短横线。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme`：对还没有应用副本的编辑器主题执行 `list`、`add`、`use`、`remove` 和 `eject` 时，会指明与 `editor new` 和 `show` 在 `wiring` 中给出的相同步骤（先构建一次，然后 `theme add <theme>`，单模式主题还要为 `<Theme>` 设置 `mode`）。在设置保存之前停止的颜色变更不再留下其颜色配置和 `tokens/`：编辑器会在写入配置之前记录它，下次构建在保存的设置未设置颜色时会移除它；你自己的配置绝不会被移除。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme editor how`：焦点环请求会保留其作用域（“focus ring on inputs only”会设置焦点环的 token `--on inputs`，其他部件保留各自的），精确量（“half”、“double”、“twice”、“50% strength”、“x0.5”）会从主题自身的值算出：焦点环宽度、部件的圆角半径，或主题设置了内边距时的内边距。逗号后的单独量（“…, at half strength”）属于它之前的请求。比较（“cards with twice the padding of buttons”）在主题设置了另一部件的值时基于该值；否则答案是一个步进并会说明。答案会指明其起始值，对于“strength”还会说明它将其读作焦点环宽度。([#11490](https://github.com/meta/astryx/pull/11490))
- `astryx experimental theme editor how`：“header(s)”或“title(s)”与文本词（bolder、bigger、font、weight、size、serif）搭配时指 headings 的字体，与表面词（background、bar、border、sticky、height）搭配时指应用头部部件；拥有自己头部的部件（“table header”）保留自己的。“just”和“only”会保持它们指定的作用域（“just the headers bolder”只更改标题，绝不会更改正文）。([#11490](https://github.com/meta/astryx/pull/11490))
- `astryx experimental theme editor`：`dark-only` 或 `light-only` 主题会保留其颜色的两半，其模式是应用 `<Theme>` 所给定的模式。([#11468](https://github.com/meta/astryx/pull/11468))

  - 主题的颜色会保留浅色和深色值，因此 Core 在另一模式下绘制的 toast、lightbox 或 overlay 仍可读；生成的设置模块只包含 Core 类型接受的名称，因此应用能通过类型检查。
  - `set <theme> mode dark-only`（或 `light-only`）会说明给应用的 `<Theme>` 传入 `mode="dark"`（或 `"light"`），`theme add` 之后的 wiring 会说明它放在哪里；预览已经传入它。
  - 另一模式的设置会像以前一样不进入单模式主题，并被指明。

- `astryx experimental theme editor new` 以每次变更后如何查看主题结束：`editor show <name> --png` 会从真实组件写出 `themes/<name>/preview.png` 和 `sheet.png`，且不会更改应用中的任何内容；打开图片并对照要求检查。([#11500](https://github.com/meta/astryx/pull/11500))
- `astryx experimental theme editor` 会读取你自己 `<theme>.theme.ts` 的页面级 token，无论它们如何书写（内联、常量、展开、`as const` 或 `satisfies`），读取自构建加载的 `defineTheme`，绝不会读取同一文件中的兄弟主题；文件中无法读取的值来自构建。`experimental theme template --overwrite` 和 `compile --out` 的帮助与其实际行为一致。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme editor`：按设置内容处理的简写，以及 Core 能承载的部件值。([#11419](https://github.com/meta/astryx/pull/11419))

  - 在其长属性之后设置的简写只会替换它真正设置的各长属性，依据 MDN 的数据读取（`overflow` 保留 `overflow-wrap`，`transform` 保留 `transform-origin`，`flex` 保留 `flex-direction`）；当 `background-blend-mode` 稍后出现时，部件的 `background` 仍会作用到其变体。
  - 组的简写会像部件的简写一样替换其成员的长属性，因此无论哪种方式都是较后的设置胜出。
  - 在 Core 为每边写入一个变量的内边距部件（card）上，为所有变体设置某一边之后，变体的内边距会被拒绝，并给出可用的命令：它不会显示。
  - `--on cards`、`dialogs`、`tabs` 和其他复数形式会指明该部件，并附上 set 命令。
  - 词语提示会保留所给的值：`shadow none` 是 `box-shadow none`，`rounded 8px` 是 `corners 8px`，`bold false` 是 `font-weight normal`。

- `astryx experimental theme editor`：精确写入卡片内边距和半径。([#11419](https://github.com/meta/astryx/pull/11419))

  - 在 Core 为每边写入一个变量的内边距部件（card 和其他容器）上，编辑器会自行写入每一边，按 CSS 拆分简写的方式拆分：`calc(4px + 2px) 8px`、`clamp(12px, 2vw, 24px)` 和四个不同的边会按输入原样到达部件。
  - 为所有变体设置某一边之后，变体的内边距现在会显示：编辑器也会写入变体的各边变量，而不是拒绝它。
  - 多个值的卡片半径（`12px 12px 0 0`、`10px / 20px`）会为每个角给出各自的半径；到达卡片边缘的内容会采用一个半径，即第一个角的半径，结果中会说明这一点。

- `astryx experimental theme editor`：变体值胜过提升的基础值，卡片内边距关键字精确写入。([#11419](https://github.com/meta/astryx/pull/11419))

  - 部件提升到变体上的基础值（以免 Core 自己的变体规则将其隐藏）现在会排在变体自身声明之前，因此为变体设置的长属性或简写会胜出（基础 `border` 之后 destructive 按钮的 `border-color`）。

- `astryx experimental theme editor`：按写入内容生效的内边距边和内部半径。([#11419](https://github.com/meta/astryx/pull/11419))

  - 较后的部件内边距会替换其组设置的边。
  - 部件自身的多值半径会保留它给出的内容半径，胜过来自组、调节器或基础主题提升到变体上的单一半径。

- `astryx experimental theme editor`：聊天编辑器的框会按其绘制方式触达。([#11419](https://github.com/meta/astryx/pull/11419))

  - chat-composer 上的 `padding` 会应用到可见编辑器框的内边距，其外部没有间隙。背景、边框、阴影、单边内边距或某一密度的内边距会落在编辑器的透明 wrapper 上，因此会被拒绝并说明原因。

- `astryx experimental theme editor`：为盒子读取 Core 内边距变量的部件提供统一的内边距模型。([#11440](https://github.com/meta/astryx/pull/11440))

  - 在 card、clickable-card、selectable-card、dialog、drawer、bottom-sheet、section 和 number-input 上，每个部件的内边距会按创建顺序从每个内边距设置中按变体和状态逐一算出，并针对每个文本方向分别处理（物理 left 在从左到右的盒子中是起始边，在从右到左的盒子中是结束边；`padding` 简写的 left 也是如此），然后写入盒子读取的变量。较后的设置在两个方向上都胜出，变体或状态优先于基础值，到达盒子边缘的内容保持对齐。
  - 可点击或可选择的卡片按卡片设置内边距。
  - 部件的基准规则排在其变体规则之前，其针对某方向的规则排在其状态规则之前，无论设置是按什么顺序创建的。
  - chat-composer 上的 `padding` 接受一个长度，因为 Core 会在 calc() 内读取它：一个长度、像 `var(--spacing-3)` 这样的变量（Core 自身的默认值），或给出一个长度的 `calc()`、`min()`、`max()` 或 `clamp()`。多个值、裸数字或百分比会被拒绝，并给出一个可用的值。

- `astryx experimental theme editor`：内边距保留在设置的位置，Core 在 calc() 内读取它的任何地方都只接受一个长度。([#11453](https://github.com/meta/astryx/pull/11453))

  - 在可点击或可选择的卡片上、或卡片的变体或状态上设置的内边距，不再影响到其中嵌套的普通卡片：较窄规则写入的每一边都会在其内部的普通卡片上重置，因此 Core 自身的回退生效，且较窄规则写入每一边而不是整个内边距。
  - Core 在 calc() 内读取内边距的每个部件（从 Core 自身样式表找到：chat-composer、dropdown-menu、context-menu、segmented-control，以及某项的行内内边距）在该处只接受一个长度，与 chat-composer 一样，通过组（`--on menus`）时也是如此。
  - 卡片、对话框或容器组上带 `--state` 的内边距现在会被接受：内边距模型会写入该状态自身的各边。

- `astryx experimental theme editor`：跟随父级的嵌套 section，以及 Core 能计算的长度。([#11453](https://github.com/meta/astryx/pull/11453))

  - section 四边相同的内边距会写成该 section 的整体内边距，Core 会在父 section 传下的内边距之后读取它，因此嵌套 section 会继续跟随其父级。
  - 在 Core 会用其计算的部件上（card、section、dialog、drawer、bottom-sheet），`0` 的内边距会写成 `0px`；`initial` 和 `unset` 会保留 Core 自身的默认内边距。
  - 设置文件中 `set` 会拒绝的手工编辑会由下一次 `set` 连同移除它的命令一起报告，与 `compile` 一样，而不是被构建。

- `astryx experimental theme editor`：部件的内边距会替换基础主题的，每个内边距都写入 Core 能计算的长度。([#11453](https://github.com/meta/astryx/pull/11453))

  - card、section、dialog、drawer、bottom-sheet 或 number-input 上的内边距会替换基础主题在该处的内边距，无论基础主题设置了哪些边：编辑器会将其写成 Core 与基础主题一起计算的 padding 属性，其中较后者胜出。
  - 可点击或可选择卡片的内边距会在每个文本方向上都胜过卡片的左或右内边距。
  - 嵌套在较窄部件中的普通部件只会在其自身规则未设置的边上重置，因此你自己主题源中该部件上的内边距仍然生效。
  - 以任何方式书写的零（`0e0`、`0.0`）都会写成 `0px`；`initial` 和 `unset` 指明部件来自 Core 的自身默认内边距。
  - 当 `set` 也更改另一个部件的内边距时，某个部件上手工编辑的内边距会被报告。

- `astryx experimental theme editor`：编辑器构建的内容，`compile --check` 接受。([#11468](https://github.com/meta/astryx/pull/11468))

  - card、button、dialog、avatar、banner、popover 和其他带内角半径的部件上的两到四个圆角半径会写成 Core 读取的 CSS 属性（整体半径，Core 会将其转为内容半径，然后是每个角），绝不会写成私有变量，因此 `compile` 和 `compile --check` 都会通过。
  - chat-composer 上的内边距会被拒绝并说明原因：其透明 wrapper 内的盒子只从 Core 自有的变量读取内边距，主题无法设置该变量，而在 wrapper 上设置内边距会在盒子外增加间隙。

- `astryx experimental theme editor`：你自己主题源中的内边距在同一部件上胜过编辑器的内边距，无论各自指名哪些边。([#11490](https://github.com/meta/astryx/pull/11490))

  - 你的 `<theme>.theme.ts` 在部件普通规则、变体或状态上设置的内边距会胜过该处的编辑器内边距（你自己的卡片内边距 6px 之下的 `padding 20px --on card` 显示为 6px），结果中会说明这一点，在编辑该文件之后、任何构建之前也是如此。
  - 部件普通规则上因文本方向而异的编辑器内边距会保持普通规则的权重，因此任何变体（包括你自己的）都会优先于它。
  - 在 Core 将内边距保存在自身变量中的部件上，`padding inherit`（以及 `revert`）会像 `initial` 和 `unset` 一样被接受，结果会指明它表示的默认值。

- `astryx experimental theme editor`：间距调节器在每一步都保持小、中、大控件尺寸相互区分且有序。([#11490](https://github.com/meta/astryx/pull/11490))

  - 更密的间距仍会按普通比例让控件更矮，但不会有尺寸与它下面的尺寸重合：本会重合的尺寸会保留自己的步进并在其上按比例缩放，且没有尺寸会低于 24px（Neutral 上的 `spacing tight` 给出 24px、27px 和 30px，而小和中都曾终止于 24px）。调节器的帮助会说明控件高度跟随它。

- `astryx experimental theme editor`：`--png` 拍摄的每张图片都带有编辑器的标记（一个指定主题的 PNG 文本块），因此即使没有记录也能认出是编辑器的；早期版本拍摄、尚无记录的图片若为编辑器 1280 像素窗口，会被接管，结果会说明一次。只有编辑器读取或写入的文件之间的链接会被拒绝，并各自指明其指向；指向你自己的文件（笔记、设计稿）的链接不会被处理。因名称被拒绝的 `new` 会从建议中省略不会改变任何内容的 vibrancy（未给颜色），并说明这一点。new、set、show 和 undo 的 `--png` 帮助会指明图片记录以及不拍摄图片的情况。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme preview`：它写入的路由和页面在 `noUncheckedIndexedAccess`、`noImplicitOverride` 和 `noUnusedLocals` 下通过类型检查。`add --path` 会拒绝不是普通 URL 段的文件夹名（空格、重音字符、`#`、`%`），并建议使用 slug 化的名称。Windows 不允许的文件夹名会被完全拒绝：保留字符、末尾点号或空格，以及 `COM¹` 风格的设备名。URL 冲突时建议的可用文件夹是其 URL 没有其他页面使用的文件夹。`preview app` 会忽略已停止命令留在主题文件夹中的临时文件。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme preview`：在预览的导航中，只有普通左键单击会在原地切换页面；Ctrl/Cmd、Shift、Alt 或中键单击会像链接一样打开页面 URL。编辑器变更后的 `see` 行现在首先给出不会更改应用内容的方式（编辑器自己的 `preview.html`，在它渲染的每次变更后都是最新的，以及 `--png`），然后是有应用内预览页时的该页面；将预览添加到应用作为选项排在最后。([#11490](https://github.com/meta/astryx/pull/11490))
- `astryx experimental theme preview add`：Next 可以在普通 URL 中提供的文件夹名（字母、数字和 `. _ ~ ! $ & ' ( ) + , ; = @ -`）会被接受。对于其他名称，每个奇数段会被 slug 化，建议的文件夹是可用文件夹。仅大小写不同的文件夹会被拒绝，因为 macOS 和 Windows 视其为同一个。在没有 TypeScript 的应用中，结果会指明安装行。当应用的 tsconfig 启用 `noUncheckedIndexedAccess` 时，结果会指明按模板原样写入的模板页面。Colors 页面会按存储值显示种子颜色。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme`：返回预览的裸 URL 会像重新加载一样显示其第一页。`editor undo` 会将其 `see` 行指向关于它所撤销内容的页面。URL 取决于应用路由、或文件夹被手工重命名的预览，会由 `see` 和 `preview list` 指明其所在位置，而不是建议一个新的。`preview add --theme` 会把粘贴的标签（`theme: t`、`name: t`）当作主题 t；给编辑器命令这样的标签会被拒绝，并建议 `show t`。编辑器无法渲染的变更会在其 `see` 行中说明原因，而不是指向它没有写过的 `preview.html`。([#11490](https://github.com/meta/astryx/pull/11490))
- `astryx experimental theme preview`：默认页面的 id 与请求的另一个页面并列时会被拒绝（“drop one of them”），而不是丢弃另一个。在没有生成颜色的主题上执行 `preview add colors` 会说明如何获取它们。`preview list` 会标记文件已消失的页面，并注明中途停止的变更，`add` 会把缺失的页面作为已添加写回。再次运行停止的 `preview remove` 会完成它并以 0 退出。只有当 `basePath` 作为字面量设置在 next.config 顶部的导出配置上时才确定；设置在 `if` 或函数中、被删除或由 wrapper 添加的，会被指明为从代码设置。([#11378](https://github.com/meta/astryx/pull/11378))
- `astryx experimental theme preview`：预览路由只在浏览器中渲染其页面，因此当 Components 是第一页时，使服务端渲染崩溃的组件不再阻止 `next build`。next.config 按 Next 加载它的方式读取：`.js` 先于 `.mjs`、`.mts`、`export {config as default}`、对象之后设置的键，以及重复键的最后一个；以其他方式更改的配置会得到说明而不是猜测。表格片段（TableHeader、TableBody、TableFooter）不再单独显示在 Components 页面上。`preview add overview`（或另一个默认页面的 id）会恢复缺失的默认页面。([#11378](https://github.com/meta/astryx/pull/11378))
- `astryx experimental theme preview app --theme <t>`：新应用会安装此项目所用的 Core 和基础主题版本，即复制构建所基于的版本，因此安装后主题是最新的；说明会指明这些版本以及如何迁移到此 CLI 的版本。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme preview`：`add` 会在主题构建不是最新时（输出缺失，或构建与设置不符）重新构建主题，与 `preview app` 使用相同的规则，因此路由绝不会导入缺失的文件。粘贴的 `--theme 'theme: t'` 会指定主题 t。带子文件夹的 `distDir` 只会阻止该文件夹。在没有预览的文件夹上执行 `remove --path` 会指明那里已有的预览及其 remove。`preview app` 的帮助说明使用 `--theme` 时 Core 和基础主题会固定到项目的版本。([#11468](https://github.com/meta/astryx/pull/11468))
- `astryx experimental theme`：每个应用内预览页都有自己的 URL（`/theme-preview?page=components`），导航会链接到它，因此链接、重新加载、后退按钮或截图都能到达任何页面；`preview add`、`list` 和 `app` 会给出每个页面的 URL。每个编辑器变更都带有 `see` 行：首先是不更改应用内容的方式（编辑器的 `preview.html`，变更后即为最新，以及 `--png`，无需开发服务器即可拍摄图片），然后是最相关的应用内预览页（颜色变更后是 Colors，部件变更后是 Components，其他情况是 Overview）及其 URL（若有预览），最后作为选项给出添加预览。`--png` 的帮助说明它需要 Playwright 或 Chrome，并会增加几秒钟。([#11490](https://github.com/meta/astryx/pull/11490))
- `astryx experimental theme preview`：`--path` 若经过文件、文件夹名超过 255 字节，或路径长度超过 3,500 字节，会被拒绝并说明原因。仅大小写不同的文件夹在 `preview app` 和 routes 文件夹之外的 `--path` 中也会被拒绝。`preview remove` 会将它无法读取的页面文件留在原处，说明这一点并保持记录。以不同值重复给出的预览标志会被拒绝。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme preview remove`：应用自身代码导入的页面会被保留，并指明导入它的文件，单页和整个预览都如此。检查会读取整个项目，跟随相对导入、`@/` 和 tsconfig 路径别名。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme preview`：在 Overview 和 Components 页面上以打开状态显示的 popover 不再获取焦点，因此页面会停留在打开时的位置。Overview 只在预览有 Colors 页面时才指向它；在预览没有 Colors 页面的主题上执行颜色 `set` 会说明用哪个 `preview add` 添加它。`preview remove` 会移除预览首次 `add` 创建的空文件夹，绝不会移除之前就存在的。当页面打开时主题发生变化，Overview 会重新读取其字体行。`preview app` 起始项目列出了 `@types/node`，因此其首次 `npm run dev` 不会安装任何东西。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme preview add`：把应用框架的精确名称作为描述（`blank`、`shell-top-nav`）会被拒绝，并给出明确原因和 `--template` 命令。精确的模板名称会被称为所指的页面，而不是最接近的页面。没有 routes 文件夹时，拒绝会指明其下的 Next 应用及各自可用的 `--path`；会创建没有根布局的 routes 文件夹的 `--path` 会在写入前被拒绝。页面包从预览所在的应用读取。Core 样式表检查从根布局开始遍历预览，包括路由组，并跟随 tsconfig 路径别名。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme preview add`：指定页面模板的简短描述（`checkout`、`hero`、`a landing page`）会采用 `build` 排名第一的页面，而不是被拒绝。恰好为模板 id 或显示名称的描述会添加该页面，或说明为何跳过。Core 样式表说明会跟随根布局的导入，因此从根 `styles/` 文件导入的样式表也算。应用缺少其包的主题字体会得到带安装行的说明，Overview 会标出未安装的字体。([#11440](https://github.com/meta/astryx/pull/11440))
- `astryx experimental theme preview remove`：保留代码所导入页面的检查现在会读取整个项目（安装目录、构建输出和点文件夹之外的每个源文件），解析每个文件的导入、导出、`import()` 和 `require()` 调用（包括模板字符串形式），并保护文件重新导出的路由。项目太大而无法检查时会被拒绝，而不是只检查一半。手工更改的路由会被要求移出预览文件夹。`preview add --template overview|components|colors` 只在页面缺失时添加该页面，或说明为何不能。已停止的预览命令留下的临时文件会由下一个命令和完整 remove 清理。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme preview`：当两种拼写的文件夹都已存在时，大小写冲突拒绝会建议在它们旁边新建文件夹，并为已在其中的预览指明 `preview remove`。指向文件夹之外（`../`）的 `theme-preview.json` 条目会被 `add` 和 `list` 报告为损坏。`remove` 会丢弃这样的条目，且不会删除文件夹外的任何内容，其消息显示从项目开始的路径。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme preview`：单模式主题的路由不再导入它不绘制的模式切换，因此启用 `noUnusedLocals` 的应用可以构建。被拒绝的 `--theme` 会准确说明省略它在此应用中的效果：预览继续使用的主题，或它在 `themes/` 下选取的唯一主题。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme preview`：Components 页面上的演示在挂载时不会获取焦点。DialogHeader 等对话框部件会显示在打开的内联 Dialog 中，打开的 Popover 会被指明。当预览的主题消失时，其 Colors 页面也随之消失。文件夹中你自己的文件导入预览页面时，`preview remove` 会拒绝，并且对由手工更改的路由，其建议是将其移出文件夹。没有预览时，`preview list` 会说明 `add` 为何会拒绝该文件夹，而不是建议它。`remove` 也会移除 `add` 在 routes 文件夹之外创建的空文件夹。每个页面模板列表建议都会按应用运行 CLI 的方式指明命令，`--json` 中和文本中都是如此。([#11453](https://github.com/meta/astryx/pull/11453))
- `astryx experimental theme preview`：只有当主题的构建仍指定它加载的字体族时才会导入基础主题的字体样式表，因此使用 `font system` 或自有字体的主题不会获取它未使用的内容。当预览切换主题时，`preview add` 会指明它重新写入的每个页面，包括 Colors 页面。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme preview`：`add --path` 会拒绝拦截式路由文件夹（`(.)x`、`(..)x`、`(..)(..)x`、`(...)x`），因为其中的页面会破坏整个应用。预览会加载其所基于主题的字体样式表（neutral 为 Figtree），`preview app` 起始项目也会如此，因此 Overview 会显示它指定的字体族。`preview list` 文本会把文件已消失的页面标记为缺失，与 `--json` 一致。([#11419](https://github.com/meta/astryx/pull/11419))
- `astryx experimental theme`：按方向区分的内边距边、失败的 show 会让文件夹保持原样，以及 `how` 对“not dark enough”的读取。([#11419](https://github.com/meta/astryx/pull/11419))

  - 在 dropdown-menu、context-menu 和 segmented-control 上，一个逻辑内边距边会为每个方向分别写入（从左到右盒子中的 left，从右到左盒子中的 right），因此只更改该边；在状态下，每个方向一条规则（`:hover:dir(ltr)`），较后的内边距或物理边会替换它。
  - 渲染失败的 `show` 会放回它触及的每个输出，移除它新建的输出，并恢复 `tokens/` 中的调色板文件。
  - `how "not dark enough"` / `"not light enough"` 要求更深或更浅，而不是单一模式。

- `astryx experimental theme editor`：卡片与其他边并存的物理内边距边、在你自己的文件夹旁失败的 show，以及来自 API 的忙锁建议。([#11419](https://github.com/meta/astryx/pull/11419))

  - 与其他边一起设置的卡片 `padding-left` 或 `padding-right`，无论是关键字（`initial`）还是算式（`calc()`），都会到达该边。
  - 渲染失败的 `show` 不会动你放在 `tokens/` 中的文件夹。
  - 当另一个命令占用主题时，重新运行的命令建议会指明该调用自身的命令及其获得的所有选项（`--only`、`--like` 和 `new` 的每个调节器、`--png`），绝不会是 API 运行所用进程的参数；等待另一个命令的预览命令会指明 `preview list`。

- `astryx experimental theme editor`：拒绝建议的每个 `set` 现在都会按 `set` 检查它的方式检查，且不写入任何内容，`set` 会拒绝的建议会被省略。建议会带上所请求的内容，而不是固定示例。`headings light --on heading` 会在一个层级上提供 `headings light` 和字重 300。`text-size large --on card` 会在卡片上提供该大小。数字 token 会读取其本意数字（`700px` 就是 700，`1,5` 就是 1.5，`calc(1rem+2px)` 会补上空格）。给文字调节器一个数字时，会提供它自己的词，或为缩放比例提供最接近的 `type` 预设。无效颜色绝不会被复制到文本颜色 token 中。颜色属性会拒绝 `color-mix()` 内不是颜色的 `var()` 回退值。`how "more washed out colors"` 会降低鲜艳度。([#11419](https://github.com/meta/astryx/pull/11419))
- 图标集：一个项目为每个图标选择一种外观。`astryx experimental icon use <main> --variant <variant>` 会在一次写入中把 `experimental.iconVariant` 写在 `experimental.iconSet` 旁边，并拒绝主图标集未声明的变体；没有 `--variant` 时会移除该键。列表中的每个集合绘制其同名变体，若未声明则绘制其默认外观，回执（`icon.use`）会加上 `variant`、`previousVariant`、`looks` 和 `themeMap`。复制的模板会在其集合具备该外观的地方导入每个图标，将外观报告为 `icons.variant`，并把模板从主集合自有库导入的图标、或从另一外观的已列出集合导入的图标（`by: 'variant'`）移到该外观。集合的生成模块还会为图标绘制的每个其他外观写入主题映射（`themeIconsFilled`），`integration check` 会要求它与 `map` 一致。当主集合未声明该变体时 `astryx doctor` 会失败，`experimental icon --list` 会显示变体和每个集合的外观。0.7.16 之前的 CLI 会拒绝设置了 `experimental.iconVariant` 的 astryx.config，因此当项目的 CLI 范围允许时 `use` 会发出警告。生成模块由较早 CLI 写入、且其图标绘制非默认外观的图标集包，在再次运行 `experimental icon add --variant <variant> --from <module> --all` 之前会无法通过 `integration check`；该发现会指明那次运行。未设置 `experimental.iconSet` 的项目不会看到变化。([#11499](https://github.com/meta/astryx/pull/11499))
- `astryx experimental theme editor` 只有在项目安装基础主题时（在其 `node_modules` 文件夹中或通过 Yarn Plug'n'Play，按应用打包器的视角）才将其计为已安装。仅通过 `NODE_PATH` 或 Node 全局文件夹找到的主题不再被视为已安装：`new` 和 `set base` 会提供安装它，而不是写入应用无法构建的主题。([#11444](https://github.com/meta/astryx/pull/11444))

#### 新功能

- 当某个已加载集成的 `@astryxdesign/core` peer 范围（已添加主题的包除外，`theme-core-peers` 已检查那些包）排除了已安装的 Core 时，`astryx doctor` 会发出警告（`integration-core-range`）。为另一个 Core 构建的包安装时只会收到包管理器警告，其组件、主题和文档可能无法正常工作；该警告会指明包名、其版本和范围以及已安装的 Core，修复建议会指明应查找的发行版本。如果项目的其他集成都声明了包含其 Core 的范围，则会得到一行通过并列出这些集成；如果没有任何集成声明范围，则不会出现新行。这只是警告，因此之前通过的项目不会失败。([#10350](https://github.com/meta/astryx/pull/10350))
- 文档示例接受可选的 `kind: 'demo' | 'setup'`（默认 `'demo'`），适用于组件、子组件和函数示例。`setup` 示例是指无法独立运行的代码，例如应用设置文件、服务器路由，或使用别处定义变量的代码片段：`astryx component <Name>` 会将其标注为“(setup, code only)”，文档站点会将其显示为不带实时预览的代码。在 `astryx component <Name> --json` 中，每个示例都会携带自己的 `kind`。其他任何值都会导致加载失败，并给出同时指明这两种类型的消息。`astryx docs authoring` 说明了何时使用 `setup`。([#11434](https://github.com/meta/astryx/pull/11434))
- 为 Table 添加无限加载，使用 `useTableInfiniteScroll({hasMore, isLoading, onLoadMore})`。一个 Promise 请求闩锁协调自动和手动加载，失败会暂停自动重试，常驻的忙碌 Button 负责进度播报和焦点连续性。([#10570](https://github.com/meta/astryx/pull/10570))

#### 修复

- 在 AI Chat 页面模板中，工件卡片上的箭头现在在从右到左布局中指向行尾，与从左到右布局一致。([#11477](https://github.com/meta/astryx/pull/11477))
- 在 AI Chat 页面模板中，消息列表的滚动条不再位于工件面板调整手柄下方。在桌面端，聊天列在手柄前保留一个小间隙，因此整条滚动条都能滚动消息；此前，按滚动条靠近手柄的那一半会调整面板大小。移动端（手柄隐藏）保持不变。([#11473](https://github.com/meta/astryx/pull/11473))
- `astryx build` 现在会更多地从页面模板开始整页创意，而不是从空的应用外壳开始。当 build 要在应用外壳上开始一个创意、且搜索没有直接匹配到模板时，一个基于 build 已经计算出的分数（外加一张固定词表）的固定决策会给出整页概率；达到 0.30 或更高时，起点就是 build 排名最高的页面模板。带有编辑短语的创意保留外壳，块建议不变。该决策只挑选 build 词表列出的模板，因此集成自带的模板永远不会成为被提升的起点；其他结果不变。([#11519](https://github.com/meta/astryx/pull/11519))
- 从已不存在的文件夹运行任何命令时，现在会给出一个普通错误，并附上 `cd` 到最近存在文件夹的提示（文本和 `--json` 皆如此，代码为 `ERR_PROJECT_REQUIRED`），而不是堆栈跟踪；`--help`、`--version` 和 `docs` 仍可正常响应。([#11440](https://github.com/meta/astryx/pull/11440))
- 当主题所扩展的主题也被添加时（`theme add d` 和 `theme add neutral`），`astryx doctor` 的主题样式表检查不再对该主题自身的文件报错：主题源、其构建产物以及编辑器生成的文件只会扩展另一个主题，因此不会要求它们导入该主题的样式表。应用文件导入已添加主题的模块却没有导入其样式表时，仍会检查失败。([#11506](https://github.com/meta/astryx/pull/11506))
- 超过管道容量（64 KiB）的拒绝消息会完整送达慢速读取方，例如 bash `$(…)` 或读取较慢的程序：`--json` 信封仍是包含其代码的有效 JSON，文本拒绝消息保留其最后一行。CLI 会在退出前写出最终错误输出。这是对共享错误输出的一处小改动，为主题编辑器的长拒绝消息而做。([#11419](https://github.com/meta/astryx/pull/11419))
- 任何公共 API 函数都不再接受未文档化的 `__` 前缀选项。`themeBuild()` 只读取其有文档的 `out`、`check` 和 `iconsSpecifier` 选项；`theme build` 传给批量、family 或包检查构建的内容现在通过 CLI 自己的内部路径传递，因此 `theme build` 和 `integration pack-check` 的行为与输出与之前完全一致。如果任何导出函数重新出现隐藏选项，测试就会失败。([#11446](https://github.com/meta/astryx/pull/11446))
- 当代码只列出环境变量的名称时（例如 TypeScript 转换所做的那样），保留的目录和检查结果不再依赖每个环境变量的值。每次调用都设置新值的工具（例如 AI agent harness）此前每次调用都会错过所有保留的答案；现在它们会像其他运行一样命中。值被读取的变量仍会决定保留的答案，包括在被另一个保留的 gather 包裹的保留 gather 内读取的变量。([#11427](https://github.com/meta/astryx/pull/11427))
- `astryx doctor integration validate` 和 `astryx integration check` 在所有平台上都用正斜杠表示不可达的贡献元数据。在 Windows 上，“Found contribution metadata ... outside every declared integration root”中的路径使用反斜杠，而同一条消息中的修复建议使用正斜杠。([#11084](https://github.com/meta/astryx/pull/11084))
- 每用户缓存中保留的条目如果值缺失或形状与其内容不符，现在会重新计算并覆盖存储，而不是继续使用：损坏的条目可能导致 `search`、`doctor` 或 `template --list` 失败，直到清除该文件夹。([#11474](https://github.com/meta/astryx/pull/11474))
- `astryx theme palette generate` 和 `generateTonalPalette()` 现在遵循 `darkChromaTaper`，因此每个官方主题调色板都能从保存的配置精确地重新生成，与提交版本一致。Neutral 的配置要求其彩色族在暗端有柔和的边缘，但生成器丢弃了该字段：Neutral 的 420 种颜色中有 99 种比已提交的颜色更饱和（`blue.dark[25]` 是 `#003978`，而不是 `#253c5a`）。现在，一个暗色阶会在 `throughStop` 之前保持其色域内色度的 `edgeMultiplier`，然后沿 smoothstep 恢复到 `recoverAtStop` 处的标准配方；`familyMultipliers` 设置单个族的边缘占比。浅色渐变、中性族、黑色和白色端点，以及没有该字段的配置，生成的颜色与之前相同。如果 taper 带有它不读取的字段、色阶超出布局、请求中不存在的族、中性族，或乘数超出 0 到 1，都会被拒绝。([#11491](https://github.com/meta/astryx/pull/11491))
- `astryx experimental render` 会说明页面为何在未给出答案的情况下结束：它所到达的阶段（例如导入页面或在服务器上渲染）、运行了多长时间、剩余内存以及页面的最后错误输出。失去通道或达到自身时间限制的页面进程会按该情况报告，绝不会报告为正常退出。([#11398](https://github.com/meta/astryx/pull/11398))
- `theme build`：对带引号的 glob 的拒绝消息在 family 运行中保留 `--family` 和 `--family-key`，并使用与 build 其他源拒绝消息相同的构建器来构建其建议；实验性 compile 对编辑器设置文件和子文件夹的拒绝消息保留 `--out`（对 `cd` 的那条消息会基于应用根目录重新计算），因此建议的检查命令会读取你所询问的输出。（对共享代码的最小改动：`buildSuggestion` 增加了一个用于 glob 或 family 运行的可选形状，build 命令会将 `--out` 传给组的预检。）([#11461](https://github.com/meta/astryx/pull/11461))
- 在 Windows 上，`astryx theme build` 打印的安装片段会用可用的路径导入构建出的主题。导入路径曾用反斜杠连接输出文件夹，并在丢弃 `src/` 后保留了一个多余的反斜杠，导致片段读作 `import { oceanTheme } from './\themes\ocean/ocean';`，这不是有效的说明符（而且 `\t` 在 JS 字符串中是制表符）。现在它在所有平台上都读作 `./themes/ocean/ocean`。([#11288](https://github.com/meta/astryx/pull/11288))
- 从项目子文件夹运行 `theme template` 和 `theme eject` 时，会打印一条在该文件夹中可用的构建步骤（当文件在其上方时，为 `cd ../.. && … theme build theme.template.ts`），并且空的模板路径会被拒绝，同时建议使用 `theme template`（不带路径），它会在项目根目录写入；绝对模板路径会被告知路径是从当前文件夹读取的。`theme build --out` 只有在所有输出都可写入后，才会警告它替换了另一个源的输出；它会将 `--out` 中的反斜杠视为文件夹分隔符；其 `--check` 的“Rebuild with”行使用项目的调用方式，并为带空格的路径加引号。用 `theme build` 构建主题编辑器创建的主题仍然可行，与已发布版本一致，但现在会警告（每个 `--watch` 会话一次），并指明 `experimental theme editor show <theme>`。如果主题文件是一个链接，且因相对导入而失败，则会以其指向的文件来命名，并用该文件的构建将其输出保留在工作文件夹中；任何加载错误都不会显示 Node 的 require 堆栈。([#11422](https://github.com/meta/astryx/pull/11422))
- `theme build`（或 `experimental theme compile`）在拒绝某个源（Windows 风格路径、文件夹、不是主题模块的文件或构建输出）后给出的建议，会保留给定的 `--check`、`--out` 和 `--icons-specifier`，因此照着执行仍然是检查而不是写入输出。这适用于 family 检查、作为链接的主题文件、普通对象 family 成员以及加载期间发生变化的文件，并且建议的命令会针对其运行的 shell 加引号（PowerShell 也一样）。([#11461](https://github.com/meta/astryx/pull/11461))
- `theme build --detail full`（以及 `experimental theme compile --detail full`）打印的安装示例会说明其路径相对于 src/ 中的文件，现在确实如此，无论从哪个文件夹运行：位于 src/ 旁边的输出（例如 `themes/ocean/ocean`）会以 `../themes/ocean/ocean` 导入，而不是 `./themes/ocean/ocean`（后者在 src/ 下无法解析）。`theme build --family` 片段使用相同的路径，并在其标题中说明同样的事情。([#11471](https://github.com/meta/astryx/pull/11471))
- `theme build` 和 `experimental theme compile` 会拒绝设置了私有 `--_*` 变量的主题：构建会以 `ERR_THEME_INVALID` 失败（退出码 1，JSON 错误信封）并且不写入任何内容，包括 `--check`。此前，它会打印错误并以退出码 1 退出，但仍会写入输出并报告 `[ok]` 和成功回执，因此读取 JSON 的人会看到通过。([#11475](https://github.com/meta/astryx/pull/11475))
- 从项目内文件夹运行的 `theme template` 会从该项目根目录内的该文件夹读取路径；不带路径时会在项目根目录写入 `theme.template.ts`，与其帮助说明一致；路径中的反斜杠会分隔文件夹，与 `theme eject` 相同；在项目根目录下运行 `astryx init --features theme` 也会在该根目录写入 `theme.template.ts`，因为它使用相同的模板步骤。在任何项目之外（该文件夹及其上方都没有 `package.json`）时，它会像已发布的 CLI 一样在当前文件夹写入，并且在写入文件时会在文本模式下的 stderr 警告一次，指明如何在项目根目录写入（在项目内运行，或先执行 `npm init -y`）；`--json` 保持静默。过期的 `theme build --check`（以及 `experimental theme compile --check`）结果会在 `upToDate: false` 旁边带有 `code: "ERR_THEME_STALE"`，即其以退出码 1 退出时使用的代码。位于 `--out` 路径、但并非由此构建写入的文件会保留，并给出真实原因；如果存在这样的路径，还会给出一个本次构建尚未有任何输出的 `--out` 路径（当主题模块旁边的位置已被占用时，是一个新文件夹）；构建从不建议删除它。构建在源旁边的建议会保留 `--icons-specifier`。对于该文件夹之外的主题源，`--out` 写入主题编辑器创建的文件夹时，会像已发布的 CLI 一样写入，并在文本模式下的 stderr 警告一次，指明如何让编辑器的文件夹只属于其自己的主题（在源旁边构建，或选择另一个 `--out`）；`--json` 保持静默，`--watch` 每个会话只打印一次，而不是每次重新构建都打印。([#11389](https://github.com/meta/astryx/pull/11389))
- `theme build --check`（以及 `experimental theme compile --check`）会把构建写入的每个输出都列为已检查，包括 `.css.d.ts` 样式表类型。当唯一缺失的输出是 `.css.d.ts` 存根时（例如将其排除在版本控制之外的项目），检查会在文本模式下打印一行指明它的警告，仅缺少该存根不会导致检查失败；`--json` 保持静默，结果不变。此前检查失败过的每个输出仍会使其失败，包括缺失的 `.d.ts` 或 `.variants.d.ts`。将 `theme eject` 到主题编辑器创建的文件夹的子文件夹中（`themes/g/sub`，其中存在 `themes/g/g.settings.json`）时，会像已发布的 CLI 一样写入，并在文本模式下的 stderr 警告一次，指明如何让编辑器的文件夹只属于其自己的主题（fork 到项目本地的 themes 文件夹，或选择编辑器文件夹之外的路径）；`--json` 保持静默，回执不变。([#11410](https://github.com/meta/astryx/pull/11410))
- 仪表板页面模板在启用 `noUncheckedIndexedAccess` 的应用中可以通过类型检查（渲染结果相同），因此 `experimental theme preview add --template dashboard` 不再向严格应用添加类型错误。`themeBuild()` 不再接受 `theme build --watch` 或私有变量退出代码的内部交接选项；`--watch` 仍会在每个会话就主题编辑器文件夹警告一次。([#11420](https://github.com/meta/astryx/pull/11420))
- `astryx theme template --overwrite` 不再替换通过链接到达其文件夹的主题编辑器文件。([#11419](https://github.com/meta/astryx/pull/11419))
- 已安装的依赖自带 Astryx 集成清单，但因缺少其所需包（`dependencies` 条目或未标记为可选的 peer）而加载失败（安装损坏）时，现在会将其报告为该包的集成问题：`component`、`template`、`theme`、`discover` 和 `search` 会打印通常的一行警告，`doctor` 的集成贡献检查会带上加载错误指明它。退出码不变。无法加载的命令也会报告原因，无论它被给了什么选项（`component --list` 以前会回答“unknown option”）。([#11486](https://github.com/meta/astryx/pull/11486))
- `astryx upgrade` 的试运行不再提示你审阅它尚未写入的 `.astryx-conflict` 文件。当复制的 ShadCN 组合与较新版本冲突时，试运行现在会说明 `--apply` 会写入该文件以供审阅，而实际 apply 仍会指明它写入的文件。JSON 结果不变。([#11356](https://github.com/meta/astryx/pull/11356))

#### 性能

- 在有集成的项目中，`docs` 会保留它收集的集成检查结果及其包含的主题记录，因此重复调用 `docs` 时会直接读回，而不是再次检查每个集成。对文档主题的编辑会在下一次调用时体现。`doctor` 的缓存行会在保留所收集内容的命令中列出 `docs`。([#11483](https://github.com/meta/astryx/pull/11483))
- 一旦每用户缓存文件夹存在，`doctor` 会将其三个只读取文件的检查（文档树、渐进式披露和 CLI 的文档）保留在 search 的目录旁边，并在其读取的每个文件未变化时读回，因此之后的 `doctor` 会跳过它们（约 0.2 秒，大型集成时更多）。任何文档的编辑都会在下一次运行时体现。其缓存行会在保留所收集内容的命令中列出 doctor，`doctor --help` 不再称其为只读。([#11394](https://github.com/meta/astryx/pull/11394))
- 在没有任何集成可以加载的项目中（没有 Astryx 配置、没有自己的集成清单，也没有自带集成清单的已安装依赖），帮助和不需要该项目的命令不再为了读取集成声明的命令而先加载它：`--help`、`manifest` 和 `blog` 的响应快了约 65 毫秒。输出不变。([#11495](https://github.com/meta/astryx/pull/11495))
- 在有集成的项目中，每个集成发现的主题会保留在 search 的目录旁边，并在其读取的每个文件未变化时读回，因此 `theme list` 和其他主题命令在后续调用时会跳过重新读取集成的主题（大型集成约 0.1 秒）。对主题或其导入模块的编辑会在下一次运行时体现。`doctor` 的缓存行会列出保留的主题记录。([#11469](https://github.com/meta/astryx/pull/11469))
- 在有集成的项目中，整个集成问题列表会保留在 search 的目录旁边（对 Core 和每个集成的模板与组件替换检查，以及每个集成自身的检查），并在其读取的每个文件未变化时读回，因此 `component`、`template`、`theme` 和 `search` 在后续调用时会跳过这些检查（大型集成每次约 0.1–0.25 秒）。([#11384](https://github.com/meta/astryx/pull/11384))
- 在有集成的项目中，模板发现的记录会保留在 search 的目录旁边，并在发现过程读取的每个文件和文件夹未变化时读回，因此 `template --list`、`template <name>` 和 `build` 在后续调用时会跳过模板发现（大型集成约 0.1 秒），集成中新增、重命名或编辑的模板会在下一次调用时体现。无法精确读回的记录（函数、Map、共享对象、-0 等）永远不会被保留。`doctor` 的缓存行会列出模板发现的记录。([#11393](https://github.com/meta/astryx/pull/11393))
- 导入 `@astryxdesign/cli/api`（集成 codemod 和其他集成代码会这样做）不再提前加载 Babel、recast、jscodeshift 和 postcss-selector-parser：每个都在首次使用时加载（每次导入约快 0.25 秒，少加载 350 个模块）。API 的导出不变。([#11432](https://github.com/meta/astryx/pull/11432))
- `component --list` 查找没有自己文件夹的组件时快了约 20 毫秒：Core 文件夹的一个索引替代了对每个文件夹的逐一检查。输出不变。([#11504](https://github.com/meta/astryx/pull/11504))
- 已发布的 CLI 会从发布时存储的值读取其附带的图标定义和内置主题描述符，而不是解析每个文件，因此 `docs` 的响应快了约 45 毫秒，`doctor` 和 `theme list` 快了约 10 毫秒。编辑过或未知的描述符仍像以前一样解析。输出不变。([#11496](https://github.com/meta/astryx/pull/11496))
- `experimental theme` 命令在构建 Core 的组件文档时只读取 Core 源中的每个文件夹一次。`experimental theme preview app` 和 `experimental theme preview add` 在编写 Overview 和 Components 页面时也这样做，而不是每个组件名读取一次。每次运行写入和打印的内容都相同。([#11426](https://github.com/meta/astryx/pull/11426))

#### 文档

- CLI 会在每次提及时标注“实验性”，引导 agent 和用户使用实验性主题编辑器来创建或修改主题：`astryx init` 写入的 agent 块（其一行主题内容，也保留在 eject 前继续扩展已导入主题以便 fork）、`astryx init` 下一步中的新增一行（其他步骤保留）、`astryx --help`、主题文档（`astryx docs theme`、主题编写指南，英文和中文）以及 `theme` 命令的帮助和摘要，都会指名 `astryx experimental theme editor new <name> --like neutral`，然后是 `editor set` / `editor how`、`theme add <name>` 来接入，以及 `editor show <name> --png` 来查看每次更改。`theme eject` 增加一行：`experimental theme editor new <name> --like <base>`（当被 eject 的主题是编辑器认识的内置基础且其包已安装时，使用该主题，否则使用 `neutral`）；`theme palette generate` 增加一行：`experimental theme editor set <name> accent <color>`。([#11500](https://github.com/meta/astryx/pull/11500))
- 为 `useOutlineFromDOM` 添加 Hook 文档，因此 `astryx hook useOutlineFromDOM` 和 `astryx search` 会返回它，并新增一个 `useOutlineFromDOM — Article` 示例块：一个 article 和通过该 Hook 根据其标题构建的 Outline，以及一个添加节及其链接条目的按钮。([#11234](https://github.com/meta/astryx/pull/11234))
- MetadataList 的指南现在说明辅助技术会读取每个标签及其值，并且标题不会命名该列表或添加标题。其 prop 文档现在列出 `className` 和 `style`，`label` 文档说明 `position: 'start'` 会将标签放在其值的行内起始位置，而不是左侧。([#11391](https://github.com/meta/astryx/pull/11391))
- `astryx docs styling/tokens-and-setup` 新增了 Next.js 配合 webpack 一节。它展示了 `next.config.mjs` 中的 `experimental.optimizePackageImports: ['@astryxdesign/core']`，并建议在 Server Components 中使用组件入口，例如 `@astryxdesign/core/Button`。两者都不使用，webpack 构建就会把每个 Astryx 客户端组件打包到一个由 Server Component 从包根导入的页面。`astryx experimental theme preview app` 复制的主题预览起始应用也有相同设置。无 API 变更。([#11305](https://github.com/meta/astryx/pull/11305))
- 一个新的示例块展示了 `useTableColumnsVirtualization`：一个 121 列的 Table，第一列固定，只挂载其水平滚动位置附近的列。([#11014](https://github.com/meta/astryx/pull/11014))

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @charlie5188
- @cixzhang
- @HelloOjasMutreja
- @humbertovirtudes
- @josephfarina
- @korkt-kim
- @parinith-web
- @popsiclelmlm
- @prath47
- @vjeux

---

# 0.7.15

#### 实验性 API

- `astryx experimental theme`：组件目录和全组件表现在根据每个组件的文档 playground 构建。覆盖层显示为打开状态，每个组件显示其变体、其选中和禁用状态，以及标题的层级。编辑器中这些演示的自身副本已移除。列出多个元素的 playground 默认值现在可以渲染，因此编辑器现在知道单选列表、步进器、轮播和类似组件读取的 token。(#11350)
- `astryx experimental theme editor`：颜色和字体保持安全，并说明其作用。(#11244)

  - 撤销永远不会删除你手动编辑过的生成颜色文件（`tokens/<theme>.palette.ts`）。该文件会保留，结果中会指明它。主题只读取选定色阶文件（`tokens/<theme>.palette-refs.ts`），编辑器每次更改都会从生成器写入该文件，因此对调色板文件的手动编辑永远不会显示；结果会说明这一点。
  - 为某一模式设置的聚焦颜色（`--focus-outline-color`）或任何其他颜色 token 不再锁定主题。后续每个命令都会按它实际的颜色来检查。
  - 只有当颜色文件中的颜色不同时，才计为已编辑。格式、字节顺序标记、分号，或没有回执的对 `palette.config.json` 的手动编辑都不计入。当编辑阻止了颜色更改时，拒绝消息会说明如何保留或丢弃它，并指明接下来要运行的命令。
  - 精确主色（`--color-accent` 以及其他填充色、淡色和 on-color）在你设置时会报告它对周围的影响，包括浅色页面检查。
  - 强调色淡色保持在官方色阶。位于其上的部件（选中项和行、拖放区、编号引用）以及分段控件标签（位于中性轨道上）上的次要文本会被提升——与官方 Neutral 主题的提升方式一致——提升到在该处以及悬停状态下达到 4.5:1 对比度的最近灰色：优先使用中性色的色阶，否则从基础主题自身的次要文本扩展出灰色，因此每种强调色都能获得该处理。为整个主题或其中某个部件设置的精确 `--color-text-secondary` 会按模式在此处胜出。对比度检查会以这些部件显示的文字在 4.5:1 下进行测量。
  - 在浅色页面本身为深色的基础主题（Gothic）上，颜色在浅色模式下也会采用为深色页面准备的色阶，因此文字可以在其上阅读。透明的精确颜色（悬停淡色、填充色）会按其显示在表面上的效果来测量。
  - 在没有 85 色阶的布局上，浅色强调淡色会采用更浅的相邻色阶。色阶显示时会取整。
  - `font inherit` 及其他 CSS 关键字会被拒绝，因为浏览器会丢弃整个字体。通用字族（`serif`、`system-ui`）和常见的桌面字体（Arial、Segoe UI）计为系统字体，回退字体永远不会重复该字族。不是纯 CSS 名称的字族名（`3Dumb`、`My/Font`）会加引号，`@fontsource/<font>` 会指明其预设。

- `astryx experimental theme editor`：每个 CSS 数学函数都会按其类型读取，字体会根据主题构建自身的列表来判断。(#11350)

  - 在结果类型合适的地方，接受 `pow()`、`sqrt()`、`hypot()`、`log()`、`exp()`、三角函数、`mod()`、`rem()`、`abs()`、`sign()` 和 `round()`；`sqrt(4px)` 和 `mod(10px, 3s)` 会被拒绝。
  - 哪些系统字体无需安装来自 `astryx theme build` 用于警告的列表，保持不变；编辑器只知道其中哪些仅随某一系统提供。
  - `font more` 会指明可用的命令。
  - 颜色内部的数学计算也会检查（`rgb(calc(1px) 0 0)` 会被拒绝），并且 `color-mix()` 至少需要一种颜色的占比。`calc(1fr)` 会被拒绝，因为数学计算不接受 `fr`。
  - 只被宽度和偏移读取的 token（`--border-width`、`--focus-outline-width`）会拒绝百分比，因为这些属性会丢弃百分比。
  - 仅随某一系统提供的字体会说明是哪个系统（`"Segoe UI" ships only on Windows`），而不是称其为非系统字体。
  - 检查手动编辑的设置模块时，会读取使用 Windows 行尾的文件。

- `astryx experimental theme editor`：所有关于字体和部件颜色的拒绝都会指明一个可用的命令。(#11350)

  - 以其他大小写输入的 dial（`Font`、`FONT`）会按该 dial 来回答。
  - 部件上的 CSS `font` 简写（`bold 16px/1.5 Georgia, serif`）会被拆分为要设置的各个长属性，每个属性一条命令。
  - 建议永远不会用 MDN 的说明代替一个值（`dependsOnUserAgent`）。
  - 部件颜色属性上的错误颜色会建议一个可用的颜色。

- `astryx experimental theme editor`：带逗号的按模式部件颜色、双模式值以及所有 `color()` 色彩空间。(#11350)

  - 先为一个模式设置部件颜色、再为另一个模式设置时，无论顺序如何，包含逗号的颜色（`rgb(0, 0, 255)`）都会保持完整。
  - 已经同时给出两种模式的值（`light-dark(…)`）会连同 `--mode` 一起被拒绝；请去掉 `--mode`。
  - 颜色 dial 会读取 CSS 的所有 `color()` 空间：rec2020、a98-rgb、prophoto-rgb 和 xyz，以及 srgb 和 display-p3。

- `astryx experimental theme editor`：部件上的字体简写完整拆分，颜色混合可读取。(#11350)

  - 部件上的 CSS `font` 值会被拆分为它包含的每个长属性（`font-variant-caps small-caps`、`font-stretch condensed`、样式、粗细、大小、行高、字族）。单独的关键字会归入其对应的长属性（`bold` 是 `font-weight bold`），绝不会归入 `font-family`；系统字体关键字（`caption`）会得到一个可用的字族。
  - 在 srgb、srgb-linear、xyz、oklab 或 oklch 中两种固定颜色的 `color-mix()` 会计算出其结果颜色，因此颜色 dial 可以接受它。编辑器无法计算出的混合会说明这一点，并要求提供混合后的颜色。

- `astryx experimental theme editor`：浏览器会丢弃的值会被拒绝，类型和字体设置会按其说明工作。(#11350)

  - 已安装的 `@fontsource/<font>` 包总是会加载其命名的字体。
  - `calc()` 及其他数学函数内部的数学必须合理（`calc(1px banana)` 会被拒绝）。
  - 时长或缓动 token 只接受一个值，绝不接受列表。
  - 行高 `0` 会被接受。
  - 无论是否使用颜色 dial，精确的 `--color-text-secondary` 都会作用于提升次要文本的部件。
  - 仅为正文设置的字体保留标题的字体。
  - 在执行 `font <x> --on body` 之后，后续命令继续正常工作。
  - 超过最后一个文字大小档位的 `more` 或 `less` 会被拒绝，而不是朝相反方向变化。
  - 若某个 dial 的 token 已被精确设置占用，会说明这一点。
  - 只有基础主题的部件样式读取的 token 不再被称为未使用。

- `astryx experimental theme editor`：`set` 接受的内容总能加载，主题会保留其显示的颜色。(#11350)

  - 主题无法加载的设置在你设置时会被拒绝，例如带 `!important` 或注释的字体。
  - 部件上小于 0 的边框或轮廓宽度、小于 0 的时长，以及带括号的未加引号 url 都会被拒绝。
  - 将主题切换为仅浅色或仅深色时，会列出另一种模式下的访问者会丢失的颜色。
  - 如果更改后颜色、模式和基础主题保持原样，则保留主题已经显示的色阶，因此早期编辑器构建的主题会保留其颜色，撤销可以恢复它们。下一次颜色更改会按当前规则映射每种颜色。

- `astryx experimental theme editor`：早期编辑器构建的主题在第一次更改时就能得到正确的颜色。(#11350)

  - 在根据颜色文件构建主题之前，会先更新这些文件。对此类主题更改字体或圆角不再移动其颜色，下一次更改也不会再移回去。
  - `filter` 和 `backdrop-filter` 只接受浏览器可读取的值；`filter banana` 会被拒绝。
  - 仅为代码设置的字体回退到等宽字体。

- `astryx experimental theme editor`：数学、关键字和字体按浏览器的读取方式检查。(#11350)

  - `calc()` 及其他数学函数中的数学必须按相同类型相加，并给出值所需的类型。`calc(4px + 2)`、`calc(10px / 2px)` 和 `padding calc(1s)` 会被拒绝。
  - token 永远不接受 CSS 全局关键字（`--font-family-body inherit`）：这会使该 token 为空。
  - 仅随某一系统提供的字体（Segoe UI、Consolas、Menlo、Helvetica Neue、Roboto）会如此标明。
  - `font` 会拒绝 `var()`，并指明该角色接受它的 token。`font geist-sans` 是 `geist` 预设，`text-size Medium` 会建议 `medium`。
  - 对生成的设置模块的手动编辑会按该模块所述，根据设置重新构建覆盖，而不是被下一次更改保留。
  - `how font` 不再说正文字体会移动标题。

- `astryx experimental theme editor how`：数字词、输入的 token 名称以及用动作表述的状态。(#11350)

  - 用文字书写的数字会被读取：“zero radius everywhere”是直角，“twelve pixel corners”是 12px，“a two pixel border”是 2px，“forty pixels tall”、“a quarter rem”、“one and a half line height”。
  - “least”、“minimum”、“as little as possible”和“barely any”表示更少；“maximum roundness”是胶囊形。
  - 按名称带值输入的 token（“--focus-outline-width: 3px”、“--color-background-card to #fafafa in light mode”）会被精确设置。不存在的 token 名称会被拒绝，并给出最接近的名称，绝不会用另一个 token 来回答。
  - 用动作表述的状态会保留该状态：hover、click 和 press（active）、typing 和 tabbing to（focus）、“after I check”（checked）、“picked”（selected）。“Tab to”不再指 tab 部件，链接在某一状态下的颜色会为该状态设置。
  - “Cards the same radius as buttons”会让卡片使用按钮读取的 token；“buttons twice as round as inputs”会更改按钮；“the same color as the danger color”会使用该颜色的 token。
  - “Shouldn't links be underlined?”是在要求下划线。
  - 粘贴的 `h1, h2, h3 { … }` 会包含 h1。

- `astryx experimental theme editor how`：模式短语会限定请求的作用范围，输入的 token 只有在真实存在时才会被读取。(#11350)

  - “In dark mode only, cards #111111”会在深色模式下设置卡片；只有当请求涉及主题的模式时，主题才会变为仅深色。仅指明模式的从句会限定其后每个从句的作用范围。“Daytime”是浅色模式；“at night”、“night mode”和“OLED”是深色模式（单独的“day”或“night”不是模式）；“dark: …, light: …”会分别设置每种模式，为不同模式设置两个值并不矛盾。
  - 在问题开头输入的 token 会被精确设置；不是 token 的类标志词（`--like`、`--value`）会按普通文字读取，而后面的从句中的真实 token（“and set --border-width 2px”）会加入其他更改。带引号的字体栈保留其引号。
  - “No more than 2px borders”和“at most 2px”是 2px，而不是没有。
  - 没有部件名称的“Error text”和“labels”会给出查找结果，绝不会更改整个主题的文本。

- `astryx experimental theme editor how`：部件列表、撤销措辞以及方向词旁的输入数字。(#11350)

  - 请求前列出的部件都会应用该请求：“cards and dialogs with no shadow”、“tooltips and toasts black”。“Less padding on cards but more on buttons”会分别按各自方式回答两者。
  - “Every part bold except body text”会使标题加粗，正文保持不变。
  - “Remove my accent override”、“revert the cards to default”、“I set the accent to red by mistake”和“put the card shadows back”会通过撤销收回主题设置的相应内容。
  - 方向词旁输入的数字就是值：“thicker focus outline, 4px”是 4px，“bigger tap targets, at least 44px”是最小高度 44px，“8 or so px”是 8px。

- `astryx experimental theme editor how`：列表、多个颜色和按模式的颜色。(#11229)

  - 问题的每一行，以及项目符号或编号列表的每一项，都是独立的请求。某一行的“no”绝不会影响到下一行。
  - 一个问题中的多个颜色都会保留：“accent #0ea5e9; danger #ef4444; success #22c55e”会设置全部三个。十六进制颜色会与其词绑定，无论出现在词前还是词后（“#0d6efd primary”），“bg=#fff text=#000”会按颜色拆分，“primary”是强调色。“Secondary”没有自己的设置，因此会作为次要按钮的填充色提供。
  - `how` 计算出的颜色（更暗、更亮、更高对比度、更强边框、更深覆盖层）会按模式分别设置，每个都基于该模式自己的值，因此深色模式会保留浅色文字。“More contrast”会在浅色和深色模式下生效，并会说明这一点。“Fails contrast on white”绝不会选择白色。已经处于最高对比度的文字会说明这一点，而不是什么都不改。
  - CSS 属性名称会按其属性读取：`letter-spacing`、`line-height`、`font-size`、`font-weight`。
  - 更好的语义：“drop shadow: x 0, y 4, blur 6, spread -1, <color>”会设置该阴影；“ditch”会移除；“revert the rounded corners”会收回主题已有的圆角设置；“swap A for B”会请求 B；半径为 0 是直角；“12 pixels”正好是 12px；“taller (44px)”会设置该高度；“too warm”会使灰色更冷；没有记录填充色的部件会通过亮度滤镜变暗或变亮。
  - 输入的值会保留：写成“from A to B”的渐变、多层阴影、带引号的字体名以及“font”一词之前的字体名。不是字体名的引号文本会按普通文字读取。
  - 部件：表格表头、错误横幅（`--when status:error`）、“button color”作为文字颜色。问题中的标记和注释文本会被忽略。
  - 按钮、卡片、圆角、阴影、移除和强调色的意大利语、西班牙语、韩语、俄语、阿拉伯语和印地语词会被读取；“y”、“et”、“und”和“и”会连接两个请求。
  - 一个答案中给出两次的步骤只运行一次。仅当有可撤销的更改时才会建议 `undo`。
  - 当 `font --on body` 也更改标题字体时（主题未设置标题字体），`how font` 会说明这一点，正文字体问题会使用 `--font-family-body`。
  - 没有命令的答案会说明原因。错误建议中的命令在 JSON 中与文本中以相同方式开头。

- `astryx experimental theme editor how`：“swap A for B”和“replace A with B”仅在 A 和 B 同为颜色或同为字体时才请求 B。“Replace the shadow on cards with a border”会移除阴影并添加边框，“switch off”或“switch the buttons to”不再指名 Switch 组件。(#11262)
- `astryx experimental theme editor how`：方向正确、完整字体名，以及从任意文件夹访问应用的主题。(#11262)

  - 极性：“flat cards”会移除卡片的阴影（“too flat”会添加阴影）；“not round enough”是更圆；“nothing rounded except avatars”是直角但头像为圆形；“shadows too strong”是更柔和；“borders too dark”是更淡，“too light”是更强（按模式）；“not so much padding”是更少。
  - 两个词的“Border radius”是圆角半径，绝不是边框宽度。为整个主题设置 rem 或 em 半径时会转换为像素（0.75rem 是 12px），`%` 半径保留其 `%`。“button padding 8”是 8px。
  - 多个词的字体名会保留：随附字体使用其完整名称（DM Sans、IBM Plex Sans、Geist Mono、JetBrains Mono），其他名称按输入保留（Roboto Mono、Source Sans 3）。“Sans-serif”绝不会被读作 serif。
  - “Off-white”是 #fafafa。“Headings too big”会更改标题字号比例。“#e5e5e5 not pure white”会设置 #e5e5e5。
  - “1) … 2) …”标记和“Feedback round 2”不是值。`primary=#7c3aed radius=10 font=Geist` 会读取每个键值对。“Body text 16px”是文字大小。
  - 链接的颜色是 `--color-text-accent`，即链接读取的 token；答案会说明它也会为其他强调文本着色。
  - 部件：表格单元格、菜单项、单选按钮、文本区域、选择框、骨架屏和弹出层。部件前的变体词（“success badge”）会添加 `--when variant:success`。“Card and Dialog”会回答两者。“Match the header to the sidebar”会更改页眉。“serif headings”之后的阴影请求针对主题，tab 的文字颜色作用于 tab。
  - “What does spacing more do”是查询。一个问题中的浅色和深色值会分别设置每种模式。“I hate the purple, make it orange”会设置强调色。
  - 如果输入的文本颜色在某一模式的页面上会难以阅读，则只会在另一模式下设置，除非问题要求所有模式或同时设置了页面。一个序列绝不会把赋予文本的颜色也赋予页面。
  - 从应用的子文件夹运行 `how` 能像其他编辑器命令一样找到应用的主题；从那里指定的图片仍会打开。

- `astryx experimental theme editor how`：从应用子文件夹指定的图片会从该文件夹打开。结束句子的数字（“Use radius 8. Shadows off.”）是值，不是列表标记；只有“N)”，或位于行首或分号后的“N.”，才会开始一个列表项。“Shadows off”和“borders off”会移除它们。(#11303)
- `astryx experimental theme editor how`：具名 CSS 属性、完整保留的输入值，以及它无法命名的部件。(#11350)

  - 问题中具名的 CSS 属性会按名称设置，其值会根据该属性的语法检查：`caret-color`、`outline-offset`、`text-shadow`、`accent-color`、`text-underline-offset`、`font-variant-numeric`、`text-wrap`、`transition`、`padding-block`，以及 `set` 接受的任何属性。它绝不会被替换成另一个属性。
  - 输入的值会完整保留：`clamp()`、`calc()`、`color-mix()`、四值圆角、`line-height: normal`。字号 0 会被按名称拒绝。
  - “Modal”重新指向 dialog；“carrd”和“caard”会纠正为 card，“lines”不再被纠正为“links”。
  - 输入的颜色就是目标：“too bright, use #b91c1c”会设置 #b91c1c。
  - 灰色色阶会被读取（“gray-50”、“zinc-900”、“slate 100”、“neutral-200”）；“subtle gray”是浅灰色；“charcoal text instead of black”会设置炭灰色。
  - 任何机器都有的字体（Arial、Menlo、Times New Roman、Helvetica Neue、SF Pro）和输入的名称（Plus Jakarta Sans、Noto Sans、Fira Code）会按名称设置；“the default Mac font”是系统字体。
  - “menu”、“select”、“list”、“divider”和“footer”会指明其部件，“combobox”（复杂选择器）和“accordion”（可折叠项）也是如此。how 无法命名的部件词（“image”）会得到最接近的部件和一次查询，绝不会做整个主题的更改。
  - “too shadowy”是更柔和。“On focus”会作用于下一个从句；“night mode”是深色模式；“dark by default”是仅深色主题；“lift it with a bigger shadow”仅指悬停阴影；“ON: CARD”指明部件；“the cards and the dialogs both”会同时回答两者。
  - 名称带空格的图片（如 macOS 命名截图的方式）会被读取为图片。
  - 关于工具本身的问题会得到能回答它的命令：help、“list every dial”、“which token sets the page background?”、“explain text-size”、“how do I see my changes”、“difference between corners and border-radius”。
  - 圆角查询的示例是一个其变化可见的 token。

- `astryx experimental theme editor how`：输入的值无需冒号即可胜出，词语会按正确方向读取。(#11350)

  - 渐变内或颜色后的百分比绝不是不透明度；“50% opacity”仍然是。带色标的输入渐变（“#2563eb 0% to #9333ea 100%”）会保留。
  - 属性词之后输入的值会完整使用，无论是否有冒号：渐变、`opacity 0.5`、`border 0`、`border color transparent`、`light-dark()`、`var()`、`margin 16px`、`filter: blur(2px)`、`backdrop-filter blur(8px)`、双层阴影。属性名绝不会挑选部件（“backdrop-filter”不是 backdrop）。属性无法接受的值（“padding NaNpx”）会被按名称拒绝，字号 0 也是如此。
  - `drop-shadow()` 按输入保留。
  - “halve”、“half”、“cut in half”和“x0.8”表示更少；“twice”和“double”表示更多。“0.5 rem”、“1.5 em”、“14 px”是一个长度。
  - 带设置的“reset”、“revert”、“back to default”、“what it was”、“clear the override”会用 `undo <theme> <setting>` 收回它，或者说主题没有设置它。
  - “lighten up”是更亮，“tighten”是更紧的字距，“knock the contrast down”是更低对比度，“open up the leading”是行高，“the gray text fails contrast, darken it”会加深次要文本。仅描述问题的从句（“the hierarchy is flat”）不是更改；“or maybe not. actually yes”会保留请求。
  - “heading color”是文字颜色。accordion、combobox 和 notification 会指明其部件；不匹配任何内容的部件列表会列出使用该词的组件的部件。“error toasts”会添加 `--when type:error`，“read-only”是 readonly 状态，“loading”或“unchecked”会说该部件没有这种状态。
  - 诸如 tomato 的 CSS 具名颜色会被读取。

- `astryx experimental theme editor how`：完整的边框值、图层不透明度，以及正确类型的更改。(#11350)

  - 边框或轮廓值要么完整，要么归入正确的长属性：“card border 2px”会设置 `border-width`（没有线型的边框不绘制任何内容），“border width 2px”和“border bottom width 2px”会设置这些属性，“border 0 0 2px”会保留全部四个宽度，带颜色的宽度会得到实线，“text-decoration #2563eb”会设置 `text-decoration-color`。“border width”绝不会设置部件的宽度。
  - “shadow opacity 0.2”会设置阴影的 alpha，“background opacity”或“border opacity”会使该图层透明，绝不会使整个部件透明。
  - 字体名优先于 dial 词：“Space Grotesk headings”和“headings in Space Mono”会设置字体。
  - 否定会保留：“should not shrink when pressed”是不缩放，“but not bold”是常规字重，“why are my headings not bold”是在要求加粗。
  - 正确类型的更改：“thinner body text”是更轻的字重；“faster hover transitions”会设置 `transition-duration`；“turn off all animations”和“transition duration 300ms everywhere”会设置共享的时长 token；没有自身动效或没有填充的部件（spinner）会说明这一点；“dim the white text”会使其变暗；“a border instead of a shadow”会移除阴影并添加边框；“button press scale 0.98”会在按下时缩放。
  - 磅值会被读取（11pt 是 15px），rem 文字大小会以像素读取。
  - 标题的颜色来自其 prop，需用 `--color-text-primary --on heading` 设置；“headings red”是文字颜色。
  - divider 是一个部件：其粗细和颜色是 divider 上的 `--border-width` 和 `--color-border`。
  - “go back to the neutral theme”会收回每个设置，每个设置一次撤销。
  - 小型大写字母、表格数字、平衡的标题行、“I can barely see the borders”和“hover does nothing visible”会被读取；关于使用、重命名、版本、文件和手动编辑的工具问题会得到能回答它们的命令。
  - 完全透明的图片会被拒绝：它没有可见颜色。

- `astryx experimental theme editor how`：问题可以用 Core 目录中的任何主题化目标名称（“drawer”、“date range input”）来指明部件，这些名称从 Core 读取，而不是来自其自己的列表；短语、组和变体词仍作为覆盖项。接近但不匹配的会使用 CLI 的共享编辑距离进行纠正。(#11350)
- `astryx experimental theme editor how`：“day”仅在模式短语中（“daytime”、“day mode”、“in the day”）表示浅色模式，因此“the selected day in the calendar”或“all day”不再将更改限定为浅色模式；后面的从句中输入的 token（“and set --shadow-high 0 4px 12px black”）会保留其完整值。(#11350)
- `astryx experimental theme`：第十轮修复。(#11350)

  - `--state disabled` 会按 Core 标记的方式（`aria-disabled` 以及 `:disabled`）为禁用的按钮、链接或 tab 设置样式。从不接受焦点或激活状态的部件上的相应状态会被拒绝。
  - 单独设置组内成员的间距档位时，会从组的值开始。拒绝消息会尽可能保留所有作用域标志（`--when`、`--state`、`--only`）。值内的制表符是空白。
  - 撤销精确属性时会指明之后生效的 dial。`font var(...)` 的拒绝只会建议一个可用的命令。Windows 保留的名称（`con`、`nul`、`com1`）会被拒绝，并给出一个可用的名称。
  - 编辑器主题的 `compile` 会从文件、从任意文件夹找到主题，绝不会将 `src/themes/<name>` 文件夹误认为主题。损坏的设置文件会作为普通错误被拒绝。其建议在 JSON 中也按打印内容运行。
  - 对编辑器主题执行 list、add、use、remove 和 eject 的拒绝消息会说明如何使用其模块，并且不要编辑生成的 themes 模块。

- `astryx experimental theme`：第十一轮修复。(#11350)

  - 与编辑器主题同名的本地主题保持稳定消息。Compile 只保护编辑器自己的文件，包括通过链接文件夹访问的文件。对编辑器主题的拒绝会显示一个可运行的合并片段，并附上其样式表。
  - 只有一个主题的列表会指明每个主题。在 pill 处执行 `corners more` 和在 square 处执行 `less` 不会写入任何内容。`buttons` 或 `surfaces` 上的圆角词会指明 corners dial。
  - 错误的属性值会在同一作用域内建议该属性接受的值（`no-wrap` → `nowrap`）。
  - 从不标记为禁用的部件上，`--state disabled` 会被拒绝。内部没有任何元素接受焦点的地方，`focus-within` 会被拒绝。`how <part>` 只列出 `set` 在该处接受的状态。
  - 选项错误会建议一个帮助命令，该命令在 JSON 中也按打印内容运行。

- `astryx experimental theme`：构建按其内容判断，绝不按文件时间判断，因此再次保存的设置模块（保存时格式化、检出）不再使 `compile --check` 失败，`preview app --theme` 会复制与其设置匹配的构建，而无需重新构建。tab 上的 `--state disabled` 会按 Core 标记的方式为其设置样式。(#11350)
- `astryx experimental theme`：第三轮修复。(#11262)

  - 保存的设置会在加载时按 `set` 检查它们的方式检查，包括其作用位置。编辑器不再接受的每个设置都会列出，并附上移除它的命令。无论列出多少条，每条命令都能单独工作。不被接受的设置永远不会进入构建。
  - `corners more` 和 `less` 会以任何单位读取基础主题的半径。保存的圆角值必须是档位或像素大小。
  - `undo <theme> base` 和 `undo <theme> mode` 会回到主题创建时的状态。`undo <theme> headings weight|tracking` 会移除该部分。给 `undo` 的值会按 `set` 读取它的方式比较。`undo <theme> <thing> <part>` 会指明 `--on <part>`。空的 `--on`、`--when`、`--state` 或 `--mode` 会被拒绝。
  - 如果组设置隐藏了某个值，再次设置该值会将其移到最后，从而使其胜出。不产生任何变化的更改不会写入任何内容，包括预览。较新的 `background` 会在每个变体上胜过较旧的 `background-color`。文本、标题或链接上的颜色会被拒绝，并指明文字颜色 token，因为颜色 prop 决定它。带引号的字符串可以包含 `<` 或 `>`，值可以跨行。
  - 不再扩展其设置的 `<theme>.theme.ts` 会被拒绝，`show` 会说明这一点。内置主题的名称会被 `new` 拒绝。手写或 eject 出的主题会得到编辑器的明确拒绝。在这两种情况下，拒绝都会给出一个可用的命令。
  - `show` 会重新构建损坏的构建并说明这一点，`show --section --png` 会为该节的独立表拍照。损坏的 `palette.config.json` 会根据设置重新生成，其文本会保留为 `palette.config.damaged.json`。预览路由会为 `b-2` 之类的名称编译。`preview.html` 在每次构建中都相同，仅大小写变化不会被列为 token 更改。
  - 拒绝消息会将控制字符显示为转义形式。建议的命令会针对任何 shell 为其词加引号，并填入真实值。拼写错误的属性会指向该属性。
  - 在 `experimental theme` 中，移动或拼写错误的子命令会指明其现在的位置。单独一个组会用其帮助回答 `--json`。`--detail compact` 和 `--dense` 只打印状态行。`compile` 会拒绝编辑器自己的设置文件，并拒绝为编辑器主题使用 `--family`。`compile --check` 会按编辑器规则检查编辑器主题，并等待进行中的更改。编辑器的构建写入与 `compile` 相同的头。编译错误和过期检查会指明实验性命令，绝不会更改你输入的文本。`add`、`use`、`remove` 和 `eject` 会解释什么是编辑器主题。

- `astryx experimental theme`：第四轮修复。(#11303)

  - 主题锁就是发行缓存的锁，在命令运行期间持续续期，因此长时间构建绝不会被另一台计算机或容器接管。该锁和部件数据缓存来自同一个 node_modules。
  - 圆角会保持基础主题各半径之间的比例，因此向上调档绝不会使容器或页面半径变小。向上调整刻度绝不会使任何半径变小，包括内圆角。部件上的档位会移动到该部件显示得更大或更小的下一档。覆盖较早部件设置的组设置会说明这一点，`show` 会将部件设置标记为未显示。
  - 表示某个值的词会指明该值（`surfaces elevated` 会建议 raised）。`how base` 会列出已安装的基础主题，并用其安装行指明其余的基础主题。属性不接受的值（`display flexx`、`padding auto`）会被拒绝。替代按模式值的普通值会说明它替代了哪些值。
  - 自构建以来更新过的基础主题会被发现，并重新构建主题。文件应放置的位置是文件夹时会被拒绝。缺少 React 时，`show` 仍会列出设置并构建主题，跳过页面和图片，并指明安装行。已停止的命令留下的编辑器临时文件会被移除。

- `astryx experimental theme`：第五轮修复。(#11303)

  - 持有者停止续期的主题锁会在 30 秒后被接管，无论它指明的是哪台计算机；接管前一刻续期或获取的锁会被放回。`compile` 在构建或检查编辑器主题期间持有其锁。编辑器的缓存保留在项目的 node_modules 中。
  - 圆角档位会给部件与它给该部件读取的半径 token 相同的值，pill 会让复选框保持直角，以任何方式书写的圆角大小都会被直接读取。不产生可见效果的地方会拒绝间距，控件至少保持 24px。
  - 不存在的部件、状态或变体上的保存设置会被拒绝，并给出移除它们的撤销命令。损坏的模式或基础主题可通过设置它来修复。文字对比度会针对部件的每个变体测量。
  - 单模式主题会更改构建。按模式的颜色会在另一模式下保留为颜色。主题旁边的大文件永远不会被读取。灰色之后的撤销会写入相同的字节。已停止命令留下的渲染文件夹会在十分钟后被移除。损坏的调色板配置只会由执行写入的命令复制到一旁，结果会指明该副本。

- `astryx experimental theme`：审查后续修复。(#11303)

  - 部件上的圆角档位会移动到该部件显示得更大或更小的下一档，计入覆盖它的组设置，`show` 会报告构建写入的半径。
  - CSS 值会根据属性语法检查，因此 `12pt`、`stretch` 和 `env()` 等有效值会被接受，只有 `var()` 的值在任何属性上都会被接受，浏览器会丢弃的值会被拒绝，并给出一个可用的值。
  - 在部件上为某一模式设置的颜色，在另一模式下会保留基础主题自己的值。文字对比度读取相同的值。
  - 编辑器不再接受的每个保存设置都会被指明，并且在其他设置仍保存时，每条建议的撤销都能工作。
  - CLI 现在依赖 `css-tree` 进行这些检查。它为安装增加了约 2.09 MB 的解压空间（css-tree 1.36 MB 及其 `mdn-data` 0.73 MB），仅在编辑器检查 CSS 值时加载；其他任何命令都不加载它，启动时间不变。
  - `show` 仅在缺少 React 时建议安装 React，忙碌消息会说明另一个命令已持锁多久。

- `astryx experimental theme`：第六轮修复。(#11350)

  - 绝不会从仍在运行的命令夺取主题锁：既不会从同一台计算机上的容器中的命令夺取，也不会从仅被暂停的命令夺取。在暂停期间失去锁的命令不会再写入任何内容，并会让文件保持取得锁的命令留下的状态。
  - 设置被删除或损坏、或由已停止的 `new` 留下的主题，会由 `new` 带上其名称重新创建。你自己的文件会保留，损坏的文件也会保留，`undo` 可退回到较早的设置。
  - `show` 会重新构建被截断的样式表，并指明被截到窗口的图片。演示图片从磁盘打开。残留的临时文件会被移除。
  - 对错误参数、损坏或缺失的主题文件、忙碌的主题以及缺失项目的拒绝，都会给出一个可运行的命令。

- `astryx experimental theme`：第七轮修复。(#11350)

  - 形状错误的设置会像损坏的设置一样被恢复：带主题名称的 `new` 会重新创建它并保留文件。恢复文件夹的 `new` 在通过所有检查之前不会更改任何内容。
  - 在暂停期间失去锁的命令不会放回任何内容，也不会动其他命令的文件。
  - Pill 绝不会使容器或页面变得不那么圆，整组容器会得到容器半径。档位会读取到达该部件的每个设置。文本输入框上的焦点会称为 focus-within。
  - `show` 在没有 React 时也能工作，并说明它跳过了什么。工作表会说明更改何时使其过期。不是设计 token 的变量需要回退值，只有变量的值在任何属性上都会被接受。
  - `compile --watch` 会重新构建编辑器主题。

- `astryx experimental theme`：早期版本构建的主题会保留其圆角半径，直到圆角或基础主题更改，撤销会精确恢复构建某一步时使用的半径。每个撤销步骤现在都会记录这些半径；较旧版本写入的步骤仍可读取。(#11350)
- `astryx experimental theme`：第九轮修复。(#11350)

  - 恢复性的 `new` 绝不会删除撤销历史，已停止的 `new` 留下的标记会被下一次更改移除。
  - 作为文件名输入的主题（`t.theme.ts`）会被拒绝，并建议它所命名的主题。被拒绝的撤销会建议其他撤销。
  - 撤销半径 token 会在没有它的情况下重新构建圆角。向上调整刻度时，内圆角绝不会变小。档位绝不会把部件往相反方向移动，会从精确的 border-radius 开始，对于变体则从部件的普通设置开始。
  - 部件从不接受的状态 `--state`（卡片上的 disabled，卡片从不标记为禁用）会被拒绝，并说明该怎么做。
  - `undo` 会指明之后生效的设置。拒绝会建议最接近的可用值。
  - 失去主题锁的命令不会发布构建输出。不产生任何变化的更改会重新构建已过期的构建。

- `astryx experimental theme preview`：`add` 会拒绝其 URL 已由应用自己的路由处理器或页面提供服务的文件夹，包括该文件夹自身的 `route.ts` 或 `page.jsx`，以及路由组中的 `route.ts`。`add --path` 和 `app` 会拒绝 Next 的构建文件夹（`.next/`、`out/` 或 next.config 指定的 `distDir`），下一次构建会清空它。在 Components 页面上，与窗口一样高的组件会在有界框架内滚动，每个单元格只与其内容一样高。(#11350)
- `astryx experimental theme preview add`：next.config 会按其语法读取，而不是按其文本读取。注释、其他对象内的键和常量都按 Next 读取它们的方式读取。通过展开构建的 `pageExtensions` 列表不再使应用被拒绝；结果会注明只有运行配置才能确定。`basePath` 和 `distDir` 也以相同方式读取。(#11350)
- `astryx experimental theme preview`：最后一批修复。(#11262)

  - 当没有任何信息说明应用使用哪个包管理器时，安装建议会指明 npm，绝不会是 `npx add` 或 `npx install`。
  - 在路由写入前停止的更改会被撤销，因此 `list` 只显示该路由显示的页面。拒绝消息会说明完成已停止的更改写入了什么。`editor set` 会指明在此类更改等待期间它保持原样的预览。损坏的步骤记录不再留下临时文件。旧预览页面的移动若中途停止会被完成：一旦旧副本仍保留着移动计划移除的内容，它们就会被删除。
  - 在包含应用的文件夹上执行 `remove --path` 会建议使用普通的 `remove`。
  - 建议的 `--path` 和 `preview app` 文件夹会从命令运行所在的文件夹写出。
  - `preview app -app` 会提示将文件夹放在 `--` 之后。

- `astryx experimental theme preview`：对预览运行 prettier（无论带什么选项）不再使其文件被视为手动更改。检查会比较代码，而不是其格式。对代码、字符串或注释的编辑仍会计入。(#11303)
- `astryx experimental theme preview add`：仅当预览的 URL 中或该 URL 处存在可选捕获所有路由（`[[...slug]]`）时才会被拒绝；必需的捕获所有路由（`[...slug]`）永远不会提供该文件夹自己的 URL。嵌套路由组内的根布局可以被找到。读取 `basePath` 时会排除注释，从代码设置的值会在要打开的 URL 中指明。(#11350)
- `astryx experimental theme preview`：更安全的拒绝与恢复。(#11209)

  - 任何拒绝都不会建议删除文件：损坏的 theme-preview.json、被手动更改的页面或挡路的文件会改为得到直接说明（手动修复、重命名或将其移到自己的文件夹中）。
  - 项目根目录、`src/` 中或路由文件夹本身的 `--path` 会被拒绝：这些文件夹包含应用。在那里找到的较旧预览会被指明，并给出清除它的 remove。
  - 当 `page.tsx` 被手动更改时，整个 `remove` 会停止且不删除任何内容，因为它导入了这些页面。
  - 运行格式化工具不再计为手动更改。`editor set` 和 `show` 会指明它们保持原样的预览文件（`previewStale`）。
  - 记录中的页面若文件已丢失，会重新写入或被排除在导航之外，因此路由总能构建。移动过的页面会获得哈希。失败的写入不会留下临时文件或空文件夹，并会说明哪一步失败。只读文件保持其模式。
  - `preview app --theme` 会等待其他更改该主题的命令，其重试建议会保留 `--theme`。

- `astryx experimental theme`：当安装的 Core 较旧、其组件文档没有 playground 默认值时，目录现在会根据组件文档的 props 构建每个组件的演示。必填 props 会得到一个示例，组会得到其文档建议的三个项目。联系表、Components 页面、`how` 答案和对比度检查会保留每个组件。拥有自己文档的部件（例如 Heading）现在会单独显示。打开的覆盖层会在人们看到的页面上显示一次，关闭的 switch 或 checkbox 会按其显示的状态标注。`preview list` 会标记文件夹已消失的主题（`themeMissing`）。损坏的步骤记录之后，不在任何记录中的页面文件会被指明，绝不会被删除。`--png` 在使用已安装但失败的浏览器时现在会指明错误。(#11350)
- `astryx experimental theme preview`：删除操作绝不触碰项目文件，预览只放在 Next 提供服务的位置。(#11229)

  - `remove` 只删除路由文件、记录和记录中的页面文件，并且只有在记录的哈希显示它们与预览写入时一致时才删除。记录指明的任何其他文件以及没有记录哈希的任何文件都会保留并指明。
  - `add` 会拒绝包含 package.json 的文件夹、另一个页面已提供服务的 URL、next.config 排除 `tsx` 页面文件的应用、在 Next 服务 `app/` 时使用 `src/app/` 的情况，以及根布局之外的文件夹。根布局位于 `[locale]/` 的应用会在那里获得预览。
  - 模板的需求来自其真实导入，绝不是注释或字符串中的词。应用未指明的包会得到添加它的命令。
  - 没有构建的主题只有在通过所有检查后才会构建，期间持有主题锁，并附有说明。字符串内的编辑计为手动更改。
  - 锁文件夹无法写入时，`editor show` 和 `preview app` 仍会运行。
  - 包含应用的文件夹中损坏的记录会建议重命名该记录。带字节顺序标记的记录会被读取。`list` 会在主题消失时说明。基础主题无论是否安装都计为包主题。`--template` 接受任何大小写。`preview app` 会拒绝 `public/` 以及 Windows 不允许的名称。空的路由组文件夹会随预览一起移除。

- `astryx experimental theme preview`：中途停止（被杀死、崩溃）的预览更改会由下一次 `preview add` 或 `preview remove` 完成。更改会在其第一次重命名前写入步骤记录。下一个命令会移除残留的临时文件，记录预览自己的文件，将新文件从未落地的页面保留在其旧位置，并在说明中提及。(#11262)
- `astryx experimental theme preview add`：在每个路由组都有根布局的应用中，预览可以在其中任何一个之下被接受，拒绝消息会逐个指明。(#11262)
- `astryx experimental theme preview`：Components 页面现在使用文档在组件自身条目中给出的 playground，因此 Stack 会显示其卡片。在页面上方打开的导航（例如 MobileNav）会像抽屉一样被排除。Text 单元格现在会建议文字颜色 token，即一个可用的命令。divider 会填满其所在行，一像素的线不再计为不显示任何内容。对于名称类似标志的文件夹，`preview app` 会打印 `cd ./-k`。(#11350)
- `astryx experimental theme preview add`：会拒绝其中或其 URL 处存在可选捕获所有路由（`[[...slug]]`）的文件夹、其路由文件夹在任何位置都没有根布局的应用，以及通过链接指向项目之外的默认或记录的预览文件夹。要打开的 URL 现在以 next.config 设置的 `basePath` 开头。当应用从未导入 Core 的样式表时，结果会指明要添加的导入行。当手动更改的 Colors 页面使主题失去最后一种颜色时，该页面会保留，其导入的调色板模块会变成空占位符，因此应用仍可构建，结果会说明这一点。预览文件夹内指向外部的链接会被拒绝，并指明该链接。(#11350)
- `astryx experimental theme preview add`：对于 `pageExtensions` 排除 `tsx` 的 next.config，拒绝消息现在会建议命令：列出 `tsx` 后执行相同的 add，或为其自己的新应用使用 `preview app`。(#11350)
- `astryx experimental theme editor` 从一个来源读取 CSS，而不是自己的列表。属性名称和值语法现在来自 css-tree。中性色的色阶来自随附的 Neutral 主题，系统字体来自 `astryx theme build` 已使用的列表。(#11350)

  - 接受六个较新的标准属性（`timeline-trigger-range` 及其相关属性）。接受大写的轮廓样式（`SOLID`）。

#### 新功能

- 集成文件接受可选的 `logo`（`{light, dark?}`，指向包随附图片的路径）：目录会在包名旁显示该 logo。当集成文件没有 `logo` 时，检查使用 package.json 的 `marketplace.logo`。`astryx integration check` 增加了两条说明，说明目录列出包所需的条件：`package_without_logo`，当 logo 没有指明包随附的、不超过 512 KB 的 PNG、JPEG、WebP 或仅形状 SVG 时；以及 `package_without_example`，当包有组件但没有示例块时。仅包含主题、文档或 codemod 的包不需要示例，仅包含图标集的包也不会产生这两条说明。两者都只是信息：无论是否带 `--strict` 或 `--next`，都不会使任何检查失败。`astryx docs authoring/ship/checks` 的新“Get your package ready to list”一节展示了如何添加两者。(#11278)
- `integration verify` 在成功打包且清单为 `astryx.integration.ts` 后，会添加一行仅文本输出的信息：CLI 会在每台机器上首次读取时转译它，因此发布 `astryx.integration.mjs` 加载更快（指向 `astryx docs authoring/ship/publishing keep-private-files-out`）。它既不改变结果，也不改变退出码。(#11382)

#### 修复

- 在 Yarn Plug'n'Play 加载器下运行（例如 `yarn astryx`）时，`doctor` 的搜索目录缓存行仍会指明文件夹及其大小，并补充说明此类运行不保留目录，因为 search 和 build 在那里每次都会收集。同一项目中的普通 `astryx` 命令照常保留它们。(#11299)
- CLI 从 TypeScript 文件（集成的 `astryx.integration.ts`、TypeScript 配置、codemod 或模板文档）转译的代码会保存在 CLI 的每用户缓存文件夹中（Linux 上为 `~/.cache/astryx/jiti`，macOS 上为 `~/Library/Caches/astryx/jiti`），该文件夹仅为该用户创建，而不是系统临时文件夹（Linux 上机器上每个账户共享）；在 macOS 上，该文件夹本就按用户隔离，因此副本现在能在临时清理后保留。由其他账户拥有或可写入的文件夹不会被使用；此时转译的代码只保留在内存中。清空临时文件夹不再使下一次运行重新转译所有内容。(#11360)
- 在两次运行之间保留的目录 `search` 或 `build` 现在会记录它对应的输入，并且只用于这些输入，因此以另一个条目名称复制的缓存文件绝不会被使用。(#11301)
- 在 Yarn Plug'n'Play 加载器下运行（例如 `yarn astryx`）不再读取普通 `astryx` 运行保留的搜索目录：它会像 `doctor` 所说的那样每次收集，因为其模块通过 Plug'n'Play 解析，而保留目录的检查不遵循该解析。(#11344)
- 发行缓存的锁接管会检查它移开的锁的所有者记录。在检查和移动之间另一条命令取得的锁会被放回，而不是移除，接管会等待它。(#11313)
- 在最低支持的 Node 版本上，当输出路径是文件时，`astryx swizzle` 会报告 `ERR_WRITE_FAILED`。原始文件保持不变，错误会以相对于项目的方式指明失败的写入，而不是暴露清理错误。(#11186)
- `theme build --out` 在替换另一个仍然存在的主题源的构建输出时会发出警告，并指明这两个源；如果某个输出的头部指明此源，或指明一个已不存在的源，则该输出属于它自己。构建输出的头部会从输出所在的项目根目录指明其源，因此从任何文件夹构建都会写入相同的输出，`--check` 从每个文件夹运行也与其一致；头部指明的源会精确匹配。构建到源旁边的默认路径不变。不以 `.css` 结尾的 `--out` 路径仍会构建，但会带警告，构建打印的导入行会按写入的文件名指明该文件。多个主题构建相同输出时，会在任何一个写入之前被拒绝。`theme eject` 和 `theme template` 之后的后续步骤会给其路径加引号，`theme template` 在 `--overwrite` 会拒绝的文件上会改为指明一个空闲路径（其回执增加 `overwritable` 和 `alternative`）。损坏的生成主题模块会说明如何重建它（删除它，然后对它包含的每个主题执行 `theme add`），未添加的默认项会指明带已添加主题的 `theme use`，模块应放置的位置是文件夹时会被用直白的话拒绝。作为普通对象的 `--family` 成员会说明这一点，并指明单独构建它。(#11346)
- `theme use`、`theme remove`、`theme add`、`theme eject`、`theme template`、`theme targets`、`theme build` 和 `theme list` 的所有拒绝都会指明一个可用的命令。对未添加主题执行 `theme use` 和 `theme remove` 时，仅当该主题存在才建议 `theme add <slug>`，否则建议 `theme list`；移除默认项时会指明带另一个已添加主题的 `theme use`。`theme add` 和 `theme eject` 中未知的 slug 会为最接近的主题建议完整命令，`theme targets` 没有匹配时会建议完整列表，被拒绝的路径、标志组合和加载会建议可运行的命令。主题导入应用缺少的包时，`theme build` 会指明安装命令（不含绝对路径），`doctor` 也会，随后是任何其他过期本地主题的重建命令。对未添加且由多个包提供的主题执行 `theme use` 或 `theme remove` 时，会为每个包分别指明 `theme add <slug> --package <package>`。`theme build --check` 的文本会像 JSON 一样列出已检查的输出。(#11346)
- `theme build` 会在加载前拒绝它自己的输出（`.css`、`.d.ts`、`.js`）或任何主题模块都不会有的文件类型（纯 `.css` 文件），并指明要构建的主题源，而不是加载器错误。缺失的输入如果是裸主题名（`theme build brand`）或带反斜杠的路径，会建议存在的主题源。从子文件夹执行 `theme eject` 会 fork 到项目的 `src/themes`（`theme list` 和 `theme add` 读取的就是这个位置），并从工作文件夹读取相对路径。`theme targets .astryx-switch` 会按输出打印的方式读取该类。`experimental theme` 的副本不再改写你输入的包含 `astryx theme …` 的文本。(#11323)
- `theme build --watch`（以及 `experimental theme compile --watch`，其帮助也说明了这一点）会在主题源或其导入的任何本地文件（eject 出的 fork 的调色板、拆分主题）发生变化时重新构建，而不仅是入口文件。`theme eject` 会拒绝本地 themes 文件夹本身（这会使 `theme list` 和 `theme add` 对每个主题都失败），也会拒绝其中以另一个主题命名的文件夹（它们会跳过该文件夹）；它会指明默认目标。fork 到本地 themes 文件夹中的新文件夹会采用该文件夹的名称：其入口、描述符和导出会重命名为构建的绑定（`src/themes/acme-ocean` → `acmeOceanTheme.ts`、`acmeOceanTheme`），因此 `theme list`、`theme build` 和 `theme add` 会以该主题找到它；其路径中的反斜杠会分隔文件夹。`theme add`、`theme list` 和 `theme eject` 上的 `--package` 也接受捆绑主题从中导入的包（`@astryxdesign/theme-butter`），即 CLI 记录并打印的名称。捆绑主题的包缺失时会指明安装命令，然后给出 add。`theme` 或 `experimental` 的未知子命令会建议完整命令，最接近的在前，`theme editor` / `theme preview` 会指向 `experimental theme editor` / `experimental theme preview`。主题文件夹之外或名称不同文件夹中的主题描述符的发现拒绝消息会说明将文件移到何处。(#11375)

#### 性能

- `build` 会将其块选择器的每块向量保留在保留的搜索目录旁边，并在使用相同目录的后续运行中读回，而不是每次调用都重新计算。每个答案都相同。(#11342)
- 检查保留的搜索目录是否仍然新鲜时，不再为它查找的每个缺失路径构建错误，因此热启动的 `search` 和 `build` 会稍快一些。每个答案都相同。(#11316)
- `component`、`template`、`theme`、`discover` 和 `search` 会将每个集成的贡献检查结果保留在每用户缓存文件夹中，位于 search 的目录旁边，并在检查所读取的每个文件、文件夹和环境变量未变化时读回，而不是每次调用都重新检查该集成。在带大型集成的项目上，这会使这些命令各自快约 0.2–0.3 秒。`doctor` 的缓存行会列出保留其收集内容的命令。(#11367)
- `search` 和 `build` 会将收集的目录保留在用户缓存文件夹中的私有文件夹（`catalogs`，紧邻发行缓存），后续运行仅在其读取的每个文件和文件夹、加载的每个模块以及读取的每个环境变量（保存为摘要，绝不保存其值）都未变化时才使用它。否则，运行会像以前一样重新收集。输入未变化的运行大约只需三分之一的时间，输出相同。只有已发布的 CLI 会保留目录，并且在无法检查文件夹所有权的地方（Windows）或 Yarn Plug'n'Play 下不会保留；`doctor` 会列出该文件夹及其大小，删除该文件夹会清除它。(#11251)
- `search` 会将其在保留目录上构建的索引保留在该目录旁边，因此后续对同一目录的搜索会读回索引，而不是重新构建。索引是目录文本的函数，因此会完全按构建时的样子读回；它由该文本以及构建它的 CLI 代码和文件（目录依赖的 CLI 文件、索引自身的代码和组件卡片）作为键，因此对已安装副本的编辑（如 patch-package 或手动编辑留下的）绝不会用编辑之前构建的索引来回答。它只在保留目录的地方保留。每次搜索打印的答案都相同。(#11300)
- 贡献验证现在只在解析贡献源代码时才加载 `@babel/parser`，因此没有其他东西加载解析器的运行（例如 `component <Name> --json` 或 `hook --list`）不再加载它。每条命令打印的输出都相同。(#11256)
- jiti 现在在首次使用时加载，而不是随每条命令加载，并且 `component --json` 不再加载主题 API（只有 `component` 的文本输出需要它），因此从不需要它们的命令启动更快。每条命令打印的输出都相同。(#11242)
- `search`（以及用它排序的 `build`）会将每个名称拆分为单词，将每个描述转为小写，并在每次运行中为每个查询词构建一次词模式，而不是为每个候选和词构建一次。每个结果都相同。(#11243)
- 在没有集成的项目中（没有 Astryx 配置、本身不是集成，也没有自带集成的已安装依赖），`component`、`template`、`theme` 和 `discover` 不再为保留的检查结果记录其运行，因此完全跳过这项工作（每个约快 15–40 毫秒）。(#11380)
- 存储的文档导出现在也覆盖 Core 的文档以及 CLI 自己的命令和 API 文档，读取时只解析所需的文档。任何文本与存储文档匹配的文档文件都会读取存储的导出，因为此类文档的导出仅取决于其文本。`search` 和 `build` 更快地打印相同输出。(#11240)
- `astryx manifest` 会读取发布时存储在包中的清单，而不是加载每个命令来构建它。存储的清单就是完全加载的 CLI 所构建的内容，发布步骤会在每个包管理器的锁文件旁检查其是否相同，因此在所有命令都能加载时，`manifest` 打印相同的输出。模块加载失败的命令会在已发布清单中列在其正常条目下，而不是标记为失败；运行该命令仍会报告失败。(#11233)
- `doctor` 会从发布时存储在包中的副本读取其对 CLI 自身编写文档的审计，而不是每次运行都解析 CLI 的编写源。副本仅在包版本以及审计读取的每个文档、类型文件和文件夹未变化时使用，因此已安装 CLI 的 `doctor` 报告相同内容。(#11232)
- `build` 会从包发布时存储的副本读取 Astryx 随附模板导入了哪些包，而不是每次调用都解析模板源。其他任何模板（例如集成的模板）仍像以前一样解析，每个答案都相同。(#11315)
- `upgrade --from` 版本低于 0.7.0 时，会在未指明任何已移除主题目标的源文件上跳过主题别名 codemod，正如它已对其他无法更改的文件跳过其他 codemod。每次运行写入和打印的内容都相同。(#11265)
- `upgrade` 会在无法更改的文件上跳过 codemod：核心 codemod 可以声明文件必须包含的词语才能执行，而文件若不含其中任何词、不含反斜杠且能解析，就会保持不变，不运行转换。无法解析的文件仍会进入转换，因此像以前一样报告。一个曾对每个组件检查每个展开的 codemod 现在只检查文件导入的组件。每次运行写入和打印的内容都相同。(#11249)

#### 文档

- 日历指南的标题为“Calendars”，文档站点在国际化分类下的侧边栏中显示它，地址相同。(#11269)
- 为 `useThemeName` 添加 Hook 文档，因此 `astryx hook useThemeName` 和 `astryx search` 会返回它，并新增一个 `useThemeName — Active theme` 示例块：包裹调用者的主题名称。(#11235)
- List 的结构说明现在指明其可选页眉，并删除了 List 不渲染的描述部件。`ref` 文档现在说明 ref 会到达列表元素，无论是否有页眉。(#11277)
- `astryx docs authoring/ship/publishing` 建议发布 `astryx.integration.mjs` 而不是 `.ts`（以及 `.mjs` 文档文件和 codemod）：CLI 会在每台机器上首次读取时转译它加载的每个 TypeScript 文件。它还说明带有两个清单的包会加载失败。(#11364)

#### 其他更改

- 内部：查找模板 fixture 引用的扫描器将替换项作为函数接收，因此文档站点的预览构建会像副本一样找到这些引用。任何命令的输出不变。(#11320)
- 在 Windows 上，CLI 的测试设置现在会重建过期的 Core。它曾直接启动 `pnpm`，而 Windows 会将其安装为 `pnpm.cmd` 批处理文件，没有 shell 无法启动，因此测试设置在运行任何测试前就以 `spawnSync pnpm ENOENT` 停止。现在它通过 `cmd.exe` 运行构建。macOS 和 Linux 运行的命令与之前相同。(#11051)

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @astracat-bot
- @cixzhang
- @josephfarina
- @nynexman4464
- @popsiclelmlm
- @prath47

---

# 0.7.14

#### 实验性 API

- `astryx discover` 会在 `@astryxdesign/lab` 的组件中列出 `WeightedSVGIcon`：这是一个实验性的 SVG 图标，其绘制会跟随周围字体的字重。(#7918)
- `astryx experimental theme editor how` 会把点明背景（“a yellow background”）的问题当作关于背景的问题来回答，并先列出其 token，而不是把它当作颜色问题。预览的 Overview 页面会先显示其打开的 popover 和 tooltip，把它们放在各自锚点下方为其预留的空间里，因此它们不再遮住表格。(#11159)
- `astryx experimental theme editor`：颜色的生成方式与官方主题一致。(#11209)

  - 你给出的精确颜色会与给定值完全保持一致。在浅色模式下它绝不移动：当没有文字能在其上可读时，改的是文字；若某个浅色填充与页面区分度不足，会给出提示。在深色模式下，如果其上的文字达到 4.5:1 的对比度，并且它与深色页面达到 3:1 的区分度，它也会被保留，其周围的深色色阶会跟随它；否则深色模式从 70 号色阶开始，与官方主题一致，结果中会说明原因。深色一侧绝不使用浅色色阶。
  - `set <theme> neutral <color>`：你的精确颜色在浅色和深色模式下都位于它自己的色阶上，周围的色阶会跟随它。
  - 强调色和状态填充上的文字取自中性色的白色或近黑色（警告状态优先用近黑色）；没有中性色时则用纯黑或纯白。状态浅色底在深色模式下是半透明的，其文字按底层表面来测量；强调色浅色底为深色 30 号色阶，或引用文字能够可读的最近更暗色阶；浅色底绝不会等于填充自身的色阶。
  - 精确指定的 `--color-accent`（或其他主色 token）会优先于它本应替换的颜色：其上的文字会按你的颜色来挑选可读的颜色，焦点环继续跟随它，若颜色过浅会给出提示，结果中也会说明。
  - 文字、图标和焦点环会取最近的、能够可读的色阶（更浅或更深），因此浅色模式表面较深的基础主题也能得到可读的颜色。
  - 对 `palette.config.json` 的手工编辑会被保留：你自己的锚点、名称、`kind`、`neutralProfile`、手工写入的 vibrancy，以及你自己的颜色。单模式主题只生成一个模式。色阶布局按它自己的色阶映射，包括半色阶；没有黑白、色阶太少或间隔过大的布局会被拒绝。生成器不读取的字段会被点名。当颜色更改触及该配置时，会被编辑器替换掉的内容也会点名。
  - 手工编辑过的生成的色板文件绝不会被覆盖，无论是否有回执；格式化不算编辑。只有颜色更改会等待，拒绝信息会说明如何保留或放弃该编辑；其他更改照常进行。来自其他生成器版本的文件会重新生成。任何未解析的颜色都不会进入构建后的 CSS。
  - 主题只从 `tokens/<theme>.palette-refs.ts` 导入它使用的色阶。
  - 颜色按浏览器读取它们的方式来读取：负色相、超出范围的饱和度和彩度、`color(srgb …)` 与 `color(display-p3 …)`。格式错误的函数、系统颜色和半透明颜色会被拒绝，并给出原因和一条可行的命令，例如带上 `#`、不加引号、改为不透明，或最接近的颜色名称。以其他方式命名的调节项（`gray`、`brand`、`error`、`saturation`、`Accent`）会提示对应的调节项；带 `--on` 的颜色调节项会提示该部件实际读取的内容。
  - `vibrancy more` 在 100 时和 `less` 在 0 时会被拒绝，超出范围的数字会提示最接近的值，撤销最后一个颜色也会移除 vibrancy，手工编辑成无效值的 vibrancy 可用 `undo` 或 `set` 修复，被替换的颜色会显示它原来的样子。广色域颜色会说明它被用作最接近的 sRGB 颜色。

- `astryx experimental theme editor`：无需 palette 命令即可处理颜色。颜色只来自 `editor set <theme> accent|neutral|success|warning|danger|info <color>`，该命令会像以前一样生成浅色和深色色阶，并把颜色 token 指向这些色阶。新增的 `vibrancy <0-100>` 设置（`more`/`less` 每次变化 10）设置生成颜色的饱和度；它需要先有一个颜色，并作用于整个主题。`editor new <theme>` 现在接受任意设置为标志（`--accent "#7c3aed" --font inter --corners round --vibrancy 60`），校验方式与 `set` 相同，并在一次构建中应用。实验性副本 `experimental theme palette generate` 已移除；`theme palette generate` 保持不变，`editor set` 将其列为它所替换的命令。帮助、结果和错误信息改用 “colors” 和 “shades”，不再使用 palette、family 和 stop；`show` 列出每种颜色及其种子，以及每个 token 使用的色阶，生成的色板文件排在最后（`colors`、`colorNotes`、`vibrancy` 和 `colorFiles` 取代 `palette`）。组件 family 现在称为 group：`how --list groups`，以及 `set` 和 `how` 结果中的 `group` 字段。`how colors`（或 `how palette`）解释颜色是如何生成的，而用白话提出的颜色问题（“brand color”、“make it more colorful”、“dark mode colors”、“error red”、“see all shades”、“exact color for one token”）会用命令来回答。不带描述的 `preview add` 会在主题设置了颜色时添加一个 Colors 页面：浅色和深色模式下的每个色阶及其编号、hex 和使用它的 token，并随每次更改保持同步。(#11149)
- `astryx experimental theme`：以一次一个经过校验的更改来创建和修改主题（`editor`），并在你应用中的真实页面上预览它（`preview`）。只有新的实验性命令组发生变化；`astryx theme` 及其输出保持原样。(#11101)

  - **经过校验的更改。** `editor set <theme> <thing> <value>` 接受一个调节项（corners、spacing、accent、neutral、success、warning、danger、info、font、headings、surfaces、buttons、type、text-size、base、mode）、一个设计 token，或某个部件上的 CSS 属性，并支持 `--on <part|family>`、`--when <prop>:<value>`、`--state`、`--mode light|dark` 和 `--only`。每个更改都会对照已安装 Core 中各部件实际读取的内容以及 token 的类型进行校验。无法生效的更改会被拒绝（退出码 1，一个 `ERR_THEME_*` 代码，不写入任何内容），错误信息会先给出可行的命令。
  - **部件读取什么。** 它按版本从已安装的 Core 本身推导而来：每个组件的目录都会用项目自己的 React 在服务器端渲染，并与 Core 的样式表关联。结果缓存在 `node_modules/.cache/astryx-theme/` 下。不新增依赖。
  - **普通的本地主题。** `<theme>.settings.json` 保存设置；`<theme>.settings.ts` 由它生成；`<theme>.theme.ts` 扩展它，只写入一次，并保留你自己的编辑；CSS 和 JS 由与 `astryx theme build` 相同的构建过程生成。若某个基础主题中更具体的规则会覆盖某个普通部件设置，该设置会在那些变体键上重复，结果中会说明。
  - **Family、模式与对比度。** 为某个 input 或 check 设置样式会作用于其整个 family，除非使用 `--only`；`--on containers` 和 `--on menus` 会为每个成员设置样式。只有颜色和阴影接受 `--mode`。此主题使其不可读的文字（低于 4.5:1，且基础主题中并没有那么低）会被报告。
  - **编辑器命令。** `editor new`、`editor set`、`editor undo`（回退一步；带一个对象时，移除该设置，使其回到基础主题的值）、`editor show`（每个设置、关键值、对比度问题，以及两个自包含的 HTML 页面：示例应用页面和所有组件；只有加 `--png` 时才生成 PNG 图片，使用机器上找到的 Playwright 或 Chrome），以及 `editor how`（某个部件读取什么、某个 family、某个设置或方面、用白话提出的问题并以精确命令回答、PNG 图片的颜色，或 `--list dials|tokens|parts|families|properties`）。
  - **在应用中预览。** `preview add` 会将一个路由写入应用的路由文件夹（`app/` 或 `src/app/` 中的 `theme-preview/`，或 `--path` 指定的位置）：一个普通页面，保留你的布局和 provider，位于一个应用外壳中，每个页面有一个导航项，并且当它使用由 `editor` 制作的主题时，还会有一个浅色、深色和系统切换。不带描述时，它会添加示例应用页面和所有组件；带描述时，它会添加 `build` 排序为该描述挑选的页面模板（`--top`）；`--template` 添加一个模板。`preview list` 和 `preview remove` 管理这些页面；只有预览写入的文件会被替换或删除，且只在其文件夹内，所有检查都在第一次写入前运行。需要应用未安装的包的模板页面会被跳过，并给出安装命令。没有应用时，`preview app <dir>` 会写入一个内含预览的 Next.js 起始应用（`--theme` 会复制一个主题供页面使用），并打印安装和开发命令。
  - **`astryx theme` 的实验性副本。** `compile`（`theme build` 的副本）、`list`、`add`、`remove`、`use`、`eject`、`template`、`targets` 和 `palette generate` 以相同的标志和 JSON 运行相同的函数。每个实验性命令文档都会在一个新的 `replaces` 字段中指明它将替换的稳定命令，并在帮助中显示为 “Will replace: astryx theme build”。

- `astryx experimental theme editor how`：按人们书写问题的方式来理解问题。(#11209)

  - 否定词和 “too” 会按正确的方向理解：“shouldn't”、“turn off”、“never”、“stop”、“unbold”、“too sharp”（更圆）和 “too heavy”（更轻）。“Everything except X”、“but not in X” 和 “all but X” 会保持 X 现状。“Without” 会在已发布支持的语言中识别，而 “sans” 仅在 serif 或 font 之前才表示字体。
  - 用户输入的值总是优先。hex 值胜过颜色词。位数错误的 hex 会按名称拒绝，绝不会用示例替换。正负号、多值 padding、`%` 不透明度、`em` 字距、数字字重、写出的阴影和 “40px tall” 都会保留。当问题没有给出颜色时，不会挑选任何颜色。
  - “In dark mode” 会把 `--mode dark` 带到每个颜色命令（包括部件命令）。如果某个更改在两种模式下相同，或对仅浅色主题提出深色模式要求，会如实说明，而不是修改浅色模式。
  - 更好的部件和属性：侧边导航项、作为轮廓的焦点环、标签页下划线、图标、边框颜色（更深、更细微、对比度）、遮罩层、透明背景、进度条厚度、更小的标题、下划线、行高和正文粗细。关于某个东西是什么的问题（“what does --color-accent do”）会得到查询结果。
  - 字母顺序颠倒的拼写错误和缩写形式（`bttn`、`brdr`）会被纠正。按钮和圆角相关的葡萄牙语、意大利语和韩语词也能识别。
  - 序列会去掉重复和被覆盖的步骤，并在 12 步处停止。两个相互矛盾的要求会作为选项提供，而不是依次执行。更改排在查询之前。
  - 文本输出会把每条命令打印在独立的一行上，绝不折行。一个序列打印为一行。
  - `--theme ""` 和重复的 `--theme` 对所有对象都会被拒绝。默认主题是编辑器命令最后修改的那个，而不是最新的设置文件，`themeChosenBy` 会说明它是如何被选中的。
  - 图片：最多读取 400 万个像素，因此 1 像素宽的线也会计入。灰度图和 RGB 图的 tRNS 会被正确处理。0x0 的图片会指明其尺寸。16 位图片的上限为 2000 万像素。
  - 在没有主题的应用中进行并行查询不会留下空的 `themes/` 文件夹。拒绝信息中的命令与答案中的命令以相同方式开头。

- `astryx experimental theme editor how`：安全、有界且正确的回答。(#11209)

  - `how` 建议的每条命令都会指明你的主题（唯一的主题、最后修改的主题，或 `--theme <name>`；没有主题时为 `my-theme`，并会先创建它），带有真实值而不是 `<placeholder>`，不包含 shell 注释，并按 `set` 的校验方式进行校验：`set` 会拒绝的命令，或不会产生任何更改的命令，会被省略，答案中会说明原因。
  - 白话问题能理解否定词和更多/更少（“remove shadows from cards” 给出 `box-shadow none`，“less rounded cards” 给出 `corners less`）、你输入的值（hex、rgb()、长度、虚线）、状态（hover、focus、checked、selected、disabled、pressed、invalid）、深色或浅色模式、一个问题中的多个更改、其他语言中的少数词语，以及小的拼写错误。没有答案的问题在 JSON 中也会说明，并给出接下来可尝试的命令。
  - `how <part>` 会把每个条件写成 `set` 接受的 `--when` 和 `--state` 标志，或说明为什么没有标志能触及它；列出 `set` 接受的每个状态；并说明某个部件没有记录的读取内容时的情况，同时给出仍然适用的命令。
  - `how <token>` 会说明部件数据中没有任何部件读取某个 token，但 Core 的样式表读取它的情况。
  - 查询接受任意大小写、复数和去掉连字符的 token 名称；`--list` 可在任意位置接受类别（单数或复数）、`--list=tokens`，以及以 `--` 开头的过滤条件，并拒绝重复给出的 `--list`。
  - 图片：头部声明超过 4000 万像素或像素数据短于头部声明时，会立即拒绝；损坏的文件会被拒绝；半透明像素会被跳过；`--at` 会给出每个点的 alpha，并拒绝无法精确读取或落在图片之外的点；任何文件名都可以，其他格式会按字节内容拒绝。
  - `set` 会拒绝包含 `<placeholder>` 或 `#` 注释的值。
  - 损坏的部件数据缓存会重新构建，缓存会整体写入，在没有主题的应用中查询不会留下 `themes/` 文件夹。
  - 文本和 JSON 以相同方式给出命令的开头，文本输出会转义你所输入内容中的控制字符。

- `astryx experimental theme`：数据安全和值校验。(#11180)

  - 被拒绝的更改只会还原该命令在那一轮运行中写入的文件，每个文件整体还原，且仅当它们仍保留着写入的内容时；期间被其他人修改的文件，或无法还原的文件，会被保留并点名。设置和撤销历史会在同一次回滚中写入，被拒绝的 `new` 不会留下任何痕迹。`themes/` 或主题文件夹中任何位置的链接都会被拒绝，绝不会被跟随或删除。编辑器没有写入的 palette.config.json 会被保留。`show` 会发现与设置不匹配的构建（命令在构建中途停止、手工编辑）并重新构建，同时说明。临时文件有自己专属的编辑器名称，并由创建它们的写入操作移除；其他任何内容都不会被删除。从子文件夹运行时，命令会作用于其上方最近的 Astryx 项目，查找方式与 `upgrade` 相同：搜索在仓库根目录停止，绝不把主目录当作项目。该项目中没有 Astryx 的包会被拒绝，并给出应运行命令的文件夹；无法解析的 package.json 绝不会被跳过；当项目位于当前文件夹之上时，回复路径为绝对路径。Yarn Plug'n'Play 和没有 Core 的 package.json 会有各自的消息。磁盘已满或只读为 `ERR_WRITE_FAILED`。
  - 针对同一个主题的命令会依次运行，因此不会丢失任何更改。锁位于项目的 `node_modules/.cache` 中（无法写入的文件夹会以 `ERR_WRITE_FAILED` 拒绝）；由已停止的命令留下的锁，或另一台电脑上已停止的命令留下的锁，会被接管。等待超过 30 秒的命令会以新代码 `ERR_THEME_BUSY` 被拒绝，并指名该锁。
  - 名称检查接受的每个名称都能构建（`brand-2`）。名称最多 64 个字符。`new` 会拒绝主题目标位置的链接或文件、多余单词、给了两个值的标志，以及空的 `--like`；`--headings` 接受一个字重和一个字距；被拒绝的标志会建议一条 `new` 命令。
  - 手工编辑的设置会在加载时校验，`undo` 要回退到的那一步也会校验。编辑器不再接受的已保存值会指名移除它的 `undo <theme> <thing>`，且该命令可用；`undo` 回退到的那一步若包含这样的值，会跳过该值，结果中会说明。损坏的撤销步骤只会丢弃它自身及其之前的步骤。带引号的字符串或 data URL 可以包含分号。
  - Token 值按其类型校验：时间、缓动、字体、阴影和轮廓样式也一样，标题字重按数字校验。会破坏 CSS、读取自身，或指名 `<color>` 之类占位符的值会被拒绝。只有颜色接受 `--mode`；按模式设置阴影会在两种模式中都移除它。
  - 代码高亮、展示文字大小和彩色图标 token 都可以设置。
  - 精确指定的字体族在手机上也会生效；手机保留自己的阅读字号。
  - 文字大小或字号比例会保留基础主题的比例和主题的标题字重（精确的字重 token 仍会供给它们），在手机上也是如此。
  - `text-size` 接受 10 到 32 像素。`font` 会拒绝无法构建的值。当所有颜色都是灰色时，`vibrancy` 会被拒绝。
  - `undo <theme> <token>` 会指名仍在写入该 token 的调节项。
  - 读取已构建的主题不会向主题文件夹写入副本。

- `astryx experimental theme editor`：名副其实的设置。(#11222)

  - 精确的 token 或部件属性总是优先于调节项，无论顺序如何。被更改的设置会移到最后，因此优于它之前的内容。在长属性之后设置的简写属性会说明它替换了它们。针对两种模式的设置会替换它本应位于其下的单模式设置。
  - 对每个变体各自有值的部件设置单模式会被拒绝，并给出指名该变体的命令。为单模式主题没有的模式保存的设置仍然可以移除。已消失的基础主题包不再阻止移开它。
  - `--when` 必须是一个属性和一个值，对 group 使用时必须属于某个成员，`--state` 也一样。空的或重复的 `--on`、`--when`、`--state` 或 `--mode` 会被拒绝，`undo` 和 `show` 之后的多余单词也会被拒绝。
  - `undo <theme> <thing> <value>` 仅当该值就是它的值时移除该设置。没有指定对象的范围标志会被拒绝。`undo <theme> base` 和 `undo <theme> mode` 会把它们设回默认值。此 Core 不认识的已存储设置仍然可以移除。
  - 当设置被手工编辑或由其他 CLI 构建时，`show` 会重新构建主题；`--section` 写入 `sheet-<section>.html`，而不是覆盖整张表，且接受任意大小写。重复列出的设置会被拒绝。
  - `spacing` 会按比例缩放基础主题的间距；corners 步骤从基础主题的圆角或整个主题的设置开始；`corners pill` 会让复选框保持方形；`headings` 拒绝 `--mode`；`font` 拒绝 `--when` 和 `--state`，并以任意大小写接受预设。
  - 不产生可见效果的更改会如实说明。切换基础主题或模式会列出它重新设置样式的部件和颜色说明。`var()` 中拼写错误的 token，以及为某个主题输入路径或大写字母，会得到“你是不是想输入”的提示。未测量的文字对比度（单个变体或状态、soft 或 outline 按钮）会列为未检查。`show` 中的颜色会为每个模式给出各自的精确值。
  - 复制的 `theme` 命令在拒绝信息中会指名 `experimental theme` 命令。`editor new` 和 `editor how` 不再声称替换其副本所替换的稳定命令。没有 Core 的 package.json 会得到安装命令。

  - 未被观察到任何已渲染部件读取的整个主题 token 会被设置，并附上说明，而不是被拒绝。读取用户所指 token 的部件会把它用于它所供给的任何属性。为另一个变体值指定的 token（横幅上带 `--when status:error` 的 `--color-error-muted`、图标上的 `--color-icon-pink`）会被接受。`constructor` 之类的部件名会被视为未知部件，而不是崩溃。
  - 为某个角色设置的字体在整个主题字体之后仍保留其字体，无论顺序如何。
  - 缓动、字体族列表、`light-dark()` 和 `color-mix()` 颜色、阴影和时间会按浏览器读取它们的方式校验。阴影可以使用 token 颜色、任意长度单位或堆叠的阴影 token。带 fallback 的 `var()`、相对颜色和系统颜色会被接受。时间最多 60 秒。字体名称可以包含撇号。带空格的 `var( --x )` 会检查循环引用。
  - 已保存的精确 token 会在每条命令中校验；规则不再接受的那个会指名移除它的 `undo`。
  - 大小更改会说明手机保留基础主题的阅读字号，并指名超出 9 到 200 像素范围的比例步骤。建议直接设置属性的拒绝信息会指名接受该值的属性。`set`、`undo` 和 `show` 给出的每条建议都会指名主题和一个可接受的值，绝不会是占位符。
  - 主题锁位于命令所读取的 Core 旁边，项目之外的命令不会获取锁。当 `show` 重新构建时，它会说明原因：文件缺失、另一个 CLI 版本、构建后设置更改，或构建未完成。

- `astryx experimental theme editor`：主题颜色现在来自 palette 生成器。`set <theme> accent <color>`（以及新的 `neutral`、`success`、`warning`、`danger` 和 `info` 调节项）会把颜色作为 family 写入 `themes/<theme>/palette.config.json`，其格式是 `theme palette generate` 读取的格式，并运行同一生成器写入 `tokens/<theme>.palette.ts` 及其回执。主题的颜色 token 指向该 palette 的各个 stop，浅色和深色来自同一种颜色，遵循官方主题使用的 stop。当 token 必须可读时（文字 4.5:1，焦点环 3:1），它会移动到同一 family 中更近的 stop；编辑器不再自行混合颜色。`show` 会报告 palette、每个 token 由哪个 stop 供给，以及每次选择背后的对比度；`how palette` 会解释；`undo <theme> accent` 会移除该 family 及其 token。精确 token（`set <theme> --color-accent <color>`）仍然优先于 palette。颜色调节项作用于整个主题：`--on` 和 `--mode` 会被拒绝，并给出应改用的精确 token 命令。(#11134)
- `experimental theme preview add` 会在写入任何页面前检查主题，并在没有 StyleX 编译器的应用中跳过 StyleX 模板页面（结果会说明原因）。`experimental theme preview app` 会在构建 `--theme` 前检查文件夹，因此拒绝时不会写入任何内容。(#11134)
- `astryx experimental theme preview`：预览页面在生产构建中可用。离开 Components 页面不再导致路由崩溃：typeahead 部件（Tokenizer、CommandPalette）会获得一个小的示例搜索源。在 Components 页面上，部件会在其 playground 指名的父级内渲染（Step 在 Stepper 中，SegmentedControlItem 在 SegmentedControl 中，RadioListItem 在 RadioList 中），只能在父级更深处工作的部件会被省略，状态变体以 `{type}` 传入，ButtonGroup 显示三个按钮，保持关闭的图层会被省略。仍会抛错的组件会显示一条简短说明，而不是空白单元格。Overview 页面是示例页面的内容，没有第二个应用外壳。字体：当字体的包未安装时，`editor set <theme> font <name>` 和 `editor show` 会在靠近顶部的位置说明，并给出确切的安装命令；安装后，下一次 `set` 或 `show` 会让预览路由导入其样式表。(#11134)
- `astryx experimental theme preview`：更安全的拒绝与恢复。(#11209)

  - 任何拒绝都不会建议删除或移动文件：损坏的 theme-preview.json、被手工更改的页面，或挡路的文件会得到普通说明。
  - 在项目根目录、`src/` 中或路由文件夹本身的 `--path` 会被拒绝：这些文件夹存放着应用。在那里发现的旧预览会被指名，并给出清除它的 remove 命令。
  - 当 `page.tsx` 被手工更改时，整个 `remove` 会停止且不删除任何内容，因为该文件导入了这些页面。
  - 运行格式化工具不再算作手工更改。`editor set` 和 `show` 会指名它们保持原样的预览文件（`previewStale`）。
  - 已记录但文件已丢失的页面会被重新写入，或从导航中省略，因此路由总能构建。移动过的页面会获得哈希。写入失败不会留下临时文件或空文件夹，并会说明哪一步失败。只读文件保持其权限模式。
  - `preview app --theme` 会等待其他更改该主题的命令，其重试建议会保留 `--theme`。

- `astryx experimental theme preview`：更安全的添加、移除和起始应用。(#11209)

  - 预览页面放在 `_pages/` 中，这是 Next 从不路由的文件夹，因此位于项目根目录或 `src/` 中的预览不再启用 Pages Router。旧版本写入 `pages/` 的预览会在下次 add 或 remove 时移动。
  - 拒绝不会删除任何内容：`remove <page>` 会在删除文件前加载主题，当主题无法加载时会指名整个预览的 remove。已消失的主题会由应用自身的主题替代，并附说明。
  - 只有预览写入的文件会被替换或删除，且绝不会是此后被手工更改的文件（theme-preview.json 记录每个文件的哈希）。`remove` 会指名它保留的文件、已经消失的文件，以及它重新写入的文件。
  - 文件会先暂存，然后一起重命名到目标位置；写入失败会把每个文件放回原位，并以 `ERR_WRITE_FAILED` 拒绝。
  - 损坏的 theme-preview.json 会在 add、list 和 remove 中以 `ERR_THEME_INVALID` 拒绝，并指名该文件及解决办法。
  - 当 `--path` 是文件、位于 `themes/`、`node_modules/` 或 Pages Router 文件夹中、位于 Next 不路由的文件夹中，或使用 Windows 分隔符、`~` 或两端有空白字符时，会被拒绝。打开的行会去掉路由组并对每个文件夹名进行编码。
  - 没有 `--path` 时，list 和 remove 会查找为某个主题记录的预览。
  - `add`：空的 `--template` 会被拒绝；传给 `--template` 的 block 会说明它不是页面，并建议把页面模板作为命令；`--top` 按输入原样接受，且只能与描述一起使用；描述可以是不加引号的多个单词，只有前 40 个不同的单词参与排序；已指名但未安装的包会被视为缺失；主题发生变化时会重新写入默认页面；被中断的运行留下的、文本相同的页面文件会被接管。
  - 建议的命令是 shell 安全的，错误的 `--theme` 会指名最接近的编辑器主题。
  - `list`、`remove` 和 `preview app` 会拒绝多余参数。
  - `preview app`：应用会写入临时文件夹后再移动到目标位置，因此失败时不会留下任何内容；路由内、`themes/` 或 `node_modules/` 中的文件夹、文件、悬空链接和异常名称都会被拒绝；只有 `.git` 的文件夹视为空；主题指名的每个开放字体都会以固定版本范围加入；包含 Colors 页面；单模式主题从其模式启动；陈旧的主题构建会先重新构建；主页链接到预览，`.gitignore` 覆盖 `node_modules`，打开的行会被引用（含引号）。

- `astryx experimental theme editor how --list` 现在是一个开关，与 CLI 中其他地方的 `--list` 一样：第一个词说明要列出什么，其后的任何词用于过滤列表（`how --list tokens accent`），单独使用 `--list` 则列出各类别。读取已构建的主题不再向 `themes/<theme>/` 写入临时文件；它会使用项目的缓存文件夹。(#11173)
- `astryx experimental theme`：第三轮主题化修复。当没有页面正好是所描述的页面时，`preview add "<description>"` 会添加最接近的页面，`matched` 会说明它覆盖了描述中的哪些词；只有没有任何页面相关的描述会被拒绝，其建议会重复 `--theme` 和 `--path`。应用无法显示的页面会被跳过，并取下一个匹配项，先来自排序，再来自模板搜索。页面的导航标签就是其模板的名称，无论它是如何添加的。当强调色和状态填充上的文字达到 4.5:1 时，它们在深色模式下也会保留你的精确颜色；否则深色模式使用最近的可读色阶，结果会说明原因。设置 `vibrancy` 会指名主题未设置的状态颜色，它们保留基础主题的颜色（info 色调的表面如彩色卡片也是如此），并给出引入它们的命令。`new` 会列出它与其他设置一起应用的模式。`show` 在精确 token 设置胜出时打印你的精确值，并且大小、数字和字体只打印一次，而不是按模式分别打印。注释会指名 token 设置所在部件内部的部件（“button inside toast”）。没有任何部件读取的 token 会说明它不会改变你现在看到的内容。`how` 会指名静止状态的边框（`border … --when variant:secondary`），把部件的填充和文字一起回答（“light gray button with dark text”），并对状态背景（“the error background”）用状态颜色回答。Overview 页面的标签页和其他受控示例在被点击时不再抛错，其打开的 popover 和 tooltip 在窄宽度下也彼此避开。(#11163)
- `astryx experimental theme`：第四轮主题化修复。当描述指名某个应用页面（问题跟踪器、看板、仪表盘、应用截图）时，`preview add "<description>"` 会添加应用页面而不是 hero，对左对齐或分栏 hero 会采用 side hero，说明没有页面自带顶部导航，并始终说明它为什么选择某个页面。基础的 `preview add` 会说明哪些页面已经存在并会被重新写入（`refreshed`）。`how` 会给每个 token 一个其自身类型的值（`--color-border "<color>"`、`--border-width 1px`；只有 `border` 属性接受完整边框），为具名色调保留填充（“light blue tint with blue text”），并且不再把 “border color” 读作填充。`undo <theme> <thing>` 会指名它移除的设置（`removed`），而不是把它作为生效值打印。仅浅色或仅深色主题只列出自己模式的色阶和注释。`show` 会列出在部件或 group 上设置的 corners 或 spacing，并在整个主题的值旁边列出其部件实际得到的值（`partValues`）。`neutral` 会指名基础主题的页面背景以及设置白色页面的命令。当 `headings` 设置字重或字距时，`type` 会说明它仍设置什么；`type` 和 `text-size` 无论顺序如何都会保留彼此在比例中的部分。没有部件读取的 token 会说明哪些 token 由它构建，而不是声称它不改变任何东西。已安装的字体会说明它已安装。颜色的文字在白色和近黑色之间切换时会说明原因。(#11165)
- `astryx experimental theme`：强调色或状态填充只有在除文字可读之外还与深色页面有足够区分度（3:1）时，才会在深色模式下保留你的精确颜色；否则深色模式使用同时满足两者的最近色阶，结果会说明原因。预览的 Colors 页面会在实际使用的色阶下标记这样的填充，深色模式也一样。`preview add` 的建议会给它重复的选项加上引号，例如带空格的 `--path`。(#11165)
- `astryx experimental theme`：只有当描述以短语形式指名应用（问题跟踪器、问题详情、看板）时，`preview add "<description>"` 才会选择应用页面，因此带有“buy tickets”按钮的页面或 AI 工具的落地页不再获得应用页面；详情视图排在其列表之前，如果排序页面已经是该应用，则保持第一位。当颜色词属于填充时，`how` 会保留填充（“a dark card with a thin border”、“colored buttons with a border”）。`show` 会指名每个部件的圆角实际读取的 radius token。`neutral` 注释只在具有浅色模式的主题中提供白色页面。当你的精确强调色或状态颜色不能作为深色填充时，深色模式使用最接近你颜色、且文字达到 4.5:1、填充与深色页面达到 3:1 的色阶。`undo <theme> <thing>` 会像其 JSON 那样打印 `setting` 和 `removed`。(#11168)
- `astryx experimental theme`：完整审查后的修复。(#11173)

  - `preview app --theme` 会逐字节复制整个主题文件夹，包括生成的颜色，因此新应用能通过类型检查。
  - `preview app <dir>` 只会写入新文件夹或空文件夹（其 `--overwrite` 选项已移除）：非空文件夹会被拒绝，并给出一个可用的空闲文件夹名。
  - 半透明文字和背景按实际绘制方式测量：在检查对比度之前，每一项都会叠加在其下方内容之上。
  - 两个命令可以同时运行：每次渲染使用自己的文件夹。
  - 已保存但无法校验的更改会显示 “saved, not checked” 并以 0 退出。
  - 仅浅色或仅深色主题只应用自己模式的设置并指名其他设置，为其设置的颜色写入一个值，其应用内预览从该模式启动且没有切换。
  - 损坏的撤销历史不再破坏 `set`（会开始新的历史并附说明），`undo` 会说明如何修复。
  - 颜色会对照主题自身精确的页面和表面颜色来挑选。
  - 不产生任何变化的更改不会构建，也不会添加撤销步骤。
  - `undo <theme> <thing>` 会说明现在生效的内容（`now`）。
  - `show` 会指名每个部件读取的 radius token，或说明未知。
  - `how` 回答仅涉及边框的问题时不会给出填充。
  - 预览选择器按短语匹配应用页面和文章页面：新闻故事或博客文章会得到文章页面，绝不会是记录页面；没有任何页面相关的描述（没有短语，匹配的词少于三个或不足五分之二）会被拒绝。
  - 位于路由文件夹之外的预览会说明应用不会提供它。
  - 超过八个对比度问题时，末尾会显示 “and N more”。

- `astryx experimental theme editor show`：文本输出会完整打印 palette 路径和对比度说明，而不是每行一个字符，并为 palette family 供给的每个 token 保留一行。(#11149)
- `astryx experimental theme`：一次真实主题化过程中的修复。`headings` 现在无论它与 `type` 以何种顺序设置，都会保留标题字重和字距；`type` 会说明它不再设置什么，`show` 会标记被另一个设置部分遮蔽的设置。陡峭的 `type` 比例（editorial、display）会让低于基础大小的文字保持其标准大小，因此小字仍然可读。`show` 会列出每个设置及其完整范围（`--on`、`--when`、`--state`、`--mode`）。灰色（`accent #171717`）会在浅色和深色模式下生成灰色色阶，而不是凭空创造色相。`neutral` 不再给页面背景染色（`--color-background-body` 保持基础主题的值）。`set` 接受 color、`type`、`headings`、`corners`、`spacing` 或 `text-size` 写入的每个 token，因此调节项的注释绝不会指名 `set` 会拒绝的 token。当组件无法渲染时（例如有两份 React），`new`、`set` 和 `undo` 会保存更改并显示 “saved, not checked”，附上原因和代码 `ERR_THEME_NOT_CHECKED`，而不是在写入后失败；`how` 会说明它无法检查什么，而不是列出没有读取者。未安装的字体会指名最接近且无需安装的字体。`how` 会对每个方面只回答一次，把问题中的尺寸转换为 `--when size:…`，从每个颜色所属的词中取颜色，说明文字何时采用页面的文字颜色，而不带类别的 `how --list` 会列出各类别。`preview add "<description>"` 会说明它匹配了什么以及为什么，排除应用框架，在没有页面真正匹配时以最接近的页面指名拒绝，并在某个页面无法在此显示时取下一个匹配。预览会用主题填满整个窗口，包括外壳和边缘；Overview 页面现在显示主题最常出问题的地方，Components 页面的每个单元格都会指名最能改变它的命令。`show --group` 现在是 `show --section`：它选择主题构建表的一个 section，因此 “group” 只表示一组部件（`--on inputs`）。(#11149)
- 图标集：编写图标集更容易。作者可以看到捆绑模板使用了哪些该图标集尚未映射的图标含义，例如 `document` 和 `share`；复制的模板会为每个这样的含义显示占位符。只有实验性图标命令、`integration check` 和 Doctor 中的图标集列表、两个图标定义的搜索词，以及图标集指南发生变化。(#11090)

  - **编写回执。** 当图标集留下未映射的模板含义时，`experimental icon new-set`、`add` 和 `map` 会在结尾输出一行：有多少个、按使用最多优先列出并附模板数量，以及要运行的 `map` 命令。JSON 中新增 `templateMeanings: {unmapped: [{definition, templates}]}`。试运行不会添加任何内容。
  - **`experimental icon --definitions`。** 每个定义会显示有多少捆绑模板使用它（`templates`）以及该图标集是否映射它（`mapped`）。图标集是 `--set` 指名的那个，否则是项目的主图标集，否则是你运行所在图标集包的唯一图标集。`--definitions` 现在可以接受 `--set`。
  - **`integration check`。** 每个图标集的 `iconSets` 条目新增 `templateMeanings`，打印在 “Template icon meanings not mapped” 下。它从不计数，也绝不会导致检查失败，即使使用 `--strict`。
  - **`new-set --adapter ./<path>#<export>`。** 声明一个由图标数据对象或 SVG 字符串组成的库所需的适配器，使图标集无需手工编辑数据文件即可包装它。
  - **更清晰的回执。** 第一次 `new-set --from` 写入一个没有图标的图标集时，会说明图标集是创建而非刷新。`add --variant <look> --all` 会指名模块缺少的前十个图标以及还有多少个；JSON 仍然列出每一个。将未列出的图标集作为备份添加的命令（来自 `icon use` 和 Doctor）会以相同方式指名每个图标集：用其名称，或当两个包提供同名图标集时用 `<package>/<set>`。
  - **更好的建议。** 如果建议图标的 id 只是以定义名称开头并附加了其他内容（`delete-left`，退格键），它会排在定义词语所指名的图标（`trash`）之后，两个定义共享的词（`store`）会排在只有一个定义拥有的词之后。`save` 会添加 “floppy disk” 一词，`bank` 会读取 “building library” 而不是 “library”。

- 图标集：一旦某个图标集映射了五个新的图标定义，复制的模板就能在更多图标集中绘制正确的图标。只有 `astryx template` 的实验性图标集重写、五个新的图标定义、捆绑模板的 `icons` 声明，以及图标集指南发生变化。(#11142)

  - **不同的图标保持不同含义。** 一些捆绑模板把两个不同的图标赋予同一个含义，因此两者在每个图标集中都绘制同一个图标。Settings Dialog 的 “Keyboard shortcuts” 和 “Developer” 行，以及它的画笔和色板，现在会绘制不同的图标，Table Filter、Theme Showcase 和 Button Group 展示块中的图标对也是如此。新的图标定义：`keyboard`、`paintBrush`、`documentSearch`、`bookmarkAdd` 和 `wallet`。此更改之前发布的任何图标集都没有映射它们，因此使用这样的图标集时，Settings Dialog 的 “Keyboard shortcuts”、“Color theme” 和 “Verbose logging” 行、Table Filter 的保存视图按钮，以及 Theme Showcase 的钱包都会绘制占位符。图标集一旦映射了新的定义（`astryx experimental icon map <definition> <icon> --set <main>`），就会绘制这些图标；在此之前，每个都会绘制占位符，除非你的列表中的某个图标集包装了模板的库。
  - **来自图标集自身库的图标会保留。** 当你的列表中的某个图标集包装了模板导入某个图标的库时，该图标就是你的项目选择的图标。对于主图标集自己的库，图标保持其原样导入。对于备份图标集的库，没有图标集映射的图标会保留其导入，而不是变成占位符。报告会在 `kept` 下列出每一个并附原因。

#### 新功能

- 从主题展示的 Sign in 按钮打开登录对话框（它原本是一个无动作的链接），以便一起审阅主题的对话框标题、关闭控件、字段和页脚按钮。(#11130)

#### 问题修复

- `astryx component <ExampleName>` 在给定示例块时仍会以 `ERR_UNKNOWN_COMPONENT` 和相同的名称建议失败，但其消息现在会说明该名称是示例块，`astryx template <ExampleName>` 会打印其源码，以及哪个 `astryx component <Parent> --blocks` 会列出它。(#11153)
- `astryx search` 不再把属于另一个条目名称的组件或 hook 关键词算作该条目的匹配，因此 `spinner` 列出 Spinner 时旁边不会出现 NumberInput。当条目自己的描述使用该词，或它指名条目自己 family 的成员或其 hook 时，关键词仍然算数。`build` 读取关键词的方式与以前相同。(#11162)
- `astryx template` 和 `astryx build` 只从模板的真实导入中读取其需求。注释、字符串和 JSX 文本中的词不再算作包，因此 `form-wizard`、`form-wizard-vertical` 和 `table-tree` 等模板不再要求你安装 `Next`、`Distribution` 或 `canvas-editor`。诸如 `~/lib` 或 `#internal` 的路径别名，或 npm 不接受的名称，不会被报告为需要安装的包。(#11224)
- 模板占位图片会跟随深色模式。复制模板页面用来代替演示图片的占位符现在是低透明度的柔和灰色，其色调取自其背后的表面，因此不再在深色主题中显示为明亮的浅灰色块。当所有图片都是占位符时，gallery-hero、side-gallery 和 lightbox 图库示例不再警告重复键。(#11150)
- 主题命令不再替换它们不拥有的文件，并会报告正确的错误。`theme template --overwrite` 只替换模板的早期副本或主题源文件，并拒绝文件夹、空白路径和不是 `.ts` 的路径。`theme eject --overwrite` 绝不写入另一个主题的文件夹或主题编辑器创建的主题，结果会指名 fork 需要的包（`missingPackages`、`installCommand`）。`theme build --out <folder>` 会把 `<name>.css` 写入该文件夹；构建绝不替换其源文件，也不替换 `--out` 所指路径上并非它写入的文件，同一轮运行中两个同名主题会被拒绝（0.6.7 之前的 CLI 在默认路径下的无头部输出，包括 family 输出，仍会被替换）。当 `--out` 指名一个由 0.6.7 之前的 CLI 写入的文件时，构建会说明：删除该文件并再次运行相同的构建。两个同时运行的 `theme add`、`use` 或 `remove` 命令会保留两个更改。本地文件夹或包已消失的主题不再阻止其他主题的 `use`、`add` 或 `remove`；它会被省略并附说明；一个损坏的本地主题文件夹不再从 `list` 和 `add` 中隐藏所有其他主题。当本地主题遮蔽包主题时，`add` 会说明它选择了哪个所有者。没有值的选项会以该命令的用法显示 `ERR_MISSING_ARGUMENT`，`astryx help <group> <command>` 会打印该命令的帮助。(#11210)
- 主题展示的 Sign in 对话框每次打开都是空的，不会保留取消前输入的内容。(#11139)

#### 性能

- CLI 会开启 Node 的编译缓存，因此一次运行会跳过大部分再次编译 CLI 模块的工作。缓存位于系统临时文件夹中用户自己的文件夹（`node-compile-cache-<uid>`），仅在存在后使用（机器上的首次运行只会创建该文件夹，因此一次性运行不会为其付出代价），并且仅当它是用户拥有且其他人无法访问的真实文件夹时才使用。在系统没有用户 ID 的地方（Windows），无法检查这一点，因此缓存保持关闭。`NODE_DISABLE_COMPILE_CACHE=1` 会关闭它。无法读取或写入的缓存会被静默跳过，每条命令打印的输出相同。(#11217)
- `astryx --help`、`-h` 和 `help` 会从发布时存储在包中的命令列表打印根帮助，而不是先加载每条命令。该列表包含完整加载的 CLI 会打印的术语和描述，因此在加载所有命令的同时，帮助的阅读内容相同。模块加载失败的命令会在发布的根帮助中按其正常描述列出，而不会标记为失败；运行该命令仍会报告失败。(#11194)
- 读取 Astryx 随附文档的命令（`search`、`build`、`docs`、`template`）会从发布时存储在包中的导出副本读取每个仅包含纯数据的随附文档，而不是导入文件。该副本以文件文本为键，因此被编辑的文档、在加载时导入或调用任何内容的文档，以及每个集成的文档都会像以前一样导入。每条命令打印的输出相同。(#11191)
- `search` 和 `build` 会从发布时存储在包中的列表读取 Astryx 随附模板的组件，而不是在每次调用时解析模板源码；当 `template` 不改变模板的演示内容时也是如此。该列表保存的内容与解析返回的完全一致，以源文本为键，因此更改过的源码或集成的模板会像以前一样被解析。每条命令打印的输出相同。(#11190)
- 多次调用 `themeTargets()` 的进程只会扫描一次 Core 的组件文档。只要它读取的每个文件夹和文档都未改变，它就会复用该扫描结果，就像文档和搜索目录那样。通过符号链接访问的 Core（项目的 node_modules 就是这样访问它）会共享其真实路径的扫描结果。一次性的 `astryx theme targets` 和主题构建的目标检查仍然只扫描一次。每条命令报告相同的目标。(#10981)

#### 文档

- AppShell 关于命名其导航地标的指南现在说明：向 TopNav 传递 `label`，向 SideNav 传递 `aria-label`。SideNav 没有 `label` 属性；它有一个已翻译的默认名称，`aria-label` 会重命名它。(#11151)
- 日历指南用每个日历的 CLDR 名称来指名它，例如 Minguo、Dangi、Hijri 和 Ethiopic，并在旁边给出其标识符。(#11102)
- `astryx docs` 中的 token 表会说明其值是 Core 的默认值，主题会替换它们：列标题为 “Core default”、“Core default (light)” 和 “Core default (dark)”。Color 主题还会说明每个主题定义自己的值，并且 `astryx theme list` 显示可用的主题。(#11089)
- 为 `useTruncation` 添加 hook 文档和交互式表格单元格截断示例块，演示响应式字符串截断和无障碍 tooltip。(#10555)
- InternationalizationProvider 按阅读顺序展示其示例：加载一个随附的区域设置、为从右到左的文字镜像布局（一个新的代码示例）、覆盖一个字符串，然后是日历示例。每个实时示例都以对应的代码示例命名，因此两个列表一致。(#11094)

#### 其他变更

- 内部：模块加载器通过文档导入器使用的同一个小模块来导入用户模块，CLI 自己的测试项目会原生加载该模块，因此主题构建的文档读取在繁忙的机器上不再使测试超时。任何命令的输出都没有变化。(#11119)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @josephfarina
- @nynexman4464
- @utkarshpatwa393-sys
- @vjeux

---

# 0.7.13

#### 实验性 API

- `astryx discover` 会在 `@astryxdesign/lab` 的实验性组件中列出 TabBarMoreList 组件。(#10619)
- 图标集：一个项目选择一个主图标集和按顺序排列的备份图标集，任何图标集都没有的图标会在复制的文件中变成占位符。只有实验性图标命令、设置 `experimental.iconSet` 的项目、声明 `icons` 的模板，以及图标集指南发生变化。(#10959)

  - **主图标集和备份。** `astryx experimental icon use <main> --backup <set>`（可重复，保留顺序）会把 `experimental.iconSet` 写成列表，主图标集在前；没有 `--backup` 时，它像以前一样写入普通字符串。回执新增 `backups`、列表遗漏的已安装图标集（`unlisted`），以及添加它们的命令（`next`）。`experimental icon --list` 会显示 `order` 以及每个图标集的 `role` 和 `rank`，并且当安装了两个或更多图标集且没有一个是主图标集时，显示要运行的命令。0.7.12 之前的 CLI 拒绝列表形式，当项目的 CLI 范围允许列表形式时，`use` 会发出警告。
  - **复制的模板遵循列表。** `astryx template` 会从列表中第一个具有该含义的图标集中取每个图标，绝不在一个图标内混合图标集，并报告使用的图标集、缺失的外观（`variant: {asked, used}`），以及每个使用的图标集及其许可证（`icons.sets`）。
  - **不留下杂散的库导入。** 列表中没有图标集拥有的图标会丢失模板的原始导入。复制的文件会声明一次一个小型 `MissingIcon` 组件（虚线方框，1em，使用当前文字颜色，除非使用处给它标签，否则对屏幕阅读器隐藏），图标原先出现的每个位置都会渲染它，并用注释指明含义。它不需要新包。输出会打印一条注释，指明含义和两种修复方式（在主图标集中映射它，或添加一个备份图标集），JSON 会在 `icons.placeholder` 中列出它。
  - **Doctor。** 在启用选择加入后，当列表指名了未安装、已撤回或由两个包提供的图标集，以及安装了多个图标集但列表遗漏其中一个时，`icon-sets` 检查会失败。新的 `icon-placeholders` 检查会在复制的代码仍使用占位符时发出警告，并指名每个文件和含义；被注释掉或加引号的副本不算。未选择加入的项目看不到变化。
  - **带标签的模板图标。** 捆绑模板使用的每个图标现在都会声明其含义，并新增 30 个图标定义。`integration check` 会指出模板导入但未声明的图标（`template_icon_undeclared`），前提是所在包的模板声明了 `icons`：来自该包声明图标的模块的导入，且模板将其渲染为无子元素元素或作为值传递。来自该模块的任何其他导入，例如类型、它调用的函数或带子元素的 provider，会列为未检查。该提示会使 `--strict --next` 失败，并保持 `--strict` 原样。通用渲染器（裸 `Icon`，或每次使用都给它 icon 属性的组件）以及仅按名称匹配图标的导入，会列为未检查。

#### 新功能

- CLI 新增 `BaseTypeaheadMenu` 块：一个 BaseTypeahead，其 listbox 菜单在结果列表周围显示信息，其选取或过滤按钮会在同一图层上打开一个 dialog 角色的菜单。(#10625)

#### 问题修复

- 依赖下限移至当前发布版本：build 包需要 autoprefixer 10.6.2、browserslist 4.29.5 和 lightningcss 1.33.0；CLI 需要 ignore 7.0.14、jscodeshift 17.4.0、linkedom 0.18.15、zod 4.6.7 和 @stylexjs/babel-plugin 0.19.1；每个主题需要 lucide-react 1.66.0。peer 范围不变。(#10709)

#### 文档

- 为 `useDirection` 添加 hook 文档和交互式 sparkline 示例块，详细说明渲染时的方向处理和 CSS 逻辑属性最佳实践。(#10547)
- InternationalizationProvider 有一个日历示例：provider 的 `calendar` 属性会以日本历或佛历显示 `Calendar` 和 `DateInput`，值仍保持公历 ISO 日期。两种日历都能在没有 `Temporal` 的情况下工作。(#10135)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @josephfarina
- @nynexman4464
- @utkarshpatwa393-sys
- @vjeux

---

# 0.7.12

#### 实验性 API

- `discover` 会在官方 `@astryxdesign/lab` 组件中列出 Lab ChatVirtualizer。(#5461)
- `astryx discover` 会列出 `@astryxdesign/lab` 中的实验性 TabBar 和 TabBarItem 组件。(#9700)
- `integration check` 和 `experimental icon new-set` 会沿着 `export const X = Y` 追踪到 `Y` 声明的位置：以这种方式编写的图标集主题映射或图标导出现在会被检查和记录。(#10471)
- 图标集：当被包装的库没有附带许可证文件时，对图标集运行的 `integration check`、`experimental icon new-set --from` 和刷新会指名要添加的 NOTICE 文件及其位置，图标集指南会列出算数的文件名。从库根目录刷新会把一次一个文件添加的图标从该库移动到根导入，保留它们的 id、导出、映射条目、变体和词语，回执会在 `moved` 下列出它们。每个图标在之后每次刷新时都保留该 id 和导出，再次刷新不会改变任何内容。刷新会保留你选择的、不是库名拼写的 id（`XIcon` 的 `dismiss`），对于已经读取根导入的图标也是如此；它只会重命名当前规则拼写不同的 id。库图标若其 id 或名称已被移动的图标占用，会被省略。若某个图标的根导出已被该图标集的另一个图标读取，它会保留自己的导入，回执会说明原因。来自包中另一个文件的变体（例如实心外观）会保留自己的导入，刷新不会重新写入的每个导出都会保留在生成的模块中。`LICENSE` 目录在回执和检查中都不算许可证通知。(#10458)
- 图标集：包装一个在导出中命名其外观的大型图标库只需几秒钟，并且每个字形得到一个图标。只有实验性图标命令、图标集指南，以及对图标集运行的 `integration check` 发生变化。(#8013)

  - **大型库。** `experimental icon new-set --from` 读取一个包含 20,000 个导出的库大约需要十秒，而不是几分钟，并且在文本模式下会向 stderr 说明它正在读取以及发现了什么。`iconNewSet` 和 `iconAdd` 会通过共享的 `logger`（stderr，仅文本模式）报告大型模块的读取进度；直接调用时，它们保持静默，直到调用 `logger.setSilent(false)`。
  - **外观库。** 一个库如果导出名称以样式、尺寸和字重词结尾（`XOutline24WGHT500Icon`），且从不包含 `Up` 和 `Down` 之类的方向词，则每个字形得到一个图标，命名为 `x`（`XIcon`），采用图标集默认变体所指名的外观，否则采用库的常用默认外观；建议和 `add` 按字形命名图标，`add --variant filled --all` 为每个字形选取其填充外观，刷新会保留早期版本包装的每个图标，使用新的 `--default-variant` 刷新会把每个字形移动到该外观。记录默认变体的每条命令都会从每个图标导出绘制的外观中取得它，拒绝库中不存在的外观词，并且绝不添加图标的第二个导出。
  - **现有图标集上的变体。** `experimental icon new-set <set> --variants outline,filled` 在不带 `--from` 时声明变体（有图标的图标集保留其默认变体，若未声明任何变体，则采用其图标绘制的外观；若某图标集的库导出名不命名任何外观，刷新时也会保留它，并拒绝遗漏它的 `--variants`，拒绝信息会指名添加另一种外观的 `add --variant` 运行），而 `--display-name` 和 `--description` 会就地改写描述符；`add --variant` 会指定未声明的变体及其命令。
  - **可以照原样运行的命令。** `new-set`、`add` 和 `map` 打印的每条命令都会指名图标集，并在命令接受 `--set` 的地方带上它；`add` 列出的命令会重复 `--default` 和 `--id`；`--new-definition` 和 `new-definition` 接受定义列表所示形式的 kebab-case 名称，未知的 `--definition` 会建议一个下一条命令可接受的名称。
  - **搜索。** `experimental icon star` 不再提供 `start`，复数能匹配其单数，`go home` 能找到映射到 `home` 的图标，一两个字母绝不会匹配单词内部。
  - **检查。** 图标集自己的定义能通过 `integration check --strict`，生成的模块及其声明文件在格式化工具重写后也能通过。
  - **主题图标。** 每个 `themeIcons` 条目都由 CSS 设定为其盒子的大小，因此即使组件自己写入尺寸属性，也仍会填满主题的图标盒子。

- `astryx experimental render` 会按 TypeScript 的规则匹配 `compilerOptions.paths` 的键和目标，读取项目自己的 tsconfig.json 或 jsconfig.json（不会读取它 `extends` 的配置）。新增：`*` 可以位于键或目标的任意位置（`"theme-*-x"`、`"./icons/icon-*"`），一个键的目标会按顺序尝试，因此后续目标下的模块、样式表、图片或 JSON 文件也能被找到；`--reverse` 会把文件放回其传递路径所指名的目标下（即其文件夹与文件上方路径匹配最多的目标，包括 `*` 前带文本的目标），否则放在第一个目标下。只匹配裸说明符，目标不存在的导入会按包解析，通配的 `"*"` 键绝不会把缺失的包变成路径错误。页面从自身文件之外和 `node_modules` 之外加载的模块（例如同级包的源码）会先通过相同的别名解析裸导入，就像页面自己的文件和 TypeScript 那样，因此页面和该模块加载同一个包副本；没有别名放置的导入会按包解析，因此已安装的包即使也匹配前缀键（`"@scope/*"` 和 `@scope/realpkg`）仍能加载。渲染文件如果在途中丢失了内嵌源码（且没有可供重建的 Astryx 组件），对其运行 `--reverse` 现在会以 `ERR_RENDER_SOURCE_DAMAGED` 失败并说明，而不是 `ERR_RENDER_NOT_ASTRYX`。(#8012)
- 图标集：如果去掉库前缀后图标名称会以数字开头，例如库的 `fa0`，现在会保留该前缀：它的 id 为 `fa-0`，并导出为 `Fa0Icon`（`fa500px` 变成 `Fa500pxIcon`）。CLI 以前会写入 `0Icon`，这不是有效的 JavaScript 名称，因此生成的模块无法解析。你给出的以数字开头且没有前缀可保留的 id 会被拒绝，并提示需要一个以字母开头的 id。只有 `experimental icon new-set --from` 和 `experimental icon add` 发生变化；它们写入的图标集现在能通过 `integration check`。(#10895)
- 图标集：`experimental icon add --variant <look> --from <module> --all` 现在适用于每个外观都作为独立包发布的库，例如 Font Awesome 的 solid 和 regular 图标数据对象包。以前，它找不到可赋予该变体的图标，因为每个图标都来自另一个包。图标会从同名同类的导出中获得变体，回执会把该库中外观包未导出的图标列为缺失。包装这样的库也不再会把 pack 导出（`fas`，其他导出的对象）当作图标，因此共享的 `fa` 前缀会再次从名称中去掉。之后会以数字开头的名称会保留前缀（`fa0` 变成 `Fa0Icon`），因此生成的模块仍能解析。只有实验性图标命令和对图标集运行的 `integration check` 发生变化。(#10896)
- 图标集：在 package.json 中重命名图标集包后，下一条写入数据文件的 `experimental icon` 命令（对现有图标集运行 `new-set`，无论是否带 `--from`、`add`、`map`，或 `new-definition --icon`，即使不改变其他内容）会把新的包名写入数据文件的 `module`，并保留任何子路径（`@acme/old-icons/outline` 变成 `@acme/new-icons/outline`）。以前旧名称会保留，`integration check` 会一直失败，直到你手工编辑该文件。每条这类命令的回执都会指名新的和旧的 `module`（`Updated module to "@acme/new-icons/outline" (was "@acme/old-icons/outline"), from the package name in package.json.`），`map` 会从它替换的内容来措辞每个 `map` 条目，因此未改变的条目会说明这一点。只有实验性图标命令和图标集指南发生变化。(#10897)
- `astryx experimental render` 会绘制 recharts 图表。recharts 图表只在其 effect 运行后才绘制，而 `ResponsiveContainer` 会在浏览器中测量其父级，因此渲染页面会为每个图表显示一个空盒子。渲染现在会在服务端渲染之后，在一个没有布局的小文档中绘制页面按名称从 recharts 导入的每个图表和 `ResponsiveContainer`。容器会从自己的宽度和高度开始，或从跟随其高度的宽度开始，绘制会缩放到页面给它的宽度。`chart-size` 警告会计数渲染无法绘制的图表，并说明图表何时是单独绘制的（当页面无法在没有浏览器的情况下再次绘制，或其 effect 改变图表或重新渲染生成图表的组件时）。图表显示页面首次渲染的数据和 props；图表部件从 React context 读取的、被 effect 更改的值可能显示其后续值。(#10382)
- 来自 `@astryxdesign/cli/api` 的 `exportSearchIndex()` 和 `rankSearchIndex()` 会存储并排序 search 的候选内容。`exportSearchIndex({cwd, package})` 返回 `{version, candidates}`：即 `search()` 在某个文件夹中排序的内容，以纯 JSON 表示（带 `package` 时只包含该包的条目）。`rankSearchIndex(query, indexes, {type, limit})` 会用 search 自己的树对存储的索引排序：在项目中创建的索引会像 `search(query)` 在那里一样回答，响应相同；对于在项目外创建的索引，主题结果会指名 `theme add`，而那里的 `search` 会指名 `theme eject`。若目录列出了不得加载的包，它会在加载安全的地方创建索引，并按查询排序。索引只能由创建它的 CLI 版本排序。两者都是实验性的（可能在补丁版本中变化），它们的文档不是搜索结果，因此 `search` 和 `build` 的回答与以前完全相同。当它们晋升为稳定版后，其文档会加入 search。(#10375)

#### 新功能

- `astryx discover` 会列出 `@astryxdesign/lab` 中的 Lab DialogHeroHeaderShowcase 模板。(#10109)
- `astryx discover` 会列出 `@astryxdesign/lab` 中的 Lab DialogHeroHeader 组件。(#10108)
- BottomSheet：静止时，无论 `padding` 是多少，sheet 的内容都从抓手栏下方开始，因此第一行不再穿过栏的渐隐区域。块起始内边距绝不少于栏的高度（`--spacing-6`）：栏下方的区域不是子元素可以逃出的 padding，因此单独的 `Section` 也会从栏下方开始；滚动内容仍会从它下面经过。默认 padding 的 sheet 内容起始位置低 8 px，`padding={0}` 的 sheet 从栏下方开始，唯一子元素是 `Section` 的 sheet 会让该 Section 低 24 px 开始并增加相同的高度。Core 自己的 `padding={0}` sheet（触摸日期和时间选择器、DropdownMenu 和 ContextMenu 的 sheet，以及 PowerSearch 和 Tokenizer 的 sheet）不再自己预留该区域，因此选择器、PowerSearch 和 Tokenizer 外观不变，菜单的第一行低 8 px。CLI 的 `table-filter` 和 `table-inbox` 页面模板也去掉自己的区域，因此不会加倍。(#8558)
- ChatLayout 会把其 composer 保持在软件键盘上方，适应为此缩小的视觉视口，而不是让它留在键盘下方直到浏览器滚动整个页面。在 Android 的 Chrome 中，停靠区会随 Gboard 测量到的滑动上下移动，与键盘同步。在 iOS 的 Safari（浏览器中以及作为主屏幕应用）和 Android 的 Firefox 中，一旦浏览器报告键盘出现，它就会移动到键盘上方。当页面设置 `interactive-widget=resizes-content` 时，Chrome 会为键盘自行缩小页面，composer 保持在键盘上方而无需移动。位于最新消息的对话会留在那里，记录的其他部分仍可在 composer 上方滚动。在触摸屏的顶层页面中，进入 composer 文本的每种方式（点击、键盘的上一个和下一个按钮、Tab、输入的 `focus()`）都能到达它而不会滚动页面；在鼠标下或 iframe 内，浏览器自己的焦点行为适用。在触摸屏的顶层页面中，composer 的包装器（不含滚动到底部按钮）是一个没有名称的 group。当键盘的 Done 结束输入时，焦点停在那里（它不是 Tab 停靠点），因此下一次点击或 Tab 会从 composer 开始；它只在键盘输入后显示焦点环。点击使 composer 获得焦点时，其 click 仍会触发一次。在鼠标下或 iframe 内，包装器是普通容器。在 Reduce Motion 下，composer 绝不随 Gboard 移动：它会交叉淡入到键盘上方的位置。在鼠标下、没有软件键盘时，没有任何变化。浏览器支持指南中关于屏幕键盘的部分涵盖了 ChatLayout 的 composer。(#8176)
- `astryx` 会把像 `createReorderable` 这样被文档化为 hook 的 `create…` 工厂与 hooks 一起列出。(#8139)
- `astryx docs` 现在也会按文档树节点的裸名称，或按去掉其名称重复前缀的路由打开节点，前提是恰好只有一个节点匹配：`astryx docs tokens-color` 和 `astryx docs tokens/color` 都会打开 `tokens/tokens-color`。两个或更多节点响应同一名称时仍会失败，并给出它们一直列出的建议，实验性文档仍只能通过其标记路由打开。(#10387)
- `astryx docs --depth <levels>` 现在会在主题列表上指名每个命名空间下的文档及其打开路由，因此一次阅读就能了解所有路由，而不是每个命名空间读一次。不带 `--depth` 时列表不变，JSON 保持其结构：新的 `children` 位于每个 `meta.namespaces` 条目内。(#10393)
- 官方包发现列表现在包含 Lab 的 `LineClamp` 组件，因此 `astryx` 可以找到并描述它。(#4259)
- 表格可以对固定高度的扁平数据进行窗口化：向 `Table.virtualization` 传入 `useTableRowsVirtualization({rowHeight, initialViewportHeight})`。Table 保留完整数据和行标识，只挂载其视口中的行加上少量 overscan 行，保留原生表格语义和全表的行位置，保持聚焦行挂载，并对无法窗口化的内容或几何结构回退为渲染每一行。未选择加入的表格不变。(#8280)
- 表格插件现在可以读取某一行的位置。Table 会为每个表体行和单元格变换传入一个不可变的 `TableRowContext`（行的 key、它在完整数据中从零开始的 `logicalIndex`、行数和表头数，以及行模型）。它会为滚动包装器变换传入一个带有稳定 `viewport` 引用的 `TableRenderContext`。当插件的主体变换保持每个数据项一行时，它声明 `rowModel: 'flat'`。`useTableSelection` 和 `useTableStickyColumns` 声明了它。不带选项的 `useTableRowIndex()` 现在会从上下文为行编号（传入 `data` 仍从该数组编号），移动的行只会为读取索引的插件重新渲染。在变换期间读取上下文值；之后从回调读取会在开发环境警告。CLI 的编号行块不再传入 `data`。(#10171)
- 用 Astryx 组件替换主题展示的自定义布局、文字和图标样式。嵌入预览会在 card token 表面后方绘制主题的 body，而不是表面色的卡片带。新的独立顶部导航外壳使用主题的表面画布；嵌入视图保持无外壳。让演示输入、购物车反馈、库存过滤器和聊天在本地响应，过滤器可清除，且不提交付款。保留模板 id、图库可见性和演示内容。(#10404)

#### 问题修复

- 在 Android 上，文字会在每个主题中跟随读者的系统字体缩放，无需任何设置，前提是浏览器报告 `env(preferred-text-scale)`（已在 Chromium 和 Chrome 稳定版上验证）。根 `Theme` 会读取 `env(preferred-text-scale)` 并按它缩放每个字号，就像它在 iPhone 上已经跟随动态字体那样。以前，只有当页面添加 `<meta name="text-scale" content="scale">` 时，系统字体缩放才会到达 Astryx 文字。带有 `content="scale"` 的页面会像以前一样工作：其根字号承载缩放，根 `Theme` 不再添加。两者都不支持的浏览器看不到变化。`astryx docs typography/type-scale` 对此有描述。(#10727)
- 注释、一个 codemod 说明以及分组表格模板的示例数据不再使用内部格式标识符。(#10958)
- `astryx swizzle --list` 不再把 Core 的共享文件夹（`animator`、`gestures`、`i18n`、`internal`、`keyboard`、`motion`、`privateAttributes`、`__tests__`）列为组件。`gestures` 的副本会导入 `@astryxdesign/core/motion`，而 core 包并未导出它。(#10185)
- `astryx component` 会把主题警告打印为一行：配置的 `astryx.theme` 值或生成的主题记录中的控制和格式字符会打印为 `�`，因此 checkout 中的换行或转义序列无法改写终端。(#10764)
- `astryx docs <topic>` 会在所有受支持的 Node 上从已安装的集成读取以 `.doc.ts` 编写的主题，并在 Node 22.18 以下从链接的集成读取。主题和文档树文件现在通过与应用组件文档相同的 TypeScript 加载器加载 `.ts`，而普通导入在 `node_modules` 下会失败（“Stripping types is currently unsupported”），在 Node 22.18 以下也会失败（“Unknown file extension .ts”）。`astryx search` 也会读取已安装的 `.doc.ts` 组件文档，因此能按关键词找到组件、显示其描述，并列出某个 family 的成员。`.doc.mjs` 主题像以前一样加载。(#10763)
- 调用 CLI API 的长时间运行进程（例如文档站点的搜索路由）现在会在文档、搜索和模板读取中重新读取被编辑的 CommonJS `.doc.js` 文件。以前它会按首次加载的内容读取文档。(#10760)
- 在更改项目模块后再次读取它的命令（例如 `astryx integration add` 检查它刚写入的 manifest）现在会在没有 `"type"` 字段的包中读取 ES 模块 `.js` 文件的更改。以前它会按首次加载的内容读取模块。(#10745)
- Gothic：强调文字和强调图标在浅色媒体表面上保持可读。它们以前在那里使用 Gothic 的浅色强调色，在浅色带上接近白色（1.14:1）；现在它们跟随表面的深色强调色（在白色表面上为 18.7:1）。CLI 的 Gothic 主题模板包含相同的更改。(#10852)
- 图标集：`integration check` 现在接受生成的声明文件（`*.generated.d.ts`），即使其长类型参数被 Prettier 之类的格式化工具重新折行。以前，重新折行的行会让检查报告 `icon_generated_types_mismatch` 并失败。声明发生变化仍会导致检查失败。实验性图标命令不变。(#10898)
- Neutral：未选中的 SegmentedControl 标签在 AppShell 表面的深色模式下达到 4.5:1。轨道是半透明的，因此会提亮标签下方的表面：`#9e9e9e` 在 `#3c3c3c` 上测得 4.11:1。标签现在使用 `neutral.dark[80]`（6.46:1），与 Neutral 已经为其选中行和 pill 上的次要文字提供的提亮相同。浅色模式不变，CLI 的 Neutral 主题模板一致。(#10881)
- `astryx build`：当一个想法只在其头部之后指名某个 family（“a saml for a login”），且该 family 的基础模板不匹配任何其他词时，排名高于基础模板的变体现在保持为起点（`login-sso`，而不是 `login`），因此添加页面模板不再把这类想法翻转到基础模板。在头部指名 family 的想法（“saml login”）像以前一样开始。(#10431)
- `astryx experimental render` 在渲染页面时 Node 本身崩溃的情况下，不再以退出码 139 静默死亡。页面现在在单独的进程中渲染，因此崩溃（崩溃信号，或 Windows 上的崩溃状态）只会结束该进程，渲染会以 `ERR_RENDER_FAILED` 失败，并在消息中指名 Node 版本和路径；停止它的信号也会指名这些信息。该进程会随 CLI 结束而结束，因此永不完成的页面不会在 CLI 停止后继续存在。某些 Node 构建会在 `Intl.Segmenter` 中崩溃，Avatar 等组件用它来拆分文本：在这样的构建上，渲染会不带 `Intl.Segmenter` 再运行页面一次，并添加一条 `node-crash` 警告，指名该 Node 构建并说明输出可能略有不同（首字母中合并的 emoji、旗帜或带独立重音符号的字母），因此带 Avatar 的页面能再次渲染。(#10915)
- `astryx search` 会把更契合整个查询的结果排在前面。第一个结果保持不变。在默认限制下，以及任何 10 或以上的限制下，结果集合保持不变。较小的 `--limit` 会显示新顺序的顶部，因此可能显示不同的结果。在第一个结果之后，在每个匹配强度相同的分组内，如果某个结果的文档对查询的契合度远低于组内其他结果，它会排到它们之后。名称拼出查询中两个或更多词的结果绝不会下移；它仍然可以上移。契合度使用与 `astryx build` 挑选块相同的词义权重，因此新组件或模板会根据其自己的文档放置。查询正好是条目完整名称时保持其答案。(#10926)
- `astryx swizzle` 副本中的每个导入现在都会指名副本持有的文件或所有者包导出的路径。以前，副本会把所有离开组件文件夹的导入送到包的文件夹入口，而该入口并不导出大多数组件使用的内部辅助函数，因此 `Button`、`Dialog`、`Table` 以及约 100 个其他副本无法通过类型检查或打包。现在副本会从包导入包所导出的内容，按包的文件夹布局把它需要的每个内部模块放在旁边，并复制它导入的嵌套文件夹（例如 `Table` 的 `plugins/`）。测试辅助和说明不再复制。早期 swizzle 写入的辅助函数如果相同就会被复用，绝不会被携带它的副本替换，即使使用 `--overwrite`：不同的辅助函数会保留，新副本会以带版本后缀的名称写入自己的版本。对文件夹中持有该辅助函数的组件执行 swizzle 会把它视为该组件自己的文件之一，`--overwrite` 会替换它。私有属性所有者模块及其导入的样式模块仍是例外，与以前一样：更改过的副本在没有 `--overwrite` 时会使命令失败，有它时会被替换。修复 #3506。(#10197)
- 被 swizzle 的组件如果其源码导入另一个 Astryx 包的内部模块，例如使用 Core 手势原语的 Lab 组件，就不再导入该私有路径；但该包导出的 StyleX 模块例外，副本会继续按该路径导入它，因为它的身份就是其路径。Swizzle 会把其他这类模块及其可达内容带到副本中，放在以对应包命名的文件夹下（例如 `components/astryx/core/internal/touch.ts`）；该包的公开名称仍从包导入。(#10595)
- `astryx swizzle` 会报告副本导入的 npm 包（例如图表用的 `d3-scale`），并附带所有者包声明的版本范围，因此安装后副本即可构建。`swizzle.copy` 回执会在 `dependencies` 中列出它们，文本输出会指名要安装的包。Node 的内置模块和所有者包本身不会列出。(#10502)
- `astryx swizzle` 会在它拥有的输出文件夹（副本创建的、空的或以前标记过的文件夹）中写入一个 `astryx-swizzle.json` 标记，指名该文件夹副本来自的每个包及其版本。`@astryxdesign/build` 的 Babel、PostCSS 和 Vite 集成，以及 webpack 下的 `withAstryx()`，会在该文件夹下、`astryx-theme` 之前编译副本，因此主题的组件覆盖会像到达包组件那样到达被 swizzle 的组件。对于已经包含其他文件的文件夹，它不会写入标记，并会说明它发现了什么以及如何手工添加标记；`swizzle.copy` 回执会在新的可选 `marker` 字段中报告这一点。在 Turbopack 下以及使用原版 StyleX 插件时，副本的样式仍会位于主题之上。标记不会列在副本的文件中。(#10483)
- `table-filter` 模板的链接样式表头操作会随其自动高度设置 `minHeight: 0`，因此没有最小值使它们高于其文字。(#10588)
- `astryx template <name>` 会把拼写错误所偏离的模板排在建议的第一位：相差一两处错误的名称（添加、删除或更改一个字母，或交换两个字母，如 `AppShellCotnentOnly` 或 `dasbhoard`）会排在包含所有输入单词的模板之后。建议列表绝不会比以前更长。(#10712)
- 在 iPhone 的 Safari 中，文字会在每个主题中跟随读者的文字大小（动态字体），包括品牌主题。当浏览器通过 `font: -apple-system-body` 暴露该大小时（iPhone 的 Safari 就是这样），主题的字号会随读者在“设置”（显示与文字大小，然后更大字体）中选择的大小缩放，每个字号按其模拟的 iOS 文字样式曲线缩放：正文文字类似 Body，`heading-1` 类似 Title 1，展示文字类似 Large Title，每个角色保持顺序。主题以长度固定语义大小时，例如 Butter、Stone 和 Y2K 的 0.75rem 辅助文字，会按其默认读取步骤的曲线缩放。在默认大小下，每个字号都是主题自己的；字体族、间距、行高比例和根字号绝不变，文本输入在 iOS 上保持 16px 下限，不支持该关键字的浏览器看不到变化。没有选项、属性或文档属性：根 `Theme` 会从隐藏元素读取读者的大小。`astryx docs typography/type-scale` 对此有描述。(#10416)
- Matcha：浅色模式的次要文字稍微更深（Neutral Light 30），因此在 body（5.11:1，原为 3.83:1）、表面和卡片上达到 4.5:1。(#10932)
  [fix] Y2K：浅色模式的次要文字稍微更深（Neutral Light 35），因此在 Periwinkle body 上达到 4.5:1（5.14:1，原为 4.25:1）。CLI 的 Matcha 和 Y2K 主题模板一致。

- Butter、Stone 和 Y2K 主题用 rem 设置辅助文字（`--text-supporting-size`），而不是固定的 12px，因此当读者提高浏览器默认字体大小时，它会像其他文字一样增长。在默认大小下它仍是 12px。CLI 对这些主题的副本一致。(#10320)

#### 文档

- 新的 `Course Detail` 页面模板：一个针对单一产品的长篇销售页面，分为两栏——长文阅读（带事实行的预览海报、带技能 chip 的 about 块、按模块折叠的模块大纲、讲师卡片、带评分方面面板的评价，以及 FAQ）旁边是粘性报名栏（带划线比较价的 price、自定进度或 cohort 开始选择器，以及计算完成日期的每周进度滑块）。用 `astryx template course-detail <path>` 复制它。(#9753)
- File Explorer 页面模板使用 `StackItem` 和 `HStack` 的 `isScrollable` 来滚动其列，而不是自定义的 overflow 和 flex 样式，并在列滚动时以它列出的文件夹命名每一列。其 chevron 现在会在从右到左布局中镜像，滚动到末尾的详情窗格会保留其底部 padding。(#10421)
- `useCalendarConstraints` 的 hook 文档，使 `astryx hook useCalendarConstraints` 和 `astryx search` 能返回它，以及一个 `useCalendarConstraints — Hotel Booking Range` 示例块：一个预订日期范围选择器，强制最小/最大日期，禁用关闭的周一，并在选择入住日期后把预订上限设为 7 晚。用 `astryx template useCalendarConstraintsHookUsage <path>` 复制它。(#10151)
- `useCalendarNavigation` 的 hook 文档，使 `astryx hook useCalendarNavigation` 和 `astryx search` 能返回它，以及一个 `useCalendarNavigation — Month Pager` 示例块：一个逐月日历，带有 Previous/Next 控件、本地化的月-年表头，以及使用 `pendingFocus` 的跨月方向键导航。用 `astryx template useCalendarNavigationHookUsage <path>` 复制它。(#10154)
- `useLinkify` 的 hook 文档，使 `astryx hook useLinkify` 和 `astryx search` 能返回它，以及一个 `useLinkify — Links in a Comment Thread` 示例块：纯文本评论中 URL 和电子邮件变成 Link，自定义 `#123` 问题引用模式展示 patterns 选项，而没有匹配的评论保持纯文本。(#9969)
- 添加 usePowerSearchConfig hook 文档和一个过滤目录表示例块 (#10660)
- 添加 useTableColumnSettingsState hook 文档和一个列可见性选择器示例块 (#10652)
- 为现有 hook 文档添加一个 `useInteractiveRole — One Tile, Four Roles` 示例块：一个多态 Tile 以四种方式渲染——href 链接、onClick 按钮、Popover 触发上下文按钮、惰性内容——在一处展示解析顺序。(#9972)
- 修复 `useStreamingText — Streaming Response` 示例块：它把 `isStreaming` 传为 `false`，因此它存在所要展示的流式展示从未运行。该块现在是一个聊天风格回复卡片，带有一个 Regenerate 按钮，会分段流式输出响应——hook 在流式传输时稳定地展示它，并在结束时跳到完整文本。(#9975)
- `RichTextView`、`RichTextEditorToolbar` 和 `RichTextEditorAutoLinkPlugin` 各自附带一个文档文件，因此 `astryx component`、`astryx discover` 和文档会列出它们的 props、默认值及用法。(#10407)
- Tab 的文档展示如何给标签页提供帮助文本：通过 `Tab` 的 ref 在其上锚定一个 `Tooltip`，使描述落在标签页上，并在 `endContent` 中放一个装饰性的信息 `Icon`。`endContent` 的文档说明它是非交互的：其中的按钮、链接或 `InfoTip` 会在标签页的按钮内嵌套一个控件。(#10734)
- 分组表格页面模板使用 `useTableGroupedRows` 来分组其行，而不是手工渲染表头行和手写 `colgroup`。其列现在有表头，每个组的切换按钮是一个按钮，会报告其组是否展开，行菜单的 Move to project 箭头在从右到左布局中镜像。(#10423)
- Tailwind 指南（`astryx docs styling-libraries/tailwind`）为已经使用 Tailwind 的应用添加了一个配方：保留应用自己的 `@import "tailwindcss"`，把 `@layer` 行放在它上面，并在它之后添加 Astryx 样式表。它解释了为什么 `@layer` 行必须在 Tailwind 导入之前：放在它下面时，Astryx 的 reset 会压过每个工具类，而且不会有任何报告。Core README 的 Next.js + Tailwind 部分指向它。(#10532)
- `useInputStatusIcon — Coupon Code Status` 示例块的字段应用了 `inputWrapperStyles.textField`。从中复制的字段现在会在主指针为粗略指针时立即显示其焦点外观，与 Core 的文本字段一样。(#10649)

#### 其他变更

- 内部：doctor.mjs 和 template.mjs 已用 Prettier 格式化。任何命令的输出都没有变化。(#10988)
- 内部：图标集导出读取器复用了共享的顶层辅助函数，关于外观刷新的源码注释更短。任何命令的输出都没有变化。(#10449)
- 内部：文档导入器通过一个小模块导入每个文档文件，CLI 自己的测试项目会原生加载它，因此其测试在繁忙的机器上不再超时。任何命令的输出都没有变化。(#10740)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @bhamodi
- @cixzhang
- @HelloOjasMutreja
- @humbertovirtudes
- @jiunshinn
- @josephfarina
- @LetMeSleep8h
- @mego1123
- @rubyycheung
- @thecodebasedot
- @utkarshpatwa393-sys
- @vjeux

---

# 0.7.11

#### 新功能

- `astryx build` 对其选择器未拟合的组件 family 的 Core 块排序略有改善：块选择器的文档侧词权重会从每个块自身源码的改述中重新拟合。(#10355)

#### 问题修复

- `astryx build` 会按其选择起点的相同顺序命名两个备选页面模板，因此它为整个页面显示的三个模板就是最好的三个。起点、备选数量、块和 JSON 结构均不变。(#10357)
- `astryx build --type doc` 和 `--type theme` 现在指向 `astryx search <query> --type doc` 或 `--type theme`：build kit 没有文档或主题，因此 build 会在 stderr 上说一次，并指名能找到它们的 search。Stdout、JSON 输出和退出码不变。(#10401)
- `astryx doctor` 不再在自行导入主题的应用中警告没有接入主题。没有生成的主题模块或 package.json 的 `astryx.theme` 时，如果应用源码导入了主题的已构建模块或样式表（`theme add` 写入的导入），或把主题传给 `Theme`，并沿着模块作用域变量、`defineTheme({extends})`、re-export 和已安装包追踪到其包，`themes` 检查现在会通过并指名该文件。只有包已安装的主题或本地主题才算数。传给 `Theme` 但 doctor 无法追踪的主题（prop、函数结果、组件内声明的变量）会报告为未确认（info），而不是缺失。(#10353)
- CLI 的 semver 范围检查会把 `^0` 读作任意 0.x.y，把 `^0.0` 读作任意 0.0.y，并把连字符范围（`1.0.0 - 2.0.0`）读作包含边界，部分上界（`1.0.0 - 2`）像 npm 一样覆盖整个系列。以前，`^0` 和 `^0.0` 被锁定为单个补丁版本，连字符范围永远无法匹配，因此 `astryx doctor` 和 peer 版本检查会对声明这些范围的项目报告错误的不匹配。(#10184)
- 在尚未运行 `astryx init` 的项目中运行它的提醒不再在每条命令前打印。它现在会在命令成功后打印，每个项目每天最多一次，像每日提示一样记录在每用户状态中。它不会在 `--json` 时、命令失败后或设置了 `CI` 时打印。`astryx doctor` 仍会在其 agent-docs 检查中每次报告缺少设置。JSON 结构或退出码不变。(#10343)
- 在 Astryx 项目内的某个文件夹中，若其自己的 `package.json` 未声明 Astryx 包（例如安装了自己的 `@astryxdesign/core` 的工具文件夹），设置提醒的 `init` 命令现在会指名项目的发布版本（按从项目文件夹运行的方式）：项目自己的 CLI（如果安装了），否则是固定到项目 Core 的包运行器，例如 `npx @astryxdesign/cli@0.7.3 init`。以前它会固定响应此次运行的 CLI 版本，无论项目记录了什么。JSON 结构或退出码不变。(#10343)
- `astryx experimental render`：项目外的页面现在可以渲染。在项目外（文件夹读取不到 Core 或 CLI，且没有声明它们的 package.json），页面会从其文件夹缺失的 `@astryxdesign/*` 包以及宿主批准的集成中，从 CLI 自身运行所用的副本中获取，而不是以 ERR_RENDER_MISSING_DEPENDENCY 失败。React 和 StyleX 也来自该副本，因此页面会加载各自的单一副本，即使是在安装了自己副本的 React 应用中。当该副本的 Core 无法下载时，需要它的页面会以 ERR_VERSIONS_UNAVAILABLE 失败，与其他读取 Core 的命令一样。在项目内，页面只使用项目自己的包。(#10362)
- 指向某个主题的链接，如果某个集成以相同名称替换了它，会打开替换后的主题。在集成替换了 `theme` 或 `getting-started` 的应用中，`doctor` 曾把 Core 指向它们的链接报告为没有指名任何文档。(#10342)
- 当已安装的 Core 源码中包含组件的浏览器测试 harness（`*.spec.ts`、`*.spec.tsx`，例如 Item 的 `ItemMarkerColumns.a11y.chromium.spec.ts`）时，`swizzle` 不再复制它们：`@astryxdesign/core` 0.7.5 及更早版本，或 Core 的仓库源码。它们会导入 Playwright 和一个未发布的测试包，因此 swizzle 此类组件的项目无法通过类型检查或构建。Core 0.7.6 及以后不附带 harness，因此从这些版本 swizzle 不变。(#10230)
- `astryx theme build` 不再依赖它加载 core 组件文档的顺序。只按名称列出子组件的父文档（例如 `Avatar.doc.mjs` 列出 `AvatarStatusDot`）如果在该子组件自己的文档之后加载，会抹掉子组件自己文档声明的值；当 `Avatar.doc.mjs` 最后加载时，`avatar-status-dot` 的 `variant:success` 会被算作自定义值。构建现在会合并每个文档对某个组件的条目。(#10288)
- 当主题的已构建模块仅在注释所说构建命令上不同时（例如用 `yarn astryx` 构建的主题在 `pnpm exec astryx` 运行的环境验证），`astryx integration verify` 不再报告 `theme_module_stale`。任何其他差异仍会失败。(#10344)

#### 性能

- 紧凑或完整的 hook 列表，以及对未知 hook 名称的建议，只会列出 Core 的每个文件夹一次。以前，它们会为查找的每个 hook 再次列出文件夹。(#10324)
- 一次搜索、构建或组件读取只会列出每个文件夹一次。运行多次读取的进程（例如文档站点的搜索或 agent harness）会在文件夹保持两秒未变后复用其列表。之后条目被添加、删除或重命名后，后续读取会再次列出该文件夹。(#10274)
- 在一次操作中，组件发现会读取每个组件文档一次，组件匹配器会为每个组件的文档查找一次，而不是为它们解析的每个名称查找一次。解析 30 个只有匹配器能找到的名称（例如不同大小写的名称）会进行 14,794 次文件系统调用，而不是 305,108 次。结果不变。(#10277)

#### 文档

- Authoring 指南（Quick Start、Field reference、Building Blocks、Ship、Help 和 Make your integration work globally）现在带有 “authoring” 关键词，因此 `astryx search authoring` 会把它们列在 Authoring 概览之后，而不是 API 函数页面之后。(#10354)
- `astryx build --help` 会列出 `--type` 接受的每个值（component、hook、doc、template、theme），与无效类型错误和 build 实际运行的内容一致，并说明 `doc` 和 `theme` 会给出空的 kit，因为 kit 没有 doc 或 theme 组。有一项测试会保持帮助文本、选项、API 文档以及 build 和 search 上的错误消息命名同一组值，并检查每个值返回什么。(#10361)
- Getting Started 有一个 Upgrade 部分：用一条命令把应用列出的每个 Astryx 包升级到同一版本，然后运行 `astryx upgrade`。如果你的包管理器阻止新版本发布，请豁免整个 `@astryxdesign/*` scope，而不仅仅是其中一些包。(#10241)
- 自定义主题指南会指名本地主题的文件，包括 `theme add` 读取的同名描述符。(#10347)
- CLI 捆绑的颜色 token 文档说明状态图标颜色（`--color-icon-<status>`）会在页面或卡片上绘制状态标记，例如 StatusDot。(#10204)
- 新块 “Table — Selection in the Leading Mark”：没有 checkbox 列的行选择。每一行显示其头像，鼠标悬停时、键盘聚焦时，以及一旦选中任何内容后每一行上，checkbox 会占据头像的位置。在触摸屏上 checkbox 始终显示。它使用现有的 `useTableSelectionState`，并在名称列中渲染 checkbox，因此不涉及新的 Table API。(#10395)

#### 其他变更

- 内部：导出读取器可以报告仅类型导出，并一次遍历映射模块的整个公开表面。任何命令的输出都没有变化。(#10365)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @josephfarina
- @thecodebasedot
- @utsavo-afk
- @vjeux

---

# 0.7.10

#### 新功能

- `astryx discover` 会列出 `@astryxdesign/lab` 中的实验性 PageControl 组件。(#9684)
- `createDragToSnapPoints` 及其 hook `useDragToSnapPoints` 让拖动沿一个轴移动元素，并在释放时将其停靠在吸附点（相对于其静止位置的 px 偏移）上：最近的一个、快速轻扫超过 `flickThreshold`（默认 1008 px/s）后其方向上的下一个，或释放时向后移动则回到起始的那个。停靠会延续释放速度，`settleTo(index)` 无需拖动即可停靠，`onSettle(index)` 报告它落在哪里。`createDragToSnapPoints` 从包根导出，`useDragToSnapPoints` 从 `@astryxdesign/core/hooks` 导出；CLI 的模板各新增一个扑克牌示例。(#8658)

#### 问题修复

- 通过 `ChatComposerInput` 的 handle（`insertToken`）插入 token 现在会像输入一样通过 `onChange` 报告新值一次，并隐藏占位符。以前，受控宿主的 Send 按钮会保持禁用或发送过期的提示。`ai-chat-landing` 页面模板去掉了它以前用来在插入后同步 composer 的 input 事件变通方案。(#10167)
- CLI 不再把 `@astryxdesign/theme-neutral`、`@astryxdesign/lab` 或 `@astryxdesign/charts` 列为可选 peer。以前，在应用移除主题并升级 Core 后，包管理器可能把旧版本的主题保留为 CLI 的 peer，然后警告该主题的 Core peer 未满足。`@astryxdesign/core` 仍是 CLI 唯一可选的 peer。在 Yarn Plug'n'Play 工作区成员中，或在 `hoist: false` 的 pnpm 工作区成员中，旧的 `package.json#astryx.theme` 值为 `neutral` 现在会让 `astryx component` 警告无法解析该主题。请改用 `astryx theme add neutral` 将主题添加到应用。(#10232)

#### 文档

- 新的 `useMultiCombobox — Issue Labels` 示例块基于 `useMultiCombobox` 构建一个 Labels 字段：输入会过滤标签，方向键移动活动选项而焦点留在字段中，Enter 或点击会切换标签且列表保持打开，选中的标签会作为可移除 token 显示在字段上方。用 `astryx template useMultiComboboxHookUsage <path>` 复制它。(#9578)
- `useSnapPaging — Onboarding Pages` 示例块：Carousel 中使用 `hasSnap={useSnapPaging()}` 的 onboarding 卡片每次轻扫移动一个视图，开关通过 hook 的 `pages` 选项每次轻扫移动一张卡片。用 `astryx template CarouselSnapPaging <path>` 复制它。(#8153)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @kyu-rong
- @vjeux

---

# 0.7.9

#### 实验性 API

- `astryx discover` 会列出 `@astryxdesign/lab` 中实验性的 NavigationStack 和 NavigationScreen 组件。

#### 新功能

- `astryx discover` 会列出 `@astryxdesign/lab` 中实验性的 CircleCheckIndicator 组件。
- `astryx theme build` 会保留主题的 `componentIcons` 插槽函数。构建出的模块会从主题源导入该函数时所用的那个模块导入每个插槽函数，并在旁边以 JSON 形式写入静态插槽值，再读回同一份静态 `componentIcons` 视图，因此构建后的主题和运行时主题解析出的组件图标插槽一致。这包括从已构建主题、包或 family 基座继承的插槽。在主题文件中定义的插槽函数仍会导致构建失败：请将其移到独立模块并导入。在 `--family` 输出中，成员通过对其整个 `componentIcons` 映射的命名导出来提供自己的插槽函数。模块保留每个插槽导入，与主题源中的写法一致（`--icons-specifier` 只重写图标注册表的导入），因此当 `--out` 指向另一个目录时，模块必须能从输出目录按该说明符解析。
- 主题可以通过 `defineTheme({componentIcons})` 按插槽选择组件自身的图标角色使用哪个共享图标。第一个插槽是 `code-block-copy`：CodeBlock 的复制按钮会传入 `{copied}`，在没有主题条目的情况下会绘制 `copy`，复制后绘制 `check`。插槽值可以是共享图标名称、用于隐藏图标的 `null`、部分 `{icon, variant, size}` 请求，或返回其中之一的、依赖于插槽状态的纯函数；请求中省略的字段保留组件自身的值。对于复制按钮，`null` 只会隐藏字形。`theme.componentIcons` 会读回静态值。`ComponentIconSlotMap` 和插槽值类型由 `@astryxdesign/core/Icon` 导出。`astryx theme build` 会将静态插槽值带入构建后的主题，并在遇到插槽函数时失败，`astryx component` 会列出组件的插槽。
- `createPanGesture(element, {axis?, onPan})` 和 `usePanGesture(ref, {axis?, onPan})` 以数值形式报告元素上的拖动：在拖动开始、变化、在释放时结束或被取消时，`onPan` 会收到 `{state, translation, velocity}`，手指、鼠标和触控笔都可以触发它。从可选文本上开始的鼠标或触控笔拖动会改为选中文本；对于应当随拖动移动的文本，请设置 `user-select: none`。`axis` 将拖动限制为 `'x'` 或 `'y'`；沿另一轴的拖动不会被报告。`translation` 从拖动开始的位置起算，因此跟随它的元素不会跳变；`ended` 时的 `velocity` 是释放速度，单位为像素/秒。拖动会按 UIKit 的 10 pt 认领其触摸，并且不影响按压和长按。`destroy()` 会移除所有监听器；该 hook 会为 `ref` 背后的元素创建一个 pan，并在卸载时销毁它。
- 动效：主题的 `tempo` 现在不仅为其 CSS 时长计时，也为触摸动效的弹簧计时。每个弹簧保持其形状，耗时变为 `tempo` 倍，动画布局的滑行也是如此。手指跟踪和忙碌循环保持实测值。只有时长缩放的主题会让其弹簧保持 tempo 1，即使它位于一个设置了 tempo 的主题内也是如此。弹簧目前还不会跟随 `character`。动效文档已说明这一点。

#### 问题修复

- `astryx docs <namespace> <section>` 只加载一次项目，而不是为命名空间下的每个指南各加载一次，因此在指南很多的命名空间（例如 `astryx docs authoring <section>`）上，读取本身只需几十毫秒而不是几百毫秒。输出结果不变。
- 接管崩溃运行所留下的 release-cache 锁的运行过程，现在也会根据原始命令行识别该运行留下的 npm 安装进程（即 npm 在重命名其进程之前显示的样子），即使 Node 自身的文件名不叫 `node`，例如 `nodejs` 或 `node-linux-x64`。
- `astryx build` 搜索背后的词法排序器会对搜索收集的候选进行排序，并以同样的方式复用。同一文件夹中针对同一 `type` 的后续查询，只有在某个输入发生变化时才会重新收集。在长期运行的调用方中，构建之后接着构建或搜索时，不再重新读取每个组件、hook、文档、模板和主题。构建之后的搜索也不再重新读取它们。结果不变。
- 在 Neutral 主题下，选中行、日历范围以及 Neutral 表面上的其他选中填充色再次清晰可见，高亮的代码行也更明显。`--color-accent-muted` 在深色模式下与表面颜色相同，在浅色模式下与悬停色调几乎没有差别；现在它在浅色模式下为 `#d4d4d4`，深色模式下为 `#474747`。在深色模式下，选中的 Item、TreeListItem 或勾选的 CheckboxListItem 行、带编号的 Citation 以及 FileInput 拖放区会提亮其次要文本，使其在填充色上保持可读；拖放区的提示文本在静止状态下也略微变亮。Neutral 的代码注释、运算符和标点略微提高了对比度，使其在高亮行上保持可读。CLI 的 Neutral 主题模板也带有相同的值。
- 内置主题的深色模式强调色（`--color-accent`）现在是 `#0171E3`，而不是 `#2694FE`，因此强调色填充上的白色文本（例如静止状态下主 Button 的标签）达到 4.5:1（4.70:1，此前为 3.11:1）。悬停和按下的主 Button 也有所改善（约为 4.36:1 和 4.03:1，此前低于 3:1），但仍低于 4.5:1。浅色模式保持 `#0064E0`。深色模式下用 `--color-accent` 绘制的其他内容也会变深：强调色填充、聚焦环和强调色图标。MetadataList 的 "Show more"、Table 的排序等级和 DateRangeInput 已应用的预设现在使用 `--color-text-accent`，因此其文本在深色表面上保持可读。`astryx theme template` 写出的主题模板使用相同的深色强调色，生成的色彩令牌文档也会列出它。要保留之前的外观，主题可以设置 `'--color-accent': ['#0064E0', '#2694FE']`。
- `astryx swizzle` 在报告之前不再运行 `gh auth status`：当 `gh` 在 PATH 中时（无需运行它即可发现），会显示已就绪的 `gh issue create` 行，因此复制过程永远不会等待进程启动或 GitHub 响应。现在，即使 `gh` 已安装但未登录，也会显示该行；运行它时，gh 会提示你登录。
- `astryx swizzle` 现在会按组件导入的私有属性所有者模块以及它们需要的未导出样式模块，复制到包布局中副本的旁边。经过 swizzle 的 `Item`、`CheckboxList`、`RadioList` 或 `TreeList` 不再导入 `@astryxdesign/core` 未导出的 `privateAttributes/*.stylex` 子路径。第二次 swizzle 会复用相同的副本，并在没有 `--overwrite` 的情况下拒绝修改过的副本。回执的 `files` 和 `filesCopied` 会包含它复制的模块。
- `astryx theme build` 会从它加载的源中读取主题的图标导入：构建期间就地保存的主题现在会带着其导入进行构建，或者失败并在下次保存时构建，而不是生成一个没有该导入的模块。
- theme：为自定义 Text 变体支持 `CustomTextTypes` 模块扩展（#5013）

#### 性能

- `astryx search` 和 `astryx build` 每次运行只读取一次 Core 的 exports 映射，而不是每个组件读取一次。配合其他读取器，一次搜索现在读取 Core 的 package.json 10 次，而不是 183 次。结果不变。
- 当已加载的集成都没有提供模板时，集成问题检查不再导入每个 Core 模板文档。在集成只提供图标集的项目中，`astryx doctor` 现在不会导入它们中的任何一个。
- 未加载任何集成时，集成问题检查不再导入每个 Core 模板文档。`astryx discover` 以及不带 `--showcase` 或 `--blocks` 的 `astryx component` 现在都不会导入它们。
- 集成清单写入器只在修改清单时才加载代码重写工具包。在项目外的 `astryx component`、`astryx theme list` 和 `astryx doctor` 不再加载它，组件查找加载的模块数量减少约 70 个。
- `astryx search` 和 `astryx build` 只在目录列表包含该组件名称的 Core 文件夹中查找组件文档，而不是在每个文件夹中查找。一次搜索执行的文件检查次数约为之前的四分之一。结果不变。
- 在配置中未指定 `debug` 或 `integrations` 的项目之外，`astryx --version` 不再加载项目、集成和代码重写模块。在没有项目配置的文件夹中，它使用的 CPU 减少约四分之三。未安装集成时，`astryx docs` 和 `astryx hook --list` 会加载项目，但不加载代码重写模块。输出和退出码不变。
- `astryx search` 和 `astryx build` 对它们评分的每个条目只计算一次查询词的形式，而不是每次比较单词时计算一次。结果不变。
- `astryx search` 和 `astryx build` 只在可能计入的最大编辑次数范围内计算拼写错误的编辑距离。模糊匹配现在计算的表格单元少得多，结果不变。
- 针对当前 Core 的独立 `astryx theme build` 只在主题导入 Core 根入口时才加载它。只导入 `@astryxdesign/core/theme` 的主题不再加载整个 Core 及其组件。family 构建和针对旧版 Core 的构建仍会加载根入口。有些构建会把 Core 交给主题：family 构建、针对旧版 Core 的构建，以及所在文件夹没有 Core 的主题。在这些情况下，如果主题导入了 Core 根入口的 `require()` 而无法加载（例如在顶层 await 的主题），会以 `ERR_THEME_LOAD` 失败。错误信息会指出该根入口。
- `astryx doctor` 的主题检查、family 构建以及针对旧版 Core 的构建会延迟加载已安装 Core 的根入口。只有当主题或其某个 `.cjs` 依赖导入它时才会加载。对于这些场景，不导入 Core 根入口的主题不再加载整个 Core 及其组件。

#### 文档

- 日历指南说明 `Calendar`、`DateInput`、`DateRangeInput` 和 `DateTimeInput` 显示公历，除非应用选择其他日历。（#9842）
- 为 `useCalendarDays` 添加 hook 文档，使 `astryx hook useCalendarDays` 和 `astryx search` 能返回它；并新增 `useCalendarDays — Month Grid` 示例块：用该 hook 的 `weeks` 和 `dayNames` 构建的紧凑月历表格，上一月和下一月的日期变暗，还有一个 "Week starts on" 控件（周日或周一）会重新排列表头和网格。可用 `astryx template useCalendarDaysHookUsage <path>` 复制。
- 为 `useIcon` 添加 hook 文档，使 `astryx hook useIcon` 和 `astryx search` 能返回它；并新增 `useIcon — Status Row` 示例块：自定义状态行用 `useIcon` 绘制成功、警告和错误图标，在覆盖这些图标的 Theme 下，同一行会绘制主题的图标。可用 `astryx template useIconHookUsage <path>` 复制。
- 为 `useLinkComponent` 添加 hook 文档，使 `astryx hook useLinkComponent` 和 `astryx search` 能返回它；并新增 `useLinkComponent — Article Cards` 示例块：自定义 Article 卡片用该 hook 解析出的组件渲染标题链接。在接入客户端路由器的 LinkProvider 内，标题导航无需页面加载；即使在 provider 内，`as="a"` 也会给出原生锚点；在 provider 外，标题会回退到上一层 provider 或原生锚点。可用 `astryx template useLinkComponentHookUsage <path>` 复制。
- 为 `useOverlay` 添加 hook 文档，使 `astryx hook useOverlay` 和 `astryx search` 能返回它；并新增 `useOverlay — Product Quick View` 示例块：商品 Card 展开该 hook 的 `containerRef` 和 `containerProps`，并在其图片上渲染一次返回的遮罩。悬停卡片或将键盘焦点移入卡片时，会显示 Quick view 按钮，而它前面的图片链接让 Tab 可以到达该按钮。可用 `astryx template useOverlayHookUsage <path>` 复制。
- 为 `useTableSortableState` 添加 hook 文档，使 `astryx hook useTableSortableState` 和 `astryx search` 能返回它；并新增 `useTableSortableState — Multi-Sort Orders` 示例块：一个自身没有排序代码的订单 Table，先点击 Customer 再按住 Shift 点击 Total，会先按客户再按总计排序。可用 `astryx template useTableSortableStateHookUsage <path>` 复制。
- 国际化新增一篇简短的“其他日历”指南：在 `InternationalizationProvider` 或 `Calendar` 上选择日历，值仍保持公历 ISO 日期，大多数日历需要 `Temporal`（在缺失的地方加载 `temporal-polyfill/full/global`）。新的 `astryx docs calendars` 命名空间提供了详细信息：支持的日历、在服务器和浏览器中加载 `Temporal`、为什么阴阳历（`chinese`、`dangi`）在不同运行时之间可能相差一天，以及 ISO 8601 周数。指南和 `Calendar` 的 `calendar` 属性文档说明了如何为这些日历获得一致的服务端和浏览器标记：在两端使用 `temporal-polyfill/full/shim` 的 `installImplementation()`，因为 `full/global` 导入会保留原生 `Temporal`。
- InfoTip：组件页面、`astryx component InfoTip --showcase` 和 `astryx component InfoTip --blocks` 现在都有完整的示例——一个展示指标标签、一行指标定义，以及带权限说明的只读设置。InfoTip 的文档列出了其构成（触发按钮、信息图标、帮助表面），并说明它遵循 toggletip 模式：当帮助固定时，按钮报告 `aria-expanded="true"`，屏幕阅读器在固定时朗读一次帮助。
- `usePanGesture` 页面以一个并排展示两种形式的可拖动盒子开场：hook 和可接受任意元素的 `createPanGesture`，两者使用相同的 StyleX 样式和 Astryx 令牌。扑克牌示例作为高级示例紧随其后。`createPanGesture` 页面指向该示例，`usePanGesture` 指南则警告不要将拖动偏移保存在大型组件的状态中。
- 新增的 `useClickableContainer — Clickable Project Card` 示例块使用 `useClickableContainer` 让项目卡片随处可点击：点击卡片会跟随其标题链接，而 Star 按钮、所有者链接和文本选择保持各自的行为，Ctrl/Cmd+点击或中键点击会在新标签页中打开项目。可用 `astryx template useClickableContainerHookUsage <path>` 复制。
- 新增的 `useImageMode — Photo Caption` 示例块展示照片天空上的说明文字。`useImageMode` 只采样说明文字下方的那一条区域，`MediaTheme` 根据结果给说明文字使用浅色或深色文本。Beach 照片开关会将夜景照片换成明亮的沙滩照片，在新照片加载期间说明文字保持深色回退。可用 `astryx template useImageModeHookUsage <path>` 复制。
- 新增的 `useInputContainer — Search Field Wrapper` 示例块构建一个自定义搜索框，带有前置搜索图标、内边距和后置 Clear 按钮。点击图标或内边距时，`useInputContainer` 会将焦点放入输入框，而点击 Clear 仍由 Clear 处理。可用 `astryx template useInputContainerHookUsage <path>` 复制。
- 一个 `useMergedRefs — AutoGrowTextArea` 示例块：AutoGrowTextArea 转发调用方的 ref，并保留自己的 ref 来测量高度，合并后的 ref 会将两者附加到同一个 textarea，因此当父级按钮通过转发的 ref 聚焦它时，它会自行调整大小。可用 `astryx template useMergedRefsHookUsage <path>` 复制。
- 新增的 `useScrollLock — Full-screen Mobile Menu` 示例块从 Menu 按钮打开自定义全屏菜单，并用 `useScrollLock` 锁定其后的页面，使页面既不滚动也不横向偏移，关闭菜单后读者回到相同的滚动位置。可用 `astryx template useScrollLockHookUsage <path>` 复制。
- 新增的 `useScrollOverflow — Filter Strip Edge Fades` 示例块展示一行可横向滚动的活动筛选器，只在 `useScrollOverflow` 报告存在隐藏筛选器的那一侧边缘淡出。添加或移除筛选器会更新淡出效果，切换到从右到左会将起始边缘移到右侧。可用 `astryx template useScrollOverflowHookUsage <path>` 复制。

#### 其他变更

- 内部：搜索收集在它自己的目录列表缓存操作中运行，因此直接收集候选的调用方每个文件夹大约只列出一次，正如 `astryx search` 已经做的那样。命令的结果和输出不变。不从包入口点导出。
- 内部：CLI 的进程内测试辅助工具只构建其参数所需的命令，与直接运行 bin 时一样。
- CLI 的测试设置会在 Core 的构建比其源代码或翻译旧时重新构建 Core。它会在任何测试开始前完成，因此复用的检出不再用旧的 Core 构建来测试 CLI。等待另一个构建的测试只会在该构建完成后读取它。一个检出的构建不再拖延另一个检出的测试。当较早的运行正在使用检出中的 Core 而某次运行无法重建过期的 Core 时，会以指明该运行的错误停止。
- PowerSearch 的块示例适配手机尺寸的屏幕。每个块通过网格列 `minmax(0, <width>)` 设置其字段宽度：空间足够时使用旧宽度，空间不足时使用容器的宽度。Search with Table 块在窄屏上表格会在其自身框架内滚动，而不会撑宽示例。
- 内部：主搜索器的测试会检查每个查询的计数约定，而不是八个查询的字节总数。
- Tokenizer 的块以及 table-inbox 和 work-item-detail 页面模板遵循 Tokenizer 的 `'adaptive'` 默认值，因此在紧凑的触摸屏上会显示底部抽屉。它们的 `endContent` 和 `renderToken` 在那里与在内联字段中一样工作；`hasClear` 和溢出模式适用于内联字段，Clear 和 Overflow 块已说明这一点。规则是：文档示例遵循 `adaptive`；作为内联字段几何布局测试固定装置的 stories（Caret 位置、逻辑顺序、RTL 末端通道、末端通道旁的长令牌）保持 `presentation="popover"`。table-inbox 和 work-item-detail 的后退箭头会在从右到左时镜像。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @imdreamrunner
- @jibin7jose
- @MannXo
- @nynexman4464
- @Sainath-Reddy7
- @vjeux

---

# 0.7.8

#### 实验性 API

- `astryx` 的发现列表会列出 lab 新增的 `SelectableCardGroup`。

#### 新功能

- 在 Android 上的 Chrome 中，使用触摸屏时，Tall BottomSheet 会在 Chrome 报告屏幕键盘时把聚焦的字段放在键盘正上方，然后随 Gboard 剩余的滑入过程移动；在隐藏过程中，抽屉的滚动空间保持不变，而其内容向下移动，因此键盘仍在屏幕上时不会发生跳变。在“减少动态效果”下，它改为交叉淡化而不是移动。浏览器支持指南已说明这一点。
- 组件文档可以通过 `deprecated: {replacement, description}` 标记其组件已弃用：要改用组件的 `name` 以及现代化迁移路线。该组件的 `astryx search` 结果和 `astryx build` kit 条目会以 `deprecated` 携带该字段（文本输出中为一行 `deprecated:`），文档站点会在组件页面的页眉中显示 Deprecated 徽章（位于任何稳定性徽章旁边），并在页面顶部显示一条通知，指明并链接替代组件，同时在其组件索引磁贴和站点搜索中标记为 Deprecated。`BottomSheetSwitcher` 设置了该字段，并指定 `BottomSheet`；该组件仍可照常工作。
- `createAnimator(element)` 及其 hook `useAnimator(ref)` 使用 Astryx 组件所用的动效为一个元素制作动画；该 hook 接收元素的 ref，因此手势 hook 可以共享该元素。`animate` 会按状态变化的动效将 `x`、`y`、`scale`、`rotate` 和 `opacity` 弹簧到目标值，`decay` 会从释放速度开始让其中任意值滑行，`set` 会立即跳变，`get` 和 `getVelocity` 用于读取，`stop` 用于停止；`animate` 和 `decay` 返回 promise。每次调用都计划支持“减少动态效果”。`createAnimator` 从包根导出，`useAnimator` 从 `@astryxdesign/core/hooks` 导出；CLI 的模板为每个都新增了一个扑克牌示例。
- `astryx upgrade` 新增 `promote-tokenizer-presentation` codemod。它会把 Tokenizer 上静态的 `experimental={{presentation: x}}`（Tokenizer 不再读取的 0.7.7 写法）重写为 `presentation={x}`。在无法证明可以重写的地方（包括任何展开 props 的 Tokenizer，因为展开也可能设置 `presentation`），它会保留调用不变并留下 TODO。

#### 问题修复

- `astryx component` 会把组件精确名称的其他大小写形式视为该组件，绝不会视为仅仅拼写相同的模块。`tokenizer` 会打开 Tokenizer 的文档，而不是它以前通过 `CodeBlock/tokenizer.ts` 到达的 CodeBlock 文档。对 `tokenizer`、`slider`、`switch` 或 `progressBar` 使用 `--source` 时，不再打印 `CodeBlock/tokenizer.ts` 或 `motion/uikit/` 中的动效表，而是像 `--source badge` 一样返回 `ERR_NO_SOURCE`。
- 主题令牌 `--duration-exit`（标准的关闭时长）现在存在。它默认是 `var(--duration-fast)`，因此通过该令牌跟随主题的 `tempo`，主题也可以像任何时长令牌一样设置它。此前，读取 `var(--duration-exit)` 的主题或组件找不到值。动效和令牌文档以及主题模板的令牌列表都提到了它。

#### 性能

- 来自 `@astryxdesign/cli/api` 的 `integrationComponentConflicts()`、`integrationDocConflicts()` 和 `integrationCheck()`，以及 `doctor integration components`、`doctor integration docs` 和 `integration check`，会从它们已经读取的文件夹列表中查找 Core 的组件，文件系统调用大大减少。结果不变。
- 运行 `astryx` 只加载它指定的命令，因此启动时的工作量更少：`astryx --version` 使用的 CPU 减少约 0.31 秒，`astryx docs --json`、`astryx component --list` 和 `astryx theme build` 减少约 0.25–0.3 秒。帮助、清单和未知命令仍会加载所有命令。输出和退出码不变。
- `astryx search` 和 `astryx build` 只有在查询可能匹配某个页面所渲染的组件时，才会解析页面模板的源代码以获取这些组件。对于没有页面渲染的查询，只会解析少数包含转义符的页面源码，首次搜索它使用的 CPU 减少约 20%。其用词在大多数页面上都指名组件的查询仍会解析其中大多数页面，CPU 最多增加约 4%。结果不变。

#### 文档

- 浏览器支持指南新增了关于屏幕键盘的一节：完全展开的 Tall BottomSheet 会将其测量为布局视口高度减去视觉视口高度，并在 iOS 上的 Safari、Android 上的 Firefox 和 Android 上的 Chrome 中让聚焦字段保持在其上方。在 Chrome 中，默认情况下（`interactive-widget=resizes-visual`），抽屉会在 Chrome 报告键盘后增加其滚动空间；使用 `interactive-widget=resizes-content` 时，Chrome 会自行因键盘缩小页面，抽屉不做任何改变。你的应用拥有自己的视口 `<meta>` 元素；Astryx 从不设置它。
- 为 `useLightbox` 添加 hook 文档，使 `astryx hook useLightbox` 和 `astryx search` 能返回它；并新增 `useLightbox — Gallery Grid` 示例块：一个照片缩略图网格，点击某一项会打开全屏画廊。
- 新增的 `useAnnounce — Filter Result Count` 示例块在商品筛选器上展示该 hook：输入停顿 500 毫秒后，屏幕阅读器会朗读结果数量（"3 results" 或 "No results"）。该计数有自己的 `hasReplace` 实例，正如该 hook 的文档为变化的值所建议的那样。可用 `astryx template useAnnounceHookUsage <path>` 复制。
- 新增的 `useClipboard — Share Link` 示例块在分享卡片上展示该 hook：Copy 写入邀请链接，`isCopied` 为 true 时按钮显示 "Copied"，并按该 hook 的计时器重置，屏幕阅读器会朗读 "Link copied"。可用 `astryx template useClipboardHookUsage <path>` 复制。
- 新增的 `useFocusTrap — Quick Edit Panel` 示例块将焦点困在并非基于 Dialog 构建的自定义快速编辑面板中：`focusFirst` 在打开时将焦点移到其字段，Tab 和 Shift+Tab 保持在面板内，Escape 通过 `onEscape` 关闭它，关闭后焦点返回 Quick edit 按钮。可用 `astryx template useFocusTrapHookUsage <path>` 复制。
- 新增的 `useHotkeys — Search and Help Shortcuts` 示例块在页面页眉上展示该 hook："/" 聚焦搜索字段，"?" 打开快捷键帮助，在字段中输入这两个字符不会触发它们，开关可通过 `isDisabled` 关闭单键快捷键。可用 `astryx template useHotkeysHookUsage <path>` 复制。
- 新增的 `useInputStatusIcon — Coupon Code Status` 示例块展示一个自定义的带边框输入框，其状态提示来自 `useInputStatusIcon`：错误代码显示错误状态，有效代码显示成功状态，变体开关在以下三者之间切换：下方带消息的字形（attached）、字段上无图标（detached），以及键盘和屏幕阅读器用户可达的带工具提示的可聚焦按钮（tooltip）。可用 `astryx template useInputStatusIconHookUsage <path>` 复制。
- `useKeyboardHint — Arrow-key Hint` 示例块现在直接调用 `useKeyboardHint`，而不是依赖内部调用该 hook 的 Toolbar。它是一个只有一处 Tab 停留点的五星评分，左右方向键改变评分：Tab 进入时会显示 "← → to navigate" 提示，第一次按方向键会关闭提示，再次 Tab 进入时不再显示。可用 `astryx template useKeyboardHintHookUsage <path>` 复制。
- 新增的 `useLocale — Invoice Summary` 示例块使用 `useLocale` 提供的区域设置，通过 `Intl` 格式化发票日期和金额，因此将 provider 从英语切换到德语会把 "Nov 2, 2026 · $1,234.50" 变为 "2. Nov. 2026 · 1.234,50 $"，无需第二个区域设置来源。可用 `astryx template useLocaleHookUsage <path>` 复制。
- 新增的 `useScrollableArea — Activity Log Panel` 示例块展示一个固定高度、条目可滚动的工作日志。`useScrollableArea` 只在条目溢出时让面板成为键盘 Tab 停留点，只在条目隐藏的位置显示顶部或底部边缘阴影，并阻止在末尾继续滚动时滚动页面。添加条目会把它从不可滚动变为可滚动。可用 `astryx template useScrollableAreaHookUsage <path>` 复制。
- 新增的 `useTreeFocus — Keyboard File Tree` 示例块用带树角色的普通行构建一个小型文件树，并通过 `useTreeFocus` 赋予它 WAI-ARIA 树键盘模型：方向键在可见行之间移动并打开、进入、离开或关闭文件夹，Home 和 End 跳到两端，输入字母会跳到匹配的名称，Enter 打开文件，其中一行是 Tab 停留点。可用 `astryx template useTreeFocusHookUsage <path>` 复制。
- 新增的 `useTypeahead — Type to Focus a Country` 示例块为按钮国家列表添加了键入聚焦。输入 "can" 会聚焦 Canada，反复按 "b" 会在 Belgium、Brazil 和 Bulgaria 之间循环，"e" 会找到 Éire 并忽略重音。`useTypeahead` 通过 `onMatch` 报告每个匹配项，`useListFocus` 移动焦点。可用 `astryx template useTypeaheadHookUsage <path>` 复制。

#### 其他变更

- 内部：`astryx doctor --built` 背后的文件读取将文件上限作为选项，默认 20,000，除非调用方传入其他值，检查的消息会指明读取所用的上限。命令的检查和输出不变。不从包入口点导出。
- `astryx discover` 不再列出 Lab 组件 `MobileTokenizer` 和 `MobilePowerSearch`，它们已从 `@astryxdesign/lab` 移除；它们的触摸流程是 Core 的 Tokenizer 和 PowerSearch 的 `presentation` 抽屉。
- 内部：公共导入检查的 `declaredTargets` 和 `missingNames` 从它们的基础模块导出，因此文档站点的生产注册表按照相同的规则判断复制示例的导入。CLI 的检查及其输出不变。不从包入口点导出。
- 内部：缺口报告处理程序的时间预算在其模块加载后开始。启动其 worker 和加载模块使用默认截止时间，因此在繁忙机器上，契约测试中的短预算不再覆盖缓慢的启动。30 秒的处理程序预算不变。
- 内部：生成 CLI 的类型声明时，不再因同一台机器上两个检出的构建同时运行而失败，也不再需要 PATH 中有 pnpm。
- 显示底部抽屉不渲染的属性（`hasClear`、`endContent`、`tokenOverflowBehavior`、`hasEntriesOnFocus`、`renderToken`）的 Tokenizer 块和页面模板会传入 `presentation="popover"`，因此在 Tokenizer 新的 `'adaptive'` 默认值下，它们在手机上仍保持内联字段。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @10k11
- @cixzhang
- @Geervan
- @imdreamrunner
- @kyu-rong
- @MannXo
- @vjeux

---

# 0.7.7

#### 新组件

- `astryx discover` 不再将 `InfoTip` 列在 `@astryxdesign/lab` 提供的组件中：InfoTip 现在是 Core 组件，由 `astryx component InfoTip` 描述。

#### 性能

- 使用 TypeScript 5.3 或更高版本时，来自 `@astryxdesign/cli/api` 的 `validateIntegration()`、`integrationComponentConflicts()` 和 `integrationCheck()`，以及运行它们的命令，会在同一进程内为后续以相同方式解析该文件的检查复用每个已解析的 TypeScript 文件（在文件未更改期间），而不是为每个检查重新解析。结果不变。

#### 文档

- 为 `useOutlineFromMarkdown` 添加 hook 文档，使 `astryx hook useOutlineFromMarkdown` 和 `astryx search` 能返回它；并新增 `useOutlineFromMarkdown — Docs Article` 示例块：一篇 Markdown 文章和通过该 hook 从同一字符串构建的 Outline，还有一个按钮用于添加一节及其链接条目。
- `usePressFeedback — Pressable Card` 示例现在以真实扑克牌比例展示一张小卡片，带有角标、完整牌面和带图案的背面，下方有一行说明可以尝试什么：按住查看按压效果，点击、单击、按 Enter 或空格翻面。复制该示例（`astryx template`、文档站点的 Code 选项卡和 Install）仍然只会给你 Card 上的 hook（`width={120}`、`padding={1}`）和一个 `<Text>` 占位符：提示行会被省略，而不是被替换。
- 新增的 `useCombobox — Assign To Field` 示例块将 `useCombobox` 的字段、列表框和选项 props 展开到 `TextInput` 和 `Item` 行列表上：输入会筛选队友列表，ArrowUp 和 ArrowDown 移动活动选项而焦点留在输入框中，Enter 或按压会选择一个，Escape 关闭列表。可用 `astryx template useComboboxHookUsage <path>` 复制。
- 新增的 `useGridFocus — Color Swatch Grid` 示例块将 `useGridFocus` 接入每行八个的颜色色板选择器：网格有一个 Tab 停留点，方向键逐格移动焦点，Home 和 End 在行内跳转，Ctrl+Home 和 Ctrl+End 跳到角落。每个色板都是按钮，因此 Enter 或点击会选择它。可用 `astryx template useGridFocusHookUsage <path>` 复制。
- 新增的 `useListFocus — Recent Files` 示例块通过 `useListFocus` 为按钮列表提供键盘导航：ArrowUp 和 ArrowDown 在行之间移动，Home 和 End 跳到第一行和最后一行，焦点在两端循环，只有一行位于 Tab 顺序中。可用 `astryx template useListFocusHookUsage <path>` 复制。
- 新增的 `useOverflow — Editor Toolbar` 示例块单独展示该 hook：八个工具栏操作位于一个可调整大小的卡片中，该行的隐藏副本包含所有操作以及标记为 `data-overflow-indicator` 的 `More` 菜单，放不下的操作会移入 `More` 菜单且不会闪烁。可用 `astryx template useOverflowHookUsage <path>` 复制。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @hskl18
- @kyu-rong
- @maheshrijal
- @vjeux

---

# 0.7.6

#### 新功能

- 当模板导入 Astryx 仅用于文档的演示内容时，`astryx template <name> <path>`、`astryx template <name>`、`astryx template <name> --skeleton` 和 `astryx component <Name> --showcase` 会将每个演示内容元素替换为标记的 `<Text>Card content</Text>` 占位符并移除演示内容导入，因此它们分发的代码永远不会导入只有 Astryx 自己的预览才有的模块。当文件中自己的 Astryx `Text` 导入在作用域内时，占位符使用该导入；否则导入 `Text`，如果文件已使用该名称则使用别名。`template.copy` 和 `template.show` 新增 `demoContentReplaced`（模板未包含演示内容时为 0），它们的文本输出会说明有多少元素变成了占位符，`template.show` 和 `template.skeleton` 列出的 `components` 是返回源代码的组件。目前还没有已发布的模板使用演示内容，因此每个当前模板的复制、展示和大纲都与之前完全一样。文档站点对块或页面的 shadcn 安装应用相同的替换，并替换演示媒体，每个都带有标记的占位符：图片使用占位符图片，视频使用 `data:,placeholder-video-add-your-own` 源。条目的描述会说明替换了多少引用和元素。相邻的 `.astryx/<item>.json` 回执保持其当前形状，因此每个已发布的 `astryx upgrade` 仍可读取它。（#9430）
- 主题的 `motion` 在时长缩放之外还有两个旋钮：`tempo`（0.75–1.5）缩放每个动效时长，`character`（`'crisp'`、`'standard'` 或 `'expressive'`）设置新的 `--ease-entrance` 和 `--ease-move` 令牌；`--ease-exit` 在每个 character 下保持不变。它们的类型 `ThemeMotionConfig`、`ThemeMotionKnobs` 和 `MotionCharacter` 已导出。没有这些设置的主题渲染效果与之前完全相同；时长缩放和显式令牌优先于旋钮，Spinner 和 Skeleton 的循环在每个 tempo 下保持其计时，按压释放淡出在用户设置下遵循 tempo，直到 200 ms 的“减少动态效果”上限。弹簧尚未读取这些旋钮。动效、令牌和主题编写文档以及主题模板描述了这些旋钮。（#8661）

#### 问题修复

- BottomSheet 清单示例使用 CheckboxList，因此整行都可以切换，而不只是标签（#9533）
- 动效指南现在说明，在“减少动态效果”下，组件在手指下会交叉淡化，在鼠标下会立即变化；原地变化的值（例如进度填充）在任何指针下都会立即采用新值（design:reduced-motion DR1–DR3）。（#8615）
- 已发布的包不再包含仓库的测试和基准测试文件，在不改变导出的情况下减小了安装体积。（#9153）

#### 性能

- 在一个进程中多次调用 `@astryxdesign/cli/api` 的 `integrationComponentConflicts()` 或 `integrationCheck()` 时，现在每个包 `tsconfig.json` 包含的每个 TypeScript 文件在未更改期间只读取一次，而不是每次调用都读取。单次 `astryx doctor integration components` 或 `astryx integration check` 运行不变。（#9422）
- `search()` 会共享仍在运行的目录收集：在同一长期运行的进程中同时开始的搜索（例如文档站点启动后立即进行的搜索）现在只收集一次，而不是各自收集一次（#9460）

#### 文档

- 新增的 `useCollator — Locale-aware Name Sort` 示例块使用 `useCollator` 的比较函数对姓名列表排序：带重音和小写的姓名会落在读者期望的位置，将 provider 的区域设置切换为瑞典语后，Å 和 Ö 会移到 Z 之后。可用 `astryx template useCollatorHookUsage <path>` 复制。（#9510）
- 新增的 `usePressFeedback — Pressable Card` 示例块在 Astryx Card 上展示该 hook：该 hook 的标记和 `interactionOverlayStyles.backgroundImage` 覆盖层直接放在 Card 上，因此按下卡片会像每个 Astryx 可按压组件一样使其变暗（在手指或鼠标下；Enter 或空格会翻面），`focusOutlineStyles.focusVisible` 为键盘用户提供共享的 Astryx 聚焦环。可用 `astryx template usePressFeedbackHookUsage <path>` 复制；它展示的仅文档用的扑克牌会变成用于你自己内容的 `<Text>` 占位符。（#9431）
- 新增的 `useToast — Settings Saved` 示例块在设置表单上调用 `useToast` 返回的函数：保存会显示带有 Undo 操作的 "Settings saved" toast，其 `uniqueID` 使第二次保存替换该 toast 而不是再堆叠一个，保存失败则改为显示错误 toast。可用 `astryx template useToastHookUsage <path>` 复制。（#9512）
- 新增的 `useTranslator — Load More Footer` 示例块从 `useTranslator` 返回的函数获取列表页脚的 "Load more" 标签及其 "Showing 3 of 9" 计数。应用自己的消息键通过 `InternationalizationProvider` 按区域设置提供，因此将 provider 切换为法语会改变这两个字符串。可用 `astryx template useTranslatorHookUsage <path>` 复制。（#9573）

#### 其他变更

- 在发布输出返回 main 时保留了 v0.7.5 升级 codemod 注册表（#9086），因此 v0.7.6 CLI 继续提供该迁移。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @divyanshudhruv
- @kyu-rong
- @MannXo
- @parinith-web
- @vjeux

---

# 0.7.5

#### 实验性 API

- 新命令 `astryx experimental render <page>` 将使用你安装的 Astryx 组件构建的页面转换为一个自包含的 HTML 文件。该文件无需网络和脚本，遵循浅色和深色模式，并携带页面源代码；`astryx experimental render --reverse <file.html>` 会将该源代码写回。警告会指出任何可能看起来不符合预期的地方。实验性命令可能在任何补丁版本中更改或移除。指南：`astryx docs cli/experimental/render-pages`。
- 从图标库构建图标集包所需的步骤和猜测更少。只有实验性图标命令、图标集指南，以及设置了 `experimental.iconSet` 的项目中的 `astryx template` 会变化；没有该选择加入时，稳定命令的行为与之前一样，只有 `astryx help` 和 `astryx manifest` 中 `experimental` 组的摘要现在会提到图标集。
  - **`experimental icon new-set`。** `--from` 只在图标具有精确名称时映射定义，并列出这些定义供审阅；可能的匹配最多返回三个建议，且绝不会写入。它会保存库和版本，复制库的许可证声明，在刷新之间保留你的 `--exclude` 列表，其回执会指明要添加的包入口、peer 依赖和 `typecheck` 脚本。`--variants`、`--default-variant`、`--display-name` 和 `--description` 用于填充该集合。刷新只会更改该库提供的图标，保留每个图标的导出名称，并列出重命名的图标。一个包含 1,600 个图标的库大约两秒即可读取完毕。
  - **`experimental icon add` 和 `map`。** `add --variant <name> --from <module> --all` 一次为每个图标添加一个变体，`map --pairs a=b,c=d` 在一个经过检查的步骤中写入多个条目。
  - 图标命令现在会拒绝冲突的选项，而不是静默忽略其中一个（`ERR_INVALID_OPTION`）；中途失败时会让每个文件保持原样（`ERR_WRITE_FAILED`）；并以相同方式在所有地方报告缺失或撤回的集合（`ERR_NOT_FOUND`）。
  - `experimental icon --set <set> --all-icons` 会列出集合中的每个图标，`--definitions` 会列出每个 Astryx 图标定义。
  - 模板会去掉已映射图标库的尺寸属性（`size`、`strokeWidth`、`absoluteStrokeWidth`），并保留重写导入上的注释。
  - 十三个新图标定义：`rotate`、`flipHorizontal`、`flipVertical`、`alignStart`、`alignCenter`、`alignEnd`、`panelLeft`、`panelRight`、`gitBranch`、`gitFork`、`scale`、`cpu` 和 `textCase`。定义会获得常见字形名称作为搜索词；七个可选定义会失去一个指向其他事物的词：`star`（`bookmark`）、`database`（`table`）、`raiseHand`（`stop`）、`redo`（`forward`）、`activity`（`monitor`）、`archive`（`store`）、`mobile`（`device`）。
  - `integration check` 按相同规则建议图标，描述每个可选定义，其版本漂移警告会给出刷新命令。

#### 新功能

- 状态颜色在其出现的所有地方都可读，Info 也成为独立的状态。每个状态（info、success、warning、error）现在都有强填充（`--color-<status>`）及其上的内容（`--color-on-<status>`，至少 4.5:1）、浅填充（`--color-<status>-muted`）及其内容（`--color-on-<status>-muted`），以及用于页面和卡片的可读文本（`--color-text-<status>`）。状态图标（`--color-icon-<status>`）和边框（`--color-border-<status>`）默认使用可读文本颜色。Info 角色（`--color-info`、`--color-on-info`、`--color-info-muted` 等）是新增的，不再借用你的强调色。

  `--color-success`、`--color-warning`、`--color-error` 和 `bg-<status>` 保留其作为强填充的含义。在 Tailwind 中，新增了 `bg-info`、`bg-info-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>`；`text-`、`decoration-`、`placeholder-` 和 `caret-<status>` 现在使用可读文本色调，`border-`、`divide-`、`outline-` 和 `ring-<status>` 使用边框色调，而 `bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影和渐变保持强填充。例如，Core 浅色模式的 `text-warning` 现在是 `#753F07`，而不是 `#E9AF08`。要在文本上保留填充色，请写 `text-[var(--color-warning)]`。

  屏幕上的变化：

  - Core 深色模式的 Error 内容（`--color-on-error`）现在是 `#0A1317` 而非白色，因此深色模式错误填充上的文本达到 4.5:1。Core 的 Info Badge 使用 `#0064E0` 而不是强调色（深色模式下为 `#2694FE`）。
  - 状态图标（Icon `color="info|success|warning|error"`）、Stepper 状态字形和 Chat 工具调用状态图标使用可读色调。Core 的浅色成功图标现在是 `#09441F`，而不是 `#0D8626`。
  - Input 和 FileInput 的状态边框使用边框色调。Core 的浅色警告边框现在是 `#753F07`，而不是 `#E9AF08`，Butter 的浅色成功和警告输入边框达到 3:1。
  - Banner 使用 on-muted 颜色绘制其标题、描述、图标和控件，并用 `--color-info-muted` 填充 Info。
  - 状态填充在强制颜色模式下保持可见边缘。
  - Chocolate 和 Matcha 的成功与错误填充上的内容，以及 Stone 的成功、警告和错误填充上的内容，现在达到 4.5:1。
  - 每个第一方主题都设置了蓝色 Info。Chocolate 和 Matcha 的 Info Badge 从强调色改为该蓝色；Butter 保留自己的 Info Badge 颜色。
  - Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 现在是其 Badge 已经显示的填充色，其 `--color-info` 为 `#0074E2`（深色模式下为 `#6D9CFE`）。它的 Badge、StatusDot、进度填充和 Stepper 徽章看起来相同；其强调色 ProgressBar、StatusDot 和 Stepper 现在使用 Neutral 的强调色而不是蓝色。
  - Neutral 不再定义其未文档化的本地状态令牌。请改用标准角色：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning` 和 `-status-fill-error` → `--color-success`、`--color-warning`、`--color-error`；`-status-muted-accent` → `--color-info-muted`；`-on-tint-neutral` → `--color-neutral`；`-on-tint-overlay-*` 和 `-destructive-overlay-*` 令牌 → `--color-overlay-hover` 和 `--color-overlay-pressed`。`--astryx-theme-neutral-color-status-fill-accent` 保留其值但已弃用。

  自定义主题会获得它们未设置的内容和文本角色：这些角色从主题的状态填充派生。要保持组件之前的颜色，请设置匹配的角色，例如将 `--color-icon-success` 设置为你旧的 `--color-success`。

- CodeBlock 的 `tokenizer` 属性已弃用，改用自定义语言：传入 `language={createCodeLanguage({name, identifiers, tokenize})}`，使用相同的函数。该属性仍然有效。当块具有固定的 `language` 时，`astryx upgrade` 会重写它，并在无法安全重写的地方留下 TODO 注释。
- `Icon` 接受可选的 `variant`，用于向活动主题请求替代图形，例如 `<Icon icon="info" variant="filled" />`。只有当主题在 `iconVariants` 中列出该变体时，主题的图标才会收到该变体；否则它会绘制正常图形。作为组件传入的图标永远不会收到 `variant`，它也永远不会写入页面。没有 `variant` 的图标与之前渲染相同。
- 主题图标现在可以根据大小选择图形：`defineTheme({icons})` 或 `registerIcons()` 中的条目可以是 `{size, variant}` 的函数，`Icon` 会按渲染时的大小调用它。返回 `null` 则不绘制图标。`getIcon`、`getExtendedIcon`、`getIconRegistry`、`useIcon` 和主题的 `icons` 字段仍返回节点，在 `{size: 'md'}` 下读取函数。现有图标条目不变。
- 主题可以通过 `defineTheme({iconVariants})` 列出它支持的图标变体（例如 `filled`），并从 `theme.iconVariants` 读回它们。子主题会继承该列表，除非它们设置自己的列表。`@astryxdesign/core/Icon` 导出 `IconVariantMap` 和 `IconVariant` 用于为变体提供类型。没有 `iconVariants` 的主题不变。
- `astryx theme build` 会保留函数图标和图标变体列表，因此构建后的主题会以与实时主题相同的大小和变体绘制每个图标，包括从另一个主题继承的图标。列出 `iconVariants` 的主题会在 `<theme>.variants.d.ts` 中获得匹配的类型。没有这些功能的主题构建结果与之前完全相同。
- 主题可以为每个 Icon 尺寸设置实际大小：`components.icon['size:sm']`（或 `xsm`、`md`、`lg`）上的 `width` 和 `height`（单位为 `px` 或 `rem`）现在会调整字形本身的大小，对于命名图标和 SVG 组件都适用，在实时和构建后的主题中都是如此。此前，它们只设置图标周围盒子的大小。主题未设置样式的尺寸仍以 12、16、20 或 24px（以 16px 为根）渲染。`astryx docs theme` 新增了 Icon sizes 一节。
- 新增 `--ease-exit` 动效令牌，用于离开屏幕的元素，与用于到达元素的 `--ease-standard` 并列。BottomSheet 已经使用它关闭，因此外观没有变化，但主题现在可以调整退出效果。`astryx docs motion` 和主题模板都会列出它。
- 当 `astryx upgrade` 发现无法安全迁移的代码时，它会完成而不是失败：每个位置都会列在 `declinedCandidates` 中，包含其文件、行号和以 `manual migration needed (<codemod>):` 开头的理由，运行以 0 退出。需要重建的生成文件（例如过期的主题 CSS）会列在新的 `regenerate` 字段中，并附上重建命令，直到重建完成；重建它们的 `hooks.postCodemod` 会清除该条目。受保护的生成文件仍像以前一样阻止运行，但现在会列出重建命令。
- 两个 Bottom Sheet 流程模板（`BottomSheetSwitcherShowcase`、`BottomSheetSwitcherReviewFlow`）现在展示取代 `BottomSheetSwitcher` 的独立步骤模式，并且也列在 `BottomSheet` 下。模板名称和 id 不变。

#### 问题修复

- 使用 `@stylexjs/unplugin`（标准 Vite 设置）编译 StyleX 的项目会被识别为 StyleX 项目。
- `Tokenizer` 展示模板的搜索再次返回匹配的标签，因此 Tokenizer 文档页面上的实时示例可以工作。
- 当 PATH 中前面有另一个 `npm` 包装器时，`astryx integration verify` 不再以 "npm pack failed" 失败。
- `astryx upgrade` 会跳过无法解析的 vendored、生成或忽略的文件，将它们列在 `declinedCandidates` 中，并完成升级的其余部分。
- `astryx upgrade` 不再花费数分钟读取符号链接的 `node_modules` 文件夹或包存储。
- 从 0.7.0 之前的版本运行 `astryx upgrade --from` 时，不再因没有回退值的 `var(--color-data-*)` 而失败。读取原始数据颜色的源代码构建应从 `@astryxdesign/core/theme/dataTokens.stylex` 导入 `dataVars`。
- 反复调用 CLI API 的工具（例如文档站点搜索）现在无需重启即可看到文档编辑。
- 组件 family 无论包是否已构建都会列出相同的成员，因此 Lab 的 `TourStep` 现在出现在官方包列表中。
- `astryx upgrade` 能处理写成 `const config = {...}; export default config;` 的 `astryx.config`。
- 当你输入带包装或前缀的名称时，`astryx component <name>` 会建议正确的组件。
- 当 `astryx component`、`astryx template` 或 `astryx docs` 找不到任何内容时，其建议会在匹配变弱的地方停止，而不是列出无关条目。
- 升级到 0.7 的 `astryx upgrade` 不再把你自己的 MetadataList 类变成永远不匹配的 `data-columns` 选择器。
- `astryx discover` 会列出 `@astryxdesign/lab` 中实验性的 MobilePowerSearch 组件。
- `astryx theme build` 会报告加载失败的主题文件，而不是根据其文本猜测主题。
- 当项目的 `@astryxdesign/core` 无法加载时，`astryx theme build` 会以清晰的错误失败，而不是静默使用 CLI 自带的副本构建。
- 升级到 0.7 的 `astryx upgrade` 不会改动其他库的主题对象。
- 失败的 `astryx upgrade` 现在会列出它已经更改的文件：其 `--json` 错误包含一个 `receipt`，其中有 `modifiedFiles`、`errors`、`protectedFiles`、`complete: false` 和 `errorCode`。错误码和退出码不变。

#### 文档

- Tokenizer 模板会将其字段尺寸设置为适应手机屏幕。
- CodeBlock 代码片段示例显示单行命令，旁边带有 Copy。
- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。
- TabList 的描述不再承诺内置的 "more" 菜单（窄标签条会滚动），库页面模板将 `MobileNav` 描述为它本来的滑出抽屉。
- 主题指南和生成的主题文件说明，扩展主题的 `motion` 设置会逐字段继承。
- 已禁用的 Thumbnail 模板现在正确描述其按钮：它们保持可聚焦，并被宣布为已禁用。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @imdreamrunner
- @josephfarina
- @kentonquatman
- @nbozidarevic
- @rubyycheung
- @vjeux

---

# 0.7.4

#### 实验性 API

- 图标集：集成可以发布图标集，agent 可以按含义查找图标并获得精确的导入行，复制的模板会使用项目中的图标。这里的一切都是实验性的，可能在任何补丁版本中更改或移除；未设置 `experimental.iconSet` 的项目不会看到任何稳定命令的变化，除了：帮助和 `astryx manifest` 中标记的 `experimental` 组（其命令，以及其 `responseTypes` 和 `jsonSupported` 条目）；`astryx docs cli` 列表中标记的实验性条目；以及搜索 "experimental" 时也会找到字段参考中新增的稳定 `stability` 字段。`astryx search` 不会返回任何图标，也不会返回实验性文档。对于已安装提供图标集的包且未选择加入的情况，旧版 CLI 针对清单键 `experimental` 给出的警告（在 `astryx doctor` 和 `astryx doctor integration validate <package>` 中，以及其他命令打印到 stderr 的一行提示）不再出现，`doctor integration` 只在设置了 `experimental.iconSet` 的项目中检查该包的图标集；`astryx integration check` 会为声明了 `experimental.iconSets` 的包报告图标集发现项（见下文）。（#7759）

#### 新功能

- 保持 Butter 已发布的 `butterPalettes` 对象字节级一致，同时将维护中的浅色/深色主题迁移到经过审阅的命名调色板色阶。Signature Blue `#225BFF`、Butter Yellow `#FDEE8C` 和暖色主体表面保持精确不变；状态填充从成功 `#91D143` 改为 `#7BBF7A`，警告 `#FFC502` 改为 `#DFCF5B`，错误 `#FC473B` 改为 `#E56241`，信息 `#4883FD` 改为 `#4D82FF`。信息和错误内容从白色改为暖色 Neutral `#1D1C11`，中性 Badge 使用 Blue `#194CE8`，浅色 TopNav 项目使用 Blue `#225BFF` / `#194CE8`；这些调色板优先的配对达到普通文本 AA 标准。需要以前外观的消费者可以扩展 `butterTheme`，用其之前的值覆盖受影响的颜色、语法、阴影和组件值。CLI 模板提供相同的私有调色板请求、回执和运行时尺寸引用。（#7672）
- 文档可以标记实验性表面：除 `ThemeDoc` 和 `IconSetDoc` 之外的每种文档类型，以及每个 schema 字段和枚举值，都接受 `stability: 'experimental'`。被标记的命令会在帮助中显示 `[experimental]`，被标记的 schema 字段或枚举值会从其稳定表中省略，以便其功能自己的文档来描述它，`astryx search` 会省略被标记的文档（该文档在自己的路由上读取）。对于正在编写的包，`doctor integration validate`（以及因此 `integration check`）会添加 `olderCliNotes`，每个为 `{file, kind, field, message}`：设置了 `stability` 的模板或命名空间文档，或声明了 `icons` 的模板，而包的 CLI peer 范围允许 0.7.4 之前的版本（该版本会丢弃该描述符）。注记永远不是错误或警告，也永远不会使检查失败，在 `--strict` 或 `--next` 下也是如此；文本输出会打印 "Notes for older CLIs"。不使用这些内容的文档和发现项的读取结果与之前完全相同。（#7759）
- 文档可以编写命令，让每个读者看到适合自己的版本：`{@command docs theme}` 用于 Astryx 命令，`{@pm install @acme/widgets --dev}` 用于包管理器步骤，`{@pm-only npm "<reason>" pkg set name=x}` 用于只有某个包管理器才能执行的步骤。CLI 会用读者的 runner 和包管理器（npm、pnpm、Yarn 1、Yarn 2 及更新版本，或 Bun）显示每一个，`{@@…}` 会按原样显示令牌。`astryx docs authoring/building-blocks/docs/doc-syntax` 记录了它们。`doctor integration validate` 会列出主题为某个包管理器编写的每条命令（`package_manager_command`）、裸命令（`plain_command`）或带 runner 的命令（`runner_command`），以及每个无法解析的令牌（`doc_token`），并分别给出应写入的令牌。（#7868）
  `integration check --next` 会将下一个次版本发布变为警告的发现项（标记为 `next` 的注记）现在就计为警告，因此 `--strict --next` 会在这些项上失败。每次运行都会说明有多少项。没有 `--next` 时，`integration check --strict` 的退出与之前一样。

- 集成的文档现在可以通过路由替换或扩展 CLI 的某个指南，例如 `replaces: 'authoring/quick-start'` 或 `extends: 'authoring/quick-start'`，因此一个包可以改变每个安装它的应用中的 agent 已经阅读的指南。扩展的章节可以将 `before` 或 `after` 设置为某个章节的键，以便放在该处而不是末尾；旧版 CLI 会拒绝这些字段，因此当包的 `@astryxdesign/cli` peer 范围允许旧版时，`integration verify` 会发出警告。每次读取都会指出执行替换或扩展的包：指南和每个章节上的 `package`，被替换的主题或指南现在还会在 `replaces` 旁边携带 `replacedPackage`（在 `docs`、`docs --index`、主题列表和命名空间的子项中），文本中会有一行 `replaces <package>'s <topic>`。不包含主题或指南的名称（例如命名空间）不会改变任何东西，而 `before` 或 `after` 键未指定任何章节时会将章节添加在末尾：`integration validate` 会将每一项列为注记（`doc_target_not_found`、`doc_section_unplaced`），并将同一个包中替换同一个指南的两个文档列为 `duplicate_guide_replacement`；在下个次版本发布之前，这些都不会使任何检查失败。（#7936）
- `astryx doctor --built <path>` 会在交付之前检查已完成的构建：项目文件夹、构建输出文件夹或一个构建好的 HTML 文件。当路径中没有任何 Astryx 包的导入（任何 `@astryxdesign/*` 包，或项目安装的集成：已声明的依赖且其安装副本带有集成清单）、没有从其中导入任何组件，并且构建后的 CSS 或 HTML 中没有任何 Astryx 样式时，`built-astryx-usage` 会失败，并指出以模板优先的方式重新构建的方法。`built-astryx-purity` 会使用 `astryx docs is-my-code-good` 的源代码检查发出警告：Astryx 已有对应组件的原始元素、原始 SVG 和图标库图标、内联样式、类、`stylex.create` 和导入的样式表，每一项都会给出其文件和行号；当路径中没有带 JSX 的源代码（例如 bundle）时，它会说明未检查源代码。路径下的文件和该 package.json 只会被读取；其中的任何内容都不会运行。没有 `--built` 时，`astryx doctor` 的运行与之前完全相同。（#7886）
- 保持 Gothic 已发布的扁平 `gothicPalettes` 兼容导出不变，同时将维护中的深色主题迁移到可重现的生成调色板和命名色阶映射。卡片从 `#1A1D20` 改为 `#191D20`；灰色背景和边框从 `#3D4248` / `#5D646B` 改为 `#3E454B` / `#5E676E`；语法注释和标点从 `#6B7079` / `#7A8290` 改为 `#7E8791` / `#7E8791`；diff 背景从 `#081408` / `#1E0A0A` 改为 `#071607` / `#220806`。成功、警告和错误内嵌环从 `#87B06A50` / `#D6B56A50` / `#D4485150` 改为 `#869B7250` / `#D3C49050` / `#C6A6A250`。黄色文本从 `#6C5010` 改为 `#573F0B`，粉色文本从 `#71223C` 改为 `#5C182F`；两个更深的命名色阶在其分类表面上达到 4.5:1。需要以前外观的消费者可以扩展 `gothicTheme`，用其之前的值覆盖这些颜色、语法、阴影和组件令牌。CLI 模板提供相同的请求、回执和运行时尺寸引用。（#7670）
- `doctor integration validate`（以及因此 `integration check`）会列出包的示例在所有展示位置正常工作所需的内容，作为下个次版本发布的注记（`integration check --strict --next` 现在会在这些项上失败）：（#7891）
- 将 Matcha 现有的颜色角色迁移到其经过审阅的浅色和深色调色板渐变上，包括 Tea Gold。警告和黄色从 `#FFB600` / `#FFC940` 改为 `#F2C000` / `#F6D066`；相关的语法颜色和警告内嵌环也遵循同一调色板。需要以前外观的消费者可以扩展 `matchaTheme`，用其之前的值覆盖受影响的颜色、语法、阴影和组件令牌。完整的 Matcha 调色板仍然是私有编写数据，CLI 模板提供相同的请求、回执和运行时尺寸引用。（#7671）
- `astryx theme palette generate` 的回执现在会指明生成器实现（`generatorVersion: 'palette-generator-v1'`）以及它们所哈希候选字节的格式（`candidateFormatVersion`：`.ts` 输出为 `'palette-typescript-v1'`，`.json` 输出或打印的候选为 `'palette-json-v1'`）。`candidateSha256` 和所有其他回执字段保持其含义、值和顺序，因此现有读取器可以继续工作。（#7678）
- 用经过审阅的浅色和深色调色板渐变替换 Stone 内部的共享渐变映射，同时保留公开的编号调色板查找以及 `hue`/`chroma` 元数据。浅色画布从 `#F3F3F5` 改为 `#F0F0F7`，深色弹出层从 `#25252A` 改为 `#302F36`，Green、Yellow、Teal 和 Cyan 使用重新播种的中间色调（包括 Green 从 `#667D65` 改为 `#528B49`）。七个系列的浅色 stop-90 表面、语法颜色和输入状态边框会发生变化；映射后的成功和警告边框使用 `#609757` 和 `#A08C36`，语法属性使用 `#736419`，并保持所需的对比度下限。现有应用可以通过扩展 `stoneTheme` 并用其之前的值覆盖受影响的颜色、语法、阴影和组件令牌来保留以前的外观。CLI 模板提供相同的可重现请求、回执和运行时尺寸引用。（#7669）
- 当项目安装的 CLI（自身的或工作区的）具有 `astryx doctor --built`（0.7.4 及更高版本）时，`astryx init` 写入的 agent 文档会告诉 agent 在交付构建之前运行它，并且不要交付未通过它的构建。在安装之前或旧版 CLI 上，该行会被省略；下一次 `init` 或 `upgrade --apply` 会添加它。（#7944）
- 保持 Y2K 已发布的 `y2kPalettes` 对象字节级一致，同时将维护中的浅色/深色主题迁移到经过审阅的命名调色板色阶。Periwinkle `#CCCFFA` 和 Neon Green `#C5E17A` 保持精确不变；语法颜色变得更亮，深色代码背景从 `#190F00` 改为 `#0E0F1A`，深色灰色背景从 `#EDE0D4` 改为 `#DFE2F3`。必要的深色输入和未选中选择轮廓从已发布的 `#3A3F5E` 改为 Neutral Dark 45 `#636889`，将输入表面上的对比度从 1.71:1 提高到 3.23:1。需要以前外观的消费者可以扩展 `y2kTheme`，用其之前的值覆盖受影响的颜色、语法、阴影和组件值。CLI 模板提供相同的私有调色板请求、回执和运行时尺寸引用。（#7675）

#### 问题修复

- `astryx doctor --built` 不再将仅类型的 Astryx 导入（`import type`、`import {type X}`、`export type … from`）计为 Astryx 使用，因为构建会将其擦除。（#7945）
- 发现结果会指明其来源包并容忍拼写错误。（#7147）
  每个 `discover` JSON 结果现在都按照来源规则指明其包：单工件响应（`discover.detail`、`discover.detail.doc`、`discover.item`）在外层信封中携带 `package`，列表条目（`discover.list` 及其 `meta.available` 的每个条目）携带 `package`。文本输出也一致：打开的文档会在 stdout 上打印其 `package:` 行。

  `discover <words>` 现在具有与 `search` 相同的拼写容错能力：接近的名称（编辑距离 1–3，并有最小长度保护）会返回结果，而不是 "not found"。以前 `discover Geodetics` 会说 "not found"，而 `search Geodetics` 能找到 `geodesic`。

- `astryx search` 可以通过完整拼写的名称找到 family 成员，就像其自身描述拼写的那样（"vertical stack" 是 VStack），并在单个字母之后按该词列出以词头命名的成员（VStack、HStack）对应 "stack"。（#7927）
- 对于查询是 family 名称的情况（"table" 在 Table 之后列出三个 Table 部件；"chat" 列出 Chat 部件，尽管不存在 Chat 组件），`astryx search` 会列出 family 文档中该查询指定的前三个成员，Core 和集成 family 都一样。（#7955）
- `astryx search` 会将匹配器评分相同的结果按契合度而不是名称排序：在第一个结果之下，其某个部件排在前面（Badge 之后的 BadgeCountBadges），然后是匹配查询中较罕见词的结果。分数和第一个结果不变。（#7959）
- `astryx integration verify` 在 npm 8 上可处理带作用域的包：npm 8 在 pack 输出中将 tarball 命名为 `@scope/name-1.0.0.tgz`，但写入的是 `scope-name-1.0.0.tgz`，因此 verify 会读取 npm 写入的文件，而不是找不到它。（#7933）

#### 文档

- 四个块模板（`MetadataListItemBasic`、`SegmentedControlItemBasic`、`VisuallyHiddenSupplementaryContext`、`ItemWithMetadata`）现在描述每个模板展示的内容以及何时使用它，内容根据块渲染的内容编写。（#7963）
- `BottomSheetSwitcher` 模板文档（`BottomSheetSwitcherShowcase`、`BottomSheetSwitcherReviewFlow`）将每个步骤描述为同一个遮罩下的独立原生对话框，与组件现在的渲染方式一致，而不是 "one shared dialog"。（#7720）
- `CommandPaletteItem` 展示块现在描述它渲染的内容：一个内联命令面板，其条目将每个标签与键盘快捷键配对，并且只列出它使用的组件。（#7967）
- Discover 数据：将 Lab 的 ListInput 块（Tag options 展示以及 Mailing list、Budget allocation 和 Family member declaration 示例）列为模板。（#7953）
- 六个指南标题更简洁，并使用与其余标题相同的大写风格：Theme System 现在为 Theming，Styling Components 为 Styling components，Browser Support 为 Browser support，Migration Guide 为 Migration，Styling Library Interop 为 Other styling libraries，Looking up components 为 Component lookups。只有标题改变：每个路由仍打开相同的文档（`astryx docs theme`、`astryx docs styling-libraries`、`astryx docs cli/component-lookups`），按旧标题搜索仍能找到它。（#7934）

#### 其他变更

- **命令。** 新的 `astryx experimental` 组包含实验性命令；图标集是它的第一个。`astryx experimental icon <words>` 会在已安装的集合中对图标排序（`icon.search`），`<set>/<id>` 读取一个图标及其每个变体的导入行（`icon.detail`），`--list` 列出每个集合及其定义覆盖率（`icon.list`）。编写：`experimental icon new-set <name>` 启动一个集合（`--from <module>` 包装库导出的每个图标，`--exclude` 丢弃不是图标的导出），`experimental icon new-definition <name>` 添加集合自己的图标定义，`experimental icon add <Export> --from <module>` 验证导出并列出适合它的定义，或添加并映射它（`--variant <name>` 将其添加为集合声明的变体，一种命名外观，例如 solid；尺寸来自 CSS），`experimental icon map <definition> <icon>` 编辑一个映射条目，`experimental icon use <set>` 选择项目的集合。API 新增 `icon`、`iconAdd`、`iconMap`、`iconUse`、`iconNewSet` 和 `iconNewDefinition`，均标记为 `@experimental`。
- **配置。** 项目的集合是 astryx.config 中的 `experimental.iconSet`；集成在其清单中以 `experimental.iconSets` 声明其集合文件夹。每个集合有一个带类型的 `<name>.doc.mjs`（`IconSetDoc`）、一个 `<name>.icons.json` 数据文件，以及可选的 `definitions/` 文件夹；`@astryxdesign/cli/authoring` 导出 `IconSetDoc`、`IconSetData`、`IconDefinitionDoc` 及其解析器。旧版 CLI 会警告 `experimental` 是它不认识的清单键，而 0.7.4 之前的 CLI 会拒绝设置 `experimental.iconSet` 的 astryx.config（"Unrecognized key"），因此加载项目配置的命令（例如 `doctor` 和 `discover`）会在该项目中失败；当项目的 `@astryxdesign/cli` 范围允许这样的版本时，`astryx experimental icon use` 会在其回执（`warning`）中说明这一点。
- **图标集出现的位置。** 按含义查找图标只通过 `astryx experimental icon` 进行：`astryx search` 永远不会返回图标或实验性文档，无论是否设置了集合。设置了 `experimental.iconSet` 的项目还会让 `astryx template` 将模板在其新 `icons` 字段中声明的每个图标（命名导入按其导入的名称，默认导入按其本地名称）替换为该集合的图标，每个键都会在 `icons` 回执字段中报告为 mapped 或 kept，`astryx discover` 会将 `icon-set` 作为一种类型读取（`--type icon-set`，以及该类型的目录条目），并且 `astryx doctor` 中会有一个 `icon-sets` 检查。没有它时，这些都不会改变：模板按原样复制，`--type icon-set` 是未知类型，目录中的 `icon-set` 条目会被忽略，Doctor 也不会报告任何图标集相关内容，即使图标集无效。`astryx integration check` 会为声明了 `experimental.iconSets` 的包报告图标集发现项，并在 validate 结果的附加 `iconSets` 字段中列出每个集合未映射的可选 Astryx 定义、适合的图标以及它无法判断的内容（`unchecked`：模块是尚未构建的 `exports` 目标的图标，它无法证明任一方向的图标或适配器导出，例如位于无法跟随的 re-export 之后或绑定到默认导入的导出，以及无法读取的主题映射或条目；只有被证明不存在的导出才会失败），打印在 "Not checked" 下；这两个列表都不会被计数，也不会使检查失败，即使在 `--strict` 或 `--next` 下也是如此。它还会记录模板源从未导入的每个模板 `icons` 键（`template_icon_not_imported`），这不会使任何检查失败，在 `--next` 下也是如此。
- **文档。** 指南和每个图标定义都位于 `astryx docs cli/experimental` 下，每个图标集文档都标记为 `stability: 'experimental'`。实验性图标定义命名空间会采用每个包的定义文档（`source.packages: 'all'`，仅在标记为实验性的 CLI 命名空间中读取）。
- `component_without_example`：已发布的组件没有通过 `exampleFor: '<Name>'` 和 `isShowcase: true`（或 `alsoShowcaseFor`）在任何块模板中展示。名称类似 showcase 但两者都未设置的块不计入。隐藏的文档、family 成员、带有 `isHiddenFromOverview` 的文档和 `Utility` 组件除外。该注记会附带一个可粘贴的模板文档。
- `template_category`：写成路径的模板 `category`，例如 `components/X`，并附带一个应写入的 `"<Group> - <Variant>"`。
- `showcase_not_standalone`：一个 showcase（带有 `isShowcase: true` 或 `alsoShowcaseFor` 名称的块）导入了浏览器无法加载的内容（`server-only`、`next/headers`、`next/server`、`next/cache`、Node 内置模块），或读取 `process.env` 超出 `NODE_ENV` 的部分。仅类型导入和注释不计入，通过应用提供的实时数据则没问题。
- `template_asset_not_packed`：模板通过 `new URL(…, import.meta.url)` 加载的文件或文件夹不存在、位于包外，或被 npm 排除在包外：由 package.json 中的 `files`（注记会指出排除它的 `!` 条目），或由 `.npmignore` 或 `.gitignore` 行（注记会指出该行）。以 `npm pack --dry-run` 打包的内容为准；当 npm 无法回答时，它可能打包的资源会列在 `data.exampleAssets` 下并标记为未检查。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @imdreamrunner
- @josephfarina
- @rubyycheung

---

# 0.7.3

#### 新功能

- `astryx build` 更常把正确的块排在前面。它按请求的含义对目录中的每个块排序，含义读取自每个块自己的名称、描述和组件，因此词匹配遗漏的块仍可能排在最前，并带有自己的分数和理由；块选择器的固定值在一个更大、更多样的书面示例请求集上重新拟合，这对以产品自身术语表述的请求帮助最大。请求按确切名称指名的块，以及来自集成的块，保持其位置。工具包列出的块从不比之前多，其字段、页面调用、起始模板和备选项均未改变。
- `astryx search` 更常把你想要找的条目排在前面：它在每个分数段内对匹配项排序，每个结果保留其匹配分数和理由，而查询正好是某个条目的确切名称时，仍以该条目作为第一个答案（[#7752](https://github.com/meta/astryx/pull/7752)）。
- `astryx doctor integration validate` 和 `astryx integration check` 会检查包的文档和块给出的组件名称，并将发现的内容作为注记列在 validate 的问题旁边，每个注记都带有其修复方法。任何注记都不计入数量，`integration check --strict` 也不会因它们而失败；它们会在下个次版本发布中成为会失败的警告：
  - `doc_name_mismatch` 列出一个组件文档，其 `name` 不是该组件被列于其下的名称，前提是其打印的导入所指向的模块（文档的 `import`、已发布的子路径或包根）可证明不导出该名称，因此 `astryx component` 会打印一个损坏的导入。`Fix:` 在该模块导出该文件名时建议使用它，否则建议使用它导出的组件。该模块的导出无法证明或排除的名称（来自另一个包的 re-export、`export =`、解构绑定、命名空间、解析不到任何文件的导入，或在无法解析任何导入时，只导出默认值的源文件）会在 validate 新增的 `docNames` 报告中列为未检查，并附上原因。
  - `unknown_block_component` 列出一个名称，该名称由模板的 `exampleFor` 或 `componentsUsed` 给出，而包和 Core 都没有它（`astryx component` 在 Core 中能解析的每个文档都算），并且模板没有导入它。模板的本地辅助文件所做的导入也算，包括通过 `parts/index.ts` 这样的 barrel 文件。只有当模板仅通过来自 Core、React、StyleX、完整读取的本地辅助文件或包自身名称（像辅助文件一样沿其 `exports` 追踪）的具名导入和 re-export 来获取组件时，名称才会被判断。其他情况会在 validate 新增的 `blockComponents` 报告中列为未检查：来自另一个包的导入，它可能渲染其他组件；React 或 StyleX 之外的任何 `default` 绑定；命名空间导入；导入绑定的别名或成员读取；保存在变量中的组件；`require()`；动态 `import()`；无法干净解析的文件；此检查无法读取的本地模块；以及在未安装 Core 时，只有 Core 能解析的任何名称。

  `integration check --strict` 不会因任何列为未检查的内容而失败。

- 新增 `@astryxdesign/cli/host` 入口，供承载 CLI 的工具使用：`runHostedCli` 每个进程运行一次 CLI，使用该工具用户输入的命令名（打印的命令以它开头），并在工具跳过了项目自己的 CLI 时提供原因，因此该 CLI 永远不会被运行。

  ```js
  import {runHostedCli} from '@astryxdesign/cli/host';

  const result = await runHostedCli({
    argv: ['search', 'button'],
    cliCommand: 'acme astryx',
  });
  ```

- `astryx doctor integration validate` 现在会从源代码出发、无需构建，记录集成包告诉应用导入但实际上无法导入的内容，就像它列出被忽略的 `cliCommand` 一样。每个注记都在 `data.notes` 中，并指明其修复方法，例如要添加的确切 `exports` 条目。注记只是列出：`doctor integration validate` 和 `astryx integration check --strict` 在 0.7.3 中都不会计入或因其失败，它们会在下个次版本发布中成为会失败的警告，所以现在就修复它们。它会记录：
  - 组件的导入（文档的 `import`，或文档没有时 CLI 推导出的导入）或模板的公共导入，其子路径未在 package.json 的 `exports` 中声明，或指向了另一个包。子路径未声明包括：缺少键、其唯一条件不会被 ES 模块导入加载的键（例如 `require` 或 `types`）、为单个字符串的 `exports`、不匹配的通配符，或空的 `exports` 映射；
  - 组件示例导入了包未声明的子路径；
  - 模板导入了 templates 根目录之外的相对路径，或其自身包或 Core 未导出的路径。

  子路径仅根据其 `exports` 声明判断，绝不根据其目标文件判断，因此 `exports` 可以指向尚不存在的构建输出；该模块是否导出导入所请求的名称，是下一条目的检查。通配符以及带有 `import` 或 `default` 的条件对象通过。若某个子路径的 `exports` 条目只有 `types` 目标，或 ES 模块导入只能通过 `types` 到达它（例如 `require` 旁边的 `types`），则它永远不会被判断为运行时导入：当它是 `import type`、当每个绑定都是内联 `type`，或当它导入的每个名称都是 `types` 文件声明为类型的名称时通过，否则列在 `unchecked` 下。`require` 下的 `types` 目标不计入，没有 `exports` 的包保留其指向所发布文件的深层路径。它无法判断的内容（在没有 `exports` 的包中，指向尚未构建的构建输出的深层路径，例如 `dist/`；当包旁边未安装 `@astryxdesign/core` 时模板对 Core 的导入；当 package.json 没有 `name` 时对包自身名称的每个导入）会列在结果上新增的 `publicImports` 报告的 `unchecked` 下（`{status: 'checked', findings: [], unchecked: [{file, specifier, reason}]}`），`integration check` 会将其计为未比较。

- `astryx doctor integration validate` 现在还会从源代码出发、无需构建，记录导入了其模块未导出的名称的导入（在 `data.notes` 中，每个都带有其修复方法）。这些注记在 0.7.3 中也只是列出，并会在下个次版本发布中成为会失败的警告。它会记录：
  - 组件的导入（文档的 `import`，或 CLI 推导出的那个）指向一个不导出该组件的模块，并指明确实导出的子路径或要添加的 `exports` 条目；
  - 组件示例或模板导入了包未导出的名称；
  - 没有默认导出的模板源文件（`astryx template` 仍会复制它，但其公共导入和任何渲染它的内容都什么也得不到），建议使用导出的 PascalCase 函数、类或 `const`，绝不要用 `useAccount` 这样的 hook、`formatBalance` 这样的辅助函数、全大写的常量或类型；若都没有，修复建议保持通用。

  只有当 `exports` 条目指定的文件存在且可完整读取时，才会判断名称。`export *` 会被追踪，包括循环；构建模块的声明文件（`x.js` 旁边的 `x.d.ts`，以及其 `export *` 指定的 `.d.ts` 文件）会读取其导出的类型；`export import Alias = Inner.Value` 算作导出；TypeScript 源文件会将 `./x.js` 说明符解析为 `./x.ts`；作为模块的声明文件会导出每个顶层声明，除非它有导出列表、`export *`、`export =` 或表达式的默认导出，与 TypeScript 的行为一致。读取器未能完全建模的任何内容都会列在 `publicImports` 报告的 `unchecked` 下，而不是作为注记：`exports` 条目指定但尚不存在的文件；无法完整读取其列表的模块（CommonJS、来自另一个包的 `export *`）；没有导入或导出的声明文件（全局脚本）；没有声明文件的 JavaScript 模块中缺失的名称，它可能是类型；以及它本会报告的每个名称（组件文档自身的组件除外），前提是包中的某个 TypeScript 文件（`node_modules` 之外）有针对相对路径、包自身名称或其子路径的已解析 `declare module` 块，因为这可能向模块添加名称。原因会指明该文件；`declare global`、`'*.css'` 这样的通配符规范、另一个包的名称以及注释中的 `declare module` 都不计入，而文本中有 `declare module` 但无法解析的文件会算。`astryx docs authoring/ship/checks` 解释了每项检查。

- 失败的 `astryx component`、`template` 或 `docs` 查找会将你最可能想要的条目列在首位。匹配分数相同的组件按你输入的名称在其关键词中出现得有多早以及其名称有多接近来排序，而不是按字母顺序；在提供的建议中，如果某个组件的另一个名称被输入（包括另一个库对它的称呼，例如 `MUI TextField`，带不带库名均可），它会排在前面；不存在的复合名称（用其他词命名的 family 部件，或缺少其 family 某个词的名称）会建议真正的部件或其 family。模板按其 id 或标题与你输入的名称的匹配程度排序，未知文档路由按路由的匹配程度排序。建议列表从不变得更长，每个建议都是真实条目，之前能解析的名称仍解析到同一条目。
- 告诉读者通过包运行器运行 Astryx 命令的集成文档，现在会从 `doctor integration validate`（以及因此 `integration check`）得到 `runner_command` 注记，位于 `data.notes` 中，带有其文件、行号和应改为输入的裸 `astryx <command>`。注记不会使任何检查失败，因此 `integration check --strict` 的退出与之前相同。下载运行器（`npx astryx`）后面的非作用域名称始终计入，因为它会获取一个无关的包；用于安装步骤的作用域 `npx @astryxdesign/cli` 不计入。

#### 问题修复

- `astryx build` 仅当请求命名的该模板自身显示名称、类别和关键词（搜索的停用词除外）中的词数不少于最佳已列出模板时，或请求在已列出模板的 family 之前命名该模板的 family（其类别的第一部分）且命名词数最多少两个时，才会从其词权重未列出的页面模板（集成的模板，或权重拟合后新增的模板）开始；否则它从该已列出模板开始，并将另一个作为第一个备选。
- CLI 可以从项目内的任意文件夹找到项目的 `@astryxdesign/core`，因此 `component`、`hook`、`build`、`search`、`swizzle`、`theme targets` 和 `doctor` 现在在五层或更深的文件夹、在工作区根目录安装 Core 的工作区成员中，以及在 Yarn Plug'n'Play 项目中都能工作。它们仍会搜索之前搜索的文件夹，并在越过这些文件夹后继续向上，直到最近的、其 package.json 声明了 Astryx 包的文件夹的工作区根目录。
  - 从项目中任意文件夹运行的 `upgrade --from` 会升级该项目：最近的、其 package.json 声明了 Astryx 包或由 Astryx 工作区列出的文件夹，查找时不会越过仓库根目录，也不会计入主文件夹。它只针对项目自己的 Core（其 `node_modules` 中的那个，或对于工作区列出的成员，工作区安装的那个），默认扫描项目的 `src`，从你运行所在的文件夹读取你输入的 `--path`，其 `--json` 结果中的文件相对于该文件夹命名，刷新项目的 agent 文档，并在更改任何内容之前说明项目根目录和它扫描的源文件夹。没有这样的项目时，`upgrade` 只读取当前文件夹，与之前一样。
  - 在安装了 Core 但未声明 Astryx 包的文件夹中运行 `upgrade`，现在会升级其上方的 Astryx 项目，而不是仅升级该文件夹，因为这样的文件夹从来不是独立的升级根。要让安装了 Core 的子文件夹成为其自己的项目，请在该文件夹的 package.json 中声明一个 Astryx 包。
  - 存放另一个包的 `packages/core` 文件夹不再被读取为 Core，`astryx.config` 中指定的集成现在会在工作区在其根目录安装它时加载，就像已自动链接的集成一样。
- CLI 的安装建议不再向不是 Astryx 项目的 `package.json` 添加包。这涵盖每日提示、设置提醒、更新通知、`astryx doctor` 的版本对齐和集成修复，以及 `astryx discover` 为安装在计算机上的集成给出的安装命令。项目是最近的、其 `package.json` 声明了 Astryx 包的文件夹，或工作区列出的成员，绝不是主文件夹，也绝不越过仓库根目录。
  - 从这样的项目内部某个自身 `package.json` 不是项目文件的文件夹（例如安装了自己 `@astryxdesign/core` 的工具文件夹）中，将项目 CLI 与其 Core 匹配的每日提示、设置提醒和 `astryx doctor` 的版本对齐修复，过去会给出一个命令，将 CLI 添加到该文件夹的 `package.json`，使其成为单独的 Astryx 项目。它们仍会将 CLI 与运行读取的 Core 进行比较，当两者不同时，它们会说从项目的文件夹运行，或在该文件夹中声明一个 Astryx 包；更新通知会从项目文件夹升级项目，并使用项目的版本。
  - 对于安装在计算机上的集成，`astryx discover` 不会从这样的文件夹给出安装命令，`astryx doctor` 的修复会说从项目的文件夹运行，在那里该命令会为项目添加它；在不属于任何项目的文件夹中，两者都不会给出命令。
  - 在不属于任何 Astryx 项目的文件夹中，提示、设置提醒和更新通知不再打印，`astryx doctor` 的修复会说明如何到达项目。
  - 不变：`astryx discover` 列出的官方包和 `astryx doctor` 建议的主题包仍使用命令运行所在的文件夹；工作区列出的成员保留其自己的建议；在 `package.json` 声明了 Astryx 包的文件夹中，建议相同。没有 JSON 结构或退出码的变化。
- `astryx doctor integration validate`、`astryx integration check` 和 `astryx integration verify` 会捕获更多包错误，每个新发现都以清除它的 `Fix:` 结尾。0.7.2 不会因其失败的发现会作为注记列在 validate 的问题旁边，不计入任何数量，直到下个次版本：
  - 一个组件的两个文档（`AcmeWidget.doc.mjs` 和 `AcmeWidget.doc.js`）会列为 `duplicate_component_doc`，并指明读取的那一个；发现现在始终读取同一个。
  - 组件文档的文件名与其源文件仅大小写不同的情况会形成一个发现，并说明要重命名哪个文件：在配对失败（Linux）的地方是错误，在仍能配对（不区分大小写的磁盘）的地方列为 `source_without_component_doc`；未配对的隐藏文档保留其原有的源警告。
  - 通过符号链接文件夹到达的根会列为 `symlinked_root`：npm pack 不会跟随它。
  - 绝对根会说明根应为相对路径并给出相对路径；为文件的根会由每项检查报告，而不是使其崩溃。
  - 缺少 `name` 或 `version` 的 package.json 会连同修复一起列出，而不是崩溃；`verify` 会因其失败。包 `name` 和清单 `providerId` 都没有给出提供者 ID 的包会列为 `no_provider_id`。
  - Astryx 无法读取的贡献文件会列为 `unreadable_file`，在 npm pack 因其失败之前。

  `astryx integration check --strict` 也不会因这些配对、根和 package.json 注记而失败；它们会在下个次版本中成为失败。`astryx integration verify` 仍会因 npm 无法打包的 package.json 而失败。

- `astryx doctor integration validate`、`astryx integration check` 和 `astryx integration verify` 会更清楚地说明它们已经报告的发现中的问题，以及如何修复：
  - 空的文档或清单，或没有默认导出的文档或清单，会说明这一点并指出它确实导出什么，而不是 "(root): Invalid input"。
  - 与已知键相差一两个字母的清单键会先问 "did you mean `components`?"，然后再建议更新版本的 CLI。
  - 以构建文件命名的主题描述符（`ocean.doc.mjs` 旁边是缺少 `ocean` 导出的已构建 `ocean.js`）会说明它必须与 `defineTheme` 源文件共享主干名，并在构建模块的 `Source:` 行或源文件的 `defineTheme` 名称确认时指明该源文件。
  - 没有源文件的模板文档、没有源文件的主题描述符、没有描述符的主题源文件，以及源文件为 `.jsx` 的组件都会得到 `Fix:`。
  - 以其主题命名的主题源文件（`brand.ts`）旁边是构建写入的模块（`brand.js`）时，会被告知采用 `brandTheme` 主干名。
  - `verify` 会按打包文件在包中的路径命名它们，而不是临时副本的路径；会说明 npm pack 不跟随符号链接根，而不是要求 `files` 条目；并且当主题的 `defineTheme` 名称与其包导出的文件不同时，会说明重新构建会在新名称下写入文件。
- 集成作者现在会了解到运行中的 CLI 何时超出其包的 `@astryxdesign/cli` peer 范围：`astryx doctor integration validate` 和 `astryx integration check` 会列出 `cli_peer_version` 注记，指明包、范围和运行版本。低于范围时，注记会给出项目命令，以便一起安装更新版本的 `@astryxdesign/core` 和 `@astryxdesign/cli`（作为包自己文件夹中的开发依赖），然后运行 `astryx upgrade --from <version> --apply`。高于范围时，它会要求已安装包发布一个支持此 CLI 的版本，或要求当前文件夹中包的作者用此 CLI 测试并放宽范围。注记不会使任何检查失败：`--strict`、`integration verify`、`doctor` 和退出码均不变。
- `astryx component <Member> --package @astryxdesign/core` 现在会以该成员作答，与非作用域查找一样。记录在其 family 文档中的 Core 组件（Stack 文档中的 HStack 和 VStack）过去会返回 family 文档，以 family 命名且没有 props。
- 全局模式写入主文件夹的 agent 指南现在告诉 agent 交付用 Astryx 构建的页面，而不仅仅是如何查找内容。以前，找到正确模板的 agent 仍可能用无法安装包的工具构建页面，并交付一个不含 Astryx 的页面。该指南现在告诉 agent 在项目文件夹中工作（如果没有则创建一个）；向新项目或没有 Core 的项目添加 `@astryxdesign/core` 和 `@astryxdesign/cli`，或在已有 `@astryxdesign/core` 的项目中添加相同版本的 CLI；在那里运行 `astryx init`；遵循同样的模板优先工作流，并按项目 agent 文档进行自检；最后构建项目并交付该构建。该指南保持无版本信息，只提及每个版本都会保留的命令。项目 agent 文档不变，`@astryxdesign/core` 的安装脚本打印的内容也不变：其共享 agent 文档文件的副本只会增加相同的工作流行。
- 遵循全局模式写入主文件夹的指南的 agent 现在知道在找不到 `astryx` 时该怎么做：先运行当初为计算机安装 CLI 的命令，使用相同的包管理器和文件夹，例如 `npm i -g @astryxdesign/cli` 或 `pnpm add -g @astryxdesign/cli`。在保留主文件夹但重启时重置系统文件夹的机器上，该指南比安装在计算机上的 CLI 存续更久，并告诉 agent 运行一个已不存在的命令。在项目之外，当指南提到 `astryx` 且搜索路径上没有 `astryx` 命令（包运行器自带的副本除外）时，`astryx doctor` 现在会说明这一点，并指明指南记录的安装步骤，若未记录则指明 npm 的步骤。面向 CI 和容器的全局模式指南说明了如何在重启后保留 CLI。为宿主自己的命令编写的指南不变。没有 JSON 结构或退出码的变化。
- butter、stone 和 y2k 主题不再在禁用的 `ComplexSelector` 触发器上显示次要悬停填充，无论触发器是原生禁用还是暴露 `aria-disabled="true"`（现在每个禁用控件都使用的可聚焦形式）。以前，该防护只识别原生禁用的触发器。`astryx theme eject` 复制的主题带有相同的防护。
- 不使用 StyleX 构建步骤而使用 Core 预构建 CSS 的应用现在会获得默认数据颜色：预构建 CSS 定义了规范的 `dataVars` 默认值，因此编译导入和原始 CSS 引用都能正确绘制。
- `astryx init` 在项目根目录以项目提交的文件写入 agent 文档，因此 Codex、Gemini CLI、Copilot CLI 和 Claude Code 都能从项目根目录或其下任意文件夹读取该块（[#7497](https://github.com/meta/astryx/pull/7497)）。它不再将 agent 文档写入项目的子文件夹、主文件夹，或其中的设置文件夹（如 `~/.gemini`）。
  - `AGENTS.md` 保存该块，在缺失时创建。以前，只有 `CLAUDE.md` 的项目只在那里得到该块，因此 Codex 和 Gemini CLI 永远看不到它。
  - Claude Code 会在有 `CLAUDE.md` 或 `.claude/CLAUDE.md` 的文件夹中跳过 `AGENTS.md`，因此项目已有的 Claude Code 文件会保留完整副本：根 `CLAUDE.md`，否则 `.claude/CLAUDE.md`。即使它导入了 `AGENTS.md`，也会保留该副本，因为 Claude Code 在从子文件夹启动的会话中不会跟随该导入；从根目录启动时，Claude Code 会读取两份。当两者都存在时，副本放在根 `CLAUDE.md` 中（项目即使忽略 `.claude/` 也会提交该文件），并且 `.claude/CLAUDE.md` 中的块会被移除。Init 不会创建 Claude 文件。`astryx upgrade` 会刷新每个副本，主设置文件夹顶部的项目除外（见下一条）。
  - Gemini CLI 只读取 `GEMINI.md`：init 会添加一行导入 `@./AGENTS.md`，在缺失时创建 `GEMINI.md`。当 `GEMINI.md` 已经导入 `AGENTS.md`（无论内联还是单独一行）时，它不会添加。即使项目的 `.gemini/settings.json` 让 Gemini 通过 `context.fileName` 读取 `AGENTS.md`，它也会添加该导入：Gemini 只在从项目根目录启动时加载这些设置，因此从子文件夹启动的会话否则得不到副本。从根目录启动时，Gemini 会读取两份。
  - 项目根目录是 init 运行处或其上方的最近文件夹，其 `package.json` 声明了 `@astryxdesign` 包；否则是最近的任何含 `package.json` 的文件夹。搜索会在仓库根目录停止，绝不计入主文件夹。找不到 `package.json` 时，init 在运行处写入，与之前一样。`docsWritten` 仍列出相对于 init 运行处的每个文件，例如 `../../AGENTS.md`。
  - 解析到项目之外的 `GEMINI.md`（例如指向共享文件的链接）会被跳过，并在 `docsError` 中以一条注记（不是错误行）报告，在默认布局和项目自己的布局中都是如此；其余内容会写入，init 以 0 退出。
  - 受管块属于 Astryx：init 和 `astryx upgrade` 只写入、刷新和移除该块，无论忽略规则或生成标记如何，与 0.7.1 一样，并且从不更改其周围的文本。每次写入都保持在项目内：在 0.7.1 写入的文件夹中运行，0.7.1 在那里写入的 agent 文件若其路径离开项目，仍会以退出码 1 拒绝运行。项目的 Claude Code 文件（根 `CLAUDE.md`，或没有根文件时的 `.claude/CLAUDE.md`）若解析到项目之外，并且是现有 `AGENTS.md` 的无块导入（0.7.1 曾放过），会被跳过并在 `docsError` 中以一条注记报告，init 以 0 退出。从项目根目录下方的文件夹运行（0.7.1 改为在该文件夹写入）时，路径离开项目的项目根文件会被跳过并在 `docsError` 中以一条注记报告，其余内容写入，init 以 0 退出。
  - 当根 `CLAUDE.md` 未跟踪且被仓库的忽略规则忽略（从仓库根向下的任何忽略文件，例如 monorepo 根 `.gitignore`、本地排除文件或配置的排除项；init 会询问 git、Sapling 或 Mercurial）时，项目提交的 `.claude/CLAUDE.md` 也会得到副本，因此全新克隆仍能给 Claude Code 一份副本；`--agent claude` 和 `--agent all` 也会写入那里。仓库跟踪的文件无论忽略规则如何都算已提交，因为 git 和 Mercurial 只忽略未跟踪的文件；当仓库无法回答时，副本会被保留，首次运行和后续运行都一样。这样的副本若解析到项目之外，在 0.7.1 也写入它的地方会以退出码 1 拒绝运行；0.7.1 未写入的副本（`--agent claude` 添加的那个，或现有 `AGENTS.md` 的无块导入）会被跳过并在 `docsError` 中以一条注记报告，init 以 0 退出。对于 `--agent claude` 会在 `CLAUDE.md` 旁边移除其块的 `.claude/CLAUDE.md` 也是如此，因为 0.7.1 的 `claude` 预设在那里只写 `CLAUDE.md`。在已提交的根 `CLAUDE.md` 旁边，`.claude` 链接到项目之外，0.7.1 拒绝的三种情况现在以 0 退出且不写入任何内容：默认情况下有纯文本的 `.claude/CLAUDE.md`，以及 `--agent all` 下有一个纯文本或 `AGENTS.md` 无块导入的情况；根 `CLAUDE.md` 保存副本，因此没有写入离开项目。在保持自己布局的项目中，不导入任何 agent 文件的 `GEMINI.md` 现在会得到副本，与其他 agent 文件一样。
  - 只有当根 `CLAUDE.md` 持有相同的块时，才会移除 `.claude/CLAUDE.md` 中的副本，并且只移除其标记之间的受管块：文件其余部分保留，只有当只剩下空白时才删除文件。`astryx init --remove-agents` 只会删除它创建的文件，且仅当只剩下空白或 init 自己的标题时；0.7.0 还会删除剩余文本含标题和任何带 "guidance" 一词的行的文件。
  - `astryx init --remove-agents` 会在项目根目录（`init` 写入处）以及运行所在的文件夹中移除该块。从子文件夹运行时，它会移除 `init` 在根目录写入的内容，以及早期版本留在该子文件夹中的块；带有解析到项目之外的块的根 agent 文件会保持原样并附一条注记，运行以 0 退出，与 0.7.1 只触碰子文件夹时一样。退出码和 JSON 结构不变。
  - `--agent claude` 和 `--agent all` 绝不会同时在 `CLAUDE.md` 和 `.claude/CLAUDE.md` 中留下块，除非项目忽略 `CLAUDE.md`：当 `CLAUDE.md` 得到该块时，`.claude/CLAUDE.md` 中的块会被移除。`--agent all` 保留 `GEMINI.md` 导入。`--agent` 帮助和 working-with-AI 指南说明了这一点。`--agent-docs-path` 仍在 init 运行处写入，与之前一样。
  - 当 `GEMINI.md` 的导入指向没有块的 `AGENTS.md` 时，`astryx doctor` 会失败。CLI 和 `@astryxdesign/core` 中的设置检查不再将该导入计为已设置，并会查看 `GEMINI.md`。命令打印的运行 `init` 提醒也会查看项目根目录，因此一旦在嵌套包中运行过 `init`，它就会停止。
- `astryx init` 和 `astryx upgrade` 不再将 agent 文档写入你的主文件夹，或项目之外其中的设置文件夹（如 `~/.gemini` 或 `~/.claude`）。agent 会在每个项目中读取这些文件夹中的文件，因此那里的块会影响到无关的工作。这遵循 CLI 的现有规则：没有命令会将 agent 文档写入这些文件夹，并且命令自己文件夹之外的写入会在写入任何内容之前被拒绝。
  - **被 `init` 拒绝：** 主文件夹本身，以及其中任何以点开头的文件夹的顶部（每个这样的文件夹都是设置文件夹），即使它含有 `package.json`。其下方带有自己 `package.json` 的文件夹是项目，会被正常设置，例如 `~/.codex/worktrees/` 或 `~/.cursor/worktrees/` 中的 agent 工作树，`astryx upgrade` 会刷新它。使用 `--agent-docs-path` 时，会检查每个文件自己的文件夹：从主文件夹开始，`notes/AI.md` 会像以前一样写入，而 `AI.md` 或 `.claude/CLAUDE.md` 会被拒绝。
  - **`init` 改为这样做：** 它不写入任何 agent 文档，将 `docsError` 报告为 `install-failed` 并附上原因，然后以 0 退出，与之前一样。
  - **被 `upgrade` 拒绝：** 刷新根目录为主文件夹或设置文件夹顶部的项目中的块，例如带有 `package.json` 的 `~/.dotfiles`，无论是否使用 `--apply`。它会使块保持原样，将 `agentDocs.action` 设置为 `error`（绝不是 `would-refresh`），并警告该文件夹及原因；其其他步骤和退出状态与之前一样。那里没有块时，它会给出相同的原因，而不是建议 `astryx init`。`astryx doctor` 的 agent 文档修复也是如此，并且每个命令后的设置提醒保持静默。
  - **迁移：** 从项目自己的文件夹运行 `astryx init`，或手动将块添加到文件。将以主文件夹或设置文件夹为根的项目移动到自己的文件夹，或手动更新或移除其块。要移除早期版本写入 `~/.claude/CLAUDE.md` 的块，请在主文件夹中运行 `astryx init --remove-agents`。
- 一个进程中重复搜索会更快作答：`astryx search` 在目录未变时复用其条目索引，并将该复用绑定到索引读取的字段的同一列表，因此其中任何字段变化后索引都不会被复用。每个答案都不变。
- 将 CLI 打包进服务器函数的工具不再将整个项目文件夹打包进去：`integration check` 的导入检查中有一个路径的构建方式无法被文件追踪器跟随。该路径及其结果不变。
- 当同一进程再次搜索时，`@astryxdesign/cli/api` 的 `search()` 会更快作答：它会复用为同一文件夹和 `type` 收集的组件、文档、模板和主题，只要自那以后它读取的任何文件、列出的任何文件夹都未改变（包括链接的工作区包）。为了看到这些读取，进程中第一次此类搜索会为该进程包装 `node:fs` 的读取函数；在搜索之外，它们的行为与之前完全相同。结果不变。短时运行不受影响：每个 `astryx search` 命令只收集一次，与之前一样（[#7830](https://github.com/meta/astryx/pull/7830)）。
- 当块的作者显示名称有两个或更多词，并包含该块所示组件的每个词时，`astryx search` 和 `astryx build` 会按该显示名称找到块：命名它的查询（例如集成的 Rich Text Editor 块的 "rich text editor"）会将其排在第一。仅标示变体的显示名称（例如 "Inside a card"）不会被读取。

#### 文档

- `astryx docs cli/commands/postinstall` 现在记录了隐藏的 `postinstall` hook，`astryx docs cli/commands` 会列出它，`astryx postinstall --help` 会显示其退出码和示例。`astryx docs cli/commands/manifest` 的摘要（文本和 `--json`）去掉了最后的句号，因此与清单一直打印的描述一致。每个命令运行时打印的内容、其 JSON 和退出码均不变。
- 集成作者阅读的所有内容现在都位于一个主页下：`astryx docs authoring`：集成指南的路由从 `cli/integrations/…` 移到 `authoring/…`（例如 `cli/integrations/quick-start` 现在是 `authoring/quick-start`），位于 `astryx docs authoring/field-reference` 的字段参考旁边。`astryx docs authoring <name>` 仍会打开一个字段参考章节，旧 `cli/integrations/…` 路由的错误会指出其新路由。散落主题现在位于 Guides 或 Foundations 中，而不是 Unorganized，名称相同：`astryx docs getting-started` 仍会打开，其 Up 是 `astryx docs guides`。
- 新增指南 `astryx docs is-my-code-good`，从源代码和渲染证据检查组件使用、图标、自定义样式、布局、资源和代码健康，在一页可共享的文档中呈现。它包含一个 agent 提示，并要求缺失的证据保持可见。模板评分标准现在将每个类别链接到这些共享标准，而不是重复它们，并保留其自己的权重、计数规则和版本 1.4。
- 诸如 "add an integration" 或 "install a package" 这样的问题现在会优先找到面向应用构建者的指南。
  添加了 "Use integrations" 指南（`use-integrations.doc.mjs`），涵盖在应用中发现、安装和使用集成包；用 `astryx docs use-integrations` 打开它。对于这些问题，搜索会将其排在编写和 API 函数文档之上，而 "build an integration" 这样的查询仍会优先排列编写内容。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @josephfarina

---

# 0.7.2

#### 新组件

- 将 `Drawer` 和 `DrawerHeader` 从仅限 canary 的 Lab 包提升到 Core，可从 `@astryxdesign/core/Drawer` 或包根导入。稳定包现在提供全高侧面板，支持模态与非模态呈现、共享的关闭栈、Dialog 的 `purpose` 关闭策略、一个在传入 `onOpenChange` 时显示关闭按钮的 `DrawerHeader`，以及与 Dialog 风格的容器内边距（默认 `--spacing-4`、`padding` prop，或主题的 `drawer` 内边距），并附带 Core 文档和可运行示例。从 `@astryxdesign/lab` 导入的 canary 用户请改用 `@astryxdesign/core/Drawer`。

#### 新功能

- 集成组件文档可以指定其旁边文件中名称不同的导出：当 `Slides.tsx` 导出 `AcmeCarousel` 而没有名为 `Slides` 的导出时，`Slides.doc.mjs` 可以设置 `name: 'AcmeCarousel'`，而 kebab-case 的 `acme-widget.doc.mjs` 可以命名为 `AcmeWidget`。`component --list`、`component <Name>`、`search`、`swizzle`、`doctor integration` 的各项检查和 `integration verify` 都按该名称识别组件，而它的文件名仍然可以打开它。Core 或另一个文档文件已经使用的名称，在所有界面上都归它们所有，除非用 `--package` 指定该集成。文档和源码只读取而不运行；以文件名命名的文档，或与导出了自身名称的文件并排的文档，读取方式与之前完全一致。
- 集成 family 文档在 `components` 中列出的每个完整条目（例如 `AcmeCarousel` 文档中的 `AcmeSlide`），在文档 `import` 指定的模块导出它时，都是一个以自身名称存在的组件。其源码是 family 文件夹中声明它的 `.tsx` 文件；如果某个成员仅由构建产物声明，或由该文件夹之外的文件声明，则没有可显示或复制的源码。`component --list`、`component <Name>`、`search`、`swizzle`、`doctor integration` 的检查、`integration verify` 和 `integration add` 都能识别这些成员。成员的详情只作用于其自身条目，与 Core 子组件相同，并且永不携带 family 的 `replaces`。名称与 Core 组件或另一个文档文件相同的成员，需用 `--package` 打开。
- 为电脑安装的 CLI 会为电脑上的每个 agent 保留一份简短的 Astryx skill：`~/.agents/skills/astryx/SKILL.md`，大多数编码 agent 都会读取它；对于只读取自己 skill 文件夹的 agent，会以文件夹链接和相对目标、Windows 上的 junction，或在无法建立链接时以副本的方式链接到其 skill 文件夹（`~/.claude/skills` 始终如此；Kiro、Windsurf、Letta、Xcode 的编码助手，以及存在时的 `~/.config/agents/skills`）。Continue 的扫描器会跳过链接，因此会得到一份受管理的副本。文本告诉 agent：电脑上安装了 Astryx，在相关时（构建或更改 UI）应先运行 `astryx search`，并用 `astryx docs` 阅读文档；它不提及版本，只包含每个发行版都会保留的命令。该文件在全局副本首次运行时以及每次升级后在后台写入；包的安装脚本从不写入它。`astryx init --user` 现在会在任意文件夹中写入它，而 `astryx init --user --remove-agents` 会删除该文件、Astryx 建立的每个链接和副本，并关闭此功能。该设置以及 Astryx 建立的链接保存在每用户配置文件夹的 `astryx/settings.json` 中。文件会记录其文本的哈希，因此人工编辑过的文件永远不会被覆盖或删除，链接文件夹中不是 Astryx 创建的内容也不会被替换。当电脑上没有任何 `astryx` 命令运行 Astryx CLI 时，`init --user` 会在仍然写入的同时发出警告，其 `init.user` 回执会列出每个路径及其处理结果。在项目之外，`astryx doctor` 会增加 `computer-agent-text` 检查（仅信息），说明该文本是否存在、是否最新、是否被编辑或已关闭、链接到哪里，以及它跳过的任何链接文件夹或其 skill 文件夹缺失的情况。通过 `XDG_CACHE_HOME`、`XDG_CONFIG_HOME`、`LOCALAPPDATA` 或 `APPDATA` 设置的缓存或配置文件夹，仅在为绝对路径时才会使用。
- 为电脑安装的集成。如果集成包与为电脑安装的 CLI 安装在同一位置（`npm i -g`、`pnpm add -g`、`yarn global add`，或与 `@astryxdesign/cli` 并排的 `bun add -g`），或由运行它的工具与 CLI 一起安装在同一包集合中，那么它就是电脑级集成。在项目之外，它的加载方式与项目的集成相同：其组件、模板、文档、主题、discover 源和 `cliCommand` 都生效，并经过相同的校验；如果某个集成的 `@astryxdesign/core` 或 `@astryxdesign/cli` peer 范围排除了 CLI 的发行版，则会被跳过。pnpm 11 及更高版本会为每个全局包提供自己的文件夹，这些文件夹都会被计入。在项目内部，只加载项目自己的集成：电脑级集成在那里不添加任何内容；当它的 peer 范围允许项目的发行版且能够加载时，`astryx discover` 会在 `meta.available` 下将其列为 `source` 为 `installed for this computer`，并在 `install` 中给出项目的安装命令。如果项目安装了同一个集成，则只使用自己的副本。`astryx doctor` 会增加 `computer-integrations` 检查：在项目之外，列出它使用的每个集成、被文件夹中自己的副本取代的每个集成，以及被跳过或无法加载的每个集成的警告；在项目内部，列出项目可以添加的集成。
- `astryx gap-report --to <package>` 会按同样的 `--confirm-public` 规则，将报告发送到用户所选的已加载集成的 issues URL，而不是默认处理程序。当已加载的集成指定了自己的 issues URL 时，`--list-categories` 和回执会列出每个目标，并告诉 agent 询问用户要提交到哪里。默认路由保持不变。
- 为电脑安装一次 CLI（`npm i -g @astryxdesign/cli`），即可在任意文件夹中运行 `astryx`。在项目中，无论版本如何，始终由项目自己的 CLI 作答，和以前一样：从其他任何位置启动的副本（全局安装、`npx`、指定版本）都会把运行交给它。没有自己 CLI 的项目（只有 `@astryxdesign/core`，或全新克隆）会像以前一样由你启动的副本作答；当该副本不是 Core 对应的发行版时，命令结束后会给出一条提示（每个项目每天最多一次），指明按 Core 版本添加 CLI 的命令，JSON 会报告 `meta.answeredBy.copy: "starting"`。只有项目自己的 CLI 无法启动时，才会由与 Core 版本相同的 CLI 发行版作答，该发行版会一次性安装到每用户缓存中（优先从已安装的 Core，其次从 lockfile，最后从声明的范围）。当项目的 CLI 与 Core 是不同发行版，或项目没有 CLI 且作答副本与其 Core 不一致时，`astryx doctor` 会发出警告，并打印使它们对齐的命令。`astryx --help` 和清单中新的 `globalMode` 字段指向 `astryx docs global`。交接会保留参数、文件夹、标准流和退出状态。在项目之外，为电脑安装的副本会以自己的发行版作答；在那里读取 Core 的命令会使用该发行版的 Core：全局副本会在一次运行结束时启动的后台步骤中把它下载到缓存（从不在 CI 中，也不会在 Windows 上这样做，因为后台进程会持有调用者的管道，而第一个组件命令会改为下载它），因此组件读取在一次联网运行后可以离线工作。之前能正常工作的一切都不会中断：当无法获取该发行版时（离线、注册表没有它、缓存不可写），你启动的副本会像全局模式之前那样作答，并在标准错误上打印一行警告（`astryx: could not get Astryx <version> to match this project's Core (<reason>); answering with CLI <version> instead`），JSON 中为 `meta.answeredBy.copy: "fallback"`。只有当副本位于 npm 的全局文件夹或包管理器自身设置指定的全局文件夹中（Bun 的 `BUN_INSTALL` 或 `globalDir`、Yarn 的 `global-folder`、pnpm 的 `PNPM_HOME` 或 `global-dir`，或它们的默认值）时，才被视为已为电脑安装，绝不会仅凭文件夹布局判断，因此用 `yarn add` 创建的应用永远不会被误认；移动过的 Bun 或 Yarn 全局文件夹也会被计入，其通知会在那里重新安装。失败的安装会被记入缓存，因此离线运行不会每次都重新启动 npm：它会在 2 分钟后重试，再次失败后会在 10 分钟后重试，成功后则忘记它。过期的安装锁只有在它记录的进程恰好是该 CLI 对应发行版的安装进程时（npm，或运行 npm-cli.js 的 node 正在安装 `@astryxdesign/cli@<version>`，且在锁之后启动），才会终止该进程；否则只是接管该锁。新的 `ERR_VERSIONS_UNAVAILABLE` 保留给没有任何副本能作答的运行，例如在无法安装它的项目之外需要 Core 的命令。CLI 会使用正在运行的 Node 从 npm 自己的入口文件启动 npm，绝不通过 shell；并且只在项目声明的 Core 范围是普通版本范围时才读取它。
  每个成功的 `--json` 结果现在都带有 `meta.answeredBy`（`cli`、`core`、`copy`：`project`、`starting`、`matched`、`carried` 或 `fallback`），在 `CLIResponse` 中定型，并在输出信封文档中说明。在文本模式下，由项目自己的 CLI 以外的任何副本作答的运行会在标准错误上打印一行 `astryx: answered by …`。打印出的命令以能到达同一发行版的名称开头：项目自己的 CLI 作答时使用项目的运行器；在项目之外、由为电脑安装的副本作答时使用 `astryx`；其他情况使用固定到作答版本的 CLI 包（`npx @astryxdesign/cli@0.7.2`）。新的 `ERR_PROJECT_REQUIRED` 代码用于命名需要项目的命令。参见 `astryx docs global/install-once`。

- `astryx doctor integration` 和 `astryx integration check` 会捕获更多文档错误，并且不再标记 Core 自身使用的一种模式。
- 集成可以设置其用户运行 CLI 时使用的命令：`astryx.integration.*` 中新增 `cliCommand` 字段，例如 `cliCommand: 'acme astryx'`。在加载该集成的项目中，CLI 打印的每条命令都以它开头，而不是包管理器前缀（`npx astryx`、`pnpm exec astryx`）：包括下一步提示、错误、建议、Doctor 修复、`--help`、设置提醒、agent 文档块和文档文本。如果两个已加载的集成设置了不同的命令，则两者都不会被使用，`astryx doctor` 中新的 `cli-command` 检查会发出警告。无效的 `cliCommand` 会被忽略，并给出 `invalid_cli_command` 警告；清单的其余部分仍会加载。
  文档（包括集成的文档）现在使用裸 `astryx ...` 命令编写，`astryx docs` 在打印时会为项目加上前缀。JSON 输出仍像以前一样保持所有命令为裸形式。来自 `@astryxdesign/core` 和 `@astryxdesign/cli` 的安装时设置提醒会指明项目包管理器运行的命令，而不再总是 `npx @astryxdesign/cli`。

- 集成清单接受一个可选的 `docsiteUrl`，即指向集成文档站点的链接，作为已知字段，因此设置它不再触发未知键警告。
- 更新通知，做法与 `gh` 和 Vercel CLI 相同。每天一次，且首次运行后的第一天内不检查；为电脑安装的 CLI 会在后台检查注册表的 `latest` 发行版，不会延迟命令；它绝不会自行安装某个发行版。当存在更新的发行版时，成功完成的命令会在标准错误上打印两行，每天最多一次：`A new release of Astryx is available: <current> → <newest>` 和 `To upgrade, run: <command>`，其中命令来自安装 CLI 的包管理器（`npm i -g`、`pnpm add -g`、`yarn global add`、`bun add -g` 或 `volta install`），当电脑运行较旧 Node 时，会附在该发行版所需的 Node 之后。在项目内部，通知会改为指明项目的安装和 `upgrade` 命令；在交接之前位于搜索路径首位的 `astryx` 会收到指明其升级方式的通知。使用 `--json` 时、命令失败后，或设置了 `CI` 或 `NO_UPDATE_NOTIFIER` 时，不会打印通知；这两个变量也都不允许检查运行；与 `gh` 不同，当标准错误不是终端时仍会打印通知，因为 agent 运行 CLI 时没有终端。检查结果保存在每用户配置文件夹的 `astryx/state.json` 中。`astryx doctor` 也会报告同样内容：`newest-release` 检查会列出升级命令，新的 `cli-on-path` 检查会列出搜索路径上的每个 `astryx` 命令。
- 组件文档文本中的 `{@link <target>}` 现在会读取为打开其文档的命令，在 `astryx component <Name>`、其 `--props` 视图和组件列表中均如此，文本和 JSON 皆然：包括描述、用法、最佳实践、结构和无障碍说明，以及每个 prop 和示例的描述。主题的描述在 `astryx docs`、其列表和文档树中也会这样读取。代码字段和代码刻度会按原样显示链接。Core 组件的链接会针对 CLI 的文档解析；集成的链接则针对其自身文档。`astryx doctor integration components` 会对集成组件文档中未指向任何文档的链接发出警告，`doctor integration docs` 对主题描述中的此类链接也一样。书写指针警告也会读取组件文档和主题描述，每个发现现在都会指明其 `kind` 和 `field`。
- 组件 prop 文档接受 `stability: 'experimental'`，这是用于标记不在稳定兼容性承诺范围内的 prop 的机器可读标记，例如组件的 `experimental` prop 对象。
- `doctor integration docs`（因此也包括 `integration check`）会列出每一对逐字重复 10 个或更多散文单词的主题：可能是包自身的两个主题，也可能是其中一个与它所替代的 Core 主题之一。每个条目会指明保留文本的主题（Core 主题；如果是两个包主题，则指明该段落更适合的那个）、另一个主题中要更改的行，以及要放在那里的确切链接，并出现在新的 `copiedPassages` 字段中。内容词（除 "the"、"in" 或 "it" 这类功能词之外的词）少于 4 个不同的词，或被三个或更多主题共享的段落，不会被列出。每一对也会作为 `copied_passage` 警告，因此 `integration check --strict`（本版本新增）会一直失败直到修复；`doctor integration docs` 仍以 0 退出。
  CLI 自己的指南不再重复其他指南拥有的 18 个段落；每个副本现在都是指向拥有该事实的指南的链接。

- `astryx discover` 会列出官方 Astryx 包，且排在最前，来源是每个 CLI 发行版携带的列表，因此没有 discover 源的项目也能（即使离线）看到官方主题。`meta.available` 中的每个条目都带有添加它的命令（`install`），因此没有加载任何集成、也没有自己 discover 源的项目（此时每个查询仍会以该列表作答）可以直接从中添加包。官方条目的 `latest` 是 CLI 知道的最新发行版（发行版 CLI 上是其自身版本，或是项目拥有的更新 Core 发行版），其 `versions` 也会列出项目的 Core 版本，因此两者都可以查询。其添加命令会固定项目的 Core 版本（已安装的，或精确声明的），否则固定项目声明的 Core 范围（带引号），再否则固定最新发行版；在没有 Core 的 canary CLI 上，对于随 Core 发布的包不固定任何版本，而仅限 canary 的包只会在 canary Core 或没有 Core 时列出。官方条目的 `source` 为 `Astryx`，`meta.sources` 最后报告该列表。项目或集成的源会保留其对官方包的条目，以及对同一集成的任何包的条目。项目自己的 package.json 声明为依赖（包括通过 npm alias）的主题包，会从项目的任何文件夹显示为已安装；主题的添加文本以 `astryx theme add <slug>` 结尾。官方列表未显示的版本或条目仍会像以前一样回答 `ERR_UNKNOWN_PACKAGE`。
- `doctor integration docs`（因此也包括 `integration check`）会在新的 `fluff` 字段中列出包散文中的冗余内容：每个填充短语，例如 "in order to"、"note that" 或 "it is worth noting"，并附上其文件行和建议改写；以及每个 80 个或更多散文单词、其中不到一半单词承载内容的主题。每一项也会作为 `doc_fluff` 警告，因此 `integration check --strict`（本版本新增）会一直失败直到删减；`doctor integration docs` 仍以 0 退出。短语列表和下限位于 check-your-docs 指南中（`astryx docs cli/integrations/building-blocks/docs/check-your-docs`）。Core 的 `browser-support` 指南去掉了其唯一的填充短语，Core 的三个指南（`debug-and-gap-reports`、`sections-and-placement`、`publishing`）已收紧以满足密度下限。
- `astryx doctor integration validate` 现在会检查集成在其根目录下随附的每个文档（组件、模板、文档主题、主题及其翻译，无论是否提供服务），对照已发布的对应类型编写类型，并使用项目自己的 TypeScript，就像 `tsc` 那样。每个未知字段、缺失的必填字段或超出字段类型的值都是一个警告，指明文档、行、字段和修复方式；退出码不变。无法完整检查的文档，或无法加载的主题根目录，会连同原因一起列出；组件或文档根目录下 `__tests__` 中的测试夹具会被计入，但不检查。JSON 会增加 `data.docTypes`。没有 TypeScript 时，该检查会打印一行 `[skip]`，而不是静默通过；如果有 TypeScript 但无法读取类型（例如没有 JavaScript 编译器 API 的 TypeScript 7），该行会指明已安装的版本。没有文档文件时，会说明没有可检查的内容。
- `astryx doctor integration components` 会将每个组件文档的 props 与组件的 TypeScript props 进行比较，使用项目自己的 `typescript` 读取。它会对以下情况发出警告：文档记录了代码中没有的 prop、包声明了但文档遗漏的 prop，以及错误的 `required`。没有 TypeScript 时，它会打印一行说明跳过比较；如果有 TypeScript 但无法读取类型（例如没有 JavaScript 编译器 API 的 TypeScript 7），该行会指明已安装的版本。这些发现是警告，因此退出码不变；JSON 响应会增加 `data.propDrift`，其中其他内容不变。
- `astryx doctor integration components` 还会针对包声明的 props（包括 `status.type` 这样的文档字段和包的索引签名所接受的名称），将每个文档 prop 的类型与代码进行判断，并在两者不同时发出警告（`type_mismatch`）。只有在双方都能精确读取时才会判断类型，使用项目自己的 `typescript`：在忽略空白、引号和联合顺序后文本相同，或者是原始类型、字面量、数组及其联合，以及它们的名称。其他所有类型（回调、对象、带参数的泛型、交叉类型、`keyof`、无法解析的类型、两个索引签名接受的名称）都会被列为未比较，绝不会被报告。该比较需要 TypeScript 4.8 或更高版本：使用更旧版本时，不会判断任何类型，文本会在一行 `[skip]` 中说明。JSON 会在 `propDrift` 中增加 `typesCompared`、`typesNotCompared`，以及未判断类型时的 `typesSkipped`。这些发现是警告，因此退出码不变。
- 新增 `astryx integration check`，这是用于集成包自身构建的 CI 检查。它不接受包参数，检查当前文件夹中的集成包。它会运行四项 `doctor integration` 检查（`validate`、`components`、`templates`、`docs`），打印每项结果，然后打印摘要，并在任何一项会失败时以 1 退出。`--strict` 还会在任何警告以及任何未运行的检查（例如没有 `astryx.integration.*` 的包）上以 1 退出：将 `"typecheck": "tsc --noEmit && astryx integration check --strict"` 添加到 package.json，让每次构建都保持包的文档同步。其退出码和 JSON 是运行它的构建的契约：从这个首个发行版起，新的检查或新的失败代码只会在发行说明中指定的次版本中加入。JSON：新的 `integration.check` 信封会原样携带每个检查自己的信封。其文档说明要在 CI 中运行它，因此 `astryx search ci` 可以找到它。`doctor integration` 子命令保持其退出码；其 JSON 只会有新增内容。
- 三个新的已发布类型描述集成包的模板：`IntegrationPageTemplateDoc` 和 `IntegrationBlockTemplateDoc`，各自包含其 `TemplateDoc` 成员的除 `category` 外的每个字段，但 `category` 使用包自己的字符串，而不是 `TemplateCategory` 值；以及它们的联合类型 `IntegrationTemplateDoc`。`@astryxdesign/cli/authoring` 导出 `IntegrationTemplateDoc`；`@astryxdesign/cli/doc` 和 `@astryxdesign/cli/template` 导出全部三个。`TemplateDoc` 不变。
- `astryx upgrade` 会将 `List` 上的静态 `edgeCompensation="inline"` 重命名为 `edge="outset"`，并在 `edge` 为固定字符串时删除旁边的 `edgeCompensation`。在无法证明结果的情况下，它会保留 `edgeCompensation` 并加上 `TODO(astryx upgrade)` 注释：当 `edge` 是计算值时（它可能为 undefined，此时 `edgeCompensation` 仍然适用）、当 `edgeCompensation` 是动态值时，以及当 `List` 还展开 props（可能设置 `edge`）时。已弃用的 prop 在这些位置继续有效。
- `astryx doctor integration docs` 会列出集成散文中每个恰好为 `astryx docs <name>`（且文档存在）的代码片段，并说明应改写为哪个 `{@link}`：包自己的主题用 `{@link generic:<name>}`，Core 的用 `{@link @astryxdesign/cli:generic:<name>}`。该链接会打印打开文档的命令，如果文档消失，doctor 的链接检查会使其失败。包含更多单词、路由或代码块的命令不会被列出。每一项都是 `stray_doc_pointer` 警告，因此 `astryx integration check --strict` 会在其上失败，并出现在新的 `strayPointers` 字段中；`doctor integration docs` 保持退出码 0。Core 自己的指南使用链接指向，并有测试保持这一点。
- `astryx doctor integration validate` 和 `astryx integration check` 现在会在集成模板根目录中直接存在某个 `.tsx` 文件却没有同名模板文档时发出 `source_without_template_doc` 警告，因为 `astryx template` 永远不会列出它。该警告会指明文件和要添加的文档。子文件夹中的文件（例如模板导入的辅助文件）以及测试、spec 或 story 文件（例如 `stray.test.tsx`）不检查；带点的模板 id（例如 `landing.page.tsx`）会被检查，`integration check --strict` 会在该警告上失败。
- `integration check` 和 `doctor integration validate|components` 中的文档类型与 prop 检查，会在项目安装了 `@typescript/typescript6`（TypeScript 为工具发布的 TypeScript 6 API 包）且其自己的 `typescript` 缺失或没有 JavaScript 编译器 API（如 TypeScript 7）时，使用该包读取类型。当找不到可用的 TypeScript 时，跳过原因现在会以补救措施结尾：在 TypeScript 7 上添加 `@typescript/typescript6`，或安装 TypeScript 5.0 至 6（`npm install -D typescript@6`）。

#### 修复

- `extractComponents` 会从模板文件中本地声明的辅助函数报告幻影组件——例如由详情页模板中直接声明的 `function TimelineSection() {...}` 辅助函数派生的 "Timeline"，它并不是真正的组件。现在它会在后缀剥离之前，排除同一文件中任何由顶层 `function`、`class`、`const`、`let` 或 `var` 声明绑定的名称（从解析后的源码读取，因此注释、字符串和类型注解不计入），因此本地声明的辅助函数绝不会被误认为导入的组件。整个名称就是被剥离后缀的组件（例如裸 `Section`）现在会保留在列表中，而不是被清空。
- CLI 的全局副本和项目副本会更可预测地协同。自行构建 CLI 的仓库（`packages/cli` 与 `packages/core` 并排）会由该 CLI 作答，而不是以 `ERR_VERSIONS_UNAVAILABLE` 失败。在电脑之间共享的缓存文件夹中，发行版安装每 10 秒续期一次锁，来自另一台电脑且一分钟未续期的锁会被接管，而不是阻塞运行 20 分钟。在 macOS 和 Windows 上比较文件夹名称时不区分字母大小写；Windows 上的 Yarn 1 全局安装会被识别为全局安装；doctor 和提醒在搜索路径中查找 `astryx` 命令时，会读取 npm、pnpm（包括 pnpm 12 的）和 PowerShell 写入的 shim。
- 设置提醒、swizzle 的 StyleX 说明和一行 doctor 输出只陈述真实情况
- 使用 npm 安装在自有前缀下的 CLI（`npm i -g --prefix ~/.local`、`NPM_CONFIG_PREFIX`，或 `.npmrc` 中的 `prefix=`）现在会升级到同一前缀：更新通知和 `astryx doctor` 会打印 `npm i -g --prefix <prefix> @astryxdesign/cli@latest`，主目录用 `~` 表示。npm 的默认前缀（Node 自身的、`/usr/local`、`/usr`，以及 Windows 上的 `%APPDATA%\npm`）仍使用普通命令。
- CLI 现在使用 `postcss-selector-parser` 7.1.6，它以线性时间解析扁平选择器，并修复了一个 CPU 耗尽漏洞（#6985）。
- `integration verify` 使用与 discovery 相同的读取器读取包的导出，因此两者保持一致：通过文件夹索引文件重新导出的组件会通过，而仅类型重新导出不再算作该组件。
- `astryx component --list` 和 `astryx search` 能找到 VStack、HStack 和 Heading
  它们各自有自己的导入路径，但文档位于其 family 文件夹中：Stack 的文档记录 HStack 和 VStack，Heading 的文档与 Text 的文档放在一起。列表只统计组件自己文件夹中的文档，因此这三个组件从列表和搜索中缺失，`astryx component VStack` 只能通过模糊匹配找到其文档。现在，文档位于其他位置的组件会以其自己的导入路径被列出并搜索到，`astryx component VStack` 会直接打开其文档。

- 指向组件、页面或块的文档链接（`{@link component:AcmeButton}`、`{@link @astryxdesign/core:component:Button}`、`{@link block:acme-card}`）现在可以解析，并读取为打开它的命令：`astryx component <Name>` 或 `astryx template <id> --type <page|block>`，非 Core 的内容会带上 `--package`。以前，每个此类链接都按原样打印，`astryx doctor` 和 `doctor integration docs` 会警告它没有指向任何文档，对 Core 的组件和包自己的组件都是如此。未指向任何组件或模板的链接仍会警告，其提示现在会搜索组件或模板，而不是主题。对于这些类型，已解析链接的 `route` 为 null，没有 `astryx docs` 路由会打开它。
- 当添加的主题的构建模块导入了样式表（例如 `import './ocean.css'`）时，`astryx doctor` 不再让 "Theme owners and built imports" 失败，`astryx component` 也不再因 "Could not load the recorded theme" 而停止。Node 无法加载样式表，因此 CLI 会检查每个导入的 `.css` 文件是否存在，然后将其视为空。它会从主题模块的文件夹中查找每个样式表，当主题从另一个文件夹导入的模块指定了样式表时也是如此。当导入的样式表缺失，或模块有其他任何问题（例如缺少依赖、语法错误或加载时抛出的错误）时，Doctor 仍会失败。
- `astryx search` 在单词与目录中的不同时，能更多找到读者想要的内容。
- 当查询是某个指南声明为关键词的两词或更多词短语时，`astryx search` 会将该指南排在首位。`font size` 和 `font weight` 现在会先打开字体设置指南，而不是 Text 组件；`dark mode` 会先打开主题指南，而不是主题 hooks。名称恰好等于整个查询的组件仍会排在最前，单词查询不变，参考文档中的代码术语和表格单元格不会算作其关键词。
- `astryx search` 会将匹配更多查询词的条目前于名称更短的条目。
- `astryx integration check --strict` 会只打印每个发现一次。检查自身的输出会显示其消息和修复，结尾的 "Failing under --strict" 列表只按检查、代码和位置列出每个失败项，因此冗长的报告不再重复。
- `table-filter` 页面模板的手机宽度视图选项面板现在由其选中的标签页标注（`aria-labelledby`），而不是固定的 `aria-label`，因此屏幕阅读器会从控制它的标签页获得面板名称，标签页与面板的关系也能双向解析。
- `astryx theme build --check` 和 `themeBuild({check: true})` 会像最新发行版一样继续比较工作目录之外的输出，而不是像构建那样以 `ERR_PATH_TRAVERSAL` 拒绝它们。检查模式不写入任何内容，因此 `architecture:cli-surface/INV10` 和 `INV10a` 的写入限制不适用于它：工作目录之外的绝对 `--out` 路径、位于工作目录之外且输出在其旁边的主题文件，以及根主题文件位于工作目录之外的 `--family`，都会以只读方式检查。逃逸出工作目录的相对 `--out` 路径仍像以前一样被拒绝。构建会继续拒绝这些写入中的每一个，因此当此类输出过期时，报告不再以构建会拒绝的 `Rebuild with:` 命令结尾。它会指明包含主题文件和输出的最近目录，以及应从该目录运行的构建和检查命令：每个输出的 `Source:` 头会记录其构建运行所在的目录，因此检查只有在同一目录下运行才能通过。工作目录内的过期输出仍会保留 `Rebuild with:` 行。
- `astryx theme build` 和 `themeBuild()` 现在只写入工作目录内（API 为 `cwd`），这是 `architecture:cli-surface/INV10` 的要求；在 `architecture:cli-surface/INV10a` 下，这种拒绝属于兼容性修复。这些构建现在都会在写入任何内容之前以 `ERR_PATH_TRAVERSAL` 失败：工作目录之外的绝对 `--out` 路径、位于工作目录之外且输出会放在其旁边的主题文件，以及根主题文件位于工作目录之外的 `--family`。工作目录内的路径仍可构建，包括通过符号链接。要迁移，请从包含主题文件及其输出的文件夹运行构建，或传入该文件夹内的 `--out` 路径；API 调用者传入包含它们的 `cwd`。
- 当 CLI 比已安装的 `@astryxdesign/core` 旧时，`astryx upgrade` 不再将你的代码报告为已是最新。Core codemod 随 CLI 一起发布，因此较旧的 CLI 没有其版本之后各发行版的 codemod。它以前会打印 "No changes needed" 和 "No codemods available for this version range" 并以 0 退出，而代码仍需要这些发行版的迁移。现在它会警告一次无法完成，打印固定到与你的 Core 匹配的 CLI 发行版的相同升级命令（例如 `cd <project> && npx @astryxdesign/cli@<core-version> upgrade --from <old-version> --path <source-dir> --apply`），并以 "Upgrade incomplete" 结尾。该命令会切换到本次运行使用的文件夹，并以绝对路径指明它扫描的目录，两者都会解析符号链接，因此无论粘贴到哪里，它都会升级同一份代码。它面向 POSIX shell 编写，在 Windows 上则面向 PowerShell。`upgrade.status`（`no_codemods` 和 `config_fixable`）和 `upgrade.run` 会增加可选的 `cliBehindCore` 字段，包含 `cliVersion` 和 `command`，仅在该情况下出现。CLI 已有的 codemod 仍会运行，退出状态和每个现有字段都不变。
- `astryx integration verify` 接受加载主题自身样式的主题模块。此类模块会为了副作用导入主题导出的样式表和字体样式表，并从 `astryx theme build` 写入的模块重新导出全部内容，或仅按主题的导出名称重新导出主题。Verify 还会按 `theme build` 赋予它的名称（即主题自己的名称）找到该构建模块，因此名称与 slug 不同的主题不再无法重新构建。与构建模块的其他任何差异仍会以 `theme_module_stale` 失败；对于重新导出主题的模块，消息现在会说明问题所在。

#### 性能

- CLI 只在构建或检查主题时（`theme build`，以及 `doctor` 和 `integration pack` 的主题检查）加载 Core 的运行时（`@astryxdesign/core` 和 `@astryxdesign/core/theme`），而不是在每次启动时加载。在安装了 Core 的项目中，其他每个命令以及对 `@astryxdesign/cli/api` 的导入都会跳过加载 Core 的组件和 React：`astryx --version` 从约 1.3 秒降到 0.5 秒。输出不变。

#### 文档

- 文档和 CLI 示例会从 `astryx component <Name>` 打印的路径导入每个 Core 导出。
- 全局模式文档：`astryx docs global` 是一个顶层文档小节（以及 Guide 下的一个文档站点页面，由 Getting Started 介绍并链接），说明什么是全局模式、唯一的安装命令、可以得到什么，以及哪个版本在哪里运行。其页面各回答一个问题：项目、全局还是两者兼有（推荐两者；`global/project-global-or-both`）、安装（`global/install-once`，包括如何处理 `EACCES`）、哪个版本运行及原因（`global/who-answers`）、更新与通知（`global/updates`）、电脑上的 agent 指南（`global/computer-agent-guide`）、全局安装的集成（`global/computer-integrations`）、monorepo 与嵌套文件夹（`global/monorepos`）、CI 与容器（`global/ci-and-containers`）、排查全局模式打印的每一行（`global/problems`）、卸载与重置（`global/uninstall`），以及路径、环境变量、JSON 字段和错误代码的参考（`global/reference`）。`astryx docs global` 及其页面由你启动的副本作答，即使在版本早于它们的项目中也是如此。集成作者会得到一份清单，其中包含全局试用包的命令（`cli/integrations/global-integrations`）。每个在项目之外做其他事情的命令都会在其 "In global mode" 说明中准确说明该做什么，并与在空文件夹中运行该命令的结果核对；全局模式页面显示的每个终端行都会与 CLI 自己的字符串核对。项目的更新通知现在会在 Core 旁边安装 CLI，因此只安装了 Core 的项目也会拥有自己的 CLI。
- 集成指南将 `integration check --strict` 设为每个集成构建中的必需步骤：快速开始会安装 `typescript@6`（检查需要其 JavaScript 编译器 API，而 TypeScript 7 不提供），并添加 "Check it in every build (required)"；Build an integration 概览也这样说明；检查指南的章节标题为 "Run every check in every build (required)"。
- `astryx docs cli/integrations` 指南和 `astryx docs authoring` 现在与当前 CLI 匹配，指南会为每个字段指向匹配的 `astryx docs authoring <section>`，而不是重复其表格。
- 修复 working-with-ai 中的 MCP 设置片段——"type": "url" 不是传输类型，Claude Desktop 通过 Connectors 添加远程服务器

#### 其他变更

- `VStack` 和 `HStack` 来自 `@astryxdesign/core/VStack` 和 `@astryxdesign/core/HStack`，`Heading` 来自 `@astryxdesign/core/Heading`，`Text` 来自 `@astryxdesign/core/Text`，`Theme` 和 `defineTheme` 来自 `@astryxdesign/core/theme`。
- 这涵盖指南、`Card` 文档、`astryx init` 打印的后续步骤、`astryx theme build` 打印的安装示例、`theme add` 打印的接线示例、构建规则、`astryx doctor` 打印的主题模块修复，以及带注释的主题模板。
- 每个路径本来就已经导出。其他内容不变。
- `docsZh` 或 `docsDense` 覆盖层可以像 Core 自己的文档那样设置 `name` 和 `displayName`；两者在文档渲染时都会被忽略，因此 `--strict` 不再因它们而失败。
- `doctor integration components` 会将文档中的 `default` 与组件在 props 解构中写入的字面默认值（`size = 'md'`）不同时报告为 `default_mismatch`。引号和空白会被忽略；当任一侧的默认值不是字面量时，该 prop 会被列为未比较。
- `doctor integration validate` 会对以下情况发出警告，每项都附带修复：prop 被重复文档化（`duplicate_prop`）、`propDescriptions` 键与任何 prop 条目的书写名称不匹配（`unknown_translated_prop`）、小节没有内容（`empty_section`）、同一主题的两个小节使用相同键（`duplicate_section_key`，其修复会指明第二个小节已在使用的键），以及 `.doc.zh.mjs` 或 `.doc.dense.mjs` 覆盖层旁边没有任何主题文件（`orphan_doc_overlay`）。
- 占用 Astryx 自身文档路由的主题会按其主题名称命名，而不是内部 id，并给出要进行的重命名。以裸名称书写的链接（`{@link deploying}`）会给出要写入的确切链接，或说明没有该名称的主题。
- 当文档缺少多个必填字段时，每个发现的消息只指明其自己的字段。
- `doctor integration validate` 会在文本输出中打印每个问题的修复和文件，JSON 已经携带这些内容。
- "run init to finish setup" 提醒不再在 agent 已有 Astryx 提示的地方打印。在 git 仓库中，它会从项目向上到仓库根目录查找 agent 文档中 init 的块，因为编码 agent 会读取其间的每个 agent 文档，因此 monorepo 中在根目录运行过 `init` 的包会保持安静。这适用于每个命令，以及在安装 `@astryxdesign/core` 或 `@astryxdesign/cli` 时打印的提醒。从 CLI 自己的源码检出中、在该检出内运行 CLI 时，不会打印提醒。无法触达该块的项目仍会收到提醒，`--json` 永远不会打印它。
- `astryx swizzle` 不再在没有 StyleX 编译器时说 StyleX 组件 "render unstyled (no error)"。导入它们会抛出 StyleX 的 "Unexpected 'stylex.create' call at runtime" 错误，页面不会渲染，说明现在会这样写。
- 在集成包中，当包自己的清单加载时，`astryx doctor` 的隐式集成行不再说 "every loaded integration is named in astryx.config"。它会指明包自己的清单：作为唯一加载的集成，或与 astryx.config 指名的集成并列。

  分类：恢复契约。只更改消息文本：JSON 键、检查 id、状态和退出码不变。doctor 行的新文本也会出现在其 `--json` 的 `message` 中。

- `astryx doctor integration components` 的内部基础工作：将组件文档记录的 props 与其 TypeScript 源码声明的 props 进行比较，使用项目自己的 `typescript` 读取。目前还没有任何内容使用它，因此 CLI 的行为和输出不变；该命令会在后续更改中开始运行它，届时会描述用户看到的内容。
- `astryx doctor integration components` 的内部基础工作：当两个写出的 TypeScript 类型仅在书写方式上不同时（空白、注释、引号、成员顺序、用 `Array<T>` 表示 `T[]`、参数名、`React.` 限定符），将它们读取为同一类型，并在双方都能精确读取时判断文档 prop 类型与代码声明的类型。目前还没有任何内容使用其中任何一项，因此 CLI 的行为和输出不变。
- `astryx doctor integration components` 的内部基础工作：查找项目自己的 `typescript`，像 `tsc` 那样读取包的 TypeScript 项目（其自己的 `tsconfig.json` 或 monorepo 根目录的配置、solution 式配置的引用，以及配置包含的声明文件），并查找该项目中编译器无法解析的引用。目前还没有任何内容使用它，因此 CLI 的行为和输出不变。
- 旧 CLI 说明会指明行为如此的已发布版本：模板 `replaces`、链接、文档小节、小节 `id` 和带类型的主题描述符从 0.6.4 起可用，模板 `keywords` 从 0.6.6 起可用。`integration verify` 仍会指明要声明的 CLI 范围。
- 快速开始会将包设为 ES 模块，因此它构建的主题可以被导入。
- 已修正偏离的示例和输出，其中包括子组件导入、扩展另一个主题的主题，以及升级输出。
- Authoring Reference 更正了无效 `astryx.config` 的处理方式、`issuesUrl` 格式、codemod 文件的位置，以及哪些字段尚未被任何内容读取。其示例使用 `integration add` 写入的 `export default {type: ...}` 形式。
- `astryx docs cli/integrations` 链接到 Authoring Reference，而该参考又链接回指南。
- `astryx docs styling-overview` 和 `tokens-and-setup` 给出了缺少 StyleX 编译器的真实症状：导入 swizzle 后的组件会抛出以 `Unexpected 'stylex.create' call at runtime` 开头的错误。
- 相邻的查询词如果组合成组件、hook 或模板名称，或组合成一个单词的关键词，就会匹配它：`table header cell with sort arrow` 找到 `TableHeaderCell`，`tree view folders` 找到 `treeview` 关键词，hook 无需 `use` 也能按其单词匹配。名称的大部分、名称的前几个词，或其连续单词，也会为组件和 hook 计分，但比完整名称低一级。
- 如果查询是一个 camelCase 标识符，且按原样匹配不到任何内容，就会按其拼出的单词读取，因此像 `useTablePaginationState` 这样的未知 API 名称会到达 `useTablePagination`。在多词查询中，每个标识符仍保持为一个词项。
- 当整个查询是某个条目的名称时，这些读取不会在它旁边添加近似兄弟项。对组合关键词的匹配永远不会排在对查询所指条目的匹配之上；对另一个名称的一部分的匹配，只有在其跨越的查询词多于该条目的名称时才会如此。
- 动名词会匹配其动词（`spacing` 和 `space`、`dragging` 和 `drag`），复数可以通过其单数形式开启更长的单词（`tokens` 和 `Tokenizer`）。
- Core 组件文档声明了更多关键词：其他库的名称（`scrollarea`、`togglegroup`、`pageheader`、`splitpane`、`circularprogress`、`linearprogress`、`commandmenu`、`relativetime`、`sidesheet`、`descriptionlist`、`inlinecode`）以及 `Icon` 上的常见字形名称，因为任何图标库的字形都会通过它渲染。
- JSON 形状不变。
- 对较长名称一部分的匹配，如果读取的查询内容多于查询所指条目，就不再被压在它下面：`dropdown menu radio options` 会以 `DropdownMenuRadioItem` 开头，而不是 `DropdownMenu`。
- `useResizable` 去掉了 `splitview` 关键词，该关键词曾使它排在侧面板指南之前。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @abu-abdullah22
- @cixzhang
- @dependabot
- @imdreamrunner
- @josephfarina
- @kentonquatman
- @Kyujenius

---

# 0.7.1

#### 修复

- `CommandPaletteInput` 现在暴露其可见状态所承诺的语义和名称。（#7321）
  - 没有弹窗属性的独立字段以前是 `role="combobox"`，带有 `aria-expanded="true"` 和 `aria-autocomplete="list"`；现在它是 `role="searchbox"`，没有弹窗状态。要保留旧语义，请传入 `role="combobox"` 或你的弹窗自己的 ARIA 属性。已经传入弹窗属性（`aria-expanded`、`aria-controls`、`aria-owns`、`aria-haspopup` 等）的字段仍为 `combobox` 并保留这些属性，`CommandPalette` 内的字段不变。

  - 该字段的默认可访问名称以前是它的占位符（`Search…`，或调用者的 `placeholder`）；现在是被翻译的 `Search commands`。传入 `label` 可保留特定名称，例如用 `label="Search…"` 保留旧默认值。自定义 `placeholder` 曾用作名称的调用者，代码仍可工作，但会听到通用名称，直到传入 `label`。

  - CLI 的异步搜索 CommandPalette 块将其字段命名为 `Search files`。

  - `endContent={true}` 不再渲染空的尾随槽位，`endContent={0}` 会渲染在尾随槽位内，而不是其后。
- Stone、Y2K 和 Gothic 在各自的语法调色板中设置 `CodeBlock` 的 diff 行槽位，因此这些主题上的 diff 读者能看到新增和删除行中的代码、行号和 `+`/`-` 字形都保持可读：在 Stone（浅色和深色）和 Y2K（浅色和深色）中，每个语法 token 在着色行上的对比度至少保持 4.5:1；在 Gothic 中，这些行采用与背景自身亮度相称的深绿色和深红色，因此每个 token 保持其在普通背景上的对比度。更改行上的行号和字形使用每个主题自己的绿色和红色。CLI 内置的三个主题副本（`astryx theme eject`）携带相同的调色板。（#7428）
- `secondary` Selector、MultiSelector 或 ComplexSelector 现在会匹配主题的 secondary Button：在 butter、chocolate、gothic、stone 和 y2k 下，它会采用该 Button 的边框、填充、文字颜色和 hover，而不是默认的无边框中性填充，因此混合了 secondary 按钮和选择器的工具栏读起来像一组控件。禁用和只读触发器的 hover 会保持静止填充，与禁用的 Button 一样；InputGroup 内的 Selector 或 MultiSelector 会保留该组的中性填充和边缘。默认主题不变，选择器文档现在说明 `secondary` 会跟随主题的 secondary Button，使用 CLI 添加的主题也会获得相同的对齐效果。（#7548）
- `astryx theme build --watch` 在被中断（Ctrl-C 或 SIGTERM）后立即停止。在重新构建运行时保存的更改，不会再在 "Stopped watching." 之后启动另一次重新构建；正在进行的重新构建会随监视器一起停止，而不是让进程继续存活。（#7508）

#### 性能

- `astryx search` 和 `astryx build`，以及 `search` 和 `build` API 函数，每次调用只读取每个源码目录一次，而不是每个候选项读取一次。结果不变。在 macOS 上，热启动的 `search` 从约 1.9 秒降到 0.4 秒。（#7421）

#### 文档

- 生成的 token 文档列出了语法词汇表的五个 diff 行槽位——`--color-syntax-added`、`--color-syntax-removed`、`--color-syntax-diff-header`、`--color-syntax-added-marker`、`--color-syntax-removed-marker`——及其默认值，因此 `astryx docs tokens` 描述了十九个语法槽位。（#7389）
- Tailwind 和迁移设置文档现在说明：`globals.css`（或只包含 `@layer` 行的 `layers.css`）必须是根 layout 或应用入口中的第一个导入，位于 `astryx-themes` 模块或任何导入主题 CSS 的组件之前；否则 Tailwind preflight 会覆盖 Astryx 基础样式，主题覆盖会失效。Tailwind v3 共存片段将其 `@layer` 行移入首先导入的 `layers.css`，因为 Next.js（webpack 或 Turbopack）会将 CSS 导入提升到内联 `@layer` 行之上。（#7534）
- Grid 的 `columns` 文档现在以可重排的形状开头：数字 `columns` 在任何宽度下都恰好是 N 列，永远不会重排；`columns={{minWidth, max}}` 是需要适应手机宽度的列所使用的形式。`astryx docs layout/responsive` 主题新增了 "Columns that reflow" 小节，其中包含一个可重排的统计行和一个固定的周行。无行为变化。（#7340）
- 样式设置文档现在在每条路径上都加载预构建的样式表。"StyleX from source" 路径改为 "StyleX for your own code"：它保留 `astryx.css`，并只将 StyleX 编译器指向你自己的源码和 swizzle 后的源码。新的 "Other Astryx packages" 小节列出了每个包的样式表（`richtext.css`、`lab.css`、`charts.css`）以及导入位置。Getting started 不再列出那两个编译 Astryx 源码的示例设置；其余示例都加载 `astryx.css`。（#7587）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.0

#### 破坏性变更

- `theme add` 现在导入构建好的主题；请使用 `theme eject` 复制主题源码。（#7138）
  旧契约使用 `theme add <slug> [path] [--overwrite] [--package <package>]` 复制主题源码，并返回 `theme.add` JSON。`ThemeAddResponse` 类型和 `theme.add` 响应类型被移除，连同其 `ThemeAddResponse.type`、`ThemeAddResponse.data` 和 `ThemeAddResponse.meta` 字段。替代方案使用 `theme add <slug> [--package <package>]` 导入构建好的主题，并返回 `theme.app`；`--import` 仍作为可接受的空操作保留。裸 `theme add` 现在返回 `theme.app`，其 owner `package` 紧跟在 `type` 之后。本地主题不携带 package。

  `theme add` 后的路径现在会以 `ERR_INVALID_ARGUMENT` 退出 1，`--overwrite` 会以 `ERR_INVALID_OPTION` 退出 1；两者都不写入文件。要迁移复制源码的脚本，请使用相同的 slug、path、`--overwrite` 和 `--package` 参数运行 `theme eject`。已经运行 `theme add --import` 的脚本保持相同含义，无需更改。

- `init --remove-agents` 会在没有可移除内容时说明情况。（#6623）
  迁移：将 `data.removed` 作为布尔值读取的调用者仍可工作；按字面量 `true` 收窄类型的调用者必须接受修正后的值。

- 四个命令会拒绝被静默忽略的选项对。（#7132）
  迁移：移除该命令正在忽略的选项。

- 拒绝以前会静默成功的无效输入。（#7149）
  迁移：传入有效的 type 或 package、整数 limit，或文档中说明的参数；对于多包名称，捕获 `ERR_AMBIGUOUS_COMPONENT`。

- 空字符串参数不再丢弃命令的其余部分。（#6620）
  迁移：从调用中移除空字符串；要列出时省略该参数。

- 当没有 package.json 时，`doctor integration validate` 以 1 退出。（#7150）
  缺少 package.json 现在会产生 `no_package` 错误，因此现有的错误严重度退出规则适用。有 package.json 但没有集成清单的目录仍以 0 退出。

  迁移：在包含 `package.json` 的目录中运行该命令，或针对这种情况处理退出码 1。

- 将规范的数据颜色默认值从生成的主题 CSS 移到公开的 StyleX `dataVars` 组。（#6834）
  对于支持 CSS 的代码，从 `@astryxdesign/core/theme/dataTokens.stylex` 导入 `dataVars`。Canvas 和其他非 CSS API 继续使用 `resolveThemeToken()` 或 `useTheme().token()`。使用 `astryx theme build` 重新构建已提交的主题 CSS；具体主题现在只发出显式编写的数据库颜色覆盖。

  旧用法：生成的主题 CSS 拥有规范的 `--color-data-*` 根默认值。

  替代方案：`@astryxdesign/core/theme/dataTokens.stylex` 中公开的 StyleX `dataVars` 组拥有默认值；具体主题只发出显式编写的 data-color 覆盖。

  迁移：对于支持 CSS 的代码，从 `@astryxdesign/core/theme/dataTokens.stylex` 导入 `dataVars`。Canvas 和其他非 CSS API 继续使用 `resolveThemeToken()` 或 `useTheme().token()`。使用 `astryx theme build` 重新构建已提交的主题 CSS。

  Codemod：`astryx upgrade` 运行 `validate-data-token-ownership`，它不重写任何内容，并报告没有 fallback 的 `var(--color-data-*)` 用法（完整或嵌入的源码字符串，以及样式表）和过期的生成主题 CSS，供手动迁移。

- 当 CLI 无法加载 astryx.config 要求的内容时，Doctor 失败（#7130）
  新的 `configured-integrations` 检查会在 astryx.config 指名的集成无法加载时失败：未安装、已安装但没有清单，或清单抛出错误或未通过其 schema。此类集成会被整体撤回，不贡献任何内容。当 astryx.config 可以导入但 CLI 无法从中加载项目时，配置检查会失败，而不是警告。

  不变：某一种贡献类型内部的问题（无效的组件文档、缺失或不可读的根目录，或未解析的替换）仍作为 `integration-issues` 下的警告，无法加载的自动链接依赖仍为信息。

  不适用 codemod：项目源码中没有任何内容改变；请安装该集成、修复其清单，或编辑 astryx.config 中的 `integrations`。

  算作已配置的是 astryx.config 列出的每个名称，包括为提供程序冲突而搁置的包，以及当其自己的配置指名时正在编写的包。迁移：安装该集成、修复其清单，或从 `integrations` 中移除它；修复消息所指的 astryx.config 字段。

- Typeahead、Tokenizer、CheckboxList、RadioList 和 Slider 不再接受根 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段设置样式（Field 盒子；在 InputGroup 或 `horizontal-labels` FormLayout 内无效），并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒子设置样式。基础 props 现在会到达主要的语义控件：Typeahead 和 Tokenizer 的 combobox 输入、CheckboxList 和 RadioList 的 `role="group"`/`role="radiogroup"` 元素，以及 Slider 的 `role="slider"` 滑块（范围模式下为 `role="group"` 控件）。调用者的 `aria-describedby` 会与字段自身的描述和状态一起保留，在这些组件以及 TextInput、TextArea 和 NumberInput 上都是如此，后者之前会丢弃它。CLI 模板使用新的 props。（#7339）
  迁移：将根 `xstyle`/`className`/`style` 重命名为它们之前所样式化的部分：所有五个组件上都用 `containerXstyle`/`containerClassName`/`containerStyle`，但 InputGroup 内的 Typeahead 除外，其根样式绘制的是控件表面，应移到 `controlXstyle`/`controlClassName`/`controlStyle`。本发行版的 `astryx upgrade` codemod `migrate-field-input-styling` 会在 JSX 用法上执行这些重命名。

  codemod 不会重写的内容，请手动更新：

  - `ref` 和 `id`，以及 `data-*`（Typeahead 和 Tokenizer 的 `data-testid` 除外，它标记控件表面）、`aria-*`，以及诸如 `onClick` 的 DOM 事件处理程序，以前会落在外部 Field 上（或被 RadioList 和 Slider 丢弃）。它们现在落在主要的语义控件上。请更新测量、查询或监听外部字段的代码，并在需要外部边界时自行包裹组件。
  - Typeahead 和 Tokenizer 的 ref 现在是 `HTMLInputElement`。
  - Typeahead 或 Tokenizer 上的调用者 `onKeyDown` 仍会在内置按键处理之后运行，无法取消它，并且仍会为清除按钮和 token 上的按键触发；对于输入上的按键，它现在会在 combobox 输入本身上运行。
  - RadioList 和 Slider 以前会丢弃 DOM 事件处理程序；它们现在会在组件自身处理之后运行，因此以前从不触发的 Slider `onPointerDown`、`onKeyDown`、`onFocus` 或 `onBlur` 现在会触发（在滑块上，或范围模式下的组上）。
  - Tokenizer 的 `onFocus`/`onBlur` 保持其含义：焦点进入或离开字段。
  - 通过包装器自身 props 或 spread 传递的样式不会被重写，并且现在会在该调用点导致类型检查失败。

  无类型调用者会收到开发警告，且该值会被忽略。

  来自 #5656，作者 @harjothkhara。

- Selector、MultiSelector 和 ComplexSelector 不再接受根 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段设置样式（Field 盒子；在 InputGroup、`horizontal-labels` FormLayout 内或使用 `renderTrigger` 时无效），并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒子设置样式。诸如 `ref`、`id`、`data-*`（包括 `data-testid`）、`aria-*` 和 DOM 处理程序的基础 props 会到达携带 combobox 角色的触发按钮（或使用 `renderTrigger` 时调用者的控件），调用者的 `aria-describedby` 会与字段自身的描述和状态一起保留，而不是被替换。处理程序保持现有顺序：ComplexSelector 在其自身触发器上的 `onClick` 仍可取消打开，新转发的事件处理程序（包括到达 `renderTrigger` 控件的处理程序）会在内置切换和键盘处理之后运行。CLI 模板使用新的 props。（#7341）
  迁移：将这些组件上的根 `xstyle`/`className`/`style` 重命名为 `controlXstyle`/`controlClassName`/`controlStyle`，它们样式化与之前相同的元素。不是重命名：`data-testid` 或其他基础 prop 现在会落在触发按钮上，而不是其周围的有边框盒子上（如果测试测量了该盒子，请用 `.closest()` 查询它）；使用 `renderTrigger` 时，基础 props 和 `ref` 现在会到达调用者的控件。手动重命名 JSX 用法，或运行 `astryx upgrade`；它会运行 `migrate-field-input-styling`，该 codemod 不会跟随通过包装器自身 props 或 spread 传递的样式，而这些样式现在会在该调用点导致类型检查失败，因此请在那里重命名。无类型调用者会收到开发警告，且该值会被忽略。

  来自 #5656，作者 @harjothkhara。

- TextInput、TextArea、NumberInput 和 FileInput 不再接受根 `xstyle`、`className` 或 `style`。请使用 `containerXstyle`/`containerClassName`/`containerStyle` 为字段设置样式（Field 盒子；在 InputGroup 或 `horizontal-labels` FormLayout 内无效），并使用 `controlXstyle`/`controlClassName`/`controlStyle` 为视觉控件盒子设置样式。诸如 `ref`、`id`、`data-*`、`aria-*` 和 DOM 处理程序的基础 props 会到达原生控件，调用者的 `id` 现在会在这里生效。CLI 模板使用新的 props。（#7336）
  迁移：将这些组件上的根 `xstyle`/`className`/`style` 重命名为 `controlXstyle`/`controlClassName`/`controlStyle`，它们样式化与之前相同的元素。`astryx upgrade` 会重写 JSX 用法；通过包装器自身 props 或 spread 传递的样式不会被重写，并且现在会在该调用点导致类型检查失败，因此请在那里重命名。无类型调用者会收到开发警告，且该值会被忽略。codemod 不会重写：调用者的 `id` 以前会被生成的 id 替换，现在会到达原生控件（label 仍保持关联），因此请移除你传入但依赖其被忽略的 `id`。其他基础 props 已经到达原生控件，保持不变。

  来自 #5656，作者 @harjothkhara。

- matcha 和 y2k 的间距步进使用 rem（`--spacing-2: 0.75rem`），因此它们的间隙和内边距会像核心比例一样跟随读者的根字体大小。在默认 16px 根字体下，每一步的像素值相同；根字体更大的读者现在会在这些主题上看到按比例增大的间距。CLI 的两个主题模板副本以及带注释主题模板的间距示例也以相同方式更改。（#7374）
  迁移：无需更改即可采用新行为。要在这些主题之一上保持固定像素间距，请扩展它并以 px 覆盖步进，覆盖值会按书写原样生效：`defineTheme({name: 'app', extends: matchaTheme, tokens: {'--spacing-2': '12px'}})`。

- 在窄于 `lg` 断点的触控设备上（`(width < 1024px) and (pointer: coarse)`），14px 基准的第一方主题现在会将其字体基准下限设为 16px，并重新推导比例，使 Display 1 保持桌面尺寸：neutral 和 chocolate（基准 14，比例 1.2 → 1.1736），以及 butter 和 stone（基准 14，比例 1.25 → 1.2225）。在手机上，正文、标签和代码文本从 14px 增至 16px；辅助文本、标题以及 Display 2 和 3 增大约 1–2px；只有 Display 1 保持桌面尺寸。桌面尺寸不变。gothic、matcha 和 y2k 已经使用 16px 基准，无需规则。CLI 的主题模板携带相同规则，因此新脚手架生成的主题也会获得它。（#6699）
  扩展这四个主题之一并设置自己的 `typography.scale` 或字号 token 的应用主题会继承此规则，在触控 + 窄屏上该规则会替换这些值（基准 18 的子主题会降为 16px 正文和 42px Display 1）。请针对相同条件追加你自己的规则并使用你想要的值；相同条件的后一条规则会生效。

  迁移：无需更改即可采用新的手机比例。要在应用中保留之前的 14px 手机比例，请扩展主题并为相同条件追加后一条规则：`defineTheme({name: 'app', extends: neutralTheme, adaptations: {rules: [{when: {pointer: 'coarse', width: {below: 'lg'}}, value: {typography: {scale: {base: 14, ratio: 1.2}}}}]}})`。对于 butter 和 stone，请使用 `ratio: 1.25`，并在该规则的值中同时设置 `tokens: {'--text-supporting-size': '12px'}`，因为这些主题将辅助文本固定为 12px，而不是仅由比例得出的 11px。这无法由 codemod 重写：应用是否想要该下限是产品选择。

- 停止读取 Astryx 自有的 agent 变量 ASTRYX_AGENT_ID、ASTRYX_AGENT_SESSION_ID 和 ASTRYX_AGENT_METADATA（#7127）
  主题导入更改已经停止读取 `ASTRYX_THEME`；这三个是最后一批 Astryx 自有的 agent 变量。现在，CLI 源码中任何 `process.env.ASTRYX_*` 读取都会使测试失败。

  迁移：改为设置 CLI 已经读取的 `AGENT` 和 `AGENT_SESSION_ID`，而不是 Astryx 前缀的变体。`ASTRYX_AGENT_METADATA` 没有替代变量。

- 移除计划在 0.7.0 中移除的已弃用组件主题兼容表面。组件现在只发出规范的目标类和反射的 `data-*` prop/状态选择器。主题发现和构建输出不再暴露已弃用的目标，`ThemePropsOptions` 和 `ComponentThemingTarget.deprecatedFor` 被移除。`theme targets --json` 响应去掉 `ThemeTargetEntry.deprecatedFor` 字段，因为它列出的目标都不再被弃用。（#7302）
  迁移：升级后，使用 `astryx upgrade --from <your 0.6 version> --apply --path .` 运行必需的 codemod `migrate-deprecated-theme-surface`。

  该 codemod 会重命名主题 `components` 映射中被移除的目标键（导入的 `defineTheme()` 调用、类型为 Astryx 主题的对象，或具有静态 `name` 的主题对象），重命名 CSS 中的目标类，并使用最终 0.6 发行版发出的每个裸类，将目标限定的裸 prop/值/状态类替换为反射的 `data-*` 选择器。它会将动态/计算的主题键、未限定或未知的类，以及嵌入 JavaScript/TypeScript 字符串中的 CSS 留待人工审阅。当旧键和规范键共存时，以及当 Astryx 曾发出的裸类在其限定的目标上没有已知含义时，它会添加 `TODO(astryx upgrade)`。

  四个按组件的清除图标别名都会变成共享的 `input-clear-icon`，它为每个输入的清除图标设置样式。在 CSS 中，codemod 会用 `:where(.astryx-<component> *)` 将每条规则保留在其组件上，这不会增加特异性。主题键无法携带该作用域，因此 codemod 会添加一个 TODO，指明要使用的 CSS 选择器。

  将 `{legacyNames}` 传给 `themeProps()` 或在组件文档中设置 `deprecatedFor` 的代码应删除该参数或字段；规范目标不变。

  使用以下完整映射重命名主题键和 CSS 目标类：

  - `base-table` → `table`
  - `checkbox` → `checkbox-indicator`
  - `codeblock` → `code-block`
  - `codeblock-copy-button` → `code-block-copy-button`
  - `codeblock-header` → `code-block-header`
  - `codeblock-title` → `code-block-title`
  - `date-input-clear-icon` → `input-clear-icon`
  - `date-range-input-clear-icon` → `input-clear-icon`
  - `hovercard` → `hover-card`
  - `multi-selector-clear-icon` → `input-clear-icon`
  - `navicon` → `nav-icon`
  - `popover-surface` → `popover`
  - `progressbar` → `progress-bar`
  - `progressbar-fill` → `progress-bar-fill`
  - `progressbar-mark` → `progress-bar-mark`
  - `progressbar-track` → `progress-bar-track`
  - `radio` → `radio-indicator`
  - `radio-dot` → `radio-indicator-dot`
  - `selector-clear-icon` → `input-clear-icon`
  - `statusdot` → `status-dot`
  - `textarea` → `text-area`

  对于自定义 CSS，请将移除的裸选择器替换为规范目标上对应的反射属性——例如 `.astryx-button.primary.sm` 变为 `.astryx-button[data-variant="primary"][data-size="sm"]`，`.astryx-switch.checked` 变为 `.astryx-switch[data-checked="checked"]`。请手动审阅 `.primary` 这类未限定的类，因为它们可能属于应用自身。

- 移除 `astryx layout` 命令组。（#7137）
  移除已弃用的 `astryx layout` 命令组（`expand`、`check`、`grammar`）、其三个响应类型（`layout.expand`、`layout.check`、`layout.grammar`），以及编程 API 导出（`layoutExpand`、`layoutCheck`、`layoutGrammar`）。

  使用 `astryx build` 选择要开始的模板，使用 `astryx template` 脚手架生成它，并使用 `astryx docs layout` 获取布局指导。布局指南不受影响。错误代码 `ERR_LAYOUT_PARSE` 和 `ERR_LAYOUT_INVALID` 保留。

  移除的 JSON id：`LayoutBlockReference.mode` `LayoutBlockReference.name` `LayoutCheckOptions.cwd` `LayoutCheckOptions.form` `LayoutCheckOptions.loose` `LayoutCheckResponse.data` `LayoutCheckResponse.data.compact` `LayoutCheckResponse.data.errors` `LayoutCheckResponse.data.form` `LayoutCheckResponse.data.outline` `LayoutCheckResponse.data.valid` `LayoutCheckResponse.data.warnings` `LayoutCheckResponse.type` `LayoutExpandOptions.cwd` `LayoutExpandOptions.form` `LayoutExpandOptions.loose` `LayoutExpandOptions.name` `LayoutExpandOptions.targetPath` `LayoutExpandResponse.data` `LayoutExpandResponse.data.blocksReferenced` `LayoutExpandResponse.data.code` `LayoutExpandResponse.data.componentsUsed` `LayoutExpandResponse.data.demoMediaReplaced` `LayoutExpandResponse.data.form` `LayoutExpandResponse.data.states` `LayoutExpandResponse.data.todos` `LayoutExpandResponse.data.warnings` `LayoutExpandResponse.data.written` `LayoutExpandResponse.type` `LayoutGrammarOptions.cwd` `LayoutGrammarResponse.data` `LayoutGrammarResponse.data.aliases` `LayoutGrammarResponse.data.text` `LayoutGrammarResponse.type` `LayoutIssue.col` `LayoutIssue.formatted` `LayoutIssue.line` `LayoutIssue.message` `LayoutIssue.suggestions`

- 间距 token 使用 rem（`--spacing-2: 0.5rem`），因此间隙和内边距会像字体比例那样跟随读者的根字体大小。在默认 16px 根字体下，每个 token 值都不变。（#7359）
  在默认根字体下会显示一处变化：`useTableRowExpansion` 的 chevron 现在居中于其固定的 40px 列中，而不是超出其边缘（其按钮从该列的 24–48px 移到 8–32px）。在间距比例更大的主题（例如 matcha）下，chevron 会重新可见，详情面板会与第一列对齐，而不是从第一列之后 20px 处开始。

  旧用法：`--spacing-*` 默认值是固定 px（`--spacing-2: 8px`），因此 `useTheme().token()`、`resolveThemeToken()`、`tokenDefaults` 和 `spacingDefaults` 返回 px 字符串，当读者提高浏览器字体大小时，间距保持相同大小。

  替代方案：默认值为 rem，在 16px 根字体下值相同（`--spacing-2: 0.5rem`、`--spacing-4: 1rem`），这些读取器会返回 rem 字符串。

  迁移：读取 `var(--spacing-*)` 的 CSS 无需更改。将间距 token 解析为 px 数字的代码，请使用根字体大小转换 rem 值，或读取元素的计算长度。想要固定 px 间距的主题可以将 token 设回原值，例如 `defineTheme({tokens: {'--spacing-2': '8px'}})`。

  Codemod：无。运行时读取和解析的 token 无法静态找到并重写，而 CSS 用法无需重写。

- 当 `theme build` 报告私有 `--_*` 变量时，它以 1 退出。（#6872）
  旧契约会报告私有变量错误但以 0 退出。修正后的契约保留相同的警告、回执、生成文件和 `--check` 输出，但以 1 退出。

  要迁移，依赖退出码 0 的 CI 步骤必须修复主题的私有 `--_*` 输入。

#### 新功能

- `astryx upgrade` 会为未设置 `padding` 的 BottomSheet 元素添加 `padding={0}`，在 BottomSheet 像 Dialog 一样添加内边距后保持其无内边距的内容盒。唯一子项是 Section 或 Layout 的 sheet 保持不变。内容中任何位置有 Layout 的 sheet 还会得到 TODO 注释，因为 `padding={0}` 会移除该 Layout 各区域之间的内缩，而 Layout 自己的 `padding` 只恢复其外边缘。被遮蔽的 `BottomSheet` 绑定保持不动，第二次运行不会更改任何内容。（#6884）
- `astryx upgrade` 运行 `migrate-field-input-styling`，将 Field 组合输入上的根 `xstyle`/`className`/`style` 重命名为它们之前样式化的部分：TextInput、TextArea、NumberInput、FileInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、Selector、MultiSelector 和 ComplexSelector 上为 `controlXstyle`/`controlClassName`/`controlStyle`，Typeahead、Tokenizer、CheckboxList、RadioList 和 Slider 上为 `containerXstyle`/`containerClassName`/`containerStyle`。它会重写直接写在 Astryx 导入（命名、别名或命名空间）上的 JSX。转发自身样式 props 的 spread 和包装器留待手动迁移，已经设置目标 prop 的调用点会得到 TODO 而不是重命名。（#7342）
- `astryx upgrade` 将 `Tokenizer`、`Typeahead`、`BaseTypeahead` 和 `ChatComposerInput` 触发器对象上的 `emptySearchResultsText` 重命名为 `emptySearchText`，对应移除旧名称的发行版。（#7289）

#### 修复

- `template` 和 `build` 会跟随项目的包管理器。从目标向上到工作区根目录中，最近的具有 `packageManager` 字段或 lockfile 的目录决定。两者都没有时，无论启动 CLI 的包管理器是什么，命令都使用 npm。当该目录的 lockfile 不一致且它提交的内容没有选择其中一个时，`installCommand` 为 `null`，说明会指明缺失的包、目录以及不一致的 lockfile，而不是猜测一个会写入第二个 lockfile 的命令。（#7343）
- 在完整自定义主题编写指南中讲解生成的调色板引用。（#7268）
- 从 Neutral 主题使用的色阶生成其运行时调色板引用，并在包或 CLI 模板副本偏离时让验证失败。（#7255）

#### 文档

- 澄清发布分支 codemod 晋升和版本归属。（#7293）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @harjothkhara
- @imdreamrunner
- @josephfarina
- @rubyycheung
- @vjeux

---

# 0.6.8

#### 修复

- 设置 `replaces` 的模板需要 `@astryxdesign/cli` 0.6.4，设置 `keywords` 的模板需要 0.6.6，而不是 0.7.0（#7265）。
  已发布的 0.6.4 会应用模板的 `replaces`，已发布的 0.6.6 会读取其 `keywords`。`integration verify` 对两者都要求 `">=0.7.0"`，没有任何已发布 CLI 能满足该范围，而在安装带该可选 peer 的包的应用中，npm 会让 CLI 保持未安装。`integration verify` 现在对 `replaces` 接受 `">=0.6.4"`，对 `keywords` 接受 `">=0.6.6"`，并且仍会拒绝允许旧版 CLI 的范围。其消息现在会说明旧版 CLI 的行为。0.6.6 之前，设置 `keywords` 的模板会被丢弃；0.6.4 之前，包的文档主题也会被隐藏。

#### 文档

- 引导新主题作者使用调色板生成器，并在生成的主题模板中保持宽泛颜色比例为可选 (#6795)。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @josephfarina
- @rubyycheung

---

# 0.6.7

#### 新功能

- 应用可以通过 `astryx theme add <slug> --import` 选择使用包管理的主题。该命令会将主题记录在一个生成的应用模块中，包含其生产 CSS、可选字体 CSS 和默认 slug。使用 `theme remove` 和 `theme use` 管理该记录，并将 `themes[defaultThemeSlug]` 传给 `<Theme>`。
  裸 `astryx theme add` 保留其已发布的源码复制行为、选项、stdout、退出状态和每个 `theme.add` 数据字段。它现在会警告：`theme eject` 是显式的源码 fork 命令，而 `theme add --import` 是使用包管理主题的方式。其机器结果会添加 `DEP-0005` 弃用条目；清理是稍后计划次版本中的 `CLN-0005`。

  使用 `defineTheme({extends: importedTheme, ...})` 进行常规自定义。`theme eject` 会创建一个带有其描述符的独立本地 fork。JSON 调用者会从导入、移除和使用中收到 `theme.app`，从 eject 中收到 `theme.eject`。

  现有的捆绑源码副本保持原位并保留其字节。运行 `astryx upgrade --from 0.6.4 --path . --apply`，在 `src/themes` 中每个捆绑副本旁边添加缺失的未维护描述符。在此之前，主题命令会跳过这些副本，`theme list` 和 doctor 会将它们列为未迁移。包集成主题保留其已发布的完整目录副本，包括编写描述符。

  不再读取 `ASTRYX_THEME`。在具有生成的应用主题模块的项目中，组件元数据会读取该记录的默认构建主题。没有该模块时，已发布的 `package.json#astryx.theme` 查找保持其含义。Doctor 会通过相同的主题适配器加载每个记录的构建模块，因此损坏的运行时导入会让 `theme-owners` 失败，而不是通过。

  `theme build` 还会写入 `<out>.css.d.ts`，以便 TypeScript 接受生成的 CSS 导入。检查模式与尚无此新存根的已发布输出集保持兼容。

  集成主题可以导出构建模块和样式表。`astryx integration add theme` 会创建这些导出，`integration verify` 会对照打包的包和源码检查导出的路径。仅缺少伙伴导出不会阻止打包。每个声明的导出都必须解析；对于不完整集合，过期是警告；对于完整的可导入模块和样式表对，过期是错误。

- 每个结果现在都会指明它来自哪个包。关于一个工件的 `--json` 结果（组件及其每个投影、文档主题、索引、小节或文档树节点、模板、hook，以及 `swizzle`）会在其信封中携带 `package`，紧跟在 `type` 之后。列出工件的结果会为每个条目提供自己的 `package`：每个 `search` 命中，`build` 的起点、备选方案、块和组件，文档的小节，文档树节点的子节点，`--blocks` 条目，以及 `component --list` 和 `upgrade --list` 的条目。文本会指名相同的包；`--source`、`--showcase` 和模板的源码仍只在 stdout 上打印源码，并在 stderr 上指明包。现有字段不变。
- 弃用 `astryx layout` 命令组
  `astryx layout` 命令组（`expand`、`check`、`grammar`）已弃用。使用 `astryx build` 选择要开始的模板，使用 `astryx template` 脚手架生成它，并使用 `astryx docs layout` 获取布局指导。

  在人类模式中，每次调用都会在 stderr 上打印一条警告，指明替代方案。在 JSON 模式中，响应信封会在其 `meta` 字段中携带机器可读的弃用元数据。规范的 stdout、退出码以及 `layout.expand` / `layout.check` / `layout.grammar` 响应 schema 不变。

  弃用生命周期（`spec:AST-017` FR28、FR31）——只会在稍后的次版本中移除，其冻结清单携带一对两个 id：

- 集成组件可以在其包选择加入后替换 Core 组件
  当 `@acme/nav` 在 `peerDependencies` 中声明 `"@astryxdesign/cli": ">=0.6.7"`（在 `peerDependenciesMeta` 中为可选）时，文档设置 `replaces: 'SideNav'` 的 `@acme/nav` 组件会接管 `SideNav`，用于非限定组件详情、批量选择器、每个 `component --list` 详细级别、`search`、`swizzle` 和 gap-report 路由。每个结果都会指明其包，`--package @astryxdesign/core` 仍会选择原始 Core 组件，替代组件继续以其自己的名称作答。`component SideNav --package @acme/nav` 也会选择它。

  任何起始于 0.6.7 或更高版本的 `@astryxdesign/cli` 范围都是选择加入，包括 0.6.4 和 0.6.5 中 `integration add doc --parent` 写入的 `>=0.7.0`，以及 0.6.5 中的 `integration add theme`。范围允许旧版 CLI 的包会将其组件保留在自己的名称下，Core 保持选中，加载它的应用不会看到新的输出；其作者会从 `astryx doctor integration components` 和 `integration verify` 收到指明要添加的范围的警告。对于声明该范围的包，`astryx doctor integration components` 会将缺失的 Core 目标、无效值、以不同 Core 组件命名的组件，或包中同一目标的两个替代报告为错误并以 1 退出。当多个包替换一个目标时，显式配置的包胜过自动链接的包，后配置的包胜出，Doctor 会发出警告。

- 添加模型比较页面模板，具有响应式粘性上下文和无障碍交互。（#6251）
- 新的 `table-collapsible` 页面模板：一个页面上有多个表格，每个表格位于可折叠卡片中并拥有自己的列，适用于不共享 schema 的组。每个表格独立排序，页面头部的一个时间范围驱动所有表格，行会在原位置展开为全宽历史图表。低于 720px 时，每个表格折叠为其名称和头条数字。（#6065）

#### 修复

- 当项目未安装 `astryx` bin 时，打印的命令会指明作用域包 `@astryxdesign/cli`
- 压缩生成的 agent 文档块：更少的行，相同的行为覆盖
- `astryx doctor` 保留其 `themes` 检查，使用相同的 id、标签和字段，与新的主题检查并列，因此按 id 读取它的脚本仍可工作。没有生成的类主题模块时，它会报告以前的内容：是否安装了 `@astryxdesign/theme-*` 包，以及应用的 package.json 是否在 `astryx.theme` 中命名了主题。其修复现在会指明 `theme add --import`。有生成的模块时，它会报告主题检查的整体结果。
  在工作区中，`themes` 读取应用自己的 package.json，即 CLI 在解析主题时读取的文件，而不是根 `node_modules` 旁边的 package.json。它不再将 CLI 不读取的 `ASTRYX_THEME` 变量计为已接入的主题。

- Doctor 会说明为什么跳过检查以及检查了什么，并且 `doctor integration validate` 不再在无法读取的文件夹上崩溃
- upgrade：从集成 codemod 发现中排除 node_modules
  当集成将其 codemod 根目录声明为包根目录（`codemods: "./"`）时，版本文件夹扫描会将 `node_modules`、`.git`、`__tests__` 和 `__fixtures__` 视为版本文件夹，并将其文件作为 codemod 加载。递归文件遍历已经使用的相同 `SKIP_DIRS` 过滤器现在也应用于顶层版本文件夹枚举。

- 使布局弃用（DEP-0006）与文档化的信封和先例一致
  布局命令的 JSON 信封现在发出 `meta.deprecations: [{id, replacements}]`，与响应 schema 文档和 DEP-0005 theme add 先例一致。`deprecated` CommandDoc 字段会在 `--help` 和清单中渲染。编程 API 导出（`layoutExpand`、`layoutCheck`、`layoutGrammar`）在其声明和生成类型中带有 `@deprecated`。命令和函数参考页面会指名 DEP-0006 和替代方案。DEP-0006 记录会指名其直接权限。所有已发布的数据字段不变。

- swizzle：将每个 .stylex 导入重写为深层路径
  `astryx swizzle Button`（以及任何从自身目录之外导入 `.stylex` 模块的组件）发出的导入会折叠为目录 barrel——例如 `@astryxdesign/core/utils` 而不是 `@astryxdesign/core/utils/interactionOverlay.stylex`。该 barrel 不会重新导出这些 StyleX 符号，因此 swizzle 后的文件无法编译。

  `rewriteImports` 现在会为每个 `*.stylex` 模块提供深层子路径。导出生成器（`scripts/sync-exports.js`）为跨目录 swizzle 组件实际引用的 `.stylex` 模块添加了 16 个特定子路径导出：

  `DateInput/tokens.stylex`、`Icon/IconSize.stylex`、`Indicator/indicator.markers.stylex`、`Layer/layerAnimations.stylex`、`Layer/layerTextReset.stylex`、`Layer/layerViewportInset.stylex`、`Layout/container.stylex`、`Layout/edgeCompensation.stylex`、`Layout/padding.stylex`、`NavItem/navItemStyles.stylex`、`Selector/selectorPresentation.stylex`、`Stack/stack.stylex`、`Stack/stackItem.stylex`、`Text/text.stylex`、`utils/focusOutline.stylex`、`utils/interactionOverlay.stylex`

  这些是公开 API 新增。每个模块都已经在 npm tarball 中发布（在 `dist/` 中）；只有 exports 映射条目是新的。没有通配符——将来跨目录的 `.stylex` 导入需要在 `STATIC_EXPORTS` 中有意添加条目。先例：`./theme/dataTokens.stylex`（AST-066 FR2）。

- template：默认显示分组摘要，而不是完整目录
  裸 `astryx template`（不带名称，不带 `--list`）现在按类别分组显示模板及数量——约 21 KB，而不是完整的 149 KB 目录。带描述的完整目录仍可通过 `astryx template --list` 访问。

  JSON 输出不变——`--json template` 仍返回完整的 `template.list` 响应。这是 AST-017 FR11 下的纯文本渲染变更：机器可读的响应 schema 是契约；文本格式不是。

  权衡：分组输出仍包含每个模板 id（因此可以通过复制粘贴使用 `template <id>`），代价是约 21 KB。更短的摘要（仅类型 + 数量，不含 id）约为 500 字节，但需要第二步才能发现任何 id。当前形状同时满足人类扫描和 agent 复制粘贴，无需往返。

- template：裸 `template --type` 不再打印空组标题
- 文档树命名空间上读取的小节会再次从拥有该小节的指南作答，因此 `astryx docs layout side-panels` 以及 0.6.6 中发布的其他布局小节读取在布局拆分后仍可工作。`docs(route, section)` 返回与指南自身小节读取相同的 `docs.detail.section`，按 key 查找，再按标题查找，在 `--dense` 和 `--zh` 中也一样。当没有指南或不止一个指南拥有该小节时，读取会以 `ERR_UNKNOWN_SECTION` 失败，并指名应从哪些指南读取。
- `astryx search` 会将查询词所指的组件、hook 或模板排在仅按关键词、标题或文本匹配的文档之上。`font size` 再次先找到 Text，而不是排版指南。查询所指的文档（例如 `font setup` 或 `migration`），或查询包含其标题的文档（例如 `resizable side panels`），会保持其位置。结果分数不变；只有领域之间的顺序改变。
- `astryx search` 会在查询是其路由或标题的另一种数字形式时找到指南：`side panel` 再次先找到侧面板指南，`header and footer` 找到页眉和页脚。小节的标题仍不算作其主题的名称，因此 `font size` 仍先找到 Text。
- 修复比较表类别，从 "Table - Frozen Column" 改为 "Table - Comparison"
  该类别描述的是实现细节（冻结标签列），而不是模板的用途。按布局类型搜索的构建者现在会在 Comparison 下找到它。

- Template 和 build 会告诉你脚手架生成的模板需要而项目缺少什么。
  当 `astryx template <name> <path>` 脚手架生成的文件导入项目没有的包（例如 `@heroicons/react`、`recharts`、`lucide-react`）时，回执现在会包含一个可运行的安装命令，使用项目的包管理器和 CLI 工作区的版本范围。`astryx build` 会在其起始模板上显示相同的说明。

  当脚手架生成的模板使用 StyleX 且项目未配置编译器插件时，回执会发出警告并指向 `astryx docs styling-overview`。agent 文档块不再直接说 "don't use xstyle"——它承认某些模板需要它，并链接到设置文档。

  `detectStylingSystem` 现在会在现有条目之外识别官方的 `@stylexjs/rollup-plugin`、`@stylexjs/webpack-plugin` 和 `@stylexjs/nextjs-plugin`。

- `astryx theme build` 会为每个构建的主题打印一行，并额外打印一行指明主题未加载的字体。以前，每个主题都会打印相同的安装示例和字体配方，因此构建多个主题会一遍又一遍地打印相同的块。`--detail full` 会为整个批次打印一次安装示例和字体配方，而不是每个主题一次；对于单个主题，它会打印以前默认打印的内容。只有文本报告改变：`--json` 输出、`--check`、退出码和写入的文件不变。
- CLI 在任何显示 `<Theme>` 包装器的地方，现在也会显示 `Theme` 的来源：`import {Theme} from '@astryxdesign/core'`。这涵盖 `astryx init` 的后续步骤、`theme add` 和 `theme build` 输出、针对未导入主题模块的 doctor 修复、`build` 帮助和主题指南。
- `astryx theme add <slug> --import` 会在其 JSON 信封（`package`，紧跟在 `type` 之后）和文本输出中指明拥有所添加主题的 npm 包，与其他关于单个工件的结果相同。本地主题没有包，因此其结果没有 `package`，`theme remove` 和 `theme use` 不变。
  `astryx theme add --list` 保持其 JSON。其文本现在指明使用主题的 `theme add <slug> --import` 和 fork 主题的 `theme eject <slug>`，而不是已弃用的复制形式。

  `astryx doctor` 会增加 `theme-management` 检查，以及项目拥有生成的主题模块后的聚焦 `theme-*` 检查。

- 经典 Yarn（1.x）项目中的一次性命令使用 `npx @astryxdesign/cli …` 而不是 `yarn dlx`，因为经典 Yarn 没有该命令

#### 文档

- `astryx docs migration`、`internationalization`、`styling`、`styling-libraries`、`typography` 和 `tokens` 仍然有效，现在会列出聚焦指南。每个小节也可以在其指南下读取，例如 `astryx docs tokens/tokens-spacing` 或 `astryx docs styling/tokens-and-setup stylex-setup`，`astryx docs <topic> <section>` 继续有效：这些主题曾有的每个小节 key 仍会打开相同的小节。`astryx docs tokens --depth all --detail full` 会打印每个 token 表，指向 `tokens` 的 `token-ref` 仍会通过拥有该表格的指南解析。
  集成：这六个名称现在是文档树小节，而不是主题，因此声明 `extends` 或 `replaces` 其中之一为这些名称的集成文档会被报告为未命名任何主题，其内容也不再显示。要保留该内容，请将其作为你自己的主题以新名称发布，或作为你包自己小节中的指南发布（`astryx integration add doc <name> --parent <your-section>`）。仍为扁平的主题（例如 `theme` 或 `color`）仍可以扩展或替换。

  （#7184）

- `astryx docs layout` 仍然有效，现在会列出聚焦指南。每个小节也可以在其指南下读取，例如 `astryx docs layout/side-panels` 或 `astryx docs layout/scaffold shell`，`astryx docs layout <section>` 继续有效。
  （#7125）

- `astryx docs layout` 再次以概览开头，`astryx docs author-a-theme` 和 `use-a-theme` 恢复了主题拆分所丢弃的指导：错误的 `extends` 基类会导致什么、如何验证适配规则、`__built` 的含义、图标注册表说明符的陷阱、`registerTheme`，以及在开发中也接入构建的主题。
  （#7204）

- 添加选择路径的样式概览，并在主题指南中恢复基于导入的工作流。
  （#7134）

- 将主题文档拆分为使用主题和编写主题的聚焦指南，并提供一个指向两种工作流的简洁概览。
  （#7141）

#### 其他变更

- 仅当 `astryx` bin 位于 `node_modules/.bin` 中（在项目中或其上级文件夹）时，提示才使用 `npx astryx …`（或 `pnpm exec`、`yarn`、`bunx`）。否则它会打印 `npx @astryxdesign/cli …`（`pnpm dlx`、`yarn dlx`、`bunx`），与 CLI 从 npx 或 dlx 缓存运行时的做法相同。
- 全局安装，或在全新包中使用的工作区安装，以前会打印 `npx astryx …`。名为 `astryx` 的 npm 包不是此 CLI，因此遵循该提示会获取一个无关的包。
- `astryx blog` 遵循相同规则，事件控制台模板会指明作用域包。

  分类：恢复契约。JSON 形状不变；只有提示文本改变，已安装 CLI 的项目仍保持 `npx astryx …`。

- 弃用 `DEP-0006` / 清理 `CLN-0006`——`astryx layout` 命令组（`expand`、`check`、`grammar`）
- 需要已加载项目的检查会引用 CLI 无法加载它的原因，而不是只说 "Skipped"。
- 当 astryx.config 可以导入但 CLI 无法从中加载项目时，配置检查会发出警告。以前它会说配置加载干净。
- 集成贡献会指明它们检查了哪些集成；没有加载任何集成时，检查会报告信息并说明没有可检查的内容。
- agent 文档检查会读取 init 可以写入的每个文件（包括 Hermes），并在项目根目录和工作目录中查找，因此从子文件夹运行 doctor 不再报告没有 agent 文档。
- `astryx doctor integration validate` 会指明无法读取的文件夹并继续检查。声明为文件或无法读取的根目录会报告为 `invalid_root` 或 `unreadable_root`，而不是原始错误或崩溃。

  分类：恢复契约。没有检查变得更严格：每个新发现都是警告或信息，唯一的退出码变化是每个根目录之外的不可读文件夹不再使验证崩溃。

- 每当 CLI 打印其作用域一次性形式（它从 npx 或 dlx 缓存运行，或项目未安装 `astryx` bin）时，Yarn 项目会得到 `yarn dlx @astryxdesign/cli …`。在经典 Yarn 上该命令会失败。
- 经典 Yarn 从声明的 `packageManager` 版本、`yarn.lock` 头（`# yarn lockfile v1`）、已提交的 `.yarnrc`（没有 `.yarnrc.yml`）或运行器中读取。Yarn 2 及更高版本保留 `yarn dlx`。

  分类：恢复契约。JSON 形状不变；只有提示文本改变。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @ernestt
- @josephfarina

---

# 0.6.6

#### 新功能

- 添加共享的 `upload` 图标，并将其用于 FileInput 的上传提示，而不是有方向的 `arrowUp`
  主题通过 `icons.upload` 绘制 `upload`，与 `arrowUp` 分开，因此排序箭头和每个其他 `arrowUp` 用法保持不变。每个捆绑主题和主题模板都以自己的图标风格绘制 `upload`。FileInput 在两种模式下都保持其图标大小、位置、颜色和无障碍性；没有 `upload` 图稿的主题会在那里显示默认的投入托盘图标。

  在本发行版中，完整的 `IconRegistry` 仍可以省略 `upload`。下一个次版本会将其设为必需，因此请为你类型化为 `IconRegistry` 的任何注册表添加 `upload` 条目。

- 模板声明其 `keywords`，`build` 通过项目可以使用的组件区分页面的一部分和整个页面（#6805）
- `build` 使用签入的单词权重表与页面排名器混合来选择起点
- `astryx docs <route> --depth <levels>` 会按你的要求向下读取文档树，从一个文档到其下所有内容。
  `--depth 0` 只读取你指定的命名空间，`--depth 1` 添加其正下方的文档（不带 `--depth` 的读取所显示的内容），`--depth all` 一直到最底层。使用 `--depth` 时，`--detail` 设置下面每个文档显示多少内容：`brief`（默认）每个一行，按位置命名以便打开；`compact` 添加其小节；`full` 完整打印。因此 `astryx docs cli --depth all` 是每个 CLI 文档的地图，`astryx docs cli/integrations --depth all --detail full` 会一次性打印集成指南。读取停止的地方，命名空间会说明其下有多少文档。`--json` 返回与 `docs.node` 相同的树：每个子节点在读取深入时携带自己的 `slots`，停止处为 `childCount`，在 `compact` 或 `full` 时携带其文本。`docs()` 接受相同的 `depth` 和 `detail` 选项。不带 `--depth` 的读取不变。

- 在人们寻找可添加内容的地方指向 `discover`
  agent 读取的任何内容都没有指名 `discover`，因此被要求查找主题的 agent 会转而搜索包注册表。`astryx init` 写入的 agent 块现在列出 `discover <words>`（你可以添加的集成，以及你已有的集成），`theme list` 以 `More themes in packages you could add: astryx discover theme` 结尾，文本搜索以 `More in packages you could add: astryx discover <query>` 结尾（`--type hook` 除外，因为没有集成添加 hook）。JSON 输出不变。

- `integration add theme --from <base>` 会以现有主题为起点 fork 它，而不是空白脚手架。新主题会复制基础主题的源文件——为新 slug 重命名并重写——且没有回链。当你想进行大量更改时使用 `--from`；对于保持链接的小更改，请在 `defineTheme` 中使用 `extends`。

#### 修复

- 说明命令何时什么都没做：`upgrade` 报告 `sourcePathFound`，集成检查报告 `validated`。
  两个命令可能合法地什么都不做，并产生与干净成功相同的信封。两者现在都在各自响应的字段中携带该事实，而不仅仅在人类文本中。

  `astryx upgrade` 将 `--path` 默认为 `./src`。按 `app/` 布局的项目（或拼写错误）会跳过所有代码 codemod，却仍报告退出 0、`filesChanged: 0`、`errors: []` 和 "Upgrade complete"。唯一的警告是一条 `--json` 按设计抑制的日志行。`upgrade.run` 现在携带 `sourcePathFound`，人类完成行会指明它未找到的目录。

  `astryx doctor integration validate|components|docs|templates` 在未找到集成清单时返回 `{name: null, version: null, issues: []}` 并退出 0——与已验证、健康的集成形状相同。所有四个信封现在都携带 `validated`，仅在未检查任何内容时为 false。

- `astryx manifest --json` 现在从命令的 CommandDoc 获取其示例，并从其包装的 API 函数获取响应类型，因此没有示例与文档中的不同，并且 `upgrade` 会列出 `upgrade.registry`，而 `upgrade --registry --json` 已经发出它。
- `astryx template <name> <path>` 和 `astryx layout expand` 现在会说明它们何时替换了 Astryx 演示媒体。`template.copy` 和 `layout.expand` 回执携带 `demoMediaReplaced`，即变成占位符的演示图像和视频引用数量（每个引用一个，无论其 URL 携带多少夹具路径），文本输出会指明要更新的文件（当 `layout expand` 改为打印代码时，同一行会作为注释跟随其后，因此输出仍是有效的 TSX）。复制本身没有任何变化。
- `astryx template <name>` 和 `template()` 现在返回与 `astryx template <name> <path>` 写入相同的源码，并说明它们替换了多少 Astryx 演示媒体引用。仅由 Astryx 自己的预览提供的演示图像和视频在两者中都会以相同方式替换，因此从打印源码复制的代码不再指向你的项目没有的媒体。`template.show` 增加 `demoMediaReplaced`（模板未携带时为 0）；在文本模式下，计数会在 stderr 上说明，因此打印的源码保持精确。
- 失败的写入会报告 ERR_WRITE_FAILED，而不是原始 Node errno。
  `astryx template` 写入不可写目录时返回 `{"error": "EACCES: permission denied, open '/home/you/project/readonly/x.tsx'", "code": "ERR_UNKNOWN"}`，`swizzle` 返回 `mkdir` 的等价错误。有两个问题：ERR_WRITE_FAILED 已经在冻结的错误注册表中用于这种情况，而且消息携带了绝对主机路径，而其他所有 Astryx 消息都会相对于项目命名其目标。

  两者现在都会抛出 ERR_WRITE_FAILED，保留 errno（它是说明要修复什么的部分），并相对于项目命名目标。不会留下半写入的内容：中途失败的 `swizzle` 会删除已经复制的文件，并还原它替换的任何文件，然后报告错误，消息会指明它无法还原的任何文件。

- 当 `discover --available` 在没有 discover 源的情况下运行时，CLI 现在会
  解释什么是 discover 源以及在哪里找到 npm 上的 Astryx 包，而不是误导性地告诉用户添加他们无法找到的包名。没有集成的裸 `discover` 也会增加指向 npm 和集成文档的提示。

- 带有命名空间文档或已放置指南的包需要 `@astryxdesign/cli` 0.6.4，而不是 0.7.0。
  已发布的 0.6.4 会读取集成的文档树：它列出命名空间并读取其中放置的每个指南。0.6.3 会拒绝命名空间文档并隐藏包附带的每个文档主题。`integration add doc --parent` 写入 `"@astryxdesign/cli": ">=0.7.0"`，没有任何已发布 CLI 能满足该范围，并且 `integration verify` 会让 CLI peer 起始于 0.6.4 的文档树包失败。`integration add doc --parent` 现在写入 `">=0.6.4"`，标记为可选，`integration verify` 接受它。设置 `replaces` 或 `keywords` 的模板仍需要 `">=0.7.0"`。

- 当列出的集成无法加载时，`gap-report` 会失败，而不是报告干净的结果。
  导入时抛出错误或未通过验证的 `astryx.integration` 模块会被排除在处理程序集之外。没有其他处理程序时，报告会落到 Core 的内置 GitHub 回退：命令以 0 退出并返回 `consent_required`，在 stderr 上不打印任何内容，并提供 `--confirm-public` 来向 Core 的公共跟踪器提交一份本应属于该集成的报告。

  无法加载的集成现在会在其配置位置记录一次失败的投递，消息中带有加载错误和修复方法。像任何处理程序一样，它会关闭回退，因此报告永远不会发送到另一个包的跟踪器。命令以 1 退出，失败或部分报告现在会在 stderr 上以及回执中打印每个失败的投递。

- `astryx integration add theme <name> --from <base>` 现在会将复制的主题文件导入的包添加到 `dependencies`。
  fork 捆绑主题（例如 `neutral`）会复制其 `icons.tsx`，其中导入了 `lucide-react`，但包没有声明它。因此对该 fork 运行 `astryx theme build` 会失败并显示 "Cannot find module 'lucide-react'"，安装该包的应用也会遇到相同错误。`--from` 现在会添加复制文件导入的每个包，使用捆绑主题使用的范围。它会排除 Core 和 React（每个 Astryx 应用都已经有），以及包已经声明的任何内容。

- 不带 `--check` 的 `astryx integration pack` 现在只指向 `astryx integration verify`。
  它以前会说 "Pass --check to verify the integration tarball, or run `astryx integration verify`"，这会把人引向已弃用的拼写。现在它会说明 `integration pack` 现在是 `integration verify`，并且 `npm pack` 构建 tarball。错误代码和退出码不变，`integration pack --check` 仍运行与以前相同的检查。

- Search：按总质量区分全词匹配；索引主题
  在全词层级内，每个最强 token 命中为关键词的候选者得分相同（例如 157），无论其他查询词如何匹配。两个词都按关键词匹配的文档无法胜过任何东西，`search "how to use a theme"` 会把 API 参考文档排在消费者主题指南之上。

  该加分现在使用所有 token 分数之和，而不仅仅是最强分数，因此每个词都按关键词匹配的候选者会胜过关键词 + 散文匹配的候选者。`theme` 文档还会获得面向消费者的关键词，以便在 "how to use a theme" 和 "how to apply a theme" 等问题中出现。

  主题现在是一个搜索领域：捆绑和集成提供的主题会在结果中出现，带有其 slug、displayName、package 和 `astryx theme add` 命令。`--type theme` 会筛选到它们。与 `--type doc` 一样，它在应用之外也能工作，开放搜索现在覆盖文档和主题。搜索帮助、清单和 API 参考会列出新领域及其结果字段。

- Search 会将主题的描述按散文而不是关键词排名
  主题仅通过其描述与查询共享的单词（例如 `minimal`、`focus` 或 `content`）现在会像任何其他描述一样为主题排名，而不是像声明的关键词，因此它不再排在声明该词的组件、hook 和文档之上。主题仍会因其自己的 slug 或显示名称排在首位：`astryx search neutral` 首先找到 Neutral 主题。

- 附带主题或文档小节 `id` 的包需要 `@astryxdesign/cli` 0.6.4，而不是 0.7.0。
  已发布的 0.6.4 会读取带类型的主题描述符和小节 id；0.6.3 会拒绝两者并隐藏包的主题或文档主题。0.6.5 的说明称 0.7.0 之前的稳定 CLI 会拒绝它们，因此 `integration add theme` 写入 `"@astryxdesign/cli": ">=0.7.0"`，没有任何已发布 CLI 能满足该范围，并且 `integration verify` 会让 CLI peer 起始于 0.6.4 的主题或小节 id 包失败。`integration add theme` 现在写入 `">=0.6.4"`，标记为可选，`integration verify` 对主题和小节 id 接受它。设置 `replaces` 或 `keywords` 的模板仍需要 `">=0.7.0"`。

- `theme build` 会从选定的主题解析真实的图标导入，而不是匹配注释或字符串内容。生成的模块会保留命名、别名、默认和命名空间注册表导入，以及带子覆盖的继承图标。正常构建和 `--check` 会在生成或写入输出之前以 `ERR_THEME_INVALID` 拒绝不支持的内联注册表。请将此类注册表移到自己的模块中，并将其导入主题文件。
- 应用中的 `astryx theme build` 会使用应用安装的 `@astryxdesign/core`，并在没有 Core 时说明要安装它。
  使用 `npx @astryxdesign/cli` 一次性运行时，即使应用安装了 Core，它也会失败并显示 "Build @astryxdesign/core first (e.g. `pnpm -F @astryxdesign/core build`)"，因为它只在 CLI 旁边查找 Core。现在它会使用项目安装的 Core 生成，与应用 `<Theme>` 运行于相同的 Core。在没有 Core 的应用中，错误现在会说明要安装它（`npm install @astryxdesign/core`）。构建命令只保留给 Astryx 仓库本身。错误代码（`ERR_CORE_NOT_FOUND`）不变。

#### 其他变更

- `TemplateDoc` 增加可选的 `keywords` 列表：构建者可能用于模板所服务内容的想法、领域和其他名称。`parseTemplate` 会验证它，discovery 会从每个模板源携带它，`astryx search` 会像匹配模板描述一样匹配它，`astryx build` 会据此为页面模板排名。每个 Core 页面模板末尾的想法列表已从 `description` 移到 `keywords`，因此描述只描述布局。
- `build` 会从页面的一部分所在的位置开始（`spec:AST-048` FR3），项目自己的组件会说明什么是部分：一个想法，其中心名词是组件名称或关键词（Core 或集成的）中的单词，会请求一个部分，除非该名词命名一个页面模板 family 或该想法列出三个或更多片段。部分会从该想法命名的 family 的基础模板开始，否则从应用外壳开始；对现有页面或部分的更改（一个想法，其 "existing" 命名页面 family 或组件，例如 "the existing table"，且不请求新页面）会从应用外壳开始。起点的原因会说明适用哪种情况以及为什么。
- family 的基础模板会引领其 family，除非某个变体匹配其自身的两个词；无法自行启动的基础模板永远不会取代领先的变体。

  设置 `keywords` 的集成模板需要 `@astryxdesign/cli` 0.7.0 或更高版本。模板元数据对象是严格的，因此 0.7.0 之前的稳定 CLI 会拒绝该字段、丢弃该模板并隐藏包的文档主题；只有 `template --list` 和 `search` 会打印警告。`integration verify` 会让模板设置 `keywords` 的包失败，直到它声明 `@astryxdesign/cli >=0.7.0`，与 `replaces` 一样。

- `api/build/kit/weights.mjs` 使用 `weights.json` 中的表，从想法的词干为每个候选起点（应用外壳和每个就绪的页面模板）评分，并将这些分数与排名器自身的分数混合。混合结果决定每个整页的起点；部分或编辑会像以前一样开始，排名器对表未列出的模板的选择保持不变。没有权重文件时，排名器的选择保持不变。响应的形状不变。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AstryxBot
- @cixzhang
- @jiunshinn
- @josephfarina
- @rubyycheung

---

# 0.6.5

#### 新功能

- `astryx component` 在一次调用中接受多个精确选择器。JSON 响应会为每个选择器保留一行有序记录，包括缺失和有歧义的组件；文本模式会在任何查找失败时打印每一行，然后以非零退出。`component()` API 接受选择器数组，并对数组始终返回 `component.batch`，包括空数组和单元素数组。批次最多接受 100 个选择器，并在查找前拒绝更大的数组。公开 API 还导出了共享的 `BatchResponse` 和 `BatchRow` 类型，用于类型化回执。
- `astryx discover` 浏览集成：项目已有的集成，以及通过 discover 源可以添加的集成，包含每个版本及其添加的内容。它会搜索每种条目，并使用 `--type`、`--installed`、`--available` 和 `--limit` 过滤。项目在 `astryx.config` 中将源设置为 `discover`，集成将源作为 `discover` 命名导出导出。Discover 只读取：它打印添加包的命令，但从不运行它。现有 `--json` 字段保持其含义。自由文本查询现在总是列出其匹配项，即使精确的组件名称也是如此，`astryx discover <package>/<Name>` 会打开一个。
- `astryx integration verify` 是 `astryx integration pack --check` 的新名称。
  发布集成前运行的检查现在有了说明其用途的名称。`astryx integration verify` 使用 npm 打包包，将 tarball 安装到临时应用，并检查应用看到相同的组件、模板、主题、文档和 codemod。它不接受任何标志。`astryx integration pack --check` 仍作为已弃用的别名工作：它运行相同的检查，输出、JSON 和退出码相同，打印一条指名 `integration verify` 的说明，并在帮助中显示为已弃用。它会在稍后的发行版中移除。`integrationPackCheck()` API 及其 `integration.pack-check` JSON 响应不变。使用 `--json` 时，给定未知子命令的命令组现在会报告 `ERR_UNKNOWN_SUBCOMMAND` 并列出其子命令，而以前会说 JSON 输出不受支持。

#### 修复

- 修复 CLI 的主题文档及其打印方式。
- `astryx doctor` 不再将无法检查的集成报告为缺失或完整（#6619）
- `upgrade` 的 `filesChanged` 统计文件数，而不是（codemod、文件）对（#6622）
  一个源文件被四个 codemod 各更改一次时会被报告为更改了四个文件，因此 `filesChanged` 与 `transformsApplied` 及文档含义 "Total files changed" 不一致。人类摘要也说了同样的话：一个文件却显示 "Found 4 changes across 4 files"。

  `filesChanged` 现在是不重复文件的计数。`transformsApplied` 不变：代码或配置 codemod 每更改一个文件计一次，项目 codemod 计一次。同时被核心 codemod 和集成 codemod 更改的文件在 `filesChanged` 中只计一次。

- 解析错误在文本模式下会打印 Astryx 错误格式。
  `astryx theme list --lang zh-Hans` 打印的是 Commander 自己的行——`error: option '--lang <locale>' argument 'zh-Hans' is invalid…`——而其他每个 CLI 错误都会打印 `Error: …`。`--json` 本来是正确的（`ERR_INVALID_LANG`），因此两种模式只在退出码上一致。

  Commander 在任何 Astryx 代码运行之前写入该行，因此 JSON shim——已经能看到每个解析失败的唯一位置——现在会抑制它，并根据同一消息为两种模式自行写入 Astryx 行。覆盖每个解析失败：未知选项、未知命令、缺失参数，以及全局选项的无效值。`--help` 和 `--version` 不受影响，仍以 0 退出。

- CLI 参考现在与命令行为一致。每个 `--help` 都以命令的示例和一行 `More:` 结尾，指明其完整文档页面。函数文档会显示每个参数的默认值、标记必填参数、列出每个函数抛出的错误代码，并使用可运行的示例。响应类型列表增加 `help`、`version` 和 `upgrade.registry`，`astryx manifest` 现在为 `upgrade` 列出 `upgrade.registry`。`--zh`、`--dense`、`--lang` 和 `--detail` 的描述会指明它们改变的命令，命令摘要会说明何时使用每个命令。当 `astryx template` 拒绝覆盖文件时，它现在会说明要使用 `--overwrite`（或 `-f`）重新运行。`upgrade` 命令页面（`astryx docs cli/commands/upgrade`）现在说明 codemod 从不编辑哪些文件、当其中一个需要更改时会发生什么，以及如何重新生成它。
- 当 `prepack`、`prepare` 或 `postpack` 脚本向 stdout 打印内容时，`astryx integration pack --check` 现在会检查 tarball。以前，任何生命周期输出都会让检查在查看 tarball 之前以 "npm pack produced unparseable JSON output" 失败。失败的生命周期脚本仍会使检查失败，其输出保留在 `pack_failed` 消息中。
- 当命名空间文档或放置失败时，`astryx doctor integration docs` 会失败，如其帮助所述。
  此类失败会从文档树中隐藏文档，因此它现在以 `invalid_doc_graph` 错误退出 1，而不是警告。未指向任何文档的链接仍只警告，因为它会按书写原样打印。`doctor integration docs` 和 `doctor integration components` 也不再在失败的检查后打印 `[ok]` 行。

  `doctor` 下拼错的子命令现在会失败并列出该组拥有的子命令：`astryx doctor integrations` 以前会运行项目检查，而 `astryx doctor integration bogus` 在文本模式下退出 0，尽管使用 `--json` 时退出 1。

- 附带主题或带 `id` 的文档小节的包现在会声明能够读取它的 CLI。
  0.7.0 之前的稳定 CLI 会拒绝两者：它无法读取 `astryx integration add theme` 写入的带类型主题描述符，并且会拒绝小节 `id`。无论哪种情况，它都会隐藏包的主题或文档主题，且不发出警告。`astryx integration add theme` 现在将 `"@astryxdesign/cli": ">=0.7.0"` 添加到 `peerDependencies`，标记为可选，当包需要该 peer 范围但未声明时，`astryx integration verify` 会以 `themes_need_cli` 或 `section_ids_need_cli` 失败。

- `astryx integration verify` 会解析打包包中的每个公开导入，而不是源码文件夹中的导入。
  以前，其临时应用通过源码 `package.json` 解析你自己的包名，因此 tarball 中遗漏的 `exports` 目标仍能通过。现在它会以 `component_export_missing` 失败，就像安装 tarball 的应用一样。

- `astryx theme add` 和 `astryx theme build` 现在会完全撤销失败的写入。以前，当一个文件在其他文件写入后写入失败时，已写入的文件会保留新内容。现在每个被替换的文件都会恢复之前的内容，每个新文件都会被删除，错误会指明无法还原的任何文件。两个命令也拒绝替换符号链接的目标。（#6852）

#### 其他变更

- 代码块的标签现在打印在块上方，而不是作为 `// label` 行放在块内，因此复制的 bash、CSS、JSON 和 HTML 保持有效。表格单元格会转义 `|`，因此联合类型保持在一列中。
- `astryx search dark mode` 会搜索两个词；以前它会丢弃第一个词之后的每个词。匹配查询每个词（其中一个按名称或关键词）的结果现在会胜过只匹配部分词的结果，标题或小标题包含整个查询的小节会排在接近顶部的位置。主题可以声明搜索 `keywords`，现在是文档化的 ReferenceDoc 字段，命名空间的 `keywords` 现在也会计入。当 `make`、`build` 或 `an` 等常见词被丢弃时，查询会保留其短语，因此 `astryx search make an integration` 会找到集成指南，文档名称的复数形式会匹配它，比精确名称低一级，组件的名称以单词形式输入（例如 `command palette`）会找到该组件。在应用之外（未安装 `@astryxdesign/core` 时），`astryx search` 会搜索文档而不是失败，并会说明这一点；`--type component`、`hook` 或 `template` 仍需要 Core。
- 复制后失败的片段现在可以工作：StyleX token 导入、`fr-FR.json` 区域设置路径、Tailwind `rounded-lg`、`--color-background-muted`、图标和颜色值，以及 Cursor 规则路径。
- 与代码不符的说法已更正：30 个随附区域设置以及 RTL 镜像的工作方式、`astryx init` 写入的内容、用于更短读取的 `--detail brief`、Neutral 和 Matcha 字体、需要锚点定位的组件、`gap` 步进、Card 的半径，以及 Next.js StyleX 示例。已弃用的裸类仍会发出，并会在稍后的发行版中移除。
- `astryx docs tokens` 列出全部 258 个 token，添加了数据可视化和语法组，并显示每个 `light-dark()` 值的两半。
- 长小节已拆分，模糊标题已重命名，`--dense` 和中文版本不再丢弃块。十一个长小节 key 更短，例如 `astryx docs styling stylex-setup`，每个旧 key 仍能解析。通过小节的旧标题扩展 Core 主题的集成小节仍会替换该小节。
- `astryx integration add codemod --to` 的帮助说明它接受运行该 codemod 的 Core 版本。
- `astryx init` 写入的 agent 块现在会说明 `upgrade --from <old version> --apply`；单独使用 `upgrade --apply` 会以 "Missing required --from" 停止。
- 仅限贡献者的小节（关于添加语义图标以及组件内的字符串和文本方向）已移到 CONTRIBUTING.md。
- 已安装依赖的 `astryx.integration.*` 清单无法加载时，仍会被排除在加载集之外，但 `implicit-integrations` 现在会指名它并说明它不贡献任何内容。以前，doctor 会说没有已安装依赖附带清单。该检查保持信息性，`astryx doctor integration validate <package>` 会提供详细信息。
- `implicit-integrations` 只列出磁盘上存在的根目录。声明的根目录缺失的包会被报告为不贡献任何内容，并指名缺失的根目录。以前，它会列出清单声明的每个根目录。
- `provider-identity` 会说明它无法读取多少已加载的集成，而不是只统计可读取的集成。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @josephfarina

---

# 0.6.4

#### 新功能

- 添加可复用的 Item 文档标签页块模板 (#6652)
- `astryx build "<idea>"` 现在总会指定一个用于起始的页面模板 (#6707)。
  页面模板承载页面框架、间距和章节节奏。由组件组合而成的页面则必须重新发现这些内容。此前，只有当模板几乎按名称匹配时，工具包才建议搭建脚手架。其他想法得到的是“将其用作布局参考”，指向一个 35 行的 `--skeleton`，而没有任何模板匹配的想法得到的是“用 AppShell 搭框架，然后组合”。现在：

- 按身份链接文档，并允许集成为文档树添加内容。 (#6626)
  文档在其文本中使用 `{@link [<provider>:]<kind>:<name>}` 链接另一个文档，例如 `{@link command:doctor}`。CLI 会将每个链接打印为打开该文档的 `astryx docs` 命令；未指称任何文档的链接按原样打印，`astryx doctor` 会对此发出警告。较旧的 CLI 会将链接打印为纯文本。`reference`、`workflow` 和 `collection` 块保留在命名空间文档中。

  集成可以附带命名空间文档，并将自己的指南放入其中。它们会与 `cli` 一起出现在 `astryx docs` 中，具有相同的移动、链接和搜索能力，`astryx doctor integration docs` 会在包发布前检查它们。集成文档目录中的命名空间文档不再加载失败，`astryx integration add doc <name> --parent <namespace>` 会写入一个已放置的指南。不读取文档树的 CLI 版本可能会隐藏附带命名空间文档或已放置指南的包的所有文档主题，而且不说明原因，因此 `--parent` 会将读取它们的 CLI 声明为可选的 `@astryxdesign/cli` peer，`astryx integration pack --check` 会让附带其中任一内容却没有该 peer 的包失败。

  CLI 保留自己的路由：集成的扁平主题或命名空间如果名为 `cli`、`unorganized`，或与 CLI 的某个主题同名（不区分大小写比较），就会从文档树中撤下，其名称会打开 CLI 的文档，doctor 会发出警告。

  现在，每个扁平主题都位于 `astryx docs unorganized` 中、以自己的名称出现，因此每个文档在树中都有位置，也有向上和横向移动的路径。搜索命中主题名称时会显示层级和写入该文档的包。

  新指南：`astryx docs cli/writing-docs`。

- 在文本中，`astryx docs <topic>` 会在主题有多个章节时列出这些章节。 (#6626)
  使用 `astryx docs <topic> <section>` 读取其中一个章节，或使用 `--full` 打印整个主题。`--dense` 仍会打印完整的密集文档，因此 AGENTS.md 中的 agent 引导内容与之前相同。JSON 契约不变：`astryx docs <topic> --json` 和 `@astryxdesign/cli/api` 中的 `docs(topic)` 仍返回整个主题（`docs.detail`），`--index` 返回其章节列表。

- 将 CLI 的文档作为树逐层读取。 (#6498, #6626)
  `astryx docs cli` 列出 CLI 的指南和参考。`astryx docs cli/commands` 列出每个命令，`astryx docs cli/api` 列出 API 的函数、schema 和枚举，而诸如 `astryx docs cli/api/functions/search` 的路由会打印一个文档。`--json` 会为命名空间或类型化文档返回 `docs.node`，由其文档身份标识（生成的层级带有 `id: null`）。`astryx docs` 的文本会先列出文档树的命名空间；其 `--json` 保留 `data` 作为主题列表，并将它们添加在 `meta.namespaces` 中。CLI 附带的每个命令、API 函数、schema 和枚举文档都会声明读取它的 `namespace`：如果某个文档没有命名空间或命名了无人读取的命名空间，`astryx doctor` 会失败；如果某个文档在树中没有路由，则会发出警告。

- 从 `@astryxdesign/cli/api` 导出 `themeTemplate()`，与 `astryx theme template` 背后有文档记录的 API 一致。 (#6626)
- 集成指南从 `astryx docs cli-integrations` 移至 `astryx docs cli/integrations`。 (#6626)
  文档名称和路由是 `spec:AST-017/FR45` 下可变动的目录数据，因此这次移动不构成破坏性变更，也不需要兼容性别名。该指南现在位于 CLI 的文档树中，归在 `cli` 下。使用 `astryx docs cli/integrations`，包括 `astryx docs cli/integrations components` 等章节读取。旧名称不再解析。文档站点页面仍位于 `/docs/cli-integrations`。

- `astryx search` 会找到能回答问题的最小文档片段。 (#6626)
  现在，文档命中是一个章节（`astryx docs cli/integrations codemods`）、一个文档树路由（`astryx docs cli/api/functions/assert-response`）或一个主题的索引，而绝不会是整篇主题的读取。类型化文档按其自身名称以及其定义的标识符（例如错误代码）匹配。`astryx search --type doc` 无需 `@astryxdesign/core` 即可工作。`astryx docs` 会先列出文档树，命名空间会在其路由名称不同时显示每个子项自己的名称。

  现在，每次文档读取都以可移动项结尾：`Up`，以及章节或文档树页面的 `Previous` 和 `Next`，还有类型化文档的 `Related`（其命令或 API 函数，以及相关文档）。`--json` 将它们作为 `links`（`up`、`previous`、`next`、`related`）携带。每个搜索命中携带 `parent`，即打开其上一层的命令；文档树命中还携带 `package`。

- 文档章节可以包含另一个文档，而不是复制它。在章节中放置一个 `reference` 块，例如 `{type: 'reference', target: '@astryxdesign/cli:schema:integration', projection: {fields: ['components', 'docs']}}`，`astryx docs` 就会从该 schema 自己的文档中打印集成清单的这两个字段，然后打印打开它的命令。
  reference 块可包含 schema、命令、函数或枚举文档。`projection.fields` 只保留 schema 的指定字段，`presentation` 可以是 `full`（默认）、`compact`（无代码块）或 `summary`。引用任何其他文档时显示其标题和摘要。读取会内联该块，因此 `--json` 仍只返回稳定的块类型。当某个块命名了无法包含的文档、字段或投影时，`astryx doctor integration docs` 会失败，读取时也会标记缺失的内容。链接现在也能找到 CLI 的编写 schema：`schema:integration` 会打开 `astryx docs authoring integration`。

- 现在，当 `@astryxdesign/cli/authoring` 导出的类型在 `astryx docs authoring` 中没有文档，或者列出的自文档没有记录包导出的任何内容时，`astryx doctor` 会失败。消息会指明每个类型、声明它的模块，以及缺失或未列出的自文档。 (#6498)
- 为 DateInput、DateTimeInput 和 TimeInput 添加 `presentation`（`spec:AST-043`）(#6628)。
  `presentation` 会命名每一种选择器界面，区分 Astryx 的桌面界面、Astryx 的底部工作表（包括新的 TimeInput 工作表）、浏览器/操作系统选择器，以及——仅对 TimeInput——一个纯文本输入字段。DateInput 和 DateTimeInput 接受五个值：`'popover' | 'bottom-sheet' | 'native' | 'adaptive-bottom-sheet' | 'adaptive-native'`（默认）。TimeInput 接受这五个值外加 `'text-input'`，即适用于任何指针的文本输入字段，因为其已发布的 `nativePicker="never"` 本来就是这种界面。`presentation="native"` 始终显示原生选择器；`adaptive-native` 保留已发布的原生回退行为。

  `nativePicker` 已废弃但仍完全按已发布的行为工作（`touch`→`adaptive-native`，`always`→`native`，`never`→`adaptive-bottom-sheet`，或对 TimeInput 为 `text-input`）；同时设置时 `presentation` 优先。`astryx upgrade` 为静态调用点提供 `migrate-native-picker-to-presentation`。

- 在其支持的包边界之前准备集成模板替换。 (#6265, #6626)
  集成模板可以在自己的元数据中将 `replaces` 设置为某个 Core 模板 id。不带限定符的模板查找和发现界面会使用有效的替换，而 `--package @astryxdesign/core` 仍会选择原始模板。缺少目标、类型不匹配、在不支持使用的模板上声明，以及重复声明都会安全失败，并由 `astryx doctor integration templates` 报告。

  当多个已配置的包替换同一个目标时，后配置的包会胜出并给出警告。显式配置的包始终优先于自动链接的包。当只有自动链接的包发生冲突时，package.json 中后列出的依赖会胜出并给出警告，CLI 会建议显式配置。无效的贡献类型仍可报告，且不会隐藏其他有效类型，无效的模板或组件文件也不会隐藏有效的同级项。

  此实现可能会在最终 0.6.x 中发布以进行前向验证，但使用 `replaces` 的集成包仍必须要求 `@astryxdesign/cli >=0.7.0`。更早的 CLI 会拒绝该字段，并扣留该包的模板和文档主题。目前还没有任何受支持的 latest-stable 集成消费者能进入替换路径，因此替换选择及其可变目录结果属于补丁兼容的发布前行为。

  现有的同 id `IntegrationTemplateConflict` 响应在 0.6.x 上保持其已发布的仅警告形态。可选的 `TemplateListEntry.replaces` 字段是增量的；在 0.7.0 或之后，替换专用的 `relationship`、`replaces` 和 `severity: 'info'` 冲突字段需要一次有意的投影更新，覆盖运行时、类型、生成的参考、终端输出、文档和测试。仅提升包版本不会改变仅警告的形态。

- 添加 ScrollableArea 块模板，使组件页面拥有可用的示例。全部六个模板共享同一套内容词汇——一个由带标签的分区组成的工作区文件面板，其中包含两列柔和的卡片网格——因此示例之间唯一变化的是每个示例演示的行为：块轴滚动、带 `isFullBleed` 的 `axis="inline"`、粘性分区标签、`axis="both"`、针对 `stickyContainment="always"` 的粘性穿透，以及 `overscroll` 的 allow 与 contain 对比。 (#6490)
- 添加 Tree Table 页面模板 (#6195)
  一个层级表格，其中每个父行都从其子行派生，以代码仓库的形式展示：文件夹汇总其下最新的提交，列可以调整大小，排序限定在兄弟节点范围内，因此分支绝不会交错，方向键按照 APG treegrid 模式遍历树，搜索会剪枝到匹配的分支。选择文件夹会驱动一个标题路径，当路径超出栏宽时，其中间部分会折叠为菜单。配套的仓库界面——标题操作、About 侧边栏以及用 `Markdown` 渲染的 README——让表格处于可理解其汇总结果的上下文之中。

- 添加可选的类型化文档图契约和稳定的、感知提供者的文档身份，同时不破坏现有的主题读取器。 (#6471)
  新增 `NamespaceDoc`、`AuthoredDocKind`、提供者身份类型、语义图块类型、章节 ID、`astryx docs <topic> --index` 和章节键读取，均为增量添加。公共的 `ReferenceContentBlock` 联合类型保留其 0.6.x 成员，因此现有的穷尽式渲染器仍可编译；仅用于图的 `workflow`、`collection` 和 `reference` 块作为 `GraphContentBlock` 单独导出，并由 `NamespaceDoc` 接受。

  现有的已编写主题继续像以前一样加载和读取。重复的标题派生键会获得确定性的带后缀索引键，不含拉丁字母或数字的标题会获得确定性的 `section-N` 键，模糊的标题查询仍返回第一个匹配，没有 ID 的旧式扩展章节仍按完全相同的标题合并。显式的新章节 ID 仍会被校验。新的渐进式披露 Doctor 审计会将兼容性问题报告为警告，现有的完整主题文本输出保持其 0.6.x 格式。

  每个文档章节都可以选择加入稳定的 `id`。`astryx docs <topic> --index`（`docs(topic, undefined, {index: true})`）返回主题的章节索引（`docs.index`），`astryx docs <topic> <key>` 读取一个章节。主题读取仍返回整个文档。`astryx docs authoring` 记录每个编写 schema，每个 schema 一个章节。

  提供者 ID 冲突现在会可见，而不是无声地被丢弃：正在编写的包胜出，否则先加载的提供者胜出，每个命令以及 `astryx doctor` 都会报告被搁置的包。

- 集成主题使用类型化的同名描述符，而不是中心目录。 (#6498)
  主题根目录不再包含 `manifest.json`，即 `astryx integration add theme` 在 0.6 中写入的主题目录（自 0.6.3 起稳定）。每个主题改为在其源文件旁携带一个强类型的 `<name>Theme.doc.mjs`，仍包含该目录的主题根目录会被拒绝。要迁移集成包，请在其中运行 `astryx upgrade --from 0.6.3 --path . --apply`：codemod 会从每个主题的目录条目写入其描述符并删除该目录。在包完成迁移之前，安装它的应用无法获得其任何主题或文档主题。

  主题发现会读取描述符并在不执行主题源的情况下检查它们，`theme add` 会复制集成主题的完整目录。`astryx doctor integration validate` 会对主题根目录中看起来像主题但未被作为主题读取的文件夹发出警告。新的组件、主题和模板脚手架也会生成带类型注解的 `.doc.mjs`；已发布的 `.template.*` 输入仍可读取。

#### 修复

- 已发布的编写类型现在可以在使用 `"moduleResolution": "nodenext"` 或未安装 Node 类型的项目中进行类型检查。其中的相对导入会写明文件名，`PostCodemodCommand` 的 `env` 不再需要 Node 的类型。 (#6492)
- 从 CLI 的 peer 依赖中移除 `gpt-tokenizer`。CLI 中没有任何代码导入它，但 npm 和 pnpm 默认会安装必需的 peer，因此每次安装 CLI 都会拉取约 53 MB 从未使用的内容。 (#6508)
- `astryx init`、`astryx init --remove-agents` 和 `astryx upgrade --apply` 不再通过指向项目外部的 agent 文件或 `.claude/` 目录符号链接编辑或删除项目外的文件。Init 会为该文件报告路径安全错误并以 1 退出，`init --remove-agents` 会以 `ERR_PATH_TRAVERSAL` 失败并以 1 退出，而不是报告托管块已移除，upgrade 会报告刷新失败，且发生在写入任何文件之前。 (#6524)
- `astryx component` 和 `astryx hook` 的文本输出不再自行添加非 ASCII 字符。空表格单元格显示 `-` 而不是长破折号，简要视图的导入提示读作 `<- from`，派生属性和已废弃目标使用 `->`，简要的 prop 和参数列表用逗号而不是中点分隔。来自文档本身的文本保持不变。 (#6553)
- `astryx init` 的人类可读输出现在是纯 ASCII，包括 `init --remove-agents` 打印的逐文件行。状态行使用 `[ok]` 而不是勾号，破折号、项目符号和箭头打印为 `-` 和 `->`。`--json` 输出不变。 (#6540)
- `astryx upgrade` 的人类可读输出现在是纯 ASCII。进度和 codemod 行使用 `[ok]`、`!` 和 `!!` 而不是勾号、警告和叉号，破折号和箭头打印为 `-` 和 `->`，包括 `--list` 列出的 codemod 标题。`--json` 输出不变。 (#6539)
- 写入文件的命令不再跟随悬空符号链接到项目外部：当目标或通往目标的目录链接到项目根目录外不存在的路径时，命令现在会以 `ERR_PATH_TRAVERSAL` 失败，而不是在那里创建文件。`integration add` 报告的符号链接逃逸现在也携带 `ERR_PATH_TRAVERSAL`，而不是未注册的 `PATH_TRAVERSAL` 代码。 (#6513)
- `astryx blog` 的文本输出现在将 feed URL 标记为 `feedUrl`，与其 `--json` 键一致，并打印 JSON 携带的每个帖子字段：列表会添加每个帖子的 description、date、authors 和 link，帖子读取会在正文上方添加其元数据。 (#6526)
- `astryx build "<idea>"` 不再在其文本输出中打印 `setup:` 行。该字段只存在于文本中，从未出现在 `--json` 工具包中，因此两种视图不一致。相同的指导存在于无查询的 `astryx build` 操作指南中。 (#6570)
- 无查询的 `astryx build --json` 以及无查询的 `build()` 现在会返回操作指南本身——标题、带有命令的有序步骤、系统内规则和相关查找——而不是仅返回 `{playbook: true}`。终端输出由相同数据渲染，`playbook: true` 仍然存在。 (#6566)
- 编程式 `component()` API 现在会拒绝 `astryx component` 命令所拒绝的 `detail` 和 `lang` 值，并使用相同的代码（`ERR_INVALID_DETAIL`、`ERR_INVALID_LANG`）。它以前会静默回退：未知的 `detail` 返回名称列表，未知的 `lang` 返回英文。 (#6576)
- 编程式 `component(name, {cwd, blocks: true})` 现在会从其给定的 `cwd` 中发现块，与其他所有切片的行为一致。它以前从进程工作目录读取块，因此指向另一个项目的调用者会获得该目录的块，或什么都得不到。 (#6580)
- `astryx component <Name> --json` 中的 `parentDoc` 现在是 `component.detail` 响应中有文档记录的一部分。当像 `HStack` 这样的子组件从其父文档的范围中移出时，该字段就会出现。它已列入已发布的响应类型和 `component()` 参考中，文本输出现在将其显示为 `parentDoc: Stack`。 (#6575)
- `astryx component <Name>` 不再打印 `--json` 从未携带的“Related block templates”列表，因此文本输出只显示 JSON 结果包含的内容。同样的块仍由 `astryx component <Name> --blocks` 在文本和 JSON 中列出。 (#6574)
- 当包通过旧式 `astryx.docs` 字段发布文档时，`astryx component <Name> --package <pkg>` 不再忽略 `--source` 和 `--blocks`。`--source` 现在会以 `ERR_NO_SOURCE` 失败，`--blocks` 会返回块，与不带 `--package` 时相同。此前，这两个标志都会静默返回普通文档。 (#6577)
- `astryx component --list` 现在会为通过旧式 `astryx.docs` 字段发布文档的包中的组件打印正确的导入。它以前会为它们显示 `@astryxdesign/core` 路径。JSON 列表条目现在携带与 `astryx component <Name>` 为每个此类组件报告的相同 `import`。 (#6578)
- 当组件根目录下任何位置的组件文档已经使用该名称时（例如 `components/<Name>/<Name>.doc.mjs`），`astryx integration add component <Name>` 现在会以 `ERR_FILE_EXISTS` 拒绝。此前，它会在第一个旁边写入第二个 `<Name>` 并报告成功，随后 `astryx component <Name>` 会显示新的脚手架而不是已编写的组件。`--dry-run` 也会以相同方式拒绝。 (#6557)
- `AstryxConfig` 类型以及 `astryx docs authoring config` 的 `debug` 条目现在说明了来自集成的处理函数如何与应用自身的处理函数组合：应用的先运行，然后按加载顺序运行每个集成的处理函数；抛出异常的处理函数会被跳过，不影响其他处理函数或命令；`{"astryx": {"inheritDebug": false}}` 会拒绝继承的处理函数。该类型不再声称省略 `debug` 不会记录任何内容。 (#6514)
- `astryx discover` 的文本输出（包列表和单个包）现在显示其 `--json` 条目携带的每个字段，包括以前仅 JSON 包含的 `category` 和 `version`。 (#6521)
- `astryx doctor` 的文本输出现在使用与 `--json` 相同的字段名：每个检查打印其 `id` 和 `label`（标签以前显示为 `check`，id 缺失），摘要会在 `summary` 标题下打印 `pass`、`warn`、`fail` 和 `info`，而不是一行散文。 (#6516)
- `astryx template --help` 和 `astryx layout expand --help` 现在说明如何读取路径参数：以源文件扩展名结尾的路径是要写入的文件，其他任何内容都是目录，会获得 `page.tsx`、块的文件名或 `<Name>.tsx`。`layout expand` 和 `layout check` 还记录了 `-` 表示 stdin，以及 `--file` 优先于参数，`--overwrite` 不再提及 CLI 从不显示的提示。 (#6571)
- CLI 不再读取或设置 `ASTRYX_LATEST_VERSION` 环境变量。其唯一效果是在 `astryx component` 和 `astryx docs` 之后于 stderr 输出一行 `FYI: A newer version of @astryxdesign/core ...`，而一次 CLI 运行无法为后续运行设置变量，因此该行只在手动设置变量时出现。现在无论是否设置该变量，命令都会打印相同输出。 (#6554)
- `@astryxdesign/cli/json` 类型现在在 `CLIError`、`CLIUnsupportedError` 以及 `parseResponse` 和 `assertResponse` 返回的成功信封上声明 `apiVersion`，与每个 `--json` 信封携带的内容一致。手动构造 `CLIError` 值（例如在测试替身中）的代码现在必须包含 `apiVersion`。 (#6555)
- `astryx <command> --help`（包括 `astryx manifest --help`）现在以命令有文档记录的退出代码结尾，`astryx manifest --json` 中的每个命令将它们作为 `exitCodes: [{code, when}]` 携带。`astryx doctor --help` 只显示一次，`layout` 和 `discover` 的退出代码现在说明适用时机：裸 `astryx layout` 退出码为 1，空的 `discover` 查询在发现包时退出码为 1。 (#6586)
- `astryx gap-report --help` 和 `astryx manifest` 现在描述 `component` 参数，并说明除非设置 `--list-categories`，否则 `component`、`--category` 和 `--reason` 都是必需的，还说明了命令强制执行的字符限制。清单以前以空描述列出该参数，也没有说明这些输入是必需的。 (#6518)
- 当自定义 Heading 类型的独立规则没有可用声明（每个值都为空，或编译器丢弃了所有声明）时，`astryx theme build` 现在会在写入任何内容之前以 `ERR_THEME_INVALID` 失败。它以前会写入空规则或缺失规则的 CSS，并且仍将该类型添加到生成的 `HeadingTypeMap`。 (#6547)
- 使用 `--json` 时，`astryx help <unknown-command>` 以及不带子命令运行的命令组（例如 `astryx layout --json`）现在会返回错误信封，代码为 `ERR_UNKNOWN_COMMAND` 或 `ERR_MISSING_ARGUMENT`，而不是成功形态的帮助信封。两者仍以 1 退出，与不带 `--json` 时相同。 (#6550)
- `astryx hook <name>` 的文本输出不再列出 `--json` 信封不携带的块模板。它现在会列出相关组件，并指向 `astryx component <name> --blocks`，该命令会以 JSON 返回它们的块模板。 (#6537)
- package.json 中的 `"astryx": {"inheritDebug": false}` 现在也会在没有 `astryx.config` 的项目中拒绝自动链接集成的 `debug` 处理函数。该设置以前只在配置文件旁边读取，因此没有配置文件时，那些处理函数仍会接收到每次运行。 (#6520)
- 编程式 `init()` 现在将其用 `templateName` 搭建的起始模板限制在项目目录内。指向项目外部的 `src` 符号链接会在写入任何内容之前以 `ERR_PATH_TRAVERSAL` 被拒绝。 (#6538)
- `astryx integration add --help` 和 CLI 清单现在定义了每个控件：每种类型的名称格式、`--type` 默认为 `page`、`--to` 接受精确的 semver 版本，以及 `--replaces` 和 `--extends` 不能组合使用。`integrationAdd()` 的文档也如此说明。行为不变。 (#6558)
- 一个完全无法加载的集成（已配置但未安装的包、没有清单或有多个清单，或正在编写但有两个清单的包）不再连同其他所有集成一起拖垮。它会作为该包的集成问题报告，其他集成继续贡献，`astryx discover` 不再因此以 1 退出。 (#6519)
- 一个模板根目录无法读取的集成（例如清单将 `templates` 指向一个文件）不再使 `astryx template` 因原始文件系统错误而失败。该包的模板会被跳过，并给出通常的一行警告，Core 模板和其他所有集成的模板仍会列出和解析。 (#6523)
- `astryx --help`、清单和 CLI README 中 `--json` 选项的描述现在列出了每个信封字段：成功时为 `{ apiVersion, type, data, meta? }`，失败时为 `{ apiVersion, error, code, suggestions? }`。它以前省略了 `apiVersion`、`meta` 以及消费者用于分支的稳定 `code` 字段。 (#6549)
- 当 `<dir>/<Name>.tsx` 是指向项目外部现有文件的符号链接时，`astryx layout expand <expr> <dir>` 现在会以 `ERR_PATH_TRAVERSAL` 拒绝写入。此前只检查目录，因此生成的 TSX 会替换链接指向的文件。 (#6564)
- `astryx layout expand <expr> <path>` 现在将其文本字段标记为 `componentsUsed` 和 `todos`，即 `--json` 输出使用的键，而不是 `Components` 和 `TODOs`。 (#6569)
- `astryx layout expand` 现在将每个 `*N` 重复限制为 10000 份副本。重复的表格行曾跳过该限制，而且任何元素上的巨大计数在限制生效前仍会逐份遍历，因此 `B*999999999` 可能挂起或耗尽内存。`astryx layout grammar` 现在说明了该限制。 (#6565)
- `astryx layout check -` 和 `astryx layout expand -` 现在会在读取 5 MB 后停止读取 stdin，并以 `ERR_INVALID_ARGUMENT` 失败，与 `--file` 已有的限制相同。此前，无休止或过大的管道会被整体缓冲，直到内存耗尽。 (#6572)
- 当命令的模块加载失败时，使用 `--json` 运行该命令现在会打印一个错误信封（`ERR_UNKNOWN`，消息中包含加载错误），而不是不向 stdout 打印任何内容。不带 `--json` 时错误仍打印到 stderr，两种模式下退出代码仍为 1。 (#6551)
- 不带 `--json` 的 `astryx manifest` 现在将每个命令的名称标记为 `name:`，与 JSON 清单使用的键相同，而不是 `command:`。 (#6552)
- `astryx theme build --out` 现在会用 `ERR_PATH_TRAVERSAL` 报告离开工作目录的路径，用 `ERR_WRITE_FAILED` 报告无法创建输出目录，而不是未注册的代码如 `PATH_TRAVERSAL` 或 `EEXIST`。编程式 `themeBuild()` 会以 `AstryxError` 抛出相同的代码。 (#6543)
- `astryx theme palette generate` 现在会以 `astryx-oklch-v1` 配方固定的规范形式写入候选 JSON，因此 JSON 候选及其回执中的 `candidateSha256` 会与配方的参考夹具逐字节匹配。此前，`stops` 数组会打印在一行上，改变了每个 JSON 候选的字节和摘要。 (#6531)
- `astryx theme palette generate` 和 `generateTonalPalette()` 现在会拒绝配方未定义的 `neutralProfile`，即使请求中没有中性族。此前，这样的请求会生成候选，其回执将未知配置记录为规范化请求的一部分。 (#6534)
- `astryx theme palette generate` 现在会用稳定的 `ERR_WRITE_FAILED` 代码报告无法使用的输出或预览路径，例如位于普通文件下的路径。此前，`--json` 错误信封会将原始系统错误名称（如 `ENOTDIR`）作为其 `code`。 (#6533)
- 当 `astryx.config` 或集成清单在加载时打印内容时，`--json` 输出再次是一个信封。项目模块在加载期间写入 stdout 的任何内容现在都会转到 stderr。 (#6581)
- `--json` 错误信封的 `code` 现在始终是已记录的错误代码之一。带有 Node.js 系统代码的失败（例如写入失败产生的 `ENOTDIR` 或 `EACCES`）以前会将该代码放入信封；现在会报告 `ERR_UNKNOWN`，原始消息不变。 (#6548)
- 0.6 的 `rename-resizable-pixel-bounds` 升级 codemod 现在还会重命名通过命名空间导入（`Astryx.useResizable({...})`）调用的静态内联 `useResizable` 配置中，或包裹在 `as const` 或 `satisfies` 中的 `minSizePx`/`maxSizePx`。这些以前保持不变。 (#6541)
- 当找不到 `@astryxdesign/core` 时，`astryx search` 现在会像 `component` 和 `hook` 一样以 `ERR_CORE_NOT_FOUND` 失败，而不是笼统的 `ERR_UNKNOWN`。 (#6525)
- `astryx search --limit` 现在会拒绝不是正整数的值（例如 `1.5` 或 `5abc`），以 `ERR_INVALID_ARGUMENT` 和退出码 1 失败，与 `search({limit})` 已有的行为一致，而不是静默截断。 (#6528)
- `astryx search` 的文本输出现在会打印其 `--json` 结果携带的每个字段：文档结果的 `title` 和模板结果的 `kind` 以前缺失。`--verbose` 的帮助现在说明它添加的内容：每个结果的分数和匹配原因。 (#6527)
- `@astryxdesign/cli/api` 中的 `search()` 现在声明返回 `SearchResponse`，与其文档所述一致，因此 TypeScript 能看到每个结果的 `SearchResultEntry` 字段，而不是一个裸 `object`。 (#6529)
- `astryx swizzle` 不再通过输出文件夹中的符号链接写入项目外部。当组件文件夹或其某个文件是指向项目外部的符号链接时，命令现在会在写入任何内容之前以 `ERR_PATH_TRAVERSAL` 失败。 (#6573)
- `astryx swizzle --overwrite` 的帮助和清单条目不再说它会跳过提示。CLI 从不提示。该条目现在说明，不带 `--overwrite` 时，现有文件会使命令以 `ERR_FILE_EXISTS` 失败，且不写入任何内容。 (#6579)
- 当 `astryx template <name> <dir>` 在该目录中要创建的文件是指向项目外部现有文件的符号链接时，它现在会以 `ERR_PATH_TRAVERSAL` 拒绝写入。此前只检查目录，因此 `--overwrite` 会跟随链接并替换其指向的文件。 (#6563)
- `astryx template <name> <path>` 和 `astryx layout expand` 现在仅在路径以 `/template-assets/` 开头时替换演示媒体，因此只是包含该文本的第三方 URL 和产品路径会保持不变。位于子目录中、带有查询字符串或文件名包含 `@` 等字符的演示媒体现在会被完整替换，而不是损坏或残留。无法安全替换的演示媒体引用（例如没有文件后缀或在运行时构建的引用）现在会使复制失败并给出其路径。 (#6596)
- `astryx theme add` 现在会逐字节复制主题目录列出的每个文件，因此附带字体或图片的主题会完整到达。此前，它将每个文件解码为文本，这会损坏任何非 UTF-8 文件。 (#6530)
- `astryx theme add` 不再通过已经位于其为每个文件暂存所用的临时名称处的符号链接写入。指向项目外部的链接现在会以 `ERR_PATH_TRAVERSAL` 失败，该名称处的任何其他条目都会使复制失败，而不是被覆盖。 (#6535)
- `astryx theme build` 和 `astryx theme palette generate` 现在打印纯 ASCII：状态行使用 `[ok]`、`[warn]`、`[error]`、`[fail]` 和 `[note]` 标记，而不是符号图形，theme build 消息不再使用长破折号和省略号。改写后的字体和私有变量消息也会出现在 `--json` 回执的 `notices` 和 `warnings` 中。生成的主题文件不变。 (#6544)
- `astryx theme build --help` 和能力清单现在说明每个标志的默认值以及哪些标志组合会被拒绝（`--family` 与 `--out` 或 `--watch`、`--check` 与 `--watch`、`--watch` 与 `--json`、`--out` 与多个文件），并说明拒绝时返回的错误代码。 (#6546)
- `themeBuild()` 参考和 `theme.build` 响应类型条目（以及由它生成的 CLI README 表格）现在按名称记录回执的每个字段，包括 `notices`，即那些以前没有文档的提示（例如主题命名但未加载的字体）。 (#6545)
- `astryx theme template` 现在会用稳定的 `ERR_WRITE_FAILED` 代码报告无法写入的文件。此前，`--json` 错误信封会将原始系统错误名称（如 `EEXIST` 或 `EISDIR`）作为其 `code`。 (#6532)
- 当 post-codemod 钩子打印输出时，`astryx upgrade --json` 现在只打印一个 JSON 信封。钩子的 `buildCommand` 写入的任何内容都会转到 stderr，因此 stdout 只携带结果。 (#6536)
- 已发布的 `UpgradeListEntry` 类型现在声明 `optional`，即每个 `astryx upgrade --list --json` 条目已经携带的布尔值，因此类型化调用者无需强制转换即可读取。 (#6542)
- 当本地集成的 package.json 无法解析时，`astryx doctor integration validate`、`templates`、`components` 和 `docs` 现在会显示 `invalid_package_json` 错误。此前，文本输出会说未找到任何 `astryx.integration.*` 文件并隐藏错误，因为 JSON 报告 `name` 为 null，意味着没有清单。在这种情况下，`data.name` 现在为 `(local package)`。 (#6559)
- `astryx docs authoring` 现在说明哪些文档图功能尚未构建：`placement`、`aliases` 和 `audience` 字段，workflow、collection 和 reference 块，命名空间文档，以及工件、文档和实例身份。它以前将这些描述为可用，但使用它们的主题会加载失败。集成文档目录中的命名空间文档现在会以指明它的消息失败，而不是报告缺少主题字段。 (#6492)
- `astryx doctor integration validate` 现在为其关于位置错误的贡献、散落的 codemod 文件、命名错误的 codemod 文件夹、没有源文件的组件文档或没有文档的组件源文件的每项发现，都附上按原文执行即可奏效的修复：文件应移至何处以及应添加的清单行、codemod 应归入的版本文件夹，或应添加的文件。Codemod 文件按其在包内的路径命名，而不是绝对路径。隐藏的组件文档不再触发缺少文档警告，位于包根目录的 codemods 根目录不再将清单报告为散落的 codemod。 (#6498)
- `extends` 另一个主题的集成主题不再重命名它。安装扩展后，`astryx docs theme` 以前会打印扩展自己的标题和描述；该主题现在保留自己的标题和描述，扩展只添加或替换章节。`replaces` 另一个主题的主题仍会重命名它。 (#6498)
- 为生成的集成导入使用无扩展名的子路径说明符 (#6288)
  `integrationAddComponent` 和 `integrationAddTemplate` 现在会生成无扩展名的公共导入说明符（`@pkg/components/MyWidget` 而不是 `@pkg/components/MyWidget.tsx`），并通过包的 `exports` 字段将它们映射到源文件。消费者导入不再暴露包的源扩展名，也不要求 `allowImportingTsExtensions`。

  `integrationPackCheck` 现在会拒绝以 `.tsx` 或 `.ts` 结尾的公共说明符，并通过 Node 的包解析器验证从打包工件中的每个精确导入。没有可用公共导出的包无法通过检查，且结果不依赖于项目本地的 TypeScript。

- 让每个命令的文本输出与其 --json 数据一致 (#6616)
  `upgrade --list` 文本现在从 JSON 结果渲染每个 codemod（名称、标题、版本、optional），而不是使用 API 日志器，并且没有 `(undefined)` 行。`theme targets` 通过格式化工具包的 inline 布局为每个目标打印一行，现在会显示 className。`docs` 列表显示 package 字段。一个由清单驱动的奇偶校验测试覆盖此 PR 修复的命令，并捕获同一类别的未来回归；存在已知延迟差异的命令由信封和退出代码检查覆盖，并带有解释差距的允许列表条目。

- 修正调色板编写类型。`TonalPaletteCandidate` 的描述曾落在 `TonalPaletteAnchor` 上，因此生成的 `.d.ts` 记录了错误的类型，而候选类型没有描述。`TonalPaletteFamilyInput`——作者手写的类型——没有属性描述，`neutralProfile` 也从未说明其四个值的作用。 (#6168)
  [fix] 为生成回执提供真实类型。`generationReceipt` 以前是 `Record<string, unknown>`；现在是 `TonalPaletteGenerationReceipt`，旁边还有 `TonalPaletteRampDiagnostics`、`TonalPaletteCoordinationDiagnostics` 和 `TonalPaletteNormalizedRequest`。生成器的内部 typedef 指向相同的类型，因此编译器会保持文档真实，而不是任其漂移。

  [docs] 将过时的 `xds` 命令名称替换为 `astryx`，覆盖 11 个文件中 79 行 API 类型文档，并重新对齐调用表。引用旧名称的 codemod 和变更日志保持不变——迁移它们是它们的职责。

- 使用工作树声明保护生成、内置、忽略、链接、依赖和根目录之外的文件不受升级 codemod 影响。升级现在会运行声明的再生成钩子，重新检查受保护的输出，并在人类可读和 JSON 结果中报告不完整的更改 (#6692)。
- 将编写工厂 codemod 限制为 Astryx 导入 (#6335)
- 将状态变体和 Avatar 大小升级 codemod 限制为已验证导入的 JSX 组件上的静态 props，避免无关的字面量重写。 (#6445)
- codemod 版本文件夹下的测试和夹具文件不再作为 codemod 加载。以前，版本文件夹下的每个 `.ts`/`.mjs`/`.js` 文件都会被加载和校验，因此与转换同处一地的测试会校验失败，而定义错误属于硬错误，会连同该版本中的每个 codemod 一起失败，同时 `upgrade` 不应用任何内容却报告成功。保留名称：`*.test.*`、`*.spec.*`、`*.fixture.*`，以及 `__tests__/` 或 `__fixtures__/` 下的任何内容。 (#6230)
- 一个用 `components` 记录多个组件的带戳组件文档（`type: 'component'`）现在可以加载，正如已发布的 `ComponentDoc` 类型所允许的那样。它以前会以“props: expected array”失败。每个条目都必须指明其组件；没有 `name` 的条目会在加载时失败，而不是稍后在读取器中失败。 (#6492)
- 将已编写的主题声明保持在其 CSS 边界内。只丢弃不安全的声明，保留有效的 CSS 值和旧式标记生成，并继续编译主题的其余部分。运行时会向控制台报告被丢弃的声明；主题构建会将它们包含在现有的回执警告中。CSS 生成器接受一个可选的警告文本数组供构建收集器使用，不提供回调 API，也不增加导出的诊断类型。 (#5529)
- 让 Toolbar — Table Filter 块的筛选器真正执行筛选，并将这一行提升到 Filterable Table 页面模板所展示的模式：每个关闭的选择器同时充当自己的筛选 chip，随着行变窄，条件从句从末尾折叠为一个计数，结果计数、清除全部和列选择器跟随这些从句。 (#6478)

#### 文档

- `astryx docs authoring` 现在逐字段记录 `debug` 处理函数接收的 `DebugEvent` 以及 `GapReportHandler` 契约。这两个类型都从 `@astryxdesign/cli/authoring` 导出，但没有自己的章节。 (#6498)
- `astryx docs authoring` 现在与已发布的编写类型逐字段匹配，并且有测试保持这一点：每个字段都被列出，包含其真实类型以及是否必需。有三个条目是错误的：组件文档的 `usage` 在子组件文档中是可选的，命令选项的 `default` 也可以是布尔值或列表，codemod 的 `type` 是 `'code'` 或 `'config'`。 (#6492)
- 记录 CheckboxList 的 `isReadOnly` prop，并将全选块示例的行用 `hasDividers` 分隔，而不是在选项列表中放置 Divider (#6777)。
- `astryx build` 的有文档记录退出代码现在说明，查询在找不到 `@astryxdesign/core` 时退出码为 1，而操作指南（不带查询的 `astryx build`）不需要 core。 (#6592)
- `astryx discover --components` 现在按其实际行为记录：在包列表中，它会打印每个包的每个组件，而不是前 10 个和一个“+N more”计数，并且不会改变 `--json` 中的任何内容。它以前被描述为“List components only”。帮助中还新增了一个示例。 (#6522)
- `astryx init --help` 和清单现在说明 init 的标志如何交互：`--remove-agents` 只移除托管块并忽略安装标志，`--all` 覆盖 `--features`，`--agent` 和 `--agent-docs-path` 仅在安装 agent 文档时适用，显式路径优先。有文档记录的退出代码现在包括项目外的 `--agent-docs-path`（退出码 1），并不再列出 CLI 无法触及的两个模板情况。 (#6589)
- `astryx theme add --overwrite` 和 `astryx upgrade --install-deps` 不再描述 CLI 从不显示的提示；每个现在说明不带该标志时会发生什么（`ERR_FILE_EXISTS` 且不写入任何内容，或 `ERR_DEP_MISSING`）。`ERR_FILE_EXISTS` 被描述为“Refused to overwrite an existing file.”，去掉了“non-interactive mode”限定语；其含义不变。 (#6593)
- CLI README 现在在每个手写信封形状和示例中显示 `apiVersion`，并列出 `astryx search --verbose` 代替 `--detail`，后者需要一个级别且不会添加结果的分数或原因。 (#6587)
- 响应类型文档以及由它们生成的 CLI README 表格，现在按 JSON 键列出 `component.detail`、`docs.index`、`search`、`build.kit`、`gap-report.file`、`theme.build`、`theme.targets` 和 `integration.pack-check` 响应的字段，包括 `parentDoc`、`hint`、`notices`、`deprecatedFor`、每个 gap-report 交付的字段，以及 pack-check 的贡献身份和问题字段。`component.detail` 响应类型声明了 `parentDoc`。 (#6588)
- `astryx template --help` 和清单现在说明组合使用时哪些标志胜出：`--cdn` 覆盖其他所有内容并写入其值，否则写入 `<path>`，否则写入 `cdn.template.html`；`--list` 忽略名称、路径、`--skeleton` 和 `--overwrite`；`--skeleton` 需要名称且不写入任何内容。 (#6591)
- `astryx upgrade --help` 和清单现在说明其标志如何组合：`--list` 忽略其他所有标志，`--registry` 拒绝 `--list` 和迁移标志，`--codemod` 是运行可选 codemod 的唯一方式，并且也会跳过 ShadCN 组合检查。`--from` 帮助指明了旧式 `@xds/core` 回退，有文档记录的退出代码现在包括缺少 core、缺少 jscodeshift、无效的 `astryx.config`、post-codemod 钩子失败以及被拒绝的标志组合。 (#6590)
- `astryx docs authoring` 现在说明加载文档在哪些地方比其已发布类型更宽松（带戳的组件和函数文档、较旧的泛型文档以及模板），以及哪些文档类型接受它们不认识的字段。文档加载方式没有任何变化。 (#6492)

#### 其他变更

- `start` 命名要搭建的模板，并给出选择它的 `template <id> --type page <path>` 命令（通过被替换的 Core id 进行的集成替换）、一个 `basis`、一行 `reason` 以及 `alternatives`：接下来两个模板。一个为构建者撰写的长创意（“带 KPI 行、可排序表格和趋势图的运营仪表板”）而构建的页面排名器会选择它。每个匹配的词都计数，并按其在页面模板中的稀有程度加权。第一个“with”、“:”或“,”之前的词命名页面的族，容器（“in a modal”）命名其框架，而仅修饰另一个词的词（“product response”中的“product”）按一半计数。一个族的模板（`dashboard`、`settings`）引领其族，除非某个变体自己的词权重超过它。族词来自模板自己的 id。当排名器的选择也是搜索的直接匹配时，`basis` 为 `direct`；不是时为 `closest`；当没有任何内容有足够证据领先、页面从 `shell-top-nav` 应用外壳开始时为 `fallback`（当该外壳不可用时为 `blank`）。尚未就绪的模板永远不会成为起点。
- 搜索更严格地匹配单词。术语只在名称或关键词中某个词的开头匹配（“input”能找到 `TextInput`，“file”不再找到“profile”），复数和词干视为同一个词，拼写容错仅适用于单词查询，且单词足够长，使得一次编辑很少变成另一个词（“site”不再匹配“side”，“cable”也不匹配“table”）。
- 对于多词创意，只匹配其中一个描述词的块和组件不再提供。
- 文本输出有四个部分：TEMPLATE（包含其原因和命令）、OTHER TEMPLATES、BLOCKS 和 COMPONENTS（包含框架和基础名称）。它们取代 RECOMMENDED START 和 PAGE TEMPLATES。搜索的页面匹配（`pages`）移到一行，其完整条目在 `--verbose` 下显示。描述在第一个句子处停止，块和组件显示前三个，每个共享一行命令。`--verbose` 显示每个块和组件，包含完整描述、导入路径和匹配原因。推荐的命令始终搭建脚手架（`template <id> --type page <path>`），而以前对大多数创意会打印 `--skeleton` 或 `component AppShell`。

  `build` 操作指南、生成的 agent 文档以及 `working-with-ai` 和 `layout` 指南现在都从模板开始每个页面。

  兼容性：`build.kit` JSON 只增加 `start`。每个现有字段保持其形态和含义。列出的页面、块和组件以及 `directMatch` 会随更严格的匹配而变化，排名结果也一样。人类可读输出重新组织。选项、退出代码和 `build.help` 形态不变，`build` 仍不写入任何内容。相同的匹配变化也会改变 `search` 结果的排名。

- 文档读取经过一个内部编译器。`astryx docs`（以及 `docs()`）、`astryx doctor` 和 `astryx search` 读取编译后的主题节点，而不是各自加载、合并、翻译和链接文档文件。输出不变。 (#6484)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @bhamodi
- @cixzhang
- @ejhammond
- @ernestt
- @imdreamrunner
- @josephfarina

---

# 0.6.3

#### 新功能

- 添加 Canvas Editor 页面模板 (#6237)
  一个分层画板工作区：File/Edit/View/Object/Help 菜单栏位于左侧图层栏和资源库上方，画板居中于柔和背景之上，下方是设置缩放比例的浮动工具栏，右侧是属性检查器，其字段会重新指向所选图层。两侧栏均可拖动调整大小。

  检查器是其核心。文本图层可以设置字体、字重、颜色、大小、行高、字距、水平和垂直对齐、倾斜、装饰、变换、文本阴影和描边；图像图层可以设置适应方式以及九种 CSS 滤镜，每种滤镜都有一个数值和一个滑轨，二者同步移动。面板中任何位置的颜色都会打开真正的取色器。所有能影响画板的内容都会生效——在 Transform 中输入会重新设置海报的大小写，拖动 Sepia 会为照片着色。

  它填补了 `Tools - Page Editor` 旁边的空白。后者组合一个文档——一组块放入一个会围绕它们重排的流中。前者在固定的 1080 x 1920 框架上移动对象，其中位置和大小是坐标而不是顺序，因此检查器读取 X/Y/W/H，画布也完全需要缩放控件。

  如果你要复制它，有两个值得了解的决定：

  **画板是主题化的，而不是样式化的。** 模板的 `canvasEditorTheme` 围绕画板固定为 `mode="light"`，因此当周围的编辑器切换到深色时，海报仍保持其配色。该主题承载属于整张海报的内容——展示字体、行距、大写处理、画框边距——展示字体为 Anton，并带有穿过 macOS 和 Windows 自带窄体 grotesque 字体的回退链。该链将 Impact 排在 Arial Narrow 之前，因为其中每种字体都是按字重 400 渲染的单一字重黑体，而 Arial Narrow 在 400 下显得纤细，而不是海报般的厚重。

  大小和字距有意不作为 token：它们属于图层而不是海报，因此它们存在于图层上，检查器实时编辑它们。这种拆分就是值得复制的界线——主题化表面所拥有的一切，把每个对象的属性留给对象本身。

  **缩放是变换，不是重新布局。** 画板始终按其原生大小布局，框架缩放绘制结果，这使主题中的数值保持为画板像素——与检查器显示的数值相同——并防止海报在缩放级别之间重排。

  **菜单栏是一个按钮，不是五个。** File/Edit/View/Object/Help 变成了单个 `DropdownMenu` 的子菜单。菜单栏将左上角花在五个词上，而这些词只有已经在寻找命令的人才会读，这个编辑器有更好的用途来利用那块空间：标签页，它们被持续阅读。命令保留其分组——栏变成了菜单的第一层，而不是消失。菜单接受 `menuWidth`，因为任其自然它会匹配触发器，而触发器是一个 28px 图标按钮：五列单词行排在一列中，宽度几乎不超过这些词，没有空间放置子菜单的尖括号。

  模板解决了五个较小的问题，以防你遇到同样的障碍：

  **字段从内部命名自己。** 每个检查器控件都是一个输入框，其 `startIcon` 槽中有一个字形——`X`、`Y`、`W`、`H`——而不是用 `InputGroup` 将附加项与字段配对。它读起来像一个单独的控件，可访问名称也不再结巴（“Horizontal position”，而不是“Horizontal position X”）。`startIcon` 接受 SVG 组件，因此这些字母绘制在与 Lucide 相同的 24px 网格上，可以与真实图标并排互换。

  **整个面板左边缘一致。** 标签列是固定宽度，但 flex 项会比它的兄弟项先收缩，而它旁边的字段带有 StackItem 的最小宽度重置。如果标签列上没有 `flexShrink: 0`，这一行就会把收缩花在那里，每个字段会落在略有不同的边缘上——这正是检查器最承受不起的一件事。

  **行操作用共享的显示原语。** 图层的锁在行被指向或获得键盘焦点之前保持隐藏。`useContainerReveal` 拥有悬停、焦点、粗指针和减少动态效果的行为，而 `TreeListItemData` 转发返回的行 props，因此每个嵌套行都保持其显示状态隔离。

  **固定高度的 Card 会滚动；画板必须裁剪。** 给 `Card` 一个 `height`，它就会变成滚动容器，这对包含超出容量文案的卡片是正确的。画板是相反的情况：它在每个缩放级别下都按其原生 1080 宽度布局，框架缩放绘制结果，因此其内容有意大于其盒子，卡片会在 432px 框架内提供 1080px 的横向滚动。通过 `xstyle` 使用 `overflow: clip` 是解决办法，使用 `clip` 而不是 `hidden`，因为这里根本不应滚动——包括 `hidden` 在内部某物获得焦点时仍会执行的安静滚动。

  **同心圆角来自内边距。** 浮动工具栏是一个卡片，具有一个间距步长的内边距，因此其中的控件圆角是卡片的圆角 _减去_ 该步长——写作 `calc(var(--radius-container) - var(--spacing-1))` 而不是具体数字，因此任一个 token 变动时仍然成立。以与容器相同的半径切割内圆角，看起来会是一条更圆的曲线穿过一条更直的曲线；匹配差值才能让两者从同一圆心出发。顺便说一句：垂直 `Divider` 是 `height: 100%`，而一个将项目居中的 flex 行无法为百分比高度提供解析依据，因此该规则塌缩为零，工具栏会悄悄丢失其分组。`alignSelf: stretch` 才能赋予它高度。

  **顶部栏是 `LayoutHeader`，不是 `Toolbar`。** 它读起来像工具栏，但并不是。工具栏是一组同级命令，方向键在其中穿行，而文档标签页两次打破了这一点：从标签页上移开方向键会落到该标签页自己的关闭按钮上，而且一排打开的文档本身就不是一条工具带。它还与内边距冲突——工具栏为其承载内容的带设置边距，而应用界面框架希望更紧凑，这需要 `--astryx-section-padding-inline` 覆盖以及该覆盖重新发布的边缘补偿。

  `LayoutHeader` 是适合该槽位的组件，`padding={1}` 解决了所有问题：四边各 4px，使菜单按钮的盒子恰好位于幽灵内边距以前将其拉到的位置，因此字形落在相同的像素上，无需拉回任何内容。相同的 45px 栏、相同的 18px 字形中心、相同的分隔线——前后测量——减去一个描述错误事物的角色。浮动画布工具栏仍然是 `Toolbar`，因为那个确实是同级命令行，并且仍会左右漫游。

  **三行上同一个图标是一份没人读的列表。** 边框、阴影和填充都随附了相同的 `Palette` 色板，库中的三个效果预设也共享它——六行，一个标记，因此该列读起来像一个重复的控件，而不是六种不同的东西。Lucide 没有 `shadow`、`fill` 或 `padding` 图标，因此这些选择来自阅读图标包，而不是猜测名称：填充用 `PaintBucket`，阴影用 `SquareStack`（两个偏移方块就是投影），边框用普通 `Square`，每角半径用 `SquareRoundCorner`，这样就不会与同样使用 `SquareDashed` 的每边内边距按钮冲突。如果你自己去查找，有两件事值得知道。该包中的名称可能是别名——`FlipHorizontal` 重新导出 `square-centerline-dashed-horizontal`，在 16px 下是一个无法辨认的虚线框，而你真正想要的镜像三角形是 `FlipHorizontal2`。并且在 16px 而不是草图尺寸下评判候选：`radius` 在 48px 时是清晰的圆角仪表，在 16px 时则是一团糊。

  X、Y、W 和 H 保持为字母形式。它们是名称，不是图片——没有图标能区分水平坐标和垂直坐标，每个设计工具都出于同样的原因打印这些字母。

  **快捷键是提示，不是控件。** `Kbd` 为每个键绘制一个键帽，因此 `⌘N` 在菜单项旁作为两个小对象出现，读起来像你可以按的东西。桌面菜单将快捷键打印为安静的次要文本，这些现在就是如此——一个 `Text type="supporting" color="secondary"`，一个字符串，靠菜单右边缘对齐。代价是平台感知：`Kbd` 通过 `isApplePlatform` 将 `mod` 解析为 ⌘ 或 Ctrl，而 core 有意不导出该函数，因此离开 `Kbd` 的模板会打印 macOS 字形并停止适应。`shell-nav` 菜单栏已经做了这种权衡。如果你既需要安静的处理又需要平台切换，那是 `Kbd` 的缺口，而不是在调用点解决的问题。

  **行是 `Item`，不是 `ListItem`。** 两者都落在相同的紧凑度量上——4px/8px 内边距——但 `Item` 携带自己的 `density`，而不是从 `List` 上下文获取，因此行无论放在哪里都保持其间距，图层栏也不依赖其上方的列表来保持紧凑。这些行仍通过 `as="li"` 渲染为 `<li>`，因此对屏幕阅读器来说图层栏仍然是列表，而 `Item` 会合并 `className`，这正是让悬停显示标记继续位于行本身的原因。

  **一个高度，两条规则：在字段旁，或在行内。** 这里的一切都对齐到 28px——菜单栏、工具栏、每个检查器字段、图层栏的每一行。由此产生两件不同的事情，将它们混为一谈正是让面板显得凌乱的原因。

  位于字段 _旁边_ 的操作是 `IconButton size="sm"`，其 28px 盒子就是重点：清除、旋转对、每边和每角切换都与输入框的顶部和底部齐平，因此这一行读作一条带，而不是一个字段旁边漂浮着某个小东西。颜色色板和图像缩略图出于同样的原因采用相同的 28px 方形——字段旁的 chip 仍然是有边缘的东西，其边缘应与字段一致。

  位于行 _内部_ 的操作是例外，也是唯一会缩小的地方。紧凑行上下各花 4px，剩下 20px，而最小的 `IconButton` 自身就是 28px——因此用它们构建的栏无论密度如何都会测量为 36px。没有更小的尺寸可用；下限是组件的下限。因此图层栏的锁是一个裸 `<button>`，具有 20px 命中区域（`styles.itemAction`），图层栏测量为 28px。注意 _没有_ 改变的是什么：它仍然是 `<button>`，因此仍可通过键盘到达并被宣告。需要去掉的是 `Button` 的最小值，而不是元素本身。

  **边距因面板而异，色板借用字段的圆角。** 左侧栏位于 8px，因为其行就是内容——更密的边距让列表读起来像列表。检查器位于 12px，由每个 `InspectorSection` 而不是面板承载，这正是让分区之间的规则线全宽延伸的原因：如果改为给面板加内边距，每条分隔线都会按边距内缩，把全出血的规则线变成漂浮的线。

  颜色 chip 圆角为 `--radius-element`，与输入框圆角使用的 token 相同，而不是 `--radius-inner`。对于小方块来说，收紧一步听起来更安全，但在 28px 的字段旁，两种曲线读起来像不同的家族；匹配它们才能让 chip 看起来像行上的另一个控件，而不是丢在旁边的一块瓷砖。

  滑块是唯一 _不应_ 匹配的控件。滤镜行将一个 28px 数值字段与一个 20px 滑轨居中配对——滑块是一条用来瞄准的线，不是一个用来堆叠的盒子，将其拉伸到字段高度会读作第二个输入框。

  **边框、阴影和填充是选择器，不是文本字段。** 每一行现在是一个值、一个打开选择器的 chip，以及一个仅在槽位持有内容后才亮起的清除按钮。Astryx 没有可取用的颜色选择器，因此弹出层由它确实拥有的东西组装而成：一个 `Popover`、一个用于十六进制的 `TextInput`，以及一个用于色相的 `Slider`。

  色相滑轨值得停下来想一想，因为显而易见的做法是给它上色，而那是错误的。光谱滑轨看起来像自定义工作，但唯一自定义的东西是渐变——拖动、方向键、ARIA 和滑块拇指都只是滑块。因此它 _就是_ 一个 `Slider`，模板单个 `defineTheme` 中的 `components['slider-track']` 承载光谱。同一个主题以窄范围挂载在色相 Slider 周围，因此面板中的九个滤镜滑块保持它们应有的普通轨道。在伸手去拿 `<div>` 之前，先考虑主题化目标；先检查组件文档中的 `theming.targets`。

  只有饱和度/明度平面被绘制，而且只是因为它是两个轴，而滑块不是。它携带 `role="slider"`、方向键和指针捕获——捕获是值得复制的部分，因为没有它，快速拖出平面会在边缘停止，而不是跟随光标。

  选择器在打开时保持 HSV，即使图层存储的是十六进制。这不是冗余——一旦颜色达到黑色或白色，十六进制就没有色相了，因此如果选择器通过十六进制往返，当你拖到平面底部的那一刻，就会在滑轨上失去位置。

  阴影复用同一个弹出层，并在其中添加 X、Y、Blur 和 Spread，因为阴影是一个要设置的整体，而不是要查找的五条行。而在文本图层上阴影会出现两次是有意为之：Styles 中的那个是盒子的，Text 中的那个是文字的，图层可以同时携带两者。

  **可枚举的样式是静态的；只有开放式值是动态的。** 文本变换、装饰、倾斜和对齐是封闭集合，因此它们编译为按键选择的真实类（`typeCase`、`typeLine`、`typeSlant`、`typeAlign`），而不是每次按键都写入的自定义属性。大小、行高、颜色、描边和阴影没有这样的集合，因此它们保持为动态的 `styles.type(…)`。值得拆分，而不是让所有东西都动态：静态的那一半在运行时不花费任何成本，并在 devtools 中显示为名称而不是变量。

  **滤镜只输出偏离其中性点的内容。** 九个滤镜函数即使恰好都是无操作，仍会强制图像进入自己的合成层，因此 `filterCss` 会丢弃位于 0 或 100 的项，当全部都是时返回 `none`。

  **图像行的缩略图打开选择器。** `FileInput` 会是显而易见的组件，但它固定为中等元素高度，而这个检查器基于 28px 节奏构建，因此选择器由缩略图驱动，文件输入本身保持隐藏在 DOM 中。选择文件会在相邻字段中命名它并到此为止：模板没有上传端点，而从本地对象 URL 重新绘制画板会显示模板并未附带的内容。

  **画布工具栏的末端边距匹配。** 尾部的缩放控件是幽灵控件，因此边缘补偿将其拉到卡片边缘以在视觉上对齐其标签——当控件单独位于容器中时这是正确的，但在这里它在起始端留下 8px，在末端什么也没有。该步长通过包装器而不是控件自己的 `xstyle` 返回，因为 `Selector` 将 `xstyle` 传递给内部节点，那里的 margin 不会移动字段。

  **图层栏是 `TreeList`，按图层类型分组。** 海报的图层不是平面列表——两个文本图层属于一起，图像属于一起——树在结构上说明了这一点，而不是依赖排序和读者的推断。对于图层数量超出栏容量的文档，它还提供了折叠能力。行作为数据提供而不是组合而成，因此 `TreeList` 保留展开状态、参考线和漫游焦点，而手写的树必须重新实现这些；锁仍然通过 `endContent` 到达。

  每行的锁显示在移动后仍然有效，因为 `TreeListItemData` 将 `useContainerReveal` 的 `className` 和 `style` 转发到每一行。组采用框架标记，而不是重复子项的图标，因为父项是容器，而不是该类型的另一层。

  **标签页的关闭按钮占用其标签的空间，而不是加宽标签页。** 让一个仍占据盒子的控件淡出，会永久占用名称的 20px 空间，为通常不可见的东西保留空间。现在关闭按钮在静止时折叠为零宽度，悬停时收回其 20px，因此空间在需要之前属于名称。这需要固定的标签宽度：如果按内容调整大小，标签没有可收缩的依据，显示关闭按钮会把右侧的每个标签页推开——条带会在指针下重新排列，正要到达的目标会移动。显示是即时的。缓动宽度意味着标签在动画期间重新排列，因此每次指针穿过标签页时名称都会晃动——对一个只被瞥一眼的示能效果施加动效。固定宽度容纳最长的预置名称 _及其_ 关闭按钮显示时的宽度，因为打开的文档从不隐藏关闭按钮。

  **标签页用 16px 的规则线分隔，在打开的那个两侧去掉。** 垂直 `Divider` 除非给定高度，否则从行获取高度，而条带没有要划分的列——它需要最小的标记来读作“这些是分开的标签页”。标签页宽度一致，因此规则线标记边界，而不是坐在两个标签中间，这也是为什么它在打开的文档旁被去掉：该标签页已经通过其填充读作独立，规则线延伸进填充的圆角边缘只会显得拥挤。规则线是隐藏而不是卸载，因此移动选择不会添加或移除 flex 项，也不会让整个条带在刚刚点击它的指针下横向滑动。条带没有 flex gap，因为 gap 会应用在规则线 _两侧_，使它漂浮在自己的通道中，而不是落在接缝上；标签页有自己的内部内边距，因此紧贴它们不会让标签损失任何空间。

  **标签页有上限，而不是固定宽度，面板按宽度折叠。** 标签页现在处于最宽状态，并随着文档增加或窗口变窄而让步，先花掉标签的余量再截断，并停在下限，因此拥挤的条带会滚动，而不是把每个标签磨成细条。上限必须是 `width` 而不是 `flex-basis`：basis 不会提高项目的 max-content 贡献，因此条带会按标签页的 _内容_ 调整自身大小，然后在它们自己的 basis 下挤压它们，即使栏空了一半，每个标签页也会很短。

  条带还会限制自身，因为它位于 `Toolbar` 的起始槽，而那不是为让步而构建的槽——只有中心槽携带 `min-width: 0`，因此起始槽会增长到其内容并把栏推得更宽，而不是挤压。在 core 中加宽起始槽会为了一个页面的标签条带改变每个工具栏，因此上限是局部的：栏宽减去菜单按钮和尾部保存/导出组所需的空间，以 `cqw` 相对于标题测量，因此它跟随栏而不是窗口。新建文档按钮在途中移出了条带——它不属于该组所命名的打开文档，而且在可滚动条带内，它会是最先滚出可及范围的东西。

  两个侧面板在低于某个宽度时折叠消失，而不是被关闭：View 菜单的切换记录用户要求的内容，因此因空间消失的面板会在窗口增大时自行恢复。检查器先消失，因为它是两者中较宽的那个，也是可以不用它工作的那个；图层栏稍后消失，因为知道画布上有什么比能够调整它更持久。每个调整大小的手柄都随其面板一起折叠，否则会在接缝上留下一个把手，而另一侧什么也没有。

  **标题栏位于 4px，而不是 8。** 两个内边距曾叠加：工具栏自己的边距加上标签条带的边距，在 28px 标签页上方放了 12px，在画布上方放了 53px 的栏。栏是应用界面框架，因此采用更紧的边距，条带保留其 4px，使标题落在 45px。注意这里的下限——`Toolbar` 设置 `min-height: --size-element-sm`，标签页也是同样的 28px，因此任何内边距都无法让栏低于 37px。

  **导出是幽灵触发器。** 填充的主按钮会把页面最重的标记放在唯一不是工作的控件上——画布才是，而围绕它的栏应保持为界面框架。幽灵还让工具栏的边缘补偿发挥作用：它按自身内边距将幽灵触发器拉出，因此图标落在标题的边距上，而悬停框仍能溢出它。

  **图像行的触发器是 `Thumbnail`，不是包裹 `img` 的按钮。** 该组件已经携带手写版本重新推导的内容：按钮语义和来自 `onClick` 的悬停覆盖层、来自 `label` 的可访问名称和工具提示，以及颜色色板使用的相同 `--radius-element`。它以 64px 用于媒体网格，因此需要宽度覆盖才能加入 28px 控件的行；图片保持自身宽高比的正方形，因此高度无需帮助。

  **栏中的图标共享一种颜色，未选中的标签页整体变暗。** 每个栏字形以及条带的新建文档 `+` 现在都解析为次要 _图标_ token。该 token 及其文本对应物在主题根处一致，但在此编辑器的主题下出现分歧，因此以文本色阶为键的锁在它自己的行上比图层字形更深。标签页会连同其图标一起变暗标签；只让标签变暗会让图标保持全强度，读起来像半激活。

  **打开的文档标签页是 `Item`，条带是 `HStack`。** 标签页以前是一个 `div`，围绕 `button` 和 `span` 绘制界面框架，带有自己的圆角、填充、高度、gap、内边距和省略号。它与图层行是同一个对象——前面有标记、后面有操作的名称——因此现在使用相同的组件，所有这些都来自 `Item`：`density="compact"` 提供 28px 盒子，`isSelected` 提供填充，`startContent` 和 `endContent` 提供文件标记和关闭按钮，字符串 `label` 会自行省略。`Item` 还会忽略落在嵌套按钮上的点击，这正是让关闭按钮不会切换它关闭的文档的原因。条带的 flex、gap、内边距、滚动和上限现在都是 `HStack` props。

  不是 `TabList`，那个名称所暗示的组件：`Tab` 用下划线而不是填充标记打开的那个，按标签调整自身大小且无法从外部限制，并将两者都保存在 `xstyle` 无法触及的 span 中。

  有两件事保持在局部。宽度上限，因为条带位于 `Toolbar` 的起始槽，而该槽会增长到其内容。以及选中填充，因为 `Item` 用 `--color-accent-muted` 标记选择，而这个编辑器的主题将其解析为深色下标题栏的确切颜色——打开的文档会读起来像根本没有文档。`Item` 还会为沿列阅读留出行距；在标签页上，这些通道会让名称损失六个字符，因此度量收回到条带原本的宽度。

  **两个包装 div 回到了布局组件。** 画布舞台是 `HStack`——其 flex 盒、max-content 尺寸和块轴上的 100% 下限都是 props，只剩下 HStack 没有 prop 的 `min-width`。缩放控件的包装器完全消失：一个唯一工作是 margin 的 div，就是控件自己携带的 margin。

  **嵌套行操作现在是真正的 `IconButton`。** 它以前是手写的 20px `button`，因为元素刻度停在 28px，而一个与行同高的控件会把 28px 行推到 36px。`IconButton size="sm"` 通过行的内边距步长在每边内缩后布局为 20px，而对指针仍保持 28px：字形不动，行保持高度，目标增大到指针期望的大小。这些没有工具提示——从 28px 行打开的浮泡会覆盖其上方的行，而挂锁和 × 已经说明了它们的作用。

  如果你要将 Appearance 菜单连接到自己的 Theme，提个醒：嵌套 Theme 会重新为文本着色，但不会重新绘制透明面板后面的页面，因此显式模式需要一个表面——这里是一个包裹编辑器的 `Section`——否则新模式下的文本会落在宿主的旧背景上。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ernestt

---

# 0.6.2

#### 新功能

- 为 `astryx init --agent` 添加面向 Muse Code 的 `AGENTS.md` 的 `muse` 预设。 (#6045)
- 为选定的主题系列构建一个带键的工件三元组 (#6268)

#### 修复

- doctor：对每个 peer 按项目自己的 node_modules 进行范围检查，因此只能从环境到达的 peer 不再被读作已安装 (#5327)
  `checkPeerDeps` 使用 `require.resolve(name, {paths: [cwd]})` 解析每个 peer。Node 无论 `paths` 如何都会将 `NODE_PATH` 折叠进该查找，因此仅从环境可达的 peer 也能解析，doctor 什么也不报告，而项目本身却缺少它。现在它会遍历项目自己的 `node_modules` 并从磁盘读取每个 `package.json`，因此缺少的 peer 会被报告，已安装的 peer 会按声明的范围检查。

  Yarn Plug'n'Play 项目没有可供该遍历找到的 `node_modules`，因此当遍历为空时，查找会询问 PnP 运行时。PnP 从项目自己的依赖图解析并忽略 `NODE_PATH`，这使答案保持项目本地。PnP 项目现在也能获得 peer 范围检查——此前 `require.resolve` 可以确认那里存在 peer，但无法读取其版本，因为 Core 不导出 `./package.json`。

- 组件加载器现在会读取默认导出的 `.doc.mjs` 文件（`integration add component` 写入的形态），修复了 `component` 和 `search` 无法加载生成文档的崩溃。人类可读的 `component` 详情和列表视图现在使用 API 解析的导入说明符，而不是从 core 重新计算，因此集成组件会报告其包编写的导入。`pack --check` 现在会在组件文档无法加载时报告错误，而不是静默批准。 (#6291)
- 修复 `theme build` 为包含连字符或点后跟数字的主题名称生成无效 JS 标识符的问题。输出标识符现在通过在 `-` 和 `.` 分隔符处驼峰化（下划线作为有效标识符字符保留）从 `theme.name` 确定性地派生。像 `chaos-07` 这样的名称现在正确生成 `chaos07Theme`，而不是无法解析的 `chaos-07Theme`。 (#6289)
- 使分阶段写入在拒绝硬链接的文件系统上可移植。
  仅创建的发布器现在对 `EPERM` 和 `EXDEV` 从 `linkSync` 回退到带 `COPYFILE_EXCL` 的 `copyFileSync`，同时保留不覆盖、并发创建者安全、比较并交换替换、拒绝符号链接、回滚和临时文件清理。 (#6287)

- theme build：只有主题自己的 node_modules 链可以到达的 core 才被视为 CommonJS 依赖可以到达的 core，因此仅环境中的 core 不再使构建以 ERR_CORE_INCOMPATIBLE 失败 (#5327)
  `patchCommonJs` 从主题文件 require `@astryxdesign/core`，以查看它是否可以包裹 `.cjs` 依赖的 `defineTheme`。`require` 会折叠 `NODE_PATH`，而 pnpm 的隔离布局将每个包放在 `node_modules/.pnpm/node_modules`，因此主题的任何依赖都无法到达的 core 会回答该查找。包裹它会在 `require(esm)` 命名空间上失败，然后报告的覆盖缺口会拒绝任何谱系未被观察到的主题。现在查找会先遍历主题自己的 `node_modules` 链，与 `doctor` 解析 peer 的方式相同。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @Han5991
- @josephfarina
- @oliprovscode

---

# 0.6.1

#### 新功能

- 即使没有 `astryx.config` 命名它，也加载已安装的集成 (#6202)
  项目声明为依赖并附带根 `astryx.integration.*` 清单的包，现在会被立即加载——不需要配置条目。以前，一个添加依赖但不写配置的脚手架会让集成不可见：其组件、模板、文档和 codemod 都报告为缺失，这与根本没有安装它无法区分。

  只探测 _已声明_ 的依赖——`dependencies`、`devDependencies` 和 `optionalDependencies`——并且只按键探测。`node_modules` 从不遍历，因此依赖的传递依赖无法贡献；而且由于值从不解析，不是 semver 范围的依赖（`npm:` 别名、`workspace:`、`file:`、`link:`、`catalog:`）会像其他依赖一样解析。身份来自已解析包自己的 `name`，因此别名依赖会报告它实际是哪个包，两个依赖键命名同一个包时只加载一次。

  显式 `astryx.config` 条目保持其优先级和位置，清单加载失败的依赖会被安静地丢弃，而不是报告为消费项目的问题。

  `astryx doctor` 新增 `implicit-integrations` 行，列出以这种方式链接的每个集成、声明它的 package.json 字段以及它贡献的内容——因此作者可以回答“为什么 CLI 能看到这个？”而无需阅读 CLI 源代码，未使用依赖检查也有可读内容表明该依赖是承重的。该行始终是信息性的，因此 doctor CI 门禁不受影响。

- 用可组合的处理函数替换可执行的 gap-report 写入器。 (#6200)
  Gap 报告现在会分发给每个已配置的处理函数——先是项目配置，然后按配置顺序分发给每个已加载的集成——而不是选择一个写入器。每个处理函数获得自己的报告副本和一个 30 秒预算内的中止信号。失败的处理函数无法阻止后续处理函数，聚合回执会显示每个结果。

  公共类型：`GapReportHandler` 替换 `GapReportWriter`；处理函数接收规范化 `GapReport` 事件并返回严格的 `GapReportHandlerReceipt`。项目配置新增 `gapReport` 字段；集成命名导出使用相同类型。

- 添加集成编写和打包包验证。`astryx integration add <kind> <name>` 以及按类型的 `integrationAddComponent`、`integrationAddDoc`、`integrationAddTemplate`、`integrationAddCodemod`、`integrationAddAgentDoc` 和 `integrationAddTheme` API 会写入完整的贡献。现有的组件、文档、模板和主题命令无需先发布即可看到正在编写的包。`astryx integration pack --check` 证明相同的贡献在 npm tarball 中仍然存在，并且打包的组件仍可通过其公共导入使用。Doctor 现在会指出仅源文件组件、不可达的元数据、版本文件夹外的 codemod 以及无效的版本文件夹。 (#6245)
- 移除主题本地 token 的前缀要求 (#6285)
- 为 ShadCN 复制的组合添加升级回执和安全的三方协调。 (#6228)
- 允许集成包贡献源主题 (#6245)
  集成可以使用与 Astryx 内置主题相同的捆绑形态声明主题根目录。已安装的主题现在会出现在 `theme list` 中，`theme add` 可以按所有者复制一个主题。

#### 修复

- build：当顶部页面不是直接匹配时，在工具包载荷中推荐 `template <name> --skeleton`，与渲染器已经告诉人类的内容一致 (#6255)
- Center：保留组件拥有的轴反射，并修正水平居中示例。 (#6207)
- `astryx component <Name>` 的纯文本输出始终显示 `import {Name} from '@astryxdesign/core/...'`，即使组件属于集成包。JSON 响应已经针对正确的所有者解析了导入，但命令的文本格式化器通过仅限 core 的解析器重新计算自己的提示并忽略了该值。 (#5294)
  该命令现在使用组件详情响应中已解析的 `import` 字段，因此纯文本输出与 JSON 输出一致，并显示集成自己的包。

- 在维护的主题和新示例中优先使用规范组件目标名称，同时通过 0.7.0 移除窗口保留已废弃的运行时别名和已发布的裸 prop/状态选择器类。主题发现会标注已废弃的目标，theme build 会警告每个确切的规范替换，`astryx upgrade --apply` 提供向前兼容的裸选择器迁移。 (#6126)
- `component` 和 `search` 现在为集成组件报告相同的导入说明符，在 `foundation/discovery/component-discovery.mjs` 中解析一次。`search` 以前返回裸包名，对于组件通过子路径导出的包无法解析。 (#6203)
- 在 JavaScript 项目中保持 ShadCN 组合升级安全，并发布带有严格 TypeScript 声明的预编译 JSX。 (#6246)
- 使生成的 ShadCN 组合与原生客户端写入的字节完全匹配，包含包 peer 依赖，并在 CI 中要求全目录安装/构建覆盖。 (#6231)
- 将复制的集成主题文件保持在目标项目内。 (#6270)
- 在模板库和演练场中显示全部七个仪表板页面模板。 (#6264)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @andrskr
- @cixzhang
- @ernestt
- @josephfarina
- @kentonquatman

---

# 0.6.0

#### 破坏性变更

- 为 `defineTheme` 添加有序的环境适配
  主题现在可以针对命名视口宽度、主指针精度、对比度偏好和动态效果偏好，选择加入 CSS 优先的 token、主题本地 token 和组件更改：

  ```ts
  defineTheme({
    name: 'acme',
    adaptations: {
      widthBreakpoints: {sm: 640, md: 768, lg: 1024, xl: 1280, '2xl': 1536},
      rules: [
        {
          when: {width: {from: 'lg', below: 'xl'}, pointer: 'coarse'},
          value: {tokens: {'--size-element-md': '44px'}},
        },
      ],
    },
  });
  ```

  条件字段按 AND 组合。`width.from` 是包含的，`width.below` 是排除的，规则按声明顺序级联，因此后匹配的写入胜出。主题扩展保留有效断点映射和继承的规则顺序；静态构建保留源等效扩展所需的元数据。

  `AppShell` 现在接受 `mobileNav.breakpoint` 的 `xl` 和 `2xl`，并通过最近的 Theme 解析所有五个名称。移动模式现在使用已文档记录的排他边界（`width < breakpoint`），因此恰好位于命名点的 AppShell 会渲染更宽的布局，而不是移动布局。

  `defineTheme` 现在会校验适配规则中编写的 token 值，拒绝非字符串标量和长度不为二的数组，而不是输出它们。根和 on-media token 输入保持现有的接受方式不变，因此通过强制转换或展开传递值的主题仍可构建。它还会为每个可到达的匹配适配规则集校验可移植和主题本地 token 图的组合，在输出 CSS 之前拒绝循环。规则中的组件写入使用与根 `components` 相同的目标、轴、值域和扩展验证；规则不能是自定义值注册的唯一位置，因为生成的类型增强是无条件的。

  `astryx theme build` 将适配生成器视为核心能力而不是基线要求，因此没有适配意图的主题仍可针对较旧的已安装 `@astryxdesign/core` 构建，并输出与之前相同的 CSS。带有适配意图的主题——有效规则、自定义 `widthBreakpoints` 映射，或存在但格式错误的适配元数据——会在写入任何输出之前针对此类 core 失败，并以 `ERR_CORE_INCOMPATIBLE` 指明缺失的 `generateAdaptationCSS` 导出。没有规则的完整默认宽度映射不要求任何东西，仍可构建。当较旧 core 的 `defineTheme` 在解析时丢弃适配，构建会记录每个原始 `defineTheme()` 输入并将其与产生的主题关联，因此只有所选主题的谱系起决定作用。无法观察的所选祖先（包括其 ESM core 命名空间无法包裹的 CommonJS 源包）会安全失败；导入图中其他地方未使用的自适应主题不会影响普通构建。相同的捕获会在旧 core 构建的工件中保留原始排版、颜色、半径和动态效果轴元数据，使后来的当前 core 子主题能够精确解析部分适配轴，就像它们扩展了源主题一样。

#### 新功能

- 允许集成清单添加托管 agent 指南
- 添加编写时 OKLCH 调色板生成器，具有纯 API、终端和 HTML 预览、类型化调色板输出、自定义色阶、确定性回执和覆盖保护。
  [feat] 将精确的纯黑和纯白值公开为 `neutralPalettes.black` 和 `neutralPalettes.white`，用于语义主题 token。

- 每个命令现在都会在其调试日志中报告它返回了什么，新命令无法跳过。
  命令的 action 返回一个 `CommandResult`——要么 `{kind: 'results', count, resultKind, ...}`，要么对工作是效果的命令（build、init、upgrade、doctor）为 `{kind: 'none'}`。CommandDoc 转换器集中记录它，因此 `resultCount`、`emptyResult`、`resultKind` 和 `directMatch` 现在会为 `component`、`docs`、`hook`、`template`、`theme list`/`add`/`targets`、`discover`、`blog`、`swizzle --list`、`upgrade --list`、`layout grammar` 和 `manifest` 填充，而不仅仅是 `search` 和 `build`。`resultKind` 增加 `theme`、`integration`、`migration`、`command` 和 `none`；null 现在意味着运行从未到达答案，而不是“这个命令没什么可说”。这是现有字段含义的变化，因此记录的运行现在是 `schemaVersion: 3`——将 null 计为“没有可报告内容的命令”的消费者应在混合旧行和新行之前按版本分支。

- 为结构验证以及 Core 模板、组件和文档重叠添加 `doctor integration` 检查 (#6173)。
- 添加实验性 shadcn Registry 兼容性指南和文档派生的注册表身份元数据。它解释了包边界、稳定的组织路径、复制的组合模型、升级行为，以及何时使用更丰富的 Astryx CLI。
- 为 Core 0.6 已废弃 API 移除添加 `astryx upgrade` 转换：焦点方向覆盖、hooks 路径 IME 辅助导入和 Resizable 像素边界别名。

#### 修复

- 防止被移除的 Resizable 边界被静默忽略，并保持有歧义的展开迁移不改变行为 (#6124)
- 为 Core 裸选择器类移除添加保守的 `astryx upgrade --apply` 迁移。转换会解析 `.css` 选择器语法，将确切的 v0.5.4 目标/值对重写为行为保持的旧类/data 属性联合，覆盖 v0.5.4 输出的无界值，并保持未知的消费者类不变。
- 保留 `@path` agent 文档导入并移除先前重复的托管块 (#6164)
- 刷新 Collapsible 块模板，提供单例、多重、受控、分隔、独立和分组用法的完整、当前示例。受控步骤示例保持一个有效步骤打开，因此其进度标签和 Previous/Next 操作永远不会进入无效的“Step 0”状态。
- 当模板演示资源具有不支持的格式时报告夹具路径 (#6039)

#### 文档

- 将 Doctor 帮助和 README 示例与已发布的命令树和输出格式对齐 (#6197)。
- 澄清如何使用导入的图标注册表构建主题，包括当前省略内联注册表以及单独的注册表编译步骤。
  主题指南区分了缺失的已编译注册表和无扩展名的源导入：前者会破坏加载和打包，而后者在源文件保留在生成模块旁边时可由打包器解析。英文、密集和中文指南现在解释输出路径和 `--icons-specifier` 如何影响解析。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @Hashim1999164
- @imdreamrunner
- @jiunshinn
- @josephfarina
- @rubyycheung

---

# 0.5.4

#### 新功能

- 保留来自 CLI 集成的块展示元数据，使包可以附带自己的文档站点预览。Charts 现在在包旁包含其主要柱状图展示。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.5.3

#### 新组件

- 为 Selector 和 MultiSelector 添加 popover、bottom-sheet 和自适应展示选项，并为两种 bottom-sheet 变体提供文档站点示例。 (#5395)
- 在徽章、状态点、步骤指示器和进度条中复用 Neutral 拥有的本地 token 作为语义状态填充。 (#5854)
- 添加 Neutral 可复现、主题拥有的 OKLCH 调色板，同时不改变
  其运行时 token 映射。请求、回执、生成结果和 CLI 模板工件一起提交以供审阅。 (#5987)

- 为维护的主题系列添加可选的主题本地 token 契约。 (#5844)

#### 新功能

- 为组件文档添加结构化可访问性要求和主题覆盖支持。 (#5713)
- 添加 checkout 向导页面模板。 (#5660)
- CLI：记录每次命令运行并将其交给你提供的函数。 (#4812)

  ```js
  // astryx.config.mjs
  export default {
    debug: event => appendFileSync('runs.ndjson', JSON.stringify(event) + '\n'),
  };
  ```

  这就是整个功能。设置 `debug` 即选择加入；该函数每次调用接收一个 `DebugEvent`，并决定如何处理它。CLI 不存储任何内容。

  每个事件携带命令、其参数和标志（带有它们的 Commander 来源，因此可以区分手动输入的标志和默认值）、结果、退出代码、持续时间、错误代码、粗略的环境快照（包括调用 CLI 的是哪个编码 agent），以及 `output` 下的命令打印到 stdout 和 stderr 的所有内容。最后这部分是用户实际得到的答案，这正是让记录有助于改进输出而不仅仅是统计调用次数的原因。流会以真实字节数分别捕获，并在每个流超过 32KB 后截断，因此打印整个文件的命令不会主导记录。覆盖范围是关键：已处理的错误、解析错误、`--help`、被拒绝的调用、未捕获的抛出和 Ctrl-C 都会报告。事件从 `process.on('exit')` 监听器交付，因为 CLI 的错误路径会同步退出——任何挂接到正常完成的东西都会报告成功而几乎没有失败——而且处理函数在解析之前加载，因为解析错误和 `--help` 会在任何钩子运行之前短路。

  `event` 是已发布的契约：`DebugEvent` 从 `@astryxdesign/cli/debug` 导出，带有密封的 zod 校验器 `parseDebugEvent`，并与类型漂移锁定，因此记录器无法在不发布的情况下添加字段。`schemaVersion` 是字面量，因此扩宽它会使每个消费者的分支变成编译错误，而不是静默误读。

  处理函数在退出时同步运行——返回的 promise 永远不会被等待，因此从内部进行网络交付将无法工作；请写文件或派生子进程。它接收副本，因此抛出异常或修改所给内容的处理函数既不能使命令失败，也不能影响其他任何东西。后续加固防止处理函数替换命令的退出代码，并将处理函数的写入路由离开 stdout，使 `--json` 信封保持有效。 (#5929)

  对于未设置 `debug` 的项目，没有任何变化。启动不受影响：环境探测被推迟到交付时，而不是在 `begin` 中运行，因为它的第一次 `Intl` 调用会初始化 ICU，仅这一点就占所有人的 CLI 启动时间约 9%。配置也不会运行：`Project.load` 会评估配置模块并加载其集成，而大多数命令从未这样做，因此文件首先作为文本读取，只有在其中出现 `debug` 一词时才加载。在八个命令中测量，没有命令评估它原本不评估的配置。

  值在交付前会被擦除：主目录路径、堆栈帧内的绝对路径、电子邮件地址、URL 凭据、凭据形态的字符串，以及敏感赋值中值的那一半，无论出现在哪里——包括错误消息、堆栈帧和捕获的 stderr 都引用被拒绝标志的情况。敏感名称在匹配时去掉 `-` 和 `_`，因此 `--api-key`、`--api_key` 和 `--apiKey` 是同一条规则；`key`、`pat` 和 `pw` 按整词匹配，因此不会连带匹配 `--keyboard` 和 `--path`。`argv` 按对擦除，因此 `--token hunter2` 会像 `--token=hunter2` 一样丢失其值。过大的值会被钳制。

  经过三次对抗性混沌运行和一次独立审查的加固，每项发现都在修复落地前进行了变异测试：`__proto__` 键会静默重挂记录，一个过大的值会丢弃整个事件，绕过 `cliError` 的退出与分类失败无法区分，信号终止的运行完全没有记录，敏感的 `--flag=value` 在 `argv` 中被擦除，但通过引用它的错误消息和捕获的 stderr 完整写出，绝对路径在堆栈帧中存活——那里没有任何东西在它们前面放空白——并带走机器用户名，优雅的 Ctrl-C 被记录为失败，并带有进程从未返回的退出代码，`--api-key` 和 `--token value` 完整到达处理函数，以及上述两项启动成本。

  有一项变化超出了此功能：`installJsonShim` 现在在命令加入命令树时对命令进行 shim，而不是在启动时一次遍历，因此稍后注册的命令不再能悄悄掉出 `--json` 契约。

- CLI：`astryx init --json` 现在可用。它将安装回执作为标准信封输出——`init.run` 带有模式、运行的功能、写入的 agent 文档文件、任何软性 `docsError` 以及模板结果，或 `--remove-agents` 的 `init.remove`。人类可读输出被抑制，因此 stdout 只携带信封，退出代码与人类模式相同。 (#4812)
  `init` 是最后一个仍被 `--json` 门禁拒绝的有副作用命令。该门禁的存在是为了阻止命令写入半个项目后才发现 `--json` 不受支持；由于 `init()` 已经返回类型化回执，修复方法是输出它，而不是继续拒绝。`theme` 和 `layout` 仍在允许列表之外，但它们是没有自己输出的命令组。

- 为 DebugEvent 添加结果和 agent 会话上下文 (#5971)
- 添加 dialog 向导页面模板。 (#5798)
- 让主题添加类型化的 Heading 视觉角色，并在拥有主题的样式不可用时
  提供安全的语义层级回退。 (#6026)

- 添加 form 向导页面模板。 (#5664)
- 添加 inline 向导页面模板。 (#5797)
- 集成现在可以提供 `debug` 处理函数，因此安装它会开启其调试日志，而无需更改应用。从 `astryx.integration.*` 导出 `debug`；应用自己的 `debug` 仍会运行，两者都会收到每个事件，抛出异常的处理函数不会影响命令。使用 `{"astryx": {"inheritDebug": false}}` 选择退出。 (#5998)
- 柔化 Neutral 深色彩色调色板的低色调边缘，同时保留其浅色和中性色阶。 (#6069)
- 将 `table-page` 模板重建为可搜索、可筛选、可排序的表格模式，具有感知筛选器的总计、行详情、滚动的文档刊头，以及围绕缩小范围、排序和传达筛选状态的指导。 (#5865)
- TabList：添加 `isFullBleed` prop，使标签栏可以出血到其容器的行内内容边缘，而不需要手写负边距 CSS (#2622)。与 Divider 的 `isFullBleed` 一样，它通过负边距抵消最近的有内边距 Layout 容器的 `--container-padding-inline-*` 自定义属性；内部条带按出血超出标签停止点自身内边距的量补回，使边缘标签仍与内容内缩对齐。它仅限行内：TabList 拥有行内全出血，容器拥有块结束停靠。为此，LayoutHeader 获得 Section 现有拼写中的每边覆盖 `paddingBlockEnd`——`paddingBlockEnd={0}` 将标题的最后一个子项停靠在其底边，因此标签条带的下划线在任何标题内边距下都能与 `hasDivider` 相接。`detail-page` 模板现在使用这两个 prop，将其幽灵面板切换与容器内缩对齐，并且不再携带任何手写的标签行 CSS。
- 添加 vertical 向导页面模板。 (#5672)
- 添加 `work-item-detail` 页面模板，用于任务、工单、issue、故事、bug、卡片和请求详情界面。它包括响应式主内容和详情栏布局、可编辑元数据、子任务、附件、评论、活动，以及窄视口详情对话框。 (#5926)

#### 修复

- build：只匹配查询中一个词的页面不再作为直接匹配提供。页面模板的关键词包括其源渲染的每个组件，因此 `build "actionable warning banner"` 会以 95 分返回 `login`、`contact-form` 和 `documentation-design`——仅“banner”的精确关键词命中，加上覆盖率点缀，正好落在直接匹配阈值上。三个不是警告的页面被呈现为起始页面。覆盖率现在门控页面组，而不是点缀其分数。
  仅靠分数无法承载门控，因此 `scoreQuery` 现在报告它已经计算的覆盖率：每个搜索结果上的 `matchedTerms` / `queryTerms`，整短语命中报告完整覆盖率。单个强命中与宽泛的弱命中落在相同分数上，因此调用者无法分辨“三个概念中的一个”和“三个中的三个”。

  变基到当前 `main`，它在本次变更开放期间落地了集成搜索 (#5259) 和评分器级别的假直接匹配修复 (#5614)。两者都是 `main` 的实现，此处未改动——此分支不再重写 `gatherComponents`，因此该重写引起的两个回归也随之消失：集成结果再次报告其自己的包，损坏的配置不再把 Core `button` 搜索变成空成功。

  此分支以前携带的另外两部分现在按要求单独发布：在 #5937 中的指导层级索引和在 #5938 中的 thin-kit 提示。

- 单薄的 `build` 工具包现在会说明应尝试什么，而不是看起来空空如也。
  `build "quantum flux capacitor telemetry"` 返回一个偶然的组件和始终存在的框架列表，除此之外什么也没说。读到此内容的 agent 不会得出其措辞错误的结论——它会得出包中什么都没有的结论，并退回到自己对 Astryx 包含内容的记忆，这正是 `build` 存在所要防止的失败。

  低于三个可提供结果时，工具包携带一个 `hint`，命名两个用于浏览而不是搜索的命令，并明确说明这是关键词匹配，不是语义匹配。阈值计算的是经过分数下限后 _留存_ 的内容，而不是搜索返回的内容：`hasResults` 对于匹配了一些东西然后全部过滤掉的查询已经是 true，而这是最容易被误读的情况。

  `hint` 是结构化的——`{reason, commands}` 带有裸子命令——而不是把命令烘进句子的文本。API 无法知道项目如何调用 CLI，硬编码的 `astryx component --list` 在 pnpm workspace 中无法解析，而此输出中的其他每个命令都渲染为 `pnpm exec astryx`。渲染器通过 `formatCliCommand` 格式化它们，因此它们按打印即可运行，JSON 调用者得到的是各部分，而不是需要重新解析的散文。

  `hint` 仅在适用时出现，因此健康的工具包与之前逐字节相同。CLI 最后渲染它，作为 `FEW MATCHES` 分区列在图例的分区顺序中，因此它是读者离开时看到的那一行。

  应评审要求从 #5320 拆分出来。公共响应文档（`build.doc.mjs`）和 `BuildKitResponse` 类型均已更新。

- 共享 CLI 博客适配器（`blog.list`、`blog.detail`）在 `fetch` 返回响应头时立即清除其 15 秒中止计时器，使后续正文读取在时间上无界，并在检查 5 MB 大小限制之前缓冲整个响应，因此该限制实际上没有限制读入内存的量。 (#5286)
  中止计时器现在在正文消费期间保持活动。在可用时正文按流读取，在每个块之后检查解码后的大小，并在超过限制时立即中止读取，而不是先缓冲完整响应。

- CLI：记录的运行不再携带原始 agent 会话 id，环境快照像其他所有值一样被擦除。 (#6051)
  一个 `DebugEvent` 声称 `redacted: true`，而 `env` 从未经过擦除过程，并且它在哈希旁存储了原始 `agentSessionId`。会话 id 会跟随一个人跨越其进行的每次运行，而处理函数可能会将这些记录转发到任何地方——因此记录发布了稳定标识符，从环境粘贴进来的 agent 名称也原样发出，而一个标志却说两者都不是。

  契约现在在 `DebugEventEnv` 上明确：无身份，仅根据正面证据归因，自由文本被擦除。`env.agentSessionId` 始终为 null——通过 `env.agentSessionIdHash` 连接运行，这正是原始值的用途。CLI 自己派生的一切（平台、CI 提供商、区域设置、哈希）仍按原样记录，因为擦除后的快照不值得保留。`redacted` 只在密封副本上设置，而且在每次擦除过程实际运行之后。

  `DebugSchemaVersion` 扩展到 `1 | 2`，CLI 输出 `2`，因此基于它进行 switch 的代码被迫处理两者，而不是静默读取一个含义已变的字段。`parseDebugEvent` 相应版本感知：v1 记录可以携带原始 id，v2 记录不可以，如果携带则被拒绝。

  不是破坏性变更：`debug` 和整个 `DebugEvent` 表面尚未发布——它们在同一版本中落地——因此没有任何已发布的消费者见过原始标识符。

- CLI 不认识的清单键不再丢弃整个集成。`astryx.integration.*` 使用严格 schema 解析，因此一个无法识别的字段就会使解析失败——而清单解析失败的集成 _什么也不贡献_，连同其组件、模板和 codemod 一起消失。由于集成发布一次并针对许多 CLI 版本安装，较新 CLI 添加的字段会以完全、静默的该包丢失到达每个较旧的消费者 (#5119)。未知字段现在会被忽略，并给出命名它们的 `unknown_manifest_key` 警告，清单的其余部分仍然生效；已知字段类型错误仍然是错误。 (#5311 后续)
- CLI：散落的锁文件不再覆盖项目声明的 `packageManager`。 (#6051)
  在 pnpm 项目内运行一次 `yarn install` 会永远留下一个 `yarn.lock`。单个锁文件以前会压过 `packageManager` 字段，因此 CLI 对声明 pnpm 的项目回答“yarn”——并在建议的每个命令中打印 `yarn astryx …`，包括写入 agent 文档的调用行，agent 会照抄它。`astryx doctor` 称该设置为健康。

  现在，声明的 `packageManager` 字段无论旁边有哪些锁文件都起决定作用。有文档记录的回退不变：没有声明时，单个锁文件仍然回答；已提交的 `pnpm-workspace.yaml` / `.yarnrc.yml` / `bunfig.toml` 仍会打破多锁文件平局；未打破的平局仍解析为中性的 `npx` 形式并伴以 doctor FAIL；只有整个遍历什么都没找到时才咨询运行器。

  当锁文件与声明矛盾时，`astryx doctor` 现在会发出 WARN，指出文件，并说明应删除什么——而不是将项目报告为正常。

- `astryx search`（以及共享其排名的 `astryx build`）以前从不会显示其精确多词关键词短语被搜索的组件，如果有足够多其他不相关候选恰好各自包含查询的某个单词。搜索 `"table of contents"` 时，`Outline` 没有结果，尽管 `Outline.doc.mjs` 逐字声明 `'table of contents'` 为关键词，因为与 `Table` 相关的模板各自分别匹配 `table` 和 `contents`，其组合的逐词分数超过了 Outline 的单个精确匹配。
  现在，与候选声明关键词（或名称）逐字精确匹配的查询会被提升到顶级分数，因此它总是排在仅偶然包含查询多个单独单词的候选之上。单词查询和不完全匹配关键词的查询不受影响。

  后续 #6001 和 #5994 保留了 build 排名所需的覆盖率计数，同时将其排除在公共搜索结果形态之外。

- CLI：`search` 和 `build` 现在报告 _匹配_ 的结果数，而不是返回的结果数。 (#6051)
  `build.kit` 信封上的 `matchCount` 和记录运行上的 `output.resultCount` 以前都是 `--limit` 截断后列表的长度。匹配两百个东西的查询和恰好匹配二十个的查询记录相同的数字，因此下游无法区分被截断的答案和完整答案——而单薄的工具包会读作“包中什么都没有”，而实际上是“上限隐藏了其余部分”。

  `search --json` 现在在 `results` 旁携带 `matchCount`，当列表被截短时文本视图显示 `Results for "x" (2 of 57)`。载荷本身不变：`results` 仍受 `--limit` 限制，工具包仍最多呈现 3 个页面、5 个块和 6 个组件。

- 将五个仪表板页面模板目录 slug 重命名为可复用模式名称，遵循 Contributing Templates 中的命名约定：`dashboard-data` → `dashboard-comparison`、`dashboard-executive-summary` → `dashboard-scorecard`、`dashboard-portfolio` → `dashboard-composition`、`dashboard-project-status` → `dashboard-progress`、`dashboard-service-monitoring` → `dashboard-alert-rail`。每个旧 slug 命名的是数据或任务而不是可复用模式，因此对相邻请求服务不足：随时间变化的组合形态并不专属于投资组合，警报栏形态也不专属于服务监控。旧 slug 不再解析，因为目录查找是精确匹配；使用上面的新当前目录值。`template` 命令和机器可读 schema 不变。 (#5927)
  两个类别随其 slug 移动：`dashboard-comparison` 采用 `Dashboard - Comparison`（它以前与 `dashboard` 模板逐字共享 `Dashboard - Analytics`，因此两者都不拥有该关键词），`dashboard-scorecard` 采用 `Dashboard - Scorecard`。两个值都添加到 `TemplateCategory` 联合类型；被取代的值保留为预留。领域词汇——portfolio、holdings、monitoring、uptime、executive summary——在每个 `description` 中保持不变，检索实际上就是从那里读取它们。

  还修复了记分卡模板 `name` 字段中的拼写错误（“Executive Summary Dashoard”）。

- 在 CLI 发现中对父项拥有的主题化目标去重，同时保留每个子组件自己的直接文档。 (#5767)
- 在直接加载本地化组件文档时保留结构 (#5761)
  经过校验的组件文档加载器现在应用与 CLI 加载器相同的完整覆盖回退，因此省略的本地化结构继承规范结构，而显式的本地化结构仍然胜出。

- 包管理器检测：不要让散落的锁文件决定 (#5301)
  `detectPackageManager` 按固定顺序检查锁文件并返回第一个命中，因此包含多个锁文件的目录会按数组位置解析。`yarn.lock` 在该数组中排在首位，这意味着在 pnpm 项目内运行一次 `yarn install` 会静默将 CLI 的答案切换为 yarn——而且是永久性的，因为散落的锁文件留在磁盘上。

  随后 CLI 打印的每个命令都是错误的，包括写入 agent 文档块的调用行，agent 会逐字复制到自己的运行中。

  显式的 `packageManager` 声明具有权威性，即使项目还包含一个或多个锁文件。没有声明时，单个锁文件仍然起决定作用。当多个锁文件位于同一目录时，只能根据项目拥有的其他证据来打破平局：已提交的包管理器配置文件（`pnpm-workspace.yaml`、`.yarnrc.yml`、`bunfig.toml`）。一次散落的 `install` 会留下一个锁文件；它不会写下其中任何一个。

  运行器（`npm_config_user_agent`）有意 _不_ 打破该平局。被交给错误 `yarn astryx` 行的 agent 会通过 yarn 运行 CLI，因此运行器同意这个错误，重新生成 agent 文档会再次写入错误的行——失败会自我复制。对于从该 shell 调用的已安装二进制也是如此。两者现在都有从错误行开始的回归测试。

  当没有项目拥有的东西决定时，CLI 不会猜测。`detectPackageManager` 返回中性的 `npx`，这在每个包管理器下都是正确的，新的 `explainPackageManager` 会报告 `ambiguous` 以及并列的候选者。`astryx doctor` 将其变成 FAIL，指明目录和修复方法——添加 `packageManager` 字段，或删除不属于这里的锁文件。这与 `findConfigPath` 对共存配置文件已有的拒绝相同。

- LayoutPanel：添加演练场包装器和文档站点预览的默认子项 (#5919)
  通过在 Layout 脚手架内包裹 LayoutPanel 并在起始槽中放入代表性面板内容，防止文档站点上的属性标签页预览渲染空舞台。

- 在本地化组件文档中保留规范结构 (#5753)
  本地化组件文档现在在省略时继承规范结构，而显式的本地化结构仍然优先。

- 使 table-filter 页面模板在窄屏和触摸表面可用：View options、详情面板、保存视图对话框和筛选器溢出适应底部工作表，筛选器和保存视图行保持一行，在宽度不足以滚动其余部分时放弃列冻结。 (#5829)
- 修正 Neutral Banner 的交互色调，使浅色模式使用半透明浅色覆盖层，深色模式使用半透明深色覆盖层。 (#5936)
- 为 Neutral 破坏性按钮使用调色板支持的红色交互覆盖层，使用纯深色调色板 tone-25 背景（灰色为 tone 20），以及更平静的深色模式文本颜色。为深色信息横幅使用调色板支持的柔和蓝色调，同时保留现有的浅色模式非语义颜色映射。 (#6049)
- 给 Neutral 分段控件更宽敞的内缩，同时保留其外部高度。 (#5851)
- 重命名内置语法主题标识符。 (#5847)
- 通过命名色阶引用将 Neutral 的语义、语法和分类颜色 token 重新映射到
  经过审阅的主题拥有调色板。保持维护的 CLI 模板同步。 (#6034)

- 将查询覆盖率元数据保留在 build 排名内部，同时为提升的精确短语匹配保留它。 (#5994)
- `search` 索引组件的使用指导，比其描述低一个层级。 (#5937)
  组件的最佳实践是读者词汇所在之处。`Banner` 将自己描述为“一份持久消息”；只有其指导提到“caution”、“problems”、“form errors”。这些词都无法找到它，因为指导从未被读取——97 个 core 组件附带指导，而所有这些对搜索都是不可见的。

  在真实注册表上测量，前后对比：`caution`、`problems`、`sources` 和 `attention` 现在各自返回其指导定义了它们的组件，而之前都没有返回相关结果。

  指导得分为 45，低于描述的 50，因此本身是答案的组件仍排在仅仅提到该术语的组件之上——这一排序曾让 `Toast` 在“notification”上排在 `Card`、`Dialog` 和 `Item` 之后。

  它有意位于 `MIN_TOKEN_SCORE` 之下，因此永远不会被视为多词查询中的匹配概念。这不是细节：让它计数曾被测量为将 `nested menu` 从 SideNav 移到 List，将 `explain why a field is required` 从 Field 移到 TextInput——指导恰好提到另一个词的组件挤掉了答案。广度不是相关性，这与 `weakKeywords` 被限制的原因相同。下限保持在 50，28 个查询的扫描显示零个顶级结果变化和零个回归，同时保留了上述单词收益。

- Table 收件箱回复现在仅对同一对话保留未发送的正文，防止文本跟随已更改的收件人。 (#5934)

#### 文档

- icons 指南中的命名空间图标理由和添加语义图标介绍，以及 `SideNavItem` 的 `actions` prop 描述，现在使用逗号和冒号代替散文中的长破折号。含义不变。 (#5647)
- 12 个页面模板的描述散文现在使用括号、逗号和冒号代替长破折号。这些字符串供给 CLI 模板列表和文档站点，因此普通标点在那里读起来更好。含义不变。 (#5679)

#### 其他变更

- Core 的 postinstall 不再手工镜像安装契约。`packages/core/scripts/agent-doc-state.mjs` 现在逐字节地从 CLI 的无依赖叶子 `packages/cli/foundation/agent-docs/agent-doc-state.mjs` 生成，`pnpm check:setup-contract`——接入 `check:repo`——会在两者不同时使构建失败。 (#4162)
  以前的守卫比较两个手工编辑的常量列表。那只捕获新的 agent 文档路径或新标记，除此之外什么也没有：谓词本身以及两个 postinstall 脚本中重复的 `shouldNudge` 决策矩阵仍可能漂移，使第 1 层和第 2 层对“这个项目是否已设置好？”意见不一，而测试仍然通过。`shouldNudge` 和提示字符串也移入契约，因此所有四件事——路径、标记、谓词、决策——现在只有一个定义和一个编辑位置。

  行为不变，而且是经过验证而不是假设的：提示文本逐字节相同，旧式 `<!-- XDS:START -->` 块仍计为已设置，所有六个 agent 文档位置仍被检测到，两个脚本在包括失败在内的每条路径上仍以 0 退出。Core 通过动态导入加载其副本，因此打包错误会退化为“无提示”，而不是从模块评估中抛出并使消费者的安装失败。如果 core 停止在 `files` 中列出生成的文件，`check:setup-contract` 也会失败，因此它从一开始就不会丢失。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @Geervan
- @harjothkhara
- @jiunshinn
- @josephfarina
- @kentonquatman
- @nynexman4464
- @rubyycheung

---

# 0.5.2

#### 修复

- 将 Data Input 组件类别重命名为 Form Controls (#5686)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @rubyycheung

---

# 0.5.1

#### 新功能

- 组件文档可以声明结构化的 `usage.accessibility` 要求，`astryx component` 在完整和紧凑输出中将其渲染为专门的 Accessibility 分区。翻译和密集文档覆盖层保留基础可访问性指导，除非它们显式替换它。 (#5646)
- 图标 API 和主题接受命名空间扩展键，NumberInput 的步进器使用 `numberInput:stepperDown`，而不扩宽必需的 `IconRegistry` 键 (#5466)
  `<Icon icon>`、`useIcon` 和 `defineTheme({icons})` 接受诸如 `numberInput:stepperDown` 和 `richtext:bold` 的键；拼错的内置名称仍然是类型错误。NumberInput 保留紧凑居中的 Core 回退，而主题可以独立于共享的 `chevronDown` 语义覆盖其步进器。

- 重建 `settings-dialog` 页面模板，具有可搜索导航、响应式分组控件、实时外观预览、可配置键盘快捷键和文档站点画廊可见性。 (#5568)
- 新的 `table-filter` 页面模板：围绕筛选 token 列表构建的表格页面 (#5448)
  将内部 XDS 表格页面模式的功能集移植到 Astryx 原语上。筛选行是快速筛选切换和字段控件的 token 列表——`Selector`、`MultiSelector` 以及包裹范围 `Slider` 的 `ComplexSelector`——对于 token 无法表达的任何内容会切换到 `PowerSearch`。两种模式读写相同的 `PowerSearchFilter[]`，因此在任一模式中构建的筛选器在切换后仍然存在。控件在未设置时携带字段界面框架，在持有值后带有按下填充，因此无论条件来自切换还是选择器，该行都读作同一家族。

  围绕这一点：保存捕获筛选器和整个表格配置的视图，选择时滑入的批量编辑栏，以及带有四个面板的视图选项弹出层——拖放列传输列表、密度、粘性边缘和分组——立即生效。点击行会打开可调整大小的详情面板。列表通过针对 `IntersectionObserver` 的无限滚动分页进入，骨架行与表格自己的列网格对齐以代替进行中的批次，并为无结果和无数据路径提供空状态。工具栏在容器查询下换行到第二行，而不是视口查询，因此它响应详情面板留给它的宽度。

  使用 `Table - Filtering` 类别，该类别已在 `TemplateCategory` 联合类型中预留。

#### 修复

- `build`/`search` 不再将部分匹配的模板排在匹配每个术语的模板之上，不再将 TypeScript 泛型参数索引为渲染组件，也不再将其渲染组件的广度视为全强度相关性。 (#5614)
- 组件和 hook 名称在 macOS 和 Windows 上按大小写精确解析，与 Linux 一致 (#5478)
  `findComponentReadme`、`findComponentSource` 和 `findHookDoc` 使用 `fs.existsSync` 探测候选路径，该函数通过文件系统自己的大小写折叠来回答。在不区分大小写的文件系统上，`astryx component button` 会解析为 `Button`，而不是报告未知组件并提供建议，`findHookDoc(core, 'mediaquery')` 返回 `.../hooks/useMediaquery.doc.mjs`——一个在任何地方都不存在的拼写，会让在 Linux 上读取它的任何消费者出错。探测现在根据父目录的真实目录列表验证每个路径段，因此这些组件和 hook 查找在每个主机上都将相同的名称解析为相同的真实路径。有意的忽略大小写 hook 查找不变；它现在返回文件的真实大小写。

- 56 个 `--color-data-*` 默认值现在从同一来源到达运行时 CSS 和构建主题，而仪表板模板回退匹配这些默认值 (#5562, #5566)
  默认值一次位于 `@layer astryx-base` 的 `:root` 中，因此嵌套主题继承父覆盖，`astryx theme build` 匹配 `<Theme>`，而 `generateThemeCSS` 保持其现有返回形态。

  **视觉变化。** 以前不绘制任何内容或使用不匹配十六进制回退的图表或模板，现在会绘制数据 token 的默认值。固定显式颜色以保留以前的回退。

- theme-showcase 页面不再裁剪自己的控件。在商店的产品卡片中，数量字段和“Add to cart”按钮从卡片两侧溢出；在结账卡片中，卡号在数字中间被截断（`1234 1234 12`），国家选择器省略号，支付按钮只剩几个像素的余量。 (#5539)
  产品卡片行是两者中更显眼的。它没有自己的宽度——包围的堆栈居中而不是拉伸其子项——因此它按内容调整大小，并且由于居中，一旦内容超出，就会在两侧溢出卡片。当数量字段很窄时这保持隐藏，并在 `NumberInput` 迁移到 `type="text"` 进行格式化显示时浮现：文本输入默认的 `size=20` 使字段约为 200px 而不是约 65px，而模板用 `style` `minWidth`（下限，不是上限）加上 `flexShrink: 0` 固定它。该字段现在使用 `NumberInput` 的 `width` prop，这才是真正调整字段大小的东西，而行固定为卡片宽度并允许换行，因此按钮在窄卡片上落到自己的全宽行，而不是省略号。

  结账位于一个最小 200px 的网格轨道中，因此其宽度是恰好容纳的轨道数的分数——随着视口调整，它在 208px 和 328px 之间摆动，而窄端远低于表单所需。间距比例大的主题受害最深：Matcha 的 `--spacing-5` 卡片内边距仅这一项就花掉该预算的 60px。

  结账和聊天面板现在是可换行的 flex 行。它们在两个 flex 基准都能容纳时共享一行，比例约 1:2，然后聊天落到自己的全宽行，这使 300px 成为结账的下限，而不是轨道数量的偶然结果。提高轨道最小值反而会在中等宽度下在结账旁留下高高的空隙，因为双轨道行无法容纳双轨道跨度。

  两个较窄的修复随之而来，都是卡片破坏而不是适配的文本：支付方式网格的最小值从 70px 变为 80px，使“Google”在 Matcha 和 Y2K 上不再从单词中间断开；在手机上，卡片减少一个内边距步长，并去掉卡号的装饰性起始图标，这两者共同收回 16 位数字在 360px 下所需的空间。

#### 文档

- `useAnnounce`、`useTypeahead`、`useInteractiveRole`、`useLongPress`、`useInputStatusIcon`、`useDevWarning` 和 `useIndicatorFocusRing` 现在可被发现。CLI 的 hook 索引由每个 hook 旁的 `.doc.mjs` 文件构建，而这七个发布时没有；因此 `astryx hook <name>` 回答“No hook named”，`astryx hook` 省略它们，`astryx search` 从不返回它们，而包以完整的 TSDoc 导出它们。遵循文档发现工作流的 agent 得出这些原语不存在的结论并手写替代品；对于 `useAnnounce`，这意味着手工构建 `aria-live` 区域，通常根本不会宣告。现在，当 hook 从 barrel 导出但没有文档时测试会失败，因此索引不能再次悄悄过时。 (#5109)
- 重写全部 46 个页面模板描述，描述布局、容器、数据形态和行为——真正区分一个模板与其兄弟模板的东西——而不是它们恰好附带的示例数据，使 `build` 和 `search` 从问题描述而不是对 slug 的猜测中检索它们。 (#5615)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ernestt
- @rubyycheung

---

# 0.5.0

#### 破坏性变更

- Banner：折叠轴移到一个 `collapsible` prop 上，内容可以选择退出折叠 (#5255)
  Banner 从内容推断其披露：任何 `children` 都会在标题中获得一个尖括号，并在按下前隐藏。无法在不切换的情况下显示内容——这是横幅最常想要的情况，即列出验证失败的三个字段——而 `defaultIsExpanded` 是唯一的旋钮，没有受控模式。

  整个轴现在是一个 `boolean | CollapsibleConfig` prop，遵循 `SideNav.collapsible` 设定的布尔或配置约定，并由共享的 `useCollapsible` hook 支持，而不是 Banner 自己的状态：

  ```tsx
  <Banner status="error" title="3 fields need attention">…</Banner>  // unchanged: collapsible, starts closed
  <Banner collapsible={false}>…</Banner>                             // new: always visible, no toggle
  <Banner collapsible={{defaultIsOpen: true}}>…</Banner>             // replaces defaultIsExpanded
  <Banner collapsible={{isOpen, onOpenChange}}>…</Banner>            // new: controlled
  ```

  **默认值不变**——从未提及 `defaultIsExpanded` 的横幅行为与以前完全相同。破坏性部分是 prop 本身：`defaultIsExpanded` 被移除，改用配置，这在每个命名它的 JSX 调用点都是类型错误。

  **Codemod：** `npx astryx upgrade --codemod banner-collapsible-content`

  它将 `defaultIsExpanded` 重写为 `collapsible={{defaultIsOpen: true}}`，并丢弃 `defaultIsExpanded={false}`，因为现在这是默认值。从未设置该 prop 的横幅不受影响。

  **codemod 和编译器都会遗漏的一种情况：展开。** props 对象内的 `defaultIsExpanded` 超出转换范围。类型化位置的 props 对象仍会编译失败——但被展开的推断对象 `<Banner {...args} />` 不会，因为 TypeScript 不会对展开进行多余属性检查。该 prop 随后会漏到 DOM，横幅悄悄开始折叠。**运行 codemod 后 grep `defaultIsExpanded`**，并手动迁移任何展开位置。

#### 新组件

- 将 `Stepper` 和 `Step` 从仅在 canary 的 Lab 包提升到 Core。稳定包现在附带其现有的水平/垂直布局、分隔和轨道指示器、语义状态、密度和非线性导航，以及 Core 文档和渲染示例。默认 `aria-label` 现在已本地化。
  推进一个步骤现在会为连接线添加动画。四种布局绘制的每条连接线——分隔条和轨道段都一样——都会从该段的前缘长出强调色填充，而不是切换背景颜色，因此向前移动读作沿轨道行进的进度。这一个手势是唯一有动画的东西：后退、向前跳过一个以上步骤以及在流程中途挂载都会立即应用，`prefers-reduced-motion` 下的任何变化也一样。后退有意保持即时——反向运行相同的过渡会结束在缩短的强调色残段上，留在轨道上的残余读作未完成，而相同的曲线向前生长则读作已到达——多步骤跳转也是即时的，因为跳转是导航而不是进度，因此扫过跨越的段只会让用户干等他们要求跳过的旅程。当一个跨度由多个段绘制时（轨道布局在两个步骤之间拆分一个跨度，当内容槽位于它们之间时为三个），这些段取该跨度时间的相邻切片并线性运行，因此填充读作一条以恒定速度生长的线，而不是各部分轮流亮起。

  五项视觉修复随提升一起落地。水平步骤现在均匀划分轨道，而不是按自己的标签调整大小，因此无论步骤名称多长，每个进度段都是相同宽度。数字指示器从 20px 缩小到 16px，以匹配勾号、圆环和自定义图标指示器，因此步骤在完成时将数字替换为勾号时不再推动旁边的标签。步骤描述现在占据 16px 盒子而不是 24px——它以前继承页面的行框而不是应用自己的行距，在标签下方打开了 8px 的间隙。步骤的内容槽现在在每个密度下都与上方的标签齐平：该槽渲染在密度加过内边距的标签区域之外，因此它以前短了一个内边距。而带内容的垂直轨道步骤保持其连接线不中断——内容渲染在绘制线条的行下方，因此轨道以前会在任何带内容的步骤周围裂开 (#5201)。

#### 新功能

- AspectRatio：将 `ratio` 作为类级声明输出，而不是硬编码内联样式，因此比例可以响应式覆盖：StyleX 消费者通过 `xstyle` 传递 `aspect-ratio` 规则（包括在 `@media`/`@container` 条件下），普通 CSS/Tailwind 消费者从自己的无层规则覆盖 `aspect-ratio`，无论特异性如何都会击败 `astryx-base` 级联层。mixed-gallery 模板的主视觉现在在网格堆叠时通过单个元素上的一行覆盖从 3:1 切换为 3:2，取代了固定内联比例以前强制产生的重复主视觉标记 (#3883, closes #2798)
- CLI：`astryx theme targets` 列出一个组件或整个系统的每个组件主题化目标——`defineTheme` 键、它绘制的类，以及它接受的 props 和状态——带有 `--json` 供 lint 和审计脚本使用。`astryx theme --help` 现在指向组件覆盖，而不是读作构建工具菜单。列表和 `theme build` 的覆盖验证共享组件文档的同一个枚举，因此两者都不会与组件漂移 (#5115)。

#### 修复

- neutral 主题：将浅色模式的错误红色从 `#e33f4a` 加深到 `#c9303a`，使填充的 `Badge variant="error"` 标签通过 WCAG 2.1 AA。`#e33f4a` 上的白色为 4.14:1，徽章标签为 12px/字重 500，因此适用 4.5:1 的普通文本阈值，而不是 3:1 的大文本允许值；`#c9303a` 给出 5.29:1，同时保持色相（OKLCH H 21.9 -> 22.8，C 0.200 -> 0.189）。StatusDot 和 ProgressBar 的 `--color-error` 重新绑定随之移动——两者都有文档记录跟踪徽章填充，因此点和其徽章读作同一种状态语言。深色模式不受影响（`#ff705d` 上的深色文本，6.60:1）。新增 `scripts/check-badge-contrast.test.mjs`，它通过 `light-dark()`、`var()` 间接和 alpha 合成解析每个主题的徽章标签/填充对，并将它们全部保持在 4.5:1 (#4446)。
- 统一搜索和 build 现在包括集成贡献的组件，因此通过集成注册的组件可以与内置集合一起被找到和构建，而不是在两者中都悄悄缺失 (#5259)。
- Table - Grouped 页面模板：将行包裹在 `TableBody` 中
  模板将 `<TableRow>` 直接渲染到 `<Table>` 中，因此发出的 DOM 是 `<table><tr>`。`<table>` 不能直接包含行：HTML 解析器在解析服务器渲染标记时会插入隐含的 `<tbody>`，而 React 在客户端渲染时不会，因此任何将模板复制到应用中作为服务器渲染页面的人都会在自己的应用中继承水合不匹配。仅在客户端，DOM 仍然无效——没有任何东西重新定位行，因此表格最终带有 `<tr>` 子项而完全没有 `<tbody>`，任何针对 `tbody` 的 CSS 或查询都会静默错过。

  这些行现在位于 `<TableBody>` 中，与数据驱动 `data={...}` 路径渲染的元素相同，因此样式、分隔线和列宽不变 (#5278)。

#### 其他变更

- 公共组件主题化变量可枚举，并防止被记录但无法设置
  `collectThemingVars` 加入 `collectThemingTargets`，作为读取主题化表面的同一个枚举的一部分。有两个守卫随之而来：一个没有组件读取的已记录公共变量会编译为永远不适用的声明，而组件内联写入的变量会压过每个级联层，因此没有主题能到达它。两者都已发布；在 jsdom 套件断言的生成主题 CSS 中，两者都不可见 (#5409)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @AKnassa
- @andrskr
- @cixzhang
- @ernestt
- @freddymeta
- @jiunshinn
- @rubyycheung

---

# 0.4.7

---

# 0.4.6

#### 新功能

- 集成可以贡献参考文档主题：在 `astryx.integration.*` 中将 `docs` 指向一个根目录，其下的每个 `{topic}.doc.{ts,mjs,js}` 都会由 `astryx docs` 提供、由 `astryx search` 索引，并在 agent 文档块中命名，与内置主题并列。主题还可以声明 `replaces: '<topic>'` 来接管现有主题（重命名它会使旧名称作为别名解析），或 `extends: '<topic>'` 逐节合并到一个主题上。未声明任一者而发生名称冲突会成为 `invalid_doc` 问题，而不是静默覆盖，`validate-integration` 会报告它。 (#5311)
  还修复了 agent 文档块的主题列表，它扫描 `\w+`，因此静默丢弃每个带连字符的主题——`getting-started`、`cli-integrations`、`browser-support`、`styling-libraries` 和 `working-with-ai` 在所有已写入的块中都缺失，而 agent 无法询问从未告知它的主题。

- 五个仪表板页面模板：`dashboard-cohort-funnel`、`dashboard-data`、`dashboard-executive-summary`、`dashboard-project-status` 和 `dashboard-service-monitoring`。每个都是完整页面——布局、真实示例数据以及与数据形态相匹配的组件选择——因此 `astryx template <name>` 给你一些可编辑的内容，而不是空白框架 (#5245)。

#### 修复

- `component` 通过拼接包名和组件名来构建集成组件的导入说明符，这假设每个组件都从以其自身命名的子路径导出。组件通常分组在以概念命名的单个入口点后面，因此建议的导入指向包不导出的子路径而无法解析 (#4810)。
  说明符现在针对拥有包的 `exports` 映射解析，以组件文档文件所在目录为键，当该目录不是导出的子路径时回退到包根目录。文档文件为自己声明的说明符也不再被覆盖。

- 升级 codemod 在重命名元素标签时不再折叠有意义的 JSX 空白。在文本和 `{expression}` 旁重命名 `<OldName>`（例如 `hello {name} world`）以前会丢弃相邻空格（`hello {name}world`）；元素标签重命名现在拼接进输出，因此周围的 JSX 保持不变 (#5149)。
- XDS 前缀 codemod 不再生成无法编译的文件。去掉前缀会将 `XDSButton` 重命名为 `Button`，但如果文件已经有名为 `Button` 的本地绑定，重写会与它冲突并遮蔽两者之一。现在导入会改用别名，因此两者都保留，文件仍能通过类型检查 (#5225)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ejhammond
- @josephfarina
- @kentonquatman
- @rubyycheung

---

# 0.4.5

---

# 0.4.4

#### 新组件

- 将 `BottomSheet` 和 `BottomSheetSwitcher` 从仅限 canary 的 Lab 包提升至 Core。稳定包现在包含它们现有的原生对话框、拖拽吸附、过渡和移动键盘行为，以及 Core 文档和示例（#5080）。

#### 新功能

- `astryx template --cdn` 会写出一个可用的免构建 CDN 起始页（#5068）。
  CDN 起始页是一种模板，因此它加入模板家族，与 `--skeleton` 并列，而不是占用一个顶层命令。它采用标志形式而非位置参数 `astryx template cdn`，因为位置参数会针对 `discoverAll()` 找到的所有内容进行解析，其中 `cdn` id 会遮蔽某个已发现的模板。`cdn.template.html` 从 jsDelivr 和 esm.sh 加载 Astryx，无需打包器、无需安装、无需构建步骤，每个 CDN URL 都固定为你已安装的 Astryx 版本——未固定版本的 CDN URL 会解析为最新版本，并且会被强缓存，因此今天写好的页面明天就会在未编辑的情况下损坏。已有文件绝不会被覆盖；`--overwrite` 会替换它，`--json` 返回回执。

  这些标注是关键的，缺失时不会报错却会出问题：`?external=react,react-dom`（没有它，esm.sh 会打包第二份 React，每个 Hook 都会抛出 `Cannot read properties of null (reading 'useState')`）、导入映射中的 `react/jsx-runtime`（已发布的 bundle 会导入它；省略它会让页面报 `Failed to resolve module specifier` 而失败），以及 `body` 上的 `font-family`（样式表中没有任何内容设置文档字体，因此 `Button`——它是 `font: inherit`——否则会用浏览器默认的衬线字体渲染其标签）。

  在该模板上构建真实应用时又得到三条经验。页面现在通过 `<link>` 从 Google Fonts 加载主题的 webfont，因为主题只是 _声明_ 了 Figtree，却从不加载它，所以每位访问者都会静默地得到回退字体栈（又是 #5015）。它导入主题对象并包裹在 `<Theme theme={neutralTheme} mode="system">` 中，因此浅色和深色跟随操作系统——仅靠 `data-astryx-theme` 属性只能限定样式表作用域，无法切换模式。而 `#root:empty` 承载了“Loading…”状态，因为从 CDN 加载 ESM 有真实延迟，空白页面看起来就像坏了。标记使用 `htm`，并附注说明它是可选的，`createElement` 是无依赖的替代方案。

  只被阅读的配方只是被假定能用的配方，因此 CI 会实际渲染它：`.github/scripts/cdn-template-smoke-test.mjs` 用真实 CLI 搭建页面并在无头 Chromium 中打开，任何控制台错误、页面错误或失败请求，以及加载完成却未渲染的页面，都会导致失败。

- `astryx theme build` 可接受任意数量的主题文件——`astryx theme build themes/*.ts` 会在一个进程中编译它们全部，因此拥有多个主题的应用不再需要手写一个循环、为每个主题重新进入一次 CLI。输出与串行调用逐字节一致；遇到第一个失败时运行会停止，并指出失败的主题。CLI 的 Node 最低版本（>=22.13）现在声明在 `engines` 中，因此包管理器可以在安装时强制执行，而不是等到构建时才失败（#5121）。
- `defineTheme`：`color.accent` 接受 `[light, dark]` 元组（#2279）
  `ColorScaleConfig.accent` 现在接受单个十六进制值或 `[light, dark]` 元组，与 `TokenValue` 一致。使用元组时，`expandColorScale` 会从浅色种子的调色板派生每个生成的 `light-dark()` 对的浅色部分，并从深色种子派生深色部分，因此每种方案都会得到一致的派生调色板（muted、on-accent、中性色），而不是使用跳过色阶生成的 `tokens['--color-accent']` 变通方案。单一字符串配置保持不变，逐个 token 一致。还记录了 accent 派生值中 `color` 与 `tokens` 的优先级：`tokens` 条目逐个 token 优先，`var(--color-accent)` 引用 token 在运行时跟随 `--color-accent` 覆盖，而烘焙的 `--color-on-accent` 仍从 `color.accent` 种子派生。

#### 修复

- Bottom Sheet 展示块：筛选复选框恢复可交互（#5157）。
  `CheckboxInput` 是完全受控的——`value` 为必填，只有所有者更新它时输入才会变化。展示块传入字面量 `value={false}` 且没有 `onChange`，因此三个筛选器（“In stock”、“On sale”、“Free shipping”）虽然能渲染，却永远无法切换：在文档站点上，读者在 Bottom Sheet 中尝试的第一件事毫无反应，任何人复制该块都会继承三个失效的控件。现在每个筛选器都有自己的 `useState` 和 `onChange`，与 Bottom Sheet Switcher 展示块中已经使用的复选框接线方式一致。

- 清单加载失败的集成不再悄无声息。一个在导入时抛出异常的清单——常见情况是仍在调用 `create*` 编写工厂，而该工厂已在 0.3.0 中移除——不会贡献任何内容，而 CLI 却将其视为该包从未配置过：`astryx discover` 回答 `No integrations configured.`，尽管 `astryx.config.mjs` 明明配置了一个，而且没有任何命令给出提示。唯一能发现它的方式就是先怀疑它，再按名称运行 `validate-integration`。一个已配置的集成可能会对 CLI 发现过程不可见，导致应用团队得出其组件不存在的结论（#5119）。
  现在加载错误会计为集成问题，因此现有的一行 stderr 提醒会在 `component`、`template` 和 `upgrade` 上触发，而 `discover`——整个职责就是列出集成的命令——也会提醒，`search` 同样如此。`discover` 也不再对配置了加载失败集成的项目报告 `configured: false`；空状态现在区分“你没有配置任何内容”和“你配置的内容没有贡献任何内容”，这正是引入 `meta.configured` 所要承载的区别。

  一切都不会变成致命错误：该警告是尽力而为的、仅输出到 stderr、在 `--json` 下被抑制，并且从不改变退出码。损坏的贡献仍和以前一样被跳过。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @imdreamrunner
- @jiunshinn

---

# 0.4.3

#### 修复

- 未加载字体提示是一项通知，而不是警告。主题文件无法加载字体——Astryx 只设置 `--font-family-*`，加载字体是应用的职责——因此 #5045 的提示会在任何声明 webfont 的主题上触发，包括完全正确的主题。作为警告，它让一次干净的构建看起来有缺陷，还让随附模板永久违反其自身的“编译时无警告”守卫（#5079 不得不在该断言中把模板的两个字体名加入允许列表）。
  `theme.build` 回执现在将两者分开：`warnings` 是作者应修复的缺陷，`notices` 是关于正确主题的提示。字体提示移入 `notices`，并与其他构建进度一起输出到 stdout；stderr 保留给缺陷。模板守卫恢复为要求 `warnings` 为空，并且不再需要知道模板声明了哪些字体。

  读取 `data.warnings` 以获取字体提示的编程调用方应改为读取 `data.notices`；消息文本不变。

- `extends` 现在能到达 CSS。一个扩展了另一主题的主题，构建出的样式表只包含它自己声明的声明：基础主题的 token、组件覆盖和表面规则全都缺失；而且由于每个主题都用 `@scope` 限定到自己的 `data-astryx-theme` 值，同时加载基础主题的样式表也无法填补空缺。继承链的每个消费者都悄然得到了原版的几何、高度和字体，只是在其上涂了一层新调色板（#5067）。没有任何警告；只有逐个 token 对比两个生成的样式表才能发现这种损失。
  原因是 `theme build` 遮蔽了自己的输入。它把 `<name>.js` 写在 `<name>.ts` 旁边，而加载器在源码之前把普通的 `./<name>` 说明符解析到那个生成产物——因此一个家族的第二次构建读取的是该产物，它不携带 `components`，导出的也是 `<name>Theme`，而不是源码所导出的内容。未命中的命名导入变成了 `extends: undefined`，而 `defineTheme` 将缺失的基础主题视为根本没有基础主题。加载器现在优先解析源码扩展名，这也是作者的 TypeScript 所看到的解析方式，因此构建输出的 CSS 与通过类型检查的主题一致。

  其背后的三件事也已修复，因此该故障无法从其他途径再次出现。当 `extends` 存在但不是主题时，`defineTheme` 会 **抛出异常**，并指出可能的原因，而不是什么都不继承——这是此处唯一的行为变更，它把一张静默的样式表变成了构建错误。主题的 `onDark`/`onLight` 表面及其 `__inputTokens` 现在像其 token 和组件一样被继承，因此子主题不再将基础主题的反色表面自定义恢复为默认值，也不会丢失其 `[light, dark]` 元组。构建出的主题模块现在也会在 token 旁边携带解析后的 `components` 和表面，因此扩展其中一个——每个随附主题都暴露的 `./built` 子路径——不再有损。`theme build` 在重新解析纯对象主题文件时也不再手动挑选字段，此前这一过程会在输入时丢弃 `extends`、`color` 和 `syntax`。

  扩展后的主题是扁平的：它继承的所有内容都会解析到自己的输出中，其样式表独立存在。在一个 14 主题家族（一个基础主题，13 个扩展现）上测量：每个调色板从 25 个自定义属性和零条组件规则，变为基础主题完整的 175 个属性和 70 条规则，同时自己的颜色仍然胜出。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang

---

# 0.4.2

#### 新功能

- 当主题声明了未加载的字体时，`astryx theme build` 会发出警告。解析后的 `--font-family-*` token 和组件覆盖的 `fontFamily` 值会与 CSS 通用字体族和已知系统字体族核对；其他任何字体都会在回执中为每个字体族产生一条警告，并在安装说明之后给出应添加的 `<link>`/`@font-face` 片段。`astryx docs typography` 新增“Loading Custom Fonts”一节（Google Fonts 和自托管配方、`font-display: swap`、真实的回退字体栈），主题文档的生产构建一节也指向该节（#5015）。
- `astryx theme template` 会向你的项目写入一个带注释的主题模板（#5048）。
  `theme add` 的新兄弟命令：`add` 从我们随附的主题开始，而 `template` 从空白的带注释主题开始。`astryx init --features theme` 调用同一个叶子实现，因此项目设置也会写入它——此前它只打印一行提示而不写入任何内容，这是主题作者所需帮助中最弱的一种形式，因为第一个问题不是不知道命令，而是不知道主题表面包含什么。文件为 `theme.template.ts`：每个 `defineTheme` 字段都附有何时使用它的说明、token 家族、组件覆盖语法以及使用步骤（提供主题、加载你声明的字体、为 SSR 构建），每一节都指明打印其权威参考的 CLI 命令。已有文件绝不会被覆盖。

  这来自一次 vibe 测试（#5047）：获得带注释模板的 agent 深入到主题表面的程度是仅获得文档的 agent 的两倍（17 个组件目标对 8 个，而且是唯一使用交互状态、自定义变体和 `onDark` 的一组），并且交付的对比度缺陷只有三分之一。

  说谎的模板比没有模板更糟，因此它的声明会针对实时源码进行机器检查，而不是被信任：当新增了 `defineTheme` 字段却没有文档、token 家族从清单中缺失、它提到的某个 CSS 变量或组件键不存在、引用了不存在的文档主题，或主题源丢弃其 SYNC 引用时，`scripts/check-theme-template.test.mjs` 都会失败。`theme build` 在 CI 中无警告地编译它，CLI 的类型检查现在也覆盖它。

#### 修复

- Heading 的 `type` 是有文档记录的主题化目标，文档不再教授一个不存在的 CSS 变量（#5016）。
  `Heading` 将 `type` 反映为主题选择器——`typography.scale` 会为它生成 `heading: {'type:display-1' …}` 规则——但 `theming.targets` 只列出了 `level` 和 `color`，因此 `astryx theme build` 会在每个设置字体排印比例的主题上警告 `Unknown prop "type" on component "heading"`，包括随附的 `neutralTheme`。漂移守卫两次漏掉了它：它把条件展开（`{level, color, ...(type && {type})}`）读成了未知的包，而且它只用组件自己目录中的文档文件来检查组件，因此 `Heading/`——由 `Text/Text.doc.mjs` 提供文档——根本没被检查过。两者都已修复，这也让另外三个此前未检查的目录纳入了守卫范围。

  另外，主题文档的组件覆盖示例设置了 `--button-press-scale`，但没有任何组件定义它：复制它会产生静默地永不生效的 CSS。现在它设置一个真实的公共变量，示例也不再两次声明同一个 `button` 键。

- 两个守卫因各自的落地而留在 `main` 上失败，因此此后每个 PR 都无辜地变红。#4963 给 Thumbnail 的移除按钮添加了一个粗略指针命中区域变量却没有记录它，派生变量守卫将其视为未记录的私有变量；该变量是 `::after` 覆盖层上的 `inset`，因此被记录为私有变量，并与其他无法映射到标准 CSS 属性的变量一起列出。#5026 将 `borderDefaults` 移入 `CoreTokenName`——这正是主题模板守卫明确等待的落地（其注释写着“当 #5017 落地后，此守卫开始要求模板覆盖它”）——因此模板的 token 清单现在列出了 `--border-width`。

#### 文档

- MobileNavToggle 预览模拟移动端 AppShell，而不是空白舞台：新增 playground.appShellMobile，用于在没有 AppShell 移动上下文时不会渲染任何内容的组件（#4983）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang

---

# 0.4.1

#### 修复

- `astryx theme build` 不再对已记录的状态覆盖键警告 `Unknown prop`。组件文档在 `theming.targets[].states` 下声明由状态驱动的选择器（`radio` → `checked`/`disabled`，`calendar-day` → `today`/`selected`，……），但覆盖验证只加载了 `visualProps`，因此 Theming Infrastructure wiki 中记录的状态语法——`components: {radio: {checked: {...}}}`——会在每次构建时警告。CSS 一直生成正确；只是警告错了。核心中共有 30 个目标受影响（#4778）。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang

---

# 0.4.0

#### 破坏性变更

- DropdownMenu 的两种条目模式再次成为对等模式。复合模式新增 `DropdownMenuDivider` 组件（别名为 `ContextMenuDivider` 和 `BreadcrumbMenuDivider`），数据路径也会渲染它，因此 `{type: 'divider'}` 和 `<DropdownMenuDivider />` 会产生相同的 DOM、间距和主题目标。数据模式新增 `endContent` 和 `description`，因此 `items` 行可以携带快捷键提示或辅助文本，而不必降级到复合模式。其 `label` 从 `string` 拓宽为 `ReactNode`，与复合模式一致：此前的收窄只是因为行以 label 为键，而现在不再如此（#4953）。
  裸名称现在属于这些组件，因此数据模式的选项类型采用其兄弟 `DropdownMenuItemData` 已经携带的 `Data` 后缀：`DropdownMenuDivider` → `DropdownMenuDividerData`，`ContextMenuDivider` → `ContextMenuDividerData`，`BreadcrumbMenuDivider` → `BreadcrumbMenuDividerData`。TypeScript 无法从单个 barrel 中用同一个名称重新导出值和类型，因此这次重命名才使组件能够被导出。运行 `astryx upgrade --apply` 来重写类型导入；漏掉的导入会在编译时失败，而不是静默失败。

#### 新功能

- 添加 `migrate-table-rowexpansion-to-tree` codemod（在 `astryx upgrade` 中运行）：将已移除的 `useTableRowExpansionState` 树模式重写为 `useTableTreeState` + `useTableTreeData`。详情面板用法（`renderExpanded`）保持不变。（#4884）
- 为 CLI 添加自文档层：每个命令、每个 `@astryxdesign/cli/api` 函数以及每个编写的 schema（config、integration、codemod、响应信封以及 doc-types 本身）都有类型化、同目录的 `.doc.mjs`。新增 `FunctionDoc`、`SchemaDoc`、`CommandDoc` 和 `EnumDoc` 编写类型，并带有密封的解析器。（#4714）
  每个命令的 `--help` 及其 `astryx manifest` 条目现在都通过 `defineCommand` 转换器从该命令同目录的 `CommandDoc` 构建，因此文档和 CLI 不再可能描述不同的事物。迁移保持行为不变：帮助文本、命令输出、错误路径和退出码逐字节一致。

  CLI README 的命令表、错误码表和响应类型表现在由 manifest 和 `EnumDoc` 生成，纠正了真实的漂移——错误码表列出了两个不存在的代码，并遗漏了若干确实存在的代码，命令表则缺少 `blog`、`build`、`layout` 和 `validate-integration`。

  由漂移测试工具（文档 vs 实时 CLI）、`check:cli-structure`（每个 doc-type 和 `api/` 叶子都发布其完整文件集）以及 CLI 分层 lint 规则保持诚实。

- 添加可主题化的指示器——组件化的勾选、复选框和单选视觉。`defineTheme({indicators: {check: RadioIndicator}})` 按名称替换一个指示器，所有绘制它的组件都会跟随。（#4712）
  主题目标现在遵循组件名约定：`checkbox-indicator`、`radio-indicator`、`radio-indicator-dot`。旧名称（`checkbox`、`radio`、`radio-dot`）仍会在同一元素上输出，以便现有主题继续工作。新主题应使用规范名称；弃用不设定自动移除期限。

  迁移：菜单单选框现在使用这些共享目标。`dropdown-menu-radio-dot` 已被移除——请使用目标 `radio-indicator-dot`；`astryx upgrade` 会为你重写。

#### 修复

- 生成的 agent 速查表硬编码了 shell 建议（“Full page → AppShell；sidebar nav → SideNav”，“pick the shell (AppShell / Layout+LayoutPanel)”），这回答了一个取决于应用原型的问题，并重复了 `astryx docs layout` 已经维护的指导。这两条布局规则现在改为将 agent 引导到该文档，因此 shell 选择、区域预算和响应式契约有了单一事实来源。（#4772）
  该规则引用命令而不是文档站点 URL，采用该块既定的 `astryx <cmd>` 形式，其头部会映射到项目的真实调用方式（`pnpm exec astryx`、`npx @astryxdesign/cli` 等）。`astryx docs` 读取已安装版本内的文档，因此 agent 不会看到该发行版不存在的 API。

- 当 `<Grid>` 同时具有 `columns` 和 `minChildWidth` 时，`migrate-grid-minchildwidth-to-columns` codemod 会不做任何更改而退出，留下现在无效的 `minChildWidth` prop，并在 0.3.0 上导致类型检查失败。（#4792）
  当 `columns` 是数字字面量时，它现在会无损地迁移到 0.3.0 的对象形式。这镜像了旧的（0.2.0）Grid 运行时：其中 `minChildWidth` 占主导，数字 `columns` 在 `auto-fit` 下限制了列数：`<Grid columns={3} minChildWidth={280}>` 变为 `<Grid columns={{minWidth: 280, max: 3, repeat: 'fit'}}>`。对象或动态的 `columns` 值仍会有意退出。

- 文档中的 `hook` 示例引用了 `useToggle`，而它不是设计系统中的 Hook——运行它会失败并报 `ERR_UNKNOWN_HOOK`。现在它使用 `useFocusTrap`。（#4742）
  该示例出现在消费者可见的两个地方：`astryx manifest --json`（agent 通过它了解 CLI）以及为 `--help` 提供内容的 `hook` CommandDoc。两处都已替换。

- CLI 内部：一个真正的 `foundation/` 底层，以及生成的 `./authoring` 类型（#4736）。
  `foundation/` 不再导入 `api/`，ESLint 现在与现有的 `authoring/` 和 `api/` 规则一起强制执行该方向。此前有两处向上引用：`Project` 从 `api/template` 拉取模板发现逻辑，而该模块的适配器又直接导入 `Project`；同时 `Project` 和 `integration-warnings` 都从 `validate-integration` 命令导入 `validateLoadedIntegration`。这两处都不是逻辑放错位置，只是文件放错了——适配器现在位于 `foundation/discovery/template-adapter.mjs`，验证器位于 `foundation/integrations/validate-contributions.mjs`。确切地说：`Project` 和模板适配器仍然相互导入，因此该模块循环仍然存在，但被限制在 foundation 内部，而不是跨越两个层。行为保持不变——CLI 的可观察表面在 84 次调用中逐字节一致。

  已发布的 `./authoring` 类型声明现在从 JSDoc 生成，而不是手写，就像 `./api` 已经那样。13 个手工维护的 `.d.mts` 文件已删除；`scripts/sync-api-types.mjs` 在 `prepack` 时生成两棵目录树，并标记 `@generated`。手写声明会遮蔽其 `.mjs` 中的 JSDoc，因此可能与实现不一致却仍能编译——而且两种失败模式都已发生过：缺失的声明使严格消费者将该解析器解析为 `any`，而过时的 `parseDoc` 返回联合类型则静默丢弃了 `SchemaDoc`、`CommandDoc` 和 `EnumDoc`。还修复了 `parseFunction`，它是对 `parseHook` 的裸重新导出，发布的是 `HookDoc` 而不是通用的 `FunctionDoc`。

- 为引用演示视频（例如 `LightboxVideo`）的模板搭建脚手架时，不再将视频源替换为图片占位符 data URI，因为生成的 `<video>` 元素无法播放它。`stripTemplateAssetRefs()` 无论扩展名如何都会把每个演示媒体引用当作图片；视频扩展名（`.mp4`、`.webm`、`.mov`、`.ogv`）现在会被剥离为空 `src`——视频没有等效的自包含内联占位符，因此搭建出的示例会如实说明需要构建者提供自己的文件，而不是指向无法播放的内容。（#4863）
- Stepper 模板：搭建出的 Stepper 块获得了组件审计带来的无障碍、主题化和响应式标签加固，其文档块与渲染内容一致（#4917）。
- cli：添加 `theme build --icons-specifier`，以便可以完整指定生成模块的图标导入（#4620）
  生成的主题模块导入图标注册表而不是内联它，因为注册表包含 React 元素。`astryx theme build` 从 TypeScript 源码中提取该说明符并逐字输出，因此 `./icons`——在 TypeScript 中有效、在 ESM 中无效——进入了生成的 `.js`。于是每个已发布主题的 `/built` 入口在 Node 中都加载失败，包括在 Vite SSR 和 Next.js Pages Router 下，而打包器通过猜测扩展名掩盖了它。

  没有单一扩展名是正确的：同一个源码经 tsup 编译后，在没有 `"type"` 字段的包中落到 `icons.mjs`，在有 `"type": "module"` 的包中落到 `icons.js`，而生成器在产生其中任何一个的编译步骤之前运行。调用方知道答案；现在它可以说明。不传该标志时说明符原样输出，因此默认的无 `--out` 流程——邻居是未编译的 `icons.tsx`，只有打包器能解析它——不受影响。

  七个主题包现在在其构建脚本中声明 `--icons-specifier ./icons.mjs`。

#### 其他变更

- 搭建出的登录页使用 `Center` 的 `padding` prop，而不是手写的 `var(--spacing-6)` 样式对象（#4764）。
- 将模板演示图像自托管在仓库中，而不是流式传输（#3973）
  从内部 `lookaside.facebook.com` CDN。

- 模板演示图像现在提交在
  `apps/docsite/public/template-assets/` 下，并通过根相对路径 `/template-assets/*` 引用（此前是 Meta 内部 CDN URL，外部贡献者不可见）。

- `stripTemplateAssetRefs` 在搭建脚手架时仍会将这些路径替换为内联 `data:` URI
  占位符，因此生成的项目无需任何设置即可渲染，也没有网络依赖——生成的脚手架项目中绝不会复制任何图像。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @ernestt
- @HelloOjasMutreja
- @humbertovirtudes
- @imdreamrunner
- @jiunshinn
- @josephfarina

---

# 0.3.0

#### 破坏性变更

- CLI——编写功能整合到单一入口 `@astryxdesign/cli/authoring`，它只暴露类型（作者编写的普通对象）和解析器（CLI 的加载边界验证器）。Zod 密封在每个解析器内部，永不导出。
- 从 core 和 CLI 移除长期弃用的兼容 API。先运行 `astryx upgrade` 来迁移编写导入、Dialog 逻辑位置、Switch 标签间距和 Table 根 prop 的支持替代方案。

#### 新功能

- CLI 的人类可读（非 `--json`）输出现在通过一个小型、有文档的格式化工具集渲染：一致、纯 ASCII 的 `key: value` 记录/小节，镜像 `--json` 并可按字段 grep。每个命令都已迁移到它（lint 规则使输出汇集到单一 `emit` 接收器），`astryx --help` 记录了输出契约。`--json` 输出不变。（#4686）
- `defineTheme`：让 `color.accent` 变为可选（#2279）
  主题现在可以在不采用 accent 的情况下重新设计中性色阶（`neutralStyle`、`contrast`）。无 accent 的配置会从默认 accent 的色相为中性调色板播种，但不生成 `--color-accent`、`--color-accent-muted` 和 `--color-on-accent`，因此它们会落到 token 默认值——这与 `expandColorScale` 已对 status、categorical 和 on-dark token 应用的落下行为相同。传入 accent 的配置保持不变，逐个 token 一致。

#### 修复

- theme build：生成的自定义 Button 变体现在能通过公共 `@astryxdesign/core/Button` 子路径进行类型检查。
- 从 v0.1.0 升级 codemod（module-specifiers、css-surfaces 和 declare-module）中移除 `@xds/theme-default` → `@astryxdesign/theme-neutral` 的合并。`theme-default` 在 v0.1.0 范围迁移时被丢弃，因此没有 v0.1.x 消费者导入过它——该合并是死代码，可能重写无关源码（包括 `@xds/theme-default/theme.css` CSS 导入），指向应用从未声明过的 `@astryxdesign/theme-neutral` 包。`@xds/theme-daily` → `theme-neutral` 的合并（及其 `defaultTheme` → `neutralTheme` 导出重映射）不变。
- cli——限制用户控制的文件路径，关闭 DoS 向量，并修复因编写功能重组而损坏的路径（#4637）
- cli 加固——在 API 层验证输入，关闭路径安全漏洞，并防止 agent 文档内容丢失。API 是公共表面（`@astryxdesign/cli/api`），因此只存在于 CLI 包装器中的守卫被推入 API。
  路径安全（所有写入命令都依赖的守卫）：

- cli——将 `search`/`build` 的 verbose 标志重命名为 `--verbose`，重新同步捆绑主题，并修复 `unwrap-authoring-factories` 的边界情况（#4639）
- `astryx doctor` 的 peer 依赖检查现在能感知版本并正确命名作用域包。修复了两个问题：(1) 安装提示使用 `name.split('@')[0]` 构建，对于 `@stylexjs/stylex` 这样的作用域 peer 会返回空字符串，打印出没有包名的裸 `npm install `；(2) 检查只验证 peer 是 _存在_ 的，而不验证其已安装版本是否满足声明的范围——因此超出范围的版本（例如 `@stylexjs/stylex@0.10.1` 对 `^0.19.0` peer）会被报告为满足。检查现在会标记超出范围的 peer，其修复会固定所需范围，例如 `npm install @stylexjs/stylex@^0.19.0`。
- theme build：从有文档的主题化目标验证组件覆盖键，使 Chat 气泡和 SideNav 条目等子目标不再警告为未知。
- `astryx theme build`：带连字符的组件覆盖键现在能解析其内置 visual-prop 值，且 `KNOWN_COMPONENTS` 的 prop 列表与每个组件渲染的内容一致（#4109）
  `loadKnownValues` 仅从目录名中剥离非字母来将主题键映射到其核心组件目录，因此带连字符的键（`text-input`、`dropdown-menu`、`app-shell` 等）永远无法匹配其 `TextInput`/`DropdownMenu`/`AppShell` 目录，内置 prop 值就被静默丢弃。现在它会先剥离两边的非字母再比较，因此带连字符的键可以解析。`KNOWN_COMPONENTS` 的 visual-prop 列表也已同步到每个组件的 `theming.targets[].visualProps`（例如 `text-input`/`date-input`/`number-input`/`time-input`：`size`、`status`；`side-nav`：`mode`；`aspect-ratio`：`shape`），纠正了过时/为空的条目。

#### 文档

- 记录核心 codemod 暂存工作流，并添加发布时自动化，将 `transforms/next` codemod 提升到已解析的发行版本文件夹。
- 记录 `@astryxdesign/core` 的 StyleX peer 依赖——在两个 README 的 Getting Started / Quick Start 安装命令中添加 `@stylexjs/stylex`，并添加 `astryx init` 后续步骤提醒，确保满足 `@stylexjs/stylex` peer 依赖，并指向 `astryx doctor`。StyleX 是每个组件都调用的样式运行时，并非所有包管理器都会自动安装 peer。
- 在用户可能查看的每个地方（根 README、core README、文档站点首屏和 CLI 入门指南）展示 React 19 peer 依赖要求，并添加同步测试，确保这些表面始终使用与 core peer 范围相同的 React 主版本号。

#### 其他变更

- **`create*` 工厂已被移除**（`createConfig`、`createIntegration`、`createComponentDoc`、`createFunctionDoc`、`createDoc`、`createPageTemplate`、`createBlockTemplate`、`createCodemod`、`createConfigCodemod`）。编写普通对象并直接标记其 `type`（`{type: 'component', ...}`、`{type: 'page', ...}`、`{type: 'code', ...}`）；config 和 integration 清单是没有判别字段的普通对象。
- **从 `@astryxdesign/cli/authoring` 导入编写类型**——文档类型 `ComponentDoc`、`HookDoc`、`ReferenceDoc`、`TemplateDoc`，以及项目文件类型 `AstryxConfig`、`AstryxIntegration`、`AstryxCodemod`。旧的分离表面（`@astryxdesign/cli/{config,doc,integration,template,codemod}` 以及 `@astryxdesign/core` 的编写导出）已被取代。
- **文档字段类型重命名为明确的、带领域前缀的名称**，以便表面清晰易读：`PropDoc → ComponentPropDoc`、`ThemingTarget → ComponentThemingTarget`、`ComponentVar → ComponentThemingVar`、`DerivedVar → ComponentThemingDerivedVar`、`ElementDescriptor → ComponentSlotElement`、`GroupDoc → ComponentGroupDoc`、`TranslationDoc → ComponentTranslationDoc`、`ExampleDoc/AnatomyElement/BestPractice/PlaygroundConfig → Component*`，以及 `ContentBlock/TokenPreviewType → Reference*`。可编写的入口类型（`ComponentDoc`/`HookDoc`/`ReferenceDoc`/`TemplateDoc`）不变。
- **`astryx upgrade` 会自动为你迁移。** 此版本包含三个 codemod：`unwrap-authoring-factories` 将每个 `create*` 调用重写为带标记的普通对象，`migrate-authoring-imports` 将导入说明符重新指向 `@astryxdesign/cli/authoring`，`rename-authoring-doctypes` 应用文档字段类型重命名（导入、类型引用和 JSDoc `@type` 引用）。
- CLI——公共 `@astryxdesign/cli/api` 类型表面现在从运行时 JSDoc 生成，可注入的 logger 整合为一个 `Logger`。
  对 `@astryxdesign/cli/api` 的消费者可见变更（仅类型——运行时导入不变）：

- **精确的返回类型。** `component`、`docs`、`blog`、`discover`、`build`、`swizzle`、`upgrade`、`init` 和 `themeBuild` 此前解析为 `Promise<any>`；现在返回其精确的 `{ type, data }` 响应联合。依赖 `any` 的代码可能会浮现新的（正确的）类型错误。
- **响应类型现在按名称导出**——例如 `ComponentDetailResponse`、`SearchResponse`、`UpgradeRunResponse`——以及 `themeAdd`/`themeList`/`listThemes` 和新的共享 `logger` 值 + `Logger` 类型。
- **破坏性：** 每命令返回联合别名 `ComponentResult`、`DiscoverResult`、`DocsResult`、`HookResult` 和 `TemplateResult` 不再导出。使用 `Awaited<ReturnType<typeof component>>`（仍然有效），或直接导入成员响应类型。
- `theme build --out`/`<file>`、`validate-integration` 清单根（`components`/`templates`/`codemods`）以及 `layout --file` 现在都用 `assertWithin` 限制。逃逸的集成根会报告验证问题，而不是导入并执行包外的文件；`layout --file` 还限制大小（5 MB）并拒绝非文件，因此像 `/dev/zero` 这样的流无法耗尽内存。
- 模糊匹配（Levenshtein）、布局值解析器和布局展开器都增加了边界——超长搜索查询、深度嵌套的属性值和巨大的重复次数（`Box*999999999`）不再能空转 CPU、耗尽堆栈或耗尽堆内存。
- 文档主题查找使用空原型映射，因此 `__proto__`/`constructor` 作为主题名无法绕过未知主题守卫。随附的入门文档和沙箱注册表生成器再次指向当前 CLI 源码路径（两者都在编写功能重组中损坏）。
- `assertWithin` 现在会规范化符号链接（最深层已存在祖先的 realpath）——项目根内指向外部的符号链接不再能让写入逃逸。还会拒绝路径中的 NUL 字节。这关闭了所有通过该守卫写入的命令（swizzle/template/upgrade/theme/layout/agent-docs）的逃逸途径。
- `search()`：非正/非整数 `limit`、空查询、未知 `--type` → `ERR_INVALID_ARGUMENT`（此前 `limit: 0` 会返回完整未限制的集合）。
- `swizzle()`：组件名会被清理，因此 `..`/分隔符无法逃出 `--output` 基目录。
- `swizzle()` 导入重写：动态 `import('../Sibling/…')` 现在会被重写（此前会指向输出目录中不存在的兄弟文件）；向上两级的资源导入（`../../locales/x.json`）映射到导出的子路径，而不是无效的 `<pkg>/..`；`../theme/tokens.stylex` 保留其完整子路径（StyleX 编译器需要专用的 `./theme/tokens.stylex` 导出——将其折叠为 `<pkg>/theme` 会破坏 StyleX 解析）。不是子路径导出的组件本地 `.stylex` 文件仍保持可用的 barrel 折叠。
- `template()` 复制：没有 `overwrite: true` 时拒绝覆盖（`ERR_FILE_EXISTS`）；新增 `overwrite` 选项。
- `upgrade()`：`--path` 扫描目录限制在 cwd 内（`--apply` 会就地重写文件）。
- `init()`：模板脚手架拒绝覆盖现有的 `page.tsx`（`ERR_FILE_EXISTS`）；未知 `--agent` 现在抛出 `ERR_UNKNOWN_AGENT`（此前会被静默忽略）。
- `layout`：拒绝未知 `--form`（`ERR_INVALID_OPTION`）和空表达式（`ERR_INVALID_ARGUMENT`）。
- `layout expand`：包含 `<`、`>`、`{` 或 `}` 的文本载荷（例如 `Text"5 < 3"`）会作为 JSX 字符串表达式子节点输出，因此生成的 TSX 有效——此前它们会产生语法损坏的输出。
- `layout expand`：展开为多个兄弟元素的顶层 repeat 或 group（`B"x"*3`、`(B"a" + B"b")`、outline `repeat` 块）现在会被包裹在 fragment 中——此前生成的 TSX 有相邻的根元素而没有父级，无法编译（包装决策计算的是 AST 根而不是展开后的元素）。
- `layout`（expand/check）：空表达式现在会报 `ERR_MISSING_ARGUMENT`，缺失的 `--file` 会报 `ERR_FILE_NOT_FOUND`（此前是通用的 `ERR_UNKNOWN` / 原始 `ENOENT` errno，人类可读模式下还会泄漏堆栈）。
- `layout` 解析器：病态深度的紧凑表达式（`V > …` 嵌套超过 512 层）会被拒绝并给出带位置的 `ERR_LAYOUT_PARSE`，而不是耗尽调用栈并暴露原始 `RangeError`（→ `ERR_UNKNOWN`）。
- `layout check --form …` 打印器：包含引号的字符串（例如 Button `label="Don't panic"`）现在可以往返——打印器会选择字符串中不存在的定界符，而不是总是使用单引号，因此输出的 compact/outline 表面可以重新解析（此前会产生无法解析的 token）。
- `resolveTheme`：package.json 中非字符串的 `astryx.theme`（数字/数组/对象/布尔值）会降级为 null，而不是让 `astryx component` 以原始 `TypeError` 崩溃（与空字符串/未知 slug 路径一致）。
- `jsonOut`：在标记输出已处理之前先序列化信封，因此如果命令返回不可序列化的 `data`（循环引用 / BigInt——作者 bug），bin 错误边界仍会输出 JSON 错误信封，而不是让 `--json` 消费者面对空 stdout。
- 包扫描器：依赖的 `astryx.docs` 如果是非字符串（数字/数组）会被跳过，而不是以原始 `TypeError` 让整个扫描崩溃；逃逸自身包目录的 `docs` 路径会被跳过，而不是暴露外部文档；非字符串的包 `name` 会被强制转换为字符串。
- `component --package <pkg> --showcase`/`--blocks`：路由到正确的叶子，而不是回退到 `component.detail`。
- `discover`/`docs` 叶子：空查询/节会报错，而不是通过 `.includes('')` 匹配所有内容。
- `docs()`/`discover()`：非字符串的 `topic`/`section`/`query` 现在会抛出带稳定代码的错误（`ERR_UNKNOWN_TOPIC` / `ERR_UNKNOWN_SECTION` / `ERR_INVALID_ARGUMENT`），而不是 CLI 降级为 `ERR_UNKNOWN` 的原始 `TypeError`（与 `component`/`hook` 的非字符串守卫一致）。
- `blog()` 详情：非字符串 slug 抛出 `ERR_INVALID_ARGUMENT`（此前是 CLI 降级为 `ERR_UNKNOWN` 的原始 `TypeError`），并在任何网络请求之前快速失败。
- `hook()`/`component()` 分发器：非字符串的 `name` 或 `category` 会抛出带代码的错误（`ERR_UNKNOWN_HOOK` / `ERR_UNKNOWN_COMPONENT` / `ERR_UNKNOWN_CATEGORY`），而不是叶子的 `.toLowerCase()`/`.replace(...)` 抛出的没有 `.code` 的原始 `TypeError`。
- `theme add`：目标目录的祖先为文件时，写入失败现在会报 `ERR_WRITE_FAILED`（`mkdir` 被移入写入 try/catch 内），而不是泄漏原始 fs errno（`EEXIST`/`ENOTDIR`）+ 绝对路径。
- `validate-integration`：路径不安全的 `[package]` 规范（`..`/绝对路径）会被报告为 `invalid_package_spec` 诊断，而不是以原始堆栈崩溃（人类可读）/ 通用 `ERR_UNKNOWN`（`--json`）。
- `doctor`：当多个 `astryx.config.*` 文件共存时不再崩溃（人类可读模式下原始堆栈 / `--json` 下 `ERR_UNKNOWN`）——它会报告 `config` FAIL。版本对齐在任一版本不是可比较的 semver（例如 `workspace:*`）时会跳过（info），而不是产生带有 `NaN.undefined.x` 修复的虚假漂移 WARN。
- `manifest`：子命令按名称排序（与顶层命令列表相同的稳定性保证），因此重新排列 `.command()` 调用不会静默改变面向 agent 的 manifest。
- `build`：CLI 包装器现在会将 API 的错误 `code` 传播到 `--json` 信封（错误的 `--type` / 非正 / 非整数 `--limit` → `ERR_INVALID_ARGUMENT`，而不是通用的 `ERR_UNKNOWN`），并将 `--limit` 验证委托给 API（与 `search` 一致）。
- `layout check`：在 `--json` 和人类可读模式下，无效（但可解析）的布局都会退出码 `1`——退出码不再取决于输出模式，因此它可以作为 CI 门禁 / agent 检查而无需解析 stdout。
- `upgrade` 配置 codemod：`findConfigPath` 抛出异常（多个 `astryx.config.*` 文件）时会作为结构化的每个 codemod 错误呈现，而不是让整个升级运行崩溃——配置 codemod 在严格加载器之前运行，因此这恢复了其他所有失败路径都遵守的每 codemod 隔离。
- CLI 分发：多余保险的 postAction“completed without emitting an envelope”错误带有 `code`（`ERR_UNKNOWN`），因此每个错误信封都可以按 `code` 分支。
- `toErrorEnvelope`/`AstryxError`：仅当 `suggestions` 是真实数组时才附加。
- `injectXdsBlock`/`removeXdsBlock` 不再在格式受管块损坏时丢弃、重复或孤立用户内容（END 在 START 之前、重复/嵌套块，或开始标记没有结束标记）。它们会定位单个格式良好的块（在 START 之后搜索 END），并拒绝触碰有歧义/写了一半的文件，而不是损坏它。
- codemod 源码扫描不再跟随符号链接（扫描路径下的符号链接文件可能重写项目外的目标），并跳过生成的输出目录（dist/build/out/.next/coverage）——codemod 重写源码，而不是产物或依赖。
- `resolvePackageDir` 拒绝不是裸包名的集成规范（没有 `..`、没有绝对路径，必须留在 node_modules 内）——配置规范不再能把加载器指向任意模块。
- 损坏的集成清单（导入时抛出异常或 schema 验证失败）不再让 `Project.load`（及其所有命令）崩溃。它会被记录并通过 `issues()` 呈现，恢复有文档的跳过+警告策略；其他集成仍会加载。
- `--radius-*`、`--shadow-*`/`--elevation-*` 和 `--color-*` token 迁移 codemod 不再重写仅仅共享前缀的更长消费者定义 token（例如 `--radius-container-custom` → `--radius-3-custom`、`--radius-innermost` → `--radius-0most`、`var(--shadow-10)` → `--shadow-base0`、`--color-positive-custom` → `--color-success-custom`）。边界前瞻此前只绑定到模式中的最后一个备选（而且两个 codemod 根本没有边界）；现在它包裹整个选择分支，因此只有精确的 token 名称才会迁移。
- `migrate-badge-children-to-label` 在 badge 已有 `label` prop 时不再生成重复的 `label` prop（`<XDSBadge label="x">Active</XDSBadge>` 会产生无效的 `label="x" label="Active"`）；现在会跳过已声明 `label` 的 badge。
- `readDocMeta` 不再将嵌套在 `propDescriptions` 块（docsZh/docsDense 翻译导出）中的 `group:`/`hidden:` 字段读取为组件的 group——此前这会把翻译的 prop 描述泄漏为默认英文 `component --list` 中的组键（例如出现一个中文字符串作为组）。字段正则表达式现在只匹配顶层字段（<=2 个空格）。
- `astryx search`/`build` 的 verbose 输出无法访问：布尔 `--detail` 标志与根程序接受值的 `--detail <level>` 冲突，因此 `search button --detail` 报 `argument missing`。布尔标志现在是 `--verbose`（全局 `--detail <level>` 不变）。
- 为 `astryx theme add` 捆绑的主题已与源码漂移——`neutral` 捆绑包缺少 WCAG AA 浅色模式 `text-secondary` 对比度修复和一个 StatusDot 颜色块，因此 `astryx theme add neutral` 搭建出的主题低于 AA。所有捆绑包都已重新生成以匹配源码，并由新的漂移测试保护。
- `unwrap-authoring-factories` 升级 codemod 对简写 `type` 属性（输出 `{'component'}`）和无参数工厂调用（留下引用已移除导入的调用）产生损坏输出。两者现在都会输出正确的普通对象。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @ejhammond
- @imdreamrunner
- @jiunshinn
- @joeyfarina
- @josephfarina

---

# 0.2.0

#### 破坏性变更

- cli/json：移除中央 `CLIAnyResponse`、`CLIResponseType` 和 `CLIResponseDataMap` 类型。`jsonOut` 现在是结构化序列化器，`parseResponse` / `assertResponse` 返回结构化的 `CLIResponse`（`{type, data, meta?}`），而不是判别联合，因此在你自行收窄之前 `result.data` 是 `unknown`。
  运行时输出不变（每个 `--json` 信封逐字节一致）。这只影响导入这些类型，或依赖 `parseResponse` / `assertResponse` 自动收窄 `.data` 的消费者。

- component/hook 的 `--json` 列表响应已合并。`--detail compact`/`full` 此前会发出不同的 `component.brief`/`component.full`（以及 `hook.*`）信封；现在都发出 `component.list`（分别是 `hook.list`），并带有 `data.detail: 'names' | 'compact' | 'full'` 字段。迁移：根据 `data.detail` 分支，而不是 `.brief`/`.full` 判别字段。已移除类型：ComponentBriefResponse、ComponentFullResponse、HookBriefResponse、HookFullResponse。

#### 新功能

- CLI：`blog` 现在是普通的、面向 agent 的命令——它出现在 `--help` 和能力清单中，并支持 `--json`（发出 `blog.list` / `blog.detail` 信封），而不再隐藏。人类可读输出不变；阅读器仍消费公共 RSS 源。也可通过 `./api` barrel 以 `blog(slug?)` 进行脚本化调用。
- CLI：`init` 现在可通过 `./api` barrel 完全脚本化——非交互式安装器（agent-docs 速查表、起始模板、`--remove-agents`）位于 `api/init`，返回类型化回执（`init.run` | `init.remove`），CLI 简化为解析 → API 调用 → 渲染的薄包装。人类可读输出通过可注入 logger 发出，因此脚本化的 `init()` 保持静默，而 CLI 对现有用法的输出逐字节一致。
- CLI：`theme build` 现在可通过 `./api` barrel 完全脚本化——约 1,000 行的主题编译器（defineTheme 提取、通过 `@astryxdesign/core/theme` 生成 CSS、变体/类型声明 + 图标模块生成、覆盖验证）位于 `api/theme/build`，返回类型化的 `theme.build` 回执，CLI 简化为解析 → API 调用 → 渲染的薄包装。人类可读进度通过可注入 logger 发出，因此脚本化的 `themeBuild()` 保持静默，而生成的 CSS/JS/.d.ts、`--json` 信封和人类可读输出对现有用法保持逐字节一致。watch 模式仍是薄 CLI 循环。
- CLI：`upgrade` 现在可通过 `./api` barrel 完全脚本化——版本到版本的流水线（codemod + agent-docs 刷新）位于 `api/upgrade`，返回类型化回执（`upgrade.list` | `upgrade.status` | `upgrade.run`），CLI 简化为解析 → API 调用 → 渲染的薄包装。人类可读进度通过可注入 logger 发出，因此脚本化的 `upgrade()` 保持静默，而 CLI 输出和 `--json` 信封对现有用法不变。
- Timestamp：新增 `tooltipEntries` prop，可同时在多个时区和/或格式中渲染悬停工具提示——每个条目一行，每个条目都有可选的 `timezoneID`（IANA id；省略它或传 `'local'` 表示查看者所在时区）、`format`（每个非相对 `TimestampFormat` 加上 `'full'`）和 `label`。默认值不变：没有条目时，工具提示仍是查看者时区中的单行完整绝对时间。配置条目还会将工具提示附加到绝对格式上，而此前它们没有工具提示——注意这会为这些时间戳增加一个 Tab 停靠点和焦点环，就像相对时间戳已经有的那样，因此一列这样的时间戳会每行增加一个 Tab 停靠点。`hasTooltip={false}` 仍会抑制工具提示，空数组视为无配置。还更正了 `isTimezoneShown` 的文档，它声称适用于 `system_date_time` 和 `system_time` 格式；实际从未如此，这些格式仍保持机器可读。（#4188）

#### 修复

- `astryx theme build`：多词组件（TextInput、DateInput、NumberInput、DropdownMenu、SideNav、TopNav 等）的组件覆盖键现在能匹配组件实际渲染的连字符类名。已知组件注册表使用去连字符的键，因此针对它们编写的覆盖会发出无效选择器（`.astryx-textinput` 而不是 `.astryx-text-input`），静默地永不生效（#4109）。

#### 其他变更

- CLI：blog 重组为 api/blog 叶子结构——list/detail 叶子投影共享的 RSS 适配器（`_adapter.mjs` 拥有所有网络请求 + 源解析），`blog.mjs` 保留为分发器 + barrel，因此同一个 `blog` 导出、CLI 包装器、api/index.mjs 以及 --json/人类可读输出保持逐字节一致。
- CLI：`build` 重组为 `api/build` 叶子结构——`build.mjs` 现在是分发器 + barrel，将无查询路由到 `build.help`（`api/build/help/help.mjs`），将查询路由到 `build.kit`（`api/build/kit/kit.mjs`），每个叶子投影其单一的 `{type, data}` 信封。纯粹的重组：`build` 导出、`./api` barrel 和 CLI 消费者不变，`--json` 和人类可读输出对现有用法保持逐字节一致。
- CLI：`component` 重组为共享 `_adapter` 解析器之上的 `api/component` 叶子结构——`component.mjs` 现在是分发器 + barrel，路由到按类型的叶子（`list`、`detail`、`detail/props`、`detail/source`、`detail/showcase`、`detail/blocks`），每个都是适配器一次解析的主题（core/external/scoped/integration 所有权、歧义处理、模糊搜索、去重）的薄投影。纯粹重组：所有 `--json` 信封和人类可读输出在所有模式下保持逐字节一致。
- CLI：discover 重组为 api/discover 叶子结构（list、detail、detail/doc、search），位于共享 `_adapter` 之后，该适配器拥有外部包发现和文档加载；discover.mjs 现在是分发器 + barrel，保持相同的导出。纯粹重组——`--json` 和人类可读输出逐字节一致，api/index.mjs + CLI 消费者未受影响。新增同目录叶子测试。
- CLI：docs 重组为 api/docs 叶子结构——`api/docs/docs.mjs` 中的 `docs()` 现在是分发器 + barrel，按参数形状路由到三个叶子（`api/docs/list`、`api/docs/detail`、`api/docs/detail/section`），每个都投影到单一的 `{ type, data }` 信封。由 ≥2 个叶子共享的发现、覆盖加载和主题解析位于 `api/docs/_adapter.mjs`。纯粹重组：`docs` 导出、`api/index.mjs`、CLI 消费者以及所有 `--json` 和人类可读输出不变（逐字节一致）。
- CLI：hook 重组为 api/hook 叶子结构——`hook.mjs` 现在是分发器 + barrel，路由到同目录叶子（`list/list.mjs` → hook.list，`detail/detail.mjs` → hook.detail，`detail/params/params.mjs` → hook.detail.params），位于共享 `_adapter.mjs` 解析器之上。纯粹重组：所有模式下 `--json` 和人类可读输出逐字节一致，`hook` 导出表面（api/index.mjs + CLI）不变。
- CLI：init 重组为 api/init 叶子结构——`init.mjs` 现在是分发器 + barrel，路由到 `api/init/run/run.mjs`（默认 / `--features` / `--all` 安装路径）和 `api/init/remove/remove.mjs`（`--remove-agents` 路径），共享的普通 logger 契约位于 `api/init/_adapter.mjs`。纯粹重组：`getNextSteps`、`noopInitLogger` 以及 `InitOptions` / `InitLogger` 类型仍从 barrel 重新导出，因此 api/index.mjs、CLI 命令和编程 API 不变。人类可读和 `--json` 输出逐字节一致。
- CLI：layout 重组为 api/layout 叶子结构——一个共享 `_adapter.mjs`（`analyze`/`loadBlocks`/`formatIssue` 基于 `lib/xle`）配合薄的 `expand/`、`check/` 和 `grammar/` 叶子，外加一个 `layout.mjs` barrel。`api/index.mjs` 和 CLI 不变（它们通过 barrel 导入）。纯粹重组：`layout expand`/`check`/`grammar` 的 `--json` 信封和人类可读输出逐字节一致。
- CLI：swizzle 重组为 api/swizzle 叶子结构——扁平命令拆分为 `api/swizzle/list`（`swizzle.list`）和 `api/swizzle/copy`（`swizzle.copy` 回执，包括 `rewriteImports`），共享的 @astryxdesign/core 发现 + 组件列表在 `api/swizzle/_adapter.mjs` 中去重，`swizzle.mjs` 缩减为分发器 + barrel，保留其现有导出（`swizzle`、`rewriteImports`）。纯粹重组，无行为变更：人类可读输出和每个 `--json` 信封保持逐字节一致，CLI 命令、`./api` barrel 和中央 `types/swizzle` 声明未受影响。
- CLI：template 重组为 api/template 叶子结构（共享辅助函数保留在 barrel 上）。纯粹重组——`--json` 和人类可读输出保持逐字节一致：共享发现/IO 移至 `api/template/_adapter.mjs`，命令模式拆分为 `list`/`show`/`skeleton`/`copy` 叶子，`template.mjs` 成为分发器 + barrel，重新导出之前导出的每个符号（template、discoverTemplates、discoverAll、discoverAllWithErrors、discoverIntegrationTemplatesForOne、findShowcase、findRelatedBlocks、stripTemplateAssetRefs、listTemplates、extractComponents，以及 DiscoveredTemplate/TemplateDiscoveryError 类型），因此 component/layout/search/init/discover/validate-integration 和 lib/project 继续不变地解析 `api/template/template.mjs`。
- CLI：`theme add`/`list` 重组为分形 `api/theme/` 叶子结构——一个共享 `_adapter.mjs`（捆绑主题清单读取器 + slug 解析器）配合薄的 `add/`（复制 → `theme.add` 回执）和 `list/`（`theme.list`）叶子，外加一个 `theme.mjs` barrel，镜像 `theme build` 提取（#4462）。`themeList()` 现在与 `themeAdd` 一起从 `@astryxdesign/cli/api` 导出。纯粹重组：`theme list`/`add` 的 `--json` 信封和人类可读输出逐字节一致，并为两个叶子新增直接 API 测试。
- CLI：upgrade 重组为 api/upgrade 叶子结构——扁平流水线拆分为分发器 + barrel（`upgrade.mjs`）、共享 `_adapter.mjs`（版本检测 + agent-docs 刷新 + codemod 选择/执行机制）以及 `list`/`status`/`run` 叶子（`upgrade.list` | `upgrade.status` | `upgrade.run`）。纯粹重组：`./api` barrel + CLI 消费者不变，人类可读输出和 `--json` 信封都逐字节一致。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AKnassa
- @cixzhang
- @josephfarina

---

# 0.1.9

#### 新功能

- CLI：为 `build`、`swizzle`、`layout` 和 `validate` 命令提供完整的 API 覆盖——每个命令现在都可通过 `./api` barrel 脚本化，CLI 是解析 → API 调用 → 渲染的薄包装。`build` 新增 `--json` 输出。现有命令用法的行为不变。（#4302）

#### 修复

- 对齐两个 `--json` 契约形状与 CLI 实际发出的内容
- 在 `--json` 信封联合中注册所有已发出的响应类型
  有三个响应类型已定义、导出并由命令发出，却从未加入 `CLIAnyResponse`——即 `jsonOut()` 用来对载荷做类型检查的联合：`component.full`、`component.detail.blocks` 和 `upgrade.status`。由于它们的判别字段不在映射中，`jsonOut('upgrade.status', …)`（以及两个 component 变体）会被类型检查器拒绝，其载荷形状实际上也从未被验证。`build.help` 根本没有响应类型。新增 `BuildHelpResponse` 类型，并将这四者全部接入联合，因此 CLI 能发出的每个 `--json` 信封现在都会按已声明的形状进行类型检查。

- 诚实地标注 `detectPackageManager` 的类型，使 `astryx doctor` 的“无 lockfile”分支可达
  `detectPackageManager` 返回 `'npx'` 作为“未检测到任何内容”的哨兵值，但其返回类型只列出了 `'yarn' | 'pnpm' | 'bun' | 'npm'`。因此类型检查器将 `doctor` 的 `pm !== 'npx'` 守卫视为死比较——“No lockfile detected — defaulting to npm/npx”消息看起来不可达，并有被“清理”的风险。返回类型现在为 `PackageManager | 'npx'`，检测通过共享类型谓词收窄，因此守卫是诚实的，分支得以保留。

- 让 CLI 的 `.mjs` 源码完全可严格类型检查（checkJs + JSDoc）
  为整个 CLI 包添加标注，使 `tsconfig.strict.json`（对 `src`、`bin`、`scripts`、`docs` 和生成的 `templates` 进行完整 `strict` `checkJs`）报告零错误——此前有 1717 个错误。修复仅涉及 JSDoc：没有改变运行时逻辑，`.mjs` 仍是 `.mjs`。严格检查还发现并纠正了几处类型契约漂移：`upgrade.run` 响应类型（声明了一个命令从不发出的 `depsUpdated` 字段，并遗漏了真实的 `integrations`/`filesChanged`/`transformsApplied`/`errors`）、在 `--json` 信封联合中注册已发出的 `theme.list`/`theme.add`/`layout.*` 响应类型，并在 core 的文档类型中为 `ReferenceSection` 添加 `category?`（参考文档已经发出它）。

- 从 `getLatestVersion` 中移除无用的 `cwd` 参数
  `checkForUpdate` 调用了 `getLatestVersion(cwd)`，JSDoc 也宣传了一个 `cwd` 参数，但该函数不接受任何参数——它只读取 `$ASTRYX_LATEST_VERSION` 环境变量，因此传入的 `cwd` 被静默忽略。移除了这个幽灵参数及其文档，使签名与行为一致。更新提示输出没有功能变化。

#### 其他变更

- `swizzle.copy` 载荷始终包含 `package` 和 `usesStyleX`（两者都有测试覆盖），但 `SwizzleCopyResponse.data` 没有声明它们——调用点将载荷强制转换为 `Record<string, unknown>` 来规避不匹配。将这两个字段加入类型并删除了宽松转换，因此载荷会被类型检查。
- 错误 `suggestions` 形状在 JSON 信封 / API 错误契约中声明为 `{name, reason}`（reason 必填），但某些调用点发出裸 `{name}`（例如 swizzle 上的候选组件名）。引入单一的规范 `Suggestion` 类型（`reason?` 可选）并在各处引用它，使契约与发出的数据一致。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @josephfarina

---

# 0.1.8

#### 破坏性变更

- Avatar 和 AvatarGroup 采用 Icon 的缩写尺寸刻度——`size` 现在接受 `xsm`/`sm`/`md`/`lg`/`xl`，而不是 `tiny`/`xsmall`/`small`/`medium`/`large`。像素值不变（20/24/36/48/128px），默认值现在为 `md`（仍是 36px，以前是 `small`）。Avatar 的层级仍大于 Icon，因为头像与媒体对齐而不是与字形对齐。运行 `astryx upgrade` 迁移调用点。（#2672）

#### 新功能

- `astryx init --features agents` 现在默认创建根 `AGENTS.md`——这是 Codex/Copilot、Cursor 和大多数 agent 都会读取的、与工具无关的标准——而不是 Claude 专用的 `.claude/CLAUDE.md`。Claude 输出现在通过 `--agent claude` 选择加入（→ `.claude/CLAUDE.md`），`--agent all` 仍会同时写入两者。已有 agent 文档文件的项目不受影响：init 仍会发现并更新已存在的每个文件，因此这仅改变从零开始的默认值。（#4216）
- “傻瓜式 init”：`@astryxdesign/core` 和 `@astryxdesign/cli` 现在都会打印安装后提示，指向 `npx @astryxdesign/cli init`，`astryx` 命令会在 init 运行前提醒你完成设置，并且 `astryx init` 以非交互方式运行（无需 TTY），因此可在 CI 和 agent 环境中工作。（#4147、#4153、#4154、#4155）

#### 修复

- 停止在 CLI 安装前建议裸 `npx astryx`——它会解析到 npm registry 上一个不相关的包。
  CLI 现在在打印命令的每个地方都会发出感知安装状态的调用方式：

- 扩展 v0.1.0 升级 codemod，覆盖模拟 `@xds/core` 模块的测试文件，这些文件此前迁移到一半，升级后会损坏：
- `astryx upgrade` 现在在 **每条** 路径上都会将受管 agent-docs 块（`<!-- ASTRYX:START --> … <!-- ASTRYX:END -->`）与已安装版本保持同步——包括此前在任何刷新之前就返回的“已是最新”和“无 codemod”短路路径，导致 AI agent 读取过时的组件索引和被取代的规则。该块记录已安装的库，因此现在会提前刷新（独立于 codemod），并在 `--json` 回执中报告为 `agentDocs`。一次检测覆盖三种情况：过时的块会被重写（`--apply`）或报告为待处理更改（dry-run，不再写入）；安装了 core 但没有受管块的项目会被提醒运行 `astryx init --features agents`；已是最新的块保持静默。（#4168、#4169）

#### 文档

- 新增 `cli-integrations` CLI 文档主题（`astryx docs cli-integrations`），使集成编写指南（最初由 @ejhammond 编写）可通过 CLI 和文档站点发现，而不是一个未被引用的 markdown 文件。重写 CLI README 的 Configuration 部分以匹配当前的严格配置 schema（`integrations`、`issuesUrl`、`hooks.postCodemod`、`experimental.xle`），并围绕双文件 API 重新组织 Integrations 部分。

#### 其他变更

- 已安装 / 全局 / 开发运行建议 `<pm> astryx <cmd>`（例如 `pnpm exec astryx …`），不变。
- 一次性运行（通过 `npx`/`pnpm dlx`/`yarn dlx`/`bunx` 启动）建议作用域包 `<dlx> @astryxdesign/cli <cmd>`，它始终解析到我们。
- **migrate-xds-module-specifiers**：重写 `vi.mock`/`vi.doMock`/`jest.mock`/`jest.doMock`（以及裸 `mock`）调用中的被模拟模块路径，以及用于 TS 类型位置的 `import(...)` 说明符（`typeof import('@xds/core/Text')`），使 mock 仍能拦截重命名后的 `@astryxdesign/*` 导入。
- **drop-xds-prefix-imports**：在 `@xds/core` mock 工厂内去除部分 mock 覆盖键的前缀（例如 `useXDSTruncation` → `useTruncation`），使覆盖匹配重命名后的导出，而不是静默地什么都不覆盖。仅限已识别的 `@xds/core` mock 工厂；无关的对象键不受影响。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @joeyfarina
- @josephfarina

---

# 0.1.7

#### 新功能

- 从 `@astryxdesign/core` 导出编写工厂：`createConfig` 位于 `@astryxdesign/core/config`，`createIntegration`/`createPageTemplate`/`createBlockTemplate`/`createComponentDoc`/`createFunctionDoc`/`createDoc` 位于 `@astryxdesign/core/authoring`。编写 config 或 integration 不再需要依赖 CLI。现有的 `@astryxdesign/cli/*` 导入通过重新导出继续工作。
- 将最终确定的文档编写 API 添加到 `@astryxdesign/cli/doc`：`createComponentDoc`、`createFunctionDoc`（任何函数，包括 Hook）和 `createDoc`（通用参考/主题文档）。每个工厂都会标记一个 `type` 判别字段，并在加载边界根据匹配的每种类型 schema 进行验证。旧的宽松 `export const docs = {...}` 格式继续不变地加载，`.ts` 编写的 hook/function 源码现在会派生其导入路径到一个可 tree-shake 的子路径，而不是裸包根。
- 为 Table 的 `tableProps` 弃用新增 codemod：将对象字面量 `tableProps` 键提升为 `<Table>` 上的直接 prop，冲突或动态值保留在原位并附带 TODO 注释。**Codemod：** `npx astryx upgrade --codemod migrate-table-tableprops-to-direct-props`（#3679）
- 新增文档主题 `internationalization`，涵盖如何本地化 astryx 组件、提供翻译目录、覆盖默认字符串、与现有 i18n 库（react-intl、i18next、next-intl）共存、在运行时切换语言，以及用随附的伪语言环境验证覆盖情况。运行 `npx astryx docs internationalization` 或在 https://astryx.atmeta.com/docs/internationalization 阅读。
- template：接受 `.template.{ts,mjs,js}` 作为模板规范文件的规范后缀，与旧版 `.doc.*` 后缀并存。模板规范导出 `createBlockTemplate`/`createPageTemplate`——它是可搭建的模板，不是文档——因此现在有了描述性的名称。Core、外部包和集成发现（`findShowcase`、`--blocks`、`astryx template <id>` 脚手架）都会将 `Foo.template.ts` 与旧版 `Foo.doc.mjs` 同等对待；两种后缀都会解析同名 `.tsx` 源码，`.template.ts` 编写通过 jiti 加载。仅新增——不重命名任何现有文件。

#### 修复

- 翻译的组件文档不再丢失 prop
  携带自己 `props` 数组的 `docsZh` / `docsDense` 块会 **整体** 替换英文组件文档，而不是覆盖它，因此翻译尚未跟上的任何 prop 就直接不存在了。`astryx component Button --zh` 静默遗漏了 `isInterruptible` 和 `isIconOnly`；十个组件受影响，包括通过多组件 `components[]` 形状的 `MobileNav`、`Popover` 和 `Stack`。

- 将 --dense / --zh 文档覆盖锚定到其基础小节（#2182）
  压缩和翻译的参考文档按 **数组位置** 合并到基础文档中，因此小节顺序不同——或省略了一个小节——的覆盖会把每个标题嫁接到错误的正文上。

- template：在 Avatar 块和主题展示页内联完整演示图像 URL，以便脚手架将它们剥离为干净的占位符。此前只把 CDN 基础地址存储在 `const` 中并通过插值追加文件名的模板（`` `${CDN}/File.png` ``）会搭建出格式错误的 `src`——占位符 data URI 末尾粘上文件名——外加一个失效的 `const CDN = 'data:…'`。（#4027）

#### 文档

- 记录集成所需的最小 `package.json#exports` 配方，使其块模板可被使用打包器解析的消费者导入，并在 `moduleResolution: bundler` 下通过类型检查：`"./templates/*.tsx": "./templates/*.tsx"` 加一个带扩展名的 `import('@acme/widgets/templates/…/…Showcase.tsx')`。新增 `packages/cli/docs/integration-authoring.md` 和一个 fixture 测试，用仓库自己的 `tsc` 和 `esbuild` 证明该配方。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AKnassa
- @ejhammond
- @imdreamrunner
- @nynexman4464

---

# 0.1.6

---

# 0.1.5

#### 新功能

- 新增 v0.1.5 升级 codemod，将 Switch 上的 `labelSpacing="default"` 重命名为 `labelSpacing="hug"`。（#2889）
- 新增 `incident-console` 页面模板：一个值班事件响应控制台，演示 frame-first 追踪器原型——分组的密集事件行（StatusDot 严重级别、Token 状态）、PowerSearch 筛选、状态分段控件，以及带元数据和时间线的可调整大小检查器面板。新增 `Tools - Incident Console` 模板类别。
- 新增 `messaging-shell` 页面模板：Slack 风格的列框架（rail | sidebar | stream | thread panel），基于 Chat 组件家族构建——密集行、零卡片。新增 `Shell - Messaging` 模板类别。

#### 修复

- 让 CLI 页面模板填满视口高度，使背景覆盖整个页面（#3762）
- `astryx init --features agents` 现在支持 `--agent hermes`。该预设会将组件索引注入现有的 `.hermes.md`/`HERMES.md`（Hermes Agent 最高优先级的项目上下文文件），否则创建根 `AGENTS.md`，Hermes 会从项目根加载它——这与 `.claude/CLAUDE.md` 默认值不同。仅新增：现有的 `claude`/`cursor`/`codex`/`all`/自动检测行为不变。（#2187）
- cli：`astryx doctor` 现在能检测 pnpm 项目中的 `@astryxdesign/theme-*` 包。pnpm 将包作为符号链接安装到 `node_modules/.pnpm`，而主题扫描只接受真实目录，因此每个符号链接的主题包都被跳过，doctor 会警告没有安装任何主题包（#3530）。
- 使 `astryx theme build` 的配色方案声明感知模式，因此带有 `light-dark()` token 的构建主题不再破坏 `<Theme mode="light|dark">` 的强制模式（#3660）
- `runCodemods` 现在返回 `writtenFiles`，因此 `astryx upgrade` 的 codemod 后置 Hook（prettier/eslint 格式化）会在 core-codemod 变更上实际运行。
  运行器内部构建了 `writtenFiles` 列表，但未将其放入返回对象，因此 `upgrade.mjs` 读取 `codemodResult.writtenFiles ?? []` 始终为空，配置的 `hooks.postCodemod`（例如 `prettier --write`、`eslint --fix`）收到空文件列表并静默跳过。结果，jscodeshift 默认的双引号输出（`"@astryxdesign/core/Button"`）从未被重新格式化为项目风格，导致迁移后的应用无法通过 `prettier-format` lint。同级的 `integration-runner` 已经正确返回 `writtenFiles`，因此集成 codemod 变更会被格式化，而 core codemod 变更不会。

- `astryx swizzle`：swizzle 出的组件附带需要构建时 StyleX 编译器的原始 StyleX 源码，没有编译器时它们会无样式渲染且无错误。该命令现在会在复制后打印一条 StyleX 构建设置说明（包括 Next.js 的注意事项：StyleX Babel 插件会禁用 SWC 并破坏 `next/font`，因此需要基于 SWC 的转换），`astryx docs styling` 新增“StyleX Build Setup”一节，涵盖各打包器的设置。（#3373）
- `astryx theme build`：主题中声明的自定义组件变体（例如 `button['variant:accentOutline']`）现在会针对组件的真实接口（`ButtonVariantMap`）生成类型增强，而不是针对不存在的 `XDS` 前缀接口，因此 `variant="accentOutline"` 能通过类型检查。没有增强点的 prop（如 Button `size` 或 Heading `type` 这样的封闭联合）会被跳过，而不是发出无效增强，生成的 `.variants.d.ts` 现在从主题的 `.d.ts` 引用，使增强实际加载。（#3371）

#### 文档

- CodeBlock：终端风格的深色块模板（syntaxTheme 预设）
- 在迁移指南（`astryx docs migration`）中添加级联层安全指导：一份 Cascade Layer Safety 审计清单（未分层的样式和更晚的层都会胜过 `astryx-base`，与特异性无关；刻意将每个样式表分类到某一层；在 v3 和 v4 上都要对 Tailwind preflight 分层）以及一个 Foundation Smoke Test 小节（一个包含 Button/TextInput/Card/Table 的页面，外加非零内边距断言），使损坏的层顺序在功能开发之前而不是在迁移 N 个屏幕之后失败。入门指南现在从主题 CSS 步骤指向它。
- NavHeadingMenu：添加 playground 配置和展示块，使 Overview 标签页有可用的预览（#2698）
- NavHeadingMenu：将展示 SideNav 限制为更短的高度，使标题不再看起来漂浮在 Overview 预览顶部（#2698）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @arman-luthra
- @cixzhang
- @ejhammond
- @harjothkhara
- @is-jain
- @jiunshinn
- @josephfarina
- @let-sunny
- @thedjpetersen
- @zeroryu

---

# 0.1.4

#### 修复

- `astryx component <Name>` 现在会打印正确的 `defineTheme` 组件覆盖键。主题化示例剥离了过时的 `xds-` 前缀（astryx 重命名遗留），而不是 `astryx-`，因此它宣传的键如 `astryx-base-table` / `astryx-button`。这些键在运行时会双重前缀为 `.astryx-astryx-*` 选择器，并静默地匹配不到任何内容。键现在是从稳定类名去掉 `astryx-`（例如 `base-table`、`button`），这正是 `generateThemeRules` 所期望的（#3458）。
- 加固 v0.1.0 升级 codemod，以应对迁移消费者应用时出现的三种情况：

#### 文档

- 新增浏览器支持指南（`astryx docs browser-support`），记录支持层级、Astryx 依赖的现代平台特性（Popover API、CSS 锚点定位、`light-dark()`）、受影响的组件，以及消费者如何为自己的受众支持旧浏览器。

#### 其他变更

- **drop-xds-prefix-imports**：当去除 `@xds/core` 导入的前缀（例如 `XDSCodeBlock` → `CodeBlock`）会与文件中同名的本地绑定（例如本地的 `export function CodeBlock` 包装器）冲突时，将导入别名为 `Astryx<Name>` 并重写其用法，而不是产生会破坏构建的重复声明。
- **migrate-xds-css-surfaces**：重写 CSS `@import` 的 `@xds/*` 包样式表（包括 `'…'`/`"…"` 和 `url(…)` 两种形式），包括 `@xds/core/xds.css` → `@astryxdesign/core/astryx.css` 文件重命名以及 `theme-default`/`theme-daily` → `theme-neutral` 的合并。
- **migrate-xds-module-specifiers**：将 `@xds/theme-default`/`@xds/theme-daily` 合并到 `@astryxdesign/theme-neutral` 时，将 `defaultTheme` 导出重映射为 `neutralTheme`，并别名回原始本地名称（`neutralTheme as defaultTheme`），使下游用法继续工作。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond
- @ryanda9910

---

# 0.1.3

#### 新功能

- 新增隐藏的 `astryx blog` 命令，通过站点 RSS 源读取博客并打印文章的纯文本（`.txt`）版本。该命令不会显示在 `--help` 或 manifest 中，并且始终从规范的站点源读取。
- 组件发现现在感知包所有权：--package 作用域、集成组件的源码解析，以及带包限定的 JSON 列表。
- 严格配置 + 集成 v1 schema（integrations、issuesUrl、hooks.postCodemod）以及新的 @astryxdesign/cli/integration 导出。
- 基于文件的 codemod API（createCodemod/createConfigCodemod），带 @astryxdesign/cli/codemod 导出，并在 upgrade 中发现集成 codemod。
- component、template 和 upgrade 现在会在配置的集成存在验证问题时打印一行非阻塞警告，指向 validate-integration。
- 新增 Kanban Board 页面模板：颜色编码的状态列、带优先级标签的可拖拽任务卡片，以及看板工具栏。基于 @cg-hub18 的设计。
- 新增 frame-first 布局指导：新的 `astryx docs layout` 主题（shell 选择、区域预算、应用原型、卡片 vs 行的策略、响应式契约），生成的 agent 速查表中的布局规则，以及 `docs principles` 中的布局反模式。
- 新增 v0.1.3 config codemod，将 astryx.config 的 layout.components 迁移到 experimental.xle.components。
- 新增 v0.1.0 codemod，用于将 `declare module "@xds/core/..."` 类型增强和 `.xds-*` / `[data-xds-theme]` / `@layer xds-theme` CSS 表面迁移到其 `@astryxdesign`/`astryx-*` 等价形式。
- 引入 Project 配置 API 作为读取已解析项目配置、组件、模板、codemod 和问题路由的单一入口，取代 loadConfig。配置错误的集成现在在 upgrade 期间会被跳过并发出警告，而不是硬失败；新的 --skip-codemod 标志允许你在某个 codemod 失败后重新运行。
- 为 CLI 新增 Shell 页面模板类别：Top Nav、Side Nav 和 Shell Nav 应用外壳脚手架（#3245、#3246、#3247）
- 静态模板编写 API（createPageTemplate/createBlockTemplate），带 @astryxdesign/cli/template 导出和类型驱动、包作用域的模板发现。
- Swizzle 现在可以复制集成拥有的组件，将逃逸的导入重写到所属包，并通过配置和集成问题 URL 路由维护者反馈。
- `astryx theme build --watch`：每当源文件变化时自动重新构建主题，直到用 Ctrl-C 中断。从主题编写循环中移除了手动重新运行的步骤（以及忘记运行带来的过时 CSS 混乱）。每次重建都在子进程中运行，因此构建错误被隔离，watcher 继续运行。不支持 `--json`。（#3375）
- 新增 validate-integration 命令和集成问题模型，用于检查 Astryx 集成包的清单和贡献。
- XLE 应用组件注册移入 experimental.xle.components 下的已验证配置（对象形式），取代未经验证的 layout.components 读取。

#### 修复

- 将 CLI 错误码类型声明与运行时错误码对齐（添加缺失的 ERR_AMBIGUOUS_TEMPLATE 声明）。
- 更正 `doctor` 的主题接线提示，使其引用真实的 `astryx.theme` 配置字段（此前是 `xds.theme`），并将 agent-docs 检查措辞更新为“Astryx”。
- 更新 API/CLI 一致性测试工具以适配带包限定的 `component --list` 形状，并使 component API 以干净的错误拒绝非字符串名称，而不是抛出异常。
- XDS 前缀去除 codemod 现在作为强制性的 v0.1.0 升级步骤运行，因此从 0.0.x 升级时会在 `@xds/_ → @astryxdesign/_` 作用域重命名的同时，将带前缀的导入（useXDSTheme、XDSButton、XDSIconRegistry、……）重写为裸名称。
- upgrade 现在在加载配置之前运行 core codemod，因此 config codemod 可以修复否则无效的配置；dry-run 会报告可修复的配置并建议应用它的命令。

#### 文档

- Blockquote：添加“With Attribution”和“Testimonials”示例（#3385）
- DateTimeInput 和 DateRangeInput：添加示例块，使其文档页面有填充的 Examples 小节和 playground 链接（#2724）
- 为 46 个此前只显示 hero 视觉和空 Examples 小节的组件文档页面添加可复制的示例块（#3481）
- HoverCard：给“Link Preview”示例一个可交互的 `Link` 触发器，以便有东西可悬停（#2728）
- Lightbox：添加 Gallery、Video 和 Zoom 示例并修复 playground 预览（#3301）
- 移除对已移除的 gap-report 功能和 swizzle gap 标志的残留引用；文档现在反映 swizzle 的维护者反馈链接。
- Tab：在 Tab 文档页面添加一个展示 `icon` 和 `selectedIcon` 的交互示例（#2765）
- ToggleButtonGroup：添加一个垂直示例块，展示 orientation="vertical" 的单选和多选组（#2707）

#### 其他变更

- 集成 codemod 和模板文档加载现在使用共享的 module-loader 工具，而不是重复 jiti/import 逻辑。
- 将 config 和集成加载所使用的共享模块加载 + 常规文件发现辅助函数提取到一个内部工具中（无行为变化）。
- 移除独立的 gap-report 命令。Swizzle 现在打印一个简短的维护者反馈链接，而不是提交 issue。
- 通过一个共享模块加载器加载并验证用户编写的 config、integration、codemod 和 template 模块；create\* 工厂现在是仅类型，验证在加载时进行。
- 移除过时的 xds 配置表面迁移 codemod，并将 config codemod 执行统一到集成 codemod 使用的共享 (file, api) 运行器上。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @AKnassa
- @cg-hub18
- @ejhammond
- @ernestt
- @harshavardhan194
- @josephfarina
- @kentonquatman
- @mohitWeb-lab
- @pollychen-lab
- @thedjpetersen

---

# 0.1.2

#### 破坏性变更

- `Text`、`Heading`、`Link` 和 `Timestamp` 将 `color="active"` 值重命名为 `color="accent"`，现在映射到专用的 `--color-text-accent` token（可读的 accent 文本墨色），而不是 `--color-accent`。运行 `astryx upgrade` 自动迁移调用点。（#2863）

#### 新功能

- 让 `astryx.config.mjs` 集成贡献包文档、gap-report Hook、模板获取 Hook、升级 codemod 和 codemod 后置 Hook。
- 新增 `astryx theme add <slug> [path]`（以及 `astryx theme list`），将主题源码搭建到你的项目中作为你拥有的可编辑文件，主题源码捆绑在 CLI 中

#### 修复

- 使 `astryx init` 的主题说明与运行时构建主题的建议一致（#3080）
  `astryx init` 现在将用户指向预构建主题路径（`@astryxdesign/theme-neutral/built` + `theme.css`）和基础 CSS 导入，与运行时 `<Theme>` 控制台指导一致，而不是较慢的运行时样式注入导入，后者会让应用无样式。

- `astryx theme build` 现在从主题名称派生每个输出文件（.css/.js/.d.ts），使它们共享一种命名方案；将导入路径显示为裸 `./<name>` 说明符（而不是以 cwd 为根的 `./src/...` 路径，当你的文件已位于 src/ 下时该路径是错误的）；并且不再对 `card` 上的 `variant` prop 发出警告

#### 文档

- 将 ClickableCard 和 SelectableCard 示例重命名为遵循“Component — Variant”标题约定（`Clickable Card — Nested Button`、`Selectable Card — Multi-select`），并为两个卡片文档添加 playground 默认值，使其文档站点预览显示真实的卡片内容（#2877）
- 为 Chat 子组件声明 playground 脚手架，使其以真实宽度预览（ChatComposer 和 ChatComposerDrawer 包裹在设定尺寸的容器中，抽屉播种默认内容），并从 ChatComposerDrawer 的“With Progress”示例中删除多余的可见值标签，同时保留无障碍标签（#2877）
- 将 DateInput 的“Date Range”示例重命名为“Min/Max Constraints”——它演示的是受最小/最大窗口约束的单个输入，而不是日期范围选择器（#2692）
- 为更多此前冻结的展示示例接入本地状态（静态值 + 空操作 onChange）：TextInput、TextArea、NumberInput、SegmentedControl、RadioList、Tab、TabList 和 TabMenu。遵循与 Slider/Selector/MultiSelector 展示相同的修复，使文档站点预览真正可交互
- 为 Typeahead、Tokenizer 和 FileInput 展示示例接入本地状态（静态值 + 空操作 onChange → 冻结预览）。完成了从 Slider/Selector/MultiSelector（#3187-#3189）和输入/标签批次开始的交互式展示修复
- 为 Slider、Selector 和 MultiSelector 展示示例接入本地状态，使其可交互——它们此前是受控组件但使用静态值和空操作/缺失的 onChange，因此文档站点预览看起来冻结（#3187、#3188、#3189）
- 添加一个 LinkProvider 示例块，展示如何换入框架路由链接（例如 Next.js Link）以实现客户端路由（#2733）
- 为 Outline 添加展示块，使其文档页面有 hero 预览，与现有示例块并列（#2871）
- 移除“MoreMenu — In Toolbar”示例块——它渲染不正确，且与其他 MoreMenu 示例重复（#2870）
- 为两个列轴 Table 插件 Hook 添加渲染示例块，
  显示在其各自的子组件页面：

- 将“ToggleButton — Group”示例移到 ToggleButtonGroup 页面，那里才是它该在的地方（它演示分组切换行为）（#2842）
- 让 Toolbar 的“Table Filter”示例使用真正的 Selector 控件作为其 Status 和 Priority 筛选器，而不是样式像下拉菜单的按钮，并为 Toolbar 文档添加有意义的 playground 默认值和更丰富的槽选项（按钮、图标按钮、标签页、分段控件、选择器）（#2877）。

#### 其他变更

- `useTableStickyColumns — Pinned Columns`（在 /components/useTableStickyColumns 上）
- `useTableColumnResize — Draggable Columns`（在 /components/useTableColumnResize 上）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @durvesh1992
- @ejhammond
- @humbertovirtudes
- @rubyycheung

---

# 0.1.1

#### 新功能

- 新增 `astryx build` 命令用于页面组合，带自然语言搜索排序。
  `build "<idea>"` 返回一个组合工具包——最接近的页面模板、

  覆盖各部分内容的块，以及填补空缺的组件，外加 Compose 建议。

  无参数的 `build` 打印 how-to-build 手册。共享搜索排序

  现在通过分词 + 停用词、同义词/意图映射、轻量词干提取

  和页面模板关键词增强来处理间接的自然语言查询。

- 让生成的 agent 文档以构建为先，并重构 `init` 输出。
  生成的 `CLAUDE.md` 现在以 `build` 工作流开头（搜索被重新表述为

  中立的通用查找），并包含必需的 CSS 设置说明

  （`reset.css` + `astryx.css`），使组件永远不会无样式渲染。`init` 现在

  将 agent 指向 `astryx build`/`astryx search`，而不是倾倒页面模板

  名称。

- 将 `astryx build` 输出改进为完整的组合工具包。
  `build "<idea>"` 现在返回按角色分组的、可直接供 agent 使用的工具包：一个 START 行

  （脚手架 vs 组合）、最接近的 PAGE 模板、一个始终启用的 FRAME（页面

  外壳）和 FOUNDATION（布局/排版/操作原语）、特定于创意的

  BLOCKS 和 DOMAIN COMPONENTS（带相关性下限以削减噪音），以及一个 SETUP

  提醒。始终启用的 FRAME/FOUNDATION 组修复了

  每个页面都需要但从不与创意进行关键词匹配的结构原语的召回率偏低

  （测量：在 agent 基准评估中组件召回率从 15% 提升到 71%）。

- 加密 agent 文档 + 为项目的配置系统定制样式指导
  将生成的 `CLAUDE.md`/`AGENTS.md` 块从约 48 行收紧到约 26 行

  （按主题的 `docs` 转储折叠为一行，`build`/`search`/`component`

  不再在工作流和参考之间重复，运行前缀只说明一次，

  填充文字删除）——相同信息，更密集。

#### 修复

- `npx astryx` 现在在 CLI 作为真实 npm 包安装时可用。
  bin 相对于被调用的路径导入其 `../src/*` 模块，因此通过

  `node_modules/.bin/astryx` 符号链接运行时，它们会解析到

  包外（`ERR_MODULE_NOT_FOUND: .../node_modules/src/...`），在不对 bin 入口做 realpath 的

  Node 版本上。它现在通过 bin 的真实路径

  （`import.meta.url` 的 realpath）解析兄弟模块，无论通过符号链接、副本还是

  Windows shim 调用都能工作。还修复了非交互式 `init`/`theme` 错误，使其显示

  `astryx <command>` 而不是过时的 `xds <command>`。

- 新增 v0.1.0 升级 codemod，将旧版 `@xds/*` 模块说明符和配置表面迁移到 Astryx v0.1.0 名称。
  [破坏性] 从 package.json 中移除旧的 `astryx.versionFile` 更新提示支持。

#### 文档

- 在主题系统指南中添加 npm 安装步骤
  Quick Start 小节直接跳到 `import {neutralTheme} from '@astryxdesign/theme-neutral'`，对于尚未安装主题包的人会报 `Cannot find module` 而失败。在前面添加一行前言 + `npm install` 代码块，并在 Available Themes 表格上方添加一段简短说明，指向安装命令模式。已在 #3082 中报告。

#### 其他变更

- StyleX 编译器已接入 → `xstyle` / StyleX token 导入
- Tailwind → 由 `@astryxdesign/core/tailwind-theme.css` 支持的实用类
- 两者都没有 → 使用 `style`/`className` 与 `var(--token)` 设计 token，外加
  一条明确说明，不要使用 `xstyle`/实用类（它们无法编译）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @ejhammond
- @josephfarina
- @nynexman4464

---

# 0.1.0

#### 破坏性变更

- 从 `astryx.config.mjs` 读取项目配置（此前是 `xds.config.mjs`）
  CLI 现在从 `astryx.config.mjs` 解析其可选项目配置，

  而不是 `xds.config.mjs`——硬切换，没有回退。拥有

  `xds.config.mjs` 的消费者必须将其重命名为 `astryx.config.mjs`（配置形状和

  所有字段不变）。这是从公共 API 中移除 `xds` 命名的一部分。

- 将 CLI 命令/bin 从 `xds` 重命名为 `astryx`
  CLI 二进制现在是 `astryx`（此前是 `xds`）；`bin/xds.mjs` 重命名为

  `bin/astryx.mjs`，双 `xds`+`astryx` bin 条目合并为单个

  `astryx`，程序和 manifest 名称为 `astryx`。以

  `npx astryx <command>` 调用 CLI（例如 `npx astryx component Button`）。swizzle

  默认输出目录从 `./components/xds` 移到 `./components/astryx`。

  使用 `npx xds`、`xds` npm 脚本别名或 `xds` MCP 服务器

  名称的消费者应切换到 `astryx`。这是从公共 API 中移除 `xds` 命名的一部分。

- 将导出的 `XDSError` 类重命名为 `AstryxError`
  CLI 的编程 API 错误类重命名为 `XDSError` -> `AstryxError`

  （从 `@xds/cli` 导出并声明在其类型中）。捕获或

  引用 CLI API 中 `XDSError` 的消费者应切换到 `AstryxError`。这是

  从公共 API 中移除 `xds` 命名的一部分。

- 移除 XDS 前缀兼容层——astryx 现在是唯一的公共表面
  此版本从公共 API 中抹去所有 `xds` 命名；没有兼容

  窗口。消费者必须迁移（在开源前我们拥有所有消费者）：

- 移除 daily、brutalist 和 default 主题；neutral 是新的基线
  三个主题包从仓库中移除，将不再发布：

#### 修复

- `theme build` 生成有效的裸类型导入（IconRegistry/DefinedTheme）
  `astryx theme build` 发出的 `.d.ts` 文件从 `@xds/core` 导入 `XDSIconRegistry` /

  `XDSDefinedTheme`，但这些别名已被移除——生成的类型

  无法解析。改为生成 `IconRegistry` / `DefinedTheme`

  （`@xds/core` 现在导出的裸名称）。

#### 文档

- 将 CLI 主题文档更新为当前主题集
  刷新 `astryx docs theme`、`getting-started`、`styling`、

  `styling-libraries` 和 `migration` 参考文档，以反映已发布的

  主题：`neutral`、`butter`、`chocolate`、`gothic`、`matcha`、`stone` 和

  `y2k`。已移除的 `theme-default`、`theme-brutalist` 和 `theme-daily`

  包从文档中删除，安装/导入示例现在使用

  `@astryxdesign/theme-neutral` 作为推荐的起始主题。

#### 其他变更

- **组件名称：** `XDS*` 别名已消失——使用裸名称（`Button` 而不是
  `XDSButton`，`useTheme` 而不是 `useXDSTheme`，`ButtonProps` 而不是 `XDSButtonProps`）。

  `drop-xds-prefix-imports` codemod 可自动完成此操作。

- **CSS 类：** 组件只输出 `.astryx-*`（双 `.xds-*` 类已消失）。
  更新自定义 CSS 选择器 `.xds-button` -> `.astryx-button`（prop/状态值类

  如 `.primary`/`.sm` 不变）。

- **data 属性：** 只写入 `data-astryx-theme` / `data-astryx-media`；更新
  自定义选择器和 SSR 根属性，不再使用 `data-xds-*`。

- **CSS 层：** `@layer xds-base` / `xds-theme` 重命名为 `astryx-base` /
  `astryx-theme`；更新你的 `@layer` 顺序行和任何 PostCSS `layersBefore` 配置。

  `@astryxdesign/build` 的默认库层现在是 `astryx-base`。

- **预编译样式表：** `@astryxdesign/core/xds.css` 导出已移除——导入
  `@astryxdesign/core/astryx.css`。

- **CSS 自定义属性：** `--xds-*` 内边距回退已消失；设置 `--astryx-*`。
- **CLI 配置键：** `@astryxdesign/cli` 读取 package.json 的 `"astryx"` 字段（此前是 `"xds"`）。
  重命名该块；过时的 `"xds"` 键会静默地将包从发现中丢弃。

- `@astryxdesign/theme-daily`
- `@astryxdesign/theme-brutalist`
- `@astryxdesign/theme-default`
- import {defaultTheme} from '@astryxdesign/theme-default/built';
  - import {neutralTheme} from '@astryxdesign/theme-neutral/built';
- <Theme theme={defaultTheme}>...</Theme>
  - <Theme theme={neutralTheme}>...</Theme>

  ```

  ```

- 从公共仓库移除一个仅内部使用的 codemod（#2970）
  它曾是可选的、与版本无关的转换，不属于任何标准升级路径，因此移除它不影响公共的 `0.0.13 → 0.0.15` 迁移。

- 将 npm 包作用域从 `@xds/*` 重命名为 `@astryxdesign/*`
  所有已发布包移至新的 `@astryxdesign` 作用域（例如 `@xds/core` → `@astryxdesign/core`），以及工作区 lockfile、构建/运行时作用域目录扫描和文档站点 slug 派生。消费者必须更新其导入和依赖名称。内部 ESLint 插件命名空间（`@xds/*` 规则）有意保持不变并单独跟踪。现有的 `@xds/*` codemod 继续针对旧作用域，因此仍在使用 `@xds/*` 的项目可以迁移。

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond

---

# 0.0.15

#### 破坏性变更

- **新的 `astryx upgrade` codemod**——此版本包含用于 DatePicker→Input 重命名（`rename-date-picker-to-input`）、Stack `element`→`as`（`rename-stack-element-to-as`）、Chat `isStreaming`→`isStopShown`（`rename-isStreaming-to-isStopShown`）、命令式 `ref`→`handleRef`（`rename-imperative-ref-to-handleRef`）、菜单/选择器 `children`→`endContent` 迁移（`migrate-item-children-to-endcontent`）以及选择器函数 children→`renderOption` 迁移（`migrate-selector-children-to-render-option`）的 codemod。裸名称迁移（`drop-xds-prefix-imports`）和主题 `migrate-theme-selectors-to-data-attrs` codemod 作为可选项发布，需显式运行。（#2879、#2957）

#### 升级

```bash
npx astryx upgrade --apply
```

#### 新功能

- **`astryx` 二进制**——CLI 现在也以 `astryx` 提供（与 `xds` 相同的启动器），这是去前缀迁移的一部分。组件发现、文档门禁和 CI 检查与前缀无关——`XDS{Name}.tsx` 和裸 `{Name}.tsx` 源文件都会被识别。（#2867、#2878）
- **`astryx doctor`**——新的健康检查命令，用于诊断项目/设置问题。（#2565）
- **统一搜索**——`astryx search` 在单个查询中搜索组件、Hook、文档和模板。（#2564）
- **能力清单**——完整的机器可读能力清单，用于 agent 发现，并在每个错误上提供稳定的机器可读错误码。（#2562、#2563）
- **`@xds/cli/api` Hook 导出**——`hook` 通过带类型和一致性覆盖的 `@xds/cli/api` 暴露。（#2558）
- **CLI 退出码策略**——现在每个用户可见错误在人类可读和 `--json` 模式下都以退出码 1 退出（此前若干命令层错误只打印消息却以 0 退出，对 CI 脚本和 AI agent 不可见）。`xds bogus-cmd`、`astryx theme bogus-subcommand`、带未知子命令的裸 `theme` 组，以及“command not found”/“did you mean…”路径都会以 1 退出。帮助、版本和裸列表调用仍以 0 退出。引入 `lib/cli-error.mjs` 作为规范的退出码辅助工具。
- **迁移指南**——新增明确指南，说明如何将现有 Tailwind、shadcn 和 Radix 应用逐步迁移到 XDS。
- **data 属性选择器文档**——在 CLI 文档中记录了 data 属性选择器表面，与核心的双重输出变更并列。

#### 修复

- **Commander 短路路径上的 `--json`**——`--json` 现在在解析错误和 `--help` 上也会被遵守。新的 shim 将 `exitOverride()` 和感知 JSON 的 `configureOutput` 接入每个命令，并修补 `outputHelp`，使其在 `--json` 下发出 `{apiVersion, type:'help', data}` 信封。解析错误会在 stdout 上产生 `{apiVersion, error}` 并以退出码 1 退出；未知子命令现在会报错，而不是静默地以退出码 0 输出帮助；`--detail` 会进行选项验证。非 `--json` 调用不变。
- **`--json` 契约强制执行**——不支持 `--json` 的命令会在 `preAction` Hook 中、运行副作用之前拒绝该标志，因此 `astryx init --json` 不再先创建文件然后报错，留下部分状态。
- **`--json` 信封已记录**——成功响应为 `{ type, data }`；错误响应为 `{ error, suggestions? }`。`--json` 帮助文本描述了这两者。
- **`xds --version --json`**——发出 `{ type: 'version', data: { version } }`，而不是纯文本。
- **`xds --json`（无子命令）**——发出 `{ type: 'help', data: { commands, jsonSupported, ... } }`，而不是人类可读帮助文本。
- **`astryx upgrade --json`**——“Already up to date”和“no codemods in version range”路径发出结构化的 `{ type: 'upgrade.status', ... }` 信封。codemod 运行器在 `--json` 下保持静默，因此提示和进度行不再污染 stdout。
- **`astryx discover --json`**——当没有配置任何包时包含 `meta: { configured: false }`，区分“已配置但为空”与“未配置”。
- **`xds gap-report --json`**——缺少必需标志时返回结构化错误，而不是启动交互式提示；“gh CLI 缺失”路径也会发出 JSON 错误。
- **`astryx theme --json`**——`theme` 父命令（不带子命令）会干净地拒绝 `--json`；`theme build --json` 继续工作。
- **主题 CSS 文本回归**——`astryx theme build` 现在使用单一的 CSS 生成路径（`@xds/core` 的生成器），并将 `@xds/core/theme` 导入失败视为硬构建错误，而不是静默回退，修复了 XDS 前缀迁移后文档站点 Markdown 排版回归。（#2964）

#### 贡献者

感谢以下所有为本版本做出贡献的人：

- @cixzhang
- @czarandy
- @ejhammond
- @ernestt
- @imdreamrunner
- @josephfarina
- @kentonquatman
- @rubyycheung
- @thedjpetersen

---

# 0.0.14

#### 代码迁移

- `rename-action-props`——将 `on*Action` prop 重命名为 `*Action`（React 19 约定）（#1942）
- `rename-status-variants`——将 `positive`/`negative` 状态重命名为 `success`/`error`（#2175）
- `rename-section-wash-to-muted`——将 Section 的 `wash` 变体重命名为 `muted`（#2063）

#### 新功能

- **新组件展示**——XDSAvatarGroup、XDSInputGroup、XDSStepper、XDSButtonGroup、XDSContextMenu、XDSFileInput、XDSDateRangePicker、XDSDateTimePicker、XDSBlockquote
- **Hook 文档系统**——用于 Hook 文档的 `xds hooks` CLI 命令（#1849）
- **Playground 默认值**——又为 19 个组件添加（#2047）
- **Theme/MediaTheme/SyntaxTheme 展示**——实用型展示支持（#2040、#2028）
- **槽元素**——为 ReactNode prop 接入 playground UI（#2012、#2005）
- **`exampleFor` 字段**——添加到所有块模板（#1966）
- **`scaffold` 标志**——模板元数据脚手架支持（#1939）
- **Table 页面模板**——Heatmap Status、Matcha Store、Chart Shoe Store（#2172、#2149、#2154）

#### 修复

- **在文档中将 useXDSToast 和 useXDSCollapsible 与其父组件分组**（#2049）
- **DropdownMenu 内联数据类型**——内联到 items prop 文档中（#2027）
- **将父 Hook 文档**移到文档站点中其组件处（#2022）

---

# 0.0.13

#### 代码迁移

- `toolbar-density-to-size`——将 Toolbar 的 `density` prop 迁移为 `size`（#1448）
- `icon-name-deprecations`——将 `checkCircle`/`xCircle` 图标重命名为 `success`/`error`（#1503）
- `rename-attachments-to-drawer`——将 `XDSChatComposerAttachments` 重命名为 `XDSChatComposerDrawer`（#1714）

#### 新功能

- `astryx upgrade` 的 `--skip-install` 和 `--force-install` 标志（#1547）
- `npx astryx docs icons` 参考 + 更新后的图标 prop 描述（#1500）
- 生成的 agent 文档中的主题提示（#1456）
- 主题 `expandColorScale`——在 `astryx theme build` 中从 accent 十六进制值派生颜色 token（#1452）
- 组件组从文档文件读取，而不是硬编码映射（#1650）
- 页面和块模板系统（#1393）

#### 修复

- 处理 `semverCompare` 中的预发布后缀（#1512）
- 处理 `icon-name-deprecations` codemod 中的三元/逻辑表达式（#1513）
- 升级期间不向没有标记的文件注入 XDS 块（#1495）
- `findShowcase` 按目录名和 `componentsUsed` 匹配（#1728）
- 在构建的主题输出中包含 `onMedia` CSS（#1450）
- 为 v0.0.13 注册 codemod（从 v0.0.14 移来）（#1508）

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.13
```

---

# 0.0.12

#### 代码迁移

- `add-is-icon-only`——为仅图标 Button 和 ToggleButton 用法添加 `isIconOnly`（#1257）

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.12
```

---

# 0.0.10

#### 代码迁移

- `remove-size-props`——从 StatusDot 和 ProgressBar 移除 `size` prop（#966）

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.10
```

---

# 0.0.8

#### 新功能

- CLI：用于 .ts 文件的 tsx 解析器
- 更新 postAction Hook 中的提示

#### 代码迁移

- `rename-endslot-to-endcontent`——Button `endSlot` → `endContent`（#895）
- `migrate-token-renames`——Token 名称迁移到 v0.0.8 约定

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.8
```

---

# 0.0.7

#### 代码迁移

- `rename-banner-variant-to-container`——Banner `variant` → `container`（#814）

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.7
```

---

# 0.0.6

#### 代码迁移

- `migrate-token-names`——按命名审计进行的设计 token 重命名
- `migrate-shadow-tokens`——高度 → 阴影语义命名
- `migrate-collapse-to-collapsible`——XDSCollapse → XDSCollapsible
- `migrate-radius-tokens`——语义半径 → 数字刻度
- `migrate-skeleton-radius`——Skeleton 半径 prop → 数字刻度
- `migrate-badge-children-to-label`——Badge children → label prop

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.6
```

---

# 0.0.5

#### 新功能

- 从实时 CLI 元数据生成 agent 速查表（#640）
- 用于类型化 `.doc.mjs` 输出的 `--detail` 和 `--lang` 标志（#636）
- 通过 `--features` 标志将 `agent-docs` 折叠进 `init`（#639）

> **注意：** v0.0.5 破坏性变更的 codemod 注册在 v0.0.6 下。请使用 `--to 0.0.6`。

---

# 0.0.4

#### 功能

- **`astryx theme build`**——从 `build-theme` 重命名为 `theme build`（#570）
- **`--lang` 标志**——用于 i18n/压缩文档的 ComponentTranslationDoc 支持（#611）
- **`--zh` 标志**——简体中文文档输出（#567）

#### 重构

- 将 `component.mjs` 拆分为 `lib/` 模块，并使用懒加载命令注册表（#613）

---

# 0.0.3

#### 补丁变更

- 同步 package.json 导出映射
- 添加 verify-exports CI 检查（#537）

---

# 0.0.2

#### 新功能

- 带 codemod 支持的 `astryx upgrade` 命令
- `astryx theme build`（此前为 `build-theme`）

#### 代码迁移

v0.0.2 破坏性变更的 12 个 codemod：

- `rename-selector-items-to-options`——Selector `items` → `options`
- `unify-visibility-to-onOpenChange`——可见性回调 → `onOpenChange`
- `unify-uncontrolled-to-defaultX`——非受控状态 → defaultX 模式
- `rename-banner-endButton-to-endContent`——Banner `endButton` → `endContent`
- `rename-form-tooltip-startIcon`——Form `tooltip` → `labelTooltip`，`startIcon` → `labelIcon`
- `rename-isShown-to-isOpen`——Dialog/Popover `isShown` → `isOpen`
- `rename-topnav-title-to-heading`——TopNav title → heading
- `rename-sidenav-header-to-heading`——SideNav header → heading
- `migrate-useXDSIcon-to-getIcon`——`useXDSIcon()` → `getIcon()`
- `migrate-gap-to-numeric`——字符串 gap token → 数字
- `migrate-isFullBleed-to-padding`——`isFullBleed` → `padding={0}`
- `migrate-badge-dot-to-statusdot`——Badge dot → StatusDot

#### 升级

```sh
npx astryx upgrade --apply --to 0.0.2
```

---

# 0.0.1

- 初始发布
