---
schema_version: 1
template_version: 1
kind: family
id: family:action-groups
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [behavior, interaction, accessibility]
verified_by:
  [
    packages/core/src/hooks/useMenuPress.test.tsx,
    packages/core/src/hooks/menuPressGesture.test.ts,
  ]
members:
  [
    component:DropdownMenu,
    component:DropdownMenuSubMenu,
    component:ContextMenu,
    component:Selector,
    component:MultiSelector,
    component:DateInput,
    component:DateTimeInput,
    component:TimeInput,
    component:AlertDialog,
    component:ButtonGroup,
    component:ToggleButtonGroup,
    component:Toolbar,
    component:Banner,
    component:Toast,
    component:TopNavMenu,
    component:SideNavHeading,
    component:TopNavHeading,
    component:TabMenu,
    component:DateRangeInput,
    component:NavHeadingMenu,
    component:BreadcrumbItem,
  ]
architecture: [architecture:interaction-modality]
contributing: []
deciding_specs: [spec:AST-094/DEC-17]
---

# Action groups contract

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "interaction": ["FR1", "FR2", "FR3", "FR4", "FR5"]
  }
}
```

## Intent

用户可以按下同级操作组中的一个操作，在滑动经过其他操作时高亮跟随，并在抬起时作用于抬起所在的操作；每个组都以相同方式工作，SegmentedControl 是唯一明确列出的例外。每个成员都从同一个共享实现获得该行为，或者菜单以及 Selector 和 MultiSelector 的选项从菜单按压模型获得该行为，因此没有成员自行实现。

## Membership rule

当组件渲染一组两个或更多同级的瞬时、切换或选项操作，且用户从中选择一个时，该组件即为成员。当前的成员：

- 菜单：DropdownMenu、ContextMenu 及其子菜单，TopNav 的导航菜单（TopNavMenu）、SideNavHeading、TopNavHeading 和 NavHeadingMenu；以及
  BreadcrumbItem 的 `menu`，它渲染 DropdownMenu 项；
- TabMenu 的标签选项菜单；
- 选项列表：Selector 和 MultiSelector 的选项，以及 DateInput、DateTimeInput 和 TimeInput 的滚轮；
- AlertDialog 的操作；
- ButtonGroup 和 ToggleButtonGroup；
- DateRangeInput 的预设，一组带标签的预设按钮；
- Toolbar 的按钮；工具栏内的字段会被跳过；
- Banner 和 Toast 的操作行（当一行有两个或更多同级操作时）。

Dialog 页脚、Card 页脚或任何 `LayoutFooter` 中的操作行通过组合 ButtonGroup 获得该行为。

以后构建的符合该规则的组件按规则加入，包括操作表、标签栏或导航栏、筛选芯片组和评分。

SegmentedControl 是明确列出的例外：本家族的规则不约束它。

以下不是成员：

- 文本输入框和作为整体的 InputGroup，其输入框保留光标和选区，其附加项属于该输入框而不是组成一个组；
- TabList，其可滚动行需要拖动才能滚动，其标签切换视图；
- Pagination 和 Stepper，是页面流中的内联页面控件而非菜单；
- TopNavMegaMenu 的面板，是 `role="group"` 中的链接浏览网格，不是菜单（`component:TopNavMegaMenu` FR5）；
- SideNavItem 的折叠栏浮出层，是该条目导航行的弹出层，不是菜单；
- Popover 本身，其内容拥有自身角色的表面；其中的菜单遵循其自身的组件；
- Calendar 的日期网格，是具有自身键盘和范围选择模型的二维日期网格，滑动提交会破坏它；
- RadioList、CheckboxList 和 SelectableCard，其行和卡片位于滚动列表中；
- Token 芯片，可移除且没有组控件。
- Typeahead（也是 Tokenizer 的）、CommandPalette 的建议列表，以及聊天编辑器的触发菜单，其焦点保留在文本输入框中，如同文本输入框一样。

## Shared owner

一个共享的内部实现为除菜单以及 Selector 和 MultiSelector 的选项之外的每个成员提供 FR1–FR5（`architecture:interaction-modality` INV13）；后者从 `module:DropdownMenu/useMenuPress` 获得这些。没有成员保留另一份副本。

## Canonical concepts

- **操作组：** 用户从中选择一个的两个或更多同级操作。
- **持有的指针：** 尚未抬起的按压，在整个组范围内跟踪。
- **抬起的操作：** 指针抬起时位于其下方的已启用操作。

## Cross-component invariants

- **FR1 — 抬起决定。** 在触摸呈现下（`spec:AST-094` FR13），在成员中，对某个操作按下并滑动经过其同级操作时，会作用于指针抬起所在的那个操作，通过该操作自身的激活；从未离开其操作的按压会作用于它。一个手势最多执行一次（`spec:AST-094` FR26）。滑动之后，焦点执行与点击抬起操作相同的效果。鼠标按压的行为与平台原生按钮相同：在它开始的操作上，并在该操作上释放。
- **FR2 — 高亮跟随指针。** 指针被按住时，其下方的已启用操作会高亮，最多同时一个；在禁用操作、间隙或组外之上不会高亮任何内容（`spec:AST-094` FR27）。
- **FR3 — 滑出取消。** 在组外抬起的按压不作用于任何内容；第二根手指结束手势且不执行任何操作（`spec:AST-094` FR28），如同失去焦点或取消的指针一样（`spec:AST-094` FR44）。为手势打开的成员是否保持打开，由该成员决定。
- **FR4 — 切换组只切换抬起的操作。** 在切换组中，只有抬起所在的操作会切换；滑动经过从不会切换被经过的操作。
- **FR5 — 手指与笔，同一条目标规则。** 在触摸呈现下，该行为适用于手指和笔；鼠标按压按 FR1 所述执行。在跟踪期间，组在其元素上保留一个 `pointerdown` 监听器，在成员需要的地方可取消，仅在按压期间添加文档监听器并在释放时移除，并可能从释放到该手势的点击期间启用一个每文档的点击吞噬器；除此之外没有其他空闲（`spec:AST-094` FR19、FR24）。44 px 目标仅是在粗略指针下每个成员的命中扩展。键盘和辅助技术行为不变。

## Allowed component variation

- 操作在激活时做什么，以及成员如何显示其高亮，由该成员决定。
- 菜单保留自己的打开和移交（`spec:AST-094` FR29）、其在每种指针下的按压和拖动，以及其滚动规则；FR1 的触摸范围和 FR5 不会改变它们。
- Selector 和 MultiSelector 的选项保留菜单按压模型在每种指针下的按压和拖动（`component:Selector` FR7）；FR1 的触摸范围和 FR5 不会改变它们。
- 滚轮是滚动容器：拖动会滚动它，与今天一样；点击会作用于其下方的选项；只有不滚动的按压才会跟踪。

## Representative matrix

| 成员与状态                   | 共享不变量                               | 刻意差异                       |
| ---------------------------- | ---------------------------------------- | ------------------------------ |
| DropdownMenu / 从行到行滑动  | 抬起的行起作用；一次只有一行亮起         | 打开和移交保留为菜单的（FR29） |
| AlertDialog / 从 Cancel 滑动 | 抬起的操作运行；在外部抬起不执行任何操作 | 操作的顺序和堆叠保持局部       |
| ToggleButtonGroup / 滑过三个 | 只有抬起的切换改变                       | 单选或多选保持为该组的         |
| Toolbar 带字段 / 滑过        | 按钮跟踪；字段被跳过                     | 工具栏持有哪些控件保持局部     |

## Adoption and exceptions

| 组件或表面                                                                              | 所需采用                                                       |
| --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| 菜单以及 Selector 和 MultiSelector 的选项                                               | 通过 `module:DropdownMenu/useMenuPress` 遵循 FR1–FR5。         |
| TopNav、SideNavHeading、TopNavHeading、NavHeadingMenu、BreadcrumbItem 和 TabMenu 的菜单 | 作为菜单通过 `module:DropdownMenu/useMenuPress` 遵循 FR1–FR5。 |
| 日期和时间滚轮                                                                          | 通过共享实现遵循 FR1–FR5。                                     |
| AlertDialog 的操作                                                                      | 仅跟踪操作。                                                   |
| ButtonGroup、ToggleButtonGroup、Toolbar                                                 | 跟踪同级按钮；内部的字段被跳过；切换遵循 FR4。                 |
| DateRangeInput 的预设                                                                   | 仅跟踪预设按钮。                                               |
| Banner 和 Toast 操作行                                                                  | 仅跟踪有两个或更多同级操作的行。                               |

这些是必需的结果，而不是已完成采用的声明。成员资格规则下列出的被排除组件不是需要批准的例外；它们在本家族之外。

## Verification map

| 契约    | 验证                                           | 代表性成员与状态                                           |
| ------- | ---------------------------------------------- | ---------------------------------------------------------- |
| FR1–FR3 | 共享实现测试和每个成员的指针流测试             | 滑过菜单、AlertDialog 的操作、一个 ButtonGroup；在外部抬起 |
| FR4     | ToggleButtonGroup 指针流测试                   | 滑过三个切换；只有抬起的一个切换                           |
| FR5     | 使用鼠标、笔、手指、键盘和屏幕阅读器的成员测试 | 仅在粗略指针下的 44 px 目标；不变的键盘和屏幕阅读器路径    |

## Decision links

- `spec:AST-094/DEC-17` — 每一组同级操作都以相同方式跟踪持有的指针。

### DEC-1 — The slide across actions is for touch only

**决策者：** `cixzhang`，`2026-11-03`

滑过按压仅在触摸呈现下运行。桌面鼠标按压的行为与原生按钮相同：只有被按下的操作激活，不会拖动经过其他操作。

已拒绝：每种指针。

## Open questions

无。

## Content boundary

本文件拥有操作组成员资格以及共享的按压、滑动和抬起行为。它不复制组件 prop 表、每个操作做什么、菜单打开或共享实现的阈值。
