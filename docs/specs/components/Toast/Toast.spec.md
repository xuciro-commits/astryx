---
schema_version: 3
template_version: 7
kind: component
id: component:Toast
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layer/LayerProvider.test.tsx,
    packages/core/src/Layer/toastHost.test.tsx,
    packages/core/src/Layer/toastHost.lateRegistration.test.tsx,
    packages/core/src/Toast/ToastViewport.test.tsx,
    packages/core/src/Toast/ToastViewport.modalHost.test.tsx,
    packages/core/src/Toast/__tests__/ToastSafeArea.a11y.chromium.spec.ts,
    packages/core/src/Toast/__tests__/ToastSwipeScroll.interaction.browser.spec.ts,
    packages/core/src/Toast/__tests__/ToastEmptyViewport.interaction.browser.spec.ts,
    packages/core/src/Toast/useToast.test.tsx,
    apps/storybook/stories/Toast.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:action-groups]
design_specs: [design:bidirectionality, design:reduced-motion]
architecture:
  [
    architecture:component-theming-surface,
    architecture:layer-runtime,
    architecture:interaction-modality,
  ]
contributing: []
system_specs:
  [
    spec:AST-086,
    spec:AST-003,
    spec:AST-094,
    spec:AST-100,
    spec:AST-059,
    spec:AST-027,
  ]
---

# Toast component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `useToast()` 返回一个 show 函数，它接受 `{body, type ('info' default, 'error'), isAutoHide (true for info, false for error), autoHideDuration (5000), endContent, renderContent, uniqueID, collisionBehavior ('overwrite' default, 'ignore'), onHide}` 并返回一个 dismiss 函数；`ToastViewport` 具有 `position`（`bottomEnd`）、`maxVisible`（5）、`inset`、`layerInset` 与 `isTopLayer`（true）；`Toast`；目标 `toast` 带 `type`。 |
| 行为          | 位于视口一个角落的一叠非模态通知卡片。每个 toast 只被播报一次，可自动隐藏（悬停、聚焦、触摸或窗口失焦时暂停），并可通过其按钮、朝向其边缘的垂直滑动或代码来关闭。F6 将焦点移入最新的 toast。                                                                                                                                                                                                                                        |
| 终端用户影响  | 用户获得简短提示而不失去其位置；屏幕阅读器用户每个 toast 只听到一次；键盘用户用 F6 到达 toast 控件，并在关闭后落到合理的位置；触摸用户滑动即可移走 toast。                                                                                                                                                                                                                                                                          |
| 构建者影响    | 无。                                                                                                                                                                                                                                                                                                                                                                                                                                |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。十六个实现缺口，列在 Current-state impact 一节下。                                                                                                                                                                                                                                                                                                                                                    |
| 审查检查      | 否决以下情况：一次显示中 toast 被播报多次；关闭后焦点掉到 body；用户正在阅读或交互时仍运行的自动隐藏；以滑动作为唯一的关闭方式。                                                                                                                                                                                                                                                                                                    |
| 治理规则      | `spec:AST-086` FR1；`spec:AST-003`（模态重新托管）；`spec:AST-094`；`spec:AST-100`；`spec:AST-059` FR6；`architecture:layer-runtime`；`design:bidirectionality`；`design:reduced-motion`。                                                                                                                                                                                                                                          |

本表是审查投影；下方的正文具有权威性。

## Intent

Toast 显示简短的非模态通知。本记录涵盖 toast 卡片（`Toast`）、负责堆叠、承载与播报 toast 的视口（`ToastViewport`，它没有自己的使用方文档），以及 `useToast` 的 show 函数所驱动的行为。使用方用法见 `Toast.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：toast 存在于视口的状态中；show 函数返回一个 dismiss 函数
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **视口自行构建顶层与退出。** ToastViewport 挂载自己的顶层，并运行自己的退出折叠。`architecture:layer-runtime` INV14 要求层使用运行时的顶层挂载与共享退出副本，而不是自行构建。
- **滑动按净位移判定。** 滑动在净位移超过距离阈值时关闭，或按自身平均速度计时的一次快速轻扫关闭，即使手指在释放前又移回。`spec:AST-094` FR36–FR37 在释放时依据投影位移判定一次，并取消向回移动的释放，`spec:AST-100` FR1、FR2 与 FR4 从共享跟踪器取得释放速度。
- **滑动忽略鼠标。** 只识别触摸与触控笔拖动；鼠标拖动不起作用。`spec:AST-094` FR43 将手势挂接到每个指针。
- **滑动按主题时序归位。** 释放后的提交或回弹是主题时序下的 CSS 过渡，而不是从释放速度开始（`spec:AST-094` FR38）。
- **被隐藏 toast 的覆盖会在不可见时播报。** 通过 `uniqueID` 覆盖被上限隐藏的 toast 时，会在其未显示时播报新文本，而它浮现时什么都不播报。
- **没有控件的自定义内容只能滑动。** 不渲染任何控件的 `renderContent` toast 只能通过滑动关闭，而 error toast 不会自动隐藏。`spec:AST-094` FR39 要求每个拖动操作都能在不拖动的情况下触达。
- **某些模态不提供出口。** 模态 Lightbox 或 MobileNav 打开时未提供出口，因此 toast 留在其后面；`spec:AST-003` FR18 将全局托管的层重新托管到每个原生模态之上。
- **在出口迁移中折叠的 toast 可能滞留。** 当视口移入或移出 FR12 提到的任一出口时，仍在折叠的 toast 会作为一行不可见的零高度行返回且永不卸载：它使 notifications 地标保持暴露，F6 会聚焦其隐藏的关闭按钮，并且它占用 `maxVisible` 的一个位置（FR5、FR7、FR10、FR11、FR12）。
- **播报发生在派发时，而不是显示时。** 视口在 toast 被提起时而不是在其出现时播报，因此在同一个处理函数中显示又关闭的 toast 虽从未出现却会被播报，而在同一个处理函数中超出 `maxVisible` 提起的多个 toast 中，较早的、隐藏的那个会被播报，它稍后出现时什么都不播报（FR9）。
- **自带文本的 body 可能播报与其显示不同的词。** 没有自带文本的 `body` 与 `renderContent` 卡片会按其渲染出的文本播报。自带文本的 `body`（写在其中，或作为 children 传给组件）只以该文本播报，因此组件在其旁边或代替它渲染的词（例如一条已翻译的消息）会丢失或不同。`spec:AST-086` FR7 要求播报的词与显示的词一致（FR9）。
- **操作行不跟踪按住的指针。** 在行的同级操作之间滑动的按压不会作用于抬起时所在的操作；`family:action-groups` 要求该行使用共享的按压跟踪。
- **嵌套视口可能显示两个地标。** 各持有一个 toast 的外层与内层视口会暴露两个 notifications 地标（FR11）。
- **减少动态在任何指针上都即时完成。** 在减少动态下，入场、行折叠和滑动的抛出在每种指针上都运行 0.01 ms；触摸用户得不到不透明度淡出，而 `design:reduced-motion` DR2 要求如此。
- **为零的 toast inset 不会覆盖提供方。** 设为 0 的 `toast.inset` 边缘会保留该边缘上提供方的 `layerInset`；`spec:AST-059` FR6 要求已设置的边缘替换它。与位置相对的 inset 边缘（例如底部堆叠的 `top`）会把堆叠移到该边缘。
- **视口设置了页面级 z-index。** 视口带有 `z-index: 500`；`spec:AST-027` FR1 要求 z-index 仅在局部，FR8 通过浏览器顶层来排序浮动表面。
- **被滑动的 toast 可能给 Safari 的工具栏染色。** 当其他 toast 仍在时，被滑动 toast 的退出会在最后一个 toast 离开前给 iOS Safari 的底部工具栏染色。最后一个 toast 的退出结束后约 0.25 s，Safari 恢复工具栏的颜色。

FR4 的首次移动规则有两个已接受的权衡，它们不是缺口：

- **朝边缘的轻微首次移动会保持页面不动。** 首次移动朝关闭边缘移动 1 px 的触摸属于滑动。若它随后转向背离边缘，该触摸不会使页面滚动。
- **不稳定的首次移动会把触摸交给页面。** 首次移动为横向、斜向或距边缘 1 px 的滑动不会启动，该触摸改为滚动页面。

## Ownership boundary

**拥有**

- 卡片的布局、自动隐藏时序、滑动关闭和关闭按钮（FR1–FR5）。
- 视口的放置、堆叠、碰撞处理、播报、F6 进入、焦点交接、地标和模态重新托管（FR6–FR12）。

**不拥有 / 非目标**

- Body、end content 和自定义内容——由调用方拥有。
- dismiss Button——由 `component:Button` 拥有。
- 共享播报通道——由 `spec:AST-086` 拥有；顶层托管——由 `architecture:layer-runtime` 和 `spec:AST-003` 拥有。
- `useToast` hook 的模块契约——未受契约约束；本记录涵盖它所驱动的行为。

## Public concepts

| 概念               | 封闭取值或状态                                   | 含义                                    | 按变体/方向/状态的可用性 | 默认值      | 拥有者            | 稳定性 | 无效值行为                |
| ------------------ | ------------------------------------------------ | --------------------------------------- | ------------------------ | ----------- | ----------------- | ------ | ------------------------- |
| Type               | `info`、`error`                                  | 播报的紧急程度与卡片处理方式。          | 每个 toast。             | `info`      | `component:Toast` | 稳定   | TypeScript 拒绝其他取值。 |
| Position           | `topEnd`、`topStart`、`bottomEnd`、`bottomStart` | 堆叠所在的角落，以及 toast 滑向的边缘。 | 视口。                   | `bottomEnd` | `component:Toast` | 稳定   | TypeScript 拒绝其他取值。 |
| Collision behavior | `overwrite`、`ignore`                            | 具有已存在 `uniqueID` 的 toast 会怎样。 | 带 `uniqueID` 的 toast。 | `overwrite` | `component:Toast` | 稳定   | TypeScript 拒绝其他取值。 |
| Dismiss reason     | `auto`、`manual`                                 | 报告给 `onHide`。                       | 每次关闭。               | —           | `component:Toast` | 稳定   | 不适用。                  |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                 |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- |
| FR1  | 卡片带有 `toast` 与 `type`，显示 `body`，并在其第一行显示 `endContent`，然后是名为 `@astryx.toast.dismiss` 的关闭 Button；长 body 文本在下方换行。`renderContent` 替换该布局，接收 `body`、`endContent`、`type`、时序和一个 `dismiss` 函数，且不会获得注入的关闭控件。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试       |
| FR2  | 开启自动隐藏时（`info` 的默认值，`error` 为关闭），卡片在 `autoHideDuration` ms 后以原因 `auto` 关闭。当指针位于卡片上、焦点在其中、触摸或触控笔手势处于活动状态，或窗口失焦时，计时器暂停，并以剩余时间（至少 1 s）恢复。每个暂停条件各自保持计时器：其中一个结束时，仅在没有其他条件仍成立时才恢复；焦点在卡片自身控件之间移动时保持暂停。窗口已失焦时提起的 toast 以其计时器处于暂停状态开始。                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试       |
| FR3  | 关闭按钮、滑动、一次 `dismiss` 调用或返回的 dismiss 函数会以原因 `manual` 关闭；`onHide` 最多触发一次，在 toast 被关闭时触发，即使在其退出期间被关闭两次或在显示前被关闭。通过 `uniqueID` 被替换的 toast 不会被关闭，也不报告 `onHide`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试       |
| FR4  | 从任何指针朝向该位置的块边缘拖动（`spec:AST-094` FR43），在释放时按 `spec:AST-094` FR36–FR37 判定一次：投影位移越过提交点即关闭，向起点回移的释放则取消。短距离拖动会回弹；水平意图、第二次触摸，或起于交互后代的手势不会关闭。原生页面滚动持续到触摸意图与关闭边缘匹配为止。在触摸屏上，触摸的首次移动决定：朝向关闭边缘时，滑动拥有该触摸。在默认布局中，可见的关闭按钮保留为非手势替代方式；自定义内容自行提供。实现缺口：已发布的规则在净位移超过距离阈值或按自身平均速度计时的快速轻扫时关闭，即使手指已移回，并且只识别触摸与触控笔拖动，不识别鼠标（Current-state impact）。                                                                                                                                                                                                        | 当前源码与测试       |
| FR5  | 新卡片从其边缘滑入并淡入；被关闭的卡片在卸载前折叠并淡出；两者都只沿块轴滑动。不带滑动的关闭使用主题时序；滑动的提交与回弹从释放速度开始（`spec:AST-094` FR38）。在减少动态下，入场与关闭在粗指针上或在一次触摸释放后是 200 ms 或更短的不透明度淡变（`design:reduced-motion` DR2），其他情况则即时完成（DR3），且卡片仍会卸载。实现缺口：滑动的归位是主题时序下的 CSS 过渡，而在减少动态下每个过渡（包括行折叠和滑动的抛出）在每种指针上都运行 0.01 ms（Current-state impact）。                                                                                                                                                                                                                                                                                                           | 当前源码与测试       |
| FR6  | 视口在 `position` 处堆叠 toast，最新的最靠近配置的边缘，间距为 8 px，在边缘处除其保留的安全区分隔外没有额外空间；它在自身 inset 内横跨行内轴，在任一方向上遵循起始与结束 inset。底部分隔是底部安全区 inset 之外 16 px；在粗指针下，它是该 inset 与 34 px 中较大者之外 16 px（`16px + max(env(safe-area-inset-bottom), 34px)`），因此即使在页面未报告 inset 的地方，toast 也能避开主屏幕指示器。在细指针且无 inset 时是 16 px。34 px 下限是 iPhone 主屏幕指示器的高度；它适用于每个粗指针设备，因为浏览器仅在页面选择加入时才报告 inset。每个边缘位于提供方的 `layerInset`，而 `toast.inset` 边缘在设置时会替换它（`spec:AST-059` FR6）。实现缺口：设为 0 的 `toast.inset` 边缘不会替换提供方的值，而与该位置相对的边缘（例如底部堆叠的 `top`）会把堆叠移到该边缘（Current-state impact）。 | 当前源码与测试       |
| FR7  | 当 `maxVisible` 为 1 或更大时，最多显示该数量的 toast；当提起更多时，最旧的隐藏等待，并在可见 toast 离开时返回。`maxVisible={0}` 显示每个 toast。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试       |
| FR8  | `uniqueID` 与视口所持有的某个 toast（无论是已显示、被上限隐藏还是正在退出）匹配的 toast，在 `overwrite` 下就地替换它（并会再次被播报；卡片在同一 key 下就地更新，因此其中的焦点留在同一个控件上，或在该控件不再存在时按 FR10 移动），在 `ignore` 下则被丢弃，不显示也不播报，即使两者在第一次渲染之前就被提起。实现缺口：覆盖被上限隐藏的 toast 会在其未显示时播报它，而它浮现时什么都不播报（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试       |
| FR9  | 每个已显示的 toast 有一个播报拥有者（`spec:AST-086` FR1）：视口在其显示时播报一次，`error` 用断言式，`info` 用礼貌式，使用 toast 的文本内容。托管在打开的模态中的顶层视口通过该模态的容器投递（`spec:AST-086` FR14）；否则通过共享通道。调用方就地渲染的视口通过 `useAnnounce` 播报，它通过外层模态的容器投递（`spec:AST-086` FR14）。卡片从不持有 live role。无关的渲染不会重新播报。实现缺口：视口在派发时而不是在 toast 出现时播报（Current-state impact）。                                                                                                                                                                                                                                                                                                                            | `spec:AST-086`；测试 |
| FR10 | F6 将焦点移到最新 toast 中的第一个控件。通过 F6、Tab 或点击进入视口的焦点会记录它原来所在的位置。关闭持有焦点的 toast 会把焦点移到剩余 toast 中的某个控件，或在没有剩余时回到所记住的元素。当焦点通过 Tab 或点击到达视口时，关闭获得焦点的 toast 遵循相同的交接：剩余 toast 中的某个控件，否则是所记住的元素；若目标 toast 中没有控件，F6 将焦点留在原处，且交接绝不会把焦点丢到页面 body。                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试       |
| FR11 | 当有 toast 可见时，视口是一个由 `@astryx.toast.viewport` 命名的 `region` 地标，不带 `aria-modal`；为空时不暴露地标，因此空的嵌套视口不会添加任何地标。实现缺口：各持有一个 toast 的嵌套视口会暴露两个地标（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试       |
| FR12 | 顶层视口移入最近打开的 Dialog、模态 Drawer、scrim sheet 或模态流程步骤，跟随堆叠的顶部，并在其关闭时交还给下方的那一个，在没有剩余时返回其位置，同时将每个 toast、其计时器以及焦点保持在视口内。当非模态 sheet 或没有 scrim 的 drawer 在其之后打开时，它就地重新进入顶层；当就地渲染时，或当内联 dialog、没有 scrim 的 sheet，或非模态流程打开时，它保持就位。                                                                                                                                                                                                                                                                                                                                                                                                                             | `spec:AST-003`；测试 |

### Allowed variation

- **AV1 — 内容。** Body、end content 和自定义内容会变化。
- **AV2 — 主题样式。** 主题按类型为 `toast` 重新设定样式。

### Representative states

| 状态                   | 必需的不变式                       | 允许的变化 |
| ---------------------- | ---------------------------------- | ---------- |
| Info，自动隐藏         | 礼貌式播报一次；悬停时计时器暂停。 | 时长。     |
| Error                  | 断言式播报一次。                   | —          |
| 按 uniqueID 覆盖       | 就地替换；再次播报。               | —          |
| 六个 toast，默认上限   | 最旧的隐藏等待；五个可见。         | 上限。     |
| 位于打开的 Dialog 之上 | 视口位于该 dialog 的顶层内。       | —          |

### Transformation and precedence order

- **ORD1 — 碰撞。** `ignore` 在播报前丢弃匹配的 toast；`overwrite` 替换它，然后播报。

### Performance and resources

- **PR1 — 清理。** 当 toast 卸载时，计时器、窗口监听器和原生触摸监听器都会被移除。

## Accessibility contract

- **AR1 — 一次播报。** FR9（带有 Current-state impact 下的缺口）。
- **AR2 — 键盘可达。** FR10。
- **AR3 — 时序。** FR2 在用户阅读或交互时暂停自动隐藏。
- **AR4 — 手势替代。** 在默认布局中，FR4 为每次滑动关闭保留一个按钮；自定义内容自行提供非拖动关闭方式，除了无控件自定义内容的缺口之外（Current-state impact）。

## Design relationships

| 解剖结构或状态 | 设计要求                    | 表示权威           | 层级角色 | 组件契约 |
| -------------- | --------------------------- | ------------------ | -------- | -------- |
| Body           | 会换行的消息文本。          | 当前源码与公共文档 | 突出     | FR1      |
| End content    | 第一行上的调用方控件。      | 调用方内容         | 辅助     | FR1      |
| Dismiss button | 行末的小型 ghost 图标按钮。 | `component:Button` | 辅助     | FR1、FR3 |

未记录解剖结构-主题映射：卡片带有 `toast`，但 `Toast.doc.mjs` 只命名卡片的内容（Body、End content、Dismiss button），因此没有解剖结构部分能拥有 `toast` 目标。

## Family and system relationships

- `spec:AST-086` 拥有播报通道和单一拥有者规则。
- `family:action-groups` 在 Toast 的操作行持有两个或更多同级操作时涵盖它；该行采用该 family 的按住指针跟踪。
- `spec:AST-003` 和 `architecture:layer-runtime` 拥有原生模态之上的顶层托管。
- `design:bidirectionality` 在从右到左时保持块轴滑动和行内 inset 正确。

## Verification map

| 契约          | 验证                                                                                                                                                                                                                                                                                                                                                                                                | 代表状态                                                                                   | 变更或失败预期                                                                                                      | 审计部分                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1、FR3      | `ToastViewport.test.tsx` 布局、自定义内容和 onHide 测试；`Layer/toastHost.test.tsx` 与 `toastHost.lateRegistration.test.tsx` 中在 toast 显示前被关闭或替换                                                                                                                                                                                                                                          | 默认、自定义内容、重复关闭、toast 显示前的一次关闭                                         | 控件丢失或重复的 `onHide` 即失败。                                                                                  | `audit:Toast/behavior`      |
| FR2           | `ToastViewport.test.tsx` 失焦暂停、暂停来源和失焦时提起的测试                                                                                                                                                                                                                                                                                                                                       | 窗口失焦、失焦时提起的 toast、暂停期间的新 toast、重叠的指针/焦点/窗口保持、内部移动的焦点 | 暂停时计时器仍在运行，或在另一保持仍存在时恢复，即失败。                                                            | `audit:Toast/behavior`      |
| FR4、FR5      | `ToastViewport.test.tsx` 手势与动态测试；`ToastSwipeScroll.interaction.browser.spec.ts` 从三个偏移量分别朝边缘与背离边缘的首次移动，慢速与快速                                                                                                                                                                                                                                                      | 触控笔与触摸阈值、短拖动、水平意图、第二次触摸、交互后代、RTL                              | 由被拒绝的手势引发的关闭、丢失的回弹，或偏轴漂移，即失败。                                                          | `audit:Toast/behavior`      |
| FR6–FR8       | `ToastViewport.test.tsx` 放置、上限和 uniqueID 测试；`Layer/LayerProvider.test.tsx` inset 测试；`ToastSafeArea.a11y.chromium.spec.ts` 在手指与鼠标下、inset 为 0、34 和 48 px 时的底部分隔                                                                                                                                                                                                          | 每种位置、上限 1 和一个显式上限、覆盖、忽略                                                | 顺序、上限或碰撞错误，或底部间隙不是 inset 之外 16 px，或在粗指针下不是 inset 与 34 px 中较大者之外 16 px，即失败。 | `audit:Toast/layout`        |
| FR9–FR11      | `ToastViewport.test.tsx` 播报、F6、焦点、地标和空视口测试；`ToastEmptyViewport.interaction.browser.spec.ts` 最后一个 toast 离开后没有盒子                                                                                                                                                                                                                                                           | Info、error、StrictMode、嵌套视口                                                          | 重复或紧急程度错误的播报，或 F6 进入后焦点落到 body，即失败。                                                       | `audit:Toast/accessibility` |
| FR2、FR8–FR10 | `ToastViewport.test.tsx` 的 "keeps focus on a control inside a toast that an overwrite updates"、"hands focus off when an overwrite removes the focused control"、"updates a settled toast in place when an overwrite replaces it through uniqueID"、"announces an overwrite once, through the viewport only"、"auto-hides a control-free replacement after the update removes the focused control" | 焦点在内部的覆盖；移除获得焦点控件的覆盖                                                   | 卡片被重新挂载，或焦点落到页面 body，即失败。                                                                       | `audit:Toast/accessibility` |
| FR10          | `ToastViewport.test.tsx` 的 "restores focus after a toast reached with Tab rather than F6 is dismissed"、"restores the remembered element when only a control-free toast remains"                                                                                                                                                                                                                   | 通过 Tab 或点击到达的 toast 被关闭；仅剩无控件 toast                                       | 关闭后焦点落到页面 body，即失败。                                                                                   | `audit:Toast/accessibility` |
| FR12          | `ToastViewport.modalHost.test.tsx`                                                                                                                                                                                                                                                                                                                                                                  | Dialog、嵌套 dialogs、模态与无 scrim 的 drawers、sheets 与 sheet 堆叠、模态流程            | 丢失 toast、计时器或焦点，或出口错误，即失败。                                                                      | `audit:Toast/layering`      |

从源码读取，尚无聚焦测试：

- FR1：`toast` 目标及其 `type` 状态。
- FR2：触摸手势活动时暂停，以及恢复时至少 1 s 的下限。
- FR4：鼠标拖动关闭，以及向回移动的释放取消；手势测试断言的是当前仅触摸与触控笔、按净位移的规则。
- FR5：滑动归位从释放速度开始，以及减少动态的淡变与即时变化；动态测试断言的是当前的 0.01 ms 过渡。
- FR6：已设置的 `toast.inset` 边缘在值为 0 时替换提供方的值。
- FR7：默认上限 5，以及 `maxVisible={0}` 显示每个 toast。
- FR9：由托管在该模态中的顶层视口通过打开模态的容器投递；模态宿主测试覆盖 Dialog 内部的就地视口，而播报测试读取共享通道。

## Decision log

未记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例、播报通道或层托管规则。它链接到它们的拥有者。
