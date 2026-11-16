---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-118
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
affects_consumer_docs: [DateInput, DateTimeInput, TimeInput, NumberInput]
---

# Rejected entry feedback system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/DateInput/useTypedDate.ts",
    "packages/core/src/Field/useEntryErrorReport.ts",
    "packages/core/src/Field/useValueReplacesEntry.ts",
    "packages/core/src/DateInput/DateInput.tsx",
    "packages/core/src/DateInput/NativeDateField.tsx",
    "packages/core/src/DateTimeInput/**",
    "packages/core/src/TimeInput/**",
    "packages/core/src/NumberInput/**"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, research, or project status (what is built so far, what goes first) in the record. A requirement gap reads `<FR or INV id> gap: <observable mismatch>`; one line such as `Status: in progress` may say the record is still in progress. See docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

当某个会校验自身输入的输入拒绝一条输入时，使用者只在一处得知这件事：以他们听得到的文字，以及在独立字段中看得见的文字；并且他们键入的内容会保留下来，以便改正。使用者尚未完成的输入永远不会被标记，因此单独一个 `-` 绝不会闪出错误。应用无需改动任何代码：已提交的值、`onChange` 以及表单提交的内容都保持现有行为。

## Members

该规则适用于 `family:input-fields` 中四个会自行拒绝键入或上报的输入的成员：`DateInput`、`DateTimeInput`、`TimeInput` 与 `NumberInput`。`FileInput` 也会拒绝输入——类型或大小不符的文件——并把它们从值中丢弃；但那些是被选中的文件，而不是键入或上报的输入，因此它不在本记录范围内。自身不拒绝任何输入的成员，例如 `TextInput`、`Selector` 与 `DateRangeInput`，同样不在本记录范围内。

## Non-goals

- 构建者为某个表单或字段选择把成员的拒绝保留到提交时，这一点由 `spec:AST-117` 以 `entryErrorBehavior` 拥有。
- InputGroup 内部的成员在何处显示状态。`component:InputGroup` FR1、`component:TextInput` FR1 与 `component:TimeInput` FR10 拥有它；FR5 规定分组内的拒绝如何被播报。
- 调用方校验。调用方的 `status`、`isRequired` 与表单库规则保持其含义；FR7 规定调用方状态与拒绝相遇时显示哪条消息。
- 浏览器中的原生约束校验，例如 `required` 与 `:invalid`。
- 拒绝的措辞。各成员的记录与 `spec:AST-111` AR3 拥有这些消息；`spec:AST-086` 拥有它们的送达。
- 提交对成员接受的输入做什么：提交、钳制还是清除，仍由各成员的记录拥有。
- 键入输入的 `onChange` 时机，由各成员的记录拥有（日期见 `spec:AST-111` FR12）。
- 满足本合约的等价内部实现仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议以及 CI 作业/工作流拓扑属于架构或实现，除非调用方或互操作系统有意把该确切机制作为公开协议依赖。在这种情况下，应说明谁依赖它，以及为什么等价实现无法满足该合约。

## Public contract

```ts
interface NumberInputEntryError {
  kind: 'unreadable' | 'fractional' | 'outOfRange';
  text: string; // the typed text
  value?: number; // the number the text names, for 'fractional' and 'outOfRange'
}

interface TimeInputEntryError {
  kind: 'unreadable' | 'outOfRange';
  text: string; // the typed text
  value?: ISOTimeString; // the time the text names, for 'outOfRange'
}
```

```tsx
<NumberInput
  label="Seats"
  value={seats}
  onChange={setSeats}
  isIntegerOnly
  min={1}
  max={40}
  onEntryErrorChange={setSeatsEntryError} // optional
  status={
    seatsEntryError?.kind === 'fractional'
      ? {type: 'error', message: 'Enter a whole number of seats'}
      : undefined
  }
/>
```

## Requirements

### Terms

- **值拒绝**是指拒绝一条读出来是成员不接受的值的输入：日历中不存在的日期；超出 `min`、`max` 或 `dateConstraints` 的日期、时间或日期时间；超出 `min` 或 `max` 的数字。
- **文本拒绝**是指拒绝一条读不出值的输入：无法识别或不完整的日期文本、无法解析的时间文本、无法解析的数字文本，以及仅限整数的字段中的小数。
- **提交**是指在该字段中按 Enter，或 blur，即焦点离开该字段。
- 当 FR1 如此规定时，一条输入是**完整**的。
- **独立字段**是指不在 InputGroup 内部的成员。

### Behavior

- **FR1 — 每种输入都有自己的完成时点。** 键入、粘贴与拖放的文本受到同样的判定。在 `entryErrorBehavior="complete"` 之下，成员在这些时点揭示其拒绝，而在 `'blur-or-enter'` 之下则在提交时揭示（`spec:AST-117` FR3、FR4）。
  1. 键入的日期按 `spec:AST-111` FR12 的定义是完整的：每个字段都存在，年份完整或是带纪元的纪元年份，没有分隔符拖尾，且最后一个字段无法再接受一位数字。只有回退读取器才读取的公历文本（`spec:AST-111` FR9）仅在提交时才完整。
  2. 当键入的时间具有小时、两位分钟数字，以及（当字段显示秒时）两位秒数字，并且在十二小时制文本中还有其日时段时，它是完整的；但小时读作 0 或 13 至 23 时除外。
  3. 键入的数字没有固定长度，因此仅在提交时才完整。当使用者键入时，`NumberInput` 无论草稿如何都不标记、不显示、不播报任何内容。提交时它揭示草稿的拒绝：无法解析的文本、仅限整数的字段中的小数，或在没有数字可以提交（`min` 大于 `max`）时超出范围的数字；超出普通范围的数字会被钳制并提交（`component:NumberInput` FR3），不会揭示任何内容。因此，无论 `entryErrorBehavior` 取哪个值，数字的拒绝都出现在提交时。
  4. 原生日期控件上报的值仅在提交时才完整：当使用者键入其年份时，该控件会把每个部分年份作为日期上报，例如 `0002-05-10`。
  5. 原生时间控件上报的值在该控件上报它时即为完整。
- **FR2 — 输入一旦完整，值拒绝就会出现。** 一旦输入完整，成员就揭示值拒绝，此时焦点仍在字段内。在完整之前就被提交的输入，会在提交时揭示其拒绝。
- **FR3 — 文本拒绝等到提交。** 读不出值的文本永远不算完整。当使用者键入时，成员既不把它标记为无效，也不播报它；其拒绝在提交时出现。
- **FR4 — 提交保留被拒绝的文本，绝不悄悄丢弃输入。** 对带有拒绝的键入文本按 Enter 或 blur，会把该文本保留在字段中并显示拒绝。已提交的值不变，`onChange` 不触发。表单提交的内容不变。在保留被拒绝的 `NumberInput` 或 `TimeInput` 草稿的 blur 之后，以及在对无法识别的 `DateInput` 或 `DateTimeInput` 日期文本按 Enter 或 blur 之后，一个隐藏输入承载调用方的 `name` 与已提交值的文本，而键入输入不承载任何内容：对 `NumberInput` 而言，是字段在最新稳定版上显示已提交数字的方式——字段未聚焦时为纯数字（`2.5`），聚焦时为纯的按区域格式化的数字（在 `de-DE` 中为 `2,5`）（`component:NumberInput` FR6）；而对 `TimeInput`、`DateInput` 与 `DateTimeInput` 的日期段而言，是字段显示已提交值的方式（`component:TimeInput` FR11、`component:DateInput` FR25、`component:DateTimeInput` FR8）。在其他所有情况下，在最新稳定版上承载 `name` 的输入仍承载它，表单提交它在那里提交的内容：不带 `formatValue` 的 `NumberInput` 的键入文本，或在 blur 之前由 Enter 提交的 `TimeInput` 草稿的键入文本，以及不完整的日期文本，或日历中不存在、或被 `min`、`max` 或 `dateConstraints` 排除的日期。带 `formatValue` 的 `NumberInput` 在任何情况下都从其隐藏输入提交已提交的数字，与它在那里一样。隐藏输入承载 `name`，直到使用者编辑所保留的文本，或有新的 `value` 或一次选择替换它；此后键入输入再次承载 `name`。调用方在与保留被拒绝文本的 Enter 或 blur 同一次更新中传入的 `value`——正如在该提交时恢复自己值的调用方所做的那样——不会替换所保留的文本：文本、其拒绝与其消息都保留，而之后的新 `value` 会替换它（DEC-14）。Enter 或 blur 所保留的无法识别的日期文本，对 `component:DateInput` FR16 与 `component:DateTimeInput` FR10 而言不是待处理的键入文本：在没有编辑的情况下下一次按 Enter 会提交外围表单，而隐藏输入提交已提交的日期。没有任何成员会回退被拒绝的文本。原生日期或时间控件在 blur 时恢复已提交值，因为它自己的值就是表单提交的内容：一个在 blur 之前由 Enter 提交的表单，提交的是该控件所持有的值。它的拒绝保持揭示，连同 FR5 赋予它的每一项信号，正如 FR6 所述，因此该恢复绝不是无声的。空输入不是拒绝：提交会清除它或恢复已提交值，正如各成员的记录所述。`NumberInput` 在提交时钳制超出其范围的数字（`component:NumberInput` FR3），因此那种拒绝在提交时结束。
- **FR5 — 拒绝是一条可见消息，其各项信号同步变化。** 在独立字段中，出现的拒绝把它的消息作为字段的错误状态显示，位于字段的状态位置，并通过 `aria-describedby` 与控制关联，除非 FR7 在该位置显示调用方状态；它把控制设为 `aria-invalid="true"`；并只播报一次（`spec:AST-086` FR1、FR6、FR7）。输入文本的任何无效样式也随之出现。这些之中没有任何一项先于其他项出现，也没有任何一项在其他项清除之后仍保留。在 InputGroup 内部，成员不显示自己的状态，分组只显示它自己的 `status`，正如 InputGroup、TextInput 与 TimeInput 的记录所述；在那里，拒绝会设置 `aria-invalid`，并通过字段的 alert 只播报一次。已显示的状态会自行播报，而字段的 alert 只承载没有任何已显示状态播报过的消息：在 InputGroup 内部，以及 FR7 以调用方状态代替字段消息之处。当 `DateTimeInput` 的两个段都持有拒绝时，字段的状态显示日期段的消息，因为它排在前；时间段的拒绝把 `aria-invalid` 设在它的输入上，并通过字段的 alert 只播报一次。
- **FR6 — 已显示的拒绝在输入有效时立即清除。** 使输入成为成员接受的值的编辑，或清空它的编辑，会立即清除拒绝，无需提交。使输入仍被拒绝或不完整的编辑会保留已显示的拒绝，且不再播报它。下一次提交，或下一条完整的输入，会以输入当前的拒绝替换它：变化的消息，例如把一条完整但错误的输入编辑成另一条时，只播报一次，而同一条消息不会再次播报。调用方传入的新 `value`，或从 `Calendar`、sheet 面板或原生选择器中选中的成员接受的日期或时间，会替换该输入并清除其拒绝，但调用方在与保留该输入或其拒绝的 Enter 或 blur 同一次更新中传入的 `value` 除外，后者让该输入与其拒绝保持原样（FR4、DEC-14）。
- **FR7 — 调用方状态绝不把拒绝藏在警告之后。** 在任何成员上，无论是否带 `onEntryErrorChange`，调用方的 `warning` 或 `success` 状态绝不替换拒绝的消息；而不带消息的调用方 `error` 状态保留字段的消息。在 `NumberInput`、`TimeInput` 与 `DateTimeInput` 的时间段上，带消息的调用方 `error` 状态显示在字段消息的位置，无论是否有回调。在 `DateInput` 与 `DateTimeInput` 的日期段上，只有在带 `onEntryErrorChange` 时它才显示在字段消息的位置；没有回调时，只要被拒绝的文本仍在，字段的消息就显示在调用方任何 `status` 的位置，正如它们的记录所述。当调用方 `error` 状态显示在字段消息的位置时，只要拒绝仍在，`aria-invalid` 就保持设置。没有回调时，字段的 alert 只播报拒绝自己的消息一次；有回调时，被播报的是调用方的消息，而在未变化的调用方 error 消息之下开始的拒绝不会改变任何状态，因此字段的 alert 只播报那条消息一次。
- **FR8 — `NumberInput` 与 `TimeInput` 上报它们的拒绝。** 两者各自接受一个可选的 `onEntryErrorChange`，每当字段所揭示的拒绝发生变化时，它就会收到一个 `NumberInputEntryError` 或 `TimeInputEntryError`，而在拒绝结束时收到 `null`。对于不是数字或时间的文本，`kind` 是 `unreadable`；对于仅限整数的 `NumberInput` 中的小数，是 `fractional`；对于超出 `min` 或 `max` 的时间，或在 `min` 高于 `max` 时的数字（FR1），是 `outOfRange`；`text` 是键入的文本；对于 `fractional` 与 `outOfRange`，`value` 是文本所指的数字或 ISO 时间。键入、Enter、blur、新的 `value`、`min`、`max` 或 `isIntegerOnly`，以及会隐藏拒绝的禁用，各自都上报一次已变化的拒绝；调用方在与保留拒绝的 Enter 或 blur 同一次更新中传入的 `value` 不改变任何拒绝，因此它什么都不上报，也不上报 `null`（FR4、DEC-14）；未变化的拒绝绝不再上报；在已上报的拒绝仍存在时卸载的字段会上报 `null`。`TimeInput` 的原生与 sheet 面板表面不接受键入文本，因此它们从不上报。
- **FR9 — Enter 提交每个键入字段。** 在每个成员的键入字段中按 Enter 都是一次提交，因此它在那里揭示文本拒绝。在 `TimeInput` 与 `DateTimeInput` 的时间段中，它在该提交之外不被阻止，因此外围表单与从任何文本字段提交一样地提交：有效草稿在键入时就已经提交，而被拒绝的草稿不改变任何值。当时间段的预设时间列表打开时，Enter 从中选取键入的或高亮的时间，且不提交。
- **FR10 — 禁用与忙碌的字段不揭示拒绝。** 当成员被禁用或忙碌时，它不揭示自己的任何拒绝，正如其记录所述（`spec:AST-085` FR2），并上报 `null`（FR8）。在锁定期间保留键入文本的成员，例如 `DateInput` 与 `DateTimeInput` 的日期段（`component:DateInput` FR12），在它重新可编辑之后会再次揭示并上报该文本的拒绝。`NumberInput` 与 `TimeInput` 在被禁用时丢弃草稿（`component:NumberInput` FR9、`component:TimeInput` FR9），因此不会有拒绝重新出现。

### Accessibility contract

- **AR1 — 无误报。** 未完成的输入不产生任何播报，也不产生无效状态（FR1–FR3）。
- **AR2 — 每个拒绝只播报一次。** 出现的每个拒绝只播报一次，紧急性按 `spec:AST-086` FR5 为错误规定的方式（FR5、FR7）。
- **AR3 — 不只靠颜色。** 在独立字段中，拒绝是一条可见消息，通过 `aria-describedby` 与控制关联，绝不只是文本颜色（WCAG 2.2 1.4.1、3.3.1）。在 FR7 以其代替的位置显示调用方 `error` 状态之处，该状态就是可见消息，拒绝会被播报并设置 `aria-invalid`。在 InputGroup 内部，拒绝会被播报并设置 `aria-invalid`，而成员自己的可见消息是 InputGroup 记录所拥有的一处缺口。
- **AR4 — 不会有任何内容被悄悄丢弃。** 提交会把被拒绝的文本连同其消息一并保留，而恢复其已提交值的原生控件会让拒绝保持揭示（FR4），因此使用者总能得知某条输入未被接受（WCAG 2.2 3.3.1）。

### Compatibility

本记录中的每项改动都在不设置任何 prop 的情况下生效，它们合起来是 `spec:AST-017` FR53 之下的一次无障碍行为修复：其目的是让 `DateInput`、`DateTimeInput`、`TimeInput` 与 `NumberInput` 符合 WCAG 2.2 1.4.1（Use of Color）与 3.3.1（Error Identification），两者均为 Level A。`spec:AST-017` FR3 把为无障碍符合性而对已记录交互或无障碍行为所做的改动送交给 FR53。

- 该修复以补丁 `[fix]` 形式发布，附一条发布说明行，其 Changeset 命名旧行为与新行为以及这两项成功标准。
- 它不需要应用层代码改动。既有 prop、类型、导出、token 与已记录用法继续可用；已提交的值与 `onChange` 不变；表单提交的内容不变，因为凡是最新稳定版会回退被拒绝文本之处，都有隐藏输入承载已提交值的文本，而在其他位置，在发布版上承载 `name` 的输入仍承载它（FR4）；并且 `NumberInput`、`TimeInput` 与 `DateTimeInput` 的时间段仍会保留带消息的调用方 `error` 状态，显示在它们自己的消息之上（FR7）。
- `onEntryErrorChange` 及其 `NumberInputEntryError` 与 `TimeInputEntryError` 类型是可选的公开表面，FR53 按公开新增的规则予以接纳（`spec:AST-017` FR5）。没有任何东西被移除、重命名或收窄。
- 它在最新稳定版上取代的行为：
  - 被拒绝的 `NumberInput` 或 `TimeInput` 草稿只以次要颜色文本显示，其消息只到达一个 assertive 的视觉隐藏区域，而 blur 会在没有消息的情况下把它回退。`component:NumberInput` AR2 为满足 WCAG 3.3.1 依赖那个隐藏的 alert。
  - 无法识别的 `DateInput` 与 `DateTimeInput` 日期文本，以及原生日期或时间控件中超出范围的编辑，也做同样的事；原生控件在 blur 时恢复其已提交值并丢弃拒绝。
  - 它们每一个还会在每次按键时标记并播报未完成的输入，例如单独一个 `-`。
- 它在全部四个成员中发布的行为：在独立字段中，一条通过 `aria-describedby` 与字段关联的可见消息（FR5、FR7）；被拒绝的文本在提交时保留在字段中且永不回退，原生恢复会让其拒绝保持揭示（FR4）；并且输入未完成时不产生无效状态或 alert，无法识别的文本在提交时揭示（FR1–FR3）。`NumberInput` 在提交时揭示每一种拒绝，在使用者键入时什么都不揭示。
- 有两处提交会提交被拒绝的文本，与它们在最新稳定版上一样：不完整的日期文本，或日历中不存在、或被其边界排除的日期，`DateInput` 与 `DateTimeInput` 在 blur 之后保留它们；以及不带 `formatValue` 的 `NumberInput`，或在 blur 之前就由 Enter 提交的 `TimeInput` 草稿（FR4、DEC-13）。
- 作为同一修复的一部分，应用所选择的两处界面会改变：
  - 带有调用方 `warning` 或 `success` 状态的 `NumberInput`、`TimeInput` 或时间段，在拒绝存在时显示拒绝的消息以代替该状态，因为被标记为无效的字段必须说明原因（WCAG 2.2 3.3.1），正如 `DateInput` 已经做的那样（FR7）。
  - 无法识别的 `DateInput` 与 `DateTimeInput` 日期文本在提交时保留，其消息在它保留期间替换调用方的 `status`，遵循已发布的 `DateInput` 规则——字段自己的消息胜出；在最新稳定版上该文本会回退，调用方的状态保持显示（FR4、FR7）。

### Platform support

- 支持的功能/引擎下限：所有受支持的浏览器与渲染器。此处没有任何内容受能力检查限制。
- 不支持的行为：无。
- 浏览器证据：针对错误状态、`aria-invalid`、`aria-describedby` 与 live region 文本，在每次按键与提交时、独立与 InputGroup 内部、带与不带调用方 `status` 的情形下断言 DOM 与无障碍树；在真实浏览器中检查原生日期控件在键入年份时上报的部分年份、blur 时的原生恢复，以及 blur 与 Enter 在键入表面上提交、`TimeInput` 与 `DateTimeInput` 时间段中的 Enter 仍会提交其表单。

## Current-state impact

- `family:input-fields` 增加 FR15，它是本记录的一个投射。
- `component:DateInput` FR25、`component:DateTimeInput` FR16、`component:TimeInput` FR14 与 FR15，以及 `component:NumberInput` FR15 与 FR16 投射 FR1–FR10，而那些描述回退、按键 alert，或仅靠颜色显示的拒绝的行指向它们。`component:NumberInput` FR6、`component:TimeInput` FR11、`component:DateInput` FR25 与 `component:DateTimeInput` FR8 在 blur 保留被拒绝草稿之后，或在 Enter 或 blur 保留无法识别的日期文本之后，从隐藏输入提交已提交值的文本。`component:DateTimeInput` FR16 在两个段都持有拒绝时显示日期段的消息。`component:NumberInput` 与 `component:TimeInput` 增加 `onEntryErrorChange` 及其输入错误类型。`spec:AST-117` 的投射，`component:NumberInput` FR14、`component:TimeInput` FR13、`component:DateInput` FR24 与 `component:DateTimeInput` FR15，在这些投射所规定之处于 `'complete'` 下揭示拒绝，并在 `'blur-or-enter'` 下保留被拒绝的文本。
- 这四个组件的 `.doc.mjs` 文件描述拒绝何时显示、被拒绝的文本在提交时保留，以及哪条消息胜过调用方的 `status`；`NumberInput` 与 `TimeInput` 的文档描述 `onEntryErrorChange`。

需求缺口，每一处都是 WCAG 2.2 Level A 的不符，除非另有说明，均由 FR53 修复：

- AR3 缺口（WCAG 2.2 3.3.1），不在本次修复范围内：在 InputGroup 内部，成员自己的拒绝会被播报并设置 `aria-invalid`，但不显示任何可见消息。

## Verification

| Contract | Verification                              | Representative states                                                                                                                                                                        | Mutation or failure expectation                                                                              |
| -------- | ----------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| FR1      | 每种输入的完整性单元用例                  | 按 `spec:AST-111` FR12 的日期；`1:3`、`1:30`、`1:30 PM`、`13:30` 在 12 小时制与 24 小时制字段中；键入时与提交时配合 `max={100}` 的 `-`、`1a`、`150`；`0002-05-10`                            | 未完成的输入被算作完整，或一条完整的输入被拖延                                                               |
| FR2, FR3 | 逐键测试套件                              | 每个成员的每种值拒绝与文本拒绝；原生日期年份键入；粘贴的文本                                                                                                                                 | 拒绝在输入完整之前出现、文本拒绝在键入时出现，或完整的值拒绝被拖延                                           |
| FR4      | Enter 与 blur 测试套件；原生表单提交      | 每种拒绝类型；空输入；超出边界的 `NumberInput`；在十进制逗号区域设置中保留的 `NumberInput` 草稿，分别在聚焦与未聚焦时提交；原生恢复；在每种被保留的拒绝上按 Enter 之后与 blur 之后提交的表单 | 文本被回退或提交、`onChange` 被触发、表单提交的内容与 FR4 所述不同、原生恢复丢掉了它的拒绝，或一次钳制被上报 |
| FR5, FR7 | 无障碍树与 live region 断言               | 独立字段、水平标签；InputGroup（仅 alert）；每种状态位置；无调用方 `status`；`error`、`warning` 与 `success` 状态；有回调或无回调                                                            | 各项信号分开出现或分开清除、`warning` 或 `success` 状态隐藏了拒绝、错误的消息胜出，或播报重复                |
| FR6      | 显示拒绝之后的编辑测试套件                | 编辑为有效；编辑为空；编辑为不完整；编辑为另一种拒绝；调用方 `value` 变化，以及在每个保留该输入的提交时的一个变化；日历选择                                                                  | 已修好的输入保留其拒绝、不完整的编辑清除了它或再次播报它，或一次选择让它保留                                 |
| FR8      | `NumberInput` 与 `TimeInput` 回调测试套件 | 每种类型；通过键入、新的 `value` 或新的边界结束的拒绝；禁用；卸载；未变化的拒绝；原生与 sheet 面板表面                                                                                       | 上报缺失、重复上报未变化的拒绝、携带错误的 `kind` 或 `value`，或来自没有键入文本的表面的上报                 |
| FR9      | 表单中的 Enter 测试套件                   | 带被拒绝草稿、有效草稿与无草稿的 `TimeInput` 与 `DateTimeInput` 时间段；预设时间列表打开                                                                                                     | Enter 对被拒绝的草稿不揭示任何内容、关闭的时间字段阻止表单提交，或在打开的列表中按 Enter 却提交              |
| FR10     | 禁用与忙碌测试套件                        | 显示拒绝后禁用；忙碌期间保留的 DateInput 文本；禁用时的 `NumberInput` 草稿                                                                                                                   | 被锁定的字段揭示或上报拒绝、保留的 DateInput 文本在可编辑后失去其拒绝，或被丢弃草稿的拒绝重新出现            |
| AR1–AR4  | `spec:AST-009` 下的屏幕阅读器证据         | 每个成员、键入与原生、独立与分组、带与不带调用方 `status`                                                                                                                                    | 未完成的输入被播报、拒绝被听到两次，或一次提交丢弃了一条输入而没有消息                                       |

## Decision log

### DEC-1 — An unfinished entry is never flagged

**Reference:** `spec:AST-118/DEC-1`
**Decider:** `nynexman4464`, `2026-11-11`

表单指引建议不要标记使用者尚未完成的输入，并允许在定长输入被完整键入之后检查它。字段在输入未完成时不标记也不播报任何内容，因此单独一个 `-` 绝不会闪出错误（FR1–FR3）。

已否决：把键入中的停顿当作完成，因为其时序因人以及因辅助技术而异。

### DEC-2 — A date or time completes when every field is present

**Reference:** `spec:AST-118/DEC-2`
**Decider:** `nynexman4464`, `2026-11-11`

键入的日期与时间有一组固定的字段，因此当每个字段都存在时它们就是完整的。原生日期控件在键入年份时会上报部分年份，因此它的值仅在提交时才完整（FR1）。DEC-12 涵盖数字。

### DEC-3 — Text that is not a value waits for commit and then stays

**Reference:** `spec:AST-118/DEC-3`
**Decider:** `nynexman4464`, `2026-11-11`

无法识别的文本永远不完整，因此它等待提交。若一次提交将其丢弃，就会在没有任何消息的情况下丢弃使用者的输入，因此提交保留它并说明原因（FR3、FR4）。

### DEC-4 — Every rejection is a visible message

**Reference:** `spec:AST-118/DEC-4`
**Decider:** `nynexman4464`, `2026-11-11`

只被播报、或只给文本着色的拒绝，会让有视力的使用者得不到原因，而让屏幕阅读器使用者得到别人看不见的词语。在独立字段中，字段的错误状态为所有人承载原因，其播报就是那唯一一次播报（FR5）。DEC-10 涵盖 InputGroup 内部的成员。

### DEC-5 — A caller error status keeps each member's precedence

**Reference:** `spec:AST-118/DEC-5`
**Decider:** `nynexman4464`, `2026-11-11`

`NumberInput`、`TimeInput` 与 `DateTimeInput` 的时间段在它们自己的消息之上显示调用方 `error` 状态，而 `DateInput` 在调用方的消息之上显示自己的消息，与它们在最新稳定版上的做法一致。`onEntryErrorChange` 把拒绝交给 `NumberInput` 与 `TimeInput`，因此想要自己措辞的应用可以把它作为 `error` 状态传入（FR7、FR8）。DEC-8 指明会改变的两处界面。

### DEC-6 — Enter commits `TimeInput` and still submits the form

**Reference:** `spec:AST-118/DEC-6`
**Decider:** `nynexman4464`, `2026-11-11`

Enter 揭示被拒绝草稿的消息，而字段在该提交之外不再阻止它，因此从 `TimeInput` 提交表单与从任何文本字段提交一样。有效草稿在键入时就已经提交，被拒绝的草稿提交其键入文本，与最新稳定版一致（FR4、FR9）。`DateTimeInput` 的时间段在其预设时间列表之外遵循同一规则。

### DEC-7 — A shown rejection stays until the entry is valid

**Reference:** `spec:AST-118/DEC-7`
**Decider:** `nynexman4464`, `2026-11-11`

拒绝在输入被修好的那一刻清除，因此修正会立即得到认可。使输入仍然错误的编辑并不会让拒绝变得不实，因此拒绝保留且不再播报。变化的消息是新信息，因此只播报一次（FR6）。

### DEC-8 — These changes are one accessibility behavior fix

**Reference:** `spec:AST-118/DEC-8`
**Decider:** `nynexman4464`, `2026-11-11`

每项改动都让这四个成员在独立字段中满足 WCAG 2.2 1.4.1 与 3.3.1，且都不需要应用改动代码，因此它们作为 `spec:AST-017` FR53 之下的一个补丁一起发布。调用方 `error` 状态在 `NumberInput` 与 `TimeInput` 上保留其位置（DEC-5），表单提交的内容不变（DEC-13）。作为修复的一部分，应用所选择的两处界面会改变：`warning` 或 `success` 状态让位于拒绝的消息（DEC-11），无法识别的 `DateInput` 文本在提交时保留，其消息位于调用方状态的位置，正如字段消息在那里本就胜出。

### DEC-9 — A native control restores its value and keeps the rejection

**Reference:** `spec:AST-118/DEC-9`
**Decider:** `nynexman4464`, `2026-11-11`

原生日期或时间控件自己的值就是表单提交的内容，因此被拒绝的日期或时间不能留在其中。控件在 blur 时恢复已提交值，并保留拒绝的消息、`aria-invalid` 与播报，因此该恢复会说明原因（FR4）。

### DEC-10 — A grouped member announces its rejection

**Reference:** `spec:AST-118/DEC-10`
**Decider:** `nynexman4464`, `2026-11-11`

在 InputGroup 内部，分组拥有唯一可见的状态，其记录不给成员自己的消息框。分组内成员的拒绝会被播报并设置 `aria-invalid`；那里的可见消息属于 InputGroup 记录（FR5、AR3）。

### DEC-11 — A warning or success status never hides a rejection

**Reference:** `spec:AST-118/DEC-11`
**Decider:** `nynexman4464`, `2026-11-11`

被标记为无效却写着“Looks good”的字段没有指明任何错误，这违反 WCAG 2.2 3.3.1，因此在任何成员上、无论是否带 `onEntryErrorChange`，调用方 `warning` 或 `success` 状态绝不替换拒绝的消息，正如 `DateInput` 已经做的那样（FR7）。

### DEC-12 — A typed number is complete only at commit

**Reference:** `spec:AST-118/DEC-12`
**Decider:** `nynexman4464`, `2026-11-11`

数字没有固定长度，因此在 Enter 或 blur 之前的任何时刻都不能说它已完成。`NumberInput` 在提交时揭示键入数字的拒绝，在使用者键入时什么都不揭示，正如 React Aria 的 NumberField 在使用者提交该值时（通常是 blur 时）显示校验（FR1）。

已否决：把“在其末尾键入任何数字都无法让它落入范围”的数字算作完整，因为该测试复杂，且在负数与小数上容易出错。

### DEC-13 — What a form posts does not change

**Reference:** `spec:AST-118/DEC-13`
**Decider:** `nynexman4464`, `2026-11-12`

表单提交的内容与它在最新稳定版上提交的内容相同。在发布版于提交时回退被拒绝文本之处，成员保留该文本，并由隐藏输入承载调用方的 `name` 与已提交值的文本——发布版在文本回退之后提交的正是后者。在其他位置，在发布版上承载 `name` 的输入仍承载它，并提交它在那里提交的内容。没有任何提交值改变，因此该改动仍是 `spec:AST-017` FR53 之下的无障碍行为修复（FR4）。

已否决：在所有情况下都提交已提交值的文本，因为这会改变已发布表单提交的内容，而 `spec:AST-017` FR1 将其归类为破坏性改动。

### DEC-14 — A value passed at a commit that keeps the entry keeps it

**Reference:** `spec:AST-118/DEC-14`
**Decider:** `nynexman4464`, `2026-11-12`

调用方可以在保留被拒绝文本的 Enter 或 blur 中传入新的 `value`，正如实时过滤器在恢复编辑之前的值时所做的。若字段把该 `value` 当作替换，就会抹掉提交刚刚保留的文本，并在没有消息的情况下丢弃该输入（FR4、AR4）。保留无效输入并留出改正机会，优于将其移除。因此，在与任何保留被拒绝文本的 Enter 或 blur（第一次或之后的某一次）同一次更新中传入的 `value`，会让输入、其拒绝与其消息保持原样，且不上报任何变化；之后的新 `value` 会替换该输入（FR4、FR6、FR8）。

已否决：只放过揭示拒绝的那一次提交，因为先 Enter 再 blur 恢复值会抹掉文本。

## Open questions

无。
