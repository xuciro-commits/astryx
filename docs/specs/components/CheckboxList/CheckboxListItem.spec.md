---
schema_version: 3
template_version: 7
kind: component
id: component:CheckboxListItem
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
    packages/core/src/CheckboxList/__tests__/CheckboxListPress.a11y.chromium.spec.ts,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.test.tsx,
    packages/core/src/CheckboxInput/__tests__/Checkbox.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
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

# CheckboxListItem component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                     |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一行选项：一个原生复选框，由 `label` 或 `aria-label` 命名，由 `description` 描述，带有可选的 `endContent` 和 `align`，通过 ListItem 渲染。在带 `value` 数组的 CheckboxList 内（集合模式），勾选状态来自成员关系，且 `value` 为必需。在 List 内，或在没有 `value` 的 CheckboxList 内（独立模式），该项读取 `isChecked` 并调用 `onCheck`。 |
| 行为          | 复选框是该选项唯一的 Tab 停靠点。当该项可编辑且位于 CheckboxList 中或具有 `onCheck`，或当它具有 `onClick` 时，行表面上的点击会委托给它；项的 `onClick` 在每次直接点击、键盘点击或行表面点击时触发一次。禁用、只读和忙碌状态拒绝切换。                                                                                                    |
| 最终用户影响  | 人们可以通过指针、触摸和键盘操作每个选项，听到其名称、描述以及已勾选、混合、禁用、只读或忙碌状态，并在保存时看到 Spinner。                                                                                                                                                                                                               |
| 构建者影响    | 该项所处的位置，以及其父列表是否具有 `value`，决定模式；`value` 仅在集合模式下必需。无处理程序时的含义、已勾选行的指针反馈、使用方 DOM prop 落点、只读点击传播以及焦点环归属仍是未决问题（OQ1、OQ3–OQ6）。                                                                                                                               |
| 兼容性/就绪度 | 已勾选、已启用、可编辑的行会反映 `selected`（FR15）；没有 API 或默认值变更。无处理程序项和双重焦点指示器列在 Current-state impact 下。                                                                                                                                                                                                   |
| 审查检查      | 拒绝第二个 Tab 停靠点、在禁用、只读或忙碌时发生的切换、`isChecked` 覆盖父级 `value` 数组、每次点击触发多次的 `onClick`、被丢弃的描述关系，或未经所有者决策引入的新落点、状态或事件路由 API。                                                                                                                                             |
| 治理规则      | `architecture:public-component-api/INV5–INV9`；`architecture:component-theming-surface/INV3–INV6`；`architecture:interaction-modality/INV1–INV5`；`architecture:component-test-sufficiency/INV1–INV7`；`spec:AST-021/FR8–FR10`；`spec:AST-085/FR1, FR7`；`spec:AST-011`；`spec:AST-038/FR7`；WCAG 2.2 1.3.1, 2.1.1, 4.1.2。              |

本表是供审查用的投影；下面的正文才是权威。

## Intent

在 CheckboxList 或普通 List 内，把一个独立选择呈现为整行宽的一行，使其复选框、标签、描述和结束内容与其已勾选、可用、只读和忙碌状态保持一致。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：仅受控 —— 集合模式下由父列表的 `value` 控制，独立模式下由 `isChecked` 控制
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 一行选项：其 CheckboxInput、命名（字符串 label、通过 `aria-labelledby` 的富文本 label、`aria-label` 覆盖）、描述关系、结束内容槽，以及随列表密度变化的复选框尺寸。
- 模式解析：集合成员关系与独立 `isChecked` 和 `onCheck` 的区分、集合模式缺少 `value` 时的错误，以及该行提议的下一个值。
- 行表面点击委托、单一 Tab 停靠点规则，以及项 `onClick` 的路由。
- 项的禁用与加载状态、待处理集合项的忙碌渲染、只读渲染，以及已勾选行的填充。

**不拥有 / 非目标**

- 分组及其标签、描述、状态、禁用原因、只读与禁用输入、待处理值集合，以及集合变更顺序 —— 由 `component:CheckboxList` 拥有。
- 行呈现、密度、分隔线、悬停与按下覆盖层、focus-within 环、`list-item` 落点，以及标签和描述的截断 —— 由 `component:List` 和 Item 拥有。
- 复选框控件、其指示器、焦点环、按下覆盖层，以及忙碌、禁用和只读语义 —— 由 `component:CheckboxInput` 和 CheckboxIndicator 拥有。
- 加载指示器的呈现 —— 由 `component:Spinner` 拥有；委托机制 —— 由共享的可点击容器 hook 拥有。
- 新的落点、反映的状态或事件路由 API。

## Public concepts

| 概念          | 封闭值或状态                                                                           | 含义                                                                                                   | 按变体/方向/状态的可用性                                     | 默认值       | 所有者       | 稳定性                         | 无效值行为                         |
| ------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------ | ------------ | ------------------------------ | ---------------------------------- |
| naming        | 字符串 `label`；节点 `label`；`aria-label`                                             | 为复选框命名；节点 label 用其可见文本为其命名；`aria-label` 替换复选框上派生的名称，而不是行上的名称。 | 所有状态。                                                   | label 为必需 | 调用方与组件 | 稳定                           | 由公共类型拒绝                     |
| mode          | 集合模式（父级有 `value`）；无 `value` 的 CheckboxList 中的独立模式；List 中的独立模式 | 集合模式读取成员关系并通过父级上报；独立模式读取 `isChecked` 并调用 `onCheck`。                        | 由放置位置选择；集合模式下 `isChecked` 和 `onCheck` 被忽略。 | 独立模式     | 组件         | 稳定                           | 集合项缺少 `value` 时抛出错误      |
| checked state | 未勾选、已勾选、混合（仅独立模式）                                                     | 原生复选框状态；混合使用原生 `indeterminate` 属性并提议 `true`。                                       | 所有模式。                                                   | 未勾选       | 调用方       | 稳定                           | 由公共类型拒绝                     |
| change path   | 父级 `onChange`/`changeAction`（集合）；`onCheck`（独立）；无                          | 提议下一个值数组或布尔值。                                                                             | 已启用、可编辑、非忙碌的项。                                 | 无           | 调用方与组件 | 已发布；无处理程序时的含义未定 | 无处理程序意味着没有组件拥有的变更 |
| availability  | 启用；项 `isDisabled`；分组禁用；带原因的分组禁用                                      | 阻止切换和已勾选行的填充；复选框通过 `aria-disabled` 保持可聚焦。                                      | 项与分组。                                                   | 启用         | 组件         | 稳定                           | 仅布尔值                           |
| read-only     | 来自分组的 `isReadOnly`                                                                | 保持值可见、可聚焦且完全不透明，同时拒绝切换。                                                         | 仅在 CheckboxList 内。                                       | false        | 组件         | 稳定                           | 仅布尔值                           |
| busy          | `isLoading`；项 `value` 对应的父级待处理 `changeAction`                                | 复选框内显示 Spinner，行和复选框标记为忙碌，拒绝切换。                                                 | 逐项。                                                       | 空闲         | 组件         | 稳定                           | 仅布尔值/过渡状态                  |
| content       | `description`、`endContent`                                                            | 描述用于描述复选框；结束内容归调用方所有，且位于名称之外。                                             | 所有状态。                                                   | 无           | 调用方       | 稳定                           | 仅限类型化的值                     |
| `onClick`     | 在复选框上触发，适用于直接点击、键盘点击和行表面点击                                   | 每次点击一次，包括只读项；公共类型指明的是行元素。                                                     | 所有状态。                                                   | 无           | 调用方与组件 | 已发布；落点未定               | ——                                 |
| pass-through  | `ref`、`className`、`style`、`xstyle`、data、除 `aria-label` 外的 ARIA、其他事件       | 到达行 `<li>`；使用方的 `xstyle` 在已勾选行填充之后组合。                                              | 所有状态。                                                   | 无           | 组件         | 已发布；ARIA 落点未定          | 组件拥有的属性胜出                 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                               | 依据                                                                                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| FR1  | 该行必须渲染一个原生 CheckboxInput 作为 ListItem 的起始内容；该复选框必须是该选项唯一可聚焦的控件，且行本身不得可聚焦。                                                                                                                                              | 已发布源码；聚焦测试；WCAG 2.1.1 和 4.1.2                                            |
| FR2  | 字符串 `label` 必须为复选框命名；节点 `label` 必须通过 `aria-labelledby` 从可见的 label 元素为其命名；`aria-label` 必须替换复选框上派生的名称，且绝不落到行上。                                                                                                      | 已发布源码与聚焦测试                                                                 |
| FR3  | 可渲染的 `description` 必须通过 `aria-describedby` 描述复选框；缺失或为空的描述不得添加任何描述。                                                                                                                                                                    | 已发布源码与聚焦测试；WCAG 1.3.1                                                     |
| FR4  | 在带 `value` 数组的 CheckboxList 内，该项必须从成员关系读取勾选状态，在没有 `value` 时抛出错误，并通过父级的变更路径提议添加或移除其 `value` 后的数组；`isChecked` 和 `onCheck` 必须被忽略。                                                                         | 已发布源码与聚焦测试                                                                 |
| FR5  | 在 List 内，或在没有 `value` 的 CheckboxList 内，该项必须读取 `isChecked` 并以下一个布尔值调用 `onCheck`；混合项必须提议 `true`，且 `value` 可以省略。当保留混合值时，`component:CheckboxInput` FR1 记录的混合状态缺口即适用。                                       | 已发布源码与聚焦测试                                                                 |
| FR6  | 项的 `isDisabled` 或禁用的分组必须通过 `aria-disabled` 使复选框成为可聚焦的禁用状态（`component:CheckboxInput` FR4），拒绝切换，并省略已勾选行的填充；分组原因会添加分组工具提示（`component:CheckboxList` FR9）。                                                   | 已发布源码、聚焦测试以及共享复选框绑定                                               |
| FR7  | 项的 `isLoading`，或项 `value` 对应的父级待处理 `changeAction`，必须在复选框内渲染 Spinner，将行和复选框标记为忙碌，并拒绝切换。                                                                                                                                     | 已发布源码、聚焦测试以及 Chromium 无障碍测试套件                                     |
| FR8  | 只读分组必须使复选框只读、可聚焦且完全不透明，拒绝一切切换，并省略已勾选行的填充；仅当项具有 `onClick` 时，行才委托点击。                                                                                                                                            | 已发布源码、聚焦测试以及共享复选框绑定；`spec:AST-011`                               |
| FR9  | 对于 CheckboxList 内或带 `onCheck` 的已启用、可编辑项，交互式后代之外的行表面点击必须委托给复选框；标签、描述或结束内容中的链接和按钮必须保留其自身行为。                                                                                                            | 已发布源码与聚焦测试                                                                 |
| FR10 | 项的 `onClick` 必须对每次直接点击、键盘点击或行表面点击触发一次，包括只读项上的点击。                                                                                                                                                                                | 已发布源码与聚焦测试；`architecture:public-component-api/INV5`                       |
| FR11 | `compact` 密度必须渲染 `sm` 复选框；其他密度必须渲染 `md`。                                                                                                                                                                                                          | 已发布源码与聚焦测试                                                                 |
| FR12 | 已启用、可编辑的已勾选行必须绘制 `--color-accent-muted` 填充，且使用方的 `xstyle` 必须在其之后组合。                                                                                                                                                                 | 已发布源码与 Chromium 无障碍测试套件                                                 |
| FR13 | `ref`、`className`、`style`、`xstyle`、`align`、data 属性、除 `aria-label` 外的 ARIA，以及除 `onClick` 外的事件必须到达行 `<li>`。                                                                                                                                   | 已发布源码与聚焦测试                                                                 |
| FR14 | 带 `isChecked` 且无 `onCheck` 的独立项在激活时不改变任何内容。实现缺口：它未声明只读状态，因此复选框被暴露为可编辑（WCAG 2.2 4.1.2）；在没有 `value` 的 CheckboxList 内，其行还会委托点击并显示指针反馈。其含义见 OQ1。                                              | `spec:AST-021` 记录的确切已知失败 `list-item-handlerless-read-only`；WCAG 4.1.2      |
| FR15 | 已勾选、已启用、可编辑的行会绘制已勾选行填充，并在行的 `item` 和 `list-item` 落点上反映 `selected` 状态，使主题可以重新设置已勾选行以及该填充上的文本（`architecture:component-theming-surface` INV6）。只读或禁用的行不绘制填充、不反映状态；其落点与未勾选行一致。 | `architecture:component-theming-surface/INV6`                                        |
| FR16 | 已发布行为，在其未决问题被裁定之前不算需求：使用方的 DOM 输入分散在两个元素上：data 属性和 ARIA 到达行，而 `onClick` 在复选框上运行且类型签名面向行，因此 `event.currentTarget` 是复选框，不携带行的 data 属性（OQ3）。                                              | `architecture:public-component-api/INV5`；`INV9` 适用于任何类型变更或位置变更        |
| FR17 | 已发布行为，在其未决问题被裁定之前不算需求：在带 `onClick` 的只读项上，该项会阻止点击传播，因此 React 祖先永远收不到这些点击，而已启用项的祖先可以收到（OQ4）。项自身的 `onClick` 仍会每次点击触发一次（FR10）。                                                     | 当前源码；共享可点击容器 hook 行为                                                   |
| FR18 | 已发布行为，在其未决问题被裁定之前不算需求：在已启用、可编辑的已勾选行上，已勾选行填充会替换行的悬停与按下覆盖层，因此指针悬停和按住不会给出行反馈（OQ5）。                                                                                                          | Chromium 无障碍测试套件；`design:user-states` 将悬停与选择处理留在其当前声明范围之外 |
| FR19 | 一次键盘焦点移动会绘制两个指示器：Item 的行 focus-within 轮廓和 CheckboxInput 的指示器环（OQ6）。一次焦点移动必须只有一个归属指示器（`architecture:interaction-modality` INV3）。实现缺口：两个指示器都会绘制。                                                      | Chromium 无障碍测试套件；`architecture:interaction-modality/INV3`                    |

### Allowed variation

- **AV1 — 内容。** 标签、描述和结束内容可在其公共类型范围内变化，而不会成为新的落点。
- **AV2 — 组合呈现。** 密度、分隔线、行覆盖层、焦点环和复选框指示器仍是其拥有组件的能力。
- **AV3 — 主题绘制。** 语义 token 和组合后的落点可以改变已接纳的视觉属性，而不改变语义、Tab 顺序或状态优先级。

### Representative states

| 状态                    | 必需不变式                                                   | 允许的变化                    |
| ----------------------- | ------------------------------------------------------------ | ----------------------------- |
| 集合选项                | 由成员关系决定勾选；一个 Tab 停靠点；通过父级切换            | 标签、描述、结束内容          |
| 独立选项（List 或分组） | 读取 `isChecked`，调用 `onCheck`；混合状态提议 `true`        | 放置位置                      |
| 忙碌选项                | Spinner，行与复选框忙碌，拒绝切换                            | 加载来源（prop 或待处理保存） |
| 只读选项                | 可见、可聚焦、完全不透明、不可变；`onClick` 每次点击触发一次 | 项是否具有 `onClick`          |
| 禁用选项                | 不可操作；无已勾选行填充                                     | 项或分组来源；分组原因        |
| 无处理程序的独立选项    | 惰性；不声明只读状态（FR14、OQ1）                            | ——                            |

### Transformation and precedence order

- **ORD1 — 勾选状态。** 父级 `value` 数组（集合）→ 乐观待处理值 → 成员关系；否则 `isChecked`；再否则未勾选。
- **ORD2 — 切换。** 禁用、只读或忙碌守卫 → 模式 → 父级 `onChange`（集合）或 `onCheck`（独立）。
- **ORD3 — 点击路由。** 交互式后代保留其点击 → 当项可编辑且位于 CheckboxList 中或具有 `onCheck`，或具有 `onClick` 时，其他行表面点击委托给复选框 → 复选框的点击运行一次 `onClick`。
- **ORD4 — 属性。** 使用方的其余 props → 行 `<li>`；`aria-label` 和 `onClick` → 复选框；组件拥有的名称、描述、状态和忙碌属性胜出。

### Performance and resources

- **PR1 — 有界资源。** 该项不拥有任何观察器、定时器或全局监听器；委托监听器属于行及其生命周期。

当前的测量数据属于审计记录；本小节只拥有持久约束及其验证目标。

## Accessibility contract

- **AR1 — 选项语义。** 每个选项必须保持为原生复选框，其名称、描述、已勾选或混合状态，以及禁用、只读和忙碌状态都可被程序化确定。
- **AR2 — 键盘对等。** Tab 必须恰好一次到达复选框，Space 必须遵循与指针激活相同的可用性和变更规则。
- **AR3 — 放大目标。** 行表面必须充当复选框的指针和触摸目标，而不成为第二个控件。手指、鼠标或笔在可点击委托行的复选框盒子上按住时，会按下并绘制整行，正如在行上按下一样（触摸：所有者于 2026-11-04 通过；鼠标和笔：所有者于 2026-11-10 决策）。
- **AR4 — 忙碌感知。** 忙碌选项必须在无障碍树中暴露忙碌状态，并通过 Spinner 可见地展示。
- **AR5 — 焦点可见性。** 复选框上的键盘焦点必须保持可见；如今会绘制两个指示器（FR19、OQ6）。

## Design relationships

| 解剖结构或状态 | 设计要求                                               | 表示权威                                                      | 层级角色 | 组件契约           |
| -------------- | ------------------------------------------------------ | ------------------------------------------------------------- | -------- | ------------------ |
| 选项行         | 整行宽的行，包含起始复选框、标签和描述，以及结束内容。 | List 与 Item                                                  | 辅助     | FR1、FR9、FR13     |
| 复选框         | 呈现选项的选择指示器。                                 | CheckboxInput 所有者，以及 `design:user-states`（用于其按下） | 显著     | FR1、FR6–FR8、FR11 |
| 标签、描述     | 为复选框命名并描述。                                   | Item                                                          | 主要内容 | FR2、FR3           |
| 已勾选行填充   | 在已启用、可编辑的已勾选行上补充复选框状态。           | 行 `selected` 状态（FR15）；FR18 未决                         | 辅助     | FR12               |
| Spinner        | 在选项忙碌时替换标记。                                 | Spinner                                                       | 辅助     | FR7                |

本记录不携带解剖结构-主题映射。组合后的选项解剖结构及其落点处置记录在 `component:CheckboxList` 的主题解剖结构中，CheckboxListItem 不拥有自己的任何落点。

## Family and system relationships

- `component:CheckboxList` 组合了本契约：它提供该选项通过上下文读取的集合值、可用性、只读和待处理值，并拥有其周围的分组。
- `architecture:public-component-api` 拥有透传保留、事件组合、refs 以及已发布变更规则。
- `architecture:component-theming-surface` 拥有落点放置和状态反映。
- `architecture:interaction-modality` 拥有焦点可见性和单指示器规则。
- `spec:AST-021` 拥有 CheckboxListItem 可复用的复选框无障碍绑定及其确切的已知失败生命周期。
- `spec:AST-011` 记录 `isReadOnly` 作为可见、可聚焦、不可编辑值的名称。
- `spec:AST-038/FR7` 将 CheckboxList 上下文止于层边界；层内的项需要自己的 provider。
- List、Item、CheckboxInput、CheckboxIndicator 和 Spinner 在此组合时保留其既有的落点和行为契约。

## Verification map

| 契约               | 验证                                                                                                                                                          | 代表性状态                                                     | 变更或失败预期                                                                                       | 审计小节                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1、FR9、AR2、AR3 | `CheckboxList.test.tsx` 的单一 Tab 停靠点、行点击、标签中的链接以及交互式结束内容用例                                                                         | 集合选项；行表面点击；富文本标签中的链接；交互式结束内容       | 出现第二个 Tab 停靠点、委托丢失，或从交互式后代触发切换，则失败。                                    | `audit:CheckboxListItem/interaction`   |
| AR3（所有指针）    | `CheckboxList.test.tsx` 的按下表面用例；`CheckboxListPress.a11y.chromium.spec.ts`                                                                             | 粗指针与细指针；标签、描述和盒子；嵌套复选框                   | 在盒子上按下却只绘制盒子，或嵌套复选框按下整行，则失败。                                             | `audit:CheckboxListItem/interaction`   |
| FR2、FR3、AR1      | `CheckboxList.test.tsx` 的可访问名称和描述用例；共享复选框绑定                                                                                                | 字符串和富文本标签；`aria-label`；字符串和节点描述；缺失描述   | 名称或描述错误，或行上出现 `aria-label`，则失败。                                                    | `audit:CheckboxListItem/accessibility` |
| FR4、FR5           | `CheckboxList.test.tsx` 的集合、独立和全选用例                                                                                                                | 添加、移除、缺失 `value`、混合、全选、`isChecked` 搭配父级数组 | 数组或布尔值错误、缺失的错误抛出，或 `isChecked` 覆盖成员关系，则失败。                              | `audit:CheckboxListItem/behavior`      |
| FR6–FR8、AR4       | `CheckboxList.test.tsx` 的禁用、加载、待处理和只读用例；`CheckboxList.a11y.chromium.spec.ts` 的 `disabled-*`、`loading-item`、`pending-*` 和 `read-only` 用例 | 项与分组禁用；原因；加载；待处理；只读                         | 在禁用、只读或忙碌时发生切换，或忙碌状态丢失，则失败。                                               | `audit:CheckboxListItem/accessibility` |
| FR10、FR17         | `CheckboxList.test.tsx` 的项 `onClick` 和只读点击用例                                                                                                         | 已启用与只读；直接点击、键盘点击和行表面点击                   | `onClick` 在每次点击中触发零次或多次，则失败。证据缺口：没有测试断言只读项上被阻止的传播（FR17）。   | `audit:CheckboxListItem/behavior`      |
| FR11               | `CheckboxList.test.tsx` 的密度用例                                                                                                                            | 紧凑与均衡                                                     | 复选框尺寸错误则失败。                                                                               | `audit:CheckboxListItem/layout`        |
| FR12、FR18         | `CheckboxList.a11y.chromium.spec.ts` 的 `checked`、`hover-*` 和 `pressed-*` 用例                                                                              | 浅色与深色；未勾选与已勾选                                     | 填充缺失或错位会使行绘制检查失败。证据缺口：没有断言 `xstyle` 在填充之后组合。                       | `audit:CheckboxListItem/visual`        |
| FR13、FR16         | `CheckboxList.test.tsx` 的 ref 与样式、data-testid 和 ARIA 用例                                                                                               | 行 ref、class、style、data、ARIA                               | 输入被丢弃或路由错误，则失败。证据缺口：没有测试断言 `onClick` 的 `event.currentTarget`（FR16）。    | `audit:CheckboxListItem/api`           |
| FR14               | `Checkbox.a11y.test.tsx` 的已知失败 `list-item-handlerless-read-only`；`CheckboxList.a11y.chromium.spec.ts` 的 `handlerless` 用例                             | 具有 `isChecked` 且无 `onCheck` 的独立项                       | 当缺口闭合时，记录的已知失败不再匹配。                                                               | `audit:CheckboxListItem/accessibility` |
| FR15               | `CheckboxList.test.tsx` 的已勾选行状态用例                                                                                                                    | 已勾选、未勾选、只读和禁用的行                                 | 已勾选、已启用、可编辑的行在其行落点上没有 `selected`，则失败；只读或禁用的行带有 `selected`，则失败 | 当前源码                               |
| FR19、AR5          | `CheckboxList.a11y.chromium.spec.ts` 的 `focus-visible` 和 `forced-colors-focus` 用例                                                                         | 键盘焦点；强制颜色                                             | 焦点指示器丢失，则失败。证据缺口：没有测试统计焦点指示器数量（FR19）。                               | `audit:CheckboxListItem/visual`        |
| Direction          | RTL 审计目标 `core-checkboxlist--rich-descriptions`（`apps/storybook/rtl-audit/targets.json`）；`CheckboxList.a11y.chromium.spec.ts` 的 `rtl` 用例            | LTR 与 RTL                                                     | 复选框和结束内容未能交换行内顺序。                                                                   | `audit:CheckboxListItem/layout`        |
| ORD1–ORD4、PR1     | 由 FR4–FR10 和 FR13 行覆盖。证据缺口：没有测试断言观察器、定时器或全局监听器的缺失                                                                            | ——                                                             | ——                                                                                                   | `audit:CheckboxListItem/behavior`      |

## Current-state impact

- **无处理程序项（FR14）。** 带 `isChecked` 且无 `onCheck` 的独立项被暴露为可编辑复选框，尽管激活不改变任何内容（WCAG 2.2 4.1.2）。共享复选框测试套件将其记录为已知失败；其含义见 OQ1。
- **激活后的混合状态（FR5）。** 值保持混合的独立混合项在激活时会丢失其原生混合状态，如 `component:CheckboxInput` 所记录。
- **两个焦点指示器（FR19）。** 键盘焦点会同时绘制行轮廓和复选框环，这违反 `architecture:interaction-modality` INV3。

## Decision log

没有组件本地决策。CheckboxListItem 应用 `spec:AST-021` 和 `spec:AST-085`。

## Open questions

- **OQ1 — 带 `isChecked` 且无 `onCheck` 的独立项意味着什么？**（`human-api`）选择只读、不可用或无效用法，与对应的 CheckboxInput 问题保持一致。
- **OQ3 — 哪个元素拥有使用方的 DOM 输入？**（`human-api`）data 和 ARIA 到达行，而 `onClick` 在行类型化的处理程序下运行于复选框。
- **OQ4 — 只读项的点击是否应传播？**（`human-api`）当前没有权威拥有祖先传播。该阻止之所以存在，是因为否则共享可点击容器 hook 会把来自其 `aria-readonly` 委托目标的点击重新委托回该目标。
- **OQ5 — 已勾选行应显示怎样的悬停与按下反馈？**（`human-design`）已勾选行填充目前替换了这两种覆盖层。
- **OQ6 — 哪个元素绘制选项的焦点环？**（`human-design`）`architecture:interaction-modality/INV3` 要求一个指示器；RadioList 组合了同样的两个绘制者。

## Content boundary

本文件不重复使用方 prop 表与示例、当前审计结果、实现步骤或分组契约。它链接到其所有者。
