---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-075
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-15
phase: accepted
owners: [vjeux]
affects_architecture:
  [architecture:interaction-modality, architecture:public-component-api]
affects_families: [family:input-fields, family:overlay-dismissal]
affects_contributing: []
affects_consumer_docs:
  [BaseTypeahead, Typeahead, ChatComposerInput, useCombobox, useMultiCombobox]
---

# Combobox over a caller-rendered field system spec

## Intent

一个人从经过筛选的列表中选择，同时焦点留在产品自己渲染的文本字段里：聊天输入框的 textarea、表情网格上方的搜索字段、结果替换页面某一区域的设置搜索，以及匹配项在对话框中就地列出的 “add people” 字段。Astryx 为该字段提供 combobox 语义和键盘模型，与它为自身 typeahead input 提供的一样。产品提供字段、行以及列表渲染的位置，并从 hooks 组合出行为；每个这样的字段都以相同方式运作并播报。

## Non-goals

- 字段的外壳与外观、行的外观，以及列表渲染的位置（一个层，还是页面的文档流），都留给调用方。
- 搜索、筛选、防抖与异步数据源，都留给调用方。
- 在字段文本中查找查询内容（例如输入框中触发字符之后的文本），都留给调用方。
- 焦点落在按钮上的 combobox（`Selector`、`MultiSelector`），或存在于模态命令界面中的 combobox（`CommandPalette`），各自保留自己的记录；本规格不为所有 combobox 设定单一交互模型。
- 满足本契约的等价内部实现仍然有效。

## Requirements

- **FR1 — 焦点留在字段中。** 移动活动选项不得把 DOM 焦点移出字段。字段必须通过 `aria-activedescendant` 命名活动选项，该属性引用一个已渲染的选项；在没有活动选项时，字段不得携带 `aria-activedescendant`。
- **FR2 — 展开状态跟随列表。** 列表显示期间，字段必须暴露 `aria-expanded="true"` 以及命名该 listbox 的 `aria-controls`。列表未显示期间，字段必须暴露 `aria-expanded="false"`，并且不得引用未渲染的元素。`textarea` 字段（FR3）以相同方式暴露 `aria-controls`，且不携带 `aria-expanded`。
- **FR3 — 角色。** 字段必须暴露无障碍名称。`input` 或 contenteditable 字段必须暴露 `role="combobox"`。`textarea` 不接受显式角色，保留其隐式的 `textbox` 角色，并且必须暴露 `aria-autocomplete="list"`。列表必须是一个具名的 `listbox`，它的每一行都是 `option`，活动项上带 `aria-selected="true"`。listbox 可以渲染在文档中的任意位置，包括页面的文档流。不是选项的控件必须渲染在 listbox 之外。
- **FR4 — 按键。** 列表显示期间，ArrowDown 与 ArrowUp 必须移动活动选项；在活动选项上按 Enter 必须选中它，并且只有在此之后才阻止字段自身的 Enter；Escape 必须隐藏列表，且不在同一次按键中关闭外层（`family:overlay-dismissal`）。列表隐藏期间，在单行 `input` 字段中，ArrowDown 必须在列表有选项时显示列表，正如 `component:BaseTypeahead` 为其自身 input 所做的那样；在多行字段（`textarea` 或 contenteditable 元素）中，每个按键都必须原样到达字段及其周边，使方向键继续在行之间移动插入符。列表显示期间，Home 与 End 在 OQ2 被裁定之前不在本要求范围内，其他每个按键都必须原样到达字段。
- **FR5 — 输入法。** 输入法组合进行中时，按键不得激活任何 combobox 命令，包括 Escape 的关闭（`family:overlay-dismissal`）。
- **FR6 — 指针。** 将指针移到某个选项上必须使其成为活动选项，而不移动 DOM 焦点。按下某个选项必须选中它，并且字段必须在按下过程中保持焦点。
- **FR7 — 结果数量。** 当选项因新查询而变化时，选项的数量，或没有选项这一事实，必须通过共享播报器礼貌地播报，而不是通过每个字段各自的 live region；播报经由字段自身的 `useAnnounce({hasReplace: true})` 实例（`spec:AST-086` FR9）完成，使较新的数量替换尚未播出的数量。
- **FR8 — 这些 hook 可以作为 hook 被发现。** 实现本契约的每个公共 hook 都必须由 `astryx hook <name>` 和 `astryx search` 返回，并带上其参数、其返回字段，以及它所满足的上述要求，使产品无需先找到使用它的组件就能找到它。

### Platform support

- 支持的 feature/engine 下限：仓库支持的引擎；不新增任何 CSS 或 DOM 特性。
- 不支持的行为：无；屏幕阅读器在 contenteditable combobox 上对 `aria-activedescendant` 的播报并不一致，而 FR1 在那里仍然成立。
- 浏览器证据：FR1–FR3 使用 Chromium 无障碍树回执，FR4–FR6 使用真实键盘与指针输入，屏幕阅读器方面的说法以 `spec:AST-009` 为界。

## Current-state impact

- `component:BaseTypeahead` 对其渲染的 input 满足 AR1–AR5；本契约把同样的义务带给调用方渲染的字段。
- `component:ChatComposerInput` 仅通过一个内部 hook，在其自身的 contenteditable 字段内为其触发菜单暴露 combobox 语义。
- `useCombobox`（从 `@astryxdesign/core/Selector` 导出）跟踪活动选项、打开与关闭，并为 Selector 和 CommandPalette 处理按键。对于调用方渲染的单行 `input`，在任意带字符串 `value` 的选项类型之上，其 `getFieldProps`、`getListboxProps` 与 `getOptionProps` 承载 FR1–FR6。它尚未接受多行字段（DEC-3），结果数量由调用方通过其自身的 `useAnnounce({hasReplace: true})` 实例播报（FR7），如 DEC-2 所述。
- `useMultiCombobox`（从 `@astryxdesign/core/MultiSelector` 导出）对 MultiSelector 自身的控件做同样的事。它接受 MultiSelector 的选项类型，把 ARIA 接线留给调用方，并且在输入法组合期间不守护按键。
- `useTypeahead` 已在输入法组合期间忽略按键，而 `useAnnounce` 就是 FR7 所指的共享播报器。
- 两个 combobox hook 都交付了 hook 文档，`astryx hook` 与 `astryx search` 会返回它们。`useCombobox` 的文档命名了它所满足的上述要求（FR8）；`useMultiCombobox` 的文档并未覆盖任何调用方渲染的字段，也未命名任何要求。

## Verification

| 契约     | 验证                                                | 代表性状态                                                                                             | 变异或失败预期                                                                                                                      |
| -------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| FR1–FR3  | `spec:AST-021` 下的 Chromium 无障碍树绑定；单元测试 | input、textarea、contenteditable；列表位于层中，也位于文档流中                                         | 焦点离开字段、残留过期的 `aria-activedescendant` 或 `aria-controls`，或 axe 在字段上报告 `aria-allowed-role` 或 `aria-allowed-attr` |
| FR4, FR6 | Chromium 中的真实键盘与指针输入                     | 在对话框中按方向键、Enter、Escape，悬停与按下；在 `input` 中以及在 `textarea` 中对隐藏列表按 ArrowDown | 某个按键或按下在错误时机选中选项、关闭列表或使字段失焦                                                                              |
| FR5      | 组合事件测试                                        | 用 Enter 确认的候选词选择                                                                              | 组合期间按 Enter 选中了某个选项                                                                                                     |
| FR7      | 共享播报器测试                                      | 有结果、无结果、一个新查询、同一帧内两个查询                                                           | 没有播报，或播报来自某个每个字段各自的 live region，或被取代的数量与更新的数量一起播出                                              |
| FR8      | 针对 core 导出 hooks 的 CLI hook 发现测试           | DEC-2 中命名的每个公共 hook；从组件入口点导出的 hook                                                   | 某个 combobox hook 被导出却没有 hook 文档，或 `astryx hook <name>` 否认它存在                                                       |

## Decision log

### DEC-1 — The caller renders the field and the list; Astryx owns the semantics and the keys

**Reference:** `spec:AST-075/DEC-1`

**Decider:** `cixzhang`, `2026-10-15`

已经在渲染输入框、搜索字段或对话框字段的产品，若要采用 typeahead，就不得不替换该字段并把它的列表移入层中，因此它只能手工接线 combobox 模式，而每一份副本在 FR1–FR7 所固化的细节上各不相同。把字段与列表留给调用方、把语义交给 Astryx 之后，每个这样的界面都满足同一份经过测试的契约。

已否决：要求产品的字段必须就是 typeahead 自身的 input——textarea 或 contenteditable 输入框无法充当这样的 input，而位于文档流中的列表并不是层。

### DEC-2 — The contract ships as composable hooks, built on `useCombobox`

**Reference:** `spec:AST-075/DEC-2`

**Decider:** `cixzhang`, `2026-10-15`

产品在自身字段之上、通过组合 hooks 来构建 combobox，正如 Astryx 构建自己的 combobox 那样：`useCombobox` 负责活动选项、展开状态和按键，并从 Selector 的选项类型泛化到任意选项列表以及调用方渲染的字段；输入法守护由 `useTypeahead` 已经适用的那一套承担；结果数量由 `useAnnounce` 负责。Astryx 自己的 combobox 也组合同样的 hooks，因此本规格覆盖的每个界面背后都是同一份经过测试的实现，并且每个 hook 都以 hook 的形式被文档化（FR8）。泛化 `useCombobox` 使其已发布的选项和返回字段对现有调用方保持原样可用；新增的输入是可选的补充。组件仍是常见场景的便捷路径；hooks 是其他每个字段的路径。

已否决：新增一个组件，或让 `BaseTypeahead` 接受调用方的字段——这会把行为锁死在单个组件的标记结构之内。

### DEC-3 — A hidden list reopens on ArrowDown in a single-line field only

**Reference:** `spec:AST-075/DEC-3`

**Decider:** `cixzhang`, `2026-10-15`

在单行字段中，方向键没有插入符工作可做，因此 ArrowDown 会重新打开隐藏的列表，这正是 Astryx 自身 typeahead input 已经给出的键盘模型。在多行字段中，方向键在行之间移动插入符，这是写消息的人所需要的，因此在列表隐藏时，这些按键会到达字段。

已否决：在列表隐藏时把每个按键都交给每个字段——这会使单行搜索字段除了打字之外再无回到其列表的键盘途径。

## Open questions

- **OQ2 — Home and End**（`human-design`）：在调用方渲染的字段中，它们要么继续移动插入符，要么移动到第一个和最后一个选项，正如 `component:BaseTypeahead` FR5 为其自身 input 所做的那样。
- **OQ3 — 二维列表**（`human-api`）：选项网格（例如表情选择器）是属于本契约，还是属于另一份契约。
