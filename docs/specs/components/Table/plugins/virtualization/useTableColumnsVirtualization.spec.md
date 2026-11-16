---
schema_version: 3
template_version: 4
kind: module
id: module:Table/useTableColumnsVirtualization
authority: current
archive_reason: null
superseded_by: null
approved_by: humbertovirtudes
approved_at: 2026-11-10
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    theming,
    accessibility,
    interaction,
    performance,
    react-runtime,
  ]
verified_by:
  [
    packages/core/src/Table/plugins/virtualization/useTableColumnsVirtualization.test.tsx,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    architecture:list-windowing,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:react-component-runtime,
    spec:AST-002,
    spec:AST-009,
    spec:AST-025,
  ]
---

# useTableColumnsVirtualization module contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                        |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `useTableColumnsVirtualization({initialViewportWidth})` 返回一个不透明的 `TableVirtualizationCapability`；`Table.virtualization` 接受它，或把它与行能力并列放入一个列表。Table 保留数据、列、标识、宽度与插件。 |
| Behavior                | 对钉住起始区段与结束区段之间未钉住的列做行内轴窗口化，每侧带两个内部过扫描列，至多保留一个被聚焦的列，并保持原生表格语义与父级拥有的单元格前规划。                                                              |
| End-user impact         | 已挂载的单元格保留其控件、焦点与全表列位置；未挂载的列不承诺可被虚拟光标发现。                                                                                                                                  |
| Builder impact          | 调用方保留其列定义与宽度，并接受单行内容；仅含列的 Table 保持其块尺寸，不受支持的内容或结构回退为渲染所有列。                                                                                                   |
| Compatibility/readiness | 新增式能力；不添加它时输出不变。实现与数值验证仍是各自独立的发布要求。                                                                                                                                          |
| Review checks           | 拒绝先渲染再隐藏、第二个滚动所有者、表头/表体列漂移、焦点丢失、无界保留、相对于窗口的列位置，以及未经测量的预算声明。                                                                                           |
| Governing rules         | `component:Table` 拥有列、宽度、钉住区段、准入、渲染规划与视口。`module:Table/useTableRowsVirtualization` 拥有块轴。`architecture:list-windowing` 拥有共享窗口计算。`spec:AST-025` FR18/FR19 约束滚动。         |

本表是审查用的投影；以下正文具有权威性。

## Intent

`useTableColumnsVirtualization` 为列数众多的 Table 限定已挂载单元格的数量。它的能力只携带一个种子宽度；宽度来自 Table 自身的列布局，而 Table 拥有语义渲染管线。

## Compatibility and migration

- 保留已发布的默认行为：`yes`；不带该能力时，Table 的输出不变。
- 兼容性类别：新增式 hook 与能力。`Table.virtualization` 从接受一个能力扩展为接受一个能力或一个列表，这使所有既有调用仍然有效。
- 迁移决策：`module:Table/useTableColumnsVirtualization/DEC-1` 与 `component:Table` FR18。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 行内轴种子、钉住区段之间的窗口化区段，以及 Table 进入共享列表窗口的准入。
- Table 的焦点保留参与、列锚点策略，以及列窗口化带来的可访问性结果。
- 列窗口化的准入及其性能目标。

**不拥有 / 非目标**

- 列、宽度、钉住区段、调整大小、列设置、标识、渲染模式与视口：`component:Table` 及其插件模块。
- 块轴窗口化：`module:Table/useTableRowsVirtualization`。
- 可见范围、内部过扫描、行内空隙几何、首个可见键锚点计算、焦点列保留与偏移辅助函数：共享窗口化模块 `architecture:list-windowing`。本模块向它提供 Table 的列间距、钉住区段与准入。
- 分组表头或多行表头、跨列的单元格、详情行或自定义行、垂直书写模式、页面级水平滚动、过扫描设置或 `scrollToColumn` API。

## Public API and concepts

该 hook 依据 `initialViewportWidth` 返回一个不透明的 `TableVirtualizationCapability`，从不返回列或宽度。初始宽度只为第一个窗口提供种子；它不给任何元素定尺寸。挂载之后，实测的行内视口决定窗口。

| Concept    | Values or states                         | Meaning                                       | Default            | Owner                                         | Stability |
| ---------- | ---------------------------------------- | --------------------------------------------- | ------------------ | --------------------------------------------- | --------- |
| 种子       | 正的有限 CSS 像素 `initialViewportWidth` | 第一个窗口规划所依据的行内视口宽度            | 必填               | 本模块                                        | 稳定      |
| 能力       | 不透明的、与 Table 兼容的值              | 携带行内意图，而非切片后的列或引擎句柄        | 未选择启用时不存在 | 本模块；由父级消费                            | 稳定      |
| 列间距     | Table 布局在表格最小宽度下赋予每列的宽度 | 每列一个宽度，与钉住偏移所用的宽度相同        | 派生               | `component:Table`                             | 父级依赖  |
| 窗口化区段 | 钉住起始区段与结束区段之间未钉住的列     | 唯一可以卸载的列                              | 派生               | 本模块                                        | 稳定      |
| 范围       | 窗口化区段的半开连续区间                 | 过扫描之前与视口相交的列                      | 派生               | `architecture:list-windowing`                 | 稳定      |
| 焦点列     | 不存在，或一个被保留的列                 | 使被聚焦单元格所在列在范围之外保持挂载        | 不存在             | `architecture:list-windowing`；既有焦点所有者 | 稳定      |
| 元数据     | 逻辑列索引与列数                         | `aria-colindex` 与 `aria-colcount` 的单一来源 | 派生               | `component:Table`                             | 父级依赖  |

## Behavioral contract

这些需求定义完整的规范性契约。实现、浏览器、可访问性与性能验证仍是发布要求。

| ID   | Invariant                                                                                                                                                                                                                                            | Basis                   | Verification state |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- | ------------------ |
| FR1  | 种子不变时保持能力标识不变。列、宽度、钉住区段、数据与已挂载范围不变时，保持输出标识不变，且不会再次调用产品渲染器。                                                                                                                                 | 父级记忆化              | 发布所需           |
| FR2  | 钉住的起始与结束区段始终挂载。在窗口化区段中，已挂载的列是一个连续区间，每侧带两个过扫描列，另加至多一个不连续的焦点列。若没有未钉住的列，列窗口化不产生任何改变。                                                                                   | DEC-2；有界 DOM         | 发布所需           |
| FR3  | 每列的间距是 Table 布局在表格最小宽度下赋予该列的宽度，与钉住偏移所用宽度相同，包括被加宽的行号列。当行内视口不小于表格最小宽度时，所有列都挂载。                                                                                                    | 父级 FR13/FR19；DEC-3   | 发布所需           |
| FR4  | 表头行与每个表体行渲染相同的列结构：钉住的起始单元格、已挂载范围与焦点列周围至多三个不可访问的原生占位单元格、已挂载单元格，以及钉住的结束单元格。一个占位单元格的宽度是它所代表各列宽度之和，且没有内容、内边距、边框、状态、焦点停靠点或产品变换。 | 原生 HTML；表头关联     | 发布所需           |
| FR5  | 在列处于窗口化状态时，Table 暴露等于完整列数的 `aria-colcount`，并且每个已挂载的表头与表体单元格都携带表示其全表位置的 `aria-colindex`。未进行列窗口化时，两个属性都不添加。                                                                         | 父级 FR23；全表语义     | 发布所需           |
| FR6  | 服务端与首次客户端使用相同的种子：起始位置落在 `initialViewportWidth` 减去两侧钉住区段宽度以内、再加上过扫描的列，即为窗口化列。不存在先完整渲染再折叠，或先渲染为空再修复的做法。                                                                   | SSR；运行时架构         | 发布所需           |
| FR7  | 当被聚焦单元格所在列离开范围时，该列连同其原始子树保持挂载。真实的焦点离开、移除或返回会释放它；焦点转移会替换它。仅滚动永远不会移动焦点。                                                                                                           | 既有焦点所有者；DEC-4   | 发布所需           |
| FR8  | 列顺序、宽度、可见性与钉住状态的变化会保留首个可见列的键及其小数偏移；被移除的锚点先解析到下一个仍然存在的列，然后是前一个列，最后是起始位置。                                                                                                       | 列设置与调整大小；DEC-4 | 发布所需           |
| FR9  | 行内几何使用父级共享的视口测量与池化尺寸调整路径；列窗口化不添加自己的订阅、观察器或帧。钉住区段的宽度只从行内视口中减去一次。                                                                                                                       | 父级 FR19；spec:AST-025 | 发布所需           |
| FR10 | 与 `useTableRowsVirtualization` 一起使用时，行与列一同窗口化：行空隙横跨已挂载的列结构，被保留的聚焦单元格同时保留其行与列。                                                                                                                         | 行模块 FR2/FR7          | 发布所需           |
| FR11 | 渲染之前，准入要求：数据模式、显式有效标识（父级 FR18）、由 Table 拥有的滚动包裹层、单行表头、扁平行，以及声明的最小表格宽度不超过各列宽度之和；挂载之后发现跨列单元格会锁定同样的回退。任何不受支持的情形都会渲染所有列，并在开发环境给出警告。     | 父级 FR18；DEC-2        | 发布所需           |
| FR12 | 传给 `Table.virtualization` 的列表至多包含一个行能力与一个列能力；任何其他列表都不做窗口化渲染，并在开发环境警告一次。                                                                                                                               | 父级 FR18；DEC-1        | 发布所需           |
| FR13 | 挂载或卸载列不会改变任何行的高度：未指定 `textOverflow` 时默认为单行截断，而显式 `wrap` 或没有固定高度准入的自定义单元格渲染器会渲染所有列。                                                                                                         | 行模块 FR14；DEC-2      | 发布所需           |
| FR14 | 仅含列的 Table 保持其未窗口化时的块尺寸与块滚动；只有行能力才会给 Table 提供父级尺寸的块视口（`component:Table` FR19）。                                                                                                                             | 父级 FR1/FR19           | 发布所需           |

### Performance and resources

- **PR1 — 结构上限。** 在未被遮挡的行内视口 `W` 与最窄窗口化列宽 `w` 下，已挂载的窗口化列至多为 `ceil(W/w)+1+4+1`；最后一项是可选的焦点列。单元格数量随已挂载行数乘以已挂载列数增长，绝不随总列数增长。
- **PR2 — 工作稳定。** 在当前范围内的滚动不调用任何产品渲染器；范围变化只挂载与卸载进入或离开的列。
- **PR3 — 时间目标。** 在 1,000 列、20 个已挂载行的条件下，一次行内滚动的 p95 范围计算加提交时间至多 4 ms；空操作滚动至多 2 ms。
- **PR4 — 证据。** 目标是发布要求，而非实测结果；验证会记录环境、浏览器、列数、宽度以及 p50/p95/max。

## Accessibility contract

- **AR1 — 原生语义。** 表头关联保持基于位置且为原生；占位单元格没有可访问名称，也不具有数据、控件或状态角色。
- **AR2 — 位置。** `aria-colindex` 与 `aria-colcount` 报告全表位置（FR5）；声明仅覆盖已挂载的单元格。
- **AR3 — 键盘访问。** 父级命名视口在两个轴上保持原生方向键滚动，并保持 Tab 遍历已挂载控件；Tab 不声明能到达未挂载的列。
- **AR4 — 焦点保留。** FR7 保留被聚焦单元格所在的列；焦点绝不会因某列卸载而跳转。

## Design relationships

| Anatomy/state | Design requirement                  | Representation authority      | Module contract |
| ------------- | ----------------------------------- | ----------------------------- | --------------- |
| 产品单元格    | 外观与控件与未窗口化时相同          | 既有的 Table 目标与状态所有者 | FR4；FR11       |
| 占位单元格    | 仅几何；不可访问且不绘制            | 本模块；无主题目标            | FR4             |
| 钉住区段      | 始终挂载，偏移不变                  | `useTableStickyColumns`       | FR2；FR3        |
| 视口          | 一个协调的、由 Table 拥有的滚动区域 | 父级 FR19                     | FR9             |

本模块不添加主题目标。

## Parent and system relationships

- `component:Table` FR13 拥有列宽与下限；FR18 拥有准入与 `Table.virtualization` 属性；FR19 拥有双轴视口与共享几何。
- `useTableStickyColumns` 拥有钉住区段及其偏移，本模块只读取它们，从不移动。
- `useTableColumnResize` 与列设置拥有宽度、顺序与可见性变更；FR8 在这些变更之间保持行内锚点。
- `module:Table/useTableRowsVirtualization` 拥有块轴；FR10 约束两者的组合。
- `architecture:list-windowing` 拥有共享窗口化模块。它根据 Table 提供的间距、钉住区段与行内几何来计算列范围、保留的焦点列与锚点，与处理行的方式相同。

## Verification map

| Contract          | Verification                                 | Representative states                                                      | Mutation/failure expectation                                                           |
| ----------------- | -------------------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| FR1-FR6；PR1-PR2  | 真实的 Table 渲染器计数、原生 DOM 与几何测试 | 无未钉住列、起始/中间/结束、钉住起始与结束、加宽的行号、挂载所有列的宽视口 | 表头/表体漂移、带内容的占位单元格、相对于窗口的 `aria-colindex` 或无界范围，均判定失败 |
| FR7-FR10；AR3-AR4 | 真实浏览器中的焦点与锚点集成                 | 被聚焦输入框滚出再滚回、调整大小、重排、隐藏、钉住、行与列同时进行         | 焦点丢失、首个可见列跳变，或行空隙跨度错误，均判定失败                                 |
| FR11-FR14         | 准入测试                                     | 分组表头、跨列单元格、换行内容、重复能力                                   | 对不受支持的情形做窗口化，或回退时没有相应警告，均判定失败                             |
| PR3-PR4           | 浏览器帧轨迹                                 | 1,000 列、20 行、行内滚动与空操作                                          | 预算超支且没有记录在案的决策，判定失败                                                 |

## Decision log

### DEC-1 — A sibling capability in the same prop

**引用：** `module:Table/useTableColumnsVirtualization/DEC-1`
**决策者：** `humbertovirtudes`，`2026-11-10`

列窗口化是一个独立的 hook，与 `useTableRowsVirtualization` 并列，而 `Table.virtualization` 接受一个能力或它们的列表。
已否决：增加第二个 Table 属性，以及用一个合并 hook 让行有两种表达方式。

### DEC-2 — Unpinned columns window; pinned runs stay

**引用：** `module:Table/useTableColumnsVirtualization/DEC-2`
**决策者：** `humbertovirtudes`，`2026-11-10`

钉住的起始与结束区段始终挂载，因此它们的偏移与绘制仍归粘性列所有者负责。只有它们之间的区段做窗口化。
已否决：对钉住的列做窗口化。

### DEC-3 — Layout widths, not a declared width

**引用：** `module:Table/useTableColumnsVirtualization/DEC-3`
**决策者：** `humbertovirtudes`，`2026-11-10`

列已经声明带下限的 `pixel()` 或 `proportional()` 宽度，溢出的 Table 以其最小宽度渲染。窗口使用布局在那里赋予每列的宽度，因此调用方无需添加宽度。
已否决：统一的 `columnWidth`，以及对屏幕外列进行测量。

### DEC-4 — One focus column and a first-visible-key anchor

**引用：** `module:Table/useTableColumnsVirtualization/DEC-4`
**决策者：** `humbertovirtudes`，`2026-11-10`

保留一列以维持焦点；首个可见列的键与小数偏移在列变更之间为行内滚动提供锚点。
已否决：把范围拉伸到远处的聚焦列。

## Open questions

无。规范性契约已完整。实现与发布验证仍与契约批准相互独立。

## Content boundary

本记录不重复使用方签名/示例、父级协议、研究、实测结果、实现步骤或通用虚拟化算法。
