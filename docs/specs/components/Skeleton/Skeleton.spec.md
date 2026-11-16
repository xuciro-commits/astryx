---
schema_version: 3
template_version: 7
kind: component
id: component:Skeleton
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Skeleton/Skeleton.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Skeleton.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-009]
---

# Skeleton component contract

## Contract at a glance

| 领域          | 契约                                                                                                     |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个占位块，具有 `width`、`height`、`radius` 与错峰 `index`。                                            |
| 行为          | 该块对辅助技术隐藏，等待一秒，然后以十步脉冲改变其不透明度；减少动态效果时保持静止。                     |
| 最终用户影响  | 视力正常的用户会看到正在加载内容的形状；屏幕阅读器用户不会被告知空的占位符；高对比度用户仍能看到该块。   |
| 构建者影响    | 无；该记录描述已发布的行为。                                                                             |
| 兼容性/就绪度 | 已发布行为记录为 current；无 API、默认值或输出变更。未记录任何实现差距。                                 |
| 审查检查      | 拒绝默认暴露的占位符、`steps()` 时间函数、减少动态效果下的脉冲，或在强制颜色下消失的块。                 |
| 治理规则      | `architecture:component-theming-surface/INV2,INV6`；`architecture:public-component-api/INV5,INV6,INV8`。 |

本表是审查投影；下文正文具有权威性。

## Intent

Skeleton 在内容加载期间代替内容，使页面保持其布局并显示内容将要出现的位置。它负责占位符的形状、绘制、脉冲，以及将其从无障碍树中排除。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已发布行为；无公共 prop、默认值、DOM、样式或目标输出变更
- 受控/非受控行为：不适用；Skeleton 不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 占位块、其 `skeleton` 主题目标、尺寸与圆角。
- 它在正常、增强对比度与强制颜色模式下的绘制。
- 延迟的、错峰的不透明度脉冲及其在减少动态效果下的抑制。
- 它默认从无障碍树中排除。

**不拥有 / 非目标**

- 周围区域的加载状态、忙碌语义、布局，以及真实内容何时替换占位符——由产品调用点拥有。
- 无已知形状的不确定进度——由 `component:Spinner` 拥有。

## Public concepts

| 概念 | 封闭值或状态                               | 含义                               | 按变体/方向/状态的可用性 | 默认值 | 所有者               | 稳定性 | 无效值行为                     |
| ---- | ------------------------------------------ | ---------------------------------- | ------------------------ | ------ | -------------------- | ------ | ------------------------------ |
| 尺寸 | `width` 与 `height`：像素数或 CSS 值       | 该块的尺寸。                       | 始终                     | `100%` | `component:Skeleton` | 稳定   | 字符串作为 CSS 透传。          |
| 圆角 | `none`、`0`、`1`、`2`、`3`、`4`、`rounded` | 来自圆角标尺的角半径。             | 始终                     | `3`    | `component:Skeleton` | 稳定   | TypeScript 拒绝其他值。        |
| 错峰 | 非负整数 `index`                           | 延迟脉冲，使连续的占位符产生涟漪。 | 始终                     | `0`    | `component:Skeleton` | 稳定   | 任何数字都会应用在延迟公式中。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                  | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | Skeleton 渲染一个无子元素的 `div`，携带 `skeleton` 目标，由 `width` 与 `height` 设置尺寸（数字为像素，字符串为 CSS），两者默认均为 `100%`。                                                                                                                                                                                                             | 当前源码与测试 |
| FR2 | `radius` 将 `none` 映射为无圆角，`0` 映射为 `--radius-none`，`1` 映射为 `--radius-inner`，`2` 映射为 `--radius-element`，`3` 与 `4` 映射为 `--radius-container`，`rounded` 映射为 `--radius-full`；默认值为 `3`。`radius` 与 `width`、`height` 一样属于调用点几何（AV2），并且不通过 themeProps 反映（`architecture:component-theming-surface` INV6）。 | 当前源码       |
| FR3 | 该块以 0.25 的不透明度绘制 `--color-skeleton`。在 `prefers-contrast: more` 下，它以该颜色向主文本色混合 30% 后绘制。在 `forced-colors: active` 下，它绘制 `GrayText`，该规则优先于对比度规则，在不运行脉冲时使用完全不透明度；当允许动态效果时，FR4 脉冲仍会改变其不透明度。                                                                            | 当前源码与测试 |
| FR4 | 该块以十个等长的保持步进将不透明度从 0.25 脉冲到 0.925 再返回，无限交替；每次上升与每次下降都采用主题设定的 `--duration-medium-max`，再由 `tempo` 缩放（`spec:AST-108` FR4），使用线性时间函数，不使用 `steps()`。脉冲在 1000 ms 加上 100 ms 乘以 `index` 后开始。在 `prefers-reduced-motion: reduce` 下没有脉冲。                                      | 当前源码与测试 |
| FR5 | `ref` 到达该块。受支持的 DOM、ARIA、data 与事件 prop，包括 `data-testid`，在默认 `aria-hidden` 之后到达该块；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                                                                                                                                                                              | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以通过 `skeleton` 更改该块的视觉属性，而不改变其解剖结构或无障碍排除。
- **AV2 — 形状。** 宽度、高度与圆角按调用点变化，以匹配它们所代替的内容。

### Representative states

| 状态         | 必需不变式                                                                                   | 允许变化     |
| ------------ | -------------------------------------------------------------------------------------------- | ------------ |
| 默认         | `aria-hidden` 块在 0.25 不透明度，一秒后脉冲。                                               | 尺寸与圆角。 |
| 错峰         | 每个块的脉冲在前一个索引之后 100 ms 开始。                                                   | 块的数量。   |
| 减少动态效果 | 静态块在 0.25 不透明度。                                                                     | —            |
| 强制颜色     | `GrayText` 块在完全不透明度且不运行脉冲；当允许动态效果时，FR4 脉冲会改变其不透明度（AR2）。 | —            |
| 由调用方暴露 | `aria-hidden={false}` 到达该块。                                                             | —            |

### Transformation and precedence order

- **ORD1 — 绘制。** 默认 skeleton 颜色 → 增强对比度混合 → 强制颜色 `GrayText`。
- **ORD2 — 属性。** `aria-hidden="true"` 与 `data-testid` → 组件类 → 组件样式 → `xstyle` → `className` → `style` → 调用方 prop。

### Performance and resources

- **PR1 — 主线程外的脉冲。** 脉冲只改变不透明度，且不使用阶跃时间函数，因此受支持的引擎可以在不触发主线程重绘的情况下运行它。Skeleton 不添加任何监听器、观察器或计时器。

## Accessibility contract

- **AR1 — 默认隐藏。** 该块为 `aria-hidden="true"`，因此辅助技术不会播报空的占位符；调用方可以传入 `aria-hidden={false}`。周围区域传达忙碌状态。
- **AR2 — 强制颜色与增强对比度绘制。** 占位符是装饰性的。在强制颜色模式下它绘制 `GrayText`，以便在浏览器会剥离其填充的情况下仍然可见，在不运行脉冲时使用完全不透明度；当允许动态效果时，FR4 脉冲仍会将其不透明度从 0.25 变为 0.925。在增强对比度下，其颜色向主文本色移动 30%。
- **AR3 — 减少动态效果。** 当读者要求减少动态效果时，脉冲被移除。

## Design relationships

| 解剖或状态 | 设计要求                         | 表示权威           | 层级角色 | 组件契约         |
| ---------- | -------------------------------- | ------------------ | -------- | ---------------- |
| 占位符     | 以柔和的脉冲预览加载内容的形状。 | 当前源码与公共文档 | 支撑     | FR1–FR4, AR1–AR3 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Placeholder": {"target": "skeleton"}
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有 `skeleton` 目标的目标资格。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR5 将其应用于该块。

## Verification map

| 契约          | 验证                                                                 | 代表性状态                                 | 变异或失败预期                                                                                                                                                                              | 审计章节                 |
| ------------- | -------------------------------------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1, FR5, AR1 | `Skeleton.test.tsx` 渲染与 a11y 测试                                 | 默认；调用方 `aria-hidden={false}`         | 移除该块、默认 `aria-hidden` 或调用方覆盖会导致失败。差距：没有测试覆盖 ref、默认 `100%` 尺寸或样式输入顺序。                                                                               | `audit:Skeleton/a11y`    |
| FR4, PR1, AR3 | `Skeleton.test.tsx` 脉冲套件                                         | 编译后的关键帧与时间                       | `steps()` 时间函数或更改不透明度步进会失败。差距：持续时间、仅不透明度的关键帧、起始延迟、按索引错峰以及减少动态效果的移除都没有自动化检查。                                                | `audit:Skeleton/motion`  |
| FR3, AR2      | `Skeleton.test.tsx` 强制颜色套件                                     | 强制颜色                                   | 从编译后的 CSS 中删除 `GrayText` 或完全不透明度覆盖会失败。差距：增强对比度混合，以及两个媒体特性同时适用时哪条规则获胜，都没有自动化检查；强制颜色渲染，包括其中的脉冲，未在浏览器中验证。 | `audit:Skeleton/a11y`    |
| FR1–FR3       | `Skeleton.stories.tsx` 的 Shapes 与 StaggeredList 测试夹具在浏览器中 | 圆角 `rounded`、`3`、`2`、`none`；错峰列表 | 差距：没有单元测试断言尺寸、圆角或增强对比度绘制，也没有固定 story 渲染圆角 `0`、`1` 或 `4` 或增强对比度模式；其他值仅在渲染的测试夹具中可见。                                              | `audit:Skeleton/layout`  |
| 主题解剖映射  | `scripts/check-knowledge.mjs`                                        | 规范解剖与当前目标                         | 缺失、多余、带前缀或过时的映射会导致仓库校验失败。                                                                                                                                          | `audit:Skeleton/theming` |
| AR1           | 无障碍树证据（`spec:AST-009` FR3）                                   | 默认与暴露的占位符                         | 差距：没有无障碍树检查证明该占位符不在树中；单元测试断言该属性。                                                                                                                            | `audit:Skeleton/a11y`    |

## Decision log

未记录。该记录描述已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
