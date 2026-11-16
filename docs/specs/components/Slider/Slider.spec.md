---
schema_version: 3
template_version: 4
kind: component
id: component:Slider
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-14
owners: [cixzhang]
review_triggers: [theming]
verified_by:
  [
    packages/core/src/Slider/Slider.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: [design:reduced-motion, design:user-states]
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs:
  [
    spec:AST-017,
    spec:AST-017/FR60,
    spec:AST-020,
    spec:AST-020/FR9,
    spec:AST-085,
    spec:AST-094,
    spec:AST-094/FR9,
    spec:AST-094/FR41,
    spec:AST-094/FR42,
    spec:AST-094/FR43,
    spec:AST-094/FR45,
  ]
---

# Slider component contract

## Intent

Slider 提供一个带标签的控件，用于选择一个数值或有界范围。本契约记录其使用方解剖结构与主题化归属，包括为交互式控件表面新增的一个追加式目标。

## Compatibility and migration

- 已发布默认行为的保留：`no` —— FR5 改变了已发布的 `onChangeEnd` 载荷，FR7 改变了每种指针如何拖动滑块头以及带惯性滑行的拖动结束后 `onChangeEnd` 何时触发；其他所有已发布的默认行为均未改变
- 兼容性类别：追加式目标与状态反映；默认样式、DOM 语义和公共 props 保持不变，而 AR1 提到的那一项键盘改动——水平方向键在 RTL 下跟随轨道方向——作为行为修复发布
- `onChangeEnd` 载荷（FR5）：这是一项新的契约决策（`spec:AST-017/FR33`），而不是更正。已发布行为的受损场景：仅从 `onChangeEnd` 移动 `value`、没有 `onChange` 的 owner，如今可通过键盘移动值，而在 FR5 下不能，因此该改动是破坏性的（`spec:AST-017/FR1`），并在已声明的小版本中以 `[breaking]` 发布（`spec:AST-017/FR31`）。
- 指针跟踪与手指的惯性滑行（FR7）：依据 owner 在 2026-11-01 的裁定，作为补丁 `[fix]` 发布（“触摸时序：我不认为这些是破坏性改动。你能举出一个理想的场景吗？”）。没有任何理想的用法依赖已发布的拖动行为：按下滑块头就使值跳变是一种缺陷；缓慢拖动仍在抬起时结束，因为只有快速甩动才会惯性滑行；而 `onChangeEnd` 仍携带用户看到稳定下来的那个值（FR5）。发生变化的是触摸甩动时 `onChangeEnd` 的触发时机——在抬起约 0.6 s 后、待惯性滑行稳定时触发；在释放时采取行动的 owner 仍通过 `onChangeEnd` 这么做，并在惯性滑行结束后收到它。
- 鼠标或笔的甩动（FR7）：作为补丁 `[fix]` 发布，与手指的惯性滑行属于同一类别。它像手指一样惯性滑行，因此其 `onChangeEnd` 在释放约 0.6 s 后、待滑行稳定时触发；缓慢拖动仍在释放时结束（`spec:AST-094/DEC-26`）。
- 受控/非受控行为：未改变；Slider 仍为受控组件
- 迁移决策：仅从 `onChangeEnd` 移动 `value` 的 owner 改为从 `onChange` 移动（FR5）；需要在释放时（手指、鼠标或笔）获得值的 owner 改为读取最后一次 `onChange`，而不是等待 `onChangeEnd`（FR7）

使用方迁移说明属于使用方文档和发布说明。

## Ownership boundary

**拥有**

- 当前的 slider 行、背景轨道、填充范围、刻度线与标签、滑块头，以及相邻的文本值呈现。
- `slider`、`slider-control`、`slider-track` 和 `slider-thumb` 公共目标。

**不拥有 / 非目标**

- 标签与校验消息的呈现——由 `component:Field` 和 `component:FieldStatus` 拥有。
- 值提示框的呈现——由 `component:Tooltip` 拥有。
- 为填充范围、刻度线、刻度标签、描述或相邻文本值显示新增的公共目标。
- 关于当前目标不对称应保留还是移除的决策。

## Public concepts

本记录新增一个公共主题化目标，命名键盘模型（AR1），说明 `onChangeEnd` 携带哪个值以及何时携带（FR5），并说明指针如何拖动滑块头（FR7），而不新增或更改任何组件 prop 或值域。使用方的 props、模式、状态和用法仍记录在 `Slider.doc.mjs` 中。

## Behavioral and layout contract

| ID  | 候选不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 依据                            | 审查状态                         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | -------------------------------- |
| FR1 | 当前渲染在背景轨道之上放置一段填充范围、一个或两个滑块头，以及可选的刻度线。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码、文档与聚焦测试        | 已验证的当前行为；未决定新行为   |
| FR2 | `Slider`、`Interactive control`、`Track` 和 `Thumb` 分别携带 `slider`、`slider-control`、`slider-track` 和 `slider-thumb` 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码、公共文档与 DEC-1      | 已批准的追加式目标契约           |
| FR3 | 填充范围、刻度线、刻度标签和相邻文本值显示是稳定的渲染部件，但没有各自当前的 Slider 目标。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与公共文档              | 已验证的当前不对称；未批准为政策 |
| FR4 | 标签与状态呈现继续使用 Field 和 FieldStatus；值提示框继续使用 Tooltip。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 当前源码与聚焦测试              | 已验证的组合边界                 |
| FR5 | `onChangeEnd` 在一次交互结束时触发一次——指针拖动或轨道按压被释放或取消（释放之后，待其惯性滑行稳定；FR7），或键盘步进（方向键、Page、Home、End）完成——并携带 owner 在对该交互的 `onChange` 调用作出同步响应后渲染的值，包括任何钳制、吸附或拒绝；它绝不携带 Slider 发出而 owner 未渲染的值。范围值以同样方式报告两个值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 维护者决策（DEC-3）             | 已批准                           |
| FR6 | 当范围的两个滑块头共享同一个值时，指针按压会选取能够朝指针方向移动的那个滑块头：按在它们旁边的轨道上会选取其所在侧的滑块头；按在滑块头上或其共享值上（例如该值的刻度标签）时，在指针移动之前两个滑块头都不移动，一旦指针移动，首次移动的方向便选定滑块头，由它获得拖动的焦点、按下状态和值提示框。在此之前，上层滑块头（绘制在下层之上）持有这次按压及其焦点与按下状态，因此从未移动的按压不改变任何值，焦点留在上层滑块头上。起始于共享滑块头的拖动若回越它们的值，则移动另一个滑块头：被拖动的滑块头停在它前方，另一个则跟随指针，因此当两者都在 80 时，拖到 95 再回到 50，最终停在 [50, 80]。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | 当前源码与聚焦测试              | 已接受的契约                     |
| FR7 | 每种指针——手指、笔或鼠标——都按其移动距离拖动滑块头。按在滑块头上不改变值。一旦指针从其按下位置移动了 `spec:AST-094/FR19` 的 10 px——这是指针移动的距离，而不是滑块头周围的区域——值便按指针沿轨道的后续移动、以轨道长度为比例，从滑块头被抓取的位置起算移动，因此滑块头绝不会跳到指针处；每次移动都直接写入滑块头，不触发组件渲染（`spec:AST-094/FR9`）。在重合的范围滑块头之间，FR6 的首次移动就是越过 10 px 的那一次。手指或笔只沿轨道声明拖动，因此横向划过轨道会滚动页面；鼠标可在任意方向声明。在粗指针主输入下，水合之后（`spec:AST-094/FR13`），每个滑块头通过 48 px 触摸目标接收手指或笔，该目标朝范围另一滑块头扩展时仅扩展至间隙的一半（`spec:AST-094/FR42`），被按住的滑块头会在弹簧 `springs.sliderLift` 和 `springs.sliderDrop` 上抬起并回落，因为 Slider 的主要交互是手势（`spec:AST-094/FR45`）。手指或笔的拖动若将值带到任一端，会在浏览器能振动处播放 UISlider 的端点触感反馈，鼠标拖动则不播放；iOS Safari 在该时刻没有触感反馈（`spec:AST-094/FR23`）。任何指针（手指、笔或鼠标）释放之后，滑块头朝释放动量的投影的 0.4 处惯性滑行，并在 `springs.sliderRelease` 运动角色上稳定，约 0.6 s，滑行期间持续触发 `onChange`（`spec:AST-094/FR45`）；该角色是内部的，采用 UISlider 在 `tempo` 1 和 `'standard'` 下的测量值，并跟随主题的运动参数（`spec:AST-094/FR4`）。实现缺口：鼠标或笔的拖动在其释放时结束，没有惯性滑行。点击或单击轨道仍会设置值：手指的轻点在抬起时设置，鼠标按压则立即设置（即主点击落点）；次点击以及滚轮或触控板滚动不改变任何值（`spec:AST-094/FR43`）。在减弱运动下，滑块头不抬起，轻点的值立即生效，惯性滑行仍然继续（`design:reduced-motion/DR2`）。 | UIKit 测量与维护者决策（DEC-4） | 已批准                           |

### Observed current target asymmetry

ProgressBar 目前为其填充和标记暴露目标，而 Slider 为其根行、交互式控件、背景轨道和滑块头暴露目标，但不为其填充范围、刻度线、刻度标签或相邻文本值显示暴露目标。这是供联合审计使用的实现证据，而非对任一组件剩余目标形态的批准。

### Allowed variation

- 方向、单值或范围模式、禁用状态、值显示模式，以及所提供标记的数量或标签，仍是当前能力，而不是单独的目标名称。
- 描述、状态消息、刻度标签、文本值或值提示框可以缺失，而不改变其余解剖结构。

### Representative states

| 状态           | 必需不变式                                      | 允许的变化                       |
| -------------- | ----------------------------------------------- | -------------------------------- |
| 单值           | 一个滑块头和一段填充范围渲染在轨道之上。        | 方向、值、禁用状态、值显示       |
| 范围值         | 两个滑块头界定填充范围。                        | 值与最小步进间隔                 |
| 带标记         | 刻度线与可选刻度标签对齐到同一范围几何。        | 标记数量、值以及标签是否存在     |
| 带共享字段输出 | Field 或 Tooltip 渲染所请求的标签、反馈或值层。 | 描述、状态、禁用原因、提示框模式 |

### Transformation and precedence order

- ORD1：方向键或 Page 键的结果先吸附到最近的步进，再钳制到边界；Home 和 End 分别跳到 `min` 和 `max`（AR1）。
- ORD2：在一次交互内，Slider 调用 `onChange`（手指惯性滑行期间也持续调用，FR7），owner 作出响应并渲染，随后，待滑块头停止后，`onChangeEnd` 报告所渲染的值（FR5）。
- 解剖结构决策（DEC-1）不引入任何自己的值、吸附、几何、交互或样式优先级规则。

### Performance and resources

- 不引入新的性能或资源规则。

## Accessibility contract

解剖结构决策（DEC-1）不改变 Slider 的无障碍名称、值、范围滑块头命名、描述/状态关联、禁用行为或值提示框行为；AR1 记录键盘模型及其唯一一处更正。

- **AR1 — Slider 采用 APG Slider 模式**（`spec:AST-020/FR15`），每个滑块头是一个复合控件：每个滑块头都是 `role="slider"`，带有无障碍名称（范围模式为每个滑块头命名）、`aria-valuemin`、`aria-valuemax`、`aria-valuenow`、当格式化器改变朗读值时使用 `aria-valuetext`、`aria-orientation`，禁用时使用 `aria-disabled`；每个滑块头都是一个 Tab 停靠点，无论启用还是禁用（`spec:AST-085`）。ArrowUp 和 ArrowDown 按 `step` 步进；在水平轨道上，水平方向键跟随轨道方向——LTR 下 ArrowRight 增大、ArrowLeft 减小，RTL 下 ArrowLeft 增大、ArrowRight 减小；PageUp 和 PageDown 步进十步；Home 移到 `min`，End 移到 `max`。在范围模式中，滑块头绝不会越过另一个滑块头而突破最小间隔。

## Design relationships

| 解剖结构或状态      | 设计要求                                        | 呈现权威           | 层级角色 | 组件契约      |
| ------------------- | ----------------------------------------------- | ------------------ | -------- | ------------- |
| 标签与描述          | 标识并解释该数值设置。                          | 当前共享组件源码   | 支持性   | FR4           |
| Slider 与交互式控件 | 将外层行与指针/键盘表面及其复合禁用处理区分开。 | 当前源码与公共文档 | 突出     | FR1, FR2      |
| 轨道                | 在填充之后显示可用范围。                        | 当前源码与公共文档 | 突出     | FR1, FR2      |
| 填充范围与滑块头    | 在可用范围之上显示所选值或区间。                | 当前源码与公共文档 | 突出     | FR1, FR2, FR3 |
| 刻度线与标签        | 显示可选提供的刻度位置及其文本。                | 当前源码与公共文档 | 支持性   | FR1, FR3      |
| 值呈现              | 以文本或共享 Tooltip 显示格式化后的值。         | 当前源码与公共文档 | 支持性   | FR3, FR4      |
| 状态消息            | 在滑块下方呈现共享的校验反馈。                  | 当前共享组件源码   | 支持性   | FR4           |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Label": {
    "delegatesTo": {"owner": "component:Field", "target": "field-label"}
  },
  "Description": {
    "none": {
      "reason": "unsettled: No current public target reaches this part; future target ownership is undecided."
    }
  },
  "Slider": {"target": "slider"},
  "Interactive control": {"target": "slider-control"},
  "Track": {"target": "slider-track"},
  "Filled range": {
    "none": {
      "reason": "unsettled: No current public Slider target reaches this part; future target ownership is undecided."
    }
  },
  "Tick mark": {
    "none": {
      "reason": "unsettled: No current public Slider target reaches this part; future target ownership is undecided."
    }
  },
  "Mark label": {
    "none": {
      "reason": "unsettled: No current public Slider target reaches this part; future target ownership is undecided."
    }
  },
  "Thumb": {"target": "slider-thumb"},
  "Value display": {
    "none": {
      "reason": "unsettled: No current public Slider target reaches this part; future target ownership is undecided."
    }
  },
  "Value tooltip": {
    "delegatesTo": {"owner": "component:Tooltip", "target": "tooltip"}
  },
  "Status message": {
    "delegatesTo": {
      "owner": "component:FieldStatus",
      "target": "field-status"
    }
  }
}
```

`Interactive control` 命名指针/键盘命中表面，以及围绕轨条、填充、标记和滑块头的复合不透明度边界。`Filled range`、`Tick mark`、`Mark label` 和 `Value display` 仍是稳定的使用方解剖结构，但当前没有任何 Slider 目标到达它们。该映射记录这些缺口，但不将其缺失视为有意为之。`Value display` 命名相邻文本模式；单独列出的值提示框保留 Tooltip 的目标。

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格认定、事实性的 `none` 处置，以及保留组合关系的目标归属。
- Field、FieldStatus 和 Tooltip 在被 Slider 组合时保留其现有的公共目标契约。
- Slider 和 ProgressBar 都渲染轨道、填充段、定位指示器以及可选的值呈现，但它们当前的目标覆盖范围不同。该证据需要未来进行一次联合 family/审计；它不声明当前 family，不要求新增目标，也不授权运行时行为变更。

## Verification map

| 契约                | 验证                                                                                                                                                                                                                                                                                                                                                                       | 代表性状态                                                                                                                                                     | 变更或失败预期                                                                                                                                                         | 审计章节                     |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| FR1                 | `Slider.test.tsx` 的结构、范围与标记测试套件                                                                                                                                                                                                                                                                                                                               | 单值、范围、水平、垂直、标记                                                                                                                                   | 移除或错位稳定部件会破坏现有的角色、位置或标记断言。                                                                                                                   | `audit:Slider/anatomy`       |
| AR1                 | 绑定到 Slider 的 Slider 无障碍契约（`internal/a11y-spec`，待定）；禁用滑块头的 Tab 停靠点符合性待定；在 jsdom 和 Chromium 中；`Slider.test.tsx` 键盘套件，包括 "follows the mirrored track under RTL: ArrowLeft increases, ArrowRight decreases, Up/Down unchanged" 和 "keeps ArrowLeft decreasing on a vertical track under RTL"；契约下的 Page、Home/End 与 Up/Down 用例 | 单值与范围；水平 LTR 与 RTL；垂直；禁用；格式化值                                                                                                              | 滑块头丢失其角色、名称或值属性；方向键、Page、Home 或 End 键停止步进或沿镜像轨道反向步进；范围滑块头越过了另一个滑块头                                                 | `audit:Slider/accessibility` |
| FR2                 | `Slider.test.tsx`、`themingTargets.test.ts`、生成的探针主题以及 Chromium                                                                                                                                                                                                                                                                                                   | 根、水平/垂直控件、禁用控件、轨道和滑块头                                                                                                                      | 目标类/状态缺失、未记录，或被放置在其所属解剖结构之外。                                                                                                                | `audit:Slider/theming`       |
| FR3                 | 源码与使用方文档审查                                                                                                                                                                                                                                                                                                                                                       | 填充范围、标记、标签、相邻文本值                                                                                                                               | 缺失的目标被不准确地记录为存在，或被记录为有意永久缺失。                                                                                                               | `audit:Slider/theming`       |
| FR4                 | 源码检查；聚焦测试仅覆盖标签、状态和禁用原因提示框                                                                                                                                                                                                                                                                                                                         | 标签、状态、值提示框、禁用原因                                                                                                                                 | 共享组合或其无障碍关联消失；值提示框组合仍缺少聚焦覆盖。                                                                                                               | `audit:Slider/anatomy`       |
| FR5                 | 待定：由 owner 驱动、对发出的值进行渲染、钳制或拒绝的 `Slider.test.tsx` 变更结束用例（尚未加入套件）                                                                                                                                                                                                                                                                       | 单值与范围；owner 重新渲染前后的指针释放；每次键盘步进                                                                                                         | `onChangeEnd` 报告 owner 未渲染的值、每次交互触发多次，或跳过已完成的键盘步进                                                                                          | `audit:Slider/accessibility` |
| FR6                 | `Slider.test.tsx` 的重合范围滑块头用例                                                                                                                                                                                                                                                                                                                                     | 两个滑块头都在最小值、最大值和中间范围；两侧的轨道按压；向任一方向移动后的滑块头按压；在滑块头上以及其值的刻度标签上从未移动的按压；回越共享值的拖动；从右到左 | 在重合滑块头上的按压或拖动不移动任一滑块头、移动了无法朝指针方向行进的那个滑块头、把焦点、按下状态或提示框留在拖动已离开的滑块头上，或把从未移动的按压留在下层滑块头上 | `audit:Slider/anatomy`       |
| FR7                 | 在 Chromium 和 WebKit 中的 `Slider.test.tsx`、`useSliderTouch.test.tsx` 以及触摸与精细指针浏览器测试（`SliderTouch.interaction.browser.spec.ts`、`SliderFinePointer.interaction.browser.spec.ts`）                                                                                                                                                                         | 拖动、阈值、抓取偏移、惯性滑行、缓慢释放、轨道轻点与划动、鼠标单击、次点击、滚轮、靠近的范围滑块头、垂直、从右到左、减弱运动                                   | 滑块头跳到指针处、按压改变值、横向划动被劫持、拖动等待 owner 渲染、任一指针的轻甩释放没有惯性滑行，或 `onChangeEnd` 在任何指针的惯性滑行结束前触发                     | `audit:Slider/anatomy`       |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                              | 规范解剖结构与四个当前本地目标                                                                                                                                 | 缺失、多余、带前缀、过期或无人认领的映射会使仓库校验失败。                                                                                                             | `audit:Slider/theming`       |

聚焦的 Slider 套件断言 `slider-control` 目标的方向与禁用状态。源码/元数据守卫覆盖全部四个目标声明。该套件仅覆盖禁用原因提示框路径，而不覆盖 `valueDisplay="tooltip"` 组合；该解剖结构经源码检查，仍缺少聚焦测试覆盖。

## Decision log

### DEC-1 — Interactive control is public Slider anatomy

**Reference:** `component:Slider/DEC-1`

**Decider:** cixzhang, 2026-09-14

稳定的指针/键盘交互与合成表面是使用方可识别的部件，因此它携带 `slider-control`。`Thumb` 仍是独立的解剖结构，并继续携带 `slider-thumb`。这不会新增任何默认行为或样式改动。

### DEC-2 — Each thumb is an APG slider, and horizontal arrows follow the track

**Reference:** `component:Slider/DEC-2`

**Decider:** `cixzhang`, `2026-10-13`

滑块头已经作为一个复合控件扮演 slider 角色，因此它携带该模式的值属性及其完整键盘模型（AR1）。水平方向键跟随轨道的绘制方向，因为让滑块头逆其在屏幕上的移动方向行进的按键是缺陷，而不是惯例；垂直方向键与 Up/Down 没有方向性。

已否决：在 RTL 下仍将 ArrowRight 作为“增大”；为范围滑块头设置与单滑块头不同的 Tab 停靠点或方向键模型。

### DEC-3 — `onChangeEnd` reports the value the owner renders

**Reference:** `component:Slider/DEC-3`

**Decider:** `cixzhang`, `2026-10-16`

`onChangeEnd` 标记一次交互的结束，因此它报告的是交互结束时 Slider 所显示的值：所有者应答 `onChange` 之后的受控值。因此，钳制、吸附或拒绝某个值的所有者收到的就是它保留的那个值，提交的值与滑块一致（FR5）。

已否决：报告 Slider 通过 `onChange` 发出的最后一个值。

### DEC-4 — Every pointer tracks a thumb like UISlider

**Reference:** `component:Slider/DEC-4`

**Decider:** `cixzhang`, `2026-11-01`

会跳到指针位置的滑块，会在一次并非拖拽的按压中改变值；而单一跟踪模型让 Slider 的拖拽在每台设备上都相同，这正是 `spec:AST-017/DEC-25` 所允许的刻意一致性。手指会增加 UISlider 实测的目标、抬起与滑行；滑行只属于手指，而鼠标或触控笔的拖拽在其释放处结束，且 `onChangeEnd` 会等待滑行停止，因此报告的值就是屏幕上显示的那个值（FR5）。在轨道上轻点或点击会设置值，因此拖拽不是唯一的指针路径（WCAG 2.2 SC 2.5.7）。没有任何 prop 会恢复已释放的拖拽：在所有指针下跟踪方式都相同，而仅触屏的部分是本记录定义的仅触屏行为（`architecture:public-component-api/INV16`）。

已否决：让鼠标保留跳到指针的行为，那会让同一个 Slider 按设备拥有两种拖拽方式。

`spec:AST-094/DEC-26` 取代了本决策“滑行仅限手指”的规定：鼠标或触控笔的释放与手指一样会滑行。Slider 是手势组件，因此抬起与落下会播放弹簧动画：`springs.sliderLift` 与 `springs.sliderDrop`（`spec:AST-094` FR45）。

## Open questions

- **OQ1 — 在对 ProgressBar 与 Slider 进行联合家族审计之后，是否有任何共享的绘制部件应当具有一致的目标尺寸覆盖？**（`human-api`）

这个问题只记录审计需求。它并不预设任一组件应当增加、移除或重命名某个目标。

## Content boundary

本文件不重复使用方的 prop 表、示例、实现步骤、审计结果或共享组件契约。它链接到它们的所有者。
