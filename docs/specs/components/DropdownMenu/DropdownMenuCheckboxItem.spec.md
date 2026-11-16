---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuCheckboxItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenuSelectable.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuCheckboxItem component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 一行指针菜单行，用于切换一个独立的布尔值：`label`、`description`、`icon`、`endContent`、受控的 `value` 与 `onChange`、`isDisabled`、`hasCloseOnSelect`（默认 `false`）、根节点输入以及一个 ref。 |
| 行为          | 该行是一个 `menuitemcheckbox`，其 `aria-checked` 即其 `value`；启用状态下的激活会上报 `!value`，并保持菜单打开，除非被要求关闭；禁用行不响应任何操作。                                           |
| 终端用户影响  | 人们切换选项时不必每次变更都关闭菜单，屏幕阅读器用户每行听到一个复选框。                                                                                                                         |
| 构建者影响    | 构建者拥有该值；该行会把他们的点击与指针移动处理器同自身的激活和悬停焦点组合起来。                                                                                                               |
| 兼容性/就绪度 | 记录已发布行为；无 API 变更；禁用行新增 `tabindex="-1"`（FR3）。Enter 保持菜单打开一事列在“当前状态影响”下（OQ1）。                                                                              |
| 审查检查      | 拒绝被播报的嵌套复选框、默认关闭的行、丢失调用方处理器，或在禁用状态下激活。                                                                                                                     |
| 管辖规则      | `spec:AST-020` FR15；`architecture:public-component-api` INV5–INV8；`architecture:interaction-modality`。                                                                                        |

本表是审查投影；下方正文具有权威性。

## Intent

DropdownMenuCheckboxItem 在 DropdownMenu 的指针呈现中渲染一行复合模式的行，用于切换一个独立的布尔值。DropdownMenu 负责焦点移动、typeahead、键盘点击合成以及关闭生命周期。

## Compatibility and migration

- 保留已发布默认值：是（`hasCloseOnSelect=false`）。
- 兼容类别：记录已发布行为；无公共 prop 或导出变更；禁用行新增 `tabindex="-1"`（FR3）。
- 受控/非受控行为：受控；`value` 由调用方拥有。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 一个 `role="menuitemcheckbox"` 根节点，及其 `aria-checked`、label、description、icon、end content、禁用状态、ref、支持的宿主输入与样式输入。
- 激活：上报 `!value`、关闭策略，以及组合调用方的 click 与 pointer-move 处理器。
- 装饰性复选框标记以及该行的 `dropdown-menu-item` 目标。

**不拥有 / 非目标**

- 焦点进入、roving focus、typeahead 以及 Enter/Space 点击合成——由 `component:DropdownMenu` 拥有。
- 复选框外观——委托给 `component:Indicator`。
- 键盘如何到达禁用行——`component:DropdownMenu` FR17。

## Public concepts

| 概念     | 封闭值或状态    | 含义                           | 可用性     | 默认值   | 所有者 | 稳定性 | 无效值行为           |
| -------- | --------------- | ------------------------------ | ---------- | -------- | ------ | ------ | -------------------- |
| 选中状态 | `true`、`false` | 该行展示并切换的布尔值。       | 每一行     | 必需     | 调用方 | 稳定   | 由公共类型要求。     |
| 关闭策略 | 关闭；保持打开  | 启用状态下的切换是否关闭菜单。 | 每个启用行 | 保持打开 | 组件   | 稳定   | 省略时保持菜单打开。 |
| 可用性   | 启用；禁用      | 该行能否激活。                 | 每一行     | 启用     | 组件   | 稳定   | 禁用会阻止激活。     |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                 | 依据                                                                    |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| FR1 | 该行渲染一个带 `role="menuitemcheckbox"` 的元素，其 `aria-checked` 等于 `value`；复选框标记是装饰性的（`aria-hidden`），因此该行是唯一被播报的控件。                                                                                                                                                                                                                   | `spec:AST-020` FR15；当前源码与测试                                     |
| FR2 | 启用状态下的激活，无论是通过指针还是通过父级合成的 Enter/Space 点击，都会调用 `onChange(!value)`，然后在设置 `hasCloseOnSelect` 时关闭菜单，再调用调用方的 `onClick`；未设置 `hasCloseOnSelect` 时菜单保持打开。APG Menu 模式的 Enter 会关闭菜单，而 `spec:AST-020` FR15 要求本记录列出它未采纳的任何必需部分。实现缺口：Enter 默认保持菜单打开，且未列出例外（OQ1）。 | `spec:AST-020` FR15；`architecture:public-component-api` INV7；当前测试 |
| FR3 | 禁用行暴露 `aria-disabled="true"`，与启用行一样携带 `tabindex="-1"`，以便父级的键盘模型能到达它（`component:DropdownMenu` FR17），并且在任何激活时既不调用 `onChange`，也不调用调用方的激活处理器，也不关闭菜单。                                                                                                                                                      | 当前源码与测试                                                          |
| FR4 | ref、支持的宿主属性与处理器、`className`、`style` 与 `xstyle` 会到达行根节点或在行根节点上组合；调用方的 `onPointerMove` 会与该行的悬停焦点组合。                                                                                                                                                                                                                      | `architecture:public-component-api` INV5–INV8；当前测试                 |
| FR5 | 标记是共享的复选框 Indicator，在小型菜单中为 `sm`；该行携带带菜单尺寸的 `dropdown-menu-item` 目标。                                                                                                                                                                                                                                                                    | `architecture:component-theming-surface`；当前源码与测试                |
| FR6 | 该行不添加自己的按键处理器或 Tab 停靠点：每一行（包括禁用行）都为父级的 roving focus 保持 `tabindex="-1"`，父级的键盘可到达禁用行（`component:DropdownMenu` FR17）。                                                                                                                                                                                                   | `architecture:interaction-modality`；父级测试                           |

### Allowed variation

- **AV1 — 内容。** Label、description、icon 与 end content 属于调用方内容。
- **AV2 — 主题绘制。** 主题可以重新设置该行与标记目标的样式。

### Representative states

| 状态       | 必需不变式                            | 允许的变体     |
| ---------- | ------------------------------------- | -------------- |
| 未选中     | `aria-checked="false"`；标记为空。    | 内容。         |
| 已选中     | `aria-checked="true"`；标记为已选中。 | 内容。         |
| 选择后关闭 | 启用状态下的切换会关闭菜单。          | —              |
| 禁用       | `aria-disabled="true"`；不激活。      | 内容保持可见。 |

### Transformation and precedence order

- **ORD1 — 激活。** 禁用守卫 → `onChange(!value)` → 当 `hasCloseOnSelect` 时关闭 → 调用方 `onClick`。

### Performance and resources

- **PR1 — 共享按压监听器。** 该行共享按压控制器的 window 与 document 监听器；它不新增任何逐行监听器、观察器、定时器或请求。

## Accessibility contract

- **AR1 — 单一复选框控件。** 该行拥有 `menuitemcheckbox`、其可访问名称、选中状态、焦点与激活；标记是装饰性的。
- **AR2 — 禁用状态。** 禁用行不响应任何操作。
- **AR3 — 焦点可见性。** 键盘焦点在行内绘制共享焦点环，按其自身宽度内缩，在所有颜色模式下均如此，包括强制颜色模式；指针输入之后，该行只显示覆盖层着色（`architecture:interaction-modality` INV1、INV3）。共享的行处理见 `component:DropdownMenuItem` FR8。

## Design relationships

| 结构或状态 | 设计要求         | 表示权威              | 层级角色 | 组件契约 |
| ---------- | ---------------- | --------------------- | -------- | -------- |
| 行         | 一个全宽切换行。 | 当前源码              | 主要     | FR1, FR5 |
| 标记       | 显示选中状态。   | `component:Indicator` | 辅助     | FR1, FR5 |

共享的 `DropdownMenu.doc.mjs` 结构与 `component:DropdownMenu` 主题化结构映射了该行与复选框指示器，因此本记录不携带结构-主题映射。

## Family and system relationships

- `component:DropdownMenu` 拥有键盘模型与关闭生命周期。
- `component:Indicator` 拥有复选框外观。
- `architecture:public-component-api` 拥有根节点组合与处理器顺序。

## Verification map

| 契约      | 验证                                                                                                                                                                                                                                                                                                                                                                              | 代表状态                       | 变更或失败预期                                                                                                        | 审计章节                                       |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| FR1, AR1  | `DropdownMenuSelectable.test.tsx`“keeps the checkbox indicator decorative (row is the only announced control)”；“a ref reaches the menuitemcheckbox element”                                                                                                                                                                                                                      | 已选中与未选中                 | 被播报的标记，或不是 `menuitemcheckbox` 的行，判定失败。                                                              | `audit:DropdownMenuCheckboxItem/semantics`     |
| FR2, ORD1 | `DropdownMenuSelectable.test.tsx`“calls onChange with the toggled value on click”、“composes the caller click handler with the checked-state change”、“composes the caller click handler on keyboard activation”、“closes after a successful toggle only when requested”；`DropdownMenu.test.tsx`“activates a focused menuitemradio with Enter and a menuitemcheckbox with Space” | 指针与键盘；开启与关闭关闭策略 | 值错误、丢失调用方 `onClick`，或未经选择即关闭，判定失败。证据缺口：没有测试断言 `onChange`、关闭、`onClick` 的顺序。 | `audit:DropdownMenuCheckboxItem/behavior`      |
| FR3, AR2  | `DropdownMenuSelectable.test.tsx`“does not call consumer activation handlers when disabled”与“does not toggle when disabled”                                                                                                                                                                                                                                                      | 禁用                           | 禁用状态下发生切换、关闭或调用方处理器，判定失败。证据缺口：没有测试断言禁用行的 `tabindex="-1"`。                    | `audit:DropdownMenuCheckboxItem/behavior`      |
| FR4       | `DropdownMenuSelectable.test.tsx`“composes the caller pointer-move handler with menu hover focus”与“a ref reaches the menuitemcheckbox element”                                                                                                                                                                                                                                   | Ref；指针移动                  | 丢失 ref 或处理器，判定失败。证据缺口：没有测试断言该行上的宿主属性、`className`、`style` 或 `xstyle`。               | `audit:DropdownMenuCheckboxItem/api`           |
| FR5       | `DropdownMenuSelectable.test.tsx`“maps a small menu to the small shared checkbox marker”                                                                                                                                                                                                                                                                                          | 小型菜单                       | 忽略菜单尺寸的标记，判定失败。证据缺口：没有测试断言该行上的 `dropdown-menu-item` 目标。                              | `audit:DropdownMenuCheckboxItem/theming`       |
| FR6       | `DropdownMenu.test.tsx`“arrow navigation reaches consumer-rendered menuitemradio and menuitemcheckbox items”以及禁用行的键盘用例（`component:DropdownMenu` FR17）                                                                                                                                                                                                                 | 启用行与禁用行                 | 箭头跳过的行、被箭头略过的禁用行，或发生切换或关闭菜单的禁用行，判定失败。                                            | `audit:DropdownMenuCheckboxItem/accessibility` |
| AR3, PR1  | `DropdownMenuForcedColors.test.tsx`（该行的 `:focus-visible` 环与 token 内缩）；`DropdownMenuAudit.a11y.chromium.spec.ts` 强制颜色帧。证据缺口：没有测试断言监听器已绑定                                                                                                                                                                                                          | —                              | —                                                                                                                     | `audit:DropdownMenuCheckboxItem/behavior`      |

## Current-state impact

- **Enter 保持菜单打开（FR2）。** 在复选框行上按 Enter 会切换它，并默认保持菜单打开，这与 `spec:AST-020` FR15 所采纳的 Menu 模式的 Enter 相悖，且未列出例外（OQ1）。

## Decision log

无组件本地决策。

## Open questions

- **OQ1 — 复选框行在 Enter 时保持菜单打开，是作为 Menu 模式的具名例外，还是像其他行一样关闭？**（`human-api`）
  保持打开可让人在一次访问中切换多个选项；关闭则符合该模式的 Enter 以及其他行类型。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审计结果、实现步骤或父级契约。它链接到它们的拥有者。
