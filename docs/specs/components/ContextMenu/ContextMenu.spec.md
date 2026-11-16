---
schema_version: 3
template_version: 7
kind: component
id: component:ContextMenu
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [accessibility, behavior, public-api, theming]
verified_by:
  [
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/ContextMenu/ContextMenu.triggerProps.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
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
system_specs: [spec:AST-094, spec:AST-107]
---

# ContextMenu component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                                                                  |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变更。ContextMenu 接收调用方的 `children` 作为 Trigger 区域，以及数据驱动的 `items` 或复合 `menuContent`、`label`、`presentation`、`isDisabled` 与 `triggerAs`。                                                    |
| 行为          | 右键单击、Shift+F10 或 Menu 键、以及触摸长按会在光标处（键盘操作时为触发器的左下角）打开菜单，或打开底部弹出层；行沿用 DropdownMenu 的行与按压模型。                                                                  |
| 最终用户影响  | 用户可以通过鼠标、键盘或按住的手指抵达某个区域的操作；在手机上子菜单可以逐层深入。由触摸打开的菜单目前还不会从手指处长出，也不会抬起其触发器，并且从外部开始的滚动会让它保持打开；鼠标与键盘打开方式保持当前外观。    |
| 构建方影响    | 构建方可以包裹任意区域，包括正文中的行内引用（`triggerAs="span"`）。                                                                                                                                                  |
| 兼容性/就绪度 | 记录已发布的行为；无 API 变更；禁用的行获得 `tabindex="-1"`；手指下的已发布行为按 `spec:AST-094` FR25 所列迁移，而 `presentation="popover"` 会保留该行为。触摸成长、平移关闭与触发器抬起（FR5）列在当前状态影响之下。 |
| 审查检查      | 拒绝以下情况：触发器获得 role 或 `aria-haspopup`、菜单绕过共享 Escape 栈、`context-menu` 目标被移出已绘制的表面，或出现第二个打开状态所有者。                                                                         |
| 管辖规则      | `spec:AST-107` FR8；`spec:AST-094` FR26–FR35；`module:DropdownMenu/useMenuPress`；`family:overlay-dismissal`；`architecture:component-theming-surface`；`architecture:layer-runtime`。                                |

本表是审查视角的投影；下面的正文具有权威性。

## Intent

ContextMenu 为调用方提供的区域呈现操作，形式为跟随光标定位的指针菜单，或由 BottomSheet 承载的触摸操作列表。

## Compatibility and migration

- 已发布的默认行为得以保留：手指下的 `no`：省略的 `presentation` 遵循 `spec:AST-094` FR31–FR33（FR5）；`presentation="popover"` 保留已发布的菜单（`spec:AST-094` FR25）；以及所有指针下禁用行的 `no`：键盘可以抵达禁用的行，且该行带有 `tabindex="-1"`（FR8，`component:DropdownMenu` FR17），这是 `component:DropdownMenu` DEC-11 下的缺陷修复（所有者决定，2026-11-04）
- 兼容性类别：记录已发布的行为；无公共 prop 或导出变更；禁用的行获得 `tabindex="-1"`（FR8）
- 受控/非受控行为：内部管理打开状态
- 迁移决定：`spec:AST-094` FR25

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**Owns**

- Trigger 区域的上下文菜单调用接线（FR10）。
- 替代的 Pointer 菜单表面与 Touch 菜单表面及其共享的 `context-menu` 目标。
- 两条呈现路径上的光标锚点放置，以及打开状态（FR10）。

**Does not own / non-goals**

- 调用方提供的 Trigger 区域内容。
- 指针操作行呈现——委托给 `component:DropdownMenu`；`ContextMenuItem`、`ContextMenuDivider` 与 `ContextMenuGroup` 这些导出就是 DropdownMenu 的组件以这些名称对外提供（`component:ContextMenuItem`）。
- Touch 弹出层框架——委托给 `component:BottomSheet`。
- 数据驱动的 Touch 操作列表与行呈现——委托给 `component:List`。
- 共享层生命周期或关闭策略。

## Public concepts

使用方 props、内容模式与呈现策略仍记录在 `ContextMenu.doc.mjs` 中。DEC-1 增加了一个组件本地概念：

| 概念         | 封闭值或状态  | 含义                                                                                             | 按变体/方向/状态的可用性 | 默认值 | 所有者                  | 稳定性 | 无效值行为            |
| ------------ | ------------- | ------------------------------------------------------------------------------------------------ | ------------------------ | ------ | ----------------------- | ------ | --------------------- |
| Trigger 元素 | `div`、`span` | Trigger 区域渲染成什么：块级元素，或行内包装器，使正文中的引用可以拥有上下文菜单而不打断文本流。 | 两种呈现方式             | `div`  | `component:ContextMenu` | stable | 未知值按 `div` 读取。 |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 依据                                                                  |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| FR1  | 每次渲染都包含调用方提供的 Trigger 区域；在 `isDisabled` 下任何调用都不会打开菜单，原生上下文菜单保持不变。指针呈现会在当前本地光标锚点处打开 Pointer 菜单表面；触摸呈现会打开 Touch 弹出层框架，其中包含 Touch 菜单表面，且在数据模式下还包含 Touch 操作列表与 Touch 操作行。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源码、文档与测试                                                  |
| FR2  | `context-menu` 目标位于已绘制的 Pointer 菜单表面与替代的 Touch 菜单表面上，而不在 Trigger 区域或光标锚点上。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `architecture:component-theming-surface`；当前源码                    |
| FR3  | 指针操作行保持 DropdownMenu 的所有权。触摸框架保持 BottomSheet 的所有权，而数据驱动的触摸列表与行保持 List 的所有权。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与所有者文档                                                  |
| FR4  | 复合 `menuContent` 仍是调用方提供的指针菜单内部内容，也可以渲染在触摸框架之内；数据驱动的触摸路径则把相同的条目数据转换为 List 与 ListItem 呈现。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试                                                        |
| FR5  | Pointer 菜单表面带有 `data-astryx-menu-press`，并遵循 `module:DropdownMenu/useMenuPress` FR1–FR7：释放位置下的行执行动作，高亮跟随按住的手指，鼠标在外部释放会关闭而手指离开会让菜单保持打开，误触点击从不执行动作，`touch-action` 跟随溢出。打开菜单的长按在抬起时不会关闭它；在外部轻点会关闭它，而在外部按下鼠标会在按下时关闭它。在手指下，菜单必须在从它外部开始的平移开始时关闭（`spec:AST-094` FR32），必须把打开它的按住手指作为开启按压交给菜单，并且必须像 FR32 那样处理笔在外部按下（FR33）。抬起与成长仅适用于由触摸打开的菜单（在粗指针上的触摸发起打开）；由鼠标或键盘打开的菜单保持已发布的外观与动效，不抬起、不着色、不成长。由触摸打开的菜单必须从手指的点长出并缩回该点（`spec:AST-094` FR31），作为其自身的表面，仅通过 transform 与 opacity（`spec:AST-094` FR5），不得有第二个元素（例如玻璃表面）在它后面成长，且在块级触发器上必须把触发器抬到页面之上并让菜单位于其旁（FR33；DD1，DEC-2）。长按呈现是一个手势组件，因此触发器的抬起播放 `springs.contextMenuLift`，菜单的成长播放 `springs.contextMenuMorph`，触发器的归位（菜单退出的一部分）播放 `springs.contextMenuDismiss`（`spec:AST-094` FR4、FR7、FR45）。实现缺口：它保留层自身的进入与退出，从外部开始的滚动会让它保持打开，开启的手指没有被交给菜单，因此无法滑到某一行，不存在触发器抬起或页面着色，而笔在外部按下会在按下时关闭它。右键单击、Shift+F10、长按调用与键盘导航如 FR1 与 FR8 所述。 | `module:DropdownMenu/useMenuPress`；`spec:AST-094` FR26–FR33          |
| FR6  | 在 `triggerAs="span"` 下，Trigger 区域是一个拥有自身盒子的行内元素，因此光标锚点在每条调用路径上都以触发器自身的矩形为基准测量。右键单击、Shift+F10、长按以及 `context-menu` 目标放置都使用该盒子。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | DEC-1                                                                 |
| FR7  | 子菜单行在指针菜单内遵循 `component:DropdownMenu` FR11：ContextMenu 挂载相同的逐层深入视图栈，并以自身的 `label` 命名，因此这里的子菜单在手机上也可以逐层深入。带页眉或页脚的子菜单在这里只显示其行（`component:DropdownMenu` FR20）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `component:DropdownMenu/DEC-4`                                        |
| FR8  | 在指针菜单中，ArrowDown 在最后一行会回绕到第一行，ArrowUp 在第一行会回绕到最后一行；PageDown 与 PageUp 按 `component:DropdownMenu` FR12 翻页；按住按键的自动重复不会激活；typeahead 仅匹配行的 label 元素。禁用的行可被这些按键与 typeahead 抵达，并保持惰性，如 `component:DropdownMenu` FR17 所述。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试                                                        |
| FR9  | Pointer 菜单表面打开期间，它通过共享栈参与 `family:overlay-dismissal`，并提供后代深度。一次 Escape 按下只影响最顶层的现存嵌套表面；只有当 ContextMenu 就是该表面时它才关闭。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `family:overlay-dismissal` FR1–FR6；`ContextMenu.test.tsx` 嵌套层用例 |
| FR10 | ContextMenu 必须构建在公共无头上下文菜单之上（`spec:AST-107` FR8）；其调用、打开状态与清理都归工厂所有，除工厂之外没有自身行为。实现缺口：尚未发布无头上下文菜单；ContextMenu 自行负责其调用、打开状态、外部按压监听器与清理。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | `spec:AST-107` FR8                                                    |
| FR11 | 在指针菜单的某一行上（无论是它自己的行，还是任意深度上已打开子菜单飞出层的行）按 Tab 或 Shift+Tab，会关闭每个打开的层级以及菜单，并调用一次 `onOpenChange(false)`，如 `component:DropdownMenu` FR23 对其菜单所述。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | WAI-ARIA Menu Button 模式；当前测试                                   |

### Allowed variation

- **AV1 — 调用。** 右键单击、键盘上下文菜单调用与长按可以打开当前解析出的呈现方式，而不改变解剖结构所有权。
- **AV2 — 呈现方式。** `popover`、`bottom-sheet` 与解析出的 `adaptive` 呈现可以选择当前的指针或触摸解剖结构。
- **AV3 — 内容模式。** 数据驱动的指针内容通过 DropdownMenu 辅助函数渲染；复合内容仍由调用方组合。数据驱动的触摸内容通过 List 渲染。

### Representative states

| 状态         | 必需不变式                                                                     | 允许的变化                                       |
| ------------ | ------------------------------------------------------------------------------ | ------------------------------------------------ |
| 指针数据菜单 | Trigger 区域打开带 DropdownMenu 所属行的 Pointer 菜单表面。                    | 光标位置、行内容、宽度与嵌套飞出层可以变化。     |
| 指针复合菜单 | Trigger 区域围绕调用方提供的菜单内容打开同一表面。                             | 调用方选择受支持的 DropdownMenu 内部组件。       |
| 触摸数据菜单 | Trigger 区域打开 Touch 弹出层框架与包含 List 所属操作的 Touch 菜单表面。       | 标题、分区、分隔线、图标与逐层深入深度可以变化。 |
| 触摸复合菜单 | Trigger 区域围绕 ContextMenu 表面与调用方提供的内部内容打开 Touch 弹出层框架。 | 调用方提供的内容仍对自身结构负责。               |
| 禁用的触发器 | Trigger 区域仍然渲染，且原生浏览器上下文菜单不会被 ContextMenu 抑制。          | 调用方提供的内容保持不变。                       |

### Transformation and precedence order

- **ORD1 — 光标锚点。** 指针调用锚定在指针处，并保持在触发器末端边缘之内；键盘调用锚定在触发器的左下角。

### Performance and resources

- **PR1 — 有界资源。** 打开期间，ContextMenu 会为外部关闭添加一个 document（以及 shadow-root）上的 mousedown 监听器，并在关闭时移除；指针菜单会观察自身尺寸与内容以决定是否滚动。在 `presentation="adaptive"` 下，它在挂载期间订阅 compact-touch 查询。从未打开过的菜单不挂载任何指针菜单表面，只挂载其层的惰性标记：表面在首次打开时挂载，之后保持挂载，因此包含许多上下文菜单的页面（每个单元格一个的表格）不会携带已关闭的菜单表面。

## Accessibility contract

ContextMenu 保留其菜单与对话框命名、键盘调用、长按路径、键盘导航、条目语义、焦点返回以及特定呈现方式的关闭行为。指针菜单的 Escape 请求参与共享层栈；当指针在指针菜单中被按住时，高亮即 DOM 焦点，依据 `module:DropdownMenu/useMenuPress` AR1。

- **AR1 — 行内触发器保留其语义。** `triggerAs` 只改变 Trigger 区域的元素与盒子；它以任何形式都不带 role 或 `aria-haspopup`，而菜单保留自身的名称（`label`）。

## Design relationships

| 解剖结构或状态   | 设计要求                                                 | 表示权威                 | 层级角色     | 组件契约      |
| ---------------- | -------------------------------------------------------- | ------------------------ | ------------ | ------------- |
| Trigger 区域     | 定义接受上下文菜单输入的、归调用方所有的区域。           | 调用方提供的内容         | 取决于上下文 | FR1, FR2      |
| Pointer 菜单表面 | 在当前光标锚点处绘制菜单。                               | 当前源码与公共文档       | 显著         | FR1, FR2      |
| 指针操作行       | 通过 DropdownMenu 呈现操作、可选项或嵌套菜单条目。       | `component:DropdownMenu` | 显著         | FR1, FR3, FR4 |
| Touch 弹出层框架 | 提供触摸面板、滚动区域、把手与可选遮罩。                 | `component:BottomSheet`  | 显著         | FR1, FR3      |
| Touch 菜单表面   | 在弹出层内安排 ContextMenu 所属的标题与内容。            | 当前源码与公共文档       | 显著         | FR1, FR2      |
| Touch 操作列表   | 使用宽松的 List 呈现来分组数据驱动的触摸操作。           | `component:List`         | 显著         | FR1, FR3, FR4 |
| Touch 操作行     | 使用 ListItem 呈现一个数据驱动的触摸操作或逐层深入条目。 | `component:List`         | 显著         | FR1, FR3, FR4 |

`context-menu` 目标有意同时出现在两个替代的已绘制菜单表面上。Trigger 区域内容仍归调用方所有，而 1px 光标锚点是定位基础设施，而不是使用方解剖结构。

### Design decisions

<!-- design-decisions:v1 -->

| ID  | Decision                                                                                     | Intent or reason                                                                                                                                             | Applies to                                | Allowed variation                                            |
| --- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------- | ------------------------------------------------------------ |
| DD1 | 当由触摸打开的菜单抬起其触发器时，抬起的触发器之后的页面会用主题的覆盖色着色，且不会被模糊。 | 被抬起的触发器仅使用主题 token 就从变暗的页面中凸显出来，因此主题与深色模式可以在不新增 token 的情况下重新设定其样式，并且页面之后的任何内容都不会逐帧重绘。 | 块级触发器上由触摸打开的菜单的抬起（FR5） | 主题选择覆盖色的值。页面之后的模糊或玻璃材质不属于默认外观。 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Trigger area": {
    "none": {
      "reason": "intentional: Caller-provided trigger content remains caller-owned and the ContextMenu wrapper has no public target."
    }
  },
  "Pointer menu surface": {"target": "context-menu"},
  "Pointer action row": {
    "delegatesTo": {
      "owner": "component:DropdownMenu",
      "target": "dropdown-menu-item"
    }
  },
  "Touch sheet frame": {
    "delegatesTo": {"owner": "component:BottomSheet", "target": "bottom-sheet"}
  },
  "Touch menu surface": {"target": "context-menu"},
  "Touch action list": {
    "delegatesTo": {"owner": "component:List", "target": "list"}
  },
  "Touch action row": {
    "delegatesTo": {"owner": "component:List", "target": "list-item"}
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 负责解剖结构限定、本地目标映射、特定呈现方式的行以及委托规则。
- `architecture:interaction-modality` 负责共享的右键单击、键盘、长按、指针、触摸与自适应呈现边界。
- `architecture:layer-runtime` 负责当前上下文模式的 `useLayer` 宿主与光标锚点定位。ContextMenu 自行在外部按压时关闭菜单（FR10），并通过 `useLayerDismissal` 加入共享 Escape 排序；触摸承载委托给 BottomSheet。
- `spec:AST-094` 负责触摸按压、抬起、成长与关闭规则（FR5）。
- `spec:AST-094` FR4 列出了该组件拥有的三种动效角色，其抬起据此测量：`springs.contextMenuLift`、`springs.contextMenuDismiss` 与 `springs.contextMenuMorph`。ContextMenu 的长按呈现是一个手势组件，因此抬起播放 `springs.contextMenuLift`，成长播放 `springs.contextMenuMorph`，而归位（退出的一部分）播放 `springs.contextMenuDismiss`（`spec:AST-094` FR7、FR45）。
- `family:overlay-dismissal` 负责共享的 Escape 与平台关闭排序。ContextMenu 的指针呈现是共享栈的采用方；触摸呈现把关闭委托给 BottomSheet，而 BottomSheet 也是共享栈的所有者。

## Verification map

| 契约                 | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 代表性状态                                                                                                           | 变异或失败预期                                                                                                                                                                                                                 | 审计小节                          |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| FR1, FR4             | `ContextMenu.test.tsx` 的渲染、调用、bottom-sheet、自适应、复合与禁用用例（"renders menu with role=\"menu\""、"opens menu on right-click"、"opens from a keyboard-invoked contextmenu (Shift+F10 / Menu key)"、"opens on touch long-press"、"opens the real menu content in a BottomSheet when requested"、"uses the BottomSheet for adaptive presentation on compact touch"、"renders menuContent as menu items"、"does not open when isDisabled is true"） | 右键、键盘、长按；指针与 Sheet；数据与复合；禁用                                                                     | 缺少调用路径、菜单 role、Sheet 或复合内部结构，或禁用的触发元素仍会打开，即判定失败。证据缺口：没有测试断言禁用的触发元素会让原生上下文菜单保持原状。                                                                          | `audit:ContextMenu/anatomy`       |
| FR2                  | `themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                     | 渲染出的目标                                                                                                         | 渲染出的类若不在已记录的目标中，即判定失败。证据缺口：没有测试断言两个绘制表面上存在 `context-menu`，也没有断言该属性不出现在触发元素上。                                                                                      | `audit:ContextMenu/theming`       |
| FR3                  | `ContextMenu.test.tsx` 的破坏性变体、分区、分隔线与可选及别名用例                                                                                                                                                                                                                                                                                                                                                                                            | 通过 ContextMenu 共享的行                                                                                            | 行若丢失 DropdownMenu 的语义或变体，即判定失败。证据缺口：除渲染之外，没有任何测试断言 BottomSheet 与 List 的委托。                                                                                                            | `audit:ContextMenu/theming`       |
| FR5                  | `ContextMenu.test.tsx` 的 "acts on the row under a finger release, once, and swallows the stray click" 与外部关闭用例；`ContextMenuLongPress.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                          | 手指抬起；长按抬起；外部点按、鼠标、笔与滚动                                                                         | 行依据按下时的行执行、游离点击被执行、长按关闭了自身的菜单，或外部点按或鼠标按下后菜单仍然打开，即判定失败。证据缺口：没有测试断言 FR31 的生长、开启手指的交接或 FR33 的抬升；外部滚动与笔用例断言的是当前缺口。               | `audit:ContextMenu/behavior`      |
| FR5, DD1 touch scope | 触摸 story 上的浏览器测试，菜单分别由粗指针下的手指、细指针下的鼠标与 Shift+F10 打开                                                                                                                                                                                                                                                                                                                                                                         | 块级触发元素上由触摸、鼠标与键盘打开的菜单                                                                           | 由鼠标或键盘打开的菜单若抬升其触发元素、给页面着色或生长，或由触摸打开的菜单若模糊页面、生长出第二个表面，或除了 transform 与 opacity 之外还播放任何动效，即判定失败。证据缺口：抬升与生长尚未实现，因此没有任何测试断言二者。 | `audit:ContextMenu/behavior`      |
| FR5 Reduce Motion    | 在 Reduce Motion 下对触摸 story 的浏览器测试                                                                                                                                                                                                                                                                                                                                                                                                                 | 在 Reduce Motion 下打开与关闭的触摸打开菜单                                                                          | 抬升、生长或收缩若产生位移，而不是播放 200 ms 或更短、仅改变 opacity 的交叉淡入淡出（`spec:AST-094` FR8），即判定失败。证据缺口：不存在这样的测试。                                                                            | `audit:ContextMenu/behavior`      |
| FR5 motion roles     | 针对 `spec:AST-094` FR4 的角色注册表测试                                                                                                                                                                                                                                                                                                                                                                                                                     | `springs.contextMenuLift`、`springs.contextMenuDismiss` 与 `springs.contextMenuMorph`，在 tempo 1 与 `'standard'` 下 | 抬升、回位或生长若播放曲线或字面值而不是其弹簧角色，或某角色偏离 FR4 表中的取值，即判定失败。                                                                                                                                  | `audit:ContextMenu/behavior`      |
| DEC-2                | 触摸 story 上的元素计数浏览器测试（`spec:AST-017` FR60）                                                                                                                                                                                                                                                                                                                                                                                                     | 静止与抬升状态下的细指针与粗指针                                                                                     | 静止时出现抬升元素、出现触发元素的副本，或打开时的计数超出层、阴影、锚点与占位元素，即判定失败。证据缺口：抬升尚未实现，因此不存在测试。                                                                                       | `audit:ContextMenu/anatomy`       |
| FR6, AR1, ORD1       | `ContextMenu.test.tsx` 的 "inline trigger (triggerAs)" 与光标锚点用例；"does not put aria-haspopup on the role-less trigger wrapper (menus-15)"；`ContextMenu.triggerProps.test.tsx`；`ContextMenuCursorAnchor.a11y.browser.spec.ts`                                                                                                                                                                                                                         | 段落中的 `span`；默认 `div`；指针与键盘锚点                                                                          | 正文中出现块级触发元素、触发元素带有 role 或 `aria-haspopup`，或锚点落在触发元素之外，即判定失败。                                                                                                                             | `audit:ContextMenu/behavior`      |
| FR7                  | `ContextMenu.test.tsx` 的 "drills into nested data items inside the BottomSheet"、"renders a submenu from a nested items array and keyboard-reaches an item after it" 与 "shows a sub-menu with a header or footer as its rows alone, and says why in development"                                                                                                                                                                                           | Sheet 内逐层进入；指针子菜单；ContextMenu 下的区域                                                                   | 缺少子菜单、其后的行无法到达，或 ContextMenu 下出现子菜单对话框，即判定失败。证据缺口：这里的测试没有断言手机上的指针逐层进入。                                                                                                | `audit:ContextMenu/behavior`      |
| FR8                  | `ContextMenu.test.tsx` 的 "wraps arrow navigation at the ends"、typeahead 用例与禁用行的键盘用例（`component:DropdownMenu` FR17）                                                                                                                                                                                                                                                                                                                            | 环绕；typeahead；禁用行                                                                                              | 方向键在末端被钳制、缺少 typeahead 匹配、按键或 typeahead 跳过了禁用行，或禁用的行被执行或关闭了菜单，即判定失败。证据缺口：没有测试断言 Page 键或自动重复。                                                                   | `audit:ContextMenu/behavior`      |
| FR9                  | `ContextMenu.test.tsx` 的 "lets a nested layer consume Escape before the context menu"、"closes on Escape even when opened without auto-focus" 与 "ignores Escape during IME composition"                                                                                                                                                                                                                                                                    | 嵌套层；Escape；输入法组合                                                                                           | 上下文菜单随其嵌套子层一起关闭，或在输入法组合期间的 Escape 时关闭，即判定失败。                                                                                                                                               | `audit:ContextMenu/behavior`      |
| FR10, PR1            | `ContextMenu.test.tsx` 的调用与处理函数组合用例（"composes the consumer context-menu handler with menu opening"、"keeps component-owned opening when a consumer prevents default"、"composes consumer touch handlers with long-press detection"）                                                                                                                                                                                                            | 右键、长按、键盘                                                                                                     | 上下文请求没有打开菜单，或使用方的处理函数被丢弃，即判定失败。证据缺口：没有测试断言卸载时的监听器清理；也没有任何测试覆盖 headless 工厂，因为它并未发布（即 FR10 缺口）。                                                     | `audit:ContextMenu/behavior`      |
| FR11                 | `ContextMenu.test.tsx` 的 "Tab from a flyout leaves the whole menu" 用例                                                                                                                                                                                                                                                                                                                                                                                     | 子菜单中的一行                                                                                                       | Tab 之后菜单或浮出层仍然打开，或出现第二次 `onOpenChange(false)`，即判定失败。                                                                                                                                                 | `audit:ContextMenu/accessibility` |
| 主题解剖映射         | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                | 规范解剖结构与目标                                                                                                   | 缺失、多余、带前缀、过时或未分类的映射会使仓库校验失败。                                                                                                                                                                       | `audit:ContextMenu/theming`       |
| RTL 关系             | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `Presentation / BottomSheet submenu` story                                                                                                                                                                                                                                                                                                                                           | BottomSheet 进入子菜单，LTR 与 RTL                                                                                   | 两个方向上，Sheet 头部的返回按钮都不在其标题的行内起始处，即不满足 D2。                                                                                                                                                        | `audit:ContextMenu/i18n-rtl`      |

## Current-state impact

- **没有 headless 工厂（FR10）。** 没有发布 headless 上下文菜单，因此 ContextMenu 自行负责其调用、打开状态与外部按下监听器，这与 `spec:AST-107` FR8 相悖。
- **触摸生长、平移关闭、交接与抬升（FR5）。** 触摸打开的菜单沿用层自身的进入与退出，而不是从手指处生长；外部开始的滚动会让它保持打开；打开它的那根按住的手指无法滑到某一行；块级触发元素不会被抬升到着色页面之上；外部笔按下时它会在按下处关闭。这些都与 `spec:AST-094` FR31、FR32 与 FR33 相悖。由鼠标或键盘打开的菜单已经保持了其释放后的外观与动效。

## Decision log

按下模型的决策位于 `module:DropdownMenu/useMenuPress`。

### DEC-1 — The trigger may be inline

**Reference:** `component:ContextMenu/DEC-1`

**Decider:** `cixzhang`, 2026-10-02

正文中的实体引用（任务 ID、diff ID）需要上下文菜单的三个入口，同时不变成打断段落的块。`triggerAs` 会把 Trigger 区域渲染为 `span`。默认的 `div` 及其 `position: relative` 保持不变。

否决：把块级 `div` 样式化为行内，因为它在 `<p>` 内仍然无效。

否决：`display: contents`，因为无盒子的包装元素没有可让指针或键盘锚定的矩形。

### DEC-2 — The lift adds four elements while open, each with one job

**Reference:** `component:ContextMenu/DEC-2`

**Decider:** cixzhang, 2026-11-01

在块级触发元素上，触摸打开的菜单会通过唯一的抬升模块（`architecture:layer-runtime` INV15）把触发元素自身抬升到着色的页面之上（`spec:AST-094` FR33）。菜单显示期间，页面比细指针下多出四个元素，在 `spec:AST-017` FR60 与 DEC-29 的打开层允许范围内，且每个元素只有一个职责：

- 抬升层从顶层覆盖视口，接收页面的触摸，并把染色（DD1）绘制为它的 `::backdrop`；
- 阴影是层中的一个盒子，它把触发元素的抬升作为一次合成器动画来跟随（若让触发元素的 `::backdrop` 参与动画，页面每一帧都会重新计算样式并重新布局）；
- 层中位于抬升后矩形处的空盒子是菜单放置所依靠的对象（锚点定位会跟随变换，因此触发元素自身的光标锚点会随抬升后的触发元素一起移动）；
- 触发元素之后的空占位元素占据触发元素的位置，因此当触发元素位于顶层时页面不会移动。

这四个元素都不可主题化，也不属于解剖结构；它们在静止时都不挂载；没有任何内容被挂载两次：触发元素会自行抬升，不存在副本。抬升生长的同时会加入输入按住时的护盾，菜单关闭时会加入层运行时的退出副本。由鼠标或键盘打开的菜单不会添加其中任何一个。

否决：在染色之上放置触发元素的副本，因为它会两次挂载触发元素的内容，且其数量随触发元素增长。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、菜单示例、光标与长按算法、实现步骤，也不重复共享的模态、层、关闭与主题规则。它链接到这些内容的所有者。
