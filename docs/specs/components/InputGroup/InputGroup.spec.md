---
schema_version: 3
template_version: 7
kind: component
id: component:InputGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/InputGroup/InputGroup.test.tsx,
    packages/core/src/InputGroup/__tests__/InputGroupAudit.a11y.chromium.spec.ts,
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
system_specs: [spec:AST-038, spec:AST-085, spec:AST-102]
---

# InputGroup component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                                          |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约      | 无变更。InputGroup 接受 `label`、`isLabelHidden`、`description`、`isOptional`、`isRequired`、`isDisabled`、`size`、`status`、`labelTooltip`，以及输入与附加组（addon）子元素。    |
| 行为          | 在共享元素高度上，由 Field 标记标签的 `role="group"` 行把已获准的输入、InputGroupText 附加组和 Button 附加组连接成一个整体形状，并为每个分组的输入提供该组的名称与描述。          |
| 终端用户影响  | 用户会把前缀、输入和后缀看作一个字段；屏幕阅读器用户会听到组标签与每个输入自身的标签一起播报。禁用状态的分组会同时禁用其输入与 Button 附加组。                                    |
| 构建者影响    | 无。                                                                                                                                                                              |
| 兼容性/就绪度 | 记录已交付的行为；无 API 或 DOM 变更，也无发生变化的 prop 值。该行保持固定高度，Button 附加组在减少动态效果下缩放，且该行按 FR10 的范围接受根样式；这些都在“当前状态影响”下列出。 |
| 审查检查      | 拒绝以下情况：分组输入丢失组标签或描述；内侧圆角被倒圆；禁用分组中兼容子元素仍可操作；内部输入按钮被重塑为附加组。                                                                |
| 治理规则      | `family:input-fields` FR3、AV3；`architecture:component-size-cascade` INV3–INV8；`spec:AST-085` FR7；`spec:AST-038` FR7、FR8；`spec:AST-102` FR4；`design:reduced-motion` DR1。   |

本表是审查视角的投影；以下正文具有权威性。

## Intent

InputGroup 把输入与前缀、后缀附加组连接成一行，正如 `family:input-fields` 所分配：它拥有行高、连接的外形、边缘对齐，以及该组的标签与支持性文本。使用方的用法位于 `InputGroup.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`；`size="md"`、标签可见、未禁用
- 兼容性类别：记录已交付的行为；无公开 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 组 Field（标签、描述、可选或必需标记、标签 tooltip、分离的状态消息）以及 `role="group"` 行。
- 行高，以及它提供给后代、直到下一个层级边界的尺寸。
- 组上下文，用于告知获准的子元素它们已被分组，以及应组合哪些标签 ID 与描述 ID。
- 直接 Button 附加组的连接几何。
- `input-group` 目标。

**不拥有 / 非目标**

- 每个分组输入自身的适配（隐藏内部标签、不嵌套 Field、分组圆角、状态图标处理）——由该输入在 `family:input-fields` FR3 下拥有。
- 文本附加组——由 `component:InputGroupText` 拥有（本泳道）。
- 哪些输入获准——由各组件在 `family:input-fields` FR3 下决定；仅凭成员资格并不使其获准。
- 禁用不读取该组的调用方自有控件——不提供。

## Public concepts

| Concept | Closed values or states                 | Meaning                  | Availability by variant/orientation/state | Default                 | Owner                  | Stability | Invalid-value behavior    |
| ------- | --------------------------------------- | ------------------------ | ----------------------------------------- | ----------------------- | ---------------------- | --------- | ------------------------- |
| 尺寸    | `sm`、`md`、`lg`                        | 行高与子元素的默认尺寸。 | 始终。                                    | 继承的尺寸，否则为 `md` | `family:input-fields`  | 稳定      | TypeScript 拒绝其他值。   |
| 状态    | `error`、`warning`、`success`、可选消息 | 组的校验状态。           | 始终；消息是分离的。                      | 无                      | `component:InputGroup` | 稳定      | TypeScript 拒绝其他类型。 |
| 禁用    | off、on                                 | 禁用该组及其兼容子元素。 | 始终。                                    | off                     | `component:InputGroup` | 稳定      | 不适用。                  |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Basis                                                                          |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| FR1 | InputGroup 以组标签模式渲染一个 Field，包含 `label`（除非 `isLabelHidden` 否则可见）、`description`、可选或必需标记、`labelTooltip`，以及作为分离消息的 `status`。在其中，该行是单个元素，带 `role="group"`、设置为该标签的 `aria-labelledby`，以及设置为存在的描述与状态消息 ID 的 `aria-describedby`。                                                                                                                                                                                                                         | `family:input-fields` FR3；当前测试                                            |
| FR2 | 分组输入通过上下文接收标签 ID 与描述 ID。每个获准的输入由组标签加上其自身标签来命名，并由组的描述与状态加上其自身的描述与状态来描述。                                                                                                                                                                                                                                                                                                                                                                                            | `family:input-fields` FR3；当前测试                                            |
| FR3 | 该行为 inline-flex、拉伸且透明；其高度是该尺寸下的共享元素高度，作为最小值，该最小值会随设置的文本尺寸在 `spec:AST-102` FR4 下增长。实现缺口：高度固定为该尺寸。它把解析后的尺寸提供给后代，直到下一个层级边界（`spec:AST-038` FR7、FR8）：显式 `size`，然后是最近的外层 provider，然后是 `md`。                                                                                                                                                                                                                                 | `family:input-fields` FR3；`architecture:component-size-cascade`；当前源码     |
| FR4 | 直接 Button 附加组加入该形状：朝邻居的内侧圆角不倒圆，占满行高，且其键盘焦点环提升到相邻成员之上。分组输入更内部的按钮（清除、日历、展开）以及包裹在 Tooltip 或 HoverCard 中的 Button 附加组（不是直接子元素）保持自身形状。其后的 popover、template 或 dialog 元素不计为邻居。附加组是 ButtonGroup 之外的 `component:Button`，因此在减少动态效果下绝不能应用其按压缩放（`design:reduced-motion` DR1）。实现缺口：在减少动态效果下它仍会应用。                                                                                   | 当前源码；`design:reduced-motion` DR1                                          |
| FR5 | Field 盒子内带 `role="group"` 的行携带 `astryx-input-group`，并反映 `data-size` 与 `data-status`。`ref`、`data-testid` 和其他 DOM props 会到达该行。InputGroup 组合了 Field，因此 `family:input-fields` FR10 禁止根级 `xstyle`、`className` 和 `style`。实现缺口：它们被接受并到达该行。                                                                                                                                                                                                                                         | `architecture:component-theming-surface`；`family:input-fields` FR10；当前测试 |
| FR6 | 当自身的 `isDisabled` 或包住它的 InputGroup 的 `isDisabled` 为 true 时，该组被禁用。禁用的组会在该行上设置 `aria-disabled="true"`，以默认光标将其调暗为半透明，把禁用状态传给组 Field，并禁用每个兼容子元素（TextInput、NumberInput、Selector、MultiSelector、DateInput、TimeInput、Typeahead、Tokenizer 作为 `family:input-fields` FR3 下的获准成员，以及 Button 附加组）和嵌套组，直到下一个层级边界；每个子元素随后遵循其自身的禁用契约。自行禁用的子元素或嵌套组在该组启用时仍保持禁用。不读取该组的调用方自有控件不受影响。 | `spec:AST-085` FR7；`spec:AST-038` FR7、FR8；当前测试                          |

### Allowed variation

- **AV1 — Members.** 任何获准的输入、InputGroupText、Button 以及由 Button 触发的控件可以任意顺序出现。
- **AV2 — Status paint.** 主题可以依据 `data-status` 为组着色；核心不会为其绘制组边框。

### Representative states

| State                | Required invariant                             | Allowed variation |
| -------------------- | ---------------------------------------------- | ----------------- |
| 前缀文本 + TextInput | 一行；仅外侧圆角；输入由组标签与自身标签命名。 | 尺寸。            |
| 输入 + Button 后缀   | Button 占满高度，朝向输入的一侧为方形。        | 变体。            |
| 带描述与状态         | 组与输入都由两者描述；消息分离于下方。         | —                 |
| 隐藏标签             | 标签在视觉上隐藏；仍为组命名。                 | —                 |

### Transformation and precedence order

- **ORD1 — Size.** 显式 `size`，然后是外层 provider，然后是 `md`；分组输入自身显式的 `size` 对该输入仍然优先。
- **ORD2 — Description.** 组描述，然后是组状态消息。

### Performance and resources

- **PR1 — No measurement.** 几何来自 CSS 选择器；InputGroup 不添加任何 observer 或 listener。

## Accessibility contract

- **AR1 — Group name.** `role="group"` 由可见或隐藏的标签标记（FR1）。
- **AR2 — Input names.** 每个获准的输入把组标签与自身标签组合，使其用途保持具体（FR2）。
- **AR3 — Focus.** 获得焦点的成员被提升到相邻成员之上，使其焦点呈现不被覆盖。

## Design relationships

| Anatomy or state | Design requirement                  | Representation authority | Hierarchy role | Component contract |
| ---------------- | ----------------------------------- | ------------------------ | -------------- | ------------------ |
| 标签             | 组标签位于行上方，或被隐藏。        | 当前源码                 | 突出           | FR1                |
| 前缀附加组       | 输入之前的文本或 Button，与其连接。 | 当前源码                 | 支持           | FR4                |
| 输入             | 获准的输入，填满剩余宽度。          | 当前源码                 | 突出           | FR2                |
| 后缀附加组       | 输入之后的文本或 Button，与其连接。 | 当前源码                 | 支持           | FR4                |

`design:reduced-motion` 治理 Button 附加组的按压缩放（FR4）；没有其他设计记录治理 InputGroup。该行携带 `input-group`；使用方结构不命名任何行部件，因此本记录不携带结构主题映射。

## Family and system relationships

- `family:input-fields` 把行高、连接表面、边缘对齐和组焦点分配给 InputGroup；准入仍由每个输入负责。
- `component:InputGroupText` 提供文本附加组。
- `component:Button` 依据组上下文应用 FR4 的附加组几何。
- `architecture:component-size-cascade` 拥有尺寸继承（FR3）。

## Verification map

| Contract               | Verification                                                                                                                                          | Representative states                                                            | Mutation or failure expectation                                                                                                                                      | Audit section                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1、AR1               | `InputGroup.test.tsx` 的标签、描述、状态、隐藏标签、标记和标签 tooltip 用例；`InputGroupAudit.a11y.chromium.spec.ts` 的标签、隐藏标签、描述和状态用例 | 可见与隐藏标签；可选与必需标记；标签 tooltip；描述与状态                         | 缺失组名称或描述、缺失标记或标签 tooltip、隐藏标签却显示、或状态消息未出现在描述中或未位于行下方，均失败。                                                           | `audit:InputGroup/accessibility` |
| FR2、AR2               | `InputGroup.test.tsx` 的分组输入命名用例以及分组 DateInput 语义用例                                                                                   | TextInput、NumberInput、DateInput、Typeahead、Tokenizer、Selector、MultiSelector | 丢失组标签或自身标签的分组输入失败。                                                                                                                                 | `audit:InputGroup/accessibility` |
| FR4                    | `InputGroupAudit.a11y.chromium.spec.ts` 的连接圆角与成员高度检查                                                                                      | Button 附加组组合；前缀与后缀；从右到左                                          | 朝邻居倒圆的成员、本应倒圆却为方形的外角、或短于行的成员，均失败。证据缺口：没有测试覆盖被包裹的附加组或减少动态效果下的按压；`component:Button` 验证其自身一侧。    | `audit:InputGroup/layout`        |
| FR5                    | `InputGroup.test.tsx` 的行反射与 data-testid 用例                                                                                                     | 根；`size` 与 `status`                                                           | 缺失 `astryx-input-group` 目标、`data-size` 或 `data-status`，未到达该行的 `ref`，或丢失的测试 ID，均失败。证据缺口：没有测试断言 `className`、`style` 或 `xstyle`。 | `audit:InputGroup/theming`       |
| FR6                    | `InputGroup.test.tsx` 的禁用传播用例                                                                                                                  | 每个兼容输入与 Button 附加组；嵌套组；重新启用且带有显式禁用子元素的组           | 禁用组中仍可操作的子元素、选择退出的嵌套组、或重新启用后仍显式禁用的子元素，均失败。                                                                                 | `audit:InputGroup/behavior`      |
| FR3、ORD1              | `InputGroup.test.tsx` 的尺寸优先级用例；`InputGroupAudit.a11y.chromium.spec.ts` 的行高检查                                                            | 显式 `size`、外层 provider 与未给出 `size`；`sm`、`md`、`lg` 行                  | 忽略 prop 或 provider 的尺寸、不采用组尺寸的输入、或未从 `sm` 增长到 `lg` 的行，均失败。证据缺口：没有测试断言在设置的文本尺寸下增长（FR3 的缺口）。                 | `audit:InputGroup/layout`        |
| FR6（绘制）、ORD2、AR3 | `InputGroupAudit.a11y.chromium.spec.ts` 的禁用、描述和焦点用例；`InputGroup.test.tsx` 的描述顺序用例                                                  | 禁用组；描述后接状态；两个相邻成员各自的键盘焦点                                 | 非半透明且非箭头光标的禁用行、位于描述之前的状态消息、或未位于每个未聚焦成员之上的聚焦成员，均失败。                                                                 | `audit:InputGroup/behavior`      |
| PR1                    | 证据缺口：没有测试断言不存在 observer                                                                                                                 | —                                                                                | —                                                                                                                                                                    | `audit:InputGroup/behavior`      |

## Current-state impact

- **固定高度（FR3）。** 该行保持固定的共享元素高度，而不随设置的文本尺寸增长，违反 `spec:AST-102` FR4。
- **减少动态效果下的附加组按压（FR4）。** 当用户偏好减少动态效果时，Button 附加组在按压时缩放到 0.98，正如 `component:Button` FR15 所记录，违反 `design:reduced-motion` DR1。
- **根样式（FR5）。** InputGroup 在其行上接受根 `className`、`style` 和 `xstyle`，违反 `family:input-fields` FR10 的范围。FR10 第 3 项把 InputGroup 命名为调用方的样式表面，而家族覆盖测试 `Field/fieldInputFamily.test.tsx` 将 InputGroup 排除在其字段输入之外，因此该缺口可能通过澄清 FR10 而非更改代码来关闭。

## Decision log

无组件本地决策。InputGroup 应用 `family:input-fields`。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审查结果、实现步骤或家族/系统规则。它链接到它们的所有者。
