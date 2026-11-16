---
schema_version: 3
template_version: 7
kind: component
id: component:SideNavCollapseButton
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
    apps/storybook/stories/SideNavCollapseOwnership.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: [design:bidirectionality, design:reduced-motion]
architecture: [architecture:public-component-api]
contributing: []
system_specs: []
---

# SideNavCollapseButton component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `SideNavCollapseButton`，带有 `collapsible`（`{isCollapsed, onCollapsedChange}`）、`handleRef`（已废弃）、`label`、`size` 以及 `children`（替代图标）。                                 |
| Behavior                | 一个仅含图标的 ghost Button，用于在展开与折叠之间切换 SideNav 侧栏，既可在 SideNav 内部使用，也可在页面其他任意位置使用。当折叠不可用或 AppShell 处于其移动端布局时，它不渲染任何内容。 |
| End-user impact         | 用户通过一个具名按钮折叠和展开侧栏，该按钮的箭头在任一书写方向上都指向正确方向。                                                                                                        |
| Builder impact          | 无。                                                                                                                                                                                    |
| Compatibility/readiness | 记录已发布行为；无公开变更。存在一处实现差距（见 Current-state impact）。                                                                                                               |
| Review checks           | 拒绝替代切换行为的调用方 `onClick`、在 AppShell 移动端布局中渲染的按钮，以及在从右到左书写方向下不镜像的箭头。                                                                          |
| Governing rules         | `architecture:public-component-api` INV7；`design:bidirectionality` DR4；`component:Button`。                                                                                           |

本表是审查视图；下方正文具有权威性。

## Intent

SideNavCollapseButton 是折叠和展开 SideNav 侧栏的控件。它负责其折叠状态的来源、其名称以及其箭头。使用方的用法见 `SideNavCollapseButton.doc.mjs`。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布行为；无公开变更
- 受控/非受控行为：从 `collapsible` 读取状态，否则从已废弃的 `handleRef`，否则从外层 SideNav 读取（FR1）
- 迁移决策：无

使用方的迁移说明属于使用方文档与发布说明。

## Current-state impact

- **减弱动效下触摸端的切换立即生效。** 在减弱动效下，箭头旋转在每种指针上都立即变化；`design:reduced-motion` DR2 要求触摸屏上的变化在 200 ms 内交叉淡入淡出。

## Ownership boundary

**拥有**

- 状态来源、可见性、名称、切换行为以及箭头（FR1–FR5）。

**不拥有 / 非目标**

- 侧栏的折叠、调整尺寸与持久化行为 —— 由 SideNav 拥有。
- Button 的渲染、尺寸与焦点环 —— 由 `component:Button` 拥有。

## Public concepts

| Concept  | Closed values or states                            | Meaning                    | Availability by variant/orientation/state | Default      | Owner                             | Stability                | Invalid-value behavior |
| -------- | -------------------------------------------------- | -------------------------- | ----------------------------------------- | ------------ | --------------------------------- | ------------------------ | ---------------------- |
| 状态来源 | `collapsible`、`handleRef`（已废弃）、外层 SideNav | 折叠状态从哪里读取和切换。 | 所有位置。                                | 外层 SideNav | `component:SideNavCollapseButton` | 稳定；`handleRef` 已废弃 | 不适用。               |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                             | Basis          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 状态在给出 `collapsible` 时来自它（始终可折叠；切换时以 `isCollapsed` 的反值调用 `onCollapsedChange`），否则来自已废弃的 `handleRef` 所指向的 SideNav，否则来自外层 SideNav。                                                                                                                         | 当前源码与测试 |
| FR2 | 当状态来源不可折叠，或 AppShell 报告其移动端布局时，它不渲染任何内容。                                                                                                                                                                                                                                | 当前源码与测试 |
| FR3 | 它渲染一个仅含图标的 ghost Button，其名称由 `label` 指定，否则由按当前状态翻译的 `@astryx.sideNavCollapseButton.collapseSidebar` 或 `.expandSidebar` 指定，尺寸为 `size`，并转发 `ref` 及其他 props。                                                                                                 | 当前源码与测试 |
| FR4 | 先执行调用方 `onClick`，再执行切换；调用方 `onClick` 若调用 `preventDefault()`，则取消该次点击的切换。                                                                                                                                                                                                | 当前源码与测试 |
| FR5 | 默认图标是一个箭头，展开时指向行内起始方向，折叠时转向；它在从右到左书写方向下镜像；其旋转仅在无减弱动效偏好时播放动画；在减弱动效下，对于精细指针它立即变化，而在触摸屏上它必须在 200 ms 内交叉淡入淡出（`design:reduced-motion` DR2、DR3）。实现差距：在触摸屏上它也立即变化。`children` 会替换它。 | 当前源码       |

### Allowed variation

- **AV1 — 图标。** `children` 可以替换箭头。

### Representative states

| State              | Required invariant                          | Allowed variation |
| ------------------ | ------------------------------------------- | ----------------- |
| 在 SideNav 内部    | 切换该 SideNav。                            | —                 |
| 外部配合 handleRef | 切换所引用的 SideNav。                      | —                 |
| 受控               | 调用 `onCollapsedChange`；状态跟随该 prop。 | —                 |
| 移动端布局         | 不渲染。                                    | —                 |

### Transformation and precedence order

- **ORD1 — 状态来源。** FR1 的顺序。
- **ORD2 — 名称。** 先 `label`，然后是依赖状态的默认值。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 具名控件。** 按钮始终有描述其操作的名称（FR3）。

## Design relationships

| Anatomy or state | Design requirement | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------ | ------------------------ | -------------- | ------------------ |
| 箭头             | 指向折叠方向。     | 当前源码                 | 辅助           | FR5                |

`SideNavCollapseButton.doc.mjs` 未声明自身的解剖结构，因此未记录解剖结构主题映射。

## Family and system relationships

- `component:Button` 渲染该控件。
- `design:bidirectionality` DR4 管辖箭头的镜像。

## Verification map

| Contract       | Verification                                                                                                           | Representative states                                  | Mutation or failure expectation                      | Audit section                               |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------- | ------------------------------------------- |
| FR1、FR2       | `SideNav.test.tsx` 的 handleRef、外部按钮与折叠归属测试                                                                | 内部、handleRef、受控                                  | 状态来源过期或错误即失败。                           | `audit:SideNavCollapseButton/behavior`      |
| FR1、FR3、ORD2 | `SideNav.test.tsx` 的外部按钮与受控 collapsible 测试                                                                   | 自有 `collapsible`；`label` 覆盖；展开与折叠的默认名称 | 状态来源错误、`label` 被忽略，或默认名称过期即失败。 | `audit:SideNavCollapseButton/accessibility` |
| FR4            | `SideNav.test.tsx` 的使用方 onClick 测试                                                                               | 外部配合 handleRef                                     | 被替换的切换行为即失败。                             | `audit:SideNavCollapseButton/behavior`      |
| FR3            | `SideNav.test.tsx` 的页脚图标行尺寸测试                                                                                | 内置按钮；导航外显式指定 `size`                        | Button 默认尺寸或显式尺寸被忽略即失败。              | `audit:SideNavCollapseButton/behavior`      |
| RTL relation   | 对 `SideNav / Collapsible sidebar` 的 RTL 审计自动 D1，由 `apps/storybook/rtl-audit/targets.json` 中仅按路由的条目路由 | 折叠按钮的箭头；LTR 与 RTL                             | 不镜像的箭头在 D1 上失败。                           | `audit:SideNavCollapseButton/i18n-rtl`      |

从源码读取，尚无专门的测试：

- FR2：当状态来源不可折叠，或 AppShell 处于其移动端布局时，不渲染任何内容。
- FR3：ghost 变体与转发的 `ref`。
- FR4：调用方 `onClick` 在切换之前执行，以及其 `preventDefault()` 的取消。
- FR5。

## Decision log

未记录组件局部的决策。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表或示例，而是链接到它们的拥有者。
