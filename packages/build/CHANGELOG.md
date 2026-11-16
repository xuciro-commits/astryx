# @astryxdesign/build

# 0.7.16

---

# 0.7.15

---

# 0.7.14

---

# 0.7.13

#### 问题修复

- 依赖下限提升至当前版本：build 包需要 autoprefixer 10.6.2、browserslist 4.29.5 和 lightningcss 1.33.0；CLI 需要 ignore 7.0.14、jscodeshift 17.4.0、linkedom 0.18.15、zod 4.6.7 和 @stylexjs/babel-plugin 0.19.1；每个主题需要 lucide-react 1.66.0。Peer 范围不变。(#10709)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.12

#### 问题修复

- swizzle 出来的副本现在可以在 Babel、PostCSS 和 Vite 集成中作为 Astryx 源码编译。包含 `astryx-swizzle.json` 标记文件的文件夹下的每个模块都会获得库类名前缀，并落入 `astryx-theme` 之下的 `@layer astryx-base`，因此主题的组件覆盖能够作用到它。`astryx swizzle` 目前还不会写入该标记文件：请手动将该文件添加到 swizzle 输出文件夹。在 webpack 下，`withAstryx()` 会在标记文件出现或消失时重建缓存的副本。Turbopack 构建目前还不会读取该标记文件。无 API 变更。(#10334)
- `astryx swizzle` 会向它拥有的输出文件夹（副本创建的文件夹、空文件夹，或它之前标记过的文件夹）写入一个 `astryx-swizzle.json` 标记文件，其中标明该文件夹中的副本来自哪些包以及各包的版本。`@astryxdesign/build` 的 Babel、PostCSS 和 Vite 集成，以及 webpack 下的 `withAstryx()`，会把该文件夹中的副本编译到 `astryx-theme` 之下，因此主题的组件覆盖能像作用于包内组件那样作用于 swizzle 出来的组件。对于已经存放其他文件的文件夹，它不会写入标记文件，而是说明它发现了什么以及如何手动添加标记文件；`swizzle.copy` 的 receipt 会在新增的可选 `marker` 字段中报告这一点。在 Turbopack 下以及使用原生 StyleX 插件时，副本的样式仍会落在主题之上。该标记文件不会列入副本的文件清单中。(#10483)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.11

---

# 0.7.10

---

# 0.7.9

---

# 0.7.8

---

# 0.7.7

#### 新功能

- `withAstryx()` 在 Turbopack 下改为从源码构建 Astryx，而不是拒绝构建。它把每个包文档化的入口点指向其源码（Core、Lab、Charts 和 Rich Text），用预构建样式表所使用的设置编译这些源码，并让应用自身的 Turbopack 规则不作用于它。新的 PostCSS 插件 `@astryxdesign/build/next/postcss` 会把 `@astryx;` 规则替换为每个源码构建包的预构建样式表，这些样式表从该源码编译而来：规则和选择器相同，顺序相同，位于 `@layer astryx-base` 内。要完成设置，请在应用的 PostCSS 配置中列出 `@astryxdesign/build/next/postcss`，并在应用的全局样式表中放入一条 `@astryx;` 规则（选项 `cwd` 即应用根目录，默认为工作目录）。在 Turbopack 下，webpack 设置中的 `@astryxdesign/build/postcss` 会拒绝与 `withAstryx()` 一起运行，因为它的规则永远不会匹配 Turbopack 渲染出的类名。在此源码构建中，已安装的 Astryx 包如果 `package.json` 格式有误，会令构建失败，而不是被忽略。webpack 设置保持不变：它从源码构建 Core 和 Lab，而 Rich Text 和 Charts 在该设置下继续使用预构建样式表。

#### 其他变更

- 预构建样式表构建与 Turbopack 源码构建共用同一个模块遍历、编译和分层代码块，因此源码构建会按构造方式输出预构建规则。每个预构建样式表的字节内容保持不变。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @vjeux

---

# 0.7.6

#### 新功能

- 使用 `astryxStylex` 的生产构建在其样式表读取某个没有任何声明的 StyleX 生成自定义属性时会发出警告，并指出该变量以及读取它的规则。它会检查构建所使用的类名前缀，包括 `stylexOverrides.classNamePrefix`，并且绝不会报告应用自身 CSS 中声明的自定义属性。(#8075)

#### 问题修复

- `astryxStylex` 现在可以解析从另一个文件读取的 `defineConsts` 值。使用 `{stylexOptions}` 形式（Storybook 使用的形式）时，如果一个文件只从 `.stylex.ts` 模块读取常量，StyleX 编译后该导入会丢失，导致这些常量从未进入 CSS：用作媒体查询键的常量会导致构建失败（"Invalid empty selector"），而用作值的常量则会作为没有任何声明的自定义属性发布。无论采用哪种形式，定义在分层拆分另一侧的常量，或者定义在 Astryx 包中（使用库类名前缀编译）并从应用文件读取（使用其自身前缀编译）的常量，都会保持未解析状态。(#8075)
- 已发布的包不再包含仓库的测试和基准测试文件，从而在保持导出不变的同时减小安装体积。(#9153)

#### 文档

- README 中的 Next.js 设置说明，其 Babel 配置会关闭 SWC，而 `next/font` 需要 SWC，因此新建的 `create-next-app` 布局必须先移除 `next/font` 导入，webpack 源码构建才能编译。(#9439)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @parinith-web
- @vjeux

---

# 0.7.5

#### 文档

- 包链接现在指向项目的 GitHub 主页 `meta/astryx`。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.7.4

---

# 0.7.3

---

# 0.7.2

#### 问题修复

- `withAstryx()` 在 pnpm 默认的隔离布局下重新可以构建。它不再关闭 webpack 的符号链接解析，因为那会隐藏每个 Astryx 包自身的依赖（`Can't resolve 'intl-messageformat'`、`'lucide-react'`）。Astryx 模块仍按其真实路径匹配，因此工作区链接的包仍能解析其 `source` 条目。
- PostCSS 插件现在会扫描每个已安装 Astryx 包实际发布的内容（其 `files` 字段；若没有该字段，则为整个包减去嵌套的 `node_modules`），而不是扫描 `node_modules/@astryxdesign` 下的所有内容。从工作区链接的包不再拖入自身的 `node_modules`（其中的链接可能循环回该包，导致构建内存耗尽），也不再拖入未发布的测试夹具。从注册表安装的包扫描的文件与之前相同。

#### 性能

- PostCSS 插件在编译 Astryx 源码时不再加载应用的根 Babel 配置。在文档化的 Next.js 设置中，该配置（`next/babel` 加上 Astryx 的 StyleX 插件）每次构建都会跑遍每个已安装的 Astryx 模块，而插件只是为了读取 StyleX 元数据，这使 CSS 处理大约翻倍。输出的 CSS 保持不变，应用自身的文件仍用其配置编译。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @vjeux

---

# 0.7.1

---

# 0.7.0

#### 问题修复

- 通过将 Lightning CSS 默认设为 Astryx 支持的浏览器下限，在 Vite 源码构建中默认保留原生 `light-dark()` token 值。(#7330)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.6.8

---

# 0.6.7

---

# 0.6.6

---

# 0.6.5

---

# 0.6.4

#### 问题修复

- 将 PostCSS 和 Vite 处理保持在 `@astryxdesign/build` 声明的依赖边界之内 (#6605)
  打包后的消费者不再依赖工作区提升来查找 PostCSS 辅助函数或 CSS 兼容性处理器。该包现在自行拥有 Autoprefixer、Browserslist 和 Lightning CSS，并且有一项干净的隔离安装测试来验证发布 tarball 的 PostCSS 辅助函数和 Vite 输出。
- 让源码构建在遇到不支持的 StyleX 声明时失败，并从每个 Vite HTML 入口加载共享的 StyleX 输出。
  嵌套伪元素和 `stylex.keyframes()` 现在已有生产构建回归覆盖，维护中的能力注册表会跟踪已安装的 StyleX 版本。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.6.3

---

# 0.6.2

---

# 0.6.1

---

# 0.6.0

#### 问题修复

- `withAstryx()` 在遇到 Turbopack 配置时会拒绝，而不是构建出一个没有样式的应用。该辅助函数安装的每个别名都位于 `nextConfig.webpack` 中，而 Turbopack 从不调用它，因此应用会把 `@astryxdesign/*` 解析到 dist，而 PostCSS 却从源码编译该库——类名彼此不一致、退出码为 0、页面没有样式。现在它会抛出错误，并指出两条出路：`--webpack`，或者去掉该辅助函数并改用预构建包。当合并后的别名映射没有覆盖任何包时，它也会发出警告，因为这通过另一条路径导致同样的无样式状态。(#6109)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @joaodotwork

---

# 0.5.4

---

# 0.5.3

#### 问题修复

- `withAstryx()` 现在会把应用自身对 `@astryxdesign/*` 的导入解析到各包的 `source` 条目。作用域限定的 webpack 规则只管理从 `node_modules` 内部发出的请求，因此应用代码会通过 `default` 把库解析到 `dist`，而 PostCSS 却从源码编译它——两者产出的类名互不相交，应用会在不报错的情况下渲染成无样式。(#5932)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @PRIEYAN

---

# 0.5.2

---

# 0.5.1

#### 问题修复

- Vite 构建：Astryx 和产品样式被拆分为各自的级联层，因此主题的组件覆盖在生产构建中也能生效 (#5410)
  StyleX 把它收集到的每条规则都输出到一个顶层 `@layer priority1…priorityN` 中。开发服务器会按源文件重新提供这些分区后的规则——Astryx 自身的样式进入 `astryx-base`，应用的样式进入 `product`——但构建过程两者都没做，因此优先级层落在 `@layer reset, astryx-base, astryx-theme, product` 顺序之外，并压倒了整个顺序。主题设置的每个 `components: {…}` 覆盖——颜色、圆角、公共自定义属性——在构建后的应用中都被静默丢弃，而在开发环境中却正常工作。

  现在构建会通过与开发服务器相同的辅助函数执行相同的分区，因此承诺的顺序在两者中都成立：Astryx 的样式可以被主题覆盖，而应用自身的样式仍然优先于一切。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.5.0

---

# 0.4.7

---

# 0.4.6

---

# 0.4.5

---

# 0.4.4

---

# 0.4.3

---

# 0.4.2

---

# 0.4.1

---

# 0.4.0

#### 问题修复

- build：以静态方式导入 `node:fs`，让 Vite 插件的包发现逻辑在 ESM 构建中存活 (#4972)
  `astryxStylex()` 的配置插件用 `require('node:fs')` 发现已安装的 `@astryxdesign/*` 包。`./vite` 导出只发布 ESM bundle（`dist/vite.mjs`，esbuild `format: 'esm'`），esbuild 会把 `require` 降级为一个 shim，该 shim 抛出 `Dynamic require of "node:fs" is not supported`——而且总是如此，因为在 ESM 下原生 `require` 从不存在。周围的 `try/catch` 吞掉了该异常，于是 `optimizeDeps.exclude` 静默回退到 `['@astryxdesign/core']`，其他所有已安装的 Astryx 包仍然有资格被 Vite 预打包，而预打包会剥离 `stylex.create`/`defineVars` 调用并导致运行时错误。

  现在发现逻辑使用静态的 `import fs from 'node:fs'`，esbuild 会将其保留为真正的 ESM 导入。一项回归测试用与 `build.mjs` 相同的 esbuild 选项编译 `vite.ts`，并在子 `node` 进程中运行发现逻辑，因为进程内测试运行器提供的 `require` shim 会掩盖该缺陷。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @is-jain

---

# 0.3.0

---

# 0.2.0

---

# 0.1.9

#### 问题修复

- 在 withAstryx 中将 `source` 解析条件限定到 @astryxdesign 包
  `withAstryx` 全局地把 webpack 的 `conditionNames` 设置为 `['source', …]`，这会把*任何*提供 `source` 导出的依赖解析为其原始 TypeScript——而不只是 Astryx 包。提供 `source` 导出的第三方依赖（例如 `lexical`，由新的 RichTextEditor lab 组件引入）随后通过 Next 的 babel 接收到未经转译的 `.ts`，并在 `declare` 类字段之类的语法上失败。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @potatowagon

---

# 0.1.8

---

# 0.1.7

---

# 0.1.6

---

# 0.1.5

#### 其他变更

- Node.js 内置模块导入使用 node: 协议前缀 (#3737)

#### 贡献者

感谢所有为本版本做出贡献的人：

- @Han5991

---

# 0.1.4

---

# 0.1.3

#### 问题修复

- 在 `prepack` 脚本中使用 `pnpm build`，使发布不再触发 `devEngines` 包管理器检查失败 (#3564)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang

---

# 0.1.2

#### 问题修复

- 为 `@astryxdesign/build/vite` 导出提供 TypeScript 声明

#### 贡献者

感谢所有为本版本做出贡献的人：

- @benjipeng

---

# 0.1.1

#### 破坏性变更

- 重命名 `@xds/build` 的导出，去掉 xds 名称
  Vite 集成的公共导出已重命名：`xdsStylex` -> `astryxStylex`，选项类型 `XDSVitePluginOptions` / `XDSVitePluginLegacyOptions` -> `AstryxVitePluginOptions` / `AstryxVitePluginLegacyOptions`。请相应更新来自 `@xds/build/vite` 的导入。内部插件名称和 babel 包装器也已改名。这是从公共 API 中移除 `xds` 命名工作的一部分。
- 将 Next.js 辅助函数 `withXDS` 重命名为 `withAstryx`
  Next.js 配置包装器已重命名：`withXDS` -> `withAstryx`（从 `@astryxdesign/build/next` 导出）。请更新你的 `next.config.mjs`：`import {withAstryx} from '@astryxdesign/build/next'`。这是从公共 API 中移除 xds 命名工作的一部分。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @ejhammond

---

# 0.1.0

#### 破坏性变更

- 将 StyleX 库原子类前缀默认设为 `astryx`（原为 `xds`）
  `@astryxdesign/build` 的 babel/Vite 集成现在默认把库原子类输出为 `.astryx78zum5`，而不是 `.xds78zum5`（`libraryPrefix` / `stylexPrefix` 选项的默认值从 `xds` 翻转为 `astryx`）。这是一个不透明的、由 StyleX 生成的命名空间——消费者不会直接针对这些类——但它完成了从构建输出中移除 `xds` 命名的工作。显式配置了 `libraryPrefix`/`stylexPrefix` 的消费者不受影响。
- 移除 XDS 前缀兼容层——astryx 现在是唯一的公共接口
  此版本从公共 API 中抹去所有 `xds` 命名；没有兼容窗口。消费者必须迁移（在开源前我们拥有所有消费者）：
- 移除 daily、brutalist 和 default 主题；neutral 成为新的基线
  三个主题包已从仓库移除，将不再发布：

#### 其他变更

- **组件名称：** `XDS*` 别名已移除——请使用裸名称（`Button` 而不是 `XDSButton`，`useTheme` 而不是 `useXDSTheme`，`ButtonProps` 而不是 `XDSButtonProps`）。`drop-xds-prefix-imports` codemod 可自动完成此操作。
- **CSS 类：** 组件只输出 `.astryx-*`（双份的 `.xds-*` 类已移除）。请将自定义 CSS 选择器 `.xds-button` -> `.astryx-button`（`.primary`/`.sm` 之类的 prop/状态值类保持不变）。
- **data 属性：** 只写入 `data-astryx-theme` / `data-astryx-media`；请将自定义选择器和 SSR 根属性从 `data-xds-*` 更新过来。
- **CSS 层：** `@layer xds-base` / `xds-theme` 已重命名为 `astryx-base` / `astryx-theme`；请更新你的 `@layer` 顺序行以及任何 PostCSS `layersBefore` 配置。`@astryxdesign/build` 的默认库层现在为 `astryx-base`。
- **预编译样式表：** `@astryxdesign/core/xds.css` 导出已移除——请导入 `@astryxdesign/core/astryx.css`。
- **CSS 自定义属性：** `--xds-*` padding 回退已移除；请设置 `--astryx-*`。
- **CLI 配置键：** `@astryxdesign/cli` 读取 package.json 的 `"astryx"` 字段（原为 `"xds"`）。请重命名该块；过时的 `"xds"` 键会让该包从发现中静默消失。
- `@astryxdesign/theme-daily`
- `@astryxdesign/theme-brutalist`
- `@astryxdesign/theme-default`
- import {defaultTheme} from '@astryxdesign/theme-default/built';
  - import {neutralTheme} from '@astryxdesign/theme-neutral/built';
- <Theme theme={defaultTheme}>...</Theme>
  - <Theme theme={neutralTheme}>...</Theme>

  ```

  ```

- 将 npm 包 scope 从 `@xds/*` 重命名为 `@astryxdesign/*`
  所有已发布的包都迁移到新的 `@astryxdesign` scope（例如 `@xds/core` → `@astryxdesign/core`），同时还有工作区锁文件、构建时/运行时 scope 目录扫描以及 docsite slug 推导。消费者必须更新其导入和依赖名称。内部 ESLint 插件命名空间（`@xds/*` 规则）有意保持不变，另行跟踪。现有的 `@xds/*` codemod 继续面向旧 scope，以便仍在使用 `@xds/*` 的项目可以迁移。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @ejhammond

---

# 0.0.15

#### 问题修复

- **无前缀迁移对齐** — 构建输出和 Vite 插件已针对 XDS 前缀迁移更新（裸名称成为规范，`XDS*` 为兼容别名），使生成的 CSS 与 `@xds/core` 保持同步 (#2941)。

#### 贡献者

感谢所有为本版本做出贡献的人：

- @cixzhang
- @czarandy
- @ejhammond
- @josephfarina

---

# 0.0.14

_首次公开发布_ — `@xds/build` 现已发布到 npm 注册表。

#### 新功能

- **精简的 `xdsStylex()` Vite API** — 简化 Vite 项目的配置 (#2227)
- **Vite 插件的构建步骤** — 为 Vite 集成提供正确的 dist 输出 (#2205)

#### 内部

- **迁移到 pnpm** (#2197)
- **升级 esbuild** 从 0.24.2 到 0.28.0 (#2246)
