---
schema_version: 3
template_version: 3
kind: component
id: component:Popover
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Popover/Popover.test.tsx,
    packages/core/src/Popover/Popover.doc.mjs,
    packages/core/src/Popover/usePopover.doc.mjs,
    packages/core/src/hooks/useFocusTrap.test.tsx,
    packages/core/src/Popover/PopoverPresentation.test.tsx,
    packages/core/src/Popover/__tests__/PopoverTouchMotion.interaction.browser.spec.ts,
    packages/cli/foundation/discovery/theming-targets.mjs,
    packages/cli/foundation/discovery/theming-targets.test.mjs,
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
system_specs: []
---

# Popover component contract

## Intent

Popover 在锚定的顶层表面中呈现交互式的、由调用方提供的内容。该组件负责标准的从触发器到表面的组合；`usePopover` 为自定义组合暴露相同的语义生命周期、焦点包含、关闭与渲染契约。

本契约记录在 [PR #5373](https://github.com/meta/astryx/pull/5373) 之后存在的行为、Cindy Zhang 于 2026-08-31 确定的 Popover 目标方向、Cindy Zhang 于 2026-09-07 批准的焦点/打开修正，以及 Cindy Zhang 于 2026-10-03 决定的将视口适配移入层运行时的变更（`spec:AST-059`）。公共 API 签名与发布状态保持不变。使用方语法与完整签名仍由 `Popover.doc.mjs` 和 `usePopover.doc.mjs` 拥有。规范的 `popover` 目标是唯一的宽泛 Popover 表面目标。

下面的 DEC-4（待所有者评审）新增一个公共概念：表面内边距档位，使内容自行掌控边缘的调用方可以要求一个齐平表面。

## Compatibility and migration

- 保持的发布默认值：`yes`
- `presentation`（DEC-6）默认为 `popover`，即已发布的锚定表面；`presentation="popover"` 也是在本应应用触摸默认值的任何位置保持该默认值的取值（`architecture:public-component-api` INV16、`spec:AST-017` FR3、DEC-23）。
- 规范目标：`popover` 为 `<Popover>` 与公共 `usePopover` 组合拥有宽泛的绘制表面契约
- 已移除的别名：0.7.0 移除了 `popover-surface`；主题与 CSS 选择器通过 `astryx upgrade --from 0.6.3 --apply --path .` 将其迁移为 `popover`
- 组合组件：诸如 `selector-popup` 与 `multi-selector-popup` 的组件专属表面目标，作为宽泛规范目标旁的权威细化继续存在
- 新的 hook 使用方：需要自身主题可达性的直接 `usePopover` 组合，会提供并记录一个自有的 `surfaceTarget`

## Current-state impact

- 输入保持（input hold）在打开后的第一帧开始；在该帧内落下的触摸会到达页面。
- Popover 没有视口矩形锚点：它锚定到其触发器，或通过 `anchorRef` 锚定到一个按钮。当控件的面板移入 More 菜单时，通过一个 `usePopover` 组合锚定到 More 触发器，其 `triggerRef` 接收该触发器，因此触发器保留其菜单按钮属性（`component:MoreMenu` AR1）。一旦无头上下文菜单的 `open(at)`（`spec:AST-107` FR8）发布，将重新审视这一点。

## Ownership boundary

**拥有**

- 标准触发器或引用锚点的组合、绘制后的 Popover 表面、该表面的规范宽泛 `popover` 主题目标，以及在其中渲染调用方提供内容的插槽。
- 公共 `usePopover` 语义契约：可见性操作、触发器绑定、表面渲染、对话框语义、焦点包含与生命周期通知。
- Popover 专属的焦点目标选择、首选尺寸（显式的 `width`，否则为触发器的最小宽度）、条件性内部滚动，以及支持它们所需的测量生命周期。
- 该 hook 当前追加的回退关闭控件。

**不拥有 / 非目标**

- 触发器呈现与调用方内容呈现——由调用方拥有。
- 组件专属的表面细化目标——由组合组件拥有并记录；Popover 只提供共享的基线目标契约。
- 通用顶层托管、原生 popover 生命周期协调、锚点定位、portal/上下文选择，以及同一手势重开保护——由 `architecture:layer-runtime` 拥有。
- 视口内缩——间距与安全区域内缩、尺寸上限、包含滑动及其锚点可见性条件的回退顺序，以及应用声明的内缩——由 `architecture:layer-runtime` 通过 `spec:AST-059` 拥有。Popover 用运行时的上限约束自己的首选尺寸，不添加任何自有内容。
- 共享的 Escape 与平台关闭顺序——由 `family:overlay-dismissal` 拥有。
- Popover 专属目标选择之外的共享焦点陷阱算法——由 `useFocusTrap` 拥有。
- 悬停预览与简短辅助文本——由 HoverCard 与 Tooltip 拥有。

## Public surface and package boundary

可安装的根包与 `@astryxdesign/core/Popover` 子路径暴露完整的 Popover 公共表面。向后兼容的 Layer 入口点重新导出 `Popover`、`usePopover`、`UsePopoverOptions`、`UsePopoverReturn` 与 `PopoverProps`；`PopoverTriggerRenderProps` 通过 Popover 包表面暴露，而非 Layer 入口点。不存在可安装的 `Popover/usePopover` 实现子路径。

## Public concepts

| 概念           | 封闭取值或状态                           | 含义                                                                           | 可用性                 | 默认值                                             | 所有者                                                                    | 稳定性                | 无效或不支持的行为                                                                                             |
| -------------- | ---------------------------------------- | ------------------------------------------------------------------------------ | ---------------------- | -------------------------------------------------- | ------------------------------------------------------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------- |
| 触发器组合     | 包装触发器、render prop 触发器或引用锚点 | 提供锚点以及打开或关闭标准组件的控件                                           | Popover                | 提供 children 时为包装触发器                       | `component:Popover`                                                       | 当前公共行为          | 没有按钮或按钮角色的引用锚点或包装锚点会在开发环境发出警告，且不会获得触发器处理器；它不会抛出异常。           |
| 可见性归属     | 非受控或外部受控                         | 选择 Popover 是自行存储可见性，还是与调用方状态同步                            | Popover                | 非受控                                             | `component:Popover`                                                       | 当前公共行为          | 受控变更通过 show/hide 同步；关闭请求会报告给调用方，而不是重新定义外部的事实来源。                            |
| 弹出层语义     | 对话框或中性包装                         | 暴露对话框语义，或让子菜单/列表框语义拥有该弹出层                              | Popover 与 hook        | 对话框                                             | `component:Popover`                                                       | 当前公共行为          | 没有标签的对话框会在开发环境发出警告。中性模式省略对话框角色与模态语义。                                       |
| 焦点进入       | 自动或由调用方保留                       | 聚焦真正的调用方内容，不存在此类内容时回退到带标签的对话框表面，或保留当前焦点 | Popover 与 hook        | 自动                                               | `component:Popover`                                                       | 当前公共行为          | 注入的回退关闭控件被排除在初始焦点候选之外，仅在按顺序到达时才会显现。                                         |
| 关闭           | 在原生约束内启用或禁用外部/Escape 关闭   | 控制轻关闭与显式 Escape 参与                                                   | Popover 与 hook        | 两者均启用                                         | `component:Popover`；`family:overlay-dismissal` 拥有 Escape/平台关闭顺序  | 当前公共行为          | 仅禁用 Escape 无法覆盖 auto popover 的原生 Escape 行为；显式关闭行为要求同时禁用轻关闭。                       |
| 呈现           | `popover`、`bottom-sheet` 或 `adaptive`  | 选择承载内容的表面：锚定表面、BottomSheet，或紧凑触摸屏上的 BottomSheet        | Popover                | `popover`                                          | `component:Popover`；`component:BottomSheet` 拥有该 sheet                 | 已决定（DEC-6）       | —                                                                                                              |
| 表面处理       | 默认表面或调用方自有处理                 | 应用共享的绘制表面以及可选的使用方样式                                         | Popover 与 hook        | 默认表面                                           | `component:Popover`                                                       | 当前公共行为          | 自定义样式不会改变生命周期、焦点或关闭语义。                                                                   |
| 表面内边距     | 间距刻度的一个档位，`0` 到 `10`          | 设置绘制表面在调用方内容周围保持的内缩；`0` 为内容自行掌控边缘时的齐平表面     | Popover 与 hook        | Popover：第 3 档；hook：无                         | `component:Popover`                                                       | 待所有者评审（DEC-4） | 该档位落在绘制表面上，因此主题在 `popover` 目标上的 `padding` 会替换它而非嵌套；使用方的 `xstyle` 在其后合并。 |
| 表面目标归属   | 共享基线或组件专属细化                   | 将 `popover` 指定为宽泛的表面所有者，并允许组合组件在同一元素上添加自己的目标  | Popover 与 hook        | `popover` 基线；无组件专属细化                     | `component:Popover`；组合组件拥有其细化目标                               | 当前兼容性契约        | `popover-surface` 是兼容性输出，不是面向使用方的新目标，也不是第二个解剖结构所有者。                           |
| 放置与首选尺寸 | 逻辑放置/对齐加首选宽度                  | 定位锚定表面并陈述 Popover 首选的尺寸；层运行时将其适配到视口                  | Popover 与 hook 渲染器 | 下方/起始；未提供宽度时 Popover 匹配触发器最小宽度 | 偏好由 `component:Popover` 拥有；适配由 `architecture:layer-runtime` 拥有 | 当前公共行为          | 显式宽度按其尺寸渲染，上限为视口减去间距；它绝不会被压缩到触发器旁的空间（`spec:AST-059` FR2）。               |

### Public `usePopover` semantic inputs

使用方语法、确切名称与类型仍保留在 `usePopover.doc.mjs` 中；本表拥有其语义效果。

| 输入概念               | 默认值                   | 效果与生命周期                                                                                                                           | 无效或不支持的行为                                                                     |
| ---------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| 显示与隐藏通知         | 缺失                     | 在 hook 为命令式或已协调的浏览器过渡更新其可见性之后触发。它们在已挂载的 hook 实例期间保持有效。                                         | 未发生过渡时不会触发任何回调。调用方在隐藏通知中添加的任何焦点返回由调用方自行负责。   |
| 表面样式               | 无使用方覆盖             | 在每个渲染生命周期内，将使用方的 StyleX、class 与内联样式合并到绘制表面上。                                                              | 样式无法将所有权转移到被定位的外层；定位样式属于渲染器的层属性。                       |
| 轻关闭与 Escape 关闭   | 启用                     | 启用时，Escape 关闭通过焦点陷阱注册；外部轻关闭使用原生 `popover="auto"`，且不进行共享栈协调。                                           | 只有在同时禁用原生轻关闭时，Escape 禁用才算完整。                                      |
| 自动焦点               | 启用                     | 对每次被接受的打开，聚焦第一个真正的调用方内容控件，除非该次打开要求保留焦点；没有此类内容的对话框回退到其表面。                         | 注入的回退关闭控件永远不会成为初始焦点候选。                                           |
| 回退关闭控件与标签     | 包含；“Close popover”    | 为每个渲染表面追加一个位于陷阱末端的关闭控件。                                                                                           | 省略时，hook 不会合成另一个关闭入口。                                                  |
| 弹出层角色、标签与模态 | 对话框、模态、无隐式标签 | 在渲染生命周期内将语义烙印在绘制表面上。                                                                                                 | 中性角色会抑制对话框与模态语义。缺少对话框标签会在开发环境发出警告，而不是抛出异常。   |
| 默认表面               | 启用                     | 渲染期间应用共享的背景、圆角与高度处理。                                                                                                 | 关闭它会将绘制委托给调用方内容，但不会把 `usePopover` 变成另一种生命周期原语。         |
| 表面内边距             | 无                       | 渲染期间在绘制表面的每条边上应用一个间距刻度档位。`Popover` 传入自己的默认值 3；直接使用 hook 的组合不会绘制内边距，除非它要求某个档位。 | 该档位不是容器协议登记：表面不向其内容发布边缘几何。                                   |
| 可选的组件表面目标     | 无组件专属细化           | 在同一渲染表面上，于规范的 `popover` 目标旁添加一个组件自有的细化目标。新的直接 hook 使用方仅在需要不同的主题可达性时提供并记录一个。    | `surfaceTarget` 不会创建另一个表面或所有者。不要传入或依赖已弃用的 `popover-surface`。 |

### Public `usePopover` semantic outputs

| 输出概念   | 含义与生命周期                                                                                                                                |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 触发器绑定 | 在弹出层显示或退出动画期间，附加的触发器是它的锚点；ARIA 触发器状态跟踪当前角色与打开状态；稳定的锚点标识符支持高级组合。解除附加会移除锚点。 |
| 可见性操作 | `show`、`hide` 与 `toggle` 是已挂载 hook 实例的规范操作。公共签名保持不变，每条打开路径都继承同一手势重开保护。                               |
| 打开状态   | 反映 hook 已协调的可见性。浏览器发起的关闭在排队的原生 toggle 事件上被观察到，因此 DOM 可见性可能短暂领先于 React 状态。                      |
| 表面绑定   | 挂载期间，内容 ref 标识焦点陷阱表面。                                                                                                         |
| 渲染器     | 在调用方内容周围生成被定位的层与绘制表面，包括焦点包含与可选的回退关闭控件。渲染器必须保留在 React 树中，表面才能存在。                       |
| 表面标识符 | 稳定的标识符为该 hook 实例将触发器的控件关系连接到渲染出的表面。                                                                              |

### Side effects and lifetime

- 在弹出层显示期间，直到其退出动画结束，附加的触发器都携带 Layer 运行时使用的 CSS 锚点名（`architecture:layer-runtime` INV18）。解除附加触发器会移除它。
- 每条打开路径都在改变可见性之前应用同一手势重开保护。被拒绝的打开不会调用 `onShow`。
- 成功的可见性操作会在可用时调用浏览器 popover 方法、更新 hook 状态，并调用相应的生命周期通知。原生关闭事件会协调回同一状态模型。
- 默认上下文层在初始解析之后即使关闭也保留其已挂载宿主；控制可见性的是打开状态，而不是宿主是否存在。惰性挂载仍是 Layer 级别的选项，而不是单独的 Popover 契约。
- Popover 组件的触发器处理器与 ARIA 状态仅在触发器已挂载且启用时存在。禁用 Popover 会忽略其触发器交互；它不会禁用调用方的触发器元素。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                 | 依据                                                                                  | 验收与实现状态                                                             |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| FR1  | Popover 与公共 `usePopover` 暴露一个可见性生命周期，包含规范的 show、hide 与 toggle 操作。每条打开路径都继承同一手势重开保护，且不改变公共签名。                                                                                                                                                                                                                                                                       | 当前公共包表面、`architecture:layer-runtime/INV7`，以及所有者于 2026-09-07 的批准     | 已接受；已实现，并由聚焦的 Popover 系列测试覆盖                            |
| FR2  | Popover 在各种激活方式下以相同方式推导语义焦点进入：按文档顺序的第一个真正调用方内容、位于持有 `tabindex="-1"` 的成员之前的 Tab 停靠点，然后是带标签的对话框表面回退。注入的关闭控件被排除。共享的交互方式控制焦点指示，而不是目标。                                                                                                                                                                                   | PR #5373、`architecture:interaction-modality`，以及所有者于 2026-09-07 的批准         | 已接受；已实现，并由 Popover 焦点测试覆盖                                  |
| FR3  | 已退役。视口与安全区域的上限属于层运行时（`spec:AST-059` FR2、FR3）；Popover 用运行时的上限约束其首选尺寸，并以相同定义约束其绘制表面。                                                                                                                                                                                                                                                                                | `spec:AST-059`，所有者于 2026-10-03 的指示                                            | 已退役；见 `architecture:layer-runtime` INV11 与 `Core/Layer` 视口内缩故事 |
| FR4  | 仅当测量到的溢出超过当前容差后，Popover 才启用内部滚动。内容适配时不会成为滚动容器。                                                                                                                                                                                                                                                                                                                                   | PR #5373 与当前测试                                                                   | 已验证的当前行为                                                           |
| FR5  | 打开期间的溢出信号每动画帧最多合并为一次测量，关闭时 Popover 不持有任何测量观察器。                                                                                                                                                                                                                                                                                                                                    | PR #5373 与当前测试                                                                   | 已验证的当前资源行为                                                       |
| FR6  | 组件解剖结构包含调用方触发器与内容、一个绘制后的 Popover 表面，以及可选的回退关闭控件。Popover 不拥有 Header、Body 或单独的共享 hook 表面部件。                                                                                                                                                                                                                                                                        | 当前源码、文档目标清单与测试                                                          | 已接受的解剖结构；本契约纠正了过时的使用方解剖结构                         |
| FR7  | 绘制表面有一个宽泛的规范目标 `popover`；组合组件可添加一个权威的组件专属细化目标。                                                                                                                                                                                                                                                                                                                                     | 所有者于 2026-08-31 的指示，加上当前目标清单                                          | 已接受的规范契约；由聚焦的目标测试覆盖                                     |
| FR8  | 表面内边距是应用在绘制表面上的一个间距刻度档位。Popover 默认为第 3 档（已发布的内缩）；`0` 绘制齐平表面；直接的 `usePopover` 组合不绘制内边距，除非它要求某个档位。该档位所在的位置，正是主题在 `popover` 目标上的 `padding` 替换它的位置。                                                                                                                                                                            | PR #6683 及其 Popover 测试；`architecture:container-padding/INV8`（仅内边距不会登记） | 待所有者评审（DEC-4）；已实现，并由 Popover 表面内边距套件覆盖             |
| FR9  | 在手指下，Popover 从触发处以 `--duration-medium-min` 增长——这是 Storybook 中最接近 iOS 206 ms 增长的一档——并使用 `--ease-entrance`（`spec:AST-094` FR45），随后按主题的退出时长与缓动缩回。增长期间的触摸会被忽略（FR35）。关闭与鼠标进入保持不变。                                                                                                                                                                    | `spec:AST-094` FR31、FR35                                                             | 已实现                                                                     |
| FR10 | 在强制颜色模式下，绘制表面保留可见的边缘，即 1 px 的系统颜色（`CanvasText`）边框，因此当强制颜色移除其阴影时，它仍与页面区分开来（`spec:AST-020` FR1，WCAG 2.2 SC 1.4.11）。`usePopover` 绘制的每个表面（包括 DropdownMenu 的）都如此；ContextMenu 表面与 DropdownMenuSubMenu 飞出层绘制自己的表面，并保留相同的边框。在强制颜色之外，该边缘不设置任何边框宽度、样式或颜色，因此每个表面保留自己的边框或调用方的边框。 | `spec:AST-020` FR1；`component:Dialog` FR9                                            | 已实现                                                                     |

### Allowed variation

- **AV1 — 触发器组合。** 包装、render prop 与引用锚点模式可以附加相同的语义触发器行为，而无需改变表面契约。
- **AV2 — 弹出层语义。** 对话框模式可聚焦对话框容器；角色中性的弹出层让其子角色与内容焦点模型保持暴露。
- **AV3 — 表面处理。** hook 可以省略其默认绘制、更改表面内边距档位，或添加组件自有的细化目标，同时保留规范的 `popover` 归属、生命周期、焦点包含与关闭模型。
- **AV4 — 放置。** 逻辑放置、对齐与首选宽度可以改变几何，而不改变下面的溢出优先级；相对视口的适配属于层运行时。

### Representative focus and dismissal states

| 状态                                    | 必需的不变式                                                                                                                                                                 | 允许的变体                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| 对话框 Popover 的指针或触摸激活         | 初始焦点进入第一个真正的内容控件，不存在时回退到对话框表面。共享的模态感知指示在指针输入后抑制仅键盘的焦点环。                                                               | 触发器与内容可以变化。                                                            |
| 对话框 Popover 的键盘或 AT 风格激活     | 初始焦点进入第一个真正的内容控件，不存在时回退到对话框表面。符合条件的目标会绘制共享的键盘焦点指示。                                                                         | 事件 detail 缺失或为零的激活走这条路径。具名的 AT 播报仍未验证。                  |
| 只读对话框                              | 没有真正的调用方控件时，对话框表面获得初始焦点。注入的回退关闭控件保持隐藏且可通过 Tab 到达，但永远不会被初始选中。                                                          | 调用方内容可能不包含任何可 Tab 聚焦的控件。                                       |
| 中性角色弹出层                          | 中性包装不会被选为对话框焦点目标；自动进入优先选择真正的内容焦点，或者调用方可以针对保留触发器的模式禁用自动聚焦。                                                           | 子菜单、列表框或其他语义拥有其焦点模型。                                          |
| 自动焦点已禁用                          | 打开不会移动焦点。                                                                                                                                                           | 可以是持久配置，也可以是针对单次打开的 show 偏好。                                |
| 受控打开                                | 外部打开状态会走无激活打开路径：先是第一个真正的内容控件，然后是对话框容器回退。                                                                                             | 调用方仍为可见性的事实来源。                                                      |
| 已打开弹出层内部的 Tab 或 Shift+Tab     | 焦点移动到下一个或上一个可 Tab 聚焦的后代，并在任一端回绕，因此它留在弹出层内，无论是否为模态。无论是否按 Alt（Option）都会回绕；与 Ctrl 或 Meta 组合的 Tab 会传递给浏览器。 | 角色中性的菜单在 Tab 时关闭，列表框将焦点保留在其输入中，正如它们各自的记录所述。 |
| 来自已打开弹出层外部的 Tab 或 Shift+Tab | 弹出层不会捕获它：焦点按页面自身的顺序移动到下一个或上一个控件，就如同弹出层不存在。                                                                                         | 浏览器顺序会将锚定弹出层置于其触发器之后，因此仍可能进入其中。                    |
| 从已聚焦容器按 Tab                      | 焦点进入第一个可 Tab 聚焦的后代。                                                                                                                                            | 若不存在，焦点留在内部。                                                          |
| 从已聚焦容器按 Shift+Tab                | 焦点进入最后一个可 Tab 聚焦的后代。                                                                                                                                          | 若不存在，焦点留在内部。                                                          |
| Escape                                  | 最顶层的符合条件的 Popover 依据共享关闭策略关闭。                                                                                                                            | 显式关闭表面可以同时禁用轻关闭与 Escape 关闭。                                    |
| 焦点进入弹出层后关闭                    | 当移除否则会使焦点悬空时，焦点返回到触发器。                                                                                                                                 | 调用方还可以通过其隐藏通知自行负责焦点返回。                                      |

### Transformation and precedence order

- **ORD1 — 可见性操作。** `toggle` 选择既有的 `show` 或 `hide` 过渡；它不是第二个生命周期。每条打开路径都在可见性变化之前应用同一手势保护。公共 `show` 保留其既有的单次打开 `skipAutoFocus` 偏好；否则 Popover 推导真正的内容焦点及其安全的表面回退。
- **ORD2 — 首选行内尺寸。** 显式宽度优先于触发器匹配。没有显式宽度时，Popover 首选触发器最小宽度。任一首选尺寸都由层运行时的视口上限约束（`spec:AST-059` FR7）；两者都不会被限制到触发器旁的空间。
- **ORD3 — 已退役。** 视口适配——间距、上限、翻转与滑动——属于层运行时（`spec:AST-059` FR1–FR5）。Popover 的绘制表面读取运行时的上限，因此溢出状态是针对层所应用的同一界限来评估的。
- **ORD4 — 条件性滚动。** 测量到的溢出大于 1 px 会启用内部滚动与过度滚动包含；适配的内容会让两者保持禁用。

### Performance and resources

- **PR1 — 仅在打开时观察。** 尺寸变化、变更、捕获的资源加载、窗口尺寸变化与可视视口尺寸变化的观察仅在 Popover 组件打开期间存在；清理时会断开监听器与观察器，并取消待处理的工作。
- **PR2 — 每帧一次测量。** 测量待处理期间的重复信号会合并为一次动画帧回调。
- **PR3 — 稳定状态更新。** 仅当溢出布尔值变化时，测量才更新溢出状态。
- **PR4 — 触摸呈现帧。** 在没有其他帧工作的页面上，触摸增长与缩回每帧都不做布局或绘制。已知的平台成本：在 Chromium 中，带有自身 `requestAnimationFrame` 循环的页面会使锚定的动画层每帧都进行布局与绘制。
- **PR5 — 触摸增长的首帧。** 在手指下，增长从 opacity 0.001 而非 0 开始，因为 Chromium 在恰好为 0 时会跳过绘制层。首帧随后显示其内容，且没有任何 8 位像素与透明不同。

## Accessibility contract

- **AR1 — 触发器关系。** 挂载期间，触发器暴露展开状态、弹出层关系以及角色合适的弹出层类型。
- **AR2 — 对话框命名。** 对话框模式要求调用方提供可访问标签，并将对话框/模态语义置于绘制表面上。缺少命名会在开发环境发出警告，但不会合成标签。
- **AR3 — 焦点包含与指示。** 每个 Popover 都是焦点区域，无论是否为模态（DEC-9）。自动进入与 Tab/Shift+Tab 行为遵循上文的矩阵：包含会保持已在弹出层内部的焦点，而从其外部开始的 Tab 永远不会被重定向到其中。`isModal` 仅改变模态语义。没有可 Tab 聚焦后代的被陷阱表面不会让焦点逃逸。符合条件的焦点目标使用共享的模态感知焦点指示，而不是改变语义焦点放置来抑制指针轮廓。
- **AR4 — 焦点返回。** 当焦点曾进入正在关闭的 Popover 且否则会丢失时，关闭会将焦点返回到触发器。
- **AR5 — 证据边界。** 当前自动化测试确立了 DOM 角色、ARIA 状态、焦点移动与焦点返回。Storybook 手动 AT 故事是测试夹具，而不是记录的结果。PR #5373 未记录具名的 NVDA + Chrome 或 VoiceOver + Safari 播报结果，因此本契约不作任何 AT 播报声明。

## Design relationships

| 解剖结构或状态 | 设计要求                                                                                                    | 表示权威                | 层级角色 | 组件契约              |
| -------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------- | -------- | --------------------- |
| 触发器元素     | 提供或引用控件与锚点，但不成为 Popover 自有的呈现。                                                         | 调用方内容              | 支撑     | FR6、AR1              |
| Popover 表面   | 绘制组件表面，拥有规范的 `popover` 目标，并承载滚动、焦点与对话框行为。                                     | 当前源码与所有者 DEC-2  | 突出     | FR2、FR4–FR7、AR2–AR4 |
| 触摸 sheet     | 当 `presentation` 解析为 `bottom-sheet` 时，代替表面承载相同内容；绘制 BottomSheet 的 `bottom-sheet` 目标。 | `component:BottomSheet` | 突出     | DEC-6、AR1、AR4       |
| Popover 内容   | 在表面内部渲染调用方提供的交互或信息。                                                                      | 调用方内容              | 突出     | FR2、FR6              |
| 回退关闭控件   | 提供位于陷阱末端的关闭入口，但不成为初始焦点目标。                                                          | `component:Button`      | 支撑     | FR2、AR3              |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger element": {
    "none": {
      "reason": "intentional: The trigger is caller-owned and receives no Popover theming target."
    }
  },
  "Popover surface": {"target": "popover"},
  "Touch sheet": {
    "delegatesTo": {"owner": "component:BottomSheet", "target": "bottom-sheet"}
  },
  "Popover content": {
    "none": {
      "reason": "intentional: Caller-supplied content is caller-owned; normal CSS may inherit from the surface, but Popover provides no content target."
    }
  },
  "Fallback close control": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  }
}
```

`Popover surface` 与 `Touch sheet` 是同一内容的替代呈现，而不是同时存在的解剖结构。

在精细指针下，打开状态的触摸 sheet 在锚定弹出层之外渲染的任何元素都属于 BottomSheet 的框架，其职责记录在 `component:BottomSheet` 的元素职责中，位于 `spec:AST-017` FR60（DEC-29）的开放层许可范围内。Popover 只向该 sheet 添加其回退关闭控件，即 Button 本身。

每个公共 `usePopover` 绘制表面都属于宽泛的 `popover` 目标。组合组件可以在同一元素上添加自己的权威细化目标，例如 `selector-popup` 或 `multi-selector-popup`。需要不同主题可达性的新直接 hook 使用方会提供并记录一个自有的 `surfaceTarget`。

## Family and system relationships

- `architecture:public-component-api` 拥有可安装的可达性，以及公共包 API 与源码级实现接缝之间的区分。
- `architecture:layer-runtime` 拥有共享宿主、原生 popover 生命周期、锚点几何、视口内缩（`spec:AST-059`）、portal/上下文行为，以及同一手势关闭保护；Popover 拥有该运行时之上的首选尺寸、溢出与焦点组合。
- `architecture:interaction-modality` 拥有共享的模态分类与焦点指示器可见性。Popover 拥有语义焦点进入与回退；指针输入不会仅仅为了隐藏轮廓而选择不同的目标。
- `architecture:component-theming-surface` 拥有解剖结构资格认定与目标放置。`popover` 是绘制表面上的唯一宽泛目标。调用方内容不添加目标，回退关闭控件委托给 Button 的目标，组合组件拥有任何额外的表面细化目标。
- `family:overlay-dismissal` 拥有最顶层 Escape 与平台关闭顺序。Popover 通过共享层所有者参与，同时保留其本地的焦点、外部关闭与打开状态行为。

## Verification map

| 契约                 | 验证                                                                                                                                                                                  | 代表性状态                                                                                                                                                | 变更或失败预期                                                                                       | 审计小节                      |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------- |
| 公共边界，FR1        | `Popover.test.tsx` 的编译期公共表面断言，加上包/桶文件检查                                                                                                                            | 公共签名不变，且整个 Popover 家族的各打开路径都拒绝同一手势                                                                                               | 公共类型发生变化，或同一手势请求到达可见性状态。                                                     | `audit:Popover/api`           |
| FR2、AR2–AR4         | `Popover.test.tsx` 的焦点/角色测试套件以及 `useFocusTrap.test.tsx` 的容器进入测试套件                                                                                                 | 指针、键盘/AT 风格、只读、中性角色、无自动聚焦、受控、Tab/Shift+Tab、Escape、焦点返回                                                                     | 按交互模态改变语义目标、初始选中回退关闭控件、丢失共享指示，或允许焦点逃逸，都会让断言失败。         | `audit:Popover/accessibility` |
| FR2，用户激活        | `Popover.test.tsx` 的 "focuses the first content control within the click that opens it" 与 "keeps focus that onShow moves inside the popover"；使用移动端（触摸）模拟的真实 Chromium | 一次轻触或点击打开内容已挂载的 popover：初始焦点落在该事件之内（iOS 仅在点击处理期间发生的聚焦才唤起屏幕键盘）；`onShow` 或按下动作置于其内的焦点会被保留 | 等到后续帧才落位的初始焦点，或在某帧中移动已位于 popover 内部焦点的行为，都会让断言失败。            | `audit:Popover/accessibility` |
| AR3、DEC-9           | `useFocusTrap.test.tsx` 与 `Popover.test.tsx` 的焦点区域测试套件                                                                                                                      | 模态与非模态；在弹层内部以及从弹层外部的控件触发 Tab 与 Shift+Tab                                                                                         | 弹层把外部的 Tab 拉入自身，或内部的 Tab 离开弹层，都会让断言失败。                                   | `audit:Popover/accessibility` |
| ORD2、FR4            | `Popover.test.tsx` 的尺寸/溢出测试套件；`Popover.stories.tsx` 的匹配触发器与溢出场景；`Core/Layer` 视口内缩故事下的几何                                                               | 显式宽度被限制在视口内、匹配触发器、内容适配与内容溢出                                                                                                    | 颠倒宽度优先级、把宽度上限设为触发器旁的跨度，或始终启用滚动，都会让发出的样式断言或溢出断言失败。   | `audit:Popover/layout`        |
| FR8                  | `Popover.test.tsx` 的表面内边距测试套件                                                                                                                                               | 默认档位、`0`、显式档位、带档位与不带档位的直接 hook 组合                                                                                                 | 默认值不是第 3 步、档位落在表面内部的盒子上，或 hook 绘制了未传给它的档位，都会让该套件失败。        | `audit:Popover/theming`       |
| FR9                  | `spec:AST-094` 中针对 FR31 与 FR35 的验证                                                                                                                                             | 手指之下：打开、关闭、增长过程中的触摸；鼠标                                                                                                              | Popover 未从其触发器增长并收缩回触发器、关闭方式发生变化，或鼠标路径发生变化，都会失败。             | `audit:Popover/behavior`      |
| FR10                 | `OverlayEdges.forcedColors.a11y.chromium.spec.ts`（Chromium，`forcedColors: 'active'`）；`usePopover.forcedColorsEdge.test.tsx`（在强制颜色之外，表面不设置边框宽度或样式）           | Popover、DropdownMenu、DropdownMenu 子菜单飞出层、ContextMenu，以及模态 Dialog 与 AlertDialog 打开；全屏 Dialog；关闭强制颜色时的相同场景                 | 强制颜色下表面没有可见边框、全屏 Dialog 多出边缘或溢出视口，或在强制颜色之外添加任何边框，都会失败。 | `audit:Popover/accessibility` |
| PR4                  | `spec:AST-094` 中针对 FR5 的验证                                                                                                                                                      | Chromium trace 中的触摸增长与收缩，且所在页面没有其他帧工作                                                                                               | 此类页面上任一运动期间出现 Layout 或 Paint                                                           | `audit:Popover/resources`     |
| PR5                  | `PopoverTouchMotion.interaction.browser.spec.ts` 的 "the growth shows its content from its first frames"，取自合成器呈现的每一帧记录（Chromium）                                      | 打开 popover 的一次轻触；增长期间在外部的一次轻触                                                                                                         | 首个不透明度关键帧为 0 的增长，会在其前五帧中出现没有 popover 内容的帧                               | `audit:Popover/resources`     |
| FR5                  | `Popover.test.tsx` 的调度与观察器生命周期测试套件                                                                                                                                     | 关闭、打开、重复信号、清理                                                                                                                                | 在关闭状态下构造观察器，或在每个待处理帧内测量多于一次，都会让生命周期断言失败。                     | `audit:Popover/resources`     |
| FR6、FR7 与主题剖析  | `Popover.test.tsx`、`Popover.doc.mjs`、`usePopover.doc.mjs`、`astryx theme targets Popover --json` 以及 `scripts/check-knowledge.mjs`                                                 | 一个真实表面，带规范的 `popover` 以及组合组件的细化项                                                                                                     | 伪造的剖析部件、缺失的规范输出，或没有真实拥有者的活动目标，都会让审查或校验失败。                   | `audit:Popover/theming`       |
| AR5                  | `Popover.stories.tsx` 的手动 AT 测试夹具与 PR #5373 测试记录                                                                                                                          | 只读对话框的手动 AT 测试夹具；没有记录的 NVDA/VoiceOver 宣读结果                                                                                          | 没有记录 AT/浏览器观察结果的测试夹具不能作为宣读的证据引用。                                         | `audit:Popover/at-evidence`   |
| 呈现（DEC-6、DEC-8） | `PopoverPresentation.test.tsx`                                                                                                                                                        | 手机上默认、手机上自适应与桌面上自适应、强制 sheet、关闭、受控、关闭方式映射                                                                              | 默认手机 popover 上出现 sheet、要求 sheet 时却出现锚定 popover，或触发器状态忽略 sheet，都会失败。   | `audit:Popover/api`           |

## Decision log

### DEC-1 — One canonical visibility operation model

**参考：** `component:Popover/DEC-1`

**决策者：** Cindy Zhang，2026-08-31

显示、隐藏与切换是同一个可见性生命周期。每条打开路径都继承同一手势的重开保护。Popover 推导语义焦点入口；公共的 `show({skipAutoFocus: true})` 仍是既有的逃生口，供在 Popover 之外拥有焦点的自定义组合使用。公共签名不变。

否决：把交互模态做成焦点目标选项。模态拥有焦点指示，而 Popover 拥有语义焦点落位。

### DEC-2 — One canonical Popover surface target

**参考：** `component:Popover/DEC-2`

**决策者：** Cindy Zhang，2026-08-31

`popover` 是宽泛的规范主题基线，由 `<Popover>` 或公共 `usePopover` 创建的每个已绘制表面自动拥有。临时的 `popover-surface` 兼容名称将在 0.7.0 中按 `architecture:component-theming-surface` 移除；既有主题需把该键与选择器迁移到 `popover`。

组合组件保留权威的细化目标，例如 `selector-popup` 与 `multi-selector-popup`。可选的 `surfaceTarget` 在同一表面上添加该自有的细化项；它不会取代宽泛的 `popover` 基线。需要不同可达性的新直接 hook 使用方应提供并记录一个自有目标。

否决：把 `popover` 与 `popover-surface` 当作两个长期并行的目标，或为了满足清单覆盖而虚构一个“Shared hook surface”剖析部件。两者都会让同一个已绘制元素看起来像两个设计概念，并把一个偶然的实现名称固化为永久的公共结构。

### DEC-3 — Focus indication does not change semantic focus placement

**参考：** `component:Popover/DEC-3`

**决策者：** Cindy Zhang，2026-09-07

Popover 在指针、键盘与辅助技术激活之间使用同一条内容优先的语义焦点策略。共享的交互模态系统拥有“符合条件的目标是否绘制键盘焦点指示”这一决定。注入的回退关闭控件被排除在初始焦点之外，仅在使用顺序键盘导航到达时才显现；当调用方内容没有真正的控件时，带标签的对话框表面作为回退。

Popover 家族的每次打开都通过可见性生命周期继承同一手势的重开保护。公共 API 签名保持不变。

否决：在每次指针打开时都把焦点移到对话框表面，只为避免看起来像键盘的轮廓。那会把视觉模态与语义焦点落位混在一起，并绕过共享的焦点指示拥有者。

### DEC-6 — Presentation: the anchored popover, a sheet, or adaptive

**参考：** `component:Popover/DEC-6`

**决策者：** `cixzhang`，`2026-10-25`

Popover 接受 `presentation`，沿用菜单已在使用的词汇：`popover`、`bottom-sheet` 或 `adaptive`。`popover` 是默认值，也是已发布的锚定表面。`bottom-sheet` 在 BottomSheet 中呈现内容。`adaptive` 的选择方式与菜单完全一致：在 `spec:AST-094` FR13 的触摸规则下使用 sheet，紧凑布局由 `spec:AST-012` FR9 管辖，其余情况使用锚定 popover。

### DEC-8 — The sheet Popover presents: label, size, dismissal and loading

**参考：** `component:Popover/DEC-8`

**决策者：** `cixzhang`，`2026-10-25`

在 sheet 中，Popover 的内容由其 `label` 标注；若没有 `label`，则由触发器的文本标注，因此对话框始终有名称。sheet 始终支持轻触关闭：无论 `hasLightDismiss` 怎么说，在其外部轻触或向下滑动都会关闭它，因此手指总有出路。与锚定 popover 一样，它的回退关闭控件保持隐藏。其余一切遵循 Popover 既有的 props。DEC-6 的 sheet 是一个模态 BottomSheet，采用 sheet 的高高度，并由 Popover 的 `padding` 内缩，位于顶部抓取条带之下（`component:BottomSheet`，Content area inset）；`xstyle`、`className` 与 `style` 为其面板设置样式，而 `placement`、`alignment` 与 `width` 不适用。表面在 popover 打开时选定，并保持到其关闭；触发器的展开状态与受控元素跟随当前打开的那个表面。sheet 按需加载，因此 popover 保持锚定的页面不会加载它。

### DEC-9 — A Popover is a focus region, modal or not

**参考：** `component:Popover/DEC-9`

**决策者：** `cixzhang`，`2026-10-26`

Popover 与对话框一样是一个焦点区域。焦点在其内部时，Tab 与 Shift+Tab 在其控件之间循环，关闭操作会关闭它并把焦点返回触发器（AR4）。它不干扰页面其余部分的焦点顺序：在其外部按下的 Tab 会移到页面中的下一个控件，绝不会被拉入弹层；非模态 Popover 让页面保持可交互。这对模态与非模态 popover 同样成立。角色中性的弹层保留其子角色自己的 Tab 模型，因此菜单仍在 Tab 时关闭，listbox 的焦点仍留在其输入框内。

否决：非模态 popover 不做 Tab 包含，那会让焦点从打开的弹层掉到其后面的页面中。

## Verification gaps

这些实现与证据项仍需后续跟进，但它们不阻碍对上述语义契约的接受。

- **VG1 — 真实浏览器行为。** 单元测试断言的是发出的尺寸样式与合成尺寸，而不是渲染后的视口布局。渲染后的视口几何由 `Core/Layer` 的视口内缩故事在故事 play 守卫下覆盖；原生 popover 轻触关闭、顶层排序、渲染后的焦点行为以及焦点指示模态，在改动时仍需真实的 Chromium/WebKit 证据。
- **VG2 — AT 宣读。** 当前故事提供了手动操作说明，但缺少具名的 NVDA + Chrome 与 VoiceOver + Safari 结果。未主张任何宣读结论。

## Open questions

无。DEC-1 确定了可见性模型，DEC-2 确定了规范目标归属，DEC-3 确定了语义焦点与模态感知指示之间的关系，DEC-9 确定了模态与非模态 popover 的焦点包含。其余项是验证工作，不是需要人判断的 API 问题。

## Content boundary

本文件不重复使用方签名、prop 表、示例、实现步骤、共享层算法或家族关闭规则。它链接到其拥有者，只记录 Popover 特有的语义、边界与不变式。

### DEC-4 — Surface padding is a spacing-scale rung on the painted surface

**参考：** `component:Popover/DEC-4`

**决策者：** 待拥有者审查（在 PR #6683 中提议）

表面内边距成为一个公共概念：`Popover` 在共享间距刻度上接受 `padding`（`0 | 0.5 | 1 | 1.5 | 2 | 3 | 4 | 5 | 6 | 8 | 10`，与 `Card`、`Stack`、`LayoutContent` 和 `LayoutPanel` 使用的形状相同），默认是已发布的第 3 步；`usePopover` 接受同一选项，且在未给值时不着色任何内边距，这正是该 hook 已发布的行为。`0` 是齐平表面，用于自行拥有边缘的内容——例如悬停绘制直达边缘的行列表、带底部分隔线的标题行。

档位施加在已绘制表面上，而不是其内部的包装元素上，因此主题在 `popover` 目标上的 `padding` 会继续取代它，而不是嵌套（DEC-2 已为该表面固定了这一落位）。这不会让 Popover 加入容器内边距协议：表面不向其内容发布边缘几何（`architecture:container-padding/INV8`）。

否决：在档位之外再加一个 `'none'` 字符串。最接近的既有词汇把齐平情形写作数值刻度上的 `0`，同一值的第二种写法会让一个状态有两种写法。同样否决：把内边距移到使用方 class 可以替换的内部内容包装元素上——那会把已发布的主题落位变回嵌套盒子。
