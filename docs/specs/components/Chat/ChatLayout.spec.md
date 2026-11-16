---
schema_version: 3
template_version: 7
kind: component
id: component:ChatLayout
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers:
  [public-api, behavior, layout, scrolling, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatLayout.test.tsx,
    packages/core/src/Chat/ChatLayoutScrollButton.test.tsx,
    packages/core/src/Chat/useChatStreamScroll.test.tsx,
    packages/core/src/Chat/useChatNewMessages.test.tsx,
    apps/storybook/stories/ChatLayout.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:theme-tokens,
    architecture:react-component-runtime,
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-025, spec:AST-029]
---

# ChatLayout component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                   |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `children`、`composer`、`emptyState`、`scrollButton`、`scrollRef`、`density`，以及在布局根节点上的 `BaseProps<HTMLDivElement>` 与 `ref`。                                              |
| 行为          | 根节点是 flex 列；消息区增长且永不收缩；当根节点滚动时停靠区为 sticky，当 `scrollRef` 指定外层滚动器时为 fixed。                                                                       |
| 最终用户影响  | 聊天对话记录在始终可达的输入区下方滚动，自动跟随流式输出，并在读者已离开底部时提供滚动到底部的可供性。                                                                                 |
| 构建者影响    | 无。                                                                                                                                                                                   |
| 兼容性/就绪度 | 记录已交付的行为；无公开变更。两个所有者问题仍处于开放状态。                                                                                                                           |
| 审查检查      | 拒绝任何陈述未交付行为的行、承诺本组件并不应用的默认值的行，或在没有所有者决策的情况下解决 OQ1 或 OQ2 的行。                                                                           |
| 治理规则      | `architecture:public-component-api/INV1, INV5–INV6, INV8`；`architecture:component-style-authoring/INV1–INV3, INV5`；`architecture:theme-tokens/INV3`；`spec:AST-025/FR12`（未采用）。 |

此表是审查用的投影；下面的正文才是权威。

## Intent

ChatLayout 是聊天界面的结构外壳。它只负责一件事：把可滚动的对话记录放在停靠的输入区上方，使短对话不溢出、长对话可滚动，并让输入区始终停留在真正滚动的那个元素的底边。滚动机制位于 `useChatStreamScroll` 与 `useChatNewMessages` 中；本组件把它们接到自己拥有的 DOM 上，并通过 `ChatLayoutContext` 发布由此得到的各 ref。

使用方用法、prop 语法与示例属于 `ChatLayout.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已交付的行为；无公开变更
- 受控/非受控行为：不适用；本组件不持有可受控的值。
- 迁移决策：无。

## Ownership boundary

**拥有**

- 布局根节点：flex 列、相对定位、`container-type: inline-size`，以及带 `density` 轴的 `chat-layout` 主题目标。
- 哪个元素滚动：根节点自身，或 `scrollRef` 指定的元素。
- 停靠区定位——自滚动模式下为 `sticky`，外部滚动模式下为 `fixed`——以及绘制在其后面的毛玻璃层。
- 密度几何：停靠区内边距、消息列最大宽度与行内内边距，以及模糊层的高度与遮罩。
- 空状态替换及其居中盒。
- 默认的滚动到底部可供性，以及它接收的可见性信号。
- 通过 `ChatLayoutContext` 发布 `scrollContainerRef` 与 `contentRef`。

**不拥有 / 非目标**

- 滚动测量、弹簧动画、锁定行为或新消息检测——由 `useChatStreamScroll` 与 `useChatNewMessages` 拥有。
- 在跟随时关闭浏览器的滚动锚定——由 `useChatStreamScroll` 拥有，它只通过 Core 的滚动锚定所有者模块（`privateAttributes/scrollAnchoring.stylex.ts`）写入，该模块是这条规则的唯一所有者（`architecture:public-component-api` INV23）。
- 消息呈现、分组或发送者语义——由 `component:ChatMessageList` 与 `component:ChatMessage` 拥有。
- 输入区行为、尺寸或状态——由 `component:ChatComposer` 拥有。
- 滚动到底部控件自身的呈现——由 `component:ChatLayoutScrollButton` 拥有。
- 页面外壳、导航与地标分配——属于调用方。
- 由 `spec:AST-025` 定义的共享有效轴滚动能力。本组件早于它出现，且尚未采用它；见 OQ1。

## Public concepts

| 概念           | 封闭取值或状态                                           | 含义                                                                      | 默认值      | 所有者       | 稳定性 | 无效值行为                         |
| -------------- | -------------------------------------------------------- | ------------------------------------------------------------------------- | ----------- | ------------ | ------ | ---------------------------------- |
| `children`     | 任意 `ReactNode`                                         | 放置在消息区中的对话记录内容。                                            | 必需        | 调用方       | 稳定   | 不适用——必需                       |
| `composer`     | 任意 `ReactNode`                                         | 放置在停靠区内的内容。                                                    | 必需        | 调用方       | 稳定   | 不适用——必需                       |
| `emptyState`   | `ReactNode`；省略                                        | 当 `children` 为空时，居中渲染以替代 `children`。                         | 省略        | 调用方       | 稳定   | 省略时原样渲染 `children`          |
| `scrollButton` | `undefined`；`null`；任意 `ReactNode`                    | `undefined` 选择已接线的默认值，`null` 不渲染任何内容，节点则替换默认值。 | `undefined` | 组件/调用方  | 稳定   | 任何节点都按给定内容渲染           |
| `scrollRef`    | `RefObject<HTMLElement \| null>`；省略                   | 指定滚动的元素；省略则让根节点滚动。                                      | 省略        | 调用方       | 稳定   | `current` 为 null 时滚动保持不活跃 |
| `density`      | `compact`；`balanced`；`spacious`                        | 选择停靠区内边距、消息列宽度与模糊层尺寸。                                | `balanced`  | 组件         | 稳定   | 封闭联合类型；由类型系统拒绝       |
| 根节点表面     | `ref`；DOM/data/ARIA props；`className`/`style`/`xstyle` | 扩展布局根节点。                                                          | 省略        | 公开组件 API | 稳定   | 不适用                             |

`density` 是封闭联合类型。它是 `chat-layout` 目标的已记录 `visualProps` 轴，且不可由主题扩展：任何不可用的自定义值都没有安全的、与主题无关的基线，因此在 `architecture:component-theming-surface/INV14` 下保持封闭。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                        | 依据                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| FR1 | 根节点必须是 flex 列，这样处于文档流中的 sticky 停靠区的高度就算作根节点高度的一部分，而不是叠加在它上面。                                                    | 当前源码与测试                                      |
| FR2 | 消息区必须增长以占据剩余空间，且不得收缩到低于其内容高度，这样短的对话记录正好填满根节点，长的则溢出根节点。                                                  | 当前源码与测试                                      |
| FR3 | 没有 `scrollRef` 时，根节点必须是滚动容器，且停靠区必须是 `position: sticky`。                                                                                | 当前源码与测试                                      |
| FR4 | 有 `scrollRef` 时，根节点不得成为滚动容器，且停靠区必须是 `position: fixed`。消息区的末端内边距必须容纳停靠区的高度，这样在滚动到底时最新消息停在停靠区上方。 | 当前源码与测试                                      |
| FR5 | `emptyState` 必须恰好在 `children` 为 `null`、`undefined`、`false` 或空数组时替换 `children`，且不得替换其他任何 children。                                   | 当前源码与测试                                      |
| FR6 | `scrollButton` 必须区分三种情况：省略时选择已接线的默认值，`null` 不渲染任何内容，提供节点时该节点替换默认值。                                                | 当前源码与测试                                      |
| FR7 | `density` 必须作为 `chat-layout` 目标的 `data-density` 反映到根节点上，并且必须一起选择停靠区、消息区、停靠区内层与模糊层的几何。                             | 当前源码、测试与文档                                |
| FR8 | 布局必须通过 `ChatLayoutContext` 发布其滚动容器与消息内容 ref，使消息列表能够注册被观察的内容盒。                                                             | 当前源码                                            |
| FR9 | 被接受的 `ref`、DOM/data/ARIA props、`className`、`style` 与 `xstyle` 必须到达布局根节点并在其上组合。                                                        | `architecture:public-component-api/INV5–INV6, INV8` |

### Allowed variation

- **AV1 — 滚动归属。** 调用方在根节点拥有的滚动与外部拥有的滚动之间选择；停靠区的定位策略随该选择而定。
- **AV2 — 滚动可供性。** 调用方可保留已接线的默认值、将其移除，或替换为任意节点。
- **AV3 — 对话记录内容。** 消息区允许任意内容；ChatMessageList 是一种约定，而非要求。
- **AV4 — 密度几何。** 解析得到的间距与宽度遵循活动主题的间距比例；只有三个档位之间的关系是固定的。

### Representative states

| 状态                          | 必需的不变式                                                         | 允许的变化                 |
| ----------------------------- | -------------------------------------------------------------------- | -------------------------- |
| 自滚动，短对话记录            | 根节点填满而不溢出；停靠区在块末处 sticky                            | 空状态可占据消息区         |
| 自滚动，对话记录溢出          | 根节点滚动；消息区保持内容高度                                       | 滚动可供性变为可见         |
| 外部 `scrollRef`              | 根节点不滚动；停靠区固定在视口的块末处；滚动到底时最新消息停在其上方 | 所指定的元素可以是文档元素 |
| 空 children 配合 `emptyState` | 居中的空状态替代对话记录                                             | 任意节点都可以作为空状态   |
| `scrollButton={null}`         | 不渲染任何滚动可供性                                                 | 自动滚动行为不变           |

### Performance and resources

- **PR1 — 组件内不做布局测量。** 密度是 prop。对于 CSS 容器/flex 模型已经解析的呈现，ChatLayout 不得自行添加 `ResizeObserver`、媒体查询或动画帧（`architecture:component-style-authoring/INV2`）。固定停靠区脱离文档流，因此 flex 布局无法为其高度预留空间。该高度通过 PR2 的池化观察器到达消息区。它的首次调用不携带尺寸，因此挂载时会读取一次停靠区的高度。
- **PR2 — 仅共享观察。** 内容尺寸观察通过 `useChatNewMessages` 所用的池化 `observeResize` 工具到达浏览器，绝不使用按实例的观察器。

## Accessibility contract

- **AR1 — 已接线的默认滚动可供性在视觉隐藏时不得可聚焦。** 隐藏的胶囊不绘制任何内容，因此焦点落在其上时不会有可见指示（WCAG 2.2 SC 2.4.7，AA 级）。`opacity` 与 `pointer-events` 不会把元素从顺序焦点导航中移除。
- **AR2 — 滚动可供性在可见时必须保持键盘可达且可操作**，其无障碍名称由目录提供，并在有新消息到达时替换为新消息标签。
- **AR3 — 所有用户可见及面向辅助技术（AT）的字符串必须来自目录**：`@astryx.chatLayout.newMessages` 与 `@astryx.chatLayoutScrollButton.scrollToBottom`。
- **AR4 — 布局不得为调用方的区域分配地标角色或无障碍名称。** 区域语义仍归调用方所有。
- 自滚动根节点自身不携带 `tabIndex`、角色或无障碍名称；进入滚动内容的键盘路径来自 `children` 所提供的任何内容。应由哪一层拥有该保证尚未确定；见 OQ1。

## Design relationships

- 停靠区绘制 `backdrop-filter` 模糊并带块起始方向的遮罩，使对话记录在输入区后面淡出，而不是在硬边缘处突然结束。模糊高度与遮罩距离随 `density` 分档变化。
- 滚动可供性是一个胶囊，其高度跟随 `--size-element-md`，也就是它包裹的 `md` Button 所用的同一 token，因此在重新调整元素尺度的主题下，胶囊的 `overflow: hidden` 不会裁剪该 Button（`architecture:theme-tokens/INV3`）。
- 间距、圆角、阴影、时长与缓动全部解析自可移植的语义 token。没有语义角色的组件局部几何——消息列与停靠区内层的上限、模糊高度，以及空状态最小高度——仍作为具名的组件设计决策。
- 本组件不声明任何可移植 token，也不声明任何公开自定义属性。

### Theming reachability

ChatLayout 五个解剖部件的处置。本记录不携带 `anatomy-theming:v1` 块；该块在迁移期间是可选的，另见 OQ2。

| 解剖部件       | 处置                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 消息区         | `none` — 可达性缺口：内部元素没有 `themeProps` 调用。`chat-layout` 位于滚动根节点上，因此主题无法触及对话记录列自身的内边距或宽度上限。 |
| 毛玻璃停靠区   | `none` — 未定：停靠区、其内层列与模糊层绘制标志性表面，且不携带目标；见 OQ2。                                                           |
| 滚动到底部按钮 | `delegatesTo` 目标 `chat-layout-scroll-button`，其在当前清单中的规范所有者是 `component:Chat`。                                         |
| 输入区         | `delegatesTo` 目标 `chat-composer`，其在当前清单中的规范所有者是 `component:Chat`。                                                     |
| 空状态         | `none` — 有意为之：空状态盒只负责居中调用方内容，这属于布局管道。                                                                       |

`chat-layout` 目标本身声明在 Chat 家族文档（`Chat.doc.mjs`）上，而不是在 `ChatLayout.doc.mjs` 上。

## Family and system relationships

- 没有 `family:chat` 记录。Chat 组件共享 `Chat.doc.mjs` 家族文档及其主题目标清单，这不是知识记录的家族契约。
- `component:ChatLayoutScrollButton` 拥有滚动可供性的呈现、标签与焦点行为。ChatLayout 只拥有它何时可见。
- `component:ChatMessageList` 使用 `ChatLayoutContext.contentRef`。
- `spec:AST-025` 拥有共享有效轴滚动能力。ChatLayout 目前未采用它：它在自滚动模式下无条件声明 `overflow-y: auto`，而不是解析有效轴，也不为视口本身分配键盘访问。FR12 接受已有的可聚焦后代作为键盘路径；关于尚未确定的归属问题见 OQ1。

## Verification map

| 契约     | 验证                                                                                                                                          | 代表性状态                                         | 变异或失败预期                                                                                | 审计章节              |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------- | --------------------- |
| FR1, FR2 | `ChatLayout.test.tsx` 自滚动布局契约                                                                                                          | 自滚动，短与长对话记录                             | 在消息区恢复 `min-height: 100%` 会重新叠加停靠区的高度，根节点便溢出                          | `audit:ChatLayout/§4` |
| FR3, FR4 | `ChatLayout.test.tsx` 停靠区定位以及为固定停靠区预留的空间                                                                                    | 无 `scrollRef`；外部 `scrollRef`；高度增长的输入区 | 对调 sticky 与 fixed 会使停靠区脱离真正滚动的元素；去掉预留空间会让最新消息落在固定停靠区之下 | `audit:ChatLayout/§4` |
| FR5      | `ChatLayout.test.tsx` 的空状态用例；`useChatNewMessages.test.tsx` 的条件列表用例                                                              | 空数组；有内容的 children                          | 把有内容的 children 当作空，会隐藏对话记录                                                    | `audit:ChatLayout/§4` |
| FR6      | `ChatLayout.test.tsx` 的滚动按钮用例                                                                                                          | 自定义节点                                         | 在提供节点时改为渲染默认值会失败                                                              | `audit:ChatLayout/§4` |
| FR7      | `ChatLayout.test.tsx` 的 density 用例；`themingTargets.test.ts`                                                                               | compact；balanced；spacious                        | 丢弃该反射属性会使主题轴无法选择                                                              | `audit:ChatLayout/§2` |
| FR8      | `ChatLayout.test.tsx` 的“首次填充滚动定位”用例；`useChatNewMessages.test.tsx` 的条件列表用例                                                  | 首次填充；流式增长                                 | 丢失已发布的 ref 会使自动滚动无法观察内容增长                                                 | `audit:ChatLayout/§7` |
| AR1, AR2 | `ChatLayoutScrollButton.test.tsx` 与 `ChatLayout.test.tsx` 的 tab 顺序用例；真实 Chromium 中的 `ChatLayoutScrollButton.a11y.chromium.spec.ts` | 静止时隐藏；可见；激活后重新隐藏                   | 退回仅用 `opacity` 隐藏，会把不可见的控件重新放回 tab 顺序                                    | `audit:ChatLayout/§1` |

从源码读取、尚无聚焦测试的部分：

- FR3、FR4：根节点是否为滚动容器。
- FR5：`null` 与 `undefined` children 选择空状态。
- FR6：`null` 不渲染任何内容、省略 `scrollButton` 选择已接线的默认值，以及提供节点时不渲染默认值。
- FR8：已发布的滚动容器。
- FR7：每个密度下停靠区、消息区、停靠区内层与模糊层的几何。
- FR9：根节点上的 `ref`、DOM props、`className`、`style` 与 `xstyle`。
- AR2：新消息标签替换目录名称。
- AR3：目录字符串；AR4：调用方区域上没有地标或名称。
- PR1–PR2：组件自身不做布局测量，以及池化观察器。

## Decision log

未记录任何组件局部决策。

## Open questions

- **OQ1 — 哪一层拥有通往滚动内容的键盘路径，ChatLayout 是否应保证它？**（`human-api`）在自滚动模式下，根节点是滚动容器，自身不携带 `tabIndex`、角色或无障碍名称。作为文档所述子组件的 `component:ChatMessageList` 携带 `role="log"` 与 `tabIndex={0}`，而 `spec:AST-025/FR12` 接受这样的已有可聚焦后代，而不是具名视口。`children` 的类型是 `ReactNode`，因此“不提供任何可聚焦后代的组合是否也被覆盖”尚未确定，应由哪一层拥有该保证同样未定。本记录陈述该安排，并不主张存在缺陷。
- **OQ2 — 毛玻璃停靠区是否应可主题化？**（`human-api`）停靠区、其内层列与模糊层绘制本组件的标志性表面，而当前没有任何目标能触及它们。

## Content boundary

本文件不重复 `ChatLayout.doc.mjs` 的 prop 表或示例、审计的评分与证据，也不重复由各自组件与 hook 拥有的滚动、消息与输入区契约。
