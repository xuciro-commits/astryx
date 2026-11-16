---
schema_version: 3
template_version: 1
kind: module
id: module:Table/useTableColumnResize
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-10
owners: [cixzhang]
review_triggers: [behavior, layout, visual, accessibility]
verified_by:
  [
    packages/core/src/Table/plugins/columnResize/useTableColumnResize.test.tsx,
    packages/core/src/Table/__tests__/TableColumnResizeName.a11y.chromium.spec.ts,
    packages/core/src/Table/__tests__/TableColumnResizeRange.a11y.chromium.spec.ts,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    component:Table,
    architecture:interaction-modality,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
---

# useTableColumnResize module contract

## Intent

`useTableColumnResize` 让人可以从列的尾随边界改变列宽。本记录负责界定在任何人都还没拖动之前，该边界长什么样：列边界何时被绘制、绘制出的线延伸多远、哪些指针能力能看到它，以及它显示期间表头上还有哪些内容可以变化。

宽度解析、每列最小值、相邻比例列行为、提交回调以及本模块的配置，目前均未被契约化。当它们被记录时，本记录是其规范所有者；今天它只陈述可供性、其范围及其交互模态。

当前宽度行为已被记录，作为后续契约的起点，其中已知有两处是错误的：一次拖动会把每一列都快照为像素宽度，因此比例列不再保持比例；并且当某一列之前的列被调整大小时，尾随的比例列不会吸收该增量。这两者都是应在那里修正的缺陷，而不是本记录允许的变体。

## Compatibility and migration

- 保留已发布的默认值：对于悬停能力指针下表头的静止外观为 `no`，对于以粗略指针为主指针且具有其他输入的设备上的边界存在性为 `no`——由键盘驱动的平板会获得一个它原先没有的 Tab 停留点。对于公共 API、DOM 形状、悬停能力指针上的键盘行为以及每一种宽度结果均为 `yes`。
- 兼容性类别：对一个瞬态状态的纯呈现变更，外加一处无障碍修正，即在已承诺键盘调整大小之处增加一个控件。未新增或更改任何公共 API、prop、导出或目标。有一处无障碍修正改变了所宣告的范围：无最大宽度的列会宣告一个替代最大值并以文字宣告其值（AR7），而它此前不宣告最大值，于是辅助技术回退到最大值 100。边界值为其列的渲染宽度（AR8），而它此前在首次调整大小之前是列的最小值。
- 迁移决策：无。无需使用方编辑，也无需 codemod。

此仅规格变更不携带包 Changeset。实现 pull request 负责运行时代码、测试及其 Changeset。

## Ownership boundary

**拥有**

- 每个可调整大小的列各有一个调整大小边界控件，其存在性与放置位置，以及它的指针目标与其绘制指示器之间的区分。
- 揭示契约：在静止时、表头悬停时、指针位于其上时、可见焦点时以及拖动期间，哪些边界被绘制，以及它们之间的优先级。
- 绘制指示器的垂直范围，以及它绝不能使 Table 滚动区域产生垂直滚动这一要求。
- 哪些指针能力能获得该可供性，以及哪些能获得其悬停揭示。
- 表头悬停还可以改变什么，其边界何在。
- 在滚动区域正在滚动时，表头揭示是否响应指针。

**不拥有 / 非目标**

- 聚合的 `TablePlugin` 协议、变换阶段、插件排序，以及表头行与表头单元格渲染槽位——由 `component:Table` 拥有。
- 共享模态状态与焦点指示器可见性规则——由 `architecture:interaction-modality` 拥有。
- 公共主题目标与 token 暴露——由 `architecture:component-theming-surface` 拥有。本契约不批准任何 `table-resize-handle` 目标。
- 排序、选择、列设置或任何其他表头控件自身的悬停、焦点与按压处理。
- 触摸拖动调整大小的可供性。用手指拖动细线边界在 DEC-4 下是非目标；可触摸到达的调整大小路径将是具有自身记录的独立可供性。
- 宽度计算、钳制、提交语义、RTL 宽度运算以及本模块的配置面。它们保留在使用方文档中，直到本记录将它们契约化。

## Public API and concepts

本契约不新增公共 API。使用方签名、默认值与示例保留在 `useTableColumnResize.doc.mjs` 中。

| Concept  | Closed values or states          | Meaning                                      | Default                  | Owner                               | Stability |
| -------- | -------------------------------- | -------------------------------------------- | ------------------------ | ----------------------------------- | --------- |
| 边界控件 | 每列存在或不存在                 | 位于列尾随行内边缘处的一个可调整大小的边界。 | 每个可调整大小的列都存在 | `module:Table/useTableColumnResize` | 稳定      |
| 揭示状态 | `hidden`、`hinted`、`emphasized` | 当前某一个边界被绘制得有多强。               | `hidden`                 | `module:Table/useTableColumnResize` | 稳定      |
| 指针能力 | 悬停能力或粗略                   | 悬停是否揭示该可供性。不决定控件是否存在。   | 由输入推导               | `architecture:interaction-modality` | 稳定      |
| 滚动活动 | 稳定或滚动                       | 滚动区域当前是否在指针下方移动。             | 稳定                     | `module:Table/useTableColumnResize` | 稳定      |

## Behavioral contract

| ID   | Invariant                                                                                                                                                                                                                                  | Basis                                        | Implementation/evidence state                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | -------------------------------------------------------- |
| FR1  | 每个可调整大小的列在其尾随行内边缘处获得一个边界控件，其指针目标比绘制指示器更宽，因此线保持细线，而抓取区域保持可用。退出调整大小的列以及生成的插件列不获得任何边界控件。                                                                 | 当前源码与文档                               | 已验证当前行为；尺寸来自源码检视。                       |
| FR2  | 绘制指示器从表头顶部贯穿正文各行，因此拖动可对照它所移动的行来解读。它必须结束于表格底边处或其上方，且绝不可使 Table 滚动区域产生垂直滚动；该区域仅为水平溢出而存在。                                                                      | 所有者指示，2026-09-10                       | 当前版本会越过最后一行溢出；修正待完成。                 |
| FR3  | 在表头行中没有悬停能力指针、边界上没有可见焦点、且没有拖动进行中时，每个边界都是 `hidden`。                                                                                                                                                | 当前源码与文档                               | 已验证当前行为。                                         |
| FR4  | 当悬停能力指针位于表头行内任意位置时，该行中的每个边界同时以边框权重处于 `hinted`。指针离开该行时，这些边界返回 `hidden`。                                                                                                                 | 所有者指示，2026-09-10（DEC-1）              | 所有者指示；实现与聚焦覆盖待完成。                       |
| FR5  | 指针下的边界、带有可见焦点指示器的边界以及正在被拖动的边界以强调权重处于 `emphasized`，优先于任何 `hinted` 状态。                                                                                                                          | 当前源码加 DEC-1                             | 指针与焦点状态已验证；提示交互待完成。                   |
| FR6  | 指针能力限定了悬停揭示，而非控件本身。在没有指针可以悬停之处，进入表头行不揭示任何内容，每个边界保持 `hidden`。边界控件本身连同其 Tab 停留点、可访问名称与值，存在于任何可用输入能操作它之处，因此带键盘的粗略主指针设备保留键盘调整大小。 | DEC-3 加 `architecture:interaction-modality` | 粗略主指针抑制是当前行为，也是 DEC-3 所修正的缺陷。      |
| FR7  | 表头悬停只改变这些指示器。它绝不可改变表头背景、标签、光标、布局、列宽或任何正文行处理，也绝不可改动另一个表头控件自身的状态。                                                                                                             | 所有者指示，2026-09-10                       | 所有者指示；聚焦覆盖待完成。                             |
| FR8  | 调整大小无需悬停即可使用。边界仍留在 Tab 顺序中，并保有其可访问名称与值，键盘调整大小不变，揭示只增加可发现性——它绝不是使用的前提条件。这对每一种其输入能操作该控件的设备都成立，包括带键盘的粗略主指针设备。                              | 当前源码、WAI-ARIA splitter 模式、DEC-3      | 键盘路径已在悬停能力指针上验证；粗略主指针对等性待完成。 |
| FR9  | 带有可见焦点指示器的边界单独处于 `emphasized`。焦点绝不可抬高行级提示，因此聚焦一个边界绝不会绘制其相邻边界。只有表头行内的悬停能力指针会那样做。                                                                                          | 所有者指示，2026-09-21（DEC-5）              | 所有者指示；聚焦覆盖待完成。                             |
| FR10 | 在 Table 的滚动区域滚动期间，表头悬停不解析任何新的揭示：指针仅因内容在其下方移动而到达的边界保持 `hidden`，滚动开始时已经 `hinted` 的边界回落为 `hidden`。滚动停止时揭示恢复。进行中的拖动与可见焦点指示器不受影响。                      | 所有者指示，2026-09-21（DEC-6）              | 所有者指示；实现与覆盖待完成。                           |

### Transformation and precedence order

- **ORD0 — 滚动闸门。** 滚动活动在 ORD1 的悬停分支之前求值。在滚动区域滚动期间，`hinted` 分支不可达；拖动与可见焦点仍解析为 `emphasized`（FR10）。
- **ORD1 — 揭示优先级。** 拖动、可见焦点与指针位于边界上解析为 `emphasized`；否则表头行悬停解析为 `hinted`；否则 `hidden`。边界自身的状态始终高于行级提示，因此指针下的边界达到强调权重，而其相邻边界保持边框权重。优先级只单向运行：边界自身状态绝不会抬高行级提示，这就是仅焦点会强调一个边界而不绘制相邻边界的原因（FR9）。
- **ORD2 — 揭示范围。** 揭示在表头行作用域上发布一次，而非按单元格，因此从任何位置进入表头都会一起揭示该行中的每个边界，而不是指针下的那一个。
- **ORD3 — 父级流水线。** 本模块在 `component:Table` 给它的位置上贡献其表头行与表头单元格变换，且不重新定义插件顺序。

### Performance and resources

- **PR1 — 揭示不产生渲染开销。** 进入或离开表头绝不可设置 React 状态或重新渲染 Table。揭示是一种声明式样式状态。FR10 的滚动闸门是对无监听器规则的唯一允许例外：模块可以在滚动区域上附加一个单一被动滚动监听器，外加告知它何时重新打开的稳定信号——浏览器具备时用 `scrollend`，否则用一个去抖定时器。它必须把滚动状态直接写入 DOM，作为属性或 CSS 读取的内联自定义属性，且绝不可设置 React 状态或重新渲染 Table。不得为揭示添加任何其他监听器或定时器。
- **PR2 — 单一测量路径。** 指示器范围复用模块现有的对表格的共享调整大小观测。揭示不新增观察器，且范围测量绝不可观测指示器自身会改变大小的任何对象。

## Accessibility contract

- **AR1 — 语义不变。** 每个边界保留其分隔符角色、垂直方向、命名其列的可访问名称以及值边界（AR7）。其调整大小手柄位于 `overlay` 槽位，因此不会加入表头的名称（`component:Table` FR11）。
- **AR2 — 装饰性揭示。** `hinted` 仅用于呈现。它不改变任何 ARIA 状态、不宣告任何内容，也不进入或重排 Tab 顺序。
- **AR3 — 无悬停时的对等。** 键盘焦点以强调权重绘制同一个边界，因此从不悬停的人在需要它的时刻获得同等的提示。焦点只绘制那一个边界，不绘制其他边界（FR9）。
- **AR4 — 诚实的强度声明。** `hinted` 权重是发现辅助，不是状态指示器。本契约不为其作出任何非文本对比度承诺，且绝不可让它成为控件可用的唯一信号；`emphasized` 与焦点指示器承载该信号。
- **AR5 — 动效克制。** 揭示上的任何过渡必须保持为短促的颜色变化，且绝不可移动布局或指示器的位置。
- **AR6 — 跨输入对等。** Tab 停留点不依赖主指针能力。主指针为粗略指针但同时具备键盘的设备保有其边界控件、名称与值（FR6、DEC-3）。
- **AR7 — 能容纳该值的范围。** 边界的所宣告最大值绝不低于其值或其最小值，其宣告最小值绝不高出其值（`spec:AST-020` FR1）。具有最大宽度的列宣告该最大值，若布局将其渲染得更宽则宣告其值；渲染得比其最小值更窄的列将其值宣告为最小值。无最大宽度的列以列的值与最小值为下限宣告窗口的行内范围，如同无界 Resizable 区域所做的那样，取自同一共享测量；该列绝不会被钳制到该范围。由于该最大值代替了缺失的限制，此类边界还以文字宣告其值（“133 pixels”）。服务器端渲染没有窗口，因此在 hydration 读取之前不携带最大值。
- **AR8 — 值即渲染宽度。** 边界的值是其列以整像素计的渲染宽度，取自布局后的首次测量，并随该列被调整大小而跟随它。宽度取自共享的调整大小观察器，绝不在渲染期间读取。在首次测量之前，该值是表格所请求的宽度，否则为列的最小值。

## Design relationships

| Anatomy or state   | Design requirement                                               | Representation authority            | Module contract |
| ------------------ | ---------------------------------------------------------------- | ----------------------------------- | --------------- |
| 边界控件           | 在每一种能操作它的输入上提供可抓取的列边缘，而不绘制常驻分隔线。 | `module:Table/useTableColumnResize` | FR1, FR6, AR6   |
| `hidden` 边界      | 让静止的表头不含人未使用的控件。                                 | `module:Table/useTableColumnResize` | FR3             |
| `hinted` 边界      | 在注意力进入表头的时刻回答“这些列能动吗？”。                     | `module:Table/useTableColumnResize` | FR4, FR7, AR4   |
| `emphasized` 边界  | 指明指针、焦点或拖动正在作用的那个边界，且仅指明它。             | `module:Table/useTableColumnResize` | FR5, FR9, ORD1  |
| 滚动期间的静止揭示 | 防止在静止指针下移动的内容被解读为意图。                         | `module:Table/useTableColumnResize` | FR10, ORD0      |
| 指示器范围         | 使拖动对照它所调整的行来解读，而不改变表格滚动的内容。           | `module:Table/useTableColumnResize` | FR2             |

### Theming

边界控件或其指示器未获批准任何公共目标，且本模块的使用方文档未记录自身结构。因此本契约不添加 `anatomy-theming:v1` 块；直接目标需要在 `architecture:component-theming-surface` 下进行单独审查，并同步使用方结构。

DEC-7 将此作为决策而非开放问题来定论：提示与强调权重已从主题 token 解析，因此主题变更会使边界随之变化，而无需自身目标。

## Parent and system relationships

- `component:Table` 拥有插件协议、排序、表头行与表头单元格槽位，以及本契约 FR2 所保护的滚动区域。Table 的聚合记录不拥有列调整大小结构，这就是该边界独立存在的原因。
- 粘性列插件（`useTableStickyColumns`，尚无自己的记录）与同一表头单元格上的本模块组合。两者都贡献 `position`——本模块追加 `relative` 以便其绝对定位的边界控件锚定，粘性需要 `sticky` 才能固定——而当两者都经由单元格的 `xstyle` 时，后一个插件的值获胜，组合顺序决定了被固定的列是否真的被固定。排序不是解决办法：`component:Table` 拥有插件顺序并将其视为布局决策，绝不是正确性决策，因此一种顺序下可用、另一种顺序下就失效的一对本身就是该对的缺陷。因此粘性把 `position` 以内联方式与它已经写在那里的偏移一起写出，这会高于任一插件的类，并使组合与顺序无关。第二种耦合仍然开放：粘性根据声明的列宽计算其累积固定偏移，而拖动会把渲染像素宽度写入 DOM，因此调整大小后固定偏移会失真。两个记录都尚未契约化该调和。
- `architecture:interaction-modality` 拥有悬停能力与模态历史，以及共享焦点指示器的可见性规则。FR6 与 AR3 应用这些规则；它们不重述这些规则。
- `architecture:component-theming-surface` 拥有目标资格。用于承载范围与提示值的结构化自定义属性属于实现，而非主题面。
- `architecture:public-component-api` 拥有公共边界。本记录不新增导出、prop 或类型。

## Verification map

| Contract           | Verification                                                                                                                                                                                                                                                                                                                                                                                                       | Representative states                                                        | Mutation or failure expectation                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| FR1, FR6           | `useTableColumnResize.test.tsx` 的边界存在性用例加上悬停能力与粗略主指针用例                                                                                                                                                                                                                                                                                                                                       | 可调整大小、退出调整大小与生成的列；悬停能力、带键盘的粗略主指针与仅粗略输入 | 边界出现在不可调整大小的列上、从可调整大小的列上消失、悬停揭示在没有指针能悬停之处触发，或输入能操作控件之处控件却缺席。    |
| FR2                | 在启用插件时对滚动区域垂直溢出做浏览器测量                                                                                                                                                                                                                                                                                                                                                                         | 短表与高表、换行与单行表头、紧凑与默认                                       | 指示器结束于最后一行之下，或滚动区域获得了同一表格在未启用调整大小时所没有的垂直滚动。                                      |
| FR3-FR5, FR9, ORD1 | 针对静止、表头悬停、指针位于边界、聚焦与拖动状态的新增聚焦测试                                                                                                                                                                                                                                                                                                                                                     | 静止、表头悬停、悬停且指针位于一个边界、行内无指针的键盘焦点、拖动           | 静止表头绘制了边界、表头悬停漏掉某个边界、被指向/聚焦的边界未能高于提示，或仅焦点就绘制了相邻边界。                         |
| FR10, ORD0         | 用停驻在表头上方的指针驱动滚动区域的滚动闸门测试                                                                                                                                                                                                                                                                                                                                                                   | 指针停驻在表头上方时区域滚动，以及其稳定下来之后                             | 边界在滚动中途揭示、已有提示在滚动后仍存留，或滚动停止后揭示未能恢复。                                                      |
| FR7                | 快照或断言，确认表头悬停不改变其他任何表头或行处理                                                                                                                                                                                                                                                                                                                                                                 | 在可排序表头与可选择表头上方进行表头悬停                                     | 表头悬停改变了背景、标签、光标、宽度或另一个控件的状态。                                                                    |
| FR8, AR1-AR3, AR6  | 现有键盘与 ARIA 套件以及一个粗略主指针键盘用例；`useTableColumnResize.test.tsx` 的“the handle never adds to its column header's name (AR1)”与 `TableColumnResizeName.a11y.chromium.spec.ts` 的“a resize handle never adds to its column header name”；建议后续进行辅助技术抽查                                                                                                                                     | Tab 到边界、用方向键调整大小、用屏幕阅读器导航表头、带键盘的粗略主指针设备   | 边界在任何能操作它的输入上离开 Tab 顺序、失去其名称或值，或提示进入了无障碍树。                                             |
| AR7                | `useTableColumnResize.test.tsx` 的“an unbounded column announces a finite maximum, never below its value, and its width in words”与“handle has aria-valuemax when finite”；`TableColumnResizeRange.a11y.chromium.spec.ts` 在 Chromium 的无障碍树中                                                                                                                                                                 | 无最大宽度的列；一个带 `maxWidth` 的列                                       | 最大值缺失或非有限、最大值低于值或最小值、无界列缺少值文字，或有界列带值文字，均为失败。                                    |
| AR8                | `useTableColumnResize.test.tsx` 的“announces its column's rendered width before any resize, not the minimum”；`TableColumnResizeRange.a11y.chromium.spec.ts` 的“a handle announces its column's rendered width before any resize”在 Chromium 的无障碍树中，在任何调整大小之前以及两次 ArrowRight 按压之后；`useTableColumnResize.test.tsx` 的“keeps the announced range holding a column rendered past its limits” | 在任何调整大小之前；在键盘调整大小之后                                       | 一旦测量后值不同于列的渲染宽度，或在渲染期间读取布局，均为失败。                                                            |
| PR1, PR2           | 围绕表头指针进入/离开以及滚动期间的渲染次数断言；监听器与观察器检查                                                                                                                                                                                                                                                                                                                                                | 指针反复进入并离开表头；区域在停驻指针下滚动                                 | 揭示重新渲染了 Table、滚动闸门设置了 React 状态、添加了多于一个滚动监听器或任何定时器，或范围测量观测了它所调整大小的对象。 |
| Plugin composition | 在两种插入顺序下同时挂载调整大小与粘性列插件的测试                                                                                                                                                                                                                                                                                                                                                                 | 启用调整大小的固定起始列，拖动前与拖动后                                     | 固定列在任一顺序下失去 `position: sticky`，或组合依赖于调用方的插入顺序。                                                   |
| Record shape       | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                      | 同目录的模块记录、规范 id 与文件名、父级反向链接                             | 缺失、命名错误、父级错误或未链接的记录通过了校验。                                                                          |

浏览器、渲染次数与辅助技术证据尚待补充。通过本规格 pull request 只证明记录完整性。

## Decision log

### DEC-1 — The header discloses every resizable boundary on hover

**参考：** `module:Table/useTableColumnResize/DEC-1`

**决定者：** cixzhang, 2026-09-10

只在指针已经进入其抓取区域后才绘制的边界，要求人先怀疑该列可调整大小，然后才能发现。现在进入表头会以边框权重揭示每个边界，而指针下的边界仍取强调权重，因此发现与定位保持可区分。揭示受 FR7 约束，并按 FR6 仅限指针。

已否决：只揭示指针下的边界，这保留了发现问题；绘制常驻分隔线，这会增加列并未挣得的静止视觉；仅依赖调整大小光标，这需要同样的先验怀疑；以及提供用于退出的公共 prop，这会让发现可供性成为调用方的决定。

### DEC-2 — The indicator is bounded by the table it belongs to

**参考：** `module:Table/useTableColumnResize/DEC-2`

**决定者：** cixzhang, 2026-09-10

全高指示器是预期设计，因为拖动必须对照它所移动的行来解读。结束于最后一行之外的指示器是缺陷，而非允许的变体：滚动区域一旦水平滚动就会提升垂直溢出，因此不可见的悬垂会变成可见的多余滚动。结束位置比最后一行短一点点在 FR2 之内；悬垂到其外则不是。

已否决：保留悬垂并抑制该区域的垂直滚动，这会掩盖其他内容的真实溢出。

### DEC-3 — Pointer capability gates the reveal, not the control

**参考：** `module:Table/useTableColumnResize/DEC-3`

**决定者：** cixzhang, 2026-09-21

在主指针为粗略指针时抑制整个边界控件，也会移除其 Tab 停留点，于是由键盘驱动的平板完全失去调整大小，而 FR8 与 AR3 却承诺了它。能力只决定揭示：悬停就在指针能悬停之处揭示，而控件在任何可用输入能操作它之处存在。当前的粗略抑制是违背本决策的缺陷，而不是本决策所记录的行为。

已否决：让存在性继续以指针能力为门，并把 FR8 削弱到仅悬停能力设备，这会用无障碍保证换取实现便利；以及以触摸能力测试为门，这仍会误读同时携带两种输入的设备。

### DEC-4 — Touch-drag resize is a non-goal

**参考：** `module:Table/useTableColumnResize/DEC-4`

**决定者：** cixzhang, 2026-09-21

细线边界无法用手指可靠拖动，而把抓取区域加宽到足以触摸的程度，要么会吞掉表头按压，要么会绘制列并未挣得的静止可供性。触摸用户不会得到指针路径的降级版本。这关闭了 OQ3。

已否决：在粗略指针下放大抓取区域，这与 FR7 对表头变更的约束冲突；以及长按拖动模式，这会与文本选择和滚动冲突，且未解决目标尺寸问题。

可触摸到达的调整大小路径仍是所期望的独立工作——拖动胶囊，或在列设置面板内调整大小——并带有其自身的可供性与记录。

### DEC-5 — Focus emphasizes one boundary and never hints the row

**参考：** `module:Table/useTableColumnResize/DEC-5`

**决定者：** cixzhang, 2026-09-21

键盘焦点已经瞄准一个边界，因此在行内绘制每个边界只会增加噪音而非发现。行级提示为没有目标的指针回答“这些列能动吗？”；而焦点已有目标。因此焦点在其自身边界上解析为 `emphasized`，并让相邻边界保持 `hidden`。

已否决：为与悬停对称而在焦点上触发行提示，这向不需要它的模态重复发现提示，并使聚焦的边界更难从八条绘制的线中辨认出来。

### DEC-6 — Disclosure is suppressed while the scroll region scrolls

**参考：** `module:Table/useTableColumnResize/DEC-6`

**决定者：** cixzhang, 2026-09-21

因内容在其下方移动而最终落在表头上的指针并未表达意图，因此在滚动中途出现的边界读起来像闪烁。揭示在区域滚动期间保持，待其稳定后恢复。进行中的拖动与可见焦点指示器不受影响，因为两者都是刻意的。

已否决：按浏览器报告的滚动触发悬停来揭示，这正是闪烁；以及对指针进入去抖，这会为了修正意外情形而延迟刻意情形。

### DEC-7 — The boundary gets no public theme target

**参考：** `module:Table/useTableColumnResize/DEC-7`

**决定者：** cixzhang, 2026-09-21

提示与强调权重已从主题 token 解析，因此主题变更无需直接目标就能正确移动边界。发布目标会在宽度模型被契约化之前，把 `boundary` 与 `indicator` 结构冻结进主题面，而 `architecture:component-theming-surface` 要求同步的使用方结构，本模块文档并没有。这关闭了 OQ2。

已否决：现在发布目标，等宽度契约落地时再修订，这会把稳定的公共面置于尚未决定的面之前。

若使用方需要提示权重不同于其自身的边框 token，则重新审视。

## Open questions

- **OQ1 — 强制颜色。** `hinted` 与 `emphasized` 在强制颜色与高对比度模式下如何解析？（`checkable`）
- **OQ4 — 草案设计记录。** `design:user-states` 处于草案状态。当其被提升时，其条件悬停要求应在此引用，而非重述。
- **OQ5 — 粘性偏移调和。** 拖动写入渲染像素宽度后，依据声明宽度计算的粘性固定偏移会失真。哪个记录拥有该调和，它属于宽度契约还是属于粘性列？（`checkable`）

OQ2（主题选择）由 DEC-7 关闭，OQ3（粗略指针）由 DEC-3 与 DEC-4 关闭。其编号被保留而非复用。

## Content boundary

本记录不重复使用方签名或示例、父级 Table 插件协议、共享模态机制、主题目标策略、宽度计算、当前审计结果或实现步骤。它链接到它们的所有者。
