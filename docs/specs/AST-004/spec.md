---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-004
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture:
  [
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Selector empty indicator-space collapse system spec

## Intent

让未选中的选项获得当前被空选择标记列占用的宽度。人不应该因为一个不绘制任何内容的指示器而失去标签空间。因此，当选中行的标记出现时，它可能更早地发生位移或被截断；这种差异是选择状态中已被接受的一部分。

本规格记录了一项已批准的未来变更。在下面的实现与验证落地，并在同一个 pull request 中更新该当前契约之前，`component:Selector` 仍是已发布行为的真实来源。

## Non-goals

- 在本规格 pull request 中实现运行时变更。
- 添加公开 prop 以保留或选择指示器列预留。
- 移除 `indicatorPosition` 或更改其默认逻辑边缘。
- 隐藏主题有意渲染的未选中指示器，例如未选中的 radio 替代物。
- 更改选择、键盘、加载、自适应呈现、Popover、BottomSheet 或 listbox/dialog 语义。
- 确立 input 家族或 selection 家族的布局规则。

## Requirements

- **FR1 — 空指示器空间折叠。** 解析后的选择指示器不绘制任何内容的未选中选项 MUST NOT 预留空的指示器列。
- **FR2 — 已渲染的指示器保留其空间。** 选中的标记以及任何渲染未选中状态的主题替代物 MUST 留在行布局中配置的 `indicatorPosition` 位置。
- **FR3 — 依赖状态的宽度是有意的。** 当只有选中行渲染标记时，其标签可能从不同的行内位置开始，或比未选中标签拥有更少的可用宽度。实现 MUST 保留可读的行内容与现有溢出行为，而不是用空白空间来补偿。
- **FR4 — 逻辑放置仍然适用。** `indicatorPosition="start"` 与 `"end"` MUST 在 LTR 和 RTL 下都把每个已渲染的标记放在该逻辑边缘。
- **IR1 — 从已渲染内容推导布局。** 组件 MUST 从解析后的指示器输出判断是否存在空间；它 MUST NOT 添加新的公开预留或对齐 prop。
- **IR2 — 保留主题替换。** 该变更 MUST 继续通过当前主题拥有的指示器路径解析指示器，包括选中与未选中状态。
- **IR3 — 保留语义所有权。** 折叠视觉空间 MUST NOT 更改选项 role、`aria-selected`、listbox 所有权、触发关系，或哪个元素承载稳定的 `selector-check` 主题目标。

### Platform support

- 支持的功能/引擎下限：Astryx Core 支持的所有浏览器。
- 不支持的行为：无；布局 MUST 使用现有的跨浏览器 CSS 与 React 支持下限。
- 浏览器证据：真实 Chromium 验证渲染后的间距与截断。必须包含 RTL 与紧凑宽度用例；仅凭 DOM 结构或 jsdom 不构成视觉证据。

## Current-state impact

当前 `main` 有意为每个选项渲染一个指示器包装元素，并对该包装元素施加最小行内宽度。默认未选中的 check 指示器不绘制任何内容，因此未选中行仍然预留空白空间。现有的 `Selector.test.tsx` 覆盖显式断言在两个指示器位置上都存在两个行子元素。

实现会更改 `component:Selector/FR3` 及其映射的测试。它仍然受 Selector 已经使用的当前系统的约束：

- `architecture:component-theming-surface` 继续拥有稳定的主题目标；
- `architecture:icon-resolution-and-component-slots` 继续拥有解析后的指示器替换与有状态渲染；
- `architecture:interaction-modality` 与 `architecture:layer-runtime` 保持不变；指针 Popover 与触摸 modal-dialog 行为不属于本次布局变更；并且
- `architecture:public-component-api` 继续禁止将可推导的布局差异暴露为新的调用方控制的 prop。

### Implementation requirements

1. 仅当解析后的指示器不渲染任何内容时，才折叠标记包装元素。
2. 为选中的默认 check 以及渲染未选中状态的主题指示器保留布局空间。
3. 将当前关于预留列的断言替换为聚焦覆盖：空折叠与在两个逻辑位置上的已渲染替换指示器。
4. 在实现 pull request 中更新 `component:Selector`，使其当前的需求与验证映射描述已发布的结果。
5. 在本规格迁移到 `shipped` 之前，添加稳定的真实浏览器视觉回归覆盖。

## Verification

| Contract      | Verification                        | Representative states                                               | Mutation or failure expectation                                  |
| ------------- | ----------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| FR1, FR3      | 聚焦的 `Selector.test.tsx` 布局断言 | 默认 check；选中与未选中行；狭窄的长标签                            | 空包装元素保留了宽度，或选中状态的截断被恢复的空白间距掩盖       |
| FR2, IR2      | 指示器替换测试                      | 默认 check 与主题 radio；选中与未选中                               | 未选中的主题输出消失或失去其布局空间                             |
| FR4           | 逻辑顺序测试与真实浏览器截图        | `start`/`end`；LTR/RTL；选中/未选中                                 | 已渲染的标记出现在物理边缘而非逻辑边缘                           |
| IR1, IR3      | 公开表面、role 与主题目标测试       | 默认与自定义选项渲染；搜索/非搜索                                   | 出现新的公开 prop、选项/listbox 语义发生变化，或稳定目标发生移动 |
| Visual result | 真实 Chromium 中的稳定视觉回归      | 指针 Popover 与触摸 modal dialog；窄/宽；start/end；默认/主题指示器 | 空白空间残留、可见指示器重叠，或选中/未选中内容变得不可读        |

### Completion criteria

仅当以下条件全部满足时，本规格才从 `accepted` 迁移到 `shipped`：

- 空的默认 check 包装元素不消耗指示器列宽度；
- 选中的标记与可见的未选中主题替换在 LTR 与 RTL 下都在两个逻辑位置上保留其所需空间；
- 选中行位移与更窄的可用宽度被作为有意行为覆盖，包括长标签截断；
- 聚焦的单元测试与真实浏览器视觉回归覆盖指针 Popover 与触摸 modal-dialog 呈现，且不改变其语义；并且
- `component:Selector` 在同一个 pull request 中从预留列基线更新为新的已发布行为。

## Decision log

### DEC-1 — Unselected rows collapse empty indicator space

**Reference:** `spec:AST-004/DEC-1`

**Decider:** `cixzhang`, `2026-08-30`

当解析后的选择指示器不绘制任何内容时，未选中的 Selector 选项不预留空白空间。这为未选中标签提供更多可用宽度。当指示器出现时，选中的标签可能更早地发生位移或被截断；这种状态差异是有意的。

已否决：仅仅为了让选中与未选中标签对齐而在每一行预留空列。这种对齐把内容宽度花在一个并不存在的视觉元素上，并使未选中状态变得不那么有用。

## Open questions

无。
