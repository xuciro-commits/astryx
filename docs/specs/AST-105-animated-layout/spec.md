---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-105
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:react-component-runtime]
affects_families: []
affects_contributing: []
affects_consumer_docs:
  [useAnimatedLayout, TreeList, Collapsible, useTableRowExpansion, LayoutPanel]
---

# Animated layout system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/**"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

当区域内某个元素改变尺寸时，发生变化的元素与其后面的内容以同一个共享动效一起动画，而不是跳变；动效使用主题的曲线令牌，并由主题的 `character` 与 `tempo` 定时。应用为每个区域按需启用一次；未启用时一切保持不变，除非某个组件的记录让该组件对自身的变化做动画（FR2）。

## Non-goals

- 区域之外的内容，以及其他文档或 iframe 中的内容。
- 滑行是如何产生的，这由 `architecture:react-component-runtime` INV12 负责。

## Public contract

```tsx
const scrollRef = useRef(null);
const animatedLayout = useAnimatedLayout({containerRef: scrollRef});
<ScrollableArea ref={scrollRef} label="Project">
  <TreeList items={items} animatedLayout={animatedLayout} />
  <p>Notes</p>
</ScrollableArea>;
```

## Requirements

- **FR1 — 一个 hook，一个句柄，一个 prop。** `useAnimatedLayout({containerRef})` 返回一个不透明的 `animatedLayout` 句柄，它没有任何公共方法或字段。该句柄的类型带有一个可选的幻影品牌成员，其类型为 `never`，因此包内句柄与 swizzle 之后的副本句柄能够匹配（`spec:AST-110` FR3）；它在运行时从不出现，也没有任何可读或可写的内容。应用把它传给尺寸会变化的组件：组件通过自身的 `animatedLayout` prop 接收，当组件是 hook 时则通过 hook 的 `animatedLayout` 选项接收，随后组件会报告每一次变化。`containerRef` 指定区域；ScrollableArea 不会自行注册，应用传入它已经提供给 ScrollableArea 的那个 ref，该 ref 会到达原生滚动视口。每个采用方的组件记录都会说明其 `animatedLayout` prop 或选项。
- **FR2 — 没有句柄时，一切保持不变。** 没有句柄的组件保持其行为：发生变化的元素按它自己的记录所述展示该变化，其后面的内容立刻就位。在侧边导航折叠或展开期间，AppShell 的内容区与 SideNav 侧栏对自身的变化做动画，LayoutPanel 渲染的可调整大小的面板对自身的折叠与打开做动画，正如它们的记录所述（`component:AppShell` FR17、`component:SideNav` FR6、`component:Resizable` FR8、`component:LayoutPanel` FR7）。在粗略指针下，没有来自应用的句柄的 TreeList 会在树内对自身的展开与折叠做动画（`component:TreeList` FR8）。
- **FR3 — 变化之后的内容在区域内滑行。** 对于持有句柄的组件所报告的任何变化——例如展开控件打开、内容加载进来、消息出现，或某个条目被插入或移除——它在区域内挤开的内容会从旧位置移动到新位置，而不是跳变：其后面的同级元素，其布局会移动的前面的同级元素（居中行、末端对齐行或 space-between 行，或 `order`），以及其布局会移动的自身祖先（居中的列），在直到该区域为止的每一层祖先上都如此，且绝不越过区域。只有当元素的布局矩形发生了变化、并且它位于区域的可见部分时，元素才会移动。哪些元素会移动列在 Coverage 之下。被挤开的内容可以混合 Astryx 组件与普通应用元素，而且它们都不需要按需启用。一个区域内的多次变化，无论是否嵌套，都会复合：每个元素只移动一次，按它的总变化移动。区域绝不会因滑行而滚动。
- **FR4 — 在主题曲线令牌上的同一个共享动效。** 发生变化的元素播放它自己的动画——进入、退出或改变尺寸——其后面的内容随之移动。两者播放同一个动效，因此时序由中心统一管理，绝不是每个组件各自决定：主题的移动曲线 `--ease-move` 作用于 `--duration-medium`，它们都遵循主题的 `character` 与 `tempo`（`spec:AST-108` FR1、FR2）。滑行使用曲线令牌，绝不使用弹簧，也没有任何 character 或选项为它播放平台实测曲线（`spec:AST-094` FR45）。手势的释放会依据其释放速度落在 `spec:AST-094` 的弹簧上；曲线令牌管辖没有手势释放的滑行。两者在同一帧开始，并且 Reduce Motion 同时作用于两者，正如 `design:reduced-motion` DR1–DR3 所要求：在粗略主指针下为交叉淡入淡出，其他情况为立即变化。
- **FR5 — 每一种指针。** 滑行在每一种指针下都适用，包括鼠标：它消除了使用精细指针的人同样会看到的布局跳变，因此在 `spec:AST-017` FR59 下算作一项明确的精细指针改动，采用方的 pull request 会展示改动前后的精细指针证据。
- **FR6 — 准入。** 两个在其他方面完全相同的页面，区别在于尺寸变化之后的内容是滑行还是跳变，以及由哪个容器来界定它，而这些只有调用方知道（`spec:AST-002` FR1、FR5）。句柄是配置，不是渲染出来的插槽；没有其他 API 承担这一职责；它也不是视觉上的布尔值。
- **FR7 — 文档。** 该 hook 的文档写道：“返回一个句柄，传给尺寸会变化的组件，例如 TreeList 或 Collapsible。当该组件改变尺寸时，它与 `containerRef` 内其后面的内容以同一个共享动效一起动画，该动效遵循主题的动效令牌与节奏。固定元素与处于吸附状态的 sticky 元素保持不动，滑行绝不会滚动区域，并且会遵守 Reduce Motion。”
- **FR8 — 两个元素可以原地互换。** 区域可以把同一位置上的一个元素换成另一个，例如用骨架屏换掉它的内容：两者重叠，因此区域永远不会为空；一段短暂的显示延迟可以避免快速加载时第一个元素闪现；方向则承载向前或向后的页面切换。该互换与 FR4 的同一个动效共享。在减弱动效下，它遵循 `design:reduced-motion` DR1–DR3：在粗略主指针下为仅改变透明度的交叉淡入淡出，其他情况为立即变化。层的退场仍由层运行时的退场副本负责（`architecture:layer-runtime` INV14）。互换还可以在新内容进入时，把区域的旧内容保留为一个瞬态副本——惰性且对辅助技术隐藏——并在互换结束时移除它（`architecture:component-style-authoring` INV7）；AppShell 的内容区在侧边导航折叠或展开期间这样做（`component:AppShell` FR17），SideNav 侧栏在折叠或展开期间保留其旧状态（`component:SideNav` FR6）。互换是内部的；该 hook 的公共契约不变。

- **FR9 — 一个共享的边缘揭示。** 区域可以从它的某一条边揭示或隐藏元素：默认是块结束边缘，也可以是块起始边缘、行内起始边缘或行内结束边缘，例如在内容旁边折叠的面板。揭示会在变化前后测量元素的盒子，正如 FR3 测量任何变化；元素移动的边缘与该边缘一侧的内容按 FR4 的同一个动效移动，无论该内容在元素之后还是在元素之前（末端面板的 LayoutContent 在面板之前），因此边缘旁的内容会随它滑行，不会出现空隙。在块边缘形式下，元素自身的子元素在该动效上滑动，并在其各部分进入一侧的内容盒处保持静止裁剪，因此它们从移动的边缘进入和离开；自身带有文本的元素、带有翻译无法移动的子元素的元素，或带有它自己绘制的盒子或生成盒子的元素，则保留随边缘移动的裁剪。可选的两态形式会像 FR8 的互换那样保留元素的旧状态，同时元素随其移动边缘旁的内容一起滑行；从已显示状态开始的反向操作会从它当前所在的位置开始。在 Reduce Motion 下，它遵循 `design:reduced-motion`：在粗略主指针下为 DR2，其他情况为 DR3。Core 中的每一次边缘揭示都是这一种：
  - Collapsible、TreeList 与 Table 的行展开保留其块结束形式（`component:Collapsible`、`component:TreeList`、`component:Table` FR15）。
  - SideNav 侧栏以两态形式通过其行内边缘隐藏与揭示，并且只保留其标签与图标自身的淡入淡出（`component:SideNav` FR6）。
  - LayoutPanel 渲染的可调整大小的面板，每次折叠或打开时通过面向其 ResizeHandle 的边缘隐藏与揭示，它旁边的 LayoutContent 按同一个动效移动（`component:Resizable` FR8、`component:LayoutPanel` FR7）。只有抬起（lift）会关闭该面板，它的隐藏会依据抬起的释放速度落定（FR4）；重新打开已折叠面板的拖动不播放任何动效，因为指针直接驱动边缘。调用方仅按 `useResizable` 的尺寸自行渲染的面板不显示揭示，因为 Core 从不持有该元素；给出配置对象形式的 LayoutPanel 同样如此，那是一个手工构建、并非由 `useResizable` 返回的 `ResizableProps` 对象；而该 hook 自己经 `resizable` 透传的 `props` 则会滑动。

  当 LayoutPanel 渲染的可调整大小的面板折叠且焦点在其内部时，焦点移到它的 ResizeHandle，也就是再次打开它的控件；在任何尺寸调整控制器下，已折叠的面板都是惰性的，并对辅助技术隐藏，直到它打开为止（`component:LayoutPanel` AR2）；打开不会移动焦点。这条焦点规则只涵盖正在折叠的面板：SideNav 侧栏遵循它自己的记录，Collapsible、TreeList 与 Table 的行展开保持其记录中的行为。边缘揭示是内部的：`useAnimatedLayout` 的公共契约不变，也不新增任何 prop 或选项。

## Coverage

区域内会移动的内容，每种情况都配有它的测试：

| 情况                                                                   | 行为                                                                                                                                                                                                                                                                                                 | 测试                                                                                                                                                                                                                                                                                                        |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 发生变化元素之后的常规流块级同级元素，向上到区域的每一层祖先           | 当其矩形发生变化时移动                                                                                                                                                                                                                                                                               | 在三个层级上带有块级同级元素的嵌套变化元素                                                                                                                                                                                                                                                                  |
| 带 `display: contents` 的元素                                          | 没有盒子；它的子元素在其位置被接管                                                                                                                                                                                                                                                                   | 一个后面带有两个子元素的 `display: contents` 包装器                                                                                                                                                                                                                                                         |
| 绝对定位或固定定位的元素                                               | 跳过并直接占据最终位置；移动元素的绝对定位子元素随它一起移动                                                                                                                                                                                                                                         | 各一个，另加移动行上的一个绝对定位徽标                                                                                                                                                                                                                                                                      |
| 位于该变化的绝对定位、固定、处于吸附状态的 sticky 或顶层祖先之内的内容 | 只有变化之后的内容会移动；该祖先、其内部的祖先以及变化之前的同级元素都直接占据最终位置                                                                                                                                                                                                               | 底部停靠面板中变化周围卡片上方的标题，以及变化周围底部吸附的 sticky 页脚                                                                                                                                                                                                                                    |
| Sticky 元素                                                            | 未吸附时处于常规流中，因此当其矩形发生变化时移动；处于吸附状态的元素直接占据最终位置                                                                                                                                                                                                                 | 一个在其吸附点之上和之下的 sticky 标题                                                                                                                                                                                                                                                                      |
| 浮动元素                                                               | 当其矩形发生变化时移动                                                                                                                                                                                                                                                                               | 变化元素之后的一个浮动元素                                                                                                                                                                                                                                                                                  |
| 变化元素之后的 flex 与 grid 项，包括换行与行方向                       | 当其矩形发生变化时移动                                                                                                                                                                                                                                                                               | 一个换行的 flex 行，以及一个不会移位的行方向邻居                                                                                                                                                                                                                                                            |
| 变化元素之前的同级元素，以及它的祖先，在每一层上                       | 当其矩形发生变化时移动：居中的行、末端对齐的行或 space-between 行、居中的列，或可见部分附近同级元素之间的 `order` 会让它们移动                                                                                                                                                                       | 一个居中行、一个 space-between 行、一个末端对齐行、一个居中列，以及一个由 `order` 安置的同级元素                                                                                                                                                                                                            |
| 隐藏的、`display: none` 的或零尺寸的元素                               | 跳过                                                                                                                                                                                                                                                                                                 | 变化元素之后的各一个                                                                                                                                                                                                                                                                                        |
| 位于区域可见部分之外的变化元素                                         | 不做动画，直接占据最终位置                                                                                                                                                                                                                                                                           | 一个在折叠线上方和下方都有变化行的长列表                                                                                                                                                                                                                                                                    |
| 位于被缩放或变换的祖先之下的元素                                       | 按其布局变化移动，并针对祖先的缩放做校正                                                                                                                                                                                                                                                             | 被缩放面板内的一行移动行                                                                                                                                                                                                                                                                                    |
| 传送门与顶层内容                                                       | 从不移动                                                                                                                                                                                                                                                                                             | 从后面一行打开的弹出层                                                                                                                                                                                                                                                                                      |
| 已经在移动的元素                                                       | 保持它正在运行的动效，并把新的移动叠加进去                                                                                                                                                                                                                                                           | 间隔 100 ms 的两次变化                                                                                                                                                                                                                                                                                      |
| 嵌套区域                                                               | 动效在变化组件所持句柄的区域处停止；内部区域在外部区域内作为一个整体移动                                                                                                                                                                                                                             | 区域之中的区域，在内部区域发生的变化                                                                                                                                                                                                                                                                        |
| 打开或关闭明细行之后的表格行                                           | 各行滑行；关闭的明细行立即隐藏，并在其后的行向上滑行期间保留它的空间。绘制列线的表格（`component:Table` FR15）不滑行：它与它后面的内容立刻占据最终位置                                                                                                                                               | 在带固定列的表格中、以及带列线的表格中打开和关闭明细行                                                                                                                                                                                                                                                      |
| 任一轴上的边缘揭示或隐藏                                               | 从其块结束边缘（默认）、块起始边缘或行内边缘揭示或隐藏的内容；可选的两态形式让互换保留旧状态，元素则随其移动边缘旁的内容一起滑行；移动边缘一侧的内容会移动，无论在元素之前还是之后；可调整大小的 LayoutPanel 面板在折叠与打开时如此；正在折叠的 LayoutPanel 面板内的焦点移到它的 ResizeHandle（FR9） | 针对以下各项的动画布局浏览器测试：块结束边缘的揭示与隐藏；块起始边缘的揭示与隐藏（一个在其后内容上方打开的面板）；行内起始与行内结束的揭示与隐藏（一个末端面板，其 LayoutContent 在它之前）；两态形式；LayoutPanel 面板通过开关、Enter 以及越过阈值的拖动进行折叠与打开；以及焦点离开被隐藏的面板（待完成） |

不在覆盖范围内，每一项都立刻占据最终位置：

- 区域之外的内容，以及其他文档或 iframe 中的内容；
- 行内文本与其他不可替换的行内内容，它们无法接受变换；
- 浮动元素旁段落内重新排布的文本；
- 应用用自己的变换移动的元素；
- 关闭时其空间不会被末端外边距释放的元素（隐藏时其轨道或间距会变化的 grid 项，或决定所在行高度的 flex 行项）：它立即隐藏，没有退场动画，其后面的内容立刻占据最终位置，表格明细行除外（Coverage）；
- 与移动元素绑定的锚定弹出层，层的锚定会把它保持在原位（`architecture:layer-runtime`）；
- 由 `order` 或 grid 放置（`grid-row`、`grid-column`、命名区域或密集排布）从区域可见部分之外再加一个视口（若变化更大，则为变化的大小）之处带入视野的条目，它位于文档顺序中遍历不会到达的位置。

## Current-state impact

- 目前还没有 Core 组件接受 `animatedLayout`；TreeList、Collapsible 以及 Table 的行展开（`component:Table` FR15）是首批采用方，它们的文档将获得 `animatedLayout` 句柄。
- Core 新增 `useAnimatedLayout` 导出及其文档（FR7）。
- `architecture:react-component-runtime` INV12 负责产生滑行。
- `architecture:react-component-runtime` INV12 也新增原地互换（FR8）；目前还没有组件执行互换。
- INV12 也负责产生边缘揭示（FR9）。SideNav 侧栏的裁剪与随动从 SideNav 自己的代码移入其中，而可调整大小的 LayoutPanel 目前会跳变的折叠与打开也采用它；LayoutPanel 的文档说明折叠会滑动。
- 每一次移动可被命中测试的元素的 `translate` 的运行中滑行，都会像动画器的移动那样把它报告给 `motion/presentation.ts`。惰性副本或正在关闭的元素不会被报告。因此在 iOS WebKit 上，由手势宿主处理的触摸会落到手指之下实际绘制的内容上（`spec:AST-094` FR11、FR19）。实现差距：在 iOS WebKit 上，任何手势都不处理的普通点击，若落在滑行中的元素上，仍会落到滑行之前该位置的内容上，直到滑行结束（滑行最多持续主题的移动时长）。
- 变化的每一次动效还会让引擎再多解析一次它的元素，位置是在该动效接近结束时被绘制的第一帧：落在半个像素或半个百分比之内，或透明度的 0.005，或指示器转角量的 0.005。WebKit 可能用最后一次解析得到的值来绘制合成器动画的最后一帧，以及长任务越过其结束时的每一帧；那一帧显示动效的终点。它涵盖滑行、退场及其各个部分、揭示的各个部分，以及指示器的过渡。Reduce Motion 的淡入淡出不获得这一处理：WebKit 在其结束时绘制它的终值。实现差距：在该帧之前开始的长任务仍会显示最后一次解析的值，而只在最后一个关键帧才接近其结束的动效（线性曲线，或在陡峭曲线上的长距离移动）不会获得这样的解析。审查条件：在每次 WebKit 发布时重新测量，并在 WebKit 能够在其最终值上绘制已结束的合成器动画后移除这些解析。

## Verification

| Contract      | Verification                                                            | Representative states                                                                                                                                                                                                 | Mutation or failure expectation                                                                                                                                                     |
| ------------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1, FR2      | 带句柄与不带句柄的单元测试和浏览器测试                                  | TreeList 上带句柄；不带句柄；一个 ScrollableArea ref                                                                                                                                                                  | 句柄带有公共成员、无句柄时行为发生变化，或 ScrollableArea 自行注册，都会失败                                                                                                        |
| FR3, Coverage | 真实浏览器测试，每条 Coverage 行一个                                    | 每条 Coverage 行；混合 Astryx 与普通内容；同一帧内的两次变化；列表中途被滚动的区域                                                                                                                                    | 元素行为与其所在行所述不一致、元素在同一帧内被移动两次、区域之外的内容发生移动，或区域滚动，都会失败                                                                                |
| FR4           | 在粗略指针与精细指针下、带与不带 Reduce Motion 的真实浏览器帧捕获       | 在每个 `character` 下、以及在 `tempo` 0.75 和 1.5 下的变化元素及其可见跟随内容；一次关闭 LayoutPanel 的抬起，依据其释放速度                                                                                           | 从不同帧开始或读取不同动效、组件自己的时序、忽略主题 `character` 或 `tempo` 的滑行、没有手势释放的滑行却使用弹簧或实测曲线，或 Reduce Motion 只作用于两者之一，都会失败             |
| FR5           | 每个采用方 pull request 上的精细指针前后证据，取自组件的 Storybook 故事 | 每个采用方组件上的鼠标操作                                                                                                                                                                                            | 鼠标下缺少滑行，或采用方 pull request 缺少该证据，都会失败                                                                                                                          |
| FR8           | 互换的单元测试以及其采用方的真实浏览器验证                              | 快速加载、慢速加载、向前与向后的页面切换、Reduce Motion                                                                                                                                                               | 互换期间区域为空、快速加载时占位内容闪现、Reduce Motion 下发生位移、由它播放层的退场，或公共导出，都会失败                                                                          |
| FR9           | 揭示测量的单元测试以及每个采用方的真实浏览器帧捕获                      | Collapsible 打开；SideNav 侧栏折叠与展开；起始端与末端的 LayoutPanel 通过开关、Enter、增长箭头、受控变化以及越过阈值的抬起进行折叠与打开；重新打开面板的拖动；仅有 hook 的面板；正在折叠的面板内的焦点；Reduce Motion | 移动边缘旁出现空隙、一次侧栏折叠出现两个动效、重新打开面板的拖动期间出现揭示、仅有 hook 的面板上出现揭示、焦点留在被隐藏的面板内、被隐藏的面板可通过 Tab 到达，或公共导出，都会失败 |

## Decision log

### DEC-1 — One opt-in handle per area; the content after a change glides

**Reference:** `spec:AST-105/DEC-1`

**Decider:** `cixzhang`, `2026-10-25`

当上方内容改变尺寸时发生跳变的内容，在任何指针下都会让人困惑。应用为每个区域向尺寸会变化的组件传入一个句柄，因此按需启用是明确的，且无需包装器即可组合；组件只在它的记录如此说明时才对自己的变化做动画（FR2；`component:SideNav/DEC-2`）；变化之后的内容与变化元素共享同一个动效角色滑行，且只在区域内、只在它可见处。

已否决：把后续内容包装在一个元素中，以及让每个后续元素分别按需启用。

### DEC-2 — The glide plays the theme's curve tokens

**Reference:** `spec:AST-105/DEC-2`

**Decider:** `cixzhang`, `2026-11-04`

滑行与其他任何移动一样，因此它采用主题的移动曲线与时长；设置了 `character` 或 `tempo` 的主题会看到它的滑行随其余动效一起变化，在每一种指针下都是如此。展开或折叠内容的点击不带速度，因此随后的滑行播放曲线令牌，绝不播放弹簧（`spec:AST-094` FR45）。手势的释放会依据其释放速度落在 `spec:AST-094` 的弹簧上；曲线令牌管辖没有手势释放的滑行。

已否决：把实测弹簧用作滑行；平台实测的按需启用，例如单独的 character。

### DEC-3 — The glide takes the medium duration

**Reference:** `spec:AST-105/DEC-3`

**Decider:** `cixzhang`, `2026-11-06`

滑行在 `--duration-medium` 上播放，也就是主题中等时长的中间值：Neutral 主题中为 300 ms，无主题时为 410 ms，两者都按 `tempo` 缩放。Collapsible、TreeList、Table 的行展开、AppShell 的内容区以及 List 作为同一个动效共享它。

已否决：`--duration-medium-min`。

## Open questions

无。
