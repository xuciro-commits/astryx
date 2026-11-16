---
schema_version: 3
template_version: 4
kind: component
id: component:Chart
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/Chart.test.tsx,
    apps/storybook/stories/charts/Chart.stories.tsx,
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

# Chart component contract

## Intent

Chart 协调一个响应式笛卡尔绘图。它推导共享比例尺、分配默认系列颜色、把绘制委托给系列定义，并托管可选的图表外框与交互层。

## Compatibility and migration

- 保留的已发布默认状态：`not yet stable`；`@astryxdesign/charts` 仅为 canary 渠道。
- 兼容性类别：现有 props、默认值、渲染顺序与输出均不因这次观察性回填而改变。
- 受控/非受控行为：不适用。
- 迁移决策：无；本草案不授权变更公共 API。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**负责**

- 测量图表容器，并推导出单一绘图区域与比例尺集合。
- 对系列、图表外框与交互插槽进行排序、裁剪与协调。
- 图表图像的可访问名称与小数据表回退方案。

**不负责 / 非目标**

- 与标记相关的几何或渲染；这些细节由各系列定义负责。
- 坐标轴、网格、图例或 tooltip 的表现，除其在根节点中的放置位置之外。
- 对所提供数据的产品级解读、汇总或分析。

## Public concepts

| 概念        | 封闭取值或状态                             | 含义                                                                   | 按变体/方向/状态划分的可用性                            | 默认值                                       | 所有者            | 稳定性 | 无效值行为                                                            |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------- | ----------------- | ------ | --------------------------------------------------------------------- |
| 数据模型    | `data`、`xKey`、`series`                   | 单个绘图的数据行、共享 x 字段与标记定义。                              | 始终必需。                                              | 无                                           | `component:Chart` | 实验性 | 缺失字段由 TypeScript 拒绝；格式错误的行值由各标记处理。              |
| 高度        | 有限数值                                   | 外部 SVG 高度，单位为 CSS 像素。                                       | 所有图表。                                              | `300`                                        | `component:Chart` | 实验性 | 负值或非有限值解析为 `0`。                                            |
| 绘图边距    | 部分 `top`、`right`、`bottom`、`left` 数值 | 内缩共享绘图区域。                                                     | 所有图表。                                              | `{top: 24, right: 24, bottom: 32, left: 48}` | `component:Chart` | 实验性 | 结果几何为非有限值时被钳制为 `0`；物理字段名仍是一处未决的 API 问题。 |
| Y 基线      | `auto`、`zero`、`data`                     | 选择标记感知的零线/留白、对称零线，或紧凑的数据范围。                  | 当 `yDomain` 缺省时使用。                               | `auto`                                       | `component:Chart` | 实验性 | 未知值由 TypeScript 拒绝。                                            |
| 显式域      | `xDomain`、`yDomain` 有限数值对            | 固定数值比例尺域。                                                     | 分类 x 下忽略 `xDomain`；`yDomain` 覆盖基线与取整美化。 | 缺省                                         | `component:Chart` | 实验性 | 非有限数值对回退到自动推导。                                          |
| 图表外框    | `grid`、`axes`、`legend`、`tooltip`        | 在系列周围放置调用方提供或内置的图表上下文使用方。                     | 可选。                                                  | 关闭/缺省                                    | `component:Chart` | 实验性 | 布尔或配置值为 false/缺省时停用该内置界面。                           |
| 扩展插槽    | `interactions`、`children`                 | 按既定绘制顺序添加交互覆盖层与高级 SVG 内容。                          | 可选。                                                  | 缺省                                         | `component:Chart` | 实验性 | 调用方内容按所提供的方式渲染。                                        |
| 可访问文本  | `title`、`subtitle`、生成的回退            | 命名并描述图表图像。                                                   | 所有图表；提供时可见。                                  | 本地化生成的名称                             | `component:Chart` | 实验性 | 无主系列时使用通用的本地化名称。                                      |
| 根 DOM 表面 | `BaseProps<HTMLDivElement>`、`ref`         | 转发标准 DOM、data、ARIA、class、style、StyleX、事件以及根元素的 ref。 | 所有图表。                                              | 缺省                                         | `component:Chart` | 实验性 | 组件自有的 SVG 语义保留在 SVG 上。                                    |

## Behavioral and layout contract

草案需求标明各自的依据，以免把观察到的代码误当成有意做出的决策。

| ID  | 候选不变式                                                                                                                        | 依据                                     | 草案审查状态 |
| --- | --------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ------------ |
| FR1 | Chart 在宽度为零时必须保留其配置的高度，并在容器尺寸变化后重新计算绘图几何。                                                      | 当前实现与 `Chart measurement gate` 测试 | verify       |
| FR2 | 所有系列、坐标轴、网格线、tooltip 与交互都必须使用同一套共享比例尺，该比例尺由当前数据、域、基线与实测绘图尺寸推导而来。          | README、实现与包测试                     | verify       |
| FR3 | 绘制顺序必须保持为网格 → 裁剪后的系列 → 坐标轴 → 指针层 → 交互 → 内置 tooltip → children。                                        | 当前实现与渲染委托测试                   | verify       |
| FR4 | 无静态颜色的主系列必须从当前主题调色板获得确定性颜色；工具类标记不得占用调色板或图例位置。                                        | 实现、调色板测试与浏览器证据             | verify       |
| FR5 | 指针移动必须归一化为绘图坐标，并派发最近的 x 位置；离开绘图区域时必须清除指针状态。                                               | 当前实现与 tooltip 浏览器证据            | verify       |
| FR6 | `legend=true` 必须从主系列推导条目；legend 与 tooltip 配置对象必须启用各自的界面，同时覆盖受支持的选项。                          | 当前实现与聚焦测试                       | verify       |
| FR7 | 图表必须暴露带名称的 `role="img"`；提供的 subtitle 必须作为其描述；最多 100 个行×系列单元格的数据集还必须镜像到视觉隐藏的表格中。 | 当前实现、WCAG 1.1.1 与可访问性测试      | verify       |
| FR8 | 根 DOM props 与 `ref` 必须到达根容器，同时 Chart 自身 SVG 的名称与描述保持权威。                                                  | 共享 BaseProps 约定与聚焦回归测试        | verify       |

### Allowed variation

- **AV1 — 系列输出。** 标记定义可以渲染不同的 SVG 或 canvas 内容，同时保留共享布局与渲染顺序接缝。
- **AV2 — 使用方外框。** 网格、坐标轴、交互与 children 插槽可以缺省，也可以包含任何有效的图表上下文使用方。

### Representative states

| 状态              | 必需不变式                                       | 允许变化                                |
| ----------------- | ------------------------------------------------ | --------------------------------------- |
| 宽度未测量        | 仅保留高度的根节点；无无效 SVG 几何。            | 使用方根节点样式与 DOM props 仍被应用。 |
| 正常数据          | 共享的有限比例尺，每个已解析系列对应一个裁剪组。 | 标记形状、颜色与内容来自系列定义。      |
| 空数据            | 有限的回退比例尺；无无效标记几何。               | 可见的空状态处理仍未定。                |
| 小数据            | 具名图像加隐藏数据表。                           | 单元格文本遵循所提供的行值。            |
| 超过 100 个单元格 | 具名图像；省略内置隐藏表格。                     | 等效的大数据替代方案仍未定。            |
| 标题与副标题      | 可见页头；SVG title/description 关联。           | 使用方文本内容。                        |
| 启用图例          | 在顶部、底部、起始或结束位置放置推导或显式条目。 | 对齐方式与所提供的条目。                |
| 启用 tooltip      | 指针更新指示器与分组 tooltip；离开时清除。       | 自定义渲染器与放置位置。                |
| 窄屏 / RTL        | 无水平页面溢出；逻辑堆叠位置遵循书写方向。       | 物理图表域顺序仍归数据所有。            |

### Transformation and precedence order

- **ORD1 — 尺寸。** 合并默认与所提供的边距 → 钳制高度与内部尺寸 → 推导比例尺 → 解析系列 → 按 FR3 顺序渲染。
- **ORD2 — 域。** 有限的显式域优先；否则推导有限的数据范围 → 扩展退化范围 → 应用所请求的基线/留白 → 仅对自动域应用取整美化。
- **ORD3 — 可访问名称。** 提供的 title 优先；否则按提供方的 locale 格式化主系列标签，并与 `xKey` 进行插值；无主系列时使用本地化的通用名称。

### Performance and resources

- **PR1 — 尺寸变化观察。** 每个已挂载的图表用专用的 `ResizeObserver` 观察其根节点，并在卸载时断开；迁移到共享观察器仍是一项审计 FIX。
- **PR2 — 指针派发。** 指针移动直接更新订阅者；仅当最近的数据索引变化时，tooltip 的 React 状态才改变。

## Accessibility contract

- **AR1 — 具名图像。** SVG 必须暴露带已解析可访问名称的 `role="img"`。
- **AR2 — 描述。** 提供的 subtitle 必须通过 `aria-describedby` 链接到 SVG 的 `desc`。
- **AR3 — 小数据替代方案。** 最多 100 个行×主系列单元格必须镜像到带语义表头的视觉隐藏表格中。
- **AR4 — 大数据缺口。** 超过表格阈值后，当前仅提供名称的路径不能保证等效的替代方案；解决该问题需要所有者审查，且它仍是一项审计发现。
- **AR5 — Tooltip 补充。** 指针 tooltip 内容不得成为必需图表信息的唯一可用来源。

## Design relationships

| 解剖结构或状态 | 设计要求                           | 呈现权威                         | 层级角色 | 组件契约      |
| -------------- | ---------------------------------- | -------------------------------- | -------- | ------------- |
| 页头           | 核心 Text 角色                     | 委托给 `component:Text`          | 辅助     | FR7           |
| 绘图与标记     | 有意义的图形满足渲染后的对比度要求 | 客观的 WCAG 阈值；标记呈现仍未定 | 主要     | FR2、FR4      |
| 图例           | 标签与色块保持系列关联             | 委托给 `component:ChartLegend`   | 辅助     | FR6           |
| Tooltip        | 时序覆盖层                         | 当前 Design Conventions          | 辅助     | FR5、FR6、AR5 |
| 隐藏表格       | 非视觉数据替代方案                 | 客观的可访问性语义               | 辅助     | AR3、AR4      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Header": {
    "none": {
      "reason": "intentional: Text owns the visible title and subtitle styling."
    }
  },
  "Plot": {
    "none": {
      "reason": "unsettled: Chart does not currently expose a public theme target for the SVG plot root."
    }
  },
  "Grid and axes": {
    "none": {
      "reason": "unsettled: ChartGrid and ChartAxis own their output but do not yet have current component contracts."
    }
  },
  "Legend": {
    "none": {
      "reason": "unsettled: ChartLegend owns the visible legend but does not yet have a current component contract."
    }
  },
  "Tooltip and interactions": {
    "none": {
      "reason": "unsettled: ChartTooltip and consumer interaction layers own their painting surfaces."
    }
  },
  "Data table": {
    "none": {
      "reason": "intentional: The small-data table is visually hidden accessibility content."
    }
  }
}
```

## Family and system relationships

- `architecture:component-test-sufficiency` 负责证据质量与合理状态划分。
- `architecture:component-theming-surface` 负责解剖结构到主题的可达性。
- `spec:AST-002` 负责公共 API 准入与操作形态。
- `spec:AST-029` 负责观察性审计回填与外部证据回执。

## Verification map

| 契约               | 验证方式                                    | 代表状态                                           | 变异或失败预期                                                          | 审计章节                             |
| ------------------ | ------------------------------------------- | -------------------------------------------------- | ----------------------------------------------------------------------- | ------------------------------------ |
| FR1、PR1           | `Chart.test.tsx`；Chromium 窄屏截图         | 零宽度与正宽度；尺寸变化；320 px                   | 移除测量或清理逻辑会留下空白/陈旧的绘图，或泄漏的观察器。               | `audit:Chart/responsive-code-health` |
| FR2–FR4、ORD1–ORD2 | 图表与包测试；明/暗浏览器矩阵               | 带状与线性 x；自动/显式域；分组/堆叠/工具类标记    | 比例尺发生偏离、几何变为非有限值、裁剪/顺序改变，或调色板归属发生漂移。 | `audit:Chart/behavior-theming`       |
| FR5–FR6、PR2       | tooltip/图例测试；Chromium 悬停与布局截图   | 悬停/离开；推导/配置图例；所有放置位置             | Tooltip 状态变陈旧、指针处理导致每次移动都提交，或外框渲染在错误的层。  | `audit:Chart/behavior`               |
| FR7、AR1–AR5、ORD3 | 可访问名称/表格测试；包专属 axe；浏览器回执 | title/subtitle；生成的名称；小数据、空数据与大数据 | 名称/描述消失、小数据表丢失、本地化回退，或大数据缺口被掩盖。           | `audit:Chart/accessibility-i18n`     |
| FR8                | 根 props/ref 回归测试与包类型检查           | 占位与已测量渲染                                   | DOM props 或 ref 不再到达根节点，或使用方样式替换了组件样式。           | `audit:Chart/public-api`             |

## Decision log

无。本草案仅记录观察到的行为与未决缺口。

## Open questions

- **OQ1 — 大数据替代方案。** 在 100 个单元格的表格阈值之后，Chart 必须保证何种等效的非视觉数据或汇总契约？（`human-api`）
- **OQ2 — 方向性边距。** 实验性的物理 `left`/`right` 边距字段是否应在稳定版本发布前迁移到逻辑名称？（`human-api`）
- **OQ3 — 系列元数据。** 在 canary API 稳定之前，每图表标识、堆叠状态与已解析颜色应如何移入私有边界之后？（`human-api`）
- **OQ4 — 主题根。** Chart 应为其绘图/根表面暴露公共目标，还是有意只保留 token 方式？（`human-design`）

## Content boundary

本文件不复述使用方 props 表/示例、当前审计结果、实现步骤或共享系统规则。它链接到各自的所有者。
