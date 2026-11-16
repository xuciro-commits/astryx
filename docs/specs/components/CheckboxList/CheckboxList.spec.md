---
schema_version: 3
template_version: 7
kind: component
id: component:CheckboxList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    interaction,
    motion,
    theming,
    styling,
    accessibility,
    visual,
    react-runtime,
    compatibility,
  ]
verified_by:
  [
    packages/core/src/CheckboxList/CheckboxList.test.tsx,
    packages/core/src/CheckboxList/__tests__/CheckboxList.a11y.chromium.spec.ts,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.test.tsx,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/CheckboxList/CheckboxList.fr10.test.tsx,
    packages/core/src/CheckboxList/CheckboxList.required.test.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:input-fields]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-011, spec:AST-021, spec:AST-038, spec:AST-085]
---

# CheckboxList component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `CheckboxList` 是一个带标签的 `role="group"`，由 `CheckboxListItem` 行组成。一个 `value` 数组会选择受控集合模式（`onChange`、`changeAction`）；没有它时，其条目各自独立。组拥有命名、描述、禁用、禁用原因、只读、待处理值和状态。每个选项的行为属于 `component:CheckboxListItem`。                                                                                              |
| Behavior                | 该组为其选项命名并给出描述，跟踪每个 `changeAction` 处于待处理状态的值，使每个正在保存的选项保持忙碌而其他选项仍可交互，并把禁用、只读和状态应用到每个选项。                                                                                                                                                                                                                    |
| End-user impact         | 人们可以识别该组，通过指针、触摸和键盘操作每个选项，了解某个组为何不可用，并看到哪些选项仍在保存。                                                                                                                                                                                                                                                                              |
| Builder impact          | 构建者通过传入 `value` 选择集合模式，然后提供稳定的条目 `value`。渲染不带消息的状态在此仍是一个开放问题（OQ3）；每个选项的开放问题见 `component:CheckboxListItem`。                                                                                                                                                                                                             |
| Compatibility/readiness | 新增 `isOptional`（FR16）与 `isRequired`（FR17），两者默认均为 `false`。在错误状态下，每个复选框获得 `aria-invalid`；没有其他 API、默认值或 DOM 变化。                                                                                                                                                                                                                          |
| Review checks           | 否决以下情况：某个待处理值在另一个选项被切换时失去其忙碌状态或重新切换防护，组命名或描述 id 被丢弃，在组禁用或只读时发生切换，或引入没有所有者决策的新目标或状态 API。每个选项的检查见 `component:CheckboxListItem`。                                                                                                                                                           |
| Governing rules         | `architecture:public-component-api/INV1–INV9`; `architecture:component-theming-surface/INV3–INV6`; `architecture:interaction-modality/INV1–INV5`; `architecture:component-test-sufficiency/INV1–INV7`; `architecture:knowledge-contracts/INV2`; `spec:AST-021/FR8–FR10`; `spec:AST-038/FR7`; `spec:AST-085/FR1, FR7`; `family:input-fields/FR10`; WCAG 2.2 1.3.1, 2.1.1, 4.1.2. |

此表是审查投影；下面的正文具有权威性。

## Intent

呈现一组小的、带标签的独立复选框选项，其选中、可用、只读、忙碌和状态在指针、触摸、键盘和辅助技术之间保持一致。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：新增 `isOptional`（FR16）与 `isRequired`（FR17），各自默认 `false`；没有其他公共 prop、默认值或导出变化；在错误状态下每个复选框获得 `aria-invalid`
- 受控/非受控行为：集合模式由 `value` 控制；独立条目遵循 `component:CheckboxListItem`；不存在非受控模式
- 迁移决策：无

使用方迁移说明应放在使用方文档和发布说明中。

## Ownership boundary

**拥有**

- 带标签的复选框组、其 `checkbox-list` 目标、组的描述、状态与禁用原因关系，以及其基础、`container*` 与 `control*` props 的落点。
- 与 CheckboxListItem 共享的集合状态：选中成员关系、变更排序、乐观待处理值，以及组级可用性。
- 组合出的选项解剖结构及其目标归属（见下文“Theming anatomy”）。

**不拥有 / 非目标**

- 每个选项的行为——其复选框、命名与描述、独立模式、行表面委托与 `onClick` 路由、条目禁用与加载状态、密度尺寸，以及选中行填充——由 `component:CheckboxListItem` 拥有。
- 列表与选项行的呈现——由 `component:List` 拥有；其 `list-item` 目标只到达行根。
- 复选框控件、其指示器、聚焦环与按压覆盖层——由 `component:CheckboxInput` 与 CheckboxIndicator 拥有。
- 组标签与校验消息的呈现——由 `family:input-fields`（共享所有者部分）下的 Field 与 `component:FieldStatus` 拥有。
- 加载指示器的呈现——由 `component:Spinner` 拥有；提示框行为——由 `useTooltip` 拥有。
- 为行、描述或调用方内容引入的新目标或反射状态。

## Public concepts

| Concept          | Closed values or states                                     | Meaning                                                                                        | Availability by variant/orientation/state | Default                   | Owner                | Stability                    | Invalid-value behavior                          |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------- | ------------------------- | -------------------- | ---------------------------- | ----------------------------------------------- |
| group naming     | `label`、`isLabelHidden`、`description`                     | 为 `role="group"` 命名并给出描述；隐藏标签仍为其命名。                                         | 所有状态。                                | label 必填；可见          | 调用方与 Field       | 稳定                         | 由公共类型拒绝                                  |
| optionality      | `isOptional`、`isRequired`                                  | 在组标签之后显示 Field 的可选或必填指示；`isRequired` 还要求勾选一个框（FR17）。               | 所有状态。                                | false                     | 调用方与 Field       | 稳定                         | 仅布尔值                                        |
| collection value | 存在或不存在 `value` 数组                                   | 存在：组为其条目拥有选中成员关系与变更处理。不存在：其条目各自独立。                           | 所有状态。                                | 不存在                    | 调用方与组件         | 稳定                         | 集合模式下缺少 `value` 的条目会抛错（item FR4） |
| change path      | `onChange`、`changeAction`、两者、皆无                      | 报告下一个值数组；`changeAction` 在带乐观值的 transition 中于 `onChange` 之后运行。            | 集合模式。                                | 皆无                      | 调用方与组件         | 已发布；无处理器时的含义未定 | 无处理器意味着没有组件拥有的变更                |
| availability     | enabled、`isDisabled`、带 `disabledMessage` 的 `isDisabled` | 阻止每个条目切换，条目仍可通过 `aria-disabled` 获得焦点；原因会添加组提示框。                  | 原因仅在 `isDisabled` 时适用。            | enabled                   | 组件                 | 稳定                         | 没有 `isDisabled` 的原因不渲染任何内容          |
| read-only        | `isReadOnly`                                                | 使每个条目只读。                                                                               | 组级。                                    | false                     | 组件                 | 稳定                         | 仅布尔值                                        |
| pending values   | 其 `changeAction` 处于待处理状态的值                        | 每个待处理值的条目渲染为忙碌；切换另一个条目不会清除它；并发的值一起结算。                     | 带 `changeAction` 的集合模式。            | 无                        | 组件                 | 稳定                         | 仅 transition 状态                              |
| status           | `warning`、`error`、`success`，可选消息                     | 消息在列表之后渲染一个分离的 FieldStatus 并描述该组；错误会让每个复选框 `aria-invalid`。       | 所有状态。                                | 无                        | 调用方与 FieldStatus | 已发布                       | 没有消息的状态不渲染任何内容                    |
| row layout       | `density` compact/balanced/spacious；`hasDividers`；`width` | 密度到达 List 及其行；分隔线分隔行；宽度同时决定标签、列表和状态的尺寸。                       | 所有状态。                                | balanced；none；intrinsic | 组件与 List          | 稳定                         | 由公共类型拒绝                                  |
| pass-through     | CheckboxList 其余 props、`ref`、`container*`、`control*`    | 基础 props 和 `ref` 到达 `role="group"`；`container*` 到达 Field 盒子；`control*` 到达组元素。 | 所有状态。                                | 无                        | 组件                 | 稳定                         | 根 `xstyle`、`className`、`style` 不被接受      |

条目 props（`label`、`aria-label`、`description`、`endContent`、`isChecked`、`onCheck`、条目 `isDisabled`、`isLoading` 以及条目透传）是 `component:CheckboxListItem` 的概念。

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                | Basis                                                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 渲染 MUST 将 CheckboxListItem 子节点放在 List 内，该 List 位于由组标签通过 `aria-labelledby` 命名的 `role="group"` 内；其 `aria-describedby` MUST 按该顺序列出调用方描述（若有），然后是存在的描述、状态消息和禁用原因提示框。                                                                                                                                                                                           | 已发布源码；聚焦测试；WCAG 1.3.1 与 4.1.2                                                                                        |
| FR2  | CheckboxList 根 MUST 携带当前的 `checkbox-list` 目标。                                                                                                                                                                                                                                                                                                                                                                   | 已发布源码与公共文档                                                                                                             |
| FR4  | 状态消息 MUST 通过列表之后的分离 FieldStatus 渲染。                                                                                                                                                                                                                                                                                                                                                                      | 已发布源码、聚焦测试以及 Chromium 无障碍套件                                                                                     |
| FR6  | 带有 `value` 数组时，组 MUST 向其条目提供成员关系，用条目提议的下一个数组调用 `onChange`（`component:CheckboxListItem` FR4），然后在带乐观值的 transition 中用同一数组运行 `changeAction`。                                                                                                                                                                                                                              | 已发布源码与聚焦测试                                                                                                             |
| FR7  | 组 MUST 跟踪每个 `changeAction` 处于待处理状态的值并将其暴露给条目，每个条目渲染为忙碌（`component:CheckboxListItem` FR7）；切换另一个条目 MUST NOT 清除较早的待处理值。并发的待处理值一起结算，之后所有忙碌状态清除。                                                                                                                                                                                                   | 已发布的公共 `changeAction` promise；聚焦回归测试；Chromium 无障碍套件                                                           |
| FR9  | 组 `isDisabled` MUST 通过 `aria-disabled` 让每个复选框成为可聚焦禁用（`component:CheckboxInput` FR4）并拒绝切换，且 MUST 在 `role="group"` 元素上设置 `aria-disabled="true"`，如同 `component:ButtonGroup` FR1 所做。使用 `disabledMessage` 时，原因提示框在组悬停和键盘聚焦时打开，且原因 MUST 描述每个可聚焦复选框（`spec:AST-085` FR5、FR7）。实现缺口：原因只描述 `role="group"`，因此获得焦点的复选框不会被它描述。 | `spec:AST-085` FR1、FR7；已发布源码、聚焦测试以及共享复选框绑定                                                                  |
| FR10 | 组 `isReadOnly` MUST 使组内每个条目只读（`component:CheckboxListItem` FR8 与 FR10）。                                                                                                                                                                                                                                                                                                                                    | 已发布源码；共享复选框绑定；`spec:AST-011` 只读词汇                                                                              |
| FR13 | `density` MUST 到达 List 及其行（复选框尺寸遵循 `component:CheckboxListItem` FR11）；`hasDividers` MUST 分隔行且最后一行之后没有分隔线；`width` MUST 同时决定标签、列表和状态的尺寸。                                                                                                                                                                                                                                    | 已发布源码、文档以及 Chromium 无障碍套件                                                                                         |
| FR14 | 带消息的错误 `status` 会将其渲染（FR4），且错误 `status` 会使每个复选框 `aria-invalid="true"`，因此当每个复选框获得焦点时屏幕阅读器会宣告无效状态。实现缺口：没有消息的状态不渲染任何内容；其含义是 OQ3。                                                                                                                                                                                                                | 已发布源码；`spec:AST-002/FR15`                                                                                                  |
| FR15 | 基础 props（包括 ARIA 与 `ref`）MUST 到达 `role="group"`；调用方 `aria-labelledby` 与组标签合并，调用方 `aria-describedby` 排在最前。`container*` MUST 到达渲染出的 Field 盒子（在 `horizontal-labels` FormLayout 中不会渲染，此时 `container*` 无效并发出警告），`control*` 到达组元素；根 `xstyle`、`className` 和 `style` 不被接受。                                                                                  | `family:input-fields` FR10；`CheckboxList.fr10.test.tsx`                                                                         |
| FR16 | `isOptional` MUST 以 `isOptional` 到达组的 Field，因此组标签会显示可选指示，除非最近的 `FormLayout` 将字段默认为可选（`component:FormLayout` FR5）。空选择就是一个答案，因此复选框组不从表单默认值取得必填状态（`component:FormLayout` FR5 的例外）：无论是否带 `isOptional`，其复选框都不因此携带 `aria-required`，表单默认值也不会给它们原生 `required`。                                                              | CheckboxInput 与 RadioList 一致性；WAI-ARIA 1.2 的 `group` 没有 `aria-required`，而每个复选框上的 `aria-required` 会要求每个选项 |
| FR17 | `isRequired` 将组标记为必填。其名称按每个输入字段都遵循的相同规则显示输入字段的必填标记（`family:input-fields`），因此当表单默认已把字段标记为必填时，不显示标记，如同任何字段。当没有复选框被勾选时，第一个既未禁用也未只读的复选框携带原生 `required`，因此浏览器会阻止提交并用自身的消息聚焦它；一旦任何框被勾选，就没有框携带 `required`。空组即缺失；应用的 `status` 仍是可见错误文本，Astryx 不添加自己的消息。    | 所有者决策；`family:input-fields`；HTML 约束校验                                                                                 |

按选项的要求由 `component:CheckboxListItem` 拥有（`architecture:knowledge-contracts/INV2`）。

### Allowed variation

- **AV1 — 组内容。** 标签、描述、状态消息和宽度可在其公共类型范围内变化。
- **AV2 — 主题绘制。** `checkbox-list` 目标与组合出的组目标可以在不改变语义或状态优先级的前提下更改被允许的视觉属性。

选项变化见 `component:CheckboxListItem` AV1–AV3。

### Representative states

| State          | Required invariant                                         | Allowed variation    |
| -------------- | ---------------------------------------------------------- | -------------------- |
| 默认集合       | 命名组、选项列表和行都会渲染；成员关系到达每个条目         | 选项内容与选中值     |
| 待处理值       | 每个待处理值使其条目保持忙碌，直到所有待处理值结算         | 哪些选项处于待处理   |
| 带原因的组禁用 | 复选框保持可聚焦且不可操作；原因可通过悬停、聚焦和 AT 到达 | 原因文本             |
| 组只读         | 每个条目都是只读                                           | 哪些值被勾选         |
| 带消息的组状态 | 分离的 FieldStatus 跟在组之后并描述它                      | 错误、警告或成功状态 |

### Transformation and precedence order

- **ORD1 — 选中状态。** 集合 `value` → 乐观待处理值 → 每个条目读取的成员关系（`component:CheckboxListItem` ORD1）。
- **ORD2 — 切换。** 条目提议的下一个数组（`component:CheckboxListItem` ORD2）→ `onChange` → 在把被切换值加入待处理集合的 transition 中运行 `changeAction`。
- **ORD3 — 可用性。** 组禁用优先，并让每个复选框保持可聚焦；组原因添加提示框，而非可操作性；组只读仅适用于变更。

### Performance and resources

- **PR1 — 有界资源。** 组件自身不拥有任何观察器或全局监听器。提示框监听器的作用域限于组元素及其生命周期。必填组（FR17）在其生命周期内将选项注册到 Core 的共享变更观察器，因此重排会更新哪个框携带 `required`。

当前的测量数据属于审计记录；本小节只拥有持久约束及其验证目标。

## Accessibility contract

- **AR1 — 组标识。** 组名称及其描述、状态和禁用原因关系 MUST 保持可由程序确定。
- **AR2, AR3, AR5 — 选项语义、键盘一致性以及忙碌感知** 由 `component:CheckboxListItem` AR1、AR2 和 AR4 拥有。
- **AR4 — 禁用原因。** 在切换保持被阻止的同时，组原因 MUST 仍可通过键盘聚焦和辅助技术发现。

## Design relationships

| Anatomy or state | Design requirement                                   | Representation authority     | Hierarchy role | Component contract                    |
| ---------------- | ---------------------------------------------------- | ---------------------------- | -------------- | ------------------------------------- |
| 组               | 包含当前的复选框组组合。                             | 当前源码与公共文档           | 支撑           | FR1, FR2                              |
| 选项列表         | 呈现 List 拥有的列表和行根。                         | 当前源码                     | 支撑           | FR1, FR13                             |
| 选项行           | 呈现每个选项的复选框、内容、忙碌指示器和选中行填充。 | `component:CheckboxListItem` | 主要           | `component:CheckboxListItem` FR1–FR13 |
| 状态消息         | 呈现组的当前状态。                                   | 当前共享组件源码             | 支撑           | FR4                                   |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Group": {"target": "checkbox-list"},
  "Group label": {
    "delegatesTo": {"owner": "component:Field", "target": "field-label"}
  },
  "Description": {
    "none": {
      "reason": "unsettled: No current public target reaches the stable Description; future exposure still needs an owner decision"
    }
  },
  "Options list": {
    "delegatesTo": {"owner": "component:List", "target": "list"}
  },
  "Option row": {
    "delegatesTo": {"owner": "component:List", "target": "list-item"}
  },
  "Checkbox": {
    "delegatesTo": {
      "owner": "component:CheckboxInput",
      "target": "checkbox-indicator"
    }
  },
  "Option label": {
    "none": {
      "reason": "unsettled: Item rather than Text renders the stable Option label in a separate untargeted span; future exposure still needs an owner decision"
    }
  },
  "Option description": {
    "none": {
      "reason": "unsettled: Item rather than Text renders the stable Option description in a separate untargeted span; future exposure still needs an owner decision"
    }
  },
  "End content": {
    "none": {
      "reason": "intentional: End content is caller-provided content outside CheckboxList's public theming ownership"
    }
  },
  "Spinner": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "Status message": {
    "delegatesTo": {
      "owner": "component:FieldStatus",
      "target": "field-status"
    }
  }
}
```

`Description` 仍是稳定的使用方解剖结构，但当前没有公共目标到达它。Item（而非 Text）在单独的未设目标 span 中渲染选项标签和描述，因此两者都不委托给 Text，也不继承行根 `list-item` 目标；未来的暴露仍未确定。富标签内容和结尾内容由调用方提供，结尾内容有意留在 CheckboxList 的公共主题所有权之外。`Option row` 委托到达行表面，并在选中、启用、可编辑的行上到达其 `selected` 状态（`component:CheckboxListItem` FR15）。

## Family and system relationships

- `architecture:public-component-api` 拥有导出可达性、透传保持、样式组合、refs 以及已发布变更规则。
- `architecture:component-theming-surface` 拥有解剖结构资格认定、事实性 `none` 处置、保留组合的目标所有权，以及状态反射。
- `architecture:interaction-modality` 拥有聚焦可见性，以及获得焦点的复选框与绘制其聚焦环的元素之间的边界。
- `architecture:knowledge-contracts/INV2` 将每个按选项的事实保留在 `component:CheckboxListItem` 中，而不是复制到这里。
- `spec:AST-021` 拥有供 CheckboxListItem 使用的可复用复选框无障碍绑定及其确切的已知失败生命周期。
- `spec:AST-011` 将 `isReadOnly` 记录为可见、可聚焦、不可编辑值的名称。
- `spec:AST-038/FR7` 在层边界处终止 CheckboxList 上下文；层内的条目需要自己的 provider。
- `component:CheckboxListItem` 拥有该组所组合的按选项契约。
- List、CheckboxInput、Field、FieldStatus、Spinner 和 Tooltip 在被 CheckboxList 组合时保留其现有的公共目标和行为契约。

## Verification map

| Contract         | Verification                                                                                                                                               | Representative states                                                                                                     | Mutation or failure expectation                                                                                                    | Audit section                      |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1, AR1         | `CheckboxList.test.tsx` 的组角色、组描述和 disabledMessage 用例                                                                                            | 命名组；描述加状态；禁用原因                                                                                              | 缺少组名，或描述与状态顺序错误，即失败。证据缺口：没有测试断言调用方描述在前或禁用原因在后。                                       | `audit:CheckboxList/accessibility` |
| FR2, FR15        | `CheckboxList.test.tsx` 的 ref 与 container 用例；`CheckboxList.fr10.test.tsx`                                                                             | 独立；`horizontal-labels` FormLayout                                                                                      | ref 不在组上、`container*` 不在 Field 盒子上，或基础 prop 不在组上，即失败。                                                       | `audit:CheckboxList/api`           |
| FR4, FR14        | `CheckboxList.test.tsx` 的错误状态用例，包括每个复选框的 `aria-invalid`；`CheckboxListErrorStatus.a11y.chromium.spec.ts`                                   | 带消息的错误                                                                                                              | 缺少状态消息即失败。证据缺口：没有测试断言无消息时的空渲染。                                                                       | `audit:CheckboxList/accessibility` |
| FR6, FR7         | `CheckboxList.test.tsx` 的添加、移除和待处理用例；`CheckboxList.a11y.chromium.spec.ts` 的 `pending-single`、`pending-concurrent` 和 `pending-settled` 用例 | 添加；移除；一个和两个待处理值；已结算                                                                                    | 数组错误、较早的待处理值被清除，或忙碌状态超过结算，即失败。                                                                       | `audit:CheckboxList/behavior`      |
| FR9, FR10, AR4   | `CheckboxList.test.tsx` 的组禁用（包括组的 `aria-disabled`）、disabledMessage 和只读用例；`ListGroupDisabled.a11y.chromium.spec.ts`；共享复选框绑定        | 组禁用；带原因；只读条目                                                                                                  | 丢失 tab 停靠点、禁用时切换，或只读时切换，即失败。证据缺口：没有测试断言获得焦点的复选框不被原因描述。                            | `audit:CheckboxList/accessibility` |
| FR13             | `CheckboxList.test.tsx` 的密度用例；`CheckboxList.a11y.chromium.spec.ts` 的密度、分隔线、320 像素和 RTL 用例                                               | 紧凑、平衡、宽敞；分隔线；窄屏；RTL                                                                                       | 密度、分隔线、溢出或方向传感器失败。证据缺口：没有测试断言 `width` 同时决定标签、列表和状态的尺寸。                                | `audit:CheckboxList/layout`        |
| FR16             | `CheckboxList.test.tsx` 的可选指示和 FormLayout 默认用例                                                                                                   | `isOptional`；必填默认下的未标记组和可选组；可选默认；带焦点切换                                                          | 从 Field 丢弃 `isOptional`、在可选默认下显示它、必填默认下组复选框带有 `aria-required`，或 `isOptional` 变化时重新挂载行，即失败。 | `audit:CheckboxList/accessibility` |
| FR17             | `CheckboxList.required.test.tsx`                                                                                                                           | 标记；必填默认表单；无框勾选；一个勾选；最后一个框未勾选；第一个框禁用；组禁用；组只读；独立条目；带 key 的重排；条目移除 | 缺少标记、必填默认下出现标记、无框勾选时提交、一个勾选时阻止提交，或 `required` 出现在多于一个框上，即失败。                       | `audit:CheckboxList/accessibility` |
| ORD1–ORD3, PR1   | ORD1 和 ORD2 由 FR6 与 FR7 行覆盖，ORD3 由 FR9 与 FR10 行覆盖。证据缺口：没有测试断言不存在观察器或全局监听器                                              | —                                                                                                                         | —                                                                                                                                  | `audit:CheckboxList/behavior`      |
| 本地目标来源     | `themingTargets.test.ts`；`CheckboxList.test.tsx` 的 ref 与 container 用例                                                                                 | `checkbox-list`                                                                                                           | 渲染出的类不在文档化目标中，或 Field 根上缺少 `astryx-checkbox-list`，即失败。                                                     | `audit:CheckboxList/theming`       |
| 主题解剖结构映射 | `scripts/check-knowledge.mjs`                                                                                                                              | 规范解剖结构与当前本地目标                                                                                                | 规范键漂移、无效处置或目标拼写，或未声明的当前本地目标，即验证失败。                                                               | `audit:CheckboxList/theming`       |

按选项的验证由 `component:CheckboxListItem` 的验证映射拥有。当前仓库中没有检查会解析 `delegatesTo` 的所有者与目标对；上面的对匹配当前的 Field、List、CheckboxInput、Spinner 和 FieldStatus 目标。

## Current-state impact

- **组原因（FR9）。** 组 `disabledMessage` 只描述 `role="group"`，因此获得焦点的禁用复选框不会被它描述，这违背 `spec:AST-085` FR5 和 FR7。
- **不带消息的状态（FR14）。** 没有消息的状态不渲染任何内容；其含义是 OQ3。
- **必填宣告（FR17）。** `role="group"` 无法携带 `aria-required`，而浏览器会把未勾选的 `required` 复选框暴露为无效而非必填，因此在组为空时只有其第一个复选框报告该状态；必填的 `RadioList` 则把每个单选项的无效状态保留在其状态上（`component:RadioList` FR6）。

## Decision log

没有组件本地决策。CheckboxList 应用 `spec:AST-021`、`spec:AST-085` 和 `family:input-fields` FR10。

## Open questions

- **OQ3 — 不带消息的状态应当渲染什么？**（`human-api`）按选项的问题位于 `component:CheckboxListItem`。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤、按选项契约或共享组件契约。它链接到它们的拥有者。
