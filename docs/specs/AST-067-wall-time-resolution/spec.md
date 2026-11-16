---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-067
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-14
phase: accepted
owners: [cixzhang]
affects_architecture: []
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Wall-clock time resolution system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/utils/plainDate.ts",
    "packages/lab/src/Schedule/**"
  ]
}
```

## Intent

在使用所选时区查看日期和时间的人（例如 Schedule 的一周或一天），会得到他们所请求的那些日期上的时刻，包括在夏令时或其他偏移变更跳过或重复一小时的日期上。Core 按照 Temporal 默认的 `"compatible"` 消歧规则，把命名时区中的日历日期和墙钟时间转换为一个时刻，因此 Astryx 与使用 Temporal 的代码在每个时刻上都一致。

## Non-goals

- 选择和检测时区，以及为展示而格式化时刻。
- 公历之外的其他日历，以及完全不涉及时区的日期运算。
- 把 Temporal 的其他消歧模式（`"earlier"`、`"later"`、`"reject"`）作为选项提供。
- 只要满足本契约，等价的内部实现仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议，以及 CI 作业/工作流拓扑，都属于架构或实现范畴，除非调用方或互操作系统有意将该确切机制作为公共协议依赖。若确实如此，须说明谁依赖它，以及为什么等价实现无法满足本契约。

## Requirements

- **FR1 — 每个日期和墙钟时间都对应一个时刻。** 来自 `@astryxdesign/core/utils` 的 `plainDateToInstant(date, timezoneID, hour, minute)` 必须对每个有效日期、墙钟时间和 IANA 时区都恰好返回一个时刻，包括被偏移变更跳过或重复的墙钟时间。`hour` 与 `minute` 默认为 0。
- **FR2 — 被跳过的墙钟时间向前解析。** 当偏移变更跳过某个墙钟时间时，结果必须是按变更前生效的偏移读取该墙钟时间所得到的时刻，也就是同一墙钟时间按间隙长度向前移动：在一个从 2:00 跳到 3:00 AM 的日期上，2:30 AM 解析为 3:30 AM。
- **FR3 — 重复的墙钟时间解析到其较早的一次出现。** 当偏移变更重复某个墙钟时间时，结果必须是它的第一次出现，并按变更前生效的偏移读取；在偏移为负的时区与偏移为正的时区中都是如此。
- **FR4 — 一天的开始落在该日。** 使用默认时间时，结果就是 FR2 或 FR3 对午夜所做的解析。当该时区观察到午夜，或其偏移变更始于午夜时，那就是该日期的第一个时刻：在该时区中回读得到同一日期，而早一毫秒的那个时刻属于前一个日期。若某日期被该时区整体跳过，则解析为间隙之后的第一个时刻，即下一个日期。

### Platform support

- 支持的 feature/engine 下限：Astryx 支持的每个 engine；时区规则来自引擎的 `Intl` 时区数据。
- 不支持的行为：引擎的 `Intl` 无法识别的时区标识符。
- 浏览器证据：不需要。这些需求是关于时刻的，由针对命名时区的工具函数测试来证明；绘制范围的组件保留其自身记录所要求的浏览器证据。

## Current-state impact

- `@astryxdesign/core/utils` 中的 `plainDateToInstant` 是受治理的 API。
- Lab `Schedule` 通过它把其周范围与日范围中的各天转换为时刻；`component:Schedule` 仍拥有“范围如何选择、如何布局”这一职责。
- `architecture:public-component-api` 仍拥有该工具函数的导出与兼容性职责。

## Verification

| Contract | Verification                                   | Representative states                                                                                                                                                                 | Mutation or failure expectation                                                  |
| -------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| FR1–FR3  | `plainDate.test.ts`                            | 从负偏移处被跳过的午夜（America/Santiago、America/Havana）；2:30 AM 的间隙（America/Los_Angeles）；30 分钟的间隙（Australia/Lord_Howe）；America/Havana 与 Europe/Berlin 中重复的小时 | 把间隙向后解析，或把重复的墙钟时间解析到其较晚的一次出现，会使这些时刻断言失败。 |
| FR4      | `plainDate.test.ts` 以及 Schedule 的周与日测试 | Santiago 与 Havana 的转换周与转换日，包括以被跳过的午夜结束的一周和一天；Pacific/Apia 跳过的一个日期（2011-12-30）                                                                    | 起始时刻落在前一个日期，会使日期往返失败，并使周与日视图的列数失败。             |

## Decision log

### DEC-1 — Core follows Temporal's "compatible" disambiguation

**引用：** `spec:AST-067/DEC-1`

**决策者：** `cixzhang`, 2026-10-14

一个被偏移变更跳过或重复的墙钟时间需要恰好一个答案，而 Astryx 与使用 Temporal 或 `Date` 构造函数的产品代码必须给出同一个答案；否则在一处计算、在另一处读取的范围会落在不同的日期上。Temporal 默认的 `"compatible"` 模式就是这个答案。该规则属于 Core，因为每个把日期转换为时刻的工具函数和组件都依赖它，而不只是 Schedule。

已否决：仅在 Lab Schedule 内部修正被跳过的午夜情形，因为这会让 Core 的工具函数对其他每个调用方都返回前一天的某个时刻。

## Open questions

无。
