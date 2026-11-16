---
schema_version: 3
template_version: 5
kind: component
id: component:List
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-21
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming]
verified_by:
  [
    packages/core/src/List/List.test.tsx,
    packages/core/src/Item/Item.test.tsx,
    packages/core/src/List/ListItem.hitArea.test.tsx,
    packages/core/src/List/__tests__/ListTouchHitArea.interaction.browser.spec.ts,
    packages/core/src/List/__tests__/ListDividers.interaction.browser.spec.ts,
    packages/core/src/List/listLayoutUpdates.test.tsx,
    packages/core/src/List/__tests__/ListUpdates.interaction.browser.spec.ts,
    packages/core/src/List/__tests__/ListReorder.test.tsx,
    packages/core/src/List/__tests__/ListReorderLayout.test.tsx,
    packages/core/src/List/__tests__/ListReorderTouch.interaction.browser.spec.ts,
    packages/core/src/List/__tests__/ListReorderPointer.interaction.browser.spec.ts,
    packages/core/src/List/__tests__/ListReorderMode.interaction.browser.spec.ts,
    packages/core/src/List/__tests__/reorderModel.test.ts,
    packages/core/src/theme/derivedVarRegistry.test.ts,
    packages/core/src/theme/generateThemeRules.test.ts,
    apps/storybook/stories/List.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:container-padding, architecture:public-component-api]
contributing: [contributing:api-conventions]
system_specs:
  [
    spec:AST-107,
    spec:AST-002/DEC-1,
    spec:AST-002/DEC-2,
    spec:AST-017/FR4,
    spec:AST-057/FR9,
    spec:AST-061/FR11,
    spec:AST-094,
    spec:AST-103,
    spec:AST-105,
  ]
---

# List component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 可选 `edge?: 'padded' \| 'flush' \| 'outset' \| 'bleed'`，默认 `'padded'`。已废弃的 `edgeCompensation?: 'inline'` 解析为 `'outset'`。可选的 `reorderable` 接收 `createReorderable` 返回的对象，ListItem 的 `itemKey` 标识每一行（`spec:AST-103`）。可选的 `animatedLayout` 接收 `useAnimatedLayout` 返回的句柄（`spec:AST-105`）。                                                                                             |
| 行为          | 一种边缘处理应用于每个 ListItem 行，并决定行内容与行绘制相对于列表边缘和宿主内边距的位置。使用 `reorderable` 时，行可通过拖动句柄或通过重排模式重排（`spec:AST-103` FR3、FR4）。在粗指针下，行的按压遵循单元格配置（`spec:AST-094` FR11）；使用 `animatedLayout` 时，行的更新会带动画（`spec:AST-105`）。行菜单在上下文请求时从行自身的 `<li>` 打开（FR13）。                                                                  |
| 最终用户影响  | 行文本可与列表标题以及上方标题共享同一条线，行绘制则止于文本、延伸到宿主内边距，或到达宿主边缘。触摸用户获得 44 px 的行目标（FR10）与单元格按压（FR11），并且对每种指针都保持高亮行的分隔线可见（FR11）；使用 `animatedLayout` 时，行的更新对每种指针都带动画（FR12）。带菜单的行可通过长按、右键单击或 Shift+F10，或通过其 “More actions” 按钮打开菜单（FR13）。                                                              |
| 构建者影响    | 每个列表一个 `edge` 选择。`flush` 在任何地方都可用；`outset` 和 `bleed` 仅在发布了容器内边距的宿主内部生效。传入 `animatedLayout` 句柄是新增的一项选择，行菜单是另一项：调用方把 ListItem 的 ref 传给 `useContextMenu`（FR13），而由谁绘制普通行的 “More actions” 按钮尚未确定（OQ2）；此外，行只有在有 `itemKey` 时才带动画；触摸目标与按压则不需要。                                                                         |
| 兼容性/就绪度 | 增量式；省略时保持当前几何；`edgeCompensation` 继续可用，并提供迁移到 `edge` 的 codemod。`reorderable` 稳定且已构建，`labels` 与 `positions` 除外。`itemKey` 与 `animatedLayout` 的行更新（FR12）已实现；其开始与结束内容的动效尚未实现。触摸目标（FR10）与按压的合成器释放（FR11）已在粗主指针下实现。二者都不会改变细指针下的任何行为。FR11 的分隔线规则对每种指针均已实现。行菜单（FR13）是增量式的且已制定规格，尚未实现。 |
| 审查检查      | 拒绝以下做法：移动标题、行绘制超出宿主的内边距边缘、重复的内边距值、物理边缘逻辑、自动启用、ListItem 级别的 edge 属性，或第二个可能与 `edge` 矛盾的属性。                                                                                                                                                                                                                                                                      |
| 治理规则      | `architecture:container-padding/INV3`, `INV9–INV11`; `spec:AST-002/DEC-1–DEC-2`; `spec:AST-017/FR4`; `spec:AST-057/FR9`. `spec:AST-103`. `spec:AST-094` FR4, FR5, FR11, FR13; `spec:AST-105` FR1–FR5, FR8. `spec:AST-107` FR8（行菜单）。                                                                                                                                                                                      |

本表是审查投影；下方正文具有权威性。

## Intent

每个 ListItem 都保留 Item 的行内内缩，使悬停、按压与选中绘制在行内容周围留出空间。该内缩会让行文本偏离 List 标题、列表上方标题以及宿主容器内边距所在的线。一个集合如何解决这一点，取决于它的行与它的宿主：静态行不需要在绘制周围留空间，交互行则需要，而位于带内边距容器内的列表可以伸入那份内边距。调用方知道适用哪一种；List 无法从其行推导出来，而且该选择必须对整个集合一致。

## Compatibility and migration

- 已发布的默认值保持：`yes`；省略时保持当前 List 与 ListItem 几何。
- 兼容性类别：增量可选属性；`edgeCompensation` 是已废弃的别名，含义与 `edge="outset"` 相同。其 `@deprecated` 类型会报告普通用法；仅当两个属性都被设置时，开发环境才会给出警告，并指明 `astryx upgrade`（`spec:AST-017` FR29–FR29b）。
- 受控/非受控行为：不适用。
- 迁移决策：`component:List/DEC-3`；`astryx upgrade` codemod 把静态的 `edgeCompensation="inline"` 重命名为 `edge="outset"`，在 `edge` 字符串旁删除 `edgeCompensation`（且后续展开无法覆盖它），并在 `edge` 为计算值、为动态值，以及 List 同时展开属性的场合保留旧属性并加上 TODO（`spec:AST-017` FR29c–FR29d）。展开到一个从不写 `edgeCompensation` 的 List 上则保持不变（`spec:AST-040` FR1）；`@deprecated` 类型会在写入属性的地方报告类型化用法。
- 当前状态：在手指下，调用方在交互式 ListItem 行上的 `::after` 会被触摸命中区域取代。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**Owns**

- 集合范围的 `edge` 处理及其对每个 ListItem 行的应用。
- 已废弃的 `edgeCompensation` 别名及其解析。
- 在每种处理下保持可选标题的位置不变。
- 行几何与 Item 随密度和主题变化的行内内缩之间的关系。
- 其行在粗指针下的 44 px 触摸目标（FR10）。
- 其行在粗指针下的按压绘制，以及高亮行的分隔线对每种指针的表现（FR11）。
- 其行在 `animatedLayout` 句柄下的更新动效：进入、退出与交叉（FR12）。
- 其行菜单附加到行自身的 `<li>`（FR13）；“More actions” 按钮、焦点返回以及普通行的按压绘制尚未确定（OQ2）。

**Does not own / non-goals**

- 容器内边距值、嵌套或覆盖层重置——由 `architecture:container-padding` 拥有。
- ListItem 级别的 edge 属性、按边缘或任意内缩值、自动宿主检测，或块轴方向的 bleed。
- TabList 或 Button 的投影。

## Public concepts

| 概念               | 封闭取值或状态                       | 含义                                                                                          | 按变体/方向/状态的可用性                                             | 默认值   | 所有者           | 稳定性 | 无效值行为             |
| ------------------ | ------------------------------------ | --------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------- | ---------------- | ------ | ---------------------- |
| 边缘处理           | `padded`、`flush`、`outset`、`bleed` | 行内容与行绘制相对于列表边缘和宿主内边距的位置                                                | 每种密度、标记样式与分隔线设置；`outset` 与 `bleed` 会读取宿主内边距 | `padded` | `component:List` | 已接受 | 其他值会被公共类型拒绝 |
| 边缘补偿（已废弃） | 省略、`inline`                       | 与 `edge="outset"` 相同                                                                       | 同 `outset`                                                          | 省略     | `component:List` | 已废弃 | 其他值会被公共类型拒绝 |
| 动画布局           | 缺失、`useAnimatedLayout` 句柄       | 插入、移除与移动的行会带动画，变更之后的行会滑动到新位置（FR12）                              | 每种密度、标记样式、边缘处理与分隔线设置                             | 缺失     | `spec:AST-105`   | 已接受 | 其他值会被公共类型拒绝 |
| 重排               | 缺失、`createReorderable` 对象       | 行可通过句柄、键盘与辅助技术重排；`onReorder` 接收被移动行的 key 及其新索引（`spec:AST-103`） | 每种密度、标记样式、边缘处理与分隔线设置                             | 缺失     | `spec:AST-103`   | 已接受 | 其他值会被公共类型拒绝 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 依据                                                                                                                  | 状态                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1  | List 必须拥有 `edge`，并对每个 ListItem 行（无论是否交互）应用同一种处理；ListItem 不得暴露并行的公共属性。已定义的 `edge` 必须优先于 `edgeCompensation`；当 `edge` 未定义而 `edgeCompensation="inline"` 时，必须解析为 `outset`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `component:List/DEC-1`, `component:List/DEC-3`                                                                        | 已接受契约                                |
| FR2  | `padded` 必须保持当前的标题、列表与行几何，粗指针下 FR10 的命中目标除外。任何处理都不得移动标题，也不得改变行的块向内边距、间隙、标记、起始与结束内容、语义，或相对于行盒的命中目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 所有者指示                                                                                                            | 已接受契约                                |
| FR3  | `flush` 必须通过提供 Item 实际行内内边距的私有来源，把每行的行内内缩解析为零，使行内容与行绘制共享列表的行内边缘。它不读取宿主内边距。对行行内内边距的主题覆盖优先于该零值（FR7）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `component:List/DEC-3`                                                                                                | 已接受契约                                |
| FR4  | `outset` 必须按每条逻辑边缘放置每一行，使其越出宿主内容线的距离取自身行内内缩与对应宿主内缩中的较小者，同时保留其内缩。当宿主内缩不小于行内缩时，内容到达宿主线。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `architecture:container-padding/INV9–INV10`; `component:List/DEC-2`                                                   | 已接受契约                                |
| FR5  | `bleed` 必须在每条逻辑边缘上把每一行放置到宿主的内边距边缘，并使用直角，例外情形是：当列表是圆角宿主的第一个或最后一个子元素时，其第一行或最后一行采用该宿主的圆角，但减去它保留的宿主块向内边距（`architecture:container-padding` 的 Corner geometry）。行内容位于宿主内容线上；当宿主内缩更小时，则位于距行自身边缘一个行内缩处。对行行内内边距的主题覆盖则改为设定内容的内缩（FR7）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `architecture:container-padding/INV3`; `component:List/DEC-4`                                                         | 已接受契约                                |
| FR6  | 缺失或重置的宿主内缩必须解析为零，因此在带内边距的宿主之外，`outset` 与 `bleed` 按 `padded` 的方式放置内容。行绘制不得越过宿主的内边距边缘。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `architecture:container-padding/INV6`, `INV9`                                                                         | 已接受契约                                |
| FR7  | 每一行保留的内缩必须与 Item 实际行内内边距来自同一个由密度和主题派生的私有来源。主题的 `item.paddingInline` 覆盖优先于每种处理的行内边距，正如它也优先于密度。使用方通过 `xstyle`、`className` 或 `style` 对行内边距的覆盖不在对齐保证范围内。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 共享的双所有者几何契约                                                                                                | 已接受契约                                |
| FR8  | `outset` 与 `bleed` 仅在发布的行内内缩与其实际内边距相匹配的宿主状态下有效：视觉中性的宿主，例如带显式内边距的 Layout 区域或带内边距的 ScrollableArea，或 Card、Section（任意变体）、Dialog、BottomSheet 的内容区域。这些宿主用边框、背景或裁剪来限定其内边距；FR6 会把行绘制保持在内部边距边缘之内，因此它绝不会覆盖边框或改变宿主轮廓。具有已知发布不一致的自动 LayoutContent/LayoutPanel 状态在该缺口修复前不合格，而 Drawer 的内容区域在拥有自身证据之前不予纳入。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `architecture:container-padding/INV8–INV11`; 每个被纳入宿主中的真实浏览器证据                                         | 已接受契约                                |
| FR9  | 包含各行的列表元素必须在行内轴上使用 `overflow-inline: clip` 进行裁剪，绝不使用 `hidden`，但不暴露滑动操作的静态 Markdown 文档列表除外（DEC-5）。这些 Markdown 列表（有序或无序）可以使用可见的行内溢出，使其自身或后代编号标记保持完整，同时保留 AST-061 FR11 的文本起始位置与嵌套内缩。通用 List 以及任何带可滑动行的集合必须保留裁剪。在 `outset` 与 `bleed` 下，其行内边缘必须到达宿主的内边距边缘，因此裁剪绝不会切掉静止的行绘制，被滑动的行也不会绘制到该边缘之外。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `spec:AST-057/FR9`; `component:List/DEC-5`; `spec:AST-061/FR11`                                                       | 已由 `List.test.tsx` 与真实浏览器几何验证 |
| FR10 | 在粗主指针下（`spec:AST-094` FR13），每个 ListItem 行必须在邻居留出空间处提供至少 44 px 高的命中目标，可通过其内边距或不可见命中区域实现，且不产生视觉变化：命中区域绝不与相邻行或控件的目标重叠；在邻近行之间它被限制为间隙的一半；行高与几何在每种密度下都保持不变。细指针保持当前的命中目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 所有者决策，2026-10-26：不改变行高，采用 44 px 触摸目标                                                               | 已接受契约                                |
| FR11 | 在粗主指针下，交互行的按压必须遵循单元格配置（`spec:AST-094` FR11）：它在行的背景之上、内容之下绘制 `--color-overlay-pressed` 令牌，且不新增元素；其释放通过主题的退出动效令牌（`--duration-exit`、`--ease-exit`）在合成器上淡出（`spec:AST-094` FR5）。高亮行（被悬停，或被任意指针按压）会通过其半透明着色保持两条分隔线以 `--color-border` 可见；任何分隔线都不会因高亮而隐藏或改变颜色（所有者决策，2026 年 11 月 6 日 (Cindy)）。静止时，行的绘制与堆叠保持原样。在触摸呈现下，交互式 Item、ListItem 或 TreeList 行使用其 `::before` 作为按压层，且被按压行的分隔线保持其静止颜色。调用方在此类行上自有的 `::before` 仅在被按压期间并入按压层；装饰请使用 `::after` 或子元素。交互式 ListItem 行还会用其 `::after` 作为触摸命中区域（FR10），因此请用子元素装饰此类行。                                                                                                                                                                                                                                                                                                                                                                                                                       | `spec:AST-094` FR5, FR11; `component:List/DEC-6`                                                                      | 已接受契约                                |
| FR12 | List 必须接收 `animatedLayout` 句柄（`spec:AST-105` FR1），并报告每次渲染之间插入、移除或移动的每一行。持有句柄时，插入的行会进入，移除的行在原位折叠，在消失之前保持惰性并对辅助技术隐藏；与反向移动的行交叉的行会在列表表面之上从它们上方通过；而变更之后的行会滑动到新位置（`spec:AST-105` FR3），全部在共享动效角色上从同一帧开始（`spec:AST-105` FR4）。没有句柄时，列表立即变化（`spec:AST-105` FR2）。行的身份是其 `itemKey`（`spec:AST-103` DEC-4）；没有 `itemKey` 的行会立即变化。持有句柄时，行还会报告其起始或结束内容的变化：出现的内容会进入，离开的内容会退出（设定行高的槽位则改为立即隐藏，行的其他内容及其后的行立即到达最终位置，正如 `spec:AST-105` 的 Coverage 所述）；在同一槽位中被替换的内容原位交换（`spec:AST-105` FR4、FR8），行的其他内容在行内滑动；内容变化但尺寸不变的槽位不做动画。重排句柄的外观变化（`spec:AST-103`）就是这样的变化。离开的槽位控件在退出开始时即保持惰性并对辅助技术隐藏；如果它持有焦点，焦点会移动到行的焦点目标（或移动到行本身，由行以编程方式取得焦点完成交接），且不滚动。                                                                                                                                                                | `spec:AST-105` FR1–FR5; `spec:AST-103` DEC-4; `spec:AST-105` FR8; `spec:AST-103` FR2（句柄仅在 `reorderable` 下渲染） | 已接受契约                                |
| FR13 | ListItem 上的行菜单附加到行自身的 `<li>`，保持 `ul > li` 且不添加包装元素：调用方把 ListItem 的 ref 传给 `useContextMenu`（`spec:AST-107` FR8），ListItem 自身没有对应属性；整行都是其命中区域，菜单在上下文请求时（长按、右键单击或 Shift+F10）打开；在手指下，行承担按压绘制（FR11；在普通行上属于 OQ2 的一部分）并随菜单从它生长而抬起，`useContextMenu` 会抬起其附加的元素（`spec:AST-094` FR31、FR33）；而鼠标、键盘与 `presentation: 'popover'` 则打开已释放的菜单且不抬起（`spec:AST-094` FR41），菜单关闭时焦点返回到行的焦点目标。已经可聚焦的行（`onClick` 或 `href`）直接接受 Shift+F10 与上下文菜单键，带 `interactiveRef` 的行在该元素上接受它们；两者都不显示 “More actions” 按钮；不满足这些条件的行会显示一个可见的 “More actions” 按钮，其名称取自行的标签，例如 “More actions for Inbox”，作为其通过键盘和屏幕阅读器到达菜单的路径。菜单打开时，焦点移入其中；关闭时，焦点返回到行的焦点目标，或返回到显示 “More actions” 按钮的行上的该按钮。由于 `useContextMenu` 会把焦点返回到不接受焦点的 `<li>`，由谁把焦点移到那里属于 OQ2 的一部分。可重排的行始终拥有其句柄（`spec:AST-103` FR3），因此当它同时有行菜单时，在句柄上按住会拾起该行，而在行上其他任何位置按住会打开菜单。 | 所有者决策，2026-10-26；`spec:AST-107` FR8                                                                            | 已接受契约                                |

### Allowed variation

- 密度与 `item.paddingInline` 主题覆盖可以改变保留的内缩；每种处理都遵循同一个派生值。对行行内内边距的主题覆盖优先于每种处理，正如它也优先于密度。
- 宿主内边距可以是均匀的、不对称的、零或缺失；每条逻辑边缘独立解析。
- 标签、描述、标记、起始/结束内容、交互性与选中状态可以变化，而不改变集合范围的处理。
- 静态 Markdown 文档列表在 DEC-5 下可以省略行内裁剪，包括编号列表的无序祖先。该例外不适用于通用 List，也不适用于其行暴露滑动操作的列表。
- 在粗主指针下，当邻居留出空间时，行的命中目标会增长到接近 44 px（FR10）；行几何与外观保持不变。

### Representative states

| 状态                                    | 必需不变式                                           | 允许的变化                 |
| --------------------------------------- | ---------------------------------------------------- | -------------------------- |
| `padded`（默认）                        | 标题与每一行都保持当前几何。                         | 任意内容、密度或宿主。     |
| `flush`                                 | 行内容与绘制与标题和分隔线端点共享列表的行内边缘。   | 任意宿主，包括无宿主。     |
| `outset`，宿主内缩不小于行内缩          | 行内容到达宿主内容线；行绘制越出它一个行内缩。       | 均匀或不对称的宿主内边距。 |
| `bleed`，宿主内缩不小于行内缩           | 行绘制到达宿主的内边距边缘；行内容位于宿主内容线上。 | 均匀或不对称的宿主内边距。 |
| `outset` 或 `bleed`，宿主内缩小于行内缩 | 行绘制止于宿主的内边距边缘；内容保留行内缩。         | 任一条逻辑边缘独立。       |
| `outset` 或 `bleed`，无宿主内缩         | 内容按 `padded` 放置；`bleed` 的行使用直角。         | 独立列表与覆盖层。         |
| LTR 或 RTL                              | 逻辑起始/结束映射遵循方向。                          | 书写方向。                 |
| `animatedLayout`，行发生变化            | 保留的行移动到新位置；被移除的行折叠；新行淡入。     | 减少动效：该角色的策略。   |

### Transformation and precedence order

- **ORD1 — 处理。** 解析 `edge`；否则对 `edgeCompensation="inline"` 解析为 `outset`；否则为 `padded`。
- **ORD2 — 宿主边界。** 对每条逻辑边缘读取匹配的已发布宿主内缩，缺失值回退为零。
- **ORD3 — 本地内缩。** 通过提供实际内边距的私有值解析 Item 的行内内缩：密度设定它，`flush` 将其替换为零，主题的 `item.paddingInline` 覆盖则替换其中任一个。
- **ORD4 — 放置。** 依据这些值应用处理的几何；然后组合受支持的使用方样式，但不对使用方覆盖行行内内边距的情形主张对齐。

### Performance and resources

- **PR1 — 仅 CSS 几何。** 每种处理都不得新增测量、观察者、监听器、状态、Effect 或渲染过程。废弃警告仅在开发环境出现。
- **PR2 — 动效仅在适用处。** FR11 在细指针下不新增监听器、观察者、测量或动画；FR12 仅在持有句柄时测量行。所有动效都运行在 transform 与 opacity 上。

## Accessibility contract

- **AR1 — 交互几何保持局部。** 任何处理都不得改变交互元素、无障碍角色/名称/状态、焦点目标或 Tab 顺序。
- **AR2 — 方向保持逻辑。** 每种处理必须在 RTL 下产生镜像几何，且不改变 DOM 顺序。

## Design relationships

| 结构或状态      | 设计要求                                                                                                                               | 表示权威               | 层级角色 | 组件契约 |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------- | -------- |
| 可选标题        | 在每种处理下都保持在宿主内容线上。                                                                                                     | `component:List/DEC-1` | 上下文   | FR2      |
| ListItem 行绘制 | 止于内容（`flush`），越出内容一个行内缩（`padded`、`outset`），或到达宿主边缘（`bleed`）。                                             | `component:List/DEC-3` | 支撑表面 | FR3–FR6  |
| 行内容          | 行的第一项内容（其标记、起始内容或标签）位于行内缩之内（`padded`），或在宿主内缩允许时位于宿主内容线上（`flush`、`outset`、`bleed`）。 | `component:List/DEC-3` | 突出     | FR2–FR5  |

## Family and system relationships

- `architecture:container-padding` 拥有宿主发布、资格、逻辑边缘语义、覆盖层重置以及共享的 `edge` 词汇。List 的 `edge` 将全部四个值投影到每一行的两个行内边缘。
- `architecture:public-component-api`、`spec:AST-002` 与 `spec:AST-017` 拥有公共 API 准入与弃用生命周期。
- Item 仍是行内边距与交互绘制的实现所有者；List 拥有集合级处理、行放置，以及其各行自身的进入、退出与交叉（FR12）。
- `spec:AST-057` 拥有 `Item` 上的滑动操作，以及"包含可滑动行的元素在行内轴上裁剪"这一规则；List 承载该裁剪（FR9），`ListItem` 将 `swipe` 原样传递给 `Item`。静态 Markdown 文档列表遵循 DEC-5 的窄例外；`spec:AST-061` FR11 拥有它们的整体计数器与跨渲染器缩进。
- `spec:AST-094` 拥有触摸呈现门控（FR13）、按压模型（FR11）与动效角色（FR4）；FR10 与 FR11 将门控与按压模型应用于列表行，FR12 的动效播放一个 FR4 角色。
- `spec:AST-105` 拥有动画布局句柄及其共享动效；List 为行更新采用它（FR12）。
- `spec:AST-103` 拥有重排序。List 是它的首个采用方：它接收 `reorderable` 对象，行的键是其 `ListItem` 的 `itemKey`，其位置是其索引，而句柄是重排序为行添加的唯一元素，位于其尾部边缘（`spec:AST-103` FR5）。重排序控制器通过行读取器找到集合的行，该读取器按顺序列出它们，并告知某个元素是否为其中之一；List 的行即其元素子节点。

## Verification map

| 契约                      | 验证                                                             | 代表状态                                                                                                                                                                                                                                                                             | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                | 审计小节            |
| ------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| FR1–FR7, FR9              | List、Item 与主题注册表测试                                      | 每种处理；所有密度；静态与交互行；表头；单独出现以及带 `edge` 出现的弃用别名；位于 List 之外的 ListItem                                                                                                                                                                              | 移除上下文传播、为两个行内边缘使用同一个宿主边缘、在没有共享内缩来源的情况下将内边距归零，或丢弃列表的延伸范围或其裁剪（超出 DEC-5 的静态 Markdown 例外）都会失败                                                                                                                                                                                                             | `audit:List/layout` |
| FR2–FR6, FR8–FR9, AR1–AR2 | 真实浏览器中的 List 几何证据                                     | 在两种内边距下置于 Card 中的每种处理、一个 Section、一个带与不带 Layout 的内联 Dialog、一个 BottomSheet、一个可垂直滚动及双向滚动的带内边距 ScrollableArea、一个带显式内边距的 LayoutContent，以及独立放置；表头与分隔线；LTR/RTL；悬停与选中行；在 `outset` 与 `bleed` 下被滑动的行 | 表头移动、内容偏离预期行、绘制超出宿主的 padding 边缘、静止绘制被裁剪，或行盒子改变，均失败                                                                                                                                                                                                                                                                                   | `audit:List/visual` |
| FR10                      | List 对触摸命中目标的测试与真实浏览器命中测试                    | 每种密度；带描述的行；排布比 44 px 更紧的紧凑行；带尾部控件的行；粗指针与细指针；主题行内边距                                                                                                                                                                                        | 粗指针下目标仍停留在其自身盒子而邻居已让出空间、目标伸入相邻行或控件的目标、行盒子改变，或细指针目标改变，均失败                                                                                                                                                                                                                                                              | `audit:List/layout` |
| FR11                      | Item 按压层测试与真实浏览器像素证据                              | 按压、保持与释放；主线程被阻塞时的释放；鼠标；位于两个带分隔线行之间的被按压行                                                                                                                                                                                                       | 脚本运行期间释放停止、为按压新增元素、按压期间分隔线被隐藏，或静止状态下绘制或层叠改变，均失败                                                                                                                                                                                                                                                                                | `audit:List/visual` |
| FR11 分隔线               | 每条分隔线相对着色层的真实浏览器像素证据                         | 被悬停的行；由鼠标与手指按压的行及其释放；浅色与深色                                                                                                                                                                                                                                 | 与相邻着色层对比度相对其静止对比度漂移超过 0.05 的分隔线、计算边框改变，或着色层未被绘制，均失败                                                                                                                                                                                                                                                                              | `audit:List/visual` |
| FR12                      | List 更新动效测试与真实浏览器帧证据                              | 一次插入、一次移除与一次重排序，带句柄与不带句柄；减少动效；鼠标；起始或结束插槽获得、失去与替换内容，以及在相同尺寸下改变内容；重排序句柄出现；获得焦点的插槽控件离开；设置行高的离开插槽                                                                                           | 保持不动的行在带句柄时跳动（除设置行高的离开插槽之后）、没有句柄却出现动效、折叠中的被移除行占据焦点、指针输入或无障碍树节点、折叠结束后被移除行仍残留，或每帧的布局或绘制失败。同样失败的还有：插槽变更在带句柄时跳动（除设置行高的离开插槽）、相同尺寸的插槽变更发生动画、离开的插槽控件保持焦点或仍可到达、焦点移动导致滚动、焦点落到页面 body，或设置高度的插槽播放退场。 | `audit:List/visual` |
| Migration                 | `astryx upgrade` codemod 测试                                    | 静态、别名、已迁移、动态与计算型 `edge` 的调用点；第二次运行                                                                                                                                                                                                                         | 动态值或计算得到的 `edge` 被改写、静态值被漏掉，或第二次运行改变了输出，均失败                                                                                                                                                                                                                                                                                                | `audit:List/docs`   |
| Documentation             | `List.doc.mjs`、Storybook 与 `scripts/check-knowledge.mjs`       | 公共 prop、取值、默认值、弃用与代表性组合                                                                                                                                                                                                                                            | 契约、文档或示例缺失或过时，均失败                                                                                                                                                                                                                                                                                                                                            | `audit:List/docs`   |
| FR13                      | List 测试，以及用鼠标、手指与键盘测试行菜单的真实浏览器测试      | 普通行、带 `onClick` 的行、带 `href` 的行；右键、长按、Shift+F10、上下文菜单键；通过 Escape 与通过选择关闭；手指按住、鼠标右键、键盘，以及 `presentation: 'popover'`                                                                                                                 | `<li>` 的外层包裹元素、上下文请求无法打开的行、关闭的菜单中遗留焦点或焦点未返还给行或其按钮、没有名为 "More actions" 按钮的普通行，或忽略 Shift+F10 的可聚焦行，均失败。鼠标、键盘或 `presentation: 'popover'` 下的抬升或按压绘制，或可聚焦行上手指按住却没有它们，也失败。                                                                                                   | `audit:List/layout` |
| FR13 重排序               | 在带菜单的可重排序行上用手指和鼠标进行的真实浏览器测试           | 在带菜单的可重排序行的句柄上与行主体上按住                                                                                                                                                                                                                                           | 按住句柄打开菜单，或按住主体将行拾起，均失败                                                                                                                                                                                                                                                                                                                                  | `audit:List/layout` |
| FR9, DEC-5                | 真实浏览器中的整体计数器墨迹、无序父级渲染器一致性与只读任务几何 | 嵌套在无序列表与只读任务列表中的静态 Markdown 有序列表，LTR/RTL；普通 List 与可滑动 List                                                                                                                                                                                             | 恢复 Markdown 祖先裁剪会切掉前导计数器墨迹。在无序父级下，Markdown/RichText 文本起点或嵌套内缩不匹配会失败。在只读任务父级下，复选框遮挡计数器、勾选状态改变或 Markdown 父级文本锚点不正确均失败；本行不声称覆盖任务父级的跨渲染器一致性。移除通用 List 裁剪会让移动的行绘制到其分组之外。                                                                                    | `audit:List/visual` |

## Decision log

### DEC-1 — List owns the collection-wide opt-in

**Reference:** `component:List/DEC-1`

**Decider:** cixzhang, 2026-09-21

List 表头与 ListItem 行本来会起始于不同的内容行。只有调用方知道包含它的组合何时需要对齐，而 List 可以对每一行施加一致的决策，无需暴露 Item 级别的配置。

### DEC-2 — Compensation is row-local and bounded

**Reference:** `component:List/DEC-2`

**Decider:** cixzhang, 2026-09-21

每一行抵消的范围不超过其自身组件拥有的行内内缩或与之匹配的宿主内缩。当宿主内缩不小于行内缩时，内容到达宿主内容行。当宿主内缩更小时，内容朝该行移动，但不会把行的绘制拉出宿主边界之外。

已否决：`isFullBleed`，因为行可能停在宿主内边距之内，而该名称会承诺组件并不提供的外边缘出血。

### DEC-3 — One edge prop names every row edge treatment

**Reference:** `component:List/DEC-3`

**Decider:** cixzhang, 2026-10-15

`padded`、`flush`、`outset` 与 `bleed` 是对同一个问题的互斥回答，因此一个封闭取值 prop 承载它们，任何组合都无法自相矛盾。这些名称是 `architecture:container-padding` 的共享边缘词汇。`outset` 是 DEC-2 的有界补偿；`edgeCompensation` 仍是它的弃用别名。

已否决：在 `edgeCompensation` 之外的独立布尔 prop，因为它们可能同时请求两种处理。

### DEC-4 — Bleed reaches the host edge and keeps content on its padding line

**Reference:** `component:List/DEC-4`

**Decider:** cixzhang, 2026-10-15

`bleed` 在带内边距的宿主中与 Table 行一致：行的绘制以直角到达宿主的 padding 边缘，例外是，当列表是圆角宿主的第一个或最后一个子节点时，其第一行或最后一行承袭该宿主的圆角，并减去它保留的宿主块内边距（FR5）。内容位于宿主内容行上，绝不会比行自身的内缩更靠近行边缘。它是可选项，因此既有列表保持其几何。

已否决：在带内边距的宿主内把 bleed 作为默认，因为它会移动容器中每个既有列表。

### DEC-5 — Static Markdown lists preserve complete outside counters

**Reference:** `component:List/DEC-5`

**Decider:** imdreamrunner, 2026-10-29

当静态 Markdown 文档列表（有序与无序）的行不暴露任何滑动操作时，可以省略行内裁剪。完整的数字标记可以向行内起始方向绘制，越过其自身列表以及任何外层的 Markdown 列表，而文本起点与嵌套锚点遵循 `spec:AST-061` FR11。通用 List 以及包含可滑动行的集合保留 FR9 的行内裁剪，使移动行的绘制留在集合边界之内。该例外不移除宿主自身的裁剪，也不改变列表来源、编号、标记样式或公共 API。

已否决：加宽有限的标记槽位，因为它只会移动计数器宽度的失败阈值。

### DEC-6 — A touch press takes the row's `::before`

**Reference:** `component:List/DEC-6`

**Decider:** cixzhang, 2026-10-25

在触摸呈现下，交互行在自身的 `::before` 上绘制其按压，这是合成器在脚本运行时唯一能淡出的绘制。调用方在行上的自有 `::before` 仅在行被按压时合并进该层，因此必须在按压期间保留的装饰应放在子节点上，或放在不受约束的 `::after` 上。交互式 ListItem 行的 `::after` 是其触摸命中区域（FR10）。被按压行的分隔线保持其静止颜色。

已否决：在按压期间保持调用方的 `::before` 不变，因为那样行就需要第二个元素或主线程绘制来实现其按压。

## Open questions

- **OQ2 — 谁来渲染普通行的 More actions 按钮并返还焦点。** `useContextMenu` 返回 `open` 与 `close`，但不返回触发器，因此对于没有 `onClick`、`href` 或 `interactiveRef` 的行，FR13 的 More actions 按钮尚无所有者：(a) 调用方在行的尾部内容中渲染一个调用 `open` 的 Button，并用行的标签为其命名；(b) ListItem 在其 ref 携带菜单时渲染它；(c) `useContextMenu` 返回触发器的 props。同一个答案还决定了关闭时谁将焦点返还给行的焦点目标或该按钮（因为该 hook 将其返还给 `<li>`），以及谁在手指按住时绘制普通行的按压（因为 FR11 只绘制交互行的按压）。

## Content boundary

本声明范围内的契约不重复 List 的完整 prop 表、container-padding 内部实现、使用方示例、实现步骤，也不重复未来的 TabList/Button 投影。这些内容仍归属于其具名所有者。
