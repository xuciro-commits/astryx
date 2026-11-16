---
schema_version: 3
template_version: 4
kind: component
id: component:Dialog
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
owners: [cixzhang, imdreamrunner]
review_triggers: [behavior, accessibility, public-api]
verified_by:
  [
    packages/core/src/Dialog/Dialog.test.tsx,
    packages/core/src/Dialog/DialogHeader.test.tsx,
    packages/core/src/Dialog/__tests__/Dialog.a11y.test.tsx,
    packages/core/src/Dialog/__tests__/Dialog.a11y.chromium.spec.ts,
    packages/core/src/Dialog/__tests__/Dialog.a11y.browser.spec.ts,
    packages/core/src/__tests__/modalBackdrop.test.tsx,
    packages/core/src/__tests__/ModalBackdrop.a11y.browser.spec.ts,
  ]
modules: [module:Dialog/DialogHeader]
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
    architecture:react-component-runtime,
  ]
contributing: []
system_specs: [spec:AST-013, spec:AST-020, spec:AST-021, spec:AST-094/FR35]
---

# Dialog component contract

## Intent

Dialog 在当前页面之上呈现一项模态任务。它负责该模态焦点上下文的进入与退出过渡，使键盘用户与辅助技术用户在任务开始时位于可见内容内部，并在任务关闭时返回到发起该任务的上下文。

本记录记录 Dialog 的组件本地焦点生命周期。共享的关闭、层排序、公共 API 准入与运行时资源所有权，仍归其当前的 family 与 architecture 所有者。

## Compatibility and migration

- 保留的已发布默认值：是。
- 兼容性类别：记录已交付的原生模态与内联预览之间的区分。
- 受控/非受控行为：Dialog 的可见性保持受控。
- 迁移决策：无；当前的焦点生命周期被明确化。

## Ownership boundary

**拥有**

- 原生模态变为可见之后的初始焦点；
- 默认的 DialogHeader 标题焦点目标；
- 模态关闭时将焦点返回到外部发起元素；以及
- 内联文档渲染时对模态焦点行为的抑制。

**不拥有 / 非目标**

- Escape、背景遮罩、嵌套与最顶层关闭——由 `family:overlay-dismissal` 和 `architecture:layer-runtime` 拥有；
- 后代组件上 autofocus 属性的公共准入或命名——由这些组件和 `architecture:public-component-api` 拥有；
- 焦点环外观与模态检测——由可访问性与交互权威拥有；或
- 面向每个覆盖层的通用焦点管理 API。

## Public concepts

| 概念                  | 封闭取值或状态                                      | 含义                                 | 默认值                           | 所有者                            | 稳定性         |
| --------------------- | --------------------------------------------------- | ------------------------------------ | -------------------------------- | --------------------------------- | -------------- |
| visibility            | open, closed                                        | 受控模态是否被呈现                   | 由调用方控制                     | `component:Dialog`                | stable         |
| presentation          | native modal, inline preview                        | 原生对话框行为与非模态文档渲染的对比 | native modal                     | `component:Dialog`                | stable         |
| initial-focus request | eligible descendant, default title, native fallback | 模态呈现后焦点开始的位置             | 存在 DialogHeader 标题时用该标题 | `component:Dialog` 加上后代所有者 | stable outcome |
| invoking focus        | focusable external trigger, unavailable trigger     | 关闭后当上下文仍可到达时恢复的上下文 | 尽可能恢复                       | `component:Dialog`                | stable outcome |

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 依据                                                                     | 草稿审查状态 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------------ |
| FR1 | 原生 Dialog 必须在 Dialog 应用其组件自有的初始焦点请求之前，已变为可见的模态。                                                                                                                                                                                                                                                                                                                                                                                                              | 已交付的 `showModal()` 顺序与后代焦点行为                                | settled      |
| FR2 | 原生 Dialog 必须遵循合格的后代初始焦点请求。仅当请求的渲染目标位于活动 Dialog 内部、既未隐藏也未 inert，并且能在选择执行时接收程序化焦点时，该请求才合格。当没有任何非默认的合格请求被渲染时，DialogHeader 将其标题作为默认值提供。多个非默认请求之间的顺序未指定（AV3）。                                                                                                                                                                                                                  | 已交付的 DialogHeader 与后代 autofocus 行为                              | settled      |
| FR3 | 当不存在合格的后代请求时，Dialog 必须保留原生对话框的有效初始焦点行为，而不是把焦点移到模态之外。                                                                                                                                                                                                                                                                                                                                                                                           | 原生模态语义与已交付的回退行为                                           | settled      |
| FR4 | 关闭原生 Dialog 时必须将焦点返回到仍处于连接状态、且发起了该模态的外部元素——前提是该元素能够接收焦点。后代挂载焦点不得取代该返回所有者。                                                                                                                                                                                                                                                                                                                                                    | 已交付的触发器返回意图与回归历史                                         | settled      |
| FR5 | 内联渲染不得打开模态、应用模态初始焦点、捕获焦点，或像模态已关闭那样返回焦点。                                                                                                                                                                                                                                                                                                                                                                                                              | 文档化的 `isInline` 预览行为                                             | settled      |
| FR6 | 初始焦点选择必须依据已渲染的合格后代，而不是私有组件类型或仅基于源码的假设。                                                                                                                                                                                                                                                                                                                                                                                                                | 可组合的后代契约                                                         | settled      |
| FR7 | 原生模态 Dialog 必须通过 Core 共享的焦点区域模块成为一个焦点区域：从最后一个可 Tab 的控件按 Tab 会把焦点移到第一个，从第一个按 Shift+Tab 会把焦点移到最后一个，因此焦点永远不会离开模态而进入浏览器自身的界面。无论是否按住 Alt（Option），Tab 与 Shift+Tab 都会环绕，因为 Safari 在 Option+Tab 时会移动焦点；与 Ctrl 或 Meta 组合的 Tab 会透传给浏览器。当 Dialog 从另一个 Dialog 中打开时，由持有焦点的最内层 Dialog 响应 Tab。                                                           | 所有者决策 DEC-2                                                         | settled      |
| FR8 | 在服务器上打开为模态的 Dialog 在 hydration 之前渲染为关闭状态（没有打开样式、没有 `aria-modal`，即已关闭 Dialog 的标记），并在 hydration 之后的那次渲染中打开——那是第一次能够使其成为模态的渲染；它绝不会宣称自己并不具备的模态性（`spec:AST-020` FR1，WCAG 2.2 SC 4.1.2）。内联 Dialog 不是模态的，按原样渲染。服务器渲染与 hydration 渲染产生相同的标记（`spec:AST-013` FR9），并且 hydration 之后的打开是即时完成的，没有进入动画；之后的打开与关闭照常播放动画（`spec:AST-013` FR13）。 | `spec:AST-020` FR1                                                       | settled      |
| FR9 | 在任何指针设备上，模态背景遮罩都是主题的 `--color-overlay` 压暗效果，不带模糊（没有 `backdrop-filter`）；在强制颜色模式下，对话框保留可见的边缘（系统颜色边框），从而与页面保持区分。全屏 Dialog（`variant="fullscreen"`）覆盖页面，且不绘制遮罩。                                                                                                                                                                                                                                          | 所有者决策，2026-10-25：遮罩在任何指针设备上都保持由主题控制且不带模糊。 | settled      |

### Allowed variation

- **AV1 — 初始目标。** 当表单控件、操作、标题或其他合格后代的拥有者暴露了受支持的意图时，该后代可以作为初始目标。
- **AV2 — 无请求。** 在不存在合格请求时，浏览器原生选择可以有所不同，前提是焦点不会逃出活动模态。
- **AV3 — 多个请求。** 调用方应确定一个预期的初始目标。多个同时请求之间的冲突排序不是公共 API 承诺。
- **AV4 — 不可用的调用者。** 当调用者已被移除或无法再接收焦点时，Dialog 仍必须无错误地关闭；在该状态下，它无需恢复焦点。

### Representative states

| 状态                          | 必需不变式                           | 允许的变体                     |
| ----------------------------- | ------------------------------------ | ------------------------------ |
| 带 DialogHeader 的原生模态    | 焦点之前模态已可见；标题接收默认焦点 | 另一个更早的受支持请求可能胜出 |
| 带显式后代请求的原生模态      | 所请求的合格后代接收焦点             | 后代类型与位置                 |
| 无请求的原生模态              | 焦点保持在有效的原生模态行为之内     | 浏览器选中的合格后代           |
| 模态关闭                      | 已连接的发起元素重新获得焦点         | 调用者不可用时不恢复           |
| 在模态边缘按 Tab 或 Shift+Tab | 焦点环绕到模态内部的另一端           | 哪些控件可 Tab                 |
| 内联预览                      | 周围页面的焦点保持不变               | 内联内容与布局                 |

## Accessibility contract

- **AR1 — 焦点进入可见的模态内容。** 初始焦点不得指向隐藏的模态前内容，也不得停留在活动模态之后。
- **AR2 — 焦点返回到上下文。** 关闭原生 Dialog 时，当仍然连接的外部发起上下文能够接收焦点，必须将焦点恢复到该上下文。
- **AR3 — 初始目标保持可感知。** 可编程聚焦的标题或控件必须保留其可访问的角色、名称与可操作性。

## Design relationships

Dialog 的焦点时机与目标位置不规定标题样式、模态尺寸、动效或视觉层级。这些仍归 Dialog 的组件设计与主题所有者。FR9 规定背景遮罩的外观。

## Family and system relationships

- `family:overlay-dismissal` 拥有接受哪个关闭请求的决定权，并确保一次 Escape 按键只影响最顶层的相关层。
- `architecture:layer-runtime` 拥有模态层排序与共享生命周期。
- `architecture:react-component-runtime` 拥有节点/资源替换的安全性。
- `architecture:interaction-modality` 的 INV1 决定初始焦点与关闭时返回的焦点是否显示共享的焦点指示器；Dialog 的 `Dialog.a11y.browser.spec.ts` 在指针输入与键盘输入之后验证这两者。
- 本组件拥有 Dialog 模态焦点生命周期的目标位置与返回结果。

## Verification map

| 契约         | 验证                                                                                                                                              | 代表性状态                                                                        | 变异或失败预期                                                                                                                                                                                 | 审计部分                   |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1–FR3, AR1 | `Dialog.a11y.test.tsx` 与 `Dialog.a11y.chromium.spec.ts` 中共享的 modal-dialog 绑定；本地 DialogHeader 焦点测试                                   | 标题默认、显式后代、无请求                                                        | 当焦点在原生模态性之前被应用、未命中声明的目标，或在原生回退时让可见模态失效，共享契约即失败                                                                                                   | audit:Dialog/accessibility |
| FR4, AR2     | 共享的 modal-dialog 浏览器绑定，加上本地的不可用调用者关闭测试                                                                                    | 外部触发器、后代挂载焦点、已移除的触发器                                          | 当后代焦点取代返回所有者时，共享契约会记录一个确切的当前失败；本地测试确保在调用者移除后关闭仍然安全                                                                                           | audit:Dialog/behavior      |
| AR2          | `Dialog.test.tsx` 的 "unmounting while open" 用例                                                                                                 | 仅在打开时渲染并由自身操作卸载的对话框；随其视图移除；焦点先移至别处；StrictMode  | 打开对话框卸载后焦点留在页面 body 上，或焦点从用户移动到的位置被拉回，都算失败                                                                                                                 | audit:Dialog/behavior      |
| FR5          | 内联 Dialog 测试                                                                                                                                  | DialogHeader 与可聚焦子元素                                                       | 内联预览窃取焦点或调用原生模态方法                                                                                                                                                             | audit:Dialog/behavior      |
| FR6, AR3     | 共享的 modal-dialog 绑定，加上本地的组合操作焦点测试夹具                                                                                          | DialogHeader 标题、TextInput、操作按钮                                            | 焦点依赖私有 React 子类型，或剥离了目标的语义                                                                                                                                                  | audit:Dialog/public-api    |
| FR7          | `Dialog.test.tsx`、`AlertDialog.test.tsx` 和 `CommandPalette.test.tsx` 的焦点区域套件，以及 `useFocusTrap.test.tsx` 的 "useFocusTrap chorded Tab" | 最后与第一个可 Tab 控件、Dialog 中的 Dialog、内联                                 | 从最后一个控件按 Tab 离开模态，或外层 Dialog 响应内层 Dialog 的 Tab                                                                                                                            | audit:Dialog/accessibility |
| FR8          | `Dialog.ssr.test.tsx`                                                                                                                             | 在服务器上打开；hydration；已关闭 Dialog 的标记                                   | 服务器上打开渲染却带有 `aria-modal`、打开样式，或标记与已关闭的不同；发生 hydration 错误；hydration 之后没有 `showModal()`；hydration 之后的打开带有进入动画，或之后的打开没有动画——都算失败。 | audit:Dialog/accessibility |
| FR9          | `modalBackdrop.test.tsx`；在 Chromium 与 WebKit 中的 `ModalBackdrop.a11y.browser.spec.ts`                                                         | 手机宽度下的手指；桌面宽度下的鼠标；任一指针下的强制颜色；强制颜色下的全屏 Dialog | 在任一宽度下背景遮罩上出现 `backdrop-filter`、强制颜色下没有可见边缘，或全屏 Dialog 上有边缘，都算失败。                                                                                       | audit:Dialog/accessibility |

## Decision log

### DEC-1 — Dialog owns focus timing; descendants own focus intent

**引用：** `component:Dialog/DEC-1`

**决策者：** 待所有者审查

Dialog 会等到原生模态呈现之后才应用所选的请求。后代组件拥有其受支持的焦点意图；今天使用的 DOM 标记是实现证据，而不是永久性的或新近准入的公共 API。

### DEC-2 — Every modal presentation is a focus region through one module

**引用：** `component:Dialog/DEC-2`

**决策者：** `cixzhang`，`2026-10-28`

模态表面以 APG 模态对话框模式所描述的方式包含 Tab：Tab 与 Shift+Tab 在模态的控件之间移动，并在两端环绕。Core 共享的焦点区域模块提供这种包含：对 Drawer 和 Popover 应用的 Tab 包含 `useFocusTrap`。每个模态呈现都应用同一个模块，而不是把 Tab 交给浏览器：Dialog，以及通过它实现的 AlertDialog 和 CommandPalette，模态 BottomSheet、Lightbox 和模态 Drawer。环绕中的缺陷在该模块中修复，而不是在组件中绕过。唯一的例外是已弃用的 BottomSheetSwitcher（DEP-0015）的某一步：它在 `component:BottomSheetSwitcher/DEC-1` 下保留原生包含。

已否决：把 Tab 交给原生 `showModal()`，那会把焦点从模态内部送到浏览器自身的界面。

## Open questions

无。DEC-2 已确定焦点包含。

## Content boundary

本文件不重复 Dialog 的 prop 表、关闭规则、视觉设计、私有焦点标记、审计结果或实现计划。使用方语法仍保留在 `Dialog.doc.mjs` 中；实现补救与本契约分开。
