---
schema_version: 3
template_version: 7
kind: component
id: component:Divider
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-27
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility, testing]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/Divider/Divider.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Divider.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-020]
---

# Divider component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                       |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | `orientation`、`label`、主题可扩展的 `variant`、`isFullBleed`、`BaseProps<HTMLDivElement>`，以及一个根 `ref`。                                                                                                             |
| 行为          | 分隔符在没有标签时渲染一条线，在有可渲染标签时于标签两侧渲染两条线；full bleed 消耗继承来的逻辑容器内缩。                                                                                                                  |
| 最终用户影响  | 人们能在水平、垂直、带标签、full bleed、窄幅以及 RTL 的组合中感知到一个具名分隔符。                                                                                                                                        |
| 构建者影响    | 无；本记录描述已发布行为。数值零是有效标签；布尔值与空字符串会留下一条连续的无名线。                                                                                                                                       |
| 兼容性/就绪度 | 已发布行为被记录为 current；没有 API、默认值或输出变化。两处实现缺口列在 Current-state impact 下。                                                                                                                         |
| 审查检查      | 拒绝缺失的数值标签、物理边缘 bleed、被丢弃的根输入，以及与渲染出的分隔符不一致的目标或轴。                                                                                                                                 |
| 治理规则      | `architecture:public-component-api/INV1,INV5–INV9`；`architecture:component-theming-surface/INV3–INV7,INV14`；`architecture:container-padding/INV1,INV3,INV7–INV10`；WCAG 2.2 SC 1.3.1 与 4.1.2，经由 `spec:AST-020/FR1`。 |

该表是审查投影；下方正文具有权威性。

## Intent

Divider 在调用方拥有的内容区域之间提供程序化与视觉上的分隔。它拥有方向、线宽、可选的标签放置与命名、逻辑 full-bleed 几何，以及聚合的 `divider` 主题目标。调用方拥有周围区域的含义。

使用方语法与示例属于 `Divider.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：是——水平、subtle、无标签，且不是 full bleed。
- 兼容类别：记录已发布行为；没有公共 prop、默认值、DOM 或样式输出的变化。React 能渲染的 ReactNode 值（包括数值零）留在标签包装器内部；被跳过的标量标签会留下一条连续的无名线。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **主题新增的 variant 缺少线条绘制（FR3）。** `DividerVariantMap` 接受主题新增的值，但未匹配的值会让内部线条不被绘制，于是这条线可能消失。`architecture:component-theming-surface` INV14 要求可扩展的视觉轴具备安全的、与主题无关的基线；OQ2 承载修复方向。
- **调用方的 `role` 与 `aria-orientation` 被替换（FR6）。** Divider 在调用方 props 之后设置 `role="separator"` 与 `aria-orientation`，因此调用方显式给出的值永远到不了根元素，而 `architecture:public-component-api` INV5 允许调用方的显式输入到达该元素。

## Ownership boundary

**拥有**

- 一个语义分隔符根元素及其公共 ref、DOM、data、ARIA、class、style、event 与 `xstyle` 组合。
- 水平与垂直的线条几何。
- 可选的标签放置以及分隔符的命名关系。
- 内置的 subtle 与 strong 线宽。
- 反映出来的自定义 variant 状态，包括 Current-state impact 下记录的缺失线条绘制回退。
- 对继承容器内缩的逻辑 full-bleed 消耗。
- 聚合的 `divider` 目标，以及反映出来的 orientation 与 variant 轴。

**不拥有 / 非目标**

- 周围内容区域的含义或标题结构——由产品调用点拥有。
- 容器内缩的发布——由 `architecture:container-padding` 拥有。
- Rule 或 Label 的独立公共目标——不存在；OQ1 承载该问题。
- 由主题创作的自定义 variant 绘制，以及应当拥有它的公共部件——OQ2 承载该问题。

## Public concepts

| 概念       | 封闭值或状态                                  | 含义                                                             | 按 variant/方向/状态的可用性 | 默认值       | 拥有者                       | 稳定性                      | 无效值行为                                                                       |
| ---------- | --------------------------------------------- | ---------------------------------------------------------------- | ---------------------------- | ------------ | ---------------------------- | --------------------------- | -------------------------------------------------------------------------------- |
| 方向       | `horizontal`；`vertical`                      | 选择分隔符轴、线条几何与 `aria-orientation`。                    | 每个 divider                 | `horizontal` | component                    | stable                      | 封闭联合；由类型系统拒绝                                                         |
| 标签       | 可渲染的 ReactNode；被省略或被跳过的标量      | 在两条线之间插入一个标签，并为其命名，除非显式的 ARIA 命名胜出。 | 每种方向与 variant           | 省略         | caller/component             | stable                      | `null`、布尔值与空字符串不渲染标签；数值零保持可见                               |
| Variant    | `subtle`；`strong`；主题新增的视觉值          | 选择线条绘制，并在目标上反映请求的值。                           | 每种方向与标签状态           | `subtle`     | component/theme              | 内置值 stable；主题可扩展轴 | 未匹配的自定义值会让线条不被绘制（FR3）                                          |
| Full bleed | false；true                                   | 在 divider 轴上消耗继承的逻辑容器内缩。                          | 每种方向                     | false        | component/container protocol | stable                      | 缺失的变量解析为零                                                               |
| 根表面     | ref；DOM/data/ARIA；class/style/xstyle/events | 扩展语义分隔符根元素。                                           | 每个 divider                 | 省略         | public component API         | stable                      | 接受的输入会组合；调用方的 `role` 或 `aria-orientation` 目前会被替换（FR6 缺口） |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                      | 依据                                                               |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| FR1 | 分隔符在没有可渲染标签时渲染一条线，在有标签时渲染两条线并把标签放在中间。数值零是可渲染标签；`null`、布尔值与空字符串不渲染标签。水平 divider 是满宽的 flex 行，垂直 divider 是满高的 inline flex 列；标签使用辅助字体样式与次级文字色，并在 divider 的轴上使用 `--spacing-3` 内边距。                                     | 已发布的 ReactNode API；当前源码、文档与测试                       |
| FR2 | 默认情况下根元素暴露 `role="separator"` 与选定的 `aria-orientation`；调用方显式的 `role` 或 `aria-orientation` 胜出并按原样使用，即使它与 `orientation` 矛盾（FR6）。可渲染的标签通过 `aria-labelledby` 为其命名，除非调用方提供了 `aria-label` 或 `aria-labelledby`。                                                      | WCAG 2.2 SC 1.3.1 与 4.1.2；当前源码与测试                         |
| FR3 | `subtle` 用 `--color-border` 绘制线条，`strong` 用 `--color-border-emphasized`，宽度为 `--border-width`。导出的映射接受主题新增的值，根元素会反映它们，并且可扩展的视觉轴具备安全的、与主题无关的基线（`architecture:component-theming-surface` INV14）。实现缺口：未匹配的值会让内部线条不被绘制（Current-state impact）。 | `architecture:component-theming-surface/INV4,INV6,INV14`；当前源码 |
| FR4 | full bleed 为水平 divider 消耗继承的逻辑 inline 内缩，为垂直 divider 消耗逻辑 block 内缩，并按相同数值扩展盒子；内缩缺失时解析为零。                                                                                                                                                                                        | `architecture:container-padding/INV1,INV3,INV7–INV10`；当前源码    |
| FR5 | 根元素携带 `divider` 目标，并反映 `orientation` 与请求的 `variant`。Rule 与 Label 不携带公共目标。反映出的 `data-orientation` 与 `data-variant` 是组件拥有的主题状态，会替换调用方的值。                                                                                                                                    | `architecture:component-theming-surface/INV3–INV6`；当前源码与文档 |
| FR6 | `ref`、DOM、data、ARIA、class、style、event 与 `xstyle` 输入会到达分隔符根元素或在其上组合，调用方显式的 `role` 或 `aria-orientation` 也会到达（`architecture:public-component-api` INV5）。实现缺口：组件在调用方 props 之后设置 `role` 与 `aria-orientation`，因此调用方的值会被替换（Current-state impact）。            | `architecture:public-component-api/INV5–INV8`；当前源码与测试      |

### Allowed variation

- **AV1 — 标签内容。** 任何 React 能渲染的、由调用方拥有的 ReactNode 都可以填充标签包装器。
- **AV2 — 主题绘制。** 活跃主题可以重设聚合目标及其 variant 轴的样式。OQ2 承载未解决的内线绘制与回退边界。
- **AV3 — 容器几何。** full bleed 遵循继承的逐边内缩，包括不对称值与零值。

### Representative states

| 状态                       | 必需不变式                                                    | 允许的变体                   |
| -------------------------- | ------------------------------------------------------------- | ---------------------------- |
| 无标签水平                 | 一条 subtle 或 strong 的 inline 线；水平分隔符语义            | 容器宽度与主题绘制           |
| 有标签水平                 | 一个可见的具名标签两侧各一条线                                | 任何可渲染的标签内容         |
| 数值零标签                 | 标签包装器内一个可见的 `0`；分隔符名称为 `0`                  | 任何方向或 variant           |
| 垂直有标签/无标签          | block 轴上的线条与垂直分隔符语义                              | 容器高度与标签内容           |
| 主题新增且未匹配的 variant | 请求的 variant 被反映；内部线条没有组件拥有的绘制（FR3 缺口） | 自定义 variant 名称          |
| Full bleed                 | 在不假设物理方向的前提下消耗逻辑轴内缩                        | 均匀、不对称、零或缺失的内缩 |
| RTL                        | 水平几何保持逻辑化；full bleed 独立消耗 inline 起止边         | 周围内容与标签语言           |

### Transformation and precedence order

- **ORD1 — 标签存在性。** 应用共享的可渲染值判定；当标签保留时，在两条线之间渲染并引用一个包装器。
- **ORD2 — 无障碍名称。** 显式的 `aria-labelledby` 胜出，其次是显式的 `aria-label`，再次是渲染出的标签包装器；无标签的分隔符保持无名。
- **ORD3 — Variant 绘制。** 在根目标上反映请求的值。内置值选择 subtle 或 strong 的内部线条绘制；未匹配的自定义值不选择任何内部线条绘制（FR3）。

### Performance and resources

- **PR1 — 无外部生命周期。** Divider 不安装任何监听器、观察器、定时器、请求、状态机或 Effect。

## Accessibility contract

- **AR1 — 程序化分隔符。** 默认情况下根元素暴露分隔符角色与精确的视觉方向；调用方显式的 `role` 或 `aria-orientation` 胜出（FR6），而目前组件的值会替换它（FR6 缺口）。
- **AR2 — 标签关系。** 渲染出的标签为分隔符命名，除非调用方提供了显式的无障碍名称关系。
- **AR3 — 装饰性线条片段。** 内部线条元素不额外添加角色、名称、焦点目标或交互。

## Design relationships

| 解剖或状态 | 设计要求                                                         | 表示权威                        | 层级角色   | 组件契约 |
| ---------- | ---------------------------------------------------------------- | ------------------------------- | ---------- | -------- |
| Divider 组 | 在一条逻辑轴上安排线条片段与可选标签。                           | 当前源码；容器几何来自当前架构  | supporting | FR1, FR4 |
| 线条       | 绘制可见的 subtle 或 strong 分隔线；主题新增的值缺少确定的回退。 | 当前源码；自定义回退即 FR3 缺口 | supporting | FR3      |
| 标签       | 使用辅助文字 token 在两条线之间呈现可选内容。                    | 当前源码；无独立目标（OQ1）     | prominent  | FR1–FR2  |

未记录组件本地的设计决策。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Divider group": {"target": "divider"},
  "Rule": {
    "none": {
      "reason": "unsettled: No current public target reaches this part"
    }
  },
  "Label": {
    "none": {
      "reason": "unsettled: No current public target reaches this part"
    }
  }
}
```

两个 `none` 处置记录了没有公共目标到达 Rule 或 Label；它们是否应获得目标由 OQ1 承载。

## Family and system relationships

- `architecture:container-padding` 拥有继承的内部内缩协议；Divider 仅通过 `isFullBleed` 消耗它。
- `architecture:component-theming-surface` 为目标、反映轴与解剖资质设定规则，并要求开放的视觉轴具备确定性的回退。Divider 的自定义值路径不满足该要求（FR3）；OQ2 承载修复方向。
- `architecture:public-component-api` 拥有根组合、ref 行为，以及已发布 ReactNode 标签表面的兼容性。
- 当前没有 Divider family 或设计记录。

## Verification map

| 契约               | 验证                                                                                                     | 代表状态                                   | 变异或失败预期                                                                                                                                                                                                                                      | 审计小节                 |
| ------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1, FR2, AR1, AR2 | `Divider.test.tsx` 的方向、标签、命名与数值零测试                                                        | 有标签与无标签、数值零、显式名称、两种方向 | 在包装器之外渲染零、有标签的分隔符缺少名称，或角色、方向、名称漂移都会失败。缺口：稳定视觉基线（`core-divider--default`）只覆盖无标签的水平默认值；垂直布局与标签的字体样式和内边距没有自动化检查。                                                 | `audit:Divider/a11y`     |
| AR3                | 源码审查                                                                                                 | 有标签与无标签                             | 缺口：若线条片段获得角色、名称或 tab 停靠点，没有自动化检查会失败。                                                                                                                                                                                 | `audit:Divider/a11y`     |
| FR3, FR5           | `Divider.test.tsx` 的 variant 与目标测试；`themingTargets.test.ts`；稳定视觉基线 `core-divider--default` | subtle、strong、两种方向；默认             | 丢失 class 或 `orientation`/`variant` 的反映会失败；默认线条绘制的变更会返回以供审查。缺口：strong 绘制与未匹配的主题新增路径没有自动化检查。                                                                                                       | `audit:Divider/theming`  |
| FR4                | `@astryx/no-physical-properties` lint 规则；`Divider.stories.tsx` 的 full-bleed 测试夹具                 | 水平与垂直、LTR 与 RTL、缺失内缩           | Divider 样式中出现物理 left/right 属性会导致 lint 失败。缺口：`Divider.test.tsx` 的 full-bleed 测试只检查元素是否渲染，因此当 full bleed 未应用、应用在错误的轴上或使用非零回退时没有自动化检查会失败，且没有覆盖 full bleed 的浏览器从右到左检查。 | `audit:Divider/layout`   |
| FR6                | `Divider.test.tsx` 的 ref 与透传测试                                                                     | ref、额外 props                            | 丢失 ref 或调用方 prop 会失败。缺口：ref 测试接受任何元素，因此包装器上的 ref 也能通过；没有测试覆盖样式输入的合并，或调用方的 `role` 或 `aria-orientation`。                                                                                       | `audit:Divider/behavior` |
| PR1                | 源码审查                                                                                                 | 每种状态                                   | 缺口：若 Divider 新增监听器、观察器、定时器或 effect，没有自动化检查会失败。                                                                                                                                                                        | `audit:Divider/behavior` |
| AR1, AR2           | 无障碍树证据（`spec:AST-009` FR3）                                                                       | 有标签与无标签的分隔符                     | 缺口：没有无障碍树检查能证明分隔符角色、方向或名称；单元测试查询的是 DOM。                                                                                                                                                                          | `audit:Divider/a11y`     |

## Decision log

未记录。本记录描述已发布行为。

## Open questions

- **OQ1 — Rule 或 Label 是否应获得稳定的公共主题目标？**（`human-api`）目前没有公共目标到达它们；这种缺失并不决定答案。
- **OQ2 — 应关闭开放的 `variant` 轴，还是由哪个绘制部件拥有其确定性的自定义值回退？**（`human-api`）根目标可以承载主题绘制，而内部线条承载内置绘制。应用 subtle 的内部回退可能覆盖已有的根背景；保留当前路径可能让线条消失。选项：关闭该轴、移动目标归属，或让绘制经过一个已审查的公共属性。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
