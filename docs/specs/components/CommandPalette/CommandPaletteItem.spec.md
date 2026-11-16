---
schema_version: 3
template_version: 7
kind: component
id: component:CommandPaletteItem
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [behavior, accessibility, public-api, compatibility, theming]
verified_by:
  [
    packages/core/src/CommandPalette/CommandPaletteItem.test.tsx,
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/CommandPaletteItem.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-017, spec:AST-020]
---

# CommandPaletteItem component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                            |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个结果选项，具有由上下文支撑的身份、高亮、选中与关闭行为；显式的独立视觉状态与指针激活仍然可用。                                                              |
| 行为          | 使用方的 click 先运行；取消会停止选中；成功激活会在本地报告、更新上下文并关闭；禁用项不运行任何 click 回调。                                                    |
| 终端用户影响  | 禁用的命令无法激活，且键盘焦点、选中值与选项身份保持彼此区分并一致地暴露。                                                                                      |
| 构建者影响    | 无。                                                                                                                                                            |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。两个实现缺口列在“当前状态影响”下；两个所有者问题保持开放。                                                                        |
| 审查检查      | 拒绝禁用状态下的激活、丢弃独立 DOM 身份、把高亮当作选中的 ARIA、嵌套的交互式子元素，或第二个上下文滚动所有者。                                                  |
| 治理规则      | `architecture:public-component-api/INV5,INV7`；`architecture:interaction-modality`；`spec:AST-017/FR1,FR3,FR5`；`spec:AST-020/FR1,FR2`；WAI-ARIA 1.2 `option`。 |

本表是审查投影；以下正文具有权威性。

## Intent

CommandPaletteItem 将一个命令结果呈现为一个 option。CommandPalette 上下文提供复合状态与键盘所有权；该项自身拥有其 option 语义、视觉状态、指针激活、原生透传边界以及独立滚动行为。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：显式的项状态仍先于上下文状态，然后是现有的 false 默认值
- 迁移决策：无；OQ1 保留对独立键盘契约的任何变更。项的 `onSelect` 仅报告指针激活；键盘选中通过根节点的 `onValueChange` 报告。

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **独立的 option 没有键盘模型。** 在 CommandPalette 之外，该项暴露 `role=option` 与指针激活，但没有所属 listbox 的键盘模型，因此键盘用户无法到达或激活它；WAI-ARIA 1.2 的 option 属于拥有其键盘交互的复合组件（AR5、OQ1）。
- **选中绘制遮住键盘高亮。** 当一项同时被高亮与选中时，选中的背景会遮住高亮的背景，因此该项上的键盘位置不可见（AV2、OQ2）。

## Ownership boundary

**拥有**

- option 根节点、项值标记、选中与禁用的 ARIA 状态，以及 `command-palette-item` 主题目标。
- 高亮与选中视觉状态的优先级：显式 → CommandPalette 上下文 → false。
- 指针激活顺序、禁用抑制，以及上下文选中/关闭。
- 独立高亮项的滚动行为与内联预览的初始滚动抑制。

**不拥有 / 非目标**

- CommandPalette 的 listbox、查询字段的 active descendant、方向键导航、Enter 处理、搜索结果，或根节点的 `onValueChange` 回调。
- 分组、列表布局，或调用方提供的非交互项内容。
- 独立的复合 listbox 键盘模型；其方向仍由 OQ1 决定。
- 交互式子元素。按钮与链接是兄弟动作或独立命令，而不是 option 内部的内容。

## Public concepts

| 概念   | 封闭取值或状态                                      | 含义                                           | 可用性         | 默认值  | 所有者                         | 稳定性 | 无效值行为                             |
| ------ | --------------------------------------------------- | ---------------------------------------------- | -------------- | ------- | ------------------------------ | ------ | -------------------------------------- |
| 高亮   | explicit; context index; false                      | 活动的键盘结果，已被绘制但未被选中。           | 所有用法       | false   | `component:CommandPaletteItem` | 稳定   | 未知的上下文值会让每一项都保持未高亮。 |
| 选中   | explicit; context value; false                      | 通过 `aria-selected` 暴露的已选值。            | 所有用法       | false   | `component:CommandPaletteItem` | 稳定   | 重复的值会产生含糊的解析；值保持唯一。 |
| 可用性 | enabled; disabled                                   | 指针激活是否可用。                             | 所有用法       | enabled | `component:CommandPaletteItem` | 稳定   | 禁用会抑制使用方与组件的回调。         |
| 项身份 | context-generated id; standalone caller-provided id | 供 active-descendant 或调用方使用的 DOM 身份。 | 有上下文或独立 | absent  | 组件或调用方                   | 稳定   | 上下文身份仅对已注册的项优先生效。     |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                        | 依据                                                |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| FR1 | 原生 props 与 `ref` 到达 option 根节点。`option` 角色、选中状态与禁用状态会替换调用方提供的对应值：在 CommandPalette 内，因为复合语义由组件拥有并替换透传，正如 `component:CommandPaletteInput` AR3 所记录；在独立使用时，则依本记录自身的规则。CommandPalette 上下文拥有已注册项的 id 与值标记；独立时调用方的 id 仍然保留。 | 当前源码与测试；`architecture:public-component-api` |
| FR2 | 指针激活先运行使用方的 `onClick`，若被阻止则停止；否则调用项的 `onSelect`，然后执行上下文选中与关闭。禁用项不运行这些路径中的任何一条。                                                                                                                                                                                       | 当前源码与测试                                      |
| FR3 | 显式的 `isHighlighted` 与 `isSelected` 先于由上下文派生的值，然后是 false。高亮只绘制活动状态；仅由选中驱动 `aria-selected`。                                                                                                                                                                                                 | 当前源码、测试与文档                                |
| FR4 | 上下文拥有高亮项的滚动。在上下文之外，被高亮的项滚动到最近位置，但内联 Dialog 中初始即被高亮的项不滚动。                                                                                                                                                                                                                      | 当前源码与测试                                      |
| FR5 | 子元素提供 option 的标签与辅助呈现，且不含嵌套的交互式子元素。                                                                                                                                                                                                                                                                | option 语义与 `spec:AST-020/FR1,FR2`                |

### Allowed variation

- **AV1 — 内容。** 标签、图标、描述与快捷键提示可以变化，但须保持非交互。
- **AV2 — 视觉状态。** 高亮、选中与禁用状态可以独立出现或同时出现。当前选中的绘制在两者都为真时会遮住高亮的绘制；OQ2 保留了对可见状态的补救。
- **AV3 — 布局。** 使用方的 `xstyle`、class 与 style 可以调整单一根节点，而不替换其 option 语义。

### Representative states

| 状态         | 必需的不变式                                            | 允许的变化                   |
| ------------ | ------------------------------------------------------- | ---------------------------- |
| 启用（独立） | 调用方 id 与原生 props 保留；指针激活在本地报告。       | 内容与视觉状态。             |
| 禁用（独立） | `aria-disabled` 为 true，且不触发任何 click 回调。      | 内容。                       |
| 上下文高亮   | 上下文项 id 与 active descendant 匹配，且高亮不是选中。 | 项索引与内容。               |
| 上下文选中   | 匹配的值暴露 `aria-selected=true`。                     | 高亮可以相同也可以是另一项。 |
| 使用方取消   | 使用方的 click 运行；本地与上下文的选中/关闭不运行。    | 使用方副作用。               |
| 内联初始状态 | 初始的独立高亮不会滚动周围的预览。                      | 选中值与内容。               |

### Transformation and precedence order

- **ORD1 — 视觉状态。** 显式项 prop → CommandPalette 上下文 → false。
- **ORD2 — 指针激活。** 禁用守卫 → 使用方的 click → 阻止检查 → 项 `onSelect` → 上下文选中 → 上下文关闭。
- **ORD3 — 身份。** 已注册的上下文 id → 独立调用方 id → absent。

### Performance and resources

- **PR1 — 查找。** 上下文匹配仍受当前扁平结果列表约束，且不执行监听器、观察器或逐项注册表的工作。
- **PR2 — 滚动所有权。** 由一个所有者滚动高亮的上下文项；独立项在未高亮时不调度任何工作。

## Accessibility contract

- **AR1 — option 语义。** 根节点暴露 `role=option`（FR1）；其内容或调用方标签提供无障碍名称，且 `aria-selected` 报告的是已选值而非视觉高亮。
- **AR2 — 复合所有权。** 在 CommandPalette 内，查询字段保持焦点并指向上下文生成的项 id；CommandPalette 在其采用的 listbox/combobox 模型下拥有方向键导航与 Enter 选中。
- **AR3 — 禁用状态。** 禁用项暴露 `aria-disabled=true`，抑制每一个指针激活回调，并省略交互覆盖层。
- **AR4 — 内容。** 项的子元素不含嵌套的 button、link 或其他交互式子元素，因为当 `option` 角色使其后代成为呈现性内容时，这些语义会丢失；此点遵循 WAI-ARIA 1.2 与 `spec:AST-020/FR1,FR2`。
- **AR5 — 独立缺口。** 独立的 option 没有所属的复合键盘模型（当前状态影响；OQ1）。

## Design relationships

| 结构 | 设计要求                                                                                | 呈现权威           | 层级角色 | 组件契约         |
| ---- | --------------------------------------------------------------------------------------- | ------------------ | -------- | ---------------- |
| 项   | 在一个根节点上绘制启用、高亮、选中、禁用与按压状态。两者都适用时，选中遮住高亮（OQ2）。 | 当前源码与公共文档 | 显著     | FR1–FR4、AR1–AR3 |
| 内容 | 提供 option 名称与非交互的辅助呈现。                                                    | 产品调用点         | 辅助     | FR5、AR1、AR4    |

## Family and system relationships

- `component:CommandPalette` 拥有复合搜索、listbox、active-descendant、键盘与关闭编排；本组件将一个 option 绑定到它。
- `architecture:interaction-modality` 拥有共享的指针与键盘行为。
- `architecture:public-component-api` 拥有原生透传与已发布 API 的兼容性。
- `architecture:component-theming-surface` 拥有聚合的 Item 结构映射与稳定的 `command-palette-item` 目标。
- `spec:AST-017` 保留 OQ1，以防对已发布契约的静默变更。
- `spec:AST-020` 提供无障碍证据与已采用模式的边界。
- WAI-ARIA 1.2 的 option 语义使后代成为呈现性内容，因此交互式控件不属于此 option 根节点内部。

## Verification map

| 契约              | 验证                                                            | 代表状态                         | 变异或失败预期                                                                             | 审计章节                                 |
| ----------------- | --------------------------------------------------------------- | -------------------------------- | ------------------------------------------------------------------------------------------ | ---------------------------------------- |
| FR1、FR3、AR1–AR2 | `CommandPaletteItem.test.tsx`、`CommandPalette.test.tsx`        | 独立；上下文高亮/选中            | 丢失 id/ref/原生 prop、角色或状态可被覆盖，或把高亮当作选中，都会使针对性的 DOM 断言失败。 | `audit:CommandPaletteItem/a11y`          |
| FR2、AR3          | `CommandPaletteItem.test.tsx`                                   | 启用；禁用；使用方取消；有上下文 | 禁用状态下使用方仍激活、忽略取消、缺少本地报告、选中或关闭，都会使测试失败。               | `audit:CommandPaletteItem/behavior`      |
| FR4、PR2          | `CommandPaletteItem.test.tsx`、`CommandPalette.test.tsx`        | 独立；内联初始；高亮变化         | 丢失最近滚动、重复的上下文滚动，或初始内联滚动，都会使 Effect 断言失败。                   | `audit:CommandPaletteItem/behavior`      |
| 主题/RTL          | 针对性的 class 断言、`themingTargets.test.ts`、RTL 验证为不适用 | 所有视觉状态                     | 目标丢失会使清单/DOM 测试失败；任何新的方向性行为都需要非空的 RTL 维度。                   | `audit:CommandPaletteItem/theming`       |
| FR5、AR4          | 源码审查                                                        | 项的子元素                       | 缺口：若项的子元素包含嵌套的交互式子元素，没有检查会失败。                                 | `audit:CommandPaletteItem/accessibility` |
| AR5               | 源码审查                                                        | 独立的项                         | 缺口：不存在可供测试的独立键盘模型（OQ1）。                                                | `audit:CommandPaletteItem/accessibility` |
| PR1               | 源码审查                                                        | 在 CommandPalette 内             | 缺口：若上下文匹配新增监听器、观察器或逐项注册表工作，没有自动化检查会失败。               | `audit:CommandPaletteItem/behavior`      |

从源码读取，尚无针对性测试：

- FR5、AR4：子元素不携带交互式子元素。
- AR3：禁用项上省略的交互覆盖层。

## Decision log

未记录任何组件本地决策。

## Open questions

- **OQ1 — CommandPaletteItem 应当暴露怎样的独立键盘契约？**（`human-api`）当前的独立使用会暴露一个 option 与指针激活，但没有所属的 listbox 键盘模型。需决定是否由公共复合所有者提供该模型、项是否应获得不同的独立角色与交互契约，还是独立激活应进入迁移路径。
- **OQ2 — 当项同时被选中时，如何让键盘高亮保持可见？**（`human-design`）当前选中的背景绘制会跟随并遮住高亮的背景；任何外观上的补救都需要所有者指导。

## Content boundary

本文件不重复使用方示例、实现步骤、聚合的 CommandPalette 搜索/列表行为，或共享系统规则。
