---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-089
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: proposed
owners: [cixzhang, imdreamrunner]
affects_architecture: [architecture:public-component-api]
affects_families: [family:layout-primitives, family:input-fields]
affects_contributing: [contributing:api-conventions]
affects_consumer_docs: [principles]
---

# Ref-first DOM styling target

## Intent

使用方在组件的公共 DOM ref 所及的那个元素上使用 `style`、`className` 和 `xstyle`。当组件没有暴露无前缀 ref 时，这些 props 作用于其唯一最外层 DOM 元素的样式。

命名部件样式与显式记录的兼容性豁免保留各自的目标。定义默认样式目标的是 ref 标识，而不是调用方是否提供了 ref 值。

## Non-goals

- 要求每个组件都接受通用样式 props 或暴露 DOM ref。
- 为改变样式行为而新增、移动或在公共 ref 目标之间做选择。
- 改变样式优先级、语义 props、事件、无障碍或 ref 行为。
- 取代命名部件样式，或取代 input family 对根样式的禁止。
- 规定强制执行算法、注册表或 CI 拓扑。

## Requirements

- **FR1 — 公共 DOM ref 优先。** 一个稳定的 Core Web 组件，若接受 `style`、`className` 或 `xstyle` 中的任意一项并暴露无前缀的 DOM `ref`，则必须在每一条受支持的渲染路径上，把每个已接受的通用样式 prop 应用到该 ref 的公共契约所承诺的元素上，下文明示的兼容性豁免除外。该目标可以是一个内部控件，也可以是一块唯一的独立表面；DOM 祖先关系不会覆盖一个有效的公共 ref 目标。
- **FR2 — 由 API 选择目标，而非调用点。** 无论调用方传入 `ref`、省略它、使用回调 ref 或对象 ref，还是传入 `null`，FR1 都适用。瞬时的 `ref.current === null`、已关闭的表面或未挂载的目标，都不得导致样式转移到另一个元素。当承诺的目标不存在时，在它渲染之前没有元素可供设置样式。内部 ref 以及 `contentRef`、`triggerRef`、`controlRef` 这类命名 ref 不参与选择默认目标；它们保留各自单独命名的部件契约。
- **FR3 — 未暴露 ref 时回退到最外层。** 只有公共 API 未暴露任何无前缀 ref 的组件，才使用组件自有的唯一最外层 DOM 元素。该元素没有组件自有的 DOM 祖先，并且只要任一自有的 DOM 渲染出来，组件各棵树中就必须恰好存在一个自有根。唯一的 portal 根属于合格情形；隐藏的测量同侪、组合式包装器以及独立公共表面都计入自有 DOM。使用方提供的子节点与外部 portal 宿主本身不计为自有根。当没有自有 DOM 渲染时，通用样式不产生效果，也不会转移到另一个元素。空路径并不为本来没有头部的组件建立目标保证。该回退不依赖运行时的 ref 是否存在或其值。
- **FR4 — 不可用的 ref 不等于缺失的 ref。** 一个无前缀的 `ref`，若解析为命令式句柄而非直接解析为 DOM 元素、若其公共 ref 契约含糊、或者是一个未转发的已暴露 ref，则都不提供默认可设置样式的元素。命令式句柄中某个取值为 DOM 的成员，并不会使该句柄成为 DOM ref。此类组件在拥有有效的目标契约之前，不得引入通用样式 props。它可以改为暴露显式命名的部件样式。它不得仅仅因为无法满足 FR1 就静默使用最外层回退。现有行为需要有明确范围的豁免；普通的 ref 转发缺陷仍由其当前所有者认定为缺陷。
- **FR5 — 组合保持公共标识。** 组合式或多态组件必须保证每个已接受的通用样式输入都到达其承诺的公共 DOM ref 元素，或在未暴露 ref 时到达其唯一最外层根。仅把这些 props 转发给不受限制的使用方组件，并不能证明这一保证。新增、移除、改变类型或改变指向某个已暴露 ref 时，不得静默改变样式目标。
- **FR6 — 命名部件与 family 排除保持原样。** 部件样式使用 `spec:AST-071` 下完整的 `<part>Xstyle`、`<part>ClassName` 和 `<part>Style` 集合。`family:input-fields` FR10 与 DEC-7 继续禁止在由 Field 组合的组件上使用根样式，并定义其 `container*` 与 `control*` 目标。拥有原生 input ref 并不能恢复被禁止的根样式，拥有命名的 `controlRef` 也不会重新路由通用样式或命名样式。受 `family:input-fields` FR10 约束的组件不在本默认范围之内，包括在 FR10 落地之前它们仍然接受的任何根样式。语义 props 保留其各自所属契约的目标。
- **FR7 — 豁免保留有界契约。** 每项豁免都要指明组件、受影响的渲染路径、保留的样式目标、实际的 ref 契约或缺失的保证、原因以及所属契约。它只豁免所述与本默认的偏离；它不批准对另一当前所有者的既有违反。明确列出的拆分或缺失的通用样式目标属于遗留的强制执行豁免，而不是有效的替代契约：它们当前的保留与组合义务仍未闭合。与所列目标范围无关的 ref 失败、被丢弃的中性 props、命名部件缺陷以及样式组合缺陷不在豁免之内。新组件与新的偏离路径不得以类比方式继承豁免。移除或扩大豁免需要所有者明确决策；不存在自动过期或强制迁移。
- **FR8 — 兼容性与权威保持明确。** 当 ref API 变更会改变默认目标时，它同时也是一次样式兼容性审查。移动已发布的样式目标或 ref 目标、合并拆分的目标，或移除已接受的 prop，须遵循 `spec:AST-017`，并具备所需的兼容性决策、迁移证据、使用方文档与发布分类。把本记录转为 current 时，也要一并更新相互冲突的 current API、family 与组件声明。任何豁免都不会免除另一当前所有者已经要求的迁移。

### Platform support

- 范围：稳定的 Core Web 组件以及实现它们的组合式渲染路径。Hooks 不单独受治理；用某个 hook 实现的组件仍遵循组件契约。
- 非 DOM 渲染器、没有 DOM 样式表面的 provider，以及 Lab 组件不在本规则范围内。不接受任何通用样式 props 的组件不欠任何默认样式目标。
- 浏览器特性支持保持不变。元素与 ref 标识测试证明目标定位；对未来迁移中可观察的布局、外观或交互声明，需要真实浏览器证据，而仅凭本记录的文本不需要。

## Current-state impact

规范的共享 API 所有者是 `architecture:public-component-api`，其 INV5 与 INV6 将样式保留在文档化的契约元素与组合上，其 INV8 保留文档化的 ref 目标。它们并不要求样式目标与 ref 目标是同一个元素。`architecture:public-component-api` INV15 与 `spec:AST-071` FR1 把部件集合描述为针对根以外元素的样式，而 INV6 与 `family:input-fields` FR10 把无前缀集合称作根样式输入；FR1 的内部控件目标在晋升时修订这些声明。在本记录仍为草稿期间，这些当前声明仍具权威性。

ref 优先的默认值仅适用于受支持的通用样式输入且没有明示豁免的情形。既有的组件特定表面目标、命名部件与 family 排除保持文档化，而不会被静默重新分类。

input family 的 [部件目标契约](../../families/input-fields.md#cross-component-invariants) 拥有 `container*` 与 `control*` 的语义。此处的豁免不免除 `family:input-fields` FR10 与 DEC-7 之下任何遗留的实现债务。

### Compatibility exemptions

这些豁免仅适用于所列的既有 API 与渲染路径。它们保留下文所述的样式目标与 ref 目标；提供、省略、分离或清除 ref 都不会选择另一个目标。所有已接受的通用样式输入继续在保留的元素上组合，除非另有单独列出的遗留缺口仍然存在。当样式集合已经到达一个有效的公共 DOM ref 元素时，仅拓扑差异无需豁免。

#### Target-preservation exemptions

| ID  | 组件与路径                                                                                                                                                                                                                                                                                                                                  | 保留的样式目标 / 公共 ref 目标                                                                                                                                                                 | 原因 / 所属契约                                                                                                                                                                                                                                                          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| E1  | CheckboxInput 与 Switch，所有受支持的渲染模式                                                                                                                                                                                                                                                                                               | 外层整字段 `div` / 原生 checkbox 或 switch `input`                                                                                                                                             | 保留整字段样式与正确暴露的语义控件 ref。二者都不组合 Field，也不属于 FR10 排除的根样式集合；共享 API 及各自控件所有者。                                                                                                                                                  |
| E2  | CommandPaletteInput                                                                                                                                                                                                                                                                                                                         | 查询包装 `div` / 查询 `input`                                                                                                                                                                  | 当前 `component:CommandPaletteInput` FR3 印证了分离的视觉包装与原生控件接缝。                                                                                                                                                                                            |
| E3  | 水平 Stepper，展开或紧凑                                                                                                                                                                                                                                                                                                                    | 水平框架 `div` / 有序列表 `ol`                                                                                                                                                                 | 保留框架样式与列表测量/ref 标识；`component:Stepper`。垂直的列表目标样式无需目标豁免。                                                                                                                                                                                   |
| E4  | Timestamp 与 Timer，受支持的渲染时间状态                                                                                                                                                                                                                                                                                                    | 外层 Text `span` / 内部 `time`                                                                                                                                                                 | 保留既有的时间包装器，而不是把通用样式移到 `time` 上。`component:Timer` FR5/ORD2 与时间组件、共享 API 所有者描述了该接缝；Timer 更宽泛的当前计时系统措辞仍是 OQ3 中未解决的权威张力。                                                                                    |
| E5  | ContextMenu 与 MoreMenu 的指针/sheet 路径                                                                                                                                                                                                                                                                                                   | 内部菜单/内容 `div` / 触发器包装器或触发器按钮                                                                                                                                                 | 既有通用样式描述的是菜单，而不是其触发器。共享 API 与菜单所有者保留该目标；既有的 sheet ref 转发债务不予免除。                                                                                                                                                           |
| E6  | DropdownMenu 指针/sheet；Popover 的 automatic/custom/external-anchor 与 sheet；HoverCard 的 text/element/fragment-trigger 路径                                                                                                                                                                                                              | DropdownMenu 内部菜单 `div`、Popover 内部绘制 `div`（在 sheet 呈现下即 sheet 的面板，`component:Popover` DEC-8），或 HoverCard 浮动 `div` / 没有无前缀组件 ref                                 | 在触发器、持久模板、宿主与表面各棵树之间不存在唯一的最外层回退。命名的 ref 与 payload ref 不是组件 `ref`。`component:Popover` 拥有绘制表面的样式；各菜单、HoverCard 与共享 API 所有者保留其他目标。                                                                      |
| E7  | PowerSearch 在嵌套 Tokenizer Field 盒子渲染时；PowerSearch 的 sheet 呈现                                                                                                                                                                                                                                                                    | 通过 Tokenizer 的 `container*` 输入作用于嵌套 Field 盒子 / 外层 PowerSearch 包装器；sheet 呈现：样式集合作用于 field 容器，`ref` 作用于根（`component:PowerSearch` DEC-3）                     | 保留更高层组合当前的样式投影。在 Field 盒子缺失处，部件不产生效果并给出警告，绝不重新路由。`component:PowerSearch`、`component:Tokenizer` 与 input family 部件契约；不向 Tokenizer 添加根样式。`family:input-fields` FR10 约束 PowerSearch。                             |
| E8  | InputClearButton 的通用 tooltip 路径                                                                                                                                                                                                                                                                                                        | 原生清除 `button`；仅接受 `xstyle` / 没有公共组件 ref                                                                                                                                          | Tooltip 同侪阻止了唯一最外层回退。共享 API 所有者；缺失的 class/style 对应项与不完整的图标部件输入仍属 AST-071 义务。                                                                                                                                                    |
| E9  | 既有不受限的自定义根 API：Stack、HStack、VStack、StackItem、Item；Avatar、Button、IconButton、Link、Tab、Token、DropdownMenuItem/ContextMenuItem/BreadcrumbMenuItem、NavHeadingMenuItem、TopNavHeading、TopNavItem、TopNavMegaMenuItem、SideNavHeading 与 SideNavItem 的自定义 link/router 分支；自定义 Icon 根交接与 Table 包装器/转换交接 | 既有的降级 class/inline-style 与 ref 交接给调用方组件，而不是新选择的 DOM 节点；对 Table 而言，样式与公共 ref 仍留在接收到的语义 table 上，包装器/上下文输出可能保留、包裹、复制、分离或移除它 | 仅豁免新的组合样式与 ref 标识证明要求。保留已发布的交接，但不声称任意调用方输出都具备 DOM ref 或会转发样式。对象句柄不会触发最外层回退。原生/内建分支仍欠各自的标识契约；新 API 与新的偏离路径不在覆盖范围内。`family:layout-primitives`、共享 API 以及各根/转换所有者。 |
| E10 | BottomSheetSwitcher，每个步骤                                                                                                                                                                                                                                                                                                               | 每个步骤的 sheet 对话框都携带已接受的 `className`、`style` 和 `xstyle`；公共 ref 解析到宿主对话框（活动 sheet 的对话框，否则是正在退出的或静止的那个）                                         | 每个步骤都是各自的 sheet 对话框，因此该切换器的对话框表面适用于所有步骤；只给 ref 对话框设置样式会让其他步骤没有样式。`component:BottomSheetSwitcher` 拥有哪个对话框承载该 ref。                                                                                         |

#### Legacy default-enforcement exemptions

这些是新的统一目标检查的显式排除项，而不是有效的替代契约。既有当前所有者的义务仍未闭合。下表中失败的 ref 绑定并不授权运行时最外层回退。

| ID  | 组件与路径                                                 | ref 优先目标保证中的既有缺口                                                                                                                                         | 保留的义务                                                                                                                            |
| --- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| L1  | ChatComposer 已渲染的 frame/body 路径                      | `style` 与 `className` 到达 frame/公共 ref 元素；`xstyle` 到达 body                                                                                                  | 共享 API INV5/INV6；不从草稿推断任何已批准的拆分目标。                                                                                |
| L2  | SideNavItem 已渲染的路径                                   | `xstyle` 到达外层列；`className` 与 `style` 到达内部主控件/ref 绑定                                                                                                  | 共享 API INV5/INV6/INV8；拆分与含糊的根 ref 承诺仍未闭合。                                                                            |
| L3  | TopNav 带内容的 drawer 路径                                | 所有已接受的通用样式输入与公共 ref 都被丢弃                                                                                                                          | 共享 API INV5/INV6/INV8；真正空的输出本身不构成豁免。                                                                                 |
| L4  | SideNav 带内容的 drawer-content 路径                       | 所有已接受的通用样式输入与公共 ref 都被丢弃                                                                                                                          | 共享 API INV5/INV6/INV8；条件性的页脚根并不能修复这一丢失。                                                                           |
| L5  | TypeaheadItem 调用方 `item.element` 非空的路径             | 已接受的通用样式与公共 ref 未应用到返回的调用方节点                                                                                                                  | 共享 API INV5/INV6/INV8；任意调用方输出不是保证的转发者。                                                                             |
| L6  | SegmentedControlItem                                       | 已接受的 `className` 被覆盖；动态 StyleX 输出可能覆盖整个已接受的行内 `style`                                                                                        | 共享 API INV5/INV6；这是样式丢失，而不是可允许的拆分或优先级决策。                                                                    |
| L7  | VisuallyHidden 已接受的继承 `xstyle`，固有路径与自定义路径 | `xstyle` 被忽略（`component:VisuallyHidden` FR3），而不是应用到其 ref 元素；`className` 与 `style` 不被接受                                                          | 共享 API/AST-071 义务与无样式意图需要协调；豁免并不创建样式支持。                                                                     |
| L8  | Icon 的注册表渲染路径；CheckIndicator 的已选中字形路径     | Icon：其公共 ref 到达 svg（`component:Icon` FR8），而带样式的包装器是未承诺的实现细节（AV2）；CheckIndicator：样式到达渲染出的 span，但已接受的公共 ref 未转发到那里 | 仅排除于新的样式与 ref 标识证明。Icon 不承诺任何 span；CheckIndicator 未转发的 ref 不是对 INV8 的免除。替代与自定义路径另行界定范围。 |
| L9  | Dialog、AlertDialog 与 CommandPalette 的内联打开路径       | 通用样式到达内联 `div`；已接受的 dialog ref 未绑定                                                                                                                   | 仅排除于新的样式与 ref 标识证明。既有的 INV8/声明元素债务仍然存在；内联关闭时的 null 不会选择另一个目标。                             |
| L10 | SideNav 带目标的 topbar 与 drawer 路径                     | 既有通用样式到达 topbar `div` 或 drawer 对话框，但已接受的公共 ref 未绑定                                                                                            | 仅排除于新的样式与 ref 标识证明。既有 INV8 义务仍然存在；不授权最外层回退或改变 ref 目标。                                            |

InputGroup 的通用样式与实际公共 ref 都到达其内部 group `div`，但其当前的 Field 组合范围在 FR10 下尚未解决。符合本默认并不允许其他当前所有者所禁止的样式；OQ2 需要该所有者的决策。在本来已共同指向的原生分支上，声明 ref 类型不匹配同样仍是独立的义务，而不是移动样式的理由。

Hook 渲染器的样式通道不在本组件默认规则之内。它们各自的当前契约继续治理，包括任何已接受的渲染器 prop 缺口。Tooltip、Toast、ToastViewport、Theme、MediaTheme、SyntaxTheme 与各 provider 上不存在通用样式，既不是祖父式豁免，也不承诺它们没有自有 DOM。

### Owner projections

共享目标与豁免边界应位于 `architecture:public-component-api` 与 `contributing:api-conventions`。`family:layout-primitives` 拥有其多态成员的契约；`family:input-fields` 拥有其根样式排除与部件目标。每个被豁免组件所属的契约与使用方文档，应在适用路径上区分样式目标与公共 ref 目标。本草稿不会重写当前记录。

## Verification

| 契约    | 验证                                                                    | 代表性状态                                                                                                            | 变异或失败预期                                                                |
| ------- | ----------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| FR1–FR2 | 针对公共 DOM ref 元素断言不同的 inline-style、class-name 与 StyleX 标记 | 内部控件、独立目标、回调/对象/省略/`null` ref；已关闭与已打开的表面                                                   | 传入或省略 ref 会改变样式目标；`null` ref 会重新路由样式。                    |
| FR3–FR4 | 公共 prop/类型检查与自有根标识测试                                      | 未暴露 ref 且只有一个根；未暴露 ref 且有同侪根；完全空的渲染，然后挂载；包含 DOM 值成员的命令式句柄；含糊或丢失的 ref | 不可用的 ref 触发最外层回退，或者原本没有有效目标的组件获得了通用样式 props。 |
| FR5     | 元素与 ref 标识测试夹具以及兼容性审查                                   | 固有 `as`、保证的组合目标、不受限的 `as`、新增/移除/改变指向的 ref                                                    | 仅转发就作为标识证明通过，或者 ref API 编辑静默移动了样式。                   |
| FR6     | 所属契约、公共类型、语义透传测试与命名部件标记                          | 独立、分组与水平标签字段；公共命名部件 ref                                                                            | 由 Field 组合的组件获得被禁止的根样式，或者命名 ref 重新指向通用/部件样式。   |
| FR7     | 显式组件/路径/样式目标/ref 目标的豁免覆盖与反例                         | 每个保留目标与相关模式；新的同级组件与新的渲染路径                                                                    | 一刀切豁免掩盖了 ref 失败，或覆盖了未列出的偏离。                             |
| FR8     | 当前记录一致性、使用方迁移证据、兼容性审查与发布元数据                  | 豁免保留；ref API 编辑；目标移动；prop 移除                                                                           | 目标静默改变，或草稿被当作权威。                                              |

## Decision log

### DEC-1 — General styling follows the public DOM ref

**Reference:** `spec:AST-089/DEC-1`

**Proposed decider:** `imdreamrunner`

使用方可以检查、测量、聚焦并设置同一个可公开寻址的 DOM 元素的样式。即使调用方未传入任何 ref 值，无前缀的 ref 契约也会选择该元素。只有没有无前缀 ref 的 API 才使用唯一最外层根；显式豁免保留既有目标。

已否决：在运行时从 `ref.current` 选择目标，因为挂载或提供 ref 会移动样式。

已否决：采用不依赖 ref 标识、对整块自有根设置样式的最外层默认，因为那样一来使用方的 ref 与样式会指向不同元素。

### DEC-2 — Existing divergences are explicit compatibility exemptions

**Reference:** `spec:AST-089/DEC-2`

**Proposed decider:** `imdreamrunner`

本默认不强制破坏性的目标移动、新的 ref API 或 prop 移除。豁免仅保留所列的既有目标与路径。命名的 family 排除项及其单独批准的迁移保留各自的权威。

已否决：把每一处既有偏离都当作立即迁移的前置条件，因为该默认会强制无关的使用方改动。

## Open questions

- **OQ2 — 由 Field 组合的根样式禁止是否包含 InputGroup？**（`human-api`）InputGroup 的样式与 ref 共同指向其内部 group，但其 Field 组合与协作者分类使当前的 FR10 范围不一致。family 与直接 API 所有者协调该范围；符合本默认并不免除 FR10。
- **OQ3 — 哪条当前计时声明拥有保留的包装器/ref 拆分？**（`human-api`）`component:Timer` FR5/ORD2 保留 Text 包装器样式与 `time` ref，而 `spec:AST-037` 有更宽泛的根措辞。共享 API 与计时所有者协调这些当前声明；E4 不凭空创立优先级。
