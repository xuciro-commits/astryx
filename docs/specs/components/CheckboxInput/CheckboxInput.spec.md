---
schema_version: 3
template_version: 7
kind: component
id: component:CheckboxInput
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
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
    packages/core/src/CheckboxInput/CheckboxInput.test.tsx,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.test.tsx,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/__tests__/BusyOwnerAnnouncement.test.tsx,
    packages/core/src/Indicator/touchTarget.test.tsx,
    packages/core/src/Indicator/__tests__/TouchTargets.interaction.browser.spec.ts,
  ]
modules: []
families: []
design_specs: [design:user-states]
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-021, spec:AST-085, spec:AST-086]
---

# CheckboxInput component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                    |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `CheckboxInput` 是一个受控的原生复选框，必需 `label` 与 `value`；它支持同步与以过渡为后备的变更处理器、加载中、禁用、禁用原因、只读、校验、尺寸以及字段内容。                                                                                                                                           |
| 行为          | 原生 input 拥有角色、状态、焦点、表单参与与激活。可替换的 CheckboxIndicator 拥有可见方框，而 CheckboxInput 拥有其焦点环与按下覆盖层，除非第一方指示器自行绘制按下态（AV1）。                                                                                                                            |
| 终端用户影响  | 用户可以识别并操作可用选项，将惰性值作为只读内容查看，从键盘发现禁用原因，并感知忙碌、校验、焦点与按下状态。                                                                                                                                                                                            |
| 构建者影响    | 无。构建者控制值，可使用 `onChange`、`changeAction` 或两者；两者都省略时的含义仍是开放问题（OQ1）。                                                                                                                                                                                                     |
| 兼容性/就绪度 | 记录已发布行为；无 API、默认值或 DOM 变更。无处理器的复选框不声明只读状态，混合值可能在激活后丢失其原生混合状态，调用方按键处理器在禁用时仍运行；这些均列在 Current-state impact 下。                                                                                                                   |
| 审查检查      | 拒绝状态/名称漂移、重复激活、禁用或只读状态下的变更、表单语义丢失、缺少焦点/按下反馈、辅助文本不可访问，或目标所有权变化。                                                                                                                                                                              |
| 管辖规则      | `spec:AST-021/FR4–FR10`；`spec:AST-085/FR1–FR3`；`design:user-states/DR1–DR5`；`architecture:interaction-modality/INV1–INV5,INV9`；`architecture:public-component-api/INV1,INV5–INV9`；`architecture:component-theming-surface/INV3–INV8,INV12`；WCAG 2.2 1.3.1、1.4.11、2.1.1、2.4.7、3.3.1 与 4.1.2。 |

本表是审查用的投影视图；下方正文具有权威性。

## Intent

渲染一个受控复选框选项，使可见值、无障碍状态、可交互性以及配套字段内容在指针、键盘、触摸、表单与辅助技术之间保持一致。

## Compatibility and migration

- 已发布默认值保留：是
- 兼容性类别：记录已发布行为；无公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：仅受控；`value` 仍为必需，且所有状态变更仍归调用方所有
- 迁移决策：无；无处理器语义仍为开放问题（OQ1）

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 原生复选框角色、选中/混合状态、标签、描述/状态关系、焦点、激活、可用性、只读状态、必需/无效/忙碌状态，以及表单参与。
- 已解析复选框指示器的组合、由所有者绘制的焦点环与按下覆盖层（第一方指示器自行绘制按下态时除外；AV1）、禁用原因提示框、字段标签、描述，以及分离的状态。
- `onChange`、`preventDefault`、乐观待定状态与 `changeAction` 之间的顺序。
- 按下框标记的所属模块是 `privateAttributes/pressBox.stylex.ts`（public-component-api INV23）；其读取器 `pressBoxesIn` 列出可按下表面所拥有的按下框。

**不拥有 / 非目标**

- 复选框指示器的内部绘制与主题目标——由 CheckboxIndicator 与 Indicator 注册表所有。
- 多选项分组、集合值与组级禁用原因——由 CheckboxList 所有。
- 通用标签、状态消息、spinner、提示框或图标实现。
- 新的非受控/默认值 API，或对选中值序列化的任何变更。

## Public concepts

| 概念       | 封闭取值或状态                                 | 含义                                                                          | 按变体/方向/状态的可用性                     | 默认值         | 所有者             | 稳定性                   | 无效值行为                       |
| ---------- | ---------------------------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------- | -------------- | ------------------ | ------------------------ | -------------------------------- |
| 值         | `false`、`true`、`indeterminate`               | 受控的可见状态与原生复选框状态。                                              | 所有路径。                                   | 必需           | 调用方             | 稳定                     | 由公共类型拒绝                   |
| 变更路径   | `onChange`、`changeAction`、两者皆有、两者皆无 | 接受即时和/或由过渡承载的用户意图；两者皆无时受控值保持惰性，但不解决其语义。 | 已启用、非忙碌的控件。                       | 两者皆无       | 调用方与组件       | 已发布；无处理器语义未定 | 无处理器意味着没有组件拥有的变更 |
| 可用性     | 已启用、已禁用、带原因禁用                     | 控制激活、表单提交、不透明度与原因发现。                                      | 所有值。                                     | 已启用         | 组件               | 稳定                     | 禁用优先于激活                   |
| 只读       | 显式                                           | 在阻止变更的同时，保留可聚焦、全不透明度的受控值。                            | 所有值；可与禁用共存，且禁用优先决定可用性。 | false          | 组件               | 稳定                     | 仅布尔值                         |
| 忙碌       | 显式加载或乐观过渡                             | 保留焦点、阻止重复变更、暴露忙碌状态，并用 Spinner 替换指示器标记。           | 已启用与只读的值。                           | false          | 组件               | 稳定                     | 仅布尔值/过渡状态                |
| 字段内容   | label, description, status, labelIcon          | 为选项命名并作出解释，同时传达校验信息。                                      | 所有值与可用性状态。                         | label 为必需   | 调用方与组合所有者 | 稳定                     | 仅类型化值                       |
| 尺寸与宽度 | `sm`、`md`；`SizeValue`                        | 设定指示器行与整个字段的尺寸。                                                | 所有状态。                                   | `md`；固有宽度 | 组件               | 稳定                     | 由公共类型拒绝                   |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                          | 依据                                                                                      |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| FR1  | 承载角色的元素 MUST 保持为原生 `input[type=checkbox]`，并由渲染的标签为其命名；`checked` 由所示值为 `true` 推导，原生 `indeterminate` 属性由所示值为 `'indeterminate'` 推导；所示值是 `value`，或待定的乐观值（ORD1）。实现缺口：激活一个 `value` 保持混合的混合复选框（无处理器，或 `onChange` 维持其不变）会清除原生混合状态，且只有禁用、忙碌或只读路径会恢复它，因此输入会读作未选中，而指示器仍显示混合。  | 已发布源码；共享复选框契约；WCAG 4.1.2                                                    |
| FR2  | 已启用下的激活 MUST 先以下一个布尔值调用 `onChange`，然后仅在存在且事件未被阻止时调用 `changeAction`。                                                                                                                                                                                                                                                                                                          | 已发布源码与组件测试                                                                      |
| FR3  | 在 `isLoading` 期间，或所示值与 `value` 不同时（存在待定的 `changeAction`，而 `value` 尚未接受其结果），输入 MUST 暴露忙碌状态、拒绝再次变更、在指示器中显示 Spinner 且不丢失焦点，并只播报一次忙碌开始（`spec:AST-086` FR8）。                                                                                                                                                                                 | 已发布源码、测试与 stories；`architecture:interaction-modality/INV5`                      |
| FR4  | `isDisabled` MUST 让输入保持可聚焦，设置 `aria-disabled="true"` 且不使用原生 `disabled`，阻止所有变更与调用方的 `onClick`，不提供 `name`，并将输入与其表单分离，使其既不提交也不阻止提交。使用 `disabledMessage` 时，提示框在行悬停与键盘聚焦时打开，并对输入进行描述。实现缺口：除 `onClick` 之外的其它调用方 DOM 处理器（如 `onKeyDown`）在禁用时仍会运行。                                                   | `spec:AST-085` FR1–FR3；已发布源码与组件测试；WCAG 2.1.1 与 4.1.2                         |
| FR5  | 显式 `isReadOnly` MUST 保留受控值与常规可聚焦性、暴露只读状态、保持全不透明度，并拒绝变更。                                                                                                                                                                                                                                                                                                                     | 已发布源码与共享复选框绑定；WCAG 4.1.2                                                    |
| FR6  | 描述、状态、禁用原因与调用方提供的 `aria-describedby` id MUST 组合而不丢弃任何来源；错误状态 MUST 暴露无效状态。                                                                                                                                                                                                                                                                                                | 已发布源码与测试；WCAG 1.3.1、3.3.1、4.1.2                                                |
| FR7  | 显式 `isRequired` MUST 保留原生表单校验并暴露 `aria-required`。`aria-invalid` 跟随 `status`（必需复选框在无错误时为 `false`），因此浏览器自身的无效状态绝不会在出现错误前显示。未勾选的方框本身就是一种回答，因此表单默认值（`component:FormLayout` FR5）不会给复选框设置必需状态：若其自身没有 `isRequired`，它既不带 `aria-required` 也不带原生 `required`。其必填与可选标记遵循 `component:FieldLabel` FR4。 | 已发布源码与共享复选框绑定                                                                |
| FR8  | 调用方 DOM prop MUST 传递到输入，而组件拥有的 type、checked、disabled、read-only、required、busy、invalid、description、ref 与样式值保持优先级。                                                                                                                                                                                                                                                                | `architecture:public-component-api/INV5–INV8`；组件测试                                   |
| FR9  | 外层字段 MUST 保留 `checkbox-input`，标签 MUST 保留 `checkbox-label`，内置 CheckboxIndicator 路径 MUST 保留其规范目标。替换指示器不要求接受目标类名。                                                                                                                                                                                                                                                           | 源码/文档目标清单；替换组件测试；`architecture:component-theming-surface/INV4–INV8,INV12` |
| FR10 | 对隐藏原生输入的键盘/程序化聚焦 MUST 将共享的 focus-visible 轮廓绘制在已解析的指示器元素上，包括不转发任何 prop 的替换指示器。                                                                                                                                                                                                                                                                                  | `architecture:interaction-modality/INV1–INV3`；组件测试                                   |
| FR11 | CheckboxInput 为按下覆盖层应用 `design:user-states` DR1 与 DR2，在行被按下期间将其绘制于指示器上，但在自行绘制按下态的指示器上除外（AV1）。                                                                                                                                                                                                                                                                     | `design:user-states/DR1–DR5`                                                              |
| FR12 | `sm` 与 `md` MUST 使原生输入、指示器、焦点绘制与行几何保持对齐；字段 `width` MUST 设定整个字段的尺寸，而不仅是输入。                                                                                                                                                                                                                                                                                            | 已发布源码、测试与 stories                                                                |
| FR13 | 在既无 `onChange` 也无 `changeAction` 时，激活不会改变调用方可观察的任何内容。实现缺口：该复选框不声明只读或不可用状态；其含义为 OQ1（Current-state impact）。                                                                                                                                                                                                                                                  | 共享复选框已知失败记录                                                                    |
| FR14 | 在粗指针下，触摸目标朝 44 × 44 px 扩展，最多到与相邻目标相距一半处，且绝不小于控件自身的方框（所有者决策，2026-11-04；`spec:AST-094` FR42）。它通过在带标签、已启用、可编辑复选框所在行上的不可见条带扩展，且不改变任何尺寸。标签隐藏的复选框保留其组合者的目标。                                                                                                                                               | `spec:AST-094` FR42；当前源码与测试                                                       |

### Allowed variation

- **AV1 — 指示器替换。** 主题可以替换指定的复选框指示器，前提是保留 Indicator 的 prop 与装饰所有权契约；CheckboxInput 仍在已解析的根元素上绘制焦点与按下反馈。唯一例外：第一方替换指示器可以根据行的悬停与按下自行绘制按下态（一种内部标记；非公共 API），而 CheckboxInput 仍绘制焦点。
- **AV2 — 主题绘制。** 规范组件目标与语义 token 可以变更被允许的视觉属性，而不改变原生语义、状态优先级或交互所有权。
- **AV3 — 调用方字段内容。** 标签、描述、状态文本、图标/内容与宽度可以在其公共类型范围内变化。

### Representative states

| 状态                 | 必需不变式                                                                   | 允许的变化                   |
| -------------------- | ---------------------------------------------------------------------------- | ---------------------------- |
| 未选中、已选中、混合 | 原生状态与视觉状态一致；激活提出下一个布尔值。                               | 主题拥有的绘制与指示器替换。 |
| 加载中/待定          | 焦点保留；忙碌状态被暴露；重复变更被阻止；Spinner 替换标记。                 | 调用方控制的加载时长。       |
| 禁用                 | 可聚焦且带 `aria-disabled`；不可操作；从表单数据中排除。                     | 可选的禁用原因文本。         |
| 只读                 | 显式 `isReadOnly` 使值保持可见、可聚焦、可提交，并在只读语义下不可变。       | 调用方控制的显式状态。       |
| 无处理器             | 激活不改变调用方可观察的任何内容；其只读或不可用含义为 OQ1（当前已知缺口）。 | —                            |
| 无效/状态            | 状态被描述，错误会暴露无效状态。                                             | 错误、警告或成功内容。       |
| 隐藏标签             | 标签仍保留在无障碍树中并为输入命名。                                         | 仅视觉隐藏。                 |

### Transformation and precedence order

- **ORD1 — 状态优先级。** 受控 `value` → 乐观待定值 → 可见指示器状态。
- **ORD2 — 激活优先级。** 禁用/忙碌/只读守卫 → 下一个原生布尔值 → `onChange` → `preventDefault` 检查 → 乐观 `changeAction`。
- **ORD3 — 可用性优先级。** 禁用拥有可用性与表单排除；禁用原因改变可聚焦性但不改变可操作性；只读仅适用于值变更。
- **ORD4 — 属性优先级。** 调用方其余 prop → 组件拥有的语义/表单属性 → 组件拥有的 StyleX prop。

### Performance and resources

- **PR1 — 有界资源。** 该组件不拥有任何全局监听器或观察器。提示框与过渡资源仍限定在其既有 hook 与组件生命周期内。

## Accessibility contract

- **AR1 — 原生复选框语义。** 名称、角色、选中/混合状态、必需、无效、忙碌、禁用与只读状态 MUST 保持可由程序确定。
- **AR2 — 键盘一致性。** 空格键激活遵循与指针激活相同的可用性与变更顺序规则；焦点保留在原生输入上。
- **AR3 — 焦点可见性。** 隐藏输入的焦点 MUST 在键盘模态下于指示器上保持可见呈现，包括指示器替换的情形。
- **AR4 — 辅助内容。** 可见描述、状态与禁用原因 MUST 被引用，且不替换调用方的描述。
- **AR5 — 视觉状态。** 有意义的复选框边界、标记、焦点环与忙碌指示 MUST 在受支持的主题与强制颜色下保持可感知。

## Design relationships

| 结构或状态     | 设计要求                                         | 表示权威                                             | 层级角色 | 组件契约                |
| -------------- | ------------------------------------------------ | ---------------------------------------------------- | -------- | ----------------------- |
| Checkbox       | 可见状态提示、按下覆盖层与焦点环与原生输入对齐。 | Indicator 所有者加上 `design:user-states` 与交互架构 | 主要控件 | FR1, FR3–FR5, FR10–FR12 |
| Label          | 可见或视觉隐藏的文本为原生输入命名。             | FieldLabel 组合                                      | 主要内容 | FR1, FR6                |
| Description    | 辅助文本保持关联，但不进入无障碍名称。           | FieldLabel 组合                                      | 辅助内容 | FR6                     |
| Status message | 分离的状态传达校验信息并参与描述。               | FieldStatus 组合                                     | 辅助反馈 | FR6                     |

使用方记录包含由 CheckboxIndicator、FieldLabel 与 FieldStatus 拥有的组合目标，它们各自保留其目标所有权；本记录不包含解剖结构-主题映射。

## Family and system relationships

- `spec:AST-021` 拥有可复用复选框无障碍绑定、状态清单、证据层与精确的已知失败生命周期。
- `design:user-states` 拥有 CheckboxInput 在启用/禁用下的指针按住绘制。
- `architecture:interaction-modality` 拥有焦点可见性模态，以及语义焦点与指示器绘制之间的边界。
- `architecture:component-theming-surface` 拥有目标放置与状态反映。
- `spec:AST-085` 拥有禁用下的可聚焦性；FR4 记录处理器缺口。
- `spec:AST-086` FR8 拥有忙碌播报。
- CheckboxIndicator、FieldLabel、FieldStatus、Spinner、Tooltip 与 Indicator 注册表在此组合时保留各自的实现与主题所有权。

## Verification map

| 契约                        | 验证                                                                                                                                                                                                                                | 代表状态                                                                                                                                   | 变更或失败预期                                                                                                                                                                             | 审计小节                       |
| --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| FR1, FR4–FR7, FR13, AR1–AR4 | `Checkbox.a11y.test.tsx` 与 `Checkbox.a11y.chromium.spec.ts`，覆盖共享状态清单                                                                                                                                                      | 值状态；隐藏标签与带描述标签；禁用；禁用原因；加载中；只读；无处理器；必需；无效                                                           | 角色、名称、状态、可聚焦性或描述方面的预期失败，或已移除的已知失败变为陈旧。                                                                                                               | `audit:CheckboxInput/a11y`     |
| FR2, FR3                    | `CheckboxInput.test.tsx` 的变更、仅 changeAction 与加载用例；`BusyOwnerAnnouncement.test.tsx` 的 CheckboxInput 用例                                                                                                                 | 点击、标签点击、描述点击；`isLoading`                                                                                                      | 错误的 `onChange` 值、缺失的 `aria-busy`，或忙碌开始被播报多次、或被 Spinner 播报，均判为失败。证据缺口：没有测试断言在带 `preventDefault` 时 `onChange` 之后的 `changeAction`，或乐观值。 | `audit:CheckboxInput/behavior` |
| FR4, FR6, FR7               | `CheckboxInput.test.tsx` 的 disabled、disabledMessage、描述、状态与表单测试套件                                                                                                                                                     | 带原因与不带原因的禁用；必需；错误                                                                                                         | 可切换的禁用方框、被提交的禁用值，或丢失的描述均判为失败。证据缺口：没有测试断言调用方 `onKeyDown` 在禁用时仍会运行（FR4 缺口）。                                                          | `audit:CheckboxInput/behavior` |
| FR8                         | `CheckboxInput.test.tsx` 的透传、id、ref 与其余 prop 优先级用例                                                                                                                                                                     | 调用方 `id`、`data-*`、ref                                                                                                                 | 调用方 prop 覆盖 `checked`、`disabled` 或 `type` 判为失败。                                                                                                                                | `audit:CheckboxInput/api`      |
| FR7                         | `FormLayout.test.tsx` 的必需默认值与显式 `isRequired` 用例；`CheckboxInput.test.tsx` 的“必需无效状态”用例；共享状态清单中的 `input-under-required-default` 与 `input-required` 状态                                                 | 在必需默认值下未标记：无 `aria-required`、无 `required`，且表单可提交；`isRequired`：`aria-required` 加原生 `required`，且未勾选提交被阻止 | 在必需默认值下的未标记复选框携带 `aria-required` 或 `required`，或 `isRequired` 复选框未同时具备两者，均判为失败。                                                                         | `audit:CheckboxInput/api`      |
| FR9                         | `CheckboxInput.test.tsx` 的标签目标用例；`themingTargets.test.ts`                                                                                                                                                                   | 标签；内置指示器                                                                                                                           | 缺失标签目标，或渲染出的类名不在文档化目标中，均判为失败。证据缺口：没有测试断言根 `checkbox-input` 目标。                                                                                 | `audit:CheckboxInput/theming`  |
| FR10, AR3                   | `CheckboxInput.test.tsx` 的焦点环所有权套件                                                                                                                                                                                         | 内置指示器与丢弃 prop 的替换指示器；失焦                                                                                                   | 环出现在错误元素上，或完全没有，均判为失败。                                                                                                                                               | `audit:CheckboxInput/a11y`     |
| FR11                        | `CheckboxInput.test.tsx` 的按下状态套件，以及针对自行绘制按下态的指示器的套件                                                                                                                                                       | 启用下的按下；禁用；触摸淡出                                                                                                               | 覆盖层缺失，或出现在禁用方框上，均判为失败。                                                                                                                                               | `audit:CheckboxInput/visual`   |
| FR12, AR5                   | `CheckboxInput.test.tsx` 的粗指针、RTL 与强制颜色套件                                                                                                                                                                               | `sm`、`md`；RTL；强制颜色                                                                                                                  | 命中目标错位，或标记在强制颜色下丢失，均判为失败。证据缺口：没有测试断言字段 `width`。                                                                                                     | `audit:CheckboxInput/layout`   |
| FR14                        | `touchTarget.test.tsx` 的命中条带、条带按下与最小尺寸用例；`TouchTargets.interaction.browser.spec.ts` 的复选框用例                                                                                                                  | 带标签、标签隐藏、禁用与只读；24 与 60 px 的行；一根手指、点击落在行边缘的轻触，以及鼠标                                                   | 本不该有条带处出现条带、鼠标下出现条带、行尺寸变化、24 px 行未达到 44 px、60 px 行带条带，或条带按下未切换，均判为失败。                                                                   | `audit:CheckboxInput/behavior` |
| ORD1–ORD4, PR1              | ORD4 由 FR8 的其余 prop 优先级用例覆盖，ORD3 由共享无障碍套件的禁用、禁用原因与只读状态覆盖。证据缺口：没有测试断言 `value` 与指示器之间的乐观值（ORD1）、`changeAction` 之前的 `preventDefault` 检查（ORD2），或全局监听器的不存在 | —                                                                                                                                          | —                                                                                                                                                                                          | `audit:CheckboxInput/behavior` |

## Current-state impact

- **激活后的混合状态（FR1、FR13）。** 激活一个 `value` 保持混合的混合 CheckboxInput 会清除原生混合状态，而指示器仍显示混合，因此辅助技术会将其读作未选中（WCAG 2.2 4.1.2）。
- **无处理器复选框（FR13）。** 既无处理器的 CheckboxInput 不声明只读状态，因此无障碍使用方无法区分其固定值与可编辑值（WCAG 2.2 4.1.2）。共享复选框套件将其记为已知失败；预期含义为 OQ1。
- **禁用时的调用方处理器（FR4）。** 除 `onClick` 之外的调用方 DOM 处理器（如 `onKeyDown`）在禁用时仍会运行，这违反 `spec:AST-085` FR2。

## Decision log

无组件局部决策。CheckboxInput 应用 `spec:AST-021`、`spec:AST-085` 与 `design:user-states`。

## Open questions

- **OQ1 — 既无 `onChange` 也无 `changeAction` 的受控 CheckboxInput 意味着什么？**（`human-api`）当前行为是惰性的，却被暴露为可编辑。可选方案为只读、不可用，或无效用法。

## Content boundary

本文件不重复使用方 prop 表/示例、实现步骤、生成的证据或共享组件契约。它链接到各自的所有者。
