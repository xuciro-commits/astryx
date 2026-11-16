---
schema_version: 3
template_version: 7
kind: component
id: component:AvatarGroupOverflow
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/AvatarGroup/AvatarGroupOverflow.test.tsx,
    packages/core/src/AvatarGroup/AvatarGroup.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/rtl-audit/targets.json,
    apps/storybook/stories/AvatarGroupOverflow.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-009, spec:AST-038]
---

# AvatarGroupOverflow component contract

## Contract at a glance

| Area          | Contract                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 带有必需 `count` 的溢出指示器，可选 `onClick`，以及可选的、用于替换可见 “+N” 的自定义 `children`。                                                      |
| 行为          | 无 `onClick` 时，它是一个具名图像；有 `onClick` 时，它是该组轮巡集合中的原生按钮。除非调用方的 `aria-labelledby` 为其命名，否则它的名称是翻译后的计数。 |
| 终端用户影响  | 屏幕阅读器用户会听到隐藏了多少人（“还有 5 人”）；键盘用户可将可点击的指示器作为组内最后一项访问。                                                       |
| 构建者影响    | 无；该记录描述已交付的行为。                                                                                                                            |
| 兼容性/就绪度 | 已交付行为记录为 current；无 API、默认值或输出变化。两个实现缺口列在“当前状态影响”下。                                                                  |
| 审查检查      | 拒绝显示为负数的计数、取自自定义 children 的名称、轮巡集合中的静态指示器，或忽略组的尺寸或形状的指示器。                                                |
| 管辖规则      | `architecture:public-component-api/INV5,INV6,INV8`; `architecture:component-theming-surface/INV2,INV6`; `architecture:internationalization/INV1a`。     |

本表是审查投影；下方正文具有权威性。

## Intent

AvatarGroupOverflow 告诉读者 AvatarGroup 未显示多少成员，并可选择让读者打开其余成员。它拥有指示器的计数标签、其静态形式与按钮形式，以及它在组内的几何形态。

## Compatibility and migration

- 保留的已交付默认值：`yes`
- 兼容性类别：记录已交付行为；无公共 prop、默认值、DOM、无障碍、目标或样式输出变化
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **默认计数在目录之外（FR2）。** 可见的 “+N” 由原始数字拼接而成，因此从不做区域格式化：徽标显示 “+4912”，而名称读作 “4,912 more”，在拥有自身数字的区域设置下数字也不相同（`architecture:internationalization` INV1a）。
- **溢出按钮目标（AR4）。** 在 16px 的组中，可点击指示器高 20px，低于 WCAG 2.2 2.5.8 所要求的 24 × 24 CSS 像素。

## Ownership boundary

**拥有**

- 指示器元素及其 `avatar-group-overflow` 目标。
- 默认可见的 “+N” 内容与翻译后的计数名称。
- 静态图像形式与原生按钮形式。
- 在 AvatarGroup 之外使用的 medium、circle、无重叠呈现。

**不拥有 / 非目标**

- 选择可见头像并计算隐藏数量——由产品调用点拥有。
- 头像渲染与主题化——由 `component:Avatar` 拥有。
- 组的名称、上下文、成员顺序与轮巡焦点算法——由 `component:AvatarGroup` 拥有；可点击指示器通过条目标记加入。
- 除将其放入指示器之外的调用方提供的 children。

## Public concepts

| Concept  | Closed values or states    | Meaning                                                            | Availability by variant/orientation/state | Default            | Owner                           | Stability | Invalid-value behavior   |
| -------- | -------------------------- | ------------------------------------------------------------------ | ----------------------------------------- | ------------------ | ------------------------------- | --------- | ------------------------ |
| 计数     | 调用方提供的数字           | 驱动翻译后的名称与默认 “+N”。                                      | 两种形式；组内或组外                      | 必需               | `component:AvatarGroupOverflow` | 稳定      | 负数计数显示并命名为零。 |
| 显示内容 | 默认 “+N”；调用方 children | 可见内容；名称仍由计数派生。                                       | 两种形式                                  | “+N”               | `component:AvatarGroupOverflow` | 稳定      | —                        |
| 激活     | 静态；可点击               | `onClick` 会选择按钮形式，并在激活时被调用。                       | 组内与组外均可                            | 静态               | `component:AvatarGroupOverflow` | 稳定      | —                        |
| 呈现     | 组提供；独立               | 尺寸、形状与重叠来自 AvatarGroup，否则为 medium、circle 且无重叠。 | 所有尺寸与形状；两个方向                  | 独立 medium circle | `component:AvatarGroupOverflow` | 稳定      | —                        |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                      | Basis                       |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1 | 无 `onClick` 时，指示器是带有 `role="img"` 的 `span`，调用方 `role` 会替换它。有 `onClick` 时，它是原生 `button type="button"`，在激活时调用 `onClick`，并绘制共享的 focus-visible 轮廓以及共享的悬停与按下覆盖层。                                                                                                                                                                                                                            | 当前源码与测试              |
| FR2 | 负数 `count` 在生成名称与默认内容之前被钳制为零。两种形式下的名称都是翻译后的 “{count} more”，并会替换调用方的 `aria-label`；而调用方的 `aria-labelledby` 会到达根元素并改为为其命名；调用方 children 仅替换可见的 “+N”。运行时计数通过目录进行格式化（`architecture:internationalization` INV1a）。实现缺口：默认 “+N” 在目录之外拼接，因此可见计数从不做区域格式化：分组分隔符，以及在某些区域设置下的数字，都会与名称不同（当前状态影响）。 | 当前源码与测试              |
| FR3 | 在同一层内的 AvatarGroup 中（`spec:AST-038` FR7、FR8），指示器使用组的尺寸、形状、数值尺寸与重叠；在组外——包括从组中打开的层内——它使用 `md`、`circle` 且无重叠。                                                                                                                                                                                                                                                                               | 当前源码与测试              |
| FR4 | 指示器宽度至少为头像尺寸加上每侧 2px 的 surface 颜色边框，高度恰好为该值，内容更宽时以 `--spacing-2` 的行内内边距沿行内方向增长，并采用组的负行内起始重叠。它在 surface 上绘制中性色，配以次级文本、body 字族、medium 字重，字号取 `--text-supporting-size` 与头像尺寸 35% 中的较大者。其圆角随形状变化。                                                                                                                                      | 当前源码、测试与故事        |
| FR5 | 根元素带有 `avatar-group-overflow` 目标，反映 `size` 与 `shape`。受支持的 DOM、ARIA、data 与事件 prop 以及 `ref` 都会到达根元素；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                                                                                                                                                                                                                                                 | 当前源码与测试              |
| FR6 | 按钮形式带有 `data-avatar-item` 标记，因此 AvatarGroup 会将其纳入轮巡集合；静态形式不带标记，其上的调用方 `tabIndex` 会被转发，但不会将其加入该集合。                                                                                                                                                                                                                                                                                          | 当前源码与 AvatarGroup 测试 |

### Allowed variation

- **AV1 — 计数与内容。** 计数与调用方内容会变化；更宽的内容会让指示器沿行内方向增长。
- **AV2 — 主题绘制。** 主题可按 `size` 与 `shape` 重新设置 `avatar-group-overflow` 的样式，而不移动目标。

### Representative states

| State          | Required invariant                                                | Allowed variation  |
| -------------- | ----------------------------------------------------------------- | ------------------ |
| 静态计数       | 名为 “{count} more” 的 `role="img"` span，显示 “+N”；不是轮巡项。 | 计数、尺寸、形状。 |
| 静态自定义内容 | 由计数派生的名称；调用方内容可见。                                | 内容。             |
| 可点击         | 名为 “{count} more” 的按钮；成组时为最后的轮巡项。                | 计数、内容。       |
| 负数计数       | 命名并显示为零。                                                  | 调用方内容。       |
| 宽计数         | 在解析后的高度下沿行内方向增长。                                  | 宽度。             |
| 独立           | 无重叠的 `md` 圆形。                                              | 计数、激活。       |
| 从右到左       | 重叠与顺序遵循文档方向。                                          | —                  |

### Transformation and precedence order

- **ORD1 — 呈现。** AvatarGroup 上下文 → `md`、`circle`、无重叠。
- **ORD2 — 内容。** 在零处钳制 `count` → 翻译后的名称；调用方 children → 否则为 “+N”。
- **ORD3 — 根属性。** 静态：`role="img"` → 调用方 prop → 名称 → 组件 class 与样式。按钮：`type` 与 `onClick` → 调用方 prop → 名称与条目标记 → 按压标记 → 组件 class 与样式。

### Performance and resources

- **PR1 — 无本地资源。** 指示器自身不持有状态、监听器、观察器或定时器。两种形式在挂载时都会安装共享的文档级按压控制器；只有按钮携带其按压标记。

## Accessibility contract

- **AR1 — 计数名称。** 两种形式都由翻译后的计数命名，绝不使用自定义 children 命名；调用方 `aria-labelledby` 会到达根元素并改为命名任一形式，而调用方 `aria-label` 会被替换。
- **AR2 — 角色。** 除非调用方提供角色，静态形式是一个图像；可点击形式是带有共享 focus-visible 轮廓的原生按钮。
- **AR3 — 组参与。** 只有可点击形式会加入 AvatarGroup 的轮巡集合。
- **AR4 — 目标尺寸。** 可点击指示器的目标至少为 24 × 24 CSS 像素，或具有 WCAG 2.2 2.5.8 允许的间距。从 `xsm` 起，按钮至少为 24 × 24，并绘制在其重叠的头像之上。实现缺口：在尺寸为 16px 的组中，按钮高 20px。

## Design relationships

| Anatomy or state | Design requirement                              | Representation authority | Hierarchy role | Component contract |
| ---------------- | ----------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 计数标签         | 在中性徽标上的紧凑辅助计数，与头像匹配。        | 当前源码与文档           | 辅助           | FR2, FR4, AR1      |
| 按钮行为         | 带有共享覆盖层与 focus-visible 处理的原生按钮。 | 当前源码与共享工具       | 辅助操作       | FR1, FR6, AR2, AR3 |

主题化：根元素是 `avatar-group-overflow` 目标；计数标签继承它。使用方解剖结构未命名任何根部件，因此未声明 anatomy-theming 块。

## Family and system relationships

- `component:AvatarGroup` 提供尺寸、形状与重叠，并拥有可点击形式所加入的轮巡集合。
- `architecture:component-theming-surface` 拥有目标限定与反射。
- `architecture:public-component-api` 拥有透传、样式组合与 ref 规则。
- `spec:AST-002` 拥有对此公共表面的任何变更的准入。

## Verification map

| Contract       | Verification                                                                                | Representative states                | Mutation or failure expectation                                                                                                                                                                                                                                                         | Audit section                             |
| -------------- | ------------------------------------------------------------------------------------------- | ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1, AR2       | `AvatarGroupOverflow.test.tsx` 的渲染、角色与回调测试                                       | 静态、调用方角色、可点击             | 错误元素、丢失的 `img` 角色或调用方角色、缺失的按钮或丢失的回调都会失败。缺口：按钮的 `type="button"`、其焦点轮廓以及悬停与按下覆盖层没有自动化检查。                                                                                                                                   | `audit:AvatarGroupOverflow/behavior`      |
| FR2, AR1, ORD2 | `AvatarGroupOverflow.test.tsx` 的计数、内容与区域测试                                       | 零、负数、大数、自定义内容、已本地化 | 负数计数、错误的默认 “+N” 或名称、缺失的自定义内容或未翻译的名称都会失败。缺口：没有测试断言使用自定义 children 时的名称、调用方 `aria-label` 被替换、调用方 `aria-labelledby`，或拥有自身数字的区域设置；大数测试断言的是未格式化的 “+4912” 与 “4,912 more” 并列，这正是已记录的缺口。 | `audit:AvatarGroupOverflow/behavior`      |
| FR3, ORD1      | `AvatarGroupOverflow.test.tsx` 的尺寸与形状测试                                             | 成组；独立                           | 丢失组的尺寸或形状会失败。缺口：没有测试断言独立的 `md`、`circle` 与无重叠回退，或层条款。                                                                                                                                                                                              | `audit:AvatarGroupOverflow/layout`        |
| FR4            | `AvatarGroup.test.tsx` 的重叠测试；`AvatarGroupOverflow.stories.tsx`                        | 成组、宽计数、每种形状               | 丢失重叠外边距会失败。缺口：盒尺寸、边框、行内增长与内边距、绘制、字号下限与圆角仅在渲染出的测试夹具中可见。                                                                                                                                                                            | `audit:AvatarGroupOverflow/layout`        |
| FR5, ORD3      | `themingTargets.test.ts`；`AvatarGroupOverflow.test.tsx` 的 ref、className 与调用方角色测试 | 两种形式                             | 目标漂移、丢失的 ref、被丢弃的 `className`，或不再到达静态形式、或落在其 `role="img"` 之前的调用方 prop，都会失败。缺口：没有测试覆盖 `xstyle`、`style`、按钮形式的透传，或 ORD3 顺序的其余部分。                                                                                       | `audit:AvatarGroupOverflow/theming`       |
| FR6, AR3       | `AvatarGroup.test.tsx` 的溢出轮巡测试                                                       | 可交互头像之后的按钮                 | 按钮未出现在轮巡集合中会失败。缺口：没有测试断言静态形式不带标记，或其在上的调用方 `tabIndex` 会被转发。                                                                                                                                                                                | `audit:AvatarGroupOverflow/accessibility` |
| 从右到左       | `apps/storybook/rtl-audit/targets.json` 条目                                                | 两个方向下的成组溢出                 | 缺口：审计列出了该测试夹具，但没有任何自动化检查会在头像到溢出的顺序未镜像时失败。                                                                                                                                                                                                      | `audit:AvatarGroupOverflow/i18n-rtl`      |
| PR1            | 源码审查                                                                                    | 两种形式                             | 缺口：若指示器新增自身状态、监听器、观察器或定时器，没有自动化检查会失败。                                                                                                                                                                                                              | `audit:AvatarGroupOverflow/behavior`      |
| AR1, AR2       | 无障碍树证据（`spec:AST-009` FR3）                                                          | 静态与可点击形式                     | 缺口：没有无障碍树检查能证明图像或按钮角色以及计数名称；单元测试查询的是 DOM。                                                                                                                                                                                                          | `audit:AvatarGroupOverflow/accessibility` |
| AR4            | 在浏览器中的 `AvatarGroupOverflow.stories.tsx`                                              | 组内可点击指示器                     | 缺口：没有自动化目标尺寸检查；16px 的组是已记录的缺口。                                                                                                                                                                                                                                 | `audit:AvatarGroupOverflow/accessibility` |

## Decision log

无记录。该记录描述已交付的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到其所有者。
