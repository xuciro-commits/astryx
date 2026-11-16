---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-082
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
phase: accepted
owners: [cixzhang]
affects_architecture:
  [
    architecture:theme-authoring-contract,
    architecture:theme-compilation,
    architecture:public-component-api,
    architecture:cli-surface,
  ]
affects_families: []
affects_contributing: []
affects_consumer_docs: [theme, cli]
---

# Native-first surfaces system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

使用 Astryx 产品的人，无论在哪里使用——在浏览器中，还是在 iOS、Android、macOS 或 Windows 的原生应用中——都能获得原生优先（native-first）的体验。在每个平台上，组件的行为、响应与性能都像该平台上运行着此人当前 OS 版本的最佳软件那样，并且产品可以提供仅在某些平台上才存在的体验。

每个组件都有一份共享的核心契约，使其含义、措辞、状态与无障碍表现处处一致；此外每个平台还有一份契约，补充该平台在核心之外所支持的 props。开发者看到的是其构建目标平台的 props——在 TypeScript 中，也在每种原生语言中——来自另一平台的 prop 会报错，而不是静默失效。文档与 CLI 展示同样的划分。

`@astryxdesign/core` 服务于 web。`@astryxdesign/native` 服务于原生平台，并且只单向读取 core，因此 web 用户不安装任何原生内容，原生应用也不加载任何 web 内容。团队只定义一次视觉标识，写在一个 Astryx theme 中；仅限原生的视觉意图写成持久结果（durable outcomes），其含义在平台变化时保持不变，而任何与某一平台或 OS 版本绑定的内容，只写在该平台的条目（entry）内。

Astryx 通过在相同场景下把候选方案与平台自带的工具包（toolkit）对比测量，来决定每个原生平台如何构建，并且它只依赖自己能够维护的运行时。

## Non-goals

- 平台发布的先后顺序（OQ2），以及各平台支持的 OS 版本（OQ4）。
- 精确的性能阈值（OQ1）。本记录负责界定测量什么以及如何比较各方案。
- 任一平台实现内部的细节——只要它满足本契约。
- 用 Astryx 组件构建的产品模板、导航结构与应用外壳。
- 改变 web 调用方的类型或行为。本契约所隐含的 web 移除项遵循 `spec:AST-017`（FR14）。
- 只要满足本契约，等价的内部实现仍然有效。

## Requirements

- **FR1 — Astryx 面向 web 与具名的原生平台。** web 界面是浏览器。原生界面是原生平台 `ios`（iPhone 与 iPad）、`android`、`macos` 与 `windows` 上的应用。每个原生平台声明其支持的 OS 版本（OQ4）。原生平台只有满足 FR11 与 FR12 才算受支持。每个组件都声明其支持的平台。
- **FR2 — 每个平台都以自身的上限为目标。** 实现可以使用其平台提供的任何能力。没有平台被限制在另一平台所能表达的范围内：原生平台不受限于 web 标记与 CSS，web 也不受限于原生实现所能绘制的内容。
- **FR3 — 组件有一份核心契约，以及每个平台一份契约。** 核心契约是组件的名称、凡提供该组件的平台都以相同含义与默认值支持的 props、它的状态、它的措辞，以及它的无障碍语义（名称、角色、状态、焦点行为与播报）。对每个提供该组件的平台，它都相同。
  - 当某个 prop 的行为符合 core 已针对该平台输入类型所定义的方式时，该平台才算支持这个 prop。`tooltip` 留在 core 中：core 定义了在没有 hover 的情况下 tooltip 的行为（Tooltip `touchTrigger`），触摸平台就按该方式表现。
  - 只有当某个提供该组件的平台无法在其输入类型上匹配 core 所定义的行为时，某个 prop 才会离开 core。这类 prop 属于能够匹配的那些平台的契约（web、iOS、macOS、Android、Windows），同一个 prop 可以带一种含义出现在多个平台契约中（FR8）。链接上的 `rel` 与 `target` 属于 web 契约：应用平台通过系统打开每个链接，没有可设置的关系或浏览上下文。
  - 在同一种语言内，一套 API 服务于该语言应用所运行的所有平台，并按设备自适应，正如 SwiftUI 的 `.help` 在 macOS 上显示 tooltip、在 iOS 上变成提示（hint）。只有当该语言的其他平台上不存在诚实的实现行为时，prop 才会被限定在单一平台上；这类 prop 会说明其原因，并且绝不为本可自适应的行为让应用按平台分支（`#if`）。
  - 平台绝不提供它并未完全支持的 prop。平台接受却忽略、或仅部分支持的 prop，会违反 `architecture:public-component-api/INV2`。
  - 平台契约绝不删除、重命名或改变核心 prop 的含义。把已发布的 prop 从 core 移到 web 契约不会改变任何 web 调用方的类型，因为 web 类型本就是核心契约加上 web 契约；原生契约则不再提供它。
  - web 契约持有 web 基础 props：样式输入、DOM 事件、refs、元素选择，以及 HTML 属性。
  - 组件可能只存在于部分平台；在其他平台使用它会在类型检查或构建时失败，报错信息会指明受支持的平台，绝不会渲染静默替代品。
- **FR4 — 核心契约是可移植的。** 每个核心 prop 在受支持平台的应用所用的每种语言中都有对应形式，包括 Swift 与 Kotlin：字符串、数字、布尔值、封闭字符串集、开放字符串集、布尔值与封闭字符串集的组合、字符串与布尔值的组合、数组、这些类型的记录、可选值，以及参数可移植的回调。
  - **开放字符串集**是一组内置名称，theme 或应用可以扩展它，正如 core 的可增补映射（augmentable maps）那样。其 wire 值就是名称本身，与 web 上相同。每个原生平台为此提供的类型是以字符串为底的值，并为每个内置名称提供一个常量，而该平台的 theme 构建会为 theme 声明的每个名称添加一个常量，正如 web 的 theme 构建写出 TypeScript 增补那样。任何名称都能被解码；平台收到自己没有对应规则的名称时，会绘制组件的基础外观，正如 web 对没有内置样式的增补名称所做的那样。
  - **布尔值与封闭字符串集的组合**，例如 CheckboxInput 的 `value: boolean | 'indeterminate'`，在每个平台上都把 `true`、`false` 与每个具名状态保留为不同的值，其 wire 值与 web 值相同。
  - **字符串与布尔值的组合**，例如 Avatar 的 `tooltip: string | boolean`，在每个平台上都把 `true`、`false` 与字符串保留为不同的值。其 Swift 类型是一个枚举，为每个布尔值各提供一个 case，另有一个 case 携带字符串，例如 `AvatarTooltip`，其 wire 值与 web 值相同。
  - 若某个 prop 的 web 类型比上述种类更宽，它可以声明一个可移植的封闭集合，其中的值是每个平台都支持的，并与某个 web 值一一对应，例如 Button 的 `width`：`content`（默认）或 `fill`，其中 `fill` 对应 web 上的 `'100%'`。该 prop 的其他 web 值留在 web 契约中。
  - 自由格式内容（`ReactNode`）与渲染函数不可移植。它们属于 web 契约，也属于实现运行 React 的那些平台契约；core 改用带类型的 slot 来表达内容。**text** slot 是一个字符串。**icon** slot 是共享的图标名称（FR17），各平台按 FR17 所述解析；在原生平台上，开发构建中遇到未知名称会以一条指明该图标的消息中止，发布构建中则不绘制任何内容。**content** slot 承载具名的 Astryx 组件。平台契约可以为同一个 slot 接受更宽的形式，例如 web 上的 React 节点；该 slot 保持一种含义，而 core 的形式是每个原生平台都接受的形式。
- **FR5 — 平台 props 是按平台限定的类型。** `@astryxdesign/core` 暴露核心契约与 web 契约；其默认类型即 web 契约，对 web 调用方保持不变。`@astryxdesign/native` 暴露原生平台契约，由使用方的类型解析条件选择：`ios`、`android`、`macos` 或 `windows`。使用方的配置依赖这些条件名，因此它们是公开的。在某个平台的条件之下，组件的 props 由核心契约加上该平台的契约组成，来自另一平台契约的 prop 属于类型错误。Swift 与 Kotlin 绑定随 `@astryxdesign/native` 发布，并与 TypeScript 类型由同一份契约定义生成。
- **FR6 — 面向多个原生平台的代码可以只使用 core。** 在 `shared` 条件之下，`@astryxdesign/native` 只暴露核心契约。运行在多个原生平台上的代码针对它做类型检查，此处的平台 prop 属于类型错误；平台 props 位于该平台自己的文件中。共享代码是否必须使用该条件，属于 OQ5。由 web 与原生代码共享的文件只导入 core 契约类型与非视觉逻辑；各平台自己的文件导入该平台的组件（DEC-9）。
- **FR7 — 基础 props 在各平台之间协调一致。**
  - **共享基础 props**在每个平台上相同：`id`，一个稳定标识符，以及 `isHidden`，它把组件从布局与无障碍树中移除。每个平台把它们映射到自己的机制，例如 web 上的 `id` 属性与 iOS 上的无障碍标识符。
  - **平台基础 props**属于某一个平台的契约。web 基础 props 是由 `architecture:public-component-api` 管辖的 DOM 属性。
  - **挂载目标：**每个组件声明其基础 props 所挂载的部位，例如根节点、触发器、控件或容器，并且该部位在每个平台上相同。已经路由基础 props 的家族记录，例如 `family:input-fields`，为其成员决定该部位。
  - **协调：**每个核心 prop 拥有其概念。核心 prop 所拥有概念对应的平台基础 props 不属于该组件的平台契约；核心的 `label` 拥有无障碍名称，因此 web 的 `aria-label`/`aria-labelledby` 与 iOS 的无障碍标签不是独立的输入。凡是名称被核心 prop 使用的平台基础 prop，都从该平台的基础中移除，正如 DOM 的 `onChange` 是组件的 `onChange` 报告值的地方。这扩展了 `architecture:public-component-api/INV5`：组件自有的无障碍与行为不可被覆盖。类型系统无法拒绝的、被移除的连字符属性如何强制执行，属于 OQ6。
- **FR8 — prop 名称跨平台不冲突。**
  - 平台 prop 绝不重用核心 prop 的名称。
  - 核心 prop 名称不是 Swift 或 Kotlin 的关键字，也不是某个平台工具包已以不同含义使用的名称，例如 React Native 中的 `style` 或 `testID`。
  - 当组件拥有某个概念时，Astryx 可以为组件 prop 收回对应的 web 基础名称。每个被收回的名称都会声明，而平台自身的含义会从该组件的基础 props 中移除（FR7）。`onChange`、`title`、`color` 与 `content` 目前已被收回。
  - 同一个名称只有在表示同一概念时才可出现在两个平台契约中，例如各有自身取值的 `menuStyle`。它绝不出现于合并多个平台的类型中，文档会展示各平台的值。
  - 不满足这些规则的 web 契约 prop，例如 `as`（Swift 与 Kotlin 的关键字）或 `style`，留在 web 契约中，绝不进入 core。
- **FR9 — 文档与 CLI 感知平台。** 组件文档中的每个 prop 都标注为 core 或指明其平台，每个示例也指明其所针对的平台。原生平台契约由 `@astryxdesign/native` 记录。`astryx component <Name>` 展示核心契约，并在选择平台时展示该平台的契约。针对一个平台的输出绝不会把另一平台的 props 列为可用。theme 文档按平台展示原生 theme 配置。
- **FR10 — 原生 theme 配置建立在已定义的 theme 之上。** 一份 `defineTheme` 定义服务于 web 与每个原生平台，并且它始终是 tokens 的唯一权威。tokens 与 theme 局部 tokens 是共享部分，在任何地方含义相同（`architecture:theme-compilation/INV10`）；仅限 web 的部分遵循 FR18。`@astryxdesign/native` 导出 `defineNativeTheme(theme, config)`，它原样接收一个 `DefinedTheme` 并添加仅限原生的视觉意图；它绝不设置或覆盖 tokens：
  - **持久意图。** 成员描述的是使用者能看到的某个结果，绝不是平台功能名称或 OS 版本。成员有：`material`，类型为 `'opaque' | 'translucent'`；`corners`，类型为 `'smooth' | 'stepped'`，其中 smooth 按 radius token 绘制平台自带的圆角，stepped 绘制边长为 `border-width` 的方阶，阶数按半径能容纳的数量，边框也随同样的阶；`imageScaling`，类型为 `'smooth' | 'pixelated'`，其中 pixelated 用最近邻方式缩放位图图像；以及 `textGrid`，一个正整数，即字形绘制所依据的每 em 网格单元数，文本尺寸（包括平台的文本尺寸放大）都对齐到该网格，使一个网格单元覆盖完整的设备像素，且绝不低于使用者的文本尺寸设置。成员缺省时保持平台的默认外观。每个原生平台读取持久意图，并用所运行 OS 版本最接近的能力来实现它，例如在有该材料的 iOS 版本上使用系统玻璃材质，或使用较早的系统模糊。没有这类能力的平台，其渲染效果如同该成员缺省。
  - **平台条目。** `platforms.<platform>` 使用 FR1 与 FR5 中的平台名称，并持有一个有序的条目列表。条目可以指明一个 OS 版本范围，即 `minVersion` 与可选的 `maxVersion`；不带范围的条目适用于每个受支持版本。条目持有来自该平台自身词汇的成员，例如 `ios` 的 `material: 'liquidGlass'`，以及 `components`：针对该平台 theme 目标的覆盖，包括只存在于该平台契约中的目标，取自该平台已发布的 theme 目标与成员列表，因此未知的目标或成员属于类型错误。条目只在其平台上、且在其范围内生效。在该处，其成员替换同名的持久成员，而更晚匹配的条目替换更早的条目。
  - 平台功能名称只在其平台条目内有效，而只存在于某些 OS 版本的功能，只在范围落在这些版本之内的条目中有效。
  - 原生 theme 可以 `extends` 另一个：持久成员逐个成员合并，而子级针对某平台的条目列表替换基级针对该平台的列表。每个值都是可直接序列化的纯数据，词汇表之外的成员属于类型错误。
- **FR11 — 原生平台在每个受支持的 OS 版本上都原生优先。** 当平台自带的控件或惯例能满足组件契约时，组件就使用它：导航、sheet、菜单、选择器、开关、文本输入、滚动、焦点、键盘快捷键、触觉反馈与系统材质。只有在平台没有相应控件时，组件才绘制自定义控件。在每个受支持的 OS 版本上，它使用该版本的控件与材质。比所运行 OS 更新的能力，降级为最接近的较早平台等价物，或降级为持久意图，绝不降级为破损或空白状态。触摸目标满足平台最小值，文本遵循平台的文本尺寸设置。当组件按屏幕尺寸在多种呈现方式之间选择时，compact 采用 `spec:AST-012` FR9 的点或密度无关像素，而不是平台的尺寸类别；平台自带的控件仍负责呈现所选界面。原生平台只有在其最旧与最新受支持的 OS 版本上都满足 FR12 标准，才算受支持。
- **FR12 — 各方案在同一张评分卡上比较。** 构建某个原生平台的每种候选方式都用同样的方式度量。候选方式包括：基于生成契约的平台视图、React Native 组件、在驱动平台视图的 JavaScript 引擎中运行的 TypeScript 组件逻辑，以及通过原生渲染器运行的 Astryx web React 组件：
  - **场景：**一组共享的脚本化用户流程，覆盖有代表性的组件与模板，每一步都由使用者的手势与其预期状态定义一次，并在每个候选方式与参考实现上原样重放。
  - **参考实现：**同样的场景直接用平台自带的工具包构建，例如 SwiftUI 或 UIKit、Jetpack Compose、AppKit 或 WinUI。参考实现设定了候选方式评分所对照的上限。
  - **设备：**运行发布构建的真实硬件，覆盖每个平台最旧与最新受支持的 OS 版本，并包括一台低端设备。
  - **采集：**每个场景步骤在设备上以截图采集，每个行为（例如 sheet 打开与关闭、导航转场、手势、滚动、按压反馈、键盘出现）以短视频采集，每个场景以屏幕录制采集。采集针对每个候选方式、参考实现，以及同一场景的 web 渲染，在浅色与深色下、并在最大文本尺寸下进行。视觉与动效评分依据这些采集判断，绝不依据源码或样式值。
  - **体验：**对平台惯例与核心契约（FR3）的符合程度，按场景步骤评判；行为与动效则按行为视频、对照参考实现评判时序、手势响应与可中断性。
  - **品牌保留：**theme 的标识——其颜色、排版、形状、间距与图标——在屏幕保持原生优先的同时能多可辨识地延续到平台，对照同一 theme 的 web 渲染评判，并对采集做像素检查、与 theme 解析后的值比对。
  - **性能：**首次内容出现时间、每个场景中的帧节奏与丢帧、输入到响应的延迟、内存，以及该方案给应用增加的体积。
  - **无障碍：**在各平台屏幕阅读器下，名称、角色、状态、焦点顺序与播报与核心契约保持一致。
  - **维护：**一次 Astryx 发布与一个新 OS 版本在该平台上所需的工作量，核心契约变更是否能自动到达该平台，以及从 OS 发布到交付其某项新功能所需的时间。
  - **开发者速度：**从修改到在设备上看到效果的时间，以及应用代码跨平台复用的比例。
  - **依赖：**每个必需的运行时依赖，按 FR13 分类。

  未能通过 FR13 或低于 OQ1 阈值的候选方式不受支持，无论其他得分如何。

- **FR13 — 必需依赖只能是平台自身、一方项目，或 React Native 自有的平台。** 原生平台的必需运行时依赖限于：平台自带的 SDK；由维护 Astryx 的组织维护的开源项目，例如 React、React Native、Hermes 与 StyleX；以及针对 macOS 与 Windows，React Native 指明为其自有平台的树外平台（`react-native-macos` 与 `react-native-windows`）。其他任何第三方库或分支，可以是可选集成、示例或参考。在任何平台上使用 Astryx 都绝不要求它。FR12 的依赖度量记录每个必需运行时的维护者，以及其发布落后 React Native 多远。
- **FR14 — core 不因原生支持而改变。** `@astryxdesign/core` 绝不导入或依赖 `@astryxdesign/native`。对每个 theme 而言，无论是否安装了原生包，生成的 CSS、挂载的规则与渲染出的 web 标记都逐字节相同。web 契约保留其今天拥有的每个 prop 与基础 prop。FR7 或 FR8 对 web 调用方所隐含的移除属于破坏性变更，只在 `spec:AST-017` 下按计划的小版本发布；把现有 web prop 改为 icon slot——而 web 今天把字符串渲染为文本——也是如此。
- **FR15 — 在一个平台受支持之前，原生支持只在 canary 渠道发布。** `@astryxdesign/native` 是一个私有的、仅限 canary 的包（`spec:AST-033/FR4`）：它只发布到 canary 渠道，绝不作为稳定版本发布。一旦其首个平台在 FR11 与 FR12 下受支持，它就在某个计划的小版本中加入稳定发布组。在此之前，其平台契约与原生 theme 配置可能在任意 canary 中变化。
- **FR16 — 原生侧通过一个可移植入口单向读取 core。** `@astryxdesign/native` 只通过一个可移植入口读取 `@astryxdesign/core`，该入口以类型和数据的形式携带核心契约、`DefinedTheme` 类型，以及解析后的 token 值。该可移植入口没有 DOM 类型，既不要求 `react-dom` 也不要求 StyleX，且不包含 web theme 编译器或 web 组件实现，因此原生应用既不安装也不打包仅限 web 的代码。原生平台契约在构建时从核心契约定义生成，因此核心契约的变更会在下次构建时到达每个原生平台；生成的 Swift 与 Kotlin 绑定在运行时完全不携带 core 的内容。包边界检查从两个方向强制执行：core 绝不导入 native，native 也绝不在可移植入口之外导入 core。在可移植入口发布之前，原生构建脚本可以在构建时通过 `@astryxdesign/core/theme` 与 `@astryxdesign/core/theme/tokens` 读取 core，并把 core 的组件文档、内置图标名称与语言目录作为数据读取，以生成原生代码并在原生测试中检查原生覆盖情况。边界检查按名称列出每一次这类读取，并拒绝任何其他读取，且没有任何原生运行时代码或生成的绑定导入 core。可移植入口是 `@astryxdesign/core` 的一个入口（DEC-8）。它使 `react-dom` 与 StyleX 成为 core 的可选 peer，并把解析后的 token 值与 web theme 编译器分开。

- **FR17 — 图标共享名称，并默认为平台符号。** 每个平台共享 Astryx 的语义图标名称，即内置名称加上带命名空间的 `<library>:<name>` 名称，由可移植入口携带。每个原生平台把每个内置名称映射到自身系统图标集中的默认图像，例如 Apple 平台上的 SF Symbols 与 Android 上的 Material icons，原生平台只有在其映射覆盖每个内置名称时才受支持。应用或 theme 定义的图标会替换平台默认图标。原生 theme 配置在平台条目内以数据形式指定平台图标，例如 `icons: {close: {systemName: 'xmark.circle'}}`，或应用随包提供的图像，例如 `{assetName: 'pixel.close'}`，因此只存在于某些 OS 版本上的图标可以像其他平台词项一样被限定范围；应用提供的其他图像通过代码注册。对于它未映射的名称，原生平台没有默认图标，也绝不替换为 web 图标。应用未随包提供的资源图标会在开发构建中以指明该资源的消息中止，并在发布构建中不绘制任何内容，与未知图标名称相同。图标无障碍遵循核心契约：图标除非带有标签，否则是装饰性的。

- **FR18 — theme 定义包含一个可移植部分与一个 web 部分。** 可移植入口导出 `PortableTheme`：theme 的名称、tokens、theme 局部 tokens，以及 `spec:AST-012` FR9 的精简定义（生效的 `md` 宽度点与 500 高度边界），每项都能在不依赖 CSS 的情况下解析为每种颜色模式下的具体值，例如颜色、以密度无关单位为单位的长度、数字或字体名称。web 部分持有只有 web 才编译或渲染的内容：以 web theme 目标为键的组件覆盖、由 React 元素构成的图标与指示器注册表、媒体表面覆盖、适配（adaptations），以及构建元数据。`DefinedTheme` 是 `PortableTheme` 加上 web 部分，因此每个 web 调用方与每个受维护的 theme 都保留其类型与行为。`defineNativeTheme` 接受 `PortableTheme`，因此 `DefinedTheme` 原样传入即可。当它收到带内容的 web 部分时，会在开发环境中逐项报告其没有原生含义，而不是静默丢弃；原生组件的主题化来自平台条目（FR10），原生图标遵循 FR17。
- **FR19 — 逻辑核心通过一条 wire 驱动原生视图。** 对于组件逻辑以 TypeScript 在原生应用内运行的那个候选方式（FR12），`@astryxdesign/native` 定义一条 wire，它与每个绑定一样由同一批契约生成（FR5）。该 wire 是该候选方式的 canary 界面（FR15）。
  - **节点。** 一个屏幕是一棵节点树。节点指明其组件，拥有一个在同级中唯一的 `key`，可以携带共享基础 props（FR7），按该平台契约的定义携带其数据 props，并在 `events` 中列出逻辑所处理的回调。content slot（FR4）携带子节点。原生视图只接收 `events` 中列出的回调。
  - **动作。** 当视图调用某个已列出的回调时，宿主发送一个动作：节点的 `key`、其组件、回调的名称，以及回调的可移植参数（按顺序）。
  - **兼容性。** 宿主绘制它能够读取的每个节点。对于它无法读取的节点——因为组件对它未知、某个值在其封闭集合之外，或它必需的某个 prop 缺失——会在其位置渲染为不受支持，其同级仍然渲染。宿主不认识的 props 被忽略。
  - **桥接。** 宿主加载逻辑 bundle 并调用其全局函数 `astryxStart(host)`，传入两个调用：`connected(version)` 与 `changed(tree)`。它取回一个 bridge，从中读取当前树并向其派发动作。树与动作以 JSON 形式跨越边界，bridge 带有一个版本。
  - **失败。** 入口缺失、JavaScript 错误、bridge 版本与宿主的不同，或宿主完全无法读取的树，都会使宿主停止：它报告该失败、不绘制任何树、忽略之后的任何树，且不发送任何动作。逻辑核心拒绝不是动作的输入。
  - **引擎。** 逻辑核心只使用 ECMAScript 内置对象，因此它能在 FR13 允许的任何引擎中运行。

### Platform support

- 受支持的功能/引擎下限：web 下限不变。每个原生平台声明其受支持的 OS 版本（OQ4）。按平台限定的类型需要一个支持自定义解析条件的 TypeScript 版本。
- 不受支持的行为：在不在任何平台条目范围内的 OS 版本上，持久意图生效；平台无法实现的持久成员渲染为缺省；用于另一平台的平台专属 prop 或组件会在类型检查或构建时失败（FR3、FR5）。
- 浏览器证据：FR14 没有，它在编译器与渲染输出层面证明。原生相关主张在 FR12 之下于真实设备上证明。

## Current-state impact

- 原生平台发布时，`architecture:public-component-api` 获得共享基础 props、作为平台契约的 web 基础、基础 prop 挂载目标，以及 core 自有的概念（FR7）。
- `architecture:cli-surface` 获得组件输出的平台选择（FR9）。
- 原生平台发布时，`architecture:theme-compilation` 获得原生 theme 边界（INV9、INV10）。
- 可移植入口发布时，`architecture:theme-authoring-contract` 获得 `PortableTheme`，作为 `DefinedTheme` 的可移植部分。`DefineThemeInput` 对 web 调用方不变；`DefinedTheme` 以增量方式获得精简定义（`spec:AST-012` FR9），该定义由 theme 生效的 `md` 点推导而来，其余不变。
- 首个原生契约发布时，`theme` 与 `cli` 使用方文档以及每个组件的文档都会获得平台标注。
- `@astryxdesign/native` 随 FR19 的 wire 在 canary 渠道发布：生成的节点与动作类型、逻辑核心与 bridge，以及一个 Swift 逻辑宿主。其契约模型仍把 FR4 的开放字符串集类型化为封闭集合，因此各平台生成的节点类型与 Swift 绑定都会拒绝 theme 添加的名称，例如 Button 的 `variant`；TypeScript 类型也会拒绝它，而 Swift 宿主会把该节点渲染为不受支持，而不是绘制组件的基础外观。
- `@astryxdesign/core` 尚无可移植入口。core 的 peer 依赖为 `react-dom` 与 StyleX，其 theme 入口包含 web theme 编译器。
- 内置图标名称定义在 web 图标注册表旁边，该注册表把它们映射到 React 元素；可移植入口只在发布后才携带这些名称。
- 目前还没有受支持的原生平台。每个已发布的组件只支持 web，其 props 构成其 web 契约。

## Verification

| 契约     | 验证方式                                                                                                               | 代表性状态                                                                                                                                                                                                                                                                                                                                  | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------- | ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1, FR3 | 组件文档元数据检查，加上导入平台特定组件的类型与构建测试，加上对每份契约的逐平台 prop 检查                             | 一个共享组件；一个仅 Web 的组件；一个存在于部分原生平台的组件；一个不受支持的平台；每个提供该组件的平台都遵循的 prop；只有部分平台遵循的 prop；一个从核心移到 Web 契约的已发布 prop；一个在一种语言的各平台间自适应的 prop；一个单平台 prop                                                                                                 | 某个组件未声明任何平台、声称支持一个不受支持的原生平台，或对不受支持的导入能通过类型检查、能构建或渲染出一个替代物；某个平台类型接受了该平台无法遵循的 prop；在提供该组件的平台上缺少某个核心 prop；把 prop 移到 Web 契约改变了 Web 调用方的类型；或某个单平台 prop 没有说明理由，或让应用对本来可以自适应的行为按平台分支                                                                                                               |
| FR4      | 把契约生成为 TypeScript、Swift 与 Kotlin，并在每种语言中编译                                                           | 每种核心 prop 类别；一个布尔与一个封闭字符串集合的组合；一个字符串与一个布尔的组合；一个开放字符串集合，含一个内置名称、一个主题声明的名称，以及一个平台没有规则的名称；一个投影 prop 处于每个可移植取值处以及一个仅 Web 取值处；一个文本、图标与内容插槽，以及一个传入更宽形式的 Web 调用点；核心中的一个自由形式内容 prop 或渲染函数 prop | 某个核心 prop 没有 Swift 或 Kotlin 形式；一个不可移植的 prop 进入核心；某个具名状态塌缩为 `true` 或 `false`；某个主题声明的名称被平台类型拒绝；某个未知的开放集合名称失败而不是绘制基础外观；线格式值与 Web 值不同；某个投影值映射到不同的 Web 值，或一个仅 Web 取值到达原生类型；或某个插槽在无法渲染它的平台上接受了更宽的形式                                                                                                         |
| FR5, FR6 | 针对每个包与每个条件的测试夹具应用类型检查                                                                             | 核心默认（Web）；每个原生条件；`shared`；一个位于另一个平台文件中的平台 prop，以及一个位于共享文件中的平台 prop                                                                                                                                                                                                                             | 某个平台 prop 在另一个平台的条件或 `shared` 下通过类型检查；任何条件下都缺少某个核心 prop；或 Web 类型发生变化                                                                                                                                                                                                                                                                                                                           |
| FR7      | 逐平台生成的基础 prop 对外接口，加上运行时目标选择测试                                                                 | 共享基础 prop；一个核心拥有的概念；一个复用基础名称的核心 prop；每个被目标定位的部分                                                                                                                                                                                                                                                        | 某个共享基础 prop 因平台而异；某个被拥有概念的基础 prop 覆盖了核心 prop；或基础 prop 在另一个平台上到达了不同的部分                                                                                                                                                                                                                                                                                                                      |
| FR8      | 对每个组件做契约名称检查                                                                                               | 核心 prop 对平台 prop；Swift 与 Kotlin 关键字；平台工具包名称；重新占用的名称；同一个名称出现在两份平台契约中                                                                                                                                                                                                                               | 某个冲突通过检查；某个重新占用的名称未声明；或某个同名的平台 prop 出现在合并类型中                                                                                                                                                                                                                                                                                                                                                       |
| FR9      | 文档与 CLI 输出检查                                                                                                    | 仅核心；每个平台选择；原生包缺失                                                                                                                                                                                                                                                                                                            | 某个平台的输出列出了另一个平台的 prop，或某个 prop 未标注                                                                                                                                                                                                                                                                                                                                                                                |
| FR10     | `defineNativeTheme` 的单元与类型测试，加上逐平台解析测试，加上查看已绘制圆角与已绘制图像的截图                         | 仅持久 `material`；带范围与不带范围的条目；重叠条目；平台 `components`；原生主题扩展；原生配置中的一个 token；位于其条目或范围之外的平台术语；`corners`、`imageScaling` 与 `textGrid` 各自存在与缺失；某个平台条目带有未知的组件目标或成员                                                                                                  | 某个 token 可被设置；某个平台术语在其条目或范围之外通过类型检查；某个条目在其平台或范围之外生效；重叠顺序被忽略；或扩展丢弃成员；持久成员在缺失时改变了任何东西；`textGrid` 把文本缩小到低于文本大小设置；或未知的目标或成员通过类型检查；或 `textGrid` 让某个网格单元落在设备像素的小数上；`corners: 'stepped'` 绘制出填满半径、边框随其而行的方形 `border-width` 阶梯之外的任何东西；或 `imageScaling: 'pixelated'` 把光栅图像变得平滑 |
| FR11     | FR12 在每个场景步骤上、最旧与最新受支持 OS 上的体验得分                                                                | 导航、浮层、菜单、选择器、开关、文本输入、滚动、键盘快捷键、大号文本；一个比运行中的 OS 更新的能力                                                                                                                                                                                                                                          | 某个步骤在平台已提供控件的地方绘制自定义控件；未达到触摸目标的最小值；忽略文本大小设置；或在最旧的受支持 OS 上出错                                                                                                                                                                                                                                                                                                                       |
| FR12     | 在真实发布构建与真实设备上，对候选方案与参照重放场景                                                                   | 每个场景在每个候选方案与工具包参照上运行；最旧与最新受支持 OS；每个平台一款低端设备                                                                                                                                                                                                                                                         | 某个候选方案在没有参照、在调试构建、仅在模拟器、仅在单个 OS 版本、或在不同场景集的情况下被打分，或在不带设备截图的情况下给出视觉得分                                                                                                                                                                                                                                                                                                     |
| FR13     | 对每个原生平台包做依赖清单审计                                                                                         | 平台 SDK；一方项目；一个 React Native 的树外桌面平台；第三方可选集成；第三方分支                                                                                                                                                                                                                                                            | 在平台上安装、构建或渲染需要某个第三方库或分支                                                                                                                                                                                                                                                                                                                                                                                           |
| FR14     | 编译器与渲染输出比较、核心依赖图检查，以及 Web 类型对外接口差异                                                        | 每个受维护主题在安装与未安装原生包时；运行时挂载的与构建出的 CSS；组件；变更前后的 Web 类型；一个把字符串渲染为文本的现有 Web prop 变成图标插槽                                                                                                                                                                                             | CSS、已挂载规则或渲染出的 Web 标记有任何字节不同；核心依赖原生；某个 Web prop 在计划的小版本之外消失；或某个把字符串渲染为文本的现有 Web prop 在补丁版本中而不是计划的小版本中变成图标插槽                                                                                                                                                                                                                                               |
| FR15     | 包元数据与发布通道检查                                                                                                 | 原生包清单；稳定发布；canary 发布                                                                                                                                                                                                                                                                                                           | 在某个平台受支持之前，原生包就可作为稳定发布发布                                                                                                                                                                                                                                                                                                                                                                                         |
| FR16     | 包边界检查，加上一个在不含 `react-dom` 或 StyleX 的情况下安装并打包的原生测试夹具应用                                  | 导入可移植入口；从原生导入某个核心组件或 Web 主题入口；原生构建脚本中一次已列出的构建期读取；一次未列出的读取；核心导入原生；一次核心契约变更                                                                                                                                                                                               | 原生解析到 DOM 类型、`react-dom`、StyleX 或某个 Web 模块；边界的任一方向被跨越；一次未列出的构建期读取通过；或一次核心契约变更在下一次构建时未到达原生契约                                                                                                                                                                                                                                                                               |
| FR17     | 逐原生平台的图标映射覆盖检查，加上覆盖解析测试                                                                         | 每个内置名称；一个带命名空间的名称；带与不带版本范围的主题平台图标；一个应用注册的图标；在开发构建与发布构建中给图标插槽一个未知名称；应用随包提供的一个资源图标与未提供的一个资源图标；在开发构建与发布构建中缺失的资源图标                                                                                                                | 某个内置名称没有平台默认图标；某个主题或应用图标未能替换默认图标；某个受限作用域的图标在其范围之外生效；替换成了某个 Web 图标；或某个未知名称在发布构建中绘制了东西，或未让开发构建以其名称停止；或某个缺失的资源图标绘制了替代物；或某个开发构建未以缺失资源的名称停止                                                                                                                                                                  |
| FR18     | 针对 `PortableTheme` 与 `DefinedTheme` 的类型测试、逐颜色模式的 token 解析测试，以及 `defineNativeTheme` 的报告测试    | 每个受维护主题；一个带组件覆盖、图标、指示符、媒体表面与适配的主题；浅色与深色；一个长度 token、一个颜色 token 与一个字体 token；一个覆盖 `md` 的主题，其紧凑定义跟随该覆盖                                                                                                                                                                 | Web 调用方使用的某个 `DefinedTheme` 成员被移除或改变；某个可移植 token 需要 CSS 才能解析；`PortableTheme` 引用了 React 或 DOM 类型；某个带内容的 Web 部分被丢弃且没有报告；或紧凑定义未跟随主题的有效 `md`                                                                                                                                                                                                                               |
| FR19     | 逐平台条件的线格式类型测试、Swift 解码测试、在 JavaScript 引擎中的宿主测试，以及在没有宿主全局变量的情况下运行逻辑核心 | 一棵带内容插槽的树；一个已列出的回调与一个未列出的回调；一个未知组件；一个未知的封闭集合取值；一个缺失的必需 prop；一个携带宿主不认识的 prop 的节点；不是 action 的输入；一个没有入口的包；一个 JavaScript 错误；桥版本不匹配；一棵宿主完全无法读取的树；一棵在失败之后发送的树                                                             | 某个视图得到未列出的回调；某个 action 携带不同的键或参数；一个不可读节点使其同级节点变空；某个宿主不认识的 prop 使其节点不受支持；逻辑核心接受了不是 action 的输入；或一个失败的宿主绘制了树或发送了 action                                                                                                                                                                                                                              |

## Decision log

### DEC-1 — Every platform targets its own ceiling; platforms share a core contract and the theme

**Reference:** `spec:AST-082/DEC-1`
**Decider:** cixzhang, 2026-10-20

任何平台上的人都应获得原生优先的体验，因此不把某个平台限制在另一个平台所能表达的范围内。每个平台共享的是核心契约与主题，它在每个平台充分利用自身能力的同时，保持行为、用语、无障碍与品牌标识的一致。

已否决：要求每个平台都运行 Web 实现，因为这样会把原生体验封顶在 Web 标记与 CSS 所能表达的范围。

### DEC-2 — Native-only visuals are theme configuration, not component props

**Reference:** `spec:AST-082/DEC-2`
**Decider:** cixzhang, 2026-10-20

应用的外观已经存在于它的主题中，因此仅原生的视觉意图基于已定义主题，在一个 Web 从不加载的原生主题中构建。它可以在原生平台逐步弄清自身需求的过程中变化，而不给任何 Web 用户带来风险。平台 prop（DEC-6）承载平台提供的行为与呈现选择，而不是视觉效果。

已否决：在组件上为一个平台提供视觉 prop，因为那会把一项主题决策搬进每个调用点。

### DEC-3 — How a native platform is built is decided by measurement

**Reference:** `spec:AST-082/DEC-3`
**Decider:** cixzhang, 2026-10-20

生成的原生组件与经由原生渲染器运行的 Web 组件，二者都仍是候选方案。以平台自身工具包为基准衡量的 FR12 记分卡决定某个平台采用哪种方案，当某个候选得分更高时，平台可以更换方案。

### DEC-4 — Astryx requires only platform, first-party, and React Native's own platform runtimes

**Reference:** `spec:AST-082/DEC-4`
**Decider:** cixzhang, 2026-10-21

若某个平台所需的运行时 Astryx 无法维护，它就可能在该项目的控制之外损坏或停滞，因此必需依赖仅限于平台 SDK 与一方项目（FR13）。允许 React Native 的树外桌面平台，以便像在 iOS 与 Android 上那样，在 macOS 与 Windows 上比较 React Native 与纯原生；记分卡衡量它们的维护风险，而不是把它们排除在外。

已否决：要求任何其他第三方运行时或分支，因为 Astryx 既无法修复它，也无法围绕它排期。

### DEC-5 — Native theme intent is durable; platform and version features are scoped

**Reference:** `spec:AST-082/DEC-5`
**Decider:** cixzhang, 2026-10-20

平台特性会随 OS 版本被引入、改名与停用，因此共享的原生词汇命名的是人们看得见的结果，并由每个平台把它们映射到其运行中的 OS 所提供的东西。只存在于某个平台或某个 OS 版本上的特性，仍可在该平台的条目与范围内表达，因此它绝不会到达一个对它毫无意义的平台或版本。

已否决：在共享原生意图中使用平台特性名称，因为它们在别的平台与 OS 版本上会失去意义。

### DEC-6 — Components have platform contracts on a shared core, exposed as platform-scoped types

**Reference:** `spec:AST-082/DEC-6`
**Decider:** cixzhang, 2026-10-20

为所有平台定一份严格契约，会把每个组件削减到每个平台都能遵循的部分，而各自独立的逐平台组件会丢失人、agent 与文档所依赖的共享含义。共享核心加上平台契约既保留一种含义，又让每个平台添加自己的 prop，而平台限定作用域的类型使来自另一个平台的 prop 在 TypeScript、Swift 与 Kotlin 中成为编译错误，而不是静默的空操作。TypeScript 编译器对每个具名 prop 强制执行这一点；带连字符的 JSX 属性是例外（OQ6）。

已否决：用一个类型合并每个平台的 prop，因为它让一个平台的 prop 进入另一个平台的代码，并把同名但取值不同的 prop 合并在一起。

### DEC-7 — Native lives in its own package, `@astryxdesign/native`

**Reference:** `spec:AST-082/DEC-7`
**Decider:** cixzhang, 2026-10-21

Web 用户无需安装任何原生内容，原生应用不加载任何 Web 内容，核心版本发布也从不等待某个原生平台。核心保留核心契约与 Web 契约；`@astryxdesign/native` 持有原生平台契约、Swift 与 Kotlin 绑定、原生主题配置以及原生实现，并且只通过可移植入口读取核心，在该入口发布之前，FR16 所列的构建期读取除外。React Native 候选的原生代码位于 `@astryxdesign/react-native` 的平台层（`spec:AST-112` FR4），而 `@astryxdesign/native` 仍是唯一的跨平台契约包。

已否决：把原生类型与实现放进 `@astryxdesign/core`，因为每个 Web 使用方都会携带它们，而核心的 API 会随每个平台增长。

### DEC-8 — The portable entry is an entry of `@astryxdesign/core`

**Reference:** `spec:AST-082/DEC-8`
**Decider:** cixzhang, 2026-10-21

核心契约、主题定义与 token 解析本就位于核心中，因此在原生仅为 canary 发布时，核心内的可移植入口不搬迁任何现有代码。原生依赖核心的确切版本，与其他仅 canary 的包一样。在 `@astryxdesign/native` 加入稳定发布组之前，会重新审视本决策（FR15）。

已否决：现在单独建一个共享包，因为它会在任何原生平台发布之前就搬迁代码，并往发布组里加一个包。

### DEC-9 — Web and native share contracts and logic, not components

**Reference:** `spec:AST-082/DEC-9`
**Decider:** cixzhang, 2026-10-21

在 Web 应用与原生应用之间共享的代码只导入核心契约类型与非视觉逻辑，而每个平台的文件导入该平台的组件。这样保持单向边界（FR16）完整，而且多数原生应用与其 Web 应用共享的是逻辑而不是屏幕。

已否决：一个在 Web 上解析到核心、在别处解析到原生的共享组件入口，因为它隐藏了调用点实际得到哪个平台的契约。

### DEC-10 — Native icons default to platform symbols

**Reference:** `spec:AST-082/DEC-10`
**Decider:** cixzhang, 2026-10-21

与系统控件并排的图标应当看起来像平台自己的，因此在应用与主题都未定义图标的情况下，每个原生平台为共享名称绘制它的系统符号。品牌一致性仍是主题或应用的选择。

已否决：默认在每个平台上使用 Astryx 的 Web 图标，因为它们放在系统控件旁边显得格格不入。

### DEC-11 — The theme definition splits into a portable part and a web part

**Reference:** `spec:AST-082/DEC-11`
**Decider:** cixzhang, 2026-10-21

原生平台需要的是主题的身份，而不是它的 CSS。把 `DefinedTheme` 拆分为 `PortableTheme` 与一个 Web 部分，让原生通过可移植入口获得共享身份，把 React 元素与 CSS 挡在原生应用之外，并且对 Web 调用方不删除任何内容，因为 `DefinedTheme` 仍是整体；它新增的可移植紧凑定义是增量的。

已否决：让原生读取整个 `DefinedTheme`，因为它携带原生无法使用的 React 元素、CSS 映射与 DOM 类型导入。

### DEC-12 — Open sets extend per theme, and a wider web type may project to native

**Reference:** `spec:AST-082/DEC-12`
**Decider:** cixzhang, 2026-10-23

主题自有的变体像到达 Web 那样到达每个平台：平台主题构建把主题的名称加入一个以字符串为后端的类型，因此代码像使用内置名称那样使用它们，而任何名称都能解码，所以更新的主题绝不会破坏较旧的应用。当某个 Web prop 接受任何原生平台都无法遵循的取值时，核心会列出每个平台都支持的那几个值，而不是让该 prop 仅限 Web。

已否决：用内置名称的枚举再加一个“任意其他字符串”分支，因为主题名称会一直停留在普通字符串，主题构建也就什么都生成不出来。

### DEC-13 — A boolean with named states has one portable form

**Reference:** `spec:AST-082/DEC-13`
**Decider:** cixzhang, 2026-10-23

复选框的混合状态或工具提示的 `'auto'` 之类的 prop 在每个平台上含义相同，因此一条规则给每个平台 `true`、`false` 以及具名状态作为互不相同的取值，而线格式原样传递 Web 的取值。Web 调用方看不到任何变化。

已否决：为相同的取值在每个组件上另起一个原生名称，因为一个取值就会有两个名字。已否决：把核心改成封闭字符串集合，因为它会在计划的小版本发布之外破坏 Web 调用方。

### DEC-14 — The core holds only what every platform honors

**Reference:** `spec:AST-082/DEC-14`
**Decider:** cixzhang, 2026-10-24

为了一致性而在所有平台上保留、但在某个平台无法遵循时被忽略的 prop，会向调用方谎称它有效。因此，核心持有那些提供某组件的每个平台都按核心定义遵循的 prop，而某些平台无法遵循的 prop 则放在能够遵循的那些平台的契约里。一个模块仍可服务多个平台，而某个 prop 可以只在其中部分平台上生效。人们用一种语言构建一次，并在它触达的每台设备上运行，因此在一种语言内，API 按设备自适应，单平台 prop 属于罕见的例外。

已否决：把每个 Web prop 都留在核心中并配一份逐平台的退出清单，因为每个平台真正的对外接口会变成“核心减去一份没人看的清单”。

### DEC-15 — A logic-core tree degrades per node, and a failed host stays failed

**Reference:** `spec:AST-082/DEC-15`
**Decider:** cixzhang, 2026-10-23

更新的逻辑核心可以到达较旧的应用，因此宿主绘制它能读到的内容，只把无法读取的那个节点标记为不受支持，而不是让整个屏幕失败。完全无法信任桥的宿主则改为停止，并保持停止，这样人永远不会看到毫无作用的控件。

### DEC-16 — Corners, image scaling, and the text grid are durable intent

**Reference:** `spec:AST-082/DEC-16`
**Decider:** cixzhang, 2026-10-23

外观为阶梯式、像素化或网格对齐的品牌，命名的是人们看得见的结果，而它在每个原生平台上含义相同，因此品牌把它作为持久意图写一次，而不是在每个平台的条目里重复。

已否决：只在 iOS 平台条目里提供这些术语，因为其他每个原生平台都得再写一遍同样的词。

## Open questions

- **OQ1 — 什么阈值让一个候选方案算作受支持？**（`human-design`）选项：在与工具包参照的固定容差内持平，或按平台设定固定的绝对预算。建议：在同一设备与 OS 版本上相对于参照来衡量——首次内容时间与内存在 10% 以内、在整个场景中掉帧不多于参照、无障碍完全持平——因为绝对预算会随设备变化而漂移。
- **OQ2 — 哪些原生平台先发布？**（`human-design`）选项：先 `ios` 与 `android`、先 `macos`，或全部一起。建议：先 `ios` 与 `android`，然后 `macos`，然后 `windows`。
- **OQ4 — 每个原生平台支持哪些 OS 版本？**（`human-design`）选项：每个 OS 最新的两个大版本，或与活跃设备最低占比挂钩的下限。建议：最新的两个大版本，并在每个 OS 大版本发布时复审，因为它限定了测试范围，也让受限作用域的条目保持很少。
- **OQ5 — 面向多个原生平台的代码必须使用仅核心条件吗？**（`human-api`）选项：必需，这样共享代码中的平台 prop 会在一次检查中失败；或可选，共享代码在它运行的每个平台上各做一次类型检查。建议：默认必需，因为逐平台检查会在该 prop 存在的每个平台上放过泄漏的 prop，只在其余平台才抓到它。
- **OQ6 — 被移除的带连字符基础 prop 如何强制执行？**（`human-api`）TypeScript 不检查带连字符的 JSX 属性名，因此被移除的 `aria-*` 或 `data-*` 输入仍能通过类型检查。选项：一条 lint 规则、一个不应用该输入的开发警告，或两者兼有。建议：两者兼有，运行时变更按 FR14 作为破坏性变更发布。
