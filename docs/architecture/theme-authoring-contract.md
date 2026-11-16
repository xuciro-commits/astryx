---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:theme-authoring-contract
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/theme/defineTheme.ts,
    packages/core/src/theme/themeAdaptations.ts,
    packages/core/src/theme/syntax/defineSyntaxTheme.ts,
    packages/core/src/theme/expandColorScale.ts,
    packages/core/src/theme/expandTypeScale.ts,
    packages/core/src/theme/expandRadiusScale.ts,
    packages/core/src/theme/expandMotionScale.ts,
    packages/core/src/theme/themeMotion.ts,
    packages/core/src/theme/motionKnobs.ts,
    packages/core/src/theme/mergeComponents.ts,
    packages/core/src/theme/onMediaTokens.ts,
    packages/core/src/theme/localTokens.ts,
    packages/themes/,
    packages/cli/assets/theme.template.ts,
  ]
verified_by:
  [
    packages/core/src/theme/defineTheme.test.ts,
    packages/core/src/theme/colorModeBlocks.test.ts,
    packages/core/src/theme/themeAdaptations.test.ts,
    packages/core/src/theme/syntax/serverSafeSyntax.test.ts,
    packages/core/src/theme/expandColorScale.test.ts,
    packages/core/src/theme/expandTypeScale.test.ts,
    packages/core/src/theme/expandRadiusScale.test.ts,
    packages/core/src/theme/expandMotionScale.test.ts,
    packages/core/src/theme/themeMotion.test.ts,
    packages/core/src/theme/onMediaTokens.test.ts,
    scripts/check-theme-template.test.mjs,
  ]
deciding_specs:
  [
    spec:AST-006/DEC-1,
    spec:AST-006/DEC-2,
    spec:AST-006/DEC-3,
    spec:AST-006/DEC-4,
    spec:AST-006/DEC-6,
    spec:AST-012/DEC-1,
    spec:AST-012/DEC-2,
    spec:AST-012/DEC-3,
    spec:AST-012/DEC-4,
    spec:AST-017/DEC-1,
    spec:AST-087/DEC-2,
    spec:AST-087/DEC-7,
    spec:AST-087/DEC-9,
    spec:AST-087/DEC-10,
    spec:AST-108/DEC-1,
  ]
---

# Theme authoring contract

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "theming": [
      "INV1",
      "INV3",
      "INV8",
      "INV9",
      "INV11",
      "INV12",
      "INV13",
      "INV14"
    ]
  }
}
```

本记录定义主题编写者可以表达的内容，以及 `defineTheme` 如何将该输入规范化为单一的、自包含的主题表示。

## Purpose

主题编写者应只描述一次设计意图。运行时挂载与静态构建应使用相同的规范化结果，而不是各自独立地重新解释源配置。

## System model

`DefineThemeInput` 接受：

- 一个名称，以及可选的规范化基础主题；
- 更高阶的颜色、排版、圆角和动效配置；
- 显式的语义令牌覆盖；
- 可选的、主题家族本地的令牌声明；
- 组件目标/样式键覆盖，每个覆盖可带有 `@light` 和 `@dark` 颜色模式块；
- 图标与指示器注册表、`componentIcons` 插槽映射，以及 `iconVariants` 列表；
- 语法令牌；
- `onDark` / `onLight` 表面覆盖；以及
- 有序的环境 `adaptations`，附带固定的具名宽度映射。

`defineTheme` 将该输入解析为扁平的 `DefinedTheme`。扩展主题包含其继承的已解析值，因此其规范化表示是完整的。独立构建不需要基础样式表。

规范化遵循一个优先级顺序：

1. 解析后的基础主题；
2. 由颜色、排版、圆角和动效配置生成的值；
3. 显式令牌覆盖；
4. 生成的组件排版，随后是显式的组件覆盖；
5. 继承的与显式的媒体表面覆盖；
6. 继承的与显式的主题本地声明，并针对解析后的令牌、组件和媒体表面进行验证；以及
7. 继承的与显式的图标/指示器注册表条目、`componentIcons` 条目，以及 `iconVariants` 列表。

显式值在其所属表面内胜出。组件映射按组件、样式键和 CSS 属性合并，而不是替换整个继承的目标。显式的图标、指示器或 `componentIcons` 条目会整体替换同一键的继承条目。显式的 `iconVariants` 列表会替换继承的列表；省略该列表则继承。继承的函数条目会保留定义它的主题的列表，因此仅当该列表与活动主题的列表都包含所请求的变体时，它才会收到该变体，否则为 `undefined`。

`icons` 条目是 React 节点，或一个以 `{size, variant}` 为参数的纯同步函数；有状态的 `componentIcons` 条目可以是该插槽状态的纯同步函数。规范化主题会保留这些函数供 Astryx 解析。其公开读取保持简单：`DefinedTheme['icons']` 是节点值，每个函数以 `{size: 'md'}` 读取；`DefinedTheme['componentIcons']` 是名称、`null` 和静态请求的静态视图，解析器插槽被省略；`DefinedTheme['iconVariants']` 是主题的列表。在 `defineTheme` 内部，条目函数接收 `variant`，静态插槽请求和插槽函数返回该值，类型为该主题所列出的名称。`DefinedTheme['__componentIcons']` 按发布状态是公开表面：它的存在及其形态，即当任一值为函数时出现的 `componentIcons` 插槽值，保持 `spec:AST-017` 兼容性。所有者选择了"接受 __componentIcons 作为公开表面"（`cixzhang`，2026-11-11）。

## Boundaries and invariants

- **INV1 — 一个输入产生一个规范化主题。** 运行时与构建使用方收到相同的 `DefinedTheme`；它们不会实现各自独立的编写语义。
- **INV2 — 优先级是确定性的。** 某个值的胜出者遵循文档化的顺序，且不依赖于该顺序之外的对象遍历。
- **INV3 — 扩展在语义上是扁平的。** `extends` 接受真正的 `DefinedTheme`，并向前携带其已解析的令牌、本地令牌所有者与沿袭元数据、组件规则、媒体表面、适配与轴、图标、指示器、`componentIcons` 和 `iconVariants`。规范化后的子主题是完整的。
- **INV4 — 无效的基础主题会大声失败。** 传给 `extends` 的 undefined、命名空间或普通对象不能产生看似合理的部分主题。
- **INV5 — 显式令牌覆盖生成的尺度。** 生成的值提供一致的默认值；显式的语义令牌逐个令牌胜出。
- **INV6 — 组件覆盖深度合并。** 重新声明一个 CSS 属性会保留同一组件/样式键上的继承属性。颜色模式块以相同方式合并：在样式键的 `@light` 或 `@dark` 块中重新声明一个属性，会保留该块的其他继承属性。
- **INV7 — 表面覆盖一致地继承。** `onDark` 和 `onLight` 按该顺序组合系统默认值、继承的表面值和本地覆盖。
- **INV8 — 本地令牌的登记是显式的并受所有者跟踪。** 提供 `localTokens`，或扩展一个确切已登记的基主题，会产生扁平的本地声明映射，以及确切的所有权和沿袭元数据。每个声明的键都是有效的 CSS 自定义属性名，且没有键与 `tokens` 冲突；所有权从不根据前缀推断。与有效已登记声明精确匹配的 `var()` 引用，是在已验证的本地令牌、组件、媒体表面和适配表面上的受拥有边。非精确引用仍被视为外部引用。已登记主题保留确切的所有者、沿袭、冲突和循环验证；未登记主题保留其旧有行为。
- **INV9 — 编写与输出是相互独立的系统。** 本记录负责规范化的主题定义。共享编译器负责将其转换为样式；运行时和构建负责使用或保存该输出。
- **INV10 — 适配是经过排序的规范化意图。** 每个有效主题都保留其完整的 `sm`/`md`/`lg`/`xl`/`2xl` 宽度映射、生成轴元数据，以及先继承后本地的 `{when, value}` 规则顺序。规则会针对子主题的有效根元数据重新解析；它们不会改变根令牌读取，也不会引入身份标识、注册表、媒体表面或新的本地名称。
- **INV11 — `defineTheme` 只验证它构造的内容。** 它负责主题的创建与规范化。作为构造前提，它可以拒绝影响规范化主题行为或生成值的畸形输入。仅用于验证的编写或引用数据留在 `DefineThemeInput` 和 `DefinedTheme` 之外。
- **INV12 — 主题 `define*` 辅助函数构造主题值。** 它们将输入转换、派生或规范化为当前受支持使用方所使用的持久化类型化主题值；只验证并原样返回输入是不够的。
- **INV13 — 主题函数留在解析之后。** 函数图标条目和插槽函数是纯且同步的。Astryx 图标解析以及枚举主题图标请求的构建工具（`architecture:theme-compilation` INV15）会调用图标条目；只有插槽解析会调用插槽函数。公开的主题读取返回节点、静态插槽值和变体列表，绝不返回函数。
- **INV14 — 变体列表是主题级别的。** `iconVariants` 列出整个主题支持的变体名称。它从不按图标设置，也从不与另一个主题的列表合并。
- **INV15 — 动效是时长尺度旁的三个旋钮。** `motion` 在时长尺度旁接受 `tempo`（限制在 0.75–1.5）、`character`（`crisp`、`standard`、`expressive`）和 `reducedMotion`（`system`、`always`）。`tempo` 缩放每个时长令牌，`character` 设置 `--ease-entrance` 和 `--ease-move`；当 tempo 为 1 且 `standard` 时，令牌为默认值。时长尺度的时长优先于 `tempo`，显式令牌优先于两者。扩展主题逐字段继承动效：子主题未设置的时长尺度字段或旋钮保留其基础主题的值。每个时长在应用 `tempo` 之前的值会为忙碌指示器循环保留，这类循环从不遵循 `tempo`。`tempo` 和 `character` 都不会移动手指跟踪、动量、橡皮筋、屏幕键盘、按压模型的起始延迟、取消距离和点按闪烁、悬停意图延迟、手势阈值、忙碌指示器循环，或 200 ms 的减弱动效上限（`spec:AST-108` FR4）。`reducedMotion: 'always'` 会标记主题的根节点，而依据 `prefers-reduced-motion` 开启减弱动效的部分，也会同样依据该标记开启（`spec:AST-108` FR6）。适配规则可以设置 `tempo` 和 `character`，绝不设置 `reducedMotion`。
- **INV16 — 颜色模式块属于其样式键。** 样式键的 `@light` 或 `@dark` 值是一个样式块，包含样式键所接受的属性和伪类覆盖，仅当元素的颜色模式为该模式时应用（`architecture:theme-compilation` INV18）。它是可选的、附加的：没有该块的样式键按书写内容在两种模式下都应用。

本记录不负责：

- 语义令牌的名称/默认值；
- 将 `DefinedTheme` 转换为样式规则，包括本地令牌输出、私有变量展开以及级联/层行为；
- 运行时挂载、作用域生命周期、根同步或 DOM 观察；
- CLI 文件生成与打包；或
- 哪些组件目标、状态和公共属性参与。

`architecture:theme-compilation` 负责平台输出。对于 Web，运行时和静态构建使用同一个 CSS 编译器和同一套维护的样式表规则。未来的原生编译器可以将同一个主题定义转换为原生样式对象，而不必将 CSS 概念纳入共享编写。运行时应用和 CLI 打包使用编译输出而不修改它。参与的公共表面属于 `architecture:component-theming-surface`。

## Change coupling

- 接纳时询问：**该字段或 `define*` 辅助函数构造了哪些规范化主题行为或生成值，运行时和静态构建如何使用它？** 没有具体答案就将其挡在 Core 运行时编写之外。被接纳字段的规范化、优先级、继承、验证、模板暴露和负向测试会一起变更。
- 仅用于验证的主题数据留在主题包测试、内部测试工具，或当前受支持使用方所使用的显式 CLI 检查器/诊断器工作流中。它不会仅仅为了共享验证器而进入 Core 运行时。
- `spec:AST-017` 负责破坏性变更分类和迁移。当维护中的主题发布在主题当前支持的 peer/依赖范围内、其源码或构建在某个 Core 版本下无法原样工作时，即使其规范化令牌和 CSS 未变，也会进入该路径。仅用于验证的 Core 字段、辅助函数或导出如果导致该失败，就是真实的兼容性成本，而非无害元数据。有针对性的协调破坏只能通过该兼容性所有者进行；本记录不定义其补救措施。
- 本地令牌变更会保留显式登记、有效的精确自定义属性名、确切的所有者元数据、源/构建沿袭一致性，以及与可移植 `tokens` 的分离。前缀只是所有者约定：它们不授予、保留或限制所有权。同一个名称不能同时出现在两个映射中，否则 CSS 输出和可移植令牌辅助函数将解析出不同的值。
- 更改优先级是一项兼容性决策，因为现有主题可能同时包含生成值和显式值。
- 更改 `ComponentStyleMap` 的合并行为会验证基础、生成、显式和媒体上的组合；任何层都不会发明自己的合并规则。
- 新的生成尺度会说明它可能产生哪些语义令牌，并确认显式令牌覆盖仍然胜出。
- 适配变更会保留固定的条件词汇、包含式 `from`/排他式 `below` 宽度边界、作者书写的规则顺序、仅限根节点的本地名称登记，以及源/构建扩展一致性。
- 仅运行时路径无法使用的编写字段仍被禁止。没有规范化主题效果的构建/CLI 元数据，只能为具名的当前受支持读取方存在，留在 `DefineThemeInput` 和 `DefinedTheme` 之外，且不得强加 Core/运行时兼容性。假设性的 sidecar 是不够的。

## Owning code

- 一个内部的纯函数 `resolveThemeMotion(theme)` 为动画器和服务器代码返回主题的动效旋钮、时长和缓动；它不触碰 DOM，也没有导入时副作用（`spec:AST-108` FR6）。
- `packages/core/src/theme/defineTheme.ts` 负责公共输入、规范化 IR、编排和扩展行为。
- `themeAdaptations.ts` 负责固定的断点/条件词汇、验证、继承规则排序、轴补全和具体规则写入。
- `syntax/defineSyntaxTheme.ts` 在 `defineTheme` 采用其令牌之前构造语法主题。
- `expandColorScale.ts`、`expandTypeScale.ts`、`expandRadiusScale.ts` 和 `expandMotionScale.ts` 负责各自的派生令牌/组件值。
- `motionKnobs.ts` 负责动效旋钮的类型、默认值和限幅；`themeMotion.ts` 负责它们生成的令牌和 tempo 之前的时长，以及 `resolveThemeMotion`——动画器和服务器代码使用的纯读取。
- `mergeComponents.ts` 负责共享的深度合并规则。
- `onMediaTokens.ts` 负责反转表面覆盖的规范化。
- `localTokens.ts` 负责选择性登记、有效的 CSS 自定义属性名、确切的所有者元数据、引用闭包、循环检测、跨映射冲突拒绝和扁平化沿袭。它不根据前缀推断所有权。
- `packages/cli/assets/theme.template.ts` 是面向编写者的投影，必须保持对齐；它不定义额外的语义。

## Deciding specs

AST-006 决策 1–4 和 6 确立了已发布的主题本地编写形态、登记、精确名称保留、继承、共享验证和值契约。其 2026-09-12 修订使键的有效性和所有权与前缀无关，同时保留确切的所有者元数据、沿袭、冲突、循环和旧有的未登记行为。AST-012 决策 1–4 确立了固定宽度映射、具名封闭条件、有序规则级联，以及源/构建适配元数据一致性。AST-017 决策 1 负责已发布版本的兼容性分类和迁移。AST-087 决策 2、7、9 和 10 确立了函数图标条目、节点值公开读取、主题级 `iconVariants` 列表，以及 `componentIcons` 的静态公开视图。AST-108 决策 1 确立了三个动效旋钮，并将各角色的动效值保持为内部实现。

## Known conformance and verification gaps

与前缀无关的 `localTokens` 键接受已获批准但尚未发布。当前验证器仍要求原始的、由主题派生的前缀，并使用该前缀对本地引用进行分类。在实现落地之前，INV8 中与前缀无关的条款是当前权威，但尚未强制执行。现有的显式登记、所有者、沿袭、冲突、循环和旧有的未登记行为仍保持发布状态。

`resolveThemeMotion` 的角色表已获批准但尚未发布（`spec:AST-108` FR6）：目前还没有弹簧读取动效旋钮。在它们落地之前，FR6 的这一部分是当前权威，但尚未强制执行。

`reducedMotion: 'always'` 已获批准但尚未发布（`spec:AST-108` FR6、INV15）：公开的 `motion` 类型没有 `reducedMotion` 字段，每个主题都像 `'system'` 那样遵循每个人的设置，且没有任何东西标记主题的根节点，直到组件样式、动画器、`prefers-reduced-motion` 的脚本读取方和以动效为键的适配规则都依据该标记开启减弱动效为止。在此之前，INV15 和 FR6 的这一部分是当前权威，但尚未强制执行。

INV9 缺口：名称以 `__` 开头的 `DefinedTheme` 字段（`__icons`、`__iconEntryVariants`、`__componentIcons`、`__built`、`__inputTokens`、`__localTokenOwners`、`__localTokenLineage`、`__onDark`、`__onLight`、`__adaptations`、`__adaptationRules` 和 `__axes`）是可触达的公开表面，而本记录没有为它们定义契约。

INV13 缺口：`DefinedTheme['__componentIcons']` 和 `DefinedTheme['__icons']` 可触达，并返回主题的插槽函数和函数图标条目。

## Verification

| 不变量           | 证据                                                                                       | 失败信号                                                                   |
| ---------------- | ------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- |
| INV1, INV2, INV5 | `defineTheme.test.ts` 加上有代表性的运行时/构建一致性                                      | 运行时和构建对同一输入的解释不同，或生成值胜过显式令牌                     |
| INV3, INV4       | 扩展与无效基础主题测试                                                                     | 子主题需要基础样式表，或静默接受非主题基础主题                             |
| INV6             | 跨基础/生成/显式规则的组件合并测试                                                         | 重新声明一个属性会丢失继承的组件样式                                       |
| INV16            | `colorModeBlocks.test.ts` 通过 `extends`、生成的类型尺度规则和继承的媒体表面进行的合并测试 | 颜色模式块被合并丢弃，或在没有该块时改变了主题                             |
| INV7             | `onMediaTokens.test.ts` 和生成的表面规则测试                                               | 子主题丢失继承的表面自定义，或表面优先级发生变化                           |
| INV8             | AST-006 运行时/静态验证器以及源/构建继承测试                                               | 有效名称因前缀而失败，所有权跟随拼写，或沿袭/引用/冲突/循环检查出现偏差    |
| INV10            | `themeAdaptations.test.ts` 和 CLI 构建夹具                                                 | 宽度元数据、规则顺序或子主题重新解析在源主题和构建主题之间出现偏差         |
| INV11            | `DefineThemeInput`/输出差异加上运行时/构建夹具                                             | 仅用于验证的数据进入规范化主题，或生产性输入失去构造验证                   |
| INV12            | Core 主题导出差异、构造值证据和当前使用方调用点                                            | 主题 `define*` 辅助函数只检查输入并原样返回该输入                          |
| INV13, INV14     | `defineTheme.test.ts` 针对函数条目、插槽函数和列表的类型与规范化测试                       | 公开读取返回函数，子主题合并变体列表，或条目看到另一个主题的名称           |
| INV15            | `themeMotion.test.ts` 覆盖 tempo 边界、character、时长尺度、显式令牌和扩展                 | 令牌偏离其旋钮，旋钮胜过尺度或显式令牌，继承的旋钮丢失，或循环遵循 `tempo` |
| 主题/Core 兼容性 | 维护中的主题源码/构建针对其当前支持的 peer/依赖范围内的最低 Core 版本                      | 主题更新静默要求更新的范围内 Core，或绕过 `spec:AST-017` 路径              |
| 编写投影         | `scripts/check-theme-template.test.mjs`                                                    | 受支持的编写概念在模板中缺失或表述错误                                     |
