---
schema_version: 3
template_version: 7
kind: component
id: component:RadioList
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
    packages/core/src/RadioList/RadioList.test.tsx,
    packages/core/src/RadioList/RadioList.fr10.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.chromium.spec.ts,
  ]
modules: []
families: [family:input-fields]
design_specs: [design:user-states]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# RadioList component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 无变更。RadioList 接受 `label`、`value`、`onChange`、`orientation`、`size`、`isDisabled`、`disabledMessage`、`isRequired`、`isOptional`、`status`、`htmlName`、Field 的 props、part 的 props 以及 RadioListItem 子元素。 |
| 行为          | 一个由 Field 提供标签、`role="radiogroup"`、共享同一 name 的原生单选按钮组。选中某个选项会调用 `onChange(value)`。组设置每个选项的尺寸、禁用状态以及必填语义。                                                           |
| 最终用户影响  | 用户可以通过指针、触摸或浏览器的方向键选择一个选项，且第一个 Tab 停靠点可预期。未给出原因的禁用组会脱离 Tab 顺序，因此键盘用户无法找到它。                                                                               |
| 构建者影响    | 无。                                                                                                                                                                                                                     |
| 兼容性/就绪度 | 记录已发布行为；无 API、默认值或 DOM 变更。禁用单选按钮上的原生 `disabled` 与 `spec:AST-085` FR1 和 FR7 冲突；列于“当前状态影响”下。                                                                                     |
| 审查检查      | 拒绝以下情况：组没有 name；单选按钮丢失共享 name；禁用状态下仍可选中；空值下第一个 Tab 停靠点落在组中间；使用根级样式 props。                                                                                            |
| 管辖规则      | `family:input-fields` FR10、DEC-7；`spec:AST-085` FR1–FR7；`design:user-states` DR1、DR2（经由 RadioListItem）；WAI-ARIA 单选组模式。                                                                                    |

本表是审查视角的投影；以下正文具有权威性。

## Intent

RadioList 将一小组互斥选项呈现为一个带标签的单选组。它拥有组的 name、选中值、共享的单选 name、组级禁用、必填与状态语义，以及入口 Tab 停靠点。每个选项都是 `component:RadioListItem`。使用方用法见 `RadioList.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`；`orientation="vertical"`、`size="md"`、未禁用
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：仅受控；`value` 为必填，`''` 表示未选中任何项
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 组的 Field 与 `role="radiogroup"` 元素、其 name、描述、状态、无效与必填状态，以及 `radio-list` 目标。
- 共享的单选 name、选中值以及 `onChange`。
- 组禁用以及组禁用原因提示框。
- 未选中任何项时的入口 Tab 停靠点。
- base、`container*` 与 `control*` props 落在何处。

**不拥有 / 非目标**

- 每个选项的单选按钮、命名、描述、行、禁用项状态，以及 `radio-list-item` 目标——由 `component:RadioListItem` 拥有。
- 单选按钮之间的方向键移动与选中——由浏览器的原生单选组行为负责。
- 单选指示器——由 Indicator 注册表的单选指示器拥有。
- 组标签与状态消息的呈现——由 `family:input-fields`（共享所有者章节）下的 Field 以及 `component:FieldStatus` 拥有。

## Public concepts

| 概念 | 封闭取值或状态                          | 含义                             | 按变体/方向/状态的可用性       | 默认值     | 所有者                | 稳定性 | 无效值行为                                 |
| ---- | --------------------------------------- | -------------------------------- | ------------------------------ | ---------- | --------------------- | ------ | ------------------------------------------ |
| 值   | string；无选中时为 `''`                 | 选中选项的值。                   | 始终可用。                     | 必填       | `component:RadioList` | 稳定   | 没有任何选项携带的值等于未选中任何项。     |
| 方向 | `vertical`、`horizontal`                | 选项的布局。                     | 始终可用。                     | `vertical` | `component:RadioList` | 稳定   | TypeScript 拒绝其他取值。                  |
| 尺寸 | `sm`、`md`                              | 每个选项的单选圆圈尺寸。         | 始终可用。                     | `md`       | `component:RadioList` | 稳定   | TypeScript 拒绝其他取值。                  |
| 禁用 | 关、开、开并带原因                      | 阻止每个选项被选中。             | 原因仅在 `isDisabled` 时生效。 | 关         | `component:RadioList` | 稳定   | 没有 `isDisabled` 时，原因不渲染任何内容。 |
| 状态 | `error`、`warning`、`success`、可选消息 | 组的校验状态。                   | 始终可用；消息为分离式。       | 无         | `family:input-fields` | 稳定   | TypeScript 拒绝其他类型。                  |
| 名称 | string                                  | 共享的单选 `name` 与表单字段名。 | 始终可用。                     | 生成的 id  | `component:RadioList` | 稳定   | 不适用。                                   |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 依据                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| FR1 | RadioList 以组标签模式渲染一个 Field（标签渲染为 span，除非 `isLabelHidden` 否则可见；描述、可选或必填标记、标签提示框、分离式状态），并将其包裹在一个 `role="radiogroup"` 元素外。radiogroup 的可访问名称由组标签加上调用方提供的任何 `aria-labelledby` 组成，其描述依次来自调用方提供的任何描述，以及实际存在的描述、状态消息与禁用原因。                                                                                                                                                                                                                                                                                          | WAI-ARIA 单选组模式；当前测试                      |
| FR2 | 每个选项的单选按钮共享同一个 `name`：提供了 `htmlName` 时用它，否则用生成的 id，从而让这些单选按钮构成一个原生组。被选中的单选按钮是其 `value` 等于组 `value` 的那一个。                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前测试                                           |
| FR3 | 选中一个已启用的选项会调用一次 `onChange(value)`；RadioList 自身不保存选中状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前测试                                           |
| FR4 | 当 `value` 为空时，进入该组的键盘焦点落在第一个未被原生禁用的单选按钮上（对于带原因禁用的组，即其第一个 `aria-disabled` 的单选按钮，从而在 `spec:AST-085` FR1 下保持可用的焦点顺序），反向进入时停留在最后一个上。焦点在组内单选按钮之间移动不会被重定向。存在选中项时，被选中的单选按钮就是 Tab 停靠点。方向键遵循浏览器的原生单选行为，该行为会停在 `aria-disabled` 的单选按钮上。                                                                                                                                                                                                                                                 | WAI-ARIA 单选组模式；当前测试                      |
| FR5 | `isDisabled` 必须禁用每个选项：每个单选按钮保持可聚焦且带有 `aria-disabled="true"`，与表单脱离从而不会提交，并拒绝被选中（`spec:AST-085` FR1–FR3、FR7）。`radiogroup` 元素必须带有 `aria-disabled="true"`，与 `component:ButtonGroup` FR1 的做法一致。存在 `disabledMessage` 时，在组上悬停与键盘聚焦还会打开原因提示框，且该原因必须描述每一个可聚焦的单选按钮（`spec:AST-085` FR5、FR7）。实现缺口：该原因只描述 radiogroup，因此被聚焦的单选按钮不会由它描述；而在没有 `disabledMessage` 时，每个单选按钮改为获得原生 `disabled`，这会将它们移出 Tab 顺序，且在组变为禁用时正处于焦点的单选按钮会失去焦点（`spec:AST-085` FR4）。 | `spec:AST-085` FR1–FR5、FR7；当前测试              |
| FR6 | `status.type === 'error'` 会在 radiogroup 上设置 `aria-invalid`。radiogroup 通过 `aria-required` 暴露生效的必填状态（包括表单级默认值），而每个单选按钮的原生 `required` 只遵循显式的 `isRequired`；原生为必填的单选按钮的 `aria-invalid` 遵循同一状态，因此浏览器自身的无效状态绝不会在错误出现之前显示。                                                                                                                                                                                                                                                                                                                           | 当前源码与测试                                     |
| FR7 | radiogroup 将选项排成一列并使用较小的间距，或在水平方向时排成一行并使用较大的间距，并把 `size` 传给每个选项。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                     |
| FR8 | 基础 props（`ref`、`id`、`aria-*`、`data-*`、`hidden`、`inert`、`dir`、DOM 事件处理器）落到 radiogroup 上；调用方的 `onFocus` 在 FR4 的进入处理之后运行。`container*` 落到为其渲染出来的 Field 盒子上（在 `horizontal-labels` FormLayout 中不渲染该盒子，此时 `container*` 无效并发出警告），`control*` 落到 radiogroup 上；根级 `xstyle`、`className` 与 `style` 不被接受。                                                                                                                                                                                                                                                         | `family:input-fields` FR10；当前测试               |
| FR9 | radiogroup 带有 `astryx-radio-list`，并反映 `data-orientation` 与 `data-size`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `architecture:component-theming-surface`；当前测试 |

### Allowed variation

- **AV1 — 选项。** 条目内容在 `component:RadioListItem` 下变化。
- **AV2 — 主题绘制。** 主题可以通过 `radio-list` 重新设定该组样式。

### Representative states

| 状态         | 必需不变式                                                                                                       | 允许的变化 |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| 空值         | 正向 Tab 进入时落在第一个未被原生禁用的单选按钮上。                                                              | 方向。     |
| 已选中一项   | 被选中的单选按钮为勾选状态，且是 Tab 停靠点。                                                                    | 尺寸。     |
| 错误状态     | 带 `aria-invalid`；分离式消息描述该组。                                                                          | 消息。     |
| 带原因禁用   | 单选按钮可聚焦、拒绝被选中、不提交；显示原因提示框。实现缺口：调用方的 `onClick` 仍会运行（RadioListItem FR6）。 | —          |
| 禁用、无原因 | 与带原因时相同，但没有提示框。实现缺口：原生 `disabled`（FR5）。                                                 | —          |

### Transformation and precedence order

- **ORD1 — 条目可用性。** 组被禁用或条目被禁用；组原因只让因组禁用而禁用的单选按钮保持可聚焦。
- **ORD2 — 必填。** radiogroup 上是生效的必填状态；每个单选按钮上是显式必填。

### Performance and resources

- **PR1 — 进入处理。** FR4 仅在 `value` 为空的 focus 事件上运行，且不添加任何全局监听器。

## Accessibility contract

- **AR1 — 组语义。** 带 name、描述、无效与必填状态的 `role="radiogroup"`（FR1、FR6）。
- **AR2 — 键盘。** Tab 只到达该组一次（FR4）；方向键通过原生单选行为移动与选中。
- **AR3 — 禁用原因。** 组原因仍可通过键盘焦点与辅助技术访问（FR5）。

## Design relationships

| 结构或状态 | 设计要求                        | 表现形式权威 | 层级角色 | 组件契约 |
| ---------- | ------------------------------- | ------------ | -------- | -------- |
| 组标签     | 选项上方的 Field 组标签。       | 当前源码     | 主要     | FR1      |
| 选项       | 一列或一行的 RadioListItem 行。 | 当前源码     | 主要     | FR7      |
| 状态消息   | 组之后的分离式消息。            | 当前源码     | 辅助     | FR1, FR6 |

`design:user-states` 管辖其选项所绘制的按下覆盖层（`component:RadioListItem` FR8）；没有其他设计记录管辖 RadioList。radiogroup 带有 `radio-list`。

## Family and system relationships

- `spec:AST-085` 拥有禁用原因，`family:input-fields` FR10 与 DEC-7 拥有 prop 目标；RadioList 满足 FR10。
- `spec:AST-085` 拥有禁用状态下的可聚焦性；FR5 记录了这一缺口。
- `component:RadioListItem` 拥有每个选项，并通过 context 读取该组。

## Verification map

| 契约           | 验证                                                                                                                                                                                                                                                                                              | 代表性状态                                                            | 变更或失败预期                                                                                                                                                                                                                                                 | 审查章节                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1, AR1       | `RadioList.test.tsx` 的 label、span-label、hidden-label、必填与可选标记、状态以及组描述用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`                                                                                                                                     | 可见与隐藏标签；每种状态；描述                                        | 缺失组 name 或描述会失败。证据缺口：没有测试断言调用方描述排在最前、禁用原因排在最后，或标签提示框。                                                                                                                                                           | `audit:RadioList/accessibility` |
| FR2, FR3       | `RadioList.test.tsx` 的选中与表单用例                                                                                                                                                                                                                                                             | 单选按钮、标签与描述的点击；`htmlName`；无 name                       | 值错误、分组丢失、表单值错误，或在点击单选按钮时出现第二次 `onChange`，均会失败。证据缺口：没有测试统计经由标签与描述点击所触发的 `onChange` 调用次数。                                                                                                        | `audit:RadioList/behavior`      |
| FR4, AR2, PR1  | `RadioList.test.tsx` 的焦点管理用例；`RadioGroup.a11y.chromium.spec.ts` 中 `radio-group.focus.entry-and-exit` 规则对每个 `radio-list-group-*` 状态的检查                                                                                                                                          | 反向进入；组内移动；禁用的单选按钮                                    | 组内移动被重定向、进入落在被原生禁用的单选按钮上，或 Tab 进入偏离选中项或第一个选项，均会失败。证据缺口：没有测试进入一个带原因禁用的空组，也没有测试断言调用方 `onFocus` 在进入处理之后运行，或断言不存在全局监听器。                                         | `audit:RadioList/accessibility` |
| FR5, ORD1, AR3 | `RadioList.test.tsx` 的禁用（包括 radiogroup 的 `aria-disabled`）、disabledMessage 与表单用例；`ListGroupDisabled.a11y.chromium.spec.ts`；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts` 的 `radio-list-group-disabled-with-message` 和 `radio-list-option-group-disabled` 状态 | 组与条目禁用；带原因                                                  | 禁用状态下仍被选中，或从带原因禁用的组提交值，会失败；该绑定对 `radio-list-option-group-disabled` 期望 `tabReachable: false`，当该缺口被填补时它会失败。证据缺口：没有表单用例提交被条目禁用的选项或未带原因禁用的组，也没有测试在单选按钮获得焦点时禁用该组。 | `audit:RadioList/accessibility` |
| FR6, ORD2      | `RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts` 的 `radio-list-group-required-invalid-described` 状态                                                                                                                                                                            | 必填、无效、带描述的组                                                | 组上缺失必填或无效状态会失败。证据缺口：没有测试断言表单级必填默认值只到达 `aria-required`。                                                                                                                                                                   | `audit:RadioList/accessibility` |
| FR7, FR9       | `RadioList.test.tsx` 的主题目标用例                                                                                                                                                                                                                                                               | `size="sm"`                                                           | 缺失行尺寸会失败。证据缺口：方向用例只断言渲染；没有测试断言间距、水平布局、`data-orientation`、`data-size`，或 radiogroup 上的 `astryx-radio-list`。                                                                                                          | `audit:RadioList/layout`        |
| FR8            | `RadioList.fr10.test.tsx`；`RadioList.test.tsx` 的 data-testid 用例                                                                                                                                                                                                                               | 调用方 labelledby；hidden、inert、dir；`horizontal-labels` FormLayout | 基础 prop 落在 radiogroup 之外，或 `container*` 落在 Field 盒子之外，会失败。证据缺口：没有测试断言调用方 `onFocus` 在进入处理之后运行。                                                                                                                       | `audit:RadioList/api`           |

## Current-state impact

- **组原因（FR5）。** 组的 `disabledMessage` 只描述 radiogroup，因此获得焦点的禁用单选按钮不会由它描述，这违反了 `spec:AST-085` FR5 与 FR7。
- **禁用状态下的调用方 onClick（FR5）。** 因组原因而保持可聚焦的单选按钮，在点击或用方向键移到其上时仍会运行调用方的 `onClick`，这违反了 `spec:AST-085` FR2。
- **禁用可聚焦性（FR5）。** 未给出原因而禁用的组会给其单选按钮原生 `disabled`，因此它们脱离 Tab 顺序，这违反了 `spec:AST-085` FR1 与 FR7。
- **使用方文档。** `RadioList.doc.mjs` 的结构清单列出了 Header、Children 与 Label/Value 部件；RadioList 渲染的是组标签、选项与状态消息，并没有 header。

## Decision log

- **键盘模型（FR4）。** RadioList 保留浏览器的原生单选方向键行为及其已发布的 Tab 进入规则；`spec:AST-085` 将组合件的方向键访问哪些单选按钮交由该组合件决定。

除此之外，RadioList 遵循 `family:input-fields` FR10 与 WAI-ARIA 单选组模式。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表格/示例、当前审查结果、实现步骤或 family/系统规则。它链接到这些内容的所有者。
