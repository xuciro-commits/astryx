---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-085
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-21
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:interaction-modality]
affects_families: [family:buttons, family:input-fields]
affects_contributing: []
affects_consumer_docs:
  [
    Button,
    ButtonGroup,
    IconButton,
    ClickableCard,
    Collapsible,
    CheckboxInput,
    CheckboxList,
    DateInput,
    DateRangeInput,
    DateTimeInput,
    FileInput,
    MultiSelector,
    NumberInput,
    PowerSearch,
    RadioList,
    RichTextEditor,
    SegmentedControl,
    Selector,
    Slider,
    Switch,
    TextArea,
    TextInput,
    TimeInput,
    Tokenizer,
    Typeahead,
    BaseTypeahead,
    CommentPin,
    useInteractiveRole,
    useIndicatorFocusRing,
    useMenuPress,
  ]
---

# Focusable disabled controls system spec

## Intent

键盘和屏幕阅读器用户始终能到达处于禁用状态的控件。他们能找到它、听出它已禁用，并在存在原因时读到原因。当用户所在的控件变为禁用时，他们绝不会失去所在位置。

构建者继续使用 `isDisabled`。Astryx 组件把它变成一个可聚焦、不可操作的控件。任何组件都不渲染原生 `disabled` 属性。

## Non-goals

- 方向键在复合控件（listbox、menu、grid、tablist、roving group）内部访问哪些条目。这由复合控件自身的记录决定。
- 只读。`spec:AST-011` 让只读与禁用保持区分。
- 禁用态的绘制、token 与主题状态。它们保留现有的所有者。
- 调用方在 Astryx 插槽内渲染的元素。这些元素的属性由调用方负责。
- 等效的内部实现在满足本契约时仍然有效。

## Requirements

- **FR1 — 禁用的控件保持可聚焦。** 组件不得对它渲染的任何元素施加原生 `disabled` 属性。禁用的控件暴露 `aria-disabled="true"`，并保持启用时的焦点顺序：Tab 停靠点仍是 Tab 停靠点，`tabIndex={-1}` 的元素仍不在 Tab 顺序中。
- **FR2 — 禁用会阻止一切变更。** 禁用的控件不得改变其值、激活、导航、打开浮层，或调用回调或 Action。这涵盖指针、触摸、Enter、空格、输入、粘贴、拖放、拖拽、滚轮、递增与选择路径。
- **FR3 — 禁用的值不会被提交。** 禁用的字段不向表单提交贡献任何值，也不通过约束校验阻止提交。这与原生 `disabled` 表单行为一致。
- **FR4 — 变为禁用时保留焦点。** 在持有焦点时变为禁用的控件保留焦点。组件也可以在该变更之前，把焦点移到其自身记录在同一组件内指定的目标。当组件移除一个持有焦点的控件时，该组件的记录应指明目标。
- **FR5 — 禁用状态会被播报。** 禁用状态在可聚焦元素自身上暴露给辅助技术，连同其无障碍名称以及任何描述或禁用原因。当持有焦点的控件变为禁用时，该变更在该元素上暴露；是否朗读遵循 `spec:AST-009`。
- **FR6 — 禁用态在视觉上保持无响应。** 禁用绘制施加于禁用状态。忙碌但未禁用的控件保留其待定处理（`family:buttons` FR4），即使它也暴露 `aria-disabled`。悬停、按下与拖拽的提示不得出现。在键盘模态下焦点指示器仍然出现（`architecture:interaction-modality` INV1、INV5）。
- **FR7 — 分组禁用遵循同一规则。** 由分组或表单级默认值禁用的成员遵循 FR1–FR6。

### Platform support

- 支持的特性/引擎下限：该包所支持的浏览器。
- 不支持的行为：无。该规则使用标准 ARIA 与事件处理。
- 浏览器证据：键盘焦点顺序与被阻止的激活需要真实浏览器检查；FR5 需要无障碍树证据。仅当某项声明依赖朗读输出时，朗读输出才遵循 `spec:AST-009`。

## Current-state impact

- `family:buttons` FR3 从“可以使用可聚焦的 `aria-disabled`”变为“遵循 `spec:AST-085`”。Button 已在忙碌与 tooltip 情形下这样做。
- `family:input-fields` FR4 对每个成员都得到满足。“足够可聚焦”变为“可聚焦”。
- `component:DateRangeInput` AR3 及其禁用预设状态，以及 `component:Tokenizer` 的禁用状态与验证，遵循本记录而非原生 `disabled`。它们断言原生禁用的测试尚待符合性整改。
- `component:Slider` AR1：没有消息的禁用滑块手柄获得一个 Tab 停靠点；其禁用滑块手柄测试尚待符合性整改。
- `component:Selector`：带原因的禁用触发器保留其 Tab 停靠点，就像现在每个禁用触发器一样。
- 把禁用控件描述为原生禁用、不可聚焦、不在 Tab 顺序中、会丢弃焦点或会吞掉外部 Tooltip 所需事件的使用方文档，会随符合性整改而变更。本记录的 `affects_consumer_docs` 列表逐一列出了它们。
- `BaseTypeahead` 的公共 `isFocusableDisabled` 不再有任何作用：每个禁用输入都可聚焦（FR1），禁用时 Enter 无法选择（FR2）。在 `spec:AST-002` 下的公共 API 变更移除它之前，它保持被接受状态。
- `useIndicatorFocusRing`：其 `isDisabled` 输入会抑制键盘焦点环。在 FR6 下，持有焦点的禁用控件仍然显示它。
- 断言原生禁用的 `family:buttons` 与 `component:Tokenizer` 测试尚待符合性整改。
- ClickableCard、BaseTypeahead、CheckboxInput、ChatComposer 与 CommentPin 的草稿记录把原生 `disabled` 描述为观察到的行为；它们会随符合性整改而变更。
- `spec:AST-011` DEC-1 中被否决的那一行不再表示禁用值会离开 Tab 顺序。
- `spec:AST-011` FR5 仍然成立：禁用的焦点、提交与绘制仍然优先于只读。
- 目前渲染原生 `disabled` 的组件将切换到 FR1 形态。文本字段使用只读加变更防护，正如 TextInput 在带禁用原因时所做的那样。带有表单值的字段将其从提交中移除（FR3）。
- Pagination、Calendar、Lightbox 与触摸日期选择器不再在边界处把焦点丢到页面主体（FR4）。
- 使用 `:disabled` 选择禁用控件、用 `toBeDisabled()` 查询它们，或依赖 Tab 跳过禁用控件的使用方会看到变化。发布说明中会指明这一点。

## Verification

| 契约 | 验证                                 | 代表性状态                                                                  | 变更或失败预期                                          |
| ---- | ------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------- |
| FR1  | 覆盖每个组件禁用 story 的共享测试    | Button、文本字段、checkbox、switch、selector、slider、分组禁用              | 任何渲染出的 `disabled` 属性，或改变的 Tab 顺序，都失败 |
| FR2  | 每个组件的键盘、指针、粘贴与拖放测试 | 该组件支持的每条变更路径                                                    | 值变更、激活、导航或回调都失败                          |
| FR3  | 读取 `FormData` 的表单提交测试       | 禁用文本、checkbox、selector、必填且禁用的字段                              | 提交了禁用的值，或提交被阻止，都失败                    |
| FR4  | 真实浏览器中的焦点转移检查           | 最后一个 Pagination 页、Calendar 最大月份、最后一个 Lightbox 条目、分组关闭 | 焦点落在文档主体上则失败                                |
| FR5  | 无障碍树检查                         | 带与不带禁用原因的持有焦点的禁用控件                                        | 缺少禁用状态、名称或原因则失败                          |
| FR6  | 真实浏览器计算样式检查               | 静止、悬停、按下、键盘焦点下的禁用态                                        | 出现悬停或按下绘制，或缺少焦点指示器，则失败            |

## Decision log

### DEC-1 — Disabled controls are focusable; native `disabled` is not used

**参考：** `spec:AST-085/DEC-1`

**决策者：** cixzhang，2026-10-21

原生 `disabled` 会把控件从焦点中移除。键盘用户于是找不到它，读不到它为何不可用，并在所在控件变为禁用时失去位置。为每个禁用控件提供一种可聚焦形态即可消除这三类失败，而组件仍保持相同的 `isDisabled` API。

已否决：在控件变为禁用时把焦点移到一个由组件自行选择的回退位置——每个组件都需要自己的目标，而且焦点仍会跳动。

## Open questions

无。
