# @astryxdesign/native

> **实验性。仅限 Canary 版本。** 本包仅在 `@canary` dist-tag 下发布，从不会作为稳定版本发布。其 API 会随时变更，恕不另行通知。此处的任何内容均不支持用于生产应用。

`@astryxdesign/native` 是 Astryx 在 AST-082（原生优先界面，Native-first surfaces）下探索原生平台（iOS、Android、macOS、Windows）的地方。该实验比较在各平台上构建 Astryx 组件的不同方式，并用同一套评分卡对其进行衡量，从而让每个平台的决策都以证据为依据。

## 目前包含的内容

| 部分       | 路径                              | 用途                                                                                                                                                                                                                                                                          |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 契约       | `src/contract/`                   | 读取核心组件的文档，将其 props 拆分为可移植的**核心契约**和**仅限 Web** 的部分，并为每个仅限 Web 的 prop 注明理由。检查 prop 名称是否与 Swift 和 Kotlin 关键字以及平台工具包名称冲突。                                                                                        |
| 平台类型   | `@astryxdesign/native/components` | 各平台的 TypeScript props，通过类型解析条件选择：`ios`、`android`、`macos`、`windows`，或仅用于核心契约的 `shared`。                                                                                                                                                          |
| Swift 绑定 | `apple/`                          | 一个包含两个产品的 Swift 包：`AstryxNative`，其 props 由同一批契约生成（iOS 和 macOS 的 props 位于 `#if os(...)` 之后），并包含逻辑宿主；以及 `Astryx`，即用核心的 token 绘制的 SwiftUI 视图。仅用于克隆的页面模板位于 `apple/Templates/`。参见[其 README](apple/README.md)。 |
| 原生主题   | `defineNativeTheme`               | 持久的主题意图（`material: 'opaque' \| 'translucent'`）以及按操作系统版本限定的平台条目，例如 iOS 26 起的 Liquid Glass。从不设置 token。                                                                                                                                      |
| 图标       | `NATIVE_ICON_DEFAULTS`            | Astryx 内置图标名称映射到 Apple 平台的 SF Symbols 和 Android 的 Material Symbols。                                                                                                                                                                                            |
| 通信协议   | `AstryxNode`、`AstryxAction`      | 每个组件都以 JSON 形式由 TypeScript 核心发送给原生宿主（方案 C），以及当视图调用回调时宿主发回的动作。Swift 解码 `<Name>Node`，并通过 `viewProps(send:)` 将其转换为 `<Name>Props`。                                                                                           |
| 逻辑核心   | `@astryxdesign/native/logic`      | `createLogicCore` 持有屏幕的状态、构建其节点树并归约动作；`connectBridge` 将其以 JSON 形式传递给原生宿主。仅使用 ECMAScript 内置对象，因此可在 Hermes 中运行。其设计参考了 EJ Campbell 的 astryx-swift 技术原型。                                                             |
| 逻辑宿主   | `AstryxLogicHost`（Swift）        | 在 JavaScriptCore 中运行逻辑核心 bundle，将每棵树解码为 `AstryxNode`，并回传视图的动作。Hermes 宿主使用同一套桥接协议。                                                                                                                                                       |

契约覆盖 Badge、Button、Card、Divider、Heading、HStack、ProgressBar、Selector、Switch、Text、TextInput 和 VStack。`Astryx` Swift 产品绘制 Text、Heading、Button、TextInput、Card 和 Banner，`apple/Templates/` 中的 `login` 模板也以 SwiftUI 绘制。React Native 与 Android 绑定尚未构建；参见[实验矩阵](#实验矩阵)。

```ts
// tsconfig.json for an iOS app: "customConditions": ["ios"]
import type {SelectorProps} from '@astryxdesign/native/components';

const props: SelectorProps = {
  label: 'Shipping',
  options: [{value: 'standard', label: 'Standard'}],
  menuStyle: 'pullDown', // iOS-only prop; an Android build rejects it
};
```

核心文档如何转化为契约：

- 如果一个回调的参数是先若干值、后跟触发它们的 DOM 事件，例如 `(checked: boolean, e: ChangeEvent) => void`，那么这些值保留在核心中，事件则留在 Web 侧。
- 只携带事件的回调留在 Web 侧，除非组件在 `callbacks` 中列出该回调，例如 Button 对 `onClick` 的处理。其核心形式不接受任何参数。如果事件位于值之前，这类回调无论如何都留在 Web 侧。
- 自由形式的内容只有在组件于 `slots` 中声明了对应槽位时才会成为带类型的槽位；`text` 是字符串，例如徽标的标签或标题的文字，`content` 则是子 Astryx 组件，例如堆栈或卡片的子元素。SwiftUI 视图以视图构建器（view builder）的形式接收内容，因此 `<Name>Props` 不包含该内容；`<Name>Node` 将其作为子节点携带。
- 一组封闭的数值，例如标题级别，会表示为带原始值的 Swift 枚举。
- 只有当组件在 `sameMeaning` 中声明某个核心 prop 与平台工具包中的同名概念含义相同时，该 prop 才可以共用该名称。

### 通信协议（方案 C）

TypeScript 核心发送节点树并接收动作。节点在 `events` 中列出核心监听的各个回调；视图只会拿到这些回调。

```ts
// tsconfig: "customConditions": ["ios"]
import type {AstryxAction, AstryxNode} from '@astryxdesign/native/components';

const screen: AstryxNode = {
  component: 'VStack',
  key: 'root',
  props: {
    gap: 2,
    children: [
      {
        component: 'Switch',
        key: 'wifi',
        props: {label: 'Wi-Fi', value: true},
        events: ['onChange'],
      },
    ],
  },
};
// What the host sends back when the switch is turned off:
const action: AstryxAction = {
  key: 'wifi',
  component: 'Switch',
  event: 'onChange',
  args: [false],
};
```

```swift
let host = AstryxLogicHost(bundle: bundleSource) // calls the bundle's global astryxStart(host)
if case .switch(let wifi) = host.root {
  let props = wifi.viewProps(send: host.send)
}
```

```ts
// tsconfig: "customConditions": ["ios"]
import type {AstryxAction, AstryxNode} from '@astryxdesign/native/components';
import {connectBridge, createLogicCore} from '@astryxdesign/native/logic';
import type {Bridge, BridgeHost} from '@astryxdesign/native/logic';

const core = createLogicCore<{wifi: boolean}, AstryxNode, AstryxAction>({
  initial: {wifi: true},
  view: state => ({
    component: 'Switch',
    key: 'wifi',
    props: {label: 'Wi-Fi', value: state.wifi},
    events: ['onChange'],
  }),
  reduce: (state, action) =>
    action.component === 'Switch' && action.event === 'onChange'
      ? {wifi: action.args[0]}
      : state,
});
// The bundle's entry: the native host calls it with its two calls in and
// gets back the bridge it reads snapshots from and dispatches actions to.
(globalThis as {astryxStart?: (host: BridgeHost) => Bridge}).astryxStart =
  host => connectBridge(core, host);
```

## 参与开发

```sh
pnpm -F @astryxdesign/native typecheck        # source and tests
pnpm -F @astryxdesign/native build            # dist/, including platform types
pnpm -F @astryxdesign/native typecheck:types  # every platform's types, after build
pnpm -F @astryxdesign/native generate:apple   # regenerate apple/Sources/.../Generated
pnpm -F @astryxdesign/native generate:swift-ios # regenerate the Astryx product's typed tokens, every published theme, and strings
pnpm vitest run --project node packages/native
```

生成的 Swift 代码会被提交，以便 Swift 包可以固定引用某个提交。一旦生成代码与契约发生偏差，测试就会失败。

**需要清理。** 提交生成的 Swift（`apple/Sources/AstryxNative/Generated`）只是临时做法。之所以这样做，仅因为 Swift Package Manager 从 git 提交安装包，无法运行 Node 生成器。预期的替代方案是：由 CI 生成 Swift 文件并发布到仅含 Swift 的分支或标签，供应用固定引用，同时在 `main` 上忽略这些生成文件。

边界检查（由 `pnpm check:package-boundaries` 执行）：

- `@astryxdesign/core` 从不导入本包。
- 本包中任何文件夹里的任何文件都不得导入 core，但 AST-082 FR16 列出的、在 core 的可移植入口发布之前的构建期读取除外：`scripts/` 中的主题生成器可以导入 `@astryxdesign/core/theme` 和 `@astryxdesign/core/theme/tokens`；`scripts/swift-ios-strings.mjs` 可以读取 core 的语言区域目录（`@astryxdesign/core/locales/*.json`）；`scripts/core-docs.mjs` 会将 core 的组件文档和内置图标名称作为数据读取。
- 该检查会读取除 `node_modules`、`dist`、`.build` 和 `.swiftpm` 之外每个文件夹中的源文本。它会把任何其他指明 core 的模块说明符（`import`、`require`、`require.resolve`、`import.meta.resolve`，或指向 `packages/core` 的相对路径）标记出来。它也会标记以相邻字符串片段（`'@astryxdesign', 'core'`、`'node_modules', '@astryxdesign/core'`、`'packages', 'core'`）或单个字符串（`node_modules/@astryxdesign/core`、`packages/core`）形式书写的 core 包路径。在 `scripts/core-docs.mjs` 中，它只允许一个这样的路径，即 `CORE_ROOT` 定义，并且只允许 `CORE_ROOT` 下所列的读取。它不会追踪以其他方式计算出的路径。

## 实验矩阵

每个方案都在相同的设备上运行相同的测试对象，并以**参考实现**为评分基准：即用平台工具包（SwiftUI、Jetpack Compose、WinUI）手工构建的相同界面。

| 方案                | 组件的构建方式                                                                    | iOS | Android | macOS | Windows |
| ------------------- | --------------------------------------------------------------------------------- | --- | ------- | ----- | ------- |
| A. 纯原生           | 基于生成的契约使用平台视图（SwiftUI、Compose、WinUI）                             | ✓   | ✓       | ✓     | ✓       |
| B. React Native     | 使用 React Native 组件；桌面端通过 `react-native-macos` 和 `react-native-windows` | ✓   | ✓       | ✓     | ✓       |
| C. 共享逻辑核心     | 组件逻辑用 TypeScript 编写并在 Hermes 中运行，驱动平台视图                        | ✓   | ✓       | ✓     | —       |
| D. 原生环境中的 Web | 通过原生渲染器（例如 Expo 的实验性分支）运行 Web React 组件                       | ✓   | ✓       | —     | —       |
| E. 桌面壳中的 Web   | 在 Electron 中原样使用 Astryx 的 Web 组件                                         | —   | —       | ✓     | ✓       |

方案 D 和 E 会参与测量，但按目前写法无法成为必需的运行时：方案 D 依赖第三方分支，方案 E 依赖 Electron 这一第三方运行时（AST-082 FR13）。方案 E 是衡量纯 Web 在桌面端能达到何种程度的基线。

### 测试对象

模板排在前面，因为它们的 Web 版本是内容和状态的已知参考。

1. **第 1 波：** `checkout-wizard`（表单、步骤条、选择器、校验、键盘）、`table-inbox`（长列表、行操作、搜索、撰写浮层）、`dashboard`（图表、表格、滚动）。
2. **第 2 波：** `settings`、`kanban-board`、`ai-chat`、`product-detail`。
3. **组件流程：** Selector、文本输入、对话框与面板、带行操作的列表。

每个测试对象都有一个脚本化交互，每个方案都会重放它。

视觉评分来自真实屏幕。每个脚本化步骤都会在设备上截取屏幕截图，每个行为（面板打开与关闭、导航转场、手势、滚动、按压反馈、键盘）都会录制成短视频或 GIF，每个场景都会录制成完整录像，覆盖每个方案、参考实现和 Web 版本，涵盖浅色与深色模式以及最大字号。评审者会在隐藏方案名称的情况下并排比较截图，像素检查会从截图中读取颜色和尺寸，绝不从源代码中读取。

### 指标

| 领域     | 衡量指标             | 衡量方式                                                                                                                            | 单位                   |
| -------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| 门槛     | 必需运行时           | 依赖清单对照 FR13                                                                                                                   | 通过/失败              |
| 门槛     | 屏幕阅读器一致性     | VoiceOver、TalkBack、Narrator 任务脚本                                                                                              | 通过/失败              |
| 门槛     | 完整性               | 每个测试对象都能渲染每个状态                                                                                                        | 通过/失败              |
| 体验     | 平台观感             | 评审者盲评截图和录像与参考实现的接近程度，另加平台惯例检查清单                                                                      | 评分、清单完成百分比   |
| 体验     | 行为与动效           | 评审者盲评行为视频与参考实现的接近程度：时序、缓动、手势响应、可打断性                                                              | 每项行为评分           |
| 体验     | 采用新系统特性的时间 | 从操作系统发布到方案中上线所需的天数（例如 Liquid Glass）                                                                           | 天                     |
| 性能     | 启动到首屏内容       | 发布构建、冷启动、多次运行的中位数                                                                                                  | 毫秒                   |
| 性能     | 流畅度               | 脚本化交互期间的掉帧情况                                                                                                            | 帧百分比               |
| 性能     | 输入延迟             | 从触摸或按键到可见响应                                                                                                              | 毫秒                   |
| 性能     | 内存与体积           | 脚本运行期间的峰值内存；应用下载大小                                                                                                | MB                     |
| 维护     | 变更成本             | 在方案上交付一个真实 Astryx 变更所需的时间（新增一个 prop、新增一个 token）                                                         | 小时                   |
| 开发速度 | 迭代                 | 从编辑到在设备上可见                                                                                                                | 秒                     |
| 开发速度 | 共享度               | 跨平台复用的应用代码占比                                                                                                            | 代码行百分比           |
| 设计     | 品牌保留             | 设计师盲评：界面是否仍能辨认出 Web 版本中的品牌、同时仍感觉是原生界面，另加对截图的像素检查，核对主题的颜色、字体、形状、间距和图标 | 评分、token 检查百分比 |
| 保真度   | 与 Web 的一致性      | 内容和状态与 Web 模板匹配                                                                                                           | 检查项百分比           |

### 评判

1. 未通过任一门槛的方案将在该平台上出局。
2. 其余方案按平台进行比较，每项指标都相对于同一设备上的参考实现来衡量。
3. 各项指标是加权汇总为一个分数，还是并排排名，目前尚未决定。
