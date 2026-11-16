---
schema_version: 3
template_version: 7
kind: component
id: component:SideNav
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-16
owners: [cixzhang]
review_triggers: [layout, behavior, accessibility]
verified_by:
  [
    packages/core/src/SideNav/SideNav.test.tsx,
    apps/storybook/stories/SideNav.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-017/FR3]
---

# SideNav component contract

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

本记录规定嵌套 SideNavItem 行如何绘制：它们的宽度、嵌套缩进所在的位置，以及缩进区域的作用。只有在上述几何关系依赖于 SideNav、SideNavSection 与 SideNavItem 的范围内，本记录才涉及它们。本记录还规定导轨自身的折叠动效（FR6）。SideNavItem 的链接与目标安全性由 `family:navigation-destinations` 规定；SideNav 的其他行为仍由其源码、测试和使用方文档描述，直到有记录声明对其负责。

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `resizable` 除 `true` 及其配置对象外，也接受 useResizable 的输出（FR7）；其他 prop、取值或主题目标均不变，省略的 prop 行为与之前一致。                                                                                                                                                    |
| Behavior                | 任意深度下，每个 SideNavItem 行都横跨其导航列表的整个宽度。深度体现为行内的行内起始侧（inline-start）缩进：每层一个 `--spacing-6` 步长，叠加在行自身的填充之上。折叠或展开导轨会把布局直接吸附到最终宽度，并通过裁剪让标签收起或露出；折叠结束于仅图标状态，展开结束于带标签状态（FR6）。 |
| End-user impact         | 浏览嵌套导航的人会看到悬停、按下、选中和聚焦的填充与顶层行对齐，并且可以像点击标签一样点击嵌套行的缩进区域来激活它。折叠导轨时布局不会逐帧移动（FR6）。                                                                                                                                   |
| Builder impact          | 没有新增 prop；`resizable` 也接受 useResizable 的输出（FR7）。图标与标签保持各自随深度变化的位置。直接放在 SideNavItem 内部、且本身不是 SideNavItem 的内容位于导航列表边缘，因为嵌套组不添加内缩；没有任何受支持的设置能让它内缩。                                                        |
| Compatibility/readiness | 视觉方向的非破坏性变更（`spec:AST-017/FR3`）。折叠导轨与顶层行不变。权威状态为 current；实现可分阶段落地。                                                                                                                                                                                |
| Review checks           | 应否决以下情况：嵌套行比顶层行窄、缩进绘制在行外、缩进区域有反馈却不激活、聚焦环被裁剪，或浮出层顶层出现缩进。同样应否决导轨宽度带动画（FR6）。                                                                                                                                           |
| Governing rules         | 下文 DD1 与 FR3–FR6；内容由 `component:AppShell` FR17 规定；目标由 `family:navigation-destinations` 规定；逻辑方向由 `architecture:internationalization` 规定。                                                                                                                           |

本表是审查视角的投影；下文正文才是权威。

## Intent

SideNav 是应用的纵向导航区域。SideNavItem 行可以嵌套，以呈现目标层级。嵌套必须被读作一个由等宽行组成的列表，这样视线比较的是跨深度的标签与状态，而不是看到又一种更窄的行。这由 SideNav 负责，因为只有 SideNavItem 知道行的深度及其行内边距。

## Compatibility and migration

- 已发布的默认行为保持：`no`；嵌套行从内缩改为全宽。顶层行与折叠导轨不变。导轨的折叠与展开获得 FR6 的动效。
- 兼容性类别：在 `spec:AST-017/FR3` 下属于视觉方向的非破坏性外观变更。`resizable` 也接受 useResizable 的输出（FR7），属于补丁级 `[feat]`；其余公共 API、可接受的输入或无障碍语义均无变化。
- 受控/非受控行为：不变。
- 迁移决策：无；没有任何受支持的方式可以保留内缩外观。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**Owns**

- 任意深度下每个已展开 SideNavItem 行的宽度。
- 嵌套行缩进的位置、其步长，以及它如何累加到行的内边距。
- 缩进区域绘制什么，以及点击它会产生什么效果。
- 嵌套组是否裁剪其行。
- 导轨的折叠与展开动效：吸附到最终宽度，以及露出或遮盖标签的裁剪（FR6）。

**Does not own / non-goals**

- 目标的接受、阻止与路由交接——由 `family:navigation-destinations` 负责。
- 折叠项的 tooltip 及其挂载方式——由 `component:SideNavItem` 负责。
- 具体的填充色、圆角、最小行高，以及各尺寸的行内边距——由共享的导航项样式与 `side-nav-item` 主题目标负责；共享样式把高度作为最小值处理，因此行会随更大的文字尺寸而增高（`spec:AST-102` FR4）。
- 直接放在 SideNavItem 内部、且本身不是 SideNavItem 的调用方内容的布局——由产品调用点负责。
- SideNavHeading——由 `component:SideNavHeading` 负责；SideNavCollapseButton——由 `component:SideNavCollapseButton` 负责。
- SideNav 头部、底部与调整尺寸区域的布局（它们在折叠过程中的焦点由 AR3 规定）。

## Public concepts

| Concept  | Closed values or states                       | Meaning                                                                                                    | Availability by variant/orientation/state | Default | Owner               | Stability | Invalid-value behavior |
| -------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- | ------- | ------------------- | --------- | ---------------------- |
| 嵌套深度 | `0`、`1`、`2`、…（派生值，不是 prop）         | 同一列表内某一行的 SideNavItem 祖先数量。折叠导轨的浮出层从 0 重新开始计数。                               | 展开导轨；移动端抽屉；浮出层              | `0`     | `component:SideNav` | stable    | 调用方不可设置         |
| 行尺寸   | `sm`、`md`、`lg`（SideNavItem 现有的 `size`） | 设定已展开行的最小高度和每一行的基础行内起始侧内边距；缩进叠加到该内边距上。折叠导轨的行保持固定方块尺寸。 | 每一行                                    | `md`    | `component:SideNav` | stable    | 由类型拒绝             |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Basis                                                                         | Draft review state                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1 | SideNav 把其导航子项渲染在一个可滚动的列表中，该列表可按 SideNavSection 分组。带子项的 SideNavItem 会在自身行之后，把子项渲染在一个以父项标签命名的组中；除非 `collapsible` 为 `false`，该组可展开和折叠，且在折叠时对辅助技术隐藏并处于 inert 状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 现行源码、文档与测试                                                          | 现行行为                                                                                                                                                                      |
| FR2 | 在折叠导轨中，没有图标的 SideNavItem 不渲染；叶子项仅渲染图标，其名称取自调用方非空的 `aria-label`，没有则取其标签；带子项的项渲染一个仅图标的触发器，打开一个浮出层，把其子项列作浮出层的顶层。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 现行源码、文档与测试                                                          | 现行行为                                                                                                                                                                      |
| FR3 | 在展开导轨、浮出层以及移动端导航抽屉中，任意深度下每个 SideNavItem 行都必须横跨其列表的整个行内尺寸。深度为 `n` 的行，其内容必须在行自身按尺寸的行内起始侧内边距之外再起始 `n` × `--spacing-6`，且仍在行内；嵌套组不得添加内缩。浮出层的顶层深度为 0。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `component:SideNav/DEC-1`                                                     | 意图已确定；实现可分阶段落地                                                                                                                                                  |
| FR4 | 缩进区域必须是行目标的一部分：在那里点击（包括在链接行上的带修饰键点击或中键点击）所做的事，与在行的主元素上做同样的点击相同。当行还带有独立的展开开关或 `actions` 时，缩进属于主链接或按钮，开关与操作项保留其在行尾自身的激活行为。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `component:SideNav/DEC-1`；`family:navigation-destinations`                   | 意图已确定；实现可分阶段落地                                                                                                                                                  |
| FR5 | 已展开的嵌套组在完成打开后不得裁剪其行，这样嵌套行的聚焦环能完整绘制。该组在折叠时以及打开或关闭过程中可以裁剪。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | `component:SideNav/DEC-1`                                                     | 意图已确定；实现可分阶段落地                                                                                                                                                  |
| FR6 | 折叠或展开导轨在一次动效、一个时钟上播放，即 `spec:AST-105` FR4 的单一共享动效，使用主题的曲线令牌，绝不用弹簧：布局立即吸附到最终导轨宽度，没有宽度动画；导轨通过裁剪露出或遮盖其标签，其边缘随主内容的滑行移动，标签与折叠图标在同一时钟上淡入淡出（`spec:AST-105` FR9 的行内双状态形式；裁剪与滑行属于共享的边缘揭示，SideNav 自己的代码只保留淡入淡出；导轨不向其尺寸调整控制器让出面板，因此折叠只播放一次；实现缺口：裁剪与滑行仍在 SideNav 自己的导轨动效代码中运行，而不在共享的边缘揭示中）：折叠结束于真实的折叠状态，即仅图标；展开结束于真实的展开状态，即带标签。在折叠或展开时，导轨的旧状态是一份瞬态副本，处于 inert 状态且对辅助技术隐藏，动效结束时移除。折叠时，瞬态副本绘制在导轨自身所在的层级，紧邻导轨下方且自身没有 `z-index`（`spec:AST-027` FR1、FR6）；位于导航上方的页面内容也会遮住离场的副本。主内容在同一时钟上移动，如 `component:AppShell` FR17 所述。在导轨首次绘制之前做出的变更会立即生效，除非该变更由导轨自身的开关做出，因此初始状态从不播放动效。在减少动效下，导轨在粗粒度主指针下遵循 `design:reduced-motion` DR2，否则遵循 DR3。折叠或展开会保持导航及其项挂载，包括 `resizable` 导轨，因此项状态（例如已展开的嵌套组）与焦点得以保留（对折叠导轨不渲染的内容，焦点由 AR3 规定）。 | `component:SideNav/DEC-2`；`component:AppShell` FR17；`spec:AST-105` FR8、FR9 | 已由 `SideNavRailMotion.test.tsx` 与 `SideNavRailMotion.interaction.browser.spec.ts` 验证；`reducedMotion: 'always'` 主题用例，以及一个在折叠开始后一帧之前启动的长任务，待定 |
| FR7 | `resizable` 除 `true` 及其配置对象外，也接受 useResizable 的输出（负责人决定，2026-11-04）；此时区域的 `autoSaveId` 会保存宽度。当 `resizable` 是 hook 的输出、而 `collapsible` 设置自己的折叠状态时，区域优先：导轨遵循区域的 `isCollapsed`，开关调用其 `collapse` 与 `expand`，并且 SideNav 在开发环境中给出警告，因为 `resizable` 的键本就覆盖 `collapsible` 的键。当 `resizable` 是 hook 的输出时，区域自身的 `collapsible` 选项也决定导轨是否折叠；与之不一致的 collapsible prop 会被忽略，并给出同样的警告。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `component:Resizable` FR9                                                     | 已由 `resizableSlot.test.tsx` 验证                                                                                                                                            |

### Allowed variation

- **AV1 — Depth and size.** 任意深度和任意行尺寸都可以出现；FR3 对每一行按其自身尺寸的内边距均成立。
- **AV2 — Theme tokens.** 改变 `--spacing-6` 或行内边距令牌的主题，会连同它们一起改变步长或基准。
- **AV3 — Row implementation.** 承载缩进的元素可以变化，只要绘制出的行保持全宽且缩进仍可点击。

### Representative states

| State                    | Required invariant                                     | Allowed variation      |
| ------------------------ | ------------------------------------------------------ | ---------------------- |
| 深度 1–3，`md`           | 行宽与顶层行相同；内容每层向内多起始一个步长。         | 标签、图标、选中状态。 |
| `sm` 与 `lg` 的嵌套行    | 缩进叠加到该尺寸的基础内边距上。                       | 按尺寸变化的行高。     |
| 自带链接且有子项的嵌套行 | 全宽行；缩进是链接的一部分；展开开关保留在行尾。       | 子项折叠或展开。       |
| 带 `actions` 的嵌套行    | 全宽行；缩进是主元素的一部分；操作项保留在行尾。       | 操作内容。             |
| 键盘聚焦在嵌套行上       | 聚焦环完整地绘制在行的四周。                           | 按主题变化的环样式。   |
| 从右到左                 | 缩进位于行内起始侧（右侧）；宽度相同。                 | 书写方向。             |
| 折叠导轨                 | 仅图标项；浮出层顶层没有缩进；浮出层更深的层级有缩进。 | 浮出层内容。           |

### Transformation and precedence order

- **ORD1 — Row inline-start padding.** 先是行按尺寸的内边距，再加上深度 × `--spacing-6`。调用方在嵌套项上的 `style` 按共享顺序在缩进之后合成（`architecture:public-component-api`）：调用方未设置的属性保留缩进，调用方设置的行内起始侧内边距会替换它。

### Performance and resources

- **PR1 — No measurement.** 深度与缩进来自组合；不添加测量、观察器或额外的渲染过程。

## Accessibility contract

- **AR1 — Presentation only.** 宽度与缩进不得改变任何行的 role、无障碍名称、状态、DOM 顺序或 Tab 顺序。
- **AR2 — Visible focus.** 嵌套行的焦点指示器必须在每一深度完整绘制（FR5）。
- **AR3 — Focus leaves what the collapsed rail removes.** 当导轨折叠、被聚焦的元素随之消失时，焦点会移动。对于导轨保留的行（其链接被替换、其展开开关或行操作消失），焦点移到该行的控件上。从导轨不再渲染的行（没有图标的行或嵌套行，FR2）出发，焦点移到渲染在 SideNav 内部的折叠开关；若不存在，则移到导轨保留的最近一行，优先取前一行。若头部或底部控件在折叠后以相同无障碍名称重新渲染，则保持焦点。从被折叠移除或以另一个名称替换的头部或底部控件、或尺寸调整手柄出发，焦点移到折叠开关；若不存在，则移到导轨保留的第一行。折叠未接管的焦点不移动（WCAG 2.2 SC 2.4.3）。

## Design relationships

| Anatomy or state | Design requirement                               | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------------------ | ------------------------ | -------------- | ------------------ |
| 导航项           | 嵌套行被读作同一列表中的等宽行；深度表现为缩进。 | 负责人选择（DD1）        | 突出           | FR3–FR5            |

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                                                                                                                                    | Intent or reason                                                                                                                 | Applies to                                                                      | Allowed variation                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| DD1 | 任意深度下，每个 SideNavItem 行都横跨其导航列表的整个宽度；嵌套以行内缩进的形式出现在内容之前。悬停、按下、选中与聚焦都绘制整行，包含缩进。 | 填充跨深度对齐，因此导航被读作一个由等宽行组成的列表，同时标签保持各自的层级对齐；缩进属于行的主目标，而不是作为间隙位于其旁边。 | 任意深度下的 SideNavItem 行，包括静止状态以及悬停、按下、选中、禁用与聚焦过程中 | 主题通过 `side-nav-item` 目标重设填充、圆角与内边距；步长遵循 `--spacing-6`。 |

## Family and system relationships

- `family:navigation-destinations` 负责 SideNavItem `href` 的接受/阻止结果；缩进区域激活的目标与主元素相同（FR4）。
- `architecture:internationalization` 负责逻辑方向；缩进位于行内起始侧，并在从右到左时镜像。
- `architecture:interaction-modality` 负责共享的 focus-visible 行为；FR5 使聚焦环在每一深度都可见。
- `architecture:component-theming-surface` 负责 `side-nav-item` 目标；本记录不新增目标或状态。
- `architecture:public-component-api` 负责调用方样式输入如何合成；ORD1 把缩进置于调用方的 `style` 之前。
- `spec:AST-017/FR3` 将该变更归类为视觉方向的非破坏性变更。
- `component:TreeList` 的 DD1–DD3 为 TreeList 记录了相同的行几何。它们是先例，而非本记录的权威；每个组件负责自己的行。

## Verification map

| Contract  | Verification                                                                                                                                                                                                                                                                                                         | Representative states                                                                                                                                                                                                                                                                                                                                                           | Mutation or failure expectation                                                                                                                                                                                                                                                                                                                                                                            | Audit section            |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1, FR2  | `SideNav.test.tsx` 的嵌套、可折叠与折叠轨道套件                                                                                                                                                                                                                                                                      | 嵌套、可折叠、折叠轨道、浮出                                                                                                                                                                                                                                                                                                                                                    | 移除带标签的分组、其折叠后的 inert 状态，或移除折叠时的仅图标路径与浮出路径，都会失败。                                                                                                                                                                                                                                                                                                                    | `audit:SideNav/anatomy`  |
| FR3, ORD1 | 聚焦的 `SideNav.test.tsx` 缩进覆盖，必须随实现一同提供                                                                                                                                                                                                                                                               | 深度 1 和 2；`sm` 和 `md`；split 与 actions 行；调用方的 `style`；浮出                                                                                                                                                                                                                                                                                                          | 分组内缩、缩进缺失或错误、丢失调用方的 `style`、缩进覆盖了调用方设置的 inline-start padding，或浮出层顶层出现缩进，都会失败。                                                                                                                                                                                                                                                                              | `audit:SideNav/layout`   |
| FR3, DD1  | 在 SideNav 嵌套故事上做真实浏览器几何测量                                                                                                                                                                                                                                                                            | 深度 1–3；`sm`、`md`、`lg`；浅色与深色；从右到左；移动端抽屉                                                                                                                                                                                                                                                                                                                    | 嵌套行的盒子比顶层行更窄，或标签偏离其各深度对应的位置，都会失败。                                                                                                                                                                                                                                                                                                                                         | `audit:SideNav/layout`   |
| FR4       | 在普通、split 与 actions 行的缩进区域做真实浏览器点击                                                                                                                                                                                                                                                                | 链接行与按钮行；普通点击、带修饰键点击与中键点击；带切换开关和操作按钮的嵌套行                                                                                                                                                                                                                                                                                                  | 缩进区域的点击无反应，或与主元素上的相同点击表现不同，或切换开关、操作按钮激活了整行，都会失败。                                                                                                                                                                                                                                                                                                           | `audit:SideNav/behavior` |
| FR5, AR2  | `SideNav.test.tsx` 的分组裁剪用例，以及嵌套行上的真实浏览器键盘焦点                                                                                                                                                                                                                                                  | 独子嵌套行与最后一个嵌套行；展开后；折叠时                                                                                                                                                                                                                                                                                                                                      | 展开分组任一边缘处的焦点环被裁切，或展开的分组仍然裁剪内容，都会失败。                                                                                                                                                                                                                                                                                                                                     | `audit:SideNav/a11y`     |
| FR2, FR3  | 真实浏览器下的折叠轨道与浮出                                                                                                                                                                                                                                                                                         | 带嵌套子项的折叠轨道                                                                                                                                                                                                                                                                                                                                                            | 折叠轨道发生任何变化，或浮出层顶层出现缩进，都会失败。                                                                                                                                                                                                                                                                                                                                                     | `audit:SideNav/layout`   |
| AR1       | 嵌套行的无障碍树对比                                                                                                                                                                                                                                                                                                 | 普通、split 与 actions 行                                                                                                                                                                                                                                                                                                                                                       | 角色、名称、状态或顺序发生任何变化都会失败。                                                                                                                                                                                                                                                                                                                                                               | `audit:SideNav/a11y`     |
| FR6       | `SideNavRailMotion.test.tsx`；`SideNavRailMotion.interaction.browser.spec.ts` 中手指与鼠标下的一次折叠与一次展开、以及长任务之后第二次点击的逐帧记录（`reducedMotion: 'always'` 主题用例，以及一个在折叠开始后超过一帧才启动的长任务，待定）；`SideNav.test.tsx` 的 “keeps its items mounted across a collapse” 套件 | 折叠与展开；鼠标与手指；粗粒度与细粒度主指针下的 Reduce Motion；`reducedMotion: 'always'` 主题；动画运行期间的第二次切换，以及长任务之后的第二次切换；应用在轨道首次绘制之前与之后的改动，以及轨道自身在此之前发生的切换；跨越一次折叠与一次展开的已打开嵌套分组，普通与 `resizable`                                                                                            | 出现动画宽度、折叠结束时未停在仅图标状态、展开结束时未带上其标签、轨道副本可被辅助技术访问或动画结束后仍残留、反向动画的淡入淡出起始于其边缘之后、Reduce Motion 下仍有位移、在粗粒度指针的 Reduce Motion 下出现除 200 ms 及以内仅透明度变化之外的任何变化（DR2），或在细粒度指针的 Reduce Motion 下出现任何动画属性（DR3），都会失败。跨越一次折叠与一次展开时嵌套分组被关闭，或条目状态被重置，也会失败。 | `audit:SideNav/behavior` |
| AR3       | `SideNav.test.tsx` 的折叠焦点套件；`SideNavCollapseFocus.a11y.chromium.spec.ts`；缺口：一条既没有折叠切换开关、也没有任何被保留行的轨道没有目标位置，因此那里的焦点仍会落到页面上                                                                                                                                    | 在无图标行上聚焦，分别带与不带切换开关，也包括在可调整大小的 SideNav 中；不带切换开关时聚焦嵌套行与被保留行的操作按钮；带切换开关时聚焦被保留行中被替换的链接；可调整大小的 SideNav 中的页脚控件、切换开关，以及在调整大小手柄上按 Enter；被折叠移除的无图标标题链接；折叠轨道会丢弃其子标题的标题链接，位于可调整大小的 SideNav 中；焦点在导航之外；焦点在轨道保留的行上；展开 | 焦点落在页面主体上，移动到被保留行自身控件之外的任何位置、同名的同一个页眉或页脚控件、导航内的切换开关，或最近的被保留行（优先取前面的；若来自被移除的页眉或页脚控件或调整大小手柄，则取第一个），或发生了折叠并未夺取的焦点移动，都会失败。                                                                                                                                                               | `audit:SideNav/a11y`     |
| FR7       | `resizableSlot.test.tsx` 的 SideNav 用例                                                                                                                                                                                                                                                                             | 仅该区域；该区域带有设置 `isCollapsed` 的 `collapsible`，或与区域自身的 `collapsible` 不一致                                                                                                                                                                                                                                                                                    | 轨道忽略区域的宽度、折叠状态或 `collapsible` 选项，切换开关未命中该区域，或没有开发期警告，都会失败                                                                                                                                                                                                                                                                                                        | `audit:SideNav/behavior` |

## Decision log

<!-- Record the boundary or requirement, not how it was reached. A rejected alternative is at most one line here, kept only when it is consequential and likely to recur. -->

### DEC-1 — Nested rows are full width; depth is indent inside the row

**Reference:** `component:SideNav/DEC-1`

**Decider:** cixzhang, 2026-10-16

若嵌套行从其缩进位置开始绘制，它的填充就会与上方行从不同边缘起算，因此读起来像另一个更窄的组件。若一行横跨整个宽度、把缩进放在行内，所有填充就能对齐，每个标签也停在其各深度对应的位置。缩进属于该行的主目标区域，因此它既有行为也会点亮。整行宽的条目会触及嵌套分组的边缘，所以展开的分组不得裁剪它们，否则其焦点环会被裁掉。

已否决：从行外对整个嵌套分组做缩进，因为那样填充会在每个深度从不同边缘起算。

### DEC-2 — The rail collapses by snap, clip, and cross-fade

**Reference:** `component:SideNav/DEC-2`

**Decider:** `cixzhang`, `2026-10-27`

让轨道宽度做动画会让整个外壳在每一帧重新布局。把布局直接吸附到最终宽度、用裁剪显露或遮盖轨道，并让内容新旧换行在同一时钟上交叉淡入淡出，则只移动合成层，轨道也会停在其真实的折叠状态。

已否决：对轨道宽度做动画。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤，或家族/系统规则。它链接到这些内容的归属方。
