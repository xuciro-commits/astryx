---
schema_version: 1
template_version: 1
kind: design
id: design:typography-hierarchy
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, theming, accessibility]
verified_by: []
architecture: [architecture:theme-tokens, architecture:theme-authoring-contract]
components: []
families: []
deciding_specs: []
---

# Typography hierarchy design specification

## User intent

人们应当能够快速梳理一个界面，因为标题、正文、标签、代码和辅助文本之间有着一目了然的区别。无论是在紧凑型还是编辑型的主题个性下，阅读都应当保持舒适。

## Design principles

- **DR1 — 文字角色传达用途。** 文本必须使用与其功能相匹配的层级角色，而不是随意选用一个相近的字号。
- **DR2 — 相邻角色保持可区分。** 有意义的层级必须来自字号、字重、位置上的可见对比，或来自有意的组合。
- **DR3 — 多行文本有阅读空间。** 正文和辅助内容必须保持舒适的行距和行宽。
- **DR4 — 主题个性保留语义。** 主题可以调整比例和密度，但标题、正文、标签和辅助角色必须保留其相对含义。

## Anatomy and hierarchy

| 角色           | 用途                       | 必需关系                             |
| -------------- | -------------------------- | ------------------------------------ |
| 展示或页面标题 | 建立最强的阅读地标         | 明显高于章节和正文内容               |
| 章节标题       | 在界面内组织内容           | 与页面上下文和正文都有区别           |
| 正文           | 承载主要的阅读内容         | 针对持续可读性进行优化               |
| 标签           | 标识一个控件或紧凑的数据项 | 与其值或控件保持关联                 |
| 辅助文本       | 添加次要上下文             | 更安静，但仍可读，并与禁用文本可区分 |
| 代码或数据文本 | 保留技术或表格结构         | 保持清晰可读，而不借用标题的强调     |

## State representation

加载、禁用、状态、选中和截断状态必须保留文本角色的身份。状态样式不得抹平标题与正文的层级，也不得使辅助文本与不可用内容无法区分。

## Responsive and input behavior

- **DR5 — 行宽保持可读。** 响应式布局必须约束长文本，而不是让行无限扩展。
- **DR6 — 换行保留层级。** 标签和标题可以换行，但它们与受控内容或分组内容的关系必须保持清晰。

## Accessibility intent

文本在受支持的缩放级别、模式和主题设置下都应保持易读。层级不应仅依赖颜色，全大写或不寻常的字距不应损害持续阅读。

## Representative examples

- 页面标题、章节标题、正文段落和辅助说明在快速浏览和缩放查看时都保持可区分。
- 紧凑型仪表板和编辑型界面使用不同的个性，同时保留相同的语义角色顺序。

## Visual references

不包含规范性素材。在提升为正式记录之前，应在 `docs/design/assets/typography-hierarchy/` 下补充紧凑、编辑、缩放和受限示例。

## Component contract links

本种子草案未声明任何组件契约链接。

## Decision log

目前尚无仓库设计决策批准本记录。它提炼了公共 Design Conventions wiki 中关于易读性和层级的意图，而未复制字号阶梯或数值检查。

## Open questions

- **OQ1 — 比例协调。** 源材料的默认比例与其相邻步长的层级观感使用不同的比率。在提升为正式记录之前，需要协调意图与审计检查。
- **OQ2 — 参考内容。** 哪种真实内容集应跨主题和宽度验证每个角色？

## Content boundary

本文件定义排版意图。它不定义字号、字重、行高值、token 名称、文本组件 API 或审计阈值。
