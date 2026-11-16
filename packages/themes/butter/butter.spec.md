---
schema_version: 2
template_version: 2
kind: theme
id: theme:butter
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    packages/themes/butter/src/butterTheme.test.ts,
    packages/themes/butter/src/butterColorMapping.test.ts,
    packages/themes/butter/src/butterPalettes.test.ts,
    scripts/generate-butter-palette-refs.test.mjs,
  ]
package: '@astryxdesign/theme-butter'
source_theme: packages/themes/butter/src/butterTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
  ]
---

# Butter theme specification

## Intent and audience

Butter 是一个温暖的金色主题，拥有标志性的饱和蓝色强调色、Butter Yellow、奶油色中性表面和柔和分类色。它服务于那些希望在浅色和深色模式下获得俏皮温暖感、同时不牺牲语义清晰度的体验。

## Inheritance and base

Butter 从 Astryx 核心默认值出发，覆盖选定的排版、动效、圆角、阴影、语义颜色、语法、图标和组件值。它不扩展其他已发布的包主题。

## Portable token overrides

维护的确切值位于 `source_theme`。Butter 拥有其浅色和深色表面阶梯、标志性强调色、状态和分类选择、语法颜色、带色阴影以及现有组件映射。可移植 token 词汇仍归 `architecture:theme-tokens` 所有。

## Theme-local role definitions

Butter 不定义公开的主题本地 token 名称。其包特定的决策使用现有的可移植 token 和组件映射槽位。

## Tonal palette definitions

Butter 拥有完整的私有浅色和深色色阶，涵盖暖中性色、强调色、蓝色、青色、绿色、橙色、粉色、紫色、红色、蓝绿色和黄色。提交的请求、生成的模块和回执重现了已接受的 `astryx-oklch-v1` 结果。

Accent Light 40 是精确的品牌蓝 `#225BFF`。Yellow Dark 90 是精确的 Butter Yellow `#FDEE8C`。绿色和红色保持无锚点且平滑。Error、Warning 和 Success 角色使用红色、黄色和绿色色系，而不是重复的语义调色板色系。

调色板生成是显式的维护工作，绝不在常规主题构建期间运行。

## Component and state mappings

Butter 将现有的语义、分类、语法和带色效果角色映射到具名的 Butter 调色板色阶。状态角色与相应的分类色系共享红色、黄色和绿色来源。组件使用语义 token，而非完整调色板。

Butter 不定义额外的组件状态或数据可视化颜色。

## Compatibility and migration

已发布的 `butterPalettes` 对象在其既定的包导出中保持字节级一致。完整的模式感知色阶仍为编写、映射、测试和审查工具私有。

使用者可以扩展 `butterTheme` 并覆盖颜色、语法、阴影和组件值，同时保留已发布的包契约。

## Accessibility and contrast evidence

Butter 特定的映射和渲染组件证据覆盖浅色和深色语义与分类状态。单独的调色板色阶并不构成可访问性声明；上下文组件证据仍具有权威性。

Butter 维护的 Badge、Banner、FieldStatus 和 TopNav 文字配对使用具名调色板色阶，在各自的渲染上下文中满足普通文本 AA 标准：

- info Badge、Banner 标题、Banner 正文和 FieldStatus 文字在 Accent Light 55 上使用 Neutral Light 15，对比度为 4.85:1；
- error Badge、Banner 标题、Banner 正文和 FieldStatus 文字在 Red Light 60 上使用 Neutral Light 15，对比度为 5.02:1；
- 中性 Badge 在精确的 Butter Yellow 上使用 Accent Light 35，对比度为 5.49:1；
- 浅色模式 TopNav 项在温暖的导航表面上使用 Accent Light 40（5.01:1）或 Accent Light 35（6.20:1）；以及
- success 和 warning 状态保留其较深的 Neutral Light 15 文字。

这些检查覆盖每个具名组件状态中的正常尺寸文本；每个配对都超过 4.5:1 的普通文本阈值。相同的可见状态图标和文字标签独立于颜色来标识语义状态。

## Build and artifact contract

包和 CLI 模板携带相同的调色板请求、生成的候选、回执、选定引用模块和主题映射。选定引用模块由 `source_theme` 和提交的私有调色板确定性派生。非写入检查会在引用缺失、多余、过时或无效时失败。

常规包构建使用已提交的引用，绝不重新生成调色板值。

## Verification map

| 主题契约      | 证据                             | 代表性状态                          | 失败信号                               |
| ------------- | -------------------------------- | ----------------------------------- | -------------------------------------- |
| 调色板身份    | 配置、生成的模块、回执、重现测试 | 浅色和深色；每个色系                | 重新生成会改变已接受的值或稳定的来源。 |
| 标志性颜色    | 调色板与映射测试                 | 蓝色强调色；Butter Yellow；暖色正文 | 精确的标志性值发生变化。               |
| 角色映射      | Butter 映射与主题测试            | 语义、分类、语法、效果              | 维护的角色绕过选定的 Butter 引用。     |
| 公共兼容性    | 旧版对象测试和包构建             | 键和每个已发布的值                  | 已发布对象与其既定形状或值不同。       |
| 包/模板一致性 | 字节比较和构建                   | 包与 CLI 模板                       | 副本出现分歧。                         |

## Decision log

### DEC-1 — Butter owns one reproducible mode-aware palette

**引用：** `theme:butter/DEC-1`
**决策者：** `rubyycheung`、`2026-10-17`

Butter 在其完整的私有浅色和深色色阶中保留了奶油色中性画布、标志性的蓝色和黄色，以及俏皮的分类身份。请求、生成结果、回执和视觉证据会一起变更。

已拒绝：继承其他主题的调色板或在常规构建期间重新生成值。

### DEC-2 — Signature Blue and Butter Yellow remain exact

**引用：** `theme:butter/DEC-2`
**决策者：** `rubyycheung`、`2026-10-17`

Accent Light 40 保持 `#225BFF`，Yellow Dark 90 保持 `#FDEE8C`。这些锚点保留了 Butter 可识别的品牌强调色，同时周围的色阶保持平滑。

已拒绝：用无锚点色阶近似任一标志性颜色。

### DEC-3 — Status roles reuse categorical color families

**引用：** `theme:butter/DEC-3`
**决策者：** `rubyycheung`、`2026-10-17`

Error、Warning 和 Success 角色通过红色、黄色和绿色映射。私有调色板不包含重复的 Error、Warning 或 Success 色系。

已拒绝：重复分类色相归属的并行语义色阶。

### DEC-4 — Existing roles use selected Butter palette references

**引用：** `theme:butter/DEC-4`
**决策者：** `rubyycheung`、`2026-10-17`

Butter 的语义、分类、语法和带色效果值使用具名的 Butter 调色板色阶。Alpha 变体从选定色阶派生，映射保留角色意图，而不是应用盲目的最近颜色匹配。

已拒绝：添加数据可视化覆盖或让组件使用完整的私有调色板。

### DEC-5 — The released palette object stays compatible

**引用：** `theme:butter/DEC-5`
**决策者：** `rubyycheung`、`2026-10-17`

`butterPalettes` 保持其已发布的形状和值。完整的模式感知色阶仍为私有的编写数据。

已拒绝：迫使现有使用者采用生成的调色板形状。

### DEC-6 — Runtime references are deterministic and minimal

**引用：** `theme:butter/DEC-6`
**决策者：** `rubyycheung`、`2026-10-17`

Butter 的选定引用模块恰好包含维护主题所引用的色系、模式和色阶值。写入模式会同步包和 CLI 模板输出；检查模式在不写入的情况下比较完整投影。

已拒绝：打包完整的私有调色板或维护手动选择清单。

## Open questions

- **OQ1 — 跨主题对比度方法论**（`human-design`）：哪个当前设计记录拥有用于评判 token 和颜色配对的人类视觉与可访问性方法论？没有当前设计记录拥有此依赖；Butter 仅拥有其主题特定的配对、例外和测量证据。

## Content boundary

本记录拥有 Butter 的意图、选定的 token 与调色板映射、必需状态、主题特定例外、测量回执、已知差距、兼容性、产物和证据。共享的生成机制和 token 词汇属于架构与工具。组件行为属于组件或家族记录。使用方语法属于使用方文档。
