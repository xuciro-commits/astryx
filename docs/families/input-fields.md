---
schema_version: 1
template_version: 1
kind: family
id: family:input-fields
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-20
owners: [cixzhang, imdreamrunner]
review_triggers: [behavior, layout, theming, accessibility]
verified_by:
  [
    packages/core/src/Field/Field.test.tsx,
    packages/core/src/InputGroup/InputGroup.test.tsx,
    packages/core/src/TextInput/TextInput.test.tsx,
    packages/core/src/Selector/Selector.test.tsx,
    packages/core/src/Typeahead/Typeahead.test.tsx,
    packages/core/src/Tokenizer/Tokenizer.test.tsx,
    packages/core/src/Typeahead/BaseTypeahead.test.tsx,
    packages/core/src/MultiSelector/MultiSelector.test.tsx,
    packages/core/src/Field/__tests__/SearchKeyboard.interaction.browser.spec.ts,
    packages/core/src/inputFontFloor.test.ts,
    packages/core/src/Field/useEntryErrorReport.test.tsx,
    packages/core/src/Field/useValueReplacesEntry.test.tsx,
  ]
members:
  [
    component:TextInput,
    component:TextArea,
    component:NumberInput,
    component:DateInput,
    component:DateRangeInput,
    component:DateTimeInput,
    component:TimeInput,
    component:FileInput,
    component:Selector,
    component:MultiSelector,
    component:ComplexSelector,
    component:Typeahead,
    component:Tokenizer,
  ]
architecture:
  [
    architecture:component-theming-surface,
    architecture:interaction-modality,
    architecture:public-component-api,
  ]
contributing: []
deciding_specs:
  [
    spec:AST-001/DEC-1,
    spec:AST-001/DEC-2,
    spec:AST-002/DEC-1,
    spec:AST-099/DEC-5,
    spec:AST-117/DEC-1,
    spec:AST-117/DEC-2,
  ]
---

# Input field family contract

## Intent

一个人应当遇到的是一套连贯一致的输入系统：状态显示、行为、外观和尺寸在各个成员之间采用一致的处理方式与 API 契约。每个组件仍然拥有与其所编辑的值相关的交互模型。

本记录把规范性的族系要求与已交付的事实分开。frontmatter 中的 `verified_by` 列表列出的是有代表性的证据锚点，而不是每个成员的完整测试套件。成员列表和采用表对当前族系是穷尽的；对任何成员的改动仍然需要该成员专门的证据。

## Membership rule

当一个组件的主要公共用途是通过带有内容通道的带标签字段表面来收集或编辑表单值时，它就属于该族系。成员使用 `Field` 语义，或拥有等效的字段外壳，并且能够参与 `FormLayout`。

- **成员：** TextInput、TextArea、NumberInput、DateInput、DateRangeInput、DateTimeInput、TimeInput、FileInput、Selector、MultiSelector、ComplexSelector、Typeahead 和 Tokenizer。
- **协作者：** Field 和 FieldStatus 提供共享的字段外壳；FormLayout 负责排列字段；InputGroup 对其显式采用其能力契约的成员进行分组；InputClearButton、Spinner、Tooltip 和 BaseTypeahead 提供共享的视觉提示或交互行为。这些协作者不是成员。
- **排除项：** CheckboxInput、RadioList、Switch 和 Slider 使用带标签的控件模型，不具备这种内容/末端通道几何。PowerSearch 和 ChatComposer 是更高层的组合，它们消费成员行为，而不是定义另一种字段原语。BaseTypeahead 是没有字段表面的 combobox 引擎。在记录族系采用之前，RichTextEditor 留在该族系之外。

FR10 和 DEC-7 同样约束 CheckboxList、RadioList 和 Slider。它们留在该族系的几何规则之外，但它们会组合 Field，而每个组合 Field 的组件都以相同方式定位基础 props 和样式。

成员资格取决于公共职责，而不是是否使用 `inputWrapperStyles` 或其他实现辅助函数。

## Shared owner

- 该族系负责输入状态显示、行为、外观和尺寸方面一致的跨组件处理方式与 API 契约。尺寸和末端控件几何是该更广泛目标之中的不变式，而不是目标本身。
- `Field` 拥有独立的标签、描述、状态放置以及显式的 `width` 接缝，并且在渲染盒子时是 FR10 下成员的 `container*` 样式目标。当受支持的 InputGroup 拥有组标签和支持文本时，成员会省略其嵌套的 Field。
- `FormLayout` 拥有外部排列、间距、方向、表单级可选性，以及表单级录入错误行为默认值（FR14）。它不重新定义成员内部的控件几何。
- `InputGroup` 对获准的子项拥有行高（目前固定；在 `spec:AST-102` FR4 下它会随设定的文字尺寸增长，固定高度是一处缺口）、连通的外部表面、边缘对齐以及组级焦点呈现。获准遵循 FR3 中的能力契约，而不是一份永久的组件允许列表；仅属于输入族系并不表示支持。
- 每个获准的成员拥有满足 FR3 的分组适配。未分组时的呈现与行为仍归组件所有，且不因获准而改变。末端控件可以是普通的 flex 项，也可以是组件本地的通道；该族系不要求单一的共享包装器、测量钩子、目标、自定义属性或新的公共 prop。
- 共享原语保留各自的视觉与可访问性所有权。特别是，InputClearButton、Spinner、Tooltip、FieldStatus 和 Icon 在组合进字段后不会变成成员专属的 API。
- 内部钩子 `useEntryErrorReport`（`packages/core/src/Field/useEntryErrorReport.ts`）拥有 FR15 中对 DateInput、DateTimeInput、NumberInput 和 TimeInput 共享的部分：已显示的拒绝所接管调用方 `status` 的状态、宣告没有任何已显示状态会宣告的消息的警报，以及 `onEntryErrorChange` 报告（`spec:AST-118` FR5、FR7、FR8）。每个成员传入自己的拒绝、自己的消息，以及调用方 `error` 状态是否在无回调时胜出；条目何时被拒绝以及其消息内容由成员自己决定。
- 内部钩子 `useValueReplacesEntry`（`packages/core/src/Field/useValueReplacesEntry.ts`）为同样的成员决定新的 `value` 何时取代已保留的条目：与保留被拒文本的 Enter 或失焦出现在同一次更新中的 `value` 不会取代（`spec:AST-118` FR4、FR6、DEC-14）。每个成员传入自己的 `value` 和一个在每次此类提交时变化的信号。
- 内部钩子 `useEntryErrorBehavior`（`packages/core/src/Field/useEntryErrorBehavior.ts`）为 DateInput、DateTimeInput 和 TimeInput 解析 FR14：字段自身的 `entryErrorBehavior`，否则是最近的 FormLayout 的 `defaultEntryErrorBehavior`，再否则是 `'complete'`（`spec:AST-117` FR2）。每个成员决定解析出的值在提交之前对它的哪些拒绝生效。NumberInput 在两种取值下都在提交时揭示每一次拒绝，因此它不解析任何内容。
- FieldStatus 拥有其直接的 `attached` 和 `detached` 消息框呈现。Field 拥有与输入框的组合：它在渲染 FieldStatus 之前消费 `tooltip`，并应用成员所支持的放置契约。

## Canonical concepts

| Concept           | Values or states                                     | Default semantics                                                                                           | Stability                         |
| ----------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------------- |
| 字段外壳          | 独立的 Field 或受支持的 InputGroup 路径              | 一个标签/状态所有者包围控件                                                                                 | 已交付的模式                      |
| 字段尺寸          | 在受支持处为 `sm`、`md`、`lg`                        | 相同尺寸的单行控件对齐，且任一状态都不会改变该行                                                            | 已批准的族系规则                  |
| 行内尺寸          | 固有尺寸、显式 `Field.width` 或外层布局              | 成员在值和忙碌状态变化时保持其可用的行内尺寸                                                                | 已批准的规则；例外见下文 Selector |
| 末端控件          | 不存在、清除、忙碌、状态、展开，或组件内容           | 每个渲染出的控件都有不重叠的空间；不存在的控件不会留下无法解释的预留                                        | 已批准的族系规则                  |
| 分组行            | 独立，或获准的 InputGroup 子项                       | InputGroup 拥有行高（在 `spec:AST-102` FR4 下随设定的文字尺寸增长）、连通的边缘和组焦点；子项拥有其分组适配 | 已批准的能力契约；采用情况见下文  |
| 禁用原因          | 不存在，或组件支持的 `disabledMessage`               | 变更仍被阻止时，原因仍可通过键盘和辅助技术触达                                                              | 在提供该能力处为已批准的族系规则  |
| 输入忙碌          | 在提供处为显式 `isLoading` 或待处理的 `changeAction` | 字段值正在解析或正在保存                                                                                    | 由 DEC-2 和 AST-001 批准          |
| 聚焦缩放下限      | iOS 或非 iOS 文本录入                                | iOS 文本录入控件将渲染文字下限设为 16 CSS px 以防止聚焦缩放；其他平台保留主题尺寸                           | 已批准的族系规则                  |
| 数据源忙碌        | 组件自有的异步搜索或选项加载                         | 支持性数据工作与输入的 `isLoading` 分离                                                                     | 由组件/系统规格拥有               |
| Transition Action | 不存在，或组件支持的 `changeAction`                  | 先回调，其次是乐观值，Action 在 transition 中执行，只有一种忙碌呈现                                         | 在提供该能力处为已批准的族系规则  |
| 状态放置          | 输入族系层级的 `attached`、`detached` 或 `tooltip`   | 在成员支持安全重叠处，attached 是默认值；detached 和 tooltip 对每个输入仍然可用                             | 已批准的族系规则                  |
| prop 目标         | 基础 props、`container*`、`control*`                 | 基础 props 到达主要语义控件；`container*` 到达 Field；`control*` 到达控件盒子；没有根级样式输入             | 由 DEC-7 批准                     |
| 录入错误行为      | 在会拒绝条目的成员上为 `complete` 或 `blur-or-enter` | 成员按已交付的方式揭示自身的拒绝，或在提交前保留其所有信号；字段自身的 prop 优先于表单的设置                | 由 `spec:AST-117` 批准            |

## Cross-component invariants

- **FR1 — 行内尺寸在普通字段状态下保持稳定。** 在同一外层布局中，成员不得仅仅因为占位内容变成值，或因为出现忙碌、状态或清除控件，就改变其外层可用的行内尺寸。显式 `width`、父级布局和响应式约束仍然适用。独立的 Selector 是 DEC-1 的例外，可以跟随其显示内容。
- **FR2 — 渲染出的末端控件拥有不重叠的空间。** 文本、token、光标和选中内容不得绘制在清除操作、Spinner、状态控件、展开控件或组件自有的末端内容之下，也不得在这些区域接收指针输入。不存在的通道不得留下陈旧或无法解释的空间。这是一项可观察的要求，而不是强制要求测量或共享通道原语。
- **FR3 — InputGroup 获准要求完整的分组适配。** 任何输入成员在其所属组件显式采用分组模式并证明以下全部条件时可以参与：它从组中解析出兼容的控件高度和尺寸；移除或抑制相互竞争的外层 Field、边框、圆角和表面几何；一致地委托连通的边框、圆角和组级焦点呈现；通过组件自有的截断、折叠、裁剪或溢出将内容保持在单行组几何之内；并保留输入的可访问名称与描述、值语义、键盘行为、焦点行为以及编辑或选择模型。获准遵循这些能力，而不是一份永久的允许列表。仅属于族系或仅消费上下文是不够的。
- **FR4 — 在支持处，禁用原因保持可触达。** 当成员提供 `disabledMessage` 时，非活动字段仍可聚焦（`spec:AST-085`）并暴露原因，同时编辑、选择和激活保持被阻止。没有该公共概念的组件不必添加它。
- **FR5 — 输入加载描述的是值，而不是支持性数据。** 在成员提供 `isLoading` 处，它表示字段值正在解析或正在保存。它不得使独立提供的选项不可用，也不得改变数据源 prop 的契约。初始选项源待处理是 AST-001 所要求的独立显式状态。
- **FR6 — Transition Action 保留即时反馈。** 在成员提供 `changeAction` 处，每条有文档记录的值变更路径都先执行 `onChange`，乐观地呈现提议的受控值，在 React transition 中执行 `changeAction`，并一直贡献到同一忙碌呈现，直到受控值接受或取代它。
- **FR7 — 组件自有的数据源工作保持族系几何与可访问性。** Typeahead 和 Tokenizer 通过 BaseTypeahead 拥有异步搜索状态，而不是通过族系的 `isLoading` 含义。它们可见的数据源忙碌反馈仍然必须具名，在 combobox 上暴露忙碌语义——或者，在没有 combobox 的呈现中，例如 Tokenizer 的 sheet（`component:Tokenizer` DEC-3），在搜索所更新的结果列表上暴露——并在分组时满足 FR1、FR2 和 FR3。
- **FR8 — 状态放置遵循成员能力。** 每个输入都必须提供 `detached` 和 `tooltip`。成员仅当其直接控件是不透明的、有边框的、固定高度（高度由其解析出的尺寸设定，并在 `spec:AST-102` FR4 下随设定的文字尺寸增长），并且其所属根可靠地反映用于重叠的解析尺寸时，才支持 `attached`。在支持处，`attached` 是默认值。被包裹的、自定义的、高型的或半透明表面通常使用 `detached` 或组件自有的放置。直接的 FieldStatus 仍只支持 `attached` 和 `detached`；Field 在渲染它之前消费 `tooltip`。
- **FR9 — 聚焦缩放下限仅适用于 iOS。** 使用族系聚焦缩放防护的文本录入控件，必须在受支持的 iOS 触摸路径上将可编辑文字解析为至少 16 CSS px。Android、桌面触摸以及其他非 iOS 的粗指针环境必须保留当前主题的字号比例，而不是继承 iOS 的下限。平台检测机制仍是实现细节，但它必须保留这些可观察结果。
- **FR10 — 基础 props 到达控件；样式只到达具名部分。** 这是输入族系对基础样式的例外：在 `architecture:public-component-api` 和 `spec:AST-071` 为组件提供根 `xstyle`、`className` 和 `style` 的地方，由 Field 组合的组件没有这些。在每个组合 Field 的组件中：
  1.  `ref`、`id`、`data-*`（包括 `data-testid`）、`aria-*`、`hidden`、`inert`、`dir` 以及 DOM 事件处理器必须到达主要语义控件：携带字段可访问名称和值的原生 input、textarea 或 combobox/触发元素。对于组输入（RadioList、CheckboxList），主要语义控件是组元素（`role="radiogroup"` 或 `role="group"`）；逐选项的 props 留在选项 API 上。
  2.  组件的 props 类型不得接受根 `xstyle`、`className` 或 `style`；传入其中之一是类型错误。开发构建在无类型的调用方于运行时传入时发出警告，且该值不会被应用。
  3.  `containerXstyle`、`containerClassName` 和 `containerStyle` 在渲染 Field 盒子时必须到达它。在没有渲染的情况下（在 InputGroup 内，以及在水平标签的 FormLayout 中，Field 直接将其子项排布在表单的列中），它们没有效果，开发构建会发出警告；在 InputGroup 内由调用方为组设置样式。
  4.  `controlXstyle`、`controlClassName` 和 `controlStyle` 必须到达视觉控件盒子：绘制字段边框和背景、并包含其图标和末端控件的元素。它们绝不指向原生 input。每一组都是一个 `spec:AST-071` 部分集。
  5.  样式绝不改道：没有任何布局会把 `container*` 移到控件盒子，或把 `control*` 移到 Field。

  组件自有的值回调（`onChange(value)`）从基础 props 中类型排除，并保留其值签名。重新定位基础 prop 会改变使用方 DOM 处理器所到达的元素，而不会改变其顺序或取消行为：组件保留它已发布的顺序和取消行为，并在其文档和 JSDoc 中说明任何与 component-first 组合不同的顺序。组件首次转发的处理器通过共享组合辅助函数按 component-first 方式组合。任何组件和任何布局都不得改变 prop 目标。

- **FR11 — 清除控件的 tooltip 命名的是操作，而不是字段。** 每个成员的清除控件在悬停和键盘聚焦时必须显示本地化的通用 tooltip “Clear”，无论字段的标签是什么、清除的范围如何。其可访问名称保持上下文相关并由成员拥有，例如 “Clear Search” 或 “Clear all Countries”，并包含可见的那个词。
- **FR12 — 搜索输入请求 Search 键且不启用自动更正。** Typeahead、Tokenizer 以及 Selector 和 MultiSelector 搜索行的搜索输入必须携带 `enterkeyhint="search"` 和 `autocorrect="off"`，以便触摸键盘显示其 Search 键，并让名称和标识符保持所输入的样子。它们只是键盘提示：无论按键显示什么，Enter 都按各成员自己的契约行事，而桌面浏览器会忽略两者。它们是成员自有的默认值，这些成员上没有调用方 prop；`component:TextInput` FR16 仅在 TextInput 和 TextArea 上允许键盘 props，在那里调用方为搜索字段设置 `enterKeyHint="search"`。

- **FR13 — 唤起键盘的成员保持在键盘之上。** 当屏幕键盘打开时，成员的聚焦文本录入字段在以下情形中保持在键盘之上可见：该成员渲染在页面的滚动内容中、渲染在 Core 宿主（例如 sheet）中，或渲染在应用停靠于视口底边且自身没有 `translate` 的固定栏中；位于此类栏中的成员随键盘一起移动，如 `spec:AST-099` FR9 所定义。位于任何其他固定容器内、浮于底边之上、设置了自身 `translate` 或占满整个视口的成员不会被移动；由应用来定位它。这涵盖 TextInput、TextArea、NumberInput，DateInput、DateTimeInput 和 TimeInput 的带类型字段，Typeahead 和 Tokenizer 的输入框，以及 Selector 和 MultiSelector 的搜索行。这是没有 prop 或其他公共 API 的内部行为，如 `spec:AST-099` FR9 所要求；该记录拥有可观察规则以及所涵盖字段的完整列表，包括 PowerSearch、CommandPalette 和 ChatComposer 的字段。字段不会唤起键盘的成员，例如 DateRangeInput、FileInput、ComplexSelector，或没有输入模式的触摸选择器字段，不在此范围内。

- **FR14 — 会拒绝条目的成员共享同一种录入错误行为。** DateInput、DateTimeInput、TimeInput 和 NumberInput 接受 `entryErrorBehavior`：`'complete'`（默认值）保持各成员已交付的时机，而 `'blur-or-enter'` 将拒绝的所有信号保留到 Enter 或失焦。FormLayout 的 `defaultEntryErrorBehavior` 为表单设定它，而字段自身的 prop 优先。`spec:AST-117` 拥有该规则。自身不拒绝任何条目的成员，例如 TextInput、Selector 和 DateRangeInput，不接受录入错误行为。
- **FR15 — 被拒绝的条目绝不会被提前标记，也不会被静默丢弃。** DateInput、DateTimeInput、TimeInput 和 NumberInput 在条目完成时揭示值拒绝、在提交时揭示文本拒绝，在独立字段中将每一次拒绝显示为带无效状态和一次宣告的可见消息，并在提交时保留被拒绝的输入文本；原生控件在失焦时恢复其已提交值，并保留该拒绝的消息。表单提交的内容不变（`spec:AST-118` FR4）。调用方的 `warning` 或 `success` 状态，或没有消息的 `error` 状态，绝不会隐藏拒绝的消息。带有消息的调用方 `error` 状态在 NumberInput 和 TimeInput 上代替它显示，在 DateInput 上仅在设置了 `onEntryErrorChange` 时如此；NumberInput 和 TimeInput 通过 `onEntryErrorChange` 报告每一次拒绝。输入的数字只在提交时才完整，因此 NumberInput 在 Enter 或失焦时揭示其拒绝，而在用户输入期间不作任何揭示。`spec:AST-118` 拥有该规则，包括每种条目何时算完整。FileInput 的拒绝针对的是被选取的文件，它会把它们从其值中丢弃，因此不在该规则范围内。

## Allowed component variation

- **AV1 — 原生控件与组合控件。** 文本字段可以使用原生 input；选择控件可以使用按钮/列表框或对话框组合。
- **AV2 — 末端控件机制与含义。** 成员可以使用流内的 flex 项或组件本地的流外通道，并可以渲染清除、忙碌、状态、展开、步进器或有文档记录的自定义内容。该机制不会削弱 FR1 或 FR2。
- **AV3 — 块轴增长与分组适配。** TextArea 和 Tokenizer 在未分组时可以沿块轴增长以容纳多行或多 token 内容。InputGroup 获准不会改变这些独立默认值。在分组模式下，获准的组件拥有满足 FR3 的呈现。Tokenizer 正是在此基础上获准，并且当调用方没有选择其他受支持的溢出模式时，必须默认为一种保留组单行外观的组件自有溢出处理。该分组默认值不要求新的公共 prop 或主题目标。
- **AV4 — Action 回调形状。** 文本编辑成员可以将它们的变更事件传给 `changeAction`；结构化值成员可以只传提议的值。组件文档拥有确切的回调类型。
- **AV5 — 受支持的概念各不相同。** 成员不必仅为加入族系就添加 `size`、`isLoading`、`changeAction`、`disabledMessage`、清除或 InputGroup 支持。当它提供上述某个概念时，相应的族系规则适用。
- **AV6 — attached 状态支持。** 无法满足 FR8 的成员保持 attached 不可用，而不是近似实现重叠。它仍通过族系状态契约提供 detached 和 tooltip。
- **AV7 — 平台检测。** 实现可以使用任何受支持的能力测试来识别 iOS 触摸路径，而不把该下限应用于非 iOS 的粗指针。该契约不要求特定的 CSS 查询、浏览器字符串或共享辅助函数。

## Representative matrix

| Member and state                                 | Shared invariant                                                                                               | Deliberate variation                                              |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| TextInput / 空、有值或输入忙碌                   | 行内尺寸稳定；流内末端控件不重叠文本                                                                           | 原生 input 以及可选的清除/状态控件                                |
| Selector / 占位符或已选中                        | 末端控件和分组行保持有界                                                                                       | 在 DEC-1 下，独立行内尺寸可以跟随显示内容                         |
| Typeahead / 空、已选中或数据源忙碌               | 独立和分组时行内尺寸稳定，且末端区域不重叠                                                                     | 可编辑输入变为已选中的 Token；数据源忙碌由 BaseTypeahead 拥有     |
| Tokenizer / 独立 token、数据源忙碌和 endContent  | 行内尺寸稳定，内容与末端控件清晰分离                                                                           | 独立 token 可以换行并沿块轴增长字段                               |
| Tokenizer / 获准的 InputGroup 模式               | 组高度、连通表面、语义和键盘行为保持一致                                                                       | 分组默认使用单行溢出处理；调用方选定的受支持溢出可以在 FR3 内变化 |
| ComplexSelector / 占位符、已选中或输入忙碌       | 字段表面稳定，Spinner/展开不重叠                                                                               | 调用方拥有富弹出内容；没有已交付的 InputGroup 支持                |
| 获准成员 / InputGroup                            | 兼容的尺寸/高度、单一外层表面/焦点所有者、单行几何，以及保留的语义                                             | 组件拥有其内部的分组截断、折叠、裁剪或溢出                        |
| 带 `disabledMessage` 的成员                      | 原因可触达；变更保持被阻止                                                                                     | 组件拥有焦点目标和 Tooltip 组合                                   |
| 成员 / 校验状态                                  | detached 和 tooltip 可用；仅当支持时 attached 才是默认值                                                       | 组件拥有其控件是否安全满足 attached 资格                          |
| 有下限的文本录入 / iOS 触摸                      | 可编辑文字解析为至少 16 CSS px，且聚焦不会触发浏览器缩放                                                       | 主题尺寸可能已经满足该下限                                        |
| 有下限的文本录入 / 非 iOS 粗指针                 | 当前主题的字号比例仍然生效                                                                                     | 平台和输入硬件可能不同                                            |
| 由 Field 组合的组件 / 独立、水平标签、InputGroup | 基础 props 在主要语义控件上；`container*` 在渲染出的 Field 盒子上；`control*` 在控件盒子上；根级样式是类型错误 | 在没有渲染 Field 盒子处，`container*` 没有效果                    |

## Adoption and exceptions

### Current shipped facts

| Component       | Current adoption                                                                                            | Recorded exception                                                                                         |
| --------------- | ----------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| TextInput       | 字段、FormLayout、InputGroup、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                 | 无                                                                                                         |
| TextArea        | 字段、FormLayout、尺寸、宽度、`isLoading`、`changeAction`、状态和禁用原因；块轴增长                         | 与 InputGroup 不兼容                                                                                       |
| NumberInput     | 字段、FormLayout、InputGroup、尺寸、宽度、清除、状态和禁用原因                                              | 没有已交付的 `isLoading` 或 `changeAction`                                                                 |
| DateInput       | 字段、FormLayout、InputGroup、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                 | 无                                                                                                         |
| DateRangeInput  | 字段、FormLayout、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                             | 与 InputGroup 不兼容                                                                                       |
| DateTimeInput   | 字段、FormLayout、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                             | 与 InputGroup 不兼容                                                                                       |
| TimeInput       | 字段、FormLayout、InputGroup、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                 | 分组 sheet 表面缺少隐藏标签、描述和状态，且分组的 tooltip 状态不描述任何内容（`component:TimeInput` FR10） |
| FileInput       | 字段、FormLayout、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                                   | 没有公共 `size`；紧凑模式和 dropzone 模式归组件所有                                                        |
| Selector        | 字段、FormLayout、InputGroup、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                 | DEC-1 允许独立的内容自适应宽度                                                                             |
| MultiSelector   | 字段、FormLayout、InputGroup、尺寸、宽度、`isLoading`、`changeAction`、清除、状态和禁用原因                 | 触发器显示模式仍归组件所有                                                                                 |
| ComplexSelector | 字段、FormLayout、尺寸、宽度、`isLoading`、`changeAction` 和状态                                            | 没有 InputGroup 或禁用原因 API                                                                             |
| Typeahead       | 字段、FormLayout、InputGroup、尺寸、宽度、清除、状态、禁用原因和 BaseTypeahead 数据源加载                   | 没有族系的 `isLoading` 或 `changeAction`；搜索生命周期归组件所有                                           |
| Tokenizer       | 字段、FormLayout、InputGroup、尺寸、宽度、清除、状态、禁用原因、BaseTypeahead 数据源加载和多 token 块轴增长 | 没有族系的 `isLoading` 或 `changeAction`                                                                   |

当前已带有 16px 防缩放下限的文本录入控件只在 iOS 上应用该下限。这包括输入族系的成员，以及族系全局源码防护所覆盖的现有共享或更高层文本录入协作者；DEC-6 不要求无关组件添加新的下限。

### Implementation gaps

- **Typeahead 状态几何：** 当前 main 在显示已选中的 Token 时把固有宽度输入从布局中移除，因此内容自适应宽度的父级可能让字段塌缩到值上。其清除控件单独定位，当前的数据源忙碌反馈是一个流内静态时钟，没有 `aria-busy`；已选中、数据源忙碌和分组的组合没有 FR1–FR3 和 FR7 所要求的聚焦几何覆盖。PR [#5555](https://github.com/meta/astryx/pull/5555) 和 [#5682](https://github.com/meta/astryx/pull/5682) 记录了尝试过的实现，属非权威证据。任何实现都保持其 DOM/CSS 机制由组件自有，并且必须在其确切的 head 上对照该契约审查。
- **Tokenizer 状态几何与分组获准：** 当前 main 将 `endContent` 和清除控件定位为流外，却不预留它们的渲染宽度，因此狭窄的输入内容可能从它们下方穿过。token 数量也可能改变固有行内尺寸。PR #5555 是一个尝试性组件本地预留的非权威证据。Tokenizer 兼容 InputGroup：`component:Tokenizer` FR30 在 FR3 下记录其分组模式，采用单行溢出处理，且未分组行为不变。
- **Selector 数据源状态语义：** Selector 和 MultiSelector 在输入 `isLoading` 为 true 时保持所提供的选项可用，但当前的空/无结果呈现仍将该标志视为选项源待处理，而这两个组件都没有 AST-001 所要求的显式数据源待处理 API。
- **Transition Action 覆盖：** 当前 FileInput 的清除提示在没有 `changeAction` 的情况下调用 `onChange`，并且 FileInput 在其 Action 待处理期间没有显式地把提议的受控文件保持为乐观值。当前 main 上检查到的其他已暴露清除路径都经过其普通的 Action 管道。这些是 FR6 下的一致性缺口，而不是另一种族系语义。
- **状态放置一致性：** 当前 Field 对任意子项默认 attached，而不证明该控件满足 FR8。TextArea、Tokenizer 和 FileInput 的 dropzone 是典型的高型、被包裹或自定义表面，不能仅凭共享默认值就继承 attached。部分成员文档也缺少 tooltip 或整个状态放置映射，尽管 Field 会消费族系哨兵值。后续工作必须使 attached 能力以及输入层级的三种选择在每个成员的 API 和文档中准确。
- **attached FieldStatus 重叠：** attached 放置仅限于符合条件的成员，其直接控件和所属根可靠地暴露解析尺寸。符合条件的成员保留 attached 放置；不受支持的被包裹、自定义、高型和半透明表面保留组件自有的放置，通常为 detached。[PR #5769](https://github.com/meta/astryx/pull/5769) 是一个尝试性实现的非权威证据，该实现从后代的 `data-size` 推导重叠；该机制本身并不能确立资格或根尺寸所有权。
- **Prop 目标：** 当前组件尚未满足 FR10。下面每个组件都接受根 `xstyle`/`className`/`style`，且没有一个接受 `container*` 或 `control*`。今天的目标：

  | Component      | Root styling reaches | Base props reach               | Primary semantic control | Root styling migrates to |
  | -------------- | -------------------- | ------------------------------ | ------------------------ | ------------------------ |
  | FileInput      | 控件盒子             | 原生 file input                | 原生 file input          | `control*`               |
  | DateRangeInput | 控件盒子             | 控件盒子；`ref` 位于触发按钮上 | 范围触发器               | `control*`               |
  | Selector       | 控件盒子             | 触发按钮                       | 触发按钮                 | `control*`               |
  | Typeahead      | Field                | Field                          | combobox 输入框          | `container*`             |
  | Tokenizer      | Field                | Field                          | combobox 输入框          | `container*`             |
  | Slider         | Field                | 不转发；`ref` 位于轨道上       | 滑块控件                 | `container*`             |

  一致性意味着经批准的根级样式移除；`astryx upgrade` codemod 会按最后一列把每个组件的根级样式改写为它今天所到达的部分。codemod 无法追踪通过产品包装器自身 props 或展开传入的样式；FR10 的类型错误会暴露那些调用点。

- **屏幕键盘（FR13）：** 当前 main 上没有任何成员满足 FR13。没有任何成员具备键盘处理，键盘模块也尚不存在；`spec:AST-099` 列出了每一处缺口。
- **被拒绝的条目（FR15）：** 在 InputGroup 内，成员自身的拒绝不显示任何可见消息。`spec:AST-118` 列出了每一处缺口。
- **验证覆盖：** 当前单元测试证明组合、语义和个别状态行为，但尚未提供下面完整的真实浏览器行内尺寸/末端重叠矩阵。本记录列出这些实现缺口，而不是声称它们已被修复。

验证映射列出的是有代表性的证据，而不是每个成员的完整测试套件。穷尽的覆盖义务遵循成员列表和采用表。

## Verification map

| 契约 | 验证                                                                                                                                                                                                                                                                               | 代表性成员和状态                                                                            | 变更或失败预期                                                                                                                                                                                                               |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1  | 在块、flex 项、inline-block、grid 自动轨道和显式宽度容器中进行真实 Chromium 的前/后行内尺寸测量                                                                                                                                                                                    | TextInput 基线；Selector 例外；Typeahead 空/已选中/数据源忙碌；Tokenizer 零/一/多个 token   | 值或忙碌状态变化会在已记录例外之外改变字段的外部行内尺寸                                                                                                                                                                     |
| FR2  | 在受支持的窄宽度和 LTR/RTL 下，真实 Chromium 的内容盒/控件盒重叠矩阵                                                                                                                                                                                                               | 清除、Spinner、状态、披露、Tokenizer `endContent`；单独及组合                               | 内容、插入符或指针命中区域与渲染的尾部控件相交，或其卸载后仍保留过时的预留空间                                                                                                                                               |
| FR3  | InputGroup 单元测试，加上渲染尺寸/高度、表面/焦点所有权、溢出和交互检查                                                                                                                                                                                                            | 每个被接纳成员；Tokenizer 零/一/多个 token、聚焦/未聚焦、显式/默认溢出；不匹配的子项/组尺寸 | 子项保留竞争的外部几何、扩展或增加一行、失去连接的焦点/边框所有权，或改变命名、键盘、焦点、编辑或选择语义                                                                                                                    |
| FR4  | 键盘、指针和无障碍树测试                                                                                                                                                                                                                                                           | 每个暴露 `disabledMessage` 的成员                                                           | 原因变得不可达，或禁用控件发生变更/激活                                                                                                                                                                                      |
| FR5  | 来自 AST-001 的 Selector 和 MultiSelector 交互与播报测试                                                                                                                                                                                                                           | 输入忙碌时的已填充选项；显式数据源待定；已完成的空状态                                      | 输入忙碌压制提供的选项，或替代数据源状态                                                                                                                                                                                     |
| FR6  | 针对每个支持 Action 的变更路径的聚焦回调/顺序/乐观/忙碌测试                                                                                                                                                                                                                        | 键入、选择、日历/预设、文件选择，以及暴露时的清除                                           | 回调/Action 顺序改变、乐观反馈消失，或清除路径绕过 Action 契约                                                                                                                                                               |
| FR7  | Typeahead/Tokenizer 数据源忙碌测试和真实浏览器几何检查                                                                                                                                                                                                                             | 直接 BaseTypeahead、独立包装器、分组 Typeahead、已选中/已 token 化的值                      | 忙碌反馈未命名/重复，`aria-busy` 缺失，或数据源加载改变行/行内几何                                                                                                                                                           |
| FR8  | 代表性成员测试加真实浏览器重叠/不透明度/高度检查                                                                                                                                                                                                                                   | 合格的单行直接控件；被包装、自定义、高和半透明控件；全部三种放置                            | 受支持处缺少 attached，不安全处出现 attached，或 tooltip 到达直接 FieldStatus                                                                                                                                                |
| FR9  | `inputFontFloor.test.ts`、聚焦的计算样式检查和真实 iOS Safari 聚焦证据                                                                                                                                                                                                             | iOS 触摸、非 iOS 粗指针和桌面精细指针                                                       | iOS 渲染低于 16 CSS px 或聚焦缩放，或非 iOS 粗指针收到仅限 iOS 的下限                                                                                                                                                        |
| FR10 | 对每个 Field 组合组件的 props 进行类型测试：只要其中一个接受根级 `xstyle`、`className` 或 `style` 即失败；逐组件渲染测试覆盖每个基础 prop、`container*` 和 `control*` prop，以及两种开发警告                                                                                       | 每个 Field 组合组件在独立使用时、在水平标签 FormLayout 中，以及在被接纳时位于 InputGroup 内 | 组件在带根样式时通过类型检查、基础 prop 没有落到主语义控件上、`container*` 落在 Field 盒之外或控件盒上、`control*` 落在控件盒之外，或缺少警告                                                                                |
| FR11 | `InputClearButton.test.tsx` 的 tooltip 和可访问名称断言，加上真实 Chromium 悬停截图                                                                                                                                                                                                | 长字段标签；区域设置覆盖；浅色和深色                                                        | tooltip 重复字段标签，或可访问名称丢失字段标签                                                                                                                                                                               |
| FR12 | `Typeahead.test.tsx`、`BaseTypeahead.test.tsx`、`Tokenizer.test.tsx`、`Selector.test.tsx` 和 `MultiSelector.test.tsx` 中针对两个属性的用例，其中 Enter 保持其成员拥有的效果；`SearchKeyboard.interaction.browser.spec.ts` 在触摸模拟手机上运行，其中点按聚焦的搜索输入同时携带两者 | Typeahead；Tokenizer；Selector 和 MultiSelector 搜索行；带触摸模拟的手机视口                | 缺少属性，或 Enter 的效果随标签改变，即为失败                                                                                                                                                                                |
| FR13 | TBD（差距）：`spec:AST-099` FR9 所指的逐字段键盘聚焦测试和模拟器证据                                                                                                                                                                                                               | FR13 覆盖的每个成员，在页面、sheet、Core 移动的停靠栏、浮动栏和带自身 `translate` 的栏中    | 聚焦字段在滚动容器（包括 FR9 留给应用的固定容器内的滚动容器）、Core 宿主或 Core 移动的停靠栏中留在键盘下方，或存在针对该行为的公共 prop；字段与其浮动、自带 `translate` 或全视口宿主之间没有滚动容器时，由应用定位，不算失败 |
| FR14 | `DateInput.test.tsx`、`DateTimeInput.test.tsx`、`TimeInput.test.tsx` 和 `NumberInput.rejectedEntry.test.tsx` 的 entryErrorBehavior 用例；`FormLayout.test.tsx` 的 “FormLayout defaultEntryErrorBehavior” 用例                                                                      | DateInput、DateTimeInput、TimeInput 和 NumberInput 在每种取值下，独立及在 FormLayout 中     | 在 `'blur-or-enter'` 下提交前出现信号、`'complete'` 与已发布行为不同，或表单默认值优先于字段自身 prop                                                                                                                        |
| FR15 | `NumberInput.rejectedEntry.test.tsx`；`TimeInput.test.tsx` 和 `NativeTimeInput.test.tsx` 的拒绝录入套件；DateInput 和 DateTimeInput 的拒绝录入套件（其记录所点名）                                                                                                                 | DateInput、DateTimeInput、TimeInput 和 NumberInput，键入式和原生，独立及分组                | 未完成的录入被标记、提交丢弃被拒绝文本、拒绝不显示消息，或其信号分离                                                                                                                                                         |

## Decision links

### DEC-1 — Selector is the standalone inline-size exception

**决策者：** `cixzhang`，`2026-08-30`

Selector 属于输入字段族，但独立的 Selector 可以随其显示的占位符或已选值确定尺寸。该例外不解除 FormLayout、受支持的 InputGroup 或显式产品布局施加的约束。

### DEC-2 — Input loading describes value resolution or saving

**决策者：** `cixzhang`，`2026-08-30`

对于暴露 `isLoading` 的成员，它描述字段值正在解析或正在保存。它不表示选项或支持数据正在加载。值忙碌期间，数据源 prop 保持其正常契约。

`spec:AST-001/DEC-1` 和 `spec:AST-001/DEC-2` 将该区分应用于 Selector 和 MultiSelector：提供的选项保持可用，零选项是无选择状态，初始选项源待定必须是显式的。

### DEC-3 — Transition Actions are an input-family contract

**决策者：** `cixzhang`，`2026-08-30`

可选的 `changeAction` API 及其乐观/待定行为属于输入族。组件文档拥有每个值和事件类型，但成员不会独立重新定义回调顺序、乐观反馈或忙碌状态语义。

公共 API 接纳仍由 `spec:AST-002/DEC-1` 拥有；本族不添加单独的无效状态或 API 护栏策略。

### DEC-4 — Attached status is conditional capability, not universal geometry

**决策者：** `cixzhang`，`2026-08-31`

每个输入都提供 detached 和 tooltip 状态放置。仅当成员的直接控件不透明、有边框、高度固定，且其拥有根节点可靠反映用于重叠的解析尺寸时，成员才提供 attached。在支持时，attached 是默认值。被包装、自定义、高或半透明的表面通常使用 detached 或保留组件拥有的放置。固定高度是由解析尺寸设定的高度，该高度会在 `spec:AST-102` FR4 下随设置的文本大小增长。

直接 FieldStatus 仍仅限于 attached 和 detached 呈现。Tooltip 是输入族的一种组合，Field 在渲染 FieldStatus 之前消费它。

已否决：从任何后代 `data-size` 派生通用的 attached 重叠，因为后代元数据无法证明直接表面不透明、有边框、高度固定，或是该解析尺寸的所有者。

### DEC-5 — InputGroup admission is capability-based

**决策者：** `cixzhang`，`2026-09-09`

InputGroup 兼容性不是封闭的组件允许列表。任何输入族成员都可以在其组件契约和实现明确采用分组模式并满足 FR3 时参与：兼容的解析尺寸和控件高度、没有竞争的外部 Field 或表面几何、协调一致的连接边框/圆角/焦点所有权、单行组几何，以及保持不变的输入语义和键盘行为。

Tokenizer 依据此规则被接纳。其未分组时的换行和溢出默认值保持不变。在分组模式下，当调用方未选择任何受支持的溢出模式时，Tokenizer 默认为一种组件拥有的处理方式，以保留组的单行外观。实现可以复用其现有的溢出表面；此决策不添加公共 prop、回调、主题目标或通用 InputGroup 分支。

已否决：永久的硬编码允许列表、仅针对 Tokenizer 的例外、允许在没有完整分组适配的情况下消费 context，或强迫独立的多行/多 token 输入进入单行呈现。

### DEC-6 — The 16px focus-zoom floor applies only on iOS

**决策者：** `cixzhang`，`2026-09-20`

携带防缩放护栏的文本录入控件在受支持的 iOS 触摸路径上将可编辑文本解析为至少 16 CSS px。其他粗指针平台保留活动主题的字号比例，因为它们不共享此护栏所应对的 iOS 聚焦缩放行为。

该契约拥有可观察的平台结果，而不是特定的特性查询或源码模式。现有共享和更高层级的文本录入表面可以复用族规则而无需成为输入族成员，此决策也不要求无关控件采用新的下限。

已否决：将 16px 下限应用于每个粗指针。指针精度并不能确立 iOS 浏览器行为，并且会在 Android 和带输入能力的触摸笔记本电脑上放大文本，同时无法阻止相应的缩放失败。

### DEC-7 — Field-composed components forbid root styling

**决策者：** `cixzhang`，`2026-10-11`

调用方向字段传入基础 prop 时，期望作用于人操作的控件，因此 `ref`、id、test id、ARIA 和处理程序到达主语义控件。字段有两个可样式化表面：整个字段及其视觉控件盒，而根 `xstyle` 将不得不在两者中静默地选一个。因此本族声明基础样式的一个例外：没有根样式输入，只有 Field 的 `container*` 和控件盒的 `control*`，各自都是一个 AST-071 部分集。一个将 props 展开到输入中的产品包装器会在调用点得到类型错误，而不是一个 codemod 无法看到的视觉移动。每个部分在每个成员和布局中保持一个目标；当它的元素不渲染时，该部分没有效果，而不是移动到另一个元素。

已否决：保留根 `xstyle` 并将其路由到 Field；展开和包装器会静默移动样式。

### DEC-8 — Prop retargeting keeps each component's handler order

**决策者：** `cixzhang`，`2026-10-11`

使用方处理程序相对于组件自身处理程序的运行时机，以及它是否可以取消内置行为，是 `architecture:public-component-api` INV9 保持稳定的已发布交互行为。将基础 prop 移到语义控件会改变使用方处理程序到达的元素，但不改变该行为，因此组件保持其已发布的顺序和取消行为，并记录任何不同于组件优先组合的顺序。组件优先的取消组合仅适用于组件首次转发的处理程序。

已否决：对每个重新定位的处理程序都按组件优先进行组合；一个取消内置行为或观察组件所取消事件的使用方，会在没有 API 变更信号的情况下改变行为。

### DEC-9 — The clear tooltip names only the action

**决策者：** `cixzhang`，`2026-10-13`

字段标签已经位于清除字形旁边，因此视力正常的用户只需要该操作。重复标签会让长标签或名词短语标签读起来像别扭的文案。屏幕阅读器用户看不到按钮周围的字段，因此可访问名称保留标签。

已否决：重复可访问名称的 tooltip；它会在屏幕上重复标签。

### DEC-10 — Search inputs label their Return key Search

**决策者：** `cixzhang`，`2026-11-01`

成员的搜索输入已经知道 Enter 会搜索或提交结果，因此它自行标记该键（`architecture:public-component-api` INV4），正如 NumberInput 选择其数字键盘（`component:NumberInput` FR1）。搜索词是会被自动更正改写的名称和标识符，因此关闭更正。

## Open questions

无。

## Content boundary

本记录仅拥有跨组件的字段行为。组件 props、选择/搜索算法、视觉目标映射、实现机制、当前审计结果和产品特定的组合仍由其组件、架构、设计、审计或调用点所有者拥有。
