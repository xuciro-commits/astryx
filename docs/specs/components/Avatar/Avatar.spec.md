---
schema_version: 3
template_version: 7
kind: component
id: component:Avatar
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Avatar/Avatar.test.tsx,
    packages/core/src/Avatar/__tests__/AvatarLabelInName.a11y.browser.spec.ts,
    packages/core/src/AvatarGroup/AvatarGroup.test.tsx,
    packages/core/src/Layer/layerScopedContext.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Avatar.stories.tsx,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-005, spec:AST-009, spec:AST-038]
---

# Avatar component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                              |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 一个具有尺寸与形状的身份图像，带有 `src`、`fallbackSrc`、`name`、`alt`、`status`、`tooltip`，以及可选的 `href`/`as`/`target`/`rel` 或 `onClick` 交互。                                                |
| Behavior                | 头像依次显示第一个加载成功的图像、然后首字母缩写、然后默认图标；它是一个具名图像（把状态标签组合进名称）、一个链接或一个按钮，在没有名称时则是装饰性的。                                              |
| End-user impact         | 屏幕阅读器用户在一次播报中听到头像代表谁以及它的状态；键盘用户可以展开其工具提示并操作可交互头像。                                                                                                    |
| Builder impact          | 无；本记录描述的是已发布行为。                                                                                                                                                                        |
| Compatibility/readiness | 已发布行为记录为 current；没有 API、默认值或输出变化。在 Current-state impact 下列出了四个实现缺口。                                                                                                  |
| Review checks           | 否决以下情况：具名静态头像在没有调用方覆盖的情况下丢失其派生的 `role="img"`；状态标签无法被辅助技术获取；未分组静态头像的工具提示只能由指针展开；可交互头像绕过共享的目标规则进行导航。               |
| Governing rules         | `family:navigation-destinations`；`spec:AST-005`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV2,INV6`；`architecture:internationalization/INV1a`。 |

本表是审查视角的投影；下文正文才是权威。

## Intent

Avatar 用图像代表一个人或实体，在没有图像加载时用可读的替身代表。它拥有图像回退链、尺寸与形状、状态放置、可访问名称、可选的名称工具提示，以及静态、链接或按钮根元素的选择。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布行为；没有公开 prop、默认值、DOM 或样式输出变化
- 受控/非受控行为：不适用；图像失败追踪属于内部状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **调用方 `tabIndex` 在静态头像上被替换（FR9）。** 静态头像在调用方 props 之后设置自己的 `tabIndex`：当它在分组之外显示工具提示时为 `0`，否则不设。调用方的 `tabIndex` 永远不会到达它，而 `architecture:public-component-api` INV5 要求把受支持的输入送到根元素。
- **分组内可交互工具提示在重渲染后丢失（FR7、AR4）。** 在 AvatarGroup 中，一个不是该组 tab 停靠点的链接或按钮头像，在键盘焦点到达它时不再打开其工具提示——前提是发生了一次重新挂载其根元素的重渲染：新的 `status` 元素（内联 `status` prop 会在每次父组件渲染时创建一个）、变化的 `name`、`alt`、locale、调用方 ARIA 或调用方 `ref`，或者挂载之后才开启的工具提示；于是有视力的键盘用户会丢失名称工具提示（WCAG 2.2 2.1.1）。
- **小型可交互头像（AR7）。** 16 或 20px 的链接或按钮头像小于 WCAG 2.2 2.5.8 规定的 24×24 CSS 像素目标，而 AvatarGroup 中的可交互头像彼此重叠，因此它们不满足间距例外。
- **分组内静态头像工具提示（AR4）。** 在 AvatarGroup 内部，带工具提示的静态头像没有 tab 停靠点，也不是漫游焦点项，因此有视力的键盘用户无法展开其工具提示，而 WCAG 2.2 2.1.1 和 1.4.13 期望悬停内容可以从键盘到达。自定义工具提示字符串仍会作为头像的描述到达辅助技术。

## Ownership boundary

**拥有**

- 根元素、裁剪后的内容区域，以及 Photo、Initials 和 Default icon 部件。
- 回退链、尺寸与形状解析，以及状态放置。
- 可访问名称，包括组合上报的状态标签。
- 名称工具提示以及展开它的静态 tab 停靠点。
- 静态、链接或按钮根元素的选择及其 focus-visible 轮廓。
- 它在 AvatarGroup 内部的各项适配：组尺寸与形状、表面环、重叠偏移、条目标记，以及放弃自己的 tab 停靠点。

**不拥有 / 非目标**

- 状态圆点的渲染、尺寸层级、字形与标签上报——由 `component:AvatarStatusDot` 拥有。Avatar 只拥有状态槽的位置，以及上报标签如何进入其名称。
- 跨头像的堆叠、溢出与漫游焦点——由 `component:AvatarGroup` 和 `component:AvatarGroupOverflow` 拥有。
- 导航目标安全性与路由替换——由 `family:navigation-destinations` 和 `spec:AST-005` 拥有。
- 工具提示表面、放置与打开时序——由共享工具提示 hook 拥有。

## Public concepts

| Concept  | Closed values or states                                                                                                  | Meaning                                                             | Availability by variant/orientation/state | Default  | Owner              | Stability | Invalid-value behavior               |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- | ----------------------------------------- | -------- | ------------------ | --------- | ------------------------------------ |
| 尺寸     | `xsm` (20)、`sm` (24)、`md` (36)、`lg` (48)、`xl` (128)，或 16、20、24、32、36、40、48、60、64、72、96、128、144、180 px | 以 CSS 像素为单位的方形盒尺寸。                                     | 分组之外；在分组内组尺寸优先              | `md`     | `component:Avatar` | 稳定      | TypeScript 拒绝其他取值。            |
| 形状     | `circle`、`rounded`、`square`                                                                                            | 圆角半径为 `--radius-full`、`--radius-element` 或 `--radius-none`。 | 分组之外；在分组内组形状优先              | `circle` | `component:Avatar` | 稳定      | TypeScript 拒绝其他取值。            |
| 视觉     | 照片；回退照片；首字母缩写；默认图标                                                                                     | 内容区域显示什么（FR2）。                                           | 所有根元素                                | —        | `component:Avatar` | 稳定      | —                                    |
| 根元素   | 静态；链接；按钮                                                                                                         | 头像最终是哪个元素（FR6）。                                         | 由 `href` 与 `onClick` 解析得出           | `static` | `component:Avatar` | 稳定      | `href` 优先于 `onClick`。            |
| 工具提示 | 名称（默认）；自定义字符串；无                                                                                           | 在悬停与键盘焦点时展开的文本。                                      | 所有根元素                                | `name`   | `component:Avatar` | 稳定      | 空白名称或空白字符串不显示工具提示。 |
| 状态     | 节点或缺失                                                                                                               | 角落内容，通常是 AvatarStatusDot。                                  | 所有根元素与形状                          | 缺失     | `component:Avatar` | 稳定      | 假值不渲染状态槽。                   |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Basis          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| FR1 | 根元素是一个相对定位、不收缩的 inline-flex 盒，尺寸为解析出的尺寸，圆角为形状对应的半径；它带有 `avatar` 目标，该目标反映 `size` 与 `shape`。裁剪后的内容区域以相同半径填满它，并抑制文本选中。                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与测试 |
| FR2 | 内容区域在 `src` 尚未失败时显示 `src`，然后在 `fallbackSrc` 尚未失败时显示 `fallbackSrc`，然后在名称能产生首字母缩写时显示首字母缩写，否则显示一个占盒 60% 的默认人物图标。每个图像以空 `alt` 和 `object-fit: cover` 渲染。失败按来源分别追踪，因此变更过的 `src` 或 `fallbackSrc` 会被重试。                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试 |
| FR3 | 首字母缩写是 `name`（去除首尾空白后）第一个与最后一个词的首个字母、数字或 emoji，并转为大写；词首的标点会被跳过，不含上述字符的词会被丢弃，只有一个合格词时产生一个首字母，字素簇绝不会被拆分。仅含空白的名称视为缺失。首字母缩写与默认图标绘制在 `avatar-fallback` 目标上（反映 `size`），使用 `--color-neutral` 与主文本色，该组合在浅色与深色模式下对比度不低于 4.5:1，正文字族、中等字重，首字母缩写占盒的 40%。在强制颜色模式下，单独一个 Avatar 的首字母缩写与默认图标采用周围颜色（`currentColor`）：默认是强制前景色；若某个控件在其周围绘制了颜色，则采用该控件的系统色（GrayText、HighlightText）；在 AvatarGroup 内部它们保持组环上的强制前景色。 | 当前源码与测试 |
| FR4 | 真值 `status` 渲染在裁剪内容区域之外的绝对定位槽中。在圆形上，它位于圆的边缘、底部 inline-end 45° 点处居中；在其他形状上，它位于底部 inline-end 角，向外偏移自身尺寸的四分之一。放置方式在从右到左文档中镜像。                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR5 | 解析出的名称是 `alt`，否则是 `name`（空白字符串视为缺失）；当两者都存在时，与状态标签按翻译后的“{name}, {status}”组合；仅有状态标签时也能为头像命名。状态标签来自所传元素上的字符串 `label`，每次渲染都读取；也来自 AvatarStatusDot 在任意包装深度上报的标签，后者优先，并在绘制前更新根元素，无需第二次渲染。                                                                                                                                                                                                                                                                                                                                               | 当前源码与测试 |
| FR6 | `href` 渲染共享链接组件（或 `as`），并带上 `target` 与 `rel`；否则 `onClick` 渲染 `button type="button"`；否则根元素为 `div`。链接与按钮根元素带有 `data-avatar-item` 标记和共享的 focus-visible 轮廓；`onClick` 挂到链接或按钮上。在开发环境下，若一个可交互头像的唯一名称是状态标签，或者它没有名称也没有调用方的 `aria-label`/`aria-labelledby`，则记录一条警告。                                                                                                                                                                                                                                                                                         | 当前源码与测试 |
| FR7 | 工具提示在上方显示（去除首尾空白后的）自定义字符串，否则显示有意义的 `name`，在悬停与键盘焦点时展开；`tooltip={false}` 或空白结果则不显示。带工具提示且位于分组之外的静态头像获得 `tabIndex={0}`，以便键盘用户展开它。自定义字符串会在任何调用方值之后加入 `aria-describedby`；默认名称工具提示则不会，因为它重复了名称。实现缺口：一个不是该组 tab 停靠点的分组内链接或按钮头像，在重新挂载其根元素的重渲染之后，不再在焦点时打开其工具提示：新的 `status` 元素（内联 `status` prop 会在每次父组件渲染时创建一个）、变化的 `name`、`alt`、locale、调用方 ARIA 或调用方 `ref`，或者挂载之后才开启的工具提示（见 Current-state impact）。                     | 当前源码与测试 |
| FR8 | 在同一层的 AvatarGroup 内（`spec:AST-038` FR7、FR8），组的尺寸与形状优先于头像自身的 props；根元素在其盒外获得 2px 表面色环，以及组的负 inline-start 重叠；静态头像不额外添加工具提示 tab 停靠点，链接与按钮根元素保留 `data-avatar-item` 标记，从而加入组的漫游集合。位于从分组打开的悬停卡、popover 或其他层中的头像保持自身尺寸与形状，不获得环或重叠，并保留其工具提示 tab 停靠点；那里的链接或按钮头像仍带有标记，因此在该组 DOM 子树中选择带标记元素的漫游焦点仍包含它。                                                                                                                                                                               | 当前源码与测试 |
| FR9 | `ref` 到达每种变体的根元素。受支持的 DOM、ARIA、data 与事件 props 在派生 ARIA 之后到达根元素，因此调用方的 `aria-label`、`role` 或 `aria-hidden` 优先（`architecture:public-component-api` INV5）；`data-testid` 到达根元素；`xstyle`、`className` 与 `style` 在组件样式之后按该顺序合并。实现缺口：在静态根元素上，组件在调用方 props 之后设置 `tabIndex`，因此调用方的 `tabIndex` 会被替换（见 Current-state impact）。                                                                                                                                                                                                                                    | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `size` 与 `shape` 重新设置 `avatar` 样式，并按 `size` 设置 `avatar-fallback`，而不改变回退链或名称。
- **AV2 — 路由链接。** `LinkProvider` 或 `as` 组件可以在 `family:navigation-destinations` 之下替换原生锚点。

### Representative states

| State                | Required invariant                                                             | Allowed variation |
| -------------------- | ------------------------------------------------------------------------------ | ----------------- |
| 照片，具名           | 由 `alt` 或 `name` 命名的 `role="img"` 根元素；内部图像 `alt` 为空。           | 尺寸、形状。      |
| 照片加载失败         | 回退照片，然后是首字母缩写或图标；新的 `src` 会重试。                          | —                 |
| 首字母缩写           | `avatar-fallback` 上的大写首字母缩写。                                         | 名称。            |
| 未命名，无状态       | `role="presentation"` 与 `aria-hidden="true"`；默认图标；无工具提示。          | —                 |
| 具名且带状态圆点     | 名称读作“{name}, {status}”；圆点位于边缘或角落。                               | 形状、方向。      |
| 链接                 | 带标记、轮廓与 `aria-label` 的链接根元素。                                     | 路由组件。        |
| 按钮                 | 带标记、轮廓与 `aria-label` 的 `button type="button"` 根元素。                 | —                 |
| 带工具提示的静态头像 | `tabIndex={0}`；悬停与焦点时显示工具提示。                                     | 工具提示文本。    |
| 在分组内             | 组的尺寸与形状；表面环；重叠；没有自己的 tab 停靠点（工具提示存在 AR4 缺口）。 | 组重叠。          |

### Transformation and precedence order

- **ORD1 — 视觉。** `src` → `fallbackSrc` → 首字母缩写 → 默认图标。
- **ORD2 — 名称。** `alt` → `name`；然后与状态标签组合；上报标签 → 所传元素的 `label`。调用方的 `aria-label` 会替换结果。
- **ORD3 — 根元素。** `href` → `onClick` → 静态。
- **ORD4 — 尺寸与形状。** 同一层内的 AvatarGroup → 头像自身的 prop → 默认值。

### Performance and resources

- **PR1 — 名称更新无需重渲染。** 被包装的 AvatarStatusDot 上报的状态标签，或之后发生变化的状态标签，会在绘制前更新头像的名称，而不会额外渲染一次头像。

## Accessibility contract

- **AR1 — 具名图像。** 有名称的静态头像为带该名称的 `role="img"`；没有名称也没有状态标签时，则为 `role="presentation"` 并带 `aria-hidden="true"`。内部图像与默认图标是装饰性的。首字母缩写是照片的回退，因而与内部图像一样是装饰性的：每种根元素（链接、按钮、静态）都对辅助技术隐藏它们，因此可访问名称只是人物的名称，而默认名称工具提示（FR7）在悬停与焦点时显示该名称。首字母缩写由生成内容从私有的每实例 CSS 变量绘制，因此不进入可访问名称；Avatar 不为它们渲染任何公开属性。
- **AR2 — 状态到达辅助技术。** 因为 `role="img"` 根元素会剪除其后代，状态标签被组合进头像自身的名称（FR5）。
- **AR3 — 可交互根元素。** 链接与按钮根元素保留其原生角色，只接收 `aria-label`；它们绘制共享的 focus-visible 轮廓。
- **AR4 — 键盘可达的工具提示。** 头像的工具提示可以从键盘展开（WCAG 2.2 2.1.1、1.4.13）：它在键盘焦点时打开，位于分组之外的静态头像在带有工具提示期间获得一个 tab 停靠点。实现缺口：在同一层的 AvatarGroup 内部，静态头像会丢弃该 tab 停靠点，而组的漫游焦点只覆盖链接与按钮头像，因此其工具提示只在悬停时打开；并且一个不是该组 tab 停靠点的分组内链接或按钮头像，在重新挂载其根元素的重渲染之后，不再在键盘焦点时打开其工具提示：新的 `status` 元素（内联 `status` prop 会在每次父组件渲染时创建一个）、变化的 `name`、`alt`、locale、调用方 ARIA 或调用方 `ref`，或者挂载之后才开启的工具提示。

- **AR5 — 描述不重复。** 只有自定义工具提示字符串会描述根元素；默认名称工具提示不额外添加描述。
- **AR6 — 调用方 ARIA 优先。** 调用方的 `aria-label`、`role` 或 `aria-hidden` 在首次渲染以及后续状态更新时覆盖派生值。
- **AR7 — 目标尺寸。** 可交互头像的目标至少为 24×24 CSS 像素，或具有 WCAG 2.2 2.5.8 允许的间距。实现缺口：`xsm`（20px）或 16、20px 的链接或按钮头像更小，而 AvatarGroup 中的可交互头像与其相邻项重叠。

## Design relationships

| Anatomy or state | Design requirement                                | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 照片             | 人物的图像，裁剪以填满形状。                      | 当前源码与文档           | 显著           | FR1、FR2           |
| 首字母缩写       | 由名称派生的可读替身。                            | 当前源码与文档           | 显著           | FR2、FR3           |
| 默认图标         | 没有图像或名称时的通用剪影。                      | 当前源码与文档           | 辅助           | FR2、FR3           |
| 状态圆点         | 显示在底部 inline-end、裁剪区域之外的可用性状态。 | 当前源码与文档           | 辅助           | FR4、FR5、AR2      |

主题化：根元素是 `avatar` 目标，首字母缩写与默认图标的表面是 `avatar-fallback` 目标；照片继承根元素。状态圆点的目标属于 `component:AvatarStatusDot`。使用方解剖结构没有命名任何根部件，因此不声明任何解剖-主题块。

## Family and system relationships

- `family:navigation-destinations` 与 `spec:AST-005` 拥有链接根元素的目标检查；Avatar 通过共享链接组件采用它们。
- `component:AvatarStatusDot` 将其标签上报给所属 Avatar，后者将其组合（FR5）并放置槽位（FR4）。
- `spec:AST-038` 的 FR7 与 FR8 让组通过上下文携带的成员关系在层边界处终止；FR8 的尺寸、形状、环、重叠与 tab 停靠点适配只在一个层内适用，而键盘归属不变。
- `component:AvatarGroup` 向其成员提供尺寸、形状与重叠，并拥有对 `data-avatar-item` 根元素的漫游焦点（FR8）。
- `architecture:internationalization` 拥有组合名称背后的消息目录。

## Verification map

| Contract           | Verification                                                                                                                                                                                                                                              | Representative states                                                                                                 | Mutation or failure expectation                                                                                                                                                                                                                                                                                      | Audit section           |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| FR1–FR3            | `Avatar.test.tsx` 的回退、首字母缩写、重试与目标测试；在真实 Chromium 中模拟强制颜色运行的 `AvatarForcedColors.a11y.chromium.spec.ts`                                                                                                                     | 照片、失败、首字母缩写、标点、emoji、空白名称；`lg` 盒；强制颜色下单独、位于 GrayText 与 HighlightText 内、以及分组内 | 回退到错误的缩写或图标、拆分的字素、丢失的重试、缺失的目标、错误的 `lg` 盒尺寸，或强制颜色下漏掉周围系统色（单独）或未保持强制前景色（分组内）的首字母缩写，均判为失败。缺口：没有测试同时设置 `src` 与 `fallbackSrc`，因此 `src` 优先的顺序未被检查；除 `lg` 之外的尺寸与数值尺寸只在 `Avatar.stories.tsx` 中可见。 | `audit:Avatar/behavior` |
| FR4                | `Avatar.test.tsx` 的形状与状态测试；`Avatar.stories.tsx` 的状态测试夹具                                                                                                                                                                                   | 每种带状态的形状；RTL                                                                                                 | 缺失状态槽即失败。缺口：测试只断言存在性，因此槽位的位置、镜像与偏移只在渲染出的测试夹具中可见。                                                                                                                                                                                                                     | `audit:Avatar/layout`   |
| FR5, AR1, AR2, PR1 | `Avatar.test.tsx` 的状态-名称与包装测试套件                                                                                                                                                                                                               | 直接、包装、变化、移除的标签                                                                                          | 丢失组合名称、多余渲染或陈旧标签即失败。                                                                                                                                                                                                                                                                             | `audit:Avatar/a11y`     |
| AR1, AR3           | `Avatar.test.tsx` 的“首字母缩写是图像的一部分，而不是控件的文本”测试套件；在真实 Chromium 与 WebKit 中运行的 `AvatarLabelInName.a11y.browser.spec.ts`（axe `label-content-name-mismatch`、绘制出的首字母缩写在有/无强制颜色下、键盘焦点时的名称工具提示） | 带首字母缩写的静态、链接与按钮根元素；照片根元素；强制颜色                                                            | 首字母缩写变成控件文本、名称不是人物名称、首字母缩写离开屏幕，或工具提示在焦点时不显示名称，均判为失败。                                                                                                                                                                                                             | `audit:Avatar/a11y`     |
| FR6, AR3           | `Avatar.test.tsx` 的交互性测试套件                                                                                                                                                                                                                        | 链接、按钮、静态、开发环境警告                                                                                        | 错误的根元素、缺失的标记，或缺失的警告即失败。缺口：没有测试检查 focus-visible 轮廓。                                                                                                                                                                                                                                | `audit:Avatar/behavior` |
| FR7, AR4, AR5      | `Avatar.test.tsx` 的名称工具提示测试套件                                                                                                                                                                                                                  | 默认、自定义、禁用、空白                                                                                              | 缺失的 tab 停靠点、重复的描述，或丢失的 `ref` 即失败。缺口：没有测试覆盖分组内头像在重新挂载其根元素的重渲染之后的工具提示：新的 `status` 元素（内联 `status` prop 会在每次父组件渲染时创建一个）、变化的 `name`、`alt`、locale、调用方 ARIA 或调用方 `ref`，或者挂载之后才开启的工具提示。                          | `audit:Avatar/a11y`     |
| FR8                | `Avatar.test.tsx` 的组形状测试；`AvatarGroup.test.tsx` 的尺寸级联、重叠与漫游测试套件；`layerScopedContext.test.tsx` 的 AvatarGroup 层测试                                                                                                                | 分组内；从分组打开的层内；分组外                                                                                      | 分组内头像的尺寸或形状 prop 生效、丢失重叠、可交互头像未进入漫游集合，或层内静态头像丢失其工具提示 tab 停靠点，均判为失败。缺口：没有测试断言环，也没有断言层内的尺寸与形状。                                                                                                                                        | `audit:Avatar/behavior` |
| FR9, AR6           | `Avatar.test.tsx` 的调用方 ARIA 覆盖测试套件                                                                                                                                                                                                              | 静态与可交互根元素                                                                                                    | 派生值替换调用方的 `aria-label`、`role` 或 `aria-hidden` 即失败。缺口：没有测试覆盖调用方的 `tabIndex`。                                                                                                                                                                                                             | `audit:Avatar/a11y`     |
| AR1–AR3, AR5       | 可访问性树证据（`spec:AST-009` FR3）                                                                                                                                                                                                                      | 具名、装饰性、状态组合、可交互                                                                                        | 缺口：没有可访问性树检查能证明计算出的角色、名称或描述；单元测试查询的是 DOM。                                                                                                                                                                                                                                       | `audit:Avatar/a11y`     |
| AR7                | 浏览器中 `Avatar.stories.tsx` 的交互与尺寸测试夹具                                                                                                                                                                                                        | 每种尺寸的可交互头像                                                                                                  | 缺口：没有自动化的目标尺寸检查；尺寸不足的目标就是已记录的缺口。                                                                                                                                                                                                                                                     | `audit:Avatar/a11y`     |

## Decision log

无记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的拥有者。
