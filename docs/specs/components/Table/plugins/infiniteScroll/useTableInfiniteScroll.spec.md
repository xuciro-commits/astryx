---
schema_version: 3
template_version: 4
kind: module
id: module:Table/useTableInfiniteScroll
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-03
owners: [cixzhang]
review_triggers:
  [public-api, behavior, layout, theming, accessibility, interaction]
verified_by:
  [
    packages/core/src/Table/plugins/infiniteScroll/useTableInfiniteScroll.test.tsx,
    packages/core/src/Table/plugins/infiniteScroll/TableInfiniteScrollWide.a11y.chromium.spec.ts,
    packages/core/src/Table/TablePluginLoading.test.tsx,
    packages/core/src/Table/TableIncrementalCount.test.tsx,
    packages/core/src/Table/TableLoadingViewport.test.tsx,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:react-component-runtime,
    spec:AST-002,
    spec:AST-009,
    spec:AST-020,
    spec:AST-086,
  ]
---

# useTableInfiniteScroll module contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `useTableInfiniteScroll<T>` 返回一个 `TablePlugin<T>`，其中仅包含受控的 `hasMore`、受控的 `isLoading`，以及返回 `Promise<void>` 的 `onLoadMore`。               |
| 行为          | 一个位于 after-table 的哨兵观察父级拥有的块级视口，若该视口缺失则观察浏览器视口。请求在调用之前加闩；完成状态与已提交的受控状态共同把关短批次的重新武装。       |
| 终端用户影响  | 始终可用的手动命令、连贯一致的进度、保留的焦点以及失败循环抑制，共同使增量数据加载保持可操作。                                                                  |
| 构建者影响    | 调用方拥有行、请求、错误与陈旧数据抑制。数据集重置会重新挂载拥有该 hook 的组件及其 Table；不存在 reset/root/look-ahead/loading-renderer API。                   |
| 兼容性/就绪度 | 加法式且未发布。模块与父级契约的决策已完成；实现与发布验证仍相互独立。                                                                                          |
| 审查检查      | 拒绝重叠/重入加载、即时失败循环、陈旧代次的重新武装、从 DOM 推断模式、祖先发现、焦点丢失、重复的播报/chrome，或非法的表格内容。                                 |
| 治理规则      | `component:Table` 拥有 wrapper/context、渲染规划与视口。必需的 FR17-FR20、FR22 与 DEC-4/DEC-5 属于完整的父级契约；运行时、公共 API 与证据规则保留各自的所有者。 |

本表是审查投影；下文定义模块契约。

## Intent

`useTableInfiniteScroll` 为扁平的数据驱动 Table 协调增量追加请求，但不拥有产品数据、路由器、查询客户端、缓存、游标或分页格式。观察是渐进增强；只要还有更多数据，手动加载命令就始终可用。加载本身既不对现有行分页，也不限制已渲染行的数量。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`；若没有这一可选的增强能力，既有的 Table 与插件行为不变。
- 兼容类别：加法式未发布的 hook；不受支持的新能力组合会被中和，同时既有插件仍然可用。
- 迁移决策：`module:Table/useTableInfiniteScroll/DEC-1`、DEC-6 与 DEC-7。

使用方的签名、导入、示例与重置说明属于使用方文档。所有者批准确立了规范的模块与父级决策；实现与发布证据保持独立。仅凭已合并的代码或通过的检查不足以确立批准。

## Ownership boundary

**拥有**

- 公共 hook、末端哨兵、观察生命周期、单请求闩、完成把关与自动重新武装。
- 固定的进度/手动呈现、失败循环暂停、确定性的命令移除焦点交接，以及证据。
- 对父级 wrapper/渲染规划与模式/准入处理的贡献，同时不改变调用方的行或控制状态。

**不拥有 / 非目标**

- 父级的变换顺序、渲染模式/上下文接缝、扁平准入、空状态放置、共享视口或虚拟逻辑元数据：`component:Table`。
- 数据/游标/分页/缓存状态、传输取消、陈旧响应提交、错误内容，或再次抓取的决策：调用方。
- 客户端/服务端分页、Relay 或路由器集成、滚动恢复、预取，或行/列虚拟化。
- children 模式的加载；树形/分组/详情/自定义行的 v1 加载；公共 reset、root-ref、预读（look-ahead）或加载渲染器定制。

## Public API and concepts

`hasMore` 与 `isLoading` 是布尔值。`onLoadMore()` 返回 `Promise<void>`，且不接收数据客户端对象。异步封装可以表达同步追加完成，而无需强制的加载标志循环。这些就是 v1 的完整配置字段。该模块不暴露 `resetKey`、`rootRef`、`lookAhead` 或 `loadingRenderer` 字段，也不提供等价的渲染器/根/模式选项。

| 概念     | 封闭取值或状态                   | 含义                                 | 默认值           | 所有者           | 稳定性             |
| -------- | -------------------------------- | ------------------------------------ | ---------------- | ---------------- | ------------------ |
| 更多数据 | True/false                       | 允许请求，并控制加载可供性是否出现。 | 受控             | 调用方经由本模块 | 未发布；契约已完成 |
| 受控加载 | True/false                       | 阻止请求，并参与当前加载的呈现。     | 受控             | 调用方经由本模块 | 未发布；契约已完成 |
| 请求     | 空闲、进行中、等待提交、失败暂停 | 一个共享的自动/手动请求生命周期。    | 空闲             | 本模块           | 未发布；契约已完成 |
| 根       | 父级块级视口，否则浏览器视口     | 共享几何，并带有原生祖先裁剪。       | 派生             | 父级             | 未发布；契约已完成 |
| 预读     | 零                               | 没有视口之外的加载距离。             | 内部零           | 本模块           | 非公共             |
| 手动命令 | 就绪、忙碌/不可操作、不存在      | 只要被准入且 `hasMore=true` 就存在。 | 有更多数据时存在 | 本模块           | 未发布；契约已完成 |

## Behavioral contract

| ID   | 已批准的不变式                                                                                                                                                                                                                                                                                                                                                                           | 依据                     | 验证义务                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------------ |
| FR1  | 一个已挂载的 hook 返回一个稳定的插件，并读取当前的回调/配置，而不重启其请求代次。回调标识变化不会清除闩或失败暂停。                                                                                                                                                                                                                                                                      | DEC-1；父级标识契约      | 契约已完成；证据待补           |
| FR2  | 一个哨兵与一个加载/进度表面追加到父级滚动 wrapper 内容盒内累积的 `afterTable`，位于语义表格之外。先前的 props、refs、样式、before/after 内容与 chrome 都保留。非行内容不进入表格分区或行。                                                                                                                                                                                               | 父级 wrapper 契约；DEC-2 | 契约已完成；证据待补           |
| FR3  | 自动请求要求已准入的数据模式、`hasMore=true`、已提交的 `isLoading=false`、没有未完成的闩、没有失败暂停，以及当前正在相交的哨兵。闩在调用当前回调之前设置；观察器/手动/重入路径共享它。                                                                                                                                                                                                   | DEC-1                    | 契约已完成；证据待补           |
| FR4  | 已兑现的 Promise 在结算之后、并在随后第一次观察到当前 `isLoading=false` 的提交之后完成；不要求出现 true 阶段。调用绝不会依据调用前的 false 快照重新武装。非 Promise 结果是非法配置：释放调用闩、暂停自动加载、发出一次开发期诊断，并在受控加载为 false 后恢复手动命令。非法回调不能制造永久的推断忙碌状态。                                                                              | DEC-1                    | 契约已完成；证据待补           |
| FR5  | 在成功的当前请求到达 FR4 的门槛之后，仍然可见且 `hasMore=true` 的哨兵会在提交后重新武装，无需退出/重新进入的手势。每个后续批次使用新的闩，绝不使用同栈递归回调循环。                                                                                                                                                                                                                     | DEC-1                    | 契约已完成；证据待补           |
| FR6  | `hasMore=false` 会断开观察，并移除命令/进度，但不发出主动的耗尽播报。当耗尽移除一个拥有焦点的命令时，焦点会以 `preventScroll` 移到父级的程序化 Scroll 区域目的地；其他焦点不受影响。false 到 true 的转变只能在当前完成/暂停门槛下重新武装。                                                                                                                                              | DEC-3                    | 契约已完成；父级审查与证据待补 |
| FR7  | 缺少 IntersectionObserver 会禁用自动观察，而不抛出异常或破坏 SSR/水合。同一个手动 Button 仍然可用；不受支持的观察绝不会造成静默的死胡同。                                                                                                                                                                                                                                                | DEC-3                    | 契约已完成；证据待补           |
| FR8  | 一个固定的进度呈现使用已挂载的 Load more Button 的 `isLoading` 状态作为当前有效加载。Button 的常驻 polite 加载区域是 `spec:AST-086` FR3/FR4/FR8 之下的唯一播报所有者；其 Spinner 静默。该模块不通过 `useAnnounce` 播报同一条加载消息，也不添加另一个 live region。闩/受控更新合并为一次忙碌转变，且没有观察器事件或追加行的播报。不存在模块自有的错误 chrome 或公共进度渲染器。          | DEC-4/DEC-5              | 契约已完成；实现/AT 证据待补   |
| FR9  | 加载不会调用其他插件回调、改变选择/激活/排序/过滤状态、替换行或重置滚动。调用方的数据更新仍归调用方所有。                                                                                                                                                                                                                                                                                | 所有权边界               | 契约已完成；证据待补           |
| FR10 | 空数据可以加载。稳定的插件在构造分区之前，通过 `TablePlugin.renderState` 发布其有效加载快照，同时发布来自同一受控配置的不可变 `hasMore` 可用性：当前未完成的闩或受控加载在 `hasMore` 为 true 时贡献 true，而耗尽贡献 false。父级 FR22 会依据当前模式/模型/wrapper 准入来把关该贡献，然后只抑制默认的初始 EmptyState。没有行的完成会恢复普通的空行为；调用方的空/错误内容仍归调用方所有。 | 父级 FR22；DEC-4         | 契约已完成；父级实现与证据待补 |
| FR11 | 根是父级拥有的 Table 块级视口（若存在），否则是浏览器视口。原生 IntersectionObserver 的祖先裁剪处理外层嵌套滚动；不存在最近滚动祖先的发现或第二个视口。根/哨兵被替换时，会在获取之前断开过时的资源。                                                                                                                                                                                     | 父级 FR19；DEC-2         | 契约已完成；父级审查与证据待补 |
| FR12 | 该模块保持数据协议无关，且不添加游标、分页、路由器、缓存、请求客户端、reset、root-ref、预读或加载渲染器 API。内部预读为零。                                                                                                                                                                                                                                                              | DEC-6                    | 契约已完成；证据待补           |
| FR13 | 父级的模式/准入上下文驱动 children 模式下的空操作以及一条去重的开发期警告。缺失/未知模式，或非扁平/不受支持的自定义 body 修饰符，会在所有构建中禁用新能力并给出去重的诊断，同时保留既有的 props 与插件。模式绝不从 DOM 推断。                                                                                                                                                            | 父级 FR17-FR18；DEC-7    | 契约已完成；父级审查与证据待补 |
| FR14 | 重置会重新挂载拥有该 hook 的组件及其 Table。来自先前代次的结算不能调用、重新武装、播报或绘制新的代次。仅重新挂载 Table 子节点不构成重置。普通的回调/配置变化不会重置未完成的工作或失败暂停。                                                                                                                                                                                             | DEC-6                    | 契约已完成；证据待补           |

### Transformation and precedence order

- **ORD1 — 父级模式与准入。** 在添加资源/chrome 之前，把可选的第二个上下文消费给 `transformScrollWrapper`；children、缺失上下文与不受支持的行模型保持既有 props 不变。
- **ORD2 — 门槛与当前值。** 在每次自动/手动尝试之前，解析 `hasMore`、已提交的 `isLoading`、未完成的闩、失败暂停与当前代次。
- **ORD3 — 一次调用。** 在当前回调之前设置闩；重入/手动/观察器尝试会立即看到它。回调标识绝不重置它。
- **ORD4 — 完成屏障。** 应用 FR4 的 Promise 完成或非法结果恢复，以及当前代次检查。重新武装发生在提交之后，而不是在回调结算内部同步发生。
- **ORD5 — 失败。** 抛出/拒绝会按 DEC-5 暂停自动加载。手动重试是唯一的就地恢复方式；重新挂载拥有它的 hook 会开始新的代次。更多数据的切换与观察器扰动不会清除暂停。
- **ORD6 — 呈现与焦点。** 应用下面的表面状态，通过父级渲染规划抑制冲突的初始空状态，并在耗尽移除拥有焦点的命令时移交焦点。
- **ORD7 — 父级管线。** 声明 `rowModel: 'flat'` 而不声称 `wholeRowOwner`；追加到既有 `afterTable` 之后，并保留先前的 wrapper 贡献。使用单一的父级视口，而不是私有的滚动层。

### Completion, failure, and surface states

Promise 在结算以及随后一次当前 false 提交的整个过程中保持加闩，包括没有 true 加载阶段的同步兑现 Promise。仍处于待定的 Promise 或调用方控制的 `isLoading=true` 保持忙碌，是因为已知所有者报告了加载，而不是因为缺少某个循环。非 Promise 结果会释放调用闩并暂停自动请求；在一次 false 提交之后，同一个手动命令重新可操作，无需重新挂载。
抛出/拒绝会结束调用并暂停自动加载。一旦结算并提交为 false，手动重试会启动新的闩；成功则恢复重新武装，失败则保留暂停。错误/陈旧数据仍归调用方所有，不存在重复的错误 chrome 或可见哨兵重试。

| 状态                       | 表面与请求行为                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------- |
| 已准入、有更多数据、就绪   | 一个本地化的 Load more Button，即使观察生效时也存在；可见的哨兵可以自动发起请求。           |
| 当前加载中或未完成的完成闩 | 同一个已挂载/可聚焦的 Button，明显忙碌且对 click/Enter/Space 不可操作；一个固定的进度呈现。 |
| 无行的初始加载             | 使用加载表面而非默认的空状态消息；没有预填或重复的 live region。                            |
| 失败暂停且已提交为非加载   | 同一个可操作的手动 Button 进行重试；没有自动循环，也没有模块自有的错误 chrome。             |
| 已耗尽                     | 没有命令/进度/观察器；仅当被移除的命令拥有焦点时才移交焦点。                                |
| 不受支持的观察             | 相同的手动/加载/耗尽状态；没有自动观察。                                                    |
| children/不受支持的准入    | 没有模块哨兵、加载 chrome、请求或空状态变化；去重的开发期诊断。                             |

共享的 Button 通过 `isLoading` 接收有效加载，拥有其 `aria-busy`、Spinner 与常驻 polite 加载区域；请求守卫保留焦点，并在不使用原生禁用的情况下阻止重复激活。仅其本地化的加载区域播报忙碌转变，包括 Button 的“空先于内容”规则下初始即忙碌的挂载。该模块不贡献任何通道调用、live role 或第二条加载消息。合并的闩/受控更新与 StrictMode 重放不得制造另一次忙碌时机。哨兵不是 Tab 停靠点。拥有焦点的命令的耗尽后继遵循父级 FR22；适配的内容使用临时的程序化可聚焦性，而显式的调用方属性保持完好。焦点绝不会仅因加载结算或观察扰动而移动。

### Performance and resources

- **PR1 — 一个观察器。** 每个已挂载的 hook 至多存在一个 IntersectionObserver 与一个被观察的哨兵；条目回调中不存在行/列扫描。
- **PR2 — 原生观察。** 没有逐滚动/逐帧的 JavaScript 监听器驱动加载；不受支持的 IO 使用手动操作。
- **PR3 — 稳定的资源。** 当前回调更新与空操作重渲染不会重新连接未变的根/哨兵几何；内部预读保持为零。
- **PR4 — 封闭的清理情形。** 加载、耗尽、children/不受支持模式、根/哨兵替换、卸载与 StrictMode 重放都会释放过时的观察。加载到就绪与耗尽到更多在门槛通过后至多获取一个当前观察器；排队的过时条目被忽略。
- **PR5 — 代次隔离。** 清理会使旧节点/异步/播报工作失效，但不取消或提交调用方数据；结算无法触及新的已挂载代次。

## Accessibility contract

- **AR1 — 合法的结构。** 哨兵/进度/Button 保持在语义表格之外，绝不会变成被播报的数据行/单元格（WCAG 2.2 SC 1.3.1）。
- **AR2 — 进度时序。** 已挂载的 Load more Button 的常驻 polite 加载区域是每条当前忙碌开始消息的唯一所有者；组合的 Spinner 静默，且该模块不添加通道调用或 live region（`spec:AST-086` FR3/FR4/FR6/FR8）。确定性的所有权/计数测试验证每次合并的忙碌转变只投递一次。跨平台的语音时序是 `spec:AST-009` 之下的推荐后续工作，而不是虚构的已完成测试或额外所有者。
- **AR3 — 手动操作。** 只要被准入且 `hasMore=true`，就存在一个具有本地化名称和可见焦点的共享 Button，与 IO 无关。忙碌状态保留焦点，同时阻止指针与键盘请求（SC 2.1.1、2.4.7、4.1.2）。
- **AR4 — 焦点稳定性。** 追加/加载不会移动焦点，也不会重新挂载该命令。耗尽仅将已移除命令所拥有的焦点以 `preventScroll` 返回父级目的地，绝不窃取无关焦点（SC 2.4.3、2.4.7）。
- **AR5 — 动效。** 进度在无动效时仍可理解，并尊重减少动效设置。
- **AR6 — 触摸与缩放。** 手动与自动路径均不要求悬停或精确指点，且在触摸、缩放与响应式布局下仍可使用（SC 1.4.10）。
- **AR7 — 证据分层。** DOM/无障碍树与确定性测试证明单一 Button 区域路由、静默 Spinner、状态/键盘/焦点与清理。NVDA + Chrome 或 VoiceOver + Safari 上的语音时序遵循推荐的 `spec:AST-009` 后续工作；本模块不添加新的虚拟光标或精确语音声明。

## Design relationships

| 结构或状态 | 设计要求                                           | 表示权威                               | 模块契约            |
| ---------- | -------------------------------------------------- | -------------------------------------- | ------------------- |
| 哨兵       | 仅几何；没有虚假的行或控件语义。                   | 内部，无公共目标                       | FR2, FR11, AR1      |
| 手动命令   | 有更多数据时始终存在；已挂载且保留焦点的忙碌状态。 | `component:Button`，既有 `button` 目标 | FR6-FR8, AR3-AR4    |
| 进度       | 一个固定的本地化呈现，而非重复的加载/错误 chrome。 | DEC-4；共享原语；无模块目标            | FR8, FR10, AR2, AR5 |
| 耗尽       | 没有主动消息；确定性的焦点后继。                   | DEC-3；父级 Scroll 区域                | FR6, AR4            |
| 错误       | 调用方拥有的内容与请求决策。                       | 调用方                                 | DEC-5               |

不存在新的公共 Table/模块主题目标或状态。Button 保留其既有的委托目标；哨兵/支撑性状态文本是内部的且不可定制。该模块保留 Button 的委托目标，且不定义额外的公共结构目标。目标验证仍是实现义务。

## Parent and system relationships

- `component:Table` FR17 与 DEC-4 向 `transformScrollWrapper` 提供可选的第二个 `TableRenderContext`，包含 `mode`、已准入的行模型、逻辑/表头计数，以及一个稳定的共享视口引用；逐行的 `key`、`identityStatus` 与产品/合成/未知 `kind` 属于 `TableRowContext`，而非 wrapper 推断。不受支持的结构模型会在变换之前禁用扁平能力。FR18 拥有单元格之前的准入；FR19/DEC-5 拥有带行内包含与块级允许的双轴视口。稳定的 `renderState` 源在分区构造之前把有效加载送入 FR22；父级模式/模型/wrapper 准入把关消费、默认空状态抑制与耗尽焦点所有权。
- 父级的可选 `rowModel` 与 `wholeRowOwner` 声明（而非名称/顺序/DOM）决定新能力的兼容性。V1 仅准入扁平数据；树形/分组/详情/自定义行模型与未声明的自定义 body 修饰符是不受支持的选项，而既有插件保留其行为。
- 扁平选择、排序、过滤、粘性列、上下文菜单与行索引可组合。无限加载与窗口化在相关模块与父级批准后共同共享父级视口/渲染规划；父级 FR20 独自拥有完整的虚拟行元数据与总数。该模块通过其渲染状态快照发布 `hasMore`，并在加载或可用性变化之前保持快照标识：`hasMore=true` 使已准入的非空窗口化总数为未知（`aria-rowcount=-1`），与忙碌/失败暂停状态无关；耗尽则恢复父级的 H+N 总数。没有模块会根据已挂载/已加载的行设置或推断第二个计数。非窗口化的既有调用方计数与空表元数据保持不变。
- 运行时架构拥有观察器获取、当前值同步、节点替换与 StrictMode 清理；公共 API 规则保持该 hook 协议无关。Button 在 `spec:AST-086` 之下拥有其常驻加载区域机制；该模块提供有效加载，且不重复其播报。

## Verification map

必需的实现检查仍处于待补状态；推荐的语音时序后续工作单独标识，且不是第二个播报所有者或发布门槛。
frontmatter 中的路径是验证目标，而非断言文件存在或通过。

| 契约                                | 验证                                                                                                                                                  | 代表性状态                                                                                                                                                                        | 变异或失败预期                                                                                 |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| FR1, FR3-FR7, FR14, ORD1-ORD5       | 模块单元套件中待补的确定性观察器/手动事件与受控提交测试。                                                                                             | 重入；Promise 在受控 true/false 下待定/兑现/拒绝；没有 true 阶段的同步兑现；非法的非 Promise 结果与可操作的手动恢复；可见的短批次；回调替换；拥有 hook 的重置与仅子节点重新挂载。 | 重叠、陈旧 false 重新武装、同栈递归、即时失败循环、死胡同的短批次，或先前代次的请求/绘制失败。 |
| FR2, FR8-FR10, FR12-FR13, ORD6-ORD7 | 通过父级模式/渲染规划进行的待补渲染/组合测试。                                                                                                        | 数据/children/未知上下文；扁平/非扁平/自定义；空初始加载；chrome/refs；调用方错误。                                                                                               | 非法 DOM、children 哨兵、重复警告、被替换的 chrome、矛盾的空/进度，或重复的错误 UI 失败。      |
| FR11, PR1-PR5                       | StrictMode 下待补的生命周期与几何测试。                                                                                                               | 父级块级根/视口回退/嵌套祖先裁剪；根/节点替换；就绪/加载/耗尽/false 到 true；缺失 IO；卸载。                                                                                      | 祖先发现、泄漏/多个观察器、过时条目、回调扰动，或新代次效应失败。                              |
| AR1, AR3-AR7                        | `TableInfiniteScrollWide.a11y.chromium.spec.ts` 检查加载在 LTR 与 RTL 中保持宽表格的固有宽度。待补：DOM/树、axe、浏览器键盘/触摸/缩放/动效/焦点流程。 | 就绪/忙碌/手动/不受支持的 IO、追加、拥有焦点与无关焦点的耗尽、适配的 Scroll 区域。                                                                                                | 原生禁用丢失焦点、忙碌请求触发、缺少手动命令、虚假的行语义，或焦点交接滚动/窃取失败。          |
| AR2                                 | 待补的单一 Button 区域与静默 Spinner 的 DOM/无障碍树与转变计数检查；语音时序是推荐的后续工作。                                                        | 初始加载、闩/受控更新、重复条目、短批次、完成/失败/耗尽、重放、重置。                                                                                                             | 重复/跳过/乱序或陈旧代次的进度、预填区域，以及扰动的播报失败。                                 |
| 公共 API 与文档                     | 待补的编译夹具、清单、`.doc.mjs`、Storybook 与通用异步配方。                                                                                          | 三个字段；Promise 完成与非法 void 结果的诊断/恢复；拥有 hook 的 React key 重置；手动回退。                                                                                        | 客户端/根/reset/预读/渲染器 API 泄漏、错误的重置所有者，或未记录的完成义务失败。               |
| 性能                                | 待补的对 `Table.perf.test.tsx` 的扩展，用于稳定标识、回调工作与重复追加。                                                                             | 空操作重渲染、多个批次、扁平加载/窗口组合。                                                                                                                                       | 资源扰动、行扫描，或记录的预算回归失败。                                                       |
| 结构所有权                          | `pnpm check:knowledge` 结构检查；实现证据单独存在。                                                                                                   | 当前的模块/反向链接、schema 3/template 4。                                                                                                                                        | 缺失、重复、类型错误、命名错误或孤立的记录必须失败。                                           |

## Decision log

### DEC-1 — Latch before request and complete after commit

**Reference:** `module:Table/useTableInfiniteScroll/DEC-1`
**Decider:** `humbertovirtudes`, `2026-11-03`

所有路径共享调用前的闩，并要求 Promise。结算加上随后提交的 false 快照即可完成一次有效请求，无需 true 阶段。非法的非 Promise 结果会释放调用闩、暂停自动尝试，并在受控加载为 false 后保留可操作的手动恢复。成功的短批次在提交后重新武装。
已否决：不可观测的 void 完成、强制的 true 到 false 循环，或把非法回调输出视为永久待定。

### DEC-2 — Parent geometry and after-table placement

**Reference:** `module:Table/useTableInfiniteScroll/DEC-2`
**Decider:** `humbertovirtudes`, `2026-11-03`

父级的块级视口（若存在）即为根，否则使用浏览器视口。原生祖先裁剪处理嵌套。一个表面追加到表格之外。

### DEC-3 — Always-operable manual path and deterministic focus

**Reference:** `module:Table/useTableInfiniteScroll/DEC-3`
**Decider:** `humbertovirtudes`, `2026-11-03`

有更多数据时存在 Load more Button，忙碌期间保持挂载/可聚焦，并在完成之前不可操作。耗尽仅将已移除命令所拥有的焦点以 `preventScroll` 转移到父级 Scroll 区域。
已否决：仅 IO 的加载、加载期间隐藏命令，或在耗尽时窃取无关焦点。

### DEC-4 — The Load more Button owns loading announcements

**Reference:** `module:Table/useTableInfiniteScroll/DEC-4`
**Decider:** `humbertovirtudes`, `2026-11-03`

共享的 Button 原语渲染一个固定的加载表面。其常驻 polite 加载区域是唯一的忙碌消息所有者；该模块提供合并的加载状态且不添加通道调用。初始加载仅抑制默认的空消息。必需的验证以确定性方式检查路由与所有权；真实语音时序仍是推荐的后续工作。
已否决：公共加载渲染器、为 Button 的加载消息再设通道/区域，或重复的错误/进度 chrome。

### DEC-5 — Failure pauses automatic loading

**Reference:** `module:Table/useTableInfiniteScroll/DEC-5`
**Decider:** `humbertovirtudes`, `2026-11-03`

抛出/拒绝会暂停自动加载，直到受门槛把关的手动重试或重新挂载拥有它的 hook。手动成功会恢复重新武装。调用方拥有的错误/陈旧数据、更多数据切换与回调变化绝不会静默重置失败。
已否决：立即重试可见的失败哨兵，或模块自有的错误/重试面板。

### DEC-6 — Zero look-ahead and hook-owning remount reset

**Reference:** `module:Table/useTableInfiniteScroll/DEC-6`
**Decider:** `humbertovirtudes`, `2026-11-03`

预读为内部零。数据集重置以同时拥有 hook 与 Table 的组件为键；旧的结算无法影响新的代次。调用方仍然抑制陈旧产品数据的提交。
已否决：公共预读/reset API、把仅 Table 子节点重新挂载当作重置，或模块取消调用方数据。

### DEC-7 — Parent mode and flat admission

**Reference:** `module:Table/useTableInfiniteScroll/DEC-7`
**Decider:** `humbertovirtudes`, `2026-11-03`

父级上下文/声明准入扁平数据加载与共享视口。children 模式是去重警告的空操作；未知/非扁平/自定义 body 不兼容会中和该能力，同时保留既有插件。

## Open questions

无。规范契约已完成。实现与发布验证与契约批准相互独立。

## Content boundary

本记录以链接方式引用，而不复制使用方示例、父级协议、观察器/live region 机制、审计结果、实现计划，或调用方的数据/错误与分页/虚拟化契约。
