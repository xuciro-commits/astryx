---
schema_version: 1
template_version: 1
kind: family
id: family:layout-regions
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, accessibility, theming]
verified_by:
  [
    packages/core/src/Section/Section.test.tsx,
    packages/core/src/Layout/Layout.test.tsx,
    packages/core/src/Layout/LayoutSlots.test.tsx,
    packages/core/src/Layout/__tests__/childrenAsContent.test.tsx,
    packages/core/src/Layout/__tests__/contentWidth.test.tsx,
    packages/core/src/Toolbar/Toolbar.test.tsx,
  ]
members:
  [
    component:Section,
    component:Layout,
    component:LayoutHeader,
    component:LayoutContent,
    component:LayoutFooter,
    component:LayoutPanel,
    component:Toolbar,
  ]
architecture:
  [architecture:container-padding, architecture:public-component-api]
contributing: []
deciding_specs: []
---

# Layout regions contract

## Intent

页面或有界工作区在加入产品内容之前，应当具有可预测的结构区域。构建者可以使用通用的 Section、五槽位 Layout 原语或上下文相关的 Toolbar，而无需让每个界面自行发明内边距、边界、区域方向或内容归属。AppShell 拥有页面外壳，将这些较低层区域与应用导航组合在一起。

## Membership rule

当组件的主要公共目的是定义稳定的结构区域时，它便属于该族：通用页面/内容区域、Layout 五槽位拓扑中的具名位置，或上下文操作区域。成员可以组合共享布局原语，但它们拥有的边界强于单纯的任意子项排列。

- **成员：** Section；Layout 及其 Header、Content、Footer 和 Panel 区域；Toolbar。
- **协作者：** `family:layout-primitives` 提供任意子项排列工具；`architecture:container-padding` 提供更广泛的内边距和出血系统，供 Section、Layout 及其区域、Table、Toolbar 和 Divider 使用；useResizable 和 ResizeHandle 可以驱动面板的尺寸；AppShell 拥有页面外壳，并将 Layout 与应用导航组合；组件主题化拥有视觉目标。
- **排除项：** Stack、Grid、Center 及其修饰符排列任意子项，但不主张结构区域。FormLayout 拥有字段特定的排列和可选性。Card 是离散项表面。AppShell 拥有页面外壳和导航语义，而不是这套可复用区域语法。Table 拥有结构化数据，Divider 拥有分隔；它们参与 `architecture:container-padding` 并不使其中任何一个成为布局区域成员。

组件不会仅仅因为它恰好渲染了一个 flex 行、一个带内边距的包装器或类似页眉的视觉处理而加入。

## Shared owner

- Section 拥有通用的绘制页面/内容区域，包括其变体、选定的分隔边缘、组件内边距和嵌套 Section 行为。
- Layout 拥有其五槽位拓扑、槽位存在性、区域位置、共享的外侧/内侧内边距、高度模式、内容宽度传播，以及默认的页眉/页脚分隔上下文。它不拥有页面外壳。
- LayoutHeader、LayoutContent、LayoutFooter 和 LayoutPanel 拥有各自的区域元素、可选的地标角色/名称、局部内边距，以及区域特定的尺寸或滚动行为。
- Toolbar 拥有上下文操作区域、其起始/中间/结束泳道、工具栏语义、键盘移动和尺寸级联。它把绘制表面、变体和选定的分隔边缘委托给 Section。
- `architecture:container-padding` 拥有继承的内边距和出血机制。
- useResizable 和 ResizeHandle 拥有调整尺寸的状态和交互。LayoutPanel 接受其当前尺寸作为替代的宽度所有者，将其元素借给调整尺寸控制器以在折叠和打开时显露边缘，并拥有折叠面板的焦点移动和 inert 状态（`component:LayoutPanel` FR7、AR2）。

## Canonical concepts

| 概念             | 值或状态                                              | 默认语义                                        | 稳定性          |
| ---------------- | ----------------------------------------------------- | ----------------------------------------------- | --------------- |
| 通用区域         | Section                                               | 相关的页面/内容区域，带可选绘制处理             | current         |
| 五槽位拓扑       | header、start、content、end、footer                   | Layout 按逻辑阅读方向放置所提供的区域           | current         |
| 上下文操作       | start、可选 center、end                               | Toolbar 在有界内容区域内组合控件                | current         |
| 外侧与内侧内边距 | Layout 边缘或相邻区域边缘                             | Layout 区域使用适合其接触边缘的内边距           | current         |
| 边界             | 无或分隔线                                            | 成员只能绘制其组件契约暴露的边缘                | current         |
| 区域滚动         | 在暴露处为裁剪、可滚动或页面拥有                      | LayoutContent 和 LayoutPanel 拥有其当前溢出选择 | 组件拥有        |
| 地标             | 无显式角色，或调用方提供的角色和标签                  | 区域不从视觉位置推断页面级地标语义              | current         |
| 区域尺寸         | 在暴露处为固有、固定、填充/自动、上限或由调整尺寸驱动 | 每个成员拥有其适用的尺寸轴                      | 组件拥有        |
| 响应式适配       | 保留、省略或由调用方组合替换                          | 不存在共享的自动区域交换                        | 调用方/组件拥有 |

## Cross-component invariants

- **FR1 — 区域拥有结构，而不是产品含义。** 成员建立空间边界并渲染调用方内容，而不采纳内容的产品语义、状态或组件契约。Toolbar 跨其按钮的按压跟踪（`family:action-groups` FR5）是唯一的例外。
- **FR2 — 区域方向是逻辑性的。** Start 和 end 跟随书写方向。分隔线位置和面板相邻关系使用相同的逻辑区域位置。
- **FR3 — Layout 根据槽位存在性选择几何。** Header、Content、Footer 和 Panel 在接触 Layout 边界处应用外侧内边距，在与其他区域相接处应用内侧内边距。LayoutContent 保持其根元素作为滚动、内边距和直接子项所有者。省略的槽位不会留下区域包装器。每个区域将它应用的几何重新发布给全出血后代（`architecture:container-padding` INV2）。
- **FR4 — 显式区域内边距替代自动应用的内边距。** Section 发布其组件内边距；Layout 将外侧内边距和内侧内边距分配到其具名槽位；区域的显式内边距或零内边距路径选择其局部样式。自动 Layout 边缘会重新发布其应用的内边距，LayoutContent 的内容宽度间隙除外（`component:LayoutContent` FR2）。
- **FR5 — 当组合允许两个所有者时，边界所有权由调用方选择。** LayoutHeader 和 LayoutFooter 各自拥有其隐含边缘。Section 和 Toolbar 暴露选定边缘。LayoutPanel 可以绘制其面向内容的边缘，ResizeHandle 也可以绘制它；当前代码并不阻止两者同时绘制。可调整尺寸的面板组合必须在相邻 ResizeHandle 拥有分隔线时设置 `LayoutPanel hasDivider={false}`。
- **FR6 — 分隔线缺失可能改变间距。** Layout 区域目前会收缩与缺失的页眉、页脚或面板分隔线相关的内部间距；显式分隔线保留围栏边界。
- **FR7 — 滚动是显式且局部的。** LayoutContent 和 LayoutPanel 拥有其当前的 `isScrollable` 行为。Section 和 Toolbar 不会通过族成员身份变成滚动容器。Layout `height="fill"` 包含区域滚动；`height="auto"` 让包含页面增长。
- **FR8 — 地标语义保持显式。** 具名的视觉位置不会自动分配 `banner`、`main`、`navigation`、`complementary` 或 `contentinfo`。调用方为上下文提供受支持的角色和标签。
- **FR9 — 响应式替换不是自动的。** Section 和 Toolbar 保持其当前呈现。Layout 渲染调用方提供的区域。AppShell、产品组合或其他组件特定所有者决定在较窄宽度下何时省略或替换区域。AppShell 在跨越移动断点时保持主内容挂载（状态保留）。
- **FR10 — 调整尺寸所有权保持委托。** 带 `resizable` 的 LayoutPanel 使用 hook 提供的当前尺寸，而不是其 `width` prop。区域族不重新定义吸附、持久化、折叠、键盘或指针行为。
- **FR11 — 主题化保持组件拥有。** 结构成员身份不会创建族目标。当前 `.doc.mjs` 元数据记录已发布的目标和能力，运行时 `themeProps()` 发出它们，`architecture:component-theming-surface` 拥有跨组件规则。组件规范可以在存在时添加可选的解剖映射元数据。
- **FR12 — 内容宽度将滚动条保持在开放内容边缘。** 当 `contentWidth` 在没有面板的情况下设置时，LayoutContent 跨越可用的中间区域，并通过上下文感知的行内内边距对齐其直接子项。只有一个面板时，该面板保持与居中框架对齐，而 LayoutContent 延伸到对侧开放边缘。镜像的 start/end 情形使用相同规则。两侧都有面板时，完整的中间组合保持受约束。百分比和固有宽度值，以及裸变量，保持受约束的组合，因为它们无法安全共享同一对齐基准；`calc(var(...))` 是显式的长度值变量路径。

## Allowed component variation

- **AV1 — 区域强度。** Section 是通用区域；Layout 成员是五槽位原语中的位置感知槽位；Toolbar 是语义操作栏。
- **AV2 — 表面处理。** Section 和 Toolbar 可以使用 Section 变体和选定边缘。Layout 区域使用其现有的分隔线和内边距处理。族成员身份不统一它们的视觉 API。
- **AV3 — 区域内容。** 页眉、页脚、面板、内容和工具栏泳道可以容纳其组件契约允许的任何内容。
- **AV4 — 尺寸模型。** Layout 拥有填充/自动容器高度和内容宽度传播；各个区域拥有适用的高度、宽度、内边距和滚动 props；Section 拥有其盒尺寸 props。
- **AV5 — 交互。** Toolbar 拥有游走焦点、键盘提示，以及 `family:action-groups` FR5 赋予它跨其按钮的按压跟踪。其他成员不添加工具栏行为。Resizable 拥有调整尺寸交互。
- **AV6 — 组合机制。** 成员可以使用 Stack 工具、直接 CSS 布局、context 或组件组合。可观察的区域契约是所拥有的表面。
- **AV7 — 响应式策略。** 调用方可以省略、替换或在外部适配区域。族不设置断点。

## Representative matrix

| 成员和状态                                | 共享不变量                                        | 刻意差异                                                                                         |
| ----------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Section / 默认、透明或柔和                | 拥有一个通用区域并发布其应用的内边距              | 变体和选定分隔边缘是 Section 局部的                                                              |
| Layout / 仅内容                           | 槽位存在性选择 Layout 边缘内边距                  | 使用 `contentWidth` 时，LayoutContent 跨越中间区域，在内部对齐子项，并将滚动条保持在 Layout 边缘 |
| Layout / 所有区域                         | Start/end 保持逻辑性；具名区域接收外侧/内侧内边距 | 只有一个面板时，内容延伸到对侧开放边缘；两侧都有面板时，完整组合保持受约束                       |
| LayoutHeader 或 LayoutFooter / 继承分隔线 | 一个边界所有者和显式地标语义                      | 父级 `defaultHasDividers` 提供默认值；局部 false 可以覆盖它                                      |
| LayoutContent / 可滚动或页面拥有          | 区域拥有当前溢出选择                              | `isScrollable={false}` 支持父级/页面滚动和粘性后代                                               |
| LayoutPanel / 固定或由调整尺寸驱动        | 面板位置选择边缘处理                              | useResizable 可以替代宽度所有权；ResizeHandle 保留交互所有权                                     |
| Toolbar / 两条或三条泳道                  | 上下文操作区域将表面委托给 Section                | 中间内容切换内部排列；仅 Toolbar 拥有键盘行为                                                    |

## Adoption and exceptions

| 组件或关注点        | 采用                                               | 当前缺口或例外                                                                                                                                                                                                            |
| ------------------- | -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Section             | 通用区域和容器内边距发布者                         | 其嵌套逃逸始终是行内的，但在块轴上只作用于第一个/最后一个子项                                                                                                                                                             |
| Layout 容器         | 带槽位上下文的五槽位区域所有者                     | 仅内容的 LayoutContent 保持全宽，并通过内边距对齐直接子项。只有一个面板时，面板保持对齐而内容延伸到对侧开放边缘。两侧都有面板或使用固有内容宽度时，中间组合保持受约束。测试覆盖拓扑；浏览器证据覆盖镜像对齐和滚动条放置。 |
| LayoutContent       | 读取槽位存在性并应用外侧/内侧内边距                | 每条边缘发布其应用的内边距；逐边缘内边距及其发布只有审计浏览器凭证，没有始终运行的检查                                                                                                                                    |
| LayoutPanel         | 应用位置感知的内边距，并可接受由调整尺寸驱动的宽度 | 自动 Layout 边缘内边距留下基线内部几何变量；相邻的 `ResizeHandle hasDivider` 可能使线条加倍，除非调用方设置面板 `hasDivider={false}`                                                                                      |
| LayoutHeader/Footer | 区域特定的内边距、边界和地标                       | 跨区域计算样式一致性没有被单一浏览器矩阵覆盖                                                                                                                                                                              |
| Toolbar             | 由 Section 支持的表面加工具栏行为                  | 行内内边距和边缘补偿跟随组合 Section 的当前内边距上下文                                                                                                                                                                   |
| 响应式区域          | 调用方/AppShell 组合                               | LayoutPanel 当前没有共享的响应式可见性契约                                                                                                                                                                                |

这些行描述已发布的行为和验证缺口。它们不是可在文档拉取请求中悄然更改的已批准例外。

## Change coupling

- 新增或更改结构性区域组件时检查成员身份，并且仅在共享边界变化时更新本契约。
- 更改 Layout 槽位存在性、区域上下文、内边距分配、分隔线继承、高度模式或内容宽度传播会更新相应区域测试和浏览器证据。
- 更改 Section 内边距、嵌套逃逸、变体或分隔线行为会更新其组件契约，并在继承几何变化时评审 `architecture:container-padding`。
- 更改 Toolbar 泳道、语义、键盘行为或尺寸级联仍属于 Toolbar 工作；更改其由 Section 支持的表面或内边距关系还会评审本族和容器内边距架构。
- 更改 LayoutPanel 调整尺寸集成会评审 Resizable 的组件契约，而不将调整尺寸机制复制进本族。
- 添加响应式隐藏/交换行为需要组件或更高层所有者以及兼容性证据；族成员身份不授权新的断点 prop。

## Verification map

| 契约            | 验证                                                                                                       | 证据证明什么                                                                                                                   | 缺失证据                                                                                             |
| --------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| FR1             | Section/Layout/Toolbar 渲染和槽位测试                                                                      | 调用方内容渲染在当前区域结构内；Toolbar 暴露其当前泳道                                                                         | 测试不能独立证明产品语义仍由调用方拥有                                                               |
| FR2             | 逻辑属性源码评审加 Layout 区域上下文测试                                                                   | Start/end 槽位按逻辑标识，源码选择逻辑分隔线/内边距属性                                                                        | 没有真实浏览器 LTR/RTL 几何矩阵覆盖每个区域                                                          |
| FR3             | `Layout.test.tsx` 和 `childrenAsContent.test.tsx`；`nestedPadding.test.tsx` 和用于已发布几何的区域审计规范 | 槽位存在性/上下文和内容优先级被固定；省略的槽位不渲染区域提供者                                                                | 这些测试不断言计算后的外侧/内侧内边距；`nestedPadding.test.tsx` 和区域审计规范检查每个区域的已发布值 |
| FR4             | Section 内边距类集合测试和 Layout 区域源码                                                                 | Section 的显式边缘覆盖会移动匹配变量；区域源码具有自动、显式和零内边距分支                                                     | Layout 测试主要断言接受/渲染，而不是计算内边距或自动变量一致性                                       |
| FR5、FR6        | `Layout.test.tsx` 和 `LayoutSlots.test.tsx`                                                                | 页眉/页脚分隔线默认值和显式 false 覆盖反映在 `data-divider` 中；源码包含折叠样式                                               | 没有渲染测试阻止 LayoutPanel 和相邻 ResizeHandle 同时绘制分隔线，或证明计算后的折叠间距              |
| FR7             | LayoutContent/LayoutPanel 源码和局部类/渲染测试                                                            | 两个区域暴露其当前 `isScrollable` 分支；Layout 暴露填充/自动状态                                                               | 没有浏览器测试证明跨每个外壳/区域组合的滚动所有权                                                    |
| FR8             | `LayoutSlots.test.tsx` 地标断言                                                                            | 提供的角色和标签到达 Header、Content、Footer 和 Panel 元素                                                                     | 没有全族无障碍树测试覆盖重复地标                                                                     |
| Layout 内容宽度 | `contentWidth.test.tsx` 和 Storybook 滚动条放置状态                                                        | 页眉/页脚保留对齐包装器；无面板 LayoutContent 拥有全宽滚动区域；任一单面板状态通过相反开放边缘镜像内容；两侧面板保持组合受约束 | 真实浏览器证据验证四种面板状态下的计算内容对齐和滚动条放置                                           |
| Toolbar 差异    | `Toolbar.test.tsx`                                                                                         | 泳道、角色/名称/方向、Section 变体委托和当前键盘行为有聚焦断言                                                                 | 没有计算内边距/边缘补偿测试覆盖非默认父级内边距                                                      |
| FR10            | `LayoutSlots.test.tsx` 中的 LayoutPanel 覆盖                                                               | Hook 提供的 `_size` 覆盖固定宽度 prop                                                                                          | 调整尺寸交互、持久化、吸附和折叠仅由 Resizable 自身测试验证                                          |

当前测试证明选定的结构、属性、回调和类/样式分支。它们不能证明跨每个 Section、Layout、Toolbar 和 ResizeHandle 组合的计算视觉对齐；采用表明确指出了这些限制。

## Decision links

### DEC-1 — Structural regions and composition primitives have separate owners

**决定者：** `cixzhang`，`2026-08-30`

Section、Layout 及其具名区域和 Toolbar 构成 layout-regions 族。Stack、Grid、Center 及其修饰符拥有单独的 layout-primitives 所有者。这使共享区域规则专注于结构边界，而不会把每个 flex/grid 容器都变成页面区域。

### DEC-2 — AppShell owns the page shell

**决定者：** `cixzhang`，`2026-08-31`

AppShell 拥有页面外壳和应用导航组合。Layout 是通用的五槽位原语，用于在页面或有界容器内排列 `header`、`start`、`content`、`end` 和 `footer` 区域。更广泛的容器内边距参与者保留各自的组件所有权。

### DEC-3 — Content-only width alignment stays inside the content scrollport

**决定者：** `cixzhang`，`2026-09-09`

当 `contentWidth` 在没有面板的情况下设置时，LayoutContent 跨越可用的中间区域，并通过上下文感知的行内内边距对齐其直接子项。只有一个面板时，该面板保持与居中框架对齐，而 LayoutContent 延伸到对侧开放边缘。逻辑 start 和 end 镜像。两侧都有面板时，或宽度基于百分比、固有，或是无法安全共享一个 CSS 算术基准的未解析裸变量时，完整的中间组合保持受约束。有保证的长度值变量使用 `calc(var(...))` 选择边缘滚动。

## Open questions

无。采用表包含可检查的源码和浏览器工作，而不是未解决的族策略。

## Content boundary

本记录只拥有共享的结构区域行为。它不重复组件 prop 表，不定义任意子项组合，不拥有产品或导航语义，不规定视觉设计，不分配响应式断点，不重新定义调整尺寸交互，也不拥有组件主题化解剖和目标。
