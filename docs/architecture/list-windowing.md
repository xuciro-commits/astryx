---
schema_version: 1
template_version: 3
kind: architecture
id: architecture:list-windowing
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-06
owners: [cixzhang]
applies_to:
  [
    packages/core/src/Selector/,
    packages/core/src/Table/,
    packages/core/src/Chat/,
    packages/core/src/virtualization/,
    packages/core/src/internal/virtualization.ts,
  ]
verified_by: [scripts/check-knowledge.mjs]
deciding_specs: []
---

# List windowing architecture

## Contract at a glance

| 领域            | 契约                                                                                                                          |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 主导契约        | 无。每个消费方的记录拥有用户在其长列表中看到和听到的内容；本记录只拥有哪个模块计算窗口。                                      |
| 系统行为        | 一个共享的内部窗口化模块拥有 Core 中的长列表窗口化。该模块不是公共 API（INV1、INV2）。                                        |
| 最终用户影响    | 长 Table 通过该模块进行窗口化。Selector 渲染每个选项，Chat 渲染每条消息，直到它们采用该模块；届时每个窗口化列表的行为都相同。 |
| 构建者影响      | 对长列表进行窗口化的 Core 组件调用这一个模块，而不是构建自己的模块。OQ1 开放期间不存在公共窗口化 hook。                       |
| 兼容性/就绪状态 | 增量且内部。模块为 `packages/core/src/virtualization/`（当前状态影响）。Table 已批准的虚拟化 hook 保持其公共形态。            |
| 评审检查        | 拒绝 Core 中的第二个窗口化实现、该模块的公共导出，或为采用它而更改 Table 的公共虚拟化形态。                                   |
| 主导规则        | DEC-1。                                                                                                                       |

此表是评审投影；下方正文具有权威性。

## Purpose

Core 中的长列表只渲染用户能看到的行。本记录为这项工作指定唯一所有者，使每个对列表进行窗口化的组件共享同一实现，而不是各自保留一份。

## System model

窗口化列表渲染覆盖其可见滚动视口的行，以及每侧边缘之外的少量行，并按照完整列表的大小设置滚动范围。共享窗口化模块计算渲染哪些行以及滚动范围在哪里结束。每个消费方保留自己的记录，说明何时进行窗口化、渲染什么，以及如何向辅助技术暴露完整列表。

该模块可在任一滚动轴上对列表进行窗口化。在块轴上，所有行共享同一节距。在内联轴上，每个条目有自己的宽度。消费方指定其固定条目在每侧边缘覆盖的视口空间，模块仅为其间的空间做规划。模块将内联滚动位置读取为距内联起点的距离，因此从右到左的列表也以同样的方式进行窗口化。在两个轴上，一个共享的焦点岛使聚焦条目在窗口之外保持挂载。

消费方：

- Table 的行虚拟化，位于 `module:Table/useTableRowsVirtualization` 之后。
- Table 的列虚拟化，位于 `module:Table/useTableColumnsVirtualization` 之后，在内联轴上。
- Selector 的选项列表。
- Chat 的消息列表。

## Boundaries and invariants

- **INV1 — Core 中只有一个窗口化模块。** 在 `@astryxdesign/core` 中，一个共享的内部模块拥有长列表窗口化。对长列表进行窗口化的组件使用它，并且不保留自己的窗口化实现。按页吸附的窗格滚动器（例如 DateInput 和 DateTimeInput 共享的触摸日历 `MonthScroller`，即 `monthGeometry.ts` 中的 `paneWindow`，`component:DateInput` PR1）保留自己的窗格窗口，不在本模块范围内。
- **INV2 — 模块是私有的。** 模块不是公共 API：它不从任何公共入口点导出；另一个 Astryx 包只能通过 Core 的 `./internal/*` 子路径访问它（`spec:AST-017` FR21）。在 OQ1 开放期间，这一点成立。
- **INV3 — 消费方保持其公共形态。** 采用该模块不会改变任何消费方的公共 API。`module:Table/useTableRowsVirtualization` 保持其已批准的公共形态，并在内部使用该模块。

## Current-state impact

- **模块为 `packages/core/src/virtualization/`。** 其他包只能通过 `@astryxdesign/core/internal/virtualization` 访问它。Table 的行虚拟化位于 `module:Table/useTableRowsVirtualization` 之后，使用该模块。Selector 在打开时渲染每个选项，Chat 渲染每条消息。

## Change coupling

当变更在 Core 列表中新增或修改窗口化、虚拟化或已渲染行计算，或导出窗口化符号时，请参照本记录进行评审。

## Owning code

- `packages/core/src/virtualization/` — 该模块。
- `packages/core/src/internal/virtualization.ts` — 其供其他包使用的私有入口。
- `module:Table/useTableRowsVirtualization` — Table 的公共虚拟化 hook，一个消费方。
- `module:Table/useTableColumnsVirtualization` — Table 的公共列虚拟化 hook，一个内联轴上的消费方。
- `packages/core/src/Selector/` — 一个消费方。
- `packages/core/src/Chat/` — 一个消费方。

## Deciding specs

### DEC-1 — One shared private windowing module

**参考：** `architecture:list-windowing/DEC-1`
**决策者：** `cixzhang`、`2026-11-06`
**贡献者：** `humbertovirtudes`、`2026-11-08`

一个共享的私有窗口化模块拥有 Core 中的长列表窗口化；仅限规范层面。在 OQ1 开放期间，模块保持私有。

## Open questions

- **OQ1 — 窗口化模块是公共的（hook）还是仅内部？** 尚未决定。在决定之前，模块保持私有（INV2）。

## Verification

| 不变量 | 证据                                                                                            | 失败信号                                       |
| ------ | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| INV1   | `packages/core/src/virtualization/useListWindow.test.tsx`；对每个进行窗口化的 Core 列表进行评审 | Core 组件在模块之外保留自己的窗口化实现        |
| INV2   | 对每个包入口点的公共导出评审；模块仅从 `./internal/virtualization` 导出                         | 模块或仅由其使用的类型可从公共入口点访问       |
| INV3   | 拉取请求中 `useTableRowsVirtualization` 和每个消费方的 API 差异                                 | 采用该模块会改变消费方的公共 props、类型或导出 |
