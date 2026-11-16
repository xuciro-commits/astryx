---
schema_version: 3
template_version: 7
kind: component
id: component:Grid
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    scripts/check-knowledge.mjs,
    packages/core/src/serverSafeComponents.test.ts,
    packages/core/src/Grid/Grid.test.tsx,
    apps/storybook/stories/Grid.stories.tsx,
    .github/scripts/story-play-guard.js,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:layout-primitives]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: []
---

# Grid component contract

## Contract at a glance

| Area                    | Contract                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | Grid 用 `columns`（固定数量或响应式对象）、间距、子项对齐、`rowHeight` 与盒子尺寸，把子项排布到二维轨道中。                            |
| Behavior                | 正数会创建恰好 N 条 `1fr` 轨道且不重排；对象会基于像素最小值与可选的数量上限创建 fill/fit 轨道；轴向间距会覆盖统一间距。               |
| End-user impact         | 内容保持 DOM 顺序与逻辑方向，而响应式对象形式的网格会减少轨道数量以适配。当内容无法收缩时，固定轨道可能变窄或溢出。                    |
| Builder impact          | 无；本记录描述的是已发布行为。构建者显式选择固定数字轨道或响应式对象轨道。                                                             |
| Compatibility/readiness | 已发布行为记录为 current；API、默认值、目标或运行时均无变化。                                                                          |
| Review checks           | 拒绝为数字 columns 引入自动重排、忽视最小内容的等宽承诺、丢失间距优先级、原始内联轨道模板，或调用方可覆盖的组件自有元数据。            |
| Governing rules         | `family:layout-primitives/FR1–FR7`; `architecture:public-component-api/INV5–INV9`; `architecture:component-theming-surface/INV2–INV6`. |

本表是审查投影；下文的正文才具有权威性。

## Intent

Grid 把调用方提供的子项排布到二维轨道中。它拥有轨道构建、间距、子项对齐及其盒子尺寸；它不拥有任何内容、表面或结构性页面语义。

## Compatibility and migration

- 已发布默认值保持不变：是；省略、为零或为负的数字 `columns` 解析为一条轨道。
- 兼容性类别：记录已发布行为；运行时、DOM、样式、目标或公共 API 均无变化。
- 受控/非受控行为：不适用。
- 迁移决策：无。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- Grid 的根容器、`grid` 目标、轨道构建、轴向间距、子项对齐以及显式盒子尺寸。
- GridSpan 的包装器所携带的 `grid-span` 目标，`Grid.doc.mjs` 声明了它，下文的解剖图也列出了它。
- Grid 根节点上的根 prop 与样式组合。

**不拥有 / 非目标**

- 调用方内容、子项语义、表面或交互——由产品调用点或被渲染的子组件拥有。
- 共享断点或针对数字 columns 的自动重排——响应式由 Grid 的对象形式选择。
- GridSpan 包装器的行为以及单个子项对行与列的参与——由 `component:GridSpan` 拥有，它有各自的使用方文档与记录。

## Public concepts

| Concept        | Closed values or states             | Meaning                                       | Availability by variant/orientation/state | Default                | Owner                      | Stability | Invalid-value behavior |
| -------------- | ----------------------------------- | --------------------------------------------- | ----------------------------------------- | ---------------------- | -------------------------- | --------- | ---------------------- |
| 列形态         | 固定数字；响应式对象；省略          | 选择固定的 `1fr` 轨道或内在的 fill/fit 轨道。 | 每个 Grid                                 | 一条轨道               | `component:Grid`           | 稳定      | 零/负数回退为一条轨道  |
| 响应式重复     | `fill`；`fit`                       | 保留空轨道，或折叠空轨道让存在的子项拉伸。    | 对象形式的 columns                        | `fill`                 | `component:Grid`           | 稳定      | 受类型约束             |
| 响应式数量上限 | 缺失；正的 `max`；非正的 `max`      | 限制内在轨道的数量，同时允许存在的轨道填充。  | 对象形式的 columns                        | 缺失                   | `component:Grid`           | 稳定      | 非正数表现为无上限     |
| 间距           | 共享的 `SpacingStep` 取值           | 分隔行/列；轴向取值覆盖统一间距。             | 每个 Grid                                 | 浏览器 grid gap 默认值 | `family:layout-primitives` | 稳定      | 受类型约束             |
| 子项对齐       | `start`；`center`；`end`；`stretch` | 设置 `align-items` 与 `justify-items`。       | 每个 Grid                                 | 浏览器 `normal`        | `component:Grid`           | 稳定      | 受类型约束             |
| 盒子尺寸       | 数字；CSS 值字符串；缺失            | 设定 Grid 盒子尺寸；数字会转为像素。          | 每个 Grid                                 | 由调用方/容器决定      | `family:layout-primitives` | 稳定      | 浏览器校验字符串       |
| 隐式行高       | 数字；缺失                          | 为行跨所使用到的隐式行设置像素高度。          | 每个 Grid                                 | 浏览器 `auto`          | `component:Grid`           | 稳定      | 浏览器校验结果 CSS     |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                      | Basis                                                     |
| --- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| FR1 | 正数 `columns={N}` 在任何宽度下都创建恰好 N 条 `1fr` 轨道，且永不重排；最小内容可能撑宽某条轨道并让窄容器溢出。省略、为零或为负的 `columns` 给出一条 `1fr` 轨道。                                              | DEC-1；已发布文档、源码与测试                             |
| FR2 | 对象形式的 columns 默认使用 auto-fill，`repeat: 'fit'` 时使用 auto-fit；`minWidth` 是轨道下限，而正数 `max` 限制数量并让单条轨道可收缩至容器。                                                                 | 已发布文档、源码与测试                                    |
| FR3 | `rowGap` 仅对行覆盖 `gap`，`columnGap` 仅对列覆盖 `gap`；实际生效的列间距参与有上限的轨道计算。`rowHeight` 以像素设置隐式行高。                                                                                | `family:layout-primitives/FR4`；源码与测试                |
| FR4 | 轨道模板是类级声明，因此调用方的 `xstyle` 与类规则（包括媒体规则）可以替换它。调用方的 `style` 在其他内联声明上胜出，而显式的 `width`、`height`、`maxWidth` 与 `minHeight` props 会覆盖与之匹配的 `style` 键。 | `architecture:public-component-api/INV5–INV8`；源码与测试 |
| FR5 | `align` 与 `justify` 把 `align-items` 与 `justify-items` 设为 `start`、`center`、`end` 或 `stretch`；未设置则保留浏览器默认值（`normal`，它会拉伸没有自然尺寸或宽高比的子项）。                                | 源码与测试                                                |
| FR6 | `ref`、DOM、data、ARIA 与事件 props、`xstyle`、类名以及内联样式，都会到达或组合到根节点上，且不替换 `grid` 目标或其反射的 `columns`（仅数字形式）、`gap`、`align` 与 `justify`。                               | `architecture:public-component-api/INV5–INV8`；源码与测试 |
| FR7 | Grid 保留调用方的 DOM 顺序并使用文档的逻辑行内方向；它不创建单独的键盘顺序。                                                                                                                                   | 平台布局行为                                              |

### Allowed variation

- **AV1 — 调用方内容。** 任何调用方拥有的元素都可以直接参与，或在 GridSpan 内参与；Grid 不会检查或重写它。
- **AV2 — 轨道数量。** 容器宽度、最小内容、间距与对象形式选项，可以在 FR1–FR3 范围内改变渲染出的响应式数量。
- **AV3 — 根样式。** 调用方样式可以替换轨道模板或盒子呈现，同时保留组件自有的目标与元数据。

### Representative states

| State           | Required invariant                                           | Allowed variation                    |
| --------------- | ------------------------------------------------------------ | ------------------------------------ |
| 固定 Grid       | 恰好 N 条显式 `1fr` 轨道；无组件自有重排。                   | N、内容最小值、间距与调用方样式。    |
| 响应式 fill     | 空轨道保持分配，而数量随可用宽度响应。                       | 最小宽度、上限、内容数量与实际间距。 |
| 响应式 fit      | 空轨道折叠，存在的子项拉伸。                                 | 最小宽度、上限、内容数量与实际间距。 |
| 有上限的窄 Grid | 数量下降，且一条存在的轨道可在低于 `minWidth` 的容器中填充。 | 容器宽度与调用方内容。               |
| 直接子项        | 调用方内容在没有 Grid 自有包装器的情况下参与。               | 任何调用方拥有的元素与语义。         |

### Transformation and precedence order

- **ORD1 — 轨道形态。** 带正数 `max` 的响应式对象 → 有上限的 fill/fit 模板；不带正数 `max` 的响应式对象 → 无上限的 fill/fit 模板；正数 → 固定 `repeat(N, 1fr)`；其他 → 一条 `1fr` 轨道。
- **ORD2 — 间距。** 轴向间距 → 统一间距 → 有上限的轨道计算中无间距项。
- **ORD3 — 根组合。** 调用方 props 先应用；组件自有的目标、反射与 StyleX 随后组合；`xstyle`、类名与调用方内联样式保持其样式优先级；尺寸 props 胜过匹配的内联键。

### Performance and resources

- **PR1 — CSS 自有的布局。** Grid 不拥有任何状态、effect、观察器、监听器、定时器或 JavaScript 测量；布局与重排由 CSS 自有。

## Accessibility contract

- **AR1 — 布局保持无语义。** Grid 渲染一个 `<div>`，自身不带 grid、列表、分组或地标语义；当组合需要语义时由调用方提供。
- **AR2 — 顺序保持可感知。** 在 LTR 与 RTL 下，DOM 顺序始终是阅读顺序与键盘顺序；视觉轨道不会创建第二个序列。

## Design relationships

| Anatomy or state | Design requirement                 | Representation authority | Hierarchy role | Component contract |
| ---------------- | ---------------------------------- | ------------------------ | -------------- | ------------------ |
| Grid 容器        | 为调用方子项提供二维轨道；仅几何。 | 当前源码与文档           | 支撑           | FR1–FR6            |
| 跨项             | 在 Grid 旁记录的可选包装器。       | `component:GridSpan`     | 支撑           | —                  |

主题化：根节点是 `grid` 目标，它反射 `align`、数字 `columns`、`gap` 与 `justify`。`Grid.doc.mjs` 记录了 Spanning item 部件及其 `grid-span` 目标，因此下面的映射同时列出两者；`component:GridSpan` 拥有包装器的行为。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Grid container": {"target": "grid"},
  "Spanning item": {"target": "grid-span"}
}
```

## Family and system relationships

- `family:layout-primitives` 拥有共享的间距、尺寸、对齐与子项参与词汇；Grid 拥有二维实现，`component:GridSpan` 拥有参与修饰符。
- `architecture:public-component-api` 拥有根 prop、样式、事件、ref 与已发布类型的组合。
- `architecture:component-theming-surface` 设定 `grid` 目标及其反射轴所遵循的规则。
- `architecture:component-test-sufficiency` 拥有有边界的、对变异敏感的证据选择。

## Verification map

| Contract            | Verification                                                                                       | Representative states                                | Mutation or failure expectation                                                                                                                                                                                                             | Audit section         |
| ------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| FR1–FR3, ORD1, ORD2 | `Grid.test.tsx` 的轨道模板、行高与有上限间距测试；`Grid.stories.tsx` AuditMatrix play guard        | 固定；零与负数；fill；fit；有上限且带/不带间距；行高 | 轨道模板发生变化（数量、fill 或 fit、下限、上限，或上限中的间距）或行高变化，会使精确断言失败；网格溢出其宿主会使 play guard 失败。缺口：间距与轴向间距测试只断言网格会渲染，因此 `rowGap` 与 `columnGap` 在其轴上覆盖 `gap` 没有任何检查。 | `audit:Grid/behavior` |
| FR4, FR6, ORD3      | `Grid.test.tsx` 的原始内联模板、尺寸、ref、透传与自有元数据测试；`themingTargets.test.ts`          | DOM、data、ARIA、事件；类、样式、xstyle；反射轴      | 丢失 `aria-label`、替换自有元数据、原始内联轨道，或宽度/高度错误，都会失败。缺口：ref 测试接受任何元素，而 `xstyle`、`className`、`style` 的合并顺序以及尺寸 props 胜过 `style` 没有检查。                                                  | `audit:Grid/api`      |
| FR5                 | `Grid.test.tsx` 的对齐与自有元数据测试                                                             | `align` 与 `justify`                                 | 丢失 `data-align` 或 `data-justify` 反射会失败。缺口：对齐测试只断言网格会渲染，因此 `align-items` 与 `justify-items` 的取值没有检查。                                                                                                      | `audit:Grid/behavior` |
| FR7, AR1, AR2       | `Grid.stories.tsx` AuditMatrix play guard，LTR 与 RTL                                              | 两个方向下的固定轨道                                 | 不在文档方向上从头到尾排列的子项会使 play guard 失败。缺口：没有自动化检查断言 Grid 不添加 role 或保持 DOM 顺序。                                                                                                                           | `audit:Grid/a11y-rtl` |
| PR1                 | `serverSafeComponents.test.ts`；源码审查                                                           | 每个状态                                             | 在没有 client 指令的情况下添加客户端 API（状态、effect）会使 `serverSafeComponents.test.ts` 失败。缺口：与 client 指令一同添加的客户端 API 会通过，且 Grid 若添加布局测量，没有自动化检查会失败。                                           | `audit:Grid/behavior` |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                      | 使用方解剖与当前目标                                 | 缺失、多余或过时的映射会使仓库校验失败。                                                                                                                                                                                                    | `audit:Grid/theming`  |
| RTL relation        | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`），位于 `Grid / With grid span` 上 | 跨项与单轨道子项；LTR 与 RTL                         | 若第一个网格子项没有位于下一项的行内起点，则 D2 失败。                                                                                                                                                                                      | `audit:Grid/i18n-rtl` |

## Decision log

### DEC-1 — Numeric `columns` stays fixed; reflow uses the existing object form

**引用：** `component:Grid/DEC-1`

**决策者：** `cixzhang`，`2026-10-11`

`columns={N}` 表示在任何宽度下都恰好 N 条 `1fr` 轨道，而需要在小屏幕上重排的网格使用 `{minWidth, max?, repeat?}`。数字是固定契约；对象形式是响应式契约。

已否决：把数字重新定义为“至多 N”会破坏已发布的数字网格；`{count, isFixed}` 形状会与数字和 `max` 上限重复。

## Open questions

无。

## Content boundary

本文件不复制使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的所有者。
