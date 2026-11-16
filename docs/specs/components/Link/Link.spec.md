---
schema_version: 3
template_version: 7
kind: component
id: component:Link
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-26
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, navigation]
verified_by:
  [
    packages/core/src/Link/Link.test.tsx,
    packages/core/src/Link/__tests__/Link.a11y.test.tsx,
    packages/core/src/Link/__tests__/Link.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.ancestor-clamp.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.hoverColor.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.longLabel.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.navigation.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.truncation.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/Link.wrappedLines.a11y.chromium.spec.ts,
    packages/core/src/Link/__tests__/LinkAudit.a11y.chromium.spec.ts,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: [design:user-states]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-005, spec:AST-085]
---

# Link component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | 无变化。Link 接受 `href`、`as`、`label`、`onClick`、`isDisabled`、`isExternalLink`、`newTabLabel`、`target`、`rel`、`download`、`referrerPolicy`、`hasUnderline`、`isStandalone`、`tooltip`、Text 的 props 以及 `children`。                                                                                           |
| Behavior                | 已启用且设置了 `href` 的 Link 是由 `as`、然后是 `LinkProvider`、最后是原生锚点渲染出的链接。否则它是链接样式的 `<button>`，但继承的 link 角色会渲染链接组件，而设置了 `href` 且没有 `onClick` 的禁用 Link 会渲染为普通锚点，除非继承的 button 角色使其成为禁用 `<button>`（FR1）。禁用的 Link 保持可聚焦且不响应交互。 |
| End-user impact         | 人们获得统一的链接外观，用于导航和链接样式的操作。键盘和读屏用户能够到达禁用的 Link，并听到它已被禁用。没有 `label` 的外部链接会宣告其将在新标签页中打开。                                                                                                                                                             |
| Builder impact          | 主题通过 `link` target 重新设定 Link 标签的颜色；`text` target 的颜色不再影响到它。                                                                                                                                                                                                                                    |
| Compatibility/readiness | 记录已发布的行为；无 API、默认值或 DOM 变更。聚焦的、带 `href` 的链接变为禁用时会失去焦点；这一项列在当前状态影响之下。                                                                                                                                                                                                |
| Review checks           | 拒绝会导航、运行 `onClick` 或离开 Tab 顺序的禁用 Link；拒绝没有 `noopener noreferrer` 的 `_blank` target；拒绝没有新标签页文本的外部链接；拒绝被拒绝的目标到达路由。                                                                                                                                                   |
| Governing rules         | `family:navigation-destinations` FR1–FR7；`spec:AST-005`；`spec:AST-085` FR1、FR2、FR4、FR5；`architecture:interaction-modality` INV1；`design:user-states` DR1、DR2。                                                                                                                                                 |

本表是审查投影；下方正文具有权威性。

## Intent

Link 是带样式的导航链接。它决定渲染链接还是链接样式的按钮，保持禁用的链接可到达且不响应交互，为外部链接增加新标签页安全性与宣告，并设置链接的排版与颜色。使用方用法见 `Link.doc.mjs`。

## Compatibility and migration

- 已发布的默认值得到保留：`yes`；`color="accent"`、`type="body"`、`display="inline"`、`maxLines={0}`、静止时无下划线
- 兼容类别：记录已发布的行为；无公共 prop、默认值、导出或 DOM 变更；标签继承根的颜色，因此主题通过 `link` target 而不是 `text` target 重新设定 Link 的颜色
- 受控/非受控行为：不适用
- 迁移决策：无

使用方迁移说明属于使用方文档与发行说明。

## Ownership boundary

**Owns**

- 渲染出的元素：链接组件、禁用锚点或链接样式的按钮。
- 每种元素形态的禁用可操作性。
- `target` 与 `rel` 的安全性，以及外部链接图标和新标签页文本。
- 链接排版（通过 Text）、颜色、下划线、悬停、按下与聚焦绘制。
- `link` target。

**Does not own / non-goals**

- 目标接受与自定义路由交接——由 `family:navigation-destinations` 和 `spec:AST-005` 通过共享链接边界拥有。
- 子树链接组件——由 `component:LinkProvider` 拥有。
- 文本排版与截断——由 `component:Text` 拥有。
- Tooltip 行为——由 `component:Tooltip` 拥有。
- `useLinkify` 和 `useLinkComponent`——没有自己模块记录的公共 hooks；除上文用法外，此处不作约定。
- 按钮表面链接——由 `component:Button` 的链接模式拥有。

## Public concepts

| Concept       | Closed values or states                                                                      | Meaning                                  | Availability by variant/orientation/state                                                 | Default               | Owner            | Stability | Invalid-value behavior                                                   |
| ------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------- | ----------------------------------------------------------------------------------------- | --------------------- | ---------------- | --------- | ------------------------------------------------------------------------ |
| Element form  | link、禁用锚点、button                                                                       | Link 渲染的内容（FR1）。                 | 由 `href`、`onClick`、`isDisabled` 和继承的交互角色推导。                                 | 设置 `href` 时为 link | `component:Link` | Stable    | 被拒绝的目标渲染为不响应的锚点（`family:navigation-destinations` FR6）。 |
| External link | off、on                                                                                      | 在新标签页中打开，带图标和新标签页文本。 | link 与禁用锚点形态。                                                                     | off                   | `component:Link` | Stable    | 不适用。                                                                 |
| Color         | `primary`、`secondary`、`accent`、`disabled`、`placeholder`、`inherit`，以及增强的 Text 颜色 | 链接文本颜色。                           | 每种形态。                                                                                | `accent`              | `component:Link` | Stable    | 增强颜色只为 Text 上色；根不为其绘制任何颜色。                           |
| Underline     | 悬停时、始终                                                                                 | 下划线显示的时机。                       | 启用的形态在悬停时加下划线；`hasUnderline` 在每种形态下均在静止时加下划线，包括禁用形态。 | 悬停时                | `component:Link` | Stable    | 不适用。                                                                 |
| Standalone    | off、on                                                                                      | 运行文本之外的正文尺寸。                 | 每种形态。                                                                                | off                   | `component:Link` | Stable    | 不适用。                                                                 |

## Behavioral and layout contract

| ID   | Invariant                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Basis                                                                                        |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| FR1  | 元素形态，按顺序：(a) 设置了 `href` 且已启用 → 来自 `as`、然后是 `LinkProvider`、最后是原生锚点的链接组件，带有 `href`、`target`、`rel` 和 `onClick`。(b) 否则，设置了 `onClick` → `<button type="button">`。(c) 否则由继承的交互角色决定：`button` → `<button type="button">`，`link` → 链接组件，或禁用时使用 (d) 的禁用锚点。(d) 否则，设置了 `href` 且已禁用 → 没有 `href` 的普通 `<a role="link">`；否则为 `<button type="button">`。                                                                                                                                                                                                                                                                                                                                                                              | `family:navigation-destinations` FR1、FR2；当前源码与测试                                    |
| FR2  | `isExternalLink` 设置 `target="_blank"`。只要 `target` 为 `_blank`，`rel` 除每个调用方 token 外还包含 `noopener` 和 `noreferrer`。`download` 和 `referrerPolicy` 到达元素。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `family:navigation-destinations` FR5、AV4；当前测试                                          |
| FR3  | 未渲染为按钮的外部 Link 显示一个尾随的超小外部链接图标，该图标继承根的颜色，其后是视觉隐藏的新标签页文本：`newTabLabel`，否则为本地化默认值。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           | 当前源码与测试                                                                               |
| FR4  | 目标仅通过共享导航规则到达链接组件；被拒绝的目标渲染为不响应的锚点，且从不调用路由。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | `family:navigation-destinations` FR1–FR6；`spec:AST-005`                                     |
| FR5  | 禁用的 Link 保持可聚焦并带有 `aria-disabled="true"`，从不导航，也从不运行 `onClick`。禁用锚点形态省略 `href`、`target` 和 `rel`，占据一个 Tab 停靠点，并跳过自定义链接组件。在每种形态中，点击会被取消并停止，Enter 和 Space 被抑制，其他按键到达调用方的 `onKeyDown`，且 Link 以半透明绘制，无指针事件且无按下绘制。变为禁用的聚焦 Link 必须保持焦点并在该元素上暴露该变化（`spec:AST-085` FR4、FR5），且调用方的 `aria-disabled` 或 `role` 不得替换禁用的暴露（`architecture:public-component-api` INV5）；调用方的 `tabIndex` 保留启用时的焦点顺序（`spec:AST-085` FR1）。FR5 缺口：带 `href` 的聚焦 Link 变为禁用时会被另一个元素替换，因此焦点落到页面上（`spec:AST-085` FR4）。                                                                                                                                   | `spec:AST-085` FR1、FR2、FR4、FR5；`family:navigation-destinations` FR7；当前测试            |
| FR6  | 子元素在 Text 内渲染，带有 `type`（默认 `body`）、`size`、`weight`、`color`（默认 `accent`；对于根绘制的颜色 FR7，标签继承它）、`display`（默认 `inline`）和 `maxLines`（默认 `0`）。根继承字体族、尺寸、字重、行高和文本对齐，并以小间距布局内容；它在容器处停止，其标签可以收缩，因此没有断行机会的标签（例如裸 URL）会在行内换行（`component:Text` FR3），而当 `maxLines` 大于 0 时，其 Text 会在受限的行内截断；`isStandalone` 在根上设置正文尺寸与前导。位于带 `maxLines` 的 Text 内的 Link 必须随该文本一起截断：此时其根在文本的行内以行内方式布局，除非 Link 设置了自己的 `display` 或 `maxLines`，或渲染为按钮，并保持其可见的聚焦环（内嵌环，`architecture:interaction-modality` INV1）。内容为块级的 Link 在受钳制的 Text 内不受支持，因为这会破坏钳制。Link 读取外层 Text 的钳制，从不读取其子元素（AV1）。 | 当前源码与测试                                                                               |
| FR7  | 根为六个内置颜色绘制所选颜色，下划线和外部图标采用该颜色。标签在静止和悬停时继承根的颜色；主题通过 `link` target 设置 Link 的颜色。在支持悬停的指针上，启用的 Link 在悬停时加下划线，并且对于 `primary`、`secondary` 和 `accent`，根颜色混入悬停色调，因此标签、下划线和图标保持同一颜色。`hasUnderline` 在静止时加下划线。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 当前源码与测试                                                                               |
| FR8  | 按下反馈遵循 `design:user-states` DR1 和 DR2 针对 Link 文本表面的规定：启用的链接或按钮形态绘制按下覆盖层，禁用的 Link 不绘制。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `design:user-states` DR1、DR2；当前测试                                                      |
| FR9  | `label` 非空时成为 `aria-label` 并取代内容成为可访问名称；调用方的 `aria-label` 会覆盖它；否则内容即为名称。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | 当前测试                                                                                     |
| FR10 | 使用 `tooltip` 时，Link 在 Tooltip 内渲染，该 Tooltip 在其上方打开。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 当前源码与测试                                                                               |
| FR11 | 根带有 `astryx-link` 并反映 `data-color`。`ref`、`className`、`style`、`xstyle` 以及其他 DOM props 到达根。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | `architecture:component-theming-surface`；当前测试；`architecture:public-component-api` INV5 |

### Allowed variation

- **AV1 — 内容。** `children` 可以是文本，也可以是图标等调用方内容；Link 不检查它。
- **AV2 — 路由器。** 共享边界接受的任何链接组件都可以渲染链接形态。

### Representative states

| State        | Required invariant                                                               | Allowed variation |
| ------------ | -------------------------------------------------------------------------------- | ----------------- |
| 原生链接     | 带 `href` 的锚点；accent 颜色；悬停时下划线。                                    | 颜色、下划线。    |
| 路由器链接   | 来自 `as` 或 `LinkProvider` 的链接组件收到被接受的目标。                         | 路由器。          |
| 外部链接     | `_blank`、`noopener noreferrer`、图标和新标签页文本。                            | `newTabLabel`。   |
| 按钮形态     | 样式为链接的 `<button type="button">`；运行 `onClick`。                          | —                 |
| 禁用链接     | 没有 `href` 的 `<a role="link" aria-disabled="true" tabindex="0">`；不响应交互。 | —                 |
| 禁用按钮形态 | `aria-disabled` 按钮；可聚焦；不响应交互。                                       | —                 |

### Transformation and precedence order

- **ORD1 — 元素形态。** FR1 的顺序 (a) → (d)。
- **ORD2 — 链接组件。** `as`，然后是 `LinkProvider`，最后是原生锚点；禁用锚点形态始终使用原生锚点。
- **ORD3 — Target 与 rel。** `isExternalLink` 覆盖 `target`；随后 `_blank` target 会向 `rel` 添加这两个安全 token。

### Performance and resources

- **PR1 — 无逐链接监听器。** Link 不添加全局监听器、观察者或测量；按下反馈使用共享文档控制器。

## Accessibility contract

- **AR1 — 角色。** 链接形态暴露 link 角色；禁用锚点形态显式设置 `role="link"`；按钮形态暴露 button 角色。
- **AR2 — 禁用。** 禁用的 Link 保留其 Tab 停靠点，并在可聚焦元素上暴露 `aria-disabled="true"`（FR5）；调用方的 `tabIndex` 保留启用时的焦点顺序（`spec:AST-085` FR1）。
- **AR3 — 新标签页。** 没有 `label` 的外部链接通过视觉隐藏文本宣告其将在新标签页中打开；图标不添加名称（FR3）。有 `label` 时，label 成为整个可访问名称（FR9），因此除非调用方的 label 说明了这一点，新标签页文本不会被宣告。
- **AR4 — 名称。** FR9。文本链接上的 `label` 会覆盖其可见文本。
- **AR5 — 焦点指示器。** 键盘焦点绘制共享的焦点轮廓；可见性遵循 `architecture:interaction-modality` INV1。

## Design relationships

| Anatomy or state | Design requirement                   | Representation authority | Hierarchy role | Component contract |
| ---------------- | ------------------------------------ | ------------------------ | -------------- | ------------------ |
| 标签             | 采用根的颜色；悬停时或始终加下划线。 | 当前源码与测试           | 主要           | FR6、FR7           |
| 外部图标         | 继承根颜色的超小尾随图标。           | 当前源码与测试           | 辅助           | FR3                |
| 禁用             | 半透明；无悬停、按下或指针交互。     | 当前源码与测试           | 辅助           | FR5                |

`design:user-states` 管辖 Link 的按下覆盖层（FR8）；没有其他设计记录管辖 Link。根携带 `link` target，它绘制标签、下划线和外部图标；标签是一个继承根颜色的 Text（`architecture:component-theming-surface` INV5）。使用方解剖结构不命名任何根部件，因此本记录不携带解剖-主题映射。

## Family and system relationships

- `family:navigation-destinations` 和 `spec:AST-005` 拥有目标处理（FR4）；Link 是成员，并保留自己的禁用语义（该 family 的 FR7）。
- `spec:AST-085` 拥有禁用可聚焦性；Link 在每种形态中都满足 FR1、FR2 以及 FR5 的稳态暴露，但不满足 FR4 或 FR5 中针对带 `href` 的聚焦链接的过渡条款（FR5 缺口）。
- `component:LinkProvider` 提供子树链接组件（ORD2）。

## Verification map

| Contract         | Verification                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | Representative states                                                                   | Mutation or failure expectation                                                                                                                                                                                                                                                                                 | Audit section              |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| FR1, AR1         | `Link.test.tsx` 的元素形式、`as`、provider 与继承角色用例；`Link.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                           | 原生、router、按钮形式、禁用、继承角色                                                  | 元素形式或角色错误即失败，包括在继承的交互式角色之下（FR1 (c)）。                                                                                                                                                                                                                                               | `audit:Link/anatomy`       |
| FR2, FR3, AR3    | `Link.test.tsx` 的 external、target、rel、`referrerPolicy`、labelled-name 与新标签页用例；`Link.a11y.chromium.spec.ts` 的 external 状态；`Link.hoverColor.a11y.chromium.spec.ts` 与 `LinkAudit.a11y.chromium.spec.ts`（external 图标取用根元素的颜色）                                                                                                                                                                                                                            | External；显式 `_blank`；自定义 label                                                   | 缺少安全 token、图标、新标签页文本或 `referrerPolicy` 即失败；带 `label` 但其名称并非仅为该 label 的 external 链接同样失败。颜色与根元素不同的 external 图标失败。证据缺口：没有测试断言 external 图标的尺寸。                                                                                                  | `audit:Link/accessibility` |
| FR4              | `Link.navigation.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                           | 被拒绝的方案与普通方案；原生、router、下载                                              | 被拒绝的目标仍然发生导航或到达 router 即失败。                                                                                                                                                                                                                                                                  | `audit:Link/behavior`      |
| FR5, AR2         | `Link.test.tsx` 的禁用与禁用暴露用例；`LinkAudit.a11y.chromium.spec.ts` 的禁用故事（半透明、无指针事件、无悬停涂装）                                                                                                                                                                                                                                                                                                                                                              | 禁用的 anchor；禁用的按钮形式；带 `onClick`；调用方 `aria-disabled` 与 `role`           | 导航、使用方的 `onClick`、丢失的 Tab 停靠点、禁用的链接上的自定义组件、调用方在 anchor 或按钮形式上替换禁用暴露的 `aria-disabled` 或 `role`、另一个按键未到达调用方的 `onKeyDown`，或禁用的 Link 不是半透明或接受指针事件，均失败。证据缺口：没有测试禁用处于焦点的链接，也没有测试传入调用方 `tabIndex`。      | `audit:Link/accessibility` |
| FR6 (type)       | `Link.test.tsx` 的文本类型与截断显示用例；`Link.wrappedLines.a11y.chromium.spec.ts`（换行文本的对齐）；`Link.longLabel.a11y.chromium.spec.ts`（200 px 列中的裸 URL label 会换行并保持在该列内，分别作为 anchor、button 和 external 链接）；`Link.ancestor-clamp.a11y.chromium.spec.ts`（`<Text maxLines={2}>` 内的默认 Link 是内联的，截断会穿过它；位于单行和两行截断内的 Link 会显示其内嵌焦点环的上下边缘；截断之外的组合 Link 保持其盒子与焦点轮廓）                          | 默认 `body`；`type="inherit"`；在起始对齐、从右到左和居中的行中换行的按钮与 anchor 形式 | 丢失 Text 的 `type` 即失败。`Link.truncation.a11y.chromium.spec.ts`：在固定宽度行中带 `maxLines={1}` 的 anchor 与 button Link 停在行末并绘制省略号。证据缺口：没有测试断言 `size`、`weight`、`color` 或 `display` 到达 Text，也没有断言 `isStandalone` 根尺寸。换行行与 anchor 形式对齐方式不同的按钮形式失败。 | `audit:Link/visual`        |
| FR6, FR7 (paint) | `Link.hoverColor.a11y.chromium.spec.ts`（悬停的 label、root 与 icon 共享同一计算颜色；静止颜色恢复）；`LinkAudit.a11y.chromium.spec.ts`（accent、primary、secondary 与 inherit 颜色的根在静止时涂装各自的 token，label 取用 accent、primary 与 secondary 颜色；`hasUnderline` 在静止时加下划线，不带它的 Link 仅在悬停时加下划线）；证据缺口：独立用例仅断言链接会渲染；证据缺口：没有测试渲染 `disabled` 或 `placeholder` 颜色；证据缺口：没有测试断言 label 取用 `inherit` 颜色 | 每种颜色；`hasUnderline`；`isStandalone`                                                | 与根元素不同的 label 颜色，或缺失或多余的下划线，均失败。                                                                                                                                                                                                                                                       | `audit:Link/visual`        |
| FR8              | `Link.test.tsx` 的按下状态套件                                                                                                                                                                                                                                                                                                                                                                                                                                                    | Link、按钮形式、禁用                                                                    | 无按下涂装，或禁用的 Link 上有按下涂装，均失败。                                                                                                                                                                                                                                                                | `audit:Link/behavior`      |
| FR9, FR11, AR4   | `Link.test.tsx` 的 label、`aria-label`、ref、主题类以及调用方 `className` 与 `style` 用例                                                                                                                                                                                                                                                                                                                                                                                         | 带与不带 `label`；`data-color`                                                          | 缺失或多余的 `aria-label`、target、`data-color` 或 ref 均失败。无障碍套件断言根元素上传入的 `data-*` 属性与 `aria-current`，导航套件断言 `download`。证据缺口：没有测试传入 `xstyle`。                                                                                                                          | `audit:Link/theming`       |
| FR10             | `Link.test.tsx` 的 tooltip 用例（tooltip 文本描述该链接）；证据缺口：没有测试断言 tooltip 在链接上方打开                                                                                                                                                                                                                                                                                                                                                                          | Tooltip                                                                                 | 不描述该链接的 tooltip 文本失败。                                                                                                                                                                                                                                                                               | `audit:Link/accessibility` |
| ORD1–ORD3        | 由 FR1–FR3 各行覆盖                                                                                                                                                                                                                                                                                                                                                                                                                                                               | —                                                                                       | —                                                                                                                                                                                                                                                                                                               | `audit:Link/behavior`      |
| PR1, AR5         | `LinkAudit.a11y.chromium.spec.ts` 的焦点用例（键盘焦点在 Link 上绘制轮廓）；证据缺口：没有测试断言不存在逐链接监听器                                                                                                                                                                                                                                                                                                                                                              | 键盘焦点下的默认、禁用和禁用按钮形式                                                    | 键盘聚焦的 Link 没有轮廓即失败。                                                                                                                                                                                                                                                                                | `audit:Link/accessibility` |

## Current-state impact

- **变为禁用（FR5）。** 带 `href` 的聚焦链接变为禁用时会被替换为纯禁用 anchor，或在带 `onClick` 时替换为 `<button>`，因此键盘焦点落到页面上，且该变化未在聚焦元素上暴露，违背 `spec:AST-085` FR4 与 FR5。
- **使用方文档。** `Link.doc.mjs` 的 anatomy 列出了 Left icon 与 Right icon 部件；Link 不渲染任何图标槽位，只渲染调用方内容与 external 图标（FR3）。

## Decision log

没有组件本地的决策。Link 适用 `family:navigation-destinations` 与 `spec:AST-085`。

## Open questions

无。

## Content boundary

本文件不重复使用方的 prop 表与示例、当前审查结果、实现步骤或 family/系统规则。它链接到这些内容的归属方。
