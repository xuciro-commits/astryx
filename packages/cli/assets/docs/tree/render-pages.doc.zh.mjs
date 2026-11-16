// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for render-pages.doc.mjs.
export const docsZh = {
  "title": "页面即单个 HTML 文件",
  "description": "实验性功能。将页面渲染为一个自包含的 HTML 文件，便于分享或嵌入，并可从该文件还原页面。",
  "sections": [
    {
      "section": "Experimental",
      "title": "实验性",
      "content": [
        {
          "type": "prose",
          "text": "此命令与 `astryx docs cli/experimental` 下的所有内容一样属于实验性功能：其选项、输出文件和 JSON 仍可能变化。CLI 中的其他内容不会因为它而改变。"
        }
      ]
    },
    {
      "section": "Make a file to share",
      "title": "生成可分享的文件",
      "content": [
        {
          "type": "prose",
          "text": "像平常一样用 Astryx 组件构建页面，然后渲染它。页面模块需要一个默认导出；它会在你的机器上使用项目安装的 React 和 Astryx 包进行渲染。在项目之外（该文件夹未安装或声明 Astryx Core 或 CLI），它会使用 CLI 自身运行的 Astryx、React 和 StyleX 进行渲染，因此单个页面文件可以在任何地方渲染，包括 React 应用内。"
        },
        null,
        {
          "type": "prose",
          "text": "结果是一个没有任何附属文件的单一文件：标记、页面用到的全部 CSS 规则（来自 Core 以及它导入的任何样式表，例如主题）、页面自身的 StyleX 样式，以及以 data: URI 形式存在的本地图片。对于 `--reverse`，它还会携带被携带的模块或样式表通过相对路径引用的每个图片、字体或媒体文件（每个最大 8 MB），这些路径位于存放被携带文件的文件夹内，即使页面并未显示该文件也是如此。它不运行任何脚本，也不从网络加载任何内容，因此可以从磁盘打开、附加到消息中，并在阻止网络和脚本的沙盒框架内显示。颜色跟随查看者的浅色或深色设置，根元素上的 `data-theme` 为 `light` 或 `dark` 时可指定其中一种。该文件还携带页面及其导入的每个本地模块、样式表、JSON 文件和图片的源码，因此你分享给的人可以阅读这些代码；请勿在页面导入的内容中放置机密信息。"
        },
        {
          "type": "prose",
          "text": "它无法保留的是：运行时需要浏览器的任何内容。状态、Effect、点击处理程序以及首次绘制后加载的数据都会丢失。用 recharts 制作的图表是例外：渲染器会在页面内绘制页面模块（而非已安装的包）按名称从 recharts 导入的每个图表和 ResponsiveContainer（`import {LineChart} from 'recharts'`），因此自定义刻度、标签或形状可以访问页面的 React 上下文。由容器决定尺寸的图表会缩放到页面为其提供的宽度，其图例会保持在画面之外：水平图例在图表下方单独占一行（当图例要求位于顶部时则在图表上方），位于一侧的垂直图例则在该侧紧邻图表；在固定尺寸的图表中，图例保持其属性指定的位置。图表显示页面首次渲染时的数据和属性，此时 Effect 尚未运行：当页面在没有浏览器的情况下无法再次绘制，或其 Effect 改变了图表、或重新渲染生成图表的组件时，每个图表会单独绘制，其组成部分看到的是 React 上下文的默认值。图表组成部分从某个 React 上下文读取的值，如果该上下文被 Effect 改变，仍可能显示改变后的值。`chart-size` 警告会统计渲染器无法绘制的图表数量（例如通过 `import * as R` 使用的图表），并说明图表何时是单独绘制的。请在 Effect 内读取 window 等仅浏览器可用的值，否则渲染会以 ERR_RENDER_BROWSER_API 停止。"
        }
      ]
    },
    {
      "section": "Read the warnings",
      "title": "阅读警告",
      "content": [
        {
          "type": "prose",
          "text": "每条警告都会指出可能与你的本意不符的内容，以及需要更改什么。最常见的是忽略子元素的组件：`<ListItem>Save</ListItem>` 会渲染出一行空白，因为 ListItem 接受的是 `label=\"Save\"`。其他警告会标记远程图片（沙盒查看器无法加载它们；请将图片保存到页面旁边并导入它）、页面自身渲染的 `<script>`、`<link>` 或 `<iframe>`（该文件承诺不运行也不加载任何内容，因此请移除它们）、缺失的图片，以及页面渲染时打印的输出。`node-crash` 警告会指出在 `Intl.Segmenter` 中崩溃的 Node 构建（其版本和路径）。页面在没有它的情况下完成渲染，因此输出可能略有不同：首字母和字符计数（例如 Avatar 的首字母）可能会拆分组合表情符号、旗帜或带独立重音符号的字母。普通组合字母形式的名称（`José`、`Zoë`、`李小龙`）输出相同。使用官方 Node.js 构建进行渲染可消除这一差异。"
        }
      ]
    },
    {
      "section": "Get the page back",
      "title": "还原页面",
      "content": [
        null,
        {
          "type": "prose",
          "text": "这是返回的途径（unrender）。每个渲染文件都携带其源码，因此这会逐字节写回页面；编辑它并再次渲染。如果文件的源码块已被移除，但其标记来自 Astryx 组件，则会改为从该标记重建：组件、其记录的属性和文本会恢复，而样式、图标和行为不会恢复，因此请将其视为起点。从未是 Astryx 页面的 HTML 会被拒绝，并返回 ERR_RENDER_NOT_ASTRYX；请向 `astryx build` 描述该页面以创建一个新页面。"
        },
        {
          "type": "prose",
          "text": "它会写入页面、页面通过自身导入到达的模块、样式表和 JSON 文件，以及渲染时携带的图片、字体和媒体文件（无论页面如何命名它们，只要其字节确实是同一份）：每项都会写到页面相对导入在你把页面放到任意位置后能够找到的位置，而页面通过路径别名（`@/components/Header`）导入的文件，会写到项目的 `tsconfig.json` 或 `jsconfig.json` 别名指向的位置。除页面之外的每个文件都会放入还原操作创建的唯一新文件夹中（页面路径上尚未存在的最顶层文件夹），绝不会写入已存在的文件夹：导入其他文件的页面会还原到新文件夹中（`--out restored/app/page.tsx`），而通过路径别名导入的文件仅当该别名指向新文件夹内部时才会还原。当你的别名没有为这类导入命名时，文件会按页面自身的布局还原到新文件夹内，结果（`aliased`）会列出每个这类导入、页面构建所需的完整 `paths`（你当前配置中的条目加上新增条目），以及它们所属的 tsconfig.json 或 jsconfig.json。只有不能作为包名或包自身子路径导入的导入才会按这种方式处理（`@/…`、`~/…`），因此接收到的文件永远无法重新映射某个包或你自己的导入。它也不会写入测试、Story 或基准测试运行器会按其默认模式执行的文件（Jest、Vitest、Bun、AVA、Playwright、Storybook、Cypress 和 `node --test`：诸如 `*.test.*`、`*.spec.*`、`*_test.*`、`*-test.*`、`*.bench.*`、`*.stories.*`、`*.cy.*` 等名称，以及 `test/`、`tests/` 或 `__tests__/` 下的任何内容），判断依据是仓库根目录（文件上方的每个文件夹直至该根目录），否则是包含 package.json 的最顶层文件夹。还原的文件是发送方的代码：在运行或导入它们之前请先阅读。没有 `--out` 时，所有内容都会还原到 HTML 文件旁边的一个新文件夹中，并以该文件命名（`page.html` 还原到 `page-restored/`）。如果接收到的文件携带其他任何内容（页面从未导入的文件、点文件、`package.json`、工具配置、离开该文件夹的路径），则会被拒绝，且不写入任何内容。渲染文件如果在传输过程中丢失了嵌入源码（清理器或编辑器剥离了 `<script>` 块）且没有可重建的 Astryx 组件，会以 `ERR_RENDER_SOURCE_DAMAGED` 被拒绝；嵌入源码之前被截断的渲染文件亦然；合并后留下冲突标记的文件也是如此（保留来自某一方的完整文件，或重新渲染合并后的页面）。除非传入 `--overwrite`，否则绝不替换现有文件，并且拒绝信息会逐一列出这些文件；即使是生成的文件、第三方提供的文件或被忽略的文件，以及任何经过符号链接的路径，也不会写入。添加 `--json` 可将结果作为数据获取：写入了什么、大小以及每条警告。"
        }
      ]
    },
    {
      "section": "What the file says about itself",
      "title": "文件对自身的说明",
      "content": [
        {
          "type": "prose",
          "text": "渲染文件会向接下来打开它的任何人（没有其他上下文的人或代理）解释自身。顶部有一段简短说明，列出生成它的 CLI 版本和渲染格式、页面在项目中的路径、它携带的文件，以及渲染所用的包及其版本。然后给出确切的命令（通过 `npx @astryxdesign/cli@<version>` 固定到该 CLI 版本），用于取回源码，以及将还原后的页面再次渲染到同一文件的命令。嵌入源码之后的简短说明会为从末尾开始阅读的读者重复第一条命令。嵌入源码以 JSON 记录相同的事实。"
        },
        {
          "type": "prose",
          "text": "请通过源码而不是 HTML 来更改页面：携带的源码永远不会看到对标记所做的编辑。渲染只会替换由渲染写出的 HTML 文件，因此用 `--out` 将还原后的页面渲染到旧文件上是安全的。"
        }
      ]
    },
    {
      "section": "Edits made to the HTML",
      "title": "对 HTML 的编辑",
      "content": [
        {
          "type": "prose",
          "text": "嵌入源码还会保存渲染时标记和样式的校验和、标记文本和标题。当有人在渲染后编辑 HTML 时，`--reverse` 仍会按渲染时的样子写回页面，结果会显示 `edited: true` 并列出每段发生变化的文本（标题在前）：它原来是什么、现在是什么，以及旧文本在还原文件中仅出现一次时所在的文件和行号。`stylesEdited: true` 表示样式已更改。在还原的文件中进行相同的更改，然后再次渲染。仅更改属性、元素或格式时，会显示 `edited: true`，但没有文本变化。"
        }
      ]
    },
    {
      "section": "Across CLI versions",
      "title": "跨 CLI 版本",
      "content": [
        {
          "type": "prose",
          "text": "嵌入源码携带一个渲染格式编号。每个 CLI 都会读取截至自身版本的每种格式，新增的可选字段从不改变编号，因此较旧的 CLI 仍能读取较新 CLI 写出的文件。文件如果携带较旧 CLI 不接受的文件类型（`.mts`、`.cts` 或 `.cjs` 模块，或名称类似配置的模块或 JSON 文件，例如 `config.ts` 或 `data/config.json`），则标注格式 2；其他所有文件标注格式 1。格式比正在运行的 CLI 更新的文件会被拒绝，并返回 `ERR_RENDER_NEWER_FORMAT`，消息会指出写出该文件的 CLI 版本，该版本可读取它。来自较旧 CLI 的文件不携带说明，但其 `generator` 元数据会指出写出它的版本，`--reverse` 会将该版本报告为 `renderedBy`。"
        },
        {
          "type": "prose",
          "text": "说明中会指出页面编写时面向的 Core 版本。要将还原的代码迁移到使用较新 Core 的项目，请在该项目的环境中对还原文件夹运行升级：`astryx upgrade --from <that version> --path <restored folder> --apply`。"
        }
      ]
    }
  ]
};
