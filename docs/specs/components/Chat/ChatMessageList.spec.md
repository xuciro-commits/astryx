---
schema_version: 3
template_version: 7
kind: component
id: component:ChatMessageList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers:
  [public-api, behavior, layout, scrolling, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatMessageList.test.tsx,
    packages/core/src/Chat/ChatMessage.test.tsx,
    packages/core/src/Chat/ChatMessageBubble.test.tsx,
    packages/core/src/Chat/ChatLayout.test.tsx,
    packages/core/src/Chat/useChatNewMessages.test.tsx,
    packages/core/src/Chat/__tests__/ChatMessageList.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatMessageList.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-test-sufficiency,
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:react-component-runtime,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029]
---

# ChatMessageList component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                       |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `children`、`emptyState`、`scrollToTopAction`、`density`、`gap`、`align`、`isStreaming`、根元素的 `BaseProps<HTMLDivElement>` 以及 `ref`。 |
| 行为          | 一个礼貌日志承载调用方的消息。密度选择行间距并透传到 context。顶部哨兵可以请求更早的消息。默认情况下，短列表停在块末尾。                   |
| 终端用户影响  | 读者获得一个可聚焦、礼貌的对白日志，在响应流式输出时会进行报告；滚动到顶部时会加载更早的消息。                                             |
| 构建者影响    | 无。                                                                                                                                       |
| 兼容性/就绪度 | 记录已发布的行为；没有公共变更。一处实现缺口列在 Current-state impact 下；两个所有者问题仍未解决。                                         |
| 审查检查      | 驳回以下主张：该列表拥有 ChatLayout 的自动滚动、本记录确定了加载重叠策略，或 DOM 的 `aria-busy` 能证明语音输出。                           |
| 支配规则      | `architecture:public-component-api/INV1, INV5–INV8`；`architecture:react-component-runtime/INV3, INV5–INV6`；`spec:AST-029/FR2–FR5`。      |

本表是审查投影；下文正文具有权威性。

## Intent

ChatMessageList 是 Chat 组合中的表现型消息容器。它拥有一个 flex 列的对白记录、间距/密度 context、可选的空状态与更早消息哨兵，以及该日志渲染出的 ARIA 属性。`ChatLayout` 拥有自动跟随滚动与停靠区；消息与气泡组件拥有发送者呈现与内容。

使用方的 prop 语法与示例仍见 `ChatMessageList.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；没有公共变更
- 受控/非受控行为：不适用；本组件上没有受控值。
- 迁移决策：无。

## Current-state impact

- **底部对齐使用了一个额外元素。** `align="bottom"` 会在消息之前渲染一个 flex 间隔元素，把短列表向下推。当列表溢出时，被压缩的间隔元素仍会在第一条消息上方留下一行的空隙。没有消息时，间隔元素占据空闲空间的上半部分，因此空状态位于大约四分之三处，而不是居中。`architecture:component-style-authoring` INV7 要求通过组件已经拥有的元素上的样式来表达布局，而不是新增元素。

## Ownership boundary

**Owns**

- 外层日志元素及其公共的 DOM/ref/style 透传，以及带有 `density` 选择器的 `chat-message-list` 目标。
- 内层 flex 列消息盒，以及基于密度的内边距与间距。
- 短列表停留的位置：`bottom` 停在块末尾，`top` 停在块开头。
- 可选的 `emptyState` 替换以及更早消息哨兵/加载指示器。
- 存在布局时，把内层内容元素传给 `ChatLayoutContext.contentRef`。

**Does not own / non-goals**

- 自动滚动、滚动到底部、停靠区以及滚动所有者选择，这些属于 `component:ChatLayout` 及其滚动 hook。
- 发送者身份、消息对齐、气泡、元数据以及文本语义，这些属于其子组件。
- 调用方的区域地标，或针对任意对白上下文的可访问名称；本记录不制定命名策略。

## Public concepts

| 概念                | 封闭取值或状态                             | 含义                                     | 可用时机 | 默认值     | 所有者 | 稳定性 | 无效值行为                             |
| ------------------- | ------------------------------------------ | ---------------------------------------- | -------- | ---------- | ------ | ------ | -------------------------------------- |
| `children`          | `ReactNode`                                | 顶层的对白内容                           | 每次渲染 | 必填       | 调用方 | 稳定   | null、false 或 `[]` 在顶层计为空       |
| `emptyState`        | `ReactNode`；省略                          | 替代顶层为空的 children                  | 空状态   | 省略       | 调用方 | 稳定   | 缺省时不渲染替代内容                   |
| `scrollToTopAction` | 异步函数；省略                             | 当顶部哨兵相交时调用                     | 提供时   | 省略       | 调用方 | 稳定   | 缺省时不创建哨兵或观察器               |
| `density`           | `compact`；`balanced`；`spacious`          | 选择消息间距与子级密度 context           | 每次渲染 | `balanced` | 组件   | 稳定   | 封闭的类型联合                         |
| `gap`               | 已发布的 `SpacingStep`；省略               | 独立于密度地覆盖列表顶层的行间距         | 每次渲染 | 省略       | 调用方 | 稳定   | 封闭的类型联合                         |
| `align`             | `top`；`bottom`                            | 把短内容定位在开头或块末尾               | 每次渲染 | `bottom`   | 组件   | 稳定   | 封闭的类型联合                         |
| `isStreaming`       | `true`；`false`                            | 流式输出期间在礼貌日志上暴露 `aria-busy` | 每次渲染 | `false`    | 调用方 | 稳定   | 布尔值                                 |
| 根元素透传          | `ref`、被接受的 DOM/data/ARIA 与样式 props | 扩展外层日志元素                         | 每次渲染 | 省略       | 调用方 | 稳定   | 组件自有的 role/live/busy 属性保持优先 |

该表记录的是实现中的顶层空值判定；它不承诺递归检查子级，也不解决任意非渲染 React 节点的含义问题。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                              | 依据                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| FR1 | 外层根元素渲染 `role="log"`、`aria-live="polite"` 和 `tabIndex=0`；`isStreaming=true` 会添加 `aria-busy="true"`，否则该属性不存在。                                                                                                 | 当前源代码、测试与文档                          |
| FR2 | 所选密度以 `data-density` 反映在根元素上，并通过 `ChatListContext` 流向子消息；它选择三组间距。                                                                                                                                     | 当前源代码、测试与文档                          |
| FR3 | 可选的 `gap` 只替换顶层的行间距；密度仍选择内边距与 context。                                                                                                                                                                       | 当前源代码、测试与文档                          |
| FR4 | 仅当 `children` 为 nullish、`false` 或空的顶层数组时，才渲染 `emptyState`。否则传入的 children 原样渲染。                                                                                                                           | 当前源代码与测试                                |
| FR5 | 使用 `align="bottom"` 时，短列表停在块末尾；使用 `align="top"` 时，它停在块开头。溢出的内容走同一条渲染路径。实现缺口：底部定位使用了一个新增的间隔元素，当列表溢出时它还会在第一条消息上方留下一行的空隙（Current-state impact）。 | 当前源代码与测试                                |
| FR6 | 提供 `scrollToTopAction` 会创建一个被观察的顶部哨兵。发生相交时启动其异步转换，待处理期间渲染一个位于顶部的加载指示器。                                                                                                             | 当前源代码、测试与文档                          |
| FR7 | 在 ChatLayout 内部，内层内容元素会传给该布局的 `contentRef`，并在清理时从该注册中移除；独立列表没有布局 ref。                                                                                                                       | 当前源代码                                      |
| FR8 | 根元素接收 `ref`、被接受的 DOM/data/ARIA props，以及组合后的 `className`、`style` 和 `xstyle`；组件自有的日志语义在透传 props 之后应用。                                                                                            | 当前源代码；`architecture:public-component-api` |

对于 `emptyState` 槽位，数字 `0` 是可见内容。Nullish 值、布尔值和空字符串不会创建空包装。这仅描述标量输出；它不决定如何检查嵌套的 children。

### Allowed variation

- **AV1 - 内容。** 任何由调用方拥有的 ReactNode 都可以放入列表；列表不会从 children 推断发送者元数据。
- **AV2 - 间距。** 密度选择基于 token 的默认值；可选的 `gap` 选择一个已发布的间距步长，而不改变子级密度。
- **AV3 - 滚动所有权。** 列表可以单独使用，也可以在 ChatLayout 内使用；自动跟随行为仍在本组件之外。

### Representative states

| 状态                   | 必需的不变式                                                                                    | 允许的变化               |
| ---------------------- | ----------------------------------------------------------------------------------------------- | ------------------------ |
| 两条消息和一行系统消息 | 礼貌日志，消息按来源顺序                                                                        | 调用方控制行内容         |
| 顶层 children 为空     | 可选空状态在 `top` 下于整个列表中居中；在 `bottom` 下于间隔元素下方居中（Current-state impact） | 省略空状态则留下空日志   |
| 紧凑/均衡/宽松         | 基于 token 推导的不同行间距与子级密度                                                           | `gap` 只能覆盖行间距     |
| 短列表（top/bottom）   | bottom 停在块末尾，top 停在块开头                                                               | 容器高度由调用方拥有     |
| 流式输出               | 日志带有 `aria-busy=true`                                                                       | 消息内容仍归调用方所有   |
| 顶部操作待处理         | 转换待处理期间内容上方显示加载指示器                                                            | 异步操作结果由调用方拥有 |

### Performance and resources

- **PR1 — 哨兵观察器。** 仅当 `scrollToTopAction` 存在时才安装 `IntersectionObserver`，并在清理时断开。其 root 在可用时是 ChatLayout 的滚动容器，否则是文档视口。
- **PR2 — 布局注册。** 内层内容元素会向 ChatLayout 注册，清理时清除该注册。

## Accessibility contract

- **AR1 — 日志语义。** 根元素是一个可聚焦的礼貌日志，其 `aria-busy` 反映 `isStreaming`（FR1）；这里陈述的是浏览器暴露的语义，而不是屏幕阅读器的播报转写。
- **AR2 — 无键盘模型。** 加载指示器是日志的独立子元素。列表自身不添加任何交互式按钮或方向键行为。
- **AR3 — 调用方内容。** 调用方提供的内容仍负责消息内部的名称与语义。

## Design relationships

未记录组件本地的设计决策。间距使用可移植的语义 token 步长。family 使用方文档拥有已发布的 `chat-message-list` 主题目标及其 `density` 轴。尚未记录 anatomy-theming 映射；迁移期间该块是可选的，因此该映射暂缓。

## Family and system relationships

- 当前不存在 `family:chat` 权威记录。`Chat.doc.mjs` 是使用方 family 文档，而非产品权威的 family 契约。
- `ChatLayout` 拥有滚动容器并提供 `contentRef`；列表注册其内容元素，但不接管 ChatLayout 的滚动。
- `spec:AST-029` 拥有审计证据清单，本记录的验证映射遵循该清单。

## Verification map

| 契约     | 验证                                                                                                                                                           | 代表状态               | 变更或失败预期                            | 审计小节                   |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- | ----------------------------------------- | -------------------------- |
| FR1, AR1 | `ChatMessageList.test.tsx` 的 role 与 `aria-busy` 测试；`ChatMessageList.a11y.chromium.spec.ts` 的 `aria-live` 断言                                            | 静止、流式输出         | 丢失日志 role 或忙碌状态会失败。          | `audit:ChatMessageList/§1` |
| FR2–FR3  | `ChatMessageList.test.tsx` 的密度与 gap 测试                                                                                                                   | 各密度；gap 覆盖       | 丢失密度反映，或 gap 改变了密度，会失败。 | `audit:ChatMessageList/§2` |
| FR2      | `ChatMessage.test.tsx` 的 “inherits list density and lets an explicit prop override it”；`ChatMessageBubble.test.tsx` 的列表密度用例                           | 列表中的子消息         | 密度不再传递到子消息会失败。              | `audit:ChatMessageList/§2` |
| FR7      | `ChatLayout.test.tsx` 的 “first-fill scroll positioning” 用例；`useChatNewMessages.test.tsx` 的 “works end-to-end with ChatLayout conditional ChatMessageList” | 列表位于 ChatLayout 内 | 列表不再注册其内容元素会失败。            | `audit:ChatMessageList/§7` |
| FR4      | `ChatMessageList.test.tsx` 的空状态测试                                                                                                                        | 空；数字空状态         | 缺少空状态，或丢失数字空状态，会失败。    | `audit:ChatMessageList/§4` |
| FR6      | `ChatMessageList.test.tsx` 的 “loads older messages through the top sentinel and exposes pending status”                                                       | 待处理、已完成         | 丢失操作或指示器卡住会失败。              | `audit:ChatMessageList/§6` |

以下内容从源代码读取，尚无针对性测试：

- FR1：日志上的 `tabIndex=0`。
- FR2：每种密度所选择的间距。
- FR3：`gap` 替换顶层的行间距。
- FR4：`null` 与 `false` 的 children 选择空状态。
- FR5：短列表停留的位置；间隔元素测试计数了 Current-state impact 缺口背后的新增元素。
- FR7：在清理时移除注册。
- FR8：根元素上的 `ref`、DOM、data 与 ARIA props、`className`、`style` 和 `xstyle`，以及组件自有日志语义优先于透传 props。
- PR1–PR2：观察器的 root，以及注册清理。

## Decision log

未记录组件本地的决策。

## Open questions

- **OQ1 - 在异步加载仍待处理时，重复的顶部哨兵相交的预期重叠策略是什么？**（`human-api`）当前源代码在相交时调用该操作；本记录不添加单次执行、初始加载或耗尽保证。
- **OQ2 - 空值判定是否应检查嵌套的非渲染 ReactNode 值？**（`human-api`）已发布的测试仅限顶层 `children` 值。不要把该测试重新解释为关于生成器、片段、promise children 或非渲染值数组的策略。

## Content boundary

本文件不重复使用方的 prop 表或示例、ChatLayout 的滚动行为，或跨组件的视觉策略。它链接到其所有者。
