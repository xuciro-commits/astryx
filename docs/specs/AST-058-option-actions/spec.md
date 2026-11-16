---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-058
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-03
phase: accepted
owners: [cixzhang]
affects_architecture:
  [architecture:public-component-api, architecture:interaction-modality]
affects_families: [family:input-fields]
affects_contributing: [contributing:api-conventions]
affects_consumer_docs:
  [Selector, MultiSelector, Typeahead, BaseTypeahead, Tokenizer]
review_triggers: [public-api, accessibility, behavior]
---

# Secondary action beside a picker option system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "public-api": ["FR1", "FR2", "FR9", "DEC-1", "DEC-4", "DEC-5"],
    "accessibility": ["AR1", "AR2", "AR3", "AR4", "DEC-2", "DEC-3"],
    "behavior": ["FR3", "FR4", "FR5", "FR6", "FR7", "FR8"]
  }
}
```

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 选项把其次级控件作为一个节点携带：`action?: ReactNode`，在弹出面板渲染所依据的两套选项词汇——`SelectorOptionData` 与 `SearchableItem`——上，都是同一个键、同一种类型（FR1，DEC-1，DEC-4）。控件由调用方渲染；宿主把它放入一个网格单元格，除此之外不对它做任何事。                                                                                                                                           |
| Behavior                | 一个其选项都不携带 action 的弹出面板，就是今天那个 listbox。一旦任何已声明的选项携带了 action，该弹出面板就是一个网格：每个选项是一行，带两个单元格——选项与其 action（FR2，FR3，DEC-2，DEC-3）。Up/Down 移动行；行内末端箭头到达 action；Enter 激活它；指针与触摸直接按压它（FR4，FR5）。激活 action 绝不改变选择（FR4）。action 始终可见（FR8）。                                                        |
| End-user impact         | 挑选标签的人也能在同一面板里编辑它，用鼠标、手指、键盘或屏幕阅读器；而按 Edit 也绝不会同时切换该标签。今天，产品能放置该控件的唯一位置还会触发选项，且对辅助技术无效。                                                                                                                                                                                                                                    |
| Builder impact          | 在选项对象上增加一个可选键，存放调用方自己的控件——一个 `IconButton`、一个 `Button`、一个菜单触发器，任何具备可访问名称的东西。没有新类型、没有 render prop、无需为没有 action 的行写防护代码。对不声明该键的调用方，一切不变。                                                                                                                                                                            |
| Compatibility/readiness | 纯增量。当前每个 picker 的渲染与以前完全一致；只有当调用方声明了 action 时才存在网格（DEC-5）。权威级别：`draft`，`approved_by` 为 `null`。没有未决的所有者问题。                                                                                                                                                                                                                                         |
| Review checks           | 否决：在 `role="option"` 内部渲染控件；横在 listbox 与控件之间的 `role="none"` 或 `role="group"` 包装层；检查、克隆或包装 `action` 节点的宿主；由宿主拥有的 action 类型或组件；数组类型的 `action`；角色跟随过滤后视图而不是已声明选项的弹出面板；单元格数量不是两个的行；只能通过指针到达的 action；在弹出面板内新增的 Tab 停靠点；悬停显现或滑动显现的 action。                                         |
| Governing rules         | [`spec:AST-002`](../AST-002/spec.md) FR1，FR4，FR15，FR16，`DEC-1`，`DEC-6`；[`architecture:public-component-api`](../../architecture/public-component-api.md) INV1，INV2，INV3，INV9；[`architecture:interaction-modality`](../../architecture/interaction-modality.md) INV4，INV7；[`spec:AST-056`](../AST-056/spec.md) AR1（关于空状态的播报）；`component:DropdownMenu`（本记录复用的条目数据词汇）。 |

本表是审查用的投影；下方正文具有权威性。

## Intent

一个 picker 的 combobox 会打开一个由选项组成的弹出面板。有时，该已打开面板中的某个选项会在其第一个动词旁再携带第二个动词：一个可编辑的已保存标签、一个可重命名的已保存搜索、一个可移除的最近值。用户需要在按下该控件的同时不选中该选项，而屏幕阅读器用户需要知道它存在并能到达它。

Astryx 的 picker 无法承载它。每个选项槽位都渲染在选项的点击目标内部，因此放在那里的控件会立刻触发并切换选择，而 `role="listbox"` 只允许 `option` 与 `group` 子元素，所以该控件落在哪里都无效。构建者要么舍弃该动词，要么重建列表。

本记录拥有一个答案：**选项把其 action 作为一个由调用方渲染的节点携带，而任何持有此类选项的弹出面板都是一个网格，其每一行把选项与其 action 配对。** action 位于已打开弹出面板内选项的旁边；此处不涉及收起状态的触发器，其自身控件（清除、chevron、状态）保持当前契约。combobox 契约得以保留，键盘路径无需第二个界面即可存在，且没有调用方需要为没有 action 的行编写防护代码。

## Ownership boundary

**拥有**

- 选项的次级控件作为一个由调用方渲染的节点承载在选项上，以及该键在弹出面板渲染所依据的每一套选项词汇中的名称与类型。
- 持有携带 action 的选项的弹出面板是一个网格，其行如何成形，以及该弹出面板在何时切换。
- 指针、手指、键盘与辅助技术如何到达一个 action，以及到达它绝不改变选择。
- 该安排所保持的可访问性底线：有效的树、具名控件、一个 tab 停靠点、没有仅悬停路径。
- 哪些组件采用，以及一个渲染该词汇却不采用的宿主如何表现。

**为何没有现成记录能容纳它**

- `spec:AST-057` 拥有一个加速宿主已展示动词的触摸手势。其 FR9 与 DEC-4 保持 `Item` 不变，并依据其自身文本把 `option` 行排除在其 `reveal` 模型之外。本记录是选择控件中的始终可见控件——即 AST-057 假定存在却未定义的那个界面。
- `component:Selector` 是 `current`，`component:MultiSelector` 是 `draft`；`SelectorOptionData` 是二者共享的一个类型，其上的键不属于任何一方独有（`architecture:knowledge-contracts` INV2）。`component:MultiSelector` 关于逐行 action 的草案声明（其 FR9 / DEC-2）被撤回，改由本记录承担。
- `component:BaseTypeahead`、`component:Typeahead` 与 `component:Tokenizer` 是 `draft`，并从第二套词汇 `SearchableItem` 渲染。一条约束两套词汇、跨五个组件的规则是系统事实，而非组件事实。
- [`spec:AST-056`](../AST-056/spec.md) 是 `current`，拥有类型化查询各状态的词汇。它治理同样的面板，并在此被读取——空状态的播报（AR1）与创建行（DEC-3）共享该面板——但次级控件不是搜索状态，且 `current` 记录不能承载未获批的声明（`architecture:knowledge-contracts` INV1，INV14）。
- [`architecture:public-component-api`](../../architecture/public-component-api.md) 拥有共享的命名语法，并通过 `deciding_specs` 链接其裁决；一条新的跨组件裁决应属于它所链接的一份 spec。
- [`family:input-fields`](../../families/input-fields.md) 拥有字段外框。`BaseTypeahead` 不是其成员，而面板不是外框。

## Non-goals

- **在一个单元格内的多个控件之间移动。** 该单元格持有一个节点（FR1，DEC-3），因此无需规定在其内部遍历焦点的规则。有多个动词的调用方在该节点中放一个菜单触发器；其所打开的弹出层拥有自己的键盘模型。若日后某份记录允许单元格内有多个控件，仓库自身的树遍历焦点先例就是它的起点。
- **悬停显现、滑动显现或触摸手势形式的对应物。** action 在每个输入下静止时都可见。行上的触摸手势属于 `spec:AST-057`。
- **`CommandPalette`。** 其行是复合子元素（`CommandPaletteItem`），其内部把 `SearchableItem` 转换为 `SelectorOptionData` 时只携带 `value` 与 `label`，所以两个声明位置都到达不了它渲染的行。采用它是它在 `spec:AST-002` 下的自身准入。
- **`ComplexSelector`。** 其内容是调用方拥有的标记，没有 listbox 角色；那里的调用方已经渲染带控件的行。
- **action 单元格的主题目标。** 是否准许一个是各组件自身的主题记录。
- **收起状态触发器上的控件。** 清除按钮、chevron、状态图标，或调用方围绕关闭控件组合的任何东西，都不是选项 action，也不在本记录治理范围内。
- **action 处理函数的语义。** Edit 做什么——打开对话框、就地变更——属于调用方。面板不会因为某个 action 触发而关闭或重新过滤；处理函数可能会。一行在其 action 触发后是否离开，是一个滑动问题，仍留在 `spec:AST-057`；当有人按下 Edit 时，picker 选项不会消失。
- 等价的内部实现只要满足本契约就仍然有效。内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议，以及 CI 作业/工作流拓扑，属于架构或实现，除非调用方或互操作的系统有意把该确切机制作为公共协议依赖。

## Evidence: in the repository

读取自本记录基线提交时的 `packages/core/src`。

| Where                                                                                                                                            | What it shows                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Selector/types.ts` — `SelectorOptionData {value, label?, description?, disabled?, icon?}`；`MultiSelector/types.ts` 重新导出它                  | 一套选项词汇，两个公共组件。`CommandPalette` 导入它只是为了给它的 combobox 构建扁平索引；其渲染的行并不读取它。                                                                                          |
| `Typeahead/types.ts` — `SearchableItem {id, label, element?, auxiliaryData?}`                                                                    | 第二套词汇。由 `BaseTypeahead` 渲染，`Typeahead` 与 `Tokenizer` 组合它；它也是 `ChatComposerInput` 触发器菜单的条目类型，该菜单渲染自己的 listbox。`element?` 表明条目已经携带来自某个来源的渲染时内容。 |
| `Selector.tsx`、`MultiSelector.tsx`、`BaseTypeahead.tsx` — `role="listbox"` 宿主、`role="option"` 行、`aria-activedescendant`                    | 三个 listbox，一个 combobox 模式。每个选项都是一个元素，既是点击目标又是暴露出来的行，因此任何可交互元素要放在选项内容旁边，就必然成为它的后代。                                                         |
| `Selector.tsx` 与 `MultiSelector.tsx` — 分隔符是 `aria-hidden`，空状态是 `role="presentation"`，分区标题在 `role="group"` 内部保持 `aria-hidden` | 三种权宜做法，每一种的注释都写着“`role="listbox"` 只允许 option/group 子元素”。网格的规则不同：行与行组，隐藏的子元素照旧被排除——所以分隔符与空状态继续工作，而分区包装层必须改变角色（FR7）。           |
| `BaseTypeahead.tsx` — 空状态是 `role="option" aria-disabled="true"`                                                                              | 第四种、且不一致的权宜做法：“无匹配”消息本身就是一个被禁用的选项。在网格中该元素是无效子元素，而 `spec:AST-056` AR1 已要求把所渲染的内容纳入播报（FR7）。                                                |
| `Selector.tsx` — `aria-haspopup` 为 `'listbox'`，底部面板则为 `'dialog'`；`BaseTypeahead.tsx` 省略它（combobox 默认是 `listbox`）                | 弹出层的角色已按呈现方式对外声明。网格弹出层需要以同样方式声明 `'grid'`（FR2）。                                                                                                                         |
| `MultiSelector.tsx` — 全选行是经由同一行渲染器渲染的哨兵选项；查询未匹配任何内容时的创建行是一个 `option`                                        | 系统铸造的行现在存在，将来也会存在。它们与其他行一样，只是 action 单元格为空（FR3）。                                                                                                                    |
| `hooks/useGridFocus.ts` — `columns: number`，固定；行与列按 DOM 顺序对每个单元格计算；`Calendar` 使用它                                          | 仓库的网格模型按固定列数垂直移动。每行恒为两个单元格，正是该模型无需计数遍历即可行走的形态（DEC-3）。                                                                                                    |
| `Selector.tsx` — 从搜索输入按 Tab 会到达弹出层内的清除控件，“保持弹出层打开”                                                                     | 今天 picker 面板内唯一的顺序停靠点，且它是组件自身的。action 不新增任何停靠点（FR5，AR3）。                                                                                                              |
| `SideNav/SideNavItem.tsx` — `actions?: ReactNode`；`Item.endContent` 文档：“badges, metadata, timestamps, or action buttons”                     | 行已经把其控件作为一个由调用方渲染、而行只负责放置的节点来接收。此处的 `action` 就是该约定，用单数是因为单元格只持有一个（DEC-1，DEC-3）。                                                               |

## Public API and concepts

| Concept                     | Closed values or states                                                                 | Meaning                                                                                                                                   | Default | Owner          | Stability |
| --------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------- | -------------- | --------- |
| `SelectorOptionData.action` | `ReactNode \| undefined`                                                                | 选项的次级控件，在 `Selector` 与 `MultiSelector` 中：一个由调用方渲染并命名的节点；宿主放置它。缺失与 `null` 含义相同：无。               | absent  | `spec:AST-058` | proposed  |
| `SearchableItem.action`     | `ReactNode \| undefined`                                                                | typeahead 家族条目上的同名同类型键，经由 `BaseTypeahead` 到达 `Typeahead` 与 `Tokenizer`。                                                | absent  | `spec:AST-058` | proposed  |
| the panel's role            | `listbox` → `grid`                                                                      | 在某个已声明选项携带 action 之前是 listbox；自那次渲染起是 grid，且组件保持挂载期间一直是 grid（FR2，DEC-5）。通过 `aria-haspopup` 声明。 | listbox | `spec:AST-058` | proposed  |
| a row                       | `row` with exactly two `gridcell`s                                                      | 选项——它今天渲染的一切——然后是它的 action。系统铸造的行有一个空的 action 单元格。                                                         | —       | `spec:AST-058` | proposed  |
| reaching an action          | pointer, touch, inline-end arrow + Enter, screen reader through `aria-activedescendant` | 所有受支持的模态；绝不单靠悬停、滑动或 Tab。                                                                                              | —       | `spec:AST-058` | proposed  |

action 单元格是在每个采用方的选项解剖中被命名的一个部件：一个由调用方用组件填充的渲染内容槽（`architecture:public-component-api` INV18）。

非公共：行与单元格的标记、活动后代的跟踪方式、action 列的宽度计算方式，以及由哪个 hook 遍历网格。

## Requirements

### Behavioral contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                      | Basis                                                                                                         | Verification state                         |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| FR1 | 选项把其次级控件作为 `action?: ReactNode` 携带，一个节点。该键在 `SelectorOptionData` 与 `SearchableItem` 上名称相同、类型相同。调用方渲染该控件，并拥有其名称、处理函数、禁用状态与外观；有多个动词的调用方渲染一个菜单触发器，由其所打开的弹出层拥有其余部分。宿主在 FR3 所述位置渲染该节点，且不得为了做任何判断而检查、克隆或包装它；检查它是否存在（FR2）不算检查。不存在由宿主拥有的 action 类型或组件。 | DEC-1，DEC-3，DEC-4；`SideNavItem.actions`，`Item.endContent`；`architecture:public-component-api` INV2，INV3 | 提议中；`main` 上无证据                    |
| FR2 | 弹出面板在某次渲染中，只要任何已声明的选项——处于分区的任意深度、在任何查询过滤它之前——携带了一个不为 `null` 或 `undefined` 的 `action`，就从那次渲染起成为 grid，并在组件挂载期间一直是 grid；在此之前它是 listbox。拥有该弹出面板的控件通过 `aria-haspopup` 声明当前生效的角色（`grid`；底部面板保持 `dialog`）。角色跟随过滤后视图、或切换回去的弹出面板是缺陷。                                             | DEC-2，DEC-5；`spec:AST-002` FR8，FR15                                                                        | 提议中                                     |
| FR3 | 在 grid 中，每个选项是一个 `role="row"`，携带选项的 id、`aria-selected` 与 `aria-disabled`，且每一行恰好有两个 `gridcell` 子元素：第一个持有该选项今天渲染的一切——选中标记或复选框、图标、标签、描述、`renderOption` 输出——第二个持有其 `action` 节点，未声明 action 时为空。组件铸造的行（全选、创建行）是同形的行，其 action 单元格为空。没有任何行只有一个单元格或三个。                                    | DEC-2，DEC-3；`useGridFocus` 固定列数                                                                         | 提议中                                     |
| FR4 | 激活 action 只运行调用方自己的处理函数，别的不做：选择不变，高亮行不因它而改变，面板既不关闭也不重新过滤。按压选项单元格的选择或切换与今天完全一致。选项的 `disabled` 只治理其选择；action 是否禁用是调用方控件自身的状态，宿主不读取它。                                                                                                                                                                      | `spec:AST-002` FR16，DEC-6                                                                                    | 提议中                                     |
| FR5 | Up 与 Down 与今天一样在行之间移动高亮，落在选项单元格上；行内末端箭头把它从选项单元格移到该行的 action 单元格，行内起始箭头再移回来，因此这些键在 RTL 下遵循视觉方向。在选项单元格上按 Enter 或 Space 与今天一样选择；在 action 单元格上按 Enter 或 Space 激活那里的控件。输入跳转、Home、End、PageUp、PageDown、Escape 与 Tab 保持当前含义。任何 action 控件都不在顺序 tab 顺序中。                           | 带 grid 弹出层的 APG combobox；`useGridFocus` 的 RTL 处理；`component:Selector` 的按键                        | 提议中                                     |
| FR6 | 持有焦点的元素——触发器、搜索输入或底部面板——上的 `aria-activedescendant`，在高亮位于选项单元格时引用该行，在位于 action 单元格时引用 action 的控件。它绝不引用用户无法操作的元素。                                                                                                                                                                                                                             | AR3；三个宿主中当前的 `aria-activedescendant` 接线                                                            | 提议中                                     |
| FR7 | 在 grid 中，分区是由其标题命名的 `rowgroup`，其标题与今天一样隐藏。分隔符与“无匹配”消息保持在可访问性树之外，正如 `Selector` 与 `MultiSelector` 已经保持的那样；`BaseTypeahead` 的消息（今天是一个 `option`）在所有模式下都变为呈现性的，并按 `spec:AST-056` AR1 的要求被播报。弹出层与底部面板渲染同一棵树。                                                                                                  | ARIA grid 必需的拥有元素；`spec:AST-056` AR1                                                                  | 提议中；`BaseTypeahead` 的消息今天存在分歧 |
| FR8 | action 在每个输入设备与每种指针类型下静止时都可见。宿主把调用方的控件放入 action 单元格，采用该单元格的尺寸与对齐，不在其上绘制自己的任何东西。悬停、聚焦或滑动都不显现任何东西。                                                                                                                                                                                                                              | `architecture:interaction-modality` INV4；`spec:AST-057` DEC-5                                                | 提议中；需要真实 Chromium 证据             |
| FR9 | `Selector`、`MultiSelector`、`Typeahead` 与 `Tokenizer` 采用本契约；后两者通过 `BaseTypeahead` 渲染的唯一面板采用。一个在自己拥有的 listbox 中渲染任一选项词汇、且尚未采用的宿主，不得在选项内部渲染 action；在它采用之前，它渲染不带 action 的选项，并在条目携带一个 action 时于开发环境发出警告。                                                                                                            | DEC-4；`spec:AST-002` FR15（绝不静默渲染损坏状态）                                                            | 提议中                                     |

### Accessibility contract

- **AR1 — 两种模式下树都有效。** listbox 只暴露 `option` 与 `group` 子元素，与今天一样。grid 只暴露 `row` 与 `rowgroup` 子元素，行的每个被暴露子元素都是 `gridcell`，面板中任何位置都不再保留 `option` 或 `listbox` 角色。绝不使用 `role="none"` 或 `role="presentation"` 包装层来让控件出现在选项旁边；无论 action 存在与否，必需子元素与必需父元素检查都通过。
- **AR2 — 名称保持分离。** 选项单元格的内容是该行的可访问名称；调用方的控件携带自己的名称，且不并入行的名称。没有可访问名称的控件是调用方的缺陷，也是宿主的开发警告。今天自身携带名称的 `MultiSelector` 行——部分选中的全选行——把名称保留在该行上。
- **AR3 — 每种模态都能到达 action。** 鼠标点击它，手指轻点它，键盘用行内末端箭头到达它并用 Enter 触发它，屏幕阅读器通过 `aria-activedescendant` 与该控件的名称被告知它的存在。没有任何路径依赖悬停、手势，或离开 combobox 的焦点。
- **AR4 — 选择语义不变。** `aria-selected` 从选项移到行上，含义与原来相同；`aria-multiselectable` 留在宿主上；用户切换选项时所听到的选择播报，不因为现在由 grid 承载而改变。

### Platform support

- 受支持的 feature/engine 下限：所有受支持的渲染器与浏览器；所用的角色是 ARIA 1.2，按键处理是已经发布的 combobox 模式。
- 不支持的行为：无。无法保持 AR1 的宿主不会部分采用；它保留其 listbox 与 FR9 的警告。
- 浏览器证据：FR1–FR7、FR9 与 AR1–AR4 是树、角色与事件主张，可在 jsdom 中证明，其中必需子元素与必需父元素规则由可访问性引擎针对渲染后的 DOM 检查。FR8 以及 action 列对其行的对齐是绘制主张，需要真实 Chromium 证据，包括 RTL。

## Current-state impact

- `SelectorOptionData` 与 `SearchableItem` 获得 `action?: ReactNode`。不导出新类型或组件。纯增量：对不声明它的调用方，已发布的 prop、默认值或行为都不变。扩展 `SearchableItem` 且已声明名为 `action` 的另一种类型成员的调用方，在升级时会遇到类型冲突；采用变更会在其兼容性说明中指明这一点。
- `component:Selector`（`current`）在采用落地时，作为引用本记录的本地概念获得该键与 grid 模式；`component:MultiSelector`、`component:BaseTypeahead`、`component:Typeahead` 与 `component:Tokenizer`（`draft`）引用它而非复制它。`component:MultiSelector` 的 FR9 / DEC-2 被撤回，改由此处的 FR3 与 AR1 承担。
- 查询未匹配任何内容时的创建行，在弹出面板为 grid 时是 FR3 下的系统铸造行；它自身的契约是 `spec:AST-056` DEC-3，此处不变。
- `architecture:public-component-api` 在本记录成为 `current` 时，在其 `deciding_specs` 中获得 `spec:AST-058`；不变式不变。
- `architecture:interaction-modality` 被读取，未改动；AR3 应用其 INV4 与 INV7。
- `spec:AST-057` 被读取，未改动。其滑动 action 是已声明的对象，而本记录的是节点，依据 DEC-1 中陈述的一条原则：渲染控件的组件需要对象；只放置控件的组件接收节点。
- `contributing:api-conventions` 获得一句话：组件渲染的控件以数据声明；组件只放置的控件是行自身数据上的节点，绝不是宿主上的 render prop。
- 五个采用方的使用方文档各获得该键与一个示例。
- 本记录自身合并时，已发布的公共 API 无变化。当本记录为 `draft` 时，其 `review-applicability:v1` 块不路由任何内容（`architecture:knowledge-contracts` INV20）。

## Verification

| Contract      | Verification                                                        | Representative states                                                                                                           | Mutation or failure expectation                                                                                          |
| ------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| FR1, FR9      | 逐采用方的 prop 表面与渲染套件；导出表面清单                        | 两套词汇上的 `action`；一个 `IconButton` 节点；一个普通 `Button` 节点；一个菜单触发器节点；一个被给到带 action 条目的非采用宿主 | 由宿主拥有的 action 类型或组件、数组类型的键、检查、克隆或包装该节点的宿主，或在选项内部渲染该控件的非采用宿主，均失败。 |
| FR2, DEC-5    | 跨多次重渲染的逐采用方角色套件                                      | 无该键；`action: null`；分区内一个带 action 的选项；一次把该选项过滤掉的查询；在后一次渲染中移除 action                         | 无已声明 action 却是 grid、有 action 却是 listbox、角色跟随过滤后视图、切换回 listbox，或 `aria-haspopup` 陈旧，均失败。 |
| FR3, AR1      | 两种模式下的树断言加必需子元素与必需父元素检查                      | 普通选项；分区；分隔符；空状态；全选；创建行；一个无 action 的行挨着一个有 action 的行                                          | 单元格数不是两个的行、grid 内的 `option`、grid 内的 `group`，或承载控件的 `none`/`presentation` 包装层，均失败。         |
| FR4           | 逐采用方的交互套件                                                  | 点击 action；点击选项单元格；禁用 action；被禁用选项配启用 action；单选与多选                                                   | 可归因于 action 的选择变化、高亮变化、面板关闭或重新过滤，或被选项 `disabled` 静音的 action，均失败。                    |
| FR5, FR6, AR3 | 逐采用方键盘套件，含 `aria-activedescendant` 断言；RTL 经方向提供器 | 下到某行；行内末端到其 action；Enter；行内起始返回；Escape；Tab；输入跳转；RTL 下同样；底部面板呈现                             | 面板内出现顺序 tab 停靠点、箭头无法到达 action、在 action 单元格按 Enter 却选中选项，或活动后代指向惰性元素，均失败。    |
| FR7           | 逐采用方的树与 live-region 套件                                     | 有标题与无标题的分区；搜索时的分隔符；各宿主中的空状态                                                                          | grid 内的 `group`、被暴露为子元素的分隔符或消息，或仍被暴露为 `option` 的 `BaseTypeahead` 消息，均失败。                 |
| FR8           | 静止、悬停、聚焦与 RTL 下的真实 Chromium 证据                       | 仅图标控件；文本控件；有 action 与无 action 的行；粗指针与细指针                                                                | action 静止时缺失、悬停时显现、与其行不对齐，或被宿主重绘，均失败。                                                      |
| AR2, AR4      | 可访问名称与选择断言                                                | 带具名控件的行；带未具名控件的行；部分选中的全选行；多选下切换                                                                  | 由控件标签命名的行、未具名控件缺少警告、全选行丢失名称，或选择播报改变，均失败。                                         |

已知验证缺口：上述套件在 `main` 上都不存在；没有组件实现该契约；仓库的可访问性模式契约覆盖 `listbox` 而不覆盖 `grid`。本记录是 `draft`，不治理审查，也不指定任何实现。

## Decision log

在所有者整体批准之前，`approved_by` 为 `null`，记录为 `draft`。

### DEC-1 — The action is one node on the option, because the host only places it

**Reference:** `spec:AST-058/DEC-1`

**Decider:** `cixzhang`, `<pending>`

选项上的 `action?: ReactNode`，由调用方渲染。

```tsx
options={[
  {
    value: 'eng',
    label: 'Engineering',
    action: <IconButton icon={<PencilIcon />} label="Edit Engineering" onClick={edit} />,
  },
  {value: 'design', label: 'Design'},
]}
```

选项是信息所在之处：哪些行有控件是关于该选项的事实，因此宿主在渲染任何东西之前检查 `action != null`，并在不调用任何东西的情况下决定自身结构（DEC-2），而无 action 的行不需要调用方写任何代码。

取节点而非已声明对象，依据一条与 `spec:AST-057` 共享的原则，后者取其另一面：**组件渲染某物之处需要对象；组件只放置某物之处，节点即可。** 滑动画板由组件绘制并动画，需要标签、变体，以及手势开始前该行是否离开，因此以声明形式给出。picker 行的 action 是调用方渲染的控件——其名称、处理函数、禁用状态与外观已经在调用方自己的按钮上——宿主把它放入一个网格单元格，除此之外不做别的。宿主无需事先知道任何信息，因此没有要声明的类型、没有随附的控件，也没有介于系统随附之物与调用方自带之物之间的层级。

该键为单数，因为单元格持有一个节点（DEC-3）。一个永远只能持有一个元素的数组会宣告一种并不存在的能力，而调用方会传入两个并在运行时撞上限。该上限不带来成本：有多个动词的调用方在节点中渲染一个菜单触发器，其所打开的弹出层拥有自己的键盘模型，因此单元格仍持有一个可聚焦控件。

一次形态测试让四组隔离的构建者仅拿到行为描述、不给 prop 名称，在每一次回忆探测中都收敛到 `{label, icon, onClick}` 的已声明数组，并无提示地否决了 render prop。这衡量的是构建者的预期；节点才是组件所需要的，因为组件本身不渲染该控件的任何部分。选项上的一个键是两者的共识。该报告由所有者保存在仓库之外。

否决：宿主上的 render prop——宿主若不逐行调用它，就无法区分“哪里都没有 action”与“一个对每一行都返回 `null` 的函数”，因而无法知道自身结构，最终由调用方替它防护。否决：已声明的 `OptionAction` 对象——那会让宿主渲染一个它没有理由拥有的控件，并附带一套 `variant` 词汇。否决：`actions: ReactNode[]`，以免日后规定单元格内移动时还得改键——`spec:AST-056` DEC-2 恰恰否决了这种投机性泛化，而 `spec:AST-017` 确立的弃用周期使 `action` 改为 `actions` 在需要那天成本很低。

### DEC-2 — The host is a grid once an option carries an action

**Reference:** `spec:AST-058/DEC-2`

**Decider:** `cixzhang`, `<pending>`

选项旁的控件不能是 listbox 子元素：`role="listbox"` 只允许 `option` 与 `group`。combobox 模式允许弹出面板为 `listbox`、`tree`、`grid` 或 `dialog`，因此 grid 保持触发器与搜索输入已经履行的契约——`aria-haspopup="grid"`、`aria-controls`、`aria-activedescendant`——并免费给键盘提供路径：Up 与 Down 与以前一样移动行，行内末端箭头到达 action。没有第二个界面、没有隐藏面板、没有 Tab 停靠点。

否决：围绕选项及其控件的 `role="none"` 包装层——`none` 会将其子元素重新归属到最近的已暴露祖先，于是控件直接落在 listbox 内部，同样违反必需子元素规则，即 `MultiSelector` 自身源码为其分隔符与空状态两次引用的那条规则。否决：在 listbox 之外用绝对定位放一列控件，各自位于其行的实测偏移处——有效，但它用一个针对缩放、重排与虚拟化挂载的位置同步循环，换取结构性修复。

### DEC-3 — Two fixed cells per row

**Reference:** `spec:AST-058/DEC-3`

**Decider:** `cixzhang`, `<pending>`

每一行有两个单元格：选项，然后是它的 action。无 action 的行第二个单元格为空。

grid 按固定列数遍历——仓库自身的网格 hook 正好按 `columns` 个单元格垂直移动，并按 DOM 顺序对每个单元格计算行——因此参差的行会破坏垂直移动。恒为两个单元格意味着无需计数遍历、无需逐行几何，普通选项、全选行与创建行之间也没有差别。网格只遍历到单元格，从不进入其内部，因此第二个单元格中调用方的节点不改变这些——且因为单元格只持有一个节点（DEC-1），其内部没有可规定的移动。

否决：每个控件一个单元格——行宽随数据变化，垂直移动会落在错误的列。

### DEC-4 — One key, one type, both option vocabularies; the typeahead family adopts through its one panel

**Reference:** `spec:AST-058/DEC-4`

**Decider:** `cixzhang`, `<pending>`

仓库从两种选项类型渲染 picker 面板。`SelectorOptionData` 由 `Selector` 与 `MultiSelector` 共享。`SearchableItem` 是 typeahead 家族的条目：`BaseTypeahead` 渲染它，`Typeahead` 与 `Tokenizer` 组合 `BaseTypeahead`，而面板显示的就是查询结果。第一种类型上的键能到达两个组件；typeahead 家族只有在其自身条目携带它时才能获得该能力。

因此同一键、同名同类型，在两处都声明。一个概念在拥有它的各组件中保持一个名称——`spec:AST-056` FR1 把该规则用于状态，此处用于声明。`SearchableItem` 已经携带来自某个来源的渲染节点（`element?`），所以来源给它的条目附加 action 节点是合乎其本性的；`createStaticSource` 原样透传它们。`BaseTypeahead` 是唯一的渲染器，因此采用它一次即覆盖 `Typeahead` 与 `Tokenizer`。

在自己的 listbox 中渲染 `SearchableItem` 的宿主——`ChatComposerInput` 的触发器菜单——在采用之前受 FR9 约束。`CommandPalette` 不是采用方：其行是复合子元素，其内部把 `SelectorOptionData` 的转换除 `value` 与 `label` 之外丢弃所有字段，所以两个声明都到达不了它渲染的行（见非目标）。

否决：为 typeahead 家族在宿主层提供函数 `getAction(item)`——即 DEC-1 排除的同一检测问题，现在落在唯一一个行异步到达的家族上。

### DEC-5 — The grid is conditional: detection reads the declared options and latches

**Reference:** `spec:AST-058/DEC-5`

**Decider:** `cixzhang`, `<pending>`

宿主依据被给定的选项决定其角色，且在任何查询过滤它们之前：任何选项，处于分区的任意深度，只要其 `action` 不为 `null` 或 `undefined`。缺失键与 `null` 值是一个状态——为每个选项写 `action: canEdit ? <Edit/> : null` 的调用方在多数行上得到 `null`，而这绝不能使它成为 grid。该检查是存在性；宿主绝不读取该节点。

宿主一旦成为 grid，就在挂载期间一直是 grid。`options` 稳定的 `Selector` 根本不会切换；选项在加载状态之后才到达的那种只切换一次，且在任何人读取面板之前。typeahead 的行是查询结果，因此按结果集决定角色会随用户输入而变化；该锁存把它限定为每个挂载实例一次切换，绝不回退。触发器的 `aria-haspopup` 随之变化。

否决：每个 picker 永久为 grid——所有现有用户会为一个单列列表听到“grid”，而水平箭头键将到达不了任何东西。否决：角色跟随每次渲染的过滤后视图——picker 随调用方过滤而改变角色，比两种模式中的任何一种都更糟。

## Open questions

无。一个单元格可持有多少控件由类型回答：一个节点（DEC-1，DEC-3）。单元格内移动不在本记录范围内。

## Content boundary

产出本记录的研究——形态测试的设计、提示词与评分——是报告而非契约，位于本记录之外，由所有者保管。

本记录不重复任何采用方的结构解剖、prop 表、主题化目标或使用方示例；不重复 `spec:AST-002` 中的准入论证；`spec:AST-017` 中的弃用与发布机制；`architecture:public-component-api` 中的共享命名语法；`architecture:interaction-modality` 中的模态不变式；`spec:AST-056` 中的搜索状态词汇；`spec:AST-057` 中的滑动手势；也不重复 `component:DropdownMenu` 中的菜单项数据契约。本记录链接到它们的规范所有者。
