---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:layer-runtime
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/Layer/,
    packages/core/src/Popover/,
    packages/core/src/Dialog/,
    packages/core/src/Drawer/,
    packages/core/src/DropdownMenu/,
    packages/core/src/ContextMenu/,
    packages/core/src/Tooltip/,
    packages/core/src/HoverCard/,
    packages/core/src/Toast/,
    packages/core/src/CommandPalette/,
    packages/core/src/hooks/useFocusTrap.ts,
    packages/core/src/hooks/useMenuHover.ts,
  ]
verified_by:
  [
    packages/core/src/Layer/useLayer.test.tsx,
    packages/core/src/Layer/layerViewportInset.test.ts,
    packages/core/src/Layer/useLayerKeyboardClearance.test.tsx,
    packages/core/src/Layer/LayerProvider.test.tsx,
    packages/core/src/Layer/toastHost.test.tsx,
    packages/core/src/Layer/toastHost.lateRegistration.test.tsx,
    scripts/layer-toast-bundle.test.mjs,
    packages/core/src/Layer/layerHost.test.ts,
    packages/core/src/Layer/anchorName.test.ts,
    packages/core/src/Layer/useLayerDismissal.test.tsx,
    packages/core/src/Layer/layerClickBoundary.test.tsx,
    packages/core/src/Layer/layerDismissalInvariants.test.tsx,
    packages/core/src/Layer/layerExitCopy.test.ts,
    packages/core/src/Layer/presentationHold.test.tsx,
    packages/core/src/Layer/__tests__/layerExitCopy.interaction.browser.spec.ts,
    packages/core/src/Layer/layerEntranceSide.test.ts,
    packages/core/src/Popover/popoverSurfaceMotion.test.ts,
    packages/core/src/Layer/__tests__/LayerEntranceSide.interaction.browser.spec.ts,
    packages/core/src/Popover/__tests__/PopoverTouchMotion.interaction.browser.spec.ts,
    packages/core/src/Popover/Popover.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx,
    packages/core/src/BottomSheet/BottomSheetSwitcher.test.tsx,
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/hooks/useFocusTrap.test.tsx,
    packages/core/src/hooks/useMenuHover.test.tsx,
    packages/core/src/Toast/ToastViewport.test.tsx,
    packages/core/src/Toast/ToastViewport.modalHost.test.tsx,
    packages/core/src/Tooltip/__tests__/TooltipClosedTriggerAnchor.interaction.browser.spec.ts,
    packages/core/src/Layer/gestureCounter.test.ts,
    packages/core/src/Layer/outsidePress.test.ts,
    packages/core/src/Layer/outsidePanClaim.test.ts,
    packages/core/src/Layer/__tests__/LayerPanLightDismiss.interaction.browser.spec.ts,
    packages/core/src/Layer/__tests__/LayerPressTransform.interaction.browser.spec.ts,
  ]
deciding_specs: [spec:AST-038, spec:AST-059]
---

# Layer runtime

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layering": [
      "INV2",
      "INV5",
      "INV6",
      "INV7",
      "INV11",
      "INV12",
      "INV13",
      "INV14",
      "INV15",
      "INV16",
      "INV17",
      "INV18",
      "INV20"
    ],
    "layout": ["INV3", "INV11", "INV12"]
  }
}
```

本记录描述当前 `main` 上已交付的层运行时，但 INV14、INV15 和 INV17 除外——它们陈述的是运行时尚未满足的必备归属要求；Current gaps 一节列出了运行时欠缺之处。其他已接受但尚未实现的变更位于 `spec:AST-003`；它们不属于当前架构。

## Purpose

分层 UI 必须摆脱裁剪，保持相对其触发器的定位，保留邻近的主题与书写上下文，并把浏览器拥有的可见性与 React 状态调和一致。

本记录区分 DOM 宿主化、浏览器顶层提升、定位以及当前的关闭处理管线。组件并不会仅仅因为使用了其中某一种机制就继承所有这些行为。

## System model

### Browser hosts and corrective portals

浏览器宿主决定某个表面是否进入浏览器的顶层，以及如何进入：

- `popover="auto"` 提供原生顶层提升、轻量关闭、关闭请求，以及浏览器的 auto-popover 栈；
- `popover="manual"` 提供顶层提升，但不提供原生轻量关闭或 auto-popover 排他性；
- `dialog.showModal()` 提供原生模态边界、背景遮罩、外部内容惰性化，以及平台关闭请求；
- `dialog.show()` 在其所在上下文中提供非模态对话框；以及
- 普通 DOM 渲染不提供上述任何浏览器保证。

React portal 改变 DOM 位置。它本身不是顶层宿主，也无法用 `z-index` 压过原生模态对话框。

`useLayer` 在该位置安全时，把上下文层保留在其 JSX 位置。当解析、交互内容或行内格式化约束使该位置不安全时，它只把层 portal 到最外层不安全祖先之外。一个持久化的 `<template>` 标记保留预期位置，使渲染调用移动时可以重新解析宿主。最近的安全宿主保留实时的 CSS 自定义属性继承；只有当 portal 否则会丢失方向和书写模式时，才复制它们。

普通 React portal 保留 React 上下文。`architecture:theme-application` 拥有 Theme provider 行为；本记录拥有层 DOM 的宿主化位置。

### Positioning

`useLayer` 有三种定位模式：

- **context / anchor：** 触发器获得唯一的 CSS `anchor-name`；表面获得 `position-anchor`、逻辑 `position-area` 以及有序的回退位置；
- **context / custom：** 触发器与 `position-anchor` 的关系保留，而几何、回退、偏移和方向处理由调用方负责；以及
- **fixed：** 调用方提供视口 `x` 和 `y` 坐标，且不获得任何 CSS 锚点几何。

锚点名构成一个列表，因此多个层可以共享同一个触发器而不会互相覆盖。标准放置使用 `self-*` 逻辑关键字族，使继承的方向控制 RTL 行为。每种锚定放置都可以沿任一轴翻转。居中放置还会获得跨度回退，使表面在视口边缘附近可以沿对齐轴移动。间隙施加于放置轴的两个边缘，因此翻转后仍保留该间隙。

已知限制：SVG `<foreignObject>` 内的触发器在 Chromium 中不能作为 CSS 锚点，因此为它锚定的表面会在视口角落打开。请把触发器放在覆盖在 SVG 之上的 HTML 层中，定位到该节点的坐标处，并让 SVG 只负责形状、边和标签。

#### Viewport inset

锚点模式拥有视口内缩（`spec:AST-059`）。每个锚点模式的层都与各视口边缘保持一道间隙，其值等于 `max(--spacing-4, env(safe-area-inset-<edge>))` 加上应用为该边缘声明的内缩——通过 `LayerProvider` 上的 `inset` 声明（`blockStart`、`blockEnd`、`inlineStart`、`inlineEnd`；默认值为零；这是应用配置，不是主题值）。provider 通过其上下文发布该声明；`useLayer` 读取它，并以内联方式写到层元素上，作为间隙表达式所读取的自定义属性 `--astryx-layer-inset-<logical-edge>`；toast 视口则根据 provider 的 prop 在自己身上写入同样的属性。由于该值通过上下文而非 CSS 继承传递，纠正性 portal 不会丢失它；而没有 provider 的层——不写入任何内容，每个属性都读作 `0px`——与默认 provider 下的层渲染完全一致。手写该属性是不受支持的逃生通道。内联间隙读取两个物理安全区域内缩中较大的那个，因此翻转后的层仍能避开刘海。`Layer/layerViewportInset.stylex.ts` 保存唯一定义。间隙是外边距，因此必须适配某个位置选项的是外边框盒，浏览器溢出位移使其保持在视口内的也是外边框盒：最终会落在间隙内或某个已声明栏之下的层在那里放不下，会尝试下一个选项。在放置轴上，间隙位于远端边缘，近端边缘则是锚点留白；在对齐轴上，它位于对齐层的远端边缘——放在面向锚点的边缘上会把层推离锚点——而居中层的两个边缘都如此。翻转策略把外边距与区域一起交换，因此留白留在锚点侧，间隙留在远端，且放置轴的间隙对两个边缘是同一个值——两个块向间隙中较大的那个——因此在一侧块边缘声明的栏会让层与相对边缘保持同样的距离。

层盒子在两条轴上都被限制为视口减去两侧间隙，绝不限制为触发器旁边的那段视口，也绝不超出该上限。显式尺寸在其尺寸内渲染，最多到该上限；内容自适应尺寸的层在内容可换行时折到触发器旁的空间，在不可换行时其尺寸最多保持到该上限。无法适配上限的内容在层盒子内部溢出，由组合组件在那里滚动或裁剪它（Popover 在测得溢出后滚动）；盒子本身仍留在屏幕上。使用方用同一定义为其绘制的表面设上限，并用运行时的上限表达式夹紧自己设定的任何最小值（触发器匹配、显式宽度或 `menuWidth`），因为 CSS 最小值否则会压过最大值。

回退顺序属于运行时：首选位置；沿放置轴翻转；沿对齐轴翻转；两者同时；然后，在锚点可见期间，是滑动：具名的 `@position-try` 选项（`Layer/layerSlideRules.ts`），其区域横跨整个对齐轴，先在与触发器同侧，再在相反侧，每个选项都在对齐轴的两个边缘携带间隙，并携带其落点一侧的间隙加边距组合；浏览器的溢出对齐会使它以最小距离位移，从而把外边框盒带入视口。居中层会将其单侧跨度排在完整跨度之前。滑动是独立选项，因为比触发器两侧空间都宽的层会在对齐轴上溢出所有翻转选项，而浏览器否则会保留基础选项，永不把层移动到放置轴上尚有余量的那一侧。这些规则是一张静态样式表，由运行时在层的首次绘制之前安装到层的 document head 中——绝不放在层内部（带角色的层的文本会把它们读给辅助技术），也绝不放在它旁边（那会改变父元素的最后一个子元素）。在放置轴上任意一侧都容纳不下的更高内容，会被限制为视口减去两侧间隙，并由浏览器移入视口；其外边框盒留在视口内，因此它与所接触的边缘保持锚点间隙。保持锚点清空的层（Tooltip）从第一帧起就携带一个合并列表，取代标准列表（`spec:AST-059` DEC-7）：先是在其自身尺寸下的首选块向侧，然后是在其自身尺寸下的相反块向侧，然后在行内末端位于锚点旁边，再在行内起始端，采用内容的行内尺寸，最后才是首选块向侧和另一侧，且各自只在它是更宽敞的一侧时，并按该处空间定尺寸。每个选项都在放置轴上朝锚点对齐 `unsafe`，因此空间用尽的盒子会背离锚点溢出，没有任何选项会让它覆盖锚点。能在某一侧容纳的内容会在那里保持自己的尺寸，没有任何选项会按剩余空间定尺寸：只要某选项仍然合适，浏览器就会让打开的层留在它上次使用的选项上，因此移动的锚点会把层带到当时更宽敞的一侧，而不是把它缩小。其 `overflow-y` 为 `auto`，不做过滚动包含，因此只在内容溢出时才滚动，合适的层没有滚动范围；没有任何读取决定它。Chromium 最多尝试五个选项，因此此列表取代标准列表，而不是扩展它。滚动期间，Chromium 不会在页面上或滚动面板内部重新选择 CSS 锚定层的选项，因此运行时在滚动停止后检查一次层（`spec:AST-059` DEC-8）。若盒子仍然覆盖锚点，或在锚点可见期间在块轴上离开视口，运行时会在同一任务中把层移出渲染以进行一次强制布局（不绘制任何帧，popover 保持打开，不触发 toggle 事件），引擎会按列表重新放置它。移出渲染会取消层及其内容的 CSS 动画和过渡：浏览器会从起点重新创建动画，而过渡则完全不重新创建。`Layer/preserveAnimations.ts` 在重置之前读取每条动画与效果原型链上每个带 setter 的访问器、效果的时机与关键帧，以及播放与替换状态，然后在重新创建的动画上写回任何有差异的内容；它以相同状态用脚本动画恢复每个过渡，并结束没有前身的重新创建动画。脚本动画不受影响。CSS 动画和过渡的 Animation 与 effect 对象是新的（它们的监听器和 Promise 留在旧对象上，浏览器会触发它们的 cancel 与 start 事件），而已完成动画的起始时间会从当前重新计算，同时保留其保持的结束时间。一旦锚点离开视口，运行时就会把层的自对齐 `unsafe` 固定朝向锚点，因此层保持其翻转所给的位置与尺寸，而不是滑动到边缘。组件不会向锚点模式的层传递自己的回退。

这些输入中的每一个，都由浏览器的样式与布局在产生它的同一次渲染的同一帧中解析；除下面的一种情况外，运行时不会在绘制后测量任何东西来应用它们。锚点可见性会在层首次绘制之前于布局效果中同步读取，然后在层打开期间持续观察，因此锚点已不可见时打开的层从第一帧起就保持正确。保持锚点清空的层是否覆盖其锚点或是否离开视口，会从其不含自身 transform 的盒子判断（因此使其在开始时更靠近锚点的入场动画不计入），并在 `show()` 内部与 popover 显示后立即走的打开重挂载路径中读取，以及在打开期间由 ResizeObserver 回调与 resize 事件再次读取，这些都在帧绘制之前运行；当调用方在层保持打开时替换锚点元素，观察器会移到替换后的元素上。滚动之后的那一次读取，会在页面或锚点的某个滚动祖先的滚动每次停止时运行一次：在 `scrollend` 时，或者在浏览器不触发它时，在那些对象上 150 ms 无 `scroll` 事件之后。它在停止后绘制的第一帧中运行：下一帧绘制，一个任务在该绘制之后运行，再下一帧读取并应用。滚动的监听器订阅窗口的输入流，并沿锚点平树路径上的每个 shadow root 监听，因为 `scroll` 与 `scrollend` 不是 composed 的。`scroll` 只会取消待处理的检查或启动计时器，没有任何处理器会读取布局。Chromium 按每个滚轮步触发 `scrollend`，因此长时间的滚轮滚动会被检查不止一次，且绝不在滚动进行期间检查。没有任何东西监视在屏幕上移动而不改变尺寸的锚点：每个选项都让层避开其锚点，因此层绝不会在滚动中途改变侧边。除滚动停止后的那次读取外，层绝不会在它即将纠正的几何上绘制。

### Current browser support behavior

原生 Popover API 加上 CSS Anchor Positioning 提供主路径所实现的完整行为：顶层提升、原生轻量关闭、auto-popover 堆叠与关联、逻辑锚点几何，以及浏览器回退放置。

当 `showPopover` 或 `hidePopover` 不可用时，`useLayer` 回退为更改 `display`。显式组件控件仍可显示和隐藏已挂载的内容，回调与 React 状态仍会更新，固定坐标仍然生效。此回退不重现顶层提升、原生外部或关闭请求行为、auto-popover 排他性或嵌套、invoker 焦点顺序、锚定几何或碰撞回退。

公共文档尚未把这种缩减后的行为表述为支持边界。已接受的支持契约与文档变更归 `spec:AST-003` 所有。

### Current Popover lifecycle and light dismissal

公共 `useLayer` 默认使用 `popover="manual"`；Popover 家族的 API 通常选择 `popover="auto"`。浏览器发起的关闭通过排队的 `toggle` 事件观察。在 `isOpen`、`onHide` 或受控状态同步跟上之前，浏览器可能已经隐藏了该表面。当此类关闭尚在进行中时，来自另一个触发器的显示会把层移动到该触发器；该关闭不会被报告。

`gestureCounter` 标识正在进行的物理指针或键盘手势。`useLayer` 记录该手势以及与浏览器关闭关联的触发器，来自该触发器的 `show()` 在同一手势期间不会重新打开层，因此每条触发器路径都从 `useLayer` 获得这一防护（INV7）。

`useMenuHover` 为适用的 auto popover 添加真正的原生 invoker 关系。它单独抑制关闭中的面板暴露静止触发器时产生的合成 `mouseenter`，同时允许之后真正的悬停。

位于打开层旁边的控件可以在按压期间临时获得 `popovertarget`，使原生轻量关闭不会把它们误判为外部交互。它们的 click 动作作为 invoker 切换被取消，因此控件可以执行自己的动作而不关闭该层。

文本输入框不能作为 invoker，因此 BaseTypeahead 的列表、DateInput 的日历、DateTimeInput 的时间列表以及 ChatComposerInput 的触发器菜单（均由它们的文本字段拥有）都是 manual popover。若一次按压起始并结束于该字段的输入框或其按钮（以及 DateInput 的标签）上，或在层内，则视为内部，判定会跨越打开的 shadow root；起始并结束于其他任何位置的按压会关闭该层，起始于外部的滚动或捏合不会关闭，Escape 仍由共享栈处理。焦点离开该字段仍由各所有者自行处理（`family:overlay-dismissal` AV4）。

### Exit copy

浏览器在 popover 关闭的那一刻就把它隐藏，无论是通过选择、Escape，还是它自身的轻量关闭。若某次触摸呈现的关闭留在屏幕上，它就会在退出副本上播放该关闭：这是层关闭时由 `placeLayerExitCopy` 取下的层的静态副本。该副本按层自身的盒子布局，并携带层绘制时的 transform 与 opacity，因此在层仍在进入时取下的副本会停留在它被绘制的位置。它不携带任何 id、表单名或表单所有者；它是 `inert` 的，对辅助技术隐藏，且不在指针可达范围内；它保留层的滚动位置。它只在顶层显示，作为 manual popover，因此裁剪、变换或粘性祖先既不会裁掉它也不会移动它；固定盒子或更大的 `z-index` 无法替代（`spec:AST-027` FR8）。若浏览器在关闭中的 popover 自身的 toggle 期间拒绝该显示，副本会隐藏等待，并在 toggle 结束后进入顶层：在关闭该层的脚本之后，或在下一帧绘制之前。若没有顶层（没有 popover API），或浏览器仍然拒绝，则没有副本，关闭立即发生。放置该副本的呈现会在它上面播放其退出动画（`spec:AST-094` FR7），并在其关闭落定后移除它。

### Current dismissal plumbing

`family:overlay-dismissal` 拥有已交付的 Escape／平台关闭成员关系契约。当前共享栈以 `close` 或 `block` 行为注册在场的层，并按逻辑深度、DOM 包含关系，然后按稳定的活跃周期注册顺序排序。`useFocusTrap` 把带 `onEscape` 的活跃焦点陷阱适配进该栈。

Tooltip、HoverCard、Dialog、Drawer、Popover、DropdownMenu、ContextMenu、Lightbox、MobileNav、BottomSheet 和 BottomSheetSwitcher 都向共享栈注册。Tooltip 和 HoverCard 报告当前 DOM 是否在场；Popover 和 DropdownMenu 通过 `useFocusTrap` 注册；Dialog、Lightbox、MobileNav、BottomSheet、BottomSheetSwitcher 和 Drawer 还会在对原生平台关闭请求采取行动之前询问 `shouldDismissOnCloseRequest()`。若某个 BottomSheet 被其栈中的另一个 sheet 覆盖或替换，在这期间它会向共享栈报告自己缺席（`component:BottomSheet` FR7）：共享栈仍是唯一的关闭注册表，只有 sheet 之间的顺序由 sheet 栈陈述。其他家族成员仍按 `family:overlay-dismissal` 所列使用本地 Escape 处理。

外部交互不由共享栈协调。当前各路径独立关闭自己的层：

- auto popover 使用原生轻量关闭；
- BaseTypeahead 的列表、DateInput 的日历、DateTimeInput 的时间列表以及 ChatComposerInput 的触发器菜单（manual popover）使用 Layer 的外部按压监视，它在某次按压起始并结束于字段与列表之外时关闭，并忘记被取消的按压（一次滚动）；
- 原生对话框在本地处理背景点击；
- ContextMenu 使用本地外部 `mousedown` 监听器，它会跳过打开菜单的那次手指按压的兼容性鼠标事件；
- Tooltip 和 HoverCard 使用悬停／焦点丢失加上仅触摸的外部监听器；
- sheet 拥有遮罩与滑动行为；以及
- 下拉子菜单通过 `DropdownMenuContext` 在本地编码其根关闭关系。

有一个事实把 Modal 宿主背景按压的这些路径联系起来（`family:overlay-dismissal` FR11）。外部按压监视、仅触摸的外部监听器、文本字段的失焦关闭、ContextMenu 的 `mousedown` 关闭，以及保持中的 Tooltip 的失焦释放，都会在每文档计数中记录各自的关闭。Dialog 或 Drawer 的背景按压若在其 pointerdown 与其 click 之间看到该计数变化，或看到一个 auto popover 关闭，就让宿主保持打开。该计数不排序其他任何东西：每条路径仍只关闭自己的层。

共享栈暴露 `isTopmostLayer()`，但当前的外部、背景、触摸和滑动路径都不使用它。当前 `main` 上不存在共享的交互所有者角色、关联图、分支注册表或外部分支解析操作。

### Layer content boundary — AST-038 implementation projection

[AST-038](../specs/AST-038-layer-text-boundary/spec.md) 拥有阅读基线与表面／组边界。本实现重置层根文本、携带表面／组成员关系的整体 React 上下文，以及具名的结构性自定义属性；结构性 CSS 隔离只覆盖它所指名的通道。

共享的私有文本基线同时应用于两个 `useLayer` 渲染器和 Dialog、Drawer、Lightbox、MobileNav、BottomSheetPanel 和 ToastViewport 的内容根。组件与调用方的样式仍然更强。现有的内边距归一化、宿主化、主题继承和书写上下文保持不变。

`createLayerScopedContext` 创建表面作用域的上下文，其完整的默认值由 `LayerContentBoundary` 提供。由成员关系拥有的禁用状态、选择、回调和标签，与呈现默认值一起停止。现有上下文形状和公共 hook 保持不变。内容局部 provider 仍是所有者；需要某个组的消费者需要在新表面内部有它完整的 provider。菜单已经建立自己的内容局部所有者与关闭链。无关的应用状态、集合协议、语义 DOM 选择和交互协调继续通过普通 React 上下文传递。

每个边界在挂载时对其 provider 链做快照，因此之后的惰性导入无法重新挂载活跃内容或丢弃状态／焦点。现有的原生深度 provider 接缝保留其原始深度值；裸 Layer、sheet 面板和 toast 内容直接使用私有内容边界。Toast 的页面子元素留在其外部。

私有结构重置与文本基线并列在同一批内容根上，并通过把每个它所指名的结构性自定义属性设为 `initial` 来停止它。它指名称 `--step-connector-gap`，因此从 `Step.children` 内容打开的层中的内部 Stepper 会从连接器的 0px 回退开始；在该 Stepper 上、通过其 `stepper` 目标，或由调用方在层根上的样式设置的值仍然生效。它绝不按前缀重置，因此主题令牌与书写上下文继续继承。它未指名的结构性通道仍会继承进层内容。

现有组件行为检查覆盖成员关系退出、显式内部所有者、无关上下文连续性以及状态／焦点保留。浏览器证据覆盖文本继承与视觉外观。

### Current global and nonparticipating surfaces

LayerProvider 提供 Toast 配置以及 ToastViewport 的出口。仅 LayerProvider 本身不渲染空的视口；Toast 在被导入时注册其视口。出口随后在应用之后渲染该视口，仅在客户端，而在此之前的 toast 会在出口中等待。它不是所有层的通用 portal 宿主。没有 provider 时，`useToast` 在 `document.body` 下创建单独的 React 根，并把根主题属性镜像到它上面。

ToastViewport 使用 `popover="manual"` 进行顶层提升。每个打开的模态 Dialog、每个打开的模态 Drawer，以及每个带背景遮罩的打开的 BottomSheet，都通过私有的 `Layer/modalOutlet.ts` 注册表提供其 `<dialog>` 作为出口（`spec:AST-003` FR18：每个活跃的原生模态都提供一个出口，被覆盖的 sheet 也包括在内）；模态的 BottomSheetSwitcher 流程提供其活跃步骤的对话框，并在每次交接后随之更新。注册表对出口排序；它不挂载任何东西（INV14 指出运行时将拥有的挂载职责）。哪个出口是最新的——即全局宿主渲染进去的那个——遵循 sheet 栈在 sheet 之间的顺序，而不是它们被提供的顺序：顶层 sheet 是最新的，因此 toast 落在顶层 sheet 中，绝不落在被覆盖的惰性 sheet 中；当被覆盖的流程在其下改变步骤并提供新步骤的对话框时也一样（该提供位于顶层 sheet 之下）；当顶层 sheet 关闭时，它揭示出的 sheet 又成为最新的并接管宿主；sheet 只在 sheet 出口之间被提升，因此从某个 sheet 打开、稍后提供的 Dialog 在关闭之前一直是最新的。BottomSheet 在开始关闭时释放其出口：在退出动画期间其对话框保持模态，但为惰性。关闭中且焦点在内部的 BottomSheet 尚未惰性或隐藏（`component:BottomSheet` FR9）；当焦点离开它或退出结束时它变为惰性和隐藏。模态 Drawer 在开始关闭时也会释放其出口，因此 toast 不会随它滑出。顶层视口渲染进它拥有的宿主元素，把该宿主移入最新的打开出口，在没有出口打开时把它返回视口在树中的位置，并在每次移动后再次进入顶层。因此 toast 绘制在模态之上，并在其内部保持可操作。移动宿主不会重新挂载行，因此条目、计时器和焦点交接都会保留。该规则是顺序规则，而不是模态性规则，并且它覆盖那些告知注册表自己进入顶层的表面：模态出口，以及一个不阻挡任何东西并宣告自身的非模态顶层表面——顶层中无背景遮罩的 `hasScrim={false}` BottomSheet（当某个不包含它的模态打开时，它留在该模态之下、顶层之外，并在该模态消失后进入——此时才宣告），以及 `hasScrim={false}` 的 Drawer，它在 `showPopover()` 把它放入顶层后宣告。这样的表面如何被放入顶层，目前是组件自己的事，位于下面的 INV14 缺口之内；这里的规则只是：它通过同一注册表宣告其进入，随后视口在原地离开并重新进入顶层，同时保持焦点在内部，因此 toast 也会绘制在它之上。在 Popover API 支持下限之下用 `show()` 显示的非模态表面不在顶层，也不宣告任何东西。在由带背景遮罩的 BottomSheet 构成的栈中，最新的出口是顶层 sheet，因此 toast 绘制在整个栈之上。Toast 状态存在于视口内部。以 `isTopLayer={false}` 渲染的视口留在原位。

CommandPalette 组合原生 Dialog。因此其常规启动器呈现使用 `showModal()`；其文档／展示用 `isInline` 路径不使用。模态路径把 Escape 委托给 Dialog 的共享关闭注册。只有内联预览由 CommandPalette 的本地按键处理器关闭，因为它不是注册的层。

Banner 与 FieldStatus 处于文档流中。`useAnnounce` 不可见。AlertDialog、命令式 Dialog、Lightbox 以及普通的 Popover 家族表面都是交互局部的。`useKeyboardHint` 使用 Layer 渲染，并在其提示显示期间加入 Escape 关闭。Carousel 的控件覆盖层和仅视觉的层使用 Layer 渲染，但不加入 Escape／平台关闭。

## Boundaries and invariants

- **INV1 — 纠正性 portal 保留局部性。** 上下文层在安全时保持内联，否则只移动到最外层不安全祖先之外（关于渲染器管理的 DOM 见 INV19）。
- **INV2 — 宿主化与提升相互独立。** React portal 移动 DOM。原生 Popover 或模态 Dialog API 控制顶层参与和模态边界。
- **INV19 — 渲染器绝不调和层的节点。** 宿主位于渲染器管理的 DOM 内部（一个已声明的受管根，例如 RichTextEditor 的可编辑区域）的层，会把其表面 portal 到该根之外，因此渲染器的调和绝不会遇到外来节点；嵌套在另一层中的层留在该层的根内，而渲染器不会调和该根，即使该根位于受管根内部；在位置上安全的行内层绝不移动；被移动的包装器镜像宿主的 `dir`。受管根声明是内部的：不导出，也不作为 prop。（所有者决定，2026 年 11 月 6 日（Cindy）。）
- **INV3 — 定位模式互不泄漏。** 锚点模式拥有逻辑放置、回退和视口内缩；custom 模式拥有其几何；fixed 模式拥有显式坐标。
- **INV4 — 共享锚点可组合。** 一个层添加或移除其锚点名，不会覆盖属于兄弟层的名称。
- **INV5 — 逻辑放置保持方向感知。** 标准锚定放置派生自表面继承的书写方向，并在回退翻转后保留间隙。
- **INV6 — 原生关闭调和只触发一次。** 程序化隐藏与浏览器关闭不会重复触发状态或 `onHide` 更新。
- **INV7 — 现有的原生轻量关闭防护会识别手势。** 关闭层的按压不能从它为其打开的触发器重新打开它；对同一层另一触发器的按压可以显示它，并锚定到该触发器：同一手势中来自另一触发器的显示会把层移动到该触发器；菜单悬停还会抑制由暴露引起的悬停。一根手指的触摸起始于打开的轻量关闭 popover 之外，并移动了共享平移距离，则属于手势，而不是外部按压，即使浏览器把它读作点按；外部的点按仍会关闭。锚定的菜单则在平移开始时关闭（`spec:AST-094` FR32）。
- **INV7a — 释放不会关闭它所打开的层。** 当某次按压的释放正在被处理时被要求显示的轻量关闭层，不会因该释放而关闭：它在该释放的轻量关闭之后显示，在按压的 click 时，或在没有 click 时的下一个任务；并保持为原生 `auto` popover。它的下一次手势会照常关闭它。按下即打开的按压会通过 `claimPress` 保留其释放；该释放随后是否关闭它，由打开它的组件决定。若某次触摸释放的 `touchend` 被菜单的按压模型取消，就不会带来轻量关闭，因此它的显示不被挂起，而是在事件内部运行：当 `utils/clickGuard.ts` 准备取消某次触摸的 `touchend` 时，它会在 `utils/touchEndMark.ts` 中标记该触摸，释放计数器（`isReleaseInFlight`）会读取该标记，因此 `isReleaseInFlight` 不会挂起它的显示。该标记位于自己的模块中，因此 click guard 与 gesture counter 都不会导入对方，两个入口也不会引入对方的代码。
- **INV8 — 当前 Escape 传递遵循已注册的层。** 共享栈按当前的深度、包含关系和稳定注册顺序，使用在场的 `close` 与 `block` 条目。
- **INV9 — 外部通道仍由组件拥有。** 当前的背景、指针、触摸、悬停／焦点和滑动处理器通过其所属组件或浏览器机制起作用，而不是一个共享的分支操作。它们唯一共享的事实是 `Layer/outsidePress.ts` 中外部关闭的每文档计数：模态背景按压会读取它，因此关闭宿主之上某层的按压不会同时关闭宿主（`family:overlay-dismissal` FR11）。
- **INV10 — LayerProvider 是配置，不是通用的层宿主。** 它承载 Toast 配置和应用声明的视口内缩。仅 LayerProvider 本身不渲染空的视口；Toast 在被导入时注册其视口。与触发器关联的层在其 JSX 位置附近独立解析，与 provider 无关；内缩作为每个层自身携带的上下文值到达它们，绝不通过 provider 解析放置来传递，而没有 provider 的层与带有默认内缩的 provider 下的层渲染一致。
- **INV11 — 单一视口间隙。** 间隙、视口上限和应用声明的内缩在运行时中只有一处定义；每个锚点模式的层都继承它们，层盒子绝不超出上限，toast 视口读取同一内缩，任何使用方都不定义自己的值，没有任何尺寸被限制为触发器旁边的跨度，例外是同一查询的后续列表会把打开的 Typeahead 弹层留在原侧，并只在那一侧的空间内增长它（`spec:AST-092` FR6）；查询的第一次列表会正常放置它，使用方的最小值会被运行时的上限夹紧。软件键盘的上限是这些上限之一（`spec:AST-059` FR9）。当软件键盘覆盖视口底部时，块向末端边缘会伸到其下的锚点模式层会保持其块向起始边缘，并在键盘上方 10 px 处结束。键盘高度是键盘模块的唯一高度（`architecture:react-component-runtime` INV11）。每个层都在自己的元素上携带自己的键盘上限，并折入其块轴上限，因此在有上限的层内部打开的层绝不会被其宿主施加该上限。除了上限之外，每个层还携带其表面在其下承受的溢出，因此读取它的表面会从上限落定的那一帧起滚动，其内容也绝不会绘制到有上限的盒子之外。键盘触及不到的层、放置在触发器上方的层，以及处于 custom 或 fixed 模式的层保持原样。读取键盘内缩且在报告有键盘时被放置的层会保持其顶部直到关闭：当上限解除时它在原地向下增长；当键盘升起时它向上移到键盘上方，然后保持。
- **INV12 — 第一帧就是落定的帧。** 层视口几何的任何输入都不会在绘制后测量再应用，只有两个例外。运行时观察每个层的锚点可见性，并且，对于保持锚点清空的层，观察它是否覆盖其锚点或离开视口；每一项都在首次绘制之前读取，并在层打开期间由在帧绘制之前运行的回调读取。第一个例外是滚动停止后的检查（`spec:AST-059` DEC-8）：一旦页面或锚点的某个滚动祖先的滚动停止（`scrollend`，或在缺少 `scrollend` 时 150 ms 无 `scroll` 事件），层会在停止后绘制的第一帧中被检查一次，若失败则重新放置。没有任何滚动帧或滚动处理器检查盒子、重新选择或为层强制布局，层的列表也没有任何选项与其锚点重叠，因此滚动期间绘制的帧可能显示层越过视口边缘，但绝不会覆盖其锚点。第二个例外是软件键盘的上限（`spec:AST-059` FR10）。盒子的高度无法在合成器上改变，因此上限在每次键盘移动时改变一次：当升起的键盘到达时，当下降的键盘开始下移时立即发生，对于移动但不改变尺寸的键盘也立即发生。某次变化若会在进行中的按压之下移动该层，则会等待该按压的 click。上限从层自身不含其入场 transform 的盒子读取。它会在以下时机读取：键盘已升起时打开的层的首次绘制之前；键盘移动时；以及运行时在层打开期间换入的层元素的首次绘制之前。除此之外，层绝不会在它即将纠正的几何上绘制，运行时也不轮询任何东西。
- **INV13 — 每个关闭中的层只有一个退出副本。** 层的关闭最多在一个退出副本上播放，该副本由 `placeLayerExitCopy` 生成：绘制在层原先绘制的位置，惰性，对辅助技术隐藏，不带 id、表单名或表单所有者，只在顶层显示，并由其所有者在关闭落定后移除。为同一层放置第二个副本会移除第一个；另一层的副本保留。
- **INV14 — 运行时拥有每个层共享的机制。** 在内部，层运行时拥有层所使用的共享机制：顶层挂载、关闭请求传递、呈现保持（从打开直到关闭落定期间保持层选定的呈现）、唯一的共享退出副本（`architecture:component-style-authoring` INV7 所指的单一 Core 机制），以及用 `::backdrop` 绘制的背景着色。需要其中之一的组件应使用运行时的实现，而不是自建。每个组件仍决定何时关闭、如何宿主化以及如何呈现，包括背景遮罩的颜色和所有其他视觉处理（INV9；`family:overlay-dismissal` AV3、AV4、AV6；`spec:AST-003` FR10）。运行时的公共导出保持不变。
- **INV15 — 单一抬升模块，按表面选择启用。** 从触发器抬升的呈现位于一个独立于层运行时的内部模块：从触发器抬升，使用真实触发器或克隆（以能把动画留在合成器上的那个为准）（`spec:AST-094` FR5）；通过共享矩形变形（从一只矩形到另一只矩形的单一 Core 动画）从触发器的矩形增长；以及通过运行时的退出副本播放的退出（INV14）。触发器的克隆是 `architecture:component-style-authoring` INV7 允许的唯一临时副本：惰性，对辅助技术隐藏，并在抬升落定后移除。表面选择启用；任何执行抬升的表面都使用此模块，而绝不使用自己的副本，不抬升的层也不使用它。它是内部的且不导出（`spec:AST-017` FR21）。
- **INV16 — 运行时拥有唯一的输入保持。** 层运行时拥有共享的输入保持 `holdInput`（`Layer/inputHold.ts`），它在层的呈现于手指之下运行时把输入挡在层外。通过 CSS 进入的层（Dialog、Drawer、MobileNav、DropdownMenu）通过 `holdEntranceInput`（`Layer/holdEntranceInput.ts`）获取它。当层进行呈现时（`spec:AST-094` FR35），该保持只接管指针输入：一个护盾会捕获点按与按压，捏合仍能缩放页面，按键与辅助技术保持可用。当层关闭时，该保持还会使层的内容惰性。组件记录可以改为通过该保持的 `focus: 'kept-inside'`，让仍然持有焦点的内容保持活跃：该保持让页面保持活跃（无视口护盾，也无窗口按压保持，层会放行所有指针），在焦点留在内容内部期间让内容保持暴露，除了 Tab 之外没有 click 也没有按键能到达它，并在焦点离开或焦点原本不在内部时使层本身 `inert` 与 `aria-hidden`。独立的 BottomSheet 的退出会采用此保持（`component:BottomSheet` FR9）。`focus: 'blur'` 保持是默认值，它保留护盾并立即让内容惰性，正如正在离开的 AlertDialog（`component:AlertDialog` FR7）和正在关闭的 BottomSheetSwitcher 步骤（`component:BottomSheet` FR9）为其关闭所做的那样。组件仍决定焦点返回何处。持有输入的组件使用此保持，而不是自建。它与 INV14 的呈现保持相互独立，后者保持层选定的呈现。
- **INV17 — 层内部的 click 在层根处停止。** 起始于层根内部（两个 `useLayer` 渲染器，以及 Dialog、Drawer、Lightbox、MobileNav、BottomSheetPanel 和 ToastViewport 的内容根）的指针、鼠标、触摸或 click 事件会先运行层内部的处理器，然后停止沿 React 树传播：层 JSX 位置的祖先上的任何冒泡阶段处理器都不会收到它，包括调用方自己的元素。祖先的捕获阶段处理器在停止之前运行，仍会收到它。嵌套的层在其自己的根处停止。原生事件不会被停止，因此 document 和 window 监听器以及轻量关闭仍会收到它。键盘、焦点、input、滚轮和拖拽事件不在范围内。
- **INV18 — 只有已显示层的触发器才是锚点。** 触发器只在其层显示期间携带其 CSS 锚点名；关闭的触发器不是锚点，因此围绕它移动的表面能让其 transform 动画留在主线程之外。通过为关闭状态声明的 CSS 过渡或关键帧动画向外动画的层，在这些动画结束之前都算作已显示；脚本启动的动画不被跟踪。
- **INV20 — 入场从层落点所在一侧开始。** 锚定层的共享入场（`layerAnimations`）从它在任何翻转后落点所在一侧滑入，并以该侧为中心缩放。因此它绝不会滑到其触发器上。它以层与触发器相接的点为缩放中心：朝向触发器的边缘，位于触发器的中心线上。覆盖触发器中心的层没有侧边：其入场以该中心为缩放中心，且不滑动。让层留在原位的显示会在其唯一一次测量过程中读取该侧。Popover 的触摸增长从同一点开始。它越过触发器中心时没有可沿其拉长的侧边，因此只做缩放。

- **INV21 — 脚本绝不为跟随锚点而移动层。** 锚定层只通过 CSS 锚点定位跟随其锚点；没有任何脚本会从测量出的矩形写入层的位置来让它留在锚点上。fixed 模式的一次性坐标、一次性的入场或退出 transform、软件键盘的抬升，以及缩减后的浏览器回退都不跟随锚点（`spec:AST-059` DEC-9）。

- **INV22 — 层绝不继承其触发器的按压 transform。** 按压反馈只缩放触发器自身的视觉；层渲染在该缩放子树之外，并锚定到触发器未变换的盒子（`spec:AST-059` DEC-10）。

本记录不把未来的合格所有者、分支关联、全局宿主或浏览器支持要求变为当前要求。它不拥有组件焦点进入或返回、模态语义、通道准入策略、公共受控／非受控 API、视觉处理或主题剖析。

## Current gaps and accepted change

当前缺口是可观察的事实，不是当前的目标行为：

- 公共 `useLayer({lightDismiss: true})` 的调用方不会获得外部平移声明；基于 Popover 的层则会获得（INV7）。
- 调用方自己的 Popover 若内容带有 `role="menu"`，仍保留外部平移声明，因为层无法看到其内容（INV7）。
- 在释放时执行轻关闭的浏览器中，当某个控件自身的拖动始于 Popover 之外、并结束于其外时，Popover 会关闭（INV7）。
- Tooltip 目前会在关联的 Popover、菜单或 Dialog 之前消费 Escape，而不是充当被动信息。
- 当前没有区分活动、阻塞、被动和仅视觉这几种注册角色。
- 外部交互无法通过共享基础设施解析整个关联的菜单/子菜单分支或嵌套的子分支。
- 背景遮罩、手动外部、触摸和滑动这几条路径并不共享现有的手势声明或同一套关联模型。
- Toast 的根宿主与回退宿主仍排在其他原生模态之后：Lightbox 和 MobileNav。
- 降级浏览器回退方案没有被记录为不等价。
- 现有测试模拟 Popover 的 `toggle` 和 DOM 嵌套；它们无法证明受支持浏览器中的原生指针轻关闭、顶层/模态排序、真实锚点几何、SSR 解析器修复或嵌套 portal 行为。

`spec:AST-003` 是已接受但尚未实现的变更，负责这些缺口的各项要求、迁移、验证和完成标准。只有当该项工作交付时，才应更新本记录。

`spec:AST-003` 不涵盖 INV21 或 INV22；它们由 `spec:AST-059` 的 DEC-9 和 DEC-10 管辖。它也不涵盖 INV7 的缺口。

INV14 和 INV15 尚未满足，`spec:AST-003` 也不涵盖它们。运行时拥有共享的退出副本（INV13，`placeLayerExitCopy`）和共享的呈现保持（`Layer/presentationHold.ts`），Popover 将其用于 sheet 演示和锚定演示；目前不存在运行时的背景着色或上浮模块，而 Dialog、Drawer、BottomSheet、Lightbox、MobileNav、ToastViewport 和 Selector 各自构建自己的顶层挂载、退出、背景或呈现保持。BottomSheet 自身的实现则包含其 sheet 栈的挂载——让文档中的各个 sheet 保持打开顺序的重新显示、让步骤对话框的模态保持存在，以及非模态 sheet 的 popover 宿主——再加上它的遮罩；上述排序规则属于该栈，它们之下的挂载则属于这个缺口。

INV17 通过单一接缝 `Layer/layerClickBoundary.ts` 得到满足，每个列出的根都会将该接缝展开到自身；BottomSheetPanel 的根是承载它的 BottomSheet 对话框，因此 BottomSheetSwitcher 在那里转发的处理程序仍会接收到对 sheet 内容的按压（`component:BottomSheetSwitcher` FR9）；Dialog 的内联渲染模式不叠加任何层，也不是层根。各组件自己的 Tooltip 和 HoverCard 防护（`component:Tooltip` FR11、`component:HoverCard` FR11）仍与它并存，直到被移除。兼容性：所有者于 2026-11-01 裁定，对于没有已发布记录覆盖的每个调用方，该边界作为补丁 `[fix]` 发布（`spec:AST-017` FR5 的修复类别）：没有任何记录承诺层内部的按压会到达层的 JSX 祖先，而需要这些按压的处理程序应放在层内容上。唯一已发布的承诺是 `component:SelectableCard` FR2，其调用方 `onClick` 也会对不切换的点击运行，包括在打开的 Tooltip 或 HoverCard 表面内部的点击。在下一个次版本之前，SelectableCard 通过卡根上的捕获阶段处理程序，对始于卡内某个层内部的点击调用调用方的 `onClick`，从而继续保持该承诺，因此它先于层自身的处理程序运行；该变更被暂定为 `[breaking]`（`spec:AST-017` FR32），并由 `component:SelectableCard` `CLN-0026` 移除该处理程序。

Tooltip、HoverCard 和 ContextMenu 的入场布局是一个性能缺口。它们在锚定层本身上播放入场效果。Tooltip 和 HoverCard 的层就是它们的主题表面：它携带主题类以及调用方的 `xstyle`、`className` 和 `style`。每当锚定元素自身的样式发生变化，Chromium 都会重新布局该元素。在每帧都有工作的页面上，它们 150 ms 入场中的每一帧因此会执行两到四次布局。一次 Tooltip 入场大约会执行 14 到 18 次布局。播放 `layerAnimations` 的其他组件会在层内部的表面上播放，并且播放期间不执行布局。

## Change coupling

- 对 `useLayer` 宿主托管或生命周期的更改，需要验证安全的内联放置、纠正性 portal、宿主迁移、显示/隐藏协调、主题继承、书写上下文和降级浏览器行为。
- 定位更改需要验证 LTR 和 RTL 下的所有放置/对齐组合、视口边缘回退、翻转后的偏移、共享锚点、自定义模式和固定模式；并在真实 Chromium 中，通过桌面和手机视口下的 `Core/Layer` 视口内边距 stories，验证靠近边缘的显式尺寸、触发器旁放得下和放不下的内容、两侧都放不下的触发器、比视口更宽的层、离开视口或已在视野外的锚点、应用声明的内边距到来或变化，以及首个绘制帧与稳定帧的对比。
- 软件键盘上限更改需要验证上限的时机（升起的键盘到达、下降的键盘、立即变化的键盘，以及层内部正在进行的按压）、在键盘已升起时打开的层的首帧（已设上限且内容被裁剪）、打开期间被替换的层元素、双指缩放，以及它不影响的层：一个避开键盘，一个放置在其触发器上方，另一个处于其他定位方式。
- Popover 生命周期更改需要验证程序化关闭和浏览器关闭、受控状态、临时 invoker 关联，以及同一手势的触发器行为。
- 关闭栈更改在成员资格或 Escape/平台投递发生变化时，会更新 `family:overlay-dismissal`。
- 局部的外部、背景、触摸、悬停或滑动更改会保留所属组件的策略，并验证与嵌套表面的交互。
- 对层内容根或 INV17 接缝的更改会验证：每种根内部的按压都不会到达任何祖先的冒泡阶段处理程序，并且仍会到达文档监听器和轻关闭。
- Toast 宿主更改会保留队列中和可见的 toast、计时器、焦点交接、主题上下文和顺序。
- CommandPalette 宿主更改会保留原生模态、搜索状态、焦点进入/返回，以及受控关闭行为。
- 浏览器回退更改会为原生路径和实际回退更新公共的 `useLayer` 与 Popover 文档及测试。
- 退出副本更改会在可观察之处验证：副本在 jsdom 中的可达性、可访问性和表单排除；它的顶层显示（由脚本触发和通过轻关闭触发）、它在入场中途的位置，以及一个层只保留一个副本——在 jsdom 以及 Chromium 和 WebKit 中；还有被拒绝的显示所需的等待——在 jsdom 以及 Chromium 150 及更高版本中，这些引擎会在另一个 popover 切换期间拒绝显示（Chromium 149 接受它）。

## Owning code

- `Layer/useLayer.tsx` 负责 Popover API 生命周期、状态协调、锚定/固定/自定义渲染、触发器来源，以及当前的同一手势记忆。
- `Layer/layerHost.ts` 负责安全内联与最近纠正性 portal 放置之间的选择。
- `Layer/anchorName.ts` 负责在一个触发器上组合锚点名称。
- `Layer/layerTextReset.stylex.ts` 负责文本基线，`Layer/layerStructureReset.stylex.ts` 负责应用在层内容根上的具名结构性自定义属性重置。
- `Layer/layerViewportInset.stylex.ts` 负责边沟和视口上限；`Layer/layerSlideRules.ts` 负责滑动选项的 `@position-try` 规则，以及锚点避让列表的旁侧和适配规则；`LayerProvider` 通过 `LayerContext` 发布声明的内边距，`Layer/layerInset.ts` 负责层或 toast 视口写在自身以承载该内边距的 `--astryx-layer-inset-*` 属性；`Layer/clampInlineSize.ts` 负责使用方对自身某个尺寸应用的钳制。
- `Layer/useLayerKeyboardClearance.ts` 负责软件键盘对打开的锚定模式层的上限；运行时通过其唯一的触摸模块 `Layer/LayerTouch.ts` 导入它。`Layer/layerKeyboardClearance.ts` 保存避让空间和上限的计算。`Layer/settledBox.ts` 读取层在去掉入场变换后的盒子，用于回退顺序、键盘上限和退出副本。
- `Layer/preserveAnimations.ts` 负责在重新放置的 display 重置过程中保留层及其内容的 CSS 动画和过渡。
- `Layer/gestureCounter.ts` 负责物理指针/按键手势的身份。
- `Layer/layerClickBoundary.ts` 负责 INV17 接缝：即每个层内容根都会展开到自身的 React 树停止，以及 `privateAttributes/layerRoot.stylex.ts` 负责的层根标记。
- 层运行时中的一个共享接缝负责在每个层内容根上执行 INV17 的停止。它只停止沿 React 树的传播。在 React 19 中，React 的 `stopPropagation()` 还会停止原生事件，这会破坏 ContextMenu 的外部 `mousedown`、Typeahead 的待处理点击，以及层的保持打开 `pointerup`，因此该接缝从不停止原生事件。
- `Layer/layerExitCopy.ts` 负责触摸演示关闭时播放的退出副本。
- `Layer/presentationHold.ts` 负责呈现保持：层所选定的呈现方式，从打开一直保持到其关闭稳定为止（INV14）。
- `Layer/inputHold.ts` 负责输入保持，`Layer/holdEntranceInput.ts` 负责通过 CSS 入场的层对它的使用（INV16）。
- `Layer/layerStack.ts`、`Layer/useLayerDismissal.ts` 和 `Layer/LayerDepthContext.tsx` 负责当前的注册、存在、排序，以及 Escape/平台路由。栈、模态出口注册表、手势计数器，以及每个文档的外部按压和 popover 操作记录，都存放在按页唯一的版本化键下，因此页面上的每一份 Core 副本都通过相同的记录进行排序、路由和关闭（`spec:AST-110` FR3）。
- `Popover/usePopover.tsx` 负责焦点陷阱组合，以及 Popover 家族表面的默认原生轻关闭。
- `hooks/useFocusTrap.ts` 将可关闭的陷阱适配到当前的共享注册中；它不负责组件的焦点策略。
- `hooks/useMenuHover.ts` 负责悬停打开的确认、原生 invoker 接线、菜单焦点，以及因暴露而触发的重新悬停抑制。
- `Layer/useTouchTrigger.ts` 负责触摸触发器分类，以及当前针对 Tooltip/HoverCard 的仅触摸外部监听器。
- `Layer/outsidePress.ts` 负责文本字段手动层的外部按压监视（供 BaseTypeahead、DateInput、DateTimeInput 和 ChatComposerInput 的触发器菜单使用），以及模态背景按压所读取的每个文档外部关闭计数（`family:overlay-dismissal` FR11）。
- `DropdownMenuContext` 和 `DropdownMenuSubMenu` 负责当前局部的菜单级联父级关闭链。
- Dialog 家族负责原生模态/背景呈现及其局部通道策略。
- Drawer 负责模态 `showModal()` 和非模态 `showPopover()` 的宿主托管，而共享关闭栈负责 Escape 和平台关闭路由。
- `Layer/toastHost.tsx` 负责 `ToastContext`、Toast 的视口注册，以及 LayerProvider 的出口和 `useToast` 的回退根都会使用的 toast 队列。视口注册存放在按 React 唯一的版本化键下，因此同一个 React 上的每一份 Core 副本都会渲染同一个已注册的视口（`spec:AST-110` FR3）。`LayerProvider`、`useToast` 和 `ToastViewport` 负责当前的通知状态、分发和视口渲染；视口位于提供方在各边声明的内边距处，除非它自己的 `toast.inset` 覆盖该边。
- CommandPalette 负责命令搜索和选择；Dialog 负责其原生模态宿主。
- `family:overlay-dismissal` 负责 Escape/平台关闭的成员资格。`architecture:interaction-modality` 负责最后输入模态。`architecture:public-component-api` 负责公共组件和 hook 契约。`architecture:theme-application` 负责提供方和 portal 的主题上下文。

## Deciding specs

`spec:AST-038` 管辖上文所投影的层内容边界。它不改变此处描述的宿主托管运行时。

`spec:AST-059` 管辖上文所投影的视口内边距：边沟、上限、回退顺序及其锚点可见性条件，以及应用声明的内边距。其 DEC-7 和 DEC-8 管辖锚点避让列表以及滚动停止后的一次检查。

`spec:AST-059` 的 DEC-9 管辖 INV21：脚本绝不移动层来跟随其锚点。其 DEC-10 管辖 INV22：层绝不继承其触发器的按压变换。

`spec:AST-003` 已接受但尚未实现。它定义了已批准的下一版运行时，并且必须在其要求被纳入本当前架构记录之前转为 `shipped`。

## Verification

| 不变式       | 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 失败信号                                                                                                                                                                                                                                       |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1, INV2   | `useLayer.test.tsx` 和 `layerHost.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 无效的 DOM、陈旧的宿主、主题/书写上下文丢失，或将 portal 误认为顶层提升                                                                                                                                                                        |
| INV19        | `layerPortalBoundary.test.ts`、`RichTextEditor.portalHost.test.tsx`，以及 Chromium 和 WebKit 中的 `LayerBoundary.a11y.browser.spec.ts`、`TooltipDecorator.a11y.browser.spec.ts` 和 `DecoratorPortal.a11y.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 被纠正的层，其宿主位于编辑器管理的根内且没有更近的层根，却被渲染在该根内；嵌套层被移出其父层根；本可安全内联的层被移动；被移动的包装器其 `dir` 与宿主不同                                                                                      |
| INV3–INV5    | `useLayer.test.tsx` 和 `anchorName.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 某种模式泄漏几何信息、RTL 从错误的上下文解析、回退被裁剪，或同级锚点丢失                                                                                                                                                                       |
| INV11        | `layerViewportInset.test.ts`、`useLayer.test.tsx`，以及桌面和手机视口下 story play 防护中的 `Core/Layer` 视口内边距 stories；针对 `spec:AST-092` FR6 例外的 `BaseTypeahead.incremental.test.tsx` 和 Typeahead 增量结果 stories                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 第二个边沟定义、以 span 的 `100%` 为上限、层窄于其显式尺寸、层盒宽于视口、层落在边沟内，或层滑向屏幕外的锚点；对于打开的 Typeahead 弹出层，同一查询的后续列表将其翻到另一侧或增长到超出该侧空间，或某个查询的第一个列表被限制为触发器旁的 span |
| INV12        | `Core/Layer` 视口内边距 stories 的首帧比较，以及 `useLayer.test.tsx` 的同步锚点读取；对于滚动停止后的检查，`useLayer.test.tsx` 的 `scrollend` 和 150 ms 回退用例（在停止后的首个绘制帧中检查一次，滚动处理程序中不读取）以及 Tooltip 套件的滚动边缘用例；在 4× CPU 下对一次滚轮滚动的 Chromium 跟踪，该滚动将 Tooltip 的触发器带到滚动边缘，统计 DEC-8 前后每次滚动的强制布局：页面滚动 27–42 → 5，滚动面板 7 → 5，Slider 值气泡 12–22 → 5                                                                                                                                                                                                                                                                                                                                                    | 层的首个绘制矩形与其稳定矩形不同；在滚动帧或滚动处理程序中为层执行盒检查、重新选取或强制布局；在滚动停止后首个绘制帧之前重新选取，或每次停止重新选取超过一次；绘制帧显示本应避开锚点的层压在锚点上                                             |
| INV11, INV12 | 软件键盘的上限：`useLayerKeyboardClearance.test.tsx` 验证其规则、时机、首帧绘制前的读取以及内边距的保持；`PopoverKeyboard`、`keyboardCappedLists` 和 `SelectorKeyboardInset` 浏览器规格验证其渲染几何                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 层延伸到键盘之下，或在键盘并未触及它时仍被设上限；每次键盘移动或按压期间上限变化超过一次；在键盘升起时打开的层其首帧未设上限，或将其内容绘制到盒外；层读取内边距并在键盘报告结束时下移                                                         |
| INV13        | `layerExitCopy.test.ts` 和 `layerExitCopy.interaction.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 副本带有 id、表单名称、表单所有者或指针可达性；副本位于层绘制盒之外；副本在顶层之外；一个层出现第二个副本                                                                                                                                      |
| INV6, INV7   | `useLayer.test.tsx`、`Popover.test.tsx`、`DropdownMenu.test.tsx`、`useMenuHover.test.tsx`、`gestureCounter.test.ts`、`outsidePress.test.ts` 和 `outsidePanClaim.test.ts`；Chromium 中的 `ScheduleEventPopover.a11y.chromium.spec.ts` 和 `ScheduleMonthEventPopover.a11y.chromium.spec.ts` 用于验证一个带多个触发器的 popover：按压另一个触发器会在该处打开它，按压已打开的触发器最终会关闭；Chromium 中的 `LayerPanLightDismiss.interaction.browser.spec.ts` 用于验证：触摸在 Popover 家族（Popover、Selector 的列表）的打开轻关闭 popover 之外平移，以及在基于它构建的锚定菜单（DropdownMenu、TabMenu、Breadcrumbs、TopNav 和 SideNav 菜单）和 ContextMenu 之外平移，包括带与不带 `pointercancel`，并包括浏览器将其读作点击的平移；还用于验证在打开的 Popover 下方拖动的尺寸调整手柄和滑动行 | 重复的关闭回调，或同一次按压/重新悬停重新打开某个表面；按压已打开层的另一个触发器后它仍保持关闭；外部平移会轻关闭打开的 Popover 家族 popover，外部点击却使其保持打开，或 popover 接管了页面控件的拖动                                          |
| INV7a        | `gestureCounter.test.ts`（进行中的释放，`afterRelease`）；`DropdownMenu.test.tsx`：打开带文本字段的 Popover 的行会在事件内聚焦该字段，在手指下（因此屏幕键盘打开）和鼠标点击时都是如此；Chromium 中配合鼠标和手指的 `LayerSamePress.interaction.browser.spec.ts`：DropdownMenu 的行打开 Popover 和 BottomSheet、ContextMenu 的行打开 Popover，以及打开的 Popover 中的行打开嵌套 Popover                                                                                                                                                                                                                                                                                                                                                                                                       | 层被打开它的那次按压关闭、初始焦点等待超过事件、下一次外部按压或 Escape 后层仍打开，或嵌套子层的按压关闭其父层                                                                                                                                 |
| INV8         | `useLayerDismissal.test.tsx`、`layerDismissalInvariants.test.tsx` 和 `useFocusTrap.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 跳过当前最顶层的已注册层、两个层同时关闭，或阻塞者泄漏                                                                                                                                                                                         |
| INV9         | 具有代表性的 Dialog、ContextMenu、Tooltip/HoverCard 和 BottomSheet 源码/测试；`useBackdropPress.test.tsx`；`outsidePress.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前局部通道悄悄改变所有权或策略                                                                                                                                                                                                               |
| INV10        | `LayerProvider.tsx`、`toastHost.tsx`、`LayerProvider.test.tsx`、`toastHost.test.tsx`、`toastHost.lateRegistration.test.tsx`、`useToast.tsx`、`ToastViewport.test.tsx`、`ToastViewport.modalHost.test.tsx` 和 `scripts/layer-toast-bundle.test.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 提供方开始迁移普通层、Toast 回退失去其当前生命周期、默认提供方的渲染与无提供方时不同、导入 Layer 会加载 Toast 模块，或在 Toast 加载之前添加的 toast 丢失                                                                                       |
| INV14, INV15 | 对 Core 的源码边界检查，查找运行时和上浮模块之外的顶层宿主、退出副本、背景元素、上浮和矩形变形代码                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 某个组件自行构建 INV14 所列机制的副本（顶层挂载、关闭请求投递、保持、退出副本或背景元素），或重新实现上浮或增长                                                                                                                                |
| INV16        | `inputHold.test.tsx`（包括其 `'kept-inside'` 关闭用例）、`holdEntranceInput.test.ts`、`inputHold.interaction.browser.spec.ts` 和 `BottomSheetCloseFocus.test.tsx`；Chromium 和 WebKit 中的 Dialog 和 Drawer 触摸入场证明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 组件自行保持输入、演示期间被保持的按键或辅助技术操作、不再缩放的捏合，或关闭时让其内容可被激活、惰性内容仍保持焦点，或内容被设为惰性或失焦而焦点仍留在记录保持其活动的层内，均为失败信号                                                       |
| INV17        | 针对每种层根的一个运行时套件：内联和 portal 的 `useLayer` 层，以及 Dialog、Drawer、Lightbox、MobileNav、BottomSheetPanel 和 ToastViewport 内容根，每个都放在普通的 `onClick` 包装器和 Core 可点击容器内；嵌套层                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 层根内部的点击到达祖先冒泡阶段处理程序（包括调用方的包装器）；外层处理程序接收到内层的按压；或文档监听器或轻关闭不再接收到它                                                                                                                   |
| INV18        | `useLayer.test.tsx`（已关闭的触发器没有 anchor-name，而已显示或淡出层的触发器有）以及 Chromium 和 WebKit 中的 `TooltipClosedTriggerAnchor.interaction.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 已关闭的触发器带有 anchor-name、已显示或淡出的层被放置在远离其锚点的位置，或已关闭触发器周围的表面在主线程繁忙时停止                                                                                                                           |
| INV18        | `useLayer.test.tsx`：声明了离散 `display` 过渡或关键帧动画的关闭状态，会从关闭状态的样式中读取，并在这些动画结束前保留触发器的锚点名称；关闭状态两者都未声明的层，在关闭时不会为其读取动画                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 带有此类关闭状态退出的层在淡出时被放置在远离其锚点的位置，或在关闭状态未声明退出的层关闭时读取了动画                                                                                                                                           |
| INV20        | `layerEntranceSide.test.ts` 和 `popoverSurfaceMotion.test.ts`，它们读取同一张夹具表，以确定侧边和相接点；`layerEntranceSide.test.ts` 还用于验证在尺寸化触发器旁空间处停止的步骤，而对于紧贴或压在其上的层则没有步骤；Chromium 和 WebKit 中的 `LayerEntranceSide.interaction.browser.spec.ts` 用于验证每个发生翻转的锚定层的首帧，以及 Chromium 和 WebKit 中的 `PopoverTouchMotion.interaction.browser.spec.ts`；`useLayer.test.tsx`                                                                                                                                                                                                                                                                                                                                                           |
| INV21        | 对 Core 的源码检查，查找从测量矩形写入层的 `top`、`left`、`inset`、`translate` 或 `transform` 的滚动、尺寸调整、观察器或动画帧处理程序，键盘上浮除外；对带有打开 Popover 的页面滚动进行性能跟踪，统计脚本位置写入                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 滚动期间脚本写入层的位置，或 DEC-9 的四个用途之外的处理程序将层移向其锚点                                                                                                                                                                      |
| INV22        | `LayerPressTransform.interaction.browser.spec.ts`：针对每个从可按压触发器打开的层的浏览器用例（Popover、DropdownMenu、Selector、MultiSelector、ComplexSelector、ContextMenu），分别用鼠标和手指：按压期间和之后，层的矩形、布局盒和计算出的 transform 与未按压时打开的一致；在按压时打开的层其首帧从尚未变换的盒放置；按压自身层已打开的触发器时，触发器保持未缩放。                                                                                                                                                                                                                                                                                                                                                                                                                          | 触发器被按压时，层的矩形、尺寸或计算出的 transform 发生变化                                                                                                                                                                                    |

当前的单元测试覆盖证明了发出的样式、reducer、状态转换和 DOM 放置。原生 Popover、`<dialog>`、焦点、顶层排序和渲染后的锚点几何在发生更改时，需要真实 Chromium 和 WebKit 的证据。边沟的设备安全区域项无法在 Chromium 模拟中复现；它要在设备上验证。
