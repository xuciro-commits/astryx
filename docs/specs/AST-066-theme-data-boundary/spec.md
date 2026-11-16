---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-066
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-20
phase: accepted
owners: [cixzhang]
affects_architecture:
  [
    architecture:theme-compilation,
    architecture:theme-application,
    architecture:theme-tokens,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: [theme]
---

# StyleX data-token ownership system spec

## Prebuilt Core CSS carries the data-token defaults

预构建模式下公开的 `dataVars` 条目包含已编译的 `var()` 引用，而不是一次 `defineVars()` 调用。使用该条目和随包发布的 Core CSS 的应用没有可生成所引用默认值的 StyleX 提取步骤。因此 Core 的预构建样式表将该分组作为其公开 CSS 契约的一部分；主题是否存在并不控制它的可用性。

## Intent

Astryx 在与其其他设计令牌相同的公共 StyleX 令牌系统中拥有一个规范的 56 令牌数据调色板。组件导入公开的 StyleX 变量对象，而不是构造字面量 `var(--color-data-*)` 字符串。当源码编译的使用方使用该分组时，StyleX 编译器会输出该规范分组；在不使用它的基于图的源码构建中则省略该分组。无论使用方是否导入，Core 的预构建 `astryx.css` 和 `@astryxdesign/build` 的 PostCSS 集成都会包含该分组。

具体主题只在其已有的主题 donut 内输出该主题显式编写的那些数据令牌值。它绝不携带规范默认值或原始全局数据令牌块。未指定的数据颜色使用 StyleX 默认值和常规 CSS 继承；嵌套主题只改动它编写的那个子集。

公开的 CSS 自定义属性名、JavaScript 令牌解析、生成的 JavaScript 标记，以及三条已有的全局 `color-scheme` 规则保持稳定。运行时与构建主题编译产生相同的稀疏作用域覆盖。

StyleX 0.19 在模块/分组边界处对 `defineVars` 进行摇树优化，而不是按属性进行。56 个数据变量有意构成一个语义分组：当模块未被使用时，基于图的源码构建输出零个数据默认值；当任一成员被使用时，输出全部 56 个。预构建的 Core 样式表和 `@astryxdesign/build` 的 PostCSS 集成始终包含完整分组。本契约不声称编译器提供了令牌粒度的裁剪。

## Non-goals

- 更改 56 个规范数据默认值的名称或值。
- 新增一份独立的 CSS 默认值资产，或保留一份平行的纯 JavaScript 令牌族作为独立的真值来源。
- 让具体主题重复它们并未编写的默认值。
- 对三条已有的全局 `color-scheme` 选择器进行作用域限定、重命名或重新设计。
- 更改作用域文本默认值、非数据令牌声明、组件覆盖、适配、MediaTheme 规则、图标输出或类型增强。
- 定义 `@astryxdesign/build` 单独的源码构建组合契约，超出 FR3 对其 PostCSS 集成的数据分组保证。
- 发布排期与版本管理，超出 FR17 中的破坏性次版本要求。
- 当等效的内部实现满足本公开契约时，它们仍然有效。

## Requirements

### Canonical source, public API, and typing

- **FR1 — 公开的 StyleX 源码拥有每一个派生视图。** 检入仓库的 `dataTokens.stylex.ts` 模块必须是全部 56 个名称与默认值的唯一规范来源。它包含被 `stylex.defineVars()` 使用的静态对象字面量，并导出公开的 `dataVars` 对象。

  生成过程必须读取该 `.stylex.ts` 源码并产出：

  1. 现有的纯 `dataTokenDefaults` 兼容视图，且不把 StyleX 值模块导入常规令牌解析图；
  2. `DataTokenName` 与主题输入校验清单；以及
  3. 任何生成的文档清单。

  `dataTokenDefaults` 不得独立于 `dataVars` 手工维护。当生成的值、名称或类型偏离规范的 `.stylex.ts` 源码时，仓库检查必须失败。规范文件必须保留静态对象字面量，因为 StyleX 拒绝把导入的对象作为 `defineVars()` 参数。

- **FR2 — 数据变量是一个显式的公开 StyleX 子路径。** Core 必须从 `@astryxdesign/core/theme/dataTokens.stylex` 导出 `dataVars`。每个已有的公开自定义属性名都保持逐字节稳定，例如：

  ```ts
  import {dataVars} from '@astryxdesign/core/theme/dataTokens.stylex';

  const positive = dataVars['--color-data-categorical-green'];
  ```

  包的导出必须使用与 `@astryxdesign/core/theme/tokens.stylex` 相同的 `source`、`types` 和 `default` 条件形状；已有的 StyleX `sideEffects` 声明继续覆盖该源码模块。这个聚焦的子路径可防止普通的 Theme、令牌解析或非数据组件导入在源码编译中把 StyleX 变量组保留为副作用。在预构建模式下，同一公开条目提供已编译的 `var()` 引用；加载 `@astryxdesign/core/astryx.css` 必须提供它们的默认值，而无需使用方执行 StyleX 编译步骤。

- **FR3 — 摇树在分组边界上是诚实的。** 一次基于图的源码编译（即编译从产品导入可达的模块）若未从数据 StyleX 子路径做值导入，则必须不输出任何 `--color-data-*` 默认声明。保留任何 `dataVars` 值导入的图必须输出一个包含全部 56 个默认值的规范 StyleX 变量分组。导入一个成员不要求裁剪其余 55 个。

  `@astryxdesign/build` 的 PostCSS 集成编译 Core 发布的每个模块，而不是一个可达图。无论产品是否导入 `dataVars`，其输出都必须恰好包含一个规范的 56 变量分组，且包含每个规范名称与值。

  即使没有任何 Core 组件使用它，Core 的预构建 `@astryxdesign/core/astryx.css` 也必须恰好包含一个规范的 56 变量分组。包中已编译的公开 `dataVars` 条目所公开的 CSS 引用必须由该样式表定义；使用方导入无法从已编译条目触发提取。此例外仅适用于预构建的 Core 样式表和上述 PostCSS 集成，不适用于基于图的源码编译或具体主题。

  分发输出必须保持依赖感知：被引用的跨包 StyleX 变量依赖在卫星样式表与其必需的提供方样式表中恰好出现一次。提供方已声明该分组的数据使用方包不得重复它；没有该提供方时，被保留的分组必须被输出。除显式的 Core 分发例外之外，未被引用的分组仍然缺席。打包证据必须报告被保留分组的原始与压缩成本。

  受支持的源码与分发集成必须像其他 Astryx StyleX 输出一样，把输出的变量分组放在 `@layer astryx-base` 中。不带层的 StyleX 流水线在 FR8–FR10 的编写主题覆盖保证之外，必须被诊断或记录，而不是被静默地声称等效。

### Consumer behavior

- **FR4 — 支持 CSS 的使用方使用公开对象。** Astryx 的 TypeScript 与 TSX 使用方在把选定的值传给 StyleX、DOM 样式或 SVG 呈现属性时，必须导入 `dataVars`。它们不得构造字面量 `var(--color-data-*)` 字符串。这包括诸如 K 线涨/跌颜色的默认 prop 值。

  CanvasRenderingContext2D 及其他非 CSS API 不得接收 `dataVars` 的 `var()` 引用。它们必须使用现有的按模式解析的具体 JavaScript 路径，例如 `resolveThemeToken()` 或 `useTheme().token()`，与 FR13 保持一致。生成的兼容视图让该解析器仍然派生自同一份规范 `.stylex.ts` 源码。

  在预构建模式下，原始 CSS 与使用方代码可以引用稳定的 `var(--color-data-*)` 名称而不带任何回退：预构建的 Core 样式表在 FR3 下定义完整分组。源码构建的产品通过 `dataVars` 读取数据颜色，它会在源码图中保留该分组。`@astryxdesign/build` 的 PostCSS 集成在 FR3 下始终输出该分组；不导入 `dataVars` 的基于图的源码构建会让原始引用处于未定义状态，这不受支持。显式的本地回退在每种模式下仍然有效。文档不得暗示主题样式表本身会生成默认值。

- **FR5 — 直接的 SVG 与 DOM 值能正确绘制。** 直接传给 SVG 呈现属性或 DOM 样式的 `dataVars` 值必须编译为稳定的 `var(--color-data-*)` 引用。在源码编译中，该导入必须保留变量定义模块；在预构建模式下，Core 的样式表必须在 FR3 下提供该分组。默认值与主题覆盖值必须绘制出预期的 fill 与 stroke。未声明的数据变量会把 K 线实体绘成黑色并丢掉其灯芯描边；该状态不得再出现。

### Sparse theme output

- **FR6 — 具体主题只输出显式编写的数值。** 运行时与静态主题编译必须在默认值解析之前识别编写的输入集合。对于每个显式编写的 `--color-data-*` 名称，具体主题在其已有的 `astryx-theme` donut 中输出该声明：

  ```text
  @layer astryx-theme {
    @scope ([data-astryx-theme="ocean"]) to ([data-astryx-theme]) {
      :scope {
        --color-data-categorical-blue: light-dark(#0077B6, #48CAE4);
      }
    }
  }
  ```

  不编写任何数值的主题不输出任何声明。部分编写的集合恰好输出该子集。已解析的默认值、兼容映射与继承的父级值不得被序列化得像是主题编写了它们。

- **FR7 — 主题构建绝不输出原始全局数据默认值。** 无论是运行时 `<Theme>` 注入，还是独立、多文件或 family 的 `theme build` 输出，都不得在 `:root`、`html`、`body` 或其他 donut 之外的选择器上输出规范数据默认值。主题编译不得调用、内联或保留等同于 `generateDataTokenDefaultsCSS()` 的原始实现。在 FR3 下由源码使用方或 Core 分发保留的规范 StyleX 分组，是唯一的 CSS 默认值所有者。

  移除旧的默认值块不得移除其层顺序副作用。每个独立、多文件、family 与运行时主题输出都必须保留一个等同于以下内容的显式顺序注册：

  ```text
  @layer reset, astryx-base, astryx-theme;
  ```

  该注册不包含任何数据声明。无论主题 CSS 还是组件 CSS 先加载，它都保持 `astryx-base` 位于编写的主题覆盖之下。

### Cascade behavior

- **FR8 — 嵌套主题继承每一个未指定的数值。** 同标识与不同标识的嵌套主题都使用常规自定义属性继承。不编写任何数值的子主题继承父级的有效值。编写子集的子主题只在其 donut 内替换该子集；每个被省略的名称继续继承。仅改变标识并不会重置该调色板。

- **FR9 — 同级根对编写的覆盖保持隔离。** 一个 Theme 根中的作用域覆盖不得影响同级的 Theme 根。两个根都从同一个被保留的 StyleX 规范分组解析未指定的名称。

- **FR10 — 动态标识切换只选择编写的增量。** 在必需的 `reset < astryx-base < astryx-theme` 顺序下，且当所有目标主题样式表都已加载时，改变某个根的 theme 标识必须恰好添加、移除或替换所选主题的编写数据子集。每个被省略的名称都回退到继承的 StyleX 默认值或祖先值。在层顺序注册之后，物理样式表顺序不得改变胜出者。选择一个 CSS 缺失的已构建主题，仍属于使用方设置不完整。

- **FR11 — 浅色与深色保留现有的解析。** 规范与编写的 `light-dark()` 数值必须像其他 StyleX 变量一样从有效的 `color-scheme` 解析。显式浅色、显式深色、系统模式、MediaTheme、同主题嵌套与不同主题嵌套都保留现有的模式契约。

### Availability and JavaScript compatibility

- **FR12 — 可用性遵循编译模式，而非主题是否存在。** 没有已编译使用方保留 `dataVars` 的基于图的源码构建不包含数据变量默认值。Core 的预构建样式表在 FR3 下始终保留该分组，因为仅凭已编译的公开条目无法输出定义；而 `@astryxdesign/build` 的 PostCSS 集成始终保留它，因为它编译所有已发布的 Core 源码。在每种模式下，标准 StyleX 0.19 输出都会在 `:root` 上加上其变量分组类来声明完整分组，与已有的规范 StyleX 令牌分组完全一样。这个全局声明是所选规范令牌系统导致的、已被接受的编译器结果；它不得被归因于 theme build，也不得由 theme build 复制。

  在受支持的 Astryx 源码与分发集成中，输出的分组必须包裹在 `@layer astryx-base` 中。裸 StyleX 转换会输出相同的选择器但不带层；在文档根上，那个不带层的默认值会压过带层的主题覆盖，并可能让 portal 着色错误。这样的流水线在主题覆盖保证之外，必须被诊断或明确记录。

  只在 Theme 内部才需要数据变量的使用方必须在组件结构中实施该使用边界。本契约不声称被保留的 StyleX `defineVars` 分组不出现在无主题的 DOM 中。

- **FR13 — JavaScript 令牌解析保持兼容。** 现有的 `dataTokenDefaults`、`domainTokenDefaults`、`tokenDefaults`、`resolveThemeToken()`、`resolveThemeTokens()`、`useTheme().token()` 与 `useTheme().tokens` 名称与返回形状仍然可用。它们的规范数据值派生自 FR1。本工作不得把令牌 API 变成计算样式读取器，也不得改变它们现有的有提供方/无提供方语义。

### Runtime, built, and family parity

- **FR14 — 运行时与构建主题输出是等效的稀疏增量。** 对于相同的主题输入，运行时与静态编译输出相同的编写数据名称、数值、层、选择器与 donut 边界。两条路径都不输出默认值。生成的 JavaScript 仍为 `__built: true`；该标记继续表示具体主题 CSS 已加载，运行时编译被跳过。不添加回退数据注入或第二个标记。

- **FR15 — family 输出只包含成员编写的子集。** 一个 family CSS 文件在该成员的标识下包含每个所选成员的显式数据覆盖。零数据增量的成员不贡献任何数据声明。family 文件绝不重复规范的 56。嵌套成员遵循 FR8，切换遵循 FR10，family 文件最多输出一次全局 color-scheme 策略。

### Global color-scheme compatibility

- **FR16 — 完整的包可以保留一份兼容的全局环境策略。** 一个具体包可以继续输出恰好以下三条规则：

  ```text
  @layer astryx-theme {
    :root { color-scheme: light dark; }
    html[data-theme="light"] { color-scheme: light; }
    html[data-theme="dark"] { color-scheme: dark; }
  }
  ```

  输出该策略的独立具体包必须输出全部三个字节等效的选择器、声明与层归属。主题不得特化、部分输出、重排或以其他方式偏离该策略。独立包只有作为完整集合时才能省略该策略。family 聚合保留其现有的按标识限定作用域的 color-scheme 组合；本规格既不重新设计该组合，也不把它当作新的具体主题策略。这些环境声明不允许 theme build 全局输出数据默认值。

### Compatibility, migration, and documentation

- **FR17 — 归属迁移使用破坏性的 0.x 路径。** 移除 theme build 全局默认值的第一个版本必须使用仓库的破坏性变更流程：对受影响的 0.x 包使用次版本号、一个破坏性 Changeset 与迁移说明。对于图不保留 `dataVars` 的原始数据变量使用方、依赖具体主题 CSS 来定义全局值的使用方，以及仍包含旧 root 块的生成产物，这个破坏是可观察的。

- **FR18 — 迁移优先使用公开导入，而非兼容 CSS。** 当源码支持 StyleX 时，Astryx 组件、测试夹具、示例与测试的迁移必须用 `dataVars` 引用替换可构造的字面量字符串。升级工具与重新生成必须拒绝陈旧的原始 root 默认值。升级工具不检查直接的原始使用方，并且不得要求它们提供回退。已经带有显式回退的原始 CSS 与生成模板保持有效。迁移不得添加传统全局数据主题模式、提供方 prop、sidecar 样式表、任意的 Theme 包装器或臆造的回退颜色。

- **FR19 — 主题输入校验与 CLI 输出保持真实。** 每个稳定的数据名称仍然是有效的主题输入，每个未知名称仍然被拒绝。theme build 保持其当前的 CSS/JS/声明文件名与配对，但生成的 CSS 与文档必须把数据声明描述为编写的稀疏覆盖。`--check` 与升级校验必须让仍包含规范 root 块或主题作用域内未编写默认值的旧产物失败。

- **FR20 — 使用方文档区分三条路径。** 文档必须展示：(1) 用于支持 StyleX 的组件代码的 `dataVars`，即源码构建使用的路径；(2) 用于需要具体按模式解析值的 API 的 JavaScript 令牌解析；以及 (3) 预构建模式下原始 CSS 自定义属性的用法，此时由 `@astryxdesign/core/astryx.css` 提供默认值，或带有显式回退。文档必须如实说明整组摇树，并把 color-scheme 兼容性与发布工作留在本次变更之外。

### Platform support

- 支持的浏览器下限：现有的 Theme、StyleX 与 `@scope` 矩阵。
- 不支持的行为：低于该下限的浏览器沿用现有的支持策略；不新增全局的 theme build 数据回退。
- 浏览器证据：Verification 中矩阵范围内的真实 Chromium 计算样式与已绘制的 SVG 值。

## Current-state impact

公开的 StyleX 数据分组拥有规范 CSS 默认值；兼容性、类型、校验与文档视图都从它派生。基于图的源码编译保留整组摇树。Core 的预构建样式表为已编译的公开 `dataVars` 条目提供同一分组，无需使用方编译步骤或运行时 Theme 注入，而 `@astryxdesign/build` 的 PostCSS 集成始终输出它。

具体独立主题与 family 主题只包含编写的限定作用域覆盖。嵌套主题继承省略项，JavaScript 解析保持兼容，全局 `color-scheme` 规则、构建标记、文件名以及配对的 CSS/JS/类型输出都不变。

`architecture:theme-compilation` 拥有运行时/静态稀疏主题输出。`architecture:theme-application` 拥有提供方嵌套与样式生命周期。`architecture:theme-tokens` 拥有共享词汇与派生的兼容视图；本记录的 FR3 拥有预构建与 PostCSS 数据分组可用性保证。在该保证之外，`spec:AST-080` 管辖 `@astryxdesign/build`。

## Verification

| 契约      | 验证                                                          | 代表性状态                                                                                                                                   | 变异或失败预期                                                                                                                                           |
| --------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1–FR3   | 生成器漂移、公共导出、图感知编译器、PostCSS 集成与包 CSS 测试 | 不含导入的基于图的源码图；没有导入 `dataVars` 的 PostCSS 构建，开发与生产模式；预构建 Core；一个被保留的成员；跨包提供方配对；原始/gzip 大小 | 纯默认值漂移；公共键变化；未使用的基于图的源码输出了数据变量；预构建 Core 或 PostCSS 构建省略或改变了任何一项；一次使用输出的数量少于或多于 56；分组重复 |
| FR4–FR5   | 源码审计、编译器测试夹具、组件测试、真实 Chromium             | 直接的 SVG fill/stroke；DOM 样式；Canvas 具体值解析；显式 props；规范绿/红；编写的覆盖                                                       | 仍存在字面量构造；直接的 CSS 值未保留定义；Canvas 收到 `var()`；实体绘成黑色或灯芯消失                                                                   |
| FR6–FR7   | 运行时/静态/family 结构与层顺序测试                           | 零个/一个/多个编写的名称；全部 56 个规范名称；`:root`/html/body 扫描；主题 CSS 在组件 CSS 之前/之后                                          | 被省略的默认值被序列化；编写的数值落在 donut 之外；原始默认值仍在；层顺序反转                                                                            |
| FR8–FR11  | 真实浏览器层叠矩阵                                            | 相同/不同嵌套；父/子子集；同级根；动态切换；浅色/深色/系统/MediaTheme；portal；带层与不带层的源码 CSS                                        | 省略导致重置；同级根泄漏；顺序/模式改变胜出者；不带层的根静默声称与覆盖等效                                                                              |
| FR12–FR16 | 编译器/运行时/构建一致性与环境策略测试                        | 没有数据使用方；被保留的带层分组；运行时与构建主题；独立与 family 的 color-scheme 组合                                                       | 主题存在即输出默认值；构建与运行时不同；family 重复默认值；全局策略偏离                                                                                  |
| FR17–FR20 | Changeset、codemod、CLI 检查、文档与重新生成测试夹具          | 组件/测试夹具中的字面量用法；预构建与源码构建中带/不带回退的原始 CSS；旧的 root 产物；普通/family 构建                                       | 缺少破坏性说明；不安全的自动重写；陈旧产物通过检查；原始用法使升级失败；文档声称主题 CSS 提供默认值或令牌粒度裁剪                                        |

真实浏览器验证必须独立断言规范值与编写的数值，而不得把生成器输出复用为判据。它必须在移除变量声明的情况下复现黑实体/不可见灯芯状态，然后证明在公开 StyleX 导入之后 SVG fill 与 stroke 正确。它必须覆盖默认、显式 prop、父级覆盖、子集覆盖、相同/不同嵌套标识、同级根、动态切换、浅色/深色数值，以及从文档根继承的 portal 内容。非 CSS 验证必须通过 JavaScript 令牌 API 解析相同的规范颜色与编写的颜色，并断言 Canvas 赋值绝不收到 `var()` 引用。不带层的 StyleX 输出必须是一个红色分支：它必须证明为什么受支持的集成把规范默认值包裹在 `astryx-base` 中，而不是被报告为等效。

编译器验证必须通过基于图的流水线编译一个未使用的条目和一个单成员使用方。未使用的输出包含零个 `--color-data-*` 默认值；被保留的输出在 StyleX 变量分组中恰好包含每个规范名称一次。它不得声称按属性裁剪。PostCSS 集成验证必须在开发与生产模式下，把文档化的配置运行在一个不导入 `dataVars` 的产品上，并把输出与规范源码比较：在 `@layer astryx-base` 内的 `:root` 上，每个名称与值都恰好声明一次。分发验证必须证明 Core 的预构建样式表恰好一次定义全部 56 个规范值，且卫星/提供方配对不重复该分组。仅使用预构建 CSS 与已编译公开 `dataVars` 条目的生产应用必须在浅色/深色两种模式以及两种样式表加载顺序下绘制规范值与编写的数值。报告被保留分组的原始与 gzip 增量。

主题输出验证必须枚举全部 56 个规范名称，并在独立、多文件、family 或运行时 Theme CSS 中出现未编写的规范值时失败。它必须在 theme build 输出任何原始 `:root` 数据声明时失败，也必须在移除显式 `reset, astryx-base, astryx-theme` 顺序注册时失败。全局 color-scheme 验证另行在有代表性的输出包之间比较完整的独立三规则策略，断言不输出该策略的独立包不包含这三条中的任何一条，并保留现有的 family 组合。

### Completion criteria

一致性要求：

- 一个规范的 `.stylex.ts` 来源、一个公开的 `dataVars` 导出，以及生成的兼容/类型/校验视图；
- 基于图的源码构建中如实的整组摇树、PostCSS 集成输出中的完整分组，以及显式的预构建 Core 可用性保证，并具有依赖感知的卫星去重；
- 已迁移的 Astryx 使用方，且没有可构造的原始数据变量字符串；
- 在运行时、独立、多文件与 family 模式下，稀疏的 donut 覆盖与零 theme build 原始默认值；
- JS 令牌 API 与主题输入兼容性；
- 真实 Chromium 的 SVG/层叠证据，包括未声明变量的红色分支；
- 下游主题产物的重新生成与迁移证据；以及
- 独立的架构审查加上通过的 CI。

## Decision log

### DEC-1 — Public StyleX variables own canonical CSS defaults

**参考：** `spec:AST-066/DEC-1`

**决定者：** `cixzhang`，`2026-10-01`

数据调色板加入规范的 StyleX 令牌系统。检入仓库的 `.stylex.ts` 模块拥有名称与默认值，组件导入其具有稳定 CSS 名称的公开对象。纯 JavaScript 默认值、类型、校验与文档保持为生成的兼容视图，而不是第二个手工维护的权威。

已否决：把 `dataTokenDefaults` 保留为独立的 CSS 生成器输入。那正是让使用方与输出的 CSS 彼此不一致的平行元数据架构。

### DEC-2 — Tree-shake one semantic 56-variable group

**参考：** `spec:AST-066/DEC-2`

**决定者：** `cixzhang`，`2026-10-01`

StyleX 0.19 在其模块被保留时输出完整的 `defineVars` 分组，且无法裁剪单个对象属性。一个数据调色板分组与已有的 `colorVars` 模型一致，保持公共 API 连贯，并给出诚实的、源码编译下的零或 56 边界。预编译的包 CSS 跨包仍然图感知，FR3 中有显式的 Core 分发例外；它不使用全仓库文件扫描。DEC-10 将该边界限定为基于图的源码构建。

已否决：声称令牌粒度裁剪，或仅为模拟它而把调色板拆到许多文件中。两者都会让 API 与维护成本超出已证明的编译器能力。

### DEC-3 — Theme output contains authored deltas only

**参考：** `spec:AST-066/DEC-3`

**决定者：** `cixzhang`，`2026-10-01`

theme build 拥有定制，而非规范可用性。它只在常规 donut 中序列化显式的数据输入，绝不输出原始 root 默认值块。它保留仅含声明的层前奏，使得移除该块后，当 CSS 加载顺序变化时不会颠倒 `astryx-base` 与 `astryx-theme`。

已否决：把 56 个默认值复制进每个主题并保留一个无条件的 root 块。前者重复默认值；后者让 Theme 是否存在（而非实际的 StyleX 使用）拥有调色板。

### DEC-4 — Nested omission inherits

**参考：** `spec:AST-066/DEC-4`

**决定者：** `cixzhang`，`2026-10-01`

相同与不同的嵌套主题都继承每一个未指定的自定义属性，并且只替换编写的子集。仅有身份并不构成调色板重置。

已否决：把省略的值当作对规范默认值的编写请求。

### DEC-5 — Accept standard StyleX root emission when the group is retained

**参考：** `spec:AST-066/DEC-5`

**决定者：** `cixzhang`，`2026-10-01`

`stylex.defineVars(defaults)` 在 `:root` 上加上一个变量分组类输出其分组。这与已有的令牌分组是同一套规范机制。因此本决策中的严格边界在于归属：未使用的基于图的源码图不输出任何内容，Core 分发与 PostCSS 集成在 FR3（DEC-10）下保留该分组，而 theme build 绝不全局输出数据默认值。

已否决：承诺被保留的规范 StyleX 变量不出现在无主题的 DOM 中。标准 `defineVars` 无法做出该承诺；手工限定作用域的平行声明或无条件的 Theme 类会与选定的真值来源和摇树模型相矛盾。

### DEC-6 — Keep JavaScript resolution compatibility

**参考：** `spec:AST-066/DEC-6`

**决定者：** `cixzhang`，`2026-10-01`

现有的解析器名称、形状与模式行为仍由生成的兼容视图提供。这让 CSS 归属可以改变，而不必强迫已经需要具体值的调用方改用 DOM 计算样式 API。

已否决：删除 `dataTokenDefaults` 或把 `useTheme` 改为层叠读取器。修复 CSS 归属并不需要这两者。

### DEC-7 — Keep one compatible global color-scheme policy

**参考：** `spec:AST-066/DEC-7`

**决定者：** `cixzhang`，`2026-10-01`

这三条 root/html 规则有意配置浏览器范围的 `light-dark()` 与 UA 行为。完整的主题包在完全一致时可以重复它们，或省略整个集合。测试防止特化或部分输出。

已否决：对 color-scheme 打包进行作用域限定或拆分。

### DEC-8 — Migrate through an atomic stack and breaking minor

**参考：** `spec:AST-066/DEC-8`

**决定者：** `cixzhang`，`2026-10-01`

实现将规范公共 StyleX 归属、使用方迁移与主题生成器清理分开，使每次审查只有一个变更理由。发布使用破坏性的 0.x 次版本，并附带重新生成与使用方诊断。

已否决：传统全局数据模式。它会让新产物停留在此决策要移除的行为上，并使运行时/静态归属依赖模式。

### DEC-9 — Prebuilt Core CSS defines the public data-variable entry

**参考：** `spec:AST-066/DEC-9`

**决定者：** `cixzhang`，`2026-10-20`

预构建的公开 `dataVars` 条目包含 CSS `var()` 引用，其中没有存留的 `defineVars()` 调用。预构建 CSS 的使用方无法通过导入那个已编译对象来保留默认值。因此 Core 的样式表包含了这个唯一的规范分组，就像它的其他公共令牌默认值一样。基于图的源码编译保留零或 56 规则（DEC-10）；主题只包含编写的增量。固定成本是一组 56 条声明，而不是第二个来源或新的运行时模式。

已否决：要求预构建使用方编译源码令牌条目，因为这会破坏预构建 CSS 契约及其文档化的导入路径。

### DEC-10 — Source builds read data colors through `dataVars`

**参考：** `spec:AST-066/DEC-10`

**决定者：** `cixzhang`，`<pending>`

原始 `var(--color-data-*)` 字符串是预构建路径：Core 的样式表定义该分组（FR3、DEC-9）。源码构建通过 `dataVars` 读取数据颜色，它在基于图的流水线中保留该分组，并在那里维持 DEC-2 的零或 56 边界。`@astryxdesign/build` 的 PostCSS 集成编译 Core 发布的每个模块，因此其输出始终在 `astryx-base` 中携带完整分组。本决策把 DEC-2 的源码边界与 DEC-5 的未使用图规则限定为基于图的源码构建。升级工具对原始使用方不要求回退（FR18）；在没有 `dataVars` 导入的基于图的源码构建中，原始字符串不受支持（FR4）。

已否决：推断构建模式并要求回退的升级检查，因为没有任何项目信号能可靠区分预构建与源码构建。

## Deprecation and cleanup records

### IFIX-0009 — Themes stop emitting raw global data-color defaults

| Field         | Value                                                                                                                                                                                        |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id            | `IFIX-0009`                                                                                                                                                                                  |
| cleanup       | `CLN-0016`                                                                                                                                                                                   |
| package       | `@astryxdesign/core`, `@astryxdesign/cli`                                                                                                                                                    |
| surface       | `Theme` 运行时与 `theme build`（独立与 family）为每个主题输出的、由规范数据颜色默认值构成的未限定作用域原始 `:root` 块                                                                       |
| authority     | FR6（具体主题只输出显式编写的数值）、FR7（theme build 绝不输出原始全局数据默认值）与 FR12（可用性遵循编译模式，而非主题是否存在）。所有者：`spec:AST-066`：`cixzhang`                        |
| reproducer    | 使用最新的稳定包时，不编写任何数据颜色的主题会在运行时 CSS 与 `theme build` 输出中以未限定作用域的 root 块输出每一个规范数据默认值                                                           |
| affected      | 直接读取原始数据颜色自定义属性、依赖主题来定义它、且未编译 `dataVars` 使用方的 CSS；以及检入应用的陈旧生成主题 CSS                                                                           |
| matrix        | 不编写数据颜色的主题：之前是每个规范默认值，之后没有。编写的覆盖：之前与之后都输出，并限定在其主题作用域内。StyleX `dataVars` 使用方：之前与之后的绘制值相同。全局 `color-scheme` 规则：不变 |
| coexistence   | 公开的 `dataVars` 分组通过被保留的源码编译或预构建 Core 样式表提供规范值；仅编译导入并不会输出 CSS。                                                                                         |
| migration     | 通过公开的 `dataVars` 分组读取数据颜色，或在主题中编写所需的值。重新生成构建主题 CSS                                                                                                         |
| codemod       | `astryx upgrade` 运行一个校验器，拒绝陈旧的生成 CSS；直接的原始使用方不需要 codemod                                                                                                          |
| downstream    | 维护中的文档与模板通过 `dataVars` 读取数据颜色                                                                                                                                               |
| rollback      | 从最终补丁基线恢复运行时与 `theme build` 输出中的原始默认值块                                                                                                                                |
| harm of delay | 每个主题都会继续附带第二份全局调色板，它在没有任何使用方的情况下依然存在，并可能与规范的 StyleX 分组不一致                                                                                   |
| harm of apply | 在迁移之前，未使用 `dataVars` 或未编写值就读取原始数据变量的 CSS 会以该变量未设置的状态绘制                                                                                                  |
| transition    | 无先前的过渡                                                                                                                                                                                 |
| state         | `proposed`                                                                                                                                                                                   |
| open decision | 除批准这份提议中的记录及其清理之外，没有其他内容                                                                                                                                             |

### CLN-0016 — Remove raw global data-color defaults from theme output

| Field     | Value                                                                                                |
| --------- | ---------------------------------------------------------------------------------------------------- |
| id        | `CLN-0016`                                                                                           |
| lifecycle | `IFIX-0009`                                                                                          |
| delta     | 运行时与构建主题只输出编写的数值，并限定在其主题作用域内。显式的层顺序与全局 `color-scheme` 规则不变 |
| rollback  | 从最终补丁基线恢复原始默认值块                                                                       |
| state     | `pending` —— 随一个已声明的次版本及其 `[breaking]` Changeset 落地                                    |

## Open questions

无。
