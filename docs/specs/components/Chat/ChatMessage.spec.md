---
schema_version: 3
template_version: 7
kind: component
id: component:ChatMessage
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatMessage.test.tsx,
    packages/core/src/Chat/ChatMessageBubble.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/ChatMessage.stories.tsx,
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
system_specs: [spec:AST-020, spec:AST-029]
---

# ChatMessage component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 消息 article 上的 `sender`、`children`、`avatar`、`name`、`metadata`、`density`，外加 `BaseProps<HTMLElement>` 与 `ref`。                          |
| 行为          | 发送方控制逻辑对齐与系统消息抑制；密度按显式 prop → 消息列表上下文 → `balanced` 的顺序解析；后代接收解析后的上下文。                               |
| 最终用户影响  | 阅读对话的人可以区分用户、助手与系统消息，同时名称与已翻译的回退标签保留每个 article 的发送方身份。                                                |
| 构建者影响    | 无。                                                                                                                                               |
| 兼容性/就绪度 | 记录已发布行为；无公开变更。无实现缺口；一个所有者问题仍未决。                                                                                     |
| 审查检查      | 拒绝这样的改动：改变 sender 或 density 的含义、把调用方内容当作组件所有，或把未决的主题化问题变成新 API。                                          |
| 约束规则      | `architecture:public-component-api/INV1, INV3, INV5–INV6, INV8–INV9`；`architecture:component-theming-surface/INV3–INV6`；`spec:AST-029/FR3–FR6`。 |

本表是审查投影；下方正文具有权威性。

## Intent

ChatMessage 是对话中单条消息的、感知发送方的 article 包装层。它拥有逻辑对齐、可选的发送方身份槽位、提供给消息后代的解析后密度上下文，以及该 article 的无障碍名称。消息内容与其自身的交互仍归调用方所有。

使用方语法与示例属于 `ChatMessage.doc.mjs` 和 Chat 家族文档。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布行为；无公开变更
- 受控/非受控行为：不适用；组件不拥有任何可控值。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个语义化 `<article>` 根元素及其公开 ref、DOM、data、ARIA、class 与 style 透传。
- 由 `sender` 选择的逻辑起点、终点或居中对齐。
- 非系统消息的可选头像、名称与元数据放置，包括折叠内容不渲染任何东西的槽位（DEC-1）。
- 密度解析，以及提供给后代的 `ChatMessageContext` 值。
- `chat-message` 目标及其 `sender` 与解析后的 `density` 轴。
- 该 article 的可见名称或已翻译回退的无障碍标签。

**不拥有 / 非目标**

- 气泡的呈现、分组、宽度、名称或元数据——当气泡提供它们时归 `component:ChatMessageBubble` 所有。
- 头像外观——归调用方提供的节点所有，通常是 `component:Avatar`。
- 元数据内容、时间戳格式化、状态或页脚操作——归所提供的节点及其组件所有。
- 消息列表顺序、消息间距、流式播报或滚动行为——归 `component:ChatMessageList` 与 `component:ChatLayout` 所有。
- `children` 内部的交互；后代保留各自的语义与无障碍契约。

## Public concepts

| 概念       | 封闭值或状态                                             | 含义                                                   | 按变体/方向/状态的可用性     | 默认值 | 所有者          | 稳定性 | 无效值行为                   |
| ---------- | -------------------------------------------------------- | ------------------------------------------------------ | ---------------------------- | ------ | --------------- | ------ | ---------------------------- |
| `sender`   | `assistant`; `user`; `system`                            | 选择逻辑对齐、article 身份，以及是否显示辅助身份槽位。 | 每条消息必填                 | 必填   | 组件            | 稳定   | 封闭联合类型；由类型系统拒绝 |
| `children` | 任意 `ReactNode`                                         | 在对齐后的内容列内部透传的消息正文。                   | 所有发送方                   | 必填   | 调用方          | 稳定   | 不适用——必填                 |
| `avatar`   | 渲染内容；不渲染任何内容；被跳过的标量；省略             | 非系统消息旁的可选身份节点。                           | 助手与用户；系统消息中被抑制 | 省略   | 调用方          | 稳定   | 不渲染任何内容：槽位折叠     |
| `name`     | 渲染文本；不渲染任何内容；被跳过的标量；省略             | 可选的可见发送方名称，以及 article 标签来源。          | 助手与用户；系统消息中被抑制 | 省略   | 调用方/组件     | 稳定   | 不渲染文本：回退标签         |
| `metadata` | 渲染内容；不渲染任何内容；被跳过的标量；省略             | 消息正文下方的可选内容。                               | 助手与用户；系统消息中被抑制 | 省略   | 调用方          | 稳定   | 不渲染任何内容：槽位折叠     |
| `density`  | `compact`; `balanced`; `spacious`; 省略                  | 选择间距，并成为后代消息的上下文。                     | 所有发送方                   | 继承   | 组件/列表上下文 | 稳定   | 封闭联合类型；由类型系统拒绝 |
| 根表面     | `ref`; DOM/data/ARIA props; `className`/`style`/`xstyle` | 扩展消息 article。                                     | 所有发送方                   | 省略   | 公开组件 API    | 稳定   | 不适用                       |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                         | 依据                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | `assistant` 必须对齐到行内起点，`user` 对齐到行内终点，`system` 居中；根元素必须在 `chat-message` 目标上反映发送方。                                                                                                                           | 已发布实现；使用方文档；聚焦测试                              |
| FR2 | `system` 必须抑制所提供的头像、名称与元数据，同时继续渲染 `children`。                                                                                                                                                                         | 已发布实现；Chat 家族剖析；聚焦测试                           |
| FR3 | 非系统消息必须按上述视觉顺序渲染所提供的头像、名称、children 与元数据。`null`、布尔值与空字符串辅助值不得创建包装元素；内容不渲染任何东西的包装元素必须折叠（DEC-1）。                                                                         | 所有者方向；聚焦测试                                          |
| FR4 | 密度必须按显式 `density` → 最近的 `ChatMessageList` 密度 → `balanced` 解析，且解析后的值必须反映在根目标上。                                                                                                                                   | 已发布实现；使用方文档；聚焦测试；主题化元数据                |
| FR5 | 后代必须通过 `ChatMessageContext` 接收解析后的 `{sender, density}` 值。                                                                                                                                                                        | 已发布实现；后代组合                                          |
| FR6 | article 必须把已翻译的发送方回退作为 `aria-label` 承载，非系统消息的 `name` 若未被跳过为标量，还必须通过 `aria-labelledby` 标注它。渲染文本的名称命名该 article；不渲染任何文本的名称则保留回退（accessible name computation 1.2，第 2B 步）。 | 所有者方向；accessible name computation 1.2；聚焦测试         |
| FR7 | 被接受的 `ref`、DOM/data/ARIA props、`className`、`style` 与 `xstyle` 必须到达并组合在承载 `chat-message` 目标的同一个 article 上，但 `aria-label` 与 `aria-labelledby` 除外，它们由组件为命名而拥有（FR6、AR1）。                             | `architecture:public-component-api/INV5–INV6, INV8`；聚焦测试 |

### Allowed variation

- **AV1 — 消息内容。** `children` 可以是气泡、富内容、工具输出、媒体或任何其他调用方拥有的 React 节点。
- **AV2 — 身份内容。** 头像、名称与元数据是原样传给 React 的调用方节点；包装层控制放置、系统抑制，以及内容不渲染任何东西的槽位的折叠。
- **AV3 — 密度几何。** 解析后的间距遵循当前主题的间距刻度；compact → balanced → spacious 的顺序固定不变。

### Representative states

| 状态                           | 必需的不变式                                   | 允许的变体                             |
| ------------------------------ | ---------------------------------------------- | -------------------------------------- |
| 带头像、名称与元数据的助手消息 | 行内起点布局；可见名称标注该 article           | 任何调用方拥有的节点都可以填充这些槽位 |
| 被跳过的标量辅助值             | 不创建槽位或命名引用                           | `null`、布尔值、空字符串               |
| 不渲染任何东西的辅助内容       | 槽位折叠；此类名称保留回退标签                 | 空数组或 Fragment、返回 `null` 的组件  |
| 数值型辅助值                   | `0` 仍然可见，数值型名称标注该 article         | 任何非系统发送方                       |
| 没有名称的用户消息             | 行内终点布局；已翻译的发送方回退标注该 article | 头像与元数据可以存在或省略             |
| 提供了辅助 props 的系统消息    | 居中布局；头像、名称与元数据保持抑制           | 任何 children 都继续渲染               |
| 独立消息                       | 解析后的密度为 `balanced`                      | 任何发送方与内容                       |
| 位于提供密度的列表中的消息     | 继承列表密度                                   | 任何发送方与内容                       |
| 列表中带显式密度的消息         | 显式密度优先                                   | 任何受支持的密度                       |
| 长内容位于窄容器中             | 根元素保持在容器内，内容仍然可用               | 后代内容自行选择换行策略               |
| RTL 容器                       | 用户/助手的逻辑对齐随文档方向镜像              | 系统消息仍然居中                       |

### Transformation and precedence order

- **ORD1 — 密度。** 先解析消息的显式 prop，然后是最接近的消息列表上下文，最后是 `balanced`；用这一个结果处理布局、目标反映与后代上下文。
- **ORD2 — 无障碍名称。** 系统消息的 `name` 或被跳过的标量不会创建名称包装元素。否则 article 引用名称包装元素生成的 id；其中渲染的文本命名该 article，而空文本让位于作为 `aria-label` 承载的已翻译回退。调用方的 `aria-label` 或 `aria-labelledby` 不会覆盖这一命名。

### Performance and resources

- **PR1 — 无外部资源。** ChatMessage 不安装任何监听器、定时器、观察器、请求或 Effect。
- **PR2 — 稳定广播。** 后代上下文值仅在解析后的发送方或密度变化时改变。

## Accessibility contract

- **AR1 — Article 命名机制。** 每个 article 都以已翻译的发送方回退作为 `aria-label`。名称包装元素存在时通过 `aria-labelledby` 引用；其渲染的文本命名该 article，当它不渲染文本时，无障碍名称回退到 `aria-label`。
- **AR2 — 不检查。** 绝不为了判断槽位内容是否渲染而检查、克隆或执行它；折叠与命名回退都遵循渲染后的 DOM。
- **AR3 — 后代所有权。** ChatMessage 是非交互的，不引入键盘模型。交互式后代仍负责自己的角色、名称、状态、焦点与激活。

## Design relationships

| 剖析或状态 | 设计要求                                                                       | 表示权威 | 层级角色 | 组件契约 |
| ---------- | ------------------------------------------------------------------------------ | -------- | -------- | -------- |
| 助手       | 将消息列对齐到逻辑起点                                                         | 当前源码 | 内容     | FR1      |
| 用户       | 将消息列对齐到逻辑终点                                                         | 当前源码 | 内容     | FR1      |
| 系统       | 内容列居中并抑制身份槽位                                                       | 当前源码 | 辅助     | FR1–FR2  |
| 名称       | `none`——未决：内置名称在未被目标化的后代上绘制显式辅助字号与次要颜色；见 OQ1。 | 当前源码 | 辅助     | FR3      |
| 密度       | 沿三段轴增大根与子级间距                                                       | 当前源码 | 结构     | FR4      |

未记录任何组件本地的设计决策。

### Theming reachability

| 剖析部件 | 处置                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------- |
| 消息根   | `target`——`chat-message` 目标位于 article 上，并反映 `sender` 与解析后的 `density`；Chat 家族文档拥有其使用方元数据。 |
| 头像     | `delegatesTo` 所提供的节点，通常是 `component:Avatar` 拥有的 `avatar` 目标。                                          |
| 名称     | `none`——可达性缺口：内置名称在未被目标化的后代上绘制显式辅助字号与次要颜色；见 OQ1。                                  |
| 内容     | `delegatesTo` 调用方拥有的 children 及其目标；自定义内容没有组件拥有的目标。                                          |
| 元数据   | `none`——有意的当前边界：调用方提供完整渲染的节点，而包装层只贡献放置。                                                |

## Family and system relationships

- 当前没有 `family:chat` 记录。`Chat.doc.mjs` 是面向使用方的家族文档，拥有共享目标清单；它不是产品权威。
- `component:ChatMessageList` 提供可选的密度上下文，并拥有列表间距、日志语义、流式状态与消息顺序。
- `component:ChatMessageBubble` 在存在时消费发送方与密度上下文，并拥有气泡呈现。
- ChatMessage 的 `compact | balanced | spacious` 密度词汇或顺序目前没有直接所有者。FR4–FR5 记录已发布的轴与优先级；路由到的全局布局声明不能裁定该组件专属词汇。
- `spec:AST-029` 拥有本记录验证图所遵循的审计证据清单。

## Verification map

| 契约         | 验证                                                                           | 代表状态                                                                 | 变更或失败预期                                          | 审计小节               |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------- |
| FR1–FR3      | `ChatMessage.test.tsx`; `ChatMessage.stories.tsx`                              | 所有发送方；被跳过的标量、不渲染任何内容、数值、内容以及被抑制的槽位状态 | 移除标量跳过或 CSS 折叠会留下空槽位或间隙               | `audit:ChatMessage/§4` |
| FR4–FR5      | `ChatMessage.test.tsx`; `ChatMessageBubble.test.tsx`; `themingTargets.test.ts` | 独立；继承的密度；显式覆盖                                               | 改变优先级或反映会让后代与主题得到不同的密度            | `audit:ChatMessage/§2` |
| FR6, AR1–AR2 | `ChatMessage.test.tsx`                                                         | 可见、省略、被跳过的标量、不渲染任何内容以及系统消息的名称               | 丢弃回退的 `aria-label` 或名称引用会让 article 没有名称 | `audit:ChatMessage/§1` |
| FR7          | `ChatMessage.test.tsx`; 公开导出与主题化目标检查                               | ref；data prop；class；style                                             | 把透传或 ref 移出目标 article 会破坏公开根契约          | `audit:ChatMessage/§3` |
| RTL          | `ChatMessage.stories.tsx`                                                      | 所有发送方；窄容器长内容                                                 | 物理方向会让用户或助手在两个方向上都停留在同一侧        | `audit:ChatMessage/§9` |

从源码读取，尚无聚焦测试：

- FR1：按发送方的起点、终点与居中对齐。
- FR2：系统消息仍然渲染其 children。
- FR3：视觉槽位顺序。
- FR7：调用方的 `aria-label` 或 `aria-labelledby` 不覆盖命名，以及 `xstyle` 在 article 上组合。
- ORD1：根与 children 的间距遵循解析后的密度。
- FR6：不渲染文本的名称保留回退名称。
- PR1–PR2：无监听器或 Effect，且上下文值仅随发送方或密度变化。
- AR3：组件自身没有键盘模型。

## Decision log

- **DEC-1 — 槽位空态遵循渲染后的 DOM。** （`cixzhang`，2026-10-31）ChatMessage 只跳过 `null`、布尔值与空字符串槽值。任何其他内容都原样传给 React；其包装元素在不渲染任何东西时以 `:empty` 折叠，而当被引用的名称不渲染文本时，article 的命名回退到 `aria-label`。已否决：检查数组、Fragment 或可迭代对象，因为它们看不到组件输出，并会消耗一次性迭代器。

## Open questions

- **OQ1 — 内置名称是否应成为可单独主题化的剖析部件？** （`human-api`）已发布的家族清单只暴露聚合的 `chat-message` 目标，而名称的显式字号与颜色使根覆盖无法通过继承到达它。添加或拆分目标会改变公开主题化 API，因此本记录只陈述可达性缺口，不选择补救方案。

## Content boundary

本文件不重复使用方 prop 表或示例、当前审计分数、截图矩阵或共享系统规则。审计 PR 拥有 `spec:AST-029/FR5` 所要求的已完成的运行证据。
