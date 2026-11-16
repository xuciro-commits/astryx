---
schema_version: 3
template_version: 7
kind: component
id: component:Pagination
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Pagination/Pagination.test.tsx,
    packages/core/src/Pagination/__tests__/PaginationLinks.a11y.browser.spec.ts,
    packages/core/src/Pagination/__tests__/PaginationTextSize.interaction.browser.spec.ts,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.chromium.spec.ts,
    packages/core/src/hooks/useListFocus.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:bidirectionality, design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [spec:AST-020/FR15, spec:AST-085, spec:AST-086, spec:AST-094, spec:AST-102]
---

# Pagination component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                                                                                                                                                            |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | Pagination 接受 `page`、`onChange`、`changeAction`、`getPageHref`、`as`、`totalItems`、`totalPages`、`hasMore`、`pageSize`、`pageSizeOptions`、`onPageSizeChange`、`variant`、`pageLabel`、`hasFirstLast`、`step`、`siblingCount`、`size`、`isDisabled`、`label` 以及基础 props。                                               |
| 行为            | 一个带标签的导航地标，围绕特定变体的指示器放置 Previous 与 Next 按钮。每次页码变更都会调用 `onChange`，播报新页码，并以乐观页码运行可选的 `changeAction`。使用 `getPageHref` 时，Button 控件是指向各页 URL 的链接（FR16）。                                                                                                     |
| 终端用户影响    | 人们通过按钮、页码、圆点或输入页码来翻页，屏幕阅读器用户会听到其落到的页码。页面链接会在新标签页中打开，其地址可以复制。在持有焦点时变得不可用的控件会保留该焦点，无论它是按钮还是链接（FR13、FR19）。                                                                                                                          |
| 构建者影响      | 使用 `getPageHref` 时 Button 控件是链接，`onChange` 仍会为它们运行，因此调用方不在那里导航（FR17）。圆点、页码框与每页条数选择器仍为控件（FR18）。                                                                                                                                                                              |
| 兼容性/就绪状态 | 增量式：`getPageHref` 与 `as` 是可选的，`onChange` 保留其已发布的类型（DEC-3）。默认值无变更。圆点渲染为 `radio` 圆点的 `radiogroup`（FR9），这是一项 DOM 与可访问性树的变更。圆点没有粗略指针命中区域，被委派的 Button 自带其间隙；两者都列在“当前状态影响”下。                                                                |
| 审查检查项      | 拒绝以下情况：页码变更超出 1 到总数之外、变更页码却不播报、已禁用的 Pagination 仍变更页码、地标没有名称、被委派的控件被 Pagination 重新主题化、已禁用或不可用的控件上带链接，或浏览器在别处打开的点击引发页码变更。                                                                                                             |
| 管辖规则        | `spec:AST-020` FR15、DEC-4；`spec:AST-085` FR1、FR4、FR7；`spec:AST-086`；`spec:AST-094` FR42；`spec:AST-102` FR4；`family:navigation-destinations`；`component:Button` FR11；`design:bidirectionality` DR6；`design:reduced-motion` DR1；`architecture:component-theming-surface`；`architecture:internationalization` INV1a。 |

此表是审查投影；下文正文具有权威性。

## Intent

Pagination 呈现用于翻页的控件，并可能让人们选择每页条数或直接输入页码。它拥有页数运算、各变体渲染哪些控件、页码变更流程与播报，以及它的四个本地主题化目标。使用方用法见 `Pagination.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：`yes`；`variant="pages"`、`pageSize={10}`、`step={1}`、`siblingCount={1}`、`size="md"`
- 兼容性类别：增量式；`getPageHref` 与 `as` 是可选 props，`onChange` 保留其已发布的类型（DEC-3）；圆点的 DOM 从名为 "Go to page N"、带 `aria-current="page"` 的一组 `button` `group` 变为名为 "Page N"、带 `aria-checked` 的 `radio` 圆点 `radiogroup`（FR9）
- 受控/非受控行为：受控；`page` 是已提交的页码，Pagination 仅在 `changeAction` 待处理时显示乐观页码
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**Owns**

- Pagination 导航地标及其当前的 `pagination` 目标。
- Dot、页码输入标签与页码输入总数这三个部件及其当前的 `pagination-dot`、`pagination-input-label` 与 `pagination-input-total` 目标。
- 选择当前分页配置渲染哪些稳定控件与读板。
- 页数运算、步长钳制、带省略号的页码范围，以及页码变更流程与播报。

**Does not own / non-goals**

- Button、Text、NumberInput 或 Selector 的呈现与目标；这些仍由其各自组件拥有。
- Button 图标图形或被委派控件的其他内部实现。
- 省略号的公共目标；不存在这样的目标（OQ2）。
- 抓取或切片被分页的数据——由调用方拥有。
- 页面链接的链接元素及其目标的接受——由 `component:Button` 与 `family:navigation-destinations` 拥有。
- 导航：页面链接的链接组件负责导航（FR17），而圆点、页码输入与每页条数选择器的导航由调用方负责。

## Public concepts

| 概念       | 封闭取值或状态                                       | 含义                                   | 按变体/朝向/状态的可用性                                     | 默认值      | 所有者                 | 稳定性 | 无效值行为                                                          |
| ---------- | ---------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------ | ----------- | ---------------------- | ------ | ------------------------------------------------------------------- |
| Page       | 从 1 开始的整数                                      | 当前页码。                             | 始终。                                                       | required    | `component:Pagination` | Stable | 不做钳制；Previous 与 Next 跟随它。                                 |
| Data shape | `totalItems`、`totalPages` 或 `hasMore`              | 已知条目数、已知页数，或游标分页。     | `totalPages` 优先于由 `totalItems` 推导出的页数。            | unknown     | `component:Pagination` | Stable | 总数为零或负数时不渲染任何内容。                                    |
| Variant    | `pages`、`count`、`compact`、`dots`、`input`、`none` | Previous 与 Next 之间放置的内容。      | 需要总数的指示器在没有总数时不渲染任何内容。                 | `pages`     | `component:Pagination` | Stable | TypeScript 会拒绝 `PaginationVariantMap` 中不存在的取值。           |
| Step       | 正整数                                               | 每次按下 Previous 与 Next 移动的页数。 | 始终。                                                       | `1`         | `component:Pagination` | Stable | 非整数或小于 1 的取值变为 1。                                       |
| Page size  | 正整数；可选选项列表                                 | 每页条目数；给出选项时是一个选择器。   | 始终。                                                       | `10`        | `component:Pagination` | Stable | 非有限值变为 10；小数向下取整；小于 1 变为 1。                      |
| First/last | 开、关                                               | 位于 Previous 与 Next 两侧的跳转按钮。 | 在已知总数时适用于 `input`（默认开）与 `compact`（默认关）。 | per variant | `component:Pagination` | Stable | 其他变体忽略它。                                                    |
| Page links | 关、开                                               | Button 控件是指向各页 URL 的链接。     | 使用 `getPageHref` 时开启；已禁用或不可用的控件保持为按钮。  | 关          | `component:Pagination` | Stable | 被拒绝的 URL 会以惰性方式渲染（`family:navigation-destinations`）。 |
| Size       | `sm`、`md`                                           | 控件尺寸。                             | 始终。                                                       | `md`        | `component:Pagination` | Stable | TypeScript 拒绝其他取值。                                           |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 依据                                                                                           |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| FR1  | 当前渲染包含一个 Pagination 地标（`<nav>`，其名称由 `label` 指定，否则为本地化的 "Pagination"；除非调用方的 `aria-labelledby` 指定了名称）以及 Previous/Next 按钮。每页条数选择器、First/Last 按钮、页码按钮、省略号、计数读板、紧凑读板、圆点、页码输入标签、页码输入与页码输入总数仅在其现有条件满足时出现。当 `totalItems` 或解析出的页数为零或更小时，Pagination 不渲染任何内容。                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试                                                                                 |
| FR2  | Pagination、Dot、页码输入标签与页码输入总数带有四个当前本地目标 `pagination`（含 `data-variant` 与 `data-size`）、`pagination-dot`（`data-active`、`data-size`）、`pagination-input-label`（`data-size`）与 `pagination-input-total`（`data-size`）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `architecture:component-theming-surface`；当前源码                                             |
| FR3  | 每页条数选择器委派给 Selector；First/Last、Previous/Next 与页码按钮委派给 Button；计数与紧凑读板委派给 Text；页码输入委派给 NumberInput。页码按钮随其标签增长，如 `component:Button` FR4 所述；省略号将其尺寸作为最小高度，因此两者都会随更大的文本尺寸增长，且换行后的行不会覆盖另一行（`spec:AST-102` FR4）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码；`component:Button` FR4；`spec:AST-102` FR4                                           |
| FR4  | 省略号在编号呈现中是 Pagination 渲染的稳定可见内容，对辅助技术隐藏，且当前不带有任何公共目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码                                                                                       |
| FR5  | 页数为 `totalPages`，否则为向上取整的 `totalItems / pageSize`，否则为未知。Previous 在第 1 页以上可用；Next 在已知计数以下可用，或在无计数而 `hasMore` 为真时可用。Previous 与 Next 按 `step` 移动，并钳制在 1 与已知计数之间；First 跳到 1，Last 跳到该计数。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前测试                                                                                       |
| FR6  | 每次页码变更都会调用 `onChange(page)`，通过共享的 polite 通道播报 "Page X of Y"（无计数时为 "Page X"），并在乐观页码显示的同时于 transition 中运行 `changeAction(page)`。若在某个变更待处理期间发生后续变更，会启动一个新的 transition。Pagination 不显示其他待处理处理方式。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `spec:AST-086`；当前测试                                                                       |
| FR7  | 当计数已知时，`pages` 为其范围显示页码按钮：当计数能放入 `5 + 2 × siblingCount` 个槽位时显示每一页；否则在接近某一端时，显示从该端起 `3 + 2 × siblingCount` 个连续页、一个省略号，以及另一端（10 页中的第 1 页显示 `1 2 3 4 5 … 10`）；在其他位置显示第一页、一个省略号、当前页及其 `siblingCount` 个相邻页、一个省略号，以及最后一页。每个页码按钮显示其数字，名称为 "Go to page N"，当前页按钮带有 `aria-current="page"`。                                                                                                                                                                                                                                                                                                                                                                                                            | 当前测试                                                                                       |
| FR8  | `count` 为可见条目范围显示 "X–Y of Z"（需要 `totalItems`）；`compact` 显示 "Page X of Y"（需要计数）；`none` 在按钮之间不显示任何内容。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前测试                                                                                       |
| FR9  | 当计数已知时，`dots` 在由本地化页指示器标签命名的单选组中为每页渲染一个圆点，作为一个复合的单选控件：当前圆点上只有一个漫游 Tab 停靠点；ArrowLeft 与 ArrowRight 遵循阅读方向（`design:bidirectionality` DR6）并循环，Home 与 End 到达第一个与最后一个圆点，焦点落在某个圆点上即选中其页；按下不会聚焦圆点，松开时的点击会聚焦它，因此在别处松开按下不会选中任何内容（WCAG 2.5.2）。禁用时，圆点通过 `aria-disabled` 保持可聚焦，且不变更任何页码。由于圆点已经承担 APG 单选组的角色，它们必须暴露其必需部件：一个 `radiogroup` 容器，以及名称为其页码的 `radio` 圆点，当前圆点上带有 `aria-checked`（`spec:AST-020` FR15、DEC-4）；方向键与 Home/End 是该复合控件采用的附加项。在粗略指针下，每个圆点必须获得不可见的命中区域，并钳制为圆点之间间隙的一半（`spec:AST-094` FR42）。实现缺口：圆点为 8 px（`sm` 时 6 px）且没有命中区域。 | `spec:AST-020` FR15、DEC-4；`spec:AST-094` FR42；`design:bidirectionality` DR6；当前源码与测试 |
| FR10 | `input` 渲染页码标签（仅视觉）、一个隐藏标签的整数 NumberInput（限于 1 与计数之间），以及计数已知时的 "/ N"。提交不同的页码会切换到该页；无已知计数时该输入被禁用。被拒绝的输入（`spec:AST-118`）保留在页码框中，并在该框的状态图标上显示其消息（`statusVariant="tooltip"`），因此该条保持其高度；在拒绝持续期间，框会加宽 `--spacing-10`，使输入的文字在图标旁保持可见。                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `component:NumberInput`；当前测试                                                              |
| FR11 | 使用 `pageSizeOptions` 时，一个标记为 "Items per page" 的 Selector 显示这些选项；选择其一会调用 `onPageSizeChange(size)`，然后切换到第 1 页。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前测试                                                                                       |
| FR12 | Previous、Next、First 与 Last 用本地化短语命名自身（当 `step` 大于 1 时，Previous 与 Next 会命名步长），并且仅在可用时将该名称作为 tooltip 显示。其 chevron 在 RTL 下镜像。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `architecture:internationalization`；当前源码与测试                                            |
| FR13 | `isDisabled` 阻止每次页码变更并禁用每个控件。已禁用或处于边界的控件必须通过 `aria-disabled` 保持可聚焦，并在变得不可用时保留焦点（`spec:AST-085` FR1、FR4、FR7）。各 Button、圆点与每页条数 Selector 使用 `aria-disabled` 而不使用原生 `disabled`，因此到达边界的已聚焦 Previous、Next、First 或 Last 按钮会保留焦点（`component:Button` FR10）。页面链接也会保留焦点（FR19）。                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `spec:AST-085`；当前源码与测试                                                                 |
| FR14 | `ref`、`className`、`style`、`xstyle`、`data-testid` 以及其他基础 props 会到达该地标。调用方的 `aria-label` 绝不替换计算出的地标名称（`label`，否则为本地化默认值）；调用方的其他 ARIA props（如 `aria-labelledby`）仍会到达该地标。`data-testid` 还会以 `<id>-input` 到达输入变体的 NumberInput。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前测试                                                                                       |
| FR15 | 当其控件放不进可用宽度时（例如在更大的文本尺寸下），该行会按阅读顺序换到更多行，因此每个控件都留在屏幕上（`spec:AST-102` FR4）；Previous 与 First 在阅读顺序中仍居首，Next 与 Last 仍居末。与 flex 行中的其他内容相邻时，该地标可以收缩到其最宽控件的宽度，并在任何文本尺寸下换行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `spec:AST-102` FR4；当前源码与测试                                                             |
| FR16 | 使用 `getPageHref` 时，每个可用的页码、Previous、Next、First 与 Last 按钮都是链接：Pagination 为其 Button 提供 `href={getPageHref(page, pageSize)}` 与 `as`，并由 Button 渲染链接（`component:Button` FR11）。`page` 是该控件在 FR5 下变更到的页码。当调用方提供 `pageSize` 或 `pageSizeOptions` 时，`pageSize` 是解析出的每页条数，否则为 `undefined`。当前页的链接带有 `aria-current="page"`。被 FR5 判定为不可用的控件，以及在 `isDisabled` 期间的每个控件，都是不带链接的禁用按钮，且 Pagination 不会为其请求 URL。在游标分页中，Previous 与 Next 请求当前页之前与之后 `step` 处的页码，由调用方将该页码映射到其游标的 URL。                                                                                                                                                                                                        | DEC-1；`component:Button` FR11；`family:navigation-destinations`；当前测试                     |
| FR17 | 对页面链接的普通激活会运行 FR6，其 `onChange(page)` 调用与按钮控件相同。Pagination 不取消该点击，因此链接会导航，调用方不为它而在 `onChange` 中导航。浏览器会跟随被激活的 URL：页码变更只会在点击结束后为 Previous 或 Next 链接提供其下一个 URL。不会导航本文档的点击不会运行 FR6 的任何部分，因为此处页面并未变更：带修饰键（Control、Meta、Shift 或 Alt）的点击、对 `target` 已设置且不是 `_self` 的链接的点击，以及对 URL 被拒绝的链接的点击。                                                                                                                                                                                                                                                                                                                                                                                       | DEC-1；DEC-3；当前测试                                                                         |
| FR18 | 圆点（FR9）、页码输入（FR10）与每页条数选择器（FR11）从不是链接（DEC-2）。使用 `getPageHref` 时它们保持 FR9 至 FR11，并通过 FR6 变更页码。在 `dots` 与 `input` 变体中，只有 Previous、Next、First 与 Last 是链接。`onChange` 从每个控件只接收页码（DEC-3），因此它无法区分会导航的链接与不导航的圆点或页码输入。选择每页条数会调用 `onPageSizeChange(size)`，然后调用 `onChange(1)`。                                                                                                                                                                                                                                                                                                                                                                                                                                                   | DEC-2；DEC-3；当前测试                                                                         |
| FR19 | Button 会替换控件中停止或开始成为链接的元素（`component:Button` FR11）：在边界处或在 `isDisabled` 期间变得不可用的链接是禁用按钮，而当控件重新可用时该按钮是链接。当离开的元素持有焦点时，Pagination 会在同一次变更中通过 Core 对该替换的共享所有者将焦点移到替换它的元素上（`architecture:react-component-runtime` INV16）。焦点指示器跟随最近一次输入：它在按键之后显示，在指针按压之后不显示（`architecture:interaction-modality` INV1）。随后该控件像按钮控件一样持有焦点（FR13；`spec:AST-085` FR4、FR7）。Pagination 不会为未持有焦点的控件移动焦点，当变更后由另一元素持有焦点时也不移动。                                                                                                                                                                                                                                       | `spec:AST-085` FR4、FR7；`component:Button` FR11；当前源码与测试                               |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以重新设定本地目标的样式；被委派的控件遵循其自身目标。
- **AV2 — 自定义变体。** 无。变体轴必须封闭（`architecture:component-theming-surface` INV14）。实现缺口：变体映射对模块扩充开放，被扩充的变体只渲染 Previous 与 Next。

### Representative states

| 状态            | 必需不变式                                                                    | 允许的变体       |
| --------------- | ----------------------------------------------------------------------------- | ---------------- |
| 第一页          | Previous 不可用；Next 可用。                                                  | 变体。           |
| 中间页，`pages` | 带省略号的页码范围；当前页 `aria-current`。                                   | `siblingCount`。 |
| 游标分页        | 无计数；Next 跟随 `hasMore`；仅依赖计数的指示器隐藏。                         | —                |
| 输入变体        | 标签、有界输入、总数；默认包含 First 与 Last。                                | `pageLabel`。    |
| 已禁用          | 任何控件都不变更页码；Button 与圆点保持可聚焦（`aria-disabled`，FR13）。      | —                |
| 圆点            | 一个 Tab 停靠点；方向键、Home 与 End 可选择。页面 radio 组成的单选组（FR9）。 | 尺寸。           |
| 页面链接        | 可用的 Button 控件是链接；当前页带有 `aria-current="page"`（FR16）。          | 链接组件。       |
| 页面链接，圆点  | Previous 与 Next 是链接；圆点仍为单选组（FR18）。                             | —                |
| 零条目          | 不渲染任何内容。                                                              | —                |

### Transformation and precedence order

- **ORD1 — 页数。** `totalPages`，然后是 `ceil(totalItems / pageSize)`，然后是未知。
- **ORD2 — 页码变更。** 禁用守卫 → `onChange` → 播报 → 乐观页码与 `changeAction`。页面链接随后导航（FR17）。
- **ORD3 — First/last。** 对 `input`（默认开）与 `compact`（默认关）使用 `hasFirstLast`；无已知计数时省略。

### Performance and resources

- **PR1 — 有界资源。** 圆点在其组上共享一个漫游焦点处理器。被委派的 Button 会增加按压控制器的共享 window 与 document 监听器；每个 tooltip 的 `interactionRef` 会在其 Button 上增加指针与焦点监听器，Tooltip 层每个页面安装一次共享的手势计数器 document 监听器。

## Accessibility contract

- **AR1 — 地标。** 一个有名称的 `nav` 地标（FR1）。
- **AR2 — 当前页。** 当前页按钮或链接上的 `aria-current="page"`（FR7、FR16）。圆点在单选组中以 `aria-checked` 暴露当前页（FR9）。
- **AR3 — 播报。** FR6。
- **AR4 — 禁用与边界。** FR13。
- **AR5 — 装饰性部分。** 省略号与输入变体的页码标签对辅助技术隐藏；该输入由其隐藏标签命名。

## Design relationships

| 解剖结构或状态        | 设计要求                             | 表示权威                | 层级角色 | 组件契约       |
| --------------------- | ------------------------------------ | ----------------------- | -------- | -------------- |
| Pagination            | 在导航地标中归组每页条数与翻页控件。 | 当前源码与公开文档      | 支撑级   | FR1、FR2       |
| Page-size selector    | 让人们选择每页显示的条目数。         | `component:Selector`    | 支撑级   | FR3、FR11      |
| First/last buttons    | 直接跳转到已知的第一页或最后一页。   | `component:Button`      | 支撑级   | FR3、FR5、FR12 |
| Previous/next buttons | 在页面间向前或向后移动。             | `component:Button`      | 显著级   | FR3、FR5、FR12 |
| Page number button    | 在编号呈现中直接选择某一页。         | `component:Button`      | 显著级   | FR3、FR7       |
| Ellipsis              | 表示被省略的一段页码。               | 当前源码与公开文档      | 支撑级   | FR4、FR7       |
| Count readout         | 呈现可见条目范围与总数。             | `component:Text`        | 显著级   | FR3、FR8       |
| Compact readout       | 呈现当前页数与总页数。               | `component:Text`        | 显著级   | FR3、FR8       |
| Dot                   | 在圆点呈现中呈现并选择某一页。       | 当前源码与公开文档      | 显著级   | FR2、FR9       |
| Page input label      | 在视觉上命名可编辑的页码字段。       | 当前源码与公开文档      | 支撑级   | FR2、FR10      |
| Page input            | 接受直接输入的页码。                 | `component:NumberInput` | 显著级   | FR3、FR10      |
| Page input total      | 在可编辑页码字段之后呈现已知总数。   | 当前源码与公开文档      | 支撑级   | FR2、FR10      |

三行 Button 条目是彼此独立的稳定控件，具有不同的条件与职责；它们不会创建由 Pagination 拥有的 Button 目标。呈现取值、尺寸、禁用状态与活动状态仍是各拥有目标上的能力，而不是解剖结构条目。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Pagination": {"target": "pagination"},
  "Page-size selector": {
    "delegatesTo": {"owner": "component:Selector", "target": "selector"}
  },
  "First/last buttons": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Previous/next buttons": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Page number button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Ellipsis": {
    "none": {
      "reason": "unsettled: no current public target is applied to the Pagination-rendered ellipsis"
    }
  },
  "Count readout": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  },
  "Compact readout": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  },
  "Dot": {"target": "pagination-dot"},
  "Page input label": {"target": "pagination-input-label"},
  "Page input": {
    "delegatesTo": {"owner": "component:NumberInput", "target": "number-input"}
  },
  "Page input total": {"target": "pagination-input-total"}
}
```

这四个本地目标是当前的公共接缝。被委派的控件保留其组件所有者。省略号没有当前目标；这一事实性的 `none` 处置并不决定它是否应保持不可达。

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格认定、本地目标映射、委派、状态放置以及事实性的 `none` 处置。
- Button、Text、NumberInput 与 Selector 保留对其被委派目标与呈现的所有权。
- `spec:AST-085` 拥有禁用时的可聚焦性；FR13 与 FR19 将其应用于这些控件。
- `spec:AST-020` FR15 拥有圆点采用哪些 APG 部件（FR9）。
- `spec:AST-094` FR42 拥有粗略指针命中区域；FR9 记录了该缺口。
- `spec:AST-086` 拥有页码播报通道。
- `family:navigation-destinations` 拥有页面链接目标的接受。`component:Button` FR11 拥有链接元素、其禁用回退，以及两者之间的替换（FR16）。Pagination 拥有其自身控件在该替换过程中的焦点（FR19）。

## Verification map

| 契约                | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                | 代表性状态                                                                                                                 | 变异或失败预期                                                                                                                                                                                                                                                  | 审计章节                         |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1, FR14           | `Pagination.test.tsx` 的 basic-rendering、zero-item 与 rest-forwarding 用例                                                                                                                                                                                                                                                                                                                                                         | 默认与自定义标签；零项目或零页；`data-testid`、`id`、`aria-describedby`                                                    | 地标缺失或命名错误、在零值时渲染，或丢失 `data-testid`、`id` 或 `aria-*`，都会失败。证据缺口：没有测试断言 `ref`、`className`、`style`、`xstyle`、替换调用方 `aria-label` 的计算值、调用方的 `aria-labelledby` 到达地标，或输入变体的 `<id>-input` 测试 id。    | `audit:Pagination/anatomy`       |
| FR2                 | `themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                            | 渲染出的目标                                                                                                               | 渲染出的类未出现在已记录的目标中即失败。证据缺口：没有测试断言四个局部目标的位置或反射属性（OQ1）。                                                                                                                                                             | `audit:Pagination/theming`       |
| FR3                 | `Pagination.test.tsx` “does not introduce Stack theme targets around navigation controls”                                                                                                                                                                                                                                                                                                                                           | 导航控件                                                                                                                   | 新增的 Stack 目标即失败。证据缺口：没有测试分别断言每个被委托的所有者；被委托的 Button 缺口由 `component:Button` 自己的记录断言，不在此处。                                                                                                                     | `audit:Pagination/theming`       |
| FR4, FR7            | `generatePageRange` 用例；`Pagination.test.tsx` 的 pages 用例（“renders page number buttons”、“marks current page with aria-current”、“shows ellipsis for many pages”）                                                                                                                                                                                                                                                             | 左侧、右侧与双侧省略；`siblingCount` 为 0 和 2                                                                             | 范围错误、省略号缺失或 `aria-current` 缺失，都会失败。证据缺口：没有测试断言省略号对辅助技术隐藏。                                                                                                                                                              | `audit:Pagination/behavior`      |
| FR5, ORD1           | `Pagination.test.tsx` 的边界、游标、步长、页面尺寸防护与 totalItems 用例                                                                                                                                                                                                                                                                                                                                                            | 第一页、中间页、最后一页、单页；`hasMore`；步长钳制；无效的 `pageSize`                                                     | 越过边界，或由 `totalItems` 与 `pageSize` 推导出的计数错误，都会失败。证据缺口：没有测试同时传入 `totalItems` 与 `totalPages`，因此 ORD1 的优先级未被测试。                                                                                                     | `audit:Pagination/behavior`      |
| FR6, ORD2           | `Pagination.test.tsx` 的 page-change 与 changeAction 用例                                                                                                                                                                                                                                                                                                                                                                           | 挂载、页码按钮、Previous、Next、圆点；待处理、被中断与同步的 Action；禁用                                                  | 缺少 `onChange`、播报或乐观页码，`changeAction` 先于 `onChange`，或在禁用时触发 Action，都会失败。证据缺口：没有测试断言播报相对 `onChange` 的顺序。                                                                                                            | `audit:Pagination/behavior`      |
| FR8                 | `Pagination.test.tsx` 的 count 与 compact 用例                                                                                                                                                                                                                                                                                                                                                                                      | 计数范围与最后一页钳制；compact 文本                                                                                       | 读数错误即失败。                                                                                                                                                                                                                                                | `audit:Pagination/behavior`      |
| FR9                 | `Pagination.test.tsx` 的 dots 用例（“uses roving tabindex — active dot has tabIndex 0, others -1”、“ArrowRight moves focus to the next dot and selects it”、“Home selects the first page, End the last”、换行（wrap）用例、“does not navigate with arrow keys when disabled”、经由 `RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts` 覆盖的单选组部分（Pagination dots 状态））；`useListFocus.test.tsx` 的 RTL 用例 | 圆点；RTL；禁用                                                                                                            | 出现第二个 Tab 停留点、方向键或 Home/End 未选择、缺少换行、禁用的圆点丢失焦点或改变页面，或 RTL 下方向键方向反向，都会失败。证据缺口：没有 Pagination 层面的 RTL 圆点测试，也没有粗指针命中区域测试。                                                           | `audit:Pagination/accessibility` |
| FR10                | `Pagination.test.tsx` 的 input 与 pageLabel 用例                                                                                                                                                                                                                                                                                                                                                                                    | 已知与未知总数；Enter、blur、无效值、低于与高于范围；自定义标签；禁用；被拒绝的输入保留 tooltip 状态与更宽的盒子           | 边界错误、缺少提交或播报、禁用时提交，或被拒绝的输入隐藏其文本或显示消息框，都会失败。                                                                                                                                                                          | `audit:Pagination/behavior`      |
| FR11                | `Pagination.test.tsx` 的 page-size selector 用例                                                                                                                                                                                                                                                                                                                                                                                    | 带与不带 `pageSizeOptions`                                                                                                 | 证据缺口：page-size 用例只检查地标与按钮是否渲染，因此没有测试断言 Selector 的存在或缺失、`onPageSizeChange`，或重置到第 1 页。                                                                                                                                 | `audit:Pagination/behavior`      |
| FR12, ORD3          | `Pagination.test.tsx` 的 first/last、step-name、tooltip 与 RTL chevron 用例                                                                                                                                                                                                                                                                                                                                                         | `compact` 与 `input` 上的 `hasFirstLast`；步长名称；RTL                                                                    | 名称错误、First 或 Last 缺失、Previous 或 Next 没有 tooltip、在不可用或禁用的控件上显示 tooltip，或 First/Last 的 chevron 不像 Previous 与 Next 那样镜像，都会失败。证据缺口：没有测试断言 chevron 在 RTL 下镜像。                                              | `audit:Pagination/accessibility` |
| FR13                | `Pagination.test.tsx` 的禁用状态与边界用例，断言 Button 上的 `aria-disabled`，以及最后一页时焦点停留在 Next；`PaginationLinks.a11y.browser.spec.ts` 在 Chromium 与 WebKit 中（最后一页的按钮控件）                                                                                                                                                                                                                                  | 禁用；第一页与最后一页                                                                                                     | 禁用时改变页面、Button 被原生禁用，或边界处按钮控件失去焦点，都会失败。                                                                                                                                                                                         | `audit:Pagination/accessibility` |
| FR3, FR15           | `PaginationTextSize.interaction.browser.spec.ts` 在 402 px 视口下，以及默认字号 100%、165%、194% 与 312% 时                                                                                                                                                                                                                                                                                                                         | 页码；窄视口；默认文本尺寸                                                                                                 | 页面横向滚动、控件移出屏幕、Previous 不在阅读顺序最前或 Next 不在最后、100% 时出现第二行，或 312% 时页码或省略号超出其盒子，都会失败。                                                                                                                          | `audit:Pagination/accessibility` |
| FR16, FR17          | `Pagination.test.tsx` 的 page-links 用例；`PaginationLinks.a11y.browser.spec.ts`（浏览器实际跟随的 URL）                                                                                                                                                                                                                                                                                                                            | 每个 Button 控件；步长；页面尺寸参数；`as` 与 `LinkProvider`；边界、禁用与游标；普通、修饰键与 `target` 点击；被拒绝的 URL | 链接缺失、不可用控件却有 URL、页面尺寸错误、`as` 或 `LinkProvider` 被忽略、跟随的 URL 不是被激活的那个、点击链接后没有恰好一次 `onChange(page)`，或修饰键、其他 `target`、被拒绝 URL 的点击导致页面改变，都会失败。证据缺口：没有真实浏览器中的修饰键点击测试。 | `audit:Pagination/behavior`      |
| FR18                | `Pagination.test.tsx` 针对圆点、页码框与选择器的 page-links 用例                                                                                                                                                                                                                                                                                                                                                                    | 使用 `getPageHref` 的 `dots` 与 `input`；一次页面尺寸选择                                                                  | 圆点或页码框渲染为链接却不调用 `onChange(page)`，或页面尺寸选择乱序上报，即失败。                                                                                                                                                                               | `audit:Pagination/behavior`      |
| FR19                | `Pagination.test.tsx` 中“focus on a control that stops or starts being a link”下的用例；`PaginationLinks.a11y.browser.spec.ts` 在 Chromium 与 WebKit 中                                                                                                                                                                                                                                                                             | 每个处于边界的 Button 控件；`isDisabled` 开与关；调用方设置的页码；迟到的页面；链接组件；焦点在别处；键盘与指针            | 聚焦的控件停止或开始作为链接后焦点落到文档 body 上即失败。控件未持有焦点却取得焦点即失败。指针按下后出现焦点环即失败。                                                                                                                                          | `audit:Pagination/accessibility` |
| PR1, AR1–AR5        | PR1 没有测试（证据缺口）。AR1 到 AR5 由 FR1、FR6、FR7、FR9、FR10 与 FR13 各行覆盖。                                                                                                                                                                                                                                                                                                                                                 | —                                                                                                                          | —                                                                                                                                                                                                                                                               | `audit:Pagination/accessibility` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                       | 规范解剖与当前目标                                                                                                         | 映射缺失、多余或过时即导致仓库校验失败。                                                                                                                                                                                                                        | `audit:Pagination/theming`       |

## Current-state impact

- **圆点命中区域（FR9）。** 圆点为 8 px（`sm` 下为 6 px），没有粗指针命中区域，与 `spec:AST-094` FR42 不符。
- **开放变体轴（AV2）。** 变体映射接受模块扩充的值，而这些值只渲染 Previous 与 Next，与 `architecture:component-theming-surface` INV14 不符。
- **页数文档（FR5、ORD1）。** `totalPages` 优先于由 `totalItems` 推导出的计数，而属性文档却说同时给出两者时 `totalItems` 优先。
- **导航 Button 高度（FR3）。** Previous、Next、First 与 Last 保持固定方形，而它们的 chevron 随更大的文本尺寸增大，与 `spec:AST-102` FR4 不符。

## Decision log

### DEC-1 — A URL function makes the page links

**Reference:** `component:Pagination/DEC-1`

**Decider:** `nynexman4464`, `2026-11-13`

`getPageHref(page, pageSize)` 返回每个页面的 URL，因为只有调用方知道其应用如何定位页面：查询参数、路径段、偏移量或游标。页面尺寸是第二个参数，且为可选，正如控件上的 `pageSize` 一样。`as` 选择链接组件，与在 Button 和 Tab 上一样（FR16）。通过链接改变页面时，`onChange` 会运行，与按钮控件一样（FR17）。

否决：使用带页面参数的一个 `href`，因为各应用对分页参数的命名和放置方式不同。

### DEC-2 — The dots, the Page input, and the Page-size selector are not links

**Reference:** `component:Pagination/DEC-2`

**Decider:** `nynexman4464`, `2026-11-13`

链接在用户激活之前就指明一个目的地。圆点是单选组，焦点即选择页面（FR9），因此作为链接的圆点会在每次方向键移动时导航。Page 输入框与 Page-size 选择器接受键入或选择的值，因此在使用者提交之前没有目的地。这些控件在使用 `getPageHref` 时保留各自的回调（FR18）。

### DEC-3 — `onChange` keeps its released type

**Reference:** `component:Pagination/DEC-3`

**Decider:** `nynexman4464`, `2026-11-13`

`onChange(page)` 是必需的，且只接收页码，无论有没有 `getPageHref`。圆点、Page 输入框与 Page-size 选择器没有链接，因此它们通过它改变页面；页面链接调用它的方式与按钮控件相同（FR17）。

否决：在每个控件都是链接的情况下使用可选的 `onChange`，因为其类型此时取决于变体与 `pageSizeOptions`。

否决：用第二个参数指明控件，因为自带第二个参数的处理器将无法通过编译。

## Open questions

- **OQ1 — 哪些聚焦测试应为四个局部 Pagination 目标固定位置与反射属性？**（`checkable`）
- **OQ2 — Ellipsis 是否应获得稳定的公共主题目标？**（`human-api`）它当前不可达并不决定答案。

## Content boundary

本文件不重复使用方的属性表与示例、当前审计结果、实现步骤或系统规则。它链接到它们的所有者。
