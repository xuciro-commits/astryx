---
schema_version: 3
template_version: 5
kind: component
id: component:ChartGrid
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/ChartGrid.test.tsx,
    apps/storybook/stories/charts/ChartGrid.stories.tsx,
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

# ChartGrid component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Public contract         | 不改变 API 形状或默认值。本草案记录当前的水平、垂直以及连续刻度密度表面。                                                                              |
| Behavior                | 水平参考线跟随连续的 y 刻度，但排除零；垂直参考线跟随分类 x 带中心或连续的 x 刻度；两个方向仍各自独立可选。                                            |
| End-user impact         | 图表读者获得的参考线与父级 Chart 的绘图刻度对齐；本次审查不改变任何渲染行为。                                                                          |
| Builder impact          | 现有调用点仍然有效，并直接获得 CLI 文档以及针对当前密度回退的聚焦证据。                                                                                |
| Compatibility/readiness | 该包仍仅限 canary。本观察性草案不具权威性，确切的渲染/无障碍证据仍有待补齐。                                                                           |
| Review checks           | 若改变公共形状/默认值、参考线使用 Chart 上下文之外的刻度、零基线被绘制两次，或分类参考线不再居中于其带，则应否决。                                     |
| Governing rules         | `spec:AST-029/FR3–FR7`、`architecture:component-test-sufficiency/INV1–INV11`、`architecture:component-theming-surface/INV1–INV6` 以及 `spec:AST-002`。 |

本表是审查投影；下文正文具有权威性。

## Intent

ChartGrid 在 Chart 内渲染被动的笛卡尔参考线。它负责基于 Chart 提供的刻度与绘图尺寸进行线条选择与定位，而 Chart 负责坐标系、渲染顺序以及图表级替代内容。

## Compatibility and migration

- 已发布默认值是否保留：在 canary 表面上为是；该包没有稳定版本。
- 兼容性类别：不改变公共 API、默认值或渲染行为。
- 受控/非受控行为：不适用。
- 迁移决策：无；本草案不授权变更公共 API。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- 从 Chart 提供的刻度中选择水平与垂直参考线取值。
- 将每条参考线定位到当前绘图宽度或高度范围。
- 省略配对轴可能强调的水平零参考线。
- 在传给 d3 之前净化连续刻度的刻度请求。

**不负责 / 非目标**

- 数据、域、刻度构建、绘图尺寸或绘制顺序——由 `component:Chart` 拥有。
- 轴标签、刻度标记或绘图边缘线——由 `component:ChartAxis` 拥有。
- 图表的无障碍名称、描述或数据替代内容——由 `component:Chart` 与产品调用点拥有。
- 关于是否需要参考线的产品特定决策。

## Public concepts

| 概念         | 封闭取值或状态              | 含义                                  | 按变体/方向/状态划分的可用性 | 默认值 | 所有者                | 稳定性 | 无效值行为                                                |
| ------------ | --------------------------- | ------------------------------------- | ---------------------------- | ------ | --------------------- | ------ | --------------------------------------------------------- |
| 水平参考线   | 显示、隐藏                  | 在连续的 y 刻度处绘制线条，但排除零。 | 每个 ChartGrid               | 显示   | `component:ChartGrid` | 实验性 | 不适用。                                                  |
| 垂直参考线   | 显示、隐藏                  | 在 x 刻度或分类 x 带中心处绘制线条。  | 每个 ChartGrid               | 隐藏   | `component:ChartGrid` | 实验性 | 不适用。                                                  |
| 连续密度     | 有限非负数                  | 向 d3 连续刻度请求近似的线条数量。    | 水平参考线与连续 x 参考线    | `5`    | `component:ChartGrid` | 实验性 | 小数向下取整；大于 1000 的值封顶；负数/非有限值回退为 5。 |
| 分类密度     | 每个分类 x 带中心一条参考线 | 保持垂直参考线与每个带对齐。          | 带垂直参考线的分类 x         | 所有带 | `component:ChartGrid` | 实验性 | `tickCount` 当前无效果。                                  |
| Chart 上下文 | 位于父级 `Chart` 内         | 提供刻度与当前绘图尺寸。              | 始终                         | 无     | `component:Chart`     | 实验性 | 在 Chart 之外渲染会抛出共享的上下文错误。                 |

## Behavioral and layout contract

草案需求标明其依据，以免把观察到的代码误认为有意做出的决策。

| ID  | 候选不变式                                                                               | 依据                          | 草案审查状态 |
| --- | ---------------------------------------------------------------------------------------- | ----------------------------- | ------------ |
| FR1 | ChartGrid 必须从其父级 Chart 上下文消费当前宽度、高度、x 刻度与 y 刻度。                 | 实现、包组合与聚焦测试        | verify       |
| FR2 | `horizontal` 与 `vertical` 必须各自独立启用其参考线集合；同时启用两者必须渲染两套集合。  | 实现、JSDoc、测试与 Storybook | verify       |
| FR3 | 水平参考线必须使用连续的 y 刻度、跨越绘图宽度，并省略 y=0，以免配对轴收到重复的线条。    | 实现、JSDoc 与聚焦测试        | verify       |
| FR4 | 垂直参考线必须对带 x 刻度使用分类带中心、对连续 x 刻度使用 d3 刻度位置，并跨越绘图高度。 | 实现与聚焦测试                | verify       |
| FR5 | 连续刻度请求必须是有限、非负且不大于 1000 的整数；零不产生连续参考线，无效值使用 5。     | 实现、防止崩溃的理由与测试    | verify       |
| FR6 | 参考线的绘制必须消费语义主题令牌。网格线是否成为公共主题目标仍未确定。                   | 实现与当前主题架构            | verify       |

### Allowed variation

- **AV1 — 连续刻度数量。** d3 可能选择一组邻近取值，而不是恰好等于请求的数量。
- **AV2 — 分类取值。** 每个当前 x 带域值贡献一条居中的垂直参考线。

### Representative states

| 状态             | 必需不变式                            | 允许的变化                       |
| ---------------- | ------------------------------------- | -------------------------------- |
| 默认             | 仅水平参考线；连续密度默认为 5。      | d3 选择确切的 y 刻度集合。       |
| 水平禁用         | 无水平参考线。                        | 垂直参考线可保持启用。           |
| 垂直分类         | 在每个 x 带中心一条垂直参考线。       | 带宽与中心跟随 Chart 的 x 刻度。 |
| 垂直连续         | 在每个生成的连续 x 刻度处一条参考线。 | d3 选择确切的 x 刻度集合。       |
| 双向             | 水平与垂直集合一起渲染。              | 两者的确切数量可能不同。         |
| 连续刻度数量为零 | 连续参考线集合为空。                  | 分类垂直参考线不受影响。         |
| 刻度数量无效     | 连续参考线生成回退到默认请求。        | d3 选择由此产生的确切刻度。      |
| 窄屏 / RTL       | 参考线仍绑定物理数据坐标与绘图边界。  | 绘图宽度与数据域顺序会变化。     |

### Transformation and precedence order

- **ORD1 — 连续密度。** 校验有限性与非负性 → 小数向下取整 → 上限 1000 → 请求 d3 刻度。
- **ORD2 — 定位。** 选择已启用的方向 → 选择刻度路径 → 推导刻度或带中心位置 → 跨越当前相对的绘图维度。

### Performance and resources

- **PR1 — 派生输出。** 参考线数组仍是渲染派生并按已启用方向、刻度、尺寸与净化后的密度做记忆化。ChartGrid 不拥有任何监听器、观察器、定时器或持久资源。
- **PR2 — 有界刻度分配。** 公共密度值不能向 d3 请求超过 1000 个连续刻度。

## Accessibility contract

- **AR1 — 图表级替代内容。** ChartGrid 在 Chart 的具名图像内渲染被动的支撑性参考线。Chart 负责无障碍图表名称与受支持的数据表替代内容。
- **AR2 — 不得仅靠网格传达信息。** 网格线不替代可见标签、有意义的标记或父级 Chart 的替代内容。

## Design relationships

| 解剖结构或状态 | 设计要求                             | 呈现权威                       | 层级角色 | 组件契约         |
| -------------- | ------------------------------------ | ------------------------------ | -------- | ---------------- |
| 网格线         | 支持位置比较，但不单独承载图表含义。 | 未确定；未链接任何当前设计记录 | 支撑性   | FR2–FR6, AR1–AR2 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Grid lines": {
    "none": {
      "reason": "unsettled: ChartGrid consumes a semantic color token, but no current component or family contract decides whether grid lines are a public theme target."
    }
  }
}
```

## Family and system relationships

- 当前没有 family 或设计记录管辖 ChartGrid。
- `architecture:component-test-sufficiency` 负责合理的公共状态分区、可观察断言与审查证据质量。
- `architecture:component-theming-surface` 负责从解剖结构到目标的处置；仅消费令牌并不会让 ChartGrid 纳入公共组件主题。
- `spec:AST-002` 负责公共 API 准入，并阻止本次审查新增或重新解释公共选择。
- `spec:AST-029` 负责本次观察性回填、闭环证据回执、安全补救以及失败即关闭的资格报告。

## Verification map

| 契约     | 验证方式                                      | 代表状态                             | 变异或失败预期                                        | 审计章节                           |
| -------- | --------------------------------------------- | ------------------------------------ | ----------------------------------------------------- | ---------------------------------- |
| FR1–FR2  | `ChartGrid.test.tsx`; `ChartGrid.stories.tsx` | 默认、水平关闭、垂直开启、两者、皆无 | 某个方向不再遵守其输入，或输出逸出父级 Chart 上下文。 | `audit:ChartGrid/behavior`         |
| FR3      | `ChartGrid.test.tsx`                          | 正数与混合符号的 y 域                | 参考线不再跨越绘图，或 y=0 被绘制两次。               | `audit:ChartGrid/behavior-layout`  |
| FR4      | `ChartGrid.test.tsx`; `ChartGrid.stories.tsx` | 分类与连续 x                         | 带参考线偏离其中心，或连续刻度落在错误坐标。          | `audit:ChartGrid/behavior-layout`  |
| FR5, PR2 | 聚焦的零/无效密度测试与源码审查               | 零与无效请求；小数与封顶分区         | 无效输入导致渲染崩溃或绕过有界回退。                  | `audit:ChartGrid/behavior-testing` |
| FR6      | 严格 lint；Storybook 主题矩阵仍有待补齐       | 浅色、深色与受支持的非默认主题       | 原始颜色或组件侧的模式选择取代了语义令牌绘制。        | `audit:ChartGrid/theming-design`   |
| AR1–AR2  | Chart 无障碍测试；包级 axe 仍有待补齐         | 具名 Chart、小数据表、网格启用       | 网格内容取代或成为所需图表信息的唯一来源。            | `audit:ChartGrid/accessibility`    |

## Decision log

无。本草案仅记录观察到的行为与证据缺口。

## Open questions

- **OQ1 — 分类密度。** `tickCount` 应保持仅适用于连续刻度，还是垂直分类参考线应获得与 ChartAxis 一致的、有文档的稀疏化契约？（`human-api`）

## Content boundary

本文件不重复使用方的 props 表/示例、当前审查结果、实现步骤或共享系统规则。它链接到它们的拥有者。
