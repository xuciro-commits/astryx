---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:theme-tokens
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/theme/tokens.stylex.ts,
    packages/core/src/theme/tokens.ts,
    packages/core/src/theme/localTokens.ts,
    packages/core/src/theme/domainTokens/,
    packages/core/src/theme/syntax/,
    packages/cli/assets/theme.template.ts,
  ]
verified_by:
  [
    packages/core/src/theme/tokens.test.ts,
    packages/core/src/theme/defineTheme.test.ts,
    scripts/check-theme-template.test.mjs,
    scripts/generate-token-docs.mjs,
  ]
deciding_specs: [spec:AST-006/DEC-1, spec:AST-006/DEC-5]
---

# Theme token architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "tokens": [
      "INV1",
      "INV3",
      "INV4",
      "INV6",
      "INV8",
      "INV9",
      "INV10",
      "INV11",
      "INV12"
    ]
  }
}
```

本记录定义了组件、主题、文档和非 CSS 消费方共享的语义 token 词汇表。

## Purpose

主题作者和组件作者应引用同一组稳定的语义名称。更改默认主题、在 JavaScript 中解析 token，或生成消费方文档时，不得创建第二套 token 词汇表。

## System model

核心 token 在 `tokens.stylex.ts` 中声明为成对的导出：

- `*Defaults` 对象保存默认 CSS 值。
- `*Vars` 对象由这些默认值通过 `stylex.defineVars` 创建，是组件样式所使用的对象。
- `defineTheme` 将核心默认值合并为完整的主题 token 类型。
- `tokenVar`、`tokenVars`、`resolveThemeToken` 和 `resolveThemeTokens` 向 canvas、SVG、图表、测试、构建工具和其他非 StyleX 消费方暴露同一套词汇表。

语法高亮和数据可视化 token 是领域层。它们保持可单独导入，因此不使用这些领域的应用无需引入其实现模块，而 `domainTokenDefaults` 使它们的名称可用于主题校验和解析。

CLI 主题模板和生成的 token 文档是该词汇表的投射。它们不定义额外的 token。

主题家族本地 token 是一张单独的登记映射。它们可以复用现有的 token 值形状，但不进入 `TokenName`、默认值、`tokenVar`、`tokenVars`、`resolveThemeToken`、`resolveThemeTokens`、生成的可移植文档或 Core 组件源码。一个名称不能同时出现在可移植 `tokens` 和 `localTokens` 中，因为那样 CSS 和非 CSS 解析会产生相互矛盾的胜出者。

## Boundaries and invariants

- **INV1 — `defineVars` 声明是规范来源。** 核心 token 名称及其默认值源自 `tokens.stylex.ts`；投射不会引入名称。
- **INV2 — 默认值和类型化变量一起变动。** 每个核心 token 家族都有一个 `*Defaults` 对象和匹配的 `*Vars` 导出。
- **INV3 — Token 名称描述语义角色。** 组件消费的是以用途为导向的名称，例如文本、表面、间距和动效角色，而不是嵌入某个主题的原始调色板选择。
- **INV4 — 模式相对的默认值保持为一个 token。** 随颜色模式变化的语义角色使用受支持的 `light-dark()` 或元组值，而不是创建互不相关的浅色和深色 token 名称。
- **INV5 — 领域层是显式的。** 语法和数据 token 可供主题编写和解析使用，而不会被折叠进核心组件 token 模块。
- **INV6 — 非 CSS 消费方解析同一张图。** JavaScript 辅助函数遵循 token 引用和受支持的颜色表达式，而不是维护第二套解析值。
- **INV7 — 投射不能悄悄漂移。** 主题模板清单和生成的 token 文档随规范家族一起更改，否则校验失败。
- **INV8 — 主题本地名称保持不可移植。** 登记在案的本地声明保持在规范词汇表、类型化辅助函数、生成的可移植文档和 Core 组件依赖之外。
- **INV9 — 间距 token 使用 rem。** 核心 `--spacing-*` 默认值是 `rem` 值（`--spacing-N` 为 `N × 0.25rem`；`--spacing-4` 为 `1rem`，在默认根字号下为 16px），因此由它们构建的间隙、内边距和外边距会像字号刻度一样跟随读者的根字号。一条规则覆盖所有表面：间距步长使用 `rem`，除非某个主题将该步长记录为 `px` 例外。覆盖步长的主题写入 `rem`；间距步长生成器（CLI 主题模板，逐字复制第一方主题；以及文档站点 playground 的主题编辑器刻度序列）输出 `rem`，并且仅因为主题声明了某条记录的 `px` 例外才复现它。作者在自定义主题中写入的值按原样保留，绝不转换。非 CSS 消费方（`useTheme().token()`、`resolveThemeToken()`、`tokenDefaults`）返回 token 的值及其单位；需要像素的代码应针对根字号解析该值，而不是解析数字。
- **INV10 — Astryx 的颜色 token 名称遵循统一语法。** 该语法只管辖 Astryx 定义的颜色 token：Core 的 `colorDefaults`、领域层默认值，以及 Astryx 第一方主题根据该词汇表设置的那些 token。它不管辖 Astryx 未定义的名称，例如产品或应用自己的 CSS 变量、主题作者的扩展或本地 token（INV8），或其他设计系统的 token。Astryx 定义的每个颜色 token 都采用五种形状之一：
  1. `--color-<property>-<role>`：用于一个绘制属性的颜色。属性为 `text`、`icon`、`background` 或 `border`。角色是强调（`primary`、`secondary`、`disabled`、`emphasized`）、意图（`--color-text-accent`）、表面（`surface`、`body`、`card`、`popover`、`muted`、`inverted`）、色相（`--color-text-green`），或 `control`，即表单控件的边缘（`--color-border-control`，INV13）。
  2. `--color-<intent>`：意图自身的颜色。意图为 `accent`、`neutral`、`info`、`success`、`warning` 和 `error`。
  3. 带一个变体后缀的形状 1 或形状 2 名称：`-muted`（浅淡形式）、`-emphasized`（强烈形式）、`-hover` 或 `-pressed`（交互状态），或 `-inverted`（用于反转表面）。
  4. `--color-on-<fill>`：放置在填充上的内容，其中 `<fill>` 是形状 2 或形状 3 的意图名称、`dark` 或 `light`。`--color-on-<intent>` 是意图自身颜色上的内容；`-muted` 填充与其自己的 `--color-on-<intent>-muted` 配对。
  5. 用于 INV5 下领域层的 `--color-<domain>-…`：`--color-data-*` 和 `--color-syntax-*`。

  无角色的实用名称 `--color-border`、`--color-overlay`（及其 `-hover` 和 `-pressed` 状态）、`--color-shadow`、`--color-skeleton`、`--color-track` 和 `--color-tint-hover` 保留其名称。新名称不添加组段（例如 `status`）、不添加其他属性词（例如 `foreground`），也不添加属性后缀（例如 `-text`）。Tailwind 键是此语法之外的一种投射：键可以以更短或特定于实用程序的名称别名某个 token，例如用 `text-status-<status>` 表示 `--color-text-<status>`，并且绝不添加 CSS 变量。

- **INV11 — 语义状态角色特定于表面。** 每个状态（`info`、`success`、`warning`、`error`）在三个表面上具有以下角色，命名遵循 INV10：
  - `--color-<status>` 是强烈的状态填充。其上的内容使用 `--color-on-<status>`，对比度至少 4.5:1；该内容可以是浅色或深色。
  - `--color-<status>-muted` 是浅淡的状态填充。其上的内容使用 `--color-on-<status>-muted`，当填充位于默认表面上时对比度至少为 4.5:1。
  - `--color-text-<status>` 是默认页面和卡片表面上的状态文本，与它们的对比度至少为 4.5:1。`--color-icon-<status>` 和 `--color-border-<status>` 是这些表面上的状态图标和状态边框。每个都默认等于 `--color-text-<status>`；设置自己值的 Astryx 主题使其与相同表面的对比度至少保持 3:1。强烈填充不是状态文本：在页面上，组件使用文本角色。

  Info 和其他状态一样是状态，并且独立于强调色：任何 Info 角色都不会默认使用强调色 token。`--color-info`、`--color-info-muted` 及其内容角色是新名称；v0.0.8 升级转换仍会将 v0.0.8 之前对 `--color-info` 和 `--color-info-muted` 的使用重写为取代它们的紫色色相 token，这只影响从 v0.0.8 之前版本升级的项目。

  每个状态填充和状态文本颜色都是彩色的：没有 Core 默认值、第一方主题，或根据 `architecture:theme-compilation` INV17 派生的值会以中性灰、近黑或近白绘制它们。对比度下限和彩色规则约束 Core 的默认值、Astryx 的第一方主题以及浅色和深色模式下的派生值；第三方主题设置的值是该主题自己的值。组件根据表面选择角色，而不是对每个任务使用同一种颜色。当主题未设置内容或文本角色时，主题生成会派生它（`architecture:theme-compilation` INV17）。生成的 token 文档用一行描述每个状态角色：它服务的表面以及与之配对的 token。

  在强制颜色模式下，浏览器的系统颜色会替换所有状态角色：状态文本、图标和填充上的内容以 `CanvasText` 呈现，填充以 `Canvas` 呈现。因此状态在那里绝不依赖颜色。每个状态保留其非颜色线索（标签、图标或文本），强烈或浅淡的状态填充保留可见的 `CanvasText` 边框，使其形状得以保留。

  Tailwind 按绘制属性投射每个状态：文本类实用程序（`text-`、`decoration-`、`placeholder-`、`caret-<status>`）读取状态文本角色，线条类实用程序（`border-`、`divide-`、`outline-`、`ring-<status>`）读取状态边框角色，填充类实用程序（`bg-`、`accent-`、`fill-`、`stroke-<status>`、阴影颜色和渐变）使用强烈填充。Tailwind 还投射 `bg-<status>-muted`、`text-on-<status>`、`text-on-<status>-muted` 和 `text-status-<status>`，并保留为状态文本角色的别名；和每个 Tailwind 键一样，这些只是 token 的别名，不添加 CSS 变量。

- **INV12 — 内置强调色对满足 4.5:1。** 在 Core 的默认值中，`--color-on-accent` 在 `--color-accent` 上于浅色和深色模式下均满足 4.5:1。
- **INV13 — 表单控件的边缘满足 3:1。** `--color-border-control` 是字段外壳以及复选框或单选按钮框的边缘，这个边缘是控件位置的唯一线索。在 Core 的默认值中，它在浅色和深色模式下与默认表面和页面主体的对比度均满足 3:1，并且每个 Astryx 主题模板都设置满足此要求的数值。由颜色刻度构建的主题会得到一个生成的 `--color-border-control`，其与其自身表面和主体的对比度保持在 3:1 或以上（`spec:AST-020` FR1；WCAG 2.2 SC 1.4.11）。其他边框保留其自己较浅的角色（`--color-border` 或 `--color-border-emphasized`）（DEC-2）。

本记录不拥有：

- `defineTheme` 输入形状、生成的刻度和优先级；
- 本地 token 名称、含义、登记、归属、谱系和输出；
- 挂载、嵌套、颜色模式选择或运行时主题观察；
- 将规范化主题转换为作用域 CSS 和构建文件；
- 组件特定的目标、视觉状态或私有派生变量。

这些关注点属于单独的架构记录，因此 token 变更不会悄悄改变编写、运行时、编译器或组件契约。

## Change coupling

- 添加、删除或重命名核心 `*Defaults` 家族会同时更新其 `*Vars` 导出、合并后的 `TokenName`/默认值表面、CLI 模板清单、生成的 token 文档和漂移测试。
- 添加或更改领域 token 会更新该领域的默认值和导出的名称类型；聚合领域映射仍是校验桥梁。
- 重命名或删除已发布的 token 是兼容性决策，而不是机械清理。消费方可能直接使用其 CSS 自定义属性名称。
- 更改默认值是视觉行为变更，需要针对代表性的浅色/深色、状态和高对比度表面提供真实浏览器证据。
- JavaScript 解析的变更必须为受支持的引用和颜色表达式保留 CSS 级联语义；不支持的表达式保持原样，而不是被猜测。
- 添加可移植颜色 token 时依据 INV10 选择其名称；语法无法命名的角色要先更改 INV10。
- 添加主题本地名称不会更新可移植默认值、名称类型、辅助函数或生成的 token 文档。编写校验会在编译器或辅助函数可能产生分歧之前拒绝 `tokens` 和 `localTokens` 中的重复名称。

## Owning code

- `packages/core/src/theme/tokens.stylex.ts` 拥有核心 token 名称、默认值和 StyleX 变量。
- `packages/core/src/theme/domainTokens/` 和 `packages/core/src/theme/syntax/tokens.ts` 拥有领域词汇表。语法词汇表有十九个槽位：十三个 token 颜色、代码背景、三个 diff 行填充和两个 diff 标记颜色。`--color-syntax-added` 和 `--color-syntax-removed` 默认分别为 25% 强度的 `--color-success-muted` 和 `--color-error-muted`（与透明色进行 `color-mix`）；`--color-syntax-diff-header` 在默认语法主题中默认等于 `--color-background-muted`，而在未设置该项的已定义语法主题中默认为 `transparent`（表头行位于该主题自己的语法背景上，并使用其 `punctuation` 文本）；`--color-syntax-added-marker` 和 `--color-syntax-removed-marker`（更改行的行号和字形）在默认语法主题中默认等于 `--color-text-green` 和 `--color-text-red`，而在未设置它们的已定义语法主题中，它们取该主题的 `--color-syntax-punctuation`。添加和删除行填充在每个未设置它们的主题中都保留其默认值。
- `packages/core/src/theme/defineTheme.ts` 聚合 token 类型/默认值用于校验和编写；它不会成为第二个 token 来源。
- `packages/core/src/theme/tokens.ts` 拥有服务端安全的引用和解析。
- `packages/core/src/theme/localTokens.ts` 强制可移植映射和已登记本地映射之间的边界；它不会向此词汇表添加本地名称。
- `packages/cli/assets/theme.template.ts` 和生成的 token 文档是面向主题作者和消费方的受检查投射。

## Deciding specs

AST-006 的决策 1 和 5 确立了主题本地名称是可叠加的主题家族契约，而非可移植的 Astryx token。现有的可移植词汇表和辅助函数架构保持不变。

### DEC-1 — Spacing follows the root font size

**决策者：** `cixzhang`，`2026-10-12`

间距 token 使用 `rem`。调高浏览器根字号的读者会获得成比例增大的间隙和内边距，因此文本不会在保持像素的盒子内变得拥挤；在默认 16px 根字号下，每步为 `4px × step`。`defineTheme` 没有间距基准单位：它仅接受按步的 token 覆盖作为间距输入（该输入由 `architecture:theme-authoring-contract` 拥有）。有两个表面生成间距步长，并且都按照 INV9 的统一规则输出 `rem`：CLI 的主题模板（逐字复制第一方主题的步长）以及文档站点 playground 的主题编辑器（从基准步长派生刻度序列并导出为 `defineTheme` 源码）。视觉门禁的探针主题故意将 `--spacing-4` 固定为 `px`，以证明 token 值会流经整个链路；它是测试夹具，不是生成器，并保留其固定值。主题作者保持控制权：主题可以将其步长固定为 `px` 作为其记录的例外，作者写入的值永远不会被重写。接受该决策的代价：固定宽度的表格列在非常大的根字号下会因更大的内边距而失去空间；其固定 `px` 步长被记录为例外的主题，在这些步长上不跟随根字号；将间距 token 解析为像素数字的代码会读到错误的值，而没有任何 codemod 能找到它。

已拒绝：在字号为 `rem` 的同时保持间距为 `px`（文本会涨入固定盒子）；在自定义主题中转换作者写入的 `px`（这是主题自己的决定）。

### DEC-2 — Form controls get their own border role

**决策者：** `cixzhang`，`2026-11-13`

> “新的控件边框角色”——所有者决定，2026-11-13（Cindy）

字段的边缘通常是其位置的唯一线索，因此表单控件拥有自己的边框角色 `--color-border-control`，保持在 3:1（INV13）。字段外壳、复选框和单选按钮框使用它。卡片、分隔线和其他所有表面保留自己较浅的边缘（`--color-border` 或 `--color-border-emphasized`），因此在 Core 的默认值和主题模板中，只有控件会加深。由颜色刻度构建的主题会得到一个生成的控件边缘，其与其表面和主体的对比度保持在 3:1。

已拒绝：将 `--color-border-emphasized` 提高到 3:1，因为大约二十个其他表面也会随之加深。
已拒绝：将字段指向 `--color-border-gray`，因为它会在某些主题中达不到 3:1，并将字段与徽章主题绑定。

## Verification

| 不变量              | 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 失败信号                                                                                                                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| INV1, INV2, INV7    | `scripts/check-theme-template.test.mjs` 和 token 文档生成检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 某个 token 家族存在，但没有匹配的面向作者的清单或生成的文档                                                                                                                                |
| INV5                | 领域 token 导出和主题生成测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 领域名称从校验中消失，或需要导入未使用的领域实现                                                                                                                                           |
| INV6                | `packages/core/src/theme/tokens.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | JavaScript 解析与默认值、模式选择、引用或受支持的颜色表达式不一致                                                                                                                          |
| INV8                | `defineTheme.test.ts`、模板检查和 token 文档生成                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 本地名称进入可移植辅助函数/文档，或可能与可移植声明冲突                                                                                                                                    |
| INV9                | `tokens.test.ts`（核心默认值）、`SpacingRootFontSize.a11y.chromium.spec.ts`（真实 Chromium 根字号）、每个覆盖主题的 `*Theme.spacing.test.ts`、`check-cli-theme-bundle.test.mjs`（打包副本与包中的内容逐字节相等）、`theme-concentricity.test.ts`（以 rem 读取 playground 刻度序列）                                                                                                                                                                                                                                                                                                                                                  | 出现没有任何主题记录为例外的 `px` 间距步长：核心默认值、主题覆盖、打包副本或生成的刻度序列步长                                                                                             |
| INV10               | `tokens.test.ts` 仅对 Astryx 自己的 `colorDefaults` 和 `domainTokenDefaults` 进行名称检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Astryx 定义的颜色 token 不符合五种形状中的任何一种                                                                                                                                         |
| INV11               | `scripts/check-muted-status-contrast.test.mjs`（解析全局和 Banner 浅色表面角色对）、`scripts/check-badge-contrast.test.mjs`（解析 Core Badge 默认值及主题覆盖）、`scripts/check-status-text-contrast.test.mjs`（解析每个强烈填充上的 `--color-on-<status>`，以及针对表面和卡片 token 的 `--color-text-<status>`、`--color-icon-<status>` 和 `--color-border-<status>`，并检查每个第一方主题中每个状态填充和文本颜色都是彩色的）、`neutralTheme.test.ts`（固定经过审核的角色值和配对）、`tailwind-theme.test.ts`（固定状态实用程序，包括已发布的基准实用程序）、Badge、StatusDot 和 Banner 测试中的强制颜色断言，以及主题别名生成测试 | 状态角色缺失、配对错误、为灰色、被路由到错误的公共实用程序，或在浅色或深色模式下低于其对比度阈值；状态填充在强制颜色模式下失去边框；已发布的状态填充或实用程序在没有记录原因的情况下更改值 |
| INV12               | `packages/core/src/theme/contrast.test.ts` 的 "the stock accent pair meets 4.5:1 in the light/dark theme"（当前值：浅色 `#0064E0`，深色 `#0171E3`，标签 `#FFFFFF`）                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 内置 `--color-on-accent` 在 `--color-accent` 上于浅色或深色模式下低于 4.5:1                                                                                                                |
| INV13               | `packages/core/src/theme/contrast.test.ts` 针对 Core 默认值、每个主题模板和颜色刻度主题，在浅色和深色模式下解析 `--color-border-control` 与表面及页面主体的对比度                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `--color-border-control` 在任一模式下与表面或页面主体的对比度低于 3:1，对上述任一项均如此；或颜色刻度主题未输出 `--color-border-control`                                                   |
| 已发布 token 兼容性 | 类型检查加上有代表性的包/源码构建                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 已发布的 CSS 变量或类型化 token 名称在没有明确迁移决策的情况下消失                                                                                                                         |
| 视觉默认值          | 浅色、深色、状态和高对比度上下文中的真实 Chromium 示例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 更改后的默认值产生不可读或语义不一致的输出                                                                                                                                                 |
