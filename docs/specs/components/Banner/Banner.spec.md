---
schema_version: 3
template_version: 4
kind: component
id: component:Banner
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-07
owners: [cixzhang, imdreamrunner]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Banner/Banner.test.tsx,
    packages/core/src/Banner/__tests__/Alert.a11y.test.tsx,
    packages/core/src/Banner/__tests__/Alert.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: []
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:theme-compilation,
  ]
contributing: []
system_specs: [spec:AST-009, spec:AST-020, spec:AST-021]
---

# Banner component contract

## Intent

Banner 在页面或区块顶部呈现一条持续存在的状态消息。本契约记录当前的绘制表面，并把 Banner 框架记录为可单独定位的表面。状态目标与内容目标保持不变。

## Compatibility and migration

- 保留的已发布默认值：`no`——Banner 不再根据视觉状态派生活区角色
- 兼容性类别：针对活区变更（DEP-0007）的无障碍语义破坏性修正，其视觉输出、DOM 结构、props、主题目标和交互行为均保持不变。FR9 是视觉变更：Info 状态表面以 `--color-info-muted` 填充，内置内容采用 on-muted 角色；props、DOM 结构和主题目标保持不变
- 受控/非受控行为：不变
- 迁移决策：要播报异步结果的调用方在产生该结果的 transition 处理器中调用 `useAnnounce`，并把 `role="alert"` 保留给紧急消息，Banner 会将其放在消息元素上（FR8）。在已挂载的活区容器内，改为适用 `spec:AST-086` FR4。

使用方迁移说明应写入使用方文档和发布说明。

### DEP-0007 — Deprecate live-region roles derived from `status`

| 字段     | 值                                                                                                                                                                                         |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| id       | `DEP-0007`                                                                                                                                                                                 |
| 清理     | `CLN-0015`                                                                                                                                                                                 |
| 包       | `@astryxdesign/core`                                                                                                                                                                       |
| 表面     | `Banner` 的默认 ARIA 角色：`warning` 和 `error` 为 `role="alert"`，`info` 和 `success` 为 `role="status"`，在调用方未传 `role` 时由 `status` 推导                                          |
| 旧契约   | 视觉 `status` 决定 Banner 根元素的活区角色                                                                                                                                                 |
| 替代方案 | 要播报异步结果的调用方在产生该结果的 transition 中调用 `useAnnounce`。紧急消息传入 `role="alert"`，Banner 会将其放在消息元素上（FR8）。在已挂载的活区容器内，改为适用 `spec:AST-086` FR4。 |
| 直接权威 | `component:Banner`。负责人：`cixzhang`、`imdreamrunner`                                                                                                                                    |
| 警告     | 使用方文档和发布说明需指明 `DEP-0007`、其他消息使用 `useAnnounce`、紧急消息使用 `role="alert"`。无运行时警告（`spec:AST-017` FR29）                                                        |
| 迁移     | 非机械式：要播报异步结果的调用方在产生该结果的 transition 中调用 `useAnnounce`；有紧急消息的调用方传入 `role="alert"`。在已挂载的活区容器内，改为适用 `spec:AST-086` FR4。                 |
| codemod  | 无：Banner 是否需要播报、以及何时播报，取决于渲染它的 transition，这只有调用方知道；在所有位置重新加上已发布角色，会恢复本次清理所去除的耦合                                               |
| 下游     | 维护中的文档教导：异步结果使用 `useAnnounce`，`role="alert"` 仅用于紧急消息。在已挂载的活区容器内，改为适用 `spec:AST-086` FR4。                                                           |
| 过渡     | 无先前过渡                                                                                                                                                                                 |
| 状态     | `proposed`                                                                                                                                                                                 |
| 待决决策 | 使 `status` 仅具视觉含义的 Banner FR 与 DEC 条目                                                                                                                                           |
| 目标计划 | 在下一个次要版本中发布 `CLN-0015`                                                                                                                                                          |

### CLN-0015 — Banner renders no live-region role by default

| 字段     | 值                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| id       | `CLN-0015`                                                                                                                          |
| 生命周期 | `DEP-0007`                                                                                                                          |
| 变更     | 除非调用方传入 `role`，`Banner` 不渲染 `role`，也不渲染 `aria-live`。视觉状态样式、图标、主题目标以及对显式 `role` 的转发均保持不变 |
| 回滚     | 从最终补丁基线恢复 `status` 到角色的映射                                                                                            |
| 状态     | `pending`——随其 `[breaking]` Changeset 在一个已声明的小版本中落地                                                                   |

## Ownership boundary

**拥有**

- 当前状态表面，作为 Banner 的主要绘制表面。
- 其下方的可选内容表面。
- Banner 框架：组合上述两个表面，并承载当前整个 Banner 的高度与抬升卡片轮廓。
- 状态表面上由 Banner 编写的标题、描述、图标、折叠和关闭内容所需的语义前景上下文。内置控件仅在其 Button 元素上接收该上下文，因此它们的工具提示仍是普通的 Button 表面。

**不拥有 / 非目标**

- Button 的几何形状、交互层、工具提示绘制，或使用方提供的 `endContent`——这些委托给 `component:Button`。由两个或更多操作组成的行动行遵循 `family:action-groups`。
- 新的主题属性、prop、变体或 DOM 元素。

## Public concepts

Banner 框架是一个稳定的公共主题概念。其目标是 `banner-frame`，并反映既有的 `container` 与 `elevation` 轴。既有的 `banner` 目标仍位于状态表面，并继续反映 `container` 与 `status`。

使用方 props、默认值和用法仍记录在 `Banner.doc.mjs` 中。prop 词表和可扩展性规则均无变化。

## Behavioral and layout contract

以下需求描述当前实现及其附加的框架目标契约。

| ID  | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 依据                                      | 契约状态       |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | -------------- |
| FR1 | 当前渲染把 `banner` 放在着色的状态表面上，该表面是 Banner 的主要绘制表面，并反映 `container` 与 `status`。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 当前源码、公共文档和测试                  | 当前行为       |
| FR2 | Banner 框架接收公共 ref、role、受支持的 DOM props、`xstyle`、`className` 和 `style`；它还绘制选定的 `boxShadow`。例外是 `role="alert"` 及随其传入的 `aria-*` 属性，它们落在消息元素上（FR8）。                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码和测试                            | 当前行为       |
| FR3 | 抬升的 `card` 框架还会绘制整个 Banner 的圆角。`section` 框架保持直角。非抬升框架不接收框架圆角样式。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码和高度测试                        | 当前行为       |
| FR4 | 卡片形状分散在各表面所有者上：没有可见内容时，状态表面拥有全部圆角；有可见内容时，状态表面拥有上方圆角；内容表面拥有下方圆角。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码                                  | 当前行为       |
| FR5 | 在 `banner` 上由主题编写的 `borderRadius` 当前只把私有变量 `--_banner-radius` 写在状态表面上。CSS 继承既不会把该值向上传到框架，也不会横向传到内容表面，因此两者都保留各自的回退圆角。                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前编译器输出与 CSS 继承                 | 当前可达性缺口 |
| FR6 | Banner 框架暴露 `banner-frame`，并反映 `container` 与 `elevation`。既有的 `banner` 目标仍留在状态表面上，而不会移到最外层 DOM 元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | 所有者决策；当前源码和测试                | 当前行为       |
| FR7 | `banner-frame` 是附加的。既有的 `banner`、`banner-icon`、`banner-description` 和 `banner-content` 目标及其当前轴均保持不变。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | 当前目标清单；兼容性策略                  | 当前行为       |
| FR8 | `status` 只控制视觉含义，不得推导 `role`、`aria-live` 或播报。消息属于紧急情况（用户必须立即处理的错误或时间关键故障）的 Banner 可以携带 `role="alert"`，该角色由调用方传入。Banner 把该角色及随其传入的 `aria-*` 属性放在自己的消息元素上，该元素只包含标题和描述，绝不放在框架、尾部区域或内容区域上。其他所有 Banner 播报都通过产生它的 transition 调用 `useAnnounce`，紧急程度按 `spec:AST-086` FR5 设定。带 `role="alert"` 的 Banner 也不再通过 `useAnnounce` 播报（`spec:AST-086` FR1）。角色的落点不改变任何视觉表现：不会因此改变任何元素、样式或布局。在已挂载的活区容器内，适用 `spec:AST-086` FR4，Banner 不携带活区角色。 | 无障碍检查清单 §Announcements；所有者决策 | 当前行为       |
| FR9 | 状态表面以匹配的 `--color-<status>-muted` 角色填充（Info 为 `--color-info-muted`），并用匹配的 `--color-on-<status>-muted` 角色绘制其内置的标题、描述、图标、折叠和关闭内容。Banner 把该语义前景上下文提供给每个内置 Button 元素，而不改变 Button 拥有的几何形状或交互层；同级工具提示仍保持 Button 的普通主题颜色。使用方提供的 `endContent` 不受影响。                                                                                                                                                                                                                                                                              | 状态角色架构；Banner 与 Button 源码/测试  | 当前行为       |

### Allowed variation

- **AV1 — 内容存在性。** 内容表面可以缺失、折叠、展开，或在既有 `collapsible` 契约下始终可见。
- **AV2 — 目标范围。** 主题用 `banner-frame` 表示整个 Banner 的轮廓与高度，用 `banner` 表示主要状态表面，并用既有的子目标表示各自拥有的部分。

### Representative states

| 状态                     | 必需的当前行为                                                        | 允许的变化                 |
| ------------------------ | --------------------------------------------------------------------- | -------------------------- |
| 平坦卡片，无可见内容     | 状态表面是完整的圆角绘制表面；框架阴影为 `none`，且没有框架圆角样式。 | 状态、文本、控件和主题绘制 |
| 抬升卡片，有可见内容     | 框架绘制整个阴影和圆角；状态表面绘制上方圆角；内容表面绘制下方圆角。  | 高度层级和内容             |
| 抬升 section             | 框架绘制整个阴影但没有卡片圆角；状态表面和内容表面保持直角。          | 高度层级和内容             |
| 在 `banner` 上自定义圆角 | 状态表面接收私有圆角值；框架和内容表面保留各自的回退圆角。            | 编写的圆角值               |

### Transformation and precedence order

- **ORD1 — 表面解析。** 解析 `container`、`elevation` 和可见内容；把整个 Banner 的高度以及任何抬升卡片圆角应用到 Banner 框架；然后渲染带目标的状态表面和可选的带目标内容表面。
- **ORD2 — 当前圆角路由。** 主题编译把在 `banner` 上编写的 `borderRadius` 写入状态表面上的私有圆角变量。该值不会继承到祖先框架或同级内容表面。使用方不直接编写该私有变量。

### Performance and resources

本契约除 `family:action-groups` FR5 为两个或更多操作的行动行提供的按压跟踪外，不引入任何新的测量、观察器、监听器、渲染轮次或运行时工作。

## Accessibility contract

`status` 通过颜色和图标传达视觉类别；它不决定播报的紧急程度。紧急 Banner 的消息元素携带 `role="alert"`；其文本是标题和描述，在 DOM 中以一个空格分隔。控件、其工具提示、`endContent` 和内容区域位于其外部。其他 Banner 消息通过 `useAnnounce` 播报，Banner 不为它们渲染活区角色。`useAnnounce` 写入先前已挂载的活区；在已挂载的活区容器内，由该容器投递这些消息（`spec:AST-086` FR4）。与 Banner 一起挂载的任何其他 Banner 消息都不是可靠的播报。

关闭时的焦点移交、展开控件和可访问的控件名称均保持不变。

专门针对 alert 状态的绑定只检验通过标准 DOM 表面显式请求 `role="alert"` 的 Banner 渲染。它检查共享状态消息契约的 DOM、无障碍树和焦点保持结果，而不主张辅助技术会播报什么。播报措辞与时机仍归 AST-009。该绑定报告整个区域的原子性，但不会因此判定失败，因为该期望是建议性的。每个状态都通过所有必需期望：在普通、可关闭、已折叠、已展开、始终可见、调用方操作和描述状态下，alert 区域只包含标题和描述。

## Design relationships

| 结构或状态    | 设计要求                                                                                                                     | 表现权威                               | 层级角色 | 组件契约      |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | -------- | ------------- |
| Banner 框架   | 组合状态表面和可选内容表面，并承载它们共享的轮廓与高度。                                                                     | 当前源码和公共文档                     | 支撑     | FR2、FR3、FR4 |
| 状态表面      | 作为 Banner 的主要绘制表面，承载状态填充、消息和控件。                                                                       | 当前源码和公共文档                     | 突出     | FR1           |
| 内容表面      | 在状态表面下方承载可选的辅助细节。                                                                                           | 当前源码和公共文档                     | 支撑     | FR4、FR7      |
| 操作/关闭控件 | 内置控件内容在 Button 元素上接收状态表面的 on-muted 前景；交互层和工具提示仍归 Button 所有。使用方提供的 `endContent` 不变。 | Banner 状态上下文加 `component:Button` | 支撑     | FR7、FR9      |

Banner 框架是稳定的结构，并拥有附加的 `banner-frame` 目标。状态表面仍是 Banner 的主要绘制表面，并保留未加限定的 `banner` 目标。

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Banner frame": {"target": "banner-frame"},
  "Status surface": {"target": "banner"},
  "Icon": {"target": "banner-icon"},
  "Title": {"inherits": "banner"},
  "Description": {"target": "banner-description"},
  "Action button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Dismiss button": {
    "delegatesTo": {"owner": "component:Button", "target": "button"}
  },
  "Content surface": {"target": "banner-content"}
}
```

该映射记录运行时可达性。`banner` 属于主要状态表面，而不是最外层 DOM 元素；而 `banner-frame` 属于拥有整个 Banner 高度与轮廓的可见框架。委托给 Button 保留了每个内置控件的结构与交互所有权。Banner 只在 Button 元素上提供状态表面的前景上下文，并且不会为使用方提供的 `endContent` 子元素重新设置样式。

## Family and system relationships

- `architecture:component-theming-surface` 拥有目标限定、结构映射，以及公共目标必须位于稳定绘制部件上的要求。
- `architecture:public-component-api` 管辖 DEC-1 所接纳的附加目标的兼容性。
- `architecture:theme-compilation` 拥有当前在各绘制方之间传递 Banner 圆角的私有派生变量路由。

## Verification map

| 契约           | 验证                                                       | 代表状态                                                             | 变异或失败预期                                                                                                                                       | 审计章节                |
| -------------- | ---------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| FR1、FR7       | `Banner.test.tsx` 和 `themingTargets.test.ts`              | 状态表面、内容表面、当前目标轴                                       | 移动、删除或更改既有目标会破坏当前断言。                                                                                                             | `audit:Banner/theming`  |
| FR2、FR3、FR4  | `Banner.test.tsx` 以及当前源码检查                         | 平坦/抬升卡片和抬升 section                                          | 框架、状态表面、内容表面、阴影或圆角所有权偏离所记录的状态。                                                                                         | `audit:Banner/surfaces` |
| FR5            | 编译器输出加上浏览器/计算样式证据                          | 有内容和无内容的卡片；抬升卡片                                       | `banner.borderRadius` 意外到达框架/内容，或者文档声称当前路由已经这样做了。                                                                          | `audit:Banner/radius`   |
| FR6、FR7       | 实现 PR 目标、编译器、探针和组件测试                       | 卡片/section 在 none、low、med 和 high 各高度下的表现                | `banner-frame` 缺失、使用其他名称、漏掉某个轴，或移动了既有的 `banner` 目标。                                                                        | `audit:Banner/theming`  |
| FR8            | `Banner.test.tsx`、使用方文档、无障碍检查清单 A6           | 默认的 info/success/warning/error；在消息元素上显式设置 alert 角色   | 视觉状态创建活区、显式 alert 角色被丢弃或落在消息元素之外，或者文档告诉构建者通过条件挂载 Banner 来播报。                                            | `audit:Banner/a11y`     |
| FR8 alert 状态 | `Alert.a11y.test.tsx` 和 `Alert.a11y.chromium.spec.ts`     | 显式紧急错误；可关闭、已折叠、已展开、始终可见、调用方操作和描述变体 | 角色、assertive 通道或焦点保持在消息更新时回退；alert 区域包含标题和描述以外的任何内容，或者框架携带该角色或其 `aria-*` 属性。原子性只报告，不强制。 | `audit:Banner/a11y`     |
| FR9            | `Banner.test.tsx` 加上 Button 工具提示与自定义尾部内容断言 | 四种状态；内置折叠/关闭；工具提示；使用方操作                        | 内置内容失去匹配的 on-muted 角色、工具提示被重新绘制、Button 交互所有权改变，或使用方内容被改动。                                                    | `audit:Banner/theming`  |
| 主题结构映射   | `scripts/check-knowledge.mjs`                              | 八个结构条目和五个当前目标                                           | 缺失、多余、带前缀、过时或无归属的当前映射会使校验失败。                                                                                             | `audit:Banner/theming`  |

## Decision log

### DEC-1 — The Banner frame has separate public theme ownership

**参考：** `component:Banner/DEC-1`

**决策人：** cixzhang，2026-09-07

Banner 框架是稳定的可见结构，在整个状态表面和可选内容表面上拥有整个 Banner 的高度与抬升卡片轮廓。它接收附加的 `banner-frame` 目标，并带有 `container` 与 `elevation` 选择器轴。既有的 `banner` 目标仍留在主要状态表面上。

`frame` 命名公共视觉角色。`root` 被否决，因为它描述 DOM 位置，并会暗示该目标必须留在最外层元素上。

### DEC-2 — Visual status does not infer announcement urgency

**参考：** `component:Banner/DEC-2`

**决策人：** cixzhang，2026-09-24

紧急程度由调用方决定，用 `role="alert"` 标记，Banner 把该 alert 限定在消息上，使辅助技术只听到所编写的文字。其他所有消息使用标准播报模块，因此每条消息只有一个所有者播报。

否决：在整个框架上设置活区角色，这会暴露控件和工具提示文本。

否决：从 `warning` 或 `error` 推导 alert 紧急程度。严重程度与紧急程度相互独立，首次绘制时就存在的静态错误并不是应当打断屏幕阅读器输出的事件。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表或示例、实现步骤或系统主题规则。
