---
schema_version: 3
template_version: 7
kind: component
id: component:ChatComposerTokenElement
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/Chat/ChatComposerTokenElement.test.tsx,
    apps/storybook/stories/ChatComposerTokenElement.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-test-sufficiency,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-029]
---

# ChatComposerTokenElement component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | `ChatComposerTokenElement`，带一个必填的 `token`：structured，即 `value` 加上 Badge 属性，其中只有 `label`、`variant` 和 `icon` 会渲染，其余的被接受但忽略；或自定义的 `{value, render}`、`ref`、`xstyle`、`className`、`style`，以及中性的 span 属性。 |
| 行为          | 结构化 token 渲染 Badge 内容；自定义 token 渲染调用方内容。两者都保留序列化的值标记，并在置于 contenteditable 的组合器内部时保持不可编辑。                                                                                                              |
| 终端用户影响  | token 标签与调用方内容保持可见，而不会变成可编辑文本。                                                                                                                                                                                                  |
| 构建者影响    | 无。                                                                                                                                                                                                                                                    |
| 兼容性/就绪度 | 记录已发布的行为；无公开变更。AR1 以及 FR1、FR2 和 FR4 的部分内容仍缺少证据（从源码读取；见验证映射）。                                                                                                                                                 |
| 审查检查      | 拒绝这样的 token 包装器：丢失其序列化的值、变为可编辑、丢弃已接受的 span 属性，或改变结构化/自定义的渲染划分。                                                                                                                                          |
| 管辖规则      | `architecture:public-component-api/INV1, INV5–INV6, INV8–INV9, INV12`；`architecture:component-test-sufficiency/INV1–INV8, INV10–INV11`；`spec:AST-029/FR3–FR5, FR7`。                                                                                  |

本表是审查用的投影；以下正文具有权威性。

## Intent

ChatComposerTokenElement 在编辑器插入机制之外渲染一个已定义的 `ChatComposerToken`。它提供与 ChatComposerInput 相同的序列化标记，同时把结构化 Badge 呈现或自定义内容留给它们现有的所有者。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布的行为；无公开变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 携带 `data-astryx-token` 与该 token 序列化值的 span。
- 在 contenteditable 区域内组合时，保持该包装器不可编辑。
- 在现有的结构化 Badge 分支与自定义渲染分支之间做选择。
- 转发包装器的 ref 以及已接受的中性 span 属性。

**不拥有 / 非目标**

- token 值的语法或产品语义。
- Badge 的颜色、图标或尺寸。
- 调用方自定义内容内部的可访问性语义与交互行为。
- token 的插入、删除、展开，或组合器的选区管理。

## Public concepts

| Concept    | Closed values or states                         | Meaning                                                     | Default  | Owner                                | Stability |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------- | -------- | ------------------------------------ | --------- |
| token 形式 | 结构化 Badge 配置；自定义渲染函数               | 在不改变序列化的前提下选择调用方内容。                      | 无；必填 | `component:ChatComposerTokenElement` | stable    |
| 序列化值   | 由调用方提供的非空字符串或空字符串              | 存储在 `data-astryx-token-value` 中、用于组合器序列化的值。 | 无；必填 | 经由本组件的调用方值                 | stable    |
| 包装器表面 | ref；DOM/data/ARIA 属性；className/style/xstyle | 在不替换自有标记的前提下扩展该序列化 span。                 | 省略     | `architecture:public-component-api`  | stable    |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                    | Basis                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| FR1 | 根元素必须暴露 `data-astryx-token` 与完全一致的所供 `token.value`，并且必须保持 `contentEditable={false}`。                  | 当前源码、文档与测试                                |
| FR2 | 结构化 token 必须把 label、variant 和 icon 的渲染委托给 Badge，且不改变 token 值。                                           | 已发布实现与公开 token 类型                         |
| FR3 | 自定义 token 必须渲染调用方函数的结果，不添加组件自有的语义或交互。                                                          | 已发布实现与公开 token 类型                         |
| FR4 | 已接受的 ref、DOM/data/ARIA、className、style 和 xstyle 输入必须到达根 span 并在其上组合，同时组件自有的序列化属性保持优先。 | `architecture:public-component-api/INV5–INV6, INV8` |

### Allowed variation

- 结构化 Badge 的标签、变体与图标仍由调用方提供。
- 自定义渲染的内容及其语义仍归调用方所有。
- 该包装器可以在 contenteditable 表面的内部或外部使用。

### Representative states

| State            | Required invariant                                | Allowed variation             |
| ---------------- | ------------------------------------------------- | ----------------------------- |
| structured token | 可见的 Badge 内容与精确的序列化值。               | Badge 标签、变体与图标。      |
| custom token     | 调用方输出与精确的序列化值。                      | 任意调用方自有的 React 节点。 |
| extended wrapper | 中性 DOM 属性与 ref 到达 span，且不替换自有标记。 | 受支持的 BaseProps 值。       |

## Accessibility contract

- **AR1 — 无可访问性语义。** 除了已接受的调用方属性之外，该包装器不拥有任何交互角色或可访问名称。
- **AR2 — 可见内容。** 结构化 Badge 文本保持为可见内容；自定义内容的语义仍归调用方所有。
- **AR3 — 原子 token。** 当嵌套在编辑器中时，`contentEditable={false}` 使该 token 整体上不可编辑。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| token 包装器     | 仅行内对齐         | 当前源码                 | 支撑性         | FR1, FR4           |
| 结构化内容       | Badge 呈现         | `component:Badge`        | 支撑性         | FR2                |
| 自定义内容       | 调用方自有的呈现   | 调用方                   | 支撑性         | FR3                |

该包装器不绘制组件自有的视觉表面，也不引入公开的主题目标。Badge 的主题化仍归 Badge 所有，自定义内容仍归调用方所有。

## Family and system relationships

- `component:ChatComposerInput` 拥有插入、序列化遍历、删除和选区行为。
- `architecture:public-component-api` 拥有公开的 props 类型、ref 和 BaseProps 组合。
- `architecture:component-test-sufficiency` 拥有针对既有公开序列化接缝的直接证据。
- `spec:AST-029` 拥有本记录验证映射所遵循的审计证据清单。

## Verification map

| Contract         | Verification                                             | Representative states             | Mutation or failure expectation                       | Audit section                             |
| ---------------- | -------------------------------------------------------- | --------------------------------- | ----------------------------------------------------- | ----------------------------------------- |
| FR1–FR3, AR2–AR3 | `ChatComposerTokenElement.test.tsx`；直接 Storybook 故事 | 结构化 token 与自定义 token       | 标记/值消失、包装器变为可编辑，或出现错误的渲染分支。 | `audit:ChatComposerTokenElement/behavior` |
| FR4              | 针对性的 ref 与 DOM 透传测试；公开类型检查               | ref、ARIA/data 属性、样式接缝     | 已接受的输入被丢弃，或自有的序列化标记被替换。        | `audit:ChatComposerTokenElement/api`      |
| rendered states  | 直接 Storybook 故事                                      | 受支持主题下的 Badge 与自定义内容 | 无法到达的故事会使故事检查失败。                      | `audit:ChatComposerTokenElement/rendered` |

从源码读取，尚无针对性测试：

- AR1：该包装器不添加自己的角色或可访问名称。
- FR1：调用方传入 `contentEditable` 时它保持为 `false`。
- FR2：`variant` 与 `icon` 到达 Badge。
- FR4：`className`、`style` 和 `xstyle` 在该 span 上组合。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方示例、当前审计分数、Badge 策略，也不重复 ChatComposerInput 的选区机制。
