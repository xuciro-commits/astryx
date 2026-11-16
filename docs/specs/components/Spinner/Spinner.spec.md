---
schema_version: 3
template_version: 7
kind: component
id: component:Spinner
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-25
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Spinner/Spinner.test.tsx,
    packages/core/src/FieldStatus/__tests__/StatusMessage.a11y.chromium.spec.ts,
    packages/core/src/Spinner/__tests__/SpinnerMotion.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Spinner.stories.tsx,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:internationalization,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [spec:AST-009, spec:AST-017, spec:AST-020, spec:AST-086, spec:AST-108/FR4]
---

# Spinner component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                         |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公开契约      | 一个带动画的圆环，含 `size`（`sm`–`xl`）、`shade`、可选的可见 `label`，以及五个用于几何与颜色的公开主题变量。                                                                                                                                                |
| 行为          | 圆环位于一个具名指示器中；可见标签渲染在其下方，非空的字符串标签通过 `aria-labelledby` 为指示器命名，而不是重复它。独立的 Spinner 通过共享通道播报（AR1）。                                                                                                  |
| 最终用户影响  | 视力正常的用户能看到工作正在进行；屏幕阅读器用户会找到一个具名指示器，其默认名是已翻译的 “Loading”；减少动态效果的用户看到的是放慢的圆环，而不是冻结的圆环。                                                                                                 |
| 构建者影响    | 每个 Spinner 的指示器都从 `status` 变为 `progressbar`，包括组合组件内部的隐藏圆环，因此按角色查询指示器的使用方测试会发生变化；没有任何 prop、默认值或样式变化。                                                                                             |
| 兼容性/就绪度 | 一项无障碍修复：角色变为 `progressbar`，独立 Spinner 通过该通道播报；没有公开 prop 或默认值变化，应用代码无需改动（`spec:AST-017` FR53）：除 `progressbar` 以外的调用方 `role` 仍让 Spinner 保持静默，与发布时一致。其余缺口列在 Current-state impact 之下。 |
| 审查检查      | 拒绝没有无障碍名称的指示器、重复的字符串标签名称、已挂载并已持有其文本的实时角色、可被 flex 宿主压缩的盒子、覆盖盒子尺寸的调用方 `style`，以及在减少动态效果下停止转动的圆环。                                                                               |
| 管辖规则      | `spec:AST-086/FR2,FR8,FR11`；`spec:AST-020/FR15`；`spec:AST-017/FR53`；`architecture:component-theming-surface/INV6`；`architecture:internationalization/INV1a`；`architecture:public-component-api/INV5,INV6,INV8`。                                        |

此表是审查用的投影；以下正文才是权威。

## Intent

Spinner 表示持续时间未知的工作正在进行。它负责圆环的几何、动效与色彩变体，负责圆环下方可选的可见标签，以及指示器的无障碍名称。

## Compatibility and migration

- 保持已发布的默认值：每个 prop 均为 `yes`；指示器的角色与播报作为一项无障碍修复发生变化（AR1）
- 兼容性类别：无障碍修复，没有公开 prop、默认值或样式输出变化；应用代码无需改动（`spec:AST-017` FR53）
- FR53 下的发布兼容性：调用方 `role` 若为 `progressbar` 以外的值，Spinner 保持静默，与发布时一致，因此用这种方式让组合圆环静默的应用代码继续有效。这不是推荐模式；新代码使用 `aria-hidden` 隐藏组合的 Spinner
- 受控/非受控行为：不适用；Spinner 不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **名称为空或丢失（AR1）。** `aria-label=""` 被用作名称，而 `label=""` 会渲染一个空的可见 Text 并据此为指示器命名；两者都会让指示器留下空的无障碍名称（WCAG 2.2 4.1.2）。存在 `label` 时，调用方的 `aria-labelledby` 会落到没有角色的包装元素上，而不是指示器上。

## Ownership boundary

**负责**

- 指示器、绘制在其中的圆环，以及其下方的可选标签。
- 按 `size` 决定的圆环几何、按 `shade` 决定的圆环与轨道颜色、弧线的转动，以及减少动态效果下的速率。
- 五个公开主题变量及其声明位置。
- 指示器的无障碍名称，包括已翻译的默认值。

**不负责 / 非目标**

- 组合组件的忙碌指示器是否静默——由该组件在 `spec:AST-086` FR8 下负责。Core 组合组件与应用代码用 `aria-hidden` 隐藏它；Typeahead、BaseTypeahead 与 Tokenizer 保持其搜索指示器具名，并通过内部、非导出的路径使其静默。
- 内容形状的加载占位——由 `component:Skeleton` 负责。
- 确定性进度——由 `component:ProgressBar` 负责。
- 当 `label` 为节点时的富标签内容——由调用方负责。

## Public concepts

| 概念     | 封闭取值或状态                                                                                                       | 含义                                                                       | 按变体/方向/状态的可用性                 | 默认值           | 所有者              | 稳定性 | 无效值行为                                                                |
| -------- | -------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------- | ---------------- | ------------------- | ------ | ------------------------------------------------------------------------- |
| 尺寸     | `sm`、`md`、`lg`、`xl`                                                                                               | 圆环直径 10、14、18 或 28px，描边 2、3、3 或 4px。                         | 所有 spinner                             | `md`             | `component:Spinner` | 稳定   | TypeScript 拒绝其他值。                                                   |
| 色彩变体 | `default`、`subtle`、`onMedia`、`inherit`                                                                            | 用于浅色、内联、深色媒体或继承上下文的弧线与轨道颜色。                     | 所有 spinner                             | `default`        | `component:Spinner` | 稳定   | TypeScript 拒绝其他值。                                                   |
| 标签     | 缺失；字符串；富节点                                                                                                 | 圆环下方的可见内容。                                                       | 所有 spinner                             | 缺失             | `component:Spinner` | 稳定   | `null` 与 `undefined` 表示缺失。                                          |
| 主题变量 | `--spinner-diameter`、`--spinner-stroke-width`、`--spinner-arc-fraction`、`--spinner-color`、`--spinner-track-color` | 主题可以按 `size`、按 `shade` 或在基础 target 上设置的公开几何与颜色接缝。 | 声明在承载 `spinner` target 的那个元素上 | 按尺寸与色彩变体 | `component:Spinner` | 稳定   | 主题设置的描边宽度为 `0` 时不绘制描边；弧线比例只有在样式表加载后才生效。 |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                               | 依据           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | 没有标签时，Spinner 渲染一个 inline-grid 的 `span` 指示器，它承载 `spinner` target、ref、`data-testid` 与透传 props。有标签时，一个带 `--spacing-2` 间距的纵向 `div` 包装元素承载 target、ref、`data-testid`、透传 props 与样式输入；指示器 `span` 与标签依次渲染在其中。                                                                            | 当前源码与测试 |
| FR2 | 指示器的盒子等于圆环直径加上两侧各一份描边宽度，以行内方式设置在调用方 `style` 之后，因此调用方的 `width` 或 `height` 永远不会改变它的大小，而其他调用方样式仍然生效。盒子在 flex 宿主中不会收缩。没有样式表时，盒子与圆环按该尺寸的默认几何绘制。                                                                                                   | 当前源码与测试 |
| FR3 | 圆环是一个 `aria-hidden` 的轨道圆和一个 `aria-hidden` 的弧线，弧线覆盖圆周的 `--spinner-arc-fraction`（默认 0.375），从十二点钟方向开始，端点取圆头。弧线以 `--duration-slow-min` 为周期绕静止的轨道转动，该值由主题设置，之后由 `tempo` 缩放（`spec:AST-108` FR4），线性、无限循环；在 `prefers-reduced-motion: reduce` 下周期放慢到 3 秒且不停止。 | 当前源码与测试 |
| FR4 | 所有已挂载的圆环都以相同相位转动，无论各自何时挂载。在浏览器无法报告运行中动画的环境中，Spinner 不做任何相位计算。                                                                                                                                                                                                                                   | 当前源码与测试 |
| FR5 | `default` 在 `--color-track` 上绘制 `--color-accent`；`subtle` 在 `--color-track` 上绘制 `--color-text-secondary`；`onMedia` 在自身上绘制 `--color-on-dark`，轨道不透明度为 77/255；`inherit` 在自身上绘制 `currentColor`，轨道不透明度为 0.3。                                                                                                      | 当前源码与测试 |
| FR6 | 五个公开变量只声明在承载 `spinner` target 的元素上，并按 `size` 与 `shade` 声明，因此针对该 target 及其 `size:` 或 `shade:` 变体的主题规则可以覆盖它们；当标签把 target 移到包装元素时，内部指示器继承这些变量。                                                                                                                                     | 当前源码与测试 |
| FR7 | 字符串标签渲染为粗体正文 Text；富节点标签按提供的内容渲染。                                                                                                                                                                                                                                                                                          | 当前源码与测试 |
| FR8 | `xstyle` 与 `className` 落到承载 target 的元素，并在组件样式之后合并；`style` 在它们之后合并，但指示器盒子的 `width` 与 `height` 除外（FR2）。                                                                                                                                                                                                       | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题几何与颜色。** 主题可以按尺寸、按色彩变体或全局更改这五个公开变量；盒子跟随主题设置的直径与描边。
- **AV2 — 标签内容。** 标签文字与富内容可以变化。

### Representative states

| 状态              | 必需不变式                                                                           | 允许的变化       |
| ----------------- | ------------------------------------------------------------------------------------ | ---------------- |
| 无标签            | Progressbar `span` 承载 target 与已翻译的 “Loading” 名称。                           | 尺寸、色彩变体。 |
| 字符串标签        | 包装元素承载 target；指示器通过 `aria-labelledby` 指向可见 Text 来命名。             | 标签文字。       |
| 富标签            | 指示器通过 `aria-label` 命名（调用方的值，否则为 “Loading”）；节点按提供的内容渲染。 | 节点内容。       |
| 显式 `aria-label` | 指示器以该值命名，无论有无标签。                                                     | —                |
| 减少动态效果      | 弧线以 3 秒周期继续移动。                                                            | —                |
| 狭窄 flex 宿主    | 指示器盒子保持完整尺寸并溢出，而不是被压缩。                                         | —                |

### Transformation and precedence order

- **ORD1 — 无障碍名称。** 没有 `label` 时，调用方的 `aria-labelledby` 落到指示器上，并从被引用的元素为它命名。然后：非空的调用方 `aria-label` → 非空字符串 `label`（未设置 `aria-label` 时通过 `aria-labelledby`）→ 已翻译的 `@astryx.spinner.loading`（“Loading”）。空的 `aria-label` 或 `label`，以及在有 `label` 的同时提供调用方 `aria-labelledby`，都属于 AR1 缺口。
- **ORD2 — 变量取值。** `size:` 或 `shade:` 变体上的主题规则 → 基础 target 上的主题规则 → 组件按尺寸与按色彩变体的默认值。
- **ORD3 — 盒子尺寸。** 由解析出的直径与描边组合出的盒子尺寸 → 没有样式表声明时该尺寸的默认框架；两者都不让位于调用方 `style`。

### Performance and resources

- **PR1 — 挂载成本。** 挂载 Spinner 不会引发文档范围的样式重算，重复的模块求值不会失败，服务端渲染不做任何仅限浏览器的工作。
- **PR2 — 有界的相位计算。** 一起挂载的圆环只花一轮相位计算，已卸载的圆环永远不会被触碰。

## Accessibility contract

- **AR1 — 播报且具名的指示器。** 页面加载之后出现的独立 Spinner 通过共享通道播报，其元素不携带实时角色或 `aria-live`（`spec:AST-086` FR2、FR11）；处于忙碌所有者内部的 Spinner 保持静默（`spec:AST-086` FR8）。指示器按 ORD1 具有无障碍名称，可见的字符串标签绝不重复为 `aria-label`。指示器是不确定进度指示器：`role="progressbar"`，不带 `aria-valuenow`，按 ORD1 的顺序命名（可见字符串标签通过 `aria-labelledby`，绝不重复为 `aria-label`）（`spec:AST-020` FR15；OQ1，已决定）。组合的 Spinner 通过用 `aria-hidden` 隐藏来静默，CheckboxInput、Switch、Button 以及大多数 Core 组合组件与应用代码都这样做；Typeahead、BaseTypeahead 与 Tokenizer 保持其搜索指示器具名，通过内部、非导出的路径使其静默。调用方 `role` 若为 `progressbar` 以外的值，也让它保持静默，这是 `spec:AST-017` FR53 下的发布兼容性（见 Compatibility and migration）。没有公开 prop 能让它静默。实现缺口：`aria-label=""` 或 `label=""` 会让它留下空名称；而在有 `label` 时，调用方的 `aria-labelledby` 落在无角色的包装元素上，什么也没命名。

- **AR2 — 装饰性圆环。** 圆环为 `aria-hidden`。
- **AR3 — 已翻译的默认值。** 默认名称来自翻译目录，并跟随当前 locale。
- **AR4 — 减少动态效果。** 在 `prefers-reduced-motion: reduce` 下动态放慢并继续移动，因此圆环仍然读作工作中。

## Design relationships

| 结构或状态 | 设计要求                               | 表现权威       | 层级角色 | 组件契约          |
| ---------- | -------------------------------------- | -------------- | -------- | ----------------- |
| 圆环       | 轨道上移动的弧线表示不确定的工作。     | 当前源码       | 显著     | FR2–FR6、AR2、AR4 |
| 标签       | 可选的粗体文字或描述工作的调用方内容。 | 当前源码与文档 | 支撑     | FR1、FR7、AR1     |

主题化：承载 `spinner` target 的元素反映 `size` 与 `shade`，并声明这五个公开变量；圆环的圆读取它们。使用方解剖结构没有命名任何部分，因此不声明解剖结构主题化块。

## Family and system relationships

- `spec:AST-086` 负责状态播报的投递；AR1 记录 Spinner 如何满足 FR2 与 FR11，而组合的忙碌所有者在 FR8 下保持静默。
- `architecture:component-theming-surface` 负责 target 与变量的资格；FR6 记录 Spinner 在何处声明其变量。
- `architecture:internationalization` 负责默认名称所使用的目录。
- `architecture:public-component-api` 负责 ref、透传与样式输入规则；FR2 与 FR8 记录盒子尺寸对 `style` 优先级的例外。

## Verification map

| 契约          | 验证                                                                                        | 代表状态                                                                              | 变异或失败预期                                                                                                                                                                                                                                                                                                        | 审计章节                 |
| ------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| FR1, FR7, FR8 | `Spinner.test.tsx` 的渲染、标签与 data-testid 测试                                          | 无标签、字符串标签、富标签                                                            | 标签或 test id 丢失即失败。缺口：两种形式都没有测试断言哪个元素承载 ref、`xstyle` 与 `className`，也没有断言有标签形式中 target 落在哪里。                                                                                                                                                                            | `audit:Spinner/behavior` |
| FR2           | `Spinner.test.tsx` 的盒子尺寸测试组；`Spinner.stories.tsx` 的 NarrowFlexHost                | 每个尺寸；调用方 `style` 宽度；狭窄 flex 宿主                                         | 调用方宽度获胜，或回退框架丢失即失败。缺口：没有自动化检查会在盒子于 flex 宿主中收缩时失败；这一点只能在 story 中看到。                                                                                                                                                                                               | `audit:Spinner/layout`   |
| FR3, FR4, PR2 | `Spinner.test.tsx` 的圆环测试组，包括 135 度扫掠测试；`SpinnerMotion.a11y.chromium.spec.ts` | 轨道与转子结构、默认虚线偏移与弧线比例、帧调度；700 ms 主线程阻塞、一个周期、多个圆环 | 圆丢失、默认虚线偏移或弧线比例改变、多出一帧，或钉定未批处理即失败；在脚本运行期间停止、每帧绘制、以其他速率或方向转动、或相位漂移的圆环同样失败。缺口：起始角度测试只检查 SVG 上不存在 `transform` 属性，因此删掉 CSS 起始旋转也能通过；主题化的弧线比例，以及把已卸载圆环从待处理相位工作中移除，都没有自动化检查。 | `audit:Spinner/motion`   |
| FR5, FR6      | `Spinner.test.tsx` 的主题变量测试组                                                         | 尺寸、色彩变体与基础作用域的覆盖                                                      | 主题变量被输出到错误选择器即失败。缺口：如果组件在有标签 Spinner 的内部 span 上声明其默认值，没有测试会失败；而色彩变体测试只断言存在与反映，因此默认颜色与轨道不透明度没有自动化检查。                                                                                                                               | `audit:Spinner/theming`  |
| PR1           | `Spinner.test.tsx` 的注册测试组                                                             | 导入、重复求值                                                                        | 在挂载时执行该工作，或在第二次求值时抛错即失败。缺口：该测试组只在有 DOM 时运行，因此服务端安全没有自动化检查。                                                                                                                                                                                                       | `audit:Spinner/behavior` |
| AR1, AR3      | `Spinner.test.tsx` 的命名与本地化测试                                                       | 默认、显式、字符串与富标签                                                            | 名称缺失、字符串标签被重复为 `aria-label`，或默认值未翻译即失败。播报测试组覆盖每次出现只投递一次、页面加载时静默、Core 所有者内部静默，以及调用方 `aria-labelledby` 名称。缺口：没有测试覆盖空的 `aria-label` 或 `label`。                                                                                           | `audit:Spinner/a11y`     |
| AR4           | `SpinnerMotion.a11y.chromium.spec.ts` 的减少动态效果测试                                    | 减少动态效果                                                                          | 圆环停止，或以 3 秒周期以外的速率转动即失败。                                                                                                                                                                                                                                                                         | `audit:Spinner/motion`   |
| AR2           | 源码审查                                                                                    | 每个状态                                                                              | 缺口：如果轨道或转子丢失 `aria-hidden`，没有自动化检查会失败。                                                                                                                                                                                                                                                        | `audit:Spinner/a11y`     |
| AR1, AR2      | `StatusMessage.a11y.chromium.spec.ts` 的 Spinner 状态                                       | 已挂载的默认标签与可见字符串标签                                                      | 角色或名称改变会让无障碍树断言失败。缺口：富标签、空名称与隐藏圆环没有无障碍树检查；通道投递由 `Spinner.test.tsx` 的播报测试组检查。                                                                                                                                                                                  | `audit:Spinner/a11y`     |

## Decision log

- **OQ1 — 没有实时角色的独立 Spinner 的角色与名称。** 由 `spec:AST-020` FR15 决定：一个不确定进度指示器，`role="progressbar"`，不带 `aria-valuenow`，按 ORD1 的顺序命名。组合的指示器保持静默（`spec:AST-086` FR8）：多数 Core 组合组件与应用代码用 `aria-hidden` 隐藏它，三个搜索组合组件通过内部路径使其静默，调用方 `role` 为 `progressbar` 以外的值时作为发布兼容性保持静默（`spec:AST-017` FR53）；Spinner 不接受任何播报 prop。

## Open questions

没有未决问题。OQ1 已决定（见决策日志）。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
