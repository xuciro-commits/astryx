---
schema_version: 3
template_version: 7
kind: component
id: component:InputGroupText
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, layout, theming]
verified_by:
  [
    packages/core/src/InputGroup/InputGroup.test.tsx,
    packages/core/src/InputGroup/InputGroupText.test.tsx,
    packages/core/src/InputGroup/__tests__/InputGroupTextAudit.a11y.chromium.spec.ts,
    packages/core/src/utils/mergeProps.test.ts,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# InputGroupText component contract

## Contract at a glance

| 领域          | 契约                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变更。InputGroupText 接收 `children` 与基础 props。                                                                      |
| 行为          | InputGroup 内部一个不可交互、弱化的文本或图标单元格，它与相邻元素的边框拼接，并且只对整组的外侧角做圆角处理。              |
| 最终用户影响  | 用户会看到一个固定的前缀或后缀（如 `$` 或 `https://`），作为字段的一部分。它按纯文本朗读，而不是作为控件。                 |
| 构建者影响    | 无。                                                                                                                       |
| 兼容性/就绪度 | 记录已发布行为；无 API 或默认值变更。不含从右到左字母的纯文本位于带 `dir="ltr"` 的内层 `span` 中，并且单元格会隔离其文本。 |
| 审查检查      | 拒绝单元格上的交互式 role 或 tab 停靠点、发生换行或收缩的文本，或圆角化的内侧角。                                          |
| 治理规则      | `component:InputGroup`；`architecture:component-theming-surface`。                                                         |

该表是审查用的投影；下方正文具有权威性。

## Intent

InputGroupText 是 InputGroup 的文本附加项：一段固定文本或一个图标，显示在输入之前或之后。使用方的用法位于 `InputGroupText.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：无公共 prop、默认值或导出变更。DOM 发生变化：不含从右到左字母的纯文本位于带 `dir="ltr"` 的内层 `span` 中，并且单元格会隔离其文本（`unicode-bidi: isolate`）
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 文本单元格的绘制、尺寸、边框拼接与圆角处理。
- `input-group-text` 目标。

**不拥有 / 非目标**

- 组标签、行高与描述 —— 由 `component:InputGroup` 拥有。
- 命名或描述输入 —— 单元格不被输入的名称或描述引用。
- 在 InputGroup 之外使用 —— 未受契约约束。

## Public concepts

无新的公共概念。内容是调用方提供的文本或一个图标。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                    | 依据                                               |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| FR1 | InputGroupText 渲染一个不可交互、无 role 的元素，承载 `children`；不含从右到左字母的纯文本位于带 `dir="ltr"` 的内层 `span` 中（`design:bidirectionality` DR2）。`ref`、`className`、`style`、`xstyle` 以及其他 DOM props 会传到外层元素。 | 当前源码与测试                                     |
| FR2 | 单元格用较小的行内内边距将其内容垂直居中，在弱化背景上使用次级文本颜色的正文文本，从不换行，也从不收缩。                                                                                                                                  | 当前源码                                           |
| FR3 | 单元格绘制一条强调的、一个边框宽度的边框。第一个之后的每个单元格都与其前导相邻元素重叠一个边框宽度。只有第一个子元素的前导角和最后一个子元素的尾随角按元素圆角半径做圆角处理。                                                            | 当前源码                                           |
| FR4 | 单元格带有 `astryx-input-group-text`。                                                                                                                                                                                                    | `architecture:component-theming-surface`；当前源码 |

### Allowed variation

- **AV1 — 内容。** 任意文本或图标。单元格只为选择方向而读取纯文本（FR1）；富内容会被隔离，其方向由调用方标记。
- **AV2 — 主题绘制。** 主题可通过 `input-group-text` 重新设定单元格样式。

### Representative states

| 状态 | 必需不变式                           | 允许的变化 |
| ---- | ------------------------------------ | ---------- |
| 前缀 | 前导角做圆角处理；尾侧边缘为方角。   | 内容。     |
| 后缀 | 尾随角做圆角处理；与输入的边框重叠。 | 内容。     |

### Transformation and precedence order

- **ORD1 — 样式。** 先是组件样式，然后是 `xstyle`，最后是 `className` 与 `style`。

### Performance and resources

- **PR1 — 静态。** 无 state、effect 或监听器。

## Accessibility contract

- **AR1 — 纯文本。** 单元格没有 role 或 tab 停靠点，按阅读顺序作为普通文本朗读。

## Design relationships

| 解剖结构或状态 | 设计要求                                         | 表示权威 | 层级角色 | 组件契约 |
| -------------- | ------------------------------------------------ | -------- | -------- | -------- |
| 文本单元格     | 弱化、带边框、次级文本颜色的单元格，拼接于该行。 | 当前源码 | 支撑性   | FR2, FR3 |

没有任何设计记录管辖 InputGroupText。

## Family and system relationships

- `component:InputGroup` 承载该单元格，并拥有该单元格所拼接的那一行。

## Verification map

| 契约                          | 验证                                                                                                                                                                                                                                      | 代表性状态                                                                                                         | 变更或失败预期                                                                                                                                                      | 审计小节                        |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1                           | `InputGroupText.test.tsx` 的“is plain text with no role and no tab stop (FR1, AR1)”与“passes ref, DOM props, className, and style to the cell, which carries its target (FR1, FR4)”；`InputGroup.test.tsx` 的 addon 及 prefix/suffix 用例 | 前缀与后缀文本；一个 `ref`、一个 DOM prop、`className` 与 `style`                                                  | 出现 role、tab 停靠点、缺少 addon 文本，或 prop 无法到达单元格，均判定失败。                                                                                        | `audit:InputGroupText/anatomy`  |
| FR2                           | `InputGroupText.test.tsx` 的“keeps its content on one line, unshrunk and centered on the cross axis (FR2)”；`InputGroupTextAudit.a11y.chromium.spec.ts` 的绘制检查                                                                        | 前缀、后缀以及两者并存；小尺寸与大尺寸；窄视口；light、dark 与 Butter                                              | 发生换行、收缩、内容不居中，或内边距、文本颜色、字号、背景与 token 不符，均判定失败。证据缺口：没有检查断言正文字体族或行高。                                       | `audit:InputGroupText/layout`   |
| FR3                           | `InputGroupTextAudit.a11y.chromium.spec.ts` 的边框、拼接与角检查                                                                                                                                                                          | 文本输入周围的前缀与后缀；LTR 与 RTL                                                                               | 边框颜色或宽度与 token 不符、边框样式不是 `solid`、重叠量不等于一个边框宽度，或内侧角被圆角化，均判定失败。                                                         | `audit:InputGroupText/layout`   |
| FR4                           | `InputGroupText.test.tsx` 的“passes ref, DOM props, className, and style to the cell, which carries its target (FR1, FR4)”；`InputGroupTextAudit.a11y.chromium.spec.ts` 的类名检查                                                        | 每个单元格                                                                                                         | 缺少 `astryx-input-group-text` 的单元格判定失败。                                                                                                                   | `audit:InputGroupText/anatomy`  |
| ORD1                          | `InputGroupText.test.tsx` 的“applies caller xstyle after its own styles (ORD1)”；`mergeProps.test.ts` 的“treats a string third argument as an appended className”与“applies the fourth argument as an overriding style”                   | 覆盖单元格样式的调用方 `xstyle`、`className` 与 `style`                                                            | 单元格样式压过调用方 `xstyle`、调用方 `className` 替换单元格类名而非追加，或调用方 `style` 未能覆盖，均判定失败。                                                   | `audit:InputGroupText/anatomy`  |
| RTL relation                  | RTL 审计策展的 D2 目标（`apps/storybook/rtl-audit/targets.json`）针对 `InputGroup / With prefix`；`InputGroupTextAudit.a11y.chromium.spec.ts` 的 RTL 用例针对 `InputGroup / With prefix and suffix`                                       | 文本输入之前的一个文本前缀，以及一个文本输入周围的前缀与后缀；LTR 与 RTL                                           | 未位于其输入行内起始处的前缀在 D2 中判定失败。在审计中，单元格不遵循行方向，或重叠出现在错误一侧，均判定失败。                                                      | `audit:InputGroupText/i18n-rtl` |
| `design:bidirectionality` DR2 | `MixedDirectionText.a11y.chromium.spec.ts`                                                                                                                                                                                                | 在 RTL 与 LTR 下的 `https://`、`.com`、`+3`、`@alice`、`iPhone جديد` 与 `example.com موقع`（Mixed Direction 故事） | 在 RTL 下弱字符或中性字符发生重排的附加文本（`//:https`、`com.`、`3+`、`alice@`），或以拉丁词开头却按从左到右排布的从右到左文本，会在每个字符的渲染位置上判定失败。 | `audit:InputGroupText/i18n-rtl` |

## Decision log

无组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤，或 family/system 规则。它链接到这些内容的拥有者。
