# 动效

核心组件触摸呈现的内部动效基础：UIKit 常量表（触摸呈现所用的每个弹簧、时长、减速率、橡皮筋常量、曲线和手势阈值，均附来源）、UIKit 使用的弹簧、衰减、橡皮筋与投影数学，以及播放它的合成器动画器。此处没有任何内容从包入口导出。Core 的动效与手势模块按路径读取该表；组件通过内部动效角色（`roles.ts`）读取触摸动效，因此各自保留其测量值；ProgressBar 通过 `resolveMotion` 播放入度表的两个角色。

## 文件

| 文件                                             | 说明                                                                                                                                   |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `uikit/`                                         | 常量表：每个弹簧、时长、减速率、橡皮筋常量与曲线，均附来源。                                                                           |
| `uikit/springs.ts`                               | 交互弹簧（导航、表单、提醒、菜单、控件、键盘、横幅）以及 SwiftUI / UIKit 预设。                                                        |
| `uikit/scroll.ts`                                | UIScrollView：减速率、橡皮筋、回弹弹簧、`delaysContentTouches`、滚动到顶部。                                                           |
| `uikit/timing.ts`                                | 非弹簧的时钟与曲线：按压高亮、Core Animation 的命名曲线、键盘、减弱动态效果交叉淡化。                                                  |
| `uikit/paging.ts`                                | 分页 UIScrollView：将释放稳定到其页面的积分器、页面规则、捕获、`setContentOffset(animated:)`。                                         |
| `uikit/alert.ts`                                 | UIAlertController：手指跨操作项的跟踪方式（高亮起始与边界）。                                                                          |
| `uikit/navigation.ts`                            | UINavigationController：推入速度、视差、变暗、转场时钟、交互式返回完成规则。                                                           |
| `uikit/progressBar.ts`                           | UIProgressView 的填充：全轨道时长与曲线、其最小长度与空值 alpha；减弱动态效果的脉冲（三个角色）。                                      |
| `uikit/popover.ts`                               | UIPopoverPresentationController：弹出框增长与收缩回的目标缩放与长度。                                                                  |
| `uikit/gestures.ts`                              | 手势识别器阈值、速度滤波器和触觉替代，以 `{value, unit}` 条目表示（来源见 JSDoc）。                                                    |
| `uikit/picker.ts`                                | UIPickerView：行距、高度与橡皮筋、速度下限、滑行的停止速度、静止吸附、轻点旋转、触感。                                                 |
| `uikit/segmented.ts`                             | UISegmentedControl：选中指示器的弹簧；在减弱动态效果下由动画器的交叉淡化替代。                                                         |
| `uikit/sheet.ts`                                 | UISheetPresentationController：快速滑动速度、距停靠位多近算作在其上、释放向前投影多远，以及低于该速度则不投影。                        |
| `uikit/switch.ts`                                | iOS 26.2 上的 UISwitch：几何、抬升、稳定、移动和跟踪弹簧、翻转距离、轨道颜色。                                                         |
| `uikit/datePicker.ts`                            | UIDatePicker：它为滚轮添加的规则。                                                                                                     |
| `uikit/reorder.ts`                               | UITableView 编辑模式重排：重排控件的认领与边缘自动滚动（滑动播放 `springs.settle`）。                                                  |
| `android/keyboard.ts`                            | Android 的软件键盘（Chrome 配 Gboard）：其滑动的时长与曲线（非主题的）以及它们相对于 Chrome 报告和失焦的启动时机。                     |
| `uikit/zoomMedia.ts`                             | 照片查看器的 UIScrollView 缩放：越过限制的过冲、双击和最大缩放。                                                                       |
| `uikit/swipeActions.ts`                          | 列表行上的滑动操作：认领与轻扫阈值、跟踪与稳定弹簧、释放规则。                                                                         |
| `roles.ts`                                       | 内部动效角色：`spec:AST-094` FR4 指定的弹簧、时长与曲线，由共享表注册，并读回角色的 CSS 形式。                                         |
| `roleValue.ts`                                   | 角色的 CSS 形式书写：弹簧的时长与弹跳、以 ms 计的时长、曲线的 `cubic-bezier()`。                                                       |
| `resolveMotion.ts`                               | 角色的值：其表值，因为按角色的表保持内部（`spec:AST-094` DEC-15）。                                                                    |
| `linearEasing.ts`                                | 每帧采样一次、作为 CSS `linear()` 缓动文本的曲线。                                                                                     |
| `MEASUREMENTS.md`                                | 每个未确认值仍需要的 UIKit 参考采集。                                                                                                  |
| `spring.ts`                                      | 闭式阻尼弹簧、Apple 的每种参数化、稳定时长、追逐移动目标的弹簧。                                                                       |
| `decay.ts`                                       | UIScrollView 的动量滑行。                                                                                                              |
| `coast.ts`                                       | 供 `animator.decay` 使用的释放动量曲线：滑行、边缘弹簧、越过边缘的释放。                                                               |
| `rubberBand.ts`                                  | UIScrollView 越过边缘的阻力及其反函数。                                                                                                |
| `projection.ts`                                  | 释放目标：最接近投影滑行的静止点。                                                                                                     |
| `paging.ts`                                      | 分页：将 UIKit 的分页稳定作为可播放曲线、其速度下限、动画页面滚动。                                                                    |
| `resolveSnapPoint.ts`                            | 释放策略：释放落到的吸附点（快速滑动、退出取消、步进限制），基于 `selectSnapPoint`。内部。                                             |
| `bezier.ts`                                      | 三次贝塞尔计时函数（Core Animation 的命名曲线）。                                                                                      |
| `animator.ts`                                    | 合成器动画器：将弹簧、滑行和任意闭式曲线编译为 Web Animations，并以解析方式读回。                                                      |
| `progress.ts`                                    | 弹簧的进度、从一条曲线映射到另一条（伴随曲线、钳制范围）、延续运动的速率。                                                             |
| `presentation.ts`                                | 每个移动元素绘制位置相对于引擎命中测试位置的关系，由动画器在 translate 运行期间报告；手势宿主在按下时读取。                            |
| `reducedMotionPlan.ts`                           | 动画器的减弱动态效果规划器：一次调用会变成什么——一种交叉淡化，其位移在透明时或立即落地。                                               |
| `opacityFloor.ts`                                | 合成器入场淡入的最低不透明度：Chromium 在动画开始时跳过绘制恰好为 0 的图层。                                                           |
| `__tests__/animator.interaction.browser.spec.ts` | 交互测试支架上的浏览器验证（Chromium 与 WebKit）：主线程繁忙、穿过阻塞的结束状态、无 Layout / Paint、定位后的曲线、对话框的 backdrop。 |

组件特定的值（表单的停靠位、开关的几何、上下文菜单的时间线）位于每个组件各自的领域文件 `uikit/<component>.ts` 中，遵循相同规则。

## 动效角色

动效角色是 `spec:AST-094` FR4 为其用途命名的弹簧、时长与曲线（`springs.settle`、`timing.stateChangeMs`、`timing.curves.move` 等）：共享表在注册时列出它们（`roles`），而其他每个值——包括组件的测量弹簧——都是普通常量。按角色的表保持内部（`spec:AST-094` DEC-15）：角色按主题的节奏播放其表值，且没有任何代码读取角色自己的 CSS 变量（`--motion-springs-settle`），因此任何页面或主题样式都不设置角色。一个表的角色只有在 `register<Name>Table()` 运行后才存在。不播放弹簧的页面不携带弹簧注册表；每个弹簧角色在播放它的模块加载时自行注册（一次幂等的内存写入，无 DOM）。导航、分页和选择器表在导入时自行注册，动画器注册减弱动态效果淡化的曲线。动画器在动效开始时解析交给它的每个角色；自行计时的代码调用 `resolveMotion(element, timing, 'stateChangeMs')`。手势阈值和决定触摸归属的时序不是角色。

## 动画器

```
import {createMotionEngine} from '../motion/animator';
import {coast} from '../motion/coast';
import {solveSpringTowardRamp, toSpring} from '../motion/spring';
import {resolveMotion} from '../motion/resolveMotion';
import {springs} from '../motion/uikit';

const animator = createMotionEngine(sheet);
// The animator plays a motion role (spec:AST-094 FR4), its table value, as the
// per-role tables stay internal (DEC-15); math on a spring reads the role with
// resolveMotion.
const spring = springs.settle;

// A drag writes one style per frame and never renders:
animator.set({y: offset});

// The finger lifts: spring to the detent with the release velocity (px/s).
const handle = animator.animate({y: detent}, {spring, velocity: {y: 1200}});

// A finger lands mid-flight: where is the sheet right now, how fast?
const y = animator.get('y', event.timeStamp);
const v = animator.getVelocity('y', event.timeStamp);
animator.stop(['y']); // freezes at the value on screen

// A throw on a scroll-like surface, with an edge (coast.ts builds the curves):
animator.decay(coast(animator, {x: velocityX}, {bounds: {x: {min: -maxScroll, max: 0}}}));

// Any closed-form curve, here a press that keeps deepening: the target
// scale falls at 0.16/s and the platter follows it on a spring. Press
// feedback has no fade of its own, so it is skipped under Reduce Motion.
if (animator.reducedMotion() === 'off') {
  const ramp = solveSpringTowardRamp(toSpring(resolveMotion(sheet, springs.quickChange)), {
    from: 1,
    target: 1,
    slope: -0.16,
  });
  animator.play({scale: {duration: 0.266, at: ramp.value, velocity: ramp.velocity}});
}

await handle.finished; // true if it ran to the end, false if interrupted
```

- 驱动 `x`、`y`、`rotate`、`scaleX`、`scaleY`（`scale` 同时设置两者）和 `opacity`，通过独立的 CSS 属性 `translate`、`rotate`、`scale` 和 `opacity`。元素的 `transform` 保持为组件自己的。
- `get` / `getVelocity` 计算曲线；从不读取 DOM。
- 提升：动画器创建的每个动画以及每次 `set`，都会在同一任务内为其通道赋予合成层（内联 `will-change`，与元素自身的合并），在最后一次运动后 500 ms 清除。`set(values, {promote: false})` 不创建合成层地写入，用于不能给元素分配图层的一次性开关。Mobile Safari 需要它来在阻塞的主线程中运行动画曲线。伪元素通过其宿主上的 `--astryx-motion-will-change-<pseudo>` 提升；其样式通过 `willChange: 'var(--astryx-motion-will-change-before, auto)'` 选择启用。
- `atRest(properties)` 在它们都不再移动后解析，即在最后一条曲线结束后，无论由谁启动。
- `rebase({y: -shift})` 立即移动属性，如同布局偏移；在弹簧上移动的属性保留其弹簧、速度和目标。
- `play` 将与时间相关的值和速度函数给定的任何曲线（来自 `solveSpringTowardRamp` 追逐移动目标的弹簧、拟合的 UIKit 曲线）完全像弹簧一样烘焙。
- 除非传入速度，`animate` 总是从呈现值以呈现速度开始，因此重新定位是连续的（`handle.retarget(to)` 保留该调用的弹簧）。
- 从静止开始的调用没有开始时间，因此浏览器在提交它时启动，如 Core Animation 所做：该帧之前的阻塞会延迟运动，而不是跳过它。WebKit 将开始时间定在阻塞之前的那帧，因此当创建动画的任务（呈现调用的第二帧）运行超过两帧时，开始时间会移到该调用在其后的第一次读取，连同该任务的所有调用。该调用启动的一切共享这个开始时间（`handle.started`）；仍在移动的曲线的重新定位保留显式的开始时间，而在已经显示为静止的尾部上的重新定位（在其目标的两个采样容差以内，且慢于每帧一次）则视为从静止开始的调用。`{at}` 将多个动画器放在同一个时钟上。`{start: 'commit'}` 让浏览器也为重新定位定日期；`{start: 'presented'}` 等待两帧，直到静止的元素已被呈现。`handle.curve(property)` 是调用播放的曲线，供伴随者跟随。`{additive: true}` 按 UIKit 的方式重新定位：旧曲线继续运行，变化叠加在其上，在一个动画中完成。
- 减弱动态效果（`prefers-reduced-motion: reduce`，design:reduced-motion）：每个 `animate` 和 `play` 都被替换，没有任何移动、缩放或弹簧。在粗略主指针上，或对于由触摸拖动释放启动的调用（`{touchRelease: true}`），它是仅不透明度的交叉淡化，时长为 `timing.reducedMotionCrossFadeMs`（200 ms）：从 0 入场则落地并淡入，向 0 退出则淡出后落地，不透明度变化则淡化，其他任何移动则下沉（淡出、落地、淡入）。位移在元素透明时以普通样式写入落地，绝不以动画变换实现。在任何其他指针上则立即完成。`{crossfadeAs: 'entrance'}` 或 `'exit'` 让不改变不透明度的滑动获得方向。任何选项或主题值都不会延长淡化或保留位移。对于动画器不驱动的动效，`reducedMotionFade()` 回答同样的策略，`reducedMotion.stylex.ts` 保存其 CSS 常量以及 StyleX 过渡展开的两个媒体查询。衰减的动量在减弱动态效果下保持运动：延续甩动的动量是直接移动（DR2、DEC-2）。标记为 `isTransition` 的曲线（滑行从越过边缘处回弹的弹簧），就像组件在释放时朝其选择的目标启动的弹簧，遵循减弱动态效果策略：在粗略指针上或触摸释放后（`decay(curves, {touchRelease: true})`）进行交叉淡化，其他地方立即完成。
- `animatorFor(element)` 返回元素唯一的动画器，因此从多个位置为其制作动画的代码（x 上的轻扫、y 上的移除）会在一个 `translate` 轨道中组合。
- `createMotionEngine(dialog, {pseudoElement: '::backdrop'})` 驱动伪元素；没有内联样式来保持它时，一个静态填充动画在伪元素存在期间保持其结束值，直到下一个动画替换它。等于其 `base` 的值（`{base: {opacity: 0}}`，即其样式表在静止时显示的值）不会被保持，因此伪元素在静止时不保留合成层；在开发中，当样式表显示另一个值时，第一个这样的值会发出警告。对话框每次打开时都会重新创建其 `::backdrop`，因此呈现会在 `showModal()` 之后立即在同一任务中 `set` 其起始值（在它之前 `set` 会落在打开所替换的 backdrop 上）。

### 如何保持在合成器上

每条曲线都被烘焙成 30 Hz 网格上的关键帧，细化到线性插值在每个通道的容差内（`SAMPLE_TOLERANCE`，移动为四分之一像素），并以 `easing: linear` 在一个开始时间播放。元素的内联样式保存曲线起始的值，即元素所在的位置，绝不是它要去的位置；关键帧在曲线结束后的一分钟内保持结束状态（`END_HOLD_MS`），主线程在结束后一运行就回收已完成的动画，并在同一任务中内联写入结束值。因此动画结束的那一帧不需要主线程，也不会闪烁，即使曲线结束时主线程被阻塞（否则 WebKit 的合成器会回退到其主线程在飞行中提交的最后一个值）。

在 translate 运行期间，动画器向 `presentation.ts` 报告元素：其偏移（当前曲线值减去引擎最后解析的值，实时读取）以及一个 `resolve`，让引擎在当前绘制位置对其进行命中测试（一次自定义属性写入）。iOS WebKit 在动画进入合成器时保持其解析的变换，因此它在整条曲线期间都按该起始位置报告并命中测试元素，直到样式写入再次解析它。手势宿主在按下时解析移动元素，因此触摸能到达所绘制的位置（`gestures/README.md` 中的“Touches on moving elements”）。仅限平移。

使用关键帧而非单个 `linear()` 缓动：在 Chromium 中测量，两者都会被合成，且对相同采样同样精确；但 WebKit 的 Core Animation 路径不会加速缓动为带点 `linear()` 的效果（`KeyframeEffect::canBeAccelerated`），除非启用其较新的线程化动画，因此在较旧的 iOS Safari 上，`linear()` 弹簧会在主线程上运行。关键帧之间的线性段直接映射到 Core Animation 关键帧动画。

## 数学

`spring.ts` 在三种情形下以闭式解求解 m·x″ + c·x′ + k·x = 0：这是 SwiftUI 的 `Spring`、`CASpringAnimation` 和 `UISpringTimingParameters` 背后的模型。弹簧描述保持在其来源的词汇中（质量、刚度和阻尼；时长和弹跳；响应和阻尼比），`toSpring` 将其归一化。不允许过阻尼的质量、刚度和阻尼描述会被钳制到临界阻尼，正如 Core Animation 对 UIKit 附加的每个弹簧所做。测试将其与独立的四阶 Runge-Kutta 积分在阻尼比、响应和释放速度的扫描上对照；与 WebKit 自己的弹簧求解器移植版对照；与 WWDC23 “Animate with springs” 的转换方程对照；并与 iOS 26.2 模拟器上从 UIKit 读取的值对照：一组弹簧和速度的 `settlingDuration`，以及 UIKit 给其弹簧 API 的时长，稳定公式将其复现到最后一位（欠阻尼）或在 0.02 % 以内（临界阻尼）。`decay.ts` 与减速率的逐毫秒字面模拟以及 WWDC18 的投影函数对照；`rubberBand.ts` 与模拟器上测量的 UIScrollView 过度滚动对照。`uikit/values.test.ts` 通过这套数学播放表中的值。

## 浏览器验证

`__tests__/animator.interaction.browser.spec.ts` 在交互测试支架上运行：真实的动画器从源码打包到一个空白夹具页面，在 Chromium 和 WebKit 的手机配置上运行。

- 一条缓慢的弹簧在主线程被阻塞 1 s 期间，在每个录屏帧上持续前进，且每一帧都位于解析曲线上，时间偏移一致。
- 在阻塞期间结束的弹簧继续显示其结束状态。没有动画器的结束状态保持，WebKit 会回退到飞行中的值。
- 动画期间不运行 Layout 或 Paint（Chromium 跟踪）。
- 定位到固定时间时，引擎在采样容差内播放解析曲线，每个通道都在同一个开始时间。
- 完成的动画在曲线结束后的一两帧内离开元素。
- 对话框的 `::backdrop` 在定位时跟随曲线并保持其结束状态。
- 设置 `springs.settle` 变量的作用域不产生任何变化：按角色的表保持内部（DEC-15），因此引擎在那里也播放表中的弹簧。

```
pnpm test:interaction packages/core/src/motion
```

在 WebKit 无法于宿主机启动的地方，测试支架的容器脚本会运行它。iOS Safari 检查是 iOS 模拟器上的同一验证。

## 来源

`uikit/` 中的每个值都在旁边携带其来源，作为条目上的 JSDoc 标签：

```
/**
 * What the value is, in UIKit's words.
 * @source apple-docs https://developer.apple.com/documentation/…
 */
key: value,
```

允许的来源类型：

- `@source apple-docs <developer.apple.com URL>`
- `@source wwdc <year>-<session> "<title>": <what it says>`
- `@source webkit Source/<path> <what it says>`（Apple 的引擎，在其自己的注释中与 UIKit 匹配；由测量确认）
- `@source measured: <app>, iOS <version>, <method>, <date>`
- `@source GUESS — <what it is based on>`

`GUESS` 或 `webkit` 值还会指明将确认或替换它的测量（`@measure M-…`，列在 MEASUREMENTS.md 中）。当不同部分来自不同地方时，一个条目可以携带多个来源。来源是文档，不进入包：没有值携带它们，包括 `uikit/gestures.ts`（其条目仅发布 `{value, unit}`）。`uikit/uikit.test.ts` 在每个领域文件上强制执行这一切：无来源的值、未知类型、没有任务的猜测、MEASUREMENTS.md 中缺失的任务，或值中的来源，都会使构建失败。

测量来自 iOS 模拟器：内置应用（Settings、Maps、Photos、Files、Contacts、Calendar、Reminders、Safari 自己的界面）或读取 UIKit 附加的动画、识别器和触觉的 UIKit 宿主应用。每个都标明其 iOS 版本；iOS 26.2 是参考。

### 添加常量

1. 找到来源：Apple 文档、WWDC 会话，或 iOS 模拟器上的测量。
2. 将条目添加到其所属的领域文件，使用其来源的词汇（以响应和阻尼比发布的弹簧保持 `{response, dampingRatio}`）。
3. 用其 `@source` 标记。尚无来源：写下最有依据的 `GUESS`，说明其依据，向 MEASUREMENTS.md 添加测量任务，并用该任务标记条目。
4. 当测量落地时，替换值，标记为 `@source measured: …`，并删除 `@measure` 标签。

## 测量

[MEASUREMENTS.md](MEASUREMENTS.md) 是 UIKit 参考采集的唯一列表：每个值仍需从 iOS 模拟器获取什么、要采集的应用和手势、要提取的值和方法。`uikit/` 中的每个 `@measure` ID 都在那里解析。
