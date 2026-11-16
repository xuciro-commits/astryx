---
schema_version: 3
template_version: 4
kind: component
id: component:Collapsible
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, accessibility, theming]
verified_by:
  [
    packages/core/src/Collapsible/Collapsible.test.tsx,
    packages/core/src/Collapsible/CollapsibleGroup.test.tsx,
    packages/core/src/Collapsible/__tests__/Collapsible.a11y.test.tsx,
    packages/core/src/Collapsible/__tests__/Collapsible.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:react-component-runtime,
    architecture:component-theming-surface,
  ]
contributing: [contributing:api-conventions]
system_specs: [spec:AST-002/DEC-1, spec:AST-020, spec:AST-021]
---

# Collapsible component contract

## Intent

Collapsible 通过一个展开触发器显示和隐藏一个内容区域。它的 chevron 以两种有意设定的布局模式传达相同的展开状态：末尾的状态指示符，或位于一列标签之前的前置展开箭头。

公开的轴是 chevron 的逻辑位置。调用方不提供任意提示内容，也不替换 Collapsible 的展开渲染。

## Compatibility and migration

- 已发布的默认值保持不变：是。省略新的位置会保留当前的末尾 chevron 与当前的无 prop 渲染。
- 兼容性类别：带稳定默认值的增量式可选公开轴。
- 受控/非受控行为：不变。
- 迁移决策：`component:Collapsible/DEC-1`。

使用方的迁移说明属于使用方文档与发行说明。

## Ownership boundary

**拥有**

- 展开触发器、其 `aria-expanded` / `aria-controls` 关系，以及表示展开状态的 chevron；
- `start | end` 逻辑 chevron 位置轴；
- 在 collapsed 和 expanded 状态下与位置相关的 chevron 方向；
- chevron 位置的组默认值、条目覆盖，以及嵌套条目隔离；以及
- 为保持位置契约所需的触发器标签布局。

**不拥有 / 非目标**

- 调用方提供的 chevron、提示、图标或渲染函数逃逸口；
- TreeList、Table 或其他组件的展开指示符；
- 通用图标解析或图形定制；
- 同级展开值协调、组状态，以及分隔的组包装器——由 `component:CollapsibleGroup` 拥有；
- 共享的响应式或方向性 API；或
- 新的内容展开动效行为。本决策之外的现有行为保持不变的，直到其自身的当前权威改变它。

## Public concepts

| 概念         | 封闭取值或状态                      | 含义                                                                              | 可用范围                        | 默认值                         | 所有者                                 | 稳定性 | 无效值行为          |
| ------------ | ----------------------------------- | --------------------------------------------------------------------------------- | ------------------------------- | ------------------------------ | -------------------------------------- | ------ | ------------------- |
| chevron 位置 | `start`, `end`                      | 触发器标签中拥有 Collapsible 展开 chevron 的逻辑侧                                | Collapsible 与 CollapsibleGroup | `end`                          | `component:Collapsible`                | 稳定   | 被公开类型拒绝      |
| 展开状态     | collapsed, expanded                 | 受控区域是隐藏还是显示                                                            | 每个 Collapsible                | 现有状态所有者                 | `component:Collapsible` 或组状态所有者 | 稳定   | 现有受控/非受控行为 |
| 组位置默认值 | 缺失, `start`, `end`                | 提供给直接组条目的公共位置                                                        | CollapsibleGroup                | 缺失，因此条目默认解析为 `end` | `component:Collapsible`                | 稳定   | 被公开类型拒绝      |
| 动画布局     | 缺失, 一个 `useAnimatedLayout` 句柄 | 打开和关闭时是否让 Collapsible 之后的内容滑动，直至该句柄的容器（`spec:AST-105`） | 每个 Collapsible                | 缺失：其后的内容立即就位       | `spec:AST-105`                         | 稳定   | 被公开类型拒绝      |

公开 prop 名为 `chevronPosition`。导出的值类型是 `CollapsibleChevronPosition`。`placement`、`side` 以及渲染术语不是该轴的平行公开名称。

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                            | 依据                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1  | Collapsible 必须公开 `chevronPosition?: 'start' \| 'end'`；省略时解析为 `end`。                                                                                                                                                                                                                                   | 所有者 API 决策；保持已发布默认值      |
| FR2  | `end` 必须在逻辑顺序上将 Collapsible 的 chevron 渲染在触发器标签之后。collapsed 的 `end` 指向下方；expanded 的 `end` 指向上方。                                                                                                                                                                                   | 已发布的末尾行为，加上已批准的位置契约 |
| FR3  | `start` 必须在逻辑顺序上将 Collapsible 的 chevron 渲染在触发器标签之前。collapsed 的 `start` 向内地指向标签/内容，因此其行内方向在 RTL 下镜像；expanded 的 `start` 指向下方。                                                                                                                                     | 已批准的前置展开行为                   |
| FR4  | 位置既改变 chevron 的字形/方向，也改变 DOM 顺序。复用垂直向下的 chevron 并将其旋转为侧向，不得使 collapsed 的 `start` 背离其内容。                                                                                                                                                                                | 方向与表示决策                         |
| FR5  | Collapsible 拥有并渲染两种位置下的 chevron。位置轴不得接受 `none`、任意 React 内容、提示回调、渲染器或其他替换型逃逸口。                                                                                                                                                                                          | 受约束的公开轴决策                     |
| FR6  | 触发器标签内容必须在任一位置都保留组合标签所需的可用行宽。将 chevron 移到 `start` 不得让标签滞留在对侧边缘，也不得阻止组合标签内容使用剩余行。                                                                                                                                                                    | 已批准的布局理由与现有增长行为         |
| FR7  | CollapsibleGroup 可以向其直接的 Collapsible 条目提供一个 `chevronPosition` 默认值。直接条目的显式位置必须覆盖组默认值。                                                                                                                                                                                           | 已批准的组一致性行为                   |
| FR8  | 嵌套在另一个条目的已展开内容中的 Collapsible 必须开始一个新的呈现作用域，并使用其自身的显式位置或组件默认值。外部组的位置不得泄漏到嵌套的展开区域中。                                                                                                                                                             | 已批准的嵌套隔离行为                   |
| FR9  | chevron 位置不得改变展开语义。同一触发器仍然是按钮，保留 `aria-expanded`，用 `aria-controls` 标识受控区域，并遵循现有的状态所有者。                                                                                                                                                                               | 现有无障碍与行为契约                   |
| FR10 | Collapsible 必须接受 `animatedLayout?: AnimatedLayout`。提供句柄时，打开和关闭通过它报告内容的尺寸变化，因此 Collapsible 之后的内容会在该句柄的容器内滑动，并且展开的内容与 chevron 在同一动效上移动（`spec:AST-105` FR1–FR4；`spec:AST-108` FR4a）。未提供句柄时，打开和关闭保持不变。该 prop 不得改变展开语义。 | `spec:AST-105` FR1, FR2                |

### Allowed variation

- **AV1 — 图形实现。** 只要 FR2–FR4 在视觉上和方向上仍然成立，确切的内部 Icon 名称与变换实现可以改变。
- **AV2 — 间距机制。** 外边距、间隙或等效的内部布局可以将前置 chevron 与其标签分开，同时保持 FR6。
- **AV3 — 组一致性。** 条目可以显式覆盖其组的位置。混合位置由优先级支持，但应保持为有意设定的例外，而不是偶然出现的逐行模式。
- **AV4 — 现有非 chevron 行为。** 展开状态所有权、禁用行为、分隔线/密度呈现、内容布局和展开动效仍由其现有权威管辖，不因本决策而改变。
- **AV5 — 内部区域元素。** 内容区域始终将其子元素包裹在一个内部元素中，因此边缘展开或收起会让它们在区域的裁剪下滑动（`spec:AST-105` FR9）。该元素是内部的：它既不是样式目标，也不是被承诺的结构。

### Representative states

| 状态                     | 必需的不变式                                           | 允许的变化        |
| ------------------------ | ------------------------------------------------------ | ----------------- |
| 缺失位置，collapsed      | chevron 位于标签之后并指向下方                         | 内部图标实现      |
| 缺失位置，expanded       | chevron 位于标签之后并指向上方                         | 内部旋转实现      |
| `start`，collapsed LTR   | chevron 位于标签之前，并向内联末端指向内容             | 内部图形          |
| `start`，collapsed RTL   | chevron 位于逻辑起始处的标签之前，并向内联末端指向内容 | 内部图形/镜像机制 |
| `start`，expanded        | chevron 位于标签之前并指向下方                         | 内部过渡机制      |
| 组 `start`，条目缺失     | 直接条目解析为 `start`                                 | 呈现上下文实现    |
| 组 `start`，条目为 `end` | 直接条目解析为 `end`                                   | 呈现上下文实现    |
| 组 `start`，嵌套条目缺失 | 嵌套条目解析为组件默认值 `end`                         | 上下文重置实现    |

### Transformation and precedence order

- **ORD1 — 位置优先级。** 条目 `chevronPosition` → 直接外围 CollapsibleGroup 的 `chevronPosition` → 组件默认值 `end`。
- **ORD2 — 方向解析。** 先解析位置与展开状态；将文档方向应用于 `start` 的向内行内方向。`end` 仍为垂直向下/向上指示符，不会镜像为水平提示。

## Accessibility contract

- **AR1 — 展开语义保持首要地位。** 触发器必须独立于 chevron 图形暴露其展开状态与受控区域关系。
- **AR2 — 位置是视觉顺序，不是朗读重复。** 移动装饰性 chevron 不得重复无障碍名称或增加第二个焦点目标。
- **AR3 — 方向仍然可理解。** collapsed 的前置提示在 LTR 和 RTL 下都必须指向内容；在 RTL 下不得保留 LTR 的物理方向。
- **AR4 — 焦点离开正在关闭的内容。** 当 Collapsible 关闭而焦点位于其内容内时，无论以何种方式关闭（所有者设置的 `isOpen`、组的值），焦点都会移到其触发器，包括内容播放退出动效期间（FR10）。位于其他任何位置的焦点不会移动（WCAG 2.2 SC 2.4.3）。

## Design relationships

这两种位置表达了既有的展开模式：

- `end` 是末尾状态指示符：collapsed 时向下，expanded 时向上；
- `start` 是前置的树/文件浏览器展开箭头：collapsed 时向内，expanded 时向下。

本契约选择这些关系，但不暴露任意图标或提示选择。主题可以为所属的 Collapsible 目标设置样式，而不改变语义方向或位置状态。

## Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "collapsible"},
  "Trigger": {"target": "collapsible-trigger"},
  "Chevron": {
    "delegatesTo": {"owner": "component:Icon", "target": "icon"}
  },
  "Content": {"target": "collapsible-content"},
  "Group container": {"target": "collapsible-group"}
}
```

容器拥有分隔行外观，而触发器与内容分别拥有各自独立的绘制与展开状态选择器表面。chevron 保留 Icon 的目标；Collapsible 拥有其语义位置与方向。CollapsibleGroup 是本契约的聚合子组件，因此其条件包装器目标在此映射到 Group 容器解剖。

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖资格认定、目标放置、视觉轴与状态反映，以及委托的 Icon 所有权。
- 公开的 `useCollapsible` hook 保留其现有状态行为与使用方文档。本组件拥有渲染出的触发器、chevron，以及聚合的组件/组协议。
- `architecture:public-component-api` 拥有已准入的位置 prop 与导出类型的可达性与兼容性。
- `architecture:react-component-runtime` 拥有上下文标识/生命周期；本记录拥有呈现值与嵌套作用域结果。
- `spec:AST-002/DEC-1` 准入该轴，因为其他方面完全相同的展开布局需要调用方拥有的前置与末尾模式。它不准入自定义提示渲染。

## Verification map

| 契约               | 验证                                                                                                                                                                                                                                                                                                  | 代表性状态                                                                       | 变异或失败预期                                                                                                               | 审计章节                          |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | --------------------------------- |
| FR1–FR5            | Collapsible prop/类型、DOM 顺序、字形/方向，以及无额外取值的测试                                                                                                                                                                                                                                      | 缺失/end/start；collapsed/expanded；LTR/RTL                                      | 默认值改变、`start` 跟随标签、collapsed 的前置提示指向外侧，或准入不支持的提示取值                                           | audit:Collapsible/public-api      |
| FR6                | 组合触发器布局与几何测试                                                                                                                                                                                                                                                                              | 纯文本；带末尾内容的组合标签；start/end                                          | 标签变为收缩包裹/滞留，或组合内容无法使用剩余行                                                                              | audit:Collapsible/layout          |
| FR7–FR8, ORD1      | 组继承、条目覆盖，以及嵌套重置测试                                                                                                                                                                                                                                                                    | 组 start/end；条目覆盖；嵌套缺失                                                 | 组的值被忽略、条目无法覆盖，或位置泄漏到嵌套内容中                                                                           | audit:Collapsible/behavior        |
| FR9, AR1–AR3, ORD2 | 通过 `DISCLOSURE_PATTERN` 验证展开语义，再加上组件拥有的 chevron 与真实的 RTL 渲染                                                                                                                                                                                                                    | collapsed/expanded；受控/非受控；启用/禁用；start/end；LTR/RTL                   | 位置改变了状态行为、触发器失去受控内容关系、内容可见性与状态背离、无障碍输出重复，或前置方向未能镜像                         | audit:Collapsible/accessibility   |
| FR10               | `animatedLayoutAdopters.test.tsx`（有句柄与无句柄；所有者设置的 `isOpen` 与组的受控值会滑动；StrictMode 下一次测量，被拒绝的变更则没有测量；退出过程保持惰性直到结束）以及 `animatedLayoutAdopters.interaction.browser.spec.ts`（通过 ScrollableArea ref 的 `Core/Animated layout` 故事，打开与关闭） | 无句柄；有句柄；点击、所有者设置与组驱动的变更；打开与关闭                       | 提供句柄时其后的内容跳动、所有者设置的变更立即落地、关闭的内容在退出前消失或在退出期间仍可触达，或在不提供句柄时发生任何改变 | audit:Collapsible/behavior        |
| AR4                | `Collapsible.test.tsx` 的关闭焦点套件；`animatedLayoutAdopters.test.tsx` 中退出期间焦点位于内容内的关闭；`CollapsibleCloseFocus.a11y.chromium.spec.ts`                                                                                                                                                | 焦点位于内容内、所有者设置的关闭，有句柄与无句柄；焦点在外；触发器触发关闭；打开 | 焦点留在隐藏或惰性的内容内、留在页面主体上，或在其原本不在内容内时被移动，均视为失败。                                       | `audit:Collapsible/accessibility` |
| Theming anatomy    | 聚焦的目标反映断言，加上 `themingTargets.test.ts`                                                                                                                                                                                                                                                     | 独立/分组；打开/关闭；启用/禁用；start/end；分隔/密度                            | 驱动样式的轴或状态从其拥有的目标上消失、目标失去解剖所有者，或 chevron 不再委托给 Icon                                       | audit:Collapsible/theming         |

## Decision log

### DEC-1 — Chevron position is the public axis

**Reference:** `component:Collapsible/DEC-1`

**Decider:** `cixzhang`, `2026-09-07`

调用方可以选择逻辑 chevron 位置 `start` 或 `end`。Collapsible 拥有提示并派生其与位置相关的字形与方向。`start` 用于前置展开模式，例如树/文件浏览器行；`end` 保留已发布的末尾指示符。

已否决：`chevronPlacement`、`none`、`hasChevron`、调用方提供的提示内容，以及渲染回调。这些表面要么暴露渲染机制，要么允许组件的展开可供性消失，而不是表达已批准的调用方拥有的布局区分。

### DEC-2 — Group defaults do not leak through content

**Reference:** `component:Collapsible/DEC-2`

**Decider:** `cixzhang`, `2026-09-07`

CollapsibleGroup 可以向其直接条目提供位置，条目可以覆盖它。嵌套在条目主体内的 Collapsible 会开始一个新的呈现作用域，因此外部列表的视觉惯例不会悄悄改变独立的展开区域。

## Open questions

无。

## Content boundary

本文件拥有 Collapsible 的持久语义概念、chevron 位置行为、优先级与证据。使用方 prop 表格/示例仍位于 `Collapsible.doc.mjs` 与 `CollapsibleGroup.doc.mjs`。确切的 Icon 名称、变换、StyleX 声明、上下文字段、实现计划、审计结果，以及 pull-request 裁决不属于此处。
