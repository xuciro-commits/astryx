---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-038
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-26
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:layer-runtime]
affects_families: []
affects_contributing: []
affects_consumer_docs: [Layer, useLayer, Dialog]
---

# Layer inherited-text and grouping boundary system spec

## Intent

打开对话框、菜单、工具提示或其他浮动阅读表面的人，不得仅仅因为其触发器位于带格式的段落、标题、表格单元格或代码区域中，就得到居中、斜体、大写、缩进或无法换行的正文文本。层会开启一个新的阅读任务，同时保留周围的主题与语言上下文。原生顶层提升改变的是绘制，而非 CSS 继承，因此边界必须显式声明。层也不是祖先视觉分组的另一个成员：其中的按钮与输入控件不得继承该分组的连体边框、尺寸、密度或其他呈现默认值。触发器保留其分组样式；新打开的表面开始自己的作用域。表面/分组成员关系在 FR7/FR8 下整体停止；无关的上下文以及显式编写的 props 与无障碍语义保持原样。

原始约定于 2026-09-23 **由 `cixzhang` 批准**（DEC-1–DEC-3）。同日，`cixzhang` 将其范围更正为**仅文本/布局/视觉隔离**（DEC-4）。已批准的 DEC-5 移除了分离视觉字段的要求：表面/分组成员关系在 FR7/FR8 下整体停止。无关的 ARIA、焦点、键盘归属、关闭、语义/数据/交互上下文，以及显式编写的 DOM/无障碍树语义保持原样。`cixzhang` 于 2026-09-23 批准了 DEC-4 并授权其仅规格合并。[实现 PR #6457](https://github.com/meta/astryx/pull/6457) 可与此已接受约定对齐。本记录与测试通过均不授权实现合并。架构只是投影该决策，而非独立批准它。

### Ownership

AST-038 拥有封闭的继承文本基线、祖先视觉分组边界、参与规则、优先级与兼容性决策。它区别于 [AST-003](../AST-003/spec.md)，后者的非目标明确排除视觉处理。AST-003 仍是已接受的宿主与交互变更的所有者；本规格既不重复那些需求，也不使其未实现的变更成为当前有效。

[层运行时](../../architecture/layer-runtime.md) 描述了已交付的宿主机制，并将在实现后投影已批准的文本边界。其既有批准无法授权这一新的跨组件样式决策。[组件样式编写](../../architecture/component-style-authoring.md)、[主题应用](../../architecture/theme-application.md) 与 [公共组件 API](../../architecture/public-component-api.md) 分别继续拥有 lowering、实时主题上下文与既有覆盖接缝。已检查了受影响层路径、`layerTextReset`、`inherited text` 与 `AST-038` 的当前记录与未完成工作；重叠的实现是 PR #6457，而非独立批准的约定。

## Non-goals

- 重新设计宿主、portal、定位、模态语义、焦点、关闭、选择、滚动、动效，或哪些层出现在原生对话框之上。在 FR8 下停止祖先视觉样式与整体成员关系属于范围内；无关的交互、集合成员关系、禁用/选中状态、标签/描述与无障碍语义不改变。尤其不要中和 `aria-disabled`、改变无障碍树的禁用继承、添加语义角色，或为满足此样式约定而引入更正性 portal 宿主。
- 统一层内的前景色、背景、几何、组件类型角色或刻意排版；改变全局文档重置或非 Astryx 元素；中和祖先的 text-decoration 传播。
- 新增组件 props、重置退出选项、公共重置工具、主题目标、令牌、包装器或运行时样式复制。既有显式样式接缝仍是请求刻意格式的方式。
- 新增无障碍约定、视觉测试夹具产物或测试基础设施。验证用于证明此样式约定；它不授权新增或修改工作流，也不授权改变无关的集成评估器。
- 等价的内部实现仍然有效。私有模块名与共享机制属于架构或实现，而不是本约定。

## Requirements

### Closed baseline

**FR1 — 中性阅读基线。** 每个参与的内容边界必须在组件与调用方样式之前，恰好建立以下继承属性默认值。未列出的继承文本属性不由 FR1 重置。

| 属性              | 基线                       | 原因                                   |
| ----------------- | -------------------------- | -------------------------------------- |
| `font-family`     | `var(--font-family-body)`  | 不要借入代码字体或标题字体。           |
| `font-size`       | `var(--text-body-size)`    | 以活动主题的正文角色开始普通内容。     |
| `line-height`     | `var(--text-body-leading)` | 保留主题的正文阅读节奏。               |
| `font-weight`     | `var(--text-body-weight)`  | 不要借入触发器的强调。                 |
| `font-style`      | `normal`                   | 被强调的祖先不得使该任务变为斜体。     |
| `text-align`      | `start`                    | 从阅读边缘开始，包括 RTL。             |
| `text-align-last` | `auto`                     | 不要继承末行两端对齐。                 |
| `text-indent`     | `0`                        | 不要继承段落或图标替换缩进。           |
| `text-transform`  | `none`                     | 保留编写的字母大小写。                 |
| `letter-spacing`  | `normal`                   | 不要继承标题字距。                     |
| `word-spacing`    | `normal`                   | 不要扭曲阅读或固有尺寸。               |
| `text-shadow`     | `none`                     | 不要借入装饰性文字阴影。               |
| `white-space`     | `normal`                   | 允许在预格式化/nowrap 祖先下正常换行。 |
| `word-break`      | `normal`                   | 把例外断词留给内容所有者。             |
| `overflow-wrap`   | `normal`                   | 把长令牌换行留给内容所有者。           |
| `hyphens`         | `manual`                   | 不要继承自动连字。                     |

**FR2 — 主题与书写上下文存活。** 边界必须保留 `direction`、`writing-mode`、`text-orientation`、语言、主题/自定义属性值、`color-scheme`、字体特性/变体设置以及无障碍偏好。作用域布局/呈现值归入 FR7，即使由自定义属性承载；这并不授权按前缀清除属性或重置语义主题令牌。主题不是祖先布局提供者。当局部主题变化时，主题正文令牌必须保持实时。这并不承诺超出既有宿主约定所能提供的更多上下文恢复。

**FR3 — 表面、行为与无障碍归属存活。** 颜色/背景配对、几何、显示、定位、动画、不透明度、可见性、光标、`pointer-events`、`touch-action` 与 `user-select` 必须保留其既有所有者。ARIA 属性、焦点、选择、禁用/只读状态、回调、键盘归属、关闭、语义/数据/交互上下文以及 DOM/AX 语义必须保持原样，但随其整体上下文在 FR8 下停止的、由成员关系拥有的值除外。不得因为内容在视觉上独立而另外改变事件路由或漫游焦点。反转的 Tooltip 与 Toast 颜色、Lightbox 字幕，以及点击穿透的通知/非模态宿主，不得被文本基线改变。[容器内边距边界](../../architecture/container-padding.md) 是独立的。`text-decoration` 不被继承；后代的 `none` 无法移除从祖先传播的装饰，也不属于 FR1 的一部分。

### Participation ledger

**FR4 — 阅读表面，而非关闭角色。** 纳入要求有一个内容承载的 Astryx 表面，经由 Layer、原生 Dialog 或等价的层宿主呈现在其所有者正常流之外。同一表面的模态、非模态、回退与内联预览呈现必须共享该基线。组合在其既有内容边界处获得该基线，而非在其触发器处。嵌套层建立自己的边界。

| 表面族                         | 参与路径                                                                                                                                                                                                                                                                             | 原因 / 完成标准                                                                  |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- |
| Layer-backed content           | Context/anchor、context/custom 与 fixed Layer；Popover/usePopover；Tooltip/useTooltip；HoverCard/useHoverCard；ContextMenu；DropdownMenu 子菜单                                                                                                                                      | 公共边界在每个渲染器中中和环境格式，而不改变几何或宿主。                         |
| Popover compositions           | DropdownMenu、MoreMenu、NavHeadingMenu、TabMenu、TopNav 菜单、折叠的 SideNav 条目与标题菜单、BreadcrumbItem 菜单；Selector/MultiSelector/ComplexSelector、Typeahead/BaseTypeahead、日期输入、PowerSearch、ChatComposerInput 菜单、Table 筛选；Lab TourStep、ChatEmojiPicker、InfoTip | 继承公共重置；不重复重置，也不改变触发器/API。                                   |
| Layer utility surfaces         | 键盘提示、Carousel 控件、Tokenizer 溢出、图表/径向工具提示、ListInput/TransferList 拖拽预览                                                                                                                                                                                          | 共享宿主提供该基线；显式编写的提示/图表 nowrap 与组件排版仍然优先。              |
| Dialog family                  | 模态与内联 Dialog、AlertDialog、命令式 Dialog/AlertDialog、CommandPalette                                                                                                                                                                                                            | 原生与预览路径一致；组件与调用方样式仍然更强。                                   |
| Independent viewers/navigation | Lightbox、含 AppShell 的 MobileNav、模态与非模态模式下的 Lab Drawer                                                                                                                                                                                                                  | 每个独立根都参与；媒体/字幕处理与交互保持原样。                                  |
| Sheets                         | 独立与可切换的 BottomSheet，包括自适应菜单/输入呈现                                                                                                                                                                                                                                  | 被绘制的内容面板拥有该边界，而非其透明外壳或每个子元素。                         |
| Notifications                  | 提升的与非顶层 ToastViewport；LayerProvider 与命令式回退                                                                                                                                                                                                                             | 视口为默认/自定义 toast 文本提供该基线，而不重置页面子元素或改变颜色与指针行为。 |

Tooltip/HoverCard 的使用方（包括 Button、Link、Text、Timestamp、Avatar、StatusDot 以及字段说明）无需独立的触发器变更。排除项：在流内的 ChatComposerDrawer、Overlay/OverlayScrim、本地图表十字线与缩放控件、空的 Tour 高亮/遮罩，以及仅通过 portal 挂载的 Token 或 Stepper。Tour Popover 标注参与其中。仅移动 DOM 不会把普通内容变为阅读层。

### Precedence and compatibility

**FR5 — 显式样式优先。** 仅在内容承载根上、在组件样式与受支持的主题/使用方覆盖之前应用该基线。绝不重置后代。有意的标题、代码、居中的字幕、粗体强调、nowrap 提示与 Tooltip/Toast 的断词规则必须保持有效。既有 `xstyle`、`className` 与 `style` 的优先级不得重排。

**FR6 — 不提供新选择或公共表面。** 没有重置退出 prop、公共重置辅助函数/导出、新主题目标或令牌。有意依赖继承格式的调用方，必须在既有根样式接缝上或在其内容上表达（在支持处包括显式 `inherit`）。对这些调用方而言这是可见的兼容性变更，必须在使用方指南与发布说明中说明。正常的主题正文内容不得获得无关的视觉变更；选定的组件类型角色仍归组件所有。

### Ancestor layout and grouping boundary

**FR7 — 祖先布局与呈现在层边界处停止。** 所有提供者的作用域布局、视觉、密度、尺寸、分组或呈现调整，默认必须在内容边界处停止；表面/分组成员关系上下文在 FR8 下整体停止。这包括通用的 SizeProvider，而不仅是 ButtonGroup/InputGroup 提供的尺寸，并按职责适用于**未来的提供者**，而不是固定的名称允许列表或今天的证据台账。此方向已在 DEC-2 中批准。

触发器/控件仍留在其祖先作用域中。层内容不得仅因 DOM 或 React 祖先关系，就获得祖先分组的连体角/边框/分隔线处理、视觉方向、密度或尺寸。无论呈现由 context、选择器/标记还是作用域结构自定义属性承载，该边界都适用。仅靠 CSS 文本重置无法满足它。主题与书写上下文仍由 FR2 覆盖。语义角色与方向、禁用/选中状态、无障碍命名、集合成员关系、回调与交互行为必须保留其既有归属与值，但随 FR8 整体停止的表面/分组归属除外。

**FR8 — 整体表面/分组归属；无关归属存活。** 无关的语义、数据、交互与无障碍提供者必须保留其既有继承与所有者协议。

有意针对层内内容的布局/视觉/呈现提供者，必须在其内容边界内部或跨越该边界单独建立。这些提供者管辖其后代直到下一个层边界。显式子级 props 继续有效；主题与书写上下文仍由 FR2 保留。这些规则按职责而非名称适用于未来的提供者。

当 FR7 适用于由一个上下文承载的表面/分组归属时，该既有整体值停止；视觉字段不被分离。由成员关系拥有的状态（包括禁用/只读状态）随之停止。无关上下文、显式编写的 props 与既有公共 Context/Provider 形态保持原样。不隐含任何公共退出选项或特定私有机制。

仅凭上下文的字段类型，不能确立它只负责呈现。[AvatarGroup](../../../packages/core/src/AvatarGroup/AvatarGroupContext.ts) 存储视觉尺寸/形状/重叠值，但其存在同时决定 [Avatar](../../../packages/core/src/Avatar/Avatar.tsx) 工具提示的 `tabIndex` 与可聚焦性。该分组成员关系在 FR7/FR8 下整体停止。[LayoutArea](../../../packages/core/src/Layout/LayoutAreaContext.ts) 既选择语义 DOM 元素，也选择分隔线与间距；其语义元素选择保持原样。

层不会清除所有 React context，也不会覆写每个后代的几何。已分组的触发器仍保持视觉分组，显式的内部视觉分组正常工作。无关的语义归属保持原样。

这些示例说明已接受的通用区分，而非封闭的例外清单：

| 表面所有者                                                                                                                                            | 存活的显式所有者协议                                                                                                                              | 停止的祖先呈现                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| [DropdownMenu](../../../packages/core/src/DropdownMenu/DropdownMenu.tsx) 与 [子菜单](../../../packages/core/src/DropdownMenu/DropdownMenuSubMenu.tsx) | 该菜单的单选选择、其关闭链，以及为其条目/子菜单表面显式建立的菜单自有尺寸。当前菜单围绕被渲染内容建立自己的上下文；子菜单将其关闭回调与父级组合。 | 外层 ButtonGroup 视觉样式与环境 SizeProvider/视觉默认值。菜单自有尺寸由表面所有者有意建立，而非通用的尺寸提供者豁免。 |
| [Selector](../../../packages/core/src/Selector/Selector.tsx) / [Typeahead](../../../packages/core/src/Typeahead/BaseTypeahead.tsx)                    | 所有者的选项/结果、活动选项、搜索查询与选择回调仍连接其自身弹出层。当前代码通过局部状态/闭包以及组件 props 承载这些；本示例不需要新上下文。       | 外层 InputGroup 尺寸、连体边框/圆角与其他分组视觉不作用于弹出层控件。输入/触发器本身仍处于分组中。                    |
| [表格筛选](../../../packages/core/src/Table/plugins/filtering/useTableFiltering.tsx)                                                                  | 列标识、筛选值/草稿以及应用/清除行为属于筛选表面。当前代码在 popover 内建立草稿 FilterStoreContext，并显式传递列键。                              | 外层表格/行密度、分隔线、对齐与其他作用域呈现不成为筛选面板默认值。筛选表面可建立自己的局部布局。                     |

表格筛选中显式的内部 store 是内容提供者的示例。刻意放在层内的 SizeProvider 或 ButtonGroup 同样作用于该内容，但围绕其触发器的同一提供者不会。嵌套层开启另一个边界，并要求自己的显式内容提供。图表数据、表单模型与层关闭协调保留其既有继承与所有者协议；整体表面/分组归属遵循 FR8。

### Grouping evidence and scope ledger

审计在提议的纯文本实现上检查了分组提供者/使用方，并以源代码对照基线 `1d940e032cab3c45d404a40f0ce8502db5b98059` 交叉核对。ToggleButton 更新的动作处理被单独检查，仍保留相同的分组成员关系路径。只读静态渲染探测使用了位于 `12991d841df03c6455ba669a026373d55c68bc45` 的纯文本实现，加上其移除范围的进行中改动。静态渲染证明所声称的 props/关联，**而非浏览器几何**。本审计不声称任何分组边界实现；实现遵循下面的已接受规则。台账记录证据，而不是把 FR7 的适用限制于未来布局或呈现提供者的允许列表。观察是历史性的；提议边界遵循 FR8 中的整体成员关系规则。

| 所有者 / 证据接缝                                                                                                                                                                                                                                                                                                                                                                            | 实际机制与观察                                                                                                                                                                                                                                                                                      | 提议边界 / 验证                                                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [ButtonGroup](../../../packages/core/src/ButtonGroup/ButtonGroup.tsx)、[Button](../../../packages/core/src/Button/Button.tsx)                                                                                                                                                                                                                                                                | React context 提供方向/禁用；共享 SizeContext 提供尺寸。Button 应用自己的兄弟敏感圆角/分隔线规则，并抑制独立的高度/按压处理。在内联 Dialog 与固定 Layer 下的静态渲染探测产生了一个内部按钮，其 `disabled` 与 `data-size="lg"` 来自外层分组。没有分组祖先标记或分组专属的继承 CSS 变量提供这些规则。 | 当 FR7 适用时，整个分组成员关系停止，连同视觉方向、尺寸、连体角/分隔线、高度处理与分组拥有的禁用状态。保留已分组的触发器与显式内部 ButtonGroup。                |
| [InputGroup](../../../packages/core/src/InputGroup/InputGroup.tsx)、[groupStyles](../../../packages/core/src/InputGroup/groupStyles.ts)、[TextInput](../../../packages/core/src/TextInput/TextInput.tsx)                                                                                                                                                                                     | Context 承载成员关系与标签/描述 ID；SizeContext 承载尺寸。使用方应用 100% 高度/flex、负边框重叠、兄弟圆角，并跳过其常规 Field 包装。两次探测都让内部 TextInput 得到 `lg`，以及由**外层与内层**标签组合而成的无障碍标签。该 context 没有禁用/状态布尔值：不要臆造一刀切的状态重置。                  | 当 FR7 适用时，外层尺寸、连体边框/布局呈现与分组拥有的标签/描述关联随整体成员关系停止。保留显式编写的标签、Field 语义、状态/禁用/只读 props 与局部 InputGroup。 |
| [AvatarGroup context](../../../packages/core/src/AvatarGroup/AvatarGroupContext.ts)、[Avatar](../../../packages/core/src/Avatar/Avatar.tsx)                                                                                                                                                                                                                                                  | Context 承载尺寸/形状/重叠；Avatar 添加环/负重叠并改变其工具提示的 tab 停靠点。两次探测都在层内产生 `lg`/`square`，且没有局部分组归属。                                                                                                                                                             | 当 FR7 适用时，整个分组成员关系停止，包括尺寸/形状/环/重叠与成员关系拥有的工具提示可聚焦性。保留显式 props 与无关交互；几何仍需浏览器证明。                     |
| [ToggleButtonGroup](../../../packages/core/src/ToggleButton/ToggleButtonGroup.tsx)、[ToggleButton](../../../packages/core/src/ToggleButton/ToggleButton.tsx)                                                                                                                                                                                                                                 | Context 承载选中值、切换回调、尺寸与禁用状态。两次探测都从祖先分组产生了按下态的 `lg` 内部切换按钮。当存在 `value` 时，源代码将激活路由到该分组的回调。                                                                                                                                             | 当 FR7 适用时，整个分组成员关系停止，包括尺寸、选中值、禁用状态与分组回调归属。保留显式编写的 props/回调与局部分组。                                            |
| [SizeContext](../../../packages/core/src/SizeContext/SizeContext.ts)                                                                                                                                                                                                                                                                                                                         | `sizeProp ?? inherited ?? default`；提供者包括 ButtonGroup/InputGroup 与 Toolbar/SideNav。该值没有来源信息，无法区分显式通用的 SizeProvider 与分组提供的默认值。                                                                                                                                    | 所有环境 SizeProvider 默认值停止，无论来源如何（DEC-2，OQ2 已解决）。显式控件 props 与在层内部建立的提供者继续在那里工作。                                      |
| [Collapsible group contexts](../../../packages/core/src/Collapsible/CollapsibleGroupContext.tsx)                                                                                                                                                                                                                                                                                             | 独立的状态与呈现上下文。Collapsible 已在其子元素周围清除呈现；状态则有意保持分离。                                                                                                                                                                                                                  | 保留该既有防护。在更改它之前验证任何绕过路径；不要把状态上下文仅当作分隔线样式。                                                                                |
| [ListContext](../../../packages/core/src/List/ListContext.tsx)、[MetadataListContext](../../../packages/core/src/MetadataList/MetadataListContext.tsx)                                                                                                                                                                                                                                       | 源代码使用方分别继承密度/分隔线/列表标记与元数据方向/标签布局；未发现通用层防护。这些路径不声称像素或交互复现。                                                                                                                                                                                     | 等价的呈现候选：在增加实现工作之前，确认受支持的独立层组合。层内的既有分组仍是所有者。                                                                          |
| [RadioList](../../../packages/core/src/RadioList/RadioList.tsx)、[CheckboxList](../../../packages/core/src/CheckboxList/CheckboxListContext.tsx)、[SegmentedControl](../../../packages/core/src/SegmentedControl/SegmentedControlContext.ts)、[TabList](../../../packages/core/src/TabList/TabListContext.ts)、[菜单单选组](../../../packages/core/src/DropdownMenu/DropdownMenuContext.tsx) | 这些上下文拥有集合值、回调、可用性、角色/名称，有时还有尺寸。若干子级 API 要求其提供者，缺失时会抛出异常。源代码可达性并不能证明每个跨层组合都受支持或属意外。                                                                                                                                      | 保留无关的或内容局部的归属，以及 FR7 不适用的归属。在 FR7 下，整个祖先表面/分组成员关系值停止；必需的使用方需要在层内部建立其完整提供者。                       |

ButtonGroup 的漫游焦点边界已排除嵌套分组/popover；Button/InputGroup 的尾缘选择器会跳过 `[popover]`/`template` 兄弟元素。它们保护的是**外层触发器**的成员关系，而非弹出层内部的后代控件。保持这些既有修复不变。基于新层内容标记的通用 [`useListFocus`](../../../packages/core/src/hooks/useListFocus.ts) 条目筛选或事件归属变更，超出此视觉重置范围，必须从实现中撤回。键盘归属（包括既有嵌套分组/popover 排除）保持原样。源代码搜索还检查了 FormLayout、Table/Stepper 与导航上下文/标记。它们的作用域布局/呈现职责归入 FR7，无论本审计是否列出；其语义/数据/交互/无障碍职责必须保持原样。SegmentedControl 还使用继承的私有 `--_segmented-control-radius`/`--_segmented-control-padding` 值处理条目圆角；Tab/TabMenu 从条带/容器几何消费 `--_tab-indicator-bottom`。AvatarGroupOverflow 的私有重叠值编写在其自身根上。这些是需检查的具体结构通道，而不是抹除所有自定义属性的理由。RadioList 指示器与 Tab 悬停/活动标记样式化局部交互反馈。作用域指示器/行标记不是分组上下文屏障；在没有匹配后代与浏览器状态复现的情况下，不声称任何标记泄漏。

### Existing normalization: consolidate only equivalents

**FR9 — 既有修复是证据，而非删除清单。** 仅当值、目标、级联优先级与受支持状态等价时，规范化才能移入共享边界。当该等价性缺失时，局部类型角色、换行、颜色、几何与归属防护必须仍归组件所有。

| 既有代码                                                                                                                                       | 发现与处置                                                                                                                                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [useLayer](../../../packages/core/src/Layer/useLayer.tsx) 基础排版                                                                             | 既有正文字体族/字号/行距是唯一由纯文本实现在私有共享重置中移动的等价基线。这三条声明的令牌/值或优先级均无意改变。                                                                                                                         |
| [Tooltip](../../../packages/core/src/Tooltip/useTooltip.tsx) 绘制的表面                                                                        | 显式正文类型、反转颜色与内容 `wordBreak: break-word` 是有意的。保留它们；即使值相同，把内部声明外移也可能改变受支持的覆盖。                                                                                                               |
| [Toast](../../../packages/core/src/Toast/Toast.tsx)                                                                                            | 尺寸/行距使用正文**默认值**，表面反转，内容使用 `overflowWrap: anywhere`。这不等价于用继承的实时正文变量替换它们。保留它们。                                                                                                              |
| [Lightbox](../../../packages/core/src/Lightbox/Lightbox.tsx)、菜单行、键盘提示、图表/径向工具提示                                              | Lightbox 的字幕通过 MediaTheme（`component:Lightbox`）下的 Text 渲染。菜单标签/辅助类型与起始对齐、更小的 nowrap 键盘提示，以及紧凑的图表换行，仍是刻意的局部呈现。不要把它们当作冗余重置删除。                                           |
| [useLayer portal 书写上下文](../../../packages/core/src/Layer/useLayer.tsx)、[内边距重置](../../../packages/core/src/Layout/padding.stylex.ts) | 更正性 portal 保留丢失的方向/书写模式，而不快照令牌。既有内边距边界重置自己的结构变量。两者都保留；二者都不是通用的分组或文本屏障。                                                                                                       |
| Button/InputGroup 端帽规则与 Collapsible/BottomSheetSwitcher 上下文防护                                                                        | 已解决不同的成员关系/归属问题。保留它们；文本边界并不替代兄弟分类、嵌套呈现隔离或 sheet 注册作用域。                                                                                                                                      |
| 在 Item/TreeListItem/Collapsible/Stepper/Token/Thumbnail/ChatComposer 控件上的 `all: unset`                                                    | 局部的 UA/控件重置，而非层根继承修复。不提议新的 `all`/`unset`/`revert` 层重置。ToastViewport 的 `inset: unset` 是几何；menuWidth 的 `unset`/`revert` 字符串是调用方提供的宽度关键字，路由到 inline-size 而非 `min()`，不是通用继承重置。 |

审计未在 Layer 或独立原生根中发现既有的通用 ButtonGroup/InputGroup 上下文屏障。React portal 保留上下文，原生顶层绘制不会中断选择器祖先。因此上面那些分组控件泄漏在提议的纯文本重置之后仍然存在。

### Implementation requirements

- **IR1 — 有界样式，而非沙箱。** 使用受支持的组件局部 CSS 声明。不要使用 `all`、`font` 简写、通用/后代重置、全局 `[popover]`/`dialog` 选择器，或复制祖先的计算样式。
- **IR2 — 最小边界接线。** 在包边界允许处内部共享该基线；在独立根上确保等价声明，而不为共享样式专门创建公共 API。不要无必要地改变运行时效果、包装器、portal、交互逻辑或已组合的调用点。
- **IR3 — 范围与权威分离。** 架构与简洁的使用方文档投影此已接受决策；它们不重复一份独立政策。接受并不声称已交付行为，也不授权合并。不得用验证来扩大实现范围。
- **IR4 — 包容的职责，有界的实现。** 提供者隔离必须是私有的、感知归属的，并在 FR4 内容根之间保持一致。按职责应用 FR7，包括未来的作用域布局/视觉提供者，而不是照抄本审计的固定重置允许列表。不要清除无关上下文或自定义属性。当 FR7 适用时，整体表面/分组成员关系在 FR8 下停止，而不分离视觉字段。不隐含 DOM 包装器、公共边界 API、语义角色、ARIA 中和、portal 或通用 CSS 重置；验证必须覆盖视觉隔离与未改变的无关行为/无障碍。

### Platform support

- 支持的功能/引擎下限：既有 [浏览器支持政策](../../../packages/cli/assets/docs/browser-support.doc.mjs) 适用；本规格不提高引擎下限。原生宿主仍遵循其自身支持约定。
- 不支持的行为：既有显示回退必须保留相同的文本基线。本次变更不会将其升级为原生顶层、定位或关闭的等价实现。
- 浏览器证据：实际的 CSS 继承、主题级联、换行与像素需要真实 Chromium；DOM 单元环境中发出的声明不足以为视觉证明。不根据 Chromium 输出作出 Safari 专属声明。

## Current-state impact

实现之后，`architecture:layer-runtime` 将投影该基线的归属并链接本规格。Layer、useLayer 与 Dialog 的使用方指南将解释根/内容上的刻意格式，changeset 将描述兼容性影响。不发生任何 family 成员关系、贡献者政策、theme-application 语义或 AST-003 声明的改变。

## Verification

| 约定         | 验证                                                         | 代表性状态                                                                                            | 突变或失败预期                                                                               |
| ------------ | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1, FR4     | 面向所有受支持层内容根的既有真实浏览器视觉回归与计算样式证据 | 两种 Layer 渲染器、Dialog 原生/内联、独立原生根、sheet 独立/切换、Toast 提升/宿主、Drawer 模态/非模态 | 移除某边界的基线会在浏览器对比中恢复继承格式。                                               |
| FR2, FR5     | 单元覆盖控件加上真实浏览器级联证据                           | 嵌套/浅色/深色主题、LTR/RTL 与垂直书写、实时正文令牌；显式编写的子级强调/代码与直接根覆盖             | 宽泛重置、后代规则、冻结令牌或反转优先级将无法通过保留上下文/样式对照。                      |
| FR1, FR6     | 随实现 PR 保留的真实浏览器前后像素                           | 正常主题正文 DOM 与一个刻意敌意的居中/斜体/大写/缩进/加空格/带阴影/预格式化祖先；父级与子菜单         | 恢复继承对齐会产生明显居中的敌意文本；正常基线保持不变。把突变标注为回归对照，而非历史来源。 |
| FR3, FR4     | 既有组件行为测试与浏览器检查                                 | 定位、焦点/关闭、字幕与反转颜色、点击穿透视口/非模态宿主                                              | 移除或重排组件样式将无法通过既有对照；不推断更广的交互约定。                                 |
| FR6, IR1–IR3 | Diff 审查、既有 lint/类型/构建/知识检查                      | 导出映射与 barrel、重置声明、架构投影、changeset                                                      | 新的公共重置 API、宽泛选择器、工作流变更，或无所有者批准的批准声明，均无法通过审查。         |

呈现使用现有的视觉回归测试，FR7/FR8 的行为使用已建立的组件测试来验证。检查在严苛的外部 group 与 SizeProvider 默认值之下的视觉尺寸、密度、相连的圆角/分隔符、重叠以及布局。覆盖原生/内联 Dialog、现有的内联/经校正 portal 的上下文 Layer 路径、固定的 Layer，以及独立的根，而不新增宿主路径。保持外部 trigger 在视觉上仍成组，并让显式的内部视觉/布局 provider 继续生效。按职责而非仅按今天的名称来验证面向未来的作用域化呈现 provider；嵌套层会再次中止环境呈现。

行为与无障碍检查保留不相关的行为与显式 props，但归成员关系所有、在 FR8 下停止生效的值除外。将 ARIA、标签/描述、焦点/制表位、键盘归属、disabled/read-only 与 selected/pressed 状态、回调标识与结果、关闭，以及 DOM/AX 语义与现有行为进行对比。保持不相关的语义/数据/交互上下文存活且不变。保留 LayoutArea 的语义 DOM 元素以及 `useListFocus` 既有的条目/事件归属。保留菜单单选的选择/关闭、Selector/Typeahead 的活动选项/搜索/选择，以及 Table 筛选的草稿/应用行为。验证归成员关系所有的状态随其上下文一起停止，而显式编写的 disabled 或 selected props 仍然生效；不需要新增无障碍树边界。

真实浏览器检查确立呈现与保留的行为；静态渲染无法证明像素。移除视觉隔离屏障必须恢复相应的视觉泄漏。更改不相关的语义字段、ARIA、键盘路由、宿主或回调必须使保留性对照失败。FR9 保持本地文本/换行以及既有的 group 尾部/键盘防护不变。

浏览器截图及其出处属于 PR 证据；这一样式决策不要求专门的无障碍规格、提交的 story 矩阵，或新的工作流/产物接线。测试成功是证据，而非所有者批准。

## Decision log

### DEC-1 — Accepted neutral reading boundary

**Reference:** `spec:AST-038/DEC-1`

**Decider:** `cixzhang`, `2026-09-23`

在 FR4 边界上批准了封闭的 FR1 基线，同时保留 FR2/FR3、采用 FR5 的优先顺序，以及 FR6 的兼容性/不新增 API 契约。这使同一阅读任务不再受触发器的偶然格式影响，同时不抹除其主题或有意的内容样式。

已否决：仅处理 Dialog（其他层仍会继承）；重置所有 CSS（会破坏不相关的样式/上下文）；重置文档范围的 dialog/popover 选择器（会改变非 Astryx UI）；保留所有环境排版（会保留所报告的问题）；提供一个退出式 prop 或公开的重置工具（在现有样式接缝已足够之处，为调用方增加永久选择）。

### DEC-2 — Accepted inclusive layout-provider boundary

**Reference:** `spec:AST-038/DEC-2`

**Decider:** `cixzhang`, `2026-09-23`

批准 FR7：所有 surface 级别的布局、视觉、密度、尺寸、分组与呈现 provider 默认在层内容边界处停止，包括通用的 SizeProvider 以及具有这些职责的未来 provider。这不是一份固定的允许清单。trigger 留在其周围的 group 中；独立的层内容不会隐式加入其视觉样式。DEC-4 阐明语义成员关系与行为保持不变。主题与书写上下文得以保留。OQ2 已解决：group 来源的尺寸与一般环境尺寸之间没有区分，二者均不允许跨边界泄漏。

已否决：仅使用文本 CSS（不能停止上下文成员关系）；仅使用 portal（保留 React context 并改变宿主）；把隔离限制为今天已命名的分组（未来的呈现 provider 会泄漏）；重置每个后代的边框/圆角（会破坏有效的、归内容所有的分组）。

### DEC-3 — Accepted explicit surface/content protocol

**Reference:** `spec:AST-038/DEC-3`

**Decider:** `cixzhang`, `2026-09-23`

**历史记录，已被 DEC-4 收窄：** 最初的 FR8 措辞要求语义/数据/交互 provider 采用显式的所有者协议，并另行提供布局/视觉内容上下文。它还将该规则应用于混合 provider。该措辞混淆了呈现与语义成员关系。DEC-4 移除了语义状态重置要求；它保留既有的语义继承，并将显式内容提供收窄为视觉/布局归属。FR9 对非等价本地样式的保留仍然适用。

### DEC-4 — Visual reset only; behavior and accessibility unchanged

**Reference:** `spec:AST-038/DEC-4`

**Decider:** `cixzhang`, `2026-09-23`

**Status:** 由 `cixzhang` 于 2026-09-23 批准，授权仅合并本次规格更正。该批准涵盖 DEC-1–DEC-4；下文的历史混合 provider 规则由已批准的 DEC-5 修订。

更正了范围：**仅视觉重置**。精确保留 ARIA、焦点、选择、disabled/read-only 状态、回调、键盘归属、关闭、语义/数据/交互上下文以及 DOM/AX 语义。视觉边界仅隔离文本、尺寸、密度、视觉分组、边框/圆角/分隔符以及作用域化布局属性。其将视觉归属与混合 provider 分离的要求已被批准的 DEC-5 取代。

这取代了 DEC-2/DEC-3 的任何语义重置解释，以及早先的 FR7/FR8 证据台账。`aria-disabled` 中和、新的 AX-disabled 隔离断言、语义 group 角色以及校正性 portal 宿主均被排除。验证证明视觉隔离加上行为/无障碍不变；它不得发明新的 a11y 契约。FR1 的主题正文字度量保持不变；这不是对已否决的中性文档度量提案的复活。

已否决：整份清除混合上下文并在 popup 调用点重建选定的语义；为演示隔离而更改 disabled/selected 状态；添加角色/ARIA/portal 以把样式边界变成无障碍边界；因为某个 surface 在视觉上独立就更改焦点或键盘归属。

### DEC-5 — Remove the visual-context separation requirement

**Reference:** `spec:AST-038/DEC-5`

**Decider:** `cixzhang`, `2026-09-24`

**Status:** 由 `cixzhang` 于 2026-09-26 批准。

当 FR7 适用于由单个 context 承载的 surface/group 成员关系时，该既有的整体值停止生效；视觉字段不会被分离。归成员关系所有的状态，包括 disabled/read-only 状态，随之停止。不相关的上下文与显式编写的 props 保持不变。这取代 DEC-1–DEC-4 中相冲突的分离与成员关系保留条款；其他所有范围以及 FR1 基线保持不变。

## Open questions

无。OQ1–OQ3 仍属历史决策。已批准的 DEC-5 修订了分离视觉上下文的要求；规格批准与验证均不授权实现合并。
