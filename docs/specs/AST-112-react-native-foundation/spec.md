---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-112
authority: draft
archive_reason: null
superseded_by: null
approved_by: null
approved_at: null
phase: proposed
owners: [imdreamrunner]
affects_architecture: [architecture:cli-surface]
affects_families: []
affects_contributing: []
affects_consumer_docs: [cli]
---

# React Native foundation system spec

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

开发者用 React Native 与 Astryx 构建 iOS 和 Android 应用，只需安装一个包 `@astryxdesign/react-native`：这是一个用 JavaScript 编写的组件库，建立在承载全部原生代码的平台层之上。命令行工具创建、检查并预览应用。应用通过一套一致的 API 获得 Astryx 的组件、主题与图标，以及原生能力（存储、文件、相机、媒体、Web 内容、文档、原生控件）。应用自身不含手写原生代码，在生成的原生项目中构建，并且只链接它选择启用的原生能力。

有两个应用与这些包配合工作：iOS 与 Android 上的 Astryx 应用，用于预览项目并浏览组件；以及 Astryx Stage，这是面向 macOS、Linux 与 Windows 的桌面应用，它以 iOS 与 Android 的外观渲染用这些包构建的应用，供开发使用（FR12）。

这些包是 `spec:AST-082/FR12` 面向 `ios` 与 `android` 平台的 React Native 候选。它们遵循 `spec:AST-082`：依赖关系见 FR13，canary 渠道见 FR15，对 core 的单向读取见 FR16，共享图标名称见 FR17。

## Non-goals

- 某个平台由哪个候选胜出。`spec:AST-082/FR12` 通过度量来决定这一点。
- 任何一个组件的契约。它由每个组件自己的记录与 `spec:AST-082/FR3` 拥有；本记录拥有 React Native 实现所在的位置，以及它的各个包之间如何关联。
- 把 macOS 与 Windows 作为用这些包构建的应用的目标平台。
- 超出 FR6 至 FR9 中共享规则之外的各能力方法设计。每个能力各自记录其方法、选项与理由。
- Astryx Stage（FR12）的内部实现，超出应用与 CLI 所依赖的部分之外。
- Astryx 应用的设计、功能与分发。
- 等价的内部实现只要满足本契约，仍然有效。

## Requirements

- **FR1 — 两个包族。** 公开集合是：
  - `@astryxdesign/react-native`：应用唯一安装的包。它包含两个层与一个配置插件：
    - 库层：组件、应用根（`AstryxAppRoot`）、主题化、应用使用的 hook，以及 Astryx 路由（DEC-9）。仅含 JavaScript 与 TypeScript。
    - 平台层，它承载全部原生代码。它的核心始终存在：结果词汇表（FR6）、能力形状（FR7）、每个能力的类型、各能力接入的注册表接缝、通用能力（存储、安全存储、文件、网络、Cookie、权限、触觉反馈、剪贴板、客户端身份）、手势所有者、手势根、触摸屏蔽层、呈现宿主、菜单宿主与操作表宿主、系统符号、系统材质，以及安全区域内边距。它的可选能力是选择启用的模块（FR3）：`camera`（相机视图、实时代码扫描，以及从静态图像解码代码）、`media`（音频与视频播放）、`web`（Web 视图与登录会话）、`pdf`（文档视图）、`controls`（原生按钮、文本输入框、日期选择器，以及滑动行、拖拽吸附与缩放分页视图），以及 `navigation`（原生栈宿主与标签页宿主，DEC-9）。
  - `@astryxdesign/react-native-cli`：React Native 实验 CLI，它安装 `astryx-rn` 命令（FR13）。
- **FR2 — 依赖关系单向指向。**
  - 库层直接调用平台层。平台层在源码与测试中都不从库层导入任何内容。
  - 能力只使用平台的核心。除其加载器（`AstryxPlatform.capability(name)`）之外，核心不导入任何能力；加载器是唯一提到能力模块的地方。跨能力的需要经由核心中的注册钩子处理，绝不通过能力之间的导入。
  - 库层只通过该加载器访问可选能力。只要其 JavaScript 加载完成，加载器就返回该能力的模块，无论是否选择启用；仅当模块无法加载时才返回 `null`。应用未选择启用该能力时，该模块的探测返回 false，其调用解析为 `not-linked`（FR3）；在不记录已链接能力列表的二进制文件上，若原生模块缺失，则解析为 `no-module`。
  - 该包在运行时除 `spec:AST-082/FR16` 允许的对 `@astryxdesign/core` 的读取以及 `@astryxdesign/native`（FR10、OQ2、OQ3）之外，不依赖任何其他 Astryx 包。`@astryxdesign/core` 与 `@astryxdesign/cli` 从不依赖它（`spec:AST-082/FR14`）。
  - Astryx 路由（`navigation` 入口）持有路由状态，并驱动平台的 `navigation` 宿主。Astryx 还拥有原生栈容器与标签页容器、转场、手势、内边距，以及每个栏、头部、按钮与搜索框，它们由系统通过平台的宿主渲染，或由库绘制（DEC-9）。
  - 该包不引入任何第三方导航依赖，包括路由库、react-native-screens 与 react-native-safe-area-context：它在 Astryx 之外的唯一 peer 依赖是 React 与 React Native。唯一的例外是 `./navigation-legacy` 入口的可选 peer（FR5）。除该入口之外，React Navigation 适配器只能作为独立的可选包存在，绝不能作为该集合的依赖；它驱动平台的 `navigation` 宿主，并且不依赖任何附带原生导航代码的包，包括 react-native-screens 与 react-native-safe-area-context。
  - React Native 命令行工具是开发依赖。应用的运行时从不导入它们，`@astryxdesign/cli` 也从不依赖它们。
- **FR3 — 应用对每个能力分别选择启用。** 每个可选能力自带其原生模块、系统框架、依赖、清单组件与服务，只有当应用选择启用该能力时，应用的原生构建才会链接它们：在 iOS 上由 Podfile 辅助脚本添加该能力的 subspec，在 Android 上由 Gradle 属性启用其源集。配置插件依据应用传给插件的 `capabilities` 选项写入这两者（FR4）；空列表只链接核心。原生构建记录它所链接的能力列表，核心会读取该列表。
  - 未选择启用某能力的应用不会链接该能力的任何原生代码、框架或依赖。该能力的 `isAvailable()` 与 `is<View>Available()` 返回 false，其每个调用都解析为 `not-linked`。
  - `not-linked` 适用于构建列表中缺失的能力。`no-module` 适用于这样的情况：模块缺失，但其能力在列表中；或者二进制文件不记录列表（FR8）。
  - 该包的清单不声明任何权限。应用需要的每个权限都由配置插件写入（FR4）。
- **FR4 — 原生代码只存在于平台层。**
  - 库层不含原生代码，该包在运行时除 `react`、`react-native`、FR2 允许的 Astryx 包以及 `./navigation-legacy` 的可选 peer（FR5）之外没有其他依赖。
  - 应用不含手写原生代码。它的 iOS 与 Android 项目由应用配置生成。该包只提供一个配置插件。它总是写入核心的宿主声明（在 Android 上是网络状态权限），并根据应用的能力列表写入启用项（FR3）与每个列出能力所需的宿主声明（权限、用途说明、清单条目、后台模式），这些数据由该包按能力提供。每个用途说明都有默认值，应用可以覆盖；对于应用未列出的能力，插件不写入任何内容。
  - 应用级原生设置是由插件写入生成项目的配置。JavaScript 在运行时无法读取或更改它。
  - 平台层以源码形式发布其原生代码，由应用的原生构建编译；核心与每个选择启用的能力通过自动链接和 React Native 的代码生成完成注册。
  - `@astryxdesign/native` 是 `spec:AST-082` 中唯一的跨平台契约包（DEC-7）。React Native 平台随 `@astryxdesign/react-native` 一起发布，能力由应用选择启用（FR3），因为每个能力自带其原生代码、权限与体积，因此应用只链接它用到的部分。该包可以使用 `@astryxdesign/native` 生成的契约（OQ2）。
- **FR5 — 公开表面是刻意设计的。** 每个包在其 `exports` 映射中声明入口，映射之外的导入不受支持。
  - `.` 是应用 API：库层的组件、主题与 hook，以及平台核心中始终存在的对象、视图与结果词汇表。它不包含路由，也不包含任何可选能力的对象或视图。
  - `./storage`（存储、安全存储、文件）与 `./network`（网络、Cookie、客户端身份，以及下面的安装器）承载核心的其余部分。
  - `./theme`、`./styles` 与 `./i18n` 承载主题对象、样式辅助函数与字符串。
  - `./camera`、`./media`、`./web`、`./pdf` 与 `./controls` 是可选能力的入口。`./navigation` 保留给 `navigation` 能力、Astryx 路由及其导航器（FR2）：该名称已被占用，只有当包真正拥有它们时才导出该入口。
  - 除 Jest 设置文件外，任何入口在被导入时都不安装全局对象（DEC-10）。`./network` 导出两个安装器函数，应用在需要下面的全局对象时调用它们：
    - 其中一个安装运行时缺少的 `crypto.getRandomValues` 与 `crypto.randomUUID`，来源为系统的安全随机数生成器，并保留已存在的实现。没有该生成器时它不安装任何东西并报告 `no-module`；它绝不从非安全来源填充它们。它会报告两者中它安装了哪一个。
    - 另一个让全局 `fetch` 遵循 `redirect: 'error'` 与 `redirect: 'manual'`。当运行时没有全局 `fetch` 时它报告 false。
    - 再次调用安装器不会产生任何变化。
  - 除 crypto 安装器外，该包自身的代码不读取全局 `crypto`，也不依赖 `fetch` 的 `redirect: 'error'` 或 `redirect: 'manual'` 模式。
  - Astryx 应用的预览宿主在被预览项目的代码运行之前调用这两个安装器，因此处于预览中的项目无需为它们导入任何内容即可获得这些全局对象。在预览宿主之外，该包仅在应用调用安装器时安装它们。
  - `./navigation-legacy`（连同其 `./navigation-legacy/core`）是包内的那个 React Navigation 绑定：一个绑定 React Navigation 导航器的过渡入口。它对 React Navigation、react-native-screens、react-native-safe-area-context 与 `@callstack/liquid-glass` 的 peer 依赖是可选的，因此不导入它的应用不会安装其中任何一个，也没有其他入口导入它。在包加入稳定渠道之前它会被移除（FR14）。
  - `./testing` 是测试表面：每个原生模块在缺失、较旧与当前形态下的 mock、事件发射器，以及一个 Jest 设置文件（`./testing/jest-setup`），它是该包唯一带副作用的模块。它是公开且有文档的。
  - 内部入口承载 Astryx 自身工具所需的管线（宿主管线、Astryx 应用的预览宿主、Astryx Stage 的模拟，以及文档站的示例与覆盖率数据）。它们具有 `spec:AST-017` FR21 赋予 Core 的 `./internal/*` 的状态：对应用不提供文档、随包一起版本化（FR14）、受包边界检查约束，并且不在兼容性承诺之内。
  - `./app.plugin.js` 是配置插件（FR4），`./declarations/*` 承载它写入的各能力宿主声明。
  - `.` 不导出任何名为 `*ForTesting`、`reset*`、`SIMULATED_*` 或 `*_NAME` 的内容。
  - 被重命名或移除的公开名称或入口会继续导出并标记 `@deprecated`，保留一个小版本。
- **FR6 — 一套结果词汇表。** 平台中的每个异步调用都解析为 `AstryxResult<T, R>`：`{ok: true, …}` 及其数据，或 `{ok: false, reason, message?}`。它从不 reject。
  - `reason` 来自每个能力的封闭集合，再加上通用原因 `no-module`、`not-linked`、`unsupported`、`cancelled`、`not-allowed` 与 `error`。`no-module` 表示平台的原生侧缺失；`not-linked` 表示应用未选择启用该能力的原生代码（FR3）；`unsupported` 表示该二进制文件早于该方法或其某个选项；`not-allowed` 表示 Astryx 应用的策略针对发起调用的项目拒绝了该能力。能力可以添加自己的原因，例如平台无法兑现某个选项时使用 `unsupported-option`。
  - `cancelled` 是唯一不算错误的失败：用户拒绝或关闭了某事物。调用方据此分支处理，不显示错误。
  - `message` 是供日志使用的平台文本。它绝不携带 URL 的查询串、Cookie、密钥或令牌。
- **FR7 — 一套能力形状。**
  - 每个能力对象都有 `isAvailable(): boolean`（同步、开销低、带缓存）与 `version(): number | null`，并在该能力具有可选特性时提供 `supports(feature)`。每个视图都有 `is<View>Available()` 探测。应用未选择启用的能力返回 false，其调用返回 `not-linked`。
  - 平台或较旧二进制文件不支持的路径返回 `unsupported`，或该能力为平台无法兑现的选项定义的原因。它绝不是静默的空操作，也绝不是悄悄减弱的行为。
  - 权限是显式的：`AstryxPermissions.get` 与 `request`，以及 `use<Capability>Permission()` hook。挂载视图从不弹出提示。
  - Hook 负责生命周期：它们在卸载时取消自己的工作，并返回稳定的回调。模块句柄与原生版本绝不出现在面向应用的类型中。呈现系统 UI 的请求（登录、文件选择器）可以接受一个可选的 `rootTag`，用于指定呈现该 UI 的表面。
  - 命名遵循 React Native 自身的约定：`source={{uri}}`、`ref`、接收单个对象参数的 `on<Event>(event)`、`is` 与 `has` 布尔值，以及对封闭集合使用字符串联合。一个调用先接收其对象，再接收一个选项对象，且每个选项都有默认值。
- **FR8 — 原生接口以增补方式演进。** 平台中的每个 TurboModule 与原生组件 spec 都遵循这些规则，包中的一项检查会强制执行它们：
  - 模块用 `TurboModuleRegistry.get` 读取，绝不用 `getEnforcing`；缺失的模块返回 `no-module`，若应用未选择启用其能力则返回 `not-linked`（FR3）。
  - 每个模块的句柄只由其自身的包装层读取。
  - 新行为是新的可选方法或 prop。已发布方法的参数与结果从不改变。
  - 新方法接收一个请求对象，并解析出一个结果对象，其中包含 `status`（`ok`、`cancelled` 或 `error`）、`reason` 与 `message`。领域层的结果（例如“未找到”）是 `ok` 结果的一个字段。
  - 每个模块都报告 `getConstants().version`，即其行为修订号。
  - 仅存在于一个平台上的成员会在其名称或标签中说明这一点。
  - 每个 spec 文件都有头部，载明其所有者、平台、首个版本与稳定性；每个组件 spec 都有版本历史。
- **FR9 — 库说 Astryx 的语言；平台说平台的语言。** 平台的公开类型使用平台词汇，原生控件除外，其外观属于 Astryx 的设计语言。库把 Astryx 词汇映射到平台：图标名称映射到系统符号（`spec:AST-082/FR17`）、反馈时刻映射到触觉类型、主题映射到原生外观。`AstryxAppRoot` 默认接好平台的宿主，并接受 `nativeHosts` 选项；`NativeHostsProvider` 为自行构建根的应用组合相同的宿主。
- **FR10 — 这些包建立在 core 与共享原生代码之上。**
  - token、主题与图标名称来自 `@astryxdesign/core` 的唯一主题定义（`spec:AST-082/FR10`），按 `spec:AST-082/FR16` 读取。React Native 包从不定义第二套 token。
  - 组件沿用 core 的名称与 core 契约（`spec:AST-082/FR3`）。
  - 当 `@astryxdesign/native` 的 Swift 包为某组件提供原生控件或视图时，平台包装该共享控件，而不是再绘制一个。
- **FR11 — 支持 Expo 构建；Expo Go 不是目标。** 平台可在 prebuild 或 development-build 项目中、以及 EAS Build 中通过该包的配置插件（FR4）构建，无需手动修改原生代码。它不在 Expo Go 中运行，也没有任何包需要 Expo 运行时库（`spec:AST-082/FR13`）。Expo 的 API 形状不限制平台的 API。
- **FR12 — Astryx Stage 是开发者所依据的契约。** Astryx Stage 在 macOS、Linux 与 Windows 上运行。它以 iOS 与 Android 的外观渲染用这些包构建的应用，可无头运行或运行在窗口中，用于预览、脚本化检查与 agent 循环。
  - 每个公开平台 API 在 Astryx Stage 中都有实现，其行为与 iOS 和 Android 一致。缺失或行为分歧的路径属于缺陷，在修复之前该能力的文档会指明它。
  - 每个能力的文档都将其在 Astryx Stage 中的行为作为契约加以陈述，并注明 iOS 与 Android 存在差异之处。
  - Astryx Stage 是开发工具。应用在运行时从不依赖它。
- **FR13 — React Native 命令位于实验 CLI 中。** `@astryxdesign/react-native-cli` 安装 `astryx-rn` 命令，即 React Native 命令的实验空间。它只发布在 canary 渠道，其命令可能在任何 canary 中变更或消失。React Native 的已发布命令行形状是 OQ5。
  - 命令：`create`（新建应用）、`doctor`（工具链、项目与已安装的 Astryx Stage）、`generate`（根据配置生成原生项目），以及安装、选择、打开和运行桌面应用、捕获并检查渲染、运行脚本化检查的命令。它们的名称是 OQ5 下的提议（例如 `stage install | update
| use | list | open | run | shot | inspect | test | sweep`）。
  - Astryx Stage 的版本按项目固定在一个由 React Native 命令行工具拥有的配置文件中，绝不放在 `astryx.config` 中，后者的键由 `@astryxdesign/cli` 校验。安装命令会校验每个二进制文件的校验和与签名，第一个需要 Astryx Stage 的命令会安装所固定的版本。
  - `--remote` 在远程运行器上运行 Astryx Stage 命令，并返回与本地运行相同的结果。
  - 它的命令遵循 `architecture:cli-surface` 的输出与退出码规则：从不提问，每次 `--json` 输出都是一个信封，代码稳定且只追加，退出码不依赖输出模式。它与 `@astryxdesign/cli` 共用标志风格，且不向 `astryx.config` 写入任何键。因此无论 OQ5 最终确定哪种已发布形状，命令都保持其契约。
  - `@astryxdesign/cli` 不含任何 React Native 命令，因此 Web 项目不会为它们安装任何东西。
- **FR14 — 一条 React Native 发布列车。** `@astryxdesign/react-native` 按单一版本发布；其能力通过选择启用，从不单独版本化。实验 CLI 独立版本化。
  - 该包独立版本化，位于仓库固定包组之外（`spec:AST-017` FR46）：其 `package.json` 中的版本是它自己下一个计划发布的版本，而不是 core 的。
  - 一次发布从候选版本开始，形如 `<version>-rc.<n>`，每个都从带标签的提交切出。候选版本之后的修复作为下一个候选版本发布，正式发布之后的修复作为补丁版本发布。
  - 在仅限 canary 期间，该包只在 canary 渠道发布，依据 `spec:AST-082/FR15`：它的候选版本与正式版本，以及带有自身所声明版本加 `-canary.<commit>` 的 canary。一旦某个平台获得支持，它会在一个计划中的次版本加入稳定渠道。
  - 在 1.0 之前，次版本可能改变 API。每次发布都有更新日志，为每一处重命名与移除给出迁移步骤；每次发布都会记录打包的 tarball 及其哈希。
- **FR15 — 证据与声明相符。**
  - 原生行为的证据来自 iOS 模拟器、Android 模拟器、真实设备与 Astryx Stage。开发期间以模拟器为唯一事实来源；每一处原生行为变更都在模拟器与 Astryx Stage 中检查。
  - 构建通过并不是行为的证据。关于相机、触觉手感或性能的声明需要真实设备。
  - 平台的测试通过 `./testing` 覆盖每个原生模块在缺失、较旧与当前形态下的情况。
  - 各包文档中的 API 块由源码生成，出现偏移时检查会失败。

### Platform support

- 支持的功能/引擎下限：iOS 为 React Native 自身的最低版本，Android 为 API level 24，且仅在 React Native 的新架构（Fabric 与 TurboModules）上受支持，React 与 React Native 版本以各包声明的 peer 为准。
- 不受支持的行为：二进制文件缺少的能力返回 `not-linked`、`no-module` 或 `unsupported`（FR3、FR6、FR7）；二进制文件缺少的视图会报告自身不可用，由库绘制其回退；不支持 Expo Go 与旧架构（FR11）。
- 浏览器证据：无。原生相关的声明在模拟器、真实设备与 Astryx Stage 上证明（FR15）。

## Current-state impact

- `packages/` 下的新包：`@astryxdesign/react-native` 与实验 CLI，两者都仅限 canary（FR14）。
- `@astryxdesign/cli` 保持不变。React Native 的已发布命令行形状（OQ5）在确定后可能改变 `architecture:cli-surface`。
- `@astryxdesign/react-native` 独立版本化，位于 `spec:AST-017` FR46 的固定包组之外，仓库的 canary 发布赋予它自身所声明的版本（FR14）；实验 CLI 独立版本化。
- `spec:AST-017` FR21 把 Core 的 `./internal/*` 的状态扩展到该包的内部入口（FR5）。
- `spec:AST-082` DEC-7 增加一句：React Native 候选的原生代码位于 `@astryxdesign/react-native` 的平台层（`spec:AST-112` FR4），`@astryxdesign/native` 仍是唯一的跨平台契约包。
- 包边界检查新增 FR2 规则：平台层不得从库层导入、平台核心不得在其加载器之外导入能力、能力之间不得互相导入、除 `./navigation-legacy` 的可选 peer 外不得依赖任何第三方导航包（包括 react-native-screens 与 react-native-safe-area-context）、除 React、React Native 与 `./navigation-legacy` 的可选 peer 外不得有 Astryx 之外的 peer 依赖、core 与 CLI 不得依赖这些包。

## Verification

| 契约 | 验证                                                                                                                                             | 代表性状态                                                                                                                                                                                                                                                                                                                   | 变更或失败预期                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| FR1  | 对名称与入口的包清单检查；canary 发布的包列表                                                                                                    | 公共集合中的每个包；每个能力入口                                                                                                                                                                                                                                                                                             | 某个包缺失于该集合、某个集合中的包缺失于 canary 发布，或某个能力没有其入口                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FR2  | 包边界、源码与依赖检查                                                                                                                           | 平台的源码与测试；库层与平台层；核心与每个能力；包的依赖                                                                                                                                                                                                                                                                     | 平台中出现来自库的导入、核心中在其加载器之外出现能力导入、能力之间相互导入、依赖第三方导航包（包括 react-native-screens 与 react-native-safe-area-context）而非 `./navigation-legacy` 的可选 peer，或出现 Astryx 之外的 peer 依赖而非 React、React Native 与 `./navigation-legacy` 的可选 peer                                                                                                                                                                                                                                                                                       |
| FR3  | 仅含核心的构建应用，与每个已选入能力各一个应用对比：二进制符号与合并后的 manifest；对每个能力的 `isAvailable()` 与某次调用的原因的单元测试       | 某个能力的原生模块、框架、依赖、权限；某个未选入的能力；某个已选入能力缺失的模块；未记录任何列表的二进制                                                                                                                                                                                                                     | 未选入某能力的应用链接了它的任何原生代码或声明、`isAvailable()` 对它应答 true、某次调用解析出的原因不是 `not-linked`，或某个已选入能力缺失的模块、或在未记录任何列表的二进制上解析出的原因不是 `no-module`                                                                                                                                                                                                                                                                                                                                                                           |
| FR4  | `npm pack` 的文件列表；带能力列表从配置生成的示例应用工程                                                                                        | 包的文件；示例的 iOS 与 Android 工程；默认的与覆盖后的用途说明                                                                                                                                                                                                                                                               | 平台层之外出现原生代码、包清单声明了某项权限、示例需要手工的原生修改、生成的工程缺少核心的声明，或它写入的用途说明既非默认值也非应用覆盖值                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| FR5  | `exports` 映射与公共入口名称检查；对内部入口导入的包边界检查；对全局读取的源码检查；安装器的单元测试；已预览工程的运行时                         | `.`、`./storage`、`./network`、`./theme`、`./styles`、`./i18n`、每个能力入口、`./navigation-legacy`、`./testing`、`./testing/jest-setup`、各内部入口、`./app.plugin.js`、`./declarations/*`；没有安全随机数生成器的运行时；只有两个 `crypto` 函数之一的运行时；没有全局 `fetch` 的运行时；被调用两次的安装器；一个已预览工程 | `.` 上出现私有名称、某次深层导入得以解析、某个应用导入了内部入口、`.` 导出了 router 或可选能力、另一个入口导入了 `./navigation-legacy`、`./navigation` 入口未持有 router、某个模块带有 Jest setup 之外的副作用、Jest setup 之外的某次导入安装了全局、除 crypto 安装器之外的包代码读取了全局 `crypto`、包代码依赖 `fetch` 的重定向模式、非安全的随机填充、crypto 安装器替换了运行时提供的某个 `crypto` 函数、安装器在第二次调用时不报告任何内容或发生任何改变、其安装器运行后 `fetch` 在 `redirect: 'error'` 或 `'manual'` 下仍跟随重定向，或某个已预览工程在没有这些全局的情况下启动 |
| FR6  | 通过 `./testing` mock 对每个异步调用的单元测试                                                                                                   | 缺失、较旧与当前的模块；缺失的选项；原生抛出；取消                                                                                                                                                                                                                                                                           | 某次调用 reject，或应答的原因不在其集合内                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FR7  | 对每个能力的探测、权限与 hook 清理的单元测试                                                                                                     | 较旧的二进制；在无权限时挂载的视图；卸载                                                                                                                                                                                                                                                                                     | 静默的空操作、挂载时弹出提示，或存活时间超过其组件的工作                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| FR8  | 平台中的规格规则检查                                                                                                                             | 新增的方法；某个组件规格；仅平台独有的成员                                                                                                                                                                                                                                                                                   | 已发布的方法被改动、缺少头部注释，或新增方法没有 `status`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| FR9  | 对平台公共类型的源码检查；对映射与默认宿主的库测试                                                                                               | 某个图标名称；某个反馈时刻；某次 theme 变更                                                                                                                                                                                                                                                                                  | 通用能力类型中出现 Astryx 词汇，或应用根缺少宿主                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| FR10 | 库与核心 theme 之间的 token 比较；共享原生控件的审查                                                                                             | 每个 token；每个带共享原生控件的组件                                                                                                                                                                                                                                                                                         | 与核心不同的 token 值，或在共享控件旁边绘制了第二个原生控件                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| FR11 | 示例应用的 prebuild 与 EAS Build                                                                                                                 | 选入每个能力的示例                                                                                                                                                                                                                                                                                                           | 构建需要手工的原生修改，或某个包需要 Expo 运行时库                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| FR12 | 在 Astryx Stage、模拟器与仿真器中对每个能力的脚本化检查                                                                                          | 每个公共 API                                                                                                                                                                                                                                                                                                                 | Astryx Stage 的结果与 iOS 和 Android 不同，而文档未点明这一点                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| FR13 | 对每个 `astryx-rn` 命令的 CLI 契约测试：JSON 信封、退出码、Astryx Stage 的校验和与签名拒绝、`--remote` 一致性；对 `@astryxdesign/cli` 的依赖检查 | 每个命令；被篡改的二进制；某个 web 工程                                                                                                                                                                                                                                                                                      | 退出码取决于 `--json`、被篡改的二进制得以运行，或 `@astryxdesign/cli` 包含或依赖 React Native 命令                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| FR14 | canary 与发布候选的试运行                                                                                                                        | 对包的一次发布                                                                                                                                                                                                                                                                                                               | 某次发布缺少变更日志或 tarball 的哈希、某个能力被单独定版，或某个发布候选或 canary 携带的版本并非包自身的版本                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| FR15 | 对每项原生变更的证据的审查；文档漂移检查                                                                                                         | 某次原生行为变更；被重命名的 API                                                                                                                                                                                                                                                                                             | 某项原生声明仅由构建支持，或仅由 Simulator、仿真器、设备或 Astryx Stage 之外的东西支持，或文档已不再匹配                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |

## Decision log

### DEC-1 — The platform is a layer for Astryx, below the library

**Reference:** `spec:AST-112/DEC-1`
**Decider:** imdreamrunner, 2026-11-09

平台层拥有原生契约与一等能力对象；库层直接调用它们，并保留 Astryx 映射。对于库不覆盖的能力，应用调用同样的对象。依赖只从库层指向平台层，因此原生 API 保持干净，库可以变更而不触碰原生代码。

已否决：一个为独立使用而构建的、与设计系统无关的平台，因为它会重复库所拥有的映射。

### DEC-2 — One package with opt-in capabilities

**Reference:** `spec:AST-112/DEC-2`
**Decider:** imdreamrunner, 2026-11-09

应用安装一个包，并从中导入一切：组件、原生平台层与配置插件。存储数据的应用不会附带相机权限、媒体服务或它们的框架：它只链接自己选入的能力，由插件写入该选入项与声明，因此应用永远不必手工编辑原生工程。

已否决：独立的平台包，或每个能力一个包，因为这些包可能以不同版本安装，而每个应用都得跟踪若干个只能协同工作的包。

### DEC-3 — Apps hold no native code

**Reference:** `spec:AST-112/DEC-3`
**Decider:** imdreamrunner, 2026-11-09

平台带来全部原生代码；应用的各原生工程由该包的插件从配置生成。这样 Astryx 升级会经由依赖抵达每个应用，也没有应用携带与平台产生漂移的原生代码。

已否决：应用自有的原生壳代码，因为那样每个应用都要维护平台无法更新的原生代码。

### DEC-4 — Results, never rejections

**Reference:** `spec:AST-112/DEC-4`
**Decider:** imdreamrunner, 2026-11-09

每个失败都是以同一形状承载、带封闭原因的数据，因此调用方用类型检查的分支处理它，并且取消与错误可以区分。

已否决：用 reject promise 表示失败，因为未处理的 rejection 容易被漏掉，且其原因没有类型。

### DEC-5 — Expo builds, not Expo Go

**Reference:** `spec:AST-112/DEC-5`
**Decider:** imdreamrunner, 2026-11-09

云端构建与 prebuild 构建是目标，因此平台携带一个配置插件。Expo Go 无法加载这些包的原生代码，而一个被限制在 Expo 各模块所提供范围内的 API 会封住平台的上限。

已否决：为 Expo 模块系统提供适配器包，因为它增加第二个需要保持同步的接口，却不会让任何构建成为可能。

### DEC-6 — React Native commands start in an experiment CLI

**Reference:** `spec:AST-112/DEC-6`
**Decider:** imdreamrunner, 2026-11-09

在这些包仅以 canary 发布期间，React Native 命令变化很快，因此它们从一个独立的实验程序 `astryx-rn` 起步，并留在 `@astryxdesign/cli` 之外。已发布的命令行形态是 OQ5。

### DEC-7 — Astryx Stage's behavior is the contract developers read

**Reference:** `spec:AST-112/DEC-7`
**Decider:** imdreamrunner, 2026-11-09

开发者针对 Astryx Stage 构建，因此它的行为就是他们所依赖的东西。Astryx 自身的开发以模拟器与仿真器为准绳，并让 Astryx Stage 与它们保持一致。缺失或出现分歧的路径就是缺陷。

### DEC-8 — One release train, canary first

**Reference:** `spec:AST-112/DEC-8`
**Decider:** imdreamrunner, 2026-11-09

库层与平台层一同变更，因此它们装在一个包中、使用该包自己的单一版本，经由发布候选发布。在某个平台依据 `spec:AST-082/FR15` 获得支持之前，它停留在 canary 渠道。

已否决：让 core 的版本留在仓库固定的包组中，因为每次核心发布都会在包本身毫无变更的情况下推动它，而该包 1.0 之前的 API 变更也会跟随 core 的次要版本。

### DEC-9 — Astryx owns navigation, routing included

**Reference:** `spec:AST-112/DEC-9`
**Decider:** imdreamrunner, 2026-11-09

手势、栏、安全区与路由在原生栈中交汇，因此 Astryx 拥有这一切：包的 `navigation` 入口持有 router，平台的 `navigation` 能力持有原生栈与带转场和手势的 tab 容器，核心持有安全区内边距，而每个栏、头部、按钮与搜索框要么属于系统、要么经由平台的宿主，要么由库绘制。除一个过渡入口之外，这些包不引入任何第三方导航依赖，而用 Astryx 的 router 导航的应用不会为导航运行第三方原生代码。

已否决：构建在 React Navigation、react-native-screens 与 react-native-safe-area-context 之上，因为它们的手势处理会与平台的手势处理耦合，而它们的状态模型会限制住 Astryx 的状态模型。

### DEC-10 — Importing the package changes no globals outside its Jest setup

**Reference:** `spec:AST-112/DEC-10`
**Decider:** imdreamrunner, 2026-11-10

应用的行为不取决于其导入的顺序，而该包运行在一个其全局并不由它掌控的运行时中。包自身的代码直接调用其平台，而不依赖全局 `crypto` 或 `fetch` 的重定向模式。预览宿主为它所托管的工程安装这些全局；其他应用若需要它们，就调用导出的安装器。

已否决：一个带副作用的 `./polyfills` 入口，由应用在入口文件中首先导入，因为每个应用都必须记住这一步，且其效果取决于导入顺序。

## Open questions

- **OQ2 — 库的组件 props 何时来自 `@astryxdesign/native` 的平台契约？**（`human-api`）选项：现在就采用，置于 `ios` 与 `android` 条件下；或等 core 的可移植入口发布之后。建议：等可移植入口发布之后，期间用一项检查确认库的 props 与生成的契约相符。
- **OQ3 — 应用如何获得 `@astryxdesign/native` 的 Swift 代码？**（`checkable`）选项：平台内置它所包装的 Swift 源码；或平台的 native 构建直接依赖该 Swift 包。
- **OQ4 — Astryx Stage 的二进制发布在哪里？**（`human-design`）选项：npm 上按 OS 与架构划分的包，由 CLI 安装；或由 CLI 下载并校验的发布资产。建议：带校验和与签名的发布资产，因为二进制很大，而 npm 的可选依赖会安装每个架构的元数据。
- **OQ5 — React Native 已发布的命令行形态是什么？**（`human-api`；所有者：imdreamrunner 与 josephfarina）选项：
  - **核心 CLI 的扩展。** 一个可选的集成包（提议名称：`@astryxdesign/cli-react-native`）通过集成清单中新增的 `commands` 贡献，为 `@astryxdesign/cli` 贡献一个 `rn` 命令组（`astryx rn …`），加载方式与其他贡献相同：在工程内来自该工程的集成，在工程外来自计算机级集成（`spec:AST-081/FR12`）。收益：一套命令、帮助、输出与错误码契约，由核心 CLI 强制。代价：核心 CLI 需要一个命令扩展点（清单的 `cliCommand` 键仅命名打印出的命令前缀），并且 React Native 命令会随核心 CLI 的 peer 范围发布。
  - **一个独立的 CLI。** `astryx-rn` 本身成为发布出的程序，可选地让 `astryx rn` 转发给它。收益：核心 CLI 无需改动，且发布节奏独立。代价：多一套需要保持同步的帮助、输出与错误码表面，以及文档中两个命令名。
  - **命令放进 `@astryxdesign/cli`。** 收益：一个包，无需扩展点。代价：每个 web 工程都会安装 React Native 命令。
