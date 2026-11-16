---
schema_version: 3
template_version: 1
kind: module
id: module:Table/useTableRowStatus
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Table/plugins/rowStatus/useTableRowStatus.test.tsx,
    scripts/check-knowledge.mjs,
  ]
parent_component: component:Table
references:
  [
    component:Icon,
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:public-component-api,
    spec:AST-002/DEC-6,
  ]
---

# useTableRowStatus module contract

## Intent

`useTableRowStatus` 增加一个可选的生成式状态槽，为每个 Table 行传达一个结果或调用方定义的标记。该模块拥有其公共状态词汇、生成的列与指示器解剖结构、无障碍命名、内部指代符解析、无效输入回退、性能义务以及实现证据。

本现行契约对该模块的预期行为具有权威性。运行时、公共类型、使用方文档和发布实现仍明确处于待定状态，并且在实现时必须遵循本契约。

## Compatibility and migration

- 保留的发布默认值：`yes`；每个稳定 `0.5.2` 自定义标记都保持相同的源码形态，以及渲染出的圆点或调用方选定的字形。
- 兼容类别：在 `getStatus` 回调边界上新增语义接口，并在下一个稳定版本之前恢复稳定行为。
- 迁移决策：无需针对稳定版使用方的 codemod，也无需稳定版使用方做任何必填修改。曾刻意采用来自 [#5671](https://github.com/meta/astryx/pull/5671) 的隐式语义字形的金丝雀使用方，需手动从 `{color: 'error', label}` 迁移为 `{status: 'error', label}`。

稳定版 `0.5.2` 已将 `{color, label}` 定义为调用方绘制的圆点，并将 `{color, icon, label}` 定义为调用方选定字形且由调用方选定绘制。导出的 `TableRowStatus` 接口保持逐字节不变，因此现有的注解、接口扩展和声明合并仍然有效。

基于值的 codemod 并不安全，因为稳定版 `{color: 'error', label}` 可能有意表示一个错误色圆点。如果语义实现在稳定版切分之前尚未就绪，则应先恢复自定义标记行为并推迟新的语义接口；被重载的金丝雀行为绝不得进入稳定版。

这项仅涉及规格的改动不携带包 Changeset。实现 pull request 负责公共导出、使用方文档、测试、发布说明及其包版本 Changeset。

## Ownership boundary

**拥有**

- 公共 `useTableRowStatus` hook、`UseTableRowStatusConfig`、未改动的 `TableRowStatus` 自定义标记接口，以及提议的 `TableSemanticRowStatus` 接口。
- `getStatus` 的排他性结果边界，包括用 `null` 表示无标记。
- 生成的固定宽度列、视觉隐藏的表头名称、空单元格行为、指示器 DOM，以及内部 `icon | dot` 变体解析。
- 在委托字形渲染之前，将语义行状态映射到共享的语义 Icon 名称和色调。
- 无类型语义/自定义冲突时的运行时优先级与警告行为。
- 行状态的无障碍、性能约束、迁移以及证据。

**不拥有 / 非目标**

- 聚合的 `TablePlugin` 协议、转换阶段、命名插件排序、槽组合、故障隔离或插件数组标识——由 `component:Table` 拥有。
- Icon 图稿、Icon 的目标，或共享图标解析——由 `component:Icon` 和 `architecture:icon-resolution-and-component-slots` 拥有。
- 当前主题的语义令牌值或具体语义图稿。主题通过现有契约提供这些内容；它不选择本模块的内部变体。
- 自定义颜色或自定义图标的特定于产品的含义。调用方拥有该含义，并提供必需的 label。
- 共享的设计反馈词汇。Table 行结果并不构成反馈组件的权威。
- 公共的 `variant` 或 `presentation` prop、可扩展变体映射、反射的变体 data 属性，或行状态主题选择器轴。
- 本契约不批准任何 `table-row-status` 目标。[#5754](https://github.com/meta/astryx/pull/5754) 仍在本契约范围之外，留待单独的 AST-002 提议，用以证明主题作者需求、绘制器放置位置和确切保证。

## Public API and concepts

提议的公共接口和回调边界均为新增式：

```ts
export interface TableRowStatus {
  color: TableRowStatusColor | (string & {});
  icon?: IconName;
  label: string;
}

export interface TableSemanticRowStatus {
  status: 'success' | 'warning' | 'error';
  color?: never;
  icon?: never;
  label: string;
}

export interface UseTableRowStatusConfig<T extends Record<string, unknown>> {
  getStatus: (
    item: T,
  ) => (TableRowStatus & {status?: never}) | TableSemanticRowStatus | null;
}
```

`TableRowStatus` 保持为现有导出接口，逐字节不变。排他性联合只存在于回调边界，在该边界处其自定义成员与 `{status?: never}` 相交。这样既为注解、扩展和声明合并保留了现有接口，又不允许受支持的语义状态与自定义标记输入混用。`TableRowStatusColor` 以及现有的 `string & {}` CSS 颜色逃生舱口保持不变；本契约不新导出该颜色类型。

| Concept        | Closed values or states              | Meaning                                                        | Default                    | Owner                            | Stability                  |
| -------------- | ------------------------------------ | -------------------------------------------------------------- | -------------------------- | -------------------------------- | -------------------------- |
| 行状态存在性   | 任一公共接口或 `null`                | 为该行添加一个指示器，或让生成的单元格保持为空。               | `null` 表示不存在          | `module:Table/useTableRowStatus` | 存在性稳定；语义形态为新增 |
| 语义结果       | `success`、`warning`、`error`        | 选择一个内聚的、由系统拥有的结果，其字形与色调被一同推导出来。 | 无隐式结果                 | `module:Table/useTableRowStatus` | 新增式提议                 |
| 自定义标记绘制 | 现有 Table 行状态颜色或某个 CSS 颜色 | 仅选择绘制；任何颜色值都不隐含语义结果或表示。                 | 在 `TableRowStatus` 上必需 | 调用方经由本模块                 | 稳定 `0.5.2`               |
| 自定义标记字形 | `IconName` 或缺省                    | 选择调用方拥有的字形；缺省则选择圆点。                         | 缺省表示圆点               | 调用方经由本模块                 | 稳定 `0.5.2`               |
| Label          | 必需的字符串                         | 为指示器命名，并提供补充性的 tooltip 文本。                    | 必需                       | 调用方经由本模块                 | 稳定                       |
| 解析后的变体   | 内部 `icon` 或 `dot`                 | 命名由已接受结果推导出的指代符解剖结构，而非调用方的选择。     | 推导得出                   | `module:Table/useTableRowStatus` | 内部                       |

实现落地后，使用方文档拥有最终的导入语法、参考表和示例。

## Behavioral contract

| ID   | Invariant                                                                                                                                                                                                                                             | Basis                                 | Implementation/evidence state            |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---------------------------------------- |
| FR1  | 给定引用稳定的 `getStatus`，`useTableRowStatus` 返回一个稳定的 `TablePlugin`，它向父管线贡献一个 `transformColumns` 函数。                                                                                                                            | 当前源码与稳定行为                    | 已验证基线；语义分支待定。               |
| FR2  | 在由父级拥有的转换位置上，本模块前置一个固定的 28 CSS 像素、不可调整大小的生成列。视觉上空白的表头具有本地化的无障碍名称；`null` 使该行的生成单元格保持为空。                                                                                         | 稳定 `0.5.2` 行为                     | 所有者指示的模块契约；组合证据待定。     |
| FR3  | `TableRowStatus` 保持为导出的稳定 `{color, icon?, label}` 接口，逐字节不变。`color` 始终只控制绘制。`icon` 缺省时解析为现有圆点；`icon` 存在时解析为调用方选定的字形并使用调用方选定的绘制，包括颜色字符串为 `success`、`warning` 或 `error` 的情况。 | 稳定 `0.5.2` 兼容性与所有者指示       | 所有者指示；当前金丝雀重载必须回退。     |
| FR4  | `TableSemanticRowStatus` 只接受 `success`、`warning` 或 `error` 以及必需的 `label`。每个状态都解析为匹配的共享语义 Icon 名称，以及来自当前主题的语义色调。调用方的 `color` 与 `icon` 被禁止。                                                         | 所有者指示，2026-09-01；Icon 解析契约 | 所有者指示；实现与主题替换待定。         |
| FR5  | 内部变体对每个语义状态解析为 `icon`，对无 icon 的自定义颜色解析为 `dot`，对有 icon 的自定义颜色解析为 `icon`。变体仅是内部/解剖结构术语。                                                                                                             | 所有者指示，2026-09-01                | 所有者指示；未批准任何公共或主题暴露。   |
| FR6  | 只有 `getStatus` 形成上所示的排他性回调联合，将自定义接口与 `status?: never` 相交。有类型的调用方无法在提供受支持 `status` 的同时提供 `color` 或 `icon`；独立的稳定接口未被收窄。                                                                     | 所有者指示与 AST-002 FR15-FR16        | 类型形态已独立验证；仓库测试夹具待定。   |
| FR7  | 对于带有受支持 `status` 以及 `color` 和/或 `icon` 的无类型对象，语义状态优先，自定义字段被忽略，开发环境对已加载的行状态模块实例最多发出一次警告。生产环境不发出警告，并渲染相同的语义结果。                                                          | 所有者指示，2026-09-01                | 所有者指示；运行时覆盖待定。             |
| FR8  | `label` 在两个接口上都仍然是必需的。外层指示器暴露一个无障碍图像名称；嵌套的 Icon 是装饰性的。tooltip 文本是补充性的，不是唯一的传达路径。                                                                                                            | 稳定行为与所有者指示                  | 命名由所有者指示；浏览器与 AT 证据待定。 |
| FR9  | 语义接口通过可区分的主题化字形提供非颜色线索。自定义圆点不承诺调用方选定的绘制是共享语义结果，或独立的非颜色线索。                                                                                                                                    | 所有者指示与无障碍边界                | 所有者指示；主题与强制颜色证据待定。     |
| FR10 | 本模块通过父级 `TablePlugin` 协议组合，不重新定义也不依赖私有的第二套转换顺序。它向其解析位置上收到的列前置该列，并且在受支持的选择、展开、分组、空数据以及自定义插件组合下仍然有效。                                                                 | 父级协议与所有者指示                  | 组合矩阵待定。                           |

### Transformation and precedence order

- **ORD1 — 结果存在性。** `null` 不产生任何指示器。非 null 结果进入分支解析。
- **ORD2 — 语义分支。** 受支持的 `status` 在自定义标记解析之前选择语义结果，并一同推导匹配的色调与共享字形。
- **ORD3 — 无效的语义/自定义混合。** 当无类型输入还携带 `color` 或 `icon` 时，忽略这些字段。在开发环境中，模块级去重只对已加载的模块实例发出第一条警告；重复的行和渲染不会刷屏控制台。生产环境渲染语义结果且不发出警告。
- **ORD4 — 自定义分支。** 没有受支持的语义状态时，自定义 `color` 选择绘制；`icon` 的存在决定使用调用方字形还是圆点。
- **ORD5 — Icon 委托。** 本模块选择共享语义 Icon 名称，然后由当前主题现有的共享注册表选择图稿。主题不选择内部变体。
- **ORD6 — 父级管线。** 本模块在 `component:Table` 提供的转换位置上前置其列；父级拥有所有相对顺序以及后续渲染阶段。

### Performance and resources

- **PR1 — 常量行工作量。** 结果与变体解析对每个渲染行执行常量工作，并且不添加任何布局测量、监听器、观察器、定时器或异步资源。
- **PR2 — 稳定标识。** 引用稳定的 `getStatus` 保持模块的 `TablePlugin` 标识。新增语义解析不得仅因分支从 `color` 移到 `status` 而使未改动的行重新渲染。
- **PR3 — 现有主题路径。** 语义字形与色调解析使用现有的同步 Icon/主题路径，而不是并行注册表或逐行主题订阅。
- **PR4 — 警告上限。** 无效输入诊断只保留一个模块级的布尔等价去重状态，并且对于每个已加载的模块实例最多发出一次。

当前测量数据属于审计证据。实现验证必须将语义/自定义用例加入代表性的 Table 渲染与空操作更新预算中。

## Accessibility contract

- **AR1 — 具名槽。** 视觉上空白的生成列表头必须保留一个本地化的无障碍名称，用于标识行状态列。
- **AR2 — 单一指示器名称。** 每个非 null 结果必须从必需的 `label` 暴露恰好一个无障碍图像名称；任何嵌套 Icon 都保持装饰性。
- **AR3 — 语义非颜色线索。** 语义结果必须在受支持的主题和强制颜色行为下，同时使用可区分的共享字形与语义色调。
- **AR4 — 诚实的自定义契约。** 自定义圆点仍是调用方选定的、仅绘制用的标记。必需的 `label` 提供其程序化名称，但本模块不得声称圆点本身在没有颜色的情况下传达自定义含义。
- **AR5 — 补充性 tooltip。** tooltip 可以重复 `label` 作为指针帮助，但在不打开它的情况下，指示器的无障碍名称必须仍然充分。当前指示器不可聚焦，因此 tooltip 的存在不构成键盘证据。
- **AR6 — 行上下文。** 具名状态在其行上下文中暴露，且没有重复名称，并在无障碍树上得到证明。在 `spec:AST-009` 下，对通知的辅助技术观察是推荐的后续工作。

## Design relationships

| Anatomy or state | Design requirement                                   | Representation authority                    | Module contract      |
| ---------------- | ---------------------------------------------------- | ------------------------------------------- | -------------------- |
| 行状态列         | 将可选的行结果对齐在一个狭窄的生成槽中。             | 本模块；相对列顺序属于 `component:Table`。  | FR1, FR2, FR10, AR1  |
| 行状态指示器     | 拥有该行的无障碍状态名称，并包含一个已解析的指代符。 | `module:Table/useTableRowStatus`            | FR3-FR9, AR2-AR6     |
| `icon` 指代符    | 通过 Icon 使用语义字形或调用方选定的字形。           | 本模块选择含义；`component:Icon` 负责渲染。 | FR3-FR5, AR2, AR3    |
| `dot` 指代符     | 使用稳定的、仅绘制用的自定义圆点。                   | 本模块，使用调用方选定的绘制。              | FR3, FR5, AR4        |
| 无效的无类型混合 | 保持内聚的语义结果，而不组合自定义轴或淹没诊断信息。 | `module:Table/useTableRowStatus`            | FR6, FR7, ORD2, ORD3 |

未批准任何直接的行状态目标或变体选择器。语义图标渲染委托给现有的 `icon` 目标。自定义圆点没有直接的公共目标。由于此规格 PR 不改变使用方解剖结构元数据，因此不添加 `anatomy-theming:v1` 块。后续的直接目标提议需要其自身的 AST-002 审查以及同步的使用方解剖结构。

## Parent and system relationships

- `component:Table` 拥有聚合的 `TablePlugin` 转换协议、基础先于用户的排序、规范的命名插件顺序、槽组合、故障隔离、上下文嵌套以及插件数组标识。本模块仅拥有行状态贡献，且不得重复或覆盖该顺序。
- `component:Icon` 拥有字形呈现、尺寸、颜色、目标，以及装饰与具名 Icon 的语义。行状态指示器保留外层名称。
- `architecture:icon-resolution-and-component-slots` 拥有共享语义键解析。本模块选择 `success`、`warning` 或 `error`；它不创建任何 Table 专用的组件图标槽。
- `architecture:component-theming-surface` 拥有目标限定，并且在任何 `table-row-status`、`variant` 或 `presentation` 选择器公开之前要求一项单独的决策。
- `architecture:public-component-api` 和 `spec:AST-002/DEC-6` 要求稳定的自定义接口、新增式语义接口以及仅限回调的排他边界，以保持每个公共输入的职责连贯。

## Verification map

| Contract                 | Verification                                                                                                                | Representative states                                                     | Mutation or failure expectation                                                                                          |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| FR1, FR2, FR10           | 用固定列元数据、`null`、空数据、分组行、选择/展开组合以及父级顺序排列来扩展 `useTableRowStatus.test.tsx`。                  | 模块单独运行，以及与受支持的第一方/自定义插件一起运行。                   | 列被丢弃、重复、调整大小、丢失表头名称，或假定存在第二套/私有插件顺序。                                                  |
| FR3, FR4, FR6            | 为未改动的接口、声明合并与扩展、语义接口、回调联合、缺失 label、未知状态以及被禁止的混合新增公共子路径编译夹具。            | 稳定的自定义注解/扩展；所有语义状态。                                     | `TableRowStatus` 发生变化或不再合并、语义用法不可达，或受支持的状态与自定义字段混用。                                    |
| FR3-FR5                  | 用看似语义的自定义颜色、原始/调色板圆点、显式自定义图标、所有语义状态以及当前主题替换来扩展行状态运行时测试。               | 自定义圆点、自定义图标和三种语义结果。                                    | 自定义颜色选择了隐式字形、语义状态绕过共享解析，或变体变成调用方/主题输入。                                              |
| FR7, ORD2-ORD4, PR4      | 在开发与生产模式下，用重复的混合对象、行和渲染进行运行时测试。                                                              | `status + color`、`status + icon` 以及全部三个字段。                      | 自定义输入覆盖了受支持的状态、被禁止的字段影响了输出、生产环境发出警告，或开发环境对每个已加载模块实例发出多于一次警告。 |
| AR1-AR6                  | 现有的 role/name 测试，加上浏览器 axe、强制颜色、tooltip 模态以及无障碍树行上下文证据；VoiceOver 表格导航是推荐的后续工作。 | 语义字形、自定义图标、自定义圆点、`null`、浅色/深色，以及所有已发布主题。 | 表头或指示器丢失名称、嵌套字形被朗读两次、字形区分消失、tooltip 成为唯一含义，或行上下文重复了状态。                     |
| PR1-PR3                  | 用语义/自定义的初始渲染与空操作更新用例来扩展 `Table.perf.test.tsx`。                                                       | 稳定重渲染、混合行以及主题替换。                                          | 解析过程添加了测量/资源、创建了并行注册表，或超出既有的代表性 Table 预算。                                               |
| Structural ownership     | `scripts/check-knowledge.mjs`。                                                                                             | 同目录存放的模块、规范文件名/ID，以及父级反向链接。                       | 缺失、重复、孤立、父级错误、命名错误或未被发现的记录通过了校验。                                                         |
| Public hygiene and scope | Prettier、`check:knowledge`、检查器测试、`check:repo`、变更文件扫描以及公共内容扫描。                                       | 父级反向链接加上一个模块规格；无 Changeset。                              | 运行时/文档文件、私有上下文、无效记录形态或无关改动进入了本契约提议。                                                    |

实现以及浏览器/辅助技术证据仍待定。通过此规格 PR 的检查只证明记录完整性，而不证明未来的运行时行为。

## Decision log

这些条目记录已批准的所有者指示。运行时实现及其证据仍待定。

### DEC-1 — Preserve the custom interface; union only at the callback boundary

**引用：** `module:Table/useTableRowStatus/DEC-1`

**决策者：** cixzhang，2026-09-01

导出的 `TableRowStatus` 接口保持为稳定自定义标记契约，逐字节不变，从而使现有的注解、扩展和声明合并继续可用。一个单独导出的 `TableSemanticRowStatus` 接口拥有语义结果。只有 `getStatus` 通过将自定义接口与 `{status?: never}` 相交，形成二者的排他联合。

已否决：用联合别名替换 `TableRowStatus`，或向其中添加语义字段。任一选择都会改变稳定版使用方已在使用的扩展面。

### DEC-2 — Derive variant and delegate semantic artwork

**引用：** `module:Table/useTableRowStatus/DEC-2`

**决策者：** cixzhang，2026-09-01

本模块从语义意图与自定义意图推导内部 `icon | dot` 变体。语义状态选择匹配的共享 Icon 名称与色调；当前主题提供具体图稿与令牌值。自定义颜色保留调用方拥有的绘制和可选字形。

已否决：公共 `variant` 或 `presentation`、语义调用方覆盖、Table 专用的语义图标注册表，以及将推导出的分支暴露为主题轴或 data 属性保证。

### DEC-3 — Stable behavior wins over the canary overload

**引用：** `module:Table/useTableRowStatus/DEC-3`

**决策者：** cixzhang，2026-09-01

稳定 `0.5.2` 的自定义标记行为被保留，无需 codemod。由 [#5671](https://github.com/meta/astryx/pull/5671) 引入的金丝雀行为（其中看似语义的 `color` 值会选择图标）必须在稳定版之前回退。该隐式字形的金丝雀采用方需手动迁移到 `status`。

已否决：改变稳定的自定义颜色、用 codemod 猜测语义意图，或在语义实现尚未完成时允许该重载进入稳定版。

### DEC-4 — Direct row-status theming is not approved

**引用：** `module:Table/useTableRowStatus/DEC-4`

**决策者：** cixzhang，2026-09-01

语义接口使用 Icon 现有的目标、注册表，以及主题拥有的图稿与色调。本契约记录生成的解剖结构，但不添加 `table-row-status`、`presentation`、`variant` 或等价的选器面。

所有者指示维持 [#5754](https://github.com/meta/astryx/pull/5754) 的原文。未来的直接目标需要在绘制器放置位置、主题作者需求和确切属性保证确定之后，另行进行 AST-002 审查。

### DEC-5 — Supported semantic status wins invalid untyped mixtures

**引用：** `module:Table/useTableRowStatus/DEC-5`

**决策者：** cixzhang，2026-09-01

对于包含受支持 `status` 以及 `color` 和/或 `icon` 的无类型输入，解析语义分支、忽略自定义字段，并发出一次针对已加载行状态模块实例去重的开发警告。生产环境渲染相同的语义结果且不发出警告。

已否决：允许自定义字段覆盖语义意图、组合各个轴，或每行或每次渲染都发出警告而刷屏控制台。

## Open questions

无。所有者已批准本契约中每一项模块本地判断。实现及其证据仍待定。

## Content boundary

本记录不重复使用方的导入/参考文档、父级 Table 插件协议或排序、共享 Icon/主题算法、共享反馈语言、当前审计结果或实现步骤。运行时代码、使用方文档、发布说明、Changeset 以及最终的浏览器/辅助技术证据，作为本已批准契约的实现另行落地。
