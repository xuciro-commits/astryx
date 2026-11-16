---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [accessibility, behavior, layout, public-api, theming]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx,
    packages/core/src/DropdownMenu/__tests__/DropdownMenuDrillIn.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/MenuPress.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/DropdownMenuTouchPress.interaction.browser.spec.ts,
    packages/core/src/DropdownMenu/__tests__/MenuHeaderFooter.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/SubMenuHeaderFooter.a11y.chromium.spec.ts,
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: [module:DropdownMenu/useMenuPress, module:DropdownMenu/useMenuHover]
families: [family:overlay-dismissal, family:navigation-destinations]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:layer-runtime,
  ]
contributing: []
system_specs: [spec:AST-020/FR15, spec:AST-094, spec:AST-102]
---

# DropdownMenu component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 无变更。DropdownMenu 接受 `button`（Button props）或 `renderTrigger`、数据驱动的 `items` 或复合 children、`presentation`、`isMenuOpen` 与 `onOpenChange`、放置与对齐、`menuMaxHeight`、`header` 与 `footer`。                                                       |
| Behavior                | Menu Button 触发器打开一个锚定的指针菜单或一个底部抽屉动作列表。行在共享按压模型下于释放时执行；子菜单在其行旁飞出，或在紧凑触摸显示器上钻入；header 或 footer 会让指针 popover 成为围绕菜单的模态对话框。                                                          |
| End-user impact         | 人们用鼠标、手指或键盘选择动作；键盘用户获得带回焦环的焦点返回，指针用户则没有；在手机上，子菜单替换行，而不是飞到屏幕外。在手指下，菜单在手指按下时打开，或在滚动视图内经过内容触摸延迟后打开；它不从其触发器生长，外部的平移不会将其关闭。                        |
| Builder impact          | 构建者选择触发器、行和区域；行始终是菜单项，每个非条目控件都放在 `header` 或 `footer` 中。                                                                                                                                                                          |
| Compatibility/readiness | 记录已发布行为；无 API 变更；禁用的行获得 `tabindex="-1"`；手指下的释放行为按 `spec:AST-094` FR25 所列移动，`presentation="popover"` 保留它。触摸生长与平移关闭（FR21）、静止鼠标（FR22）以及 Trigger Button 的间隙列在 Current-state impact 中。                   |
| Review checks           | 拒绝把控件放在行之间、丢失触发器 ARIA 接线、钻入视图离开菜单框、header 或 footer 没有对话框、丢失焦点返回的模态性，或把目标移离其绘制元素。                                                                                                                         |
| Governing rules         | `spec:AST-020` FR15；`spec:AST-094` FR26–FR35；`module:DropdownMenu/useMenuPress`；`architecture:interaction-modality` INV1；`architecture:component-theming-surface`；`architecture:layer-runtime`；`family:overlay-dismissal`；`family:navigation-destinations`。 |

本表是评审用的投影，正文为准。

## Intent

DropdownMenu 从可见的触发器呈现动作，形式为锚定的指针菜单或由 BottomSheet 承载的触摸动作列表。其按压模型——释放时所在的行执行，高亮跟随指针——由 `module:DropdownMenu/useMenuPress` 约定，两种呈现方式都会挂载它。

## Compatibility and migration

- 保留已发布的默认值：手指下为 `no`：省略的 `presentation` 遵循 `spec:AST-094` FR29、FR31 和 FR32（FR8、FR21）；`presentation="popover"` 保留已发布行为（`spec:AST-094` FR25）；并且所有指针下的禁用行都为 `no`：键盘可以到达禁用的行，且该行带有 `tabindex="-1"`（FR17），这是 DEC-11 下的一项缺陷修复（所有者决策，2026-11-04）
- 兼容类：记录已发布行为；无公开 prop 或导出变更；禁用的行获得 `tabindex="-1"`（FR17）
- 受控/非受控行为：`isMenuOpen` 配合 `onOpenChange`，或非受控
- 迁移决策：`spec:AST-094` FR25 与 DEC-4

使用方迁移说明应放在使用方文档和发行说明中。

## Ownership boundary

**拥有**

- 指针菜单表面和触摸菜单表面及其共享的 `dropdown-menu` 目标。
- 指针动作行、仅指针的分节标题与分隔线、单选标记特化，以及通过其余五个 DropdownMenu 目标实现的子菜单指示器呈现。
- 在呈现策略解析之后，在指针与触摸渲染路径之间选择。
- 在两个菜单表面上以及在 Trigger 按钮上挂载共享按压模型；模型本身由 `module:DropdownMenu/useMenuPress` 拥有。
- `header` 和 `footer` 区域、围绕它们的对话框，以及钻入视图。

**不拥有 / 非目标**

- 触发器按钮的呈现——委托给 `component:Button`。
- 触摸抽屉框架——委托给 `component:BottomSheet`。
- 触摸动作列表与行呈现——委托给 `component:List`。
- 共享复选框指示器与普通图标呈现——委托给 `component:Indicator` 和 `component:Icon`。
- 每一行自身的契约——由 `component:DropdownMenuItem`、`component:DropdownMenuCheckboxItem`、`component:DropdownMenuRadioGroup`、`component:DropdownMenuRadioItem`、`component:DropdownMenuSubMenu`、`component:DropdownMenuGroup` 和 `component:DropdownMenuDivider` 拥有。
- 飞出悬停时序——由菜单悬停模块（`useMenuHover`）拥有。
- 共享层生命周期或关闭策略。

## Public concepts

使用方 props、条目形状、子组件和呈现策略仍记录在 `DropdownMenu.doc.mjs` 及子组件文档中。以下是组件局部概念；每一项都保留其已发布默认值。

| Concept      | Closed values or states                                       | Meaning                                                                                                                                       | Availability by variant/orientation/state  | Default          | Owner                    | Stability | Invalid-value behavior                             |
| ------------ | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ---------------- | ------------------------ | --------- | -------------------------------------------------- |
| 菜单高度上限 | `menuMaxHeight`：一个像素数值                                 | 为必须容纳其行的菜单解除 300px 上限；视口仍对其设限。                                                                                         | 指针呈现                                   | `300px`          | `component:DropdownMenu` | 稳定      | 触摸抽屉会忽略它。                                 |
| 触发器来源   | `button`（Button props）或 `renderTrigger`（render prop）     | 菜单挂在哪个控件上。`renderTrigger` 接收 `DropdownMenuTriggerProps`——按压模型、键盘打开、切换点击与 ARIA 接线——并命名菜单。                   | 两种呈现                                   | `button`         | `component:DropdownMenu` | 稳定      | 两者都给时：`renderTrigger` 优先，并触发开发警告。 |
| 头部与尾部   | `header`、`footer`：任意 React 节点                           | 行上方和下方的内容，与菜单同处在同一 popover 或抽屉内——绝不在 `role="menu"` 元素内部。有其一或两者时，指针 popover 就是围绕菜单的模态对话框。 | 两种呈现                                   | 无               | `component:DropdownMenu` | 稳定      | false 或空值不渲染任何区域。                       |
| 子菜单区域   | 子菜单上的 `header`、`footer`：任意 React 节点                | 子菜单行上方和下方的内容，与其菜单同处在自身表面内；有其一或两者时，该表面是由该行命名的模态对话框（FR20）。                                  | Popover 呈现                               | 无               | `component:DropdownMenu` | 稳定      | false 或空值不渲染任何区域。                       |
| 行目标       | 动作项上的 `href`（+ `target`、`rel`）                        | 行的动作是导航：行本身就是链接（`family:navigation-destinations`）。                                                                          | 指针动作行与触摸动作行，复合模式与数据模式 | 无（一个动作行） | `component:DropdownMenu` | 稳定      | 被阻止的方案遵循 family 规则；禁用的行没有目标。   |
| 子菜单呈现   | 子菜单行上的 `presentation`：`flyout`、`drill-in`、`adaptive` | 子菜单是在其行旁打开，还是在同一框内用自身的行加一条 Back 行替换菜单的行。当紧凑触摸显示器打开了菜单时，`adaptive` 会钻入。                   | 指针呈现，复合模式与数据模式               | `adaptive`       | `component:DropdownMenu` | 稳定      | 未知值按 `adaptive` 读取。                         |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Basis                                                                   |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| FR1  | 每次渲染都包含一个 Trigger 按钮。指针呈现渲染一个 Pointer 菜单表面，其中包含指针拥有的行以及可选的指针分节标题、分隔线、指示器和嵌套飞出。触摸呈现渲染一个 Touch 抽屉框架，其中包含 Touch 菜单表面、Touch 分节标题、Touch 动作列表和触摸动作行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源代码、文档和测试                                                  |
| FR2  | 六个局部目标是 `dropdown-menu`、`dropdown-menu-item`、`dropdown-menu-radio`、`dropdown-menu-section-heading`、`dropdown-menu-divider` 和 `dropdown-menu-indicator-icon`；每个目标都留在其绘制元素上。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | `architecture:component-theming-surface`；当前源代码                    |
| FR3  | Button 拥有 Trigger 按钮，BottomSheet 拥有 Touch 抽屉框架，List 拥有触摸动作列表与触摸动作行，Indicator 拥有复选框外观，Icon 拥有普通渲染图标。Trigger 按钮带有 `component:Button` 的间隙：其按压缩放在减少动态效果下生效（`design:reduced-motion` DR1），其高度固定（`spec:AST-102` FR4）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源代码与所有者文档；`design:reduced-motion` DR1；`spec:AST-102` FR4 |
| FR4  | 同一个 `dropdown-menu` 目标到达替代的 Pointer 菜单表面与 Touch 菜单表面。指针动作行带有 `dropdown-menu-item`；触摸动作行则改用 List 的 `list-item` 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源代码与测试                                                        |
| FR5  | 两个菜单表面都带有 `data-astryx-menu-press`，并遵循 `module:DropdownMenu/useMenuPress` FR1–FR7、FR10 和 FR11：释放时所在的行执行，按住指针时高亮跟随，鼠标在外部释放则关闭，手指离开后菜单保持打开，浏览器的杂散点击从不执行，Pointer 菜单表面按溢出声明 `touch-action`。手指下的生长、塌缩与平移关闭见 FR21。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | `module:DropdownMenu/useMenuPress`；`spec:AST-094` FR26–FR28            |
| FR6  | 当指针菜单关闭时，仅在菜单由键盘驱动时焦点才返回 Trigger 按钮并带有可见焦点环；指针选择之后，返回的焦点不打开触发器工具提示（`component:Tooltip` FR4）；落在可聚焦控件上的外部按压会让焦点留在那里。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `architecture:interaction-modality` INV1；DEC-1                         |
| FR7  | `menuMaxHeight` 替换菜单及其 popover 视口块尺寸上限中的 300px 项，同时视口边距仍对两者设限；触摸抽屉忽略它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | DEC-2                                                                   |
| FR8  | Trigger 按钮在鼠标按下时打开指针菜单，并在打开的释放时应用稳定规则；按压已打开菜单的触发器会将其关闭，且在同一手势中不会重新打开；鼠标点击和键盘照旧打开。鼠标按压打开是已发布行为，在 `module:DropdownMenu/useMenuPress` DEC-4 被裁定前不是一项需求。在手指下，触发器必须按 `spec:AST-094` FR29 所述打开菜单：在固定栏中手指按下时打开，在滚动视图内经过 150 ms 内容触摸延迟后或轻触抬起时打开；`presentation="popover"` 保留轻触打开。                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `module:DropdownMenu/useMenuPress` FR8、FR9；`spec:AST-094` FR29        |
| FR9  | 使用 `renderTrigger` 时，渲染出的控件带有 `aria-haspopup`、`aria-expanded`、`aria-controls` 以及菜单的 `aria-labelledby` 所指向的 `id`，并接收与 Button 路径相同的按压模型、键盘打开和切换点击处理程序；菜单由该控件命名。禁用的自定义触发器绝不打开菜单或抽屉。`button` 与 `renderTrigger` 互斥：两者都给时，`renderTrigger` 优先并触发开发警告，在两种呈现中都是如此。钻入的 Back 行（FR11）按同一名称返回菜单：给出时用调用方的 `aria-label`，否则用控件的可访问名称，在菜单打开时读取。                                                                                                                                                                                                                                                                                                                                                                                                                     | DEC-3                                                                   |
| FR10 | 带有 `href` 的动作行渲染为一个锚点，承载 `role="menuitem"`（指针菜单）或触摸抽屉的链接行，并经由 `LinkProvider` 路由；普通点击先运行 `onClick`，然后关闭菜单（`hasCloseOnSelect`），再让浏览器导航；带修饰键的点击不运行 `onClick`，关闭菜单，并交给浏览器；在指针菜单中，中键点击关闭菜单（`hasCloseOnSelect`），然后运行调用方的 `onAuxClick`，而触摸抽屉把中键点击留给浏览器并保持打开；右键点击留给上下文菜单；Enter 和 Space 通过携带按键修饰符的合成点击激活。禁用的链接行没有 `href`；被阻止的目标以惰性方式渲染。                                                                                                                                                                                                                                                                                                                                                                                       | 当前行为；`family:navigation-destinations`                              |
| FR11 | 当紧凑触摸显示器打开了指针菜单时（根呈现用于其底部抽屉的查询，在打开时采样一次），`adaptive` 子菜单行会钻入：其行与一条名为 “Back to <parent>” 的前置 Back 行在同一 Pointer 菜单表面中替换菜单的行，不打开飞出，钻入的列表是一个由该行标签命名的 `menu`，且 Back、Escape 与 ArrowLeft 返回该行并将焦点放在其上；其中的一次选择关闭整个菜单，关闭菜单会重置钻入视图。漫游焦点与类型前导的范围限定为所显示的行；同级行与分隔线无需知晓它。`presentation="flyout"` 保留飞出；`"drill-in"` 在任何指针上都会钻入。                                                                                                                                                                                                                                                                                                                                                                                                   | DEC-4；`spec:AST-094` FR34                                              |
| FR12 | 在指针菜单中，最后一行上的 ArrowDown 回绕到第一行，第一行上的 ArrowUp 回绕到最后一行；PageDown 与 PageUp 移动到最后一个和第一个完全可见的行，再次在那里按下时再移动一个视口而不回绕；禁用的行对这些键中的每一个都算作行（FR17）；触发器上的 ArrowUp 以高亮最后一行启用的行打开；打开菜单的按键及其自动重复不会激活；类型前导只匹配行的标签元素，并忽略 Control/Command 组合键与输入法组合。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源代码与测试                                                        |
| FR13 | 在鼠标上，嵌套飞出在指针位于从它离开所在行到飞出近边的三角形内期间保持打开——包括指针在该处暂停时——并在指针离开该行与该三角形之后，经过既有延迟后关闭。该行的点击切换及其防护窗口不变。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前行为                                                                |
| FR14 | 复合组遵循 `component:DropdownMenuGroup`；数据模式下的 `{type: 'section'}` 条目是一个由其标题命名的 `role="group"`，无标题的分节渲染其行而不带分节标题。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | DEC-6；当前测试                                                         |
| FR15 | 有 `header` 或 `footer` 时，指针 popover 是一个 `role="dialog"` 且 `aria-modal="true"`，像菜单一样命名，容纳 header、然后是 `role="menu"` 元素、再是 footer；菜单元素只容纳其行。触发器声明 `aria-haspopup="dialog"`，其 `aria-controls` 命名容纳该对话框的 popover。区域保留自己的按键与按压：菜单的按键处理与按压模型都不会认领从那里开始的事件。菜单是两个区域之间的一个 Tab 停靠点。Tab 与 Shift+Tab 依次经过 header 的控件、菜单、再是 footer 的控件，并在两端回绕；被隐藏的控件，或在其区域内处于隐藏祖先之下的控件，不算停靠点。从某一行或某个打开的子菜单的行开始，Tab 与 Shift+Tab 会关闭每个打开的飞出，并从菜单的停靠点继续。没有其他停靠点时，焦点留在菜单中。Escape 可从 popover 内任意位置关闭，焦点返回触发器。底部抽屉本身已是对话框，在动作上方显示 header，在其下方显示 footer。没有这两个 prop 时，菜单的渲染与行为与没有它们时完全一致：无对话框、`aria-haspopup="menu"`，且 Tab 关闭菜单。 | DEC-8、DEC-10                                                           |
| FR16 | 复选框行遵循 `component:DropdownMenuCheckboxItem`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源代码                                                              |
| FR17 | 禁用的菜单行必须能被键盘到达并保持惰性（DEC-11）：在 DropdownMenu、其子菜单、MoreMenu、ContextMenu 与 NavHeadingMenu 中，ArrowDown、ArrowUp、Home、End 和类型前导会像访问任何其他行一样访问禁用的行，该行取得焦点并暴露 `aria-disabled="true"`，而 Enter、Space 或对其点击不做任何事，并让菜单保持打开。从键盘打开菜单时仍落在启用的行上：第一行，或在触发器上按 ArrowUp 之后的最后一行（FR12、AR4）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | DEC-11；WAI-ARIA Menu 模式                                              |
| FR20 | 在子菜单（`DropdownMenuSubMenu`）上设置 `header` 或 `footer` 时，其表面是一个由其行命名的模态对话框（AR7），容纳 header、子菜单的 `role="menu"`（仅行）、然后是 footer。它位于宿主 `DropdownMenu` 于其菜单旁渲染的容器中，绝不在菜单内部；在没有此类宿主的根（`ContextMenu`）下，子菜单仅显示其行。在精细指针上，该对话框就是飞出；在紧凑触摸显示器上，则是钻入视图，它替换根的菜单与区域直到被弹出。区域保留自己的按键与按压。行是一个 Tab 停靠点：Tab 与 Shift+Tab 依次走 header 的控件、行、再是 footer 的控件，并回绕；从更深的飞出中，该飞出关闭，行走从行继续。打开时的落点与任何子菜单相同（FR11、FR12），而不是落在区域上。对话框中的 Escape，在输入法组合之外且除非那里的某个控件已处理它，会将焦点返回该行并让根保持打开。指针离开飞出时保持其打开直到焦点离开，并且它随飞出一起关闭并保留其行。没有这两个 prop 时什么都不变。                                                                        | 当前行为；FR15；AR5                                                     |
| FR21 | 在手指下，在触摸模式中（`presentation` 未固定为 `'popover'`），指针菜单必须按主题的进入时长与缓动 token 从 Trigger 按钮生长出来，并按主题的退出时长与缓动塌缩回去（`spec:AST-094` FR7、FR31、FR45），且必须在其外部开始的平移开始时关闭（FR32）；固定的 `'popover'` 保留层自身的进入。平移关闭即菜单自身的关闭：原本在菜单中的焦点返回 Trigger 按钮，其 `aria-expanded` 变为 false。鼠标保留层自身的进入与退出。实现缺口：在手指下菜单同样保留层自身的进入与退出，且自身没有外部平移关闭。                                                                                                                                                                                                                                                                                                                                                                                                                      | `spec:AST-094` FR31、FR32；`family:overlay-dismissal` AV6               |
| FR22 | 在手指下，在触摸模式中，当主指针为粗略指针（手机或平板）时，在指针菜单进入期间落下的轻触或拖拽必须不触达任何东西：它不关闭任何东西、不滚动、不移动焦点、不点击任何东西（`spec:AST-094` FR35）。打开菜单的手指仍然选择它抬起时所在的行（FR8）。按键与辅助技术保持可用。鼠标、固定的 `'popover'`，以及主指针为精细指针的手指（触摸屏笔记本电脑）都不拦截任何东西，如同 `component:Drawer`。实现缺口：在手指之后，静止鼠标的第一次按压会落在正在进入的菜单的护盾上，除非在护盾升起时鼠标停留在页面最后听到它的位置（`spec:AST-094` FR35）。                                                                                                                                                                                                                                                                                                                                                                        | `spec:AST-094` FR35；`architecture:layer-runtime`                       |
| FR23 | 在没有 `header` 或 `footer` 的菜单中，于任意层级的行上按 Tab 或 Shift+Tab，或在任意深度的其自身行或某个打开的飞出子菜单上按下，会关闭每个打开的层级和菜单，调用一次 `onOpenChange(false)`，并让焦点从触发器按页面顺序继续移动（WAI-ARIA Menu Button）。带有 header 或 footer 的层级保留 FR15 与 FR20 的在其内部循环的 Tab。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | WAI-ARIA Menu Button 模式；当前测试                                     |

### Allowed variation

- **AV1 — 呈现方式。** `popover`、`bottom-sheet` 和解析后的 `adaptive` 呈现可以选择指针或触摸结构，而不改变任一分支的所有权。
- **AV2 — 内容模式。** 数据驱动与复合指针菜单可以改变其行，同时保留目标所有者。触摸呈现仍为数据驱动。
- **AV3 — 可选内容。** 图标、可选指示器、分节标题、分隔线和嵌套动作仅在所提供的菜单内容需要它们时渲染。

### Representative states

| State            | Required invariant                                                                   | Allowed variation                                 |
| ---------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------- |
| 锚定根菜单       | 触发按钮与 Pointer 菜单表面渲染，并带有指针拥有的行。                                | 宽度、放置、对齐与可选条目内容可变。              |
| 锚定嵌套飞出     | 指针动作行打开另一个 Pointer 菜单表面，并可显示子菜单指示器图标。                    | 加载时可用 Spinner 替换指示器。                   |
| 钻入子菜单       | Pointer 菜单表面先显示一条 Back 行，再显示子菜单的行；父行被隐藏而非卸载。           | 深度；哪个指针打开了菜单；强制的 `presentation`。 |
| 底部抽屉根动作   | 触发按钮打开 Touch 抽屉框架、Touch 菜单表面、分节标题、动作列表和动作行。            | 图标、分节、分隔线和动作描述可变。                |
| 底部抽屉嵌套动作 | 相同的框架与列表所有者保持不变，而分节标题与行切换到所选的动作层级。                 | Back 控件与钻入指示器跟随导航。                   |
| 可选指针动作     | 指针动作行可包含共享复选框或单选外观。                                               | 选中与禁用状态遵循条目契约。                      |
| 自定义触发器菜单 | 调用方的控件承载触发器 ARIA 并命名菜单；Pointer 菜单表面不变。                       | 任意可聚焦控件：图标按钮、chip、头像、列表行。    |
| 链接行           | Pointer 动作行（或触摸动作行）即锚点；普通点击时 `onClick`、关闭与导航按此顺序运行。 | `target`、`rel`、图标、描述与破坏性变体可变。     |
| 头部或尾部       | popover 是一个命名的模态对话框，容纳 header、菜单和 footer；Tab 回绕。               | 区域内容。                                        |

### Transformation and precedence order

- **ORD1 — 链接行激活。** 带修饰键的点击 → 不执行 `onClick`，关闭（`hasCloseOnSelect`），浏览器打开它；否则 `onClick` → 关闭（`hasCloseOnSelect`）→ 浏览器导航。
- **ORD2 — 触发器来源。** `renderTrigger` → `button`。

### Performance and resources

- **PR1 — 资源有界。** 打开期间，指针菜单观察自身的尺寸与内容变化，并监听窗口与视觉视口的尺寸变化以及图片加载，以决定是否滚动。按压打开——无论是鼠标按压还是按住的手指——会在按压持续期间添加 document 的 pointer-up 与 pointer-cancel 监听器。使用 `presentation="adaptive"` 时，根组件在挂载期间订阅紧凑触控查询；下钻视图在菜单打开时读取一次该查询。

## Accessibility contract

按住指针期间，高亮就是 DOM 焦点，依据 `module:DropdownMenu/useMenuPress` AR1。关闭时的焦点返回遵循 FR6 与 `architecture:interaction-modality` INV1，经由共享的焦点返回可见性辅助函数。

- **AR1 — 自定义触发控件仍为菜单命名。** 使用 `renderTrigger` 时，菜单带有指向控件 `id` 的 `aria-labelledby`（Button 路径保留 `aria-label`），控件则带有 `aria-haspopup="menu"`、`aria-expanded` 与 `aria-controls`。
- **AR2 — 会导航的行是链接元素。** 带 `href` 的行本身就是锚点：在指针菜单中它保留 `role="menuitem"`，使菜单仍是一个菜单，而带修饰键的点击或 Enter 保留浏览器的链接语义；在底部面板中该行是普通链接；禁用的链接行不可激活。
- **AR3 — 下钻的子菜单仍是一个菜单。** 在紧凑触控显示屏上，子菜单在同一个菜单框内用一行“Back to <parent>”加上自己的行替换原有的行；键盘打开后焦点落在 Back 之后的第一个可用行，指针打开后焦点落在下钻列表（即 `menu`）上；Back、Escape 或 ArrowLeft 返回父视图并恢复焦点。
- **AR4 — 锚定的触发控件采用 APG Menu Button 模式必需的部分**（`spec:AST-020/FR15`）：打开锚定指针菜单的控件是一个 `button`，具有可访问名称、`aria-haspopup="menu"`、反映菜单状态的 `aria-expanded`，以及为它命名的 `aria-controls`；Enter 或 Space 打开菜单，焦点落在第一个可用行。作为该规则下的具名例外，触发控件还可由 ArrowDown（焦点落在第一个可用行）与 ArrowUp（焦点落在最后一个可用行）打开，即该组件已经发布的键盘行为（DEC-9）。`renderTrigger` 控件通过展开属性接收 `aria-haspopup`、`aria-expanded`、`aria-controls`，以及键盘与焦点处理程序（FR9）；调用方控件自行提供 `button` 角色与可访问名称。底部面板呈现方式，以及带 `header` 或 `footer` 的指针菜单，不在此模式范围内：它们的触发控件打开一个对话框，并声明 `aria-haspopup="dialog"`（AR5）。
- **AR5 — 带 header 或 footer 时，指针浮层采用 APG Dialog（Modal）模式必需的部分**（`spec:AST-020/FR15`）：`role="dialog"`、`aria-modal="true"`，以及一个可访问名称，即菜单的名称；打开时焦点移入对话框，落到菜单或其第一个可用行，正如 FR6 与 FR12 所述；Tab 与 Shift+Tab 在其中循环（FR15）；Escape 关闭它，焦点返回触发控件。内部的菜单保留 AR1–AR3。触发控件保留 `aria-expanded`；其 `aria-haspopup` 声明 `dialog`，其 `aria-controls` 指向承载该对话框的浮层而非菜单，正如 Popover 自身的触发控件所做的那样。
- **AR6 — 禁用的行是惰性的。** 禁用的行不运行调用方的激活处理程序，也不关闭菜单；FR17 记录了键盘可以到达它。
- **AR7 — 带 header 或 footer 的子菜单为其自身表面采用同样的 APG Dialog（Modal）部分**（`spec:AST-020/FR15`）：`role="dialog"`、`aria-modal="true"`，以及一个可访问名称，即其行的名称；打开时焦点移入对话框，落到子菜单的第一个可用行或其菜单，正如 FR11 与 FR12 所述；Tab 与 Shift+Tab 在其中循环（FR20）；Escape 关闭它，焦点返回该行。内部的子菜单菜单保留 AR3。该行保留 `aria-expanded`；其 `aria-haspopup` 声明 `dialog`，其 `aria-controls` 指向该对话框。

## Design relationships

| 解剖结构或状态           | 设计要求                                         | 表现权威                | 层级角色     | 组件契约      |
| ------------------------ | ------------------------------------------------ | ----------------------- | ------------ | ------------- |
| 触发按钮                 | 提供用于打开和关闭所选呈现方式的可见控件。       | `component:Button`      | 支撑         | FR1, FR3      |
| 触发指示图标             | 启用时在带标签的触发控件上传达可展开性。         | `component:Icon`        | 支撑         | FR1, FR3      |
| 指针菜单表面             | 绘制锚定的根菜单或嵌套的指针菜单面板。           | 当前源码与公开文档      | 显著         | FR1, FR2, FR4 |
| 指针操作行               | 呈现一个操作、一个可选选项或一个嵌套菜单项。     | 当前源码与公开文档      | 显著         | FR1, FR2, FR4 |
| 以 Icon 渲染的项图标     | 通过 Icon 为操作行添加可选的语义图标或组件图标。 | `component:Icon`        | 支撑         | FR1, FR3      |
| 由调用方渲染的项起始内容 | 直接在操作行的起始插槽中呈现任意 React 内容。    | 调用方提供的内容        | 视上下文而定 | FR1, FR3      |
| 复选框指示器             | 为复选框操作行绘制装饰性的复选框状态。           | `component:Indicator`   | 支撑         | FR1, FR3      |
| 单选按钮指示器           | 以当前菜单专用的单选目标绘制共享的单选外观。     | 当前源码与 Indicator    | 支撑         | FR1, FR2, FR3 |
| 指针分区标题             | 为一组指针操作行提供标签。                       | 当前源码与公开文档      | 支撑         | FR1, FR2      |
| 指针分隔线               | 分隔各组指针操作行。                             | 当前源码与公开文档      | 支撑         | FR1, FR2      |
| 指针子菜单指示图标       | 标识会打开嵌套浮出层的指针操作行。               | 当前源码与公开文档      | 支撑         | FR1, FR2      |
| 触控面板框架             | 提供触控面板、滚动区域、把手以及可选的遮罩。     | `component:BottomSheet` | 显著         | FR1, FR3      |
| 触控菜单表面             | 在面板内排布菜单自有的标题与操作内容。           | 当前源码与公开文档      | 显著         | FR1, FR2, FR4 |
| 触控标题                 | 为当前根视图或下钻操作视图命名。                 | 当前源码与测试          | 支撑         | FR1           |
| 触控操作列表             | 使用宽松的 List 呈现方式对触控操作进行分组。     | `component:List`        | 显著         | FR1, FR3      |
| 触控操作行               | 使用 ListItem 呈现一个触控操作或下钻入口。       | `component:List`        | 显著         | FR1, FR3, FR4 |
| 触控分隔线               | 分隔触控操作列表中的各组。                       | `component:Divider`     | 支撑         | FR1, FR3      |

`dropdown-menu` 目标有意出现在两种备选菜单表面上。单选元素还携带 Indicator 的共享单选目标，指针分隔线还携带 Divider 的目标；它们的本地目标仍是有效且彼此不同的契约。触控标题保留 Text 记录的共享 `heading` 目标，而不是新增一个 DropdownMenu 自有的标题目标。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Trigger indicator icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Pointer menu surface": {"target": "dropdown-menu"},
  "Pointer action row": {"target": "dropdown-menu-item"},
  "Icon-rendered item icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Caller-rendered item start content": {
    "none": {
      "reason": "intentional: Arbitrary ReactNode item content is caller-owned and receives no DropdownMenu target."
    }
  },
  "Checkbox indicator": {
    "delegatesTo": {
      "owner": "component:Indicator",
      "target": "checkbox-indicator"
    }
  },
  "Radio indicator": {"target": "dropdown-menu-radio"},
  "Pointer section heading": {"target": "dropdown-menu-section-heading"},
  "Pointer divider": {"target": "dropdown-menu-divider"},
  "Pointer submenu indicator icon": {
    "target": "dropdown-menu-indicator-icon"
  },
  "Touch sheet frame": {
    "delegatesTo": {"owner": "component:BottomSheet", "target": "bottom-sheet"}
  },
  "Touch menu surface": {"target": "dropdown-menu"},
  "Touch heading": {
    "delegatesTo": {"owner": "component:Text", "target": "heading"}
  },
  "Touch action list": {
    "delegatesTo": {"owner": "component:List", "target": "list"}
  },
  "Touch action row": {
    "delegatesTo": {"owner": "component:List", "target": "list-item"}
  },
  "Touch divider": {
    "delegatesTo": {"owner": "component:Divider", "target": "divider"}
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格判定、本地目标映射、呈现方式专属行以及委托规则。
- `architecture:interaction-modality` 拥有共享的指针、触控、键盘与自适应呈现方式边界。
- `architecture:layer-runtime` 拥有浮层宿主、原生轻取消的对账、锚点定位与嵌套浮出层。触控呈现方式把宿主委托给 BottomSheet。
- `family:overlay-dismissal` 拥有共享的 Escape 与平台关闭顺序。DropdownMenu 根通过其浮层焦点陷阱参与；组合的 BottomSheet 与 DropdownMenuSubMenu 保留其已记录的仅本地采用的缺口。
- `family:navigation-destinations` 拥有链接行目标与受阻止的 scheme（FR10）。
- `spec:AST-094` 拥有触控按压、打开、生长、进入与取消规则（FR5、FR8、FR11、FR21、FR22）。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 代表性状态                                                            | 变异或失败预期                                                                                                                                                                                                          | 审计章节                           |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| FR1, FR4         | `DropdownMenu.test.tsx` 渲染用例（"renders menu with role=\"menu\"", "renders data-driven actions in a bottom sheet when requested", "uses the BottomSheet for adaptive presentation on compact touch", "uses the shared menu BottomSheet frame", "keeps adaptive presentation anchored without compact touch"）以及分区、分隔线与复合用例                                                                                                                                                                               | 根部指针、根部触控、自适应                                            | 缺少表面、面板框架或菜单角色即失败。证据缺口：没有测试断言触控菜单表面上的 `dropdown-menu` 目标，或触控行上的 `list-item`。                                                                                             | `audit:DropdownMenu/anatomy`       |
| FR2              | `DropdownMenu.test.tsx` 主题插槽用例（"exposes a themeable slot on the section heading", "exposes a themeable slot on the menu divider"）；`DropdownMenuSubMenu.test.tsx` "exposes a themeable slot on the submenu indicator icon"；`themingTargets.test.ts`                                                                                                                                                                                                                                                             | 标题、分隔线、子菜单指示器                                            | 缺少标题、分隔线或指示器目标即失败；渲染出的类不在已记录的目标中即失败。证据缺口：没有测试断言 `dropdown-menu`、`dropdown-menu-item` 或 `dropdown-menu-radio` 的落位。                                                  | `audit:DropdownMenu/theming`       |
| FR3              | `DropdownMenu.test.tsx` 按钮定制、仅图标与 hasChevron 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Button 的变体与尺寸；仅图标；无 chevron                               | 某个 Button 属性不再传递到触发控件即失败。证据缺口：委托的 Trigger Button 缺口由 `component:Button` 自身的记录断言，这里没有测试断言渲染之外的 BottomSheet、List、Indicator 或 Icon 委托。                              | `audit:DropdownMenu/theming`       |
| FR5              | `DropdownMenu.test.tsx` 按压模型用例（"a finger that lands on one row and lifts on another acts on the second, once", "a mouse released outside closes the menu; a finger released outside leaves it open", "marks the menu as carrying the press model and owns touch scrolling"）；`MenuPress.a11y.chromium.spec.ts`；该模块记录自身的映射表                                                                                                                                                                           | 手指与鼠标释放；可滚动的菜单                                          | 在按下时即执行的行、在外部松开鼠标却保持菜单、缺少按压标记，均失败。                                                                                                                                                    | `audit:DropdownMenu/behavior`      |
| FR6              | `DropdownMenu.test.tsx` 焦点返回用例（"restores focus to the trigger after keyboard dismissal", "returns focus to the trigger after pointer dismissal without a focus ring", "leaves focus on the control a press outside landed on"）以及 "focus return after a pointer pick" 与 "a trigger the caller renders" 用例                                                                                                                                                                                                    | 键盘与指针关闭；Button 与自定义触发控件                               | 丢失焦点返回、指针关闭后出现焦点环、键盘关闭后没有焦点环，或焦点被从外部按压落到的控件上拉走，均失败。                                                                                                                  | `audit:DropdownMenu/accessibility` |
| FR7              | `DropdownMenu.test.tsx` menuMaxHeight 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 高于 300px 的上限；视口边界                                           | 在提高上限后仍被裁到 300px 的菜单，或越出视口的菜单，均失败。证据缺口：没有测试断言触控面板忽略该上限。                                                                                                                 | `audit:DropdownMenu/layout`        |
| FR8              | `DropdownMenu.test.tsx` 按压模型触发用例（"a mouse press on the trigger opens the menu and a drag-release acts on the row under it", "the opening release before the settle time acts on nothing and the menu stays", "pressing the trigger of an open menu closes it and does not reopen it in the same gesture", "under a coarse pointer a finger opens the menu as it presses the trigger (no scroll view), and a slide picks", "a tap on the trigger opens the menu on the press, and its click does not close it"） | 鼠标按压打开；按住的手指；轻点                                        | 只在点击时打开的鼠标、过早执行的打开松开、在关闭手势中重新打开，均失败。等待长按的手指按压，或轻点后其点击把按压打开的菜单切换掉的，也失败。                                                                            | `audit:DropdownMenu/behavior`      |
| FR8              | `DropdownMenuOpeningRelease.interaction.browser.spec.ts`（Chromium、WebKit）：在触发控件之外的打开松开、在移开的触发控件下的打开松开，或在一次等待过的显示之后落在触发控件上的打开松开，都让菜单保持打开；在外部已稳定的松开则关闭它                                                                                                                                                                                                                                                                                     | 触发控件之外的鼠标释放                                                | 在稳定时间之前发生、被浏览器轻取消关闭的打开松开，失败                                                                                                                                                                  | `audit:DropdownMenu/behavior`      |
| FR9, AR1         | `DropdownMenu.test.tsx` 自定义触发控件用例；`DropdownMenuSubMenu.test.tsx` "a menu hung off a custom trigger" 用例                                                                                                                                                                                                                                                                                                                                                                                                       | 自定义触发控件打开、键盘、鼠标、禁用；同时给出两个属性；Back 行的命名 | 不打开、不切换或不命名菜单的自定义触发控件，会打开菜单的禁用触发控件，缺少警告，或 Back 行名称错误，均失败。                                                                                                            | `audit:DropdownMenu/accessibility` |
| FR10, AR2, ORD1  | `DropdownMenu.test.tsx` "DropdownMenuItem href" 与 "link rows — the browser's own clicks" 用例                                                                                                                                                                                                                                                                                                                                                                                                                           | 普通、带修饰键、中键与右键点击；Enter；底部面板；禁用；受阻止         | 不是锚点的行、运行 `onClick` 的带修饰键点击、不关闭的中键点击、带地址的禁用行，或仍可用的受阻止目标，均失败。证据缺口：没有测试断言 `onClick`、关闭与导航的顺序。                                                       | `audit:DropdownMenu/behavior`      |
| FR11, AR3        | `DropdownMenuSubMenu.test.tsx` "drill-in on a phone" 用例；`DropdownMenuDrillIn.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                   | 手机与笔记本；强制呈现方式；主题断点；关闭时重置                      | 手机上出现浮出层、笔记本上默认出现下钻、名称错误、丢失焦点的 Back，或在关闭后仍保留的下钻视图，均失败。                                                                                                                 | `audit:DropdownMenu/accessibility` |
| FR12, AR4        | `DropdownMenu.test.tsx` 键盘用例（"ArrowDown on the last row wraps to the first, ArrowUp on the first to the last", "ArrowUp on the trigger opens with the last row highlighted", "PageDown moves to the last row and PageUp back to the first", "the opening key's auto-repeat does not act on the highlighted row"）、打开焦点用例、类型提前匹配用例，以及 "has aria-haspopup and aria-expanded attributes"                                                                                                            | 环绕、Page 键、打开键、自动重复、类型提前匹配                         | 缺少环绕、Page 键不移动、在第一行上用 ArrowUp 打开、自动重复被执行，或缺少类型提前匹配，均失败。证据缺口：没有测试断言越过可见行的 PageDown、忽略和弦与组合输入的类型提前匹配，或 Button 触发控件上的 `aria-controls`。 | `audit:DropdownMenu/accessibility` |
| FR13             | `DropdownMenuSubMenu.test.tsx` 安全三角形用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 对角线路径、在其中停顿、离开两者                                      | 在三角形内关闭的浮出层，或离开后仍保持打开的浮出层，失败。                                                                                                                                                              | `audit:DropdownMenu/behavior`      |
| FR14             | `DropdownMenu.test.tsx` 分区用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 有标题与无标题的分区                                                  | 缺少组角色或标题即失败。                                                                                                                                                                                                | `audit:DropdownMenu/accessibility` |
| FR15, AR5        | `DropdownMenu.test.tsx` header 与 footer 用例，包括隐藏控件、已打开子菜单与 header 单选组用例；`MenuHeaderFooter.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                  | 区域存在与缺失；隐藏控件；已打开的浮出层；自定义触发控件；底部面板    | 区域落在菜单内部、缺失或未命名的对话框、错误的 `aria-haspopup`、离开浮层的 Tab、被当作 Tab 停靠点的隐藏控件，或按键被菜单接管的区域，均失败。                                                                           | `audit:DropdownMenu/accessibility` |
| FR17, AR6        | DropdownMenu、MoreMenu、ContextMenu 与 NavHeadingMenu 的键盘测试，加上对焦点顺序与受阻止激活的真实浏览器键盘检查，以及真实浏览器可访问性树检查：聚焦的禁用行被宣布为禁用（`spec:AST-085` Platform support）；禁用行用例                                                                                                                                                                                                                                                                                                  | 禁用的行                                                              | 运行调用方处理程序、关闭菜单、被方向键或类型提前匹配跳过，或未被宣布为禁用的禁用行，均失败。                                                                                                                            | `audit:DropdownMenu/accessibility` |
| FR20, AR7        | `DropdownMenuSubMenu.test.tsx` header 与 footer 用例，包括 "on a phone"；`SubMenuHeaderFooter.a11y.chromium.spec.ts`；`ContextMenu.test.tsx` "shows a sub-menu with a header or footer as its rows alone, and says why in development"                                                                                                                                                                                                                                                                                   | 精细指针与手机；Escape 路径；嵌套浮出层；指针离开                     | 区域落在菜单内部、未命名的对话框、不环绕的 Tab 遍历、关闭根的 Escape，或焦点在其中却关闭的浮出层，均失败。                                                                                                              | `audit:DropdownMenu/accessibility` |
| FR21             | 证据缺口：没有测试，与 FR21 的缺口一致                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                     | —                                                                                                                                                                                                                       | `audit:DropdownMenu/behavior`      |
| FR22             | `DropdownMenu.test.tsx` "DropdownMenu entrance under a finger" 用例；`useMenuPress.test.tsx` "an input hold over the menu" 用例；`DropdownMenuEntranceHold.interaction.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                  | 菜单进入期间的外部轻点与手指滑动；鼠标点击                            | 进入期间关闭菜单、点击页面或移动焦点的轻点，什么都没选中的滑动，或被按住不放的鼠标，均失败。                                                                                                                            | `audit:DropdownMenu/behavior`      |
| FR23             | `DropdownMenu.test.tsx` Tab 用例；`DropdownMenuSubMenu.test.tsx` "Tab from a flyout leaves the whole menu" 套件                                                                                                                                                                                                                                                                                                                                                                                                          | 顶层、向下第一层与第二层、Shift+Tab                                   | 让任一层保持打开的 Tab、第二次 `onOpenChange(false)`，或被阻止的 Tab，均失败。                                                                                                                                          | `audit:DropdownMenu/accessibility` |
| PR1              | 证据缺口：没有测试断言监听器与观察者的边界                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                                     | —                                                                                                                                                                                                                       | `audit:DropdownMenu/behavior`      |
| 主题解剖结构映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 规范的解剖结构与目标                                                  | 缺失、多余、带前缀、陈旧或以别名为后端的映射会使仓库校验失败。                                                                                                                                                          | `audit:DropdownMenu/theming`       |

## Current-state impact

- **触控生长与平移取消（FR21）。** 手指下菜单以该层自身的进入与退出出现和离开，而不是从 Trigger 按钮中生长出再缩回，且从外部开始的平移不会关闭它，这违反 `spec:AST-094` FR31 与 FR32。
- **手指之后静止的鼠标（FR22）。** 已知缺口：手指操作之后，静止鼠标的第一次按压不产生效果，除非鼠标停在进入中的菜单屏蔽层升起时页面最后一次听到它的位置。
- **委托的 Trigger Button 缺口（FR3）。** 如 `component:Button` 所记录，Trigger 按钮在减少动态效果下按压时仍会缩放，并保持固定高度，这违反 `design:reduced-motion` DR1 与 `spec:AST-102` FR4。
- **调用方渲染触发控件时的富面板标题（OQ2）。** 使用 `renderTrigger` 时，底部面板标题只显示触发控件可访问名称的扁平化文本，而没有名称的触发控件则得不到标题。
- **延迟的显示。** 当菜单的显示等待另一个浮层操作时，它在触发控件之外的那次打开松开会关闭它，这违反 FR8。

## Decision log

### DEC-1 — Pointer dismissal returns focus to the trigger, ring suppressed

**Reference:** `component:DropdownMenu/DEC-1`

**Decider:** `cixzhang`, 2026-10-02

指针关闭后让触发控件失焦，可以让 Safari 在触控选择之后不绘制焦点环，但焦点落回页面会让接下来去按方向键的键盘用户失去位置。焦点返回触发控件，并由共享的焦点返回可见性辅助函数在指针输入后抑制焦点环（`architecture:interaction-modality` INV1），底部面板呈现方式此前已是如此。按压模型自身的决策仍保留在 `module:DropdownMenu/useMenuPress`。

### DEC-2 — `menuMaxHeight` is a number of pixels

**Reference:** `component:DropdownMenu/DEC-2`

**Decider:** `cixzhang`, `2026-10-02`

`menuMaxHeight` 只替换上限中的 300px 项；视口留白仍然约束菜单，因此必须显示全部行的菜单（例如停靠在手机上的、含十一行 44px 行的菜单）可以做到这一点，同时永不溢出屏幕。动态取值仅使用 `100dvb`；每个支持锚点定位的浏览器都有它。

选择属性而非主题变量，是因为这一需求是情境性的——一个行数很多的菜单——而不是整个产品的偏好，并且属性在有问题的调用点读起来更清楚。

该取值是一个像素数。已否决：任意 CSS 长度（`50vh`、`calc(...)`），那是在共享组件上做产品形态的调参，`spec:AST-002` 不允许，而且会让调用方写出视口项无法推断的上限。

### DEC-3 — Any control can open a menu

**Reference:** `component:DropdownMenu/DEC-3`

**Decider:** `cixzhang`, 2026-10-02

`renderTrigger` 是一个渲染属性，把 `DropdownMenuTriggerProps` 交给调用方展开，因此按压模型、键盘打开与 ARIA 接线都走与内置 Button 相同的代码路径，菜单由控件通过 `aria-labelledby` 命名。`button` 与 `renderTrigger` 互斥（有开发期警告）；Button 路径保持不变。

该属性的命名依据 `spec:AST-055` DEC-5 与 DEC-6：`render<X>` 是系统中每个渲染属性的前缀，而裸的 `trigger` 已在 `Collapsible` 上以不同的形态公开，那里它是一个 `ReactNode` 插槽，否则同一个词会表示两件事。

已否决：接受已渲染元素的内容插槽。插槽无法把控件必须携带的属性交给调用方，因此组件将不得不深入元素内部去附加它们。

打开状态以展开属性上的 `aria-expanded` 到达调用方的控件，该属性的文档展示了基于该特性的样式。以 `:active` 为键的按下外观不是替代方案：`:active` 在粗指针下行为不同，这正是菜单行完全放弃粗指针 `:active` 绘制的原因。

已否决：在 Button 上加 `as` 属性——图标按钮、chip、头像和列表行都不是 Button 的变体；插槽组件——它隐藏了哪些属性必须到达控件。

### DEC-4 — Sub-menus drill in on a phone

**Reference:** `component:DropdownMenu/DEC-4`

**Decider:** `cixzhang`, 2026-10-02

手机宽度菜单旁的浮出层没有空间。当紧凑触控显示屏打开菜单时——在打开时采样一次，因此菜单在指针下永不改变形状——子菜单行把它的视图推入根组件维护的一个栈（`useMenuDrillIn`，内部），根组件在同一个菜单框内用该视图替代自己的行：一行“Back to <parent>”，然后是子菜单的行。子菜单把它的列表 portal 进根的宿主，使该行保持挂载、其行保持可用，并让 Back 有可返回焦点的对象；同级的行与分隔线无需了解它。在复合模式、数据模式以及 `ContextMenu` 中都有效；`presentation` 可覆盖该策略。

该查询是 `COMPACT_TOUCH_PRESENTATION_QUERY`，根呈现方式已用它来决定底部面板，因此一个组件只承载一种“自适应”含义。裸的 `(pointer: coarse)` 在大型触控平板上与它不一致：菜单保持为锚定的浮层，而其子菜单在原地替换行，这种组合没有人设计过。

公开表面仅有 `presentation`。`useMenuDrillIn` 及其 `DropdownMenuDrillIn` 视图栈控制器保持内部：导出它们会把内部机制变成永久 API，而这里没有任何地方要求调用方触碰它。日后需要驱动该栈的产品，届时会获得一个刻意的组件或 hook，并带有自己的契约。

已否决：翻转的浮出层——落在父行上方，读起来像第二个菜单；只在数据模式下下钻——应用中的每个菜单都是复合模式；把 `{label, children}` 快照压入栈——会卸载该行并破坏焦点返回。

### DEC-6 — A titled group of rows is `DropdownMenuGroup`

**Reference:** `component:DropdownMenu/DEC-6`

**Decider:** `cixzhang`, 2026-10-03

数据模式可以通过 `{type: 'section', title}` 为一串行加标题，而复合模式不能，于是最需要分组、又必须是复合模式的菜单——复选框行、单选组、按条件挂载的行——在视力用户看到两簇时，却留给屏幕阅读器一串松散的行。复合模式的对等组件通过可见标题上的 `aria-labelledby` 为其行命名，并复用 `dropdown-menu-section-heading` 的处理，因此一个标题在两种模式下看起来、读起来都一样。

该组件以它渲染的 `role="group"` 命名。数据模型为其 `{type: 'section'}` 条目保留 `DropdownMenuSection`：两个词描述同一个概念，两者共用一个名字会与那个已导出的类型冲突。已否决：把组件改名为 `DropdownMenuSection`，会冲突；两者都改名，则会为一次措辞变更破坏公开类型。

`title` 是 `ReactNode`。富标题是正当需求，数据模式的字符串标题是更窄的情形，而不是要对齐的模型。标题内可聚焦的节点会落在组内但在漫游焦点顺序之外，因此方向键无法到达它；类型并不阻止这一点，改由一个用例固定该行为。

### DEC-8 — Controls beside the rows go in `header` and `footer`

**Reference:** `component:DropdownMenu/DEC-8`

**Decider:** `cixzhang`, 2026-10-11

`role="menu"` 只接纳菜单项、组与分隔符。把筛选字段或“Create”按钮放在行之间，会让菜单对屏幕阅读器无效，并且会让菜单的按键处理与按压模型与该控件相争。该控件属于菜单旁边，而不是菜单之内。`header` 与 `footer` 把它放在那里：在同一个浮层或面板中，位于菜单元素之外。在菜单元素之外，菜单绝不接管该控件的按键或按压。由于 `children` 仅包含行，任何内容都无法被放在行之间；组件无需检查其子节点即可保持这一点。

菜单成为各区域之间的一个 Tab 停靠点，因此浮层读起来是一条 Tab 序列：header、menu、footer，位于 DEC-10 的对话框内。打开时的焦点不变。已否决：让菜单的处理程序为放在行之间的控件让路——那是在让无效结构可用，而不是修复它；以及由调用方包裹的条目元素，它把“行之间什么都没有”交给约定去保证。

### DEC-9 — The trigger is a Menu Button, arrow-key opening included

**Reference:** `component:DropdownMenu/DEC-9`

**Decider:** `cixzhang`, `2026-10-13`

指针触发控件已经在扮演 Menu Button 的角色，因此它携带该模式必需的部分（AR4）。ArrowDown 与 ArrowUp 打开超出了采用规则要求的集合，作为具名例外保留，因为组件已经发布了它们（FR12 在菜单打开后保留环绕），移除一条可用的键盘路径会损害已经使用它的用户。本决策不涵盖 ContextMenu 与 NavMenu。

已否决：为对齐规则的默认值而放弃方向键打开；为每一个会打开任何层的控件采用该模式。

### DEC-10 — A popover with a header or footer is a modal dialog, and Tab wraps

**Reference:** `component:DropdownMenu/DEC-10`

**Decider:** `cixzhang`, `2026-10-13`

同时容纳菜单和非菜单项控件的浮层不是菜单：声明 `aria-haspopup="menu"` 的触发控件承诺的是一个菜单，而该浮层随后却容纳了一个并非菜单项的字段或按钮。因此，带 `header` 或 `footer` 时，该浮层被暴露为一个具名模态对话框，菜单在其内部，触发控件声明 `aria-haspopup="dialog"`，而 `aria-controls` 指向承载该对话框的浮层。把菜单角色向内移动，可让每一行仍是菜单项、每一个其他控件都在菜单之外。按 APG Dialog 模式的要求，Tab 与 Shift+Tab 在对话框内环绕；Escape 与外部按压会关闭它。两个属性都不给时，组件不变：一个用 Tab 关闭菜单的 Menu Button。已否决：在任一端之后按 Tab 即关闭，那会让用户靠 Tab 离开一个模态对话框。

### DEC-11 — A disabled menu row is reached by the keyboard and stays inert

**Reference:** `component:DropdownMenu/DEC-11`

**Decider:** `cixzhang`, owner decision, 2026-11-04

在菜单中，禁用的行仍留在键盘路径上，让人知道它存在以及为何不可用，正如 WAI-ARIA Menu 模式及其键盘指南对禁用菜单项的建议。方向键、Home、End 与类型提前匹配会访问它；它获得焦点并被宣布为禁用；被激活时什么也不做，且不关闭菜单。从键盘打开菜单时焦点仍落在可用行上：第一个可用行，或触发控件上按 ArrowUp 后的最后一个可用行。该规则涵盖 DropdownMenu 及其子菜单、MoreMenu、ContextMenu 与 NavHeadingMenu；其他菜单不在本决策范围内。其他复合控件，例如工具栏、按钮组或列表框，保留它们自己的导航。已否决：跳过禁用的行，那会把一个不可用的操作及其原因对键盘与屏幕阅读器用户隐藏起来。

## Open questions

- **OQ2 — 由调用方渲染触发器时的富内容面板标题。**（`human-api`）使用 `renderTrigger` 时，底部面板的标题与对话框的名称都来自从页面上读取的触发器无障碍名称，因此富内容触发器（头像加姓名、图标加标签）在面板标题里只会显示扁平化后的文本，而没有名称的触发器则完全没有标题。待定：DropdownMenu 是接收显式标题（一个节点），复用触发器已渲染的内容，还是保留纯文本名称；以及该名称是否应来自显式来源，而不是从页面读取。

## Content boundary

本文件不重复使用方的 prop 表、条目示例、焦点与定位算法、实现步骤，也不重复共享的模态、层、关闭与主题化规则。它链接到这些内容的归属记录。
