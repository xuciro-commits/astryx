---
schema_version: 3
template_version: 7
kind: component
id: component:HoverCard
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/HoverCard/HoverCard.test.tsx,
    packages/core/src/HoverCard/popupTrigger.test.ts,
    packages/core/src/HoverCard/__tests__/HoverCardTriggerRoles.a11y.browser.spec.ts,
    packages/core/src/Layer/layerDismissalFamilies.test.tsx,
    packages/core/src/Layer/useTouchTrigger.test.ts,
    packages/core/src/Layer/touchTriggerTargets.test.tsx,
    apps/storybook/stories/HoverCard.stories.tsx,
    packages/core/src/HoverCard/__tests__/HoverCardAudit.a11y.chromium.spec.ts,
    .github/a11y-audit-axe.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:layer-runtime,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-003, spec:AST-017]
---

# HoverCard component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `HoverCard`，带有 `children`（触发器）、`content`、`label`、`placement`（`above`）、`alignment`（`center`）、`delay`（300）、`hideDelay`（200）、`focusTrigger`、`touchTrigger`（`auto`）、`isEnabled`、`isOpen`、`isDefaultOpen`、`onOpenChange` 与 `hasHoverIndication`；目标 `hover-card`。`useHoverCard` 接受相同的 `touchTrigger`。                                                                           |
| 行为          | 锚定到触发器的浮动卡片，承载丰富的、可能可交互的内容。它在悬停经过 `delay` 后、获得焦点时，以及在 `touchTrigger` 允许的轻触时打开；只要指针位于触发器或卡片上就保持打开，并在离开、按 Escape 或轻触外部时关闭。带有 `label` 时，它是一个命名对话框，触发器在它打开期间为其命名（并在触发器的角色支持时对外声明）；不带 `label` 时，它是一个描述触发器的 group。使用 `touchTrigger="none"` 时，触摸永远不会打开它。 |
| 最终用户影响  | 鼠标、键盘与触摸用户都能打开该预览、移入其中使用其操作，并将其关闭；屏幕阅读器用户会把它听作命名对话框，在按钮或链接触发器上被播报为弹出层，或作为触发器的描述。在默认的 `touchTrigger="auto"` 下，轻触一个会执行操作的触发器只执行该操作。                                                                                                                                                                        |
| 构建者影响    | `touchTrigger` 回答的是：消耗一次轻触来显示卡片是否安全（DEC-1）：在会执行操作的触发器上保留默认的 `auto`；在轻触仅用于显示卡片的地方传 `tap`；在轻触绝不能显示卡片的地方传 `none`。                                                                                                                                                                                                                               |
| 兼容性/就绪度 | 无公共 API 变更：`touchTrigger` 保留其已发布取值与默认值 `auto`。存在三处实现缺口（见 Current-state impact）。                                                                                                                                                                                                                                                                                                     |
| 审查检查项    | 拒绝以下情况：未命名的 `dialog`；无法悬停或无法关闭的卡片（WCAG 1.4.13）；页面中的 Escape 同时关闭了下层图层；在角色不支持它的触发器上设置 `aria-expanded`；`touchTrigger="auto"` 下的一次轻触既执行触发器的操作又显示卡片。                                                                                                                                                                                       |
| 约束规则      | WCAG 1.4.13、2.1.1；`family:overlay-dismissal`；`spec:AST-003` FR4；`spec:AST-017`（生命周期）；`architecture:public-component-api` INV9、INV21；`architecture:layer-runtime`；`architecture:interaction-modality`；`architecture:component-theming-surface`。                                                                                                                                                     |

在 `none` 下，触摸或笔的任何轻触都不会打开卡片。

本表是审查用的投影；以下正文具有权威性。

## Intent

HoverCard 在不离开当前页面的情况下预览关于触发器的更多信息，例如个人资料或链接摘要。它负责触发器接线、针对每种输入卡片何时打开与关闭、卡片的语义，以及其表面。使用方的用法见 `HoverCard.doc.mjs`。

## Compatibility and migration

- 已发布默认值保留：是。`touchTrigger` 保留其已发布取值与默认值 `auto`。禁用控件不算操作，因此其说明会在轻触时打开（FR5）；该恢复作为补丁 `[fix]` 单独发布
- 兼容性类别：无公共 prop、默认值或样式变更。围绕表达式书写的文本（如 `Edited {when}`）现在会像单个字符串一样，渲染带文本悬停提示的可聚焦触发器 span；这作为补丁 `[fix]` 发布
- 受控/非受控行为：默认非受控；`isOpen` 强制该状态，受控卡片通过 `onOpenChange(false)` 报告关闭请求，而自身不关闭（FR7）
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

- **悬停计时未使用共享的悬停识别器。** 卡片运行自己的显示与隐藏计时器。`architecture:interaction-modality` INV11 要求 `useHoverCard` 从共享的悬停识别器获取悬停计时。
- **在另一个文档中输入会被计为键盘输入。** 触摸防护只读取页面自身窗口中的文本输入字段。轻触触发器之后，在 iframe 或画中画窗口的字段中输入的字键会被计为键盘输入，因此关闭的对话框在那里返回的焦点会打开卡片（FR12）。
- **保持仅跟随指针。** 只有当指针位于触发器或卡片上时，卡片才保持打开。由键盘焦点打开的卡片，在指针经过触发器并离开后就会关闭，而触发器仍保持焦点；用户已 Tab 进入的、由悬停打开的卡片，在指针离开触发器时会关闭，焦点掉到页面上。WCAG 1.4.13 要求：因焦点而显示的内容应持续到焦点移动或用户将其关闭。

## Ownership boundary

**拥有**

- 触发器接线、按输入区分打开与关闭行为、卡片语义，以及 `hover-card` 表面（FR1–FR8）。

**不拥有 / 非目标**

- 触发器元素，以及卡片的主体与操作——归调用方拥有。
- 图层宿主、定位与行内安全的 portal 传送——归 `architecture:layer-runtime` 拥有；共享 Escape 排序——归 `family:overlay-dismissal` 拥有。
- `useHoverCard` hook 的公共契约——一个未立契约的模块；本记录涵盖 HoverCard 的可观察行为。

## Public concepts

| 概念       | 封闭取值或状态            | 含义                                                                                                                                                                 | 按变体/方向/状态的可用性 | 默认值 | 所有者                | 稳定性 | 非法取值行为              |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------ | --------------------- | ------ | ------------------------- |
| 弹出层角色 | 命名 dialog、group        | `label` 使卡片成为命名的 `dialog`；不带 `label` 时卡片是 `group`。                                                                                                   | 每张卡片。               | group  | `component:HoverCard` | 稳定   | 不适用。                  |
| 焦点触发器 | `auto`、`always`、`never` | 焦点是否打开卡片：在可聚焦触发器上于焦点到达时判定（FR4）、总是、或从不。                                                                                            | 每个触发器。             | `auto` | `component:HoverCard` | 稳定   | TypeScript 拒绝其他取值。 |
| 触摸触发器 | `auto`、`tap`、`none`     | 消耗一次轻触来显示卡片是否安全（DEC-1）：`auto` 在轻触时显示它，除非触发器自身执行操作，禁用控件除外（FR5）；`tap` 在每次轻触时显示它；`none` 在任何轻触时都不显示。 | 无悬停能力的触摸与笔。   | `auto` | `component:HoverCard` | 稳定   | TypeScript 拒绝其他取值。 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 依据                                                         |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| FR1  | 打开状态下的卡片是一个单一表面，仅携带 `hover-card` 目标，在每个逻辑边都有内边距，内部是 `content`，并使用主题的正文字体。`xstyle`、`className` 与 `style` 作用于卡片。                                                                                                                                                                                                                                                                                                                                      | 当前源码与测试                                               |
| FR2  | 触发器接线：文本子节点（字符串与数字，一个，或围绕诸如 `Edited {when}` 的表达式书写的多个）中诸如 `false` 与 `null` 的空洞被忽略，它们被包裹在一个可聚焦的行内 span 中；元素 `children` 在行内安全包装器内部附加到其首个元素上，而挂载后被替换（由新的 children，或由交换自身根节点的子节点）的首个元素，会在旧元素的位置上完成接线。                                                                                                                                                                        | 当前源码与测试                                               |
| FR3  | 带有 `label` 时，卡片是 `role="dialog"`，由 `label` 命名。带标签的触发器通过 `aria-controls` 为打开的卡片命名，并与触发器自身的 `aria-controls` 合并；只有当其角色支持时（button、link 及类似角色），它才会获得 `aria-haspopup="dialog"` 与 `aria-expanded`，绝不加在无角色元素上；在卡片接线期间，二者各自替换触发器自身的值；清理时触发器自身的值恢复。不带 `label` 时，卡片是 `role="group"`，触发器的 `aria-describedby` 会获得卡片的 id。                                                               | 当前源码与测试                                               |
| FR4  | 在支持悬停的指针上，进入触发器会在 `delay` 毫秒后打开卡片；离开触发器或卡片会在 `hideDelay` 毫秒后关闭它，而在二者之间移动会保持其打开。触发器上的任何焦点——键盘、指针或程序化的——都会按 `focusTrigger` 打开它，但轻触后残留的焦点、按 Escape 关闭后的重新聚焦（FR6），以及受控关闭后的重新聚焦（FR7）除外。在 `auto` 下，焦点是否计数在它到达时判定：焦点在触发器自身上，或位于那一刻可聚焦的触发器内部，因此 roving-tabindex 的成员在方向键到达它时会打开。                                                | WCAG 1.4.13；测试                                            |
| FR5  | 在触摸与笔上，完成的轻触会在抬起时按 `touchTrigger` 打开卡片；变成滚动的触摸不会打开。在 `auto` 下，除非触发器自身执行操作，否则轻触会打开它；`aria-disabled` 控件，或指向禁用控件的标签，都不算操作，因此禁用控件的说明会在轻触时打开（DEC-1）。在 `tap` 下，每次轻触都会打开它；在 `none` 下，任何轻触都不会。轻触卡片内容会使其保持打开；卡片打开期间轻触触发器、轻触外部，或从外部开始的滚动会关闭它。当轻触作用于触发器周围的控件时，`auto` 是否也让卡片保持关闭，尚未确定（`component:Tooltip` OQ1）。 | 当前源码与测试                                               |
| FR6  | 当可见卡片是其触发器所在文档中的最顶层图层时，Escape 通过共享的关闭栈关闭它，因此下层图层保持打开；渲染到另一个文档（如 iframe 或画中画窗口）中的卡片，会接收在那里按下的 Escape。当焦点原本在卡片内部时，它会返回触发器，而这次重新聚焦不会重新打开卡片。                                                                                                                                                                                                                                                   | WCAG 1.4.13；测试                                            |
| FR7  | `isOpen` 强制卡片显示或隐藏，且 `isOpen={true}` 会抑制悬停与聚焦隐藏；受控卡片对 Escape 的回应是调用 `onOpenChange(false)` 而不隐藏，在焦点位于卡片内部时设置 `isOpen={false}` 会把焦点返回触发器。`isDefaultOpen` 会在挂载时打开卡片，且仍可关闭。`isEnabled={false}` 禁用触发器。`onOpenChange` 报告每次显示与隐藏。                                                                                                                                                                                       | 当前源码与测试                                               |
| FR8  | 内容仅在打开时渲染；服务端标记与客户端首次渲染一致，包括默认打开的卡片。`hasHoverIndication`（`auto`：文本子节点，即字符串与数字，忽略诸如 `false` 与 `null` 的空洞）会为行内触发器添加悬停提示。                                                                                                                                                                                                                                                                                                            | 当前源码与测试                                               |
| FR11 | 在打开的 HoverCard 表面内部的按压只作用于该表面：它绝不激活触发器、围绕触发器的可点击容器，或标签所指的控件。卡片内部的可交互内容（链接、按钮）保留自身的激活行为。该按压仍会到达页面级监听器，因此表面内部的菜单或 Typeahead 仍能工作。`architecture:layer-runtime` INV17 为每个图层根声明了这一停止。                                                                                                                                                                                                      | `component:Tooltip` FR11；`architecture:layer-runtime` INV17 |
| FR12 | 手指或笔按压触发器之后，在文本输入字段中输入的字键属于文本输入，而非键盘输入，正如 `component:Tooltip` FR13 所列，因此关闭的对话框返回的焦点不会打开卡片（FR4）；Tab、Escape、方向键及其他具名字键属于键盘输入。实现缺口：另一个文档（如 iframe 或画中画窗口）中的字段不会被读取为文本输入字段，因此在那里输入后，关闭的对话框返回的焦点仍会打开卡片（Current-state impact）。                                                                                                                               | 当前源码与测试                                               |

### Allowed variation

- **AV1 — 内容。** 任意内容，包括可交互的操作。
- **AV2 — 主题样式。** 主题可重新为 `hover-card` 设置样式。

### Representative states

| 状态            | 必需的不变式                                                                      | 允许的变体 |
| --------------- | --------------------------------------------------------------------------------- | ---------- |
| 无标签          | `role="group"`；触发器由卡片描述。                                                | 内容。     |
| 有标签          | 命名的 `dialog`；触发器在其打开期间为其命名，且仅在其角色支持时对外声明该弹出层。 | 内容。     |
| 悬停进入卡片    | 保持打开；操作可用。                                                              | 延迟。     |
| 从内容按 Escape | 关闭；焦点回到触发器；不重新打开。                                                | —          |
| 轻触打开        | 在抬起时打开；轻触其内容后仍保持打开。                                            | —          |

### Transformation and precedence order

- **ORD1 — 打开状态。** 先是 `isOpen`，然后是各输入触发器。

### Performance and resources

- **PR1 — 监听器。** 未变化的重新渲染不会重新绑定触发器的监听器；元素触发器在每次打开与关闭时重新绑定它们，而当 `onOpenChange` 的标识变化时，任何触发器都会重新绑定。

## Accessibility contract

- **AR1 — 弹出层语义。** FR3。
- **AR2 — 悬停或聚焦时的内容。** FR4–FR6 依据 WCAG 1.4.13 让卡片保持可悬停、可关闭且持久，仅指针保持例外（Current-state impact）。

## Design relationships

| 解剖结构或状态 | 设计要求                         | 表现权威           | 层级角色     | 组件契约 |
| -------------- | -------------------------------- | ------------------ | ------------ | -------- |
| 触发器         | 打开卡片的调用方元素。           | 调用方内容         | 依上下文而定 | FR2      |
| 卡片           | 锚定到触发器的带内边距浮动表面。 | 当前源码与公共文档 | 突出         | FR1      |
| 主体           | 卡片内部的调用方内容。           | 调用方内容         | 突出         | FR1      |
| 操作           | 卡片内部可选的调用方按钮。       | 调用方内容         | 辅助         | FR4      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger": {
    "none": {
      "reason": "intentional: The trigger is the caller's element and carries its own component's target."
    }
  },
  "Card": {"target": "hover-card"},
  "Body": {"inherits": "hover-card"},
  "Actions": {
    "none": {
      "reason": "intentional: Actions are caller-rendered controls that carry their own components' targets."
    }
  }
}
```

## Family and system relationships

- `family:overlay-dismissal` 负责 Escape 路由与最顶层处理。
- `architecture:layer-runtime` 负责宿主、定位与 portal 传送。
- `architecture:interaction-modality` 负责 FR4 所使用的焦点模态，并通过 INV11 负责 FR4 的悬停计时来源。
- `architecture:component-theming-surface` 负责 `hover-card` 目标。

## Verification map

| 契约                | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 代表性状态                                                                                                                                                                                                                                       | 变更或失败预期                                                                                                                                                                                             | 审计小节                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| FR1、FR2、FR8       | `HoverCard.test.tsx` 的渲染、包装器、混合文本及其悬停提示、portal、主题字体、SSR、被替换触发器，以及卡片 `xstyle`/`className`/`style` 测试；`HoverCardAudit` 对 `HoverCard / Open States` 的 Chromium 帧，用于验证单一目标、每个逻辑边上的相等内边距，以及文本触发器的虚线悬停提示                                                                                                                                                                                                     | 文本与元素触发器；默认打开                                                                                                                                                                                                                       | 多余的 target、丢失字体或 hydration 不匹配会失败；未到达卡片的卡片 `xstyle`、`className` 或 `style`、缺失或不相等的卡片内边距，或文本触发器上丢失的虚线提示，也同样失败。                                  | `audit:HoverCard/anatomy`       |
| FR3、AR1            | `HoverCard.test.tsx` 的角色、触发器属性与属性恢复测试；`popupTrigger.test.ts` 的角色支持与属性测试；`HoverCardTriggerRoles.a11y.browser.spec.ts` 在带标签的无角色触发器打开时进行的属性检查与 axe 通过；`HoverCardAudit` 帧，以及 `HoverCard / Open States` 上的审计 axe 通过                                                                                                                                                                                                          | 有标签与无标签；受支持与不受支持的角色                                                                                                                                                                                                           | 错误的角色、未按所述替换并恢复的触发器属性，或打开卡片上新增的 axe 违规，会失败。                                                                                                                          | `audit:HoverCard/accessibility` |
| FR4–FR6、AR2        | `HoverCard.test.tsx` 的悬停、延迟与隐藏延迟计时、触发器到卡片的保持、Escape、重新聚焦与触摸测试，及其 `focusTrigger="auto"` 的 roving、`<summary>`、包装器、离开 Tab 顺序的 left-the-tab-order，以及焦点位于可聚焦触发器内部的用例，及其“在第二个文档中”的 Escape、重新聚焦、焦点进入卡片、迟到的触发器与移动的触发器用例，及其焦点陷阱容器的 Escape 用例；`HoverCardAudit` 在 Chromium 中的悬停与键盘通过；`useTouchTrigger.test.ts` 与 `touchTriggerTargets.test.tsx` 的禁用控件用例 | 悬停、聚焦、轻触、从触发器与内容按 Escape，在页面中与在第二个文档中；hook 挂载后附加的触发器，以及一个移入 frame 再移回的触发器；位于焦点陷阱容器内的触发器；`touchTrigger` 的 `auto`、`tap` 与 `none`；执行操作的触发器；可点击行内被禁用的控件 | 无法到达或无法关闭的卡片、在 `delay` 之前打开或在 `hideDelay` 之前关闭的卡片、指针从触发器移入卡片途中就关闭的卡片，或在 `auto` 下轻触执行操作的触发器即打开、或在 `none` 下任何轻触即打开的卡片，会失败。 | `audit:HoverCard/behavior`      |
| FR7                 | `HoverCard.test.tsx` 的 isEnabled、isDefaultOpen、onOpenChange、`isOpen` 强制，以及受控关闭的焦点返回测试；`layerDismissalFamilies.test.tsx` 的受控 HoverCard 用例                                                                                                                                                                                                                                                                                                                     | 禁用、默认打开、保持打开、保持关闭、由调用方在焦点位于内部时关闭                                                                                                                                                                                 | 错误的状态上报、悬停隐藏了被保持打开的卡片或打开了被保持关闭的卡片，或焦点留在调用方已关闭的卡片内部，会失败。                                                                                             | `audit:HoverCard/behavior`      |
| FR11                | `HoverCard.test.tsx` 的表面按压套件                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 位于可点击容器内与位于 `<label>` 内的卡片；卡片内部的按钮                                                                                                                                                                                        | 点击卡片内容却执行了容器的点击处理器或激活了标签所指的控件，或卡片内的按钮停止工作，会失败。                                                                                                               | —                               |
| FR12                | `HoverCard.test.tsx` 触摸套件的输入字段用例；`interactionModality.test.ts` 的文本输入套件                                                                                                                                                                                                                                                                                                                                                                                              | 轻触、在字段中输入，然后按 Enter；然后按 Escape                                                                                                                                                                                                  | 轻触之后仅有文本输入却因返回的焦点打开卡片，或在 Escape 之后仍保持打开，会失败。                                                                                                                           | `audit:HoverCard/behavior`      |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 使用方解剖结构与当前目标                                                                                                                                                                                                                         | 缺失、多余或过期的映射会使校验失败。                                                                                                                                                                       | `audit:HoverCard/theming`       |

从源码读取，尚无针对性测试：

- FR3：在卸载时恢复触发器自身的属性。
- FR5：笔的按压计为轻触。
- FR5：轻触触发器关闭由悬停或聚焦打开的卡片，或关闭自挂载起就打开的卡片，包括笔在其悬停之后的轻触。
- FR7：焦点离开触发器时，`isOpen={true}` 让卡片保持打开。
- FR8：`hasHoverIndication={true}`。

仅在浏览器中检查，没有单元测试：

- FR1：卡片的内边距。

## Decision log

### DEC-1 — `touchTrigger` decides whether a tap may show the card

**Reference:** `component:HoverCard/DEC-1`

**Decider:** `cixzhang`, `2026-10-31`; amended `2026-11-01` and `2026-11-02`

`touchTrigger` 回答的是：消耗一次轻触来显示卡片是否安全，正如 `component:Tooltip` DEC-1 所述：默认值 `auto` 仅在触发器自身不执行操作时，才在轻触时显示卡片，因此一次轻触只做一件事；`tap` 声明每次轻触都可以显示它；`none` 声明任何轻触都不可以。`aria-disabled` 控件，或指向禁用控件的标签，都不算操作；只通过无角色的 `onClick` 起作用的元素属于调用方需修复的问题。HoverCard 没有公共 toggle prop；切换式触发器遵循 `component:Tooltip` DEC-1。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例或图层系统规则。它链接到这些内容的归属方。
