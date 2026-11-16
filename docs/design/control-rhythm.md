---
schema_version: 1
template_version: 1
kind: design
id: design:control-rhythm
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, layout, accessibility]
verified_by: []
architecture: [architecture:theme-tokens]
components: []
families: [family:input-fields]
deciding_specs: []
---

# Control rhythm design specification

## User intent

混合控件应让人感觉是有意组合而成，而不是由互不相关的尺寸系统拼装出来的。视觉上的紧凑不应使交互变得不合理地难以命中。

## Design principles

- **DR1 — 混合控件对齐。** 同一行中使用的固定高度控件与内容自适应控件必须共享有意设定的基线和视觉高度。
- **DR2 — 尺寸与密度协同调校。** 作者必须将外部尺寸与内部内边距作为一个视觉节奏来评估，而不是作为独立设置。
- **DR3 — 内容留有呼吸空间。** 文本和图标必须保留足够的内部空间，以保持可读性并视觉居中。
- **DR4 — 视觉尺寸与目标尺寸服务于不同需求。** 控件可以看起来紧凑，同时保留适合其输入环境的可操作目标。

## Anatomy and hierarchy

| 角色           | 用途               | 必需关系                     |
| -------------- | ------------------ | ---------------------------- |
| 固定控件       | 提供可预测的轮廓   | 在所选尺寸下与同级控件对齐   |
| 内容自适应控件 | 容纳可变文本或行数 | 根据周围节奏调整密度         |
| 内容通道       | 承载文本和图标     | 保持居中且不受边缘挤压       |
| 目标区域       | 接收交互           | 可以超出可见轮廓而不破坏布局 |

## State representation

静止、聚焦、加载、取值与状态等各类状态必须保持预期的行高和对齐，除非组件契约明确规定了扩展。

## Responsive and input behavior

- **DR5 — 行在约束下保持连贯。** 控件可以换行或堆叠，但由此产生的每一行都必须保持有意设定的对齐。
- **DR6 — 输入环境指导目标尺寸。** 紧凑的指针布局在视觉上可以不同于面向触控的布局，同时保持相同的控件身份。

## Accessibility intent

紧凑处理不得损害可读性、焦点可见性或可操作性。目标尺寸机制和最小阈值仍由组件、无障碍和审计契约负责。

## Representative examples

- 同一工具栏中的中等尺寸操作控件和默认密度字段落在相同的视觉高度和基线上。
- 紧凑图标控件保留的可操作目标大于其字形所暗示的大小。

## Visual references

未包含规范性资产。在提升为正式记录之前，应在 `docs/design/assets/control-rhythm/` 下添加字段与操作混合以及指针/触控示例。

## Component contract links

未声明任何组件链接。`family:input-fields` 是候选关系，尚待采纳审查。

## Decision log

尚无仓库设计决策批准此记录。它提炼了公开 Design Conventions wiki 中的尺寸与密度意图。

## Open questions

- **OQ1 — 目标尺寸意图。** 源材料描述了一个宽松的触控目标，但审计失败阈值要小得多。设计目标与机制下限需要分别定义。
- **OQ2 — 参考行。** 哪种控件组合应为每种受支持的密度提供规范性视觉证据？

## Content boundary

本文件定义感知节奏和目标意图。它不定义尺寸值、密度 prop、内边距 token、命中区域机制或审计阈值。
