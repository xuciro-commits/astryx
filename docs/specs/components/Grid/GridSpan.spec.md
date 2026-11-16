---
schema_version: 3
template_version: 7
kind: component
id: component:GridSpan
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/serverSafeComponents.test.ts,
    packages/core/src/Grid/Grid.test.tsx,
    apps/storybook/stories/Grid.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/GridSpan.stories.tsx,
    packages/core/src/Grid/__tests__/GridSpanAudit.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:layout-primitives]
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# GridSpan component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | 一个可选的包装器，用于单个 Grid 项，带有 `columns`（计数或 `'full'`）与 `rows`。                                                    |
| 行为            | 计数表示跨越相应数量的轨道；`'full'` 跨越每一显式列；包装器保持零最小宽度，使可收缩内容留在其轨道内。                               |
| 终端用户影响    | 读者看到突出显示或较高的项占据多条轨道，而不破坏网格的顺序。                                                                        |
| 构建者影响      | 无；该记录描述已发布的行为。                                                                                                        |
| 兼容性/就绪状态 | 已发布的行为记录为 current；无 API、默认值或输出变化。                                                                              |
| 审查检查        | 拒绝把 `'full'` 描述为覆盖隐式轨道、拒绝零最小宽度丢失、或拒绝添加语义的包装器。                                                    |
| 治理规则        | `family:layout-primitives/FR6`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV2`。 |

该表格是审查投影；下方正文具有权威性。

## Intent

GridSpan 改变单个项参与 Grid 的方式：它跨越多少列或多少行。它拥有该包装器，而与其中内容无关。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、DOM 或样式输出变化
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 包装器 `div`，它携带 `component:Grid` 发布并映射的 `grid-span` 目标，以及它的列跨度和行跨度。
- 包装器的单轨道内部网格与零最小宽度。

**不拥有 / 非目标**

- 轨道构建、间隙与对齐——由 `component:Grid` 拥有。
- 当数值跨度超出显式网格时由浏览器创建的隐式轨道。
- 调用方内容及其语义。

## Public concepts

| 概念 | 封闭取值或状态       | 含义                          | 按变体/方向/状态的可用性 | 默认值   | 所有者               | 稳定性 | 无效值行为                         |
| ---- | -------------------- | ----------------------------- | ------------------------ | -------- | -------------------- | ------ | ---------------------------------- |
| 列   | 正数；`full`；未设置 | 跨越 N 列，或跨越每一显式列。 | 在 Grid 内部             | 固有排布 | `component:GridSpan` | 稳定   | 浏览器解析数值跨度，包括隐式轨道。 |
| 行   | 正数；未设置         | 跨越 N 行。                   | 在 Grid 内部             | 固有排布 | `component:GridSpan` | 稳定   | 浏览器校验生成的 CSS。             |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                      | 依据           |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | GridSpan 渲染一个携带 `grid-span` 目标的 `div`，显示为网格，具有一个 `minmax(0, 1fr)` 列、零最小宽度和完整高度，并承载其子元素。                                            | 当前源码与测试 |
| FR2 | `columns={N}` 设置 `grid-column: span N`；`columns="full"` 设置 `grid-column: 1 / -1`，仅覆盖显式列；`rows={N}` 设置 `grid-row: span N`。未设置的跨度使浏览器排布保持固有。 | 当前源码与测试 |
| FR3 | 跨度声明是行内样式，应用在调用方的 `style` 之后。`ref` 到达该 `div`；受支持的 DOM、ARIA、data 与事件 prop 到达它；`xstyle` 与 `className` 在组件样式之后合并。              | 当前源码与测试 |

### Allowed variation

- **AV1 — 调用方内容。** 任何内容都可以填充该包装器。

### Representative states

| 状态     | 必需不变式                                | 允许的变化 |
| -------- | ----------------------------------------- | ---------- |
| 数值跨度 | 跨越 N 条轨道；可能创建隐式轨道。         | N。        |
| 整列跨度 | 从第 1 条线覆盖到 -1 的显式列。           | 列数。     |
| 行跨度   | 跨越 N 行，通常配合 Grid 的 `rowHeight`。 | N。        |
| 长内容   | 可收缩的后代留在轨道内。                  | 内容。     |

### Transformation and precedence order

- **ORD1 — 跨度。** `'full'` → `1 / -1`；数值 → `span N`；未设置 → 固有。
- **ORD2 — 行内样式。** 调用方 `style` → 跨度声明。

### Performance and resources

- **PR1 — 静态渲染。** GridSpan 不持有状态，也不使用 hook。

## Accessibility contract

- **AR1 — 非语义包装器。** GridSpan 自身不添加 role、名称或 tab 停靠点，并保持 DOM 顺序。
- **AR2 — 内容保持可到达。** 零最小宽度让可收缩的后代留在其轨道内；无法收缩的内容在 `component:Grid` FR1 下仍可能溢出。

## Design relationships

| 解剖结构或状态 | 设计要求                     | 表示权威       | 层级角色 | 组件契约      |
| -------------- | ---------------------------- | -------------- | -------- | ------------- |
| 跨轨项         | 一个项覆盖多条轨道；仅几何。 | 当前源码与文档 | 支撑     | FR1、FR2、AR2 |

主题化：包装器携带 `grid-span` 目标，该目标由 `Grid.doc.mjs` 声明并由 `component:Grid` 映射。`GridSpan.doc.mjs` 未声明自己的解剖结构，因此此处不声明任何解剖结构主题块。

## Family and system relationships

- `family:layout-primitives` FR6 将 GridSpan 命名为 Grid 的参与修饰符；它在 Grid 之外的行为属于本记录。
- `component:Grid` 拥有 GridSpan 所跨越的轨道。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR3 应用它们。

## Verification map

| 契约     | 验证                                                                                                                                                   | 代表性状态                                          | 变异或失败预期                                                                                                                                                                                                                                                                                                                                    | 审计小节                  |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| FR1, FR2 | `Grid.test.tsx` 的 GridSpan 测试组；`GridSpanAudit.a11y.chromium.spec.ts` 针对 `GridSpan.stories.tsx`；`rtl-audit/targets.json` 中的 GridSpan 顺序目标 | 数值、整列、行、组合、无；LTR 与 RTL                | 错误的行内 `grid-column` 或 `grid-row`、未给定跨度却设置了跨度、或丢失 `grid-span` 目标，都会使单元测试组失败。丢失单轨道内部网格或零最小宽度，或跨度未能从行内起点覆盖两条轨道加一个间隙、每一显式列、或两行加一个间隙，都会使浏览器规格失败；行跨度停止生效或停止镜像会使 RTL 顺序目标失败。缺口：完整高度没有与网格默认 stretch 相区别的检查。 | `audit:GridSpan/layout`   |
| FR3      | `Grid.test.tsx` 的 GridSpan ref、透传、样式优先级与样式输入测试                                                                                        | ref；额外 prop；调用方样式；`className` 与 `xstyle` | ref 解析到跨度元素之外的任何东西、丢失的 `aria-label`、替换跨度的调用方 `style`、未设置跨度时丢失的调用方排布、或被丢弃或在组件样式之前合并的 `className` 或 `xstyle`，都会失败。                                                                                                                                                                 | `audit:GridSpan/api`      |
| AR2      | `Grid.stories.tsx` 的长内容 play 与 AuditMatrix 整列跨度检查；`GridSpanAudit.a11y.chromium.spec.ts` 的长内容用例                                       | 长的可收缩子元素；整列跨度                          | 内容逃出轨道或整列跨度缺少显式列会使 play 失败；跨度或截断子元素逃出其 240px 宿主会使浏览器规格失败。                                                                                                                                                                                                                                             | `audit:GridSpan/layout`   |
| AR1, PR1 | `serverSafeComponents.test.ts`；`Grid.test.tsx` 的无 role 测试；`GridSpanAudit.a11y.chromium.spec.ts`                                                  | 每个状态                                            | 未加 client 指令就添加 client API 会使 `serverSafeComponents.test.ts` 失败；跨度上出现 role、无障碍名称或 tab 停靠点会使单元测试与浏览器规格失败。缺口：与 client 指令一起添加的 client API 会通过。                                                                                                                                              | `audit:GridSpan/behavior` |

## Decision log

未记录任何决策。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到它们的拥有者。
