---
schema_version: 3
template_version: 3
kind: component
id: component:Stepper
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-02
owners: [cixzhang]
review_triggers: [public-api, theming, layout]
verified_by:
  [
    packages/core/src/Stepper/Stepper.test.tsx,
    packages/core/src/Stepper/Stepper.public.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-002/DEC-1]
---

# Stepper component contract

## Intent

Stepper 呈现一条有序的步骤流程，以及在流程中已取得的进度。本契约记录其窄容器行为、解剖结构到目标的映射、公共语义自定义属性 `--step-connector-gap`，以及 Label 与 Description 的归属。

## Compatibility and migration

- 已发布的默认值保留：`yes` —— `horizontalOptions.minimumStepWidth` 仍默认为 `112`，`collapsedVariant` 仍默认为 `withLabelAndControls`
- 兼容性类别：相对 `0.5.3` 的破坏性 API 收窄。`minimumStepWidth` 现在只接受像素数值，`registerStep` 用可选的 options 对象替换其 disabled 布尔值，并且 `StepperContextValue` 不再命名步骤数量、紧凑状态、摘要 portal 或阈值测量细节
- 语义差异：CSS 长度折叠阈值 → 数值像素阈值；注册时传入的 disabled 快照 → 可选的 `getIsDisabled` 回调；context hook 的公共返回值 → 相同的状态、注册与转换历史，但不含紧凑布局的实现字段
- 审查分类：针对 FR14 与公共 context 边界，由 owner 批准的破坏性简化
- 受控/非受控行为：不适用
- 迁移决策：把 CSS 长度转换为它们预期的像素数值，将 `registerStep(index, isDisabled)` 替换为 `registerStep(index, {getIsDisabled})` 或省略该选项，并停止读取被移除的五个 context 字段

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- `stepper`、`stepper-frame`、`stepper-summary`、`step`、`step-bar`、`step-connector`、`step-indicator`、`step-label` 与 `step-description` 目标。
- 连接器的两个绘制层 —— 未填充的轨道（元素自身的 background）与强调色填充（绝对定位的 `::before`）—— 以及使两者都避开指示器的同一次裁剪。
- 轨道上的连接器由哪些片段绘制而成，以及由几段组成。
- 把 `horizontalOptions.minimumStepWidth` 读作像素数值，并据该阈值、Stepper 宽度与已注册步骤推导紧凑状态。
- Label 与 Description 的绘制，以及 FR9–FR11 所定义的目标归属。

**不拥有 / 非目标**

- 通过 `indicator` 提供的指示器图形 —— 归调用方所有。
- 步骤内容插槽与任何 `endContent` —— 归调用方所有。
- 某步骤是否完成：由 `activeStep` 推导，而非由调用方拥有的每步骤生命周期得出。
- 未被绘制的可点击内列。

## Public concepts

| 概念                                 | 封闭取值或状态                                     | 含义                                                                                              | 按变体/朝向/状态的可用性                                                         | 默认值                                               | 拥有者              | 稳定性 | 无效值行为                                                                             |
| ------------------------------------ | -------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------- | ------------------- | ------ | -------------------------------------------------------------------------------------- |
| `--step-connector-gap`               | 任意 CSS `<length-percentage>`                     | 轨道在朝向指示器的那一侧、距指示器还差多远停下                                                    | `indicatorPosition="on-track"`，两种朝向与两个书写方向，且仅在渲染指示器的步骤上 | `0px`                                                | `component:Stepper` | stable | 被钳制，从不拒绝：小于 `0` 的值解析为 `0`，大于 `--spacing-2` 的值封顶为 `--spacing-2` |
| `horizontalOptions.minimumStepWidth` | `number`                                           | 在 `horizontalOptions` 中必需；每步宽度（像素），低于该值时水平 Stepper 使用其紧凑呈现            | 水平朝向                                                                         | 省略 `horizontalOptions` 时为 `112`                  | 调用方              | stable | TypeScript 拒绝非数值；数值被解释为像素                                                |
| `useStepperContext` return           | `StepperContextValue`                              | 供后代内容使用的 Stepper 状态、转换历史与注册；不含步骤数量、紧凑状态、摘要 portal 与阈值测量细节 | `Stepper` 的后代                                                                 | 当前 provider 值                                     | 组件                | stable | 在 `Stepper` 之外抛出；TypeScript 与运行时省略不支持的布局协调字段                     |
| `horizontalOptions.collapsedVariant` | `withLabelAndControls \| withLabel \| hiddenLabel` | 在 `horizontalOptions` 中必需；紧凑模式是显示带导航控件的标签、仅显示标签，还是只显示裸进度轨道   | 紧凑水平朝向；控件需要 `withLabelAndControls` 与 `onStepClick`                   | 省略 `horizontalOptions` 时为 `withLabelAndControls` | 调用方              | stable | TypeScript 拒绝未知变体                                                                |

使用方语法与说明仍保留在 `Stepper.doc.mjs` 的 `theming.vars` 中。

## Behavioral and layout contract

| ID   | 候选不变式                                                                                                                                                                                                                                                                                                                                                                | 依据                                                                                                                  | 草案审查状态        |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------------- |
| FR1  | `--step-connector-gap` 在每个连接器消费它的位置回退为 `0px`，并遵循从祖先继承的值（直到最近的层内容边界），或通过 `stepper` 主题目标提供的值。                                                                                                                                                                                                                            | 已审查缺陷（PR #5495）                                                                                                | 已定案              |
| FR2  | 间隙被施加到每个段朝向指示器的那一条边上，并按轴镜像，使这一对在节点处留下一个居中的缺口。                                                                                                                                                                                                                                                                                | 当前源码与浏览器探测                                                                                                  | 已定案              |
| FR3  | 一次声明覆盖连接器的两个绘制层。段上的裁剪连同它的 `::before` 一起裁剪，且相对于同一个参考盒，因此两者不会不一致。                                                                                                                                                                                                                                                        | 当前源码与浏览器探测                                                                                                  | 已定案              |
| FR4  | 解析后的值在使用前被钳制为 `max(0px, min(value, --spacing-2))`。                                                                                                                                                                                                                                                                                                          | 已审查缺陷（PR #5495）                                                                                                | 已定案              |
| FR5  | 不渲染指示器的步骤（`indicator="none"`）不施加裁剪，使其轨道保持连续。                                                                                                                                                                                                                                                                                                    | 当前源码与浏览器探测                                                                                                  | 已定案              |
| FR6  | 任何被接受的取值都不改变 Stepper 的外部尺寸，无论哪种朝向。裁剪无法影响布局。                                                                                                                                                                                                                                                                                             | 当前源码与浏览器探测                                                                                                  | 已定案              |
| FR7  | 水平方向的裁剪在 `dir="rtl"` 下镜像，使缺口停留在指示器处，而不会移到步骤之间的接合处。                                                                                                                                                                                                                                                                                   | 已审查缺陷（PR #5495）                                                                                                | 已定案              |
| FR8  | 轨道上的连接器由哪些片段绘制而成不是公共的：不输出 `data-segment`，也不输出裸的 `lead`/`rail`/`content` 类名。                                                                                                                                                                                                                                                            | `component:Stepper/DEC-1`                                                                                             | 已定案              |
| FR9  | 在两种指示器位置下，每个渲染出的 Label 与 Description 都带有自己的目标，并反映 `progress` 与 `status`。                                                                                                                                                                                                                                                                   | 当前源码、文档与测试                                                                                                  | 已定案              |
| FR10 | 当 `isDisabled` 为真时，`step-label` 与 `step-indicator` 反映 `disabled`，因为两者都带有 disabled 绘制（`architecture:component-theming-surface` INV6）。`step` 与 Description 不获得该选择器。                                                                                                                                                                           | 与 `architecture:component-theming-surface` INV6 的一致性：指示器（`component:Step` FR6）与标签都带有 disabled 绘制。 | 已定案              |
| FR11 | Label 与 Description 各自声明 `font-size`、`line-height` 与 `color`。这些声明优先于从 `step` 继承的值，因此只有直接目标才能把该绘制暴露给主题。                                                                                                                                                                                                                           | 当前源码与 Chromium 探测                                                                                              | 已定案              |
| FR12 | 紧凑的水平摘要直接位于其轨道下方，没有额外的 frame 间隙。                                                                                                                                                                                                                                                                                                                 | 已审查的窄布局反馈                                                                                                    | 已定案              |
| FR13 | 在紧凑 `on-track` 下，指示器仍留在轨道上，且活动指示器不会在摘要标签旁重复出现；紧凑 `separated` 则在标签旁保留活动指示器。                                                                                                                                                                                                                                               | 已审查的窄布局反馈                                                                                                    | 已定案              |
| FR14 | `horizontalOptions.minimumStepWidth` 接受一个被解释为像素的数值。紧凑状态直接把已注册的每步宽度与该数值比较；不渲染阈值测量元素或观察器。                                                                                                                                                                                                                                 | 可折叠阈值配置                                                                                                        | 已定案              |
| FR15 | `horizontalOptions.collapsedVariant` 把仅水平方向的配置放在一起：`withLabelAndControls` 显示标签与控件，`withLabel` 只显示标签，而 `hiddenLabel` 只渲染裸进度轨道、不含紧凑行。                                                                                                                                                                                           | 折叠呈现的统一整理                                                                                                    | 提议交由 owner 审查 |
| FR16 | `useStepperContext` 保留 Stepper 状态、转换历史与 `registerStep`，同时从其 TypeScript 类型与运行时对象中省略 `stepCount`、`isCompact`、`summarySlot`、`minimumStepWidth` 与 `minStepWidthMeasureRef`。`registerStep(index, options?)` 接受可选的 `getIsDisabled` 回调以替代 disabled 布尔值，且紧凑导航在控件激活时再次读取该回调，使过时的渲染无法选中新近被禁用的步骤。 | 公共 context 边界                                                                                                     | 已定案              |

`status` 在 Label 与 Description 上是一个选择器接缝。它并不声称 Astryx 会按 status 绘制任一部分文本。

### Allowed variation

- **AV1 — 分段数量。** 绘制一个连接器跨度所用的元素数量可随朝向与内容插槽的有无而变化，而不构成回归。它不是公共的。
- **AV2 — 百分比解析。** 百分比相对于每个段自身的盒子解析，因此固定段与弹性段之间的缺口可能略有差异。任一段的两个层仍完全一致（FR3）。

### Representative states

| 状态                                                              | 必需的不变式       | 允许的变化 |
| ----------------------------------------------------------------- | ------------------ | ---------- |
| 垂直、on-track、指示器                                            | FR2, FR3, FR6      | AV1, AV2   |
| 水平、on-track、指示器                                            | FR2, FR3, FR6, FR7 | AV1, AV2   |
| `dir="rtl"`、水平                                                 | FR7                | AV1        |
| `indicator="none"`                                                | FR5                | —          |
| 低于 `0` 或高于上限的值                                           | FR4, FR6           | —          |
| 两种指示器位置；每种 progress/status；被禁用的 Indicator 与 Label | FR9–FR11           | —          |
| 紧凑水平摘要                                                      | FR12               | —          |
| 紧凑 `on-track` 与 `separated` 指示器                             | FR13               | —          |
| 自定义数值像素折叠阈值                                            | FR14               | —          |
| 公共 context 读取与内部布局协调                                   | FR16               | —          |
| 每种 `collapsedVariant`，带与不带 `onStepClick`                   | FR15               | —          |

### Transformation and precedence order

- **ORD1 — 间隙解析。** 读取继承的自定义属性 → 钳制为 `max(0px, min(value, --spacing-2))` → 作为一次 `clip-path: inset()` 施加到段上。钳制的两半都不可或缺，且都不是出于 padding 的理由：`inset()` **接受**负长度，而不是像 padding 那样钳制它，因此下界必须显式写出；上限则把过大的间隙约束到一条短轨道上。

### Performance and resources

- 水平 Stepper 实例把它们的列表注册到共享的 `ResizeObserver`。数值像素阈值直接比较，因此不需要第二个观察器或测量元素。

## Accessibility contract

紧凑布局保留有序列表角色与 `aria-current` 处理，同时把可选导航移到摘要控件上。

## Design relationships

| 解剖结构或状态  | 设计要求                                   | 表征权威           | 层级角色 | 组件契约 |
| --------------- | ------------------------------------------ | ------------------ | -------- | -------- |
| Stepper         | 在一个朝向与指示器放置上布置该流程。       | 当前源码与公共文档 | 支撑     | FR1      |
| Frame           | 用可选的紧凑摘要给有序步骤分组。           | 当前源码与公共文档 | 支撑     | —        |
| Compact summary | 在水平标签折叠时命名并控制当前步骤。       | 当前源码与公共文档 | 突出     | —        |
| Step            | 承载一个步骤的状态。                       | 当前源码与公共文档 | 支撑     | —        |
| Progress bar    | 以每步骤一条分段条的形式呈现进度。         | 当前源码与公共文档 | 突出     | —        |
| Connector       | 呈现指示器之间的轨道，以及沿其取得的进度。 | 当前源码与公共文档 | 突出     | FR2–FR7  |
| Indicator       | 呈现该步骤的位置或完成情况。               | 当前源码与公共文档 | 突出     | FR5      |
| Label           | 标识该步骤。                               | 当前源码与公共文档 | 突出     | FR9–FR11 |
| Description     | 在 Label 下方提供补充上下文。              | 当前源码与公共文档 | 支撑     | FR9–FR11 |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Stepper": {"target": "stepper"},
  "Frame": {"target": "stepper-frame"},
  "Compact summary": {"target": "stepper-summary"},
  "Step": {"target": "step"},
  "Progress bar": {"target": "step-bar"},
  "Connector": {"target": "step-connector"},
  "Indicator": {"target": "step-indicator"},
  "Label": {"target": "step-label"},
  "Description": {"target": "step-description"}
}
```

Connector 是一个解剖结构部件、一个目标，尽管 on-track 布局用最多三个元素来绘制它。这些片段是布局实现，而非语义部件，因此它们没有自己的目标 —— 见 `DEC-1`，这也是为什么由调用方拥有的间隙是一个自定义属性，而不是按片段的词汇表。

Label 与 Description 是由 Stepper 设置样式的本地 span，而不是委托的 `Text` 部件。它们自己的排版与颜色声明使 `inherits: step` 为假；`DEC-2` 记录了它们为何改为拥有直接目标。

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格、受保证属性目录，以及公共语义变量的准入规则。
- `architecture:public-component-api` 拥有这些变量还必须通过的 API 准入门槛。

## Verification map

| 契约                | 验证                                                                          | 代表性状态                                                                    | 变异或失败预期                                                                                                                  | 审计小节                |
| ------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| FR1                 | `Stepper.test.tsx` 回退与继承断言                                             | 垂直与水平 on-track                                                           | 在列表上声明默认值会阻断从其水平 frame 继承的值。                                                                               | `audit:Stepper/theming` |
| FR2, FR3            | `Stepper.test.tsx` 裁剪断言                                                   | 垂直与水平 on-track                                                           | 裁剪错误的边，或按层复制该值，都会使套件失败。                                                                                  | `audit:Stepper/theming` |
| FR4, FR6            | `Stepper.test.tsx` 钳制断言                                                   | 低于 `0` 与高于上限的值                                                       | 移除下界会让负 inset 通过；移除上限会使缺口无界。                                                                               | `audit:Stepper/theming` |
| FR5                 | `Stepper.test.tsx` 无指示器断言                                               | `indicator="none"`                                                            | 无条件施加裁剪会在没有节点的轨道上打出缺口。                                                                                    | `audit:Stepper/theming` |
| FR7                 | `Stepper.test.tsx` RTL 断言                                                   | `dir="rtl"`、水平                                                             | 去掉镜像会把缺口移到步骤之间的接合处；由该断言捕获。                                                                            | `audit:Stepper/theming` |
| FR8                 | `Stepper.test.tsx` 词汇守卫                                                   | 垂直 on-track                                                                 | 重新加入 `data-segment` 或裸的角色类名会使守卫失败。                                                                            | `audit:Stepper/theming` |
| FR9                 | `Stepper.test.tsx` 目标与生成主题断言                                         | 两种指示器位置；progress、status 与 disabled                                  | 移除某个目标或状态，或把它移出被绘制的 span，都会使聚焦测试失败。                                                               | `audit:Stepper/theming` |
| FR10                | `Stepper.test.tsx` 与 `Stepper.disabledTheming.test.tsx` 的 disabled 目标断言 | 紧凑 on-track、展开的水平与垂直布局中，且每种指示器类型下都有一个被禁用的步骤 | 一个被禁用步骤的 `step-indicator` 或 `step-label` 缺少 `disabled` 选择器，或它的 `step` 或 Description 带有该选择器，都会失败。 | `audit:Stepper/theming` |
| FR11                | 精确 head 的 Chromium 探测                                                    | 被主题化的 `step`、Label 与 Description                                       | 如果继承到达文本，Step 目标的探测颜色就会出现在那里。                                                                           | `audit:Stepper/theming` |
| FR12                | `Stepper.test.tsx` 紧凑 frame 间隙断言                                        | 紧凑水平摘要                                                                  | 恢复 frame 间距会把摘要与轨道分开，并使套件失败。                                                                               | `audit:Stepper/layout`  |
| FR13                | `Stepper.test.tsx` 紧凑指示器断言                                             | 紧凑 `separated` 与 `on-track`                                                | 重复 on-track 的活动指示器，或丢掉 separated 的那个，都会使套件失败。                                                           | `audit:Stepper/layout`  |
| FR14                | `Stepper.test.tsx` 阈值断言                                                   | 默认与自定义像素数值                                                          | 重新引入阈值测量或 CSS 长度支持会使运行时/类型守卫失败。                                                                        | `audit:Stepper/layout`  |
| FR15                | `Stepper.test.tsx` 折叠变体断言                                               | 三种变体，带与不带导航                                                        | 某个变体显示了未被请求的标签/控件，或改变了可访问顺序。                                                                         | `audit:Stepper/layout`  |
| FR16                | `Stepper.public.test.ts` 类型断言与 `Stepper.test.tsx` 运行时 key 断言        | 公共 hook/类型与分离的公共/内部 provider 值                                   | 某个具名的布局协调字段到达公共类型/运行时对象，或转换历史/注册消失。                                                            | `audit:Stepper/api`     |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                 | 规范解剖结构与九个当前目标                                                    | 某个目标没有解剖结构拥有者，或出现陈旧/多余部件，都会使仓库验证失败。                                                           | `audit:Stepper/theming` |

## Decision log

### DEC-1 — The connector gap is a public custom property, not a theme target per piece

**Reference:** `component:Stepper/DEC-1`

**Decider:** `cixzhang`、`2026-09-02`

可选的 Connector 解剖结构代表连通的、on-track 呈现；它与组件拥有的 Indicator 之间的内部间隙是稳定的组件职责。主题可能希望该轨道在指示器之前停下，而不是穿过它。两个其余方面完全相同的 Stepper 需要不同的解析结果，而只有主题知道是哪一个，因此该需求归调用方所有（`spec:AST-002/DEC-1` FR1）。Astryx 无法推导它：组件的状态、内容或布局中没有任何东西说明该设计想要断开的还是连续的轨道。

拥有目标上没有任何受保证的 CSS 属性可以表达它。连接器分两层绘制 —— 元素自身的 background（未填充的轨道）与位于 `inset: 0` 的 `::before`（强调色填充）—— 而主题目标只能触达元素。在 Chromium 中针对 `step-connector` 上已构建的主题覆盖实测，三个步骤，垂直：

- `paddingBlock: 6px` **完全不产生缺口**。元素的 background 绘制到它的边框盒，而填充是主题无法触达的伪元素，因此唯一可观察的效果是 Stepper 从 108px → 120px 变大。
- `paddingBlockEnd: 6px` 同样不产生缺口，而且无论如何只会作用于两条边中的一条：前导段以其远端边朝向节点，后随段以其近端边朝向节点。

只有组件才能把一次裁剪施加到段上并连同其伪元素一起裁剪、按轴与按书写方向镜像它，并先钳制该值。

已否决：把 `lead` / `rail` / `content` 暴露为公共分段词汇表（该改动的早期形式）。这些词从未出现在生成的文档中，它们输出了裸的 `lead` / `content` 类名，使用方样式表可能与之冲突，而且 `lead` 在不同朝向下表示不同的几何形状，因此选择它的主题无法知道自己会得到什么。

### DEC-2 — Label and Description own direct targets

**Reference:** `component:Stepper/DEC-2`

**Decider:** `cixzhang`、`2026-09-02`

FR9–FR11 定义了被准入的目标、状态选择器与继承证据。已否决的替代方案：`inherits: step` 通不过 FR11；`delegatesTo: component:Text` 描述的是 Stepper 并不渲染的组合；而 `step-row` 会为了推测性样式而暴露一个未绘制的包装器。

### Candidate DEC-3 — Horizontal behavior uses one options object

**Reference:** `component:Stepper/DEC-3`

**Status:** owner review requested

两个其余方面完全相同的水平 Stepper 可能需要不同的折叠点或紧凑内容：其中一个可能使用短的固定标签，而另一个使用更宽的本地化标签；一个外层流程可能拥有 Back/Continue 或步骤标题，而另一个依赖 Stepper。调用方拥有这些区分。现有的样式接缝无法选择紧凑的 React 呈现，因为折叠改变的是渲染出的标签、焦点目标、导航控件与保留内容，而不仅仅是绘制。

`horizontalOptions` 把这些仅水平方向的决策挡在 Stepper 顶层 API 之外。`minimumStepWidth` 命名调用方所保证的每步空间。它是像素数值，遵循其他 Astryx 尺寸 props，因此 Stepper 直接比较它，无需浏览器解析的探测或第二个观察器。`collapsedVariant` 是一个封闭选择，因为它的取值描述了完整的紧凑呈现，并避免相互冲突的布尔组合。

### DEC-4 — Public context excludes compact-layout implementation fields

**Reference:** `component:Stepper/DEC-4`

**Decider:** `imdreamrunner`、`2026-09-06`

`useStepperContext` 保留已有的 Stepper 状态与转换历史。它的 `registerStep` 契约用可选 options 对象替换 disabled 布尔值，其中的 `getIsDisabled` 回调让紧凑导航读取 Step 的当前状态。分离的公共 context 与包内部 context 使运行时边界与类型边界一致：公共 provider 恰好包含受支持的键，而内部 provider 为内建 `Step` 额外提供 `stepCount`、`isCompact` 与 `summarySlot`。随着仅像素阈值的实现，`minimumStepWidth` 与 `minStepWidthMeasureRef` 完全消失。

已否决：从 `useStepperContext()` 返回包内部 provider 值，仅用更窄的 TypeScript 返回类型。JavaScript 仍可读取被移除的字段，使运行时 API 与公共契约相矛盾。

## Open questions

- 由 owner 审查 FR15 与 `horizontalOptions.collapsedVariant` 公共 API 准入论证。

## Content boundary

本文件不重复使用方 props 表、示例、实现步骤或系统规则。它链接到它们的拥有者。
