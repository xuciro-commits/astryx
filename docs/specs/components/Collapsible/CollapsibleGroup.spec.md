---
schema_version: 3
template_version: 7
kind: component
id: component:CollapsibleGroup
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, accessibility, theming]
verified_by:
  [
    packages/core/src/Collapsible/CollapsibleGroup.test.tsx,
    packages/core/src/Collapsible/Collapsible.test.tsx,
    packages/core/src/Collapsible/__tests__/Collapsible.a11y.test.tsx,
    packages/core/src/Collapsible/__tests__/Collapsible.a11y.chromium.spec.ts,
    packages/core/src/Collapsible/__tests__/CollapsibleGroup.a11y.chromium.spec.ts,
    packages/core/src/Collapsible/__tests__/CollapsibleGroup.a11y.test.tsx,
    packages/core/src/Collapsible/__tests__/CollapsibleGroupAccordion.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/CollapsibleGroup.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:react-component-runtime,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-029, spec:AST-085]
---

# CollapsibleGroup component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `CollapsibleGroup` 以 `single` 或 `multiple` 模式协调公共 `Collapsible` 子项，支持受控与非受控取值，并可选地提供分隔线、密度与 chevron 位置的呈现默认值。                                              |
| 行为          | 带 `value` 的直接子项读取组状态；展开某一项时按模式替换或扩展已展开值的集合。除非启用分隔线外观，组不渲染包装器。                                                                                      |
| 终端用户影响  | 用户可展开一节或若干节，而展开状态不会在同级行之间漂移；启用分隔线的组保持统一的视觉与方向处理。                                                                                                       |
| 构建者影响    | 构建者选择状态所有权与选择模式，为参与协调的项提供稳定取值，并可选择启用分隔行呈现。                                                                                                                   |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。三处实现差距列在 Current-state impact 一节。                                                                                                                             |
| 审查检查项    | 拒绝以下情况：丢失 single/multiple 协调、受控状态在内部被修改、非受控状态停止更新、呈现泄漏进嵌套展开项，或分隔线缺失时出现包装器。                                                                    |
| 约束规则      | `component:Collapsible/FR7–FR9,DEC-2`；`architecture:public-component-api/INV1,INV5–INV9`；`architecture:react-component-runtime/INV1,INV8–INV9`；`architecture:component-theming-surface/INV3–INV7`。 |

本表是审查视角的投影；下文的正文才是权威。

## Intent

协调一组展开项，使其展开状态由单一的组所有者管理，同时每个 `Collapsible` 继续拥有自己的触发器、区域与展开语义。

## Compatibility and migration

- 已发布的默认值保持不变：是
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不变
- 迁移决策：无

使用方的迁移说明属于使用方文档与发行说明。

## Current-state impact

- **禁用的标题会脱离 Tab 顺序。** 一个被禁用的直接子项，其标题带有 `aria-disabled`，却会脱离 Tab 顺序，因此键盘用户无法到达该标题以了解它为何不可用。`spec:AST-085` FR1 要求禁用的控件保持可聚焦；该标题由 `component:Collapsible` 拥有。
- **相等的取值可能重建协调上下文。** 一个取值相等的新受控数组，或一个诸如内联处理函数的新 `onChange`，都会在每次父级渲染时重建协调上下文，于是被记忆化的直接子项会重新渲染。`architecture:react-component-runtime` INV9 要求未变更的载荷不得广播新的标识（FR7）。
- **手风琴绑定把已采用的测试行作为建议性行运行。** 该绑定把标题到标题的 Tab 步进、single 模式的同级折叠以及无方向键移动都作为建议性行运行，因此那里的回归不会让该绑定通道失败。`spec:AST-020` FR9 规定，一旦本记录采用某项期望，该期望即为必需（AR4）。

## Ownership boundary

**拥有**

- single 与 multiple 模式下的同级展开值协调；
- 受控与非受控的组状态所有权，以及交付给 `onChange` 的形状；
- 可选的分隔行包装器、密度默认值与组呈现上下文；以及
- 直接子项在密度与 chevron 位置上的默认值。

**不拥有 / 非目标**

- 展开触发器、区域、chevron 图形、语义或嵌套呈现重置——由 `component:Collapsible` 拥有；
- 调用方内容、项标签，或调用方所提供取值的含义与唯一性——由产品调用点拥有；或
- 已发布的 single 与 multiple 模式之外的任意选择模型。

## Public concepts

| 概念           | 封闭取值或状态                              | 含义                                                          | 可用范围         | 默认值                            | 所有者                       | 稳定性 | 无效值行为      |
| -------------- | ------------------------------------------- | ------------------------------------------------------------- | ---------------- | --------------------------------- | ---------------------------- | ------ | --------------- |
| 协调模式       | `single`, `multiple`                        | 替换已展开集合，或在其内部切换某个成员。                      | 每个组。         | `single`                          | `component:CollapsibleGroup` | 稳定   | 被公开类型拒绝  |
| 状态所有权     | uncontrolled, controlled                    | 内部状态从 `defaultValue` 开始，或 `value` 保持由调用方拥有。 | 每个组。         | uncontrolled                      | `component:CollapsibleGroup` | 稳定   | 普通 React 语义 |
| 分隔呈现       | absent, present                             | 增加一个包装器，并要求直接子项绘制行分隔线。                  | 每个组。         | absent                            | `component:CollapsibleGroup` | 稳定   | 被公开类型拒绝  |
| 行密度         | unpadded, `compact`, `balanced`, `spacious` | 提供直接子项的块内边距；启用分隔线的组回退到 balanced。       | 组内的直接子项。 | unpadded；启用分隔线时为 balanced | `component:CollapsibleGroup` | 稳定   | 被公开类型拒绝  |
| chevron 默认值 | absent, `start`, `end`                      | 提供由 `component:Collapsible` 拥有的位置默认值。             | 组内的直接子项。 | absent；项解析为 `end`            | `component:Collapsible`      | 稳定   | 被公开类型拒绝  |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                             | 依据                                                                                              |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| FR1 | 在 `single` 模式下，切换一个处于关闭状态的直接子项，必须用该项替换已展开值的集合；切换处于展开状态的该项，必须清空该集合。                                                                                                                                                         | 已发布源码、使用方文档与聚焦交互测试                                                              |
| FR2 | 在 `multiple` 模式下，切换一个直接子项，必须只增加或移除该取值，同时保持其他取值的状态。                                                                                                                                                                                           | 已发布源码、使用方文档与聚焦交互测试                                                              |
| FR3 | 提供 `value` 时必须让状态由调用方拥有，并通过 `onChange` 报告请求的变更；省略它时，状态必须在从 `defaultValue` 初始化后保持为内部状态。                                                                                                                                            | `architecture:react-component-runtime/INV1,INV8`；已发布的受控与非受控测试                        |
| FR4 | 带 `value` 的直接 `Collapsible` 必须使用组协调；不带取值的项必须保留独立所有权。                                                                                                                                                                                                   | 已发布的 hook 行为与聚焦的组/独立测试                                                             |
| FR5 | 在 `hasDividers=false` 时，组必须不增加任何 DOM 包装器。启用分隔线时，它必须渲染一个包装器，该包装器接收文档化的根 props 与 `collapsible-group` 目标。                                                                                                                             | `architecture:public-component-api/INV5–INV8`；`architecture:component-theming-surface/INV3–INV7` |
| FR6 | 密度、分隔线与 chevron 的默认值必须到达直接子项，且不得经由某个直接子项已展开的内容泄漏进嵌套的独立展开项。                                                                                                                                                                        | `component:Collapsible/FR7–FR8,DEC-2`；聚焦的嵌套测试                                             |
| FR7 | 在分隔线、密度与 chevron 输入未变更时，呈现上下文的标识必须保持稳定；在受控字符串未变更、受控数组引用相同或内部状态未变更，且 `type` 与 `onChange` 相同时，协调标识在重渲染之间必须保持稳定。实现差距：取值相等的新受控数组或新的 `onChange` 会重建它（见 Current-state impact）。 | `architecture:react-component-runtime/INV9`；被记忆化的源码与交互测试                             |

### Allowed variation

- **AV1 — 内部状态表示。** 组可以用数组或其他私有结构表示已展开的取值，同时保持 FR1–FR4 与回调输出。
- **AV2 — 包装器实现。** 分隔线模式可以改变内部布局技术，同时保留一个绘制用包装器、公开目标、根 props 可达性与直接子项结果。
- **AV3 — 项组合。** 调用方可以把直接 Collapsible 项放在不参与协调的内容旁边；只有带取值的 Collapsible 子项加入协调。

### Representative states

| 状态               | 必需的不变式                                                       | 允许的变化         |
| ------------------ | ------------------------------------------------------------------ | ------------------ |
| single、非受控     | 一个带取值的项或没有项处于展开状态，且每次切换后内部状态都会更新。 | 项标签与内容。     |
| multiple、非受控   | 任意数量的带取值项都可以保持展开。                                 | 项顺序与内容。     |
| 受控               | 渲染状态跟随 `value`；`onChange` 报告请求的下一个状态。            | 父级更新的时机。   |
| divided、省略密度  | 一个包装器绘制组目标，直接子项使用 balanced 密度。                 | 主题绘制。         |
| plain、省略密度    | 不出现包装器，直接子项保持无内边距。                               | 周围的调用方布局。 |
| 带嵌套内容的组位置 | 直接子项继承组位置；嵌套展开项会重置它。                           | 项级别的显式覆盖。 |

### Transformation and precedence order

- **ORD1 — 状态所有权。** 存在受控 `value` 时优先 → 否则用 `defaultValue` 初始化内部取值 → 按模式切换 → 以该模式文档化的输出形状回调。
- **ORD2 — 密度。** 显式的组密度 → 启用分隔线时为 `balanced` → 无组密度。
- **ORD3 — chevron 位置。** 项的显式位置 → 直接组位置 → Collapsible 的默认值 `end`，由 `component:Collapsible/ORD1` 拥有。

### Performance and resources

- **PR1 — 协调由渲染承担。** 组从 props、状态与上下文推导输出，不拥有任何 Effect、监听器、观察者、定时器、请求、订阅或命令式浏览器资源。
- **PR2 — 稳定的广播。** 被记忆化的上下文取值让 FR7 所指的标识对直接使用方保持稳定。

## Accessibility contract

- **AR1 — 子项语义保持首要地位。** 组协调必须保留每个 Collapsible 按钮的无障碍名称、`aria-expanded`、`aria-controls`、受控区域与键盘激活。
- **AR2 — 呈现不增加竞争的交互。** 分隔线包装器不得增加角色、焦点目标、无障碍名称或键盘行为。
- **AR3 — 方向仍归 Collapsible。** 组的 chevron 默认值必须保持 `component:Collapsible/AR1–AR3`，包括在 LTR 与 RTL 下的向内前置提示。
- **AR4 — 组采用 APG Accordion 模式所要求的组成部分**（`spec:AST-020/FR15`）：每个直接子项的标题都是一个 `button`，其无障碍名称为该项的标题，`aria-expanded` 反映其面板，`aria-controls` 指明它所展示的面板，且当它无法被切换时带 `aria-disabled`；每个启用的标题都位于页面的 Tab 顺序中，Enter 或 Space 切换其面板，在 `single` 模式下折叠此前处于展开状态的同级项；禁用的标题带 `aria-disabled` 且不可切换，Tab 顺序的缺口除外（见 Current-state impact）。未采用：围绕每个标题的 heading 元素（本记录不作要求；调用方的文档结构提供 heading）、面板上可选的 `region` 角色，以及标题之间的方向键或 Home/End 移动——组是一组独立的展开项，而不是一个复合控件。

## Design relationships

| 解剖结构或状态 | 设计要求                                             | 表述权威                        | 层级角色 | 组件契约     |
| -------------- | ---------------------------------------------------- | ------------------------------- | -------- | ------------ |
| 组容器         | 可选的分隔线外观把同级展开项在视觉上关联为一个集合。 | 已发布实现中观察到的表述        | 聚合容器 | FR5–FR6, AR2 |
| 直接子项       | 密度与 chevron 默认值在同级行之间保持一致。          | `component:Collapsible/FR7–FR8` | 展开行   | FR6, AR3     |

当前没有设计记录规定 CollapsibleGroup 的确切像素。本记录覆盖已发布的分隔与不带分隔这两种关系，但不决定新的视觉方向。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "collapsible"},
  "Trigger": {"target": "collapsible-trigger"},
  "Chevron": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Content": {"target": "collapsible-content"},
  "Group container": {"target": "collapsible-group"}
}
```

Group container 是 CollapsibleGroup 的条件性聚合包装器。其余解剖结构行仍由 `component:Collapsible` 拥有；它们之所以出现在这张子组件映射中，是因为已发布的使用方解剖结构与目标清单是共享的。触发器、内容、chevron、展开状态、禁用状态、密度内边距与逐项分隔线都仍归 Collapsible 的契约。

## Family and system relationships

- `component:Collapsible` 拥有直接子项的展开语义、chevron 表述、项级别的主题解剖结构，以及嵌套呈现重置。
- `architecture:public-component-api` 拥有导出可达性、文档化的根 props 行为、受控 API 稳定性、样式组合，以及条件性的 ref 可达性。
- `architecture:react-component-runtime` 拥有由渲染推导的状态、稳定的上下文广播标识，以及受控状态的所有权边界。
- `architecture:component-theming-surface` 拥有目标资格、目标放置、视觉轴反映与委托的项所有权。
- `architecture:component-test-sufficiency` 拥有跨状态协调、浏览器无障碍、方向与渲染呈现的合理证据集。

## Verification map

| 契约               | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 代表性状态                                                                       | 突变或失败预期                                                                                                    | 审查小节                               |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1–FR4, ORD1      | `CollapsibleGroup.test.tsx`；`useCollapsible.test.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                           | single/multiple；受控/非受控；带取值/不带取值                                    | 同级项在 single 模式下仍保持展开、在 multiple 模式下却被关闭、受控状态在内部被修改，或不带取值的项丢失本地状态。  | `audit:CollapsibleGroup/behavior`      |
| FR5–FR6, ORD2–ORD3 | `CollapsibleGroup.test.tsx`；`Collapsible.test.tsx`；`themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                    | plain/divided；每种密度；组/项/嵌套位置                                          | 包装器或目标的可达性改变、默认值不再到达直接子项，或呈现泄漏进嵌套内容。                                          | `audit:CollapsibleGroup/theming`       |
| AR4                | `Collapsible.test.tsx`（禁用的触发器：`aria-disabled` 且不可切换；其脱离 Tab 顺序的断言固定了这一差距，等待符合性修复）；`CollapsibleGroup.test.tsx`（single/multiple 协调、`aria-expanded`、Enter 激活）；`Collapsible.a11y.test.tsx` 与 `Collapsible.a11y.chromium.spec.ts`（展开语义、Space、单独项的 Tab 可达性）；`CollapsibleGroup.a11y.test.tsx` 与 `CollapsibleGroupAccordion.a11y.chromium.spec.ts`（组内标题上的 Space；标题到标题的 Tab 步进、single 模式的同级折叠与无方向键移动都作为建议性行运行） | single/multiple；展开/关闭；一个禁用的项，展开或关闭；Tab 顺序；Enter/Space 往返 | 标题丢失 button 角色、名称、`aria-expanded` 或 `aria-controls`；Enter 或 Space 不再切换；方向键在标题之间移动焦点 | `audit:CollapsibleGroup/accessibility` |
| AR1–AR3            | DOM 与 Chromium 无障碍测试套件；组件自有的 Storybook 测试夹具；RTL 审查                                                                                                                                                                                                                                                                                                                                                                                                                                          | 展开/关闭；single/multiple；前置/后置；LTR/RTL                                   | 展开语义与状态背离、包装器变为可交互，或前置方向不再镜像。                                                        | `audit:CollapsibleGroup/accessibility` |
| PR1–PR2, FR7       | 源码审查，加上上下文与交互测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 未变更与已变更的状态/呈现输入                                                    | 出现 Effect/资源、未变更的载荷广播了新的标识，或变更后的组行为未能到达使用方。                                    | `audit:CollapsibleGroup/code-health`   |
| 使用方文档         | CLI 组件投影、文档检查与 `CollapsibleGroup.stories.tsx`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 每个公共概念与代表性的组合                                                       | 已发布的 prop/默认值无法被发现，或自有的浏览器路由失去代表性状态覆盖。                                            | `audit:CollapsibleGroup/docs`          |

从源码读取、但尚无聚焦测试的部分：

- AR4：标题之间没有 Home/End 移动。
- FR7：在分隔线、密度与 chevron 输入未变更时呈现上下文标识保持稳定，以及协调标识在相同数组引用、未变更内部状态与一个相等的新数组下保持稳定；只有受控字符串的情形有测试。
- PR1：组不拥有任何 Effect 或浏览器资源。

## Decision log

### DEC-1 — Adopt Accordion's required parts; keep the headers independent

**Reference:** `component:CollapsibleGroup/DEC-1`

**Decider:** `cixzhang`, `2026-10-13`

组的标题已经在扮演手风琴标题的角色，因此它们携带其名称、状态、关系与 Enter/Space 激活（AR4）。它们留在页面的 Tab 顺序中，但没有方向键或 Home/End 移动，因为组协调的是彼此独立的展开项，而不是充当一个复合控件；标题包裹元素留给调用方的文档结构来决定。

已否决：标题之间的方向键移动；围绕每个标题强制要求的 heading 元素。

## Open questions

无。本记录不扩展已发布的协调模式，也不决定新的呈现方式。

## Content boundary

本文件不重复使用方的 prop 表、示例、当前的审查评分、实现步骤，或 Collapsible 的展开与 chevron 规则。它链接到各自的所有者。
