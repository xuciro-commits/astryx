---
schema_version: 3
template_version: 7
kind: component
id: component:BaseTypeahead
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-11-01
owners: [cixzhang]
review_triggers: [public-api, behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Typeahead/BaseTypeahead.test.tsx,
    packages/core/src/Typeahead/BaseTypeahead.incremental.test.tsx,
    packages/core/src/Typeahead/BaseTypeahead.menu.test.tsx,
    packages/core/src/Typeahead/__tests__/BaseTypeaheadMenu.a11y.chromium.spec.ts,
    packages/core/src/Typeahead/Typeahead.test.tsx,
    packages/core/src/Typeahead/BaseTypeahead.emptyState.a11y.chromium.spec.ts,
    packages/core/src/theme/themingTargets.test.ts,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:overlay-dismissal]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:layer-runtime,
  ]
contributing: []
system_specs:
  [spec:AST-020/FR15, spec:AST-058, spec:AST-085, spec:AST-086, spec:AST-092]
---

# BaseTypeahead component contract

## Contract at a glance

| 方面            | 契约                                                                                                                                                                                                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 公开契约        | 新增 DEC-1 的可选 `menu`（listbox 或 dialog 角色）与 `handleRef`（`open()`、`close()`）。BaseTypeahead 接受搜索源、受控的 `value` 与 `onChange`、`hasEntriesOnFocus`、`minQueryLength`、防抖、结果上限、`renderItem`、`size`、弹窗宽度、禁用相关的 props，以及用于输入框的 BaseProps。            |
| 行为            | 裸 combobox 输入框在达到字素阈值与防抖之后进行搜索，拒绝过期响应，并显示一个具名的 option listbox，支持键盘与指针选择；已完成的空搜索会显示一条消息（目前是一个被禁用的 option，即 FR4 缺口）。菜单也可以改为在列表周围放置信息，或显示一个具名 dialog，由它接管焦点并在关闭时归还（FR13–FR16）。 |
| 最终用户影响    | 用户通过打字找到并选中结果；屏幕阅读器用户会听到结果数量。原生禁用的输入框会失去 Tab 停靠点。                                                                                                                                                                                                     |
| 构建者影响      | 直接调用方负责可见的包装层、标签与聚焦环；Typeahead 与 Tokenizer 组合它。                                                                                                                                                                                                                         |
| 兼容性/就绪状态 | 增量式：没有 `menu` 与 `handleRef` 时，默认行为或 DOM 都不变。空搜索的 option、禁用期间的调用方处理器、原生 `disabled`，以及结果内容顺序都列在“当前状态影响”下。                                                                                                                                  |
| 审查检查项      | 拒绝以下情况：过期结果覆盖较新的结果、无效的 listbox、忙碌状态却没有恰好一个 Spinner、丢弃 BaseProps，或弹窗越过视口留白。                                                                                                                                                                        |
| 管辖规则        | `spec:AST-020` FR15；`spec:AST-085` FR1、FR2；`spec:AST-058` FR7、FR9；`spec:AST-086`；`spec:AST-092`；`family:overlay-dismissal`；`architecture:public-component-api`；`architecture:layer-runtime`。                                                                                            |

本表是审查用的投影；以下正文才是权威。

## Intent

BaseTypeahead 是 Typeahead 与 Tokenizer 之下对外导出的 combobox 引擎。它渲染裸输入框、搜索与引导行为、键盘导航、带样式的结果 listbox、加载反馈以及选中回调。直接调用方提供可见的输入包装层、无障碍名称与选中值的呈现。

## Compatibility and migration

- 已发布的默认行为保持：`yes`
- 兼容性类别：增量式。它新增可选的 `menu` 与 `handleRef` props 及其导出的类型（DEC-1）；没有它们时，默认行为或 DOM 都不变
- 受控/非受控行为：`value` 是受控的；查询文本是内部的
- 迁移决策：无；公开表面的清理是 OQ1 与 OQ2

使用方的迁移说明属于使用方文档与发布说明。

## Ownership boundary

**负责**

- 查询文本、搜索/引导调度、过期响应拒绝、结果排序、高亮与选中回调。
- combobox、listbox、option、busy、selected 与空结果语义。
- 锚定的结果弹窗，以及当前的 dropdown/空状态视觉处理。
- 菜单在两种角色下的层：定位、顶层、外部按压、Escape、焦点返回，以及将其与输入框绑定起来的 ARIA（FR13–FR16）。
- 当组合的包装层不接管忙碌指示通道时，直接调用方的加载反馈。

**不负责 / 非目标**

- 可见的输入包装层、标签呈现、字段边框或聚焦环。
- Typeahead 与 Tokenizer 中的选中值或 token 呈现。
- 调用方渲染的结果内容，以及调用方在列表周围或对话框内部的菜单内容。
- Spinner 的呈现，由 `component:Spinner` 负责。
- 共享的顶层托管、定位与关闭行为，由 `architecture:layer-runtime` 与 `family:overlay-dismissal` 负责。

## Public concepts

| 概念            | 封闭取值或状态                                             | 含义                                                           | 按状态可用性      | 默认值                   | 所有者                    | 稳定性 | 无效值行为                                                       |
| --------------- | ---------------------------------------------------------- | -------------------------------------------------------------- | ----------------- | ------------------------ | ------------------------- | ------ | ---------------------------------------------------------------- |
| selection       | `T` 或 `null`                                              | 由调用方控制的选中结果                                         | 所有状态          | 必需                     | `component:BaseTypeahead` | 稳定   | 调用方保持控制                                                   |
| search source   | `search`、`bootstrap`、可选的 `cancel`                     | 提供查询与聚焦结果                                             | 启用的输入框      | 必需                     | `component:BaseTypeahead` | 稳定   | 被拒绝的工作会清空当前结果                                       |
| focus bootstrap | 开或关                                                     | 在输入查询之前提供引导结果                                     | 空的已聚焦输入框  | 关                       | `component:BaseTypeahead` | 稳定   | 关闭时菜单保持关闭                                               |
| query threshold | 非负数                                                     | 搜索前所需的最小可见字符数                                     | 非空查询          | `1`                      | `component:BaseTypeahead` | 稳定   | 低于阈值会取消工作并关闭结果                                     |
| debounce        | 毫秒                                                       | 延迟查询搜索                                                   | 手动输入的查询    | `150`                    | `component:BaseTypeahead` | 稳定   | 非正值会立即执行                                                 |
| result cap      | 数字                                                       | 限制显示的已获取结果数                                         | 已完成的搜索/引导 | `10`                     | `component:BaseTypeahead` | 稳定   | 保留源顺序                                                       |
| result content  | 默认、`renderItem` 或 `item.element`                       | 选择稳定 option 行内部的内容                                   | 存在结果时        | 默认 TypeaheadItem       | 调用方与组件              | 稳定   | `item.element` 优先，但调用方 `renderItem` 会替换它（ORD1 缺口） |
| disabled state  | 原生或可聚焦禁用                                           | 阻止查询变更；原生禁用阻止一切激活                             | 禁用              | 原生禁用                 | 组件与调用方包装层        | 稳定   | 在可聚焦禁用生效前已打开的列表不会选中任何项，但仍可关闭         |
| popup width     | 固有宽度或固定像素                                         | 在视口夹取之前设置结果弹窗宽度                                 | 存在弹窗时        | 固有宽度，至少为锚点宽度 | `component:BaseTypeahead` | 稳定   | 视口适配优先                                                     |
| menu            | `listbox`（可选 `render`）或 `dialog`（`label`、`render`） | 锚定菜单显示什么：结果列表、带周围信息的列表，或接管焦点的内容 | 存在弹窗时        | `listbox`，仅列表        | 调用方与组件              | 稳定   | TypeScript 拒绝缺少 `label` 或 `render` 的 dialog                |
| open handle     | `open()`、`close()`；`onOpenChange` 报告                   | 以命令方式打开与关闭菜单；不存在受控的打开状态                 | 启用的输入框      | 关闭                     | `component:BaseTypeahead` | 稳定   | 在禁用字段上调用 `open()` 不产生任何效果                         |
| size            | `sm`、`md`、`lg`                                           | 选择 option 行的内边距                                         | 弹窗 option       | `md`                     | `component:BaseTypeahead` | 稳定   | TypeScript 拒绝其他取值                                          |

## Behavioral and layout contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | 依据                                                    |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| FR1  | 输入框由内部查询状态控制，而 `value` 由调用方控制；选中某个结果会调用 `onChange(item)`、清空查询与结果、关闭弹窗，并把焦点返回输入框；若某次选中在 `onChange` 中调用了句柄的 `open()`，则弹窗改为保持打开（FR16）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 当前源码与测试                                          |
| FR2  | 搜索仅在达到字素计数阈值时开始，使用配置的防抖，并且绝不为从未搜索过的查询呈现空结果。聚焦引导或重新加载若没有产出任何合格选项，或失败，则关闭列表；对于手动输入的查询，已完成的空搜索仍会显示 FR4 的消息。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 当前源码与测试                                          |
| FR3  | 较新的查询、选中、清除、源替换或卸载都会使过期的异步工作失效。弹窗被关闭时仍在进行的工作会直接结算，既不重新打开弹窗，也不让字段保持忙碌；针对未变查询的搜索结果会被保留供下次打开使用，而在该搜索仍在运行时打开会等待它。对于已不再是当前查询的列表（包括部分列表）会被丢弃（`spec:AST-092` FR4）。源被替换之后，在已关闭的字段上按 ArrowDown 会搜索替换后的源，而不是显示旧列表。查询的答案若在弹窗已关闭之后到达，只要弹窗保持关闭，就保留而不显示。下一次打开——通过 ArrowDown、焦点回到字段、指针按压或句柄的 `open()`——会显示保留的列表，只播报一次其数量（`spec:AST-092` FR8），并且仅当该查询的工作仍未完成时才处于忙碌。空答案只有是在一次关闭中被保留下来时，才会以这种方式重新打开弹窗。在一次关闭之后，若上述任一通路打开时字段文本尚未被搜索（防抖被清除或请求被中止），则启动该搜索（FR12）。 | 当前源码与测试；`spec:AST-092` FR4                      |
| FR4  | 在 listbox 角色下（FR13），弹窗是一个具名 listbox，其结果行是 option，且没有 option 显示时不设置 active descendant。已完成的空搜索的消息必须具有呈现性，并按 `spec:AST-056` AR1 的要求播报（`spec:AST-058` FR7）。实现缺口：该消息被渲染成一个被禁用的 option。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | APG combobox 模式；`spec:AST-058` FR7；当前源码与测试   |
| FR5  | 方向键让高亮循环；Home/End 移到第一个/最后一个 option；Enter 选中；Escape 与 Tab 隐藏当前弹窗，其中 Tab 继续移动焦点，并且在源工作待完成期间保持该关闭（FR3）；由 IME 拥有的按键事件不会激活 combobox 命令。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `spec:AST-020` FR15；当前源码与测试                     |
| FR6  | 待完成的异步源工作会设置 `aria-busy` 并渲染一个 Spinner，除非组合的包装层拥有忙碌指示通道；每次进入忙碌都只报告一次。弹窗在源工作待完成时被关闭之后，控件不再忙碌；下一次打开会显示该工作的最新列表（FR3）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | `family:input-fields`；`spec:AST-086`；当前测试         |
| FR7  | 受支持的 BaseProps DOM、ARIA、data、class、style、事件与 `xstyle` 输入会到达 combobox 输入框，而组件自有的 role、状态、值与行为保持权威；省略的旧别名保留其原生等价物，已定义的旧别名会覆盖它。直接调用方的 `onKeyDown` 先于内置按键处理运行，其中调用 `preventDefault()` 会跳过该处理（`architecture:public-component-api` INV7）；Typeahead 与 Tokenizer 用它实现各自的 Escape 与 Backspace 处理，并在内置处理之后运行其调用方的 `onKeyDown`（`component:Typeahead` FR9）。                                                                                                                                                                                                                                                                                                                              | `architecture:public-component-api` INV5–INV7；当前测试 |
| FR8  | 弹窗保持在 320 CSS px 的内联视口之内，包括很长的默认结果，以及所请求宽度大于可用视口的情况。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 当前源码                                                |
| FR9  | 禁用的输入框必须保持可聚焦并带 `aria-disabled`（`spec:AST-085` FR1），且除 focus 与 blur 之外的调用方处理器在禁用期间不得运行（FR2）。可聚焦禁用使用 `aria-disabled` 加 `readOnly`，并阻止文本与查询变更、打开列表，以及通过 Enter 或按压进行选中，包括对在它生效前就已打开的列表也如此；该列表仍可关闭，而它生效时正在进行的搜索工作会被丢弃。Typeahead 始终使用可聚焦禁用，Tokenizer 也如此，除非处于没有 `disabledMessage` 的 `unfocusedLayer` 模式，此时输入框仍为原生 `disabled`。实现缺口：默认的禁用模式是原生 `disabled`，它会移除 Tab 停靠点；而可聚焦禁用的输入框仍会运行调用方的 `onClick`、`onPointerDown` 与按键处理器。                                                                                                                                                                      | `spec:AST-085` FR1、FR2；当前源码与测试                 |
| FR10 | 搜索源可以在 `search()` 结算之前通过 `context.update` 为某个查询显示部分列表；typeahead 遵循 `spec:AST-092` FR1–FR10：它立刻显示部分列表并保持忙碌直到最终列表，随着后续列表追加而保持已显示的行与高亮不变，在 option 的 item 仍存在时保持其 id，每个查询只播报一次——在结算时，或若弹窗在其待完成时被关闭，则在下一次打开时（FR3）——答案失败时保留最后一个非空列表，并在后续列表移动已显示行时于开发环境发出警告。查询待完成期间弹窗被关闭之后，部分列表会让弹窗保持关闭且控件不忙碌；下一次打开会显示该查询的最新列表（FR3）。                                                                                                                                                                                                                                                                            | `spec:AST-092`                                          |
| FR11 | typeahead 面板尚未采用 option-action 网格：结果的 `action` 不被渲染，该行不带它显示，并在开发环境只警告一次（`spec:AST-058` FR9）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `spec:AST-058` FR9；当前源码                            |
| FR12 | 列表打开期间，起点与终点都在字段输入框或其按钮上、或在列表内的按压会让列表保持打开；起点与终点在其他任何位置的按压会关闭它，而起于外部的滚动或捏合不会关闭。在字段标签或 Tokenizer token 上的按压会把焦点移出输入框再移回，因此列表会在该按压上关闭再打开，最终处于打开状态。位于已打开的 shadow root 内的字段也按同样方式处理。该列表是手动 popover，因为浏览器的轻量关闭会把文本输入框内的按压视为外部（`architecture:layer-runtime`）。                                                                                                                                                                                                                                                                                                                                                                 | `architecture:layer-runtime`；当前源码与测试            |
| FR13 | `menu` 决定锚定弹窗显示什么，而 BaseTypeahead 负责它的层：定位、顶层、外部按压（FR12）、Escape、焦点返回，以及将其与输入框绑定起来的 ARIA（DEC-1）。`{role: 'listbox'}`（默认）显示结果列表；其可选的 `render` 接收列表、查询、忙碌状态、搜索是否一无所获，以及 `close`，并在列表周围放置诸如页眉、页脚或提示之类的信息。列表仍是唯一的 listbox，并保留 FR1–FR12。列表之外的内容仅作信息：任何人可操作的东西都是列表中的结果，因此方向键能到达它；而在列表之外渲染的控件会触发一条开发环境警告。                                                                                                                                                                                                                                                                                                           | DEC-1                                                   |
| FR14 | `{role: 'dialog', label, render}` 在由 `label` 命名的 `dialog` 中显示调用方的内容（AR6）；`render` 接收查询与 `close`。它显示时焦点移到其第一个控件，或移到该 dialog。它显示期间，输入框不移动高亮也不选中任何项；Escape 关闭它。只有句柄能打开它：搜索、聚焦加载、输入框上的聚焦或 ArrowDown 都不能。查询清空、加载一无所获或输入框失焦时它都不会关闭；在字段与 dialog 之外的按压会关闭它（FR12）。                                                                                                                                                                                                                                                                                                                                                                                                       | DEC-1                                                   |
| FR15 | 当 dialog 角色的菜单关闭时（Escape、外部按压、`close`），焦点返回到菜单被请求打开时（调用 `open()` 或菜单显示时）拥有焦点的那个元素，若该元素已不存在则返回到输入框。把焦点移到另一控件的外部按压会让焦点留在那里。向输入框返回焦点不会打开列表。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | DEC-1                                                   |
| FR16 | `handleRef` 暴露 `open()` 与 `close()`，`onOpenChange` 报告每次打开与关闭；不存在受控的打开状态（DEC-1）。`open()` 在调用它的那次提交之后运行，因此它使用调用方在同一事件中渲染的菜单：dialog 立即打开，listbox 则显示其结果，必要时先加载它们。若某次选中在 `onChange` 中调用了 `open()`，菜单保持打开，因此从列表切换到 dialog 会让同一层保持在同一锚点上而不关闭它。若在这种选中之后菜单仍是 listbox，焦点返回输入框，列表加载其聚焦条目，没有条目时则关闭。                                                                                                                                                                                                                                                                                                                                            | DEC-1                                                   |

### Allowed variation

- 搜索与引导可以同步或异步完成。
- 结果可以分组或不分组，并可使用默认内容或调用方渲染的内容。
- 直接调用方可以将弹窗锚定到输入框，或锚定到它自己的包装层。
- 菜单可以只是结果列表、带周围信息的列表，或一个接管焦点的 dialog（FR13–FR16）。
- Typeahead 与 Tokenizer 可以拥有可见的包装层与忙碌指示通道。

### Representative states

| 状态              | 必需的不变式                                                                                                     | 允许的变体                 |
| ----------------- | ---------------------------------------------------------------------------------------------------------------- | -------------------------- |
| rest              | 具名 combobox 处于关闭且不忙碌                                                                                   | 调用方自有的包装层与标签   |
| focused bootstrap | 仅在启用且存在结果时才打开弹窗，若引导或重新加载没有产出或失败则关闭                                             | 同步或异步的源             |
| query pending     | combobox 忙碌，且重复的过期工作被拒绝                                                                            | 直接或包装层自有的 Spinner |
| results           | 一个高亮的 option 与有效的 active descendant                                                                     | 分组/默认/自定义内容       |
| completed empty   | 一条呈现性消息且无 active descendant；当前是一个被禁用的 option，即 FR4 缺口                                     | 调用方提供的空文本         |
| selected result   | 匹配的 option 暴露 `aria-selected=true`                                                                          | 通用的勾选呈现             |
| disabled          | 可聚焦并带 `aria-disabled`；无查询变更、打开或选中；已打开的列表仍可关闭；当前默认为原生 `disabled`，即 FR9 缺口 | 带或不带禁用原因           |
| dismissed pending | 弹窗保持关闭且不忙碌；同一查询的迟到答案只在下一次打开时才打开                                                   | 源完成时机                 |
| narrow viewport   | 弹窗与结果内容保持在两条视口留白之内                                                                             | 固有或请求的宽度           |

### Transformation and precedence order

- **ORD1 — 结果内容。** `item.element` → 调用方 `renderItem` → TypeaheadItem。实现缺口：调用方 `renderItem` 会替换 `item.element`，而 `item.element` 只有默认的 TypeaheadItem 才会渲染。
- **ORD2 — 输入 props。** 使用方剩余 props → 已定义的旧别名（`inputId`、`ariaDescribedBy`、`ariaLabelledBy`、`inputTabIndex`）→ 组件自有的语义与处理器 → 组件样式 → 使用方的 class/style 逃生舱。省略的旧别名会保留其等价的原生 BaseProp。
- **ORD3 — 菜单内容。** listbox 角色的 `render` 包裹结果列表，其行仍遵循 ORD1；没有 `render` 时菜单就是列表本身。dialog 角色的 `render` 在显示期间替换列表。

### Performance and resources

- **PR1 — 搜索生命周期。** 过期响应与部分列表，包括来自此后已被替换的源的，或卸载之后才到达的，都会被拒绝；防抖计时器与可选的源取消在替换与卸载时被清除。

## Accessibility contract

- **AR1 — Combobox 模式。** 在 listbox 角色下，DOM 焦点留在输入框上，而 `aria-activedescendant` 标识具名 listbox 中高亮的 option。dialog 角色的菜单则接管焦点（AR6）。
- **AR2 — 无障碍名称。** 直接调用方提供 `aria-label` 或有效的 `aria-labelledby` 关系；组合的所有者提供其可见标签 ID。
- **AR3 — 状态。** expanded、busy、disabled、active-descendant 与 selected 状态都以编程方式暴露。
- **AR4 — 结果反馈。** 每个查询通过共享播报器（`spec:AST-092` FR8）播报一次本地化的结果数量或空结果消息，在结算时，或若弹窗在其待完成时被关闭，则在下一次打开时（FR3）。
- **AR5 — 输入法。** IME 组合命令仍归属候选窗口；普通键盘与指针选择保持等价。
- **AR6 — Dialog 菜单。** dialog 角色的菜单是由其 `label` 命名的 `dialog`；输入框带有 `aria-haspopup="dialog"`、`aria-expanded`，以及命名持有该 dialog 的层的 `aria-controls`，且没有 active descendant。dialog 显示时焦点移入其中，并按 FR15 所述返回。

## Design relationships

| 结构与状态           | 设计要求                                          | 呈现权威              | 层级角色     | 组件契约 |
| -------------------- | ------------------------------------------------- | --------------------- | ------------ | -------- |
| Input                | 调用方自有的可见外壳与聚焦处理                    | 调用方；OQ3           | 突出         | AR2      |
| Loading status       | 共享 Spinner                                      | `component:Spinner`   | 辅助         | FR6      |
| Dropdown             | 带受限 listbox 的 Popover 表面                    | 当前源码与层运行时    | 突出         | FR4、FR8 |
| Highlighted result   | 叠加层加强制颜色轮廓                              | 当前源码              | 突出         | FR5      |
| Empty state          | 空搜索消息；当前是一个被禁用的 option（FR4 缺口） | 当前源码              | 辅助         | FR4      |
| Default item content | TypeaheadItem                                     | `component:Typeahead` | 突出         | ORD1     |
| Caller item content  | 调用方自有                                        | 调用方                | 视上下文而定 | ORD1     |

### Theming anatomy

<!-- anatomy-theming:v1 -->

```json
{
  "Input": {
    "none": {
      "reason": "intentional: The direct caller owns the bare input chrome and styles it through supported input styling props."
    }
  },
  "Loading status": {
    "delegatesTo": {"owner": "component:Spinner", "target": "spinner"}
  },
  "Dropdown": {
    "delegatesTo": {
      "owner": "component:Typeahead",
      "target": "typeahead-dropdown"
    }
  },
  "Empty state": {
    "delegatesTo": {
      "owner": "component:Typeahead",
      "target": "typeahead-empty-state"
    }
  },
  "Result group heading": {
    "none": {
      "reason": "reachability-gap: No current public target reaches the visible group heading."
    }
  },
  "Result row": {
    "none": {
      "reason": "reachability-gap: The stable option row owns highlight and selection but has no current target."
    }
  },
  "Menu content": {
    "none": {
      "reason": "intentional: The caller renders it around the list or inside the dialog and styles it; menu styling overrides are not decided (DEC-1)."
    }
  },
  "Menu dialog": {
    "none": {
      "reason": "intentional: The dialog role's surface is the popover's own; menu styling overrides are not decided (DEC-1)."
    }
  },
  "Default item content": {
    "delegatesTo": {
      "owner": "component:Typeahead",
      "target": "typeahead-item"
    }
  },
  "Caller-rendered item content": {
    "none": {
      "reason": "intentional: Caller-rendered result content remains caller-owned."
    }
  },
  "Selected result state": {
    "none": {
      "reason": "reachability-gap: No current Typeahead target or state reaches the outer selected option."
    }
  }
}
```

## Family and system relationships

- `family:overlay-dismissal` 在弹窗存在时负责 Escape 与平台关闭顺序。
- `architecture:layer-runtime` 负责文本字段的层的顶层托管、锚定、视口定位与外部按压关闭（FR12）。
- `spec:AST-092` 负责增量搜索结果（FR10）。
- `spec:AST-058` 负责空搜索消息与 option 操作（FR4、FR11）。
- `architecture:public-component-api` 负责可达导出与 BaseProps 透传语义。
- `architecture:component-theming-surface` 负责结构限定与目标处置。

## Verification map

| 契约             | 验证                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 代表性状态                                                                                                  | 变更或失败预期                                                                                                                                                    | 审计小节                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| FR1              | `Typeahead.test.tsx` "shows results on input change"、"does not select every result when items lack ids"、popover-after-selection 用例与 hasSearched 重置用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 搜索、选择、重新输入                                                                                        | 一次选择若保持查询或结果打开，或选中多行，即失败。证据缺口：没有测试断言选择后焦点回到输入框。                                                                    | `audit:BaseTypeahead/behavior`      |
| FR2              | `BaseTypeahead.test.tsx` "counts grapheme clusters when enforcing minQueryLength"；`Typeahead.test.tsx` 的 minQueryLength 与粘贴用例；`BaseTypeahead.test.tsx` "focus list with no choices" 用例与 "closes an open focus list when the reload fails"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | 阈值、低于阈值的回退、粘贴                                                                                  | 低于阈值的搜索，或未搜索的查询得到空结果，即失败。证据缺口：没有测试断言防抖延迟。                                                                                | `audit:BaseTypeahead/behavior`      |
| FR3, PR1         | `Typeahead.test.tsx` 的乱序异步结果用例（"discards a stale response that resolves after a newer query"、"discards a response from a source that was replaced while it was in flight"）；`BaseTypeahead.test.tsx` 的源替换用例；`BaseTypeahead.test.tsx` "loads the replacement source when ArrowDown opens the closed field"、"searches the replacement source for the typed query when ArrowDown opens the closed field"；`BaseTypeahead.incremental.test.tsx` "drops lists for a query that is no longer current (FR4)"、"drops lists and rejections that arrive after unmount (FR4)"；`BaseTypeahead.test.tsx` "BaseTypeahead pending work after a dismissal" 用例；`Tokenizer.test.tsx` "keeps a dismissed menu closed when its search answers late, and shows that answer on reopen" | 更新的查询；被替换的源；挂起期间关闭                                                                        | 过期响应或部分列表替换了更新的结果、卸载后出现列表、源替换后按 ArrowDown 出现旧列表，或关闭后弹出层重新打开或保持忙碌，即失败。证据缺口：没有测试断言定时器清理。 | `audit:BaseTypeahead/behavior`      |
| FR3              | `BaseTypeahead.test.tsx` "every open path after a dismissal shows the kept list at once" 用例；`BaseTypeahead.test.tsx` "searches the typed text when a press on the field's label dismissed it inside the debounce"；`Tokenizer.test.tsx` "searches the typed text when a press on a token dismissed it inside the debounce"                                                                                                                                                                                                                                                                                                                                                                                                                                                             | 关闭后的 ArrowDown、焦点返回、指针按压和 `open()`，且搜索处于挂起或已落定状态；未保留到关闭之后的空落定答案 | 某个打开路径等待答案、再次搜索、在查询已落定后保持忙碌、把保留的计数播报两次或完全不播报，或重新打开未被保留的空答案，即失败。                                    | `audit:BaseTypeahead/behavior`      |
| FR4, AR1, AR3    | `BaseTypeahead.test.tsx` "exposes a completed empty search as a disabled listbox option"；`Typeahead.test.tsx` "renders input with combobox role"、"sets aria-expanded=false initially"、"does not set aria-activedescendant when search has 0 results"；`BaseTypeahead.emptyState.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | 结果；已完成的空搜索                                                                                        | 无效的列表框、没有消息的空搜索，或消息上带活动后代，即失败。证据缺口：没有测试断言选中选项上的 `aria-selected`。禁用选项用例断言的是当前 FR4 缺口，待符合规范。   | `audit:BaseTypeahead/accessibility` |
| FR5, AR5         | `Typeahead.test.tsx` 的 IME、失焦和箭头滚动用例（"does not select the highlighted result on a composing Enter"、"closes the list on the Tab keydown, before the blur it produces"、"Tab from the input with the list open moves focus to the next control"、"scrolls the highlighted option into view during arrow navigation"、"reopens on click when the input was already focused and the dropdown closed without a blur"、"picks nothing from a list opened before the field became disabled, and lets it close"）                                                                                                                                                                                                                                                                    | 箭头、Enter、Tab、IME                                                                                       | 组合输入中的 Enter 触发选择、Tab 让列表保持打开或困住焦点，或 Escape 让列表保持打开或移动焦点，即失败。证据缺口：没有测试断言循环，也没有断言 Home 和 End。       | `audit:BaseTypeahead/accessibility` |
| FR6              | `Typeahead.test.tsx` 的忙碌指示器归属用例与 hasEntriesOnFocus 加载用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    | 直接与组合的忙碌状态；引导                                                                                  | 重复或缺失的 Spinner、过期的忙碌状态，或重复的过渡报告，即失败。                                                                                                  | `audit:BaseTypeahead/behavior`      |
| FR7, ORD2        | `BaseTypeahead.test.tsx` "forwards supported DOM, styling, and event props to the combobox input"、"preserves native input attributes when legacy aliases are undefined"、"lets defined legacy aliases override their native equivalents"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | DOM、样式、事件；旧式别名                                                                                   | 丢弃属性、替换自有语义，或别名优先级错误，即失败。证据缺口：没有测试断言直接调用方的 `onKeyDown` 先运行，以及其中的 `preventDefault()` 会跳过内置处理。           | `audit:BaseTypeahead/api`           |
| FR8              | 证据缺口：没有测试断言弹出层位于 320 CSS px 的视口内                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      | —                                                                                                           | —                                                                                                                                                                 | `audit:BaseTypeahead/layout`        |
| FR9              | `Typeahead.test.tsx` "disables input when isDisabled"（裸 BaseTypeahead，断言当前的原生禁用缺口，待符合规范）、"blocks typing and selection while focusable-disabled"、"opens no list and picks nothing while focusable-disabled (spec:AST-085 FR2)"、"does not reopen on a click into the still-focused input once disabled"、"picks nothing from a list opened before the field became disabled, and lets it close"、"does not open a list for a search that settles after the field became disabled"、"drops a search answer that arrives after the field became disabled"                                                                                                                                                                                                             | 原生禁用；打开前后的可聚焦禁用                                                                              | 在可聚焦禁用时输入、打开或选择，列表无法关闭，或搜索答案在禁用后落地，即失败。证据缺口：没有测试断言禁用时跳过调用方处理器。                                      | `audit:BaseTypeahead/accessibility` |
| FR10             | `BaseTypeahead.incremental.test.tsx` 的用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 部分、追加、失败和被替换的列表；分组；上方和下方的弹出层；StrictMode                                        | 部分列表未立即显示、行或高亮移动、选项 id 变化、第二次播报、失败后列表丢失，或缺少开发警告，即失败。                                                              | `audit:BaseTypeahead/behavior`      |
| FR11             | 证据缺口：没有测试，与源码中的开发警告相符                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | 带 `action` 的结果                                                                                          | 渲染出 action，或缺少警告，即失败。                                                                                                                               | `audit:BaseTypeahead/behavior`      |
| FR12             | `Typeahead.test.tsx` 的按压内部与外部套件；`Tokenizer.test.tsx` 的按压内部用例；`TypeaheadInputPress.a11y.chromium.spec.ts`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | 在输入框内、列表内、其他位置按压；从其他位置开始的滚动；位于 shadow root 中的字段                           | 在字段上或列表内按压却关闭了列表、在其他位置按压却让列表保持打开，或滚动使其关闭，即失败。                                                                        | —                                   |
| FR13, FR16, ORD3 | `BaseTypeahead.menu.test.tsx` "shows information around the result list, and the list stays the only listbox"、"warns in development when a control sits outside the result list"、"keeps the menu open when a pick switches it to a dialog"、"reloads the focus entries, with focus back in the input"、"closes with focus in the input when there are no focus entries"；`BaseTypeaheadMenu.a11y.chromium.spec.ts` 在 Chromium 中的键盘与角色切换用例                                                                                                                                                                                                                                                                                                                                   | 列表前后的页眉和页脚；位于其外的控件；切换为对话框的选择                                                    | 出现第二个列表框、信息位于列表内、结果无法到达、缺少警告，或层在列表与对话框之间隐藏，即失败。                                                                    | `audit:BaseTypeahead/behavior`      |
| FR14, FR15, AR6  | `BaseTypeahead.menu.test.tsx` 的对话框角色用例，包括 "closes on a press outside the field and the dialog, and keeps a press inside" 和 "opens only from the handle: typing, focus and ArrowDown leave it closed"；`BaseTypeaheadMenu.a11y.chromium.spec.ts` 在 Chromium 中的焦点返回与外部按压用例                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | 从按钮打开；Escape；打开者消失后关闭；清空的查询；输入框失焦                                                | 未命名的对话框、缺少 `aria-haspopup`、活动后代、焦点留在外部、焦点落在页面上、对话框在空查询或失焦时关闭、在外部按压后仍保持打开，或从输入或焦点打开，即失败。    | `audit:BaseTypeahead/accessibility` |
| AR2, AR4         | `Typeahead.test.tsx` 的结果播报用例 ("announces the result count to a live region (comboboxes-6)"、"announces the plural result count"、"speaks the result count from a provider catalog"、"announces \"no results found\" when the search is empty (comboboxes-6)")；`BaseTypeahead.incremental.test.tsx` "announces the result count once per query, when it settles (FR8)"                                                                                                                                                                                                                                                                                                                                                                                                             | 计数、空、提供方目录                                                                                        | 缺失或错误的播报，即失败。证据缺口：没有测试断言直接调用方的可访问名称。                                                                                          | `audit:BaseTypeahead/accessibility` |
| ORD1             | `TypeaheadItem.test.tsx` "renders item.element raw in place of the label layout"                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          | `item.element`                                                                                              | 未能替换默认内容的 `item.element`，即失败。证据缺口：没有测试断言 `renderItem` 的优先级低于 `item.element`。                                                      | `audit:BaseTypeahead/behavior`      |
| 主题化结构       | `themingTargets.test.ts`；`scripts/check-knowledge.mjs`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 已映射的部件                                                                                                | 渲染出的类不在文档化目标中，或处置状态过期，即失败。                                                                                                              | `audit:BaseTypeahead/theming`       |

## Current-state impact

- **活动选项的感知。** 活动选项只显示 `--color-overlay-hover` 填充，在浅色和深色下与列表框的对比度都低于 3:1，这违反 `spec:AST-020` FR1（WCAG 2.2 1.4.11）。Selector 在键盘输入后绘制共享的焦点环（`component:Selector` AR5）。
- **空搜索消息（FR4）。** 已完成的空搜索把它的消息渲染为禁用的选项，而不是展示性文本，这违反 `spec:AST-058` FR7。
- **结果内容顺序（ORD1）。** 调用方的 `renderItem` 会替换 `item.element`，而后者只有默认的 TypeaheadItem 才会渲染，尽管 `SearchableItem.element` 的文档赋予 `item.element` 优先权。
- **禁用输入（FR9）。** 默认的禁用模式是原生 `disabled`，它会移除 Tab 停靠点，而可聚焦禁用的输入仍会运行调用方的点击、指针和按键处理器，这违反 `spec:AST-085` FR1 和 FR2。

## Decision log

### DEC-1 — Astryx owns the typeahead menu's layer, and callers fill it

**决策者：** `cixzhang`，`2026-11-07`（第 49 行：“49 A”）

这一层承载了屏幕阅读器和键盘用户所依赖的东西：菜单的角色和名称、焦点返回到哪里、外部按压会做什么、Escape 关闭各层的顺序，以及菜单是否保持在 Dialog 之上。因此 BaseTypeahead 拥有这一层，调用方通过一个 `menu` 配置填充它，该配置把角色、名称和内容一起承载（FR13–FR16）。名称与公共的 `menuWidth` 一致（“Okay menu”）；形状是一个把标签放在内部的配置（“I like the config idea”）；焦点返回是一条通用规则（“Generic rule sounds good”）；打开状态是上报的，而非受控的，与 ComplexSelector 相同（“Okay for open”）。

已否决：由调用方从展开的 props 组合这一层（Downshift 风格），因为漏掉一个展开就会移除角色、名称或焦点返回，且没有任何可见迹象。暂时否决：在配置中提供带类型的层选项（宽度、位置、最大高度），当前没有调用方需要它们，日后可以在不破坏兼容的情况下加入。不包含：受控的 `isOpen`，以及 `onTokenActivate` 回调。

**注（未决定）。** 菜单样式覆盖可能日后添加（例如部件样式或主题目标）；它们当前不在范围内（Cindy：“49A we may add menu styling overrides”）。

### DEC-2 — No `controlRef` on TextInput

**决策者：** `cixzhang`，`2026-11-06`

TextInput 不暴露指向其带边框控件盒的 ref 来锚定 Popover：那条路径对该体验不处理任何必要的可访问性（combobox 角色、活动选项、键盘模型、结果播报）。自定义 typeahead 使用带 `anchorRef` 和 `menu` 配置的 BaseTypeahead。

已否决：在 TextInput 上提供 `controlRef`。

## Open questions

- **OQ1 — 已发布的公共 props 类型应如何移除包内部的组合开关，例如 `__queryEntries`、`isFocusableDisabled` 和 `inputTabIndex`？**（`human-api`）
- **OQ2 — 既然继承的 `xstyle` 契约已正确触达同一个输入框，`inputXStyle` 现在是否应弃用？**（`human-api`）
- **OQ3 — 裸 BaseTypeahead 是否自带默认的 focus-visible 焦点环，还是每个直接调用方都必须在其包裹元素上提供焦点环？**（`human-design`）

## Content boundary

本文件不重复属性参考、示例、当前审计评分、共享层机制，或共享的可访问性与主题化规则。它链接到它们的所有者。
