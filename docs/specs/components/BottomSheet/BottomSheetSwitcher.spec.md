---
schema_version: 3
template_version: 4
kind: component
id: component:BottomSheetSwitcher
authority: current
archive_reason: null
superseded_by: null
approved_by: imdreamrunner
approved_at: 2026-10-24
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/BottomSheet/BottomSheetSwitcher.test.tsx,
    packages/core/src/BottomSheet/BottomSheetStacking.test.tsx,
    packages/core/src/Toast/ToastViewport.modalHost.test.tsx,
    packages/core/src/BottomSheet/__tests__/BottomSheetNativeModal.a11y.browser.spec.ts,
    apps/storybook/stories/BottomSheetSwitcher.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [
    spec:AST-002,
    spec:AST-027,
    spec:AST-017/FR26,
    spec:AST-017/FR28,
    spec:AST-017/FR29,
  ]
---

# BottomSheetSwitcher component contract

## Intent

BottomSheetSwitcher 协调一串互斥的 BottomSheet 子项，每个子项都呈现在自己的原生对话框（DEC-1）中，且不新增 prop、不改变默认值。其公开生命周期状态为 `deprecated`（`spec:AST-017` FR26、DEC-3、DEP-0015）：它受到支持并持续维护，本记录中的每一项要求仍然有效，而替代方案——每一步使用一个独立的 `BottomSheet`，由同一个状态值驱动，当步骤在打开步骤内部发生变化时由 `component:BottomSheet` FR10 就地替换——才是受维护文档、模板、故事以及 agent 指南所教授的做法。移除只会通过 `[breaking]` 变更在未来的某个已声明次版本中发生。下面的模态性、标识符与主题化问题仍然悬而未决。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：非破坏性；公开 props、默认值、导出、视觉输出与过渡行为均保持不变，例外是在减少动效下，交接遵循 `design:reduced-motion`（FR3），这是 `spec:AST-017` FR3 下的一项纯视觉动效变更。`ref` 所解析到的元素、以及它在交接时发生变化这一点，属于实现而非公开契约（DEC-2）。单独呈现的 switcher 流程的表现与已发布版本一致，另有三项修正：从某个步骤升起的 toast 渲染在流程之上且可被按压（FR10、`component:BottomSheet` FR13），而此前它渲染在流程之后；活动面板在服务端设置的流程在 hydration 之前渲染为关闭，随后以已就位状态打开该面板、不带入场动效（`component:BottomSheet` FR17），而此前它会在活动页面上方绘制为打开状态；以及以符合条件的 `data-autofocus` 字段（带 `hasAutoFocus` 的 `TextInput`）打开的步骤在每种引擎中都会聚焦该字段（`component:BottomSheet` AR4），而此前 Chromium 聚焦的是步骤的面板。在其他面板打开时呈现的 switcher 流程，是 `component:BottomSheet` FR12 所描述的堆叠中的一层；那是堆叠的行为，而非对 switcher 自身契约的变更
- 生命周期：`deprecated`（DEC-3、DEP-0015）。弃用不增加任何生产运行时行为，也不会在渲染后的应用中产生警告（`spec:AST-017` FR29）；`@deprecated` 元数据位于 `BottomSheetSwitcher`、`BottomSheetSwitcherProps` 以及 `BottomSheet` 的 `sheetId` 的 TypeScript 声明上，使用方文档则承载替代路线（FR29a、FR29b）。
- 受控/非受控行为：`activeSheet` 仍完全受控
- 迁移决策：DEC-3；该迁移属于 DEP-0015

使用方迁移说明属于使用方文档与发布说明。

### DEP-0015 — Deprecate `BottomSheetSwitcher` in favour of standalone step sheets

| 字段             | 值                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id               | `DEP-0015`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| cleanup          | 暂无；移除已决定在未来某个已声明次版本中进行                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| package          | `@astryxdesign/core`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| surface          | `BottomSheetSwitcher`、`BottomSheetSwitcherProps`，以及 `BottomSheet` 的 `sheetId` prop                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| old contract     | 多步骤流程是一个 `BottomSheetSwitcher`，其 `activeSheet` 通过 `sheetId` 指定一个嵌套的 `BottomSheet`；步进会执行 FR2–FR3 与 FR8 的交接                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| replacement      | 每一步使用一个独立的 `BottomSheet`，以 `isOpen={step === id}` 表示，由同一个状态值驱动；在同一次更新中关闭已打开的步骤并打开下一步——由打开步骤内的控件触发（或由代码在焦点位于其中时触发）——会执行相同的交接（`component:BottomSheet` FR10），对模态流程与 `hasScrim={false}` 流程皆然。由流程面板之外的控件改变的步骤——非模态流程旁边的页面控件，或代码在焦点位于页面控件时执行的操作——是一次关闭加一次打开，各自带有推入与弹出动效，而 switcher 会在任何 `activeSheet` 变化时执行其交接；代码在焦点位于步骤内或文档 body 上时执行的操作仍会执行交接（`component:BottomSheet` FR10 的执行者在步骤内，或者没有执行者）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| direct authority | 此处为 DEC-3；`component:BottomSheet` DEC-2 与 FR10 拥有替代方案的行为。所有者：`cixzhang`、`imdreamrunner`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| warning          | 声明上的 `@deprecated`；使用方文档、模板、故事与发布说明指明替代方案。无运行时警告（`spec:AST-017` FR29）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| migration        | 按流程有序且可测试：(1) 用单个 `step` 值替换 `activeSheet` / `onActiveSheetChange`；(2) 为每一步提供 `isOpen={step === 'id'}` 与 `onOpenChange={isOpen => !isOpen && setStep(current => (current === 'id' ? null : current))}`，以替代 `sheetId="id"`；(3) 移除包装器，把它的 `hasScrim` 移到每一步上；(4) 保持步骤控件不变（`setStep('next')`）；(5) 由面板之外的控件步进的流程（非模态流程旁边的页面控件，或代码在焦点位于页面控件时执行的操作）以推入与弹出动效替代交接——把此类控件移入步骤，或接受该动效；代码在焦点位于步骤内或 body 上时执行的操作保留交接；(6) switcher 的其他 props：`onCancel` 变成每一步上一个带守卫的 `onOpenChange`——在流程必须保持打开时忽略 `false`——从而保留步骤的对话框角色；独立面板把 Escape、平台关闭、遮罩点击与滑动一律报告为不带原因的 `onOpenChange(false)`，因此该守卫在其生效期间会挡下所有这些请求、让步骤保持打开，而 switcher 的 `onCancel` 只否决取消请求；仅否决 Escape 没有对应做法，唯一的逐路径杠杆是 `purpose`（`form` 保留 Escape，阻止遮罩点击与滑动；`required` 阻止全部三者，并把步骤暴露为 `alertdialog`）；不存在逐事件否决；使用方的 `aria-label` / `aria-labelledby` 变成每一步的 `label`，用以命名其对话框；`ref`、`id`、`data-testid`、`className`、`style`、`xstyle` 以及其他对话框 props 没有对话框层级的对应项——独立面板的 `ref` 与基础 props 落在其面板 `<div>` 上，其对话框属于实现——因此需要对话框的测试或锚点会查询面板的 `closest('dialog')`，对话框层级的样式会被丢弃 |
| codemod          | 无；该重写移动的是调用方拥有的状态，且篇幅短到足以阅读                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| downstream       | 受维护的已发布界面在弃用补丁中迁移（`spec:AST-017` FR29c）：CLI 块模板与故事。`@astryxdesign/lab` 被标记为 `private`，仅以 `@canary` dist-tag 发布到 npm，从不作为稳定的 `latest` 发布；`spec:AST-017` 称之为“仅限 canary 的私有 Lab 包”（FR27），将其列为非目标之一，把它置于已发布的兼容性承诺之外（FR2），并说明仅限 canary 的界面不承载稳定的兼容性承诺，本记录将其理解为 FR29c 的“受维护的 Astryx 包”并不覆盖 Lab，因此在其之下 Lab 的迁移是可选的；Lab 没有 switcher 使用方，因此没有受维护界面使用该 switcher。`spec:AST-017` 是否应按这种方式解读，由其所有者裁定。switcher 自身的故事仍作为其带标注的参考保留。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| transition       | 无先前的过渡                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| state            | `deprecated`：受支持，随其替代方案一并记录，运行时不变——这是 `spec:AST-017` FR28 要求移除之前必须完成的弃用补丁，并通过声明与文档投射（FR29a、FR29b）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| open decision    | 哪个已声明次版本移除该界面，以及是否在移除之前先提供一个重命名的兼容导出；两者中任一项都是已声明次版本的 `[breaking]` 变更（`spec:AST-017` FR28、FR31）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| target plan      | 在未来某个已声明次版本中通过 `[breaking]` Changeset 移除；未指定具体发布版本                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |

## Ownership boundary

**拥有**

- 每个直接嵌套的 BottomSheet 子项的原生对话框的呈现生命周期：哪一个被呈现、在交接期间被保留，或被关闭。
- 哪个子面板处于活动状态、在交接期间被保留，或被隐藏。
- 哪个面板对话框承载该流程（其 ref、`id` 与关闭登记）以及哪一个绘制流程唯一的遮罩，外加该流程的 Escape/平台关闭路由与最终焦点返回。焦点收束属于原生模态对话框；该流程唯一的页面滚动锁定在整个模态流程期间保持（DEC-1）。
- 流程包装器：在本地对非模态面板对话框排序的隔离界面（`spec:AST-027` FR2）。

**不拥有 / 非目标**

- 子面板的面板、内容、手柄、高度、吸附点、滑动机制或局部视觉样式——归 `component:BottomSheet` 所有。
- 页面级的堆叠或裁剪逃逸——归 `architecture:layer-runtime` 与 `spec:AST-027` 所有。
- 已呈现面板的堆叠、其顺序、其唯一可见遮罩，以及独立面板之间的替换交接——归 `component:BottomSheet` DEC-2 所有。switcher 流程作为一层参与其中（此处 FR10，彼处 FR12）；它不会把自己相对于其他面板排序。

## Public concepts

| 概念       | 封闭取值或状态                              | 含义                                                                                                                                                                   | 按变体/方向/状态的可用性                               | 默认值                          | 所有者                                                               | 稳定性             | 无效值行为                                       |
| ---------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ------------------------------- | -------------------------------------------------------------------- | ------------------ | ------------------------------------------------ |
| 活动面板   | `null` 或一个嵌套 BottomSheet 的 `sheetId`  | 选择唯一的可交互子项，或关闭该流程                                                                                                                                     | 所有呈现方式                                           | `null` 表示关闭；该 prop 为必填 | `component:BottomSheetSwitcher`                                      | 已弃用（DEP-0015） | 不匹配或重复的 id 在当前契约下没有安全的公开回退 |
| 共享呈现   | 通过 `hasScrim` 取 `true` / `false`         | 选择当前的模态遮罩宿主或非模态无遮罩宿主                                                                                                                               | 整个流程                                               | `true`                          | `component:BottomSheetSwitcher`                                      | 已弃用（DEP-0015） | 仅限布尔值                                       |
| 子项标识   | 每个直接 BottomSheet 子项上非空的 `sheetId` | 把受控选择、标注、用途与过渡状态关联到某个子项                                                                                                                         | 直接嵌套的 BottomSheet 子项                            | 无                              | `component:BottomSheet`                                              | 已弃用（DEP-0015） | 空 id 会告警并保持隐藏；重复 id 的行为未作规定   |
| 关闭请求   | `onActiveSheetChange(null)`                 | 报告一次被允许的隐式关闭，而不从调用方夺取控制权                                                                                                                       | 根据活动子项的用途，为 Escape/平台关闭、遮罩点击或滑动 | 无                              | `component:BottomSheetSwitcher`；`family:overlay-dismissal` 拥有排序 | 已弃用（DEP-0015） | 调用方可保留其受控值                             |
| 对话框界面 | 继承的对话框 props 加上 `ref` 与 `onCancel` | 对话框 props 与处理函数（含 `onCancel`）会到达每个面板对话框；`ref`、`id` 与 `data-testid` 解析到宿主对话框，面板挂载期间对象 ref 解析到的对话框永不为 null（DEC-2）。 | 整个流程                                               | 无                              | `component:BottomSheetSwitcher`                                      | 已弃用（DEP-0015） | 组件拥有的语义与处理函数保持优先                 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 依据                                                   |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ |
| FR1  | 对于每个受控的 `activeSheet` 值，零个或一个子 sheet 可交互；过渡期间其他所有子项都被隐藏，或保持惰性并带有 `aria-hidden`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源码、文档与测试                                   |
| FR2  | 每个子 sheet 各自拥有一个原生对话框。打开某个 sheet 时呈现其对话框一次；交接时，进入的 sheet 的对话框呈现在被保留者之上，并且只有在被保留的面板完成淡出后才关闭被保留的对话框。返回到某个 sheet 时，若其对话框仍在新对话框之下打开，则重新呈现它，使可交互的 sheet 成为最顶层。                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | DEC-1                                                  |
| FR3  | 交接期间，进入的 sheet 位于被保留的 sheet 之上。较高的被保留 sheet 向下对齐到较矮的进入 sheet，被保留的 sheet 只在所需的变换运动完成后才淡出。在减弱动效下，交接遵循 `design:reduced-motion`：不运行变换运动，两个 sheet 按相同顺序交叉淡化（DR2）或一次性切换（DR3）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与过渡测试；`design:reduced-motion` DR2、DR3   |
| FR4  | 关闭时，出场的 sheet 在其退出过程中被保留，随后关闭对话框。模态流程将焦点恢复到该模态流程打开时捕获的元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码与焦点测试                                     |
| FR5  | `hasScrim=true` 使用 `showModal()`、原生背景幕与原生焦点包含，并锁定页面滚动：模态流程呈现期间页面不滚动，下拉刷新与页面的回弹在其后方停止，因为模态之下的滚动锁会保持页面（`spec:AST-094` FR19），一如 UIKit 模态呈现背后的情形；该锁在交接过程中持续保持，绝不在步骤之间释放并重新获取；它仍在从某一步打开的 `Dialog` 之下保持；它在流程退出后被释放（DEC-1）。`hasScrim=false` 使用不带背景幕与滚动锁的 `show()`，并让页面保持可交互。在非模态流程中，各 sheet 对话框在 switcher 隔离的流程包装器内用局部值自行排序（DEC-1）；该包装器携带的页面级值仍是一个 `spec:AST-027` 符合性缺口。                                                                                                                                                      | DEC-1；`spec:AST-027` FR2、FR4、FR8                    |
| FR6  | 活动子项的用途管辖隐式消失：`info` 允许 Escape、点击背景幕与滑动；`form` 允许 Escape；`required` 阻止这三者并暴露 `alertdialog`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前 BottomSheet 文档与 switcher 测试                  |
| FR7  | 可见期间，switcher 参与 `family:overlay-dismissal`；一次 Escape 或平台关闭请求只到达最顶层的呈现层，后代获得更深的逻辑层作用域。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `family:overlay-dismissal` 与审计回归测试              |
| FR8  | 同一时刻只有一个背景幕绘制流程的遮罩：被保留的 sheet 的对话框在交接过程中保持它，而当被保留的对话框关闭时，进入的对话框接管它且不做淡出。来自出场 sheet 的过期手势不能改变流程的遮罩，卸载被保留的 sheet 也不能让其对话框保持打开或让流程的模态层继续被保持。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | DEC-1；当前测试                                        |
| FR10 | 当其他模态 sheet 打开时呈现的模态 switcher 流程，是 `component:BottomSheet` 栈中的一层：活动步骤的对话框就是该层，并在流程自身的交接过程中保持流程的位置；被覆盖时，流程的各对话框后退并像被覆盖的 sheet 那样被阻止，当更低的 sheet 拥有唯一的遮罩时其背景幕透明，其消失注册也退让；当它在更低的 sheet 之上关闭时，焦点按 `component:BottomSheet` FR9 返回到该 sheet 内。模态流程的宿主对话框是 toast 的被动全局出口，如同独立带背景幕 sheet 的宿主对话框，它跟随每次交接，并按栈在 sheet 之间排序（`component:BottomSheet` FR13）。在减弱动效下，流程的步骤按 `component:BottomSheet` FR15 所述移动，与独立 sheet 相同的面板运动（FR3）。渲染在某一步内容中的独立 sheet 叠在流程之上，并随该步骤一起离开。步骤绝不会与独立 sheet 配对进入替换。 | `component:BottomSheet` DEC-2、FR12                    |
| FR9  | switcher 把中性的对话框属性、样式输入与组合处理器（包括 `onCancel`）转发给每个 sheet 对话框，因此处理器会为引发该事件的任一 sheet 对话框触发；仅在宿主对话框上渲染 `id` 与 `data-testid`，因此每个在文档中只出现一次；将其 ref 附加到宿主对话框；并保留其自有的 ARIA 与消失行为。当某个 sheet 已挂载时，对象 ref 的 `current` 永不为 `null`。回调 ref 在交接时遵循 React 的语义：它返回的清理函数在从旧宿主分离时运行；没有清理函数的回调 ref 在分离时以 `null` 调用，随后以新宿主调用。                                                                                                                                                                                                                                                         | DEC-1、DEC-2；`architecture:public-component-api` INV8 |

### Allowed variation

- **AV1 — 子项内容与面板几何。** 子项内容、高度、吸附点与面板样式
  在 `component:BottomSheet` 下变化，而不改变 switcher 的单活动子项协议。
- **AV2 — 过渡时序。** 主题动效令牌可改变时序，同时保持
  FR3 中的顺序与惰性。

### Representative states

| State      | 必需不变式                                                                                                                                                                                                        | 允许的变化                                          |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- |
| Closed     | 每个 sheet 对话框都已关闭，且没有子项可交互。                                                                                                                                                                     | 子面板可保持挂载但隐藏。                            |
| First open | 匹配的子项在其自身的对话框中可见且可交互。                                                                                                                                                                        | 子项自有的高度与内容。                              |
| Handoff    | 进入的子项在其自身的对话框中可交互；被保留子项的对话框保持打开、处于惰性，并在淡出前对无障碍 API 隐藏，且在流程拥有唯一遮罩时继续绘制它——当更低的 sheet 拥有栈的遮罩时透明（FR10、`component:BottomSheet` FR6）。 | 对齐偏移取决于测量得到的面板几何。                  |
| Closing    | 出场子项在退出运动完成期间保持惰性；模态焦点与滚动的归属保持到关闭为止。                                                                                                                                          | 由主题控制的时长。                                  |
| Modal      | 原生模态宿主、背景幕、原生焦点包含与页面滚动锁均处于活动状态。                                                                                                                                                    | 活动子项的 `purpose` 控制隐式消失。                 |
| Non-modal  | 原生非模态宿主没有背景幕或滚动锁，背景内容保持可交互。                                                                                                                                                            | 当前的裁剪/堆叠限制是符合性缺口，而不是允许的例外。 |
| Stacked    | 流程被独立模态 sheet 覆盖，或覆盖它们：作为被覆盖的层，其对话框后退并被阻止，且整个栈只可见一个遮罩（FR10）。                                                                                                     | 在 `component:BottomSheet` DEC-2 下的后退几何。     |

### Transformation and precedence order

- **ORD1 — 交接完成。** 选择下一个子项 → 将前一子项标记为保留
  并惰性 → 启动进入变换及任何所需的保留对齐 → 等待
  两个变换 → 淡出保留的子项 → 隐藏它。在减弱动效下跳过变换步骤，
  进入与保留的子项交叉淡化或一次性切换（`design:reduced-motion` DR2、DR3），
  并保持此顺序。
- **ORD2 — 标签优先级。** 使用方的 `aria-label` 优先；否则使用方的
  `aria-labelledby` 优先；否则由活动或保留子项的标签命名
  对话框。

### Performance and resources

- **PR1 — 单一绘制的遮罩。** 在模态流程中，静止时恰好呈现一个 sheet
  对话框；交接期间呈现两个，且只绘制一个背景幕。
  原生模态性贯穿模态流程的子项交接，因为 sheet
  对话框自始至终都是模态的，而且唯一的页面滚动锁是为
  整个流程保持，而不是按步骤保持。非模态流程不绘制背景幕，
  也不保持锁。
- **PR2 — 稳定的子项注册。** 父级重渲染与使用方 ref
  标识的变化不会注销已挂载的子项，也不会取消进行中的交接。

## Accessibility contract

- **AR1 — 对话框语义。** 模态呈现暴露 `aria-modal`；`required`
  子项将隐式对话框角色改为 `alertdialog`；每个可见流程都有
  使用方提供或由活动子项派生的可访问名称。
- **AR2 — 焦点与惰性。** 模态焦点保持在对话框内，被保留的
  子项为惰性且 `aria-hidden`，焦点在最终退出后返回。
- **AR3 — 有序消失。** Escape 与平台关闭遵循
  `family:overlay-dismissal`，包括 IME 保护与最顶层排序。

## Design relationships

| 解剖结构或状态 | 设计要求                                                                                         | 表现权威                                   | 层级角色 | 组件契约      |
| -------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------ | -------- | ------------- |
| Sheet dialogs  | 透明的逐 sheet 宿主；活动 sheet 的宿主是流程的交互与无障碍边界（DEC-1）                          | 当前源码与公共文档；逐 sheet 条款见 DEC-1  | 结构性   | FR2、FR5、AR1 |
| Sheet panels   | 将可见面板、内容、把手与手势呈现委托给 BottomSheet                                               | `component:BottomSheet` 作为观察性上下文   | 显著     | FR1、FR3      |
| Scrim          | 可选的原生背景幕，在模态呈现中使页面变暗并阻止页面；同一时刻只有一个 sheet 对话框绘制它（DEC-1） | 当前源码与公共文档；单一绘制者条款见 DEC-1 | 支撑性   | FR5、FR8      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Sheet dialogs": {
    "none": {
      "reason": "intentional: The transparent dialogs are hosting, positioning, event, and focus machinery rather than a stable painted part."
    }
  },
  "Sheet panels": {
    "delegatesTo": {"owner": "component:BottomSheet", "target": "bottom-sheet"}
  },
  "Scrim": {
    "none": {
      "reason": "reachability-gap: The native backdrop of the sheet dialog that owns the scrim paints it but has no current public theming target."
    }
  }
}
```

## Family and system relationships

- `family:overlay-dismissal` 拥有最顶层 Escape 与平台关闭排序；switcher
  在可见期间采用该共享所有者。
- `architecture:layer-runtime` 拥有原生对话框行为与当前的宿主方式。
- `architecture:component-theming-surface` 拥有解剖结构资格与目标
  处置。
- `architecture:public-component-api` 与 `spec:AST-002` 拥有已发布的 prop、
  DOM、ref 与兼容性表面。
- `spec:AST-027` 将非模态 `show()` 加页面级 `z-index` 的路径
  标识为迁移缺口，而非例外。独立 sheet 的非模态路径
  宿主于顶层（`component:BottomSheet` FR11）；switcher 自有的
  非模态流程包装器保留该缺口，其弃用将使该缺口通过移除而非
  重新托管来关闭。
- `spec:AST-017` FR26、FR28 与 FR29 管辖生命周期状态、弃用
  补丁，以及 DEP-0015 遵循的无运行时警告规则。
- `component:BottomSheet` DEC-2 拥有流程所参与的栈，以及
  弃用指向的替换模式。

## Verification map

| 契约             | 验证                                                                                                                                 | 代表性状态                                                                                                           | 变异或失败预期                                                                                                                                                      | 审计小节                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1–FR4, FR8     | `BottomSheetSwitcher.test.tsx`                                                                                                       | 关闭、首次打开、任一完成顺序的交接、快速替换、卸载、关闭；在粗指针与细指针上减弱动效下的交接                         | 子项在错误时间变为可交互、被保留的子项过早消失、绘制第二个背景幕，或 sheet 对话框的生命周期被破坏。在减弱动效下，某个交接移动了 sheet，或在粗指针上不进行交叉淡化。 | `audit:BottomSheetSwitcher/behavior`      |
| FR5–FR7, AR1–AR3 | `BottomSheetSwitcher.test.tsx`；`BottomSheetNativeModal.a11y.browser.spec.ts`；针对页面过度滚动的 `useScrollLock.test.ts`            | 模态/非模态、info/form/required、嵌套层、IME、焦点返回、各引擎中的滚动锁、非模态局部排序                             | 模态性、消失顺序、命名、惰性、滚动锁或焦点行为出现偏差，或某个 sheet 对话框取用页面级 `z-index`。                                                                   | `audit:BottomSheetSwitcher/accessibility` |
| FR9              | `BottomSheetSwitcher.test.tsx`；导出检查                                                                                             | 跨打开/交接/关闭/卸载的 ref、回调 ref 清理、`id` 只出现一次、DOM/ARIA/data/事件、class、style、xstyle                | 某个受支持的输入被丢弃或重复、对象 ref 在 sheet 已挂载时为 null 或跳过清理，或某个输入意外覆盖了组件自有的语义。                                                    | `audit:BottomSheetSwitcher/api`           |
| Theming anatomy  | `scripts/check-knowledge.mjs`；主题测试                                                                                              | 对话框、被委托的 sheet 面板、遮罩                                                                                    | 非绘制的宿主获得目标、被委托的面板丢失其所有者，或遮罩缺口未经审查就消失。                                                                                          | `audit:BottomSheetSwitcher/theming`       |
| FR10             | `component:BottomSheet` 的堆叠测试套件（switcher 作为一层的用例）；对叠在独立 sheet 之上与之下的流程做真实浏览器的变暗与后退采样     | 被独立 sheet 覆盖的 switcher 基础层、叠在独立 sheet 之上的 switcher、步骤内容中的 sheet、在更低 sheet 之上关闭的流程 | 绘制两个背景幕、被覆盖的层不后退、被覆盖的流程接受 Escape，或当流程在 sheet 之上关闭时焦点落到 `body`。                                                             | `audit:BottomSheetSwitcher/behavior`      |
| DEP-0015         | 声明与使用方文档检查（switcher 的与 `component:BottomSheet` 的使用方文档）；三个声明上的 `@deprecated` 元数据；CLI 模板与 story 源码 | switcher 的声明、文档、模板与 story，以及 BottomSheet 的使用方文档                                                   | 某个声明缺少 `@deprecated`、某个受维护的模板、story 或 BottomSheet 的使用方文档仍把 switcher 教作多步骤路线，或在弃用下生产运行时分支、日志或输出发生变化。         | `audit:BottomSheetSwitcher/api`           |

## Decision log

### DEC-1 — Each step owns its native dialog; the switcher coordinates

**参考：** `component:BottomSheetSwitcher/DEC-1`
**决策者：** imdreamrunner, 2026-10-20

switcher 的一个步骤是一个 BottomSheet，拥有自己的原生对话框，像独立 sheet 一样呈现与关闭，因此一种 DOM 形态可同时服务独立 sheet 与 switcher 步骤，而浏览器按步骤提供模态性：惰性页面、焦点包含、用于 Escape 与平台关闭的 `cancel`，以及背景幕。switcher 只拥有任何单个对话框都无法决定的事项：哪个对话框被呈现、被保留或被关闭；唯一的遮罩从被保留的对话框到进入的对话框之间无淡化地移交；当流程返回到某个仍在新对话框之下打开的 sheet 时重新呈现它；被保留的对话框关闭时将焦点保持在活动 sheet 内；将焦点返回到流程的打开者；由活动步骤的 `purpose` 通过共享消失栈来门控 `cancel`；以及流程唯一的页面滚动锁，从模态流程被呈现的那一刻保持到其退出之后，因此两个打开对话框之间的交接绝不释放并重新获取它。switcher 的唯一元素是一个流程包装器，在模态流程中没有盒子；在非模态流程中，它是各 sheet 对话框用局部值自行排序的隔离表面。
已否决：用一个由 switcher 拥有的对话框把每个步骤作为面板来承载，因为这样步骤就不再是 sheet，而且每个独立 sheet 机制都需要第二套仅限 switcher 的实现。
已否决：在原生包含之上再加脚本焦点陷阱，因为浏览器已在模态对话框中包含焦点，而陷阱会与它的惰性相抗争。
已否决：在非模态步骤的对话框上使用页面级 `z-index`，因为 `spec:AST-027` FR4 禁止新的页面分层；包装器才是隔离所有者。

### DEC-2 — The host dialog's identity is implementation, not contract

**参考：** `component:BottomSheetSwitcher/DEC-2`
**决策者：** imdreamrunner, 2026-10-20

switcher 的 `ref`、`id` 与 `data-testid` 到达承载该流程的对话框：活动 sheet 的、出场 sheet 在其退出期间的，以及在流程关闭期间最后承载它的对话框或第一个挂载的 sheet 的，因此对象 ref 在 sheet 已挂载时永不为 `null`，而标识属性只出现一次。具体是哪个元素、以及它在交接时会改变，属于实现。已发布的文档（v0.7.1 `BottomSheetSwitcher.doc.mjs`）将 ref 描述为“Ref forwarded to the one shared native dialog.”，将 switcher 描述为“Its ref and shared DOM props target that dialog.”。在挂载时复制一次 `ref.current` 的代码会得到一个真实的 `<dialog>`，但在交接之后该元素可能已不再是宿主；应在使用时读取 `ref.current`，或使用回调 ref，以跟随流程。给 switcher 的 DOM 属性与处理器（`className`、`style`、`onCancel`、`onToggle`、`aria-*` 等）到达每个 sheet 对话框，而 `id` 与 `data-testid` 仅在宿主上，因此处理器会为引发该事件的任一 sheet 对话框触发。所有者裁定这种宿主方式——移动的宿主与逐对话框的属性——在 `spec:AST-017` FR3 下为非破坏性，因为没有视觉输出变化，也没有公共 API 表面变化。
已否决：把移动的 ref 归类为破坏性变更，因为公共 API、已记录的交互或视觉输出都没有变化。

### DEC-3 — The switcher is deprecated in favour of standalone step sheets

**参考：** `component:BottomSheetSwitcher/DEC-3`
**决策者：** imdreamrunner, 2026-10-23

多步骤流程写作每步一个独立 `BottomSheet`，由一个状态值驱动；在同一次更新中关闭已打开的步骤并打开下一个——从已打开步骤内的控件发起，或当焦点在其内时由代码发起——会运行 switcher 在其步骤之间运行的交接（`component:BottomSheet` FR10），没有 `sheetId`，也没有包装器，模态与非模态流程同理。替换方案唯一处理不同的是由流程 sheet 之外的控件改变的步骤——非模态流程旁的页面控件，或焦点在页面控件上时执行的代码——对此 switcher 会交接，而独立 sheet 以自己的运动关闭和打开，因为从 sheet 外部看，一次关闭和一次打开是两个 sheet 各自的变化，而不是一个人在其步骤间的移动；焦点在步骤内或在文档 body 上时执行的代码仍保持交接（`component:BottomSheet` FR10：操作者在步骤内，或没有操作者）。因此 switcher 不再有自己的职责，已被标记为 `deprecated`（DEP-0015）：它按已发布状态继续工作，本记录的每项要求仍然有效，其声明带有 `@deprecated`，受维护的文档与模板教授替换方案，且没有生产运行时行为变化。移除是未来某个已声明次版本中的 `[breaking]` 变更（`spec:AST-017` FR28、FR31），不在此决定。
已否决：把 switcher 保留为唯一受支持的流程 API，因为这样同一交接就需要两套实现，而调用者必须为一个 UI 在两种心智模型之间选择。
已否决：在发布替换方案的同一版本中移除 switcher，因为补丁版本不能携带 `[breaking]` 变更（`spec:AST-017` FR25、FR31），而已发布的流程必须继续工作。
已否决：在渲染时发出开发模式警告，因为整组件弃用会经由其声明与文档投射（`spec:AST-017` FR29）。

## Open questions

- **OQ1 — 模态性与遮罩绘制应继续在 `hasScrim` 之后耦合，还是
  成为彼此独立的公共概念？**（`human-api`）
- **OQ2 — 不匹配或重复的子项 `sheetId`
  应具有什么安全行为？**（`human-api`）
- **OQ3 — switcher 自有的遮罩是否应获得公共主题化目标？**
  （`human-api`）

## Content boundary

本文件不重复使用方 prop 表、审计评分、截图、
BottomSheet 面板机制、共享消失规则或层托管迁移步骤。它链接到它们的所有者。
