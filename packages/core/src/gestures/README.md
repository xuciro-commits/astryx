# 手势

一套带 UIKit 语义的手势识别器系统，用于 Astryx 核心组件的触摸呈现。组件从 `../gestures` 导入它。该包仅从此处导出 `createPanGesture` 及其类型。

UIKit 自始至终是参照标准：相同的识别器状态、相同的冲突规则、相同的阈值（来自 `../motion/uikit/gestures.ts`，每个阈值都有来源，或被标记为等待测量的猜测），以及行为与 `UIControl` 和 `UIScrollView` 一致的触摸处理。本页其余部分说明 Web 在哪些地方不得不有所不同。

## 在组件中使用

```tsx
import {useRef} from 'react';
import {PanGestureRecognizer, useGestureRecognizer} from '../gestures';
function Sheet() {
  const ref = useRef<HTMLDivElement>(null);
  useGestureRecognizer(
    ref,
    () => new PanGestureRecognizer({direction: 'down'}),
    pan => {
      // Runs inside the input event: write the transform, render nothing.
      const element = ref.current;
      if (element == null) return;
      if (pan.state === 'ended') {
        settle(element, pan.translation().y, pan.velocity().y);
      } else {
        element.style.transform = `translateY(${pan.translation().y}px)`;
      }
    },
  );
  return <div ref={ref}>…</div>;
}
```

- 每个组件只创建一次识别器，其身份保持不变，因此创建时建立的关系（`requireToFail`、`recognizeSimultaneouslyWith`）持续有效。
- 监听器通过 ref 读取。每次渲染传入新函数不会附加任何新东西，手势也永远不会触发 React 渲染。
- 识别器在 layout effect 中附加，因此元素的 `touch-action` 会在浏览器看到手指之前设置好。它会跟随 ref 背后的元素：挂载后才渲染的节点，或在同一 ref 背后被替换的节点（例如以 `as` 渲染成另一个元素的触发器），都会在该次提交时被附加。
- 手势进行中设置 `isEnabled: false` 会结束手势而不调用监听器，因为关闭它的处理程序拥有这次结束（Effect 不会产生消费者回调）。想要 UIKit 的 `.cancelled` 的处理程序会自己调用 `recognizer.setEnabled(false)`，后者会立即上报。一个要求它失败的识别器（等待双击的单次点击）会在那次渲染之后不久解决，其监听器照常上报；等待某个识别器（其节点被某次渲染替换）的识别器也是如此。卸载之后，监听器什么也听不到，连卸载所结束手势的取消也听不到。
- `actionGroup: true` 会把元素作为操作组附加，按住并滑动的指针可以划过相邻操作（`family:action-groups` FR5），像每个附加一样、对每种指针都提供服务。更改它会重新附加元素。
- `usePressTracker(ref, options)` 为元素提供 `UIControl` 的触摸跟踪（见下文）。它以相同方式跟随元素，接受 `isBraking`（默认取宿主的值：阻止快速滑动继续的触摸不按下任何东西），并在组件生命周期内保持一个跟踪器：它按当前值读取 `trackingExpansion`、`highlightDelay`、`cancelTravel` 和 `quickTapFlash`（以及 ref 本身），因此即使按下过程中发生变化，也绝不会丢掉进行中的按压。卸载或失去元素既不会调用 `onHighlightChange`，也不会调用 `onControlEvent`；在手指下禁用控件也不会调用它们：按压结束，因此禁用它的处理程序会清除自己的高亮。
- `useFingerScroll(scroller)` 是触摸模块的内部部分，没有公共 API（不在 gestures barrel 中；由滚动驱动的组件导入其模块，因此只在用到的地方打包）。它返回一个读取器，当滚动器的滚动来自手指时返回 `true`：从手指落在其内部时启动的滚动开始，直到其 `scrollend`（惯性仍属于该手指），或者在浏览器不触发 `scrollend` 的地方（26 之前的移动版 Safari），直到其滚动事件安静下来。传入 ref，或传入 document 表示整个页面。`options.onEnd` 在每次此类滚动结束时运行，在读取器返回 `false` 之后；卸载不会调用它。它从 `@astryxdesign/core/internal/touch` 重新导出，供观察手指滚动的 Lab 组件使用。在 React 之外，`fingerScroll.ts` 中的 `watchFingerScrolls(host, scroller)` 和 `isFingerScroll(host, scroller)` 做同样的事；该模块只在有东西被观察时添加被动滚动监听器。

在 React 之外，`getGestureHost(document).attach(element, recognizer)` 做同样的事，并返回一个解绑函数。`getGestureHost(document).fingersDown()` 表示屏幕上有多少根手指（最后一个触摸事件的 `touches`，无论落在哪里）：不得在第二根手指下开始的识别器会在 `shouldBegin` 中检查它，这样两根手指始终归浏览器的捏合缩放。一旦拖拽认领了它的手指，第二根手指就永远不会打断它。

## 识别器

| 识别器                           | UIKit                              | 类型 | 备注                                                                                                                                                                               |
| -------------------------------- | ---------------------------------- | ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TapGestureRecognizer`           | `UITapGestureRecognizer`           | 离散 | `numberOfTapsRequired`、`numberOfTouchesRequired`；移动超过 45 px、出现额外手指、按住超过 1.5 s、下一次点击来得太晚或太远都会失败                                                  |
| `LongPressGestureRecognizer`     | `UILongPressGestureRecognizer`     | 连续 | `minimumPressDuration` 500 ms，`allowableMovement` 10 px（是距离，不是每根轴），`numberOfTapsRequired`；时长设为零时，识别在触摸落下的那一刻就开始（用于一组操作之上的选择跟踪器） |
| `PanGestureRecognizer`           | `UIPanGestureRecognizer`           | 连续 | 最小/最多触摸数，`direction`（轴或单向）配合 `axisRatio`、`lockAxis`、`scrollEdge`、`firstMoveDecides`；`translation()`、`totalTranslation()`、`velocity()`、`scrollVelocity()`    |
| `SwipeGestureRecognizer`         | `UISwipeGestureRecognizer`         | 离散 | 在运动过程中识别；一个或多个方向，`numberOfTouchesRequired`；沿向 50 px，横向最多 50 px，500 ms                                                                                    |
| `PinchGestureRecognizer`         | `UIPinchGestureRecognizer`         | 连续 | `scale`（可设置，用于重新设定基准）、以每秒缩放比表示的 `velocity`、`focalPoint()`                                                                                                 |
| `ScreenEdgePanGestureRecognizer` | `UIScreenEdgePanGestureRecognizer` | 连续 | `edges`：`leading` / `trailing`，按视图的书写方向解析；附加到视图所在的一个边缘区域；一旦触摸落在所有请求的边缘带之外就失败；仅限手指                                              |

每个识别器都在 `kind` 中报告自己是什么（`'tap'`、`'longPress'`、`'pan'`、`'screenEdgePan'`、`'swipe'`、`'pinch'`）：代码据此区分所属家族，绝不使用 `instanceof`（`architecture:react-component-runtime` INV13）。

以 `claimsTouches: false` 创建的识别器是观察者（watcher，例如页面滚动时最小化的标签栏）：它从不认领，因此其元素只得到被动监听器，滚动也从不等待它；它不阻止任何其他识别器，也没有任何识别器阻止它；并且它会跟随被浏览器用于滚动的触摸，直到抬起。它不会给元素推导出的 `touch-action` 增加任何内容。

每个识别器还都有 UIKit 的开关：`isEnabled`（使用 `setEnabled`；手势进行中关闭会取消）、`cancelsTouchesInView`（默认 true）、`delaysTouchesBegan`（默认 false）、`delaysTouchesEnded`（默认 true）、`allowedPointerTypes` 和 `requiresExclusiveTouchType`。

### 平移手势报告什么

平移手势读取数值的方式与 `UIPanGestureRecognizer` 一致，如同在 UIKit 实验室中所测量：

- 当质心在任一轴上移动了 `hysteresis`（10 px）时开始，而不是按欧氏距离计算。一个函数为每次按压提供各自的阈值，在按压的第一次触摸落下时读取。
- `translation()` 不包含阈值消耗的位移：缓慢拖拽在平移开始时读数为零，超出的一步只保留超出部分。被拖拽的表面不会跳动。`totalTranslation()` 是手指落下以来的移动量，供需要它的表面使用。
- `axisRatio`（用于限制在某一轴上的平移）：沿该轴的运动必须超过横向运动的 `axisRatio` 倍才能开始；横向运动超过沿向运动会使平移失败；介于两者之间则等待。
- `velocity()` 是 UIKit 自己的滤波器（见速度）。抬起不会更新这两个数值中的任何一个；静止时间超过静止间隔的手指以 0 释放。

### 状态

```
possible ─► began ─► changed* ─► ended | cancelled     continuous
possible ─► ended                                       discrete ("recognized")
possible ─► failed
```

监听器（UIKit 的 target-action）在 `began`、`changed`、`ended` 和 `cancelled` 时运行。`addTransitionListener` 还会报告 `failed` 以及回到 `possible`。处于终态的识别器会忽略它仍持有的触摸，并在所有这些触摸结束后回到 `possible`。

## 冲突：竞技场

新的触摸会发送到其命中路径上的每个识别器，从最内层开始；每个接受它的识别器会一直跟踪它直到结束。然后：

- **互斥性。** 共享同一触摸的两个识别器永远不会同时活跃，除非其中一个允许（`recognizeSimultaneouslyWith`，或 `shouldRecognizeSimultaneously` 委托）。最先识别的会让其他可能状态的识别器失败。如果某个识别器在冲突识别器活跃时尝试开始，则它自己失败。当两个在相同输入上符合条件时，最内层的获胜。
- **失败要求。** `a.requireToFail(b)` 让 `a` 保持在 `possible`，直到 `b` 失败，然后让 `a` 识别。如果 `b` 识别，`a` 失败。未参与当前触摸的识别器不会拖住任何东西。委托 `shouldRequireFailureOf` 和 `shouldBeRequiredToFailBy` 以动态方式表达同一件事。
- **委托。** 子类上的 `shouldBegin`、`shouldReceiveTouch` 以及 `canPrevent` / `canBePrevented`。竞技场的管道（触摸投递、已批准的转换、待处理的识别）是 `protected`：子类重写 `touches*` 处理程序并设置 `state`，其余部分只由手势系统驱动。

```ts
// Single tap waits for the double tap to fail, as in UIKit.
single.requireToFail(double);
// Inner horizontal scroller yields to the back-swipe in the edge band only:
// the edge pan fails at touch-down anywhere else, so nothing waits.
innerPan.requireToFail(edgePan);
```

## 视图中的触摸：`createPressTracker`

可按下控件的视图级触摸处理，具有 `UIControl` 语义，由 `createPressTracker(options)` 构建：这是一个工厂，正如 `architecture:react-component-runtime` INV13 对识别器家族之外的触摸模块所要求的（`VelocityTracker` 仍是类，这是它唯一列出的例外）：

- `touchDown`、`touchDragInside` / `touchDragOutside`、`touchDragEnter` / `touchDragExit`、`touchUpInside` / `touchUpOutside`、`touchCancel`。
- “Inside” 是控件边界按 `trackingExpansion` 扩展后的范围，因此稍微滑出按钮的指尖仍算在按钮上。
- 高亮在同一帧亮起。在滚动器内部，它会等待 `contentTouchDelay`（`UIScrollView.delaysContentTouches`），因此快速滑动不会绘制任何东西。比该延迟更快的点击会在抬起时显示 `quickTapFlash` 时长的高亮。
- 取走触摸的识别器（`cancelsTouchesInView`），或为滚动而取走触摸的浏览器，会取消按压且不释放。
- 适用 `UIControl` 的 iOS 6 规则：对于落在控件上的触摸，祖先的单指单击不会胜过控件自身的动作。`vetoesAncestorRecognizer` 取代该规则（滑块否决沿其轨道的平移）。

浏览器的 click 仍是控件的激活方式，因此键盘和辅助技术的激活继续有效。

### 按压配置

`PRESS_PROFILES` 保存 UIKit 跟踪按压的两种方式：

- `control`（按钮、开关）：在滚动器之外高亮在同一帧亮起，手指在边界外 70 pt 内仍被跟踪，释放沿用列表的取消选择时钟，正如每个表面在控件运行自己的时钟之前所做的那样（UIButton 为 0.25 s）；
- `cell`（表格或集合行）：在滚动视图内高亮等待内容触摸延迟，在滚动视图外立即亮起（`spec:AST-094` FR11），移动超过平移迟滞后永久取消按压，更快的点击在抬起时高亮并直接进入释放，释放采用列表的取消选择时钟。

文档按压控制器（`utils/pressFeedback.ts`）为它跟踪的按压写入 `data-astryx-press`，操作组跟踪器（`hooks/actionGroupTracker.ts`）自己写入其组的按压。

### 行和卡片

一千行的列表无法承担每行一个 hook 和四个监听器的开销。文档按压控制器（`utils/pressFeedback.ts`）会按压每次触摸下最内层且已启用的 `[data-astryx-pressable]` 并绘制它，每行没有监听器；阻止手指已启动的滚动的触摸不会按压任何东西。

## 告知浏览器的内容

- **触控笔。** 触控笔像手指一样驱动每个识别器和按压跟踪器：它可以平移、点击和长按；在其按住会做某事的场景中，它的按住会像手指一样保持文本不被选中（FR41）；它的笔杆按钮是上下文单击，不会启动按压；捏合绝不会把触控笔和手指混在一起；屏幕边缘平移仅限手指，会忽略触控笔（FR43）。
- **对每种指针。** 识别器和按压跟踪器同样为鼠标、触控笔和手指附加（`spec:AST-094` FR43、FR19）。当主指针为粗指针（`TOUCH_QUERY`，`../utils/coarsePointer.ts`）时，只要有已启用的东西可能接收触摸，宿主就会监听。当主指针为细指针时，每个使用手势的元素保留一个被动 `pointerdown` 监听器（而认领移动手指的识别器还保留其阻塞式 `touchmove`，FR24 将其计在该预算之外，FR19），页面则没有：元素上的按压（鼠标主键、触控笔，或手指——其 `pointerdown` 早于 `touchstart`）会添加宿主的 document 和 window 监听器，一旦该按压的接触结束且竞技场已对其作出决定（等待双击的点击会在该等待结束时移除），或在按压期间窗口失焦时移除（FR24）。最后一次解绑之后，宿主不保留任何东西：没有监听器、记录、帧或计时器。以 `keepsTouch` 创建的按压跟踪器只在此类按压期间获得其阻塞式 `touchmove`；在主指针为粗指针的地方会一直保留它，因为 Safari 只在触摸开始前注册的情况下才遵守阻塞式监听器。不使用任何手势的组件，以及已禁用的识别器或消费者，不会注册任何东西；消费者的 `isEnabled()` 变化后，`host.update(element)` 会重新同步。屏幕边缘平移在鼠标、触控板和触控笔下保持关闭（其识别器只允许触摸；它不接受 `allowedPointerTypes`），捏合也绝不会把触控笔和手指混在一起（一个识别器一次只接受一种指针）（FR43）。按压跟踪器把鼠标按压当作按压处理，使用细指针配置：立即绘制，在滚动器内部也是如此，且滚动制动仅限手指（FR11、DEC-21）。右键单击、触控笔笔杆按钮和 macOS 上的 ctrl-单击（其上下文单击）不会启动按压（`isPrimaryClick`，`../utils/primaryClick.ts`）。宿主跟随查询（平板电脑接入或拔出鼠标）：转为细指针会取消所有进行中的触摸。`perEventPointer` 是 FR43 之前 `attach`、`attachConsumer`、`useGestureRecognizer` 和 `usePressTracker` 的一个选项，被接受但不起任何作用。
- **`touch-action`。** 每个元素得到其识别器留给浏览器的交集，绝不超过元素自身的 `touch-action`（`spec:AST-094` FR18）。在行内值之上，宿主会行内写入两者都允许的内容。否则它在第一层叠层（cascade layer）的规则下标记元素（`data-astryx-touch-action`），任何作者规则都能胜过该规则；并在下一帧中，在两者都允许的内容比作者规则更窄的地方行内写入它。解绑会把元素自己的值还回去（可用 `manageStyle: false` 选择退出）：

  | 元素上的识别器                             | `touch-action`     |
  | ------------------------------------------ | ------------------ |
  | 点击、长按                                 | `manipulation`     |
  | 水平平移或轻扫                             | `pan-y pinch-zoom` |
  | 位于其边缘带内的条带上的水平边缘平移       | `pan-y pinch-zoom` |
  | 垂直平移或轻扫                             | `pan-x pinch-zoom` |
  | 单向平移、带 `scrollEdge` 的平移           | 保持原样（`auto`） |
  | 比其边缘带更宽的视图上的边缘平移           | 保持原样（`auto`） |
  | 自由平移                                   | `pinch-zoom`       |
  | 捏合                                       | `pan-x pan-y`      |
  | 捏合加自由平移                             | `none`             |
  | 观察者（`claimsTouches: false`），任意方向 | 保持原样（`auto`） |

  单向平移也把它的轴留给浏览器：把 toast 从边缘拖走后，页面会滚动。它在开始时通过取消 `touchmove` 来认领其方向。

  除非附加了捏合识别器，否则值中会保留 `pinch-zoom`，这样页面仍可缩放（WCAG 1.4.4）。带按住的长时间按压还会在其按压期间关闭其元素上的 iOS 标注（callout）和文本选择；0 ms 的（触摸落下检测器）或提供 `selectionLock: null` 的识别器会把它们留给浏览器。

  当手指或触控笔按下时，宿主也只在按住会做某事的地方关闭它们（`spec:AST-094` FR41）：在以 `selectionLock` 创建的识别器（传入 `lockSelection`；滑块的拇指、分段控件或开关的拖拽）的元素上，且该识别器会接收触摸（已启用并接受其指针），接触结束时恢复。宿主调用识别器的锁，从不导入某个锁，因此没有此类按住的组件不会打包它。以 `selectionLock` 创建的按压跟踪器（其自身记录定义了按住动作的控件，例如步进器的按住重复）在每次按压时得到同样的处理。按住不做任何事的按压跟踪控件或行，以及文档按压控制器的表面（`usePressFeedback` 行），保留浏览器的长按选择；点击从不选择。此类元素内手指下的非文本输入（复选框、单选按钮、开关的输入）也会被锁定：WebKit 自己的样式表让所有输入都可选择，任何祖先的锁都触及不到。文本字段保留其选择，因为按住的手指会放置其插入符。手指或触控笔在任何主指针下都会取得该锁，包括触摸屏笔记本电脑和桌面数位板；鼠标从不如此（`spec:AST-017` FR59）。

  识别器认领的鼠标或触控笔拖拽不会产生新的文本选择，也绝不会清除页面的选择（`spec:AST-094` FR41）：从认领之时到抬起后的一个任务（该按压自己的 `mouseup` 和 `click` 在其任务中到来），认领元素和 document 拒绝选择，并且按压开始时页面已有的选择会被恢复，覆盖按压或拖拽对它造成的任何改变。该保持在做出认领的那个识别器处开始，无论其状态如何：轻扫在按钮仍按下时以 `ended` 识别，而等待另一个识别器失败的识别器在仍为 `possible` 时就认领。认领被交还浏览器（那个等待的识别器失败或被取消，且没有其他所有者）会让保持放开，拖拽重新可选择。从可选文本（允许选择的文本字符，或文本字段）开始的拖拽不会被认领：在其按下期间没有识别器会识别，因此它会选择文本，而 sheet 或 pager 的平移下方的内容仍可选择。识别器在自己的 pointerdown 处、移动之前认领的按压不是拖拽，而点击只在抬起时认领。

- **认领。** 当识别器识别时，它拥有其触摸。每个带有可认领移动触摸的识别器（平移、轻扫、随后拖拽的长按、捏合）的元素都有一个非被动 `touchmove` 监听器，仅当它的某个触摸被拥有时才取消事件。没人拥有的触摸会完全像没有该系统时一样滚动。点击只在抬起时认领，而从不认领的识别器（`claimsTouches` 为 false，例如只观察滚动的下拉）从不拥有触摸，因此，元素若只有这类识别器、或只有按压消费者，就不会得到此类监听器（见下面的已知限制）。以 `keepsTouch: true` 创建的按压跟踪器（可选加入，用于持续跟踪的控件，例如按住式步进器；绝不用于普通按钮、链接、卡片或列表单元格）会得到一个：一旦其按压被投递，其手指的移动就会被取消，因此浏览器的平移永远不会接管被按住的控件（UIKit 的 `touchesShouldCancel(in:)` 对跟踪控件为 false）。其元素还会得到 `touch-action: manipulation`，对所有指针生效，就像点击识别器一样（`spec:AST-094` FR18），因此快速连续的点击永远不会缩放。在主指针为细指针的地方，阻塞式监听器只随按压出现：元素保留其唯一的 `pointerdown` 监听器（FR24），按压在其 `touchstart` 之前添加 `touchmove`，此后被保留手指的移动都会被取消，就像在手机上一样（FR11、DEC-21）。在这样控件上开始的滚动会等待主线程；在按压被投递之前的移动仍会滚动。宿主在触摸落下时添加到手指目标的监听器（用于手势中途离开 document 的目标）也是被动的，除非该触摸上的识别器能在移动时认领。
- **开始时的认领。** 平移只在开始时认领其触摸，即 UIKit 的 10 pt（`spec:AST-094` FR19），早于 WebKit 在 10–11 px 时将慢速拖拽提交为滚动；浏览器先接管的拖拽仍归浏览器（FR14）。有两个例外：`scrollEdge` 平移从沿其轴达到点击 5 px 抖动的移动开始取消其手指的移动，前提是手指下的每个滚动器都处于其边缘且手指正从该边缘拉开（也就是平移自己的做法；浏览器在那里只能橡皮筋回弹）；它仍从 10 pt 开始。在抖动范围内，移动仍归浏览器，因为 WebKit 在触摸的某个移动被取消时结束该触摸的点击，而移动版 Safari 在保留的 5 px 移动上提交其原生平移。`firstMoveDecides` 平移（toast 的轻扫，`component:Toast` FR4）从按自己方向的第一次移动起按住其手指，并在任何其他第一次移动时失败。只有在屏幕上是那一根手指时，它们才会保持：只要任何地方落下第二根手指，移动就留给浏览器用于其捏合（FR10）。在移动版 Safari（iOS 26.2）中测量：`touchmove` 从第一个像素就到达；在可滚动元素上，WebKit 在 10 到 11 px 时提交滚动（最后一个可取消的 `touchmove` 在 10 px），而从 8 px 起取消每个 `touchmove` 会让页面在整个手势期间保持静止。在 `pan-y` 下，它只滚动比约 2:1 到 3:1 更陡的拖拽，一旦垂直位移达到约 10 px。因此，与原生滚动竞争的平移在 10 px 或更早做出决定。
- **浏览器的认领。** 手指上的 `pointercancel`，或手指移动超过 slop 后触摸之上的滚动（浏览器不会更早开始平移），意味着浏览器接取了手指；未移动的手指下的滚动（scrollIntoView、固定到末尾的 transcript、滚动锚定）是页面自己的，不会影响按压及其点击。当其第一个无法再被取消的 `touchmove` 出现时也是如此，前提是浏览器可以沿手指的主轴平移。（当 `touch-action` 使其无法那样平移时，例如 `pan-y` 下的水平拖拽，Chromium 在一个未消费的 `touchmove` 之后也会停止询问；那不是认领。）共享该触摸的可能状态识别器失败，活跃的被取消，视图的按压也被取消。
- **点击。** 当触摸的手势取消了视图的触摸时，其 `touchend` 被取消（没有点击，也没有兼容性鼠标事件），共享点击守卫（`utils/clickGuard.ts`，菜单按压模型也使用它）会吞掉浏览器的下一次点击，直到下一次 `pointerdown` 或 400 ms。为可能仍会识别的识别器（点击之间的双击）而暂扣的点击会被立即吞掉，并在识别器失败时重放到原始目标上。`detail === 0` 的点击（键盘、辅助技术、代码）始终通过。
- **上下文菜单。** 识别器拥有触摸期间的 `contextmenu` 会被取消，因此长按永远不会同时打开浏览器的菜单。
- **焦点。** 失去窗口焦点或隐藏页面会取消所有进行中的触摸，就像 UIKit 在应用辞去活跃状态时那样。

### 原生滚动

`scrollEdge` 让平移与手指下的原生滚动器共享其轴。这就是覆盖自身列表的 sheet：只有当触摸下没有任何东西能为该运动滚动、手指落在边缘并正从边缘拉开时，平移才开始。浏览器尚未提交，因此开始即认领触摸，内容从不移动。从拉开该边缘 5 px 的移动（点击的抖动）起，平移就已按住手指，因此其移动在开始之前就被取消，页面也不会橡皮筋回弹。抖动更小的点击保留每个移动，因此也保留其点击。

拖拽归谁只在它开始时决定一次，如同 UIKit：以滚动开始的拖拽在全程都归滚动视图（它滚动到顶部，然后橡皮筋回弹），中途绝不换手（`spec:AST-094` FR14）。

“能否滚动”遵循浏览器自己的规则：触摸与每个滚动器之间的 `touch-action`、被 `overscroll-behavior` 停止的滚动链，以及 RTL 的 `scrollLeft` 范围，沿扁平树（flat tree）计算（插入 shadow-tree 滚动器的内容随其滚动，命中路径也是如此）。

### 输入流

宿主通过 `utils/inputStream.ts` 监听，并与按压反馈控制器共享该模块：每种事件类型一个原生监听器，位于 window 的捕获阶段，按顺序扇出给每个订阅者。它先于任何 document 监听器运行，因此应用的 window 捕获 `stopPropagation`，或在 core 之前注册的 document 捕获 `stopImmediatePropagation`，都不再能对两者隐藏触摸，就像 UIKit 的识别器先于视图看到触摸一样。必须在手势中途认领的识别器仍需要触摸到达其元素，其阻塞式 `touchmove` 位于该元素上、此类停止之下。输入流只有在某类型的某个监听器被重新添加之前，才保持位于应用自己的 window 捕获监听器之前；重新添加（被动性切换，或在最后一个订阅者离开后重新订阅）会把它追加到应用的监听器之后。某类型的监听器是被动的，除非订阅者取消它：按住认领参与者附加期间，宿主在那里取消 `touchend` 和 `contextmenu`，绝不取消 `touchstart` 或 `touchmove`；点击守卫（`../utils/clickGuard.ts`）在其武装期间、以及从菜单按压模型首次武装起，保留一个会取消的 `click`。图层被按住期间，图层的输入保持（`../Layer/inputHold.ts`）会在那里取消指针和鼠标事件、点击、`touchmove` 和 `touchend`，绝不取消 `touchstart`。阻塞式 `touchmove` 位于认领元素和被认领触摸的目标上；当认领识别器所在的元素正在移动时（移动元素上的触摸），位于 document 上；仅在页面保持或图层输入保持期间，位于 window 上，因此满是可按压元素的页面不会阻塞任何滚动。输入流记录其投递的最新指针事件的类型（`getLastPointerType`）；图层打开时，输入保持会读取它。

### 保持页面静止

滚动锁（`useScrollLock`）通过 `pageHold.ts` 中的 `holdPageScroll(document, decide)` 保持页面，后者返回释放函数。它位于自己的模块中，因此没有滚动锁的页面永远不会打包它；它不导入手势宿主的任何东西：仅当存在宿主时，它才询问 document 的宿主是否有识别器拥有触摸；而没有宿主的 document 也没有能拥有触摸的识别器。保持在启动时读取主指针。在主指针为粗指针的地方，它会立即监听，因为 Safari 只在监听器于触摸之前注册时才遵守阻塞式监听器，而覆盖层打开后的第一次拖拽正是保持要处理的；在主指针为细指针的地方，它不注册触摸监听器，直到输入流的 `pointerdown` 看到触摸或触控笔接触。无论哪种方式，保持此后都跟随指针。任何保持活跃期间，且仅在主指针为粗指针的地方，输入流会用非被动 `touchmove` 监听；当接触的 `touchstart` 早于其 `pointerdown` 时，手指在其第一次移动时被识别。对每次没有识别器拥有的单指触摸，在手指越过 5 px 的 slop（在 WebKit 的 10–11 px 滚动认领之下）后，它会询问 `decide(origin, dx, dy)` 该平移是否会滚动页面，`origin` 为手指下最内层的节点（组合路径的第一个节点），如果是，就取消该触摸全程的移动。第二根手指永远不会被取消，因此捏合缩放继续有效。没有保持时，监听器消失，每次触摸都像没有该系统时一样滚动。

### 多根手指

识别器已认领的拖拽会保留其手指：第二根手指永远不会取消或重定向它（`spec:AST-094` FR10），如同 UIKit 中平移会忽略超过其最大值的触摸。在任何认领之前，任何地方落下的第二根手指（通常落在没有识别器的普通行上）会使限制为一根手指的平移失败，因此两根手指会缩放页面（WCAG 1.4.4），而不是让平移在中途认领它们。

## 滚轮与触控板

识别器只在允许该滚动类型时接收滚动输入（`allowedScrollTypes`，UIKit 的 `allowedScrollTypesMask`）：触控板双指滚动或捏合为 `continuous`，鼠标滚轮的刻度为 `discrete`。平移跟随触控板，绝不跟随鼠标滚轮（`spec:AST-094` FR43、DEC-24）：它只允许 `continuous`，默认一个也不允许，因此只在其所有者允许的地方接收触控板滚动，其元素随后得到唯一的 wheel 监听器，而鼠标滚轮的刻度总是滚动指针下的内容。捏合两者都允许，用于触控板或鼠标的 ctrl-wheel。屏幕边缘平移一个都不接收，因为它不接受鼠标、触控板或触控笔（FR43）。控件的拇指（滑块或开关的）像控件一样跟踪，而不是平移，也不接收 wheel，因此在其上滚动页面绝不会改变其值（DEC-23）。Web 不上报 wheel 阶段或设备，因此要靠增量判断，而无法区分的情况读作鼠标滚轮：行模式或页模式增量；按住 Shift 的滚动（Shift+wheel）；比整像素差一点的像素增量（Windows 上的鼠标滚轮）；没有旧式 `wheelDelta` 的滚动（不发送它的引擎）；不是其旧式 `wheelDelta` 三分之一的增量；或 40 px 增量上出现 120 刻度。触控板的精确增量，即其旧式 `wheelDelta` 的三分之一（Chromium 和 WebKit），读作触控板。

wheel 手势像随内容移动的接触一样驱动平移，沿平移自己的轴，并且只有在指针与平移元素之间的每个滚动器都在该方向上处于边缘时才会如此，并在这条手势的第一次 wheel 时决定：平移不接收的 wheel 永远不会被阻止。平移自己所在的元素在其推导出的 `touch-action` 从浏览器那里保留下来的轴上是例外：在其自身滚动器上的平移会接收该滚动器的触控板滚动，就像它在那里接收手指的平移一样，而其内部的滚动器仍然先处理。观察者（`claimsTouches: false`）从不接收，而第一次 wheel 已被其他处理程序阻止、或无法取消的手势仍归页面。滚动边缘平移（下拉刷新）只有在指针下没有任何滚动器能为其滚动时才接收，包括它自己的滚动所有者和页面，正如其手指规则所读取的那样（`spec:AST-094` FR19）；`touch-action` 只收窄手指的平移，因此 wheel 会读取经过它的每个滚动器。ctrl-wheel（触控板捏合，或 Control 加鼠标滚轮）驱动捏合，其缩放遵循 `exp(-deltaY / 100)`；捏合默认接收它，并在最后一次 wheel 后 100 ms 结束。手指移动期间，触控板滚动在最后一次 wheel 后垂直方向 180 ms、水平方向 220 ms 结束，无论谁保持它（平移、指针下的滚动器或页面），因为缓慢拖拽会在 wheel 之间暂停（DEC-24）。手势的释放从不晚于更早结束它的输入（FR16）。

Web 也不上报触控板接触或阶段，因此一个分割器读取每条触控板流（`wheelSegmenter.ts`，DEC-24）：在收缩序列的第四个或更晚的增量处，一旦该序列损失了其大小的五分之一，手指就已抬起并开始惯性。在它做出决定之前，收缩的增量会等待，它跟随的平移会以手指最后的速度继续移动，绝不超过该速度所投影的范围。在抬起时，平移保留该位移并在那里放手，仍以该速度移动，其后的惯性永远不会移动它；当手指反而继续移动时，它们的移动会吸收平移超出其位移所显示的部分（或不足的部分），因此平移绝不会后退，并在它们的位移处结束。停下的手指在结束时间过后仍会释放。在惯性中，反向、逆衰减增长的增量，或 50 ms 的暂停会开始新的手势；一个迟到的、合并的触控板 wheel 若延续滑行的减速（等于或低于下一步，或接近其停滞跨越的下一步之和），则属于同一次轻扫。当接下来的 wheel 反而变大时，它以该迟到 wheel 的位移开始新的手势。手指、鼠标或触控笔落下会结束它，而 wheel 认领会保留页面的文本选择。识别器接取的手势会锁存到它，就像浏览器锁存滚动器一样：在其持续期间，宿主通过共享输入流的 window 捕获监听器先听到每一步，无论它落在哪里，因此元素从静止指针下移走的平移仍保持该手势。失去焦点或隐藏的页面会取消识别器仍在驱动的触控板平移，就像它取消每次触摸一样；该流的其余部分归页面。ctrl-wheel 捏合保留其流，因此页面永远不会为它而缩放；其抬起释放的平移会锁存其惯性，直到流结束。

## 上下文请求

`attachContextRequest(element, {onRequest})`（`contextRequest.ts`，内部）是上下文菜单所响应的唯一请求（`spec:AST-094` FR43）：手指或触控笔为 UIKit 的长按而保持静止，指针的上下文单击（右键单击、macOS 上的 ctrl-单击、触控笔的笔杆按钮），或 Shift+F10 和上下文菜单键。每个手势发出一个请求，报告其 `kind`（`hold`、`pointer`、`keyboard`）、其指针和其点（键盘的没有点）。按住是竞技场参与者，因此它会先输给另一个识别器对该手指做出的认领（重排手柄的按住）；被按住的手指、被按住的触控笔或按键也会触发的浏览器自身菜单会被拒绝，绝不会再次请求；而保持静止的鼠标不会发出请求。为按住重复而保留按压的控件只拥有其按住：其右键单击和 Shift+F10 仍能到达请求。右键单击或 macOS 上的 ctrl-单击不会启动按压。请求只在其自己的元素上监听，且只在启用时。按住就是 UIKit 的长按，500 ms 和 10 px 距离，并在开始时发出请求；`onHold` 报告其已提交，然后在抬起或取消时结束。在请求之前被禁用的按住不会报告任何东西，按住的键的重复也不会发出请求。

## 时间

每个输入都携带自己的时间戳（`event.timeStamp`），计时器是同一时钟上的截止时间。在处理输入之前，所有按其时间戳到期的计时器都会先在其自己的截止时间运行。因此，即使主线程被阻塞且计时器回调运行晚了，长按也恰好在触摸落下 + 500 ms 时开始。测试使用显式时间戳且不使用真实时间来驱动整个系统。

## 速度

`VelocityTracker` 以每秒像素（UIKit 的单位）报告，是每个连续识别器使用的唯一速度跟踪器（`architecture:interaction-modality` INV10、`spec:AST-100` FR1、FR2；没有替代估计器）。一个滤波器，即 iOS 实测的混合，在每个移动样本上更新（位于最新位置的样本不算运动）：

- 平移的速度是新间隔速度的 0.2 倍加上前一间隔的 0.8 倍（一个间隔从一个移动样本到下一个；触摸落下算作第一个）。迄今为止只有一个间隔时，就是该间隔，正如 UIKit 所报告的那样。它在六条录制的触摸流上重现了 UIKit 报告的每个值，并且像 UIKit 的一样，对加速度晚一帧做出反应。
- 滚动表面的释放（分页、wheel）是最新平移值的 0.25 倍加上前一个的 0.75 倍：平移的 `scrollVelocity()`。其他所有情况读取 `velocity()`。

如果手指在抬起前静止时间长于静止间隔（`UIKIT_GESTURES.velocity.stillness`），释放读数为 0，这是与 iOS 的唯一区别，iOS 的滤波器从不衰减，因此在休息后仍会甩动；移动样本少于两个时也为 0。平移将其抬起的事件时间传给跟踪器。

时间就是事件自己的时间。浏览器同时在 pointer 和 touch 事件中报告的手指只从其 pointer 事件采样（一旦浏览器取消其 pointer，则从其 touch 事件采样），因此一次移动的两份副本绝不会都被计数。

## 触觉反馈

`playHaptic(kind)` 在存在 `navigator.vibrate` 的地方振动，每种 UIKit 反馈类型一个模式。iOS Safari 没有振动 API。它只在真实点击切换 `<input type="checkbox" switch>` 时播放轻触感，而 WebKit 要求可信事件才能做到。`attachTapHaptic(label)` 在控件作为其点击目标渲染的 label 内放置一个隐藏开关，因此其上的每次真实点击都会播放该触感；激活赋予开关的焦点会直接返回。通过 `for` 绑定到其控件的 label，或其控件本身就是开关的 label，不会得到开关；包裹自己控件的 label 会得到一个，它会把每次点击转交给该控件。没有东西能在之后从脚本播放触感，因此在 iOS Safari 中不可能实现拖拽过程中的触感（detent 卡位、选择器刻度）。

## 阈值

所有数字都位于 `../motion/uikit/gestures.ts`。每个数字要么带有来源（Apple 文档，或一次测量：在 iOS 26.2 模拟器上的 UIKit 应用中读取识别器自身的值并通过触摸确认，或在同一模拟器上测量的移动版 Safari），要么带有猜测以及将要替换它的测量。如果某个条目两者都没有，单元测试就会失败。

## 触摸呈现

组件是否以触摸（UIKit）方式呈现自己只在 `../utils/touchPresentation.ts` 中回答一次：

- 触摸行为（UIKit 的弹簧和时序、按压模型的触摸配置）以粗主指针（`TOUCH_QUERY`）为键；手势本身为每种指针附加（见告知浏览器的内容）；
- 布局行为以紧凑视口为键，低于主题的 `md` 宽度点（`spec:AST-012` FR9）：`COMPACT_QUERY` 为某个样式拼出默认点，而行为读取活动主题的定义，因此移动 `md` 的主题会连带移动紧凑点；
- 同时需要两者的呈现（例如用 sheet 代替 popover）会同时询问两者（`COMPACT_TOUCH_QUERY`）。

样式通过将相同的查询写成 StyleX media key 来在相同条件下切换（`'@media (pointer: coarse)'`，以及完全按 `COMPACT_TOUCH_QUERY` 拼写的紧凑触摸查询，测试会强制执行），因此首次绘制就是正确的。行为读取 `useTouchPresentation()`（SSR 安全），没有可据以推断的交互的组件也包含在内：手指下采用 UIKit 时序，鼠标下则采用其自身运动，而一次性做出的决定读取 `readTouchPresentation()`。

## 迁移原始触摸拖拽

自己监听触摸的组件按以下方式迁移到识别器：

1. 不要 window 或 document 触摸监听器：用 `useGestureRecognizer` 附加识别器，并按状态读取 `translation()` 和 `velocity()`。宿主拥有页面级监听器。
2. 选择读数：像滚动视图那样滑行的拖拽（滚轮、选择器、分页器、轮播）用平移的 `scrollVelocity()` 释放；其他一切用 `velocity()`。单向拖拽设置 `direction`。宿主推导 `touch-action`，因此删除手写的那个。
3. 原生滚动：覆盖自身列表的 sheet 使用 `scrollEdge`，而不是检查 `scrollTop`；拖拽归谁只在它开始时决定一次（`spec:AST-094` FR14）。
4. 只观察用户滚动的行为使用观察者（`claimsTouches: false`）和 `useFingerScroll`。
5. 滚动锁用 `holdPageScroll` 保持页面；没有自己的 `preventDefault`。
6. 限制为一根手指的拖拽设置 `maximumNumberOfTouches: 1`。在它认领之前，第二根手指会使它失败；一旦认领，它就保留其手指（`spec:AST-094` FR10）。删除本地的捏合让位。
7. 释放把 `velocity()`（px/s，事件时间）交给动画器。删除本地估计器、样本缓冲区和时间窗口；flick、fling 或提交阈值留在组件中，与之比较。
8. 按住会起作用的控件（滑块的拇指、步进器的按住重复）向其识别器或按压跟踪器传入 `selectionLock: lockSelection`（`spec:AST-094` FR41）；内容拖拽保留选择。
9. 按压使用 `usePressTracker`；只有在其自身区域跟踪按住手指的控件才用 `keepsTouch: true`。
10. 单元测试用带时间戳的触摸驱动手势测试台（`__tests__/harness.ts`）；交互规范使用真实触摸输入，绝不使用合成 DOM 事件。

## 已知限制

- **在识别器上开始的滚动会等待繁忙的主线程。** 在移动版 Safari（iOS 26.2，已测量）中，从带有非被动 `touchmove` 监听器的元素开始的垂直滚动会等到当前 JavaScript 任务结束；在普通行、可按压行或仅点击元素上，即使在 500 ms 的任务期间，它也会立即开始（50 ms 内）。Chromium 对非被动监听器记录了同样的规则。该监听器保留下来，因为没有别的东西能维持 UIKit 的仲裁：使用被动监听器，或在 `touchstart` 期间添加的监听器（Safari 对该触摸会忽略），Safari 会把轻扫行上的每次斜向拖拽交给列表滚动，包括 3:1 的情况。它绝不会比 UIKit 更差，在 UIKit 中繁忙的主线程会阻塞每次滚动。
- **每一行都有水平识别器的列表**（邮件列表每行都有轻扫操作）：在 Safari 中每次滚动开始都会等待当前任务。保持列表屏幕的任务简短。行内原生水平 `scroll-snap` 展开永远不会等待，但它使用滚动物理跟踪，而不是 UIKit 实测的跟踪弹簧；它是一个可能的可选项，不是默认值。
- **后续事项：** 即使使用被动监听器，Chromium 也会把 3:1 到 1.5:1 的拖拽保留为轻扫（其 `touch-action` 过滤器会丢弃侧向开始的 `pan-y` 滚动），因此那里的被动监听器不会损失对等性。在做出任何特定于引擎的选择之前，它要等待在 Android 上的一次测量运行。

## 移动元素上的触摸

iOS WebKit 对合成器动画移动的元素在动画开始的位置进行命中测试：它保留动画进入合成器时所解析的 transform，因此事件目标、`elementFromPoint` 和 `getBoundingClientRect` 在整个曲线期间都停留在那里，尽管行内样式保存的是曲线起始值，而计算样式是实时的（iOS 26.2，已测量；Chromium 和 Linux WebKit 命中实际绘制的位置）。落在正在归位的 sheet 上的手指会落到 sheet 起始位置下方原本存在的东西上（向上释放可能命中遮罩并关闭 sheet）。UIKit 会保持可中断动画在绘制位置可命中测试（UIViewPropertyAnimator）。
对元素的一次样式写入会让 WebKit 重新解析 transform，解析为该时刻绘制的值，并停留在那里。因此在 iOS WebKit 上，在触摸落下时，宿主会用一次自定义属性写入，让动画器报告为正在移动的每个元素（`motion/presentation.ts`）都完成解析，然后询问引擎手指下是什么：触摸会去往那里绘制的内容，z 顺序和 `pointer-events` 按引擎所见。繁忙主线程迟迟才交给宿主的触摸，会去往手指落下时（按它的时间戳）其下绘制的内容：宿主会在该内容此后移动到的位置进行询问。按压跟踪器从 `presentedRect` 取得边界，即报告的盒子加上此后运动后的结果。重新定向的点击会取消引擎的点击（后者会命中起始位置），并点击它所触摸的内容；点击守卫会丢弃迟到的引擎点击，因此点击只作用一次。Safari 只在阻塞式 `touchmove` 于触摸开始前注册、且位于引擎自己的目标上时才遵守它，而对于移动元素，该目标就是其起始位置下方的任何东西：因此当认领识别器所在的元素正在移动时，document 承载阻塞式监听器，任何地方开始的滚动只会在这段时间内等待主线程。未覆盖：缩放和旋转（缩放过渡、被提起的预览在其未缩放的盒子上被命中），以及动画器未启动的 CSS 过渡或动画。这是一个引擎权宜之计（`spec:AST-013` FR6）。其复查条件：每次 iOS 发布时重新测量，并在 iOS WebKit 对合成器移动的元素按其绘制位置进行命中测试后移除此修正。其回归测试夹具是 `__tests__/presentedHitTesting.test.ts`。

## Web 与 UIKit 的差异

- 一旦识别器拥有一个触摸，浏览器就无法在同一手势稍后取回滚动。UIKit 也不会：它在拖拽开始时就在 sheet 与其列表之间做出决定。
- 在 Chromium 中，手指的第一个 `touchmove` 只在约 16 px 后才到达。低于该距离的移动来自手指的 pointer 事件，但浏览器自己决定滚动发生在第一个 `touchmove` 时。移动版 Safari 从第一个像素就投递 `touchmove`。
- 在移动版 Safari 中，按住普通 `<button>` 一秒或更久的点击不会得到 click，而 UIKit 的点击允许 1.5 s。元素上的点击识别器遵循 UIKit。
- iOS Safari 自己的从屏幕边缘返回的轻扫无法被页面取消。前缘平移在该轻扫没有历史可返回的地方有效。
- `translation()` 以客户端 CSS px 为单位。它不会换算到旋转或缩放祖先的坐标空间。
- 重放的 click 是不可信的。任何在重放窗口内需要真实用户激活的东西（例如打开文件选择器）都不应位于多击识别器之下。

## 测试

- `__tests__/<Recognizer>.test.ts`：每个识别器的状态机，使用带显式时间戳的合成触摸。
- `__tests__/arena*.test.ts`：冲突矩阵、向视图的投递、点击处置、取消和多根手指。
- `__tests__/GestureHost.test.ts`：在 jsdom 中通过真实监听器的 DOM 集成。
- `__tests__/VelocityTracker.test.ts`：滤波器的测试，对照 UIKit 在录制的触摸流上报告的速度、匀速和急剧加速。
- `__tests__/haptics.test.ts`：振动模式和隐藏开关。
- `__tests__/importGraph.test.ts`：仅手势组件的静态导入（`useGestureRecognizer`、平移识别器、宿主）既不会到达按压跟踪器，也不会到达触觉反馈，后者位于 `usePressTracker` 和 `attachTapHaptic` / `playHaptic` 之后。
- `__tests__/useFingerScroll.test.tsx`：手指的滚动直到其 `scrollend`，通过 document 的页面，以及被跟随的 ref 节点。
- `__tests__/browser/`：在手机尺寸触摸屏上的浏览器验证，在 Chromium（带时间戳的 CDP 触摸）和 WebKit（其自身触摸输入）中运行，并在细指针上下文中包含鼠标和触控笔输入，由 `pnpm test:interaction gestures.interaction.browser.spec.ts` 以及 CI 的交互验证运行；当 WebKit 无法在宿主上启动时，`internal/interaction-harness/scripts/webkit-container.mjs` 会在官方 Playwright 镜像中运行其项目。同一夹具在 iOS 26.2 模拟器上的移动版 Safari 中通过：认领、点击抑制、滚动边缘、捏合，以及恰好在 500 ms 时的长按。
