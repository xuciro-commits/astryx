---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-107
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
phase: accepted
owners: [cixzhang]
affects_architecture:
  [architecture:public-component-api, architecture:react-component-runtime]
affects_families: []
affects_contributing: []
affects_consumer_docs:
  [
    usePanGesture,
    useDragToSnapPoints,
    useAnimator,
    createPanGesture,
    createDragToSnapPoints,
    createAnimator,
    createContextMenu,
    useContextMenu,
  ]
---

# Public gesture hooks system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/hooks/**",
    "packages/core/src/dragToSnapPoints/createDragToSnapPoints.ts",
    "packages/core/src/gestures/createPanGesture.ts"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

产品可以跟随拖动、把元素停靠到吸附点上，并用与 Core 相同的动效为单个元素做动画，途径是三个公开工厂以及架在其上的三个 React hook；它也可以通过一个公开的无头层为任意元素提供上下文菜单。这些 hook 只交出值，绝不交出背后的手势机制，后者保持为内部实现。

## Non-goals

- 把识别器、手势竞技场、内部 animator 模块以及吸附点解析器作为公开 API；它们保持为内部实现（`spec:AST-017` FR21）。
- 按下与长按，这些由 `useLongPress` 负责。
- 为区域的布局做动画，这由 `spec:AST-105` 负责。
- 在主题的动效旋钮之外挑选弹簧或曲线（`spec:AST-108`）。

## Public contract

```tsx
import {
  createPanGesture,
  createDragToSnapPoints,
  createAnimator,
  createContextMenu,
} from '@astryxdesign/core';
import {
  usePanGesture,
  useDragToSnapPoints,
  useAnimator,
  useContextMenu,
} from '@astryxdesign/core/hooks';

usePanGesture(ref, {
  axis: 'x',
  onPan: ({state, translation, velocity}) => {},
});

const {settleTo} = useDragToSnapPoints(ref, {
  axis: 'y',
  snapPoints: [0, 240, 480],
  flickThreshold: 1008,
  onSettle: index => {},
});

const animator = useAnimator(ref);
animator.animate({x: 120});

// Without React:
const pan = createPanGesture(element, {axis: 'x', onPan: () => {}});
const snap = createDragToSnapPoints(element, {
  axis: 'y',
  snapPoints: [0, 240, 480],
  onSettle: index => {},
});
const animator2 = createAnimator(element);
pan.destroy();
snap.destroy();
animator2.destroy();
```

## Requirements

- **FR1 — `usePanGesture` 以值的形式报告拖动。** 当元素上的拖动开始、变化、结束或被取消时，`usePanGesture(ref, {axis?, onPan})` 会以 `{state, translation, velocity}` 调用 `onPan`。`axis` 把拖动限制在 `'x'` 或 `'y'` 方向。手指、鼠标和触控笔都能驱动它（`spec:AST-094` FR43）。它绝不交出识别器对象，也不识别按下或长按。被取消的平移报告 `velocity` {0, 0}，因此取消时不会发生甩动。
- **FR2 — `useDragToSnapPoints` 把元素停靠到吸附点上。** `useDragToSnapPoints(ref, {axis, snapPoints, flickThreshold?, onSettle})` 让拖动沿 `axis` 移动元素，并且在所有指针下都生效，与 FR1 相同。`snapPoints` 是沿 `axis` 相对元素静止位置的像素偏移量，按升序排列；与 BottomSheet 的 `snapPoints` 不同，它们不是视口比例。松手时，元素停靠到离其当前位置最近的吸附点上，但有一个例外：速度快于 `flickThreshold` 的松手（单位为像素每秒，默认 1008，落在 UIKit 的 sheet 从停靠弹簧切换到快滑弹簧的 (996.7, 1028.3] pt/s 区间内；该取值是在 iOS 26.2 模拟器、iPhone 17 Pro 上，于 2026-10-23 和 2026-10-24 通过一个 UIKit 实验宿主应用、对 134 次拖动松手测得的）会按该方向带到下一个吸附点；而松手速度指向拖动起点方向时，则回到起始的吸附点（`spec:AST-094` FR37）。该阈值之所以公开，是因为产品自己的吸附表面决定快滑多容易生效：一个应在轻快滑动时关闭的矮抽屉，和一个不应因同样的拖动而移动的高面板，会把同一次拖动带到不同的吸附点，而任何动效角色或主题旋钮都无法表达这一点（`spec:AST-002` FR5）；Core 组件则保留自己的内部取值（`spec:AST-100` FR3）。在减少动态效果下，元素不做位移直接到达其吸附点（`design:reduced-motion` DR1–DR3）。`snapPoints` 在使用前会被排序，`onSettle` 和 `settleTo` 也按该升序计数索引；空列表，或 `settleTo` 传入超出范围的索引，什么也不做，并在开发环境发出警告。元素停靠后，它会调用 `onSettle(index)`。它返回 `{settleTo(index)}`，可在没有拖动的情况下把元素停靠到吸附点上，这也是键盘路径。
- **FR3 — `useAnimator` 为单个元素做动画。** `useAnimator(ref)` 返回针对 `ref` 背后元素的 `animator`，也就是 `usePanGesture` 和 `useDragToSnapPoints` 接收的那个元素 ref，因此一次拖动和一次动画共享同一个元素；它不交出自己特有的 ref。`animator` 是一个公开句柄 `AnimatorHandle`，覆盖 `x`、`y`、`scale`、`rotate` 和 `opacity` 这些通道，与内部 animator 模块不同：`animate(target, {velocity?}) → Promise<void>` 把给定通道以弹簧动效送到 `target`；`decay(velocity) → Promise<void>` 让它们从某个速度开始惯性滑行；`set(values)` 让它们直接跳变；`get()` 和 `getVelocity()` 读取它们；`stop()` 让它们停在原处。每个动画都会规划 Reduce Motion（`design:reduced-motion` DR1–DR3）。每个 `animate` 都在 `springs.stateChange` 动效角色上播放（`spec:AST-094` FR4），该角色遵循主题的节奏与性格（`spec:AST-108` FR3）；每个 `decay` 都在固定的动量衰减上播放（`spec:AST-108` FR4）；不提供选择任何其他弹簧或曲线的能力。对未知通道调用 `animate`、在 `ref` 挂载之前的任何调用，以及 `destroy` 之后的任何调用，都不做任何事并立即 resolve。之后对某通道的 `animate`、`decay`、`set` 或 `stop`，会在该通道停止的位置结算它先前的 promise。重新挂载会从元素的静止值开始；卸载后不保留任何 animator 值。
- **FR4 — 每个 hook 只负责一件事。** `usePanGesture` 不做按下或长按，这些由 `useLongPress` 负责。`useAnimator` 为一个元素做动画，而 `useAnimatedLayout` 为一个区域做动画（`spec:AST-105`）。组件自身的 props，例如 BottomSheet 的 `snapPoints` 或 Carousel 的 `hasSnap`，仍然是通往相同行为的组件路径。手势与动效模块中的其他一切保持为内部实现（`architecture:public-component-api` INV21）。
- **FR6 — 每个 hook 都是工厂之上的薄封装。** 每个 hook 在 `createReorderable` 所属的同一个 `create…` 家族中都有一个非 React 工厂：`createPanGesture(element, {axis?, onPan}) → {destroy}`、`createDragToSnapPoints(element, {axis, snapPoints, flickThreshold?, onSettle}) → {settleTo(index), destroy}`，以及 `createAnimator(element) → {animate, decay, set, get, getVelocity, stop, destroy}`，行为遵循 FR1–FR3。hook 与其工厂是两层上的同一个 API（`architecture:public-component-api` INV21）：hook 完全委托给它的工厂，自身没有任何行为。`destroy` 移除该工厂添加的每一个监听器，而导入一个工厂不做任何 DOM 工作，因此在服务端是安全的。没有哪个内部工厂与公开工厂同名（`architecture:react-component-runtime` INV13）。`createPanGesture` 在拖动过程中调用 `destroy()` 会报告一次 `cancelled`；`usePanGesture` 卸载时不报告任何内容（卸载后没有回调）。对 `opacity` 的 `decay` 停在 0 或 1。
- **FR7 — Core 与 Lab 使用公开层。** 只要公开的手势或动效 API 覆盖了组件的工作（此处的工厂与 hook、`createReorderable` 以及 `useAnimatedLayout`），Core 和 Lab 组件就必须使用它，而不是使用它下面的内部实现。组件只有在该公开层未暴露某项工作时才触及内部实现；这些工作作为已知公开 API 缺口列在 `architecture:react-component-runtime` INV13 中。`createReorderable` 的普通元素挂载路径（`spec:AST-103`）覆盖非 List 的集合。公开的平移与吸附点拖动下方的内部实现，是 `createPanGesture.ts` 中的 `createPan`，以及 `createDragToSnapPoints.ts` 中的 `createSnapDrag`。没有任何包入口导出它们。`createPan` 接收识别器自身的选项：哪些指针和滚动会启动拖动、它的接管距离，以及对其开始的闸门条件。它的报告额外包含接管时的位移以及驱动拖动的来源。`createPanGesture` 这些都没有：它在每个指针上启动，且不响应滚动。`createSnapDrag` 接收一个模型，描述拖动把元素画到哪里、松手落在哪里。它还接收平移自身的选项，并在给定自定义属性时绘制到该属性中。`createDragToSnapPoints` 两者都没有：它一比一跟随手指，绘制 `translate`，并按 Core 唯一的一套松手策略落位每一次松手。
- **FR8 — 一个无头上下文菜单。** `createContextMenu(element, {items | render, label?, isDisabled?, onOpenChange?, presentation?}) → {open(at?), close(), destroy()}` 为任意元素挂载一个上下文菜单：它在元素收到上下文请求（长按、右键单击或 Shift+F10）时打开，若给出 `at` 则在 `at` 处打开；`render(container)` 用纯 DOM 把自定义内容填入菜单容器；`label` 为菜单命名，`isDisabled` 阻止它打开，这些共享选项的含义与 `component:ContextMenu` 同名 props 的含义相同；它的菜单遵循 WAI-ARIA 菜单模式：焦点从第一个启用的行开始，上、下方向键在行之间移动，Home 和 End 跳到两端，Escape 关闭，在菜单外按下会关闭它（跳过手指按下所发送的兼容性鼠标事件；在手指下时，如 `spec:AST-094` FR32、FR33 和 FR35 所述），关闭时焦点回到该元素；`destroy` 移除它添加的每一个监听器。`useContextMenu(ref, options) → {open, close}` 是它轻量的 React 封装（FR6）：它像 `component:ContextMenu` 那样以 `menuContent` JSX 接收自定义内容，并把一个将其 portal 进容器的 `render` 交给工厂，这就是它唯一的工作；`component:ContextMenu` 建立在它之上（FR7）：两层上的同一个 API（`architecture:public-component-api` INV21）。
- **FR5 — 每个 hook 都随附文档和一个扑克牌示例。** 这里的每个公开 API（工厂与 hook 皆然）以及 `createReorderable` 的 `positions`（`spec:AST-103`），都随附 docsite 文档：它的用法、它的选项、它的键盘与辅助技术路径、它的 Reduce Motion 行为、一条说明何时应改用组件自身 prop 的提示（FR4），以及一个实时示例。旗舰示例是一个只建立在公开层之上的扑克牌演示，一份用纯 JavaScript 加工厂实现，一份用 React 加 hook 实现：一张快滑后吸附回位的牌、可按拖动和键盘重排模式重排的牌、一次把牌丢掉的滑动，以及一只使用自定义 `positions` 的展开手牌。

## Current-state impact

- `architecture:public-component-api` INV21 把架在公开工厂之上的 hook、以及完全建立在公开工厂之上的组件，视为与它同属一个 API。
- `architecture:react-component-runtime` INV13 增加三条规则：识别器家族是唯一的类家族，靠 `kind` 区分，绝不用 `instanceof` 区分，并且速度跟踪器移到 `create…` 工厂；没有哪个内部工厂与公开工厂同名；以及已知公开 API 缺口清单。
- Core 新增这三个工厂以及架在其上的三个 hook、无头上下文菜单及其 hook、迁移到它们之上的 Core 和 Lab 组件（FR7）、`architecture:react-component-runtime` INV13 缺口清单、它们的 docsite 页面，以及一份用纯 JavaScript 和 React 编写的扑克牌示例。

## Verification

| 契约 | 验证                                                                                                       | 代表性状态                                                                                                                             | 变异或失败预期                                                                                                                                           |
| ---- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | `usePanGesture` 的单元测试与浏览器测试                                                                     | 每个轴上的拖动、一次取消、一次按下、一次长按                                                                                           | 结果中出现识别器、缺少某个状态、拖动偏离其轴，或把按下或长按报告为平移，均判为失败                                                                       |
| FR2  | `useDragToSnapPoints` 的单元测试与浏览器测试                                                               | 一次慢速松手、一次超过 `flickThreshold` 和默认快滑速度的快滑、一次回退方向的松手、从按键调用 `settleTo`                                | 停靠到错误的吸附点、反向拖动却停靠在别处，或缺失 `onSettle`，均判为失败                                                                                  |
| FR3  | `useAnimator` 的单元测试与浏览器测试                                                                       | 每个方法、Reduce Motion、未挂载的 ref、未知通道、`destroy` 之后的调用、同一个 ref 上的平移与 animator                                  | 缺少某个方法或通道、hook 交出了 ref、`animate` 不在 `springs.stateChange` 上，或动效忽略 Reduce Motion，或对未知通道、`destroy` 之后抛出异常，均判为失败 |
| FR4  | 对 `@astryxdesign/core` 及其 hooks 的导出检查                                                              | 公开导出                                                                                                                               | 识别器、竞技场、内部 animator 模块或解析器可从公开导出到达，即判为失败                                                                                   |
| FR6  | 每个工厂及其 hook 的单元测试、服务端渲染与导入检查，以及 `destroy` 之后的监听器计数                        | 每个不依赖 React 的工厂；每个 hook；一次服务端导入；拖动中途 `destroy`                                                                 | hook 有工厂不具备的行为、`destroy` 后仍残留监听器，或导入时做 DOM 工作，均判为失败                                                                       |
| FR7  | 对照 `architecture:react-component-runtime` INV13 中的已知公开 API 缺口清单，对 Core 和 Lab 做源码边界检查 | 每个会拖动、吸附、为单个元素做动画、重排或为布局做动画的 Core 与 Lab 组件                                                              | 组件为公开层已覆盖的工作去触及内部实现，或某处对内部的使用其工作不在缺口清单中，均判为失败                                                               |
| FR8  | `createContextMenu` 和 `useContextMenu` 的单元测试与浏览器测试，以及架在其上的 ContextMenu 测试            | 普通元素上的长按、右键单击和 Shift+F10；`open(at)`；`close`；打开状态下 `destroy`；`items` 与 `render`；用鼠标以及在手指下于菜单外按下 | 上下文请求却什么都没打开、`destroy` 后仍残留监听器、hook 有自身行为，或 ContextMenu 绕过工厂，均判为失败                                                 |
| FR5  | 对每个 hook 页面和扑克牌示例的 docsite 审查                                                                | 每个 hook 和工厂的页面；纯 JavaScript 版与 React 版的扑克牌演示                                                                        | hook 缺少用法、选项、键盘路径、Reduce Motion、组件 prop 提示或实时示例，或演示导入了公开工厂与 hook 之外的任何东西，均判为失败                           |

## Decision log

### DEC-1 — Products get a public hook layer, not the gesture machinery

**Reference:** `spec:AST-107/DEC-1`

**Decider:** `cixzhang`, `2026-10-26`

产品需要跟随拖动、吸附，并用 Core 使用的同一套动效做动画。三个 hook 把值交给它们，并各给一个方法供驱动；而识别器、竞技场和 animator 保持内部，因此 Core 可以在不破坏产品的前提下改动它们。

已否决：导出识别器与 animator。

### DEC-2 — Factories under the hooks, and Core uses the public layer

**Reference:** `spec:AST-107/DEC-2`

**Decider:** `cixzhang`, `2026-10-26`

不使用 React 的产品，或自行管理元素的产品，需要同样的手势，因此每个 hook 都是 `create…` 工厂之上的薄封装，也就是 `createReorderable` 已经使用的那个家族。Core 和 Lab 在该公开层覆盖其工作的地方都建立在它之上，因此它的缺口是可见并被列出的，而不是藏在内部实现之后。

已否决：只提供 hook，以及绕过公开层的组件。

### DEC-3 — The context menu gets a public headless layer

**Reference:** `spec:AST-107/DEC-3`

**Decider:** `cixzhang`, `2026-10-26`

列表中的一行、一张卡，或产品拥有的任何元素，都需要上下文菜单，而又不能引入会破坏其标记结构的包装元素，因此该菜单是一个直接挂到元素本身的公开工厂，配一个薄 hook，`<ContextMenu>` 则建立在同一个工厂之上。

已否决：只能通过 `<ContextMenu>` 包装器才能获得的上下文菜单。

### DEC-4 — Edge behaviors of the public animator and pan gesture

**Reference:** `spec:AST-107/DEC-4`

**Decider:** `cixzhang`, `2026-11-02`

被取消的平移报告零速度；工厂在拖动中途调用 destroy() 会报告一次 cancelled，而 hook 卸载时不报告任何内容；opacity 的衰减被钳制在 0–1；重新挂载从静止值开始。

已否决：取消时报告最后的速度；卸载之后的回调；不加钳制的 opacity；跨卸载保留值（一个新的带 key 元素可能继承屏幕外的位置，同时仍然获得键盘焦点）。

## Open questions

无。
