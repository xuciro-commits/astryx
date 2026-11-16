---
schema_version: 3
template_version: 7
kind: component
id: component:SideNavSection
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
families: []
design_specs: []
architecture:
  [architecture:public-component-api, architecture:component-theming-surface]
contributing: []
system_specs: []
---

# SideNavSection component contract

## Contract at a glance

| 领域          | 契约                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `SideNavSection`，含 `title`、`subtitle`、`endContent`、`isHeaderHidden` 与 `children`；目标 `side-nav-section`。                 |
| 行为          | 一组带标签的 SideNav 条目。其标题区在展开的轨道中可见；当设置了 `isHeaderHidden` 或轨道折叠时，标题区在视觉上隐藏，但仍会被朗读。 |
| 最终用户影响  | 屏幕阅读器用户在每个轨道状态下都能听到各分组的标题；视力正常的用户只在展开的轨道中看到分组标题。                                  |
| 构建者影响    | 无。                                                                                                                              |
| 兼容性/就绪度 | 记录已发布的行为；无公共变更。存在一处实现缺口（见当前状态影响）。                                                                |
| 审查检查      | 拒绝没有由标题命名的 `role="group"` 的 section，或拒绝从无障碍树中移除隐藏标题的做法。                                            |
| 治理规则      | `architecture:public-component-api` INV5–INV6；`architecture:component-theming-surface`。                                         |

此表是审查投影；下方正文具有权威性。

## Intent

SideNavSection 将相关的 SideNav 条目归组到一个标题之下。它拥有该分组的语义及其标题区的可见性。使用方用法见 `SideNavSection.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`
- 兼容性类别：记录已发布的行为；无公共变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **隐藏的标题会让其末尾内容仍可聚焦。** 当标题区被视觉隐藏时（`isHeaderHidden` 或轨道折叠），放在 `endContent` 中的控件在被裁剪到视野之外时仍留在 Tab 顺序中，因此键盘用户会停在一个看不见的控件上。WCAG 2.4.7 要求焦点可见。OQ1 询问隐藏的标题是否会渲染 `endContent`。

## Ownership boundary

**拥有**

- 分组元素、其名称、标题区可见性以及根样式（FR1–FR4）。

**不拥有 / 非目标**

- 条目渲染与嵌套——由 `component:SideNavItem` 与 `component:SideNav` 拥有。
- 放入 `endContent` 的交互内容——由该内容自身拥有。

## Public concepts

除使用方 props 之外没有组件本地概念。

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                         | 依据           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| FR1 | 根元素是一个 `div`，带有 `role="group"` 和指向标题的 `aria-labelledby`。它带有 `side-nav-section`、转发的 `ref`、`data-testid` 以及其他 DOM props；role 与标签不能被它们覆盖。 | 当前源码与测试 |
| FR2 | 标题区显示标题、可选副标题，以及位于行内末端的 `endContent`，其后是各个条目。                                                                                                  | 当前源码与测试 |
| FR3 | 当 `isHeaderHidden` 为 true 或轨道折叠时，标题区在视觉上隐藏，但仍留在无障碍树中，因此分组保留其名称。                                                                         | 当前源码与测试 |
| FR4 | `className`、`style` 与 `xstyle` 在组件样式之后合并到根元素上。                                                                                                                | 当前源码与测试 |

### Allowed variation

- **AV1 — 标题内容。** 副标题与末尾内容可以缺失。

### Representative states

| 状态       | 必需不变式                   | 允许的变化 |
| ---------- | ---------------------------- | ---------- |
| 展开的轨道 | 标题可见；分组有名称。       | 末尾内容。 |
| 标题隐藏   | 隐藏的标题仍为分组提供名称。 | —          |
| 折叠的轨道 | 隐藏的标题仍为分组提供名称。 | —          |

### Transformation and precedence order

- 无优先级规则。

### Performance and resources

- 无资源规则。

## Accessibility contract

- **AR1 — 具名分组。** FR1 与 FR3。

## Design relationships

| 解剖结构或状态 | 设计要求                 | 表示权威           | 层级角色 | 组件契约 |
| -------------- | ------------------------ | ------------------ | -------- | -------- |
| 标题区         | 标题、副标题、末尾内容。 | 当前源码与公共文档 | 支撑     | FR2、FR3 |

`SideNavSection.doc.mjs` 未声明自身的解剖结构，因此不记录解剖结构主题映射。

## Family and system relationships

- `component:SideNav` 在其列表中承载各个 section。

## Verification map

| 契约          | 验证                                                                                                  | 代表性状态                         | 变异或失败预期                            | 审计章节                             |
| ------------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------- | ----------------------------------------- | ------------------------------------ |
| FR1、FR2、FR4 | `SideNav.test.tsx` 的 SideNavSection 测试套件                                                         | 标题、副标题、末尾内容、props      | 丢失 role、名称或转发 prop 会失败。       | `audit:SideNavSection/accessibility` |
| FR3           | `SideNav.test.tsx` 的隐藏 section 标题测试                                                            | 标题隐藏                           | 标题被从树中移除会失败。                  | `audit:SideNavSection/accessibility` |
| RTL 关系      | RTL 审计精选 D2 目标（`apps/storybook/rtl-audit/targets.json`）中的 `SideNav / Section / End content` | section 标题与末尾内容；LTR 与 RTL | 标题未位于末尾内容的行内起始处会失败 D2。 | `audit:SideNavSection/i18n-rtl`      |

从源码读取，尚无聚焦测试：转发的 `ref`、`side-nav-section` 目标，以及 role 与标签优先于调用方 props（FR1）；标题区的组成部分顺序与末尾内容放置（FR2）；在折叠轨道中隐藏标题（FR3）；以及根元素上的 `xstyle`（FR4）。

## Decision log

未记录组件本地决策。

## Open questions

- **OQ1 — 隐藏的标题会渲染 `endContent` 吗？**（`human-api`）目前会的，并且放在那里的控件在隐藏时仍可聚焦（当前状态影响）。

## Content boundary

本文件不重复使用方 props 表格或示例，而是链接到它们的拥有者。
