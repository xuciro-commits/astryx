---
schema_version: 3
template_version: 7
kind: component
id: component:ChatSystemMessage
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatSystemMessage.test.tsx,
    packages/core/src/Chat/__tests__/ChatSystemMessage.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/ChatSystemMessageAudit.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:react-component-runtime,
    architecture:theme-tokens,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-029, spec:AST-086]
---

# ChatSystemMessage component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `ChatSystemMessage`，必填 `children`、`variant`（`default`、`divider`；默认 `default`），可选 `icon`、`ref`、`xstyle`、`className`、`style`，以及根 DOM props。 |
| 行为          | `default` 渲染一行居中的内容，其中可选图标内容位于 children 之前，并对长文本换行。`divider` 将 children 渲染为带标签的水平 Divider，并忽略 `icon`。             |
| 最终用户影响  | 读者能把系统通知与发送者消息区分开，并看到带标签的日期或分节分隔；添加到聊天日志中的通知由该日志播报一次。                                                      |
| 构建者影响    | 无。                                                                                                                                                            |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。无实现缺口；仍有一个所有者问题待定。                                                                                              |
| 审查检查      | 拒绝根行上的 live role、丢失的分隔符或其名称、丢失的根输入，或未经其所有者就解决 divider-icon 问题的改动。                                                      |
| 管辖规则      | `spec:AST-086` FR4；`component:Divider`；`architecture:public-component-api`；`architecture:component-theming-surface`；`architecture:theme-tokens`。           |

此表是审查投影；以下正文具有权威性。

## Intent

ChatSystemMessage 在聊天记录中呈现简短的非发送者内容，例如“conversation started”或日期分隔。它把系统通知与发送者消息区分开，并将带标签的分隔符交给 Divider。使用方用法见 `ChatSystemMessage.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用；该组件不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 根行、其 `chat-system-message` 目标，以及在居中行与 Divider 组合之间做选择（FR1、FR2、FR5）。
- 对默认变体的长内容换行，并防止图标内容收缩（FR1）。
- 根 ref、DOM props 与样式（FR4）。

**不拥有 / 非目标**

- 播报通知 —— 由聊天日志播报添加到其内部的内容（`spec:AST-086` FR4）。
- 分隔符的线、标签位置、role、name 与标签分区 —— 由 `component:Divider` 拥有。
- 发送者身份、记录顺序与滚动。
- 调用方内容与图标图形的含义。

## Public concepts

| Concept | Closed values or states | Meaning                                    | Availability by variant/orientation/state     | Default   | Owner                         | Stability | Invalid-value behavior  |
| ------- | ----------------------- | ------------------------------------------ | --------------------------------------------- | --------- | ----------------------------- | --------- | ----------------------- |
| 呈现    | `default`、`divider`    | 一行居中的通知，或一个带标签的水平分隔符。 | 每次渲染。                                    | `default` | `component:ChatSystemMessage` | 稳定      | TypeScript 拒绝其他值。 |
| 图标    | 省略；一个 React 节点   | 通知之前的可选图形。                       | 由 `default` 渲染；由 `divider` 忽略（OQ1）。 | 省略      | `component:ChatSystemMessage` | 稳定      | 不适用。                |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                       | Basis                |
| --- | ------------------------------------------------------------------------------------------------------------------------------- | -------------------- |
| FR1 | `default` 渲染一行居中的内容，若给出 `icon` 则位于 children 之前；children 在可用的行内空间内换行，图标不收缩，且不绘制分隔线。 | 当前源码与测试       |
| FR2 | `divider` 将 children 渲染为根内部水平 `component:Divider` 的标签，因此该分隔符由其标签命名；`icon` 不渲染（OQ1）。             | 当前源码与测试       |
| FR3 | 在两种变体中，根都不携带自身的 live role；聊天日志播报添加到其内部的通知（`spec:AST-086` FR4）。                                | `spec:AST-086`；测试 |
| FR4 | `ref`、DOM、data 与 ARIA props，包括调用方的 `role`、`className`、`style` 与 `xstyle`，在两种变体中都能到达根。                 | 当前源码与测试       |
| FR5 | 根携带 `chat-system-message` 目标并反映 `variant`。                                                                             | 当前源码与测试       |

### Allowed variation

- **AV1 — 内容。** 文字与其他 React 内容可变；空标签与数字标签在 `divider` 变体中如何渲染由 Divider 拥有。
- **AV2 — 主题。** 语义颜色、间距与排版 token 按主题解析。

### Representative states

| State            | Required invariant                       | Allowed variation |
| ---------------- | ---------------------------------------- | ----------------- |
| 默认             | 居中的通知；无分隔线；无 live role。     | 内容。            |
| 带图标的默认     | 图标位于内容之前。                       | 图形。            |
| 默认，长内容     | 内容换行且无水平溢出。                   | 语言环境。        |
| Divider          | 一个由其标签命名的分隔符；无 live role。 | 标签。            |
| 带图标的 Divider | 图标不渲染（OQ1）。                      | —                 |

### Transformation and precedence order

- **ORD1 — 变体。** `divider` 选择 Divider 组合；否则渲染居中行。

### Performance and resources

- **PR1 — 仅渲染。** 该组件不添加任何状态、Effect、观察器、监听器或计时器。

## Accessibility contract

- **AR1 — 无 live role。** 该通知是普通的记录内容；由外层日志播报它（FR3）。
- **AR2 — 分隔符。** `divider` 变体通过 Divider 暴露一个由其标签命名的分隔符（FR2）。
- **AR3 — 非交互。** 该组件不添加焦点目标、键盘命令或指针操作。

## Design relationships

| Anatomy or state | Design requirement                 | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------- | ------------------------ | -------------- | ------------------ |
| 系统消息         | 一行居中的简洁非发送者内容。       | 当前源码与文档           | 支撑性         | FR1、FR5           |
| 图标             | 通知之前的可选图形。               | 当前源码与文档           | 支撑性         | FR1                |
| Divider          | 用于日期或分节分隔的带标签分隔符。 | `component:Divider`      | 支撑性         | FR2                |

尚未记录解剖结构-主题映射；该块在迁移期间为可选，因此该映射暂缓。

## Family and system relationships

- `component:Divider` 拥有分隔符的结构、role、name、绘制与标签分区。
- `spec:AST-086` FR4 将播报添加到 live 容器内部的内容的职责分配给该容器。
- `architecture:public-component-api` 拥有根透传与样式组合；`architecture:theme-tokens` 拥有 token 词汇表。
- `spec:AST-029` 拥有本记录验证图所遵循的审计证据清单。

## Verification map

| Contract | Verification                                                                                                                                                   | Representative states                       | Mutation or failure expectation          | Audit section                           |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- | ---------------------------------------- | --------------------------------------- |
| FR1      | `ChatSystemMessage.test.tsx` 的 children 与图标测试                                                                                                            | 默认；带图标的默认                          | 缺失内容或图标会失败。                   | `audit:ChatSystemMessage/behavior`      |
| FR2, AR2 | `ChatSystemMessage.test.tsx` 的 divider、separator-name、divider-icon 与 numeric-zero 标签测试；`ChatSystemMessage.a11y.chromium.spec.ts` 状态矩阵（水平方向） | divider；带图标的 divider                   | 分隔符缺失、名称错误或图标被渲染会失败。 | `audit:ChatSystemMessage/accessibility` |
| FR3, AR1 | `ChatSystemMessage.test.tsx` 的 no-live-role 测试                                                                                                              | 两种变体                                    | 根上存在 live role 会失败。              | `audit:ChatSystemMessage/accessibility` |
| FR4      | `ChatSystemMessage.test.tsx` 的“preserves the complete root passthrough seam”各变体测试                                                                        | ref、data、ARIA、role、class、style、xstyle | 丢失输入会失败。                         | `audit:ChatSystemMessage/public-api`    |
| FR5      | `ChatSystemMessage.test.tsx` 的“preserves the complete root passthrough seam”各变体测试                                                                        | 两种变体                                    | 缺少所反映的 variant 会失败。            | `audit:ChatSystemMessage/theming`       |
| FR1      | `ChatSystemMessage.a11y.chromium.spec.ts` 的 320px 粗指针重排测试                                                                                              | 320 CSS px 下的长内容                       | 水平溢出会失败。                         | `audit:ChatSystemMessage/responsive`    |

以下内容来自源码阅读，尚无针对性测试：

- FR1：居中、默认行中无分隔线、图标在内容之前渲染，以及图标不收缩。
- FR5：根上的 `chat-system-message` 目标。
- PR1、AR3：组件自身没有状态、Effect 或交互。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — `icon` 在 `variant="divider"` 时应做什么？**（`human-api`）目前它被接受且不渲染。随标签一起渲染它、在 `architecture:public-component-api` INV9 下做出破坏性的类型限制，或保留该空操作并加上文档与开发警告，这三种做法都会改变公共契约。

## Content boundary

本文件不重复使用方的 prop 表或示例，也不重复 Divider 的规则。它链接到它们的拥有者。
