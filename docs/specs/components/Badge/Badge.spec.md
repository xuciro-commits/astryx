---
schema_version: 3
template_version: 7
kind: component
id: component:Badge
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Badge/Badge.test.tsx,
    packages/core/src/serverSafeComponents.test.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/Badge.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# Badge component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                      |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 只读的单行标签，必须有 `label`，可选的前置 `icon`，以及可被主题扩展的 `variant`（默认 `neutral`）。                                           |
| Behavior                | badge 永不换行；宽于可用空间的标签会在 badge 内部以省略号裁切，字符串或数字标签还会写入根节点的 `title`。                                     |
| End-user impact         | 读者看到的是紧凑的状态或类别标签，且始终位于其容器之内；辅助技术读取完整的标签文本。                                                          |
| Builder impact          | 无；本记录描述的是已发布的行为。                                                                                                              |
| Compatibility/readiness | 已发布的行为，记录为 current；无 API、默认值或输出变化。Current-state impact 下列出了一处实现缺口。                                           |
| Review checks           | 拒绝会换行或溢出容器的 badge、由富标签推导出的 `title`、自行添加 role、tab 停靠点或 live region 的 badge，以及未在 `badge` 上映射的 variant。 |
| Governing rules         | `architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV2,INV6,INV14`。                                |

本表是审查投影；以下正文具有权威性。

## Intent

Badge 用一个简短、非交互的标签标记某一种状态或类别。它负责标签的单行几何、其溢出处理，以及主题可以扩展的那一组封闭的内置色调。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性类别：公共 prop 或默认值均无变化。DOM 与样式输出有变化：不含从右到左字母的纯文本标签会获得 `dir="ltr"`，且标签会隔离其文本（`unicode-bidi: isolate`）
- 受控/非受控行为：不适用；Badge 不持有任何状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明的内容。

## Current-state impact

- **被裁切的标签尾部仅对指针可见（AR4）。** 键盘与触摸用户无法显示长标签被裁切的尾部；只有在原生 `title` 上悬停指针才会显示它。辅助技术仍可从 DOM 获得完整文本。

## Ownership boundary

**拥有**

- badge 根节点、其可选的位于前部的 Icon 槽位，以及 Label 容器。
- 单行几何、行内内边距、圆角、字体排版，以及省略号溢出处理。
- 内置 `variant` 色调，以及 `variant` 在 `badge` 主题目标上的映射。
- 由字符串或数字标签推导根节点的 `title`。

**不拥有 / 非目标**

- 产品显示哪个状态或类别、其措辞，以及是否适合使用 badge —— 由产品调用点及 `Badge.doc.mjs` 中的使用方指南负责。
- 所提供的图标的图形、尺寸与无障碍暴露 —— 由所提供的节点负责（传入 Icon 时为 `component:Icon`）。
- 类标签式与仅圆点式的状态呈现 —— 由 `component:Token` 与 `component:StatusDot` 负责。
- 每种色调所用颜色 token 的对比度 —— 由当前生效的主题负责。

## Public concepts

| Concept           | Closed values or states                                                                                                                                | Meaning                                      | Availability by variant/orientation/state | Default   | Owner             | Stability | Invalid-value behavior                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- | ----------------------------------------- | --------- | ----------------- | --------- | -------------------------------------------------------------------------------------------- |
| 色调（`variant`） | 语义：`neutral`、`info`、`success`、`warning`、`error`；颜色：`blue`、`cyan`、`green`、`orange`、`pink`、`purple`、`red`、`teal`、`yellow`；主题新增值 | 选择 badge 的填充色与文字颜色。              | 所有 badge                                | `neutral` | `component:Badge` | 稳定      | 主题新增的值会映射到 `badge`，且不会获得组件填充或颜色（FR6）；TypeScript 会拒绝未注册的值。 |
| Label             | 字符串、数字或富节点                                                                                                                                   | 可见的 badge 内容。                          | 始终渲染；必填                            | 必填      | `component:Badge` | 稳定      | 空字符串会渲染空标签，且不设置 `title`。                                                     |
| Icon              | 存在；不存在                                                                                                                                           | 可选的、由调用方提供的节点，显示在标签之前。 | 所有 badge                                | 不存在    | `component:Badge` | 稳定      | 不存在时不渲染图标，也不渲染占位符。                                                         |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                                                                                         | Basis                    |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1 | Badge 渲染一个 inline-flex 的 `span` 根节点，在两个轴向上居中，块向尺寸为 `--spacing-5`（在 `spec:AST-102` FR4 下随设定文字尺寸增长后至少为该尺寸；当前的固定尺寸是一个缺口），无块向内边距，行内内边距为 `--spacing-2`，圆角为 `--radius-full`，字体族继承，字号为 `--text-supporting-size`、行高为 `--text-supporting-leading`，字重为 `--font-weight-medium`。 | 当前源码                 |
| FR2 | 传入 `icon` 时，它直接渲染在根节点内部、Label 容器之前，并以 `--spacing-1` 分隔；标签始终渲染在其自身的 Label 容器内。                                                                                                                                                                                                                                            | 当前源码与测试           |
| FR3 | badge 只有一行，且永不换行。根节点的行内尺寸以容器为上限，并可收缩到小于其内容尺寸；放不下的标签会在 Label 容器内以尾部省略号裁切，且不会溢出 badge。                                                                                                                                                                                                             | 当前源码与使用方文档     |
| FR4 | 非空字符串标签或任何数字标签会把根节点的 `title` 设为标签文本，无论标签是否被裁切。富节点标签或空字符串标签不设置 `title`。                                                                                                                                                                                                                                       | 当前源码与测试           |
| FR5 | `variant` 默认为 `neutral`。`neutral` 以 `--color-neutral` 作填充，配主文字颜色；`info`、`success`、`warning` 与 `error` 使用各自的强状态填充（`--color-<status>`）和与之匹配的 `--color-on-<status>` 文字色，并在强制颜色模式下保留 `CanvasText` 描边；每个颜色变体用其着色背景配相应的彩色文字。                                                                | 当前源码与使用方文档     |
| FR6 | `badge` 目标对每个取值都携带解析后的 `variant`，包括主题通过 `BadgeVariantMap` 新增的值。主题新增的值不会获得组件填充或文字颜色，因此在主题绘制它之前，它会以继承的文字颜色、在透明背景上呈现 FR1 的几何。                                                                                                                                                        | 当前源码与可扩展轴测试   |
| FR7 | `ref` 到达根 `span`。受支持的 DOM、ARIA、data 与事件 prop 会到达根节点；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                                                                                                                                                                                                                             | 当前源码与测试           |
| FR8 | Badge 不使用 hook、测量或仅客户端 API，因此它在服务端与客户端的渲染结果一致。                                                                                                                                                                                                                                                                                     | 当前源码与服务端安全测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以更改 `badge` 的任何视觉属性，包括按 `variant` 的填充、文字颜色、高度与圆角，而不改变结构、单行规则或 `title` 规则。
- **AV2 — 标签内容。** 标签长度与内容可以变化；裁切位置取决于可用的行内尺寸。

### Representative states

| State              | Required invariant                                      | Allowed variation      |
| ------------------ | ------------------------------------------------------- | ---------------------- |
| 默认               | 中性色调、单行、`title` 等于该字符串标签。              | 标签文本。             |
| 带图标             | Icon 在行内起始侧渲染于 Label 容器之前。                | Icon 的图形与尺寸。    |
| 计数               | 数字标签以文本形式渲染，并把 `title` 设为其字符串形式。 | 色调。                 |
| 长标签、窄容器     | badge 保持在其容器内，标签以省略号结尾。                | 裁切位置。             |
| 富标签             | 节点渲染在 Label 容器内，且不设置 `title`。             | 节点内容。             |
| 主题新增的 variant | `data-variant` 指明新增的值；不应用组件填充或颜色。     | 针对新增值的主题绘制。 |

### Transformation and precedence order

- **ORD1 — 根节点属性。** 组件 class 与 `data-variant` → 组件样式 → `xstyle` → `className` → `style` → 推导出的 `title` → 其余调用方 prop。
- **ORD2 — 内容顺序。** 按逻辑行内顺序，先 Icon，再 Label 容器。

### Performance and resources

- **PR1 — 静态渲染。** Badge 不注册监听器、观察器、定时器或 effect，也不进行布局测量。

## Accessibility contract

- **AR1 — 静态文本。** Badge 不添加自己的 role、tab 停靠点或 live region，并把标签作为按阅读顺序的普通文本暴露，因此标签变化不会被播报。调用方传入的 `role` 或 `tabIndex` 会透传（FR7）。
- **AR2 — 含义在文本中。** Badge 把 `label` 渲染为文本，色调颜色是该文本的补充。空标签会渲染出一个仅有颜色的 badge，在无障碍树中没有任何内容；提供有意义的标签是调用点的责任。
- **AR3 — 图标的暴露被委托。** Badge 不为所提供的图标添加名称、role 或 `aria-hidden`；其暴露由所提供的节点自身负责（在 `component:Icon` 下，没有标签的 Icon 属于装饰性）。
- **AR4 — 完整文本保留在 DOM 中。** 裁切仅是视觉上的：完整标签仍留在无障碍树中，FR4 的 `title` 将其暴露给指针悬停。实现缺口：键盘与触摸用户无法显示被裁切的尾部。

## Design relationships

| Anatomy or state | Design requirement                                  | Representation authority | Hierarchy role | Component contract |
| ---------------- | --------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| Badge 根节点     | 紧凑的单行胶囊，其色调传达状态或类别。              | 当前源码                 | 辅助           | FR1, FR3, FR5, FR6 |
| Icon             | 可选的、位于前部的字形，用于帮助辨识 badge 的类型。 | 当前源码与文档           | 辅助           | FR2, AR3           |
| Label            | 承载 badge 含义的文本或数字。                       | 当前源码与文档           | 主要           | FR3, FR4, AR2, AR4 |

主题化：根节点是唯一的 `badge` 目标，并映射 `variant`。Label 容器与 Icon 槽位不新增目标：标签继承 `badge`，而所提供的图标保留其自身样式并继承 badge 的文字颜色。

## Family and system relationships

- `architecture:public-component-api` 负责 ref、透传与样式输入规则；FR7 将它们应用于根 `span`。
- `architecture:component-theming-surface` 负责目标资格、状态映射与可扩展轴规则；FR6 记录 Badge 的可扩展 `variant` 轴及其未加主题时的回退行为。

## Verification map

| Contract                      | Verification                                                                         | Representative states                                                                                             | Mutation or failure expectation                                                                                                                           | Audit section          |
| ----------------------------- | ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| FR2, FR7                      | `Badge.test.tsx`                                                                     | Icon、ref、透传                                                                                                   | 去掉图标、ref 或某个透传 prop 会使 DOM 断言失败。缺口：图标先于标签的顺序未被测试。                                                                       | `audit:Badge/behavior` |
| AR1–AR3                       | 源码审查                                                                             | 默认、带图标                                                                                                      | 缺口：若 Badge 添加自己的 role、tab 停靠点、live region 或图标语义，没有任何自动化检查会失败。                                                            | `audit:Badge/a11y`     |
| FR5                           | `Badge.test.tsx` 的 `data-variant` 断言；浏览器中 `Badge.stories.tsx` 的变体测试夹具 | `success` 与 `purple` 的映射；每种色调均已渲染                                                                    | 这些色调丢失 `data-variant` 会失败。缺口：没有自动化检查覆盖 `neutral` 默认值的映射或任何色调的绘制；绘制变化只能在渲染出的测试夹具中看到。               | `audit:Badge/theming`  |
| FR4, AR4                      | `Badge.test.tsx` 的完整标签测试套件                                                  | 字符串、数字、富节点与空标签                                                                                      | 由富节点或空标签设置 `title`，或对字符串或数字不设置它，都会失败。缺口：没有检查断言被裁切的标签在无障碍树中保持完整。                                    | `audit:Badge/a11y`     |
| FR1, FR3                      | 浏览器中 `Badge.stories.tsx` 的长标签测试夹具                                        | 紧凑空间中的长标签                                                                                                | 换行或溢出 badge 的标签在渲染出的测试夹具中可见。                                                                                                         | `audit:Badge/layout`   |
| FR6                           | `extensibleAxes.test.ts`、`themingTargets.test.ts`                                   | `BadgeVariantMap`、`badge` 目标                                                                                   | 从目标映射或文档的 `visualProps` 中移除 `variant` 会使结构检查失败。缺口：没有测试渲染主题新增的值，因此未加主题时的回退仅通过源码审查验证。              | `audit:Badge/theming`  |
| FR8, PR1                      | `serverSafeComponents.test.ts`                                                       | 导入图                                                                                                            | 为 Badge 添加 hook 或仅客户端导入会违反服务端安全不变式。                                                                                                 | `audit:Badge/behavior` |
| `design:bidirectionality` DR2 | `MixedDirectionText.a11y.chromium.spec.ts`                                           | `https://`、`.com`、`+3`、`@alice`、`iPhone جديد` 与 `example.com موقع` 在 RTL 和 LTR 下（Mixed Direction story） | 若标签的弱字符或中性字符在 RTL 下重排（`//:https`、`com.`、`3+`、`alice@`），或以拉丁词开头的从右到左文本被排成从左到右，则会在每个字符的渲染位置上失败。 | `audit:Badge/layout`   |

## Decision log

无记录。本记录描述的是已发布的行为。

## Open questions

- **OQ1 — 被裁切标签的完整文本应如何到达键盘与触摸用户？**（`human-design`）选项包括：仅在标签被裁切时显示的、经过测量的 tooltip，这会使 Badge 成为客户端组件并在被裁切时可聚焦；或把恢复手段留给调用点。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它改为链接到其所有者。
