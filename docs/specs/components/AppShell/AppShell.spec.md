---
schema_version: 3
template_version: 7
kind: component
id: component:AppShell
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/AppShell/AppShell.test.tsx,
    packages/core/src/AppShell/AppShellSafeArea.test.tsx,
    packages/core/src/MobileNav/MobileNavCloseEdgeCases.test.tsx,
    apps/storybook/stories/AppShell.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-regions]
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:theme-application]
contributing: []
system_specs: [spec:AST-012, spec:AST-027]
---

# AppShell component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `AppShell`，带有 `topNav`、`sideNav`、`banner`、`children`、`mobileNav`（`false`、配置对象或节点）、`height`（`fill`、`auto`）、`variant`（`wash`、`surface`、`section`、`elevated`）以及 `contentPadding`；目标为 `app-shell`、`app-shell-header`、`app-shell-sidenav`。                                                                                                     |
| Behavior                | 一个页面框架：跳过链接，然后是一个标题区、一个内联侧边区和一个 `main` 区。低于移动端断点时，侧边导航离开页面，AppShell 由导航槽位组合出一个移动端抽屉，除非 `mobileNav` 将其禁用或替换。AppShell 是一个布局根：来自其祖先的布局值在其根处终止（FR18）。                                                                                                                       |
| End-user impact         | 键盘用户获得一个指向主区域的跳过链接；屏幕阅读器用户获得一个横幅地标和一个主地标；手机宽度用户通过切换按钮和抽屉到达侧边导航，同时页面内容、其输入值以及焦点在布局切换中保持不变。当侧边导航折叠或展开时，内容的新旧换行按导轨自身的节奏交换，而不是在同一帧内重新换行（FR17）。                                                                                              |
| Builder impact          | 无。调用方填充槽位，并选择高度、变体、内容内边距和移动端行为。                                                                                                                                                                                                                                                                                                                |
| Compatibility/readiness | 记录已交付的行为，并为设置了 `viewport-fit=cover` 的页面增加 FR3 与 FR4 安全区域；没有 prop、默认值或导出变更。六个当前状态缺口列在“当前状态影响”下：页面级堆叠值、与其文档相悖的固定横幅、一个未被测量的迟到标题区、一个切换按钮无法到达的原始 `content` 抽屉、横屏下既到不了内容两侧也到不了内联 SideNav 的侧边内边距，以及在没有标题区或手机顶部栏的框架中缺少顶部内边距。 |
| Review checks           | 拒绝 AppShell 产生第二个 `main` 或横幅地标、拒绝不是首个可聚焦元素或不会把焦点移到 `main` 的跳过链接、拒绝把相等视为移动端的断点、拒绝在断点变化时重新挂载页面内容。还应拒绝在侧边导航折叠或展开期间对其宽度做动画的内容区（FR17），以及因周围的 Layout、Card、Section 或其他布局宿主而移动、裁剪或改变内边距的框架（FR18）。                                                 |
| Governing rules         | `spec:AST-012` FR8（宽度点）、`family:layout-regions` FR9、`architecture:theme-application` INV10、`spec:AST-027` FR1–FR5（本地堆叠）、`architecture:component-theming-surface`；`component:SideNav` FR6 与 `spec:AST-105` FR8（内容切换）；`architecture:container-padding` 与 `component:Layout` FR2 和 FR5（布局根，FR18）。                                               |

本表是审查用的投影；下面的正文才是权威。

## Intent

AppShell 是应用程序页面的最外层框架。它放置顶部导航、侧边导航、公告横幅以及页面的主内容；它拥有页面级的跳过链接，以及横幅地标和主地标；并且它在一个由主题解析的宽度点上，让导航在内联桌面布局与移动端抽屉之间切换。使用方用法记录在 `AppShell.doc.mjs` 中。

## Compatibility and migration

- 保留已发布的默认行为：`yes`，FR17 除外：`no`，因为每个带有内联可折叠 SideNav 的 AppShell 在折叠或展开时都会交换其内容换行，且没有 prop 可以保持更早的即时重新换行；FR18：`no`，因为位于带内边距的容器或 Layout 内部的 AppShell 会像在页面根处那样布局，而不是脱离宿主的 padding 并采用其布局值；FR3 与 FR4：在设置了 `viewport-fit=cover` 的页面上为 `no`，因为标题区按设备安全区域内边距为其条目添加内边距，而 main 将底部内边距加到其块结束端，且没有 prop 可以保持更早的放置
- 兼容性类别：记录已交付的行为，包括 FR17（一个非破坏性的动效新增）、FR18（针对置于布局宿主内部的框架的布局修正），以及 FR3 与 FR4（针对设置了 `viewport-fit=cover` 的页面的非破坏性安全区域布局新增）；没有公共 prop、默认值、目标或导出变更
- 受控/非受控行为：移动端抽屉的打开状态默认是非受控的，当定义了 `mobileNav.isOpen` 时变为受控（FR11）
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **框架堆叠值是页面级的，而不是本地的。** AppShell 根不是隔离所有者。在 `height="auto"` 下，粘性标题区以 `z-index: 1` 绘制，获得焦点的跳过链接以 `z-index: 9999` 绘制，二者都是相对无关的页面内容排序，而不是在一个隔离的框架表面内部。`spec:AST-027` FR2–FR4 要求表面自有的隔离边界内使用本地值，且不存在页面级的层带。
- **横幅在 `auto` 下保持固定。** `banner` prop 的 API 文档说它在 `auto` 下会随页面滚动离开；而已交付的标题区同时承载横幅和顶部导航，且是粘性的，因此横幅保持固定（FR6）。
- **挂载后才首次渲染的标题区不会被测量。** 在 `auto` 下，AppShell 只测量在 `auto` 生效时已存在的标题区，并在尺寸变化时重新测量；之后才首次渲染的标题区，例如原本两者皆无的页面上出现的横幅或顶部导航，永远不会被测量，因此侧边区粘在顶部边缘，其最初几行会滑到粘性标题区下面。
- **原始 `content` 抽屉让切换按钮指向空处。** `mobileNav.content` 接受原始子节点；AppShell 按原样渲染它们，而自动切换按钮仍会渲染，因此其 `aria-controls` 没有指向任何元素，按下它也不会打开任何东西。WCAG 4.1.2 要求控件的关系和状态在程序上是正确的。
- **横屏下侧边内边距既到不了内容两侧，也到不了内联 SideNav。** 在 `viewport-fit=cover` 下，只有标题区和仅侧边导航的移动端顶部栏采用侧边安全区域内边距（FR3），因此在横屏时，刘海或圆角屏幕角可能覆盖内容以及内联侧边导航的边缘。
- **没有标题区或手机顶部栏的框架不会采用顶部内边距。** 在 `viewport-fit=cover` 下，只有标题区和仅侧边导航的移动端顶部栏采用顶部安全区域内边距（FR3），因此在两者皆无的框架中，内容的第一行会位于状态栏下方。这包括仅有内容的情况，或是有侧边导航但没有顶部导航或横幅、同时手机顶部栏不渲染的情况：高于移动端断点时、`mobileNav={false}` 时，或 `mobileNav={{hasToggle: false}}` 时。

## Ownership boundary

**拥有**

- 页面框架：根元素，跳过链接、标题区、内联侧边区与主区域的顺序，以及槽位存在性规则（FR1–FR4）。
- 跳过链接及其向主区域的焦点移动（FR5、AR2）。
- 侧边导航折叠或展开期间的内容区交换（FR17）。
- 围绕标题区的横幅地标与围绕 `children` 的主地标（FR3、FR4、AR1）。
- 高度模式，包括 `auto` 下的粘性标题区和粘性侧边区（FR6）。
- 框架、标题区、侧边区与内容区的变体背景，以及抬升的内容角（FR7、FR16）。
- 移动端断点切换，以及每个导航槽位在断点两侧各自渲染的内容（FR8–FR10、FR12）。
- 移动端抽屉的打开状态，以及 AppShell 提供给其子树的移动端上下文（FR11、FR13）。
- 跨断点切换的内容连续性（FR14）。
- 在框架根处的布局根重置（FR18）。

AppShell 的 `.doc.mjs` 未记录任何内联 `components:` 条目；本记录是 AppShell 根中唯一的组件记录。

**不拥有 / 非目标**

- TopNav 在其完整、移动栏和抽屉模式下如何渲染——由 TopNav 拥有，此处不设契约。AppShell 只选择模式。
- SideNav 在其内联、顶部栏、抽屉和抽屉内容模式下如何渲染，以及导轨自身的折叠动效——由 SideNav 拥有（`component:SideNav` 涵盖其行几何与导轨动效，FR6）。AppShell 选择模式，并拥有折叠或展开期间内容区的动效（FR17）。
- 抽屉对话框本身：模态呈现、焦点限制与归还、背景关闭、滑入动效及其关闭延迟——由 MobileNav 拥有，此处不设契约；Escape 与关闭请求的排序——由 `family:overlay-dismissal` 拥有。汉堡控件是 MobileNav 的 `MobileNavToggle`。
- 布局区域、其内边距以及区域滚动——由 `family:layout-regions` 拥有；对溢出区域的键盘访问——由 `spec:AST-025` 拥有。
- 宽度断点词汇表与有效宽度映射——由 `spec:AST-012` 与 `architecture:theme-application` 拥有。
- `useAppShellMobile` hook 的公共契约——一个未设契约的模块；本记录只涵盖 AppShell 提供的值（FR13）。
- TopNav 与 SideNav 槽位内部的导航地标名称——由 TopNav（其 `label` prop）和 SideNav（其翻译后的名称）拥有；在手机抽屉中，地标属于 MobileNav，并采用抽屉的名称（`component:MobileNav` FR14）。
- 页面标题——由调用方拥有；AppShell 不渲染任何标题。

## Public concepts

| Concept        | Closed values or states                              | Meaning                                            | Availability by variant/orientation/state | Default    | Owner                | Stability | Invalid-value behavior                                              |
| -------------- | ---------------------------------------------------- | -------------------------------------------------- | ----------------------------------------- | ---------- | -------------------- | --------- | ------------------------------------------------------------------- |
| 高度模式       | `fill`、`auto`                                       | 视口高度的框架并内部滚动，或者是会增长的页面。     | 所有布局。                                | `fill`     | `component:AppShell` | 稳定      | 其他值会得到 `auto` 的最小高度且没有粘性区域；TypeScript 会拒绝它。 |
| 变体           | `wash`、`surface`、`section`、`elevated`，以及增强值 | 导航区域相对于内容的背景处理（FR7）。              | 所有布局；反映在全部三个目标上。          | `elevated` | `component:AppShell` | 稳定      | 增强值会反映到目标上，并绘制 `elevated` 框架背景。                  |
| 移动端导航模式 | 禁用（`false`）、配置对象、节点                      | 选择自动抽屉、调优的自动抽屉，或调用方自有的抽屉。 | 低于断点时，节点除外（FR12）。            | 自动       | `component:AppShell` | 稳定      | 非元素对象会被读作配置对象。                                        |
| 断点           | `sm`、`md`、`lg`、`xl`、`2xl`、`none`                | 应用移动端布局的宽度点。                           | 仅配置对象。                              | `md`       | `spec:AST-012`       | 稳定      | TypeScript 会拒绝其他名称。                                         |
| 内容内边距     | 间距步长 `0`–`10`                                    | 主区域的内边距。                                   | 所有布局。                                | `0`        | `component:AppShell` | 稳定      | TypeScript 会拒绝其他步长。                                         |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 依据                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| FR1  | 根元素带有 `app-shell`、转发的 `ref`、`data-testid` 以及其他 DOM props，并按顺序包含：跳过链接、Layout 框架（header 区域、inline side 区域、content 区域），然后是任何移动端抽屉。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试                                                            |
| FR2  | 当插槽的值可渲染时，该插槽视为存在：不是 `null`、`undefined`、布尔值或空字符串。渲染为空的组件仍然算作存在。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与公开类型                                                        |
| FR3  | 头部区域仅在 `topNav` 或 `banner` 存在时渲染；它带有 `app-shell-header` 与 `role="banner"`，把 `banner` 放在 `topNav` 之上，且从不位于另一个 landmark 内。仅侧导航的移动端顶栏（FR9）也带有 `app-shell-header`，且仅在没有头部区域渲染时才取 `role="banner"`。AppShell 至多渲染一个 banner landmark。头部区域在 block start 处为其条目填充 `env(safe-area-inset-top, 0px)`，并在其 inline 两侧填充物理的 `env(safe-area-inset-left/right, 0px)`（在从右到左时互换），而其背景仍延伸到状态栏之下并抵达屏幕两侧；在没有头部区域渲染时，仅侧导航的移动端顶栏采用相同的 insets，而在它位于下方时只取侧边 insets。在 `auto` 下，位于头部区域下方的仅侧导航移动端顶栏粘在 `env(safe-area-inset-top, 0px)` 处，而不是粘在 block start 处（FR6）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试                                                            |
| FR4  | `children` 在一个带有 `role="main"` 和 id 的区域中渲染：页面中第一个挂载的 shell 使用 `astryx-app-shell-main`，其他每个 shell 使用生成的唯一 id，因此页面不会出现重复 id；它可通过程序获得焦点，以便跳过链接能把焦点移到它上面；对它施加的程序化焦点不会绘制焦点环。它的 padding 是 `contentPadding`，默认 `0`，其 block-end padding 额外加上 `env(safe-area-inset-bottom, 0px)`，无论是在页面中还是在 main 自己的滚动容器内。该区域保持 border-box，它发布给后代的 inset 仍仅为 `contentPadding`，因此 bleed 子元素只减去 `contentPadding`，安全区在其下方依然存在。它是否成为顺序 Tab 停靠点属于滚动区域的键盘访问问题（`spec:AST-025` FR12）。当它是停靠点且焦点经 Tab 移到其上时，会绘制标准的焦点环，朝内缩进，直到焦点离开它；在 `elevated` 且两种导航都存在时，焦点环显示期间该区域采用该表面的圆角 top-start 角。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `architecture:container-padding`；当前源码与测试                          |
| FR5  | 跳过链接是 shell 中第一个可聚焦元素。它链接到自身 main 区域的 id（FR4），显示翻译后的 `@astryx.appShell.skipToContent` 文本，在被聚焦前视觉隐藏，并在激活时把焦点移到 main 区域。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | WCAG 2.4.1；当前源码与测试                                                |
| FR6  | `fill` 把根尺寸设为 `100dvh`，inline side 区域与 main 区域各自滚动。`auto` 给根一个 `100dvh` 最小值，让头部在 block start 处粘滞，让 inline side 区域粘滞在 shell 以 `auto` 挂载时存在的头部的测量高度之下，并自带滚动，同时让页面滚动。头部高度只在 `auto` 中测量。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试                                                            |
| FR7  | 变体背景：`wash` 在框架、导航区域与内容上绘制 body 背景；`surface` 在全部三者上绘制 surface；`section` 在框架上绘制 surface 并把导航区域与内容分隔开，且在 `auto` 下头部自身绘制 surface；`elevated` 在框架与导航区域上绘制 body 背景、在内容上绘制 surface（圆角见 FR16）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                                            |
| FR8  | 移动端布局遵循 `spec:AST-012` FR8 与 `architecture:theme-application` INV10 下的 `mobileNav.breakpoint`；断点默认为 `md`，当其为 `none` 时忽略 `defaultIsMobile`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `spec:AST-012` FR8；测试                                                  |
| FR9  | 在移动端布局中，侧导航离开 inline 区域。存在的 `topNav` 以 TopNav 的移动栏模式渲染，并被给定侧导航内容作为其抽屉，除非 `mobileNav` 为 `false` 或为一个节点。在有 `sideNav`、无 `topNav`、`mobileNav` 不为 `false` 且 `hasToggle` 不为 `false` 时，移动端顶栏以 SideNav 的顶栏模式在一个由 `@astryx.appShell.mobileNavigation` 命名的导航区域中渲染侧导航；其旁的自动 toggle 仅在移动导航启用时渲染（FR11），因此在有抽屉节点时顶栏没有 toggle。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试                                                            |
| FR10 | 自动抽屉仅在移动端布局中渲染，且仅在 `mobileNav` 不为 `false`、不是节点、并且没有 `content` 时渲染。没有 `topNav` 时它是抽屉模式的 SideNav；有 `topNav` 时它是抽屉模式的 TopNav 并携带侧导航内容；在仅有标题的 TopNav 下，侧导航条目恰好渲染一次。它在关闭时仍保持挂载，并且在一次关闭之后，在 MobileNav 的关闭延迟尚未过去之前不会被隐藏（在减少动态效果下立即隐藏）；一次打开在携带它的那次提交中即可见。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码与测试                                                            |
| FR11 | 抽屉默认关闭，除非 `mobileNav.isOpen` 已定义，否则 AppShell 拥有其状态。每次请求的变更都会调用 `mobileNav.onOpenChange`。打开与切换请求在移动导航未启用时不做任何事：存在导航插槽、`mobileNav` 不为 `false`、且 `mobileNav` 不是节点。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试                                                            |
| FR12 | `mobileNav={false}` 不渲染抽屉也不渲染 toggle；在移动端布局中，侧导航那时既不在 inline 中渲染，也不在抽屉中渲染。节点（元素或字符串）在每个宽度下按给定内容渲染，替换自动抽屉，并让 TopNav 保持其完整模式。配置对象的 `content` 在存在导航插槽时，在移动端布局中替换自动抽屉。`hasToggle: false` 移除自动 toggle。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试                                                            |
| FR13 | AppShell 向其子树提供：是否适用移动端布局、抽屉是否打开、一个抽屉 id（toggle 的 `aria-controls` 指向它，自动抽屉、或作为 `content` 传入的 MobileNav、或作为节点传入的 MobileNav 会将它作为自己的 `id` 应用）、打开、关闭与切换动作、移动导航是否启用、以及自动 toggle 是否启用（`hasToggle` 不为 `false`；除非 `hasToggle` 为 `false`，在每个宽度下都为 true）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试                                                            |
| FR14 | 主要内容在跨断点时保持挂载（`family:layout-regions` FR9）；此外，`children` 内的输入值与焦点在两个方向上都得以保留。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试                                                            |
| FR15 | `className`、`style` 与 `xstyle` 在组件样式之后合并到根上。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码                                                                  |
| FR16 | 在 `elevated`、存在 `topNav` 且有 inline 侧导航时，内容区是一个抬升的表面，其 block-start、inline-start 角使用页面圆角；否则内容包装器不创建布局盒。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与 stories                                                        |
| FR17 | 当侧导航折叠或展开时，内容区在原地把旧 wrap 换成新 wrap：旧 wrap 滑出并淡出，而新 wrap 滑入并淡入，两者都在侧导航的同一个时钟上，即 `spec:AST-105` FR4 的同一共享动效，使用主题的曲线 tokens，从不使用弹簧（`component:SideNav` FR6）。在侧导航首次绘制之前，不是由它自己的 toggle 做出的变更会立即落位，内容区也随之落位。因此初始状态从不动画。旧 wrap 是一份临时副本，inert 且对辅助技术隐藏，在换位结束时移除（`architecture:component-style-authoring` INV7）。当旧 wrap 未被复制时（例如页面太大而无法复制），在展开期间 rail 与内容之间不会出现可见空隙。内容区从不动画其宽度。在减少动态效果下，换位遵循 `design:reduced-motion` DR2（粗粒度主指针）与 DR3（其他情况）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `spec:AST-105` FR8；`component:SideNav` FR6                               |
| FR18 | AppShell 是一个布局根：在其根上应用 Layout 的 `layoutReset`（`component:Layout` FR8），重置其祖先传下来的每个布局值，因此它的 header、side 与 main 区域在带 padding 的卡片内、在 Layout 内或在页面根处布局相同。发布的容器 padding（`--container-padding-inline-start`、`--container-padding-inline-end`、`--container-padding-block-start`、`--container-padding-block-end`）重置为零，因此 AppShell 的 Layout 不逃逸任何东西（`component:Layout` FR2）。Layout 的 inset 与区域值（`--layout-padding-outer-x`、`--layout-padding-outer-y`、`--layout-padding-own-outer-x`、`--layout-padding-own-outer-y`、`--layout-padding-inner-x`、`--layout-padding-inner-y`、`--layout-content-width`、`--layout-alignment-width`、`--_layout-flush-block-start`、`--_layout-flush-block-end`）、Section padding 传播（`--_section-padding-propagated`）以及容器高度上限（`--container-max-height`）重置为 unset，与页面根处相同。Layout 的 area、slot 与 divider-default 上下文（`LayoutAreaContext`、`LayoutSlotsContext`、`LayoutDividerContext`）重置为各自的默认值。这些名称是内部协议，不是主题 API（`architecture:container-padding` INV1）。调用方在 AppShell 上的自身 props 与样式（`height`、`variant`、`contentPadding`、`mobileNav`、`className`、`style`、`xstyle`）在重置之后仍然生效（FR15）。主题 tokens、颜色模式、书写方向与翻译继续继承。 | DEC-1；`architecture:container-padding` INV6（在 overlay 根处同样的重置） |

### Allowed variation

- **AV1 — 插槽内容。** 调用方提供的导航、banner 与页面内容可以变化，而不会成为 AppShell 所拥有的结构。
- **AV2 — 主题样式。** 主题可按变体重新设置三个目标的样式，而不改变区域顺序、landmark 或断点规则。
- **AV3 — 抽屉时序。** 关闭保持时长跟随 MobileNav 的关闭延迟，并可能随之变化，只要该保持时长超过该延迟即可。

### Representative states

| 状态                              | 必需的不变式                                                          | 允许的变化                    |
| --------------------------------- | --------------------------------------------------------------------- | ----------------------------- |
| 仅内容                            | 跳过链接与 main 区域；没有 banner 或导航 landmark。                   | 内容 padding。                |
| TopNav 与 SideNav，桌面端         | Banner 头部、inline side 区域、main；在 `elevated` 下为抬升角。       | 变体背景。                    |
| 仅 SideNav，移动端                | 移动顶栏作为唯一的 banner、toggle、自动 SideNav 抽屉。                | 抽屉内容与宽度（MobileNav）。 |
| TopNav 与 SideNav，移动端         | 带 toggle 的 TopNav 移动栏；TopNav 抽屉一次承载 TopNav 与侧导航条目。 | TopNav 移动栏布局。           |
| Banner 与 SideNav，移动端         | 恰好一个 banner landmark。                                            | Banner 内容。                 |
| `height="auto"`                   | 粘滞头部；其下粘滞的侧区域；页面滚动。                                | 头部高度。                    |
| `mobileNav={false}`，移动端       | 无抽屉、无 toggle、无侧导航。                                         | —                             |
| 自定义抽屉节点                    | 该节点在每个宽度下渲染；没有自动抽屉。                                | 调用方拥有的抽屉。            |
| 位于带 padding 的卡片或 Layout 内 | 区域、insets 与 main padding 与页面根渲染一致（FR18）。               | 宿主尺寸。                    |

### Transformation and precedence order

- **ORD1 — 移动端模式。** 先解析 `mobileNav` 形态（FR12），然后解析断点（FR8），再是 TopNav 与 SideNav 的渲染模式（FR9）以及渲染哪个抽屉（FR10）。
- **ORD2 — 根样式。** 组件样式，然后是 `xstyle`、`className` 与 `style`（FR15）。

### Performance and resources

- **PR1 — 测量。** AppShell 仅在 `auto` 中观察头部的尺寸。在 `fill` 中它只观察 main 区域是否溢出（main 的尺寸、其直接子元素的尺寸及其内容），这决定 main 是否为顺序 Tab 停靠点（FR4）。
- **PR2 — 单个媒体查询。** 断点切换每个 shell 使用一个媒体查询订阅。

## Accessibility contract

- **AR1 — Landmarks。** AppShell 至多暴露一个 banner landmark，它从不位于另一个 landmark 内，并且恰好暴露一个 main landmark。仅侧导航的移动端顶栏是一个带翻译名称的导航区域。插槽内的导航 landmark 由 TopNav 与 SideNav 拥有；当它们的内容在手机抽屉中渲染时，它位于 MobileNav 的导航 landmark 内，命名与抽屉相同（`component:MobileNav` FR14）。
- **AR2 — 绕过块。** 跳过链接可通过第一次 Tab 到达，并在激活时把焦点移到 main 区域（WCAG 2.4.1）。其焦点指示器使用共享的焦点轮廓处理。
- **AR3 — 抽屉接线。** 使用自动抽屉，或使用作为 `content` 传入的 MobileNav 时，自动 toggle 的 `aria-controls` 指向打开的抽屉，其 `aria-expanded` 反映抽屉状态（FR13）。抽屉内的焦点限制与返回由 MobileNav 负责，此处不作契约约定。
- **AR4 — 焦点连续性。** 断点变更不会把焦点移出 main 区域的内容（FR14）。

## Design relationships

| 结构或状态   | 设计要求                                                         | 表示权威           | 层级角色 | 组件契约        |
| ------------ | ---------------------------------------------------------------- | ------------------ | -------- | --------------- |
| 页面外壳     | 框定页面并绘制变体背景。                                         | 当前源码与公开文档 | 支撑性   | FR1, FR7        |
| 跳过链接     | 聚焦前隐藏，之后是 inline-start 角处的可见链接。                 | 当前源码与公开文档 | 支撑性   | FR5, AR2        |
| Banner       | 位于头部区域内、顶部导航之上。                                   | 当前源码与公开文档 | 支撑性   | FR3             |
| 顶部导航     | 填满头部区域；在移动端布局中是紧凑栏。                           | 当前源码与公开文档 | 突出     | FR3, FR9        |
| 侧导航       | 桌面端为 inline 区域；在移动端布局中移入抽屉。                   | 当前源码与公开文档 | 突出     | FR6, FR9, FR10  |
| 主要内容     | 页面的内容；在 `elevated` 且两种导航都存在时以带圆角的形式抬升。 | 当前源码与公开文档 | 突出     | FR4, FR16       |
| 移动导航抽屉 | 由导航插槽组合而成的模态抽屉。                                   | 当前源码与公开文档 | 支撑性   | FR10, FR12, AR3 |

没有任何 AppShell 目标能触及跳过链接。它的 `none` 处置记录的是可达性，而不是关于它必须保持不可主题化的决定。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Page shell": {"target": "app-shell"},
  "Skip link": {
    "none": {
      "reason": "reachability-gap: No public target reaches the skip link."
    }
  },
  "Banner": {"inherits": "app-shell-header"},
  "Top navigation": {"target": "app-shell-header"},
  "Side navigation": {"target": "app-shell-sidenav"},
  "Main content": {
    "delegatesTo": {"owner": "component:Layout", "target": "layout-content"}
  },
  "Mobile nav drawer": {
    "delegatesTo": {"owner": "component:MobileNav", "target": "mobile-nav"}
  }
}
```

## Family and system relationships

- `spec:AST-012` FR8 拥有宽度点名称、排他上边界与 SSR 提示；AppShell 应用它们（FR8）。
- `architecture:theme-application` INV10 拥有 AppShell 如何找到最近的有效宽度映射。
- `family:layout-regions` 拥有 Layout 区域、其 padding 与区域滚动，并且（FR9）声明 AppShell 在跨断点时保持主要内容挂载。
- `spec:AST-027` 拥有局部层叠；shell 的当前值记录在 Current-state impact 下。
- `architecture:component-theming-surface` 拥有目标资格与上面的处置。

## Verification map

| 契约              | 验证                                                                                                                                                                                                                                                                                                                                                               | 代表性状态                                                                                                                                                                                                | 变异或失败预期                                                                                                                                                                                                                                                                                              | 审计小节                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1–FR4, AR1      | `AppShell.test.tsx` 的 slot、landmark、banner 与 ref 套件；`AppShellMainKeyboard.a11y.browser.spec.ts` 覆盖 main 作为 Tab 停留点及其焦点环                                                                                                                                                                                                                         | 仅 content；每个 slot；带 banner 的移动端顶栏；Tab、Shift+Tab、点击与跳过链接落到溢出的 main 上                                                                                                           | landmark 缺失或重复，或出现嵌套 banner，会导致角色查询失败。                                                                                                                                                                                                                                                | `audit:AppShell/anatomy`       |
| FR3、FR4 安全区域 | `AppShellSafeArea.test.tsx` 声明的 header 区域、仅 sideNav 的移动端顶栏与 main 的内边距；`AppShellSafeArea.a11y.chromium.spec.ts` 以模拟的设备内边距运行                                                                                                                                                                                                           | 竖屏与横屏内边距；单侧带刘海时的从右到左；仅 sideNav 的顶栏单独存在以及位于 banner 之下，静止时与在 `auto` 中滚动时；无内边距；填满 main 的子元素                                                         | 位于状态栏或侧向内边距之下的条目、跟随文本方向而非设备的侧边、不是 `contentPadding` 加底部内边距的块末内边距、把安全区域计入的已发布内边距，或无内边距时仍在移动的任何内容，均失败。                                                                                                                        | `audit:AppShell/behavior`      |
| FR5, AR2          | `AppShell.test.tsx` 的跳过链接与键盘套件                                                                                                                                                                                                                                                                                                                           | 首次 Tab；Enter；点击；已翻译的文本                                                                                                                                                                       | 丢失 href、焦点移动或 Tab 顺序，即失败。                                                                                                                                                                                                                                                                    | `audit:AppShell/accessibility` |
| FR6, PR1          | `AppShell.test.tsx` 的高度模式与 main 键盘访问套件；`observeMainOverflow.test.ts`                                                                                                                                                                                                                                                                                  | `fill`、`auto`、`auto` 中的 section header；main 在 `fill` 中适配与溢出                                                                                                                                   | 去掉 header 的 sticky 定位、在 `fill` 中测量 header，或不测量 main，均失败。                                                                                                                                                                                                                                | `audit:AppShell/behavior`      |
| FR8               | `AppShell.test.tsx` 的断点套件                                                                                                                                                                                                                                                                                                                                     | `lg`、`xl`、`2xl`、显式 `md`、`none`；最近、根与构建主题；SSR 提示                                                                                                                                        | 错误的映射、包含端点的边界，或 `none` 进入移动端，均失败。                                                                                                                                                                                                                                                  | `audit:AppShell/behavior`      |
| FR9–FR12          | `AppShell.test.tsx` 的移动端套件；`MobileNavCloseEdgeCases.test.tsx` 的 AppShell drawer 套件                                                                                                                                                                                                                                                                       | 仅 sideNav；两个导航；仅标题的 TopNav；自定义节点                                                                                                                                                         | 缺少切换按钮、条目重复、抽屉陈旧，或过早隐藏，均失败。                                                                                                                                                                                                                                                      | `audit:AppShell/behavior`      |
| FR13, AR3         | `AppShell.test.tsx` 的键盘抽屉与 `useAppShellMobile` 套件                                                                                                                                                                                                                                                                                                          | 在 shell 之外；在 shell 之内，关闭与打开                                                                                                                                                                  | id 关联错误或状态陈旧，即失败。                                                                                                                                                                                                                                                                             | `audit:AppShell/accessibility` |
| FR14, AR4         | `AppShell.test.tsx` 的断点连续性测试                                                                                                                                                                                                                                                                                                                               | 带聚焦 input 的桌面到移动端再返回                                                                                                                                                                         | 重新挂载内容会丢失值或焦点。                                                                                                                                                                                                                                                                                | `audit:AppShell/behavior`      |
| FR17              | `SideNavRailMotion.test.tsx`，应用在 side nav 首次绘制前变更时无动效；`animatedLayout.boundary.test.ts`；`SideNavRailMotion.interaction.browser.spec.ts` 在 side nav 折叠期间内容区的帧，以及长任务之后的第二次切换（已滚动的 `auto` 页面、`reducedMotion: 'always'` 主题用例，以及在折叠开始后不足一帧即启动的长任务，均待定）                                    | 带内联 side nav 的折叠与展开；粗指针与细主指针下的 Reduce Motion；`fill` 与已滚动的 `auto` 页面；`reducedMotion: 'always'` 的主题；交换运行期间的第二次切换，以及长任务之后的一次；旧 wrap 未被复制的展开 | rail 与内容之间出现可见空隙、内容区对宽度做动画或按自己的时钟移动、反向切换时淡入淡出晚于滑动才开始、旧 wrap 可被辅助技术访问或交换后残留、Reduce Motion 下仍有位移、粗指针下 Reduce Motion 时不是仅透明度且时长不超过 200 ms 的交叉淡化（DR2），或细指针下 Reduce Motion 时存在任何动画属性（DR3），均失败 | `audit:AppShell/behavior`      |
| FR18              | `AppShellLayoutRoot.interaction.browser.spec.ts`，一个真实浏览器几何测试，对照页面根渲染检查 Layout 溢出、header logo、侧区与 main 区，覆盖桌面与手机宽度，运行在 Inside Layout Hosts story 上；`AppShell.test.tsx` 的 “AppShell layout root (FR18)” 套件，覆盖重置值、重置上下文与调用方样式；`layoutReset.test.tsx` 覆盖重置的作用范围（`component:Layout` FR8） | 位于页面根的 AppShell；在带 `padding` 且 header 无分隔线的 Layout 内；在会裁剪溢出的宿主中带内边距的 Card 内；在带显式内边距的 Section 内；每项都带调用方的 `contentPadding` 与 `style`                   | 区域盒子、内边距或 main 内边距与页面根渲染不同，shell 被其宿主裁剪，`children` 内的 Layout 或 Section 采用了宿主的 inset 或分隔线默认值，或调用方 prop 在重置中失效，均失败                                                                                                                                 | `audit:AppShell/behavior`      |
| FR7, FR16         | `AppShell.stories.tsx` 与视觉基线                                                                                                                                                                                                                                                                                                                                  | 带两个导航的 `elevated`，桌面宽度                                                                                                                                                                         | `elevated` 的背景变化或缺少的角会在视觉审查中显现。                                                                                                                                                                                                                                                         | `audit:AppShell/visual`        |
| 主题 anatomy 映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                      | 使用方 anatomy 与当前目标                                                                                                                                                                                 | 缺失、多余、陈旧或重复分配的映射会使仓库校验失败。                                                                                                                                                                                                                                                          | `audit:AppShell/theming`       |

以下内容从源码读取，尚无聚焦测试或基线：

- FR1：三个目标的位置、其他 DOM props 传递到根、header、side 与 content 的顺序，以及 drawer 最后渲染。
- FR2：`null`、`true`、`false` 与 `''` 的 slot 计为缺失，而渲染不出内容的 slot 计为存在。
- FR3：`banner` 在 `topNav` 之上，且仅有 `sideNav` 时没有 header 区域。
- FR4：`contentPadding` 的值及其 `0` 默认值。
- FR5：跳过链接在获得焦点前的视觉隐藏；AR2：其共享的焦点轮廓。
- FR6：每种高度模式下的根尺寸与区域滚动，以及 `auto` 中的 sticky 侧区。
- FR7：`wash`、`surface` 与填满高度的 `section` 背景，以及 `section` 的分隔线。
- FR8：默认的 `md` 断点与 `sm`。
- FR9：`mobileNav={false}` 例外、移动端顶栏的导航名称，以及 drawer 节点条款。
- FR10：Reduce Motion 下的保持。
- FR11：受控的 `isOpen`、`mobileNav.onOpenChange` 调用，以及禁用期间的空操作请求。
- FR12：`mobileNav={false}`、字符串节点、`content` 与 `hasToggle: false` 分支，以及 drawer 节点旁的 full 模式 TopNav。
- FR13 与 AR3：打开与关闭操作、`hasAutoToggle`，以及作为 `content` 或作为节点传入的 MobileNav 上共享的 drawer id。
- FR15、FR16 的无缺角分支，以及 PR2。

## Decision log

### DEC-1 — AppShell is a layout root

**Decider:** `cixzhang`, `2026-11-01`

AppShell 会抵消其外部的一切布局效果：祖先向下传递的布局值在其根处停止，因此 shell 在文档示例卡片中、在 Layout 内，或位于页面根时都渲染出相同结果（FR18）。调用方在 AppShell 上设置的自身 props 仍然生效。

宽度取值点与堆叠由上文链接的系统记录决定。

## Open questions

- **OQ1 — 设置 `mobileNav={false}` 的页面是否应在移动端布局中保留可访问的 side nav？**（`human-design`）目前在那里 side nav 既不内联渲染，也不在抽屉中渲染（FR12）。

## Content boundary

本文件不重复使用方 prop 表格、示例、抽屉的对话框行为、Layout 区域规则，或系统宽度与堆叠规则。它链接到它们的归属文档。
