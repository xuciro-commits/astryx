---
schema_version: 3
template_version: 7
kind: component
id: component:Overlay
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-22
owners: [cixzhang]
review_triggers: [public-api, layout, accessibility]
verified_by:
  [
    packages/core/src/Overlay/Overlay.test.tsx,
    apps/storybook/stories/Overlay.stories.tsx,
    apps/storybook/rtl-audit/targets.json,
  ]
modules: []
families: []
design_specs: [design:bidirectionality]
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:internationalization,
  ]
contributing: []
system_specs: [spec:AST-002/DEC-1, spec:AST-017/FR5, spec:AST-027/FR2]
---

# Overlay component contract

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

本记录规定如何将若干段内容放置在 Overlay 表面之上，每一段都位于预设位置或分数坐标处，包括承载这类内容的容器的堆叠。Overlay 的遮罩、显示模式、自身的 `position` 取值与对齐方式，仍由其源码、测试与 `Overlay.doc.mjs` 描述，直到有记录认领它们。

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                             |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约      | 新增 `OverlayRegion` 组件，与 Overlay 并列导出：`position`（必填）是一个预设值（`'fill' \| 'top' \| 'bottom' \| 'center' \| 'top-start' \| 'top-end' \| 'bottom-start' \| 'bottom-end'`）或开放式放置 `{x, y, width?, height?}`，取值为 0–1 的分数；此外还有 `children`、`ref`、`xstyle`、`className`、`style`。 |
| 行为          | 在填充 Overlay 内，预设区域位于该位置上（角落遵循书写方向），开放式放置位于以媒体左上角为基准的分数处，从不镜像。带尺寸的开放区域保持在媒体内部。区域随媒体缩放。                                                                                                                                                |
| 最终用户影响  | 一张图片或视频上的多条说明文字、标签、徽章或热点，在任意尺寸、任一文字方向下都各自保持在媒体上的原位。                                                                                                                                                                                                           |
| 构建者影响    | 默认没有影响。构建者用 `OverlayRegion` 放置内容，而不是手写绝对定位；移动区域仍是构建者自己的代码。                                                                                                                                                                                                              |
| 兼容性/就绪度 | 增量式：新增一个组件和导出；没有区域的 Overlay 渲染与堆叠与之前完全一致。本记录是当前权威；`OverlayRegion`、其使用方文档、区域测试与区域故事尚未发布。                                                                                                                                                           |
| 审查检查      | 拒绝在从右到左时镜像的开放式放置、不翻转的角落预设、JavaScript 测量或观察器、Overlay 内的拖拽或缩放行为、区域上的 role 或焦点停靠点、区域上的主题目标，或放置在条带内的区域。                                                                                                                                    |
| 治理规则      | 以下 FR1–FR11；`design:bidirectionality/DR3`、`DR5`、`DR6`；`architecture:component-theming-surface/INV4`；`spec:AST-017/FR5`；`spec:AST-027/FR2`。                                                                                                                                                              |

该表格是审查投影；下文正文具有权威性。

## Intent

Overlay 把内容层叠在一个有边界的表面（通常是媒体）之上，并把该内容作为一个整块放置：整个表面，或顶部/底部的一条带。有些表面承载多段内容，每段各属于自己的一处位置：画进图片的两条说明文字、说明文字旁角落里的徽章、人脸上的一枚标签。所谓位置，要么是 Overlay 熟悉的位置之一，要么是用媒体宽高的分数描述的一个点，因为媒体会以多种尺寸显示，而该位置必须停留在它的同一批像素上。该放置由 Overlay 负责，因为 Overlay 负责它所对照测量的表面。

## Compatibility and migration

- 已发布的默认值保持不变：`yes`；没有区域的 Overlay 渲染与堆叠与之前完全一致。只有包含区域的容器才会隔离其堆叠（FR10）。
- 兼容性类别：增量式组件与导出。
- 受控/非受控行为：不适用；区域不持有状态。
- 迁移决策：无需迁移（`spec:AST-017/FR5`）。

使用方迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- `OverlayRegion`：其 `position` 取值、它们的几何、钳制、缩放与参考盒。
- 开放式放置按媒体自身物理空间测量的规则。
- 区域仅放置在填充 Overlay 中的规则，以及在其他任何地方的兜底行为。
- 包含区域的容器的堆叠隔离。

**不负责 / 非目标**

- 移动、拖拽或调整区域大小，包括指针捕获、键盘步进、吸附，以及何时报告新位置——由产品调用点负责（`component:Overlay/DEC-3`）。
- 区域绘制什么：边框、填充、控制柄与文本——由区域的内容负责。
- 让基础内容填满表面——与每个 Overlay 一样，由调用方负责；分数是相对于表面测量的，因此没有填满表面的媒体不会与这些分数对齐。
- Overlay 自身的 `position` 与 `align`——不变；区域除 FR2 之外不读取也不修改它们。
- 相对于触发器或表面之外的放置——由层运行时负责（Popover、Tooltip、HoverCard）。

## Public concepts

| 概念       | 封闭取值或状态                                                                          | 含义                                                                                                                                             | 按变体/方向/状态的可用性 | 默认值       | 所有者              | 稳定性 | 无效值行为                                                           |
| ---------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ | ------------ | ------------------- | ------ | -------------------------------------------------------------------- |
| 预设       | `fill`, `top`, `bottom`, `center`, `top-start`, `top-end`, `bottom-start`, `bottom-end` | `fill`、`top` 与 `bottom` 是 Overlay 自身 `position` 所命名的位置：整个表面，或该边缘处一条全宽的带。`center` 与各角落在该位置放置内容尺寸的盒。 | 填充 Overlay（FR2）      | 无；必填属性 | `component:Overlay` | 稳定   | 其他字符串会被公共类型拒绝                                           |
| 开放式放置 | `{x, y, width?, height?}`；每个都是 0 到 1 的数                                         | `x`、`y`：区域左上角在其参考盒中的分数，从该盒的左上角测量。`width`、`height`：区域尺寸的分数，向右和向下延展；省略表示贴合其内容。              | 填充 Overlay（FR2）      | 无；必填属性 | `component:Overlay` | 稳定   | 取值会被钳制到 0–1；非有限坐标按 0 处理，非有限尺寸按省略处理（FR6） |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                          | 依据                                 | 草案审查状态 |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------ |
| FR1  | 直接渲染在 `position="fill"`（默认值）的 Overlay 或 `useOverlay` 宿主的 content 中的 `OverlayRegion`，必须相对于该宿主的遮罩盒定位，遮罩盒即整个基础表面：0 与 1 是媒体的边缘，且该盒与 Overlay 的 `ref` 一致。位于区域与遮罩之间、为绝对定位后代建立包含块的任何元素，会改为成为其参考盒。在本记录中，表面指区域的参考盒。                                     | `component:Overlay/DEC-1`            | 已定         |
| FR2  | 区域只在填充宿主中放置。渲染在其他任何位置的区域必须不被放置：在 `position` 为 `"top"` 或 `"bottom"` 的 Overlay 或 `useOverlay` 宿主的 content 中、在 Overlay 的 `children` 中，或完全没有 Overlay 或 `useOverlay` 宿主时，它把自身内容作为普通流内内容渲染在原位（在条带中，该内容随条带显示与滑动），并且必须在每次挂载时发出一条指明仅限填充规则的开发警告。 | `component:Overlay/DEC-4`            | 已定         |
| FR3  | 预设区域必须位于 Overlay 内容内缩区内的其位置上：`fill` 覆盖内缩盒；`top` 与 `bottom` 在该边缘以内容高度横跨其全宽；`center` 在其中心处为内容尺寸；每个角落在该角落处为内容尺寸。大于内缩盒的内容由容器裁剪，而不是被移动。                                                                                                                                     | `component:Overlay/DEC-2`            | 已定         |
| FR4  | 角落预设必须依据区域自身上下文的书写方向来解析 `start` 与 `end`：`top-start` 在从左到右时是左上角，在从右到左时是右上角。`fill`、`top`、`bottom` 与 `center` 是对称的，不随方向改变。                                                                                                                                                                           | `design:bidirectionality/DR3`        | 已定         |
| FR5  | 开放式放置必须在任何书写方向下都从表面左边缘测量 `x`、从顶部边缘测量 `y`，并且不得在从右到左时镜像。区域自身的内容遵循环境方向。                                                                                                                                                                                                                                | `design:bidirectionality/DR5`        | 已定         |
| FR6  | 开放坐标与尺寸必须在放置前钳制到 0–1。非有限坐标必须解析为 0，非有限尺寸必须解析为省略。                                                                                                                                                                                                                                                                        | 无效值行为                           | 已定         |
| FR7  | 开放式放置把区域的左上角放在（`x`，`y`）处（`component:Overlay/DEC-6`）。在带尺寸的轴上，区域必须恰好是表面的该分数，向右或向下延展，并且必须完全位于其中：其起点被钳制在 0 与 1 减尺寸之间。在不带尺寸的轴上，区域必须从该坐标起贴合其内容，任何越过容器边缘的溢出都被裁剪，而不是向内移动。                                                                   | `component:Overlay/DEC-5`            | 已定         |
| FR8  | 当表面改变尺寸时，每个区域都必须保持其位置：预设靠其内缩，开放式放置靠其分数位置与尺寸，且无需重新渲染。                                                                                                                                                                                                                                                        | `component:Overlay/DEC-1`            | 已定         |
| FR9  | 区域必须随包含它的 overlay 内容一起出现、隐藏并变为惰性，遵循 Overlay 的 `showOn` 与 `isOpen`，并且必须继承遮罩的媒体主题。它不添加自己的任何可见性规则。                                                                                                                                                                                                       | Overlay 既有的显示行为               | 已定         |
| FR10 | 被放置的区域必须绘制在填充表面的流内 overlay 内容之上，包括在其之后书写的定位流内内容，且后放置的区域必须绘制在先放置的区域之上。位于形成层叠上下文的包装器内的被放置区域，只在该包装器的内容之间排序。内部任何位置含被放置区域的 Overlay 或 `useOverlay` 容器必须拥有隔离的层叠上下文；内部没有区域的容器保持其层叠不变。被放置的区域不得参与遮罩的流布局。    | 表面内的绝对定位；`spec:AST-027/FR2` | 已定         |
| FR11 | Overlay 与 `OverlayRegion` 不得移动、拖拽或调整区域大小，也不得在其上附加指针、键盘或手势处理器。区域仅在其调用方传入新的 `position` 时移动。                                                                                                                                                                                                                   | `component:Overlay/DEC-3`            | 已定         |

### Allowed variation

- **AV1 — 内容。** 任何内容都可以位于区域中；在开放区域上，每个轴独立地按尺寸或按内容定尺寸（FR7）。
- **AV2 — 表面尺寸与形状。** 表面可以是任意尺寸或宽高比，并且可以随时改变尺寸（FR8）。
- **AV3 — 混合内容。** 流内 overlay 内容、预设区域与开放区域可以共用一个表面（FR10）。

### Representative states

| 状态                                                     | 必需不变式                                                               | 允许的变化     |
| -------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| 两条说明文字，`top` 与 `bottom` 预设                     | 每个都在其边缘处横跨内缩宽度，像 Overlay 自身的条带一样。                | 说明文字文本。 |
| `top-start` 徽章，从左到右与从右到左                     | 从左到右为左上角；从右到左为右上角。                                     | 徽章内容。     |
| 靠近右边缘的开放带尺寸说明文字                           | 盒是图片的给定分数，完全位于内部，与该边缘齐平。                         | 哪条边缘。     |
| 开放内容尺寸的图钉                                       | 图钉从其点开始，向右和向下延展；越过容器的溢出被裁剪。                   | 图钉内容。     |
| 开放区域，从右到左页面                                   | 与从左到右时媒体上的位置相同；区域的文本从右到左阅读。                   | 书写方向。     |
| 表面宽度从 640px 调整到 320px                            | 每个区域保持其位置，且无需重新渲染。                                     | 任意表面尺寸。 |
| 位于 Overlay 的 `children` 中或在任何 Overlay 之外的区域 | 不被放置：其内容在原位流动，并在开发环境中警告一次。                     | 位置。         |
| 位于 `position="bottom"` Overlay 中的区域                | 不被放置：其内容像其他条带内容一样在条带中流动，并在开发环境中警告一次。 | 条带内容。     |
| 静止状态的 `showOn="hover"` overlay                      | 区域随其余 overlay 内容一起隐藏。                                        | 显示模式。     |

### Transformation and precedence order

- **ORD1 — 放置。** 解析参考盒（FR1、FR2）→ 对预设，把它放在内容内缩区中，并依据方向解析 start/end（FR3、FR4）；对开放式放置，钳制取值（FR6），并在物理空间中把每个轴解析为按尺寸或按内容定尺寸（FR5、FR7）→ 把结果表达为盒的内缩与分数（FR8）。样式输入按 `architecture:public-component-api/INV6` 给出的顺序在放置之后组合；覆盖内缩或尺寸属性的调用方对结果负责。

### Performance and resources

- **PR1 — 仅 CSS 几何。** 放置、钳制与缩放必须仅通过对给定值做算术和 CSS 实现：没有测量、观察器、监听器、状态、Effect 或额外的渲染轮次。仅限填充的检查不增加测量、状态或额外的渲染轮次。

## Accessibility contract

- **AR1 — 仅呈现。** `OverlayRegion` 不得添加 role、可访问名称、描述、焦点停靠点或文本。其内容保留自身的语义。
- **AR2 — 源码顺序即阅读顺序。** 辅助技术与键盘焦点遵循区域的源码顺序，而不是它们在表面上的位置。调用方按读者应当遇到它们的顺序渲染区域。
- **AR3 — 移动提供非拖拽路径。** Overlay 为开放区域记录的移动模式，把指针拖拽与一条无需拖拽的单指针路径配对，其中激活媒体上的某个点即可把区域移到那里；并提供键盘路径，按每个方向键以固定步长移动内容拥有焦点的区域，方向键方向与视觉轴一致（`design:bidirectionality/DR6`）。

## Design relationships

| 结构或状态       | 设计要求                                             | 表示权威                      | 层级角色 | 组件契约 |
| ---------------- | ---------------------------------------------------- | ----------------------------- | -------- | -------- |
| 预设区域         | 读起来像 Overlay 自身的位置，带 Overlay 的内容内缩。 | 所有者方向                    | 支撑性   | FR3      |
| RTL 中的角落预设 | 起始与结束角落遵循阅读顺序。                         | `design:bidirectionality/DR3` | 支撑性   | FR4      |
| 开放区域         | 在任意尺寸下都停留在媒体上的同一位置。               | 所有者方向                    | 支撑性   | FR7, FR8 |
| RTL 中的开放区域 | 媒体是物理内容，不进行镜像。                         | `design:bidirectionality/DR5` | 支撑性   | FR5      |

## Family and system relationships

- `design:bidirectionality` 负责方向行为：FR4 将 DR3 应用于角落预设，FR5 将 DR5 应用于开放式放置，AR3 将 DR6 应用于移动。
- `architecture:component-theming-surface/INV4` 让非绘制的盒留在主题表面之外：区域是一个只提供几何、不绘制任何内容的盒，因此它没有主题目标，其绘制由它的内容负责。
- `architecture:public-component-api` 负责属性准入与样式输入顺序；ORD1 应用 INV6。
- `spec:AST-027/FR2` 把隔离边界放在表面上；FR10 让包含区域的 Overlay 或 `useOverlay` 容器成为该边界的所有者。
- `spec:AST-017/FR5` 将此归类为非破坏性：它新增一个组件，不改变任何默认值，从不渲染区域的调用方不会看到任何变化。

## Verification map

| 契约                          | 验证                                                                                          | 代表性状态                                                                                                              | 变更或失败预期                                                                                         | 审计章节                 |
| ----------------------------- | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------ |
| FR1, FR2, FR6, FR11           | `Overlay.test.tsx` 区域测试套件                                                               | Overlay 与 `useOverlay` content 中的区域；在 `bottom` Overlay 中；在任何 Overlay 之外；越界与非有限输入；指针与按键事件 | 未钳制的取值、遮罩之外的区域、条带中被放置的区域或缺失的警告、或自行移动的区域，均失败。               | `audit:Overlay/api`      |
| FR3, FR4, FR5, FR7, FR8, FR10 | Overlay 区域故事的 play 函数中的真实 Chromium 断言                                            | 每个预设；开放带尺寸、边缘钳制与内容定尺寸；调整后的表面；RTL；位于定位控件之前的区域                                   | 区域偏离其位置超过 0.5px、未翻转的角落或翻转了的开放区域、区域中心处命中流内控件、或隔离错误，均失败。 | `audit:Overlay/layout`   |
| FR9                           | `Overlay.test.tsx` 带区域的显示用例                                                           | `isOpen={false}`                                                                                                        | 遮罩之外的区域，或未变为惰性的已关闭遮罩，均失败。                                                     | `audit:Overlay/api`      |
| AR1, AR2                      | `Overlay.test.tsx` 对区域元素的 DOM 检查                                                      | 文本内容                                                                                                                | 区域元素上除 `class` 与 `style` 之外的任何属性，或它添加的文本，均失败。                               | `audit:Overlay/a11y`     |
| AR3                           | 区域移动故事的 play 函数                                                                      | 媒体上的方向键与单次激活，LTR 与 RTL                                                                                    | ArrowRight 把区域向左移动，或激活未把区域移到被激活的点，均失败。                                      | `audit:Overlay/a11y`     |
| PR1                           | 对 `OverlayRegion` 的源码审查                                                                 | 所有输入                                                                                                                | 为放置而添加的 ref 读取、观察器、监听器或 Effect，审查失败。                                           | `audit:Overlay/layout`   |
| RTL 关系                      | `Overlay / Bottom strip` 上的 RTL 审计精选 D4 目标（`apps/storybook/rtl-audit/targets.json`） | 起始对齐的遮罩内容；LTR 与 RTL                                                                                          | 起始对齐的内容在 RTL 中未移到其容器的镜像侧，D4 失败。                                                 | `audit:Overlay/i18n-rtl` |

## Decision log

<!-- Record the boundary or requirement, not how it was reached. A rejected alternative is at most one line here, kept only when it is consequential and likely to recur. -->

### DEC-1 — Several placed items are Overlay regions with one `position` prop

**参考：** `component:Overlay/DEC-1`

**决策者：** cixzhang, 2026-10-22

Overlay 放置一个内容块，因此有多个位置的表面需要一个能自行放置的子元素。位于 Overlay content 中的 `OverlayRegion` 继承 Overlay 的表面、显示行为与媒体主题，无需新增 Overlay 属性；一个 `position` 属性覆盖两类位置：命名位置或开放式放置。尺寸位于开放式放置对象内部，因此区域从不携带 `width` 或 `height` 属性——这些属性的数字表示分数，而同样的名字在 Card、Button 与 Grid 上表示像素。

已否决：Overlay 自身 `position` 的对象形式，因为它仍然只放置一个块。

### DEC-2 — Presets reuse Overlay's places and add the center and corners

**参考：** `component:Overlay/DEC-2`

**决策者：** cixzhang, 2026-10-22

`fill`、`top` 与 `bottom` 在区域上的含义与在 Overlay 上相同，因此构建者只需读一套词汇。静态徽章与标签需要中心与角落，而 Overlay 的单个块无法在其他内容旁边容纳它们。角落使用 `start` 与 `end`，因为起始侧的徽章在任一方向上都位于起始侧。

### DEC-3 — Moving a region stays at the callsite

**参考：** `component:Overlay/DEC-3`

**决策者：** cixzhang, 2026-10-22

移动区域意味着什么因产品而异：位置是在释放时提交还是实时提交、键盘步长、吸附、哪些区域移动，以及媒体新的渲染加载期间会发生什么。因此 Overlay 从不移动区域；调用方把指针与键盘输入转换为相对于区域参考盒测量的新分数，再传回。

已否决：在 Overlay 上提供拖拽钩子，因为共享的拖拽原语需要自己的记录，并且需要不止一个调用方的需求。

### DEC-4 — Regions belong to fill overlays

**参考：** `component:Overlay/DEC-4`

**决策者：** cixzhang, 2026-10-22

在高度跟随自身内容并会滑入滑出的条带内部，媒体上的位置没有意义。条带也是其内部一切内容的包含块，因此 CSS 无法从那里把区域相对于媒体放置。因此在条带 overlay 中，区域把自身内容作为普通条带内容渲染，并在开发环境中警告，从而让内容保持可见。公共类型无法强制该规则，因为区域是通过 `content` 传入的。同样的兜底适用于任何填充宿主之外，在那里没有可供测量的表面，也没有任何东西可以隔离区域的绘制顺序。

已否决：把条带的区域相对于容器放置，因为要脱离条带需要第二层渲染层，而它会重复 Overlay 的显示逻辑。

### DEC-5 — Open sized axes are clamped inside; content-sized axes are not

**参考：** `component:Overlay/DEC-5`

**决策者：** cixzhang, 2026-10-22

带尺寸的区域可以通过对给定分数做算术而保持在表面内部，因此无论移动多远都不会溢出媒体。要让内容定尺寸的区域保持在内部，则需要测量它，而 PR1 禁止这样做，因此容器会裁剪任何溢出。

### DEC-6 — Open placement names the region's top-left corner

**参考：** `component:Overlay/DEC-6`

**决策者：** cixzhang, 2026-10-22

`x` 与 `y` 是区域的左上角，`width` 与 `height` 向右和向下延展。这与服务器和编辑器报告盒的方式（left、top、width、height）以及 CSS 内缩的读法一致，因此报告的盒无需转换即可直接通过，并用普通算术钳制。

已否决：以区域的中心为基准，因为每个报告的盒都需要转换。

## Open questions

无。

## Content boundary

本文件不重复使用方属性表/示例、当前审计结果、实现步骤或家族/系统规则。它链接到它们的所有者。
