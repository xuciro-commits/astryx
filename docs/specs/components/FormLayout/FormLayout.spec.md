---
schema_version: 3
template_version: 7
kind: component
id: component:FormLayout
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layer/layerScopedContext.test.tsx,
    .github/scripts/story-play-guard.js,
    .github/visual-baseline/manifest.json,
    packages/core/src/FormLayout/FormLayout.test.tsx,
    apps/storybook/stories/FormLayout.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/docPropLiterals.test.ts,
    packages/core/src/docPropReferences.test.ts,
  ]
modules: []
families: [family:input-fields]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: [spec:AST-038, spec:AST-117]
---

# FormLayout component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `FormLayout` 通过 `vertical`、`horizontal` 和 `horizontal-labels` 方向排布调用方自有的字段，提供表单级的可选性与入口错误行为默认值，导出其上下文与支持类型，并接受根级 `BaseProps`。 |
| 行为          | `vertical` 堆叠子元素；`horizontal` 按逻辑行内顺序为每个子元素创建一个分数网格轨道；`horizontal-labels` 将 Field 的标签与控件配对，然后在视口低于 481px 时折叠。                     |
| 最终用户影响  | 用户会遇到可预测的字段间距与顺序，并且即使表单级的视觉约定让常见情形不带标记，辅助技术也能收到必填状态信息。                                                                         |
| 构建方影响    | 构建方提供字段以及任何语义化的 `<form>`、标题或页脚；嵌套布局会为其后代替换外层的方向、可选性与入口错误行为上下文。                                                                  |
| 兼容性/就绪度 | 已发布行为记录为 current，另有可选的 `defaultEntryErrorBehavior` 属性（FR7），该属性未设置时使字段保持其已发布行为。                                                                 |
| 评审检查      | 驳回以下情形：根属性丢失、物理行内排序、折叠边界改变、方向反射可被调用方覆盖、嵌套上下文遮蔽丢失、与 ARIA 不一致的可见可选性约定，或优先于字段自身设置的入口错误行为默认值。         |
| 治理规则      | 既定的 FormLayout 公共接口；`family:input-fields` 的外层排布归属；`architecture:public-component-api/INV5–INV9`；`architecture:component-theming-surface/INV2–INV6`。                |

本表是评审视角的投影；下文正文才是权威依据。

## Intent

`FormLayout` 负责调用方自有表单字段之间的外层空间关系。它不创建表单提交、字段状态、标签、控件或操作区域。

## Compatibility and migration

- 已发布的默认值保留：是；方向默认为 `vertical`，`defaultOptionality` 未设置时可选性仍归字段所有，且 `defaultEntryErrorBehavior` 未设置时字段保持其已发布的 `'complete'` 行为。
- 兼容类别：增量；`defaultEntryErrorBehavior` 是新的可选属性（`spec:AST-117` FR2）；没有其他公共属性、默认值或行为发生变化。
- 受控/非受控行为：不适用；FormLayout 不拥有任何表单值或提交状态。
- 迁移决策：无。

## Ownership boundary

**拥有**

- 外层字段排布、间距、方向，以及横向标签在窄视口下的折叠。
- 表单级可选性与入口错误行为上下文，以及嵌套布局的遮蔽。
- 根 DOM 元素、根属性合成，以及 `form-layout` 主题目标。

**不拥有 / 非目标**

- 表单语义、提交、校验或操作位置——由产品调用点和原生 `<form>` 拥有。FormLayout 仅传递输入揭示自身拒绝结果的默认时机（FR7）。
- 字段标签、控件、状态和内部几何——由 `component:Field`、各个输入组件和 `family:input-fields` 拥有。
- 调用方提供的标题与页脚的内容或视觉契约——由其渲染的组件或调用点拥有。

## Public concepts

| 概念         | 封闭取值或状态                                  | 含义                                                     | 按变体/方向/状态划分的可用性         | 默认值             | 拥有者                 | 稳定性 | 无效值行为       |
| ------------ | ----------------------------------------------- | -------------------------------------------------------- | ------------------------------------ | ------------------ | ---------------------- | ------ | ---------------- |
| 方向         | `vertical`；`horizontal`；`horizontal-labels`   | 选择外层排布方式，并将该取值提供给后代。                 | 所有布局。                           | `vertical`         | `component:FormLayout` | Stable | 受类型约束       |
| 默认可选性   | unset；`optional`；`required`                   | 仅标记例外情形，同时控件保留解析后的必填状态。           | 所有方向；最近的嵌套布局会遮蔽外层。 | unset / 按字段     | `component:FormLayout` | Stable | 受类型约束       |
| 根合成       | DOM/data/ARIA/events；ref；class/style/`xstyle` | 扩展根布局容器，而不替换其拥有的反射。                   | 所有方向。                           | 无调用方装饰       | `component:FormLayout` | Stable | 共享合并契约     |
| 入口错误行为 | unset；`complete`；`blur-or-enter`              | 设定后代输入揭示自身拒绝结果的时机；字段自身的属性优先。 | 所有方向；最近的嵌套布局会遮蔽外层。 | unset / `complete` | `spec:AST-117`         | Stable | 受类型约束       |
| 布局上下文   | 方向、可选性与入口错误行为                      | 让 Field 与输入组件适配布局、必填状态与拒绝时机。        | 同一 layer 作用域内的后代。          | vertical / unset   | `component:FormLayout` | Stable | 最近的提供者优先 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 依据                                                      |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| FR1 | `vertical`（默认值）以 flex 列堆叠子元素，间距为 `--spacing-4`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 已发布源码、测试和 stories                                |
| FR2 | `horizontal` 按文档的逻辑行内顺序，将每个直接子元素放入一个 `1fr` 网格列，间距为 `--spacing-4`，且没有组件自有的换行规则。                                                                                                                                                                                                                                                                                                                                                                                                                            | 已发布源码、测试和 stories                                |
| FR3 | `horizontal-labels` 是两列网格（`auto 1fr`），行间距为 `--spacing-3`、列间距为 `--spacing-4`，条目对齐到起始侧，因此 Field 标签位于其控件的行内起始侧；在视口宽度为 480px 或以下时，它变成一列 flex 布局，间距为 `--spacing-4`。OQ1 尚待确定：折叠后的标签与控件是否需要更紧密的配对间距。                                                                                                                                                                                                                                                            | 已发布源码、Field 组合和测试                              |
| FR4 | FormLayout 将自身的方向、`defaultOptionality` 和 `defaultEntryErrorBehavior` 提供给同一 layer 内的后代；嵌套的 FormLayout 会为其自身后代替换这三者（包括未设置的取值），而在 FormLayout 内部打开的 layer 中的内容一开始不带这三者（`spec:AST-038` FR7、FR8）。                                                                                                                                                                                                                                                                                        | 上下文源码和测试                                          |
| FR5 | `defaultOptionality` 仅抑制重复表述表单默认值的可见标记；后代控件仍会暴露解析后的 `aria-required`，而原生 `required` 仍与显式的字段 `isRequired` 绑定。未设置时保留每个字段自己的指示标记。例外：CheckboxList、CheckboxInput 和 Switch 将空选择、未勾选的复选框或关闭的开关视为一种回答，因此 `defaultOptionality` 不会给它们任何必填状态：它们既不从其中获得 `aria-required`，也不获得原生 `required`。CheckboxInput 和 Switch 仅通过自身的 `isRequired` 成为必填，CheckboxList 及其各行不从表单默认值获得任何必填状态；上述标记规则对它们保持不变。 | 测试；`family:input-fields` 归属                          |
| FR6 | 根元素是 `div`。`ref`、DOM、data、ARIA 和事件属性、`xstyle`、类名以及内联样式会抵达根元素或在根元素上合成，且不替换 `data-direction` 或 `form-layout` 目标。                                                                                                                                                                                                                                                                                                                                                                                          | `architecture:public-component-api/INV5–INV8`；源码和测试 |
| FR7 | `defaultEntryErrorBehavior` 为未设置自身 `entryErrorBehavior` 的 DateInput、DateTimeInput、TimeInput 和 NumberInput 后代设定入口错误行为；未设置时让它们保持 `'complete'`，即其已发布行为（`spec:AST-117` FR2、FR3）。它不改变其他后代，也不改变调用方的 `status`。NumberInput 在两种取值下行为相同（`component:NumberInput` FR14）。                                                                                                                                                                                                                 | `spec:AST-117` DEC-2；上下文源码和测试                    |

### Allowed variation

- **AV1 — 调用方内容。** 任何调用方自有的字段、标题、说明内容或操作区域都可以作为子元素；FormLayout 不会检查或重写它。
- **AV2 — 嵌套排布。** 构建方可以嵌套垂直与水平布局；每个提供者仅拥有其后代作用域。
- **AV3 — 根样式。** 调用方样式可以改变容器的呈现，同时保留公共方向与子元素契约。

### Representative states

| 状态                 | 必需不变式                                                                    | 允许的变化                                                             |
| -------------------- | ----------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| 垂直                 | 一条块轴堆叠，间距使用 token。                                                | 任意调用方自有的子元素。                                               |
| 水平                 | 按逻辑行内顺序，每个子元素一个 `1fr` 网格轨道。                               | 子元素数量与内容。                                                     |
| 横向标签 / 宽视口    | 标签/控件配对共用一致的两列轨道。                                             | 标签与控件的内容。                                                     |
| 横向标签 / 窄视口    | 在 480px 或以下变成一列垂直布局，间距为 `--spacing-4`，且没有组件自有的溢出。 | 调用方自有内容可以换行；OQ1 询问每对标签与控件是否应保持更紧密的间距。 |
| 默认可选             | 只有显式必填的字段显示例外标记。                                              | 字段与输入类型。                                                       |
| 默认必填             | 只有显式可选的字段显示例外标记。                                              | 字段与输入类型。                                                       |
| 嵌套                 | 内层方向、可选性和入口错误行为替换外层取值。                                  | 任何受支持的内层方向/默认值组合。                                      |
| 默认 `blur-or-enter` | 没有自身 `entryErrorBehavior` 的成员仅在提交时揭示自身的拒绝结果。            | 字段与输入类型；字段自身的 `entryErrorBehavior`。                      |

### Transformation and precedence order

- **ORD1 — 上下文。** 显式属性以 `vertical` 和未设置的默认值为基准解析，随后最近的提供者将解析后的取值暴露给后代。
- **ORD2 — 根属性。** FormLayout 自有的目标与方向反射会与 StyleX 及调用方样式合成；调用方 DOM 属性抵达同一根元素，且不替换自有的反射。
- **ORD3 — 可选性。** 布局默认值确立不带标记的多数情形；字段级的 `isRequired` 或 `isOptional` 标记例外，并且仅在显式请求时才控制原生校验。CheckboxList、CheckboxInput 和 Switch 属于 FR5 例外：默认值不为它们设定任何必填状态，因此只有它们自身的 `isRequired` 才使其成为必填。
- **ORD4 — 入口错误行为。** 字段自身的 `entryErrorBehavior` 优先于最近布局的 `defaultEntryErrorBehavior`，后者优先于 `'complete'`（`spec:AST-117` FR2）。

### Performance and resources

- **PR1 — 稳定的上下文标识。** 后代按方向、可选性与入口错误行为的每种组合获得一个记忆化的上下文值；FormLayout 不拥有任何监听器、观察器、定时器或外部资源。

## Accessibility contract

- **AR1 — 布局保持非语义化。** FormLayout 渲染一个 `<div>`，不隐含 `<form>`、分组、标签或提交语义；调用方在其组合需要时自行提供这些语义。
- **AR2 — 必填状态仍可感知。** 表单级的可选性约定可以移除冗余的可见标记，但后代控件仍为辅助技术保留解析后的必填状态。这不适用于 FR5 例外（CheckboxList、CheckboxInput、Switch），它们不带标记的状态是一种回答，而不是缺失的必填值；标记了 `isRequired` 的控件仍会暴露其必填状态。
- **AR3 — 逻辑顺序得到保留。** 每种方向都保留 DOM 顺序与逻辑行内流；FormLayout 不创建单独的键盘顺序。

## Design relationships

| 解剖结构或状态 | 设计要求                                              | 呈现权威       | 层级角色 | 组件契约     |
| -------------- | ----------------------------------------------------- | -------------- | -------- | ------------ |
| 布局容器       | 调用方字段的外层排布与间距。                          | 当前源码与文档 | 辅助     | FR1–FR3、FR6 |
| 表单标题       | 调用方内容；FormLayout 不渲染也不为其设置样式。       | 调用方自有     | 突出     | —            |
| 字段           | 调用方的 Field 与输入组件。                           | 它们各自的组件 | 突出     | FR4、FR5     |
| 页脚           | 调用方的操作区域；FormLayout 不渲染也不为其设置样式。 | 调用方自有     | 辅助     | —            |

没有共享的设计记录规定 FormLayout 专属的呈现方式；间距使用 token 刻度。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Layout container": {"target": "form-layout"},
  "Form title": {
    "none": {
      "reason": "intentional: A title is caller-owned content; FormLayout neither renders nor styles a title part."
    }
  },
  "Fields": {
    "none": {
      "reason": "intentional: Caller-owned Field and input components retain their own theming targets."
    }
  },
  "Footer": {
    "none": {
      "reason": "intentional: A footer is caller-owned content; FormLayout neither renders nor styles an action region."
    }
  }
}
```

根目标反映封闭的 `direction` 轴。它拥有外层排布容器，不主张子组件所渲染的视觉部件。

## Family and system relationships

- `family:input-fields` 把 FormLayout 认定为外层排布、间距、方向、表单级可选性以及表单级入口错误行为默认值的拥有者。
- `spec:AST-117` 拥有入口错误行为；FR7 与 ORD4 投影其 FR2。
- `component:Field` 使用横向标签方向与可选性，同时保留标签、控件、描述与状态的归属。
- `architecture:public-component-api` 拥有根属性、样式、事件、ref 与已发布类型的合成。
- `architecture:component-theming-surface` 设定 `form-layout` 目标及其反射方向所遵循的规则。
- `architecture:component-test-sufficiency` 拥有有界的、对变异敏感的证据选择。

## Verification map

| 契约           | 验证                                                                                                           | 代表性状态                                                                                                                                                                                                       | 变异或失败预期                                                                                                                                                                                                                                                                                                              | 审计小节                         |
| -------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| FR1–FR3        | `FormLayout.test.tsx` 方向快照；`FormLayout.stories.tsx` play 检查；稳定的视觉基线 `core-formlayout--vertical` | 垂直、水平、横向标签的宽与窄                                                                                                                                                                                     | 样式类集合改变会使快照失败；窄视口下横向标签的控件窄于布局，或在宽视口下标签未出现在其控件之前，会使 play 检查失败；垂直布局改变会以变更形式返回评审。story play 守卫还会在 320px 和默认宽度下从右到左运行 AuditMatrix play，其中断言了镜像的水平列。缺口：没有任何从右到左的检查断言横向标签的标签位于其控件的行内起始侧。 | `audit:FormLayout/behavior`      |
| FR4, ORD1      | `FormLayout.test.tsx` 上下文与嵌套测试；`Layer/layerScopedContext.test.tsx`                                    | 默认、显式、嵌套；固定 Layer 与内联 Dialog 中的内容                                                                                                                                                              | 默认值或取值丢失、内层布局的显式值失去遮蔽能力，或 layer 中的内容仍读取外层 `defaultOptionality`，都会失败。缺口：没有测试覆盖未设置属性的内层布局（它会提供自己的默认值），也没有覆盖跨 layer 边界的 `direction`。                                                                                                         | `audit:FormLayout/behavior`      |
| FR5, ORD3, AR2 | `FormLayout.test.tsx` 可选性与 `aria-required` 测试                                                            | 必填、可选、未设置的默认值；显式例外                                                                                                                                                                             | 冗余标记、缺少 `aria-required`，或默认值带来的原生 `required`，都会失败。FileInput、Slider、Typeahead 和 Tokenizer 的测试覆盖 `required` 默认值。                                                                                                                                                                           | `audit:FormLayout/accessibility` |
| FR5            | `FormLayout.test.tsx` 的“必填默认值使未标记的复选框、开关和复选框组不带必填状态”                               | 在 `defaultOptionality="required"` 下，未标记的 CheckboxInput、Switch 和 CheckboxList（每个复选框）不带 `aria-required`，也不带 `required`，而它们旁边的 TextInput 仍带 `aria-required`；标记遵循 FieldLabel FR4 | 未标记的复选框、开关或复选框组带 `aria-required`，即失败。                                                                                                                                                                                                                                                                  | `audit:FormLayout/accessibility` |
| FR6, ORD2      | `FormLayout.test.tsx` 的 ref、透传与自有元数据测试；`themingTargets.test.ts`                                   | ref、属性、冲突的 `data-direction`                                                                                                                                                                               | ref 落在非 `div` 上、`id` 或 `role` 丢失，或 `data-direction` 被替换，即失败。缺口：没有测试覆盖事件属性或样式输入的合并顺序。                                                                                                                                                                                              | `audit:FormLayout/api`           |
| AR1, AR3       | `FormLayout.test.tsx` 的 div 与透传测试；`FormLayout.stories.tsx` play 检查                                    | 普通根元素；调用方的 `role`                                                                                                                                                                                      | 根元素不是 `div`，或调用方的 `role` 丢失，即失败。不镜像从右到左的水平列会在 story play 守卫下的 AuditMatrix play 中失败。缺口：如果 FormLayout 添加自己的角色，没有检查会失败。                                                                                                                                            | `audit:FormLayout/accessibility` |
| FR7, ORD4      | `FormLayout.test.tsx` 的“FormLayout defaultEntryErrorBehavior”用例                                             | 未设置、`complete`、`blur-or-enter`；带自身 `entryErrorBehavior` 的字段；有值与无值的嵌套布局；layer 中的字段                                                                                                    | 成员忽略默认值、默认值优先于字段，或嵌套或分层的字段保留外层默认值，即失败。                                                                                                                                                                                                                                                | `audit:FormLayout/behavior`      |
| PR1            | 源码审阅                                                                                                       | 每种方向                                                                                                                                                                                                         | 缺口：没有自动化检查覆盖上下文标识或新增资源。                                                                                                                                                                                                                                                                              | `audit:FormLayout/behavior`      |

## Decision log

此处没有记录。`spec:AST-117` DEC-2 决定入口错误行为默认值。

## Open questions

- **OQ1 — 在 480px 及以下，每个横向标签配对是否应保留比相邻字段之间更小的字段内标签/控件间距？**（`human-design`）

## Content boundary

本文件不重复使用方的属性表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有方。
