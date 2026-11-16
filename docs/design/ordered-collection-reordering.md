---
schema_version: 1
template_version: 1
kind: design
id: design:ordered-collection-reordering
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [ernestt, cixzhang]
review_triggers: [visual, interaction, accessibility, motion]
verified_by:
  [packages/lab/src/__tests__/ReorderGripPinchZoom.a11y.chromium.spec.ts]
architecture: [architecture:interaction-modality, architecture:theme-tokens]
components: []
families: []
deciding_specs: [spec:AST-103]
---

# Ordered collection reordering design specification

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/lab/src/ListInput/**", "packages/lab/src/TransferList/**"]
}
```

## User intent

当用户重排列表或行集合时，应当理解正在移动的是什么、它将落在哪里，以及更改何时提交。指针和键盘路径应传达相同的候选位置，同时不让周围条目过早跳动。

此处理方案适用于在集合内更改顺序。自由画布放置和文件拖放目标需要单独的设计规范。

## Design principles

- **DR1 — 重排从显式手柄开始。** 交互必须从专用的操作入口开始，使激活是有意为之，同时其他条目操作仍然可用。
- **DR2 — 移动中的条目保持可辨识，但不显得被抬高。** 源条目和跟随指针的预览必须在视觉上表现为同一个处于临时移动状态的条目，且不得暗示为浮起的卡片。
- **DR3 — 集合更改前先预览放置位置。** 清晰的插入提示必须标记候选位置，同时周围条目保持稳定，直到提交。
- **DR4 — 提交只发生一次。** 集合必须在放下或释放时采用新顺序，而不是在指针越过条目时反复提交。
- **DR5 — 完成时恢复正常层级。** 临时拖拽处理必须在放下或取消时立即消失，已落定的条目必须恢复其正常对比度和深度。

## Anatomy and hierarchy

| 角色       | 用途                             | 必需关系                                   |
| ---------- | -------------------------------- | ------------------------------------------ |
| 重排手柄   | 启动并保持对交互的所有权         | 属于单个条目，并与条目的激活操作保持可区分 |
| 静止源条目 | 在活动拖拽期间保留条目的原始位置 | 保持原位直到提交，并与预览共享临时处理     |
| 移动预览   | 跟随指针移动                     | 复制源条目的身份，但不增加浮起卡片的抬高感 |
| 插入提示   | 标记候选的有序位置               | 出现在集合排序轴上的条目之间               |
| 周围条目   | 提供稳定的空间上下文             | 在重排提交前不移动                         |
| 落定集合   | 显示结果顺序                     | 完成后使每个条目恢复正常状态               |

## State representation

| 状态     | 必需表示                                 | 允许的变化                         |
| -------- | ---------------------------------------- | ---------------------------------- |
| 静止     | 手柄可被发现，但不会压过条目内容         | 手柄位置可遵循集合族约定           |
| 拖拽中   | 源条目和移动预览使用相同的临时弱化处理   | 指针预览可在两个轴上自由移动       |
| 候选位置 | 清晰的强调色插入线标记条目将落下的位置   | 线条长度和内缩可遵循行几何         |
| 已放下   | 条目落定到已提交的顺序，临时拖拽处理清除 | 落定动效可使用系统的快速运动语言   |
| 已取消   | 原始顺序和正常对比度立即恢复             | 即使启用正常动效，取消也可立即完成 |

## Responsive and input behavior

- **DR6 — 放置遵循集合轴。** 指针预览可自由移动，但候选顺序必须在集合的排序轴上计算。
- **DR7 — 键盘和指针共享插入提示。** 键盘重排必须暴露与指针重排相同的候选位置表示。
- **DR8 — 减少动效时直接更新。** 当动效被减少时，最终顺序必须直接更新，不产生动画位移。

## Accessibility intent

在整个操作过程中，焦点应保持在重排手柄上。位置变化、取消和完成应以无需看到预览也能理解的方式播报。临时弱化处理仅在活动重排期间可接受，且不得降低内容持续的可读性。

焦点机制、键盘命令、实时区域措辞和集合变更属于组件和族契约。

## Representative examples

- 一行从其手柄开始移动；原始行和指针预览暂时变得更不显眼，同时一条线标记候选间隙。
- 键盘移动会一次一个位置地更改同一插入提示，焦点保持在手柄上。
- 放下时只提交一次，随后集合落定到新顺序。

## Visual references

未包含规范性资产。指针和键盘序列应放在 `docs/design/assets/ordered-collection-reordering/` 下。

## Component contract links

`spec:AST-103` 将此处理应用于每个可重排集合，包括其键盘重排模式（DR7）。

## Decision log

### DEC-1 — Reordering follows this design, not a slide-aside

**参考：** `design:ordered-collection-reordering/DEC-1`
**决策者：** `cixzhang`、`2026-10-26`

当拖动某个条目时，周围条目留在原地，源条目保持原位并变暗，移动预览跟随指针，条目之间的强调色插入线标记其将落下的位置；条目仅在放下时重新排列一次，取消则立即恢复。键盘重排显示相同的插入线。对于小型放置目标，带放置标记且仅在释放时产生动效的方式，比让相邻条目在指针下方移动更准确。

已拒绝：拖拽期间相邻条目滑到一旁。

## Open questions

- **OQ1 — 预览处理。** 对静止源条目和移动预览同时使用弱化效果，在浅色、深色和高对比度主题下是否仍然合适？
- **OQ2 — 插入几何。** 哪些集合族需要为默认的条目间插入线设置刻意例外？
- **OQ3 — 代表性所有者。** 哪个组件或族应提供规范的指针和键盘证据？

## Content boundary

本文件定义有序重排的视觉和交互意图。它不定义事件处理、键盘命令、焦点实现、播报字符串、列表变更、令牌名称、画布放置或文件拖放行为。
