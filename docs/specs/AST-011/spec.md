---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-011
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: [Selector, MultiSelector]
---

# Read-only selection inputs

## Intent

人们应当能够查看并提交一个由策略或权限阻止其更改的选中值。Selector 与 MultiSelector 应将该状态以只读而非禁用的形式暴露，并且不提供无法更改该值的菜单。

## Non-goals

- 在此次变更中为 input 家族的每个成员添加只读行为。
- 更改禁用、禁用原因、加载、校验或选项来源状态。
- 添加只读说明文本或 tooltip API。
- 更改选中值渲染、选项渲染或表单序列化。

## Requirements

- **FR1 — 只读保留该值。** 启用 `isReadOnly` 时，当前值必须保持以完全不透明度可见、可在常规 tab 顺序中获得焦点，并纳入表单提交。它不得调用 `onChange` 或 `changeAction`。
- **FR2 — 只读不暴露任何选择界面。** 在只读状态下，指针、键盘、typeahead、搜索以及 `isDefaultOpen` 不得打开或渲染 Popover 或 BottomSheet 选择界面。
- **FR3 — 不呈现编辑可供性。** 只读期间不得渲染清除操作与展开指示器。状态与忙碌呈现保持独立，因为它们描述的是被保留的值，而不是可用的编辑操作。
- **FR4 — 无障碍性与行为一致。** 可聚焦的只读值必须保留 `combobox` 语义，暴露 `aria-readonly="true"` 与 `aria-expanded="false"`，并保留其无障碍名称与渲染值。当不存在选择界面时，它不得暴露 `aria-controls` 或 `aria-activedescendant`。combobox 角色的隐式 listbox 弹出层描述控件的选择能力；`aria-readonly` 传达该值当前无法更改。当受支持的无障碍树未针对触发元素的宿主元素映射该 ARIA 属性时，还必须通过本地化的无障碍描述额外播报只读状态。启用搜索与未启用搜索的选择器使用相同的只读 combobox 语义，因为在该状态下两者都不暴露搜索或选择界面。
- **FR5 — 禁用优先。** 当 `isDisabled` 与 `isReadOnly` 同时为 true 时，禁用状态的焦点、交互、外观、无障碍与表单提交行为优先。
- **IR1 — 公共 API 遵循 input 约定。** Selector 与 MultiSelector 必须使用既有的可选布尔属性 `isReadOnly`，并在其根目标上暴露现有的 `readonly` 主题状态。
- **IR2 — 只读不是禁用外观。** 实现不得为只读状态复用禁用不透明度或禁用表单行为。它们可以移除会错误暗示可编辑性的 hover、pressed 与指针可供性。

### Platform support

- 受支持的特性/引擎下限：Astryx Core 支持的每一种浏览器与辅助技术组合。
- WCAG 基线：[WCAG 2.2 SC 4.1.2](https://www.w3.org/TR/WCAG22/#name-role-value) 要求控件的名称、角色、值与状态可被程序化确定。保留的 `combobox` 角色、渲染值以及 `aria-readonly="true"` 状态在不改变控件程序化身份的前提下满足该契约。
- ARIA 契约：[WAI-ARIA 1.2](https://www.w3.org/TR/wai-aria-1.2/#aria-readonly) 支持在 `combobox` 上使用 `aria-readonly`，并将只读定义为用户可读取但无法设置的值。combobox 具有隐式的 `aria-haspopup="listbox"`；即使只读交互从不打开该界面，该能力元数据仍然有效。
- 浏览器证据：DOM 检查必须暴露 `aria-readonly="true"`，且不得出现指向不存在的受控界面的情况。Chromium 无障碍检查必须暴露一个可聚焦、已折叠的 combobox，并具有正确的名称与渲染值；其隐式弹出层保持为 `listbox`，并且其无障碍描述必须播报本地化的只读状态，因为 Chromium 未在 button 宿主上映射 `aria-readonly`。指针与键盘探测必须确认没有选择界面打开，也没有值发生变化。

## Current-state impact

- TextInput、TextArea、NumberInput、CheckboxInput 与 CheckboxList 已将 `isReadOnly` 确立为 input 家族中表示可见、可聚焦、不可编辑值的名称。
- Selector 与 MultiSelector 目前仅暴露禁用状态。它们的触发元素可以打开选择界面，其清除操作可以更改值，并且只有在禁用时才会移除其表单载体。
- 选中值是否被策略或权限锁定由调用方掌握；组件无法从值、选项、加载状态或布局中推导出这一区别。因此该 prop 满足 `spec:AST-002` 的公共 prop 准入。
- 实现会在同一个 pull request 中同时更新两个组件的契约、使用方文档、针对性测试以及主题状态元数据。

## Verification

| 契约     | 验证                                  | 代表性状态                                          | 变更或失败预期                                                                  |
| -------- | ------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------- |
| FR1, FR5 | 焦点、回调与表单参与测试              | 只读；禁用；两者兼有；单值与多值                    | 只读值发生变化、离开 tab 顺序、提交失败、变暗，或覆盖禁用行为                   |
| FR2, FR3 | 指针/键盘/typeahead 与 DOM 可供性测试 | popover、bottom sheet、自适应、搜索、清除、默认打开 | 只读触发元素打开或渲染某个界面、清除某个值，或显示展开指示器                    |
| FR4      | DOM 与真实浏览器无障碍检查            | 搜索与非搜索触发元素；独立使用与 InputGroup         | 值更改角色、丢失其名称/值/只读状态、表现为已展开，或指向不存在的受控界面        |
| IR1, IR2 | 主题状态与渲染样式测试                | input 与 ghost 变体                                 | 根元素省略 `data-readonly`、获得禁用的不透明度，或保留交互式 hover/pressed 提示 |

## Decision log

### DEC-1 — Selection inputs use the established read-only contract

**参考：** `spec:AST-011/DEC-1`

**决策者：** `cixzhang`、`2026-08-31`

当调用方持有一个必须保持可见并参与提交、但无法更改的值时，Selector 与 MultiSelector 接受 `isReadOnly`。只读控件保持可聚焦，保留其 combobox 身份，将其渲染内容作为值暴露，并发布 `aria-readonly="true"`，同时不呈现选择与编辑可供性。

保留的角色既遵循 WCAG 2.2 SC 4.1.2 关于稳定的程序化名称、角色、值与状态的契约，也遵循 WAI-ARIA 1.2 对在 `combobox` 上使用 `aria-readonly` 的明确支持。[MUI Select](https://github.com/mui/material-ui/blob/bddf22f5c6d4c4383aae88dbd77b6c7a53c5fd17/packages/mui-material/src/Select/SelectInput.js#L841-L853) 与 [React Aria ComboBox](https://github.com/adobe/react-spectrum/blob/7c6100839de0f53bfa3c4e2f99529bdaa96bf205/packages/react-aria/src/combobox/useComboBox.ts#L143-L151) 采用相同的形态：只读 combobox 在阻止指针与键盘打开的同时，仍然可被识别为 combobox。隐式的 listbox 弹出层描述该控件的选择能力；它并不承诺每种状态都能打开它。

已否决：将该状态映射到 `isDisabled`，因为禁用值会被调暗并被排除在表单提交之外。

## Open questions

无。
