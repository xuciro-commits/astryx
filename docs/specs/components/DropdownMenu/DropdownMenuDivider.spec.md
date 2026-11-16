---
schema_version: 3
template_version: 7
kind: component
id: component:DropdownMenuDivider
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, testing]
verified_by:
  [
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
    packages/core/src/ContextMenu/ContextMenu.test.tsx,
    packages/core/src/Breadcrumbs/Breadcrumbs.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: [spec:AST-020]
---

# DropdownMenuDivider component contract

## Contract at a glance

| 区域          | 契约                                                                                                                                                                                                               |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | `DropdownMenuDivider` / `DropdownMenuDividerProps`，以及 `ContextMenuDivider` 和 `BreadcrumbMenuDivider` 别名及其 props；`BaseProps<HTMLDivElement>` 减去调用方拥有的 `role` 和 `aria-orientation`；一个根 `ref`。 |
| 行为          | 一个无标签的水平分隔符划分指针菜单的行，并保持在方向键顺序之外；数据模式与复合指针模式渲染同一个组件。                                                                                                             |
| 最终用户影响  | 指针菜单的各分区在视觉上保持分隔，不新增焦点停靠点，也不改变行的操作。                                                                                                                                             |
| 构建者影响    | 调用方没有新的选择。宿主属性、处理函数和样式输入继续在分隔符上组合。                                                                                                                                               |
| 兼容性/就绪度 | 记录已发布的行为；没有 API、默认值或 DOM 变更。                                                                                                                                                                    |
| 审查检查      | 拒绝可聚焦的分隔符、被改动的 role/orientation、指针数据模式与复合模式的差异、丢失的根输入，或把目标移到可见分隔符之外。                                                                                            |
| 管辖规则      | `architecture:public-component-api/INV1,INV5–INV9`；`architecture:component-theming-surface/INV3–INV6`；`spec:AST-020`。                                                                                           |

本表是审查投影；下方正文具有权威性。

## Intent

DropdownMenuDivider 提供指针菜单呈现中各组行之间的视觉与程序边界。它直接以 DropdownMenu 名称发布，也通过 ContextMenu 和 Breadcrumbs 别名发布。它拥有分隔符语义、菜单间距、根输入组合，以及 `dropdown-menu-divider` 主题目标。周围的 DropdownMenu、ContextMenu 或 BreadcrumbItem 拥有菜单生命周期与行导航；Divider 提供基础分隔线的几何与绘制。

使用方语法与示例属于 `DropdownMenuDivider.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：是——一个水平、无标签的分隔符。
- 兼容性类别：记录已发布的行为；没有公开 prop、默认值、导出或 DOM 变更。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 一个水平分隔符根及其公开 `ref`、DOM/data/ARIA、class、style、事件，以及 `xstyle` 组合。
- 针对菜单的块轴间距。
- 同一可见根上的 `dropdown-menu-divider` 目标。
- 分隔符行在 DropdownMenu、ContextMenu 和面包屑菜单中指针数据模式/复合模式渲染的一致性。

**不拥有 / 非目标**

- 菜单打开状态、焦点进入、行激活或方向键导航——由 DropdownMenu、ContextMenu、BreadcrumbItem 及其共享 hook 拥有。
- 触摸与底部面板的数据分隔符——那些呈现直接渲染 Divider，并由其父菜单表面拥有。
- 基础分隔线几何与 token 绘制——委托给 Divider。
- 调用方编写的分组含义——由产品调用点拥有。

## Public concepts

| 概念     | 封闭值或状态                                  | 含义                                             | 按变体/方向/状态的可用性   | 默认值       | 拥有者               | 稳定性 | 无效值行为                                           |
| -------- | --------------------------------------------- | ------------------------------------------------ | -------------------------- | ------------ | -------------------- | ------ | ---------------------------------------------------- |
| 分隔符行 | 一个水平、无标签的分隔符                      | 划分相邻的指针菜单行组，而不成为行或焦点停靠点。 | 数据模式与复合指针菜单模式 | 在编写处存在 | component            | 稳定   | Role 与方向被排除在调用方 props 之外，仍由组件拥有。 |
| 根表面   | ref；DOM/data/ARIA；class/style/xstyle/events | 扩展分隔符根，同时保留组件语义。                 | 每个分隔符行               | 省略         | public component API | 稳定   | 接受的输入会组合；role 与方向保持权威。              |

## Behavioral and layout contract

| ID  | 不变式                                                                                                             | 依据                                                     |
| --- | ------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| FR1 | 组件渲染一个无标签的水平分隔符，并带有指针菜单专用的块间距。                                                       | 已发布的源码/文档与聚焦测试                              |
| FR2 | 根暴露 `role="separator"` 和 `aria-orientation="horizontal"`，保持在菜单项集合与方向键顺序之外，且永远不可聚焦。   | `spec:AST-020`；当前测试                                 |
| FR3 | 在指针菜单呈现中，数据 API 里的 `{type: "divider"}` 与复合分隔符组件或别名渲染相同的组件 DOM、间距、语义和目标。   | 已发布的文档/源码；数据/复合一致性测试                   |
| FR4 | 可见根同时携带委托的 `divider` 目标和菜单专用的 `dropdown-menu-divider` 目标；菜单间距在调用方 `xstyle` 之前应用。 | `architecture:component-theming-surface`；当前源码与测试 |
| FR5 | 接受的 ref、DOM/data/ARIA、class、style、事件和 `xstyle` 到达或组合在分隔符根上，且不替换组件拥有的 role 或方向。  | `architecture:public-component-api` INV5–INV8；当前测试  |

### Allowed variation

- **AV1 — 主题绘制。** 委托的 Divider 与菜单专用目标可以重新设置其拥有的表面的样式，而不改变分隔符语义或焦点行为。
- **AV2 — 调用方根输入。** 支持的宿主属性、处理函数和样式输入可以变化，而拥有的 role 与方向保持固定。

### Representative states

| 状态               | 必需的不变式                                             | 允许的变体                         |
| ------------------ | -------------------------------------------------------- | ---------------------------------- |
| 指针数据模式分隔符 | 数据驱动行之间的一个水平分隔符。                         | 相邻行内容和活动主题可以变化。     |
| 指针复合分隔符     | DOM 与行为匹配指针数据模式分隔符。                       | 可以提供宿主属性和支持的样式输入。 |
| 公共别名           | ContextMenuDivider 和 BreadcrumbMenuDivider 渲染此组件。 | 包含它的菜单拥有生命周期与导航。   |
| 触摸数据分隔符     | 在此组件之外；父表面直接渲染 Divider。                   | 触摸菜单布局遵循父契约。           |
| RTL                | 水平、全宽的线保持方向中立。                             | 周围的文本与菜单对齐可以镜像。     |
| 窄视口             | 线保持在菜单内部，不产生水平溢出。                       | 菜单宽度遵循其拥有者。             |

### Transformation and precedence order

- **ORD1 — 根组合。** 先应用菜单间距，再应用调用方 `xstyle`；将菜单专用目标 class 与调用方 `className` 组合；保留调用方 `style` 与宿主 props；让 role 与方向保持由组件拥有。

### Performance and resources

- **PR1 — 无外部生命周期。** DropdownMenuDivider 不安装任何监听器、观察器、定时器、请求、状态机或 Effect。

## Accessibility contract

- **AR1 — 分隔符语义。** 根暴露水平分隔符，不暴露交互式 role 或 tab 停靠点。
- **AR2 — 导航排除。** 菜单导航只收集菜单项 role，因此 ArrowDown 和 ArrowUp 越过分隔符而不聚焦它。

## Design relationships

| 解剖结构或状态 | 设计要求                                       | 呈现权威                                               | 层级角色   | 组件契约 |
| -------------- | ---------------------------------------------- | ------------------------------------------------------ | ---------- | -------- |
| 菜单分隔符     | 在视觉上分隔相邻的菜单行组，而不与行内容竞争。 | 当前源码与委托的 Divider token；未增加组件本地视觉决策 | supporting | FR1–FR4  |

未记录组件本地视觉决策。

## Family and system relationships

- `architecture:public-component-api` 拥有导出与根输入组合。
- `architecture:component-theming-surface` 拥有目标放置与组合目标的所有权。
- `architecture:component-test-sufficiency` 拥有相称的、可观察的证据。
- DropdownMenu 直接导出该实现。ContextMenu 与 Breadcrumbs 将其重新导出为 `ContextMenuDivider` 和 `BreadcrumbMenuDivider`，并带有匹配的 props 别名；它们的指针呈现保持相同的组件契约。
- 触摸与底部面板数据分隔符绕过此组件，直接在父菜单契约下委托给 Divider。
- Divider 提供基础分隔符实现。

## Verification map

| 契约               | 验证                                                                                                                                                                                                                                                                                                                                                                                                            | 代表状态                             | 变更或失败预期                                                                                                                                                                  | 审计章节                              |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| FR1, FR2, AR1, AR2 | `DropdownMenu.test.tsx` 的分隔符与一致性用例（"renders dividers between items"、"renders an identical divider from either mode"、"skips a compound divider in the arrow-key order"、"forwards host attributes to a compound divider while keeping its role"）；`ContextMenu.test.tsx` 的分隔符用例；`Breadcrumbs.test.tsx` 的 "renders the separator and props types through the BreadcrumbMenuDivider aliases" | 数据与复合指针菜单；别名；方向键遍历 | 缺少分隔符、被改动的 role、出现在方向键顺序中的分隔符，或丢失的别名都会失败。证据缺口：没有测试断言 `aria-orientation` 或菜单块间距。                                           | `audit:DropdownMenuDivider/semantics` |
| FR3                | `DropdownMenu.test.tsx` 的 "renders an identical divider from either mode"                                                                                                                                                                                                                                                                                                                                      | 数据与复合                           | 两种模式之间的 DOM 不同会失败。                                                                                                                                                 | `audit:DropdownMenuDivider/behavior`  |
| FR4, FR5           | `DropdownMenu.test.tsx` 的 "composes the complete public root surface on the separator" 与一致性用例中的 `dropdown-menu-divider` class 断言；`themingTargets.test.ts`                                                                                                                                                                                                                                           | Ref、class、style、xstyle、处理函数  | 丢失 ref、class、style、`xstyle` 或处理函数，或缺少 `dropdown-menu-divider` 目标，都会失败。证据缺口：没有测试断言委托的 `divider` 目标，或菜单间距在调用方 `xstyle` 之前应用。 | `audit:DropdownMenuDivider/api`       |
| PR1                | 证据缺口：没有测试断言生命周期资源的缺失                                                                                                                                                                                                                                                                                                                                                                        | —                                    | —                                                                                                                                                                               | `audit:DropdownMenuDivider/behavior`  |

## Decision log

没有组件本地决策。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计分数、截图矩阵、实现步骤或系统规则。它链接到它们的拥有者。
