---
schema_version: 3
template_version: 7
kind: component
id: component:SegmentedControlItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    interaction,
    motion,
    theming,
    styling,
    accessibility,
    visual,
    react-runtime,
    compatibility,
  ]
verified_by:
  [
    packages/core/src/SegmentedControl/SegmentedControl.test.tsx,
    packages/core/src/SegmentedControl/__tests__/SegmentedControl.interaction.browser.spec.ts,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.chromium.spec.ts,
    packages/core/src/__tests__/PressedState.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: [design:user-states]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-020, spec:AST-085, spec:AST-102]
---

# SegmentedControlItem component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                             |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 无变化。SegmentedControlItem 接受 `value`、`label`、`isLabelHidden`、`icon`、`isDisabled` 与基础 props，且必须位于 SegmentedControl 内部。                                                                                                                           |
| Behavior                | 单个分段：一个带 `aria-checked` 的 `<button role="radio">`。点击，或在聚焦分段上按空格键或回车键，会选中它，除非它已被选中、已禁用，或调用方的 `onClick` 阻止了默认行为。                                                                                            |
| End-user impact         | 用户看到选中的分段凸起并加粗，一次点击即可切换。纯图标分段仍有名称。已禁用但被选中的分段保留 Tab 停靠点。                                                                                                                                                            |
| Builder impact          | 无。                                                                                                                                                                                                                                                                 |
| Compatibility/readiness | 记录已发布行为；无 API、默认值或 DOM 变化。调用方的 `onClick` 在禁用时仍会执行，调用方的 `className` 会被替换，分段保持固定高度，被截断的 `sm` 分段可能窄于 24 px；这些均列在 Current-state impact 下。                                                              |
| Review checks           | 拒绝以下情况：分段没有名称、点击选中已禁用的分段、已选中或已禁用的分段出现按压着色、强制颜色模式下的选中状态丢失。                                                                                                                                                   |
| Governing rules         | `component:SegmentedControl`；WAI-ARIA radio 模式；`spec:AST-020` FR9、FR15、DEC-5；`spec:AST-085` FR1、FR2；`spec:AST-102` FR4；`design:user-states` DR1–DR3（按压覆盖层、禁用无响应、选中分段例外）；`architecture:public-component-api` INV5、INV6；WCAG 1.4.11。 |

本表是供审查用的投影；以下正文才是权威。

## Intent

SegmentedControlItem 是 SegmentedControl 中的一个选项。它拥有分段的 radio 语义、点击选中、命名、标签与图标渲染、条目禁用状态，以及分段的着色。使用方用法见 `SegmentedControlItem.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`；标签可见、启用
- 兼容类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变化
- 受控/非受控行为：由父级的 `value` 控制
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 分段按钮、其 radio 角色、选中与禁用状态，以及名称。
- 点击选中与 `onClick` 合成。
- 标签与图标渲染、截断，以及按尺寸与状态的分段着色。

**不拥有 / 非目标**

- Tab 停靠点、方向键导航、选中跟随焦点、组禁用状态，以及主题解剖映射 —— 由 `component:SegmentedControl` 拥有。`segmented-control-item` 目标在 SegmentedControl 的使用方文档中声明，并在其记录中映射。
- 图标图稿 —— 由调用方拥有。
- 在 SegmentedControl 之外使用 —— 不支持。

## Public concepts

| 概念 | 封闭取值或状态     | 含义                           | 按变体/方向/状态可用性 | 默认值  | 所有者                           | 稳定性 | 无效值行为                  |
| ---- | ------------------ | ------------------------------ | ---------------------- | ------- | -------------------------------- | ------ | --------------------------- |
| 值   | string             | 该分段选中的值。               | 始终。                 | 必填    | `component:SegmentedControlItem` | 稳定   | TypeScript 拒绝缺失的值。   |
| 标签 | string；可见或隐藏 | 可见文本，或纯图标分段的名称。 | 始终。                 | visible | `component:SegmentedControlItem` | 稳定   | TypeScript 拒绝缺失的标签。 |
| 禁用 | off、item、group   | 阻止选中。                     | 始终。                 | off     | `component:SegmentedControlItem` | 稳定   | 不适用。                    |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 依据                                                                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| FR1 | 每个分段渲染一个 `<button type="button" role="radio">`，当其 `value` 等于组值时 `aria-checked` 为 true，并带有 `data-value`，以及反映 `data-size`、`data-selected` 与 `data-disabled` 的 `segmented-control-item` 目标。转发的 prop 不能覆盖该角色。                                                                                                                                                                                                                                                                                                                                                                               | WAI-ARIA radio 模式；当前源码与测试                                    |
| FR2 | 点击（包括在聚焦分段上按空格键或回车键的点击，即原生按钮激活；`spec:AST-020` FR15）先执行调用方的 `onClick`；除非它阻止默认行为，否则已启用且未选中的分段会把其值传给组的 `onChange`。点击已选中的分段不做任何事。调用方的 `preventDefault()` 必须否决每一次按压。                                                                                                                                                                                                                                                                                                                                                                 | `spec:AST-020` FR15；当前测试                                          |
| FR3 | 分段渲染其图标（尺寸与分段尺寸一致），其后是标签。使用 `isLabelHidden` 时不渲染标签，而是将其作为 `aria-label`，且分段不会收缩。当分段比可见标签更窄时，标签以省略号截断。                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前测试                                                               |
| FR4 | 因自身 `isDisabled` 或分组而被禁用的分段会设置 `aria-disabled`、拒绝选中、显示禁用文本颜色，且不显示悬停或按压着色。已禁用的选中分段必须保留 Tab 停靠点（`spec:AST-085` FR1）；对于不与任何分段匹配的值，由 `component:SegmentedControl` FR2 放置停靠点。实现缺口：调用方的 `onClick` 在已禁用的分段上仍会执行（`spec:AST-085` FR2）。                                                                                                                                                                                                                                                                                             | `spec:AST-085` FR1、FR2；当前测试                                      |
| FR5 | 选中的分段着色为带低阴影的凸起表面与半粗主体文本；在强制颜色模式下以 `Highlight` 与 `HighlightText` 着色。未选中的已启用分段着色为共享的悬停色调，并在 `design:user-states` DR1 与 DR2 下着色为按压覆盖层；选中的分段在按压期间保持其凸起表面，不采用按压覆盖层（DR3）；在触摸呈现下该表面会抬升（`component:SegmentedControl` FR14）。                                                                                                                                                                                                                                                                                            | WCAG 1.4.11；`design:user-states` DR1–DR3；当前测试                    |
| FR6 | 分段高度为对应尺寸的元素高度减去 4 CSS px（24、28 或 32）作为最小值，并在 `spec:AST-102` FR4 下随设定文本尺寸增长（实现缺口：高度固定），圆角与控件同心；`sm` 使用辅助文本与更紧的内边距。键盘焦点着共享焦点描边。                                                                                                                                                                                                                                                                                                                                                                                                                 | `architecture:interaction-modality` INV1；当前源码；`spec:AST-102` FR4 |
| FR7 | 分段拥有 `role`、`aria-checked`、`aria-disabled`、`aria-label`（标签隐藏时由标签设置）、`tabIndex`、`type`、`data-value` 与 `data-size`，并在各自状态下写入 `data-selected`、`data-disabled` 与按压标记 `data-astryx-pressable`；调用方对受拥有属性的取值会被替换，而调用方 `data-selected`、`data-disabled` 或 `data-astryx-pressable` 在不处于该状态的分段上会透传。`ref`、其他 `data-*`、`style`、其他 ARIA（如 `aria-describedby`）与其他基础 props 会到达按钮；`xstyle` 最后合成。调用方 `className` 必须与组件的类合成（`architecture:public-component-api` INV5、INV6）。实现缺口：组件的合并类会替换调用方的 `className`。 | `architecture:public-component-api` INV5、INV6；当前测试               |

### Allowed variation

- **AV1 — 内容。** 标签文本与图标在其类型范围内可变。

### Representative states

| 状态   | 必需的不变式                                                | 允许的变化   |
| ------ | ----------------------------------------------------------- | ------------ |
| 未选中 | `aria-checked="false"`；悬停与按压覆盖层。                  | 图标。       |
| 已选中 | `aria-checked="true"`；凸起；加粗；强制颜色下为 Highlight。 | —            |
| 纯图标 | 由 `aria-label` 命名；不收缩。                              | —            |
| 已禁用 | `aria-disabled`；无着色反馈；不可选中。                     | 条目或分组。 |

### Transformation and precedence order

- **ORD1 — 点击。** 先调用方 `onClick`，然后选中，除非被阻止、已禁用或已选中。

### Performance and resources

- **PR1 — 资源有界。** 自身没有状态、effect 或监听器；按压反馈共享按压控制器的 window 与 document 监听器。

## Accessibility contract

- **AR1 — Radio 语义。** 每个分段暴露 radio 角色、选中状态、禁用状态与名称（FR1、FR3）。
- **AR2 — 目标尺寸。** 最小的分段高 24 CSS px。在 `component:SegmentedControl` FR5 下被截断的带标签 `sm` 分段宽度可能小于 24 CSS px，不满足 WCAG 2.5.8（实现缺口）。
- **AR3 — 非颜色状态。** FR5。

## Design relationships

| 解剖或状态 | 设计要求                       | 呈现权威 | 层级角色 | 组件契约      |
| ---------- | ------------------------------ | -------- | -------- | ------------- |
| 分段       | 透明按钮；选中时为凸起表面。   | 当前源码 | 主要     | FR1、FR5、FR6 |
| 标签       | 中等文本；选中时半粗；会截断。 | 当前源码 | 主要     | FR3、FR5      |
| 图标       | 调用方图稿，尺寸与分段一致。   | 当前源码 | 辅助     | FR3           |

这些部分的靶标映射位于 `component:SegmentedControl` 的主题解剖中。

## Family and system relationships

- `component:SegmentedControl` 提供值、尺寸、布局与分组禁用状态，并拥有键盘导航。
- `spec:AST-085` 拥有禁用可聚焦性；FR4 记录了该缺口。
- `design:user-states` 拥有按压处理。

## Verification map

| 契约     | 验证                                                                                                                                                                                                            | 代表状态                       | 变异或失败预期                                                                                                                                                                                        | 审计小节                                   |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| FR1      | `SegmentedControl.test.tsx` 的 aria-checked 与 data-testid 用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`（位于 `RadioList/__tests__`）的 `segmented-option-*` 状态                     | 选中变更；data-testid          | 过期的 `aria-checked` 会失败。证据缺口：没有测试向分段传入 `role`；角色覆盖用例覆盖的是 radiogroup。                                                                                                  | `audit:SegmentedControlItem/accessibility` |
| FR2      | `SegmentedControl.test.tsx` 的点击与 onClick 合成用例；`SegmentedControl.interaction.browser.spec.ts` 针对轻点与拖动的点击提交与否决用例                                                                        | 点击；点击已选中；被阻止的点击 | 已选中或被阻止的点击仍发生选中即失败。焦点已在组内时的一次按压越过否决而选中即失败。                                                                                                                  | `audit:SegmentedControlItem/behavior`      |
| FR3      | `SegmentedControl.test.tsx` 的图标、纯图标与截断用例                                                                                                                                                            | 图标与标签；纯图标；长标签     | 名称缺失，或图标被截断，即失败。                                                                                                                                                                      | `audit:SegmentedControlItem/anatomy`       |
| FR4      | `SegmentedControl.test.tsx` 的禁用用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`（位于 `RadioList/__tests__`）的 `segmented-option-disabled` 与 `segmented-option-group-disabled*` 状态 | 条目与分组禁用                 | 已禁用的分段发生选中即失败。证据缺口：没有测试断言禁用文本颜色、缺失的悬停着色，或禁用时调用方的 `onClick`。`segmented-option-group-disabled` 状态声明了一个已选中、分组禁用且保留 Tab 停靠点的分段。 | `audit:SegmentedControlItem/accessibility` |
| FR5      | `SegmentedControl.test.tsx` 的强制颜色与按压状态用例；`PressedState.a11y.chromium.spec.ts` 的分段控件用例                                                                                                       | 强制颜色下选中；按压；禁用     | 强制颜色状态丢失，或已禁用分段出现按压着色，即失败。证据缺口：没有测试断言凸起的选中表面或悬停色调。                                                                                                  | `audit:SegmentedControlItem/visual`        |
| FR6、FR7 | 证据缺口：没有针对分段高度、文本增长、焦点描边、`ref` 或 `xstyle` 顺序的测试                                                                                                                                    | —                              | —                                                                                                                                                                                                     | `audit:SegmentedControlItem/layout`        |
| RTL 关系 | RTL 审计策展的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `SegmentedControl / With icons`                                                                                                         | 分段图标与标签；LTR 与 RTL     | 图标不在其标签的行内起始位置即不满足 D2。                                                                                                                                                             | `audit:SegmentedControlItem/i18n-rtl`      |

## Current-state impact

- **窄目标（AR2）。** 被截断的带标签 `sm` 分段宽度可能缩小到 24 CSS px 以下，不满足 WCAG 2.5.8。
- **调用方 className（FR7）。** 分段上调用方的 `className` 被组件的类替换，违反 `architecture:public-component-api` INV5 与 INV6。
- **禁用时的调用方 onClick（FR4）。** 已禁用的分段仍会执行调用方的 `onClick`，违反 `spec:AST-085` FR2。
- **固定高度（FR6）。** 分段保持固定高度，而不随设定文本尺寸增长，违反 `spec:AST-102` FR4。

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
