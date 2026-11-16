---
schema_version: 3
template_version: 7
kind: component
id: component:SideNavHeading
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/SideNav/SideNav.test.tsx,
    apps/storybook/stories/SideNav.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families:
  [
    family:navigation-destinations,
    family:overlay-dismissal,
    family:action-groups,
  ]
design_specs: []
architecture:
  [
    architecture:component-style-authoring,
    architecture:interaction-modality,
    architecture:public-component-api,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: []
---

# SideNavHeading component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 带 `icon`、`heading`、`superheading`、`subheading`、它们各自的 `*Href` 链接、`headerEndContent`、`menu` 与 `as` 的 `SideNavHeading`；目标 `side-nav-heading`。             |
| 行为          | 位于 SideNav 顶部的产品身份区块。哪些部分成为链接、哪一部分打开菜单，由 `*Href` props 与 `menu` 决定；在折叠侧栏中，它表现为仅含图标的链接、菜单按钮，或带工具提示的图标。 |
| 终端用户影响  | 在展开与折叠两种侧栏中，用户都能到达产品、套件与账户目标，以及产品菜单；屏幕阅读器用户会听到有名称的链接、有名称的触发器，以及有名称的菜单。                               |
| 构建者影响    | 无。                                                                                                                                                                       |
| 兼容性/就绪度 | 交付 FR5 会为鼠标与触控笔用户推迟首次悬停打开；无公共 API 变更。七处实现缺口（见 Current-state impact）。                                                                  |
| 审查检查      | 拒绝无名称的折叠图标、被模态对话框包裹的菜单弹层、位于 `role="menu"` 内部的标题按钮，以及渲染在整块标题链接内部的 `headerEndContent`。                                     |
| 管辖规则      | `architecture:public-component-api` INV5；`architecture:interaction-modality`；`family:navigation-destinations`。                                                          |

此表是审查投影；下文正文具有权威性。

## Intent

SideNavHeading 在 SideNav 顶部呈现产品的图标与名称，并可附带可选的套件行与账户行。它管辖这些部分如何成为链接或菜单触发器、产品菜单弹层，以及折叠侧栏形态。使用方用法见 `SideNavHeading.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`no`；交付 FR5 会为鼠标与触控笔用户推迟首次悬停打开
- 兼容性类别：记录已交付的行为，FR5 的首次打开延迟除外；无公共 API 变更
- 受控/非受控行为：菜单的打开状态是内部的
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **标题菜单进入延迟（FR5）。** 菜单在首次悬停时立即打开，没有进入延迟。FR5 要求采用共享延迟，只有在同一导航中从另一个已打开的菜单移入时才不等待。

- **部分配置丢弃 DOM 属性。** 传给 SideNavHeading 的其他 DOM props（除 `data-testid`、`className`、`style`、`xstyle` 和 `ref` 之外）在菜单配置中、以及折叠的链接与菜单按钮形态中都不落到任何元素上。`architecture:public-component-api` INV5 要求被接受的 DOM、data、ARIA 与事件输入到达其所属元素。

- **NavHeadingMenu 嵌套了第二层菜单。** 标题把 `menu` 包在自己的 `role="menu"` 中；作为文档所述 `menu` 内容的 NavHeadingMenu 又在其中加了另一个 `role="menu"`。WAI-ARIA 1.2 只允许 `menu` 拥有 `menuitem` 家族的项与组。

- **链接嵌套在弹层的标题按钮中。** 在展开态的链接加触发器配置中，弹层的标题按钮在自身内部重复了超级标题、标题与子标题链接，因此交互内容被嵌套在按钮里。HTML 禁止在 `<button>` 内放置交互内容。

- **打开的菜单重复了身份行。** 菜单打开时，其标题按钮重复了始终挂载在侧栏区块中的图标与文本，因此该内容渲染两次。`architecture:component-style-authoring` INV7 要求内容只渲染一次。

- **链接加触发器形态中的链接也会打开菜单。** 承载这些链接的区块带有菜单的触发器处理函数。使用触摸或键盘时，激活标题链接或套件链接既会导航，也会打开菜单并把焦点移到其第一项。使用鼠标时，指针移入该区块就会立即在其上方打开菜单，于是点击落在菜单的标题按钮（及其重复的链接）上，而不是落在下方的链接上。两者都破坏了 FR2 对链接与菜单触发器所做的划分。

- **结束内容也会打开菜单。** 在两种菜单配置中，`headerEndContent` 都渲染在承载菜单触发器处理函数的区块内部。使用触摸或键盘时，激活其中的某个控件会运行该控件，同时也会打开菜单并把焦点移到其第一项。使用鼠标时，指针移入链接或结束内容就会立即在整个区块上方打开菜单，于是点击结束内容会落在菜单的标题按钮上，菜单在指针下方重新打开。结束内容中的控件属于调用方，不在 FR2 的触发器区域之内。

## Ownership boundary

**拥有**

- 身份区块及其链接与触发器配置（FR1–FR4、FR11）。
- 产品菜单弹层（FR5–FR7）。
- 折叠侧栏形态（FR8）与焦点轮廓（FR9）。

**不拥有 / 非目标**

- 目标的接受与阻止——由 `family:navigation-destinations` 管辖。
- 菜单内容——由调用方（通常是 NavHeadingMenu）管辖。
- 侧栏的折叠状态——由 SideNav 管辖。

## Public concepts

| 概念 | 封闭取值或状态                                                             | 含义                                     | 按变体/方向/状态的可获得性 | 默认   | 归属                       | 稳定性 | 无效值行为 |
| ---- | -------------------------------------------------------------------------- | ---------------------------------------- | -------------------------- | ------ | -------------------------- | ------ | ---------- |
| 配置 | 纯文本、整块链接、带结束内容的整块链接、独立链接、整块触发器、链接加触发器 | 由 `*Href` props 与 `menu` 推导（FR2）。 | 展开侧栏。                 | 纯文本 | `component:SideNavHeading` | 稳定   | 不适用。   |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 依据              |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| FR1  | 在展开侧栏中，该区块带有 `side-nav-heading`，并显示图标、文本列（超级标题、标题行、子标题；纯文本行与菜单配置下的标题链接保持单行并用省略号截断，而通过 Link 组件渲染的行会换行）以及 `headerEndContent`。有 `menu` 时，标题行先放标题、再放 chevron 按钮；无 `menu` 时没有 chevron。                                                                                                                                                                                  | 当前源码与测试    |
| FR2  | 仅 `headingHref` 而无 `menu` 时，图标与文本合为一个链接；有 `headerEndContent` 时，该内容位于链接旁边，而非链接内部。无 `menu` 时，其他 `*Href` props 使每个带 href 的行各自成为独立链接，带链接的图标以 `heading` 命名。无 href 的 `menu` 使整个区块（`headerEndContent` 除外）打开菜单；有 href 的 `menu` 使每个带 href 的行各自成为独立链接，并由 chevron 按钮与区块其余部分（`headerEndContent` 除外）打开菜单。                                                   | 当前源码与测试    |
| FR3  | 图标链接、整块标题链接与菜单配置下的标题链接使用 `as` 指定的组件，否则使用 `LinkProvider` 的链接，否则使用 `<a>`。辅助行以及独立链接配置中的标题行使用 Link 组件，该组件不接收 `as`。                                                                                                                                                                                                                                                                                  | 当前源码与测试    |
| FR4  | chevron 按钮由 `@astryx.sideNav.heading.openMenu` 命名，并且是弹层的触发器。                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与测试    |
| FR5  | 在支持悬停的指针上，首次悬停打开会等待菜单悬停延迟（默认 150 ms，与 `TopNavMenu` 一致），而从同一导航中另一个已打开的菜单移入时会立即打开（`architecture:interaction-modality` INV11；所有者决定，2026 年 11 月 6 日（Cindy）；提议于 `design:motion` DEC-1）。悬停打开不移动焦点。点击会打开它并把焦点移到第一个菜单项；悬停打开后 500 ms 内的点击会使其保持打开；Escape 关闭它并把焦点返回触发器。                                                                   | Cindy, 2026-11-06 |
| FR6  | 菜单是位于区块下方、与其起始端对齐的非模态弹层；在展开侧栏中它与该区块重叠。它包含一个关闭菜单的标题按钮（其内容见 Current-state impact），随后是由 `heading` 命名、容纳 `menu` 的 `role="menu"`。                                                                                                                                                                                                                                                                     | 当前源码与测试    |
| FR7  | 只有折叠的菜单形态会向 `menu` 的后代提供 NavMenu 项在选中时调用的关闭动作；展开的菜单形态不提供。                                                                                                                                                                                                                                                                                                                                                                      | 当前源码          |
| FR8  | 在折叠侧栏中，没有 `icon` 时不渲染任何内容。有 `icon` 时：`headingHref` 使其成为由 `heading` 命名的仅含图标链接；否则 `menu` 使其成为由 `heading` 命名的仅含图标按钮，且该按钮是其菜单弹层的原生调用器；否则图标单独渲染。每种形态都在行内末端显示带 `heading` 的工具提示；`headerEndContent` 与 chevron 隐藏。                                                                                                                                                        | 当前源码与测试    |
| FR9  | 每个可聚焦部分都绘制共享的焦点轮廓。                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试    |
| FR10 | 在产品菜单的 `role="menu"` 区域内，一次按压（手指、触控笔或鼠标）落在启用的项上并在各项之间滑过时，通过该项自身的激活动作一次，高亮跟随指针；在区域外抬起不触发任何项，鼠标在外部释放会关闭菜单。菜单为此采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。按在非项内容的调用方内容上，以及对链接项使用 Ctrl、Cmd 或 Shift 点击或中键点击时，仍属于该内容或浏览器自身，键盘与辅助技术行为保持不变。 | 当前源码与测试    |
| FR11 | 在两种菜单配置中，chevron 按钮的可访问名称都包含可见的 `heading`，因此凭所见产品或工作区名称识别该控件的人会听到该名称（`family:buttons` FR1；WCAG 2.2 Label in Name）。该名称是一条已翻译的消息 `@astryx.sideNav.heading.openMenu`，它接收 `heading`：标题为 “Acme” 时英文为 “Acme, Open menu”。每个已发布语言区域的消息都原样保留 `{heading}`。                                                                                                                      | 当前源码与测试    |

### Allowed variation

- **AV1 — 行组合。** 行的任意组合都可以存在；区块保持其顺序。

### Representative states

| 状态               | 必需的不变式                           | 允许的变化 |
| ------------------ | -------------------------------------- | ---------- |
| 整块链接加结束内容 | 结束内容位于链接旁边。                 | —          |
| 菜单，无 href      | 整个区块触发；有名称的 chevron 按钮。  | 菜单内容。 |
| 菜单，有 href      | 链接；chevron 与区块其余部分触发。     | —          |
| 折叠且有菜单       | 有名称的图标按钮；飞出菜单；工具提示。 | —          |
| 折叠且无图标       | 不渲染任何内容。                       | —          |

### Transformation and precedence order

- **ORD1 — 折叠形态。** `headingHref`，然后 `menu`，然后纯图标。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 有名称的图标。** 没有可见文本的链接图标或按钮图标由 `heading` 命名。
- **AR2 — 菜单语义。** 弹层不是模态对话框；`role="menu"` 只包裹菜单内容。

## Design relationships

| 结构或状态 | 设计要求                       | 表征权威           | 层级角色 | 组件契约 |
| ---------- | ------------------------------ | ------------------ | -------- | -------- |
| 图标       | 前置产品标记；折叠时单独呈现。 | 当前源码与公开文档 | 突出     | FR1, FR8 |
| 标题行     | 超级标题、标题、子标题。       | 当前源码与公开文档 | 突出     | FR1      |
| 菜单弹层   | 与区块重叠；标题按钮可关闭它。 | 当前源码           | 支撑     | FR6      |

`SideNavHeading.doc.mjs` 未声明自身的结构，因此未记录结构主题化映射。

## Family and system relationships

- `family:overlay-dismissal` 管辖此组件弹层的 Escape 与关闭请求顺序。
- `family:navigation-destinations` 管辖每个 `href` 的接受/阻止决策。
- 在提供关闭动作的地方，NavHeadingMenu 项会关闭此菜单（FR7）。

## Verification map

| 契约         | 验证                                                                                                                                                                                                                                                             | 代表性状态                                                     | 变异或失败预期                                                                          | 审计小节                             |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------ |
| FR1–FR4, AR1 | `SideNav.test.tsx` 中的 SideNavHeading 与 headerEndContent 测试套件                                                                                                                                                                                              | 每种配置                                                       | 元素错误、链接无名称或结束内容位置错误都失败。                                          | `audit:SideNavHeading/behavior`      |
| FR5          | `SideNav.test.tsx` 的 SideNavHeading 悬停/点击守卫套件。证据缺口：没有针对首次打开延迟或移交的测试                                                                                                                                                               | 悬停、点击、延迟点击、Escape                                   | 守卫丢失或焦点返回失效都失败。                                                          | `audit:SideNavHeading/behavior`      |
| FR6, AR2     | `SideNav.test.tsx` 的菜单弹层语义套件                                                                                                                                                                                                                            | 整块触发；混合；折叠                                           | 对话框包裹或菜单 role 位置错误都失败。                                                  | `audit:SideNavHeading/accessibility` |
| FR8          | `SideNav.test.tsx` 的 SideNavHeading 折叠套件                                                                                                                                                                                                                    | 链接、菜单、纯图标、无图标                                     | 缺少名称、工具提示或调用器都失败。                                                      | `audit:SideNavHeading/behavior`      |
| FR9          | `SideNav.test.tsx` 的焦点环套件                                                                                                                                                                                                                                  | 整块标题链接、折叠链接、菜单触发器                             | 缺少共享焦点环类都失败。                                                                | `audit:SideNavHeading/accessibility` |
| FR10         | `SideNav.test.tsx` 的 SideNavHeading 菜单弹层套件（触摸与鼠标滑动）                                                                                                                                                                                              | 触摸与鼠标跨项滑动；一个调用方按钮与链接；在外部释放           | 移除该采用会使滑动测试失败。                                                            | —                                    |
| FR11         | `SideNav.test.tsx` 的 SideNavHeading 用例 “includes the visible heading in the menu trigger name without hrefs”、“includes the heading in the translated menu trigger name”（韩语目录）与 “renders chevron as separate trigger when menu and hrefs are provided” | 整块触发；链接加触发器；一个已翻译语言区域                     | 名称不含 heading，或翻译后的名称丢弃了它，都失败。                                      | `audit:SideNavHeading/accessibility` |
| RTL relation | RTL 审计在 `SideNav / Default` 上策划的 D2 与 D8 目标（`apps/storybook/rtl-audit/targets.json`）                                                                                                                                                                 | 标题图标与标题文本，起始内边距 0px、末端内边距 8px；LTR 与 RTL | 图标不在标题的行内起始处，或末端内边距在 RTL 中仍留在同一物理侧，都会使 D2 或 D8 失败。 | `audit:SideNavHeading/i18n-rtl`      |

仅从源码读取，尚无专门的测试：

- FR1：转发的 `ref`、`side-nav-heading` 目标、各部分的顺序，以及单行截断。
- FR2：在链接加触发器配置中，区块其余部分会打开菜单。
- FR3：图标链接与菜单配置标题链接上的 `as`，以及其他行使用的 Link 组件。
- FR5：点击守卫、Escape 与焦点返回。其首次打开延迟是一处实现缺口。
- FR6：弹层的位置与菜单的名称。
- FR7；FR8 在行内末端的工具提示位置；以及 FR9 在弹层的标题按钮与链接图标上的表现。

## Decision log

没有记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例或弹层机制。它链接到它们的归属者。
