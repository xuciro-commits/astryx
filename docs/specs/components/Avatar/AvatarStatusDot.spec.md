---
schema_version: 3
template_version: 7
kind: component
id: component:AvatarStatusDot
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Avatar/AvatarStatusDot.test.tsx,
    packages/core/src/Avatar/Avatar.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/AvatarStatusDot.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:component-style-authoring,
    architecture:public-component-api,
    architecture:theme-tokens,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-009, spec:AST-038]
---

# AvatarStatusDot component contract

## Contract at a glance

| Area                    | Contract                                                                                                                       |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 一个用于 Avatar 的 `status` 槽位的状态圆点，带 `variant`（默认 `success`）、可选 `label` 和可选 `icon`。                       |
| Behavior                | 圆点根据所属 Avatar 按三个层级自行确定尺寸，为每个内置变体搭配一种不同的形状，并将其标签报告给 Avatar。                        |
| End-user impact         | 屏幕阅读器用户从 Avatar 的名称中听到状态；视力正常的用户可通过形状以及颜色区分状态。                                           |
| Builder impact          | 无；本条记录描述已发布的行为。                                                                                                 |
| Compatibility/readiness | 已发布的行为被记录为 current；无 API、默认值或输出变更。有一处实现缺口列在 Current-state impact 下。                           |
| Review checks           | 拒绝仅靠颜色区分的置入变体、暴露 glyph 或 icon 的置入变体，或不再传递到所属 Avatar 的 label。                                  |
| Governing rules         | `architecture:component-theming-surface/INV2,INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV8`；WCAG 2.2 1.4.1。 |

此表是审查投影；下文正文具有权威性。

## Intent

AvatarStatusDot 渲染通过 Avatar 的 `status` 槽位组合而成的紧凑状态指示器。它负责圆点的尺寸层级、其内置的非颜色标记，以及将其标签报告到所属 Avatar 的无障碍名称中。

## Compatibility and migration

- 已发布的默认值保留：`yes`
- 兼容性类别：记录已发布的行为；无公开 prop、默认值、DOM、目标或样式输出变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档和发布说明。

## Current-state impact

- **没有回退的增强变体（FR6）。** `AvatarStatusDotVariantMap` 接纳由主题新增的名称，但没有内置规则的名称会渲染圆点的几何形状和 `data-variant`，而没有填充、墨色或 glyph。调用方提供带 `style` 颜色的 `icon` 可以覆盖中等和大层级，但小层级会丢弃 icon，而且没有任何东西绘制与主题无关的基线。`architecture:component-theming-surface` INV14 要求可扩展的视觉轴具有安全的、与主题无关的基线。

## Ownership boundary

**拥有**

- 被绘制的状态圆点根元素及其 `avatar-status-dot` 目标。
- 内置的填充、环形和减号视觉分支以及 `avatar-status-dot-glyph` 目标。
- 根据 Avatar 解析后的数值尺寸进行尺寸层级解析。
- 将其可选状态标签报告到 Avatar 的无障碍名称中。

**不拥有 / 非目标**

- Avatar 身份、图像回退、形状、状态放置或交互行为 —— 由 `component:Avatar` 拥有。
- 调用方提供的 icon 内容的含义或图稿。

## Public concepts

使用方语法仍保留在 `AvatarStatusDot.doc.mjs` 中。

| Concept        | Closed values or states                                        | Meaning                                        | Availability by variant/orientation/state | Default      | Owner                                  | Stability | Invalid-value behavior                                                                               |
| -------------- | -------------------------------------------------------------- | ---------------------------------------------- | ----------------------------------------- | ------------ | -------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| Status variant | 内置 `success`、`neutral`、`error`；已发布的映射也接纳增强名称 | 选择底板颜色和内置非颜色标记。                 | 所有尺寸层级；LTR 和 RTL。                | `success`    | `component:AvatarStatusDot`            | Stable    | 增强名称会作为 `data-variant` 反映，并保持安全的、与主题无关的基线（FR6）；目前它没有，即 FR6 缺口。 |
| Status label   | 字符串或不存在                                                 | 为独立圆点命名，并报告到所属 Avatar 的名称中。 | 每个变体和尺寸。                          | 不存在       | 调用方提供含义；组件暴露并报告它       | Stable    | 空或缺失的标签不在圆点上发出 role 或无障碍名称，也不报告状态名称。                                   |
| Custom icon    | 可渲染的 React 内容或不存在                                    | 在尺寸层级有空间时替换内置 glyph。             | 中等和大层级；小层级隐藏。                | 不存在       | 调用方拥有图稿；组件拥有放置和抑制规则 | Stable    | 布尔值和空字符串会被忽略；即使组件不渲染任何 DOM，仍会抑制内置 glyph。                               |
| DOM extension  | 受支持的 BaseProps 输入和 ref                                  | 扩展根元素并合并使用方样式。                   | 每个渲染分支。                            | 无额外输入。 | `architecture:public-component-api`    | Stable    | BaseProps 的遗漏仍不受支持。                                                                         |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                  | Basis                                                                       |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| FR1 | Avatar 尺寸不超过 36px 时解析为 10px 的圆点、1px 边框且无自定义 icon；40–72px 解析为 20px 圆点和 2px 边框、12px icon；96px 及以上解析为 32px 圆点和 4px 边框、18px icon。边框为 surface 颜色。在同一层中的 Avatar 之外（`spec:AST-038` FR7、FR8）时，圆点使用 36px 层级。                                                                                                                                                  | 当前源代码、测试和 stories                                                  |
| FR2 | `success` 绘制填充的 `--color-success` 底板，且无内部 glyph；`neutral` 绘制 surface 底板，带以次要文本颜色绘制的环形；`error` 绘制 `--color-error` 底板，带以 `--color-on-error` 绘制的减号条，而 `success` 将 `--color-on-success` 设为其墨色。glyph 按层级以 1、1.5 或 2px 的 `currentColor` 描边；减号占内部区域的 75%，带圆形端点。这些底板是强状态填充，其墨色是对应的内容角色（`architecture:theme-tokens` INV11）。 | 当前源代码、测试和使用方文档                                                |
| FR3 | 在中等和大层级，可渲染的 `icon` 内容会替换内置 glyph，并在尺寸与该层级 icon 尺寸一致的、对辅助技术隐藏的包装器中居中。在小层级，icon 被省略，内置 glyph 保留。布尔值和空字符串不可渲染。                                                                                                                                                                                                                                   | 当前源代码和测试                                                            |
| FR4 | 非空 `label` 会为圆点添加 `role="img"` 和 `aria-label`。圆点在绘制前将同一标签报告给所属 Avatar，无论包装深度如何，并在卸载时撤回该标签。                                                                                                                                                                                                                                                                                  | 当前源代码和 Avatar 集成测试                                                |
| FR5 | 根元素带有 `avatar-status-dot` 和 `variant`；环形和减号 SVG 带有 `avatar-status-dot-glyph` 和 `shape`。受支持的使用方 prop 和 ref 到达根元素；圆点自身的 role、名称和样式在调用方 prop 之后应用，而 `xstyle`、`className` 和 `style` 按该顺序合并。                                                                                                                                                                        | 当前源代码、文档和目标测试                                                  |
| FR6 | 已发布的 `AvatarStatusDotVariantMap` 接纳增强名称，且可扩展的视觉轴具有安全的、与主题无关的基线（`architecture:component-theming-surface` INV14）。对于不匹配的名称，根几何形状和反映的 `data-variant` 保留，而内置的填充、墨色和 glyph 缺失；在中等和大层级，调用方带 `style` 颜色的 `icon` 提供颜色和标记，而在小层级 icon 不渲染。实现缺口：没有与主题无关的基线为不匹配的名称绘制任何内容（见 Current-state impact）。 | 当前源代码、文档、聚焦测试和 `architecture:component-theming-surface/INV14` |

### Allowed variation

- **AV1 — 身份与含义。** 状态标签和调用方 icon 图稿可以变化。
- **AV2 — 主题输出。** 目标与反映的轴可以通过公开主题系统变化，而不移动目标所有权。
- **AV3 — 使用方样式。** 受支持的 BaseProps 输入可以在根元素上变化，而组件拥有的尺寸和报告行为保持不变。

### Representative states

| State                  | Required invariant                                                                | Allowed variation                             |
| ---------------------- | --------------------------------------------------------------------------------- | --------------------------------------------- |
| Built-in variants      | 填充、环形和减号分支以及反映的 `variant` 保留。                                   | 标签、Avatar 内容、尺寸、主题和方向可以变化。 |
| Small tier             | 圆点和内置形状保留；自定义 icon 被省略。                                          | 内置变体和标签可以变化。                      |
| Medium and large tiers | 层级尺寸生效；可渲染的自定义 icon 替换 glyph。                                    | icon 图稿、变体、标签和主题可以变化。         |
| Labelled               | 圆点暴露其标签并向 Avatar 报告。                                                  | 调用方编写的标签可以变化。                    |
| Unlabelled             | 圆点没有 role 或名称，也不报告状态标签。                                          | 视觉变体和 icon 仍可渲染。                    |
| Augmented variant      | 根几何形状和反映的 `data-variant` 渲染；内置填充、墨色和 glyph 缺失（FR6 缺口）。 | 主题可以为新增的名称绘制。                    |
| RTL                    | 圆点内容与方向无关；Avatar 拥有逻辑角位置。                                       | 主题、变体、尺寸、标签和 icon 可以变化。      |

### Transformation and precedence order

- **ORD1 — 解析尺寸。** 取所属 Avatar 的解析后尺寸（在同一层中的 Avatar 之外为 36px），然后选择离散的尺寸层级和尺寸。
- **ORD2 — 解析标记。** 当层级允许时，可渲染的 icon 优先；否则在存在时选择内置变体 glyph。
- **ORD3 — 解析根元素。** 调用方 prop → role 和名称 → 组件目标和样式 → `xstyle` → `className` → `style`。

### Performance and resources

- **PR1 — 不重新渲染的报告。** 报告或撤回标签不会导致圆点或 Avatar 的额外渲染，也不会留下监听器、观察者或计时器。

## Accessibility contract

- **AR1 — 无障碍名称。** 非空 `label` 为独立圆点命名，并组合进所属 Avatar 的名称。
- **AR2 — 装饰性视觉标记。** 内置 SVG 和自定义 icon 包装器对辅助技术隐藏，因为根元素或 Avatar 名称承载状态。
- **AR3 — 内置非颜色线索。** 三个内置变体除语义颜色外还使用填充、环形和减号拓扑（WCAG 2.2 1.4.1）。调用方 icon 在中等和大层级替换该标记，因此非颜色区分随后取决于调用方为每个状态使用不同的 icon。

## Design relationships

| Anatomy or state | Design requirement                     | Representation authority                   | Hierarchy role     | Component contract |
| ---------------- | -------------------------------------- | ------------------------------------------ | ------------------ | ------------------ |
| Status-dot root  | Avatar 边缘上的紧凑语义状态底板。      | 当前源代码和使用方文档；无当前组件设计记录 | 辅助指示器         | FR1, FR2, FR5      |
| Built-in glyph   | 环形或减号以非颜色补充 neutral/error。 | WCAG 2.2 SC 1.4.1 加上当前已发布的表示     | 有意义的非文本线索 | FR2, AR3           |
| Custom icon      | 在空间允许处，调用方图稿替换内置标记。 | 调用方拥有图稿；当前源代码拥有放置         | 条件性有意义线索   | FR3, AR2, AR3      |

## Family and system relationships

- `architecture:component-theming-surface` 拥有绘制目标资格、反映的轴，以及可扩展视觉轴所需的可靠的、与主题无关的回退；FR6 记录针对它的缺口。
- `architecture:component-style-authoring` 拥有 StyleX 降级，并允许此处使用的组件拥有的非 glyph SVG 形状。
- `architecture:public-component-api` 拥有已发布的子路径、BaseProps 透传、样式组合、ref 可达性和兼容性边界。
- `architecture:theme-tokens` 拥有语义颜色和圆角词汇表。
- `spec:AST-002` 拥有 API 准入，并要求未来的公开行为或默认值变更指明当前权威。

## Verification map

| Contract          | Verification                                                           | Representative states                           | Mutation or failure expectation                                                                                   | Audit section                         |
| ----------------- | ---------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| FR1–FR3, AR2, AR3 | `AvatarStatusDot.test.tsx` 和 `AvatarStatusDot.stories.tsx` 在浏览器中 | 三个尺寸层级、三个内置项、自定义 icon 存在/缺失 | 尺寸层级、标记选择、隐藏 icon 或内置形状漂移会导致聚焦断言或渲染测试夹具失败。                                    | `audit:AvatarStatusDot/behavior`      |
| FR4, AR1          | `Avatar.test.tsx` 状态名称套件和 `AvatarStatusDot.test.tsx`            | 直接/包装/变化/移除的标签；有标签和无标签的圆点 | 丢失独立或组合状态名称、提交阶段更新或清理会导致 role/name 断言失败。                                             | `audit:AvatarStatusDot/accessibility` |
| FR5               | `themingTargets.test.ts` 和 `extensibleAxes.test.ts`                   | 内置和增强变体、glyph 环形/减号                 | 缺少目标元数据或轴接线会导致结构检查失败。缺口：没有测试渲染圆点以检查使用方 prop、ref 和样式输入是否到达根元素。 | `audit:AvatarStatusDot/theming`       |
| FR6               | `AvatarStatusDot.test.tsx` 增强变体测试                                | 没有匹配内置规则的增强名称                      | 为不匹配的名称出现 glyph 会导致失败。缺口：填充出现以及调用方 `icon` 路径没有自动化检查。                         | `audit:AvatarStatusDot/api`           |
| RTL relation      | `AvatarStatusDot.stories.tsx` 在浏览器中按两个方向                     | 所有尺寸层级上的内置项                          | 新的方向性 glyph、物理定位或不匹配的变换会在渲染测试夹具中可见。                                                  | `audit:AvatarStatusDot/i18n-rtl`      |
| Record structure  | `scripts/check-knowledge.mjs`                                          | 本条记录                                        | 缺少必需的结构或关系会导致仓库校验失败。                                                                          | `audit:AvatarStatusDot/docs`          |
| PR1               | `Avatar.test.tsx` 无额外渲染测试                                       | 包装的状态标签                                  | 额外渲染或报告循环会导致失败。                                                                                    | `audit:AvatarStatusDot/behavior`      |
| AR1, AR2          | 无障碍树证据（`spec:AST-009` FR3）                                     | 有标签和无标签的独立圆点                        | 缺口：没有无障碍树检查证明独立 image role 和名称或隐藏的标记；单元测试查询的是 DOM。                              | `audit:AvatarStatusDot/accessibility` |

## Decision log

无记录。本条记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方示例、当前审查分数、截图、运行清单、资格数据或共享的 API/主题规则。它链接到它们的拥有者。
