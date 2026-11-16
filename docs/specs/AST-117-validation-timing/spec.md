---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-117
authority: current
archive_reason: null
superseded_by: null
approved_by: nynexman4464
approved_at: 2026-11-12
phase: accepted
owners: [nynexman4464]
affects_architecture: []
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs:
  [DateInput, DateTimeInput, TimeInput, NumberInput, FormLayout]
---

# Entry error behavior system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/DateInput/useTypedDate.ts",
    "packages/core/src/DateInput/DateInput.tsx",
    "packages/core/src/DateInput/NativeDateField.tsx",
    "packages/core/src/DateTimeInput/**",
    "packages/core/src/TimeInput/**",
    "packages/core/src/NumberInput/**",
    "packages/core/src/FormLayout/**",
    "packages/core/src/Field/useEntryErrorBehavior.ts",
    "packages/core/src/PowerSearch/PowerSearchValueEditor.tsx",
    "packages/core/src/Table/plugins/filtering/useTableFiltering.tsx",
    "packages/core/src/Pagination/Pagination.tsx"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, research, or project status (what is built so far, what goes first) in the record. A requirement gap reads `<FR or INV id> gap: <observable mismatch>`; one line such as `Status: in progress` may say the record is still in progress. See docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

自行校验输入内容的输入框，在构建者选定的时刻显示被拒绝的输入，这个时刻可以按整个表单确定，也可以按单个字段确定：或是输入框默认显示的时刻，或是仅当使用者用 Enter 提交输入、或离开字段时才显示的时刻。这样，一个在失焦时校验字段的表单，就能把输入框自身的拒绝保持到同一时刻。选择提交时刻时，可见的消息、无效状态与屏幕阅读器播报会一同出现，也一同清除。

## Members

该规则适用于 `family:input-fields` 中自行拒绝输入的四个成员：`DateInput`、`DateTimeInput`、`TimeInput` 与 `NumberInput`。`FormLayout` 为它们设置表单级默认值。自身不拒绝任何输入的成员不采用输入错误行为，例如 `TextInput`、`Selector`，以及 `DateRangeInput`，后者的日期只来自一个会禁用不可达日期的 Calendar。

## Non-goals

- 成员拒绝哪些输入、在 `'complete'` 下何时显示拒绝、拒绝具有哪些信号，以及提交对被拒绝输入的处理。这些归各成员的记录所有。
- 调用方校验。调用方的 `status`、`isRequired` 与表单库规则各自保持自己的时机；本记录只约束成员自身做出的拒绝。
- 浏览器中的原生约束校验，例如 `required` 与 `:invalid`。
- 拒绝的措辞。消息归各成员的记录与 `spec:AST-111` AR3 所有；消息的传达归 `spec:AST-086` 所有。
- 键入输入的 `onChange` 时机，它归各成员的记录所有（日期的时机见 `spec:AST-111` FR12）。
- 只要满足本契约，等价的内部实现仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议，以及 CI 作业/工作流拓扑，属于架构或实现，除非调用方或互操作的系统有意将该具体机制作为公共协议来依赖。在这种情况下，应说明谁依赖它，以及为什么等价实现无法满足契约。

## Public contract

```tsx
<FormLayout defaultEntryErrorBehavior="blur-or-enter">
  <DateInput label="Start" value={start} onChange={setStart} max="2026-12-31" />
  <NumberInput
    label="Seats"
    value={seats}
    onChange={setSeats}
    min={1}
    max={40}
  />
  <TimeInput
    label="Arrival"
    value={arrival}
    onChange={setArrival}
    entryErrorBehavior="complete" // this field's own prop wins
  />
</FormLayout>
```

```ts
type EntryErrorBehavior = 'complete' | 'blur-or-enter';
```

## Requirements

### Terms

- **拒绝** 是成员按其记录的定义对某项输入所做的自身否决：日历中不存在的日期、不可读或不完整的日期文本、无法解析的时间或数字、仅限整数的字段中出现的小数，以及超出 `min`、`max` 或 `dateConstraints` 的值。
- 拒绝的**信号**是其成员的记录为其规定的那些信号：可见的消息、`aria-invalid`、输入文本的无效样式，以及播报。
- **提交**是在字段中按 Enter，或是失焦，即焦点离开字段。

### Behavior

- **FR1 — 每个成员接受 `entryErrorBehavior`。** `DateInput`、`DateTimeInput`、`TimeInput` 与 `NumberInput` 接受一个可选的 `entryErrorBehavior`，取值为 `'complete'` 或 `'blur-or-enter'`。一个取值约束字段的每个表面与分段：键入的文本、原生控件，以及 `DateTimeInput` 的日期分段与时间分段。该值的类型导出为 `EntryErrorBehavior`。该属性决定成员何时显示自身的输入错误，也就是 `onEntryErrorChange` 在成员具备该回调时所报告的拒绝；在两种取值下，校验本身都在每次编辑时运行。
- **FR2 — 表单设置默认值，字段优先。** `FormLayout` 接受一个同类型的可选 `defaultEntryErrorBehavior`。成员按以下顺序确定自身行为：自身的 `entryErrorBehavior`，否则最近一层 `FormLayout` 的 `defaultEntryErrorBehavior`，否则 `'complete'`。`FormLayout` 提供该默认值的方式与提供 `defaultOptionality` 相同（`component:FormLayout` FR4）：嵌套的 `FormLayout` 为其后代替换该默认值，嵌套值为未设置的情况也算在内；在 `FormLayout` 内部打开的层中的内容初始时不带有该默认值（`spec:AST-038` FR7、FR8）。
- **FR3 — `'complete'` 是各成员已发布的行为。** 在 `'complete'` 下，成员按其记录所述的时刻与信号显示每次拒绝，本记录不改变其中任何一点。既没有 `entryErrorBehavior`、也没有 `FormLayout` 默认值的字段表现相同。
- **FR4 — `'blur-or-enter'` 将所有信号保持到提交。** 在 `'blur-or-enter'` 下，当使用者键入或编辑时，成员不显示、不标记、不设样式，也不播报自身的任何拒绝。在 Enter 或失焦时，成员显示该时刻输入所带的拒绝，其记录为该拒绝规定的所有信号一同出现，且播报只发生一次。原生日期或时间控件报告的取值，同样被保持到下一次 Enter 或失焦。向调用方报告拒绝的成员（如 `DateInput` 与 `DateTimeInput` 通过 `onEntryErrorChange` 所做的那样）在显示拒绝时才报告该拒绝，因此由该报告驱动的调用方 `error` 状态也在同一次提交时出现；已清除的拒绝会立即报告（FR5）。当成员的记录在该次提交时丢弃被拒绝的输入，成员在该次提交时播报一次该拒绝，然后按记录所述丢弃该输入。
- **FR5 — 一旦输入有效，拒绝立即清除。** 在两种取值下，使输入成为成员接受的值、或使输入变为空的编辑，会立即清除拒绝的信号，无需提交。在 `'blur-or-enter'` 下，仍使输入处于被拒绝状态的编辑会保留已显示的拒绝，且不再重复播报；下一次提交会显示该输入当前的拒绝。新的 `value`、或替换输入的选取操作（按成员的记录所述），会清除其拒绝。
- **FR6 — 锁定的字段不显示拒绝。** 当成员处于禁用状态，或在记录会阻止编辑的情况下处于忙碌状态时（`component:DateInput` FR12、`component:DateTimeInput` FR9 与 FR13），它不显示自身的拒绝（`spec:AST-085` FR2）。一旦它可编辑，其输入错误行为再次生效。记录保持其可编辑的忙碌成员，仍按其输入错误行为显示拒绝。
- **FR7 — 组合组件保持默认值。** `PowerSearch` 的值编辑器、Table 的筛选编辑器，以及 `Pagination` 的页码输入，都以 `'complete'` 渲染成员，且不暴露输入错误行为属性。包裹它们的 `FormLayout` 不改变这一点。

### Accessibility contract

- **AR1 — `'blur-or-enter'` 下提交之前没有任何信号。** 在 `'blur-or-enter'` 下，Enter 或失焦之前不标记、也不播报任何拒绝（FR4）。
- **AR2 — 每次显示的拒绝只播报一次。** 提交所显示的每次拒绝只播报一次，紧迫程度按 `spec:AST-086` FR5 对错误的取值；在显示消息的场合，播报的文字与显示的文字一致（`spec:AST-086` FR7）。
- **AR3 — 被丢弃的输入仍会得到解释。** 在 `'blur-or-enter'` 下，在提交时丢弃被拒绝输入的成员仍会播报原因（FR4），使使用者知道该输入未被接受（WCAG 2.2 3.3.1）。

### Compatibility

依据 `spec:AST-017` 对照最新稳定版本分类：

- `entryErrorBehavior` 与 `defaultEntryErrorBehavior` 是新的可选属性，其默认值 `'complete'` 就是各成员已发布的行为（FR3），因此两者都不设置的用法保持不变：属于新增（`spec:AST-017` FR5；`architecture:public-component-api` INV3）。
- `'blur-or-enter'` 只在调用方设置它的地方生效。它使 Enter 在 `TimeInput` 与 `DateTimeInput` 的时间分段中显示被保持的原生时间拒绝，而这些地方默认会立即显示拒绝：属于新增（`spec:AST-017` FR5）。

### Platform support

- 支持的功能/引擎下限：所有受支持的浏览器与渲染器。此处没有任何内容依赖能力检测。
- 不支持的行为：无。
- 浏览器证据：在两种取值下，对每次按键与每次提交时的每个信号做 DOM 与可访问性树断言；在真实浏览器中检查键入表面与原生表面上的失焦与 Enter 提交。

## Current-state impact

- `family:input-fields` 把输入错误行为列为规范概念，并新增 FR14 作为本记录的投影；其共享拥有者章节把表单级默认值赋予 `FormLayout`。
- `component:DateInput`、`component:DateTimeInput`、`component:TimeInput` 与 `component:NumberInput` 新增 `entryErrorBehavior`，并投影 FR1–FR6。
- `component:FormLayout` 在其属性与布局上下文中新增 `defaultEntryErrorBehavior`。
- 这五个组件的 `.doc.mjs` 文件记录这些属性、默认值与优先级，并说明该属性决定输入错误何时显示，而不是校验何时运行。

要求缺口：

- FR6 缺口：忙碌的 `TimeInput`（`isLoading` 或待处理的 `changeAction`）保持可编辑，但在空闲之前不显示自身的拒绝。

## Verification

| 契约     | 验证                                                                              | 代表性状态                                                                                                   | 变更或失败预期                                                                                      |
| -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| FR1, FR2 | 成员与 `FormLayout` 的渲染测试套件；类型测试                                      | 无属性；字段属性；表单默认值；两者同时设置且相互冲突；带值与不带值的嵌套布局；在表单内打开的 Dialog 中的字段 | 字段忽略自身属性、表单默认值压过字段、嵌套或分层中的字段保留外层默认值，或类型被放宽                |
| FR3      | 各成员现有的拒绝测试套件，分别在未设置属性与设置 `'complete'` 时运行              | 各成员记录所列的每一种拒绝                                                                                   | 任何信号出现的时刻或信号集合与未设置属性时不同                                                      |
| FR4      | 在 `'blur-or-enter'` 下逐次按键与提交的测试套件                                   | 各成员的每种拒绝；原生编辑；Enter 与失焦；成员在失焦时丢弃的输入                                             | 信号在 Enter 或失焦之前出现、各信号分散出现、播报重复，或被丢弃的输入未被播报                       |
| FR5      | 显示拒绝之后的编辑测试套件                                                        | 编辑为有效；编辑为空；编辑后仍被拒绝；调用方改变 `value`；日历选取                                           | 已修正的输入仍保留拒绝、在 `'blur-or-enter'` 下仍被拒绝的编辑清除拒绝或再次播报，或选取之后拒绝残留 |
| FR6      | 禁用测试套件，以及针对忙碌时阻止编辑的记录所做的忙碌测试套件                      | 先显示拒绝再禁用；忙碌期间保留草稿；保持可编辑的忙碌 TimeInput                                               | 锁定字段显示拒绝、忙碌的可编辑字段停止显示，或其行为在可编辑后不再生效                              |
| FR7      | `FormLayout` 内 `PowerSearch`、Table 筛选编辑器与 `Pagination` 页码输入的测试套件 | 在组合组件外层设置 `defaultEntryErrorBehavior="blur-or-enter"`                                               | 编辑器跟随表单默认值                                                                                |
| AR1–AR3  | 依据 `spec:AST-009` 的屏幕阅读器证据                                              | 在 `'blur-or-enter'` 下各成员的键入表面与原生表面                                                            | 拒绝在提交前被听到、被听到两次，或被丢弃的输入未得到解释                                            |

## Decision log

### DEC-1 — One option for every input that checks its own entries

**引用：** `spec:AST-117/DEC-1`

**决定者：** `nynexman4464`，`2026-11-11`

在失焦时校验字段的表单，需要让输入框自身的拒绝等到提交时再显示，而其他表单保留输入框自身的时机。一个选项，在所有会拒绝输入的成员上取相同的两个值，可以同时满足两者。其默认值为已发布的行为，正如新行为属性的默认值那样（`architecture:public-component-api` INV3）。在 `'blur-or-enter'` 下，该选项让消息、无效状态与播报一同保持；在两种取值下，一旦输入有效，拒绝立即清除。

已否决：以提交时机作为唯一行为，因为依赖输入框自身即时反馈的表单会失去该反馈。

### DEC-2 — The form sets the default, and the field wins

**引用：** `spec:AST-117/DEC-2`

**决定者：** `nynexman4464`，`2026-11-11`

表单对其所有字段遵循一种约定，因此 `FormLayout` 通过已经承载 `defaultOptionality` 的上下文传递该约定。需要其他行为的字段设置自己的属性。表单库在表单上设置校验时机；那些也按字段接受该设置的表单库会让字段胜出。

### DEC-3 — The name follows the behavior-prop rule

**引用：** `spec:AST-117/DEC-3`

**决定者：** `nynexman4464`，`2026-11-11`

选择组件如何响应输入的属性，命名为 `<thing>Behavior`（`architecture:public-component-api` INV2）。此处的对象是成员的输入错误，也就是 `onEntryErrorChange` 已经报告的拒绝，因此选项名为 `entryErrorBehavior`，表单默认值为 `defaultEntryErrorBehavior`，类型为 `EntryErrorBehavior`。其取值命名输入错误何时出现：`'complete'` 是成员已发布的时刻（FR3），`'blur-or-enter'` 是使用者离开字段或按下 Enter 的时刻。第二个取值同时命名两个触发条件，因为 Enter 无需移动焦点即可提交输入。

已否决：

- `validationBehavior`，因为 React Aria 用该名称指原生校验与 ARIA 校验之别，而且它暗示校验何时运行。
- `validateOn`、`validateTrigger` 与 `validationTiming`，因为它们暗示校验何时运行，并且违反 `<thing>Behavior` 规则。
- `errorBehavior` 与 `errorTiming`，因为它们还暗示可以控制调用方的错误；`errorTiming` 另外还违反该规则。
- 分开的 `'blur'` 与 `'enter'` 取值。若只有 Enter，从被拒绝的输入按 Tab 离开的人永远不会被告知，而电话号码键盘没有 Enter 键。若只有失焦，Enter 会在没有任何提示的情况下提交被拒绝的输入。
- `'commit'`，因为开发者会把它理解为保存或提交。
- `'eager'` 与 `'lazy'`，因为两者都没有命名其触发条件，而且表单库已经用它们表达其他含义。

### DEC-4 — Under `'blur-or-enter'`, a dropped entry is announced at its commit

**引用：** `spec:AST-117/DEC-4`

**决定者：** `nynexman4464`，`2026-11-11`

有些成员在失焦时丢弃被拒绝的输入，默认情况下它们会在使用者键入时播报该拒绝。在 `'blur-or-enter'` 下，该播报会等待，因此丢弃该输入的那次提交会播报它；否则输入会在没有一句说明的情况下消失（FR4）。

### DEC-5 — Compositions keep the default

**引用：** `spec:AST-117/DEC-5`

**决定者：** `nynexman4464`，`2026-11-11`

`PowerSearch` 与 Table 筛选把成员组合为筛选编辑器，`Pagination` 把一个成员组合为页码输入，它们都不是表单字段，因此表单的约定不适用于它们。它们保持 `'complete'`，且不接受属性（FR7）。`DateRangeInput` 没有可拒绝的键入输入。

### DEC-6 — A revealed entry error stays while the entry stays wrong

**引用：** `spec:AST-117/DEC-6`

**决定者：** `nynexman4464`，`2026-11-11`

在 `'blur-or-enter'` 下，一旦输入错误显示，使输入仍然有错的编辑会保留该错误且不再播报，直到输入变为有效或为空，或下一次提交显示其当前的错误（FR5）。若在每次编辑时隐藏它，使用者修正错误期间该错误就会闪烁。

## Open questions

无。
