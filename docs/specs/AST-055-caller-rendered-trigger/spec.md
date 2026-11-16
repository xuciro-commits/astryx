---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-055
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-02
phase: accepted
owners: [cixzhang]
affects_architecture:
  [
    architecture:public-component-api,
    architecture:layer-runtime,
    architecture:interaction-modality,
  ]
affects_families: [family:overlay-dismissal]
affects_contributing: [contributing:api-conventions]
affects_consumer_docs: [DropdownMenu, ComplexSelector, MultiSelector]
review_triggers: [public-api, accessibility, behavior, styling]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/ComplexSelector/ComplexSelector.test.tsx,
    packages/core/src/MultiSelector/MultiSelector.test.tsx,
  ]
---

# Caller-rendered overlay trigger system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "public-api": ["FR1", "FR2", "FR3", "FR7", "FR8", "DEC-1", "DEC-4"],
    "accessibility": ["AR1", "AR2", "AR3", "AR4"],
    "styling": ["FR4", "FR5", "FR6", "DEC-2", "DEC-3"]
  }
}
```

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 对每一个允许调用方提供打开其浮层的控件的组件，只有一种形态：渲染 prop。组件用一个 props 对象调用调用方的函数，并按原样渲染其返回值，不做包裹。该 props 对象的类型会被导出。该 prop 名为 `renderTrigger`（DEC-5）。任何已发布的既有 prop 都不变。                                                                                                                                                                                     |
| 行为          | 调用方拥有该元素；组件拥有它回传的行为。把给定的 props 展开就是全部集成工作。若同时给出内置控件与渲染 prop，调用方的控件胜出，并触发一条开发警告。悬停与按下的绘制仍由调用方自己的 CSS 负责；打开状态通过 `aria-expanded` 到达 CSS。                                                                                                                                                                                                 |
| 最终用户影响  | 当使用者操作图标按钮、chip、头像，或某个打开菜单或选择器的列表行时，得到的是系统的键盘打开方式、按下模型、焦点返回与披露语义，而不是手写副本碰巧保留的那一套。对继续使用内置控件的调用方，一切不变。                                                                                                                                                                                                                                 |
| 构建者影响    | 提供该控件的构建者渲染一个元素，并向其上展开一个对象；无需 `ref` 管道，也无需重新推导 ARIA。调用方的新责任：该控件自身的悬停、按下与焦点绘制，以及以 `aria-expanded` 为键的打开状态样式。无法获得焦点的控件需要组件有文档说明的替代路径（AR4）。                                                                                                                                                                                     |
| 兼容性/就绪度 | 增量式：渲染 prop 默认不存在，当前每一条内置控件路径都不变。权威：`current`；`cixzhang` 于 2026-10-02 批准了本记录。仍有一个所有者问题未决（OQ3），它不改变 FR1–FR8 或 AR1–AR4。关于焦点环以及浮层相对调用方控件的位置，真实浏览器证据尚未记录。                                                                                                                                                                                     |
| 审查检查      | 否决以下情形：把调用方提供的控件渲染在组件自有的 `<button>`、链接或 `tabindex` 宿主内部；把调用方的控件包裹在无盒子的元素中，随后又由组件对其锚定或在其上绘制焦点；回传的 props 缺少披露 ARIA；组件向它并不渲染的元素写入悬停或按下绘制；两个控件同时渲染，或其中一个被静默丢弃。                                                                                                                                                    |
| 管辖规则      | [`spec:AST-002`](../AST-002/spec.md) 的 FR4、FR15、FR16 与 `spec:AST-002/DEC-1`，用于准入与每个输入单一职责；[`architecture:public-component-api`](../../architecture/public-component-api.md) 的 INV2、INV3、INV5，用于共享命名与透传语法；[`architecture:layer-runtime`](../../architecture/layer-runtime.md)，用于把浮层锚定到触发器；[`family:overlay-dismissal`](../../families/overlay-dismissal.md)，用于关闭顺序，此处不变。 |

本表是供审查用的投影；下方正文具有权威性。

## Intent

菜单或选择器常常需要从设计系统并不拥有的控件打开：工具栏里的图标按钮、头像、chip，或某个本身就是链接的列表行内部的字形图标。Astryx 组件绘制自己的控件，因此处于这种位置的构建者只能手写浮层——锚定、关闭、焦点返回、键盘打开、ARIA——而每一份副本都会走样。使用产品的人于是会遇到不同的键盘路径，以及这份副本碰巧保留的那部分无障碍能力。

本记录为这种情况在跨组件层面给出一个答案：**调用方渲染控件，组件回传让该控件工作的 props。** 它说明该形态、回传的 props 必须承载什么、样式边界落在哪里，以及这一安排必须保持的无障碍能力。

有四份草拟中的组件记录正各自为同一事实书写自己的决策。一个事实只有一个所有者（`architecture:knowledge-contracts` INV2），因此决策放在这里，那些记录引用它。

## Ownership boundary

**拥有**

- 当调用方提供打开组件浮层的控件时，组件所使用的形态：渲染 prop，而不是内容插槽，也不是包裹层。
- 回传的 props 对象必须承载什么，以及展开它就已足够。
- 样式边界在调用方元素与组件之间落在何处，以及打开状态如何到达调用方的 CSS。
- 这种安排的无障碍契约：披露状态、单一交互元素、焦点返回，以及完整的键盘路径。
- 组件同时提供内置控件与该 prop 时的解决方式。

**为什么没有现成记录能容纳它**

- [`architecture:public-component-api`](../../architecture/public-component-api.md) 是 `current` 且已获批准。一份记录只携带一个 `authority` 取值，因此把这些未获批准的声明加进去，就等于把它们呈现为已批准（`architecture:knowledge-contracts` INV1、INV5）。该记录还持有共享 API 语法，并以 `deciding_specs` 链接其人工裁决（`spec:AST-002/DEC-1`、`spec:AST-005/DEC-1`、`spec:AST-012/DEC-1`）；新的跨组件裁决应放在它所链接的规格里，而不是放在它内部。它自身的 INV18/DEC-7 边界把可观察的调用方可见行为留在产品契约中。
- [`spec:AST-002`](../AST-002/spec.md) 是 `current`，存在同样的权威问题，并且拥有另一个不同的事实：公共 API 是否被准入，以及操作与函数的命名。本记录位于 AST-002 FR4 的下游——它说明一旦通过准入，调用方提供的控件使用哪一条组合接缝。
- [`family:overlay-dismissal`](../../families/overlay-dismissal.md) 拥有浮层如何关闭，而不是它如何打开或由谁渲染控件。这里的采用方也不属于同一个兄弟家族：它们横跨菜单、上下文菜单与选择器。
- 草拟中的四份组件记录将各自持有本决策的一份私有副本，这是 INV2 所禁止的。

## Non-goals

- 包裹任意调用方内容并响应上下文手势的触发器**区域**，例如 `ContextMenu` 的右键区域。那是另一个不同的事实：没有提供控件，也没有回传 props，浮层锚定到指针而不是锚定到矩形。OQ3 请所有者确认该边界。
- 渲染在组件自有的控件内部的非交互触发器**内容**，例如 `Collapsible` 的 `trigger: ReactNode` 位于它自己的 `<button>` 内。该形态对内容依然有效且不变；FR3 只是禁止把它用于调用方提供的控件。
- 全系统范围的 `render<X>` 前缀规则本身（DEC-6）：本记录遵循它；`spec:AST-002` 与 API Conventions 页面拥有它。
- Hook 形态的触发器 API（FR8）。
- 锚定、关闭顺序、按下模型、焦点陷阱与浮层解剖结构。它们的所有者以链接指明，此处不重述。
- 只要满足本契约，等价的内部实现仍然有效。内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议以及 CI 任务/工作流拓扑都属于架构或实现范畴，除非调用方或互操作系统有意把该确切机制作为公共协议依赖。

## Public API and concepts

| 概念              | 封闭取值或状态                             | 含义                                                                             | 默认值       | 所有者             | 稳定性 |
| ----------------- | ------------------------------------------ | -------------------------------------------------------------------------------- | ------------ | ------------------ | ------ |
| 调用方渲染模式    | prop 缺省、prop 存在                       | 缺省：组件渲染自己的控件及其外围部分。存在：调用方的控件取代它们。               | 缺省         | `spec:AST-055`     | 提议中 |
| 渲染 prop         | `(props: <Name>TriggerProps) => ReactNode` | 调用方的函数；组件调用它并按原样渲染结果，不做包裹                               | —            | `spec:AST-055`     | 提议中 |
| 回传的 props      | 一个对象，展开到一个元素上                 | Ref/锚点、`id`、打开与切换的处理函数，以及 AR1 的披露 ARIA；见 FR2               | —            | `spec:AST-055`     | 提议中 |
| CSS 中的打开状态  | `aria-expanded="true"` / `"false"`         | 调用方据以设置打开状态样式的唯一系统提供信号；组件不在调用方的元素上写入任何绘制 | `false`      | `spec:AST-055`     | 提议中 |
| 悬停与按下绘制    | 调用方自己的 CSS                           | 不由组件提供，因为组件并不渲染该元素                                             | 无           | 调用方             | 提议中 |
| 两个控件都给出    | 渲染调用方的控件                           | 调用方的控件胜出；触发一条开发警告；组件自己的控件及其外围部分不渲染             | 调用方的控件 | `spec:AST-055`     | 提议中 |
| Hook 触发器 props | `triggerProps`, `getTriggerProps`          | Hook 的返回值，属于另一套约定，本记录不改变它                                    | —            | 拥有该 Hook 的记录 | 稳定   |

## Requirements

### Behavioral contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                     | 依据                                                                                  | 验证状态                   |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------- |
| FR1 | 允许调用方提供打开其浮层的控件的组件，MUST 以名为 `renderTrigger` 的渲染 prop 接收该控件（DEC-5）：该 prop 是一个函数，组件用一个 props 对象调用它，并按给定内容渲染其返回的元素。组件 MUST NOT 把返回的元素包裹在自己创建的元素中，也 MUST NOT 要求特定的标签或特定的 Astryx 组件。                       | DEC-1；`spec:AST-002` FR4                                                             | 已接受；jsdom 证据待补     |
| FR2 | 把回传的 props 展开到一个元素上 MUST 构成完整的集成。该对象 MUST 携带浮层据以定位的 ref 或锚点、AR1 所需的 `id`、在组件支持的输入路径上从该控件打开、切换与关闭浮层的每个处理函数，以及 AR1 的披露属性。该对象的类型 MUST 从组件的公共入口导出。                                                           | DEC-1；`architecture:public-component-api` INV1、INV5                                 | 已接受；jsdom 证据待补     |
| FR3 | 调用方提供的控件 MUST NOT 被当作 `ReactNode` 插槽，由组件渲染在它自己的某个交互元素内部。调用方经常传入交互组件，而那种形态会把一个交互元素嵌套在另一个交互元素之内（AR2）。渲染在组件自有控件内部的内容插槽对非交互内容依然有效，且不变。                                                                 | DEC-1；AR2                                                                            | 已接受；jsdom 证据待补     |
| FR4 | 调用方的控件 MUST 拥有自己的盒子。组件 MUST NOT 把它渲染在没有自己盒子的包裹层（`display: contents`）内部，也 MUST NOT 在该包裹层上绘制或偏移触发器的焦点指示器，或让浮层对照触发器的矩形定位：既没有可锚定的矩形，也没有可绘制的盒子。FR1 消除了对任何包裹层的需要。                                      | DEC-2；`architecture:layer-runtime` 锚定契约                                          | 已接受；需要真实浏览器证据 |
| FR5 | 调用方控件上的悬停、按下以及所有其他指针绘制 MUST 保持为调用方自己的 CSS。组件 MUST NOT 向它并不渲染的元素写入绘制。组件 MUST 把浮层的打开状态以 `aria-expanded` 发布在回传的 props 上，使调用方从已渲染的属性设置打开状态样式，而不为此新增额外公共 API。                                                 | DEC-3；`spec:AST-002` FR1、FR2                                                        | 已接受；jsdom 证据待补     |
| FR6 | 该 prop 的使用方文档 MUST 展示如何在调用方的控件上从 `aria-expanded` 设置打开状态样式，并且 MUST 说明以 `:active` 为键的按下外观不能替代它，因为 `:active` 在手指下行为并不相同，而按下绘制改为遵循 `spec:AST-094` FR11 的配置。                                                                           | DEC-3；当前没有任何核心组件依据 `aria-expanded` 设置样式，调用方没有可照抄的示例      | 已接受；文档证据待补       |
| FR7 | 当组件同时提供内置控件与该 prop 时，MUST 只渲染一个控件。调用方的控件 MUST 胜出，在组件支持的每种呈现中表现一致，且 MUST 触发一条开发警告；被替换的控件所对应的组件自有外围部分 MUST NOT 渲染。静默忽略已提供的 prop，或两者都渲染，均被否决。                                                             | `spec:AST-002` FR15（绝不静默渲染损坏状态）；`architecture:public-component-api` INV3 | 已接受；jsdom 证据待补     |
| FR8 | 返回触发器 props 的 Hook——`useLightbox`、`usePopover`、`useMenuHover` 与 `useHoverCard` 上的 `triggerProps` 与 `getTriggerProps`——遵循 Hook 约定，本记录不改变它。这些返回值名称并不构成组件 prop 名称或形态的先例。本记录不要求 Hook 增加渲染 prop，也不要求组件把其触发器 props 重新发布为 Hook 返回值。 | DEC-4                                                                                 | 由 DEC-4 确定；无代码改动  |

### Accessibility contract

- **AR1 — 调用方的控件承载披露语义。** 回传的 props MUST 在调用方的控件上放置指称浮层种类的 `aria-haspopup`、携带其打开状态的 `aria-expanded`，以及指称其元素的 `aria-controls`。当浮层的可访问名称来自该控件时，这些 props MUST 同时携带浮层 `aria-labelledby` 所指向的 `id`；若组件以其他方式为浮层命名，例如使用它自己的 `label`，则改为在其自身记录中说明。
- **AR2 — 一个交互元素，一个焦点环。** 调用方的控件 MUST 是用于打开该浮层的唯一交互元素。组件 MUST NOT 在它周围添加 `<button>`、链接或 `tabindex` 宿主：控件里套控件是无效 HTML，会破坏键盘操作与屏幕阅读器播报。控件自身的焦点环 MUST 作为可见的焦点指示器，而这需要 FR4 所保留的盒子。
- **AR3 — 焦点返回该控件。** 通过任一受支持途径关闭浮层——一次选择、Escape、一次轻度关闭，或一个命令式句柄——MUST 在该控件仍在文档中时把焦点返回给调用方的控件。
- **AR4 — 每种受支持的配置都保留完整的键盘路径。** 能获得焦点的调用方控件 MUST 像内置控件一样，完全通过键盘打开并操作浮层。当组件支持无法获得焦点的控件时，它 MUST 提供并记录另一条完整的键盘路径来打开和操作浮层；它 MUST NOT 把仅指针可用的配置呈现为受支持。

### Platform support

- 受支持的特性/引擎底线：所有受支持的渲染器与所有受支持的浏览器。此处没有任何内容受能力检测控制。
- 不受支持的行为：无法获得焦点的调用方控件在 AR4 有文档说明的替代路径下降级，绝不会降级为仅指针可用的浮层。
- 浏览器证据：FR4 与 AR2 是布局与绘制方面的声明——调用方控件上的焦点环，以及浮层相对该控件矩形的位置。jsdom 既没有布局也没有绘制，因此这两项需要真实 Chromium 证据。其余需求可在 jsdom 中证明。

## Current-state impact

- 当本记录成为 `current` 时，`architecture:public-component-api` 会在其 `deciding_specs` 中获得 `spec:AST-055`，并在其 `Deciding specs` 列表中获得一行。该记录的任何不变式都不变：FR1–FR8 落在其 INV2、INV3 与 INV5 语法之内，而不是修改它。
- `contributing:api-conventions` 获得针对调用方提供控件的渲染 prop 组合规则，写作 `renderTrigger`（DEC-5）。全系统范围的 `render<X>` 前缀规则（DEC-6）落在 `spec:AST-002` 与 API Conventions 页面中，而不是这里。
- `component:DropdownMenu`、`component:ComplexSelector` 与 `component:MultiSelector` 引用本记录，而不是各自记录同一决策的私有副本。它们的使用方文档获得 FR6 所要求的 `aria-expanded` 样式指南。
- `family:overlay-dismissal`、`architecture:layer-runtime` 与 `architecture:interaction-modality` 只被阅读，不被修改：关闭顺序、锚定与模态保留其所有者。
- 没有已发布的公共 API 发生变化。每个组件都保留其内置控件与当前默认行为。
- 当本记录为 `draft` 时，它的 `review-applicability:v1` 块不路由任何内容：全局路由只加载 `current` 声明（`architecture:knowledge-contracts` INV20）。批准后它才生效。

## Verification

| 契约          | 验证                                                                                                                 | 代表性状态                                                     | 变异或失败预期                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1, FR3, AR2 | `DropdownMenu.test.tsx`、`ComplexSelector.test.tsx`、`MultiSelector.test.tsx` 中各组件自己的调用方渲染触发器测试套件 | 调用方返回一个交互组件；调用方返回一个非按钮元素               | 出现组件自有的交互祖先，或出现第二个承担打开职责的元素，即失败：渲染出的树必须恰好只有一个。 |
| FR2           | 同样的测试套件，只展开该对象、不额外添加任何东西                                                                     | 用指针打开、用键盘打开、切换为关闭、锚点解析完成               | 出现调用方必须手工提供的 prop，或缺少导出的 props 类型，即失败。                             |
| FR4, AR2      | 与拥有者组件测试套件并列的真实 Chromium 证据                                                                         | 调用方控件上的键盘焦点；浮层相对它定位                         | 焦点环没有可绘制的盒子，或浮层丢失其锚点矩形，即失败。在 jsdom 中无法证明。                  |
| FR5, FR6      | 同样的测试套件加上该组件的使用方文档检查                                                                             | 打开与关闭；调用方依据 `aria-expanded` 设置打开状态样式        | 组件向调用方元素写入悬停或按下绘制，或 prop 的文档未给出 `aria-expanded` 途径，即失败。      |
| FR7           | 同样的测试套件，在组件支持的每种呈现中都提供两个控件                                                                 | 指针呈现与触摸呈现                                             | 渲染出两个控件、prop 被静默丢弃，或某种呈现按相反方式解决，即失败。                          |
| AR1, AR3      | 同样的测试套件                                                                                                       | 关闭、打开、已命名的浮层；通过选择、Escape、轻度关闭与句柄关闭 | 缺少披露属性、浮层未命名，或关闭后焦点落在 `<body>` 上，即失败。                             |
| AR4           | 拥有者组件的键盘测试套件                                                                                             | 可获得焦点的调用方控件；组件支持的、无法获得焦点的调用方控件   | 某种配置只能通过指针到达，或替代路径缺少文档，即失败。                                       |
| FR8           | 对上述 Hook 的源码检查                                                                                               | `useLightbox`、`usePopover`、`useMenuHover`、`useHoverCard`    | Hook 返回值被改名或改形以匹配某个组件 prop，即失败：本记录不改变其中任何一个。               |

已知的验证缺口：上文点名的各组件测试套件与真实 Chromium 证据目前在 `main` 上还不存在。本记录为 `draft`，在它们出现且所有者批准本记录之前，它不约束审查。

## Decision log

### DEC-1 — A caller-supplied overlay control is a render prop

**参考：** `spec:AST-055/DEC-1`

**决策者：** `cixzhang`、`2026-10-02`

调用方渲染控件；组件回传让它工作的 props。把这些 props 展开到一个元素上就是全部集成工作，因此构建者无需编写 `ref` 管道，也无需重新推导 ARIA，而使用产品的人在图标按钮、chip、头像或列表行上都能得到系统的键盘打开方式、焦点返回与披露语义。

已否决：按 `Collapsible` 那种形态做内容插槽——`trigger: ReactNode` 渲染在组件自有的 `<button>` 内部。调用方经常传入交互组件；按钮里套按钮是无效 HTML，会同时破坏键盘操作与屏幕阅读器播报，因此那种形态根本无法服务本情形。插槽形态对非交互触发器内容仍然正确。

### DEC-2 — The trigger owns a box

**参考：** `spec:AST-055/DEC-2`

**决策者：** `cixzhang`、`2026-10-02`

调用方的控件保有自己的盒子，组件不在它周围渲染任何包裹层。

已否决：在触发器包裹层上使用 `display: contents`。无盒子的元素让焦点指示器没有可绘制之处，也让浮层没有可锚定的矩形，于是键盘用户失去该控件本应显示的可见焦点，浮层也失去其位置。这一否决针对的是组件在调用方控件周围渲染的包裹层，以及组件对其锚定或绘制的做法；改为锚定到指针的触发器区域则是另一种情况（OQ3）。

### DEC-3 — Pointer paint stays with the caller; the open state is `aria-expanded`

**参考：** `spec:AST-055/DEC-3`

**决策者：** `cixzhang`、`2026-10-02`

调用方拥有该元素，因此悬停与按下状态由调用方自己的 CSS 负责。调用方唯一无法知道的是浮层是否打开，而回传的 props 已经以 `aria-expanded` 携带这一信息，所以打开状态通过已渲染的属性到达 CSS，而不是通过新增公共 API。

由于当前没有任何核心组件依据 `aria-expanded` 设置样式——当前每一处使用都只是输出该属性——这条途径在仓库内没有可照抄的示例，因此 FR6 要求在该 prop 上写明文档。同一份文档还要说明 `:active` 不能替代它：它在手指下行为并不相同，这也是按下绘制改为遵循 `spec:AST-094` FR11 的配置、而不用 `:active` 的原因。

### DEC-4 — Hook trigger props are a different convention

**参考：** `spec:AST-055/DEC-4`

**决策者：** `cixzhang`、`2026-10-02`

`useLightbox` 返回 `triggerProps` 与 `getTriggerProps`；`usePopover`、`useMenuHover` 与 `useHoverCard` 返回 `triggerProps`。这符合 Hook 约定，即返回一个待展开的 props 对象是常规形态，并且它完全保持原样。

已否决：把这些返回值名称读作组件 prop 名称或形态的先例。Hook 交回一个由调用方解构的值；组件 prop 交给调用方一个回调。它们是不同的约定，二者都不能决定对方。

### DEC-5 — The prop is named `renderTrigger`

**参考：** `spec:AST-055/DEC-5`

**决策者：** `cixzhang`、`2026-10-02`

`render*` 是函数取值的公共组件 prop 的既有惯例，核心中没有一个反例：`renderOption`、`renderValue`、`renderItem`、`renderToken`、`renderContent`、`renderSelectionLabel`、`renderLineContent`、`renderExpanded`、`renderGroupHeader`、`renderCell`、`renderTooltip`、`renderHoverCard`、`renderMenu`、`renderOverlay`。仅以名词命名却承载函数的 prop 只出现在调用方传入的配置对象内部，从来不是公共组件 prop。

已否决：裸名 `trigger`。它在调用点读起来不错，但该名称在系统中已经是公共的且形态不同——`Collapsible` 的 `trigger: ReactNode`——因此把它复用于函数会让一个名称对应两种形态，而 `spec:AST-002` FR16 与 `architecture:public-component-api` INV2 都不赞成这样做。读到 `renderTrigger` 的构建者也能仅凭名称知道这里期望一个函数。

### DEC-6 — `render<X>` is the prefix for every render prop

**参考：** `spec:AST-055/DEC-6`

**决策者：** `cixzhang`、`2026-10-02`

取值是返回渲染输出的函数的公共组件 prop，命名为 `render<X>`。这一惯例此前已近乎通用；此处把它写下来，使构建者能预见名称，审查者能引用它而不必重新争论。

本记录遵循该规则，而不是拥有它：公共 API 的命名规则属于 `spec:AST-002` 的事实——它在 FR11 与 FR17 中已经拥有操作与函数命名——并与 API Conventions 页面的 `Prop Naming` 一节共同拥有，该节目前判定布尔值、回调、枚举、方向与 HTML 冲突，但对函数取值的 prop 只字未提。两处都欠一次承载本规则的修订；在它们承载之前，引用本决策。

## Open questions

- **OQ3 — 包裹任意内容的触发器区域是否落在本记录范围内？**（`human-api`）

  `ContextMenu` 不接收控件：它把调用方内容包裹在自己的元素中，并在上下文手势下打开，锚定到指针而不是包裹层的矩形，且它不在该包裹层上绘制任何焦点环。未合并的 pull request #6839 提议把该包裹层改为 inline 或无盒子，好让正文中的引用也能拥有上下文菜单。

  Non-goals 把那种情形读作另一个事实，位于 FR1 之外，也位于 DEC-2 的否决之外，因为当组件不绘制焦点环并锚定到指针时，DEC-2 的两条理由——没有可绘制焦点环的东西、没有可锚定的矩形——都不适用。这里请所有者确认该边界，或把触发器区域拉进本记录范围；若如此，FR1 与 FR4 需要为它们写明例外。

## Content boundary

本记录不复述任何组件的解剖结构、prop 表、主题化目标或使用方示例，也不复述 `architecture:layer-runtime` 中的浮层定位与 anchor-name 契约、`family:overlay-dismissal` 中的关闭与 Escape 顺序、`module:DropdownMenu/useMenuPress` 中的按下模型，或 `spec:AST-002` 中的准入论证。它链接它们的权威所有者。
