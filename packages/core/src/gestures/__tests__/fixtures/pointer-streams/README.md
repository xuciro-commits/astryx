# 指针事件流

真实浏览器在页面视角下，为一个移动中的触点所交付的数据。`VelocityTracker.streams.test.ts` 会回放它们（spec:AST-100 FR4）。

| 文件                                   | 浏览器                                               | 指针               | 输入                                                      |
| -------------------------------------- | ---------------------------------------------------- | ------------------ | --------------------------------------------------------- |
| `android-chromium-*`                   | Chromium 158，运行于 Android 15 模拟器               | 触摸               | 通过 uinput 触摸屏以 120 Hz 注入                          |
| `android-firefox-*`                    | Firefox 158，运行于同一模拟器                        | 触摸               | 同上                                                      |
| `ios-safari-*`                         | Safari 26.2，运行于 iOS 26.2 模拟器（iPhone 17 Pro） | 触摸               | 通过 idb 注入 HID，约每 30 ms 一次移动                    |
| `desktop-chromium-{mouse,pen,touch}-*` | 无头 Chromium 149                                    | 鼠标、触控笔、触摸 | 以 120 Hz 通过 CDP 注入输入，每个事件的时间戳为其计划时间 |

每个来源包含三种手势：

- `slow`：向下 200 px，速度 200 px/s，移动中抬起；
- `fling`：向下 300 px，速度 2,000 px/s，移动中抬起；
- `stop-release`：400 ms 内移动 200 px，然后静止 300 ms（长于 40 ms 的静止判定间隔），再抬起。

在 iOS 上，模拟器自行控制移动节奏，因此其记录有所不同：slow 拖动时 Safari 交付的是 194 px，速度 183.5 px/s；fling 为 240 px，速度 2,400 px/s；stop-release 的移动历时约 2.2 s，之后静止 300 ms。每个 fixture 的 `injected.speed` 即 Safari 实际交付的速度。

## 格式（schema 1）

- `events`：每个指针事件与触摸事件对应 `[type, t, x, y]`，其中 `t` 为 pointerdown 的 `timeStamp` 之后经过的毫秒数，`x`、`y` 为从触点落下位置起算的 CSS px。一个 `pointermove` 还会附带其 `getCoalescedEvents()` 样本（每个样本为 `[t, x, y]`）及其 `getPredictedEvents()` 数量。
- `injected`：基准真值。`speed` 为触点移动期间沿 y 轴的速度（px/s）；以固定速率注入的来源还会带有 `hz` 与 `points`。
- `release`：回放的释放位置（`pointerup`，或 `lastMove` 并附 `note` 说明原因）；对于释放速度与注入速度偏差超过 10% 的事件流，带有 `check: "shape"`：它不作为速度证据，只校验其方向与轴向。
- `caveat`：说明该输入不是什么（见下文）。

## 注意事项

测试装置的输入是合成的，并非真实手指：Android 通过 uinput 触摸屏以 120 Hz 注入，桌面端通过 CDP 注入，二者都经过浏览器真实的输入管线；iOS 输入是在租用的模拟器上通过 idb 注入的 HID，约每 30 ms 才交付一次移动（并非 120 Hz），因此 iOS 的速度是 Safari 在首个与最后一个移动中的 pointermove 之间交付的距离除以该段时间。真实手指 120–240 Hz 且带抖动的采样并未复现。

## 回放提供什么

每个 `pointermove` 事件自身的位置与时间，每个事件一个样本，按 `PanGestureRecognizer` 读取它们的方式提供（它不读取 `getCoalescedEvents()`）。合并样本是浏览器实际收到的输入：回放还会据此模拟主线程繁忙的情况，每四个输入样本合并为一个事件，时间取其中最新者，模拟浏览器在处理函数延迟执行时合并输入的行为。

## 这些流展示了什么

- Android 上的 Chromium 在 120 Hz 输入下会把一到三个样本合并进每个 `pointermove`；Firefox 每秒派发约 60 个事件，每个事件的合并列表只有一项。
- 对于 CDP 派发的输入，桌面版 Chromium 返回的 `getCoalescedEvents()` 列表为空，因此繁忙主线程回放直接使用事件本身。
- 模拟器上的 Safari 会把同一帧内到达的两次移动合并为一个 `pointermove`，其合并列表只有一项（一个 120 px 的步进）。
- idb 在最后一次移动后 58–85 ms 才抬起，长于静止判定间隔，因此 iOS 的 slow 拖动与 fling 都在最后一次移动处释放。模拟器交付的步进间隔为 29–44 ms，对照 Safari 实际交付的速度，两者在各自两个释放点中的一个上偏差达到 10%：slow 拖动的 pan 读数偏低 22.9%（其 scroll 偏高 2.3%），fling 的 scroll 偏低 12.2%（其 pan 偏低 7.2%，基于六个样本）。两者都不作为速度证据；都只校验方向与轴向。
- 要在 iOS 上以 120 Hz 输入，需要使用 XCTest 自身的事件合成（`press(forDuration:thenDragTo:withVelocity:thenHoldForDuration:)`），而这些流并未使用它。

## 捕获事件流

`capture.html` 记录单个触点：在浏览器中打开它，在其上执行一次手势，然后从 `window.__streams` 读取记录（或让页面通过 `?post=probe` 或 `?post=beacon` 上报）。一个 fixture 就是该记录加上注入的基准真值以及上述字段。
