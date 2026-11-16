---
schema_version: 1
template_version: 1
kind: design
id: design:shape-relationships
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, theming, layout]
verified_by: []
architecture: [architecture:theme-tokens, architecture:theme-authoring-contract]
components: []
families: []
deciding_specs: []
---

# Shape relationships design specification

## User intent

嵌套表面应看起来像同一个有意设计的形状的组成部分。内角不应在视觉上与容器冲突，装饰性强调也不应破坏圆角表面的几何结构。

## Design principles

- **DR1 — 圆角半径遵循角色。** 圆角特征必须反映元素是内部内容、控件、容器、页面区域还是完全圆角的形态。
- **DR2 — 嵌套曲线保持同心。** 在考虑两者之间的空间之后，内角与外角必须看起来是平行的形状。
- **DR3 — 形状特征是系统性的。** 主题应连贯地调整整体锐利度或圆润度，而不是覆盖孤立的元素。
- **DR4 — 装饰强调尊重几何结构。** 边框和边缘强调必须与角的形状融合，而不是在视觉上与其碰撞。

## Anatomy and hierarchy

| 角色     | 用途               | 必需关系                             |
| -------- | ------------------ | ------------------------------------ |
| 外表面   | 确立包含内容的形状 | 决定嵌套内容可用的曲线               |
| 间隔空间 | 分隔嵌套边界       | 在视觉上吸收外曲线与内曲线之间的差异 |
| 内表面   | 延续容器的几何结构 | 看起来与外表面同心                   |
| 强调边缘 | 增加强调或状态     | 跟随而不是打断表面形状               |

## State representation

悬停、聚焦、选中和状态边框必须保持基础几何结构。更改状态不得引入冲突的圆角体系。

## Responsive and input behavior

- **DR5 — 形状在尺寸调整后仍成立。** 响应式变化可以改变尺寸，但嵌套的角关系必须保持连贯。
- **DR6 — 状态环跟随所属形状。** 聚焦或选中处理必须沿着可见的所属形状描绘，不得产生双重或不匹配的曲线。

## Accessibility intent

形状应强化边界和归属，但不得成为状态或分组的唯一信号。焦点和状态应独立于圆角样式而可感知。

## Representative examples

- 嵌套面板的内曲线跟随其容器和间隔空间。
- 选中的圆角卡片获得融合的边界，而不是一条与其圆角碰撞的粗侧边条纹。

## Visual references

未包含规范性资产。在提升为正式记录之前，应在 `docs/design/assets/shape-relationships/` 下添加嵌套和有状态示例。

## Component contract links

此种子草稿中未声明任何组件链接。

## Decision log

尚无仓库设计决策批准此记录。它提炼了公开 Design Conventions wiki 中的同心形状意图，且未复制半径值或计算公式。

## Open questions

- **OQ1 — 允许的例外。** 哪些组件因其内容或裁剪模型需要而有意打破同心几何结构？
- **OQ2 — 证据集。** 哪些嵌套表面和主题最能展示这种关系在锐利与圆润两种主题个性之间的表现？

## Content boundary

本文件定义感知形状关系。它不定义圆角 token 值、公式、CSS、主题 API、边框宽度或审计检查。
