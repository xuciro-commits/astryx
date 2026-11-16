---
schema_version: 3
template_version: 7
kind: component
id: component:Typeahead
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Typeahead/Typeahead.test.tsx,
    packages/core/src/Typeahead/Typeahead.fr10.test.tsx,
    packages/core/src/Typeahead/TypeaheadItem.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:input-fields, family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-085]
---

# Typeahead component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 新增 `menu` 与 `handleRef`，并转发给 BaseTypeahead（FR11）。Typeahead 接受 BaseTypeahead 的搜索 props，加上字段 props（`label`、`description`、`status`、`isRequired`、`size`）、`hasClear`、`isDisabled` 与 `disabledMessage`、起始内容，以及 `container*` 与 `control*` 样式。 |
| 行为          | 由 Field 包裹的 BaseTypeahead，其选中值以 Token 呈现；点击 Token 即可编辑它；清除会将其设为 `null`；禁用字段保持可聚焦，无论是否带原因。                                                                                                                                         |
| 最终用户影响  | 用户搜索并选择一个值，将其作为 token 看到，并可编辑或清除它。                                                                                                                                                                                                                    |
| 构建者影响    | 构建者通过 `container*` 与 `control*` 为字段设置样式，并为主题化四个 Typeahead 目标。                                                                                                                                                                                            |
| 兼容性/就绪度 | 增量式：不传 `menu` 与 `handleRef` 时，默认值或 DOM 均无变化。禁用状态下的调用方处理函数列于“当前状态影响”。                                                                                                                                                                     |
| 审查检查      | 拒绝以下情况：目标丢失、Token 位于输入框旁边而非覆盖其上、Token 之后输入框仍留在 Tab 顺序中、调用方按键处理函数取消导航，或原因未从输入框链接。                                                                                                                                  |
| 管辖规则      | `family:input-fields`；`spec:AST-085` FR1、FR2；`component:BaseTypeahead`；`architecture:component-theming-surface`。                                                                                                                                                            |

此表是审查用的投影；以下正文具有权威性。

## Intent

Typeahead 渲染一个单选搜索控件，可带可选的独立 Field 外壳，并将其 combobox 引擎与弹窗结果委托给 BaseTypeahead。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：增量式。它新增可选的 `menu` 与 `handleRef` props（FR11）；不传它们时，默认值或 DOM 均无变化
- 受控/非受控行为：`value` 为受控
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 绘制出的 Input 表面及其 `typeahead` 目标。
- 由 BaseTypeahead 渲染的 Dropdown 与 Empty state，及其 `typeahead-dropdown` 与 `typeahead-empty-state` 目标。
- 由 TypeaheadItem 渲染的默认条目内容及其 `typeahead-item` 目标。
- 稳定的外层 Result 行、Result 分组标题与 Selected result 状态，它们当前没有 Typeahead 目标。

**不拥有 / 非目标**

- 独立字段外壳呈现——由 Field 渲染，并通过 Field 当前的 `field` 目标主题化；当 Typeahead 位于 InputGroup 内时省略。
- Selected token——由 Token 渲染，并通过 Token 当前的 `token` 目标主题化。
- Clear button——由 Field 的 InputClearButton 渲染，并通过 Field 当前的 `input-clear-button` 目标主题化。
- 加载指示器呈现——归 `component:Spinner` 所有。Typeahead 只决定该指示器的位置。
- 针对由 Icon 渲染的起始图标的一般 Icon 呈现。
- 调用方提供的任意 ReactNode 起始内容或条目内容。
- 外层 Result 行、Result 分组标题或选中行概念的目标/状态；当前不存在（OQ1）。
- 共享的层生命周期、定位与关闭行为。

## Public concepts

除 `Typeahead.doc.mjs` 中记录的 props 之外，没有组件本地概念；BaseTypeahead 与 TypeaheadItem 保留各自的记录。`menu`、`handleRef`（`open()` 与 `close()`）以及 `onOpenChange` 属于 BaseTypeahead（`component:BaseTypeahead` FR13–FR16），原样转发。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 依据                                 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| FR1  | 当前独立呈现包含一个 Field 与绘制出的 Input 表面；受支持的 InputGroup 路径渲染相同的 Input 表面，但不含 Field。该表面在未选中或编辑时包含一个可编辑输入框，在已选中且未编辑时包含一个 Selected token 与折叠的输入框。                                                                                                                                                                                                                                                                                                                                       | 当前源码、文档与测试                 |
| FR2  | Input 表面、Dropdown、Empty state 与默认条目内容承载 `Typeahead.doc.mjs` 中记录的四个 Typeahead 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码、文档与测试                 |
| FR3  | 每个结果，无论是默认渲染还是调用方渲染，都位于同一个稳定的外层 Result 行内，该行拥有选项语义、高亮、选中样式、指针交互与键盘索引。                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试                       |
| FR4  | `typeahead-item` 仅到达 Result 行内标准的 TypeaheadItem 标签/支撑内容分支。自定义 `renderItem` 分支或调用方提供的 `item.element` 不会获得该目标，且没有任何分支给外层 Result 行赋予 Typeahead 目标。                                                                                                                                                                                                                                                                                                                                                        | 当前源码与所有者测试                 |
| FR5  | Result 分组标题与 Selected result 状态是稳定的可见概念，但没有 Typeahead 目标能到达它们（OQ1）。选中的勾选标记使用通用 Icon，它不暴露 Typeahead 特定的选中行选择器。                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码                             |
| FR6  | 存在时，Field、Selected token、Clear button、Spinner 与由 Icon 渲染的起始图标保留其 Field、Token、Spinner 与 Icon 主题化所有者；任意的 ReactNode 起始内容与条目内容仍归调用方所有。                                                                                                                                                                                                                                                                                                                                                                         | 当前组合与所有者                     |
| FR7  | 禁用的 Typeahead 通过 `aria-disabled` 与 `readOnly` 保留输入框的 Tab 停靠点（`spec:AST-085` FR1），不打开、不选择任何内容，并在变为禁用时丢弃进行中的搜索工作；带 `disabledMessage` 时，它通过 `aria-describedby` 链接原因 Tooltip。禁用状态下，除 focus 与 blur 之外的调用方处理函数不得运行（FR2）。实现缺口：禁用的输入框仍会运行调用方的 click、pointer 与 key 处理函数（`component:BaseTypeahead` FR9）。                                                                                                                                              | `spec:AST-085` FR1、FR2；当前测试    |
| FR8  | 在有选中值且不处于编辑状态时，Token 绘制在折叠的输入框之上，该输入框因此离开 Tab 顺序，而由字段标签与该值命名的 Token 按钮成为 Tab 停靠点；点击 Token 进入编辑模式，该模式搜索该值的标签并将输入框恢复到 Tab 顺序；没有操作的 blur 会恢复 Token；组合状态下的 Escape 不会离开编辑模式；在编辑模式下且列表隐藏时，非组合状态的 Escape 会离开编辑模式：它恢复 Token 并将焦点移到 Token 的按钮，因此焦点绝不会落到页面主体；列表显示时，Escape 先隐藏列表（`spec:AST-075` FR4）。启用 `hasClear` 时，清除按钮调用 `onChange(null)`，编辑期间清除会清空输入框。 | 当前测试                             |
| FR9  | 该字段没有根样式 props：`control*` 到达输入框表面，`container*` 到达 Field 盒（`family:input-fields` FR10）；DOM props 与 ref 在两条路径中都到达 combobox 输入框；调用方 `onKeyDown` 在内置按键处理之后运行，每个按键一次，清除按钮上的按键也会运行；调用方 `aria-labelledby` 跟随字段自身的名称。该表面保持单行，末端控件以内联末端处于流中，其高度以共享元素尺寸为最小值。                                                                                                                                                                                | `family:input-fields` FR10；当前测试 |
| FR10 | 结果列表遵循 `component:BaseTypeahead` FR12：在字段的输入框或其按钮上按下，或在列表中按下，保持其打开；在其他任何位置按下则关闭它。                                                                                                                                                                                                                                                                                                                                                                                                                         | `component:BaseTypeahead` FR12       |
| FR11 | `menu` 与 `handleRef` 原样到达 BaseTypeahead，因此菜单的 listbox 与 dialog 角色、其打开句柄及其焦点返回遵循 `component:BaseTypeahead` FR13–FR16，`onOpenChange` 报告相同的打开与关闭。                                                                                                                                                                                                                                                                                                                                                                      | `component:BaseTypeahead` FR13–FR16  |
| FR12 | 在聚焦的 Token 按钮上按 Backspace 或 Delete 会作用于选中值。启用 `hasClear` 时，它像清除按钮一样清除该值：`onChange(null)`、通过共享 live region 发出点名被清除值的礼貌公告，以及焦点落在空输入框上，正如 Tokenizer token 的移除所做的那样。未启用 `hasClear` 时，它进入编辑模式，正如点击 Token 一样。禁用字段忽略这两个按键。                                                                                                                                                                                                                             | 当前测试                             |

### Allowed variation

- 独立 Typeahead 渲染 Field；受支持的 InputGroup 路径省略它。
- Input 表面在为空或编辑中时显示可编辑输入框，在有选中值且未被编辑时显示 Token。这一已发布的非对称性被记录，而未被归一化为新的共享部件或目标。
- Result 行可包含标准 TypeaheadItem 内容、自定义 `renderItem` 内容，或调用方提供的 `item.element`。只有标准 TypeaheadItem 的标签/支撑内容分支携带 `typeahead-item`。
- 结果可不分组或分组。分组包装器与标题不会因该差异而获得目标。
- 语义名称与图标组件类型通过 Icon 渲染。任意 ReactNode 起始内容直接渲染，仍归调用方所有。

### Representative states

| 状态                   | 必需的不变式                                                         | 允许的差异                                     |
| ---------------------- | -------------------------------------------------------------------- | ---------------------------------------------- |
| 独立或 InputGroup      | Field 仅在独立时存在；Input 表面解剖与目标在两条路径中保持相同。     | InputGroup 拥有分组布局与标签支持。            |
| 为空或编辑中           | 可编辑输入框保持在 `typeahead` Input 表面内。                        | 查询、加载状态与弹窗可见性可不同。             |
| 已选中且不在编辑       | Token 拥有选中值呈现，同时输入框折叠。                               | 根据 `hasClear` 与禁用状态，清除按钮可能存在。 |
| 使用默认渲染器的结果   | 外层 Result 行保持无目标；内部 TypeaheadItem 携带 `typeahead-item`。 | 条目标签、图标/头像与描述可不同。              |
| 使用自定义渲染器的结果 | 外层 Result 行保持无目标；自定义内容不获得 `typeahead-item`。        | 调用方拥有内部结果内容。                       |
| 分组与选中结果         | 分组标题与选中行概念对 Typeahead 保持无目标。                        | 通用 Icon 绘制选中的勾选标记。                 |
| 为空且已完成搜索       | Empty state 在 Dropdown 内携带 `typeahead-empty-state`。             | 使用方提供的空文本可不同。                     |

### Transformation and precedence order

- **ORD1 — 显示。** 编辑中或无值 → 可编辑输入框；有值且未编辑 → 覆盖在折叠输入框之上的 Token。

### Performance and resources

- **PR1 — 委托资源。** 搜索定时器与过期响应拒绝属于 BaseTypeahead（`component:BaseTypeahead` PR1）；Typeahead 不添加自己的监听器。

## Accessibility contract

Combobox、listbox、option、live region 与关闭语义属于 `component:BaseTypeahead`。

- **AR1 — 一个字段。** 输入框由 Field 标签命名（其后可跟调用方 `aria-labelledby`），并由描述与状态加以描述；combobox 将已解析的必填状态暴露为 `aria-required`，将错误状态暴露为 `aria-invalid`，当字段自身状态关闭时保留调用方自己的值。
- **AR3 — Token 按钮名称。** 当值显示时，Token 的按钮（即 Tab 停靠点）由字段标签（或调用方 `aria-labelledby`）与该值命名。
- **AR2 — Token 之后的隐藏输入框。** 当 Token 显示时，折叠的输入框离开 Tab 顺序，因此 Tab 会到达 Token 的控件并继续前进（FR8）。

## Design relationships

| 解剖或状态             | 设计要求                                                            | 表示权威           | 层级角色     | 组件契约      |
| ---------------------- | ------------------------------------------------------------------- | ------------------ | ------------ | ------------- |
| Field                  | 在 InputGroup 之外提供标签与可选支撑内容；在 InputGroup 内省略。    | Field 组件         | 支撑         | FR1, FR6      |
| Input 表面             | 围绕可编辑输入框或选中 token 绘制控件。                             | 当前源码与公开文档 | 突出         | FR1, FR2      |
| 由 Icon 渲染的起始图标 | 通过 Icon 呈现语义图标或组件图标。                                  | Icon 组件          | 支撑         | FR6           |
| 调用方渲染的起始内容   | 在输入框表面的起始槽中直接呈现任意调用方内容。                      | 调用方提供的内容   | 视上下文而定 | FR6           |
| Selected token         | 在编辑模式之外通过 Token 呈现选中值。                               | Token 组件         | 突出         | FR1, FR6      |
| Spinner                | 在输入框表面末端指示搜索进行中。                                    | Spinner 组件       | 支撑         | FR6           |
| Clear button           | 通过共享字段清除动作移除选中值。                                    | Field 组件         | 支撑         | FR6           |
| Dropdown               | 绘制包含结果或 Empty state 的锚定 listbox 表面。                    | 当前源码与公开文档 | 突出         | FR2           |
| Empty state            | 在搜索完成且为空之后呈现无结果消息。                                | 当前源码与公开文档 | 突出         | FR2           |
| Result 行              | 为每个结果拥有选项语义、交互、高亮、选中样式与键盘索引。            | 当前源码与测试     | 突出         | FR3, FR4      |
| 默认条目内容           | 在 Result 行内呈现标准 TypeaheadItem 标签与可选支撑内容。           | TypeaheadItem 组件 | 突出         | FR2, FR4      |
| 调用方渲染的条目内容   | 在稳定 Result 行内呈现自定义 `renderItem` 或 `item.element` 内容。  | 调用方提供的内容   | 视上下文而定 | FR3, FR4, FR6 |
| Result 分组标题        | 为可见的 Result 行分组加标签。                                      | 当前源码           | 支撑         | FR5           |
| Selected result 状态   | 呈现选中行字重与末尾勾选标记，但没有 Typeahead 特定目标或目标状态。 | 当前源码           | 支撑         | FR5           |

当前目标放置是非对称的：`typeahead-item` 位于默认的内部 TypeaheadItem 内容上，而稳定的外层 Result 行同时为默认内容与自定义内容拥有交互与状态。分组标题与选中结果概念同样无目标。本记录保留这些事实，不移动、新增或归一化目标。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Field": {"delegatesTo": {"owner": "component:Field", "target": "field"}},
  "Input surface": {"target": "typeahead"},
  "Icon-rendered start icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Caller-rendered start content": {
    "none": {
      "reason": "intentional: Arbitrary ReactNode content is caller-owned and receives no Typeahead target."
    }
  },
  "Selected token": {
    "delegatesTo": {"owner": "component:Token", "target": "token"}
  },
  "Spinner": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "Clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Dropdown": {"target": "typeahead-dropdown"},
  "Empty state": {"target": "typeahead-empty-state"},
  "Result row": {
    "none": {
      "reason": "reachability-gap: The stable outer option row owns interaction and state but has no current Typeahead target."
    }
  },
  "Default item content": {"target": "typeahead-item"},
  "Caller-rendered item content": {
    "none": {
      "reason": "intentional: Custom renderItem and item.element content is caller-owned and does not receive the standard TypeaheadItem target."
    }
  },
  "Result group heading": {
    "none": {
      "reason": "reachability-gap: No current public target reaches the visible result-group heading."
    }
  },
  "Selected result state": {
    "none": {
      "reason": "reachability-gap: No current Typeahead target or target state reaches the outer selected row and its selection concept."
    }
  }
}
```

## Family and system relationships

- `spec:AST-092` 的增量搜索结果通过 BaseTypeahead 到达 Typeahead；Typeahead 不为其新增 props。
- `architecture:component-theming-surface` 拥有解剖资格判定、本地目标映射、委托，以及事实性的 `none` 处置。
- `architecture:layer-runtime` 拥有 Dropdown 所使用的当前 Popover 宿主、定位、外部按压关闭与可见性协调。
- `family:overlay-dismissal` 拥有共享的 Escape 与平台关闭排序；Typeahead 通过其组合的 Popover 所有者参与。
- Field、Token 与 Icon 保留对其被委托目标与呈现的所有权。

## Verification map

| 契约                | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 代表性状态                           | 变更或失败预期                                                                                                                                                                                          | 审查章节                        |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1, FR6            | `Typeahead.test.tsx` 的 Typeahead 渲染用例（“renders with label”、“renders description text”、“shows required indicator”、“renders error status message”、“shows selected value as a token”、“shows clear button when hasClear and value is selected”）以及 value-lane 用例                                                                                                                                                                                                                                                                                            | 独立；已选中；清除；状态             | 缺少 Field 部件、Token 或清除按钮即失败。证据缺口：没有测试断言 InputGroup 路径省略 Field，或 Spinner 与 Icon 的委托。                                                                                  | `audit:Typeahead/anatomy`       |
| FR2                 | `Typeahead.test.tsx` 的“exposes the empty state as a themeable target”；`TypeaheadItem.test.tsx`；`themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                             | 空搜索；默认条目                     | 缺少 empty-state 目标即失败；渲染出的 class 不在已记录目标中即失败。证据缺口：没有测试断言 `typeahead`、`typeahead-dropdown` 或 `typeahead-item` 的放置。                                               | `audit:Typeahead/theming`       |
| FR3, FR4, FR5       | `TypeaheadItem.test.tsx` 的“renders item.element raw in place of the label layout”                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 默认内容与调用方内容                 | 保留默认布局的 `item.element` 即失败。证据缺口：没有测试断言无目标的外层行、分组标题或选中状态。                                                                                                        | `audit:Typeahead/theming`       |
| FR7                 | `Typeahead.test.tsx` 的 disabledMessage 用例，包括“keeps its tab stop when disabled without a reason”与“drops a search answer that arrives after the field became disabled”；`Typeahead.disabled.a11y.chromium.spec.ts` 的“Tab reaches the disabled field, which rings and stays read-only”                                                                                                                                                                                                                                                                            | 带原因与不带原因的禁用               | 原因未从输入框链接、禁用输入框没有 Tab 停靠点、禁用时键入或选择，或在禁用后落地的搜索答案，均会失败。证据缺口：没有测试断言禁用时会跳过调用方处理函数。                                                 | `audit:Typeahead/accessibility` |
| FR8, ORD1, AR2, AR3 | `Typeahead.test.tsx` 的编辑模式与折叠输入框 Tab 顺序用例；“hides the list on the first Escape, then restores the Token and focuses its button”；“does not exit edit mode on a composing Escape (IME)”；“calls onChange with null when clear button is clicked”；“does not show clear button when hasClear is false”；“names the token button, the Tab stop while a value shows, by the field label and the value”、“names the token button with a caller aria-labelledby as the input is named”                                                                        | Token、编辑、blur、清除；Tab 顺序    | 不进入编辑模式的 Token、Token 之后仍留在 Tab 顺序中的输入框、离开编辑模式的组合中 Escape、未发送 `null` 的清除，或未由标签与值命名的 token 按钮，均会失败。                                             | `audit:Typeahead/behavior`      |
| FR9, AR1            | `Typeahead.fr10.test.tsx` 的 props 类型用例；`Typeahead.test.tsx` 的“forwards DOM props and ref to the combobox input while preserving edit and blur behavior”、“forwards DOM props and ref to the input inside InputGroup, with control* on the surface”、消费方按键处理函数用例、调用方 aria-labelledby 用例与末端控件用例；“exposes the resolved required state on the combobox (FormLayout FR5, AR2)”、“marks the combobox invalid for an error status only (WCAG 4.1.2)”、“keeps a caller's own aria-invalid and aria-required when the field's own state is off” | 独立与分组；按键处理函数；调用方名称 | 根样式 prop、丢失的 DOM prop 或 ref、先运行或运行两次的调用方按键处理函数、丢失的调用方名称、缺失的 `aria-required` 或错误 `aria-invalid`，或末端控件脱离流，均会失败。证据缺口：没有测试断言最小高度。 | `audit:Typeahead/layout`        |
| FR10                | `component:BaseTypeahead` FR12 的验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | —                                    | —                                                                                                                                                                                                       | —                               |
| FR11                | `BaseTypeahead.menu.test.tsx` 的“Typeahead forwards the menu and the handle”；`component:BaseTypeahead` FR13–FR16 的验证                                                                                                                                                                                                                                                                                                                                                                                                                                               | 从句柄打开的 dialog 角色菜单         | 未到达 BaseTypeahead 的菜单或句柄即失败。                                                                                                                                                               | —                               |
| FR12                | `Typeahead.test.tsx` 的“Backspace and Delete on the token”用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 带与不带 `hasClear`；禁用            | 在 `hasClear` 下不清除的按键、没有公告或未聚焦空输入框的清除，或未启用 `hasClear` 的清除，均会失败。                                                                                                    | `audit:Typeahead/behavior`      |
| PR1                 | 由 `component:BaseTypeahead` 的各行覆盖；没有测试断言 Typeahead 监听器不存在（证据缺口）                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                    | —                                                                                                                                                                                                       | `audit:Typeahead/behavior`      |
| 主题化解剖映射      | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 规范解剖与目标                       | 缺失、多余、带前缀、过期或未分类的映射会使仓库校验失败。                                                                                                                                                | `audit:Typeahead/theming`       |

## Current-state impact

- **Caller handlers while disabled (FR7).** 禁用的 Typeahead 仍会运行调用方的 click、pointer 与 key 处理函数，这违反 `spec:AST-085` FR2。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 稳定的 Result 行、Result 分组标题或 Selected result 状态是否应获得公开的 Typeahead 目标？**（`human-api`）它们当前缺乏可达性并非已定意图，且外层行/默认内容的非对称性是被记录的，而非归一化的。

## Content boundary

本文件不重复使用方 prop 表、示例、搜索算法、实现步骤或共享的层与主题化规则。它链接到其所有者。
