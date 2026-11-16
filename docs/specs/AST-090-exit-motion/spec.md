---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-090
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
phase: accepted
owners: [ernestt, cixzhang]
affects_architecture: [architecture:theme-tokens, architecture:layer-runtime]
affects_families: [family:overlay-dismissal]
affects_contributing: []
affects_consumer_docs:
  [
    motion,
    theme,
    Dialog,
    AlertDialog,
    CommandPalette,
    Popover,
    Tooltip,
    HoverCard,
    DropdownMenu,
    ContextMenu,
    Selector,
    ComplexSelector,
    PowerSearch,
    Breadcrumbs,
    BottomSheet,
  ]
review_triggers: [motion, tokens, layering, behavior, accessibility]
---

# Exit motion system spec

## Intent

会播放入场动画的表面也能播放退出动画，这样人就能看到它去了哪里、露出了什么。在指针呈现中，某一类表面是否播放其退出动画，是一项主题决策：若主题没有设置，该表面会立即关闭，与没有退出动画的表面一样。触控呈现则改为播放其原生对应物的退出动画（`spec:AST-094` FR7），此处的开关不会影响它。

**触控呈现**是指在水合（hydration）之后、主指针为粗指针的呈现，如 `spec:AST-094` FR13 所定义。其他所有呈现都是**指针呈现**，包括服务端渲染和正在水合的渲染。

本记录负责退出词汇、在指针呈现中为每一类表面开启退出动画的开关、以指针呈现的表面在离场期间的行为，以及其层退出动画在哪些浏览器中播放。有两类表面获得退出动画：

- **对话框表面**是一个 `Dialog`，包括 `AlertDialog`、`CommandPalette`、`useImperativeDialog` 和 `useImperativeAlertDialog` 所渲染的对话框。
- **层表面**是播放共享层入场动画的锚定层。当前成员有 `Popover`、`Tooltip`、`HoverCard`、`DropdownMenu` 及其子菜单、`ContextMenu`、`Selector`、`ComplexSelector`、`PowerSearch`，以及 `BreadcrumbItem` 的菜单。这份清单是一份快照，并非封闭集合。

`design:motion` 负责动效意图，把令牌和组件行为留给其他记录。`architecture:theme-tokens` 负责令牌词汇，而不负责哪些组件读取某个令牌、或它们在关闭期间做什么。一个由十几个组件通过两个共享原语读取的开关，是一项系统事实。

## Non-goals

- 触控呈现的退出动画，由每个组件的记录依据 `spec:AST-094` FR7 和 FR8 给出（FR14）。此处的退出开关不会影响触控退出动画；在主要交互为点按的组件中，由点按、按键或程序发起的触控退出动画会播放 `--duration-exit` 和 `--ease-exit`；在手势组件（例如 sheet 或 Lightbox）中，每次退出都播放其弹簧动画，而手势驱动的退出从释放速度开始（FR14）。
- 已经带退出动画的表面（`Drawer`、`BottomSheet`、`MobileNav`、`Toast`，以及 `TopNavMegaMenu` 面板）在指针呈现中保留各自的时长和曲线；对于由手势驱动的退出，即带速度的滑动或拖拽，则保留其实测弹簧。在触控呈现中，由点按、按键或程序发起的退出动画，在点按组件里播放 `--duration-exit` 和 `--ease-exit`，在手势组件里播放该组件的弹簧，`BottomSheet` 的关闭也包括在内（FR14）。`BottomSheet` 在指针呈现中的关闭按其使用的曲线读取 `--ease-exit`（FR12）；把其余表面在指针呈现中的退出动画迁移到退出词汇上，属于视觉变更，需另行决策。
- 没有入场动画的层（`Typeahead` 建议、`MultiSelector`、`Tokenizer`、日期和时间选择器、`TabList` 溢出菜单、`TopNav` 和 `SideNav` 菜单，以及 Chat 触发菜单）在此不获得退出动画。
- 页面流中带入场动画的元素，例如 `FieldStatus` 和 `useEntryAnimation`，在此不获得退出动画（OQ2）。
- 入场动画不变：它们的时长与曲线、由悬停打开的层的入场，以及 `Dialog` 背景遮罩的入场。
- 语义动效词汇的其余部分（entry、movement 和 state 曲线；entrance、overlay 和 reveal 时长）不在此确定。退出相关的名称遵循 `--ease-<job>` 和 `--duration-<job>` 模式，以便那套词汇无需重命名即可与之合并。
- 只要能满足本契约，等价的内部实现都有效。对话框在离场期间如何保持打开、离场的层如何仍绘制在原处、以及如何检测退出的结束，都属于实现细节。

## Requirements

FR1–FR13 管辖指针呈现中的对话框表面和层表面。FR14 管辖触控呈现中的它们。

- **FR1 — 退出默认关闭。** `--duration-exit-dialog` 和 `--duration-exit-layer` 默认为 `0ms`。主题把退出时长设为对节奏缩放令牌（tempo-scaled token）的引用时，例如 FR12 的 `var(--duration-exit)`，该时长跟随主题的节奏；设为字面值时则按字面播放（`spec:AST-108` FR5）。某类表面的退出时长为零时，该表面立即关闭：它在关闭它的那次更新中即被隐藏，焦点、回调和关闭行为都与没有退出动画的表面相同。
- **FR2 — 主题逐类开启。** 当某类表面的退出时长在该表面上解析后大于零时，该表面播放其退出动画。两类彼此独立。这些时长像任何令牌一样解析，因此主题或嵌套的 `Theme` 对其主题化的表面开启或关闭某一类。
- **FR3 — 退出沿其入场路径回溯。** 离场的表面沿其入场路径返回并在 `--ease-exit` 上淡出，历时其类别的退出时长。对话框向打开它的元素收缩回去，若没有打开它的元素则向下收缩；全屏对话框只淡出；层向其锚点收缩回去，在从右到左布局中像其入场一样镜像。对话框的背景遮罩在同一时长内淡出。`--ease-exit` 适用于由 CSS 计时的退出；弹簧驱动的退出播放其自身的退出角色，与之相邻的 CSS 部分取弹簧的稳定时间（`spec:AST-108` FR3、FR4a）。
- **FR4 — 离场的表面不接受输入。** 从关闭开始的那一刻起，任何指针按压或按键都不会激活离场表面自身内容中的任何东西。离场对话框所承载的 Toast 不属于其内容（FR13）。
- **FR5 — 离场的表面保留其关闭角色，正在关闭的固定层除外。** 在被隐藏之前，离场的表面保留其打开时具有的关闭角色（`spec:AST-003` FR1），下文所述的正在关闭的固定 `Tooltip` 除外。离场中处于活跃或阻断状态的所有者仍留在共享的关闭栈上（`family:overlay-dismissal` FR2），因此在其退出期间的 Escape 按压或平台关闭请求不会到达其下方的所有者，例外是正在关闭的固定 `Tooltip`，它在退出开始时离开该栈。离场的被动从属者，例如未固定的 `Tooltip`，保持被动且不遮蔽任何东西（`spec:AST-003` FR4）。正在关闭的固定 `Tooltip` 播放其退出，并在退出开始后不再接受 Escape：它不再是该栈的所有者，因此其下方的成员接受下一次 Escape（`spec:AST-003` FR4、DEC-6）。
- **FR6 — 焦点随关闭一同离开。** 层表面在关闭开始时交还焦点，与退出关闭时一样，从那时起其退出对辅助技术隐藏：屏幕阅读器既不朗读也不播报它。对话框表面在对话框被隐藏时把焦点返还给打开它的元素；在那之前，模态对话框后方的页面无法获得焦点。
- **FR7 — 回调报告请求。** `onOpenChange(false)`、`onHide` 以及层的 `isOpen` 在请求关闭时改变，与退出关闭时相同。对话框的原生 `close` 事件在对话框被隐藏时触发。
- **FR8 — 中断的解决不会闪烁。** 重新打开一个正在离场的表面会让它留在屏幕上并回到其打开状态；它绝不会被隐藏后再显示。卸载正在离场的表面，或用 React `Activity` 隐藏其子树，会立即移除它。
- **FR9 — 离场的表面绝不会滞留。** 无论浏览器是否报告其退出的结束，离场的表面都会在其退出时长结束后不晚于 100ms 被隐藏。这包括禁用动画和过渡的页面，以及在同一更新中打开又关闭的表面。
- **FR10 — 减少动态效果时立即关闭。** 在 `prefers-reduced-motion: reduce` 下，指针呈现中的对话框或层表面立即关闭，无论其类别的退出时长是多少（`design:reduced-motion` DR3、DR4）。
- **FR11 — 内容在离场期间保留。** 离场的表面在隐藏之前持续显示其关闭开始时显示的内容：悬停卡片的内容、菜单已打开的子菜单、选择器的搜索查询都留在屏幕上，直到该表面被隐藏。
- **FR12 — 退出词汇。** `--ease-exit` 默认为 `cubic-bezier(0.3, 0, 0.6, 0.6)`，这是一条缓慢起步、快速离开的曲线。对话框和层的退出都使用它，`BottomSheet` 在指针呈现中的关闭也使用它。`--duration-exit` 默认为 `var(--duration-fast)`，是标准的关闭时长。主题通过把某类表面的退出时长设为 `var(--duration-exit)` 或任何其他时长来开启该类。
- **FR13 — Toast 在离场对话框之上保持可操作。** 离场的对话框仍是原生模态，因此在被隐藏之前持续提供其模态出口（`spec:AST-003` FR18）。Toast 在整个退出期间保持可见且可操作（`spec:AST-003` FR16）。当它被隐藏时，Toast 连同其条目和计时器原封不动地迁移到最新的剩余出口（`spec:AST-003` FR18、FR19）。
- **FR14 — 触控退出绝不会被移除；点按组件中由点按发起的退出播放主题的退出时序。** 触控呈现中的对话框或层表面播放其组件记录依据 `spec:AST-094` FR7 和 FR8 给出的退出。在主要交互为点按的组件中，由点按、按键或程序发起的触控呈现退出会播放主题的退出时长和缓动，即 `--duration-exit` 和 `--ease-exit`；在手势组件（例如 sheet 或 Lightbox）中，该退出播放组件从静止开始的弹簧，而手势驱动的退出保留其速度弹簧（`spec:AST-094` FR7、FR45）。退出开关不改变该退出：未开启某类表面的主题不会移除它，开启某类表面的主题也不会替换它。

### Platform support

- 支持的功能与引擎下限：`browser-support` 使用方文档中的分级。
- 本节覆盖指针呈现；触控退出遵循 `spec:AST-094`。
- 对话框和层的退出在所有 Tier 1 和 Tier 2 浏览器中播放。
- 若某个层的退出无法绘制在顶层（top layer）中，例如缺少 Popover API 的情况，则无论其退出时长是多少都立即关闭：结果与退出关闭时相同。
- 浏览器证据：在 Chromium 和 WebKit 中，对对话框退出和层退出期间的帧进行真实浏览器采样，以及 Popover API 缺失时的层关闭。

## Current-state impact

- `architecture:theme-tokens`：`--ease-exit`、`--duration-exit`、`--duration-exit-dialog` 和 `--duration-exit-layer` 加入规范词汇，并带有其主题模板与生成的令牌文档投影（INV1、INV7）。
- `architecture:layer-runtime`：层在被请求关闭时关闭，与退出关闭时一样，随后其退出在运行时的共享退出副本上播放（INV14），并绘制在该层原先所在的顶层中。原生关闭的对账保持单次触发（INV6）。离场中活跃或阻断的所有者在其退出结束前保留其在关闭栈上的位置，例外是正在关闭的固定 Tooltip，它在退出开始时离开该栈（FR5）。离场的 Dialog 在被隐藏前持续提供其模态出口（FR13）；BottomSheet 的出口行为不变。
- `architecture:component-style-authoring`：无声明变化。层的退出是 INV7 允许的唯一一份瞬时退出副本，由共享机制生成，并在退出结束时移除（FR9）。
- `family:overlay-dismissal`：无声明变化。离场的成员按 FR2 在被隐藏前保持存在，例外是正在关闭的固定 Tooltip，它在退出开始时离开该栈（FR5）；动画仍归成员所有（AV6）。
- `spec:AST-003`：无声明变化。离场的表面保留其交互角色（FR1），离场的被动从属者（例如未固定的 `Tooltip`）仍然绝不遮蔽所有者（FR4、DEC-1），正在关闭的固定 `Tooltip` 在退出开始时放弃 Escape（FR4、DEC-6）。离场的对话框仍是当前的原生模态，因此它保留其出口，Toast 在其上方保持可操作（FR16、FR18）。
- `spec:AST-094`：触控呈现保留 FR7 和 FR8 给它的退出（FR14）。由点按、按键或程序发起的那种退出，在点按组件中播放 `--duration-exit` 和 `--ease-exit`，在手势组件中播放该组件的弹簧；手势驱动的那种则保留其速度弹簧（`spec:AST-094` FR7、FR45、DEC-26）。
- `spec:AST-108`：无声明变化。其 FR2 在每个 `character` 下都以同一曲线接纳 `--ease-exit`；弹簧驱动的退出播放其自身的退出角色，与之相邻的 CSS 部分取弹簧的稳定时间（FR3、FR4a）；作为对节奏缩放令牌的引用而设置的退出时长跟随 `tempo`（FR5）。
- `design:reduced-motion`：无声明变化。在减少动态效果下，指针呈现的退出立即完成（DR3、FR10），触控呈现的退出则按 `spec:AST-094` FR8 交叉淡出（DR2）。
- `design:motion`（草稿）：退出适用 DR1、DR2 和 DR5。本记录持有其内容边界留给其他记录的退出令牌和行为。
- `component:Dialog`：其 `visibility` 概念（打开、关闭）新增一个离场阶段。开启对话框退出后，调用方已关闭的 Dialog 仍保持呈现，其后方页面不可交互，Toast 在其上方仍可操作，直到其退出结束（FR6、FR9、FR13）。AR2 保留其焦点返还声明；FR6 说明返还在何时发生。
- `component:Popover`：AR4 保留其焦点返还声明；FR6 说明对于层，返还在何时发生。
- `component:BottomSheet`：其在指针呈现中的关闭读取 `--ease-exit`。BottomSheet 是手势组件：在触控呈现中，由点按、按键或程序发起的关闭播放该 sheet 从静止开始的弹簧，而关闭它的滑动或拖拽则从释放处保留其实测弹簧（`spec:AST-094` FR7、FR45）。实现缺口：目前由点按或按键发起的粗指针关闭播放 `--duration-medium`。
- 使用方文档：`motion` 描述两条曲线、指针呈现中退出默认关闭、主题如何开启每一类、触控退出绝不会被移除、点按组件中由点按发起的退出播放主题的退出时序，以及 sheet 和 Lightbox 的触控关闭弹簧（FR14），还描述调用方在表面关闭期间保持内容渲染。令牌表和主题模板列出新令牌，每个成员组件的文档描述其退出。

## Verification

| Contract | Verification                                                 | Representative states                                                                                                                          | Mutation or failure expectation                                                                                                             |
| -------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1      | 组件单元测试套件在默认令牌下保持不变地运行                   | 指针呈现中的每个对话框和层成员，打开后再关闭                                                                                                   | 使用默认令牌时，表面在关闭后仍保持渲染                                                                                                      |
| FR2      | 在设置了一类的主题下、细主指针环境中的真实浏览器测试         | 开启对话框而关闭层；开启层而关闭对话框；嵌套的 `Theme`                                                                                         | 未设置的类有动画，或已设置的类立即关闭                                                                                                      |
| FR3      | 退出期间的真实浏览器帧采样                                   | 有打开者和没有打开者的对话框、全屏对话框、每种放置位置的层、从右到左布局                                                                       | 表面偏离其入场路径，或沿用入场曲线                                                                                                          |
| FR4      | 真实浏览器测试                                               | 在离场表面内的控件上做一次按压和一次 Enter 键                                                                                                  | 控件被激活                                                                                                                                  |
| FR5      | 关闭不变式测试                                               | 下方有所有者的离场 Dialog 或 Popover 期间按 Escape；Dialog 上方离场的未固定 Tooltip 期间按 Escape；Dialog 上方固定 Tooltip 的退出期间按 Escape | 离场所有者下方的所有者被关闭、离场的未固定 Tooltip 吸收了按压，或正在关闭的固定 Tooltip 在退出开始后仍接受 Escape                           |
| FR6      | 单元测试以及真实浏览器中的焦点和无障碍树测试                 | 通过键盘和指针关闭对话框与层；层退出期间的无障碍树                                                                                             | 对话框焦点在对话框隐藏之前返回，或落到 body 上；层焦点等待退出；离场层的退出出现在无障碍树中                                                |
| FR7      | 单元测试                                                     | 受控和非受控关闭                                                                                                                               | 回调或 `isOpen` 等待退出                                                                                                                    |
| FR8      | 单元测试和真实浏览器测试                                     | 退出期间重新打开、退出期间卸载、退出期间隐藏 `Activity`                                                                                        | 表面消失后再出现，或在卸载后仍然存在                                                                                                        |
| FR9      | 抑制结束事件的单元测试；在整页禁用动画和过渡的真实浏览器测试 | 在同一次更新中打开和关闭；整页 `transition: none`；没有结束事件                                                                                | 表面在其退出时长结束 100ms 后仍然存在                                                                                                       |
| FR10     | 在模拟减少动态效果、细主指针环境中的真实浏览器测试           | 每一类都开启                                                                                                                                   | 有退出动画播放                                                                                                                              |
| FR11     | 退出期间的真实浏览器帧采样                                   | 悬停卡片、已打开子菜单的菜单、带搜索查询的选择器                                                                                               | 离场表面在隐藏之前显示其他内容或什么都不显示                                                                                                |
| FR12     | 令牌默认值测试、主题模板清单测试、令牌文档检查               | 默认值；`BottomSheet` 的关闭曲线                                                                                                               | 某个默认值发生偏移，或 `BottomSheet` 重复声明该曲线                                                                                         |
| FR13     | 真实浏览器测试                                               | 对话框退出期间按下一个 toast 操作、关闭一个 toast；对话框隐藏后的同一 toast                                                                    | 退出期间 toast 忽略输入或随对话框一起淡出，或在对话框隐藏时丢失其条目或计时器                                                               |
| FR14     | 在水合之后、主指针为粗指针的环境中的真实浏览器测试           | 用手指打开和关闭的 Dialog、Popover 和菜单，两类开关分别关闭和开启；在减少动态效果下的相同表面                                                  | 开关改变了触控退出、由点按发起的触控退出未按 `--duration-exit` 和 `--ease-exit` 播放，或表面关闭时没有 `spec:AST-094` FR7 和 FR8 给它的退出 |
| Platform | 在 Chromium 和 WebKit 中的真实浏览器测试                     | 每一类都开启时的对话框退出和层退出；Popover API 缺失时的层关闭                                                                                 | 层退出绘制在顶层之外或未播放，或缺少 Popover API 时的关闭被延迟                                                                             |

## Decision log

### DEC-1 — Exits ship off, and a theme turns them on

**参考：** `spec:AST-090/DEC-1`

**决策者：** `cixzhang`，`2026-10-28`

开启退出会同时改变每个产品中所有以指针呈现的对话框和层的关闭方式，因此该能力以关闭状态发布，由主题选择启用：启用之处正是通过其动效比例调节动效的同一位置。这些开关是令牌，因为退出时序是实现值，不是每次调用的概念（`spec:AST-002` FR3），也因为 prop 无法触及其他组件所组合的层，例如每一个 `tooltip` prop。

已否决：在每个组件上提供退出 prop，它会在每个调用点重复声明时序，并漏掉被组合的层；默认开启退出，它会在一个版本中改变每一个覆盖层。

### DEC-2 — One switch per kind of surface

**参考：** `spec:AST-090/DEC-2`

**决策者：** `cixzhang`，`2026-10-28`

人会刻意关闭对话框，其退出展示了它露出了什么。层则随着注意力转移而被关闭，常常一分钟内发生多次（`design:motion` DR2）。希望对话框带退出动画的主题，不必为此让每个 tooltip 和菜单都带动画。

已否决：所有表面共用一个开关。

### DEC-3 — An exit retraces its entrance on an accelerating curve

**参考：** `spec:AST-090/DEC-3`

**决策者：** `cixzhang`，`2026-10-28`

带动画的退出沿其入场路径返回，正如动效文档所要求。它运行在自己的曲线上：减速曲线把行程花在关闭的最初时刻，眼睛还来不及跟随；而加速曲线从静止起步，快速离开。`BottomSheet` 在此曲线上关闭，`--ease-exit` 即为它的命名。

已否决：在 `--ease-standard` 上倒放入场动画。

### DEC-4 — A layer's exit plays where the layer was drawn

**参考：** `spec:AST-090/DEC-4`

**决策者：** `cixzhang`，`2026-10-28`

浏览器在 Core 得知之前就隐藏了被轻触关闭（light-dismissed）的层，因此层的退出无法让活动层保持打开。退出在层关闭开始时显示的内容上播放，绘制在该层原先所在的顶层中，因为继续在顶层之外绘制的层会画错位置。层运行时的唯一一份共享退出副本在其中绘制它（`architecture:layer-runtime` INV14、`architecture:component-style-authoring` INV7），在所有支持 Popover API 的浏览器中都是如此，因此层退出在每个 Tier 1 和 Tier 2 浏览器中播放；在无法绘制的地方，层立即关闭，这也是默认行为。

已否决：用 `overlay` 过渡把活动层保持在顶层，因为该过渡只在支持它的浏览器中播放。

### DEC-5 — Touch exits are never removed; a tap component's tap-started exits play the theme's exit timing

**参考：** `spec:AST-090/DEC-5`

**决策者：** `cixzhang`，`2026-10-28`

在触控设备上，表面保持其原生对应物的外观，这是默认行为，无需选择启用（`spec:AST-094`）。该记录为主要交互为手势的组件提供弹簧动效，并为点按组件中由点按发起的动效在每种指针下提供主题的令牌（`spec:AST-094` FR45）。此处的开关决定指针呈现的退出是否播放，而触控呈现无论它们解析为何值都保留其退出。在点按组件中，由点按、按键或程序发起的触控退出播放主题的退出时长和缓动，即 `--duration-exit` 和 `--ease-exit`；在手势组件中它播放该组件的弹簧，而手势驱动的退出保留其速度弹簧（`spec:AST-094` FR45、DEC-26）。

已否决：让退出开关关闭触控退出，因为那会移除 `spec:AST-094` FR7 所要求的退出。

## Open questions

- **OQ1 — 以指针呈现的对话框退出是否默认开启，以及以多长的时长**（`human-design`）。可选方案：保持关闭；把 `--duration-exit-dialog` 默认设为 `var(--duration-exit)`；或将其默认设为入场区段中的某个时长，因为刻意关闭对话框的人会看着它离去。
- **OQ2 — 页面流中的元素是否获得一种退出类别**（`human-design`）。`FieldStatus` 和 `useEntryAnimation` 带入场动画，并在被移除时消失。退出会让验证消息在离场期间留在布局中，`design:motion` DR4 对此有所权衡。
