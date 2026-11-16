---
schema_version: 3
template_version: 7
kind: component
id: component:ChatSendButton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/Chat/ChatSendButton.test.tsx,
    packages/core/src/Chat/__tests__/ChatSendButton.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/ChatComposer.stories.tsx,
    apps/storybook/stories/ChatSendButtonAudit.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:icon-resolution-and-component-slots,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-020, spec:AST-029, spec:AST-032]
---

# ChatSendButton component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 导出的控件通过 props 相对 ChatComposer 上下文选择发送或停止呈现，接受 `sm` 或 `md`，支持图标覆盖，并用受支持的 Button DOM、事件、样式与 ref 输入扩展所渲染的 Button。                   |
| Behavior                | 发送依据显式或 composer 就绪状态被禁用，停止保持启用，状态专属操作先于组合的通用 click 处理器运行，当前发送图形先解析显式覆盖，再解析共享回退。                                         |
| End-user impact         | 用户获得已翻译的、与状态相称的发送或停止操作，其可用性跟随 composer 就绪状态。                                                                                                          |
| Builder impact          | 无。                                                                                                                                                                                    |
| Compatibility/readiness | 记录已发布行为；无公共变更。一处实现缺口，列于当前状态影响下。                                                                                                                          |
| Review checks           | 拒绝丢失发送/停止路由、使用方事件替换状态操作、停止操作被禁用、无标签的纯图标输出、丢失根输入，或丢失显式优先的发送图标或 `arrowUp` 回退。                                              |
| Governing rules         | `spec:AST-032` FR2–FR3；`architecture:public-component-api` INV5–INV8；`architecture:interaction-modality`；`architecture:component-test-sufficiency`；`spec:AST-020`；`spec:AST-029`。 |

此表是供审查的投影；以下正文具有权威性。

## Intent

ChatSendButton 是 ChatComposer 使用的紧凑操作控件。它把 composer 就绪状态与流式状态转译为共享 Button，同时保留操作、图标、样式与 ref 接缝，以供独立组合使用。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容类别：记录已发布行为；无公共变更
- 受控/非受控行为：不适用；显式 props 优先于由上下文派生的值
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Current-state impact

- **发送图标没有组件槽阶段。** 发送图形先解析 `sendIcon`，再解析共享的 `arrowUp`。`spec:AST-032` FR2–FR3 在该解析中放入了一个组件图标槽阶段；ChatSendButton 尚未提供它（FR3）。

## Ownership boundary

**拥有**

- 选择发送或停止状态。
- 状态专属的已翻译可访问名称与 Button 变体。
- 就绪状态与操作的 ChatComposer 上下文回退。
- 在组件接缝处选择发送与停止图标。
- 将状态操作与已接受的通用 click 处理器组合。
- `chat-send-button` 主题目标与圆形根样式处理。

**不拥有 / 非目标**

- ChatComposer 的值编辑、提交流程生命周期、流式生命周期或放置。
- 共享 Button 的激活、焦点、禁用语义、命中区域或基础样式。
- 共享图标图形或主题图标注册。
- 关于 `isStopShown` 是否可以在没有停止操作的情况下出现的公共策略。

## Public concepts

使用方语法仍位于 `ChatSendButton.doc.mjs`。本清单收束可观察的语义面，而不重复 prop 表。

| Concept  | Closed values or states                                     | Meaning                                                   | Availability by variant/orientation/state | Default                                             | Owner                               | Stability | Invalid-value behavior                                                  |
| -------- | ----------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------- | ----------------------------------- | --------- | ----------------------------------------------------------------------- |
| 操作状态 | 发送；停止                                                  | 选择名称、Button 变体、图标角色、禁用规则与状态操作。     | 每次渲染。                                | Composer `isStopShown`，否则为发送。                | `component:ChatSendButton`          | 稳定      | 布尔 prop 类型之外的值不受支持。                                        |
| 可用性   | 启用；禁用                                                  | 当内容未就绪时阻止发送激活。停止有意忽略它。              | 禁用仅适用于发送。                        | 显式 `isDisabled`，否则取 composer canSend 的反值。 | 组件与 ChatComposer 上下文          | 稳定      | 布尔 prop 类型之外的值不受支持。                                        |
| 操作     | 状态回调；composer 回退；组合的通用 click                   | 运行状态操作，然后运行已接受的使用方 click 处理器。       | 已启用的发送与停止激活。                  | `onSend` 或提交当前值；`onStop` 或上下文停止。      | 组件、上下文与调用方                | 稳定      | 若无状态回调或匹配的上下文操作，则只能运行所提供的通用 click。          |
| 发送图标 | 显式内容；共享回退                                          | 为发送状态选择图形。                                      | 发送状态。                                | `sendIcon`，然后是共享 `arrowUp`。                  | 组件与调用方                        | 稳定      | 不受支持的 React 内容遵循共享 Button 的渲染边界。                       |
| 停止图标 | 显式内容；共享回退                                          | 为停止状态选择图形。                                      | 停止状态。                                | `stopIcon`，然后是共享 `stop`。                     | 组件与调用方                        | 稳定      | 不受支持的 React 内容遵循共享 Button 的渲染边界。                       |
| 尺寸     | `sm`；`md`                                                  | 选择委托的 Button 尺寸，同时保留圆形处理。                | 两种状态。                                | `md`。                                              | `component:ChatSendButton`          | 稳定      | 公共联合类型之外的值会被 TypeScript 拒绝。                              |
| 根表面   | ref；受支持的 Button DOM/data/ARIA/事件；style/class/xstyle | 扩展并样式化所渲染的 Button，而不替换组件拥有的操作逻辑。 | 每次渲染。                                | 省略。                                              | `architecture:public-component-api` | 稳定      | 不受支持的 BaseProps 省略项仍不受支持；组件拥有的语义在意外冲突中优先。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                               | Basis                                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| FR1 | 发送状态必须渲染一个主级纯图标 Button，其名称来自发送译文；当显式或上下文派生的就绪状态为 false 时，它必须被禁用。                                      | 当前实现、文档、测试、`spec:AST-020` 以及共享 Button 行为                |
| FR2 | 停止状态必须渲染一个次级纯图标 Button，其名称来自停止译文，无论发送就绪状态如何都保持启用，并调用显式或上下文停止行为。                                 | 当前实现、文档与测试                                                     |
| FR3 | 发送图标解析优先 `sendIcon`，否则解析共享的 `arrowUp`。实现缺口：尚未提供 `spec:AST-032` FR2–FR3 所要求的组件图标槽阶段（当前状态影响）。               | 当前实现、文档、测试，以及 `spec:AST-032` 中的当前所有者要求             |
| FR4 | 停止图标解析优先 `stopIcon`，否则解析共享的 `stop` 图标。                                                                                               | 当前实现、文档与测试                                                     |
| FR5 | 显式的状态、禁用、回调、图标与尺寸 props 必须优先于其上下文或组件回退。已接受的通用 click 处理器必须在所选状态操作之后组合，而不是替换它。              | 当前源码与测试；`architecture:public-component-api` INV5–INV7            |
| FR6 | 受支持的 Button DOM、data、ARIA、className、style、xstyle 与 ref 输入必须到达所渲染的 Button 或在其上组合，同时组件拥有的标签、状态与激活行为保持完整。 | 当前实现加上 `architecture:public-component-api/INV5-INV8`               |
| FR7 | 组件必须通过共享 Button 在共置的 `chat-send-button` 目标上绘制，并保留其圆形组件处理。                                                                  | 当前实现、Chat 使用方文档，以及 `architecture:component-theming-surface` |

### Allowed variation

- **AV1 — 上下文或独立组合。** 构建者可以依赖 ChatComposer 上下文，或显式提供全部状态、操作与禁用值。
- **AV2 — 图形。** 显式发送与停止内容以及共享回退图形，可在图标解析 FR3 与 FR4 的状态内变化。
- **AV3 — 使用方样式。** 受支持的样式输入可以扩展 Button，同时组件拥有的状态与激活行为保持不变。

### Representative states

| State            | Required invariant                                       | Allowed variation                  |
| ---------------- | -------------------------------------------------------- | ---------------------------------- |
| 发送，禁用       | 主级已翻译发送操作不可用，且不运行回调。                 | 图标来源、尺寸、主题与使用方样式。 |
| 发送，启用       | 主级已翻译发送操作运行显式或上下文提交。                 | 图标来源、尺寸、主题与使用方样式。 |
| 停止             | 次级已翻译停止操作保持启用，并运行显式或上下文停止。     | 图标来源、尺寸、主题与使用方样式。 |
| 显式覆盖         | 显式的状态、回调、图标、禁用值与尺寸在其回退接缝上优先。 | 上下文仍可提供未指定的值。         |
| 组合的通用 click | 状态操作与已接受的通用 click 都会运行，互不替换。        | 任一处理器都可能缺失。             |

### Transformation and precedence order

- **ORD1 — 解析状态。** 显式 `isStopShown` 优先，其次是 composer 上下文，最后是发送状态。
- **ORD2 — 解析操作。** 显式状态回调优先于其 composer 回退。所选状态操作在已接受的通用 click 处理器之前运行，因为该组件并不承诺使用方可以取消其状态操作。
- **ORD3 — 解析可用性。** 停止保持启用。发送使用显式 `isDisabled`，其次取 composer 就绪状态的反值，最后在上下文之外为禁用。
- **ORD4 — 解析图形。** 在发送状态，显式 `sendIcon` 优先，其次是共享 `arrowUp`；在停止状态，显式 `stopIcon` 优先，其次是共享 `stop`。`spec:AST-032` FR2 所要求的组件图标槽阶段尚未提供（FR3）。
- **ORD5 — 组合根。** 应用组件拥有的 Button 语义与 `chat-send-button` 目标，同时保留受支持的使用方根输入。

### Performance and resources

- **PR1 — 仅渲染投影。** 该组件不添加任何 Effect、observer、监听器、定时器、状态镜像或自有的异步生命周期。

## Accessibility contract

- **AR1 — 原生操作语义。** 委托的 Button 必须拥有原生按钮激活、键盘行为、焦点指示与禁用语义。
- **AR2 — 与状态相称的名称。** 纯图标控件必须独立于图标图形暴露当前的已翻译发送或停止标签。
- **AR3 — 禁用发送行为。** 禁用的发送操作必须既不调用状态操作，也不调用使用方 click 处理器。
- **AR4 — 模态一致性。** 指针与键盘激活必须经过相同的状态操作与组合事件路径。

## Design relationships

| Anatomy or state | Design requirement                               | Representation authority                   | Hierarchy role | Component contract |
| ---------------- | ------------------------------------------------ | ------------------------------------------ | -------------- | ------------------ |
| 操作按钮         | 承载当前发送或停止操作的圆形紧凑 Button。        | 当前源码与使用方文档；精确调参保留在代码中 | 主级/次级操作  | FR1, FR2, FR7      |
| 发送图形         | 向上的发送字形，除非显式内容优先（FR3 的缺口）。 | 当前源码与文档；`spec:AST-032` FR2–FR3     | 操作提示       | FR3                |
| 停止图形         | 共享停止字形，除非显式内容优先。                 | 当前源码与使用方文档                       | 操作提示       | FR4                |

本记录不选择任何新的尺寸、变体、图标图形、颜色角色或视觉突出度。尚未记录结构-主题映射；该块在迁移期间是可选的，因此映射被推迟。

Chat 家族使用方文档收录了 `chat-send-button`。Button 拥有底层绘制与交互状态样式；该组件目标共置于该绘制元素上。

## Family and system relationships

- ChatComposer 拥有值、就绪状态、提交、停止生命周期与放置。
- Button 拥有共享激活、焦点、禁用语义、命中区域与绘制。
- `architecture:public-component-api` 拥有 BaseProps 可达性、style/ref 组合与刻意的事件组合。
- `architecture:icon-resolution-and-component-slots` 拥有共享槽模型；`spec:AST-032` FR2–FR3 在发送解析中放入一个组件槽阶段，该阶段尚未发布（当前状态影响）。
- `architecture:component-theming-surface` 拥有共置 `chat-send-button` 目标的资格与放置。
- `architecture:interaction-modality` 与 `spec:AST-020` 拥有通过 Button 继承的指针、键盘、焦点与可访问性一致性。
- `architecture:component-test-sufficiency` 拥有公共接缝的回归覆盖。
- `spec:AST-029` 拥有本记录验证映射所遵循的审计证据清单。

## Verification map

| Contract                  | Verification                                                                                 | Representative states                                                                             | Mutation or failure expectation                                                                                | Audit section                        |
| ------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| FR1, FR2, AR1-AR4         | `ChatSendButton.test.tsx`、`ChatSendButton.a11y.chromium.spec.ts` 与 `ChatComposer.test.tsx` | 启用/禁用的发送、有无处理器的停止、上下文停止、键盘/指针、浅色/深色交互状态                       | 标签、禁用、原生激活、状态路由或交互绘制漂移，会使聚焦测试或 exact-head 浏览器证据失败。                       | `audit:ChatSendButton/accessibility` |
| FR3                       | `ChatSendButton.test.tsx`                                                                    | 显式与共享回退的发送图标                                                                          | 丢失显式优先的优先级或 `arrowUp` 回退会使聚焦测试失败；`spec:AST-032` 的槽阶段不在此处测试。                   | `audit:ChatSendButton/theming`       |
| FR4                       | `ChatSendButton.test.tsx`                                                                    | 显式与回退的停止图标                                                                              | 丢失显式优先级或注册表解析会使聚焦断言失败。                                                                   | `audit:ChatSendButton/behavior`      |
| FR5, FR6                  | `ChatSendButton.test.tsx` 回调组合、顺序、尺寸、根透传、禁用点击与键盘测试                   | 发送、停止、`sm`/`md`、ref/class/data/ARIA、Enter/Space                                           | 使用方事件替换状态操作、取消导致重排、丢失根输入或模态漂移，会使聚焦测试失败。                                 | `audit:ChatSendButton/api`           |
| FR7                       | `themingTargets.test.ts` 与 `ChatSendButton.a11y.chromium.spec.ts`                           | 发送与停止主题                                                                                    | 目标移除、移出绘制元素，或未记录的目标漂移，会使测试或浏览器证据失败。                                         | `audit:ChatSendButton/theming`       |
| RTL relation              | RTL 共享测试夹具路由，加上为 ChatSendButton 与 ChatComposer 刷新的已验证不适用源回执         | 发送与停止                                                                                        | 方向性图形、物理定位或变换会使已检入的回执失效。                                                               | `audit:ChatSendButton/i18n-rtl`      |
| Browser matrix            | `ChatSendButton.a11y.chromium.spec.ts` 浏览器状态                                            | 浅色/深色下发送与停止的静止/悬停/聚焦/按下、禁用静止/悬停、`sm`/`md`、320px 粗指针、D7 对比度配对 | 过期的构建、诱饵选择器、缺失状态、变更的禁用绘制、缺失的交互像素、对比度不达标或几何偏差，都会使校验失败关闭。 | `audit:ChatSendButton/visual`        |
| Documentation and surface | 使用方文档、导出检查、Storybook 与 `check:knowledge`                                         | props、公共子路径、状态、契约                                                                     | 文档、导出、关系或必需结构缺失或过期，会使校验失败。                                                           | `audit:ChatSendButton/docs`          |

从源码读取，尚无聚焦测试：

- FR5：显式 props 优先于 ChatComposer 上下文。
- FR6：`style` 与 `xstyle` 到达根。

## Decision log

未记录任何组件本地决策。

## Open questions

- **交叉引用：无处理器的停止。** `component:ChatComposer/OQ4` 拥有关于可见停止操作在没有显式或上下文 `onStop` 时如何处理的未决策略。本记录覆盖当前已启用的空操作分支，而不重复该问题。

## Content boundary

本文件不重复使用方示例、审计得分、截图、资格数据，或共享 Button 与图标系统规则。它链接到它们的所有者。
