---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-100
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [cixzhang]
affects_architecture: [architecture:interaction-modality]
affects_families: []
affects_contributing: []
affects_consumer_docs: []
---

# Release velocity system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/core/src/BottomSheet/**",
    "packages/core/src/Item/**",
    "packages/core/src/Toast/**",
    "packages/core/src/Swipe/**",
    "packages/core/src/motion/uikit/swipeActions.ts"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

当一个人轻扫一张 sheet、一个 toast、一行、一个页面或一个滚轮并抬起手指时，所有此类 Core 与 Lab 组件都从该动作读出相同的速度，如同 iOS 所做的那样，而一个在抬起之前就已停住的手指绝不计为轻扫。组件共享对一次轻扫的读取；每个组件按自己的阈值决定该速度起什么作用。一个释放过滤器定义了每个组件所读取的速度；组件只决定给定的速度对自身意味着什么。

## Non-goals

- 组件如何处理该速度：它的轻扫阈值、提交点、投影和落定曲线都留在组件自身及其记录中。
- 捏合缩放速度，以及由浏览器负责的滚动物理。
- 公共 API：速度来源、其过滤器取值以及所有阈值都保持内部（`spec:AST-002` FR3），例外是 `spec:AST-107` 的吸附点拖动（FR3）的公共 `flickThreshold`。
- 等价的内部实现只要满足本契约即仍然有效。

## Requirements

- **FR1 — 每种表面一个速度。** 每个读取指针手势速度的 Core 与 Lab 组件，都在每个物理轴上以 CSS 像素每秒报告该速度，且同类组件对同一接触动作报告相同的速度。被拖动的表面是 sheet 的拖动、toast 的滑动、行滑动、导航弹出和交互式消失；滚动表面是分页和滚轮选择器。`architecture:interaction-modality` INV10 规定 Core 中的来源，以及 Lab 组件如何与之保持一致。
- **FR2 — 移动的手指按 iOS 的方式读取；静止的手指永不轻扫。** 组件在接触抬起时读取的速度，就是 iOS 对同一动作报告的速度：被拖动表面取 pan 的速度，滚动表面取滚动视图的释放速度。当接触在抬起前静止的时间超过一个固定的静止间隔时，该速度为 0，这是它与 iOS 唯一的不同之处。同类每个组件读取相同的释放速度，没有任何组件读取其他估计值。静止间隔是一个内部调参值；速度如何计算由 `architecture:interaction-modality` INV10 规定。
- **FR3 — 阈值建立在唯一速度之上。** 组件的轻扫、甩动或提交阈值比较的是 FR2 的速度，可能还会结合组件自身负责的位移或投影。阈值是各组件的调参，保持内部（`spec:AST-002` FR3），例外是产品传给 `spec:AST-107` 吸附点拖动的公共 `flickThreshold`；组件绝不再推导第二个速度用于比较。
- **FR4 — 每个指针都按事件时间。** 速度依据输入事件自身的时间戳，因此晚执行的处理器不会改变它；同一动作在触摸、触控笔和鼠标指针下给出相同的速度。
- **FR5 — 方向跟随渲染方向。** 朝逻辑终点方向的轻扫在两个方向上都是朝逻辑终点移动（`design:bidirectionality` DR13）；组件根据渲染方向把物理速度映射到自己的逻辑轴（`architecture:internationalization` INV11）。

### Platform support

- 支持的特性/引擎下限：包所支持的浏览器（`spec:AST-013` FR1、FR3）；带事件时间戳的指针事件。
- 不支持的行为：移动样本少于两个的手势，其释放速度为 0。
- 浏览器证据：FR4 依赖浏览器为指针事件打上的时间戳，因此需要在 iOS 的 Safari 和 Android 的 Chrome 中取得真实浏览器证据（`spec:AST-013` FR10）；Verification 中的单元测试与组件测试证明 FR1–FR3 和 FR5，而每个组件的真机手感仍是该组件自己的证据。

## Current-state impact

- `main` 上 Core 中尚不存在速度来源。它首次落地即满足 FR1–FR5 和 `architecture:interaction-modality` INV10：iOS 的混合方式加上 FR2 的静止重置，且没有可选的替代过滤器。Lab 的手势按 INV10 所述与之保持一致。
- BottomSheet 的拖动用事件时间戳在其近期样本上以两点窗口估计速度。在 FR1 和 FR2 之下，它读取 tracker。
- Item 的行滑动比较的是用处理器时钟计时的、以像素每毫秒为单位的速度。在 FR1、FR2 和 FR4 之下，它读取以像素每秒为单位、基于事件时间戳的 tracker，并保留自己的阈值（FR3）。
- Toast 的滑动用挂钟时间对整个拖动过程的位移取平均。在 FR1、FR2 和 FR4 之下，它读取 tracker，并保留自己的阈值（FR3）。
- 之后读取手势速度的组件，例如分页、滚轮选择器、导航弹出或交互式消失，都从 tracker 读取。
- **稀疏移动流。** 过滤器把从按下到第一次移动的间隔与其他间隔同等对待，正如 UIKit 所做的那样。对于一次按下加三次移动，该间隔占滚动表面释放的 0.6。若某条流的第一次移动来得很晚、而后面的移动按节奏到达，读出的速度会更低。为那次移动打上不同时间戳的引擎，可能使同一次轻扫落在组件阈值的两侧。

## Verification

| Contract | Verification                                                                                             | Representative states                                                                              | Mutation or failure expectation                                                                           |
| -------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| FR1      | 把一条录制的样本流经两个不同组件读取，另加一项单元检查                                                   | 向 sheet 拖动和行滑动喂入同一条流；向 Lab 手势和 Core 手势喂入同一条流；在 x 与 y 方向上的匀速运动 | 同类两个组件对同一条流报告不同的速度，或单位不是像素每秒                                                  |
| FR2      | 通过组件对录制的 iOS 流做释放速度测试                                                                    | 录制的 pan 和滚动视图释放；抬起前的加速；抬起前长于静止间隔的停顿；单个样本                        | 释放与 iOS 对同一条流记录的速度不一致，或在静止停顿之后释放不为 0                                         |
| FR3      | 在每个阈值处的组件测试                                                                                   | 略低于和略高于组件阈值的轻扫；两个组件之间的相同速度                                               | 同类两个组件对同一次轻扫读出不同的速度，或可从公共 API 触达 `spec:AST-107` 的 `flickThreshold` 之外的阈值 |
| FR4      | 带处理器延迟和按指针区分的流的单元测试，另加 iOS 的 Safari 与 Android 的 Chrome 中的真实浏览器指针事件流 | 具有固定事件时间戳的延迟处理器；触摸、触控笔和鼠标流                                               | 速度随处理器延迟或指针类型变化                                                                            |
| FR5      | 两个方向上的组件测试                                                                                     | 在从左到右和从右到左中朝行内终点方向的轻扫                                                         | 在从右到左中把朝行内终点的轻扫当作相反动作                                                                |

首次移动来得很晚的三次移动轻扫在 WebKit 中只作参考信息，不是必需的行。WebKit 注入的触摸携带其到达时间，因此其释放可能落在组件阈值的任意一侧。

## Decision log

### DEC-1 — One release filter that reads as iOS does, with a stillness reset; thresholds stay per component

**引用：** `spec:AST-100/DEC-1`

**决策者：** `cixzhang`，`2026-10-24`

若每个组件各以自己的方式估计速度，同类组件对同一次轻扫就会读出不同的速度，并且会在某一处把抬起前停顿过的手指算作轻扫、在另一处却不算。一个释放过滤器，在 Core 中有一份来源、在 Lab 中没有副本，使同类每个组件对同一动作得到相同的速度。按 iOS 的方式读取移动的手指，能让轻扫、分页和消失都停留在 iPhone 所放的阈值附近；而静止重置阻止静止的手指产生甩动，这是过滤器唯一背离 iOS 的地方。速度意味着什么仍作为内部调参留在各组件，因此组件无需第二个估计器就能保持自己的手感。

已否决：固定时间窗口，它读出的快速轻扫比 iOS 快得多；没有静止重置的 iOS 混合方式，它会在停顿之后产生甩动；以及多个可选的估计器或按组件区分的过滤器，它们会重新引入本记录所消除的分歧。

### DEC-2 — Release velocity stays cadence-dependent

**引用：** `spec:AST-100/DEC-2`

**决策者：** Specs 一致性裁决，2026-11-08，应用 DEC-1

合并样本与按时间加权的间隔本可使释放速度与引擎交付的移动次数无关，但它们读出的快速轻扫比 iOS 更快，而 DEC-1 的理由已否决这一点；过滤器维持 DEC-1 所记录的样子，引擎之间的差异就是“稀疏移动流”这一缺口。

## Open questions

无。
