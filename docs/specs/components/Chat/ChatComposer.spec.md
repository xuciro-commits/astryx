---
schema_version: 3
template_version: 7
kind: component
id: component:ChatComposer
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Chat/ChatComposer.test.tsx,
    packages/core/src/Chat/ChatComposerInput.test.tsx,
    packages/core/src/Chat/ChatSendButton.test.tsx,
    apps/storybook/stories/ChatComposer.stories.tsx,
    apps/storybook/stories/ChatComposerCustomInput.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:interaction-modality,
    architecture:react-component-runtime,
    architecture:component-style-authoring,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs:
  [
    spec:AST-002,
    spec:AST-009,
    spec:AST-017,
    spec:AST-020,
    spec:AST-027,
    spec:AST-029,
  ]
---

# ChatComposer component contract

## Contract at a glance

| 方面            | 契约                                                                                                                                                                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `ChatComposer`，支持受控或非受控草稿（`value`、`onChange`）、`onSubmit`、`placeholder`、`isDisabled`、`isStopShown`、`onStop`、`density`、`elevation`、`status`、`statusPosition`，以及 drawer、header、input、footer 和 send 插槽，还有 BaseProps；以及导出的组合上下文。 |
| 行为            | ChatComposer 协调受控或非受控草稿，裁剪提交的值，通过现有值通道清除，组合调用方插槽，并让默认的 send/stop 动作与上下文保持同步。                                                                                                                                           |
| 最终用户影响    | 屏幕阅读器用户可以识别被禁用的编辑器，指针和触摸用户可以停止可中断的响应，使用自定义编辑器的用户发送的是该编辑器提供的草稿，而不是过期的 composer 状态。                                                                                                                   |
| 构建者影响      | 无。                                                                                                                                                                                                                                                                       |
| 兼容性/就绪状态 | 记录已发布的行为；无公共变更。Current-state impact 下列出了两个实现缺口；四个所有者问题仍未解决。FR1、FR5–FR7、FR10 和 PR1–PR2 的部分证据仍然待定（从源码读取；见验证映射）。                                                                                              |
| 审查检查项      | 拒绝忽略上下文提交参数的改动、默认文本框隐藏禁用状态的改动、祖先元素阻止已启用 Stop 动作的改动，或在未经所有者同意的情况下解决未决问题的改动。                                                                                                                             |
| 治理规则        | `architecture:interaction-modality/INV4, INV7, INV9`; `architecture:public-component-api/INV5–INV6, INV9, INV12`; `architecture:component-theming-surface/INV4, INV6`; `spec:AST-020/FR1`; `spec:AST-029/DEC-4`.                                                           |

本表是评审用的投影，正文为准。

## Intent

ChatComposer 是聊天界面的消息输入外壳。它协调当前草稿与提交操作，围绕默认或调用方提供的输入布局可选的 drawer、header、status、footer 和发送区域内容，并负责仅键盘编辑器的焦点指示。产品方负责消息传输、流式状态、校验策略以及每个插槽中的内容。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：成功提交在受控模式下通过 `onChange` 清除，否则通过本地状态清除
- 迁移决策：无

使用方迁移说明应放在使用方文档和发布说明中。

## Current-state impact

- **公共 target 无法触达实际绘制的 body。** `chat-composer` target 位于外框上，因此主题无法选择 body 的 elevation 和 border。`architecture:component-theming-surface` INV4 要求每个可主题化部件的绘制落在其 target 上（FR7、OQ1）。
- **样式输入分散在两个元素上。** `ref`、DOM props 和事件、`className` 与 `style` 到达外框，而 `xstyle` 到达绘制的 body。`architecture:public-component-api` INV6 要求样式输入组合在同一个元素上（FR10、OQ2）。

## Ownership boundary

**负责**

- 协调受控或非受控的序列化草稿值与输入及提交动作。
- 提供默认的支持 token 的编辑器与 send/stop 动作，同时允许两者被替换。
- 布局 drawer、header、input、footer、send 和 status 区域。
- 应用 composer 的 density、elevation、禁用表现以及仅键盘编辑器的焦点指示。
- 发布供自定义输入和发送控件使用的组合上下文。

**不负责 / 非目标**

- 发送、重试、取消或持久化消息——由产品调用点负责。
- 决定响应何时处于流式状态或是否可中断——由产品调用点负责。
- 附件数据、模型选择、语音识别或校验策略——由提供的插槽组件和产品调用点负责。
- 产品的无障碍会话记录或实时响应播报——由外层聊天界面负责。

## Public concepts

| 概念           | 封闭值或状态                                               | 含义                                                       | Availability by variant/orientation/state | Default               | Owner                               | Stability | Invalid-value behavior                                      |
| -------------- | ---------------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------- | --------------------- | ----------------------------------- | --------- | ----------------------------------------------------------- |
| 草稿归属       | 非受控；受控 `value` + `onChange`                          | 选择序列化输入草稿的存储位置以及如何报告清除。             | 每个 ChatComposer                         | 非受控空字符串        | `component:ChatComposer`            | stable    | 没有更新所有者的受控 `value` 仍由调用方控制。               |
| 提交           | 输入提交；默认发送；自定义上下文 `onSubmit(value)`         | 交付一个裁剪后的、非空的所提供值，并通过当前通道清除草稿。 | 已启用且提供值非空的 composer             | 无提交                | `component:ChatComposer`            | stable    | 空值以及禁用状态下的提交会被忽略。                          |
| 输入组合       | 默认 ChatComposerInput；自定义 React 节点                  | 提供编辑表面和可选的已注册焦点控件。                       | 每个 ChatComposer                         | ChatComposerInput     | `component:ChatComposer`            | stable    | 未注册控件的自定义输入会回退到 textarea 焦点。              |
| 编辑可用性     | 启用；禁用                                                 | 控制草稿是否可编辑或可提交。                               | 每个 ChatComposer                         | 启用                  | `component:ChatComposer`            | stable    | 禁用的提交会被忽略。                                        |
| 主要动作       | 发送；停止                                                 | 发送当前草稿或请求中断。                                   | 默认 ChatSendButton 或自定义 sendButton   | 发送                  | `component:ChatComposer`            | stable    | 显示 Stop 动作但没有 `onStop` 时会渲染但不做任何事（OQ4）。 |
| 密度           | compact；balanced；spacious                                | 选择 composer 间距。                                       | 每个 ChatComposer                         | balanced              | `component:ChatComposer`            | stable    | 未知值会被 TypeScript 拒绝。                                |
| 高程           | low；none                                                  | 选择抬起的 body 或扁平的带边框 body。                      | 每个 ChatComposer                         | low                   | `component:ChatComposer`            | stable    | 未知值会被 TypeScript 拒绝。                                |
| 状态           | absent；error；warning；top；bottom                        | 在 body 之前或之后添加播报的反馈。                         | 可选 status 对象                          | absent；存在时 bottom | `component:ChatComposer`            | stable    | 省略 message 时会渲染状态条但不播报任何内容。               |
| 命名组合插槽   | drawer；header actions/context；input；footer/send actions | 让调用方围绕草稿组合辅助控件和信息。                       | 可选，可独立提供                          | 省略                  | `component:ChatComposer`            | stable    | 省略插槽组不会输出空 header；footer 仍保留用于发送动作。    |
| BaseProps 表面 | ref；DOM props/events；className/style；xstyle             | 用 DOM 标识、行为和样式扩展组件。                          | 每个 ChatComposer                         | 省略                  | `architecture:public-component-api` | stable    | 在 frame 与 body 之间分裂（FR10、OQ2）。                    |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                  | 依据                                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| FR1  | 受控模式必须通过 `onChange` 报告变更；非受控模式必须在本地保留它们。每次成功提交都必须裁剪并交付提供给该操作的值，然后通过同一值通道清除。                                                                                                                                                                                              | 公共类型与文档；`architecture:public-component-api/INV3, INV9, INV12`；聚焦测试                                         |
| FR2  | 默认编辑器必须序列化其当前文本/token，Enter 提交且不带 Shift，保留 Shift+Enter，在 IME 组合期间延迟，并允许调用方的按键处理器阻止默认操作。                                                                                                                                                                                             | 实现、文档与聚焦测试                                                                                                    |
| FR3  | `isDisabled` 必须阻止草稿编辑和提交，并必须在默认文本框上暴露 `aria-disabled="true"`；移除该 prop 必须移除该状态。                                                                                                                                                                                                                      | `spec:AST-020/FR1`（WCAG 2.2 4.1.2）；`architecture:interaction-modality/INV5`；红/绿聚焦测试                           |
| FR4  | 当 `isStopShown` 为 true 时，默认主要动作必须保持为已启用、有名称的 Stop 按钮并调用 `onStop`；如果编辑同时被禁用，祖先元素的样式不得阻止其指针、触摸或键盘激活。                                                                                                                                                                        | `architecture:interaction-modality/INV4, INV7, INV9`；红/绿聚焦测试与浏览器故事测试                                     |
| FR5  | 省略的 header 插槽必须省略 header 行；drawer 在 body 之前；input 填充 header 与 footer 之间的 body；footer 动作在 send 动作和主要动作之前；status 遵循 `statusPosition`。                                                                                                                                                               | 实现、props、故事和代码块                                                                                               |
| FR6  | `compact` 减少 body 的内边距和间距；`balanced` 与 `spacious` 产生相同的 body 间距。`spacious` 是否应有所不同仍未决定（OQ3）。                                                                                                                                                                                                           | 实现和已发布的联合类型；当前没有所有者选择不同的 spacious 几何                                                          |
| FR7  | `low` 应用 low 静止态以及 medium hover 和 focus-within 高程；`none` 不应用阴影并使用边框。实现缺口：公共 target 无法触达绘制的 body（Current-state impact；OQ1）。                                                                                                                                                                      | 实现；`architecture:component-theming-surface/INV4, INV6`；`chat-composer` target 位于 frame 上（Current-state impact） |
| FR8  | 键盘焦点进入已注册/默认编辑器时，必须向 body 添加共享焦点指示；指针焦点不得添加该额外圆环。点击非交互式 body 空间必须聚焦已注册控件，然后回退到 textarea；点击打开中的 Tooltip 或 HoverCard 表面内部不算 body 空间（`component:Tooltip` FR11、`component:HoverCard` FR11），`architecture:layer-runtime` INV17 为每个层涵括了这一条款。 | 实现；`architecture:interaction-modality/INV1–INV3, INV9`；聚焦测试                                                     |
| FR9  | 错误状态通过共享播报通道以 assertive 方式播报，警告状态以 polite 方式播报，每次场合一次：一次状态转换，重新渲染或更新为相同值不会重复（`spec:AST-086` FR6）；状态条本身不携带 live role。两者都将语义图标与颜色配对，并可渲染在 body 上方或下方。                                                                                       | 实现、文档和故事；`spec:AST-020/FR1`；`spec:AST-086/FR2, FR5, FR6`                                                      |
| FR10 | `ref`、DOM props 和事件、`className` 与 `style` 到达外框；`xstyle` 到达绘制的 body。实现缺口：样式输入分裂在两个元素上（Current-state impact；OQ2）。                                                                                                                                                                                   | 实现；`architecture:public-component-api/INV5–INV6, INV8`                                                               |
| FR11 | 导出的上下文必须向自定义组合暴露当前值、change 与 submit 操作、placeholder、disabled/stop/send 状态、stop 回调以及可变的输入焦点控件。                                                                                                                                                                                                  | 公共导出、类型、文档、故事和聚焦测试；`architecture:public-component-api/INV12`                                         |

### Allowed variation

- **AV1 — 插槽内容。** 调用方可以省略或替换每个命名插槽，同时保持 composer 的值、提交、焦点和禁用契约。
- **AV2 — 产品工作流。** 调用方决定何时显示 status 或 Stop 以及其回调做什么；ChatComposer 只负责本地可供性和派发。
- **AV3 — 编辑器实现。** 自定义输入可以是 textarea、contenteditable 编辑器或其他控件，只要它遵循导出的上下文和焦点控件契约。

### Representative states

| 状态               | 必需不变式                                                  | 允许的变体                          |
| ------------------ | ----------------------------------------------------------- | ----------------------------------- |
| 空草稿             | 默认发送动作被禁用，提交不会触发。                          | Placeholder 和可选插槽会变化。      |
| 非空草稿           | Enter 或 Send 提交一个裁剪后的值，并通过当前归属通道清除。  | 序列化 token 表示和传输行为会变化。 |
| 受控草稿           | 调用方值保持权威；onChange 接收编辑和清除请求。             | 调用方可以接受或延迟每次更新。      |
| 自定义输入         | 上下文操作作用于提供的值，body 点击使用其已注册的焦点控件。 | DOM/编辑器实现会变化。              |
| 禁用编辑           | 默认文本框暴露禁用状态，无法编辑或提交。                    | 辅助内容仍然可见。                  |
| 禁用但可中断的工作 | Stop 保持有名称、已启用，并可通过指针、触摸和键盘触达。     | 产品取消行为会变化。                |
| 扁平高程           | Body 无阴影并使用其带边框表现；键盘焦点指示仍然可用。       | 主题 token 会变化。                 |
| 上方或下方的状态   | 播报紧急程度、图标、颜色和所选位置保持同步。                | 消息内容和状态类型会变化。          |
| 窄视口             | Composer 保持在其包含的内联尺寸内，主要动作仍然可操作。     | 可用内联尺寸和可选插槽内容会变化。  |

### Transformation and precedence order

- **ORD1 — 值更新。** 接收编辑器值 → 受控时通过 `onChange` 发布，非受控时更新本地状态 → 派生当前上下文值和发送可用性。
- **ORD2 — 提交。** 接收该操作提供的值 → 裁剪 → 拒绝空值或禁用状态下的提交 → 调用公共 `onSubmit` 一次 → 通过当前值通道请求清除。
- **ORD3 — 主要动作。** 解析 `isStopShown` → 暴露 Stop 并派发 `onStop`，否则根据当前草稿和禁用状态派生发送可用性 → 提交当前上下文值。
- **ORD4 — 组合顺序。** 可选顶部状态 → drawer → body header → input → footer 动作 → send 动作 → 主要动作 → 可选底部状态。

### Performance and resources

- **PR1 — 上下文稳定性。** 在没有任何公共成员改变时，导出的上下文值应保持引用稳定性。
- **PR2 — 焦点协调。** 组件自身不为 body 点击焦点或焦点指示添加 document 监听器或观察器；它挂载共享的 interaction-modality 跟踪器，该跟踪器添加 document 级的 `pointerdown` 和 `keydown` 监听器（`architecture:interaction-modality`）。

## Accessibility contract

- **AR1 — 编辑状态。** 默认 contenteditable 表面充当 textbox，当编辑不可用时必须通过 `aria-disabled` 暴露禁用状态。
- **AR2 — 原生动作。** 默认 Send 和 Stop 控件保持为原生按钮并带有已翻译的无障碍名称；禁用的 Send 使用原生禁用行为，而显式的 Stop 保持可操作。
- **AR3 — 键盘编辑。** Enter 提交必须保留 Shift+Enter 换行行为、IME 组合，以及调用方通过 `preventDefault()` 取消。
- **AR4 — 焦点指示。** 编辑器中的键盘焦点必须产生共享的可见焦点处理；指针焦点不主张键盘模态，内部动作上的焦点仍由该动作负责。
- **AR5 — 状态反馈。** 错误反馈通过共享播报通道以 assertive 方式播报，警告反馈以 polite 方式播报（`spec:AST-086` FR2、FR5）；可见状态条不携带 live role 并保持可读。可见图标和颜色不替代调用方的消息内容。

## Design relationships

| 解剖结构或状态    | 设计要求                                         | 表示权威                                                 | 层级角色   | 组件契约           |
| ----------------- | ------------------------------------------------ | -------------------------------------------------------- | ---------- | ------------------ |
| Composer 框架     | 将 body 和可选状态组合为一个组合外壳。           | 当前源码                                                 | container  | FR5                |
| Composer body     | 提供绘制的圆角输入/动作表面和高程。              | elevation 已发布；公共主题可达性尚未确定                 | prominent  | FR7                |
| Drawer            | 将附件/上下文内容放在 body 之前。                | 委托给 `component:ChatComposerDrawer`                    | supporting | FR5                |
| Header            | 在起始处放置调用方动作，在末尾放置调用方上下文。 | 当前源码                                                 | supporting | FR5                |
| Input             | 拥有或承载编辑表面及其焦点控件。                 | 委托给 `component:ChatComposerInput` 或调用方自定义输入  | prominent  | FR1–FR3, FR8, FR11 |
| Footer            | 在 body 最后一行放置调用方动作和主要动作。       | 当前源码                                                 | supporting | FR4–FR5            |
| Send 或 stop 动作 | 呈现当前主要操作。                               | 委托给 `component:ChatSendButton` 或调用方自定义发送按钮 | prominent  | FR1, FR4           |
| 状态消息          | 在 body 之前或之后添加错误或警告反馈。           | 共享通道播报和颜色已发布；此处不断言单独的公共主题可达性 | supporting | FR5, FR9, AR5      |

公共 `chat-composer` target 位于 frame 上，无法选择 body 的 elevation 和 border（Current-state impact）。目前尚未记录任何解剖结构主题映射；该块在迁移期间是可选的，因此映射被推迟。

## Family and system relationships

- 当前没有 family 或设计记录治理 ChatComposer 特有的行为。
- `architecture:public-component-api` 负责 BaseProps 的元素归属、回调语义以及导出的组合上下文。
- `architecture:interaction-modality` 负责模态一致性、焦点归属，以及已启用的 Stop 必须保持可触达这一要求。
- `architecture:component-theming-surface` 负责解剖结构到 target 的处置，并使当前的 body 可达性错配成为阻塞性问题，但不决定其修复形态。
- `architecture:component-test-sufficiency` 负责公共状态分区、否定断言、可观察输出以及精确 head 的浏览器边界。
- `architecture:react-component-runtime` 负责渲染派生状态以及浏览器/服务器边界。
- `architecture:knowledge-contracts` 将使用方语法保留在 `ChatComposer.doc.mjs` 中，将系统行为保留在本记录中。
- `spec:AST-020/FR1` 承载当前的 WCAG 2.2 无障碍基线。
- `spec:AST-029` 负责本记录验证映射所遵循的审计证据清单。

## Verification map

| 契约      | 验证                                                                                                                                                             | 代表性状态                                                    | 变更或失败预期                                                     | 审计小节                            |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------- |
| FR1, FR11 | `ChatComposer.test.tsx` 输入组合测试                                                                                                                             | 上下文提供的值，读取 value、change 和 disabled 的自定义输入   | 忽略其参数的上下文提交，或自定义输入无法读取的上下文成员，会失败。 | `audit:ChatComposer/api-behavior`   |
| FR2, AR3  | `ChatComposerInput.test.tsx`                                                                                                                                     | Enter、Shift+Enter、组合中、被取消的 keydown                  | 在组合期间发送或丢失换行的按键路径会失败。                         | `audit:ChatComposer/input-behavior` |
| FR3, AR1  | `ChatComposer.test.tsx` "exposes disabled state on the default textbox and clears it when enabled"                                                               | 禁用和重新启用的默认文本框                                    | 错误地丢失或保留禁用状态的文本框会失败。                           | `audit:ChatComposer/accessibility`  |
| FR4, AR2  | `ChatComposer.test.tsx` "keeps the Stop action pointer-operable while editing is disabled"；`ChatComposer.stories.tsx` 中的 `DisabledStreamingNarrow` story play | 编辑禁用且显示 Stop；无水平溢出的窄视口                       | 被祖先阻止的 Stop 动作，或不调用 `onStop` 的 Stop 动作，会失败。   | `audit:ChatComposer/modality`       |
| FR7       | `ChatComposer.test.tsx` elevation 测试                                                                                                                           | `low` 默认、`none`                                            | 共享 body class 的层级，或默认值不是 `low`，会失败。               | `audit:ChatComposer/theming`        |
| FR8, AR4  | `ChatComposer.test.tsx` 焦点指示测试和自定义输入焦点测试；"keeps a click on an open tooltip in the body from focusing the input"                                 | 键盘、指针、各自之后的程序化操作、内部按钮、body 点击         | 指针焦点出现圆环、键盘焦点缺少圆环，或 body 点击跳过控件，会失败。 | `audit:ChatComposer/focus`          |
| FR9, AR5  | `ChatComposer.test.tsx` 状态播报测试                                                                                                                             | error、warning、StrictMode 挂载、清除后重复、无消息、页面加载 | 状态条上的 live role、重复或缺失的播报，或错误的紧急程度，会失败。 | `audit:ChatComposer/accessibility`  |

从源码读取，尚无聚焦测试：

- FR1：受控和非受控草稿存储、裁剪、拒绝空或禁用的提交，以及通过活动通道清除。
- FR5：插槽顺序、省略的 header 行，以及 body 上方或下方的状态放置。
- FR6：密度间距。
- FR7：每种 elevation 的阴影和边框值。
- FR10：每个 BaseProps 输入落在何处。
- PR1–PR2：上下文稳定性，以及组件自身没有 document 监听器或观察器。

## Decision log

未记录组件本地的决策。

## Open questions

- **OQ1 — Body 主题可达性。** 应添加新的稳定 body target，应移动已发布的 `chat-composer` target，还是应通过另一种兼容机制将 elevation 投射到现有根 target 上？（`human-api`）
- **OQ2 — BaseProps 归属。** ref、中性 DOM props/events、`className`、`style` 和 `xstyle` 应全部归属外框还是绘制的 body，以及什么兼容路径能保留现有使用方？（`human-api`）
- **OQ3 — Spacious 密度。** `spacious` 应有意作为 `balanced` 的别名，还是应由设计选择赋予其不同间距？（`human-design`）
- **OQ4 — Stop 回调不变式。** 当 `isStopShown` 为 true 但没有 `onStop` 时，组件应拒绝该组合、禁用或隐藏 Stop，还是保持当前惰性动作？（`human-api`）

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或共享系统规则。它链接到其所有者。
