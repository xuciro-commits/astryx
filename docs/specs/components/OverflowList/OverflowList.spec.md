---
schema_version: 3
template_version: 7
kind: component
id: component:OverflowList
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/OverflowList/OverflowList.test.tsx,
    packages/core/src/hooks/useOverflow.test.ts,
    packages/core/src/hooks/computeOverflow.test.ts,
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: []
architecture:
  [architecture:component-theming-surface, architecture:public-component-api]
contributing: []
system_specs: []
---

# OverflowList component contract

## Contract at a glance

| 方面            | 契约                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | `children`、`overflowRenderer`、`onOverflowChange`、`gap`、`minVisibleItems`、`maxVisibleItems`、`maxRows`、`collapseFrom`、`behavior`、根 `BaseProps`、`ref`。                                                                                                                                                                                           |
| 行为            | 按测得的宽度、行数与数量上限，显示尽可能多的调用方条目，并把其余条目交给由调用方渲染的指示器与回调。                                                                                                                                                                                                                                                      |
| 终端用户影响    | 用户看到一行（或几行）整齐的条目，放不下的条目由一个调用方的“更多”控件代表。                                                                                                                                                                                                                                                                              |
| 构建者影响      | 在绘制前折叠列表的尺寸变化，在该帧内若另一个观察器在观察外层元素（Storybook 的预览会观察 `<body>`），可能使 Chromium 报告一次 “ResizeObserver loop completed with undelivered notifications”；没有通知丢失，错误监控应忽略该消息。（PR1）触发被模拟的 ResizeObserver 回调的测试，应先等待更新再同步断言，例如使用 `await act(async () => { … })`（PR1）。 |
| 兼容性/就绪状态 | 已发布行为按当前状态记录；无 API、默认值或输出变更。                                                                                                                                                                                                                                                                                                      |
| 审查检查项      | 拒绝以下情况：测量副本被暴露或可聚焦、指示器位于错误的边缘、回调在测量前触发或重复未变化的集合。                                                                                                                                                                                                                                                          |
| 管辖规则        | `architecture:component-theming-surface`；`architecture:public-component-api` INV5–INV8。                                                                                                                                                                                                                                                                 |

本表是审查投影；下方正文具有权威性。

## Intent

OverflowList 在可见列表中渲染调用方所提供条目的一个测量子集，并让调用方展示被折叠的其余部分。它拥有测量与可见条目的选择；调用方拥有条目与指示器。

使用方语法与示例属于 `OverflowList.doc.mjs`。

## Compatibility and migration

- 已发布的默认值保持不变：`yes` —— `gap` 为 2、单行、从末端折叠、观察自身、无数量上限。
- 兼容类别：记录已发布行为；无公共 prop、默认值、DOM、目标或样式输出变更。
- 受控/非受控行为：不适用；可见计数是测量得出的。
- 迁移决策：仅测试时序：触发被模拟 ResizeObserver 回调的测试先等待更新再断言；无 API 变更。

使用方迁移说明属于使用方文档与发行说明。

## Ownership boundary

**拥有**

- 可见列表容器及其 `overflow-list` 目标。
- 隐藏的测量副本、测量可用空间、应用数量与行限制，以及选择哪些条目保持可见。
- 溢出回调何时触发。

**不拥有 / 非目标**

- 通过 `children` 提供的条目——由调用方拥有。
- `overflowRenderer` 返回的指示器，以及它打开的任何菜单——由调用方拥有。

## Public concepts

| 概念     | 封闭取值或状态                         | 含义                                       | 按变体/方向/状态的可用性 | 默认值        | 所有者                   | 稳定性 | 无效值行为                 |
| -------- | -------------------------------------- | ------------------------------------------ | ------------------------ | ------------- | ------------------------ | ------ | -------------------------- |
| 折叠边缘 | `start`；`end`                         | 哪一端先失去条目并承载指示器。             | 始终                     | `end`         | `component:OverflowList` | 稳定   | 封闭联合类型；由类型拒绝。 |
| 间距     | 间距步进                               | 条目与指示器之间的间距。                   | 始终                     | 2             | `component:OverflowList` | 稳定   | 封闭联合类型；由类型拒绝。 |
| 数量上限 | `minVisibleItems`；`maxVisibleItems`   | 可见条目的下限与上限。                     | 始终                     | 0；无上限     | `component:OverflowList` | 稳定   | 下限优先于更小的上限。     |
| 行数     | 正数；未设置                           | 可以显示多少换行行。                       | 始终                     | 单行          | `component:OverflowList` | 稳定   | 1 或未设置为单行。         |
| 测量盒   | `observeSelf`；`observeParent`         | 列表测量自身宽度还是父元素的宽度。         | 始终                     | `observeSelf` | `component:OverflowList` | 稳定   | 封闭联合类型；由类型拒绝。 |
| 溢出输出 | `overflowRenderer`；`onOverflowChange` | 为折叠条目提供指示器；以折叠集合调用回调。 | 可选                     | 无            | 调用方                   | 稳定   | —                          |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                   | 依据                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | OverflowList 渲染每个条目的隐藏测量副本，以及为全部条目渲染的指示器，还有一个携带 `overflow-list` 目标的可见容器。该副本为 `aria-hidden`、`inert`、不可见、零高度，且不接收指针输入，因此既不会被读取，也不会被聚焦或点击。                                                                                                              | 当前源码与测试                                                |
| FR2 | 一旦完成测量，可见容器显示能容纳进测得宽度（自身宽度，或在 `observeParent` 下为其父元素的宽度）的条目，至少 `minVisibleItems` 条、至多 `maxVisibleItems` 条，其中下限优先于更小的上限。测量之前（包括服务端渲染），它显示全部条目且不显示指示器。`collapseFrom="end"` 时保留靠前的条目；`start` 时保留靠后的条目。条目按调用方顺序渲染。 | 当前源码与测试                                                |
| FR3 | 条目折叠时，`overflowRenderer` 为折叠条目返回的指示器在 `end` 下渲染于可见条目之后，在 `start` 下渲染于其之前；没有渲染器时，折叠条目被丢弃且不渲染指示器。                                                                                                                                                                              | 当前源码与测试                                                |
| FR4 | 单行是不换行的 flex 行，会裁剪溢出内容。`maxRows` 大于 1 时条目换行，并把容器的高度限制为该数量的测得行加上间距。`gap` 设置条目之间的间距。在 `observeParent` 下且有条目折叠时，容器填满其父元素的宽度。                                                                                                                                 | 当前源码与测试                                                |
| FR5 | `onOverflowChange` 在当前内容测量完成后接收折叠条目（按原始索引）：挂载时若存在溢出则触发一次，之后仅在折叠集合的成员或顺序发生变化时触发（包括变回空）；在没有溢出时从不触发，卸载后也从不触发。                                                                                                                                        | 当前源码与测试                                                |
| FR6 | `ref`、DOM、data、ARIA 与事件属性，以及 `xstyle`、`className` 和 `style` 会抵达可见容器或在其上组合。                                                                                                                                                                                                                                    | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 内容。** 条目与指示器的内容可以变化，而不会成为 OverflowList 拥有的目标。

### Representative states

| 状态     | 必需不变式                                          | 允许的变化   |
| -------- | --------------------------------------------------- | ------------ |
| 全部容纳 | 每个条目，无指示器，无回调。                        | 间距。       |
| 末端折叠 | 靠前的条目；指示器位于其后。                        | 指示器内容。 |
| 起始折叠 | 靠后的条目；指示器位于其前。                        | 指示器内容。 |
| 受限     | 测量完成后至多 `maxVisibleItems` 条，除非下限更大。 | —            |
| 测量前   | 每个条目；无指示器。                                | 服务端渲染。 |
| 多行     | 换行条目位于 `maxRows` 行之内。                     | 行数。       |

### Transformation and precedence order

- **ORD1 — 可见计数。** 测量前为每个条目；测量后依次为测得适配 → 至多 `maxVisibleItems` → 至少 `minVisibleItems`。
- **ORD2 — 上报。** 先测量当前内容；仅上报发生变化的折叠集合。

### Performance and resources

- **PR1 — 测量。** OverflowList 观察测量盒的尺寸，在隐藏副本中渲染每个条目，并在列表中再次渲染可见条目，在测量完成后、帧绘制前上报折叠集合。例外：若一次尺寸变化产生的新折叠集合可能改变列表自身的高度（其最高的子元素，包括指示器在内；或多行列表填充的行数；或多行列表测得的行高），在 `observeParent` 下显示或隐藏指示器且列表的父元素填充随之变化（FR4），或其观察盒的尺寸由列表条目决定（位于某个 flex 项中的列表，其尺寸来自内容，且旁边有可收缩的兄弟元素），则该集合推迟一帧应用，因为在那里于绘制前折叠会使 Chromium 报告 ResizeObserver 循环错误；这种情况下的可见计数变化晚一帧绘制（当前状态）。
- 当前状态：一次尺寸变化，若其新的折叠集合可能改变列表自身的高度（包括多行列表测得的行高）、在 `observeParent` 下显示或隐藏指示器、或改变一个观察盒尺寸由条目决定的列表，则会先绘制上一可见集合一帧，然后再绘制新的集合。
- 已知影响：在绘制前折叠列表，在该帧内若另一个观察器在观察外层元素（Storybook 的预览会观察 `<body>`），可能使 Chromium 报告一次 “ResizeObserver loop completed with undelivered notifications”；没有通知丢失，错误监控应忽略该消息。

## Accessibility contract

- **AR1 — 一份可读副本。** 只有可见容器中的条目会抵达辅助技术与键盘焦点；测量副本被隐藏且为惰性（FR1）。
- **AR2 — 折叠条目由调用方拥有的访问方式。** 折叠条目离开可见列表；调用方的指示器是抵达它们的方式，其语义归调用方所有。

## Design relationships

| 解剖或状态 | 设计要求                                         | 表示权威         | 层级角色     | 组件契约 |
| ---------- | ------------------------------------------------ | ---------------- | ------------ | -------- |
| 列表       | 可见的列表容器。                                 | 当前源码与文档   | 支撑性       | FR1, FR4 |
| 条目       | 由宽度、行数与数量上限选出用于显示的调用方条目。 | 调用方提供的内容 | 视上下文而定 | FR2      |
| 溢出指示器 | 对折叠条目的调用方渲染访问入口，或其数量。       | 调用方提供的内容 | 视上下文而定 | FR3      |

隐藏的测量副本是实现结构，不是使用方解剖。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "List": {"target": "overflow-list"},
  "Items": {
    "none": {
      "reason": "intentional: Caller-supplied items retain their own theming ownership; OverflowList applies no target to them."
    }
  },
  "Overflow indicator": {
    "none": {
      "reason": "intentional: The caller-rendered overflow indicator retains its own theming ownership; OverflowList applies no target to it."
    }
  }
}
```

## Family and system relationships

- `architecture:component-theming-surface` 拥有解剖资格以及对调用方内容的 `none` 处置。
- `architecture:public-component-api` 拥有调用方输入路由；FR6 应用它。

## Verification map

| 契约         | 验证                                                                                                                                                                                                          | 代表状态                                                                                                                                                                                                                                                                                                                                                                                                                 | 变更或失败预期                                                                                                                                                                                                                                   | 审计章节                      |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------- |
| FR1, AR1     | `OverflowList.test.tsx` 的测量容器与渲染契约测试                                                                                                                                                              | 隐藏副本；指示器针对全部条目测量；可见类                                                                                                                                                                                                                                                                                                                                                                                 | 测量副本未设置 `aria-hidden` 和 `inert`、指示器针对更少的条目测量、或目标不在可见容器上，都会失败。                                                                                                                                              | `audit:OverflowList/theming`  |
| FR2, ORD1    | `OverflowList.test.tsx` 的适配、溢出、`minVisibleItems` 与上限测试；`useOverflow.test.ts`（含 `observeParent`）；`computeOverflow.test.ts`；稳定的视觉基线 `core-overflowlist--default`（中性主题与探针主题） | 全部容纳；末端与起始；下限；上限；下限高于上限                                                                                                                                                                                                                                                                                                                                                                           | 可见条目错误、低于下限时条目过少、高于上限时条目过多、或上限压过下限，都会失败；默认行发生变更时，会以变更形式返回以供审查。                                                                                                                     | `audit:OverflowList/behavior` |
| FR3          | `OverflowList.test.tsx` 的指示器位置与无渲染器测试                                                                                                                                                            | 末端；起始；无渲染器                                                                                                                                                                                                                                                                                                                                                                                                     | 指示器位于错误一侧，或没有渲染器却渲染了指示器，都会失败。                                                                                                                                                                                       | `audit:OverflowList/anatomy`  |
| FR4          | `OverflowList.test.tsx` 的间距与 `maxRows` 测试                                                                                                                                                               | 间距变更；`maxRows` 为 2 与 1                                                                                                                                                                                                                                                                                                                                                                                            | 新的间距或换行没有引起类变更，或在 `maxRows={1}` 时换行，都会失败。缺口：行高限制与 `observeParent` 填充没有检查。                                                                                                                               | `audit:OverflowList/layout`   |
| FR5, ORD2    | `OverflowList.test.tsx` 的 `onOverflowChange` 套件                                                                                                                                                            | 静默容纳；挂载；原始索引；变回空；未变化；重排；内容变更；数量变更；回调替换；状态更新；卸载；起始                                                                                                                                                                                                                                                                                                                       | 回调在没有溢出时触发、重复未变化的集合、遗漏变更、上报未测量的内容、因状态更新而循环、或在卸载后触发，都会失败。                                                                                                                                 | `audit:OverflowList/behavior` |
| FR6          | `OverflowList.test.tsx` 的 ref 与透传测试                                                                                                                                                                     | ref；DOM 属性                                                                                                                                                                                                                                                                                                                                                                                                            | ref 落在其他元素上，或 DOM 属性被丢弃，都会失败。缺口：没有测试覆盖 `className`、`style` 或 `xstyle` 的合并顺序。                                                                                                                                | `audit:OverflowList/api`      |
| AR2          | 源码审查                                                                                                                                                                                                      | 折叠条目                                                                                                                                                                                                                                                                                                                                                                                                                 | 缺口：没有自动化检查覆盖对折叠条目的键盘可达性。                                                                                                                                                                                                 | `audit:OverflowList/a11y`     |
| PR1          | `useOverflow.test.ts` 的“当观察器报告尺寸变化”套件（脚本化观察器；新计数在下一个任务运行前被检查）                                                                                                            | 单行收缩；单行增长；一次投递中的两个列表；不改变任何内容的尺寸变化；显示更高指示器的单行折叠；保持行数不变的多行折叠；改变行数的多行折叠；指示器换行到新行的多行折叠；显示的指示器可能比测得指示器更窄的多行折叠；隐藏比条目更高的纯文本指示器的折叠；显示或隐藏指示器的 `observeParent` 折叠；保持指示器不变的 `observeParent` 折叠；测量到新行高的多行列表；宽度跟随其条目的列表中的折叠，以及宽度不跟随的列表中的折叠 | 保持高度的尺寸变化若在绘制后才渲染新计数、一次投递分别渲染每个列表、尺寸变化未改变任何内容却发生渲染、或可能改变列表自身高度或 `observeParent` 填充的折叠在绘制前渲染，都会失败。缺口：没有测试覆盖观察器生命周期（卸载与 ref 变更时释放订阅）。 | `audit:OverflowList/a11y`     |
| 主题解剖映射 | `scripts/check-knowledge.mjs`                                                                                                                                                                                 | 规范解剖与当前目标                                                                                                                                                                                                                                                                                                                                                                                                       | 缺失、多余或过时的映射会导致仓库校验失败。                                                                                                                                                                                                       | `audit:OverflowList/theming`  |
| RTL 关系     | RTL 审计精选的 D2 目标（`apps/storybook/rtl-audit/targets.json`），作用于 `OverflowList / Default`                                                                                                            | 前两个可见条目；LTR 与 RTL                                                                                                                                                                                                                                                                                                                                                                                               | 第一个条目未位于第二个条目的行内起始处，则 D2 失败。                                                                                                                                                                                             | `audit:OverflowList/i18n-rtl` |

## Decision log

无记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表、示例、溢出测量机制、实现步骤或系统规则。它链接到它们的拥有者。
