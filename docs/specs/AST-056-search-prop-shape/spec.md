---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-056
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-02
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: [family:input-fields]
affects_contributing: [contributing:api-conventions]
affects_consumer_docs:
  [Selector, MultiSelector, Tokenizer, Typeahead, BaseTypeahead, CommandPalette]
review_triggers: [public-api, accessibility, compatibility]
---

# Search state vocabulary system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "public-api": [
      "FR1",
      "FR2",
      "FR3",
      "FR4",
      "FR5",
      "FR6",
      "FR7",
      "DEC-1",
      "DEC-2",
      "DEC-3",
      "DEC-4"
    ],
    "accessibility": ["AR1", "AR2"],
    "compatibility": ["FR7"]
  }
}
```

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一套词汇，而不是一种结构。“查询没有匹配到任何结果”是 `emptySearchText`，接受 `ReactNode`，出现在每一个具有该状态的组件上；“这里根本什么都没有”仍是 `emptyText`，两者永不合并（FR1、FR2、DEC-1）。一个离开查询就无法工作的能力，在自己的 prop 名称里说明这一点，而它的处理函数就是它唯一的开关（FR5、DEC-3）。不使用配置对象（DEC-2）。                                                                                                       |
| 行为          | 不变。由谁解析查询，取决于谁拥有这些选项，并且不按组件逐一重述：持有自己选项集合的组件自行过滤它们，并暴露一个布尔值来显示输入框；所呈现的选项**就是**查询结果的组件，接受一个必填的 `searchSource`（FR4、DEC-2）。                                                                                                                                                                                                                          |
| 最终用户影响  | 一个人在每个地方都会遇到同一个死胡同，也都能被提供同一种出路：把 `emptySearchResultsText` 放宽为 `ReactNode`，让产品可以在 `Tokenizer` 的空结果里放入一个链接或一行创建项，就像它已经能在 `Selector` 的空结果里做的那样。半配置的创建行不再静默地什么都不渲染（FR5）。调用方提供什么，被播报的就是什么（FR3、AR1）。                                                                                                                         |
| 构建者影响    | 只需学会一处重命名：`emptySearchResultsText` 变成 `emptySearchText`。没有 prop 移动，没有对象字面量，没有重构。每个已发布的 prop 在整个周期内都照常工作。                                                                                                                                                                                                                                                                                    |
| 兼容性/就绪度 | 并非纯增量，但规模很小：在三个组件上重命名一个 prop，并把其类型从 `string` 放宽为 `ReactNode`。没有必填 prop 移动。替代优先的周期及其代价见 `Migration and compatibility`；FR7 是唯一约束它的需求。权威：`draft`。仍有三个所有者问题未决；它们都不改变 FR1 或 FR2。                                                                                                                                                                          |
| 审查检查      | 否决为这些 prop 已表达的状态再起第二个名字；否决门控处理函数的布尔值；否决在同级 prop 缺失时渲染为惰性的能力；否决无法到达辅助技术的空状态值（AR1）；否决仅以占位符命名的查询输入框（AR2）。                                                                                                                                                                                                                                                 |
| 管辖规则      | [`spec:AST-002`](../AST-002/spec.md) FR1、FR4、FR15、FR16 以及 `spec:AST-002/DEC-1`、`DEC-6`，用于接纳与每个输入单一职责；[`architecture:public-component-api`](../../architecture/public-component-api.md) INV1、INV2、INV3、INV9，用于共享命名语法与已发布 API 生命周期；[`spec:AST-017`](../AST-017/spec.md) FR28–FR31，用于弃用与清理；[`family:input-fields`](../../families/input-fields.md)，用于查询输入框周边的字段外观，此处不变。 |

本表是一份审查投影；以下正文具有权威性。

## Intent

输入文字来缩小列表，是人会做的一件平常事，而 Astryx 把它拼成了七种写法。用过 `Selector` 上 `hasSearch` 的构建者，在 `Tokenizer` 上找不到 `hasSearch`；在 `Typeahead` 上设过 `emptySearchResultsText` 的构建者，在 `CommandPalette` 上看到的是 `emptySearchText`，类型还不一样。对使用产品的用户来说，没有什么坏了，但每一项新的搜索相关能力，都以又一个扁平 prop 的形式落在某个组件上，带着自己的名字，而下一个组件就照抄它碰巧读到的那个邻居。

本记录只负责一个答案：**为键入查询所产生的状态提供一套共享词汇，且不做任何重构。** 它固定“查询没有匹配到任何结果”的名称与类型，把该状态与“这里根本什么都没有”区分开来，并说明一个离开查询就无法工作的能力如何声明这层依赖。

更早的一版草稿提议把这些 prop 收集到一个对象取值的 `search` prop 中。DEC-2 否决了它：那会在七个组件上付出九次弃用的代价，其中四次针对必填 prop，只为解决一个整洁性问题，而不是使用 Astryx 产品的用户会遇到的问题。

触发点是 [#6829](https://github.com/meta/astryx/pull/6829)，它提议在 `MultiSelector` 上增加 `hasCreate` + `onCreate`——在一个已经带有三个搜索相关 prop 的组件上再加第六个和第七个，而所用的名字 `Tokenizer` 早已以另一套契约发布过。该 pull request 正被这条裁定阻塞，而它采用的形状，就是此后每个组件都会照抄的形状。

## Ownership boundary

**负责**

- 键入查询所产生的每个可观察状态的名称与类型，在所有具有该状态的组件之间共享。
- “查询没有匹配到任何结果”与“这里根本什么都没有”是不同名称下的不同状态，且两者互不吞并。
- 一个离开查询就无法工作的能力如何声明该依赖，以及由什么来门控它。
- 新提议的搜索相关 prop 是加入这套词汇，还是为它已经说过的东西引入第二个名字。
- 该安排对空结果消息与查询输入框名称必须保持的无障碍底线。

**为什么没有现有记录能容纳它**

- [`spec:AST-002`](../AST-002/spec.md) 是 `current` 且已批准，而一条记录只携带一个 `authority` 值，因此向其添加未批准的声明，就会把它们呈现为已批准（`architecture:knowledge-contracts` INV1、INV14）。它还负责另一项事实——公共 API 究竟是否被接纳——并且其 FR17 与 DEC-7 都以自己的话说明**组件 prop 与事件的命名保持独立**。关于组件 prop 的形状与名称的规则，在结构上超出了 AST-002 所声明的范围。本记录位于 AST-002 FR1 与 FR4 的下游：接纳仍然决定搜索能力是否存在，而本记录只决定它在何处被拼写。
- [`architecture:public-component-api`](../../architecture/public-component-api.md) 是 `current` 且已批准，存在同样的权威性问题。它持有共享命名语法（INV2），并通过 `deciding_specs` 链接其人工裁定——`spec:AST-002/DEC-1`、`spec:AST-005/DEC-1`、`spec:AST-012/DEC-1`。新的跨组件裁定属于它所链接的某条规格，而不是它内部；它自身的 INV18 边界把可观察的、调用方可见的行为留在产品契约中。
- [`family:input-fields`](../../families/input-fields.md) 是 `current`，负责其成员共享的字段外观——标签、状态、尺寸、主题化。本记录所约束的组件中有两个，`BaseTypeahead` 与 `CommandPalette`，并非其成员，也不是输入字段；`CommandPalette` 是一个对话框。它们不属于同一个兄弟家族，这正是这套词汇由本记录负责、而非由那份契约负责的原因。
- `contributing:api-conventions` 与 wiki 的 `Prop Naming` 小节记录了布尔值、回调、枚举、方向与 HTML 冲突方面的约定。它们对“一个状态在所有组件间保持一个名称”只字未提，而指南并不是权威记录。一旦本记录成为 `current`，两者都欠一次修正。
- 那六条组件记录将各自持有一份同一决策的私有副本，而 `architecture:knowledge-contracts` INV2 禁止这样做。`component:MultiSelector` 已在其 FR10 / DEC-3 中起草了这样一份副本。

## Non-goals

- **匹配质量。** 模糊匹配、排序、高亮、分词与变音符号折叠不在此裁定。FR4 只为组件自行过滤的那种模式确定底线。
- **任何特定组件是否应当获得搜索，或获得一行创建项。** 那属于 `spec:AST-002` 的接纳问题，需逐案处理。
- **`PowerSearch`。** 它的查询是结构化的 字段/运算符/值 表达式，而不是缩小列表的键入字符串。它的 `maxSearchResults` 与按字段的 `searchSource` 被引为扩散的证据，不受本记录管辖（OQ4）。
- **`CommandPalette` 上的 `emptyBootstrapText`。** “尚无查询，且默认集合为空”与“查询没有匹配到任何结果”是不同的可观察状态；它保持为顶层 prop。
- **`ChatComposerInput` 上的触发菜单配置。** 它的每个触发器对象各携带一个 `emptySearchResultsText`，因此 FR1 覆盖它们，但这次嵌套重命名是否搭乘本记录的周期，属于 OQ4。
- **内部过滤实现。** 只要满足本契约，等价的内部实现同样有效。内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议以及 CI 作业/工作流拓扑，属于架构或实现，除非调用方或互操作系统有意将该确切机制作为公共协议依赖。

## Evidence: every search-shaped prop in core today

阅读自本记录基准提交时的 `packages/core/src`。此表是 FR1–FR5 的证据；它不是迁移计划。

| 组件                | 查询输入存在的原因                         | 由谁解析查询                               | 占位符                                         | “没有匹配到任何结果”                                    | 调用方能否观察到查询                          | 创建能力                                        | 其他搜索相关 prop                                                |
| ------------------- | ------------------------------------------ | ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------------- | --------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------- |
| `Selector`          | `hasSearch?: boolean`——默认 `false`        | 该组件自身，在其自己的 `options` 上        | `searchPlaceholder?: string`——`'Search…'`      | `emptySearchText?: ReactNode`——`'No results found'`     | **否**——`searchQuery` 是内部 `useState`       | —                                               | `emptyText?: ReactNode`（`'No options'`，另一种状态）            |
| `MultiSelector`     | `hasSearch?: boolean`——默认 `false`        | 该组件自身，在其自己的 `options` 上        | `searchPlaceholder?: string`——`'Search…'`      | `emptySearchText?: ReactNode`——`'No results found'`     | **否**——`searchQuery` 是内部 `useState`       | `hasCreate` + `onCreate`，在 #6829 中**提议中** | `emptyText?: ReactNode`（`'No options'`）                        |
| `Tokenizer`         | `searchSource: SearchSource<T>`——**必填**  | 调用方的 source                            | `placeholder?: string`——输入框本身就是控件     | `emptySearchResultsText?: string`——`'No results found'` | `onChangeQuery?: (query: string) => void`     | `hasCreate?: boolean`——**组件自行铸造 token**   | `minQueryLength?: number`（`1`）、`debounceMs?: number`（`150`） |
| `Typeahead`         | `searchSource: SearchSource<T>`——**必填**  | 调用方的 source                            | `placeholder?: string`                         | `emptySearchResultsText?: string`                       | `onChangeQuery?: (query: string) => void`     | —                                               | `minQueryLength?: number`、`debounceMs?: number`                 |
| `BaseTypeahead`     | `searchSource: SearchSource<T>`——**必填**  | 调用方的 source                            | `placeholder?: string`                         | `emptySearchResultsText?: string`                       | `onChangeQuery?: (query: string) => void`     | `__queryEntries`——带下划线，`@internal`         | `minQueryLength?: number`、`debounceMs?: number`                 |
| `CommandPalette`    | `searchSource: SearchSource<T>`——**必填**  | 调用方的 source                            | `CommandPaletteInput.placeholder`——`'Search…'` | `emptySearchText?: ReactNode`——`'No results'`           | 通过 `input` 插槽的 `value` / `onValueChange` | —                                               | `emptyBootstrapText?: ReactNode`（`'Type to search'`）           |
| `ChatComposerInput` | `triggers[]` 中每个条目一个 `searchSource` | 调用方的 source，按触发器逐个              | —（输入器自身的 `placeholder`）                | `triggers[].emptySearchResultsText?: string`            | —                                             | —                                               | `triggers[].loadingText`、`triggers[].menuLabel`、`debounceMs`   |
| `PowerSearch`       | 结构化的过滤表达式，而非键入查询           | 调用方的按字段 `searchSource?`（值选择器） | 内部（`@astryx.powersearch.placeholder`）      | —                                                       | —                                             | —                                               | `maxSearchResults?: number`                                      |

那张表里能看到四条漂移轴线，每一条都是某个人独自做出的单独决策：

1. **“没有匹配到任何结果”有两个名字：** `Selector`、`MultiSelector` 与 `CommandPalette` 上是 `emptySearchText`；`Typeahead`、`BaseTypeahead`、`Tokenizer` 以及每个 `ChatComposerTrigger` 上是 `emptySearchResultsText`。
2. **同一条消息有两种类型：** 前一组是 `ReactNode`，后一组是 `string`。能向一个组件传递元素的构建者，无法向它的邻居传递。
3. **它有三个默认值：** `'No results found'`、`'No results'`，以及——因为 `Selector` 与 `MultiSelector` 还带有顶层 `emptyText`——相邻状态的 `'No options'`。
4. **前缀只出现在搜索可选的地方。** `Selector` 与 `MultiSelector` 写 `searchPlaceholder`，因为它们还有一个触发器占位符；`Typeahead` 与 `Tokenizer` 写 `placeholder`，因为查询输入框*就是*那个控件。两者在各自局部都是对的，而这恰恰是没有任何组件会自行修好它的原因。

在 core 之外，`packages/lab` 已经复制了这种漂移：`TransferList` 接受 `hasSearch` + `searchPlaceholder` + `searchLabel`，而 `ChatEmojiPicker` 接受 `searchLabel`。Lab 不是稳定的公共承诺，因此本记录不管辖它；它是这种模式靠复制而扩散的证据。

### Two prior claims about prior art, corrected

- **`searchConfig` 不是组件 prop，也不是这种形状的先行技术。** 它是 `Table/plugins/filtering/useTableFiltering.tsx` 中的一个参数与插件配置字段，持有一个 `PowerSearchConfig`——即过滤构建器的结构化 字段/运算符/值 配置。它配置的是另一个概念。
- **本仓库中这种形状真正的先例是 `ChatComposerTrigger`。** `ChatComposerInput` 的 `triggers[]` 中每个条目都是一个对象，携带 `searchSource`、`renderItem`、`onSelect`、`emptySearchResultsText`、`loadingText` 与 `menuLabel`——把一个触发器的查询的整套配置放在一个值里，其键大多省略了外围名称已经提供的那个前缀。它有效，已发布，而且没有人要求把它拍平。

## Public API and concepts

| 概念                   | 封闭取值或状态                           | 含义                                                                        | 默认值             | 负责方         | 稳定性 |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------------------- | ------------------ | -------------- | ------ |
| `emptySearchText`      | `ReactNode`                              | 查询没有匹配到任何结果时组件所显示的内容。到处只有一个名称、一个类型（FR1） | 按组件而定         | `spec:AST-056` | 提议中 |
| 显示输入框             | 一个布尔值，或一个必填的 `searchSource`  | 持有自己选项的组件暴露一个布尔值；其选项**就是**结果的组件接受一个 source   | 按组件而定         | 该组件         | 已发布 |
| 仅在有查询时存在的能力 | 名称表明它需要查询的处理函数             | 处理函数的存在即为开关；旁边没有布尔值（FR5）                               | 缺省               | `spec:AST-056` | 提议中 |
| “完全没有选项”         | 组件自身的顶层 `emptyText`               | 与“查询没有匹配到任何结果”不同的可观察状态；本记录不改变它                  | 组件的本地化默认值 | 该组件         | 稳定   |
| 抓取调优               | `minQueryLength`、`debounceMs`、加载文案 | 不由本记录安置；它们属于执行抓取的一方，而 OQ5 询问它们是否移入内部         | 按组件而定         | 该组件         | 稳定   |

## Requirements

### Behavioral contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                               | 依据                                                                         | 验证状态                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------------------------- |
| FR1 | 在每个带键入查询的组件上，一个可观察状态只有一个 prop 名称和一个类型。“查询没有匹配到任何结果”是 `emptySearchText`，接受 `ReactNode`。`emptySearchResultsText` 归并到它，其 `string` 类型被放宽，因此调用方可以传入元素。任何组件都不得以不同方式命名或定型该状态。                                                                                                  | DEC-1；`architecture:public-component-api` INV2                              | 提议中；`main` 上无证据           |
| FR2 | “查询没有匹配到任何结果”与“组件完全没有被提供选项”是不同状态，必须能以不同名称分别表达：`emptySearchText` 与 `emptyText`。`Selector` 与 `MultiSelector` 已经声明了两者，因此任何一个名称都不得吞并另一个；只提供一个名称的组件，仍必须使用与其所指状态相符的名称。                                                                                                   | DEC-1；`spec:AST-002` FR16                                                   | 提议中；行为已发布，但未被规定    |
| FR3 | 调用方为空状态提供的任何内容，必须以视觉与非视觉两种方式同样传达给操作该组件的用户。会播报该状态的组件必须播报它实际渲染的内容。渲染调用方的元素却播报内置默认值，是缺陷，而不是回退。                                                                                                                                                                               | AR1；`architecture:interaction-modality`                                     | 提议中；`main` 上有缺陷（见 AR1） |
| FR4 | 由谁解析查询，取决于谁拥有这些选项，并且不按组件逐一重述。持有自己选项集合的组件自行解析查询，至少按每个选项所显示标签做不区分大小写的匹配，并暴露一个布尔值来开启查询输入框。所呈现的选项**就是**查询结果的组件，接受一个必填的 `searchSource`。两类组件都到达相同的可观察状态：缩小后的列表、空结果，以及 `emptyText`。                                            | DEC-2；`spec:AST-002` FR16                                                   | 提议中；行为已发布，但未被规定    |
| FR5 | 离开键入查询就无法工作的能力，必须恰好有一个开关，并且必须通过组件的主变更回调报告，携带一个说明变更种类的描述符，而不是通过它自己的处理函数 prop。调用方绝不能表达出一种什么都不渲染、也什么都不报告的配置——`hasCreate && hasSearch && onCreate != null` 在任一片段缺失时正是允许了这种配置。在没有查询输入的组件上启用它，必须在开发环境给出警告，而不是静默失败。 | DEC-3；`spec:AST-002` FR15（绝不静默渲染破损状态）                           | 提议中；`main` 上无证据           |
| FR6 | 新的搜索相关能力，要么依据本记录在 `spec:AST-002` 下被接纳，要么根本不被接纳。名称中带有 `search` 一词的新顶层 prop，必须用本记录所固定的词汇来命名它所管辖的状态或能力，且不得为这些 prop 中某个已表达的状态引入第二个名称。                                                                                                                                        | DEC-4；`spec:AST-002` FR1、FR5、DEC-1                                        | 提议中；`main` 上无证据           |
| FR7 | 本记录重命名的每个 prop 都是有使用方受损的已发布公共表面，因此必须遵循 `spec:AST-017` FR28–FR31：替代项先发布，旧用法在重叠期内保持等价，移除发生在已声明的小版本中，并附上点名替代项的 `[breaking]` Changeset。两者并存期间，同时收到两者的组件必须解析到新 prop，并必须触发开发警告。                                                                              | `architecture:public-component-api` INV9；`spec:AST-017` FR1、FR3、FR28–FR31 | 提议中；周期尚未开始              |

### Accessibility contract

- **AR1 — 空结果消息按书写原样到达辅助技术。** `emptySearchText` 在屏幕上渲染的任何内容，必须就是面板变空时屏幕阅读器收到的内容。今天并非如此：`Selector` 与 `MultiSelector` 播报的是 `typeof emptySearchText === 'string' ? emptySearchText : t('@astryx.selector.emptySearchResults')`，因此传入元素的调用方——`ReactNode` 类型正是邀请这么做——会被静默播报默认字符串，而不是自己的消息。接受 `ReactNode`（FR1）即要求组件从中推导出一个可播报的字符串，或记录并要求一个单独的可播报形式；它不得播报屏幕上的人并未在读的内容。
- **AR2 — 查询输入框具有不是其占位符的无障碍名称。** 占位符就是占位文本，绝不能成为输入框唯一的无障碍名称。名称由组件提供：`Selector` 与 `MultiSelector` 中本地化的“搜索选项”，以及 `CommandPaletteInput` 中本地化的“搜索命令”。

### Platform support

- 支持的功能/引擎底线：每个受支持的渲染器与每个受支持的浏览器。这里没有任何东西位于能力检测之后。
- 不支持的行为：无。无法满足 FR3 的必填/可选规则的组件，不会部分采用该 prop；在规则对其确定之前，它保持当前的 API。
- 浏览器证据：DOM 实时区域断言证明了所渲染内容的来源，但它们并不证明辅助技术播报什么、何时播报。任何改变播报内容或时机的采用方，都要在 DOM 与无障碍树层面证明其路由、文本与场合计数；真实辅助技术观察是 `spec:AST-009` 下建议的后续工作。

## Migration and compatibility

这并非纯增量，且代价集中在一处。

**已发布、且有使用方受损的部分。** 七个核心组件上的九个公共 prop：`Selector` 与 `MultiSelector` 上的 `hasSearch`、`searchPlaceholder` 与 `emptySearchText`；`Tokenizer`、`Typeahead` 与 `BaseTypeahead` 上的 `searchSource` 与 `emptySearchResultsText`；`CommandPalette` 上的 `searchSource` 与 `emptySearchText`；三个 typeahead 上的 `onChangeQuery`；`Tokenizer` 上的 `hasCreate`；每个 `ChatComposerTrigger` 上的 `emptySearchResultsText`。根据 `spec:AST-017` FR1 与 FR3 以及 `architecture:public-component-api` INV9，移除或重新定型其中任何一项都是破坏性变更。

**没有任何必填项被移动。** 更早的一版草稿会把 `Tokenizer`、`Typeahead`、`BaseTypeahead` 与 `CommandPalette` 上**必填**的 `searchSource` 折进一个对象，从而让这四个组件的每个现有调用点在类型检查时失败。DEC-2 否决了它，因此整个迁移现在只是在一个可选 prop 上、于四个表面重命名，并放宽其类型。

**本记录的建议：以替代优先的周期进行弃用。** 不是无限期共存，也不是直接替换。

- 一个补丁在每个重命名的组件上发布 `emptySearchText`，同时旧 prop 继续工作、带有 `@deprecated` 并点名其替代项，行为与之前完全一致（`spec:AST-017` FR28、FR29）。重叠期间组件同时读取两者，新 prop 胜出，并在冲突时给出一次开发警告（FR7）。
- 移除发生在之后已声明的小版本中，并附上点名替代项的 `[breaking]` Changeset（`spec:AST-017` FR31）。本记录不设定时钟；FR30 禁止把发布节奏读作时钟。
- 传入 `string` 的调用方除了名称之外无需任何修改：类型只是放宽，因此每个现有值仍然有效。

**每种选项的实际代价。**

- **带周期地弃用（推荐）。** 在重叠期内，`Tokenizer`、`Typeahead`、`BaseTypeahead` 与 `ChatComposerTrigger` 上有一个 prop 成对出现：`emptySearchResultsText` 与 `emptySearchText` 都出现在类型中、都出现在 `.doc.mjs` 中、都出现在使用方文档中。四条 `DEP-*` 记录与四个 `CLN-*` id。这次重命名可机械地用 codemod 完成，包括调用方展开 props 的地方，因为值的含义不变，类型只是放宽。随后一个次要版本会破坏这四个表面上未迁移的调用点。
- **无限期共存。** 永远不会破坏任何东西。漂移在类型签名中存续：构建者在某个组件上仍会遇到 `emptySearchResultsText`，在另一个组件上遇到 `emptySearchText`，而标准只管辖在其之后构建的组件。这回答了“所以当我们后来在其他组件上加它时，就对齐这个模式”，却把今天的不一致留在原地。
- **直接替换。** 一个没有任何重叠的、执行重命名的小版本。已否决：弃用在这里代价很小，也没有任何用户问题足以证成破坏调用点，而一个周期本可以承载它们。

**`Tokenizer.hasCreate` 无需迁移。** 更早的一种读法把它当作冲突，因为 `Tokenizer` 的 `hasCreate` 是一个没有回调的布尔值，而 #6829 为 `MultiSelector` 提议了一个处理函数。OQ5 以另一种方式裁定：`Tokenizer` 自行铸造 token，并通过 `onChange(items, {item, type: 'create'})` 报告它，这恰好是 DEC-3 所描述的形状，因此 `Tokenizer` 已经符合，什么也不用改。当 #6829 回来时，`MultiSelector` 会收敛到它。

## Current-state impact

- 当本记录成为 `current` 时，`architecture:public-component-api` 会在其 `deciding_specs` 中获得 `spec:AST-056`，并在其 `Deciding specs` 列表中增加一行。该记录的任何不变式都不改变：FR1–FR7 位于其 INV2、INV3 与 INV9 语法之内，而不是对其修正。
- `contributing:api-conventions` 与 wiki 的 `Prop Naming` 小节将获得状态命名规则：一个可观察状态在每个具有它的组件上只有一个 prop 名称和一个类型，新 prop 不得为现有 prop 已表达的状态引入第二个名称。今天这两个表面都没有对此作出规定。
- `component:Selector`、`component:MultiSelector`、`component:Tokenizer`、`component:Typeahead`、`component:BaseTypeahead` 与 `component:CommandPalette` 引用本记录，而不是各自记录一份私有副本。`component:MultiSelector` 是 `authority: draft`，并且正在起草的正是这样一份副本；该声明撤回，让位于此处的 FR5 与 FR6。
- [#6829](https://github.com/meta/astryx/pull/6829) 被这条裁定阻塞。它的 `hasCreate` + `onCreate` 组合被 FR5 否决，FR5 以单独的 `hasCreate` 接纳同样的用户需求，并通过组件现有的 `onChange` 报告，携带一个点名创建行为的描述符——即 `Tokenizer` 已经发布的形状——因此该能力无法被半配置，一个词也不会承载两套契约。
- `family:input-fields`、`spec:AST-002` 与 `spec:AST-017` 只被阅读，不被修改：字段外观、接纳与弃用生命周期仍归其所有者。
- 本记录自身合并时不改变任何已发布的公共 API。在每个采用变更落地之前，每个组件都保留每个 prop 与每个默认值。
- 当本记录处于 `draft` 时，它的 `review-applicability:v1` 块不路由任何东西：全局路由只加载 `current` 声明（`architecture:knowledge-contracts` INV20）。它在获批后生效。

## Verification

| 契约      | 验证                                                                  | 代表性状态                                                                           | 变更或失败预期                                                                                          |
| --------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| FR1、FR2  | 每个采用方的 prop 表面套件，加上仓库的导出表面与 `.doc.mjs` prop 检查 | 每个采用方所声明的 prop；从包入口点导入的导出对象类型                                | 名称带有 `search` 的顶层 prop、重复前缀的键，或未导出的对象类型，即失败。                               |
| FR3       | 每个采用方的渲染套件                                                  | `search` 缺失；`search={{}}`；在需要它的组件上省略 `search`                          | 在 prop 缺失时仍渲染出查询输入框、残留的查询状态，或与组件是否持有选项相矛盾的必填/可选声明，即失败。   |
| FR4       | 两种模式下每个采用方的套件                                            | 无 `source`，且组件持有选项；提供 `source`；每种模式下都有一个匹配不到任何结果的查询 | 两种模式之间出现不一致的可观察状态，或组件对 `source` 返回的结果重新过滤，即失败。                      |
| FR5、AR1  | 每个采用方的套件加上其实时区域断言                                    | 字符串 `emptyText`；元素 `emptyText`；相邻的“完全没有选项”状态                       | 名称或类型不同的键，或播报没有携带元素所渲染内容的，即失败。这就是 AR1 今天在 `main` 上指出的缺口。     |
| FR6、FR7  | 类型层检查加上每个采用方的套件                                        | 在 `search` 存在时提供 `onCreate`；在 `search` 缺失时提供 `onCreate`                 | 不经过搜索就能触达的创建能力、门控处理函数的布尔值，或静默失效的配置，即失败。                          |
| FR8       | 每个采用方的套件                                                      | 键入；清空；程序化变更                                                               | 抑制组件自身解析的回调，或要求该回调的组件，即失败。                                                    |
| FR9       | 每个采用方上的重叠套件，加上已声明层级 Changeset 检查                 | 仅旧 prop；仅新键；两者都提供；两者都不提供                                          | 旧用法改变行为、旧 prop 静默胜出、缺失 `DEP-*`/`CLN-*` 配对，或移除未出现在冻结的小版本清单中，即失败。 |
| FR10、AR2 | 依据本记录进行公共 API 审查；每个采用方的无障碍名称断言               | 提议的搜索新能力；每个采用方的查询输入框，有名称与无名称                             | 接纳新的顶层 `search*` prop，或查询输入框唯一的名称是其占位符，即失败。                                 |

已知验证缺口：上述套件在 `main` 上一个都不存在，也没有任何组件实现 `search`。本记录是 `draft`，不管辖审查，也不点名任何实现。AR1 另外记录的是当前已发布行为中的一个缺陷，而不是一条通过的契约。

## Decision log

以下每项决策均由 `cixzhang` 于 2026-10-02 在本记录的 pull request 上裁定。

### DEC-1 — One name and one type for "the query matched nothing"

**Reference:** `spec:AST-056/DEC-1`

**Decider:** `cixzhang`, `2026-10-02`

`emptySearchText`，接受 `ReactNode`，处处如此。

这正是触及了人的那种漂移。在同一款产品里搜索 `Selector` 和 `Tokenizer` 的人，会遇到同一个死胡同，而今天这两个组件连该叫它什么都无法一致，更不用说调用方可以往里放什么。`Selector`、`MultiSelector` 与 `CommandPalette` 说 `emptySearchText` 并接受 `ReactNode`；`Tokenizer`、`Typeahead`、`BaseTypeahead` 与 `ChatComposerInput` 说 `emptySearchResultsText` 并接受 `string`——因此同一款产品无法在两者中都提供同一行“没有结果，试试 X”，而学会了一个组件的构建者还得再去发现另一个。

这个名称朝向 `emptySearchText` 而不是更短的名字，理由是承重的：`Selector` 与 `MultiSelector` 已经同时声明了 `emptyText` 与 `emptySearchText`，对应两句确实不同的话——“这里根本什么都没有”与“没有东西匹配你所键入的内容”。把搜索状态的名称缩短，就会与一个含义是另一件事的已发布 prop 在这两个搜索表面最大的组件上相撞。因此三个组件朝向多数拼法重命名，而不是七个组件背离它重命名。

类型朝向 `ReactNode`，而不是朝向 `string`。死胡同恰恰是产品想要放链接、插图或创建能力的地方，而收窄那四个已经允许这么做的组件，会为了赢得一致性而移除一项已发布能力。放宽另外三个，才让产品能在每个地方提供同一个死胡同，而这正是就名称达成一致的全部意义。

### DEC-2 — No `search` configuration object

**Reference:** `spec:AST-056/DEC-2`

**Decider:** `cixzhang`, `2026-10-02`

本记录更早的一版草稿提议把每个搜索相关 prop 收集进一个对象取值的 `search` prop，以 `placeholder`、`emptyText`、`onChange` 与 `onCreate` 作为键。已否决。

这个对象解决的会是整洁性，而不是使用 Astryx 产品的人会遇到的任何东西。三个扁平 prop 并不难传，而下面的调查显示仓库没有任何已确立的约定可供援引：core 中每个 `*Config` 对象配置的都是一个 Hook，而仅有的对象取值组件 prop 是 `collapsible` 与 `button`。

与此相对，代价是具体的。九个已发布 prop 将进入弃用周期，其中四个是**必填**的 `searchSource`，会在清理小版本中破坏四个组件的每个调用点。`ComplexSelector` 会拿到一个只有一个有意义键的 `search` 对象，因为它拥有自己的内容。而自动补全变得更糟而不是更好：在组件的标签列表里键入会立即展开扁平 prop，而 `search={{` 必须先被知道才存在。

漂移真正需要的是一套共享词汇，DEC-1 与 FR6 在不重构任何东西的情况下就给出了它。

### DEC-3 — A query-only capability is enabled by a boolean and reported through the existing change callback

**Reference:** `spec:AST-056/DEC-3`

**Decider:** `cixzhang`, `2026-10-02`

只在查询存在时才存在的能力——从没有匹配到任何结果的文字中创建一个值——由单个布尔值启用，并通过组件的主变更回调报告，携带一个说明这是哪一类变更的描述符。

`Tokenizer` 已经这么做：`hasCreate` 打开那一行，而 `onChange(items, change)` 在 `'add'`、`'remove'` 与 `'reorder'` 之外报告 `{item, type: 'create'}`。调用方在它已经为其他每种变更监听的通道上得知一次创建，而且什么都不可能被半配置，因为只有一个开关。

这条裁定排除的形状是一个布尔值与一个处理函数互相门控，而这正是 `hasCreate && hasSearch && onCreate != null` 所产生的结果：三种半设置的方式，每一种都什么都不渲染、什么都不报告、也什么都不警告。构建者设了布尔值，看不到创建行，也没有任何办法知道为什么。

一个其值不携带所创建对象的组件——`MultiSelector` 把 `options` 与 `value: string[]` 分开持有——会把下一个值与创建一起报告，因此调用方在一次更新中同时添加选项并接受值。那项义务属于调用方，并且必须在能力落地之处写明；它并不证成为同一能力另设一种形状。

布尔值无法防止的一种情况，是在查询输入框已关闭的组件上启用创建。那会在开发环境警告（FR5），而不是静默地什么都不渲染。

### DEC-4 — The vocabulary is fixed; new capabilities join it

**Reference:** `spec:AST-056/DEC-4`

**Decider:** `cixzhang`, `2026-10-02`

下面调查中的每个 prop 都是一个合理的局部决策。漂移来自每一个都独自做出：一个状态两个名字、一个名字两种类型、lab 里的 `searchLabel`、某个组件上的 `maxSearchResults`。

因此标准是一套词汇，而不是一种结构。新的搜索相关 prop 用本记录所固定的词语来命名其状态，并且不为现有 prop 已经说过的某样东西引入第二个名字。这在审查中可检查，而无需任何人重构组件。

## Open questions

- **OQ1 — 已回答。两个概念，按谁拥有选项来划分。**（`human-api`）

  `cixzhang`，2026-10-02：持有自己选项的组件接受 `search` 对象；其选项来自调用方的组件保留 `searchSource`。共享的匹配规则与 `createStaticSource` 表明两者可以统一，但统一会使 `source` 成为四个组件上一个本来可选的对象中的必填成员，并会为了对其调用方毫无收益而移动一个已发布的必填 prop。FR1 与 FR4 记录了这种划分，DEC-1 承载了理由。

- **OQ2 — 已回答。带周期地弃用。**（`human-api`）

  `cixzhang`，2026-10-02：`emptySearchResultsText` 被标记为 `@deprecated` 并指向 `emptySearchText`，两者在重叠期内都工作，移除发生在 `spec:AST-017` FR28–FR31 下的之后一个小版本中。代价是三个组件上有一个成对的 prop，而这正是 FR7 已经描述的内容——远小于被否决的对象形式本会带来的九对。这次重命名即使调用方展开 props 也可用 codemod 完成，因为值的含义不变，类型只是放宽。

- **OQ3 — 已回答。不。**（`human-api`）

  `cixzhang`，2026-10-02：作为本记录的一部分，观察查询不会在 `Selector` 或 `MultiSelector` 上成为公共能力。`searchQuery` 在两个组件上仍是内部状态。需要基于查询采取行动的调用方，得到的是一项点明其用途的能力——下面所述的创建——而不是一条原始查询流，然后还得围绕它重新实现组件自身的行为。

- **OQ4 — 已回答。三个采用方；其余只受 FR1 管辖。**（`human-api`）
  `cixzhang`, 2026-10-02：`Selector`、`MultiSelector` 和 `ComplexSelector` 正是原本会放置 `search` 对象的地方，因此它们是本记录最直接涉及的组件；在对象被否决（DEC-2）之后，这一区别基本消解。`Tokenizer`、`Typeahead`、`BaseTypeahead`、`CommandPalette` 和 `ChatComposerInput` 保留 `searchSource`，并受 FR1（“查询没有匹配到任何内容”只有一个名字、一种类型）与 FR6（不为这些 props 已经表达的状态另起名字）约束。`PowerSearch` 仍被引用并排除在外：结构化的字段/操作符/值表达式不是对列表的类型化查询。

- **OQ5 — 已答复。一项能力，一个布尔值加一个变更描述符。** (`human-api`)

  `cixzhang`, 2026-10-02：创建式可供性由一个布尔值启用，并通过组件既有的变更回调上报，回调携带一个说明本次变更是一次创建的描述符。没有单独的处理函数 prop，也没有 `create` 配置对象。

  `Tokenizer` 已经是这样工作的：`onChange(items, change)`，其中 `change` 是 `{item, type: 'create'}`，与 `'add'`、`'remove'` 和 `'reorder'` 并列。

  `MultiSelector` 可以用同样的方式上报——下一个值连同指明所创建查询的描述符——因此调用方在一次更新中既添加选项又接受该值，并在它已经为其他所有选择变更监听的通道上得知创建的发生。

  这取代了此处早先的一个答复：该答复把两者视为需要不同形态的不同能力，理由是 `MultiSelector` 将 `options` 与 `value: string[]` 分开，因而无法像 `Tokenizer` 铸造 token 那样铸造一个选项。这一差异确实存在，但并不强制要求一个单独的处理函数：把值和创建一起上报，正是描述符的用途所在。因此 `hasCreate` 在两个组件中含义一致，这是把 FR1 的规则应用于动词而非状态。

  契约还欠两件事，且应在该能力落地之处而非在此处解决：描述符作为公共类型的形态，以及调用方添加所创建选项的义务——`Tokenizer` 没有这种义务，因为它的值本身就携带该对象，而一个 `MultiSelector` 调用方若接受了值却不添加选项，就持有一个匹配不到任何东西的 id。

  `minQueryLength`、`debounceMs` 和触发菜单的 `loadingText` 保持原位。它们描述的是抓取，而抓取只在调用方拥有选项的地方存在，本记录也不重排已发布的 props。

## Content boundary

本记录不重复任何组件的结构、prop 表、主题化目标或使用方示例；`spec:AST-002` 中的准入论证；`spec:AST-017` 中的弃用、清理和发布清单机制；`architecture:public-component-api` 中的共享命名语法；`family:input-fields` 中的字段外壳；以及各组件自身记录所拥有的匹配、防抖和取消行为。它链接它们的权威所有者。
