---
schema_version: 3
template_version: 7
kind: component
id: component:Field
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Field/Field.test.tsx,
    packages/core/src/Button/__tests__/ButtonHitArea.interaction.browser.spec.ts,
    packages/core/src/FormLayout/FormLayout.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/docPropLiterals.test.ts,
    packages/core/src/docPropReferences.test.ts,
    apps/storybook/rtl-audit/verified-not-applicable.json,
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
system_specs:
  [spec:AST-027/FR1, spec:AST-027/FR2, spec:AST-027/FR3, spec:AST-027/FR11]
---

# Field component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                            |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Field` 为一个由调用方拥有的控件包裹标签、可选描述与状态、可选性指示器、显式宽度以及根级 `BaseProps`；它还会消费 FormLayout 的水平标签模式。                                                    |
| 行为          | 单个控件使用原生标签关联；分组使用带标签的 span。状态消息获得稳定 ID，并使用持久化 live region。水平标签模式暴露一个受保护的 `data-layout` 主题轴。                                             |
| 最终用户影响  | 用户能够识别自定义控件、听到其描述与变化的状态，并在普通与水平表单布局中始终保持标签/控件/状态之间的关系。                                                                                      |
| 构建者影响    | 构建者提供控件及其 ID，将描述/状态 ID 接到该控件上，在需要时选择分组语义，并使用对被包裹表面而言安全的状态放置方式。                                                                            |
| 兼容性/就绪度 | 记录已发布的行为；无 API、默认值或 DOM 变更。对任意子元素而言，默认的 `statusVariant="attached"` 与 `family:input-fields/FR8` 冲突；这一点列在 “Current-state impact” 下，迁移仍未解决（OQ1）。 |
| 审查检查      | 拒绝以下情况：标签/分组关联丢失、根 props 被丢弃、调用方替换 `data-layout`、状态播报重复或缺失、局部 z-index 逃逸、未记录的公共字面量，或声称所有自定义控件都能安全支持附加状态。               |
| 治理规则      | 既定的公共 `Field` 接口；`family:input-fields` 共享所有权与 FR8；`architecture:public-component-api/INV5–INV8`；`spec:AST-027/FR1–FR3`；HTML label 与 ARIA 命名/描述语义。                      |

本表是审查用的投影；下文的正文才是权威。

## Intent

`Field` 为尚未拥有 Astryx 字段外壳的原生、自定义或第三方控件提供共享的标签、描述、状态、宽度与布局外框。调用方继续拥有控件的值、交互模型以及控件专属的无障碍语义。

## Compatibility and migration

- 已发布默认值是否保留：是；在当前实现中 `statusVariant` 仍默认 `attached`。
- 兼容性类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更。
- 受控/非受控行为：由调用方拥有，未变。
- 迁移决策：无；解决 OQ1 需要单独的兼容性决策。

## Ownership boundary

**拥有**

- 根字段框、显式宽度、局部堆叠边界以及组合顺序。
- 标签与描述在调用方拥有的控件周围的位置。
- 单控件与分组标签语义。
- 状态消息的放置以及持久化 live region 播报。
- FormLayout 的水平标签投影。

**不拥有 / 非目标**

- 被包裹控件的值、焦点模型、键盘行为、禁用行为或事件语义 —— 由调用方或被包裹组件拥有。
- 对被包裹控件应用 `aria-describedby` —— 调用方提供控件，并接好生成或显式的 ID。
- `FieldLabel`、`FieldStatus`、`Tooltip` 或调用方拥有子元素的视觉与语义契约 —— 由这些组件拥有。
- 输入族成员 API 与控件框部件 props —— 由 `family:input-fields` 及各成员拥有。

## Public concepts

| 概念 | 封闭值或状态 | 含义 | 按变体/方向/状态的可用性 | 默认值 | 所有者 | 稳定性 | 非法值行为 |
| --- | --- | --- | --- | --- | --- | --- |
| 标签模式 | 单控件；分组 | 选择原生 `<label htmlFor>`，或选择通过 `aria-labelledby` 命名的 `<span>`。 | 所有布局。 | 单控件 | `component:Field` | 已发布 | 受类型约束 |
| 标签可见性 | 可见；视觉隐藏 | 在视觉上隐藏标签与描述，同时为辅助技术保留它们。 | 所有布局。 | 可见 | `component:Field` | 已发布 | 受类型约束 |
| 可选性标记 | 无；可选；必填 | 显示对 FormLayout 可选性默认值的本地化例外。 | 标签呈现。 | 无 | `component:Field` | 已发布 | 两者同时设置会警告；在视觉上可选优先，除非 FormLayout 的默认值为可选，此时会抑制可选并显示必填。 |
| 状态放置 | `attached`；`detached`；`tooltip` | 将状态框放在控件后面、放在其下方，或把可见的 tooltip 提示留给输入。 | 渲染状态框时需要消息；tooltip 仍会播报消息。 | `attached`（见 OQ1） | `family:input-fields` | 已发布；一致性差距 | 受类型约束 |
| 宽度 | 缺省；数字；CSS 尺寸字符串 | 设定完整普通字段框的尺寸。 | 普通框布局；水平标签模式使用 `display: contents`。 | 包含它的布局 | `component:Field` | 已发布 | 受类型约束 |
| 字段布局 | 普通框；来自 FormLayout 的 `horizontal-labels` | 堆叠内容，或将标签与输入组投影到父网格中。 | 从 `FormLayoutContext` 解析。 | 普通框 | `component:Field` | 已发布 | 受上下文约束 |
| 描述/状态 ID | 显式；由 `inputID` 生成；缺省 | 为调用方拥有的 `aria-describedby` 接线命名稳定的描述与消息元素。 | 仅当对应文本存在时才生成。 | 文本存在时生成 | `component:Field` | 已发布 | 空文本不产生输出 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                             | 依据                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| FR1 | 单控件标签渲染为 `<label htmlFor={inputID}>`；分组标签渲染为非 label 元素，并带 `labelID`，供调用方拥有的 `aria-labelledby` 使用。                                                                                                                                                                 | 既定的公共接口；HTML 与 ARIA 语义                        |
| FR2 | 视觉隐藏的标签与描述仍保留在 DOM 中，并脱离布局流。                                                                                                                                                                                                                                                | 既定的公共接口与无障碍行为                               |
| FR3 | 描述与状态 ID 在提供时使用显式值，否则仅当文本存在时解析为 `${inputID}-desc` 与 `${inputID}-status`。                                                                                                                                                                                              | 既定的公共接口                                           |
| FR4 | 错误状态消息通过持久化 live region 以 assertive 方式播报，警告/成功消息则以 polite 方式播报；tooltip 放置不渲染 `FieldStatus` 框，但保留播报。                                                                                                                                                     | 现有测试；族所有权                                       |
| FR5 | 普通布局按标签、控件、然后可选状态的顺序排列。水平标签模式将标签包装器放在一个描述/控件/状态组之前，并反映 `data-layout="horizontal-labels"`；调用方 props 不能替换该由组件拥有的主题标记。                                                                                                        | 既定的布局接口；`architecture:public-component-api/INV5` |
| FR6 | `width` 作用于普通根字段框；它不为调用方拥有的控件设置样式，在水平标签模式下也没有可供定位的框。                                                                                                                                                                                                   | 既定的公共接口；`family:input-fields` 共享所有者         |
| FR7 | 根 ref、data/ARIA/DOM 输入、事件、`xstyle`、类名与内联样式都会到达根或在其上组合，且不替换组件拥有的语义。                                                                                                                                                                                         | `architecture:public-component-api/INV5–INV8`            |
| FR8 | Field 根隔离每个局部附加状态的绘制关系，而不给根分配页面级 z-index。                                                                                                                                                                                                                               | `spec:AST-027/FR1–FR3`、`FR11`                           |
| FR9 | Field 必须仅对不透明、有边框、固定高度且尺寸反射可靠的控件使用附加放置；高大、换行、半透明、无边框以及其他不合格的控件（自定义控件通常如此）使用分离放置或组件自有的放置方式。实现差距：`statusVariant` 对每个子元素都默认 `attached`，因此不合格的控件会收到附加放置，除非调用方另行选择（OQ1）。 | `family:input-fields/FR8`                                |

### Allowed variation

- **AV1 — 调用方拥有的控件。** 任何控件标记都可占用该槽位；Field 不检查、不克隆也不改变它。
- **AV2 — 表单排布。** FormLayout 可选择普通或水平标签排布，而不改变标签、描述、状态或播报的所有权。
- **AV3 — 状态表面。** 合格的控件可使用附加放置；其他控件使用分离放置或成员自有的 tooltip 呈现方式。

### Representative states

| 状态     | 必需不变式                                        | 允许的变化                               |
| -------- | ------------------------------------------------- | ---------------------------------------- |
| 仅标签   | 一个关联标签位于调用方拥有的控件之前。            | 可见或视觉隐藏。                         |
| 描述     | 一个描述元素接收解析出的 ID。                     | 调用方可使用显式 ID 或生成的值。         |
| 分组     | 分组标签不是字面的 `<label>`，且可通过 ID 引用。  | 调用方拥有分组角色与 `aria-labelledby`。 |
| 状态     | 消息接收解析出的 ID，并在其紧急度通道上播报一次。 | 附加/分离框或 tooltip 自有的可见提示。   |
| 水平标签 | 标签与输入组参与父网格，并保留 `data-layout`。    | 描述/状态可以缺省。                      |
| 显式宽度 | 普通根获得请求的尺寸并保持可收缩。                | 数字或 CSS 尺寸字符串。                  |

### Transformation and precedence order

- **ORD1 — 根 props。** 调用方的 DOM/data/事件 props 先被转发；Field 拥有的视觉状态反映随后应用；StyleX、调用方类名与调用方内联样式按文档记载的顺序组合。
- **ORD2 — IDs。** 显式描述/状态 ID 优先；否则文本存在时从 `inputID` 派生 ID；文本缺失则不产生带 ID 的元素。
- **ORD3 — 可选性。** FormLayout 的默认可选性会抑制匹配的可见标记；如果两个本地布尔值都为 true，Field 会警告，且可选标记在视觉上优先，除非 FormLayout 的默认值为可选，此时会抑制可选标记从而显示必填标记。

### Performance and resources

- **PR1 — 无按字段的全局资源。** Field 不拥有任何监听器、观察器、定时器或外部存储。状态播报委托给共享的持久化 live-region 运行时，而 `labelTooltip` 会引入共享 Tooltip 的监听器与层。

## Accessibility contract

- **AR1 — 标签关联。** 单个控件获得原生标签关联；分组控件使用调用方接线的 `aria-labelledby`，绝不使用会产生误导的字面 `<label>`。
- **AR2 — 描述关联。** 描述文本与无障碍名称保持分离，并暴露稳定 ID 供调用方拥有的 `aria-describedby` 使用。
- **AR3 — 状态播报。** 变化的状态文本通过持久化 live region 播报，包括不渲染消息框的 tooltip 放置。
- **AR4 — 隐藏标签。** 视觉隐藏的标签与描述文本仍可供辅助技术使用。

## Design relationships

当前仓库没有治理组件本地视觉调优的设计记录。标签、描述与状态使用共享的语义字体、颜色与间距 token。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "field"},
  "Label": {"target": "field-label"},
  "Ordinary description": {
    "none": {
      "reason": "reachability-gap: The ordinary-layout description paints supporting text outside the field-label target and has no current public target of its own."
    }
  },
  "Horizontal-label description": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  },
  "Control slot": {
    "none": {
      "reason": "intentional: The wrapped control is caller-owned or another Astryx component and retains its own theming surface."
    }
  },
  "Status message": {"target": "field-status"},
  "Input status icon": {"target": "input-status-icon"},
  "Input clear button": {"target": "input-clear-button"},
  "Input clear icon": {"target": "input-clear-icon"},
  "Optional/Required indicator": {"inherits": "field-label"},
  "Label tooltip trigger": {
    "none": {
      "reason": "unsettled: the trigger is component:InfoTip's button, which has no public theming target yet; its info icon stays on Icon/icon through InfoTip"
    }
  },
  "Label tooltip surface": {
    "delegatesTo": {"owner": "component:Tooltip", "target": "tooltip"}
  }
}
```

普通描述仍是不带 Field 自有目标的稳定使用方解剖结构。可见的水平标签描述委托给 `Text/text`；当 `isLabelHidden` 为 true 时，同一内容委托给 `VisuallyHidden`，且不暴露任何绘制目标。标签 tooltip 将其尚无公共目标的 `component:InfoTip` 触发按钮，与由层托管的 `Tooltip/tooltip` 表面分开处理。

## Family and system relationships

- `family:input-fields` 拥有共享的状态放置能力，并将 Field 认定为独立的标签、描述、状态放置与显式宽度所有者。
- `architecture:public-component-api` 拥有根 prop、样式、事件与 ref 组合。
- `architecture:component-theming-surface` 拥有解剖结构资格与目标处置。
- `architecture:component-test-sufficiency` 拥有对变异敏感的证据与有界分区。
- `spec:AST-027` 拥有控件与附加状态之间隔离的局部绘制关系。

## Verification map

| 契约                         | 验证                                                                                             | 代表性状态                                                                    | 变异或失败预期                                                                                                     | 审计部分                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| FR1–FR3, ORD2, AR1, AR2, AR4 | `Field.test.tsx` 的 label 元素、分组标签、隐藏标签与描述、描述 ID 以及生成 ID 用例               | 单控件、分组、可见与隐藏标签、显式与生成 ID                                   | 关联丢失、元素错误、隐藏文本缺失或 ID 错误即失败。                                                                 | `audit:Field/accessibility` |
| FR4, AR3                     | `Field.test.tsx` 播报与 tooltip 放置用例                                                         | 首次挂载、更新、重复、错误、警告、tooltip、无消息                             | 播报缺失、重复、过期或紧急度错误即失败。                                                                           | `audit:Field/accessibility` |
| FR5, FR6, ORD1               | `Field.test.tsx` 水平标签、宽度与窄行用例                                                        | 普通与水平布局；字符串与数字宽度；窄行                                        | 布局标记可被替换、网格分组错误或宽度落在内部控件上即失败。证据缺口：没有测试断言普通布局中标签、控件、状态的顺序。 | `audit:Field/layout`        |
| FR7                          | `Field.test.tsx` ref 与水平标签根 props 用例                                                     | ref；水平模式下的 class、style、data 与事件 props                             | ref 丢失或布局标记被调用方替换即失败。证据缺口：没有测试断言普通布局中的根 `xstyle`、class、style 与事件 props。   | `audit:Field/api`           |
| ORD3                         | `Field.test.tsx` 可选、必填与两者同时设置用例；`FormLayout.test.tsx` 经由 Field 的默认可选性用例 | 可选；必填；两者；表单默认                                                    | 标记缺失、两者同时设置时无警告，或标记重述表单默认值即失败。                                                       | `audit:Field/behavior`      |
| FR8                          | `Field.test.tsx` 附加层与局部堆叠用例                                                            | 附加、无状态、自定义控件                                                      | 移除隔离或把根排到其父级之外即失败。                                                                               | `audit:Field/code-health`   |
| FR9                          | `Field.test.tsx` 自定义控件的附加层用例                                                          | 带附加状态的自定义控件                                                        | 该测试固定了当前的附加默认值，因此当 FR9 差距关闭时它会随之改变。                                                  | `audit:Field/behavior`      |
| PR1                          | 证据缺口：没有测试断言不存在按字段的全局资源                                                     | —                                                                             | —                                                                                                                  | `audit:Field/code-health`   |
| `spec:AST-094` FR42          | `ButtonHitArea.interaction.browser.spec.ts` 的清除带与可清除 Selector 的 chevron 用例            | 文本输入框的清除按钮位于其文本旁；可清除 Selector 的清除按钮位于其 chevron 旁 | 清除带越过到文本或到字段下一部件间隙的一半，或点击 chevron 触发清除，即失败。                                      | `audit:Field/behavior`      |
| 主题解剖                     | `scripts/check-knowledge.mjs`；`themingTargets.test.ts`                                          | Field 根、标签、描述、调用方控件、状态、共享输入提示件、指示器、tooltip       | 处置无效，或渲染出的 class 不在文档记载的目标中，即失败。                                                          | `audit:Field/theming`       |
| 文档投影                     | `docPropLiterals.test.ts`；`docPropReferences.test.ts`                                           | 状态放置、`labelIcon` 及其他已记载的 props                                    | 已记载的字面量或 prop 引用偏离源类型即失败。                                                                       | `audit:Field/docs`          |
| RTL 适用性                   | `apps/storybook/rtl-audit/verified-not-applicable.json` 中 `core/Field` 的条目                   | 已检入的 Field stories                                                        | 某个 story 一旦获得方向性放置或行为，该不适用条目就会过期。                                                        | `audit:Field/i18n-rtl`      |

## Current-state impact

- **附加默认值（FR9）。** Field 对每个子元素都将 `statusVariant` 默认为 `attached`，这与 `family:input-fields/FR8` 相悖；如何迁移该默认值是 OQ1。

## Decision log

无组件本地决策。Field 应用 `family:input-fields` 与 `spec:AST-027`。

## Open questions

- **OQ1 — Field 应如何迁移已发布的 `attached` 默认值，使任意自定义控件不会收到 `family:input-fields/FR8` 认为它们可能无法安全支持的放置方式？**（`human-api`）

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或族/系统规则。它链接到这些内容的所有者。
