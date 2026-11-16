---
schema_version: 3
template_version: 7
kind: component
id: component:LinkProvider
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, navigation]
verified_by:
  [
    packages/core/src/Link/useLinkComponent.test.tsx,
    packages/core/src/Link/Link.test.tsx,
    packages/core/src/Link/__tests__/Link.a11y.chromium.spec.ts,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture: [architecture:public-component-api]
contributing: []
system_specs: [spec:AST-005]
---

# LinkProvider component contract

## Contract at a glance

| Area                    | Contract                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 无变更。LinkProvider 接收必填的 `component` 与 `children`。                                                         |
| Behavior                | 子树中每个通过共享链接边界解析的 Astryx 链接都用 `component` 渲染，除非组件级的 `as` 覆盖它。最近的 provider 生效。 |
| End-user impact         | 在应用路由器支持的情况下，人们通过 Astryx 链接获得应用的客户端路由（不整页刷新）。不安全的目标仍然永不导航。        |
| Builder impact          | 无。                                                                                                                |
| Compatibility/readiness | 记录已发布行为；无 API、默认值或 DOM 变更。                                                                         |
| Review checks           | 否决这样的 provider：它渲染自己的元素、覆盖显式 `as`、越过更近的 provider 泄漏，或让被拒绝的目标到达 `component`。  |
| Governing rules         | `family:navigation-destinations` FR1、FR2、FR5、FR6、AV2；`spec:AST-005`。                                          |

此表是审查投影；以下正文具有权威性。

## Intent

LinkProvider 让应用只需一次就为子树中的每个 Astryx 链接把原生锚点换成其路由器的链接组件。它是 `family:navigation-destinations` 的协作者。使用方用法见 `LinkProvider.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`；没有 provider 时，链接渲染原生锚点
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 向子树提供 `component` 及其作用域。

**不拥有 / 非目标**

- 面向路由器的 `href` 与 `to` 交接，包括 FR3 中的默认 `to`——由 `family:navigation-destinations` 下的共享链接边界（`useLinkComponent`）拥有；同一默认值在没有 provider 时也会到达 `as` 组件。
- 目标检查与被拒绝目标的惰性渲染——由 `family:navigation-destinations` FR6 与 `spec:AST-005` FR7 拥有；FR4 指向它们。
- 组件究竟是否渲染链接——由各组件拥有（例如 `component:Link` FR1 与 `component:Button` FR11）。
- 来自放大表面的命令式导航——由 `family:navigation-destinations` 通过其自身的 hook 拥有。
- 路由器组件自身的行为。

## Public concepts

| Concept  | Closed values or states | Meaning                          | Availability by variant/orientation/state | Default  | Owner                    | Stability | Invalid-value behavior               |
| -------- | ----------------------- | -------------------------------- | ----------------------------------------- | -------- | ------------------------ | --------- | ------------------------------------ |
| 链接组件 | 任意元素类型            | 在作用域内渲染被接受的链接目标。 | 在 provider 内部。                        | 原生锚点 | `component:LinkProvider` | 稳定      | 忽略 `href` 与 `to` 的组件无法导航。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                    | Basis                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| FR1 | LinkProvider 只渲染其 children，不添加任何元素。                                                                                                                             | 当前源码                                                 |
| FR2 | 在 provider 内部，通过共享链接边界渲染的链接使用 `component`。组件级的 `as` 优先于 provider；两者都没有时，渲染原生锚点。最近的 provider 生效。                              | `family:navigation-destinations` FR2、AV2；当前测试      |
| FR3 | 通过共享链接边界，`component` 接收被接受的 `href` 以及一个等于 `href` 的 `to`，除非提供了被接受的显式 `to`，后者优先；原生锚点不接收 `to`。LinkProvider 只选择 `component`。 | `family:navigation-destinations` FR6；当前测试           |
| FR4 | 被拒绝的目标永远不会到达 `component`；惰性渲染与目标检查遵循 `family:navigation-destinations` FR6 与 `spec:AST-005` FR7。                                                    | `family:navigation-destinations` FR6；`spec:AST-005` FR7 |
| FR5 | 在给定状态下不渲染链接的组件不使用 provider：被禁用的 `component:Link` 永不渲染 provider 的组件；它改而渲染哪个元素遵循 `component:Link` FR1 与 FR5。                        | 当前源码与测试                                           |

### Allowed variation

- **AV1 — 路由形态。** `component` 可以基于 href 或基于 to；两者都接收 FR3 的 props。

### Representative states

| State              | Required invariant                               | Allowed variation |
| ------------------ | ------------------------------------------------ | ----------------- |
| 没有 provider      | 原生锚点。                                       | —                 |
| Provider           | `component` 渲染带 `href` 与 `to` 的被接受链接。 | 路由器。          |
| 嵌套 provider      | 内层 provider 生效。                             | —                 |
| provider 内的 `as` | `as` 对该链接生效。                              | —                 |
| 被拒绝的目标       | 惰性原生锚点；不渲染 `component`。               | —                 |

### Transformation and precedence order

- **ORD1 — 链接组件。** 组件级 `as`，然后是最近的 LinkProvider，然后是原生锚点。
- **ORD2 — 路由器目标。** 被接受的显式 `to`，然后是 `href`。

### Performance and resources

- **PR1 — 稳定值。** 所提供的值仅在 `component` 变化时变化，因此使用方不会因为 provider 未变而重新渲染。

## Accessibility contract

- **AR1 — 自身无语义。** LinkProvider 不添加 role、名称或焦点行为；它所提供的链接组件负责根据收到的 props 渲染可访问的链接。

## Design relationships

LinkProvider 没有视觉输出。没有设计记录管辖它。

## Family and system relationships

- `family:navigation-destinations` 将 LinkProvider 列为协作者；共享链接边界在 `component` 看到目标之前先应用该家族的目标规则。
- 每个通过共享链接边界渲染链接的组件都消费它，例如 `component:Link` 与 `component:Button` 的链接模式。直接渲染原生锚点的组件（如该家族的采用表所列）则不消费。

## Verification map

| Contract  | Verification                                                                           | Representative states                          | Mutation or failure expectation                    | Audit section                      |
| --------- | -------------------------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------------- | ---------------------------------- |
| FR2, ORD1 | `useLinkComponent.test.tsx` 的 provider 用例；`Link.test.tsx` 的 provider 与 `as` 用例 | Provider、嵌套 provider、`as` 覆盖             | 组件错误，或外层 provider 生效，则失败。           | `audit:LinkProvider/behavior`      |
| FR3, ORD2 | `useLinkComponent.test.tsx` 的 `to` 套件                                               | Provider 与 `as`；基于 href 与基于 to 的路由器 | 缺少或错误的 `to`，或原生锚点上的 `to`，则失败。   | `audit:LinkProvider/behavior`      |
| FR4       | `useLinkComponent.test.tsx` 的 scheme、structured 与 inert 套件                        | 被拒绝的 `href` 或 `to`；结构化目标            | 被拒绝的目标到达 `component`，或丢失身份，则失败。 | `audit:LinkProvider/behavior`      |
| FR5       | `Link.test.tsx` 的禁用自定义组件用例                                                   | provider 下被禁用的 Link                       | 被禁用的 Link 通过 `component` 渲染，则失败。      | `audit:LinkProvider/behavior`      |
| AR1       | `Link.a11y.chromium.spec.ts` 的 provider-router 状态                                   | provider 下的 Link                             | 路由器链接丢失链接 role 或名称，则失败。           | `audit:LinkProvider/accessibility` |
| FR1, PR1  | 证据缺口：没有测试断言 provider 不添加元素或保持稳定值                                 | —                                              | —                                                  | `audit:LinkProvider/behavior`      |

## Decision log

无组件本地决策。LinkProvider 应用 `family:navigation-destinations`。

## Open questions

无。

## Content boundary

此文件不复制使用方 prop 表/示例、当前审查结果、实现步骤或家族/系统规则。它链接到它们的所有者。
