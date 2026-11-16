---
schema_version: 1
template_version: 1
kind: family
id: family:buttons
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-04
owners: [cixzhang]
review_triggers: [behavior, layout, theming, accessibility, public-api]
verified_by:
  [
    packages/core/src/Button/Button.test.tsx,
    packages/core/src/IconButton/IconButton.test.tsx,
    packages/core/src/ButtonGroup/ButtonGroup.test.tsx,
    packages/core/src/ToggleButton/ToggleButton.test.tsx,
  ]
members:
  [
    component:Button,
    component:IconButton,
    component:ToggleButton,
    component:ButtonGroup,
    component:ToggleButtonGroup,
  ]
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
deciding_specs: [spec:AST-002/DEC-1]
---

# Button family contract

## Intent

无论操作是带有标签的、仅图标的、持续性的、独立的还是成组的，人们都应该遇到一个连贯的按钮系统。各成员共享相同的控件几何、可访问名称要求、交互反馈、异步操作模型和表面所有权。每个成员仍然拥有其特定于瞬时操作、导航目标、持续按下状态或组的语义。

ToggleButton 渲染 Button 的悬浮状态，但目前无法选择该家族的静止悬浮轴。家族为 ToggleButton 接纳该轴。其透明的幽灵表面仍是一个已知的视觉问题：悬浮可以提供悬浮边界，而不是不透明填充或轮廓，本契约不要求新的背景处理。

## Membership rule

当组件的主要公共目的是激活按钮式操作、保留按钮的按下操作状态，或将这些控件组合成按钮专用的组，同时保留其共享的表面和交互契约时，该组件属于本家族。

- **成员：** Button、IconButton、ToggleButton、ButtonGroup 和 ToggleButtonGroup。
- **协作者：** Spinner 提供待处理反馈；Tooltip 提供可见说明；LinkProvider 提供 Button 的导航渲染器；SizeContext 提供继承的控件尺寸；DropdownMenu 可以为 ButtonGroup 提供一个按钮触发器。这些协作者不会成为 Button 家族的成员。
- **排除：** Link 的主要目的是导航，而不是按钮表面。Switch、CheckboxInput 和 RadioList 表示设置或表单值，而不是按钮操作。SegmentedControl 和 TabList 在各自的选区/导航契约下切换视图或目标。仅仅将 Button 用作触发器或操作插槽的组件，保留其自己的家族成员身份。

成员身份遵循公共职责，而不是是否导入了 Button 或是否渲染了 `<button>` 元素。

## Shared owner

- Button 拥有通用操作表面：原生按钮语义、焦点与按压反馈、尺寸、视觉变体、加载呈现、链接模式和静止悬浮。
- IconButton 是 Button 的显式仅图标投影，继承该表面契约，而不创建另一种操作模型。
- ToggleButton 复用 Button 表面，并添加持久的受控按下状态、按下状态视觉，以及可中断的按下 Action。
- ButtonGroup 拥有连接式操作组几何、游走焦点、继承的尺寸与禁用状态，以及一个共享的连接式悬浮。
- ToggleButtonGroup 拥有单选或多选状态，以及不同 ToggleButton 表面的布局。它不会仅仅因为对选择进行分组就变成连接式视觉表面。
- 共享原语保留自己的契约。Spinner、Tooltip、Icon、Link 和 DropdownMenu 的行为在被组合进某个成员后，不会变成 Button 专用的行为。

## Canonical concepts

| 概念     | 值或状态                                             | 默认语义                                                                                                                                                            | 稳定性                                   |
| -------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| 激活模型 | 瞬时操作、导航、持续按压                             | Button 和 IconButton 激活一次；ToggleButton 表示保留的按下状态                                                                                                      | 已发布的家族区分                         |
| 内容模式 | 可见标签、自定义可见内容、仅图标                     | 每个控件都有必需的、可访问的 `label`；仅图标会在视觉上隐藏它                                                                                                        | 已发布的家族规则                         |
| 尺寸     | `sm`、`md`、`lg`                                     | `md`；显式的成员尺寸优先于继承的组尺寸                                                                                                                              | 已发布的家族轴                           |
| 视觉状态 | 静止、悬停、聚焦、活动、禁用、加载；适用时还包括按下 | 状态保留控件几何和可访问目的；手指下的按压反馈遵循 `spec:AST-094` FR11 的控件配置，鼠标或触控笔下的按压反馈遵循其精细指针配置（未实现：鼠标按压仍会绘制 `:active`） | 已发布的家族规则                         |
| 异步操作 | 无、一次性触发、可中断的持续操作                     | 普通操作在待处理期间去重；持续切换保持可逆                                                                                                                          | 已发布的家族区分                         |
| 悬浮     | `none`、`low`、`med`、`high`                         | `none`；绘制可见表面的元素拥有阴影                                                                                                                                  | 已发布的家族轴；已批准 ToggleButton 采用 |
| 分组     | 独立、间隔集合、连接式表面                           | 语义和绘制的包含关系决定所有权；仅分组本身不决定                                                                                                                    | 家族规则                                 |

## Cross-component invariants

- **FR1 — 每个控件都有可访问名称。** Button 家族的控件必须接收非空的可访问 `label`。文本控件渲染该标签或调用方提供的可见内容。仅图标控件通过 `aria-label` 暴露标签；其图标不能替代程序化名称。
- **FR2 — 原生操作语义是默认行为。** 瞬时操作或持续操作会渲染一个可操作的按钮，具有键盘激活、焦点可见反馈和 `type="button"`，除非组件的文档化表单模式另有说明。Button 的 `href` 模式是显式的导航变体，也遵循 `family:navigation-destinations`。
- **FR3 — 禁用意味着不可操作。** 禁用的成员不得调用其回调或 Action。禁用成员保持可聚焦，并遵循 `spec:AST-085`。组的禁用状态会覆盖成员的可用性。
- **FR4 — 待处理反馈保留目的和几何。** 当成员暴露加载或 Action 时，待处理工作必须设置 `aria-busy`，保持控件尺寸稳定，并呈现 Spinner 而不改变可访问目的。显式的禁用样式和待处理样式保持区分。
- **FR5 — 回调与 Action 的顺序一致。** 当成员同时暴露同步回调和 Action 时，回调先运行。阻止该事件即阻止 Action。独立的 ToggleButton 在 `pressedChangeAction` 之前同步运行 `onPressedChange`，并在回调调用 `preventDefault()` 时跳过 Action。当未提供回调时，Action 也会运行。独立 ToggleButton 上的调用方 `onClick` 在 `onPressedChange` 和 `pressedChangeAction` 之前运行。当该 `onClick` 调用 `preventDefault()` 时，激活不请求下一个状态，两者都不运行；否则切换继续进行。调用方 `onClick` 永远不会取代切换请求。没有 `pressedChangeAction` 时，仅回调的激活必须保持同步，并且不报告 Action 待处理反馈。一次性触发的 Action 在待处理期间会对激活去重；显式可中断的持续操作可以接受新的激活并替换进行中的意图。
- **FR6 — 持久状态是显式的且可逆的。** ToggleButton 必须通过 `aria-pressed` 暴露其有效状态，并在激活时请求下一个受控值。待处理状态可以是乐观的，但新的激活必须基于有效的进行中值，而不是过时的已提交值。
- **FR7 — 共享尺寸保留家族几何。** 使用家族尺寸轴的成员必须将 `sm`、`md` 和 `lg` 映射到相同的控件高度契约。仅图标成员在解析后的尺寸下是正方形。Button 和 IconButton 必须将其所拥有图标插槽中的 Astryx Icon 在 `sm` 和 `md` 控件下默认为 `sm`，在 `lg` 控件下默认为 `md`；显式的 Icon 尺寸必须胜出。标签字重、按下状态、加载或图标替换不得改变外部控件尺寸。
- **FR8 — 悬浮属于绘制的表面。** 绘制其可见表面的独立成员拥有其静止悬浮。绘制一个连续表面的连接式组拥有一个共享的悬浮，其成员绘制有效悬浮 `none`。不绘制共享表面的语义组或布局组，不得仅仅因为包含按钮就获得悬浮。
- **FR9 — 悬浮独立于交互状态。** 按下、悬停、聚焦、活动、加载、禁用和图标状态不得改变悬浮的所有者或层级。它们可以改变绘制在该表面上的处理。
- **FR10 — 公开状态、渲染状态和主题状态一致。** 当成员暴露家族视觉轴时，其公共 prop、有效的渲染 `data-*` 状态和文档化的主题视觉 prop 必须描述它实际绘制的值。包装器不得将被忽略的子值报告为有效输出。
- **FR11 — 按钮专用的组有一个可访问所有者。** ButtonGroup 和 ToggleButtonGroup 必须暴露可访问的组标签，并传播其文档化的尺寸和禁用默认值，同时不删除成员的可访问名称。组只拥有其组模式所声明的行为和表面，以及 `family:action-groups` 赋予它的跨成员按压跟踪。由 `value` 标识的 ToggleButtonGroup 成员必须从组派生按下状态和选择请求，而不是从其独立的 `isPressed`、`onPressedChange` 或 `pressedChangeAction` 派生。成员的 `onPressedChange` 和 `pressedChangeAction` 会被忽略。成员激活不得启动成员 Action 或报告成员 Action 待处理反馈。
- **FR12 — 连接式组与间隔组保持区分。** ButtonGroup 的连接式呈现移除成员之间的间隙、共享外边、拥有一个悬浮，并使用其文档化的游走焦点键盘模型。当前的 ToggleButtonGroup 保持由间隙分隔的独立子表面；每个子级可以拥有自己的悬浮，包装器不拥有阴影。未来的连接式切换呈现必须将悬浮移到组上，并使成员变为扁平。

## Allowed component variation

- **AV1 — 瞬时操作与持续操作。** Button 和 IconButton 不保留按下状态。ToggleButton 拥有 `isPressed`、`onPressedChange`、`pressedChangeAction` 和按下状态呈现。
- **AV2 — 可见内容与仅图标内容。** Button 可以渲染可见标签、自定义可见内容、前置图标和尾部内容。IconButton 始终渲染一个必需的图标，不显示可见标签。ToggleButton 可以使用可见内容或仅图标内容，并可以在按下时替换其图标。
- **AV3 — 视觉强调。** Button 和 IconButton 暴露 Button 变体映射。ToggleButton 拥有其选中/凹陷处理，而不是发明一个瞬时操作层级。主题可以改变外观而不改变这些语义。
- **AV4 — 导航。** 当提供 `href` 时，Button 和 IconButton 可以渲染为链接。ToggleButton 仍是带有 `aria-pressed` 的操作；由其 Action 支持的导航不会将控件变成目标链接。
- **AV5 — 组键盘模型。** ButtonGroup 可以为连接式操作集群使用游走焦点。ToggleButtonGroup 保留为其按下按钮集合文档化的键盘和选择行为。仅凭视觉相似并不要求两个组使用相同的复合控件模型。
- **AV6 — Tooltip 所有权。** 组件可以要求显式 tooltip，或为仅图标用法提供文档化的自动 tooltip。无论哪种方式，可访问标签仍然是必需的。

## Representative matrix

| 成员与状态                                 | 共享不变量                                             | 刻意差异                                          |
| ------------------------------------------ | ------------------------------------------------------ | ------------------------------------------------- |
| `component:Button` / 普通操作              | 具名、定尺寸、可聚焦的操作表面；一次性触发的待处理行为 | 可见内容、变体、表单类型和可选链接模式            |
| `component:IconButton` / 紧凑操作或 FAB    | Button 行为、正方形几何、家族悬浮                      | 必需图标；标签是程序化的而非可见的                |
| `component:ToggleButton` / 按下与未按下    | Button 几何、命名、焦点、待处理和表面所有权            | 受控 `aria-pressed`、按下图标/处理、可中断 Action |
| `component:ButtonGroup` / 水平或垂直       | 带标签的组；继承的尺寸/禁用状态                        | 连接式边缘、一个共享悬浮、游走焦点                |
| `component:ToggleButtonGroup` / 单选或多选 | 带标签的组；继承的尺寸/禁用状态                        | 选择所有者；间隔的子表面；无包装器悬浮            |
| 未来的连接式切换组                         | 带标签的选择组和按下语义                               | 一个绘制的组表面拥有悬浮；成员不绘制悬浮          |

## Adoption and exceptions

| 组件                          | 当前采用                                            | 缺口或例外                                                           |
| ----------------------------- | --------------------------------------------------- | -------------------------------------------------------------------- |
| `component:Button`            | 拥有共享表面、尺寸、状态、Action、链接和悬浮机制    | 链接模式额外遵循 `family:navigation-destinations`                    |
| `component:IconButton`        | 继承 Button props 并始终选择仅图标呈现              | tooltip 仍是显式的使用方指南                                         |
| `component:ToggleButton`      | 继承 Button 几何、焦点、待处理呈现和渲染的悬浮状态  | 已批准的采用缺口：添加现有的可选 `elevation` prop 及匹配的主题元数据 |
| `component:ButtonGroup`       | 连接式表面、继承的尺寸/禁用状态、共享悬浮和游走焦点 | 连接时成员悬浮被有意抑制                                             |
| `component:ToggleButtonGroup` | 受控单选/多选、继承的尺寸/禁用状态和间隔布局        | 包装器不是绘制的表面，因此不暴露家族悬浮                             |

ToggleButton 悬浮是一个已批准的实现缺口。添加现有的可选 `Elevation` 轴可以恢复家族一致性，而不改变无 prop 时的渲染。其当前的透明表面被接受，但不声称透明性问题已经解决；阴影可以提供悬浮边界，任何后续的填充或轮廓处理都需要单独的视觉评审。

## Verification map

| 契约      | 验证                                                                                                  | 代表性成员与状态                                                    | 变异或失败预期                                               |
| --------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------ |
| FR1–FR3   | 角色/名称、键盘、回调、禁用和禁用原因测试；原生禁用断言等待符合性（`spec:AST-085`）                   | 文本 Button、IconButton、ToggleButton、链接模式、成员/组禁用        | 成员丢失名称、键盘路径，或在使用禁用状态下被调用             |
| FR4–FR6   | `ToggleButton.test.tsx`：回调/Action 顺序与取消、仅回调无待处理路径、仅 Action 结算，以及乐观重击测试 | 带任一/两个回调的独立 ToggleButton；Button 一次性触发 Action        | 回调被丢弃，空 Action 报告忙碌，取消被绕过，或过时状态胜出   |
| FR7       | 单元测试加上真实浏览器几何检查                                                                        | 所有尺寸；文本/仅图标；按下/未按下；加载                            | 家族高度出现偏差，仅图标不再是正方形，或状态改变外部尺寸     |
| FR8–FR10  | data 属性、主题元数据和计算阴影测试                                                                   | 独立的 Button/IconButton/ToggleButton；连接式与间隔组；每个悬浮层级 | 阴影落在错误的盒子上，状态改变深度，或公开/主题/渲染值不一致 |
| FR11–FR12 | 组语义、传播、DOM、键盘和渲染表面测试；`ToggleButton.test.tsx` 的组所有权用例                         | 带成员回调/Action 和延迟父级接受的单选/多选；连接式/间隔组          | 成员回调或 Action 与组状态竞争，或表面所有权被混淆           |

## Decision links

- `spec:AST-002/DEC-1` — 公共 API 的接纳是显式的且有证据支持。
- `family:navigation-destinations` — Button 的链接模式保留共享的导航安全契约。

## Open questions

无。

## Content boundary

本文件只负责跨组件的 Button 家族行为。组件特定的 prop 表、回调载荷类型、选择算法、变体、tooltip 策略、组布局、实现机制、当前审计结果和产品特定的操作层级，仍归其组件、架构、设计、审计或调用点所有者负责。
