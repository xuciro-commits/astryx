---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:public-component-api
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang, imdreamrunner]
applies_to:
  [
    packages/core/src/,
    packages/core/package.json,
    packages/core/src/BaseProps.ts,
    packages/lab/src/,
    packages/richtext/src/,
    packages/cli/authoring/doctypes/component/,
    internal/eslint-plugin-astryx/,
  ]
verified_by:
  [
    internal/eslint-plugin-astryx/require-base-props.js,
    internal/eslint-plugin-astryx/require-baseprops-passthrough.js,
    packages/core/src/docPropLiterals.test.ts,
    packages/core/src/docPropReferences.test.ts,
  ]
deciding_specs:
  [
    spec:AST-002/DEC-1,
    spec:AST-005/DEC-1,
    spec:AST-012/DEC-1,
    spec:AST-012/DEC-2,
    spec:AST-071/DEC-1,
    spec:AST-017/DEC-23,
    spec:AST-012/DEC-6,
    spec:AST-107/DEC-2,
    spec:AST-107/DEC-3,
  ]
---

# Public component API

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "public-api": [
      "INV1",
      "INV2",
      "INV3",
      "INV4",
      "INV5",
      "INV6",
      "INV7",
      "INV8",
      "INV9",
      "INV12",
      "INV16",
      "INV24",
      "INV25"
    ]
  }
}
```

本记录定义了稳定的 Astryx 组件所共享的公共 API 契约。

## Purpose

使用方应当能够无需了解组件的内部实现，就预判 Astryx 组件如何被导入、受控、扩展与组合。新的 API 应当表达调用方拥有的意图，并保留既有的行为。

## System model

可安装的包就是公共契约。它包括：

- 导出的组件与 hooks；
- 导出的 props 与稳定的支撑类型；
- 已发布的组件子路径；
- 有文档记录的默认值；以及
- 使用方可观察到的行为。

使用方的 `.doc.mjs` 文件用于说明该契约。它们不会创建导出代码本不具备的 props 或策略。

一旦本记录成为 `current`，每个当前组件契约都会在其 `architecture` 链接中列出 `architecture:public-component-api`。草稿组件契约只在本记录成为 `current` 之后才添加该链接，以免候选关系过早产生权威性。

组件契约与 family 契约负责更窄的行为。主题记录负责主题目标、公共主题属性、tokens 与生成的样式。贡献指南负责提议和测试 API 所用的流程。

## Boundaries and invariants

- **INV1 — 公共导出必须可达。** 稳定的组件、hook、prop 类型以及其他承诺的公共类型，都可以从其已发布的包入口点或组件子路径获得。
- **INV2 — 名称承载相同的含义。** 组件、hooks、布尔值、回调、Actions、方向、refs 以及原生 HTML 透传，都遵循共享的命名文法。组件特有的词汇保持在本地。用于决定组件如何响应输入的 prop 命名为 `<thing>Behavior`，取值为行为名称的封闭联合；当取值本身就能命名行为时，其名称不包含输入词（press、touch、tap、hover、mouse、click）。公共 prop 用系统已有的词汇命名系统原语：对于系统已经命名的概念，它不引入新术语（DEC-1）。元素与其锚点之间的间隙是 `offset`，正如 `useLayer` 的 `offset`；定位元素相对容器或视口边缘保持的距离是 `inset`，正如 LayerProvider 与 ToastViewport 的 `inset`。深度是 `elevation`，其取值来自 `Elevation`，正如 Card、Button 与 Banner 所采用的那样。`lift` 命名按下时的动效，例如 Switch 的 thumb lift、Slider 的 `springs.sliderLift` 以及 ContextMenu 的 `springs.contextMenuLift`，因此它不命名布局距离。hook 接收的元素 ref 按元素的职责命名，正如 `containerRef`、`scrollRef`、`menuRef`、`triggerRef` 与 `inputRef`，当元素没有更窄的职责时则命名为 `ref`。
- **INV3 — 一个 prop 控制一个独立概念。** prop 不会悄悄压制一个不相关的 prop。父级不会重复已被组合子级拥有的状态。一种交互行为就是一个 prop，绝不拆成并行的 touch、mouse 或 focus props：当行为随设备而不同时，该 prop 在显式的固定取值之外提供一个按设备解析的自适应取值——只有一个设备解析时命名为 `'adaptive'`，有多个时命名为 `'adaptive-<target>'`，正如 `presentation` 所做的那样（`spec:AST-043/DEC-1`、`component:DropdownMenuSubMenu`）；新的行为 prop 默认采用已发布的行为，当已发布行为本就随设备不同时该默认值就是自适应取值，而现有 prop 的默认值只在 INV16 与 INV9 之下改变。`is…` 或 `has…` 布尔值只命名没有第三态的真正开/关，而 `presentation` 命名出现的是哪个表面，并在 INV16 之下命名打开表面的输入模式。
- **INV4 — 新 prop 表达调用方拥有的意图。** 新的公共 prop 遵循 `spec:AST-002/DEC-1`。当组件能够从状态、内容、布局、上下文或平台行为推导出正确结果时，它将该决策保持在内部。
- **INV5 — 已接受的使用方 prop 得到保留。** 对于拥有 DOM 的组件，受支持的 DOM、data、ARIA、style、class 与事件输入会到达拥有该契约的元素。组件自身拥有的无障碍性与行为不会被意外覆盖。
- **INV6 — 样式输入可以组合。** `xstyle`、`className` 与 `style` 按文档记录的次序组合，而不是相互替换。family 记录可以为其成员声明对根样式输入的例外，并在某项决策中说明替代的部件输入及其理由；`family:input-fields` FR10 即是一例。
- **INV7 — 事件处理器有意地组合。** 使用方处理器与内建行为遵循共享的取消契约。只有在公共 API 承诺取消之处，使用方才能取消内建行为。将某个处理器移到另一个元素的组件，保留它为该处理器发布的次序与取消语义，并加以记录（`family:input-fields` DEC-8）。
- **INV8 — Refs 遵循 React 19。** 公共 DOM 组件接受 `ref` 作为 prop，并将其连接到其契约所承诺的元素。
- **INV9 — 已发布的 API 谨慎变更。** 已发布的 prop、类型、导出、默认值或可观察行为，若缺少 [`spec:AST-017`](../specs/AST-017/spec.md) 所要求的生命周期、证据与迁移，则不会被移除、重命名、更改类型、弃用或以不兼容的方式纠正。
- **INV10 — 共享的子契约是链接而非复制。** 输入 Actions、层行为、主题化以及 family 专属规则，都留在其所属记录中。
- **INV11 — 公共主题接缝须通过 API 准入。** 只有当调用方拥有的意图无法由目标保证的 CSS 属性集表达时，公共语义 CSS 自定义属性才被准入。其主题记录负责确切的用途、稳定的默认值/回退值、作用域、文档、证据与兼容性契约；仅凭内部的样式缺口不足以证明公共 API 合理。
- **INV12 — 可达性优先于内部标签。** 从受支持的包路径可达的类型、上下文成员、hook 返回值、工具签名、默认值或操作即为公共，即使其源码注释、文件名或当前用法称其为内部。要保持私有，就必须移除该导出，或将该能力移到未导出的边界之后。Core 的 `./internal/*` 子路径是唯一的例外：可达，但仅保留给 Core 与 Lab，无文档，与 Core 同步版本化，由 lint 限制为仅这两个包可用，且只有在被 swizzle 的副本中、针对以路径为身份的已导出 StyleX 模块才被导入（`spec:AST-110` FR1），并且不在兼容性承诺之内（`spec:AST-017` FR21）。
- **INV13 — 公共增量路由到其权威所有者。** 每一次公共 API 更新与每一次公共行为变更，都遵循 `architecture:knowledge-contracts` 所定义的结果与处置。测试、Changeset 或生成的清单都是证据；它们都无法裁定一个缺失或矛盾的契约。
- **INV14 — 共享断点名称保持同一含义。** 接受主题宽度点的组件使用当前活动 Theme 的 `sm`/`md`/`lg`/`xl`/`2xl`。`below` 边界是排他的，因此相等情形属于更宽的一侧。
- **INV15 — 部件的样式输入成套出现。** 针对根元素以外元素的样式，以 `<part>Xstyle`、`<part>ClassName` 与 `<part>Style` 三者一并接受，作用于该元素并按 INV6 所述组合。任何公共 prop 都不会为某个元素接受 StyleX 样式，而该元素却无法同时接受 class 名与内联样式，遵循 `spec:AST-071/DEC-1`。
- **INV16 — 调用方的呈现选择优先于触摸默认值。** 一个稳定组件若在粗指针下呈现不同的表面（例如以 sheet 替代 popover），或改变打开表面跟随输入的方式（例如在打开的列表中触摸跟踪），则采用一个 `presentation` prop；它的某个取值（例如 `presentation="popover"`）会在任何设备上保持该组件在细指针下所用的表面与输入模式。在服务于触摸用户之处，触摸行为是该组件的默认值，而调用方的显式选择始终优先于该默认值。此类内部触摸模式每一种都可经公共 prop 或取值由调用方触达；没有任何一种被硬编码到调用方无法触及之处。触摸样式（例如按压着色或字号下限），以及由其自身记录定义的触摸专属行为（例如行滑动或 tooltip 的触摸触发），遵循那些记录。模式内部的阈值与调参值保持内部（`spec:AST-002` FR3）。INV4 让组件推导默认值；INV16 让调用方始终能够覆盖它。当触摸默认值改变已发布组件的行为时，该 `presentation` 取值就是 `spec:AST-017` FR3 所命名的恢复用 prop（`spec:AST-017/DEC-23`）。有一项例外会覆盖显式选择：在使用 `gregory` 或 `iso8601` 之外的日历时，`DateInput` 或 `DateTimeInput` 上的 `presentation="native"` 会解析为该指针下的 Astryx 表面，因为没有任何原生日期选择器会显示应用程序所用的日历（`spec:AST-111` FR15、DEC-7）。
- **INV17 — Compact 只有一个共享定义。** 按屏幕尺寸选择呈现方式的组件使用主题的 compact 定义：宽度低于生效的 `md` 点，或高度低于 500，且在所有平台上数字相同（`spec:AST-012` FR9）。它不保留自己的 compact 数字，正如 INV14 不保留并行的断点表。调用方选定的布局宽度，例如 AppShell 的 `mobileNav.breakpoint`，则遵循 INV14。
- **INV18 — 沿解剖结构组合。** 避免深入组件解剖结构的 prop（例如选取某个子组件的特定 prop 或 label）。改为构建组合。组合必须遵循组件的解剖结构；绝不暴露组合或渲染解剖结构中未描述的 slot 的方式；并且 slot 必须有组件。配置对象是可以的：描述动作或选项的普通数据（例如传给 `createSwipe` 的 `{label, icon, onActivate}` 条目）不是 slot。“slot 必须有组件”适用于渲染内容 slot，即接受任意节点的位置；此类 slot 必须是组件解剖结构中命名的部件，并由调用方用组件填充。这延伸了 INV3 的规则：父级不会重复组合子级的状态；slot 的样式遵循 INV15 与 `architecture:component-theming-surface`。参见 [slot 与组合](../contributing/api-conventions.md#slots-and-composition)。
- **INV19 — 资源开销要与功能权衡。** 在资源负载与功能、跨平台关切之间取得平衡。若某项功能的资源开销很大，可考虑将该行为做成可插拔，正如 `Item` 的滑动操作通过 `swipe={createSwipe(…)}` 插入（`spec:AST-057` DEC-8）。为功能提供具名 prop 也可以（例如 `collapsible`）。
- **INV20 — 用变体，而非视觉布尔值。** 避免只用于切换视觉的布尔标志；优先使用变体。这把 INV2 的命名与 INV4 的调用方拥有意图应用于视觉选择；参见 [开放的视觉词汇与封闭的轴](../contributing/api-conventions.md#open-visual-vocabularies-and-closed-axes)。
- **INV21 — 一个职责一个 API。** 不新增与现有 API 承担同一职责的 API，除非现有 API 正因其而被弃用。INV3 保持一个 prop 对应一个概念，INV16 为表面选择保留一个 `presentation` prop；INV21 将同一规则应用于 props、组件、hooks 与工厂。完全委托给公共工厂、自身没有行为的 hook，以及完全构建在某个公共工厂之上的组件，与该工厂构成同一个 API，而不是第二个 API（`spec:AST-107` FR6、FR8）。弃用遵循 INV9。组件通过一个 slot prop 接收某个 hook 的取值时，该 hook 与该组件构成同一个 API，而不是第二个 API，正如 `const value = useX(…); <Component x={value} />`（所有者决策，2026-11-04）。
- **INV21a — 已发布 API 只因用户价值而变更。** 对已发布公共 API 的破坏性或弃用性变更需要用户价值；仅符合系统规则不足以证明其合理。新 API 遵循当前规则；已发布的 API 在真实需求出现之前被豁免（所有者决策，2026-11-04）。每个组件 API 变更仍需其各自的所有者批准。
- **INV22 — 交互工具提供非 React 等价物。** 交互工具提供与其 hooks 紧密对应的非 React 等价物（`create…`）：选项名称与含义相同，事件与返回概念相同。若某个 hook 的结果只能被 Astryx 组件或 StyleX 使用（例如 slot hook，其输出只喂给某个 Astryx 组件的 prop；或 `useAnimatedLayout`、`useEntryAnimation`、`useContainerReveal`、`useTouchTrigger`、`useTableRowExpansion`、`useTableColumnResize`），则它默认没有非 React 等价物；所有者可以添加（所有者决策，2026-11-04）。`useMenuPress` 依所有者决策没有非 React 等价物（2026-11-04）；当调用方需要时可以添加。
- **INV23 — 每个私有 data 属性只有一个所有者模块。** 除非本不变式将其命名为公共，否则 `data-astryx-*` 属性是私有的。每个私有属性在写入它的包中有一个内部所有者模块：`packages/<package>/src/privateAttributes/<name>.stylex.ts`，它持有该属性的名称与取值，并把其上的每个选择器只写一次，作为自身 `stylex.create` 调用中的字面量；StyleX 只在选择器被写之处解析它。所有者只导出读取该属性的现成样式、设置该属性的 props 或写入器，以及其包所需的运行时读取器（例如 `closest` 或 `matches` 辅助函数，或 getter）；它绝不导出原始名称或选择器。纯 TS 所有者 `packages/core/src/privateAttributes/<name>.ts` 可以把名称与选择器文本导出给它的 `.stylex.ts` 同级文件，以及 `packages/core/src/theme/` 中的主题引擎；没有其他文件导入它，而 `.stylex.ts` 所有者仍然绝不导出它们。当存在纯 TS 所有者时，其 `.stylex.ts` 同级文件不是所有者：它只把该属性的选择器作为自身 `stylex.create` 调用的字面量写入，因为 StyleX 只在选择器被写之处解析它，并且它绝不导出这些选择器，也不设置该属性。该包中其他每个文件都展开这些导出，绝不写入该属性或其选择器，且没有任何包通过内部路径导入另一个包的所有者模块。若所有者模块的属性所标记的元素并非其包所渲染，该模块可以在注入规则中写入其选择器一次，而不使用 `stylex.create`；Core 只能通过内部入口把该模块的写入器重新导出给 Lab，属性名称与选择器仍对该所有者保持私有。StyleX 每次按整个属性合并样式，因此所有者的样式会携带它所设置的每个属性的全部条件（包括静止态与指针态），调用方不会在同一元素上再次设置这些属性。在所有者模块与测试文件之外，手写 `data-astryx-` 字符串、模板或 JSX 属性名，或命名私有属性的 `dataAttr()` 调用，都会让 `@astryx/no-raw-private-attribute` lint 规则失败；早于该规则的位点位于其基线中，而基线只会收缩。测试可以命名私有属性，因为它们断言组件渲染的 DOM。私有属性不出现在任何公共导出、`.doc.mjs` 或 Changeset 中，不携带兼容性承诺，并可在任何版本中变更。`data-astryx-*` 命名空间之外的 data 属性同样是公共的，只有当当前记录将其命名时才添加（DEC-2）。公共的 `data-astryx-*` 属性包括：`data-astryx-theme`，主题作用域（`spec:AST-066` FR6）；`data-astryx-media`，主题编译输出的媒体表面作用域；`data-astryx-aspect-ratio-override`（`component:AspectRatio` FR3）；`data-astryx-token` 与 `data-astryx-token-value`（`component:ChatComposerTokenElement` FR1）；`data-astryx-menu-press`，菜单根标记（`module:DropdownMenu/useMenuPress`）；`data-astryx-pressable`，按压标记（`component:SegmentedControlItem` FR7）；以及 `data-astryx-edge-comp`，导出为 `EDGE_COMP_ATTR`（INV12）。它们只在 INV9 之下变更。拥有它们的代码在自己的位点写入它们，其中包括 Theme、MediaTheme、`reset.css`、`generateThemeRules.ts`、CLI 主题构建、AspectRatio、Chat 撰写器、按压与菜单按压 hooks，以及边缘补偿样式；lint 规则允许它们的名称。
- **INV24 — 每个 pull request 携带生成的公共 API 增量。** 任何包都不提交生成的 API 报告。对于修改已发布包源码或构建的 pull request，CI 会按每个已发布包的入口点，基于其构建出的声明与样式表，在合并基线与确切 head 上各运行一次表面生成器，并把两者之间的 API 变更以未提交方式写为 CI 的 API-changes 产物。增量列出新增、变更与移除的导出、带类型的组件 props、带签名的 hooks、支撑类型、公共 CSS 自定义属性与主题目标、INV23 命名的公共 `data-astryx-*` 属性，以及公共事件，每一行都带有其签名。被打上内部标签的可达成员也会出现（INV12）；Core 的 `./internal/*` 子路径与未发布的包（包括 Lab）则不出现。位于规范实验边界内的成员会以实验性标记出现（`spec:AST-017` FR21）。合并闸门只对修改已发布包源码或构建的 pull request 读取该产物，并在产物缺失或生成器报错时关闭（fail closed）。对于任何其他 pull request，闸门不读取任何产物，其审查说明写着“New public API: none”。审查机器人对每个 pull request 的审查，都以该增量开头撰写摘要说明，每行附一个用法示例，或写着“New public API: none”；公共 API 审查读取该增量。增量的各行是证据，不决定是否接受（INV13）。
- **INV25 — 未声明的公共 API 交给人类。** 公共 API 审查会把 pull request 的 API 增量（INV24）中每一行新增或变更的行与当前记录比较。若某行由合并基线上即为 current 的记录、或同一 pull request 中的记录变更所裁定，则无需进一步步骤。若某行没有任何 current 记录裁定（包括被打上内部标签的可达成员），则连同行列出交给人类审查，由本记录的所有者处理，正如 `architecture:knowledge-contracts` 变更耦合第 6 步所述。被移除或重命名的行遵循 INV9。

本记录适用于稳定的公共包，INV23 也适用于 Lab 源码。Lab 组件在晋升之前不是稳定的公共承诺。

## Change coupling

- 新增或变更导出的 prop、支撑类型、上下文成员、hook 返回值、操作签名、默认值、包入口点、ref 目标或有意为之的可观察契约，都会触发公共 API 审查。可达的支撑契约发生变更时，顶层导出未必需要变更。
- 每次审查都比较从合并基线到 head、以及从当前 main 到合成合并的声明与可达导出。pull request 的 API 增量（INV24）盘点了这些证据，并把每一行映射到其规范组件、family、架构或系统所有者；它不决定是否接受。
- 修改已发布包公共表面的 pull request，会在其 API 增量（INV24）中展示该变更，且不提交任何生成的报告。
- 在生成的表面清单确定了确切的 API 与行为增量及其规范所有者之后，将其路由到 `architecture:knowledge-contracts` 之下。本记录不重新定义审查结果或 PR 处置。
- 当使用方的用法或有文档记录的承诺发生变更，或现有文档否则会变得不实，使用方文档随之变更。修复实现缺陷本身并不要求变更使用方文档。
- 新 prop 需包含来自 `spec:AST-002/DEC-1` 的准入论证；它不会仅因为解决一个调用点就被接受。
- 公共 API 审查会拒绝用新术语命名现有系统概念的公共 prop（INV2、DEC-1）；该 prop 应采用系统对该概念的用词。
- 为稳定组件新增触摸呈现或打开表面的触摸输入模式时，需检查 INV16：某个 `presentation` 取值保持细指针的表面与模式，且每一种此类触摸模式都可由调用方触达。
- 新的公共语义 CSS 自定义属性需包含同样的准入论证，并说明为何目标保证的 CSS 属性集无法表达调用方拥有的需求。其详细契约与证据留在所属的主题/组件记录中。
- 已发布的破坏性变更需包含发布流程所要求的兼容性决策与迁移证据。
- 暴露具名主题宽度点的组件，使用 `spec:AST-012` 中的固定词汇与排他上边界行为；它不维护并行的硬编码断点表。按屏幕尺寸选择呈现方式的组件使用 compact 定义（INV17）。
- 对 family 拥有的 API 的变更会更新 family 契约，而不是把其规则复制进本记录或每个组件。
- 接受或推导导航目的地的组件遵循 `family:navigation-destinations`。新增汇聚点或承载目的地的组件会更新该 family，而不是创建组件本地的 URL 规则。

## Owning code

- 公共包清单与组件的 barrel 文件负责可达的导出。
- 组件的 prop/类型定义与运行时行为负责实际的 API。
- `BaseProps` 定义了拥有 DOM 的组件所共享的 DOM/样式表面。
- `.doc.mjs` 文件负责面向使用方的 prop 描述、默认值与示例。
- Astryx ESLint 规则与 API/文档测试检查该共享契约。

## Deciding specs

- `spec:AST-002/DEC-1` — 新的公共 prop 需要组件无法推导的、由调用方拥有的信息。
- `spec:AST-005/DEC-1` — 每个 Astryx 拥有的导航出口都遵循同一项目的地安全决策。
- `spec:AST-012/DEC-1` 与 `spec:AST-012/DEC-2` — 组件复用固定的主题宽度名称，以及包含式 `from`/排他式 `below` 的边缘含义。
- `spec:AST-071/DEC-1` — 每种样式输入都能在每种样式系统中工作，因此部件的样式输入成套出现。
- `spec:AST-107/DEC-2` 与 `spec:AST-107/DEC-3` — 建立在公共工厂之上的 hook，以及完全构建于其上的组件，与该工厂构成同一个 API（INV21）。
- `spec:AST-017/DEC-23` — 触摸呈现或打开表面的触摸模式是调用方始终可以覆盖的默认值，经由一个 `presentation` prop，该 prop 同时恢复先前的表面与模式。
- `spec:AST-012/DEC-6` — compact 是一个定义，在所有平台上相同。

过渡 Action 的时序与 pending 行为属于其组件或 family 契约。本记录在该所有者成为 current 之后链接它；它不复制组件矩阵。

### DEC-1 — Public props use the system's existing vocabulary

**Decider:** `cixzhang`, `2026-11-03`

命名系统原语的公共 prop 使用系统已有的词，因此熟悉某个组件的构建者在下一个组件上会以同样方式理解同一概念。与锚点的间隙是 `offset`，定位元素相对边缘保持的距离是 `inset`，深度是 `elevation`，而 `lift` 仍是按下时动效的名称。新组件（例如搜索框）的 API 从系统中既有的模式出发，不为系统已经命名的概念引入新术语。

已否决：为共享概念使用组件本地名称。

### DEC-2 — A data attribute outside the private `data-astryx-*` namespace is public surface

**Reference:** `architecture:public-component-api/DEC-2`

**Decider:** `cixzhang`, `2026-11-09`

所有者说：“新增的 data 属性是面向公共的，不应在没有明确规格豁免本规则的情况下用于纯内部关切”，以及“小心 data 属性的主要原因是我们会为主题生成它们”。主题编译会在 data 属性上写入选择器（`data-astryx-*` 作用域，以及镜像 props 的属性，例如 `data-size` 与 `data-variant`），因此组件渲染的 data 属性可被主题读取或定位，从而成为公共表面。因此，只有当当前记录将其命名并说明原因时，组件才会新增 data 属性；纯内部关切应使用 INV23 之下的私有 `data-astryx-*` 属性，或完全不用属性。

对于按实例的动态样式，首选是 StyleX 动态样式（带函数的 `stylex.create`）：它在该实例上以内联方式设置一个生成的自定义属性（`--x-<property>`，或在伪元素或条件下使用哈希名称）。按本规则该属性是私有的：没有主题值、记录或文档命名它，并且它可在任何版本中变更。所有者就 Avatar 的首字母缩写说：“我们应当把它做成 agent 对此类动态样式的首选。”

已否决：为内部关切添加 data 属性而没有命名它的记录。

### DEC-6 — Pull requests carry an API delta, not a committed report

**Decider:** `cixzhang`, `2026-11-09`

所有者说：“好，把这个巨大的文件去掉吧。我们不需要它，我们应当用 codebunny 为每个 PR 自动生成 API 增量。”每个包一份已提交的报告体积大、在每个包中重复表面内容，并且会过时；而为每个 pull request 生成的增量在审查发生之处标出变更。CI 对合并基线与确切 head 的表面比较，是合并闸门读取的机器来源；当修改已发布包的 pull request 缺少该产物时，闸门会关闭（fail closed）；对于任何其他 pull request，闸门不读取任何产物。审查机器人在其摘要说明开头的增量是人类视角（INV24）。

已否决：每个包保留一份已提交的生成 API 报告。

## Verification

| 不变式           | 证据                                                                                            | 失败信号                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1, INV8       | 导出、公共子路径、prop 与 ref 检查                                                              | 承诺的组件/类型无法导入，或其 ref 无法到达契约元素                                                                                                                                                                                                                                                                                  |
| INV2             | 命名与逻辑方向的 lint/测试                                                                      | 等价概念使用相互冲突的名称，或物理方向泄漏到公共 API                                                                                                                                                                                                                                                                                |
| INV2, DEC-1      | 对照系统词汇的公共 API 审查                                                                     | 公共 prop 用新术语命名系统已经命名的概念（例如距离、深度或按压动效），或用 `lift` 表示布局距离                                                                                                                                                                                                                                      |
| INV3, INV4       | 历史 API 审查基准与 `spec:AST-002` 证据                                                         | prop 组合了不相关的轴，或暴露可推导的实现选择；新的交互行为 prop 不是 `<thing>Behavior` 封闭联合、在取值可命名行为之处携带输入词、把一种行为拆成按输入的多个 prop，或作为新 prop 默认值不是已发布行为                                                                                                                               |
| INV5, INV6, INV7 | BaseProps/透传 lint 与有代表性的运行时测试                                                      | 使用方的 ARIA/data/style/事件被丢弃、覆盖组件语义，或无法组合                                                                                                                                                                                                                                                                       |
| INV9             | 已发布表面、Changeset、迁移与公共类型检查                                                       | 已发布的 API 变更却缺少明确的兼容性证据                                                                                                                                                                                                                                                                                             |
| INV11            | 公共 API 准入审查，加上所属主题/组件测试                                                        | 公共语义自定义属性暴露可推导或不受支持的实现细节                                                                                                                                                                                                                                                                                    |
| INV12, INV13     | 生成的声明/导出/行为清单，加上规范所有者映射                                                    | `./internal/*` 之外的可达支撑类型或行为被称为内部，或机械证据被视为接受的许可                                                                                                                                                                                                                                                       |
| INV14            | `AppShell.test.tsx`                                                                             | 组件硬编码一个偏离的断点，或把相等视为低于                                                                                                                                                                                                                                                                                          |
| INV15            | 对生成的声明清单进行公共 API 审查                                                               | 部件或 StyleX 类型的样式 prop 发布时，同一元素上没有对应的 class 名与内联样式输入                                                                                                                                                                                                                                                   |
| INV16            | 对触摸呈现的公共 API 审查，加上粗指针与细指针运行时测试                                         | 稳定组件在粗指针下呈现不同表面或切换打开表面的输入模式，却没有保持其细指针表面与模式的 `presentation` 取值；此类触摸模式调用方无法触达；默认值覆盖调用方的显式选择（`spec:AST-111` FR15 日历例外除外）                                                                                                                              |
| INV17            | compact 边界处的解析器测试，加上公共 API 审查                                                   | 按屏幕尺寸选择呈现方式的组件使用自己的数字，或在宽度 768 或高度 500 处与主题 compact 定义不一致                                                                                                                                                                                                                                     |
| INV18            | 对照组件解剖表的公共 API 审查                                                                   | prop 选择或配置子组件的 prop 或 label；组合渲染了解剖结构未描述的 slot；或渲染内容 slot 不是解剖结构中命名的部件                                                                                                                                                                                                                    |
| INV19            | 公共 API 审查，附带高开销功能的包体与运行时成本说明                                             | 资源开销很大的功能让每个调用方都付出代价，却没有可插拔路径或具名功能 prop                                                                                                                                                                                                                                                           |
| INV20            | 对新布尔 prop 的公共 API 审查                                                                   | 布尔值唯一的作用是视觉切换，而变体更合适                                                                                                                                                                                                                                                                                            |
| INV21            | 对照现有 props、组件、hooks 与工厂的公共 API 审查                                               | 新 API 与现有 API 职责相同，而后者并未因其被弃用；把 hook 喂给单个组件 slot prop 被算作第二个 API                                                                                                                                                                                                                                   |
| INV21a           | 对已发布 API 每次破坏性或弃用性变更的公共 API 审查                                              | 对已发布公共 API 的破坏性或弃用性变更，仅以符合系统规则为由证明其合理                                                                                                                                                                                                                                                               |
| INV22            | 把每个公共交互工具 hook 与其 `create…` 等价物对照的公共 API 审查                                | 交互工具 hook 没有 `create…` 等价物（其结果只能被 Astryx 组件或 StyleX 使用的 hooks，以及依所有者决策的 `useMenuPress` 除外），或等价物的选项名称与含义、事件或返回概念与其 hook 不同                                                                                                                                               |
| INV23            | `@astryx/no-raw-private-attribute` lint 及其基线（测试文件豁免），加上对公共列表的公共 API 审查 | 在其所有者模块、测试或公共列表之外写入 `data-astryx-*` 名称或选择器；命名私有属性的 `dataAttr()` 调用；导出原始名称或选择器的所有者模块；导入另一个包所有者模块的包；设置了某个所有者样式（该样式被其展开）也会设置的属性的调用方；公共导出、`.doc.mjs` 或 Changeset 中的私有属性；新增基线条目；未经 INV9 证据而变更公共 data 属性 |
| INV24            | 生成器测试、CI 的合并基线到 head 表面比较，以及审查机器人按 PR 的 API 增量                      | 承诺的导出、prop、hook、类型、自定义属性、主题目标、公共属性或事件在增量中缺失；被打上内部标签的可达成员缺失；出现 `./internal/*` 或 Lab 成员；当比较产物缺失或生成器报错时，合并闸门仍让修改已发布包的 pull request 通过；审查机器人的摘要说明不以增量或“New public API: none”开头；某一增量行决定了是否接受                       |
| INV25            | 对照 pull request API 增量的公共 API 审查路由                                                   | 没有 current 记录裁定的行未进入人类审查；已被 current 记录裁定的行被留待人类；仅凭未声明的行就要求变更                                                                                                                                                                                                                              |
| 使用方文档投影   | `docPropReferences.test.ts` 与 `docPropLiterals.test.ts`                                        | 文档命名不存在的 prop，或遗漏公共字面取值                                                                                                                                                                                                                                                                                           |

已知的验证缺口：

- INV23 缺口：目前还没有任何机制检查 `data-astryx-*` 之外的数据属性；lint 及其验证行只能看到 `data-astryx-*` 名称，而位于该命名空间之外的既有属性（例如 ToastViewport 的 `data-toast-id`）没有清单。
- INV2、INV3：早于行为属性规则发布的 props 保留其名称，直到某个次版本在 INV9 下重命名它们。该列表是一份不完整的清单；已知偏差包括 Tooltip 和 HoverCard 的 `focusTrigger`、`touchTrigger` 和 `hasHoverIndication`，以及 Text 和 Heading 的 `hasTruncateTooltip`（后两者具有两种以上状态）；Dialog 和 AlertDialog 的 `isInline`；CheckboxListItem 的 `isChecked`；`useTableTreeData` 的 `isAllExpanded`；诸如 `usePopover` 的 `hasLightDismiss` 等 hook 形式；Tooltip、HoverCard 和 Popover 的 `isEnabled`；Overlay 的 `showOn`；Thumbnail 的 `showRemoveOn`；Popover 的 `hasLightDismiss`、`hasEscapeDismiss` 和 `isModal`；Dialog、Drawer 和 BottomSheet 的 `purpose`；Banner 的 `isDismissable`；Drawer、BottomSheet 和 BottomSheetSwitcher 的 `hasScrim`；CommandPalette 的 `isInline`；Carousel 的 `hasLoop` 和 `useListFocus` 的 `wrap`；NumberInput 的 `isWheelEnabled`；Outline 的 `hasScrollOnClick`；`useTableRowExpansion` 和 `useTableTreeData` 的 `hasRowClickExpansion`；`useTableSortable` 的 `isMultiSortEnabled` 和 `allowUnsortedState`；Banner、SideNav、SideNavItem 和 `useResizable` 的 `collapsible` 以及 CodeBlock 的 `isCollapsible`；Calendar 的 `mode` 和 FileInput 的 `isMultiple`；FileInput 的 `mode`；Tokenizer 和 PowerSearch 的 `tokenOverflowBehavior`；OverflowList 的 `behavior`。
- INV2：如果已发布的 prop 用系统用于另一个概念的词来命名某个概念，则它保留该名称，直到某个次版本在 INV9 下重命名它。Outline 的 `offset` 是其滚动根顶部下方的距离（`component:Outline` FR4），而不是距锚点的间距。
- INV3：Carousel 的 `hasSnap` 接受 `boolean | SnapPaging`。省略或为 `false` 时不吸附，`true` 为原生滚动吸附，而来自 `useSnapPaging` 的值是分页吸附。它是对三条规则的已知偏差：`is…` 或 `has…` 布尔值只命名一个没有第三状态的真/假开关（INV3）；选择组件如何响应输入的 prop 是 `<thing>Behavior` 封闭联合（INV2）；按设备而不同的行为提供按设备的值（INV3），其中分页值在手指和触控板滑动下分页，而在鼠标滚轮下保持原生吸附。它为构建者保留一个吸附 prop（`component:Carousel/DEC-2`），且不被重命名。
- INV22：已知缺口包括 `useLongPress`、`usePressFeedback`、`useClickableContainer`、`useInputContainer`、`useOverlay`、`useCombobox`、`useMultiCombobox`、`useResizable`、`useTooltip`、`useHoverCard` 和 `useChatStreamScroll`：它们各自挂接手势、按压、拖拽或运动行为，且尚无 `create…` 工厂；目前还没有完整清单。每个都通过添加其工厂来符合要求；已发布 hook 的签名仅在出现真实需求时改变（INV21a）。
- passthrough lint 目前仅为警告，因为已知违规仍然存在。
- 当前的源码到文档完整性匹配器仍在查找旧的带前缀 props 接口，因此它尚未能证明完整的 prop 覆盖。
- INV24：该差异涵盖声明、CSS 自定义属性、主题目标和公开属性；上下文成员行为、未声明的默认值、CLI schema，以及针对分支和合成合并两者的可观察行为仍需显式审查。
- INV24 缺口：审查配方中的 API 差异尚无测试夹具测试，也没有仓库测试覆盖合并闸门对比较产物的 fail-closed 读取。
- INV18：其解剖结构尚未命名的已发布内容槽位包括 PowerSearch 的 `startIcon` 和 `endContent`，SideNav 的 `topContent`、`footer` 和 `footerIcons`，Tokenizer 的 `startIcon`，DropdownMenu 的 `header` 和 `footer`，以及选择器选项的 `action`；目前还没有完整清单。每个都通过为该部分命名来符合要求，不涉及 API 变更。
- INV18：配置子组件标签或目标的已发布 props，例如 TopNavMegaMenuFeaturedCard 的 `linkLabel` 和 `linkHref`，以及 TopNavHeading 的 `logoLabel`，只能通过在 INV9 下的替换来符合要求。
- INV23：`@astryx/no-raw-private-attribute` 规则运行时带有一个基线，该基线由早于它的站点构成，且目前还没有所有者模块；公共 API 审查覆盖该规则看不到的内容：Changesets、组件 `.doc.mjs` 文件（lint 触及不到它们），以及用 `+` 从命名空间拼装、或在模板中通过 `dataAttrNamespace` 或 `NAMESPACE` 之外的任何方式（成员访问、别名导入、`classPrefix`）取得的名称，还有通过 `element.dataset` 读取或写入的名称。`data-astryx-press` 选择器在 14 个 Core 文件中被复制。仍然在其站点写入的其他私有属性包括 `data-astryx-popover-fallback-close` 和 DropdownMenu 的 `data-astryx-submenu-regions`，Popover 与 DropdownMenuSubMenu 也会在运行时读取它们；`data-astryx-table-pinned` 和 `data-astryx-cell-gliding`，每个都在两个文件中被命名；`data-astryx-scrolling`，只被读取、从未被写入；DropdownMenu 的 `data-astryx-submenu-host`；Chat 编辑器的 `data-astryx-dictation-interim`；以及 RichText 的 `data-astryx-richtext-code-syntax`。目前还没有完整清单。每个都通过移入其自身包内的所有者模块来符合要求，并在其包的代码读取该属性处，从该模块提供运行时读取器。Lab 的 Schedule 会读取 Core 的 `data-astryx-popover-fallback-close`，并通过 Core 的公共 API 或 Lab 拥有的属性来符合要求。

这些缺口在此列出，而不是把部分检查当作完整证明。
