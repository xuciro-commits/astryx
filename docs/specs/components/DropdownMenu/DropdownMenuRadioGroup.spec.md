---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuRadioGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming, testing]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenuSelectable.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/DropdownMenu/__tests__/Menu.a11y.test.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuRadioGroup component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公开契约      | 一个受控的、具名的单选组，由 `DropdownMenuRadioItem` 子项组成，携带 value、变更回调、关闭策略、根输入以及一个 ref。                              |
| 行为          | 组提供选择与关闭策略上下文；单选条目发出值；父级 DropdownMenu 拥有键盘导航与菜单生命周期。                                                       |
| 最终用户影响  | 当某个 value 匹配时，辅助技术会遇到一个具名组，其中恰有一个当前选项，同时指针选择与键盘选择保持一致。                                            |
| 构建者影响    | 保持 value 受控，提供稳定的可访问标签，并只在组内放置 DropdownMenuRadioItem 选项。                                                               |
| 兼容性/就绪度 | 记录已发布的行为；没有 API、默认值或 DOM 变更。                                                                                                  |
| 审查检查      | 拒绝未命名的组、本地选择状态、丢失的根输入、第二个键盘所有者，或绕过受控回调的关闭策略。                                                         |
| 管辖规则      | `spec:AST-020`；`architecture:public-component-api/INV5–INV9`；`architecture:component-test-sufficiency/INV1–INV7`；`spec:AST-020/FR1,FR2,FR6`。 |

本表是审查用的投影；下面的正文才是权威依据。

## Intent

DropdownMenuRadioGroup 在 DropdownMenu 的指针呈现中渲染一个具名的 `role="group"` 包装层。它拥有受控选择上下文、关闭策略、根组合，以及子项之间基于令牌的间距。DropdownMenuRadioItem 拥有每个 `menuitemradio` 行及其选中状态；DropdownMenu 拥有焦点移动、typeahead、键盘激活、呈现，以及菜单打开/关闭生命周期。

## Compatibility and migration

- 已发布默认值保持不变：是（`hasCloseOnSelect=true`）。
- 兼容性类别：记录已发布的行为；没有公开 prop、默认值、导出或 DOM 变更。
- 受控行为：`value` 由调用方拥有，`onChange` 是唯一的提交路径。
- 迁移决策：无。

使用方迁移说明应放在使用方文档和发布说明中。

## Ownership boundary

**拥有**

- 一个 `role="group"` 根，其 `aria-label` 来自必填的 `label` prop。
- 面向单选条目的受控 `value`、`onChange` 与 `hasCloseOnSelect` 上下文。
- 组根上 `children`、受支持的宿主输入、ref、`className`、`style` 与 `xstyle` 的组合。
- 列布局以及语义化的菜单项间距。

**不拥有 / 非目标**

- `menuitemradio` 角色、`aria-checked`、禁用行为、指示器绘制、标签、描述、图标或尾部内容——由 DropdownMenuRadioItem 拥有。
- 焦点进入、方向键导航、typeahead、Enter/Space 合成以及菜单关闭实现——由 DropdownMenu 与共享的菜单 hooks 拥有。
- 触摸与底部面板（bottom sheet）可选中行的渲染——由父级呈现拥有。
- 非受控的选择状态或子项值注册。

## Public concepts

| 概念       | 封闭取值或状态                                | 含义                                         | 默认值 | 所有者           | 稳定性 | 无效值行为                                       |
| ---------- | --------------------------------------------- | -------------------------------------------- | ------ | ---------------- | ------ | ------------------------------------------------ |
| 选择       | 匹配的 value；无匹配的 value                  | 控制哪个子项报告为已选中。                   | 无     | 调用方与单选条目 | 稳定   | 无匹配时每个子项都保持未选中。                   |
| 提交       | 子项 value                                    | 通过 `onChange` 发出所选子项的值。           | 必填   | 组上下文         | 稳定   | 组外的子项会由条目所有者抛出异常。               |
| 关闭策略   | 关闭；保持打开                                | 控制条目在选择后是否请求 DropdownMenu 关闭。 | 关闭   | 组上下文与父级   | 稳定   | 省略即关闭。                                     |
| 可访问名称 | 必填 label；可选 labelledby                   | 为组命名；`aria-labelledby` 可指向可见文本。 | label  | 组根             | 稳定   | `label` 仍是公开类型要求的必填项。               |
| 根表面     | ref；DOM/data/ARIA；class/style/xstyle/events | 扩展组根，同时保留其角色与名称。             | 省略   | 公开组件 API     | 稳定   | 被接受的输入会组合；由组件拥有的角色与标签胜出。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                               | 依据                                                    |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- |
| FR1 | 根暴露 `role="group"` 和非空的可访问名称。必填的 `label` 提供 `aria-label`；调用方的 `aria-labelledby` 可以引用可见文本。            | `spec:AST-020`；当前源码与测试                          |
| FR2 | 组是受控的。它将每个单选条目的 value 与调用方 `value` 比较，并且只通过调用方 `onChange` 发出所选子项的值；组外的单选条目会抛出异常。 | 当前公开 API 与测试                                     |
| FR3 | `hasCloseOnSelect` 默认为 true。当它为 false 时，选择通过 `onChange` 更新，而父级菜单保持打开。                                      | 当前行为与测试                                          |
| FR4 | DropdownMenu 是唯一的键盘所有者。组不增加 tab 停靠点、按键处理器、typeahead 或点击合成；它只向子行提供上下文。                       | `architecture:interaction-modality`；父级测试           |
| FR5 | Ref、受支持的宿主属性与处理器、`className`、`style` 与 `xstyle` 会到达组根或在其上组合，而不替换组件拥有的角色或 `aria-label`。      | `architecture:public-component-api` INV5–INV9；当前测试 |
| FR6 | 包装层是一个逻辑列，其基于令牌的间距与周围菜单的项节奏一致；它不添加组件专属的方向性绘制或导航。                                     | 当前源码                                                |

### Allowed variation

- **AV1 — 子项。** DropdownMenuRadioItem 子项的数量、标签、描述、图标与辅助内容可以变化。
- **AV2 — 选择。** 任何字符串 value，包括无匹配的 value，都可以由调用方控制，而不增加本地组状态。
- **AV3 — 根样式。** 调用方的样式输入可以扩展包装层，同时角色、可访问标签、列流与子项语义保持完整。

### Representative states

| 状态           | 必需不变式                                     | 允许的变化                   |
| -------------- | ---------------------------------------------- | ---------------------------- |
| 匹配的 value   | 恰是匹配的那个子项报告 `aria-checked=true`。   | 子项内容与菜单尺寸。         |
| 无匹配的 value | 每个子项都报告 `aria-checked=false`。          | 空的或不匹配的调用方 value。 |
| 默认关闭       | 选择发出该值并通过父级关闭。                   | 指针操作或合成的键盘操作。   |
| 保持打开       | 选择发出该值、更新受控状态，并让菜单保持打开。 | 结果文案与所选子项。         |
| RTL / 窄屏     | 列顺序与基于令牌的间距保持，且没有水平溢出。   | 父级菜单的放置。             |

### Transformation and precedence order

- **ORD1 — 选择。** 子项激活 → 条目所有者中的禁用守卫 → 组 `onChange(value)` → 可选的父级关闭。
- **ORD2 — 根组合。** 基础列/间距 → 调用方 `xstyle`；受支持的宿主输入与 class/style 参与组合，而组件拥有的角色与标签保持固定。

### Performance and resources

- **PR1 — 仅上下文。** 组记忆化一个小型上下文值，不拥有任何 Effect、监听器、观察器、计时器、请求、DOM 读取或资源生命周期。

## Accessibility contract

- **AR1 — 具名组。** 包装层是父级菜单内的一个具名 `group`。
- **AR2 — 单选行。** 子项拥有 `menuitemradio` 与 `aria-checked`；组不添加嵌套的原生输入，也不重复行语义。
- **AR3 — 键盘所有权。** DropdownMenu 拥有焦点收集与激活；组自身从不进入 tab 或方向键序列。

## Design relationships

| 结构或状态 | 设计要求                                       | 呈现权威              | 层级角色 | 组件契约      |
| ---------- | ---------------------------------------------- | --------------------- | -------- | ------------- |
| 组包装层   | 带有菜单语义化项间距的逻辑列。                 | 当前源码与间距令牌    | 结构性   | FR1, FR5, FR6 |
| 所选子项   | 一个子项通过 `aria-checked` 反映调用方 value。 | DropdownMenuRadioItem | 突出     | FR2, AR2      |
| 方向/窄屏  | 子项顺序与间距在不假设物理方向的前提下保持。   | 双向性与父级布局      | 结构性   | FR6           |

没有记录组件本地的视觉决策。

## Family and system relationships

- `architecture:public-component-api` 拥有根输入组合与已发布兼容性。
- `architecture:component-test-sufficiency` 拥有相称的可观察证据。
- `architecture:interaction-modality` 与 DropdownMenu 拥有键盘行为。
- `spec:AST-020` 提供 WCAG/APG 的采用以及证据层边界。

## Verification map

| 契约          | 验证                                                                                                                                                                                                    | 代表性状态                          | 变更或失败预期                                                                                                 | 审计章节                                     |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| FR1, AR1      | `DropdownMenuSelectable.test.tsx` “names and composes the group root when no value matches”                                                                                                             | 标签与调用方 `aria-labelledby`      | 缺少组角色、`aria-label` 或调用方 `aria-labelledby` 会失败。                                                   | `audit:DropdownMenuRadioGroup/semantics`     |
| FR2           | `DropdownMenuSelectable.test.tsx` “calls onChange with the selected value”、“names and composes the group root when no value matches”（无条目选中）与“throws when a radio item is used outside a group” | 匹配的与无匹配的 value；组外的条目  | 选中行错误、选择跳过 `onChange`，或条目在组外仍能工作，都会失败。                                              | `audit:DropdownMenuRadioGroup/behavior`      |
| FR3           | `DropdownMenuSelectable.test.tsx` “keeps the menu open while controlled selection updates when requested”                                                                                               | `hasCloseOnSelect={false}`          | 尽管已选择退出仍关闭，会失败。证据缺口：此处没有测试断言选择之后的默认关闭。                                   | `audit:DropdownMenuRadioGroup/behavior`      |
| FR4, AR2, AR3 | `DropdownMenu.test.tsx` “arrow navigation reaches consumer-rendered menuitemradio and menuitemcheckbox items” 与 “activates a focused menuitemradio with Enter and a menuitemcheckbox with Space”       | 单选行上的方向键与 Enter            | 方向键跳过的单选行，或 Enter 无法激活的单选行，会失败。证据缺口：没有测试断言组不添加 tab 停靠点或按键处理器。 | `audit:DropdownMenuRadioGroup/accessibility` |
| FR5           | `DropdownMenuSelectable.test.tsx` “names and composes the group root when no value matches”                                                                                                             | ref、宿主属性、class、style、处理器 | 丢失 ref、属性、class、style 或处理器，或被替换的角色、标签，会失败。证据缺口：没有测试断言组上的 `xstyle`。   | `audit:DropdownMenuRadioGroup/api`           |
| FR6, PR1      | `apps/storybook/rtl-audit/verified-not-applicable.json` 的 DropdownMenuRadioGroup 条目。证据缺口：没有测试断言列间距或生命周期资源的缺失                                                                | LTR 与 RTL                          | 源码哈希发生变化会使该回执失败。                                                                               | `audit:DropdownMenuRadioGroup/layout`        |

## Decision log

没有组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计得分、截图矩阵、实现步骤，或父级/条目契约。它链接到这些内容的所有者。
