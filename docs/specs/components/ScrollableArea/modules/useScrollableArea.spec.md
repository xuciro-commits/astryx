---
schema_version: 3
template_version: 1
kind: module
id: module:ScrollableArea/useScrollableArea
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-11
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility]
verified_by:
  [
    packages/core/src/hooks/useScrollableArea.test.tsx,
    packages/core/src/hooks/scrollKeyboardDelegation.test.ts,
    packages/core/src/BottomSheet/__tests__/BottomSheetKeyboard.a11y.browser.spec.ts,
  ]
parent_component: component:ScrollableArea
references: [architecture:public-component-api, spec:AST-025/DEC-1]
---

# useScrollableArea module contract

## Intent

useScrollableArea 是规范的可复用行为核心，面向那些已经拥有视口与内容根节点的组件。它提供安全的 prop/ref 组合、逻辑轴测量、实时所有者注册、边缘状态、键盘访问以及滚动链接，且不插入任何结构。

## Compatibility and migration

- 保留的已发布默认值：尚未发布
- 兼容性类别：增量式公共 hook 与类型
- 迁移决策：`spec:AST-025/DEC-1`

## Ownership boundary

**拥有**

- 有效轴测量与稳定的逻辑边缘状态。
- 观察、失效处理、DOM 所有者注册、条件式视口访问，以及有效轴上的滚动链接。
- 调用方视口/内容 prop 与 ref 的安全组合。

**不拥有 / 非目标**

- 视口布局、绘制、溢出声明、滚动条呈现，或插入内容包裹层。
- Sticky 定位与公共所有者查找。

## Public API and concepts

| 概念           | 封闭取值或状态                                       | 含义                       | 默认值                    | 所有者                                    | 稳定性 |
| -------------- | ---------------------------------------------------- | -------------------------- | ------------------------- | ----------------------------------------- | ------ |
| axis           | `inline`、`block`、`both`                            | 请求的逻辑滚动意图         | 必填                      | `spec:AST-025`                            | 稳定   |
| keyboard owner | `content`、具名 `viewport`、具名 `contentOrViewport` | 固定的或自动的键盘滚动路径 | 必填                      | `spec:AST-025`                            | 稳定   |
| overscroll     | `allow`、`contain`                                   | 有效轴上的边缘传播         | `allow`                   | `spec:AST-025`                            | 稳定   |
| axis state     | `isScrollable`、`atStart`、`atEnd`                   | 有效所有权与逻辑边缘       | 未激活，两侧边缘均为 true | `module:ScrollableArea/useScrollableArea` | 稳定   |

## Behavioral contract

| ID  | 不变式                                                                                                                                                                                                                                          | 依据                        | 验收与实现状态                 |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- | ------------------------------ |
| FR1 | 仅当该轴被请求、计算出的溢出可滚动，且几何尺寸超过 1px 时，该轴才 MUST 有效。                                                                                                                                                                   | `spec:AST-025` FR1–FR4      | 已实现                         |
| FR2 | 视口与内容的几何尺寸 MUST 被观察；失效通知 MUST 合并，并在无法测量期间保留最后一次有效状态。                                                                                                                                                    | `spec:AST-025` FR5–FR9      | 已实现                         |
| FR3 | 逻辑边缘与行为所拥有的物理溢出 MUST 通过方向以及 horizontal、vertical 或 sideways 书写模式完成映射，且不要求采用方重建该映射。                                                                                                                  | `spec:AST-025` FR1, FR3–FR4 | 已实现                         |
| FR4 | 最近注册的有效所有者 MUST 按轴各自独立胜出。                                                                                                                                                                                                    | `spec:AST-025` FR10, FR18   | 为未来的 Sticky 以私有方式实现 |
| FR5 | 视口键盘 prop 与 overscroll 包容 MUST 仅在适用的被请求轴有效时出现。                                                                                                                                                                            | `spec:AST-025` FR12–FR14    | 已实现                         |
| FR6 | prop getter MUST 组合 ref，并保留调用方的 handlers/classes/styles/ARIA，而在冲突时行为所拥有的无障碍语义与不可取消的行为获胜。                                                                                                                  | `spec:AST-025` IR4          | 已实现                         |
| FR7 | 视口 prop getter MUST 消费调用方的 `xstyle`，并在内部组合由几何驱动的 `clip`/`auto`/`hidden` 溢出，以及显式的贴合 Sticky 包容。                                                                                                                 | `spec:AST-025` FR21         | 已实现                         |
| FR8 | `contentOrViewport` MUST 保留具名的溢出视口，在正向 Tab 进入时检查第一个顺序后代，并且仅委派给位于导航键所属表面之外的原生 link/button。从被委派的第一个子节点开始的反向遍历会跳过该视口。指针/程序化聚焦永不委派；资格在下一次进入时重新检查。 | `spec:AST-025` FR12–FR13    | 已实现                         |

### Transformation and precedence order

- **ORD1 — Effective state.** 请求的逻辑轴 → 计算出的物理轴 → 可滚动的溢出 → 几何容差 → 规范化的逻辑边缘。
- **ORD2 — Prop composition.** 调用方 prop 与 `xstyle` → 行为所拥有的贴合/激活溢出样式 → 稳定的组合 ref → 行为所拥有的键盘、状态与滚动链接输出。

### Performance and resources

- **PR1 — Stable publication.** 相等的有效/边缘状态复用先前的对象。
- **PR2 — Shared observation.** 两个元素盒子都使用共享的 ResizeObserver；所有次级失效信号通过一个动画帧合并。

## Accessibility contract

- **AR1 — Named viewport owner.** 固定视口与自动访问需要标签，并在有效可滚动期间保留 `tabIndex=0`。自动访问仅在正向键盘进入时委派；该后代在具名视口组/区域内保留自己的名称。
- **AR2 — Focus continuity.** 内容、资格与几何变化永不移动或模糊焦点。处于焦点中的视口在失去溢出后仍可被程序化聚焦。从被委派的第一个子节点开始的反向遍历会跳过该视口，包括在访问后续后代之后。
- **AR3 — Conservative eligibility.** 检查第一个顺序目标；不要越过被排除的目标去查找 link/button。复合角色、可编辑表面、原生或已注册的嵌套滚动所有者、正的 tab 排序、弹出层触发器，以及未经证实的交互角色都保留视口路径。
- **AR4 — Native scrolling.** 委派 MUST 保留对两侧滚动边缘的 Arrow/Page 访问，而不实现 JavaScript 滚动。

## Design relationships

此 hook 不拥有任何视觉呈现。

## Parent and system relationships

- `component:ScrollableArea` 拥有参考的视口/内容组合。
- `spec:AST-025` 拥有共享行为与采用边界。

## Verification map

| 契约             | 验证                                                                                                           | 代表性状态                                                                                                        | 变异或失败预期                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| FR1–FR8, AR1–AR4 | `useScrollableArea.test.tsx`、`scrollKeyboardDelegation.test.ts` 与 `BottomSheetKeyboard.a11y.browser.spec.ts` | horizontal/vertical/sideways、LTR/RTL、fit/overflow/edge、固定/自动键盘所有者、动态后代资格、嵌套所有者、聚焦丢失 | 仅样式或仅几何的所有权、物理边缘泄漏、重复或缺失的键盘路径、过期状态、ref 丢失，或失效的包容都会失败 |

## Decision log

### DEC-1 — Prop getters are the public composition seam

**参考：** `module:ScrollableArea/useScrollableArea/DEC-1`

**决策者：** cixzhang, 2026-09-11

每个被拥有元素只返回一个 prop 对象，从而把 ref、无障碍语义、处理器与行为保持在一起，同时不使使用方的展开顺序成为正确性的一部分。

### DEC-2 — Automatic ownership is shared behavior

**参考：** `module:ScrollableArea/useScrollableArea/DEC-2`

**决策者：** cixzhang, 2026-09-13

`contentOrViewport` 保留具名的溢出视口，并且仅在正向 Tab 进入时委派给安全的第一个顺序原生 link/button。这取代了持续的键盘资格观察。几何观察保持不变；键盘资格不新增子树或祖先观察器，并在每次进入时重新检查。BottomSheet 是此共享行为的验证性组合。

## Open questions

无。

## Content boundary

本文件不重复使用方的签名/示例、ScrollableArea 的结构/呈现，或 Sticky 未来的 API 与定位机制。
