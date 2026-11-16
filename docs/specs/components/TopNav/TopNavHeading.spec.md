---
schema_version: 3
template_version: 7
kind: component
id: component:TopNavHeading
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TopNav/TopNav.test.tsx,
    apps/storybook/stories/TopNav.stories.tsx,
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

# TopNavHeading component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 带有 `logo`、`logoLabel`、`heading`、`superheading`、`subheading` 及其 `*Href` 链接、`headerEndContent`、`menu` 和 `as` 的 `TopNavHeading`；目标为 `top-nav-heading`。 |
| 行为          | 产品身份区块。哪些部分成为链接、哪一部分打开菜单，取决于设置了哪些 `*Href` 属性以及 `menu`（FR2）。                                                                    |
| 最终用户影响  | 用户可以到达产品、套件与账户目的地，以及产品切换器菜单；屏幕阅读器用户会听到有名称的 logo 链接和有名称的菜单。                                                         |
| 构建者影响    | 无。                                                                                                                                                                   |
| 兼容性/就绪度 | 发布 FR5 会为鼠标和笔用户延迟首次悬停打开；无公共 API 变更。存在六处实现缺口（见 Current-state impact）。                                                              |
| 审查检查      | 拒绝没有无障碍名称的 logo 链接、被包装在模态对话框中的菜单弹层，或放置在 `role="menu"` 内的标题按钮。                                                                  |
| 管辖规则      | `architecture:public-component-api` INV5；`architecture:interaction-modality`（共享焦点指示器）；`architecture:component-theming-surface`。                            |

本表是审查投影；下文正文具有权威性。

## Intent

TopNavHeading 在 TopNav 的标题槽中呈现产品的 logo 与名称，并可选地呈现套件与账户行。它负责这些部分如何成为链接或菜单触发器，并负责产品菜单弹层。使用方用法见 `TopNavHeading.doc.mjs`。

## Compatibility and migration

- 保留的发布默认值：`no`；发布 FR5 会为鼠标和笔用户延迟首次悬停打开
- 兼容性类别：记录已发布的行为，但 FR5 的首次打开延迟除外；无公共 API 变更
- 受控/非受控行为：菜单的打开状态是内部的
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **标题菜单入口延迟（FR5）。** 菜单在首次悬停时即打开，没有入口延迟。FR5 要求使用共享延迟，只有在同一导航中从另一个已打开的菜单移交过来时才不等待。
- **菜单配置丢失 DOM 属性。** 当设置了 `menu` 时，传给 TopNavHeading 的其他 DOM 属性（`data-testid`、`className`、`style`、`xstyle` 和 `ref` 之外）不会到达任何元素。`architecture:public-component-api` INV5 要求已接受的 DOM、data、ARIA 和事件输入到达其所属元素。
- **浏览器默认焦点环。** 折叠箭头菜单按钮、整块标题链接、带链接的 logo、仅 logo 链接、菜单配置下的标题链接，以及弹层的标题按钮都不使用共享焦点轮廓；它们上面的键盘焦点会绘制浏览器默认焦点环。`architecture:interaction-modality` 提供了这些控件绕过的共享焦点指示器。

- **NavHeadingMenu 嵌套了第二个菜单。** 标题把 `menu` 包在自己的 `role="menu"` 中；被记录为 `menu` 内容的 NavHeadingMenu 又在其中添加了另一个 `role="menu"`。WAI-ARIA 1.2 只允许 `menu` 拥有 `menuitem` 系列条目和分组。
- **链接嵌套在弹层的标题按钮内。** 在链接加触发器的配置中，弹层的标题按钮在自身内部重复了 superheading、heading 和 subheading 链接，因此交互内容被嵌套在按钮内部。HTML 禁止在 `<button>` 内放置交互内容。
- **打开的菜单重复身份行。** 菜单打开时，其标题按钮重复了仍挂载在栏区块中的 logo 和文本，因此该内容会渲染两次。`architecture:component-style-authoring` INV7 要求内容只渲染一次。

## Ownership boundary

**拥有**

- 身份区块的布局及其链接与触发器配置（FR1–FR6、FR11）。
- 产品菜单弹层及其关闭行为（FR7–FR9）。

**不拥有 / 非目标**

- 此组件渲染的每个 `href` 的目的地接受与阻止——由 `family:navigation-destinations` 拥有。
- 菜单内容——由调用方拥有；NavHeadingMenu 条目读取此组件提供的关闭动作（NavHeadingMenu）。
- logo 图形——由调用方拥有，通常是 NavIcon。
- TopNav 的标题槽与移动栏放置——由 `component:TopNav` 拥有。
- 弹层定位与层托管——由共享弹层与层运行时拥有。

## Public concepts

| 概念 | 封闭取值或状态                                              | 含义                                               | 按变体/方向/状态的可用性 | 默认值 | 所有者                    | 稳定性 | 无效值行为 |
| ---- | ----------------------------------------------------------- | -------------------------------------------------- | ------------------------ | ------ | ------------------------- | ------ | ---------- |
| 配置 | 仅 logo、普通、整块链接、独立链接、整块触发器、链接加触发器 | 由设置了哪些 `*Href` 属性以及 `menu` 推导（FR2）。 | 全部。                   | 普通   | `component:TopNavHeading` | 稳定   | 不适用。   |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据              |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| FR1  | 根元素带有 `top-nav-heading`，并按顺序显示：logo、一个文本列（superheading、标题行、subheading；纯文本行和菜单配置下的标题链接保持在一行并显示省略号，而通过 Link 组件渲染的行会换行），以及位于行内末端的 `headerEndContent`。设置 `menu` 时，标题行先放标题再放折叠箭头按钮；未设置 `menu` 时没有折叠箭头。当起始区域拥挤时，持有独立链接的标题文本列保留其最长的单词并换行，且该行在任何链接被裁切之前先换行；没有链接的标题仍最先截断。logo 从不收缩。                                 | 当前源码与测试    |
| FR2  | 配置：没有 `heading` 也没有 `menu` → 仅 logo，当设置了 `headingHref` 时是由 `logoLabel` 命名的链接，否则是一个 `div`；只有 `headingHref` 而没有 `menu` → 整个区块是一个链接；有其他 `*Href` 属性而没有 `menu` → 每一行带 href 的内容各自成为链接，带链接的 logo 由 `logoLabel` 命名，否则由 `heading` 命名；有 `menu` 但没有任何 href → 整个区块打开菜单；有 `menu` 且有 href → 链接保持独立，折叠箭头按钮和区块其余部分打开菜单；其他情况为普通 `div`。                                   | 当前源码与测试    |
| FR3  | logo 链接、整块标题链接、仅 logo 链接，以及菜单配置下的标题链接使用 `as` 组件，否则使用 `LinkProvider` 链接，最后是 `<a>`。辅助行，以及独立链接配置中的标题行，使用 Link 组件，该组件不接收 `as`。                                                                                                                                                                                                                                                                                         | 当前源码与测试    |
| FR4  | 在两种菜单配置中，折叠箭头都是一个按钮，其名称来自已翻译的 `@astryx.topNav.heading.openMenu`，用于切换菜单；它至少为 28 × 28 px。                                                                                                                                                                                                                                                                                                                                                          | 当前源码与测试    |
| FR5  | 在支持悬停的指针上，对区块的首次悬停打开会等待菜单悬停延迟（默认 150 ms，与 `TopNavMenu` 一致），而从同一导航中另一个已打开的菜单移过来时立即打开（`architecture:interaction-modality` INV11；所有者决定；2026 年 11 月 6 日（Cindy）；提议于 `design:motion` DEC-1）。悬停打开不会移动焦点。在悬停打开后 500 ms 内点击会保持菜单打开并将焦点移到第一个菜单条目，之后的点击会关闭它。                                                                                                      | Cindy，2026-11-06 |
| FR6  | 在菜单配置中点击链接会导航，而不会切换菜单。                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码          |
| FR7  | 菜单是区块下方的非模态弹层，与其起始边缘对齐并覆盖它。它包含一个关闭菜单的标题按钮（其内容见 Current-state impact），然后是由 `heading`（或 `@astryx.topNav.heading.dialogLabel`）命名的 `role="menu"` 区域，用于承载 `menu`。                                                                                                                                                                                                                                                             | 当前源码与测试    |
| FR8  | Escape 关闭菜单并将焦点返回触发器。                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试    |
| FR9  | `menu` 的后代会收到一个关闭动作，NavHeadingMenu 条目在被选中时调用它。                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码          |
| FR10 | 在产品菜单的 `role="menu"` 区域中，一次落在某个已启用条目上并在条目之间滑动的按压（手指、笔或鼠标）会在抬起时通过该条目自身的激活作用一次，高亮跟随指针；在区域外抬起不作用于任何内容，鼠标在区域外释放会关闭菜单。为此菜单采用 `module:DropdownMenu/useMenuPress`（`family:action-groups` FR1–FR5；`module:DropdownMenu/useMenuPress` DEC-7）。按压调用方内容中不是条目的部分，以及对链接条目的 Ctrl、Cmd 或 Shift 点击或中键点击，仍属于该内容自身或浏览器自身，键盘和辅助技术行为不变。 | 当前源码与测试    |
| FR11 | 在两种菜单配置中，当设置了可见的 `heading` 时，折叠箭头按钮的无障碍名称会包含它，因此通过所见的产品或工作区名称来识别该控件的人会听到那个名称（`family:buttons` FR1；WCAG 2.2 Label in Name）。该名称是一条已翻译的消息 `@astryx.topNav.heading.openMenu`：对于标题“Acme”，英文中为“Acme, Open menu”。没有 `heading` 或 `heading` 为空时，它是已翻译的通用动作“Open menu”，不带分隔符。每个已发布语言区域的消息都原样携带 `{heading}`。                                                    | 当前源码与测试    |

### Allowed variation

- **AV1 — logo 图形与行。** 任意行组合都可以存在；区块保持其顺序。

### Representative states

| 状态                    | 必需的不变式                           | 允许的变化 |
| ----------------------- | -------------------------------------- | ---------- |
| 带 `headingHref` 的标题 | 一个链接包裹 logo 与文本。             | —          |
| 套件与产品链接          | 独立链接；logo 链接有名称。            | 行内容。   |
| 菜单，无 href           | 整块触发；折叠箭头按钮有名称。         | 菜单内容。 |
| 带 href 的菜单          | 链接独立；折叠箭头和区块其余部分触发。 | 菜单内容。 |
| 仅 logo 且带 href       | 链接由 `logoLabel` 命名。              | 图形。     |

### Transformation and precedence order

- **ORD1 — logo 链接名称。** 先 `logoLabel`，再 `heading`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 有名称的链接。** 没有相邻链接文本的带链接 logo 由 `logoLabel` 或 `heading` 命名。
- **AR2 — 菜单语义。** 弹出层不是模态对话框；`role="menu"` 只包裹菜单内容，绝不包裹弹层的标题按钮。
- **AR3 — 有名称的触发器。** 折叠箭头按钮有已翻译的名称，并暴露弹层的展开状态。

## Design relationships

| 结构或状态 | 设计要求                                                       | 表示权威           | 层级角色 | 组件契约 |
| ---------- | -------------------------------------------------------------- | ------------------ | -------- | -------- |
| Logo       | 前置产品标记。                                                 | 当前源码与公开文档 | 显著     | FR1、FR2 |
| 标题行     | superheading、heading、subheading；纯文本行保持在一行（FR1）。 | 当前源码与公开文档 | 显著     | FR1      |
| 菜单弹层   | 覆盖区块；一个标题按钮关闭它。                                 | 当前源码           | 辅助     | FR7      |

`TopNavHeading.doc.mjs` 没有声明自己的 anatomy，因此不记录 anatomy 主题映射。

## Family and system relationships

- `family:overlay-dismissal` 拥有此组件弹层的 Escape 与关闭请求排序。
- `family:navigation-destinations` 拥有此组件渲染的每个目的地的接受/阻止决策。
- `component:TopNav` 把标题放在其标题槽和移动栏中。
- NavHeadingMenu 条目通过提供的关闭动作关闭此菜单。
- `architecture:public-component-api` INV5 和 `architecture:interaction-modality` 管辖 Current-state impact 下的缺口。

## Verification map

| 契约              | 验证                                                                                                                                                                                                                                                                                                         | 代表性状态                                                 | 变更或失败预期                                                                             | 审计章节                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ----------------------------------- |
| FR1–FR3, AR1      | `TopNav.test.tsx` 的 TopNavHeading 渲染与 logo 名称测试                                                                                                                                                                                                                                                      | 每种配置                                                   | 错误的元素或未命名的 logo 链接会失败。                                                     | `audit:TopNavHeading/behavior`      |
| FR4, FR7, AR2–AR3 | `TopNav.test.tsx` 的菜单弹层语义测试                                                                                                                                                                                                                                                                         | 整块触发器；链接加触发器                                   | 模态包装或放错位置的菜单角色会失败。                                                       | `audit:TopNavHeading/accessibility` |
| FR5, FR8          | `TopNav.test.tsx` 的悬停/点击守卫测试。证据缺口：没有针对 FR5 首次打开延迟或移交的测试                                                                                                                                                                                                                       | 悬停打开、点击、延迟点击、Escape                           | 丢失守卫或焦点返回会失败。                                                                 | `audit:TopNavHeading/behavior`      |
| FR10              | `TopNav.test.tsx` 的 TopNavHeading 菜单弹层测试套件（触摸与鼠标滑动）                                                                                                                                                                                                                                        | 跨条目的触摸与鼠标滑动                                     | 移除该采用会让滑动测试失败。                                                               | —                                   |
| FR11              | `TopNav.test.tsx` 中的 TopNavHeading 用例“includes the visible heading in the menu trigger name without hrefs”、“includes the heading in the translated menu trigger name with independent links”和“keeps the translated generic menu trigger name when the optional heading is absent or empty”（韩语目录） | 整块触发器；链接加触发器；无标题；空标题                   | 名称中缺少标题、已翻译名称丢失标题，或没有标题时出现悬空分隔符，都会失败。                 | `audit:TopNavHeading/accessibility` |
| RTL 关系          | 在 `TopNav / Full example` 上由 RTL 审计策展的 D2 和 D8 目标（`apps/storybook/rtl-audit/targets.json`）                                                                                                                                                                                                      | 标题 logo 与标题，带 0px 起始和 8px 末端内边距；LTR 和 RTL | 未位于标题行内起始位置的 logo，或在 RTL 中仍停留在同一物理侧的内边距，会使 D2 或 D8 失败。 | `audit:TopNavHeading/i18n-rtl`      |

从源码读取、尚无针对性测试的内容：在无 href 的菜单配置中点击区块本身会打开菜单（FR2）；菜单的 `dialogLabel` 回退名称（FR7）；在链接加触发器配置中区块其余部分会打开菜单（FR2）；`top-nav-heading` 目标（FR1）；行截断、部分顺序与 `headerEndContent`（FR1）；`as` 与 `LinkProvider` 渲染（FR3）；折叠箭头按钮的尺寸（FR4）；FR6；弹层的放置（FR7）；以及 FR9。

## Decision log

没有记录组件本地的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方属性表、示例或弹层机制。它链接到它们的所有者。
