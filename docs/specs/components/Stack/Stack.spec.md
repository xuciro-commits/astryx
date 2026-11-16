---
schema_version: 3
template_version: 7
kind: component
id: component:Stack
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-28
owners: [cixzhang]
review_triggers: [public-api, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/serverSafeComponents.test.ts,
    .github/visual-baseline/manifest.json,
    packages/core/src/Stack/Stack.test.tsx,
    packages/core/src/Stack/StackItem.test.tsx,
    packages/core/src/hooks/useScrollRegionProps.test.tsx,
    packages/core/src/hooks/__tests__/scrollRegionName.a11y.chromium.spec.ts,
    packages/core/src/HStack/HStack.test.tsx,
    packages/core/src/VStack/VStack.test.tsx,
    packages/core/src/theme/themingTargets.test.ts,
    apps/storybook/stories/Stack.stories.tsx,
    apps/storybook/stories/HStack.stories.tsx,
    packages/core/src/HStack/__tests__/HStackAudit.a11y.chromium.spec.ts,
    scripts/check-knowledge.mjs,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: [family:layout-primitives]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:container-padding,
    architecture:public-component-api,
  ]
contributing: []
system_specs: []
---

# Stack component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | Stack 在一条 flex 轴上排布子元素，涉及 `direction`、对齐、`gap`、按边 `padding`、尺寸、`wrap`、`isScrollable` 与 `as`。HStack 与 VStack 固定方向；StackItem 控制单个子元素的参与。 |
| Behavior                | 对齐 prop 依据方向解析到主轴或交叉轴；padding 按逻辑边解析；padding 保持局部，不发布容器内缩量。                                                                                   |
| End-user impact         | 读者看到一致的间距与对齐，并随书写方向变化。                                                                                                                                       |
| Builder impact          | 无：API 无变化；可滚动的 `div` 或 `span` StackItem 在不改动代码的情况下获得 role 与名称（AR2）。                                                                                   |
| Compatibility/readiness | API 与默认值均无变化；可滚动的 `div` 或 `span` StackItem 的 role 与名称（AR2）属于补丁级 `[fix]`。                                                                                 |
| Review checks           | 拒绝物理 left/right padding、压过显式对齐的别名、发布容器内缩量的 padding，以及缺少 flex 最小尺寸重置的 StackItem。                                                                |
| Governing rules         | `family:layout-primitives/FR1–FR6,FR8`; `architecture:container-padding/INV8`; `architecture:public-component-api/INV5,INV6,INV8`.                                                 |

本表是审查视图；下文正文具有权威性。

## Intent

Stack 是一维布局原语。它为 flex 容器掌管方向、感知轴的对齐、gap、局部 padding、尺寸、换行与滚动，而 StackItem 掌管其中一个子元素在其内部的伸缩、对齐与滚动。

## Compatibility and migration

- 已发布默认值保持不变：`yes`
- 兼容性类别：补丁。公共 prop、默认值与样式输出均无变化。当其滚动时，无调用方 `role` 的可滚动 `div` 或 `span` StackItem 会获得 `role="group"` 与一个 `aria-label`（DOM；AR2，在 `spec:AST-017` FR53 下为 `[fix]`）
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**拥有**

- Stack，以及 HStack、VStack 与 StackItem，`Stack.doc.mjs` 将它们记录为内联的 `components:` 条目。本记录覆盖全部四个；它们都没有各自的使用方文档或记录。
- Stack 容器及其 `stack` 目标；StackItem 包装器及其 `stack-item` 目标。
- 对齐的轴解析、按边 padding 解析、gap、尺寸、换行与滚动。

**不拥有 / 非目标**

- 提供给 Stack 或 StackItem 的内容——由调用方拥有。
- 容器内缩量发布与后代内容外溢——由 `architecture:container-padding` 下的发布方拥有；Stack padding 是局部的。
- 二维布局——由 `component:Grid` 拥有；居中——由 `component:Center` 拥有。

## Public concepts

| Concept   | Closed values or states                                                                                  | Meaning                                                           | Availability by variant/orientation/state | Default                            | Owner             | Stability | Invalid-value behavior                                                                                                                          |
| --------- | -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------- | ---------------------------------- | ----------------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction | `horizontal`、`vertical`                                                                                 | Flex 行或列。HStack 为水平；VStack 为垂直。                       | 仅 Stack；在 HStack 与 VStack 上固定      | `vertical`                         | `component:Stack` | 稳定      | TypeScript 拒绝其他取值。                                                                                                                       |
| Alignment | 主轴 `start`、`center`、`end`、`between`、`around`、`evenly`；交叉轴 `start`、`center`、`end`、`stretch` | `hAlign`/`vAlign` 按物理方向命名，或 `justify`/`align` 按轴命名。 | 所有 stack                                | 浏览器默认（交叉轴上为 `stretch`） | `component:Stack` | 稳定      | Stack 在 `hAlign` 与 `vAlign` 上接受所有对齐取值，并忽略不适用于所解析轴的取值；HStack、VStack、`justify` 与 `align` 会在 TypeScript 中拒绝它。 |
| Gap       | 间距步进 0、0.5、1、1.5、2、3、4、5、6、8、10                                                            | 行与列间距。                                                      | 所有 stack                                | 未设置                             | `component:Stack` | 稳定      | TypeScript 拒绝其他取值。                                                                                                                       |
| Padding   | 按边、按轴或统一的间距步进                                                                               | 局部内边距。                                                      | 所有 stack                                | 未设置                             | `component:Stack` | 稳定      | TypeScript 拒绝其他取值。                                                                                                                       |
| Wrap      | `nowrap`、`wrap`、`wrap-reverse`                                                                         | Flex 换行。                                                       | 所有 stack                                | 未设置（`nowrap`）                 | `component:Stack` | 稳定      | TypeScript 拒绝其他取值。                                                                                                                       |
| Item size | `static`、`fill`                                                                                         | StackItem 既不伸缩，或伸展以填满。                                | StackItem                                 | `static`                           | `component:Stack` | 稳定      | TypeScript 拒绝其他取值。                                                                                                                       |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                           | Basis          |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1 | Stack 将 `as` 指定的元素（默认为 `div`）渲染为给定方向上的 flex 容器，并携带 `stack` 目标，该目标反映 `direction`、`gap` 与 `wrap`。HStack 以 `direction="horizontal"` 渲染 Stack，VStack 以 `direction="vertical"` 渲染。                                          | 当前源码与测试 |
| FR2 | `hAlign` 与 `vAlign` 按物理轴命名：在水平 stack 中，`hAlign` 设置主轴对齐，`vAlign` 设置交叉轴对齐，垂直 stack 则相反。`justify` 与 `align` 按主轴与交叉轴命名，仅在对应的 `hAlign` 或 `vAlign` 缺省时生效。未设置对齐时沿用浏览器默认值。                          | 当前源码与测试 |
| FR3 | `gap` 依据间距刻度设置相等的行间距与列间距。padding 按逻辑边解析：先是边对应的 prop，其次其轴 prop（`paddingInline` 或 `paddingBlock`），最后是 `padding`；行内边跟随书写方向。                                                                                     | 当前源码与测试 |
| FR4 | Stack padding 是局部的：它不发布容器 padding 变量，因此后代无法用它做外溢补偿。                                                                                                                                                                                     | 当前源码       |
| FR5 | `width`、`height`、`maxWidth` 与 `minHeight` 以数字按像素、字符串按原样应用为行内样式，并置于调用方 `style` 之后。`wrap` 设置 flex 换行。`isScrollable` 设置 `overflow: auto`。                                                                                     | 当前源码与测试 |
| FR6 | StackItem 将 `as` 指定的元素（默认为 `div`）渲染为携带 `stack-item` 目标，该目标反映 `size`；它始终将最小宽度与高度重置为零，`static` 既不伸展也不收缩，`fill` 伸展以共享剩余空间，`crossAlignSelf` 覆盖 stack 的交叉轴对齐，`isScrollable` 设置 `overflow: auto`。 | 当前源码与测试 |
| FR7 | `ref` 抵达 Stack、HStack、VStack 与 StackItem 渲染出的元素。受支持的 DOM、ARIA、data 与事件 prop 也会抵达；`xstyle`、`className` 与 `style` 按该顺序在组件样式之后合并。                                                                                            | 当前源码与测试 |

### Allowed variation

- **AV1 — 元素。** 调用方通过 `as` 选择元素。
- **AV2 — 主题绘制。** 主题可以重设 `stack` 与 `stack-item` 的样式，而不改变轴解析或 padding 优先级。

### Representative states

| State            | Required invariant                                                     | Allowed variation |
| ---------------- | ---------------------------------------------------------------------- | ----------------- |
| 垂直默认         | Flex 列；`data-direction="vertical"`。                                 | 子元素。          |
| 带别名的水平     | `justify` 设置主轴，`align` 设置交叉轴，除非已设置 `hAlign`/`vAlign`。 | —                 |
| 按边 padding     | 每条边独立解析；行内边在从右到左时镜像。                               | —                 |
| 填满并可滚动的项 | `StackItem size="fill" isScrollable` 伸展并滚动自身溢出。              | —                 |

### Transformation and precedence order

- **ORD1 — 对齐。** `hAlign`/`vAlign` → 按轴对应 `justify`/`align` → 浏览器默认。
- **ORD2 — 按边 padding。** 边 prop → 轴 prop → `padding`。
- **ORD3 — 尺寸。** 调用方 `style` → 尺寸 prop。

### Performance and resources

- **PR1 — 静态渲染。** Stack、HStack、VStack 与 StackItem 不持有状态，也不使用 hook。唯一例外是可滚动的 `div` 或 `span` StackItem：它通过客户端岛渲染，该岛观测其溢出以支持 AR2。

## Accessibility contract

- **AR1 — 不添加语义。** Stack 与 StackItem 不添加自己的 role、名称或 Tab 停靠点；其语义即 `as` 元素的语义。唯一例外是滚动中的 StackItem 的名称（AR2）。
- **AR2 — 滚动中的 StackItem 具有名称。** 当可滚动的 `div` 或 `span` StackItem 滚动时，其元素具有 `role="group"`（除非调用方设置了 `role`）与可访问名称（调用方的 `aria-label`，或经翻译的“Content”），因此抵达它的屏幕阅读器会播报它，包括当它成为浏览器生成的 Tab 停靠点时；Tab 行为由浏览器决定（所有者决策，2026-11-04）。调用方的 `role` 只接受调用方的 `aria-label`，而另一个元素保持自己的 role 与名称。在浏览器不为它生成 Tab 停靠点的情况下，内容中没有任何可聚焦元素的滚动区域无法通过键盘滚动。此时调用方应添加可聚焦子元素，或使用 ScrollableArea。

## Design relationships

| Anatomy or state | Design requirement           | Representation authority     | Hierarchy role | Component contract |
| ---------------- | ---------------------------- | ---------------------------- | -------------- | ------------------ |
| Stack 容器       | 一维布局容器。               | 当前源码、文档与 family 契约 | 支撑级         | FR1–FR5            |
| 项               | 可选地控制单个子元素的参与。 | 当前源码、文档与 family 契约 | 支撑级         | FR6                |
| 内容             | 任一包装器中的调用方内容。   | 调用方提供的内容             | 依上下文而定   | AR1                |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Stack container": {"target": "stack"},
  "Item": {"target": "stack-item"},
  "Content": {
    "none": {
      "reason": "intentional: Caller-supplied content retains its own theming ownership; Stack and StackItem apply no content target."
    }
  }
}
```

## Family and system relationships

- `family:layout-primitives` 拥有共享的间距、padding 优先级与修饰符规则；Stack、HStack、VStack 与 StackItem 是其成员，FR2、FR3 与 FR6 应用这些规则。
- `architecture:container-padding` 将 Stack padding 记录为局部（FR4）。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR7 应用这些规则。

## Verification map

| Contract            | Verification                                                                                                                                                                                                                                                            | Representative states                                               | Mutation or failure expectation                                                                                                                                                                                                                                                                                                                                                                                 | Audit section          |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| FR1, FR2            | `Stack.test.tsx`、`HStack.test.tsx`、`VStack.test.tsx` 的元素测试；`HStack.test.tsx` 的目标、反射、轴、别名与优先级测试；`HStackAudit` 的 `HStack / Alignment Matrix` Chromium 帧；稳定视觉基线 `core-stack--default`                                                   | 默认元素与 `as` 元素；默认 stack                                    | 默认元素或 `as` 元素错误会失败；默认方向、gap 或对齐变化会作为变更返回审查。若 HStack 失去水平方向、`stack` 目标或其反射，把对齐 prop 或别名发送到错误的 Stack prop，或失去别名优先级，`HStack.test.tsx` 失败；若所得水平几何形状错误或在从右到左时镜像错误，`HStackAudit` 帧失败。gap：Stack 与 VStack 的方向、对齐与别名测试只断言内容渲染，因此垂直 `data-direction` 反射与 Stack 自身的轴映射没有单元检查。 | `audit:Stack/layout`   |
| FR3                 | `Stack.test.tsx` padding 优先级测试；`@astryx/no-physical-properties` lint 规则                                                                                                                                                                                         | 统一、按轴、按边、全部四条边                                        | 缺少 padding class、末端边上的边压过轴、测试配对的边上边压过统一、或出现物理 left/right padding 属性，都会失败。gap：起始边上的边压过轴、轴压过统一、任何未测试的边压过统一配对，以及 gap 取值（gap 测试只断言内容渲染）都没有检查，且没有浏览器从右到左的检查覆盖这些边。                                                                                                                                      | `audit:Stack/layout`   |
| FR5                 | `Stack.test.tsx` 尺寸与滚动测试；`HStack.test.tsx` 合并测试；`HStackAudit` wrap 帧                                                                                                                                                                                      | 数字与字符串尺寸；可滚动                                            | 计算宽度或高度错误，或 `isScrollable` 未产生 class 变化，会失败。若 `width` 未能压过调用方 `style`，`HStack.test.tsx` 失败；若 `wrap` 未能换行，`HStackAudit` 帧失败。gap：`height`、`maxWidth` 与 `minHeight` 压过调用方 `style`、`maxWidth` 与 `minHeight` 本身，以及 Stack 与 VStack 上的 `wrap` 都没有检查。                                                                                                | `audit:Stack/layout`   |
| FR6                 | `StackItem.test.tsx` 元素、滚动与透传测试                                                                                                                                                                                                                               | 默认元素与 `as` 元素；可滚动；带滚动的 `size="fill"`                | 元素错误，或 `isScrollable` 未产生 class 变化，会失败。gap：size 与 `crossAlignSelf` 测试只断言内容渲染，因此最小尺寸重置、`static`、`fill`、交叉轴对齐与 `stack-item` 目标都没有检查。                                                                                                                                                                                                                         | `audit:Stack/layout`   |
| FR7                 | 四个套件中的 ref 与透传测试；`HStack.test.tsx` 精确 ref 与合并测试                                                                                                                                                                                                      | 默认元素与 `as` 元素                                                | 丢失 ref 会在四个套件中都失败，丢失 `aria-label` 会在 Stack、HStack 与 StackItem 套件中失败（VStack 透传测试只断言 `data-testid`）。若 ref 抵达渲染元素以外的任何元素，或 `className` 与 `style` 未合并，`HStack.test.tsx` 失败。gap：Stack、VStack 与 StackItem 的 ref 测试接受任何元素，因此包装器上的 ref 在那里也能通过，而 `xstyle`、`className`、`style` 的顺序没有检查。                                 | `audit:Stack/behavior` |
| FR4                 | 对照 `architecture:container-padding` 的源码审查                                                                                                                                                                                                                        | 带 padding 的 stack                                                 | gap：若 Stack 发布 container-padding 变量，没有自动化检查会失败。                                                                                                                                                                                                                                                                                                                                               | `audit:Stack/layout`   |
| Theming anatomy map | `scripts/check-knowledge.mjs`                                                                                                                                                                                                                                           | 使用方解剖结构与当前目标                                            | 缺失、多余或过期的映射会使仓库校验失败。                                                                                                                                                                                                                                                                                                                                                                        | `audit:Stack/theming`  |
| AR1, PR1            | `serverSafeComponents.test.ts`；`HStack.test.tsx` 无 role 测试；`HStackAudit` 帧；源码审查                                                                                                                                                                              | 每种形式                                                            | 在没有客户端指令的情况下添加客户端 API（状态、effect、上下文读取）会使 `serverSafeComponents.test.ts` 失败。若 Stack 在其水平路径上添加 role 或 Tab 停靠点，`HStack.test.tsx` 与 `HStackAudit` 帧失败。gap：与客户端指令一同添加的客户端 API 会通过，且若 Stack 在其垂直路径上添加 role 或 Tab 停靠点，或 StackItem 添加其中之一，没有自动化检查会失败。                                                        | `audit:Stack/behavior` |
| AR2                 | `useScrollRegionProps.test.tsx` StackItem 测试；`scrollRegionName.a11y.chromium.spec.ts` 的 `stack-item-scrolls` 与 `stack-item-static`                                                                                                                                 | 滚动项；调用方 `region` role 与 `aria-label`；不可滚动的项          | 项溢出时缺少 group role 或名称，或在不滚动的项上出现它们，会失败，在 Chromium 的可访问性树中亦然；调用方的 role 或 `aria-label` 丢失会失败。                                                                                                                                                                                                                                                                    | `audit:Stack/behavior` |
| RTL relation        | RTL 审计精选目标（`apps/storybook/rtl-audit/targets.json`）：`Stack / Horizontal` 与 `Stack / StackItem fill size` 上的 Stack 与 StackItem D2，`AspectRatio / Height driven` 与 `HStack / Alignment Matrix` 上的 HStack D2，`Spinner / Narrow flex host` 上的 VStack D4 | 水平 stack、static 与 fill 项，以及起始对齐的垂直 stack；LTR 与 RTL | 首个子元素不在行内起始位置的水平 stack，或未移到镜像侧的起始对齐垂直 stack 子元素，会使 D2 或 D4 失败。                                                                                                                                                                                                                                                                                                         | `audit:Stack/i18n-rtl` |

## Decision log

未记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表/示例、当前审计结果、实现步骤或 family/系统规则。它链接到它们的拥有者。
