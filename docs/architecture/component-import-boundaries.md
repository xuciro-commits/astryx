---
schema_version: 1
template_version: 3
kind: architecture
id: architecture:component-import-boundaries
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-10
owners: [cixzhang]
applies_to: [packages/core/src/, packages/lab/src/]
verified_by:
  [
    scripts/touch-support-bundle.test.mjs,
    scripts/lazy-sheet-bundle.test.mjs,
    scripts/core-single-bundle.test.mjs,
    scripts/check-component-import-boundaries.mjs,
    scripts/check-component-import-boundaries.test.mjs,
  ]
deciding_specs: []
---

# Component import boundaries architecture

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 管辖契约      | 无。人们看到的任何 prop、类型或行为都不变；每个表面自己的记录保留它显示什么以及何时显示。                                                                                                                                               |
| 系统行为      | 公共导入携带无需交互即可渲染的内容。由交互揭示的表面在首次意图时加载，工具提示和悬停卡表面除外，它们在页面首次绘制后加载（INV1–INV6、DEC-4）。选择加入的能力只能通过其自己的导入访问（INV7）。失败的检查按条目守住两者（INV9、DEC-3）。 |
| 终端用户影响  | 人们在每个页面上加载更少的 JavaScript。只有一个 Heading 的页面不携带工具提示代码；从不窗口化的 Table 不携带窗口化代码。表面的首次打开可能需要等待其模块；触发器、其名称和焦点在加载之前就已存在。                                       |
| 构建者影响    | 组件作者将表面渲染放在共享模块加载器之后，将能力代码放在其自己的导入之后。检查会指出破坏边界的导入链。                                                                                                                                  |
| 兼容性/就绪度 | 增量和内部变更：无公共 API 更改。当前状态影响列出今天的穿越情况；允许清单记录每一次，直到被修复。                                                                                                                                       |
| 评审检查      | 拒绝从允许清单之外的公共导入静态导入表面模块或能力模块；拒绝 touch 模块的 `import()`；拒绝触发器在加载期间失去 ARIA 接线、焦点或早期意图的表面；拒绝加载时的布局偏移。                                                                  |
| 管辖规则      | DEC-1、DEC-2、DEC-3、DEC-4；`architecture:react-component-runtime` INV13；`architecture:component-style-authoring` INV6；`spec:AST-080` DEC-5；`spec:AST-013` FR9。                                                                     |

此表是评审投射；以下正文具有权威性。

## Purpose

组件的公共导入会让每个使用它的页面付出代价，无论人们是否与之交互。本记录规定公共导入可以急切到达哪些模块。它把无人打开的表面和无人开启的能力的代码排除在导入之外。

## System model

组件导入中有三类代码相遇：

- **基础代码**渲染人们无需交互就能看到的内容：文本、按钮、行，以及组件提供的任何表面的触发器契约。
- **由交互揭示的表面**仅在人们悬停、聚焦、按下或打开某物后渲染：Tooltip、Text 和 Heading 的截断工具提示、HoverCard、Popover 及其 sheet、DropdownMenu 和 ContextMenu 菜单，以及触发器打开的任何其他图层。其**表面模块**保存只有它需要的代码：其图层、定位、关闭、内容及其自己的手势粘合代码。
- **选择加入的能力**是调用方通过导入并传递某物而开启的行为：Table 行虚拟化和共享窗口化模块（`architecture:list-windowing`）、其他 Table 插件、`createSwipe`、`useSnapPaging` 以及 Markdown remark 适配器。其**能力模块**保存只有它需要的代码。

**条目（entry）** 是一个公共导入，使用 PR 大小报告（`.github/scripts/lib/component-size.js`）的 esbuild 选项构建：面向浏览器的压缩 ESM、开启代码拆分、生产模式，且不包含 CSS。该构建将 React、React DOM 和 StyleX 设为外部依赖，而大小报告不会这样做，因此条目的体积只计算 Astryx 发布的代码。条目 chunk 及其静态导入的每个 chunk 都是急切的。`import()` 目标是惰性的。大小为默认级别的 gzip，1 KB 为 1,024 字节（`architecture:component-style-authoring` INV6）。

**跨越（crossing）** 是在条目的急切图路径上，从基础代码模块进入表面模块或能力模块的第一个静态导入。从延迟某个表面的基础模块静态导入 touch 模块也是一次跨越（INV8）。遍历在跨越处停止，因此表面或能力自身图中的导入不是跨越。每一对基础模块和它首次跨越进入的模块构成一次跨越和一行允许清单。被 `import()` 作为目标的模块是表面模块。

表面或能力文件夹中的某些模块是基础代码：表面文件夹为基础导入保留的触发器契约（`Tooltip/tooltipPresentInterest`、`Layer/layerScopedContext`），以及能力自己的导入（Table 插件的文件夹索引及其重新导出的模块，以及 `SnapPaging/SnapPaging`）。INV7 的接线位于基础代码中：组件自己的模块或能力自己的导入。诸如 Table 的 `useTableRowsVirtualization` 之类的接线模块在导入任何引擎代码之前仍是基础代码；它首次静态导入引擎代码时即构成一次跨越。

共享模块加载器（`utils/moduleLoader.ts`、`createModuleLoader`）为每个模块持有一个待定加载，缓存成功结果，并在失败后重置。

## Boundaries and invariants

- **INV1 — 由交互揭示的表面在首次意图时加载，工具提示和悬停卡在首次绘制后加载。** 公共导入只能通过共享模块加载器背后的 `import()` 到达表面模块，绝不能静态到达。这同样适用于表面自己的公共组件：`Tooltip`、`HoverCard`、`Popover`、`DropdownMenu` 和 `ContextMenu` 导入携带其触发器契约，其表面按照 INV2 所述加载，其中 `Tooltip` 和 `HoverCard` 表面遵循其绘制后规则。条目的急切部分只持有触发器契约：INV3 要求的 ARIA 属性和 id、意图监听器以及加载器调用。惰性加载图内的模块直接导入 Core 模块，绝不通过 barrel（`scripts/core-single-bundle.test.mjs`）。
- **INV2 — 意图启动加载，工具提示和悬停卡除外。** 加载从触发器首次由鼠标或笔发出的 `pointerenter`、`focus`、任何指针的 `pointerdown` 或打开请求（受控打开、键盘快捷键、上下文菜单调用）开始。监听器只使用原生事件；它们不识别手势。组件自己的记录可以在页面首次渲染后的指定时刻更早启动加载。`Tooltip` 和 `HoverCard` 表面不等待意图：它们的加载在页面首次绘制后开始，出现在渲染其触发器的每个页面上，任何输入都不会让它更早开始或加速（DEC-4）。加载绝不在服务端渲染或注水服务端标记的渲染期间开始（`spec:AST-013` FR9）。
- **INV3 — 触发器契约在加载前完整。** 触发器的角色、可访问名称和 Tab 停靠点，以及其自己记录为其关闭状态指定的 ARIA，都在服务端标记和注水标记中，并且不会在模块加载时改变。该 ARIA 因触发器而异：`component:Timestamp` AR3 为其 `time` 不提供 `aria-haspopup` 或 `aria-expanded`，并且仅在卡片打开时设置 `aria-controls`，正如 `component:DropdownMenuSubMenu` FR1 为其表面所做的那样。每个 ARIA 引用都指向文档中的一个元素。表面提供的描述（仅图标按钮上的工具提示）在加载前作为隐藏文本存在于基础标记中，否则触发器不携带对它的引用。焦点在加载前后保持原位，加载不会重新挂载任何内容（`architecture:layer-runtime`，图层内容边界；`component:Timestamp` FR6）。
- **INV4 — 加载前产生的意图只被兑现一次。** 模块加载前产生的最新意图会被保留，并在加载时按表面自己的规则重放一次。悬停等待表面的延迟，从指针进入开始计时。轻点或打开请求立即打开。焦点仅在焦点仍在触发器上时打开。较晚的意图会替换被保留的意图（`architecture:interaction-modality` INV8）。在加载前离开、失焦、滚动或在别处按下会丢弃保留的悬停或焦点。重放的意图会像在已加载表面上一样启用表面的关闭。对于 `Tooltip` 或 `HoverCard` 表面，在其加载期间进行的悬停会在加载完成且悬停延迟过去后显示表面，前提是指针仍在触发器上；否则下一次悬停会显示它。
- **INV5 — 加载不移动任何东西。** 加载不会改变页面中的任何盒子：触发器的大小、位置和内容在加载前后相同。加载期间不会绘制任何关闭的表面。表面绘制在顶层，或绘制在加载前已预留大小的槽位中。不显示任何错误状态（`spec:AST-013` FR9）。
- **INV6 — 加载失败后页面仍可工作。** 当导入失败时，触发器和页面保持挂载且可操作，保留的意图被丢弃，触发器抑制的任何原生行为会恢复（浏览器自己的上下文菜单）。开发构建只警告一次。后续意图会再次请求加载器。
- **INV7 — 选择加入的能力只能通过其自己的导入访问。** 能力的代码位于只有其自己的公共导入（其 hook、构造函数或插件工厂）才能到达的模块中。它所扩展的组件不导入其中任何一个，无论是静态导入还是通过 `import()`。组件通过调用方传递的值，或通过能力导入注册的实现来访问该能力。不导入该能力的条目最多携带其 0.3 KB gzip 的接线：身份检查和读取注册的分支。这是 `architecture:public-component-api` INV19 为大型功能指定的路线，正如 `createSwipe`（`spec:AST-057` FR10）和 `useSnapPaging`（`component:Carousel` FR8）所采用的那样。`architecture:list-windowing` 拥有窗口化模块本身（INV1）；本记录拥有哪些导入携带它。
- **INV8 — 延迟表面从共享 touch 模块获取触摸代码。** 需要触摸行为的表面模块静态导入共享的内部 touch 模块（`architecture:react-component-runtime` INV13）。无论基础导入还是已加载的表面引入它们，打包器都会在每个页面保留一份副本。`import()` 的目标是表面模块，绝不是 touch 模块。INV2 的监听器不识别手势，因此延迟其表面的基础导入不为其携带触摸代码。区分轻点和滚动属于已加载的表面，它读取轻点之后产生的 `click`。
- **INV9 — 检查按条目守住边界。** CI 检查会构建条目列表中的每个条目（Text、Heading、Button、IconButton、Link、Table，以及所有者添加的每个条目）并遍历其急切图。它找出条目到达的每一次跨越，并指出带来每一次跨越的导入链。允许清单中列出的跨越通过，并打印其 gzip 成本。未列出的跨越失败（DEC-3）。已列出但不再发生的跨越失败，直到其行被移除。检查还会打印每个条目的急切 gzip 大小，base 与 head 对比。向允许清单添加一行需要所有者在本文档中批准。

- **INV10 — 可选功能在未使用处零成本。** 可选功能是调用方通过 prop、选项或插件开启且默认关闭的行为。对于渲染其组件但未使用该功能的页面，它最多增加 0.3 KB gzip 的首次加载 JavaScript，与 INV7 的接线额度相同。更大的功能采用 INV7 的路线（其自己的导入）或延迟加载（DEC-1、DEC-4）。添加或增大可选功能的拉取请求会报告该页面的首次加载 gzip 增量。增大共享模块的拉取请求会报告四个参考页面上不使用新代码的应用的首次加载 gzip 增量。每个参考页面都是所构建包的生产应用 bundle，恰好导入以下 Core 组件：文档页面 Text、Heading、Link、Card、Divider 和 List；表单页面 Button、IconButton、TextInput、CheckboxInput、Text、Heading 和 Card；菜单页面 DropdownMenu、ContextMenu、Button 和 Text；以及表格页面 Table、Text 和 Button。如果共享模块未被这些页面中的任何一个到达，拉取请求应添加一个导入可到达该模块的组件的页面。默认行为、CSS（由 `spec:AST-080` DEC-4 管辖）、测试、故事、文档和生成文件不在此规则范围内（DEC-5）。

### Allowlist

| Crossing (base module → module it imports statically)             | Entries that reach it                          | Cost, gzip             | Invariant  | Row leaves when                                                          |
| ----------------------------------------------------------------- | ---------------------------------------------- | ---------------------- | ---------- | ------------------------------------------------------------------------ |
| `Text/TruncationTooltip` → `Layer/useTouchTrigger`                | Text, Heading, Button, IconButton, Link, Table | 4.6 KB (Text, Heading) | INV1, INV8 | the truncation tooltip's eager code carries no touch tap recognizer      |
| `Button/Button` → `Tooltip/useTooltip`                            | Button, IconButton                             | 15.5 KB                | INV1       | Button's tooltip layer code is lazy                                      |
| `Link/Link` → `Tooltip`                                           | Link                                           | 17.6 KB                | INV1       | Link's tooltip layer code is lazy                                        |
| `Table/tableContextMenu` → `ContextMenu`                          | Table                                          | 78.2 KB                | INV1       | cells without actions reach no menu module                               |
| `Table/BaseTable` → `Table/plugins/virtualization/useTableWindow` | Table                                          | 3.0 KB                 | INV7       | a Table that never windows reaches neither the controller nor its engine |

成本是检查在 CI 中的自身打印输出：在上述条目构建中，保留所有其他跨越的情况下从条目中移除每次跨越。在其他平台或 Node 版本上本地运行可能打印相差零点几 KB 的 gzip 大小。各行共享模块，因此不能相加。截断工具提示的触摸代码本身不会让 Button、IconButton、Link 和 Table 产生任何成本，因为它们中的另一个跨越带来了同一模块。Table 的急切负载为 123.5 KB。

## Current-state impact

- INV1、INV8 差距：Text 和 Heading 的导入通过截断工具提示到达 touch 轻点识别器，每个 4.6 KB gzip，即使页面文本从不截断。Button、IconButton、Link 和 Table 通过 Text 以同样方式到达它。
- INV1 差距：`Tooltip`、`HoverCard`、`Popover`、`DropdownMenu` 和 `ContextMenu` 导入静态加载其图层。`useTooltip`、`useHoverCard`、`usePopover` 和 `ContextMenu` 从 `Layer/useLayer` 导入图层 hook，`DropdownMenu` 通过 `usePopover` 到达它。这五个不在 INV9 的条目列表中，因此检查不会守住它们；它只守住列出的条目。
- INV1 差距：Button 和 IconButton 的导入到达工具提示 hook 和图层运行时，15.5 KB gzip，无论是否带有 `tooltip` prop。通过 Button、Link 或它们自己的代码，Core 的 95 个非表面组件导入中有 32 个携带 17–24 KB 的工具提示代码，52 个携带至少 1 KB。
- INV1 差距：Link 的导入到达 Tooltip 组件和图层运行时，17.6 KB gzip，无论是否带有 `tooltip` prop。
- INV1 差距：Table 的导入到达单元格上下文菜单，78.2 KB gzip，即使单元格没有操作，而 `component:TableCell` PR1 仅在提供操作时才加载菜单。
- INV7 差距：Table 的导入到达窗口控制器和共享窗口化模块，3.0 KB gzip，即使 Table 从不窗口化。
- INV3 差距：没有记录说明对于工具提示作为其描述的触发器，工具提示的描述如何在其表面加载前到达辅助技术。
- INV6 差距：持有必要操作的菜单在其模块加载失败时无法到达该操作（`architecture:interaction-modality` INV7）。
- INV9 差距：检查不测量 INV7 的接线额度。条目不导入的能力的接线可能超过 0.3 KB gzip，而检查不会失败。
- INV9 差距：检查没有为轻扫识别守住任何能力边界，因为轻扫识别没有自己的模块。

## Change coupling

当变更出现以下情况时，应针对本记录进行评审：

- 从公共导入的图向表面模块或能力模块添加或更改静态导入；
- 添加 `import()`、模块加载器或启动它的意图监听器；
- 添加由交互揭示的表面或选择加入的能力；或
- 添加或移除条目或允许清单行。

## Owning code

- `packages/core/src/utils/moduleLoader.ts` —— 共享模块加载器。
- `packages/core/src/Text/TruncationTooltip.tsx` —— 截断工具提示的意图跟踪和加载。
- `packages/core/src/Tooltip/`、`packages/core/src/HoverCard/`、`packages/core/src/Popover/`、`packages/core/src/DropdownMenu/`、`packages/core/src/ContextMenu/` —— 表面及其触发器。
- `packages/core/src/Table/plugins/` —— Table 的选择加入能力。
- `.github/scripts/lib/component-size.js` —— INV9 的条目构建与大小报告共享的 esbuild 选项和 gzip 度量。

## Deciding specs

### DEC-1 — Surfaces revealed by interaction load on first intent

**参考：** `architecture:component-import-boundaries/DEC-1`
**决策者：** `cixzhang`，`2026-11-09`

> “任何在交互时出现的工具提示、悬停卡和图层都应惰性加载”

大多数人从不会打开页面上的大多数表面，因此它们的代码在人们表现出意图时加载，而加载期间产生的意图仍然有效（INV1–INV6）。这延迟的是表面，而不是触摸原语：触摸代码保留在 `spec:AST-080` DEC-5 要求的共享 touch 模块中，由使用它的表面静态导入（INV8）。

已拒绝：让每个表面随其触发器一起加载，因为每个页面都要为人们从不打开的表面付出代价。

由 DEC-4 针对工具提示和悬停卡修订。

### DEC-2 — Opt-in capabilities ship only through their own import

**参考：** `architecture:component-import-boundaries/DEC-2`
**决策者：** `cixzhang`，`2026-11-09`

窗口就是对虚拟化器的导入，因此人们只在进行虚拟化时才为它付出代价。不导入能力的调用方不会携带它的任何部分（INV7）。

已拒绝：从组件使用 `import()` 加载能力，因为这样能力只有在组件绘制后才生效，并且需要对 `architecture:react-component-runtime` INV13 的例外（`spec:AST-057` DEC-8）。

### DEC-3 — A failing check holds the boundaries, with an allowlist of today's crossings

**参考：** `architecture:component-import-boundaries/DEC-3`
**决策者：** `cixzhang`，`2026-11-10`

> “现在就用一个会失败的检查，并记录当前跨越的允许清单，直到每个跨越都被修复”——所有者决定，2026-11-10（Cindy）

检查会在任何不在允许清单中的跨越上失败。今天存在的每次跨越都是允许清单中的一行，其行在其修复落地时移除；跨越不再发生的行会失败（INV9）。新的跨越无法合并，而已列出的跨越不会阻塞任何变更。

已拒绝：仅警告的检查，在其行消失后按条目开始失败，因为新的跨越可以在其条目仅警告时合并。
已拒绝：仅由评审维护的规则，因为跨越只出现在构建后的导入图中，而不在更改的行中。

### DEC-4 — Tooltip and hover-card code loads after first paint on every page

**参考：** `architecture:component-import-boundaries/DEC-4`
**决策者：** `cixzhang`，`2026-11-13`

> “在首次绘制之后，在每个页面上”——所有者决定，2026-11-13（Cindy）

工具提示和悬停卡代码在页面绘制后于后台加载，因此页面先显示，首次悬停通常会发现代码已经加载。这覆盖每个 Tooltip 表面，包括 Text 和 Heading 的截断工具提示以及 Button 和 Link 的 `tooltip`，还覆盖 HoverCard 表面。任何输入都不会让加载更早开始或加速它。加载窗口期间的悬停仍等待表面的悬停延迟，从指针进入开始计时，并在加载落地时显示（如果指针仍在触发器上），或在下次悬停时显示（INV2、INV4）。其他表面保持 DEC-1。

已拒绝：在首次悬停或聚焦时加载，因为首次悬停随后要等待获取完成。
已拒绝：随页面一起加载，因为每个页面都要在任何人悬停之前为代码付出代价。

### DEC-5 — Unused optional features cost almost nothing

**参考：** `architecture:component-import-boundaries/DEC-5`
**决策者：** `cixzhang`，`2026-11-13`

> “两条规则”——所有者决定，2026-11-13（Cindy），关于未使用功能和共享行为代码的体积规则

应用只在使用可选功能时才为它付出代价，并且付出该功能可能的最低成本。默认关闭的 prop、选项或插件，对未开启它的页面最多增加 INV7 的接线额度；不断增大的共享模块会说明它对不使用新代码的应用造成的成本（INV10）。

已拒绝：保留 public-component-api INV19 中权衡资源成本的建议，却没有预算或报告，因为功能对其他应用的成本随之变得不可见。

## Open questions

- **OQ1 — 0.3 KB 是 INV7 的正确接线额度吗？** 该值基于为 Table 的窗口化测得的最小残留提出；由所有者设定。
- **OQ2 — 首次渲染时打开的表面如何加载？** 受控打开或默认打开的表面在注水前没有意图。提议：它随首次客户端渲染加载，其关闭帧就是服务端标记已经显示的状态。

## Verification

| 不变量     | 证据                                                                                                                                                                                                 | 失败信号                                                                                                                                                    |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1、INV7 | 条目边界检查（INV9），每种类型都有一个阳性对照：一个静态导入表面的夹具条目，以及一个导入能力的夹具条目                                                                                               | 列出的条目在允许清单之外静态到达表面或能力模块；组件使用 `import()` 到达能力模块；阳性对照失败                                                              |
| INV2       | 每个表面的单元测试：意图之前无加载；每种意图类型（鼠标或笔进入、聚焦、指针按下、打开请求）一次加载；服务端渲染或注水期间无加载；Tooltip 和 HoverCard：无意图时在首次绘制后加载，早期悬停不会启动加载 | 在意图之前、服务端渲染期间或注水期间加载；意图不启动加载；加载前监听器中有手势识别器；Tooltip 或 HoverCard 加载等待意图、在首次绘制前开始，或由输入更早开始 |
| INV3       | 服务端渲染后注水，加上在加载前后使用 axe 的真实浏览器测试（Chromium 和 WebKit）                                                                                                                      | 关闭状态的触发器 ARIA 在服务端、注水和加载后不同；ARIA 引用指向缺失的元素；焦点移动或内容在加载时重新挂载                                                   |
| INV4       | 使用延迟加载器的测试：加载前的悬停、轻点、聚焦和打开请求；加载前的离开、失焦和较晚意图                                                                                                               | 保留的意图丢失或被重放两次；悬停延迟在加载时重新开始；过时意图在较新意图之后打开；重放的轻点没有外部关闭                                                    |
| INV5       | 真实浏览器布局测试：加载前后的触发器盒子；不绘制关闭的表面                                                                                                                                           | 任何触发器盒子变化；绘制了关闭的表面；加载期间出现错误状态                                                                                                  |
| INV6       | 使用拒绝加载器的测试                                                                                                                                                                                 | 页面卸载或触发器停止工作；保留的意图存活；被抑制的原生行为未恢复；后续意图不重试                                                                            |
| INV8       | `scripts/touch-support-bundle.test.mjs` 扩展到惰性 chunk：一个页面上两个延迟表面和一个基础组件                                                                                                       | 一个页面上出现第二个 touch 模块副本；`import()` 的目标是 touch 模块；entry 的急切图中仅为延迟表面而出现 touch 模块                                          |
| INV9       | 检查自身的测试：过时的允许清单行、未列出的跨越，以及打印的导入链                                                                                                                                     | 跨越未列出却通过；过时行通过；失败时没有其导入链                                                                                                            |
| INV10      | 在 INV10 的四个参考页面（docs、form、menu、table，每个由其组件集定义）上按页面生成首次加载报告，base 与 head 对比，针对渲染每个更改组件但不使用其可选功能的页面                                      | 未使用的可选功能增加超过 0.3 KB gzip 的首次加载 JavaScript，或增大共享模块的拉取请求未报告按页面增量                                                        |
