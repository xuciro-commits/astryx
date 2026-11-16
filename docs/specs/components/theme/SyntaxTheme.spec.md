---
schema_version: 3
template_version: 7
kind: component
id: component:SyntaxTheme
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, theming]
verified_by:
  [
    packages/core/src/theme/syntax/useSyntaxTheme.diff.test.tsx,
    packages/core/src/theme/syntax/defineSyntaxTheme.diff.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:theme-authoring-contract, architecture:theme-application]
contributing: []
system_specs: []
---

# SyntaxTheme component contract

## Contract at a glance

| Area                    | Contract                                                                                           |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| Public contract         | `SyntaxTheme` 需要必填属性 `theme`（一个语法预设，或 `defineSyntaxTheme()` 的结果）与 `children`。 |
| Behavior                | 通过包装元素上的 CSS 变量和通过上下文，对它内部的代码组件应用一套语法高亮主题。                    |
| End-user impact         | 内部的代码块共享同一套语法颜色。                                                                   |
| Builder impact          | 无。                                                                                               |
| Compatibility/readiness | 记录已发布的行为；没有公共变更。一处实现缺口，列在“当前状态影响”一节。                             |
| Review checks           | 拒绝丢失语法变量，或拒绝一个缺少主题名的包装元素。                                                 |
| Governing rules         | `architecture:theme-authoring-contract`；`architecture:theme-application` INV1。                   |

本表是一份审查投影；以下正文才是权威。

## Intent

SyntaxTheme 对它子树中的代码组件应用一套语法高亮主题。语法主题如何编写由 `architecture:theme-authoring-contract` 拥有；本记录拥有该组件渲染什么。使用方用法见 `SyntaxTheme.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布的行为；没有公共变更
- 受控/非受控行为：`theme` 由调用方拥有
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **Canvas 颜色可能与强制模式不一致。** 语法主题 hook 从操作系统的 `prefers-color-scheme` 选择浅色或深色，而不是从最近的 Theme 的模式选择。在浅色系统上使用 `<Theme mode="dark">` 时，使用该 hook 的 canvas 绘制方拿到浅色，而代码块绘制深色一侧；`architecture:theme-application` INV1 要求后代读取最近的提供方（FR2）。

## Ownership boundary

**拥有**

- 包装元素、它的语法变量，以及它的主题名属性（FR1）。
- 向其后代提供语法主题（FR2）。

**不拥有 / 非目标**

- 编写语法主题及其预设——由 `architecture:theme-authoring-contract` 拥有。
- 某个代码组件如何用这些变量绘制 token——由该组件拥有。

## Public concepts

除使用方属性外，没有组件本地概念。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                            | Basis          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | SyntaxTheme 渲染一个块级 `div` 包装元素，携带值为主题名的 `data-astryx-syntax-theme`，并以行内自定义属性的形式携带该定义所包含的每一个语法 token。预设与 `defineSyntaxTheme()` 会填充每一个 diff 槽位；只有手工构建的定义缺少某个槽位时，才把它留给 CSS 默认值。                                                                                                     | 当前源码与测试 |
| FR2 | 后代通过上下文读取语法主题。语法主题 hook 为最近的 Theme 的有效模式解析每一个 token（`architecture:theme-application` INV1）；未设置的标记槽位采用主题自身的标点符号，未设置的 `added` 与 `removed` 从页面主题派生。实现缺口：该 hook 改为读取操作系统的 `prefers-color-scheme`，因此在带有强制模式的 Theme 下，它可能从包装元素的变量解析出另一侧（当前状态影响）。 | 当前源码与测试 |

### Allowed variation

- **AV1 — Theme。** 任意预设或已定义的语法主题。

### Representative states

| State                            | Required invariant                                                  | Allowed variation |
| -------------------------------- | ------------------------------------------------------------------- | ----------------- |
| 预设主题                         | 包装元素携带该预设的变量与名称。                                    | 预设。            |
| 缺少某个 diff 槽位的手工构建定义 | 不写入变量；hook 派生缺失的标记或行绘制，缺失的标题解析为空字符串。 | 主题。            |

### Transformation and precedence order

- **ORD1 — 最近的提供方。** 最近的 SyntaxTheme 提供该主题。

### Performance and resources

- **PR1 — 记忆化的值。** 包装元素样式与上下文值仅在 `theme` 变化时重新计算。

## Accessibility contract

- **AR1 — 无语义。** 包装元素不添加 role、名称或焦点目标。

## Design relationships

| Anatomy or state | Design requirement     | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------- | ------------------------ | -------------- | ------------------ |
| 包装元素         | 携带语法变量与主题名。 | 当前源码                 | 支撑           | FR1                |

SyntaxTheme 不渲染任何自己的可主题化部件，因此没有适用的解剖-主题映射。

## Family and system relationships

- `architecture:theme-authoring-contract` 拥有语法主题的构造与预设。

## Verification map

| Contract | Verification                                                                                                     | Representative states      | Mutation or failure expectation                    | Audit section                |
| -------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- | -------------------------------------------------- | ---------------------------- |
| FR1      | `defineSyntaxTheme.diff.test.ts` "skips unset diff slots in the CSS and style output of a hand-built definition" | 已设置与未设置的 diff 槽位 | 为未设置槽位写入样式值，或丢失已设置的值，即失败。 | `audit:SyntaxTheme/behavior` |
| FR2      | `useSyntaxTheme.diff.test.tsx` "resolves unset marker slots to the theme's own punctuation colour"               | 未设置的标记槽位           | 派生出的槽位有误即失败。                           | `audit:SyntaxTheme/behavior` |

从源码读取，尚无聚焦测试：

- FR1：块级包装元素、它的 `data-astryx-syntax-theme` 属性，以及包装元素应用主题的样式值。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方属性表或示例、主题编写、token 定义或编译器输出。它链接到它们的所有者。
