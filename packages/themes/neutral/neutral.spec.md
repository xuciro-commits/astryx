---
schema_version: 2
template_version: 1
kind: theme
id: theme:neutral
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    scripts/check-badge-contrast.test.mjs,
    scripts/check-segmented-control-label-contrast.test.mjs,
    packages/core/src/SegmentedControl/__tests__/SegmentedControlLabelContrast.a11y.chromium.spec.ts,
    packages/themes/neutral/src/neutralTheme.test.ts,
  ]
package: '@astryxdesign/theme-neutral'
source_theme: packages/themes/neutral/src/neutralTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
    architecture:component-theming-surface,
    spec:AST-006,
  ]
---

# Neutral theme specification

本记录是当前已批准的调色板与 Neutral token 映射记录。它不决定跨主题的本地 token、调色板生成、编译器或产物 API；当前的 `spec:AST-006` 拥有已接受的本地 token 契约。DEC-2 批准本次变更所交付的确切调色板，DEC-4 批准随其交付的已评审 Neutral token 映射。提议的本地 token 角色和额外组件映射仍是独立工作，不得视为已批准的公有契约。

## Intent and audience

Neutral 服务于希望获得安静灰度基础、克制表面以及可区分语义色和分类色的构建者。它应保持产品中立，同时让状态和交互状态在两种颜色模式下都保持可识别。

## Inheritance and base

Neutral 从 Astryx 核心默认值出发，并覆盖选定的排版、动效、圆角、阴影、语义颜色、语法、图标和组件值。它目前不扩展其他已发布的包主题。

## Portable token overrides

确切交付的值仍位于 `source_theme`。Neutral 拥有其灰度画布/表面层级、近黑/近白内容角色、状态与分类选择、中性边界以及语法选择。跨主题 token 词汇仍由 `architecture:theme-tokens` 拥有。

## Theme-local role definitions

Neutral 发出一个主题本地角色，作为 Neutral 扩展的兼容性契约保留。它已弃用：Neutral 通过可移植的 `--color-*` 角色绘制每个状态，并不读取它，同时保留其确切名称、含义和值：

| 确切名称                                          | 仅 Neutral 的含义 | 值                       | 状态   |
| ------------------------------------------------- | ----------------- | ------------------------ | ------ |
| `--astryx-theme-neutral-color-status-fill-accent` | 填充强调状态      | `['#0074e2', '#6d9cfe']` | 已弃用 |

Core 组件消费可移植的 `--color-*` 语义角色；没有任何 Core 实现或 Neutral 映射依赖此别名。

## Tonal palette definitions

候选源码工作包含中性色、红色、橙色、黄色、绿色、蓝绿色、青色、蓝色、紫色和粉色的完整浅色与深色色阶。已提交的请求、生成的模块和回执使已评审的 `astryx-oklch-v1` 结果可复现。草案 `spec:AST-018` 单独拥有跨主题编写与验证契约。重新生成是一项明确的已评审调色板变更，绝不会在常规主题构建期间发生。将运行时 token 映射到这些色阶的工作在单独的堆叠变更中评审。

已批准的深色模式调整将彩色色族的实际色度在 stop 25 及之前降至 50%，黄色色族使用 65% 覆盖值，并在 stop 60 平滑恢复到标准配方。它保持浅色色阶、中性色阶以及 stop 60 到 100 不变。它不使用不透明度，也不改变色调坐标。

## Component and state mappings

Core 组件按表面选择语义角色（`architecture:theme-tokens` INV11）：强填充使用 `--color-<status>` 搭配 `--color-on-<status>`，浅色表面使用 `--color-<status>-muted` 搭配 `--color-on-<status>-muted`，默认表面上的状态文本、图标和边框使用 `--color-text-*`、`--color-icon-*` 和 `--color-border-*`。Neutral 直接设置可移植的状态填充：`--color-info` `['#0074e2', '#6d9cfe']`、`--color-success` `['#198100', '#64af4c']`、`--color-warning` `'#ffce2f'` 和 `--color-error` `['#c9303a', '#ff705d']`，即其 Badge 一直显示的颜色。ProgressBar、StatusDot 和 Stepper 指示器的强调变体绘制 Neutral 的强调色，Banner 和浅色破坏性 Button 使用可移植的 overlay 和中性角色；Neutral 不为其中任何一个添加组件覆盖。每个新映射都需要精确到 head 的主题评审以及渲染的浅色/深色证据；仅共享颜色还不够。

Neutral 选定的填充 `--color-accent-muted` 为 `neutral.light[85]` / `neutral.dark[30]`（`#d4d4d4` / `#474747`）。其上的文本在两种模式下均达到 4.5:1 或更高。在深色模式下，Neutral 将 `--color-text-secondary` 提升为 `neutral.dark[80]`，适用于：选中的 `item` 或 `tree-list-item`（勾选的 CheckboxListItem 行会在其 `item` 目标上反映 `selected`）、带 `variant:number` 的 `citation`、带 `mode:dropzone` 且拖拽悬停填充没有状态目标的 `file-input`，以及每个 `segmented-control-item`（其未选中标签位于页面表面之上的半透明轨道上），从而使文本在静止状态和悬停覆盖层下均超过 4.5:1。Neutral 的语法 `comment`、`operator` 和 `punctuation` 颜色为 `neutral.light[35]` / `neutral.dark[75]`，因此它们在突出显示的代码行上可读。

本工作不添加组件状态。它有意排除没有已批准主题化目标的 `table-row-status`，以及单独评审的 SegmentedControl 几何/阴影变更。

## Compatibility and migration

本记录记录当前 Neutral 变更所交付的包输出。现有 Neutral 编写和可移植 token 名称保持稳定，同时已评审的映射通过运行时主题和 CLI 模板发出。Neutral 显式提供 `localTokens`；因此其确切名称和含义是其公有兼容性契约的一部分。

实现要求父级 AST-006 实现先行交付，随后为每个提议的值和映射提供完整的渲染证据和精确到 head 的批准。当 Neutral 交付某个定义时，其确切名称和已批准的语义含义即成为 Neutral 家族的公有兼容性契约。本地 token 名称、登记的主题名称或语义含义的变更必须通过明确的已评审迁移或别名来保留后代和消费者。编译后的 CSS 不会将角色扩展到其已批准上下文之外。

## Accessibility and contrast evidence

目前尚不存在关于对比度方法论的当前跨主题设计记录，因此本草案不选择也不重述方法论。未来的记录是一个未解决的依赖，因此未列在 frontmatter 中。

当前的 Neutral 专属回执包括 Badge 对比度检查以及记录在 Neutral 源码旁的组合。候选强调填充在浅色模式下使用 `#0074e2`，在深色模式下使用 `#6d9cfe`，但这些值本身并不构成无障碍声明。采用要求实际的 Badge 信息前景与背景组合在渲染的浅色和深色状态下达到其阈值；之后的每个映射都需要其前景、图形对象、交互和禁用状态的回执。没有任何调色板色阶本身是无障碍的，颜色不能替代组件契约所要求的其他信号。在共享方法论成为当前记录后，本记录将拥有这些组合、例外、测量和已知差距；它不会复制方法论或共享测量工具的实现。

## Build and artifact contract

包清单和构建测试定义 Neutral 的运行时、CSS、声明和导出输出。完整调色板保留在主题拥有的源码文件中，用于编写和审计；而 `defineTheme` 使用的生成的选定色阶引用包含在运行时和 CLI 模板产物中。完整的编写调色板不会打包进生成的 CSS 或通用主题构建产物中。

选定色阶模块是确定性的派生产物。一个签入的、明确的维护命令必须发现 Neutral 主题源码引用的每个调色板色族、模式和色阶，从已提交的完整调色板中解析每一个，并在不改变 token 映射的情况下重新生成选定色阶模块。一个非写入检查必须将完整的生成模块与已提交文件进行比较，并在引用缺失、多余、过期或无效时失败。当已提交模块与该确定性投影不同时，主题验证必须失败。常规主题构建不得重新生成或采用调色板值。

选定色阶模块必须恰好包含 Neutral 主题源码所引用的调色板色阶。移除未引用的私有条目会保留每个被引用的值、完整的编写调色板、所有 token 映射、渲染输出和公有 API。

## Verification map

| 主题契约         | 证据                                   | 代表性状态                                    | 失败信号                                                                      |
| ---------------- | -------------------------------------- | --------------------------------------------- | ----------------------------------------------------------------------------- |
| 当前值清单       | Neutral 源码和主题测试                 | 浅色/深色 token 色族                          | 源码与记录对某个主题拥有的含义存在分歧。                                      |
| 本地角色契约     | 计划的 AST-006 实现和 Neutral 测试夹具 | 确切的声明/使用/输出名称；公有含义；重命名    | 交付的名称或含义在没有已评审兼容性处理的情况下变更，或泄漏到可移植/Core API。 |
| 组件映射         | 主题规范评审和渲染证据                 | Badge 信息；每个未来映射；浅色/深色；交互状态 | 某个映射并非真正表示填充强调状态，或缺少上下文证据就落地。                    |
| 对比度           | Badge 检查以及渲染组件矩阵             | 浅色/深色和交互状态                           | 某个必需组合低于其阈值。                                                      |
| 选定的运行时引用 | 确定性重新生成以及穷尽一致性检查       | 每个被引用的色族、模式和色阶                  | 某个生成的引用缺失、多余、无效，或与已提交的完整调色板不同。                  |
| 现有包契约       | 主题构建、包和解析测试                 | 运行时、CSS、声明、公有导出                   | 本记录暗示了包并未交付的产物。                                                |

## Decision log

以下决策记录其所述部分的既定输入。DEC-2 批准确切的调色板，DEC-4 批准本次发布交付的已评审 token 映射。本地 token 角色和渲染证据问题仍受其决策中所述的具体批准门禁约束。

### DEC-1 — Own one exact Neutral filled-accent-status role

**引用：** `theme:neutral/DEC-1`
**系统边界决策者：** `cixzhang`, `2026-08-31`
**最终 Neutral 采用决策者：** `rubyycheung`, `2026-10-17`

Neutral 在此同置主题规范中拥有主题本地定义。`--astryx-theme-neutral-color-status-fill-accent` 在稳定的 `name: 'neutral'` 下表示填充强调状态。其确切名称、含义和 `['#0074e2', '#6d9cfe']` 值是 Neutral 家族的公有兼容性契约，尽管它不能跨主题移植，也不被 Core 消费。

该 token 只能应用于映射上下文真正表示填充强调状态的地方。它已弃用：Neutral 本身不将任何组件映射到它，而是使用可移植的状态角色，并且它继续为 Neutral 扩展保留定义。新的组件映射需要其实际交互状态的渲染浅色/深色证据。

已拒绝：将该角色视为全局角色、将其视为可丢弃的私有输出，或仅仅因为两个上下文当前共享一种颜色就应用它。

### DEC-2 — Approve the Neutral palette as a decision anchor

**引用：** `theme:neutral/DEC-2`

**决策者：** `rubyycheung`, `2026-09-02`

Neutral 的确切调色板值被批准为后续颜色和对比度决策的稳定起点。请求、生成结果、回执和视觉评审必须一起变更。运行时 token 映射被有意排除在此决策之外，并在单独的堆叠变更中评审。完整的编写调色板不会添加到运行时主题对象或生成的 CSS 中。

Neutral 是仓库中调色板感知主题模板的参考实现。模板可以复用其所有权、评审和对齐工作流；它们不会将 Neutral 的值、映射或色阶布局作为要求继承。

已拒绝：在常规构建期间重新生成调色板、作为调色板生成的一部分静默更改运行时 token 映射，或在调色板能够作为衡量和改进这些映射的基线之前要求完整的组件级对比度一致性。

### DEC-3 — Mute the dark chromatic edge without changing its tone scale

**引用：** `theme:neutral/DEC-3`

**决策者：** `rubyycheung`, `2026-09-04`

Neutral 的深色彩色色阶在 stop 25 及之前使用 50% 的实际色度乘数，并在 stop 60 平滑恢复到标准配方。黄色使用 65% 乘数以保留其身份。该调整发出纯色：不添加 alpha，不改变浅色或中性色阶，并保留确切的端点和色阶坐标。

已拒绝：降低整个调色板的鲜艳度、使用半透明颜色，或在调色板值变更中更改语义 token 映射。

### DEC-4 — Map Neutral roles through reviewed palette references

**引用：** `theme:neutral/DEC-4`

**决策者：** `rubyycheung`, `2026-09-04`

Neutral 的语义、分类、语法和带颜色的效果值在存在已批准匹配时使用命名的调色板色阶引用；保持显式值的状态填充记录在 DEC-6 中。Alpha 变体从被引用的色阶派生，而不是复制其十六进制值。

该映射是角色感知的，而不是盲目的最近颜色转换。非常深的前景保留其更深的角色，普通背景不会自动变为纯黑，已评审的 token 可以使用伴生色阶中更接近的值。没有已批准调色板匹配的有意值仍为显式的主题本地值。

### DEC-5 — Generate the selected runtime references from their owned sources

**引用：** `theme:neutral/DEC-5`

**决策者：** `rubyycheung`, `2026-09-30`

Neutral 的选定色阶模块从两个现有的事实来源生成：Neutral 主题源码使用的色族、模式和色阶引用，以及已提交完整调色板中的确切值。重新生成只将这些选定的值复制到运行时产物中。它既不选择映射，也不重新生成完整调色板。

生成器有一个供维护者使用的显式写入模式和一个用于验证的非写入检查。该检查比较整个预期产物，因此缺失、多余、无效或过期的选定引用会在包输出被接受之前失败。常规主题构建绝不重写已提交的调色板源码。

已拒绝：在运行时导入完整调色板、维护第二个手动选择清单，或将 token 映射断言视为复制的十六进制值仍与已批准调色板匹配的证据。

### DEC-6 — Paint status through the portable roles, with no other local tokens

**引用：** `theme:neutral/DEC-6`

**决策者：** `cixzhang`, `2026-10-25`

Neutral 通过可移植的 `--color-*` 角色绘制状态、着色表面和浅色破坏性 Button。除 DEC-1 中已弃用的 `--astryx-theme-neutral-color-status-fill-accent` 外，它不为这些定义任何本地 token。

这是 `spec:AST-006` FR10 针对早期 Neutral 发布所发出的九个本地名称的例外：`--astryx-theme-neutral-color-status-fill-success`、`-status-fill-warning`、`-status-fill-error`、`-status-muted-accent`、`-on-tint-neutral`、`-on-tint-overlay-hover`、`-on-tint-overlay-pressed`、`-destructive-overlay-hover` 和 `-destructive-overlay-pressed`。它们都不是 Neutral 家族契约：本记录曾将前三个和 on-tint 名称列为提议角色，不得视为已批准的公有契约，且从未记录其他名称。因此它们不携带别名。它们的替代项是：状态填充使用 `--color-success`、`--color-warning` 和 `--color-error`，浅色强调表面使用 `--color-info-muted`，on-tint 内容使用 `--color-neutral`，覆盖层使用 `--color-overlay-hover` 和 `--color-overlay-pressed`。

根据 `architecture:theme-tokens` INV11，Neutral 的 `--color-success`、`--color-warning` 和 `--color-error` 是其强状态填充，设置为它的 Badge 一直显示的显式颜色，没有任何调色板色阶与之匹配。因此它们的 Neutral 值会从早期发布使用的较深颜色发生变化，这些较深颜色现在由 `--color-text-<status>` 承载，用于页面上的状态文本。

已拒绝：将九个名称保留为已弃用别名，这会保留从未承诺且 Neutral 不再读取的名称。

## Open questions

无。

## Content boundary

本记录拥有 Neutral 的意图、事实值清单、已批准的本地 token 名称与含义、提议值、选定映射、必需组合/状态、主题特定例外、测量回执、已知差距、兼容性和包事实。未来的当前设计记录拥有跨主题对比度方法论；共享测量实现属于架构/工具链。本记录不定义跨主题本地 token 或调色板 API。`spec:AST-006` 拥有跨主题本地 token API、命名空间、验证、谱系和编译器不变量。组件/家族记录拥有可观察行为，消费者文档拥有受支持的语法和示例。
