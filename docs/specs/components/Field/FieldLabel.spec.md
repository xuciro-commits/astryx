---
schema_version: 3
template_version: 7
kind: component
id: component:FieldLabel
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Field/FieldLabel.test.tsx,
    packages/core/src/FormLayout/FormLayout.test.tsx,
    packages/core/src/Field/__tests__/FieldLabelAudit.a11y.chromium.spec.ts,
    packages/core/src/Field/__tests__/FieldLabelTap.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/docPropReferences.test.ts,
    packages/core/src/docPropLiterals.test.ts,
    apps/storybook/rtl-audit/verified-not-applicable.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: [spec:AST-020/FR1]
---

# FieldLabel component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `FieldLabel` 为单个控件或由调用方标注的组渲染可见或视觉隐藏的标签组，支持可选描述、可选性指示符、图标、工具提示、标签元素的 BaseProps 以及标签元素的 ref。                                                                       |
| 行为          | 单控件模式使用原生 label；组模式使用带标注的 span。描述会额外增加一个包装 div，而调用方 props 和 ref 仍留在内层标签元素上。描述点击只向一个关联控件转发。                                                                        |
| 最终用户影响  | 人们可以识别一个控件或组，将辅助文本与其名称分开听取，并能从完整的可见标签区域激活符合条件的控件。信息按钮背后的帮助可通过指针、触摸、键盘和屏幕阅读器打开，对其轻点、点击或按键绝不会改变控件（DEC-1）。                        |
| 构建者影响    | 构建者提供稳定的控件和描述 ID，在标注复合控件时选择组模式，并在被控表面上接好 `aria-labelledby` 或 `aria-describedby`。                                                                                                          |
| 兼容性/就绪度 | 没有 API 或默认值变更；使用 `labelTooltip` 时，信息触发器是标签元素之后的一个 InfoTip 按钮，鼠标点击它不会激活控件（FR9、DEC-1）。组模式渲染 span，而公共类型承诺的是 label props 和 ref；这一点列在 Current-state impact 之下。 |
| 评审检查      | 拒绝以下情况：原生/组关联丢失、描述嵌套进无障碍名称、从组或交互式描述内容转发点击、标签元素 props/ref 被丢弃、工具提示内容被隐藏、信息触发器位于标签元素内部或其按压会激活控件，以及未记录的公共 prop。                          |
| 治理规则      | 既有公共接口；HTML label 语义；WCAG 2.2 SC 2.1.1、SC 4.1.2；`component:InfoTip`；`architecture:public-component-api/INV1,INV5–INV9,INV12`；`architecture:component-theming-surface/INV3–INV7`；`spec:AST-020/FR1`。              |

本表是评审视角的投影；下文正文具有权威性。

## Intent

`FieldLabel` 提供 Field 以及 CheckboxInput、Switch 等带标签控件共用的标签、描述、可选性、图标和工具提示呈现。它只拥有标签组；关联的控件或组拥有取值与交互行为。

## Compatibility and migration

- 保留已发布的默认值：是。
- 兼容类别：没有公共 prop、默认值或导出变更。使用 `labelTooltip` 时，信息触发器从标签元素内部的图标变为其后的 `component:InfoTip` 按钮，二者由同一行 inline-flex 包裹，且对其的任何指针或按键按压都不会激活控件（FR9、DEC-1）。调用方只在设置 `labelTooltip` 时才看到该额外包装层；他们的 class、`xstyle` 和 ref 仍留在标签元素上（FR6）。
- 受控/非受控行为：不适用。
- 迁移决策：DEC-1 无需调用方改动；ref 的类型定义是 OQ1。

## Ownership boundary

**拥有**

- 原生单控件与非 label 组标签的元素选择。
- 可见与视觉隐藏的标签和描述呈现。
- 来自 FormLayout 可选性上下文的可选/必填例外指示符。
- 面向一个关联控件的安全描述点击转发。
- `field-label` 主题目标，以及调用方 props、样式和 ref 在标签元素上的组合。
- 可选工具提示触发器在每种输入方式和辅助技术路径下是否可到达并具备名称。

**不拥有 / 非目标**

- 关联控件或组的取值、禁用语义、焦点模型、键盘行为，以及标签自身 ID 之外的 ARIA 接线。
- 调用方在标签组周围的布局。
- 信息触发器、其按压切换以及工具提示表面，这些委托给 `component:InfoTip`，并经由它委托给 `component:Tooltip`；FieldLabel 拥有触发器的渲染位置、其名称，以及其内容被暴露这一点。

## Public concepts

| 概念           | 封闭取值或状态                   | 含义                                                                                                    | 按变体/方向/状态的可用性 | 默认值 | 所有者                 | 稳定性 | 无效值行为                                                                                         |
| -------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------ | ------ | ---------------------- | ------ | -------------------------------------------------------------------------------------------------- |
| 标签模式       | 单控件；组                       | 选择原生 `<label htmlFor>` 或通过 `aria-labelledby` 引用的 `<span>`。                                   | 所有用法。               | 单控件 | `component:FieldLabel` | 已发布 | 受布尔约束；根/ref 的类型定义见 OQ1。                                                              |
| 标签可见性     | 可见；视觉隐藏                   | 隐藏时保持标签和描述可访问，同时移除其布局空间。                                                        | 两种标签模式。           | 可见   | `component:FieldLabel` | 已发布 | 受布尔约束。                                                                                       |
| 可选性标记     | 无；可选；必填                   | 显示相对 FormLayout 表单级可选性默认值的本地化例外。                                                    | 可见和隐藏标签。         | 无     | `component:FieldLabel` | 已发布 | 两个布尔值都为 true 时，可见地以可选优先，除非 FormLayout 的默认值是可选，此时它被抑制并显示必填。 |
| 前置图标       | 不存在；图标类型；渲染节点       | 在标签文本之前加入视觉内容。                                                                            | 两种标签模式。           | 不存在 | `component:FieldLabel` | 已发布 | 通过共享图标槽渲染。                                                                               |
| 说明性工具提示 | 不存在；本地化字符串             | 在标签元素之后加入 `component:InfoTip`；对其轻点、点击或按键会打开或关闭工具提示，而不激活控件（FR9）。 | 两种标签模式。           | 不存在 | `component:FieldLabel` | 已发布 | —                                                                                                  |
| 辅助描述       | 不存在；带可选显式 ID 的渲染节点 | 让辅助内容与无障碍名称分离，并可供描述使用。                                                            | 两种标签模式。           | 不存在 | `component:FieldLabel` | 已发布 | 缺少 ID 时把关联留给调用方。                                                                       |
| 描述激活       | 转发；非转发                     | 对单个控件，非交互式描述的点击镜像原生标签激活。                                                        | 仅单控件模式。           | 转发   | `component:FieldLabel` | 已发布 | 组模式和交互式子元素不转发。                                                                       |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 依据                                                              |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| FR1 | 单控件模式渲染 `<label htmlFor={inputID}>`；组模式渲染一个非 label 元素并带 `labelID`，供调用方自己的 `aria-labelledby` 使用。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 既有公共接口；HTML 与 ARIA 语义                                   |
| FR2 | 可见和隐藏标签都保留标签文本；隐藏的标签与描述盒仍留在无障碍树中，且不占用布局槽位。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 既有公共接口                                                      |
| FR3 | 描述保持为标签的兄弟节点，因此不进入控件的无障碍名称。非交互式描述的点击转发到一个符合条件的控件；组标签和交互式子元素不转发激活。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 既有公共接口；原生 label 行为                                     |
| FR4 | FormLayout 的可选性会抑制与之匹配的可见标记；没有表单默认值时，请求的标记会被本地化并显示。两个标志都为 true 时，可选优先；但在默认值为可选的 FormLayout 内，可选标记被抑制，显示必填标记。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 既有公共接口与当前测试                                            |
| FR5 | 标签图标、工具提示锚点、必填/可选文本以及描述内容保持源顺序。标签元素使用水平 flex 行；可选的标签/描述包装层使用块流。使用 `labelTooltip` 时，一行 inline-flex 包裹标签元素及其后的 InfoTip（FR9）。所有组件自有的间距均为逻辑或方向中性。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 既有公共接口与源码观察                                            |
| FR6 | 接受的数据、ARIA、DOM、class、style、事件和 `xstyle` 输入组合到标签元素上，而不替换组件自有目标或关联。渲染描述时，外层包装层只负责布局，调用方 props 留在内层标签元素上；`labelTooltip` 行（FR9）同样只负责布局，因此调用方 class、`xstyle` 和 ref 留在标签元素上。                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `architecture:public-component-api/INV5–INV7`                     |
| FR7 | 公共 ref 与标签元素 props 必须描述 FieldLabel 在各模式下渲染的元素；组模式使用哪个根元素以及哪种公共类型组是 OQ1。实现缺口：组模式渲染 `<span>`，而公共 BaseProps 与 ref 类型固定为 `HTMLLabelElement`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `architecture:public-component-api/INV8,INV9`；当前运行时/类型    |
| FR8 | 可选工具提示的说明内容必须可通过键盘到达（WCAG 2.2 SC 2.1.1），其触发器必须有可访问名称与角色（WCAG 2.2 SC 4.1.2）；FR9 的 InfoTip 按钮同时满足二者。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | WCAG 2.2 SC 2.1.1、SC 4.1.2；`spec:AST-020/FR1`                   |
| FR9 | 使用 `labelTooltip` 时，FieldLabel 渲染带该内容的 `component:InfoTip`，位于标签元素之后且在标签元素之外，并把标签元素和 InfoTip 包裹在一行 inline-flex 中，正如它包裹标签和描述那样，因此没有任何按钮位于 `<label>` 内；调用方 class、`xstyle` 和 ref 留在标签元素上，且仅当设置 `labelTooltip` 时才渲染该行。使用 `isLabelHidden` 时，InfoTip 随标签一起视觉隐藏，不占布局槽位（FR2），而当它拥有键盘焦点时，按钮在流中占据控件上方的位置（水平标签时则位于标签单元格内），因此它绝不会被遮挡或裁切（WCAG 2.4.7、2.4.11）；按钮名称是包含标签文本的本地化字符串（如 “About Auto-save”）。对信息触发器的轻点、点击、Enter 或 Space 会打开或关闭工具提示（`component:Tooltip` FR9），并且绝不会激活、聚焦或切换关联控件；悬停和聚焦会预览它。 | DEC-1；HTML label 内容模型；WCAG 2.2 SC 2.1.1、SC 2.4.7、SC 4.1.2 |

### Allowed variation

- **AV1 — 父级布局。** Field、CheckboxInput、Switch 和直接使用方可以按不同方式排布标签组，而不改变其局部语义。
- **AV2 — 标签内容。** 图标、工具提示、可选性文本和描述内容可以各自独立缺失。
- **AV3 — 控件种类。** 描述激活遵循关联的原生或自定义控件所支持的点击/聚焦行为。

### Representative states

| 状态           | 必需不变式                                                                                                                        | 允许的变化                               |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 单标签         | 原生标签关联到达该唯一控件。                                                                                                      | 可见或视觉隐藏。                         |
| 组标签         | 标签元素不是字面 label，且可通过 `labelID` 引用。                                                                                 | 调用方拥有组角色与 `aria-labelledby`。   |
| 描述           | 辅助内容留在标签之外，并可暴露 `descriptionID`。                                                                                  | 文本或结构化内容。                       |
| 可选或必填     | 一个本地化例外标记跟在标签文本之后。                                                                                              | 当其与 FormLayout 的默认值匹配时被抑制。 |
| 禁用呈现       | 标签使用禁用文本处理且无指针光标。                                                                                                | 关联控件拥有实际的禁用状态。             |
| 图标与工具提示 | 共享 Icon 和 InfoTip 渲染各自拥有的绘制；InfoTip 按钮跟在标签元素之后，可通过键盘到达且有名称，其按压绝不会到达控件（FR8、FR9）。 | 任一槽位都可以缺失。                     |

### Transformation and precedence order

- **ORD1 — 可选性。** FormLayout 的默认值先抑制与之匹配的标记；随后当两个局部布尔值都为 true 时，可选优先。
- **ORD2 — 标签元素组合。** 组件目标与基础样式在调用方 `xstyle`、class 和内联样式组合到标签元素上之前应用；关联和标签元素选择仍归组件所有。可选的描述或 `labelTooltip` 行（FR9）会增加一个布局包装层，但不重定向这些输入。

### Performance and resources

- **PR1 — 无保留资源。** FieldLabel 不拥有任何全局监听器、观察器、定时器或外部存储。描述激活复用带局部 ref 的共享输入容器 hook，`labelTooltip` 会引入 InfoTip 的监听器与层，因而也引入 Tooltip 的。

## Accessibility contract

- **AR1 — 标签关联。** 单控件使用原生标签关联；分组控件使用调用方接线的带标注 span，绝不使用容易误导的字面 label。
- **AR2 — 描述分离。** 描述内容留在标签之外，以免在无障碍名称中重复，并暴露一个 ID 供调用方自己的 `aria-describedby` 使用。
- **AR3 — 隐藏标签。** 视觉隐藏的标签和描述内容仍可通过程序访问。
- **AR4 — 激活边界。** 描述激活绝不劫持交互式子元素，也绝不从组标签向单个控件转发。
- **AR5 — 工具提示可到达性。** 工具提示内容必须可通过键盘到达（WCAG 2.2 SC 2.1.1），经由一个具名触发器（SC 4.1.2），即跟在标签之后的 InfoTip 按钮（FR8、FR9）。

## Design relationships

当前仓库设计记录不治理组件局部的视觉调参。实现使用共享的语义字号、颜色、间距和禁用 token；渲染证据记录由此产生的状态，而不把它们变成策略。

## Family and system relationships

- `architecture:public-component-api` 拥有导出、标签元素 prop 组合、ref 准确性以及已发布 API 兼容性。
- `architecture:component-theming-surface` 拥有从解剖结构到目标的处置以及目标组合。
- `architecture:component-test-sufficiency` 拥有针对每个关键既有公共接缝的有界、对变异敏感的证据。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                                                                                                                    | 代表性状态                                                                                                | 变异或失败预期                                                                                                                                                                                                                | 审计小节                         |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1–FR3、AR1–AR4 | `FieldLabel.test.tsx` 的关联、ref 和描述转发用例；`FieldLabelAudit.a11y.chromium.spec.ts` 在浅色和深色下的默认、自定义主题、RTL 和窄屏用例                                                                                                                                                                              | 单控件、组、描述、交互式描述子元素                                                                        | 错误的标签元素、关联丢失、描述嵌套，或转发的组/交互式点击都会失败。证据缺口：没有测试断言隐藏的标签和描述不占布局槽位。                                                                                                       | `audit:FieldLabel/accessibility` |
| FR4、ORD1        | `FieldLabel.test.tsx` 的可选、必填、两者同时设置和国际化用例；`FormLayout.test.tsx` 经由 Field 的默认可选性用例                                                                                                                                                                                                         | 可选、必填、两者、本地化                                                                                  | 错误的本地化标记、必填胜过可选，或标记重复了表单默认值都会失败。                                                                                                                                                              | `audit:FieldLabel/behavior`      |
| FR5              | `FieldLabel.test.tsx` 的标签图标、信息按钮位置和带可选用例的工具提示用例                                                                                                                                                                                                                                                | 图标、工具提示、可选性                                                                                    | 缺少图标或工具提示锚点会失败。证据缺口：没有测试断言源顺序、flex 行或逻辑间距。                                                                                                                                               | `audit:FieldLabel/layout`        |
| FR6、ORD2        | `FieldLabel.test.tsx` 的 ref、布局项和标签目标用例；`themingTargets.test.ts`                                                                                                                                                                                                                                            | ref；组合目标；带描述包装层                                                                               | ref 被丢弃或 `field-label` 目标丢失会失败；已渲染但未出现在已记录目标中的 class 会失败。证据缺口：没有测试断言在带描述包装层或带 `labelTooltip` 行时，调用方 class、style、`xstyle`、data 和事件 props 会作用于内层标签元素。 | `audit:FieldLabel/api`           |
| FR7              | 证据缺口：没有类型测试针对渲染出的组 span 固定公共 ref 与 props                                                                                                                                                                                                                                                         | —                                                                                                         | —                                                                                                                                                                                                                             | `audit:FieldLabel/api`           |
| FR8、AR5         | `FieldLabelAudit.a11y.chromium.spec.ts` 的工具提示锚点计数                                                                                                                                                                                                                                                              | 存在工具提示                                                                                              | 审计断言标签元素之后且在其外部有一个具名、可聚焦的 InfoTip 按钮；匿名、不可聚焦或嵌套在标签内的触发器都会失败。                                                                                                               | `audit:FieldLabel/accessibility` |
| FR9              | `FieldLabel.test.tsx` 的信息按钮位置与名称、隐藏标签的 Tab 停靠点、手指轻点、触控笔轻点、鼠标点击和 Space 复选框用例以及 Switch 标签点击用例；`FieldLabelTap.a11y.chromium.spec.ts` 的触摸轻点、鼠标点击和 Enter 文本框用例以及隐藏标签的聚焦按钮位于字段上方用例；证据缺口：没有检查测量隐藏标签的按钮是否不占布局槽位 | 复选框、文本框和 Switch 标签；手指、触控笔、鼠标、Enter 和 Space；`isLabelHidden` 且键盘焦点在 InfoTip 上 | 对信息触发器的轻点、点击或按键会激活、聚焦或切换控件，信息按钮位于标签元素内部，触发器名称不含标签，或隐藏标签的 InfoTip 占据布局空间或在聚焦时仍不可见，这些都会失败。                                                       | `audit:FieldLabel/accessibility` |
| PR1              | 证据缺口：没有测试断言不存在保留资源                                                                                                                                                                                                                                                                                    | —                                                                                                         | —                                                                                                                                                                                                                             | `audit:FieldLabel/code-health`   |
| 文档             | `docPropLiterals.test.ts`；`docPropReferences.test.ts`                                                                                                                                                                                                                                                                  | 已记录的 props 与默认值                                                                                   | 已记录的字面量或 prop 引用偏离源类型会失败。                                                                                                                                                                                  | `audit:FieldLabel/docs`          |
| RTL 适用性       | `apps/storybook/rtl-audit/verified-not-applicable.json` 中 `core/FieldLabel` 的条目                                                                                                                                                                                                                                     | 已提交的 FieldLabel stories                                                                               | 某个 story 一旦获得方向性放置或行为，该“不适用”条目就会过时。                                                                                                                                                                 | `audit:FieldLabel/i18n-rtl`      |

## Current-state impact

- **组模式的类型（FR7）。** 组模式渲染 `<span>`，而公共 props 和 ref 却按 `HTMLLabelElement` 定型，这与 `architecture:public-component-api` 的 INV8 和 INV9 相悖；修复方案是 OQ1。

## Decision log

- **DEC-1 — 对信息触发器的按压是用于其帮助的。** 对标签信息触发器的轻点、点击、Enter 或 Space 会打开或关闭帮助，且绝不会激活标签的控件，因此询问某个设置的作用绝不会切换开关或聚焦字段，无论使用何种指针或按键。触发器是 `component:InfoTip`，即在 Tooltip 按压切换之上套用信息图标预设，位于标签元素之后，因为一个 `<label>` 除其所标注的控件外不得包含其他控件。已否决：把轻点或鼠标点击留给标签。

标签元素与 ref 的类型定义是 OQ1。

## Open questions

- **OQ1 — `isGroupLabel` 是否应暴露一个可区分的 span 根 BaseProps/ref 契约，还是 FieldLabel 应使用一个在两种模式下公共类型都稳定的根元素？**（`human-api`）

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
