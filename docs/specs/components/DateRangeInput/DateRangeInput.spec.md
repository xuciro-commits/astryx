---
schema_version: 3
template_version: 4
kind: component
id: component:DateRangeInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-14
owners: [cixzhang]
review_triggers: [theming]
verified_by:
  [
    packages/core/src/DateRangeInput/DateRangeInput.test.tsx,
    packages/core/src/DateRangeInput/DateRangeInput.calendar.test.tsx,
    packages/core/src/DateRangeInput/DateRangeInput.ssr.test.tsx,
    packages/core/src/Calendar/Calendar.calendarSystems.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/DateRangeInput/__tests__/DateRangeInputReflow.interaction.browser.spec.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:input-fields, family:overlay-dismissal]
design_specs: []
architecture: [architecture:component-theming-surface]
contributing: []
system_specs: [spec:AST-013/FR12, spec:AST-020, spec:AST-111]
---

# DateRangeInput component contract

## Intent

DateRangeInput 通过带标签的字段表面呈现一个受控的日期范围。它的触发器打开一个由 Calendar 支撑的 Popover，并可在该日历旁提供一组快速选择预设；当两者无法并排容纳时，这组预设位于日历上方。触发器文本和日历显示应用的日历系统，而范围保持公历 ISO 日期。

## Compatibility and migration

- 发布的默认行为保留：`yes`；DateRangeInput 的规范行为不变
- `calendar` prop 是新增的；它默认为 provider 的日历，否则为 `gregory`，因此没有 provider 日历的字段保留其公历文本。带 `-u-ca-` 关键字的 provider locale 保留公历日期（`spec:AST-111` DEC-2）；设置 `calendar` 可选择其一
- 0.7.0 移除了 `date-range-input-clear-icon` 别名；共享的清除字形仍可通过 `input-clear-icon` 使用
- 预设约束修正保持不变
- 受控/非受控行为：未变；DateRangeInput 仍为受控
- 迁移决策：用 `input-clear-icon` 和 `.astryx-input-clear-icon` 替换被移除的主题键与 CSS 类，或运行 `astryx upgrade --from 0.6.3 --apply --path .`

使用方迁移说明属于使用方文档和发行说明。

## Ownership boundary

**负责**

- 复合日期范围字段表面及其范围显示触发器。
- 可选的预设列表、每个预设动作，以及预设当前状态与禁用状态的反映。
- 将选定的 Calendar 范围或预设转换为 `onChange` 与 `changeAction` 输出。

**不负责 / 非目标**

- 标签、描述和状态呈现——由 `component:Field` 和 `component:FieldStatus` 负责。
- 日历网格渲染和日期单元格交互——由 `component:Calendar` 负责。
- 层的承载与关闭——由 `component:Popover` 和 `family:overlay-dismissal` 负责。
- 共享的清除按钮呈现——由 `component:Field` 负责。

## Public concepts

| 概念     | 封闭取值或状态                              | 含义                                           | 可用性            | 默认值                                                        | 所有者         | 稳定性 | 无效值行为                                                                                            |
| -------- | ------------------------------------------- | ---------------------------------------------- | ----------------- | ------------------------------------------------------------- | -------------- | ------ | ----------------------------------------------------------------------------------------------------- |
| calendar | 一个 `CalendarSystem`（`spec:AST-111` FR1） | 触发器文本和 popover Calendar 所显示的日历系统 | 触发器和 Calendar | provider 解析出的日历，否则为 `gregory`（`spec:AST-111` FR2） | `spec:AST-111` | stable | 解析为 `gregory` 并在开发环境警告一次；需要 `Temporal` 的日历在缺少 `Temporal` 的位置回退为 `gregory` |

本契约还记录了现有的预设列表结构及其新增的主题化表面。

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                        | 依据                                                               | 审查状态         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------- |
| FR1 | DateRangeInput 必须呈现受控的 `value`，并在不维护一个相互竞争的选择范围的情况下发出范围变更。                                                                                                                                                                                                                     | 当前源代码、文档和针对性测试                                       | 已验证的当前行为 |
| FR2 | 当存在预设时，每个预设仍是同一个带标签分组中的一个独立按钮；已应用的预设反映当前状态，而端点违反 `min`、`max` 或 `dateConstraints`，或范围违反 `minRangeSpan` 或 `maxRangeSpan` 的预设，反映禁用状态。                                                                                                            | 当前源代码、无障碍注释和针对性测试                                 | 已验证的当前行为 |
| FR3 | 预设组和每个预设按钮暴露稳定的主题目标；选中和禁用是预设按钮目标的状态，而不是独立的目标。                                                                                                                                                                                                                        | `architecture:component-theming-surface`；使用方对预设主题化的需求 | 已批准的新增契约 |
| FR4 | 添加主题目标不得改变这些元素已经拥有的 Popover、Calendar、按钮、焦点或选择语义。                                                                                                                                                                                                                                  | 组合边界与兼容性目标                                               | 已批准的新增契约 |
| FR5 | 当预设组与单月日历在层内无法并排容纳时，预设组堆叠在日历上方，每个月网格和月份导航都保持在层内（`spec:AST-020` FR1、WCAG 2.2 SC 1.4.10）。视觉顺序与 DOM 顺序一致。当它们能容纳时，预设保持在日历旁边。当内容高于层的视口上限时，它在层内滚动。                                                                   | `spec:AST-020` FR1；390 px、390 × 664 px 和 440 px 的重排检查      | 已验证的当前行为 |
| FR6 | 触发器文本、其无障碍名称和 popover Calendar 显示解析出的日历（`spec:AST-111` FR2、FR17）：触发器按该日历书写范围的每一端，当任一端落在当前日历年份之外时还带上年份，Calendar 则按日历月份排布。该字段没有键入式输入。`value`、`onChange`、`min`、`max`、预设和跨度边界始终为公历 ISO 日期（`spec:AST-111` FR3）。 | `spec:AST-111` FR3、FR17；当前源代码和日历测试                     | 已验证的当前行为 |

### Allowed variation

- **AV1 — 预设内容。** 调用方可以省略预设，或提供任意数量的带标签范围。
- **AV2 — Calendar 布局。** 日历月份数量、日期约束和范围边界可以变化，而不会改变预设目标的身份。
- **AV3 — 主题输出。** 主题可以重新设计预设组和按钮的样式，同时组件的按钮语义和状态保持不变。

### Representative states

| 状态           | 必需的不变式                                                                           | 允许的变化             |
| -------------- | -------------------------------------------------------------------------------------- | ---------------------- |
| Calendar       | 触发器文本和 Calendar 显示解析出的日历；值保持公历 ISO。                               | Calendar、locale、数字 |
| 无预设         | 不渲染预设组或预设按钮目标。                                                           | Calendar 配置          |
| 有预设、无匹配 | 每个按钮都携带预设目标，且无选中状态。                                                 | 预设数量和标签         |
| 已应用的预设   | 匹配的按钮携带 `aria-current="true"` 和该目标的选中状态。                              | 选中的范围             |
| 禁用的预设     | 违反端点日期约束或范围跨度约束的预设按 `spec:AST-085` 被禁用，并携带该目标的禁用状态。 | 约束来源               |

### Transformation and precedence order

- **ORD1 — 预设状态。** 对每个预设的范围只解析一次，将其与受控值比较，针对两个端点评估 `min`、`max` 和 `dateConstraints`，针对完整范围评估 `minRangeSpan` 和 `maxRangeSpan`，然后在同一个预设按钮目标上反映选中和禁用状态。
- **ORD2 — 预设激活。** 已启用的预设发出已经解析的范围；激活不会再次解析该预设。

端点约束与 Calendar 选择一致：它们适用于预设的起点和终点，而不是其间的每个日期。

### Performance and resources

不引入新的性能或资源约束。

## Accessibility contract

- **AR1 — 预设语义。** 预设仍是同一个带标签分组中的原生按钮，通过 Tab 独立导航。
- **AR2 — 当前状态。** 已应用的预设仍通过 `aria-current="true"` 暴露；主题状态反映是新增的。
- **AR3 — 禁用状态。** 违反端点日期约束或范围跨度约束的预设被禁用并保持可聚焦（`spec:AST-085`）；主题状态反映不会取代该行为。

实现缺口：在暗色模式下，已应用预设的标签在其柔和强调色填充上、于 popover 表面测得 3.88:1，低于 4.5:1。

## Design relationships

| 结构或状态   | 设计要求                                | 表示权威                 | 层级角色 | 组件契约         |
| ------------ | --------------------------------------- | ------------------------ | -------- | ---------------- |
| 字段表面     | 呈现一个连贯的输入边界。                | 当前源代码和输入字段族   | 突出     | FR1              |
| 日历 popover | 提供范围选择而不改变字段所有权。        | Popover 和 Calendar 组件 | 突出     | FR1、FR4         |
| 预设侧栏     | 将可选快捷选择分组放在日历旁边。        | 当前源代码和公开文档     | 辅助     | FR2、FR3         |
| 预设按钮     | 呈现一个快速选择范围及其当前/禁用状态。 | 当前源代码和公开文档     | 辅助     | FR2–FR4、AR1–AR3 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Label": {
    "delegatesTo": {"owner": "component:Field", "target": "field-label"}
  },
  "Field surface": {"target": "date-range-input"},
  "Trigger button": {
    "none": {
      "reason": "unsettled: The composite field surface has a target, but the inner range-display button has no separate current target."
    }
  },
  "Calendar icon": {"target": "date-range-input-toggle-icon"},
  "Calendar popover": {
    "delegatesTo": {"owner": "component:Popover", "target": "popover"}
  },
  "Preset sidebar": {"target": "date-range-input-presets"},
  "Preset button": {"target": "date-range-input-preset"},
  "Clear button": {
    "delegatesTo": {"owner": "component:Field", "target": "input-clear-button"}
  },
  "Status message": {
    "delegatesTo": {"owner": "component:FieldStatus", "target": "field-status"}
  }
}
```

## Family and system relationships

- `family:input-fields` 负责字段尺寸、状态放置、加载、禁用原因和结束控件几何。
- `family:overlay-dismissal` 负责 Popover 关闭栈。
- `architecture:component-theming-surface` 负责目标准入、状态反映和结构映射。
- `spec:AST-111` 负责日历选择、公历 ISO 值和 `Temporal` 边界；FR6 投影其 FR3 和 FR17。`component:Calendar` 负责日历中的 popover 网格。

### `spec:AST-013` FR12 exception — calendars that need `Temporal`

- **能力：** 触发器文本和 popover Calendar 在公历、佛历、民国历和日本历之外的日历中工作，这些日历需要运行时的 `Temporal`。
- **削减：** 在缺少 `Temporal` 的地方（如 macOS 和 iOS 上的 Safari），该字段显示公历日期并在开发环境警告一次，同时指明一个 polyfill（`spec:AST-111` FR5）。加载 `Temporal` polyfill 的应用可获得完整的日历。当服务器和浏览器使用的中国农历或檀纪历实现在某个月起点上不一致时，React 会在客户端再次渲染有差异的文本（`spec:AST-111` FR19）。
- **保留的义务：** `spec:AST-013` FR7 和 FR8，以及在中国农历和檀纪历该情形之外的 FR9。公历字段保留每一种交互、标签和公告，佛历、民国历和日本历文本在没有 `Temporal` 时也能工作。
- **证据：** 使用原生 `Temporal` 的真实 Chromium 和 Firefox，以及在移除 `Temporal` 的真实 Chromium、Firefox 和 WebKit 中，分别在有无 polyfill 的情况下，显示波斯语触发器文本。
- **所有者：** `nynexman4464`。
- **审查条件：** Safari 发布 `Temporal`。

## Verification map

| 契约              | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                | 代表性状态                                        | 变异或失败预期                                                | 审计小节                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ------------------------------- |
| FR1、FR2、AR1–AR3 | `DateRangeInput.test.tsx`；禁用预设的可聚焦性（AR3）有待一致性验证                                                                                                                                                                                                                                                                                                                                                                  | 无匹配、已应用预设、端点无效预设、跨度无效预设    | 语义或状态属性消失                                            | `audit:DateRangeInput/presets`  |
| FR3、FR4          | `DateRangeInput.test.tsx`、`themingTargets.test.ts`、生成的探测主题                                                                                                                                                                                                                                                                                                                                                                 | 分组目标、选中按钮、禁用按钮                      | 目标类/状态缺失、未记录，或被放在错误的元素上                 | `audit:DateRangeInput/theming`  |
| FR5               | `DateRangeInputReflow.interaction.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                  | 带预设和两个月的 390 px 页面；桌面页面            | 日历或其导航越过层边缘，或预设在其桌面宽度下离开日历一侧      | `audit:DateRangeInput/reflow`   |
| FR6               | `DateRangeInput.calendar.test.tsx`（“writes the trigger text and its accessible name in the Persian calendar”、“shows the year when the range leaves the current calendar year”、“opens a Persian popover calendar and reports Gregorian ISO dates”，以及没有 `Temporal` 的用例）；`Calendar.calendarSystems.test.tsx` 的“DateRangeInput opens its popover calendar in the calendar”；真实 Chromium、Firefox 和 WebKit 的触发器文本 | 波斯语、佛历、跨日历年度的一个范围、无 `Temporal` | 触发器文本或 Calendar 处于另一个日历，或出现非 ISO 值，即失败 | `audit:DateRangeInput/behavior` |
| 主题结构映射      | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                       | 所有已记录的结构                                  | 目标所有权或结构名称漂移                                      | `audit:DateRangeInput/theming`  |

## Decision log

### DEC-1 — Preset group and buttons are public theme anatomy

**参考：** `component:DateRangeInput/DEC-1`

**决策者：** cixzhang, 2026-09-14

可选的预设侧栏和每个快速选择按钮都是稳定的、使用方可识别的部分。`date-range-input-presets` 属于负责侧栏呈现的分组；`date-range-input-preset` 属于每个按钮，其中选中和禁用反映为状态而不是独立的目标。这些目标新增保留默认视觉效果和按钮语义；预设约束的执行遵循 FR2 和 ORD1–ORD2。

## Open questions

- **OQ1 — 内部的范围内显示触发器是否应拥有自己的目标，还是只由复合字段表面来代表？**（`human-api`）

## Content boundary

本文件不重复使用方的 prop 表、用法示例、Calendar 或 Popover 契约、当前审计结果，或下游主题实现。
