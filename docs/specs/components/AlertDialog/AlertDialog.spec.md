---
schema_version: 3
template_version: 7
kind: component
id: component:AlertDialog
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, theming]
verified_by:
  [
    packages/core/src/AlertDialog/AlertDialog.test.tsx,
    packages/core/src/AlertDialog/useImperativeAlertDialog.test.tsx,
    packages/core/src/AlertDialog/__tests__/AlertDialog.interaction.browser.spec.ts,
    packages/core/src/hooks/useActionGroupTracking.test.tsx,
    packages/core/src/AlertDialog/__tests__/AlertDialog.a11y.test.tsx,
    packages/core/src/AlertDialog/__tests__/AlertDialog.a11y.chromium.spec.ts,
    packages/core/src/Dialog/Dialog.test.tsx,
    packages/core/src/Dialog/__tests__/DialogTouchEntrance.interaction.browser.spec.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:layer-runtime,
  ]
contributing: []
system_specs:
  [
    spec:AST-020/FR15,
    spec:AST-094/FR4,
    spec:AST-094/FR13,
    spec:AST-094/FR35,
    spec:AST-094/DEC-15,
  ]
---

# AlertDialog component contract

## Contract at a glance

| 方面          | 约定                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `AlertDialog`、`AlertDialogProps` 与 `useImperativeAlertDialog` 从 `@astryxdesign/core/AlertDialog` 导出；`title`、`description`、`actionLabel`、`onAction` 与 `onOpenChange` 连同 `isOpen` 都是必填的，另外还有取消标签、动作变体、加载、宽度以及内联预览模式。                                                                                                                 |
| 行为          | 一种打断式的模态确认：它通过原生 dialog 打开，点击外部无法关闭，按 Escape 或 Cancel 通过 `onOpenChange(false)` 关闭，点击动作按钮则运行 `onAction`。                                                                                                                                                                                                                             |
| 最终用户影响  | 使用键盘或屏幕阅读器的用户会被告知需要做出一项决定（标题与描述会被朗读），焦点落在 Cancel 上，并且不会因为点击别处而丢失该对话框。在触摸屏上，警报以 iOS 的观感缩放进入、淡出退出，使用主题的动效令牌，并在进入期间忽略点击（FR6、FR7）；在手机上其宽度为 320 px（FR9）；在触摸屏上，从 Cancel 滑到动作按钮再抬起的按压会运行被抬起的那个动作；鼠标的按压按原生方式生效（FR8）。 |
| 构建方影响    | 无。                                                                                                                                                                                                                                                                                                                                                                             |
| 兼容性/就绪度 | FR1–FR5、FR8 与 AR1 记录的是已交付行为，AR1 的 Tab 环绕除外。FR7 部分交付，FR6 与 FR9 是尚未交付的需求。每处差距都列在 Current-state impact 小节下。                                                                                                                                                                                                                             |
| 评审检查      | 拒绝以下情况：模态 AlertDialog 缺少 `role="alertdialog"`、标题或描述未通过 id 关联、初始焦点落在破坏性动作上，或点击背景会关闭它。                                                                                                                                                                                                                                               |
| 治理规则      | `architecture:public-component-api/INV1,INV5–INV8`；`architecture:component-theming-surface/INV3–INV7`；`architecture:layer-runtime`；`component:Dialog/AR1–AR3`；`spec:AST-020/FR15`；`spec:AST-094` FR4、FR7、FR45、FR13、FR35、DEC-15、DEC-17；`family:action-groups`；`design:reduced-motion`；`spec:AST-017`。                                                              |

本表是评审视角的投影；下文正文才是权威依据。

## Intent

AlertDialog 要求用户确认或取消一项有后果的操作。它把 Dialog 的模态、焦点与关闭运行时，与一套固定的解剖结构——标题、描述、Cancel 和一个动作——组合起来，使产品无需自行拼装就能获得打断式确认。

## Compatibility and migration

- 已发布的默认行为保持不变：`no` —— 在触摸呈现下 FR8 改变了滑动时的动作激活方式；鼠标按压保持原生按钮的行为；交付 FR6、FR7 与 FR9 会改变触摸呈现与手机宽度
- 兼容性类别：非破坏性行为变更；不涉及公共 API、DOM 或目标变更
- 受控/非受控行为：不变 —— 带 `onOpenChange` 的 `isOpen` 是受控的；对于需要 `show`/`hide` 的调用方，`useImperativeAlertDialog` 拥有这一组合
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **触摸呈现尚未交付（FR6）。** 在触摸呈现下，警报以 Dialog 的默认动效打开与关闭，而不是 FR6 所要求的缩放进入与淡出。
- **只有进入期的输入保持已交付（FR7）。** 在触摸呈现下，Dialog 在警报进入时保持指针输入。警报离开时没有任何机制让内容变为不可交互，因为它的关闭淡出尚未交付（FR6）。
- **手机宽度尚未交付（FR9）。** 在手机上，警报保持其默认宽度，而非 320 px。
- **Tab 会离开警报（AR1）。** Dialog 尚未把 Tab 限制在内部，因此从最后一个按钮按 Tab 会把焦点移出警报、交给浏览器界面，而 AR1 要求通过 `component:Dialog` FR7 让 Tab 在其中环绕。

## Ownership boundary

**拥有**

- 确认的解剖结构及其顺序：标题、描述，然后是按 FR3 所述顺序的 Cancel 与动作。
- 警报对话框角色、其名称与描述关联，以及破坏性最小的初始焦点。
- 命令式封装的 hook。
- 触摸呈现的动效、输入保持与手机宽度（FR6、FR7、FR9）。

**不拥有 / 非目标**

- 跨越动作按钮滑动的按压作用于其抬起处的动作，这由 `family:action-groups` 拥有（FR8）。
- 模态呈现、焦点返回、背景与关闭机制——由 `component:Dialog` 与 `architecture:layer-runtime` 拥有；AlertDialog 继承 Dialog 的背景（`component:Dialog` FR9）。
- 按钮变体与加载——由 `component:Button` 拥有。

## Public concepts

| 概念            | 封闭取值或状态  | 含义                                                   | 按变体/方向/状态的可用性 | 默认值          | 拥有方                  | 稳定性 | 非法值行为    |
| --------------- | --------------- | ------------------------------------------------------ | ------------------------ | --------------- | ----------------------- | ------ | ------------- |
| `isInline`      | `true`、`false` | 以内联方式渲染内容，作为非模态预览（`role="group"`）。 | 始终                     | `false`         | `component:AlertDialog` | stable | 被类型拒绝    |
| `actionVariant` | 按钮变体        | 动作按钮的强调程度。                                   | 始终                     | `'destructive'` | `component:Button`      | stable | Button 的行为 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 依据                                                            |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| FR1 | 模态 AlertDialog 通过 Dialog 的原生模态路径打开，点击背景不会关闭它。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 已交付源码（`purpose="form"`）；Alert Dialog 无障碍契约（待定） |
| FR2 | Escape 与 Cancel 按钮都会调用 `onOpenChange(false)`；动作按钮调用 `onAction`，关闭交由调用方。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 已交付源码与聚焦测试                                            |
| FR3 | 解剖结构是标题、描述，然后是按钮：在较宽屏幕上为 Cancel 后接动作，在窄屏幕上动作堆叠于 Cancel 之上，两种情况都由 Cancel 保持初始焦点；当 `isActionLoading` 时动作可显示加载状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 已交付源码与聚焦测试                                            |
| FR4 | `isInline` 渲染相同的解剖结构，但不带模态性，也不带警报对话框角色。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 已交付源码与公开文档                                            |
| FR5 | `useImperativeAlertDialog` 返回 `show`、`hide` 以及要渲染的元素，并为其调用方拥有 `isOpen`/`onOpenChange`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 已交付源码与聚焦测试                                            |
| FR6 | 在触摸呈现下（`spec:AST-094` FR13），模态 AlertDialog 的呈现方式是：从 1.2 缩放到 1，同时其不透明度与其背景的变暗从 0 升到 1，使用主题的进入时长与缓动令牌（`spec:AST-094` FR45），在浏览器提交时启动，并让较大的起始尺寸保持在视口之内；它的关闭仅靠一次淡出，使用主题的退出时长与缓动，即 `--duration-exit` 与 `--ease-exit`（`spec:AST-094` FR7；`spec:AST-090` FR14），并在淡出结束时关闭；呈现期间的关闭，或关闭期间的重开，都会从当前位置折返。`springs.alertPresent` 与 `springs.alertDismiss` 保留为 UIKit 的实测参照，没有任何动效会播放它们（`spec:AST-094` FR4）。在 Reduce Motion 下，两者都使用共享的交叉淡入淡出（`design:reduced-motion` DR1–DR3）。精细主指针保持当前的动效（`spec:AST-094` FR13 及其非目标）。实现差距：尚未交付（Current-state impact）。 | 依据实测的 iOS 26.2 行为提议                                    |
| FR7 | 在触摸呈现下，指向警报的指针输入在其进入期间被保持（`spec:AST-094` FR35）；键盘与辅助技术的输入从不被保持，进入过程也从不使内容变为不可交互。警报离开期间，其内容在关闭淡出期间处于不可交互状态。保持的时序保持在内部实现（`spec:AST-002` FR3）。实现差距：进入期的输入保持通过 Dialog 交付，而离开中警报的不可交互内容要等 FR6 的关闭机制（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                        | `spec:AST-094` FR35；拥有方决策（DEC-1）                        |
| FR8 | AlertDialog 的动作构成一个动作组（`family:action-groups`）：在触摸呈现下（`spec:AST-094` FR13），跨越它们滑动的按压会运行其抬起处所在的动作，而在它们之外抬起则不运行任何动作；鼠标按压的行为与平台原生按钮一致；键盘与辅助技术行为不变。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `family:action-groups`；`spec:AST-094` DEC-17；DEC-3            |
| FR9 | 在手机上，即在粗粒度主指针下的紧凑窗口（`spec:AST-012` FR9：窄于 `md` 或短于 500 px）中，警报在所有主题下宽度都是 320 px，与 iOS 的一致；没有主题角色设定这一点。调用方显式给出的 `width` 在那里仍然优先（`architecture:public-component-api` INV5），而当屏幕比警报更窄时，Dialog 的视口钳制仍然生效。在其他情况下，它保持当前的宽度。实现差距：尚未交付（Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                         | 拥有方决策（DEC-2）                                             |

### Allowed variation

- **AV1 — 布局。** 间距与按钮宽度遵循 Dialog 与 Layout；小屏幕的堆叠与顺序由 FR3 规定。

### Representative states

| 状态       | 必需不变式                                             | 允许的变化       |
| ---------- | ------------------------------------------------------ | ---------------- |
| 打开，模态 | `role="alertdialog"`，有名称与描述，焦点在 Cancel 上。 | 宽度、动作变体。 |
| 动作加载中 | 动作显示加载；Cancel 保持可用。                        | 加载提示形式。   |
| 内联预览   | `role="group"`，无模态性，内容相同。                   | 周围页面。       |
| 命令式     | `show()` 打开、`hide()` 关闭同一个对话框。             | 调用方的触发器。 |

### Transformation and precedence order

- **ORD1 — 关闭。** Escape 或 Cancel → `onOpenChange(false)`；点击背景 → 无动作；动作 → 仅 `onAction`。

### Performance and resources

- **PR1 — 由 Dialog 拥有的资源。** AlertDialog 自己的监听器只有支撑按钮顺序的小屏幕媒体查询，以及 `family:action-groups` FR5 赋予其动作的按压追踪；模态生命周期由 Dialog 拥有。

- **PR2 — 触摸呈现不新增元素。** 动效在对话框表面及其 `::backdrop` 上播放；在触摸呈现下 AlertDialog 不渲染额外元素，这落在 `spec:AST-017` FR60 的开放层允许范围内（`architecture:component-style-authoring` INV7）。

## Accessibility contract

- **AR1 — AlertDialog 采用 APG 的 Alert Dialog 模式**（`spec:AST-020/FR15`）：模态表面为 `role="alertdialog"`，通过 `aria-labelledby` 由其标题命名、通过 `aria-describedby` 由其描述说明；它通过 Dialog 实现模态性（按 `component:Dialog/AR1–AR2`，焦点进入其中并在关闭时返回开启者，并且按 `component:Dialog/FR7` 让 Tab 在其中环绕）；初始焦点落在 Cancel 这个破坏性最小的动作上；Escape 取消；没有任何外部点击会关闭它。内联预览不是警报对话框，带有 `role="group"`。实现差距：Dialog 尚未把 Tab 限制在内部，因此从最后一个按钮按 Tab 会把焦点移出警报、交给浏览器界面（Current-state impact）。

## Design relationships

| 解剖结构或状态 | 设计要求                                                     | 呈现权威            | 层级角色 | 组件契约 |
| -------------- | ------------------------------------------------------------ | ------------------- | -------- | -------- |
| 标题           | 命名该决定。                                                 | `component:Heading` | 突出     | FR3、AR1 |
| 描述           | 陈述其后果。                                                 | `component:Text`    | 辅助     | FR3、AR1 |
| Cancel 按钮    | 安全的退出途径；获得初始焦点。                               | `component:Button`  | 辅助     | FR2、AR1 |
| 动作按钮       | 有后果的选择，带其变体与加载；在窄屏幕上堆叠于 Cancel 之上。 | `component:Button`  | 突出     | FR2、FR3 |
| 背景           | 把对话框与页面分隔开；不会关闭它。                           | `component:Dialog`  | 辅助     | FR1      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Title": {"delegatesTo": {"owner": "component:Text", "target": "heading"}},
  "Description": {"delegatesTo": {"owner": "component:Text", "target": "text"}},
  "Cancel button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Action button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Backdrop": {
    "delegatesTo": {"owner": "component:Dialog", "target": "dialog"}
  },
  "Dialog surface": {"target": "alert-dialog"}
}
```

对话框表面（AlertDialog 渲染的 Dialog 元素）带有 `alert-dialog`。

## Family and system relationships

- `component:Dialog` 拥有模态性、焦点返回与关闭；AlertDialog 以 `purpose="form"` 语义与警报对话框角色来组合它。
- `family:overlay-dismissal` 把 AlertDialog 列为成员：它通过 Dialog 的共享拥有方关闭，自身没有偏离；Escape 会取消它，而点击背景不会（FR1）。
- `spec:AST-020/FR15` 决定组件采用哪些 APG 部分；AlertDialog 采用 Alert Dialog 模式所必需的部分，因为它已经在扮演该角色。

## Verification map

| 契约     | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 代表性状态                                                                                                                             | 变异或失败预期                                                                                                                                                                                                                                                                                                                                           | 审计小节                          |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1–FR5  | `AlertDialog.test.tsx`（“calls onOpenChange(false) on Escape”、“does not call onOpenChange when action is clicked”、“does not call onAction on Escape”、“does not disable the cancel button while the action is loading”、“exposes a named group instead, with no aria-modal”）与 `useImperativeAlertDialog.test.tsx`（“opens on show()”、“closes on hide()”）                                                                                                                                                                                                                                                                   | 打开、加载中、内联、命令式                                                                                                             | Escape 未取消、动作自行关闭，或内联路径声称该角色，即失败。                                                                                                                                                                                                                                                                                              | `audit:AlertDialog/behavior`      |
| FR6, PR2 | 在 Chromium 与 WebKit 中粗指针下的浏览器测试、针对呈现与关闭的主题令牌曲线对照、主线程繁忙的情形、iOS Safari 上的真机录屏，以及 Android 模拟器中 Android Chrome 的录屏（`spec:AST-094` DEC-27）                                                                                                                                                                                                                                                                                                                                                                                                                                  | 呈现、关闭、呈现期间关闭、关闭期间重开、Reduce Motion、精细指针、窄视口                                                                | 出现下列任一情况即失败：呈现，或由点击、按键或程序启动的关闭，播放了实测角色而非主题的进入或退出时长与缓动；起始处在视口之外；中断时跳跃；Reduce Motion 下出现缩放；精细指针下动效改变；或新增了元素。目前还没有测试；FR6 尚未交付。                                                                                                                     | `audit:AlertDialog/behavior`      |
| FR7      | `DialogTouchEntrance.interaction.browser.spec.ts`（“a tap on an alert's action while it enters runs nothing, and once it has entered the same tap runs it”；“keys and assistive technology stay live while the dialog enters”）                                                                                                                                                                                                                                                                                                                                                                                                  | 呈现期间的一次点击、其间按下 Enter 与 Escape、屏幕阅读器的一次激活、关闭期间的一次点击；精细指针下呈现期间的一次鼠标点击               | 按键或辅助技术的动作被保持、进入期间内容变为不可交互、某次点击触达正在离开的警报，或精细指针下鼠标点击被保持，即失败。没有测试覆盖正在离开的警报，这要等 FR6 的关闭机制补上。                                                                                                                                                                            | `audit:AlertDialog/behavior`      |
| FR8      | `AlertDialog.test.tsx`（“AlertDialog action tracking”）、`useActionGroupTracking.test.tsx` 与 `AlertDialog.interaction.browser.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 在 Cancel 上按下、滑到动作上再抬起的一次按压，以及在动作之外抬起的一次按压，分别用鼠标、触控笔与手指；对每个动作按 Enter 与 Space      | 滑动之后运行了按压起始处的动作、在外部抬起时运行了任何动作，或键盘/辅助技术的激活发生改变，即失败。                                                                                                                                                                                                                                                      | `audit:AlertDialog/behavior`      |
| FR9      | 在手机宽度与桌面宽度下、在默认主题与替代主题中的浏览器测试                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 手机宽度与桌面宽度，在默认主题与替代主题中；手机宽度下调用方给出的 `width`；窄于 320 px 的屏幕；精细指针下的窄窗口；非紧凑的粗指针屏幕 | 出现以下任一情况即失败：在任何主题下、调用方未给出 `width` 时手机宽度警报不是 320 px；调用方的 `width` 被覆盖；桌面宽度发生改变；警报宽于视口；或在精细指针的窄窗口、非紧凑的粗指针屏幕上出现 320 px 警报。目前还没有测试；FR9 尚未交付。                                                                                                                | `audit:AlertDialog/behavior`      |
| AR1      | `AlertDialog.test.tsx`（“links title via aria-labelledby”、“marks cancel as the initial focus target”、“keeps the initial focus target on the least destructive action”、“calls onOpenChange(false) on Escape”、“stacks long destructive action labels above cancel on a narrow fine-pointer screen”、“reaches both buttons by Tab, cancel first”、“is a modal alertdialog”、“does not claim the alertdialog role”）与 `useImperativeAlertDialog.test.tsx`；以及 `__tests__/AlertDialog.a11y.test.tsx` 与 `__tests__/AlertDialog.a11y.chromium.spec.ts` 中的 Alert Dialog 无障碍契约绑定（角色、描述关联、无背景关闭、焦点委派） | 打开的模态；按 Escape 后；按 Cancel 后                                                                                                 | 角色、名称关联、描述关联或 Cancel 的初始焦点丢失，或点击外部关闭了对话框。差距：该契约把 `alertdialog.focus.least-destructive-first` 与 `alertdialog.dismissal.click-beside-is-inert` 保持为建议性，因此其中任一项回退只会报告；一旦本记录成为 current，`spec:AST-020` FR9 就会使它们成为必需。没有测试覆盖警报内部的 Tab 环绕（Current-state impact）。 | `audit:AlertDialog/accessibility` |
| PR1      | 源码审阅                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 小屏幕与宽屏幕                                                                                                                         | 差距：如果 AlertDialog 添加了小屏幕媒体查询之外的监听器，没有自动化检查会失败。                                                                                                                                                                                                                                                                          | `audit:AlertDialog/behavior`      |
| RTL 关系 | RTL 审计挑选的 D2 目标（`apps/storybook/rtl-audit/targets.json`）中的 `AlertDialog / Delete`（对话框已打开）                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | Cancel 与确认动作；LTR 与 RTL                                                                                                          | 取消动作不在确认动作的行内起始位置，即 D2 失败。                                                                                                                                                                                                                                                                                                         | `audit:AlertDialog/i18n-rtl`      |

## Decision log

### DEC-1 — An alert holds pointer input while it enters

**参考：** `component:AlertDialog/DEC-1`

**决策者：** `cixzhang`，`2026-10-26`

警报遵循每种触摸呈现的进入期输入保持（`spec:AST-094` FR35）：仅限指针输入，从不涉及键盘或辅助技术，且其内容只在淡出期间处于不可交互状态。

### DEC-2 — On a phone an alert is 320 px wide in every theme

**参考：** `component:AlertDialog/DEC-2`

**决策者：** `cixzhang`，`2026-10-26`

手机宽度的警报在所有主题下都匹配 iOS 的 320 px，因此它读起来像系统警报；不为其新增主题角色。

已否决：通用的紧凑对话框宽度主题角色。

### DEC-3 — An alert's actions are an action group

**参考：** `component:AlertDialog/DEC-3`

**决策者：** `cixzhang`，`2026-10-26`

从 Cancel 滑到动作上的按压会运行其抬起处的动作，与每组同级动作中的做法一致（`spec:AST-094` DEC-17），因此在触摸呈现下，警报的两个按钮表现得像一个按钮组。

已否决：让每个动作的激活仅依赖浏览器的 click。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表或示例（`AlertDialog.doc.mjs`）、Dialog 的模态契约，也不重复共享的主题规则。它指向它们的拥有方。
