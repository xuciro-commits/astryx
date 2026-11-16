---
schema_version: 2
template_version: 2
kind: theme
id: theme:y2k
authority: current
approved_by: rubyycheung
approved_at: 2026-10-17
review_triggers:
  [tokens, palette-values, component-mappings, contrast, artifacts]
verified_by:
  [
    packages/themes/y2k/src/y2kTheme.test.ts,
    packages/themes/y2k/src/y2kColorMapping.test.ts,
    packages/themes/y2k/src/y2kPalettes.test.ts,
    scripts/generate-y2k-palette-refs.test.mjs,
    scripts/check-secondary-text-contrast.test.mjs,
  ]
package: '@astryxdesign/theme-y2k'
source_theme: packages/themes/y2k/src/y2kTheme.ts
references:
  [
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:theme-compilation,
  ]
---

# Y2K theme specification

## Intent and audience

Y2K 是一个俏皮的高彩度主题，拥有标志性的 Periwinkle、Neon Green、轻盈的 Electric Blue 以及明亮的粉彩分类色。它适用于希望兼具数字流行（digital-pop）个性并在浅色和深色模式下保持语义层级的富有表现力的界面。

## Inheritance and base

Y2K 从 Astryx 核心默认值出发，覆盖选定的排版、间距、动效、圆角、阴影、语义颜色、语法、图标和组件值。它不扩展任何其他已发布的包主题。

## Portable token overrides

精确维护的数值位于 `source_theme`。Y2K 拥有其浅色与深色表面阶梯、标志性强调色、状态与分类选择、语法颜色、带颜色的阴影以及现有组件映射。可移植 token 词汇仍由 `architecture:theme-tokens` 拥有。

## Theme-local role definitions

Y2K 不定义任何公有的主题本地 token 名称。其包特定的决策使用现有的可移植 token 和组件映射槽位。

## Tonal palette definitions

Y2K 拥有完整的私有浅色与深色色阶（ramp），覆盖 neutral、accent、blue、cyan、green、orange、pink、purple、red、teal 和 yellow。其浅色 neutral 保留暖色画布，而深色 neutral 沿深蓝（navy）深色表面从 `#0E0F1A` 过渡到薰衣草色 `#EDEFFC`。已提交的请求、生成的模块和回执复现了已接受的 `astryx-oklch-v1` 结果。

Accent Light 80 是精确的 Periwinkle `#CCCFFA`。Green Light 与 Dark 80 是精确的 Neon Green `#C5E17A`。Electric Blue 无锚点；映射的 Blue 角色使用 Surface 85 `#ADDBFF`、Border 75 `#70C1FF` 和 foreground 20 `#003454`。

调色板生成是明确的维护工作，绝不在常规主题构建期间运行。

## Component and state mappings

Y2K 将现有的语义、分类、语法和带颜色的效果角色映射到命名的 Y2K 调色板色阶（stop）。Neon Green 同时提供 success 与 Green 分类角色。Electric Blue 在提高饱和度的同时保持轻盈的表面。组件消费语义 token，而不是完整调色板。

Y2K 不定义额外的组件状态或数据可视化颜色。

## Compatibility and migration

已发布的 `y2kPalettes` 对象在其既定的包导出中保持字节级一致。完整的模式感知色阶仍为创作、映射、测试和审阅工具的私有内容。

消费者可以扩展 `y2kTheme` 并覆盖颜色、语法、阴影和组件值，同时保留已发布的包契约。

## Accessibility and contrast evidence

Y2K 特定的映射与渲染组件证据覆盖浅色和深色的语义与分类状态。单个调色板色阶本身不构成无障碍声明；上下文组件证据仍是权威依据。

浅色模式次级文本（`--color-text-secondary`，Neutral Light 35）在 Periwinkle 主体背景（`--color-background-body`）上的对比度为 5.14:1，在表面和卡片上为 7.78:1。

深色 neutral 边框审计会逐一抑制每个边框，并检查是否仍有其他可见线索能够标识组件或状态：

| 组件或状态                                    | 边框角色与移除结果                                                                                     | 要求与结果                                                                           |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------ |
| 默认态 Selector、文本输入框和 InputGroup 成员 | 移除强调边框后，输入表面与主体背景的对比度仅为 1.09:1，可编辑或可选择的边界明显更难识别。              | 该边界是必要的。Neutral Dark 45 `#636889` 在 `#16182B` 输入表面上的对比度为 3.23:1。 |
| 未选中的 Checkbox 和 Radio                    | 移除强调轮廓后，空控件会融入其表面，只剩相邻的标签和间距；这些线索无法标识未选中控件的形状或目标区域。 | 该轮廓是必要的，并沿用同样达标的 3.23:1 Neutral Dark 45 配色。                       |
| 已选中或不确定状态的 Checkbox 和 Radio        | 强调色填充加上勾选标记、横条或单选圆点可独立标识该状态。                                               | 低对比度的 neutral 边框不是状态线索；强调色处理仍是权威依据。                        |
| 使用 `--color-border` 的装饰性容器边缘        | 移除边缘不会抹去控件或状态；填充、内容、间距、分组或浮层高度（elevation）仍能标识该表面。              | 继承的 1.31:1 深色默认边框是装饰性的，无需满足 3:1。                                 |
| 禁用控件                                      | 其弱化处理不用于标识可用的交互。                                                                       | 适用 WCAG 的非活动组件例外。                                                         |

焦点和语义状态继续使用其专用的强调色或状态边框（rim）以及可见的图标或文本，而非仅依赖默认的 neutral 边框。

## Build and artifact contract

包与 CLI 模板携带相同的调色板请求、生成的候选、回执、选定引用模块和主题映射。选定引用模块由 `source_theme` 和已提交的私有调色板确定性地派生。非写入检查会在缺少、多余、过期或无效引用时失败。

常规包构建消费已提交的引用，绝不重新生成调色板值。

## Verification map

| 主题契约      | 证据                             | 代表性状态                            | 失败信号                                 |
| ------------- | -------------------------------- | ------------------------------------- | ---------------------------------------- |
| 调色板标识    | 配置、生成的模块、回执、复现测试 | 浅色与深色；每个色族                  | 重新生成改变了已接受的值或稳定的来源。   |
| 标志性颜色    | 调色板与映射测试                 | Periwinkle；Neon Green；Electric Blue | 精确锚点或已批准的映射 Blue 值发生变动。 |
| 角色映射      | Y2K 映射与主题测试               | 语义、分类、语法、效果                | 某个维护中的角色绕过了选定的 Y2K 引用。  |
| 公有兼容性    | 旧版对象测试与包构建             | 键以及每个已发布的值                  | 已发布对象与其既定形状或值不同。         |
| 包/模板一致性 | 字节比较与构建                   | 包与 CLI 模板                         | 副本出现分歧。                           |

## Decision log

### DEC-1 — Y2K owns one reproducible mode-aware palette

**引用：** `theme:y2k/DEC-1`
**决策者：** `rubyycheung`, `2026-10-17`

Y2K 在完整的私有浅色与深色色阶中保留其 Periwinkle 画布、Neon Green、轻盈的 Electric Blue 以及数字流行风格的分类色身份。请求、生成结果、回执和视觉证据一起变更。

已拒绝：继承其他主题的调色板或在常规构建期间重新生成值。

### DEC-2 — Periwinkle and Neon Green remain exact

**引用：** `theme:y2k/DEC-2`
**决策者：** `rubyycheung`, `2026-10-17`

Accent Light 80 保持 `#CCCFFA`。Green Light 与 Dark 80 保持 `#C5E17A`，并同时提供 Neon Green 分类和 success 角色。

已拒绝：用无锚点的色阶近似任一标志性颜色。

### DEC-3 — Electric Blue stays airy and saturated

**引用：** `theme:y2k/DEC-3`
**决策者：** `rubyycheung`, `2026-10-17`

Electric Blue 保持无锚点。Surface 角色使用 stop 85 `#ADDBFF`，边框使用 stop 75 `#70C1FF`，深色 foreground 角色使用 stop 20 `#003454`，使 Blue 保持明亮而不会变成深色块。

已拒绝：将 Blue 表面移到 stop 80 或更低。

### DEC-4 — Existing roles use selected Y2K palette references

**引用：** `theme:y2k/DEC-4`
**决策者：** `rubyycheung`, `2026-10-17`

Y2K 的语义、分类、语法和带颜色的效果值使用命名的 Y2K 调色板色阶。Alpha 变体从选定的色阶派生，映射保留角色意图，而不是盲目套用最近颜色匹配。

已拒绝：添加数据可视化覆盖，或让组件使用完整的私有调色板。

### DEC-5 — The released palette object stays compatible

**引用：** `theme:y2k/DEC-5`
**决策者：** `rubyycheung`, `2026-10-17`

`y2kPalettes` 保持其已发布的形状和值。完整的模式感知色阶仍是私有创作数据。

已拒绝：强制现有消费者采用生成的调色板形状。

### DEC-6 — Runtime references are deterministic and minimal

**引用：** `theme:y2k/DEC-6`
**决策者：** `rubyycheung`, `2026-10-17`

Y2K 的选定引用模块恰好包含维护中的主题所引用的 family、mode 和 stop 值。写入模式会同步包与 CLI 模板输出；检查模式在不写入的情况下比较完整投影。

已拒绝：打包完整的私有调色板或维护手动选择清单。

## Open questions

- **OQ1 — 共享非文本对比度适用性**（`human-design`）：哪个当前设计记录拥有跨主题抑制方法和独立线索规则？Y2K 仅拥有上文的组件/状态矩阵、实测搭配和主题映射；将该方法应用于其他主题需等待当前的全局权威。

## Content boundary

本记录拥有 Y2K 的意图、选定的 token 与调色板映射、必需状态、主题特定例外、实测回执、已知缺口、兼容性、产物和证据。共享的生成机制与 token 词汇属于架构和工具。组件行为属于组件或族（family）记录。消费者语法属于消费者文档。
