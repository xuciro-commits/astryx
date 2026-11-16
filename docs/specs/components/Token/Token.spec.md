---
schema_version: 3
template_version: 7
kind: component
id: component:Token
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Token/Token.test.tsx,
    packages/core/src/hooks/nestedTouchPress.adopters.test.tsx,
    packages/core/src/Token/__tests__/TokenRemoveTarget.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    packages/core/src/theme/extensibleAxes.test.ts,
    apps/storybook/stories/Token.stories.tsx,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
system_specs: [spec:AST-005, spec:AST-009, spec:AST-085]
---

# Token component contract

## Contract at a glance

| 领域            | 契约                                                                                                                                                                                    |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公共契约        | 一个内联 chip，包含必填字符串 `label`、`size`、主题可扩展的 `color`、可选的 `icon` 与 `endContent`，以及可选的 `onClick`、`href` 与 `onRemove` 交互。                                   |
| 行为            | `href` 渲染为链接；`onClick`（或外层触发上下文）渲染为一个容器，其内部 button 包裹标签；`onRemove` 在它们旁边（绝不嵌套在其中）添加一个独立的 Remove 按钮。                             |
| 最终用户影响    | 指针用户可以激活整个 chip；键盘与屏幕阅读器用户会把 chip 的动作与其移除动作作为两个独立、具名的控件来触达。                                                                             |
| 构建者影响      | 无；本记录描述的是已发布行为。                                                                                                                                                          |
| 兼容性/就绪状态 | 以当前状态记录已发布行为；没有 API、默认值或输出变更。四个实现缺口列在 Current-state impact 一节下。                                                                                    |
| 审查检查        | 拒绝以下情形：嵌套在链接或内部 button 中的移除按钮、小于 24 by 24 CSS 像素的移除目标、原生 `disabled` 属性，或绕过共享目标地址规则的 token。                                            |
| 管辖规则        | `family:navigation-destinations`；`spec:AST-005`；`spec:AST-085/FR1,FR2,FR5`；`architecture:public-component-api/INV5,INV6,INV8`；`architecture:component-theming-surface/INV6,INV14`。 |

本表是审查用的投影；以下正文具有权威性。

## Intent

Token 把一条离散的关联数据——一个标签、一个过滤器、一个已选收件人——表示为一个紧凑的内联 chip。它拥有该 chip 的几何与色调、静态/可点击/链接三种结构的选择，以及 chip 自身动作旁边的移除动作。

## Compatibility and migration

- 已发布默认值保留：`yes`
- 兼容性分类：没有公开 prop 或默认值变更。DOM 与样式输出有变化：不含从右到左字母的纯文本标签会获得 `dir="ltr"`，并且标签会隔离其文本（`unicode-bidi: isolate`）
- 受控/非受控行为：不适用；Token 不持有状态
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **`onClick` 与 `href` 同时提供（FR3）。** 当 token 渲染为链接时，提供的 `onClick` 不会被附加或调用，而 `architecture:public-component-api` INV5 要求保留已接受的事件输入。
- **通用容器上的隐藏标签名称（AR3）。** 使用 `isLabelHidden` 时，静态、可点击或链接加移除的 token 会把 `aria-label` 放在一个没有 role 的 `span` 上，而 WAI-ARIA 1.2 禁止为通用 role 命名。视觉隐藏的标签文本仍能到达辅助技术。
- **Remove 上的两个焦点指示器（AR4）。** 在可点击与链接加移除的 token 中，键盘焦点落在 Remove 按钮上时会同时绘制 token 的轮廓与按钮自身的轮廓，而 `architecture:interaction-modality` INV3 规定每次焦点移动只允许一个指示器。
- **过小的移除目标（AR6）。** 在 `size="sm"` 时，token 的 20px 块高与被裁剪的溢出会把 Remove 按钮的命中区域压到 24 by 20 CSS 像素，低于 WCAG 2.2 2.5.8 要求的 24 by 24。

## Ownership boundary

**拥有**

- token 根元素、其 Icon 与 End content 插槽、Label，以及 Remove 按钮。
- 尺寸几何、色调、标签溢出，以及禁用态处理。
- 选择静态、可点击、链接或链接加移除结构，以及可点击与链接加移除结构中的表面点击委托。
- Remove 按钮的名称、目标尺寸，以及它与 token 自身动作的隔离。
- 为承载 token 的字段标记自身的 Remove 按钮。Token 只通过其所有方模块 `privateAttributes/tokenRemove.stylex.ts`（`architecture:public-component-api` INV23）写入私有属性 `data-astryx-token-remove`。Tokenizer 读取该标记，以区分 Token 自身的 Remove 与自定义 `renderToken` 绘制的控件。

**不拥有 / 非目标**

- 导航目标地址的安全与路由替换——由 `family:navigation-destinations` 与 `spec:AST-005` 拥有；Token 通过共享链接组件渲染其链接。
- 哪些外层上下文会使 token 成为触发器——由共享的交互 role 上下文拥有；Token 只消费已解析的 role。
- 悬停与按下覆盖层以及触摸按下时序——由每个可按压表面使用的共享交互覆盖层拥有。
- 所提供 icon 与 end content 自身的语义——由这些节点拥有。
- token 集合、token 输入以及键盘删除——由 `component:Tokenizer` 与其他组合组件拥有。

## Public concepts

| 概念            | 封闭值或状态                                                                                                | 含义                                                | 按变体/朝向/状态的可用性                                  | 默认值    | 拥有者            | 稳定性 | 非法值行为                                                                                   |
| --------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------------------------------------- | --------- | ----------------- | ------ | -------------------------------------------------------------------------------------------- |
| 结构            | 静态；可点击；链接；链接加移除                                                                              | 由哪个元素拥有 token 自身的动作（FR2–FR4）。        | 由 `href`、`onClick`、`isDisabled` 以及外层触发上下文解析 | 静态      | `component:Token` | 稳定   | 禁用链接 token 仍是一个可聚焦控件，并暴露其禁用状态（FR5）。                                 |
| 尺寸            | `sm`、`md`、`lg`                                                                                            | 选择块高。                                          | 所有结构                                                  | `md`      | `component:Token` | 稳定   | TypeScript 会拒绝其他值。                                                                    |
| 色调（`color`） | `default`、`red`、`orange`、`yellow`、`green`、`teal`、`cyan`、`blue`、`purple`、`pink`、`gray`；主题新增值 | 选择填充色与文字颜色。                              | 所有结构                                                  | `default` | `component:Token` | 稳定   | 主题新增值会反映在 `token` 上，且不会获得组件填充色或文字颜色；TypeScript 会拒绝未注册的值。 |
| 可移除          | 提供 `onRemove` 时存在；否则不存在                                                                          | 在标签与 end content 之后添加 Remove 按钮。         | 所有结构                                                  | 不存在    | `component:Token` | 稳定   | —                                                                                            |
| 标签可见性      | 可见；视觉隐藏                                                                                              | 在视觉上隐藏标签，同时保留其作为 token 名称的作用。 | 所有结构                                                  | 可见      | `component:Token` | 稳定   | —                                                                                            |
| 禁用            | 启用；禁用                                                                                                  | 阻止所有 token 动作与移除动作。                     | 所有结构                                                  | 启用      | `component:Token` | 稳定   | —                                                                                            |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 依据           |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| FR1  | 内容按逻辑行内顺序渲染：Icon、Label、End content、Remove 按钮。根元素是 inline-flex，间距为 `--spacing-1`，行内内边距为 `--spacing-2`，圆角为 `--radius-inner`，字体为 `--text-supporting-size`、字重为 `--font-weight-medium`，最小块高为 `--size-element-sm`、`-md` 或 `-lg` 在 `sm`、`md`、`lg` 下减去 8px。该尺寸应随设定文本尺寸按 `spec:AST-102` FR4 增长；当前的固定尺寸是一个缺口。                                                                                                                           | 当前源码与测试 |
| FR2  | 在没有 `href`、`onClick` 或外层触发上下文时，token 是一个直接承载其内容的静态 `span`。                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试 |
| FR3  | 在有启用的 `href` 且没有 `onRemove` 时，token 根元素是承载目标地址的共享链接组件；它接受根 ref、透传 props，并拥有自己的 focus-visible 轮廓。提供的 `onClick` 作为已接受的事件输入，会到达拥有该契约的元素（`architecture:public-component-api` INV5）。实现缺口：在两种链接结构中 `onClick` 都未被附加或调用（见 Current-state impact）。                                                                                                                                                                            | 当前源码与测试 |
| FR4  | 在提供 `onClick`，或外层触发上下文把 token 解析为 button 时，根元素是一个 `span` 容器，内部 `button` 只包裹 Label 并调用 `onClick`；在容器上、任何嵌套 button 或链接之外的点击也会调用 `onClick`，但在打开的 Tooltip 或 HoverCard 表面内的点击除外（`component:Tooltip` FR11）。在有启用的 `href` 和 `onRemove` 时，容器改为持有只包裹 Label 的内部链接；在 Remove 按钮之外的表面上普通点击会跟随该链接，Cmd/Ctrl 点击或中键点击表面会在新标签页中打开它。调用方在链接加移除容器上的 `onMouseUp` 会在其委托之前运行。 | 当前源码与测试 |
| FR5  | 禁用 token 以半透明渲染、关闭指针事件，并且不会因指针、Enter 或 Space 触发 `onClick` 或 `onRemove`；内部按钮与 Remove 按钮保持可聚焦，带 `aria-disabled="true"`，且绝不获得原生 `disabled`。禁用控件保留其 Tab 停靠点并暴露其禁用状态（`spec:AST-085` FR1、FR5），且禁用状态反映在所属目标上（`architecture:component-theming-surface` INV6）。带 `href` 且没有 `onClick` 或触发上下文的禁用 token 会渲染为可聚焦链接，带 `aria-disabled="true"` 且没有 `href`，并且每种结构都会在 `token` 目标上反映禁用状态。       | 当前源码与测试 |
| FR6  | `onRemove` 会渲染一个 `type="button"` 的 Remove 按钮，内含关闭字形；点击会在 `onRemove` 运行之前停止传播，因此它绝不会触发 token 自身的动作或链接。该按钮是内部 button 或链接的兄弟节点，绝不嵌套在其中。从 Remove 按钮或 end content 中的控件开始的指压不会在 token 上绘制按压效果，因为它不会运行 token 自身的动作；鼠标按压则保留 token 的 `:active` 绘制。                                                                                                                                                        | 当前源码与测试 |
| FR7  | 标签绝不换行：根元素以容器的行内尺寸为上限并裁剪溢出。在静态与链接结构中，Label 以省略号结尾；在可点击与链接加移除结构中，内部控件裁剪 Label 但不加省略号。`isLabelHidden` 会让 Label 以视觉隐藏的裁剪处理保留在 DOM 中。                                                                                                                                                                                                                                                                                             | 当前源码与测试 |
| FR8  | `color` 默认为 `default`，以主文本色绘制 `--color-neutral`；其他每个内置色调都会以带色调的背景搭配与之匹配的彩色文本绘制。`token` 目标会为每个值反映已解析的 `color` 和 `size`，包括主题新增的颜色，在主题为其上色之前，它不会获得组件填充色或文字颜色。                                                                                                                                                                                                                                                              | 当前源码与测试 |
| FR9  | 可点击与链接结构会在支持悬停的指针下绘制共享悬停覆盖层，并为鼠标与触摸按压绘制共享按压覆盖层；静态结构两者都不绘制。                                                                                                                                                                                                                                                                                                                                                                                                  | 当前源码       |
| FR10 | `ref` 会到达每种结构的根元素。受支持的 DOM、ARIA、data 与事件 props 会到达根元素，但在可点击结构中，`aria-labelledby`、`aria-describedby`、`aria-haspopup` 和 `aria-expanded` 会到达内部 button，即拥有 token 动作的元素（`architecture:public-component-api` INV5）；`data-testid` 到达根元素；`xstyle`、`className` 和 `style` 按此顺序在组件样式之后合并。                                                                                                                                                         | 当前源码与测试 |

### Allowed variation

- **AV1 — 主题绘制。** 主题可以按 `color` 和 `size` 更改 `token` 的视觉属性，而不改变结构、插槽顺序或 Remove 按钮的目标。
- **AV2 — 路由链接。** `LinkProvider` 的链接组件可以在 `family:navigation-destinations` 下的链接结构中替换原生锚点。

### Representative states

| 状态       | 必需不变式                                                                                                                                         | 允许的变化             |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 静态       | `span` 根元素；除 Remove 按钮外，Token 不添加任何可聚焦元素。                                                                                      | 色调、尺寸、插槽。     |
| 可点击     | 一个内部 button，其名称来自标签、调用方的 `aria-labelledby`，或在 PowerSearch 内部来自过滤 token 的完整可见文本（AR2）；容器点击会调用 `onClick`。 | End content。          |
| 链接       | 根元素即链接；焦点轮廓绘制在链接自身上。                                                                                                           | 路由链接组件。         |
| 链接加移除 | 容器持有链接与兄弟 Remove 按钮；表面点击会激活链接。                                                                                               | 修饰键点击与中键点击。 |
| 可移除     | Remove 按钮名为 “Remove {label}”（在 PowerSearch 内部，基于完整可见文本，AR2），目标为 24 by 24 CSS 像素。                                         | 语言区域措辞。         |
| 禁用可点击 | 按钮可聚焦且带 `aria-disabled="true"`；不触发任何回调；半透明。                                                                                    | 色调。                 |
| 隐藏标签   | 标签文本视觉隐藏；根元素的 `aria-label` 等于标签内容。                                                                                             | 结构。                 |

### Transformation and precedence order

- **ORD1 — 结构。** 启用的 `href` → `onClick` → 外层触发上下文 → 禁用的 `href` → 静态。当 `onRemove` 与胜出的 `href` 同时存在时，选择链接加移除容器。禁用的 `href` 会让位于 `onClick` 和触发上下文；否则它保留链接结构，并渲染为禁用（FR5）。
- **ORD2 — 根属性。** 组件类名与 `data-color`/`data-size`/`data-disabled` → 组件样式 → `xstyle` → `className` → `style` → 调用方 props → `data-testid`、隐藏标签的 `aria-label` 与 `aria-description`。隐藏标签的 `aria-label` 会替换调用方的 `aria-label`。
- **ORD3 — Remove 点击。** 停止传播 → `onRemove`。

### Performance and resources

- **PR1 — 共享按压控制器。** 每种结构都会通过其计数安装器在每次挂载时安装一次共享的文档级按压控制器；Token 不添加任何按 token 计的监听器、观察器或定时器。只有链接加移除容器持有用于点击委托的 ref。

## Accessibility contract

- **AR1 — 独立控件。** token 自身的动作与 Remove 按钮是按 DOM 顺序排列的两个独立可聚焦控件；二者互不嵌套，因此 HTML 的交互内容规则成立。
- **AR2 — 名称。** 在可点击与链接加移除结构中，内部 button 或链接的名称来自 Label，或在可点击结构中来自调用方的 `aria-labelledby`（FR10）。在链接结构中，链接即根元素，其名称来自其全部内容，包括 End content（一个带计数的标签 “Inbox” 读作 “Inbox 12”）。Remove 按钮的名称由已翻译的 “Remove {label}” 字符串提供。在 PowerSearch 内部，其过滤 token 会在 Label 之后显示值，过滤 token 的内部 button 以完整可见文本命名，其 Remove 按钮则以作用于该文本的同一翻译字符串命名。
- **AR3 — 隐藏标签。** 使用 `isLabelHidden` 时，Label 文本仍留在无障碍树中并为 token 命名，且没有通用 role 的元素携带名称（WAI-ARIA 1.2）。根元素携带等于标签的 `aria-label`。实现缺口：在静态、可点击和链接加移除结构上，该根元素是一个没有 role 的 `span`。
- **AR4 — 每次焦点移动一个焦点指示器。** 每次焦点移动只显示一个所属指示器（`architecture:interaction-modality` INV3）。链接根元素绘制自己的 focus-visible 轮廓；可点击与链接加移除容器为内部控件绘制轮廓，而内部控件自身不绘制；Remove 按钮绘制自己的轮廓。实现缺口：容器在任何后代具有 `:focus-visible` 时都会绘制其轮廓，因此在那些结构中聚焦 Remove 会同时显示容器轮廓与按钮自身的轮廓。
- **AR5 — 禁用。** 禁用 token 的控件保持可聚焦、暴露 `aria-disabled="true"`，并忽略指针、Enter 与 Space（`spec:AST-085` FR1、FR2、FR5），禁用链接也不例外。
- **AR6 — Remove 目标尺寸。** Remove 按钮的字形盒为 16 by 16 CSS 像素，其命中区域在每侧外扩 4 像素，在 `md` 和 `lg` 下达到 24 by 24，满足 WCAG 2.2 2.5.8，同时在其相邻标签上的按压在两个文本方向下仍会运行 token 自身的动作。实现缺口：在 `size="sm"` 时，20px 高的根元素裁剪了外扩部分，只留下 24 by 20 的目标。
- **AR7 — 描述。** `description` 会在根元素上设置 `aria-description`。

## Design relationships

| 解剖或状态   | 设计要求                                  | 表示权威       | 层级角色 | 组件契约           |
| ------------ | ----------------------------------------- | -------------- | -------- | ------------------ |
| token 根元素 | 一个紧凑 chip，其色调标识它所表示的数据。 | 当前源码       | 显著     | FR1, FR7, FR8      |
| Icon         | 可选的前置字形，标识 token 类型。         | 当前源码与文档 | 辅助     | FR1                |
| Label        | 可见文本与默认无障碍名称。                | 当前源码与文档 | 显著     | FR7, AR2, AR3      |
| End content  | 可选的后置内容，例如计数或状态圆点。      | 当前源码与文档 | 辅助     | FR1                |
| Remove 按钮  | 一个后置关闭控件，用于关闭 token。        | 当前源码与文档 | 辅助     | FR6, AR1, AR2, AR6 |

主题化：根元素是唯一的 `token` 目标，并反映 `color`、`size` 与禁用状态。Label、End content 和 Icon 不添加目标；Remove 按钮继承 token 的文字颜色。

## Family and system relationships

- `family:navigation-destinations` 与 `spec:AST-005` 拥有两种链接结构的目标地址检查（包括委托的表面点击）；Token 通过共享链接组件与可点击容器委托采用它们。
- `spec:AST-085` 拥有可聚焦的禁用控件；FR5 与 AR5 记录 Token 的符合情况。
- `architecture:public-component-api` 拥有 ref、透传与样式输入规则；FR3 记录了一处针对 INV5 的缺口。
- `architecture:component-theming-surface` 拥有 `token` 目标与可扩展的 `color` 轴；FR8 记录了未主题化时的回退。
- `architecture:interaction-modality` 拥有模态与焦点指示器所有权；AR4 记录了由哪个元素绘制 Token 的指示器。

## Verification map

| 契约                          | 验证                                                                                  | 代表性状态                                                                                                          | 变异或失败预期                                                                                                                                                     | 审计小节               |
| ----------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------- |
| FR2, FR10                     | `Token.test.tsx` 的渲染、ref 与透传测试套件                                           | 静态、可点击与链接根元素；调用方 props；在可点击 token 与禁用链接 token 上的调用方命名                              | 错误的根元素、脱离的 ref、被丢弃的调用方 prop，或可点击 token 的 `aria-labelledby` 留在其根元素上，都会使 DOM 断言失败。缺口：没有测试覆盖链接加移除容器上的 ref。 | `audit:Token/behavior` |
| FR1, FR7                      | 浏览器中 `Token.stories.tsx` 的尺寸、icon 与 end-content 测试夹具                     | 尺寸、icon 与 end content                                                                                           | 缺口：尺寸与溢出的单元测试只断言存在，且没有 story 渲染长标签；插槽顺序与块高仅在渲染后的测试夹具中可见，省略号没有检查。                                          | `audit:Token/layout`   |
| FR3, FR4, FR6, AR1            | `Token.test.tsx` 的链接、可点击与链接加移除测试套件                                   | 链接、可点击、链接加移除、修饰键点击与中键点击                                                                      | 嵌套 Remove 按钮、从 Remove 触发 token 动作，或丢失委托都会失败。缺口：没有测试断言 `onClick` 在带 `href` 时被丢弃。                                               | `audit:Token/behavior` |
| FR5, AR5                      | `Token.test.tsx` 的禁用测试                                                           | 带移除的禁用可点击；禁用静态；带与不带移除的禁用链接                                                                | 原生 `disabled`、丢失的 Tab 停靠点、带目标地址的禁用链接、未反映的禁用状态，或被触发的回调，都会失败。                                                             | `audit:Token/a11y`     |
| AR2, AR3, AR7                 | `Token.test.tsx` 的无障碍测试套件                                                     | Remove 名称、隐藏标签、描述                                                                                         | 缺失的移除名称、丢失的隐藏标签或缺失的描述都会失败。缺口：没有测试断言链接结构的内容派生名称。                                                                     | `audit:Token/a11y`     |
| AR6                           | `TokenRemoveTarget.a11y.chromium.spec.ts`                                             | 预设的过滤 token（默认尺寸）、LTR 与 RTL                                                                            | 未覆盖自身 X 边缘或吞掉标签按压的移除目标会在真实 Chromium 中失败。缺口：未覆盖 `sm` 的裁剪。                                                                      | `audit:Token/a11y`     |
| FR8                           | `Token.test.tsx` 的自定义颜色测试；`extensibleAxes.test.ts`；`themingTargets.test.ts` | 主题新增颜色；映射接线                                                                                              | 丢弃 `color` 反映会失败。缺口：没有测试断言 `data-size` 或任何色调的绘制；这些仅在 `Token.stories.tsx` 中可见。                                                    | `audit:Token/theming`  |
| FR9, AR4                      | 浏览器中 `Token.stories.tsx` 的可点击与链接测试夹具                                   | 悬停、按压、token 上的键盘焦点                                                                                      | 缺口：没有自动化检查覆盖覆盖层或指示器，且没有 story 渲染带 Remove 的可点击或链接 token，因此 Remove 上的双重指示器没有测试夹具。                                  | `audit:Token/design`   |
| PR1                           | 源码审查                                                                              | 每种结构                                                                                                            | 缺口：如果 Token 添加了按 token 计的监听器、观察器或定时器，没有自动化检查会失败。                                                                                 | `audit:Token/behavior` |
| AR2, AR3, AR5, AR7            | 无障碍树证据（`spec:AST-009` FR3）                                                    | 每种结构；隐藏标签；描述；禁用                                                                                      | 缺口：没有无障碍树检查能证明计算名称、隐藏标签名称、描述或禁用状态；单元测试只断言 DOM 属性。                                                                      | `audit:Token/a11y`     |
| `design:bidirectionality` DR2 | `MixedDirectionText.a11y.chromium.spec.ts`                                            | 在 RTL 与 LTR 下的 `https://`、`.com`、`+3`、`@alice`、`iPhone جديد` 与 `example.com موقع`（Mixed Direction story） | 若标签中的弱字符或中性字符在 RTL 下重排（`//:https`、`com.`、`3+`、`alice@`），或含前导拉丁词的从右到左文本被按从左到右排版，都会在逐字符的渲染位置上失败。        | `audit:Token/layout`   |

## Decision log

无记录。本记录描述的是已发布行为。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审计结果、实现步骤或 family/system 规则。它链接到它们的拥有者。
