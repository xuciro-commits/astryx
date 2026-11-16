# 屏幕键盘

Core 中屏幕键盘的唯一来源（`spec:AST-099`、`architecture:react-component-runtime` INV11），以及据此为动效计时的键盘布局指南。这里的一切都只属于 `@astryxdesign/core` 内部：组件从其定义文件导入，例如 `../keyboard/keyboardHeight`，包入口不导出任何内容。

## 键盘模块（`keyboardHeight.ts`）

- **高度（FR2）：** `measureKeyboardHeight(window)` 等于布局视口高度减去视觉视口高度乘以其缩放比例，单位为 CSS px。页面的平移不代表键盘变小，双指缩放也不代表键盘。布局视口的高度由 `layoutViewportHeight(window)` 提供（`../utils/layoutViewport.ts`），在所有引擎中都以布局 px 表示：WebKit 上报的 `innerHeight` 和 `innerWidth` 使用缩放后视觉视口的 px，可通过 `innerWidth` 是否与视觉视口宽度一致来区分。经典水平滚动条会被 `innerHeight` 计入而视觉视口不计，这里将其扣除，因此桌面页面若比窗口更宽，读到的键盘高度为 0。BottomSheet 的遮挡检测也读取它。
- **在哪里测量（FR6、FR7、DEC-4）：** 对于具有视觉视口的顶层文档，`isKeyboardMeasurable(window)` 为 true；自带键盘几何 API 的浏览器（`navigator.virtualKeyboard`，Android 上的 Chrome）也包含在内，其视觉视口与其他地方一样会因键盘而收缩。该判断基于能力，绝不基于用户代理或指针类型。桌面浏览器的视觉视口不会因键盘收缩，因此读到 0；在 iframe 内高度为 0。当应用设置 `interactive-widget=resizes-content` 时，Chrome 会随键盘收缩布局视口，因此那里高度也是 0，什么都不会随动：浏览器已经自行处理了内嵌区（FR8）。
- **单一组监听器（FR1、INV11）：** `subscribeKeyboardHeight(window, fn)` 会把每一份上报（视觉视口的 resize 和 scroll、窗口的 resize，以及启用 `{focus: true}` 时的焦点移动；后者的输入流订阅仅在此类订阅者存在时存在）通过每个窗口唯一的一组监听器派发出去，无论有多少组件订阅；`getKeyboardHeight(window)` 则向读取方提供该次上报测得的高度。Core 中没有任何其他代码为键盘而监听视觉视口。
- **焦点（FR4）：** `refuseFocusReveal(document, {claim, park, isActive})` 会让某个表面所主张的每次焦点移动都以 `preventScroll` 执行，且发生在浏览器自身焦点步骤之前的捕获阶段 `blur` 上，因此浏览器永远不会通过滚动文档来显露输入框。如果焦点是移向空无（键盘的“完成”），可以将其暂存，让下一次点击重新成为一次过渡。文档中的每个调用方共享一个监听器，且仅当有调用方存在时才存活；BottomSheet 的 hook 只在粗略主指针下安装它。
- **点击路径（FR4）：** 首次点击是从空无中移动焦点，因此没有 `blur` 来主张它。`claimTapFocus(region, {claim, deliver})` 接管浏览器本会转成焦点的单指点击，取消该点击的默认行为，让点击守卫（utils/clickGuard.ts）接住 Safari 可能仍会发送的鼠标事件，并让 `deliver` 聚焦输入框。`focusAtPoint(field, x, y)` 以 `preventScroll` 聚焦该输入框，并把光标放到手指下方。`deliverTap`（`keyboardTarget.ts`）执行这一操作，并补发一次该点击的 click，因为被取消的点击不会产生 click；模块的各目标与 ChatLayout 的输入区都通过它来交付。`followsKeyboard(win)`（`keyboardTarget.ts`）是这一切的前置条件：顶层文档、视觉视口会因键盘而收缩、且处于粗略主指针下。超过 10 px 的触摸交由浏览器滚动。
- **浏览器自身的显露平移（FR4）：** `watchRevealPan(window, {owns})` 是每个键盘感知表面都会使用的单一构件，用于应对浏览器在键盘上报之后把视觉视口平移到聚焦输入框的行为。表面在每次改变高度的上报时调用 `report()`；在后续的某次上报中，如果自那以后没有触摸、文档滚动或缩放，且该表面拥有的文本输入框持有焦点，`isRevealPan(height)` 就表明视觉视口已经下移，而 `putBack()` 会在不滚动文档的情况下将其平移回去：把固定在报告时视觉视口所在位置的探针（或传入的元素，例如全视口对话框）滚动到视野内。文档中的每个 watch 共享窗口输入流上的一个被动 `touchstart` 订阅，且仅在某个表面处于 watch 状态时存活。BottomSheet 的 hook 在其面板于粗略主指针下展示期间进行 watch；在精细指针下则不注册任何触摸监听器。`watchPans(win, owns)`（`keyboardTarget.ts`）在模块上报的每个高度上运行该循环：键盘目标与 ChatLayout 的输入区都用它来 watch。
- **键盘目标（`keyboardTarget.ts`）：** 目标会让其内部的聚焦输入框保持在键盘上方，并通过注册使内部的输入框自身不再移动任何东西（`registerKeyboardTarget`、`isInsideKeyboardTarget`）。`followKeyboard(target, {move, offset})` 是一个不移动任何内嵌区的目标：`'ride'` 让目标随键盘移动——若指南发布了键盘自身的滑动，则跟随该滑动；否则在每次上报时移动；`'reveal'` 则在目标（一个滚动容器）内把输入框滚动到合适位置。显露发生在键盘高度变化或焦点移动时，因此平移或滚动会让输入框留在使用者放置的位置。`keepFieldAboveKeyboard(field)` 是输入框自身的路径。输入框获得焦点时，会从最近的 fixed 定位祖先（`fixedContainerOf`）判断自己的位置。若该容器由布局停靠在视口底边且没有任何 transform，它会向上移动键盘仍然覆盖的那部分；若容器比键盘上方的空间更高（例如全高抽屉），则永远不会整体随动其全部重叠部分：此时其中的滚动容器会显露输入框；若没有滚动容器，则只随动到聚焦输入框恰好脱离键盘所需的距离，因此靠近顶部的输入框仍留在屏幕上。在填满视口的 fixed 容器中，输入框所在的滚动容器会显露它。在滚动内容中，输入框最近的滚动容器（包括文档）会从两端将其带入视野（`distanceIntoBand`，与 Tall 面板的显露共用），在键盘显示时保持在键盘上方 `FIELD_OFFSET`（10 px）处。其他任何东西都不移动。滚动容器目前不会在末端获得缺失的滚动范围（`spec:AST-099` Gap 11），因此无法滚动到足够远的输入框会有一部分被遮挡；而尚无可滚动内容的元素（包括文档）不算滚动容器：那里仍由浏览器自身的显露机制处理。在由应用定位的 fixed 容器中（填满视口、浮在底边之上，或设置了自己的 `translate`——随动会替换它），输入框与容器之间的滚动容器会显露输入框。在键盘目标内部，或在此类容器中且输入框周围没有滚动容器时，该路径什么都不做，浏览器自身的显露保持原样。随动会在每次上报、滑动或焦点移动后的下一帧放置目标，且在该事件的所有监听器执行完毕之后；并在应用自身做出任何移动后，测量键盘仍然覆盖的部分：应用已经随键盘移动的横条不再移动，应用抬升了一部分的横条则移动剩余部分，而应用当时正自行移动的横条（其位置上正在运行的 CSS transition 或 animation）则留给应用处理；脚本动画不会被感知，因此通过脚本移动横条的应用需用自己的 `translate` 使其避开键盘。随动写入 CSS `translate`，它会叠加到应用的 `transform` 上；对从未移动过的元素不写入，对应用的元素仅在该元素保持停靠时写入。Core 宿主的随动会移动自己的元素，并让其聚焦输入框保持在键盘上方 `offset` 处。目标仅在内部有输入框聚焦时抬升，焦点离开后便降回；一次随动只移动一个目标。在路径放置输入框的位置，焦点移动与首次点击都不会触发浏览器显露；被主张的点击会在之后向输入框补发该点击的 click，即一个合成的触摸 `PointerEvent`（不存在时则用 `MouseEvent`），因此调用方的 `onClick` 仍会执行一次。浏览器在上报之后自行做出的平移（例如脚本调用 `focus()` 而无人主张之后），会被放回（`watchRevealPan`）。
- **表面 hook（FR4、FR5）：** `useMobileKeyboard(targetRef, options)`（`useMobileKeyboard.ts`）让目标中的聚焦输入框保持在键盘上方。BottomSheet 传入其面板及 `{move: 'ride', inset: true}`，并以建议的间隙作为 `offset`，且仅在展示 Tall 面板时启用。内嵌区放在面板滚动区域（即其 body，由 `useScrollableArea` 标记）的末尾。该 hook 为完全展开的面板提供键盘滚动范围，主张进入其中的焦点移动，并在页面锁定时恢复文档滚动。它通过 `useAttachment` 挂载。它返回键盘在 body 内容末尾占据的内嵌区，以及 `dismiss`——BottomSheet 在开始拖动面板的手势中调用它。hook 自身会在目标关闭时收起键盘。面板通过函数式样式（FR3）把内嵌区排在内容盒的子元素之后，并在显露滚动进入之前提交。在粗略主指针下，如果指南发布了键盘自身的滑动（Android 上 Chrome 中的 Gboard），面板会随动它（FR8）。展示期间的显露会立即滚动 body。在同一次提交中，它设置内容盒，使输入框位于键盘顶部上方 4 px，随后内容盒随动展示曲线余下的部分。隐藏过程中内嵌区保留，内容盒随动下降到 body 滚动停歇的位置。静止时，内嵌区落下、滚动被恢复、translate 清空，这些都在一次提交中完成。繁忙页面会在滑动结束后才读到 Chrome 关于键盘消失的上报。在此之前，内容盒停留在滑动结束的位置，随后该上报提交。在精细指针下，随动的任何部分都不挂载：没有指南订阅，内嵌区只跟随上报。没有 VirtualKeyboard API 的浏览器（iOS Safari、Android 上的 Firefox）不发布滑动：iOS Safari 在失焦后约半秒、键盘落下后才上报键盘消失。在那里，粗略指针下，使键盘落下的失焦会在 UIKit 的键盘弹簧（`KEYBOARD_SPRING`）上，自失焦起把内容盒随动到 body 滚动停歇的位置，同时内嵌区保留。随后该上报在一次提交中落下内嵌区并恢复滚动与 translate，因此没有任何东西移动。若键盘消失的上报发生时没有正在进行的随动（例如向下收起之后），内容会在同一弹簧上滑回其位置。在键盘落下之前获得焦点的输入框会随键盘回升。焦点移到 select 不会启动随动：iOS 会把 select 的选择器放在键盘原来的位置。焦点移入打开的 shadow root 内的输入框，或移入 frame 或自定义元素中页面无法看到的输入框，也不会启动。打开的 shadow root 内的普通控件会像任何控件一样随动。Android 上的 Firefox 走同一路径，但只在结束时上报一次隐藏，内容在该次上报时移动（AST-099 Gap 12）。Safari 与 Firefox 的显露行为不变。
- **键盘消失时：** body 的滚动会回到键盘弹起时的位置，范围以落下内嵌区后剩余的范围为限。保持焦点的输入框（例如 iOS 向下收起键盘之后）随后会被带入 body 的视野。若该次收起让附件栏仍然留在上方，视觉视口不会增长到全高：视觉视口一增长就恢复滚动，同时较低的输入框仍会避开该栏。

## 随动键盘

布局跟随高度（FR3），通过对你自己元素使用函数式样式实现，因此即使没有动画在运行也是正确的；对于停靠在底部的元素，`lift = height > 0 ? max(0, restingBottom − (innerHeight − height)) : 0`。随键盘的动画是可选的额外润色，由指南计时：

```ts
const guide = getKeyboardLayoutGuide(window);
const unsubscribe = guide.subscribe(t => {
  rideKeyboard(animator, {y: layoutLift - lift(t.to)}, t);
});
```

每个过渡为 `{kind, from, to, start, velocity, animated, predicted, curve}`：高度以 CSS px 表示，`start` 在文档时间线上（对于 Chrome 上报的滑动，回溯到 Gboard 的起始时间；对于失焦后才开始的隐藏，则略微提前），以及键盘移动所依据的曲线：`curve`，Android 上 Chrome 中 Gboard 的滑动，只提供数值、没有 motion role（architecture:react-component-runtime INV11）。`rideKeyboard` 会从 `start` 起在该曲线上于合成器上移动你的元素。若过渡没有动画，或调用时其滑动已经结束，则立即落位。随动结束后把 translate 交还给布局（BottomSheet 的 hook 会在静止时的一次提交中完成）。在减弱动态效果下，没有任何东西随键盘移动（design:reduced-motion）：动画器的默认行为在触摸屏上交叉淡化，否则立即移动。`presentation(time)` 给出任意时刻呈现的高度，供在键盘移动期间出现的内容使用。

## 页面看到什么

- Safari 通过滚动整个页面来显露聚焦输入框，因此自行把内容保持在键盘上方的布局会用 `preventScroll`（`refuseFocusReveal`）来聚焦其输入框。
- Android 上的 Firefox 在键盘弹起后上报一次，并在 54 到 143 ms 后把视觉视口平移到仍被键盘覆盖的聚焦输入框。因此 BottomSheet 在该上报自身的事件中显露，而当浏览器在上报后已平移到输入框（`watchRevealPan`），它会用自己的滚动容器让输入框落位，让正在进行的平滑显露完成落位，然后才把对话框顶部滚回视野；无法带出的输入框保留浏览器的显露。之后的每次显露都在上报的帧内立即落位。在浏览器首次平移之前，面板保持平滑显露。
- Android 上的 Chrome（Gboard）会以键盘的整个高度，自行动画平移到仍被键盘覆盖的聚焦输入框。Chrome 124 中约在上报后 150 ms 开始，Chrome 133 中在上报后 100 到 170 ms 开始。在该平移结束之前页面得不到任何帧，因此 `watchRevealPan` 在此时将其放回。Tall 面板会在上报自身的提交中把输入框置于键盘顶部上方 4 px，因此 Chrome 检查时输入框永远不会被覆盖。Chromium 158 在输入框仍被覆盖时会以同样方式平移，位移 312 px，面板的显露在下一帧发生。

## 页面看到什么（Chromium 158 搭配 Gboard，Android 15）

在模拟器上逐帧测量，页面在每次上报时绘制一个标记，并从每个录制的帧中读取 Gboard 的顶部位置（`../motion/android/keyboard.ts` 包含这些数值及其来源）。指南在具有 VirtualKeyboard API 的浏览器中读取这些上报（`keyboardProfileOf`），键盘模块则像在所有浏览器中一样从视觉视口测量它们（`spec:AST-099` FR8、DEC-4）。

- 显示：Gboard 在大约 267 ms 内从页面上方滑入。Chrome 对视觉视口的唯一一次 `resize` 在滑动开始后不久到来：其首个绘制帧比 Gboard 首个移动帧晚 14 到 35 ms。指南把显示的起始时间按 `androidKeyboard.showReportLagMs` 回溯，并随动 Gboard 的显示曲线，在滑动当前位置接入，因此随动的内容会保持在键盘上方，而不是直到上报前都被覆盖。
- 隐藏：Gboard 在失焦后约 `androidKeyboard.hideAfterBlurMs` 开始下落，约 167 ms 后离开；`resize` 在滑动中途到来。指南在失焦时开始隐藏，并以 `resize` 作为确认。繁忙页面会在滑动结束后才读到该 `resize`。在键盘消失的上报到来之前，部分下落或仍然弹起的上报都不会启动任何东西。重新回来的焦点仍会使隐藏转向。位于 frame、打开的 shadow 宿主或自定义元素中的焦点（指南无法看到其输入框）交给视口决定。没有任何预测的隐藏（Back，它保留焦点）从其上报开始随动，起始时间按 `hideReportLagMs` 回溯，该延迟是在失焦上测得的。Chrome 可能在滑动较晚时才上报 Back，因此在 Back 上，内容会比键盘更晚开始下落。
- 在“移除动画”（`prefers-reduced-motion: reduce`）下，Chrome 会分步上报隐藏：先是仍在弹起的较矮键盘，然后是没有。在那里，键盘模块会保持这样的步骤并继续上报显示高度。上报没有、上报重新弹起，或 300 ms 内没有新的高度，都会结束保持，且最多持续 1 s。平移上报相同高度时保持不变。因此每个读取方只在键盘消失后布局一次，其减弱动态效果交叉淡化只播放一次。
- 当焦点通过不会唤起键盘的东西（例如 popover 的容器）从一个输入框移到另一个时，Chrome 会在约 50 ms 内先上报键盘消失再上报回来。若上报隐藏时，不到 150 ms 前获得焦点的输入框仍持有焦点，则等待该移动稳定。
- 对带 `overlaysContent` 的 `navigator.virtualKeyboard`（键盘自身的几何信息）进行了测量，但未采用：在 12 次显示中，其 `geometrychange` 在 Gboard 开始后 0 到 67 ms 才被绘制（视觉视口为 14 到 35 ms）；在聚焦时设置，它在 12 次显示中有 4 次未能显示键盘（在触摸落下时设置为 24 次中 1 次）；并且它会在键盘所在帧隐藏 Chromium 的底部工具栏（布局增加 56 px）。

## 使用方

- BottomSheet（`BottomSheet/BottomSheetPanel.tsx`）：使用 `useMobileKeyboard`，其内嵌区由内容盒的 `keyboardInset` 函数式样式排为内容的最后一个盒子（位于其自身子元素之后，因此在 Firefox 中也会增加滚动范围——Firefox 会让内容盒保持 body 的高度）；它在键盘上报自身的事件中显露聚焦输入框，并在 Chrome 中随动 Gboard 的滑动来移动内容盒（`rideKeyboard`，数据来自指南的过渡）。

## 文件

| 文件                     | 内容                                                                         |
| ------------------------ | ---------------------------------------------------------------------------- |
| `keyboardHeight.ts`      | 键盘模块：高度、监听器、焦点路径。                                           |
| `useMobileKeyboard.ts`   | 让目标中的聚焦输入框保持在键盘上方：内嵌区、显露、随动与收起。               |
| `keyboardTarget.ts`      | 各目标：注册表、停靠或滚动目标，以及输入框自身的路径。                       |
| `revealBand.ts`          | `distanceIntoBand`：把盒子带入某个区带的滚动量，由输入框与面板的显露共用。   |
| `keyboardModel.ts`       | 指南中不依赖时钟的核心：根据键盘上报与焦点变化生成过渡。                     |
| `keyboardLayoutGuide.ts` | 每个窗口一个指南，由键盘模块供给：校验计时器、焦点交接。                     |
| `rideKeyboard.ts`        | 按过渡发布的曲线随键盘移动元素，或立即移动（测试：`rideKeyboard.test.ts`）。 |
| `index.ts`               | 入口。                                                                       |

计时常量位于 `../motion/android/keyboard.ts`（Chrome 搭配 Gboard）。
