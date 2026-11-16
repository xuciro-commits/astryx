---
schema_version: 3
template_version: 7
kind: component
id: component:Card
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    .github/visual-baseline/manifest.json,
    packages/core/src/Card/Card.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/Card.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:public-component-api,
  ]
contributing: []
system_specs: []
---

# Card component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                  |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 一个容器，带有尺寸属性、按间距刻度取值的 `padding`、可由主题扩展的 `variant`，以及静止状态的 `elevation`。                                                |
| Behavior                | Card 绘制圆角表面，通过 container-padding 协议把自身的内边距发布给后代，并且只有 `default` 变体绘制边框。                                                 |
| End-user impact         | 读者在一致的表面上看到被分组的内容；在默认边框与主题边框宽度下，无论是否绘制边框，内容内缩量都落在间距刻度上，但零内边距时例外。                          |
| Builder impact          | 无；该记录描述的是已发布的行为。                                                                                                                          |
| Compatibility/readiness | 已发布的行为被记录为 current；没有 API、默认值或输出方面的变更。有一处实现缺口列在 Current-state impact 下。                                              |
| Review checks           | 拒绝这样的卡片：在 min-content 宽度上占住自己的轨道、某个变体落到另一个变体、丢失内边距发布、或发布的内缩量与应用的内边距进一步偏离。                     |
| Governing rules         | `architecture:container-padding`（容器发布方）；`architecture:component-theming-surface/INV6,INV14`；`architecture:public-component-api/INV5,INV6,INV8`。 |

该表是审查用的投影；下文正文具有权威性。

## Intent

Card 把一个受限表面上的相关内容分组。它拥有该表面的绘制、边框、圆角和高度，拥有其尺寸设定，以及它发布的内边距，好让 Layout 及其他后代与之对齐。

## Compatibility and migration

- 保留已发布的默认值：`yes`
- 兼容性类别：记录已发布的行为；公共 prop、默认值、DOM 或样式输出均无变更
- 受控/非受控行为：不适用
- 迁移决定：无

使用方迁移说明应放在使用方文档与发布说明中。

## Current-state impact

- **已发布的内缩量超出应用的内边距（FR3）。** 在非零内边距下，`default` 卡应用的内边距按其边框宽度缩减，但发布的是边框加内边距（在 `padding={0}` 时两者一致）。任何延伸到已发布内缩量处的子元素，在任意一条边上——整幅出血的 Divider、一个 Layout，或 List 的 `outset` 或 `bleed` 盒子——都会超出内边距边缘一个边框宽度。固定高度且持有此类子元素的卡片，会在子元素出血的每条轴上滚动该宽度（Layout 情况下两条轴都滚），并且即使内容放得下也会变成一个未命名的 tab 停靠点：在 Chromium 中当其内不含任何可聚焦元素时如此，在 Firefox 中即使含有一个可聚焦子元素也如此。`architecture:container-padding` INV11 要求宿主发布其应用的内边距，而 `component:List` FR8 把 Card 的内容区域计为这样的宿主，所以在非零内边距下的 `default` 卡尚未满足 List FR8：List 的 `outset` 与 `bleed` 列表会越过其内边距边缘一个边框宽度，`bleed` 各行也随之如此。

## Ownership boundary

**拥有**

- Container：表面绘制、边框、圆角、高度、尺寸设定与裁剪。
- 作为容器发布方解析并发布卡片内边距。

**不拥有 / 非目标**

- 卡片内部的内容结构——由调用方和 Layout 拥有。
- 交互——由 `component:ClickableCard` 与 `component:SelectableCard` 拥有，它们组合使用 Card。
- 内边距协议本身——由 `architecture:container-padding` 拥有。

## Public concepts

| Concept   | Closed values or states                                                                                                             | Meaning                                  | Availability by variant/orientation/state | Default        | Owner            | Stability | Invalid-value behavior                                               |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------- | -------------- | ---------------- | --------- | -------------------------------------------------------------------- |
| Variant   | `default`、`transparent`、`muted`、`blue`、`cyan`、`gray`、`green`、`orange`、`pink`、`purple`、`red`、`teal`、`yellow`；主题新增值 | 表面绘制；只有 `default` 绘制边框。      | 始终                                      | `default`      | `component:Card` | 稳定      | 主题新增的值会反映在 `card` 上，并渲染基础表面，不带填充也不带边框。 |
| Elevation | `none`、`low`、`med`、`high`                                                                                                        | 取自阴影 token 刻度的静止阴影。          | 始终                                      | `none`         | `component:Card` | 稳定      | TypeScript 拒绝其他值。                                              |
| Padding   | 间距步长 0、0.5、1、1.5、2、3、4、5、6、8、10；省略                                                                                 | 均匀内边距；省略时使用主题的卡片内边距。 | 始终                                      | 主题卡片内边距 | `component:Card` | 稳定      | TypeScript 拒绝其他值。                                              |
| Sizing    | `width`、`height`、`maxWidth`、`minHeight`：以像素为单位的数字或 CSS 字符串                                                         | 卡片的盒尺寸。                           | 始终                                      | 未设置         | `component:Card` | 稳定      | 字符串按 CSS 原样传递。                                              |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Basis          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | Card 渲染一个携带 `card` 目标的 `div`，该目标反映 `variant` 与 `elevation`，带 `--radius-container` 圆角，以及由选择环与高度阴影组合而成的盒阴影。                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试 |
| FR2 | `default` 用 `--border-width` 的实线 `--color-border` 边框绘制 `--color-background-card`；`transparent` 不绘制任何内容；`muted` 绘制 `--color-background-muted`；每个调色板变体绘制其 `--color-background-<name>` 色调。主题新增的变体会落到基础表面，绝不落到另一个变体。                                                                                                                                                                                                                                                                           | 当前源码与测试 |
| FR3 | Card 作为容器发布方解析内边距：省略 `padding` 时使用主题的卡片内边距（无主题时为间距步长 4），步长对每条边均匀应用。带 `default` 边框时，每条边的内边距按全局 `--border-width` token 缩减（以零为下限），好让边框加内边距与无边框时的内缩量一致。发布的内缩量与应用的内边距一致（`architecture:container-padding` INV11）。实现缺口：在非零内边距下，`default` 卡发布边框加内边距，比其应用的内边距多一个边框宽度，于是整幅出血的子元素会超出内边距边缘，固定高度的卡片会滚动该宽度，且该卡片尚未满足 `component:List` FR8（Current-state impact）。 | 当前源码与测试 |
| FR4 | Card 的最小宽度为零，因此它在自己的轨道中让步，而不是以 min-content 宽度占住轨道，并且裁剪溢出而不成为滚动容器。`height` 不为 `auto` 时它会滚动。`width`、`height`、`maxWidth` 与 `minHeight` 按给定值应用，调用方设置的最小值可以胜过 `width`。                                                                                                                                                                                                                                                                                                     | 当前源码与测试 |
| FR5 | `elevation` 把高度阴影设为无，或设为 low、medium、high 阴影 token。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试 |
| FR6 | `ref` 到达该 `div`。受支持的 DOM、ARIA、data 与事件 prop 到达携带该目标的元素；`xstyle`、`className` 与 `style` 按此顺序在组件样式之后合并，调用方的 `className` 会与该目标类名合并，而不是替换它。                                                                                                                                                                                                                                                                                                                                                  | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制与内边距。** 主题可以按 `variant` 与 `elevation` 重新设定 `card` 的样式，包括边框宽度与颜色，并设定卡片内边距。
- **AV2 — 内容。** 任何内容都可以填充卡片。

### Representative states

| State               | Required invariant                                                                                   | Allowed variation |
| ------------------- | ---------------------------------------------------------------------------------------------------- | ----------------- |
| Default             | 带边框的卡片表面；内缩量等于主题卡片内边距。                                                         | 内容。            |
| Borderless variant  | 无边框；除 `padding={0}` 外内缩量与 `default` 相同，在 `padding={0}` 处 `default` 会加上其边框宽度。 | 变体。            |
| Theme-added variant | 基础表面；`data-variant` 指出新增的值。                                                              | 主题绘制。        |
| Fixed height        | 滚动其内容；仍在轨道中让步。                                                                         | 高度。            |
| Elevated            | 高度阴影与任何环并存。                                                                               | 高度。            |

### Transformation and precedence order

- **ORD1 — 内边距。** `padding` 步长 → 主题卡片内边距 → 间距步长 4；然后对 `default` 按边减去边框宽度，以零为下限。
- **ORD2 — 阴影。** 环与高度在一个阴影列表中组合；两者互不替换。

### Performance and resources

- **PR1 — 静态渲染。** Card 不持有状态，也不使用 hook。

## Accessibility contract

- **AR1 — 不添加语义。** Card 不自行添加角色、名称或 tab 停靠点；其内容的语义原样传递。例外：内容溢出的固定高度卡片是滚动容器（FR4），浏览器可能把它变成未命名的 tab 停靠点，以便键盘用户可以滚动它（Chromium 在其内不含可聚焦元素时如此；Firefox 即使其内含有可聚焦子元素也如此）。

## Design relationships

| Anatomy or state | Design requirement                   | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------ | ------------------------ | -------------- | ------------------ |
| Container        | 带背景、可选边框、内边距的圆角表面。 | 当前源码与文档           | 支撑性         | FR1–FR5            |
| Content          | 已发布内缩量之内的调用方内容。       | 当前源码与文档           | 突出           | FR3, AR1           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "card"},
  "Content": {
    "none": {
      "reason": "intentional: caller content keeps its own styling and has no component-owned paint target"
    }
  }
}
```

## Family and system relationships

- `architecture:container-padding` 把 Card 定为容器发布方；FR3 记录 Card 如何解析并发布其内边距。
- `component:ClickableCard` 与 `component:SelectableCard` 组合使用 Card；选择环与 Card 的高度阴影组合（ORD2）。
- `architecture:component-theming-surface` 设定 `card` 目标遵循的规则（INV6），并把 `variant` 定为可由主题扩展的轴（INV14）。

## Verification map

| Contract            | Verification                                                                                                                                  | Representative states                  | Mutation or failure expectation                                                                                                                                                                                                                              | Audit section         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------- |
| FR1, FR2, FR5, ORD2 | `Card.test.tsx` 的反映、内置变体、高度与主题新增变体测试；稳定的视觉基线 `core-card--default` 与 `core-card--theme-added-variant`（探针主题） | 每个内置变体；各高度；新增值；默认卡片 | 反映丢失、高度没有自己的类名、或主题新增的值落到另一个变体，都会失败；默认表面、边框、圆角或静止阴影发生变化，或主题新增的卡片丢失其主题绘制，会以已变更的形式返回以供审查。缺口：调色板色调、高度阴影值，以及环与阴影的组合，除这两条基线外没有自动化检查。 | `audit:Card/theming`  |
| FR3                 | 浏览器中的 `Card.stories.tsx`                                                                                                                 | 默认与无边框变体；各内边距步长         | 缺口：没有单元测试断言内边距发布或边框扣减；内缩量不一致只能在渲染出的测试夹具中看到。默认卡片中的整幅出血超出没有自动化检查。                                                                                                                               | `audit:Card/layout`   |
| FR4                 | `Card.test.tsx` 的尺寸套件                                                                                                                    | 每个变体；固定高度；调用方最小值       | 占住 min-content 宽度、没有固定高度的滚动容器、或丢失的调用方最小值，都会失败。                                                                                                                                                                              | `audit:Card/layout`   |
| FR6                 | `Card.test.tsx` 的 ref、透传与 className 测试                                                                                                 | Ref；额外 prop；className              | ref 落在另一个元素上、prop 落在目标以外的元素上、或目标类名被替换，都会失败。缺口：没有测试断言 `xstyle`、`className`、`style` 的合并顺序。                                                                                                                  | `audit:Card/behavior` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                 | 使用方解剖结构与当前目标               | 缺失、多余或过时的映射会使仓库校验失败。                                                                                                                                                                                                                     | `audit:Card/theming`  |
| AR1, PR1            | 源码审查                                                                                                                                      | 每个变体                               | 缺口：如果 Card 添加了角色、tab 停靠点、状态或 hook，没有自动化检查会失败。没有测试覆盖固定高度溢出时的 tab 停靠点，无论其内是否含有可聚焦内容。没有测试覆盖固定高度的默认卡片因出血子元素的超出而获得的 tab 停靠点。                                        | `audit:Card/behavior` |

## Decision log

未记录。该记录描述的是已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审查结果、实现步骤或 family/系统规则。它链接到这些内容的拥有者。
