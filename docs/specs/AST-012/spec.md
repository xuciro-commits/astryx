---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-012
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [cixzhang, rubyycheung, imdreamrunner]
affects_architecture:
  [
    architecture:component-theming-surface,
    architecture:public-component-api,
    architecture:theme-authoring-contract,
    architecture:theme-compilation,
    architecture:theme-application,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: [theme, AppShell]
---

# Theme adaptations

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "theming": ["FR4", "FR5", "FR6", "FR7"]
  }
}
```

## Intent

主题应能为环境条件表达可选的 token 与组件适配，而无需第二个主题、手写的媒体查询 CSS 或 React state。该系统命名为 `adaptations`，而不是 `responsive`，因为条件可能覆盖宽度、指针精度、对比度偏好、动效偏好以及未来经评审的环境轴。

```ts
defineTheme({
  adaptations: {
    widthBreakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536,
    },
    rules: [
      {
        when: {
          width: {from: 'lg', below: 'xl'},
          pointer: 'coarse',
          contrast: 'more',
        },
        value: {
          components: {/* overrides */},
        },
      },
    ],
  },
});
```

`widthBreakpoints` 是宽度层级起始处的命名点。`width.from` 包含其端点，`width.below` 排除它，因此 `{from: 'lg', below: 'xl'}` 就是精确的 `lg` 区间。`when` 中的字段按 AND 组合。

仅断点映射本身不产生任何 CSS；只有带适配值的规则才产生。

## Non-goals

- 向内置主题添加适配规则，或选择产品特定的值。
- 为 FormLayout、布局原语或产品布局定义响应式策略。
- 接受原始媒体查询字符串、用户定义的条件字段或用户定义的断点名称。新的环境轴仍是显式的 API 新增项。
- 更改颜色模式解析，或更改 MediaTheme 的表面检测及其含义。
- 让响应式组件消费主题适配规则；组件可以解析共享宽度点，但其行为仍由各自拥有。
- 适配 canvas、数据可视化或其他 JavaScript 使用方所使用的非 CSS token 读取；这些仍继续解析根主题值。

## Requirements

- **FR1 — 宽度断点是固定的起始点。** 除非覆盖这些固定名称的值，每个主题都具有有效的 `widthBreakpoints` 映射 `sm: 640`、`md: 768`、`lg: 1024`、`xl: 1280`、`2xl: 1536` CSS 像素。值必须是有限的、正数且严格递增的。根值是在 `sm` 之下的隐式基线；没有可配置的 `xs: 0` 点。仅定义或覆盖该映射不得产生 CSS。
- **FR2 — 条件是有名的、封闭的、可组合的。** 一个 `when` 对象可以包含 `width`、`height`、`pointer`、`contrast` 和 `motion`；字段按 AND 组合。`width` 接受 `from` 和 `below` 并使用这五个固定名称，且必须包含其一或两者。`from` 为包含，`below` 为排除，任一边缘都可省略但不能两者都省略，有界的宽度必须解析为 `from < below`。`height` 只接受 `{below: 500}`：视口高度低于 500，排除边界，即 FR9 compact 定义的高度边缘。`pointer` 接受 `coarse | fine`；`contrast` 接受 `more | less | no-preference`；`motion` 接受 `reduce | no-preference`。未来的环境字段需要向这份封闭词汇表做显式新增。
- **FR3 — 规则是有名的对象。** `adaptations.rules` 包含 `{when, value}` 对象，而不是位置元组。空的 `when` 无效。一个必须在更早规则之后的所有宽度上都生效的值，通过后续覆盖 `{width: {below: 'sm'}}` 与 `{width: {from: 'sm'}}` 的规则来表达。没有改变值的规则可以不产生 CSS。
- **FR4 — 规则使用主题值契约。** `value` 可以包含 `typography`、`color`、`radius`、`motion`、`tokens`、`components` 和 `localTokens` 的覆盖。`rules[].value.localTokens` 不是登记表面：只有根 `localTokens` 或已登记的精确基线才能声明名称。一条规则只能替换已登记在有效谱系中的精确名称，并使用 AST-006 的 `TokenValue` 规范化与校验。身份、继承、语法、图标、指示器、媒体表面字段、adaptations 以及 `motion.reducedMotion`（`spec:AST-108` FR5）仍归根所有。在一条规则内，值使用根的展开、深合并与种类优先级。生成式轴针对根轴元数据展开，每一个产生的叶子都算作该规则的一次写入，位于有效根 `components` 上已声明的精确叶子路径处的类型比例组件默认值除外。生成的 token 与规则编写的组件叶子仍是写入。缺失的必需比例尺字段必须被提供，而不是从近似的内置默认值合成。规则中的组件写入必须使用与根 `components` 相同的目标、轴、值域与扩展校验；adaptations 不定义单独的组件值校验策略。即使有效根上没有针对该目标或该值的样式规则，规则也可以为内置值或权威开放原语域接受的值设置样式。其有效性取决于主题登记的值必须已经登记在有效根 `components` 表面上；规则不得有条件地引入它。共享根校验产生的未解析结果原样带入适配校验。它既不是永久的适配豁免，也不是该轴可扩展的证据。状态归组件所有，绝不由主题生成。
- **FR5 — 媒体表面仍然更具体。** 适配值在根主题之上解析。当 `onDark` 或 `onLight` 覆盖与某条适配写入同一个已解析叶子时，媒体表面的值获胜。adaptations 不创建嵌套的媒体表面语法。
- **FR6 — 规则顺序决定优先级。** 根值先于适配规则应用，但媒体表面覆盖除外，它们在 FR5 下后于适配规则应用。规则按声明顺序级联，对每个已解析 token 或组件叶子的最后匹配写入获胜。条件形状不产生独立的特异性分数。重复的 `when` 对象是有效的。重排重叠规则是有意的行为变更。后续仅涉及比例尺的规则会保留更早编写的组件叶子，当其精确路径在根上存在时；当根上不存在时，生成的组件叶子仍是写入，并在两条规则都匹配时获胜。
- **FR7 — 主题扩展保留级联顺序。** 子主题继承基线的宽度断点覆盖与有序规则。断点按名称合并。继承的规则保持其相对顺序，并根据子主题的有效映射解析；子规则追加在它们之后。没有移除操作符：空的子值是无操作，继承行为只能通过后续编写受影响叶子的子规则来中和。子主题的根值绝不会覆盖匹配的继承规则，因为根值先于适配规则应用。
- **FR8 — AppShell 共享宽度点。** `mobileNav.breakpoint` 接受五个宽度断点名称外加 `none`。对于选定的名称，移动模式仅在 `width < effectiveWidthBreakpoints[name]` 时适用；相等归属于更宽的一侧。`none` 永不匹配。AppShell 读取最近的 Theme context；没有 provider context 时，它遵循 `architecture:theme-application` 中的根主题回退，而在没有活动主题时使用 FR1 的默认值。`defaultIsMobile` 仍是 SSR 提示；客户端查询在水合之后使用有效映射。
- **FR9 — compact 在每个平台上只有一个定义。** 当视口宽度低于有效的 `md` 点（FR1）或视口高度低于 500 时，屏幕即为 compact。这些数字在每个平台上都相同：web 上是 CSS 像素，iOS 上是点，Android 上是密度无关像素；原生呈现不把 compact 映射到平台尺寸类。主题导出这唯一的定义，每个按屏幕尺寸选择呈现方式的解析器都使用它，包括 web 触控呈现解析器、Selector 的 `adaptive` 呈现以及 `@astryxdesign/native`；它们都不保留自己的尺寸数字。同时还需要粗指针的解析器会把该条件与 compact 按 AND 组合。compact 只管辖呈现方式的选择，例如用 sheet 代替 popover；调用方选择的布局宽度，例如 AppShell 的 `mobileNav.breakpoint`（FR8），不算 compact。主题 `adaptations` 保持仅限 web（`spec:AST-082` FR18）；原生从可移植主题读取 compact 数字。
- **IR1 — 原子地规范化与拒绝。** 有一条路径为 `defineTheme` 与 `astryx theme build` 两者校验宽度断点、命名条件字段、宽度区间、主题扩展、已登记的 local token 名称以及展开后的具体值，且都在任一者产生部分输出之前完成。`defineTheme` 在每个有效 `DefinedTheme` 上保留规范化后的生成式轴元数据；静态构建在 IR4 下保留同样的元数据。
- **IR2 — 适配值以 CSS 为先。** 一旦应用了主题样式表，适配值就仅从 CSS 解析，无需 JavaScript 重渲染、resize 监听器或水合修正。运行时 Theme 注入与静态构建使用相同的规范化规则、作用域和级联。根值先于规则输出；规则块保持声明顺序；媒体表面覆盖在两者都适用时后于规则输出。输出不得在会改变级联的情况下合并、重排或丢弃规则块，包括重复的 `when` 对象和恢复根值的后续规则。每个组件叶子都降为与其根等价物相同的声明目标，包括派生私有变量的展开。`useTheme` 的 token 读取与服务器安全的 token 助手仍是根值读取。
- **IR3 — 工具能看到仅存在于规则中的值。** 校验、组件诊断、私有变量检查、字体提示以及 `light-dark()` 颜色方案检测必须检查仅在规则中声明的值。规则中的组件写入必须经过与根组件写入相同的共享校验路径。适配只增加无条件下登记这项检查：仅因主题登记而被接受的值必须已存在于有效根组件表面。内置有限值与权威开放原语域接受的值不需要匹配的根样式声明。规则校验必须自动继承根校验的未来改进；工具不得维护适配专用的允许列表、未解析域例外或域推断路径。
- **IR4 — 构建后的主题保留扩展语义。** 构建主题的 JavaScript 模块保留有效宽度断点映射、规范化后的生成式轴元数据、已登记的 local token 谱系以及源代码等价 `extends` 所需的有序规范化规则；它不内嵌已输出的 CSS 文本。子主题从构建后的基线继承并解析 adaptations 的方式，与从源基线继承并解析完全相同。

### Platform support

- 适配在 Astryx 浏览器支持下限之内使用视口宽度、视口高度、主指针、对比度偏好和减少动效查询；没有 JavaScript 样式回退。
- 真实 Chromium 必须验证条件、嵌套、AppShell 一致性以及首屏绘制。真实 Safari 必须验证排他宽度边缘与主指针分类；仅用 Playwright WebKit 不算 Safari 证据。

## Current-state impact

当前的 `main` 没有主题适配 API。AppShell 只导出 `sm | md | lg | none`，硬编码前三个点，并把相等视为移动端。本提案新增 `xl` 与 `2xl`，通过活动主题解析所有名称，并使上边缘为排他边界。AppShell 联合类型的扩展是新增性的；相等判断的变更是破坏性的行为变更，实现时需要对应的发布说明。

此变更影响 `architecture:component-theming-surface`、`architecture:public-component-api`、`architecture:theme-authoring-contract`、`architecture:theme-compilation` 和 `architecture:theme-application`。在本草稿被接受并实现之前，它们当前的契约仍是权威的。

#5543 的公开层级 API 被 DEC-1 与 DEC-2 取代，绝不能原样落地。它的值解析器、显式值保留、CSS 生成与构建的一致性以及扩展元数据仍是有用的实现证据。

主题不导出 compact 定义，`when` 也没有 `height` 字段。Selector、MultiSelector、ContextMenu 和 DropdownMenu 的 `adaptive` 呈现（MoreMenu 转发到 DropdownMenu）以及 DropdownMenu 的紧凑触控子菜单决策使用 `(max-width: 768px) and (pointer: coarse)`，ContextMenu 与 MoreMenu 的使用方文档把它描述为 “768px 及以下”：一个精确 768 像素宽、至少 500 高的粗指针屏幕会被算作 compact，而一个宽度超过 768 像素但高度低于 500 的横屏手机则不算。在 FR9 下，前者打开 popover，后者打开 bottom sheet；该变更的发布说明把 `presentation` 列为保留某个表面的方式。`PortableTheme` 不携带 compact 定义，`@astryxdesign/native` 目前还没有 compact 解析器；当它获得一个时就会采用 FR9。

## Verification

| 契约              | 验证                                  | 代表性状态                                                                                                                                                                                | 失败信号                                                                                                                                       |
| ----------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1–FR3           | 宽度断点与条件矩阵加浏览器边界        | 默认值/覆盖；from/below/区间；pointer/contrast/motion；多字段 AND；空规则/无规则                                                                                                          | 某个点被当作上界、区间出现空隙或重叠、字段按 OR 组合，或未使用的映射产出 CSS。                                                                 |
| FR4–FR7           | 共享解析器、表面、级联顺序与扩展测试  | 已登记/未登记的 local token；不完整的比例尺；有限的内置值；根上不存在的开放原语值；根已登记的自定义值与仅存在于规则中的自定义值；未解析的共享结果；后生成的叶子与更早的显式叶子；表面冲突 | 一条规则登记了 local 或组件值、一个有效的开放值需要占位根规则、适配校验与根校验出现分歧、未解析结果成为永久豁免，或继承顺序丢失。              |
| FR8               | 主题/AppShell 集成                    | 所有名称/`none`；SSR 提示；无主题/最近主题/根主题/嵌套主题；精确边界                                                                                                                      | AppShell 使用了错误的映射、相等判断或作用域。                                                                                                  |
| FR2 (height), FR9 | 条件矩阵加 web 与原生上的解析器测试   | 高度 800 时宽度 767/768；宽度 1024 时高度 499/500；被覆盖的 `md`；Selector 的 `adaptive`；web 触控解析器；一个原生解析器                                                                  | 解析器自带尺寸数字或使用包含边界、原生解析器使用平台尺寸类或不同数字，或接受了 `below: 500` 之外的 `height` 值                                 |
| IR1–IR3           | 运行时/构建与 CLI 的正向/负向测试夹具 | 无效的映射/区间/字段；源轴元数据；重复的 `when`；恢复根值的规则；有限/开放/未解析的组件域；声明目标；根已登记的自定义值与仅存在于规则中的自定义值；非 CSS token 读取                      | 无效输入写出了输出、根组件校验与适配组件校验不一致、一个独立有效的值被强制放入根、适配有条件地登记了自定义值，或工具遗漏了仅存在于规则中的值。 |
| IR4               | 生成模块的导入与体积测试              | 无规则/有规则；源父主题与子主题/构建后父主题与子主题；生成式/local token 元数据                                                                                                           | 断点、规则、顺序或元数据消失；扩展行为偏离；CSS 文本进入模块；或已解析的层重复。                                                               |

## Decision log

以下决策由 `cixzhang` 作为这份当前已接受规格的一部分批准。

### DEC-1 — Use adaptations with width-specific breakpoints

**Reference:** `spec:AST-012/DEC-1`

**Decider:** `cixzhang`, `2026-09-02`

使用 `adaptations`，而不是 `responsive` 或 `responsiveness`，因为该系统覆盖多个环境轴。宽度点位于 `widthBreakpoints` 之下，而不是通用的 `breakpoints` 字段，从而为未来独立的 `heightBreakpoints` 命名空间留出空间。Astryx 拥有 `sm`、`md`、`lg`、`xl` 和 `2xl`，默认值分别为 640、768、1024、1280 和 1536。宽度点标记层级起点，在没有规则时不产生 CSS。

已否决：仅响应式的命名、通用断点存储、自定义宽度名称，以及以上界命名的层级。

### DEC-2 — Use named rules with nested width conditions

**Reference:** `spec:AST-012/DEC-2`

**Decider:** `cixzhang`, `2026-09-02`

规则使用 `{when, value}` 对象。`width: {from, below}` 表达包含的下边界与排除的上边界。`when` 中的环境字段是对等字段，并按 AND 组合。

已否决：位置元组、扁平的 `minWidth` / `maxWidth`、嵌套的字面 `@media` 键，以及任意原始查询。

### DEC-3 — Use declared rule order as precedence

**Reference:** `spec:AST-012/DEC-3`

**Decider:** `cixzhang`, `2026-09-02`

规则遵循级联顺序。根值最先应用，继承的规则保持其顺序，子规则追加在后。在任何匹配的环境中，最后写入某个已解析叶子的规则获胜。重复条件有效，重排重叠规则在行为上是有意为之的。

已否决：从条件形状推断优先级，或因不可比较的条件而拒绝冲突。

### DEC-4 — Preserve adaptations through built extension

**Reference:** `spec:AST-012/DEC-4`

**Decider:** `cixzhang`, `2026-09-02`

构建后与源主题为 `extends` 保留等价的宽度断点与规范化规则数据，而已输出的 CSS 仍是独立产物。

已否决：把创作意图从构建后的基线中编译掉，以及静默收窄现有的主题扩展契约。

### DEC-5 — Reuse root component validation; reserve root for enrollment

**Reference:** `spec:AST-012/DEC-5`

**Decider:** `cixzhang`, `2026-09-08`

适配规则中的组件写入使用与根 `components` 相同的目标、轴、值域与扩展校验。内置有限值或权威开放原语域接受的值可以只出现在规则中；它不需要匹配的根样式声明。只有当某个值的有效性来自主题登记时，才适用有效根要求。未解析的共享结果原样带入适配，而根校验的未来改进会自动收紧适配。

已否决：适配专用的值解析器、允许列表、未解析域例外，以及为独立有效的值编写占位根规则。

### DEC-6 — Compact is one definition on every platform

**Reference:** `spec:AST-012/DEC-6`

**Decider:** `cixzhang`, `2026-10-24`

手机、小平板以及较矮的横屏窗口都没有容纳锚定表面的空间，因此 compact 是宽度低于 `md` 点或高度低于 500。每个平台使用相同数字，使同一个组件在 web 与原生代码中以相同方式呈现，而单一的导出定义使各解析器不会彼此漂移。

已否决：把 compact 映射到各平台的尺寸类，这会让同一块屏幕在一个平台上是 compact 而在另一个平台上不是。

## Open questions

无。
