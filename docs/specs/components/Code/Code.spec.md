---
schema_version: 3
template_version: 7
kind: component
id: component:Code
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, visual]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/Code/Code.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    .github/scripts/story-play-guard.js,
    apps/storybook/stories/Code.stories.tsx,
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
  ]
contributing: []
system_specs: [spec:AST-009]
---

# Code component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `Code` 从 `@astryxdesign/core/Code` 导出；它要求 `children`，`color` 默认为 `primary`，可选接受 `secondary` 或 `inherit`，并接受 `size="inherit"`。                                 |
| Behavior                | Code 渲染一个语义 `<code>` 元素，默认使用代码字号阶梯，并可通过显式 prop 继承周围的颜色或排版。                                                                                     |
| End-user impact         | 读者获得可识别的行内代码，它会换行，而不是强行撑宽其散文容器。                                                                                                                      |
| Builder impact          | 无；该记录描述的是已发布的行为。短的行内引用使用 Code；独立或多行片段使用 CodeBlock。                                                                                               |
| Compatibility/readiness | 已发布行为记录为 `current`；没有 API、默认值或输出变更。                                                                                                                            |
| Review checks           | 拒绝非 `code` 根、丢失内容或根 prop、未命中根的 ref、未反映在 `code` 目标上的视觉 prop、未记录的已发布 prop/默认值，或把该行内组件变成块级代码替代品的变更。                        |
| Governing rules         | `architecture:public-component-api/INV1,INV5,INV6,INV8–INV9`；`architecture:component-theming-surface/INV3–INV7`；`architecture:component-test-sufficiency/INV1–INV7,INV10–INV11`。 |

该表格是审查投影；下方正文具有权威性。

## Intent

在散文内部以原生代码语义和紧凑、可主题化的行内处理呈现简短的技术引用。

## Compatibility and migration

- 已发布默认值保持不变：是
- 兼容性类别：记录已发布行为；没有运行时、类型、默认值、样式、目标或导出变更
- 受控/非受控行为：不适用；Code 不拥有任何状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 语义行内代码根、代码排版与换行、primary/secondary/继承文本颜色、可选继承字号、受支持的根 prop 与 ref，以及 `code` 主题目标。

**不拥有 / 非目标**

- 语法高亮、行号、复制行为、标题、围栏或多行呈现——由 `component:CodeBlock` 拥有。
- 调用方提供的代码内容的含义、本地化或双向排序——由产品调用点和平台文本引擎拥有。
- 交互动作或导航契约——构建者在 Code 之外组合合适的 Button 或 Link。

## Public concepts

| Concept      | Closed values or states           | Meaning                                      | Availability | Default    | Owner            | Stability | Invalid-value behavior |
| ------------ | --------------------------------- | -------------------------------------------- | ------------ | ---------- | ---------------- | --------- | ---------------------- |
| color        | `primary`, `secondary`, `inherit` | 选择行内代码文本颜色的来源。                 | 每次渲染     | `primary`  | `component:Code` | stable    | 由公共类型拒绝         |
| size         | code scale, inherited             | 省略时使用代码字号阶梯，继承时使用周围排版。 | 每次渲染     | code scale | `component:Code` | stable    | 由公共类型拒绝         |
| code content | caller-supplied React content     | 为语义代码元素内部提供内容。                 | 每次渲染     | required   | product callsite | stable    | 普通 React 渲染        |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                               | Basis                                                                |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| FR1 | Code 渲染一个包含调用方内容的语义 `<code>` 根。                                                                                                                                                         | 已发布源码、测试、文档与 HTML 语义                                   |
| FR2 | 根使用代码字体族，并在省略 `size` 时使用 `--text-code-size` 与周围 line-height；`size="inherit"` 还继承周围字号。`color` 选择 primary 文本（默认）、secondary 文本或继承颜色。                          | 已发布公共类型、源码、测试与 stories                                 |
| FR3 | 根以 `--radius-inner` 圆角绘制 `--color-background-muted` 背景，并使用逻辑 `--spacing-1` 行内内边距与 `--spacing-0` 块级内边距；长的行内内容会换行，而不是撑宽其散文容器。                              | 已发布源码与代表性散文 stories                                       |
| FR4 | 受支持的 DOM prop、`className`、`style` 与 `xstyle` 在根上组合，公共 ref 到达该根。`code` 目标与 `data-color` 反射在调用方 DOM prop 之后应用；`xstyle`、`className` 与 `style` 按 ORD1 规定的顺序组合。 | `architecture:public-component-api/INV5,INV6,INV8`；已发布源码与测试 |
| FR5 | 绘制的根携带公共 `code` 目标并反映 `color` 视觉轴。已发布表面中不包含任何内部目标或独立状态目标。                                                                                                       | `architecture:component-theming-surface/INV3–INV7`；源码与目标清单   |

### Allowed variation

- **AV1 — 主题涂装。** `code` 目标可以改变受支持的排版、颜色、背景、内边距、圆角与其他被接受的涂装，而不改变语义内容或行内归属。
- **AV2 — 调用方内容。** Code 内容可以包含已发布 `children` 类型所接受的任何 React 内容；其含义仍由调用方拥有。
- **AV3 — 周围排版。** 构建者可以显式继承周围的颜色或字号；省略则保留组件默认值。

### Representative states

| State               | Required invariant                            | Allowed variation        |
| ------------------- | --------------------------------------------- | ------------------------ |
| default             | 语义代码根、primary 颜色、代码字号阶梯尺寸。  | 调用方内容与主题涂装。   |
| secondary color     | 相同的根与布局，使用 secondary 文本颜色来源。 | 调用方内容与主题涂装。   |
| inherited color     | 相同的根与布局，使用周围文本颜色。            | 周围颜色与调用方内容。   |
| inherited size      | 相同的根与绘制，使用周围字号与 line-height。  | 周围排版与调用方内容。   |
| long inline content | 内容换行，且不带组件自有的物理方向几何。      | 调用方内容中的断行机会。 |

### Transformation and precedence order

- **ORD1 — 根 prop。** 受支持的调用方 DOM prop → 组件目标与视觉轴反射 → base/color/size/xstyle 类 → 使用方 class 与行内样式组合。
- **ORD2 — 排版。** 省略 size → 代码字号阶梯尺寸；显式 `inherit` → 周围字号与 line-height。

### Performance and resources

- **PR1 — 纯渲染。** Code 不拥有任何状态、Effect、监听器、观察器、定时器、外部资源或异步工作。

## Accessibility contract

- **AR1 — 原生语义。** 根保持为语义 `<code>` 元素，不添加交互角色、焦点目标或组件编写的可访问名称。
- **AR2 — 调用方内容。** 调用方提供的内容仍是可访问内容；Code 不会翻译、隐藏或复制它。

## Design relationships

| Anatomy or state | Design requirement                           | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------------------------- | ------------------------ | -------------- | ------------------ |
| Container        | 通过代码排版与紧凑背景处理区分简短技术文本。 | 观察到的已发布表示       | 行内技术内容   | FR1–FR5, AR1–AR2   |

目前没有设计记录规定 Code 的精确像素；精确调参保留在代码与视觉证据中。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "code"}
}
```

## Family and system relationships

- `architecture:public-component-api` 拥有导出可达性、可接受的根 prop、样式组合、ref 可达性、已发布默认值与使用方文档。
- `architecture:component-theming-surface` 拥有目标资格、目标放置、视觉轴反射与元数据归属。
- `architecture:component-test-sufficiency` 拥有合理证据集。

## Verification map

| Contract      | Verification                                                                                             | Representative states                                  | Mutation or failure expectation                                                                                                                                                                                    | Audit section           |
| ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| FR1, AR1, AR2 | `Code.test.tsx` 渲染测试                                                                                 | 默认                                                   | 非 `code` 根或缺失内容会失败。缺口：当包装元素成为根时渲染测试仍然通过，且如果 Code 添加角色、制表位或名称也没有测试失败，也没有可访问性树检查证明所暴露的内容（`spec:AST-009` FR3）。                             | `audit:Code/a11y`       |
| FR2, ORD2     | `Code.test.tsx` 颜色测试；story-play guard 中 `Code.stories.tsx` 的 `Colors` 与 `TextSizes` 播放检查     | primary、secondary、继承颜色；四种文本尺寸下的继承字号 | 缺失 `data-color` 反射、secondary 与 primary 相同、继承颜色或字号与父级不匹配，或所有继承字号塌缩为一种，都会失败。缺口：代码字体族与默认 `--text-code-size` 在视觉基线之外没有自动化检查。                        | `audit:Code/behavior`   |
| FR3           | `Code.stories.tsx` 的 `LongInlineContent` 播放检查；稳定视觉基线 `core-code--default`                    | 含不可断标识符的受限散文；默认                         | 停止换行或撑宽容器的 Code 会使播放检查失败；背景、圆角或内边距的变化会以变更形式返回审查。缺口：没有单元测试断言涂装或内边距。                                                                                     | `audit:Code/responsive` |
| FR4, ORD1     | `Code.test.tsx` 的 ref 与透传测试                                                                        | Ref；`aria-label`、`className`、`style`、`xstyle`      | 丢失 ref，或丢失调用方 prop、class、行内样式或 `xstyle` class，都会失败。缺口：当包装元素接收 ref 时 ref 测试仍然通过，且没有测试断言目标与 `data-color` 会覆盖调用方 DOM prop，或调用方 `xstyle` 会跟随基础样式。 | `audit:Code/api`        |
| FR5           | `themingTargets.test.ts`；`Code.test.tsx` 颜色测试                                                       | 每个颜色取值                                           | 缺失目标或 `data-color` 反射会失败。                                                                                                                                                                               | `audit:Code/theming`    |
| RTL 不适用    | `@astryx/no-physical-properties` lint 规则；`apps/storybook/rtl-audit/verified-not-applicable.json` 条目 | 每个 story                                             | 该 lint 规则会使 Code 样式中的物理左/右属性或取值失败。缺口：没有浏览器从右到左检查覆盖 Code；该条目记录了此决定。                                                                                                 | `audit:Code/rtl`        |
| PR1           | 源码审查                                                                                                 | 每个状态                                               | 缺口：如果 Code 添加状态、Effect 或监听器，没有自动化检查会失败。                                                                                                                                                  | `audit:Code/behavior`   |

## Decision log

未记录。该记录描述已发布行为。

## Open questions

无。

## Content boundary

本文件不复述使用方示例、当前审计分数、实现步骤、CodeBlock 行为或排版策略草案。它链接到其所有者。
