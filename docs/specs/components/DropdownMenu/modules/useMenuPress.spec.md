---
schema_version: 3
template_version: 3
kind: module
id: module:DropdownMenu/useMenuPress
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-02
owners: [cixzhang, vjeux]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/hooks/menuPressGesture.test.ts,
    packages/core/src/hooks/useMenuPress.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx,
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/Selector/Selector.test.tsx,
    packages/core/src/DropdownMenu/__tests__/MenuPress.a11y.chromium.spec.ts,
    packages/core/src/DropdownMenu/__tests__/MenuPinchZoom.a11y.chromium.spec.ts,
  ]
parent_component: component:DropdownMenu
references:
  [
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:layer-runtime,
    family:overlay-dismissal,
    family:action-groups,
  ]
---

# useMenuPress module contract

## Contract at a glance

| 领域                    | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 新增的公共 hook `useMenuPress`，以及它驱动的纯 `menuPressStep` 状态机，二者从 `@astryxdesign/core/hooks` 导出；每个挂载它的菜单或 listbox 根上都带有标记 `data-astryx-menu-press`；该 hook 的 trigger 半边（`onTriggerPress`、`triggerProps`、`isTriggerClickFromPress`、`longPressDelayMs`），随 0.6.6 发布。DropdownMenu、ContextMenu、DropdownMenuSubMenu 与 Selector 的使用方 prop 均无变化。                                                                                                                                                                                                                                                                                        |
| Behavior                | 指针被 RELEASED 时所在的那一行才是生效的那一行；高亮跟随被按住的鼠标；鼠标在菜单外释放会关闭菜单；被跟踪手势对应的浏览器杂散 click 永不生效；菜单根按溢出情况声明 `touch-action`。手指或笔的按压在每个主指针下遵循 `spec:AST-094` FR26–FR30。提议中（FR8、DEC-4）：鼠标按下即打开 DropdownMenu，并在打开手势的释放上附加一条 settle 规则。                                                                                                                                                                                                                                                                                                                                               |
| End-user impact         | 手指落在某一行菜单上、却在另一行上抬起时，作用于第二行且只作用一次，而不是作用于第一行；在已打开的菜单内拖动，则在哪里松手就在哪里选取；鼠标在菜单外松手会关闭菜单，手指则不会。提议中：鼠标可以按下 trigger、拖入菜单，并在一次手势内于某行上松手。手指下的打开由 `spec:AST-094` FR29 规定。键盘行为与子菜单 hover 不变。                                                                                                                                                                                                                                                                                                                                                               |
| Builder impact          | 对五个表面的使用方而言没有影响：它们自己挂载该模型。组件只有满足下面的资格条件时才可以采用该模型，并且其组件契约必须先显式点名本模块与受其约束的表面，才能挂载 `useMenuPress`。构建者需提供一个启用行选择器与一项 `touch-action` 声明。                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Compatibility/readiness | 新增式的公共 hook；既有使用方 prop 不变；已发布的键盘行为不变。已发布行为的变化：FR6 通过按压控制器实现的鼠标行按压（`spec:AST-094` DEC-21；证据待补）、DEC-3（当前行为；鼠标在菜单外释放会关闭菜单）以及提议中的 DEC-4（鼠标在按下而非 click 时打开菜单；手指下由 `spec:AST-094` FR29 规定）。jsdom 证据对 FR1–FR7 已完整，真实 Chromium 证据覆盖了触摸平移、手指滑动及其杂散 click；FR10 的静置手指、FR11 的交接以及 AR5 的单次打开与关闭需要真实浏览器证据；本模块不要求 iOS WebKit 证据。权威性：FR1–FR7、DEC-3、DEC-6、DEC-7（`cixzhang`，2026-10-02）以及 FR10、FR11、AR5、DEC-8（`cixzhang`，2026-10-25）为 current；FR8 与 DEC-4 在本次变更中提议，等待同一位所有者裁定（OQ1）。 |
| Review checks           | 拒绝以下情形：某行因 `pointerdown` 而生效，或在被跟踪的释放之后因浏览器的 click 而生效；一次手势使某行被激活两次；高亮同时点亮两行；手指在菜单外释放却关闭了菜单，或鼠标在菜单外释放却让其保持打开；菜单根没有 `touch-action` 声明；picker 的 listbox 为高亮而抢占 DOM 焦点；在指针进入菜单或按压 settle 之前就生效的打开释放；trigger 的按压与 click 在同一次手势里都发生切换。                                                                                                                                                                                                                                                                                                         |
| Governing rules         | `architecture:interaction-modality` INV2–INV4（每种模态一条可操作路径、hover 仅作增强、菜单可以随指针移动焦点）；`architecture:public-component-api` 管辖新增的公共 hook；`architecture:layer-runtime` 管辖该模型保留原样的原生 light dismiss；`family:overlay-dismissal` 管辖 Escape 顺序，本模块不改变它。                                                                                                                                                                                                                                                                                                                                                                             |

本表是审查用的投影；下面的正文才具权威性。

## Intent

Astryx 的菜单与 picker 以前各自回答基本的指针问题，而且没有一个留意手指：浏览器报告 `click` 时某行才生效，而触摸浏览器把该 click 瞄准触摸 BEGAN 的那一行。从一行滑到另一行再抬起，作用的是第一行。本模块拥有一个可复用的按压模型：由释放决定，高亮跟随指针，并且（本文提议）鼠标在按下时打开。对显式采用它的组件来说，这是一条设计系统行为，因此没有任何产品需要为符合条件的表面另外带上一个按压控制器。

本模块只约定按压模型。菜单解剖、主题、呈现策略、键盘导航与条目语义仍归拥有该表面的组件记录；由键盘打开 trigger 仍归渲染该 trigger 的组件，而手指下的打开遵循 `spec:AST-094` FR29。

### Adoption eligibility

组件只有在以下条件全部成立时才能采用本模块：

- 其打开的表面呈现离散的动作行或选项行。
- 被按住的指针在这些行之间移动，表示在预览最终选择。
- 释放指针会唯一确定一行已启用的行。
- 拖动没有独立的组件含义，例如重排序、scrubbing 或直接操作。

资格并不导致采用。每个采用方的组件契约必须显式点名 `module:DropdownMenu/useMenuPress` 及其所约束的表面与声明。导出 `useMenuPress` 并不会让每个符合条件的组件都成为采用方。

## Compatibility and migration

- 保留的已发布默认值：对两种行为为 `no`：DEC-3（鼠标在菜单外释放现在会关闭菜单），以及未设置的 `longPressDelayMs`——其已发布的 500 ms 等待在手指下让位于 `spec:AST-094` FR29 的时序；对每个使用方 prop 以及每个 item、divider、section 与呈现 API 为 `yes`
- 兼容类别：新增式的公共 hook 与类型；菜单族内部的行为变化
- 迁移决策：`module:DropdownMenu/useMenuPress/DEC-3`；提议中的 `module:DropdownMenu/useMenuPress/DEC-4`（等待所有者审查）；`spec:AST-094` FR25（需要已发布 500 ms 等待的调用方传入 `longPressDelayMs: 500`）

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 手势状态机（`menuPressStep`）：跟踪、释放与取消；提议中：trigger 按压、打开与 settle 规则。
- 按 `pointerId` 在 document 级别跟踪进行中的手势。
- 在指针被按住时移动高亮：菜单中用 DOM 焦点，picker 中用调用方提供的回调。
- 按该行自身 click 的方式激活释放处所在的行，使用释放时的 button 与修饰键，并吞掉该手势对应的浏览器杂散 click。
- 在 `pointercancel`、第二个指针或窗口失去焦点时结束手势，且不让任何东西生效。
- 在溢出的菜单内跟踪按压时，对该菜单做边缘自动滚动。
- 提议中：在鼠标按压与被按住的手指上打开父菜单，并告知 trigger 该手势的 click 已被消耗。
- 菜单根上的标记 `data-astryx-menu-press`。

**不拥有 / 非目标**

- 聚合菜单解剖、呈现解析、item 渲染、主题目标——归 `component:DropdownMenu`、`component:ContextMenu`、`component:Selector` 所有。
- 某行生效时是否关闭菜单——归该行所有（`hasCloseOnSelect`、checkbox 与 radio item）。
- 滚动。手指何时在滚动，由浏览器通过菜单根声明的 `touch-action` 决定；本模块从不重新实现滚动，也从不监听 `scroll`。
- 原生 light dismiss、Escape 顺序与焦点捕获——归 `architecture:layer-runtime` 与 `family:overlay-dismissal` 所有。
- 用键盘从其 trigger 打开菜单——归渲染该 trigger 的组件所有；手指下则由 `spec:AST-094` FR29 管辖。
- 键盘导航、typeahead 与 Enter/Space 激活——归 `useListFocus`、`useTypeahead` 与组件记录所有。
- 子菜单 flyout 的 hover 打开——归 `useMenuHover` 所有。
- 在菜单之外、以及 Selector 与 MultiSelector 的选项之外，跨一组动作跟踪被按住的指针——归 `architecture:interaction-modality` INV13 为 `family:action-groups` 成员指定的那一个内部模块所有；本模块只覆盖菜单与这些选项。
- 菜单内的鼠标右键：未建模。

## Public API and concepts

| 概念                     | 封闭取值或状态                                                                                      | 含义                                                                                                                                                           | 默认值                      | 所有者                             | 稳定性 |
| ------------------------ | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------- | ------ |
| gesture phase            | `idle`、`tracking`；提议中 `triggerPress`、`open`                                                   | 进行中的按压处于何处                                                                                                                                           | `idle`                      | `module:DropdownMenu/useMenuPress` | 稳定   |
| effect                   | `none`、`highlight`、`clear`、`act`、`settle`；提议中 `open`                                        | 一个事件让宿主做什么；`open` 请求 trigger 在被按住的指针下打开菜单；`settle` 携带 `stray`（吞掉浏览器的 click）与 `dismiss`（关闭菜单）                        | —                           | `module:DropdownMenu/useMenuPress` | 稳定   |
| pointer type             | `mouse`、`touch`、`pen`                                                                             | 手势自身的指针；`touch` 与 `pen` 即“手指”                                                                                                                      | 来自事件                    | `module:DropdownMenu/useMenuPress` | 稳定   |
| enabled-row selector     | 调用方字符串                                                                                        | 释放可以生效的那些行；根内其他任何内容都不会产生高亮                                                                                                           | 必需                        | `module:DropdownMenu/useMenuPress` | 稳定   |
| highlight                | DOM 焦点，或调用方回调                                                                              | 一行被点亮；菜单中用 `preventScroll` 聚焦，picker 中用 `aria-activedescendant`                                                                                 | 焦点                        | `module:DropdownMenu/useMenuPress` | 稳定   |
| stray-click window       | 400 ms，或下一次 `pointerdown`                                                                      | 在被跟踪的释放之后，浏览器的 click 仍会被吞掉多久                                                                                                              | `MENU_PRESS_STRAY_CLICK_MS` | `module:DropdownMenu/useMenuPress` | 稳定   |
| settle time              | 300 ms                                                                                              | 提议中：打开手势的按压必须持续多久，其释放才可以生效                                                                                                           | `MENU_PRESS_SETTLE_MS`      | `module:DropdownMenu/useMenuPress` | 提议中 |
| long-press delay         | 设置时沿用已发布的 500 ms；未设置时按 `spec:AST-094` FR29 所述（固定栏内无等待；滚动视图中 150 ms） | 被按住的手指在 trigger 上等待多久后菜单才打开。设置 `longPressDelayMs` 的调用方在固定栏与滚动视图中都得到该等待，从而保留已发布的行为（`spec:AST-094` FR25）。 | `longPressDelayMs`          | `module:DropdownMenu/useMenuPress` | 稳定   |
| `data-astryx-menu-press` | 存在或不存在                                                                                        | 该根带有本模型；宿主自有的控制器让位                                                                                                                           | 每个已挂载的根上都存在      | `module:DropdownMenu/useMenuPress` | 稳定   |
| activation click         | 带 `detail: 0` 的 `click`，使用释放时的 button 与修饰键                                             | 模型如何作用于某行，由 `isMenuPressActivation()` 标记该同步区间；因此单凭 `detail === 0` 在菜单行上不再意味着“键盘”                                            | —                           | `module:DropdownMenu/useMenuPress` | 稳定   |

## Behavioral contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                                                                                                                                    | 验证状态                 |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1  | 某行必须在按压于其上释放时才生效，绝不能因为按压起始于它而生效；从未离开其所在行的按压即对该行的 tap 或 click。手指或笔在每个主指针下改为遵循 `spec:AST-094` FR26（`spec:AST-094` FR43）；鼠标保留本规则。                                                                                                                                                                 | macOS 与 iOS 的菜单行为；`menuPressGesture.test.ts`、`useMenuPress.test.tsx`                                                                                            | 待验证                   |
| FR2  | 当按压在菜单内被按住时，被高亮的行必须是指针下的已启用行，且在 divider、标题、禁用行之上或菜单之外都不得高亮任何内容。鼠标在无按键按下时移动也会以同样方式移动高亮（既有的 hover 聚焦）。手指或笔在每个主指针下改为遵循 `spec:AST-094` FR27 与 FR11 的 cell profile，第二根手指会结束手势（FR4）；鼠标保留本规则。                                                         | `architecture:interaction-modality` 允许的菜单变体；`useMenuPress.test.tsx`                                                                                             | 待验证                   |
| FR3  | 起始于菜单内、却在菜单外释放的按压不得作用于任何东西。鼠标下菜单随后必须关闭；手指或笔下必须保持打开（`spec:AST-094` FR28）。                                                                                                                                                                                                                                              | DEC-3；`useMenuPress.test.tsx`、`DropdownMenu.test.tsx`、`Selector.test.tsx`                                                                                            | 待验证                   |
| FR4  | 行能容纳的菜单必须声明 `touch-action: pinch-zoom`；会滚动的菜单必须声明 `touch-action: pan-y pinch-zoom` 与 `overscroll-behavior: contain`。两者都不允许菜单并不滚动的一指平移，且都把双指捏合留给浏览器，因此页面在菜单打开时仍可缩放。模型必须把 `pointercancel` 与第二个指针视为手势结束且不让任何东西生效，并且不得重新实现滚动。                                      | 浏览器拥有滚动；`spec:AST-020` FR1 下的 WCAG 2.2 SC 1.4.4；`DropdownMenu.test.tsx` 的 touch-action 用例、`useMenuPress.test.tsx`、`MenuPinchZoom.a11y.chromium.spec.ts` | 待验证                   |
| FR5  | 浏览器为被本模型跟踪的手势报告的 click 不得作用于任何行；只有释放才生效。背后没有已跟踪手势的 click，或 `detail` 为 0 的 click，必须像以前一样作用于其目标。吞 click 的机制在被跟踪的释放处启臂，并在下一次 `pointerdown` 或杂散 click 窗口之后解除。                                                                                                                      | 一次手势，一次激活；`useMenuPress.test.tsx` 的 FR5 套件                                                                                                                 | 待验证                   |
| FR6  | 菜单至多只有一行被点亮。手指下，按压起始的行在指针离开后不得保留 pressed 或 hovered 外观。手指或笔在每个主指针下改为遵循 `spec:AST-094` FR27 与 FR11；鼠标下某行通过按压控制器立即绘制其按压（`spec:AST-094` FR11 的 fine-pointer profile、DEC-21）。                                                                                                                      | `DropdownMenuItem.tsx` 的样式；`spec:AST-094` DEC-21 关于鼠标行按压（尚未实现：鼠标行仍绘制 `:active`）                                                                 | 待验证                   |
| FR7  | 当按压在会滚动的菜单内被跟踪时，停在该菜单顶部或底部边缘区内的指针必须让菜单朝该边缘滚动，并在行移动时重新读取指针下的行。手指或笔在每个主指针下改为遵循 `spec:AST-094` FR30；鼠标保留本规则。                                                                                                                                                                             | `useMenuPress.test.tsx` 的自动滚动用例                                                                                                                                  | 待验证                   |
| FR8  | 鼠标下，DropdownMenu 的 trigger 必须在按下时（button 0、无 Control）打开其菜单，而从 trigger 拖入菜单并在某个已启用行上释放时必须作用于该行。打开手势的释放必须仅在指针进入过菜单或按压持续到 settle 时间时才生效；否则不生效且菜单保持打开。按已打开菜单的 trigger 必须关闭它，且不得在同一次手势中重新打开。菜单打开时交接给它的鼠标指针（FR11）遵循同一条 settle 规则。 | 提议中的 DEC-4；`DropdownMenu.test.tsx` 的按压模型套件、`menuPressGesture.test.ts` 的 trigger 状态                                                                      | 提议中；等待所有者审查   |
| FR9  | 由手指从其 trigger 打开菜单，以及打开手指的交接，均由 `spec:AST-094` FR29 管辖，且在每个主指针下（`spec:AST-094` FR43）。                                                                                                                                                                                                                                                  | `spec:AST-094` FR29                                                                                                                                                     | 如同 `spec:AST-094` 所述 |
| FR10 | 手指在子菜单的行上释放必须打开该子菜单，如同该行自身的 click 那样（抬起即生效，`spec:AST-094` FR26；在紧凑触摸屏上，`adaptive` 行会下钻，FR34）；手指停在该行上不得打开它。从某行滑到已打开 flyout 的行上的手指，按 ORD1 在该处选取。                                                                                                                                      | DEC-8；`DropdownMenuSubMenu.test.tsx` 的按压用例                                                                                                                        | 待验证                   |
| FR11 | 在别处按下、例如 context menu 的长按，然后在菜单打开时交接给该菜单的指针，必须是打开按压。在每个主指针下，手指只有在走完交接距离后才会选取，该距离按 `spec:AST-094` FR33 的算法、从菜单打开后看到的第一个位置起算；在此之前抬起不生效，并让菜单保持打开。                                                                                                                  | DEC-8；`useMenuPress.test.tsx` 的继续套件                                                                                                                               | 待验证                   |

### Transformation and precedence order

- **ORD1 — 一次按压，最内层所有者。** 菜单内的 `pointerdown` 由携带 `data-astryx-menu-press` 的最内层根认领（flyout 先于其父级）；最外层根决定释放时什么算作“在菜单内”。
- **ORD1a（提议中）— 根旁的菜单。** 携带 `data-astryx-menu-press-surface`（其中点名另一个根的 `id`）的根，在 ORD1 上嵌套于那个根，正如根 DOM 内的 flyout 那样：在其行上的释放即在菜单内。只有带头部或尾部的子菜单所拥有的菜单会携带它，该菜单由根渲染在自己旁边（`component:DropdownMenu` FR20）。根旁的任何其他内容，比如放在某个区域中的头部字段或 picker，都在菜单之外，正如根本身各区域那样，而那里的 picker 仍自成一个根。等待所有者审查。
- **ORD2 — 释放解析。** 点下的已启用行 → `act`；在菜单内或在 trigger 上而没有行 → `settle`（杂散 click 被吞掉，菜单保留）；在菜单外 → `settle`，仅对鼠标附带 `dismiss`。
- **ORD3 — Trigger 的 click（提议中）。** 按压模型在 trigger 上的打开或关闭先执行；该 trigger 对同一次手势自身的 click（按手势计数器）为空操作；任何其他 click 保留其切换行为。
- **ORD4 — 激活派发。** 模型的激活是一个带 `detail: 0` 的 `click`，携带释放时的 button 与修饰键，并在同步激活标记内派发；某行再派发给其内部控件时该标记会传递；浏览器随后为该手势产生的 click 在捕获阶段于 window 处被停止。

### Performance and resources

- **PR1 — 每次手势的监听器。** 用于 `pointermove`、`pointerup`、`pointercancel`、`pointerdown` 的 document 监听器与 window `blur` 监听器在按压时挂载，手势结束时移除；空闲时没有任何监听器处于活动状态。
- **PR2 — 单一吞 click 机制。** window 捕获阶段的 `click` 监听器每个 document 只安装一次，并按手势启臂。
- **PR3 — 自动滚动。** 当被跟踪的指针停在溢出菜单的边缘区内时，只有一个定时器在运行；当指针离开该区域、滚动容器到达边缘或手势结束时，它停止。

## Accessibility contract

- **AR1 — 菜单中的高亮即焦点。** 菜单中被高亮的行就是被聚焦的行，以 `preventScroll` 移动，因此键盘、鼠标与手指共用一个高亮和一次绘制；在 Core 的菜单中，被按住的手指或笔会用 pressed 覆盖层绘制其点亮的行（公共 `useMenuPress` 调用方得到高亮、被点亮行的焦点，并自行为其设置样式）；根不接收焦点的行通过其内部控件获得高亮。
- **AR2 — picker 保留其 combobox 焦点。** 在 Selector 的 listbox 中，模型驱动 `highlightedIndex` 与 `aria-activedescendant`；DOM 焦点绝不进入 listbox。
- **AR3 — 辅助技术的激活可以通过。** `detail === 0` 的 click——键盘的、屏幕阅读器的，或模型自身派发的——永不吞掉，因此辅助技术仍像以前一样激活行。需要区分模型的指针激活与键盘激活的行，读取 `isMenuPressActivation()`，而不是 `detail`。
- **AR4 — 选取后的焦点归组件。** 模型按该行自身 click 的方式激活该行；菜单关闭后焦点去向何处，仍由拥有该组件的记录决定，本模块不改变。
- **AR5 — 一次打开，一次关闭。** 手指只打开菜单一次，途径是 `spec:AST-094` FR29 的打开、context menu 的长按（`spec:AST-094` FR33）、FR9 的被按住按压，或 tap 的 click，且没有任何东西会撤回一次打开：屏幕阅读器听到菜单打开一次，并在选取、关闭或 Escape（DEC-8）时听到关闭一次。

## Design relationships

不引入任何视觉表现。FR6 让手指的行按压保持在 `spec:AST-094` FR11 的 cell profile 上，因此单一焦点高亮是手指下唯一被点亮的行；高亮的绘制本身就是既有的、由 item 组件所有的焦点覆盖层，而在 Core 的菜单中，被按住的手指或笔改用 pressed 覆盖层绘制被点亮的行（AR1）。

## Parent and system relationships

- `component:DropdownMenu` 拥有聚合菜单解剖、呈现解析、目标与 item 流水线；`component:ContextMenu`、`component:Selector` 与子菜单 flyout 挂载本模块，并以其为参照记录各自的按压声明。
- `architecture:interaction-modality` 拥有模态跟踪与焦点返回可见性；本模块读取它们，不新增模态定义。
- `architecture:layer-runtime` 拥有原生 light dismiss，本模块将其保留原样：在 `popover="auto"` 菜单之外的按压仍会通过浏览器关闭它。打开菜单的那次按压，在其 show 被立即接受时被认领（`component:DropdownMenu` FR8、`spec:AST-003` FR11–FR13）。无论该按压在何处释放，浏览器的 light dismiss 都不会把释放读作关闭，而由按压模型决定它做什么。在按压持续期间，trigger 始终是该 popover 的 invoker，这与 layer runtime 的 keep-open props 使用的机制相同。鼠标下，指针在其上方时由 trigger 持有该指针。指针在这两者之外时，由菜单的层持有它。当 show 等待另一个 popover 操作时，按压模型不再跟踪该按压，因此只有 invoker 持有生效，离开 trigger 的释放会关闭（相对 `component:DropdownMenu` FR8 的一处缺口）。
- `family:overlay-dismissal` 拥有 Escape 顺序；此处不变。

## Verification map

| 契约                   | 验证                                                                                                                                                                    | 代表性状态                                                                                                                                    | 变异或失败预期                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1–FR3, FR5           | `menuPressGesture.test.ts`（状态图每个转移一个用例）                                                                                                                    | idle、tracking；鼠标与触摸；在一行上、在 chrome 上、在 trigger 上、在外部的释放；取消                                                         | 作用于按压起始行、作用于杂散 click，或在手指下关闭，都会使某个转移用例失败                   |
| FR1–FR5, FR7, AR1, AR3 | 带注入命中测试的 `useMenuPress.test.tsx`                                                                                                                                | 在另一行上释放、tap、杂散 click、`detail: 0`、鼠标/手指在外部、pointercancel、第二个指针、自动滚动                                            | 第二次激活、被吞掉的辅助技术 click、错误的关闭，或失效的自动滚动，都算失败                   |
| FR1, FR3–FR5           | `DropdownMenu.test.tsx`、`DropdownMenuSubMenu.test.tsx`、`ContextMenu.test.tsx` 的按压测试套件                                                                          | 手指跨行滑动、鼠标与手指在外部释放、`touch-action`、flyout 释放、根标记                                                                       | 每项被去掉的行为都会让对应的具名用例失败                                                     |
| FR1, FR3, AR2          | `Selector.test.tsx` 的按压模型套件                                                                                                                                      | 在另一选项上的手指释放、手指/鼠标在外部释放、listbox 标记                                                                                     | listbox 抢占焦点、作用于按压起始选项，或在手指下关闭，都算失败                               |
| FR4（滚动）            | `MenuPress.a11y.chromium.spec.ts`（真实 Chromium）                                                                                                                      | 溢出菜单中 Chromium 的触摸平移；按溢出情况取值的 touch-action；手指滑动及其杂散 click                                                         | 在 jsdom 中无法证明；作用于某行的平移，或作用于按压起始行的滑动，都算失败                    |
| FR4（捏合）            | `MenuPinchZoom.a11y.chromium.spec.ts`（真实 Chromium，手机模拟）                                                                                                        | 在行能容纳的菜单上、在会滚动的菜单上、在 picker listbox 上的双指捏合                                                                          | 在 jsdom 中无法证明；让页面停留在缩放 1 的捏合，或作用于某行的捏合，都算失败                 |
| FR8（提议中）, FR9     | `menuPressGesture.test.ts` 的 trigger 状态；`useMenuPress.test.tsx` 的 trigger 套件；`DropdownMenu.test.tsx` 的按压打开用例                                             | 鼠标立即打开、settle 之前/之后、取消；按 `spec:AST-094` FR29 的手指打开；按压打开 + 拖动释放、未 settle 的释放、trigger 切换、按住的触摸、tap | 鼠标按压时不打开的菜单、未经 settle 却生效的释放，或同一次手势中重新打开的 trigger，都算失败 |
| FR8（提议中）          | `DropdownMenuOpeningRelease.interaction.browser.spec.ts`，Chromium 与 WebKit                                                                                            | 在 trigger 之外、在已移开的 trigger 之下，以及在等待过的 show 之后的打开释放；在外部已 settle 的释放                                          | 浏览器 light dismiss 关闭了一次未 settle 的打开释放，算作失败                                |
| FR10, FR11, AR5        | `DropdownMenuSubMenu.test.tsx` 的按压用例，以及针对静置行的真实浏览器手指用例；`useMenuPress.test.tsx` 的继续套件，外加一个真实浏览器交接用例；AR5 的打开与关闭事件计数 | 在子菜单行上释放与静置的手指；继续的手指、距第一个采样点的距离、在此之前抬起、鼠标；菜单的打开与关闭各被观察到一次                            | 子菜单因静置手指而打开、继续的手指在交接前就选取、打开被撤回，或打开/关闭两次，都算失败      |
| ORD1a（提议中）        | `DropdownMenuSubMenu.test.tsx` 的按压用例；`SubMenuHeaderFooter.a11y.chromium.spec.ts` 的按压拖动用例                                                                   | 在菜单行上的鼠标按压，在渲染于菜单旁的子菜单某行上释放；同一次按压在该子菜单的头部字段上释放                                                  | 在这样的行上释放却不生效或关闭菜单，或在其头部字段上释放却生效，都算失败。                   |

## Decision log

### DEC-3 — A release outside closes under a mouse and stays under a finger

**参考：** `module:DropdownMenu/useMenuPress/DEC-3`

**决策者：** `vjeux`，`2026-09-27`

macOS 在 mouse-up 时结束菜单的跟踪：在外部释放即关闭。iOS 在滑出菜单的手指抬起时让菜单保持呈现；之后再在外部 tap 才关闭。每种指针各保留其平台给出的答案。若两者都关闭，滑出的手指就需要第二次手势才能重开；若两者都保持打开，则会让鼠标用户意外。

### DEC-4 (proposed) — A mouse opens on press-down, with a settle rule

**参考：** `module:DropdownMenu/useMenuPress/DEC-4`

**决策者：** 由 `vjeux` 提议，`2026-09-27`；等待所有者审查

按下即打开并拖动释放，是 macOS 的菜单做法。手指下的打开遵循 `spec:AST-094` FR29 与 DEC-4。打开手势的释放只有在指针进入过菜单或按压已 settle（300 ms）之后才生效，正如原生 pop-up button 那样；否则在指针之下打开的菜单就会选中一行没人选过的行。

### DEC-6 — The highlight is DOM focus in a menu, `aria-activedescendant` in a picker

**参考：** `module:DropdownMenu/useMenuPress/DEC-6`

**决策者：** `vjeux`，`2026-09-27`

菜单本来就通过在 hover 时移动焦点来维持单一高亮；手指以 `preventScroll` 移动同一个焦点，因此键盘、鼠标与触摸共用一个状态和一次绘制；在 Core 的菜单中，被按住的手指或笔会用 pressed 覆盖层绘制该行（AR1）。picker 的列表属于 combobox，不得从它那里夺走焦点。手指离开的行不保留 pressed 绘制，因为那会点亮第二行（FR6）。本记录不决定选取后焦点去向何处。

### DEC-7 — Eligibility permits adoption; component contracts opt in

**参考：** `module:DropdownMenu/useMenuPress/DEC-7`

**决策者：** `cixzhang`，`2026-10-02`

当组件的打开表面呈现离散的动作行或选项行、被按住的指针跨行移动表示预览最终选择、且释放会唯一确定一行已启用行时，该组件可以采用本模型。拖动另有含义（例如重排序、scrubbing 或直接操作）的组件不符合资格。资格从不导致采用：每个组件契约都要点名本模块及其所约束的表面与声明。仅凭公共 hook 的存在并不会让某个组件成为采用方。

### DEC-8 — A finger opens a sub-menu by lifting, and a handed-off finger is the opening press

**参考：** `module:DropdownMenu/useMenuPress/DEC-8`

**决策者：** `cixzhang`，`2026-10-25`

在子菜单的行上抬起的手指会打开它，如同 tap 那样；而停在行上的手指永不打开它，因此子菜单不会从一根仍在选择的手指下打开。菜单打开时交接给它的手指，例如打开 context menu 的那次长按，就是该菜单的打开按压：它走完交接距离后才会选取，因此打开菜单的那次按压本身永不选取。手指只打开菜单一次，且没有任何东西撤回这次打开，所以屏幕阅读器只听到一次打开和一次关闭。

已否决：当手指停在子菜单的某行上时打开该子菜单。

## Open questions

- **OQ1 — 按下即打开是菜单族的 trigger 模型吗？**（`human-design`）本次变更所需的那一项所有者决策：提议的 FR8 与 DEC-4——鼠标在按下时打开 DropdownMenu，并带 settle 规则。手指下的打开归 `spec:AST-094` FR29。在所有者裁定之前，本记录当前的 FR1–FR7 各自独立成立。
  此前的浏览器证据问题已解决：触摸平移、手指滑动及其误触点击无法在 jsdom 中执行，而它们的真实 Chromium 证据现已存在于 `packages/core/src/DropdownMenu/__tests__/MenuPress.a11y.chromium.spec.ts`。`cixzhang` 于 2026-10-02 裁定：本模块现在与以后都不要求 iOS WebKit 证据；真实 Chromium 即证据门槛。

## Content boundary

本记录不重复 `useMenuPress.doc.mjs` 的签名、所属组件的结构与主题、层或关闭规则，也不重复实现步骤。它链接到这些内容的权威所有者。
