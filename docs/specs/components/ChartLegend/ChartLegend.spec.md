---
schema_version: 3
template_version: 5
kind: component
id: component:ChartLegend
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/ChartLegend.test.tsx,
    apps/storybook/stories/charts/Legend.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-029]
---

# ChartLegend component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 不改变 API 形态或默认值。本草案记录当前条目、逻辑放置、对齐、列表语义与空输出表面。                                                                    |
| 行为          | 非空条目按顺序渲染为具名列表；top/bottom 使用可换行的行布局，start/end 使用列布局，对齐保持逻辑性，省略或空条目不渲染任何内容。                        |
| 终端用户影响  | 图表读者获得可见的系列名称，并配以装饰性的标记形状色键；本次审计不改变任何渲染行为。                                                                   |
| 构建者影响    | 现有调用点仍然有效，并获得针对已发布 props、默认值、组合方式与无障碍边界的直接 CLI 文档。                                                              |
| 兼容性/就绪度 | 该包仍仅限 canary。本观察性草案不具权威性；依靠调用方任意颜色区分系列的问题仍未解决。                                                                  |
| 审查检查项    | 拒绝以下情况：公共形态/默认值被改变、列表语义或本地化丢失、条目顺序改变、方向错误，或新增“仅靠颜色即足够”的主张。                                      |
| 治理规则      | `spec:AST-029/FR3–FR7`、`architecture:component-test-sufficiency/INV1–INV11`、`architecture:component-theming-surface/INV1–INV6` 以及 `spec:AST-002`。 |

本表是审查投影；以下正文才具权威性。

## Intent

ChartLegend 呈现图表系列的可见图例键。它拥有有序图例列表、条目布局、标记形状的装饰性色块、系列标签以及空渲染。父级 Chart 可以派生其条目，并将生成的图例放置在绘图区周围；调用方也可以直接渲染该组件。

## Compatibility and migration

- 已发布默认值保持不变：在 canary 表面为是；该包尚无稳定发布。
- 兼容性类别：不改变公共 API、默认值或渲染行为。
- 受控/非受控行为：不适用。
- 迁移决策：无；本草案不授权更改公共 API。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**拥有**

- 按调用方顺序渲染非空图例条目。
- 根据逻辑放置选择水平或垂直布局。
- 沿相关逻辑轴对齐条目集合。
- 将每个可见系列标签与装饰性色块形状及调用方颜色配对。
- 本地化并暴露图例列表名称。

**不拥有 / 非目标**

- 系列派生、调色板分配、绘图区放置或图表渲染顺序——由 `component:Chart` 及其系列工具拥有。
- 图表的无障碍名称、数据替代表示或产品摘要——由 `component:Chart` 与产品调用点拥有。
- 自定义图例交互、选择、筛选或可见性控制。
- 保证仅凭调用方提供的任意颜色即可区分每个系列。

## Public concepts

| 概念     | 封闭取值或状态                     | 含义                                           | 按变体/方向/状态的可获得性 | 默认值   | 所有者                  | 稳定性       | 无效值行为                         |
| -------- | ---------------------------------- | ---------------------------------------------- | -------------------------- | -------- | ----------------------- | ------------ | ---------------------------------- |
| 图例条目 | 有序数组或空                       | 提供每个条目的标签、颜色与可选标记类型。       | 每个 ChartLegend           | `[]`     | `component:ChartLegend` | experimental | 省略与空数组不渲染任何内容。       |
| 逻辑位置 | `top`、`bottom`、`start`、`end`    | 给出 Chart 的放置意图，并选择行或列方向。      | 非空                       | `bottom` | `component:ChartLegend` | experimental | 由导出的 TypeScript 联合类型封闭。 |
| 对齐     | `start`、`center`、`end`           | 在行内分配水平行，或在垂直列表内水平对齐条目。 | 非空                       | `start`  | `component:ChartLegend` | experimental | 由导出的 TypeScript 联合类型封闭。 |
| 色块形状 | `bar` 为方形；其他所有类型为线条   | 在视觉上呼应条目的标记类别，但不增加 AT 内容。 | 每个渲染的条目             | line     | `component:ChartSwatch` | experimental | 未知与省略的类型使用线条形状。     |
| 列表语义 | 本地化列表，每个条目对应一个列表项 | 将可见标签归组为一个具名图例。                 | 非空                       | 内置     | `component:ChartLegend` | experimental | 不适用。                           |

## Behavioral and layout contract

草案需求会标明其依据，以免把观察到的代码误认为有意决策。

| ID  | 候选不变式                                                                                                                     | 依据                             | 草案审查状态 |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ------------ |
| FR1 | 当 `items` 被省略或为空时，ChartLegend 必须不渲染任何内容；否则必须保留条目顺序与重复标签。                                    | 实现与聚焦测试                   | verify       |
| FR2 | 每个渲染的条目必须在列表项内保持为一个可见标签加一个对辅助技术隐藏的 ChartSwatch。                                             | 实现、聚焦测试与浏览器无障碍运行 | verify       |
| FR3 | 根元素必须保持为本地化具名列表，每个提供的条目恰好对应一个列表项。                                                             | 实现、区域目录、聚焦测试与 axe   | verify       |
| FR4 | `top` 与 `bottom` 必须使用可换行的水平行；`start` 与 `end` 必须使用垂直列。                                                    | 实现与留凭浏览器矩阵             | verify       |
| FR5 | 对齐必须保持逻辑性：对 `top` 与 `bottom`，它沿行内轴分配该行；对 `start` 与 `end`，它在垂直列表内水平对齐条目，包括在 RTL 下。 | 实现与留凭的 LTR/RTL 浏览器证据  | verify       |
| FR6 | 色块形状对 `bar` 必须为方形，对其他或省略的类型必须为短线；调用方颜色提供其涂色。                                              | ChartSwatch 实现与聚焦测试       | verify       |
| FR7 | 长标签必须在 320 CSS 像素下换行且不产生水平视口溢出；当前未暴露固定宽度截断契约。                                              | 留凭的浏览器证据                 | verify       |

### Allowed variation

- **AV1 — 可用空间。** 当容器宽度收窄时，水平条目换行到额外行；垂直条目标签可以在可用行内尺寸内换行。
- **AV2 — 系列涂色。** 色块颜色由调用方拥有，可随图表调色板与渲染表面变化，但受下方未解决的区分要求约束。

### Representative states

| 状态           | 必需不变式                                | 允许变化                               |
| -------------- | ----------------------------------------- | -------------------------------------- |
| 省略 / 空条目  | 不渲染图例 DOM。                          | 周围的 Chart 布局可以省略其图例槽位。  |
| 底部或顶部     | 条目构成可换行的水平列表。                | 逻辑对齐与换行取决于可用宽度。         |
| 起始或末端     | 条目构成垂直列表。                        | 对齐会改变每个条目在列表内的水平位置。 |
| 重复标签       | 每个提供的条目都仍然存在且保持顺序。      | 内部 React key 可以区分相同标签。      |
| 长而狭窄的标签 | 标签换行，页面不出现水平溢出。            | 条目与列表高度随内容增长。             |
| RTL            | 逻辑 start/end 行为遵循计算出的文档方向。 | 视觉条目顺序遵循 flex 与方向模型。     |

### Transformation and precedence order

- **ORD1 — 渲染。** 默认省略的 props → 条目为零时返回空 → 由逻辑位置派生方向 → 按调用方顺序映射条目 → 对列表根应用逻辑对齐。
- **ORD2 — 条目。** 将标记类型映射为色块形状 → 用调用方颜色涂装色块 → 将调用方标签渲染为支持性文本。

### Performance and resources

- **PR1 — 派生输出。** ChartLegend 保持渲染派生。它不拥有任何状态、Effect、监听器、观察器、计时器、请求或持久资源。

## Accessibility contract

- **AR1 — 具名结构。** 非空图例暴露一个本地化具名列表，并为每个可见系列标签提供一个列表项。
- **AR2 — 装饰性色块。** 系列色块对辅助技术保持隐藏；相邻的可见文本提供每个条目的名称。
- **AR3 — 图表级替代。** 图例补充而非替代父级 Chart 的无障碍名称与等效数据表示。
- **AR4 — 组合关联证据。** 独立的 ChartLegend 证据无法确定读者如何将图例条目与渲染出的图表标记关联。在决定是否需要额外视觉提示或由哪一层拥有它之前，应在组合的 Chart 或产品调用点中评估同标记形状的系列。

## Design relationships

| 结构或状态 | 设计要求                             | 表示权威                     | 层级角色 | 组件契约          |
| ---------- | ------------------------------------ | ---------------------------- | -------- | ----------------- |
| 图例列表   | 归组相关系列条目，且不增加交互状态。 | 未定；未链接任何当前设计记录 | 支持性   | FR1, FR3–FR5      |
| 图例条目   | 保持每个标签与一个系列键相关联。     | 未定；未链接任何当前设计记录 | 支持性   | FR1–FR3           |
| 系列色块   | 呼应图表标记，同时对 AT 保持装饰性。 | 未定；调用方颜色是当前行为   | 支持性   | FR2, FR6, AR2–AR4 |
| 系列标签   | 以可读的支持性文本命名该系列。       | 委托给 Text                  | 支持性   | FR2, AR1–AR2      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Legend list": {
    "delegatesTo": {"owner": "component:Stack", "target": "stack"}
  },
  "Legend entry": {
    "delegatesTo": {"owner": "component:Stack", "target": "stack"}
  },
  "Series swatch": {
    "none": {
      "reason": "unsettled: ChartSwatch owns the visible painter but exposes no current public target; this draft does not decide future reachability."
    }
  },
  "Series label": {
    "delegatesTo": {"owner": "component:Text", "target": "text"}
  }
}
```

ChartLegend 将列表与条目布局委托给 Stack 的既有目标，并将系列标签委托给 Text。ChartSwatch 是可见的色块绘制者，但当前未暴露公共主题目标。该结构是否应变为可达，仍由 ChartSwatch 与主题所有者决定。

## Family and system relationships

- 当前没有 family 或设计记录管辖 ChartLegend。
- `architecture:component-test-sufficiency` 拥有合理的公共状态划分、可观察断言与审计证据质量。
- `architecture:component-theming-surface` 拥有结构到目标的处置；由主题化原语组合并不会将 ChartLegend 纳入公共组件主题化。
- `spec:AST-002` 拥有公共 API 准入，并阻止本次审计新增或重新解释公共选择。
- `spec:AST-029` 拥有本次观察性回填、封闭证据留凭、安全补救与失败即关闭的资格报告。

## Verification map

| 契约         | 验证                                           | 代表性状态                           | 变更或失败预期                                                 | 审计章节                                   |
| ------------ | ---------------------------------------------- | ------------------------------------ | -------------------------------------------------------------- | ------------------------------------------ |
| FR1–FR3      | `ChartLegend.test.tsx`；聚焦 axe 运行          | 省略、空、非空、本地化、重复         | 空输出离开 DOM、某个条目消失，或列表语义/名称丢失。            | `audit:ChartLegend/accessibility-behavior` |
| FR4–FR5, FR7 | 留凭的 Storybook 浏览器矩阵；RTL 几何留凭      | 行、列、所有对齐、320px 长文本、RTL  | 方向、逻辑对齐、换行或视口包含关系发生变化。                   | `audit:ChartLegend/layout-responsive-rtl`  |
| FR6          | `ChartLegend.test.tsx`；`ChartSwatch.test.tsx` | bar、line、省略与未知类型            | bar 失去其方形、其他类型获得方形，或色块涂色不再遵循颜色。     | `audit:ChartLegend/behavior-design`        |
| AR1–AR3      | 角色/名称 DOM 断言；聚焦 axe 运行；Chart 测试  | 独立与 Chart 组合的图例              | 标签离开具名列表，或图例替代了 Chart 替代表示。                | `audit:ChartLegend/accessibility`          |
| AR4          | 未来的组合 Chart/调用点浏览器证据              | 至少两个同标记形状的系列及其渲染标记 | 在记录缺陷或指派所有者之前，关联证据必须覆盖图例与绘制的标记。 | `audit:ChartLegend/unscored-evidence-gap`  |

## Decision log

无。本草案仅记录观察到的行为与证据缺口。

## Open questions

- **OQ1 — 组合系列关联。** 在组合的 Chart 或产品调用点中，包含两个及以上同标记形状系列的证据是否表明读者需要额外的视觉关联提示？若是，由哪一层拥有它：ChartLegend、父级 Chart/系列定义，还是产品调用点？（`human-design`）
- **OQ2 — 色块主题可达性。** 系列色块是否应成为公共 ChartSwatch 主题目标，还是其涂色应继续由调用方拥有？（`human-api`）

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或共享系统规则。它链接到它们的拥有者。
