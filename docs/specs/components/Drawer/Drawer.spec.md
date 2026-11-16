---
schema_version: 3
template_version: 7
kind: component
id: component:Drawer
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Drawer/Drawer.test.tsx,
    packages/core/src/Layer/useLayerDismissal.test.tsx,
    packages/core/src/Layer/layerDismissalFamilies.test.tsx,
    .github/scripts/modal-close-visibility.js,
    apps/storybook/rtl-audit/rtl-audit.mjs,
    scripts/check-knowledge.mjs,
    packages/core/src/__tests__/modalBackdrop.test.tsx,
    packages/core/src/__tests__/ModalBackdrop.a11y.browser.spec.ts,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:layer-runtime,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs: [spec:AST-027/DEC-3, spec:AST-094]
---

# Drawer component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约        | `@astryxdesign/core` 从包根和 `./Drawer` 子路径导出 `Drawer`、`DrawerProps`、`DrawerHeader` 和 `DrawerHeaderProps`（DEC-3）；`@astryxdesign/lab` 不导出它们。`DrawerProps` 继承 `BaseProps<HTMLDialogElement>`，单独声明 `ref`，要求 `isOpen`、`onOpenChange`、`label` 和 `children`，接受 `purpose`（`required`、`form` 或 `info`；默认 `info`）、可选的 `padding` 间距步长（FR16），以及可选的 `experimental` 对象（DEC-4），并且没有 `hasCloseButton`。稳定 API 准入与兼容性归 `architecture:public-component-api` 所有；`DrawerHeader` 记录在 `component:DrawerHeader`。 |
| 行为            | Drawer 自身的可见性由调用方控制，用于呈现一个相对视口、全高的逻辑侧边浮层。原生打开时的 `hasScrim` 选择 `showModal()` 或手动的 Popover API 宿主；打开期间改变它不受支持。共享的层关闭堆栈在整个渲染生命周期内管控 Escape 与平台关闭，而 `purpose` 与 Dialog 中一样，决定 Escape、平台关闭和遮罩点击是否请求关闭。Drawer 自身不渲染任何关闭控件。在两种呈现方式中，绘制顺序都由浏览器顶层负责；退场期间渲染当前 children；完成关闭后，焦点返回到打开时获得焦点的元素。                                                                                                        |
| 终端用户影响    | 抽屉自身不绘制任何关闭控件；关闭按钮出现在调用方所组合的 `DrawerHeader` 标题行中。`form` 抽屉忽略遮罩点击，`required` 抽屉忽略 Escape、平台关闭和遮罩点击；模态 `required` 抽屉会被播报为警告对话框。共享的最顶层/IME Escape 路由、顶层绘制顺序、每个请求只关闭一次以及焦点返回，在两种呈现方式中均适用。                                                                                                                                                                                                                                                                    |
| 构建者影响      | 从 `@astryxdesign/core/Drawer` 或 Core 包根导入。若要可见的关闭操作，在 `Layout` 的 header 插槽中组合 `<DrawerHeader title onOpenChange>`，如同在 Dialog 中组合 `DialogHeader`。内容区默认按 `--spacing-4` 内缩；`padding={0}` 得到通栏的内容区。在 Dialog 会设置 `purpose` 的地方设置 `purpose`。状态与内容仍归调用方所有；Drawer 在退场期间渲染调用方当前的 children。兄弟组合是当前的使用方指引，而调用方 `onKeyDown` 阻止默认行为会取消 Escape 关闭。                                                                                                                    |
| 兼容性/就绪状态 | 记录已交付的行为；无公开变更。Drawer 是从 `@astryxdesign/core/Drawer` 导入的 Core 组件（DEC-3）。五处实现缺口列在 Current-state impact 之下。                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 审查检查项      | 拒绝区域化、停靠式或块轴模型；声称模态性与遮罩当前相互独立的说法；重新引入 Drawer 本地的 Escape 注册表、页面级 z-index 层级带或 Drawer 自有的关闭按钮；与 Dialog 的 `purpose` 不一致的关闭策略；声称混合呈现或嵌套堆叠在共享堆栈契约之外仍有保证；仍然存在的 `@astryxdesign/lab` 导出；或声称具备 `architecture:public-component-api` 尚未准入的稳定 API/主题兼容性。                                                                                                                                                                                                        |
| 管辖规则        | `family:overlay-dismissal`；`architecture:layer-runtime`；`architecture:container-padding`；`spec:AST-027/DEC-3`；`design:reduced-motion`。                                                                                                                                                                                                                                                                                                                                                                                                                                  |

本表是审查用的投影；以下正文具有权威性。

## Intent

Drawer 在一个全高的侧边面板中呈现上下文相关的细节或控件，该面板浮在当前页面之上而不使其重排。它支持带遮罩的模态查看，以及让背后页面保持可用的非模态主从查看。

本条记录覆盖仅面向视口的 Core 组件：其共享层生命周期、与 Dialog 对齐的关闭控件与关闭策略（DEC-1），以及其容器内边距（DEC-2）。它不引入任何作用域概念。特别是，它不复活区域化、以窗格为作用域或以容器为目标的 Drawer 模型。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`。
- 兼容性类别：记录已交付的行为；无公开变更。Core 从包根和 `./Drawer` 子路径导出 Drawer；`@astryxdesign/lab` 不导出。
- 容器内边距（FR16，DEC-2）：`padding` prop 或主题在 `drawer` 上的 `padding` 通过容器 token 使内容区内缩。两者都未设置时，内缩量为 `--spacing-4`，与 Dialog 一致；`padding={0}` 保持通栏的内容区。块末端安全区内缩在所有模式下都适用。
- 实验性表面（DEC-4）：全视口的移动端覆盖是可选 `experimental` prop 对象中的 `isFullWidthOnMobile` 选项，它不在稳定兼容性承诺之内（`spec:AST-017/FR21`）。省略 `experimental` 会保留 56px 的页面露出。
- 受控/非受控行为：对 Drawer 自有的路径不变；调用方提供 `isOpen`，而通过公开 dialog ref 直接进行原生变更不在该保证之内。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **Drawer 构建自己的顶层、退场与背景。** Drawer 挂载自己的模态宿主与 popover 宿主，运行自己的退场保持，并绘制自己的遮罩。`architecture:layer-runtime` INV14 要求层使用运行时的顶层挂载、呈现保持、退场副本和背景着色。
- **减弱动效在每个指针上都保留 0.01 秒的滑动。** 在减弱动效下，滑动与遮罩过渡仍会运行 0.01 秒。对精细指针，`design:reduced-motion` DR1 禁止该位移，DR3 允许不做任何动画属性；而触摸用户得不到 DR2 所要求的透明度淡变。
- **只有在主指针为粗粒度时，入场期间手指才会被拦住。** 在那里，抽屉仍在入场时落下的点按或拖拽不会到达任何内容，而非模态抽屉周围只有面板上的一个会被拦住。当主指针为精细且屏幕同时接受触摸时（触摸屏笔记本），入场期间手指对遮罩的点按会关闭 `info` 抽屉，而点按或拖拽也能到达面板。`spec:AST-094` FR35 要求把指针输入保持住，直到入场结束。
- **使用方的 `onCancel` 从不会运行。** Drawer 在调用方 props 之后设置自己的 `onCancel`，因此调用方的 `onCancel` 会被丢弃。`architecture:public-component-api` INV5 要求已接受的事件输入能够到达元素。
- **容器内边距记录没有列出 Drawer。** Drawer 的内容区会发布其内缩量（FR16，DEC-2），但 `architecture:container-padding` 并未在容器发布者中列出 Drawer。

## Ownership boundary

**拥有**

- 相对视口的侧边面板表面、逻辑边、内联尺寸预算，以及入场/退场动效。
- 模态遮罩的外观（FR20）。
- 当前呈现输入：其在原生打开时的取值选择 `showModal()` 或手动 Popover API 宿主。打开期间改变它不受支持。
- Drawer 本地的焦点进入/返回、`purpose` 关闭策略、未被取消的背景点击处理，以及在受控退场期间保持其宿主并渲染调用方当前拥有的 children。
- 内容区的容器内边距，按 `architecture:container-padding` 发布；根 dialog 仍是浮层边界的拥有者。
- 在其渲染生命周期内将层注册到共享关闭堆栈。Escape 与平台关闭的路由归共享拥有者；两种呈现方式中的绘制顺序归浏览器顶层。

**不拥有 / 非目标**

- 调用方提供的表单、查看器、页脚或其他内容。`DrawerHeader` 是可选的组合，而非必需的解剖结构。
- 块轴 sheet —— 归 `component:BottomSheet` 所有。
- 占用布局空间或推动页面内容的常驻面板。
- 区域化或以窗格为作用域的放置、调用方提供的容器，或独立的模态性与遮罩轴。这些都不是当前 Drawer 的概念。
- 跨族的 Escape 与平台关闭排序 —— 归 `family:overlay-dismissal` 所有；Drawer 通过共享拥有者参与。
- `DrawerHeader`、其标题行、关闭操作以及 target —— 归 `component:DrawerHeader` 所有。

## Public concepts

使用方的 prop 语法与示例保留在 `Drawer.doc.mjs` 中。

| 概念           | 封闭取值或状态                               | 含义                                                                                                           | 按状态可用性                         | 默认值                            | 拥有者                   | 稳定性                     | 无效值行为                   |
| -------------- | -------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------- | ------------------------ | -------------------------- | ---------------------------- |
| 可见性         | open、closed                                 | 是否请求由调用方控制的 Drawer 呈现                                                                             | 所有呈现方式                         | 调用方控制                        | `component:Drawer`       | Core 契约                  | 必需的受控取值               |
| 逻辑边         | 内联起始、内联结束                           | 面板进出所依托的视口边缘                                                                                       | 打开与退场中                         | 内联结束                          | `component:Drawer`       | Core 契约                  | 封闭类型拒绝其他取值         |
| 呈现方式       | 带遮罩的模态、无遮罩的非模态                 | 原生宿主模式及相关文档语义                                                                                     | 在原生宿主打开时选定；不支持实时变更 | 带遮罩的模态                      | `component:Drawer`       | Core 契约                  | 当前的一个布尔值选定初始模式 |
| 内联尺寸预算   | 像素数值或有效的 CSS 长度                    | 桌面内联尺寸与露出模式的移动端上限                                                                             | 桌面与移动端页面露出模式             | `400px`                           | `component:Drawer`       | Core 契约                  | 无效的 CSS 长度不受支持      |
| 移动端覆盖     | 页面露出、全视口                             | 窄视口是否保留一条可见的页面条带                                                                               | 处于或低于移动端边界的视口           | 56px 页面露出                     | `component:Drawer`       | 实验性（DEC-4）            | 封闭布尔值                   |
| 关闭目的       | info、form、required                         | 哪些隐式请求会关闭：`info` 允许 Escape、平台关闭和遮罩点击；`form` 允许 Escape 和平台关闭；`required` 都不允许 | 所有呈现方式；遮罩点击仅适用于模态   | info                              | `component:Drawer`       | 与 Dialog 一致的 Core 契约 | 封闭类型拒绝其他取值         |
| 标题栏关闭操作 | 已渲染、缺失                                 | `DrawerHeader` 是否渲染其关闭按钮                                                                              | 在组合 `DrawerHeader` 的任何位置     | 除非传入 `onOpenChange`，否则缺失 | `component:DrawerHeader` | Core 契约                  | 省略回调则不渲染按钮         |
| 内容内缩       | 间距步长、主题 `drawer` 的 padding，或默认值 | 滚动内容区的容器内边距，按 `architecture:container-padding` 向子孙发布                                         | 所有呈现方式                         | `--spacing-4`，与 Dialog 一致     | `component:Drawer`       | 与 Dialog 一致的 Core 契约 | 封闭数值类型拒绝其他取值     |
| 兄弟顺序       | 较早打开、较晚打开、退场中、已关闭           | 共享堆栈的 Escape 资格与浏览器顶层的绘制顺序                                                                   | 任一呈现方式下的兄弟 Drawer          | 较晚打开的位于最顶层              | `component:Drawer`       | Core 契约                  | 嵌套组合不在已记录的契约之内 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 依据                                                                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| FR1  | Drawer 必须保持为一个相对视口、全块尺寸的浮层，位于逻辑内联起始边或内联结束边，且不得占用布局空间或使其下方页面重排。                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码、文档、stories 与测试                                       |
| FR2  | 为已打开 Drawer 选定的逻辑边必须在整个退场期间保持锁定，即使调用方状态在关闭过程中改变了实时的 edge prop。                                                                                                                                                                                                                                                                                                                                                                                                    | 当前退场侧测试与实现                                                 |
| FR3  | 桌面内联尺寸预算必须接受像素数值或 CSS 长度，并保持在视口范围内。在 640px 及以下，页面露出模式必须保留 56px 并将 `width` 作为上限；全移动模式必须用 `100dvw` 覆盖 `width`。                                                                                                                                                                                                                                                                                                                                   | 当前文档、样式与宽度测试                                             |
| FR4  | 经由 Drawer 自身行为的可见性必须遵循 `isOpen`，从 hydration 之后的渲染开始（FR17）。由共享堆栈路由的未取消 Escape，以及未取消的模态背景激活，在 `purpose` 允许时（FR15）且该按压未关闭抽屉之上的任何层时（FR6）请求 `false`；`DrawerHeader` 的关闭操作通过其收到的回调请求 `false`；Drawer 阻止其已处理的 native `cancel` 事件直接关闭 dialog。在受控退场期间，Drawer 保持其宿主与内容区挂载，同时渲染调用方当前的 `children`。                                                                               | 当前 prop 契约与生命周期测试                                         |
| FR5  | 在打开时，`hasScrim={true}` 必须选择原生 `showModal()`，具备 `aria-modal`、焦点陷阱、页面滚动锁定和可见的背景；在锁定状态下，下拉刷新与页面回弹都会停止，因为模态之下的滚动锁会固定页面（`spec:AST-094` FR19），如同 UIKit 模态呈现背后那样；`hasScrim={false}` 必须选择手动 Popover API 宿主，使背后页面保持可交互。打开期间改变 `hasScrim` 不是受支持的原生模式切换。                                                                                                                                       | 当前源码、文档与初始模式测试                                         |
| FR6  | 在模态背景上开始并结束于该处的未取消按压（在实时 `hasScrim` 为真时，pointer-down、pointer-up 和 click 的 `target === currentTarget`；`family:overlay-dismissal` FR10），在 `purpose` 为 `info` 时必须请求关闭，除非该按压以轻触关闭了抽屉之上已打开的层从而被其消费（`family:overlay-dismissal` FR11）；对 `form` 或 `required` 则不得请求关闭；以任一方向越过抽屉边缘的按压不得请求关闭。实时 `hasScrim` 为假时，子孙点击与 dialog 根点击不得请求关闭，且非模态呈现不得安装不可见的外部指针关闭平面。        | 当前点击测试；`useBackdropPress.test.tsx`                            |
| FR7  | Drawer 不得渲染自己的关闭控件。可见的关闭操作由调用方组合，通常是带 `onOpenChange` 的 `DrawerHeader`（`component:DrawerHeader` FR3），它通过该回调请求 `false`，而不取得打开状态的所有权。                                                                                                                                                                                                                                                                                                                    | DEC-1；关闭控件套件                                                  |
| FR8  | 打开时必须呈现原生宿主，捕获打开前获得焦点的元素，并尝试把焦点移到第一个已渲染的 `[data-autofocus]` 子孙（若存在）。在完成的受控关闭释放原生宿主之后，Drawer 必须尝试把焦点恢复到所捕获的元素。非模态宿主的合成 `close` 事件必须在该恢复尝试之后派发 —— 与任务排队的原生 `dialog.close()` 事件一致 —— 使使用方的 close 监听器对最终焦点保有最后发言权。当已打开的 Drawer 卸载时，若焦点否则会丢失（留在页面 body 上或留在已离开文档的节点上），它必须把焦点返回给所捕获的元素；仅开发环境的模拟卸载不算移除。 | 当前存在性 hook 与焦点测试                                           |
| FR9  | 关闭时必须在退场仍可见期间保留面板宿主、内容区、边和原生呈现，并继续渲染调用方当前的 `children`。transform 过渡是权威，基于计算时长的兜底可防止丢失的事件使宿主滞留，原生释放与 React 隐藏同时发生，从而没有任何一帧绘制在顶层之外。                                                                                                                                                                                                                                                                          | 当前生命周期测试与浏览器关闭可见性防护                               |
| FR10 | 兄弟 Drawer 必须按兄弟组合。最后打开且仍存在的兄弟通过共享堆栈拥有首个 Escape 请求；正在关闭的兄弟在其可见退场期间保留该所有权，重新打开则注册新的活跃周期，使一个请求绝不会关闭两个表面。两种呈现方式中的绘制顺序都遵循浏览器顶层的时间顺序。                                                                                                                                                                                                                                                                | 当前文档、共享堆栈与测试                                             |
| FR11 | `DrawerProps` 继承 `BaseProps<HTMLDialogElement>` 并单独声明 `ref`。根节点过滤 `open`，合并 `xstyle`、`className` 和 `style`，转发其余未被认领的 props，组合使用方的 `onClick`，把使用方 `onKeyDown` 转发在共享的文档级 Escape 拥有者之前，并拥有 `aria-label`、`aria-modal`，以及对于模态 `required` 抽屉的 `role="alertdialog"`。实现缺口：使用方的 `onCancel` 会被丢弃（见 Current-state impact）。阻止默认行为的使用方 `onKeyDown` 会取消该次按压的共享堆栈 Escape 关闭。                                 | 当前源码与专项键盘测试                                               |
| FR12 | 被绘制的根 dialog 发出已记录的 `drawer` target 和 `side` 选择器轴，并应用容器内边距重置。`DrawerHeader` 的 target 归 `component:DrawerHeader` FR5 所有。目前不为内容或遮罩发出独立的 Drawer target；未来的 target 资格仍归 `architecture:component-theming-surface` 所有。                                                                                                                                                                                                                                    | 当前源码、文档与结构化 target 元数据                                 |
| FR13 | Drawer 必须在其整个渲染生命周期内加入共享关闭堆栈，为子孙层提供逻辑深度，通过同样的最顶层/IME 判定路由平台关闭，并保留使用方 `preventDefault()` 的所有权。                                                                                                                                                                                                                                                                                                                                                    | 共享族契约与专项测试                                                 |
| FR14 | 非模态 Drawer 必须使用手动 Popover API 宿主，使跨表面顺序来自浏览器顶层而非页面级 z-index 层级带。降级回退仅在 Popover API 支持下限之下才可使用 `dialog.show()`。                                                                                                                                                                                                                                                                                                                                             | 当前源码、浏览器防护与 `spec:AST-027`                                |
| FR15 | `purpose` 取与 Dialog 的同名 prop 相同的值和默认值。`info`（默认）允许 Escape、平台关闭和模态遮罩点击请求关闭；`form` 允许 Escape 和平台关闭请求关闭，并忽略遮罩点击；`required` 不允许任何请求关闭，以 `block` 向共享堆栈注册，使该请求不会到达更低的层，并把模态抽屉暴露为 `role="alertdialog"`。无遮罩时，`form` 与 `info` 行为相同。                                                                                                                                                                      | DEC-1；purpose 套件；`family:overlay-dismissal` Escape 行为          |
| FR16 | 内容区按抽屉的容器内缩量为调用方内容添加内边距，默认与 Dialog 一致为 `--spacing-4`，并像容器发布者那样把生效的内缩量发布给子孙；`architecture:container-padding` 尚未把 Drawer 准入为其一（见 Current-state impact）。其块末端边应用容器内缩量加 home 指示器安全区，而只发布内缩量，因此 bleed 子元素只减去内缩量，安全区在其下方得以保留。根 dialog 保留容器内边距重置（FR12）。                                                                                                                             | `architecture:container-padding`；容器内边距套件                     |
| FR17 | 在服务端处于打开状态的 Drawer 在 hydration 之前渲染为关闭（没有打开样式、没有 `aria-modal`，即关闭 Drawer 的标记），并在 hydration 之后的渲染中打开，那是第一个可以进入其原生宿主的渲染；它从不声称自己没有的模态性（`spec:AST-020` FR1，WCAG 2.2 SC 4.1.2）。服务端渲染与 hydration 渲染产生相同的标记（`spec:AST-013` FR9），hydration 之后的打开是稳定落定的，没有入场动效；之后的打开与关闭照常动画（`spec:AST-013` FR13）。                                                                              | `spec:AST-020` FR1                                                   |
| FR18 | 模态 Drawer（`hasScrim`）打开期间，它把其 `<dialog>` 作为被动全局出口提供，因此 toast 之类的应用全局表面在其内部渲染、绘制在其上方，并保持可操作、可通过键盘到达；当它开始关闭时停止提供，于是它们回到原位，不会被随退场带走。移动它们会保留 toast 条目、定时器和焦点交接（`spec:AST-003` FR18、FR19）。非模态 Drawer 不提供出口（`architecture:layer-runtime`）。                                                                                                                                            | `spec:AST-003` FR18                                                  |
| FR19 | 当非模态 Drawer（`hasScrim={false}`）通过 `showPopover()` 进入顶层时，在其之前显示在顶层中的 toast 视口会原位离开并重新进入顶层，同时把焦点保持在其内部，因此 toast 绘制在抽屉上方；抽屉不提供出口，其关闭不会移动也不会重新进入任何东西（`architecture:layer-runtime`）。                                                                                                                                                                                                                                    | `architecture:layer-runtime`                                         |
| FR20 | Drawer 的遮罩是主题的 `--color-overlay` 变暗效果，不加模糊，在每个指针上都如此；在强制颜色下，抽屉保留可见的边。                                                                                                                                                                                                                                                                                                                                                                                              | 拥有者决策，2026-10-25：浮层在每个指针上都保持由主题控制且不加模糊。 |

### Allowed variation

- **AV1 — 调用方内容。** 任何可渲染的查看器/详情内容都可占据滚动内容区，而不成为 Drawer 拥有的解剖结构。Drawer 渲染当前的 `children`；调用方决定底层数据在退场期间是否保持可用。
- **AV2 — 内联尺寸。** 使用方可在有效的 CSS 与视口约束内选择桌面预算。它在移动端页面露出模式下仍是上限，而全移动模式改用 `100dvw`。
- **AV3 — 呈现方式。** 在原生打开时的取值选择模态 dialog 或非模态 popover 宿主。打开期间改变 `hasScrim` 不受支持。
- **AV4 — 关闭控件。** 调用方选择是否渲染关闭操作，通常是带 `onOpenChange` 的 `DrawerHeader`，或他们自己的控件。
- **AV6 — 关闭目的。** 调用方选择 `info`、`form` 或 `required`。
- **AV5 — 动效时长。** 主题可以改变 transform 过渡时长；关闭时序遵循计算出的 CSS 与减弱动效偏好。

### Representative states

| 状态               | 必需的不变式                                                                                           | 允许的变化                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------- |
| 已关闭             | 无原生呈现或可见面板                                                                                   | 调用方内容可以保持挂载在 React 中                              |
| 模态查看器         | 以 `hasScrim` 为真通过 `showModal()` 打开，带遮罩、模态语义、焦点陷阱和 body 锁定                      | 边、宽度、调用方内容、autofocus 目标、标题栏关闭操作与关闭目的 |
| 非模态主从查看器   | 以 `hasScrim` 为假通过手动 popover 宿主打开；无遮罩、无 `aria-modal`、无 body 锁定；背后页面保持可交互 | 边、宽度、调用方内容、标题栏关闭操作与关闭目的                 |
| required 模态抽屉  | Escape、平台关闭和遮罩点击都不会关闭；暴露为 `alertdialog`；更低的层不会收到该 Escape                  | 调用方提供的退出方式                                           |
| 带页面露出的窄视口 | 面板不超过其 `width` 上限并保留 56px 的页面                                                            | 所请求的宽度低于上限                                           |
| 窄的全覆盖视口     | 面板使用 `100dvw`，覆盖所请求的 `width`                                                                | 调用方内容                                                     |
| 两个兄弟 Drawer    | 较晚打开的打开 Drawer 通过浏览器顶层绘制在上方，并通过共享堆栈拥有首个 Escape 请求                     | 边、宽度、调用方内容，以及以兄弟组合的任一呈现方式             |
| 退场中的 Drawer    | 在退场可见期间保留面板宿主、内容区、逻辑边、原生呈现和堆栈注册；渲染当前 children                      | 调用方控制的子数据与动效时长                                   |

### Transformation and precedence order

- **ORD0 — 内容内缩。** 先是 `padding` prop，然后是主题在 `drawer` 上的 `padding` 属性，最后是 `--spacing-4`，与 Dialog 一致。块末端安全区内缩在该解析之后于所有模式下加入。
- **ORD1 — 打开。** 解析当前的逻辑边与宽度，保留已渲染的面板，捕获当前获得焦点的元素，用当前的 `hasScrim` 选择原生宿主，然后遵循已渲染的 autofocus 目标。
- **ORD2 — 关闭。** 在受控关闭期间，Drawer 让面板与调用方提供的内容在退场动画全程保持可见。过渡完成或基于计算时长的兜底会一并释放原生宿主并隐藏 React 输出，因此呈现结束时没有中间可见帧；随后 Drawer 在可用时尝试把焦点恢复到先前获得焦点的元素。非模态宿主的合成 `close` 事件仅在该恢复尝试之后派发，因此重定向焦点的使用方 close 监听器会观察到与任务排队的原生事件相同的最后发言顺序。
- **ORD3 — 兄弟顺序。** 兄弟顺序来自共享关闭堆栈与浏览器顶层：最后打开且仍存在的兄弟位于最前，并在两种呈现方式中首先处理 Escape。子孙浮层仍由其自身的组件契约与族契约管辖，而非由 Drawer 的嵌套决定。

### Performance and resources

- **PR1 — 仅退场时存在的资源。** 过渡监听器与兜底计时器仅在关闭等待可见 transform 退场时存在，并在完成、中断或卸载时移除。
- **PR2 — 呈现清理。** 原生呈现与任何生效的 body 滚动锁定仅在其活跃状态期间存在，并在受控关闭、卸载或隐藏 Activity 清理时释放。
- **PR3 — 相对视口的尺寸计算。** Drawer 从 `width`、实验性的 `experimental.isFullWidthOnMobile` 选项（DEC-4）和视口推导尺寸；调用方不提供区域化的测量目标。

## Accessibility contract

- **AR1 — 名称。** `label` 是必需的字符串，转发给 `aria-label`；调用方内容不会被用作隐式名称。当前代码不会拒绝空值或仅含空白字符的值。
- **AR2 — 模态真实性。** 在打开时，`hasScrim={true}` 使用原生模态 dialog 状态与 `aria-modal`；`hasScrim={false}` 使用非模态 popover 宿主并省略 `aria-modal`。模态 `required` 抽屉使用 `role="alertdialog"`。打开期间改变 `hasScrim` 不是受支持的切换。
- **AR3 — 键盘关闭。** Escape 仅通过共享堆栈为最顶层的已注册层请求关闭，且仅在 `purpose` 允许时；`required` 抽屉会消费它。阻止默认行为的使用方 `onKeyDown` 会取消该关闭，无关按键不会关闭。
- **AR4 — 焦点生命周期。** 焦点通过已记录的 autofocus/原生路径进入可见的 Drawer 内容；在完成的受控关闭之后，Drawer 尝试把焦点恢复到 Drawer 打开时活跃的元素。
- **AR5 — 关闭可供性。** Drawer 不提供自己的关闭控件；`DrawerHeader` 关闭操作的名称与行为归 `component:DrawerHeader` 所有。
- **AR6 — 方向与动效。** 逻辑内缩放置与滑动方向的镜像遵循来自最近生效 `dir` 属性的 DOM 方向性，包括显式的本地覆盖或继承的方向。按 `design:bidirectionality` 的要求，方向与其祖先不同的区域要在 DOM `dir` 中描述该方向；仅用 CSS 的 `direction` 声明不是受支持的替代方案。在减弱动效下，入场与退场在粗粒度指针上是 200 ms 或更短的纯透明度淡变（`design:reduced-motion` DR2），除此之外则是立即完成（DR3），除减弱动效缺口（见 Current-state impact）外不改变最终状态。

## Design relationships

| 解剖结构或状态 | 设计要求                                                                 | 表述权威                 | 层级角色 | 组件契约            |
| -------------- | ------------------------------------------------------------------------ | ------------------------ | -------- | ------------------- |
| 面板           | 绘制全高的侧边表面，并拥有边、宽度、边框、阴影和动效。                   | 当前源码与公开文档       | 突出     | FR1–FR3、FR9、FR12  |
| 内容区         | 为调用方拥有的查看器内容提供全高滚动和容器内缩。                         | 当前源码与公开文档       | 突出     | FR4、FR16、AV1      |
| 标题栏         | `DrawerHeader` 提供标题行，并在获得 `onOpenChange` 时提供关闭操作。      | `component:DrawerHeader` | 支撑     | FR7、AR5            |
| 模态遮罩       | 在初始模态打开时，传达由遮罩支撑的呈现方式，并在面板背后提供根点击激活。 | 当前源码与公开文档       | 支撑     | FR5、FR6、FR20、AR2 |
| 页面露出       | 在窄视口上保留浮层上下文，除非请求全覆盖。                               | 当前公开文档             | 支撑     | FR3                 |

根 Panel 承载当前的 `drawer` 目标并反映 `side`；`DrawerHeader` 的目标由 `component:DrawerHeader` 拥有。Content 区域或 Modal 遮罩没有可达的独立 Drawer 目标，未来目标的资格认定也不在本记录中决定。目前尚未记录 anatomy 主题映射；该块在迁移期间是可选的，因此该映射被推迟。

## Family and system relationships

- `family:overlay-dismissal` 负责跨组件的 Escape 与平台关闭排序。Drawer 在其渲染生命周期内通过该共享所有者参与，并为后代层提供逻辑深度。
- `architecture:layer-runtime` 负责区分原生模态宿主、非模态 dialog 呈现、顶层行为与共享层管道。Drawer 的内容根应用共享的私有文本基线与层内容边界，与 Dialog 一致：以 surface 为作用域的祖先成员关系在 drawer 处终止，而普通应用上下文仍然流向其内容。
- `architecture:public-component-api` 负责稳定 API 的准入与兼容性。FR11 记录当前的 DOM/ref/事件可达性，但不做出稳定的兼容性决策。
- `architecture:react-component-runtime` 负责 effect/资源清理、原生宿主同步以及节点/生命周期安全。本记录涵盖 Drawer 自有的可见关闭与焦点交接结果。
- `architecture:component-theming-surface` 负责目标资格认定与未来 anatomy 映射；本记录仅涵盖现有的 `drawer` 目标。
- `architecture:container-padding` 负责共享的容器内边距协议。它尚未将 Drawer 的 Content 区域接纳为容器发布者（FR16）。
- `spec:AST-027/DEC-3` 要求等效的浮动交互使用适用的原生顶层宿主。模态 `showModal()` 与非模态手动 Popover 宿主满足该跨 surface 路径；已记录的降级回退仍位于 Popover API 支持下限之下。

## Verification map

| 契约            | 验证                                                                                                                                                           | 代表性状态                                                                                                   | 变异或失败预期                                                                                                                                                                    | 审计小节                     |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1–FR7         | `Drawer.test.tsx` 的 render、initial-mode、click、sizing、side 与控制相关测试套件                                                                              | 关闭/打开、两侧边缘、初始模态与非模态模式、移动端宽度                                                        | 布局重排；某个初始模式获得了错误的语义；未取消的根点击或全移动端尺寸变得不确定。                                                                                                  | `audit:Drawer/behavior`      |
| FR11            | Drawer 源码与针对性的键盘组合/取消测试                                                                                                                         | 过滤后的 `open`、合并的 styling/ref、转发的未认领 prop、自有的 ARIA/cancel、组合的 click、转发的 keydown     | 当前转发在未经审查的情况下改变，或共享栈 Escape 忽略已记录的 consumer 取消。                                                                                                      | `audit:Drawer/public-api`    |
| FR8, AR1–AR5    | `Drawer.test.tsx` 的 label 转发、autofocus、关闭与焦点返回套件，以及浏览器守卫的最终焦点检查                                                                   | 初始模态/非模态模式、autofocus 目标、已连接且先前获得焦点的元素、关闭监听器重新指定焦点                      | 焦点在呈现之前移动，已完成的受控关闭未能恢复焦点，合成关闭覆盖 consumer 监听器的焦点目标，或 label 转发/关闭命名被破坏。                                                          | `audit:Drawer/accessibility` |
| FR8 (unmount)   | `Drawer.test.tsx` 的 “Drawer unmounting while open” 套件；`DrawerUnmountFocus.a11y.chromium.spec.ts`（点击与 Enter）                                           | 仅在打开时渲染并由其自身控件移除的非模态与模态 drawer；随其视图一起移除；焦点先移到外部；StrictMode 重新挂载 | 打开的 drawer 卸载后焦点留在页面 body 上，焦点从用户移动到的位置被拉回，或移动焦点的 StrictMode 重新挂载失败。                                                                    | `audit:Drawer/accessibility` |
| FR9, PR1–PR2    | 关闭时序测试、浏览器关闭可见性守卫，以及 presence hook 源码检查                                                                                                | 受控关闭、transform 结束、无关的过渡、丢失事件的兜底                                                         | 原生呈现先于可见退出结束，宿主被困住，清理路径保留资源，或中间帧在原生呈现之外绘制。                                                                                              | `audit:Drawer/motion`        |
| FR10, FR13, AR3 | Drawer 共享栈套件以及 `useLayerDismissal` 与 family 测试                                                                                                       | 同级项、关闭顶层、重新打开、卸载、嵌套后代                                                                   | 一次 Escape 关闭两个 surface，正在关闭的宿主放弃所有权，或重新打开的同级项保留过期的顺序。                                                                                        | `audit:Drawer/layers`        |
| FR14            | Drawer 源码以及 `spec:AST-027` 影响清单与原生宿主浏览器守卫                                                                                                    | 模态宿主、手动 popover 宿主、降级回退                                                                        | 非模态呈现退回页面级 band 或丢失原生宿主排序。                                                                                                                                    | `audit:Drawer/layers`        |
| FR15            | `Drawer.test.tsx` 的 purpose 套件                                                                                                                              | `info`、`form`、`required`；模态与非模态；位于 `required` drawer 后方的同级项                                | `form` drawer 在遮罩点击时关闭，`required` drawer 关闭或让 Escape 触达其后方 drawer，或其 role 语义漂移。                                                                         | `audit:Drawer/behavior`      |
| FR12            | 源码、`Drawer.doc.mjs` 与当前目标发现                                                                                                                          | start/end 根 Panel 与继承的容器上下文                                                                        | 当前根目标/轴或内边距重置发生改变，或该记录声称存在不可达的子目标，或对未来的准入做出决定。                                                                                       | `audit:Drawer/theming`       |
| FR16            | `Drawer.test.tsx` 的容器内边距套件；`defineTheme.test.ts` 的 drawer 映射；浏览器证据                                                                           | 默认值、`padding` prop、主题 `padding`、单独的带内边距 Section 子项、Layout 组合                             | 发布的内边距与应用的 padding 不同，默认 drawer 改变几何形状，或块结束安全区域丢失或被重复扣除。                                                                                   | `audit:Drawer/theming`       |
| AR6             | `DrawerDirection.test.tsx` 的 DOM 方向与关闭/进入一致性套件，以及精确 head 的 Storybook RTL 证据                                                               | start/end；自行应用、继承与嵌套的相反 `dir`；关闭与打开时的 transform                                        | 任何实际生效的 DOM 方向或本地覆盖使 panel 从与其逻辑位置不同的边缘进入，或关闭与打开时的 transform 不一致。                                                                       | `audit:Drawer/accessibility` |
| FR17            | `Drawer.ssr.test.tsx`                                                                                                                                          | 在服务端打开；水合；已关闭 Drawer 的标记                                                                     | 打开状态的服务器渲染带有 `aria-modal`、开启样式，或标记不同于已关闭状态，出现水合错误，水合后没有 `showModal()`，水合后立即打开时没有进入动画，或后续打开时没有进入动画，均失败。 | `audit:Drawer/accessibility` |
| FR18            | `ToastViewport.modalHost.test.tsx` 的 “ToastViewport above a Drawer” 套件；`DrawerToastOutlet.a11y.chromium.spec.ts`（桌面与手机宽度下的命中测试、点击与 Tab） | 在页面 toast 之上打开的模态 drawer；从 drawer 内部抬升的 toast；drawer 关闭中；没有遮罩的 drawer             | toast 视口被留在打开的模态 drawer 之外，toast 随正在关闭的 drawer 被带出，toast 行被重新挂载，或非模态 drawer 却占用了视口，均失败。                                              | `audit:Drawer/accessibility` |
| FR19            | `ToastViewport.modalHost.test.tsx` 的 “ToastViewport above a Drawer” 非模态用例；`DrawerToastOutlet.a11y.chromium.spec.ts` 的非模态用例                        | 在无遮罩 drawer 于其角落上方打开之前显示的 toast；该 drawer 关闭                                             | 无遮罩 drawer 覆盖了 toast，视口被移入该 drawer，或关闭时发生重新进入，均失败。                                                                                                   | `audit:Drawer/accessibility` |
| FR20            | `modalBackdrop.test.tsx`；Chromium 与 WebKit 中的 `ModalBackdrop.a11y.browser.spec.ts`                                                                         | 手机宽度下的手指；桌面宽度下的鼠标；任一指针下的强制颜色模式                                                 | 任一宽度下遮罩上出现 `backdrop-filter`，或强制颜色模式下没有可见边缘，均失败。                                                                                                    | `audit:Drawer/theming`       |

从源码读取，尚无针对性测试：

- FR1：不预留布局空间、不重排页面。
- FR5：模态 drawer 的页面滚动锁定。
- FR9：计算时长的兜底。
- FR13：后代层的逻辑深度，以及平台关闭路由。
- FR14：Popover API 支持下限之下的 `dialog.show()` 回退。
- PR1–PR2：监听器、定时器、呈现与滚动锁定的清理。

## Decision log

- **DEC-1 — 关闭控件与关闭策略与 Dialog 一致**（负责人决定，2026-10-01）。Drawer 不渲染内置关闭按钮，也没有 `hasCloseButton`；它采用 Dialog 的 `purpose` 值及默认值；并且 `DrawerHeader` 具有 `DialogHeader` 的 API，仅在传入 `onOpenChange` 时渲染关闭操作。采用 Drawer 自有的 header，而不是 `DialogHeader`，可以保留 Drawer 的焦点进入（原生呈现之后的 `data-autofocus`）与 `label` 命名，并避免 `dialog-header` 主题目标。已否决：仅在 `required` 时隐藏的内置按钮；复用 `DialogHeader`。

- **DEC-2 — Drawer 与 Dialog 一样是容器**（负责人决定，2026-10-08）。可滚动的 Content 区域是遵循 Dialog 契约的容器发布者：`padding` prop 使用 Dialog 的间距步级刻度，`drawer` 上的主题 `padding` 展开为 `--astryx-drawer-padding*` 容器令牌，边缘与 Layout 内边距链共享 `--spacing-4` 默认值。`DrawerHeader` 位于 `Layout` 的 header 槽中，Layout 将内边距重新分配到其各区域，因此 header 不会被内缩两次。块结束边缘在每种模式下都在内边距之上加上 home-indicator 安全区域。已否决：给 panel 根加内边距（那是 overlay 边界）；默认全出血（与 Dialog 不一致）。

- **DEC-3 — Drawer 是 Core 组件**（负责人决定，2026-10-08）。`Drawer`、`DrawerHeader` 及其 prop 类型从 `@astryxdesign/core/Drawer` 与 Core 根导出，其文档站演示为 Core 块。`@astryxdesign/lab` 不导出它们。

- **DEC-4 — 全视口移动端覆盖是实验性的**（负责人决定，2026-10-15）。`isFullWidthOnMobile` 位于可选的 `experimental` prop 对象内，在声明中标记为 `@experimental`，在撰写文档中标记为 `stability: 'experimental'`，因此它可能在补丁版本中变更或被移除（`spec:AST-017/FR21`）。省略 `experimental` 会保留 56px 的页面露出。已否决：顶层的稳定 `isFullWidthOnMobile` prop。

## Open questions

- `DrawerHeader` 是否应提供默认焦点目标，并通过 `aria-labelledby` 命名 Drawer，就像 `DialogHeader` 为 Dialog 所做的那样？目前 `label` 是必需的，且焦点进入使用 `data-autofocus`。
- 显式的 `padding` prop 是否应继续叠加块结束安全区域（DEC-2），还是采用 Dialog 的全屏规则，即显式值完全替代安全区域回退？
- `DrawerHeader` 的 `endContentEdgeCompensation` 轴值如何映射到 `endContentEdge` 的处理值，已记录在 `component:DrawerHeader` 的未决问题中。

区域化放置、独立的模态/遮罩轴以及块轴 sheet 都在当前组件边界之外。任何未来针对它们的提议都需要新的公共 API 与设计权威。

## Content boundary

本文件不重复 consumer prop 表或示例、共享的关闭栈内部实现、过渡算法、当前审计评分、实现步骤或共享的 family/系统规则。它链接到它们的所有者。
