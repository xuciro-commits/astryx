---
schema_version: 3
template_version: 7
kind: component
id: component:TextInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/TextInput/TextInput.test.tsx,
    packages/core/src/TextInput/TextInput.fr10.test.tsx,
    packages/core/src/TextInput/__tests__/TextInput.a11y.test.tsx,
    packages/core/src/TextInput/__tests__/TextInput.a11y.chromium.spec.ts,
    packages/core/src/InputGroup/InputGroup.test.tsx,
  ]
modules: []
families: [family:input-fields]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-082, spec:AST-085, spec:AST-086, spec:AST-102]
---

# TextInput component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | TextInput 是一个受控的单行文本字段，具有 Field 属性、`type`（`text`、`password`、`email`、`search`、`tel`、`url`）、尺寸、状态、清除、起始图标、`onChange`、`changeAction`、`isLoading`、禁用与只读状态、触摸键盘属性 `enterKeyHint`、`inputMode`、`autoCapitalize`、`hasAutoCorrect` 与 `hasSpellCheck`（FR16），以及 input 家族的部件属性。 |
| 行为          | 输入时调用 `onChange`，然后在 transition 中以乐观值调用可选的 `changeAction`；当显示值与 `value` 不一致时显示忙碌 Spinner。禁用字段保持可聚焦、只读、不提交且不响应交互。                                                                                                                                                                     |
| 最终用户影响  | 人们在一个带标签的字段中输入，该字段就地显示进度与校验。键盘用户与屏幕阅读器用户可以到达禁用字段及其原因。没有消息的错误仅通过颜色与图标来传达。在手机上，由调用方描述的字段会打开其所需的键盘，例如电话拨号盘或数字键盘，其 Return 键显示 Next、Go 或 Done，并按原样保留输入的姓名。                                                         |
| 构建者影响    | 调用方可以选择触摸键盘、其 Return 键标签、大小写、自动纠错与拼写检查标记（FR16）；未设置的属性使字段保持原状。                                                                                                                                                                                                                                |
| 兼容性/就绪度 | 触摸键盘属性以及 `search`、`tel`、`url` 类型属于增量改动，是一个补丁级 `[feat]`（`spec:AST-017` FR5、FR7）。除此之外，本记录陈述的是已发布行为。清除按钮在减弱动态效果下仍会缩放，错误可能缺少文本，高度不随文本增长，没有消息的 `detached` 状态仅靠颜色表达，分组内的 `description` 被引用但未渲染；以上均列在 Current-state impact 下。     |
| 评审检查      | 拒绝以下情况：禁用字段脱离 Tab 顺序、提交或运行调用方处理器；在提交 IME 转换时 Enter 触发 `onEnter`；忙碌状态缺少 `aria-busy`；根级样式属性；未设置时仍渲染属性、或改变 Enter 行为的键盘属性；或接受任意字符串的键盘值类型。                                                                                                                  |
| 管辖规则      | `family:input-fields` FR1, FR2, FR3, FR4, FR6, FR8–FR11; `spec:AST-085` FR1–FR3, FR5–FR7; `spec:AST-086` FR8; `architecture:component-size-cascade` INV3–INV5; `design:reduced-motion` DR1; `spec:AST-102` FR4; `architecture:public-component-api` INV2–INV4, INV25; `spec:AST-082` FR3, DEC-14; `spec:AST-017` FR5, FR7.                    |

此表是评审用的投影；下方的正文才是权威。

## Intent

TextInput 收集简短的、单行的文本。它拥有原生 input、其变更与 Action 管道、忙碌、清除、状态、禁用与只读行为，以及在 `family:input-fields` 下对 Field 与 InputGroup 的适配。使用方用法见 `TextInput.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`；`type="text"`、`size="md"`、`statusVariant="attached"`，无清除按钮
- 兼容类别：增量；可选的触摸键盘属性（FR16）、其值类型以及 `type` 取值 `search`、`tel`、`url` 属于补丁级 `[feat]`（`spec:AST-017` FR5、FR7）。未设置时它们不渲染任何内容，因此不改变任何已发布默认值或 DOM 输出
- 受控/非受控行为：仅受控；`value` 为必需，字段仅在 `changeAction` 挂起期间显示乐观值
- 迁移决策：无

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 原生 input、其属性及其无障碍关系。
- `onChange` → 乐观值 → `changeAction` 管道与忙碌状态。
- 清除按钮的呈现与效果、起始图标槽位，以及控件中的状态图标。
- 禁用、禁用原因与只读行为。
- 控件盒及其 `text-input` 目标。
- 其在 InputGroup 内部的分组适配。
- 原生 input 的触摸键盘属性（FR16）。

**不拥有 / 非目标**

- 标签、描述、状态消息位置、标签提示框与 `width` 布局——由 `family:input-fields` 下的 Field 拥有（共享所有者章节）。
- 状态消息盒——由 `component:FieldStatus` 拥有。
- 清除按钮自身的渲染与提示框——由共享的清除控件拥有（`family:input-fields` FR11）。
- InputGroup 行高、连接表面、边缘对齐与组焦点——由 `family:input-fields` 下的 InputGroup 拥有（共享所有者章节）。
- 多行文本——由 TextArea 拥有。
- 长度限制——未纳入契约。

## Public concepts

| 概念       | 封闭取值或状态                                                                     | 含义                                                                                               | 按变体/方向/状态的可选性                                                                          | 默认值                | 所有者                | 稳定性 | 无效值行为                |
| ---------- | ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | --------------------- | --------------------- | ------ | ------------------------- |
| 类型       | `text`, `password`, `email`, `search`, `tel`, `url`                                | 原生 input 类型；`email`、`tel` 与 `url` 还会调出匹配的触摸键盘，`search` 使该字段成为 searchbox。 | 始终。                                                                                            | `text`                | `component:TextInput` | 稳定   | TypeScript 拒绝其他取值。 |
| 返回键标签 | `EnterKeyHint`: `enter`, `done`, `go`, `next`, `previous`, `search`, `send`        | `enterKeyHint`：触摸键盘的 Return 键显示什么文字。它不改变 Enter 的行为（FR10）。                  | 始终；Web 契约。                                                                                  | 未设置：无属性        | `component:TextInput` | 稳定   | TypeScript 拒绝其他取值。 |
| 触摸键盘   | `InputMode`: `none`, `text`, `tel`, `url`, `email`, `numeric`, `decimal`, `search` | `inputMode`：打开哪个触摸键盘，但不改变字段接受的内容。                                            | 始终；Web 契约。                                                                                  | 未设置：无属性        | `component:TextInput` | 稳定   | TypeScript 拒绝其他取值。 |
| 大小写     | `AutoCapitalize`: `off`, `none`, `on`, `sentences`, `words`, `characters`          | `autoCapitalize`：触摸键盘在用户输入时何时大写。                                                   | 始终；Web 契约。                                                                                  | 未设置：无属性        | `component:TextInput` | 稳定   | TypeScript 拒绝其他取值。 |
| 自动纠错   | `true`, `false`                                                                    | `hasAutoCorrect`：触摸键盘是否在用户输入时纠正单词。                                               | 始终；Web 契约。                                                                                  | 未设置：无属性        | `component:TextInput` | 稳定   | TypeScript 拒绝其他类型。 |
| 拼写检查   | `true`, `false`                                                                    | `hasSpellCheck`：是否标记拼写错误的单词。                                                          | 始终；Web 契约。                                                                                  | 未设置：无属性        | `component:TextInput` | 稳定   | TypeScript 拒绝其他类型。 |
| 尺寸       | `sm`, `md`, `lg`                                                                   | 控件高度。                                                                                         | 始终。                                                                                            | 继承的尺寸，否则 `md` | `family:input-fields` | 稳定   | TypeScript 拒绝其他取值。 |
| 状态       | `error`, `warning`, `success`，可选消息                                            | 校验状态。                                                                                         | 始终；消息盒仅在 InputGroup 之外。                                                                | 无                    | `family:input-fields` | 稳定   | TypeScript 拒绝其他类型。 |
| 状态位置   | `attached`, `detached`, `tooltip`                                                  | 状态消息显示的位置。                                                                               | InputGroup 之外。                                                                                 | `attached`            | `family:input-fields` | 稳定   | TypeScript 拒绝其他取值。 |
| 忙碌       | idle, busy                                                                         | 值正在加载或保存。                                                                                 | `isLoading` 为真时，或显示值与 `value` 不一致期间（`changeAction` 挂起且 `value` 尚未接受其值）。 | idle                  | `family:input-fields` | 稳定   | 不适用。                  |
| 可用性     | editable, read-only, disabled                                                      | 值是否可改变并提交。                                                                               | 始终；disabled 优先于只读。                                                                       | editable              | `component:TextInput` | 稳定   | 不适用。                  |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 依据                                                                                                 |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| FR1  | 独立使用时，TextInput 渲染在 Field 内部，并带有其标签（始终渲染；`isLabelHidden` 仅在视觉上隐藏它）、描述、可选或必填标记、标签提示框、状态与 `width`。在 InputGroup 内它不渲染 Field：`aria-labelledby` 先用组标签为 input 命名，然后用控件内部视觉隐藏的标签，且不渲染状态消息盒。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `family:input-fields` FR3；当前源码与测试                                                            |
| FR2  | input 是所选 `type` 的原生 `<input>`，显示受控值。`htmlName` 变为 `name`，`autoComplete` 原样传到 input，`hasAutoFocus` 在挂载时聚焦它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前测试                                                                                             |
| FR3  | 编辑时调用 `onChange(value, event)`。除非该调用阻止默认行为，否则 `changeAction(value, event)` 随后在 transition 中运行；字段在 Action 挂起期间显示提议的值，并在落定后显示受控的 `value`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `family:input-fields` FR6；当前源码                                                                  |
| FR4  | 当 `isLoading` 为真或显示值与 `value` 不一致时，input 设置 `aria-busy`，末端区域显示装饰性的小号 Spinner，忙碌开始只播报一次（`spec:AST-086` FR8）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `family:input-fields` FR5；`spec:AST-086` FR8；当前源码                                              |
| FR5  | 使用 `hasClear` 时，清除按钮仅在 `value` 非空且字段可编辑时显示。其无障碍名由本地化的 “Clear” 短语与标签组合而成。激活它必须通过 FR3 的管道提交 `''`（`onChange`，然后是乐观值与 `changeAction`），并将焦点移到 input：键盘激活时立即移入，指针激活时在同一次点击内完成且不滚动。清除按钮是一个 ghost 小号 `component:Button`，因此其按下反馈遵循 Button FR15，而后者在减弱动态效果下必须不施加按下缩放（`design:reduced-motion` DR1）。实现缺口：在减弱动态效果下其按下缩放仍然生效。                                                                                                                                                                                                                                                                                                                                        | `family:input-fields` FR6, FR11；当前测试                                                            |
| FR6  | 当自身的 `isDisabled` 或外层 InputGroup 的 `isDisabled` 为真时，TextInput 被禁用；启用的组绝不会重新启用自行禁用的字段（`spec:AST-085` FR7）。禁用时：input 暴露 `aria-disabled="true"` 与 `readOnly`，保留其 Tab 停靠点，没有 `name`（因此不提交），且值永不改变。除 focus 与 blur 之外的调用方事件处理器不运行，Enter 被取消，清除按钮隐藏，控件变暗，键盘焦点绘制一个环。                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `spec:AST-085` FR1–FR3, FR6；当前测试                                                                |
| FR7  | 禁用且提供 `disabledMessage` 时：一条说明原因的提示框在悬停与键盘聚焦时于控件上方打开，并描述 input。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `family:input-fields` FR4；当前测试                                                                  |
| FR8  | 只读：input 为 `readOnly`，保持完全不透明，仍可聚焦，仍会在 `name` 下提交，永不调用 `onChange`，并隐藏清除按钮。两者同时设置时禁用优先。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前测试                                                                                             |
| FR9  | 状态会绘制状态边框；`error` 设置 `aria-invalid="true"`。在 InputGroup 之外，`attached` 与 `tooltip` 位置在控件上显示尾部状态图标；`detached` 位置只在消息盒中显示其字形，而消息盒仅在存在消息时渲染；在 InputGroup 内不渲染状态图标。在 InputGroup 之外，消息通过 Field 按所选位置渲染；`tooltip` 不渲染消息盒，若存在消息，其状态图标变成可聚焦按钮，其提示框描述 input（无消息时它保持普通图标）。                                                                                                                                                                                                                                                                                                                                                                                                                          | `family:input-fields` FR8；当前测试                                                                  |
| FR10 | Enter 调用 `onEnter`，除非该按键事件提交的是 IME 组词；`onKeyDown` 接收每个按键，包括正在组词的按键。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前测试                                                                                             |
| FR11 | 独立使用时，高度取自解析后尺寸对应的共享元素尺寸，作为最小值，并会在 `spec:AST-102` FR4 下随设定的文本尺寸增长：先显式 `size`，再最近的尺寸提供者，最后 `md`。实现缺口：高度固定在该尺寸。在 InputGroup 内控件填满组行的高度，因此自身的 `size` 不设定其高度。文本在每个尺寸下都使用正文类型尺寸，仅在 iOS 触摸路径上以 16 CSS px 为下限。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `family:input-fields` FR9；`architecture:component-size-cascade`；当前源码与测试；`spec:AST-102` FR4 |
| FR12 | `startIcon` 在 input 之前渲染一个小号次要图标。字段启用时，点击 input 之外的控件盒会聚焦 input。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前测试                                                                                             |
| FR13 | 基础属性（`ref`、`id`、`aria-*`、`data-*`、DOM 处理器等）到达原生 input；`aria-describedby` 与 TextInput 自己的描述合并，`aria-labelledby` 遵循字段自身的标签（AR1）。`container*` 到达 Field 盒，`control*` 到达控件盒。根级 `xstyle`、`className` 与 `style` 不被接受；未加类型标注的此类属性会被丢弃并给出开发警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `family:input-fields` FR10；当前测试                                                                 |
| FR14 | 控件盒带有 `astryx-text-input`，并反映 `data-size`、设置时的 `data-status`、禁用时的 `data-disabled` 与只读时的 `data-readonly`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `architecture:component-theming-surface`；当前测试                                                   |
| FR15 | input 没有最小行内尺寸，因此一行可以压缩整个字段。末端控件（清除、Spinner、状态图标）是 input 之后的行内流项目，绝不与它的文本重叠。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `family:input-fields` FR1, FR2；当前测试                                                             |
| FR16 | `enterKeyHint`、`inputMode`、`autoCapitalize`、`hasAutoCorrect` 与 `hasSpellCheck` 都是可选的。已设置的属性会在 input 上渲染其原生属性：`enterkeyhint`、`inputmode`、`autocapitalize`、`autocorrect="on"` 或 `"off"`、`spellcheck="true"` 或 `"false"`；未设置的属性不渲染任何属性，因此浏览器保留自己的键盘。`enterKeyHint`、`inputMode` 与 `autoCapitalize` 接受封闭联合类型 `EnterKeyHint`、`InputMode` 与 `AutoCapitalize`，它们从包入口导出，不会放宽为 `string`，因此 TypeScript 拒绝其他任何取值；`hasAutoCorrect` 与 `hasSpellCheck` 是开/关布尔值。它们只选择触摸键盘、其 Return 键标签、大小写、纠错与拼写检查标记：无论键上写什么，Enter 都遵循 FR10，值、校验与提交都不改变。它们以及 `search`、`tel`、`url` 类型属于 Web 契约；Swift 契约仅在其字段应用它的地方携带其中一项（`component:swift/TextInput` FR6）。 | DEC-1；`architecture:public-component-api` INV2, INV3, INV25；`spec:AST-082` FR3, DEC-14             |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以通过 `text-input` 及其状态重设控件盒样式，而不改变行为。
- **AV2 — 起始图标。** 任何图标都可以填充该槽位。

### Representative states

| 状态             | 必需不变式                                                                                                 | 允许的变体 |
| ---------------- | ---------------------------------------------------------------------------------------------------------- | ---------- |
| 空值带占位符     | 带标签的 input；占位符可见。                                                                               | 尺寸。     |
| 带 Action 的输入 | Action 挂起期间显示提议值，当其与 `value` 不一致时显示 Spinner 与 `aria-busy`；Action 落定后显示 `value`。 | —          |
| 带消息的错误     | 错误边框与图标；`aria-invalid`；消息被描述。                                                               | 位置。     |
| 带原因的禁用     | `aria-disabled`；可聚焦；只读；不提交；聚焦时显示原因提示框。                                              | —          |
| 只读             | 完全不透明；提交；不可改变。                                                                               | —          |
| 在 InputGroup 中 | 无 Field；隐藏标签为 input 命名；无消息盒。                                                                | 组几何。   |

### Transformation and precedence order

- **ORD1 — 可用性。** 禁用（自身或外层 InputGroup），然后只读，然后可编辑。
- **ORD2 — 变更。** 先 `onChange`，然后（除非被阻止）乐观值与 `changeAction`。
- **ORD3 — 描述。** 独立使用：调用方 `aria-describedby`，然后是描述、状态消息（当消息盒渲染时）、状态提示框与禁用原因。在 InputGroup 内：调用方 `aria-describedby`，然后是组的描述与状态消息，然后是 TextInput 自己的 id；TextInput 自己的 `description` 在那里不渲染，但其 id 仍被引用。
- **ORD4 — 尺寸。** 显式 `size`，然后最近的尺寸提供者，然后 `md`。

### Performance and resources

- **PR1 — 无测量。** TextInput 不添加观察器或测量；末端控件是行内流 flex 项目。

## Accessibility contract

- **AR1 — 名称与描述。** 独立使用时，Field 的原生标签为 input 命名；在 InputGroup 内，`aria-labelledby` 先用组标签为它命名，然后是其自身视觉隐藏的标签。调用方的 `aria-labelledby` 排在该标签之后：独立使用时是 Field 标签，在 InputGroup 内是组标签与 input 标签。它按 ORD3 被描述，包括 InputGroup 内的组描述与状态消息。
- **AR2 — 状态。** 实际必填时为 `aria-required`，错误时为 `aria-invalid`，忙碌期间为 `aria-busy`，禁用期间为 `aria-disabled`。
- **AR3 — 禁用可达性。** FR6 与 FR7 满足 `spec:AST-085` FR1、FR5 与 FR6。
- **AR4 — 不依赖颜色的状态。** 在 InputGroup 之外，每种状态都必须显示颜色之外的线索（WCAG 2.2 1.4.1）：`attached` 与 `tooltip` 在控件上显示字形，`detached` 带消息时在消息盒中显示字形。在 InputGroup 之外，错误必须以文本标识（WCAG 2.2 3.3.1）；在 InputGroup 内，由组自身的状态承载文本。实现缺口：TextInput 接受没有消息的错误状态，而没有消息的 `detached` 状态只显示带颜色的边框。
- **AR5 — 焦点缩放下限。** FR11。
- **AR6 — 搜索字段。** 使用 `type="search"` 时原生 input 具有 searchbox 角色，因此屏幕阅读器会播报一个搜索字段。

## Design relationships

| 结构或状态 | 设计要求                                                | 表现形式权威   | 层级角色 | 组件契约 |
| ---------- | ------------------------------------------------------- | -------------- | -------- | -------- |
| 标签       | 控件上方的 Field 标签，或隐藏。                         | 当前源码       | 突出     | FR1      |
| 描述       | Field 辅助文本。                                        | 当前源码       | 辅助     | FR1      |
| 起始图标   | input 之前的小号次要图标。                              | 当前源码与测试 | 辅助     | FR12     |
| 占位符     | 空值时使用次要颜色的提示。                              | 当前源码       | 辅助     | FR2      |
| 清除按钮   | 值可编辑时的尾部清除控件。                              | 当前源码与测试 | 辅助     | FR5      |
| Spinner    | 忙碌期间的尾部装饰性 Spinner。                          | 当前源码       | 辅助     | FR4      |
| 状态图标   | 尾部状态图标（attached、tooltip）；`tooltip` 下为按钮。 | 当前源码与测试 | 辅助     | FR9      |

`design:reduced-motion` 管辖清除按钮的按下缩放（FR5）；没有其他设计记录管辖 TextInput。控件盒带有 `text-input`；使用方结构未命名控件盒部件，因此本记录不携带结构-主题映射。

## Family and system relationships

- `family:input-fields` 拥有行内尺寸稳定性、末端控件、分组准入、禁用原因、input 忙碌、Transition Action、状态位置、焦点缩放下限、属性目标与清除提示框；TextInput 采用它们，但存在 FR5 缺口。
- `spec:AST-085` 拥有禁用可聚焦性；TextInput 满足它。
- `spec:AST-086` FR8 拥有忙碌播报。
- `architecture:component-size-cascade` 拥有尺寸继承。

## Verification map

| 契约           | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                  | 代表性状态                                                                  | 变更或失败预期                                                                                                                                   | 审计小节                        |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------- |
| FR1, AR1       | `TextInput.test.tsx` 的标签、工具提示与分组用例；`InputGroup.test.tsx` 的分组名称与描述用例；`TextInput.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                        | 独立使用、隐藏标签、在分组中                                                | 名称丢失、分组名称或描述错误，或悬空的描述 id 都会失败。证据缺口：没有测试断言可选标记或独立使用时的描述。                                       | `audit:TextInput/accessibility` |
| FR2, FR3       | `TextInput.test.tsx` 的 change、form、autoComplete、autofocus 用例                                                                                                                                                                                                                                                                                                                                                                    | 输入；表单提交                                                              | 错误的 `onChange` 载荷或缺失的 `name` 会失败。证据缺口：没有测试断言 `type`，也没有测试断言 `changeAction` 在 `onChange` 之后以乐观值运行。      | `audit:TextInput/behavior`      |
| FR4            | 证据缺口：没有 TextInput 测试覆盖待定 Action 的乐观值与忙碌播报                                                                                                                                                                                                                                                                                                                                                                       | —                                                                           | —                                                                                                                                                | `audit:TextInput/behavior`      |
| FR5            | `TextInput.test.tsx` 的 clear 与 clear-focus 套件                                                                                                                                                                                                                                                                                                                                                                                     | 键盘与指针清除；空；禁用                                                    | 空或禁用字段上出现清除按钮，或焦点丢失，会失败。证据缺口：没有测试在减少动态效果下按下清除按钮。                                                 | `audit:TextInput/behavior`      |
| FR6–FR8, AR3   | `TextInput.test.tsx` 的 disabled、disabledMessage、read-only 与 form 套件；`InputGroup.test.tsx` 的 disabled 传播用例                                                                                                                                                                                                                                                                                                                 | 禁用、带原因、只读、两者                                                    | Tab 停靠点丢失、禁用值被提交、调用方处理器被调用，或编辑被允许，都会失败。证据缺口：没有测试断言变暗的绘制。                                     | `audit:TextInput/accessibility` |
| FR9            | `TextInput.test.tsx` 的 status 与 statusVariant 套件                                                                                                                                                                                                                                                                                                                                                                                  | 每种类型；每种位置；在分组中                                                | 缺失图标、`aria-invalid` 或描述会失败。证据缺口：没有测试断言状态边框的绘制。                                                                    | `audit:TextInput/accessibility` |
| FR10           | `TextInput.test.tsx` 的 onEnter 与 onKeyDown 套件                                                                                                                                                                                                                                                                                                                                                                                     | 回车；IME 提交；其他按键                                                    | IME 提交期间的 `onEnter` 会失败。                                                                                                                | `audit:TextInput/behavior`      |
| FR11, FR15     | `TextInput.test.tsx` 的文字尺寸与窄行用例                                                                                                                                                                                                                                                                                                                                                                                             | 在 iOS 门槛之外；窄筛选栏                                                   | iOS 之外出现下限，或字段溢出其所在行，会失败。证据缺口：没有测试断言各尺寸的高度、尺寸优先级，或端点控件绝不会与文字重叠。没有测试断言分组高度。 | `audit:TextInput/layout`        |
| FR12           | `TextInput.test.tsx` 的起始图标与点击聚焦用例                                                                                                                                                                                                                                                                                                                                                                                         | 图标；包裹层内边距                                                          | 点击未使输入框聚焦会失败。证据缺口：没有测试断言起始图标的大小或颜色。                                                                           | `audit:TextInput/behavior`      |
| FR13           | `TextInput.fr10.test.tsx`；`TextInput.test.tsx` 的调用方 `aria-labelledby` 用例                                                                                                                                                                                                                                                                                                                                                       | 独立使用与在分组中                                                          | 基础 prop 未落到 input 上，或样式作用在错误的部分，会失败。                                                                                      | `audit:TextInput/api`           |
| FR14           | `TextInput.test.tsx` 的主题状态套件                                                                                                                                                                                                                                                                                                                                                                                                   | 禁用与只读                                                                  | 缺失状态属性会失败。证据缺口：没有测试断言 `data-size` 或 `data-status`。                                                                        | `audit:TextInput/theming`       |
| AR4            | `TextInput.a11y.chromium.spec.ts` 及其记录的已知失败                                                                                                                                                                                                                                                                                                                                                                                  | 无消息的错误                                                                | 当缺口闭合时，该已知失败将不再匹配。证据缺口：没有测试渲染无消息的 `detached` 状态。                                                             | `audit:TextInput/accessibility` |
| FR16, DEC-1    | `TextInput.test.tsx` 的触摸键盘特征套件（每个 prop 设置与未设置、`hasAutoCorrect` 与 `hasSpellCheck` 的开与关、在每个 `enterKeyHint` 下回车都调用 `onEnter`）与类型套件（`search`、`tel` 和 `url`）；`textEntryTraits.test.ts`；由 `pnpm typecheck` 运行的 `textEntryTraits.public.test.ts`，用于从包入口导出的联合类型拒绝任意或未收窄的字符串；`TextInputKeyboardTraits.a11y.chromium.spec.ts`，用于一次点击所聚焦的 input 上的属性 | 每个 prop 设置与未设置；每种 `type`；在 `send` 下回车；带触摸仿真的手机视口 | 未设置时出现属性、属性被丢弃或重命名、在任何标签下跳过 `onEnter`、值类型接受 `string`，或缺失导出，都会失败。                                    | `audit:TextInput/api`           |
| AR6            | `TextInput.test.tsx` 的类型套件（`type="search"` 渲染 searchbox）；`TextInputKeyboardTraits.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                    | `type="search"`                                                             | 缺少 searchbox 角色的搜索字段会失败。                                                                                                            | `audit:TextInput/accessibility` |
| ORD1–ORD3, PR1 | ORD1 与 ORD2 由 FR3 和 FR6–FR8 行覆盖。证据缺口：没有测试断言描述顺序或不进行测量                                                                                                                                                                                                                                                                                                                                                     | —                                                                           | —                                                                                                                                                | `audit:TextInput/behavior`      |

## Current-state impact

- **无文字的报错（AR4）。** TextInput 接受没有消息的错误状态，因此错误仅通过颜色和图标显示，这违反 WCAG 2.2 3.3.1。无障碍套件将其记录为已知失败。
- **仅靠颜色的 detached 状态（AR4）。** 没有消息的 `detached` 状态只显示彩色边框，这违反 WCAG 2.2 1.4.1。
- **分组描述（ORD3）。** 在 InputGroup 内部，TextInput 自身的 `description` 不会渲染，但 `aria-describedby` 仍引用其 id。
- **减少动态效果下的清除按下（FR5）。** 当用户偏好减少动态效果时，按下清除按钮仍会缩放到 0.98，这与 `component:Button` FR15 的记录一致，但违反 `design:reduced-motion` DR1。
- **固定高度（FR11）。** 控件保持固定的共享元素高度，而不是随所设置的文字尺寸增长，这违反 `spec:AST-102` FR4。
- **源码注释。** `TextInput.tsx` 中 `size` 的 JSDoc 给出 18 px 与 26 px 的高度；实际交付的高度来自共享元素尺寸（FR11）。

## Decision log

TextInput 适用 `family:input-fields` 与 `spec:AST-085`。

### DEC-1 — Callers choose the touch keyboard

**参考：** `component:TextInput/DEC-1`

**决策者：** `cixzhang`，`2026-11-01`

只有调用方知道某个字段存放的是电话号码、一次性验证码还是用户名，因此键盘、其 Return 键标签、大小写处理、自动更正与拼写检查标记都属于字段自身无法推导的调用方意图（`spec:AST-002` DEC-1）。这些 prop 保留原生名称，开/关型原生属性表现为 `has…` 布尔值（`architecture:public-component-api` INV2），并且每个取值集合都是封闭联合（INV3）。它们只是键盘提示，不是行为 prop：回车做什么仍由 FR10 决定。TextArea 接受相同的 prop（`component:TextArea` FR13），ChatComposerInput 在该决策下接受 `enterKeyHint`（`component:ChatComposerInput` FR17）。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/系统规则，而是链接到它们的归属方。

---
