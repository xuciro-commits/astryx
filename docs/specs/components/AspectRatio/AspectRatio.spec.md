---
schema_version: 3
template_version: 7
kind: component
id: component:AspectRatio
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/AspectRatio/AspectRatio.test.tsx,
    packages/core/src/AspectRatio/__tests__/AspectRatioFitLayers.a11y.browser.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/AspectRatio.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# AspectRatio component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 一个盒子，具有必填的 `ratio`，`shape` 取值为 `rectangle` 或 `ellipse`，以及用于其唯一子元素的可选 `fit`，取值为 `cover`、`contain` 或 `center`。 |
| 行为          | 盒子取其容器的宽度，通过类级 `aspect-ratio` 由 `ratio` 推导高度，裁剪溢出内容，并按 `fit` 布局其子元素。                                         |
| 终端用户影响  | 读者看到媒体与占位符保持稳定形状，内容加载时布局不会位移。                                                                                       |
| 构建者影响    | 无；本记录描述已发布的行为。                                                                                                                     |
| 兼容性/就绪度 | 将已发布行为记录为 current；无 API、默认值或输出变更。                                                                                           |
| 审查检查      | 若出现内联 `aspect-ratio`、会修改子元素自身 props 的 `fit`、反映在主题目标上的 `fit`，或盒子不再裁剪溢出，则予以否决。                           |
| 治理规则      | `architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV2,INV6`。                                         |

本表是审查投影；下文正文具有权威性。

## Intent

AspectRatio 将内容保持在固定的宽高比上，使媒体、嵌入内容与占位符在加载前就预留其空间。它拥有比例盒子、其可选的椭圆裁剪，以及其子元素如何填满该盒子。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：记录已发布行为；无公共 prop、默认值、DOM 或样式输出变更。内容槽位保留携带 `fit` 的 `data-astryx-aspect-ratio-override` 属性，供针对它的产品 CSS 使用；其上没有任何 Astryx 样式键
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- Ratio 盒子：其宽度、推导高度、裁剪与椭圆形状。
- 填满盒子并定位子元素的 Content 槽位。
- 设置 `fit` 时直接子元素的尺寸与 object-fit。

**不拥有 / 非目标**

- 子元素的内容、语义与替代文本——由调用方拥有。
- 响应式比例变更——由调用方 CSS 通过 `xstyle` 或无分层的 `aspect-ratio` 规则拥有。
- 头像与缩略图呈现——由 `component:Avatar` 与 `component:Thumbnail` 拥有。

## Public concepts

| 概念  | 封闭取值或状态                       | 含义                                                                                     | 按变体/方向/状态的可用性 | 默认值      | 所有者                  | 稳定性 | 无效值行为                |
| ----- | ------------------------------------ | ---------------------------------------------------------------------------------------- | ------------------------ | ----------- | ----------------------- | ------ | ------------------------- |
| Ratio | 一个正数，宽度 ÷ 高度                | 盒子的 `aspect-ratio`。                                                                  | 始终                     | 必填        | `component:AspectRatio` | 稳定   | 按给定值传给 CSS。        |
| Shape | `rectangle`、`ellipse`               | 盒子是否被裁剪为椭圆（比例为 1 时为圆形）。                                              | 始终                     | `rectangle` | `component:AspectRatio` | 稳定   | TypeScript 会拒绝其他值。 |
| Fit   | `cover`、`contain`、`center`；未设置 | 子元素如何填满盒子：拉伸并裁剪、拉伸并加黑边，或按自然尺寸居中；未设置时子元素不带样式。 | 始终                     | 未设置      | `component:AspectRatio` | 稳定   | TypeScript 会拒绝其他值。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                | 依据                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1 | Ratio 盒子是一个相对定位、全宽的 `div`，具有裁剪溢出、最小高度为零、无 flex 收缩，并携带反映 `shape` 的 `aspect-ratio` 目标。其 `aspect-ratio` 为 `ratio`，以类级声明发出，因此 `xstyle`、无分层的调用方规则或内联 `style` 都可以覆盖它。                                                                                             | 当前源码与测试             |
| FR2 | `shape="ellipse"` 为 Ratio 盒子设置 50% 圆角，在比例为 1 时将其裁剪为圆形，否则为椭圆。                                                                                                                                                                                                                                               | 当前源码与测试             |
| FR3 | Content 槽位以绝对定位位于盒子的顶部行内起始角，宽高为全尺寸，并在设置 `fit` 时携带等于 `fit` 的 `data-astryx-aspect-ratio-override`。                                                                                                                                                                                                | 当前源码与测试             |
| FR4 | `fit="cover"` 与 `fit="contain"` 将每个直接子元素设为填满整个盒子，并为直接的 `img` 或 `video` 子元素设置 `object-fit: cover` 或 `contain`；`fit="center"` 将子元素按其自然尺寸居中；未设置 `fit` 时不应用任何子元素样式。`fit` 从不修改子元素自身的 props，且子元素规则位于基础级联层，因此后续层、无分层 CSS 与内联子元素样式优先。 | 当前源码、测试与浏览器测试 |
| FR5 | `fit` 不反映在主题目标上。                                                                                                                                                                                                                                                                                                            | 当前源码与测试             |
| FR6 | `ref` 到达 Ratio 盒子。受支持的 DOM、ARIA、data 与事件 props 到达 Ratio 盒子；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                                                                                                                                                                                           | 当前源码与测试             |

### Allowed variation

- **AV1 — 响应式比例。** 调用方可以按断点或容器尺寸从 CSS 更改比例，而无需更改组件。
- **AV2 — 主题绘制。** 主题可以按 `shape` 重新设置 `aspect-ratio` 的样式。

### Representative states

| 状态         | 必需不变式                                             | 允许的变体 |
| ------------ | ------------------------------------------------------ | ---------- |
| 矩形，无 fit | 盒子处于 `ratio`；子元素在全尺寸槽位内不带样式。       | 比例。     |
| 椭圆，cover  | 椭圆裁剪；媒体填满并裁剪。                             | 比例。     |
| Contain      | 媒体填满并加黑边。                                     | —          |
| Center       | 子元素按自然尺寸居中。                                 | —          |
| 调用方覆盖   | 调用方的 `aspect-ratio` 规则或内联样式优先于 `ratio`。 | 断点。     |

### Transformation and precedence order

- **ORD1 — 比例。** 组件类 `aspect-ratio` → `xstyle` → 无分层的调用方 CSS → 内联 `style`。
- **ORD2 — 子元素尺寸。** 基础层中的 `fit` 规则 → 后续层、无分层 CSS 与内联子元素样式。

### Performance and resources

- **PR1 — 仅 CSS。** AspectRatio 不持有状态，也不测量任何内容；布局由 CSS 解析。

## Accessibility contract

- **AR1 — 不添加语义。** Ratio 盒子与 Content 槽位不添加 role 或名称；子元素的语义原样透传。

## Design relationships

| 解剖结构或状态 | 设计要求                         | 表示权威       | 层级角色 | 组件契约      |
| -------------- | -------------------------------- | -------------- | -------- | ------------- |
| Ratio 盒子     | 持有比例、裁剪溢出并携带形状。   | 当前源码与文档 | 支撑     | FR1, FR2, FR5 |
| Content 槽位   | 填满盒子并定位或设置子元素尺寸。 | 当前源码与文档 | 支撑     | FR3, FR4      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Ratio box": {"target": "aspect-ratio"},
  "Content slot": {"inherits": "aspect-ratio"}
}
```

## Family and system relationships

- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR1 与 FR6 将它们应用于 Ratio 盒子。
- `architecture:component-theming-surface` 拥有目标资格认定；FR5 使结构性 `fit` 轴不进入目标。

## Verification map

| 契约          | 验证                                                                        | 代表状态                       | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 审计小节                     |
| ------------- | --------------------------------------------------------------------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1, FR2, FR6 | `AspectRatio.test.tsx` 的 ratio、shape、ref、透传与合并测试；稳定的视觉基线 | 多种比例、椭圆、覆盖           | 出现内联的 `aspect-ratio`、丢失的内联 `style` 覆盖、丢失的 `data-shape` 反映、丢失的 ref 或丢弃的调用方 prop 都会导致失败。稳定的视觉基线 `core-aspectratio--default`（16:9、`cover`）与 `core-aspectratio--with-placeholder-skeleton`（探针主题）返回发生变化的盒子以供审查。缺口：没有单元测试断言全宽、裁剪、最小高度为零、不收缩规则、椭圆的 50% 圆角，或 `xstyle` 的 `aspectRatio` 优先于 `ratio`；两个基线都没有让盒子溢出，也没有加载默认 story 的远程图片，因此裁剪与 `cover` 填充没有视觉检查；并且基线既未渲染椭圆，也未渲染 flex 宿主。 | `audit:AspectRatio/layout`   |
| FR3–FR5       | `AspectRatio.test.tsx` 的 fit 测试套件                                      | Cover、contain、center、未设置 | 未设置 `fit` 时出现标记、子元素 `className` 或内联 `objectFit` 发生变化、包装元素缺少其填充、cover、contain 或 center 样式，或目标上出现 `fit`，都会导致失败。缺口：单元测试检查包装元素携带哪些样式，而不检查其声明（子元素尺寸、`object-fit`、居中），并且遗漏添加到子元素的 props 或在其自身 `style` 下合并的尺寸；槽位的行内起始锚定没有自动化检查；浏览器级联测试覆盖 `cover` 与 `contain` 的尺寸与 `object-fit`，但不覆盖 `center`。                                                                                                         | `audit:AspectRatio/layout`   |
| FR4（级联）   | `AspectRatioFitLayers.a11y.browser.spec.ts`                                 | Tailwind v3 与 v4 分层设置     | 在真实浏览器中，preflight 规则压过 `fit` 尺寸会导致失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `audit:AspectRatio/layout`   |
| 主题解剖映射  | `scripts/check-knowledge.mjs`                                               | 使用方解剖结构与当前目标       | 缺失、多余或过时的映射会导致仓库校验失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `audit:AspectRatio/theming`  |
| AR1, PR1      | 源码审查                                                                    | 所有状态                       | 缺口：若 AspectRatio 添加语义、状态或测量，没有自动化检查会失败。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `audit:AspectRatio/behavior` |

## Decision log

未记录。本记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 props 表格/示例、当前审计结果、实现步骤或家族/系统规则，而是链接到它们的所有者。
