---
schema_version: 3
template_version: 7
kind: component
id: component:SelectableCard
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.test.tsx,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.chromium.spec.ts,
    packages/core/src/__tests__/CardPress.a11y.chromium.spec.ts,
    packages/core/src/__tests__/ReducedMotionPress.a11y.chromium.spec.ts,
    .github/visual-baseline/manifest.json,
    packages/core/src/SelectableCard/SelectableCard.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/SelectableCard.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-020, spec:AST-085]
---

# SelectableCard component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 一个 Card，通过 `onChange` 切换受控的 `isSelected`，由必填的 `label` 命名，并带有 `isDisabled` 以及 Card 的 `variant`、`elevation`、`padding` 和尺寸设置。                                                                                                                                               |
| 行为          | 一个视觉隐藏的原生 checkbox 承载角色、名称与勾选态；整个表面可切换；选中会绘制内嵌描边环，且不移动布局。                                                                                                                                                                                                 |
| 最终用户影响  | 屏幕阅读器用户会听到一个具名 checkbox 及其状态；指针用户可点击卡片任意位置；禁用卡片仍可被键盘发现。                                                                                                                                                                                                     |
| 构建者影响    | 在下一个 minor 中，卡片内某个打开层（例如 Tooltip 或 HoverCard 表面）内部的点击不再到达调用方的 `onClick`；需要这些按下的处理函数应移到层内容中。主题的退出时长与缓动决定触摸按下的释放（FR4）。                                                                                                         |
| 兼容性/就绪度 | 无 API 变更。一项 `[breaking]` 行为变更已排期到下一个 minor 且尚未实现：`onClick` 不再接收打开层内部的点击。三个实现缺口列在 Current-state impact 下。触摸按下的释放发生了变化（FR4、`spec:AST-094` FR5）。                                                                                              |
| 评审检查      | 拒绝以下情形：一次按下触发两次切换；禁用卡片发生切换或离开 Tab 顺序；描边环导致布局位移；嵌套控件切换了卡片。                                                                                                                                                                                            |
| 治理规则      | `spec:AST-085/FR1,FR2,FR5,FR6`；`spec:AST-020/FR9`；`architecture:interaction-modality/INV3`；`architecture:component-theming-surface/INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV7,INV8`；`component:SelectableCard/FR4`（触摸按下的释放）；`spec:AST-094/FR5`（按下释放的退出令牌）。 |

本表是面向评审的投影；下文正文具有权威性。

## Intent

SelectableCard 把 Card 变成用于多选卡片组的一个 checkbox 选项；每张卡片就是一个 checkbox，因此单选组不在范围内。它负责隐藏 checkbox 的语义、整表面切换以及选中描边环；选中状态由调用方负责。

## Compatibility and migration

- 已发布的默认值保持：触摸按下的释放为 `no`：它按主题的退出时长与缓动淡出，如 FR4 与 `spec:AST-094` FR5 所述。鼠标按下保留卡片的桌面按下样式。其余为 `yes`，直到下一个 minor；之后调用方 `onClick`（FR2）为 `no`。
- 兼容性类别：无公开 prop、默认值或 DOM 变更；触摸按下的释放是一项非破坏性行为变更；一项行为变更以 `[breaking]` 排期到下一个 minor（`CLN-0026`）：卡片内打开层内部（例如 Tooltip 或 HoverCard 表面）的点击会停在层根处，不再到达调用方的 `onClick`（`architecture:layer-runtime` INV17）。在此之前，调用方的 `onClick` 仍会在捕获阶段为这些点击运行，因此先于层自身的处理函数。
- 受控/非受控行为：仅受控；`isSelected` 与 `onChange` 为必填
- 迁移决定：在下一个 minor 中，需要打开层内部按下的调用方 `onClick` 处理函数移到层内容中

使用方迁移说明属于使用方文档与发布说明。

### CLN-0026 — A click inside an open layer no longer reaches SelectableCard's `onClick`

| 字段     | 值                                                                                                                     |
| -------- | ---------------------------------------------------------------------------------------------------------------------- |
| id       | `CLN-0026`                                                                                                             |
| 生命周期 | 无弃用：为 FR2 排期的 `[breaking]` 变更（`architecture:layer-runtime` INV17）                                          |
| 差异     | 移除卡片根上的捕获阶段处理函数，该函数会把从卡片内打开层内部开始的点击转交给调用方的 `onClick`；此后该点击会停在层根处 |
| 回滚     | 从最终补丁基线恢复该捕获阶段处理函数                                                                                   |
| 状态     | `pending`——随其 `[breaking]` Changeset 在已声明的 minor 中落地                                                         |

## Current-state impact

- **调用方 `onClick` 仍会收到打开层内部的点击（FR2）。** 卡片内打开层（Tooltip 或 HoverCard 表面）内部的点击，会经卡片根上的捕获阶段处理函数到达调用方的 `onClick`，因此先于层自身的处理函数，这是因为层边界（`architecture:layer-runtime` INV17）会在冒泡阶段之前将其拦下；它的 `stopPropagation()` 不会阻止该按下到达层，它的 `preventDefault()` 只取消浏览器默认行为，而不取消层内部的控件，并且调用方编写的没有层根的 popover 并不是层。它不会触发切换。在下一个 minor 中，以 `[breaking]` 排期（`CLN-0026`），该处理函数会被移除，调用方应将需要这些按下的处理函数移到层内容中。
- **嵌套控件上的两个焦点指示器（FR4、AR2）。** 只要任一后代具有 `:focus-visible`，卡片就会绘制其轮廓，因此聚焦嵌套控件会同时显示卡片轮廓与该控件自身的轮廓，而 `architecture:interaction-modality` INV3 规定每次焦点移动只允许一个指示器。
- **禁用状态未在目标上体现（FR5）。** `selectable-card` 目标不携带禁用状态，因此主题无法在那里为它设定样式，而 `architecture:component-theming-surface` INV6 要求状态保留在所属目标上。

## Ownership boundary

**拥有**

- 隐藏的原生 checkbox、其名称、勾选态与禁用态。
- 从卡片表面、checkbox 与 Enter 触发的切换，以及抑制来自嵌套交互内容的切换。
- 选中描边环、选中边框颜色、悬停与按下覆盖层、委托的焦点指示器以及禁用处理。
- `selectable-card` 目标与公开的 `--selectable-card-ring-color` 变量。
- 内部说明：通过一条内部通道，Lab 的 SelectableCardGroup 可以把卡片的隐藏输入渲染为原生单选组中的 radio。没有公开 prop 暴露这一点；在将该组提升到 Core 之前，单选仍处于公开契约之外。

**不拥有 / 非目标**

- 卡片表面涂装、内边距、圆角、高度与尺寸——由 `component:Card` 拥有。
- 组语义以及哪些选项被选中——由产品调用点拥有。单选组需要 radio 模式，而 SelectableCard 不提供该模式。
- 导航与一次性操作——由 `component:ClickableCard` 拥有。

## Public concepts

| 概念 | 封闭取值或状态       | 含义                                      | 按变体/方向/状态的可获得性 | 默认值    | 所有者                     | 稳定性 | 非法值行为                                                                                             |
| ---- | -------------------- | ----------------------------------------- | -------------------------- | --------- | -------------------------- | ------ | ------------------------------------------------------------------------------------------------------ |
| 选中 | selected；unselected | 受控的勾选态，通过 `data-selected` 体现。 | 始终                       | 必填      | `component:SelectableCard` | 稳定   | —                                                                                                      |
| 禁用 | enabled；disabled    | 阻止切换，同时保持 checkbox 可获得焦点。  | 始终                       | enabled   | `component:SelectableCard` | 稳定   | —                                                                                                      |
| 变体 | Card 变体；主题新增  | Card 涂装以及与之匹配的选中描边环颜色。   | 始终                       | `default` | `component:Card`           | 稳定   | 主题新增的变体以 `--selectable-card-ring-color`（默认 `--color-accent`）绘制描边环，并保留其边框颜色。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 依据           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | SelectableCard 以给定的 `variant`、`elevation`、`padding` 和尺寸渲染 `component:Card`。根节点还带有反映 `variant` 与 `selected` 的 `selectable-card` 目标，其第一个子节点是一个视觉隐藏的原生 `input type="checkbox"`，由 `label` 命名，`checked` 等于 `isSelected`。                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与测试 |
| FR2 | 启用状态下，点击卡片表面、点击 checkbox 或在 checkbox 上按空格、或在 checkbox 上按 Enter，都会恰好调用一次 `onChange(!isSelected)`。属于嵌套交互内容、打开的 Tooltip 或 HoverCard 表面（`component:Tooltip` FR11）或选中文本的点击不会切换。表面点击时，调用方 `onClick` 在切换之后运行；点击 checkbox 或在其上按空格时，它在切换之前运行；按 Enter 时则完全不运行；它也会为不触发切换的点击运行，包括打开中的 Tooltip 或 HoverCard 表面内部的点击。在下一个 minor 中，以 `[breaking]` 排期，打开层内部的点击会停在层根处，调用方 `onClick` 不再收到它（`architecture:layer-runtime` INV17）；实现缺口：尚未实现。调用方 `onMouseUp` 在卡片自身的处理之后运行。 | 当前源码与测试 |
| FR3 | 选中会通过 Card 的描边环变量添加 2px 内嵌描边环，因此布局不会移动，并且可与任意高度阴影叠加。`default`、`transparent` 与 `muted` 以 `--color-accent` 绘制描边环；每个调色板变体以其 `--color-border-<name>` 绘制描边环；主题新增的变体以 `--selectable-card-ring-color` 绘制描边环。在 Card 绘制边框处，选中还会以描边环颜色给边框着色，而这仅限 `default` 变体。                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR4 | 启用状态下，表面在支持悬停的指针下绘制共享悬停覆盖层，并为鼠标与触摸按下绘制按下覆盖层；从嵌套交互元素上开始的触摸按下不显示按下涂装，因为它不会激活卡片，而此处的鼠标按下会保留 `:active` 涂装。触摸按下会立即显示。在触摸呈现下，其释放按主题的退出动效令牌（`--duration-exit`、`--ease-exit`）淡出，依据 `spec:AST-094` FR5；鼠标按下保留卡片的桌面按下样式。隐藏 checkbox 上的键盘焦点在卡片根上显示一个指示器（`architecture:interaction-modality` INV3）。实现缺口：只要任一后代具有 `:focus-visible`，根就会绘制轮廓，因此聚焦嵌套控件会同时绘制卡片轮廓与该控件自身的轮廓（Current-state impact）。                                                     | 当前源码与测试 |
| FR5 | `isDisabled` 将卡片调暗至半透明，移除卡片自身的点击与 mouseup 处理、调用方的 `onClick` 与 `onMouseUp`（其他调用方事件 prop 仍会到达根）以及悬停与按下覆盖层（`spec:AST-085` FR6），并以 `aria-disabled="true"` 保持 checkbox 可获得焦点；点击、空格或 Enter 都不会调用 `onChange`。禁用状态在所属目标上体现（`architecture:component-theming-surface` INV6）。实现缺口：`selectable-card` 目标反映 `variant` 与 `selected`，但不反映禁用状态（Current-state impact）。                                                                                                                                                                                          | 当前源码与测试 |
| FR6 | `ref` 到达 Card 根。受支持的 DOM、ARIA、data 与事件 prop 到达根；`xstyle`、`className` 和 `style` 在组件的交互样式之后合并。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试 |

### Allowed variation

- **AV1 — 内容。** 调用方内容（包括嵌套控件）保留自身的语义与交互。
- **AV2 — 主题涂装。** 主题可按 `variant` 与 `selected` 重新为 `selectable-card` 设定样式，并为新增变体设置描边环颜色。

### Representative states

| 状态     | 必需不变式                                                                | 允许的变化 |
| -------- | ------------------------------------------------------------------------- | ---------- |
| 未选中   | 未勾选的具名 checkbox；无描边环。                                         | 变体。     |
| 已选中   | 已勾选；以变体颜色绘制内嵌描边环，且 `default` 上有匹配的边框；布局不变。 | 高度。     |
| 键盘焦点 | 卡片根上的焦点轮廓。                                                      | —          |
| 禁用     | 带 `aria-disabled` 的可聚焦 checkbox；不切换；半透明。                    | 选中。     |
| 嵌套控件 | 激活嵌套控件不会切换卡片。                                                | 控件类型。 |

### Transformation and precedence order

- **ORD1 — 切换。** 禁用 → 不运行任何逻辑，包括调用方 `onClick` 与 `onMouseUp`；嵌套交互目标或选中文本 → 不切换，调用方处理函数仍会运行；否则恰好一次 `onChange(!isSelected)`，表面点击时调用方 `onClick` 在其后，点击 checkbox 或在其上按空格时在其前，按 Enter 时完全不运行。
- **ORD2 — 描边环颜色。** 内置变体映射 → 主题新增变体使用 `--selectable-card-ring-color`。

### Performance and resources

- **PR1 — 仅共享资源。** SelectableCard 在挂载时安装共享按下控制器，并仅在启用期间把其根标记为按下表面；它不添加自己的监听器、观察器或计时器。

## Accessibility contract

- **AR1 — 原生 checkbox。** 隐藏的 checkbox 提供角色、名称与勾选态；卡片根不添加自己的角色或 Tab 停靠点，例外是内容溢出的固定高度卡片属于滚动容器，浏览器可能将其变为无名的 Tab 停靠点（`component:Card` AR1）。
- **AR2 — 委托的焦点指示器。** 隐藏 checkbox 上的键盘焦点显示在可见的卡片根上（`architecture:interaction-modality` INV3）。实现缺口：聚焦嵌套控件会显示第二个轮廓。
- **AR3 — 可聚焦的禁用态。** 禁用卡片保留其 Tab 停靠点，暴露 `aria-disabled`，并阻断所有切换路径（`spec:AST-085` FR1、FR2、FR5）。
- **AR4 — 持久选中。** 选中会为辅助技术改变勾选态，并绘制一个在悬停与按下状态下仍保持的描边环（以及在 `default` 上的边框），而悬停与按下仍会绘制各自的覆盖层。
- **AR5 — 指针取消。** 在抬起前滑出卡片的按下不会切换它（`spec:AST-020` FR9；WCAG 2.2 2.5.2）。

## Design relationships

| 解剖或状态 | 设计要求                         | 呈现权威       | 层级角色 | 组件契约     |
| ---------- | -------------------------------- | -------------- | -------- | ------------ |
| 容器       | 选中时带内嵌描边环的交互式卡片。 | 当前源码与文档 | 突出     | FR1、FR3–FR5 |
| 内容       | 卡片内的调用方内容。             | 当前源码与文档 | 突出     | FR2、AV1     |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "selectable-card"},
  "Content": {
    "none": {
      "reason": "intentional: caller content keeps its own styling and has no component-owned paint target"
    }
  }
}
```

## Family and system relationships

- `component:Card` 提供涂装、内边距，以及 SelectableCard 所设置的描边环与高度变量。
- `spec:AST-085` 拥有可聚焦的禁用控件；AR3 记录符合性。
- `spec:AST-020` FR9 将 SelectableCard 排除在滑出例外之外；AR5 适用该规则。
- `architecture:component-theming-surface` 规定 `selectable-card` 目标遵循的规则，并要求为可扩展的 `variant` 提供安全基线，`--selectable-card-ring-color` 满足这一点。

## Verification map

| 契约          | 验证                                                                                                                         | 代表性状态                                                                | 变异或失败预期                                                                                                                                                                                          | 审计小节                        |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1, FR2      | `SelectableCard.test.tsx` 的表面、checkbox、Enter 与 Space 测试                                                              | 未选中、已选中                                                            | 漏掉切换、`onChange` 值错误，或 Space 导致重复切换，都会失败。缺口：表面点击测试只断言值，不断言调用次数，也没有测试断言 `selectable-card` 目标或其反映，或调用方 `onClick` 与 `onMouseUp` 的先后顺序。 | `audit:SelectableCard/behavior` |
| FR3           | `SelectableCard.test.tsx` 高度测试；稳定视觉基线 `core-selectablecard--single-select`；`SelectableCard.stories.tsx`          | 带高度的选中状态；一张选中的默认卡片位于未选中卡片旁                      | 选中时丢失高度会失败；默认描边环或边框发生变化会以变更形式返回评审。缺口：调色板与主题新增的描边环颜色没有自动化检查。                                                                                  | `audit:SelectableCard/theming`  |
| FR4           | `SelectableCard.test.tsx` 触摸按下测试；在 `core-selectablecard--single-select` 上的 `CardPress.a11y.chromium.spec.ts`       | 静止；桌面悬停与鼠标按下；触摸按下                                        | 悬停未在静止之上绘制、鼠标按下未在悬停之上绘制，或触摸按下与桌面按下或淡出不一致，都会失败。缺口：焦点轮廓以及嵌套控件上的双指示器没有自动化检查。                                                      | `audit:SelectableCard/design`   |
| FR5, AR3      | `SelectableCard.test.tsx` 禁用测试；`Checkbox.a11y.chromium.spec.ts` 的 `card-disabled` 状态                                 | 禁用下的点击、Enter、Space                                                | 禁用时发生切换，或禁用卡片离开键盘可达范围，都会失败。缺口：半透明、被移除的覆盖层以及目标上缺失的禁用反映都没有自动化检查。                                                                            | `audit:SelectableCard/a11y`     |
| FR2 (nested)  | 其他组件中的共享可点击容器 hook 测试                                                                                         | 带嵌套控件或选中文本的卡片                                                | 缺口：没有 SelectableCard 测试或 story 覆盖嵌套控件或选中文本的抑制。                                                                                                                                   | `audit:SelectableCard/behavior` |
| 主题解剖映射  | `scripts/check-knowledge.mjs`                                                                                                | 使用方解剖与当前目标                                                      | 缺失、多余或过时的映射会使仓库校验失败。                                                                                                                                                                | `audit:SelectableCard/theming`  |
| AR1, AR2, AR4 | `SelectableCard.test.tsx` checkbox 测试；`Checkbox.a11y.test.tsx` 与 `Checkbox.a11y.chromium.spec.ts` 的 SelectableCard 状态 | 未勾选、已勾选、禁用（`card-unchecked`、`card-checked`、`card-disabled`） | checkbox 角色或名称丢失、勾选态错误，或禁用卡片未被暴露为不可用或不可达，都会失败，包括在无障碍树上。缺口：没有测试断言根不添加角色或 Tab 停靠点、根上的焦点轮廓，或描边环胜过悬停。                    | `audit:SelectableCard/a11y`     |
| FR6, PR1      | 源码审查                                                                                                                     | ref；调用方 prop                                                          | 缺口：没有测试断言 ref 或透传路由，也没有测试在 SelectableCard 添加自己的监听器或计时器时失败。                                                                                                         | `audit:SelectableCard/behavior` |
| AR5           | `Checkbox.a11y.chromium.spec.ts` 对 SelectableCard 状态的按下中止检查                                                        | 在抬起前滑出卡片的按下                                                    | 滑出后抬起仍发生切换会失败。                                                                                                                                                                            | `audit:SelectableCard/a11y`     |

## Decision log

无记录。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表格/示例、当前审计结果、实现步骤或 family/system 规则。它链接到各自的所有者。
