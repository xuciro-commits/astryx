---
schema_version: 3
template_version: 7
kind: component
id: component:MultiSelector
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/MultiSelector/MultiSelector.test.tsx,
    packages/core/src/MultiSelector/MultiSelector.fr10.test.tsx,
    packages/core/src/MultiSelector/MultiSelector.focusableDisabled.test.tsx,
    packages/core/src/MultiSelector/CreateRow.a11y.chromium.spec.ts,
    packages/core/src/MultiSelector/OptionActions.a11y.chromium.spec.ts,
    packages/core/src/__tests__/BusyOwnerAnnouncement.test.tsx,
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
system_specs:
  [
    spec:AST-001,
    spec:AST-011/DEC-1,
    spec:AST-055,
    spec:AST-056,
    spec:AST-058,
    spec:AST-079/DEC-1,
    spec:AST-085,
    spec:AST-086,
    spec:AST-102,
  ]
---

# MultiSelector component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变更。MultiSelector 接受 `options`、受控的 `value` 与 `onChange`、`changeAction`、显示与格式化 props、`hasSearch`、`hasSelectAll`、`hasCreate`、`isReadOnly`、`isDisabled` 与 `disabledMessage`、`isLoading`、`presentation`、`renderTrigger`、`handleRef`、`onOpenChange`、字段 props，以及 `container*` 与 `control*` 样式。 |
| 行为          | 组合框触发器会在指针弹出层或底部面板中打开一个列表框（一旦某个选项带有 action，则打开网格）；选项切换时不关闭面板；搜索进行过滤并播报数量；创建行可将键入的查询铸成新值；只读与禁用状态保持可聚焦。                                                                                                                              |
| 最终用户影响  | 用户可以用指针或键盘选择多个值、搜索长列表，并听到数量与变更的播报；禁用与只读字段保持可达并会自我说明。字段不会随设定的文本大小增长。                                                                                                                                                                                           |
| 构建者影响    | 构建者通过 `container*` 与 `control*` 为字段设置样式，可以自行渲染触发器，并通过 `onChange` 接收创建结果。                                                                                                                                                                                                                       |
| 兼容性/就绪度 | 记录已发布行为；没有 API、默认值或 DOM 变更。将加载状态读作无选项、零选项弹出层以及固定的字段高度，都列在 Current-state impact 之下。                                                                                                                                                                                            |
| 审查检查      | 拒绝以下情形：每种呈现方式各自出现第二棵面板树、丢失目标、只读字段仍可编辑、原生 `disabled`、禁用状态下仍触达调用方处理器，或对精确匹配仍提供创建行。                                                                                                                                                                            |
| 治理规则      | `family:input-fields`；`spec:AST-001` FR3, FR4, FR6；`spec:AST-011` DEC-1；`spec:AST-055`；`spec:AST-056`；`spec:AST-058`；`spec:AST-085`；`spec:AST-086`；`spec:AST-102` FR4；`architecture:component-theming-surface`。                                                                                                        |

本表是审查用的投影；以下正文具有权威性。

## Intent

MultiSelector 渲染一个多选控件，带有可选的独立 Field 外壳，并在锚定的指针弹出层或面向触摸的 BottomSheet 中提供唯一一棵共享的面板内容树。它还支持只读状态，该状态保留并提交已选值，但不暴露该面板或任何编辑可供性。

## Compatibility and migration

- 已发布默认值保持不变：是
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：`value` 为受控；打开状态属于组件自身，由 `handleRef` 驱动，并由 `onOpenChange` 报告
- 迁移决策：无；已移除的 `multi-selector-clear-icon` 别名由共享的 `input-clear-icon` 目标替代（FR6）

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 绘制出的触发器及其 `multi-selector` 目标。
- 通过其余六个 MultiSelector 目标提供的指示图标、搜索行、选项行、分区标题、空状态与指针弹出层呈现。
- 一棵共享的面板内容树，无论由哪种呈现方式承载，都包含可选的搜索、选项、分隔线、分区与空状态内容。

**不拥有 / 非目标**

- 独立字段外壳呈现 —— 由 Field 渲染，并通过 Field 当前的 `field` 目标施加主题；当 MultiSelector 位于 InputGroup 内部时省略。
- 共享清除操作 —— 由 Field 的 InputClearButton 渲染，并通过 Field 当前的 `input-clear-button` 目标施加主题。
- 选项复选框呈现 —— 由 CheckboxInput 渲染，并通过 CheckboxInput 当前的 `checkbox-indicator` 目标施加主题。
- 公共选项分隔线 —— 由 Divider 渲染，并通过 Divider 当前的 `divider` 目标施加主题。
- 起始、搜索与状态图标的通用 Icon 呈现 —— 由 Icon 渲染，并通过 Icon 当前的 `icon` 目标施加主题。
- 触摸面板标题 —— 由 Heading 渲染，并通过 Text 当前的 `heading` 目标施加主题。
- 触摸面板面板 —— 由 BottomSheet 渲染，并通过 BottomSheet 当前的 `bottom-sheet` 目标施加主题。
- 调用方提供的任意 ReactNode 起始内容。
- 共享的层生命周期、定位与关闭行为。

## Public concepts

完整的 prop 语法与示例仍保留在 `MultiSelector.doc.mjs` 中。

| 概念        | 封闭值或状态                | 含义                                                                          | 可用性                                           | 默认值  | 所有者 | 稳定性 | 无效值行为                                          |
| ----------- | --------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------ | ------- | ------ | ------ | --------------------------------------------------- |
| 只读状态    | `false`, `true`             | 保留并提交值，但不提供选择可供性                                              | 封闭的触发器                                     | `false` | 调用方 | stable | 布尔归一化                                          |
| 锚定模式    | `renderTrigger` 缺失、存在  | 调用方渲染的控件替代 Field 外壳与触发器；面板锚定到它，并由 `label` 命名      | 指针弹出层与触摸面板                             | 缺失    | 调用方 | stable | 渲染 prop 必须返回携带所给 props 的控件             |
| 创建行      | `hasCreate` `false`, `true` | 首行将键入的查询铸成新值，并通过 `onChange` 以 `{type: 'create', query}` 报告 | 搜索模式、查询不匹配任何选项标签、非 `isLoading` | `false` | 调用方 | stable | 无 `hasSearch` 时：开发警告，不提供任何内容         |
| 选项 action | `action` 缺失、存在         | 选项的辅助控件作为单个节点；弹出层是一个由选项与 action 配对成行的网格        | 指针弹出层与触摸面板                             | 缺失    | 调用方 | stable | `null` 表示没有；没有名称的控件会在开发模式发出警告 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 依据                                                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| FR1  | 当前独立呈现包含一个 Field 与绘制出的触发器；受支持的 InputGroup 路径渲染相同触发器但不含 Field。可选的起始内容、清除操作、状态图标或指示图标遵循所提供的 props 与状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码、文档与测试                                                      |
| FR2  | 共享面板内容包含可选的搜索行、零个或多个选项行、可选的公共选项分隔线与分区标题，以及当适用结果集为空且值未处于加载中时的空状态。选项来源的待定状态 MUST 独立提供，MUST NOT 从输入 `isLoading` 推断（`spec:AST-001` FR4）；并且在提供零个选项且无待定状态时，字段 MUST 只读、无任何可选选项，并在不打开弹出层的情况下说明这一点（`spec:AST-001` FR3, FR6）。实现缺口：不存在显式的待定状态；`isLoading` 被读作选项尚未到达，因此它暂不显示空状态、创建行（FR9）与搜索播报（FR14）；而零选项的字段仍保留可操作的触发器，打开后显示带 `emptyText` 的列表框。                                                                                                                                                                        | 当前源码、文档与测试；`spec:AST-001` FR3, FR4, FR6                        |
| FR3  | 触发器、指示图标、搜索行、选项行、分区标题、空状态与指针弹出层携带 `MultiSelector.doc.mjs` 中记录的全部七个当前未弃用的 MultiSelector 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码、文档与测试                                                      |
| FR4  | 存在时，Field、共享清除操作、选项复选框指示器、公共选项分隔线、通用图标、触摸面板标题与触摸面板保留其 Field、CheckboxInput、Divider、Icon、Text 与 BottomSheet 主题所有者。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前组合与所有者                                                          |
| FR5  | 指针弹出层与触摸面板是独立的表面解剖结构行，但两者承载同一棵 `panelContent` 树；触摸面板另外渲染其 Heading。更改呈现方式不会产生第二套搜索、选项、分隔线、分区或空状态内容模型。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码与测试                                                            |
| FR6  | 清除字形仅委托给共享的 `input-clear-icon` 目标；已移除的按组件别名不再声明解剖结构。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前公共目标元数据                                                        |
| FR7  | 当 `isReadOnly` 为 true 时，已选值保持可聚焦且可表单提交，而选择面、清除操作、展开指示图标以及所有值变更路径均不可用。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `spec:AST-011` DEC-1；当前文档与测试                                      |
| FR8  | 使用 `renderTrigger` 时，调用方渲染的控件接收 `ref`、`id`、`onClick`、`onKeyDown`、`onFocus`、`aria-haspopup`、`aria-expanded`、`aria-controls` 与 `aria-busy`；面板锚定到它，关闭时焦点返回给它，列表框由 `label` 命名；打开时，若有 `hasSearch` 则由搜索输入框获得焦点，否则由列表框获得焦点，并由其掌管键盘。不渲染 Field、状态、清除操作、spinner 或指示器。`handleRef` 暴露 `open`、`close`、`toggle`、`isOpen`；`onOpenChange` 在每次打开与关闭时触发。                                                                                                                                                                                                                                                                    | `spec:AST-055` FR1–FR7, AR1–AR4；DEC-1；当前文档与测试                    |
| FR9  | 当同时具备 `hasSearch` 与 `hasCreate`、且未设置 `isLoading` 时，若去除首尾空白后的查询在搜索自身的大小写不敏感匹配下不等于任何选项标签，则 `Create "<query>"` 行位于列表首位。选中它，或在没有高亮项时按 Enter，会调用 `onChange`，将查询追加到值中并附加 `{type: 'create', query}` 描述符，清空搜索，并播报该创建；其他所有变更都不传描述符。该行没有复选框，永远不会被选中，也不参与全选与 `renderOption`；当它是唯一结果时，播报它而不是空消息。处于 `isLoading` 时，不提供该行，Enter 也不提交任何内容。`hasCreate` 而没有 `hasSearch` 会在开发模式下发出警告且不提供任何内容。在 `isLoading` 期间不提供该行即 FR2 缺口。                                                                                                    | 当前行为；`spec:AST-056` FR5 与 DEC-3                                     |
| FR10 | 一旦任何已声明的选项 —— 位于任意分区深度、在任何查询过滤之前 —— 带有 `action`，弹出层即为 `role="grid"`，并在挂载期间保持为网格；触发器声明 `aria-haspopup="grid"`（底部面板仍保持 `dialog`）。每个选项（包括全选行）都是携带该选项 id、`aria-selected` 与 `aria-disabled` 的 `role="row"`，并恰好有两个 `gridcell` 子节点：先是选项内容，然后是其 action 或空单元格。分区是 `rowgroup`，由其标题命名。按下选项单元格会切换；按下 action 会触发调用方的控件，除此之外没有别的行为。Up/Down 在行之间移动到选项单元格；行内末端箭头移动到 action 单元格，行内起始箭头返回，遵循 RTL 下的视觉方向；在 action 单元格上按 Enter 会激活该控件。`aria-activedescendant` 命名该行或该 action 单元格。没有任何 action 控件是 tab 停靠点。 | `spec:AST-058` FR1–FR8, AR1–AR4                                           |
| FR11 | 任何表面都不渲染原生 `disabled`。禁用的触发器保留其 tab 停靠点并带 `aria-disabled`；按下不会打开它，也不会触达调用方或祖先处理器；按键不会打开它，也不会触达调用方处理器；它不提交任何值；`disabledMessage` Tooltip 通过 `aria-describedby` 从触发器关联；只有 `isDisabled` 会采用禁用涂装。忙碌时（`isLoading` 或存在待定的 `changeAction`），触发器显示 Spinner 与 `aria-busy`，保持其常规涂装，并在每次忙碌开始时播报一次。                                                                                                                                                                                                                                                                                                   | `spec:AST-085` FR1–FR6；`spec:AST-086` FR8；`family:input-fields` FR4–FR6 |
| FR12 | 在获得焦点的触发器上按 ArrowDown 会打开列表；ArrowDown 与 ArrowUp 移动高亮；无搜索时 Home 与 End 跳到第一个和最后一个选项，有搜索时它们移动光标，而 PageDown 与 PageUp 跳转高亮；Enter 切换高亮选项，但在输入法组合期间除外；Escape 关闭；Tab 关闭并向前移动焦点，但若查询使搜索的清除按钮可见，则向前 Tab 会移动到该按钮并保持列表打开；在有 `hasClear` 且无 `hasSearch` 时，若有一个值被选中，在获得焦点且已关闭的触发器上按 Delete 或 Backspace 会清除所有值。                                                                                                                                                                                                                                                                | 当前源码与测试                                                            |
| FR13 | 字段没有根样式 props：`control*` 作用于触发器周围带边框的控件盒，`container*` 作用于 Field 盒（`family:input-fields` FR10）；在控件盒内、触发器之外按下会打开它；调用方 `onClick` 在内置切换之后运行，调用方 `onKeyDown` 在内置键盘模型之后运行，并且对于该模型已处理并取消的按键会被跳过；调用方 `aria-describedby` 会与字段描述合并，调用方 `aria-labelledby` 跟随字段自身的名称。使用 `renderTrigger` 时，`container*` 与 `control*` 无效并发出警告。触发器高度是其尺寸对应的共享元素尺寸，且 MUST 随设定的文本大小增长（`spec:AST-102` FR4）。实现缺口：高度是固定的。                                                                                                                                                       | `family:input-fields` FR10；`spec:AST-102` FR4；当前测试                  |
| FR14 | 每次切换、全选或清除都以礼貌方式播报：当所有选项最终都被选中时播报全选消息，当一个都不剩时播报已清除消息，否则播报选择数量。一旦有人搜索，匹配数量（或空结果消息，或创建行是唯一结果时该行的标签）会以礼貌方式播报；`isLoading` 期间不播报任何搜索结果（即 FR2 缺口）。使用 `htmlName` 时，字段为每个已选值提交一个条目。                                                                                                                                                                                                                                                                                                                                                                                                        | `spec:AST-086`；当前测试                                                  |
| FR15 | 使用内置触发器时，关闭后仅当焦点否则会丢失时，焦点才返回触发器（`family:overlay-dismissal` FR9）；因焦点移到别处而导致的关闭会把焦点留在那里。调用方的控件（`renderTrigger`）保留 FR8 的焦点返回行为。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `family:overlay-dismissal` FR9；当前测试                                  |
| FR16 | 使用 `hasSearch` 时，每次查询变更都会清除高亮，因此 `aria-activedescendant` 绝不会指向前一个列表中的行。随后 ArrowDown 从第一行开始（显示时为 Select all 行或创建行，否则为第一个启用的匹配项），没有高亮项时按 Enter 遵循 FR9，Left 与 Right 在有行高亮之前仍是搜索字段的光标键（FR10）。                                                                                                                                                                                                                                                                                                                                                                                                                                       | `MultiSelector.test.tsx`；`Selector.searchHighlight.test.tsx`             |
| FR18 | 打开已关闭的列表绝不会高亮禁用的选项：ArrowUp 高亮最后一个启用的选项，而其他所有打开方式（ArrowDown、按下、Enter、Space）都高亮第一个启用的选项，顺序按列表打开时的顺序、已选选项在前；若没有启用的选项，则不高亮任何项。在已关闭的列表上键入会按键入的匹配项打开。通过按下、Enter 或键入打开的搜索列表不会高亮任何项。                                                                                                                                                                                                                                                                                                                                                                                                          | `component:Selector` FR8；`MultiSelector.openHighlight.test.tsx`          |

### Allowed variation

- 独立 MultiSelector 渲染 Field；受支持的 InputGroup 路径省略它。
- `presentation="popover"` 使用指针弹出层；`presentation="bottom-sheet"` 使用触摸面板及其 Heading；`presentation="adaptive"` 依据当前输入模态与视口行为在那些既有分支之间选择。
- 搜索行、选项分隔线、分区标题、空状态、全选选项行以及两个清除操作，在各自文档化的 prop 与数据条件下都是可选的。
- 语义名称与图标组件类型通过 Icon 渲染。任意 ReactNode 起始内容直接渲染并归调用方所有。
- 触发器文本、标签、徽标以及自定义选项内容可以在触发器或选项行内部变化，而不会产生另一个 MultiSelector 目标。

### Representative states

| 状态                     | 必需不变式                                                                         | 允许的变化                                           |
| ------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------- |
| 独立或 InputGroup        | Field 仅在独立模式下存在；两条路径中的触发器解剖结构与目标都保持不变。             | InputGroup 负责分组布局与标签支持。                  |
| 指针呈现                 | 指针弹出层携带 `multi-selector-popup` 并承载共享面板内容。                         | 搜索、分组、选项与空内容遵循其常规状态。             |
| 触摸呈现                 | BottomSheet 拥有 Sheet 面板，Text 拥有其 Heading，且该面板承载同一份共享面板内容。 | 自适应或显式选择都可能选中此分支。                   |
| 启用搜索且有查询         | 搜索行拥有 `multi-selector-search`；其图标/操作保留各自的共享所有者。              | 结果可以是平铺、分组或空的。                         |
| 选项、全选、已选中、禁用 | 选项行拥有 `multi-selector-option` 并反映其当前尺寸/状态元数据。                   | 复选框状态与自定义行内容独立变化。                   |
| 附带状态或工具提示状态   | 状态图标替换指示图标。                                                             | 工具提示状态将图标包在按钮中，但不改变 Icon 所有者。 |
| 只读                     | 值保持可聚焦且可提交；面板、清除与展开可供性均不存在。                             | 触发器显示、状态与忙碌呈现仍然可用。                 |

### Transformation and precedence order

- **ORD1 — 变更。** 切换、全选、清除或创建 → `onChange`（仅创建时带描述符）→ 以乐观值调用 `changeAction`。

### Performance and resources

- **PR1 — 资源有界。** 该组件不自行添加任何事件监听器或观察器；其计时器是在面板打开时移动焦点的一个动画帧，以及 typeahead 重置超时。播报使用共享的礼貌播报通道。

## Accessibility contract

可编辑时，既有的字段、组合框、列表框、复选框、实时区域、焦点与关闭行为保持不变。只读值保持可聚焦，保留 `role="combobox"`，并暴露 `aria-readonly="true"` 与 `aria-expanded="false"`。其渲染内容仍是组合框的值。它不暴露 `aria-controls`、`aria-activedescendant`，也不暴露活动选择面。隐式列表框弹出层描述该控件的选择能力；只读状态则表明其值当前不能变更。Chromium 将组合框映射到按钮宿主时会省略 ARIA 只读属性，因此本地化的无障碍描述也会播报该状态。搜索与非搜索模式使用相同的只读组合框语义，因为在该状态下两者都不暴露搜索控件。

使用 `renderTrigger` 时，调用方的控件携带面向列表框的 `aria-haspopup`、`aria-expanded` 与 `aria-controls`；列表框使用来自 `label` 的 `aria-label`，而不是用触发器做 `aria-labelledby`；打开时，搜索输入框（在 `hasSearch` 时）或列表框获得焦点，并在打开期间拥有方向键、Enter、Escape 与 typeahead 按键，因此即使锚点无法获得焦点，也仍保留一条键盘路径。

创建行是 `role="option"`，或在网格中是带空 action 单元格的 `role="row"`（FR10），带有 `aria-selected="false"` 且没有复选框指示器。当它是唯一结果时，礼貌实时区域播报其标签而不是空搜索消息，因此播报内容与屏幕上的一致；选中它会播报该创建。结果计数与创建行标签来自搜索自身的替换式播报器，因此较新的播报会替换尚未播出的播报（`spec:AST-086` FR9），而选择消息保留自己的播报器。

## Design relationships

| 解剖结构或状态         | 设计要求                                                             | 呈现权威方         | 层级角色     | 组件契约      |
| ---------------------- | -------------------------------------------------------------------- | ------------------ | ------------ | ------------- |
| Field                  | 在 InputGroup 之外提供标签与可选的支持内容；在 InputGroup 内部省略。 | Field 组件         | 辅助         | FR1, FR4      |
| 触发器                 | 呈现当前选择或占位符，并打开当前呈现方式。                           | 当前源码与公共文档 | 突出         | FR1, FR3      |
| 由 Icon 渲染的起始图标 | 通过 Icon 呈现语义图标或组件图标。                                   | Icon 组件          | 辅助         | FR1, FR4      |
| 调用方渲染的起始内容   | 在触发器的起始槽位中直接呈现任意调用方内容。                         | 调用方提供的内容   | 视上下文而定 | FR1           |
| 触发器清除按钮         | 通过共享的字段清除操作移除每个已选值。                               | Field 组件         | 辅助         | FR1, FR4      |
| 状态图标               | 通过 Icon 呈现附带的或工具提示式的校验状态。                         | Icon 组件          | 辅助         | FR1, FR4      |
| 指示图标               | 当状态呈现未替换它时，呈现展开状态。                                 | 当前源码与公共文档 | 辅助         | FR1, FR3      |
| 搜索行                 | 在共享面板内容顶部提供查询输入。                                     | 当前源码与公共文档 | 辅助         | FR2, FR3, FR5 |
| 搜索图标               | 通过 Icon 呈现搜索可供性。                                           | Icon 组件          | 辅助         | FR2, FR4      |
| 搜索清除按钮           | 通过共享的字段清除操作清除当前的查询。                               | Field 组件         | 辅助         | FR2, FR4      |
| 选项行                 | 呈现一个选项或全选选项，并拥有行交互/状态。                          | 当前源码与公共文档 | 突出         | FR2, FR3      |
| 选项复选框指示器       | 通过 CheckboxInput 呈现选项的已选中、未选中或不确定状态。            | CheckboxInput 组件 | 辅助         | FR2, FR4      |
| 选项分隔线             | 当选项数据中存在公共分隔线条目时，分隔相邻分组。                     | Divider 组件       | 辅助         | FR2, FR4      |
| 分区标题               | 为一组可见的选项行提供标签。                                         | 当前源码与公共文档 | 辅助         | FR2, FR3      |
| 空状态                 | 当搜索没有留下任何行时呈现无结果内容；无选项时的内容即 FR2 缺口。    | 当前源码与公共文档 | 突出         | FR2, FR3      |
| 指针弹出层             | 在共享面板内容周围绘制锚定的指针表面。                               | 当前源码与公共文档 | 突出         | FR3, FR5      |
| 触摸面板标题           | 在共享面板内容上方为底部面板呈现命名。                               | Text 组件          | 突出         | FR4, FR5      |
| 触摸面板               | 在同一份共享面板内容周围绘制 BottomSheet 表面。                      | BottomSheet 组件   | 突出         | FR4, FR5      |

当前七个 MultiSelector 目标仍保留在其已发布的可见元素上。嵌套的共享原语保留各自的所有者。指针弹出层与触摸面板有意作为独立行，因为它们使用不同的表面所有者；触摸面板额外增加一个由 Text 拥有的 Heading。搜索、选项、分隔线、分区与空状态内容仍是唯一一棵共享树。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Field": {"delegatesTo": {"owner": "component:Field", "target": "field"}},
  "Trigger": {"target": "multi-selector"},
  "Icon-rendered start icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Caller-rendered start content": {
    "none": {
      "reason": "intentional: Arbitrary ReactNode content is caller-owned and receives no MultiSelector target."
    }
  },
  "Trigger clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Status icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Indicator icon": {"target": "multi-selector-indicator-icon"},
  "Search row": {"target": "multi-selector-search"},
  "Search icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Search clear button": {
    "delegatesTo": {
      "owner": "component:Field",
      "target": "input-clear-button"
    }
  },
  "Option row": {"target": "multi-selector-option"},
  "Option checkbox indicator": {
    "delegatesTo": {
      "owner": "component:CheckboxInput",
      "target": "checkbox-indicator"
    }
  },
  "Option divider": {
    "delegatesTo": {"owner": "component:Divider", "target": "divider"}
  },
  "Section heading": {"target": "multi-selector-section-heading"},
  "Empty state": {"target": "multi-selector-empty-state"},
  "Pointer popup": {"target": "multi-selector-popup"},
  "Touch sheet heading": {
    "delegatesTo": {"owner": "component:Text", "target": "heading"}
  },
  "Touch sheet": {
    "delegatesTo": {
      "owner": "component:BottomSheet",
      "target": "bottom-sheet"
    }
  }
}
```

## Family and system relationships

- `architecture:public-component-api` 与 `spec:AST-011/DEC-1` 拥有只读 API 及其跨输入含义。
- `spec:AST-055` 拥有调用方渲染的触发器（FR8）。
- `spec:AST-001` 拥有选项来源的待定状态（FR2）。
- `architecture:component-theming-surface` 拥有解剖结构资格判定、局部目标映射、委托以及已移除别名的排除。
- `architecture:layer-runtime` 拥有当前 Popover 宿主，以及浏览器 popover 与原生 dialog 面板呈现之间的区分。
- `family:overlay-dismissal` 拥有共享的 Escape 与平台关闭顺序。指针弹出层通过其组合的 Popover 所有者参与；触摸面板继承 BottomSheet 当前仅本地采用的缺口。
- Field、CheckboxInput、Divider、Icon、Text 与 BottomSheet 保留对其委托目标与呈现的所有权。

## Verification map

| 契约         | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 代表性状态                                                                                | 变更或失败预期                                                                                                                                                                                                                                | 审计小节                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| FR1, FR2     | `MultiSelector.test.tsx` 的渲染、标签、计数、分区、列表结构、搜索入口、全选与空状态用例；"keeps a standalone secondary trigger out of the group geometry"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 独立与分组；搜索；分区；全选；空                                                          | 缺少 Field、触发器部件、搜索行、选项、分隔线、标题或空状态时失败；无选项用例断言了当前 FR2 的差距，等待符合性修复。证据缺口：没有测试断言 InputGroup 路径会省略 Field。                                                                       | `audit:MultiSelector/anatomy`       |
| FR3, FR6     | `MultiSelector.test.tsx` 的主题目标用例（空状态、清除图标、指示器图标、禁用状态、选项行、弹窗）；`themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 每个局部目标；共享清除字形                                                                | 目标缺失或被移动，或清除字形带有组件别名，会失败。证据缺口：没有测试断言 `multi-selector-search` 或分节标题目标。                                                                                                                             | `audit:MultiSelector/theming`       |
| FR4          | `MultiSelector.test.tsx` 的 "routes the clear glyph through the shared clear button" 与 statusVariant 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 共享清除与状态                                                                            | 清除或状态脱离其共享所有者时会失败。证据缺口：除渲染外，没有测试断言 CheckboxInput、Divider、Text 与 BottomSheet 的委托。                                                                                                                     | `audit:MultiSelector/theming`       |
| FR5          | `MultiSelector.test.tsx` 的 "uses a bottom sheet and stays open while toggling options"、"uses a bottom sheet for adaptive presentation on compact touch"、"moves keyboard focus into a bottom-sheet listbox"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Popover 与底部面板                                                                        | 切换选项时关闭或缺少列表框的面板会失败。证据缺口：没有测试断言两种呈现方式共用同一个面板树。                                                                                                                                                  | `audit:MultiSelector/behavior`      |
| FR7          | `MultiSelector.test.tsx` 的 isReadOnly 用例；"a read-only selector advertises no panel on the caller's control"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 只读并加载中；指针、键盘、预输入                                                          | 会打开或发生变化的只读字段会失败。证据缺口：没有测试断言只读表单提交或 `aria-readonly`。                                                                                                                                                      | `audit:MultiSelector/behavior`      |
| FR8          | `MultiSelector.test.tsx` 的触发器 render prop、只读与焦点返回用例；`MultiSelector.fr10.test.tsx` 的 renderTrigger 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 调用方控件关闭与打开；句柄；禁用；焦点返回                                                | 调用方控件未能打开面板、未能命名列表框或未能取回焦点，或句柄打开了已禁用的选择器，会失败。                                                                                                                                                    | `audit:MultiSelector/behavior`      |
| FR9          | `MultiSelector.test.tsx` 的 hasCreate 用例；`CreateRow.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 创建项被提供、已提交、被跳过、加载时缺失；警告                                            | 为精确匹配、加载中或无搜索时显示创建行，或创建缺少其描述符，会失败。                                                                                                                                                                          | `audit:MultiSelector/behavior`      |
| FR10         | `MultiSelector.test.tsx` 的选项操作（网格）、混合输入下的焦点环，以及网格内创建行用例；`OptionActions.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 列表框与网格；RTL；搜索；悬停；Tab                                                        | 网格没有操作项、列表框却带有操作项、单元格激活错误、RTL 方向箭头相反，或操作控件成为 Tab 停靠点，会失败。                                                                                                                                     | `audit:MultiSelector/accessibility` |
| FR11         | `MultiSelector.focusableDisabled.test.tsx` 用例；`MultiSelector.test.tsx` 的 disabledMessage 用例、"trigger keeps its tab stop when disabled (spec:AST-085 FR1)"、"shows no disabled focus ring after a pointer pick (spec:AST-085 FR6)"、"shows loading state with a spinner and aria-busy"、"is excluded from form data when disabled"；`BusyOwnerAnnouncement.test.tsx` 的 MultiSelector 用例                                                                                                                                                                                                                                                                                                 | 带原因与不带原因的禁用；加载中；待处理的 Action                                           | 原生 `disabled`、禁用期间打开或调用调用方处理函数、禁用期间提交值、未关联的原因，或缺少忙碌公告，会失败。证据缺口：没有测试断言仅忙碌状态下的绘制。                                                                                           | `audit:MultiSelector/accessibility` |
| FR12         | `MultiSelector.test.tsx` 的键盘用例（"supports keyboard navigation with ArrowDown/ArrowUp"、"End/Home jump the highlight to the last/first option (non-search)"、"PageDown/PageUp jump the highlight to the last/first filtered option"、"Home/End move the search caret, not the option highlight"、"toggles item with Enter key"、"does not toggle the highlighted option on a composing Enter (IME)"、"closes on Escape"、"closes combobox on Tab and moves focus to next element"、"opens the listbox with ArrowDown from a focused trigger"，以及 Delete 与 Backspace 清除用例），以及 "tabs from the search input to the clear button (keeping the popup open) when a query is showing it" | 当前源码与测试                                                                            | 按键执行了错误的移动、输入法合成中的 Enter 触发切换，或未选中任何项时执行清除，会失败。                                                                                                                                                       | `audit:MultiSelector/accessibility` |
| FR13         | `MultiSelector.fr10.test.tsx` 用例；`MultiSelector.test.tsx` 的调用方 aria-labelledby 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 控件盒；调用方处理函数；renderTrigger                                                     | 根样式 prop、脱离控件盒的 `control*`、位于内建处理函数之前的调用方处理函数，或丢失调用方名称或描述，会失败。证据缺口：没有测试断言内建模型取消的按键会跳过调用方 `onKeyDown`，也没有测试断言触发器高度或其随文字大小增长的情况（FR13 差距）。 | `audit:MultiSelector/layout`        |
| FR14, ORD1   | `MultiSelector.test.tsx` 的公告、结果公告、计数文本与表单参与用例；hasCreate 公告用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 切换、全选、清除；搜索计数；加载中；表单                                                  | 公告缺失或错误、加载中播报搜索结果，或表单条目错误，会失败。证据缺口：没有测试断言 `onChange` 先于 `changeAction` 的顺序。                                                                                                                    | `audit:MultiSelector/behavior`      |
| FR15         | `MultiSelector.test.tsx` 的 "with the built-in trigger, a light dismiss onto another field leaves focus there, and Escape returns it to the trigger"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Escape；轻触关闭到另一个字段                                                              | 触发器从另一个字段抢回焦点，或在按 Escape 时丢失焦点，会失败。                                                                                                                                                                                | `audit:MultiSelector/behavior`      |
| FR16         | `Selector.searchHighlight.test.tsx` 的 MultiSelector 套件；`MultiSelector.test.tsx` 的搜索 Left/Right 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 用方向键移动后再输入，然后 ArrowDown，然后 Enter                                          | 保留了上一份列表的高亮，或 Enter 选中了用户未高亮的行，会失败。                                                                                                                                                                               | `audit:MultiSelector/accessibility` |
| FR18         | `MultiSelector.openHighlight.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 在首尾选项均禁用的已关闭列表上按 ArrowDown、ArrowUp、Enter 与点击；没有任何选项启用的列表 | 在禁用选项上产生打开时高亮，或在没有选项启用时产生任何高亮，会失败。                                                                                                                                                                          | `audit:MultiSelector/accessibility` |
| PR1          | 证据缺口：没有测试断言监听器缺失或计时器边界                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | —                                                                                         | —                                                                                                                                                                                                                                             | `audit:MultiSelector/behavior`      |
| 主题结构映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 规范解剖结构与目标                                                                        | 缺失、多余、带前缀、陈旧或以别名支撑的映射会失败于仓库校验。                                                                                                                                                                                  | `audit:MultiSelector/theming`       |

## Current-state impact

- **活动选项的感知。** 活动选项只显示 `--color-overlay-hover` 填充，在浅色和深色下与列表框的对比度均低于 3:1，违反 `spec:AST-020` FR1（WCAG 2.2 1.4.11）。Selector 在键盘输入后绘制共享焦点环（`component:Selector` AR5）。
- **加载被读作无选项（FR2）。** `isLoading` 会抑制空状态、创建行与搜索公告，因此在字段报告加载中时进行搜索的人既看不到也听不到任何内容，违反 `spec:AST-001` FR4。
- **零选项（FR2）。** 没有任何选项的字段保留一个可操作的触发器，打开的是 "No options" 列表，而不是只读的无选择状态，违反 `spec:AST-001` FR3 与 FR6。
- **固定字段高度（FR13）。** 触发器保持共享元素高度，而不随设定的文字大小增长，违反 `spec:AST-102` FR4。

## Decision log

- **DEC-1 — 锚定模式通过 `handleRef` 打开，而非受控的 `isOpen`。** 调用方渲染的触发器本身遵循 `spec:AST-055`。组件继续拥有打开状态，`handleRef`/`onOpenChange` 从其他位置的按键打开它，并报告每一次变化——这条规则已经写在 `ComplexSelectorHandle` 上。已否决：`anchorRef` 加受控的 `isOpen`，它在父级镜像打开状态，并重新引入该规则所指出的那些焦点陷阱。

  **决策者：** `cixzhang`，2026-10-03

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例、搜索或选择算法、实现步骤，也不重复共享的层与主题规则。它链接到这些内容的所有者。
