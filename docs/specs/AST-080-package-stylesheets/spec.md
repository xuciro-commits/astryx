---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-080
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:component-style-authoring]
affects_families: []
affects_contributing: []
affects_consumer_docs: [styling-overview, getting-started, migration-setup]
---

# Package stylesheet distribution system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/build/src/next.js",
    "packages/build/src/next-postcss.js",
    "packages/build/src/source-stylesheet.js",
    "packages/build/src/turbopack-loader.js",
    "packages/build/src/next.turbopack.test.mjs",
    "packages/build/src/source-stylesheet.test.mjs",
    "packages/build/scripts/turbopack-speed.mjs",
    "packages/build/__fixtures__/next-app.mjs",
    "packages/build/__fixtures__/next-turbopack/src/app/globals.css",
    "packages/build/__fixtures__/next-turbopack/src/app/page.tsx"
  ]
}
```

## Intent

使用 Astryx 的产品会加载预构建样式表：`@astryxdesign/core/astryx.css`、它用到的其他每个 Astryx 包的样式表，以及一个主题样式表。这些文件就是 Astryx 组件 CSS 的全部内容，加载它们即默认设置。产品也可以改用 `@astryxdesign/build` 编译 Astryx 包源码，既可针对一个包的全部模块，也可只针对它交付的模块；该构建在同一层中产出预构建样式表所承载的规则。Next.js 产品在 webpack 或 Turbopack 下通过 `withAstryx()` 对它用到的每个带样式的 Astryx 包这样做，而它自己的 CSS 仍然胜过每一条 Astryx 规则。

每个包样式表都将其规则放在同一个级联层下，并遵循同一层级顺序。因此，无论元素由哪个包设置样式、无论哪个样式表先加载，主题覆盖都会胜过每个包的基础样式。

## Non-goals

- 主题样式表包含什么，由 `architecture:theme-compilation`、`spec:AST-034` 和 `spec:AST-050` 拥有。
- 包样式表包含哪些 StyleX 变量组，由 `spec:AST-066` FR3 拥有。
- 产品如何编译自己的代码，包括它为自身样式或为通过 `astryx swizzle` 弹出的组件所使用的任何 StyleX 设置，但被 swizzle 的副本的规则在 `@astryxdesign/build` 下落在何处除外（FR5、FR7）。
- `@astryxdesign/build` 除通过 `withAstryx()` 之外如何接入打包器（FR9），以及源码构建如何选择要编译的包模块子集。
- 样式表的压缩或精简。
- 只要满足本契约，等价的内部实现仍然有效。

## Requirements

- **FR1 — 每个已发布的包都交付一个预构建样式表。** 每个模块带有样式的已发布 `@astryxdesign/*` 包，都必须从该包的 `.css` 子路径导出预编译样式表。该样式表包含其模块用到的每条规则。包在其首个带样式的已发布版本中一并交付其样式表。包样式表如下：

  | 包                       | 样式表                                                |
  | ------------------------ | ----------------------------------------------------- |
  | `@astryxdesign/core`     | `@astryxdesign/core/astryx.css`                       |
  | `@astryxdesign/lab`      | `@astryxdesign/lab/lab.css`                           |
  | `@astryxdesign/richtext` | `@astryxdesign/richtext/richtext.css`                 |
  | `@astryxdesign/charts`   | `@astryxdesign/charts/charts.css`，自其首次发布版本起 |

  主题包不在本要求范围内；它们的样式表遵循 Non-goals 中列明的主题记录。

- **FR2 — 预构建样式表无需编译器即完整。** 用 `astryx.css` 和一个主题样式表加载包的样式表时，必须为包渲染的每个元素设置样式，覆盖包支持的每种状态、配色方案和文本方向，且产品构建中不含 StyleX 编译器。非 Core 样式表依赖 `astryx.css` 提供它所声明的 Core 定义，例如变量组和关键帧，并且不重复 `astryx.css` 已声明的定义。`astryx.css` 在 `spec:AST-066` FR3 下省略的某个 Core 组，由读取它的模块所在的包样式表承载。

- **FR3 — 每个包样式表只有一个层和一个层级顺序。** 每个包样式表中的每条规则，以及 Core 的 `reset.css` 中的每条规则，都必须位于其唯一的 Astryx 层内：包样式表位于 `astryx-base`，`reset.css` 位于 `reset`。这些文件都不输出未分层规则或其他层。每个文件都以主题输出在 `spec:AST-066` FR7 下携带的同一顺序注册开头：

  ```css
  @layer reset, astryx-base, astryx-theme;
  ```

  因此，无论哪个 Astryx 样式表先加载，`reset < astryx-base < astryx-theme` 都成立，且作者编写的主题覆盖会胜过每个包的基础规则。产品的未分层 CSS 始终位于每个 Astryx 层之上。

- **FR4 — 样式表在打包后仍然可用。** 每个包的 `exports` 必须在打包后的包中解析其样式表子路径，且其 `sideEffects` 声明必须覆盖该文件，从而使打包器保留产品的 `import '@astryxdesign/<package>/<name>.css'`。

- **FR5 — 文档中的设置默认加载预构建样式表。** 文档中的每条默认使用方设置路径（纯 CSS、Tailwind，以及编译自身 StyleX 的产品，包括已弹出的组件）都必须加载产品所用每个 Astryx 包的预构建样式表——FR9 下从源码编译的包除外，其规则来自产品的编译输出，构建既不导入也不打包其预构建样式表——再加上一个主题样式表，且文档必须把这些路径呈现为默认。默认设置如下所示：

  ```css
  @layer reset, astryx-base, astryx-theme;

  @import '@astryxdesign/core/reset.css';
  @import '@astryxdesign/core/astryx.css';
  @import '@astryxdesign/richtext/richtext.css'; /* each package used */
  @import '@astryxdesign/theme-neutral/theme.css';
  ```

  在 `@astryxdesign/build` 下，若某个被 swizzle 的副本所在文件夹带有 `astryx-swizzle.json` 标记，该副本通过库通道构建，因此其规则落在 `astryx-theme` 之下的 `astryx-base` 中（`spec:AST-110` FR5）；原版 StyleX 插件没有库通道。

  文档也可以把源码构建作为默认设置的替代方案来呈现：一个或多个包的源码经 `@astryxdesign/build` 在 FR7 下编译（`withAstryx()` 则按 FR9），各自替代该包的预构建样式表，同时产品继续加载 Core 的 `reset.css`、一个主题样式表，以及它未从源码构建的每个包的预构建样式表。任何文档化的设置都不得既加载某个包的预构建样式表，又编译该包的源码，也不得以任何其他方式编译 Astryx 源码，例如把 Astryx 包源码加入产品自身 StyleX 编译器的输入。

- **FR6 — 每个包都记录其导入方式。** 每个包的 README 和样式概览都必须写明该包的样式表，并在 `astryx.css` 旁边展示该导入。

- **FR7 — 源码构建产出预构建样式表所承载的内容。** 对包的源码构建必须针对它编译的模块，产出与该包预构建样式表相同的规则、相同的选择器、相同的顺序，且每一条都位于单个 `@layer astryx-base` 内，不含嵌套层。源码构建输出的每个包块都以 FR3 的顺序注册开头，因此无论哪个 Astryx 文件或 chunk 先加载，该顺序都成立，绝不依赖产品写入的某一行。编译一个包的全部模块会重现其预构建样式表的规则；编译子集则产出这些模块用到的规则。Core 的源码构建始终包含其他包的预构建样式表在 FR2 下所依赖的 Core 定义，例如变量组和关键帧。产品规则留在 `astryx-base` 之外，被 swizzle 的副本除外：位于带有 `astryx-swizzle.json` 标记的文件夹下的模块会在库通道中编入 `astryx-base`（`spec:AST-110` FR5）。源码构建除包自身的源码外不需要任何数据，并且在开发构建与生产构建中同样成立。

- **FR8 — 样式表增长按组件报告并设预算。** 每个加载包预构建样式表的产品都会加载它的全部内容（FR1），因此组件新增的 CSS 会到达每个这样的产品，包括从不渲染该组件的产品。每个改动包中带样式模块的拉取请求都必须报告它改动的每个包样式表的 gzip 体积，以及每个发生变化的组件的 gzip CSS 增量，均以 base 对 head 对比。仅在粗指针上运行、且给单个组件增加超过 1 KB gzip CSS 的特性会被标记，其拉取请求需说明该代价的正当性；该 CSS 仍留在包样式表中（FR1、FR2）。体积为默认压缩级别下的 gzip，1 KB 即 1,024 字节。组件的 CSS 增量是其模块在 head 时贡献给包样式表的规则的 gzip 体积，减去同一组模块在 base 时的体积。对应的 JavaScript 报告与预算，以及共享值表只交付组件所用行的规则，见 `architecture:component-style-authoring` INV6。

- **FR9 — `withAstryx()` 按顺序从源码编译每个带样式的包。** 来自 `@astryxdesign/build/next` 的 `withAstryx()` 必须在 webpack 和 Turbopack 下，从源码构建产品所用、且模块带样式的每个已发布 Astryx 包：FR1 中的包、Core、Rich Text、Lab 和 Charts（自其首次发布版本起）。主题包保留其预构建主题样式表。
  - **真正的源码。** 每个从源码构建的包的规则，都来自在产品构建中编译该包自身的源码，所用设置与其预构建样式表的编译设置一致（FR7）；产品自身的 StyleX 设置绝不适用于 Astryx 源码。构建既不导入也不打包它从源码编译的包的预构建样式表，并且会直接失败，而不是从该样式表取一条规则。
  - **顺序。** 每条 Astryx 规则都位于 `@layer reset, astryx-base, astryx-theme` 内：Core 的 `reset.css` 在 `reset`，每个包的编译块在 `astryx-base`，主题在 `astryx-theme`。每个编译块都以 FR3 的顺序注册开头（FR7）。产品 CSS——包括产品自己的 StyleX 输出，带有标记的被 swizzle 副本除外（FR7）——保持未分层，并在任何 chunk 或加载顺序下胜过每条 Astryx 规则。非 Core 块像 FR2 那样依赖 Core 的变量和关键帧。
  - **样式表入口（Turbopack）。** 产品在其 PostCSS 配置中列出 PostCSS 插件 `@astryxdesign/build/next/postcss`，并在其全局样式表中放入一条 `@astryx;` 规则。在 Turbopack 下，该插件必须按包顺序，用每个从源码构建的包的块替换该规则。
  - **快速路径（Turbopack 目标，已知缺口）。** 目标是 Astryx 模块在 Turbopack 的原生管道内编译：没有 `turbopack.rules` JavaScript loader、没有 Babel、也没有 PostCSS 步骤编译 Astryx 模块，Astryx 规则通过 Turbopack 自身的 CSS 处理到达页面。该管道内没有维护中的 StyleX 编译器运行，因此在这样的编译器存在之前，Turbopack 构建可以通过一个 `turbopack.rules` JavaScript loader 编译 Astryx 模块，该 loader 运行带 StyleX Babel 插件的 Babel。FR9 的其他每条规则在该路线上都成立。
  - **速度预算（Turbopack）。** 与不做源码编译（加载预构建样式表）构建的同一应用相比，五次运行的中位数：`next dev` 冷启动最多 +15%，一次热更新最多 +10%，`next build` 最多 +20%。每次改动构建包时都会测量并报告这些数字。在 loader 路线使用期间该预算不构成阻塞；一旦存在原生路线，它就成为要求。
  - **Webpack。** webpack 源码构建满足真正源码和顺序规则；快速路径目标与速度预算仅适用于 Turbopack。

### Platform support

- 支持的特性/引擎下限：不变；主题样式表和 reset 样式表已经要求级联层。
- 不支持的行为：未新增。
- 浏览器证据：FR2、FR3、FR7 和 FR9 的真实浏览器计算样式。FR1、FR4、FR5 和 FR6 在包、打包器和文档层面得到证明。FR8 由拉取请求体积报告证明。

## Current-state impact

- Core、Lab、Rich Text 和 Charts 已经各自导出一个样式表，其中每条规则都位于 `@layer astryx-base` 内。非 Core 样式表省略了 `astryx.css` 声明的 Core 变量组。Core 的预构建样式表承载规范的数据 token 组；Lab 依赖该样式表，不再添加副本，依据 `spec:AST-066` FR3。
- `reset.css` 和每个包样式表（`astryx.css`、`lab.css`、`richtext.css`、`charts.css`）都以 FR3 的顺序注册开头，因此预构建文件在任何加载顺序下都保持该顺序。
- Core、Lab、Rich Text 和 Charts 各自声明了覆盖 `**/*.css` 的 `sideEffects`（FR4）。
- 样式概览只记录了预构建路径。通过 `@astryxdesign/build` 的源码构建尚未在那里记录（FR5）。
- `@astryxdesign/build` 与 FR7 冲突：它把 Astryx 规则处理成 `astryx-base` 内的嵌套优先级层；它编译 Astryx 模块时使用 `astryx` 类名前缀，而预构建样式表使用 StyleX 默认的 `x`；其 Vite 构建的 Lightning CSS 处理与其 PostCSS 辅助工具的 Autoprefixer 处理会添加预构建样式表所没有的 `-webkit-` 声明；其 Vite 插件向每个页面注入它自己的层顺序注册，并带有一个 `product` 层；而且没有任何机制让 Core 的源码构建承载预构建 `lab.css` 所依赖的 Core 定义。要符合规范，就会改变它为当前用户输出的类名和层。
- 在 Turbopack 下，`withAstryx()` 从源码构建 Core、Lab、Rich Text 和 Charts；每个编译块都以 FR3 的顺序注册开头（FR7），当产品导入它所编译包的预构建样式表时，构建失败。`@astryxdesign/build/next/postcss` 用这些块替换应用样式表中的 `@astryx;` 标记，并像 loader 那样用 Babel 和 StyleX 插件再次编译每个包的模块。一个 Next.js 测试夹具在 Turbopack 下检查 FR9，`@astryxdesign/build` 中的一个脚本测量速度数字。
- 在 webpack 下，`withAstryx()` 尚未满足 FR9（实现缺口）：它用上述 `@astryxdesign/build` 设置从源码构建 Core 和 Lab，而 Rich Text 和 Charts 仍使用其预构建样式表，且该源码构建不在自身输出中输出顺序注册（FR7），而是依赖 `reset.css`、主题或产品自己写的那一行。弥补这些缺口会改变现有的 webpack 输出。
- FR7 对被 swizzle 副本的例外在 Babel、PostCSS 和 Vite 集成中成立。Turbopack 下的 `withAstryx()` 不读取 `astryx swizzle` 写入的 `astryx-swizzle.json` 标记（FR5、FR7）。在 webpack 下，`withAstryx()` 让每个应用模块依赖其上方的标记路径，因此当标记出现或消失时，缓存构建会重新编译该副本（FR7）。
- 在 Turbopack 下，原生管道中没有维护中的 StyleX 编译器运行，因此 FR9 的快速路径是一个存在已知缺口的目标：Turbopack 路线通过运行 Babel 和 StyleX Babel 插件的 JavaScript loader 编译 Astryx 模块，速度预算为报告而非强制执行。

- Lab、Rich Text 和 Charts 只在其 README 中记录样式表；样式概览的导入表只列出 Core（FR6）。
- 拉取请求体积报告不测量任何样式表，因此不报告任何 CSS 体积或增量，也不标记任何仅触摸 CSS（FR8）。其 JavaScript 数字是一个组件的再导出文件，而不是其导入所引入的内容，其 before 与 delta 列始终为空，也没有任何机制标记仅触摸 JavaScript（`architecture:component-style-authoring` INV6）。
- `styling-overview`、`getting-started` 和 `migration-setup` 使用方文档会发生变化。包样式表规则和类名在其他方面不变。

## Verification

| 契约    | 验证                                                                                     | 代表性状态                                                                                                                                                                                                                                                                                                            | 变异或失败预期                                                                                                                                                                                                                    |
| ------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1     | 包清单与样式表构建测试                                                                   | 每个带样式的已发布包；某个模块的规则出现在其包样式表中                                                                                                                                                                                                                                                                | 某个带样式的已发布包没有 `.css` 导出；某个模块用到的规则缺失                                                                                                                                                                      |
| FR2     | 无 StyleX 编译器时的真实浏览器计算样式                                                   | 每个包的一个代表性组件；默认、hover、focus、disabled、深色和从右到左                                                                                                                                                                                                                                                  | 移除包样式表会改变某个计算样式；非 Core 样式表重复了 `astryx.css` 已声明的组                                                                                                                                                      |
| FR3     | 样式表结构测试与真实浏览器级联                                                           | 每个包样式表和 `reset.css`；主题最先和最后；包样式表按任意顺序；`reset.css` 最后；一个主题覆盖                                                                                                                                                                                                                        | 出现未分层规则或其他层；顺序注册缺失或被重排；主题覆盖在任意加载顺序下落败                                                                                                                                                        |
| FR4     | 打包后包与打包器测试夹具                                                                 | 生产打包中每个包的样式表导入                                                                                                                                                                                                                                                                                          | 该子路径无法从打包后的包解析；打包产物丢弃了样式表                                                                                                                                                                                |
| FR5–FR6 | 使用方文档检查                                                                           | 样式概览、入门和迁移设置中的每个设置片段；每个包的 README                                                                                                                                                                                                                                                             | 默认设置遗漏了 `astryx.css` 或某个已用包的样式表；某个设置既加载预构建样式表又编译同一包的源码；缺少某个包的导入                                                                                                                  |
| FR7     | 构建包编译测试与真实浏览器级联                                                           | 通过构建包编译的每个 Core 模块；模块子集；开发构建；Core 从源码构建而 Lab 使用预构建样式表；主题覆盖下的源码构建组件                                                                                                                                                                                                  | 全模块编译与预构建规则或顺序不一致；某条 Astryx 规则位于嵌套层或其他层；主题覆盖落败                                                                                                                                              |
| FR8     | 针对 base 的拉取请求体积报告                                                             | 样式发生变化的组件；一个仅触摸特性给单个组件增加 0.9 KB 和 1.1 KB gzip CSS；没有样式改动的拉取请求                                                                                                                                                                                                                    | 发生变化的包样式表或组件缺少 base 对 head 的 gzip 数字；某仅触摸特性每组件超过 1 KB gzip CSS 却未被标记                                                                                                                           |
| FR9     | 在 Turbopack 和 webpack 下的 Next.js 测试夹具应用，真实浏览器计算样式，构建 trace 与耗时 | 一个导入 Core、Rich Text、Lab 和 Charts 的测试夹具应用，在每种打包器下用 `next dev` 和 `next build` 构建；对每个包，一个产品类和一个产品 StyleX 规则覆盖某条基础规则，以及一个主题覆盖某条基础规则；反转 chunk 顺序并移除产品的顺序行；构建前从已安装包中删除每个预构建包样式表；与同一应用在预构建样式表上的速度对比 | 产品覆盖或主题落败；删除的预构建样式表破坏构建或改变某个计算样式；输出的选择器与源码编译不同；某个包的编译块缺少顺序注册；速度数字缺失（只有在存在原生 Turbopack 路线后才以超出预算判为失败，并报告 Astryx 文件上的 loader 数量） |

真实浏览器级联检查使用一个主题会改变其基础颜色的组件，例如一个重新设计 destructive Button 样式的主题，并在每种加载顺序下断言该主题的颜色。

## Decision log

### DEC-1 — Prebuilt stylesheets are the default; a source build compiles the same way

**Reference:** `spec:AST-080/DEC-1`

**Decider:** `cixzhang`, `2026-10-15`

大多数产品不需要为 Astryx 使用编译器，因此预构建样式表仍是默认，每个默认设置都无需编译器即可工作。只想要它所交付模块的 CSS 的产品，可以通过 `@astryxdesign/build` 编译 Astryx 源码。第二次编译若在预构建样式表旁再加一份规则副本，或用其他设置、编译到另一层，就会破坏主题覆盖。源码构建替换包的样式表，并按预构建样式表的编译方式编译到同一个单一层中，因此包交付并测试的级联保持成立。

已否决：禁止源码构建，这会让产品无法只加载它用到的 CSS；以及用随包交付的数据从预构建样式表中移除规则，这会增加一种要维护的格式和第二种构建同样规则的方式。

### DEC-2 — Every package shares one layer and one order registration

**Reference:** `spec:AST-080/DEC-2`

**Decider:** `cixzhang`, `2026-10-15`

主题覆盖针对的是组件，而不是交付它的包，因此每个包的基础规则都位于 `astryx-base`。每个样式表自行注册顺序，因此它绝不依赖产品的第一行。

已否决：每个包一个层，因为那样主题层顺序将取决于产品加载哪些包。

### DEC-3 — Each package ships one whole stylesheet

**Reference:** `spec:AST-080/DEC-3`

**Decider:** `cixzhang`, `2026-10-15`

每个包一个文件让设置保持为每个包一次导入，并在每个框架中都能工作。

已否决：由组件模块导入样式表，因为某些框架不会加载依赖模块导入的样式表。

### DEC-4 — Component size is reported on every change and budgeted for touch-only work

**Reference:** `spec:AST-080/DEC-4`

**Decider:** `cixzhang`, `2026-10-24`

由于每个包的预构建样式表整体交付（DEC-3）且是默认设置（DEC-1），仅为触摸设备使用的特性所写的 CSS 仍会让该设置下的每个桌面产品付出代价，而除非每次改动都报告，没人看得到这份代价。对每个拉取请求给出按组件的报告，让增长可见，无论是一个组件的导入所引入的 JavaScript 还是其 CSS。仅触摸的工作在每组件 2 KB gzip JavaScript 或 1 KB gzip CSS 时被标记：JavaScript 可以惰性加载、只在粗指针需要时加载，或者被证明合理；而留在样式表中的 CSS 则需证明合理。共享的 JavaScript 值表只向组件交付它用到的行，因此一个组件的调参不会随每次导入一起带上。

已否决：把仅触摸 CSS 拆成单独样式表，因为这会破坏 DEC-3 保持的一次导入设置。

### DEC-5 — Touch JavaScript comes from the shared internal touch modules

**Reference:** `spec:AST-080/DEC-5`

**Decider:** `cixzhang`, `2026-10-26`

超出预算的触摸基元来自组件导入的共享内部触摸模块（`architecture:react-component-runtime` INV13），页面只携带它一次，否则需证明代价合理；组件不会惰性加载自己的模块。没有安装步骤：这些模块始终存在。这取代了 DEC-4 的惰性加载补救措施；其报告与预算仍然有效。

已否决：在每个组件内部惰性加载，以及由应用安装的模块。

### DEC-6 — Source builds cover Turbopack and every styled package; the fast path is the goal

**Reference:** `spec:AST-080/DEC-6`

**Decider:** `cixzhang`, `2026-11-01`

Next.js 默认使用 Turbopack 构建，因此 `withAstryx()` 同时支持 Turbopack 和 webpack，覆盖包括 Rich Text 和 Charts 在内的每个带样式包。支持意味着真正编译包源码，并保证 Astryx 顺序相对于产品样式成立，而不是在预构建样式表外做包装。理想情况下 Turbopack 构建停留在 Turbopack 原生管道中；那里没有维护中的 StyleX 编译器，因此接受 loader 路线，记录该缺口，并在原生路线存在前报告速度预算。

已否决：让 Turbopack 保持不受支持，这会让使用默认打包器的产品无法进行源码构建。

## Open questions

无。
