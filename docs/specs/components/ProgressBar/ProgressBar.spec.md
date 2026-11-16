---
schema_version: 3
template_version: 7
kind: component
id: component:ProgressBar
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility]
verified_by:
  [
    packages/core/src/ProgressBar/ProgressBar.test.tsx,
    packages/core/src/ProgressBar/__tests__/ProgressBar.a11y.test.tsx,
    packages/core/src/ProgressBar/__tests__/ProgressBar.a11y.chromium.spec.ts,
    packages/core/src/ProgressBar/__tests__/ProgressBarMotion.a11y.chromium.spec.ts,
    packages/core/src/ProgressBar/__tests__/ProgressBarTouch.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: [design:reduced-motion]
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:theme-authoring-contract,
    architecture:theme-tokens,
    architecture:internationalization,
  ]
contributing: []
system_specs:
  [
    spec:AST-002/DEC-1,
    spec:AST-002/DEC-2,
    spec:AST-009,
    spec:AST-094,
    spec:AST-108,
  ]
---

# ProgressBar component contract

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/motion/uikit/progressBar.ts"]
}
```

## Contract at a glance

| 领域         | 契约                                                                                                                                                                                                                                                                                   |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约     | `label`、`value`、`max`、`isLabelHidden`、`hasValueLabel`、`formatValueLabel`、`variant`、`isIndeterminate`、`marks`、`isDisabled`、根 `BaseProps`，以及根 `ref`。                                                                                                                     |
| 行为         | 一个带标签的 `progressbar`，其填充在变暗的轨道上显示被钳制后的值，在每种指针下按主题的时长与缓动移动；或者在被判定为不确定时滑动，并在减少动效下原地脉动；还带有可选的值文本与带标签的目标标记。                                                                                       |
| 最终用户影响 | 人们看到一项操作已经进行到何处，辅助技术读取名称与值；标记在悬停或聚焦时显示其标签。                                                                                                                                                                                                   |
| 构建者影响   | 如今构建者的 `data-variant` 会替换被反射的 variant，因此针对进度条真实 variant 的主题规则不再匹配（FR8 缺口）；除此之外没有其他影响。                                                                                                                                                  |
| 兼容性/就绪  | API 与默认值均无变化。实现缺口列在 Current-state impact 下。                                                                                                                                                                                                                           |
| 审查检查     | 否决这样的确定性进度条：其正确性依赖邻近文本、值超出 `[0, max]`、泄漏 `NaN`、在不确定状态下仍带值语义，或目标标记偏离其所在部分。                                                                                                                                                      |
| 管辖规则     | `component:ProgressBar/DEC-1`、`DEC-2`；`spec:AST-002`；`spec:AST-094` FR4、FR13；`design:reduced-motion` DR1；`architecture:component-theming-surface`；`architecture:theme-tokens` INV11；`architecture:internationalization` INV1a；`architecture:public-component-api` INV5–INV8。 |

本表是审查用的投影；下方正文具有权威性。

## Intent

ProgressBar 传达一项操作的进度。确定性进度条本身就是一个足够的独立视觉：人们无需依赖在别处渲染的可见文本，就能区分已完成与剩余的进度。外部文本可以补充该进度条，但它不是进度条正确的前提。

使用方语法与示例属于 `ProgressBar.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes` —— 确定性、`value` 为 0、`max` 为 100、`accent`、可见标签、无值文本、无标记。
- 兼容性类别：记录已发布的行为，外加两项不改变 API、默认值或值的动效变化：减少动效下的不确定填充（FR6），以及在每种指针下按主题的缓动时长移动的确定性填充（FR4）；四个规范的 `progress-bar*` 目标是仅有的目标类别。
- 受控/非受控行为：不适用；`value` 由调用方拥有。
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **值文本在 catalog 之外拼装（FR3）。** 默认值文本与 `aria-valuetext` 都是代码中拼装的 `${percent}%`，因此以不同方式书写百分比的语言区域读取并看到的是英文形式，而 `architecture:internationalization` INV1a 要求 Astryx 拥有的文本来自一条 catalog 消息。
- **调用方的 `data-variant` 替换被反射的 variant（FR8）。** 调用方 props 在根元素的主题属性之后展开，因此调用方的 `data-variant` 替换了被反射的值，针对真实 variant 的主题规则不再匹配，而 `architecture:public-component-api` INV5 要求组件拥有的行为不被覆盖。
- **主题新增的 variant 没有基线填充（FR4）。** variant 映射被导出供主题扩展，但新增的 variant 不匹配任何内建填充或填充之上的标记颜色，因此在主题为其设置样式之前填充不绘制任何内容，而 `architecture:component-theming-surface` INV14 要求一个安全的基线。
- **触摸填充仍然播放实测时长（FR4）。** 在粗粒度主指针下，值变化仍按 `progress.fillTrackMs` 乘以值所移动的轨道比例做线性移动，而 `spec:AST-094` FR45 要求它在每种指针下按 `--duration-medium` 与主题缓动移动。
- **不确定滑动跟随任何从右到左的祖先（FR6）。** 不确定滑动以及标记的居中会在任何从右到左的祖先下镜像，而不是依据进度条自身的方向，因此在从右到左页面的从左到右区域中，它们与标签反向，而 `architecture:internationalization` INV11 要求从渲染出的区域解析镜像。

- **浅色默认主题中 warning 与 neutral 填充低于 3:1（FR6、OQ1）。** 相对于轨道，warning 填充达到 1.65–1.82:1，neutral 填充即使在全不透明度下也只有 1.84–2.03:1（在 body 与 surface 背景上），因此 FR6 的 3:1 昏暗阶段下限在浅色下对这两种色调无法成立；其他每种色调，以及深色下的每种色调，都满足该下限。

## Ownership boundary

**拥有**

- 对组件所提供的每一种确定性呈现，在已完成与剩余进度之间提供足够的独立视觉区分。
- 容器、标签行、轨道（`progressbar` 元素）、填充与标记，以及它们的 `progress-bar`、`progress-bar-track`、`progress-bar-fill` 和 `progress-bar-mark` 目标。
- 值钳制、值文本、不确定动效与标记定位。

**不拥有 / 非目标**

- 外部可见标签、值或描述 —— 由产品调用点拥有，且是进度条的补充。
- 内建标签或值文本没有单独的公共目标；不存在这样的目标。
- 确切的独立对比度处理 —— 一个人工设计决策（OQ1）。
- 主题 token 定义 —— 由 `architecture:theme-tokens` 拥有。
- 标记 tooltip 的行为 —— 由 `component:Tooltip` 拥有。

## Public concepts

| 概念     | 封闭取值或状态                                                                              | 含义                                            | 按 variant/朝向/状态的可用性 | 默认值           | 所有者                  | 稳定性                         | 无效值行为                                             |
| -------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------- | ---------------- | ----------------------- | ------------------------------ | ------------------------------------------------------ |
| 进度模式 | 确定性；不确定性                                                                            | 已完成进度是否已知。                            | 所有 variant                 | 确定性           | `component:ProgressBar` | 稳定                           | —                                                      |
| 值与范围 | 位于 `0`–`max` 内的有限 `value`                                                             | 已完成的量。                                    | 确定性                       | 100 中的 0       | 调用方                  | 稳定                           | 钳制到 `[0, max]`；非有限的值或 `max` 记作 0。         |
| 标签     | 字符串，可见或视觉隐藏                                                                      | 进度条的可访问名称。                            | 始终                         | 可见             | 调用方                  | 稳定                           | —                                                      |
| 值文本   | 隐藏；显示；自定义格式化器                                                                  | 标签旁可选可见的值，同时也是 `aria-valuetext`。 | 确定性                       | 隐藏；取整百分比 | `component:ProgressBar` | 稳定                           | 不确定时忽略。                                         |
| Variant  | `accent`、`success`、`warning`、`error`、`neutral`；通过导出的 variant 映射支持主题新增的值 | 填充颜色。                                      | 始终                         | `accent`         | `component:ProgressBar` | 稳定                           | 新增的值在主题为其设置样式之前不绘制填充（FR4 缺口）。 |
| 禁用     | `true`、`false`                                                                             | 变暗的填充、标签与标记。                        | 始终                         | `false`          | `component:ProgressBar` | 稳定                           | —                                                      |
| 标记     | `{value, label}` 列表                                                                       | 轨道上带标签的刻度。                            | 确定性                       | 无               | 调用方                  | 稳定                           | 非有限值被丢弃；其余钳制到轨道。                       |
| 视觉处理 | 一种足够的独立处理；确切形式待定                                                            | 图形如何区分已完成与剩余的进度。                | 确定性                       | —                | `component:ProgressBar` | 由 DEC-1 决定；形式待定（OQ1） | 不存在不完整的公共模式。                               |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 依据                                                                         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| FR1 | ProgressBar 提供的每一种确定性呈现，都是用于区分已完成与剩余进度的足够独立视觉；外部可见文本可以补充它，但绝不是必需的，而补充的文本或图形绝不替代这种区分。ProgressBar 不会让视觉正确性依赖于调用方声明的、它无法验证或关联的外部内容。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `component:ProgressBar/DEC-1`；`spec:AST-002`                                |
| FR2 | 只有在组件具备正确的基础行为、且仍存在稳定的调用方拥有的区分方式之后，才会考虑用于调整视觉区分的新公共 API。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | `component:ProgressBar/DEC-1`；`spec:AST-002`                                |
| FR3 | 根元素持有一个标签行和一条轨道。标签通过 `aria-labelledby` 为轨道（`role="progressbar"`）命名；`isLabelHidden` 只将其视觉隐藏。处于确定性状态时，轨道暴露 `aria-valuenow`（钳制后的值）、`aria-valuemin` 0、`aria-valuemax`（`max`），以及来自 `formatValueLabel` 的 `aria-valuetext`，后者默认为取整后的百分比；`hasValueLabel` 在标签旁显示同一文本。为零或非有限的 `max` 给出 0%，且绝不渲染 `NaN`。Astryx 拥有的值文本来自一条 catalog 消息（`architecture:internationalization` INV1a）。实现缺口：默认文本在代码中拼装（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 当前源码与测试                                                               |
| FR4 | 轨道高 8px、完全圆角、颜色为 `--color-background-muted`，并裁剪填充。确定性填充横跨轨道并沿其滑动，使其前缘位于钳制后的百分比处，并按进度条自身的书写方向镜像；当值变化时，在每种指针下（包括手指），它从所在位置出发，在 `--duration-medium` 时长内以主题缓动移动（`spec:AST-094` FR45）。在粗粒度主指针下（`spec:AST-094` FR13），大于零时它至少绘制 16px 长，长度覆盖到该处的标记算作位于填充之上（FR7），而为零时不绘制任何内容。`progress.fillTrackMs`（1000ms，UIKit 进度视图用于整条轨道变化）及其线性曲线 `progress.curves.fill`，作为 UIKit 的实测参考保留在生成的动效角色表中，且没有任何动效使用它们（`spec:AST-094` FR4、DEC-5）。实现缺口：在粗粒度主指针下，填充仍按 `progress.fillTrackMs` 乘以值所移动的轨道比例做线性移动。在减少动效下，新值在每种指针下都立即到位（`design:reduced-motion` DR1）。填充绘制 `--color-accent`、`--color-success`、`--color-warning` 或 `--color-error`，对 `neutral` 与禁用状态的进度条则绘制 `--color-text-disabled`；主题新增的 variant 具有一个安全的、与主题无关的填充（`architecture:component-theming-surface` INV14）。实现缺口：主题新增的 variant 在主题为其设置样式之前，既不绘制填充也不绘制填充之上的标记颜色（见 Current-state impact）。在强制颜色模式下，填充按值设定尺寸而非滑动，并保留 1px 的 `CanvasText` 轮廓，使其形状保持可见（`architecture:theme-tokens` INV11）。 | 当前源码与测试；UIKit 测量（iOS 26.2 模拟器）；`component:ProgressBar/DEC-2` |
| FR5 | `isDisabled` 使填充、标签、值文本与标记变暗，并且不添加任何 ARIA 状态。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试                                                               |
| FR6 | `isIndeterminate` 移除所有值属性与值文本。在未启用减少动效时，每种指针下都有一个 40% 宽的填充以缓动方式横穿被裁剪的轨道，每趟 1.5s，并按进度条自身的渲染方向镜像（`architecture:internationalization` INV11）。在减少动效下，每种指针下填充都以一条实心条横跨整条轨道，没有片段、没有位移，只有其不透明度脉动：从 1 降至 0.84 再回升，每一程都采用 `timing.curves.move` 曲线上的 `progress.reducedMotionPulseMs` 角色（2000ms）；轨道保持不变。该脉动是忙碌循环，因此节拍不会对其缩放（`spec:AST-094` FR4、`spec:AST-108` FR4）。它把 `design:reduced-motion` DR1 的无位移规则应用于该记录留给其组件的循环，以不透明度变化取代位移。在 0.84 的下限处，对于每个在全不透明度下达到 3:1 的色调，填充在两种主题下与轨道之间都至少保持 3:1（AR4）。实现缺口：滑动以及标记的居中会在任何从右到左的祖先下镜像，而不是依据进度条自身的方向，因此在从右到左页面的从左到右区域中，它们与标签反向（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码与测试；`component:ProgressBar/DEC-2`                                |
| FR7 | 每个有限标记都在 `progressbar` 元素之外渲染一个位于其钳制位置的刻度（使其标签保持暴露），其 tooltip 在悬停与聚焦时显示该标签；位于填充部分内的标记采用填充的对比色，且不确定状态下不渲染标记。可聚焦的标记将其标签作为可访问名称暴露（WCAG 2.2 SC 4.1.2）。每个标记都是一个以其标签命名的图像。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试                                                               |
| FR8 | 根元素携带反映 `variant` 的 `progress-bar`，轨道携带 `progress-bar-track`，填充携带反映解析后填充 variant 的 `progress-bar-fill`，每个标记携带反映解析后填充 variant 与位置的 `progress-bar-mark`；标签与值文本不携带目标。被反射的状态保持为组件拥有（`architecture:public-component-api` INV5）。实现缺口：调用方的 `data-variant` 会替换根元素上被反射的 variant（见 Current-state impact）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 当前源码与测试                                                               |
| FR9 | `ref` 与 `data-testid` 到达根元素；受支持的 DOM、data、ARIA 与事件属性到达根元素，而被反射的主题属性保持为组件拥有（FR8）；`xstyle`、`className` 与 `style` 在组件样式之后组合。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 当前源码与测试；`architecture:public-component-api` INV5–INV8                |

### Allowed variation

- **AV1 — 精确的视觉处理。** 形状、token 选择与其他渲染细节可以变化，前提是每一种结果呈现都满足 FR1。
- **AV2 — 主题。** 主题可以通过目标表达其视觉语言，同时保持独立区分。

### Representative states

| 状态         | 必需的不变式                                                                            | 允许的变化 |
| ------------ | --------------------------------------------------------------------------------------- | ---------- |
| 确定性，部分 | 仅凭图形即可区分已完成与剩余进度；值属性存在。                                          | Variant。  |
| 带值文本     | 图形仍满足 FR1；文本作为补充。                                                          | 格式化器。 |
| 标签隐藏     | 进度条保持其可访问名称。                                                                | —          |
| 确定性，触摸 | 在粗粒度主指针下，填充从所在位置按主题时长与缓动移动；大于零时至少 16px；为零时无内容。 | Variant。  |
| 不确定       | 无值属性；滑动填充；在减少动效下，全宽填充原地脉动其不透明度，没有位移。                | Variant。  |
| 带标记       | 刻度位于 `progressbar` 之外，每个都是以标签命名的图像；其 tooltip 显示该标签。          | 标记标签。 |

### Transformation and precedence order

- **ORD1 — 值。** 非有限 → 0；钳制到 `[0, max]`；非正的 `max` 给出 0%。
- **ORD2 — 呈现。** 先解析确定性或不确定性；外部内容绝不削弱确定性视觉要求。

### Performance and resources

- **PR1 — 不检查外部内容。** ProgressBar 不添加 DOM 观察、测量或关系发现，来判断邻近文本是否使较弱的进度条可接受。标记 tooltip 延迟加载。

## Accessibility contract

- **AR1 — 独立的非文本区分。** 确定性进度条在无需依赖外部可见文本的情况下满足适用的非文本对比度要求。
- **AR2 — 程序化语义。** 轨道是一个具名 `progressbar`，在确定性状态下具有值语义，在不确定状态下没有值语义，且与可见处理无关。
- **AR3 — 补充文本不被推断。** ProgressBar 不断言外部文本存在、可见、等价或已关联。
- **AR4 — 减少动效脉动保持进度条可见。** 不确定脉动绝不把填充绘制到低于 0.84 的不透明度；对于每个在全不透明度下与轨道达到 3:1 的色调，0.84 都是它们在浅色与深色默认主题下仍能达到的最低不透明度（最低者：深色下的 success，在 surface 背景上为 3.01:1）。浅色下的 warning 与 neutral 即使在全不透明度下也不达标（见 Current-state impact；OQ1）。

## Design relationships

| 结构或状态     | 设计要求                     | 表示权威                   | 层级角色 | 组件契约 |
| -------------- | ---------------------------- | -------------------------- | -------- | -------- |
| 进度条         | 安排标签行与轨道。           | 当前源码与文档             | 支撑     | FR3、FR8 |
| 标签与值文本   | 命名操作，并可选地补充其值。 | 当前源码与文档             | 支撑     | FR3      |
| 填充与剩余轨道 | 提供足够的独立区分。         | DEC-1；处理方式待定（OQ1） | 显著     | FR1、FR4 |
| 标记           | 轨道上可选带标签的目标。     | 当前源码与文档             | 支撑     | FR7      |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Progress bar": {"target": "progress-bar"},
  "Label": {
    "none": {
      "reason": "unsettled: No current public ProgressBar target reaches this part; future target ownership is undecided."
    }
  },
  "Value text": {
    "none": {
      "reason": "unsettled: No current public ProgressBar target reaches this part; future target ownership is undecided."
    }
  },
  "Track": {"target": "progress-bar-track"},
  "Fill": {"target": "progress-bar-fill"},
  "Mark": {"target": "progress-bar-mark"}
}
```

`Label` 与 `Value text` 的处置是当前事实，而非这些部分保持无目标的决策。

## Family and system relationships

- `architecture:public-component-api` 与 `spec:AST-002/DEC-1` 管辖调用方拥有的区分是否足以支持一个公共 prop；FR2 应用它们。
- `architecture:component-theming-surface` 与 `architecture:theme-authoring-contract` 管辖目标与主题覆盖。
- `architecture:theme-tokens` 管辖 token 词汇与强制颜色边界；FR4 应用 INV11。
- `architecture:internationalization` 管辖 Astryx 拥有的文本；FR3 记录值文本缺口。
- `component:Tooltip` 拥有标记 tooltip。

## Verification map

| Contract           | Verification                                                                                                                                        | Representative states                                                              | Mutation or failure expectation                                                                                                                                                                                                                                                                            | Audit section                |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1, AR1, AR3      | 稳定的视觉基线 `core-progressbar--default`（中性）与 `core-progressbar--with-target-mark`（探针）                                                   | 默认；带标记的探针主题                                                             | 填充或轨道一旦改变，就会以变更后的状态返回以供审查。缺口：没有跨已发布主题与颜色模式的真实浏览器对比度检查来证明这种独立区分（OQ1 保留该处理）。                                                                                                                                                           | `audit:ProgressBar/visual`   |
| FR2                | 公共类型与使用方文档审查                                                                                                                            | 当前 props                                                                         | 缺口：没有自动化检查；新增一个视觉区分 prop 就是一项审查发现。                                                                                                                                                                                                                                             | `audit:ProgressBar/api`      |
| FR3, ORD1, AR2     | `ProgressBar.test.tsx` 的标签、值文本、formatter、clamp、零值与 NaN 测试；`ProgressBar.a11y.test.tsx` 与 `ProgressBar.a11y.chromium.spec.ts` 的状态 | 确定态；已格式化；已完成；标签隐藏                                                 | 缺失名称、值超出 `[0, max]`、泄漏 `NaN`，或 `aria-valuetext` 错误，都会失败，包括在可访问性树层面。缺口：没有测试检查非英文语言环境下的默认文本。                                                                                                                                                          | `audit:ProgressBar/a11y`     |
| FR4                | `ProgressBar.test.tsx` 的 track-clip、transform、variant 与 forced-colors 测试；`ProgressBarMotion.a11y.chromium.spec.ts`                           | 每个 variant；值变化；RTL 区域；减少动态效果；强制颜色                             | 轨道不裁剪、在强制颜色之外按宽度设定填充尺寸、丢失强制颜色轮廓、前缘偏离值或在 RTL 区域未镜像、减少动态效果下值变化没有立即落位，或移动过程中逐帧布局，都会失败。缺口：variant 颜色没有直接检查。缺口：“固定 8px 轨道高度”测试只检查进度条能够渲染，因此轨道高度没有检查；没有测试覆盖主题新增的 variant。 | `audit:ProgressBar/visual`   |
| FR5                | `ProgressBar.test.tsx` 的 disabled 与 disabled-mark 测试                                                                                            | 禁用态                                                                             | 标签缺失或标记未变暗会失败。缺口：静音填充与标签颜色没有直接检查。                                                                                                                                                                                                                                         | `audit:ProgressBar/visual`   |
| FR6                | `ProgressBar.test.tsx` 的 indeterminate 套件                                                                                                        | 每个 variant；RTL                                                                  | 不确定态下出现值属性或值文本、丢失标签、轨道未裁剪，或滑动未镜像，都会失败。没有测试覆盖从右到左页面内、从左到右区域中的滑动。缺口：RTL 测试断言的是从右到左祖先选择器，因此它钉住了 FR6 缺口。                                                                                                            | `audit:ProgressBar/behavior` |
| FR4 touch timing   | `ProgressBarTouch.a11y.chromium.spec.ts`；`ProgressBar.test.tsx` 的 touch 套件                                                                      | 粗指针与细指针；从 10% 到 90%；移动中途出现新值；窄轨道上的 1%；零值；减少动态效果 | 任何指针下的移动若偏离主题的缓动时长、或从旧值而不是绘制位置起步；粗指针下非零填充短于 16px；或零值处绘制出填充，都会失败。                                                                                                                                                                                | `audit:ProgressBar/behavior` |
| FR6 reduced motion | `ProgressBarMotion.a11y.chromium.spec.ts` 的减少动态效果脉冲用例；`ProgressBar.test.tsx` 的 pulse 套件                                              | 每个 variant；粗指针与细指针                                                       | 出现线段、任何 transform 或位移、填充窄于轨道、除填充透明度之外的动画属性、透明度低于 0.84、周期与 `progress.reducedMotionPulseMs` 在任一方向上不相等，或轨道发生变化，都会失败。                                                                                                                          | `audit:ProgressBar/behavior` |
| AR4                | `ProgressBarMotion.a11y.chromium.spec.ts` 的脉冲下限对比度用例                                                                                      | 每个 variant；浅色与深色默认主题；body 与 surface 背景                             | 某种色调在全不透明度下达到 3:1，却在最低下限处跌破 3:1，会失败。缺口：浅色主题下的 warning 与 neutral 在全不透明度下就低于 3:1（OQ1）。                                                                                                                                                                    | `audit:ProgressBar/a11y`     |
| FR7                | `ProgressBar.test.tsx` 的 target-mark 套件；`ProgressBar.a11y.chromium.spec.ts` 的 mark-name 测试                                                   | 无；一个；多个；已钳制；非有限值；在填充上；不确定态；禁用态；tooltip              | 标记缺失、错位或裁剪，标记落在 `progressbar` 内部，标记不是以其标签命名的图像，tooltip 丢失，或填充上的颜色错误，都会失败。                                                                                                                                                                                | `audit:ProgressBar/a11y`     |
| FR8                | `ProgressBar.test.tsx` 的 target-name 与 mark-target 测试；`themingTargets.test.ts`                                                                 | 四个规范目标                                                                       | 目标缺失或改名会失败。缺口：没有测试覆盖调用方的 `data-variant`。`themingTargets.test.ts` 只能捕获被改名或未记录的目标；如果某个部件不再携带其目标，没有检查会失败。                                                                                                                                       | `audit:ProgressBar/theming`  |
| FR9                | `ProgressBar.test.tsx` 的 ref 与 `data-testid` 测试                                                                                                 | Ref；测试 id                                                                       | ref 不是 `div` 或测试 id 丢失会失败。缺口：ref 测试只检查 ref 是 `div`，不检查它是根节点，也没有测试覆盖 DOM props、`className`、`style` 或 `xstyle` 的合并顺序。                                                                                                                                          | `audit:ProgressBar/api`      |
| PR1                | 源码审查                                                                                                                                            | 每个状态                                                                           | 缺口：如果 ProgressBar 开始探查附近内容，没有自动化检查会失败。                                                                                                                                                                                                                                            | `audit:ProgressBar/behavior` |
| 主题解剖映射       | `scripts/check-knowledge.mjs`                                                                                                                       | 规范解剖与四个目标                                                                 | 映射缺失、多余或过期会导致仓库校验失败。                                                                                                                                                                                                                                                                   | `audit:ProgressBar/theming`  |

## Decision log

### DEC-1 — ProgressBar owns a sufficient standalone visual

**Reference:** `component:ProgressBar/DEC-1`

**Decider:** `cixzhang`, `2026-08-30`

ProgressBar 必须提供足够的独立视觉表达。组件内部或外部的可见文字可以改善理解，但即使没有这些文字，进度条仍然要负责传达已完成与剩余的进度。

公共 API 不得让这种正确性依赖于组件无法承载、关联或验证的外部内容。先解决组件自身的行为。只有当基础行为正确之后，仍存在稳定的、由调用方拥有的区分需求时，才考虑新增 API。

已否决：依据调用方对附近内容的声明来弱化进度条。那会把组件正确性转移到组件无法验证的外部条件上。

### DEC-2 — Touch fill timing and a reduced-motion pulse

**Reference:** `component:ProgressBar/DEC-2`

**Decider:** `cixzhang`, `2026-11-01`

在手指之下，确定态填充像 UIKit 的进度视图那样移动，因为触摸呈现默认采用实测的原生时序（`spec:AST-094` DEC-1）；鼠标则保留主题的动态效果。`spec:AST-094` DEC-26 取代了这一触摸填充时序：值变化不是手势，因此无论使用何种指针，填充都按主题的时长与缓动移动。不确定进度条在任何指针下都保留其 40% 的缓动滑动。在减少动态效果下，移动的线段仍会移动，因此进度条停止位移，改为在任何指针下原地缓慢脉冲，且脉冲下限保证其可见；这个缓慢的 2000ms 脉冲是所有者取值，偏离了 iOS Safari 实测的 1s 脉冲（透明度在 0.30 到 0.60 之间）。

已否决：手指下不确定进度条采用 iOS Safari 的四分之一轨道扫动。

## Open questions

- **OQ1 — 究竟什么样的精确视觉处理，能在所有受支持的 variant、主题与颜色模式下，为每个确定态呈现提供足够的独立“已完成对比剩余”区分？**（`human-design`）

## Content boundary

本文件不重复使用方的 prop 表格或示例、当前审查结果、实现步骤、精确视觉取值，或系统主题规则。它链接到这些内容的归属方。
