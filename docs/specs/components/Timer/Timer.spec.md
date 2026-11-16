---
schema_version: 3
template_version: 5
kind: component
id: component:Timer
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-22
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, react-runtime]
verified_by:
  [
    packages/core/src/Timer/Timer.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs:
  [
    spec:AST-002/DEC-1,
    spec:AST-037/DEC-1,
    spec:AST-037/DEC-2,
    spec:AST-037/DEC-3,
  ]
---

# Timer component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `Timer`、`TimerProps`、`TimerFormat`、可选的 `startTime` Unix 毫秒、`elapsed` 或 `clock` 格式、与 Timestamp 等价的 `type`、`size`、`color` 和 `weight`、`<time>` ref，以及 `BaseProps<HTMLTimeElement>`。 |
| Behavior                | 一个语义化时长使用标准化的秒到小时阶梯，并更新其拥有的 DOM 节点而无需 React 的滴答渲染；已用时长输出在一小时后降为分钟节奏。                                                                              |
| End-user impact         | 观察进行中工作的人能看到稳定、一致的时长，而不会有不必要的计时器工作与周围界面争抢资源。                                                                                                                  |
| Builder impact          | 零配置即可在挂载时启动，并沿用 Timestamp 的配套排版；调用方只需选择更早的起点、标准格式或标准排版覆盖。                                                                                                   |
| Compatibility/readiness | 首个增量发布，实现当前 `spec:AST-037`；不改变任何现有 API 或行为。                                                                                                                                        |
| Review checks           | 拒绝自定义格式化器/节奏、状态驱动的滴答、回调次数漂移、整点后仍按秒唤醒的已用时长、与 Timestamp 的排版偏离、资源泄漏、负数输出、丢失透传/ref 行为、未经请求的实时播报，或额外 anatomy/目标。              |
| Governing rules         | `spec:AST-037`；`architecture:public-component-api`；`architecture:react-component-runtime`；`architecture:component-theming-surface`。                                                                   |

此表是审查投影；以下正文具有权威性。

## Intent

Timer 是 `spec:AST-037` 的稳定 Core 投影。它为进行中的工作呈现标准化的已用时长，同时将时钟滴答保持在 React 的渲染生命周期之外。其排版表面与默认值与 Timestamp 一致，因此这两个时间内容组件的行为保持一致。

## Compatibility and migration

- 已发布默认值保持不变：`not yet released`
- 兼容性类别：增量组件与类型导出
- 受控/非受控行为：不适用
- 迁移决策：`spec:AST-037/DEC-1`、`spec:AST-037/DEC-2` 和 `spec:AST-037/DEC-3`

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 从挂载或有限的调用方起点计算已用时长。
- `elapsed` 与 `clock` 的表示阶梯及其可见精度。
- 一个 `<time>` 元素、其可见值、同步的 ISO 时长，以及计时器资源生命周期。
- 避免为时钟滴答产生 React 更新提交。
- 与 Timestamp 等价的 `type`、`size`、`color` 和 `weight` 行为。
- Text 包装层上的 `timer` 主题目标。

**不拥有 / 非目标**

- 加载指示器、等待文案、状态或可见性 —— 产品组合。
- 日期、相对日历语言、时区或绝对时刻 —— 由 Timestamp 负责。
- 暂停、继续、倒计时、截止时间、闹钟、计圈、亚秒精度、自定义格式化器，或调用方控制的调度节奏。
- 自动的 live-region 播报。

倒计时推迟到后续契约。标准格式化与调度辅助函数保持方向无关，因此该扩展无需替换当前格式 API。

## Public concepts

| Concept  | Closed values or states             | Meaning                                     | Availability | Default                                                                        | Owner             | Stability | Invalid-value behavior                   |
| -------- | ----------------------------------- | ------------------------------------------- | ------------ | ------------------------------------------------------------------------------ | ----------------- | --------- | ---------------------------------------- |
| 已用起点 | 挂载时间或有限的 `startTime`        | 已用时长的 Unix 毫秒起点                    | 始终         | 挂载时间                                                                       | `component:Timer` | 稳定      | 非有限值回退到挂载时间                   |
| 时长格式 | `elapsed`、`clock`                  | 紧凑单位或秒表记法                          | 始终         | `elapsed`                                                                      | `component:Timer` | 稳定      | 类型会拒绝其他值；运行时回退到 `elapsed` |
| 排版     | `type`、`size`、`color`、`weight`   | 与 Timestamp 相同的 Text 支撑表面与解析方式 | 始终         | Timestamp 默认值：supporting type、secondary color、由 type 推导的 size/weight | Timestamp/Text    | 稳定      | 既有的 Text 类型行为                     |
| 时间表面 | 带可见文本和 `dateTime` 的 `<time>` | 语义化已用时长以及 time 元素 props/ref      | 始终         | 客户端同步前为所选格式的零值和 `PT0S`                                          | `component:Timer` | 稳定      | Timer 拥有的 `dateTime` 优先             |

## Behavioral and layout contract

| ID   | Candidate invariant                                                                                                                                                                           | Basis                        | Draft review state |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ------------------ |
| FR1  | Timer 必须渲染一个 `<time>` 元素，其文本为所选格式，并带有匹配的非负 ISO 8601 时长。                                                                                                          | `spec:AST-037` FR1, FR3, FR5 | 已确定             |
| FR2  | 省略或非有限的 `startTime` 必须使用挂载起点；有限值必须使用该调用方起点。                                                                                                                     | `spec:AST-037` FR2           | 已确定             |
| FR3  | 滴答必须依据时钟与起点重新计算，直接更新所拥有的节点，并产生零次 React 更新提交。                                                                                                             | `spec:AST-037` FR3–FR4       | 已确定             |
| FR4  | Prop 变更必须在不重新挂载或不产生重复资源的情况下生效；每次 setup 都必须清理其资源。                                                                                                          | `spec:AST-037` FR6–FR7       | 已确定             |
| FR5  | `type`、`size`、`color`、`weight`、`xstyle`、`className` 和 `style` 必须在 Text 包装层上按 Timestamp 完全相同的方式解析；其他允许的 DOM、data、ARIA 和事件 props 以及 ref 必须到达 `<time>`。 | `spec:AST-037` FR8           | 已确定             |
| FR6  | Timer 默认不得添加 live-region 语义。                                                                                                                                                         | `spec:AST-037` FR9           | 已确定             |
| FR7  | 本组件的 Text 包装层必须恰好携带 `timer` 目标。                                                                                                                                               | `spec:AST-037` FR10          | 已确定             |
| FR8  | 初始标记必须使用所选格式的零值和 `PT0S`，且不得在渲染出的标记中暴露时钟读取。                                                                                                                 | `spec:AST-037` FR11          | 已确定             |
| FR9  | `elapsed` 与 `clock` 在一小时以下必须按秒边界更新；`elapsed` 在一小时及以上必须按分钟边界更新，而 `clock` 保持秒级精度。未来起点必须调度到其首个可见变化，而不是在零点每秒唤醒。              | `spec:AST-037` FR12          | 已确定             |
| FR10 | 当所表示的文本与时长未变时，Timer 应跳过 DOM 写入。                                                                                                                                           | `spec:AST-037` FR13          | 已确定             |

### Allowed variation

- **AV1 — Scheduling mechanism.** 私有的浏览器调度机制可以变更，只要 format-aware 节奏、时钟推导、无渲染滴答和完整清理仍然成立。
- **AV2 — Composition.** 调用方可以使用受支持的排版与样式输入，而不改变计时行为。

### Representative states

| State          | Required invariant                              | Allowed variation                    |
| -------------- | ----------------------------------------------- | ------------------------------------ |
| 初始 `elapsed` | 单个 `<time>` 上为 `0s` 和 `PT0S`               | 根 props 与样式                      |
| 初始 `clock`   | 单个 `<time>` 上为 `0:00` 和 `PT0S`             | 根 props 与样式                      |
| 秒/分钟        | `34s`、`2m 08s`、`0:34` 或 `2:08`，采用整秒语义 | 有限的已用时长值                     |
| 小时级         | 分钟节奏下为 `1h 02m`，或秒节奏下为 `1:02:33`   | 格式                                 |
| 延迟回调       | 追平时钟且不累积漂移                            | 延迟长度                             |
| Prop 更新      | 新起点或新格式在同一 `<time>` 上生效            | 父级渲染原因                         |
| 重放/卸载      | 每个获取的资源都被释放                          | 开发模式重放次数                     |
| 排版           | Timestamp 默认值或显式的 Text 家族覆盖          | 受支持的 type、size、color 和 weight |

### Transformation and precedence order

- **ORD1 — Resolve → calculate → clamp → floor to visible precision → format → write → schedule next visible boundary.** 将 `spec:AST-037` 中的流水线应用于可见文本与机器可读时长。
- **ORD2 — Timestamp styling split.** 排版、`xstyle`、`className`、`style` 和 `timer` 目标在 Text 包装层上组合。time 元素的 props 与 ref 在 `<time>` 上组合；`dateTime` 归 Timer 所有。

### Performance and resources

- **PR1 — No tick renders.** 推进时间产生零次 React 更新提交。
- **PR2 — One resource.** 每个已挂载的 Timer 最多拥有一个活动的计时器资源，且每次 setup 清理都会释放其资源。
- **PR3 — Visible cadence.** 一小时及以上的已用时长输出不会为隐藏的秒变化而唤醒；`clock` 输出保持秒级精度。
- **PR4 — Bounded writes.** 未变的所表示文本与时长不会被重写。

## Accessibility contract

- **AR1 — Semantic duration.** `<time>` 元素以其可见输出相同的精度暴露当前的非负 ISO 8601 时长。
- **AR2 — Quiet by default.** 不自动添加 role 或 `aria-live` 值；调用方有意设置的 ARIA 会透传。
- **AR3 — Perceivable text.** 格式化后的时长仍是真实文本内容。

## Design relationships

| Anatomy or state | Design requirement                                                              | Representation authority                   | Hierarchy role | Component contract      |
| ---------------- | ------------------------------------------------------------------------------- | ------------------------------------------ | -------------- | ----------------------- |
| 已用时间         | 一个稳定的行内时长，默认采用与 Timestamp 等价的配套排版，并支持标准 Text 覆盖。 | `spec:AST-037/DEC-1`, `spec:AST-037/DEC-3` | 配套           | FR1, FR3, FR5, AR1, AR3 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Elapsed time": {"target": "timer"}
}
```

## Family and system relationships

- Timer 与 Timestamp 是时间类的 Text 家族内容组件：Timer 拥有时长，Timestamp 拥有时刻。它们的排版 API 与默认值一致。
- `spec:AST-037` 拥有在此投影的公共行为、API、无障碍、性能与首次进入 Core 的决策。
- `architecture:public-component-api` 拥有导出、BaseProps、样式、ref 和调用方选择规则。
- `architecture:react-component-runtime` 拥有 Effect 与资源生命周期。
- `architecture:component-theming-surface` 拥有目标资格。

## Verification map

| Contract                    | Verification                                              | Representative states                                                  | Mutation or failure expectation                                                                                     | Audit section               |
| --------------------------- | --------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1–FR4, FR8–FR10, AR1, AR3 | `Timer.test.tsx` 的受控时钟测试                           | 初始格式、包含未来调度的起点变体、延迟回调、格式变更、秒/分钟/小时边界 | 状态滴答、回调累积、错误的阶梯/补零、负值、起点前的无谓唤醒、过期的语义、错误的节奏，或由时钟推导的初始标记都会失败 | `audit:Timer/behavior`      |
| FR3, PR1                    | React Profiler 提交次数测试                               | 多次滴答                                                               | 基于状态的实现会产生更新提交并失败                                                                                  | `audit:Timer/performance`   |
| FR4, PR2                    | 重渲染、StrictMode 与卸载下的资源监视器                   | setup、依赖变更、重放、清理                                            | 重复或泄漏的资源会使计数失败                                                                                        | `audit:Timer/resources`     |
| FR5                         | 公共导入、Timestamp 默认排版、覆盖、BaseProps 和 ref 测试 | 默认与显式排版、ref、事件、ARIA、class、style                          | 缺失导出、样式偏离或丢失输入都会失败                                                                                | `audit:Timer/api`           |
| FR6, AR2                    | 无障碍属性测试                                            | 默认与调用方有意设置的 ARIA                                            | 未经请求的实时语义或丢失的 ARIA 会失败                                                                              | `audit:Timer/accessibility` |
| FR7                         | `themingTargets.test.ts` 与 `scripts/check-knowledge.mjs` | 单个包装层目标                                                         | 缺失、多余或位置错误的目标会失败                                                                                    | `audit:Timer/theming`       |

## Decision log

无额外决策。此组件投影 `spec:AST-037`，未对其作任何扩展。

## Open questions

无。

## Content boundary

本文件不重复使用方示例、实现代码、私有调度机制、度量或系统规则。它以链接指向其所有者。
