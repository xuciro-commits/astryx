---
schema_version: 3
template_version: 7
kind: component
id: component:ClickableCard
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
    theming,
    accessibility,
    interaction,
    navigation,
    testing,
  ]
verified_by:
  [
    packages/core/src/ClickableCard/ClickableCard.test.tsx,
    packages/core/src/Button/__tests__/Button.a11y.test.tsx,
    packages/core/src/Button/__tests__/Button.a11y.chromium.spec.ts,
    packages/core/src/__tests__/CardPress.a11y.chromium.spec.ts,
    packages/core/src/__tests__/ReducedMotionPress.a11y.chromium.spec.ts,
    packages/core/src/hooks/useClickableContainer.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/ClickableCard.stories.tsx,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:component-test-sufficiency,
  ]
contributing: []
system_specs: [spec:AST-005, spec:AST-009, spec:AST-085]
---

# ClickableCard component contract

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                        |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 一张 Card，带必填的 `label` 以及 `onClick`（操作）或 `href`（导航）之一，另加 `isDisabled` 与 Card 的内边距、变体、高度层级和尺寸输入。卡片构建在 `useClickableContainer` 之上，它返回 `onPointerDown`，容器会展开它，使落在嵌套交互元素上的触摸按压不显示按压状态（FR5）。 |
| 行为          | 一个视觉隐藏的原生按钮或链接拥有卡片的操作；整个卡片表面都能激活它，而嵌套控件与选中的文本保留各自的结果。                                                                                                                                                                  |
| 最终用户影响  | 人们可以从卡片上的任何位置，用指针或键盘激活卡片，而禁用的卡片保持可达并被朗读，同时不执行任何操作。                                                                                                                                                                        |
| 构建者影响    | 主题的退出时长与缓动设定触摸按压的释放（FR5）；无 API 变更。                                                                                                                                                                                                                |
| 兼容性/就绪度 | 无 API 变更；触摸按压的释放发生变化（FR5，`spec:AST-094` FR5）。在 Current-state impact 下列出两处实现缺口。                                                                                                                                                                |
| 审查检查      | 拒绝在禁用时仍可用的目标、重复激活、从嵌套控件或选中文本发起的激活、跳过共享决策的目标，或丢失的焦点绘制。                                                                                                                                                                  |
| 治理规则      | `family:navigation-destinations/FR1,FR3–FR5`；`architecture:interaction-modality/INV2–INV5`；`architecture:public-component-api/INV5–INV8`；`spec:AST-085` FR1、FR2、FR5、FR6；`component:ClickableCard/FR5`（触摸按压的释放）；`spec:AST-094/FR5`（按压释放的退出令牌）。  |

本表是审查投影；下文才是权威。

## Intent

ClickableCard 把 Card 表面变成一个操作目标或导航目标，同时不剥夺卡片内部交互内容自身的激活能力。

## Compatibility and migration

- 已发布的默认值保持不变：触摸按压的释放为 `no`：它按主题的退出时长与缓动淡出，如 FR5 与 `spec:AST-094` FR5 所述。鼠标按压保留卡片的桌面端按压样式。
- 兼容性类别：非破坏性行为变更；没有公共 prop、默认值、DOM 或 target 变更
- 受控/非受控行为：不适用
- 迁移决策：无

使用方的迁移说明归入使用方文档与发布说明。

## Current-state impact

- **嵌套控件上出现两个焦点指示（AR3）。** 只要任何后代持有键盘焦点，卡片就绘制自己的焦点轮廓，因此聚焦嵌套控件时会同时显示卡片的轮廓与该控件自身的轮廓，而 `architecture:interaction-modality` INV3 只允许每次焦点移动出现一个指示。
- **禁用状态未反映在目标上（FR4）。** `clickable-card` 目标反映 `variant`，但不反映禁用状态，因此主题无法在那里为它设置样式，而 `architecture:component-theming-surface` INV6 要求状态留在拥有它的目标上。

## Ownership boundary

**拥有**

- 承载卡片操作的隐藏原生按钮或链接，以及它的名称。
- 卡片表面激活，以及对嵌套交互后代与选中文本的抑制。
- 卡片上的启用、禁用、悬停、按压与委托焦点绘制。
- 绘制根上的 `clickable-card` 目标。

**不拥有 / 非目标**

- 选择或切换——由 `component:SelectableCard` 拥有。
- 调用方内容的语义、绘制或激活。
- 目标接受——由 `family:navigation-destinations` 拥有。
- Card 的内边距、变体绘制、圆角、高度层级与尺寸——由 `component:Card` 拥有。

## Public concepts

| 概念     | 封闭取值或状态                                     | 含义                                             | 按变体/方向/状态可用性 | 默认值   | 拥有者                           | 稳定性 | 无效值行为                   |
| -------- | -------------------------------------------------- | ------------------------------------------------ | ---------------------- | -------- | -------------------------------- | ------ | ---------------------------- |
| 激活模式 | 操作（`onClick`）；导航（`href`）；两者皆无（OQ1） | 哪个隐藏原生控件承载卡片的操作。                 | 所有变体               | 两者皆无 | `component:ClickableCard`        | 稳定   | 同时给出两者时 `href` 胜出。 |
| 禁用     | 已启用；已禁用                                     | 禁用的卡片仍可聚焦并可被朗读，但不执行任何操作。 | 两种模式               | 已启用   | `component:ClickableCard`        | 稳定   | —                            |
| 嵌套归属 | 卡片表面；嵌套交互后代；选择                       | 只有表面按压才会激活卡片。                       | 已启用的卡片           | 表面     | `component:ClickableCard`        | 稳定   | —                            |
| 目标     | 已接受；已阻断                                     | 每个导航汇点都使用共享的目标决策。               | 导航模式               | 无       | `family:navigation-destinations` | 稳定   | 被阻断的目标不导航。         |

## Behavioral and layout contract

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | 依据                                                          |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| FR1 | 根是 Card 的 `div`。给出 `href` 时，一个视觉隐藏的原生链接承载目标与 `target`；否则由视觉隐藏的 `button type="button"` 调用 `onClick`。`label` 为该控件命名，隐藏控件是卡片的 Tab 停靠点。                                                                                                                                                                                                                                                                                                                                                     | 当前源码与测试                                                |
| FR2 | 在卡片表面上以主键按压会以卡片作为 `currentTarget` 调用一次 `onClick`，随后执行一次已接受的导航，除非回调取消它。在给出 `href` 的卡片表面上以中键按压，会在新标签页打开一个已接受的目标，且不调用 `onClick`。在嵌套交互后代内部、在打开的 Tooltip 或 HoverCard 表面（`component:Tooltip` FR11）内部按压，或结束文本选择的按压，都不会激活卡片。激活操作卡片的隐藏按钮会调用一次 `onClick`；激活隐藏链接会导航，且不调用 `onClick`。                                                                                                            | 当前源码与测试；`architecture:public-component-api` INV7      |
| FR3 | 普通、新标签页、带修饰键、中键点击与表面委托的导航都使用共享的目标决策；被阻断的目标不导航。                                                                                                                                                                                                                                                                                                                                                                                                                                                   | `family:navigation-destinations` FR1, FR3–FR5                 |
| FR4 | `isDisabled` 让隐藏控件保持可聚焦并带 `aria-disabled="true"`；Enter、空格以及对它的点击都不做任何事。禁用的链接保留其链接角色与名称，但没有 `href` 或 `target`。控件保持可聚焦并被朗读（`spec:AST-085` FR1、FR2、FR5）；卡片自身的点击与 mouseup 处理以及调用方的 `onMouseUp` 被移除，其他调用方事件 prop 仍到达根，表面不显示悬停或按压绘制（`spec:AST-085` FR6），并以半透明渲染。禁用状态反映在拥有它的目标上（`architecture:component-theming-surface` INV6）。实现缺口：`clickable-card` 目标不反映任何禁用状态（Current-state impact）。 | 当前源码与测试                                                |
| FR5 | 启用期间，根在支持悬停的指针下绘制共享的悬停覆盖层，并对会激活卡片的鼠标与触摸按压绘制按压覆盖层；落在嵌套交互元素上的触摸按压不显示按压绘制，因为它不会激活卡片（这是 FR2 激活规则的对应面），而那里的鼠标按压保留 `:active` 绘制，带边框的卡片的边框会响应悬停。触摸按压立即显示。在触摸呈现下，其释放在主题的退出动效令牌（`--duration-exit`、`--ease-exit`）上淡出，依据 `spec:AST-094` FR5；鼠标按压保留卡片的桌面端按压样式。隐藏控件上的键盘焦点会在根上显示共享的焦点轮廓。                                                            | 当前源码、故事与 `architecture:interaction-modality`          |
| FR6 | 根携带 `clickable-card` 目标，在 Card 的目标旁反映 `variant`。`ref` 到达根；受支持的 DOM、ARIA、data 与事件 prop 到达它；调用方的 `onMouseUp` 在卡片自身的之后运行；`xstyle`、`className` 与 `style` 在组件样式之后组合。                                                                                                                                                                                                                                                                                                                      | 当前源码与测试；`architecture:public-component-api` INV5–INV8 |

### Allowed variation

- **AV1 — 调用方内容。** 调用方内容在卡片内部保留自己的语义、主题与交互。
- **AV2 — 路由集成。** 已接受的目标可以使用原生链接或当前激活的链接提供者。
- **AV3 — 卡片外观。** Card 的变体、内边距、高度层级与尺寸可以变化，而不改变激活归属。

### Representative states

| 状态       | 必需的不变式                                                  | 允许的变化         |
| ---------- | ------------------------------------------------------------- | ------------------ |
| 已启用操作 | 隐藏按钮可由键盘与表面操作；`onClick` 运行一次。              | 内容与外观。       |
| 已启用导航 | 隐藏链接保留其目标；表面按压使用共享决策。                    | 原生或提供者路由。 |
| 已禁用操作 | 隐藏按钮可聚焦并带 `aria-disabled`；不执行任何操作。          | —                  |
| 已禁用导航 | 保留链接角色与名称；没有 `href` 或 `target`；可聚焦；不导航。 | —                  |
| 嵌套控件   | 后代处理自己的事件；卡片不激活。                              | 任何交互子元素。   |

### Transformation and precedence order

- **ORD1 — 事件归属。** 禁用会移除卡片自身的点击与 mouseup 处理；随后文本选择与嵌套交互归属会抑制卡片激活；否则，对主键按压而言，`onClick` 在任何已接受的目标之前运行并可取消它，而中键按压会在不调用 `onClick` 的情况下打开已接受的 `href`。
- **ORD2 — 导航。** 先决定目标，再选择原生、路由、同标签页、新标签页、带修饰键、中键点击或委托激活。

### Performance and resources

- **PR1 — 仅共享资源。** ClickableCard 在挂载时安装共享的按压控制器，并仅在启用期间把它的根标记为按压表面；它不添加自己的计时器、观察器、请求、portal 或布局测量。

## Accessibility contract

- **AR1 — 原生语义归属。** 隐藏的按钮或链接暴露其原生角色与 `label`；可见的根不添加自己的角色。
- **AR2 — 禁用仍可感知。** 禁用卡片的控件保留在 Tab 顺序中，朗读 `aria-disabled`，并且是惰性的（FR4）。
- **AR3 — 每次焦点移动一个焦点指示。** 隐藏控件上的焦点只显示一次，且显示在卡片根上（`architecture:interaction-modality` INV3）。实现缺口：当嵌套控件持有焦点时，根也会绘制轮廓，因此该控件显示两个指示（Current-state impact）。
- **AR4 — 模态对等。** 键盘、指针与触摸用户各有可操作的路径；悬停从不是唯一路径。

## Design relationships

| 结构或状态 | 设计要求                               | 呈现权威         | 层级角色             | 组件契约          |
| ---------- | -------------------------------------- | ---------------- | -------------------- | ----------------- |
| 容器       | 带启用交互绘制与委托焦点的 Card 表面。 | 当前源码与文档   | 依情境而定的操作表面 | FR4–FR6, AR3, AR4 |
| 内容       | 调用方的层级与交互，保持不变。         | 调用方拥有的内容 | 依情境而定           | FR2, AV1          |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Container": {"target": "clickable-card"},
  "Content": {
    "none": {
      "reason": "intentional: Caller-supplied content retains its own theming ownership; ClickableCard applies no content target."
    }
  }
}
```

## Family and system relationships

- `family:navigation-destinations` 拥有目标接受以及各导航汇点之间的对等；FR3 应用它。
- `architecture:interaction-modality` 拥有模态与焦点指示规则；FR5 与 AR3 应用它们，AR3 记录该缺口。
- `architecture:component-theming-surface` 设定 `clickable-card` 目标遵循的规则；FR4 记录禁用状态缺口。
- `architecture:public-component-api` 拥有 ref、透传、取消与样式输入规则；FR2 与 FR6 应用它们。
- `spec:AST-085` 拥有禁用控件的行为；FR4 与 AR2 应用它。

## Verification map

| 契约             | 验证                                                                                                                                                                      | 代表性状态                                               | 变更或失败预期                                                                                                                                                                                                                                                                                                  | 审查章节                            |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| FR1, AR1         | `ClickableCard.test.tsx` 的隐藏控件、label 与 target 测试；`Button.a11y.test.tsx` 与 `Button.a11y.chromium.spec.ts` 的 ClickableCard 状态                                 | 操作与导航；`clickable-card` 与 `clickable-card-as-link` | 缺少隐藏按钮或链接、丢失 `aria-label` 或 `target`、在可访问性树上未暴露按钮角色或名称，或链接卡片丢失其计算出的 `link` 角色，均失败。缺口：链接卡片在可访问性树上的名称，以及根不添加任何角色，都没有检查。                                                                                                     | `audit:ClickableCard/accessibility` |
| FR2, ORD1        | `ClickableCard.test.tsx` 的表面、隐藏控件、键盘、嵌套控件与选择测试                                                                                                       | 表面；隐藏控件；Enter；嵌套按钮与输入；选择              | 缺少或重复的 `onClick`、错误的 `currentTarget`，或从嵌套控件或选择发起激活，均失败。缺口：没有测试从 `onClick` 取消导航。没有测试覆盖激活同时给出 `href` 与 `onClick` 的卡片的隐藏链接。没有 ClickableCard 测试覆盖给出 `href` 的卡片上的中键按压。                                                             | `audit:ClickableCard/behavior`      |
| FR3, ORD2        | `useClickableContainer.test.tsx`；`ClickableCard.test.tsx` 的链接测试                                                                                                     | 普通、带修饰键、中键、target、已接受、已阻断             | 被阻断的目标到达汇点，或丢失激活方式，在共享钩子测试中失败。                                                                                                                                                                                                                                                    | `audit:ClickableCard/navigation`    |
| FR4, AR2         | `ClickableCard.test.tsx` 的禁用与触摸按压测试；`Button.a11y.chromium.spec.ts` 的 `clickable-card-disabled` 状态                                                           | 禁用操作与导航                                           | 禁用控件离开 Tab 顺序、仍可用的 `href` 或 `target`、仍然运行的回调、禁用时的触摸按压标记，或禁用操作卡片在可访问性树上其不可用状态或惰性（点击、Enter、空格）检查失败，均失败。缺口：禁用的链接卡片没有可访问性树检查（`spec:AST-085` FR5），禁用悬停与鼠标按压绘制（`spec:AST-085` FR6）以及半透明都没有检查。 | `audit:ClickableCard/accessibility` |
| FR5, AR3, AR4    | `ClickableCard.test.tsx` 的触摸按压测试；`CardPress.a11y.chromium.spec.ts` 对 `core-clickablecard--with-on-click` 的测试；稳定的视觉基线 `core-clickablecard--navigation` | 静止；桌面端悬停与鼠标按压；触摸按压                     | 未在静止之上绘制的悬停、未在悬停之上绘制的鼠标按压、与桌面端按压或淡出不符的触摸按压，或改变的静止外观，均失败或返回已变更的基线。缺口：边框悬停与焦点轮廓没有自动化检查。                                                                                                                                      | `audit:ClickableCard/design`        |
| FR6              | `ClickableCard.test.tsx` 的高度层级测试；`themingTargets.test.ts`                                                                                                         | 高度层级；目标清单                                       | 丢失高度层级类或目标，均失败。缺口：没有测试覆盖 ref、DOM 透传、`onMouseUp` 顺序或样式输入合并。                                                                                                                                                                                                                | `audit:ClickableCard/api`           |
| PR1              | 源码审查                                                                                                                                                                  | 已启用与已禁用                                           | 缺口：如果 ClickableCard 添加自己的计时器、观察器或测量，没有自动化检查会失败。                                                                                                                                                                                                                                 | `audit:ClickableCard/behavior`      |
| Theming 结构映射 | `scripts/check-knowledge.mjs`                                                                                                                                             | 使用方结构与当前目标                                     | 缺失、多余或过时的映射会使仓库校验失败。                                                                                                                                                                                                                                                                        | `audit:ClickableCard/theming`       |

## Decision log

无记录。

## Open questions

- **OQ1 — 在不给出 `href` 或 `onClick` 的情况下渲染 ClickableCard，应继续保持为受支持的可聚焦空操作，还是公共契约应拒绝或使该组合惰性？**（`human-api`）已发布的类型与渲染目前允许它。

## Content boundary

本文件不复制使用方的 prop 表/示例、当前审查结果、实现步骤、共享目标规则或 Card 样式。它链接到它们的拥有者。
