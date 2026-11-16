---
schema_version: 3
template_version: 7
kind: component
id: component:Table
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-03
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    apps/storybook/stories/Table.stories.tsx,
    packages/core/src/Table/Table.test.tsx,
    packages/core/src/Table/__tests__/TableScroll.a11y.chromium.spec.ts,
    packages/core/src/Table/__tests__/Table.a11y.test.tsx,
    packages/core/src/Table/__tests__/Table.a11y.chromium.spec.ts,
    packages/core/src/Table/Table.perf.test.tsx,
    packages/core/src/Table/TableRowContext.test.tsx,
    packages/core/src/Table/plugins/rowIndex/useTableRowIndex.test.tsx,
    packages/core/src/Table/plugins/selection/useTableSelection.test.tsx,
    packages/core/src/Table/plugins/sortable/useTableSortable.test.tsx,
    packages/core/src/Table/plugins/sortable/__tests__/useTableSortable.a11y.test.tsx,
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.test.tsx,
    packages/core/src/Table/plugins/rowExpansion/useTableRowExpansion.glide.test.tsx,
    packages/core/src/Table/__tests__/TableRowGlide.a11y.browser.spec.ts,
    packages/cli/foundation/discovery/theming-targets.test.mjs,
    packages/cli/api/theme/targets/targets.test.mjs,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules:
  [
    module:Table/useTableActivation,
    module:Table/useTableRowExpansion,
    module:Table/useTableTreeData,
    module:Table/useTableInfiniteScroll,
    module:Table/useTableRowStatus,
    module:Table/useTableRowsVirtualization,
    module:Table/useTableColumnsVirtualization,
    module:Table/useTableColumnResize,
  ]
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:icon-resolution-and-component-slots,
  ]
contributing: []
system_specs: [spec:AST-025]
---

# Table component contract

## Contract at a glance

| 领域          | 合约                                                                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共合约      | 共享插件协议暴露可选的不可变渲染上下文、已声明的行模型/整行所有权，以及一个可观察的 `renderState` 源，其加载/可用性快照不可变。`Table.virtualization` 接受不透明的行能力或列能力，或两者的列表，需配合数据与显式 `idKey`。              |
| 行为          | Table 校验单一规范身份，接纳兼容的扁平行组合，在单元格构建之前规划窗口，并协调单一视口、逻辑行序列与绘制解析。                                                                                                                          |
| 最终用户影响  | 行激活仍与选择相互独立；已加载的行保留状态与焦点，大型扁平表在不改变原生表格语义的前提下约束挂载的工作量。                                                                                                                              |
| 构建者影响    | 不使用新能力的既有用法保持不变。开窗要求显式身份与固定高度布局；任意的行/详情/树输出不会静默进入受支持的模式。                                                                                                                          |
| 兼容性/就绪度 | 选择性启用的协议新增项在未启用时保留旧有行键与相对于 body 的 ARIA。新能力在发布前需要其实现以及浏览器/性能验证。`table-sort-indicator`（FR5）与 `table-row-expand`（FR7）图标槽位是新增的、当前的，尚待实现；没有主题条目时，输出不变。 |
| 评审检查      | 拒绝第二个键提取器、按顺序选择整行所有者、在切片之前渲染所有单元格、并行滚动所有权、独立的覆盖层写入方或相对于窗口的无障碍元数据。                                                                                                      |
| 管辖规则      | Table 拥有父协议；模块记录拥有能力行为。共享视口行为遵循 `spec:AST-025`；API 调用方负担遵循 `architecture:public-component-api`。                                                                                                       |

此表是一份评审投影；以下正文具有权威性。

## Intent

Table 以语义行与语义列呈现结构一致的数据。它拥有聚合解剖结构、共享插件协议、规范身份、渲染准入、逻辑行元数据与协调滚动。每个模块拥有其独立的公共行为与证据，而不会私自替换 Table 渲染器。

## Compatibility and migration

- 保留已发布的默认值：就能力的选择性启用而言为是。在未启用激活或虚拟化时，旧有协调键、相对于 body 的 `rowIndexStart` 与 `rowCount`、children 组合、列下限与滚动行为均保持不变。
- FR15 保留已批准的 row-expansion 动画布局决策，包括针对网格/列分隔线的不滑动边界；这些扁平数据能力既不实现也不修订该动效合约。
- 兼容类别：新增式父协议与固定高度开窗的选择性启用。可选的上下文参数保留了既有的较短转换回调。
- 受控/非受控行为：调用方数据、排序、选择、激活、展开与加载仍归调用方所有。数据集/顺序变更在选择性启用的身份/开窗路径中使用新的数据引用；兼容可变性的 `T[]` 类型不会冻结调用方数据。添加或移除依赖身份的能力模式是一个显式的 Table 重新挂载边界；在该已挂载模式内部更改 `activeKey`、资格或几何并不构成重新挂载边界。
- 保留的宽度兼容性（DEC-2）：对于省略宽度的显式列，其紧凑下限是 60px，而不是零宽的可伸缩份额。按列的 `proportional(value, {minWidth})` 会覆盖该下限；显式宽度保持不变，例外是开窗表中被识别为行索引单元格的使用方会加宽以容纳其最后位置（FR13），空间不足时使用既有的内联 Scroll 区域。这一既有默认值修正不会仅因新能力是选择性启用的，就被描述为对其原下限的保留。
- 保留的滚动/目标兼容性（DEC-1）：共享视口行为遵循 `spec:AST-025` 的 FR12、FR14、FR19 与 FR21。有效的键盘访问、适配穿透与内联包含仍位于既有的包装器/内容盒上。规范的 `table` 目标取代被移除的 `base-table` 别名；使用方迁移说明仍留在公共文档与发布负责人处。
- 新增式主题表面（FR5、FR7）：主题可以通过 `componentIcons['table-sort-indicator']` 映射排序指示符字形，并通过 `componentIcons['table-row-expand']` 映射展开字形；没有条目时，两种字形均不变。
- 迁移决策：DEC-1/DEC-2 管辖那些被保留的修正；DEC-4/DEC-5 管辖能力的新增项及其不同的选择性启用/重新挂载边界。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- Table、Scroll 区域与被观察的内容盒、Header、Body、条件式 Footer、Row、列头单元格与 Cell，以及它们的八个规范目标。
- 稳定的排序/选择/展开位置与默认空状态组合。
- 共享转换、顺序阶段顺序、具名排序、槽位协议、失败隔离与稳定的插件数组身份。
- 规范键解析与选择性启用的有效性、行分类、已声明的整行冲突处理、不可变转换上下文与单元格之前的渲染规划。
- 协调后的视口、逻辑位置与父级行绘制解析。
- `Table/internByIdentity.ts`：按输入身份在多次渲染之间保持解析后的列与合并后的插件稳定，且不使用状态或 ref；每个条目在首次见到某个身份路径时写入一次，此后永不改变（`architecture:react-component-runtime` INV17 的惰性一次性初始化），因此 React 丢弃的一次渲染只能新增条目，绝不会改变后续渲染得到的数组；BaseTable 与 useBaseTablePlugins 导入它；没有既有辅助函数按条目的身份为列表建键。

**不拥有 / 非目标**

- 模块本地回调、加载完成/重试、激活状态的含义、窗口范围/焦点策略或性能目标；它们由各自的模块记录拥有。
- CheckboxInput/Icon/EmptyState 的视觉、调用方的单元格/详情/页脚内容、产品排序、抓取、缓存、路由与过期的产品响应。
- 新增目标，或对既有目标可达性缺口的修正。
- 分页、筛选、列管理、树、分组、固定列或上下文菜单的解剖结构，超出此处显式记录的稳定部分。
- 固定高度 v1 准入域中的树、分组、展开详情、任意结构性行替换或可变高度内容。
- 对旧有非虚拟化分页 ARIA 的全局修正。
- TableHeader、TableBody、TableFooter 与 TableRow 的元素合约；`component:TableHeader`、`component:TableBody`、`component:TableFooter` 与 `component:TableRow` 拥有它们。
- TableCell、TableHeaderCell 与 TableSelectionToolbar 的合约；`component:TableCell`、`component:TableHeaderCell` 与 `component:TableSelectionToolbar` 拥有它们。

## Public concepts

| 概念           | 封闭取值或状态                                                                               | 含义                                     | 按变体/方向/状态的可用性                                   | 默认                         | 所有者         | 稳定性 | 无效值行为                                                           |
| -------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------- | ---------------------------- | -------------- | ------ | -------------------------------------------------------------------- |
| 插件集合       | 具名记录或缺失                                                                               | 有序的 `TablePlugin` 贡献                | 数据模式                                                   | 缺失                         | Table          | 稳定   | 开发环境会对未知转换键、非函数与空插件发出警告；不支持的键会被忽略。 |
| 插件转换       | 列、元素、包装器、上下文                                                                     | 一个顺序父阶段                           | 适用的阶段                                                 | 省略即为无操作               | Table          | 稳定   | 抛出时保留已累积的值                                                 |
| 渲染模式       | `data`、`children`                                                                           | 实际的父渲染分支，包含空数据             | 渲染/包装器上下文                                          | 由父级推导                   | Table          | 稳定   | 新增的仅数据能力在 children 模式下不起作用                           |
| 规范键         | 字符串或有限数值；缺失/无效/重复                                                             | 为回调、状态与协调解析出的单一身份       | 显式身份选择性启用                                         | 既有的 `idKey`               | Table          | 稳定   | 无效激活不起作用；开窗会带诊断信息完整渲染                           |
| 转换上下文     | `TableRowContext`、`TableRenderContext`                                                      | 父级拥有的不可变语义事实与稳定的视口引用 | 可选的行转换第四个、单元格转换第六个与包装器转换第二个参数 | 由 Table 提供                | Table          | 稳定   | 缺失上下文会禁用依赖它的能力                                         |
| 行模型         | `flat`、`tree`、`grouped`、`detail`、`custom`                                                | 插件声明的结构化行模型                   | `TablePlugin.rowModel`                                     | 未声明的 body 修饰器不作声明 | Table          | 稳定   | 不受支持的行模型会禁用新增的仅限扁平能力                             |
| 整行所有者     | `activation`、`expansion`、`navigation`、缺失                                                | 插件声明的整行交互，而非普通分析/控件    | `TablePlugin.wholeRowOwner`                                | 缺失                         | Table          | 稳定   | 相互竞争的主张会中和激活，与顺序无关                                 |
| 模块渲染状态源 | 稳定的 `subscribe`、`getSnapshot`、`getServerSnapshot`，配以不可变的 `{isLoading, hasMore?}` | 在区段构建之前驱动对加载敏感的父渲染     | 可选的 `TablePlugin.renderState`                           | 缺失                         | Table          | 稳定   | 缺失源会保留普通的空渲染                                             |
| 开窗能力       | 不透明的 `TableVirtualizationCapability`、每轴最多一个的列表，或缺失                         | 依据行与列虚拟化钩子在单元格之前进行规划 | 数据模式下带显式 `idKey` 的 `Table.virtualization`         | 缺失                         | Table/模块边界 | 稳定   | 无效的几何/内容回退到完整渲染                                        |

公共可用性自首次发布起即为稳定；兼容性是新增式的。

`TableRowContext` 提供规范的 `key`、`identityStatus`（`valid`、`missing`、`invalid`、`duplicate`）、行的 `kind`（`product`、`synthetic`、`unknown`）、从零开始的 `logicalIndex`、`logicalRowCount`、`headerRowCount` 以及渲染上下文。被准入的扁平产品数据集具有 `kind=product`；不受支持的结构化模型可能暴露 `unknown`，而不是臆造出 synthetic/product 的区分。新增的仅限扁平能力对该模型在行转换之前即不生效。`TableRenderContext` 提供 `mode`、已准入的行模型、逻辑/表头计数以及稳定的、由父级拥有的视口引用。上下文是语义输出，而不是由调用方维护的第二份数据/键/偏移量包；更改被引用的视口会通过共享所有者通知资源使用方。

主体行转换保留其既有的 props/item/index 参数，并且可以消费一个可选的第四个上下文；主体单元格转换保留其既有的五个参数，并且可以消费同一个上下文作为可选的第六个参数。包装器转换可以消费一个可选的第二个渲染上下文。行索引是完整输入数据集中的逻辑索引，绝不会因为只挂载了某个窗口而被重新编号。默认的以及被识别为行索引单元格的使用方会收到同一个父位置，而不会构建第二份切片数据/键查找。旧有的行索引配置在虚拟模式之外继续生效；显式的非默认位置覆盖会与虚拟序列冲突，并采用完整渲染回退。手动旧式转换调用所缺失的上下文不会被模块臆造。

`TablePlugin.renderState` 可选地提供一个稳定的外部存储源，包含 `subscribe`、`getSnapshot` 与 `getServerSnapshot`。其不可变快照包含 `isLoading: boolean` 与可选的 `hasMore: boolean`；加载模块从同一受控配置与请求生命周期发布这两者。该快照在任一值改变之前都保持引用稳定；Table 在构建区段之前消费它。FR20 拥有行数解释：带 `hasMore=true` 的被准入贡献会将该开窗表的远端总数标记为未知，这与其当前忙碌状态无关。缺少 `hasMore` 则不作出关于增量总数的声明。该源不引入调用方拥有的加载客户端、总数 prop 或额外的 hook 输入。它在父级区段构建之前传达某个插件本不可见的在途闩锁；仅靠 `emptyState` 接受调用方内容，但若不把该状态在调用方中重复一遍，就无法观察该模块拥有的请求状态。这是插件协议能力，而不是一个新的专用调用方加载 prop。调用方显式的空内容与 `false` 优先于自动默认消息的抑制。没有渲染状态贡献时，普通的 EmptyState 行为不变。加载与视口变更会通知它们真正的共享所有者，而不是依赖对 ref 的修改作为渲染输出的唯一来源。

使用方数据、列、props、模块签名与用法仍记录在 `Table.doc.mjs` 以及成员与模块文档中。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 依据                                                                                             | 证据状态                                                                                                                                |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 默认情况下，Styled Table 围绕一个受观测的内容框渲染一个具名滚动区域和一个语义 Table。滚动区域采用 Table 自身的名称（其 `aria-labelledby`，否则其 `aria-label`），仅当 Table 没有任何名称时才使用通用表名。其适用轴在无窗口化时为行内轴，在启用行窗口化时同时为行内轴和块轴。只要至少一个适用轴实际溢出，视口就进入键盘顺序。行内过度滚动仅在行内滚动生效时才被包含；块轴链式滚动仍然允许，而适配的内容会把手势传递给其祖先。显式 scroll-wrapper 插件 HTML 属性保持权威。                                                                                                                                                                                                                                                                                                                              | `spec:AST-025` FR12、FR14、FR19、FR21；当前源码、文档与测试                                      | 旧有的行内进入/包含已验证；双轴选择性启用进入需要实现证据                                                                               |
| FR2  | 数据驱动模式在存在列时渲染一个 Body 区段和一个带 Column 表头单元格的 Header 区段。在无窗口化时，每个数据项渲染一个标准 Row 和若干 Cell；FR18 把行/单元格的构造限制在被允许的挂载计划内。空数据在启用时渲染配置的空状态行，但受 FR22 对默认初始加载抑制的约束。它绝不创建 Footer 区段。每个 Column 表头单元格显示其列的 `header`，仅当 `header` 被省略、为 `null` 或 `undefined` 时才显示列的 `key`；任何其他 `header` 按 React 渲染它的方式渲染，因此 `header: ''`（操作列的空表头）会渲染一个空的 Column 表头单元格，而不是 key（`architecture:react-component-runtime` INV16）。                                                                                                                                                                                                                    | 当前源码、文档与测试                                                                             | 旧有渲染已验证；FR18/FR22 例外需要实现证据                                                                                              |
| FR3  | Children 模式把调用方的组合传递到 Table。TableHeader、TableBody 和 TableFooter 提供各自的区段，TableRow、TableHeaderCell 和 TableCell 提供标准的行与单元格。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码、文档与测试                                                                             | 已验证当前组合；没有新的 API 或 DOM 规则                                                                                                |
| FR4  | `Table.doc.mjs` 是当前八个目标项的规范聚合使用方所有者：`table`、`table-scroll-wrapper`、`table-header`、`table-body`、`table-footer`、`table-row`、`table-cell` 和 `table-header-cell`。成员文档通过 `subComponentOf: 'Table'` 保留直接查找元数据。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前文档与 CLI 目标测试                                                                          | 已验证父级所有权；聚焦的放置覆盖仍不完整                                                                                                |
| FR5  | 对于可排序列，useTableSortable 在列标签周围渲染一个 Sort 控件、一个由 Icon 拥有的排序指示图形，以及一个数字排序优先级（仅当多列排序有多个活动条目时）。排序指示图形通过 `table-sort-indicator` 组件图标槽解析，传入 `{direction}`：`ascending`、`descending`，或列未排序时的 `none`。没有主题条目时，它分别是 `arrowUp`、`arrowDown` 或 `arrowsUpDown`。当该槽解析不出图标时（主题值为 `null`、槽函数返回 `null`，或请求带 `icon: null`），只有图形被隐藏：Sort 控件、其标签、其排序以及表头的 `aria-sort` 都保留，隐藏的图形在标签旁不占空间，此时已排序的列不显示任何可见的排序提示。请求中的 `size` 只改变图形，绝不改变 Sort 控件或表头行。                                                                                                                                                       | 当前源码、文档与测试；图标槽的 `architecture:icon-resolution-and-component-slots/INV2,INV4–INV8` | 控件与优先级已测试；图形是否存在仅经源码检查；图标槽尚待实现                                                                            |
| FR6  | useTableSelection 在生成的 selection Column 表头单元格和每个可选择正文 Cell 中渲染由 CheckboxInput 拥有的 Selection 控件；选择保持为行状态，而非独立的解剖结构。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码、文档与测试                                                                             | 已验证稳定的委托控件；被选中的行带有 `table-row` 的 `selected` 主题状态（`component:TableRow` FR5）                                     |
| FR7  | 对于可展开行，useTableRowExpansion 渲染一个 Expansion 控件，其中带有由 Icon 拥有的 Expansion 图形，并在条件满足时追加一个 Expanded 详情面板，其单元格跨度为该插件 `transformColumns` 步骤捕获的列数。Expansion 图形通过 `table-row-expand` 组件图标槽解析，传入 `{expanded}`。没有主题条目时，它是 `chevronRight`。无论该槽解析出什么，控件都会在行展开时把图形旋转四分之一圈，并在从右到左布局中镜像它。当该槽解析不出图标时（主题值为 `null`、槽函数返回 `null`，或请求带 `icon: null`），只有图形被隐藏：Expansion 控件、其名称、`aria-expanded` 及其切换都保留，而该控件不显示图形。请求中的 `size` 只改变图形。                                                                                                                                                                                  | 当前源码、文档与测试；图标槽的 `architecture:icon-resolution-and-component-slots/INV2,INV4–INV8` | 已验证稳定的插件部件；当前目标缺口仍存在；图标槽尚待实现                                                                                |
| FR8  | 空数据渲染默认的紧凑 EmptyState，除非调用方提供替代内容或将其禁用；FR22 仅在被允许的初始加载期间抑制默认的 EmptyState。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码、文档与测试                                                                             | 旧有委托已验证；FR22 的加载例外需要实现证据                                                                                             |
| FR9  | Table 把调用方的具名插件记录转换为一个有序数组，位置在其内置样式插件之后。已知名称使用当前规范顺序 `columnSettings → sort → tree → selection → pagination`；其他所有名称都排在已知集合之后，并保持其记录插入顺序。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与文档                                                                                   | 当前共享顺序；规范名称的覆盖仅经源码检查                                                                                                |
| FR10 | 每个适用的非上下文变换都按已解析的插件数组顺序依次运行，因此较晚的插件会收到每个较早成功插件返回的值。抛出异常的变换会报告一个开发错误，并在管道中保留此前累积的值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试                                                                                   | 顺序组合已被测试；失败隔离仅经源码检查                                                                                                  |
| FR11 | `transformColumns` 在元素变换之前完成。随后 Table 在其渲染点应用 table、header-cell/header-row、body-cell/body-row、scroll-wrapper 和上下文阶段。表头单元格的贡献使用 `before`、`content`、`after`、`overlay` 和 `below` 槽。表头单元格 `overlay` 槽中的内容绝不并入表头的无障碍名称。上下文变换按相反顺序运行，因此第一个插件成为最外层的提供者。                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码、类型与测试                                                                             | 变换的应用已被测试；完整的跨阶段顺序仅经源码检查                                                                                        |
| FR12 | 当内置插件与具名插件的引用未改变时，Table 复用已解析的插件数组；未知/自定义插件的值标识与插入顺序仍是 memoization 的稳定输入。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与性能测试                                                                               | 当前性能契约；聚焦的具名顺序覆盖仍不完整                                                                                                |
| FR13 | 在数据驱动模式下，每个省略 `width` 的显式列保留一份相等的弹性份额和一个 60px 的可读性下限。列可以用 `proportional(value, {minWidth})` 设置自己的下限，这会替换该列的 60px 下限；Table 没有全表范围的下限设置。解析是最终列定义的纯函数：行值、渲染出的表头/正文测量、区域设置、排序、筛选、虚拟化以及加载状态都不会改变任何下限。显式的像素宽度与比例宽度保留其作者指定的下限。有一个例外：在窗口化表格中，可识别的行索引单元格使用方（例如 `useTableRowIndex` 列）会加宽，以按自身的字体和内边距容纳最后一个位置。Table 在其第一次客户端布局过程中测量这一点，并在逻辑行数或该列的字体或内边距变化时再次测量，且发生在更宽的位置绘制之前，因此窗口化绝不会裁掉已挂载的位置，也不会在滚动中途回退；未窗口化的表格保持作者指定的宽度。当解析出的下限超过可用的行内空间时，现有的滚动区域提供水平溢出。 | `component:Table/DEC-2`；当前源码与测试                                                          | 已由宽度解析单元覆盖和 ResponsiveScroll 真实浏览器几何测试夹具验证；窗口化行位置下限尚待实现证据                                        |
| FR14 | 无论 Table 在何处显示行分隔线，包括行滑动过程中以及固定列中，该分隔线都具有该行边框本应具有的宽度、样式和颜色：主题的令牌，以及对 `tr`、`tbody` 或 `td` 边框的任何应用层覆盖，因此自定义设置仍然得以体现。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `component:Table/DEC-3`                                                                          | 已由行展开滑动单元覆盖和真实浏览器分隔线检查验证，包含固定单元格与打开的面板；WebKit 中固定单元格出现 1 px 的瞬时台阶是一个已记录的缺口 |
| FR15 | `useTableRowExpansion` 接受一个 `animatedLayout` 选项，即 `spec:AST-105` FR1 定义的句柄：当 Expanded 详情行打开时，面板播放进入，其后的行滑到新位置；当它关闭时，面板立即隐藏，其后的行滑上来占据其空间（`spec:AST-105` Coverage）。Expansion 图形也启用同样的动效；在减少动效模式下，行会移动但不产生位移（`spec:AST-105` FR4）。没有该选项时，行立即变化。绘制列线的表格（`dividers="grid"` 或 `"columns"`）尚不滑动：带有该选项时，其面板和行像没有该选项一样立即变化，而图形保留自己的旋转。`panelVariant="muted"` 的面板把底色绘制在其单元格上，因此底色随面板的内容一起滑入（`spec:AST-105` FR9）。                                                                                                                                                                                             | `spec:AST-105` FR1、FR4、FR9；所有者决策，2026-10-26                                             | 打开与关闭的滑动、无句柄的情况、图形的旋转、减少动效以及列线都已测试；面板的进入及其关闭时的隐藏仅经源码检查                            |
| FR16 | 启用与窗口化使用同一个显式的规范 `idKey`。属性键通过现有的字符串投影解析出有效字符串/有限数字；函数键保留字符串/有限数字类型。缺失、null、非原始类型、非有限以及重复的值对这些选择性启用都是无效的。Table 在数据/键变化时校验完整的逻辑数据集并提供状态；启用对无效行不生效，窗口化则回退到完整渲染。内部带类型标记的对账键把数字 `0` 与字符串 `"0"` 区分开，且不改变回调相等性。无效的回退键对每条记录是确定性的，但不承诺在无效标识下保留状态。没有这些选择性启用的旧有键保持不变。                                                                                                                                                                                                                                                                                                                 | DEC-4；标识与兼容性边界                                                                          | 已规定；发布验证待完成                                                                                                                  |
| FR17 | Table 提供不可变的 `TableRowContext` 和 `TableRenderContext`，而不要求模块提取器或 DOM 模式推断。行模型与整行所有者声明先于资格/元素变换。扁平能力准入排除树形/分组/详情/自定义结构输出，以及没有兼容声明的未知正文修饰器。第一方的 `useTableSelection` 和 `useTableStickyColumns` 声明 `rowModel: 'flat'`；它们的选择单元格和固定单元格包装器保持扁平的产物行结构。多于一个整行所有者主张（包括重复的启用条目）会使启用失效，无论插件顺序如何，并保留旧的所有者与非拥有型处理器，同时发出一个开发诊断。拥有整行动作的自定义回调必须声明它；Table 绝不推断任意回调的意图。                                                                                                                                                                                                                            | DEC-4；共享协议                                                                                  | 已规定；发布验证待完成                                                                                                                  |
| FR18 | `Table.virtualization` 接受一个不透明的几何能力，或一个最多包含一个 rows 能力和一个 columns 能力的列表；运行时准入要求数据模式、显式标识与受约束内容同时满足。这个可选 prop 保留导出的 Table props 接口；无效组合采用带诊断的完整渲染回退。Table 解析完整的输入顺序、列与标识，然后在构造单元格之前规划已挂载的带键记录与不可访问的间隙。只有已挂载的产物/焦点岛记录进入元素变换。默认的虚拟化单元格使用现有的单行 `textOverflow="truncate"`；显式换行、任意行/单元格渲染器或不安全的结构输出会回退到完整渲染。未选择性启用时，默认换行与普通渲染保持不变。                                                                                                                                                                                                                                           | DEC-5；原生渲染与有界工作                                                                        | 已规定；发布验证待完成                                                                                                                  |
| FR19 | 行窗口化在两个逻辑轴上都使用现有的 Table 视口/内容框组合，其块尺寸是其父级赋予它的高度；仅列窗口化时保持 Table 的块尺寸设定。实际的行内溢出会包含链式滚动；块轴链式滚动仍然允许。键盘访问、逻辑映射、粘性/表头/列行为以及几何使用方共享该所有者、稳定的 ref、池化的尺寸调整工作，以及至多一个滚动订阅/待处理帧。任何模块都不会创建并行的 ScrollableArea、检测器或未知的外部根。没有 Table 块视口的模块可以使用视口相交；缺少包装器/上下文不会虚构出一个表后表面。                                                                                                                                                                                                                                                                                                                                     | DEC-5；`spec:AST-025` FR12/FR18/FR19                                                             | 已规定；发布验证待完成                                                                                                                  |
| FR20 | 在虚拟化的扁平非空数据中，父级逻辑序列为表头分配索引 1 到 H，为产物行 i 分配索引 H+i+1。Table 拥有 `aria-rowcount`：当任何当前被允许的增量加载渲染状态贡献报告 `hasMore=true` 时，它为 `-1`，包括空闲、忙碌和重试暂停状态；否则它是完整的当前计数 H+N。加载发布的是可用性，而不是单独的总数或 ARIA 写入者，虚拟化使用这同一条父级规则。在仍有更多数据时追加不会把未知总数变成已加载行的计数；数据耗尽使总数变为精确，而重新出现的可用性又使它变为未知。可见编号从同一个从零开始的索引派生 i+1。不可访问的间隙被排除。控制斑马纹/分隔线的是逻辑奇偶/末行状态，而不是相对于间隙的 DOM 位置。调用方的旧有偏移量/计数与此模式冲突，会引发完整渲染回退，而不是成为第二个事实来源。空数据使用现有的占位/禁用空分支，而不使用虚拟元数据覆盖。非虚拟化的分页元数据保持不变。                                  | DEC-5；完整的语义序列                                                                            | 已规定；发布验证待完成                                                                                                                  |
| FR21 | 选择与启用把语义行状态发布到一条由父级协调的绘制解析路径。在选择生效且行高亮启用时，选择底色优先；否则可以应用启用的组件回退，而启用所拥有的非颜色提示保持独立。`hasRowHighlight=false` 只移除选择底色。一个有效的叠加层会作用到普通/固定单元格，并对先选择或先启用的更新给出相同的输出；清除任一状态都会恢复另一个适用状态、悬停/斑马纹以及焦点。没有竞争的模块写入者会移除另一个模块的叠加层或改变选择语义。                                                                                                                                                                                                                                                                                                                                                                                        | 共享行状态所有权；启用呈现边界                                                                   | 已规定；发布验证待完成                                                                                                                  |
| FR22 | 加载模块的稳定渲染状态源在区段构造之前通知 Table。Table 先解析当前的数据模式、扁平模型与包装器准入，并忽略来自不受支持或无 chrome 配置的加载贡献。当被允许的完整数据为空且有效加载为真时，Table 只抑制默认的 EmptyState；明确由调用方拥有的空/错误内容仍由调用方控制。完成/重置在适当时恢复普通的空行为。如果耗尽移除了获得焦点的手动命令，或虚拟行移除以其他方式使当前焦点脱离，现有的焦点所有者会先把焦点移到具名的 Table 滚动区域，并带 `preventScroll`，当它没有顺序停靠点时使用临时的仅编程可聚焦性。当调用方已把焦点移到存活的后续元素，或焦点已离开被移除的子树时，不发生移动；临时属性在离开时被移除/恢复，且不改变调用方显式设置的属性。                                                                                                                                                     | 加载/渲染与焦点所有权边界                                                                        | 已规定；发布验证待完成                                                                                                                  |
| FR23 | 当列窗口化时，Table 拥有 `aria-colcount`（完整列数），以及每个已挂载表头单元格和正文单元格的整表 `aria-colindex`；占位单元格两者都不带，而未进行列窗口化时两个属性都不添加。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `module:Table/useTableColumnsVirtualization` FR5；DEC-5                                          | 已规定；发布验证待完成                                                                                                                  |

### Current evidence and gaps

- `table`、`table-scroll-wrapper`、`table-row`、`table-cell` 和 `table-header-cell` 这些放置点具有聚焦的运行时断言。`table-header`、`table-body` 和 `table-footer` 放置点仅经源码检查；现有的区段测试断言元素结构与 prop 转发，但不断言目标类。
- 排序测试断言 Sort 控件、标签、状态和条件优先级，但名为 `renders sort icon for sortable columns` 的测试只检查按钮。排序指示图形是否存在仅经源码检查，缺少聚焦的回归证据。选择与展开测试套件断言其稳定控件、状态和面板结构；委托的 Icon 与 CheckboxInput 目标类同样仍仅经源码检查。
- Expanded 详情面板使用原始的 `tr` 和 `td` 元素，而不是 TableRow 和 TableCell，因此现有的 `table-row` 和 `table-cell` 目标无法到达该面板包装器。其 `colSpan` 来自展开插件运行 `transformColumns` 时捕获的列数；较晚的自定义插件可以增加或移除列，而使该跨度过时。当前的全跨度测试只覆盖展开捕获最终列集合的情况。本契约记录这两个缺口，且不修正它们。
- 当行滑动时，WebKit 可能把行的分隔线（FR14）在固定单元格下方绘制得比在滚动单元格下方高或低一个像素：在滑动行的某些小数位置上，两部分会舍入到不同的像素。该台阶仅在行滑动期间存在；静止时分隔线是齐平的。本契约记录该缺口，且不修正它。

### Allowed variation

- **AV1 - 渲染模式。** 数据驱动模式生成区段、行和单元格；children 模式使用调用方提供的组合，而不改变聚合所有权。
- **AV2 - 重复与内容。** 列、行和单元格的数量以及调用方拥有的内容可以变化，而不会产生新的解剖部件。
- **AV3 - 可选部件。** Header 区段、Footer 区段、默认 EmptyState、Sort、Selection 和 Expansion 部件可以依据列、渲染模式、插件配置、数据以及行资格而缺席。当排序指示图形和 Expansion 图形的图标槽解析不出图标时，它们也会缺席（FR5、FR7）。
- **AV4 - 委托渲染。** CheckboxInput、Icon 和 EmptyState 可以改变内部元素形状，同时保持各自的公共契约。
- **AV5 - 模块参与。** 任何具名模块都可以省略其不需要的变换阶段。未知/自定义插件名称仍然有效，并遵循共享的回退排序，而在此不获得模块本地语义。

### Representative states

| 状态             | 必需的不变式                                                                                                                                                        | 允许的变化                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 数据驱动行       | 滚动区域包含 Table、存在列时的 Header 以及 Body；无窗口化时每个数据项为一行带若干 Cell 的 Row，有窗口化时仅为 FR18 的已挂载计划。                                   | 计数、值、密度、分隔线和单元格内容。                                      |
| 省略宽度的显式列 | 每个省略宽度的列在 60px 下限之上保持等量弹性；仅当合并后的下限不再适配时，才触发现有的滚动区域。                                                                    | 行值、表头节点、排序/筛选、虚拟化、加载或空行、方向，以及响应式容器宽度。 |
| 空数据           | 默认 EmptyState 存在，除非被替换/禁用，或在被允许的初始加载期间被 FR22 抑制；完成后恢复普通的空输出。                                                               | 调用方的替代内容，或没有空状态。                                          |
| Children 模式    | 调用方提供的区段被直接传递给 Table。                                                                                                                                | Header、Body 和 Footer 区段的存在与内容。                                 |
| 可排序列         | Column 表头单元格包含 Sort 控件，并且除非 `table-sort-indicator` 槽解析不出图标（FR5），还包含排序指示图形。                                                        | 方向与条件性的多列排序优先级。                                            |
| 可选择行         | Selection 控件占据生成的表头单元格和正文单元格。                                                                                                                    | 每行处于已选中、不确定、禁用或缺席状态。                                  |
| 可展开行         | Expansion 控件占据一个生成的 Cell，并且除非 `table-row-expand` 槽解析不出图标（FR7），还持有 Expansion 图形；打开状态会在其行之后按展开插件捕获的列数添加详情面板。 | 展开状态、调用方的详情内容，以及较晚插件的列变换。                        |
| 多个插件         | 内置样式先运行，随后具名插件按已解析的顺序组合；较晚的变换收到较早的结果。                                                                                          | 支持的变换子集、自定义名称，以及省略的阶段。                              |

### Transformation and precedence order

- **ORD1 - 插件数组。** 内置插件先于具名使用方插件。已知名称按规范列表排序；未知/自定义名称在已知集合之后保持记录插入顺序。
- **ORD2 - 顺序变换。** 每个非上下文阶段都从第一个到最后一个归约该数组。较晚的插件收到较早累积的值。
- **ORD3 - 渲染阶段。** 列变换在元素变换之前完成；元素变换在 table、header、body 和 scroll-wrapper 渲染点运行。上下文变换从最后一个到第一个运行，使数组优先级与提供者嵌套保持一致：第一个插件在最外层。
- **ORD4 - 模块边界。** 模块记录可以依赖此协议并声明它们贡献的变换，但它们不重新定义聚合阶段或具名插件顺序。

- **ORD5 - 选择性启用准备。** 在区段/单元格构造之前，解析已声明的行模型/整行准入与规范标识，使用稳定的渲染状态源，并准备逻辑窗口/间隙计划。行/单元格上下文派生自同一计划；包装器 chrome 不会私下切分已构建的行。
- **ORD6 - 空/加载与焦点。** FR22 按被允许的模式门控有效加载，只替换默认的初始空消息，并把耗尽时的焦点返回保留给现有的命令/滚动区域所有者。

### Performance and resources

- **PR1 - 稳定的插件数组。** 当内置数组与具名插件值在引用上保持不变时，Table 复用已解析的插件数组，包括调用方重新创建包含它们的记录时。
- **PR2 - 模块归属。** 每个模块拥有其转换所创建的、任何更强的渲染、分配、监听器、观察者或初始化约束。Table 拥有公共的数组/转换管线、在数据/键变化时可选启用的 O(N) 规范标识校验、单元格构造前的挂载渲染计划，以及其唯一共享的视口/内容观察与有界的待定帧。当前窗口滚动不执行任何 O(N) 标识遍历。虚拟化模块的 PR 预算约束其对该父级路径的使用；更强的独立模块工作仍归该模块所有。
- **PR3 - 静态宽度解析。** 显式列的宽度下限在既有的 O(列数) 遍历中解析，无需 DOM 测量、观察者、额外的渲染遍历，也不依赖行值。因此服务端与客户端从同一批列定义推导出相同的行内宽度样式。FR13 的窗口化行位置下限是唯一例外：服务端输出与首次客户端渲染使用作者声明的宽度，Table 在首次客户端布局遍历中测量该下限，并在逻辑行数或该列的字体或内边距每次发生变化时重新测量，且发生在更宽的位置绘制之前。

## Accessibility contract

Scroll 区域以 `group` 命名。在未进行窗口化时，inline 是其适用轴；启用窗口化后，inline 与 block 均成为适用轴。只要至少一个适用轴可以滚动，默认视口就是一个顺序键盘停靠点，因此当列恰好适配时，也绝不会隐藏纵向窗口化的 Table 的 Arrow/Page 滚动路径。适配的视口没有默认的顺序停靠点。显式的滚动包装器无障碍属性仍然具有权威性，移除溢出不会移动或模糊既有的焦点。生效的 inline 溢出会包含 overscroll；block 链式传递仍然允许。在聚焦命令或虚拟行被移除时，共享的焦点所有者可以按 FR22 的规定使用临时的、仅程序化的可聚焦性，而不新增持久的 Tab 停靠点，也不抢占调用方已移动的焦点。原生 Table 结构、表头 scope、排序/选择/展开语义仍各自独立归属；共享管线从不为模块的输出赋予正确性。

## Design relationships

| 解剖结构或状态        | 设计要求                                                                         | 表征权威                  | 层级角色 | 组件契约          |
| --------------------- | -------------------------------------------------------------------------------- | ------------------------- | -------- | ----------------- |
| Table                 | 组合语义化的表格结构。                                                           | 当前源码与公开文档        | 支撑性   | FR1-FR4           |
| Scroll region         | 在适用轴上提供可键盘到达的溢出；通常为 inline，启用窗口化后为 inline 与 block。  | 当前源码与公开文档        | 支撑性   | FR1, FR4          |
| Header section        | 将 Column 表头单元格与正文数据分开组合。                                         | 当前源码与公开文档        | 支撑性   | FR2-FR4           |
| Column header cell    | 标识一列，并承载可选的表头控件。                                                 | 当前源码与公开文档        | 显著     | FR2-FR6           |
| Sort control          | 为一个可排序列启用排序。                                                         | 当前源码与公开文档        | 显著     | FR5               |
| Sort indicator glyph  | 通过 Icon 显示当前排序方向；当 `table-sort-indicator` 插槽解析为无图标时不存在。 | `component:Icon`          | 支撑性   | FR5               |
| Sort priority         | 显示某列在活动多列排序顺序中的位置。                                             | 当前源码与公开文档        | 支撑性   | FR5               |
| Selection control     | 通过 CheckboxInput 选择所有符合条件的行或其中一行符合条件的行。                  | `component:CheckboxInput` | 显著     | FR6               |
| Body section          | 组合数据行、空状态行与展开详情行。                                               | 当前源码与公开文档        | 支撑性   | FR2-FR4, FR7, FR8 |
| Row                   | 组合标准的表头、正文或页脚单元格。                                               | 当前源码与公开文档        | 支撑性   | FR2-FR4, FR6      |
| Cell                  | 在标准正文行或页脚行中承载一个值或调用方提供的内容。                             | 当前源码与公开文档        | 显著     | FR2-FR4, FR6, FR7 |
| Default empty state   | 通过 EmptyState 传达当前数据数组没有任何行。                                     | `component:EmptyState`    | 显著     | FR8               |
| Expansion control     | 展开或折叠一行符合条件的行。                                                     | 当前源码与公开文档        | 显著     | FR7               |
| Expansion glyph       | 通过 Icon 显示当前展开方向；当 `table-row-expand` 插槽解析为无图标时不存在。     | `component:Icon`          | 支撑性   | FR7               |
| Expanded detail panel | 在展开行下方的跨列行中呈现调用方提供的详情内容。                                 | 当前源码与公开文档        | 显著     | FR7               |
| Footer section        | 在正文下方组合调用方提供的汇总行或合计行。                                       | 当前源码与公开文档        | 支撑性   | FR3, FR4          |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Table": {"target": "table"},
  "Scroll region": {"target": "table-scroll-wrapper"},
  "Header section": {"target": "table-header"},
  "Column header cell": {"target": "table-header-cell"},
  "Sort control": {"inherits": "table-header-cell"},
  "Sort indicator glyph": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Sort priority": {
    "none": {
      "reason": "unsettled: The multi-sort rank has no direct public target and uses a component-owned accent style; future exposure still needs an owner decision"
    }
  },
  "Selection control": {
    "delegatesTo": {
      "owner": "component:CheckboxInput",
      "target": "checkbox-input"
    }
  },
  "Body section": {"target": "table-body"},
  "Row": {"target": "table-row"},
  "Cell": {"target": "table-cell"},
  "Default empty state": {
    "delegatesTo": {"owner": "component:EmptyState", "target": "empty-state"}
  },
  "Expansion control": {
    "none": {
      "reason": "unsettled: The expansion button has no direct public target and uses component-owned styles; future exposure still needs an owner decision"
    }
  },
  "Expansion glyph": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Expanded detail panel": {
    "none": {
      "reason": "reachability-gap: The plugin renders its detail row and cell as raw elements, so the current table-row and table-cell targets do not reach the panel wrapper"
    }
  },
  "Footer section": {"target": "table-footer"}
}
```

该精确映射一次性记录全部八个规范 Table 目标。TableHeader、TableBody、TableFooter、TableRow、TableCell 与 TableHeaderCell 保留通过 `subComponentOf: 'Table'` 链接的直接文档；对于这种聚合归属，它们不需要独立的组件规格。

## Family and system relationships

- `architecture:component-theming-surface` 负责解剖结构资质、精确目标映射、委托、继承、事实性的 `none` 分类，以及规范目标命名。
- `architecture:container-padding` 负责 Scroll 区域与 Cell 边缘补偿所消费的继承 inset 协议。这种容器系统参与并不使 Table 成为 `family:layout-regions` 的结构成员。
- `architecture:interaction-modality` 负责共享的键盘与指针模态；Table 及其插件保留其当前的本地交互。
- `spec:AST-105` 与 FR15 保留独立批准的 row-expansion animatedLayout 决策。
- `architecture:public-component-api` 负责稳定的公共兼容性。Table 的新增项是可选的转换上下文、`rowModel`、`wholeRowOwner` 与 `renderState` 插件字段，以及原子化的数据模式窗口化启用；普通的 Table 调用方不会获得新的必填字段。
- `module:Table/useTableRowStatus` 负责 row-status 模块的 API、生成的解剖结构、解析与警告优先级、无障碍、性能、迁移与证据。Table 只负责共享插件协议及其聚合组合顺序。

## Verification map

| 契约                   | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 代表性状态                                                                                                                                                                       | 变异或失败预期                                                                                                                                                                                                                                                                                                                                        | 审计小节                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1-FR3                | `Table.test.tsx` 的渲染、结构、适配/溢出切换、children 模式、小节与目标断言                                                                                                                                                                                                                                                                                                                                                                                                     | 适配的与 inline 溢出的数据驱动表格、空数据，以及 children 组合                                                                                                                   | 移除 Table、Scroll 区域、被观察的内容盒、条件化键盘访问或生效轴包含会使既有的角色、结构、状态、类、样式或 prop 转发断言失败；Row 与 Cell 取决于已渲染的数据或调用方组合。证据缺口：FR2 的列 `header` 规则（仅当 `header` 被省略、为 `null` 或 `undefined` 时才回退到 `key`，因此 `header: ''` 渲染出空白表头）为源码检查；没有测试传入 `header: ''`。 | `audit:Table/anatomy`       |
| FR4                    | CLI 发现与 API 目标测试，另加源码检查                                                                                                                                                                                                                                                                                                                                                                                                                                           | 直接成员文档与未过滤/限定作用域的目标输出                                                                                                                                        | 复制父级/成员目标或改变规范所有者会使父级感知的发现断言失败；小节目标的放置位置仍为源码检查。                                                                                                                                                                                                                                                         | `audit:Table/theming`       |
| FR5                    | `plugins/sortable/useTableSortable.test.tsx`；排序模块契约（`plugins/sortable/__tests__/useTableSortable.a11y.ts`，由 `useTableSortable.a11y.test.tsx` 自测），Table 绑定在排序状态上将其组合到基础 Table 契约（`__tests__/Table.a11y.test.tsx`、`__tests__/Table.a11y.chromium.spec.ts`）；另加源码检查；对于图标插槽，一个 `useTableSortable.test.tsx` 插槽套件、一项真实浏览器检查（确认更大的字形保持 Sort control 与表头行的高度，且隐藏的字形不留空隙），以及插槽清单测试 | 未排序、升序、降序与多列排序；主题插槽未设置、插槽函数、`null`，以及尺寸请求                                                                                                     | 移除 Sort control、条件化优先级或 ARIA 状态会使既有断言失败。移除 Sort indicator glyph 目前不会使某个聚焦测试失败；字形的存在与委托的 Icon 目标位置仍为源码检查。对于图标插槽，为某个方向绘制错误的回退、忽略主题插槽或其方向、让 `null` 移除控件或其排序，或让尺寸请求使 Sort control 或表头行变大，都会失败。                                       | `audit:Table/anatomy`       |
| FR6                    | `plugins/selection/useTableSelection.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                  | 全选、单行选择、禁用与不可选择                                                                                                                                                   | 移除表头/正文的 Selection control 或行选择状态会使既有的结构、标签、交互与 ARIA 断言失败；委托的 CheckboxInput 目标位置仍为源码检查。                                                                                                                                                                                                                 | `audit:Table/anatomy`       |
| FR7                    | `plugins/rowExpansion/useTableRowExpansion.test.tsx` 加源码检查；对于图标插槽，一个 `useTableRowExpansion.test.tsx` 插槽套件与插槽清单测试                                                                                                                                                                                                                                                                                                                                      | 折叠、展开与不可展开的行；主题插槽未设置、插槽函数、`null`，以及尺寸请求                                                                                                         | 在覆盖的插件顺序中，移除 Expansion control、条件化详情面板、捕获计数的 `colSpan` 或 ARIA 状态会使既有断言失败；后续的列转换、委托的 Icon 目标位置与未设目标的包装器仍为源码检查。对于图标插槽，忽略主题插槽或其 `expanded` 状态、丢弃转向、或让 `null` 移除控件、其名称或其切换，都会失败。                                                           | `audit:Table/anatomy`       |
| FR8                    | `Table.test.tsx` 空状态套件加 EmptyState 公开目标元数据                                                                                                                                                                                                                                                                                                                                                                                                                         | 默认、自定义、禁用与非空                                                                                                                                                         | 移除条件化空行为会使既有断言失败；默认 EmptyState 委托仍为源码检查。                                                                                                                                                                                                                                                                                  | `audit:Table/anatomy`       |
| FR9-FR11               | `Table.test.tsx`、`types.ts`、`BaseTable.tsx` 与 `useBaseTablePlugins.ts`；`useTableColumnResize.test.tsx` 的 "the handle never adds to its column header's name (AR1)" 与 `TableColumnResizeName.a11y.chromium.spec.ts`（用于 `overlay` 插槽的名称）                                                                                                                                                                                                                           | 内置加已知与自定义具名插件；每个转换阶段                                                                                                                                         | 顺序组合、先基础后用户的行为、转换应用与插槽输出已有聚焦覆盖；完整的已知名称排序、阶段顺序、异常继续与上下文嵌套仍为源码检查。                                                                                                                                                                                                                        | `audit:Table/plugins`       |
| FR12, PR1              | `Table.perf.test.tsx` 与 `internByIdentity.test.ts`，另加 `useBaseTablePlugins.ts` 与 `internByIdentity.ts` 源码检查                                                                                                                                                                                                                                                                                                                                                            | 相同的插件引用、重新创建的记录，以及变更的插件值                                                                                                                                 | 未变的插件值必须保留已解析的数组与代表性的无操作行更新预算；具名记录身份的聚焦覆盖仍不完整。                                                                                                                                                                                                                                                          | `audit:Table/performance`   |
| FR13, PR3              | `Table.test.tsx`、`plugins/columnResize/useTableColumnResize.test.tsx`、`plugins/stickyColumns/useTableStickyColumns.test.tsx`，以及 `Table.stories.tsx` 的 ResponsiveScroll 播放断言；对于窗口化行位置下限，`plugins/rowIndex/useTableRowIndex.test.tsx` 与一项真实浏览器窗口化检查，包括在滚动到末尾时从 999 行追加到 1,000 行、在字体、主题、密度或宿主 inset 变化后重新测量，以及在一列加宽的行号列之后让固定列保持其行内起点位于其之前各列的末尾（发生重叠则失败）         | 无宽度的列，行内容为空、短与长标记；混合显式宽度；固定列；狭窄与适配的容器；窗口化编号在各密度的首个 48px 溢出点：compact 第 10,000 行、balanced 第 1,000 行、spacious 第 100 行 | 移除 60px 下限、从行内容推导该下限、改变显式宽度语义、使尺寸调整边界或固定偏移失去同步，或阻止既有 Scroll 区域激活，都会使聚焦的单元测试或真实浏览器几何断言失败。窗口化的编号列若裁掉数字、在更长的数字挂载或其字体或内边距（含宿主 inset）变化时回退、或收窄到其声明的宽度以下，或未窗口化的编号列变宽，都会失败。                                  | `audit:Table/layout`        |
| FR14                   | `__tests__/TableRowGlide.a11y.browser.spec.ts` 对滑动中途的分隔线、固定列中的分隔线以及打开的详情面板下的分隔线的截图检查；`plugins/rowExpansion/useTableRowExpansion.glide.test.tsx` 用于打开的面板所携带的分隔线                                                                                                                                                                                                                                                              | 使用自定义分隔线颜色的主题；应用对某行边框的覆盖；滑动中途与固定单元格上；同一主题与覆盖下打开的详情面板的分隔线                                                                 | 分隔线的宽度、样式或颜色与行的边框不一致，或丢失主题或应用覆盖，都会失败                                                                                                                                                                                                                                                                              | `audit:Table/theming`       |
| FR15                   | `plugins/rowExpansion/useTableRowExpansion.glide.test.tsx` 与 `__tests__/TableRowGlide.a11y.browser.spec.ts`：带与不带 `animatedLayout` 的行展开，另加对面板入场及其关闭时隐藏的源码检查                                                                                                                                                                                                                                                                                        | 用手柄打开与关闭；不使用手柄；粗指针与细指针下的减少动态效果；滑动旁的图标转向；带该选项的 `dividers="grid"` 与 `dividers="columns"` 表格；滑动中途变暗的面板                    | 在无列线的表格中，用手柄时行发生跳动、关闭的面板在行到达之前就做动画或留下空位、面板与行处于不同的动态效果、图标在滑动旁按自己的时序转向、在减少动态效果下仍发生位移，或任何没有手柄的动态效果；带有列线的表格若使其面板滑动或做动画，或其图标未保持自己的转向，都会失败                                                                              | `audit:Table/plugins`       |
| Accessibility contract | `__tests__/Table.a11y.test.tsx` 与 `__tests__/Table.a11y.chromium.spec.ts` 将 Table 绑定到基础 Table 契约（`internal/a11y-spec`），仅为使用该模块渲染的状态组合该模块的契约：排序状态用排序模块契约（`plugins/sortable/__tests__/useTableSortable.a11y.ts`）；`__tests__/TableScroll.a11y.chromium.spec.ts` 保留 Scroll 区域证据                                                                                                                                                | 带标签的数据驱动、降序排序、带行标题的组合 RTL，以及空数据                                                                                                                       | 丢失 table 角色或声明的名称、行、表头或单元格角色，或某个部件脱离其行或表格，会使基础绑定失败；缺失或过期的 `aria-sort` 会使组合的排序模块契约失败。                                                                                                                                                                                                  | `audit:Table/accessibility` |
| FR17 transform context | `TableRowContext.test.tsx` 与 `plugins/rowIndex/useTableRowIndex.test.tsx`：行、单元格与滚动包装器上下文、行模型准入、读取追踪的重新渲染，以及来自上下文的行编号                                                                                                                                                                                                                                                                                                                | 带与不带 `idKey` 的键；扁平、未声明与已声明的行模型；带与不带索引读取的重新排序；带计数读取的追加行；无 `data` 的重新排序之后的编号                                              | 缺失或可变的上下文、被重新编号或过期的索引、为从不读取其索引的插件而重新渲染的已移动行，或来自数据查找的编号，都会失败                                                                                                                                                                                                                                | `audit:Table/plugins`       |
| FR16-FR22              | 待定的父级协议、渲染计数、API 编译、生命周期与浏览器测试，以及各模块的验证映射                                                                                                                                                                                                                                                                                                                                                                                                  | 规范类型/键冲突；一方扁平声明与诊断性全量渲染回退；无效/未知模式；两种所有者顺序；可选上下文的元数；完整/空/加载中/窗口化数据；固定列绘制；原生焦点与无操作帧                    | 第二个键/偏移/渲染器、按顺序选择的所有者、在切片之前就完成全部单元格工作、过期的源码/引用、空与加载矛盾，或移除焦点目标，都会失败                                                                                                                                                                                                                     | `audit:Table/plugins`       |
| Module backlink        | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 活动的父级记录与同置的模块记录                                                                                                                                                   | 缺失、重复、父级错误、类型错误、命名错误或未被发现的模块记录会使知识校验失败。                                                                                                                                                                                                                                                                        | `audit:Table/modules`       |
| Theming anatomy map    | `scripts/check-knowledge.mjs`、`themingTargets.test.ts` 与 CLI 父级感知目标发现测试                                                                                                                                                                                                                                                                                                                                                                                             | 规范解剖结构与八个当前目标                                                                                                                                                       | 缺失、多余、重复、带前缀、过期或独立持有的成员映射会使仓库校验或发现覆盖失败。                                                                                                                                                                                                                                                                        | `audit:Table/theming`       |

## Decision log

### DEC-1 — Table adopts the shared scroll behavior on its owned viewport

**引用：** `component:Table/DEC-1`

**决策者：** `cixzhang`, 2026-09-20

Table 在其既有 Scroll 区域上使用 `useScrollableArea`，并配有私有的被观察内容盒。inline 溢出仍为原生且可键盘到达。仅当该轴可以滚动时包含才生效，因此适配的 Table 不会为祖先创建无效的滚动区域。这保留了一个由 Table 拥有的视口，且不新增公共 prop 或并行的溢出检测器。

### DEC-2 — Width-less explicit columns use a compact static floor

**引用：** `component:Table/DEC-2`

**决策者：** `cixzhang`, 2026-10-07

省略 `width` 的数据驱动列解析为一个弹性份额，最小 60px。该下限按列配置：`proportional(value, {minWidth})` 设置该列的下限，而不带 `minWidth` 的 `proportional()` 保留其 120px 默认值。解析仅使用列定义，因此分页、排序、过滤、虚拟化、空与加载状态、SSR 以及水合都无法改变任何下限。当 `Table.virtualization` 对表格进行窗口化时有一个例外：被识别的行索引单元格使用方（例如 `useTableRowIndex` 列）至少保持其声明的宽度，并在活动密度下以该列自身的字体与内边距加宽以容纳最后一个位置，即逻辑行数。Table 在首次客户端布局遍历中测量该宽度，并在逻辑行数或该列的字体或内边距每次发生变化时重新测量，且发生在更宽的位置绘制之前，因为窗口化绝不能裁切已挂载的位置或在滚动中途回退到全量渲染；未窗口化的表格保持声明的宽度。已否决：从已渲染或采样的内容推导该下限，因为它会随数据与视图状态变化。

### DEC-3 — A drawn divider keeps the row border's source

**引用：** `component:Table/DEC-3`

**决策者：** `cixzhang`, `2026-10-26`

在行滑动期间或固定列中绘制以替代真实边框的分隔线，会读取行边框的宽度、样式与颜色，来自主题令牌与应用覆盖，因此带主题或自定义的表格在行移动时以及列被固定处看起来一致。

已否决：使用自身固定外观的绘制分隔线。

### DEC-4 - Canonical identity and declared row ownership

**引用：** `component:Table/DEC-4`

**决策者：** `humbertovirtudes`, `2026-11-03`

标识、渲染模式与行分类都是父级事实。可选的启用与窗口化消费一个经过校验的规范键与不可变上下文；它们不推导另一个键，也不使用插件名/私有数据前缀来分类行。带类型标记的内部协调键保留不同的有效规范类型。整行所有者声明意图，冲突会独立于插入顺序地中和启用，而非拥有型的处理程序保留取消与副作用。在没有这些能力时，遗留渲染保持不变。

已否决：从任意回调代码推断动作归属，或新增第二个产品键提取器。

### DEC-5 - Window planning, logical positions and viewport stay in Table

**引用：** `component:Table/DEC-5`

**决策者：** `humbertovirtudes`, `2026-11-03`

Table 使用仅几何的虚拟化能力，并带上其完整的数据、标识与列。准入与逻辑渲染计划发生在单元格构造之前；BaseTable 仍是唯一的原生渲染器。上下文、全表位置、逻辑外观与共享的视口/尺寸调整归属构成一个父级协议。固定高度的启用使用受限截断与全量渲染回退，而不是裁切任意内容或静默改变遗留分页。同一条协调的行绘制路径在任一更新顺序下都保留选择与激活。

已否决：仅包装器的切片、调用方散布的数据/偏移捆绑，或并行的 Table/滚动渲染器。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表或示例、模块本地 API 或生成的解剖结构、插件用法配方、容器内边距机制、共享模态规则、当前审计结果或实现步骤。它链接到这些内容的所有者。
