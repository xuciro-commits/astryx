---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:component-size-cascade
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
owners: [cixzhang]
applies_to:
  [
    packages/core/src/SizeContext/,
    packages/core/src/ButtonGroup/,
    packages/core/src/InputGroup/,
    packages/core/src/Toolbar/,
    packages/core/src/SideNav/,
  ]
verified_by:
  [
    packages/core/src/SizeContext/SizeContext.test.tsx,
    packages/core/src/ButtonGroup/ButtonGroup.test.tsx,
    packages/core/src/InputGroup/InputGroup.test.tsx,
    packages/core/src/Toolbar/Toolbar.test.tsx,
    packages/core/src/SideNav/SideNav.test.tsx,
  ]
deciding_specs: []
---

# Component size cascade architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layout": ["INV1", "INV2", "INV3", "INV4", "INV5", "INV9"]
  }
}
```

## Purpose

在组件拥有的分组内，用户应遇到一致的控件尺寸，而无需每个子项重复相同的 prop。显式的子项选择仍必须优先，声明级联之外的组件必须保留其自身的尺寸契约。

本记录拥有 Astryx 标准元素尺寸级联的共享运行时优先级和作用域。组件与家族契约决定参与、几何和有意覆盖。

## System model

标准级联有三个角色：

1. **参与消费方**接受标准的 `sm | md | lg` 元素尺寸轴，并通过共享尺寸上下文解析它。
2. **提供方所有者**为文档所述符合条件的后代建立默认尺寸。
3. **组件默认值**在没有显式或继承值适用时提供回退。

消费方按以下顺序解析出一个有效尺寸：

1. 显式组件 prop；
2. 最近的活动提供方值；以及
3. 消费方文档所述的组件默认值。

有效尺寸随后流经消费方自身的几何、渲染状态和主题化契约。本架构不决定这些组件特定的映射。

## Boundaries and invariants

- **INV1 — 标准轴是共享的。** 参与组件使用规范的标准元素尺寸词汇 `sm | md | lg`。具有真正不同语义轴的组件仍在此级联之外，并记录其自身的值。
- **INV2 — 参与是显式的。** 组件仅当其当前组件或家族契约采用该级联时才继承尺寸。仅仅暴露名为 `size` 的 prop 并不会使其加入。
- **INV3 — 显式意图优先。** 参与消费方的显式尺寸 prop 必须覆盖每个继承的提供方值。
- **INV4 — 最近的提供方优先。** 没有显式 prop 时，参与消费方必须使用最近的活动提供方的值。嵌套的提供方作用域不会相互泄漏。
- **INV5 — 局部默认值是最终值。** 没有显式 prop 或活动提供方值时，消费方必须使用其文档所述的组件默认值。共享辅助工具的通用默认值不会静默重写组件已发布的默认值。
- **INV6 — Null 重置继承作用域。** 提供方值为 `null` 时，会抑制该作用域内后代的外层继承值，使每个消费方使用其自身的回退值，除非有另一个更近的提供方适用。
- **INV7 — 提供方所有权是声明的。** 分组或容器仅向其当前契约指定的符合条件后代集合提供值。该所有者决定它是先继承外层尺寸、解析显式分组 prop，还是有意启动新作用域。
- **INV8 — 传播不会抹除子项所有权。** 提供方提供的是默认值，而非强制值。同级后代独立解析，一个子项的显式覆盖不得改变另一个子项或提供方。
- **INV9 — 公开、渲染和视觉尺寸一致。** 解析后，参与组件的公开值、渲染状态、几何和面向主题的尺寸元数据必须在其自身契约下描述同一个有效尺寸。
- **INV10 — 导出的传输不是组件准入。** `SizeContext`、`useSize` 和 `SizeProvider` 是公开导出，也是当前的传输方式。它们的公开兼容性属于 `architecture:public-component-api`。它们的存在或使用本身并不授权新的公开尺寸轴，也不使组件加入标准级联。

## Allowed variation

- 当其当前契约如此规定时，提供方所有者可以为后代建立固定尺寸，而无需为其自身布局消费该级联。
- 家族可以约束哪些后代继承，或有意展平嵌套成员以保持连贯的几何。
- 组件仅可在此标准级联之外使用另一种封闭尺寸词汇；通用辅助类型是实现能力，而非共享语义。
- 主题可以针对已解析的值改变 token 或几何，而不改变优先级或提供方所有权。

## Change coupling

当变更出现以下情况时，触发聚焦审查：

- 在组件中添加或移除 `useSize` 或 `SizeProvider`；
- 改变参与组件的显式、继承或回退优先级；
- 改变提供方的符合条件后代，或其是否继承外层作用域；
- 向共享 `ElementSize` 类型添加非标准值；或
- 使渲染/主题化尺寸与已解析的公开值不同。

审查会检查提供方和代表性后代在显式、继承、局部默认、嵌套和 null 重置状态下的表现。

## Owning code

- `packages/core/src/SizeContext/SizeContext.ts` 拥有共享解析和传输。
- `packages/core/src/ButtonGroup/`、`packages/core/src/InputGroup/`、`packages/core/src/Toolbar/` 和 `packages/core/src/SideNav/` 拥有当前的提供方放置、继承或固定的提供方值以及后代作用域。
- 参与组件和家族契约拥有准入、组件默认值、符合条件后代、几何和有意覆盖。
- `architecture:public-component-api` 拥有 `SizeContext`、`useSize` 和 `SizeProvider` 的导出可达性和兼容性。
- `architecture:component-theming-surface` 和组件样式所有者拥有解析后面向主题的尺寸元数据和视觉含义。

## Deciding specs

无。新尺寸概念的公开准入仍遵循 `spec:AST-002`；本记录仅治理已采用的共享级联。

## Promotion evidence gaps

本草案仅确定权威，不添加测试。在晋升为 `current` 之前，聚焦证据必须直接覆盖：

- 嵌套 `null` 提供方将外层值重置为消费方的局部默认值；
- ButtonGroup 和 InputGroup 的继承、显式分组和显式子项优先级；以及
- Toolbar 在无关的外层提供方之下有意启动固定作用域。

当前的 SideNav 测试已覆盖其固定 `sm` 页脚/操作子作用域和显式子项覆盖。这些缺口是验证工作，而非新语义。

## Verification

| 不变量    | 证据                                                                                      | 失败信号                                                             |
| --------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| INV1–INV2 | `ElementSize` 加上当前的组件/家族采用记录                                                 | 非参与方意外继承，或参与方发明并行的标准值                           |
| INV3–INV6 | `SizeContext.test.tsx` 的显式/提供方/默认、嵌套提供方、null 重置、同级和重渲染测试夹具    | 继承尺寸覆盖显式意图、外层作用域跨越更近的提供方，或局部回退丢失     |
| INV7–INV8 | 聚焦的 ButtonGroup、InputGroup、Toolbar 和 SideNav 提供方所有者测试，加上共享同级测试夹具 | 提供方触及不符合条件的后代、静默改变作用域，或一个子项改变另一个子项 |
| INV9      | 变更参与方的所属组件/家族几何、渲染状态和主题化证据；此处为代表性而非穷尽                 | 已解析尺寸与绘制或暴露的有效尺寸不一致                               |
| INV10     | 包导出清单加上 `architecture:public-component-api` 审查                                   | 导出的传输被视为私有，或传输的使用被视为组件准入                     |
