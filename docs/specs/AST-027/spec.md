---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-027
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-04
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture: [architecture:layer-runtime]
affects_families:
  [family:input-fields, family:layout-regions, family:overlay-dismissal]
affects_contributing: []
affects_consumer_docs: []
---

# Local stacking and browser top-layer routing system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "layering": ["DEC-1", "DEC-2", "DEC-3", "DEC-4", "FR11"]
  }
}
```

## Intent

一个 Astryx 组件应当能够对其自身绘制的组成部分排序，而不改变无关组件、页面内容或应用外壳的堆叠方式。菜单、对话框以及其他浮层交互表面应当通过 Astryx 的 Layer 系统与浏览器顶层摆脱普通的文档堆叠，而不是通过更大的 `z-index` 值。

本规格区分两种机制：

- **局部堆叠（local stacking）**在一个组件自有表面内部排序其组成部分；以及
- **顶层路由（top-layer routing）**通过 [`architecture:layer-runtime`](../../architecture/layer-runtime.md) 托管浮层交互表面。

一个局部数值永远不会变成对整个页面的主张。

## Non-goals

- 定义阴影、边框或感知的层次高度。这些仍属于视觉设计关注点。
- 创建全局的数值 z-index 刻度或语义化的全页 z-index token。
- 改变哪种交互会关闭菜单、对话框、popover 或其他浮层。
- 要求在没有局部绘制顺序关系的组件上使用 `isolation: isolate`。
- 将 React portal 视为等同于浏览器顶层提升。

## Terms

- **局部层（Local layer）：**一个定位元素或堆叠上下文后代，其绘制顺序只在一个组件自有表面内部有意义。
- **隔离所有者（Isolation owner）：**为某一个局部堆叠关系建立 `isolation: isolate` 的组件自有元素。
- **表面所有者（Surface owner）：**绘制或直接拥有该组件表面的元素，该表面的组成部分正在被排序，包括其背景、边框、裁剪或高度边界。
- **浮层交互表面（Floating interaction surface）：**为履行其交互角色必须摆脱普通内容或裁剪的菜单、对话框、popover、tooltip、hover card、sheet、命令表面或类似 UI。
- **浏览器顶层（Browser top layer）：**通过原生机制（如 Popover API 或模态 `<dialog>`）进入的平台堆叠平面。

## Requirements

### Local stacking

- **FR1 — z-index 仅限局部。**Astryx 中的 `z-index` 值必须在单个组件自有的堆叠关系内排序其组成部分。它不得与无关组件、应用内容、AppShell 外壳或其他页面区域建立排序契约。
- **FR2 — 隔离边界归表面所有。**每个局部堆叠关系都必须在包含该关系的组件表面上有一个 `isolation: isolate` 所有者。隔离边界必须位于表面所有者上，而不是任意的页面包装器或更远的祖先上。
- **FR3 — 隔离所有者不提升自身。**外层隔离所有者必须保持在其正常的父级绘制层级。局部 `z-index` 值属于该所有者内部的后代。如果嵌套表面必须在一个更大的组件内部排序，则该更大的组件提供另一个局部隔离所有者。
- **FR4 — 局部数值没有系统级排名。**诸如 `-1`、`0`、`1`、`2` 或动态局部深度这样的值可以表达隔离所有者内部的关系。同一个值在另一个组件中可能表示不同的含义。Astryx 不得记录或依赖全页范围的数值带，例如“输入框在 1”“粘性内容在 10”或“浮层在 1000”。
- **FR5 — 修复泄漏的所有者，而不是无关的邻居。**当一个组件部件绘制在无关 UI 之上时，修复必须把该部件限制在其组件自有的表面内。把无关的表头、外壳或邻居提升到更大的数值不是符合规范的修复。
- **FR6 — 每个局部状态都保持被包含。**hover、focus、校验、拖拽、粘性、选中、调整大小、动画以及负层级状态都必须留在同一个隔离边界内。状态变化不得把组件表面提升为页面级的堆叠竞争者。

### Floating interaction surfaces

- **FR7 — 浮层交互使用 Layer 系统。**菜单、对话框、popover、tooltip、hover card、sheet、命令表面以及等价的浮层交互必须使用由 [`architecture:layer-runtime`](../../architecture/layer-runtime.md) 拥有的托管与提升机制。局部组件不得用定位 DOM 和页面级 `z-index` 重建该系统。
- **FR8 — 浏览器提升拥有跨表面顺序。**必须摆脱普通内容或裁剪的浮层交互，必须通过适用的 Layer/原生宿主进入浏览器顶层。body portal、fixed 定位或更大的数值都不是替代品。
- **FR9 — 顶层宿主内部的数值仍为局部。**被提升的表面可以使用局部隔离的 z-index 值来排序其自身的背景遮罩、面板、箭头、控件或动画层级。这些值不得被当作该表面出现在页面内容或其他原生宿主之上的原因。
- **FR10 — 现有 Layer 支持边界仍然具有权威性。**原生 Popover 与模态对话框行为、纠正性 portal、锚定定位、降级的浏览器回退以及全局宿主准入，继续遵循 `architecture:layer-runtime` 和 [AST-003](../AST-003/spec.md)。本规格不授权组件在原生支持不可用时绕过这些契约。
- **FR11 — 流内 UI 保持在流内。**label、状态消息、banner、粘性页面区域、focus ring 或其他流内呈现，不会仅仅因为它需要局部绘制排序就变成浮层交互。它遵循 FR1–FR6，除非其所属契约明确将其指派给 Layer。

### Implementation requirements

- **IR1 — 每个已发布的 z-index 都被分类。**在本规格发布之前，已发布包源码和 CLI 生成模板源码中的每个生产 `z-index` 都必须被分类为被包含的局部关系、Layer/原生顶层宿主内部的局部关系，或迁移缺口。未分类的值视为迁移不通过。
- **IR2 — 新的泄漏会在机制上失败。**仓库检查必须拒绝没有组件自有隔离表面的新局部 z-index 关系。检查可以使用源码元数据，或对所有者无法静态推导的关系使用窄范围允许列表，但允许列表条目必须指明其所有者与验证方式。
- **IR3 — Layer 绕过会在机制上失败。**仓库检查必须拒绝新的菜单、对话框、popover、tooltip、hover card、sheet、命令表面或等价的浮层，若其使用页面级 z-index 而不是共享的 Layer 或原生顶层路径。
- **IR4 — 迁移移除过时的数值带。**当一个表面被包含或移入顶层时，过时的全页 z-index 注释、常量、token、测试以及补偿性邻居值必须在同一次变更中移除。

### Platform support

- 支持的特性/引擎下限：`isolation: isolate` 在 Astryx 支持的每个浏览器中定义局部堆叠。浮层表面的支持遵循 `architecture:layer-runtime` 中的矩阵与降级回退。
- 不支持的行为：低于原生 Layer 特性下限的浏览器会收到文档化的降级回退。它不得收到未文档化的全局 z-index 阶梯作为尝试性的顶层 polyfill。
- 浏览器证据：局部包含需要真实浏览器的绘制与命中测试证据。Popover、模态对话框、焦点/惰性以及顶层排序需要 `architecture:layer-runtime` 所指定的真实浏览器矩阵；Playwright WebKit 不能替代 Safari 专属证据。

## Current-state impact

仓库中已经包含符合预期局部模式的良好示例：Thumbnail、Calendar、ChatComposer、ChatLayout、CodeBlock、CheckboxInput、RadioList、Switch、Slider、Field 的附连状态包装器，以及触摸版 DateInput 面板，都把内部 z-index 关系置于局部 `isolation: isolate` 所有者之下。它们是迁移参考，而不是每个后代都正确的全面证明。

源码审计覆盖了已发布包源码与 CLI 生成模板源码：`packages/{core,lab,charts,richtext}/src` 和 `packages/cli/assets/templates`，排除测试与 stories。它发现了跨 40 个文件的 56 条生产声明，以及以下当前缺口：

| 表面                                                                                        | 当前机制                                                                                                                                                                            | 本规格下的影响                                                                                                                     | 必需的迁移或证明                                                                                             |
| ------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 共享的 Field 输入包装器，包括 TextInput、FileInput、TextArea、NumberInput 和 RichTextEditor | `inputWrapperStyles.base` 把绘制出来的输入表面本身置于 `z-index: 1`；只有附连状态组合会添加隔离包装器；RichTextEditor 还把其状态图标置于未隔离表面内部的局部 `1`                    | **已确认泄漏。**分离式与 tooltip 的 Field 组合直接与 AppShell 以及后续页面内容竞争                                                 | 为每个变体把隔离放在 Field 自有的表面上，把包装器与状态图标层保持在其下，并移除绘制输入表面的外部排名        |
| 生产 docsite 组件页面                                                                       | 在 `/components/TextInput` 上的一次实时 Chromium 探测发现，渲染的输入框与粘性 AppShell 表头都处于 `z-index: 1` 且为 `isolation: auto`；输入框滚动进表头后，它在浏览器命中测试中胜出 | **已确认的面向用户的泄漏。**生产路由上的一个真实组件示例覆盖了导航                                                                 | 把该路由与重叠控件关系保留为 Chromium 回归测试夹具；证明被包含的 field 在无关粘性外壳之下通过                |
| AppShell 表头与跳过链接                                                                     | 粘性表头使用 `1`，获得焦点的跳过链接使用 `9999`，且外壳根未隔离；只有透明内容建立了局部隔离边界                                                                                     | **已确认的页面级耦合。**AppShell 为普通外壳部件暴露数值带                                                                          | 隔离 AppShell 自有的表面并只在其内部使用局部深度；跳过链接保持为局部 AppShell 内容，而不是可复用的全局数值带 |
| ChatComposerDrawer 与 ChatDictationButton                                                   | 单独导出的抽屉根与听写条使用 `z-index: 1` 却没有自有隔离；放在 ChatComposer 内部只是一种使用方约定                                                                                  | **已确认的隐式包含缺口。**任一导出都可以被组合到 ChatComposer 的隔离根之外                                                         | 为每个导出的部件提供组件自有的隔离表面并保持其内部排序为局部；不要依赖使用方祖先                             |
| InputGroup 焦点排序                                                                         | 获得焦点的连通子元素使用 `z-index: 1`；InputGroup 通过分离路径组合 Field                                                                                                            | **已确认泄漏。**焦点排序可以逃出该组                                                                                               | 隔离完整的绘制组所有者，并针对相邻组件验证连通边框的焦点排序                                                 |
| SideNav 粘性内容                                                                            | 粘性顶部区域使用 `z-index: 1`；SideNav 根未隔离                                                                                                                                     | **已确认泄漏。**粘性导航内部可以与兄弟元素竞争                                                                                     | 为 SideNav 表面添加隔离；折叠菜单继续使用 Popover/Layer                                                      |
| Outline 活动指示器                                                                          | 定位的指示器在未隔离的根之下使用 `z-index: 1`                                                                                                                                       | **已确认泄漏。**视觉指示器可以在 Outline 之外竞争                                                                                  | 隔离 Outline 根并保持指示器关系为局部                                                                        |
| Table 粘性列与调整大小手柄                                                                  | 粘性表头/表体单元格使用 `3` 和 `1`，行浮层使用 `-1`，调整大小手柄使用 `1`；`TableScrollWrapper` 未隔离                                                                              | **已确认泄漏。**Table 内部可能遇到无关的外壳内容                                                                                   | 隔离 `TableScrollWrapper`；将表头/表体/浮层/调整大小的排序保持在其下，并在外壳 chrome 之下验证粘性状态       |
| 可调整大小的手柄与局部浮层                                                                  | 浮层根、命中区域与 pill 使用 `1` 和 `2`；没有调整大小后的表面所有者被隔离                                                                                                           | **已确认泄漏。**调整大小的可供性元素可以逃出其区域                                                                                 | 隔离每个被调整大小的面板或区域所有者，而不仅是手柄后代；针对相邻内容验证拖拽与焦点状态                       |
| Lab Schedule 与 ChartZoom 浮层                                                              | Schedule 使用 `1`、动态事件级别和 `20`；ChartZoom 使用 `1`；两个绘制根都未隔离                                                                                                      | **已确认泄漏。**可视化内部创建了页面级排名                                                                                         | 隔离 Schedule 与 Chart 的绘制根；Chart 还要建立其绝对定位工具栏所需的包含块                                  |
| ChartTooltip                                                                                | 已发布的 Charts 包使用 `position: fixed` 和 `z-index: 9999` 渲染 tooltip，而不是 Layer                                                                                              | **已确认的 Layer 绕过与页面级泄漏。**它使用的正是 FR7–FR8 所禁止的替代品                                                           | 让 ChartTooltip 通过 Layer 的 fixed 模式与浏览器顶层路由；把 tooltip 内部排序保持在其表面内                  |
| Lab ListInput 与 TransferList 重排指示器                                                    | 共享的重排样式使用 `z-index: 2`；ListInput 的分离 Field 路径未隔离，而 TransferList 只是偶然依赖 `container-type`                                                                   | **ListInput 已确认存在缺口；TransferList 的隐式包含不是显式契约**                                                                  | 为两个绘制所有者添加显式隔离，并在 Chromium 中验证重排命中测试                                               |
| CLI 生成的页面模板                                                                          | Dashboard 告警栏与 Settings 对话框使用局部 `1`；Table 过滤器使用重排 `2`；Kanban 以 `1000` 渲染固定的拖拽克隆                                                                       | **生成的泄漏。**新的使用方应用继承了隐式局部边界，并且对 Kanban 而言继承了一个页面级浮层数值带                                     | 为局部模板关系添加显式表面隔离；让 Kanban 拖拽克隆通过仅视觉的 Layer/顶层宿主路由                            |
| Popover、Lightbox 与模态面板内部                                                            | 小数值在原生 Popover 或对话框宿主内部排序箭头、控件、手柄、面板与色调                                                                                                               | **跨页面机制正确；局部所有权仍需证明。**是浏览器宿主（而非数值）把表面置于页面内容之上                                             | 保留顶层托管，并为每个内部关系添加或识别一个显式隔离所有者                                                   |
| ToastViewport                                                                               | 视口进入 `popover="manual"`，但同时也带有 `z-index: 500`                                                                                                                            | **冗余的页面数值带，加上 AST-003 的托管缺口。**是原生提升（而非 `500`）拥有页面内容排序；当前的 Toast 仍可能位于后来打开的模态之后 | 先完成 AST-003 的全局宿主，或在同一次变更中完成，然后移除 `500` 并把任何内部排序保持在隔离的视口表面之下     |
| BottomSheet 与 BottomSheetSwitcher 的非模态路径                                             | 非模态 `dialog.show()` 路径使用从 `1000` 开始的静态或动态值                                                                                                                         | **已确认的全局泄漏。**页面数值带无法提供对话框层语义                                                                               | 让非模态托管通过 Layer/原生顶层基础设施路由；把面板、手柄、色调、操作与堆栈排序在宿主内部保持局部隔离        |

现有源码已经把 Tooltip、HoverCard、Popover、DropdownMenu 及其子菜单、ContextMenu、CommandPalette、模态 Dialog、Drawer、Lightbox、MobileNav、Tour、日期输入层与 RadialTooltip 路由到 Layer、原生 Popover 或 `showModal()`。它们的跨页面机制在方向上是符合规范的。已确认的例外是 ChartTooltip，以及非模态的 BottomSheet 与 BottomSheetSwitcher 路径。Toast 已被提升，但仍存在 AST-003 已经接管的全局宿主限制。

这张表是影响清单，而不是实现批准。每一行在迁移落地之前仍然需要其指定的浏览器证据。穷尽式的 IR1 审计可能增加行；一行只有具备指定的所有权与证据才能被清除。

## Verification

| 契约     | 验证                                        | 代表性状态                                                                       | 变更或失败预期                                                             |
| -------- | ------------------------------------------- | -------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| FR1–FR6  | 源码分类加上真实 Chromium 绘制/命中测试矩阵 | 正、零、负、粘性、聚焦、拖拽、选中以及动画的局部层                               | 移除隔离所有者会让后代覆盖无关的兄弟元素；改变局部值永远不会改变页面级顺序 |
| FR2, FR3 | DOM 所有权与计算样式断言                    | 绘制表面根、嵌套局部表面、透明表面、使用方包装器                                 | 隔离出现在遥远的页面祖先上，或隔离所有者本身通过页面级 z-index 竞争        |
| FR5      | 前后对比回归夹具                            | 粘性 AppShell 表头下的 docsite Field；外壳 chrome 下的 Table                     | 必须提升邻居才能让夹具通过，或泄漏表面仍在命中测试中胜出                   |
| FR7–FR10 | Layer 单元测试与真实浏览器顶层矩阵          | 菜单、子菜单、对话框、popover、tooltip、hover card、sheet、CommandPalette、Toast | 定位 DOM 或 body portal 取代 Layer，或数值带决定了跨表面顺序               |
| FR11     | 组件与浏览器测试                            | label/状态重叠、粘性区域、focus ring、banner                                     | 流内 UI 被不必要地提升，或其局部绘制状态逃出其表面                         |
| IR1      | 生成的已发布 z-index 清单在 CI 中检查       | 每个已发布包与生成的模板声明                                                     | 声明缺失、重复，或没有所有者/分类                                          |
| IR2, IR3 | 带有效与无效示例的静态规则夹具              | 隔离的局部组件、泄漏的 field、手工构建的菜单、原生 Layer 表面                    | 泄漏或 Layer 绕过通过，或有效的隔离关系被拒绝                              |
| IR4      | 变更文件与源码扫描                          | 已迁移的 Field、AppShell、Table、Toast、BottomSheet、Drawer                      | 迁移后仍残留过时的数值带、注释、测试或补偿值                               |

### Completion criteria

仅当以下条件满足时，本规格才转为 `shipped`：

- 已发布包源码与 CLI 生成模板源码中的每个 z-index 都有所有者和分类；
- 每个普通局部关系都被其组件自有的绘制表面所包含；
- 真实的 docsite Field/AppShell 失败在修复前被复现，修复后通过局部包含；
- 菜单、对话框、popover、tooltip、hover card、sheet、命令表面与等价浮层使用 Layer/原生顶层路径；
- 数值带不再决定跨组件、页面外壳或浮层的顺序；
- 机制化检查拒绝代表性的局部泄漏与 Layer 绕过；
- 局部包含与 Layer 托管的浏览器矩阵通过；以及
- `architecture:layer-runtime` 以及受影响的 family/组件记录描述了已发布的归属关系，且不依赖本影响清单。

## Decision log

### DEC-1 — z-index expresses local relationships only

**Reference:** `spec:AST-027/DEC-1`

**Decider:** `cixzhang`, `2026-09-04`

一个 z-index 值属于一个组件自有的堆叠关系。在别处复用同一个数字不会在组件之间建立任何关系。

已否决：用全局刻度把输入框、粘性导航、页面 chrome 与浮层相互排名。这种刻度把每次局部变更变成全页兼容性问题。

### DEC-2 — Isolation lives on the component surface

**Reference:** `spec:AST-027/DEC-2`

**Decider:** `cixzhang`, `2026-09-04`

拥有绘制表面的元素同时建立 `isolation: isolate`。随后后代 z-index 值可以排序该表面的组成部分，而不会逃逸到无关内容。

已否决：把隔离放在任意的页面包装器上，或提升表面根本身。两者都保留了组件与其调用者之间的隐藏耦合。

### DEC-3 — Floating interactions use the browser top layer through Layer

**Reference:** `spec:AST-027/DEC-3`

**Decider:** `cixzhang`, `2026-09-04`

菜单、对话框与等价浮层交互通过 Astryx 的 Layer 系统与适用的原生顶层宿主路由。它们的跨表面顺序来自浏览器宿主与 Layer 契约，而不是某个数字。

已否决：以 fixed 定位、body portal 或大 z-index 作为 Layer 的替代。这些机制不提供原生顶层、模态、关联、定位或关闭行为。

### DEC-4 — Leaks are repaired at their owner

**Reference:** `spec:AST-027/DEC-4`

**Decider:** `cixzhang`, `2026-09-04`

当 Field 或其他组件覆盖了无关的外壳 chrome 时，把该组件包含在其自身表面内。不要提升 AppShell，也不要添加另一个全局数值带。

已否决：把 AppShell 表头提升到更大的页面级数值。它只能通过压过今天的值来通过某个已知比较，并把同样的缺陷留给下一个更大的值来重现。

## Open questions

无。
