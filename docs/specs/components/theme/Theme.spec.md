---
schema_version: 3
template_version: 7
kind: component
id: component:Theme
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, theming]
verified_by: [packages/core/src/theme/Theme.test.tsx]
modules: []
families: []
design_specs: []
architecture: [architecture:theme-application, architecture:theme-compilation]
contributing: []
system_specs: [spec:AST-108]
---

# Theme component contract

## Contract at a glance

| Area            | Contract                                                                                                             |
| --------------- | -------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `Theme`，包含必需的 `theme`（一个已定义的主题）、`mode`（`light`、`dark`、`system`；默认 `system`）以及 `children`。 |
| 行为            | 通过一个不影响布局的包装器，把主题与颜色模式应用到其子树。最外层的 Theme 还会把主题与强制模式写入 `<html>`。         |
| 终端用户影响    | 内部的一切都以所选主题、以及浅色、深色或系统模式渲染；浏览器界面外观跟随根 Theme。                                   |
| 构建者影响      | 无。                                                                                                                 |
| 兼容性/就绪状态 | 记录已发布的行为；无公共变更。                                                                                       |
| 审查检查        | 拒绝影响布局的包装器、会改动 `<html>` 的嵌套 Theme，或写入强制模式的 `system` 模式。                                 |
| 管辖规则        | `architecture:theme-application` INV1–INV9；`architecture:theme-compilation`。                                       |

本表是审查投影；以下正文具有权威性。

## Intent

Theme 是一个提供方，它把一个已定义的主题和一种颜色模式应用到它所包装的那部分树。提供方如何嵌套、如何共享运行时样式以及如何同步文档，由 `architecture:theme-application` 负责；本记录负责组件自身渲染的内容。使用方的用法见 `Theme.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：`theme` 与 `mode` 由调用方拥有
- 迁移决策：无

使用方的迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 包装器元素、其主题与模式属性，以及其配色方案（FR1、FR2）。
- 向子代提供主题与模式（FR3）。

**不拥有 / 非目标**

- 提供方嵌套、根文档同步、运行时样式的共享与移除，以及 `system` 解析——由 `architecture:theme-application` 负责。
- 主题所编译出的 CSS——由 `architecture:theme-compilation` 负责。
- 主题编写与令牌——由各自的架构记录负责。

## Public concepts

| Concept | Closed values or states   | Meaning                          | Availability by variant/orientation/state | Default  | Owner             | Stability | Invalid-value behavior                                                                                    |
| ------- | ------------------------- | -------------------------------- | ----------------------------------------- | -------- | ----------------- | --------- | --------------------------------------------------------------------------------------------------------- |
| 模式    | `light`、`dark`、`system` | 强制使用某种颜色模式或跟随系统。 | 每个 Theme。                              | `system` | `component:Theme` | 稳定      | TypeScript 会拒绝其他值；在运行时，任何其他值都被当作 `system`（`architecture:theme-application` INV7）。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                              | Basis            |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| FR1 | Theme 渲染一个带 `display: contents` 的包装器，因此不添加任何布局盒子，并携带 `data-astryx-theme`，其值为主题名称，同时设置主文本颜色与正文字体。                                                                                                                                                      | 当前源代码与测试 |
| FR2 | `mode="light"` 或 `"dark"` 会在包装器上设置该 `data-theme` 与配色方案；`system` 不设置 `data-theme`，而设置 `light dark` 配色方案。嵌套的 Theme 会设置自己包装器的模式。被赋予其他任何值的 Theme 仍会把它原样写入自己包装器的 `data-theme`，并设置 `light dark` 配色方案，尽管没有任何代码读取该属性。 | 当前源代码与测试 |
| FR3 | 子代通过 Theme context 读取主题与模式；最近的 Theme 生效（`architecture:theme-application` INV1）。                                                                                                                                                                                                    | 当前源代码与测试 |
| FR4 | 最外层的 Theme 会把主题名称与任何强制模式写入 `<html>`，并在卸载时移除它们；嵌套的 Theme 永远不会改动 `<html>`（`architecture:theme-application` INV2、INV7）。                                                                                                                                        | 当前源代码与测试 |

### Allowed variation

- **AV1 — 主题。** 任何已定义的主题，内置或运行时。

### Representative states

| State    | Required invariant                             | Allowed variation |
| -------- | ---------------------------------------------- | ----------------- |
| 根，系统 | 包装器与 `<html>` 上均无 `data-theme`。        | Theme。           |
| 根，深色 | 包装器与 `<html>` 上均为 `data-theme="dark"`。 | Theme。           |
| 嵌套     | 拥有自己的包装器属性；`<html>` 不变。          | Theme、mode。     |

### Transformation and precedence order

- **ORD1 — 最近的提供方。** 最近的 Theme 提供上下文；只有最外层会写入 `<html>`。

### Performance and resources

- 运行时样式的生成与共享遵循 `architecture:theme-application` INV4–INV5。

## Accessibility contract

- **AR1 — 无语义。** 包装器不添加角色、名称或焦点目标。

## Design relationships

| Anatomy or state | Design requirement                           | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 包装器           | 在不产生布局盒子的前提下携带主题标识与模式。 | 当前源代码               | 支撑           | FR1、FR2           |

Theme 自身不渲染任何可主题化的部分，因此不适用解剖结构-主题化映射。

## Family and system relationships

- `architecture:theme-application` 拥有提供方作用域、根同步、样式生命周期以及 `system` 解析。
- `architecture:theme-compilation` 拥有 Theme 挂载的 CSS。

## Verification map

| Contract | Verification                                                                | Representative states              | Mutation or failure expectation                      | Audit section          |
| -------- | --------------------------------------------------------------------------- | ---------------------------------- | ---------------------------------------------------- | ---------------------- |
| FR1      | `Theme.test.tsx` "sets data-astryx-theme on wrapper div"                    | 任意主题                           | 缺少主题属性即失败。                                 | `audit:Theme/behavior` |
| FR2, FR4 | `Theme.test.tsx` root and nested `data-theme` and `data-astryx-theme` tests | 根 light、dark、system；嵌套；卸载 | 模式属性错误，或嵌套 Theme 改动了 `<html>`，即失败。 | `audit:Theme/behavior` |

从源代码读取，尚无针对性测试：

- FR1：`display: contents`、文本颜色与正文字体。
- FR2：每种模式的配色方案，以及当取值超出这三种时包装器的 `data-theme`。
- FR3：子代读取最近 Theme 的上下文。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表或示例、主题编写、令牌定义或编译器输出。它链接到它们的负责方。
