---
schema_version: 3
template_version: 7
kind: component
id: component:ComplexSelector
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/ComplexSelector/ComplexSelector.test.tsx,
    packages/core/src/ComplexSelector/ComplexSelector.fr10.test.tsx,
    packages/core/src/ComplexSelector/ComplexSelector.focusableDisabled.test.tsx,
    packages/core/src/ComplexSelector/__tests__/ComplexSelector.a11y.chromium.spec.ts,
    apps/storybook/rtl-audit/targets.json,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:input-fields, family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:layer-runtime,
  ]
contributing: []
system_specs: [spec:AST-055, spec:AST-079/DEC-1, spec:AST-085, spec:AST-102]
---

# ComplexSelector component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 触发器在两条路径上都扮演 combobox 角色（DEC-1），且 `ComplexSelectorRenderTriggerProps` 在其既有 ref、id、处理器与弹出层 props 之外携带 `role`、`aria-label`、`aria-required` 与 `aria-disabled`。当前源码导出一个受控的富选择器外壳、其公共 props 与配套类型、一个命令式句柄、一个内容渲染函数、一个由 `spec:AST-055` 管辖的可选 `renderTrigger` 接缝，以及取代根样式 props 的命名 `container*`/`control*` 样式目标。 |
| 行为          | 内置路径组合 Field、一个弹出层为对话框的 combobox 触发器、一个指示器，以及一个已挂载的对话框弹出层。调用方渲染路径以单个未包裹的调用方控件取代 Field 与内置触发器外观，该控件携带相同的 combobox 角色与状态，而 ComplexSelector 保留锚定、打开状态、弹出层接线、焦点回归以及弹出层。                                                                                                                                   |
| 最终用户影响  | 通过丰富的自定义内容进行选择的人会得到一个命名的 combobox 触发器，它播报必填、忙碌与禁用状态（以及内置触发器上的无效状态）、键盘与指针打开、焦点恢复，以及一个在逻辑放置与视口方向上均保持可达的弹出层。                                                                                                                                                                                                               |
| 构建者影响    | 构建者提供受控值以及自定义对话框内容。他们可以使用内置字段触发器、调用命令式句柄，或把一个导出的触发器 props 对象展开到调用方渲染的控件上，该控件随后成为选择器的 combobox 字段。用 `getByRole('button')` 查找触发器的测试代码改用 `getByRole('combobox')`。                                                                                                                                                           |
| 兼容性/就绪度 | 新增可选的 `disabledMessage` prop（FR13）。除此之外有一处变化：调用方自己的 `aria-disabled` 会到达已启用的内置触发器。默认值无变化。固定触发器高度列在 Current-state impact 下。                                                                                                                                                                                                                                       |
| 审查检查      | 拒绝第二个或被包裹的交互式触发器、combobox 之外的触发器角色、combobox 角色不支持的 ARIA、缺失弹出层或禁用状态、丢失焦点回归、锚定到不同盒子或位于行内视口之外的弹出层、被抑制的 BaseProps、物理方向放置，或丢失其语义消息的状态。                                                                                                                                                                                      |
| 治理规则      | `spec:AST-055/FR1–FR7, AR1–AR4`；`architecture:public-component-api/INV1, INV3, INV5–INV9`；`family:input-fields/FR1–FR8, FR10`；`spec:AST-085/FR1, FR2, FR4`；`spec:AST-079/DEC-1`；`family:overlay-dismissal`；`architecture:component-theming-surface`；`architecture:layer-runtime`。                                                                                                                              |

本表是审查用的投影；下文正文具有权威性。

## Intent

ComplexSelector 是一个受控的选择器外壳，用于可访问交互结构比单一选项列表更丰富的选择。它拥有字段触发器或调用方渲染的锚点、对话框弹出层、打开与关闭生命周期、焦点回归、乐观值交接，以及共享的字段语义。调用方拥有弹出层内部渲染的可访问结构与选择交互。

## Compatibility and migration

- 保留的已发布默认值：`no`；触发器的角色为 combobox
- 兼容性类别：无障碍修正；省略 `renderTrigger` 会保留内置 Field、DOM 结构、目标与交互
- 受控/非受控行为：仅受控；调用方拥有 `value`，而 ComplexSelector 提供提交辅助函数
- 迁移决策：用 `getByRole('button')` 查找触发器的测试代码改用 `getByRole('combobox')`；无运行时迁移

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 内置 Field 组合、一个 combobox 触发器、加载与展开的末端控件，以及当前的 `complex-selector` 目标。
- 弹出层可见性、锚点关系、逻辑放置与对齐、焦点回归，以及 `onOpenChange` 通知。
- 在 `changeAction` 挂起期间向调用方提供的内容暴露的乐观值与忙碌状态。
- ComplexSelector 本地的 `renderTrigger` 集成：对话框命名、点击与 ArrowDown 打开、焦点回归，以及当前回传的 props 对象。
- 由当前 `complex-selector-indicator-icon` 与 `complex-selector-popup` 目标暴露的尾部指示器与弹出层表面。

**不拥有 / 非目标**

- `children` 内部的可访问角色、键盘模型与选择行为——由产品调用点及其组合的原语拥有。
- 共享的 Field 标签、描述、要求、校验与状态渲染——由 `component:Field` 与 `family:input-fields` 拥有。
- 针对语义名称与图标组件类型的通用 Icon 渲染——由 `component:Icon` 拥有。
- 通过 `startIcon` 提供的任意 ReactNode 内容——由产品调用点拥有。
- 共享的层托管、定位、原生轻量消除与 Escape 顺序——由 `architecture:layer-runtime` 与 `family:overlay-dismissal` 拥有。
- 跨组件的调用方渲染触发器 API 语法——由 `spec:AST-055` 拥有。

## Public concepts

| 概念                | 封闭值或状态                                                       | 含义                                                                          | 按变体/方向/状态划分的可用性                                                                                                                                              | 默认值                                                | 所有者                       | 稳定性 | 无效值行为                                                                                 |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------- | ------ | ------------------------------------------------------------------------------------------ |
| 受控选择            | 调用方值；乐观候选值                                               | 传给 `children` 的当前值；提交时调用 `onChange` 与可选的 `changeAction`       | 所有路径                                                                                                                                                                  | 调用方的 `value`                                      | `component:ComplexSelector`  | 稳定   | 无不受控回退                                                                               |
| 内容渲染状态        | 打开/关闭；空闲/忙碌；触发器 id；内容 id                           | 让调用方内容观察外壳状态而无需拥有可见性                                      | 所有路径                                                                                                                                                                  | 关闭且空闲                                            | `component:ComplexSelector`  | 稳定   | 每次渲染都会提供当前外壳状态                                                               |
| 触发器归属          | 内置；调用方渲染                                                   | 选择 ComplexSelector 渲染 Field/combobox 外观，还是渲染一个未包裹的调用方控件 | 存在 `renderTrigger` 时为调用方渲染                                                                                                                                       | 内置                                                  | `spec:AST-055`               | 稳定   | 调用方渲染路径优先；内置外观不存在                                                         |
| 内置变体            | `input`；`secondary`；`ghost`                                      | 带边框字段、次要按钮或幽灵按钮的触发器呈现                                    | 仅内置路径                                                                                                                                                                | `input`                                               | `component:ComplexSelector`  | 稳定   | TypeScript 会拒绝不支持的值                                                                |
| 内置尺寸            | `sm`；`md`；`lg`                                                   | 通过共享元素尺寸 token 解析触发器高度                                         | 仅内置路径                                                                                                                                                                | `md`                                                  | `component:ComplexSelector`  | 稳定   | TypeScript 会拒绝不支持的值                                                                |
| 起始内容            | 不存在；语义图标名；图标组件类型；任意 ReactNode                   | 可选的触发器前置内容                                                          | 仅内置路径                                                                                                                                                                | 不存在                                                | `component:ComplexSelector`  | 稳定   | 支持图标的值委托给 Icon；任意内容直接渲染                                                  |
| 字段元数据          | 可见/隐藏标签；描述不存在/存在；可选/必填/两者皆非；tooltip        | 提供内置 Field 的命名与辅助信息                                               | 内置路径；必填状态也会到达调用方渲染的控件                                                                                                                                | 可见标签；既非必填也非可选                            | `family:input-fields`        | 稳定   | `isRequired` 与 `isOptional` 在 combobox 上解析为一种必填状态                              |
| 可用性              | 启用；禁用                                                         | 禁用会阻止点击、ArrowDown 与命令式打开                                        | 两条路径上都使用 `aria-disabled` 并保留 Tab 停靠点                                                                                                                        | 启用                                                  | `component:ComplexSelector`  | 稳定   | 禁用会守卫两条路径上的每条打开路径与每次按压                                               |
| 禁用原因            | 不存在；非空 `disabledMessage`                                     | 通过描述触发器的 tooltip 说明被禁用的选择器为何被禁用                         | 内置触发器与 `renderTrigger` 控件同样适用：tooltip 通过回传的 ref 锚定到控件，原因加入回传的 `aria-describedby`；`renderTrigger` 调用方在禁用时会移除其控件自身的 tooltip | 不存在                                                | `component:ComplexSelector`  | 稳定   | 空原因视为不存在                                                                           |
| 忙碌                | 空闲；外部加载；挂起的 Action                                      | 向内容暴露 `aria-busy`、内置 Spinner 与 `isBusy`                              | 仅内置路径渲染 Spinner；状态对内容始终可用                                                                                                                                | 空闲                                                  | `family:input-fields`        | 稳定   | 外部忙碌与过渡忙碌解析为一种状态                                                           |
| 校验                | 不存在；警告；错误；成功                                           | 提供 Field 状态；错误还会在内置触发器上暴露无效状态                           | 仅内置路径                                                                                                                                                                | 不存在                                                | `family:input-fields`        | 稳定   | TypeScript 会拒绝不支持的值                                                                |
| 状态放置            | `attached`；`detached`；`tooltip`                                  | 选择 Field 状态的呈现方式                                                     | 仅内置路径；secondary 与 ghost 将 attached 映射为 detached                                                                                                                | input 为 `attached`；secondary 与 ghost 为 `detached` | `family:input-fields`        | 稳定   | secondary 或 ghost 请求 attached 会解析为 detached                                         |
| 弹出层放置          | `above`；`below`；`start`；`end`                                   | 请求弹出层的逻辑侧                                                            | 所有路径；层运行时可能选择回退                                                                                                                                            | `below`                                               | `architecture:layer-runtime` | 稳定   | TypeScript 会拒绝不支持的值                                                                |
| 弹出层对齐          | `start`；`center`；`end`                                           | 沿放置轴的逻辑对齐                                                            | 所有路径                                                                                                                                                                  | `start`                                               | `architecture:layer-runtime` | 稳定   | TypeScript 会拒绝不支持的值                                                                |
| 可见性控制          | 触发器动作；内容 `close`；命令式 `open`/`close`/`toggle`；观察回调 | 保持一个由组件拥有的可见性状态并报告每次转换                                  | 所有路径                                                                                                                                                                  | 关闭                                                  | `component:ComplexSelector`  | 稳定   | 禁用会守卫打开；关闭已关闭的弹出层是无操作                                                 |
| 调用方 DOM/样式输入 | 提供或省略继承的 BaseProps；`container*` 与 `control*` 部件样式    | ComplexSelector 接受的 DOM、data、ARIA 与事件输入，以及命名部件样式           | BaseProps 在两条路径上都到达主要语义控件；部件样式仅在内置路径生效                                                                                                        | 省略                                                  | `family:input-fields`        | 稳定   | 根 `xstyle`/`className`/`style` 是类型错误；`renderTrigger` 下的部件样式无效并在开发时警告 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                                                    |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| FR1  | ComplexSelector 必须保持受控：`children` 接收当前值或乐观值、提交辅助函数、关闭辅助函数与实时的外壳状态；提交辅助函数在可选的 `changeAction` 之前调用 `onChange`。                                                                                                                                                                                                                                                                                                                                                         | 当前源码、测试、`family:input-fields/FR6`                                               |
| FR2  | 内置路径必须渲染 Field、一个弹出层为对话框的 combobox 触发器、可选的起始插槽、展开/加载末端区域，以及一个已挂载的弹出层。弹出层在关闭时隐藏，在打开时显示。                                                                                                                                                                                                                                                                                                                                                                | 当前源码、文档、测试、`architecture:layer-runtime`                                      |
| FR3  | 内置触发器从共享元素尺寸 token 解析 `sm`、`md` 与 `lg`，且其高度必须随设定的文本尺寸增长（`spec:AST-102` FR4）。实现缺口：高度固定为该 token。input、secondary 与 ghost 变体保持相同的打开、关闭、取值、忙碌与弹出层行为。                                                                                                                                                                                                                                                                                                 | 当前源码、文档、测试；`family:input-fields`；`spec:AST-102` FR4                         |
| FR4  | 内置 Field 元数据必须为 combobox 触发器命名并描述它，并保留描述、状态、校验与要求语义；必填状态以 `aria-required` 到达触发器，combobox 角色支持该属性。                                                                                                                                                                                                                                                                                                                                                                    | 当前源码；`component:Field`；DEC-1                                                      |
| FR5  | 显式禁用必须在触发器（无论内置还是调用方渲染）上暴露 `aria-disabled`，同时保留其 Tab 停靠点，并必须使点击、ArrowDown、命令式 `open` 与命令式 `toggle` 成为无操作；对禁用触发器的按压不会到达任何处理器。                                                                                                                                                                                                                                                                                                                   | 当前源码、测试、`spec:AST-085/FR1, FR2, FR4`                                            |
| FR6  | 外部 `isLoading` 或挂起的 `changeAction` 必须解析为一种忙碌状态。内置路径渲染一个装饰性 Spinner、暴露 `aria-busy`，并只播报一次忙碌开始；调用方内容接收 `isBusy`；调用方渲染模式接收当前的 `aria-busy`。                                                                                                                                                                                                                                                                                                                   | 当前源码、文档、测试、`family:input-fields/FR5–FR6`                                     |
| FR7  | 警告、错误与成功必须委托给 Field 状态。错误必须在内置触发器上暴露 `aria-invalid`。使用 attached 状态时，触发器行必须以状态图标替代 chevron；使用 tooltip 状态时，必须以一个可聚焦的状态按钮替代 chevron，该按钮承载消息并描述触发器。请求 attached 状态的 secondary 与 ghost 必须解析为 detached 状态。                                                                                                                                                                                                                    | 当前源码、测试、`family:input-fields/FR8`                                               |
| FR8  | 触发器点击切换弹出层；ArrowDown 打开已关闭的弹出层；内容与命令式句柄可以关闭它；每条打开/关闭路径都通过 `onOpenChange` 报告。使用内置触发器时，仅当焦点原本会丢失时，关闭才将焦点返回触发器（`family:overlay-dismissal` FR9）；因将焦点移至别处而导致的关闭会把焦点留在那里；调用方的控件在每次关闭时都会重新获得焦点（`spec:AST-055` AR3）。                                                                                                                                                                              | 当前源码、测试、`family:overlay-dismissal`                                              |
| FR9  | 放置与对齐保持逻辑化。弹出层锚定到当前触发器，在面向它的边缘保留间距（翻转后依然保持），并通过层运行时回退与滚动行为保持内容可达。                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码；`architecture:layer-runtime`                                                  |
| FR10 | 使用 `renderTrigger` 时，调用方控件必须未包裹地渲染为唯一的打开者，替换 Field 与内置外观，并承载导出的 ref、处理器、combobox 角色、弹出层 props（`aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`）、名称、忙碌、必填与禁用状态，以及调用方继承的 BaseProps。它锚定弹出层、接收焦点回归，并保持相同的内容、句柄与打开变化行为。                                                                                                                                                                                  | `spec:AST-055/FR1–FR7, AR1–AR4`、DEC-1、当前源码与测试                                  |
| FR11 | 触发器必须在两条路径上都扮演 combobox 角色，以便所发出的每个 ARIA 状态都受支持；当触发器归属改变时，已接受的 BaseProps 与组件可用性状态绝不能静默消失。内置触发器上的调用方 `onClick` 在切换之前运行，并可通过 `preventDefault()` 取消打开，这就是该 prop 所记录的取消（`family:input-fields` DEC-8）。                                                                                                                                                                                                                    | DEC-1；`architecture:public-component-api` INV3, INV5–INV7；`family:input-fields` DEC-8 |
| FR12 | 内置 Trigger、Indicator 图标与 Popup 必须在其绘制元素上携带本地 `complex-selector`、`complex-selector-indicator-icon` 与 `complex-selector-popup` 目标。被委托与调用方拥有的内容必须保留其现有所有者。                                                                                                                                                                                                                                                                                                                     | 当前源码、文档、主题架构、目标测试                                                      |
| FR13 | 当存在 `isDisabled` 且 `disabledMessage` 非空时，悬停、键盘聚焦或轻触内置触发器会在锚定到控件盒的 tooltip 中显示该原因，且该原因在描述与状态消息之后通过 `aria-describedby` 描述触发器；弹出层仍然无法打开。状态信息提示只打开它自己的消息。空原因视为不存在。使用 `renderTrigger` 时，同样的显示与描述通过组件交给调用方控件的 props 与 ref 应用于该控件（`spec:AST-055`）。当选择器被禁用时，调用方会移除该控件自身的 tooltip；在 Tooltip 自身能够阻止控件显示两个 tooltip 之前（DEC-2），这就是该控件只显示原因的方式。 | `family:input-fields` FR4；`spec:AST-085`                                               |

### Allowed variation

- **AV1 — 弹出层内容。** 调用方提供的内容可以使用任何可访问的选择结构，而不会成为 ComplexSelector 拥有的解剖结构。
- **AV2 — 起始内容。** 语义图标名与图标组件类型通过 Icon 渲染；任意 ReactNode 内容仍归调用方所有。
- **AV3 — 触发器元素。** 当返回的控件可以接收焦点并接受所提供的集成 props 时，调用方渲染模式不要求特定标签或 Astryx 组件。
- **AV4 — 层回退。** 当前层运行时可能翻转或约束所请求的放置，以保持弹出层可达。
- **AV5 — 状态内容。** 状态消息可以不存在；存在时，Field 拥有其语义呈现。

### Representative states

| 状态                             | 必需的不变式                                                                | 允许的变化                                 |
| -------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------ |
| 内置空/已选/溢出                 | Field 与触发器保持有界；placeholder/值仍然有名称；长内容不会加宽字段        | 调用方拥有的值内容可以不同                 |
| input/secondary/ghost × sm/md/lg | 尺寸 token 与外壳行为保持一致；目前高度固定为该 token，即 FR3 缺口          | Secondary 与 ghost 采用各自的按钮处理      |
| 禁用                             | 内置触发器暴露 `aria-disabled`、保留其 Tab 停靠点，且没有任何打开路径会成功 | 调用方渲染的控件承载相同状态               |
| 外部/过渡忙碌                    | 一种忙碌状态到达 ARIA 与内容；内置尺寸保持稳定                              | 忙碌来源可以是 `isLoading` 或挂起的 Action |
| 警告/错误/成功                   | Field 拥有状态；错误暴露无效状态                                            | 消息可以不存在                             |
| 关闭/打开                        | 一个弹出层保持锚定；展开状态与焦点回归保持正确                              | 所请求的逻辑放置/对齐可以不同              |
| 调用方渲染的关闭/打开            | 一个未包裹的调用方控件拥有绘制与焦点；ComplexSelector 拥有行为与弹出层      | 调用方选择控件的元素与呈现                 |
| LTR/RTL 与宽屏/320px             | 逻辑对齐镜像翻转，且没有必需的控件变得不可达                                | 层回退侧与弹出层高度可随可用空间而不同     |

### Transformation and precedence order

- **ORD1 — 触发器内容。** `triggerLabel` 在调用方 `placeholder` 之前解析，后者又在翻译后的选择器 placeholder 之前解析。
- **ORD2 — 必填语义。** 共享的必填解析组合 `isRequired` 与 `isOptional`；结果 `aria-required` 在两条路径上都到达 combobox 触发器。
- **ORD3 — 状态放置。** Secondary 与 ghost 在 Field 渲染之前将请求的/默认的 attached 状态转换为 detached；input 变体保持所请求的放置。
- **ORD4 — 值 Action。** 提交辅助函数调用 `onChange`，然后启动可选的过渡、暴露乐观值，并在共享忙碌状态为 true 期间等待 `changeAction`。
- **ORD5 — 触发器归属。** `renderTrigger` 的存在会在内置 Field/触发器输出之前选择调用方渲染模式；两者打开同一个弹出层，并使用相同的内容与命令式句柄。
- **ORD6 — DOM/样式/事件优先级。** 在两条路径上，继承的 BaseProps 到达主要语义控件，而组件自身的触发器接线优先于它们。在内置路径上，使用方的 `onClick` 在切换之前运行并可取消它，使用方的 `onKeyDown` 在内置按键处理之后运行，`container*` 为 Field 盒子设置样式，`control*` 为控件盒子设置样式。在调用方渲染路径上，使用方处理器在内置处理之后运行且无法取消打开，`container*`/`control*` 无效。

### Performance and resources

- **PR1 — 单一层所有者。** 两条触发器路径共享一个 Popover 实例与一个已挂载的弹出层，而不复制层状态或监听器。
- **PR2 — 乐观状态。** 组件从 React 过渡状态与外部加载派生忙碌状态，而不通过 Effect 镜像它。

当前测量数据应放在审计记录中；本小节只拥有持久约束及其验证目标。

## Accessibility contract

- **AR1 — 内置名称与状态。** 触发器扮演 combobox 角色，并由字段的 `label` 命名，除非选择器被赋予 `aria-label` 或 `aria-labelledby`（后者会替代它，`family:input-fields` FR10）；它还暴露其对话框弹出层（`aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`）、必填与无效状态、描述/状态引用、忙碌状态，以及在保留 Tab 停靠点时的 `aria-disabled` 禁用状态。
- **AR2 — 调用方渲染字段。** 回传的触发器 props 携带锚点 ref、id、点击与 ArrowDown 处理器、`role="combobox"`、`aria-haspopup="dialog"`、`aria-expanded`、`aria-controls`、`aria-busy`、`aria-required` 与 `aria-disabled`，并以 `label` 命名该控件，除非选择器被赋予 `aria-label` 或 `aria-labelledby`，因为 combobox 不从其内容取名；调用方控件未包裹地渲染为唯一的打开者。
- **AR3 — 焦点生命周期。** 弹出层通过 Popover 所有者自动聚焦其内容。关闭时，仅当焦点原本会丢失时，内置触发器才将焦点返回触发器（`family:overlay-dismissal` FR9）；因将焦点移至别处而导致的关闭会把焦点留在那里；调用方的控件在每条关闭路径上都会重新获得焦点。焦点在 `onOpenChange(false)` 运行之前返回。
- **AR4 — 内容责任。** 调用方内容提供适合其自身选择模式的角色、名称、键盘模型、选中状态与焦点导航。
- **AR5 — 方向与视口。** 逻辑放置与对齐随继承的方向镜像翻转，且可滚动的弹出层内容在 320 CSS px 下仍然可达。
- **AR6 — 单一触发器角色。** 两条路径都暴露相同的 combobox 角色，并带有必填、忙碌与禁用状态，因此无论哪个控件打开弹出层，用户听到的都是这些状态。无效状态到达内置触发器，由它渲染状态消息（FR7）。

## Design relationships

| 解剖结构或状态       | 设计要求                                     | 呈现权威                                 | 层级角色     | 组件契约       |
| -------------------- | -------------------------------------------- | ---------------------------------------- | ------------ | -------------- |
| Field                | 共享的输入标签/支持/状态外壳                 | `component:Field`、`family:input-fields` | 辅助         | FR2, FR4, FR7  |
| Trigger              | 有界值/占位符表面与打开者                    | 当前组件源码与使用方文档                 | 突出         | FR2–FR5        |
| Icon 渲染的起始图标  | 通过 Icon 呈现的可选语义图标                 | `component:Icon`                         | 辅助         | FR2, FR12      |
| 调用方渲染的起始内容 | 可选的任意 React 内容，其呈现归调用方拥有    | 产品调用点                               | 视上下文而定 | FR2, FR12      |
| 忙碌 Spinner         | 不改变外壳尺寸的处理中呈现                   | `family:input-fields` 与 Spinner         | 辅助         | FR6            |
| 状态                 | 共享的警告/错误/成功呈现与消息               | `component:Field`、`family:input-fields` | 辅助         | FR7            |
| 指示器图标           | 旋转反映打开/关闭状态的展开标记              | 当前组件源码与使用方文档                 | 辅助         | FR2, FR8, FR12 |
| 弹出层               | 锚定到触发器的已绘对话框表面                 | `architecture:layer-runtime`             | 突出         | FR8–FR10       |
| 调用方渲染的触发器   | 调用方拥有的控件绘制、焦点指示与打开状态呈现 | `spec:AST-055`；调用方选择呈现           | 突出         | FR10, AR2–AR3  |

组件实现设计要求，而不复制其理由。未记录任何组件本地的主观设计决策。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Field": {"delegatesTo": {"owner": "component:Field", "target": "field"}},
  "Trigger": {"target": "complex-selector"},
  "Icon-rendered start icon": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Caller-rendered start content": {
    "none": {
      "reason": "intentional: Arbitrary ReactNode content is caller-owned and receives no ComplexSelector target."
    }
  },
  "Indicator icon": {"target": "complex-selector-indicator-icon"},
  "Popup": {"target": "complex-selector-popup"}
}
```

忙碌 Spinner 与状态是瞬态/被委托的状态，而不是当前使用方文档中的命名解剖条目。调用方渲染模式替换 Field、Trigger、起始内容、忙碌 Spinner、状态与指示器图标；调用方控件不是 ComplexSelector 拥有的绘制表面或主题目标。

## Family and system relationships

- `spec:AST-055` 拥有跨组件的 `renderTrigger` 形状、单元素集成、展开、调用方绘制、锚定、焦点回归以及真实浏览器证据要求；ComplexSelector 提供对话框特有的投影。
- `family:input-fields` 拥有共享字段几何、末端控件分隔、busy/Action 流程、状态放置以及 FR10 属性目标；ComplexSelector 在内置路径上采用这些概念。
- `spec:AST-085` 拥有禁用控件的可聚焦性与惰性按压；ComplexSelector 将其应用于内置触发器。
- `spec:AST-079/DEC-1` 拥有共享选择器触发器层级，该层级新增了 secondary 变体。
- `family:overlay-dismissal` 拥有共享的 Escape、轻触消除与关闭顺序；ComplexSelector 通过 Popover 参与其中。
- `architecture:public-component-api` 拥有公共导出可达性、BaseProps 保留、样式组合与事件组合；DEC-1 让触发器的角色与状态在两条路径上保持一致。
- `architecture:component-theming-surface` 拥有解剖结构限定、本地目标映射与委派。
- `architecture:layer-runtime` 拥有 Popover 宿主、逻辑位置、回退、原生消除与可见性协调。
- `spec:AST-059` 拥有视口上限、边距以及弹出层继承的任何已声明应用内缩；弹出层自身的 480px 内容上限是其下的更低上限。`spec:AST-090` 拥有弹出层继承的层退出。
- Field 与 Icon 保留对其委派目标与表示的所有权。

## Verification map

| Contract             | Verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Representative states                                | Mutation or failure expectation                                                                                                                          | Audit section                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1, FR6, ORD4       | `ComplexSelector.test.tsx` 的 "renders custom content with value and commits through onChange"、"runs changeAction through the provided onChange helper"、commit helper 的禁用用例、"passes a close helper to composed content"；以及 "keeps the disabled and busy state on an Astryx Button control"                                                                                                                                                                                                                                                                    | 受控值；Action；禁用的 helper；busy                  | 跳过 `onChange` 的提交、先于它的 Action、在禁用时仍提交的 helper，或 busy 状态丢失，均判定失败。证据缺口：没有测试断言 busy 播报或乐观值。               | `audit:ComplexSelector/behavior`       |
| FR2, FR3             | `ComplexSelector.test.tsx` 的 "defaults to md and reflects explicit trigger sizes"、"renders a ghost toolbar trigger with a start icon"、"applies distinct trigger chrome to the secondary variant"                                                                                                                                                                                                                                                                                                                                                                      | 尺寸；变体；起始图标                                 | 尺寸错误、缺少起始插槽，或变体没有其外观装饰，均判定失败。证据缺口：没有测试断言触发器高度，也没有断言其随文本尺寸增长（即 FR3 缺口）。                  | `audit:ComplexSelector/anatomy`        |
| FR4, AR1             | `ComplexSelector.test.tsx` 的触发器语义用例（"exposes the built-in trigger as a combobox that carries required state"、"names the built-in trigger with the field label when the caller gives no name"、调用方 aria-label 与 aria-labelledby 用例、"names the trigger by its label and shows the chosen value as its content"、"keeps the field label as the name when the trigger shows the placeholder"）；`ComplexSelector.fr10.test.tsx` 的 "keeps a caller aria-describedby alongside the field description"                                                        | 已命名、已描述、必填；调用方命名                     | 触发器未由字段命名或描述、必填状态丢失，或调用方名称被忽略，均判定失败。                                                                                 | `audit:ComplexSelector/accessibility`  |
| FR5, AR6             | `ComplexSelector.focusableDisabled.test.tsx` 用例；`ComplexSelector.test.tsx` 的 "does not open via the imperative handle when disabled"、"spreads the combobox role, required, and disabled state onto a caller control"                                                                                                                                                                                                                                                                                                                                                | 禁用的内置触发器与调用方控件                         | 原生 `disabled`、丢失的 Tab 停靠点、在禁用时仍能打开或触达处理器、聚焦中被禁用时焦点丢失，或调用方控件缺少 `aria-disabled`，均判定失败。                 | `audit:ComplexSelector/accessibility`  |
| FR7, ORD3            | `ComplexSelector.test.tsx` 的 statusVariant 用例，包括 `forces detached when variant="%s" even if statusVariant="attached"`、"shows the status icon in place of the chevron with attached status, and the chevron with detached"，以及 "puts the tooltip-placement message in a focusable info-tip that describes the trigger"；`ComplexSelector.a11y.chromium.spec.ts` 矩阵静止帧（无效触发器上的 `aria-invalid`）                                                                                                                                                      | attached、detached、tooltip                          | 状态离开 Field、提示消息未描述触发器、按下 info-tip 却打开弹出层、secondary 或 ghost 上出现 attached 状态，或无效触发器缺少 `aria-invalid`，均判定失败。 | `audit:ComplexSelector/anatomy`        |
| FR8, AR3             | `ComplexSelector.test.tsx` 的 onOpenChange 用例、"Escape and a close from the content return focus to the trigger"、"a light dismiss onto another control leaves focus there; onto nothing focusable it returns to the trigger"、"a caller-rendered control gets focus back even after a light dismiss onto another control"、"does not reopen from the trigger click that follows light dismiss"、"exposes imperative open, close, toggle, and isOpen via handleRef"；`ComplexSelector.test.tsx` 的 "opens against the caller control and returns focus to it on close" | 点击、ArrowDown、Escape、轻触消除、内容关闭、handle  | 打开变化报告缺失或重复、消除之后再次打开，或焦点未回归，均判定失败。                                                                                     | `audit:ComplexSelector/accessibility`  |
| FR9, AR5             | `ComplexSelector.test.tsx` 的 "gives the popup clearance on the edge facing the trigger, which a flip carries to the other side"、"supports end-aligned popup positioning"；`ComplexSelector.a11y.chromium.spec.ts`；`apps/storybook/rtl-audit/targets.json` 的 ComplexSelector 条目                                                                                                                                                                                                                                                                                     | 起始与末端对齐；翻转；RTL                            | 弹出层没有间隙、位于错误一侧、脱离其锚点，或在 320 CSS px 时超出行内视口（审计中的窄屏与粗略打开帧），均判定失败。                                       | `audit:ComplexSelector/rtl-responsive` |
| FR10, AR2, ORD5      | `ComplexSelector.test.tsx` 的触发器 render prop 用例；`ComplexSelector.fr10.test.tsx` 的 renderTrigger 用例                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 调用方控件关闭与打开；ArrowDown；基础属性            | 被包裹或出现第二个开启者、缺少弹出层属性、基础属性或 ref 丢失，或焦点未回归，均判定失败。                                                                | `audit:ComplexSelector/accessibility`  |
| FR11, ORD6           | `ComplexSelector.fr10.test.tsx` 的 props 类型与目标用例（"puts control* on the bordered control box around the trigger, not on the trigger or the popup"、"lets a caller onClick on the trigger cancel opening, as before"、"opens from a press on the control box outside the trigger button"、"keeps the built-in keyboard model and still hands every key to a caller onKeyDown"）                                                                                                                                                                                    | 控件盒；调用方处理器                                 | 根样式属性、`control*` 落到控件盒之外、调用方按键处理器被丢弃，或调用方 `onClick` 无法取消打开，均判定失败。                                             | `audit:ComplexSelector/public-api`     |
| FR12                 | `ComplexSelector.test.tsx` 的弹出层主题目标用例与 "defaults to md and reflects explicit trigger sizes"（从 `.astryx-complex-selector` 读取）；`themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                   | 弹出层表面；`contentXstyle`                          | 弹出层目标不在绘制表面上、缺少 `complex-selector` 目标，或渲染出的类不在文档化的目标中，均判定失败。证据缺口：没有测试断言指示图标目标。                 | `audit:ComplexSelector/theming`        |
| FR13                 | `ComplexSelector.test.tsx` 的 "ComplexSelector disabledMessage" 套件（悬停、键盘聚焦与轻触显示；状态 info-tip 只打开它自己的消息；`aria-describedby` 顺序；空原因；阻止打开；Escape 与失焦；重新启用；busy 独立性；ghost 变体；调用方控件上 `renderTrigger` 的悬停、聚焦与轻触显示；原因在其自身描述之后加入调用方的 `aria-describedby`）                                                                                                                                                                                                                                | 原因缺失、为空与存在；内置触发器与调用方渲染的触发器 | 原因不显示、不描述触发器、在空字符串时显示，或允许弹出层打开，均判定失败。                                                                               | `audit:ComplexSelector/accessibility`  |
| ORD1, ORD2, PR1, PR2 | ORD1 与 ORD2 由 FR4 行覆盖。证据缺口：没有测试断言 `triggerLabel` 的优先级、唯一层所有者，或镜像状态的缺失                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                    | —                                                                                                                                                        | `audit:ComplexSelector/behavior`       |
| Theming anatomy map  | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 内置解剖结构；调用方渲染的替换                       | 缺失、多余、陈旧或重复分配的映射会令仓库校验失败。                                                                                                       | `audit:ComplexSelector/theming`        |

## Current-state impact

- **触发器高度固定（FR3）。** 内置触发器保持共享元素高度，而不会随设定的文本尺寸增长，这与 `spec:AST-102` FR4 相悖。

## Decision log

- **DEC-1 — 触发器是一个 combobox 字段。**

  **决策者：** `cixzhang`，2026-10-24

  触发器在两条路径上都充当 combobox 角色，并配有对话框弹出层，因此必填与禁用状态在其上均有效，调用方渲染的控件也会播报与内置触发器相同的字段状态。禁用遵循 `spec:AST-085`。

  已否决：把 API 收窄为按钮所支持状态的展开按钮，因为必填是选择器已经接受的字段状态。

- **DEC-2 — 禁用原因可配合调用方渲染的触发器工作**

  **决策者：** `cixzhang`、`2026-11-10`

  使用 `renderTrigger` 时，禁用原因通过组件交给调用方控件的 props 与 ref，在其上显示并加以描述（`spec:AST-055`）。所有者指示，2026 年 11 月 10 日（Cindy）：“为 render trigger 接上它”。

  所有者指示 2026-11-10：控件绝不显示两个 tooltip 的这一护栏应放在 Tooltip 系统本身，而不是每个调用方；在 Tooltip 提供该护栏之前，调用方渲染的触发器在禁用时会丢弃自己的 tooltip。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表/示例、当前审计结果、实现步骤、弹出层内部结构或 family/system 规则，而是链接到它们的所有者。
