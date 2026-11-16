---
schema_version: 3
template_version: 5
kind: component
id: component:ChartAxis
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/charts/src/ChartAxis.test.tsx,
    apps/storybook/stories/charts/ChartAxis.stories.tsx,
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

# ChartAxis component contract

## Contract at a glance

| Area          | Contract                                                                                                                                      |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 不改变 API 形状或默认值。截断与自动横向密度现在按客观的 Unicode 文本分段标准统计完整的字素簇。                                                |
| 行为          | 选定的物理绘图边缘决定比例尺、摆放位置、标签方向与默认边缘线；显式格式化与密度输入进一步细化标签。                                            |
| 最终用户影响  | 图表读者可以看到完整的刻度标签字符，同样短的 Unicode 标签不再比 ASCII 标签被更激进地稀疏化。                                                  |
| 构建者影响    | 无。现有调用点仍然有效，并获得针对当前表面的直接 CLI 文档。                                                                                   |
| 兼容性/就绪度 | canary API 与默认值保持不变。本记录是草案性质的观察证据；渲染证据与无障碍树证据仍不完整。                                                     |
| 审查检查      | 拒绝以下情况：改变公共形状/默认值、坐标轴使用了错误的 Chart 比例尺、物理边缘摆放错误、标签被拆断字素，或线条/刻度优先级被隐藏。               |
| 治理规则      | `spec:AST-029/FR3–FR7`、`architecture:component-test-sufficiency/INV1–INV9`，以及 [Unicode 文本分段](https://www.unicode.org/reports/tr29/)。 |

本表是审查投影；下方正文具有权威性。

## Intent

ChartAxis 在 Chart 内部渲染带标签的笛卡尔 x 或 y 比例尺输出。它负责物理边缘摆放、刻度选择与格式化、可选刻度标记以及可选的轴边缘线，而 Chart 负责比例尺定义域与绘图几何。

## Compatibility and migration

- 已发布默认值是否保留：是；该包仅处于 canary 阶段，尚无稳定版本。
- 兼容性类别：无公共 API 或默认值变更；Unicode 截断与自动稀疏仅有意改变包含多码元字素的标签，具有代表性的 ASCII 行为保持不变。
- 受控/非受控行为：不适用。
- 迁移决策：无；本草案不授权变更公共 API。

使用方迁移说明应放在使用方文档与发布说明中。

## Ownership boundary

**负责**

- 为一个物理绘图边缘选择由 Chart 提供的 x 或 y 比例尺。
- 生成、格式化、稀疏化、截断、定位与隐藏刻度标签。
- 渲染其可选的边缘线与可选的向外刻度标记。
- 为刻度位置与可见性变化应用可选的过渡样式。

**不负责 / 非目标**

- 数据、定义域、比例尺构建或绘图尺寸——由 `component:Chart` 负责。
- 网格线——由 `component:ChartGrid` 负责。
- 通过 `tickFormat` 提供的产品特定单位、区域设置选择或标签措辞——由产品调用点负责。
- 独立的图表数据替代方案——由 `component:Chart` 及其周边产品内容负责。

## Public concepts

| 概念         | 封闭取值或状态                      | 含义                                               | 按变体/朝向/状态的可获得性           | 默认值                       | 所有者                | 稳定性       | 非法值行为                                             |
| ------------ | ----------------------------------- | -------------------------------------------------- | ------------------------------------ | ---------------------------- | --------------------- | ------------ | ------------------------------------------------------ |
| 物理边缘     | `top`、`right`、`bottom`、`left`    | 选择绘图边缘、比例尺轴、变换与向外的标签侧。       | 每个轴都必填。                       | 无                           | `component:ChartAxis` | experimental | 未知取值会被 TypeScript 拒绝。                         |
| 刻度目标     | 有限数值                            | 向 d3 请求一个近似的连续比例尺刻度数量。           | 连续比例尺；同时也配置自动格式化器。 | `5`                          | `component:ChartAxis` | experimental | 负值/非有限值回退为 5；小数向下取整；取值上限为 1000。 |
| 标签上限     | 数值或缺失                          | 当生成的标签集合超过所请求的上限时，均匀跳过标签。 | 每种比例尺。                         | 由可用空间自动决定           | `component:ChartAxis` | experimental | 预期正整数定义域之外的取值未作规定。                   |
| 标签格式化器 | `(value: unknown) => string` 或缺失 | 替换 band 字符串或 d3 连续比例尺格式化器。         | 每个刻度。                           | 与比例尺相适配的内置格式化器 | `component:ChartAxis` | experimental | 来自使用方格式化器的异常会向外传播。                   |
| 标签截断     | 正整数字符数或缺失                  | 保留该数量的用户感知字符，然后追加省略号。         | 每个已格式化的标签。                 | 缺失                         | `component:ChartAxis` | experimental | 零值/省略即禁用截断；其他非法值未作规定。              |
| 边缘线       | 显示或隐藏                          | 沿选定轴边缘渲染一条线。                           | 每个边缘；刻度标记会强制开启它。     | 仅对 `bottom` 显示           | `component:ChartAxis` | experimental | 不适用。                                               |
| 刻度标记     | 显示或隐藏                          | 在每个可见刻度标签旁渲染一条向外的垂直标记。       | 每个边缘。                           | 隐藏                         | `component:ChartAxis` | experimental | 不适用。                                               |
| 刻度过渡     | 动画或立即                          | 在比例尺变化期间对刻度变换与不透明度做动画。       | 生成的刻度。                         | 动画                         | `component:ChartAxis` | experimental | 不适用。                                               |

## Behavioral and layout contract

草案需求注明其依据，以免把观察到的代码误认为有意的决策。

| ID   | 候选不变式                                                                                                                  | 依据                                   | 草案审查状态   |
| ---- | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------------- |
| FR1  | 顶部或底部轴必须使用 Chart 的 x 比例尺；左侧或右侧轴在有分类 y 比例尺时必须使用它，否则使用线性 y 比例尺。                  | 实现、类型与针对性测试                 | verify         |
| FR2  | 连续刻度生成必须对 d3 刻度生成与其默认格式化器使用同一个经过净化的数量；band 比例尺在稀疏化前必须使用其完整定义域。         | 实现                                   | verify         |
| FR3  | 提供的 `tickFormat` 必须优先；否则连续比例尺使用 d3 格式化，band 取值使用 `String`。                                        | 实现与针对性测试                       | verify         |
| FR4  | 显式 `maxTicks` 必须优先于由尺寸推导的上限。                                                                                | 实现与针对性测试                       | verify         |
| FR5  | 截断必须保留完整的 Unicode 字素簇，同时保持文档所述的“内容计数加省略号”输出。                                               | 针对性红/绿测试与 Unicode 标准附件 #29 | settled        |
| FR6  | 自动横向密度必须以用户感知字符而非 UTF-16 存储单元来估算已格式化标签的长度。                                                | 针对性红/绿等价测试与 Unicode 分段     | settled        |
| FR7  | 底部默认必须显示边缘线，其他边缘默认必须隐藏它。`showTicks` 必须强制开启边缘线，并为每个保留下来的刻度渲染一个标记。        | 实现、JSDoc、针对性测试与 Storybook    | verify         |
| FR8  | 底部与右侧轴必须平移到对应的绘图边缘。顶部与左侧保持在绘图原点。标签与刻度标记从该物理边缘向外延伸。                        | 实现与针对性测试                       | verify         |
| FR9  | 在正负号混合的线性 y 定义域上，底部边缘线必须对齐 y=0；分类 y 则使其留在绘图边缘。                                          | 实现                                   | verify         |
| FR10 | 当 `animated` 为 true 时，刻度移动与可见性可以过渡，为 false 时必须立即生效。超出范围的刻度在更新期间保持挂载但透明度为零。 | 实现与流式示例；动效意图尚未确定       | human decision |

### Allowed variation

- **AV1 — 刻度数量。** d3 可能选择一个相近的连续刻度数量，而不是所请求的数字。
- **AV2 — 标签集合。** 自动与显式密度限制可能省略按均匀间隔分布的标签，同时保持其比例尺顺序。
- **AV3 — 提供的文本。** 产品调用点可通过 `tickFormat` 以自己的单位与区域设置格式化取值。

### Representative states

| 状态                    | 必需不变式                                       | 允许的变化                         |
| ----------------------- | ------------------------------------------------ | ---------------------------------- |
| 底部分类                | Band 标签居中；边缘线默认显示。                  | 自动密度可能省略标签。             |
| 顶部分类                | Band 标签渲染在顶部边缘之外。                    | 除非请求，否则边缘线保持隐藏。     |
| 左侧连续                | d3 标签渲染在左侧边缘之外。                      | d3 选择确切的刻度值。              |
| 右侧连续                | 轴平移到右侧边缘，标签渲染在其之外。             | d3 选择确切的刻度值。              |
| 垂直分类                | 行标签使用 `yBandScale` 并与 band 中心对齐。     | 自动密度可能省略标签。             |
| 显式格式化              | 每个保留下来的标签都使用所提供的格式化器。       | 由使用方拥有的措辞与单位。         |
| 截断标签                | 完整字素簇位于所追加的省略号之前。               | 由调用方选择内容字符上限。         |
| 显示刻度标记            | 每个保留下来的标签都有一条向外标记与一条边缘线。 | 边缘线可见性输入在此状态下被包含。 |
| 正负号混合的线性 y 数据 | 底部线表示 y=0 而非绘图边界。                    | 确切像素位置跟随所提供的定义域。   |
| 流式 / 变化中的定义域   | 刻度位置与可见性更新；动画遵循 `animated`。      | 刻度标识跟随原始取值。             |

### Transformation and precedence order

- **ORD1 — 比例尺。** 解析物理朝向 → 选择 Chart 比例尺 → 每个刻度只生成并格式化一次 → 推导感知字素的密度上限 → 均匀过滤标签。
- **ORD2 — 标签。** 应用所提供的格式化器或比例尺默认值 → 截断时保留完整字素簇 → 渲染结果。
- **ORD3 — 边缘。** 解析位置默认值 → 应用 `showAxisLine` → 当 `showTicks` 为 true 时强制开启该线。

### Performance and resources

- **PR1 — 有界连续刻度。** 净化会将 d3 请求上限设为 1000，因此使用方取值无法分配无界的刻度数组。
- **PR2 — 派生刻度状态。** 刻度生成与格式化保持为渲染派生并记忆化；每个生成的标签只格式化一次，并由密度计算与渲染共享，ChartAxis 不持有任何监听器、观察器、定时器或持久资源。

## Accessibility contract

- **AR1 — 可见文本完整性。** 截断的刻度标签必须在 Unicode 字素簇边界下保留完整的用户感知字符。
- **AR2 — Chart 级替代方案。** ChartAxis 渲染在 Chart 的具名图像内部。Chart 拥有无障碍图表名称与受支持的小数据表格；轴标签与指针内容不会取代该替代方案。
- **AR3 — 嵌套轴语义缺口。** 当前实现会发出一个带位置标签的 `role="group"`。该分组是否应在 Chart 的 `role="img"` 之下独立暴露并本地化仍未验证，需要所有者审查。

## Design relationships

| 解剖结构或状态 | 设计需求                                   | 表示权威                         | 层级角色 | 组件契约           |
| -------------- | ------------------------------------------ | -------------------------------- | -------- | ------------------ |
| 轴边缘线       | 存在时为物理绘图边缘提供基底。             | 未确定；未链接任何当前设计记录   | 支撑     | FR7, FR9           |
| 刻度标记       | 将保留下来的标签与比例尺上的位置关联起来。 | 未确定；未链接任何当前设计记录   | 支撑     | FR7                |
| 刻度标签       | 在绘图周围保留可读的取值/类别文本。        | Unicode 字素簇边界确定文本完整性 | 支撑     | FR3, FR5, FR6, AR1 |
| 刻度过渡       | 在比例尺变化期间体现连续性。               | 未确定；`design:motion` 仍为草案 | 支撑     | FR10               |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Axis edge line": {
    "none": {
      "reason": "unsettled: ChartAxis consumes semantic color tokens but no current component or family contract decides whether the line is a public theme target."
    }
  },
  "Tick marks": {
    "none": {
      "reason": "unsettled: ChartAxis consumes semantic color tokens but no current component or family contract decides whether tick marks are a public theme target."
    }
  },
  "Tick labels": {
    "none": {
      "reason": "unsettled: ChartAxis consumes semantic color tokens but no current component or family contract decides whether labels are a public theme target."
    }
  }
}
```

## Family and system relationships

- 目前没有当前 family 或设计记录治理 ChartAxis。
- `architecture:component-test-sufficiency` 负责合理的公共状态划分、可观察断言与红先于绿的审计修复。
- `architecture:component-theming-surface` 负责解剖结构到主题目标的处置；仅靠消耗令牌并不会把 ChartAxis 纳入公共组件主题化。
- `spec:AST-002` 负责公共 API 准入，并禁止审计在修复过程中夹带新的公共选项。
- `spec:AST-029` 负责本次观察性补写、封闭证据回执、安全修复与失败即关闭的资格报告。

## Verification map

| 契约          | 验证                                                  | 代表性状态                                     | 变异或失败预期                                             | 审计小节                          |
| ------------- | ----------------------------------------------------- | ---------------------------------------------- | ---------------------------------------------------------- | --------------------------------- |
| FR1, FR8      | `ChartAxis.test.tsx`；`ChartAxis.stories.tsx`         | top、right、bottom、left；band 与线性          | 某个边缘使用了错误的比例尺、变换或向外标签侧。             | `audit:ChartAxis/behavior-layout` |
| FR2, FR3      | `ChartAxis.test.tsx`                                  | 默认数量；band、线性与自定义格式化             | 生成与格式化不一致，或所提供的格式化器被忽略。             | `audit:ChartAxis/behavior`        |
| FR4           | `ChartAxis.test.tsx`                                  | 自动上限与显式 `maxTicks`                      | 显式上限不再优先于由尺寸推导的稀疏化。                     | `audit:ChartAxis/behavior`        |
| FR5, FR6, AR1 | 红先于绿的字素回归测试；密度测试；浏览器故事          | ASCII、emoji、旗帜与 ZWJ 标签；截断的宽/窄绘图 | 可见标签拆断了字素，或感知宽度相同的标签保留了不同的刻度。 | `audit:ChartAxis/i18n-testing`    |
| FR7           | `ChartAxis.test.tsx`；Axes & Grids Storybook 测试夹具 | 默认值；请求线条；请求刻度                     | 刻度标记丢失边缘线或线条默认值改变。                       | `audit:ChartAxis/behavior`        |
| FR9           | 源码审查；浏览器证据仍待补充                          | 仅正、仅负、正负号混合、y-band                 | 正负号混合的零线移到边缘，或分类轴穿过绘图。               | `audit:ChartAxis/behavior-design` |
| FR10          | 流式故事；精确 head 的浏览器证据仍待补充              | 动画、立即、进入/离开的刻度                    | 禁用动画后仍保留过渡，或移动中的标签跳到过时几何位置。     | `audit:ChartAxis/design-testing`  |
| AR2, AR3      | Chart 无障碍测试；包级 axe；无障碍树审查              | 标题/副标题、小数据表格、嵌套轴分组            | Chart 丢失了替代方案，或未经审查的嵌套语义声明被视为事实。 | `audit:ChartAxis/accessibility`   |

## Decision log

无。本草案记录观察到的行为与一项客观的 Unicode 修正；它不批准新的 ChartAxis 策略。

## Open questions

- **OQ1 — 轴语义。** ChartAxis 应保持为 Chart 单个具名图像内的纯视觉内容，还是把每个轴暴露为可独立本地化的无障碍分组？（`human-api`）

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或共享系统规则。它链接到它们的所有者。
