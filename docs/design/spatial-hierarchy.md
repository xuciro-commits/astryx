---
schema_version: 1
template_version: 1
kind: design
id: design:spatial-hierarchy
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, layout, responsive]
verified_by: []
architecture: [architecture:container-padding, architecture:theme-tokens]
components: []
families: [family:layout-primitives, family:layout-regions]
deciding_specs: []
---

# Spatial hierarchy design specification

## User intent

用户应能在阅读各个标签之前理解哪些内容属于同一组。
密集界面应保持有序，因为邻近关系表达了关联，
而不是因为每个分组都被另一个容器包裹。

## Design principles

- **DR1 — 邻近传达关联。** 紧密相关的元素必须比彼此独立的事项靠得更近。
- **DR2 — 间距随分组层级递增。** 从局部内容到分组、从分组到区块，间距必须逐级增大。
- **DR3 — 空间先于包裹。** 作者应先使用间距和对齐来建立分组，再考虑添加另一张卡片或边界。
- **DR4 — 变化是有意为之。** 一个构图必须使用足够的空间对比来揭示其层级，而不是在所有地方都套用同一个间距。

## Anatomy and hierarchy

| 角色     | 用途                                       | 必需关系                     |
| -------- | ------------------------------------------ | ---------------------------- |
| 局部间距 | 将标签、值、图标或控件与其紧邻内容连接起来 | 小于其所属分组的间距         |
| 分组间距 | 分隔同级控件或内容分组                     | 大于局部间距，小于区块间距   |
| 区块间距 | 分隔彼此独立的事项                         | 足够强，能通过眯眼测试       |
| 对齐边缘 | 跨行或跨区域连接相关内容                   | 在同一分组层级内保持一致重复 |

## State representation

在内容充实、稀疏、空白和错误状态下，空间关系都必须保持可感知。
条件性内容不得使分组顺序塌缩或反转。

## Responsive and input behavior

- **DR5 — 重排保留分组。** 在受限宽度下，内容可以堆叠或移动，但局部、分组和区块关系必须保持可区分。
- **DR6 — 动态内容保留节奏。** 校验信息、辅助文本和可选操作必须始终与其所服务的内容保持关联。

## Accessibility intent

视觉分组应与语义阅读顺序和程序化关系保持一致。
当分组需要标签、标题或其他语义边界时，空间不得成为唯一的信号。

## Representative examples

- 表单在标签与字段之间使用最紧密的关系，字段之间使用更大的间距，区块之间使用最大的间距。
- 仪表盘先通过间距和对齐区分各个区域，再添加嵌套卡片。

## Visual references

未包含规范性资源。在提升为正式记录之前，应在 `docs/design/assets/spatial-hierarchy/` 下补充宽屏和受限宽度的示例。

## Component contract links

未断言任何组件链接。所列布局族是候选关系，尚待采纳审查。

## Decision log

仓库中尚无设计决策批准本记录。它提炼自公开 Design Conventions wiki 中的间距意图，未复制 token 值或审计阈值。

## Open questions

- **OQ1 — 证据集。** 哪些页面、表单和集合示例最能验证各个分组层级？
- **OQ2 — 包裹例外。** 哪些组件族除了空间分组之外还需要可见的包裹？

## Content boundary

本文件定义感知分组。它不定义间距 token 值、内边距算法、组件 prop、DOM 结构或审计评分。
