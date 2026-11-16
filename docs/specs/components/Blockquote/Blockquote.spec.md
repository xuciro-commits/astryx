---
schema_version: 3
template_version: 7
kind: component
id: component:Blockquote
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/Blockquote/Blockquote.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Blockquote.stories.tsx,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: [design:bidirectionality]
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009]
---

# Blockquote component contract

## Contract at a glance

| Area                    | Contract                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 语义化的 `blockquote`，承载 `children`，并带有可选的 `cite` 归属信息。                                                             |
| Behavior                | 引用具有内联起始边线与次要文本；可渲染的 `cite` 在内容之后以裸 `cite` 元素呈现。                                                   |
| End-user impact         | 读者看到被区分开的引用文本；屏幕阅读器用户获得原生 blockquote，且归属信息不会产生多余的地标。                                      |
| Builder impact          | 无；该记录描述已发布的行为。                                                                                                       |
| Compatibility/readiness | 已发布行为记录为 current；无 API、默认值或输出变更。                                                                               |
| Review checks           | 拒绝物理左线、包裹归属信息的 `footer`，或非 `blockquote` 根元素。                                                                  |
| Governing rules         | `design:bidirectionality/DR3`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV2`。 |

该表格是审查投影；下方的正文才具有权威性。

## Intent

Blockquote 借助原生引用语义，把被引用的内容与周围文本区分开。它拥有引用的边线、内缩与颜色，以及其可选归属信息的位置。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、DOM 或样式输出变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发行说明。

## Ownership boundary

**拥有**

- `blockquote` 根元素，及其边线、内缩、颜色和归零的外边距。
- 归属（Attribution）元素及其在引用之后的放置位置。

**不拥有 / 非目标**

- 被引用的内容与归属文本——由调用方拥有。
- 引号（如需）——由调用方的内容拥有。
- Markdown 块引用——由 `component:Markdown` 拥有。

## Public concepts

| Concept | Closed values or states | Meaning                    | Availability by variant/orientation/state | Default | Owner                  | Stability | Invalid-value behavior                                          |
| ------- | ----------------------- | -------------------------- | ----------------------------------------- | ------- | ---------------------- | --------- | --------------------------------------------------------------- |
| 归属    | 存在；不存在            | 在引用之后渲染引用的来源。 | 始终                                      | 不存在  | `component:Blockquote` | 稳定      | `false`、`true`、`null`、`undefined` 和 `''` 均不渲染任何内容。 |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                         | Basis          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 根元素是携带 `blockquote` target 的 `blockquote`，其内联起始边有一条 `--spacing-0-5` 宽的实线，颜色为 `--color-border-emphasized`，内联起始内边距为 `--spacing-4`，文本为次要色，长单词会断行，且所有外边距为零。 | 当前源码与测试 |
| FR2 | `children` 在根元素内最先渲染。可渲染的 `cite` 在其后以裸 `cite` 元素渲染——绝不包裹在 `footer` 中——以块级显示，顶部外边距为 `--spacing-2`，使用辅助字体，常规字体样式。                                           | 当前源码与测试 |
| FR3 | 在从右到左的区域里，边线及其内边距位于右边缘：根元素使用逻辑的内联起始边框与内边距，绝不使用物理左侧的。                                                                                                          | 当前源码与文档 |
| FR4 | `ref` 会到达 `blockquote`。受支持的 DOM、ARIA、data 和事件 props 会到达它；`xstyle`、`className` 和 `style` 在组件样式之后按该顺序合并。Blockquote 在服务器上渲染。                                               | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以重新设定 `blockquote` 的样式，包括边线，而不改变语义或归属信息的放置位置。

### Representative states

| State    | Required invariant                           | Allowed variation |
| -------- | -------------------------------------------- | ----------------- |
| 仅引用   | 带边线与次要文本的 `blockquote`；无 `cite`。 | 内容。            |
| 带归属   | `cite` 位于内容之后；无 `footer` 或地标。    | 归属。            |
| 从右到左 | 边线与内边距位于右边缘。                     | —                 |

### Transformation and precedence order

- **ORD1 — 样式输入。** 组件 class → 组件样式 → `xstyle` → `className` → `style` → 其余调用方 props。

### Performance and resources

- **PR1 — 静态渲染。** Blockquote 不持有状态，也不使用 hooks。

## Accessibility contract

- **AR1 — 原生引用。** 根元素是原生 `blockquote`。
- **AR2 — 无多余地标。** 归属信息是裸 `cite`；绝不包裹在 `footer` 中，因为在分区根（sectioning root）内它会成为内容信息地标。

## Design relationships

| Anatomy or state | Design requirement             | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------ | ------------------------ | -------------- | ------------------ |
| 边线             | 内联起始边缘上的一条强调线。   | 当前源码与文档           | 辅助           | FR1, FR3           |
| 引用             | 以次要文本呈现的被引用内容。   | 当前源码与文档           | 突出           | FR1, FR2           |
| 归属             | 引用下方的来源，使用辅助字体。 | 当前源码与文档           | 辅助           | FR2, AR2           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Rule": {"target": "blockquote"},
  "Quotation": {"inherits": "blockquote"},
  "Attribution": {"inherits": "blockquote"}
}
```

边线是根元素的边框，因此共用根元素的 `blockquote` target。

## Family and system relationships

- `design:bidirectionality` DR3 拥有内联起始与内联结束的放置；FR3 将其应用于边线。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR4 将其应用于根元素。

## Verification map

| Contract            | Verification                                                                                       | Representative states       | Mutation or failure expectation                                                                                                                                                                                                                                             | Audit section               |
| ------------------- | -------------------------------------------------------------------------------------------------- | --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1, FR4            | `Blockquote.test.tsx` 的渲染、class、ref、透传与服务器测试                                         | 仅引用                      | 非 `blockquote` 根元素、丢失的 target、ref 或调用方 prop，或失败的服务器渲染都会导致失败。稳定的视觉基线 `core-blockquote--default`（中性、浅色与深色）若返回变更的边线、内边距、颜色或外边距，则提交审查。缺口：没有单元测试断言这些样式、长单词断行或样式输入的合并顺序。 | `audit:Blockquote/behavior` |
| FR2, AR2            | `Blockquote.test.tsx` 的 cite 测试                                                                 | 带与不带归属                | 缺少 `cite` 或包裹地标都会导致失败。缺口：没有测试断言归属信息位于内容之后，其块级显示、外边距、字体与字体样式也没有自动化检查，而且视觉基线不渲染归属信息。                                                                                                                | `audit:Blockquote/a11y`     |
| FR3                 | `@astryx/no-physical-properties` lint 规则；`Blockquote.stories.tsx`                               | 从右到左                    | Blockquote 样式中出现物理的左边框或左内边距会导致 lint 失败。缺口：没有渲染后的从右到左检查来确认边线位于右边缘。                                                                                                                                                           | `audit:Blockquote/i18n-rtl` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                      | 使用方解剖结构与当前 target | 缺失、多余或过期的映射会导致仓库验证失败。                                                                                                                                                                                                                                  | `audit:Blockquote/theming`  |
| AR1                 | `Blockquote.test.tsx` 渲染测试                                                                     | 仅引用                      | 非 `blockquote` 根元素会失败。                                                                                                                                                                                                                                              | `audit:Blockquote/a11y`     |
| PR1                 | `Blockquote.test.tsx` 服务器渲染测试                                                               | 仅引用                      | 服务器渲染失败会导致失败。缺口：如果 Blockquote 增加状态或 hooks，没有测试会失败。                                                                                                                                                                                          | `audit:Blockquote/behavior` |
| AR1, AR2            | 无障碍树证据（`spec:AST-009` FR3）                                                                 | 带归属的引用                | 缺口：没有无障碍树检查来证明 blockquote 角色或地标的不存在；单元测试查询的是 DOM。                                                                                                                                                                                          | `audit:Blockquote/a11y`     |
| RTL relation        | RTL 审计策展的 D8 target（`apps/storybook/rtl-audit/targets.json`），作用于 `Blockquote / Default` | 内联起始内边距；LTR 与 RTL  | 逻辑起始内边距在 RTL 中仍停留在同一物理侧会导致 D8 失败。                                                                                                                                                                                                                   | `audit:Blockquote/i18n-rtl` |

## Decision log

无记录。该记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
