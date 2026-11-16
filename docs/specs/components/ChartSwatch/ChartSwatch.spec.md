---
schema_version: 3
template_version: 5
kind: component
id: component:ChartSwatch
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/ChartSwatch.test.tsx,
    apps/storybook/stories/charts/Swatch.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-test-sufficiency,
    architecture:component-theming-surface,
    architecture:knowledge-contracts,
  ]
contributing: []
system_specs: [spec:AST-002, spec:AST-029]
---

# ChartSwatch component contract

## Contract at a glance

| 方面          | 契约                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约      | 不改动 API 形态或默认值。本草案记录当前调用方自有的颜色、方形/线形，以及导出的系列类型映射工具。                                                             |
| 行为          | 省略 `variant` 时渲染方形；显式指定 `line` 时渲染短线条；`swatchVariantForType` 将 `bar` 映射为方形，将其他所有类型或省略的类型映射为线形。                  |
| 最终用户影响  | 图表读者在可见的系列标签旁仍看到相同的装饰性标记形状色块；本次审计不改变任何渲染行为。                                                                       |
| 构建者影响    | 既有调用点保持有效，并获得针对已发布 props、默认值、组合方式与无障碍边界的消费方文档。                                                                       |
| 兼容性/就绪度 | 该包仍仅以 canary 形式发布。本观察性草案不具权威性；公共工具名称与未来的主题可达性仍是由所有者决定、尚未解决的选择。                                         |
| 审查检查      | 拒绝以下情形：默认值或类型映射被改动、装饰性语义丢失、把几何漂移当作策略呈现，或声称仅凭颜色即可始终识别系列。                                               |
| 治理规则      | `spec:AST-029/FR3–FR7`、`architecture:component-test-sufficiency/INV1–INV11`、`architecture:component-theming-surface/INV1–INV11` 以及 `spec:AST-002/FR17`。 |

本表是审查投影；以下正文具有权威性。

## Intent

ChartSwatch 绘制一个紧凑的装饰性色块，在视觉上把系列标签与其图表标记联系起来。它拥有方形与线形两种形状，以及当前从系列类型到这些形状的映射。可见的系列名称及周围的关系由图例、工具提示、图表或产品调用点负责。

## Compatibility and migration

- 已发布默认值是否保留：在 canary 层面是；该包没有稳定版本。
- 兼容性类别：不改动公共 API、默认值或渲染行为。
- 受控/非受控行为：不适用。
- 迁移决策：无；本草案不授权重命名或移除公共工具。

消费方迁移说明归属消费方文档与发布说明。

## Ownership boundary

**负责**

- 将一种调用方自有颜色绘制为紧凑的方形或线形。
- 让色块对辅助技术保持装饰性。
- 将 `bar` 系列类型映射为方形，将其他所有类型或省略的类型映射为线形。

**不负责/非目标**

- 选择、校验或调整图表调色板——由图表与产品调用点负责。
- 命名系列或提供可访问的图表替代方案——由图例、工具提示、Chart 或产品调用点负责。
- 确立仅凭颜色即可在绘制的图表及其外围部件中区分系列。
- 交互、选择、过滤、可见性或工具提示行为。

## Public concepts

| 概念         | 封闭取值或状态              | 含义                                 | 按变体/方向/状态的可用性 | 默认值   | 所有者                  | 稳定性 | 无效值行为                              |
| ------------ | --------------------------- | ------------------------------------ | ------------------------ | -------- | ----------------------- | ------ | --------------------------------------- |
| 系列颜色     | 调用方自有的 CSS 颜色字符串 | 绘制装饰性标记。                     | 每个 ChartSwatch         | 必需     | 产品调用点              | 实验性 | 无效的 CSS 颜色语法可能使色块没有绘制。 |
| 色块形状     | `square`、`line`            | 在视觉上呼应条形或非条形图表标记。   | 每个 ChartSwatch         | `square` | `component:ChartSwatch` | 实验性 | 由导出的 TypeScript 联合类型封闭。      |
| 系列类型映射 | `bar`；其他任意字符串；省略 | 将系列类型转换为组件支持的两种形状。 | 导出的工具               | line     | `component:ChartSwatch` | 实验性 | 未知与省略的类型使用线形。              |
| AT 参与      | 装饰性、对辅助技术隐藏      | 让周围可见文本负责表意。             | 每个 ChartSwatch         | 内置     | `component:ChartSwatch` | 实验性 | 不可配置。                              |

## Behavioral and layout contract

草案需求标明各自的依据，以免把观察到的代码误认为有意的决策。

| ID  | 候选不变式                                                                                          | 依据                              | 草案审查状态 |
| --- | --------------------------------------------------------------------------------------------------- | --------------------------------- | ------------ |
| FR1 | ChartSwatch 必须渲染一个装饰性元素，并且在省略 `variant` 时必须使用 `square`。                      | 实现、聚焦测试与浏览器传感器      | verify       |
| FR2 | 方形当前必须渲染为 8 × 8 的标记，圆角 2、内联边距 1；线形当前必须渲染为 10 × 3 的标记，圆角 1.5。   | 实现与已回执的浏览器矩阵          | verify       |
| FR3 | 渲染出的绘制必须遵循调用方提供的 `color`，不得选择或调整调色板。                                    | 实现、聚焦测试与浏览器传感器      | verify       |
| FR4 | 色块必须对辅助技术保持隐藏；周围内容必须提供可见且可访问的系列含义。                                | 实现、聚焦测试、聚焦 axe 与浏览器 | verify       |
| FR5 | `swatchVariantForType` 必须仅对 `bar` 返回 `square`，并对其他任意字符串与 `undefined` 返回 `line`。 | 实现与聚焦测试                    | verify       |
| FR6 | 浅色、深色、窄屏与粗指针媒体条件不得改变组件自有的形状契约，也不得引入水平视口溢出。                | 已回执的浏览器矩阵                | verify       |

### Allowed variation

- **AV1 — 系列绘制。** 任意有效的调用方自有 CSS 颜色均可绘制两种形状。
- **AV2 — 周围布局。** 图例、工具提示或自定义调用点可将色块放置在任意位置，只要保持其与可见系列标签的关联。

### Representative states

| 状态              | 必需不变式                     | 允许的变化                                |
| ----------------- | ------------------------------ | ----------------------------------------- |
| 省略 / 方形       | 方形几何与装饰性语义保持不变。 | 调用方颜色与周围放置可以变化。            |
| 线形              | 线形几何与装饰性语义保持不变。 | 调用方颜色与周围放置可以变化。            |
| `bar` 映射        | 工具返回 `square`。            | 源系列定义可以携带其他字段。              |
| 非 bar / 省略映射 | 工具返回 `line`。              | 未知与未来的非 bar 类型字符串使用回退值。 |
| 浅色 / 深色       | 形状与提供的绘制保持不变。     | 周围表面遵循其当前生效的主题。            |
| 窄屏 / 粗指针     | 不新增组件自有的溢出或交互。   | 周围布局可以换行或重新定位色块。          |

### Transformation and precedence order

- **ORD1 — 渲染。** 省略时应用默认变体 → 选择方形或线形几何 → 用调用方颜色绘制 → 将结果元素对辅助技术隐藏。
- **ORD2 — 系列映射。** 将系列类型与 `bar` 比较 → 完全匹配时返回方形 → 否则返回线形。

### Performance and resources

- **PR1 — 无持久资源。** ChartSwatch 的渲染、重渲染与卸载不得创建或保留监听器、观察器、定时器、请求、订阅或其他持久浏览器资源，且不得要求消费方清理。

## Accessibility contract

- **AR1 — 装饰性标记。** ChartSwatch 对辅助技术保持隐藏，因为其周围可见的系列标签提供了含义。
- **AR2 — 有意义的上下文。** 独立调用点将色块与可见文本配对；色块不替代 Chart 的可访问名称、等效数据视图或摘要。
- **AR3 — 系列区分。** 关于同形状系列是否需要额外关联线索的证据，必须覆盖组合后的图表及其标签，而非孤立的装饰性色块。

## Design relationships

| 解剖结构或状态 | 设计要求                             | 表征权威                     | 层级角色 | 组件契约         |
| -------------- | ------------------------------------ | ---------------------------- | -------- | ---------------- |
| 系列色块       | 呼应图表标记，同时对 AT 保持装饰性。 | 未定；未链接任何当前设计记录 | 支撑     | FR1–FR6, AR1–AR3 |
| 方形形状       | 表示当前条形系列的映射。             | 观察到的实现                 | 支撑     | FR1–FR2, FR5     |
| 线形形状       | 表示当前非条形与回退系列的映射。     | 观察到的实现                 | 支撑     | FR2, FR5         |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Series swatch": {
    "none": {
      "reason": "unsettled: caller-owned color and fixed component geometry currently paint the swatch without a public theme target; this draft does not decide future reachability."
    }
  }
}
```

ChartSwatch 是可见的绘制者，但当前不暴露公共主题目标。主题是否应获得稳定目标仍是由所有者做出的决策。

## Family and system relationships

- 当前没有家族或设计记录管辖 ChartSwatch。
- `architecture:component-test-sufficiency` 负责合理的公共状态划分、可观察断言与审计证据质量。
- `architecture:component-theming-surface` 负责解剖结构到目标的处置；本草案记录当前的缺失，但不决定未来的可主题化。
- `architecture:knowledge-contracts` 将消费方语法保留在 `ChartSwatch.doc.mjs` 中，并将观察到的行为保留在本草案组件记录中。
- `spec:AST-002/FR17` 负责尚未解决的公共工具命名问题。
- `spec:AST-029` 负责本次观察性回填、封闭证据回执、安全修复与故障关闭式资格报告。

## Verification map

| 契约    | 验证                                           | 代表状态                               | 变更或失败预期                                           | 审计章节                                       |
| ------- | ---------------------------------------------- | -------------------------------------- | -------------------------------------------------------- | ---------------------------------------------- |
| FR1–FR3 | `ChartSwatch.test.tsx`；已回执的浏览器矩阵     | 省略、方形、线形、六种颜色、浅色、深色 | 默认值、几何或调用方绘制在缺少可见证据的情况下发生变化。 | `audit:ChartSwatch/behavior-design`            |
| FR4     | 聚焦 DOM 断言；聚焦 axe；浏览器传感器          | 方形、线形、浅色、深色                 | 色块进入无障碍树，或周围含义被赋予该标记。               | `audit:ChartSwatch/accessibility`              |
| FR5     | `ChartSwatch.test.tsx`                         | bar、line、dot、area、未知、省略       | bar 失去其方形，或其他类型获得方形。                     | `audit:ChartSwatch/public-utility-behavior`    |
| FR6     | 已回执的 Storybook 浏览器矩阵                  | 1280 px、320 px、粗指针、浅色、深色    | 形状改变、出现溢出，或组件获得依赖媒体条件的行为。       | `audit:ChartSwatch/responsive-rendered-design` |
| AR1–AR3 | 聚焦 axe；ChartLegend 与 ChartTooltip 组合审查 | 独立与组合使用                         | 装饰性语义丢失，或用孤立证据判定图表关联。               | `audit:ChartSwatch/accessibility-composition`  |

## Decision log

无。本草案仅记录观察到的行为与证据缺口。

## Open questions

- **OQ1 — 公共工具名称。** 系列类型映射是否应保持公开；若应，何种以动词开头的名称与兼容路径能满足 `spec:AST-002/FR17`？（`human-api`）
- **OQ2 — 色块可主题化程度。** ChartSwatch 是否应暴露公共主题目标，还是其绘制与几何仍应由调用方/组件自有？（`human-api`）
- **OQ3 — 组合系列关联。** 包含多个同形状系列的组合图表是否需要额外的关联线索，由哪一层负责？（`human-design`）

## Content boundary

本文件不重复消费方 props 表/示例、当前审计结果、实现步骤或共享系统规则。它通过链接指向其所有者。
