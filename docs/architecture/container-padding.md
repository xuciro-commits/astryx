---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:container-padding
authority: current
archive_reason: null
superseded_by: null
approved_by: imdreamrunner
approved_at: 2026-10-04
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/Layout/container.stylex.ts,
    packages/core/src/Layout/containerCorners.stylex.ts,
    packages/core/src/Layout/padding.stylex.ts,
    packages/core/src/Layout/edgeCompensation.stylex.ts,
    packages/core/src/Card/,
    packages/core/src/Dialog/,
    packages/core/src/BottomSheet/,
    packages/core/src/Lightbox/,
    packages/core/src/MobileNav/,
    packages/core/src/Section/,
    packages/core/src/ScrollableArea/,
    packages/core/src/Layout/,
    packages/core/src/Divider/,
    packages/core/src/Item/,
    packages/core/src/List/,
    packages/core/src/TabList/,
    packages/core/src/Table/,
    packages/core/src/Toolbar/,
    packages/core/src/Layer/,
    packages/core/src/AppShell/,
  ]
verified_by:
  [
    packages/core/src/Section/Section.test.tsx,
    packages/core/src/ScrollableArea/ScrollableArea.test.tsx,
    packages/core/src/Layout/Layout.test.tsx,
    packages/core/src/Layout/LayoutSlots.test.tsx,
    packages/core/src/Layout/overlayPaddingReset.test.tsx,
    packages/core/src/BottomSheet/BottomSheetPanel.test.tsx,
    packages/core/src/Layout/__tests__/edgeCompensation.test.tsx,
    packages/core/src/List/List.test.tsx,
    packages/core/src/TabList/TabList.test.tsx,
    packages/core/src/AppShell/AppShell.test.tsx,
    packages/core/src/AppShell/__tests__/AppShellLayoutRoot.interaction.browser.spec.ts,
    packages/core/src/Layout/__tests__/ContainerCorners.a11y.chromium.spec.ts,
  ]
deciding_specs: [spec:AST-002/DEC-1, spec:AST-002/DEC-2, spec:AST-025/DEC-2]
---

# Container padding architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layout": [
      "INV1",
      "INV3",
      "INV6",
      "INV8",
      "INV9",
      "INV10",
      "INV11",
      "INV12"
    ],
    "public-api": ["INV3", "INV7", "INV9", "INV10", "INV11"]
  }
}
```

## Purpose

带内边距的容器及其后代需要对每个逻辑边缘的内缩、以及每个逻辑角的圆角半径有一份共享记录。没有它，全出血子级就无法抵消它实际收到的内边距，也无法跟随它到达的角；嵌套区域无法保持一条内容线；覆盖层可能从它已不再占据的视觉盒子继承几何信息。

本记录描述共享的内部协议。它不会使其 CSS 变量成为公共 API。`spec:AST-025/DEC-2` 将 ScrollableArea 添加为显式参与者，默认没有内边距也没有出血。

## System model

该协议有四层：

1. **公共组件输入与主题属性。** 组件 props 使用公共间距刻度。主题组件覆盖可以设置支持的内边距属性。`architecture:theme-authoring-contract` 和 `architecture:component-theming-surface` 拥有这些公共表面。
2. **容器降级。** `container()` 将 Card、Section、Dialog 和 BottomSheet 的内边距解析为内部逻辑边缘变量。显式的组件内边距 prop 可以通过 `padding.stylex.ts` 中的映射发布相同的几何信息。
3. **后代几何。** 四个继承的 `--container-padding-*` 变量携带出血后代要减去的内缩，四个继承的 `--container-corner-*` 变量携带它们在到达角时所取的圆角半径（见下文“角几何”）。容器发布者和显式区域内边距路径将这些变量与其内边距耦合。Layout 还通过 `--layout-padding-outer-*` 和 `--layout-padding-inner-*` 携带外/内分割；自动区域放置会应用该分割，并且每个区域会重新发布它应用的边缘，但 LayoutContent 的内容宽度边槽例外，它被应用但不发布（`component:LayoutContent` FR2）。
4. **边界重置。** 覆盖层在离开其祖先的视觉盒子时仍然是 DOM 后代。`overlayPaddingReset` 将后代要减去或作为角取用的值归零，并使后代要加上的值失效，因此读取者会回落到它们自己的默认值。它不会清除公共主题属性。布局根在其自身布局开始的地方结束同一条继承链：AppShell 在其根上应用 Layout 的 `layoutReset`（`component:AppShell` FR18），这将 `overlayPaddingReset` 扩展到其余的 Layout 值（`component:Layout` FR8）。

### Current and admitted publishers and consumers

| 角色           | 参与者                                                         | 契约职责                                                                                                                                  |
| -------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| 容器发布者     | Card、Section、Dialog、BottomSheet、ScrollableArea             | 解析组件内边距，或将显式内容盒内边距作为逻辑边缘和 Layout 内缩变量发布                                                                    |
| 区域发布者     | LayoutHeader、LayoutContent、LayoutFooter、LayoutPanel         | 在自动和显式内边距路径上，发布每个区域在每条边上应用的内边距；LayoutContent 的内容宽度边槽被应用但不发布（`component:LayoutContent` FR2） |
| 出血消费方     | Section、ScrollableArea、Layout、Divider、Table、TabList、List | 在每个组件设计为逃逸的边上减去继承的内缩；ScrollableArea 仅在 `isFullBleed` 时这样做，TabList 和 List 仅在 `edge="bleed"` 时这样做        |
| 边缘补偿消费方 | 具有 `edge="outset"` 的 List/ListItem 行                       | 在保留组件拥有的交互内边距的同时，将可见内容移向容器内容线；精确对齐取决于每个组件的有界几何                                              |
| 对齐消费方     | Toolbar 和进行边缘补偿的子组件                                 | 读取当前行内内缩以对齐可见内容，而不是堆叠触摸目标的内边距                                                                                |
| 边界所有者     | 图层表面和基于 dialog 的覆盖层根；AppShell 的根                | 在后代读取继承的页面几何之前应用 `overlayPaddingReset`，或在 AppShell 的根处应用 Layout 的 `layoutReset`                                  |

参与者列表是共享容器系统，而不是 Layout 拥有的家族：Section 和 ScrollableArea 发布内容内缩，Section 和选择加入的全出血 ScrollableArea 实例消费继承的内缩，Layout 重新分配内缩，Table 和 Divider 消费出血几何，TabList 用 `edge="bleed"` 消费出血几何，List 用 `edge="outset"` 消费边缘补偿几何并用 `edge="bleed"` 消费出血几何，Toolbar 消费对齐几何。在这里参与本身并不会使这些组件中的任何一个成为 `family:layout-regions` 的成员。

BottomSheet 的发布方式与 Dialog 相同。其 Sheet 面板是覆盖层边界所有者，其滚动的 Content 区域是容器发布者，为调用方内容提供内边距并发布应用的内缩。该内缩优先从公共间距刻度上的 `padding` prop 解析，其次从 `bottom-sheet` 组件上的主题 `padding` 属性解析，最后回落到每条逻辑边缘上的 `--spacing-4`，与 Dialog 一致。该 prop 和主题属性是 BottomSheet 对容器降级的投射。在块起始处，sheet 在其浮动抓取条下方保留一条带（`--spacing-6`），这不是容器内边距：它只发布该带之后的内边距，并将该带叠加在上，因此其应用的块起始内缩为 `max(padding, --spacing-6)`，而跳过所发布内边距的单独 Section 或 Layout 仍然从该条下方开始（`component:BottomSheet`，Content area inset）。

边缘补偿是一个双边几何契约，而不是 token 契约：

1. **宿主侧。** 符合条件的容器或区域状态通过现有的私有 `--container-padding-*` 变量发布每个逻辑边缘当前可用的内边距。这些值必须匹配该状态应用的内边距，但 BottomSheet 的块起始除外，它只发布其抓取条带之后的内边距（见上文），并遵循嵌套以及覆盖层和布局根重置；缺失值表示零。存在已知发布不匹配的状态不符合条件。发布本身不会使后代选择加入补偿。
2. **组件侧。** 参与的组件拥有其内容周围保留的内缩，并从与其正常内边距相同的、感知密度和主题的来源派生该内缩。组件只消费其契约将其公共值应用到的逻辑边缘，并且从不要求容器理解其组件 token。

对于新的自补偿行或表面，默认的合格宿主状态在视觉上是中性的：它不贡献背景、边框、裁剪或交互绘制，否则其边界会被调整削弱。视觉上有界或裁剪的状态需要针对该宿主的组件特定契约和证据。外盒已经是预期对齐边界的控件和卡片、已接纳集合之外的静态内容，以及意在到达容器外边缘的表面，在其他情况下均不符合条件。TabList 是现有的专门投射：INV11 拥有其更宽的宿主和溢出几何。

仓库还有一个容器拥有的槽位补偿机制。Ghost Button 和 Tab 标记其透明内边距，而 Banner 和 Toolbar 按其自身已知的内缩移动边缘槽位。它共享内容对齐意图，但不读取继承的容器内边距，也不为这些子级提供调用方控制的补偿 API。本修订保持该机制不变。

`edge` 是边缘处理的共享公共词汇。其值指明参与组件的绘制和内容相对于宿主内容边缘的位置，并且每个值都声明其有界几何：

- `padded`：组件保留自己的内缩，不读取任何宿主内边距。它是自补偿组件的默认值，省略时即表示它。
- `flush`：组件移除自己的内缩，因此内容和绘制共享组件的边缘。它不读取宿主内边距。
- `outset`：绘制越过宿主内容线，超出量为组件自身内缩与宿主内缩中的较小者，并且组件在该绘制内部保留自己的内缩。当宿主内缩至少等于组件内缩时，内容到达宿主内容线。
- `bleed`：绘制到达宿主的内边距边缘，消费完整的继承内缩。内容位于宿主内容线上，或者当宿主内缩较小时，位于距组件边缘其自身内缩的位置。

组件将值应用到其契约命名的逻辑边缘，独立解析每个边缘，并且只暴露其当前契约和证据支持的值。在合格宿主之外，`outset` 和 `bleed` 读取零宿主内缩，并像 `padded` 一样放置内容。数量保持由组件拥有（INV9）。该词汇不承诺组件盒子到达容器的外边缘，除非在 `bleed` 下，新 API 使用它，而不是暴露 margin 值或另一个名称。

`isFullBleed` 将组件的整个可见表面移动到宿主的内边距边缘，且没有自己要保留的内容线：Divider 的线，以及 ScrollableArea 的视口（其内容内边距是它自己的 prop）。`bleed` 对绘制做出同样的承诺，并补充内容保持在宿主内容线上。保留内容线的新的全出血投射使用 `edge="bleed"`。TabList 的 `isFullBleed` 行为等同于 `bleed`，因此 `component:TabList` 将该模式写作 `edge="bleed"`，并保留 `isFullBleed` 作为其已弃用的别名。`edgeCompensation` 是 `outset` 的已发布名称：List 的 `edgeCompensation="inline"` 是 `edge="outset"` 的已弃用别名，贯穿其兼容窗口。

拥有已记录解剖结构容器并应用边缘处理的组件可以暴露面向解剖结构的 `<anatomy>Edge` prop，使用相同的值，并应用到该容器已记录的边缘。它保持数量由组件拥有以及组件已记录的省略行为。DialogHeader 和 DrawerHeader 已发布的 `endContentEdgeCompensation` props 不在此形式之内：它们的 `inline`、`block` 和 `all` 值选择末端槽位补偿的轴，而不是一种处理。两者作为已发布内容继续受支持。这些轴值如何映射到 `endContentEdge` 处理值是一个开放问题，由 `module:Dialog/DialogHeader` 和 `component:Drawer` 拥有；一旦决定映射，每个都通过自己的兼容窗口弃用其旧 prop。

### Edge-compensation ledger

| 参与者                          | 来源要求                                                                                                                 | 规范所有者                       | 为何属于此处                                                                                           | 完成标准                                                                                                                        | 状态                                              |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| 容器和区域发布者                | 宿主拥有每个逻辑边缘实际可用的内边距                                                                                     | `architecture:container-padding` | 没有来自宿主的逐边缘上界，消费方无法安全补偿                                                           | 合格状态发布匹配已应用内边距、嵌套以及覆盖层和布局根重置的值；缺失值解析为零；已知不匹配状态保持排除                            | 符合处为 current                                  |
| TabList / Tab                   | 条带将其第一个和最后一个可见标签内容移向宿主内容线，同时保留标签交互内边距、焦点环空间、溢出控件、其分隔栏及其选择指示器 | `component:TabList`              | 已发布行为是在已发布名称 `isFullBleed` 下的 `bleed`                                                    | 保持有界内容移动、完整宿主内缩消费、分隔线跨度、溢出、裁剪、滚动控件、指示器几何、逻辑方向、兼容性和默认值                      | 当前行为；`edge="bleed"` 为规范值，别名待定       |
| List / ListItem，使用 Item 内缩 | 可选的 List 标题不进行水平内缩，而每一行保留 Item 的、感知密度和主题的行内内边距                                         | `component:List`                 | 调用方知道 List 是否位于中性容器中、旁边的内容是否应与其共享逻辑内容线，以及其行是否需要围绕绘制的空间 | 默认 `padded` 不变；`outset` 尊重每行自己的内缩和可用宿主内边距；`bleed` 到达宿主的内边距边缘；标题保持原位；所需的几何证据通过 | 通过 `edge` 为 current；`edgeCompensation` 已弃用 |
| Button                          | 未包含在容器中的 ghost Button 可能需要对齐其图标或标签，同时保留其交互内缩                                               | 无当前组件投射                   | 其透明交互内边距会产生相同的对齐需求                                                                   | 排除填充和带边框的呈现；证明组合、焦点/悬停绘制、逻辑方向和不变的默认值；获得所有者批准                                         | 仅为候选                                          |

`component:List` 拥有本修订接纳的唯一新 API 投射，即其 `edge` prop。
`component:TabList` 拥有其现有行为及其 `edge="bleed"` 重命名与弃用路径。Button 仍是候选，不能授权实现；未来的投射需要组件契约、证据以及具名所有者的明确批准。

本记录不添加 EdgeAlignment 包装器或新的 token 词汇。现有的容器内边距参与仍是唯一的宿主提供者，每个组件契约拥有其本地保留的内缩和公共投射。

### Corner geometry

到达圆角容器角部的全出血子级会取该角，因此其自身的角、焦点环和填充会跟随容器的曲线，而不是被容器的裁剪切掉。容器通过四个继承的 `--container-corner-*` 变量发布其角，每个逻辑角一个：`start-start`、`start-end`、`end-start` 和 `end-end`，按照逻辑 `border-radius` 属性的顺序。缺失值表示方角。

读取角的子级用 `data-container-corner` 标记自身。圆角容器仅当读取者是它的第一个子级时才发布其块起始角，仅当读取者是它的最后一个子级时才发布其块结束角。当任何读取者位于其更深层时，它不发布任何角，因为这样的读取者可能取用其未到达的角。因此，读取者只有作为发布它的容器的直接子级时才会取角。

| 宿主        | 发布的角                                                              |
| ----------- | --------------------------------------------------------------------- |
| Card        | 其半径。其全出血子级到达边框下方，因此这是外半径                      |
| Dialog      | 其半径；全屏时为 0                                                    |
| BottomSheet | 无：其内容在顶部保留抓取条的带，因此全出血子级永远不会到达 sheet 的角 |
| 所有其他    | 无                                                                    |

读取者仅在其出血到达处取角。在每个角处，其半径是发布的角减去它在与此相接的块边缘上保留的内边距，且永远不小于 0：

- Table 的滚动区域仅作为其容器的第一个或最后一个子级时在块边缘出血。在那里它取完整的角；其他每个角都是 0。
- 具有 `edge="bleed"` 的 List 保留宿主的块内边距。当列表是其容器的第一个子级时，其第一行取块起始角减去该内边距；当列表是最后一个子级时，其最后一行取块结束角减去块结束内边距。有标题时，列表的根是容器的子级，标题位于第一行上方，因此只有最后一行可以取角。其他每个行角都是 0。

读取角是组件出血契约的一部分（INV3）：不消费出血的组件不读取任何角；独立存在、位于方形容器内、位于包装元素内，或位于其他内容之间时，每个角都解析为 0。Popover、菜单以及其他不是容器发布者的表面不在此几何范围内。

`--_section-padding-propagated` 与公共 `--astryx-section-padding` 属性是分开的。私有值携带一个祖先 Section 的显式内边距。因此，覆盖层可以丢弃祖先几何，而不丢弃活动主题的 Section 默认值。

## Boundaries and invariants

- **INV1 — 内部几何不是主题 API。** `--container-padding-*`、`--container-corner-*`、`--layout-padding-*` 和 `--_section-padding-propagated` 是实现协议。主题使用已记录的组件属性，而不是设置或依赖这些名称。
- **INV2 — 耦合的发布路径保持耦合。** 当当前源码在内边距声明旁发布几何时——容器降级、Section 的逻辑边缘覆盖、显式 Layout 区域内边距以及全出血重置——匹配的变量会随该声明一起变化。自动 Layout 区域边缘发布它应用的内边距，但 LayoutContent 的内容宽度边槽除外（`component:LayoutContent` FR2）。
- **INV3 — 出血是选择加入且按边缘生效的。** 后代只有在其组件契约选择加入出血时才会逃逸内边距，并且仅在契约覆盖的边上。继承变量的存在不会使每个后代都全出血。
- **INV4 — Layout 区分外边缘和内边缘。** 命名 Layout 区域在接触壳体的地方应用外内缩，在与其他区域相接的地方应用内内缩。槽位存在性和每个区域的显式内边距选择应用的边缘样式，并且每个区域重新发布它应用的边缘（INV2）。
- **INV5 — Section 传播的权威范围比主题默认值更窄。** 祖先 Section 的显式内边距可以传播到嵌套的 Section，但它不会替换公共主题属性，也不会跨越覆盖层边界或布局根。
- **INV6 — 覆盖层和布局根边界终止过时几何。** 最外层的带样式覆盖层根将 `--container-padding-*` 和 `--container-corner-*` 归零，使 `--layout-padding-*` 和 `--_section-padding-propagated` 失效，并保持公共主题属性不变。AppShell 的根是布局根：它应用 Layout 的 `layoutReset`，后者执行相同的操作并重置其余 Layout 值，因此 AppShell 外部的带内边距宿主不会改变其内部的任何几何（`component:AppShell` FR18、`component:Layout` FR8）。
- **INV7 — 组合保持组件所有权。** 该协议只携带几何。Section 变体、Layout 区域语义、Toolbar 行为、Table 结构、Divider 呈现和组件主题化仍归其组件或家族契约所有。
- **INV8 — 参与是显式的。** 仅凭内边距不会使组件加入。Stack 和 Center 当前应用本地内边距而不发布此协议，因此后代不能在那里假设全出血补偿。
- **INV9 — 边缘补偿有两个几何所有者，而不是共享 token。** 参与的宿主只发布每个逻辑边缘当前可用的内边距。参与的组件拥有其内容周围保留的内缩，并从与其应用的内边距相同的组件拥有来源派生补偿。任何一方都不命名或复制另一方的主题 token。
- **INV10 — 公共词汇命名意图。** `edge` 使用上文定义的 `padded`、`flush`、`outset` 和 `bleed` 值来命名组件的边缘处理。每个组件契约声明值应用到的边缘、其有界几何以及内容何时到达宿主内容线，并且只暴露它接纳的值。省略表示 `padded`，但解剖结构容器保持其已记录的省略行为。`isFullBleed` 保留给公共承诺为消费完整宿主内缩且没有自身内容线的表面。`edgeCompensation` 作为 List 的 `edge="outset"` 已弃用别名继续存在，也存在于 DialogHeader 和 DrawerHeader 已发布的 `endContentEdgeCompensation` 中，直到它们的 `endContentEdge` 映射被决定。
- **INV11 — 参与和宿主资格是显式的。** 新的自补偿行或表面需要组件契约，并默认使用视觉中性的宿主状态。组件特定契约只有在具备该几何的证据时才可以接纳有界或裁剪的宿主。发布的内缩与其应用的内边距不匹配的宿主状态不符合条件，直到该一致性缺口被修复。仅凭容器发布永远不会使子级选择加入，而改变组件内边距的任意消费方 CSS 不在共享对齐保证范围内。

- **INV12 — 角只到达直接读取者。** 圆角内边距发布者从绘制其自身角的半径发布其角，发布发生在发布其内边距的元素上。它只向在该块边缘上是其第一个或最后一个子级的读取者发布角，当读取者位于其更深层时不发布任何角。读取者仅在其出血到达该边缘处取角。其他每个元素都不发布角。

## Current-state impact

- **BottomSheet 角。** BottomSheet 不发布角：其抓取条带位于内容上方，因此没有内容子级与 sheet 的角相接。

## Change coupling

- 更改发布者的内边距优先级、逻辑边缘或容器变量时，会同时更新其声明以及匹配的出血/对齐证据。
- 添加协议参与者时，要确定它是发布、消费还是重置几何，并在其契约依赖该角色之前添加有针对性的跨组件回归测试。
- 边缘补偿宿主按逻辑边缘发布实际可用的内缩；它不发布 token 选择，也不推断子级保留的内边距。
- 暴露边缘处理的组件使用 `edge`，或对解剖结构容器使用 `<anatomy>Edge`，只声明其当前支持的值，并将其有效内缩和补偿保持在同一个派生来源上。添加另一个值需要逐边缘、非对称、零内边距、RTL 和主题覆盖的证据。
- 将现有的补偿或全出血 API 迁移到 `edge` 时，通过其批准的兼容窗口保留旧名称作为已弃用别名，将维护中的示例迁移到 `edge`，并在移除前测试两条路径。
- 更改 `container()` 或公共到私有内边距降级时，会一起审查 Card、Section、Dialog、BottomSheet、Layout 区域和覆盖层行为。
- 更改圆角发布者的半径来源，或添加圆角发布者或角读取者时，会同时更新角发布、读取者标记和角证据（INV12）。
- 更改覆盖层宿主，或添加覆盖层根或布局根时，会验证过时的页面几何在新边界处停止，且不会抑制公共主题值。
- 除 BottomSheet 之外的组件如果希望有新的公共全出血模式或内边距 prop，需遵循其组件/家族 API 审查；本架构不授权该 API。`component:List` 拥有 List 的 `edge` 投射，包括其全出血 `bleed` 值，`component:TabList` 拥有其现有行为和迁移。本记录不授权其他组件投射。

## Owning code

- `packages/core/src/Layout/container.stylex.ts` — 将容器主题和显式内边距降级为内部几何。
- `packages/core/src/Layout/containerCorners.stylex.ts` — 保存圆角宿主共享的唯一角发布；该包不导出它。
- `packages/core/src/Layout/padding.stylex.ts` — 拥有公共间距步进映射、逻辑边缘设置器、Section 传播和覆盖层重置。
- `packages/core/src/Layout/edgeCompensation.stylex.ts` — 拥有针对已标记边缘内容的容器侧对齐调整。
- Card、Section、Dialog、BottomSheet、ScrollableArea 和 Layout 区域实现 — 发布其当前几何。
- Section、ScrollableArea、Layout、Divider、Table、TabList、List 和 Toolbar 实现 — 消费当前几何以进行出血或对齐。
- TabList 当前降级其组件拥有的投射；List 降级其 `edge` 投射。`component:TabList` 和 `component:List` 定义其本地内边距、行/条带几何和私有传播。
- Card 和 Dialog 实现 — 在每个块边缘设置半径，以供共享的角发布使用。
- Table 和 List 实现 — 将自身标记为读取者，并取用它们到达的角。
- 覆盖层根 — 在视觉边界处应用重置。
- `packages/core/src/AppShell/AppShell.tsx` — 在壳体的根处应用 Layout 的 `layoutReset`。

## Deciding specs

- `spec:AST-002/DEC-1` 和 `spec:AST-002/DEC-2` 要求调用方拥有的选择加入及其名称描述可靠的结果，而不是 margin 或 token 机制。
- `spec:AST-025/DEC-2` 和 `component:ScrollableArea/FR5` 确立了对比性的全出血契约：ScrollableArea 仅通过显式 `isFullBleed` 消费完整的继承内缩，且没有自己要保留的内容线。List 的 `edge="outset"` 最多抵消其自身的 Item 内缩，并可能停留在容器内边距之内。List 的 `edge="bleed"` 和 TabList 的 `isFullBleed` 通过其绘制消费完整的宿主内缩，并按 `max(host inset - own inset, 0)` 补回内边距，因此它们的内容落在宿主内容线上，或者当宿主内缩小于自身内缩时更靠内。

## Verification

| 不变量           | 证据                                                                                                                                                                                                          | 失败信号                                                                                                                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV2, INV5       | 按边缘和嵌套传播测试 `Section.test.tsx`                                                                                                                                                                       | 按边缘 prop 留下过时的几何变量，或嵌套 Section 丢失已发布的传播顺序                                                                                                                            |
| INV2, INV3, INV8 | `ScrollableArea.test.tsx` 内边距和全出血测试                                                                                                                                                                  | 内容盒发布的 inset 与其应用的内边距不同，或视口在没有显式全出血时逃逸继承的内边距                                                                                                              |
| INV4             | Layout 源码审查以及 `Layout.test.tsx` 和 `LayoutSlots.test.tsx`；针对所发布值的 `nestedPadding.test.tsx` 和区域审计规范（`LayoutPanelAudit`、`LayoutContentAudit`、`LayoutHeaderAudit`、`LayoutFooterAudit`） | 槽位存在性不再选择已发布应用的外/内边缘样式，或区域重新发布的边缘与其应用的内边距不同                                                                                                          |
| INV2             | `BottomSheetPanel.test.tsx` 内边距测试                                                                                                                                                                        | Content 区域在任何边缘上发布的 inset 与其应用的内边距不同（块起始除外），其块起始发布超过抓取条带之后的内边距，或 `padding` prop 或主题 `padding` 未到达它                                     |
| INV6             | `overlayPaddingReset.test.tsx`                                                                                                                                                                                | 覆盖层继承页面内缩、丢失其主题的 Section 内边距，或让祖先 Section 传播跨越边界                                                                                                                 |
| INV5, INV6       | `AppShellLayoutRoot.interaction.browser.spec.ts` 和 `AppShell.test.tsx` 中的 "AppShell layout root (FR18)" 套件                                                                                               | 带内边距的 Card、Section 或 Layout 内 AppShell 的区域与其页面根渲染不同，或重置值或上下文泄漏到壳体中                                                                                          |
| INV3, INV7       | `Layout/__tests__/edgeCompensation.test.tsx` 以及组件测试                                                                                                                                                     | 未标记的子级被补偿，或已标记的边缘内容丢失直接子级可发现性                                                                                                                                     |
| INV9, INV10      | `List.test.tsx` 以及真实浏览器几何证据                                                                                                                                                                        | 标题移动；行读取错误的逻辑边缘、偏离主题/密度内边距、应用错误的有界移动，或丢失绘制内边距                                                                                                      |
| INV10, INV11     | `TabList.test.tsx` 以及真实浏览器溢出、分隔线和指示器证据                                                                                                                                                     | 完整宿主内缩消费、有界内容移动、分隔线跨度、交互、焦点、溢出、滚动控件或指示器几何出现回归                                                                                                     |
| INV3, INV12      | `ContainerCorners.a11y.chromium.spec.ts`                                                                                                                                                                      | 作为 Card 或 Dialog 第一个或最后一个子级的 Table 或出血 List 行保持方角，或其焦点环在角处被裁切；或读取者位于其他内容之间、包装器内、超过容器内边距之后，或 BottomSheet 抓取条下方时仍进行圆角 |

List 证据必须覆盖 `edge` 的每个值，在其中性根中以及 List 接纳的每个有界宿主（Card、Section、Dialog、BottomSheet）中，包括可选标题、交互行和静态行、所有密度、主题 `item.paddingInline` 覆盖、LTR 和 RTL、宿主内缩小于/等于/大于 Item 内缩、均匀/非对称/零/缺失容器内边距、悬停/选择绘制几何，以及 `outset` 和 `bleed` 下的滑动行。TabList 使用其单独界定范围的证据；Button、菜单行和工具栏项不被 List 的证据接纳或验证。
