---
schema_version: 1
template_version: 1
kind: family
id: family:overlay-dismissal
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang, imdreamrunner]
review_triggers: [behavior, accessibility]
verified_by:
  [
    packages/core/src/Layer/useLayerDismissal.test.tsx,
    packages/core/src/Layer/layerDismissalInvariants.test.tsx,
    packages/core/src/Layer/layerDismissalFamilies.test.tsx,
    packages/core/src/Layer/useBackdropPress.test.tsx,
    packages/core/src/Drawer/Drawer.test.tsx,
    packages/core/src/hooks/useFocusTrap.test.tsx,
    packages/core/src/BottomSheet/BottomSheetSwitcher.test.tsx,
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/CommandPalette/CommandPalette.test.tsx,
    packages/core/src/Popover/Popover.test.tsx,
    packages/core/src/Popover/__tests__/PopoverSecondDocument.a11y.chromium.spec.ts,
    packages/core/src/Dialog/__tests__/DialogSecondDocument.a11y.browser.spec.ts,
    packages/core/src/BottomSheet/__tests__/BottomSheetCloseScroll.a11y.browser.spec.ts,
    packages/core/src/Dialog/__tests__/DialogCloseScroll.a11y.browser.spec.ts,
    packages/core/src/List/__tests__/ListReorder.test.tsx,
  ]
members:
  [
    component:Dialog,
    component:AlertDialog,
    component:Popover,
    component:DropdownMenu,
    component:DropdownMenuSubMenu,
    component:MoreMenu,
    component:Tooltip,
    component:HoverCard,
    component:Lightbox,
    component:MobileNav,
    component:BottomSheet,
    component:BottomSheetSwitcher,
    component:CommandPalette,
    component:ContextMenu,
    component:PowerSearchEditPopover,
    component:Drawer,
    component:BreadcrumbItem,
    component:ChatComposerInput,
    component:ComplexSelector,
    component:DateInput,
    component:DateRangeInput,
    component:DateTimeInput,
    component:Selector,
    component:MultiSelector,
    component:PowerSearch,
    component:BaseTypeahead,
    component:Typeahead,
    component:Tokenizer,
    component:SideNavHeading,
    component:SideNavItem,
    component:TabMenu,
    component:TopNavHeading,
    component:TopNavMenu,
    component:TopNavMegaMenu,
    component:TourStep,
    component:ChatEmojiPicker,
    component:Table,
    component:List,
  ]
architecture: [architecture:public-component-api]
contributing: []
deciding_specs: []
---

# Overlay dismissal family contract

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layering": ["FR1", "FR2", "FR3", "FR6"]
  },
  "concerns": {
    "focus-return": {
      "names": [
        "focusForLastInput",
        "isFocusDetached",
        "useFocusReturnVisibility"
      ],
      "claims": ["FR9"]
    }
  }
}
```

## Intent

一个人关闭层叠 UI 时，应当只影响最顶层的相关表面。当逻辑深度或 DOM 包含关系确立了顺序时，嵌套表面不得在同一次 Escape 按压或平台关闭请求中关闭其宿主。在打开它的文档中渲染于同源 iframe 或画中画窗口内的、锚定到触发器的成员，会在那里关闭并把焦点返回到打开它的文档，与在页面中一样；BottomSheet、BottomSheetSwitcher 和 Lightbox 仅在画中画窗口中如此，而 Drawer 和 MobileNav 留在页面中。

## Membership rule

当组件拥有一个分层表面、且 Escape 或平台关闭请求是该表面的有效关闭命令时，该组件即属于本家族。在其表面存在期间，每个成员都必须参与共享的关闭栈。成员资格依据可观察的职责，而不是当前实现是否已完成采用；本地 Escape 监听器是需要迁移的偏差，不是有意的排除。

使用 `usePopover`、`useLayer`、焦点陷阱或原生对话框创建自己的弹出层的组件，在它拥有该弹出层关闭职责时即为成员。仅将另一个成员作为辅助内容组合进来的组件，会继承该成员的行为，但不会因此成为成员。成员资格是开放式的：每个符合此规则的新发布表面都必须加入共享栈，并且必须据此更新本记录的当前成员快照。

- **当前成员：** Dialog、AlertDialog、Popover、DropdownMenu、DropdownMenuSubMenu、MoreMenu、Tooltip、HoverCard、Lightbox、MobileNav、BottomSheet、BottomSheetSwitcher、CommandPalette、ContextMenu、PowerSearchEditPopover、Drawer，以及下面列出的组件拥有的弹出层表面。
- **组件拥有的输入弹出层：** ChatComposerInput、ComplexSelector、DateInput、DateRangeInput、DateTimeInput、Selector、MultiSelector、PowerSearch、BaseTypeahead、Typeahead 和 Tokenizer。TextInput、TextArea、NumberInput、TimeInput 和 FileInput 不拥有弹出层；为辅助文本或禁用文本渲染 Tooltip 不会使输入本身成为成员。
- **其他组件拥有的弹出层：** BreadcrumbItem、SideNavHeading、SideNavItem、TabMenu、TopNavHeading、TopNavMenu、TopNavMegaMenu、Table 的筛选、List 的重新排序模式提示、Lab TourStep 和 Lab ChatEmojiPicker。
- **Hook 拥有的提示：** `useKeyboardHint` 提示，由 Toolbar、TabList 和 SegmentedControl 渲染。
- **协作者：** `useLayerDismissal`、`layerStack`、`LayerDepthProvider` 和 `useFocusTrap` 拥有或适配共享协议。
- **不参与的图层：** 没有关闭行为的图层不是成员。通过 Layer 渲染的纯视觉轮廓是典型示例：它既不处理 Escape，也不接收平台关闭请求。

## Shared owner

- `useLayerDismissal` 注册一个活动表面，并将浏览器发起的关闭请求适配为共享的最顶层检查。
- `layerStack` 拥有存在性过滤、排序以及文档级 Escape 监听器：每个持有已注册成员的文档中各有一个（FR8）。
- `LayerDepthProvider` 通过 React 树传递逻辑嵌套，供将其提供给后代的成员使用。没有该提供者的成员，在后代内容离开 DOM 包含关系后，不保证嵌套顺序。
- `useFocusTrap` 在活动时加入同一个栈，并接收 `onEscape` 回调。没有 `onEscape` 的焦点陷阱不是可关闭表面，不会注册。

## Canonical concepts

| 概念            | 取值或状态         | 默认语义                                             | 稳定性  |
| --------------- | ------------------ | ---------------------------------------------------- | ------- |
| membership      | 成员或不参与       | 具有 Escape/平台关闭行为的表面即为成员               | current |
| adoption        | 共享、部分或本地   | 本地处理是需要迁移的偏差，不是成员资格例外           | current |
| registration    | 活动或不活动       | 只有活动的、已启用的表面才参与                       | current |
| presence        | 在场或不在场       | 已注册但不在场的表面会被跳过                         | current |
| Escape behavior | `close` 或 `block` | `close` 调用成员的关闭回调；`block` 消费请求但不关闭 | current |
| logical depth   | 非负嵌套层级       | 提供者将其后代表面标记为其宿主的更深层级             | current |
| close request   | Escape 或平台请求  | 最顶层的已注册在场成员决定结果                       | current |

## Cross-component invariants

- **FR1 — 每个可关闭的分层表面都参与。** 成员在存在期间必须加入共享关闭栈。组件特定的 Escape 监听器或注册表不满足此不变量。
- **FR2 — 一个请求只影响一个表面。** 未被认领的 Escape 按压会被路由到恰好一个最顶层的已注册在场成员。该成员要么调用其关闭回调，要么阻止该请求；请求不会继续传递到其后面的成员。
- **FR3 — 平台关闭请求使用相同的最顶层规则。** 收到浏览器或平台关闭请求的成员，只有在它是最顶层的已注册在场成员时才关闭。针对较低层成员的请求会被拒绝。
- **FR4 — 可用的嵌套信号优先于宿主位置。** 当成员提供 `LayerDepthProvider` 时，React 树深度会将其后代图层排在该成员之前，即使二者在同一次提交中挂载。DOM 包含关系可以解决深度相等的嵌套；稳定的活动周期注册顺序可以解决不相关的表面。没有该提供者的成员，对于不再处于 DOM 包含关系中的后代内容，不保证此顺序。
- **FR5 — 内容可以先行认领 Escape。** 共享监听器在冒泡阶段运行，并在内容已经处理该事件时退出。
- **FR6 — 文本组合输入不是图层关闭。** 用于取消活动 IME 组合输入的 Escape 会被消费，而不会关闭成员；在组合输入活动期间，平台关闭请求会被拒绝。
- **FR7 — 注册不定义打开状态的所有权。** 栈会调用所选成员的关闭回调。该请求是否立即关闭表面，由成员的组件契约和调用方拥有。
- **FR8 — 成员在其渲染所在的文档中工作。** 成员在其注册元素所在的文档中打开，并接收 Escape 和平台关闭请求，也就是它渲染的地方：Dialog（以及 AlertDialog 和通过它实现的 CommandPalette）、Lightbox、MobileNav、BottomSheet、BottomSheetSwitcher 和 Drawer 注册其对话框，ContextMenu 注册其菜单，焦点陷阱注册其容器。触发器锚定的成员、Dialog、Popover 及所有基于它构建的成员、DropdownMenu、ContextMenu、Tooltip 和 HoverCard，在页面、同源 iframe 或 Document Picture-in-Picture 窗口中渲染。BottomSheet、BottomSheetSwitcher 和 Lightbox 覆盖其渲染所在的窗口，并在页面和画中画窗口中工作，但不在嵌入的 iframe 内工作。Drawer 和 MobileNav 是页面级的，仅在页面的文档中工作。Escape 按压或平台关闭请求仅在它到达的文档的已注册在场成员之间排名，FR2 和 FR3 在该文档内适用，因此宿主及其嵌套成员无论在何处渲染都保持同一顺序。其他文档的成员永远不是候选者。未固定的 Tooltip 永远不会在对阵另一个成员时赢得或阻止 Escape 按压，而被按压固定打开的 Tooltip 会首先接收 Escape（`spec:AST-003` FR4，DEC-6）：仅当未固定的 Tooltip 是其文档中唯一在场成员时，Escape 才会关闭它。栈在每个持有成员的文档中只监听一次，并在最后一个成员离开时停止。
- **FR9 — 焦点在打开者的文档中返回。** 关闭触发器锚定的成员时，如果焦点否则会丢失，则将其返回到该成员的返回目标，位于打开者的文档中，并采用该文档中最后一次输入所要求的焦点环（`architecture:interaction-modality` INV1）；BottomSheet、BottomSheetSwitcher 或 Lightbox 在画中画窗口中也是如此。返回不会将页面或任何滚动容器滚动到返回目标。浏览器可能会将所按压控件的可聚焦祖先记录为返回目标（WebKit 会将轻点按钮的最近可聚焦祖先聚焦，例如 `tabindex="-1"` 的主区域）；显示该祖先会将页面滚动到其顶部边缘。

- **FR10 — 背景遮罩按压必须在背景遮罩上开始并结束。** 带有 `purpose="info"` 的 Dialog、Drawer 的遮罩以及通过其 Dialog 的 CommandPalette，仅在按压同时在背景遮罩上开始和结束时才因背景遮罩按压而关闭。以任一方向越过成员边缘的按压，例如文本选择或将滑块拖出边缘后释放，不会关闭它；被取消的指针会结束按压。鼠标、笔和手指的规则相同，这些成员共享同一实现。
- **FR11 — 最顶层的表面消费其外部按压。** 对最顶层表面执行 light dismiss 的外部按压会被该表面消费；其下方的宿主表面不会因同一次按压也执行 light dismiss。如果背景遮罩按压关闭了在 `purpose="info"` 的 Dialog、带遮罩的 Drawer 或 CommandPalette 内打开的图层（菜单、popover、组合框列表、日期日历、固定的 tooltip 或上下文菜单），宿主保持打开，下一次背景遮罩按压才会关闭宿主。自行隐藏的图层，例如触发器失去焦点的 tooltip，不会消费该按压。仅关闭该图层的按压会将焦点留在宿主内部：由被关闭图层返回焦点，或者落在宿主本身上。鼠标、笔和手指的规则相同。

## Allowed component variation

- **AV1 — 焦点。** 成员拥有焦点进入、焦点约束、焦点移动和返回目标。FR9 固定了焦点返回所在的文档，以及返回不会滚动。
- **AV2 — 模态性。** 成员可以是模态或非模态，并拥有任何 inert 或背景遮罩行为。
- **AV3 — 定位与宿主。** 成员可以使用原生对话框放置、CSS 锚点定位、固定坐标或组件拥有的宿主。
- **AV4 — 外部关闭。** 成员拥有指针、悬停、焦点丢失、背景遮罩、触摸或手势交互是否以及如何关闭它们；FR10 所列成员的背景遮罩按压遵循 FR10 和 FR11。
- **AV5 — 打开状态 API。** 成员拥有受控与非受控状态、默认值、回调名称和命令式命令。
- **AV6 — 呈现。** 成员拥有动画、视觉处理和主题解剖结构。关闭注册表不暴露主题目标或渲染包装器。

## Representative matrix

| 成员与状态                                 | 共享不变量                                                                                                   | 有意差异                                                                                                           |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Dialog 内的 Dialog                         | 内部对话框处理第一个请求                                                                                     | Dialog 提供原生模态和焦点行为                                                                                      |
| Dialog 内的 Popover                        | Popover 处理第一次 Escape                                                                                    | Popover 提供锚定、portal 放置和焦点策略                                                                            |
| CommandPalette 内的已注册后代              | 后代处理第一次 Escape                                                                                        | CommandPalette 继承 Dialog 的共享栈参与                                                                            |
| 页面中 Dialog 内的 Tooltip 或 HoverCard    | 打开的 HoverCard 处理第一次 Escape；在未固定的 Tooltip 之上时，由 Dialog 接收；固定的 Tooltip 首先接收       | Hover 家族决定它们何时在场以及受控状态如何响应                                                                     |
| 必需 Dialog 之上的 Lightbox 或 MobileNav   | 顶层成员处理请求                                                                                             | 必需的 Dialog 仅在它是最顶层时使用 `block`                                                                         |
| 单独的必需 Dialog                          | 请求被消费而不关闭                                                                                           | Dialog 的 purpose 选择 `block` 行为                                                                                |
| 自有输入弹出层                             | 弹出层在存在期间参与                                                                                         | 输入组件拥有选择、焦点、打开状态、定位和外部关闭                                                                   |
| 两个不相关的已注册表面                     | 较晚的活动周期注册为最顶层                                                                                   | 两个表面都不被当作嵌套                                                                                             |
| 发送到较低层 Dialog 的平台关闭请求         | 较低层 Dialog 保持打开                                                                                       | 平台针对宿主；共享检查决定它是否可以关闭                                                                           |
| iframe 中的 Popover，页面中的 Dialog       | 请求发往其自身文档的顶层成员                                                                                 | 应用通过 portal 渲染到第二个文档                                                                                   |
| iframe 中 Dialog 内的 Popover              | Popover 处理 iframe 的第一个请求                                                                             | 两者各自注册自己的元素，因此按 iframe 的顺序排名                                                                   |
| iframe 中 Dialog 内的 Tooltip 或 HoverCard | 打开的 HoverCard 在那里处理第一次 Escape；在未固定的 Tooltip 之上时，由 Dialog 接收；固定的 Tooltip 首先接收 | 未固定的 Tooltip 永远不会在对阵另一个成员时赢得或阻止 Escape；固定的 Tooltip 首先接收（`spec:AST-003` FR4，DEC-6） |
| 画中画窗口中的 ContextMenu                 | Escape 关闭它；焦点返回到那里的打开者                                                                        | 菜单在用户按压的位置打开（FR8、FR9）                                                                               |
| 画中画窗口中的 BottomSheet 或 Lightbox     | Escape 关闭它；焦点返回到那里的返回目标                                                                      | 表面覆盖该窗口（FR8、FR9）                                                                                         |
| 嵌入 iframe 中的 BottomSheet 或 Lightbox   | 不支持                                                                                                       | 覆盖其窗口的表面仅在窗口就是应用时工作（FR8）                                                                      |
| Drawer 或 MobileNav                        | 仅页面                                                                                                       | 页面级表面留在页面的文档中（FR8）                                                                                  |

## Adoption and exceptions

| 组件或表面                                                                                                                                                                                                                                                                           | 采用情况                                      | 当前偏差或限制                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dialog、AlertDialog、Popover、MobileNav、Drawer、CommandPalette                                                                                                                                                                                                                      | 共享所有者；CommandPalette 组合 Dialog        | 无                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Tooltip、HoverCard                                                                                                                                                                                                                                                                   | 带 DOM 存在性报告的共享所有者                 | 两者都不为后代图层提供嵌套深度。实现差距：Tooltip 在最顶层时消费 Escape，因此其下方的图层会因该次按压保持打开，而另一个文档中的 Tooltip 永远不会被 Escape 关闭（`component:Tooltip` FR6）；FR8 将那次按压交给下方图层，并关闭其自己文档中孤立的 Tooltip。被按压通过 `useTooltip` 的 `show()` 固定打开的 Tooltip（如对 InfoTip 的按压）会首先接收 Escape（`spec:AST-003` FR4，DEC-6；`component:Tooltip` FR9、FR12）；HoverCard 没有按压固定。 |
| 带 `onEscape` 的焦点陷阱                                                                                                                                                                                                                                                             | 通过 `useFocusTrap` 的共享所有者              | 它们提供 DOM 包含关系，而不是后代深度                                                                                                                                                                                                                                                                                                                                                                                                         |
| BreadcrumbItem、ChatComposerInput、ComplexSelector、DateInput、DateRangeInput、DateTimeInput、Selector、MultiSelector、PowerSearch、BaseTypeahead、Typeahead、Tokenizer、SideNavHeading、SideNavItem、TabMenu、TopNavHeading、TopNavMenu、TopNavMegaMenu、Table、Lab ChatEmojiPicker | 通过 `usePopover` 或组合的 Popover 所有者共享 | Table 的筛选拥有受控 Popover 状态，并在关闭时丢弃其草稿；ChatEmojiPicker 拥有受控 Popover 状态                                                                                                                                                                                                                                                                                                                                                |
| Lab TourStep                                                                                                                                                                                                                                                                         | 通过其上下文图层上的 `useLayerDismissal` 共享 | Escape 结束导览；没有背景遮罩时，步骤没有外部关闭，有背景遮罩时，在标注框外按压会以 `'backdrop'` 结束导览（`component:Tour` FR1）                                                                                                                                                                                                                                                                                                             |
| DropdownMenu 根、MoreMenu、ContextMenu、Selector、MultiSelector、TopNavHeading、TopNavMenu、TopNavMegaMenu、SideNavHeading、SideNavItem、BottomSheet、BottomSheetSwitcher、Lightbox                                                                                                  | 共享所有者                                    | 实现差距：在另一个文档中（对于 BottomSheet、BottomSheetSwitcher 和 Lightbox，是画中画窗口），每个都根据页面的文档和最后一次输入决定焦点返回，因此焦点会返回到 frame 元素或页面，或者不带其文档中最后一次输入所要求的焦点环（FR9）                                                                                                                                                                                                             |
| List 的重新排序模式提示                                                                                                                                                                                                                                                              | 共享所有者，在重新排序模式开启期间注册        | 无                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| DropdownMenuSubMenu、PowerSearchEditPopover                                                                                                                                                                                                                                          | 仅本地                                        | 必须从组件特定的监听器或注册表迁移到共享所有者                                                                                                                                                                                                                                                                                                                                                                                                |

标记为部分或本地的行是针对 FR1 的当前采用差距，标记为实现差距的行是针对 FR8 或 FR9 的差距。它们不是已批准的例外。所列的实现差距是已知的那些，不是完整清单：发现某个成员根据页面的文档决定焦点返回或 Escape，就是同一个已知差距。迁移必须保留每个组件现有的焦点、模态性、定位、外部关闭和打开状态契约。

## Verification map

| 契约               | 验证                                                                                                            | 代表性成员与状态                                                                                                                                                                                                                                                                                                                                               | 变异或失败预期                                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| FR1、FR2、FR4、FR5 | `useLayerDismissal.test.tsx`；`BottomSheetSwitcher.test.tsx`；`ContextMenu.test.tsx`；`CommandPalette.test.tsx` | 合成的 provider 深度、同 DOM 包含关系、非模态切换器嵌套、ContextMenu 嵌套图层、CommandPalette 后代嵌套、不相关、阻塞、内容已处理、在场/不在场                                                                                                                                                                                                                  | 移除深度、存在性过滤或事件延迟会把 Escape 发送到错误的表面                                                   |
| FR2、FR3、FR4、FR6 | `layerDismissalInvariants.test.tsx`                                                                             | 同 DOM 嵌套 Dialog、Dialog 之上的 Lightbox、BottomSheet 中的 Dialog、平台取消、IME                                                                                                                                                                                                                                                                             | 一个请求关闭两个表面、在子级之前关闭宿主，或在组合输入期间关闭                                               |
| FR1、FR2、FR3、FR7 | `layerDismissalFamilies.test.tsx`                                                                               | Dialog、Lightbox、MobileNav、BottomSheet、Tooltip、HoverCard；受控和阻塞状态                                                                                                                                                                                                                                                                                   | 家族绕过栈、较低层成员处理请求，或受控所有权被忽略                                                           |
| FR1                | `useFocusTrap.test.tsx`                                                                                         | 带 `onEscape` 的活动、嵌套和停用焦点陷阱                                                                                                                                                                                                                                                                                                                       | 可关闭的陷阱不加入共享栈，或嵌套陷阱一起响应                                                                 |
| FR1、FR2           | `ListReorder.test.tsx`                                                                                          | 持有焦点的 List 重新排序模式提示，位于打开图层之上                                                                                                                                                                                                                                                                                                             | Escape 到达下方图层，或重新排序模式在 Escape 之后仍然存在                                                    |
| FR8                | `useLayerDismissal.test.tsx`；`Popover.test.tsx`                                                                | 页面和同源 iframe 中的成员；iframe 中单独及 Dialog 内的 Popover                                                                                                                                                                                                                                                                                                | 一个文档中的按压关闭另一个文档的成员，或宿主越过其嵌套图层关闭                                               |
| FR8                | `PopoverSecondDocument.a11y.chromium.spec.ts`                                                                   | iframe 和画中画窗口中的 Popover，单独存在以及页面中另有一个打开                                                                                                                                                                                                                                                                                                | 第二个文档中的按压错过自己的图层或关闭页面中的图层                                                           |
| FR9                | `DialogSecondDocument.a11y.browser.spec.ts`                                                                     | iframe 和画中画窗口中的 Dialog，由 Escape 或其内部控件关闭，以及从页面打开的 iframe 中的 Dialog                                                                                                                                                                                                                                                                | 焦点落在打开者文档之外，或其焦点环不跟随关闭时的输入                                                         |
| FR9                | `BottomSheetCloseScroll.a11y.browser.spec.ts`；`DialogCloseScroll.a11y.browser.spec.ts`                         | BottomSheet 和 Dialog，其触发器位于已滚动页面的一个高可聚焦区域内，分别由内部控件、背景遮罩和 Escape 关闭，在 Chromium 和 WebKit 中                                                                                                                                                                                                                            | 页面滚动偏移或触发器在屏幕上的位置在关闭前后发生变化                                                         |
| FR8、FR9           | 真实浏览器第二文档检查；实现差距：只有 Dialog、Popover 和 HoverCard 有这些检查                                  | Dialog、Popover、DropdownMenu、MoreMenu、ContextMenu、Selector、MultiSelector、TopNavHeading、TopNavMenu、TopNavMegaMenu、SideNavHeading、SideNavItem、Tooltip 和 HoverCard，各自位于同源 iframe 和画中画窗口中：在其渲染所在的文档中打开并接收 Escape（未固定的 Tooltip 仅在没有其他成员在场时；固定的 Tooltip 在其下方成员之前），并在打开者的文档中返回焦点 | 成员在另一个文档中打开或排名、固定的 Tooltip 让 Escape 到达其下方成员，或焦点落在 frame 元素、页面或 body 上 |
| FR8、FR9           | 真实浏览器第二文档检查；实现差距：它们都没有这些检查                                                            | 画中画窗口中的 BottomSheet、BottomSheetSwitcher 和 Lightbox：打开、接收 Escape，并把焦点返回到那里的返回目标                                                                                                                                                                                                                                                   | 表面在页面中排名，或焦点落在页面或 body 上                                                                   |
| FR8                | 对 Drawer 和 MobileNav 的源码检查                                                                               | 从第二个文档中的控件渲染的 Drawer 和 MobileNav                                                                                                                                                                                                                                                                                                                 | 页面级表面移入第二个文档                                                                                     |
| FR10               | `useBackdropPress.test.tsx`；`BackdropPress.a11y.chromium.spec.ts`                                              | Dialog（`purpose="info"`）、Drawer 遮罩和 CommandPalette，使用鼠标和手指：在背景遮罩上开始并结束的按压、从内部开始并在背景遮罩上结束的按压、从背景遮罩开始并在内部结束的按压、被取消的指针，以及从背景遮罩开始随后在内部按压                                                                                                                                   | 任一方向越过边缘的按压会关闭、被取消的或较早的按压被延续，或仅在背景遮罩上的按压不关闭                       |
| FR11               | `useBackdropPress.test.tsx`；`BackdropPress.a11y.chromium.spec.ts`                                              | Dialog（`purpose="info"`）和内部打开菜单的 Drawer 遮罩，使用鼠标和手指：一次背景遮罩按压，然后第二次；内部打开 Typeahead 列表、DateInput 日历、固定 InfoTip 或 ContextMenu 的 Dialog，使用鼠标；字段在 mousedown 时失焦的 DateTimeInput 时间列表；tooltip 自行隐藏时的按压；不关闭上方任何图层的按压                                                           | 关闭菜单的按压同时关闭宿主，或第二次按压让宿主保持打开                                                       |

## Decision links

### DEC-1 — Membership follows dismissal responsibility

**决策者：** `cixzhang`，`2026-08-30`

每个分层表面，只要 Escape 或平台关闭请求是该表面的有效关闭命令，就属于本家族，并且必须参与共享栈。成员资格是开放式的：每个符合此规则的新发布表面都必须加入栈。现有的组件本地监听器和注册表是采用差距，不是有意的排除。拥有自己输入弹出层的组件是成员；仅将另一个成员作为辅助内容组合进来的组件不会因此成为成员。成员元数据和采用表是经过审计的当前快照，不是封闭集合。

没有关闭行为的图层不参与。通过 Layer 渲染的纯视觉轮廓是典型的不参与示例。

### DEC-2 — Each surface works in the document it belongs to

**决策者：** `cixzhang`，`2026-10-31`

按键和平台关闭请求只会到达它们发生的文档，每个文档保持自己的浏览器顶层和自己的焦点。因此，成员在其渲染所在的文档中打开和排名，并在其打开者的文档中返回焦点。触发器锚定的成员在页面、同源 iframe 或画中画窗口中渲染。覆盖其窗口的表面——BottomSheet、BottomSheetSwitcher 或 Lightbox——在窗口就是应用的地方工作：页面或画中画窗口，而不是嵌入的 iframe。页面级表面留在页面中。一个请求仍然只影响一个表面：人实际操作的文档中的最顶层表面。

已拒绝：跨文档的单一顺序，即一个窗口中的按压关闭另一个窗口中的表面。

## Open questions

无。焦点进入、约束、移动和返回目标，模态性、定位、外部关闭和打开状态 API 都在本家族契约之外；FR9 仅固定焦点返回所在的文档以及返回不会滚动。映射的测试没有通过真实 portal 渲染嵌套图层；在本契约能够声称已验证 portal 覆盖之前，需要一个真实 portal 测试装置。

## Content boundary

本文件拥有家族成员资格、最顶层已注册 Escape 与平台关闭行为，以及当前用于排序这些请求的逻辑深度和 DOM 包含关系信号。成员仅在其提供 `LayerDepthProvider` 时保证后代深度；本记录不声称已通过真实 portal 验证嵌套。它拥有成员打开、关闭和返回焦点所在的文档（FR8、FR9）。它不定义焦点进入、约束、移动或返回目标，也不定义模态性、定位或锚定、portal 放置、外部交互、程序化组件命令、打开状态 API、动画或主题。那些仍然是组件、家族或架构的职责。
