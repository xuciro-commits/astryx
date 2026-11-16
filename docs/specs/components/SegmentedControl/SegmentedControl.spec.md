---
schema_version: 3
template_version: 7
kind: component
id: component:SegmentedControl
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers:
  [
    public-api,
    behavior,
    layout,
    interaction,
    motion,
    theming,
    styling,
    accessibility,
    visual,
    react-runtime,
    compatibility,
  ]
verified_by:
  [
    packages/core/src/SegmentedControl/SegmentedControl.test.tsx,
    packages/core/src/SegmentedControl/__tests__/SegmentedControl.interaction.browser.spec.ts,
    packages/core/src/SegmentedControl/useSegmentedSelectionMotion.test.ts,
    packages/core/src/SegmentedControl/useSegmentedTouchTracking.test.ts,
    packages/core/src/motion/uikit/segmented.test.ts,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.test.tsx,
    packages/core/src/RadioList/__tests__/RadioGroup.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs:
  [design:user-states, design:bidirectionality, design:reduced-motion]
architecture:
  [
    architecture:component-size-cascade,
    architecture:component-style-authoring,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs:
  [
    spec:AST-020,
    spec:AST-020/FR9,
    spec:AST-020/DEC-6,
    spec:AST-085,
    spec:AST-094,
    spec:AST-094/FR4,
    spec:AST-094/FR11,
    spec:AST-094/FR13,
    spec:AST-094/FR43,
    spec:AST-094/FR45,
  ]
---

# SegmentedControl component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 无变更。SegmentedControl 接收 `label`、`value`、`onChange`、`size`、`layout`、`isDisabled`、`disabledMessage`、基础 props，以及 SegmentedControlItem 子元素。                                                                                                                                                                                                                                                                                         |
| 行为          | 由 `label` 命名的 `role="radiogroup"`，只有一处 Tab 停留点；方向键、Home 与 End 在启用的分段之间移动焦点、循环，并选中它们落到的分段。从外部 Tab 进入从不改变值。每次选择变化都会让选中表面滑动，而从选中分段开始的拖拽会以任意指针携带它，直到抬起时提交。                                                                                                                                                                                           |
| 终端用户影响  | 用户通过一次点击或一次方向键按下就在少数几种模式之间切换，控件随其所在行收缩，做法是截断标签。禁用的控件仍保留一处 Tab 停留点。                                                                                                                                                                                                                                                                                                                       |
| 构建者影响    | 无。                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 兼容性/就绪度 | 记录已交付的行为；没有 API、默认值或 DOM 变更。拖拽现在在抬起时提交到最近的分段，而一次按压以前只在分段内点击时才选中；`onChange` 仍按每次提交触发一次，而在控件之外抬起会提交指针水平位置下方的分段（`spec:AST-020` DEC-6）。调用方的 `onFocus` 或 `onBlur` 可以取消内建的焦点行为，调用方处理器在禁用时仍会运行，调用方的 `aria-describedby` 会被丢弃；这些全部列在 Current-state impact 下。                                                       |
| 评审检查      | 否决以下情况：多于一处 Tab 停留点、Tab 进入时改变值、方向键落到禁用的分段、分段带标签时控件溢出其容器，或禁用状态下发生选择。                                                                                                                                                                                                                                                                                                                         |
| 管辖规则      | WAI-ARIA radio group 模式；`spec:AST-020` FR9、FR15、DEC-5、DEC-6；`architecture:interaction-modality` INV14；`spec:AST-094` FR4、FR11、FR13、FR43；`design:reduced-motion`；`spec:AST-085` FR1、FR2、FR5、FR7；`design:user-states` DR1–DR3（经由 SegmentedControlItem）；`design:bidirectionality` DR6；`architecture:component-size-cascade` INV3–INV5；`architecture:interaction-modality` INV1；`architecture:public-component-api` INV5、INV7。 |

本表是评审投影；下文正文才是权威。

## Intent

SegmentedControl 通过 SegmentedControlItem 子元素呈现一组互斥的选择。它拥有 radiogroup、其单一的 Tab 停留点与方向键选择、组的尺寸、布局与禁用状态，以及使用方主题解剖结构。使用方用法见 `SegmentedControl.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保留：`yes`；`size="md"`、`layout="hug"`，未禁用
- 兼容性类别：记录已交付的行为；没有公共 prop、默认值、导出或 DOM 变更
- 受控/非受控行为：受控；选择由 `value` 与 `onChange` 表示
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- radiogroup 控件及其当前 `segmented-control` 主题目标。
- 漫游 Tab 停留点、方向键、Home 与 End 导航，以及选择跟随焦点。
- 组尺寸、布局、禁用状态，以及禁用原因提示。
- 首次键盘焦点时显示的键盘提示。
- 使用方主题解剖结构，包括分段目标的映射。

**不拥有 / 非目标**

- 每个分段的单选语义、点击选择、标签与图标渲染、条目禁用状态以及绘制 —— 由 `component:SegmentedControlItem` 拥有。
- 通过条目的 `icon` prop 提供的图形 —— 由调用方拥有。
- 为选中状态单独设一个解剖部件或目标；选择是分段目标上的状态。
- 可见的控件级标签；控件必需的 `label` 是它的可访问名称，不作为视觉解剖结构渲染。
- 页面导航 —— 请使用 TabList；没有 SegmentedControl 的需求涵盖它。

## Public concepts

| 概念     | 封闭取值或状态     | 含义                                 | 按变体/方向/状态的可用性       | 默认值                | 拥有方                       | 稳定性 | 无效值行为                                                                                    |
| -------- | ------------------ | ------------------------------------ | ------------------------------ | --------------------- | ---------------------------- | ------ | --------------------------------------------------------------------------------------------- |
| Value    | string             | 所选分段的值。                       | 始终可用。                     | 必需                  | `component:SegmentedControl` | 稳定   | 没有任何分段携带的值不会选中任何东西；第一个未被自身 `isDisabled` 禁用的分段成为 Tab 停留点。 |
| Size     | `sm`、`md`、`lg`   | 分段的尺寸与文字大小。               | 始终可用。                     | 继承的尺寸，否则 `md` | `component:SegmentedControl` | 稳定   | TypeScript 拒绝其他值。                                                                       |
| Layout   | `hug`、`fill`      | 内容尺寸的控件，或全宽且各分段等分。 | 始终可用。                     | `hug`                 | `component:SegmentedControl` | 稳定   | TypeScript 拒绝其他值。                                                                       |
| Disabled | 关、开、带原因的开 | 阻止每个分段上的选择。               | 原因仅在 `isDisabled` 时适用。 | 关                    | `component:SegmentedControl` | 稳定   | 没有 `isDisabled` 的原因不渲染任何内容。                                                      |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 依据                                                                                                                                                                                                                                                            |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | radiogroup 容器携带当前 `segmented-control` 目标与 `data-size`，将 `aria-label` 设为 `label`，并渲染其提供的子元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 当前源码、文档与测试                                                                                                                                                                                                                                            |
| FR2  | 组是一处 Tab 停留点：选中的分段，或当值与任何分段都不匹配时，第一个未被自身 `isDisabled` 禁用的分段（在禁用组中，该分段保留停留点，FR7）；被禁用的选中分段 MUST 保留 Tab 停留点（`spec:AST-085` FR1）。ArrowLeft 与 ArrowRight 按视觉方向在启用的分段之间移动焦点，在从右到左布局中翻转（`design:bidirectionality` DR6），并循环；Home 与 End 跳到两端；ArrowUp 与 ArrowDown 不做任何事。禁用的分段被跳过。                                                                                                                                                                                                                  | WAI-ARIA radio group 模式；当前测试；`design:bidirectionality` DR6                                                                                                                                                                                              |
| FR3  | 当方向键、Home 或 End 导航将焦点移到某个启用的分段时，若该分段的值不同，则该值传给 `onChange`。一次轻点在抬起落在该分段上时通过该分段的点击选中；一次拖拽在抬起时提交到最接近指针的分段，包含其内边距与分段之间的间隙（FR13）；持续按住的指针按控件的中线计算，并夹取到其两端分段，因此在控件之外抬起仍会提交其水平位置下方的分段（`architecture:interaction-modality` INV14、`spec:AST-020` DEC-6）。只有取消不提交任何内容：浏览器接管指针（`pointercancel`，发生在一个系统手势或一次先认领触摸的页面滚动之后），或按 Escape。随后高亮立即回到选中的分段。焦点从外部进入组从不改变值。                                     | WAI-ARIA radio group 模式；当前测试；`spec:AST-020` FR9、DEC-6；`architecture:interaction-modality` INV14                                                                                                                                                       |
| FR4  | 调用方的 `onKeyDown` 在内建导航之前运行，并可通过 `preventDefault()` 取消它；调用方的 `onFocus` 在选择跟随焦点之前运行。首次键盘焦点时，一个指明方向键的提示出现在获得焦点的分段处，并保持到第一次方向键按下、Escape 或失焦；Escape 只关闭该提示（`family:overlay-dismissal`）。内建的焦点行为 MUST NOT 可被取消，除非公共 API 承诺如此（`architecture:public-component-api` INV7）。实现缺口：调用方 `onFocus` 若调用 `preventDefault()` 也会取消该提示、Tab 停留点同步与选择跟随焦点，而调用方 `onBlur` 若这样做会取消该提示的失焦关闭。                                                                                   | 当前源码与测试；`architecture:public-component-api` INV7                                                                                                                                                                                                        |
| FR5  | `hug` 使控件尺寸贴合其分段；当任一分段显示可见标签时，控件绝不超出其容器，带标签的分段收缩并截断。只有仅图标分段的控件保持其尺寸。`fill` 将控件拉伸到其容器，并给分段相等的份额，这些份额可以收缩并截断。                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前测试                                                                                                                                                                                                                                                        |
| FR6  | 尺寸由显式的 `size` 解析，其次是最接近的尺寸提供方，最后是 `md`，并传达到每个分段。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `architecture:component-size-cascade` INV3–INV5；当前源码                                                                                                                                                                                                       |
| FR7  | `isDisabled` 在 radiogroup 上设置 `aria-disabled`，禁用每个分段，将控件变暗到一半不透明度，并阻止选择。组在禁用时 MUST 保留一处 Tab 停留点，位置如 FR2，且指针事件保持开启（`spec:AST-085` FR1、FR7）。使用 `disabledMessage` 时，原因提示在悬停与键盘焦点时打开；该原因 MUST 描述可聚焦的分段（`spec:AST-085` FR5、FR7）。实现缺口：radiogroup 上的调用方处理器，例如 `onKeyDown`，在禁用时仍会运行（`spec:AST-085` FR2）。                                                                                                                                                                                                 | `spec:AST-085`；当前测试                                                                                                                                                                                                                                        |
| FR8  | radiogroup 拥有 `role`、`aria-label`（来自 `label`）、`aria-disabled` 与 `data-size`；调用方对其中任何一项的取值都会被替换。其他基础 props 到达 radiogroup，`ref` 也到达它。实现缺口：调用方的 `aria-describedby` 被替换，替换为禁用原因的 id 或什么都不替换，这违反 `architecture:public-component-api` INV5。                                                                                                                                                                                                                                                                                                              | `architecture:public-component-api` INV5；当前源码与测试                                                                                                                                                                                                        |
| FR9  | 在每种指针下，选择变化都会让选中表面作为一个表面从旧分段滑动到新分段，即 radiogroup 的 `::before`，只对 transform 与 opacity 做动画。在触摸呈现下，由轻点、点击、按键或程序触发的变化，都像拖拽释放一样从静止状态在同一弹簧上稳定下来：在触摸下，SegmentedControl 的主要交互是一种手势（`spec:AST-094` FR45）。在没有触摸呈现时，由点击、按键或程序触发的变会按主题的时长与缓动 token 滑动，如同释放的拖拽。拖拽的释放在该弹簧上从释放速度稳定下来（FR10、FR13）。                                                                                                                                                           | 拥有方方向；`spec:AST-094` FR13；当前源码与测试                                                                                                                                                                                                                 |
| FR10 | 拖拽的释放会在内部 `segmented.*` 运动角色上，使用 UIKit 的实测值稳定下来，在每种指针下都从释放速度开始，并由主题的 `character` 与 `tempo` 塑造弹簧（`spec:AST-094` FR4、FR45、DEC-15；阈值在 `spec:AST-002` FR3 下为内部）。在 Reduce Motion 下，旧表面在原地淡出，新表面淡入（`design:reduced-motion` DR1–DR3）。在 Reduce Motion 下使用精细指针时，主题的过渡呈现该变化。实现缺口：在鼠标或笔指针下，拖拽的释放按主题的时长滑动。                                                                                                                                                                                          | UIKit 实测（iOS 26.2）；`design:reduced-motion` DR1–DR3；当前测试                                                                                                                                                                                               |
| FR11 | 在手指下，持续按住的未选中分段在其部件上绘制按压叠加层，如同鼠标下那样（`design:user-states` DR1）；没有主题角色改变或调暗它。持续按住的选中分段则改为抬起选中表面（FR14）。                                                                                                                                                                                                                                                                                                                                                                                                                                                 | `design:user-states` DR1；当前测试                                                                                                                                                                                                                              |
| FR12 | 在选中表面拖拽期间，选中标签的颜色跟随该表面，并在每个边界附近有内部滞回；权重在抬起时改变。轻点通过浏览器的点击选中（`spec:AST-094` FR11）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 拥有方决策（权重在抬起时改变）；当前测试                                                                                                                                                                                                                        |
| FR13 | 在手指下，从选中分段开始的拖拽会随手指携带选中表面，允许越过两端分段的内部过冲，抬起时通过该分段的点击提交最接近手指的分段；从其他分段开始的拖拽会让表面留在原地，并在抬起处提交，正如菜单的按压跟踪滑动在抬起处提交（`spec:AST-094` FR26–FR28）。鼠标与笔以相同方式拖拽（`spec:AST-094` FR43）。在 Reduce Motion 下，表面仍作为直接移动跟随指针（`design:reduced-motion`），手指的释放会交叉淡化；在精细指针下，鼠标或笔的释放立即落定（DR3）。在控件之外抬起会提交指针水平位置下方的分段（FR3）。                                                                                                                          | `spec:AST-094` FR26–FR28、FR43；`design:reduced-motion`；当前测试                                                                                                                                                                                               |
| FR14 | 按压时，选中表面像 Switch 的滑块那样抬起（`component:Switch` FR13），其抬起的缩放与时间由 UISegmentedControl（iOS 26.2）实测；释放时它稳定回原位。抬起期间它携带主题的低海拔阴影，如同 Switch 抬起的滑块，使轨道在它周围仍可见。抬起跟随呈现方式，如同 Switch：在触摸呈现下，笔的按压像手指一样抬起，而在精细主指针下什么都不抬起。一次快速滑动遵循 UISegmentedControl 的实测规则：UIKit 不预测滑动，因此抬起提交最接近手指的分段，如 FR13 所述。在 Reduce Motion 下什么都不抬起，选择如 FR10 所述交叉淡化。`design:user-states` DR3 为与 Switch 的滑块抬起（`component:Switch` FR13）保持一致，声明了触摸呈现下的这种抬起。 | 规格决策，2026-11-02（选中表面抬起，以与 Switch 的滑块抬起保持一致）；UIKit 实测（iOS 26.2）：透镜在临界阻尼的 0.25 s 弹簧上增大 24 × 16 pt，并在其上稳定回原位；一次快速滑动的提交位置与慢速拖到同一点时相同；`component:Switch` FR13；`design:reduced-motion` |

### Allowed variation

- **AV1 — 分段。** 一个分段可以渲染其可见标签、一个图标加标签，或一个图标，而必需的标签提供可访问名称。
- **AV2 — 主题绘制。** 主题可以通过其目标与反射状态重新样式化控件与分段。

### Representative states

| 状态         | 必需的不变式                                                                  | 允许的变体 |
| ------------ | ----------------------------------------------------------------------------- | ---------- |
| Hug，带标签  | 内容尺寸；以容器为上限；标签截断。                                            | 尺寸。     |
| Fill         | 全宽；分段等分。                                                              | —          |
| 未匹配的值   | 第一个未被自身 `isDisabled` 禁用的分段是 Tab 停留点；Tab 进入不改变任何东西。 | —          |
| 禁用且带原因 | 选中分段可聚焦；原因提示；无选择。                                            | —          |
| 禁用，无原因 | 选中分段可聚焦；无选择。                                                      | —          |

### Transformation and precedence order

- **ORD1 — Keydown 与焦点。** 调用方 `onKeyDown`，然后是提示，然后（若未被阻止）导航；调用方 `onFocus`，然后是提示、Tab 停留点同步与选择跟随焦点（如今也会被阻止的 `onFocus` 取消，FR4 缺口）。
- **ORD2 — Tab 停留点。** 选中的分段；对于不匹配任何分段的值，是第一个未被自身 `isDisabled` 禁用的分段。被禁用的选中分段，或禁用控件中的分段，保留停留点（FR2、FR7）。

### Performance and resources

- **PR1 — 有界资源。** 每个控件在 radiogroup 上有一个漫游焦点处理器、一个提示，以及禁用原因提示的指针与焦点监听器，另外通过提示的层，还有共享手势计数器的 document 监听器，每页安装一次；分段共享按压控制器的 window 与 document 监听器。
- **PR2 — 触摸呈现不新增元素。** SegmentedControl 是一个重复控件，因此保持严格的元素预算（`architecture:component-style-authoring` INV7）：滑动使用 radiogroup 的 `::before`。

## Accessibility contract

- **AR1 — 组语义。** 由 `label` 命名的 `role="radiogroup"`；分段遵循 `component:SegmentedControlItem` AR1。
- **AR2 — 键盘。** FR2 与 FR3。
- **AR3 — 禁用原因。** FR7。

## Design relationships

| 解剖或状态 | 设计要求                             | 表示权威           | 层级角色   | 组件契约                             |
| ---------- | ------------------------------------ | ------------------ | ---------- | ------------------------------------ |
| Control    | 呈现当前的分组选择容器。             | 当前源码与公共文档 | Supporting | FR1、FR5                             |
| Segment    | 呈现一个互斥选择及其条目状态。       | 当前源码与公共文档 | Prominent  | `component:SegmentedControlItem` FR1 |
| Label      | 在未隐藏时以视觉方式标识一个分段。   | 当前源码与公共文档 | Prominent  | `component:SegmentedControlItem` FR3 |
| Icon       | 在分段内呈现可选的调用方提供的图形。 | 调用方提供的内容   | Supporting | `component:SegmentedControlItem` FR3 |

`design:user-states` 管辖分段的按压叠加层及其选中分段例外（`component:SegmentedControlItem` FR5），FR14 管辖持续按住的选中表面的抬起，`design:bidirectionality` DR6 管辖方向键方向（FR2）。选择是 Segment 的状态，而不是单独的解剖部件。使用方文档在 SegmentedControl 上声明了两个目标，因此下面的映射也覆盖分段部件。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Control": {"target": "segmented-control"},
  "Segment": {"target": "segmented-control-item"},
  "Label": {"inherits": "segmented-control-item"},
  "Icon": {"inherits": "segmented-control-item"}
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖结构资格、继承部件与目标上状态规则。
- `spec:AST-085` 拥有禁用可聚焦性、原因与回调；FR7 记录该缺口。
- `component:SegmentedControlItem` 拥有每个分段。

## Verification map

| 契约                | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 代表性状态                                                                                                          | 变更或失败预期                                                                                                                                                                                                                                                | 审计章节                               |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| FR1, AR1            | `SegmentedControl.test.tsx` 的渲染、尺寸与 data-testid 用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`（位于 `RadioList/__tests__`）中的 `segmented-group-*` 状态                                                                                                                                                                                                                                                                   | 含多个分段的控件；各种尺寸                                                                                          | 丢失组语义或名称，即失败。证据缺口：没有测试断言 `segmented-control` 目标或 `data-size`。                                                                                                                                                                     | `audit:SegmentedControl/anatomy`       |
| FR2, FR3, ORD2, AR2 | `SegmentedControl.test.tsx` 的键盘导航、不匹配值与 Tab 停靠点用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`（位于 `RadioList/__tests__`）中的 `segmented-group-*` 状态；无线组模式对 `segmented-option-unselected` 的中止按下检查，它通过返回当前选择来中止；`segmented-group-selected-rtl` 状态在 `dir="rtl"` 下的方向键往返；`SegmentedControl.interaction.browser.spec.ts` 中针对手指与鼠标的漂移、越过末端、取消与 Escape 用例 | 方向键、循环、Home、End；在选中项不匹配或为禁用状态时按 Tab 进入                                                    | Tab 进入时改变值、没有循环，或落在禁用分段上，即失败。漂移出控件而不选中任何项，或取消、Escape 之后仍然选中，即失败。焦点已在组内时按下，并在抬起之前就完成选中，即失败。                                                                                     | `audit:SegmentedControl/accessibility` |
| FR4, ORD1           | `SegmentedControl.test.tsx` 的容器处理器转发用例                                                                                                                                                                                                                                                                                                                                                                                                           | 调用方 `onKeyDown`，带与不带 `preventDefault`                                                                       | 调用方的按键处理器无法取消导航，即失败。证据缺口：没有测试断言调用方 `onFocus` 的顺序或键盘提示。                                                                                                                                                             | `audit:SegmentedControl/behavior`      |
| FR5                 | `SegmentedControl.test.tsx` 的布局用例                                                                                                                                                                                                                                                                                                                                                                                                                     | Hug、fill、窄行、仅图标                                                                                             | 控件溢出，或挤压仅图标分段，即失败。                                                                                                                                                                                                                          | `audit:SegmentedControl/layout`        |
| FR6                 | 证据缺口：没有测试断言尺寸优先级或其传播                                                                                                                                                                                                                                                                                                                                                                                                                   | —                                                                                                                   | —                                                                                                                                                                                                                                                             | `audit:SegmentedControl/layout`        |
| FR7, AR3            | `SegmentedControl.test.tsx` 的禁用与 disabledMessage 用例；`RadioGroup.a11y.test.tsx` 与 `RadioGroup.a11y.chromium.spec.ts`（位于 `RadioList/__tests__`）中的 `segmented-group-disabled` 与 `segmented-group-disabled-with-message` 状态                                                                                                                                                                                                                   | 组与项禁用；带原因                                                                                                  | 禁用状态下发生选中，或缺少原因提示浮层，即失败。证据缺口：没有测试断言半透明，或禁用时的调用方处理器。`segmented-group-disabled` 状态声明了一个 Tab 停靠点。                                                                                                  | `audit:SegmentedControl/accessibility` |
| FR8                 | `SegmentedControl.test.tsx` 的 role 覆盖与 data-testid 用例                                                                                                                                                                                                                                                                                                                                                                                                | 转发的 role                                                                                                         | 转发的属性覆盖了 role，即失败。证据缺口：没有测试断言 `ref` 或调用方的 `aria-describedby`。                                                                                                                                                                   | `audit:SegmentedControl/api`           |
| FR9, FR10, PR2      | `useSegmentedSelectionMotion.test.ts` 的滑动、重新定向、键盘、Reduce Motion 与精细指针用例；`SegmentedControl.interaction.browser.spec.ts` 在 Chromium 与 WebKit 中的滑动、实测弹簧、Reduce Motion、主线程繁忙与鼠标点击证明                                                                                                                                                                                                                               | 一次点击、一次重新定向、键盘选择、Reduce Motion、一次鼠标操作                                                       | 出现第二个表面或新增元素、每帧发生 Layout 或 Paint、触摸呈现下的滑动使用曲线而非从静止开始的选中弹簧、无触摸呈现时点击、按键或程序变更的滑动偏离主题曲线、任意指针下的拖拽释放从静止或按主题曲线收敛而非依其速度的弹簧、或在 Reduce Motion 下发生位移，均失败 | `audit:SegmentedControl/theming`       |
| FR11                | `SegmentedControl.interaction.browser.spec.ts` 的按下浮层证明；`PressedState.a11y.chromium.spec.ts` 的 segmented-control 用例                                                                                                                                                                                                                                                                                                                              | 按住未选中分段、按住已选中分段                                                                                      | 未选中分段缺少按下浮层，或在默认主题下变暗，即失败                                                                                                                                                                                                            | `audit:SegmentedControl/theming`       |
| FR12, FR13          | `useSegmentedSelectionMotion.test.ts` 与 `useSegmentedTouchTracking.test.ts` 的拖拽、表面与抬起用例；`SegmentedControl.interaction.browser.spec.ts` 的拖拽、过冲、迟滞、点击、漂移、Reduce Motion 拖拽、鼠标与手写笔证明                                                                                                                                                                                                                                   | 一次按住、一次拖拽、在分段之间释放、末端过冲、缓慢抖动、一次点击、从另一个分段开始的拖拽、漂移出控件、Reduce Motion | 拖拽中途字重变化、标签在轻微抖动中翻转两次、提交到非最靠近手指的分段、漂移出控件而不提交任何项、或表面在 Reduce Motion 下保持不动，均失败                                                                                                                     | `audit:SegmentedControl/anatomy`       |
| FR14                | `useSegmentedSelectionMotion.test.ts` 的抬起用例；`segmented.test.ts` 的抬起 role 与取值；`SegmentedControl.interaction.browser.spec.ts` 的抬起、笔抬起与抬起边缘证明                                                                                                                                                                                                                                                                                      | 触摸呈现下手指或手写笔按住已选中分段、从该分段开始的拖拽、页面先滚动的按下、鼠标按下、Reduce Motion                 | 表面未增大 24 × 16 px、抬起的表面没有边缘、在精细指针或 Reduce Motion 下抬起、或表面未回落到原位，均失败                                                                                                                                                      | `audit:SegmentedControl/theming`       |
| PR1                 | 证据缺口：没有测试断言全局监听器不存在                                                                                                                                                                                                                                                                                                                                                                                                                     | —                                                                                                                   | —                                                                                                                                                                                                                                                             | `audit:SegmentedControl/behavior`      |
| Target inventory    | `packages/core/src/theme/themingTargets.test.ts`                                                                                                                                                                                                                                                                                                                                                                                                           | 控件与项目标                                                                                                        | 已渲染的类不在文档记录的目标中，即失败。                                                                                                                                                                                                                      | `audit:SegmentedControl/theming`       |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                              | 规范解剖结构与两个当前目标                                                                                          | 缺失、多余、带前缀或过期的映射会使仓库校验失败。                                                                                                                                                                                                              | `audit:SegmentedControl/theming`       |

## Current-state impact

- **聚焦处理器取消（FR4）。** 调用方的 `onFocus` 或 `onBlur` 若调用 `preventDefault()`，会取消公共 API 并未承诺暴露的内建聚焦行为，违反 `architecture:public-component-api` INV7。
- **禁用状态下的调用方处理器（FR7）。** radiogroup 上的调用方处理器（如 `onKeyDown`）在禁用时仍会运行，违反 `spec:AST-085` FR2。
- **调用方描述（FR8）。** 控件上调用方的 `aria-describedby` 会被替换，违反 `architecture:public-component-api` INV5。

## Decision log

- **键盘模型（FR2）。** 键盘模型仅支持水平方向：ArrowLeft 与 ArrowRight 跳过禁用分段并选中它们到达的分段，ArrowUp 与 ArrowDown 不做任何事；水平移动遵循视觉方向（`design:bidirectionality` DR6）。`spec:AST-085` 将复合控件的方向键访问哪些项交由该复合控件决定。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表、示例、实现步骤或系统规则，而是链接到它们的归属处。
