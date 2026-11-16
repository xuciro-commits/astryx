---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-010
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
phase: shipped
owners: [cixzhang]
affects_architecture: [architecture:public-component-api]
affects_families: [family:layout-regions]
affects_contributing: []
affects_consumer_docs: [Resizable]
---

# Structured percentage useResizable configuration system spec

## Intent

用户调整面板大小时，得到的应当是手柄所呈现、辅助技术所播报的同一个面板尺寸。构建者可以把初始尺寸或边界配置为百分比，并可选择通过 `percent(value, {min: pixel(value)})` 或 `percent(value, {max: pixel(value)})` 提供一个显式像素下限或上限。每一个由用户选定的尺寸都保持为像素，从而让指针、键盘、持久化和程序化行为保持可预测。

本规格保留 `defaultSize: 'N%'` 在未提供 `containerRef` 时已发布的含义：针对 `window.innerWidth`（或 1200px 的服务端回退值）解析一次，之后继续作为像素。提供 `containerRef` 只会改变百分比配置所使用的基准：容器的 content-box 活跃轴取代视口。它不会创建持久的相对尺寸模式。

数值输入是像素。解析后的公共输出保持像素。在下列实现与验证落地之前，已发布的源码、测试和使用方文档仍是当前行为的证据；草稿 `component:Resizable` 记录会随该实现一并更新。

## Non-goals

- 在本规格的 pull request 中实现运行时行为。
- 在指针、键盘或程序化调整尺寸之后保持百分比比例。
- 自动分配剩余空间，或要求各自独立定尺寸的区域合计为 100%。
- 支持任意 CSS 单位、函数、表达式或递归组合，包括 `rem`、`vw`、`calc()`、CSS `min()` 和 CSS `max()`。
- 添加百分比吸附点或百分比折叠阈值。
- 添加受控尺寸状态；当前受控折叠行为保持不变。
- 把 `resize()` 扩展到超出其已发布的数值像素输入。
- 改变持久化状态的形状，或添加相对尺寸字段。
- 扩展 SideNav 简化的 `defaultWidth`、`minWidth` 和 `maxWidth` 配置。该集成需要单独的组件决策，因为 SideNav 拥有其根元素和手柄。
- 改变 LayoutPanel 对结构、滚动、inset 或分隔条呈现的所有权。

## Requirements

- **FR1 — 百分比配置使用显式基准。** 在没有 `containerRef` 的情况下，`defaultSize` 中的百分比叶子值必须针对 `window.innerWidth` 解析一次，或在 `window` 不可用时针对 1200px 解析一次，以保留已发布的回退值。在有 `containerRef` 的情况下，它必须针对该容器首个为正的实测 content-box 活跃轴解析一次。随后，结构化百分比必须应用其单一的像素下限或上限。解析之后，选定的尺寸是像素，且不得在视口或容器变化时缩放。
- **FR2 — 方向决定容器基准。** 在有 `containerRef` 的情况下，水平调整尺寸必须使用容器的 content-box 行内尺寸，垂直调整尺寸必须使用其 content-box 块尺寸。RTL 可以反转指针增量，但不得改变百分比基准。在没有 `containerRef` 的情况下，兼容基准无论方向如何都保持为 `window.innerWidth`。
- **FR3 — 交互保持基于像素。** 数值默认值，以及原子或结构化百分比默认值的每个结果，都解析为像素。指针、键盘、吸附、折叠、展开、持久化、回调以及程序化调整尺寸的路径必须继续完全按照已发布 API 的方式读写像素选定值。任何交互都不得创建或保有一个百分比选定模式。
- **FR4 — 混合边界保持有效。** 构建者可以在 `defaultSize`、`minSize` 和 `maxSize` 之间组合像素、原子百分比和结构化百分比值。数值边界保持为像素。百分比值与 FR1 相同的视口或容器基准解析；结构化值随后应用其单一像素下限或上限。百分比边界必须在该基准变化时重新解析。重新解析后的边界会钳制现有的像素选定值；它们不得按比例缩放该值。若解析后的最小值超过解析后的最大值，开发环境必须发出警告，且最大值必须获胜，从而保留已发布的 `Math.min(max, Math.max(min, size))` 顺序，并保证几何为有限值、非 `NaN`。
- **FR5 — 生效几何保持同步。** 生效的选定像素尺寸、LayoutPanel 或调用方渲染的尺寸、持久化的展开值，以及 ResizeHandle 的 `aria-valuenow`、`aria-valuemin` 和 `aria-valuemax`，必须描述同一份解析后的几何。禁止采用会让 hook 状态脱离绘制边界的纯 CSS 钳制。现有的受控折叠回调仍是明确的例外：它们会报告被拒绝的折叠或展开意图，但不声称受控所有者改变了渲染尺寸。
- **FR6 — 基准变化只更新百分比约束。** 一旦原子或结构化百分比默认值初始化了选定的像素尺寸，视口或容器调整尺寸时不得重新解析该默认值。百分比边界必须重新解析、应用其可选像素下限或上限，并钳制选定的像素尺寸。仅由基准引起的布局变化不得触发交互回调，也不得以其他方式声称有人选定了新尺寸。
- **FR7 — 指针手势保留已发布行为。** 指针增量从选定的像素尺寸继续。百分比边界必须在一次手势期间使用单一稳定基准；手势期间的基准变化在手势结束后生效，以免手柄从指针处移开。
- **FR8 — 键盘、吸附和折叠语义照旧。** 方向键步进、Shift+方向键步进、Home、End、折叠阈值和吸附点保持基于像素。折叠保留展开的像素尺寸，展开则恢复该像素尺寸，并受当前解析后的边界约束。
- **FR9 — 持久化保持仅限像素。** 现有的正普通数字和 `{size, isCollapsed}` 条目必须继续按像素选择恢复。遗留的普通 `0` 必须保留其当前含义：在启用折叠时表示已折叠且没有保存的展开尺寸，否则表示没有可用的已保存尺寸。新的百分比配置必须使用当前持久化的像素形状；不添加百分比或相对模式字段。
- **FR10 — 回调报告解析后的像素。** `onSizeChange` 必须继续针对用户交互和已发布的程序化转换接收解析后的像素数值。初始化、水合修正、视口调整大小、容器调整大小以及仅由边界引起的重新钳制，不得被报告为用户交互。
- **FR11 — 单区域与多区域配置共享同一契约。** 多区域调用必须对所有区域使用同一个可选容器和轴。各区域仍各自独立地按像素选定；此变更不得添加均衡、比例保持或合计为 100% 的不变式。
- **FR12 — 无效配置具有安全且确定的回退值。** 可接受的配置是：非负有限数字、完全匹配的非负有限 `Npx` 字符串、从 0% 到 100% 的完全匹配 `N%` 字符串，或一个结构化 `percent()` 值，其百分比有限且位于 0–100 之间，且其单个 `min` 或 `max` 值是有限非负的 `PixelWidth`。没有边界、同时具有两个边界、带有其他判别式，或任何数字无效的结构化值都是无效的。无效的 `defaultSize` 必须在常规边界钳制之前使用 250px；无效的 `minSize` 必须使用 50px；无效的 `maxSize` 必须使用无界的 `Infinity`。显式的 `maxSize: Infinity` 仍然有效。开发环境必须为每个回退值发出警告；生产环境必须使用相同的回退值但不发出警告。初始化之后，无效的原始值不得直接替换已持久化的或以其他方式合法的选定像素尺寸；经回退归一化的边界只能通过常规钳制影响该尺寸。

### Public API requirements

- **API1 — `containerRef` 选择加入容器基准，而不是相对模式。** 单区域和多区域配置可以接受 `containerRef?: React.RefObject<HTMLElement | null>`。省略时，百分比配置使用已发布的视口基准。提供时，每个百分比默认值或边界都使用该容器的 content-box 活跃轴。该 ref 由调用方拥有，因为只有调用方才能识别预期的布局容器；hook 不得推断面板或 ResizeHandle 祖先元素。
- **API2 — 方向是显式的。** 单区域配置可以接受 `direction?: 'horizontal' | 'vertical'`，默认为 `horizontal`。多区域配置现有的顶层 `direction` 为每个区域提供轴。ResizeHandle 的方向与 hook 的方向必须一致；实现必须让不一致在开发环境中可被检测到。仅当存在 `containerRef` 时，方向才会影响容器基准。
- **API3 — 一个显式的 Resizable 词汇表涵盖像素与有界百分比。** 添加服务端安全的辅助函数和类型：

  ```ts
  type ResizablePercentSize = {
    type: 'percent';
    value: number;
  } & ({min: PixelWidth; max?: never} | {min?: never; max: PixelWidth});

  type ResizableSize =
    number | `${number}px` | `${number}%` | PixelWidth | ResizablePercentSize;

  function percent(
    value: number,
    options: {min: PixelWidth; max?: never} | {min?: never; max: PixelWidth},
  ): ResizablePercentSize;
  ```

  `minSize` 和 `maxSize` 使用 `ResizableSize`。`defaultSize` 保留其已发布的宽泛 `SizeValue`，并加入 `PixelWidth | ResizablePercentSize`，从而在运行时校验仍是权威的同时保留每一个现有的 `number | string` 调用方。复用 Table 确切的 `pixel()` 绑定和 `PixelWidth`；不要创建第二个固定尺寸辅助函数。`percent()` 的选项参数是必需的，并且恰好携带一个 `min` 或 `max`，其值是有效的 `PixelWidth`。无界百分比保留现有的规范 `N%` 拼写；`percent(40)` 刻意不作为 `'40%'` 的第二种拼写。数字、确切的 `Npx` 和 `pixel(value)` 保持为像素。确切的 `N%` 与 `percent()` 百分比都是有限且位于 0–100。不要接受 `proportional()`（它是同级权重，不是字面百分比）、CSS 函数、算术、变量、其他单位、同时具有 `min` 和 `max`，或两者都没有。不要添加并行的百分比 prop。

  配置映射：

  - `333` 或 `'333px'` → 保持不变；`pixel(333)` 是新组合方式下规范的结构化静态形式；
  - `'40%'` → 保持不变，是规范的无界百分比；
  - `max(40%, 333px)` 意图 → `percent(40, {min: pixel(333)})`；
  - `min(10%, 400px)` 意图 → `percent(10, {max: pixel(400)})`。

- **API4 — 统一边界是 0.6 中唯一的公共拼写。** `minSize` 和 `maxSize` 是完整的边界词汇表。已弃用的 `minSizePx` 和 `maxSizePx` 别名在 0.5 之前一直受支持，并在 0.6 中移除。数值型 `minSize` 和 `maxSize` 保持完全相同的像素语义，包括显式的 `maxSize: Infinity`。0.6 升级 codemod 会重写静态内联配置；动态组装的配置必须重命名这些键。

- **API5 — 解析后的输出和状态保持像素。** `ResizableRegion.size`、`onSizeChange`、内部 `ResizableProps` 几何以及持久化状态都保持为像素数字。现有的 `width={region.size}`、算术、持久化和 ARIA 调用点必须继续通过类型检查并按原行为运行。受控折叠回调保留其已发布的意图报告行为：当所有者拒绝请求的状态变化时，即使回调报告了所请求的转换，渲染尺寸仍由所有者控制。
- **API6 — 程序化调整尺寸保持像素。** `resize(size: number)` 保留其已发布的签名，并选择一个经钳制的像素尺寸。不支持百分比字符串，且必须保持为类型错误；运行时无效、负数或非有限值会在开发环境中发出警告，并不替换最后一次合法的像素选定值。

### Invalid configuration behavior

| 输入                             | 可接受的值                                                                                                  | 无效回退值                  | 开发环境行为               | 生产环境行为           |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------- | --------------------------- | -------------------------- | ---------------------- |
| `defaultSize`                    | 已发布的 `SizeValue` 加上 `PixelWidth` 或 `ResizablePercentSize`；结构化默认值解析一次                      | 250px，随后进行常规边界钳制 | 警告并使用回退值           | 使用相同回退值但不警告 |
| `minSize`                        | `ResizableSize`；完全匹配的原子字符串；有效的 `pixel(value)` 或 `percent(value, {min XOR max: PixelWidth})` | 50px                        | 警告并使用回退值           | 使用相同回退值但不警告 |
| `maxSize`                        | `ResizableSize`；完全匹配的原子字符串；有效的结构化值；显式 `Infinity` 保持无界                             | 无界的 `Infinity`           | 警告并使用回退值           | 使用相同回退值但不警告 |
| 解析后的最小值高于解析后的最大值 | 两个值各自都是有效的                                                                                        | 最大值获胜                  | 警告并使用已发布的钳制顺序 | 使用相同顺序但不警告   |

回退值修复的是配置；它不是新的用户选定。初始化之后，无效的原始值绝不会直接替换已持久化的或以其他方式合法的选定像素状态。生效的回退边界只能通过常规钳制影响该状态。

### Platform support

- 支持的功能/引擎下限：Astryx Core 支持的、带有 `ResizeObserver` 的每一个浏览器；共享观察器仍是所提供容器的唯一运行时所有者。
- 在所提供容器具有正值测量之前，依赖基准的配置可以把已发布的确定性 1200px 基准用作临时回退。首个有效测量会把依赖基准的默认值解析为其最终初始像素尺寸，并解析百分比边界，且不持久化、不宣告该临时回退。仅用于默认值的观察器必须在该初始选择之后移除；已持久化的像素状态必须跳过本不需要的默认测量。
- 浏览器证据：真实 Chromium 必须验证三个规范的结构化调用、宽与窄的初始容器、之后的基准变化、存储与 ARIA，以及保持不变的视口兼容路径与像素路径。仅靠 jsdom 几何桩并不足够。
- SSR：在没有 `containerRef` 的情况下，原子和结构化百分比默认值保留已发布的 1200px 服务端基准与客户端初始化行为。在有 `containerRef` 的情况下，服务端使用相同的临时 1200px 基准，直到客户端首次测量。水合可以做出一次有文档记录的修正，但不得把临时回退写入存储，也不得为该修正触发 `onSizeChange`。

## Current-state impact

当前 `main` 已交付完整的 AST-010 模型：`defaultSize`、`minSize` 和 `maxSize` 接受像素与百分比形式；`containerRef` 提供可选的 content-box 基准；百分比默认值解析一次；百分比边界在选定状态、绘制、持久化、回调以及分隔条 ARIA 都保持为解析后像素的同时保持生效。无 ref 的路径保留已发布的 `window.innerWidth` 基准与确定性的 1200px 服务端回退。

在统一边界交付之前，仅像素的 API 无法表达百分比约束。单独应用 CSS 约束会使绘制与 hook 状态以及 ResizeHandle ARIA 不一致。统一边界现在同时拥有这两种形式。Astryx 0.6 移除了已弃用的仅像素键别名，同时在 `minSize` 和 `maxSize` 下保留数值像素行为。

已交付的契约仍分散在其当前所有者之间：

- `architecture:public-component-api` 拥有稳定导出与组件契约形状；
- [`spec:AST-017` —— Release Compatibility & Versioning system spec](../AST-017/spec.md) 拥有分类、弃用/清理状态、Changesets 和迁移证据；本规格保留确切的 Resizable 映射及其直接过渡要求；
- `family:layout-regions` 把调整尺寸的状态与交互委托给 useResizable 和 ResizeHandle，而 LayoutPanel 消费解析后的尺寸；
- `spec:AST-002` 管辖调用方拥有的容器基准与可预测状态；
- 已发布的 Resizable 源码、测试、浏览器证据和使用方文档验证指针、键盘、折叠、吸附、持久化、手柄、SSR 和 ARIA 行为；以及
- `component:Resizable` 记录组件特定的实现契约。

### Persistence representation

持久化表示不变：

```ts
interface PersistedResizableState {
  size: number | null;
  isCollapsed: boolean | null;
}
```

原子或结构化百分比默认值在持久化之前会变成像素选定值。恢复时，已持久化的像素选定值优先于 `defaultSize`，并由当前解析后的边界钳制。遗留的普通 `0` 仍是折叠标记，且没有展开尺寸，因此展开会回退到已配置的默认值；当折叠被禁用时，它不提供可用的已保存尺寸。指针、键盘、折叠、展开和数值程序化调整尺寸继续持久化像素。基准变化绝不会写入百分比描述符或相对意图。

### Implementation requirements

1. 对每个百分比默认值保留当前的无 ref 解析器：客户端使用 `window.innerWidth`，`window` 不可用时使用 1200px。
2. 解析完整的原子字符串，并校验完整的 `percent()` 描述符，包括其 XOR 边界形状。在钳制之前应用 FR12 的 250px/50px/`Infinity` 回退值，且仅在开发环境发出警告。把显式的 `maxSize: Infinity` 保留为有效的无界输入。
3. 从 Resizable 导出 `percent`、`ResizablePercentSize` 和 `ResizableSize`；从服务端安全的 `Resizable/utils` 子路径暴露 `percent`、同一个 Table `pixel` 绑定、`PixelWidth` 以及 Resizable 类型。
4. 边界只暴露 `minSize` 和 `maxSize`。不要为已移除的像素别名保留运行时解析、冲突警告或源码类型。
5. 当提供 `containerRef` 时，在配置的轴上测量其 content box，并通过 Astryx 的共享 ResizeObserver 观察它。
6. 把百分比默认值解析一次并写入选定像素状态。一旦该选定值确定，就移除仅用于默认值的观察。仅当百分比边界的视口或容器基准变化时重新解析它们，应用其单一像素下限或上限，然后钳制选定像素状态，使绘制、持久化和 ARIA 保持同步。
7. 在新激活的百分比边界能够钳制之前，刷新过期的缓存基准；即使 `resize()` 在首个正值测量之前选定了像素，也要移除仅用于默认值的观察。
8. 当解析后的最小值超过最大值时，保留已发布的最大值获胜钳制顺序，在开发环境发出警告，且绝不产生 `NaN` 或无效几何。
9. 让指针、键盘、吸附、折叠、展开、回调、持久化和 `resize(number)` 行为保持基于像素。不要添加相对模式，也不要把 `resize()` 扩展到字符串。后来的无效配置不得替换已持久化的或以其他方式合法的选定状态。
10. 保留本规格未明确改变的所有当前受控折叠与遗留持久化行为。
11. 在单独的集成规格或兼容性决策授权扩展之前，让 SideNav 的简化调整尺寸配置保持仅像素。

## Verification

| 契约             | 验证                                              | 代表性状态                                                                                             | 变异或失败预期                                                                                                         |
| ---------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| FR1, API1        | 聚焦的 hook 测试加 Chromium 几何                  | 原子/结构化默认值；在 1200px 时无 ref；宽/窄初始容器；首个正值测量；之后的调整大小                     | 默认值使用错误基准、初始化后重新缩放，或提供的 ref 测量了错误元素                                                      |
| FR2, API2        | 轴测试与 Chromium 交互                            | 水平/垂直；LTR/RTL；反转手柄；无 ref 的垂直兼容性                                                      | 垂直容器尺寸读取了宽度，或兼容路径不再使用 `innerWidth`                                                                |
| FR3, FR6-FR8     | 交互与基准变化测试                                | 交互前后的结构化默认值；视口/容器调整大小；Arrow、Shift+Arrow、Home、End；折叠/展开                    | 选定状态保留了比例、基准变化重新缩放了它，或现有像素交互发生变化                                                       |
| FR4              | 结构化下限/上限、混合边界与无效顺序测试           | 规范的 `percent(40, {min: pixel(333)})` / `percent(10, {max: pixel(400)})`；混合单位；最小值高于最大值 | 描述符边界被应用到了错误方向、边界使用不同基准、选定值缩放而非钳制，或最大值未获胜                                     |
| FR5              | hook、LayoutPanel、持久化与 ResizeHandle 断言     | 低于/等于/高于最大值；基准收缩；受控折叠意图                                                           | 生效绘制、状态、存储和 ARIA 出现分歧，或受控拒绝改变了所拥有的状态                                                     |
| FR9              | 持久化兼容性测试                                  | 正数；遗留零值；遗留对象；结构化默认值；损坏条目                                                       | 存储形状改变、描述符被持久化、未使用的默认值测量了基准，或旧状态含义改变                                               |
| FR10, API5       | 回调测试                                          | 初始化；水合修正；仅由基准引起的重新钳制；指针/键盘/程序化变化                                         | 回调收到描述符，或报告了非交互的布局修正                                                                               |
| FR11             | 多区域与共享观察器测试                            | 同一容器上的两个区域；另一个 hook 观察同一节点                                                         | 区域使用不同基准、引入了选定比例，或一个订阅移除了另一个                                                               |
| FR12             | 生产/开发环境校验与状态保留测试                   | 格式错误的字符串；缺失/同时具有描述符边界；无效百分比/像素；无效重渲染；已持久化选定值；`Infinity`     | 回退值因构建而异、生产环境出现警告、无效输入替换了合法状态，或任何路径产生 `NaN`                                       |
| API3, API4, API6 | 类型、导出、运行时校验与 codemod 测试             | 必需的辅助函数选项；XOR 边界；服务端安全子路径；已移除别名的类型错误；`resize('50%')`                  | `percent(40)` 或两个边界通过类型检查、已移除别名仍通过类型检查、服务端导入获得了客户端指令，或 `resize` 接受非像素输入 |
| Platform/SSR     | 服务端渲染、水合测试与 Chromium 证据              | 无 ref；ref 未被测量；隐藏/零值容器；首个正值测量；布局前调整大小；之后的边界激活                      | 临时基准被持久化、修正触发了 `onSizeChange`、仅默认值的观察泄漏，或新激活的边界以过期缓存测量值进行钳制                |
| Compatibility    | 现有的 Resizable、LayoutPanel、SideNav 与模板套件 | 当前仅像素调用点；无 ref 的原子百分比默认值；已发布的宽泛 `defaultSize` 字符串                         | 现有数值/原子百分比行为、宽泛默认类型、输出、交互或持久化发生变化                                                      |

### Completion criteria

已交付的契约在以下条件成立时保持满足：

- 无 ref 的原子和结构化百分比默认值保留一次性的 `window.innerWidth` 解析和 1200px 的 SSR 回退，且不跟踪视口调整大小；
- 所提供容器的结构化默认值针对首个为正的 content-box 活跃轴解析一次，在该选择之后移除仅用于默认值的观察，并在基准变化和每条交互路径中保持为像素选定值；
- 原子和结构化百分比边界在两种基准模式下都会重新解析，应用其可选像素下限或上限，并钳制现有像素状态而不按比例缩放它；
- `percent()` 在类型系统和运行时校验中都要求提供选项以及恰好一个 `min` / `max`，且携带有效的 `PixelWidth`；`percent(40)` 不是 `'40%'` 的别名；
- `Resizable/utils` 保持服务端安全，重新导出 Table 的确切 `pixel` 绑定和 `PixelWidth`，并导出 `percent` 以及 Resizable 类型；根包解析出单个 `pixel` 符号和单个 `percent` 符号且不冲突；
- 指针、键盘、吸附、折叠、展开、持久化、回调和 `resize(number)` 保留已发布的像素语义；
- `minSizePx` 和 `maxSizePx` 不再通过类型检查，也不再获得运行时处理，并且 0.6 升级 codemod 会把静态内联配置重写为 `minSize` 和 `maxSize`；
- 精确解析只接受非负有限数字、完整的 `Npx` 字符串和 0–100 的 `N%` 字符串；描述符校验会拒绝缺失像素边界、同时具有两个像素边界或数字字段无效的情况。无效值使用文档记载的 250px、50px 或 `Infinity` 回退值，且不替换已持久化的/合法的选定状态，同时显式的 `maxSize: Infinity` 仍然有效；
- 反转的解析后边界会在开发环境发出警告，确定性地选择最大值，且绝不产生 `NaN` 或无效几何；
- 混合边界让生效状态、绘制、存储和分隔条 ARIA 保持一致，同时受控折叠回调保留已发布的意图报告；
- 仅默认值的订阅即使在测量前的 `resize()` 之后也会终止，并且新激活的百分比边界会在钳制之前测量当前基准；
- 单区域和多区域订阅与同一元素的其他每个观察器共存；
- 聚焦的测试在旧实现上失败、在新实现上通过；
- 真实 Chromium 在宽/窄基准、之后的调整大小、存储和 ARIA 上验证三个规范的结构化调用，以及保持不变的兼容路径；以及
- `component:Resizable` 和使用方文档在与实现相同的 pull request 中描述已交付的契约。

## Decision log

### DEC-1 — Percentages configure pixel state; they do not create relative state

**参考：** `spec:AST-010/DEC-1`

**决策者：** `cixzhang`、`2026-08-31`

保留已发布的无 ref 百分比默认值：针对 `window.innerWidth` 解析一次，`window` 不可用时使用 1200px，然后作为像素运行。可选的调用方拥有的 `containerRef` 会把百分比默认值和边界的基准改为容器的 content-box 活跃轴。它不会让选定尺寸变成响应式。

所有用户交互、程序化 `resize()`、折叠/展开、回调和持久化都保持仅像素。百分比边界可以随其基准重新解析并钳制该像素状态。这样既让 API 保持可预测，也让每个被表示的状态在 `spec:AST-002` 下有效，同时避免引入第二种持久尺寸模式。

已否决：在拖拽之后保持百分比比例，或把 `resize()` 扩展到接受百分比字符串。两者都会改变已发布的基于像素的交互，并添加调用方并未请求的单位感知状态、持久化、回调和恢复语义。

### DEC-2 — Initial size and bounds share one configuration vocabulary

**参考：** `spec:AST-010/DEC-2`

**决策者：** `cixzhang`、`2026-08-31`

添加 `minSize` 和 `maxSize`，它们与 `defaultSize` 具有相同的原子值以及结构化 `ResizablePercentSize` 描述符。数字和确切的 `Npx` 保持为像素；字符串还接受有限的 0–100 `N%`；Table 现有的 `pixel(value)` 是规范的结构化静态值；`percent(value, {min: pixel(value)})` 添加一个像素下限，`percent(value, {max: pixel(value)})` 添加一个像素上限。在初始尺寸与边界之间混用单位是有效的。这为构建者提供了一套可预测的词汇表，既不需要并行的百分比 prop，也不需要重复的辅助函数。

`minSizePx` 和 `maxSizePx` 在 0.5 之前一直是已弃用的兼容别名。Astryx 0.6 在两个稳定版本之后移除它们；数值型 `minSize` 和 `maxSize` 保留其像素含义，`astryx upgrade` 会重写静态内联配置。动态组装的配置必须重命名这些键。

无效输入在每种构建中都使用按角色确定的回退值：`defaultSize` 为 250px，`minSize` 为 50px，`maxSize` 为无界的 `Infinity`。开发环境还会额外警告。显式的 `maxSize: Infinity` 仍然有效。如果解析后的最小值超过其最大值，开发环境会警告，并按已发布的钳制顺序让最大值获胜。这些规则避免格式错误的输入和反转的边界产生 `NaN`，或替换已持久化的/合法的选定状态。

### DEC-3 — Bounded percentages use one explicit structured helper

**参考：** `spec:AST-010/DEC-3`

**决策者：** `cixzhang`、`2026-09-03`

使用由 `percent()` 创建的 Table 风格判别值，而不是针对 CSS 函数的 JavaScript 解析器。该描述符携带一个百分比以及恰好一个 `min` 或 `max`，其值为 Table 现有的 `PixelWidth`。它的选项参数是必需的：现有的确切 `N%` 字符串仍是唯一表示无界百分比的形式。

```ts
pixel(333);
percent(40, {min: pixel(333)});
percent(10, {max: pixel(400)});
```

复用 Table 确切的 `pixel()` 绑定；不要创建另一个固定值辅助函数。不要复用 `proportional()`：它表示同级列之间的相对权重，而不是某个实测基准的字面百分比。这个固定形状把每一种受支持的组合都暴露给 TypeScript，校验和解析保持常数时间，且不暗示任意 CSS 组合。已否决：递归的 CSS `min()` / `max()` 字符串、可选的辅助函数选项、同时具有两个边界的描述符，以及单独的百分比 prop。

### DEC-4 — Astryx 0.6 removes the deprecated pixel-bound aliases

**参考：** `spec:AST-010/DEC-4`

**决策者：** `cixzhang`、`2026-09-07`

在 0.6 破坏性窗口中移除 `minSizePx` 和 `maxSizePx`。它们的替代品已在两个稳定版本中交付，数值型 `minSize` 和 `maxSize` 保持相同的像素行为，第一方调用方在移除变更中完成迁移，并且 `astryx upgrade` 会重写内联配置。保留两套词汇只会维持类型联合、运行时解析、冲突警告、测试和文档，却不增加任何能力。

已否决：无限期保留这些别名。它们明确是临时性的，而统一边界已覆盖每一种受支持的像素情形以及百分比约束。

## Open questions

无。改变已发布的 1200px 服务端回退值或添加持久化的相对尺寸模式，都需要单独的决策。
