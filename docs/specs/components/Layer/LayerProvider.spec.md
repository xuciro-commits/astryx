---
schema_version: 3
template_version: 7
kind: component
id: component:LayerProvider
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout]
verified_by:
  [
    packages/core/src/Layer/LayerProvider.test.tsx,
    packages/core/src/Layer/toastHost.test.tsx,
    packages/core/src/Layer/toastHost.lateRegistration.test.tsx,
    apps/storybook/stories/Layer.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:layer-runtime]
contributing: []
system_specs: [spec:AST-059, spec:AST-038]
---

# LayerProvider component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                           |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | `LayerProvider`，接受 `children`、`toast`（`{position, maxVisible, inset}`）与 `inset`（`{blockStart, blockEnd, inlineStart, inlineEnd}`）。                       |
| Behavior                | 最外层的 provider 提供层配置，并在 Toast 被导入后渲染唯一的 toast 视口。嵌套的 provider 原样渲染其 children，唯一例外是嵌套的 `inset` 会收窄其子树中层的 `inset`。 |
| End-user impact         | Toast 出现在一个配置好的角落，锚定层与 toast 与声明的浮动栏保持距离。                                                                                              |
| Builder impact          | 无。                                                                                                                                                               |
| Compatibility/readiness | 记录已发布的行为，例外是 toast 视口会等待 Toast 导入（FR1）；无公开变更。                                                                                          |
| Review checks           | 拒绝嵌套 provider 产生的第二个 toast 视口、托管与触发器关联的层的 provider，以及与无 provider 时渲染不同的默认 provider。                                          |
| Governing rules         | `spec:AST-059` FR6（`inset`）；`architecture:layer-runtime` INV10–INV11；`component:Toast`。                                                                       |

本表是审查投影；下文正文具有权威性。

## Intent

LayerProvider 是 Astryx 层的应用级配置点。它是 `Layer.doc.mjs` 唯一以行内条目形式记录的公开组件；该文档其余部分描述层运行时，由 `architecture:layer-runtime` 拥有。本记录拥有 provider 自身所渲染的内容。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容性类别：记录已发布的行为，例外是 toast 视口会等待 Toast 导入（FR1）；无公开变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- provider 是否挂载 toast 视口，以及嵌套 provider 透传什么（FR1–FR3）。

**不拥有 / 非目标**

- `inset` 对 gutter、上限与 toast 视口的作用——由 `spec:AST-059` FR6 拥有。
- 层托管、放置与文本默认值——由 `architecture:layer-runtime` 与 `spec:AST-038` 拥有。
- Toast 行为，包括 `toast.inset` 的各边如何与 `inset` 结合——由 `component:Toast` 拥有（FR6）。

## Public concepts

除使用方 props 之外，没有组件本地概念。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                      | Basis                        |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1 | 其上没有 LayerProvider 的 provider 提供层上下文（`toast` 配置与 `inset`）和 toast 上下文。一旦 Toast 被导入，它在 `children` 之后渲染一个 toast 视口，由 `toast.position`、`toast.maxVisible`、`toast.inset` 与 `inset` 配置；在此之前不渲染。 | 当前源码与测试               |
| FR2 | 嵌套在另一个 provider 之下的 provider 不挂载 toast 视口。没有 `inset` 时，它原样渲染其 children；有 `inset` 时，它声明的每条边作用于其子树中的层，并保留外层的 `toast` 配置。它未设置的边在该子树中读取到什么，此处不作契约规定。              | 当前源码；`spec:AST-059` FR6 |
| FR3 | 在未声明任何内容时，provider 不改变层几何，因此默认 provider 之下的层与无 provider 时的层一致。                                                                                                                                                | `spec:AST-059` FR6；测试     |

### Allowed variation

- **AV1 — 配置。** `toast` 与 `inset` 的值可变。

### Representative states

| State             | Required invariant                   | Allowed variation |
| ----------------- | ------------------------------------ | ----------------- |
| 根 provider       | 提供上下文；Toast 加载后有一个视口。 | Toast 配置。      |
| 无 `inset` 的嵌套 | children 不变；没有第二个视口。      | —                 |
| 带 `inset` 的嵌套 | 子树 `inset` 收窄；toast 配置不变。  | `inset`。         |

### Transformation and precedence order

- **ORD1 — Inset。** 对于嵌套 provider 声明的边，其值作用于其子树；未设置的边不作契约规定（FR2）。

### Performance and resources

- 无资源规则。

## Accessibility contract

- 自身没有无障碍行为；toast 视口的无障碍行为由 `component:Toast` 拥有。

## Design relationships

| Anatomy or state | Design requirement       | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------ | ------------------------ | -------------- | ------------------ |
| Provider         | 自身不渲染任何可视表面。 | 当前源码                 | 支撑           | FR1                |

`Layer.doc.mjs` 未声明解剖结构，因此不记录解剖结构与主题的映射。

## Family and system relationships

- `spec:AST-059` FR6 拥有 `inset` 的含义。
- `architecture:layer-runtime` INV10 指出，provider 是配置，而非通用的层宿主。

## Verification map

| Contract | Verification                                                                                                                                                                                                                                 | Representative states                                 | Mutation or failure expectation                                                     | Audit section                  |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------ |
| FR1–FR3  | `LayerProvider.test.tsx`；FR1 还包括 `toastHost.test.tsx` 与 `toastHost.lateRegistration.test.tsx`；`LayerProvider.test.tsx` 的 toast 配置套件，针对 `toast.maxVisible` 以及无 `inset` 的嵌套 provider（一个视口、保留外层配置、不增加元素） | 默认、声明 `inset`、嵌套、toast `inset`、未导入 Toast | 默认 provider 的差异、未到达其层的 `inset`，或未导入 Toast 就出现视口，均视为失败。 | `audit:LayerProvider/behavior` |

从源码读取，尚无聚焦测试：

- FR1：`toast.position` 到达视口。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 props 表、`inset` 规则或层运行时。它链接到它们的拥有者。
