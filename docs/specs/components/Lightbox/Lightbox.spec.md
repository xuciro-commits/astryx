---
schema_version: 3
template_version: 3
kind: component
id: component:Lightbox
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, interaction, theming, accessibility]
verified_by:
  [
    packages/core/src/Lightbox/Lightbox.test.tsx,
    packages/core/src/Lightbox/LightboxKeyboard.a11y.browser.spec.ts,
    packages/core/src/Lightbox/LightboxViewport.a11y.browser.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs: [spec:AST-017, spec:AST-020, spec:AST-086, spec:AST-094]
---

# Lightbox component contract

## Intent

Lightbox 在全视口查看器中呈现一张活动图片或一段视频，并可添加画廊导航、说明文字和位置计数器。在触摸屏上，它的行为就像原生照片查看器：用户可以捏合和双击来缩放，在条目之间滑动，向下拖动照片或捏合收起来关闭，以及点按来隐藏控件。每个手势都有按钮、按键或单指针替代方式，因此键盘、屏幕阅读器和单指针用户都能触达相同的操作。

## Compatibility and migration

- 已发布的默认行为保持：`no`。在粗粒度主指针下，触摸呈现（FR5–FR10）和触摸退出（FR16）是默认行为（`spec:AST-094` FR13）。在精细指针下，鼠标或触控笔拖动会翻页并关闭查看器，在照片上按住 ctrl 滚轮或触控板捏合会缩放照片而不是页面，触控板滚动会平移已缩放的照片，双击会围绕点击点而非中心缩放 2×（FR11）。保持不变：点按照片会保留控件，查看器在任何指针下立即打开、在精细指针下立即关闭，键盘缩放仍围绕中心 2×，视频播放和控件不变；在视频条目的画框上拖动会翻页（FR7）
- 兼容性类别：增量行为，在 `spec:AST-017` 下以三种类别发布。在 FR53 下作为可访问性一致性归为 `[fix]`：Tab 包含（FR4）、围绕点击点的双击（AR2）、`0` 键（AR3），以及在打开的查看器内连同缩放级别一起播报位置和缩放（AR4）。`[feat]`：触摸呈现和触摸退出（FR5–FR10、FR16）以及精细指针手势（FR11），它们在 FR59 下被命名为跨设备一致性，并且需要精细指针的前后证据。`[experimental]`：缩略图过渡和 `experimental.sourceFor`（FR12、FR21）
- 受控/非受控行为：不变；滑动通过 `onIndexChange` 上报，调用方拒绝的受控 `index` 会弹回
- 迁移决策：无需迁移。`hasZoom={false}` 会关闭 FR6、FR9 和 FR10（FR13）

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

已发布的 Lightbox 尚未满足下列每一项要求。每个差距都指明它未满足的要求以及受影响的用户。

- **触摸呈现（FR9、FR10、FR12）。** 在触摸屏上没有捏合关闭、点按隐藏控件，也没有缩略图过渡。
- **拖动关闭（FR8）。** 实现差距：关闭在照片离开屏幕后才上报，约在抬手后 0.3–0.5 s，直到共享的退出保持允许查看器在上报关闭后继续停留。
- **翻页动效角色（FR5）。** 页面稳定播放分页器自身的 UIKit 值，而动效角色表并未把这些值列为角色。
- **视频控件（FR7）。** 视频的原生控件被当作其底边的 48 px 条带，因为浏览器不暴露控件几何信息；把控件放在其他位置的浏览器会从那些位置翻页。
- **缩放播报（AR4）。** 缩放变化会播报“放大”或“缩小”，但不带缩放级别。
- **精细指针手势（FR11）。** FR11 的拖动翻页（FR7）和拖动关闭（FR8）尚未为鼠标、触控笔或触控板构建：在已适配的照片上拖动不会产生任何效果。在桌面上，点按查看器中照片之外的区域以及承载说明文字的条带会关闭它。启用缩放时，双击说明文字会缩放照片，且鼠标不会选中说明文字，无论单张照片还是画廊。
- **双击监听器（FR14）。** 鼠标或触控笔的双击通过舞台自身的 `dblclick` 监听器触达缩放，因为只有浏览器知道系统的双击速度。
- **按压跟踪器（FR14）。** 查看器自身的 `pointerdown` 处理器记录每次按压的指针类型和位置，这些信息浏览器的 `dblclick` 和 `click` 都不携带，并清除拖动为其点击留下的标志。
- **触摸退出（FR16）。** 在触摸屏上，查看器关闭时会立即消失。

## Ownership boundary

**拥有**

- Viewer 覆盖层及其当前的 `lightbox` 目标。
- 媒体呈现、可选的 Caption 和 Counter 放置、画廊导航、图片缩放和平移、触摸呈现（FR5–FR12），以及触摸退出（FR16）。
- 它呈现的每个手势的可访问替代方式（AR1–AR8）。

**不拥有 / 非目标**

- Close、Previous 和 Next 按钮表面——通过 IconButton 委托给 `component:Button`。
- 调用方提供的 Caption 内容。
- Media、Caption 或 Counter 的新目标；不存在任何新目标。
- 共享层托管或关闭策略——由 `architecture:layer-runtime` 和 `family:overlay-dismissal` 拥有。
- 触摸物理、测量值和动效角色的取值——由 `spec:AST-094` 及其测量动效表拥有。

## Public concepts

未引入新的稳定公共概念。`experimental.sourceFor` 是 `experimental` prop 对象内的一个实验性选项（`spec:AST-017` FR21）。使用方 props 和用法仍记录在 `Lightbox.doc.mjs` 中。

## Behavioral and layout contract

| ID   | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 依据                                         | 草案审查状态     |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- | ---------------- |
| FR1  | 查看器包含一个活动 Media 条目和一个 Close 按钮；画廊还包含 Previous 和 Next 按钮以及一个 Counter，而 Caption 仅在提供时渲染。在任何带说明文字的画廊中，每一页都在其 Media 下方保留一条两行说明文字高的条带，仅在该页有说明文字的位置才有说明文字的背衬。较长说明文字的第二行以“更多”操作结尾，该操作在 Media 底部之上以遮罩层打开完整内容。完整说明文字始终是查看器的可访问描述。说明文字条带使用 Astryx 部件：说明文字文本是使用正文字体的 `Text`，而不是手工样式的元素。说明文字的更多/更少切换是随说明文字文本内联流动的链接样式操作（component:Link 的按钮形式），带有 aria-expanded 和 aria-controls。 | 当前源码、文档和测试                         | 已确定           |
| FR1b | 单个带说明文字的条目（照片或视频）和图库以相同方式呈现说明文字：相同的底板、宽度、文本处理、内联“更多”、间距和照片位置，且在没有说明文字时没有底板。（所有者指示，2026 年 11 月 6 日（Cindy）：单张照片的说明文字行为与画廊不同，“它们真的应该一致”。）例外：单张照片没有 Previous 或 Next 按钮、没有 Counter、也没有翻页，因为没有其他条目；并且在已缩放的单张照片边缘之外拖动会像橡皮筋一样回弹（FR6），而画廊的触摸分页器则会接管（FR7）。                                                                                                                                                               | 所有者指示，2026 年 11 月 6 日               | 已确定           |
| FR2  | Viewer 覆盖层承载当前的 `lightbox` 目标。Media、Caption 和 Counter 不承载任何 Lightbox 公共目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码和公开文档                           | 已确定           |
| FR3  | Close、Previous 和 Next 按钮表面通过 IconButton 使用 Button 的 `button` 目标，而不是 Lightbox 自有的按钮目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码和目标文档                           | 已确定           |
| FR4  | 打开的查看器通过 Core 的共享焦点区域模块（`component:Dialog/DEC-2`）成为焦点区域：从其最后一个控件开始的 Tab 会把焦点移到第一个，从其第一个控件开始的 Shift+Tab 会把焦点移到最后一个，因此焦点永远不会离开查看器而落到浏览器自身的界面。                                                                                                                                                                                                                                                                                                                                                                    | `component:Dialog/DEC-2`                     | 已确定；实现差距 |
| FR5  | 在粗粒度主指针下，水合之后，Lightbox 无需选择加入即呈现 FR6–FR10。Lightbox 的主要交互是手势，因此其中的每一次运动（缩放稳定、双击缩放、页面稳定、关闭、取消拖动的回弹和捏合关闭）都是通过动效角色表读取的具名动效角色上的弹簧，绝不使用字面值，并且释放从手势的速度开始；控件淡入淡出是伴随动效，节奏与主弹簧一致（`spec:AST-094` FR45）。关闭播放 Photos 的测量弹簧，使用 Motion 一节列出的角色（`spec:AST-094` FR4）。在减少动效下，它们遵循 AR6。                                                                                                                                                        | `spec:AST-094` FR4、FR13                     | 已确定；实现差距 |
| FR6  | 在启用 `hasZoom` 时，在图片上，捏合会围绕手指缩放并在缩放时平移；超过最小值或最大值时，照片会抵抗并在没有过冲的情况下缓回。双击会缩放到“填满查看器”和 2× 两者中较大者，围绕点按点；第二次双击返回适配尺寸。已缩放的照片会带惯性平移并具有橡皮筋边缘。在控件或说明文字上捏合仍会缩放页面。                                                                                                                                                                                                                                                                                                                   | `spec:AST-094` FR3、FR10                     | 已确定；实现差距 |
| FR7  | 在画廊中，水平拖动会移动条目行，条目之间以测量出的间隙分开。释放最多落在至多一个相邻条目上，依据 `spec:AST-094` FR3 的翻页规则（DEC-25）。翻页在视频条目的画框上与在照片上一样适用；从视频自身控件（例如其进度条或音量）开始的拖动仍属于视频。已缩放的照片会先平移到边缘，然后新的拖动才会翻页。捏合从不翻页。Previous、Next 和方向键保持翻页。调用方拒绝的受控 `index` 会弹回。`onIndexChange` 上报滑动。                                                                                                                                                                                                  | `spec:AST-094` FR3、FR14、FR36–FR39、DEC-25  | 已确定；实现差距 |
| FR8  | 在已适配的图片上，向下拖动会随手指移动照片、缩小它并淡化背景。释放只决定一次：如果预测的位移超过提交点，查看器关闭，并在抬手时上报 `onOpenChange(false)`；向后移动的释放会弹回。视频不变。                                                                                                                                                                                                                                                                                                                                                                                                                  | `spec:AST-094` FR4、FR36–FR40、FR45          | 已确定；实现差距 |
| FR9  | 在启用 `hasZoom` 时，从适配尺寸开始向内捏合是一次释放决策：低于测量出的适配尺寸比例时，释放会关闭查看器；在抬手前再次以测量出的幅度张开手指属于回退并取消。从已缩放状态开始的捏合永远不会关闭查看器。                                                                                                                                                                                                                                                                                                                                                                                                       | `spec:AST-094` FR36、FR37                    | 已确定；实现差距 |
| FR10 | 在启用 `hasZoom` 时，仅在粗粒度指针下，点按照片会淡化控件和说明文字并加深背景。在它们隐藏时，下一次点按照片、点按照片旁边的区域，或取消拖动会把它们带回，并且那次点在照片旁边的点按不会关闭查看器（ORD3）。AR5 规定它们在隐藏时的键盘和辅助技术访问。                                                                                                                                                                                                                                                                                                                                                       | `architecture:public-component-api` INV16    | 已确定；实现差距 |
| FR11 | 鼠标、触控笔和触控板也使用 FR7 的拖动翻页、FR8 的拖动关闭、在照片上按住 ctrl 滚轮或触控板捏合来实现 FR6 的缩放和 FR9 的关闭，以及触控板的滚动来平移已缩放的照片；鼠标滚轮的档位会使其保持原位（`spec:AST-094` FR43）；在照片上，这些行为取代浏览器的页面缩放和滚动。双击会围绕点击点缩放 2×。点按照片会保留控件，并且查看器立即打开和关闭。                                                                                                                                                                                                                                                                 | `spec:AST-094` FR43；`spec:AST-017` FR59     | 已确定；实现差距 |
| FR12 | 仅在 `experimental` 内、在粗粒度指针下，照片在查看器打开时从其来源展开，在关闭时返回其中，使用弹簧，除非动效表命名其他角色，否则为 `springs.settle`，因为 Lightbox 的主要交互是手势（`spec:AST-094` FR7、FR45）：即 `experimental.sourceFor(index)` 返回的元素，否则是显示图片的打开者。关闭在请求时上报 `onOpenChange(false)`；查看器仅保留到照片落位。进入期间的指针输入会被保持；按键和辅助技术保持活跃。没有 `experimental` 时，打开不变，关闭播放 FR16。                                                                                                                                               | `spec:AST-017` FR21；`spec:AST-094` FR35     | 已确定；实现差距 |
| FR13 | `hasZoom={false}` 会关闭 FR6、FR9 和 FR10。FR7 和 FR8 增加按钮、按键和 Escape，而不移除其中任何一项，因此 Lightbox 不采用 `presentation` prop。                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `architecture:public-component-api` INV16    | 已确定           |
| FR14 | 手势、翻页、动效和减少动效通过 Core 的一套共享内部触摸模块运行；Lightbox 不捆绑任何模块原语的副本，也不在这些模块之外添加手势监听器。                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `architecture:react-component-runtime` INV13 | 已确定；实现差距 |
| FR15 | Lightbox 支持画中画窗口作为其唯一的第二文档；在那里，它把 Escape 和平台关闭排在该窗口的成员之中。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `family:overlay-dismissal` FR8               | 已确定           |
| FR16 | 在粗粒度主指针下，不是向下拖动（FR8）、捏合向内（FR9）或返回来源（FR12）的关闭会播放触摸退出：Close、Escape、平台关闭，以及控件显示时点在照片旁边的点按（ORD3）。照片会略微缩小并就地淡出，背景和控件随之淡出，就像原生查看器在没有来源时的缩放过渡，从静止开始的弹簧，除非动效表命名其他角色，否则为 `springs.settle`，背景和控件以其节奏淡出（`spec:AST-094` FR7、FR45）。`onOpenChange(false)` 在请求时上报，并且退出播放期间查看器不接受输入。在精细指针下，查看器立即关闭（FR11）。                                                                                                                    | `spec:AST-094` FR7                           | 已确定；实现差距 |
| FR17 | 对于任何 `index`（受控或默认），查看器都会打开最近的有效条目：低于 0 时打开第一个，超过最后一个时打开最后一个。小数会四舍五入到最近的条目，NaN 打开第一个。                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 当前源码和测试                               | 已确定           |
| FR18 | 在画廊中，相邻页上的视频在另一个条目显示时保持挂载并暂停。翻页回到它时，会在它停止的位置显示它，就像平台照片查看器那样：暂停，或在启用 `hasAutoPlay` 时从那里继续播放。                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码和测试                               | 已确定           |
| FR19 | 查看器是媒体表面：它在 `MediaTheme`（深色）内渲染，因此其控件和说明文字采用主题的深色表面 token 以及活动主题的组件规则（`architecture:theme-application` INV8），除 AR9 的背衬、说明文字的背衬和深色上的颜色之外，没有 Lightbox 自有的颜色。                                                                                                                                                                                                                                                                                                                                                                | 规格决策，2026 年 11 月 5 日                 | 已确定           |

### Motion

向下拖动关闭查看器会播放 Photos 的测量关闭弹簧。每一个都是动效角色，因此退出以主题的节奏播放，正如查看器中其他每一次运动那样。在节奏 1 下，它会精确播放下面的值（FR5、`spec:AST-094` FR4）。手势驱动的其他每一个弹簧，包括取消拖动的回弹，都播放 `springs.settle`。

| 弹簧                                      | 值                                      | 平台来源                                                                                                |
| ----------------------------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `zoomMedia.dismiss.dismissPositionSpring` | mass 1, stiffness 918.09, damping 60.60 | Photos，iOS 26.2 模拟器，iPhone 17 Pro：一次已提交的拖拽关闭，缩放视图的位置动画（`CASpringAnimation`） |
| `zoomMedia.dismiss.dismissSizeSpring`     | mass 1, stiffness 947.14, damping 61.55 | Photos，iOS 26.2 模拟器，iPhone 17 Pro：同一关闭的边界和不透明度动画（`CASpringAnimation`）             |

### Allowed variation

- **AV1 — 媒体模式。** Media 可以是图片或视频；缩放、平移、向下拖动关闭、捏合关闭以及隐藏控件的点按仅在图片上可用。翻页对两者都适用（FR7）。
- **AV2 — 画廊模式。** 单个条目没有 Previous、Next 和 Counter。导航按钮的禁用状态遵循当前画廊边界。
- **AV3 — 说明文字内容。** 调用方提供的 Caption 内容可以变化，而不会成为 Lightbox 自有的目标。
- **AV4 — 测量值。** 阈值、间隙、提交点和时序可以随测量动效表变化，而不改变本记录。

### Representative states

| 状态             | 必需不变式                                                        | 允许的变体                        |
| ---------------- | ----------------------------------------------------------------- | --------------------------------- |
| 单张图片         | Viewer 覆盖层、Media 和 Close 按钮渲染。                          | Caption 和缩放可以缺失或存在。    |
| 画廊边界         | 两个导航按钮和 Counter 保持渲染。                                 | Previous 或 Next 在其边界处禁用。 |
| 视频             | Media 渲染原生视频控件，不带图片缩放交互。                        | 自动播放遵循现有的使用方 prop。   |
| 带说明文字的媒体 | Caption 显示在活动 Media 页面下方的条带中，无论单个条目还是画廊。 | 说明文字内容仍由调用方提供。      |
| 已缩放图片       | 双击、`-` 或 `0` 返回适配尺寸。                                   | 缩放级别和平移位置。              |
| 控件隐藏         | 控件保持可聚焦并保留在可访问性树中；焦点或按键会把它们带回。      | 隐藏时的背景色度。                |

### Transformation and precedence order

- **ORD1 — 先缩放后翻页。** 在已缩放照片上的拖动会平移它直到照片边缘；只有从该边缘开始的新拖动才会翻页（FR7）。
- **ORD2 — 先适配尺寸后关闭。** 向下拖动或捏合向内只能从适配尺寸关闭查看器（FR8、FR9）。
- **ORD3 — 先隐藏控件后关闭。** 控件隐藏时，第一次点在照片旁边的点按只会把它们带回；只有控件显示时，点在照片旁边的点按才关闭查看器（FR10、FR16）。

### Performance and resources

- **PR1 — 稳定过程能在繁忙页面上存活。** 缩放、翻页、关闭和过渡的稳定过程在主线程繁忙时仍继续运动（`spec:AST-094`）。

## Accessibility contract

下列每一项预期都在 `spec:AST-020` FR1 下引用其 WCAG 2.2 A 级或 AA 级成功标准；减少动效引用 `design:reduced-motion`。

- **AR1 — 每个多指点或路径手势都有单指针替代方式（WCAG 2.2 2.5.1）。** 捏合缩放有双击（FR6、FR11）；滑动翻页有 Previous 和 Next 按钮（FR7）；向下拖动和捏合向内关闭有 Close 按钮（FR8、FR9）。
- **AR2 — 每个拖动都有非拖动替代方式（WCAG 2.2 2.5.7）。** 拖动关闭有 Close 按钮；拖动翻页有 Previous 和 Next 按钮；已缩放照片的平移有双击，它会返回适配尺寸，以及在某个点上的双击，它会围绕该点放大（FR6、FR11）。
- **AR3 — 键盘操作（WCAG 2.2 2.1.1、2.1.2、2.4.3）。** Escape 关闭查看器。ArrowLeft 和 ArrowRight 按逻辑方向翻页，因此在从右到左的页面中 ArrowLeft 会移到下一个条目。启用 `hasZoom` 时，`+` 放大、`-` 缩小、`0` 返回适配尺寸；缩放时，方向键平移照片。焦点保持在查看器内（FR4），关闭时返回到打开查看器的元素，前提是该元素仍然连接且能接收焦点（`family:overlay-dismissal` AV1）。从已聚焦的“更多”或“更少”翻页离开时，焦点移到新页面的照片，或在照片没有缩放时移到 Close。
- **AR4 — 屏幕阅读器语义和播报（WCAG 2.2 1.1.1、4.1.2、4.1.3）。** 查看器是由活动条目的 `alt` 命名的模态对话框，若没有 `alt` 则为本地化的“媒体查看器”。每个条目都要求 `alt`，它到达图片的替代文本或视频的可访问名称。在打开的查看器中通过按钮、按键或滑动移到另一个条目时，会通过 `spec:AST-086` FR14 的路由播报一次该条目及其位置（“<alt>，12 个中的第 3 个”）。每一次缩放变化（无论由何种输入引起）都会在稳定时播报一次新的缩放级别，或播报照片已回到其适配尺寸。
- **AR5 — 隐藏的控件保持可到达（WCAG 2.2 2.1.1、2.4.11、4.1.2）。** FR10 仅在视觉上隐藏控件：它们保持可聚焦并留在可访问性树中。焦点到达某个控件（从键盘或从辅助技术）以及查看器内的任何按键都会把它们带回。键盘缩放从不隐藏它们。
- **AR6 — 减少动效（`design:reduced-motion` DR1–DR3）。** 在减少动效下，缩略图过渡、触摸退出、页面稳定、关闭和捏合关闭的稳定过程，以及控件淡入淡出仅改变不透明度，并在主指针为粗粒度或触摸拖动的释放触发它们时于 200 ms 内完成（DR2），包括主指针为粗粒度时的鼠标、触控笔或触控板释放（`spec:AST-094` FR43）。否则它们立即完成（DR3）。被甩出的已缩放照片的惯性滑行是直接运动并继续（DR2）。这些运动读取具名动效角色（FR5），这些角色承载减少动效路径。
- **AR7 — 焦点可见且不被遮挡（WCAG 2.2 2.4.7、2.4.11）。** 每个可聚焦控件和缩放目标都显示共享焦点指示器。已聚焦的控件从不会被 FR10 隐藏（AR5），说明文字或计数器也从不遮住它。
- **AR8 — 页面保持自己的缩放（WCAG 2.2 1.4.4）。** 在控件或说明文字上捏合会缩放页面，因此它们的文本保持可调整大小（FR6）。
- **AR9 — 控件在已缩放照片上保持对比度（WCAG 2.2 1.4.3、1.4.11）。** 启用 `hasZoom` 时，照片可能位于 Close、Previous、Next 和 Counter 之下，因此每一个都置于半透明背衬上：在它们下方的任何照片内容之上，按钮保持 3:1 对比度，Counter 的文本保持 4.5:1。在可缩放的 Lightbox 中，Close、Previous、Next 和 Counter 置于 Lightbox 自有的背衬上，其图标和文本使用深色上的颜色，因此主题对这些控件的重新样式化无法消除它们在照片上的对比度。没有 `hasZoom` 时，控件没有背衬。

## Design relationships

| 解剖或状态    | 设计要求                                  | 表示权威           | 层级角色     | 组件契约      |
| ------------- | ----------------------------------------- | ------------------ | ------------ | ------------- |
| Viewer 覆盖层 | 呈现全视口对话框及周围的覆盖层处理。      | 当前源码和公开文档 | 辅助         | FR1、FR2      |
| Media         | 呈现活动的图片或视频。                    | 当前源码和公开文档 | 突出         | FR1、FR2      |
| Close 按钮    | 提供常驻的查看器关闭操作。                | `component:Button` | 辅助         | FR1、FR3、AR1 |
| Previous 按钮 | 将画廊呈现移到前一个条目。                | `component:Button` | 辅助         | FR1、FR3、AR1 |
| Next 按钮     | 将画廊呈现移到后一个条目。                | `component:Button` | 辅助         | FR1、FR3、AR1 |
| Caption       | 在活动 Media 下方呈现调用方提供的上下文。 | 当前源码和公开文档 | 依上下文而定 | FR1、FR2      |
| Counter       | 呈现当前画廊位置和总数。                  | 当前源码和测试     | 辅助         | FR1、FR2      |
| 减少动效      | `design:reduced-motion/DR1`–`DR3`         | 规定的             | 辅助         | AR6           |

Media、Caption 和 Counter 是稳定的可见部件，但没有任何当前公共目标到达它们。它们的 `none` 处置记录的是事实上的可达性，而不是它们必须保持不可主题化的决定。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Viewer overlay": {"target": "lightbox"},
  "Media": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the active image or video"
    }
  },
  "Close button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Previous button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Next button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Caption": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the caption container"
    }
  },
  "Counter": {
    "none": {
      "reason": "reachability-gap: No current public target is applied to the gallery counter"
    }
  }
}
```

## Family and system relationships

- `spec:AST-094` 拥有触摸物理、释放决策、测量值和动效角色；本记录命名 Lightbox 呈现哪些手势以及何时呈现。
- `spec:AST-017` 拥有实验性隔离（FR21）和精细指针保持（FR59）；FR11 和 FR12 应用它们。
- `spec:AST-020` 拥有 AR1–AR5、AR7 和 AR8 所引用的 WCAG 2.2 A 和 AA 基线。
- `spec:AST-086` 拥有在打开的模态内如何传递位置和缩放播报（FR14）。
- `design:reduced-motion` 拥有 AR6 应用的减少动效表示。
- `architecture:component-theming-surface` 拥有解剖资格、目标映射、委托和事实上的 `none` 处置。
- `architecture:layer-runtime` 拥有当前的原生对话框宿主和共享层管线；Lightbox 保留其媒体和本地背景行为。
- `architecture:react-component-runtime` 拥有 FR14 使用的共享内部触摸模块（INV13）。
- `architecture:public-component-api` 拥有调用方从触摸默认行为返回的方式（INV16）；FR13 应用它。
- `family:overlay-dismissal` 拥有共享的 Escape 和平台关闭排序，包括按文档排名（FR8），并将 Lightbox 记录为采用方。
- `architecture:interaction-modality` 拥有共享的模态边界；本记录不改变任何一项。

## Verification map

| 契约                | 验证                                                                                                                      | 代表性状态                                                                                             | 变更或失败预期                                                                                                                                                             | 审计小节                       |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1                 | `Lightbox.test.tsx` 的渲染、画廊、字幕、媒体与缩放套件；`LightboxViewport` 的字幕带用例                                   | 单张图片、画廊边缘、字幕、视频                                                                         | 删除任何已记录的部分，会使现有的角色、内容、媒体或导航断言失败。                                                                                                           | `audit:Lightbox/anatomy`       |
| FR1b                | `Lightbox.test.tsx` 的单张照片用例；`LightboxSingleCaption` 交互规格，Chromium 与 WebKit，手机与桌面环境                  | 与画廊页面相对照：带字幕的单张照片、带缩放的单张照片、带超长字幕的单张照片，以及无字幕的单张照片       | 单张照片的字幕带、字幕文本或照片框与画廊页面不一致；单张照片的超长字幕缺少“more”；字幕带没有字幕；或单张照片上出现 Previous、Next 或 Counter——均判定失败。                 | `audit:Lightbox/anatomy`       |
| FR2                 | 源码检查与 `themingTargets.test.ts`                                                                                       | Viewer 覆盖层、Media、Caption 与 Counter                                                               | 删除根目标，或记录一个并未交付的子目标，会导致证据或清单校验失败。                                                                                                         | `audit:Lightbox/theming`       |
| FR3                 | 源码检查，外加 Button 与 IconButton 的公开组合                                                                            | 关闭控件与画廊导航控件                                                                                 | 重新收归某个控件表面的所有权，需要委托所有者与本映射表一并改动。                                                                                                           | `audit:Lightbox/theming`       |
| FR4, AR3            | 浏览器键盘测试：在两端使用 Tab 与 Shift+Tab、Escape、LTR 与 RTL 下的方向键、`+`、`-`、`0`、关闭后的焦点                   | 单张图片、画廊、已缩放图片、已移除的打开者                                                             | 焦点离开查看器、某个按键没有执行其动作，或焦点未回到仍连接的打开者——均判定失败。                                                                                           | `audit:Lightbox/accessibility` |
| AR3                 | `Lightbox.test.tsx` 的 “Lightbox unmounting while open” 套件                                                              | 查看器仅在打开时渲染并由页面移除，而打开者仍留在页面上；一个移除它的页面控件保留自身的焦点；StrictMode | 打开着的查看器卸载后焦点留在页面 body 上——判定失败。                                                                                                                       | `audit:Lightbox/accessibility` |
| FR5–FR10            | 基于带显式时间戳的合成触摸流的交互测试；减少动态效果（Reduce Motion）；繁忙的主线程                                       | 低于与超过每个提交点；回退的释放；对视频画面与其进度滑块的拖拽；控件隐藏时在照片旁的轻点               | 字面固定的时序、稳定（settle）过程中出现第二次决策、捏合的同时又触发翻页的手势、对视频画面拖拽却不翻页、对其控件拖拽却翻页，或在控件隐藏时在照片旁轻点却关闭——均判定失败。 | `audit:Lightbox/touch`         |
| Motion              | 在本记录中列出关闭动画弹簧的 `zoomStage.test.ts` 用例；`selfRegistration.test.ts` 的 zoom 用例；tempo 2 下的交互用例      | 关闭动画的位置弹簧，以及其尺寸与不透明度弹簧，分别在 tempo 1 与 tempo 2 下                             | 关闭时播放了 Motion 小节未连同其取值一并列出的弹簧——判定失败。退出动画在 tempo 2 下耗时与 tempo 1 相同——判定失败。                                                         | `audit:Lightbox/touch`         |
| FR11                | 精细指针（fine pointer）浏览器测试                                                                                        | 双击、单击照片、拖拽、ctrl+滚轮、触控板滚动、鼠标滚轮的一格                                            | 双击未以点击点为中心放大 2×、单击却隐藏了控件、精细指针下的关闭带动画，或鼠标滚轮的一格平移了已缩放的照片——均判定失败。                                                    | `audit:Lightbox/touch`         |
| FR6, AR1            | 触摸测试：双击形状与屏幕一致的照片，以及一张横版照片                                                                      | 手机视口上的 9:16 照片、3:2 照片                                                                       | 双击放大的倍数不足 2×，或未以被点击的点为中心——判定失败。                                                                                                                  | `audit:Lightbox/touch`         |
| FR16                | 触摸测试：通过 Close、Escape、平台关闭，以及控件可见时在照片旁轻点来关闭；减少动态效果                                    | 带与不带 `experimental`；控件可见与隐藏                                                                | 触摸关闭没有退出动画、字面固定的时序、退出期间输入仍到达查看器，或在控件隐藏时在照片旁轻点却关闭——均判定失败。                                                             | `audit:Lightbox/touch`         |
| FR17                | `Lightbox.test.tsx` 的 index 用例                                                                                         | 小于 0 与超过末尾的 index、NaN，以及范围内的分数（1.5、0.4、1.2），受控与非受控                        | index 打开了一个空查看器，或打开了除最近项以外的任何项——判定失败。                                                                                                         | `audit:Lightbox/anatomy`       |
| FR18                | `Lightbox.test.tsx` 的视频翻页用例（pause、keep、autoplay）                                                               | 一个正在播放的视频被翻走后再翻回                                                                       | 相邻视频卸载、继续播放，或从头重新开始——均判定失败。                                                                                                                       | `audit:Lightbox/anatomy`       |
| FR19                | 单元：`Lightbox.test.tsx` 的媒体表面用例；浏览器：`LightboxPaging` 与 `LightboxZoom` 交互规格，Chromium 与 WebKit         | 带字幕的画廊，带与不带缩放；单张照片的字幕；叠在白色、中灰与黑色照片之上（body 在白色上为 14.7:1）     | 查看器位于 `MediaTheme` 之外、文本颜色由 Lightbox 设定、字幕或计数器不是 `Text`、切换控件不是 Link 的按钮形式、出现两个起始边，或字幕对比度低于 4.5:1——均判定失败。        | `audit:Lightbox/theming`       |
| FR12                | 打开者与 `sourceFor` 测试，带与不带 `experimental`                                                                        | 图片打开者、文本按钮打开者、进入过程中关闭                                                             | 不带 `experimental` 时，打开或关闭的任何变化——判定失败。                                                                                                                   | `audit:Lightbox/touch`         |
| FR13                | 粗糙指针（coarse pointer）下的 `hasZoom={false}` 测试                                                                     | 画廊、单张图片                                                                                         | 在 `hasZoom={false}` 下发生缩放、捏合关闭，或轻点隐藏控件——均判定失败。                                                                                                    | `audit:Lightbox/touch`         |
| FR14                | 源码边界检查与打包产物分析                                                                                                | 同时包含 Lightbox 与另一个触摸组件的页面                                                               | 出现触摸模块的第二份副本，或出现由 Lightbox 自己拥有的手势监听器——判定失败。                                                                                               | `audit:Lightbox/touch`         |
| AR1, AR2            | 浏览器测试：只用单指针且不做拖拽，完成每个手势的动作                                                                      | 缩放、翻页、关闭、到达已缩放照片的边缘                                                                 | 某个动作只能通过多点、路径或拖拽手势达成——判定失败。                                                                                                                       | `audit:Lightbox/accessibility` |
| AR4                 | 无障碍树与播报测试                                                                                                        | 打开；通过按钮、按键与滑动翻页；通过每种输入缩放                                                       | 缺少对话框名称或 `alt`、位置播报重复或缺失、消息未在打开的查看器内部暴露，或缩放没有等级提示——均判定失败。                                                                 | `audit:Lightbox/accessibility` |
| AR5, AR7            | 控件隐藏时的浏览器测试                                                                                                    | Tab、辅助技术的焦点、按键、键盘缩放                                                                    | 隐藏的控件无法获得焦点、不在无障碍树中，或因获得焦点时仍保持隐藏——均判定失败。                                                                                             | `audit:Lightbox/accessibility` |
| AR6                 | 粗糙指针与精细指针下的减少动态效果测试                                                                                    | 过渡、翻页稳定、关闭、捏合关闭、控件淡出                                                               | 减少动态效果下出现位移、缩放，或超过 200 ms 的交叉淡化——判定失败。                                                                                                         | `audit:Lightbox/accessibility` |
| AR8                 | 触摸测试：在控件上与字幕上捏合                                                                                            | 单张图片、画廊                                                                                         | 在控件或字幕上捏合却不缩放页面——判定失败。                                                                                                                                 | `audit:Lightbox/accessibility` |
| AR9                 | 触摸测试：缩放控件下方的白色照片，并在每个已交付主题中测量控件的对比度，包括 butter 重新着色的按钮与 gothic 悬停时的 Next | 带缩放的画廊：Close、Previous、Next 与 Counter，在每个已交付主题下                                     | 在缩放后的浅色照片上，控件对比度低于 3:1，或 Counter 文本低于 4.5:1——判定失败。                                                                                            | `audit:Lightbox/accessibility` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                             | 规范解剖结构与当前目标                                                                                 | 映射缺失、多余、带前缀、过期或被重复分配——均导致仓库校验失败。                                                                                                             | `audit:Lightbox/theming`       |

## Decision log

### DEC-1 — The touch presentation is the native photo viewer

**Reference:** `component:Lightbox/DEC-1`

**Decider:** cixzhang, 2026-10-31

在触摸屏上，人们会拿 Lightbox 与自家手机上的照片查看器作比较，因此 Lightbox 默认呈现其手势（FR5–FR10），每次关闭或翻页都在释放时决策一次。

### DEC-2 — Fine pointers get the gestures and keep the desktop look

**Reference:** `component:Lightbox/DEC-2`

**Decider:** cixzhang, 2026-10-31

鼠标、触控笔与触控板获得 `spec:AST-094` FR43 赋予每种指针的手势，同时双击以被点击的点为中心放大 2×，单击则保留控件，查看器立即打开、立即关闭（FR11），因此查看器保持其桌面观感。

已否决：在双击时填满查看器——在宽窗口中，这对横版照片几乎没有放大效果。

### DEC-3 — The thumbnail transition is experimental

**Reference:** `component:Lightbox/DEC-3`

**Decider:** cixzhang, 2026-10-31

缩略图过渡、`experimental.sourceFor`，以及等待落地的关闭，都留在 `experimental` 之内（FR12），因此它们的 API 仍可能变化。

### DEC-4 — `hasZoom` is the way back

**Reference:** `component:Lightbox/DEC-4`

**Decider:** cixzhang, 2026-10-31

`hasZoom={false}` 关闭与缩放相关的触摸行为，而其余手势只是对现有控件的补充，因此 Lightbox 不需要 `presentation` prop（FR13）。

## Open questions

无。Media、Caption 与 Counter 不保留公开目标；新增一个即是对本记录的改动。

## Content boundary

本文件不重复使用方的 prop 表/示例、实测数值、媒体算法、共享图层规则、当前审计结果或实现步骤，而是链接到它们的归属者。
