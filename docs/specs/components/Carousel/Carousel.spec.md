---
schema_version: 3
template_version: 7
kind: component
id: component:Carousel
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-22
owners: [cixzhang]
review_triggers: [behavior, accessibility, public-api]
verified_by:
  [
    packages/core/src/Carousel/Carousel.test.tsx,
    packages/core/src/Carousel/__tests__/Carousel.a11y.chromium.spec.ts,
    packages/core/src/Carousel/__tests__/CarouselFocusRing.a11y.chromium.spec.ts,
    packages/core/src/Carousel/__tests__/CarouselSnapPagingButtons.interaction.browser.spec.ts,
    packages/core/src/Carousel/__tests__/CarouselSnapPagingEdges.interaction.browser.spec.ts,
    packages/core/src/SnapPaging/SnapPaging.test.tsx,
    packages/core/src/SnapPaging/__tests__/SnapPaging.interaction.browser.spec.ts,
    scripts/snap-paging-bundle.test.mjs,
  ]
modules: []
families: [family:buttons]
design_specs: []
architecture:
  [
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs: [spec:AST-085, spec:AST-025, spec:AST-094]
---

# Carousel component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `hasSnap` 接受 `boolean \| SnapPaging`（FR5）。`hasSnap` 或 `hasSnap={true}` 会开启原生 CSS scroll snap，与已发布版本完全一致（FR6）。`hasSnap={useSnapPaging()}` 会开启 snap paging：在原生 snap 的停靠点之上，于手指或触控板滑动下呈现 UIKit 的分页手感（FR7）。`useSnapPaging` 默认没有非 React 等价物（FR9）。边缘滚动按钮在边缘处隐藏并交接焦点（FR1–FR4）。 |
| Behavior                | 原生 snap 让每个条目停在自己的起始边缘，把惯性交给平台。Snap paging 使用相同的停靠点：在手指下，以及在任意指针下的触控板滑动中，一次轻扫默认移动一个视图，使用 `{pages: 'item'}` 时移动一个条目，遵循 `spec:AST-094` FR3 的分页规则。方向已耗尽的边缘按钮会隐藏，且不占用制表位；当获得焦点的按钮耗尽时，焦点移到滚动区域。                                       |
| End-user impact         | 在手机上滑动启用分页的轮播的人能感受到 iOS 分页；使用未启用分页的轮播的人不会下载任何分页代码。滚动到第一个或最后一个条目的键盘用户仍留在轮播内。                                                                                                                                                                                                                 |
| Builder impact          | `hasSnap` 与 `hasSnap={true}` 不变。分页就是同一个 prop 传入 `useSnapPaging()`。没有分页配置的 Carousel 不会打包分页器代码。                                                                                                                                                                                                                                      |
| Compatibility/readiness | 增量式：`hasSnap` 的类型从 `boolean` 拓宽为 `boolean \| SnapPaging`，没有重命名、弃用或 codemod；`true` 保留今天的原生 snap，不获得分页。实现缺口：已发布的 Carousel 在边缘按钮上仍使用原生 `disabled`。证据缺口：`{pages: 'item'}` 尚未对照 UIKit 的分组分页进行测量（FR7）。                                                                                    |
| Review checks           | 拒绝：可从 Carousel 的默认导入抵达的分页器代码；对分页器的惰性 `import()`；`hasSnap` 不是 `useSnapPaging` 值的轮播上的 snap paging；会分页的 `hasSnap={true}`；与原生 snap 不同的 snap paging 停靠点；在测量之前声称 `{pages: 'item'}` 与 UIKit 一致；依赖仅 Chromium 支持的轮播特性；焦点留在隐藏的边缘按钮上。                                                  |
| Governing rules         | `spec:AST-094` FR3、FR6、FR43、DEC-25；`architecture:public-component-api` INV3（一处已知偏离，DEC-2）、INV22；`architecture:react-component-runtime` INV13；`spec:AST-085` FR1、FR4；`spec:AST-025` FR12；`architecture:interaction-modality` INV1。                                                                                                             |

本表是评审用的投影，正文为准。

## Intent

Carousel 在一个带标签的区域里横向滚动展示一行条目，每个边缘可选地带有滚动按钮。本记录涵盖这一行如何 snap、按需启用的 snap paging，以及边缘滚动按钮在方向耗尽时的行为。在本记录扩展之前，Carousel 的其他行为尚无契约。

## Compatibility and migration

- 保留已发布的默认行为：是。`hasSnap` 与 `hasSnap={true}` 保留已发布的原生 snap，不获得分页。省略 `hasSnap` 或将其设为 `false` 的轮播不会 snap。
- 兼容类别：增量 API。`hasSnap` 的类型从 `boolean` 拓宽为 `boolean | SnapPaging`，`useSnapPaging` 是新增的；没有重命名、弃用或 codemod。边缘焦点是一处行为修正，不改 API。
- 受控/非受控行为：不变。
- 迁移决策：DEC-1（边缘焦点），DEC-2（snap 与 snap paging）。

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `hasSnap` prop、它的原生 snap 与它的 snap paging 值，以及 `useSnapPaging` API。
- snap paging 在轮播上使用哪些停靠点，以及一页是什么（FR7）。
- 边缘滚动按钮的可见性、制表顺序，以及其中一个耗尽时的焦点去向。

**不拥有 / 非目标**

- 分页规则、稳定过程及其测量值——`spec:AST-094` FR3、FR6、DEC-25。
- snap paging 与 Lightbox 的图库共用的内部分页器——`spec:AST-094`；它保持内部。
- 滚动区域的键盘访问与命名——`spec:AST-025`。
- 一般意义上的禁用控件语义——`spec:AST-085`。
- 按钮的命名、尺寸与激活——`family:buttons`。
- 循环、鼠标拖拽分页、自动播放、圆点与幻灯片语义——尚无契约。
- 边缘渐隐——渐隐的外观尚无契约；其状态遵循 FR8。

## Public concepts

| Concept                   | Closed values or states               | Meaning                                                                                                                           | Availability by variant/orientation/state | Default           | Owner                | Stability | Invalid-value behavior        |
| ------------------------- | ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ----------------- | -------------------- | --------- | ----------------------------- |
| `hasSnap`                 | `false`、`true`、一个 `SnapPaging` 值 | 省略或 `false`：不 snap。`true`：原生 CSS scroll snap（FR6）。一个 `SnapPaging` 值：在原生 snap 的停靠点上启用 snap paging（FR7） | 每个 Carousel                             | `false`           | `component:Carousel` | stable    | TypeScript 拒绝其他值         |
| `useSnapPaging(options?)` | 返回 `SnapPaging`                     | 其值可开启 snap paging 的 hook。从 `@astryxdesign/core/SnapPaging` 与包根导出                                                     | React 调用方                              | —                 | `component:Carousel` | stable    | —                             |
| `SnapPaging`              | 不透明                                | 已配置的 snap paging。调用方只能用 `useSnapPaging` 创建它，并且只把它传给 `hasSnap`                                               | —                                         | —                 | `component:Carousel` | stable    | —                             |
| `SnapPagingOptions`       | `{pages?: 'view' \| 'item'}`          | hook 的选项。`pages` 决定一次轻扫移动什么（FR7）。只有当前记录才会新增字段                                                        | —                                         | `{pages: 'view'}` | `component:Carousel` | stable    | TypeScript 拒绝未知字段与取值 |
| Edge scroll button        | available、run out                    | 该按钮方向上是否仍有内容                                                                                                          | 轮播溢出时的两个边缘                      | —                 | `component:Carousel` | stable    | 不适用                        |

## Behavioral and layout contract

| ID  | Candidate invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Basis                                               | Draft review state |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------------------ |
| FR1 | 方向已耗尽的边缘滚动按钮会隐藏。隐藏时它不占用制表位，也不暴露给辅助技术。它保持挂载，因此布局不会移动。这是 `spec:AST-085` FR4 意义上的移除，而不是禁用控件。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | DEC-1                                               | settled            |
| FR2 | 当获得焦点的边缘滚动按钮耗尽时，焦点移到滚动区域，且不滚动它。当内容不再溢出、滚动区域已不在制表顺序中（`spec:AST-025` FR12）时，这一点同样成立：它仍可被程序化获取焦点。焦点绝不会落到页面 body 或隐藏按钮上。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | DEC-1; `spec:AST-085` FR4                           | settled            |
| FR3 | 交接在每次边缘状态转换时只发生一次，且只在边缘按钮持有焦点时发生。在焦点位于别处时通过滑动、调整尺寸或滚轮到达的边缘不引发任何移动。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `architecture:interaction-modality` INV8            | settled            |
| FR4 | 可用状态的边缘滚动按钮的行为与普通 Button 相同。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `family:buttons`                                    | settled            |
| FR5 | `hasSnap` 接受 `boolean \| SnapPaging`。省略或 `false`：滚动区域不 snap。`true`（写作 `hasSnap`）：原生 snap，FR6，与已发布版本完全一致，不含手势代码。一个 `SnapPaging` 值（只能由 `useSnapPaging` 生成）：snap paging，FR7；轮播在原生 snap 的逐条目停靠点上 snap，并遵循 FR7 的末页例外，同时分页器稳定在这些相同的停靠点上。`true` 永远不会分页。后续渲染中新的 `SnapPaging` 值不会重新启动稳定过程，也不会再次附加手势。第三种状态是对 `architecture:public-component-api` INV3 的一处已知偏离，该规则要求 `has…` 布尔值只表示开/关（DEC-2）。`SnapPaging` 值通过一个注册键被识别，其类型带有一个类型为 `never` 的可选幻影成员，从而使包提供的值与 swizzle 副本的值相互匹配（`spec:AST-110` FR3）；该成员在运行时从不出现，值保持不透明。                                                                                                                                                                                                                    | DEC-2                                               | settled            |
| FR6 | 原生 snap 只使用 CSS scroll snap：在滚动区域沿这一行使用 mandatory snap，每个直接子元素在自己的起始边缘 snap，并且滚动内边距与轮播的内边距一致。每个条目都是一个停靠点，在同时显示多个条目时也是如此，而由平台自身的惯性决定一次滑动停在哪里。所报告的当前页是滚动稳定时 snap 进视图的那一页，边缘按钮的可用性则跟随每次滚动（包括惯性与程序化滚动）以及每次尺寸调整。原生 snap 不添加任何手势代码。它不依赖 `::scroll-button()`、`::scroll-marker`、`:target-current`、滚动状态容器查询、snap 事件或 `interactivity: inert`；其中某项组件 MAY 在 `@supports` 下添加，且仅在它不改变行为、名称、角色或焦点顺序时才可以。                                                                                                                                                                                                                                                                                                                                          | DEC-2                                               | settled            |
| FR7 | Snap paging 使用原生 snap 的停靠点（FR6）：每个直接子元素的起始边缘，从行内起始方向测量并在从右到左布局中镜像，最后的停靠点在行尾处被钳制，从而不显示空白空间；例外是距末尾不足其前一步进一半的停靠点，它会并入末尾页。停靠点之间存在间隔，间隔永远不是停靠点。在手指下，以及在任意指针下的触控板滑动中（`spec:AST-094` FR43），释放会按 `spec:AST-094` FR3 的分页规则选取其静止页：距拖拽起始页至多一页。稳定过程按 `spec:AST-094` FR6 的分页段落所述开始。使用分页配置时，一次轻扫默认移动一个视图：释放在轻扫方向上最近一个视口处的条目起始边缘上稳定，最后一页停在行尾；`{pages: 'item'}` 则每次轻扫移动一个条目。在从右到左布局下，页从行内起始方向开始。每视图一个条目时两者给出相同的停靠点。鼠标滚轮保留原生 snap，而 `hasSnap={true}` 在任意指针下都保留原生 CSS snap。边缘按钮大约移动一个视图：视口宽度减去半个条目，落在最近的停靠点上，并至少移动一个停靠点。证据缺口：每轻扫一个条目的手感尚未对照 UIKit 的分组分页进行测量；在声称一致之前先测量。 | DEC-2; `spec:AST-094` FR3, FR6, DEC-25              | settled            |
| FR8 | Carousel 的模块不导入任何分页器代码：不导入内部分页器、它的分页运动或其手势代码。`useSnapPaging` 模块静态导入这些代码，而 Carousel 只在 effect 中对 `SnapPaging` 值调用 attach 与 detach，以及从 Carousel 自己的滚动调用中移动这一行。分页器按模块边界被 tree-shaking，不使用惰性 `import()`（`architecture:react-component-runtime` INV13），因此没有 `hasSnap={useSnapPaging()}` 的 Carousel 不会打包分页器代码。导入该模块不做任何 DOM 操作。在 snap paging 下，边缘按钮、边缘渐隐以及 handle 的 `canScrollPrev()`/`canScrollNext()` 都跟随被持有的那一行，共用一个状态。                                                                                                                                                                                                                                                                                                                                                                                      | DEC-2; `architecture:react-component-runtime` INV13 | settled            |
| FR9 | `useSnapPaging(options?)` 默认没有非 React 等价物：它的值只供给 Carousel 的 `hasSnap`（`architecture:public-component-api` INV22）。Carousel 通过该值把 FR7 附加到其滚动区域，而解除附加会移除它添加的所有监听器。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `architecture:public-component-api` INV22           | settled            |

### Representative states

| State                                  | Required invariant                                                                                                          | Allowed variation    |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| Mid-scroll                             | 两个边缘按钮都可用                                                                                                          | 循环时两者都保持启用 |
| Focused "Scroll right" reaches the end | 按钮隐藏；焦点在滚动区域上；没有额外滚动                                                                                    | 减少动态效果         |
| Edge reached by swipe, focus elsewhere | 按钮隐藏；焦点不移动                                                                                                        | —                    |
| Content shrinks to fit                 | 两个按钮都隐藏；获得焦点的那个把焦点交接给滚动区域                                                                          | —                    |
| One item per view, snap paging         | 一次轻扫移动一个条目，如同 UIKit 的分页滚动视图移动一页；`{pages: 'item'}` 给出相同结果                                     | —                    |
| Three items per view, snap paging      | 一次轻扫移动一个视图，在最近一个视口处的条目起始边缘上稳定；使用 `{pages: 'item'}` 时移动一个条目；边缘按钮大约移动一个视图 | —                    |
| Partial last page                      | 最后一页停在行尾处；没有空白空间                                                                                            | —                    |
| Split end                              | 末尾页是末尾所舍入到的那一页：距末尾不足其前一步进一半的停靠点停在行尾处（FR7）；原生 snap 会跳过它                         | —                    |
| Right-to-left                          | 页从行内起始方向开始；停靠点与轻扫方向镜像                                                                                  | —                    |
| `hasSnap={true}`                       | 原生 snap；不加载也不运行分页器代码                                                                                         | 平台惯性             |

## Accessibility contract

- **AR1 — 没有不可见的制表位。** 隐藏的边缘按钮不可聚焦，也不暴露给辅助技术（FR1）。
- **AR2 — 焦点留在区域内。** 边缘交接把焦点保留在带标签的轮播区域内（FR2），并且键盘焦点指示器遵循
  `architecture:interaction-modality` INV1。

- **AR3 — Snapping 保留每一条路径。** 在原生 snap 与 snap paging 下，滚动区域仍是真正的滚动容器：键盘滚动、边缘按钮以及区域名称的工作方式与未启用 snapping 时相同。在“减少动态效果”下 snap paging 的运动遵循 `spec:AST-094`。
- **AR4 — 按钮完整地留在焦点环之内。** 边缘按钮位于滚动容器的焦点环内，绝不遮盖它（`architecture:interaction-modality` INV1）。

## Design relationships

目前没有设计记录管辖 Carousel。边缘按钮的视觉保留在代码与视觉证据中。

## Family and system relationships

- `spec:AST-085` FR4 允许组件为其移除的控件指定一个焦点去向；FR2 指定滚动区域。
- `spec:AST-025` FR12 拥有滚动区域的制表位与命名。
- `family:buttons` 拥有边缘按钮在可用状态下的行为。
- `spec:AST-094` FR3、FR6 与 DEC-25 拥有 snap paging 所运行的分页规则与稳定过程（FR7）。内部分页器保持内部。
- `component:Lightbox` FR7 用同一个内部分页器与规则为其图库分页。它的页是它自行驱动的一行中的整宽条目，因此它不接受 `SnapPaging` 值；它共享的是规则，不是配置。
- `architecture:public-component-api` INV22 规定 `useSnapPaging` 默认没有非 React 等价物，因为它的值只供给 Carousel 的 `hasSnap`。

## Verification map

| Contract | Verification                                                                                                                                | Representative states                                                                                                                                                             | Mutation or failure expectation                                                                                                                                                                                                                       | Audit section                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1, AR1 | 单元测试与辅助技术树测试；在 Chromium 与 WebKit 中对被持有那一行的真实浏览器测试                                                            | 静止于每个边缘；无溢出；在 snap paging 下，从每个边缘轻扫离开以及在末尾按钮上按下                                                                                                 | 可聚焦或可暴露的隐藏按钮失败；在边缘处于隐藏状态时，滚动按钮重新出现，超出两个画面帧也失败                                                                                                                                                            | `audit:Carousel/accessibility` |
| FR2, AR2 | 真实浏览器键盘测试                                                                                                                          | 在 "Scroll right" 上按 Enter 直到末尾；在起始端做同样的操作                                                                                                                       | 焦点落在页面 body、隐藏按钮或相反按钮上失败                                                                                                                                                                                                           | `audit:Carousel/accessibility` |
| FR3      | 带滑动与调整尺寸的真实浏览器测试                                                                                                            | 焦点在轮播之外时到达边缘                                                                                                                                                          | 没有边缘按钮按下而焦点移动，或为一次边缘移动两次，失败                                                                                                                                                                                                | `audit:Carousel/accessibility` |
| FR5, FR6 | 对滚动区域样式与监听器的单元测试                                                                                                            | 省略 `hasSnap`、`false`、`true` 以及一个 `SnapPaging` 值；每视图一个与三个条目                                                                                                    | 省略或 `false` 时发生 snapping、停靠点不是每个子元素的起始边缘、`hasSnap={true}` 下手势监听器、会分页的 `hasSnap={true}`，或分页停靠点与原生 snap 不同，失败                                                                                          | —                              |
| FR7, AR3 | 在 Chromium 与 WebKit 中的真实浏览器触摸与触控板测试，分别覆盖手指、粗指针与细指针下的触控板滑动，并对默认配置与 `{pages: 'item'}` 各测一次 | 每视图一个条目；每视图三个条目；部分末页；从右到左；超过 300 pt/s 的短促轻扫；在半页之前与之后缓慢释放；每视图三个条目时的边缘按钮步进；鼠标滚轮；触控板滑动下的 `hasSnap={true}` | 静止停靠点不是 FR7 的、一次轻扫移动超过一页、每视图三个条目时默认轻扫移动一个条目、`{pages: 'item'}` 轻扫移动超过一个条目、最后条目之后出现空白空间、从右到左轻扫未镜像、细指针触控板滑动不分页、鼠标滚轮运行分页器，或 `hasSnap={true}` 会分页，失败 | —                              |
| AR4      | `CarouselFocusRing.a11y.chromium.spec.ts`：Chromium 中聚焦滚动容器焦点环的真实浏览器像素                                                    | 静止；滚动中，在两处滚动按钮处采样水平                                                                                                                                            | 任一处按钮位置上的环像素不是焦点环的颜色，失败                                                                                                                                                                                                        | `audit:Carousel/accessibility` |
| FR7      | 桌面与手机宽度下的预览 story，在手指、粗指针与细指针下的触控板以及鼠标滚轮下使用                                                            | 每视图一个条目；每视图三个条目；部分末页；从右到左；各自分别以 `hasSnap`、`hasSnap={useSnapPaging()}` 与 `hasSnap={useSnapPaging({pages: 'item'})}` 配置                          | 缺失的 story，或其分页停靠点与其原生 snap 停靠点不同的 story，失败                                                                                                                                                                                    | —                              |
| FR7      | 停靠点的单元测试；Chromium 与 WebKit 中手指与鼠标滚轮下的真实浏览器测试                                                                     | 距末尾不足其前一步进一半的停靠点；把它推得离末尾更远的一次尺寸调整                                                                                                                | 停在该停靠点上的轻扫或滚轮、从末尾回退的步进短于完整步进，或该停靠点在被推离末尾后仍被原生 snap 跳过，失败                                                                                                                                            | —                              |
| FR8      | 以尺寸报告的 esbuild 选项对 Core 源码运行打包测试，其急切输出按模块归属，并带一个正向对照；对被持有那一行的真实浏览器测试                   | 单独的 Carousel；带 `useSnapPaging` 的 Carousel；该模块的服务端导入；静止时的边缘按钮按下与 snap paging 下的轻扫                                                                  | 没有 `hasSnap={useSnapPaging()}` 的 Carousel 打包了分页器代码、对分页器的 `import()`，或导入时做 DOM 工作，失败；在边缘处于隐藏状态时，滚动按钮重新出现，超出两个画面帧也失败；会留住分页的按下与滞后于被持有那一行的边缘同样失败                     | —                              |
| FR9      | Carousel 中该 hook 的单元测试                                                                                                               | Carousel 中的该 hook；在稳定过程中卸载 Carousel，或丢弃该值                                                                                                                       | 轮播卸载或丢弃该值后仍留有监听器，或该 hook 存在公开的 `create…` 等价物，失败                                                                                                                                                                         | —                              |

## Decision log

### DEC-1 — The scroll area receives focus when an edge button runs out

**Reference:** `component:Carousel/DEC-1`

**Decider:** cixzhang, 2026-10-22

Carousel 会隐藏方向已耗尽的边缘按钮，因此把焦点留在它上面会让键盘用户停留在一个不可见的控件上。滚动区域始终挂载在带标签的区域内，无论它是否在制表顺序中都可获取焦点，所以把焦点移到那里能让用户留在轮播中的原处。

已否决：相反的边缘按钮——它也可能被隐藏，焦点会跳过轮播。

### DEC-2 — `hasSnap` takes native snap or a paging config from `useSnapPaging`

**Reference:** `component:Carousel/DEC-2`

**Decider:** cixzhang, 2026-11-02

分页来自一个返回分页配置的 hook，即 `useSnapPaging`。像 `usePaging` 这样的朴素名称读起来过于笼统，并且会与 Pagination 冲突。

该配置放在 `hasSnap` 上，也就是已发布的 snap prop：`hasSnap={useSnapPaging()}`。一个 prop 就回答了轮播如何 snap。省略或 `false` 不 snap，`true` 是已发布的原生 CSS scroll snap，而配置就是在相同的逐条目停靠点上的 snap paging。`hasSnap` 的类型从 `boolean` 拓宽为 `boolean | SnapPaging`：一次增量补丁，没有重命名、弃用或 codemod。只有分页配置才会打包分页器（FR8）。

第三种状态偏离了 `architecture:public-component-api` INV3，该规则要求 `is…` 或 `has…` 布尔值只表示开/关。这处偏离为构建者保留了一个 snap prop，而该记录把它列为已知偏离。

一页就是一个视图：一次轻扫默认移动一个视图，落在最近一个视口处的条目起始边缘上，最后一页停在行尾。`{pages: 'item'}` 每次轻扫移动一个条目。视图页匹配 UIKit 的分页滚动视图，后者每次轻扫移动一个视口的宽度。

已否决：在 `hasSnap` 旁边另设一个分页 prop——两个 prop 会描述同一个选择，而构建者还得去了解哪一个生效。

命名族 `useSnap<Variant>` 代表未来的 snap 行为。每个变体都是自己的 hook，因此应用只打包它导入的变体，并且每个变体只保留一种行为。它们的值只供给 `hasSnap`，所以默认没有非 React 等价物（`architecture:public-component-api` INV22）。

原生 CSS scroll snap 是默认，因为它在每个浏览器中都能工作，并使用平台自身的惯性。CSS 轮播特性（`::scroll-button()`、`::scroll-marker`、`:target-current`、滚动状态查询、snap 事件、`interactivity: inert`）只在 Chromium 中提供，并且另一个引擎对其有尚未解决的可访问性与国际化顾虑，所以 Carousel 保留自己的按钮。Snap paging 只做原生 snap 做不到的事：在手指与触控板滑动下的 UIKit 分页规则与稳定过程。滚动驱动动画在每个引擎中都可用，适合进度或幻灯片效果。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到它们的所有者。
