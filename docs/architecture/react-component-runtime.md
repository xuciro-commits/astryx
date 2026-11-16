---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:react-component-runtime
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang]
applies_to: [packages/core/src/, packages/lab/src/]
verified_by:
  [
    packages/core/src/Layer/useLayer.test.tsx,
    packages/core/src/utils/sharedResizeObserver.test.ts,
  ]
deciding_specs:
  [
    spec:AST-086/DEC-2,
    spec:AST-099/DEC-1,
    spec:AST-099/DEC-5,
    spec:AST-105/DEC-1,
    spec:AST-107/DEC-2,
    component:Markdown/DEC-7,
  ]
---

# React component runtime architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "react-runtime": [
      "INV1",
      "INV2",
      "INV3",
      "INV4",
      "INV5",
      "INV6",
      "INV8",
      "INV10",
      "INV11",
      "INV12",
      "INV13",
      "INV15",
      "INV16",
      "INV17",
      "INV18"
    ]
  },
  "concerns": {
    "effects-listeners-observers": {
      "patterns": [
        "\\buse(?:Layout|Insertion)?Effect\\b",
        "\\b(?:add|remove)EventListener\\b",
        "\\b(?:Mutation|Resize|Intersection)Observer\\b"
      ],
      "claims": ["INV2", "INV3", "INV5", "INV6"]
    },
    "slot-presence": {
      "names": ["isRenderable"],
      "patterns": ["!= null && typeof [\\w.?]+ !==? ['\"]boolean['\"]"],
      "claims": ["INV16"]
    },
    "modality-tracking": {
      "names": [
        "useInteractionModalityTracking",
        "useInteractionModalityTrackingFor",
        "trackInteractionModalityIn"
      ],
      "patterns": ["addEventListener\\(\\s*['\"](?:pointerdown|keydown)['\"]"],
      "claims": ["INV16"]
    }
  }
}
```

## Purpose

Astryx 组件应在渲染、交互、节点替换、生命周期重放与卸载过程中保持其文档化的行为。本记录为渲染、处理函数、refs、Effect、外部资源以及私有行为接缝分配共享的运行时角色。

它定义正确性与所有权边界。它并不禁用 React 特性，也不要求在某几种实现方式都能保持同一契约时只采用其中一种模式。

## System model

组件运行时具有四个不同角色：

1. **渲染派生输出。** props、state 和 context 决定当前渲染出的语义。
2. **处理函数处理离散意图。** 指针、键盘、handle 以及其他命令执行由单次操作引起的工作。
3. **refs 保存非渲染的可变数据。** refs 可以持有 DOM 节点、资源、最新值，或其他本身不驱动输出的协调数据。
4. **Effect 同步外部系统。** Effect 把 React state 连接到浏览器 API、订阅、定时器、观察器、网络活动，以及其他生命周期位于渲染之外的系统。

组件与 family 契约继续拥有公共状态语义、受控与乐观行为、焦点、播报、手势以及其他面向用户的结果。本记录仅拥有为履行这些契约而使用的共享 React 生命周期边界。

## Boundaries and invariants

- **INV1 — 渲染始于有效状态。** 渲染输出必须源自当前 props、state 和 context。组件不得渲染一个已知错误的初始状态，再在后续 Effect 中修复它。State 存储无法在渲染期间派生、也无法直接从当前交互得到的信息。DOM 节点和整个 DOM 集合不得存入 React state；只存储最小渲染键，或通过 ref 拥有该节点。
- **INV2 — 离散意图保持离散。** 当发起该工作的处理函数能够执行它时，由单次用户操作或命令式操作引起的工作不得推迟到 Effect 中执行，包括调用 `onChange`、`onOpenChange` 或 `onSave` 这类使用方回调：该回调由引起变化的处理函数触发，绝不来自响应结果 state 的 Effect。把同一 state 用于渲染输出，并不能使该操作由 Effect 拥有的副本变得合法。推迟不得延迟、重复该操作，也不得把它与无关的渲染耦合。
- **INV3 — Effect 同步外部系统。** 交互逻辑位于回调中；没有 Effect 响应交互 state。新增或变更的 Effect 必须指明它所同步的外部系统。当 setup 获取、安装或启动资源时，cleanup 必须释放该资源。不获取任何资源的同步必须改为幂等，并在依赖变化、节点替换、卸载和 StrictMode 重放下保持安全。普通的重新渲染同步不得重复使用方可见的回调或其他一次性工作。最新值 ref（事件或手势回调通过它读取最新的已提交 prop 或回调）只经过 Core 内部的 `useCommittedRef` hook（DEC-3），该 hook 在提交阶段的插入 Effect 中写入它：没有逐站点 Effect 副本，也没有渲染期的 `ref.current =` 写入。其第二种调用形态 `useCommittedRefInto(ref, value)` 写入一个更早声明的 ref，具有相同的插入 Effect 时序和相同的读取规则，供声明在其所读取值之上的回调使用；它写入调用方交出的那个 ref。此类 ref 只在事件与手势回调中读取，绝不在渲染期间或 `useMemo` 中读取；渲染直接读取该值。由一个 hook 统一决定时序，而在 Core 的 React 下限版本上 React 并没有内置方案。当只有 Effect 调用该回调时，一旦该下限达到 19.2，`useEffectEvent` 会取代它。INV3 缺口：约 45 个 Core 与 Lab hook 和组件在各自 Effect 中保存最新值 ref，例如 `useLayerDismissal`、`useHotkeys`、`useGestureRecognizer`、ComplexSelector 以及 Lab 的 NavigationStack。
- **INV4 — 可变 ref 不会成为隐藏的渲染状态。** refs 可以持有一般的非渲染可变数据。ref 变更不得成为后续为产生 React 渲染输出而读取的值的唯一来源。当 DOM 更新本身就是可观察的操作，且 attach、detach、替换与使用方覆写行为保持当前契约时，回调 ref 可以同步更新其拥有的 DOM 节点。以 ref 为支撑的协调必须保持当前组件、family、无障碍与 API 契约。一个例外是所有者 2026-11-09 的决定（`component:Markdown/DEC-7`）：Markdown 的流式淡入 span 可以起始于渲染期间写入的 refs。文本绝不来自这些 refs，因此被丢弃的渲染只会移动淡入 span。
- **INV5 — 资源所有权完整。** 每个监听器、定时器、动画帧、观察器、请求、订阅和命令式浏览器资源都有一个声明的生命周期所有者。组件或节点拥有的资源在禁用、替换或卸载时被移除、中止或释放。当当前权威指明该生命周期且测试证明存在唯一共享安装时，文档拥有的单例可以跨越使用方空档持续存在。没有当前权威的持久单例是权威缺口，其本身并不构成实现泄漏的证明。可选行为应仅在启用期间获取本地资源。
- **INV6 — 节点替换是生命周期事件。** 回调 ref 或其他节点所有者处理 attach、`null` detach，以及替换为另一节点。旧节点的 cleanup 在新节点成为活动所有者之前完成。
- **INV7 — 观察保持单一语义所有者。** 当 JavaScript 行为确实需要浏览器几何信息时，观察只存储该行为所需的最小 React state，并遵循 INV5–INV6。当单一共享所有者能够提供同一浏览器事实时，重复的行、条目或单元格路径不得产生无界的观察器扇出。
- **INV8 — 行为留在其稳定的生命周期所有者处。** 当前组件、family、交互与 layer 权威标识行为所有者以及文档化的替换/组合接缝；本记录不选择新的所有者。状态机、手势、时序协议或交互算法由某个组件或原语拥有，该组件或原语的生命周期跨越每一处文档化的替换与组合接缝。替换 render prop、slot、子元素或视觉子部件不得静默移除所有者行为。本不变式不要求进行内部 hook 或工具函数的抽取。
- **INV9 — 广播标识遵循广播契约。** 当语义广播载荷未变、而该变化会向使用方广播工作时，context 值与外部 store 快照不得改变标识。公共 hook 结果的标识仍由 `architecture:public-component-api` 与该 hook 的当前契约拥有。普通局部对象和回调不带有共享标识的承诺。
- **INV10 — 自有内容播报集中在一个模块中。** 在 `@astryxdesign/core` 中，播报组件自身渲染内容（`spec:AST-086` FR11）由一个共享的内部模块完成，该模块不导出；将其公开需要 `spec:AST-002` 的准入。core 之外的包无法导入它，每个采用方各自保留一个行为良好的 Effect。采用该机制的 Core 组件不持有自己的 Effect、观察器、定时器或监听器来检测页面加载、读取渲染文本或写入该播报。该模块遵循 INV3 和 INV5。
- **INV11 — 屏幕键盘只有一个所有者。** 在 `@astryxdesign/core` 中，键盘模块（`packages/core/src/keyboard/`）里的一个共享内部 hook 测量屏幕键盘、在聚焦时阻止页面平移，并在某个表面移动时收起键盘（`spec:AST-099`）；它不导出。键盘高度以及每次键盘变化的过渡（起始时间、静止值、曲线）只以该 hook 的值到达样式，并且只存在于该 hook 中：每个使用方通过其自身元素上的 StyleX 函数式样式应用它们，文档根节点或共享祖先上没有任何 CSS 自定义属性承载它们。当被聚焦 Core 字段最近的固定定位祖先不填满视口、其在任何变换之前的布局盒位于视口底边、其自身计算出的 `translate`（应用设置的值，而非模块自身的值）为 `none`、并且在模块测量时应用自身在其位置上没有正在运行的 CSS 过渡或动画（模块自身的搭乘不计入）时，键盘模块还可以在该祖先上写入并移除 CSS `translate`（`spec:AST-099` FR9）。该 translate 等于从该祖先绘制出的底边（在应用自身抬升之后）到键盘顶部的距离；模块在每次键盘报告之后（包括焦点仍在栏内时的高度变化）以及每次焦点移动之后测量它，且在页面自身监听器运行之后进行，因此应用已经抬升的栏不会得到任何 translate；当移动后的盒子无法放入键盘上方空间时，如果某滚动容器持有该字段，模块不写入 translate，否则只平移到聚焦字段越过键盘所需的最小距离，绝不超过容器自身的重叠量，并像每个 Core 搭乘者那样，搭乘该 hook 的唯一过渡到达该值。对该栏的读取是下述 hook 每次键盘变化仅一次布局读取的唯一例外。`translate` 属性会与应用设置的 `transform` 组合。模块在自身 `translate` 不为 `none` 的祖先上不写入任何内容，也不在应用元素上写入其他任何内容。该例外是所有者 2026-11-03 的决定（`spec:AST-099/DEC-5`）：停靠在应用自身底部栏中的字段像位于 Core 宿主中的字段一样搭乘键盘。模块将该写入作为 INV5 资源拥有：一旦焦点离开该字段后键盘隐藏，或一旦该字段卸载，模块就移除 translate。被覆盖的字段从其焦点处理函数开始其键盘行为，绝不从响应焦点的 Effect 开始（INV2），将 `spec:AST-099` FR9 所述的 10 CSS px 间距保持为模块唯一的 `offset` 常量，并把滚动容器缺失的滚动范围作为字段自身元素上的底部偏移补足。没有 Core 组件为键盘保留自己的 visual-viewport 监听器。该 hook 将每次键盘变化发布为一个过渡：起始时间、静止值和一个曲线。每个搭乘键盘的 Core 使用方都用合成器动画搭乘该过渡，即平移到静止值，绝不使用逐帧 JavaScript，并且该 hook 每次键盘变化至多做一次布局读取。Core 之外的组件不搭乘；它一次性提交静止值。Core 之外的包无法导入该 hook；那里响应键盘的组件保留一个监听器，按 `spec:AST-099` FR2 的定义进行测量，像 FR4 那样阻止焦点平移，像 FR5 那样失焦，通过其自身元素上的函数式样式应用高度，并遵循 INV3 和 INV5。该 hook 遵循 INV3 和 INV5。
- **INV12 — 容器内部的尺寸变化有一个模块。** 在 `@astryxdesign/core` 中，一个内部模块产生 `spec:AST-105` 所定义的尺寸变化滑动效果。它测量所报告变化前后的布局，并在 Core 具备共享矩形形变（`architecture:layer-runtime` INV15；`spec:AST-094` FR5）之后，通过该形变播放一个仅使用合成器的 translate 来移动位移的内容；在那之前，该模块播放它自己的合成器 translate。它绝不动画高度。其遍历只访问变化元素直至该区域为止的祖先，以及它们各自层级上两侧的元素兄弟，通过 `parentElement`、`nextElementSibling` 和 `previousElementSibling`，只下探到 `display: contents` 的元素，且每一层的遍历在遇到第一个位于该带之外的兄弟时停止，该带即一帧内的变化可能带入视图的范围（该区域的可见部分加上一个视口，若更大则为变化元素尺寸之和，位于上方与下方），因此其开销随深度以及靠近可见部分的兄弟增长，绝不随列表长度增长。某个块边的显现或隐藏还会移动变化元素自身中该带可显示的子元素，每个都随滑动的帧、在该元素盒上的固定裁剪之下移动，因此该开销随变化尺寸增长，绝不随列表长度增长。当滚动容器选择退出滚动锚定时，带之上的变化会向带的方向前移；该开销随距离增长。在子元素沿块方向排列的容器中（多列、换行的列式 flex 盒，或列流网格），遍历会穿过该层，开销随其子元素增长。同一帧中同一区域的变化一起测量。组件通过一个内部的、未导出的函数报告变化，该函数接收 `useAnimatedLayout` 句柄，因此句柄保持无成员，且每个移动元素都是页面已经渲染的元素，除了交换时旧内容的一份瞬时副本（`spec:AST-105` FR8）。两个 Core 组件为自己的变化持有自己的句柄：AppShell 的内容区域与 SideNav 导轨，在侧边导航收起或展开期间（`component:AppShell` FR17、`component:SideNav` FR6），各自通过交换生成其副本。一个 resize 控制器也为 LayoutPanel 的收起与打开持有自己的句柄，不生成副本（`component:Resizable` FR8）。在粗指针下，没有来自应用句柄的 TreeList 为自己的展开与收起持有自己的句柄，不生成副本（`component:TreeList` FR8）。该模块还可以在页面已渲染的元素上播放调用方提供的帧，使用同一共享动效，不生成副本，并在动效结束时释放它们；AppShell 的内容表面用它来遮盖展开的间隙，当其旧的包裹不被复制时。该模块还产生 `spec:AST-105` FR9 的边显现，即 Core 中唯一的边显现：Collapsible、TreeList 和 Table 的行展开（`component:Table` FR15）使用其块尾形态，SideNav 导轨使用其行内边两态形态并只保留自己的标签与图标的淡入淡出，而可调整尺寸的 LayoutPanel 的窗格在收起与打开时使用它，在其移动边一侧移动内容，resize 控制器在窗格收起状态提交前后测量窗格的盒子，并从其方向所指的边播放（`component:Resizable` FR8、`component:LayoutPanel` FR7）。这些都不是公共的（`architecture:component-style-authoring` INV7）。该模块遵循 INV3 和 INV5。
- **INV13 — 一套共享的内部触摸模块。** Core 的触摸行为来自一套始终存在的内部手势与触摸模块：手势核心、识别器、竞技场、动画器以及触摸按压识别器。识别器家族（其基类、竞技场与宿主）是这些模块唯一使用类的地方，且它不使用继承检查：识别器靠其 `kind` 字段区分，绝不靠 `instanceof`。（实现缺口：识别器目前还没有 `kind` 字段。）其他每个模块以及每个公共层都由 `create…` 工厂构建，速度跟踪器也包括在内（实现缺口：它仍是 `VelocityTracker` 类），并且没有内部工厂与公共工厂同名（`spec:AST-107` FR6）。Core 与 Lab 组件在 `spec:AST-107` 的公共层能覆盖其工作时就使用它，仅因以下已知公共 API 缺口才直接访问这些模块：按压反馈时序；Reduce Motion 交叉淡入淡出常量；跨一组操作的按压跟踪；手势期间的选择锁定；呈现保持；输入保持；从触发器抬升与矩形形变；自定义识别器关系；手势宿主、速度跟踪、橡皮筋与触觉；长按（尚无公共工厂）；弹簧与曲线辅助函数以及 UIKit 的测量表；触摸呈现查询；布局变化报告（`spec:AST-105` FR1）；仅在其边缘由滚动区域交出的下拉（`spec:AST-094` FR14、FR19）；释放可能收起其表面的吸附点拖拽，按使用所测得的投影判定（`spec:AST-094` FR36）；拖拽自身的指针与滚动过滤器、认领距离与起始门限，以及吸附点拖拽自身关于拖拽在何处绘制其元素、释放落在何处的模型（行的滑动：没有鼠标拖拽、UIKit 的死区、手指的跟踪弹簧与释放规则，以及仅靠位置到达的完整滑动，`spec:AST-057` AR2、FR5）；绘制进其组件每个部分都读取的一个自定义属性的拖拽（`spec:AST-057` FR2）；在一个元素上移动另一元素的拖拽（sheet 的把手与滚动主体移动该 sheet；其变暗是 layer 运行时的背景色调，`architecture:layer-runtime` INV14）；动画器超出公共句柄的职责：`springs.stateChange` 之外的动效角色（`spec:AST-094` FR4、`spec:AST-108` FR3）、带重定向播放的闭式曲线、其时钟上的伴随与选定的起始（`spec:AST-094` FR5、FR6），以及移动、入场或退场时的 Reduce Motion 替换（`design:reduced-motion` DR1–DR3）；触摸命中区域扩展；以及 List 的重排会话，用于将可重排对象适配为自身值、或其行不是 `ListItem` 的集合（`createReorderable` 的纯元素 `attach`，`spec:AST-103` FR4b，尚未构建）。一个选定的起始 `start: 'next-frame'` 存在，用于交互在输入事件自身任务中启动的动效。在繁忙页面上，此类动效会在该任务之后的第一个帧开始，因此不会跳过。它是内部的：`createAnimator` 的选项中没有它，也没有公共入口导出它。组件静态导入它们，无论多少组件使用，打包器每页只保留一份副本。由交互显现、组件在 `architecture:component-import-boundaries` INV1 下用 `import()` 加载的表面也静态导入这些模块；打包器仍每页只保留一份副本。该 `import()` 针对该表面模块，绝不针对这些模块之一，它也不是组件懒加载其自身触摸代码（`spec:AST-080` DEC-5）。调用方选择启用、并带有较大资源成本的触摸行为，通过一个公共构造函数提供，该构造函数的模块静态导入该行为所运行的模块；组件不导入其中任何一个，因此只有导入该构造函数的应用才会打包它们（`architecture:public-component-api` INV19）。`Item` 的滑动操作来自 `createSwipe`（`spec:AST-057` FR10）：`Item` 与 `ListItem` 不导入任何滑动模块——手势核心、动画器、面板的渲染以及行的手势代码——而 `Item` 继续为其他职责（例如按压反馈）使用触摸模块。`Item` 中唯一的滑动代码是其已弃用路径，仅为提供其已弃用的 `swipeActions` 与 `swipeBehavior` props，直到它们在 0.8.0 中移除（`spec:AST-057` DEP-0017、CLN-0025）：已发布的加载器，即滑动代码唯一的 `import()`；已发布的行样式；角色门限与 `commit` 警告；已加载层填充的桥接以及进入该桥接的键转发器；以及共存诊断。没有安装调用、没有公共入口，也没有公共的已安装检查；测试仅通过内部 hook 重置模块。组件自身的触摸逻辑是建立在这些模块之上的、位于其自身构建中的少量胶水代码。手势宿主为每个指针附加，没有仅限触摸的查询；在精细指针下，只有使用手势的组件才监听（`spec:AST-094` FR19、FR24、FR43）。手势宿主、按压反馈、页面保持、手指滚动监视与点击防护通过 window 上每种事件类型的一个捕获阶段监听器听取整个文档的输入，并在有订阅者需要时存在。它们按订阅顺序运行，先于任何文档或元素监听器；除非订阅者取消该事件，否则它是被动的。这些模块不是公共导出，也不为使用方提供文档；Core 与 Lab 组件通过 `@astryxdesign/core/internal/touch` 访问它们，该子路径保留给 Astryx 自身的包：无文档、不在兼容性承诺之内、与 Core 同步版本，并由 lint 限制为 Core 与 Lab（`spec:AST-017` FR21）。手指滚动监视的 hook `useFingerScroll` 位于该子路径上：它报告某个滚动容器的滚动是否为手指滚动（当前或过去某个时间），并通过 `onEnd` 报告该滚动何时结束。`timing`（UIKit 的测量时序表）位于该子路径上，供播放相同测量动效的 Lab 组件使用。`prepareFocusReturnOnRemoval` 也位于该子路径上：当移除导致焦点丢失时，它恢复焦点，因此结束的 Lab Tour 步骤会把焦点发送到其目标或打开者。
- **INV15 — 动画器对数字进行动画。** 动画器有一个值模式：它按与其属性通道相同的时序播放一个数字，例如计数或图表值：程序启动的变化使用主题动效 token，仅在 `spec:AST-094` FR45 保留之处使用测量弹簧，并在每一帧把该值交给 `onUpdate` 回调，由组件格式化并写入。组件拥有超过该阈值即切换到新值而非继续计数的变化大小，因此从十二跳到超过一百万也不会空转。在减弱动效下，任何指针上都立即写入新值，作为原地值变化（`design:reduced-motion` DR2）。它不播报任何内容：在组件自身记录播报该值之处，只播报最终值，绝不播报中间值。数字格式化仍由调用方负责。值模式是动画器的一部分，不新增模块，并且是内部的（`spec:AST-017` FR21）。
- **INV16 — 共享关注点在其所有者内扩展并只被调用一次。** 在 `@astryxdesign/core` 中，Core 已在共享 hook 或工具函数中拥有的关注点就在那里扩展；组件只调用它一次，不为该关注点添加自己的 effect、监听器或跟踪器。slot 存在性就是这样一个关注点，由 `isRenderable` 拥有：值为 `null`、`undefined`、`true`、`false` 或 `''` 的 `ReactNode` slot 不渲染自身的任何内容，没有包裹、通道、边框或分隔符，与省略该 slot 时完全一致，而该 slot 本应命名的元素（例如由其 header 标注的树）保留省略该 slot 时的名称。`0` 以及其他每个值都是内容，按 React 渲染它们的方式渲染。RichText 的编辑器与工具栏 slot 使用同一所有者。为某个 slot 固定不同空值判定的组件记录（例如空状态规则）管辖该 slot；数字计数与纯字符串字段不是 slot。（已知实现缺口包括：仍用 `!!value` 或 `Boolean(value)` 这类被转换的真值判定、裸露的 nullish 检查或 `??` 默认替换来测试存在性的 Core slot 尚未遵循本条：它们可能为 `''`、`false` 或 `true` 绘制包裹或通道，丢弃 `0` 或把它渲染成其 slot 之外的游离 `0`，或者对 `''`、`false` 或 `true` 显示空内容而不是其默认值；例如，TopNavItem 的 `children` 为 `''` 会让其链接没有无障碍名称，空的 List `header` 或 Spinner `label` 会给列表或状态一个空名称；Dialog 调用 `useInteractionModalityTracking()`，同时还在第二个文档中保留自己跟踪模态的 Effect；MobileNav 保留自己的页面滚动锁定 Effect 而不是用 `useScrollLock`；BottomSheet 的手势与移动端键盘、DateInput 的月份滚动器、DropdownMenu 的溢出检查、Layer 定位、Popover 以及 Table 的粘性列都各自在 `sharedResizeObserver` 旁保留自己的 `ResizeObserver`；其他 Core 站点则在 `sharedMutationObserver` 旁保留自己的 `MutationObserver`。）
- **INV17 — 渲染保持纯粹。** 组件绝不在渲染期间写入 `ref.current`，惰性的一次性初始化除外。否则，React 丢弃的一次渲染会留下未提交的值。最新值 ref 使用 `useCommittedRef` 或其 `useCommittedRefInto` 调用形态（INV3、DEC-3）。例外：Markdown 的流式淡入 refs（`component:Markdown` DEC-7、INV4）保留为渲染期写入。INV17 缺口：三处在渲染期间或 `useMemo` 中读取最新值 ref 而非读取值本身。INV17 缺口：`useTableSortable` 的 header 从 ref 中读取当前排序，因为其插件被文档化并测试为引用稳定；修复它需要一次 Table API 选择。INV17 缺口：约 70 个组件在渲染期间写入最新值 ref，例如 ChatComposerInput、Slider 和 `useTooltip`。INV17 缺口：约 18 处渲染期读取上一个值；这些不是最新值 ref。ToastViewport 在持有其子元素的 fragment 之前渲染 ToastRefSync（后者通过 `useCommittedRefInto` 写入），因此子元素的布局清理（包括卸载时的清理）读取已提交的列表。INV17 缺口：ToastViewport 在渲染期间写入 `toastsRef` 和 `maxVisibleRef`。
- **INV18 — 布局尽可能少读。** 定位使用 CSS（锚点定位、容器查询、逻辑属性）而不是在 JS 中测量，正如 `architecture:component-style-authoring` INV2 所偏好。逐帧、滚动或尺寸调整的路径不读取布局，除非当前条款要求在那里读取：`architecture:layer-runtime` 的定位重读、INV11 的键盘读取、INV12 与 `component:Resizable` FR8 的前后测量，以及重排拖拽的滚动读取：在重排拖拽期间，引擎在并非由它引起的滚动之后、在其写入之前，每帧读取一次其滚动容器的滚动偏移。每次此类读取都在每次变化的一次批量测量趟中完成，绝不与写入交错。一次读取就是一次测量趟：剩余的读取在注释中说明其理由，并且每次变化发生一次，而非每帧一次，或者作为当前条款要求的前后对。INV11 的键盘 hook（每次键盘变化至多做一次布局读取）就是一个实例。`observeResizeAfterLayout` 像 `observeResize` 一样观察，但没有注册时的调用，因此调用方的首次读取来自布局之后浏览器自身的首次通知（Lightbox 的标题）。（已知实现缺口包括：聊天流滚动 hook 在每个滚动事件上读取滚动几何信息，以及约 49 个调用 `getBoundingClientRect` 的 Core 源文件尚未按此规则检查。）

- **INV19 — 大型行为代码位于共享引擎中。** 组件自身的行为模块（手势、动效、布局测量、滚动、焦点或键盘逻辑，而非渲染或标记）如果超过 300 行源码或 3 KB gzip，就要扩展或复用某个共享引擎（INV13 的触摸模块、动画器与 `animatedLayout`、layer 运行时、hover 识别器、列表窗口化、`useOverflow`），或者其组件记录说明为何没有合适的引擎。新的共享引擎遵循 `architecture:knowledge-contracts` DEC-22。测试、stories、文档、生成文件和数据表不在此规则范围内（DEC-4）。

## Authoring guidance

以下是首选技术，而非独立的兼容性承诺：

- 当外部系统 Effect 需要一个稳定回调，读取最新 props 或 state 而不使这些读取变为响应式时，使用 Effect Event。不要用 Effect Event 隐藏一个其变化本应重新同步系统的值。
- 在可行时保持回调 ref 引用稳定，以免 React 仅因回调标识变化就分离并重新附加未变的节点。
- 呈现性响应优先使用 CSS。何时由容器查询、媒体查询、结构选择器和其他 CSS 机制取代 JavaScript 观察，由样式编写规则拥有。
- 当 Astryx 的共享观察器所有者提供所需的浏览器事实时，复用它。工具链拥有所需的导入与强制；INV7 拥有运行时结果。
- 当可单独命名的状态机、手势、时序协议或交互算法能够形成有用的聚焦测试接缝时，为其提供私有 hook 或纯工具函数。与渲染不可分的小型行为可以保持内联；不要为每个回调抽取 hook。
- 在没有实测的广播边界或当前标识契约时，不要添加记忆化仪式。

只有在违反上述某个不变式或其他当前所有者时，违反指南才成为架构违规。

## Controlled and optimistic state

`architecture:public-component-api`、组件记录与 family 记录拥有受控、非受控与乐观语义。

运行时实现必须保持该当前所有者：

- 受控 prop 不会被随意镜像进第二个真值来源；
- 单独命名的乐观值或待定值遵循其当前所有者适用的结算与生命周期契约；未定义的分支仍归该所有者；
- 回调区分请求的意图与所有者接受的状态；以及
- 受控与非受控所有权在挂载后是否可切换仍归组件拥有，除非当前共享权威另有规定。

## DOM and imperative API boundary

React state 拥有渲染语义。DOM 读取限于浏览器拥有的事实，例如几何信息、焦点、选区、事件边界、原生 dialog 或 popover 状态以及指针捕获，再加上对拥有节点的命令式浏览器操作。任何更窄的组合或内省规则由组件与 API 权威拥有。

`architecture:public-component-api` 还拥有公共 ref 的准入与命名。当该权威允许时，组件可以同时暴露以下两个不同表面：

- `ref`，用于文档化的主要 DOM 元素及其原生能力；以及
- `handleRef`，用于通过 `useImperativeHandle` 实现的、组件定义的语义命令式 API。

本运行时记录只要求任一表面保持生命周期所有权与当前受控状态语义。它不允许 handle、不要求 handle 标识，也不决定其成员。

## Audit-row routing

本记录为以下各项提供共享权威：

- **C5、C6：** 通过 INV1 与 INV4 的派生状态与 ref 支撑的隐藏状态；
- **C19：** 通过 INV5–INV6 的完整外部资源清理；以及
- 通过 INV1–INV3、INV5 与 INV8 的、来自 **C1、C9、C10、C16、C22** 的持久运行时结果。

它通过 INV7 提供一个受 **C7–C8** 启发的窄运行时机制边界，而 CSS 偏好、共享观察器 API 与机械强制由样式编写规则和工具链拥有。

其他行保留其规范所有者：

- **C2、C13：** 公共 API、受控语义、公共 hook 标识以及公共 ref/handle 契约属于 `architecture:public-component-api`、family 和组件记录；
- **C3、C17：** 焦点、播报、分析语义以及保持焦点的可见性属于无障碍、交互、family 和组件记录；
- **C4、C11、C18、C21：** 回调 ref 偏好、ref 读取纯粹性、呈现性组件分类与注释质量仍是 lint 或贡献者指南，除非违反上述某个具体不变式；
- **C12：** 适用的无障碍、layer、交互、family 或组件所有者决定必须组合哪个现有原语；
- **C14：** 本记录定义 React/DOM 状态边界，而公共组合与子元素内省仍归 API/组件拥有；
- **C15：** 每个注册表或数据源保留自己的规范所有者；以及
- **C20：** 数值来源根据该值的用途属于样式、token、组件或交互权威。

## Change coupling

当变化新增或更改以下各项时，会触发聚焦的运行时审查：

- 一个 Effect、state 镜像、ref 变更或回调 ref；
- 一个监听器、定时器、观察器、请求、订阅或命令式浏览器资源；
- 受控或乐观的对账机制；
- context 或外部 store 广播标识；或
- 状态机、手势、时序协议或交互算法的所有权、生命周期或可观察行为。

审查覆盖初始渲染、更新、中断、清理、节点替换、卸载以及适用时的 StrictMode 重放。它还通过当前组件、family、API 与无障碍契约验证代表性的未变行为。

## Owning code

- `packages/core/src/` —— 稳定的 Core 组件与 hook 运行时。
- `packages/lab/src/` —— 使用相同生命周期正确性边界、但未获得稳定公共 API 状态的实验性组件运行时。
- `packages/core/src/utils/sharedResizeObserver.ts` —— 当前共享的 Core 尺寸变化观察机制；其具体 API 由工具链与工具函数测试拥有。
- `packages/core/src/hooks/useCommittedRef.ts` —— 一个内部 hook，具有两种调用形态，位于内部 `useIsomorphicLayoutEffect` 旁边（INV3、INV17、DEC-3）。`useCommittedRef<T>(value: T): { readonly current: T }` 返回一个只读 ref，其 `current` 只在提交阶段的插入 Effect 中写入。`useCommittedRefInto(ref, value)` 写入一个更早声明的 ref，具有相同的插入 Effect 时序和相同的读取规则，供声明在其所读取值之上的回调使用；它写入调用方交出的那个 ref。其注释写道：“只存储值。本代码运行时，指向 DOM 节点的 refs 尚未附加。”内部：绝不出现在 `hooks/index.ts` 或包入口中；Lab 从 `@astryxdesign/core/internal/committed-ref` 导入两者，正如它访问其他 Core 内部件那样。Lab 从 `@astryxdesign/core/internal/shared-context` 导入 `createSharedContext`（其唯一导出），因此 Lab 组件的 context 在一个共享键下到达 swizzle 副本的 provider（`spec:AST-110` FR3）。

## Deciding specs

- `spec:AST-086/DEC-2` —— 自有内容播报在每个播报自身渲染内容的组件中行为一致（INV10）。
- `spec:AST-099/DEC-1` —— 每个组件使用同一个键盘高度，保持内部并通过函数式样式应用（INV11）。
- `spec:AST-099/DEC-5` —— 每个唤起键盘的 Core 字段无需 prop 就停留在键盘上方，而停靠在底部的字段搭乘键盘，同时移动应用底部停靠的固定容器（INV11）。
- `spec:AST-105/DEC-1` —— 尺寸变化滑动的公共形态与行为（INV12）。
- `spec:AST-107/DEC-2` —— 每个 hook 之下的工厂、类与公共名称规则，以及已知公共 API 缺口清单（INV13）。
- `component:Markdown/DEC-7` —— Markdown 的流式淡入 span 可以起始于渲染期间写入的 refs（INV4）。

### DEC-3 — Latest-value refs use one shared internal hook

**决策者：** `cixzhang`、`2026-11-11`

所有者选择了选项 A，即“一个共享内部 hook（useCommittedRef）”：最新值 ref 使用一个共享内部 hook `useCommittedRef<T>(value: T): { readonly current: T }`，位于 `packages/core/src/hooks/`。它返回一个更新为已提交值的只读 ref，其 `current` 只在提交阶段的插入 Effect 中写入，绝不在渲染期间写入。其第二种调用形态 `useCommittedRefInto(ref, value)` 写入调用方更早声明的 ref，具有相同的时序（INV3）。一个 hook 为每个组件提供相同的提交安全时序，并提供一个位置，在 React 19.2 时为只有 Effect 调用的回调采用 `useEffectEvent`。现有模块都不这样做：`useIsomorphicLayoutEffect` 只选择 Effect，而它所取代的逐组件副本各自在自己的 Effect 中或渲染期间写入 ref。

所有者询问它在并发渲染下是否安全。答案是安全的：提交阶段写入能在 React 丢弃的渲染中保留下来，渲染阶段写入则不能，而 `useEffectEvent` 需要 React 19.2 或更高版本。插入 Effect 在同一次提交中先于每个布局 Effect 的 setup 运行，因此其中每个都会读到新值（后代的布局 Effect 清理运行得更早，这正是 INV17 的 ToastRefSync 摆放说明所覆盖的情形）；服务端渲染保留初始值；并且它在 React 18 及更高版本上有效。它在 refs 附加之前运行，因此只存储值，绝不存储 DOM 节点。

已否决：为每个组件写一行 Effect，这会在每个组件中重复相同代码，并使 INV17 所禁止的渲染期写入容易被重新引入。

组件、family、API、无障碍、layer、交互和样式记录对上面委派的其他面向用户结果仍具权威性。

### DEC-4 — Large behavior code lives in a shared engine

**决策者：** `cixzhang`、`2026-11-13`

> “两套规则”——所有者决定，2026-11-13（Cindy），关于未使用特性与共享行为代码的尺寸规则

只被一个组件使用的大型行为文件，是每个带有该组件的页面都要付出代价、且每位维护者都要独自阅读的代码。超过阈值的行为扩展共享引擎，因此一次修复或更小的实现能帮助每个使用它的组件，或者其记录说明为何没有合适的引擎（INV19）。

已否决：把大型私有行为文件完全交给审查判断，因为它们会在无人注意时增长，直到重复实现某个共享引擎。

## Verification

Lint 与聚焦测试是单向证据。lint 失败意味着该构造违反了那条规则所强制的不变式。lint 通过不能证明完整的运行时契约，因为许多所有权、生命周期、组合与可观察行为谓词需要审查或运行时证据。同样，聚焦测试只证明其命名的行为与变更预期；一个绿色的组件测试套件并不意味着全面符合每个不变式。

| 不变式              | 证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 失败信号                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1–INV2           | 初次渲染与交互测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 输出闪现已知错误状态，或某个动作经由 Effect 被延迟或重复执行                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV3, INV5          | StrictMode 的 setup/cleanup 与依赖变更测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 回调重复、工作泄漏、订阅过期，或缺少重新同步                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV3（ref 同步）    | `pnpm review:pre` 的 item j 会标记只把某个值复制进 ref 的 Effect；审查只通过 `useCommittedRef` 或 `useCommittedRefInto` 接受最新值 ref，并在事件或手势回调中读取，绝不在渲染期间或 `useMemo` 中读取。item j 还会标记在渲染期间或 `useMemo` 中读取已提交 ref 的行为，相关测试位于 `scripts/lib/pre-review-findings.test.mjs`                                                                                                                                                                                                   | 逐处写的 Effect 或渲染期写入，以维持最新值 ref 而不使用 `useCommittedRef`；或在渲染期间或 `useMemo` 中读取这类 ref                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| INV1, INV4, INV6    | ref 挂载/置空/替换、拒绝把 DOM 放进 state，以及新节点挂载前清理旧节点的变更                                                                                                                                                                                                                                                                                                                                                                                                                                                   | DOM 节点或集合进入 state、旧节点仍然活动、清理漏掉替换，或 ref 变更悄悄改变语义                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| INV7                | 真实浏览器中的几何测量，加上 N 个使用方的观察器实例/订阅变更                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 几何数据无效、观察器实例随使用方重复增加、一次退订就让同级订阅者失效，或清理移除了其他订阅者                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV8                | 在文档化组合替换下所有者可观察的行为；可选的聚焦内部机制测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 文档化的子部件被替换时，行为消失或所有者改变                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV9                | Provider/外部存储的标识与渲染次数测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 语义负载未变而标识改变，或快照标识造成渲染循环                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| INV10               | 针对播报模块每个采用方的共享测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 采用方为自己内容的播报保留自己的 Effect、观察器、定时器或监听器                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| INV11               | 源码边界检查，加上跨 StrictMode 重放与卸载的 hook 测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Core 中出现第二个键盘监听器或测量；使用方为取得高度而读取根元素或共享祖先上的 CSS 自定义属性；导出该 hook；Core 之外的组件以 AST-099 FR2 之外的规则进行测量，或搭上键盘；卸载后仍残留监听器；焦点已离开该字段、键盘因此隐藏之后，或该字段卸载之后，app 元素上仍残留 translate；对 app 元素的任何其他写入；容器布局盒不在底边、占满视口，或自身 `translate` 不是 `none` 时却施加 translate；模块进行测量时 app 正用 CSS 对容器位置做动画，却对其施加 translate；停靠容器移动后过高而无法置于键盘上方（全高侧边抽屉、固定头下方的窗格）时施加 translate，或在滚动容器容纳该字段时、或滚动容器大于聚焦字段所需清空键盘的空间时施加 translate；在页面自身的键盘监听器运行之前就测量 translate；被遮挡的字段在响应焦点的 Effect 中决定其键盘行为；Core 的 rider 由 JavaScript 逐帧驱动或由其自身 transition 驱动；或每次键盘变化发生超过一次布局读取，超出停靠栏那一次 INV11 所述的读取 |
| INV12               | 源码边界检查，加上在受节流的手机配置下、针对 10 层每层 50 个兄弟节点的树以及单帧内两次变化的真实浏览器测试                                                                                                                                                                                                                                                                                                                                                                                                                    | 逐帧的高度或布局、遍历越过该区域或进入 `display: contents` 之外的子树、某个元素在一帧内被移动两次、新增元素不是某次交换的那一份瞬态副本、交换结束后该副本仍残留、导出上报函数、滑动把子元素移出该带，或对部件会滑动的元素做移动裁剪，均失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| INV13               | 源码边界检查，加上对包含多个触摸组件的页面做包体分析，以及在受节流的手机配置下、精细指针下和混合设备上的真实浏览器测试                                                                                                                                                                                                                                                                                                                                                                                                        | 同一页面上出现触摸模块的第二份副本、组件打包了模块原语自己的副本、其目标为这些模块之一的 `import()`（`Item` 为其已弃用的 swipe 属性发布的加载器除外）、被 `Item` 或 `ListItem` 导入的 swipe 模块（手势核心、动画器、面板渲染、行的手势代码）、`Item` 中除其弃用路径之外的 swipe 代码（该加载器、已发布的行的样式、角色门禁、`commit` 警告、桥接、点击防护、事件转发器以及共存诊断），或其任何部分出现在弃用路径之外、这些模块的公开导出或文档条目、公共 API 中的 install 调用或 installed 检查、不使用任何手势的组件中出现手势监听器、或在一次按压之外出现空闲的文档监听器（那一个共享按压控制器和那一个杂散点击吞噬器除外）、在 Core 与 Lab 之外导入 `@astryxdesign/core/internal/*`、识别器家族之外的类、对识别器做 `instanceof` 检查、内部工厂使用与公开工厂相同的名称，或对公共层已覆盖的职责直接导入模块，均失败                                                              |
| INV15               | 动画器值模式的单元测试，及其采用方的真实浏览器验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 取值偏离其各通道的时序（程序启动的变化用主题的 token，仅在 `spec:AST-094` FR45 保留的情况下才用弹簧）、计数超过组件的交换尺寸、在减少动态效果下无论使用粗指针还是精细指针仍出现计数或交叉淡化、播报中间值，或公开导出，均失败                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| INV16               | 审查每个处理 Core 在共享 hook 或工具中拥有的关注点的 Core 组件                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 某个 Core 组件为该关注点保留自己的 effect、监听器或追踪器即失败，无论它是否也调用了该 hook 或工具                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| INV16（插槽存在性） | 在 Core 与 RichText 上运行 `no-nullish-jsx-guard` 严格 lint 且不设基线，在 Core 上运行 `no-truthy-jsx-guard` 严格 lint 且不设基线；两者只捕获内联守卫，因此审查还要检查是否存在被提升到变量、被转换（`!!value`、`Boolean(value)`）、通过提前返回或 `??` 默认值实现，或经由 prop 展开传入的存在性判断（这些 lint 会放过）；空插槽测试传入 `''`、`false`、`true` 和 `null` 并与省略插槽做对比，另以 `0` 作为内容，覆盖 Item、MetadataList、ChatSystemMessage、TreeList、TopNavMegaMenu、RichTextEditor 和 RichTextEditorToolbar | 给插槽传入 `''`、`true` 或 `false` 后绘制出省略插槽时不会绘制的包裹、轨道、边框或分隔线、元素丢失其在无该插槽时拥有的名称、`0` 不渲染，或出现新的裸 nullish 或 truthiness 存在性判断（内联或提升）、出现超出基线的 truthiness 守卫、新增基线条目，或落地一份手写的该检查副本                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV17               | 审查渲染期间可达的每一处 `ref.current` 赋值，加上 ref 会供给后续行为的 StrictMode 双次渲染测试。`pnpm review:pre` 的 item j 会标记新增的渲染期 ref 写入（惰性初始化与本记录点名的例外除外），测试位于 `scripts/lib/pre-review-findings.test.mjs`；`useTableSortable` 的配置 ref 作为本不变式点名的缺口获得豁免，直到所有者做出决定                                                                                                                                                                                            | 在组件或 hook 主体中、惰性一次性初始化或 INV17 点名的例外之外写入 `ref.current`，或例外之外的行为读取了被 React 丢弃的渲染所写入的值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| INV18               | 审查每一处新增的强制布局读取：`getBoundingClientRect`、`getClientRects`、`offset*`、`client*`、`scroll*`（`scrollTop`、`scrollHeight` 等）、`inner*` 与 `outer*`、`visualViewport` 几何，以及 `getComputedStyle`（证据缺口：目前尚无自动发现手段）                                                                                                                                                                                                                                                                            | 在逐帧、滚动或尺寸变化的路径中出现当前条款并未要求在那里的布局读取、读取与写入交错、未附带说明原因的注释的读取、每次变化超过一次测量而超出当前条款所要求的那个“前后”成对测量，或在 CSS 定位已足够时改用 JavaScript 测量                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| INV18 重排          | 浏览器测试：在可重排 List 中拖动鼠标，同时用滚轮滚动其滚动容器：一个测试检查预览、放置线与放置结果，另一个追踪布局并统计偏移读取次数                                                                                                                                                                                                                                                                                                                                                                                          | 拖动中途的滚轮滚动让放置线或预览偏离指针、放置位置偏离指针、读取强制触发一次布局，或在已滚动的帧中读取超过一次                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| INV18（布局之后）   | 针对 `observeResizeAfterLayout` 的 `sharedResizeObserver.test.ts` 用例，以及在受钳制标题上打开 Lightbox 图库并统计其布局次数的 Chromium trace 测试                                                                                                                                                                                                                                                                                                                                                                            | 在注册时的调用中进行首次读取、在布局后浏览器自身的首次通知之前进行首次读取，或标题的首次读取强制触发一次布局                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| INV19               | 对 Core 组件文件夹的大小检查：每个超过 300 行或 3 KB gzip 的非测试行为模块都要指明其共享引擎，或由其记录说明为何没有合适的共享引擎                                                                                                                                                                                                                                                                                                                                                                                            | 某个私有行为模块超过阈值，却没有共享引擎，也没有记录的原因                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
