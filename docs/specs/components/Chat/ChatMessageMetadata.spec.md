---
schema_version: 3
template_version: 7
kind: component
id: component:ChatMessageMetadata
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatMessageBubble.test.tsx,
    packages/core/src/Chat/ChatMessageMetadata.test.tsx,
    packages/core/src/Chat/__tests__/ChatMessageMetadata.a11y.chromium.spec.ts,
    apps/storybook/stories/ChatMessageMetadata.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:component-style-authoring,
    architecture:react-component-runtime,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029]
---

# ChatMessageMetadata component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 可选的 `timestamp` 与 `footer` ReactNode 槽位、可选的封闭 `status` 联合类型、根节点 `BaseProps<HTMLDivElement>` 与 `ref`，通过 `./Chat` 导出。                        |
| 行为          | 该行按 timestamp、footer、status 的顺序渲染当前存在的槽位，且仅在存在的槽位之间放置分隔符；用户发送者会反转 flex 行方向。五种投递状态各自具有本地化的图标与文字展示。 |
| 最终用户影响  | 读者按阅读顺序看到一行紧凑的时间、额外细节与投递状态，只在真正展示内容的条目之间出现圆点，并在每个状态图标旁显示说明文字。                                            |
| 构建者影响    | 无。                                                                                                                                                                  |
| 兼容性/就绪度 | 记录已发布的行为；无公开变更。存在一处实现缺口，列于 Current-state impact 下；两项所有者问题仍未决。                                                                  |
| 评审检查      | 拒绝以下情况：可见的零值丢失、分隔符孤立、翻译后的状态说明文字或标题被省略、根节点透传被丢弃，或声称静态 DOM 属性可证明辅助技术播报。                                 |
| 管辖规则      | `architecture:public-component-api/INV1, INV3, INV5–INV9`；`architecture:component-test-sufficiency/INV1–INV7`；`spec:AST-029/FR2–FR5`。                              |

该表是评审投影；下文才是权威内容。使用方语法属于 `ChatMessageMetadata.doc.mjs`。

## Intent

ChatMessageMetadata 是聊天消息下方的可选紧凑行。它在能感知发送者的 Chat 组合中投影调用方拥有的 timestamp/footer 内容与可选的投递状态。它不是消息正文、气泡表面、消息记录，也不是 footer 控件的所有者。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：不适用；该组件不存储投递状态。
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **状态标签可能不会被朗读。** 状态 span 带有翻译后的 `aria-label`，但没有 role。WAI-ARIA 1.2 禁止为具有通用 role 的元素命名，因此辅助技术可能会忽略该标签，只朗读可见的说明文字（FR6）。

## Ownership boundary

**拥有**

- 可选的元数据根节点、其 `chat-message-metadata` 绘制目标、ref、中性 DOM 透传，以及组合样式输入。
- timestamp、footer 与 status 之间的存在性检查与分隔符。
- 来自最近 Chat 消息上下文的发送者相对行顺序；在该上下文之外使用 assistant 回退。
- 状态到字形与翻译后说明文字的选择，以及本地发送/错误绘制路径。

**不拥有 / 非目标**

- 发送者身份、article 语义、头像、名称与正文对齐：这些由 `ChatMessage` 拥有。
- 气泡内缩与放置：这些由 `ChatMessageBubble` 拥有。
- footer 操作语义、按钮焦点与回调行为：由调用方提供的内容拥有。
- 消息记录滚动、加载或投递状态切换：由外围组合拥有。
- 为检查复合、惰性或异步 ReactNode 值而新增的公开规则，或屏幕阅读器播报时机的保证。

## Public concepts

| 概念         | 封闭取值或状态                                                     | 含义                                   | 可用性                              | 默认值                           | 所有者                              | 稳定性 | 无效值行为                                                         |
| ------------ | ------------------------------------------------------------------ | -------------------------------------- | ----------------------------------- | -------------------------------- | ----------------------------------- | ------ | ------------------------------------------------------------------ |
| `timestamp`  | 省略或调用方 ReactNode                                             | 可选的第一项，通常是时间               | 任意组合                            | 省略                             | 调用方                              | 稳定   | null、布尔值与空字符串不渲染标量槽位；`0` 会渲染；非标量保持不透明 |
| `footer`     | 省略或调用方 ReactNode                                             | 可选的中间项，例如模型信息或调用方控件 | 任意组合                            | 省略                             | 调用方                              | 稳定   | 与 timestamp 相同的标量处理                                        |
| `status`     | `sending`、`sent`、`delivered`、`read`、`error`、省略              | 可选的投递说明文字与字形               | 任意组合                            | 省略                             | 组件/调用方输入                     | 稳定   | 封闭类型联合；省略时不贡献条目                                     |
| 发送者上下文 | `user`、`assistant`、`system`、缺失                                | 选择用户反转或其他正向行顺序           | 在 `ChatMessage` 内或独立使用       | 缺失时为 assistant               | `ChatMessage` / 本地回退            | 稳定   | 非 user 值共用正向路径                                             |
| 根表面       | `BaseProps<HTMLDivElement>`、`ref`、`xstyle`、`className`、`style` | 在存在时扩展元数据行                   | 槽位通过标量存在性检查或存在 status | 标量槽位为空且无 status 时不存在 | `architecture:public-component-api` | 稳定   | 非标量值保持不透明；目标样式与使用方样式合并                       |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                     | 依据               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------ |
| FR1 | 当至少一个槽位通过共享的标量存在性谓词，或存在 `status` 时，根节点出现。非标量值被视为存在，但不检查其内部内容。                                                                           | 当前源码与测试     |
| FR2 | 接受的槽位值按 timestamp、footer、status 顺序渲染，并在被视为存在的值之间放置圆点；数字 `0` 在两个槽位中都可见，非标量节点保持不透明。                                                     | 当前源码与测试     |
| FR3 | `user` 消息会反转行方向；`assistant`、`system` 与缺失上下文走正向路径。                                                                                                                    | 当前源码           |
| FR4 | status 会选择四个注册表图标之一（`delivered` 与 `read` 共用 `checkDouble`）与本地化标签；失败使用错误文字 token，sending 有一个在减少动态效果下被抑制的 CSS 脉冲。                         | 当前源码与语言目录 |
| FR5 | 根节点合并目标、默认 StyleX 输出，以及使用方的 `xstyle`、`className` 与 `style`；接受的中性 DOM/ARIA 输入与 `ref` 抵达该根节点。                                                           | 当前源码与测试     |
| FR6 | 状态条目具有翻译后的 title、一个图标与可见的本地化文字。该行不声明 live-region role 或命令式播报。实现缺口：状态 span 还带有翻译后的 `aria-label` 但没有 role（见 Current-state impact）。 | 当前源码与测试     |

### Allowed variation

- **AV1 - 槽位内容。** 调用方决定 timestamp 与 footer 槽位内部的结构与语义。该组件不检查非标量节点。
- **AV2 - 主题。** 语义颜色、排版与间距通过活动 Theme 解析；根节点仍是公开的元数据绘制目标。
- **AV3 - 上下文。** 独立使用采用 assistant 排序回退。

### Representative states

| 状态                        | 必需的不变式                             | 允许的变化           |
| --------------------------- | ---------------------------------------- | -------------------- |
| 独立 timestamp              | 一个根节点与一个可见条目                 | 调用方内容           |
| 用户或 assistant 消息       | 发送者相对行顺序                         | 文本方向继承自页面   |
| timestamp + footer + status | 条目按标量存在性分隔；复合节点保持不透明 | 调用方 footer 内容   |
| 每种投递状态                | 各自不同的本地化说明文字与映射图标       | 活动翻译与主题 token |
| 不渲染的标量槽位            | 无孤立圆点；所有条目为空时无该行         | 复合节点保持不透明   |
| 数字 `0`                    | 可见内容，而非空标记                     | 任一槽位             |
| 窄宽度下的长 footer         | 内容在其容器内重排                       | 调用方文字可换行     |

### Transformation and precedence order

- **ORD1 - 先判存在性，再放分隔符。** 用共享谓词判定标量存在性，同时将非标量调用方节点视为不透明，然后在被视为存在的值之间放置标点。status 检查与槽位检查相互独立。
- **ORD2 - 组合。** 解析发送者上下文、选择 flex 顺序，并在一个根节点上将组件 StyleX 与主题目标同使用方样式输入组合。

### Performance and resources

- **PR1 - 渲染派生。** 该组件不创建局部 React 状态、Effect、计时器、观察者或事件监听器。其本地动画由 CSS 实现，并在减少动态效果时被抑制。

## Accessibility contract

- **AR1 - 展示语义。** 元数据行不自行添加按钮、焦点目标、列表 role 或 live region。交互式 footer 内容保留其自身的语义与键盘行为。
- **AR2 - 可见的投递状态。** 状态说明文字伴随字形，因此状态识别不依赖颜色，也不仅依赖图标。
- **AR3 - 证据边界。** 浏览器暴露的标记与 axe 覆盖范围不能确立朗读输出或播报时机；任何此类未来主张都遵循 `spec:AST-009` 及其指定的 AT 证据规则。

## Design relationships

| 结构或状态 | 设计要求                               | 表现形式权威             | 层级角色 | 组件契约 |
| ---------- | -------------------------------------- | ------------------------ | -------- | -------- |
| 元数据行   | 语义化辅助排版与发送者相对阅读顺序     | 本地表现形式未定         | 辅助性   | FR2–FR3  |
| 投递状态   | 注册表字形、说明文字与语义化错误 token | 本地突出度与动效选择未定 | 辅助性   | FR4, AR2 |

未记录组件本地设计决策。

## Family and system relationships

- 当前没有 `family:chat` 产品权威记录。`Chat.doc.mjs` 是使用方组合指引，而不是 family 契约。
- `architecture:public-component-api` 拥有根导出与透传；`architecture:component-theming-surface` 拥有公开绘制目标；`architecture:component-test-sufficiency` 拥有有界证据覆盖。
- `spec:AST-029` 拥有本记录验证映射所遵循的审计证据清单。

## Verification map

| 契约          | 验证                                                                                                                                                                       | 代表性状态                                     | 变更或失败预期                                                                                             | 审计章节                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1–FR2       | `ChatMessageMetadata.test.tsx` 的 separator、empty-row 与 numeric-zero 测试；`ChatMessageMetadata.a11y.chromium.spec.ts` 的 `narrow-overflow` 与 `status-*` 用例           | 空标量；零；timestamp、footer、status          | 多余的分隔符、空白行或隐藏的零都会导致失败。                                                               | `audit:ChatMessageMetadata/behavior`   |
| FR5           | `ChatMessageMetadata.test.tsx` 的 `forwards rest props (data-*, aria-*, id) to the root element`                                                                           | data 与 id 属性                                | 丢弃的 prop 会导致失败。                                                                                   | `audit:ChatMessageMetadata/public-api` |
| FR3, FR4, FR6 | `ChatMessageMetadata.a11y.chromium.spec.ts` 的 status 与 RTL 发送者排序测试；`ChatMessageBubble.test.tsx` 的 "renders status" 与 "renders timestamp and status on one row" | 每种 status；LTR 与 RTL 中的 user 与 assistant | 发送者顺序错误，或缺少说明文字或 title，都会失败；气泡测试还在 FR6 缺口背后固定了 status 的 `aria-label`。 | `audit:ChatMessageMetadata/behavior`   |

以下内容来自源码，尚无聚焦测试：

- FR2：空标量槽位之后、`status` 之前的分隔符。
- FR3, AV3：`system` 与独立使用时的正向行。
- FR4：每种 status 的图标、错误颜色，以及 sending 脉冲及其在减少动态效果下的抑制。
- FR5：ARIA 透传、`ref`、`className`、`style` 与 `xstyle` 组合，以及目标。
- FR6, AR1：该行没有自己的 live region。
- PR1：无状态、Effect、计时器、观察者或监听器。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 - 非标量 ReactNode 槽位是否应针对空值进行规范化？**（`human-api`）数组、Fragment、惰性内容与 promise 在现有标量谓词下保持不透明；该组件不消费也不检查它们。
- **OQ2 - 独立的投递状态变化是否应被播报，若应，由哪个所有者负责？**（`human-api`）当前该行仅用于展示。在没有当前所有者与适用 AT 证据的情况下，不作播报时机的主张。

## Content boundary

本文件不重复使用方 prop 表或示例，也不重复共享视觉策略。它链接到这些内容的所有者。
