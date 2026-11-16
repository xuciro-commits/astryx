---
schema_version: 3
template_version: 3
kind: component
id: component:Icon
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-30
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/Icon/Icon.test.tsx,
    packages/core/src/Icon/__tests__/IconAudit.a11y.chromium.spec.ts,
    packages/core/src/IconButton/IconButton.test.tsx,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-087]
---

# Icon component contract

## Intent

Icon 呈示一个视觉符号，具有一致的尺寸、颜色和无障碍语义。使用方用法仍记录在 `Icon.doc.mjs` 中。

## Compatibility and migration

- 保留的已发布默认值：对显式尺寸和独立 Icon 为 `yes`
- 兼容类别：组件自有的 Icon 插槽可以提供上下文默认值；显式 Icon 尺寸和独立的 `md` 回退保持不变
- 受控/非受控行为：不适用
- 迁移决策：使用方无需迁移；当所属 Astryx 组件应选择上下文默认值时，省略 `size`

使用方迁移说明应归属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- 接受语义图标键或提供的图标组件作为字形来源。
- 将解析后的尺寸以及条目可接收的变体传递给注册表条目。
- 解析显式、组件自有的上下文以及独立的尺寸默认值。
- 将 Icon 的尺寸、颜色、主题目标与无障碍语义应用到所渲染的字形。

**不拥有 / 非目标**

- 共享注册表的键解析与回退顺序——由共享图标系统拥有。
- 所属 Astryx 组件为其图标插槽选择哪个上下文默认值——由该组件或 family 契约拥有。
- 字形在产品语境中的含义，或邻近文本是否使其成为装饰性——由产品调用点拥有。
- 交互、焦点或控件命名——由交互父级拥有。
- 使用方提供的或通过主题注册的图稿。
- 公开的 Icon 尺寸提供方 API；上下文传递属于实现细节。

## Public concepts

| 概念     | 封闭取值或状态                                    | 含义                             | 按变体/方向/状态的可获得性         | 默认值                            | 所有者           | 稳定性 | 无效值行为                                          |
| -------- | ------------------------------------------------- | -------------------------------- | ---------------------------------- | --------------------------------- | ---------------- | ------ | --------------------------------------------------- |
| 字形来源 | 语义键、带命名空间的扩展键或图标组件              | 选择视觉符号。                   | 每次渲染                           | 必需                              | `component:Icon` | 稳定   | TypeScript 拒绝不受支持的内置字符串取值。           |
| 尺寸     | `xsm`、`sm`、`md`、`lg`                           | 选择图标盒子的尺寸。             | 每个已渲染的字形                   | 最近的组件自有默认值；否则为 `md` | `component:Icon` | 稳定   | TypeScript 拒绝不受支持的取值。                     |
| 颜色     | 已文档化的语义取值与调色板取值                    | 选择字形颜色，或从上下文继承它。 | 每个已渲染的字形                   | `inherit`                         | `component:Icon` | 稳定   | TypeScript 拒绝不受支持的取值。                     |
| 无障碍   | 装饰性或带意义标签                                | 控制辅助技术是否接收该字形。     | 每个已渲染的字形                   | 装饰性                            | `component:Icon` | 稳定   | 空标签使用装饰性行为。                              |
| 变体     | `IconVariantMap` 中的名称；当前主题列出自己的名称 | 为注册表字形请求主题的替代图稿。 | 仅注册表字形；绝不适用于提供的组件 | 无                                | `component:Icon` | 稳定   | TypeScript 拒绝未知名称；未列出的变体渲染普通图稿。 |

当前，无法解析的带命名空间键不渲染任何内容。这是既有行为，并非有意承诺的回退。

## Behavioral and layout contract

各项需求标明其依据，以免把观察到的代码误当作有意的决策。

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                | 依据                                                                | 草稿审查状态                 |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------------------------- |
| FR1 | Icon 必须最多从所提供的语义键、带命名空间的键或图标组件呈示一个字形。                                                                                                                                                                                                                                                     | 已记录的承诺与当前测试。                                            | 已确定的意图。               |
| FR2 | 每个已渲染的字形都必须携带带其解析后尺寸与所选颜色的 `icon` 主题目标，并把这些信息反映为目标数据。                                                                                                                                                                                                                        | 当前源码、文档与主题测试。                                          | 已确定的意图。               |
| FR3 | Icon 必须将解析后的尺寸作为每个字形的宽度与高度应用，并在基于 1em 的图标来源需要时应用字号。该尺寸契约不得承诺 HTML 或 SVG 元素类型。                                                                                                                                                                                     | 人为决策、当前源码与测试。                                          | 已确定的意图。               |
| FR4 | 受支持的 SVG 与样式逃生舱口必须保留其既有的合并与覆盖行为。                                                                                                                                                                                                                                                               | 当前源码与回归测试。                                                | 当前兼容行为；变更前须验证。 |
| FR5 | 显式的 Icon `size` 必须优先。没有显式尺寸时，Icon 必须使用所属 Astryx 组件为其已文档化的图标插槽所提供的最近默认值；没有此类默认值时，Icon 必须使用 `md`。                                                                                                                                                                | 组件尺寸优先级与 Button 尺寸决策。                                  | 已确定的意图。               |
| FR6 | 在注册表模式下，Icon 必须将 `{size, variant}` 传递给选中的条目，其中 `size` 是 ORD1 解析出的尺寸，而 `variant` 是所请求的变体——前提是当前主题列出它，并且对于主题提供的条目，定义该条目的主题也列出它；否则为 `undefined`。提供的图标组件不得接收 `variant`，Icon 不得将 `variant` 转发给 DOM，且 `icon` 目标不得反映它。 | `spec:AST-087` FR1–FR5 与 FR9。                                     | 已确定的意图。               |
| FR7 | `icon` 目标必须在其 `size:*` 选择器上保证 `width` 与 `height`，作为经审查的目标专用附加项，使主题可以设置每个尺寸的维度。在没有主题样式的情况下，尺寸在 16px 根字号下为 12、16、20 和 24px，并随根字号缩放。                                                                                                              | `spec:AST-087` FR10。                                               | 已确定的意图。               |
| FR8 | `ref` 对每个名称都指向解析后字形所渲染的 svg；当字形不渲染 svg 时，`ref` 为 `null`。若字形之后替换了自己的 svg，则不会跟随。                                                                                                                                                                                              | 与 Icon 的公开 `ref` 类型 `Ref<SVGSVGElement>` 保持一致；缺陷修复。 | 已确定的意图。               |

### Allowed variation

- **AV1 — 图稿。** 路径、视图框与内部结构可以随图标来源或主题而变化，而不改变 Icon 由单一部件构成的使用方解剖结构。
- **AV2 — 渲染策略。** Icon 可以直接渲染提供的图标组件，或对已解析的键使用内部包装；两种元素形态都不属于公共解剖结构。
- **AV3 — 主题与使用方样式。** 既有的主题与样式逃生舱口可以更改视觉 CSS 属性，而不改变字形所有权。
- **AV4 — 上下文映射。** 所属 Astryx 组件可以将其自己的公开尺寸或变体映射为某个 Icon 默认值。该映射属于拥有者，并且必须保留显式 Icon 尺寸与独立回退。

### Representative states

| 状态                       | 必需不变式                                         | 允许的变化                 |
| -------------------------- | -------------------------------------------------- | -------------------------- |
| 语义键                     | 一个已解析的字形携带 `icon` 目标。                 | 主题、注册表或内置图稿。   |
| 带命名空间的扩展键         | 已解析的扩展字形携带 `icon` 目标。                 | 使用方或库自有的图稿。     |
| 提供的图标组件             | 提供的字形携带 `icon` 目标。                       | 组件实现与 SVG 内部结构。  |
| 不带 `size` 的独立 Icon    | 解析后的尺寸为 `md`。                              | 字形来源与颜色。           |
| 不带 `size` 的自有图标插槽 | 使用最近的已文档化组件默认值。                     | 所属组件所声明的尺寸映射。 |
| 自有插槽中的显式 Icon 尺寸 | 显式 Icon 尺寸优先于上下文默认值。                 | 任何受支持的 Icon 尺寸。   |
| 未解析的带命名空间键       | 当前不渲染任何字形。                               | 意图未确立任何回退行为。   |
| 已列出的变体               | 当其定义主题也列出该变体时，条目会收到尺寸与变体。 | 该主题针对该请求的图稿。   |
| 未列出或省略的变体         | 条目收到 `variant: undefined`。                    | 主题的普通图稿。           |
| 提供的组件上的变体         | 组件按给定内容渲染，不带 `variant`。               | 组件实现。                 |

### Transformation and precedence order

- **ORD1 — 尺寸解析。** 解析显式的 Icon `size` → 最近的组件自有上下文默认值 → 独立的 `md` 回退。
- **ORD2 — 呈现。** 应用目标、解析后的尺寸与组件颜色样式，然后按既有顺序合并使用方 `xstyle`、`className`、内联 `style` 与受支持的透传 props。

### Performance and resources

- **PR1 — 渲染工作。** Icon 不拥有任何监听器、观察器或布局测量；语义与尺寸解析在渲染期间同步完成。

## Accessibility contract

- **AR1 — 装饰性默认。** 没有非空 `label` 时，Icon 必须默认向辅助技术隐藏其字形。
- **AR2 — 有意义的字形。** 非空 `label` 必须将该字形作为具有该可访问名称的图像暴露。
- **AR3 — 父级拥有的交互。** Icon 不得添加交互语义或焦点行为；交互父级拥有控件及其名称。

## Design relationships

| 解剖结构或状态 | 设计要求                                   | 呈现权威                                | 层级角色     | 组件契约           |
| -------------- | ------------------------------------------ | --------------------------------------- | ------------ | ------------------ |
| 字形           | 以解析后的尺寸与颜色承载解析后的视觉符号。 | 使用方或注册表选择图稿；Icon 拥有呈现。 | 依上下文而定 | FR1、FR2、FR3、FR5 |

`Glyph` 在两种来源模式下都是唯一的概念性使用方部件。当前实现可以直接渲染提供的图标组件，或将注册表解析出的图标放入内部包装中；本契约有意不承诺 `span`、`svg` 或其他元素类型。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Glyph": {"target": "icon"}
}
```

## Family and system relationships

- `architecture:component-size-cascade` 拥有共享的显式 → 最近提供方 → 组件回退模式，并要求声明提供方所有权。Icon 在标准元素尺寸级联之外保留自己的 `xsm | sm | md | lg` 轴，并为组件自有默认值采用该优先级。
- `architecture:component-theming-surface` 拥有 `icon` 目标的限定与校验规则。
- `architecture:icon-resolution-and-component-slots` 拥有在 Icon 渲染所选来源之前的语义键与组件插槽解析。
- `spec:AST-087` 决定 `variant` 请求、主题所列举的变体名称与主题设置的尺寸维度。
- `architecture:public-component-api` 拥有 Icon 公开 props 与可观察默认值的准入与兼容性规则。
- 所属组件或 family 规定每个上下文 Icon 尺寸映射。Button 族目前将 `sm` 与 `md` 控件映射为 `sm` Icon，将 `lg` 控件映射为 `md` Icon。
- Icon 当前没有 family 契约。

## Verification map

| 契约               | 验证                                                                              | 代表性状态                                                                                                 | 变异或失败预期                                                                                                                                                                                  | 审计小节                   |
| ------------------ | --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1、FR3、FR5      | `Icon.test.tsx` 尺寸套件与 `IconButton.test.tsx` 上下文尺寸套件                   | 独立默认值；Button 尺寸；显式覆盖；两种模式                                                                | 破坏来源渲染、独立回退、上下文映射、显式优先级或跨模式尺寸会使断言失败。                                                                                                                        | `audit:Icon/behavior`      |
| FR2、FR4           | `Icon.test.tsx` 主题目标反映与样式 prop 套件                                      | 两种来源模式；每种颜色与尺寸；省略颜色；`className`、`style` 与 `xstyle`                                   | 移除目标、在任一模式下丢弃 `data-color` 或 `data-size`，或破坏覆盖组合会使断言失败。                                                                                                            | `audit:Icon/theming`       |
| FR2、FR3（已渲染） | `IconAudit.a11y.chromium.spec.ts` 传感器回执                                      | 语义键与图标组件；每种尺寸与颜色；浅色与深色下的 Neutral 与 Butter；从右到左；320px                        | 字形缺少其目标数据、颜色未绘制其 token、在 Neutral 主题下尺寸不按 12、16、20 与 24px 递增、注册表图稿未填满其盒子，或字形被变换，都会使回执失败。                                               | `audit:Icon/theming`       |
| AR1、AR2、AR3      | `Icon.test.tsx` 可访问名称套件与 `IconAudit.a11y.chromium.spec.ts` 可访问名称回执 | 装饰性、带标签、显式 ARIA 覆盖；写出自己 `aria-hidden` 的带标签图标组件                                    | 更改默认或带标签语义，或在带标签字形上保留组件自己的 `aria-hidden`，会使无障碍断言失败。                                                                                                        | `audit:Icon/accessibility` |
| FR6                | `Icon.test.tsx` 变体套件                                                          | 已列出、未列出与省略的变体；无活动列表；替换列表下的继承条目；提供的组件                                   | 未列出的变体，或条目定义主题未列出的变体，到达某个条目，或 `variant` 到达提供的组件或 DOM。                                                                                                     | `audit:Icon/behavior`      |
| FR7                | `Icon.test.tsx` 主题尺寸维度套件                                                  | 每个尺寸在有和没有主题样式下，两种来源模式                                                                 | 受主题控制的尺寸不改变字形维度，或未样式化的尺寸发生改变。                                                                                                                                      | `audit:Icon/theming`       |
| FR8                | `Icon.test.tsx` 的 "ref reaches the rendered svg for every name" 套件             | 图标组件；语义名称；带命名空间的键；文本字形；字形变更（组件到组件、svg 到文本）；跨重渲染的函数条目；卸载 | 对任何名称种类，`ref` 保持为空或持有已渲染 `<svg>` 之外的任何内容都会失败；文本字形出现非空 `ref`、`ref` 滞留在被替换的字形上、`ref` 在每次重渲染时重新附加，以及卸载后仍设置 `ref`，也会失败。 | `audit:Icon/ref`           |
| 主题解剖映射       | `scripts/check-knowledge.mjs`                                                     | 规范的使用方解剖结构与当前目标                                                                             | 缺失、多余、带前缀或过期的映射会使仓库校验失败。                                                                                                                                                | `audit:Icon/theming`       |

## Decision log

### DEC-1 — One conceptual Glyph across source modes

**Reference:** `component:Icon/DEC-1`

**Decider:** cixzhang, 2026-08-30

无论视觉符号来自语义键还是提供的组件，使用方都对同一个符号进行主题化与推理。因此 `Glyph` 映射到既有的 `icon` 目标，而不冻结任一模式当前的元素形态。Icon 为每种来源应用宽度与高度，并在基于 1em 的来源需要时添加字号。这在不为 `span`、`svg` 或其他元素作出承诺的前提下，保留了一个一致的图标盒子。

已否决：单独的包装与 SVG 解剖条目，因为那些描述的是实现策略，而非稳定的使用方概念。

### DEC-2 — Owning components may provide contextual Icon defaults

**Reference:** `component:Icon/DEC-2`

**Decider:** cixzhang, 2026-09-23

人们应当看到与其拥有该插槽的 Astryx 组件相称的图标，而无需每个调用方重复指定尺寸。因此所属组件可以提供默认值，同时显式 Icon 尺寸仍具权威性，独立 Icon 仍为 `md`。提供方对象、hooks 与上下文形态仍是私有实现细节，而非公共 API。

已否决：在每个组合内部无条件使用 `md` 默认值、迫使每个调用方重复由拥有者派生的尺寸，以及将提供方机制作为公共 API 暴露。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或系统规则。它链接到它们的拥有者。
