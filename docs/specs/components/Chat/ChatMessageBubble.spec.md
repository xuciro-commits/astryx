---
schema_version: 3
template_version: 7
kind: component
id: component:ChatMessageBubble
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatMessageBubble.test.tsx,
    packages/core/src/Chat/__tests__/ChatMessageBubble.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatMessageBubble.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
    packages/core/src/theme/themingTargets.test.ts,
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
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029]
---

# ChatMessageBubble component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                          |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 必填 `children`；可选 `variant`、`name`、`metadata`、`group` 与 `width`；根 `div` 透传、样式与 ref。                                                                                                              |
| Behavior                | 气泡从 Chat 消息上下文推导发送方与密度，绘制 filled 或 ghost 内容，对逻辑发送方一侧的角进行分组，并将可渲染的标量 name/metadata 内容保留在对齐包装器内。                                                          |
| End-user impact         | 对话内容以能感知发送方的气泡呈现；数值零保持与所属气泡对齐，不产生任何视觉呈现的槽位值不留空档。                                                                                                                  |
| Builder impact          | 无。                                                                                                                                                                                                              |
| Compatibility/readiness | 记录已发布的行为；无公共变更。无实现缺口；三个拥有方问题保持开放。                                                                                                                                                |
| Review checks           | 拒绝以下情形：丢失根透传/ref、缺少目标元数据、使用物理分组圆角逻辑、显式宽度仍保留默认上限、标量 `0` 落在其包装器之外、空的标量包装器，或声称已解决开放的复合边界问题。                                           |
| Governing rules         | `architecture:public-component-api/INV1, INV5, INV6, INV8–INV9`；`architecture:component-theming-surface/INV4, INV6–INV8`；`architecture:component-test-sufficiency/INV1–INV7, INV10–INV11`；WCAG 2.2 SC 1.4.10。 |

本表是评审投影；下方正文具有权威性。

## Intent

ChatMessageBubble 是 ChatMessage 内部可选的、能感知发送方的绘制内容面。它为对话内容提供气泡边界、文本内边距、分组圆角处理以及对齐的 name/metadata 放置，而这些是原始消息内容所没有的。

## Compatibility and migration

- 已发布默认值保持：yes
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用；该组件不拥有任何状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 气泡根元素的填充、文字颜色、排版、圆角、内边距、换行与宽度上限。
- 将消息发送方与密度上下文映射到气泡涂装与几何。
- 发送方一侧的分组圆角几何，使用逻辑角。
- 围绕可选 `name` 与 `metadata` 内容的对齐包装器。
- 根 DOM 透传、使用方样式合成，以及根 ref。

**不拥有 / 非目标**

- 消息语义、发送方布局、头像放置，或消息级的 name 与 metadata——由 ChatMessage 或共享的 Chat 组合面拥有。
- 时间戳、投递状态与页脚语义——由 ChatMessageMetadata 拥有。
- 调用方提供的 React 节点的含义、可访问性、生命周期或最终渲染输出。
- 列表滚动、记录语义、输入区行为或系统通知——由各自的 Chat 组件拥有。

## Public concepts

| Concept                      | Closed values or states                                                            | Meaning                                             | Availability by variant/orientation/state | Default               | Owner                                    | Stability | Invalid-value behavior                                           |
| ---------------------------- | ---------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------- | --------------------- | ---------------------------------------- | --------- | ---------------------------------------------------------------- |
| `children`                   | 任意 `ReactNode`                                                                   | 在气泡根内渲染的内容                                | 始终                                      | 必填                  | 调用方                                   | 稳定      | 不适用——必填                                                     |
| `variant`                    | `filled`、`ghost`                                                                  | 选择带填充的、能感知发送方的边界，或透明的对齐内容  | 始终                                      | `filled`              | 组件                                     | 稳定      | 封闭联合类型；由类型拒绝                                         |
| `name`                       | 省略；任意 `ReactNode`                                                             | 位于气泡上方、放在对齐包装器内的可选内容            | 始终                                      | 省略                  | 调用方/组件包装器                        | 稳定      | 不渲染的标量省略；包括 `0` 在内的可见标量保持对齐；见 FR7 与 OQ1 |
| `metadata`                   | 省略；任意 `ReactNode`                                                             | 位于气泡下方、放在对齐包装器内的可选内容            | 始终                                      | 省略                  | 调用方/组件包装器                        | 稳定      | 不渲染的标量省略；包括 `0` 在内的可见标量保持对齐；见 FR7 与 OQ1 |
| `group`                      | 省略、`first`、`middle`、`last`                                                    | 为连续气泡收紧发送方一侧的圆角                      | `filled`、`ghost`                         | 省略                  | 组件                                     | 稳定      | 省略时保持完整圆角；其他值由类型拒绝                             |
| `width`                      | 省略；任意 `SizeValue`                                                             | 用显式宽度替换默认的宽度上限                        | `filled`、`ghost`                         | 省略                  | 调用方                                   | 稳定      | 数字转为 CSS 像素；字符串原样透传                                |
| message context              | 发送方 `user`、`assistant`、`system`；密度 `compact`、`balanced`、`spacious`；缺失 | 选择所反映的发送方/密度以及相应的涂装与几何         | 嵌套或独立时                              | assistant 与 balanced | Chat 上下文 / 本投影                     | 观察性    | 上下文缺失时使用组件回退值                                       |
| root `div`                   | `BaseProps<HTMLDivElement>` 与 `ref`                                               | 扩展并引用承载 children、涂装、目标与气泡几何的元素 | 始终                                      | 无                    | `architecture:public-component-api`      | 稳定      | 组件目标数据与使用方样式一并组合                                 |
| `chat-message-bubble` target | 发送方、variant 与密度反映为 `data-*`；文档中未单独声明确切的保证属性集            | 绘制气泡根的公共选择器                              | 始终                                      | 每个气泡一个目标      | `architecture:component-theming-surface` | 稳定      | 未声明的通用属性保持尽力而为                                     |

使用方语法与 prop 默认值仍保留在 `ChatMessageBubble.doc.mjs` 中。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                | Basis                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| FR1 | 组件必须始终为 `children` 渲染一个根 `div`，包括调用方提供不渲染的子内容时。                                                                                             | 当前源码与测试                                                           |
| FR2 | 根元素必须反映解析后的发送方。`user` 选择 user 涂装；`assistant`、`system` 与缺失上下文使用非 user 涂装路径；缺失上下文反映为 `assistant`。                              | 当前源码与测试                                                           |
| FR3 | 根元素必须反映解析后的密度。`compact` 使用紧凑圆角与内边距；`balanced` 是回退值；`spacious` 使用其更宽的块轴与行内内边距。                                               | 当前源码与测试                                                           |
| FR4 | `filled` 必须绘制能感知发送方的气泡样式；`ghost` 必须移除填充与块轴内边距，同时保留行内对齐。                                                                            | 当前源码与测试                                                           |
| FR5 | `first`、`middle` 与 `last` 必须分别收紧逻辑发送方一侧的末端角、两个角与起始角。User 使用行内末端；每个非 user 发送方使用行内起始。                                      | 当前源码与测试                                                           |
| FR6 | 省略 `width` 时必须保留 `max(80%, 280px)`。显式数字或字符串必须设置宽度，并将默认上限替换为 `none`。                                                                     | 当前源码与测试                                                           |
| FR7 | `name` 与 `metadata` 在值为 null、undefined、布尔值与空字符串时必须省略其对齐包装器。可见的标量值，包括数值零，必须保留在其对齐包装器内。非标量的 React 节点保持不透明。 | 当前源码与测试                                                           |
| FR8 | 根 `ref`、中性的 DOM/data/ARIA props、class、style 与 `xstyle` 必须到达绘制根或在其上组合，且不丢失组件目标或拥有的样式。                                                | `architecture:public-component-api/INV5, INV6, INV8`                     |
| FR9 | 必须有且仅有一个 `chat-message-bubble` 目标附着于绘制根，并反映发送方、variant 与密度。                                                                                  | `architecture:component-theming-surface/INV4, INV6–INV8`；公共 Chat 文档 |

公共类型还接受数组、Fragment、元素、一次性可迭代对象、惰性内容与 promise。FR7 不遍历、不克隆、不消费、不 await、也不物化这些值：每个值都是调用方拥有的不透明内容。是否应规范化任何复合或异步类别属于 OQ1。

### Allowed variation

- **AV1 — 主题令牌。** 解析后的颜色、圆角、间距与排版可随主题变化，而语义令牌角色保持不变。
- **AV2 — 调用方内容。** 子节点、name 与 metadata 节点的结构与语义仍由调用方拥有。
- **AV3 — 绝对几何。** 由令牌解析的内边距与圆角可以变化；逻辑发送方一侧的分组与宽度优先级不变。

### Representative states

| State                     | Required invariant                                 | Allowed variation           |
| ------------------------- | -------------------------------------------------- | --------------------------- |
| standalone                | assistant 发送方与 balanced 密度回退；一个绘制目标 | 调用方内容                  |
| assistant/system, filled  | 非 user 涂装；行内起始分组圆角                     | 令牌解析的涂装              |
| user, filled              | user 涂装；行内末端分组圆角                        | 令牌解析的涂装              |
| any sender, ghost         | 透明表面；保留行内内边距；移除块轴内边距           | 主题化的文字与内边距        |
| compact/balanced/spacious | 反映的密度与相应的内边距/圆角路径                  | 解析后的令牌尺度            |
| group first/middle/last   | LTR 与 RTL 下的逻辑发送方一侧圆角序列              | 令牌解析的圆角              |
| numeric slot `0`          | 可见的零保留在对齐包装器内                         | 无                          |
| non-rendering scalar slot | null、undefined、布尔值与空字符串不产生对齐包装器  | 无                          |
| opaque name/metadata      | 非标量输入产生包装器，但不遍历也不物化             | 调用方最终拥有的 React 输出 |
| width omitted/explicit    | 保留默认上限 / 显式宽度替换上限                    | 合法 CSS 长度               |
| narrow/long text          | 在 320 CSS px 下文本换行且无水平溢出               | 换行与由此产生的高度        |

### Transformation and precedence order

- **ORD1 — 上下文到涂装。** 从最近的消息上下文或本地回退值解析发送方/密度，选择涂装与几何，然后通过共享的 `mergeProps` 契约合并组件主题 props、StyleX 输出与使用方样式输入。
- **ORD2 — 宽度。** 省略时应用默认最大宽度；显式给出时，设置宽度并在使用方样式合成之前替换该上限。
- **ORD3 — 分组。** 先解析发送方一侧，再解析分组位置，然后使用逻辑角属性，使 CSS 方向镜像物理边缘。

### Performance and resources

- **PR1 — 纯渲染推导。** 组件不拥有任何状态、Effect、事件监听器、观察器、定时器或动画帧。每个输出都在渲染期间从 props 与上下文推导。
- **PR2 — 不检视调用方内容。** 组件不遍历、不克隆、不消费、不 await、也不物化调用方提供的 React 节点。是保留该边界还是规范化选定的输入，属于 OQ1。

## Accessibility contract

- **AR1 — 显示面。** ChatMessageBubble 不添加任何自身的控件角色、Tab 停靠点、键盘行为、焦点管理、播报或可访问名称。语义属于外层的 ChatMessage 与调用方内容。
- **AR2 — 内容保留。** 调用方 DOM 与 ARIA 透传在 FR8 下到达气泡根；组件目标元数据不得覆盖中性的调用方 ARIA。
- **AR3 — 重排。** 在 320 CSS-px 的父宽度下，长内容与文档所述的全宽情形必须换行，且不产生页面水平溢出（WCAG 2.2 SC 1.4.10）。
- **AR4 — 颜色。** 气泡文字仍是有意义的内容，在浅色与深色下都要求对最终渲染的气泡/背景满足 WCAG 2.2 AA 文字对比度。组件使用语义令牌对。

## Design relationships

| Anatomy or state | Design requirement                        | Representation authority | Hierarchy role | Component contract |
| ---------------- | ----------------------------------------- | ------------------------ | -------------- | ------------------ |
| bubble content   | 能感知发送方的填充边界或对齐的 ghost 表面 | 未确定                   | 主要           | FR2–FR4            |
| grouped corners  | 在视觉上连接发送方一侧的连续气泡          | 未确定                   | 辅助           | FR5                |
| name             | 将辅助内容与气泡文本内边距对齐            | 未确定                   | 辅助           | FR7                |
| metadata         | 将辅助内容与气泡文本内边距对齐            | 未确定                   | 辅助           | FR7                |

没有任何 `authority: current` 的设计记录拥有 ChatMessageBubble 的本地表示（OQ3）。这些行描述已发布的外观；它们不授权重新设计。

## Family and system relationships

- 共享的 Chat 使用方文档拥有跨 message、bubble、metadata、list、layout 与 composer 组件的组合指导。
- `architecture:public-component-api` 拥有导出、透传、样式输入与 ref 行为。
- `architecture:component-theming-surface` 拥有绘制目标与所反映的轴。它并不独立要求这个封闭的 variant 轴变为可扩展；那将需要一项组件级公共 API 决策。
- `architecture:component-test-sufficiency` 拥有基于风险的证据清单。
- `spec:AST-029` 拥有本记录验证映射所遵循的审计证据清单。

## Verification map

| Contract | Verification                                                                                                      | Representative states                               | Mutation or failure expectation                     | Audit section                           |
| -------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------- | --------------------------------------- |
| FR1–FR3  | `ChatMessageBubble.test.tsx` 的 children、sender、回退与 compact 密度测试                                         | 独立；user 与 assistant；compact                    | 缺少根元素、回退或所反映的轴即失败。                | `audit:ChatMessageBubble/behavior`      |
| FR4, FR9 | `ChatMessageBubble.test.tsx` 的 variant 与 ghost 测试；`themingTargets.test.ts`                                   | filled；ghost                                       | 丢弃反映、完全移除 ghost 内边距，或丢失目标即失败。 | `audit:ChatMessageBubble/theming`       |
| FR5      | `ChatMessageBubble.a11y.chromium.spec.ts` 的可见状态与 RTL 分组圆角测试                                           | user 与 assistant × first、middle、last；LTR 与 RTL | 物理圆角逻辑或错误的发送方一侧会使圆角断言失败。    | `audit:ChatMessageBubble/rtl`           |
| FR6      | `ChatMessageBubble.test.tsx` 的宽度测试                                                                           | 省略；字符串；数字                                  | 保留上限或改变数字像素即失败。                      | `audit:ChatMessageBubble/behavior`      |
| FR7      | `ChatMessageBubble.test.tsx` 的槽位测试；Chromium 可见状态测试中的数值对齐                                        | 零；true；false；空字符串；nullish                  | 真值判断会丢失零的对齐，或恢复出空包装器。          | `audit:ChatMessageBubble/behavior`      |
| FR8, AR2 | `ChatMessageBubble.test.tsx` 的 “forwards the ref and neutral DOM props to the bubble root” 与 `data-testid` 测试 | ref；DOM、data 与 ARIA props                        | 丢弃透传即失败。                                    | `audit:ChatMessageBubble/public-api`    |
| AR3      | `ChatMessageBubble.a11y.chromium.spec.ts` 的 “keeps long content inside a 320px fixture”                          | 320 CSS px                                          | 出现水平溢出即失败。                                | `audit:ChatMessageBubble/accessibility` |
| AR4      | `ChatMessageBubble.a11y.chromium.spec.ts` 可见状态测试的对比度断言                                                | 浅色与深色                                          | 气泡文字低于 4.5:1 即失败。                         | `audit:ChatMessageBubble/accessibility` |

从源码读取，尚无聚焦测试：

- FR1：当 `children` 为 `null` 时渲染一个根元素。
- FR2：`system` 发送方走非 user 涂装路径。
- FR3：独立的 `balanced` 回退、紧凑圆角，以及 `spacious` 内边距。
- FR4：`filled` 绘制发送方填充；`ghost` 移除填充与块轴内边距，且其行内对齐与每种密度匹配。
- FR8：`className`、`style` 与 `xstyle` 合成。
- AR1：组件自身没有角色、Tab 停靠点或名称。
- PR1–PR2：没有状态或 Effect，也不检视调用方内容。

## Decision log

未记录任何组件本地决策。

## Open questions

- **OQ1 — ChatMessageBubble 是否应把每个非标量 `ReactNode` 的 name/metadata 值都保持为调用方拥有的不透明内容，还是应把选定的数组、Fragment、一次性可迭代对象、惰性值或 promise 规范化为稳定、可安全重渲染的空/非空契约？**（`human-api`）
- **OQ2 — 对齐的 name 与 metadata 包装器是否应变为可独立主题化、继承某个当前拥有方，还是保持有意的不可达？**（`human-api`）
- **OQ3 — 若有的话，哪个当前设计拥有方应让 filled/ghost 用法与分组圆角表示成为持久约定？**（`human-design`）

## Content boundary

本文件不重复使用方的 prop 表/示例、实现步骤或共享架构规则。这些内容保留在 `ChatMessageBubble.doc.mjs` 及其规范拥有方中。
