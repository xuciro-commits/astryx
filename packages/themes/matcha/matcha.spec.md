---
schema_version: 2
template_version: 2
kind: theme
id: theme:matcha
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    packages/themes/matcha/src/matchaTheme.test.ts,
    packages/themes/matcha/src/matchaColorMapping.test.ts,
    scripts/generate-matcha-palette-refs.test.mjs,
    scripts/check-secondary-text-contrast.test.mjs,
  ]
package: '@astryxdesign/theme-matcha'
source_theme: packages/themes/matcha/src/matchaTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
  ]
---

# Matcha theme specification

## Intent and audience

Matcha 是一个质朴的植物系主题，拥有茶绿色中性色、温暖的 Tea Gold 以及克制的自然分类色。它适合希望呈现有机特质、同时在浅色和深色模式下保留熟悉的语义层级的体验。

## Inheritance and base

Matcha 从 Astryx 核心默认值出发，并覆盖选定的排版、动效、圆角、阴影、语义颜色、语法、图标和组件值。它不扩展其他已发布的包主题。

## Portable token overrides

精确维护的值位于 `source_theme` 中。Matcha 拥有其浅色与深色的表面阶梯、内容层级、状态与分类选择、语法颜色、带颜色的阴影以及现有组件映射。可移植 token 词汇仍由 `architecture:theme-tokens` 拥有。

## Theme-local role definitions

Matcha 不定义公有的主题本地 token 名称。其包特定的决策使用现有的可移植 token 和组件映射槽位。

## Tonal palette definitions

Matcha 拥有完整的私有浅色与深色色阶，涵盖中性色、红色、橙色、黄色、绿色、蓝绿色、青色、蓝色、紫色和粉色。已提交的请求、生成的模块和回执可复现已接受的 `astryx-oklch-v1` 结果。Tea Gold 使用种子色 `#E8B800`，没有硬锚点，并在两种模式下保持平滑单调的递进。

调色板生成是明确的维护工作，绝不会在常规主题构建期间运行。

## Component and state mappings

Matcha 将现有的语义、分类、语法和带颜色的效果角色映射到命名的 Matcha 调色板色阶。组件状态保留其现有含义和结构。组件消费语义 token，而不是完整调色板。

Matcha 不定义额外的组件状态或数据可视化颜色。

## Compatibility and migration

Matcha 不通过其包根暴露完整的生成调色板。完整调色板仍仅限用于编写、映射、测试和评审工具。

消费者可以扩展 `matchaTheme` 并覆盖颜色、语法、阴影和组件值，同时保留已发布的包契约。

## Accessibility and contrast evidence

Matcha 专属的映射和渲染组件证据涵盖浅色与深色语义及分类状态。单个调色板色阶本身不构成无障碍声明；上下文组件证据仍然是权威依据。

浅色模式下的次级文本（`--color-text-secondary`，Neutral Light 30）在正文上的对比度为 5.11:1，在表面和卡片上为 5.88:1。

维护映射中已知的正文文本例外如下：

- 浅色模式下 success、warning 和 error 的 Banner 描述以及 FieldStatus 文本，在其半透明填充叠加到白色上时分别为 4.58:1、5.01:1 和 4.73:1。在浅色正文 `#f0f0e0` 上，同样的组合分别为 4.03:1、4.42:1 和 4.14:1。状态图标、标题和书面描述可在不依赖颜色的情况下识别每种状态；
- 浅色模式下 Green、Orange、Pink、Red 和 Yellow 的分类文本，在各自的半透明色调叠加到白色上时分别为 4.21:1、4.03:1、4.94:1、4.14:1 和 2.41:1。在浅色正文 `#f0f0e0` 上，同样的组合分别为 3.73:1、3.57:1、4.37:1、3.64:1 和 2.15:1。这些组合出现在 13px 的 Badge 和 Token 标签以及常规尺寸的 Card 内容中，此时书面分类和组件形态仍是独立的提示；以及
- 16px 的语法文本在浅色注释和运算符（3.83:1）、浅色属性（4.27:1）以及深色注释（3.90:1）中低于 4.5:1。源文本和语法结构无需依赖颜色即可获得。

此列表涵盖根正文文本、继承的语义 Badge 和 Button、Banner 描述、FieldStatus、分类 Badge/Token/Card 内容，以及由维护中的 Matcha 映射渲染的每个语法角色。禁用文本不在范围内，因为真正禁用的控件不受最低文本对比度要求的约束。

## Build and artifact contract

包与 CLI 模板解析为相同的已评审调色板值和运行时映射。运行时 JavaScript 和 CSS 只包含主题所消费的选定值，绝不包含完整的私有候选项。编写源码和未导出的声明元数据可以保留完整调色板。当包与模板输出发生分歧，或某个选定值过期或缺失时，验证会失败。当维护的主题源码导入了除其图标注册表或选定的调色板投影之外的相对模块时，源码导入守卫会失败。

常规包构建消费已提交的值，绝不重新生成调色板。

## Verification map

| 主题契约      | 证据                             | 代表性状态             | 失败信号                                           |
| ------------- | -------------------------------- | ---------------------- | -------------------------------------------------- |
| 调色板标识    | 配置、生成的模块、回执、复现测试 | 浅色与深色；每个色族   | 重新生成会改变已接受的值或稳定的来源。             |
| Tea Gold 色阶 | 调色板测试和渲染的调色板         | 浅色与深色；所有色阶   | 出现硬停止、非单调步进或色相断点。                 |
| 角色映射      | Matcha 映射和主题测试            | 语义、分类、语法、效果 | 某个维护中的角色绕过了选定的 Matcha 引用。         |
| 运行时边界    | 源码导入守卫                     | 维护中的主题源码       | 出现除图标注册表或选定的调色板投影之外的相对导入。 |
| 包/模板一致性 | 字节比较和构建                   | 包与 CLI 模板          | 副本出现分歧。                                     |

## Decision log

### DEC-1 — Matcha owns one reproducible mode-aware palette

**引用：** `theme:matcha/DEC-1`
**决策者：** `rubyycheung`, `2026-10-17`

Matcha 在完整的私有浅色与深色色阶中保留其茶绿色中性色身份、自然分类色和温暖的 Tea Gold。请求、生成结果、回执和视觉证据一起变更。

已拒绝：继承其他主题的调色板或在常规构建期间重新生成值。

### DEC-2 — Tea Gold remains a smooth unanchored ramp

**引用：** `theme:matcha/DEC-2`
**决策者：** `rubyycheung`, `2026-10-17`

Tea Gold 使用种子色 `#E8B800`，鲜艳度 80，不使用精确锚点。浅色与深色色阶保持单调，并避免可见的硬停止。

已拒绝：引入突变 Gold 过渡的精确锚点。

### DEC-3 — Existing roles use selected Matcha palette references

**引用：** `theme:matcha/DEC-3`
**决策者：** `rubyycheung`, `2026-10-17`

Matcha 的语义、分类、语法和带颜色的效果值使用命名的 Matcha 调色板色阶。Alpha 变体从选定的色阶派生，映射保留角色意图，而不是盲目应用最近颜色匹配。

已拒绝：添加数据可视化覆盖，或让组件消费完整的私有调色板。

### DEC-4 — Runtime references are deterministic and minimal

**引用：** `theme:matcha/DEC-4`
**决策者：** `rubyycheung`, `2026-10-17`

维护的 Matcha 运行时与 CLI 生成的主题解析为相同的已评审选定调色板值。运行时 JavaScript 和 CSS 省略完整的私有候选项。未导出的编写声明可以保留它，常规构建消费已提交的值而不重新生成调色板。

已拒绝：在运行时导出完整的私有调色板，或允许包与生成模板的映射发生分歧。

## Open questions

- **OQ1 — 跨主题对比度方法论**（`human-design`）：哪个当前的设计记录拥有用于评判 token 和颜色组合的人类视觉与无障碍方法论？没有当前设计记录拥有此依赖；Matcha 仅拥有其主题特定的组合、例外和测量证据。

## Content boundary

本记录拥有 Matcha 的意图、选定的 token 与调色板映射、必需状态、主题特定例外、测量回执、已知差距、兼容性、产物和证据。共享的生成机制和 token 词汇属于架构与工具链。组件行为属于组件或家族记录。消费者语法属于消费者文档。
