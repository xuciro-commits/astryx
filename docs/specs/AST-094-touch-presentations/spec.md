---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-094
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [vjeux]
affects_architecture:
  [
    architecture:interaction-modality,
    architecture:theme-tokens,
    architecture:theme-authoring-contract,
  ]
affects_families: [family:buttons]
affects_contributing: []
affects_consumer_docs: []
verified_by:
  [
    packages/core/src/motion/__tests__/animatedLayoutBusy.interaction.browser.spec.ts,
  ]
---

# Touch presentations feel native system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/Layer/holdEntranceInput.ts",
    "packages/core/src/Layer/inputHold.ts",
    "packages/core/src/gestures/contextRequest.ts",
    "packages/core/src/gestures/tapWobble.ts",
    "packages/core/src/hooks/usePager.ts",
    "packages/core/src/motion/uikit/segmented.ts",
    "packages/core/src/motion/uikit/slider.ts",
    "packages/core/src/Swipe/useSwipeAction.ts",
    "packages/core/src/dragToSnapPoints/compositorSettle.ts",
    "packages/core/src/Item/Item.sharedDrag.test.tsx",
    "packages/core/src/Item/Item.test.tsx",
    "packages/core/src/Item/__tests__/ItemSwipeActions.interaction.browser.spec.ts"
  ]
}
```

## Intent

在手机或平板电脑上使用 Astryx 产品的人，获得的控件、面板、菜单、列表与导航都具有原生手感的触摸行为：采用实测的物理参数与手势阈值，而不是把桌面动效拉伸到一根手指上。人拖动的对象跟随其手，甩出的对象按甩出的速度在弹簧上落定，并且在任何指针下都是如此。在主交互为点击的组件中，由点击、单击、按住、按键或程序启动的动效播放主题的动效令牌；在主交互为手势的组件中，它落在组件自己的弹簧上（FR45）。该行为是每台触摸设备上的默认行为，iOS 与 Android 皆然，无需选择加入；当页面的 JavaScript 繁忙时，其动效仍以显示刷新率持续运行。

该行为来自一张实测表。其数值实测自特定参考版本上的 UIKit，目前是 iOS 26.2 上的 UIKit；每个数值都标明它取自哪个版本，把参考版本移到更新的版本就会重新实测该表，而旧版本上的差异只作记录，不作为目标。Android 触摸设备获得相同的行为。触摸行为在各平台之间有何差异仍在探索中，仅当存在有实测、有来源的差异时，表中才记录一个单独的值。

## Non-goals

- 主交互为点击的组件中，由点击启动的动效的时长与缓动。在此类组件中，由点击、单击、按住、按键或程序启动的动效（例如入场、移动或值变化）在任何指针下（包括手指）都播放主题的时长与缓动令牌（`architecture:theme-tokens`）（FR45）。此类组件中不由手势驱动的触摸退出保持其外观，并播放主题的退出时长与缓动，任何退出开关都不会移除它（FR7、`spec:AST-090` FR14）。手势、按压跟踪、跟随指针的部件，以及让手势落定的弹簧，适用于每一种指针（FR43、FR45）。
- 与平台匹配的外观与手感：玻璃质感与材质表面、字形与界面装饰。本记录管的是行为，触摸尺寸只在 FR42 所述范围内受管。
- 嵌入原生应用的 WebKit 与原生 Swift 包。本记录管的是 Web 组件本身。
- 滚动物理。滚动在每个平台上都保持原生：在 iOS 上，溢出区域或页面本身就是 UIKit 滚动视图。
- 哪些组件获得触摸呈现，以及何时获得。每个组件自己的记录拥有其呈现。
- 只要满足本契约，等价的内部实现仍然有效。动效与手势基础的模块、文件和算法属于其架构记录。

## Requirements

### Physics

- **FR1 — 实测数值，处处一致。** 手势动效播放的每个弹簧、时长与减速率（FR45），以及触摸呈现使用的每个橡皮筋系数、手势阈值、输入时机与触觉时刻，都必须默认为该用途实测的原生值（FR2），并且每个播放相同动效或手势的组件都必须使用同一个值；主题只能通过其动效旋钮触达这些角色（FR4、DEC-15）。在主交互为点击的组件中，不由手势驱动的动效播放主题的时长与缓动令牌，而不是实测值（FR45、DEC-26）。在存在实测值的地方，任何组件都不使用自己的值。相同的值适用于每个触摸平台；仅当存在有实测、有来源的差异时，某个平台才拥有自己的值（FR2）。
- **FR2 — 每个数值都有来源。** 每个实测值都必须在其旁边标明来源：Apple 的文档、WWDC 会议、WebKit 自己的源码（当 WebKit 声明它与 UIKit 一致时），或在 iOS 模拟器上对 UIKit 的实测，并注明应用、iOS 版本、方法与日期。缺少上述来源的数值必须标注为猜测，并指明将要替代它的实测。对 UIKit 的反编译可以作为实测的目标，但绝不能作为来源。所有者决策可以设定偏离实测的值；它要注明日期以及其所偏离的实测。

  本记录为手指下的菜单命名的数值（FR29）：

  | 数值     | 默认值                                                                          | 来源                                                                                                                                                                            |
  | -------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | 打开延迟 | 固定栏中无延迟；当没有滚动在滚动视图内接管触摸时为 150 ms（内容触摸延迟，FR11） | 所有者决策，2026-10-24，偏离 2026-10-23 在 iOS 26.2 模拟器（iPhone 17 Pro）上对 UIKit 的实测：后者在固定位置于触摸按下后 150–153 ms 打开按住手指下的菜单，在滚动视图内约 303 ms |
  | 交接距离 | 10 pt（CSS px），直线距离，从已打开菜单看到的第一个位置起算                     | 实测：相同设置；(0, 9) 与 (7, 7) 的移动没有选中任何项，(0, 10)、(10, 0) 与 (9, 9) 则选中了                                                                                      |
  | 漂移容差 | 打开之前触点上 13 pt（CSS px）的移动                                            | 未实测，需要一次实测或论证：12 pt 的移动仍会打开菜单，14 pt 的移动则不会（OQ5）                                                                                                 |

  FR20 所说的滚动接管距离是 10 px（CSS px），即手指从按下位置起算的自身行程：在 iOS 26.2 模拟器上的 Mobile Safari 26.2 中，对可滚动页面做缓慢的 HID 拖动，沿一个轴实测得到，其中最后一个可取消的 `touchmove` 位于 10 px，`pointercancel` 位于 11 px，2026-10-23。在斜向拖动时用直线距离来度量，在相同设置下的斜向拖动完成实测之前只是一个猜测。

- **FR3 — 原生物理。** 弹簧必须遵循 UIKit 的弹簧模型（响应与阻尼比、质量、刚度与阻尼，以及释放速度），并在 UIKit 钳制过阻尼的地方把过阻尼钳制到临界阻尼。动量滑行必须像 UIKit 滚动视图那样衰减（每毫秒 0.998，快速档为 0.99），越过边缘的拖动必须用 UIKit 的橡皮筋 `(1 − 1 ÷ (x·c ÷ d + 1))·d` 抵抗，系数取该用途实测的值（滚动视图与面板为 0.55），而释放必须像其 UIKit 对应物那样通过投影速度来选取停点：用减速率，或用实测的投影时间。分页滚动视图（分页器，以及在其运行分页器时被赋予 `hasSnap={useSnapPaging()}` 的 Carousel，这是 `component:Carousel` FR7 下的选择加入项）按其 UIKit 对应物的实测方式选取停留页，不做投影：选取最近的一页，或者当释放速度至少达到 `paging.release.advanceSpeed`（300 pt/s）时，沿释放方向选取下一页，位置在页面上任何地方都一样。它距离拖动开始时所处的页面最多移动 `paging.release.maxPagesFromStart`（一页），而朝该页回退的释放会停留在该页（FR37）。这两个值都在 iOS 26.2 模拟器上实测，2026-10-23：在 402 pt 页面的 10 %、25 % 与 40 % 处的稳定释放停在 292.7–298.6 pt/s，而前进发生在 310.7–329.9 pt/s；静止状态的释放停在 45–48.5 %，前进发生在 55–57.5 %（DEC-25）。
- **FR4 — 触摸动效使用具名角色。** 触摸呈现为手势播放的每个弹簧、时长与曲线（FR45）都必须是为其用途命名的动效角色（`architecture:theme-tokens` INV3），只有一个例外。手势驱动的退出（关闭或取消的释放）可以播放一个从平台参考实测得到、却没有具名动效角色的弹簧（FR45）；其组件的动效表会连同平台来源列出该弹簧。其他所有手势驱动的动效都播放动效角色。本记录命名的角色及其默认值与来源列在下面；组件自己的记录实测出的更多角色，通过生成的动效角色表加入（DEC-5）。在 tempo 为 1 且 character 为标准时，每个角色都精确播放其实测值（FR1、FR2）；主题的 tempo 缩放时长，其 character 通过固定的每角色权重来偏移回弹（`spec:AST-108` FR3），而固定清单上的角色会忽略这两者：屏幕键盘（`spec:AST-099` FR8）；手势阈值、内容触摸延迟与动量（`spec:AST-002` FR3）；手指跟踪、橡皮筋、按压模型的起始延迟、取消距离与点击闪光（`spec:AST-108` FR4），以及忙碌循环；以及 200 ms 的 Reduce Motion 上限。每角色表保持内部（DEC-15）。组件必须通过这些角色读取触摸动效，除了那个实测的手势驱动退出弹簧之外，不得播放字面值。主题的旋钮值必须在动效开始时到达动效，而不改变动效的运行方式（FR5、FR6）。必须与屏幕键盘保持同步的动效不是主题角色：它跟随键盘自己的动效（`spec:AST-099` FR8、`architecture:react-component-runtime` INV11）。手势阈值、决定谁获得触摸的时机（内容触摸延迟、滚动制动、动量记忆）、按住时长、轻扫速度与触觉，都是实测的输入值，不是动效：它们不是动效角色，保持内部，也不是公开概念（`spec:AST-002` FR3），只有产品传给 `spec:AST-107` 的吸附点拖动的 `flickThreshold` 例外。这三个旋钮加入 `architecture:theme-authoring-contract` 与 `architecture:theme-tokens` 的动效配置（`spec:AST-108`）。在原生动效以过冲落定或用橡皮筋拉伸的地方，它偏离草案 `design:motion` DR3。

  | 角色                         | 默认值                           | 来源                                                                             |
  | ---------------------------- | -------------------------------- | -------------------------------------------------------------------------------- |
  | `springs.fingerTracking`     | 响应 0.15 s，阻尼比 0.86         | Apple：SwiftUI `interactiveSpring()`                                             |
  | `springs.emphasis`           | 时长 0.5 s，回弹 0.3             | Apple：SwiftUI `.bouncy`                                                         |
  | `springs.settle`             | 时长 0.5 s，回弹 0               | Apple：SwiftUI `.smooth`                                                         |
  | `springs.quickChange`        | 时长 0.5 s，回弹 0.15            | Apple：SwiftUI `.snappy`                                                         |
  | `springs.viewChange`         | 质量 3，刚度 1000，阻尼 500      | 实测：UIKit `UISpringTimingParameters()`，iOS 26.2 模拟器，2026-10-23            |
  | `springs.timedChange`        | 时长 0.5 s，回弹 0               | Apple：UIKit `UIView.animate(springDuration:bounce:)`                            |
  | `springs.stateChange`        | 响应 0.55 s，阻尼比 1            | Apple：SwiftUI `Animation.default`                                               |
  | `springs.directChange`       | 响应 0.5 s，阻尼比 0.825         | Apple：SwiftUI `.spring(response:dampingFraction:)`                              |
  | `springs.menuOpen`           | 阻尼比 0.8，响应 0.32 s          | 实测：UIMenu 打开，iOS 26.2 模拟器，2026-10-23                                   |
  | `springs.menuClose`          | 阻尼比 0.85，响应 0.35 s         | 实测：UIMenu 关闭，iOS 26.2 模拟器，2026-10-23                                   |
  | `springs.subMenuOpen`        | 阻尼比 0.85，响应 0.4 s          | 实测：UIKit 为 UIMenu 子菜单打开所用的自有弹簧，iOS 26.2 模拟器，2026-10-24      |
  | `springs.subMenuBack`        | 阻尼比 1，响应 0.4 s             | 实测：UIKit 为 UIMenu 子菜单返回头部所用的自有弹簧，iOS 26.2 模拟器，2026-10-24  |
  | `springs.contextMenuLift`    | 阻尼比 0.8，响应 0.32 s          | 实测：UIContextMenuInteraction 的预览抬升，iOS 26.2 模拟器，2026-10-23           |
  | `springs.contextMenuDismiss` | 阻尼比 0.85，响应 0.35 s         | 实测：UIContextMenuInteraction 的取消，iOS 26.2 模拟器，2026-10-23               |
  | `springs.contextMenuMorph`   | 阻尼比 0.8，响应 0.3 s           | 实测：UIContextMenuInteraction 的菜单入场与预览阴影，iOS 26.2 模拟器，2026-10-23 |
  | `segmented.selectionSpring`  | 响应 0.4 s，阻尼比 0.85          | 实测：UISegmentedControl 的选中滑动，iOS 26.2 模拟器，2026-10-23                 |
  | `segmented.lift`             | 响应 0.25 s，阻尼比 1            | 实测：UISegmentedControl 在手指下的透镜抬升与落定，iOS 26.2 模拟器，2026-10-23   |
  | `timing.stateChangeMs`       | 250 ms                           | 实测：Core Animation 的隐式事务，iOS 26.2 模拟器，2026-10-23                     |
  | `timing.curves.viewChange`   | cubic-bezier(0.25, 0.1, 0.25, 1) | Apple：`CAMediaTimingFunctionName.default`                                       |
  | `timing.curves.exit`         | cubic-bezier(0.42, 0, 1, 1)      | 实测：UIKit 的 ease-in，iOS 26.2 模拟器，2026-10-23                              |
  | `timing.curves.entrance`     | cubic-bezier(0, 0, 0.58, 1)      | 实测：UIKit 的 ease-out，iOS 26.2 模拟器，2026-10-23                             |
  | `timing.curves.move`         | cubic-bezier(0.42, 0, 0.58, 1)   | 实测：UIKit 的 ease-in-out，iOS 26.2 模拟器，2026-10-23                          |

  三行 `springs.contextMenu*` 是为 ContextMenu 的抬升实测的，由 `component:ContextMenu` 拥有（DEC-5）。

  在主交互为点击的组件中，角色只为手势驱动的动效播放：释放后的落定、轻扫、平移或捏合的落定、橡皮筋的回弹，以及跟随。在主交互为手势的组件中，其角色也为点击、按键或程序启动的移动落定（FR45）。主题的 `tempo` 缩放手势弹簧的时长，其 `character` 按角色的固定权重偏移角色的实测回弹（`spec:AST-108` FR3）；跟随本身与橡皮筋保持固定（`spec:AST-108` FR4）。为点击、按住、按键或程序启动的动效（包括退出）实测的那些行（`springs.menuOpen`、`springs.menuClose`、`springs.subMenuOpen`、`springs.subMenuBack`、三行 `springs.contextMenu*`、`timing.stateChangeMs`、`timing.curves.entrance` 与 `timing.curves.move`）保持为实测的原生参考。在主交互为点击的组件中，由点击、按住、按键或程序启动的任何动效都不播放它们：该动效播放主题的时长与缓动令牌（FR45），退出则播放主题的退出时长与缓动（FR7）。两个已批准的动效在各自的记录改变之前保留其弹簧：动画器的 `animate`（`spec:AST-107` FR3）与 `useDragToSnapPoints` 的 `settleTo`（`spec:AST-107`）。AST-105 的滑行、交换与边缘显露是由点击启动的布局动效，播放主题的曲线令牌，只有手势的释放例外，它在自己的弹簧上落定（`spec:AST-105` FR4）。Reduce Motion 替代与持续忙碌循环（例如 ProgressBar 的不确定脉冲，`component:ProgressBar` FR6）保留其具名角色；它们既不是手势启动的动效，也不是交互启动的动效。组件自己的记录会说明它的哪些角色由手势驱动。

  分页器在释放后的实测落定（DEC-25）不是退出，因此 FR4 的例外不覆盖它。它遵循主题的 `tempo`：从静止开始的落定保持其形状，耗时乘以 tempo；而释放仍然以手指速度的 96 % 起步，与 tempo 为 1 时相同。实现缺口：它播放 UIKit 的实测落定，却没有具名角色，也尚未遵循 `character`。实现缺口：分页器是手势组件，因此它按程序请求滚动到某一页的动画滚动会从静止开始在分页器的弹簧上落定（FR45）；目前它播放的是 300 ms、正弦曲线的滚动。

  实现缺口：面板选择器滚轮的吸附速率（UIKit 实测的选择器减速）播放自一个内部常量，尚未成为具名角色；针对速率的一种角色类型会在后续变更中引入。

### Motion

- **FR5 — 动效在合成器上运行。** 触摸呈现的每次释放与每个程序化动画都必须通过由浏览器在主线程之外运行的 Web Animations 来动画 `transform`、单独的 `translate`、`scale` 与 `rotate` 属性，或 `opacity`（包括对话框的 `::backdrop`），并且必须在主线程被阻塞期间仍以显示刷新率持续前进。它不得动画布局属性，也不得在合成器能运行曲线时由脚本逐帧步进。部件读取同一个自定义属性的吸附点拖动，通过 `dragToSnapPoints/compositorSettle.ts` 落定：每个部件一个 `translate` 动画，来自同一时钟上的同一个弹簧。动画器做不到这一点：它的自定义属性在主线程上动画，而它的 `translate` 只移动一个元素。按压立即显示。按所有者的决策（2026-11-03），每个渐隐的按压释放在每台设备与每种指针上都在主题的退出动效令牌（`--duration-exit`、`--ease-exit`）上完成；在 Reduce Motion 下，适用 `design:reduced-motion` DR2。
- **FR6 — 动效可被中断。** 手指必须能在任何动画进行中、以屏幕上的当前值接住它。该值及其速度必须来自曲线，而不是来自布局读取。新目标必须保留当前速度，而释放必须把速度交给其后的弹簧。分页器低于 `paging.release.velocityFloor`（225 pt/s）的释放从静止开始落定，与 UIKit 相同；更快的释放把速度交给落定。在被实测出的区间内，该下限是一个猜测（UIKit 会把 175 与 200 pt/s 的稳定释放归零，并保留 249 pt/s，iOS 26.2 模拟器，2026-10-23），直到有实测替代它（FR2）。拖动过程中换页从静止开始（DEC-25）。落定过程中的尺寸变化会重新定向它。当各页之间的间距都按同一比例缩放时，落定保持其页面及其页面占比。否则，朝最后一页的落定在最后一页结束。其他任何情况都在距其目标偏移最近的页结束，平局时朝它移动的方向。在视口还没有宽度之前开始的落定，在视口获得宽度时立即落到其目标上。在释放后的分页器落定上着陆的手指或笔，永远不会到达分页器的内容：没有按压反馈，也没有单击。UIKit 的内容在 30 次此类触摸中没有接受任何一次（iOS 26.2 模拟器，2026-11-06）。落在分页器 `goTo` 移动上的手指或笔会在触摸处停住它，抬起后在最近的一页落定；内容仍然接受点击。UIKit 的动画 `setContentOffset` 在触摸后 2 到 23 ms 停止，其内容接受了 30 次点击中的 24 次（iOS 26.2 模拟器，2026-11-06）。朝新静止点重定基准会整体平移正朝那里前进的弹簧：其曲线与目标按静止点的变化移动，而它保持起始时间与速度。在饥饿的页面上，Switch 的值变化在其帧证据中也就不会显示跳步。浏览器延迟提交的重定向弹簧从那一帧开始，从那里屏幕上的值开始，正如 UIKit 新增的弹簧从其提交时刻开始（iOS 26.2 模拟器，2026-11-07）。延迟是指在该帧提交的第一次调用之后超过 34 ms；更早的提交保持该调用的时钟。它保持屏幕上的速度，或保持其调用交给它的速度，例如释放的速度。重新定向的已播放曲线或滑行保持该调用的时钟。在同一次回调中发出的调用（例如同一个事件监听器或同一个观察者回调）共享其第一次调用的时钟，因此多个元素会对齐；在第一次调用之后超过 34 ms 的调用会开启新的时钟。滑动行的关闭若由内容上的触摸点击、Escape 或其外部按压启动，就在该输入事件自己的任务中执行。它使用动画器内部的 `start: 'next-frame'`（`architecture:react-component-runtime` INV13）。任务之后的第一帧提交它，无论之后的监听器把页面占住多久，因此关闭永远不会抢跑进其曲线。
- **FR7 — 退出保持原生对应物的外观。** 触摸呈现必须在每个触摸平台上播放与其 UIKit 对应物退出外观一致的退出：菜单收缩进其触点，警告淡出。在主交互为点击的组件中，由点击、按键、外部按压或程序启动的退出播放主题的退出时长与缓动，即 `--duration-exit` 与 `--ease-exit`（`spec:AST-090` FR14、FR45）。主交互为手势的组件（例如面板或 Lightbox）把每次退出都播放到其弹簧上：由点击、按键、外部按压或程序启动的关闭，从静止播放与滑动关闭相同的落定；手势驱动的退出则从释放速度开始（FR38、FR45）。主题的退出开关绝不会移除触摸退出（`spec:AST-090` FR14）。FR8 管它们的减少动效形式。每个浮层自己的记录会说明其退出，因为成员拥有自己的动画（`family:overlay-dismissal` AV6）。
- **FR45 — 组件的主交互决定使用弹簧还是主题的动效令牌。** 主交互为手势的组件为其动效播放弹簧，包括在其内部由点击启动的移动（点击面板的定位档位或关闭按钮，都在同一个弹簧上落定），因此其各个部件保持协调。主交互为点击的组件播放主题的曲线令牌（时长与缓动，按 `tempo` 缩放），绝不用弹簧，因为点击不携带速度；没有任何 character 或选项为它播放平台实测的曲线（所有者决策，2026-11-04）。释放速度重要的手势驱动动效，播放从手势速度开始的弹簧（落定、抛掷、橡皮筋回弹），或对滑行而言，播放从该速度开始、按其实测减速率衰减的滑行，在任何指针下都是如此（FR43）。在主交互为点击的组件中，由点击、按键或程序启动、记录未指明时长档位、且平台有实测时长的动效，播放某个主题时长令牌——该令牌在 Storybook 主题（neutral）中的值最接近该实测值——并配以其类别（入场、退出或移动）的缓动；实测值仍作为参考留在组件的动效表中。记录指明了档位的动效保留它：由点击启动的浮层退出播放 `--duration-exit` 与 `--ease-exit`（FR7）；原地开关的交叉淡变不是退出，而 `component:ProgressBar` FR4 的填充保持 `--duration-medium`。在点击组件中，小的锚定表面（popover、菜单、开关、行）与全屏表面（Dialog、AlertDialog）各自取各自的平台实测；不带具名档位的任何动效类别都不默认落到某一个时长档位。弹簧遵循主题的 `tempo`：tempo 缩放弹簧的速度，其回弹保持不变。每个弹簧都配一个时机层级，使其落定与配套曲线同时结束：菜单弹簧配 `--duration-medium-min`，面板与子菜单弹簧配 `--duration-medium`，落定与强调弹簧配 `--duration-medium-max`。在点击组件中，快速点击与按压保留时机令牌，不用弹簧。在 tempo 为 1 时，每个实测弹簧保持其平台手感（所有者决策，2026-11-04）。手势是速度会带入动效的连续指针移动：拖动、轻扫、滑动、平移、捏合，以及其中任何一种之后的落定与橡皮筋回弹。主题的 `tempo` 缩放弹簧的时长，其 `character` 按角色的固定权重偏移角色的实测回弹（`spec:AST-108` FR3）；跟随与橡皮筋本身保持固定（`spec:AST-108` FR4）。跟随指针的部件在任何指针下都跟随它（FR43）。手指按住的滑动行不播放跟随弹簧：从它取得触摸的那一刻起，其偏移在释放之前的每一帧都是手指自触摸按下以来的行程，再加上它越过确认点所获得的超前量（DEC-32）。在主交互为点击的组件中，其他所有由点击、单击、按住、按键或程序启动的动效，都必须在任何指针下（包括手指）播放主题的动效令牌，即按时长与缓动令牌按 `tempo` 缩放（`architecture:theme-tokens`、`spec:AST-108` FR2）。两个已批准的动效在各自的记录改变之前保留其弹簧：动画器的 `animate`（`spec:AST-107` FR3）与 `useDragToSnapPoints` 的 `settleTo`（`spec:AST-107`）。AST-105 的滑行、交换与边缘显露是由点击启动的布局动效，播放主题的曲线令牌，只有手势的释放例外，它在自己的弹簧上落定（`spec:AST-105` FR4）。Reduce Motion 替代与持续忙碌循环（例如 ProgressBar 的不确定脉冲，`component:ProgressBar` FR6）保留其具名角色；它们既不是手势启动的动效，也不是交互启动的动效。点击没有速度，因此它不是手势。弹簧驱动主交互为手势的组件的动效；曲线令牌（一个时长加一个缓动）驱动主交互为点击的组件的动效。弹簧与曲线的时机共享那一个协调后的标度，因此主题的 tempo 会同时缩放两者；弹簧层级列在下面（实现缺口：弹簧目前各自独立调校）。触摸呈现为该动效保持自己的外观（FR13），例如从触点展开的菜单，并在那些令牌上播放它。以点击或按住开始、随后继续为拖动的按压，从拖动的释放弹簧开始。在主交互为点击的组件中，不由手势驱动的触摸呈现退出播放主题的退出时长与缓动，任何退出开关都不会移除它（FR7、`spec:AST-090` FR14）。手势阈值、决定谁获得触摸的时机、按住时长、轻扫速度、按压模型的时钟与触觉，都是实测的输入值，不是动效角色，并按 FR4 所述保持内部。在减少动效下，`design:reduced-motion` 管这两类（FR8、FR38、FR43）。组件内部的伴随动效（面板的遮罩淡变、把手与内容的淡变或缩放、Lightbox 的界面装饰淡变、菜单的背景板）按组件主动效的节奏运行：在手势组件中它派生自主弹簧的进度与落定时间，在点击组件中它派自主曲线的时长与缓动，绝不按独立的时机运行。

  | 主交互                   | 动效                                                                                                                                         | 组件                                                                                                                         |
  | ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
  | 手势                     | 弹簧                                                                                                                                         | BottomSheet、Drawer、可滑动的 List 行、Lightbox、分页器与 Carousel、ContextMenu 的长按呈现、Slider、下拉刷新                 |
  | 手势                     | 弹簧：点击、按键或程序切换从静止播放 `springs.settle`；轻扫滑行保持 UIKit 的实测减速；慢速释放的吸附保持记录不变                             | DateInput 与 TimeInput 滚轮                                                                                                  |
  | 点击                     | 曲线令牌                                                                                                                                     | Accordion、Disclosure、Collapsible、DropdownMenu、Popover、Tooltip、HoverCard、Dialog、AlertDialog、Tabs、Checkbox、按压反馈 |
  | 支持手势                 | 触摸呈现下使用弹簧：滑块可拖动，因此每次点击、单击、按键或值变化都在同一个弹簧上落定；没有触摸呈现时保持主题的曲线（所有者决策，2026-11-04） | Switch、SegmentedControl                                                                                                     |
  | 开放（按其记录当前所述） | 点击取消使用主题时机；滑动使用来自释放的弹簧                                                                                                 | Toast                                                                                                                        |

  Toast 保持其记录当前所述的动效：点击取消使用主题时机，滑动使用来自释放的弹簧（`component:Toast` FR5）。它归入哪一类主交互仍开放。

  | 弹簧角色                                                                                                                                                                                                            | 时机层级                               |
  | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
  | `springs.menuOpen`、`springs.menuClose`、`springs.contextMenuLift`、`springs.contextMenuDismiss`、`springs.contextMenuMorph`                                                                                        | `--duration-medium-min`                |
  | `springs.subMenuOpen`、`springs.subMenuBack`，以及面板的弹簧                                                                                                                                                        | `--duration-medium`                    |
  | `springs.settle`、`springs.emphasis`                                                                                                                                                                                | `--duration-medium-max`                |
  | `segmented.selectionSpring`、`springs.directChange`、`springs.quickChange`、`springs.stateChange`、`springs.timedChange`、`springs.viewChange`、`springs.sliderLift`、`springs.sliderDrop`、`springs.sliderRelease` | 尚未命名层级                           |
  | `springs.fingerTracking`                                                                                                                                                                                            | 无；跟随保持固定（`spec:AST-108` FR4） |

- **FR8 — Reduce Motion。** 在减少动效下，触摸呈现遵循 `design:reduced-motion` DR2 与 DR4。

### Gestures

- **FR9 — 手指在渲染路径之外被跟踪。** 拖拽必须在每次移动时以一次视觉更新跟随手指，每次移动都不触发组件渲染，且手势开始后不读取布局。原生滚动只能在组件本身是滚动视图（列表、滚动区域、页面）的地方使用。组件只有在具备模拟器证据时，才可以用原生滚动吸附来跟踪手指：该证据须表明它在主线程阻塞期间仍能跟踪、以原生释放曲线结束、在手指于阻塞期间抬起时正确结束，并允许手指在内容飞行途中将其抓住。
- **FR10 — 第二根手指永不打断第一根。** 第二根手指不得取消或改变识别器已认领的拖拽方向。只要没有捏合识别器认领手指、没有拖拽被认领，且元素作者的 `touch-action` 保留 `pinch-zoom`，页面捏合缩放就必须始终归浏览器所有（FR18；WCAG 1.4.4）。菜单的按压跟踪滑动遵循 `module:DropdownMenu/useMenuPress` FR4：第二个指针或 `pointercancel` 会结束其手势且不触发任何动作，这使页面在菜单打开时仍可缩放。
- **FR11 — 三种按压配置。** 按压反馈必须遵循三种配置之一。控件（UIControl）在滚动视图之外于触摸按下时高亮，并在其中抬起时由浏览器的 click 激活。在 Web 上，控件的按压在浏览器接管触摸时结束（FR20），其激活仍由浏览器的 click 完成，但以下情况除外：`family:action-groups` 成员所跟踪的动作在抬起时激活（FR26）；处于 `spec:AST-020` FR9 滑出例外之下的开关类控件（Switch、Checkbox、CheckboxListItem）也可以在手指滑出后于抬起时完成；Switch 在手指按住或翻转拖拽的抬起时完成自身的开关切换，而非通过浏览器的 click（`component:Switch` FR15）；SegmentedControl 的拖拽在抬起时于最靠近指针的段上提交，无论它从何处开始（`component:SegmentedControl` FR13）。当引擎在合成器动画的运动起点对元素做命中测试时（iOS WebKit），落在移动内容上的触摸会归属到触摸按下时手指下方所绘制的内容，而在此处的一次点按（没有识别器认领它、浏览器没有接管它，且它保持在 45 pt 以内）必须激活该内容：该触摸对应的浏览器自身 click 会被取消或吞掉，该元素收到一次 click，并优先聚焦可编辑元素。分页器在释放后的沉降是例外：落在其上的手指或笔永远不会传到内容（FR6）。在精细指针下，控件使用第三种无延迟的配置：其按压绘制在 `pointerdown` 时立即开始，经由与手指相同的按压控制器和释放淡出，取代 CSS `:active`；滚动制动仍仅限触摸（DEC-21）。单元格（表格或集合的单元格）在滚动视图内于触摸按下 150 ms 后高亮，在滚动胜出时取消高亮（FR20），并在其中抬起且没有滚动接管触摸时激活（FR20）。当一个控件位于可滚动容器中，或位于没有固定祖先的可滚动页面内容中时，它就在滚动视图内；位于固定栏（顶栏、标签栏、工具栏）中的控件则不在。滚动视图内的控件在高亮前同样经历 150 ms 延迟，随后遵循其控件配置；150 ms 延迟只在滚动视图内适用。若某个控件自身的记录规定其在拖拽期间保持按压，则它保持按压：Slider 的叠层停留在被拖拽的滑块上（`design:user-states` DR4）。在每一种触摸平台上，本规则为触摸呈现修订 `design:user-states` DR1（保持期间的按压叠层）与 DR3（被按住且选中的 SegmentedControl 项保留其抬升的选中表面；只有其按压时序遵循控件配置）、`family:buttons` 的按压处理，以及 `module:DropdownMenu/useMenuPress` FR6：在手指下，菜单行采用单元格配置。行可以容纳、因而无法滚动的菜单（`module:DropdownMenu/useMenuPress` FR4）不给其行 150 ms 延迟：它们在触摸按下时高亮。可以滚动的列表则保留该延迟。列表中无法被任何滚动认领的按压保持未被认领，这是 FR19 所允许的（DEC-14）。FR6 关于菜单中至多一行被点亮的规定仍然成立，因此从一行滑到另一行的手指只点亮其下方的行。主题的 `:active` 覆盖使用组件自身的按压绘制来绘制：在粗略指针下，只在 Core 认为按压成立期间（被按压元素上或其周围有 `data-astryx-press="on"`），因此从控件开始的滚动绝不会显示它；在精细指针下，则从按压开始就显示。
- **FR12 — 长按与橡皮筋按用途而定。** 长按必须使用其 UIKit 对应物所用的阈值：普通长按为 0.5 s 与 10 pt，上下文菜单与菜单则使用实测值。橡皮筋必须使用其用途所测得的系数。
- **FR13 — 触摸呈现的统一规则。** 触摸呈现在粗略主指针下生效，且仅在注水之后：服务端渲染与注水中的渲染都产出指针呈现（`spec:AST-013` FR9）。当呈现还取决于尺寸时，紧凑由 `spec:AST-012` FR9 与 `architecture:public-component-api` INV17 管辖。呈现只按自身记录所列的条件请求（日期与时间表只请求指针条件，`spec:AST-043` FR1）。以字面触摸媒体查询为条件的样式符合要求，因为服务端与注水中的标记完全相同（DEC-6）。触摸呈现是组件在此条件下新增的外观与按压时序：抬升、以底部表替代气泡、从触发元素生长、命中区域扩大（FR42）、触摸按压时序（FR11）与触感（FR23）。它绝不决定某个部件是否跟随指针，也不决定手势的沉降是否以弹簧方式回弹（FR43、FR45）。在点按组件中，它的其他运动播放主题的时长与缓动 token，在手势组件中则播放其弹簧（FR45）；其退场按 FR7 所述播放。
- **FR14 — 嵌套滚动遵循原生规则。** 从滚动区域内开始的拖拽归属谁，必须在拖拽开始时一次决定。若该区域处于其边缘且拖拽朝该边缘移动，则由周围表面（如底部表）接管拖拽；否则该区域在整个手势期间保留它，并在其边缘产生橡皮筋效果。拖拽不得在中途易手，无论朝哪个方向，只有一个例外（DEC-28）。在底部表最高的档位，把其内容拉过末尾的拉动会延续为表的拉伸，反向移动则把它交还给内容（`component:BottomSheet` FR18）。在每一种触摸平台上，本规则为触摸呈现修订 `spec:AST-025` FR14（默认的滚动链）。
- **FR15 — 识别器的仲裁方式与 UIKit 一致。** 看到同一触摸序列的识别器默认必须互斥：先识别者胜出，其余失败，除非两者都允许同时识别。要求另一个识别器失败的识别器必须保持其识别直到该识别器失败，且若该识别器识别成功则必须失败。当多个识别器在同一事件上识别时，最内层元素的识别器必须胜出。观察者不受此互斥约束：它们与认领的胜出者并行识别，胜出者绝不使其失败或取消它们（DEC-7）。
- **FR16 — 手势沿用事件时钟。** 识别器必须从输入事件的时间戳读取时间。时长（长按、两次点按之间的间隔）必须是该时钟上的截止时刻，因此主线程阻塞只会延迟报告，绝不改变所报告的时点。
- **FR17 — 原生读数。** 识别器的阈值必须遵循 UIKit 的实测值（FR1、FR2）。平移在任一轴上位移达 10 pt 时开始（附着在带内元素上的屏幕边缘平移为 15 px，FR18），且其平移量不含该段位移。释放速度由 `spec:AST-100` 管辖。
- **FR18 — `touch-action` 把其余部分留给浏览器。** 带触摸识别器的元素必须获得一个 `touch-action`，恰好把其识别器未使用的部分留给浏览器：受限单轴的平移或滑动留出另一轴，点按与长按用 `manipulation`，单向平移或与原生滚动共享同一轴的平移则全部留出。除非附着了捏合或旋转识别器，否则必须保留 `pinch-zoom`。推导出的值与元素自身作者的 `touch-action` 相交，且绝不比它更宽（DEC-8）；当作者的值省略了 `pinch-zoom` 时，作者的值胜出。屏幕边缘平移只对落在边缘带内的触摸认领 `pan-x`，该带在该边缘宽 40.2 px（UIKit 在 402 px 宽屏幕上的实测边缘区域；它是否随屏幕宽度缩放，在第二个屏幕宽度实测之前只是一种猜测），而在带内它在位移达 15 px 时判定（UIKit 的屏幕边缘滞后）；在带外，作者的滚动不受影响，其他所有认领都由 FR19 的 10 px 管辖（DEC-13）。该带的 `pan-x` 认领与 15 px 起点，适用于屏幕边缘平移附着在位于带内的元素的情形；对于超出该带、其 `touch-action` 无法按触摸逐次认领的元素，带内的触摸与所有其他认领一样按 FR19 的 10 px 判定。
- **FR19 — 认领必须及时，且只能由所有者作出。** 识别器为每一个指针附着，FR43 的例外除外。本规则只管辖本记录的行为；`spec:AST-057` 按其所记录的方式，为行滑动保留其逐事件的指针读取。跟踪其组的 `family:action-groups` 成员（`family:action-groups` FR1），在 FR24 允许的范围内保留组元素上的一个 `pointerdown` 监听器，在成员需要之处可取消，只在按压期间添加 document 监听器并在释放时移除，并可从释放起直到该手势的 click 为止，安装一个每 document 一次的 click 吞掉器（DEC-17）。开始识别的识别器必须通过其元素上的非被动监听器取消 `touchmove` 来认领其触摸；从不认领的观察者则免于此项（DEC-7）。没有任何识别器拥有的触摸的 `touchmove` 不得被取消，但有五个例外。模态呈现下的滚动锁持有页面期间，若某单指触摸的平移会滚动页面，它可以取消该无人拥有的触摸的移动；第二根手指绝不被取消（FR10），且页面保留捏合缩放。取得页面滚动锁的模态遮罩在持有锁期间还会阻止页面的下拉刷新与过滚动回弹，并随锁的释放一并恢复。控件的按压一旦交付，在拖拽期间保持按压的控件（FR11）即拥有其触摸，并可取消该手指的移动。滚动边缘平移，例如底部表从处于边缘的滚动区域拉出（FR14），可以从第一次移动起取消其触摸的移动，但仅限于手指下方每个滚动容器都处于其边缘、且拖拽朝该边缘移动期间（FR14），且只取消浏览器会产生橡皮筋效果的那些移动，绝不取消真实滚动；平移本身仍按 FR17 的 10 pt 开始，正如 UIKit 的表拉拽那样（DEC-18）。在取消前等待点按抖动过去的滚动边缘平移，仍必须在保留下来的移动可能提交原生平移之前完成取消（DEC-29）。toast 的滑动可以从朝其关闭边缘的第一次移动起取消其触摸的移动（`component:Toast` FR4）。在其触摸移动期间被取消的识别器（非因浏览器接管该触摸，FR20），例如开始后被拖过其容差的长按，会继续拥有该触摸直到其抬起，并可取消其移动，因此拖拽绝不中途变成页面滚动（FR14）；识别器被取消时处于静止的触摸，以及要求另一个识别器失败的识别器在该识别器识别成功时的每一个触摸，都会被交还（FR10）。与原生滚动竞争的识别器必须在位移 10 px 内判定，即在浏览器提交滚动之前；带内元素上的屏幕边缘平移不给浏览器留下水平滚动，在 15 px 内判定，而更宽元素上的则在 10 px 内判定（FR18）。只有带有必须在手势中途认领的识别器的元素才注册那个阻断型监听器；其识别器只在抬起时判定的元素，其 `touchmove` 监听器保持被动，其 `touchend` 监听器保持可取消，以便手势能取消 click（FR21）。当一个元素本身、或它所处的元素带有认领移动中触摸的识别器，且在合成器上移动时（iOS WebKit），document 可以携带一个非被动 `touchmove` 监听器；它只取消本规则下识别器拥有的触摸的移动，并在运动结束时移除。它开启期间，页面上任何位置开始的原生滚动都要等待主线程空闲。已知限制：在 iOS Safari 与 Chromium 中，从带阻断监听器的元素上开始的原生滚动会等待主线程空闲。这绝不会比 UIKit 更差——UIKit 的滚动在主线程繁忙时会停止——而被动监听器，或在 `touchstart` 时添加的监听器，会把斜向拖拽交给滚动。
- **FR20 — 浏览器可以接管触摸。** `pointercancel`、手指第一个不可取消的 `touchmove`，或触摸下方的原生滚动，必须算作浏览器接管触摸；`touchmove` 只有在浏览器能沿手指主轴滚动时才算，原生滚动只有在该手指已移动了滚动接管距离后（FR2）才算，因此静止手指下的亚像素移动不会取消点按（DEC-8）：与其共享该触摸的潜在识别器失败，活跃的识别器被取消，视图的按压在没有释放的情况下被取消。主轴是指手指自触摸按下以来移动更远的那个轴，相等时为水平轴；当触摸下方某个滚动容器在该方向还有空间，且它们之间每一层 `touch-action` 都允许该平移时，浏览器就能沿其滚动（FR18）。该手指后续的不可取消移动绝不计入。从不认领的识别器（观察者）只注册被动监听器（`architecture:react-component-runtime` INV3、INV5），且浏览器接管触摸时观察者不会被取消：它跟随滚动直到抬起（DEC-7）。
- **FR21 — click 跟随手势。** 手势接管触摸时，其 `touchend` 必须被取消，且没有任何 click 或兼容鼠标事件到达页面。手势宿主在该抬起时装设的 click 守卫会吞掉它们：那个 click，以及 WebKit 在被按住点按的被取消 `touchend` 之后发送的迟到 `mousedown` 与 `mouseup`。为可能仍会识别的识别器（可能被双击认领的点按）而保留的 click，若该识别器失败，必须在其目标上重放。`detail === 0` 的激活（键盘、辅助技术）必须始终通过。点按不得等待浏览器的双击延迟。
- **FR22 — 平台保留其边缘手势。** iOS Safari 从屏幕边缘的返回滑动与 Android 的系统返回手势必须始终归浏览器与系统所有；触摸呈现绝不覆盖它们。

### Menus and popovers under a finger

FR26–FR28 与 FR30 适用于每一个承载 `module:DropdownMenu/useMenuPress` 按压模型的表面（DropdownMenu、ContextMenu、它们的子菜单，以及 Selector 的列表框，其选项按行计），在每一种指针下皆然（FR43）；FR29 在同一条件下适用于 DropdownMenu 的触发元素；FR34 适用于菜单；FR31 适用于锚定菜单与手指下的 Popover，FR35 适用于其所列的各入场；FR32 与 FR33 只适用于菜单。鼠标保持 `module:DropdownMenu/useMenuPress` FR1–FR3 与 DEC-3，因此在菜单外释放的鼠标会关闭该菜单。

FR26–FR28 是 `family:action-groups` 的共享规则：每个成员，不只是菜单，都在该族的范围内遵循它们（DEC-17）。菜单在其外部释放后是否保持打开，仍由菜单自行决定：FR28 规定在手指下保持打开，而鼠标遵循 `module:DropdownMenu/useMenuPress` FR3 与 `component:Selector` FR7。

- **FR26 — 抬起时判定。** 菜单行必须在其上手指抬起时动作，绝不因为按压始于其上而动作；从未离开其行的按压是一次点按，在该行上动作。一个手势至多动作一次：该手势对应的浏览器 click 不触发任何动作。
- **FR27 — 高亮跟随手指。** 手指按在打开的菜单中时，被点亮的行必须是其下方的启用行，而在分隔线、标题、禁用行之上或菜单之外不点亮任何内容。至多一行被点亮；按压起始的那一行在手指离开后不再保留按压外观（FR11）。
- **FR28 — 在外部抬起保持菜单打开。** 始于菜单内而在其外抬起的手指不得触发任何动作，并让菜单保持打开。第二根手指会结束该手势，正如失去焦点或被取消的触摸那样（FR44）：不触发任何动作，已点亮的行清除。
- **FR44 — 失去焦点或取消会结束每一次按压。** 窗口失焦，或浏览器取消指针，会结束手势宿主所跟踪的任何按压，在每一个表面上、对每一次触摸与笔皆然，且之后抬起时不触发任何动作；跨过失焦保持按下的鼠标按键保留其 click。
- **FR29 — DropdownMenu 在按压时打开，并带有打开手指的移交。** 本规则只涵盖 DropdownMenu 的触发元素；ContextMenu、子菜单行与 Selector 保留各自的打开方式。在手指下，固定栏中的 DropdownMenu 触发元素必须在手指按压时打开其菜单。滚动视图内的触发元素（FR11）必须在 150 ms 的内容触摸延迟已过且没有滚动接管触摸之后（FR20）打开它，或在更早结束的一次点按的抬起时打开；先接管触摸的滚动（FR20）会将其接管，什么也不打开。在打开之前，手指移动不得超过漂移允许量（FR2）。在按住的手指下打开之后，不点亮任何行，且在该手指从打开的菜单所见的最初位置起移动了移交距离之前，抬起不触发任何动作；此后 FR26–FR28 适用。`presentation="popover"` 保留今日的点按打开方式；默认值未设置（`architecture:public-component-api` INV16）。延迟与距离是内部值，不新增 prop（`spec:AST-002` FR3）；设置了已发布的 `longPressDelayMs` 的 `module:DropdownMenu/useMenuPress` 调用方，无论在固定栏还是在滚动视图，都得到该等待，这保留了已发布的行为（`spec:AST-017` FR3）。
- **FR30 — 手指下的边缘自动滚动。** 手指按在可滚动的菜单中且停留在其顶部或底部边缘附近时，必须朝该边缘滚动菜单，且被点亮的行必须跟随此时位于手指下方的行。滚动在手指离开边缘、菜单到达其末尾或手势结束时停止。
- **FR31 — 菜单与气泡从触发元素生长并收缩回去。** 在手指下，在每一台触摸设备上，锚定菜单或 Popover 必须通过从其触发元素生长出来而打开，并通过收缩回其中而关闭。生长播放主题的入场时长与缓动 token（FR45）；收缩播放主题的退场时长与缓动（FR7）。收缩在表面关闭之后完整播放。这就是 FR7（`family:overlay-dismissal` AV6）下它的退场；在减弱动效下适用 FR8。以底部表呈现的菜单或气泡则改为遵循该表。
- **FR32 — 外部平移会关闭。** 在手指下，打开的锚定菜单必须在其外部的触摸开始平移时关闭，并在其外部点按或按住的抬起时关闭。Popover 的关闭行为不变。其上的捏合仍然可用：其表面绝不采用 `touch-action: none`，因此除非作者自己的 `touch-action` 省略了 `pinch-zoom`，页面保持可缩放（FR10、FR18；WCAG 2.2 SC 1.4.4）。对该外部触摸的监听在其结束后不产生任何开销（FR24）。调用方传入 `presentation="popover"` 的菜单保留其已发布的外部关闭行为（FR25）。
- **FR33 — 手指下的 ContextMenu。** 用手指或笔打开 ContextMenu 的长按，绝不在抬起时关闭它，而其外部的按压遵循 FR32。在按住的手指打开它之后，不点亮任何行，且在该手指从打开的菜单所见的最初位置起移动了移交距离（FR2）之前，抬起不触发任何动作；此后 FR26–FR28 适用。在每一台触摸设备上，按住的手指在块级触发元素上打开的 ContextMenu 必须把该触发元素抬到页面之上，并在其旁显示菜单，且不点亮任何行。菜单外的点按会关闭菜单，且不触达其下方的任何内容，关闭时触发元素回到原位。ContextMenu 的长按呈现是手势组件，因此抬起播放 `springs.contextMenuLift`，菜单的生长播放 `springs.contextMenuMorph`，而作为菜单退场一部分的返回播放 `springs.contextMenuDismiss`（FR7、FR45）。在减弱动效下适用 FR8。内联触发元素保留今日的菜单，以底部表呈现的菜单遵循该表，而 `presentation="popover"` 保留已发布的菜单但不带抬升（`architecture:public-component-api` INV16）。
- **FR34 — 手指下的子菜单逐层下钻。** 在手指下、于紧凑触摸屏上，`adaptive` 子菜单行必须逐层下钻：子菜单的行与开头的一行"Back to <parent>"在同一表面内替换菜单的行，不打开飞出层，且 Back 返回到打开它的那一行（`component:DropdownMenu` FR11 与 FR20）。层级之间的切换播放主题的移动时长与缓动 token（FR45）；在减弱动效下适用 FR8。
- **FR35 — 呈现入场期间不接受输入。** 在手指下，当触摸呈现仍在入场时落下的点按或拖拽——无论是正从触发元素生长出来的 Popover 或锚定菜单、警示（`component:AlertDialog`）、底部表、对话框、Drawer、MobileNav，还是 Lightbox——都不得关闭它、滚动页面、移动焦点，也不得触达其下方的任何内容；该呈现完成入场并保持打开。在非模态底部表周围，只按住落在该表上的点按或拖拽；页面保持活跃（`component:BottomSheet` FR11、`component:BottomSheetSwitcher` FR5）。只有指针输入被按住：按键与辅助技术保持活跃，内容仍留在无障碍树中。捏合仍然缩放页面（FR10）。入场期间适用本规则而不是 FR6 的捕获：入场先完成。鼠标保留今日的行为（DEC-16）。

### Release decisions

- **FR36 — 释放时一次判定。** 能够提交动作的拖拽必须在手指抬起时一次判定：若其预测位移（迄今位移加上释放速度乘以该用途的预测系数，FR3）达到该用途的提交点，动作即提交；否则表面回弹。表面沉降期间该判定不得改变。同一条规则支撑关闭 BottomSheet、Toast 或 Lightbox，弹出 NavigationStack，以及收起键盘；每个用途的提交点与预测系数都是实测值（FR1、FR2）。BottomSheet 的触摸释放采用 UIKit 实测的表值。其预测为释放速度的 0.1 s，其提交点为从最低档位到关闭的一半处。超过其实测轻扫速度的释放，落在其预测位置处或之后的首个位置，至少是其下一个位置。因此在最低档位的一次短促快速的轻扫会关闭它（`component:BottomSheet` FR19）。当所有者拒绝关闭并因此打开确认对话框时，表停留在窥视位置等待对话框关闭，而不是回弹（`component:BottomSheet` FR21）。行滑动保留 `spec:AST-057` 自身的释放规则。
- **FR37 — 回移会取消。** 速度指向起点的释放必须取消，无论迄今位移多少。
- **FR38 — 沉降延续指针。** 提交或回弹必须以释放速度开始（FR6），在每一种指针下皆然（FR43），所用的弹簧其时长为主题的 `tempo` 所缩放，其实测回弹由 `character` 按角色的固定权重调整（FR45）。在减弱动效下它遵循 `design:reduced-motion` DR2，而来自鼠标、触控板或笔的释放遵循 FR43。
- **FR39 — 动作从不需要拖拽。** 拖拽所提交的每一个动作也必须能在不拖拽的情况下达成，即可通过键盘与鼠标达成（`architecture:interaction-modality` INV4）。
- **FR40 — 释放速度。** FR36–FR38 所读取的速度由 `spec:AST-100` 管辖。

### Text selection

- **FR41 — 按住的手指做按住该做的事，而不是做选择。** 点按如今天一样激活，且绝不用来选择文本。在按住会产生动作的元素上——例如 ContextMenu 触发元素，或带上下文菜单的行（FR12 阈值下的长按），或自身记录定义了按住动作的控件，例如滑块的手柄或步进器的按住重复——按住就执行该动作，且浏览器的文本选择启动与浮出菜单仅在该次按压期间被抑制，在抬起或取消时解除；该元素的文本不能通过长按选择，且 Astryx 不向菜单添加 Copy 项。元素既有的常开抑制保持原样。在按住不产生动作的标签或纯文本上——例如复选框行的标签——长按会原生地选择，并带浏览器的选择手柄；任何其他元素遵循其自身记录。
  手指按在控件自身的盒（其非文本部分）上不会启动文本选择；抬起它会像点按那样激活控件。其旁边的文本保持原生选择。
  键盘与辅助技术的选择行为不变。笔的按住与手指相同；鼠标通过右键点击而非长按发出上下文请求（FR43），其余情况下保留其已发布的行为（`spec:AST-017` FR59；DEC-9）。识别器认领的鼠标或笔拖拽在该次拖拽中不接管新的文本选择，也绝不清除已有选择；从可选文本上开始的拖拽不被认领。未被认领的鼠标拖拽保留其已发布的行为。

  指导：若调用方的菜单元素带有人们可能想要复制的文本，则它应在菜单中提供 Copy 动作。

### Haptics

- **FR23 — 触感只在原生对应物播放它们的时刻出现。** 触摸呈现必须只在其 UIKit 对应物播放触感的时刻播放触感。在 iOS Safari 中，页面能产生的唯一触感是真实点按落在 `<label>` 或开关复选框上时的一次轻微冲击；UIKit 标记为拖拽中途或抬起之后的时刻，在那里没有触感，组件会记录这一差距。在平台提供 `navigator.vibrate` 的地方，以它代替。

### Resources and compatibility

- **FR24 — 手势工作在其未被使用之处不产生开销。** 不使用手势的组件不注册任何手势监听器、观察器或定时器，且在触摸呈现被禁用时没有一个是活跃的。在精细指针下，使用手势的组件只在其自身元素上监听，且只在按压期间添加 document 监听器，并在释放时移除（FR43）；共享的按压控制器与菜单按压模型的杂散 click 吞掉器（`module:DropdownMenu/useMenuPress` PR2）每页各安装一次，按一计而不按组件计，动作组的释放时装设 click 吞掉器（FR19）计入按压工作，而认领型识别器为手指准备的 `touchmove` 监听器（FR19）在此预算之外计算。`document` 或 `window` 级触摸监听器的数量不得随组件实例数量增长，重复的行或单元格不添加自己的触摸观察器，最后一个实例卸载后不留下任何与触摸相关的东西（`architecture:react-component-runtime` INV5、INV7）。
- **FR25 — 被移动的默认值保留回退方式。** 当触摸呈现改变某个已发布的默认值时，回退方式与其发布说明由 `architecture:public-component-api` INV16 以及 `spec:AST-017` DEC-23 与 FR3 管辖。本记录改变了四处：Selector 的 `adaptive` 呈现策略；DropdownMenu 被省略的 `presentation`（已发布为 `'popover'`，由 `presentation="popover"` 保留，FR29）；ContextMenu 被省略的 `presentation`（已发布为 `'popover'`，由 `presentation="popover"` 保留但不带抬升，FR33）；以及 `module:DropdownMenu/useMenuPress` 已发布的 500 ms `longPressDelayMs`，调用方通过传入它而保留（FR29）。这以 FR13 的规则取代 `component:Selector` DEC-1 的宽度与指针查询来处理 `adaptive`。

- **FR42 — 默认外观不为触摸增大任何盒。** Astryx 的默认外观不为手机或触摸增大盒的尺寸：行高、控件尺寸与目标尺寸保持原样；盒可以为适应紧凑屏幕而收缩，例如警示在手机上的宽度。字体尺寸不在本规则之内，包括仅随其文本增长的盒，例如其标签遵循 16 px 阅读基准的 Button：16 px 移动阅读基准（`design:mobile-typography` DR1、DR3）与 16 px 文本输入下限（`family:input-fields` FR9）不受影响。在粗略指针下，触摸目标朝 44 × 44 px 增大，最多增大到邻近目标的一半处，且绝不小于控件自身的盒（所有者决策，2026-11-04；`spec:AST-094` FR42）。它通过一个不可见的命中区域增大。命中区域的扩大绝不与相邻交互元素自身的目标重叠：当相邻元素相距小于 44 px 时，扩大被限制为间隙的一半，或跳过，从而使每个元素保持可达；由组件或模块记录刻意设置的扩大，例如 `component:Thumbnail` AR4 的，不受影响。移动端尺寸的增大属于主题适配（DEC-20）。
- **FR43 — 手势在 Web 上可用。** 手势为每一个指针附着：鼠标、笔与手指，而不只是粗略主指针。跟随指针拖拽的部件——例如开关或滑块的手柄、底部表、分页器、选择轮或行——同样跟随鼠标、笔、触控板与手指，在其末端之外有相同的橡皮筋效果，只要其记录允许该指针拖拽它，且来自其中任何一个的释放都按 FR45 的弹簧从释放速度沉降。以下保持关闭：鼠标拖拽下的行滑动动作（那会接管浏览器的文本选择与原生拖拽），而触控板的水平滚动可以滑动行（`spec:AST-057` AR2、DEC-7）；笔下的捏合；鼠标、触控板或笔下的屏幕边缘平移；鼠标下跨动作组的滑动，以及在触摸呈现之外的任何指针下（`family:action-groups` FR1）；以及 44 px 的粗略指针触摸目标，它保持仅限粗略指针，且绝不与邻居的目标重叠。在 Web 上，平移在其记录允许之处接管触控板的双指滚动，绝不接管鼠标滚轮的格数。一次滚动只有在带有 Chromium 与 WebKit 的触控板特征时才属于触控板：像素增量中 `wheelDelta` 是增量的三倍，且没有整格（`wheelDelta` 为 120 的倍数而增量为 40 px 的倍数），也没有加速鼠标的余数（小数部分小于 0.01 px）。任何其他滚动，包括 Shift+滚轮与倾斜滚轮，都属于鼠标滚轮，而鼠标滚轮滚动其下方的对象。设置值的手柄——滑块的手柄，或在其平移处开关的手柄——两者都不接管，因此其上的滚动会传给其下方的滚动（DEC-23）。Web 不报告触控板的接触或阶段，因此由一个分路器读取每一条触控板事件流（DEC-24）：手指移动期间，垂直平移上 180 ms 的停顿或水平平移上 220 ms 的停顿会结束手势；手指的抬起在收缩序列的第四个或更晚的增量处读取，此时该序列已失去五分之一的大小；抬起后的动量绝不移动表面，也绝不延续手势；而在动量期间，一次反向、一次逆衰减上升的增量，或一次 50 ms 的间隔，会在没有指针移动的情况下开始新手势；延续滑行减速的迟到合并 wheel 事件属于同一次轻扫。当分路器尚未在抬起与手指仍在移动之间作出判定时，表面以手指的末速继续移动，绝不超出该速度在保持的增量上所能带到的距离；随后抬起会无停顿地延续，而仍在移动的手指则补上差额。在抬起时释放的平移以手指的末速释放（FR36）；事件流停止的平移则以静止状态释放。窗口失焦或页面隐藏会取消触控板平移，正如浏览器接管触摸会取消手指的平移。捏合接管 ctrl+滚轮，并在其最后一个事件之后 100 ms 结束。BottomSheet 的拉拽跟随触控板，正如它跟随手指：滑动无法关闭的表（`purpose` 为 `form` 或 `required`）在手指与触控板上都会按 FR3 的橡皮筋越过其静止位置拉伸，相同的位移给出相同的拉伸，触控板的拉拽不超过表的高度，并在释放时回弹；`info` 表在轻扫时或越过其关闭距离时关闭，否则回弹（FR36、FR37），而所有者拒绝的关闭按 `component:BottomSheet` FR21 所述停留；鼠标滚轮绝不移动表。分页器跟随触控板滑动，从不离开滑动起点超过一页，并在其首页与末页处有橡皮筋效果；它在超过半页时或一次轻扫时提交，绝不在使其移动不足十分之一页的速度尖峰上提交，而落在沉降期间的一次滑动从该沉降所在的页开始，因此连续滑动可以逐页推进。滑动行从越过其 8 px 起点的第一个事件起跟随触控板滑动，并在释放时按位置与速度沉降到最近的档位，而长而快的滑动在 `spec:AST-057` 允许整滑之处触发最外侧的动作；在一个手势之内，已打开的行只会关闭，绝不越过静止位到其另一侧。每一次被跟随的触控板平移都走同一条共享路径（分路器、平移、吸附点拖拽与动画器），组件只声明其档位与动作，行滑动的档位与动作属于 `spec:AST-057`。一个共享的上下文请求模块 `gestures/contextRequest.ts` 应答手指或笔的长按、右键点击，以及 Shift+F10 或上下文菜单键。它每个手势只发出一次请求，指明发起请求的输入，并保持浏览器自带的菜单关闭。按住若被另一个识别器先作出认领，则败下。无头上下文菜单（`spec:AST-107` FR8）通过它发出请求，而 ContextMenu 通过该菜单发出（`component:ContextMenu` FR10）。一个模块使这些规则在每个菜单中保持一致。按压模型有一个无延迟的精细指针配置（FR11）；当主指针为精细指针时，用鼠标、触控板或笔进行的重排从其手柄拖拽即开始，无需按住，而当主指针为粗略指针时，笔仍沿用手指的按住（`spec:AST-103` FR3）。在精细指针下，只有使用手势的组件才监听（FR24），而在减弱动效下，来自鼠标、触控板或笔的释放，在主指针为粗略指针时遵循 `design:reduced-motion` DR2，否则遵循 DR3；且手势不增加任何样式表字节（DEC-21）。

### Platform support

- 支持的引擎：Astryx 所支持的浏览器（`spec:AST-013`）并具备触摸输入，在 iOS 与 Android 上；以及就 FR43 而言，带鼠标、触控板或笔的桌面浏览器。触控板只在报告 `wheelDelta` 的浏览器（Chromium 与 WebKit）中驱动平移；在其他地方，每一次滚动都按鼠标滚轮计（FR43）。参考版本上的 UIKit 是对等参照，而非支持下限；较旧的 iOS Safari 在其引擎支持之处获得相同行为，Android Chrome 也获得相同行为。这以一条针对触摸呈现的显式 Android Chrome 支持条目修订 `spec:AST-013` FR3。
- 不支持的行为：在 FR23 所允许的时刻之外的触感。当引擎无法在其合成器上运行动画曲线时，动画仍会播放，并仍以其已提交的状态结束。
- 浏览器证据：在带手机模拟的 Chromium 中证明主线程繁忙以及动画期间无布局或绘制，在 WebKit 中证明主线程繁忙，通过跳转正在运行的动画来采样曲线，就每一条关于参照值的声明提供 iOS 模拟器录屏，就每一条关于 iOS Safari 行为的声明提供真机证据，以及就每一条关于 Android Chrome 行为的声明，使用 Android 模拟器中在确切 head 上带 Gboard 的 Chrome，或依据 DEC-31 追溯到它，并分别在动画正常缩放与动画移除的情况下，外加一个慢速设备配置，且不做人工设备检查（`spec:AST-013` FR10、DEC-27、DEC-31）。
- 呈现命中测试（FR11 与 FR19 中的 iOS WebKit 语句）：模拟 iOS WebKit 在运动起点所做命中测试的单元测试，关闭该修正作为对照的 WebKit 点按与拖拽证明，并以 iOS 模拟器作为合并闸门；其真机证据在合并之后跟进。

## Current-state impact

- `architecture:theme-tokens` 与 `architecture:theme-authoring-contract`：三个运动旋钮加入运动配置（FR4、DEC-15、`spec:AST-108`）。
- `architecture:interaction-modality`：触摸呈现条件（FR13）与共享的模态状态并列，且 INV13 让每个操作组只有一处按压跟踪（DEC-17）。
- `architecture:react-component-runtime`：FR24 陈述了 INV5 与 INV7 在触摸工作中对调用方可见的结果；两者均未改变。
- 在 FR41 之下：ContextMenu 的触发器、DropdownMenu 的内置触发器及其菜单，以及 Slider 的轨道，已在任何时候都关闭选择（各菜单还关闭 callout），这保持不变。今天，手指按住其他行以及带按住操作的控件，仍可能启动选择或 callout，且不存在共享的、以按压为作用域的抑制机制。
- `family:buttons`：控件与单元格的按压配置（FR11）。
- 每个浮层成员各自的记录（Dialog、BottomSheet、Drawer、Popover、各菜单）：其触摸退出与其 Reduce Motion 交叉淡化（FR7、FR8），因为成员各自拥有自己的动画（`family:overlay-dismissal` AV6）。
- `design:reduced-motion` 拥有 FR8 所适用的 reduced-motion 规则。
- `component:Selector` DEC-1：`adaptive` 通过 FR13 的触摸规则解析（粗指针与 `spec:AST-012` FR9 的紧凑定义），而不是它自己的宽度加指针查询，并以 `presentation` 作为回退途径（FR25）。
- `component:DropdownMenu` 与 `component:ContextMenu`：省略的 `presentation` 以 `'popover'` 发布，在手指下遵循 FR29 与 FR33；`presentation="popover"` 保留已发布的行为（FR25）。
- `module:DropdownMenu/useMenuPress`：已发布的 500 ms `longPressDelayMs` 默认值让位于 FR29 的时序；传入该值的调用方仍保留它（FR25）。
- `module:DropdownMenu/useMenuPress`：其手指与触控笔规则（FR1–FR3、FR6、FR7、FR9、FR11）在每种主指针下遵循 FR26–FR30、FR33 以及 FR11 的配置；其鼠标规则（FR1–FR3 中的鼠标部分）与其非手势规则仍留在该模块中。
- `spec:AST-057`：触控板的水平滚动会滑动一行（DEC-7），跟随手指并停靠到最近的档位（FR43）；鼠标拖拽与鼠标滚轮则从不如此。
- `component:BottomSheet`：`form` 或 `required` 的 sheet 在手指下越过其静止位置时会像在触控板下一样回弹（FR3、FR43），相同行程产生相同拉伸；鼠标滚轮会滚动其内容，且从不移动它。越过其最高档位后，每根手指的拉动都会在 FR3 的橡皮筋效果上拉伸它，且没有保持，其后的保留区足够深，可容纳整个拉伸与释放，除非调用方设定其尺寸或样式（`component:BottomSheet` FR18）。一旦内容无法朝该方向滚动，对内容的拉动也会如此（`component:BottomSheet` FR18）。越过其最高档位后，鼠标与触控笔保持 FR18 至多 48 px 的受阻拉伸，这是 FR43 同一橡皮筋的例外（`spec:AST-017` FR59）。实现缺口：在静止位置以下，手指拖动它是 1:1 的。
- 共享分页器（Carousel 的分页呈现、Lightbox 的查看器）：在 Lightbox 的查看器与 Carousel 的分页呈现中，触控板滑动在每种指针下都遵循 FR43 的分页器规则（`component:Lightbox` FR11）。
- 共享分页器的循环运算：`hooks/usePager.ts` 导出 `mod` 与 `nearestLoopCopy`，DateInput 的循环选择器滚轮同时导入两者（`component:DateInput` DEC-3）。
- `architecture:react-component-runtime` INV13：手势在 FR24 的监听器预算之内为每种指针挂载。
- `design:user-states` DR1、DR3 与 `family:buttons`：按压时序在每种指针下遵循 FR11 的配置，包括精细指针配置。
- 菜单按压模型之外的每个 `family:action-groups` 成员：在触摸呈现下，滑过相邻操作的按压会作用于抬起时所在的操作（FR26–FR28）（`family:action-groups` FR1）。
- 粗指针下的每个组件：不会为触摸而放大任何盒子，触摸目标只有在被相邻元素夹紧的不可见命中区域内才达到 44 px，除非某个组件或模块记录自行设定（FR42）。
- `component:DropdownMenu`、`component:ContextMenu` 与 `component:Popover`：在手指下，它们按各自适用范围遵循 FR26–FR35。Popover 的输入保持（FR35）从打开后的第一帧开始，因此落在那一帧内的触摸会到达页面。
- `component:AlertDialog`、`component:Dialog`、`component:BottomSheet`、`component:BottomSheetSwitcher`、`component:Drawer`、`component:MobileNav` 与 `component:Lightbox`：在手指下，入场期间的轻点或拖拽会被保持（FR35），这是入场期间对 `component:BottomSheet` FR7、`component:BottomSheetSwitcher` FR6、`component:Popover` DEC-8（以 sheet 形式呈现的 Popover）、`component:MobileNav` FR4 与 `family:overlay-dismissal` AV4 的例外，后者平时允许遮罩或浮层上的轻点在任何时候关闭（`spec:AST-003` FR10 与 `architecture:layer-runtime` INV14 把关闭交给组件）。Toast 与非模态 sheet（`component:BottomSheetSwitcher` FR5 及其 Non-modal 状态）不保持页面：其后的页面保持活动，只有 sheet 自身在入场期间保持轻点或拖拽。Dialog、Drawer、MobileNav 与 DropdownMenu 只在粗主指针下保持入场：当主指针为精细且屏幕同时支持触摸时（触摸屏笔记本电脑），入场期间手指的轻点或拖拽不会被保持。在手指之后，自那以后未移动过的鼠标的第一次按压，会在页面最后听到鼠标的位置穿过入场呈现的屏蔽层。屏蔽层在升起时读取该点，并在手指或触控笔的每次按压或移动时再次读取。覆盖视口的屏蔽层只对鼠标在最后读取的那个点开放，若页面到那时尚未听到鼠标，则完全不开放。它还会在为它升起时已经按下的每根手指或触控笔所在处开放，且该开放会跟随按压直到抬起。停在其他任何位置的静止鼠标会按到屏蔽层，其按压不产生任何效果。非模态 Drawer 只遮蔽其面板，且该屏蔽层只有在最后读取时页面未听到鼠标时才挡住鼠标。鼠标的移动会先降下屏蔽层。
- BottomSheet、Toast、Lightbox、NavigationStack 与键盘关闭：提交的拖拽遵循 FR36–FR40。
- `spec:AST-100` 拥有释放速度，FR17 会读取它。
- 在 FR45 之下，由轻点、按住、按键或程序启动的运动，在轻点组件中播放主题的时长与缓动 token，在手势组件中播放组件从静止开始的弹簧，在手指下与在鼠标下相同。陈述此类运动的记录承载它：在 token 方面，`component:DropdownMenu` FR21、`component:Popover` FR9、`component:AlertDialog` FR6、`component:TreeList` FR8 与 `component:ProgressBar` FR4；在弹簧方面，`component:Switch` FR9、FR10 与 FR15，`component:SegmentedControl` FR9 与 FR10，`component:Slider` FR7，`component:ContextMenu` FR5，`component:Lightbox` FR5、FR12 与 FR16，以及 `component:DateInput` FR14。轻点组件的触摸退出若由轻点、按键或程序启动，会播放 `spec:AST-090` 的 `--duration-exit` 与 `--ease-exit`，且没有任何退出开关会移除它（FR7；`spec:AST-090` FR14 与 DEC-5 承载它）。在 Switch 与 SegmentedControl 上，触摸呈现下的每次变化都落在弹簧上，如今天一样；没有触摸呈现时，单击、按键或值变化保持主题曲线，不变。实现缺口：在粗指针下，ProgressBar 的填充仍以线性方式运动，时长为 `progress.fillTrackMs` 乘以轨道移动的比例（`component:ProgressBar` FR4）。
- 在 FR45 之下，滑动行是一个手势组件：由轻点或 Escape 启动的关闭或返回（`spec:AST-057` FR5、FR7）播放该行从静止开始的弹簧，而将其关闭的滑动则从释放起保持其测量得到的弹簧。
- 在 FR45 之下，RefreshControl 的 endRefreshing 是例外：它从主题的时长 token 与 UIKit 测量得到的曲线出发，播放 UIKit 测量得到的 300 ms ease-in-out 曲线，因为没有任何从静止开始的弹簧能在容差内与之匹配（iOS 26.2 模拟器，2026-11-07）。该曲线通过时长 token 跟随主题的节奏，因此更慢的主题仍会使其变慢。
- 在 FR45 之下，`spec:AST-107` 的 `settleTo` 以及不带速度的 `animate` 调用，为没有手势驱动的运动播放弹簧。在各自的记录承载 FR45 之前，它们保留各自的弹簧。
- 在 FR43 与 FR45 之下，跟随指针的部件在每种指针下都跟随，且其释放从释放速度起弹：`component:Switch` FR15 的拇指在鼠标或触控笔下、`component:Slider` FR7 在鼠标或触控笔释放后的滑行、`component:SegmentedControl` FR10 在鼠标或触控笔释放后的停靠，以及 `component:DateInput` FR15 的滚轮在触控板下并在 sheet 显示的任何位置。实现缺口：Switch 的拇指不跟随鼠标或触控笔，Slider 的鼠标与触控笔释放不会滑行，SegmentedControl 的鼠标与触控笔释放以主题时长滑动，DateInput 的滚轮只在粗主指针下接受触控板。
- `design:user-states` DR1 与 DR3、`spec:AST-025` FR14 与 `spec:AST-013` FR3 各自带有针对触摸呈现的修订（FR11、FR14、Platform support）；`design:motion` DR3 与 DR5（草案）按 FR4 与 FR8 的陈述被偏离或被满足。
- FR6 缺口：在页面自身的 frame 或 ResizeObserver 回调内进行的重定向，会晚一帧显示其新曲线。
- FR6 缺口：在合成器资源匮乏时，Chromium 可能在构建该帧的主线程帧之后 40 到 60 ms 才显示某一帧。此时重定向会先在其曲线中已走过那么远的位置显示：在负载下的 Switch 上最多 6.5 px。
- FR6 缺口：停靠期间发生尺寸变化时，若它使该行越过新的最后一页，或该停靠是在视口尚无宽度之前开始的，则会丢弃其速度。该行会立即落到其目标上。
- 使用方文档：在某个组件发布其触摸呈现之前没有；每个组件记录自己的内容，包括保留已发布表面的 `presentation` 值（FR25）。

FR45 所移动的运动，按组件列出。每个组件的记录承载自己的那一行，Carousel 除外——它的触控板分页由本记录通过共享分页器陈述（FR43）：

| Component                   | Motion                                                     | Today                                                 | Under FR45                                                                                                                   |
| --------------------------- | ---------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Switch                      | 触摸呈现下由轻点、按住、单击或按键触发的拇指行程与轨道颜色 | 测量得到的 switch 弹簧                                | 拇指从静止开始的 `switchControl.travel` 弹簧                                                                                 |
| Switch                      | 无触摸呈现时由单击、按键或值变化触发的拇指行程与轨道颜色   | 主题曲线（`--duration-fast`、`--ease-standard`）      | 不变：主题曲线                                                                                                               |
| Switch                      | 手指按压时的拇指抬起，带有最短抬起时间                     | 测量得到的抬起与停靠弹簧                              | `switchControl.lift`（手势组件）                                                                                             |
| Switch                      | 鼠标或触控笔的拖拽                                         | 拇指在释放前不动，随后按主题时长                      | 拇指跟随；释放从其速度起弹                                                                                                   |
| Slider                      | 手指下的拇指抬起与落下                                     | 测量得到的抬起与落下弹簧                              | `springs.sliderLift` 与 `springs.sliderDrop`（手势组件）                                                                     |
| Slider                      | 鼠标或触控笔的快速一拨                                     | 在释放时结束                                          | 像手指一样滑行并停靠                                                                                                         |
| DropdownMenu, Popover       | 手指下从触发器展开并缩回                                   | `springs.menuOpen`、`springs.menuClose`               | 主题入场 token；主题退出时长与缓动                                                                                           |
| DropdownMenu                | 紧凑触摸屏上的子菜单下钻                                   | `springs.subMenuOpen`、`springs.subMenuBack`          | 主题移动 token                                                                                                               |
| ContextMenu                 | 长按后的触发器抬起与菜单展开                               | `springs.contextMenuLift`、`springs.contextMenuMorph` | 相同的弹簧（手势组件）                                                                                                       |
| AlertDialog                 | 手指下缩放进入的呈现                                       | `springs.alertPresent`                                | 主题入场 token                                                                                                               |
| Lightbox                    | 轻点时控件的淡入淡出、双击缩放、从其源头的展开             | 命名的测量角色                                        | 弹簧，除非运动表指定了另一个角色，否则为 `springs.settle`；控件淡入淡出保持主弹簧的节奏                                      |
| TreeList                    | 粗指针下的组滑动                                           | 测量得到的运动                                        | 主题 token                                                                                                                   |
| ProgressBar                 | 粗指针下值变化时的确定性填充                               | 线性，时长为 `progress.fillTrackMs` 乘以移动比例      | `--duration-medium` 与主题缓动，适用每种指针                                                                                 |
| DateInput                   | 触控板下的 sheet 滚轮                                      | 仅粗主指针                                            | sheet 显示的任何位置                                                                                                         |
| Carousel                    | 触控板滑动下的分页                                         | 仅粗主指针                                            | 每种指针                                                                                                                     |
| Every tap-component overlay | 由轻点、按键或外部按压启动的触摸退出                       | 原生对应实现的时序                                    | `--duration-exit` 与 `--ease-exit`；退出开关从不会移除它；手势组件的此类退出（例如 sheet 或 Lightbox 的）会播放其弹簧（FR7） |
| SegmentedControl            | 触摸呈现下由轻点、单击或按键触发的选择滑动                 | `segmented.selectionSpring`                           | 从静止开始的选择弹簧（触摸下的手势组件）                                                                                     |
| SegmentedControl            | 无触摸呈现时由单击、按键或程序变更触发的选择滑动           | 主题时长与缓动                                        | 不变：主题曲线                                                                                                               |
| SegmentedControl            | 鼠标或触控笔的拖拽释放                                     | 以主题时长滑动                                        | 从释放速度起以弹簧停靠                                                                                                       |

## Verification

| 契约            | 验证                                                                                                                      | 代表性状态                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| --------------- | ------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1, FR2        | 对每个测量值及其用途做取值检查                                                                                            | 每个值；一个猜测及其测量任务；一个平台特定值；两个组件播放同一动效                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 无来源的值、未知的来源类别、没有列出测量的猜测、无来源的平台拆分，或同一用途对应两个值，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                   |
| FR3             | 针对独立积分与从 UIKit 读取的数值，对弹簧、衰减、橡皮筋与投影数学做单元测试                                               | 欠阻尼、临界阻尼与过阻尼弹簧；释放速度；两种速率；过度滚动深度                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 改动公式或常量会破坏与 UIKit 数值的一致性                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FR3 pager       | 针对记录下来的 UIKit 释放样本，对分页器的页面选择做单元测试                                                               | 在页面的 10%、25% 与 40% 处，速度为 292.7–298.6 pt/s 且保持原页的释放，以及速度为 310.7–329.9 pt/s 且前进的释放；在 45–48.5% 与 55–57.5% 处的静止释放；以 0、600 与 3000 pt/s 释放的 1.5 页拖拽；一次朝起始页回退的释放                                                                                                                                                                                                                                                                                                                                           | 由投影选出的页面、速度达到或超过 300 pt/s 却保持原页的释放，或从起点起移动超过一页的释放，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                 |
| FR4             | 对每个触摸动效做角色单元测试                                                                                              | 每个角色取其表中值；一个写入 `motion` 的主题                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 用字面值代替角色播放（除其组件动效表带着平台来源列出的经测量手势驱动退出弹簧之外）、在 `tempo` 1 与 `'standard'` 下与表不同的值，或通过动效旋钮之外的方式改变角色的主题，均判为失败                                                                                                                                                                                                                                                                                                                                  |
| FR4             | 对手势驱动退出做角色单元测试                                                                                              | 一个手势驱动退出（一次关闭或取消的释放）播放从平台参考测得的、没有具名角色的弹簧；同一个未具名弹簧由程序启动的动效播放，或由不是退出的手势驱动动效（例如一次停稳）播放                                                                                                                                                                                                                                                                                                                                                                                            | 手势驱动退出播放经测量的表中弹簧则通过；程序启动的动效，或非退出的手势动效，播放未具名弹簧则失败                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR5             | 浏览器证明：动画在 1 s 主线程阻塞期间逐帧持续推进，且每帧都没有布局或绘制                                                 | Chromium 手机模拟；WebKit                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 脚本驱动或在布局上做动画的实现会冻结或触发布局                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FR5 glide       | 浏览器证明：带布局动画的滑动在 700 ms 主线程阻塞期间持续移动，此时一个合成器参照物每一帧都在移动                          | Collapsible、TreeList 分支与 Table 行之后的内容；已在 Chromium 中验证；WebKit 由 iOS 模拟器抽查（38/39 帧）验证，而非自动化运行（证据缺口）                                                                                                                                                                                                                                                                                                                                                                                                                       | 由主线程步进的滑动会冻结                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR6             | 在动画飞行途中捕获它并重新设定目标的单元与浏览器测试                                                                      | 在峰值速度处捕获；用新弹簧重新设定目标；在浏览器报告该调用开始之前重新设定目标                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 读取布局、发生跳变或丢失速度，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR6 pager       | 分页器停稳起点的单元与浏览器测试                                                                                          | 略低于与略高于 225 pt/s 的释放；停稳过程中的一次捕获；停稳过程中的一次程序化翻页                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 低于下限的释放其停稳却开始移动、高于下限的释放其停稳却从静止开始、一次捕获丢失屏幕上的速度，或停稳过程中的一次程序化翻页从静止开始，均判为失败；拖拽过程中的翻页从静止开始                                                                                                                                                                                                                                                                                                                                           |
| FR6 starved     | 在主线程饥饿时（2 核上 4 个 worker）做 Switch 的帧证明；对停稳尾部上的重新设定目标，以及朝新静止位置的 rebase，做单元测试 | 行程中途的第二次点击，其帧读取偏晚或抬起被延迟 100 ms 处理；首帧提交偏晚；滑块已静止后的一次重新设定目标；滑动过程中的一次值变更，其 rebase 整体迁移行程                                                                                                                                                                                                                                                                                                                                                                                                          | 从已静止的滑块跳变判为失败；滑动中的值变更不显示任何台阶                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR6 late commit | 在 200 ms 阻塞之后重新设定目标的浏览器测试；对帧迟到的一次重新设定目标做单元测试                                          | 在 200 ms 阻塞之前，一次在任务中做出的重新设定目标，以及一次在页面的帧回调中做出的重新设定目标；在调用后 34 ms 内的一帧；调用交给弹簧的速度；一个隐藏页面；在一个迟到帧之前的两条属性与两个动画器；同一次回调中对两个动画器的重新设定目标                                                                                                                                                                                                                                                                                                                         | 在提交重新设定目标的那一帧出现台阶，判为失败；帧在 34 ms 内到来的重新设定目标保留调用自己的时钟；在页面的帧回调中做出的重新设定目标若在下一帧之外的任何帧显示其新曲线，判为失败；迟到帧丢掉交出的速度，判为失败；隐藏页面的重新设定目标永不完成，判为失败；迟到帧之前的较晚调用保留自己的时钟，判为失败；同一次回调中两个动画器的重新设定目标处于不同时钟，判为失败                                                                                                                                                  |
| FR6 resize      | 分页器停稳期间发生尺寸变化的单元与浏览器测试                                                                              | 在停稳过程中重新编号页面的变窄；页面与行同宽时，停稳过程中与拖拽过程中的一次变宽与一次变窄；带固定间隙的页面旋转；共享一次位移的页面；捕获跨越一次尺寸变化的静止手指；重新分组固定宽度视图的一次变宽；两个页面之间的平局（单元测试）；把最后一页与其之前的停靠点拆开的一次变窄；一次释放朝最后一页停稳时的变窄，按每个停稳自身的时钟逐帧采样；在视口尚无宽度时开始的停稳，它立刻落到自己的目标上                                                                                                                                                                  | 停稳结束在旧索引的新偏移上、缩放页面上的停稳或释放结束在另一个页面上或丢失其页面的分数部分、重新分组发生跳变、平局发生反转、朝最后一页的停稳结束时短于新的最后一页、拆分端点停稳停在拆出的停靠点上，或在上述变窄之后的某一帧偏离分页积分器曲线超过 1 px，均判为失败。该曲线从新停稳开始处停稳所显示的位置出发，按其当时的速度，延伸到新的最后一页。变窄之后的第一帧仍可显示其之前的停稳，或新曲线在起点与其时钟之间的部分，浏览器就在该帧内提交它                                                                    |
| FR7, FR8        | 在开启与不开启 Reduce Motion 的情况下做组件浏览器测试与故事板                                                             | 进入、退出、移动；Reduce Motion 下的拖拽及其抬起；以点击、按键与程序方式启动的 sheet 与 Lightbox 关闭                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 缺少退出、在 Reduce Motion 下出现除一次抛掷后的滑行及其边缘停稳（`design:reduced-motion` DR2）之外的任何位移、缩放或弹簧、超过 200 ms 的不透明度淡出，或手势组件的点击、按键或程序启动关闭使用退出曲线而非其弹簧，均判为失败                                                                                                                                                                                                                                                                                         |
| FR45            | 在每个 `tempo` 边界与每个 `character` 下，用鼠标、笔、触控板和手指做浏览器测试，并覆盖 Reduce Motion                      | 在精细与粗指针下，对 Switch、菜单、警报、sheet 与 ProgressBar 做点击、单击、按键与程序化变更；在每种指针下，对 Switch、Slider、sheet、分页器与 Lightbox 照片做拖拽释放、轻扫与捏合；一次延续为拖拽的点击                                                                                                                                                                                                                                                                                                                                                          | 被归类为点击的组件中，播放经测量的角色或弹簧而非主题的时长与缓动 token 的点击、单击、按键或程序化变更；手势组件或支持手势的组件中触摸点击启动、使用曲线而非其弹簧的移动；Switch 或 SegmentedControl 上未随触摸呈现离开主题曲线的单击、按键或值变更；携带速度的释放从静止或沿曲线停稳；手势的弹簧忽略 `character` 或 `tempo`；或某个部件只跟随一种指针而不跟随另一种，均判为失败；分页器经测量的停稳尚未跟随 `character`，属于已记录的实现缺口                                                                        |
| FR45            | 针对记录未指明步骤、但有平台测量的点击组件动效，做组件源码与 token 测试                                                   | 小的锚定表面（一个弹出层、一个菜单、一个开关、一行）与全屏表面（一个 Dialog、一个 AlertDialog），各自有自己的测量；点击组件的覆盖层退出                                                                                                                                                                                                                                                                                                                                                                                                                           | 在 Storybook 主题中被引为最接近该测量的 token 通过，点击组件的覆盖层退出使用 `--duration-exit` 通过；仅按角色选择的 token，或在 Core 的无主题默认值下最接近的 token，则失败                                                                                                                                                                                                                                                                                                                                          |
| FR45            | 对手势组件与点击组件中伴随动效的浏览器帧捕获                                                                              | sheet 的遮罩、把手与内容淡出；Lightbox 的外框淡出；菜单的背景遮罩                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 伴随淡出使用自己的时长则失败；由主动效的进度或停稳时间驱动则通过                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR45            | 在 `tempo` 1 与每个 `tempo` 边界上对 RefreshControl 结束阶段的浏览器帧追踪，以及结束计时的单元测试                        | 一次以其指示器显示而结束的刷新，分别在 `tempo` 1（300 ms）、0.75（225 ms）与 1.5（450 ms）；一个其移动缓动不同于 UIKit 曲线的主题                                                                                                                                                                                                                                                                                                                                                                                                                                 | 结束的逐帧轨迹在 `tempo` 1 下偏离 UIKit 经测量的 300 ms ease-in-out 超过 0.75 pt、结束使用主题的移动缓动而非 UIKit 曲线，或时长忽略主题的 `tempo`，均判为失败                                                                                                                                                                                                                                                                                                                                                        |
| FR45 swipe row  | 在 Chromium 与 WebKit 中对保持的滑动行做浏览器帧追踪，并对照每次触摸移动来读取                                            | 0.4 s 内 140 px 的拖拽，保持 0.6 s；从打开的行慢速拖到超过确认点 40 px，保持 0.6 s                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 未到确认点时，从认领到抬起之间某一帧的行位移与该次触摸按下以来手指位移相差超过 1 px 则失败；已过确认点时，前导量收缩，或结束时偏离确认偏移，则失败                                                                                                                                                                                                                                                                                                                                                                   |
| FR9, FR10       | 在合成流上做识别器单元测试，并用真实触摸输入做浏览器测试                                                                  | 拖拽、第二根手指、捏合、页面缩放、主线程阻塞                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 第二根手指打断拖拽，或页面捏合被作者 `touch-action` 之外的东西阻止，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FR11, FR12      | 在带显式时间戳的合成流上做按压与长按测试                                                                                  | 滚动视图之内与之外；浏览器接管的拖拽；内部的抬起；手指下的菜单行；行能放下的菜单与可滚动菜单上对某一行的按压；Switch 与 Radio 上的滑离抬起                                                                                                                                                                                                                                                                                                                                                                                                                        | 错误配置的计时；浏览器接管触摸后仍存活的按压；动作组之外、且不属于 `spec:AST-020` FR9 滑离例外的控件由浏览器点击之外的方式激活；行能放下的菜单中某一行等待 150 ms，或可滚动菜单中某一行不等待；滑离抬起完成了 `spec:AST-020` FR9 例外之外的控件，均判为失败                                                                                                                                                                                                                                                          |
| FR11 theme      | `generateThemeRules.test.ts` 中带主题的 `:active` 用例；在 Themed 按压故事上于真实浏览器中强制 `:active`                  | 基础组件与带尾部伪类的变体上的主题 `:active`；精细指针；强制 `:active` 与带按压属性的粗指针                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 粗指针能匹配到的裸主题 `:active` 规则，或按 `:active` 决定的粗指针分支，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| FR13            | 解析器单元测试与一次服务端渲染测试                                                                                        | 粗与精细指针；窄、宽与短；服务端渲染；水合渲染                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 组件以不同方式回答这些条件，或在服务端或水合渲染中出现触摸呈现，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FR14            | 滚动列表之上 sheet 的浏览器测试                                                                                           | 已滚动与处于顶部                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 中途交接判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR15–FR17       | 在带显式时间戳的合成流上做识别器单元测试                                                                                  | 独占、同时、需失败、嵌套；与认领胜出者并存的观察者；被阻塞的主线程；每轴 10 pt 的平移                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 错误的胜出者、迟到的截止时刻、保留了滞回的平移，或被认领胜出者判定失败或取消的观察者，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR18–FR22       | 用真实触摸输入的浏览器测试（`spec:AST-013` FR10）                                                                         | 原生滚动旁的各轴平移、页面缩放、被取消的触摸、点击之后的单击、键盘激活、模态滚动锁、在拖拽过程中保持按压的控件；在滚动视图上方以亚像素抖动保持静止的手指；直线移动 9 px 与 10 px 的手指，以及对角线移动 (7, 7) 与 (8, 8) 的手指；位于作者 `touch-action` 更窄的元素上的识别器，包括一个不含 `pinch-zoom` 的元素；落在距边缘 40 px 与 41 px、位移 14 px 与 15 px 处的屏幕边缘平移，以及在带区外开始的横向滚动；位于带区内元素上与延伸到带区之外元素上的屏幕边缘平移；从处于顶部的列表与已滚离顶部的列表中对 sheet 的拉拽；开始后被拖过其容差的长按，它从不滚动页面 | 幽灵点击；被作者 `touch-action` 之外的东西阻止的滚动或缩放；在 FR19 的五项例外之外被取消的无主 touchmove；因亚像素移动或不足 10 px 位移而被取消的点击；在 10 px 处不接管触摸的滚动，或比作者更宽的派生 `touch-action`；在带区外或带区内元素上不足 15 px 就认领，或在 15 px 处仍未认领的屏幕边缘平移；带区外被阻止的作者滚动；对延伸到带区之外元素的 `pan-x` 带区认领，或在那里 15 px 起步；取消滚动器本可滚动的移动，或在 10 pt 之前开始的滚动边缘平移，均判为失败                                                   |
| FR19 (DEC-30)   | 在合成流上手势单元测试；在 WebKit 与 Chromium 中用真实触摸输入的浏览器测试                                                | 朝滚动边缘抖动 2–4 px 的点击保留每一次移动，而 5 px 的移动被取消；横向移动从不被保持；NavigationStack 在被推入的屏幕上的内容返回滑动；RefreshControl 在其顶部的拉拽，其触摸路径不是滚动边缘平移（一项守卫）                                                                                                                                                                                                                                                                                                                                                       | 沿平移轴的 5 px 以下移动被取消；从 5 px 起的移动在手指下每个滚动器都处于其边缘时未被取消；横向移动被保持；或在滞回之前开始的平移，均判为失败                                                                                                                                                                                                                                                                                                                                                                         |
| FR20            | 在 Chromium 手机仿真中以真实触摸输入进行的浏览器测试（`spec:AST-013` FR10）                                               | 在 `pan-y` 下的一次水平拖动；在 `pan-y` 下、于有余量的可滚动容器上的一次垂直拖动；没有任何可滚动容器有余量时的一次垂直拖动                                                                                                                                                                                                                                                                                                                                                                                                                                        | 把 `pan-y` 下的一次水平拖动计为浏览器接管触摸、把有余量的可滚动容器上的一次垂直拖动不计入，或把其后一次不可取消的移动计入，均判为失败                                                                                                                                                                                                                                                                                                                                                                                |
| FR23            | 针对已记录时刻的触感测试                                                                                                  | 轻点、拖动、抬起                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 在原生时刻之外触发触感，判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR24            | 统计监听器、观察器与计时器的资源测试                                                                                      | 精细主指针；粗指针启用与禁用；大量实例；卸载                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 在使用方不使用任何手势的组件中出现手势监听器；在一次按压之外出现空闲的 `document` 监听器（那一个共享按压控制器与那一个误点吞没器除外）；出现第二个按压控制器；出现逐实例的 `document` 或 `window` 监听器；或出现泄漏，均判为失败                                                                                                                                                                                                                                                                                     |
| FR25            | 对每个被移动的默认值及其 `presentation` 值的组件测试                                                                      | 默认；`presentation` 设为已发布的表面                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `presentation` 未能恢复的被移动默认值，或一个公开阈值，判为失败                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| FR26–FR28, FR30 | 菜单按压测试，以及每个成员的指针流测试（按 `family:action-groups` 的验证映射所列），外加一次真实 Chromium 触摸测试        | 从一行滑到另一行；在外抬起；一次取消；第二根手指；边缘自动滚动                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 在按压起始行上执行动作、一次手势执行两个动作、在外抬起却关闭，或取消后仍有一行亮着，均判为失败                                                                                                                                                                                                                                                                                                                                                                                                                       |
| FR29            | 带显式时间戳的触发器测试                                                                                                  | 固定栏中的一次按压；滚动内容中按住 149 与 150 ms 的一次按压；滚动内容中的一次快速轻点；在 150 ms 之前接管触摸的一次滚动；12 与 14 pt 的漂移；交接之前与之后的移动；`presentation="popover"`                                                                                                                                                                                                                                                                                                                                                                       | 固定栏的按压发生等待；按住手指的滚动视图在 150 ms 之前或在一次滚动之后打开；一次快速轻点在抬起时未打开；超过漂移容差仍打开；抬起在交接之前就执行动作；或 `popover` 触发器在按压时打开，均判为失败                                                                                                                                                                                                                                                                                                                    |
| FR31–FR33       | 手指下的浏览器测试与故事板                                                                                                | 菜单、Popover 与 ContextMenu 的抬起：打开、关闭、在外平移、在外轻点、在表面上方捏合；一次鼠标                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 表面未从其触发器长出、也未缩回其中；在外平移后菜单仍保持打开；Popover 的关闭行为发生改变；捏合被阻挡的原因不是作者的 `touch-action`；在外轻点到达页面；或鼠标路径发生改变，均判为失败                                                                                                                                                                                                                                                                                                                                |
| FR34, FR35      | 手指下的浏览器测试与故事板                                                                                                | 子菜单下钻与其 Back 行返回；弹出层与菜单生长期间的一次轻点与一次拖拽；生长期间的一次捏合；一次鼠标；警示、sheet 与对话框进入期间的一次轻点与一次拖拽；进入期间的一次按键与一个屏幕阅读器；警示与 sheet 进入期间的一次捏合；进入中的非模态 sheet 旁边页面上的轻点与滚动（这些通过）                                                                                                                                                                                                                                                                                | 下钻后父级的行仍留在原地；层级之间的切换未按主题的移动时长与缓动 token 播放；生长期间的轻点会关闭、滚动或移动焦点；捏合被阻挡的原因不是作者的 `touch-action`；或鼠标路径发生改变；按键被扣住或辅助技术激活；内容树被隐藏；或进入期间的轻点或拖拽关闭了呈现、滚动了被扣住的页面、移动了焦点或触达其下任何内容，均判为失败                                                                                                                                                                                             |
| FR36–FR40       | 针对每种用途，在带显式时间戳的合成触摸流上做释放测试                                                                      | 低于与越过每个提交点；一次预测越过它的轻扫；越过它的一次慢拖；回移的释放；Reduce Motion；键盘与鼠标路径                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 判定在沉降中途改变；回移的释放却提交；沉降未以释放速度开始（分页的释放按 FR6 的分页段落开始其沉降，DEC-25）；或某个动作没有键盘或鼠标路径，均判为失败                                                                                                                                                                                                                                                                                                                                                                |
| FR41            | 在真实触摸输入下的浏览器测试（`spec:AST-013` FR10）                                                                       | 一次轻点；在 ContextMenu 触发器、调用方渲染的 DropdownMenu 触发器、带上下文菜单的行与滑块拇指上的一次长按；在复选框行的标签上与在纯文本上的一次长按；一次被取消的按压；鼠标与键盘选择；触控笔长按；鼠标长按，它不发出上下文请求；一个识别器夺取的鼠标拖拽，带与不带页面选择；从可选文本上开始的鼠标拖拽                                                                                                                                                                                                                                                           | 轻点会选中；带动作的按住启动了选择或 callout；标签或纯文本的长按未进行原生选择；抑制超出了按压本身；在其他地方改变了原生选择，改变了键盘或辅助技术选择，或在识别器夺取的拖拽之外改变了鼠标选择；被夺取的拖拽产生了新的选择，或在其之后已有的选择不能存活；或从文本开始的拖拽未选中文本，均判为失败                                                                                                                                                                                                                   |
| FR41 (box)      | 在真实触摸输入下的浏览器测试（`spec:AST-013` FR10），以及 iOS 模拟器上的 Mobile Safari                                    | 手指按住在复选框、CheckboxList 行、单选选项与开关的盒上，然后静止抬起；在旁边的标签上做同样的按住；在盒上的一次轻点；一次移开的按住；在盒上的一次鼠标按压                                                                                                                                                                                                                                                                                                                                                                                                         | 在盒上的按住启动了选择或 callout；静止抬起未恰好一次地激活控件；标签的长按未进行原生选择；抑制超出了按压本身；或鼠标按压发生改变，均判为失败                                                                                                                                                                                                                                                                                                                                                                         |
| FR42            | 在粗指针与精细指针下的默认主题几何测试，以及相邻目标之间的命中测试                                                        | 手机宽度下的每一个组件，分别用手指与鼠标；一个密集工具栏；一个 chip 及其移除按钮；一个位于标签链接旁的 Switch                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 默认主题的盒在触摸下或手机宽度下除随其文本之外发生增大；或在没有任何组件或模块记录设定命中区域之处，触摸目标小于 44 px 而邻居允许更大，或命中区域与邻居的目标重叠，均判为失败                                                                                                                                                                                                                                                                                                                                        |
| FR43            | 使用鼠标、触控板、触控笔、手指与键盘的浏览器测试，以及资源计数                                                            | 按拖拽与按滚轮进行的平移；滚轮与触控板滚动下的滑块拇指；ctrl 加滚轮的捏合；一次长按、一次右键与 Shift+F10；一次鼠标按压；一次手柄拖拽；用鼠标与触控板进行的一次行滑动；一个没有手势的组件                                                                                                                                                                                                                                                                                                                                                                         | 手势在鼠标或触控笔下缺失；鼠标拖拽触发了滑动动作；触控笔捏合；鼠标、触控板或触控笔下的边缘平移；精细指针下的按压延迟；滚轮或触控板滚动改变了拇指的数值，或未到达其下方的滚动；没有手势的组件中出现空闲监听器；或增加了样式表字节，均判为失败                                                                                                                                                                                                                                                                         |
| FR43 trackpad   | 对带时序的滚轮流做单元测试；用触控板流的 WebKit 浏览器测试（Chromium 驱动的滚轮读作鼠标滚轮）                             | 用手指与触控板把表单与必填 sheet 拉动 30 到 240 px；在 sheet、分页器与行上的鼠标行、格、刻度与加速增量；十次各自在动量中途开始的滑动、十次动量结束的滑动，以及一次带 150 ms 停顿的慢拖；一次触控板轻扫与在 info sheet 上的一次缓慢停住的拖拽；分页器上的一次猛抛、一次缓慢的 60 px 滑动、一次 42 px 的尖峰与连续的滑动；一行在一次手势内被打开又被滑回，以及一次长时间快速滑动；一次结束的捏合；穿过窗口失焦与穿过隐藏页面的触控板平移                                                                                                                            | 触控板的拉伸在相同行程下与手指不同（在参考 sheet 上 120 px 给出 54 px）；鼠标滚轮移动了 sheet、分页器或行；分路器计数不是十、十与一；动量移动了表面；轻扫在没有速度时被释放；分页器行进超过一页或在尖峰上翻页；轻扫让 info sheet 保持打开，或缓慢停住的拖拽将其关闭；打开的行在一次手势内露出另一侧；窗口失焦或隐藏页面使触控板平移中途中断；或捏合在 100 ms 之后才结束，均判为失败                                                                                                                                  |
| FR44            | 对窗口失焦所结束的一次触控笔按压的单元测试，在 Switch、Slider 与宿主上，分别在粗指针与精细指针下                          | 在 Switch 与 Slider 上的触控笔按压，按压中途失焦：不切换也不提交；一次触控笔的接触以 `pointercancel` 结束                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 宿主未记录被失焦取消的触控笔时，Switch 在该笔的 click 处切换                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| all             | iOS 模拟器：UIKit 参考录屏与 Safari 中的同一手势；真实的 iOS Safari 设备；Android 模拟器中的 Android Chrome（DEC-27）     | 逐组件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 曲线或时序不匹配即为对等性缺陷                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| all (DEC-31)    | 证据顺延检查，用于在较早 head 上的设备或模拟器证据可在较晚 head 上计入之前                                                | 只合并 `main` 的较晚 head；该 pull request 自身的改动逐字节相同或已改变；一次合并改动了该 pull request 所改动的文件、这些改动直接导入的文件、一个共享运动或层模块，或一个也没动；该 pull request 自身文件中的一个生成文件，CI 证明它可相同地重新生成，或未能证明；一次提交，或与该 pull request 自身文件的重叠，限于 DEC-31 所定义的仅测试文件或知识记录，或不限于此                                                                                                                                                                                              | 证据顺延检查会比较该 PR 自身在两个 head 之间的差异，并把该合并改动的文件与该 PR 所改动的文件、这些改动的直接导入以及共享运动与层模块（目前为 `motion/transientCopy`、`motion/inertClone`、`motion/animator`、`motion/carryAnimations`、`Layer/useLayer`、`hooks/usePager`）对照；任何重叠都判失败，除非该 pull request 自身文件中的一个生成文件且 CI 证明它在新 head 上可相同地重新生成；自身差异已改变，或与该 pull request 自身文件的重叠限于 DEC-31 所定义的仅测试文件、知识记录或 `.changeset/` 发布说明，则通过 |

## Decision log

### DEC-1 — Touch presentations feel native by default

**Reference:** `spec:AST-094/DEC-1`
**Decider:** `cixzhang`, `2026-10-24`

每一台触摸设备默认就获得一种有原生感的触摸行为，无需选择开启，因为使用它的人早已从手机上的其他每一个应用里熟悉了这种行为。该行为的数值是从 UIKit 实测而来，而非凭记忆写出：只有具备可引用来源的数值才能进入表，而 Android 触摸设备在记录到实测且有来源的差异之前沿用相同的数值。

该表提供默认值，主题通过其运动旋钮调整这些默认值（FR4、DEC-15）：产品可以让运动更柔和，而无需分叉组件，而实测值仍是它的起点。与平台匹配的外观与手感不属于本决策。

### DEC-2 — Recognizers track fingers; the compositor plays releases

**Reference:** `spec:AST-094/DEC-2`
**Decider:** `cixzhang`, `2026-10-24`

在 iOS 上，原生滚动吸附在主线程阻塞期间仍能继续跟踪，但在阻塞期间抬起的手指会按 WebKit 自身的吸附物理收尾，而不是 UIKit 的曲线；手指也无法在弹簧中途接住内容；而全视口命中测试会破坏那些在其周围仍让页面可用的表面。因此跟踪在识别器中运行，而每一次释放都作为实测曲线的合成器动画运行（FR5、FR9）。

### DEC-3 — Touch motion is themeable; gesture thresholds are not

**Reference:** `spec:AST-094/DEC-3`
**Decider:** `cixzhang`, `2026-10-24`

产品调整运动，如同调整颜色与字体，因此每一个触摸弹簧、时长与曲线都是一个运动角色，其默认值为实测值，主题通过其运动旋钮触达它（FR4、DEC-15）。阈值决定谁获得触摸，而不决定任何东西的外观，因此它们保持为内部值（`spec:AST-002` FR3）。

### DEC-4 — A finger opens a menu on press

**Reference:** `spec:AST-094/DEC-4`
**Decider:** `cixzhang`, `2026-10-24`

固定栏中的触发器没有可滚动的内容，因此其菜单在手指按下时即打开；在滚动视图内，菜单会等过内容触摸延迟，使滚动仍能夺取这次触摸（FR29）。调用方的 `presentation` 选择则保留今天在轻点时打开的行为（`architecture:public-component-api` INV16）。

### DEC-5 — FR4 cites the generated motion role table

**Reference:** `spec:AST-094/DEC-5`
**Decider:** `cixzhang`, `2026-10-25`

FR4 列出本记录所指名的角色，并针对那些由组件自身记录实测的角色，引用由每一张已注册表生成的运动角色表，使新的组件表不会与本记录产生偏差。

### DEC-6 — CSS keyed on the touch media query counts as after hydration

**Reference:** `spec:AST-094/DEC-6`
**Decider:** `cixzhang`, `2026-10-25`

FR13 的“仅在水合之后”约束的是在脚本中决定的呈现。以字面触摸媒体查询为键的样式符合该要求：服务端与水合时的标记完全相同，而浏览器在首次绘制时就应用该样式。

### DEC-7 — A watcher recognizer is passive and follows the scroll

**Reference:** `spec:AST-094/DEC-7`
**Decider:** `cixzhang`, `2026-10-25`

从不夺取触摸的识别器只注册被动监听器（FR20），因此观察一次触摸绝不会延迟浏览器的滚动；并且当浏览器接管触摸时它不会被取消：它会跟随滚动直到抬起，使对滚动做出反应的栏能持续感知到滚动。夺取触摸的识别器也不会让观察器失败或将其取消：观察器与胜出者一同识别。

### DEC-8 — A native scroll takes a touch after 10 px; touch-action never widens the author's

**Reference:** `spec:AST-094/DEC-8`
**Decider:** `cixzhang`, `2026-10-25`

静止的手指常常报告亚像素级移动，而把它当作滚动会取消人本意的轻点，因此只有当手指移动了 10 px 之后，原生滚动才计为浏览器接管触摸。作者收窄一个元素的 `touch-action` 是有理由的，因此由识别器导出的值会与之取交集，绝不授予浏览器更多权限。

已否决：在第一个滚动事件时就取消，以及覆盖作者的 `touch-action`。

### DEC-9 — A hold does its action, not a selection; copying is the caller's menu item

**Reference:** `spec:AST-094/DEC-9`
**Decider:** `cixzhang`, `2026-10-25`

在手指之下，轻点、会做某事的按住，以及在纯文本上的长按，是三种不同的意图。轻点会激活。在按住会做某事的元素（长按菜单、步进器的按住重复、滑块的拇指）上按住，会执行那件事，而不启动选择或放大镜，正如 UIKit 的上下文菜单与控件、以及 Android 的长按所做的那样。在标签或纯文本上的长按，若按住什么也不做，则进行原生选择，因此标签保持可选中；其他元素遵循各自的记录。菜单元素上的文本不能通过长按选中，系统也不添加“拷贝”项，因此想要拷贝的调用方要在自己的菜单里放一个“拷贝”动作。

已否决：一个系统“拷贝”项；在每一个按压跟踪的控件上抑制选择。

### DEC-11 — Touch motion roles stay internal until the public set is decided

**Reference:** `spec:AST-094/DEC-11`
**Decider:** `cixzhang`, `2026-10-25`

运动值暂时保持为内部值：一套公开的、可由主题设定的值另行决定，因此任何组件专属的角色都不会率先成为公开 token。

这把 DEC-1 与 DEC-3 的主题重调推迟到该集合存在之后。

已否决：把逐组件的角色发布为主题 token。

### DEC-13 — A screen-edge pan claims only a thin band at the edge

**Reference:** `spec:AST-094/DEC-13`
**Decider:** `cixzhang`, `2026-10-26`

一次边缘滑动，例如返回，始于屏幕的最边缘，而页面自身的水平滚动位于其他所有地方。因此屏幕边缘的平移只在 UIKit 的边缘带内夺取水平轴，并在那里按 UIKit 的 15 px 做出判定，带外作者的滚动不受影响。对于延伸到带之外的元素，`touch-action` 无法按触摸夺取，因此在那里，带内的触摸按 10 px 做出判定（DEC-22）。

已否决：在整个元素上夺取 `pan-x`。

### DEC-14 — A menu that cannot scroll highlights its rows at once

**Reference:** `spec:AST-094/DEC-14`
**Decider:** `cixzhang`, `2026-10-26`

单元格延迟之所以存在，是为了让滚动能在某一行亮起之前胜出。行恰好放得下的菜单无法滚动，因此它没有可等待的滚动，其行在触摸按下时即高亮；可以滚动的列表则保留该延迟。UIKit 菜单的行同样在触摸按下时高亮这一点，在 iOS 26.2 模拟器上用一个短的 UIMenu 实测之前，仍只是一个猜测。

已否决：对每一菜单行都使用 150 ms 延迟。

### DEC-17 — Every group of sibling actions tracks a held pointer the same way

**Reference:** `spec:AST-094/DEC-17`
**Decider:** `cixzhang`, `2026-10-26`

一个人按下某个动作并滑到另一个动作时，期望在菜单、警示的按钮、按钮组或工具栏中得到相同的结果。每一组同级动作的成员都以相同方式行为，只决定一次，并由两个所有者实现：菜单按压模型与动作组跟踪器（`family:action-groups`；`architecture:interaction-modality` INV13）。菜单对每一种指针都保留该行为；动作组的滑动在触摸呈现下为手指与触控笔运行（`family:action-groups` DEC-1）。44 px 的目标仅限触摸。

已否决：只给菜单使用的跟踪规则。

### DEC-15 — The public motion set is three theme knobs; per-role tables stay internal

**Reference:** `spec:AST-094/DEC-15`
**Decider:** `cixzhang`, `2026-10-26`

主题只能通过 `spec:AST-108` 的三个旋钮——tempo、character 与减弱动效——触达触摸运动，这三个旋钮变换实测角色；逐角色表与权重保持为内部值。这恰好就这三个旋钮取代了 DEC-11 的“全部内部”，也取代了 DEC-1 与 DEC-3 的逐角色重调，主题通过旋钮进行这种重调；DEC-11 所否决的备选方案，即公开的逐组件角色，仍然被否决。

### DEC-24 — A pan follows a trackpad, never a mouse wheel, and reads the trackpad's phases itself

**Reference:** `spec:AST-094/DEC-24`
**Decider:** `cixzhang`, `2026-10-31`

触控板的两指滚动是直接操作，与手指一样，因此平移跟随它，而手指与触控板共享一个表面的橡皮筋与释放。鼠标滚轮的格是一种滚动控件，而几次快速的格从不移动或关闭一个 sheet，因此平移不接受其中任何一格，而不带触控板特征的一次滚动按滚轮计。Web 不报告触控板的接触、相位或动量，而仅靠超时会在手指静止时释放、把动量带进表面并合并下一次滑动，因此由一个分路器为每一次平移推断抬起与该手势的边界。行跟随手指，正如邮件列表的行那样。这收窄了 DEC-21 对平移的滚轮与触控板映射。

已否决：由鼠标滚轮驱动平移；对行与分页为每一次触控板滑动采用一个离散步进；用更长的结束超时来代替分路器。

### DEC-23 — A thumb that sets a value takes no wheel

**Reference:** `spec:AST-094/DEC-23`
**Decider:** `vjeux`, `2026-10-29`

一条一致性决策：设定数值的拇指，即滑块的或开关在其平移处的拇指，不接受滚轮或触控板滚动，因此其上的滚动落到它下方的滚动，绝不改变数值（FR43）。触摸工作保留已发布的鼠标行为（`spec:AST-017` FR59、FR41），而原生 range 输入忽略滚轮（DEC-1）。这收窄了 DEC-21 对平移的滚轮与触控板映射。

已否决：让拇指的平移像其他平移那样接受滚轮与触控板滚动。

### DEC-21 — Gestures work on the web, not only under a finger

**Reference:** `spec:AST-094/DEC-21`
**Decider:** `cixzhang`, `2026-10-26`

这些手势中的大多数用鼠标、触控板或触控笔同样有效，因此它们对每一种指针都保持开启，并映射 Web 输入：平移用滚轮与触控板滚动，捏合用 ctrl 加滚轮，长按用右键或 Shift+F10。会与浏览器冲突的则关闭：鼠标拖拽的滑动动作、触控笔的捏合，以及鼠标、触控板或触控笔下的屏幕边缘平移。44 px 的目标仅限触摸，而这一切都不增加样式表字节。鼠标按压使用无延迟的按压模型，而不是浏览器的 `:active`。按压控制器跟踪每一种指针。

已否决：让手势与按压跟踪仅限触摸。

### DEC-20 — The default look grows nothing for touch

**Reference:** `spec:AST-094/DEC-20`
**Decider:** `cixzhang`, `2026-10-26`

在默认外观下，手机上的尺寸或在触摸下不会增大，因此除非其主题另有选择，产品在各处看起来相同；为适应紧凑屏幕而收缩是可以的。触摸可达性来自不可见的命中区域，并被限制到两个相邻者都仍可达。移动端尺寸的增大由主题通过其适配掌管。

已否决：在默认外观中使用仅限触摸的行高与控件尺寸。

### DEC-16 — Every touch presentation holds pointer input while it enters

**Reference:** `spec:AST-094/DEC-16`
**Decider:** `cixzhang`, `2026-10-26`

在警示、sheet 或对话框仍在进入时落下的一次轻点或拖拽，几乎从不指向它，因此它被吸收，正如从触发器长出的弹出层或菜单已经如此。只有指针输入被扣住，因此键盘与辅助技术的用户绝不会被阻塞。

已否决：只为从触发器长出的呈现扣住输入。

### DEC-19 — A phone menu stays beside its trigger

**Reference:** `spec:AST-094/DEC-19`
**Decider:** `cixzhang`, `2026-10-26`

在紧凑触摸屏上，锚定的菜单保持层运行时的正常放置，即在其触发器旁边、视口边缘留白之内，因此在菜单放得下其旁边的任何地方，菜单打开时触发器都保持可见；比两侧任一空间更高的菜单遵循层运行时自身的回退方案。

已否决：如 UIKit 的菜单那样覆盖触发器、以它居中并与它的顶部或底部对齐。

### DEC-22 — An edge band claims only on an element within the band

**Reference:** `spec:AST-094/DEC-22`
**Decider:** `cixzhang`, `2026-10-26`

`touch-action` 是按元素设置而非按触摸设置，因此该带的 `pan-x` 夺取与 15 px 起点只能在一个位于带内的元素上成立。在更宽的元素上，带内触摸像其他每一次夺取一样按 10 px 判定，因为在其整体上夺取 `pan-x` 会夺走作者的滚动（DEC-13）。

已否决：在更宽的元素上做整元素夺取。

### DEC-18 — A scroll-edge pan may hold the page's rubber band from the first move

**Reference:** `spec:AST-094/DEC-18`
**Decider:** `cixzhang`, `2026-10-26`

当手指下的每一个可滚动容器都处于其边缘，而拖拽朝该边缘移动时，浏览器否则会在平移到达其 10 pt 起点之前对页面做橡皮筋效果（这是对 Mobile Safari 过度滚动的解读，并非实测），因此 sheet 的拉动会明显地与页面相争。只取消这些移动，且从第一个起，与 UIKit 的 sheet 拉动相符，而真正的滚动绝不会被取消。代价是：sheet 内的列表无法从其顶部下拉刷新。

已否决：只在平移开始之后才取消移动。

### DEC-30 — A scroll-edge pan waits out a tap's wobble

**Reference:** `spec:AST-094/DEC-30`
**Decider:** Specs consistency ruling, `2026-11-09`, applying DEC-18

共享的滚动边缘平移只有在沿其轴的行程达到一次轻点的 5 px 抖动之后才扣住手指，因此在每一个使用它的组件中，轻点的点击都能存活。代价是：从 5 px 开始朝边缘的一次抖动，直到平移在 10 pt 处开始，会失去其点击。5 px 这一点是 DEC-29 对 Mobile Safari 的解读。

5 CSS px 的轻点容差位于 `gestures/tapWobble.ts`（`TAP_WOBBLE`）中，由平移识别器与 BottomSheet 的拖拽共享；它在 Mobile Safari 中实测，因此留在 UIKit 表之外。

### DEC-25 — A pager pages as UIKit measures it

**Reference:** `spec:AST-094/DEC-25`
**Decider:** `cixzhang`, `2026-11-01`

分页器、一个在分页器运行处被赋予 `hasSnap={useSnapPaging()}` 的 Carousel，以及 Lightbox 的图库，都按 UIKit 的分页滚动视图在 iOS 26.2 上的做法选择停留的页面并开始沉降。UIKit 按速度阈值选择页面，在页面的 10%、25% 与 40% 处都是相同的 300 pt/s，而不是按预测；并让缓慢释放的沉降从静止开始。所有者于 2026-11-01 在分页器与分页 Carousel 上试用了这一分页，用触控板以及在手机上：“触控板很好”，“手机很好”。这仅就分页收窄 FR3 与 FR6；其他每一次释放仍遵循它们。拖拽期间换页从静止开始。分页的释放按 FR3 的分页规则判定，其沉降按 FR6 的分页段落所述开始；FR37 原样适用。

已否决：用减速率预测分页的释放；把缓慢分页释放的速度交给沉降。

### DEC-26 — A gesture component's motion springs from measured roles; a tap component's tap-started motion plays the theme's tokens

**Reference:** `spec:AST-094/DEC-26`
**Decider:** `cixzhang`, `2026-11-02`

手势驱动的运动延续人的手。携带手势速度的一次释放以该速度开始，并在每一种指针下在弹簧上沉降：鼠标的一次轻扫抛出得与手指的轻扫一样。在主交互为轻点的组件中，由轻点、单击、按住、按键或程序启动的运动没有可携带的速度，因此它在每一种指针下播放主题的运动 token，其时长与缓动由 `tempo` 缩放，而主题的时序到达它，正如到达其他每一种有时序的运动。跟随指针的部件不是有时序的运动，因此它跟随每一种指针。主题的 `tempo` 缩放手势的弹簧，其 `character` 按角色的固定权重偏移该角色的实测回弹，因此一个主题在两类运动上感觉一致。

所有者于 2026-11-02 决定了这一点。运动沿用主题的时长，但跟随交互的元素在这些时序之外。鼠标的释放从释放速度开始在弹簧上沉降，因此轻扫保持其抛出。主题的 character 塑造这些弹簧，其 tempo 缩放它们。任何涉及手势的交互都使用弹簧。轻点没有速度，因此没有手势的交互使用默认运动，它应用主题的运动 token。
这收窄了 DEC-1、DEC-3 与 DEC-15 的实测运动角色，只保留手势驱动的运动，并把 Non-goals 的主题时序扩展到每一个指针。实测的输入时序，例如谁获得触摸、按住时长与轻扫速度，仍是内部值，不是运动角色。点击组件的触摸退出若没有手势驱动，就播放主题的退出时长与缓动，手势组件的则播放其弹簧；主题的退出开关仍然永不将其移除（`spec:AST-090` DEC-5）。已否决：为轻点在手指下启动的运动保留实测弹簧。已否决：为鼠标释放使用主题曲线，那会让轻扫骤然停住。已否决：只在手指下跟随指针。

2026-11-04，所有者设定了这一选择的单位：组件的主交互。主交互为手势的组件，其全部运动都播放弹簧，包括其中的轻点，而主交互为轻点的组件播放曲线 token，使每个组件的各部分保持协调（FR45）。

### DEC-27 — Android claims rest on emulator evidence

**Reference:** `spec:AST-094/DEC-27`
**Decider:** `cixzhang`, `2026-11-03`

手边没有 Android 手机来核查 Android 相关声明，因此用 Android 模拟器中带 Gboard 的 Chrome 来证明它们：在审查中的确切 head 上，分别在动画为正常比例、动画移除的情况下运行，并额外使用慢设备配置。Android 相关声明不需要在设备上进行人工核查。iOS Safari 的声明仍保留真机证据。所有者于 2026-11-03 决定了这一点：任何 Android 专属内容使用模拟器证据，那里不做人工核查。

已否决：把实体 Android 手机作为门禁，或作为后续核查。

### DEC-31 — Device and emulator evidence carries across a main merge that touches none of the pull request's hand-edited source files, direct imports or shared motion and layer modules

**Reference:** `spec:AST-094/DEC-31`
**Decider:** `cixzhang`, `2026-11-09`

在较早 head 上于设备或模拟器中取得的证据，在仅合并了 `main` 的较晚 head 上仍然有效——前提是该 pull request 自身的改动在两个 head 之间逐字节相同，且该合并没有改动该 pull request 所改动的文件、这些改动直接导入的文件，以及验证行所列举的共享运动与层模块中的任何一个。否则，就在新的 head 上重新取证。对于仅合并 main 的 head，这是对 DEC-27 确切 head 规则的例外；DEC-27 对其它所有 head 仍然成立。

已否决：每次合并 main 之后都重新取证。

由所有者（`cixzhang`，2026-11-10）修订：一旦所有者在设备上通过了某个行为，同一 pull request 的后续 head 就改为在同一批设备上与她通过的那个 head 并排对照来核查，步骤相同、证据同样经过帧检查，而不再由她核查；只有并排对照显示出重大差异时，才回到她手上。某个行为的首次核查仍交给她。所有者原话：“Can you just check it yourself after and only ahow me if theres major differences”。

由所有者（`cixzhang`，2026-11-13）修订：若某次合并在该 pull request 自身文件上的唯一重叠是生成文件（路由清单、registry 锁文件、CLI 测试夹具），那么当 CI 证明其中每个文件在新的 head 上都能以相同内容重新生成时，证据仍然有效。若某次合并改动了该 pull request 手工编辑的源文件之一、其改动直接导入的文件，或某个共享运动或层模块，则仍然需要重新取证。所有者原话：“Yes, when CI proves they regenerate identically.”

由所有者（`cixzhang`，2026-11-12）修订：对于只触及仅测试文件或知识记录的提交，或某次合并对 pull request 自身文件所做的此类改动，证据同样顺延。仅测试文件是指位于 `__tests__/` 目录下，或命名为 `*.test.*`、`*.spec.*`，且没有任何渲染代码或发布代码导入它的文件，story 也算在内；知识记录是位于 `docs/specs/`、`docs/architecture/`、`docs/families/` 或 `docs/design/` 下的 Markdown。`.changeset/` 下的发布说明也以同样方式顺延，因为它不渲染任何内容（`spec:AST-030` FR13）。除上述生成文件外，任何其它文件都需要重新取证。所有者的选择：“Test and spec-only”。

### DEC-28 — Sheet stretch at the tallest detent

**Reference:** `spec:AST-094/DEC-28`
**Decider:** the owner, `2026-11-03`

由所有者在手机上的一次手感检查中决定：在 sheet 的最高档位处，把内容拉过其末尾的拉动会继续表现为 sheet 的拉伸，反向操作则把它交还回去（FR14 的唯一例外）。

已否决：让整个手势随内容走（严格的嵌套滚动规则）。

### DEC-29 — A sheet's pull waits out a tap's wobble

**Reference:** `spec:AST-094/DEC-29`
**Decider:** Specs consistency ruling, `2026-11-09`, applying DEC-18

Mobile Safari 会把被保留的首次 5 px 移动提交给原生平移（iOS 26.2 模拟器；被保留的 4 px 移动不会提交任何内容；作者早先在 Mobile Safari 27.0 上的运行是在 7 px 处提交的），因此 BottomSheet 从首次移动达到轻点 5 px 抖动时就开始取消。一旦原生平移被提交，之后的取消都无法阻止它，手指在 sheet 旁移动时，其内容会在手指下橡皮筋式拉伸。WebKit 会在触摸的某次移动被取消时结束该触摸的 click，因此等过这段抖动可以让 sheet 中控件上的轻点保留其 click。代价是：若轻点朝边缘抖动 5 到 8 px，就会丢失它的 click。

### DEC-32 — A held swipe row stays under the finger

**Reference:** `spec:AST-094/DEC-32`
**Decider:** `cixzhang`, `2026-11-11`

当手指按住某个滑动行时，从滑动认领手势的那一刻起，该行的偏移量在释放之前的每一帧都等于手指自触摸按下以来的行程；越过确认点之后，会按实测的确认运动（`spec:AST-057` FR5）生长出一段领先量，直到确认偏移量，行则保持那段领先量。没有弹簧跟随手指；释放的沉降保持其测量得到的角色。所有者原话：“…If im dragging a portion of the listitem undermy finger i expect that to stay under my finger the entire duration of the gesture until i release”。

## Open questions

- **OQ1 — Scroll view bounce-back curve.** 什么曲线能让滚动视图从过度滚动中返回？它不是从静止开始的单一弹簧；橡皮筋本身已被沉降。（`checkable`）
- **OQ2 — Rotation threshold.** 多大的旋转量才会启动旋转手势？没有可读取的已存阈值，而且模拟器无法脚本化双指旋转。（`checkable`）
- **OQ5 — The menu's drift allowance.** 13 pt 的漂移容许量（FR29）介于打开了菜单的 12 pt 移动与未打开的 14 pt 移动之间。这个区间就是它的依据，还是需要更精细的测量？（`owner decision`）
- **OQ6 — Opening a sub-menu without a lift.** 已由 `module:DropdownMenu/useMenuPress` DEC-8 解决：停在子菜单行上的手指永远不会打开它；在该行上抬起才会打开（其 FR10）。
- **OQ7 — The opening haptic.** 手指按住并打开菜单时，UIKit 会播放一次触感反馈；iOS Safari 中的页面无法做到（FR23）。菜单在哪里记录这个缺口？（`owner decision`）
- **OQ8 — Withdrawing a tentative open.** 已由 `module:DropdownMenu/useMenuPress` DEC-8 解决：没有任何东西会撤回一次打开，因此屏幕阅读器听到的是一次打开和一次关闭（其 AR5）。
- **OQ10 — A sub-menu with its parent visible.** 深入打开的子菜单是否应就地展开，菜单的框随之增长，父菜单在其后方可见，如同 UIKit 的菜单那样？这属于外观与手感；目前子菜单的行会替换父菜单的行（FR34）。（`owner decision`）
