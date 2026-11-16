---
schema_version: 3
template_version: 3
kind: module
id: module:DropdownMenu/useMenuHover
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [behavior, interaction, accessibility]
verified_by:
  [
    packages/core/src/hooks/useMenuHover.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenuSubMenu.test.tsx,
    packages/core/src/SideNav/SideNav.test.tsx,
    packages/core/src/TopNav/TopNavMenu.test.tsx,
    packages/core/src/TopNav/TopNavMegaMenu.test.tsx,
  ]
parent_component: component:DropdownMenu
references:
  [
    architecture:layer-runtime,
    architecture:interaction-modality,
    module:DropdownMenu/useMenuPress,
  ]
---

# useMenuHover module contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 无。`useMenuHover` 是内部共享 hook；DropdownMenu、SideNav 或 TopNav 的使用方 prop、导出或 DOM 契约均不改变。本记录为已经发布的行为约定契约。                                                                                               |
| Behavior                | 具备悬停能力的指针进入触发器后在 `showDelay` 之后打开，离开后在 `hideDelay` 之后关闭由悬停打开的表面；指针在触发器上按压会切换，但在悬停打开之后的 `clickGuardMs` 之内例外，此时它确认该表面而不是关闭它。由按压打开的表面没有这样的窗口。 |
| End-user impact         | 光标朝某一行移动、并在浮出层于其下方出现时点击的人会保留该浮出层；同一个人稍后按压明显已打开的行则会关闭它。键盘或触摸用户不受影响：两种路径都没有悬停阶段，也都没有切换。                                                                 |
| Builder impact          | 无。`clickGuardMs: 0` 让表面退出该行为，因此每次按压都会切换（`SideNavItem` 正是如此）；`showDelay: 0` 表示接触即打开；`ownsFocus: false` 把焦点留给表面自己的焦点陷阱。                                                                   |
| Compatibility/readiness | 无行为、API 或默认值变更。权威：`draft` —— `cixzhang` 于 2026-10-02 确定了按压切换规则及其守卫例外（DEC-1），并在本记录的 pull request 上批准它。jsdom 覆盖延迟、守卫、焦点和 invoker 属性；原生轻量关闭仅限浏览器。                       |
| Review checks           | 拒绝以下情形：按压无法关闭用户可见为已打开的表面；守卫由按压打开所预置；重新进入已打开触发器时守卫被重新预置；悬停是到达某个表面的唯一途径；悬停打开会移动焦点；键盘路径在其第二次激活时关闭。                                             |
| Governing rules         | `architecture:interaction-modality` INV2–INV4（模态与焦点归属保持分离；一次焦点移动只有一个指示器；每种模态都有可操作路径，悬停绝不是唯一路径）；`architecture:layer-runtime` 关于原生 invoker 关系以及合成 `mouseenter` 的说明。          |

本表是审查投影；下方正文具有权威性。

## Intent

桌面指针上的浮出菜单按预期应跟随光标：表面在悬停意图下打开，而不是要求按压，并且当指针移往别处时关闭。`useMenuHover` 是唯一决定该行为的地方，因此子菜单和导航浮出层不会各自发明自己的延迟、自己的守卫，以及自己对“按压是否会关闭它”的答案。

该行为已经发布，而且已持续一段时间；它缺少的是一份记录。一项提议删除其中一部分的开放提案之所以合理，恰恰是因为没有任何东西说明那一部分重要。本记录为每个挂载该 hook 的表面约定悬停意图模型——打开、关闭、按压切换和点击守卫。

它只约定悬停模型。打开菜单内部的按压模型、菜单结构、条目语义、方向键导航和层关闭仍归各自的拥有者。

## Compatibility and migration

- 已发布默认值保持不变：`yes` —— 本记录描述当前的 `main`，不改变任何运行时行为、默认值或签名
- 兼容性类别：对已发布行为的文档化；无 API、默认值或可观察差异
- 迁移决策：无需迁移

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**Owns**

- 触发器上的悬停意图：悬停打开表面之前的延迟，以及离开触发器或表面后关闭由悬停打开的表面之前的延迟。
- 指针在触发器上按压是打开、确认还是关闭——包括点击守卫及其运行的窗口。
- 抑制关闭中的面板在不再覆盖静止指针时触发的合成 `mouseenter`。
- 在无法悬停的指针上完全退让。
- hook 执行的打开将焦点移到何处，以及在 hook 自身关闭时将其返回触发器。
- 位于 auto popover 之外的触发器的原生 invoker 关系（`popovertarget`），并取消该 invoker 的默认切换，以便由单个处理程序作出决定。

**Does not own / non-goals**

- 聚合菜单结构、呈现解析、条目渲染与主题——由 `component:DropdownMenu` 及所属导航组件拥有。
- 按压对已打开菜单内部某一行的作用——由 `module:DropdownMenu/useMenuPress` 拥有。
- 方向键打开与关闭键（ArrowRight / ArrowLeft 及其 RTL 镜像）——由渲染触发器的组件拥有。该 hook 只看到 Enter 和 Space，且仅因为浏览器将它们作为点击传递。
- 表面内的 typeahead 与 roving 导航——由 `useListFocus` 和 `useTypeahead` 拥有。
- 原生轻量关闭、跨层的 Escape 顺序以及焦点陷阱——由 `architecture:layer-runtime` 和 `family:overlay-dismissal` 拥有。
- 定位、锚定与碰撞行为——由 `useLayer` 拥有。
- 给定触发器是否存在表面：传入 `isEnabled: false` 的使用方得到惰性处理程序，且没有悬停行为。

## Public API and concepts

| Concept            | Closed values or states         | Meaning                                                                                             | Default            | Owner                               | Stability |
| ------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------- | --------- |
| open provenance    | `hover-opened`, `pinned`        | 当前打开是如何开始的；只有 `hover-opened` 表面会在指针离开时关闭，且只有它会预置点击守卫            | 由打开它的事件决定 | `module:DropdownMenu/useMenuHover`  | stable    |
| `showDelay`        | 毫秒，`0` 表示接触即打开        | 打开之前的悬停意图                                                                                  | `150`              | `module:DropdownMenu/useMenuHover`  | stable    |
| `hideDelay`        | 毫秒                            | 离开触发器或表面后、悬停打开的表面关闭之前的宽限                                                    | `200`              | `module:DropdownMenu/useMenuHover`  | stable    |
| `clickGuardMs`     | 毫秒，`0` 表示退出              | 悬停打开之后的一段时间窗口，在此期间按压确认该表面而不是关闭它                                      | `500`              | `module:DropdownMenu/useMenuHover`  | stable    |
| reopen suppression | 任何关闭之后的固定窗口          | 因面板不再覆盖静止指针而到达的 `mouseenter` 会被忽略；真实的指针离开会提前清除该窗口                | `300` ms，不可配置 | `module:DropdownMenu/useMenuHover`  | stable    |
| hover capability   | `(hover: hover)` 匹配，或不匹配 | 是否读取悬停意图；粗指针不调度任何东西                                                              | 由媒体查询决定     | `architecture:interaction-modality` | stable    |
| `ownsFocus`        | `true`、`false`                 | hook 在按压或键盘打开时移动焦点，还是留给表面自己的焦点陷阱                                         | `true`             | `module:DropdownMenu/useMenuHover`  | stable    |
| `popoverId`        | 弹出层的 DOM id，或不存在       | 存在时使触发器成为面板的原生 invoker，并将其排除在轻量关闭之外；随后 hook 取消该 invoker 自身的切换 | 不存在             | `architecture:layer-runtime`        | stable    |
| integration shape  | full，或 pointer-only           | 使用方采用整个模型，或采用悬停意图加 `confirmHoverOpen` 并保留自己的按压与键盘处理                  | full               | `module:DropdownMenu/useMenuHover`  | stable    |

## Behavioral contract

| ID   | Candidate invariant                                                                                                                                                                                  | Basis                                                                                 | Draft review state |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------ |
| FR1  | 具备悬停能力的指针进入已启用的触发器时，必须在 `showDelay` 之后打开表面，且不得移动焦点：指针正在驱动。`showDelay: 0` 表示接触即打开。                                                               | 当前行为；`useMenuHover.test.tsx`、`SideNav.test.tsx`                                 | settled            |
| FR2  | 离开触发器或表面后，必须在 `hideDelay` 之后关闭 `hover-opened` 表面；进入表面必须取消待处理的关闭。`pinned` 表面不得在指针离开时关闭。                                                               | 当前行为；`useMenuHover.test.tsx`、`SideNav.test.tsx`                                 | settled            |
| FR3  | 指针在触发器上按压必须切换表面：打开已关闭的，关闭已打开的。这是默认答案，FR4 是其唯一例外。                                                                                                         | DEC-1；`useMenuHover.test.tsx`、`DropdownMenuSubMenu.test.tsx`                        | settled            |
| FR4  | 在悬停打开后的 `clickGuardMs` 之内落下的按压必须确认该表面而不是关闭它，将其固定（FR2），并在 hook 拥有焦点时把焦点移入。窗口之后，按压必须关闭它。`clickGuardMs: 0` 退出该行为，使每次按压都切换。  | DEC-1；`useMenuHover.test.tsx`、`DropdownMenuSubMenu.test.tsx`                        | settled            |
| FR5  | 守卫必须以悬停打开为基准，绝不能以打开为基准。因此由按压打开的表面完全没有窗口，下一次按压会立即关闭它。这是该规则的预期结果，而不是边缘情况。                                                       | DEC-1；`useMenuHover.test.tsx` 的仅点击与重入用例                                     | settled            |
| FR6  | 重新进入已打开表面的触发器不得重新预置守卫，也不得使该表面再次成为 `hover-opened`；否则下一次有意的按压将永远确认，而该表面永远无法被指针关闭。                                                      | 当前行为；`useMenuHover.test.tsx` 的重入用例                                          | settled            |
| FR7  | 在任何关闭之后的固定窗口内，触发器上的 `mouseenter` 不得重新打开表面，因为定位在自身触发器之上的面板会把该触发器重新置于静止指针之下。真实的指针离开必须提前清除该窗口，以便有意的再次悬停仍会打开。 | 当前行为；`useMenuHover.test.tsx` 的抑制与再次悬停用例                                | settled            |
| FR8  | 当 `(hover: hover)` 不匹配时，`mouseenter` 和 `mouseleave` 不得调度任何东西——一次轻触的兼容性 `mouseenter` 不得让表面悬空打开着——并且按压路径的行为必须与具备悬停能力的指针完全一致。                | `architecture:interaction-modality` INV4；`useMenuHover.test.tsx`、`SideNav.test.tsx` | settled            |
| FR9  | 触发器的键盘激活必须始终打开表面并将焦点移入其中，且绝不能关闭它。键盘没有切换；FR3 的切换属于指针行为，按键上没有任何东西镜像它。                                                                   | 当前行为；`useMenuHover.test.tsx` 键盘套件                                            | settled            |
| FR10 | Escape 必须关闭表面，并在焦点位于其中时把焦点返回触发器。方向键的打开与关闭键属于使用组件，而非本 hook。                                                                                             | `family:overlay-dismissal`；`useMenuHover.test.tsx`、`DropdownMenuSubMenu.test.tsx`   | settled            |
| FR11 | 提供 `popoverId` 时，触发器必须为该面板带上 `popovertarget`，并且 hook 必须取消由此产生的 invoker 切换，使其自身的处理程序成为 FR3 和 FR4 的唯一决策点。                                             | `architecture:layer-runtime`；`useMenuHover.test.tsx` 的 invoker 用例                 | verify             |
| FR12 | 已禁用的集成不得为其触发器添加任何悬停行为，也不得打开表面：在悬停进行中被禁用的触发器保持关闭，无论它是在指针到达之前被禁用，还是在本来会打开它的延迟期间被禁用。                                   | 当前行为；`SideNav.test.tsx` 的折叠/展开用例                                          | verify             |

### Transformation and precedence order

- **ORD1 — 按压解析。** 键盘激活（FR9）→ 表面关闭，于是打开 → 在守卫窗口之内，于是确认（FR4）→ 否则关闭（FR3）。第一个匹配的分支作出决定；后面的分支都不会运行。
- **ORD2 — 悬停进入解析。** 无具备悬停能力的指针，于是什么都不做（FR8）→ 位于重开抑制窗口内，于是什么都不做（FR7）→ 已经打开，于是放弃任何待处理的关闭，其他一切不变（FR6）→ 否则表面在 `showDelay` 之后成为 `hover-opened`（FR1）。
- **ORD3 — 来源清除。** 任何关闭，无论原因如何，都会清除 `hover-opened` 并在浏览器能够命中测试消失的面板之前打上抑制窗口的时间戳；一次确认会清除 `hover-opened` 而不关闭。

### Performance and resources

- **PR1 — 待处理意图不会比取代它的东西活得更久。** 最多只有一个打开和一个关闭处于待处理状态；更新的意图会取代待处理的那个，而不是排队在其后，并且没有任何待处理项能在表面卸载后幸存。被移除表面遗留的触发器无法打开它。
- **PR2 — 在触发器及其表面之外不观察任何东西。** 悬停意图仅从触发器和表面读取，因此有许多触发器的页面不会为每个触发器带来文档级或窗口级成本。

## Accessibility contract

- **AR1 — 悬停打开绝不移动焦点。** 指针正在驱动，因此焦点停留在人离开它的地方；表面可以用打开它的同一指针到达。这保持模态与焦点归属相互分离（`architecture:interaction-modality` INV2）。
- **AR2 — 按压或键盘打开会同步地移入焦点。** 在 hook 拥有焦点的地方，它会在同一 tick 内聚焦第一个已启用条目；当表面为空或仍在加载时，回退到表面容器，因此键盘归属总是离开触发器的列表。其表面是焦点陷阱对话框而非菜单的使用方传入 `ownsFocus: false`，由该陷阱拥有焦点。
- **AR3 — 关闭会把焦点返回触发器。** 当焦点位于表面内部时，hook 自身的关闭会将其返回触发器，因此 Escape 绝不会把键盘用户困在已消失的元素上。
- **AR4 — 悬停是增强，绝不是要求。** 本 hook 打开的每个表面都必须保持可由按压和键盘到达与关闭，且不涉及任何悬停阶段（`architecture:interaction-modality` INV4）。粗指针得到不变的按压路径（FR8）。
- **AR5 — 每次焦点移动只有一个高亮。** hook 将焦点恰好移到一个条目，并且自身不绘制任何东西；同时也在悬停时高亮的表面会把该高亮与焦点保持在同一处（`architecture:interaction-modality` INV3）。

## Design relationships

| Anatomy or state | Design requirement                                     | Representation authority | Module contract |
| ---------------- | ------------------------------------------------------ | ------------------------ | --------------- |
| open surface     | 不引入视觉表示；表面自身的外观属于拥有它的组件         | prescribed               | FR1, FR3        |
| focused item     | 条目组件拥有的既有焦点高亮；本模块只决定哪个条目拥有它 | prescribed               | AR2, AR5        |

## Parent and system relationships

- `component:DropdownMenu` 拥有聚合菜单结构、呈现解析和条目管线。本模块挂在该处作为父级，因为仓库的知识路径规则要求模块记录位于带有活跃组件记录的组件根之下，并由该组件记录列出；使用该 hook 的三个根（`DropdownMenu`、`SideNav`、`TopNav`）中只有 `DropdownMenu` 拥有这样的记录，而作为同级的按压模型也已基于同样的理由挂在同一处。该契约管辖每个使用方，而不仅仅是子菜单。
- `module:DropdownMenu/useMenuPress` 是同级的按压模型，边界是精确的：它决定按压对已打开菜单内部的某一行的作用；本记录决定按压对触发器本身的作用，即对表面本身的作用。两者都不管辖对方的表面。
- `architecture:layer-runtime` 拥有层生命周期、原生轻量关闭，并且已经记录本 hook 为适用的 auto popover 添加真实的原生 invoker 关系，并抑制关闭中的面板产生的合成 `mouseenter`。它还记录：已打开层旁边的一个控件可能在按压期间临时获得 `popovertarget`，并让其 invoker 切换被取消；FR11 就是本 hook 在该关系中的常态用例，而不是第二条规则。
- `architecture:interaction-modality` 拥有模态状态以及 AR1、AR4 和 AR5 所投影的不变式；本记录不添加任何模态定义。
- `family:overlay-dismissal` 拥有跨层的 Escape 顺序；此处不变。
- `SideNav` 和 `TopNav` 目前没有组件记录。当其中任一个获得该记录时，它应当命名本模块，而不是重述悬停模型。

## Verification map

| Contract                    | Verification                                                      | Representative states                                                                        | Mutation or failure expectation                                            |
| --------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| FR1–FR2, FR5–FR7, FR9, FR10 | `useMenuHover.test.tsx`，通过真实使用方驱动，而不是合成测试装置   | 悬停打开、离开关闭、立即按压、窗口之后很久再按压、仅按压切换、触发器重入、面板消失时的 enter | 移除守卫会使立即按压用例失败；把守卫放宽到按压打开会使重入和仅点击用例失败 |
| FR3–FR5                     | `DropdownMenuSubMenu.test.tsx` 的悬停/点击守卫套件                | 浮出层被悬停打开后立即按压；浮出层被悬停打开后在窗口之后按压                                 | 永远无法关闭可见已打开浮出层的按压会使第二个用例失败                       |
| FR1, FR2, FR8, FR12         | `SideNav.test.tsx` 的折叠子菜单悬停意图套件                       | 精细与粗指针、延迟边界、待处理打开期间的卸载、`clickGuardMs: 0` 使用方                       | 调度计时器的粗指针，或仍会悬停打开的已禁用条目，会失败                     |
| FR9, AR1–AR3                | `useMenuHover.test.tsx` 的焦点与键盘套件                          | 悬停打开保持焦点；按压打开在同一 tick 内聚焦第一个条目；在已打开表面上按 Enter；Escape       | 延迟（绘制后）聚焦会失败；会关闭的键盘激活会失败                           |
| FR11                        | `useMenuHover.test.tsx` 的 invoker 用例断言接线；该行为仅限浏览器 | 位于 auto popover 之外的触发器                                                               | jsdom 既未实现轻量关闭也未实现 invoker，因此断言该属性，而关闭过程无法证明 |
| AR4                         | 上述每个套件中的按压与键盘路径                                    | 每个使用方，悬停不可用                                                                       | 只能通过悬停到达的表面会使 `architecture:interaction-modality` INV4 失败   |

## Decision log

### DEC-1 — A press toggles, except the one that follows a hover-open

**Reference:** `module:DropdownMenu/useMenuHover/DEC-1`

**Decider:** `cixzhang`, `2026-10-02`

子菜单行上的按压会切换浮出层，只有一个例外：紧接在悬停打开之后落下的点击不会关闭它。

悬停和点击是一次连续的动作，而不是两个决定。人把光标朝该行移动，浮出层在移动途中于光标下方打开，而他们已经决定要做的点击落在刚刚出现的东西上。守卫窗口识别出该点击原本瞄准的是已关闭的行，因此它确认该表面，而不是撤销它。

窗口之后，情况不同：人按压的是他们能看见已打开的东西，那是一次有意的第二次按压。它应当关闭——“等待一会儿之后再点击菜单切换应当关闭它”，并且“我们应当保留该行为”。

这就是守卫以悬停打开而非打开为基准的原因（FR5）：人通过按压打开的表面从来不是模糊情形，因此下一次按压会在完全没有窗口的情况下关闭它。其表面不会出现在移动光标之下的使用方——即打开在侧栏旁边而非触发器之上的那种——没有需要解决的模糊性，会设置 `clickGuardMs: 0`。

## Open questions

- **OQ1 — 一个使用方自行解析按压规则。**（`checkable`）六个使用方中有五个采用整个模型。`DropdownMenuSubMenu` 只采用悬停意图，并在自己的按压处理中解析 FR3 和 FR4，因此该规则存在于两处，两者可能产生分歧。拥有者的方向是收敛：每个使用方都应当从一处获得 FR3 和 FR4。按压对同时也是菜单条目的菜单行的作用仍是开放部分，因为该行还要服从 `module:DropdownMenu/useMenuPress`；两种形态都必须产生的行为无论如何都已确定。

- **OQ2 — 键盘激活无法可靠区分。**（`checkable`）FR9 要求键盘激活打开且绝不关闭，这取决于在同一触发器上把它与指针激活区分开。同时承载一个会派发自身激活的模型的触发器，无法通过浏览器给按键的信号被区分，因此 FR9 的保证在那里并不成立。没有已发布的表面受影响，因为同时承载两者的那一行保留了自己的按压处理（OQ1）——但收敛 OQ1 会使这一点变得可达，两者应当一起确定。派发的激活应当是什么样，属于 `module:DropdownMenu/useMenuPress`，而不是此处。

## Content boundary

本记录不重复源代码中编写的 hook 签名或选项默认值、拥有组件的结构、主题或条目语义、已打开菜单内部的按压模型、层定位与关闭规则，或实现步骤。它链接到它们的规范拥有者。
