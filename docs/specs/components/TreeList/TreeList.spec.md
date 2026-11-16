---
schema_version: 3
template_version: 5
kind: component
id: component:TreeList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-20
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/TreeList/TreeList.test.tsx,
    packages/core/src/hooks/nestedTouchPress.adopters.test.tsx,
    packages/core/src/TreeList/__tests__/TreeListGuideAlignment.interaction.browser.spec.ts,
    packages/core/src/TreeList/__tests__/TreeListExpand.interaction.browser.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [spec:AST-002/DEC-1, spec:AST-005/DEC-1, spec:AST-094/FR4, spec:AST-105]
---

# TreeList component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 每个 `TreeListItemData` 都可以为其 Item 行携带标准的 `className`、`style` 和 `xstyle` 样式输入。                                                                                           |
| Behavior                | 所有提供的样式输入都组合在同一个 Item 行盒上——该元素绘制该行、拥有其悬停状态，并包含其可见内容。它们不作用于外层的语义 `<li>`。                                                            |
| End-user impact         | 构建者可以为一个行显示或设置内容样式，而不会让树中的每一行都作出反应。                                                                                                                     |
| Builder impact          | 这三种标准样式机制仍是同一个行样式接缝中可互换的部分。构建者可以使用其中一种，也可以组合使用；现有调用点无需选择加入。                                                                     |
| Compatibility/readiness | 该契约是增量的，并保持默认输出，FR8 的粗指针滑动和 DD5 的 Guide 除外。其权威性为 current；实现支持可能单独到位，但在三种机制都支持于同一行之前，持久 API 是不完整的。                      |
| Review checks           | 驳回这样的实现：从持久 API 中省略其中一种机制、把这些机制发往不同元素、丢弃提供的值、作用于语义 `<li>`，或未经明确的兼容性决策就移动所承诺的行目标。                                       |
| Governing rules         | [公共组件 API INV5–INV6](../../../architecture/public-component-api.md) 与 [AST-002 FR1、FR4、FR7–FR10、FR12 和 DEC-1](../../AST-002/spec.md) 管辖组件本地样式接缝的准入、可预测性与组合。 |

本表是审查的投影；下文的正文才具有权威性。

## Intent

TreeList 将层级数据呈现为可展开的树行。它拥有稳定的行边界，使得单个条目的调用方提供的外观表示或关系样式可以与其同级条目不同，同时既不暴露语义列表容器，也不要求产品代码重建 TreeList 行为。

## Compatibility and migration

- 已发布的默认行为保持不变：`no`。在粗粒度主指针下，被切换分组下方的行会在分组淡出的同时滑动（FR8）。在每种指针下，Guide 线都终止于它所连接的最后一行，而不是继续延伸到已展开的最后一行的子级旁边（DD5）。在精细指针且没有 `animatedLayout` 句柄时，行仍然立即变化
- 兼容性类别：增量的可选公共 API，外加 FR8 的粗指针下的分组动效与 DD5 的每种指针下的 Guide 线；当输入缺失时，不改变其他任何默认渲染、DOM、样式或交互
- 受控/非受控行为：不变
- 迁移决策：无；现有调用点仍然有效

即使实现工作分阶段推进，持久契约仍包含 `className`、`style` 和 `xstyle`。当前实现的可用性不会收窄已接受的 API 方向。使用方语法与发布时间属于 `TreeList.doc.mjs` 和发布说明。

## Ownership boundary

**Owns**

- Tree list、Item、Chevron、Item label 和 Guide 部件及其五个当前目标。
- 渲染在 Item label 下方的稳定 Item description。
- 层级放置、缩进、展开、选择以及树语义。
- Item 行盒上一个稳定的逐条目样式接缝。

**Does not own / non-goals**

- 调用方的样式值、选择器词汇或编写的类名。
- 语义 `<li>`、子组或调用方提供的插槽内容上的样式接缝。
- Chevron 字形图形与 Icon 目标——由 `component:Icon` 拥有。
- 通过使用方插槽提供的 Header、Start content 和 End content——由产品调用点拥有。
- 为 Item description 或调用方提供的插槽新增目标。

## Public concepts

| Concept     | Closed values or states             | Meaning                                                                  | Availability by variant/orientation/state | Default                    | Owner                | Stability | Invalid-value behavior                        |
| ----------- | ----------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------- | -------------------------- | -------------------- | --------- | --------------------------------------------- |
| Item 行样式 | `className`、`style` 和/或 `xstyle` | 将调用方提供的类、内联样式或 StyleX 样式应用到单个条目的稳定行盒。       | 每个渲染出的条目行                        | 缺失                       | `component:TreeList` | 稳定      | TypeScript 拒绝不支持的值；提供的输入会组合。 |
| 动画布局    | 缺失、`useAnimatedLayout` 句柄      | 展开和折叠一行时，其后的内容是否滑动，直到句柄的容器（`spec:AST-105`）。 | 每棵树                                    | 缺失：行之后的内容立即就位 | `spec:AST-105`       | 稳定      | TypeScript 拒绝不支持的值。                   |

这三种机制是一个样式概念，而不是三个独立的功能层级。支持其中一种并不构成从持久契约中省略另一种的理由。

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Basis                                                                           | Contract state                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------- | ------------------------------ |
| FR1 | 当前渲染包含一个 Tree list、每个渲染节点一个 Item 和一个 Item label、可选的 Header、Chevron、Item description、Start content、End content 与 Guide 部件，以及委托的 Chevron 字形。                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码、文档与测试                                                            | 当前行为                       |
| FR2 | Tree list、Item、Chevron、Item label 和 Guide 携带下文记录的五个当前 `tree-list*` 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与目标文档                                                              | 当前行为                       |
| FR3 | Chevron 字形委托给 Icon 的 `icon` 目标。Header、Start content 和 End content 由使用方拥有，没有 TreeList 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与组件文档                                                              | 当前归属                       |
| FR4 | Item description 是渲染在 Item label 下方的稳定库渲染部件，当前没有公共目标。它不通过 `tree-list-item-label` 继承；两个 span 都是行内容内的兄弟节点。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与目标文档                                                              | 当前可达性缺口；不接受新目标   |
| FR5 | `TreeListItemData` 必须接纳 `className`、`style` 和 `xstyle` 作为单一的逐条目样式接缝。每个提供的值都必须组合在同一个 Item 行盒上；实现不得把当前仅支持一种机制的现状视为排除另外两种机制的依据。                                                                                                                                                                                                                                                                                                                                                                                                                                    | 所有者决策；`architecture:public-component-api` INV5–INV6；`spec:AST-002/DEC-1` | 已确定的意图；实现可分阶段推进 |
| FR6 | Item 行盒是绘制该行、拥有其悬停状态并包含 Start content、Item label 与 description 以及 End content 的逻辑元素。未经兼容性决策，样式接缝不得迁移到语义 `<li>` 或其他元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 所有者决策与调用方拥有的逐行交互边界                                            | 已确定的意图                   |
| FR7 | 在 Item label 之外点击 Item 行会执行该行的动作：带 `onClick` 的 Item 执行它；否则，有子级的 Item 会切换；否则，唯一动作是链接的 Item 会像 Enter 那样跟随该链接，带修饰键的点击和中键点击遵循 `family:navigation-destinations` 中共享的放大表面规则。Chevron 以及 Start content 和 End content 中的控件保留各自的激活方式；在任何行上，从这些控件之一开始的触摸按压，或从表面执行不同动作的行上的 Chevron 开始的触摸按压，都不会在该行上显示按压着色（鼠标按压保留 `:active` 着色，如 `component:Item` FR9 所述）；禁用的 Item 不执行任何动作。在已打开的 Tooltip 或 HoverCard 表面内按压不会执行行动作（`component:Tooltip` FR11）。 | 所有者决策；`family:navigation-destinations`                                    | 已确定的意图；实现可分阶段推进 |
| FR8 | 在粗粒度主指针下，展开或折叠带子级的 Item 必须播放其动效。当分支展开或折叠时，下方的行在共享布局滑动上滑动（`spec:AST-105` FR4，`--duration-medium`），进入或离开的子级以相同时序淡入淡出，因此整棵树作为一个整体移动；子级采用滑动的时序，而不是 `--duration-fast`。Chevron 在该时序上旋转，折叠中的分组里的行在点击时离开无障碍树。没有 `animatedLayout` 句柄时，动效停留在树内，因此树之后的内容立即就位（`spec:AST-105` DEC-1）；在精细指针下，分组立即出现和离开。有句柄时，该分组及其之后的内容在每种指针下都遵循其共享动效（FR9）。                                                                                           | `spec:AST-105` FR4；所有者反馈，2026 年 11 月 6 日（Cindy）：展开感觉太跳。     | 当前行为                       |
| FR9 | `TreeList` 必须接受 `animatedLayout?: AnimatedLayout`。有句柄时，展开和折叠一行会通过它报告该行的尺寸变化，因此该行之后的内容会在句柄的容器内滑动，而显示的行与该行的 Chevron 在同一动效上移动（`spec:AST-105` FR1–FR4；`spec:AST-108` FR4a）。没有句柄时，展开和折叠遵循 FR8。该 prop 不得改变树语义或键盘行为。                                                                                                                                                                                                                                                                                                                    | `spec:AST-105` FR1、FR2；`spec:AST-108` FR4a                                    | 当前行为                       |

### Allowed variation

- **AV1 — 层级。** Item 数量、深度、展开、选择、密度和 guide 可见性可以变化，而不改变此处记录的解剖归属。
- **AV2 — 使用方内容。** Header、Start content、End content、Item label 值和描述可以变化，而不使调用方拥有的插槽内容成为 TreeList 目标。
- **AV3 — 委托字形。** Icon 可以改变 Chevron 字形的内部元素形状，同时保留其自身的公共契约。
- **AV4 — 行实现。** 行的 HTML 标签和内部后代可以改变，而同一逻辑行仍是全部三种样式输入的目标，并保持 FR6 中的可观察边界。
- **AV5 — 展开动效。** 在没有 `animatedLayout` 句柄时，在精细指针下分组立即出现和离开；在减弱动效下没有任何位移：在粗粒度主指针下，分组在落地处淡入、在原处淡出（DR2），否则立即变化（`design:reduced-motion` DR3）。

### Representative states

| State                | Required invariant                                                 | Allowed variation                  |
| -------------------- | ------------------------------------------------------------------ | ---------------------------------- |
| 空树                 | Tree list 保留；不渲染任何 Item 实例。                             | 可选的 Header 内容。               |
| 扁平条目             | 每个 Item 包含一个 Item label。                                    | description 与使用方插槽可以缺失。 |
| 已设置样式的条目     | 提供的 `className`、`style` 和 `xstyle` 值仅组合在该条目的行盒上。 | 三种输入中的任意子集可以缺失。     |
| 可展开条目           | Item 可以包含 Chevron 和委托的 Chevron 字形。                      | 展开或折叠状态。                   |
| 由手指切换的条目     | 其分组淡入或淡出时，下方的行以同一时序滑动；Chevron 旋转。         | 减弱动效：仅淡入淡出，无位移。     |
| 嵌套 `lineGuides` 树 | Guide 实例显示父子关系。                                           | 数量与位置跟随层级。               |
| `noGuides` 树        | 不出现 Guide 实例；缩进保留。                                      | 其他所有解剖保持不变。             |
| 带描述的条目         | Item description 渲染在 Item label 下方。                          | 调用方提供的描述文本。             |

### Transformation and precedence order

- **ORD1 — Item 行样式。** 先应用 Item 目标和组件拥有的行样式，然后依次应用使用方的 `xstyle`、`className`、内联 `style`，使用共享合并行为。三种输入全部合并；没有任何一种整体替换或抑制另一种输入。

### Performance and resources

- 逐条目样式接缝不增加任何测量、监听器、观察器或全局资源需求。

## Accessibility contract

样式接缝不改变 TreeList 的 tree、treeitem、group、漫游焦点、展开、选择、禁用或激活行为。样式输入不得替换组件拥有的语义或交互 prop。

- **AR1 — TreeList 采用 APG Tree View 模式**（`spec:AST-020/FR15`），作为一个复合控件：Tree list 为 `role="tree"`，在渲染 Header 时由其 Header 命名，否则由调用方的 `aria-label` 或 `aria-labelledby` 命名；`header` 为 `''`、`true` 或 `false` 时不渲染 Header，因此当 `header=""` 且 `aria-label="Files"` 时，树的名称是 "Files"（`architecture:react-component-runtime` INV16）；每一行都是 `role="treeitem"`，由其 label 命名并由其 description 描述，有子级时带 `aria-expanded`，是选中行时带 `aria-selected`，其深度用 `aria-level`，其同级中的位置用 `aria-posinset`/`aria-setsize`；子级位于 `role="group"` 中。一行持有 Tab 停靠点（漫游焦点）。ArrowDown/ArrowUp 在可见行之间移动；ArrowRight 展开闭合的行，然后移入其第一个子级，ArrowLeft 折叠打开的行或移到父级——在 RTL 下镜像；Home 和 End 移到第一个和最后一个可见行；Enter 和 Space 激活获得焦点的行；输入字母会移到 label 以这些字母开头的下一行。选择由调用方拥有：调用方至多标记一行为选中（`isSelected`）；树不强制这一点，不声明 `aria-multiselectable`，也没有选择键盘操作。
- **AR2 — 焦点离开折叠的分支。** 当焦点位于其子组内时某行折叠，无论它如何折叠（`items` 变化、祖先折叠），焦点都会移到该行，嵌套行一起折叠时移到最外层的那一行，包括分组播放其退出动效期间（FR9）。该行随后持有 Tab 停靠点，除非它被禁用；被禁用的行会获得焦点，而 Tab 停靠点保留在持有它的已启用行上，或者当折叠移除了该行时，转到树的第一个已启用行（AR1）。位于其他任何位置的焦点不会移动（WCAG 2.2 SC 2.4.3）。

## Design relationships

| Anatomy or state | Design requirement                             | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------------- | ------------------------ | -------------- | ------------------ |
| Tree list        | 对层级树进行分组，并拥有其密度和 guide 变体。  | 当前源码与公共文档       | 支撑           | FR1, FR2           |
| Header           | 用调用方提供的内容为树提供可见名称。           | 调用方提供的内容         | 显著           | FR1, FR3           |
| Item             | 绘制一行，并反映密度、选择、禁用状态和行样式。 | 当前源码与所有者选择     | 显著           | FR1, FR2, FR5, FR6 |
| Chevron          | 为有子级的 Item 提供展开和折叠控件。           | 当前源码与公共文档       | 支撑           | FR1, FR2           |
| Chevron glyph    | 在 Chevron 内呈现当前的方向符号。              | `component:Icon`         | 支撑           | FR1, FR3           |
| Item label       | 呈现标识 Item 的主要内容。                     | 当前源码与公共文档       | 显著           | FR1, FR2           |
| Item description | 在 Item label 下方呈现稳定的次要文本。         | 当前源码与公共文档       | 支撑           | FR1, FR4           |
| Start content    | 在 Item label 之前呈现调用方提供的内容。       | 调用方提供的内容         | 视上下文而定   | FR1, FR3           |
| End content      | 在 Item label 之后呈现调用方提供的内容。       | 调用方提供的内容         | 视上下文而定   | FR1, FR3           |
| Guide            | 在相关层级之间绘制连接线。                     | 当前源码与公共文档       | 支撑           | FR1, FR2           |

Item description 是 TreeList 稳定渲染的解剖结构，而不是使用方拥有的插槽结构。它当前缺少目标是可达性缺口，而不是“必须保持不可主题化”的决定。Header、Start content 和 End content 仍由调用方拥有，尽管 TreeList 会定位它们的插槽包装元素。

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                                                                             | Intent or reason                                                                                                 | Applies to                                                                 | Allowed variation                                                                                                        |
| --- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| DD1 | 每个 Item 在任意深度都横跨树列表的整个宽度；其嵌套缩进位于行内、内容之前。           | 悬停、按压和选中的填充在各深度上对齐，因此树读起来是一个由等高行组成的列表，同时 label 保持其按级别的对齐。      | 任意深度的 Item，在静止状态以及悬停、按压、选中、禁用和焦点过程中          | 主题通过 `--tree-list-indent` 设置缩进步长，并可重新设置行的填充、圆角和内边距；行内边距是在缩进之上增加，而不是替换它。 |
| DD2 | 嵌套 Item 的缩进区域是该行绘制目标的一部分：它会显示该行的悬停和按压反馈。           | 整个被绘制的行读作一个目标，与点击起作用的位置一致（FR7），因此行的任何部分都不会脱离其余部分单独亮起。          | 点击时会起作用的嵌套 Item                                                  | 主题可以通过 `tree-list-item` 目标重新设置该反馈的样式。                                                                 |
| DD3 | Guide 绘制在行填充之上，而正在显示焦点环的 Item 绘制在 Guide 之上。                  | 层级线在悬停和选中时保持连续，焦点指示器绝不被裁掉；在同时也被填充的焦点行上，焦点环优先，填充在该行覆盖 Guide。 | `lineGuides` 树中的 Guide 与 Item                                          | 主题可以通过 `tree-list-guide` 目标重新着色或隐藏 Guide。                                                                |
| DD4 | Chevron 保持在其自然列中；Guide 将其中心对齐到该 Chevron，而不是移动该控件。         | Guide 的可见性是装饰，因此在 `lineGuides` 与 `noGuides` 之间切换不得重新定位一个交互控件。                       | 任意深度的 Chevron 与 Guide，在 LTR 和 RTL 下，涵盖两种 guide 变体         | 主题可以通过各自的目标重新设置或隐藏任一部分；移动 Chevron 或改变 Item 内边距的主题也负责相应的 Guide 对齐。             |
| DD5 | 当分组进入或离开时，其 Guide 随其行一起显示和隐藏；没有 Guide 线会越过它所连接的行。 | 这些线与它们所连接的行一起作为一个整体移动，因此树移动时不会有线悬在空白处。                                     | 在它所连接的最后一个行处，以及在进入或离开的分组旁边的 Guide，在每种指针下 | 主题可以通过 `tree-list-guide` 目标重新着色或隐藏 guide。                                                                |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Tree list": {"target": "tree-list"},
  "Header": {
    "none": {
      "reason": "intentional: Header is caller-provided content outside TreeList's public theming ownership"
    }
  },
  "Item": {"target": "tree-list-item"},
  "Chevron": {"target": "tree-list-chevron"},
  "Chevron glyph": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Item label": {"target": "tree-list-item-label"},
  "Item description": {
    "none": {
      "reason": "reachability-gap: No current public target reaches the stable Item description"
    }
  },
  "Start content": {
    "none": {
      "reason": "intentional: Start content is caller-provided content outside TreeList's public theming ownership"
    }
  },
  "End content": {
    "none": {
      "reason": "intentional: End content is caller-provided content outside TreeList's public theming ownership"
    }
  },
  "Guide": {"target": "tree-list-guide"}
}
```

这五个本地目标是当前公共接缝。Chevron 字形保留 Icon 的归属。使用方插槽的 `none` 处置是归属边界。Item description 的 `none` 处置只记录当前可达性，既不授权也不禁止未来的目标。

## Family and system relationships

- `architecture:public-component-api` 拥有共享的 `className`、`style` 和 `xstyle` 组合顺序与保留规则；本记录为每个 TreeList Item 行接纳该接缝并固定其目标。
- `architecture:component-theming-surface` 拥有解剖资格、目标映射、委托以及事实性的 `none` 处置。
- `architecture:interaction-modality` 拥有共享的键盘和指针模态；TreeList 继续拥有其现有的树焦点与激活行为。
- `family:navigation-destinations` 拥有 TreeListItem `href` 的共享接受/阻止结果；`spec:AST-005/DEC-1` 要求原生与自定义路由的条目路径保留该结果。
- TreeList 当前的自定义路由路径继承该 family 记录的 `useLinkComponent` 采用缺口，直到已接受的实现落地。
- `spec:AST-105` 拥有动画布局句柄及其共享滑动；在粗指针下，TreeList 在树内播放该滑动（FR8）。

## Verification map

| 契约           | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 代表性状态                                                                                                                                  | 变更或失败预期                                                                                                                                                                                                                   | 审计章节                       |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------ |
| FR1            | `TreeList.test.tsx` 的渲染、层级、插槽与无障碍测试套件，外加源码检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 扁平、嵌套、带描述、带头部与带插槽的条目                                                                                                    | 删除被断言的 Tree list、Header、Item、Chevron、Item label、Item description、Start content、End content 或 Guide 行为，会使现有的 role、内容、层级或状态断言失败；Chevron 字形是否存在仍仅由源码检查覆盖。                       | `audit:TreeList/anatomy`       |
| FR2            | `TreeList.test.tsx` 与 `themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 五个局部目标及其文档化的状态                                                                                                                | 删除或移动任何当前局部目标，都会使聚焦的类断言或全局清单失败。                                                                                                                                                                   | `audit:TreeList/theming`       |
| FR3            | 源码检查，外加 Icon 公开目标元数据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 可展开的行与调用方提供的插槽                                                                                                                | 现有的聚焦测试并不断言组合后的 Icon 实例；更改字形或插槽归属，需要同时更改本映射与相关的所有者元数据。                                                                                                                           | `audit:TreeList/theming`       |
| FR4            | `TreeList.test.tsx` 的描述渲染测试与源码检查                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 带描述的条目                                                                                                                                | 删除描述会使内容覆盖失败；新增目标需要显式更新映射。                                                                                                                                                                             | `audit:TreeList/anatomy`       |
| AR1            | 绑定到 TreeList 的 Tree View 无障碍契约（`internal/a11y-spec`，待定），在 jsdom 与 Chromium 中运行；`TreeList.test.tsx` 的行命名用例（“仅以标签命名父行，而非 Chevron 切换开关”、“以标签命名普通行，并用其描述来描述它”、“为链接行与动作行本身命名并描述，而不只是它们的内部控件”、“把 Start content 与 End content（含控件）排除在行名之外”、“typeahead 匹配标签，而非描述或 Start content”），以及用于浏览器计算名称的 `TreeListRowNames.a11y.chromium.spec.ts`；`TreeList.test.tsx` 的结构性 ARIA 用例（“在顶层设置 aria-level、aria-posinset 与 aria-setsize”、“在更深的层级正确设置 aria-level/posinset/setsize”、“跨三个深度设置 aria-level”）；`TreeList.test.tsx` 与 `useTreeFocus.test.tsx` 的键盘套件 | 扁平与嵌套树；展开/折叠；选中/未选中；LTR 与 RTL；typeahead                                                                                 | 某行丢失其 role、标签名称、状态或位置；两行持有 Tab 停靠点；方向键不再移动，或在 RTL 下不再镜像；Home/End 或 typeahead 失效；或树声称支持多选                                                                                    | `audit:TreeList/accessibility` |
| AR1（空头部）  | `TreeList.test.tsx` 的 “TreeList empty slots” 套件：针对 `''`、`false`、`true` 与 `null` 的 “%s 的头部不命名任何内容；树保留自己的标签”，以及作为已渲染 Header 的 `0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 带 `aria-label` 的空、布尔与 null 头部；`0` 头部                                                                                            | 由空 Header 命名的树，或未渲染 Header 却带有 `aria-labelledby` 的树，均判定失败。                                                                                                                                                | `audit:TreeList/accessibility` |
| FR5、FR6、ORD1 | 聚焦的 `TreeList.test.tsx` 行标识与样式组合覆盖，须随实现一并提供                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 一次一个输入；三者同时；兄弟行                                                                                                              | 丢弃任一机制、把机制应用到不同元素、以 `<li>` 为目标、改变合并顺序，或对兄弟行施加样式，均判定失败。                                                                                                                             | `audit:TreeList/api`           |
| FR7            | 聚焦的 `TreeList.test.tsx` 行点击覆盖，须随实现一并提供                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 动作行、父行、链接行与禁用行；在缩进与内边距处、在 Chevron 上、在 Start content 与 End content 控件上的点击；普通点击、修饰键点击与中键点击 | 标签之外的点击无反应或执行了错误动作，链接行的一次点击两次触达祖先，Chevron 或某个 Start content 或 End content 控件激活了该行，或禁用行仍然动作。                                                                               | `audit:TreeList/behavior`      |
| FR8            | `TreeListExpand.interaction.browser.spec.ts`：手指与鼠标之下的逐帧证据                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 展开与折叠；减弱动态效果；主题的 glide token；下方的行与树之后的内容，带与不带 `animatedLayout` 句柄                                        | 任一帧上，下方行之上出现空白带；某组在淡入之前就静止可见；下方的行跳动；时序不是主题的 glide；精细指针下无句柄却有运动；减弱动态效果下仍有位移；点按之后折叠组的行仍留在无障碍树中；或树之后的内容在无句柄时移动——以上均判定失败 | `audit:TreeList/behavior`      |
| FR9            | `animatedLayoutAdopters.test.tsx`（带与不带句柄；`items` 中 `isExpanded` 的变化会滑动过渡；折叠中的组在其退出结束前保持 inert 并被排除在键盘顺序之外）与 `animatedLayoutAdopters.interaction.browser.spec.ts`（经 ScrollableArea ref 运行 `Core/Animated layout` Story，展开与折叠）                                                                                                                                                                                                                                                                                                                                                                                                                            | 无句柄；有句柄；点击、键盘与 `items` 驱动的变更；展开与折叠                                                                                 | 有句柄时某行之后的行跳动；`items` 变更立刻落定；折叠中的组在退出之前消失，或其行在退出期间仍可聚焦；或无句柄时任何内容发生变化                                                                                                   | `audit:TreeList/behavior`      |
| AR2            | `TreeList.test.tsx` 的折叠焦点套件；`animatedLayoutAdopters.test.tsx` 中退出期间焦点位于内部的折叠；`TreeListCollapseFocus.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 焦点位于子行、`items` 驱动的折叠，带与不带句柄；外层与内层的嵌套折叠；禁用状态下的折叠行；焦点在另一行或外部                                | 焦点留在被移除或 inert 的组内、落到页面 body 上，或原本不在组内却被移动，均判定失败。                                                                                                                                            | `audit:TreeList/accessibility` |
| DD4            | `TreeListGuideAlignment.interaction.browser.spec.ts` 在构建出的 Fully Expanded Story 中测量 Chevron 逻辑起始位置以及 Guide/Chevron 的中心对齐。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `lineGuides` 与 `noGuides`；LTR 与 RTL                                                                                                      | 重新引入 Chevron 边缘外边距、在 Guide 隐藏时移动 Chevron，或把 Guide 放在偏离 Chevron 中心的位置，都会使浏览器几何断言失败。                                                                                                     | `audit:TreeList/anatomy`       |
| DD5            | `TreeListExpand.interaction.browser.spec.ts` 的 Guide 用例：每一帧都测量 Guide 列                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 手指之下的展开与折叠                                                                                                                        | 任一帧上 Guide 线越过它所连接的最后一行，即判定失败                                                                                                                                                                              | `audit:TreeList/anatomy`       |
| 主题化解剖映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 规范解剖与五个当前局部目标                                                                                                                  | 映射缺失、多余、重复、带前缀或过期，都会使仓库校验失败。                                                                                                                                                                         | `audit:TreeList/theming`       |

聚焦的目标位置断言覆盖全部五个局部目标。条目样式接缝的运行时支持，以及对变更敏感的覆盖，可以分开落地，但每一份实现都按完整的三机制契约来评判。

## Decision log

### DEC-1 — Each Item row supports the complete standard styling seam

**Reference:** `component:TreeList/DEC-1`

**Decider:** cixzhang, 2026-09-20

调用方可以把 `className`、`style` 与 `xstyle` 附加到一个 TreeList 条目上。三者都组合在 Item 行盒上，因此逐行的呈现与关系式样式可以保持限定在该行内。`className` 是有意支持的，包括用于 StyleX 标记类；标准的 `style` 与 `xstyle` 机制仍属于同一个持久接缝，即使实现工作分阶段到达。

已否决：只暴露 `className`，理由是对触发该需求的标记用例已经足够。那会让一个临时的实现切片为 Astryx 的标准样式契约定义一个永久例外。

已否决：把接缝应用到外层语义 `<li>` 上。该元素拥有树语义与子项分组，而行盒才是调用方需要定位的稳定视觉与悬停边界。

### DEC-2 — The tree is one composite control with single, caller-owned selection

**Reference:** `component:TreeList/DEC-2`

**Decider:** `cixzhang`, `2026-10-13`

TreeList 已经以一个控件的形式扮演 Tree View 的角色——一个 Tab 停靠点、方向键、Home/End、激活、typeahead——因此它采用该模式的键盘模型，除可选的 `*` 键之外（AR1），而不只是其中必需的部分。调用方至多把一行标记为选中（`isSelected`），树本身并不强制这一点，因此树绝不声明 `aria-multiselectable`，也不添加范围选择或切换式键盘操作。

已否决：多选（`aria-multiselectable`、Shift/Ctrl 范围选择）；每行一个 Tab 停靠点。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表与示例、共享模态规则、当前审计结果、实现步骤或家族/系统规则。它链接到它们的所有者。
