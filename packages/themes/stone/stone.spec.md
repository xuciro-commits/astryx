---
schema_version: 2
template_version: 2
kind: theme
id: theme:stone
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    packages/themes/stone/src/stoneTheme.test.ts,
    packages/themes/stone/src/stoneColorMapping.test.ts,
    scripts/check-stone-secondary-text-contrast.test.mjs,
  ]
package: '@astryxdesign/theme-stone'
source_theme: packages/themes/stone/src/stoneTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
  ]
---

# Stone theme specification

## Intent and audience

Stone 提供一个安静、手工质感的主题，由温暖的紫罗兰中性表面和克制的大地色系分类色构成。状态和分类状态保持可识别，同时不会比中性画布更亮。

## Inheritance and base

Stone 从 Astryx 核心默认值出发，并覆盖选定的排版、动效、圆角、阴影、语义颜色、语法、图标和组件值。它不扩展其他已发布的包主题。

## Portable token overrides

确切维护的值位于 `source_theme`。Stone 拥有其表面阶梯、内容层级、状态与分类选择、带颜色的语法和阴影值，以及现有组件映射。可移植 token 词汇仍由 `architecture:theme-tokens` 拥有。

## Theme-local role definitions

Stone 不定义公有的主题本地 token 名称。其包特定的决策通过现有的可移植 token 和组件映射槽位表达。

## Tonal palette definitions

Stone 拥有完整的私有浅色与深色色阶，涵盖中性色、红色、橙色、黄色、绿色、蓝绿色、青色、蓝色、紫色和粉色。已提交的请求、生成的模块和回执可复现已接受的 `astryx-oklch-v1` 结果。该调色板保留 Stone 的紫罗兰中性身份及其确切的 Orange stop-90 和浅色 Yellow stop-90 粉彩锚点。Green、Yellow、Teal 和 Cyan 使用已评审的重新播种中点，而不是已发布的兼容色阶中点。

调色板生成是明确的维护工作，绝不会在常规主题构建期间运行。生成的请求只使用配方所实现的字段。

## Component and state mappings

Stone 将现有的语义和分类角色映射到命名的 Stone 调色板色阶。Badge、Banner、字段状态、进度填充和输入状态边缘保留其现有含义，同时共享一个已评审的颜色来源。组件消费语义 token，而不是完整调色板。

Stone 不定义额外的组件状态或数据可视化颜色。

## Compatibility and migration

已发布的 `stonePalettes` 导出仍然是每个色族的扁平共享色阶，包括数字色阶以及 `hue` 和 `chroma` 元数据。完整的模式感知色阶仍仅限用于编写、映射、测试和评审工具。

消费者可以扩展 `stoneTheme` 并覆盖颜色、语法、阴影和组件值，同时保留已发布的包契约。

## Accessibility and contrast evidence

Stone 专属测试验证次级文本、维护中的浅色输入状态边缘以及浅色语法属性。映射测试验证分类角色选定的色阶；渲染组件证据涵盖这些分类状态。单个调色板色阶本身不构成无障碍声明；上下文组件证据仍然是权威依据。浅色输入 success 和 warning 边缘使用 Green 和 Yellow 的 stop 55，相对于白色输入表面的对比度分别为 3.46:1 和 3.33:1。浅色语法属性使用 Yellow stop 40，在代码背景上为 5.19:1，在新增和删除的 diff 行上至少为 5.00:1。

## Build and artifact contract

包与 CLI 模板携带相同的调色板请求、生成的候选项、回执、选定引用模块和主题映射。选定引用模块从 `source_theme` 和已提交的私有调色板确定性派生。非写入检查会在引用缺失、多余、过期或无效时失败。

常规包构建消费已提交的选定引用，绝不重新生成调色板值。

## Verification map

| 主题契约      | 证据                             | 代表性状态                                   | 失败信号                                  |
| ------------- | -------------------------------- | -------------------------------------------- | ----------------------------------------- |
| 调色板标识    | 配置、生成的模块、回执、复现测试 | 浅色与深色；每个色族                         | 重新生成会改变已接受的值或稳定的来源。    |
| 角色映射      | Stone 映射和主题测试             | 语义、分类、语法、效果                       | 某个维护中的角色绕过了选定的 Stone 引用。 |
| 公有兼容性    | 扁平色阶兼容性测试和包构建       | 数字色阶；`hue`；`chroma`                    | 已发布的成员或形状发生变更。              |
| 上下文对比度  | Stone 对比度测试和渲染组件       | 次级文本；输入边缘；语法属性；渲染的分类状态 | 某个已测试组合未达到其要求阈值。          |
| 包/模板一致性 | 字节比较和构建                   | 包与 CLI 模板                                | 副本出现分歧。                            |

## Decision log

### DEC-1 — Stone owns one reproducible mode-aware palette

**引用：** `theme:stone/DEC-1`
**决策者：** `rubyycheung`, `2026-10-17`

Stone 在完整的私有浅色与深色色阶中保留其温暖的紫罗兰中性画布和克制的大地色系分类身份。请求、生成结果、回执和视觉证据一起变更。

已拒绝：继承其他主题的调色板或在常规构建期间重新生成值。

### DEC-2 — Existing roles use selected Stone palette references

**引用：** `theme:stone/DEC-2`
**决策者：** `rubyycheung`, `2026-10-17`

Stone 的语义、分类、语法和带颜色的效果值使用命名的 Stone 调色板色阶。Alpha 变体从选定的色阶派生。映射是角色感知的，而不是盲目的最近颜色替换。

已拒绝：添加数据可视化覆盖，或让组件消费完整的私有调色板。

### DEC-3 — The released flat palette stays compatible

**引用：** `theme:stone/DEC-3`
**决策者：** `rubyycheung`, `2026-10-17`

`stonePalettes` 保留其已发布的扁平色族形状、数字色阶、`hue` 和 `chroma`。模式感知色阶仍然是私有编写数据。

已拒绝：强迫现有消费者使用新的公有调色板形状。

### DEC-4 — Runtime references are deterministic and minimal

**引用：** `theme:stone/DEC-4`
**决策者：** `rubyycheung`, `2026-10-17`

Stone 的选定引用模块恰好包含维护中的主题所引用的色族、模式和色阶值。写入模式同步包与 CLI 模板输出；检查模式在不写入的情况下比较完整投影。

已拒绝：打包完整的私有调色板或维护手动选择清单。

## Open questions

- **OQ1 — 跨主题对比度方法论**（`human-design`）：哪个当前的设计记录拥有用于评判 token 和颜色组合的人类视觉与无障碍方法论？没有当前设计记录拥有此依赖；Stone 仅拥有其主题特定的组合、例外和测量证据。

## Content boundary

本记录拥有 Stone 的意图、选定的 token 与调色板映射、必需组合和状态、主题特定例外、测量回执、已知差距、兼容性、产物和证据。共享的生成机制和 token 词汇属于架构与工具链。组件行为属于组件或家族记录。消费者语法属于消费者文档。
