---
schema_version: 3
template_version: 7
kind: component
id: component:MediaTheme
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, theming]
verified_by:
  [
    packages/core/src/theme/MediaTheme.dom.test.tsx,
    packages/core/src/hooks/useAutoMediaMode.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture: [architecture:theme-application]
contributing: []
system_specs: []
---

# MediaTheme component contract

## Contract at a glance

| 方面          | 契约                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `MediaTheme`，带必需的 `mode`（`dark`、`light`、`auto`、`off`）、`fallback`（`dark`、`light`；默认 `dark`）和 `children`。 |
| 行为          | 通过一个布局中性的包装器，把子树标记为位于深色或浅色表面上，使 token 切换到与之匹配的值；`auto` 会测量该表面。             |
| 最终用户影响  | 放在图片或视频之上的文本与控件在该表面上保持可读，同时保留应用的主题。                                                     |
| 构建者影响    | 无。                                                                                                                       |
| 兼容性/就绪度 | 记录已交付的行为；无公开变更。有一处实现缺口，列在 Current-state impact 下。                                               |
| 审查检查      | 拒绝以下做法：在模式变化时重新挂载子级的包装器、遗留的探测元素，或用表面模式替换主题。                                     |
| 管辖规则      | `architecture:theme-application` INV8。                                                                                    |

本表是审查投影；下文正文具有权威性。

## Intent

MediaTheme 标记位于深色或浅色表面上的内容，例如照片之上的文本，使编译后的主题 CSS 切换其表面 token，同时保留活动主题。使用方的用法见 `MediaTheme.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已交付的行为；无公开变更
- 受控/非受控行为：`mode` 由调用方拥有；`auto` 测量该表面
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **不再可测量的表面会保留其旧的一侧。** 使用 `auto` 时，一旦某个表面已被测量，之后使其变得不可测量的变更（例如新增背景图）会保留最后一次测量到的一侧，而不是 `fallback`。使用方文档承诺：只要背景不可知就使用 `fallback`，因此文本可能仍按旧表面进行样式设置（FR3）。

## Ownership boundary

**拥有**

- 包装器、其表面标记，以及用 `fallback` 解析 `auto`（FR1–FR3）。

**不拥有 / 非目标**

- 表面标记对 token 和组件规则的作用 —— 由 `architecture:theme-application` INV8 和编译后的主题 CSS 拥有。
- 活动主题与颜色模式 —— 由 `component:Theme` 拥有。

## Public concepts

| 概念     | 封闭值或状态                   | 含义                                     | 按变体/方向/状态的可获得性 | 默认值 | 所有者                 | 稳定性 | 无效值行为              |
| -------- | ------------------------------ | ---------------------------------------- | -------------------------- | ------ | ---------------------- | ------ | ----------------------- |
| Mode     | `dark`、`light`、`auto`、`off` | 子树所在的表面、被测量的表面，或无标记。 | 每个 MediaTheme。          | 必需   | `component:MediaTheme` | 稳定   | TypeScript 拒绝其他值。 |
| Fallback | `dark`、`light`                | 当表面无法测量时 `auto` 所使用的一侧。   | 仅 `auto`。                | `dark` | `component:MediaTheme` | 稳定   | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                  | 依据           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | MediaTheme 始终渲染一个 `display: contents` 的包装器，因此切换到或切离 `off` 都不会重新挂载其子级。                                                                                                                                                                                                                                     | 当前源码与测试 |
| FR2 | `dark` 和 `light` 用该表面和主要文本颜色标记包装器；`off` 不渲染任何标记。                                                                                                                                                                                                                                                              | 当前源码与测试 |
| FR3 | `auto` 在每次渲染时测量包装器背后的表面，并将其标记为深色或浅色；当该表面自身的文本已能在其上以 3:1 阅读时，不渲染任何标记；当表面无法测量时，使用 `fallback`；它不留下探测元素。显式模式下 `fallback` 被忽略。实现缺口：一旦某次测量成功，变为不可测量的表面会保留最后一次测量到的一侧，而不是 `fallback`（见 Current-state impact）。 | 当前源码与测试 |

### Allowed variation

- **AV1 — 内容。** 子级可变；其中的组件通过 token 自适配。

### Representative states

| 状态               | 要求的不变式                                                                                | 允许的变化 |
| ------------------ | ------------------------------------------------------------------------------------------- | ---------- |
| `dark` 或 `light`  | 已设置表面标记。                                                                            | 内容。     |
| `off`              | 无标记；子级未被重新挂载。                                                                  | 内容。     |
| `auto`，未测量     | 来自 `fallback` 的标记；在先前的测量之后，则为最后测量到的一侧（见 Current-state impact）。 | 回退值。   |
| `auto`，已测量     | 来自被测量表面的标记。                                                                      | 表面。     |
| `auto`，文本已可读 | 无标记。                                                                                    | 表面。     |

### Transformation and precedence order

- **ORD1 — 模式。** 显式模式优先；`auto` 先使用测量结果，然后使用 `fallback`。

### Performance and resources

- **PR1 — 测量。** 只有 `auto` 会测量表面。

## Accessibility contract

- **AR1 — 无语义。** 包装器不添加任何 role、名称或焦点目标。

## Design relationships

| 解剖或状态 | 设计要求                     | 表示权威 | 层级角色 | 组件契约 |
| ---------- | ---------------------------- | -------- | -------- | -------- |
| 包装器     | 承载表面标记但不产生布局盒。 | 当前源码 | 支撑     | FR1、FR2 |

MediaTheme 自身不渲染任何可主题化的部分，因此没有适用的解剖-主题映射。

## Family and system relationships

- `architecture:theme-application` INV8 管辖表面标记会改变什么，并保留活动主题。
- `component:Theme` 管辖活动主题与颜色模式。

## Verification map

| 契约     | 验证                                                                                                                   | 代表性状态             | 变异或失败预期                                     | 审计小节                    |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ---------------------- | -------------------------------------------------- | --------------------------- |
| FR1, FR2 | `MediaTheme.dom.test.tsx` 的显式模式标记测试和 `off` 测试                                                              | `dark`；`light`；`off` | 错误的标记、`off` 上出现标记，或元素缺失都会失败。 | `audit:MediaTheme/behavior` |
| FR3      | `MediaTheme.dom.test.tsx` 的回退、显式回退、忽略回退和探测元素测试                                                     | `auto` 未测量          | 错误的回退值或遗留的探测元素会失败。               | `audit:MediaTheme/behavior` |
| FR3      | `useAutoMediaMode.test.ts` 的表面选择测试，包括“answers off for a chromatic surface its ambient text already reads on” | 深色、浅色和可读表面   | 错误的一侧，或在文本已可读处出现标记，都会失败。   | `audit:MediaTheme/behavior` |

从源码读取，尚无聚焦测试：

- FR1：`display: contents`，以及模式切换到或切离 `off` 时子级不被重新挂载。
- FR2：主要文本颜色。
- FR3：在每次渲染时重新测量。

## Decision log

没有记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表或示例、主题编写、token 定义或编译器输出。它链接到它们的所有者。
