---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-108
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
phase: accepted
owners: [cixzhang]
affects_architecture:
  [
    architecture:theme-tokens,
    architecture:theme-authoring-contract,
    architecture:theme-application,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: [motion, tokens, theme]
---

# Theme motion system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": ["packages/core/src/theme/**", "packages/core/src/motion/**"]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

主题用三个旋钮决定其动效有多快、多有活力，以及动效是否对所有人减弱。同一组旋钮驱动 CSS 动效 token 与动画器的弹簧和曲线，一起运行的动画一起开始、一起落定。每个按用途设定的动效值都保持内部。

## Non-goals

- 为主题提供按角色或按组件的动效设置。
- 放宽 Reduce Motion：任何选项都不会为已要求减弱动效的人关闭 `design:reduced-motion` DR1–DR4。
- 为主题动效值提供公开的解析器（OQ1）。

## Public contract

```ts
defineTheme({
  name: 'Brand',
  motion: {tempo: 1, character: 'standard', reducedMotion: 'system'},
});
```

## Requirements

- **FR1 — 三个动效旋钮。** `defineTheme` 的 `motion` 接受 `{tempo, character, reducedMotion}`：
  - `tempo` 是数字，默认 `1`，被钳制在 0.75–1.5；它缩放每个动效时长；
  - `character` 是 `'crisp'`、`'standard'`（默认）或 `'expressive'`；它挑选入场与移动曲线以及弹簧弹跳。不提供连续的弹跳。没有哪个 character 会把曲线变成弹簧，也没有哪个会播放由平台测量的曲线；哪些动效使用弹簧、哪些播放曲线 token，归 `spec:AST-094` FR45 管辖，而点按发起的展开与折叠，包括布局动画的 glide（`spec:AST-105` FR4），播放曲线 token；
  - `reducedMotion` 是 `'system'`（默认）或 `'always'`；`'always'` 为所有人应用 `design:reduced-motion` DR1–DR3，而 `'system'` 遵循每个人的设置。没有任何值会放宽 Reduce Motion。
- **FR2 — 旋钮生成 CSS 动效 token。** 主题的 `--duration-*` token 是其基础值乘以 `tempo`。`character` 只设置以用途命名的 `--ease-entrance` 与 `--ease-move` token，它们声明在 `tokens.stylex.ts` 中。`--ease-standard`（现有退出读取它）与 `--ease-exit`（其默认值为 `cubic-bezier(0.3, 0, 0.6, 0.6)`）在每个 character 下都相同，因此退出保持克制。当 `tempo` 为 1 且 `character` 为 `'standard'` 时，token 保持其已发布的值：`--duration-*` 为 130、175、230、310、410、550、730、975 和 1300 ms，`--ease-standard` 为 `cubic-bezier(0.24, 1, 0.4, 1)`；在 `'standard'` 下 `--ease-entrance` 与 `--ease-move` 等于 `--ease-standard`。`'crisp'` 与 `'expressive'` 下的曲线分别是仅减速的曲线与带轻微过冲的曲线。
- **FR3 — 动画器的表格源自同一组旋钮。** 动画器的基础表格，即 `spec:AST-094` FR4 中的每个角色，在其源头就由主题的 `tempo` 与 `character` 推导：弹簧的时长按 `tempo` 缩放，而 `character` 以某个量乘以该角色的固定权重来偏移角色的实测弹跳：`'standard'` 不增加任何偏移，`'crisp'` 与 `'expressive'` 分别将其下移和上移，因此权重为零的角色，例如退出、淡出或全屏移动，在每个 character 下都保持其实测弹跳。当 `tempo` 为 1 且 `character` 为 `'standard'` 时，每个角色都精确播放其度量值。弹簧保持其实测的物理特性，由 `tempo` 缩放并由 `character` 塑形；它不跟随作为其对应项的 CSS 时长或缓动。角色及其权重保持内部。
- **FR4a — 协同的动画共享同一个时钟。** 一起运行的动画一起开始、一起落定：它们播放同一个动效角色，或者 CSS 部分按弹簧的计算稳定时间计时，绝不作为两条独立计时的曲线。这涵盖一个元素与其周围滑动的兄弟元素（`spec:AST-105` 的单一共享时序）、一个元素的入场与其退出、一个 sheet 与其遮罩、一个菜单的展开与其内容，以及与 JavaScript 弹簧配对的 CSS 淡出，例如 MobileNav 的关闭按其计算时长计时，以及 BottomSheet 的遮罩，其淡出持续该 sheet 的计算稳定时间。当该部分还必须逐帧跟随弹簧时，正如遮罩在触控轻扫关闭时那样，它把弹簧的进度作为 CSS `linear()` 缓动。Core 的 `motion/linearEasing` 把该进度采样为 `linear()` 停靠点，每帧一个，供每个这样做的部分使用。动画器在脚本中步进弹簧，而 CSS 本身没有弹簧计时，因此没有现成模块能为 CSS 部分提供这些停靠点。
- **FR4 — 有些动效是刻意固定的。** `tempo` 与 `character` 不会改动以下内容：跟随手指与拖拽的动效、滚动惯性与衰减、橡皮筋效果、屏幕键盘的动效（`spec:AST-099` FR8）、按压模型的时钟（其起始延迟、取消距离与点按闪光）、悬停意图延迟、手势阈值（`spec:AST-002` FR3）、忙碌指示器（例如 Spinner 与 Skeleton）的循环周期——它们在 `tempo` 缩放之前读取其主题设定的时长，因此 `MotionScaleConfig` 仍然为它们计时——以及 200 ms 的 Reduce Motion 上限；`tempo` 可以缩短 Reduce Motion 的交叉淡入，但绝不会延长它。
- **FR5 — 现有动效配置继续可用。** `defineTheme` 的 `motion` 也接受现有的 `MotionScaleConfig`，`expandMotionScale` 与 `MotionScale*` 类型保持不变。`MotionScaleConfig` 继续生成其 CSS 时长 token，而它所隐含的 tempo 只驱动这些时长：除非主题自己设置 `tempo`，动画器的表格仍停留在 tempo 1，因此现有主题的渲染与之前完全一致，包括弹簧。显式的 `MotionScaleConfig` 字段与显式的 `tokens` 优先于 `tempo` 与 `character`，而扩展的主题逐字段继承：子主题未设置的 `MotionScaleConfig` 字段或旋钮保留其基础的值。适配规则可以像设置任何其他 `motion` 值一样设置 `tempo` 与 `character`（`spec:AST-012` FR4）；`reducedMotion` 设在主题本身上，因为其根标记没有条件形式。
- **FR6 — 服务端渲染得到相同的值。** 主题是纯数据，主题工具在服务端运行。`'system'` 不添加任何主题 CSS：组件样式已经把减弱动效键控在 `prefers-reduced-motion` 上，因此服务端从不猜测，水合时也不会闪烁。`'always'` 标记主题的根，而每个把减弱动效键控在 `prefers-reduced-motion` 上的组件样式也会键控该标记；动画器、每个在脚本中读取 `prefers-reduced-motion` 的地方（`matchMedia` 或 `useMediaQuery` 检查），以及每条以 `when: {motion}` 为键的适配规则（`spec:AST-012` FR2）都把该偏好视为已设置。该标记只做添加：祖先的 `'always'` 会深入每个嵌套主题，嵌套主题可以添加 `'always'`，但绝不会移除祖先的 `'always'`，因为没有什么能放宽 `design:reduced-motion` DR1–DR3（DR2a）。服务端与客户端从主题解析出相同的动效值，导入主题与动效模块不接触 DOM（`architecture:theme-authoring-contract`）。动画器只在客户端、动画开始时才读取个人的 Reduce Motion 设置。
- **FR7 — 文档随实现一起发布。** 动效、时长 token 与缓动 token 的文档、主题模板、主题编写指南，以及 `architecture:theme-authoring-contract`，都在实现落地之前描述这三个旋钮、固定清单与优先级顺序。

## Current-state impact

- `defineTheme` 的 `motion` 扩展为在现有 `MotionScaleConfig` 之外还接受三个旋钮；现有主题的渲染与之前完全一致。
- 在 `reducedMotion: 'always'` 发布之前，公开的 `motion` 类型没有 `reducedMotion` 字段，每个主题都遵循个人的设置，正如 `'system'` 那样（`architecture:theme-authoring-contract` 中记录了这一已知缺口）。
- Core 新增 `--ease-entrance`、`--ease-move` 与 `--ease-exit`，并为 `reducedMotion: 'always'` 新增一个主题根标记，每个把减弱动效键控在 `prefers-reduced-motion` 上的组件样式也会键控该标记；Carousel 的分页、BottomSheet 的面板与 sheet 手势、Item 的滑动释放、MobileNav、AppShell、Chat、Markdown 的流式揭示、BottomSheet 的键盘滚动，以及在脚本中读取该偏好的布局动画 glide，也都遵循它，以 `when: {motion}` 为键的适配规则同样如此（`spec:AST-012`）。
- `design:reduced-motion` 新增 DR2a：主题可以为所有人减弱动效。
- Spinner 与 Skeleton 在 `tempo` 缩放之前读取其循环时长（FR4），因此它们在每个现有主题下的时序都不变；`component:Spinner` FR3 与 `component:Skeleton` FR4 说明了这一点。
- BottomSheet 的 sheet 与遮罩共享 `--duration-medium`；当 sheet 停在 `springs.settle` 上时，其遮罩的淡出采用弹簧的稳定时间（FR4a）。
- `spec:AST-094` FR1、FR4 与 DEC-15，`design:reduced-motion` DR2a，`spec:AST-012` FR4（`reducedMotion` 仍归根所有），`architecture:theme-application` INV1（`'always'` 会传达到嵌套的 Provider），`architecture:theme-authoring-contract`（内部动效解析器），`component:Button` FR15（其释放淡出通过 `--duration-exit` 跟随 `tempo`，而 `--duration-exit` 引用一个按 tempo 缩放的时长），草案 `design:motion` DR3，以及 `spec:AST-090`，都作出相应修订。

## Verification

| 契约     | 验证                                          | 代表性状态                                                                                                                                                            | 变异或失败预期                                                                                                                                                                                       |
| -------- | --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1、FR2 | 针对生成的 CSS 的主题单元测试                 | 每个 `tempo` 边界值与 1；每个 `character`；`reducedMotion` 的两个值；不设 `motion`                                                                                    | token 偏离其公式、默认值下已发布的 token 发生变化、退出曲线发生变化，或值超出钳制范围，即失败                                                                                                        |
| FR3      | 测试 CSS token 与动画器的表格源自同一组旋钮值 | 每个角色在默认值下以及每个旋钮值下；一条设置 `tempo` 或 `character` 的适配规则                                                                                        | 角色在默认值下偏离其度量值、角色忽略它本应跟随的旋钮，或权重为 0 的角色其弹跳随 `character` 变化，即失败                                                                                             |
| FR4a     | 在每个旋钮值下对每组配对动画的浏览器测试      | 一个元素与滑动的兄弟元素、一个元素的入场与退出、一个 sheet 与其遮罩、一个菜单的展开与内容、CSS 淡出与弹簧                                                             | 配对的动画结束时间相差超过一帧，即失败                                                                                                                                                               |
| FR4      | 对每个固定项的单元测试                        | 手指跟踪、惯性、橡皮筋效果、键盘、按压与悬停时钟、循环、Reduce Motion 上限；每个 tempo 下的 Spinner 与 Skeleton 循环                                                  | 固定项随 `tempo` 或 `character` 变化，或交叉淡入超过 200 ms，即失败                                                                                                                                  |
| FR5      | 使用已发布配置的主题测试                      | 一个 `MotionScaleConfig` 主题、显式 token、一个扩展主题；一条设置 `tempo` 或 `character` 的适配规则                                                                   | 现有主题的输出发生变化，或旋钮压过显式字段，即失败                                                                                                                                                   |
| FR6      | 服务端渲染测试与导入检查                      | 在每种 `reducedMotion` 下的服务端渲染；导入主题与动效模块；个人设置为关闭时的 `'always'`，覆盖那些以 `prefers-reduced-motion` 为键的组件；`'always'` 主题下的嵌套主题 | 导入时或服务端发生 DOM 访问、为 `'system'` 输出主题 CSS、水合发生变化，或某个组件样式、脚本读取处、`when: {motion}` 规则在 `'always'` 下忽略根标记，或嵌套主题在祖先的 `'always'` 下恢复动效，即失败 |
| FR7      | 文档审查                                      | 每个列出的文档                                                                                                                                                        | 文档缺少旋钮、固定清单或优先级顺序，即失败                                                                                                                                                           |

## Decision log

### DEC-1 — A theme's motion is three knobs; per-role tables stay internal

**Reference:** `spec:AST-108/DEC-1`

**Decider:** `cixzhang`, `2026-10-26`

主题作者设定动效有多快、多有活力，以及是否为所有人减弱；很少有人想要按用途设定的值。三个 character 档位，而不是连续的弹跳，是随旋钮一并采纳的建议。三个旋钮用同一组值驱动 CSS token 与 JavaScript 弹簧，而按角色度量的值保持内部。这取代了 `spec:AST-094` DEC-11 的“全部内部”，范围正是这三个旋钮。

已否决：为每个动效组提供公开 token。

## Open questions

- **OQ1 — 主题的动效值是否要有公开的解析器。**（`human-design`）开放中。`resolveThemeMotion` 是内部的。
