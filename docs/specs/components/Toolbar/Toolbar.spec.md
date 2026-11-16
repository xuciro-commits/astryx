---
schema_version: 3
template_version: 7
kind: component
id: component:Toolbar
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Toolbar/Toolbar.test.tsx,
    packages/core/src/Toolbar/__tests__/Toolbar.a11y.test.tsx,
    packages/core/src/Toolbar/__tests__/Toolbar.a11y.chromium.spec.ts,
    packages/core/src/Toolbar/__tests__/ToolbarTextSize.interaction.browser.spec.ts,
    packages/core/src/Section/Section.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-regions]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:component-size-cascade,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# Toolbar component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Toolbar`，包含 `label`、`startContent`、`centerContent`、`endContent`、`size`（`md`）、`gap`（`1`）、`orientation`（`horizontal`）、`variant`（`transparent`）和 `dividers`；目标 `toolbar` 带 `size`。 |
| 行为          | 由 Section 包裹的 `role="toolbar"` 行，含起始泳道、可选的居中泳道和结束泳道。该行是一个 Tab 停靠点；方向键、Home 和 End 沿其方向在其控件之间移动焦点。                                                   |
| 终端用户影响  | 键盘用户只需按一次 Tab 进入工具栏，随后用方向键在其控件之间移动，既不会丢失文本输入框内的光标按键，也不会丢失已打开菜单内的方向键；屏幕阅读器用户会听到具名工具栏及其方向。                              |
| 构建者影响    | 无。                                                                                                                                                                                                     |
| 兼容性/就绪度 | 三泳道布局变更：当各泳道放不下时该行换行（FR2）；无公共 API 变更。五项当前状态条目（见 Current-state impact 一节）。                                                                                     |
| 审查检查      | 拒绝以下情况：超过一个 Tab 停靠点；方向键在文本输入框行中窃取光标按键；使用方 props 替换 `role`、`aria-label` 或 `aria-orientation`；将 Outer chrome 移入 Toolbar。                                      |
| 支配规则      | `family:layout-regions`；`spec:AST-020`（工具栏模式绑定）；`architecture:container-padding`。                                                                                                            |

此表是审查投影；下方正文具有权威性。

## Intent

Toolbar 在由 Section 拥有的 Outer chrome 内呈现一个具名的上下文操作区域，其中包含一行语义化的工具栏行。它拥有该行的语义、泳道布局、键盘模型和尺寸级联。使用方用法见 `Toolbar.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：三泳道布局为 `no`：当各泳道无法排入一行时，该行换行（FR2）；在狭窄容器中，居中的 TabList 保留其全部标签页，而不是在原地滚动它们
- 兼容性类别：FR2 下三泳道行的布局变更；DOM、目标和公共 API 保持不变，且当各泳道能排入一行时布局不变
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **键盘提示在减少动态效果下淡出。** 方向键提示（FR6）在 150 ms 内淡出（它立即出现），即便请求了减少动态效果；`design:reduced-motion` DR3 对精细指针不允许任何动画属性。
- **带居中内容的垂直工具栏仍并排显示。** 当 `orientation="vertical"` 且有 `centerContent` 时，三个泳道仍保持在同一条行内，而 `aria-orientation` 为垂直，ArrowDown 和 ArrowUp 在它们之间移动，因此视觉顺序与宣告的轴向不一致。
- **居中泳道中滚动的 TabList 会先让整行换行。** 在狭窄容器中，若居中泳道容纳 TabList，则只要标签页能排入工具栏就保留全部标签页，因此该行换行，结束泳道移到第二行；仅当标签页比工具栏更宽时它们才滚动。有底部分隔线时，选中的标签页指示器在各泳道共享一行时位于轨道上，在整行换行时位于其标签页上；在使整行换行或取消换行的尺寸调整后，指示器可能滞后一帧。
- **Tab 停靠点不跟随指针点击。** 点击一个未持有停靠点的控件后，停靠点仍留在先前的控件上，因此从被点击控件出发的 Shift+Tab 会先落到工具栏内部那个先前的控件，然后才离开工具栏。
- **部分字段保留自己的 Tab 停靠点。** 行内的 `textarea` 或 `select` 处于漫游停靠点之外：它保留自己的 Tab 停靠点，方向键会跳过它。APG 工具栏模式使工具栏成为单一 Tab 停靠点。

## Ownership boundary

**拥有**

- 具名工具栏行、工具栏语义、起始/可选居中/结束布局、键盘移动、尺寸级联，以及当前的 `toolbar` 目标。

**不拥有 / 非目标**

- 绘制出的 Outer chrome、变体、块内边距和选中的分隔线边缘——由 Section 拥有，此处不设契约。
- 通过三个布局槽位提供的内容——由调用方或其渲染出的组件拥有，但 `family:action-groups` FR5 赋予 Toolbar 跨其按钮的按压跟踪除外。
- 通用的任意子元素布局原语契约。
- 组合菜单或浮层内部的方向键处理——由这些组件拥有。

## Public concepts

除使用方 props 外，没有组件本地概念；`family:layout-regions` 拥有共享的结构区域边界。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 依据                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1 | 渲染结果在由 Section 拥有的 Outer chrome 中包含一个 Toolbar，该 Toolbar 携带 `role="toolbar"`、来自 `label` 的 `aria-label`、`aria-orientation`，以及带 `size` 的 `toolbar` 目标。使用方的 `role`、`aria-label` 和 `aria-orientation` 被丢弃；其他 DOM props 到达工具栏行；`ref`、`className`、`style` 和 `xstyle` 到达 Section。                                                                                                                                                                                                                 | 当前源码、文档、测试和 family  |
| FR2 | 无居中内容时，Toolbar 是由现有起始泳道和结束泳道构成的 flex 线，水平时为一行，垂直时为一列泳道；有居中内容时，它有三个泳道，在任一方向上并排，居中泳道位于工具栏中央，而每个侧边泳道占居中泳道所留宽度的一半。每个泳道将其控件按行排布。任何泳道都不裁剪或重叠另一泳道；当各泳道以其最小宽度无法排入一行时，该行换行，结束泳道移到后续行，居中泳道若在起始泳道旁放不下也随之后移，而起始或结束泳道若其控件无法排入自己的一行，则这些控件换行（`spec:AST-102` FR4）。`gap` 为泳道内和泳道间的控件留出间距。                                        | 当前源码和聚焦结构测试         |
| FR3 | 变体（默认 `transparent`）、选中的分隔线边缘，以及按尺寸的块内边距仍委托给 Section，而 Toolbar 保留工具栏语义、键盘行为和内部布局。                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码、文档和 family 契约   |
| FR4 | 该行必须（MUST）是单一 Tab 停靠点。ArrowRight 和 ArrowLeft（水平）或 ArrowDown 和 ArrowUp（垂直）在其控件之间移动焦点，在两端回绕并跳过禁用的控件；Home 和 End 移到第一个和最后一个。实现缺口：只有按钮、输入框、链接和带 `tabindex` 的元素共享该停靠点，因此 `textarea` 和 `select` 自带 Tab 停靠点，且指针点击不会移动该停靠点（见 Current-state impact 一节）。方向键不会将焦点移出其光标位于行中的文本输入框，而在已打开的组合菜单内部，方向键属于该菜单。从外部关闭组合菜单后，工具栏保留其 Tab 停靠点；在浮层内渲染时保留自己的方向键移动。 | APG 工具栏模式；当前源码和测试 |
| FR5 | 使用方的 `onKeyDown`、`onFocus` 和 `onBlur` 先运行；当使用方取消该事件时，内置处理被跳过。                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码和测试                 |
| FR6 | 进入该行的键盘焦点可以显示其方向键轴向的提示，该提示持续到首次按下方向键、Escape 或失焦；Escape 只关闭该提示。                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码                       |
| FR7 | `size`（默认 `md`）作为其后代控件的默认尺寸提供；Toolbar 启动自己的尺寸作用域，不继承外部尺寸提供者（`architecture:component-size-cascade` INV7）。                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码和测试                 |

### Allowed variation

- 调用方内容可以缺失，也可以在起始、居中和结束槽位中提供，而不改变 Outer chrome 或 Toolbar 的归属。
- 尺寸和方向可以改变当前行的几何形状和键盘轴向，而不产生独立的解剖结构部分或目标。

### Representative states

| 状态       | 必需不变式                              | 允许的变化                                           |
| ---------- | --------------------------------------- | ---------------------------------------------------- |
| 空工具栏   | Outer chrome 和具名 Toolbar 保持渲染。  | 无调用方槽位内容。                                   |
| 双泳道布局 | 起始和/或结束内容使用当前的 flex 布局。 | 任一泳道可以缺失。                                   |
| 三泳道布局 | 居中内容选择当前的三列布局。            | 起始或结束内容可以缺失。                             |
| 垂直工具栏 | Toolbar 语义和目标保持不变。            | 键盘移动使用垂直轴向；仅在没有居中内容时泳道才堆叠。 |

### Transformation and precedence order

- **ORD1 — 事件。** 先运行调用方处理器，然后运行内置处理器，除非已被取消（FR5）。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 具名工具栏。** FR1 的 role、名称和方向。
- **AR2 — 键盘。** 除 FR4 的实现缺口外，FR4 遵循 APG 工具栏模式。

## Design relationships

| 解剖结构或状态 | 设计要求                                         | 表示权威                     | 层级角色 | 组件契约      |
| -------------- | ------------------------------------------------ | ---------------------------- | -------- | ------------- |
| Outer chrome   | 提供该行周围的绘制表面、内边距和选中边界。       | Section                      | 支撑     | FR1、FR3      |
| Toolbar        | 呈现具名工具栏语义以及当前的双泳道或三泳道排布。 | 当前源码、文档和 family 契约 | 突出     | FR1、FR2、FR3 |

槽位内容是属于调用方的内容，位于 Toolbar 的布局之内。它们不会成为额外的由 Toolbar 拥有的解剖结构或目标。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Outer chrome": {
    "delegatesTo": {"owner": "component:Section", "target": "section"}
  },
  "Toolbar": {"target": "toolbar"}
}
```

## Family and system relationships

- `family:layout-regions` 拥有结构区域词汇，并将 Toolbar 记录为由 Section 支撑的上下文操作区域。
- `architecture:container-padding` 拥有由组合的 Section 与 Toolbar 使用的继承内缩和边缘补偿几何。
- `architecture:component-theming-surface` 拥有解剖结构限定、本地目标映射和组件委托。
- `architecture:public-component-api` 拥有稳定的 prop 和槽位表面。
- `spec:AST-020` 绑定由 Toolbar a11y 测试检验的工具栏无障碍模式。

## Verification map

| 契约              | 验证                                                                                                               | 代表性状态                           | 变更或失败预期                                                                      | 审计部分                      |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------ | ----------------------------------------------------------------------------------- | ----------------------------- |
| FR1               | `Toolbar.test.tsx` 的 role、名称、透传和 Section 套件                                                              | 空和已填充的 Toolbar                 | 移除 role/名称、Toolbar 目标、Section 组合或委托的 Section 目标会在当前证据中失败。 | `audit:Toolbar/anatomy`       |
| FR2               | `Toolbar.test.tsx` 的槽位和子元素计数套件                                                                          | 仅起始、仅结束、双泳道和三泳道       | 改变当前槽位存在性或双泳道/三泳道结构会使聚焦断言失败。                             | `audit:Toolbar/layout`        |
| FR2 换行          | `ToolbarTextSize.interaction.browser.spec.ts` 在 402 px 视口、165% 和 194% 默认字号下，以及在 100% 下的 1024 px 处 | Three Slot；默认文本尺寸             | 某泳道文本重叠另一泳道或离开屏幕、页面横向滚动，或居中在 100% 时偏离中央，均失败。  | `audit:Toolbar/layout`        |
| FR3               | `Toolbar.test.tsx` 的变体和块内缩测试                                                                              | 默认和传入的变体                     | 不再到达 Section 的变体失败。                                                       | `audit:Toolbar/theming`       |
| FR4、FR5、AR1–AR2 | `Toolbar.test.tsx` 的键盘和组合套件；`Toolbar.a11y.test.tsx`；`Toolbar.a11y.chromium.spec.ts`                      | 水平、垂直、文本输入、MoreMenu、浮层 | 额外的 Tab 停靠点、被窃取的光标按键，或被忽略的调用方取消都会失败。                 | `audit:Toolbar/accessibility` |
| 目标清单          | `packages/core/src/theme/themingTargets.test.ts`                                                                   | Toolbar 和委托的 Section 目标        | 运行时与文档化的目标元数据漂移会使目标校验失败。                                    | `audit:Toolbar/theming`       |
| 主题解剖结构映射  | `scripts/check-knowledge.mjs`                                                                                      | 规范解剖结构和当前本地目标           | 缺失、多余、带前缀或过期的映射会使仓库校验失败。                                    | `audit:Toolbar/theming`       |

从源码读取，尚无聚焦测试：

- FR1：使用方的 `role`、`aria-label` 和 `aria-orientation` 被丢弃，以及 `className`、`style` 和 `xstyle` 到达 Section。
- FR2：双泳道和三泳道布局本身，以及 `gap` 间距。
- FR3：分隔线边缘。
- FR5：使用方 `onFocus` 和 `onBlur` 先运行及其取消。
- FR4：`textarea` 和 `select` 保留自己的 Tab 停靠点，以及指针点击后停靠点保持不变。
- FR6。
- FR7：后代控件将 `size` 作为其默认值，以及新的尺寸作用域。

未主张每个父级内边距状态的计算内缩和边缘补偿几何。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例、family 布局规则、容器内边距机制、键盘算法、实现步骤或系统规则。它链接到它们的所有者。
