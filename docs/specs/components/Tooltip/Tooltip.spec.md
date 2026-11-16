---
schema_version: 3
template_version: 7
kind: component
id: component:Tooltip
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/InfoTip/InfoTip.pin.test.tsx,
    packages/core/src/Layer/layerDismissalFamilies.test.tsx,
    packages/core/src/Tooltip/Tooltip.test.tsx,
    packages/core/src/Layer/__tests__/TouchTrigger.a11y.chromium.spec.ts,
    packages/core/src/Tooltip/useTooltip.test.tsx,
    packages/core/src/Layer/touchTriggerTargets.test.tsx,
    packages/core/src/Tooltip/__tests__/Tooltip.a11y.test.tsx,
    packages/core/src/Tooltip/__tests__/Tooltip.a11y.chromium.spec.ts,
    packages/core/src/Tooltip/__tests__/TooltipHoverBridge.a11y.chromium.spec.ts,
    packages/core/src/Tooltip/__tests__/TooltipFocusReturn.a11y.chromium.spec.ts,
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
system_specs: [spec:AST-003, spec:AST-017, spec:AST-086/FR12, spec:AST-086/FR14]
---

# Tooltip component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Tooltip` 提供 `content`、`children` 或 `anchorRef`、`placement`（`above`）、`alignment`（`center`）、`delay`（200）、`hideDelay`（0）、`focusTrigger`（`auto`）、`touchTrigger`（`auto`）、`isEnabled`、`isOpen`、`isDefaultOpen`、`onOpenChange` 与 `hasHoverIndication`；target 为 `tooltip`。`useTooltip` 接受相同的 `touchTrigger`，其返回值包含命令式的 `show` 与 `hide`（FR12）。tooltip 通过 `show()` 和 `hide()` 固定打开（FR9、FR10）；Tooltip 没有 toggle prop 或 toggle 选项，`component:InfoTip` 即以这种方式固定。 |
| 行为          | 一个描述其触发器的 `role="tooltip"` 层。它在悬停经 `delay` 后、键盘焦点时，以及 `touchTrigger` 允许的 tap 时打开；当指针移到其上时保持打开，并在离开、Escape 或按压触发器时关闭（聚焦文本字段的按压会重新打开它）。在 `touchTrigger="none"` 下，任何触摸或触控笔 tap 都不会打开它。`useTooltip` 的 `show()` 将其固定打开，直到 `hide()`、Escape、外部按压，或焦点离开；期间悬停与焦点仍会预览未固定的 tooltip（FR9、FR12）。`component:InfoTip` 的按钮在点击、tap、Enter 或 Space 时固定并关闭它。                               |
| 最终用户影响  | 鼠标、键盘与触摸用户都能显示提示、将指针移到其上并关闭它；屏幕阅读器用户会将其听作触发器的描述。在默认 `touchTrigger="auto"` 下，对执行动作的触发器的 tap 只执行该动作。当按钮通过 `show()` 固定它时（如 `component:InfoTip` 的按钮所为），触摸、键盘或屏幕阅读器用户可以让帮助保持打开以便阅读，并在固定时听到一次播报。                                                                                                                                                                                                        |
| 构建者影响    | `touchTrigger` 回答一个问题：消费一次 tap 来显示此 tooltip 是否安全（DEC-1）？在执行动作的触发器上保留默认值 `auto`，在 tap 仅用于显示 tooltip 的地方传入 `tap`，在 tap 绝不能显示 tooltip 的地方传入 `none`。info 图标背后的帮助使用 `component:InfoTip`；应用自己的 toggle 风格触发器是一个调用 `useTooltip` 的 `show()` 和 `hide()` 的 button（DEC-1）。该层始终是滚动容器（`overflow-y: auto`），因此其内容中的 `position: sticky` 与 `scroll(nearest)` 时间线相对该层解析，而非相对页面。                                   |
| 兼容性/就绪度 | `useTooltip` 新增 `show` 与 `hide`（FR12），属增量变更。`touchTrigger` 保留其已发布的值与默认值 `auto`，固定功能不新增公共 prop。九处实现缺口（见当前状态影响）。                                                                                                                                                                                                                                                                                                                                                                |
| 审查检查      | 拒绝以下 tooltip：无法悬停或无法关闭的（WCAG 1.4.13）；在 tap 引发的焦点上、或在非文本字段触发器的指针焦点上打开的；丢失 `aria-describedby` 关联的；在 `touchTrigger="auto"` 下，一次 tap 既执行触发器的动作又显示 tooltip 的；固定打开的 tooltip 在指针离开时关闭，或让 Escape 传递到其下层的；固定触发器不是原生 button 或缺少 `aria-expanded` 的；以及 Tooltip 上带 toggle prop 或 toggle 选项的。                                                                                                                            |
| 治理规则      | WCAG 1.4.13、2.1.1；`family:overlay-dismissal`；`spec:AST-003` FR4；`spec:AST-017`（生命周期）；`architecture:public-component-api` INV9、INV21；`architecture:layer-runtime`；`architecture:interaction-modality`；`architecture:component-theming-surface`。                                                                                                                                                                                                                                                                   |

本表是评审用的投影，正文为准。

## Intent

Tooltip 在与其关联的、由调用方拥有的触发器所对应的自有 overlay surface 上渲染所提供的 tooltip 内容。它拥有触发器的接线方式、每种输入下 tooltip 何时打开与关闭，以及该 surface 的解剖结构。使用方用法见 `Tooltip.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：是。`touchTrigger` 保留其已发布的值与默认值 `auto`。被禁用的控件不是动作，因此其说明理由在 tap 时打开（FR5）；该恢复作为补丁 `[fix]` 单独发布
- 兼容类别：增量型：`useTooltip` 的返回值新增 `show` 与 `hide`（FR12）；没有公共 prop、默认值、DOM 或 target 变更；固定打开（FR9、FR10）通过 `show()` 和 `hide()` 实现，不新增其他公共接口；一处样式输出变更，见下文
- 受控/非受控行为：默认非受控；`isOpen` 强制该状态，受控 tooltip 通过 `onOpenChange(false)` 上报关闭请求，但自身不关闭（FR7）；受控 tooltip 上的 `show()` 和 `hide()` 通过 `onShow` 和 `onHide` 上报请求，自身不改变状态（FR12）
- 样式输出：该层始终是滚动容器（`overflow-y: auto`，不做 overscroll 约束）。此前将页面当作滚动容器、用于 `position: sticky` 或 `scroll(nearest)` 时间线的内容，现在改为相对该层解析；此类内容需自行命名其时间线（例如 `scroll(root)`），或将 sticky 元素移到 tooltip 之外。这是一处补丁 `[fix]` 的样式输出变更，没有 prop 或默认值变更
- 迁移决策：无

### CLN-0028 — Remove the surface registry behind `hasInteractiveAncestor`

| 字段      | 值                                                                                                                                                                                                                                                                                                                                                                      |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `CLN-0028`                                                                                                                                                                                                                                                                                                                                                              |
| lifecycle | 无弃用阶段：在下一次 minor 中移除一条已被记录的答案，`architecture:layer-runtime` INV17 取代了它                                                                                                                                                                                                                                                                        |
| delta     | Tooltip 与 HoverCard 的 surface registry（`Layer/layerSurfacePress.ts`）被移除，公共的 `hasInteractiveAncestor` 不再对打开的 Tooltip 或 HoverCard surface 内部的按压返回 true；其 JSDoc 中说明此行为的那句话也一并删除。INV17 已使这类按压不会到达该层周围任何冒泡阶段的 React 处理器，因此从原生监听器或捕获阶段处理器调用 `hasInteractiveAncestor` 的使用方会看到变化 |
| rollback  | 从最终补丁基线恢复 registry 与该 JSDoc 句子                                                                                                                                                                                                                                                                                                                             |
| state     | `pending`——在 0.8.0（一个已声明为 minor 的版本）中落地，并附带其 `[breaking]` Changeset                                                                                                                                                                                                                                                                                 |

使用方迁移说明见使用方文档与发布说明。

## Current-state impact

- **`hasInteractiveAncestor` 仍会查询 surface registry。** 在下一次 minor 之前，公共的 `hasInteractiveAncestor` 对打开的 Tooltip 或 HoverCard surface 内部的按压返回 true，与其文档所述一致；Core 自身的容器改为依赖 `architecture:layer-runtime` INV17。`CLN-0028` 将移除该 registry 及该返回值。
- **Escape 无法关闭其他文档中的 tooltip。** Tooltip 只监听页面自身 document 中的 Escape，且其 surface 是手动 popover，因此当 tooltip 渲染到 iframe 或画中画窗口、其下没有层时，Escape 永远无法关闭它。WCAG 1.4.13 要求此类内容可关闭（FR6）。
- **在 AST-003 落地前，tooltip 会消费 Escape。** 依照 `family:overlay-dismissal` 的记录，可见且位于最上层的 tooltip 会处理 Escape，因此其下层的层（例如 Dialog）在那次按压中保持打开。已接受、尚未实现的 `spec:AST-003` FR4 将使未固定的 tooltip 变为被动。
- **悬停计时未使用共享的悬停识别器。** tooltip 运行自己的显示与隐藏计时器，未使用识别器的意图组（该意图组会立即显示下一个触发器）。`architecture:interaction-modality` INV11 要求 `useTooltip` 从共享的悬停识别器获取其悬停计时。
- **触发器被替换后会失去连线。** Tooltip 在挂载时为其元素子节点或 `anchorRef` 目标接线。被替换的元素子节点或 `anchorRef` 目标在 Tooltip 再次挂载前既得不到 `aria-describedby`，也无法通过悬停或焦点打开，而自行以新的 `aria-describedby` 重新渲染的触发器会丢失 tooltip 的 id（FR2、AR1）。
- **空点击后的脚本焦点会打开 tooltip。** 在一次未聚焦任何东西的指针按压（例如点击页面文本）之后，脚本对触发器的聚焦会匹配 `:focus-visible` 并打开 tooltip，尽管 `architecture:interaction-modality` INV1 将那次按压计为指针输入（FR4）。
- **在其他文档中键入会被计为键盘输入。** 触摸守卫只在页面自身窗口内读取文本输入字段。在 tap 触发器之后，向 iframe 或画中画窗口中的字段键入的按键会被计为键盘输入，于是关闭的 dialog 在那里的焦点返回时会打开 tooltip（FR13）。
- **混合文本子节点不会获得触发器。** 以多个字符串形式到达 React 的文本子节点（例如 `Edited {when}`）既不采用文本路径也不采用元素路径：不添加可聚焦的 span 或 `aria-describedby`，且悬停与焦点都无法打开 tooltip（FR2）。
- **该绑定将部分已采用的 tooltip 部件作为建议性行运行。** tooltip 模式绑定仍将“焦点离开时隐藏”“悬停时显示”“离开时隐藏”作为建议性行运行，因此这些地方的回归不会让任一条绑定通道失败。`spec:AST-020` FR9 使已采用的预期成为必需。

## Ownership boundary

**拥有**

- 渲染出的 tooltip surface 及该 surface 内部的内容（FR1）。
- 触发器接线，以及每种输入下 tooltip 何时打开与关闭（FR2–FR8），包括 `show()` 保持状态，以及 tooltip 被固定时的播报（FR9、FR10、FR12）。

**不拥有 / 非目标**

- 触发器元素——由调用方提供，或在外部引用，位于 Tooltip 所拥有的解剖结构之外。
- 箭头元素——当前实现不渲染任何箭头。
- 固定按钮的 `aria-expanded` 与 `aria-controls`——由调用方的按钮设置（FR10、FR12）。
- 层的宿主与锚点定位——由 `architecture:layer-runtime` 拥有；共享的 Escape 顺序——由 `family:overlay-dismissal` 拥有。
- `useTooltip` hook 其余部分的公共契约——一个未纳入契约的模块；本记录涵盖 Tooltip 的可观察行为以及该 hook 的 `show` 与 `hide`（FR12）。

## Public concepts

| 概念       | 封闭值或状态              | 含义                                                                                                                                                                             | 按变体/方向/状态的可用性                                                                       | 默认值 | 拥有者              | 稳定性 | 非法值行为              |
| ---------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ------ | ------------------- | ------ | ----------------------- |
| 焦点触发器 | `auto`、`always`、`never` | 键盘焦点是否打开 tooltip：在可聚焦的触发器上，于焦点到达时判定（FR4）、始终打开，或从不打开。                                                                                    | 每种触发器模式。                                                                               | `auto` | `component:Tooltip` | 稳定   | TypeScript 拒绝其他值。 |
| 触摸触发器 | `auto`、`tap`、`none`     | 是否可安全地消费一次 tap 来显示 tooltip（DEC-1）：`auto` 在 tap 时显示，除非触发器自身执行动作（被禁用的控件除外，FR5）；`tap` 在每次 tap 时显示；`none` 在任何 tap 时都不显示。 | 无悬停能力的触摸与触控笔；在通过 `show()` 固定的按钮上，由该按钮的点击决定 tap 的行为（FR9）。 | `auto` | `component:Tooltip` | 稳定   | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 依据                                                                                                                                |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 渲染出的 tooltip 包含一个拥有的 surface，`role="tooltip"`，承载 `tooltip` target，宽度至多 300 px，内部放置所提供的 `content`；内容没有单独的 target，也不存在箭头。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 当前源码、文档与测试                                                                                                                |
| FR2  | 触发器接线：单个字符串或数字子节点会被包裹在可聚焦的内联 span 中；元素 `children` 挂接到其第一个元素；`anchorRef` 挂接到该元素。触发器的 `aria-describedby` 会加入 tooltip 的 id，并与任何已有值合并，之后恢复为原值。实现缺口：Tooltip 在挂载时为其元素子节点或 `anchorRef` 目标接线，因此挂载后被替换的触发器元素，或自身 `aria-describedby` 发生变化的触发器，会一直保留最初的连线，直到 Tooltip 再次挂载（当前状态影响）。                                                                                                                                                                                                                                                                                                                                                                                            | 当前源码与测试                                                                                                                      |
| FR3  | 在支持悬停的指针上，进入触发器后经 `delay` ms 打开；离开后经 `hideDelay` ms 关闭。`hideDelay` 为 0 时，一段短暂的过渡允许指针移动到 surface 上而不关闭它，且 surface 在悬停期间保持打开。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | WCAG 1.4.13；测试                                                                                                                   |
| FR4  | 关闭中的菜单或其他层在指针选择后返回其触发器的焦点属于指针焦点，因此不会在该触发器上打开 tooltip（`architecture:interaction-modality` INV1）。匹配 `:focus-visible` 的焦点会按 `focusTrigger` 打开 tooltip：键盘焦点、跟随键盘输入之后的程序化焦点（AR4）、文本输入触发器上的指针焦点（浏览器会将其标记为 focus-visible），以及文本输入触发器上的程序化焦点——除非手指或触控笔按压了该触发器且最近一次输入是指针按压；此外还包括任何其他触发器上的焦点——除非最近一次输入是指针（在键盘输入之后，如 AR4，或在任何输入之前）。实现缺口：未聚焦任何东西的指针按压之后的脚本焦点会打开它，因为该 hook 只读取 `:focus-visible`（当前状态影响）。tap 留下的焦点，以及其他指针焦点，则不会打开。焦点离开触发器会像指针离开一样调度隐藏。在 `focusTrigger="auto"` 下，焦点会在任何可聚焦的触发器上打开 tooltip，于焦点到达时判定。 | 当前源码与测试                                                                                                                      |
| FR5  | 在触摸与触控笔上，一次完成的 tap 会在手指抬起时按 `touchTrigger` 打开 tooltip；变成滚动的触摸，或浏览器不计为 tap 的按压，都不会打开它。在 `auto` 下，tap 会打开它，除非触发器自身执行动作；`aria-disabled` 控件，或被禁用控件的 label，都不是动作，因此被禁用控件的说明理由在 tap 时会打开，即使位于可点击的行或卡片内（DEC-1）。在 `tap` 下，每次 tap 都会打开；在 `none` 下，任何 tap 都不会打开。对触发器内文本输入控件（input、textarea、contenteditable）的 tap 会聚焦该控件，且不打开或关闭 tooltip。对触发器的第二次 tap、外部 tap，或从外部开始的滚动都会关闭它。在通过 `show()` 固定的按钮上，该按钮的点击决定 tap 的行为（FR9）。当 tap 作用于触发器周围控件时，`auto` 是否也应让 tooltip 保持关闭，仍为开放问题（OQ1）。                                                                                      | 当前源码与测试                                                                                                                      |
| FR6  | Escape 会关闭可见的 tooltip；文本合成期间的 Escape 被忽略。Escape 路由遵循 `family:overlay-dismissal`：页面中可见且位于最上层的 tooltip 处理该 Escape，因此其下层的层在那次按压中保持打开。实现缺口：渲染到其他文档（例如 iframe 或画中画窗口）且其下没有层的 tooltip，永远不会被 Escape 关闭（当前状态影响）。已接受、尚未实现的 `spec:AST-003` FR4 会使未固定的 tooltip 变为被动，并让固定打开的 tooltip 优先获得 Escape（当前状态影响）。在 `show()` 保持（FR12）之外，按压非受控 tooltip 的触发器会关闭它；聚焦文本输入触发器的按压会通过 FR4 重新打开它。                                                                                                                                                                                                                                                            | WCAG 1.4.13；测试                                                                                                                   |
| FR7  | `isOpen` 强制显示或隐藏 tooltip，且 `isOpen={true}` 抑制悬停与焦点隐藏；受控 tooltip 通过调用 `onOpenChange(false)` 来响应 Escape 而不隐藏，也不会因按压触发器而关闭。在 `isOpen={false}` 下，FR4 中会打开 tooltip 的焦点会调用 `onOpenChange(true)`，但不显示任何内容。`isDefaultOpen` 在挂载时打开它，仍可关闭。`isEnabled={false}` 禁用触发器，并丢弃待处理的打开。当调用方在禁用 tooltip 的同时移除触发器时，会关闭其处于打开状态的、非受控的 tooltip；当其在启用状态下再次挂接时，tooltip 仅在 FR4 会打开的焦点上显示。在 tooltip 保持启用时先分离再挂接的触发器，会让 tooltip 保持原状。                                                                                                                                                                                                                            | 当前源码与测试                                                                                                                      |
| FR8  | `onOpenChange` 上报每次显示与隐藏。`hasHoverIndication`（`auto`：单个字符串或数字子节点）为内联触发器添加悬停提示。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源码与测试                                                                                                                      |
| FR9  | 由 `useTooltip` 的 `show()`（FR12）保持打开的 tooltip 即为固定打开。Tooltip 没有 toggle prop 或 toggle 选项：调用方通过让自己的原生 button 调用 `show()` 和 `hide()` 来固定 tooltip，如 `component:InfoTip` 所为，因此对该按钮的点击、完成的 tap、Enter 或 Space 会固定 tooltip，而对已固定打开的 tooltip 的同样按压会关闭它。悬停与键盘焦点仍按 FR3 和 FR4 预览未固定的 tooltip。固定打开的 tooltip 在指针离开触发器与 surface 时保持打开，且 Tooltip 自身在触发器上的按压关闭对它不起作用（FR6）；Escape（FR6）、`hide()`（例如按钮的第二次按压）、在触发器与 surface 之外的按压，或焦点移出二者，都会关闭它。每次 `useTooltip` 调用有一个内部拥有者运行 `show()` 保持与触摸触发器（FR5）。                                                                                                                             | DEC-1；WCAG 1.4.13、2.1.1                                                                                                           |
| FR10 | 通过 `show()` 和 `hide()` 固定 tooltip 的按钮，以自身属性承载 FR2 的 `aria-describedby`、`aria-expanded`（仅在固定打开时为 `true`），以及在其显示期间指明该 surface 的 `aria-controls`（FR12）；Tooltip 自身不写入 `aria-expanded` 或 `aria-controls`。当 tooltip 被固定时，其文本通过 polite live region 播报一次；预览则除描述之外不播报任何内容。                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | DEC-1；WAI-ARIA 1.2 `aria-expanded`                                                                                                 |
| FR11 | 打开中的 Tooltip surface 内部的按压仅在该 surface 内生效：它绝不激活触发器、其周围的可点击容器，或 label 所指名的控件。渲染在 FileInput dropzone、ClickableCard、Item 行或 `<label>` 内部的 tooltip 会使其文本上的点击不打开文件选择器、不激活容器，也不切换或聚焦被标注的控件。该按压仍会到达页面级监听器，因此 surface 内的菜单或 Typeahead 仍可工作。`architecture:layer-runtime` INV17 为每个层根声明了这一阻止。                                                                                                                                                                                                                                                                                                                                                                                                     | `component:InfoTip` FR2（固定按压止于其按钮）；`component:Tooltip` DEC-1（一次 tap 只做一件事）；`architecture:layer-runtime` INV17 |
| FR12 | `useTooltip` 的返回值包含命令式的 `show(): void` 和 `hide(): void`。`show()` 打开 tooltip 并保持其打开，直到 `hide()`、Escape、外部按压，或焦点离开其触发器，如同固定打开的 tooltip（FR6、FR9）。在对触发器的一次按压期间开始的 `show()` 保持，会在该按压于触发器之外结束且没有点击时终止；随后由悬停规则决定 tooltip 是否继续显示。`hide()` 关闭它。二者都通过该 hook 的 `onShow` 和 `onHide` 上报，Tooltip 组件将其映射为 `onOpenChange`（FR8）。当 `isEnabled` 为 false 时，`show()` 什么也不做。在受控 `isOpen` 下，它们通过 `onShow`/`onHide` 上报请求，且不覆盖 `isOpen`（FR7）。应用正是通过它们构建 toggle 风格的触发器：应用自己的按钮调用它们，承载 `aria-expanded`（显示期间为 true）与指明该 surface 的 `aria-controls`，并保留自己的无障碍名称。                                                             | 拥有者决策，2026-11-02：通过 `useTooltip` 的命令式 show 与 hide 由应用控制，而非通过 prop。                                         |
| FR13 | 在手指或触控笔按压触发器之后，键入文本输入字段的按键属于文本输入，而非键盘输入：字符键、Backspace、Delete、Enter（屏幕键盘的 Go 键）、Shift、CapsLock、Dead、Process、Unidentified，以及合成期间的任何按键，都让那次指针按压保持为最近一次输入，因此关闭的 dialog 随后返回的焦点不会打开 tooltip（FR4）；Tab、Escape、方向键及其他具名键属于键盘输入。实现缺口：其他文档（例如 iframe 或画中画窗口）中的字段不会被读取为文本输入字段，因此在那里键入时，关闭的 dialog 返回的焦点仍会打开 tooltip（当前状态影响）。                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                                                                                                      |

### Allowed variation

- 所提供的内容可以变化，而无需新增由 Tooltip 拥有的子 target。

### Representative states

- 在包裹触发器模式与外部锚点模式下，拥有的解剖结构保持不变；触发器仍位于其外部。

### Transformation and precedence order

- **ORD1 — 打开状态。** 先 `isOpen`，然后是各输入触发器。

### Performance and resources

- **PR1 — 计时器。** 当触发器被禁用或组件卸载时，待处理的显示会被丢弃。

## Accessibility contract

- **AR1 — 描述。** 触发器的 `aria-describedby` 指明该 tooltip（FR2），FR2 中触发器变更的缺口除外。
- **AR2 — 悬停或焦点时的内容。** 按 WCAG 1.4.13，tooltip 可悬停、可关闭且持久存在（FR3、FR6），FR6 中其他文档的缺口除外。
- **AR3 — 焦点模态。** 只有 `:focus-visible` 焦点会打开它（FR4）。
- **AR4 — 焦点返回。** 当从键盘关闭 popover 将焦点返回到携带 tooltip 的触发器时，tooltip 为该焦点显示，且不报错。
- **AR5 — Tooltip 模式。** 本记录采用 APG tooltip 模式的各个部件：`role="tooltip"`、触发器的 `aria-describedby`、键盘焦点时显示并在焦点离开时隐藏、Escape 关闭，以及悬停时显示与离开时隐藏（FR1–FR4、FR6），其中 FR6 的其他文档缺口是 Escape 关闭的例外。焦点离开时隐藏、悬停时显示、离开时隐藏超出了 `spec:AST-020` FR15 所采用的必需部件，是本记录声明的具名例外，因其已发布而保留。
- **AR6 — 固定打开的 tooltip 即 toggletip。** 当按钮通过 `show()` 和 `hide()` 固定 tooltip 时，触发器是一个具名原生 button，会报告 `aria-expanded` 与 `aria-controls`（FR10）；键盘与触摸用户无需悬停即可固定和关闭 tooltip（FR9）；它在被固定时播报一次（FR10）；并持续存在直到 Escape、第二次按压、外部按压，或焦点离开（FR9、WCAG 1.4.13）。

## Design relationships

| 解剖结构或状态  | 设计要求                                                                                                                                                            | 表征权威           | 层级角色 | 组件契约 |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | -------- | -------- |
| Tooltip surface | 呈现当前绘制的 overlay surface。该层始终是滚动容器（`overflow-y: auto`），因此其内容中的 `position: sticky` 与 `scroll(nearest)` 时间线相对该层解析，而非相对页面。 | 当前源码与公开文档 | 支撑性   | FR1      |
| Tooltip 文本    | 在拥有的 surface 内呈现所提供的内容。                                                                                                                               | 当前源码与公开文档 | 显著     | FR1      |

触发器由调用方拥有，且在此解剖结构之外。当前实现没有箭头元素。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Tooltip surface": {"target": "tooltip"},
  "Tooltip text": {"inherits": "tooltip"}
}
```

## Family and system relationships

- `family:overlay-dismissal` 拥有 Escape 路由与最上层处理。
- `architecture:layer-runtime` 拥有宿主与定位。
- `architecture:interaction-modality` 拥有 FR4 所使用的 focus-visible 模态，并通过 INV11 拥有 FR3 的悬停计时来源。
- `architecture:component-theming-surface` 拥有 `tooltip` target。

## Verification map

| 契约              | 验证                                                                                                                                                           | 代表性状态                                                                                                                                                                                                 | 变更或失败预期                                                                                                                                                                                                                                              | 审计章节                      |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------- |
| FR1               | `Tooltip.test.tsx` role/content 测试套件                                                                                                                       | 渲染的表面与所提供的内容                                                                                                                                                                                   | 移除表面或内容会使现有的 tooltip role 与文本断言失败。                                                                                                                                                                                                      | `audit:Tooltip/anatomy`       |
| FR1 滚动容器      | `TooltipTallContent.a11y.browser.spec.ts` sticky 用例                                                                                                          | 一个高 tooltip，其内容以 `position: sticky` 子元素开头，并在内部滚动                                                                                                                                       | sticky 子元素随内容滚走，或固定到页面而不是 tooltip                                                                                                                                                                                                         | —                             |
| FR2–FR8           | `Tooltip.test.tsx`；`useTooltip.test.tsx`                                                                                                                      | 悬停、聚焦、轻点、Escape、受控、默认打开；在焦点到达时判定 `auto`（roving member、`<summary>`、不可聚焦的包装元素）                                                                                        | 对某个输入错误地打开或关闭即失败。                                                                                                                                                                                                                          | `audit:Tooltip/behavior`      |
| FR4、FR7 重新附着 | `useTooltip.test.tsx` 分离再附着套件；`DropdownMenuTooltip.a11y.chromium.spec.ts`                                                                              | 打开期间分离的触发器；分离期间到达的键盘焦点与指针焦点；一个数据菜单、一个复合菜单和一个底部操作表：指针选择、键盘选择和 Escape                                                                            | 触发器分离后仍有 tooltip 保持打开、指针选择后仍有 tooltip 出现，或键盘焦点返回时没有 tooltip，即失败。                                                                                                                                                      | `audit:Tooltip/behavior`      |
| FR7 保持关闭      | `Tooltip.test.tsx` 受控套件；`useTooltip.test.tsx` 受控套件                                                                                                    | `isOpen={false}` 时的键盘焦点；`isOpen={true}` 时的 Escape 与指针移出                                                                                                                                      | 被保持关闭的 tooltip 在聚焦时显示，或上报的焦点不是一次 `onOpenChange(true)`，即失败；被保持打开的 tooltip 上 Escape 将其隐藏，或指针移出将其隐藏，即失败。                                                                                                 | `audit:Tooltip/behavior`      |
| AR1–AR4           | `Tooltip.a11y.test.tsx`；`Tooltip.a11y.chromium.spec.ts`；`TooltipHoverBridge.a11y.chromium.spec.ts`；`TooltipFocusReturn.a11y.chromium.spec.ts`               | 真实浏览器中的悬停桥接与焦点返回                                                                                                                                                                           | 在移向 tooltip 的途中消失、或让焦点滞留在原处的 tooltip，即失败。                                                                                                                                                                                           | `audit:Tooltip/accessibility` |
| AR5               | `Tooltip.a11y.test.tsx`；`Tooltip.a11y.chromium.spec.ts`                                                                                                       | 包装、文本、锚点和 hook 触发器                                                                                                                                                                             | 丢失 role、描述、键盘聚焦时显示或 Escape 关闭，即失败；焦点离开隐藏、悬停显示和移出隐藏作为建议性行运行（当前状态影响）。                                                                                                                                   | `audit:Tooltip/accessibility` |
| FR5               | `Tooltip.test.tsx` 触控套件；`TouchTrigger.a11y.chromium.spec.ts` 手指与触控笔用例；`useTouchTrigger.test.ts` 与 `touchTriggerTargets.test.tsx` 的禁用控件用例 | 轻点打开、滚动、第二次轻点、轻点外部、轻点触发器内的文本字段；`touchTrigger` 的 `auto`、`tap` 和 `none`；一个动作触发器和一个不执行任何动作的触发器；正文行文中的触发器；可点击行内的禁用控件              | 未按所述方式打开或关闭的轻点、在 `auto` 下于执行动作的触发器上打开 tooltip 或在 `none` 下于任何轻点上打开 tooltip、在轻点触发器内的文本录入控件时打开或关闭 tooltip，或让禁用控件的原因保持关闭，即失败。                                                   | `audit:Tooltip/behavior`      |
| FR9、FR10、AR6    | `InfoTip.pin.test.tsx`；`TouchTrigger.a11y.chromium.spec.ts` 的 InfoTip 固定与鼠标用例；`layerDismissalFamilies.test.tsx` 的 Dialog 之上固定 Tooltip           | 点击、Enter、Space 和轻点固定；第二次按压、按压外部、焦点离开和 Escape 关闭；指针移出保留固定；对悬停预览的鼠标或触控笔按压；ClickableCard、Item 行和 `<label>` 内的固定按钮                               | 未按所述方式固定或关闭的按压、指针移出时丢失的固定、鼠标或触控笔按压时先关闭又重新打开的悬停预览、缺失或过期的 `aria-expanded` 或 `aria-controls`、重复播报，或固定按压同时激活了按钮周围的卡片、行或带标签的控件，即失败。                                 | `audit:Tooltip/behavior`      |
| FR11              | `Tooltip.test.tsx` surface-press 套件；`FileInputTooltipPress.a11y.chromium.spec.ts`                                                                           | 可点击容器内和 `<label>` 内的 tooltip；FileInput 紧凑与拖放区状态 tooltip，以对空拖放区的点击作为阳性对照                                                                                                  | 在 tooltip 文本上的点击若运行了容器的 click 处理函数、勾选或聚焦了带标签的控件，或打开了文件选择器，即失败。                                                                                                                                                | —                             |
| FR12              | `useTooltip.showHide.test.tsx`；`InfoTip.pin.test.tsx` 的按压预览用例；`Tooltip.stories.tsx` `CustomToggleTrigger`                                             | 应用按钮调用 `show()` 和 `hide()`；Escape、外部按压和焦点离开会关闭已显示的 tooltip；受控的 `isOpen`；`isEnabled` 为 false 时调用 `show()`；在触发器按压期间开始、结束于帮助按钮或两者之外的 `show()` 保持 | `show()` 未能打开或保持的 tooltip、`hide()` 未能关闭的 tooltip、仍使其保持打开的关闭路径、缺失的 `onShow` 或 `onHide`、覆盖受控 `isOpen` 的 `show()`、`show()` 打开了已禁用的 tooltip，或在触发器按压期间开始、在按压于触发器之外结束后仍存续的保持，即失败 | —                             |
| FR13              | `Tooltip.test.tsx` 轻点后对话框焦点返回套件；`TooltipFocusReturn.a11y.chromium.spec.ts` 的触控用例；`interactionModality.test.ts` 文本录入套件                 | 一次轻点，在对话框字段中输入，然后 Enter、Escape、Tab 或方向键；屏幕键盘报告为 `Unidentified` 的按键；只读、禁用和 `inputmode="none"` 的字段；日期、时间、月份和周字段                                     | 自轻点后仅发生文本录入便打开的返回焦点，或在 Tab、Escape 或方向键之后仍保持关闭，即失败；在未唤起键盘的字段中按键却被计为文本录入，即失败。                                                                                                                 | `audit:Tooltip/behavior`      |
| 主题化解剖映射    | `scripts/check-knowledge.mjs`                                                                                                                                  | 规范解剖与当前目标                                                                                                                                                                                         | 缺失、多余、带前缀或过期的映射会让仓库校验失败。                                                                                                                                                                                                            | `audit:Tooltip/theming`       |

以下内容从源码读取，尚无专门测试：

- FR2：单个数字子元素，以及恢复触发器自身已有的 `aria-describedby`。
- FR6：按压使文本录入触发器获得焦点时重新打开它，以及在另一个文档中的 Escape。
- FR7：`isOpen={true}` 抑制焦点隐藏。
- FR1：300 px 的最大宽度、`tooltip` 目标，以及没有箭头。
- FR4：`focusTrigger="always"` 和 `"never"`，指针输入后对文本录入触发器的程序化聚焦会打开它，而当最后一次输入是指针按压时，手指或触控笔按压它之后则不会；文本字段上的指针焦点会打开 tooltip；在任何输入之前的程序化聚焦，或在指针按压到不是文本字段的触发器之后的程序化聚焦不会打开它；其他指针焦点不会打开它；焦点离开触发器会隐藏它。
- FR8：`hasHoverIndication`。

## Decision log

### DEC-1 — `touchTrigger` decides whether a tap may show the tooltip

**参考：** `component:Tooltip/DEC-1`

**决定者：** `cixzhang`，`2026-10-31`；修订于 `2026-11-01`、`2026-11-02` 和 `2026-11-03`

`touchTrigger` 回答一个问题：为了显示这些内容而消费一次轻点是否安全？用于显示 tooltip 的轻点不能先于执行控件动作的轻点，因此一次轻点只做一件事。默认值 `auto` 仅在触发器本身不执行任何动作时才在轻点上显示 tooltip；`tap` 声明每次轻点都可以显示它；`none` 声明任何轻点都不可以。`aria-disabled` 控件，或为禁用控件提供的标签，都不算动作，因此其原因是可以在轻点上打开的。仅通过无角色的 `onClick` 起作用的元素属于调用方的修正：它需要一个角色。

切换回答的是另一个问题，因此它不能取代 `touchTrigger`。切换需要在触发器下方有一个调用方并未添加的按钮，它会引入与触发器没有明确关联的交互，而且解决不了触控场景。Tooltip 没有公开的 toggle prop。应用通过让自己的按钮调用 `useTooltip` 的命令式 `show()` 和 `hide()` 来构建切换式触发器（FR12）。`component:InfoTip` 就是这样一个按钮：它保持自身行为，并通过 `show()` 和 `hide()` 实现固定（FR9、FR10）。`component:HoverCard` 的 DEC-1 适用相同的规则。

已否决：单独的 toggletip 组件，它会重复 Tooltip 与 HoverCard 的预览（`architecture:public-component-api` INV21）。

## Open questions

- **OQ1 — 当轻点作用于触发器周围的控件（例如链接中被截断的标签）时，`touchTrigger="auto"` 是否也会让 tooltip 保持关闭？**（`human-api`）目前 `auto` 只判定触发器本身。

## Content boundary

本文件不重复使用方的 prop 表、示例、层系统规则、实现步骤或系统规则。它链接到它们的归属者。
