---
schema_version: 3
template_version: 7
kind: component
id: component:LayoutPanel
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layout/LayoutSlots.test.tsx,
    packages/core/src/Layout/__tests__/nestedPadding.test.tsx,
    packages/core/src/Layout/__tests__/LayoutPanelAudit.a11y.chromium.spec.ts,
    packages/core/src/Layout/__tests__/Layout.a11y.test.tsx,
    packages/core/src/Layout/__tests__/Layout.a11y.chromium.spec.ts,
    packages/core/src/hooks/useScrollRegionProps.test.tsx,
    packages/core/src/hooks/__tests__/scrollRegionName.a11y.chromium.spec.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:layout-regions]
design_specs: []
architecture:
  [
    architecture:container-padding,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-105]
---

# LayoutPanel component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `children`、`width`、`resizable`、`hasDivider`、`isScrollable`、`padding`、`label`、`role`、根 `BaseProps`，以及根 `ref`。                                                        |
| 行为          | 位于逻辑起点或逻辑终点的固定宽度侧边区域，默认滚动，其面向内容的边缘上可有分隔线。                                                                                                |
| 最终用户影响  | 用户看到的是一个保持自身宽度的侧边面板，它独立滚动，并在从右到左书写时镜像到另一侧。                                                                                              |
| 构建者影响    | `resizable` 可直接接收 useResizable 的输出，或像以前一样接收其 `props`（FR8）；可折叠的可调整大小面板会滑动，滚动面板会获得角色和名称，且无需改动代码。                           |
| 兼容性/就绪度 | `resizable` 也接受 useResizable 的输出（FR8）。折叠的面板会滑动（FR7），将焦点移出并进入 inert（AR2），滚动面板会获得名称（AR3）。补丁：`[feat]` 类型与滑动，`[fix]` 焦点与名称。 |
| 审查检查项    | 拒绝外边缘上的分隔线、会收缩的面板、推断出的地标、`width` 压过 `resizable`，或进一步的发布不一致。                                                                                |
| 治理规则      | `family:layout-regions` FR1、FR2、FR4–FR8、FR10；`architecture:container-padding`；`architecture:public-component-api` INV5–INV8。                                                |

本表格是审查投影；以下正文具有权威性。

## Intent

LayoutPanel 是调用方放在 Layout 的 `start` 或 `end` 槽位中的侧边区域。它负责面板的宽度、内缩、滚动、分隔线以及调用方提供的地标语义；调用方负责其内容。

使用方语法与示例见 `LayoutPanel.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认行为：`yes` —— 无分隔线、可滚动、自动内缩、内容宽度。
- 兼容性类别：patch。`resizable` 也接受 useResizable 的输出（FR8，`[feat]`）；其他公共 prop、target 或样式输出均无变化，省略的 props 行为与以前一致。可折叠的可调整大小面板现在会滑动（FR7，`[feat]`，在 `spec:AST-017/DEC-17` 下仅为视觉变化），其内部的焦点会移到相邻的 ResizeHandle，同时折叠的面板变为 inert（DOM：`inert` 与 `aria-hidden`；AR2，`spec:AST-017` FR53 下的 `[fix]`）。在滚动时，没有调用方 `role` 的面板会获得 `role="group"` 和 `aria-label`（DOM；AR3，`spec:AST-017` FR53 下的 `[fix]`）。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明见使用方文档与发布说明。

## Current-state impact

- **两个分隔线所有者可能绘制同一条边界（FR4）。** 带有 `hasDivider` 的面板紧邻绘制同一条线的 ResizeHandle 时会绘制两次边界；没有任何机制阻止这一情况，因此当 ResizeHandle 拥有该线时，调用方应保持 `hasDivider={false}`（`family:layout-regions` FR5）。

## Ownership boundary

**拥有**

- 面板根，它承载 `component:Layout` 所映射的 `layout-panel` target。
- 面板宽度、内缩、滚动、分隔线，以及调用方提供的角色与标签。

**不拥有 / 非目标**

- 槽位放置与 Layout 边缘内缩——由 `component:Layout` 拥有。
- 调整大小的交互与调整大小手柄——由 useResizable 和 ResizeHandle 拥有（`family:layout-regions` FR10）。
- 面板内容及其含义——由调用方拥有。

## Public concepts

| 概念       | 封闭取值或状态                       | 含义                                               | 按变体/方向/状态的可达性 | 默认值   | 所有者                  | 稳定性 | 无效值行为                   |
| ---------- | ------------------------------------ | -------------------------------------------------- | ------------------------ | -------- | ----------------------- | ------ | ---------------------------- |
| 宽度       | number（px）；CSS 长度字符串；未设置 | 面板的行内尺寸。                                   | 始终                     | 内容宽度 | `component:LayoutPanel` | 稳定   | —                            |
| 可调整大小 | 来自 useResizable 的值               | 提供一个可调整大小的宽度，优先于 `width`。         | 始终                     | 无       | `component:LayoutPanel` | 稳定   | —                            |
| 分隔线     | `true`、`false`                      | 在面板面向内容的边缘上绘制一条线。                 | 起点或终点槽位           | `false`  | `component:LayoutPanel` | 稳定   | —                            |
| 滚动       | `true`、`false`                      | 溢出时滚动，或将其裁剪。                           | 始终                     | `true`   | `component:LayoutPanel` | 稳定   | —                            |
| 内缩       | 间距步长；`0`；未设置                | 取代自动内缩的统一内边距；`0` 表示满出血。         | 始终                     | 自动     | `component:LayoutPanel` | 稳定   | 封闭联合类型；会被类型拒绝。 |
| 地标       | 调用方的 `role` 与 `label`           | 按调用方指定的角色暴露该面板，并使用该可访问名称。 | 始终                     | 无       | 调用方                  | 稳定   | —                            |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 依据                                                                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| FR1 | LayoutPanel 渲染一个 `div`，它携带 `layout-panel` target，不收缩，并直接容纳子元素。`width` 设置其行内尺寸，数字按像素处理；`resizable` 值的大小优先于 `width`。它默认滚动溢出内容；`isScrollable={false}` 将其裁剪。                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试；`family:layout-regions` FR7、FR10                       |
| FR2 | 在 `start` 槽位中，面板面向内容的边缘是其行内终点；在 `end` 槽位中是其行内起点；两者都遵循书写方向。                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试；`family:layout-regions` FR2                             |
| FR3 | 未提供 `padding` 时，面板的外侧行内边缘使用 Layout 边缘内缩，紧邻处没有页眉或页脚的行块边缘使用 Layout 边缘内缩，其他边缘使用内部内缩；其中 Layout 边缘内缩来自 Layout 的 `padding`，否则来自最近的 padding 容器，内部内缩来自最近的 padding 容器（Card、Section、Dialog、Drawer 或 BottomSheet），否则每个间距步长为 4。`padding` 步长替换全部四条边缘，`0` 则移除它们。面板发布与其所应用的内边距相等的 container-padding 值，因此满出血子元素会与其外侧边缘对齐。                                                                                              | 当前源码；`family:layout-regions` FR4；`architecture:container-padding` |
| FR4 | `hasDivider` 在面向内容的边缘上绘制一条 1px 实线的 `--color-border` 线；LayoutPanel 不读取 Layout 的分隔线默认值。没有分隔线且使用自动内缩时，面板按内部内缩与内容区域重叠，使两者共享一个间隙。一条边界只有一个分隔线所有者（`family:layout-regions` FR5）。实现缺口：没有任何机制阻止面板分隔线与相邻 ResizeHandle 的线同时绘制（当前状态影响）。                                                                                                                                                                                                               | 当前源码与文档；`family:layout-regions` FR5、FR6                        |
| FR5 | `role` 与 `label` 设置根的 `role` 与 `aria-label`；LayoutPanel 仅在自身滚动时添加角色和名称（AR3）。                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试；`family:layout-regions` FR8                             |
| FR6 | `ref` 到达根。受支持的 DOM、data、ARIA 和事件 props 在组件自身属性之后到达根；`xstyle`、`className` 和 `style` 在组件样式之后组合。                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试；`architecture:public-component-api` INV5–INV8           |
| FR7 | 尺寸来自 resize 控制器的 LayoutPanel 通过内部通道把其元素借给其面向内容边缘上 ResizeHandle 的控制器，因此当它所在区域折叠或打开时，面板按 `spec:AST-105` FR9 的边缘揭示滑动关闭和打开：其面向内容的边缘（FR2）移动，该边缘一侧的内容以同一动效移动（`component:Resizable` FR8）。以配置对象形式给出的面板、通过 `resizable` 传入的并非 `useResizable` 返回的手工构造 `ResizableProps` 对象，以及没有 resize 控制器的面板，都不会滑动；通过 `resizable` 传入的 `useResizable` 自身 `props` 会滑动。LayoutPanel 不新增 prop。处于区域尺寸并紧邻该手柄的面板不滑动。 | `spec:AST-105` FR9；`component:Resizable` FR8                           |
| FR8 | `resizable` 直接接收 useResizable 的输出；区域的 `props` 仍被接受（所有者决策，2026-11-04）。面板通过该槽位 prop 取得 hook 的值（所有者决策，2026-11-04）。                                                                                                                                                                                                                                                                                                                                                                                                       | `component:Resizable` FR9；`architecture:public-component-api` INV21    |

### Allowed variation

- **AV1 — 内容。** 任何调用方内容都可填充面板。
- **AV2 — 位置。** 调用方将面板放在起点、终点或两者。

### Representative states

| 状态       | 必需不变式                                                                      | 允许的变化                                     |
| ---------- | ------------------------------------------------------------------------------- | ---------------------------------------------- |
| 起点面板   | 分隔线与共享间隙位于行内终点边缘。                                              | 宽度。                                         |
| 终点面板   | 分隔线与共享间隙位于行内起点边缘。                                              | 宽度。                                         |
| 从右到左   | 起点与终点镜像。                                                                | —                                              |
| 可调整大小 | 可调整大小的尺寸设置宽度。                                                      | 尺寸。                                         |
| 折叠       | 面板从其面向内容的边缘滑动关闭；其内部焦点移到 ResizeHandle；随后它变为 inert。 | 起点或终点；减少动效；不带滑动的配置对象形式。 |
| 导航地标   | 根上有 `role="navigation"` 和调用方的名称。                                     | 名称。                                         |

### Transformation and precedence order

- **ORD1 — 宽度。** `resizable` 尺寸 → `width` → 内容宽度。
- **ORD2 — 内边距。** `padding` → 每条边缘的自动内缩。

### Performance and resources

- **PR1 — 无外部生命周期。** LayoutPanel 读取其槽位以及其 Layout 填充了哪些槽位。它自身不添加监听器、观察器、定时器或测量，唯一的例外是 AR3 在其可能滚动时对溢出的观察；滑动的测量由 resize 控制器完成（FR7）。

## Accessibility contract

- **AR1 — 仅显式地标。** 只有当调用方提供 `role` 时，面板才是地标，并且仅以调用方的 `label` 命名（`family:layout-regions` FR8）。
- **AR2 — 焦点离开折叠面板。** 当面板所在区域折叠而焦点位于面板内部时，在任何 resize 控制器下（包括配置对象形式（FR7）），焦点会移到面板面向内容边缘上相邻的 ResizeHandle，即再次打开它的控件；随后折叠的面板变为 inert 与 `aria-hidden`，直到它打开（`spec:AST-105` FR9）。打开不会移动焦点。从手柄或面板外部控件发起的折叠会将焦点留在原处。只有滑动（FR7）排除配置对象形式。
- **AR3 — 滚动面板有名称。** 面板滚动时，其滚动元素具有 `role="group"`（除非调用方设置了 `role`）和一个可访问名称（调用方的 `label`，或经翻译的“Content”），因此到达它的屏幕阅读器会朗读它，包括作为浏览器生成的 Tab 停靠点；Tab 行为由浏览器决定（所有者决策，2026-11-04）。调用方的 `role` 只采用调用方的 `label`（AR1）。在浏览器不为其创建 Tab 停靠点的情况下，内容中没有任何可聚焦元素的滚动区域无法通过键盘滚动。此时调用方应添加可聚焦子元素，或使用 ScrollableArea。

## Design relationships

| 解剖或状态 | 设计要求                             | 表现权威       | 层级角色 | 组件契约 |
| ---------- | ------------------------------------ | -------------- | -------- | -------- |
| 面板       | 带可选面向内容分隔线的固定侧边区域。 | 当前源码与文档 | 支撑     | FR1–FR4  |

主题：根承载 `layout-panel` target，`Layout.doc.mjs` 声明它，`component:Layout` 映射它。`LayoutPanel.doc.mjs` 不声明自身的解剖结构，因此此处不声明解剖主题块。

## Family and system relationships

- `family:layout-regions` 拥有区域方向、内边距替换、边界所有权、分隔线间距、滚动、地标以及 resize 委托；FR1–FR5 和 AR1 应用它们。
- `spec:AST-105` FR9 拥有 FR7 所播放的边缘揭示，以及 AR2 所应用的焦点规则；`component:Resizable` FR8 拥有它何时播放。
- `architecture:container-padding` 拥有内缩发布；FR3 应用它。
- `component:Layout` 拥有槽位放置、Layout 边缘内缩以及 `layout-panel` target 映射。

## Verification map

| 契约      | 验证                                                                                                                                                           | 代表状态                                                            | 变异或失败预期                                                                                                                                                                                                    | 审计小节                          |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1, ORD1 | `LayoutSlots.test.tsx` 的 class、宽度与可调整大小测试；`collapsedPanel.interaction.browser.spec.ts` 针对宽度 0                                                 | 数字、字符串与零宽度；可调整大小；已折叠区域                        | 丢失 `layout-panel` class、缺少宽度，或 `width` 压过 `resizable` 会失败。缺口：不收缩的根、滚动以及 `isScrollable={false}` 没有检查。没有需求或检查覆盖键盘用户在面板不含可聚焦内容时如何到达滚动面板的溢出内容。 | `audit:LayoutPanel/layout`        |
| FR2       | `LayoutSlots.test.tsx` 的起点与终点槽位测试；`Layout.a11y.chromium.spec.ts` 的 `start-end-navigation-rtl` 状态                                                 | 起点与终点面板；从右到左                                            | 无法在任一槽位渲染的面板会失败。缺口：没有检查断言哪条边缘承载分隔线或共享间隙。                                                                                                                                  | `audit:LayoutPanel/layout`        |
| FR3, ORD2 | `nestedPadding.test.tsx` 的 LayoutPanel 发布测试；`LayoutPanelAudit.a11y.chromium.spec.ts` 的内缩与满出血回执                                                  | 自动、显式与零内边距                                                | 发布的边缘与面板所应用的内边距不同、边缘内缩错误，或满出血子元素未触及面板的外边缘会失败。                                                                                                                        | `audit:LayoutPanel/layout`        |
| FR4       | 源码审查                                                                                                                                                       | `hasDivider`；无分隔线                                              | 缺口：没有测试覆盖分隔线、共享间隙，或紧邻 ResizeHandle 的面板分隔线。                                                                                                                                            | `audit:LayoutPanel/layout`        |
| FR5, AR1  | `LayoutSlots.test.tsx` 的地标测试；`Layout.a11y.test.tsx` 与 `Layout.a11y.chromium.spec.ts` 的 `start-end-navigation-rtl` 和 `nested-panel-region` 状态        | 调用方的 `navigation` 与 `region` 角色及标签                        | 丢失角色或名称会失败，包括在可访问性树上。缺口：没有测试断言没有 `role` 的面板不暴露任何地标。                                                                                                                    | `audit:LayoutPanel/accessibility` |
| FR6       | `LayoutSlots.test.tsx` 的 ref 与 className 测试                                                                                                                | Ref；调用方 class                                                   | 位于其他元素的 ref 或丢失的 class 会失败。缺口：没有测试覆盖 `style`、DOM、data 或事件 props，或 `xstyle` 的合并顺序。                                                                                            | `audit:LayoutPanel/api`           |
| FR7, AR2  | `paneSlide.interaction.browser.spec.ts`：起点与终点面板在焦点位于内部时的折叠与打开，分别使用 hook 自身的值与手工构造的值                                      | 起点与终点；切换、Enter 以及拖过阈值；配置对象形式；减少动效        | 跳变而非滑动、移动边缘旁的间隙、配置对象形式下的滑动、焦点留在折叠面板中、折叠面板可被 Tab 到达或暴露给辅助技术，或新增 prop 都会失败。                                                                           | `audit:LayoutPanel/behavior`      |
| AR3       | `useScrollRegionProps.test.tsx` 的 LayoutPanel 测试；`scrollRegionName.a11y.chromium.spec.ts` 的 `panel-scrolls`；`collapsedPanel.interaction.browser.spec.ts` | 滚动面板；调用方的 `navigation` 角色与标签；折叠到宽度 0 的滚动面板 | 面板溢出时缺少 group 角色或名称会失败，在 Chromium 的可访问性树上也是如此；丢失调用方的角色或标签会失败。宽度为 0 时仍保留 group 角色会失败。                                                                     | `audit:LayoutPanel/accessibility` |
| PR1       | 源码审查                                                                                                                                                       | 每个状态                                                            | 缺口：如果 LayoutPanel 添加监听器、定时器或测量，没有自动检查会失败。                                                                                                                                             | `audit:LayoutPanel/behavior`      |
| RTL 关系  | 在 `Content width with start panel` 故事上策划的 RTL 审计 D2 目标（`apps/storybook/rtl-audit/targets.json`）                                                   | 内容旁的起点面板；LTR 与 RTL                                        | 在两种方向上未处于内容行内起点的起点面板会失败 D2。                                                                                                                                                               | `audit:LayoutPanel/i18n-rtl`      |
| FR8       | `resizableSlot.test.tsx` 的区域与 `props` 用例                                                                                                                 | 区域；其 `props`                                                    | 忽略区域尺寸的面板，或折叠后仍可到达的情况会失败。                                                                                                                                                                | `audit:LayoutPanel/api`           |

## Decision log

无记录。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤、Layout 槽位规则、resize 交互或 container-padding 机制。它链接到它们的所有者。
