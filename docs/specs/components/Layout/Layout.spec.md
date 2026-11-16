---
schema_version: 3
template_version: 7
kind: component
id: component:Layout
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-30
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Layout/Layout.test.tsx,
    packages/core/src/Layout/LayoutSlots.test.tsx,
    packages/core/src/Layout/__tests__/childrenAsContent.test.tsx,
    packages/core/src/Layout/__tests__/contentWidth.test.tsx,
    packages/core/src/Layout/__tests__/LayoutContentWidthDefault.a11y.chromium.spec.ts,
    packages/core/src/Layout/__tests__/nestedPadding.test.tsx,
    packages/core/src/Layout/__tests__/LayoutAudit.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:layout-regions]
design_specs: []
architecture:
  [
    architecture:container-padding,
    architecture:component-theming-surface,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-038]
---

# Layout component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 五个 ReactNode 插槽（`header`、`start`、`content`、`end`、`footer`），`children` 作为内容简写，`height`、`padding`、`contentWidth`、`defaultHasDividers`。    |
| Behavior                | Layout 在五个具名插槽中排布调用方内容，随其容器填充或增长，并设定其区域组件所使用的内缩与内容宽度。                                                           |
| End-user impact         | 使用者看到页头、侧面板、内容与页脚处于稳定位置，在从右到左书写时镜像，内容对齐到单一可读宽度。                                                                |
| Builder impact          | 无；本记录描述已交付的行为。                                                                                                                                  |
| Compatibility/readiness | 已发布行为记录为 current；无 API、默认值或输出变更。没有未解决的实现差距（Current-state impact）。                                                            |
| Review checks           | 拒绝以下情形：向任意插槽内容添加 target、继承父 Layout 的 padding、把内容滚动条移离其开放边、`data-height` 可被覆盖。                                         |
| Governing rules         | `family:layout-regions` FR1–FR12；`architecture:container-padding`；`architecture:component-theming-surface`；`architecture:public-component-api` INV5–INV8。 |

本表格是审查投影；下方正文具有权威性。

## Intent

Layout 是一个通用布局原语，它在页面或有界容器内排布五个可选的具名插槽——页头、逻辑起始面板、内容、逻辑结束面板与页脚。AppShell 拥有页面外壳。

使用方语法与示例属于 `Layout.doc.mjs`。

## Compatibility and migration

- 已发布默认值保持不变：`yes`——`height="fill"`、无 padding 覆盖、无内容宽度、分隔线默认值继承。
- 兼容性类别：记录已交付行为；无 public prop、默认值、DOM、target 或样式输出变更。
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

无。值为 `false`、`true` 或 `''` 的插槽（例如 `isOpen` 为 false 时的 `isOpen && <LayoutHeader />`）视为缺失，因此其相邻区域在该侧取外层内缩；在 `contentWidth` 下，关闭的 start 或 end 插槽与省略该插槽产生相同的 FR6 组合（FR1）。

## Ownership boundary

**Owns**

- Layout 容器、其 `layout` target 以及五个插槽位置。
- 高度、Layout 边缘内缩、内容宽度，以及其区域组件所读取的页头与页脚分隔线默认值。
- 针对 `layout`、`layout-header`、`layout-panel`、`layout-content` 与 `layout-footer` 各 target 的整体使用方文档与主题映射。

**Does not own / non-goals**

- 页面外壳、应用级导航、响应式外壳替换、跳转链接或主地标——由 AppShell 拥有。
- 任何插槽中的产品含义或内容——由调用方拥有。
- 区域语义、滚动、内缩与分隔线——由 `component:LayoutHeader`、`component:LayoutContent`、`component:LayoutFooter` 与 `component:LayoutPanel` 拥有。
- 尺寸调整交互——由 useResizable 与 ResizeHandle 拥有。

## Public concepts

| Concept         | Closed values or states                       | Meaning                                           | Availability by variant/orientation/state | Default      | Owner              | Stability | Invalid-value behavior      |
| --------------- | --------------------------------------------- | ------------------------------------------------- | ----------------------------------------- | ------------ | ------------------ | --------- | --------------------------- |
| 插槽拓扑        | `header`, `start`, `content`, `end`, `footer` | 为调用方内容定位；省略的插槽不渲染任何内容。      | 始终                                      | 全部省略     | `component:Layout` | 稳定      | —                           |
| 内容简写        | `children`                                    | 在省略 `content` 时填充内容插槽。                 | 始终                                      | 省略         | `component:Layout` | 稳定      | 两者都给时 `content` 优先。 |
| 高度            | `fill`, `auto`                                | 填充容器，或随内容增长。                          | 始终                                      | `fill`       | `component:Layout` | 稳定      | 封闭联合类型；由类型拒绝。  |
| Layout 边缘内缩 | spacing step; `0`                             | 各区域在 Layout 外边缘应用的内缩；`0` 为满出血。  | 始终                                      | 继承或步骤 4 | `component:Layout` | 稳定      | 封闭联合类型；由类型拒绝。  |
| 内容宽度        | number (px); CSS length string                | 每个插槽中对齐内容的宽度。                        | 始终                                      | 无           | `component:Layout` | 稳定      | —                           |
| 分隔线默认值    | `true`, `false`, unset                        | LayoutHeader 与 LayoutFooter 子级的分隔线默认值。 | 始终                                      | 继承         | `component:Layout` | 稳定      | —                           |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Basis                                                                               |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| FR1 | Layout 渲染一个外层 `div`，它携带反映 `height` 的 `layout` target，围绕一个内部垂直堆叠：页头插槽，一行承载 start 插槽、内容插槽与 end 插槽的中间行，然后是页脚插槽。省略的页头、start、end 或页脚插槽不渲染任何内容；值不可渲染（`null`、`undefined`、布尔值或 `''`）的插槽视为缺失，因此相邻区域在该侧取外层内缩（`family:layout-regions` FR3），而元素、片段或数组即使渲染为空也算存在；中间行与内容插槽的填充包装器始终渲染。`content` 填充内容插槽，省略 `content` 时由 `children` 填充。插槽位置不给调用方内容添加任何元素、区域组件或 target。                        | 当前源码、文档与测试；`family:layout-regions` FR1、FR3                              |
| FR2 | 外层 `div` 在四条边上脱离父级已发布的容器 padding，内层堆叠在其各区域发布自身 padding 之前发布零容器 padding。`fill`（默认）使 Layout 填充其容器高度，包括已脱离的块级 padding；`auto` 让其随内容增长，至少与其容器等高。                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试；`architecture:container-padding`                                    |
| FR3 | `padding` 设定本 Layout 自身区域组件在其外边缘应用的内缩；`0` 为满出血。嵌套 Layout 不继承父 Layout 的 padding：没有自己的 `padding` 时，其区域使用最近 padding 容器（Card、Section、Dialog、Drawer 或 BottomSheet）的 padding，或间距步骤 4。每个区域如何应用与发布该内缩由其记录拥有（`component:LayoutHeader`、`component:LayoutContent`、`component:LayoutFooter`、`component:LayoutPanel`）。                                                                                                                                                                           | 当前源码、文档与测试；`family:layout-regions` FR4；`architecture:container-padding` |
| FR4 | 当调用方提供 LayoutHeader、LayoutContent、LayoutFooter 或 LayoutPanel 时，该组件携带自身的 `layout-header`、`layout-content`、`layout-footer` 或 `layout-panel` target。位于逻辑起始、结束或两端的 LayoutPanel 是一个 Panel 部件与一个 `layout-panel` target。                                                                                                                                                                                                                                                                                                               | 当前源码、文档与测试；`family:layout-regions` FR11                                  |
| FR5 | `defaultHasDividers` 为 LayoutHeader 与 LayoutFooter 后代设定分隔线默认值；显式的 `hasDivider` 优先，未设置时嵌套 Layout 在同一层内保留父级默认值；该默认值止于 Dialog、Drawer、BottomSheet 或其他层边界（`spec:AST-038` FR7），并止于 AppShell 根（`component:AppShell` FR18）。LayoutPanel 不读取该默认值（`component:LayoutPanel` FR4）。                                                                                                                                                                                                                                 | 当前源码、文档与测试                                                                |
| FR6 | 在设有 `contentWidth` 且无面板时，LayoutContent 横跨中间区域，并将直接子级对齐到内容宽度，因此其滚动条留在外边缘。恰好一个面板时，面板保持对齐，而 LayoutContent 延伸到对侧开放边；start 与 end 镜像。两个面板时，或宽度为百分比（含带百分比的 CSS 数学运算）、内在值或裸变量时，整个中间组合保持受约束；长度值变量使用 `calc(var(...))`。数字即像素。没有 `contentWidth` 的嵌套 Layout 不继承父级的。                                                                                                                                                                       | 当前源码、文档与测试；`family:layout-regions` FR12                                  |
| FR7 | `ref`、DOM、data、ARIA 与事件 props、`xstyle`、`className` 与 `style` 抵达外层 `div` 或在其上组合；反射的 `data-height` 替换调用方的值。                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试；`architecture:public-component-api` INV5–INV8                       |
| FR8 | Layout 拥有布局重置：一个内部导出 `layoutReset`（Core 的 `overlayPaddingReset` 加上它略去的值），在其被应用到的元素处停止 Layout、其区域组件、Section 与容器样式向其后代发布的每个布局自定义属性。它把已发布的容器 padding 设为 `0px`，把 Layout 内缩与宽度、flush 值、Section padding 传播与容器高度上限设为 `initial`。布局根会应用它（`component:AppShell` FR18）。它是内部的，不属于主题 API 或包导出（`architecture:container-padding` INV1、`architecture:public-component-api` INV12）。Core 之外需要相同边界的表面，要针对它保留一份其列表的镜像，并配一个对等测试。 | `component:AppShell` FR18；`architecture:container-padding`                         |

### Allowed variation

- **AV1 — 插槽存在性与内容。** 任何插槽都可以存在或缺失，并可持有任意 ReactNode；内容不因位置而成为 Layout 解剖结构。
- **AV2 — 区域组合。** 调用方选择提供哪些区域组件；Layout 不插入它们。

### Representative states

| State       | Required invariant                                             | Allowed variation             |
| ----------- | -------------------------------------------------------------- | ----------------------------- |
| 仅任意内容  | 根上有 `layout` target；插槽内容不获得 target。                | 内容与高度。                  |
| 组合区域    | 每个提供的区域携带自身 target。                                | 提供哪些区域。                |
| 单面板      | 面板对齐到内容宽度；内容延伸到开放边。                         | start 或 end；在 RTL 中镜像。 |
| 双面板      | 整个中间组合受约束于内容宽度。                                 | 面板宽度。                    |
| 嵌套 Layout | 不继承 Layout padding 或内容宽度；分隔线默认值在同一层内继承。 | 其自身的显式值。              |

### Transformation and precedence order

- **ORD1 — 内容插槽。** `content` → `children`。
- **ORD2 — 内缩。** 本 Layout 的 `padding` → 外层 Card、Section、Dialog、Drawer 或 BottomSheet 的 padding → 间距步骤 4；父 Layout 的 padding 从不适用。
- **ORD3 — 分隔线默认值。** 区域的 `hasDivider` → 同层内最近的 `defaultHasDividers` → 无分隔线。

### Performance and resources

- **PR1 — 无外部生命周期。** Layout 不添加任何监听器、观察者、计时器或测量；内容宽度对齐仅靠 CSS。

## Accessibility contract

- **AR1 — 不推断地标。** Layout 不添加 role 或名称；地标语义仅来自区域组件调用方提供的 `role` 与 `label`（`family:layout-regions` FR8）。
- **AR2 — 逻辑顺序。** 插槽按 DOM 顺序渲染：页头、start、内容、end、页脚，且 start 与 end 遵循书写方向（`family:layout-regions` FR2）。

## Design relationships

| Anatomy or state | Design requirement                                   | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| Layout 容器      | 把调用方内容放入五个具名插槽。                       | 当前源码、文档、family   | 支撑           | FR1, FR2           |
| 页头             | 一个可选的、由调用方提供的 LayoutHeader。            | 当前源码、文档、family   | 支撑           | FR4, FR5           |
| 面板             | 一个由调用方提供、位于逻辑起始或结束的 LayoutPanel。 | 当前源码、文档、family   | 支撑           | FR4, FR5           |
| 内容区域         | 一个可选的、由调用方提供的 LayoutContent。           | 当前源码、文档、family   | 突出           | FR4, FR6           |
| 页脚             | 一个可选的、由调用方提供的 LayoutFooter。            | 当前源码、文档、family   | 支撑           | FR4, FR5           |

插槽位置是拓扑，不是解剖结构。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Layout container": {"target": "layout"},
  "Header": {"target": "layout-header"},
  "Panel": {"target": "layout-panel"},
  "Content area": {"target": "layout-content"},
  "Footer": {"target": "layout-footer"}
}
```

Panel 代表每一个 LayoutPanel，位于逻辑起始、结束或两端。

## Family and system relationships

- `family:layout-regions` 拥有区域拓扑、逻辑方向、边界、滚动、地标与内容宽度下的滚动条位置；FR1–FR6 与 AR1–AR2 适用它。
- `architecture:container-padding` 拥有容器内缩的发布与脱离；FR2 与 FR3 适用它。
- `component:LayoutHeader`、`component:LayoutContent`、`component:LayoutFooter` 与 `component:LayoutPanel` 拥有各区域的行为。
- `architecture:component-theming-surface` 拥有解剖结构与 target 映射。
- `architecture:public-component-api` 拥有调用方输入的路由；FR7 适用它。

## Verification map

| Contract            | Verification                                                                                                                                                                                                                          | Representative states                                                                 | Mutation or failure expectation                                                                                                                                                                                                                                                            | Audit section                |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| FR1, ORD1, AV1      | `Layout.test.tsx` 的插槽与内容测试，包括 `reports a slot that renders nothing as empty`；`childrenAsContent.test.tsx`；`LayoutAudit.a11y.chromium.spec.ts` 的 `closed-regions` 回执                                                   | 每个插槽；省略的插槽；`false`、`true` 与 `''` 插槽；`content` 与 `children`           | 缺失插槽、`children` 胜过 `content`、或 `false`、`true`、`''` 插槽被报告为已填充，均判失败。差距：省略插槽的测试只检查内容文本，因此为省略插槽渲染的包装器也能通过，且没有测试断言插槽内容不获得 target 或元素。封闭区域几何只有审计回执：浏览器规格仅在 Layout 审计 pull request 中运行。 | `audit:Layout/anatomy`       |
| FR2                 | `Layout.test.tsx` 的高度反射测试；`LayoutAudit.a11y.chromium.spec.ts` 的脱离边距与零发布回执                                                                                                                                          | `fill`、`auto`                                                                        | 丢失 `data-height` 反射判失败。差距：没有始终运行的检查覆盖脱离边距、零发布或 fill 与 auto 高度；测量边距与发布情况的浏览器规格仅在 Layout 审计 pull request 中运行，因此它们只有审计回执。                                                                                                | `audit:Layout/layout`        |
| FR3, ORD2           | `nestedPadding.test.tsx`                                                                                                                                                                                                              | 位于 AppShell、Card、Section 内；嵌套的满出血与带 padding 的 Layout；显式嵌套 padding | 嵌套 Layout 继承父 Layout 的 padding，或丢失外层 Card 或 Section 的 padding 或默认内缩，判失败。差距：`Layout.test.tsx` 的 padding 测试只断言渲染成功。                                                                                                                                    | `audit:Layout/layout`        |
| FR4                 | `LayoutSlots.test.tsx` 的 class 测试；`themingTargets.test.ts`                                                                                                                                                                        | 每个区域组件；start 与 end 面板                                                       | 丢失区域 target 判失败。                                                                                                                                                                                                                                                                   | `audit:Layout/theming`       |
| FR5, ORD3           | `Layout.test.tsx` 的分隔线默认值测试，包括 `a nested Layout without defaultHasDividers keeps its parent default` 与 `stops the default at a layer boundary`                                                                           | 默认 true；未设置；显式 `false`；嵌套 Layout；位于 Dialog 内                          | 忽略默认值的页头或页脚、落败的显式 `hasDivider={false}`、丢失父级默认值的嵌套 Layout、跨越层边界的默认值，均判失败。                                                                                                                                                                       | `audit:Layout/layout`        |
| FR6                 | `contentWidth.test.tsx`；稳定视觉基线 `core-layout--content-width-scrollbar-placement`；`LayoutContentWidthDefault.a11y.chromium.spec.ts`，当没有 `contentWidth` 的 Layout 在宽于视口的框架中把其页头或页脚限制到低于框架宽度时判失败 | 无面板、仅 start、仅 end、两者；零 padding；嵌套；在宽于视口的框架中无内容宽度        | 非全宽的 no-panel 内容区域、未受约束的双面板中间区、继承内容宽度的嵌套 Layout 判失败；被移离其内容边的滚动条回来时会变更以供审查。关闭的 start 或 end 插槽只有审计回执（`LayoutAudit.a11y.chromium.spec.ts` 的 `closed-regions`，仅在 Layout 审计 pull request 中运行）。                  | `audit:Layout/layout`        |
| FR7                 | `Layout.test.tsx` 的 ref、className、style、透传、事件处理函数与自有元数据测试                                                                                                                                                        | Ref；调用方输入；事件 props；冲突的 `data-height`                                     | 挂在其他元素上的 ref、被丢弃的调用方输入或事件处理函数、获胜的调用方 `data-height`，均判失败。差距：没有测试钉住 `xstyle` 的合并顺序。                                                                                                                                                     | `audit:Layout/api`           |
| FR8                 | `layoutReset.test.tsx`，当 Layout 或 Section 写入重置未拦截的布局自定义属性时判失败，并在带 padding 的 Section 内回读每个重置值；docsite 的 `example-layout-root.test.ts`，当 docsite 示例根的镜像与重置不一致时判失败                | Layout 与 Section 写入的每个自定义属性；带 padding 的 Section 宿主                    | 属性被写入却未被重置、重置值仍被祖先覆盖、docsite 镜像与重置不一致，均判失败。                                                                                                                                                                                                             | `audit:Layout/layout`        |
| AR1, AR2, PR1       | 源码审查                                                                                                                                                                                                                              | 每个插槽                                                                              | 差距：如果 Layout 添加 role、重排插槽或添加监听器或测量，没有自动化检查会失败。                                                                                                                                                                                                            | `audit:Layout/accessibility` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                         | 使用方解剖结构与当前 target                                                           | 缺失、多余或过时的映射判仓库校验失败。                                                                                                                                                                                                                                                     | `audit:Layout/theming`       |

## Decision log

### DEC-1 — AppShell owns the page shell; Layout owns five-slot arrangement

**Reference:** `component:Layout/DEC-1`

**Decider:** `cixzhang`, `2026-08-31`

AppShell 是页面外壳。Layout 是通用布局原语，用于在页面或有界容器内排布 `header`、`start`、`content`、`end` 与 `footer` 各插槽。Section、Table、Toolbar 与 Divider 对容器 padding 的参与，并不使这些组件成为 Layout 拥有的解剖结构。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表或示例、family 区域规则、容器 padding 机制、尺寸调整交互、实现步骤或系统规则。它链接到它们的所有者。
