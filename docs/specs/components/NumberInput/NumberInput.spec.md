---
schema_version: 3
template_version: 7
kind: component
id: component:NumberInput
authority: current
archive_reason: null
superseded_by: null
approved_by: imdreamrunner
approved_at: 2026-10-29
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/NumberInput/NumberInput.test.tsx,
    packages/core/src/NumberInput/NumberInput.fr10.test.tsx,
    packages/core/src/NumberInput/NumberInput.rejectedEntry.test.tsx,
    packages/core/src/NumberInput/numberInputCommit.test.ts,
    packages/core/src/NumberInput/numberParser.test.ts,
    packages/core/src/NumberInput/numberParser.docblock.test.ts,
    packages/core/src/NumberInput/__tests__/NumberInput.a11y.test.tsx,
    packages/core/src/NumberInput/__tests__/NumberInput.a11y.chromium.spec.ts,
    packages/core/src/NumberInput/__tests__/NumberInput.coarse-pointer.a11y.chromium.spec.ts,
    packages/core/src/InputGroup/InputGroup.test.tsx,
  ]
modules: []
families: [family:input-fields]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:icon-resolution-and-component-slots,
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [spec:AST-085, spec:AST-086, spec:AST-102, spec:AST-117, spec:AST-118]
---

# NumberInput component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | NumberInput 是一个受控的数字字段，具备 Field 属性、size、status、`min`、`max`、`step`、`isIntegerOnly`、`formatValue`、`units`、`entryErrorBehavior`、`onEntryErrorChange`、步进按钮、滚轮步进、清除、禁用与只读状态，以及 input-family 部件属性。 |
| 行为          | 一个以文本为底座的 `spinbutton`；键入的草稿在失焦或按 Enter 时提交，按区域设置解析并钳制到范围内。方向键、滚轮以及可用的非粗指针步进按钮按网格步进并立即提交。                                                                                     |
| 终端用户影响  | 粗指针用户直接输入数字，而不使用紧凑的步进按钮。键盘步进仍然可用。被拒绝的输入会显示消息并被播报，但绝不会在未完成时出现；禁用字段仍可到达；只读状态不被播报。                                                                                     |
| 构建者影响    | 数字回调保持不变，现有 NumberInput 调用无需迁移源码或配置；`entryErrorBehavior` 和 `onEntryErrorChange` 是可选的新属性。                                                                                                                           |
| 兼容性/就绪度 | 粗指针适配是非破坏性的：数值、校验、直接输入和键盘步进均保持支持。只读暴露与 reduced-motion 下清除按钮的缺口仍列在 Current-state impact 下。                                                                                                       |
| 审查检查      | 拒绝粗指针下的步进按钮、在要求时丢失非粗指针步进按钮、每次按键都触发 `onChange`、无法解析的提交、偏离网格或越界的步进、禁用字段离开 Tab 顺序或提交表单，或在 IME 组合期间步进。                                                                    |
| 治理规则      | FR5 和 AR4 拥有按指针条件控制的步进按钮可用性；`family:input-fields` FR3、FR4、FR8–FR11；`spec:AST-085` FR1–FR3、FR6；`spec:AST-086` FR3、FR4；`spec:AST-017` FR1、FR3、FR7；`architecture:internationalization`；`design:reduced-motion` DR1。    |

此表是审查投影；以下正文具有权威性。

## Intent

NumberInput 收集一个数字。它负责按区域设置解析、草稿与提交策略、范围钳制、步进、格式化显示，以及数字字段在 `family:input-fields` 下对 Field 和 InputGroup 的适配。使用方用法见 `NumberInput.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`；`step={1}`、滚轮步进开启、无步进按钮、无清除、`size="md"`、`statusVariant="attached"`、`entryErrorBehavior` 表现为 `'complete'`、已发布行为
- 兼容性类别：非破坏性的呈现适配；公共属性名、类型、导出、数值与回调、校验、直接输入，以及键盘步进在 `spec:AST-017` FR3 的数字步进呈现规则下均保持不变；`entryErrorBehavior` 是增量新增（FR14，`spec:AST-117`）；未完成的草稿不显示拒绝，无法解析的草稿在失焦时保留，而表单仍会提交已提交的数字（FR6），拒绝会显示消息（FR15、FR16）：这是一个随补丁发布的无障碍行为修复（`spec:AST-017` FR53、`spec:AST-118`）；`onEntryErrorChange` 是增量新增
- 受控/非受控行为：仅受控；`value`（`number`、`null` 或 `undefined`）是已提交的值，NumberInput 自身只保留未提交的文本草稿
- 迁移决策：无需调用方源码或配置迁移；数字输入功能仍可通过直接输入和键盘步进使用，而紧凑的视觉步进辅助则适配指针精度

使用方迁移说明应放在使用方文档和发布说明中。

## Ownership boundary

**拥有**

- 以文本为底座的 spinbutton 及其数字 ARIA 值。
- 按区域设置解析、草稿有效性，以及提交、清除或还原的决策。
- 通过键盘、滚轮和步进按钮的步进，以及步进网格。
- 静止时的格式化显示及其提交的表单值。
- 单位文本、无效输入播报，以及步进按钮。
- 步进按钮图标的 `numberInput:stepperDown` 扩展键，由 `architecture:icon-resolution-and-component-slots` 交给 NumberInput。
- 禁用、禁用原因与只读行为；`number-input` 目标；其分组适配。

**不拥有 / 非目标**

- 标签、描述、标签图标、标签工具提示、状态消息位置，以及 `width`——由 Field 在 `family:input-fields` 下拥有（共享所有者小节）。
- 清除按钮自身的渲染和工具提示——由共享清除控件拥有（`family:input-fields` FR11）。
- InputGroup 行几何——由 InputGroup 在 `family:input-fields` 下拥有（共享所有者小节）。
- `isLoading` 和 `changeAction`——不提供（`family:input-fields` AV5）。
- 解析器与提交辅助函数——内部实现；其他组件复用它们，但它们不是公共的。

## Public concepts

| 概念                 | 封闭取值或状态              | 含义                         | 按变体/方向/状态的可用性                | 默认值                                    | 所有者                  | 稳定性 | 无效值行为                                                                                       |
| -------------------- | --------------------------- | ---------------------------- | --------------------------------------- | ----------------------------------------- | ----------------------- | ------ | ------------------------------------------------------------------------------------------------ |
| 范围                 | `min`、`max`，各自可选      | 提交钳制所依据的闭区间边界。 | 始终可用。                              | 无界                                      | `component:NumberInput` | 稳定   | `min` 高于 `max`（整数取整后）：不提交任何数字；Enter 和失焦保留每个草稿，以 `outOfRange` 拒绝。 |
| 步长                 | 正的有限数                  | 步进增量。                   | 方向键、滚轮、步进按钮。                | `1`                                       | `component:NumberInput` | 稳定   | 缺失、非正、非有限，或（仅整数时）小数的步长变为 `1`。                                           |
| 仅整数               | 关、开                      | 只有整数会被解析和提交。     | 始终可用。                              | 关                                        | `component:NumberInput` | 稳定   | 小数草稿无效。                                                                                   |
| 草稿                 | 无、有效、无效              | 未提交的键入文本。           | 编辑期间。                              | 无                                        | `component:NumberInput` | 稳定   | 不适用。                                                                                         |
| entry error behavior | `complete`、`blur-or-enter` | 其自身拒绝何时显示。         | 键入的草稿。                            | 最近的 FormLayout 默认值，否则 `complete` | `spec:AST-117`          | 稳定   | TypeScript 拒绝其他值。                                                                          |
| 可清除               | 关、开                      | 值是否可以变为 `null`。      | 开启时把 `onChange` 拓宽为接受 `null`。 | 关                                        | `component:NumberInput` | 稳定   | 不适用。                                                                                         |
| 输入错误             | `NumberInputEntryError`     | 为应用揭示的拒绝。           | 通过 `onEntryErrorChange`。             | `null`                                    | `spec:AST-118`          | 提议中 | 种类：`unreadable`、`fractional`（仅整数时）、`outOfRange`（`min` 高于 `max`）。                 |
| 尺寸                 | `sm`、`md`、`lg`            | 控件高度。                   | 始终可用。                              | 继承的 size，否则 `md`                    | `family:input-fields`   | 稳定   | TypeScript 拒绝其他值。                                                                          |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 依据                                                              |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| FR1  | 输入是一个原生文本输入，带 `role="spinbutton"`；仅整数时 `inputMode` 为 `numeric`，否则为 `decimal`；`aria-valuemin` 和 `aria-valuemax` 来自范围，`aria-valuenow` 来自已提交的 `value`，并且当提供 `formatValue` 时 `aria-valuetext` 设为格式化后的值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前测试                                                          |
| FR2  | 键入只改变草稿；键入期间不调用 `onChange`。草稿在以下情况有效：能按活动区域设置解析（分组、小数分隔符、数字书写系统与符号）、满足仅整数，且字段的 `min` 不高于其 `max`；超出普通范围的数字是有效的，并在提交时钳制（FR3）。无效草稿按 FR15 所述显示其拒绝：在没有状态消息显示它时，通过一个持久的 assertive 区域呈现。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | `spec:AST-086` FR3；`architecture:internationalization`；当前测试 |
| FR3  | 失焦时草稿解析一次：空草稿清除（可清除且存在值时调用 `onChange(null)`）或还原，草稿随之结束；无法解析或种类错误的草稿，或在 `min` 高于 `max` 时的任何数字，保留在字段中并显示其拒绝（FR15）；否则数字钳制到范围，与 `value` 不同时以 `onChange(number)` 提交，草稿结束。Enter 以相同方式解析有效草稿，可清除时清除空草稿。对于没有 `hasClear` 的空草稿，Enter 不提交任何内容，草稿保留在字段中且不标记为无效；对于无法解析或种类错误的草稿，或 `min` 高于 `max` 时的任何草稿，Enter 不提交，草稿保留在字段中并显示其拒绝（FR15）。只有当提交发生钳制时，Enter 才结束草稿。在未禁用的字段中，组合之外的每次 Enter 随后都会调用 `onEnter`，无论提交了什么。调用方在与任何保留拒绝的 Enter 或失焦同一次更新中传入的新 `value`——如 Table 的内联筛选器在恢复其值时那样——不会替换保留的草稿，因此被拒绝的文本及其消息仍然保留；之后的新 `value` 会替换它（FR6）。 | 当前测试；`spec:AST-118` FR4                                      |
| FR4  | 不带修饰键的 ArrowUp 和 ArrowDown、聚焦输入上的滚轮（当 `isWheelEnabled` 时），以及步进按钮，都按一个网格位置步进并立即提交。网格从 `min`（当适合仅整数时）或 0 开始。从空字段或已被清空的草稿出发，向上到 `min` 或 0，向下到 `max` 或 0。结果四舍五入到步长与网格起点两者中更精细的精度（最多 12 位小数），钳制到范围，且绝不离开仅整数模式；无法移动的步进按钮不执行任何操作，而无法移动的方向键或滚轮步进仍会结束草稿，提交有效草稿的数字并丢弃无法解析的草稿。调用方 `onKeyDown` 若阻止某个方向键，则取消该步进。滚轮步进会阻止页面滚动；否则页面滚动。                                                                                                                                                                                                                                                                                                 | 当前测试                                                          |
| FR5  | 使用 `hasNumberSteppers` 时，递增和递减按钮渲染在控件末端，除非主指针是粗指针。在粗主指针上，这些按钮在每个视口宽度下都从布局和无障碍树中隐藏，没有退出选项；控件恢复其正常的主题末端内边距。直接数字输入和键盘步进仍然可用。显示时，这些按钮不在 Tab 顺序中，以本地化的递增和递减短语加标签命名，按下时保持焦点在输入上，并在以该方式步进无法移动、或字段禁用或只读时暴露 `aria-disabled`。用鼠标或笔按住步进按钮会重复步进，第一次重复在 0.5 s 后，然后更快；每个重复值都作为字段的草稿显示，当按住因释放或指针取消而结束时，字段通过 `onChange` 提交一次。单击则立即步进并提交。                                                                                                                                                                                                                                                                         | `spec:AST-085` FR1、FR2；当前测试                                 |
| FR6  | 使用 `formatValue` 时，输入在静止时显示格式化后的已提交值，聚焦时显示按区域设置格式化的普通数字。使用 `formatValue` 时，表单值通过一个携带原始已提交数字的隐藏输入提交，可见输入没有 `name`。不使用它时，可见输入携带 `name`，表单提交其文本，包括按 Enter 提交的草稿；当失焦保留被拒绝的草稿时（FR3、FR15），一个隐藏输入携带 `name` 和该字段在最新稳定版本上显示的已提交数字（未聚焦时为普通数字，聚焦时为按区域设置格式化的普通数字），可见输入则不携带，直到用户编辑草稿或新的 `value` 替换它（`spec:AST-118` FR4）。                                                                                                                                                                                                                                                                                                                                   | 当前测试；`spec:AST-118` FR4                                      |
| FR7  | `units` 渲染为输入之后的次要文本，并属于输入的描述。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前测试                                                          |
| FR8  | 使用 `hasClear` 时，当 `value` 不为 `null` 且字段可编辑时显示清除按钮。激活它会调用 `onChange(null)`、丢弃草稿，并像 TextInput 的清除那样聚焦输入。清除按钮是一个 ghost small `component:Button`，因此其按下缩放不得在 reduced motion 下生效（`design:reduced-motion` DR1）。实现缺口：它在 reduced motion 下仍会缩放。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `family:input-fields` FR11；当前测试                              |
| FR9  | 当自身的 `isDisabled` 或外层 InputGroup 的 `isDisabled` 为 true 时，NumberInput 被禁用；已启用的分组绝不会重新启用自我禁用的字段（`spec:AST-085` FR7）。禁用时：输入上 `aria-disabled="true"` 和 `readOnly`、保留 Tab 停靠点、不提交值、不提交草稿（进行中的草稿被丢弃）、任何路径都不步进、除 focus 和 blur 外没有调用方处理器、Enter 被取消、清除按钮隐藏、控件变暗，以及键盘焦点环。使用 `disabledMessage` 时，原因工具提示在悬停和键盘聚焦时打开并描述该输入。                                                                                                                                                                                                                                                                                                                                                                                          | `spec:AST-085` FR1–FR3、FR6；`family:input-fields` FR4；当前测试  |
| FR10 | 只读：`readOnly`、完全不透明、仍会提交、不可编辑，且通过键盘、滚轮或步进按钮都不步进；此时滚轮滚动页面。两者都设置时禁用优先。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前测试                                                          |
| FR11 | 属于 IME 组合的方向键和 Enter 既不步进也不提交。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 当前测试                                                          |
| FR12 | 字段组合、InputGroup 适配、状态呈现、起始图标、点击聚焦、size 与 iOS 文本下限，以及属性目标均匹配 `component:TextInput` FR1、FR9、FR11–FR13，包括其实现缺口（针对 `spec:AST-102` FR4 的固定高度、没有文本的错误状态、仅颜色的 `detached` 状态，以及分组描述），外加传给 Field 的 `labelIcon`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `family:input-fields` FR3、FR8–FR10；当前测试                     |
| FR13 | 控件盒带有 `astryx-number-input` 以及 `data-size`、`data-status`、`data-disabled` 和 `data-readonly`。主题对 `number-input` 以任何写法给出的 `padding` 会同时为控件盒和步进按钮列设置内边距。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `architecture:component-theming-surface`；当前测试                |
| FR14 | 其自身的拒绝遵循 `entryErrorBehavior`（`spec:AST-117` FR1、FR2）。键入的数字只在提交时完整，因此在任一取值下，字段在用户键入期间都不标记也不播报拒绝，而 Enter 或失焦会揭示草稿当前的拒绝，其信号一起出现并播报一次，如 FR15 所述（`spec:AST-117` FR3、FR4）；被 FR3 钳制的数字不揭示拒绝。被揭示的拒绝在草稿变为有效或为空时立即清除（`spec:AST-117` FR5）。由于两种取值行为相同，该字段不读取 `FormLayout` 默认值。                                                                                                                                                                                                                                                                                                                                                                                                                                       | `spec:AST-117` FR1–FR6；源码与测试                                |
| FR15 | 其自身的拒绝遵循 `spec:AST-118`。键入的数字只在提交时完整，因此在用户键入期间，无论草稿如何，它都不标记、不显示、不播报（`spec:AST-118` FR1–FR3）。在 Enter 或失焦时，无法解析的草稿、仅整数时的小数，或 `min` 高于 `max` 时的任何数字，都会连同其拒绝一起保留，且失焦后表单提交已提交的值（FR6；`spec:AST-118` FR4）；超出普通范围的数字会被钳制并提交（FR3）。独立使用时，拒绝会将无效数字消息显示为错误状态，除非 FR16 显示调用方的消息；它设置 `aria-invalid`、将文本着为次要色，并播报一次；在 InputGroup 中，它设置 `aria-invalid`，由 alert 播报。当草稿有效或为空时清除（`spec:AST-118` FR5、FR6）。                                                                                                                                                                                                                                                | `spec:AST-118` FR1–FR6；当前测试                                  |
| FR16 | 带消息的调用方 `error` 状态始终代替字段自身的消息显示；没有消息的 `error` 状态，或 `warning`、`success` 状态，绝不替换拒绝的消息。当调用方的错误显示时，`aria-invalid` 保持设置，alert 播报拒绝的消息一次，若有回调则播报调用方的消息（`spec:AST-118` FR7）。当被揭示的拒绝变化时，`onEntryErrorChange` 接收一个 `NumberInputEntryError`，结束时接收 `null`：`kind` 为 `unreadable`、`fractional` 或 `outOfRange`；`text` 为键入的文本；`value` 为其数字，适用于 `fractional` 和 `outOfRange`。键入、Enter、失焦、新的 `value`、`min`、`max` 或 `isIntegerOnly`，以及禁用，都会各报告一次变化；未变化的拒绝不会再次报告；带有一个持续拒绝时卸载会报告 `null`（`spec:AST-118` FR8）。                                                                                                                                                                        | `spec:AST-118` FR7、FR8；当前测试                                 |

### Allowed variation

- **AV1 — 数字格式化。** `formatValue` 可返回任意文本；已提交的值保持为数字。
- **AV2 — 主题内边距。** 主题可以更改 `number-input` 的内边距；步进按钮随之调整。

### Representative states

| 状态             | 必需的不变式                                                       | 允许的变化 |
| ---------------- | ------------------------------------------------------------------ | ---------- |
| 静止，已格式化   | 格式化文本；`aria-valuetext`；隐藏的原始表单值。                   | 格式。     |
| 聚焦             | 按区域设置的普通数字，可编辑。                                     | 区域设置。 |
| 无效草稿         | 如 FR15：错误状态；`aria-invalid`；一次播报；保留；无 `onChange`。 | —          |
| 越界提交         | 在失焦或 Enter 时提交钳制后的值。                                  | —          |
| 步进按钮处于边界 | 该步进按钮 `aria-disabled`；步进不执行任何操作。                   | —          |
| 带原因禁用       | 可聚焦；只读；不提交；不步进；原因工具提示。                       | —          |

### Transformation and precedence order

- **ORD1 — 键入提交。** 修剪 → 空值检查 → 区域设置解析 → 整数检查 → 范围检查（仅整数时 `min` 向上取整、`max` 向下取整）→ 钳制 → 若有变化则提交。
- **ORD2 — 步进。** 当前数字（草稿有效时用草稿；已清空的草稿从空开始步进，FR4；否则用 `value`）→ 下一个网格位置 → 四舍五入到步长与网格起点中更精细的精度 → 钳制 → 整数检查。
- **ORD3 — 可用性。** 先禁用，再只读，再可编辑。

### Performance and resources

- **PR1 — 一个滚轮监听器。** 每个挂载且开启滚轮步进的输入都在自身上持有一个非被动滚轮监听器；仅当该输入聚焦时才生效。

## Accessibility contract

- **AR1 — Spinbutton。** FR1；暴露的是已提交的值，而非草稿。
- **AR2 — 无效输入。** 被拒绝的草稿按 FR15 所述显示其消息、设置 `aria-invalid` 并一起播报一次，且失焦会保留它，因此任何输入都不会在没有消息的情况下被丢弃（WCAG 2.2 1.4.1、3.3.1）。若有调用方 `error` 状态，则显示该状态，拒绝会设置 `aria-invalid` 并播报一次（FR16）。在 InputGroup 内，拒绝会被播报并设置 `aria-invalid`，不显示自己的消息（`spec:AST-118` FR5）。在 `entryErrorBehavior="blur-or-enter"` 下，播报等待 Enter 或失焦（FR14）。
- **AR3 — 禁用。** FR9 满足 `spec:AST-085` FR1、FR5 和 FR6。
- **AR4 — 步进按钮。** 紧凑的仅指针辅助在每个视口宽度下于粗主指针上隐藏。直接数字输入仍可用，方向键在每种指针类型上提供键盘步进（FR4、FR5）。
- **AR5 — 只读暴露。** 只读 NumberInput 必须向辅助技术暴露其只读状态（WCAG 2.2 4.1.2）。实现缺口：spinbutton 未暴露任何只读状态。

## Design relationships

| 解剖结构或状态 | 设计要求                                                               | 表示权威       | 层级角色 | 组件契约  |
| -------------- | ---------------------------------------------------------------------- | -------------- | -------- | --------- |
| 输入           | 数字文本；显示拒绝时为次要颜色（FR15）。                               | 当前源码与测试 | 突出     | FR2       |
| 单位           | 数字之后的次要文本。                                                   | 当前源码与测试 | 辅助     | FR7       |
| 步进按钮       | 在非粗指针上堆叠于末端；在粗主指针上隐藏，并使用正常的主题末端内边距。 | FR5；DEC-1     | 辅助     | FR5、FR13 |

`design:reduced-motion` 管辖清除按钮的按下缩放（FR8）；没有其他设计记录管辖 NumberInput。控件盒带有 `number-input`；使用方解剖结构未命名任何控件盒部件，因此本记录不含解剖结构主题映射。

## Family and system relationships

- `family:input-fields` 拥有分组准入、禁用原因、状态位置、焦点缩放下限、属性目标和清除工具提示；NumberInput 采用它们，且不暴露 `isLoading` 或 `changeAction`。
- `spec:AST-085` 拥有禁用状态的可聚焦性；NumberInput 满足它，包括步进按钮。
- `spec:AST-086` FR3 和 FR4 拥有持久无效输入区域。
- `spec:AST-117` 拥有输入错误行为；FR14 投影其 FR1–FR6。
- `spec:AST-118` 拥有被拒绝输入的反馈；FR15 和 FR16 投影其 FR1–FR8 以及 NumberInput 的完成点。
- `architecture:internationalization` 拥有解析器所使用的区域设置解析。
- `component:TextInput` 是 FR12 所述共享文本字段行为的参照。

## Verification map

| Contract                 | Verification                                                                                                                                | Representative states                                                                  | Mutation or failure expectation                                                                                   | Audit section                     |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1, AR1                 | `NumberInput.test.tsx` 的 spinbutton-attribute 套件；`NumberInput.a11y.chromium.spec.ts`                                                    | 有界、无界、已格式化                                                                   | 缺少 role 或 ARIA 值即失败。                                                                                      | `audit:NumberInput/accessibility` |
| FR2, AR2                 | `numberParser.test.ts`；`numberParser.docblock.test.ts`；`NumberInput.test.tsx` 的 invalid-feedback 套件                                    | 各语言区域、分组、无效文本                                                             | 解析错误、提交猜测值，或缺少播报即失败。                                                                          | `audit:NumberInput/behavior`      |
| FR3, ORD1                | `numberInputCommit.test.ts`；`NumberInput.test.tsx` 的 validation、commit-policy、clamping、keyboard-clearing 套件                          | 失焦、Enter、为空、钳制、反向区间                                                      | 每次按键都触发 `onChange`、提交未钳制的值，或清除结果错误即失败。                                                 | `audit:NumberInput/behavior`      |
| FR4, FR5, ORD2, AR4, PR1 | `NumberInput.test.tsx` 的 stepping 与 steppers 套件；wheel-listener 用例                                                                    | 按键、滚轮、步进器；边界；为空；精度                                                   | 偏离步进网格、越过边界或带修饰键的步进即失败。证据缺口：没有测试覆盖从已清空的草稿在已有值之上步进。              | `audit:NumberInput/behavior`      |
| FR6, FR7                 | `NumberInput.test.tsx` 的 formatted-display、form 与 units 套件；`NumberInput.rejectedEntry.test.tsx` 的 "form value" 套件                  | 静止与聚焦；表单提交；失焦后保留的草稿                                                 | 提交已格式化的值、失焦后保留的草稿提交其文本，或单位未被描述，均判定失败。                                        | `audit:NumberInput/behavior`      |
| FR8                      | `NumberInput.test.tsx` 的 hasClear 套件                                                                                                     | 清除；禁用；只读                                                                       | 在禁用字段上清除，或结果不是 `null`，即失败。证据缺口：没有测试在减少动效下按下清除按钮。                         | `audit:NumberInput/behavior`      |
| FR9, FR10, ORD3, AR3     | `NumberInput.test.tsx` 的 disabled、disabledMessage、read-only 与 form 套件；`InputGroup.test.tsx` 的 disabled-propagation 用例             | 禁用、原因、只读                                                                       | 丢失 Tab 停靠点、提交禁用状态的值，或在只读时步进，均判定失败。                                                   | `audit:NumberInput/accessibility` |
| FR12                     | `NumberInput.fr10.test.tsx`；`NumberInput.test.tsx` 的 status 与 click-to-focus 套件                                                        | 独立与分组                                                                             | 基础 prop 未落在 input 上，或样式作用在错误部件上，均判定失败。                                                   | `audit:NumberInput/api`           |
| FR13                     | `NumberInput.test.tsx` 的 theme-state 与 stepper-padding 套件                                                                               | 每种 padding 写法                                                                      | 忽略主题 padding 的步进器即失败。                                                                                 | `audit:NumberInput/theming`       |
| AR5                      | `NumberInput.a11y.chromium.spec.ts` 及其已记录的已知失败                                                                                    | 只读                                                                                   | 缺口关闭后，该已知失败不再匹配。                                                                                  | `audit:NumberInput/accessibility` |
| FR11                     | `NumberInput.test.tsx` 的 "does not step or commit on a composing keydown (IME)" 与 "waits for IME composition to finish before committing" | 组词中的方向键与 Enter                                                                 | 组词期间发生步进或提交即失败。                                                                                    | `audit:NumberInput/behavior`      |
| FR5, FR13, AR4           | `NumberInput.coarse-pointer.a11y.chromium.spec.ts`                                                                                          | 在 390 与 1280 px、LTR/RTL 及非默认主题末端 padding 下的粗指针/非粗指针                | 粗指针下步进器可见、细指针下步进器隐藏、末端 padding 错误，或直接输入/键盘输入失效，均判定失败。                  | `audit:NumberInput/behavior`      |
| FR5                      | `NumberInput.test.tsx` 的 "a held stepper" 套件                                                                                             | 按住与释放；指针取消；边界；点击；手指按压                                             | 每次重复都提交、释放之后仍重复，或字段变为禁用/只读后仍步进，均判定失败。                                         | `audit:NumberInput/behavior`      |
| FR14, AR2                | `NumberInput.rejectedEntry.test.tsx` 的 "NumberInput entryErrorBehavior" 用例；`Pagination.test.tsx` 的 FormLayout 用例                     | `-`；`1a`；10–100 区间内的 `150`；每个值；Enter 与失焦                                 | 在 `'blur-or-enter'` 下于提交之前发出信号、只发出单个信号、回退未播报，或在 `'complete'` 下发生变更，均判定失败。 | `audit:NumberInput/behavior`      |
| FR15, AR2                | `NumberInput.rejectedEntry.test.tsx` 的 "NumberInput rejected entry" 套件；`numberInputCommit.test.ts` 的拒绝用例                           | `-`；`1a`；仅允许整数时的 `1.5`；带 `max={100}` 的 `150`；反向区间；输入过程中；提交时 | 输入过程中出现标记或警报、提交时漏掉拒绝、草稿被丢弃，或只发出单个信号，均判定失败。                              | `audit:NumberInput/behavior`      |
| FR16                     | `NumberInput.rejectedEntry.test.tsx` 的 "onEntryErrorChange" 与 "rejected entry and a caller status" 套件                                   | 每种 kind；无状态以及 `error`、`warning`、`success` 状态；有回调或无回调；卸载         | 报告缺失或重复、`kind` 或 `value` 错误，或在调用方状态之上给出错误消息，均判定失败。                              | `audit:NumberInput/behavior`      |

## Current-state impact

- **只读状态未暴露（AR5）。** 只读的 NumberInput 的 spinbutton 不暴露只读状态，因此辅助技术用户可能以为可以编辑它。无障碍套件将其记录为已知失败。
- **减少动效下的清除按压（FR8）。** 当用户偏好减少动效时，清除按钮在按下时会缩放到 0.98，正如 `component:Button` FR15 所记录的那样，这与 `design:reduced-motion` DR1 相悖。
- **继承自 TextInput 的缺口（FR12）。** 固定高度（`spec:AST-102` FR4）、没有消息而仅靠颜色与图标呈现的错误状态（WCAG 2.2 3.3.1）、没有消息而仅靠颜色的 `detached` 状态（WCAG 2.2 1.4.1），以及 `component:TextInput` 记录的 grouped description 引用，在此同样适用。
- **步进器图标键。** 步进器通过 `numberInput:stepperDown` 扩展键解析其图标，而不是通过组件槽模型，这正是 `architecture:icon-resolution-and-component-slots` 所指名的已知偏差；它在该记录的退出条件下退出。

## Decision log

NumberInput 适用 `family:input-fields` 与 `spec:AST-085`。

### DEC-1 — Compact steppers follow primary-pointer precision

**Reference:** `component:NumberInput/DEC-1`

**Decider:** `imdreamrunner`, `2026-10-29`

粗主指针的呈现使用直接数字输入，而不是紧凑步进器，这独立于视口宽度，且没有退出选项。非粗指针的步进器与键盘步进保留其契约。紧凑按钮是呈现辅助手段：数值、验证、回调、直接输入与键盘步进的契约都不依赖它们的可见性。适配这些辅助手段不需要调用方源码或配置迁移。

已否决：基于宽度的激活，因为决定这一控件可供性的是指针精度，而不是可用的布局宽度。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到这些内容的所有者。
