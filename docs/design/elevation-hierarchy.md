---
schema_version: 1
template_version: 1
kind: design
id: design:elevation-hierarchy
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [ernestt, cixzhang]
review_triggers: [visual, interaction, theming]
verified_by: []
architecture: [architecture:layer-runtime, architecture:theme-tokens]
components: []
families: [family:overlay-dismissal]
deciding_specs: []
---

# Elevation hierarchy design specification

## User intent

用户应能理解哪个表面位于另一个表面之上，而不会注意到过度构建的阴影系统。
看起来更高的表面也应覆盖其下方内容，并保持不被裁剪。

## Design principles

- **DR1 — 感知顺序与实际顺序一致。** 看起来更高的表面必须表现为更高的层。
- **DR2 — 深度保持克制。** 阴影和边缘应传达分隔，而不会成为主导的视觉特征。
- **DR3 — 以一种边缘语言为主。** 表面应使用明确的边缘或柔和的高度效果作为其主要边界，而不是以全强度同时组合两者。
- **DR4 — 状态环不是高度。** 输入环和聚焦环必须与传达层深的阴影在视觉上保持区别。

## Anatomy and hierarchy

| 角色     | 用途                       | 必需关系                       |
| -------- | -------------------------- | ------------------------------ |
| 基础内容 | 建立参考平面               | 保持在临时表面和浮动表面之下   |
| 浮动表面 | 在基础内容之上呈现内容     | 使用与其交互角色相称的深度     |
| 边界提示 | 将表面与其背后的内容分隔开 | 起辅助作用，而非与高度效果竞争 |
| 逃逸路径 | 使浮动表面保持可见         | 防止被较低层容器意外裁剪       |

## State representation

静止内容、浮动菜单、常驻覆盖层和临时反馈必须构成连贯的深度序列。
聚焦环或校验环不得暗示控件移动到了另一个层。

## Responsive and input behavior

- **DR5 — 深度在重新定位后仍保持。** 表面可以移动或调整大小以适应视口，但其在层级中的感知位置必须保持稳定。
- **DR6 — 浮动内容可脱离容器。** 响应式裁剪或滚动不得使表面看起来位于其本应覆盖的内容之下。

## Accessibility intent

层顺序必须能够通过焦点移动、语义和内容关系来理解，而不能仅依赖阴影。
即使柔和阴影不可用，高对比度呈现也应保留清晰的边界。

## Representative examples

- 菜单显示在触发器和附近的粘性内容之上，而没有夸张的阴影。
- 当视口变得受限时，模态框和临时通知仍保持其相对层级。

## Visual references

未包含规范性资源。在提升为正式记录之前，应在 `docs/design/assets/elevation-hierarchy/` 下补充代表性的层组合。

## Component contract links

未断言任何组件链接。`family:overlay-dismissal` 是待审查的候选关系，而非已采纳的声明。

## Decision log

仓库中尚无设计决策批准本记录。它提炼自公开 Design Conventions wiki 中的感知高度意图，并将堆叠机制交由 `architecture:layer-runtime` 处理。

## Open questions

- **OQ1 — 边界平衡。** 哪些表面原型有意结合细微边缘和阴影？
- **OQ2 — 证据集。** 哪种嵌套层序列应作为规范性视觉与行为示例？

## Content boundary

本文件定义感知深度。它不定义 z-index 值、portal、层分配、溢出机制、阴影 token 或关闭行为。
