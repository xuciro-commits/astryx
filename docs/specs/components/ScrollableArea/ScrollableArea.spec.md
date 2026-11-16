---
schema_version: 3
template_version: 4
kind: component
id: component:ScrollableArea
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-11
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/ScrollableArea/ScrollableArea.test.tsx,
    packages/core/src/hooks/useScrollableArea.test.tsx,
    apps/storybook/stories/ScrollableArea.stories.tsx,
  ]
modules: [module:ScrollableArea/useScrollableArea]
families: []
design_specs: []
architecture:
  [architecture:container-padding, architecture:public-component-api]
contributing: []
system_specs: [spec:AST-025/DEC-1]
---

# ScrollableArea component contract

## Intent

ScrollableArea 为构建者提供一个完整的原生滚动视口和一个可观测的内容盒，而无需他们自行协调键盘访问、滚动链接、边缘状态和原生滚动条呈现。它是在共享行为 hook 之上的参考组合，而不是该行为的独占所有者。

## Compatibility and migration

- 保留的已发布默认值：尚未发布
- 兼容性类别：增量式组件与包导出
- 受控/非受控行为：不适用
- 迁移决策：`spec:AST-025/DEC-1`

## Ownership boundary

**拥有**

- 一个根原生视口和一个真实被观测的内部内容盒。
- 由共享 hook 提供的条件性视口键盘访问、无障碍命名、逻辑轴意图、过度滚动策略和原生滚动条默认值。
- 可选的逻辑内容内边距，它会发布匹配的容器内缩，以及需显式启用的、针对继承容器内边距的视口出血。

**不拥有 / 非目标**

- JavaScript 驱动的滚动或自定义滚动条 DOM。
- 通用的 Sticky 公共 API 或回退定位算法。
- 诸如 Layout 和 Table 之类现有的、由组件拥有的视口迁移。

## Public concepts

| Concept     | Closed values or states                    | Meaning                      | Availability by variant/orientation/state | Default          | Owner                            | Stability | Invalid-value behavior |
| ----------- | ------------------------------------------ | ---------------------------- | ----------------------------------------- | ---------------- | -------------------------------- | --------- | ---------------------- |
| 逻辑轴      | `inline`、`block`、`both`                  | 允许原生滚动的轴             | 全部                                      | `block`          | `spec:AST-025`                   | 稳定      | 类型错误               |
| 过度滚动    | `allow`、`contain`                         | 有效轴是否在边缘传播         | 全部                                      | `allow`          | `spec:AST-025`                   | 稳定      | 类型错误               |
| 视口尺寸    | `width`、`height`、`maxWidth`、`minHeight` | 视口上的标准容器几何         | 全部                                      | auto             | `component:ScrollableArea`       | 稳定      | 类型错误               |
| 内容内边距  | 共享的逻辑间距步进阶梯                     | 内容盒内缩与已发布的几何信息 | 全部                                      | `0`              | `architecture:container-padding` | 稳定      | 类型错误               |
| 完全出血    | `false`、`true`                            | 视口是否脱离继承的内缩       | 全部                                      | `false`          | `architecture:container-padding` | 稳定      | 类型错误               |
| Sticky 包含 | `whenScrollable`、`always`                 | 适配的内容是否捕获 Sticky    | 全部                                      | `whenScrollable` | `spec:AST-025`                   | 稳定      | 类型错误               |
| 视口语义    | `group`、`region` 外加必需标签             | 为一个条件性键盘滚动目标命名 | 全部                                      | `group`          | `component:ScrollableArea`       | 稳定      | 类型错误               |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                           | Basis                            | Acceptance and implementation state |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- | ----------------------------------- |
| FR1 | 根元素必须保持为唯一原生视口，并通过 StyleX 接收公共 ref、标准容器尺寸属性和样式输入。                                                                                                                                                                              | `spec:AST-025` IR3–IR4           | 已实现                              |
| FR2 | 内部内容包装器必须是随视口一同被观测的真实常规流块盒，使用 100% 的最小尺寸，并且仅在请求内联滚动时才使用 max-content 内联尺寸。子元素参与该盒而非视口的 flex/grid 格式化上下文，且最小块尺寸不会形成确定的百分比高度基准；必须保留这些语义的结构应直接采用该 hook。 | `spec:AST-025` FR5–FR6           | 已实现                              |
| FR3 | 原生滚动条行为必须保持权威；在精细指针下，默认滑块使用 `--color-neutral` 且轨道透明，而在粗糙主指针和强制颜色模式下恢复平台呈现。                                                                                                                                   | `spec:AST-025` FR15              | 已实现                              |
| FR4 | 滚动状态容器查询可以增强后代的 stuck/边缘呈现，但 hook 状态必须保持为跨浏览器的真值来源。                                                                                                                                                                           | `spec:AST-025` platform support  | 逐步实现                            |
| FR5 | 内容盒必须应用并发布逻辑内边距，优先级为按边优先于按轴优先于统一值，并将每个已发布的边默认为零。`isFullBleed` 必须只让视口消费继承的内缩；嵌套内容继续读取内容盒发布的值。                                                                                          | `architecture:container-padding` | 已实现                              |
| FR6 | 适配的视口必须在两个物理轴上都使用 `clip`，从而在不捕获原生 Sticky 的情况下防止绘制溢出。超出请求轴的几何必须激活按书写模式解析的 `auto`/`hidden` 组合。`stickyContainment="always"` 必须在适配时显式保留该组合。                                                   | `spec:AST-025` FR21              | 已实现                              |

### Allowed variation

- **AV1 — 尺寸与呈现。** 使用方的 `xstyle`、`className` 和 `style` 可以设置视口尺寸，并调整基于标准的原生滚动条属性。
- **AV2 — 内容。** 任何流内容都可在被观测的盒中渲染；构建者仍需对内容语义负责。

### Representative states

| State          | Required invariant                                                                    | Allowed variation  |
| -------------- | ------------------------------------------------------------------------------------- | ------------------ |
| 适配           | 两个轴均为 `clip`；无制表位；除非包含为 `always`，否则 Sticky 向外传递；两端均为 true | 视口尺寸与内容     |
| 溢出           | 具名制表位；按轴的逻辑边缘状态                                                        | 请求的一个或两个轴 |
| 聚焦时移除溢出 | 移除未来的制表位而不移动焦点                                                          | 当前焦点保持       |
| 强制颜色       | 原生平台滚动条呈现                                                                    | 平台渲染           |
| 粗糙主指针     | 原生平台滚动指示器                                                                    | 平台渲染           |

### Transformation and precedence order

- **ORD1 — 属性。** 使用方的 DOM 和样式属性首先组合；由行为负责的 ref、无障碍和活动轴链接在文档记录的冲突中胜出。

### Performance and resources

- **PR1 — 共享、合并的观测。** 视口和内容尺寸变化信号使用共享观察器，重复的失效最多每帧发布一次。

## Accessibility contract

- **AR1 — 条件性访问。** 视口仅在至少一个请求轴有效时才进入顺序导航，并使用提供的标签和角色。
- **AR2 — 焦点连续性。** 失去溢出时不得使焦点模糊或移动。

## Design relationships

| Anatomy or state | Design requirement                                 | Representation authority | Hierarchy role | Component contract |
| ---------------- | -------------------------------------------------- | ------------------------ | -------------- | ------------------ |
| 视口             | 平台滚动条；在精细指针下，令牌着色的滑块与透明轨道 | `spec:AST-025`           | 支撑性         | FR1, FR3           |
| 内容盒           | 默认无独立绘制                                     | 调用方内容               | 结构性         | FR2                |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Viewport": {"target": "scrollable-area"},
  "Content box": {
    "none": {
      "reason": "intentional: The content box is structural and paints no component-owned appearance."
    }
  }
}
```

## Family and system relationships

- `module:ScrollableArea/useScrollableArea` 拥有可复用的测量、溢出边界、Sticky 包含、无障碍和注册行为。
- `architecture:container-padding` 拥有可选的内容内缩发布和需显式启用的视口出血。
- `spec:AST-025` 拥有共享的有效轴、观测、无障碍、过度滚动、所有权、边缘和原生呈现规则。

## Verification map

| Contract         | Verification                          | Representative states                                                                                         | Mutation or failure expectation                                                            | Audit section                   |
| ---------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------- |
| FR1–FR6, AR1–AR2 | 组件/hook 测试与 Storybook 浏览器探针 | 适配、溢出、焦点丢失、LTR/RTL/垂直、嵌套 allow/contain、适配的 Sticky 透传/包含、原生滚动条、内边距、完全出血 | 重复视口、过期状态、失效的嵌套滚动区域、隐式 Sticky 包含、无条件制表位或过期内缩会导致失败 | `audit:ScrollableArea/behavior` |

## Decision log

### DEC-1 — The convenience component owns one explicit content box

**参考：** `component:ScrollableArea/DEC-1`

**决策者：** cixzhang, 2026-09-11

稳定的视口/内容结构让参考组件获得可靠的实时测量，同时让拥有自身结构的组件可以自由地直接采用该 hook。

### DEC-2 — ScrollableArea participates in the container-padding system

**参考：** `component:ScrollableArea/DEC-2`

**决策者：** cixzhang, 2026-09-11

内容盒发布其实际的逻辑内边距（默认为零），因此嵌套的出血使用方永远不会继承过期的内缩。视口仅在 `isFullBleed` 显式启用时才消费祖先内缩；仅靠滚动不会静默脱离其父容器。

### DEC-3 — Fitting content passes Sticky ownership outward by default

**参考：** `component:ScrollableArea/DEC-3`

**决策者：** cixzhang, 2026-09-12

适配的视口在两个轴上都使用 `clip`，以在不变为 CSS 滚动容器的情况下防止测量前的绘制闪烁。超出请求轴的几何会激活按书写模式解析的滚动边界。`stickyContainment="always"` 是在适配时保留该边界的显式启用方式。

## Open questions

无。

## Content boundary

本文件不重复使用方示例、共享 hook 算法、Sticky 未来的公共 API，或现有由组件拥有的视口的迁移计划。
