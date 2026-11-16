---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-079
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-14
phase: accepted
owners: [cixzhang]
affects_architecture:
  [architecture:public-component-api, architecture:component-theming-surface]
affects_families: [family:input-fields]
affects_contributing: []
affects_consumer_docs: [Selector, MultiSelector, ComplexSelector]
---

# Shared selector trigger hierarchy system spec

## Intent

构建者可以把 `Selector`、`MultiSelector` 或 `ComplexSelector` 放在工具栏或导航区域的控件旁边，而不必让一个选择器看起来像表单字段、另一个却使用不同的层级。`Selector` 在其当前组件契约中定义了 `input`、`secondary` 与 `ghost` 触发词表。`MultiSelector` 与 `ComplexSelector` 采用相同的值与角色，因此三个内置选择器触发都表达同一种调用方选择，同时保留各自的值与弹出行为。

## Ownership boundary

`component:Selector` 拥有 Selector 的封闭触发值，以及 DD1 中其 `secondary` 触发与相邻 secondary Button 之间的持久关系。本记录拥有该词表被 `MultiSelector` 与 `ComplexSelector` 采用的部分，以及跨组件要求：三者暴露相同的值名称、默认值与静止角色。它们的组件记录保留各自选择器的选择、弹出与结构契约。

已发布的 `Button` 组件拥有自己的变体映射与 secondary 处理；本记录不定义 Button 行为。它要求每个内置选择器的 `secondary` 触发在活动主题中与该处理匹配。`family:input-fields` 拥有由 FR5 与 FR6 投射的布局、状态与 InputGroup 规则，但它不会把这条视觉轴加到 input 家族的每个成员上。一般控件层级、精确 token 选择以及组件几何仍在本记录之外。

## Non-goals

- 把触发变体加到 input 家族的其他成员上。
- 替换或削弱 `component:Selector/DD1`。
- 改变选择、搜索、弹出、焦点、键盘、表单或无障碍行为。
- 要求三个选择器组件之间、或选择器与 Button 之间具有相同的几何或逐状态像素。
- 在 FR2 的默认静止角色之外规定精确的主题 token。
- 为调用方渲染的触发设定样式。通过 `renderTrigger` 提供的控件在 `spec:AST-055` 下仍归调用方所有。
- 等效的内部实现只要满足本契约，就仍然有效。

## Public concepts

| 概念         | 封闭值                          | 含义                                                  | 默认值  | 所有者                                             | 稳定性                       |
| ------------ | ------------------------------- | ----------------------------------------------------- | ------- | -------------------------------------------------- | ---------------------------- |
| 内置触发变体 | `input`、`secondary` 与 `ghost` | 选择表单字段、secondary Button 或透明低强调的触发外观 | `input` | Selector 含义：`component:Selector`；采用：AST-079 | `secondary` 为新增；其余保留 |

## Requirements

- **FR1 — 每个选择器触发都暴露相同的封闭词表。** `Selector` 保留其组件契约所拥有的当前 `input`、`secondary` 与 `ghost` 值。`MultiSelector` 与 `ComplexSelector` MUST 为其内置触发的 `variant` 接受同样这三个值。每个公共类型、渲染出的 `data-variant` 反射、使用方对 `variant` 视觉 prop 轴的主题声明，以及暴露该轴的各使用方文档 MUST 使用这些相同的名称。其他值由公共类型拒绝。
- **FR2 — 静止角色是共享的。** 在静止状态下，`input` 呈现不透明、带边框的表单字段表面；`secondary` 匹配活动主题的 secondary `Button`；`ghost` 呈现透明的、强调程度更低的触发。对于三个选择器上的 `secondary`，其静止边框（宽度、样式与颜色）、填充与文本颜色 MUST 与同一主题中 secondary `Button` 的对应项匹配，并与 `component:Selector/DD1` 保持一致；在默认主题下，即无边框、中性填充、中等强调的触发。这三种处理在静止态 MUST 保持可区分。`component:Selector/DD1` 另外拥有 Selector 在其各状态下与相邻 secondary Button 的一致性。MultiSelector 与 ComplexSelector MAY 复用它们现有的共享非 input 悬停、按下、focus-visible、禁用与只读处理；本记录不要求它们的状态像素与 Selector 或 Button 相同。主题 MAY 选择精确 token，只要保留静止角色。Button 组件保留对其自身 secondary 处理的所有权。
- **FR3 — 触发外观不会改变选择器行为。** 改变 `variant` MUST NOT 改变选中值、选项或子级词表、弹出呈现模式（`popover`、`bottom-sheet` 或 `adaptive`）或浮层语义、键盘模型、焦点归属、表单参与、可访问名称、角色或值语义。视觉对齐 MAY 跟随所选的触发表面。
- **FR4 — 采用是兼容的。** `input` 仍是三个组件的默认值。现有的 `input` 与 `ghost` 调用方保留其已发布行为。MultiSelector 或 ComplexSelector 调用方显式选择 `secondary`；现有调用点无需迁移。Selector 兼容性仍由其当前组件契约拥有。
- **FR5 — 家族宽度与状态规则仍然适用。** 在 `family:input-fields` FR1 下，独立 `Selector` MAY 跟随其显示内容，而 `MultiSelector` 与 `ComplexSelector` MUST 在值变化时保持其可用内联尺寸。在家族 FR8 下，对非 input（`secondary` 或 `ghost`）触发请求的 `attached` 状态会解析为 `detached`；状态边框与阴影仍限于合格的 `input` 触发。
- **FR6 — InputGroup 保留连接表面。** `Selector` 与 `MultiSelector` MAY 在 InputGroup 内使用 `secondary`。触发 MAY 保留其中性局部填充，但它 MUST 采用该组解析后的高度、连接边缘圆角与焦点堆叠，且 MUST NOT 绘制独立的外边框、阴影或状态处理。InputGroup 仍是 `family:input-fields` FR3 下连接外部几何的所有者。`ComplexSelector` 不支持 InputGroup。

### Platform support

- 支持的功能/引擎下限：三个组件已经支持的每个浏览器与渲染器；该词表不新增任何平台功能。
- 不支持的行为：无。改变精确外观的主题仍保留 FR2 的静止层级与 FR3 的行为。
- 浏览器证据：与 secondary Button 并排的静止态真实浏览器像素，以及 MultiSelector 与 ComplexSelector 中值变化前后的内联尺寸测量。源代码检查覆盖共享的非 input 状态分支。FR2 通过将每个选择器静止态 `secondary` 触发与默认主题中、以及每个为 secondary `Button` 设定样式的已发布主题中的 secondary `Button` 做渲染对比来证明。对 FR6 的符合性需要聚焦的 DOM/样式测试，以及 secondary Selector 与 MultiSelector 的渲染组几何。

## Current-state impact

- 当前 Selector 契约与 DD1 仍是 Selector 值与局部一致性决策的权威。
- 草稿的 MultiSelector 与 ComplexSelector 组件记录引用 `spec:AST-079/DEC-1` 以支持同级采用，但不会使其无关的声明成为 current。
- MultiSelector 与 ComplexSelector 使用方文档暴露共享的三值词表，并说明何时选择每个值；Selector 保留其当前文档。
- `family:input-fields` 继续拥有内联尺寸、状态放置与 InputGroup 表面规则；本记录把这些规则投射到所采用的触发值上，而不改变它们。
- Button 组件保留其已发布的变体映射与渲染。
- `architecture:public-component-api` 继续拥有新增式 API 准入、默认值与兼容性。`architecture:component-theming-surface` 继续拥有目标与视觉 prop 传播。

## Verification

| 契约     | 验证                                                                               | 代表性状态                                                               | 变异或失败预期                                                                                     |
| -------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| FR1, FR4 | 公共类型、默认 prop、`data-variant`、主题元数据与文档检查                          | 三个组件全部；省略值；每个显式值                                         | 某个组件省略了某个值、改变了其默认值、发布了不同的值，或接受了无类型的值                           |
| FR2      | 与 secondary Button 并排的静止态浏览器像素，以及聚焦的 DOM/样式测试                | 每个变体的静止态；默认主题以及每个为 secondary Button 设定样式的主题     | Secondary 的边框、填充或文本与主题的 secondary Button 不同，ghost 获得了不透明填充，或角色发生坍缩 |
| FR3      | 对变体专属分支的源代码审查，加上现有的交互、表单、弹出、键盘、焦点与无障碍测试套件 | popover、bottom sheet、adaptive；在支持的情况下可编辑、禁用与只读        | 某个视觉变体改变了选择或浮层语义、表单输出、焦点、命名、角色或值                                   |
| FR5      | 聚焦的状态测试与浏览器宽度测量                                                     | 每个变体上的 attached 请求；MultiSelector 与 ComplexSelector 的短值/长值 | 非 input 状态被附加、仅 input 的状态绘制泄漏，或多值/富内容选择器改变了可用内联尺寸                |
| FR6      | 聚焦的 InputGroup DOM/样式测试，加上渲染后的组几何                                 | 作为组首、组中与组末子项的 secondary Selector 与 MultiSelector           | 某个触发保留了独立边缘/状态绘制、丢失了组高度/焦点堆叠，或连接表面出现断裂                         |

## Decision log

### DEC-1 — MultiSelector and ComplexSelector adopt Selector's trigger hierarchy

**参考：** `spec:AST-079/DEC-1`

**决策者：** `cixzhang`，2026-10-14

Selector 的当前组件契约已经为调用方提供了三种触发角色。在多值或富内容选择器上选择同一角色的调用方，不应学到不同的名称，也不应得到不同的默认值。因此 MultiSelector 与 ComplexSelector 采用 Selector 的 `input`、`secondary` 与 `ghost` 词表，同时保留各自分离的交互模型与组件拥有的几何。它们的 `secondary` 匹配主题的 secondary Button，正如 Selector 在 DD1 下的做法，因此一个主题决策会同时重设每个 secondary 控件的样式。

已否决：同级专属的值名称或部分词表，它们会让同一种调用方意图依赖于选择模型；仅主题层的覆盖，它无法通过公共 API 表达调用方意图；独立于主题 secondary Button 的固定无边框中性填充，在任何为其 secondary Button 加边框的主题下都会把同一工具栏拆成两套层级；或者整体提升草稿的同级组件记录，那会批准无关的声明。

## Open questions

无。
