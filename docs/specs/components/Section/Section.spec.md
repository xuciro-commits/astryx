---
schema_version: 3
template_version: 7
kind: component
id: component:Section
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layout/overlayPaddingReset.test.tsx,
    packages/core/src/Layout/layoutReset.test.tsx,
    packages/core/src/AppShell/AppShell.test.tsx,
    .github/visual-baseline/manifest.json,
    packages/core/src/serverSafeComponents.test.ts,
    packages/core/src/Section/Section.test.tsx,
    apps/storybook/stories/Section.stories.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-regions]
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

# Section component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个通用页面区域，具有 `variant`、选定的 `dividers`、带轴与边覆盖的 `padding`，以及盒尺寸。                                         |
| 行为          | 外层包装承担尺寸与调用方输入，并逃出父级的内缩（inset）；内层容器负责绘制 variant 与分隔线，并发布其 padding。                      |
| 最终用户影响  | 读者看到相关内容被归组在一个区域内，该区域的边缘与间距与周边布局对齐。                                                              |
| 构建者影响    | 无；本记录描述的是已发布行为。                                                                                                      |
| 兼容性/就绪度 | 已发布行为记录为 current；没有 API、默认值或输出变更。在 Current-state impact 下列出一处实现缺口。                                  |
| 评审检查      | 拒绝物理的左/右分隔线或 padding、不驱动其对应容器变量的边 padding，或丢失逃逸行为的嵌套 Section。                                   |
| 管辖规则      | `family:layout-regions/FR2,FR4,FR5,FR7–FR9`；`architecture:container-padding`；`architecture:public-component-api/INV5,INV6,INV8`。 |

本表是评审用的投影；下方正文具有权威性。

## Intent

Section 是 layout-regions 族的通用绘制区域。它拥有自身的 variant、选定的分隔线边、组件 padding，以及嵌套 Section 如何逃出父级的内缩。

## Compatibility and migration

- 保留已发布默认值：`yes`
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、DOM、样式或 target 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **绘制区域短于其最小高度（FR1）。** 在设置 `minHeight` 而未设置 `height` 时，包装达到最小高度，但承载背景、分隔线与 padding 的内层容器仍停留在其内容高度。此时 `muted` 或 `section` 区域只绘制其上半部分，其底部分隔线位于包装底边之上。

## Ownership boundary

**拥有**

- 外层包装，以及带 `section` target 的内层绘制容器。
- variant 绘制、选定的分隔线边、组件 padding 及其发布，以及嵌套逃逸。

**不拥有 / 非目标**

- 区域内由调用方提供的内容。
- 槽位排布——由 `component:Layout` 及其区域拥有。
- 地标语义、滚动与响应式替代——不由 Section 提供（`family:layout-regions` FR7–FR9）。

## Public concepts

| 概念     | 封闭取值或状态                                | 含义                  | 按 variant/方向/状态的可及性 | 默认值      | 拥有者              | 稳定性 | 非法值行为                                                                           |
| -------- | --------------------------------------------- | --------------------- | ---------------------------- | ----------- | ------------------- | ------ | ------------------------------------------------------------------------------------ |
| Variant  | `section`、`transparent`、`muted`；主题新增值 | 区域背景。            | 始终                         | `section`   | `component:Section` | 稳定   | 主题新增的取值若无匹配的主题规则，则不绘制任何 Section 背景，并保留 `data-variant`。 |
| Dividers | `top`、`bottom`、`start`、`end` 中任意项      | 哪些边绘制 1px 边框。 | 始终                         | 无          | `component:Section` | 稳定   | TypeScript 拒绝其他取值。                                                            |
| Padding  | 间距步进，可为统一、按轴或按逻辑边            | 内边距，发布给后代。  | 始终                         | 按 FR3 解析 | `component:Section` | 稳定   | TypeScript 拒绝其他取值。                                                            |
| Sizing   | `width`、`height`、`maxWidth`、`minHeight`    | 包装的盒尺寸。        | 始终                         | 未设置      | `component:Section` | 稳定   | 字符串按 CSS 透传。                                                                  |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 依据                   |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| FR1 | Section 渲染一个外层 `div` 包装，其中包含一个内层 `div`；后者承载 `section` target、反映 `variant`，并容纳子节点。内层容器填满包装的高度。实现缺口：它只对已设置的 `height` 填满；仅设置 `minHeight` 时，绘制容器在更高的包装内仍停留在其内容高度（见 Current-state impact）。                                                                                                                                                                                                                                                                           | 当前源码与测试         |
| FR2 | `section` 绘制 `--color-background-surface`，`transparent` 不绘制任何内容，`muted` 绘制 `--color-background-muted`；主题新增的 variant 若无匹配的主题规则，则不绘制背景，但仍反映 `data-variant`（`architecture:component-theming-surface` INV14）。每个选定的分隔线在该边上绘制 1px 实心 `--color-border` 边框；`start` 与 `end` 是逻辑 inline 边。                                                                                                                                                                                                     | 当前源码与测试         |
| FR3 | 省略 `padding` 时，按边依次解析：主题的按边与按轴 section padding，然后是最近祖先 Section 显式设置的 `padding`，然后是主题的单一 section padding，最后是间距步进 4。步进设置统一 padding，并将其作为容器 padding 变量发布给后代；未设置 `padding` 的嵌套 Section 继承该值，但在跨过覆盖层边界或布局根（例如 AppShell 的根）时继承中断（`architecture:container-padding` INV5、`component:AppShell` FR18、`component:Layout` FR8）。`paddingInline` 与 `paddingBlock` 覆盖单一轴，边 prop 仅覆盖其自身所在的边；每次覆盖都会驱动对应的容器 padding 变量。 | 当前源码、测试与族记录 |
| FR4 | 包装逃出其父级已发布的容器 padding：两条 inline 边始终逃出；block-start 边仅在作为首个孩子时逃出，block-end 边仅在作为最后一个孩子时逃出。内层容器在发布自身的 padding 变量之前会重置继承来的 padding 变量。                                                                                                                                                                                                                                                                                                                                             | 当前源码与族记录       |
| FR5 | `ref`、`className`、`style`、`xstyle`、尺寸，以及 DOM、data、ARIA 与事件 props 都落到外层包装；尺寸 props 中的数字以像素为单位。内层绘制容器不接收其中任何一项；Toolbar 依赖包装的这一路由。                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试         |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `variant` 重新设定 `section` 的样式，并设置 section padding。
- **AV2 — 内容。** 任意调用方内容填充该区域。

### Representative states

| 状态     | 必需不变式                                                              | 允许的变体 |
| -------- | ----------------------------------------------------------------------- | ---------- |
| 默认     | 表面绘制；主题 section padding；无分隔线。                              | 内容。     |
| 有分隔线 | 在选定的逻辑边上绘制 1px 边框。                                         | 边。       |
| 边覆盖   | 仅指定的边发生变化，并携带其容器变量。                                  | 步进。     |
| 嵌套     | 内层 Section 在 inline 方向以及首个/最后一个 block 边上逃出外层的内缩。 | variant。  |

### Transformation and precedence order

- **ORD1 — 按边的 padding。** 边 prop → 轴 prop → `padding` → 主题的按边与按轴 section padding → 最近祖先 Section 显式设置的 `padding`（不跨覆盖层边界或布局根）→ 主题的单一 section padding → 间距步进 4。

### Performance and resources

- **PR1 — 静态渲染。** Section 不持有状态，也不使用 hook。

## Accessibility contract

- **AR1 — 不添加语义。** Section 不添加 role、name、地标或 tab 停靠点（`family:layout-regions` FR8）；当上下文需要时，由调用方提供 role 与 label。

## Design relationships

| 解剖结构或状态 | 设计要求                            | 表征权威         | 层级角色     | 组件契约 |
| -------------- | ----------------------------------- | ---------------- | ------------ | -------- |
| Section 容器   | 带可选分隔线与 padding 的绘制区域。 | 当前源码与文档   | 支撑性       | FR1–FR4  |
| 使用方内容     | 区域内的调用方内容。                | 调用方提供的内容 | 视上下文而定 | AR1      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Section container": {"target": "section"},
  "Consumer content": {
    "none": {
      "reason": "intentional: caller content keeps its own theming ownership; Section applies no content target."
    }
  }
}
```

外层包装是实现结构，不承载任何 target。

## Family and system relationships

- `family:layout-regions` 把 Section 命名为通用区域与容器发布者；FR2–FR4 应用其逻辑方向、padding 与边界规则。
- `architecture:container-padding` 拥有 Section 所发布并逃出的内缩协议。
- `architecture:public-component-api` 拥有调用方输入的路由；FR5 指出，在 INV5 与 INV8 之下，接收调用方输入与 `ref` 的元素是外层包装。

## Verification map

| 契约         | 验证                                                                                                                                                                                                                  | 代表性状态                                                                  | 变异或失败预期                                                                                                                                                                                                                                                                                                                                         | 审计小节                |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| FR1, FR2     | `Section.test.tsx` 的结构与 variant 测试；稳定视觉基线 `core-section--default`                                                                                                                                        | 各 variant；默认 section                                                    | 丢失两段 div 结构、内层 `div` 丢失 `section` target、或丢失 variant 反映都会失败；默认表面若发生变化，会以变更状态返回评审。缺口：分隔线测试只断言内容能渲染，因此分隔线边框以及 `transparent` 与 `muted` 的绘制都没有自动化检查，也没有检查断言内层容器填满包装的高度（包括 `minHeight` 缺口）。主题新增的 variant 若无匹配规则，同样没有针对性测试。 | `audit:Section/anatomy` |
| FR3, ORD1    | `Section.test.tsx` 的 padding、传播与边覆盖测试；`overlayPaddingReset.test.tsx`；`layoutReset.test.tsx`；`AppShell.test.tsx` 的 “AppShell layout root (FR18)” 套件；`Section.stories.tsx` 的 NestedPaddingInheritance | 统一、按轴、按边、嵌套；位于覆盖层内；AppShell 位于带 padding 的 Section 内 | 轴被当作两条边的偏移、末端边上边覆盖压过轴覆盖、嵌套 Section 丢失传播值、祖先 Section 的 padding 跨过覆盖层边界或布局根、或容器变量（inline 或 block）未随边覆盖变动，都会失败。缺口：起始边上边覆盖压过轴覆盖、轴覆盖压过统一、主题的按边与按轴 padding 位于继承值之前、以及变量在轴路径与边路径上停止变动，都没有检查。                              | `audit:Section/layout`  |
| FR4          | `Section.stories.tsx` 中的浏览器嵌套测试夹具                                                                                                                                                                          | 嵌套 section                                                                | 缺口：没有单元测试断言逃出的外边距；逃逸丢失可在渲染出的测试夹具中看到。                                                                                                                                                                                                                                                                               | `audit:Section/layout`  |
| FR5          | `Section.test.tsx` 的 ref、className、style 与透传测试                                                                                                                                                                | 调用方输入                                                                  | 未落到外层包装的 `className` 或 `style`，或丢失的 `data-testid`，都会失败。缺口：ref 测试接受任一 `div`，透传测试在树中任意位置找到 `data-testid` 即可，因此 DOM、data、ARIA 与事件 props 的路由没有检查；尺寸与 `xstyle` 测试只断言内容能渲染。                                                                                                       | `audit:Section/api`     |
| AR1, PR1     | `serverSafeComponents.test.ts`；源码评审                                                                                                                                                                              | 每个状态                                                                    | 未加客户端指令就添加客户端 API（状态、hook）会使 `serverSafeComponents.test.ts` 失败。缺口：客户端 API 与客户端指令一起添加即可通过；若 Section 添加了 role、name、地标或 tab 停靠点，并没有自动化检查会失败。                                                                                                                                         | `audit:Section/a11y`    |
| 主题解剖映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                         | 使用方解剖与当前 target                                                     | 缺失、多余或过期的映射会使仓库校验失败。                                                                                                                                                                                                                                                                                                               | `audit:Section/theming` |

## Decision log

无记录。本记录描述已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或族/系统规则，而是链接到其所有者。
