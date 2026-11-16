---
schema_version: 3
template_version: 7
kind: component
id: component:Tab
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/TabList/TabList.test.tsx,
    packages/core/src/TabList/__tests__/Tabs.a11y.test.tsx,
    packages/core/src/TabList/__tests__/TabDescription.test.tsx,
    packages/core/src/TabList/__tests__/Tabs.a11y.chromium.spec.ts,
    packages/core/src/TabList/__tests__/TabListTextSize.interaction.browser.spec.ts,
    apps/storybook/stories/TabList.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:reduced-motion]
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

# Tab component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                               |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `Tab` 接收 `value`、`label`、`isLabelHidden`、`href`、`as`、`panelId`、`icon`、`selectedIcon` 与 `endContent`；它以 `selected` 状态定位 `tab` 与 `tab-indicator` 两个目标。                                                        |
| 行为          | 一个 TabList 条目。在导航模式下它是按钮，或者在提供 `href` 时是带 `aria-current` 的链接（选中时标记）；在标签页模式（`role="tablist"`）下它是 `role="tab"` 的按钮，控制其面板。整条条带只有一个 Tab 停靠点，并起始于被选中的条目。 |
| 终端用户影响  | 用户选择一个视图或目的地；键盘用户对整条条带只需经过一个 Tab 停靠点；屏幕阅读器用户会听到被选中的条目，并在标签页模式下听到它所控制的面板。                                                                                        |
| 构建者影响    | 无。                                                                                                                                                                                                                               |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。四处实现缺口（见当前状态影响）。                                                                                                                                                                     |
| 审查检查      | 拒绝每条条带多于一个 Tab 停靠点、导航标签上出现 `aria-current="page"`、禁用的标签仍触发其处理函数或仍发生导航，或标签页模式下的标签渲染成链接。                                                                                    |
| 约束规则      | `component:TabList`（条带边缘几何）；`family:navigation-destinations`；`architecture:interaction-modality`。                                                                                                                       |

此表是审查用的投影；以下正文具有权威性。

## Intent

Tab 是 TabList 中的一个条目。它负责自己在每种 TabList 模式下的元素与角色、其选中与禁用行为、其图标切换、标签尺寸，以及其选中指示器。使用方的用法见 `Tab.doc.mjs`。

## Compatibility and migration

- 保留的已发布默认值：`yes`
- 兼容性类别：记录已发布行为；无公共变更
- 受控/非受控行为：选中项即 TabList 的 `value`
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **一个隐藏的标签副本预留了选中宽度。** 每个可见标签都会渲染第二份 `aria-hidden` 副本，用于预留标签在选中时的字重所占宽度，使该标签不会发生位移。`architecture:component-style-authoring` INV7 要求内容只渲染一次，并由 CSS 在显示它的元素上确定尺寸或预留空间。
- **悬停装饰是一个元素。** 悬停填充是一个 `aria-hidden` 的 span，而不是伪元素；`architecture:component-style-authoring` INV7 要求不带语义角色的装饰由伪元素承载。
- **减弱动效下的颜色过渡。** 当请求减弱动效时，标签颜色、悬停填充、按下填充与指示器淡入仍在做动画；`design:reduced-motion` DR3 规定精细指针不允许任何动画属性。
- **`tab` 目标未反映禁用态。** 禁用的 Tab 会去掉其悬停与按下处理，但 `tab` 目标只反映 `selected`。`architecture:component-theming-surface` INV6 要求：改变绘制的状态须反映在其所属目标上。

## Ownership boundary

**拥有**

- 每种模式下的条目元素与角色、激活时的选中、禁用处理、Tab 停靠点、图标切换、标签、末尾内容与指示器（FR1–FR8）。

**不拥有 / 非目标**

- 选中哪个值、模式（`role`）、尺寸、布局、方向键移动与溢出滚动——由 TabList 拥有，在此不作约定；条带边缘几何——由 `component:TabList` 拥有。
- 目的地的接受与阻止——由 `family:navigation-destinations` 拥有。
- 标签所控制的面板——由调用方拥有。

## Public concepts

| 概念 | 封闭值或状态     | 含义                                        | 按变体/方向/状态的可用性 | 默认值     | 所有者  | 稳定性 | 非法值行为          |
| ---- | ---------------- | ------------------------------------------- | ------------------------ | ---------- | ------- | ------ | ------------------- |
| 模式 | navigation、tabs | 由 TabList 的 `role` 设定；决定元素与语义。 | 每个 Tab。               | navigation | TabList | 稳定   | 不能在 Tab 上设置。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                        | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 在导航模式下，Tab 是 `<button type="button">`；若提供 `href`，则是 `as` 组件，否则是 `LinkProvider` 链接，再否则是 `<a>`。选中的 Tab 携带 `aria-current="true"`，绝不为 `"page"`。                                                                            | 当前源码与测试 |
| FR2 | 在标签页模式下，Tab 是 `<button>`，带 `role="tab"`、`aria-selected`，并从 `panelId` 取得 `aria-controls`（否则使用调用方的 `aria-controls`）。`href` 会被忽略，开发期警告会指出被忽略的 `href`、缺失的面板，或标签页模式之外的 `panelId`。                    | 当前源码与测试 |
| FR3 | 整条条带只有一个 Tab 停靠点。它起始于被选中的 Tab（`tabIndex=0`，其他每个条目为 `-1`），并随方向键、Home 或 End 的聚焦移动到相应条目，但不选中它。当没有条目被选中，或被选中的条目被禁用时该停靠点起始于何处，在此不作约定；Tabs 无障碍清单把该策略留作未决。 | 当前源码与测试 |
| FR4 | 激活先运行调用方的 `onClick`，然后（除非调用方取消了事件）通过 TabList 选中该 Tab 的 `value`。                                                                                                                                                                | 当前源码与测试 |
| FR5 | 带 `aria-disabled="true"` 的 Tab 不运行 `onClick`、不选中，且作为链接时渲染为不带 `href` 的纯 `<a>`；它也不获得悬停或按下处理。                                                                                                                               | 当前源码与测试 |
| FR6 | `isLabelHidden` 通过 `aria-label` 以 `label` 命名 Tab 并隐藏文本；可见标签预留其选中（半粗）宽度，使选中不会改变布局。`selectedIcon` 在被选中时替换 `icon`。                                                                                                  | 当前源码与测试 |
| FR7 | 每个 Tab 渲染一个携带 `tab-indicator` 的指示器，仅在选中时可见；根元素携带 `tab` 与 `selected`。按下遮罩绘制在标签表面上。                                                                                                                                    | 当前源码与测试 |
| FR8 | 根元素转发 `ref` 与其他 DOM 属性，在组件样式之后合并 `className`、`style` 与 `xstyle`，并绘制共享的聚焦轮廓。                                                                                                                                                 | 当前源码与测试 |

### Allowed variation

- **AV1 — 尺寸与布局。** TabList 的尺寸设定每个 Tab 的最小高度；文字尺寸更大时 Tab 随之增高，使其标签永远不会被裁切（`spec:AST-102` FR4）。`fill` 布局会拉伸 Tab。
- **AV2 — 主题样式。** 主题按选中状态为 `tab` 与 `tab-indicator` 重新设定样式。

### Representative states

| 状态       | 必需不变式                                       | 允许的变化       |
| ---------- | ------------------------------------------------ | ---------------- |
| 导航按钮   | 选中时 `aria-current="true"`。                   | 图标、末尾内容。 |
| 导航链接   | 链接；选中时为 `aria-current="true"`。           | 路由渲染器。     |
| 标签页模式 | `role="tab"`、`aria-selected`、`aria-controls`。 | —                |
| 仅图标     | 由 `label` 命名。                                | 图标。           |
| 禁用       | 不选中、不触发处理函数、不导航。                 | 弱化样式。       |

### Transformation and precedence order

- **ORD1 — 元素。** 标签页模式 → button；否则 `href` → 链接（禁用 → 纯 `<a>`）；否则 button。
- **ORD2 — 控制关系。** 先用 `panelId`，再用调用方的 `aria-controls`。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 模式语义。** FR1 与 FR2。
- **AR2 — 单一 Tab 停靠点。** FR3。
- **AR3 — 名称。** 可见标签；隐藏时使用来自 `label` 的 `aria-label`。
- **AR4 — 帮助文本描述该标签。** Tab 的帮助文本是经由其转发 ref 锚定在 Tab 上的 Tooltip，因此描述落在该标签上，而 Tooltip 渲染在条带之外；`endContent` 只承载非交互内容（FR2）。

## Design relationships

| 结构或状态 | 设计要求                               | 呈现权威           | 层级角色 | 组件契约 |
| ---------- | -------------------------------------- | ------------------ | -------- | -------- |
| Tab        | 图标、标签、末尾内容；选中时宽度稳定。 | 当前源码与公共文档 | 突出     | FR6      |
| 指示器     | 仅在选中时显示的下划线。               | 当前源码           | 辅助     | FR7      |

`Tab.doc.mjs` 未声明自己的结构，因此未记录结构-主题映射。整条条带的边缘与指示器几何由 `component:TabList` FR1–FR2 约定。

## Family and system relationships

- TabList 提供模式、值、尺寸、布局与键盘移动；`component:TabList` 约定其边缘几何。
- `family:navigation-destinations` 拥有针对 `href` 的接受/阻止决策。

## Verification map

| 契约         | 验证                                                                                                                                     | 代表性状态                                                | 变更或失败预期                                                                                                     | 审计小节                  |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------- |
| FR1, FR2     | `TabList.test.tsx` 的 aria-current、多态链接与标签页模式测试；`Tabs.a11y.test.tsx`；针对 `aria-selected` 的 `Tabs.a11y.chromium.spec.ts` | 导航、链接、标签页                                        | 角色或状态不正确则失败。                                                                                           | `audit:Tab/accessibility` |
| FR3          | `TabList.test.tsx` 的单一 Tab 停靠点与漫游 tabindex 测试                                                                                 | 选中                                                      | 出现多余的 Tab 停靠点，或起始停靠点错误，则失败。                                                                  | `audit:Tab/accessibility` |
| FR4, FR5     | `TabList.test.tsx` 的 onChange 与禁用测试                                                                                                | 点击、禁用按钮                                            | 禁用时仍发生选中则失败。                                                                                           | `audit:Tab/behavior`      |
| FR6, FR7     | `TabList.test.tsx` 的图标、仅图标与按下遮罩测试                                                                                          | 图标、选中图标、隐藏标签                                  | 图标、名称或遮罩不正确则失败。                                                                                     | `audit:Tab/behavior`      |
| AV1 文字尺寸 | `TabListTextSize.interaction.browser.spec.ts`，在默认字号 200% 与 250% 下                                                                | 默认、尺寸变体、含菜单                                    | 标签或条带裁切其标签，或标签超出其所在标签页，则失败。                                                             | `audit:Tab/behavior`      |
| RTL 关系     | RTL 审计中经策展的 D2 目标（`apps/storybook/rtl-audit/targets.json`），针对 `TabList / With icons`                                       | 标签图标与标签；LTR 与 RTL                                | 图标未处于其标签的行内起始位置，则未通过 D2。                                                                      | `audit:Tab/i18n-rtl`      |
| AR4          | `TabDescription.test.tsx`                                                                                                                | 一个锚定在 Tab 上、其 `endContent` 中带信息图标的 Tooltip | 标签缺少该 Tooltip 的 `aria-describedby`、标签内部出现可聚焦元素、条带内部出现 Tooltip，或出现开发期警告，则失败。 | `audit:Tab/accessibility` |

从源码读到、尚无针对性测试的内容：

- FR3：停靠点随方向键、Home 与 End 的聚焦而移动。
- FR1：按钮的 `type="button"`。
- FR4：调用方的 `onClick` 先运行，且其 `preventDefault()` 会取消选中。
- FR5：禁用的 Tab 不出现悬停与按下处理。
- FR6：预留选中宽度的标签。
- FR7：`tab` 与 `tab-indicator` 目标及其 `selected` 状态。
- FR8。

## Decision log

未记录组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的属性表、示例或 TabList 条带行为。它链接到这些内容的所属记录。
