---
schema_version: 3
template_version: 7
kind: component
id: component:Center
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/serverSafeComponents.test.ts,
    .github/visual-baseline/manifest.json,
    packages/core/src/Center/Center.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/rtl-audit/targets.json,
    apps/storybook/stories/Center.stories.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-primitives]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:container-padding,
  ]
contributing: []
system_specs: [spec:AST-002]
---

# Center component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                    |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一个 flex 容器，按 `axis`（`both`、`horizontal`、`vertical`）将其子元素居中，并具有 `isInline`、盒尺寸以及按边生效的逻辑 `padding`。    |
| 行为          | `both` 在两个轴上居中；单轴值是物理轴名称，源代码将其映射到 flex 主轴与交叉轴；padding 按逻辑边解析。                                   |
| 终端用户影响  | 读者看到内容在其盒内居中，且 padding 跟随书写方向。                                                                                     |
| 构建者影响    | 无；本记录描述已发布的行为。                                                                                                            |
| 兼容性/就绪度 | 已发布行为记录为 current；无 API、默认值或输出变更。一个实现缺口列在「当前状态影响」下。                                                |
| 审查检查      | 拒绝物理左/右 padding、会公开容器内边距的 padding、替换反射轴的调用方 `data-axis`，或新增语义。                                         |
| 管辖规则      | `family:layout-primitives/FR1–FR5,FR7,FR8`；`architecture:container-padding/INV8`；`architecture:public-component-api/INV5,INV6,INV8`。 |

此表是审查投影；下文具有权威性。

## Intent

Center 将调用方内容放置在其自身盒内的水平居中、垂直居中或两者兼具之处。它拥有居中轴、其显示模式、盒尺寸以及局部 padding。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：记录已发布行为；无公共类型、默认值、受支持值、DOM 元素或主题目标变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **竖排书写模式下的单轴值（FR2）。** `family:layout-primitives` 将 `horizontal` 与 `vertical` 列为物理轴对齐别名。Center 将 `horizontal` 映射为 flex 主轴居中、将 `vertical` 映射为交叉轴居中，这在水平书写模式下与物理轴一致，但在竖排书写模式下两者互换。

## Ownership boundary

**拥有**

- `div` 容器、其 flex 或 inline-flex 显示方式，以及带有反射 `axis` 的 `center` 目标。
- 在选定轴或各轴上居中。
- 盒尺寸与逻辑 padding 优先级。

**不拥有 / 非目标**

- 调用方内容的语义、绘制、交互、尺寸或顺序。
- 页面与区域布局——由 Layout 与产品调用点拥有。
- 子元素之间的间距、断点以及溢出。
- 容器内边距公开与后代渗漏——Center 的 padding 在 `architecture:container-padding` 下是局部的。

## Public concepts

| 概念                | 封闭值或状态                                                              | 含义                          | 按变体/方向/状态的可取性 | 默认值 | 所有者                     | 稳定性 | 无效值行为              |
| ------------------- | ------------------------------------------------------------------------- | ----------------------------- | ------------------------ | ------ | -------------------------- | ------ | ----------------------- |
| 轴（Axis）          | `both`、`horizontal`、`vertical`                                          | 在哪个或哪些轴上居中（FR2）。 | 始终                     | `both` | `component:Center`         | 稳定   | TypeScript 拒绝其他值。 |
| 显示方式（Display） | flex；inline-flex                                                         | 块级或行内级容器。            | 每个轴                   | flex   | `component:Center`         | 稳定   | —                       |
| 盒尺寸（Box size）  | `width`、`height`、`maxWidth`、`minHeight`：以像素表示的数字或 CSS 字符串 | Center 自身盒子的尺寸。       | 始终                     | 未设置 | `family:layout-primitives` | 稳定   | 字符串按 CSS 原样透传。 |
| Padding             | 按边、按轴或统一的间距台阶                                                | 局部内边距。                  | 始终                     | 未设置 | `family:layout-primitives` | 稳定   | TypeScript 拒绝其他值。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                         | 依据                           |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------ |
| FR1 | Center 渲染一个 `div`，默认为 `display: flex`，使用 `isInline` 时为 `inline-flex`，并按调用方顺序容纳其子元素。                                                                                                                                                                                                                | 当前源代码与测试               |
| FR2 | `both` 在两个轴上居中。`horizontal` 与 `vertical` 在每种书写模式下都居中物理水平轴与物理垂直轴（`family:layout-primitives` 的物理轴别名）。Center 为 `both` 设置主轴与交叉轴居中，为 `horizontal` 仅设置主轴居中，为 `vertical` 仅设置交叉轴居中。实现缺口：在竖排书写模式下，单轴值会居中相反的物理轴（见「当前状态影响」）。 | 当前源代码、测试与 family 记录 |
| FR3 | `width`、`height`、`maxWidth` 与 `minHeight` 将数字应用为像素，将字符串按原样应用。                                                                                                                                                                                                                                            | 当前源代码与测试               |
| FR4 | Padding 按逻辑边解析：先看边属性，再看其轴属性（`paddingInline` 或 `paddingBlock`），最后看 `padding`；零是一个显式台阶。Inline 边跟随书写方向。                                                                                                                                                                               | 当前源代码、测试与 family 记录 |
| FR5 | Center 的 padding 不公开任何容器内边距变量。                                                                                                                                                                                                                                                                                   | 当前源代码与 family 记录       |
| FR6 | 根元素携带 `center` 目标并反射 `axis`；调用方的 `data-axis` 不会替换它。`ref` 到达 `div`；受支持的 DOM、ARIA、data 与事件属性在本组件的目标与样式之前到达它；`xstyle`、`className` 与 `style` 按该顺序合并。                                                                                                                   | 当前源代码与测试               |
| FR7 | Center 不添加断点、溢出行为、间距或结构区域。它在服务器上渲染，且不需要客户端边界。                                                                                                                                                                                                                                            | 当前源代码与测试               |

### Allowed variation

- **AV1 — 调用方内容。** 任何内容都可以出现在 Center 内，并保持其自身的语义与主题化。
- **AV2 — 可用空间。** 父级布局与尺寸输入会改变盒子，但不会改变轴契约。

### Representative states

| 状态               | 必需不变式                                                    | 允许的变体 |
| ------------------ | ------------------------------------------------------------- | ---------- |
| 两个轴             | 主轴与交叉轴居中。                                            | 盒尺寸。   |
| 仅水平             | 物理水平轴居中；不添加物理垂直居中。                          | 高度。     |
| 仅垂直             | 物理垂直轴居中；不添加物理水平居中。                          | 宽度。     |
| 竖排书写           | 单轴值仍命名物理轴（今天它们居中相反的那一个，即 FR2 缺口）。 | —          |
| Inline             | `inline-flex` 与所选轴。                                      | —          |
| 非对称逻辑 padding | 起点与终点保持其含义；物理边随方向互换。                      | —          |

### Transformation and precedence order

- **ORD1 — 逐边 padding。** 边属性 → 轴属性 → `padding`。
- **ORD2 — 根属性。** 调用方属性 → 组件目标、反射轴与样式 → `xstyle` → `className` → `style`。

### Performance and resources

- **PR1 — 静态渲染。** Center 不持有状态，也不使用 hook。

## Accessibility contract

- **AR1 — 被动容器。** Center 不添加自己的 role、名称、状态、焦点行为或实时区域；调用方的 ARIA 与 role 属性到达根元素。
- **AR2 — 阅读顺序。** 子元素按调用方顺序渲染，且不在视觉上重排。

## Design relationships

| 解剖或状态 | 设计要求                                 | 表示权威                                      | 层级角色     | 组件契约      |
| ---------- | ---------------------------------------- | --------------------------------------------- | ------------ | ------------- |
| 容器       | 单轴或双轴居中，可选局部内边距，无表面。 | 当前源代码、文档与 `family:layout-primitives` | 支撑性布局   | FR1–FR7       |
| 内容       | 容器内的调用方内容。                     | 调用方拥有的内容                              | 依上下文而定 | AV1, AR1, AR2 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "center"},
  "Content": {
    "none": {
      "reason": "intentional: Caller-supplied content retains its own theming ownership; Center applies no content target."
    }
  }
}
```

## Family and system relationships

- `family:layout-primitives` 拥有共享的尺寸与 padding 词汇、padding 优先级，以及 `horizontal` 与 `vertical` 的物理轴含义；FR2 记录 Center 相对于它的缺口。
- `architecture:container-padding` 记录 Center 的 padding 是局部的（FR5）。
- `architecture:public-component-api` 拥有透传、样式组合、ref 可达性以及自有属性边界（FR6）。
- `spec:AST-002` 拥有对本公共表面任何变更的准入。

## Verification map

| 契约           | 验证                                                                                                                                         | 代表状态                                 | 变更或失败预期                                                                                                                                                                                                                                                                                           | 审计章节                |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| FR1, FR2       | `Center.test.tsx` 的轴与 inline 测试；稳定视觉基线 `core-center--default`（中性主题与探针主题）                                              | 两者、水平、垂直；inline；默认           | 错误的计算 display、`align-items` 或 `justify-content` 会失败；默认居中发生变化会以变更形式返回审查。缺口：没有自动化检查运行竖排书写模式或断言子元素顺序。                                                                                                                                              | `audit:Center/behavior` |
| FR3            | `Center.test.tsx` 尺寸测试                                                                                                                   | 宽度、高度、两者                         | 缺口：尺寸测试只断言元素被渲染，因此像素换算与字符串透传没有自动化检查。                                                                                                                                                                                                                                 | `audit:Center/layout`   |
| FR4            | `Center.test.tsx` 的 padding 优先级套件；`@astryx/no-physical-properties` lint 规则；在 `core-center--padding-per-edge` 上的 RTL 审计维度 D8 | 统一、轴、边、零、全部四个边；LTR 与 RTL | 在结束边上边覆盖轴、在 inline-start、inline-end 与 block-start 上边覆盖统一值会失败；物理 left/right padding 属性会使 lint 失败；除非逻辑起点与终点 padding 交换物理侧，否则 RTL 审计失败。缺口：起始边上边覆盖轴、block-end 上边覆盖统一值、以及轴覆盖统一值没有检查，且 CI 对 RTL 审计发现保持非阻断。 | `audit:Center/layout`   |
| FR5, FR7       | `serverSafeComponents.test.ts`；`Center.test.tsx` 的服务器渲染测试；源代码审查                                                               | 带 padding 的容器                        | 客户端边界会使 `serverSafeComponents.test.ts` 失败；服务器渲染错误会使 Center 测试失败。缺口：与客户端指令一起添加的 hook 会通过所有检查；公开容器内边距变量，或添加断点、溢出规则、间距或区域，都没有自动化检查。                                                                                       | `audit:Center/layout`   |
| FR6            | `Center.test.tsx` 的 ref、透传、xstyle 与自有属性测试；`themingTargets.test.ts`                                                              | 每个轴；冲突的 `data-axis`               | 丢失目标或调用方 `data-axis` 胜出会失败。缺口：ref 测试接受任何 `div`，所以包装器上的 ref 会通过，且样式输入合并顺序没有检查。                                                                                                                                                                           | `audit:Center/theming`  |
| AR1, AR2, PR1  | `serverSafeComponents.test.ts`；源代码审查                                                                                                   | 多个子元素                               | 未加客户端指令就添加的 hook 会使 `serverSafeComponents.test.ts` 失败。缺口：与客户端指令一起添加的 hook 会通过，并且如果 Center 添加语义或重排子元素，没有自动化检查会失败。                                                                                                                             | `audit:Center/a11y`     |
| 主题化解剖映射 | `scripts/check-knowledge.mjs`                                                                                                                | 使用方解剖与当前目标                     | 缺失、多余或过期的映射会使仓库校验失败。                                                                                                                                                                                                                                                                 | `audit:Center/theming`  |

## Decision log

未记录。本记录描述已发布的行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
