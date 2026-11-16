---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-087
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-22
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture:
  [
    architecture:component-theming-surface,
    architecture:icon-resolution-and-component-slots,
    architecture:theme-application,
    architecture:theme-authoring-contract,
    architecture:theme-compilation,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: [theme, Icon]
---

# Icon variants, theme sizes, and component icon slots system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

主题决定图标的外观：

- `Icon` 接受一个可选的 `variant`。主题一次性列出它所支持的变体名称，而主题的图标条目可以是最终尺寸与该变体的纯函数，因此主题可以把两者都映射到其图标库自身的图形素材或属性上。
- 主题通过 Icon 样式表目标设置每个 Icon 尺寸的维度。
- 组件把可主题化的图标暴露为 `componentIcons` 槽位，而槽位条目可以从组件的类型化状态中解析，因此主题可以决定按下、选中或禁用状态的图标是什么样子。

## Non-goals

- 外观或字重轴、逐个图标的能力声明、自适应变体树，或由 Astryx 定义的变体名称。
- 新增的 Icon 尺寸名称。
- 额外的组件图标映射、图标角色概念、按状态嵌套的映射，或复合状态键。
- 直接传给 `Icon` 的图标组件的变体。它们按原样渲染，永远不会收到 `variant`；Icon 的目标、尺寸和颜色仍然作用于它们。
- 替换组件通过指示器绘制的有状态控件标记。这些仍然归 `defineTheme({indicators})` 管（FR15）。
- 组件自有图标盒如何跟随主题维度，以及哪些组件字形通过 `Icon` 渲染。
- DOM 或 SVG 测量、SVG 合成，或为同一个请求混合来自两个来源的图形素材。
- 只要满足本契约，等价的内部实现依然有效。

## Requirements

### Variant and theme entries

- **FR1 — 主题图标条目是节点，或是请求的函数。** `DefineThemeInput.icons` 以及进程级注册都为语义键或命名空间键接受一个 React 节点，或一个接收 `{size, variant}` 的函数，其中 `size` 是最终的 Icon 尺寸，`variant` 是当前活动主题所列出的某个变体，或 `undefined`。概念上：

  ```ts
  type IconRequest<Variant extends string = IconVariant> = Readonly<{
    size: 'xsm' | 'sm' | 'md' | 'lg';
    variant?: Variant;
  }>;

  type IconEntry<Variant extends string = IconVariant> =
    React.ReactNode | ((request: IconRequest<Variant>) => React.ReactNode);
  ```

  主题把尺寸和变体映射到其图标库自己的属性或图形素材：

  ```tsx
  defineTheme({
    name: 'brand',
    iconVariants: ['outline', 'filled'],
    icons: {
      info: ({size, variant}) => (
        <InfoIcon
          weight={
            variant === 'filled' ? 'fill' : size === 'sm' ? 'bold' : 'regular'
          }
        />
      ),
    },
  });
  ```

- **FR2 — 主题一次性列出它的变体名称。** `DefineThemeInput.iconVariants` 是一份作用于整个主题的变体名称列表，绝不作用于单个图标。设置了 `iconVariants` 的子主题会替换继承来的列表；省略它的子主题则继承该列表。
- **FR3 — 该列表为主题和请求提供类型。** 在 `defineTheme` 内部，条目函数会收到 `variant`，静态槽位请求和槽位解析器会返回它，其类型为主题所列出的名称。`Icon` 的 `variant` 属性使用 `IconVariant`，即公开且可扩充的 `IconVariantMap` 中的名称。主题构建会针对它构建的主题写出该映射的扩充，方式与它扩充自定义组件值相同，应用程序也可以自行扩充该映射。Astryx 绝不从多个主题的列表推导出一个变体类型；当应用程序加载多个构建后的主题时，TypeScript 会合并它们的扩充，而 FR4 会在活动主题未列出所请求名称的位置渲染普通图标。
- **FR4 — 未列出的变体渲染普通图标。** 只有当活动主题列出了所请求的 `variant`，并且对于主题提供的条目，定义该条目的主题也列出了它时，`Icon` 才会把该 `variant` 传给选中的条目；子主题继承的条目保留定义它的主题的列表。否则条目会收到 `undefined` 并渲染其普通图形：省略的变体、未列出的变体，以及活动主题没有列表的请求，都属于这种情况。进程级注册会收到活动主题所列出的变体。节点条目对每个变体都渲染同一个节点。
- **FR5 — 变体作用于注册表图标。** 直接传给 `Icon` 的图标组件按原样渲染，不会收到 `variant`；`Icon` 不会把 `variant` 转发给它，也不会转发到 DOM。`variant` 只选择图形素材：`icon` 主题化目标不反映它，因此它没有样式选择器。
- **FR6 — 来源在请求之前解析。** 主题条目优先于进程级注册，进程级注册优先于内置默认值；值为 nullish 的静态条目会落到下一个来源。所选函数的结果对该次解析来说是最终的：空结果不渲染任何字形，也绝不会落到另一个来源。
- **FR7 — 条目和解析器是纯函数且同步。** 它们只根据输入计算结果，不使用 hook、DOM 或 SVG 测量、浏览器全局对象、网络访问、可变模块状态或副作用。
- **FR8 — 构建工具可以枚举主题的图标。** 主题条目可能收到的每个请求，都是它的键与四个尺寸之一、且没有变体或该条目在 FR4 下可收到的某一个变体的组合。生成或裁剪图标图形素材的构建工具可以对该集合逐条调用每个条目；结果与条目在运行时返回的结果一致。

### Sizes

- **FR9 — 条目收到解析后的尺寸。** `Icon` 按 `component:Icon` 的 ORD1（`xsm`、`sm`、`md`、`lg`）解析其尺寸，并将其传给条目，由条目为该尺寸选择图形素材。
- **FR10 — 主题在样式表中设置每个尺寸的维度。** Icon 主题化目标保证在其尺寸选择器上设置 `width` 和 `height`，因此 `components.icon['size:sm']` 设置 `sm` 的维度。没有主题样式时，在 16px 根字号下尺寸为 12、16、20 和 24px，并随根字号缩放。

### Component icon slots

- **FR11 — 组件图标是 `componentIcons` 槽位。** 组件拥有的可主题化图标是 `ComponentIconSlotMap` 中的一个槽位，按 `architecture:icon-resolution-and-component-slots` 的描述通过 `componentIcons` 映射。`true` 值声明一个无状态槽位；对象类型声明槽位的只读状态字段。
- **FR12 — 槽位值是名称、`null`、静态请求或状态解析器。** `componentIcons` 接受 `IconName`、`null`、静态的部分请求，或一个接收槽位状态、返回部分请求的纯同步函数。概念上：

  ```ts
  type ComponentIconRequest = Readonly<{
    icon?: IconName | null;
    variant?: IconVariant;
    size?: 'xsm' | 'sm' | 'md' | 'lg';
  }>;

  type ComponentIconValue<State> =
    | IconName
    | null
    | ComponentIconRequest
    | ((state: Readonly<State>) => ComponentIconRequest | null | undefined);
  ```

  无状态槽位接受除函数之外的每一种形式。组件提供其状态；主题在普通解析器代码中处理状态组合：

  ```tsx
  componentIcons: {
    'example-nav-item-leading': ({selected}) => ({
      variant: selected ? 'filled' : 'outline',
    }),
  }
  ```

- **FR13 — 部分结果逐字段回退。** 调用方传入的图标内容优先于槽位。否则，请求中的 `icon` 会替换组件的回退名称，而 `variant` 和 `size` 作用于实际渲染的那个名称。缺少 `icon` 时保留组件原本会渲染的名称，缺少 `variant` 时保留组件原本会请求的变体（或没有变体），缺少 `size` 时保留组件的尺寸。`null`、`null` 结果或 `icon: null` 会隐藏图标；`undefined` 结果不改变任何东西。
- **FR14 — 槽位尺寸只改变图标自身的尺寸。** 解析出的 `size` 替换该槽位 Icon 的组件尺寸。控件的高度、触摸目标、位置、颜色、交互和可访问性仍由组件设定，包括家族契约跨状态固定的任何外部尺寸。
- **FR15 — 主题通过槽位设置依赖状态的图标。** 把依赖状态的图标暴露为 `componentIcons` 槽位的组件，会通过该槽位传递该状态，以便主题解析它。如果组件从自身状态中挑选共享图标名称而不通过槽位，那么在其自身契约添加槽位之前，这种做法保持不变。调用方传入的按状态图标属性，例如 `pressedIcon` 或 `selectedIcon`，作为调用方提供的图标内容。组件通过指示器绘制的有状态控件标记，例如选中勾、单选按钮或复选框方框，仍是指示器：指示器接收其家族的状态，主题通过 `defineTheme({indicators})` 按名称替换它。同一个视觉元素绝不会同时是指示器和 `componentIcons` 槽位。
- **FR16 — 槽位状态是记录在案的元数据。** 槽位的状态字段与槽位元数据一起列出，出现在所有者组件的文档以及 CLI 和文档站的发现中。更改已发布的状态字段属于兼容性变更。

### Reads, built themes, and server rendering

- **FR17 — 槽位解析是槽位函数的唯一调用者。** 组件（包括处于扩充 `ComponentIconSlotMap` 的包中的组件）把其槽位状态传给由 `architecture:icon-resolution-and-component-slots` 拥有的共享槽位解析。该解析调用主题的函数，并通过 `Icon` 渲染结果。没有任何公开的主题读取会调用槽位函数或返回槽位函数。
- **FR18 — 公开读取返回节点和静态值。** 注册表、扩展、快照和 hook 读取，`IconRegistry`、`DefinedTheme['icons']` 以及构建后主题的图标导出都返回 React 节点；函数条目在 `{size: 'md'}` 处读取。`DefinedTheme['componentIcons']` 和构建后主题的槽位导出是静态视图：按编写时的样子给出名称、`null` 和静态请求，解析器槽位则被省略。`DefinedTheme['iconVariants']` 是主题的列表。产品通过 `Icon` 请求尺寸或变体。
- **FR19 — 运行时主题、构建后主题和服务端主题保持一致。** 运行时主题、`extends`、构建输出、服务端渲染和水合都解析为相同的节点。子主题的条目会替换同一键的继承条目。构建无法携带的函数会导致构建失败。服务端代码可以用持有函数的主题解析图标；客户端代码把该主题传给 `Theme`。
- **FR20 — 格式错误的解析器输出按缺失处理。** 请求中未知的 `icon`、主题未列出的变体，或四个名称之外的尺寸，会逐字段被忽略，并给出一次仅开发环境的警告。

### Platform support

- 支持下限：Astryx Core 支持的每个 React、服务端渲染和浏览器目标。
- 不支持的行为：异步解析器，以及把持有函数的主题作为属性从 Server Component 传给 Client Component。
- 浏览器证据：主题切换、嵌套主题、组件状态、已列出和未列出的变体，以及每个 Icon 尺寸，都在主题的维度下渲染出预期节点并在水合后保持一致。

## Current-state impact

现有的节点条目、直接图标组件、命名空间键、实例属性和读取方式继续正常工作。没有 `iconVariants`、函数条目或尺寸样式的主题渲染相同的图标。以下所有者承载该变更：

- `component:Icon` — 注册表模式接受 `variant`（FR4、FR5），以 ORD1 解析出的尺寸选择图形素材（FR9），其目标在尺寸选择器上保证 `width` 和 `height`（FR10）。
- `architecture:component-theming-surface` — INV14 允许 `Icon.variant` 作为主题可扩展的轴，其回退是不带变体的请求（FR3、FR4）。
- `architecture:icon-resolution-and-component-slots` — 条目是节点或函数，所选函数的结果是最终的（FR1、FR6）；从未发布的 `selector-selected-option` 槽位离开 `ComponentIconSlotMap`，因为 Selector 通过 `check` 指示器绘制其选中项标记（FR15）；槽位值是 `true` 或状态形状，INV3 允许静态请求和状态解析器（FR11、FR12）；INV8 允许槽位请求设置该槽位的图标尺寸和变体（FR13、FR14）；指示器保持独立（FR15）；槽位解析是槽位函数的唯一调用者（FR17）。
- `architecture:theme-authoring-contract` — `iconVariants`、函数条目和槽位函数会被规范化并继承，公开读取保持节点值或静态值（FR2、FR18、FR19）。
- `architecture:theme-compilation` — 构建输出重现函数条目、槽位解析器和变体列表，构建工具可以枚举主题的请求（FR8、FR19）。
- `architecture:theme-application` — 客户端代码把持有函数的主题传给 `Theme`（FR19）。
- 使用方的 `theme` 和 `Icon` 文档描述 `iconVariants`、函数条目、`variant`、尺寸样式和槽位解析器。

## Verification

| Contract  | Verification                                      | Representative states                                                                                          | Mutation or failure expectation                                                    |
| --------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| FR1–FR7   | 注册表类型、解析器和 Icon 渲染测试                | 节点；函数；null；省略、已列出和未列出的变体；没有活动列表；在替换后的列表下继承的条目；主题、全局、默认；直接 | 来源混用、未列出的变体到达条目、`variant` 到达组件或 DOM                           |
| FR2–FR3   | 类型测试和主题构建扩充夹具                        | 条目和解析器中的已列出名称；子主题替换列表；构建后的扩充；未知名称                                             | 条目看到未列出的名称类型、子主题合并列表，或 Astryx 从两个主题的列表推导出一个类型 |
| FR8       | 针对运行时解析的构建枚举测试                      | 每个键 × 四个尺寸 × 无变体，以及该条目可收到的每个变体；在替换后的列表下继承的条目                             | 枚举出的请求与运行时输出不同，或枚举了条目无法收到的变体                           |
| FR9–FR10  | 主题样式和尺寸测试                                | 每个尺寸在有和没有主题样式时                                                                                   | 有样式的尺寸不改变字形维度，或无样式的尺寸发生改变                                 |
| FR11–FR16 | 槽位类型、状态、回退、指示器、几何和元数据测试    | `true` 槽位；状态槽位；静态请求；部分和完整结果；`null`；调用方内容；已记录的状态                              | 回退顺序改变、`null` 不再隐藏、槽位尺寸改变了控件，或一个标记同时属于两种          |
| FR17–FR19 | 公开读取、SSR、水合以及运行时、构建、extends 测试 | 单参数读取；静态视图；嵌套主题；子主题替换；构建后的函数条目；客户端主题                                       | 公开读取返回函数、构建与运行时结果不同                                             |
| FR20      | 类型和返回字段测试                                | 无效的状态形状；未知图标；未列出的变体；无效尺寸                                                               | 格式错误的字段改变回退，或生产环境发出警告                                         |

## Decision log

### DEC-1 — One variant request

**Reference:** `spec:AST-087/DEC-1`

**Decider:** cixzhang, 2026-10-22

变体系统在各设计系统中都很常见。`Icon` 承载一个可选的 `variant`，而更粗或更细的笔画是主题条目针对最终尺寸所做的调整。

已否决：外观和字重轴，因为它们因产品而异。

### DEC-2 — Theme entries are functions of size and variant

**Reference:** `spec:AST-087/DEC-2`

**Decider:** cixzhang, 2026-10-22

主题条目是一个节点，或一个以最终尺寸和可选变体为输入、返回所提供图形素材的纯同步函数，因此主题拥有与其图标库相关的全部内容。

已否决：逐图标的能力声明和自适应变体树。

### DEC-3 — The stylesheet sets icon dimensions

**Reference:** `spec:AST-087/DEC-3`

**Decider:** cixzhang, 2026-10-22

主题通过 Icon 样式表目标设置每个 Icon 尺寸的维度。

已否决：由主题新增的尺寸名称，因为使用这种名称的组件在主题缺席时没有取值。

### DEC-4 — `componentIcons` holds component icons

**Reference:** `spec:AST-087/DEC-4`

**Decider:** cixzhang, 2026-10-22

全局图标映射说明每个图标的用途，而 `componentIcons` 按组件槽位覆盖它。槽位可以在普通解析器代码中从类型化的组件状态解析其请求。

已否决：第二个组件图标映射、图标角色概念、按状态嵌套的映射，以及复合状态键。

### DEC-5 — Themes set state-dependent icons

**Reference:** `spec:AST-087/DEC-5`

**Decider:** cixzhang, 2026-10-22

组件作为槽位暴露的依赖状态的图标，是通过其解析器做出的主题决策，因此每个实例都遵循同一条规则。指示器保留有状态的控件标记，因为它们绘制的是家族的状态，而不是选择图标。

### DEC-6 — A selected function's result is final

**Reference:** `spec:AST-087/DEC-6`

**Decider:** cixzhang, 2026-10-22

一旦选定函数条目，它的结果就回答该请求，因此图形素材绝不会混合两个来源，主题也可以刻意什么都不画。

### DEC-7 — Products request size and variant through `Icon`

**Reference:** `spec:AST-087/DEC-7`

**Decider:** cixzhang, 2026-10-22

尺寸和变体感知的解析服务于 Astryx 组件和工具。公开读取返回 React 节点，函数条目在 `{size: 'md'}` 处读取，即独立 Icon 的默认值。

### DEC-8 — Malformed resolver output is ignored field by field

**Reference:** `spec:AST-087/DEC-8`

**Decider:** cixzhang, 2026-10-22

解析器结果中的无效字段按缺失处理，因此回退仍会渲染，并给出一次仅开发环境的警告。

### DEC-9 — A theme lists its variants once

**Reference:** `spec:AST-087/DEC-9`

**Decider:** cixzhang, 2026-10-22

一个主题级列表为调用方提供类型化名称，为构建工具提供有限的请求集合以便枚举，并为未列出的变体提供一个不依赖主题的单一回退：不带变体的请求。

已否决：开放的 `string`，因为它既不给调用方类型，也不给工具有限集合；以及 Astryx 从多个主题的列表推导出一个变体类型。

### DEC-10 — Slot functions stay inside slot resolution

**Reference:** `spec:AST-087/DEC-10`

**Decider:** cixzhang, 2026-10-22

只有共享的槽位解析会调用主题的槽位函数，并使用组件传入的状态。公开的主题数据展示静态视图，因此读者永远不需要处理函数或自行构造状态。

## Open questions

无。
