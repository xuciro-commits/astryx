---
schema_version: 2
template_version: 2
kind: theme
id: theme:gothic
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    packages/themes/gothic/src/gothicTheme.test.ts,
    packages/themes/gothic/src/gothicColorMapping.test.ts,
    scripts/generate-gothic-palette-refs.test.mjs,
    packages/cli/api/theme/build/build.media-accent-contrast.test.mjs,
  ]
package: '@astryxdesign/theme-gothic'
source_theme: packages/themes/gothic/src/gothicTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
  ]
---

# Gothic theme specification

## Intent and audience

Gothic 是一个仅深色的氛围主题，拥有深蓝灰色表面、克制的柔和粉彩分类面板和宝石色调语法颜色。它服务于那些希望获得手稿与黑色电影气质、同时不降低语义清晰度的体验。

## Inheritance and base

Gothic 从 Astryx 核心默认值出发，覆盖选定的排版、动效、圆角、阴影、语义颜色、语法、图标和组件值。无论系统颜色偏好如何，它都渲染一种深色外观，并且不扩展其他已发布的包主题。

## Portable token overrides

维护的确切值位于 `source_theme`。Gothic 拥有其深色表面阶梯、内容层级、状态和分类选择、语法颜色、带色阴影以及现有组件映射。可移植 token 词汇仍归 `architecture:theme-tokens` 所有。

## Theme-local role definitions

Gothic 不定义公开的主题本地 token 名称。其包特定的决策使用现有的可移植 token 和组件映射槽位。

## Tonal palette definitions

Gothic 拥有完整的私有深色色阶，涵盖中性色、蓝色、青色、绿色、橙色、粉色、紫色、红色、蓝绿色和黄色。提交的请求、生成的模块和回执重现了已接受的 `astryx-oklch-v1` 结果。刻意的锚点保留了 Gothic 的蓝灰色中性阶梯、柔和粉彩分类表面和宝石色调语法身份。

调色板生成是显式的维护工作，绝不在常规主题构建期间运行。请求仅使用配方已实现的字段。

## Component and state mappings

Gothic 将现有的语义、分类、语法和带色效果角色映射到具名的 Gothic 深色调色板色阶。次级控件保留 Gothic 既定的深石板色处理，组件状态保持其现有含义。组件使用语义 token，而非完整调色板。

Gothic 不定义额外的组件状态或数据可视化颜色。

## Compatibility and migration

已发布的 `gothicPalettes` 导出保持每个色系的扁平色阶，包括数字色阶以及 `hue` 和 `chroma` 元数据。完整的生成深色调色板仍为编写、映射、测试和审查工具私有。

使用者可以扩展 `gothicTheme` 并覆盖颜色、语法、阴影和组件值，同时保留已发布的包契约。

## Accessibility and contrast evidence

Gothic 特定的映射和渲染组件证据覆盖其唯一支持的模式以及维护的语义与分类状态。单独的调色板色阶并不构成可访问性声明；上下文组件证据仍具有权威性。黄色文字在 `yellow.dark[75]`（`#d3c490`）上使用 `yellow.dark[15]`（`#573f0b`），对比度为 5.69:1；粉色文字在 `pink.dark[75]`（`#c89aab`）上使用 `pink.dark[15]`（`#5c182f`），对比度为 5.33:1。这两个配对都将分类和状态内容保持在具名的 Gothic 色阶上，同时满足普通文本 AA 标准。语法注释在 `neutral.dark[10]`（`#101314`）上使用 `neutral.dark[65]`（`#7e8791`），对比度为 5.12:1，因此维护的语法映射也在不使用调色板外值的情况下满足普通文本 AA 标准。

在浅色媒体表面上，强调文字和强调图标使用该表面的强调色 `--color-on-light`（`neutral.dark[10]`，`#101314`），在白色表面上的对比度为 18.7:1。在深色媒体表面上，它们保持 `neutral.dark[95]`。

## Build and artifact contract

包和 CLI 模板携带相同的调色板请求、生成的候选、回执、选定引用模块和主题映射。选定引用模块由 `source_theme` 和提交的私有调色板确定性派生。非写入检查会在引用缺失、多余、过时或无效时失败。

常规包构建使用已提交的引用，绝不重新生成调色板值。

## Verification map

| 主题契约       | 证据                             | 代表性状态                | 失败信号                               |
| -------------- | -------------------------------- | ------------------------- | -------------------------------------- |
| 深色调色板身份 | 配置、生成的模块、回执、重现测试 | 每个色系和色阶            | 重新生成会改变已接受的值或稳定的来源。 |
| 角色映射       | Gothic 映射与主题测试            | 语义、分类、语法、效果    | 维护的角色绕过选定的 Gothic 引用。     |
| 公共兼容性     | 扁平色阶兼容性测试和包构建       | 数字色阶；`hue`；`chroma` | 已发布的成员或形状发生变化。           |
| 模式契约       | 主题 CSS 和渲染证据              | 仅深色                    | 出现依赖浅色的输出或不同的模式值。     |
| 媒体表面强调色 | 构建主题的媒体强调色对比度测试   | 深色和浅色媒体表面        | 媒体表面上的强调文字或图标低于 4.5:1。 |
| 包/模板一致性  | 字节比较和构建                   | 包与 CLI 模板             | 副本出现分歧。                         |

## Decision log

### DEC-1 — Gothic owns one reproducible dark-only palette

**引用：** `theme:gothic/DEC-1`
**决策者：** `rubyycheung`、`2026-10-17`

Gothic 在其完整的私有深色色阶中保留了蓝灰色画布、柔和粉彩分类面板和宝石色调语法身份。请求、生成结果、回执和视觉证据会一起变更。

已拒绝：继承其他主题的调色板、添加浅色模式，或在常规构建期间重新生成值。

### DEC-2 — Existing roles use selected Gothic palette references

**引用：** `theme:gothic/DEC-2`
**决策者：** `rubyycheung`、`2026-10-17`

Gothic 的语义、分类、语法和带色效果值使用具名的 Gothic 调色板色阶。Alpha 变体从选定色阶派生，映射保留角色意图，而不是应用盲目的最近颜色匹配。

已拒绝：添加数据可视化覆盖或让组件使用完整的私有调色板。

### DEC-3 — The released flat palette stays compatible

**引用：** `theme:gothic/DEC-3`
**决策者：** `rubyycheung`、`2026-10-17`

`gothicPalettes` 保持其已发布的扁平色系形状、数字色阶、`hue` 和 `chroma`。生成的深色调色板仍为私有的编写数据。

已拒绝：迫使现有使用者采用生成的调色板形状。

### DEC-4 — Runtime references are deterministic and minimal

**引用：** `theme:gothic/DEC-4`
**决策者：** `rubyycheung`、`2026-10-17`

Gothic 的选定引用模块恰好包含维护主题所引用的色系、模式和色阶值。写入模式会同步包和 CLI 模板输出；检查模式在不写入的情况下比较完整投影。

已拒绝：打包完整的私有调色板或维护手动选择清单。

## Open questions

- **OQ1 — 跨主题对比度方法论**（`human-design`）：哪个当前设计记录拥有用于评判 token 和颜色配对的人类视觉与可访问性方法论？没有当前设计记录拥有此依赖；Gothic 仅拥有其主题特定的配对、例外和测量证据。

## Content boundary

本记录拥有 Gothic 的意图、选定的 token 与调色板映射、必需状态、主题特定例外、测量回执、已知差距、兼容性、产物和证据。共享的生成机制和 token 词汇属于架构与工具。组件行为属于组件或家族记录。使用方语法属于使用方文档。
