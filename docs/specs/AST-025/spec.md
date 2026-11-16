---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-025
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-11
phase: accepted
owners: [cixzhang]
affects_architecture:
  [
    architecture:container-padding,
    architecture:public-component-api,
    architecture:interaction-modality,
  ]
affects_families: [family:layout-regions, family:layout-primitives]
affects_contributing: []
affects_consumer_docs:
  [Layout, Stack, Table, Popover, DropdownMenu, Carousel, CodeBlock, Tooltip]
---

# Scrollable container behavior system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "scrolling": ["FR1", "FR12", "FR13", "FR14", "FR15", "FR16", "FR18"]
  }
}
```

## Intent

人们应当能够触及并滚动溢出内容，在嵌套区域没有可滚动内容时继续滚动包含它的页面，并理解在他们移动时哪些内容保持固定。构建者不应该被迫独立协调无障碍、粘性定位、越界滚动包含、滚动条呈现以及浏览器特有的溢出行为。

本规格定义一项感知轴的滚动容器能力。共享工具 hook 构成规范的可复用行为表面，使已经拥有合适结构的组件可以直接参与。`ScrollableArea` 把这些 hook 组合成一个便捷组件与参考实现；它并不是通往该行为的唯一路径。

## Non-goals

- 在本草案中选定最终导出的 hook 名称、prop 名称或 TypeScript 拼写；hook 优先的所有权与 `ScrollableArea` 参考组合已由 DEC-1 确定。
- 用 JavaScript 驱动的移动取代浏览器滚动。
- 要求自定义滚动条 DOM，或把每个平台的滚动条样式统一。
- 把任意的 overflow 取值或独立的 `overflow-x` / `overflow-y` 组合纳入公共设计系统词汇。
- 允许内容透过同一视口的非滚动轴可见地绘制；CSS 无法可靠提供这种组合。
- 定义 Sticky 的完整公共 API、层叠模型或视觉处理。
- 自动迁移当前每一处 `overflow: auto` 调用点。
- 改变 Layout 的五槽拓扑或 AppShell 对页面外壳的所有权。

## Terms

- **Viewport（视口）：** 其滚动偏移会移动内容的元素。
- **Content box（内容盒）：** 视口内部一个真实的布局盒，其几何可被观测，而无需要求任意后代参与。
- **Requested axis（被请求轴）：** 所有者打算允许滚动的逻辑轴或若干轴：`inline`、`block` 或 `both`。
- **Effective scroll axis（有效滚动轴）：** 一个被请求的轴，其解析后的计算 overflow 可由用户滚动，且其内容范围超出视口范围的程度大于共享容差。
- **Effective scroll owner（有效滚动所有者）：** 最近的祖先，其有效滚动轴与正在解析的行为相匹配。
- **Scrollbar presenter（滚动条呈现器）：** 表示视口既有滚动状态的原生 CSS 或可选自定义 UI，且不创建另一个视口。

## Requirements

- **FR1 — 滚动意图使用逻辑轴。** 系统必须把滚动意图表示为 `inline`、`block` 或 `both`。书写方向与书写模式决定物理轴。左、右、上、下不得定义共享契约。
- **FR2 — 滚动所有权是显式且局部的。** 参与容器必须确定一个视口及其内容盒。无论该能力是通过独立组件提供，还是集成进既有组件所拥有的元素，后代都必须收到相同的按轴所有者状态。
- **FR3 — 有效滚动需要可滚动的样式与可测量的溢出。** 在读取物理几何之前，先通过视口的计算书写模式解析被请求的逻辑轴。在水平书写模式下，inline 比较 `scrollWidth` 与 `clientWidth`，block 比较 `scrollHeight` 与 `clientHeight`；垂直与侧向书写模式则反转这些物理测量。仅当一个轴解析后的计算 overflow 为 `auto`、`scroll` 或旧式 `overlay` 值，且其内容范围超出视口范围的程度大于共享容差时，该轴才是有效的。初始共享容差为 1 CSS 像素。仅凭 `overflow: auto` 声明或多余几何，不得使容器成为有效所有者。
- **FR4 — 有效状态是轴特定的。** 容器可以在一个、两个或零个被请求轴上有效。可聚焦性、粘性所有权、越界滚动包含、滚动条呈现与边缘状态必须使用适用的轴，而不是一个未加区分的 `hasOverflow` 布尔值。
- **FR5 — 实时测量同时观测视口与内容几何。** 系统必须同时观测视口盒与一个真实的内容布局盒。仅观测视口的 `ResizeObserver` 是不够的，因为内容可能在视口自身盒保持不变的同时增长。`display: contents` 不是有效的内容观测目标，因为它没有可靠的盒几何。
- **FR6 — 既有结构可以充当内容盒。** 已经拥有合适内容根的组件可以直接注册它。可复用行为不得悄悄在任意子元素周围插入包装元素。当实现创建内容包装元素时，它必须记录并验证该包装元素的格式化、尺寸、flex/grid 参与、百分比尺寸以及固有尺寸影响。
- **FR7 — 失效覆盖的不止是元素尺寸变化。** 系统必须在初次连接、视口或内容盒尺寸变化、被请求轴或相关样式变化，以及从不可测量/隐藏转为已渲染之后进行测量。若集成的溢出能在两个被观测盒都未变化的情况下改变，它必须提供显式的失效路径或等价的有界信号。同一帧内的重复失效必须合并为一次测量。
- **FR8 — 不可测量不等于适配。** 已断开、`display: none` 或几何为零的视口不得被当作内容适配的证据。实现可以保留最后一个有效状态，或暴露一个内部未知状态，但必须在视口变得可测量时重新测量。
- **FR9 — 状态更新是稳定的。** 共享观测器仅当有效轴或被请求的边缘信息发生变化时才发布新状态。测量必须收敛，不出现溢出/滚动条反馈循环，包括在原生滚动条占用布局空间的平台上。
- **FR10 — Sticky 按轴针对有效所有权解析。** block-start 或 block-end 的 Sticky 参与方必须使用最近的有效 block 所有者。inline-start 或 inline-end 的参与方必须使用最近的有效 inline 所有者。不溢出的候选，以及仅在其他轴上有效的候选，必须被跳过。流动内容中的任意 Sticky 放置必须仍然可行；固定的 header/footer 槽位不是通用的替代方案。
- **FR11 — 原生 CSS 粘性是有条件的实现细节。** 当浏览器最近的 CSS 滚动容器同时也是系统在被请求轴上的有效所有者时，可以使用原生 `position: sticky`。在 CSS 溢出轴耦合使这些所有者不一致之处，实现不得依赖原生的祖先选择。本规格不选择回退定位机制。
- **FR12 — 键盘访问跟随有效滚动。** 有效滚动内容必须按 WCAG 2.1.1 的要求保持键盘可达。把键盘滚动分配给视口的交付表面，必须仅在至少一个适用轴有效时将其加入 Tab 顺序，并必须提供恰当的角色与无障碍名称。除非视口自身就是一个地标，否则角色为 `group`。名称是拥有该视口的组件的无障碍名称：调用方提供的标签，否则是该组件翻译后的默认值。若视口是页面中其角色唯一的那个地标，例如唯一的 `main`，则可以依赖该角色而不带名称；若视口是其角色众多地标之一，则必须有名称。集成也可以改为依赖一个既有的可聚焦后代，只要该路径能让键盘用户访问全部溢出内容。在共享的 `contentOrViewport` 模式下，被命名视口必须在有效可滚动期间保留 `tabIndex=0`。在正向键盘 Tab 进入时，hook 必须检查一次首个顺序后代，并且只能委托给保留原生滚动按键的原生链接或按钮。它不得跳过被排除的首个目标去触及后面某个合格目标。组合式控件、嵌套滚动所有者、可编辑表面以及拥有导航键的角色必须保留视口停留点。从被委托的首个子元素反向遍历时，必须跳过视口且不产生循环。指针与程序化焦点不得委托。资格必须在每次键盘进入时重新计算，而无需为键盘资格维护持久的子树或祖先观测；既有的几何观测仍由 FR5–FR9 管辖。两条路径都必须保留清晰的无障碍命名，以及对完整滚动范围的原生 Arrow/Page 访问。工具提示是唯一的例外：对视口来说过高的内容会在其内部滚动，且没有键盘路径。在 ARIA tooltip 模式下，工具提示从不获取焦点，其触发元素在显示期间保持焦点；完整内容仍可通过触发元素的无障碍描述提供给辅助技术；冗长或关键的内容应放在 HoverCard 或 Popover 中，它们确实会获取焦点；而另一种做法——把溢出内容留在视口之外——则无人能触及。
- **FR13 — 失去溢出不会移动焦点。** 若已聚焦的视口不再溢出，系统可以将其从未来的顺序导航中移除，但不得仅因几何变化而移动或模糊当前焦点。
- **FR14 — 滚动链接是默认行为。** 当当前区域在被请求方向上没有可移动空间时，嵌套的滚轮、触摸与键盘滚动必须继续传递给祖先。包含策略可以停止链接，但其 `overscroll-behavior` 效果必须仅在当前溢出的轴上生效。这避免了在那些对不溢出的 `overflow: auto` 元素仍然遵行包含的引擎中出现滚动死区。在手指下的触摸呈现中，谁获得拖拽在开始时即一次决定（`spec:AST-094` FR14）。
- **FR15 — 原生滚动条是默认呈现。** 默认呈现器必须保留原生滚动，并在受支持处使用基于标准的 CSS，例如 `scrollbar-width`、`scrollbar-color` 与 `scrollbar-gutter`。不受支持的声明必须回退到平台滚动条，且不改变滚动所有权或访问方式。
- **FR16 — 自定义滚动条是可选的呈现。** 自定义轨道或滑块可以表示既有视口，但不得创建第二个滚动容器、取代原生滚动机制，或维护一个独立的真相来源。它必须使用与视口相同的有效轴、范围、偏移、书写方向与强制颜色状态。在没有等价可见且可操作的替代示能的情况下隐藏原生滚动条，不是通用的默认做法。
- **FR17 — 轴组合是封闭的。** 系统不得暴露 `visible`、`clip`、`hidden`、`auto` 与 `scroll` 的任意配对。当与另一轴上的非 visible 值配对时，CSS 会把 `visible` 计算为 `auto`、把 `clip` 计算为 `hidden`，因此那些表面上的组合并不保留独立轴语义。必须脱离非滚动轴的内容需要单独的结构或一个 Layer。
- **FR18 — 嵌套所有权是确定性的。** 适用轴上最近的有效所有者胜出。正交的嵌套区域可以共存。同轴嵌套必须默认保留链接，并且必须在拥有该行为的组件契约中有意为之，而不是从偶然的溢出样式中产生。
- **FR19 — Table 可以集成而非包裹。** Table 可以在其既有的滚动包装元素上采用该能力，使列尺寸、键盘访问、滚动阴影、粘性列与粘性表头共享一个视口。Table 不得仅为参与该能力而要求单独的公共 ScrollableArea 组件。任意的外部包装元素无法满足 Table 的内部所有权契约，除非 Table 显式接受并协调该所有者。
- **FR20 — 参考组件集成容器几何。** ScrollableArea 必须发布其内容盒实际的逻辑内边距，在未请求内边距时使用零。其视口只能通过显式的 full-bleed 选项来消费继承的内边距；仅凭可滚动性不得突破父容器。
- **FR21 — 适配的滚动意图不意味着 Sticky 包含。** 被请求轴没有多余几何的参与视口必须在两个物理轴上使用 `clip`。这样能在不创建 CSS 滚动容器的情况下防止测量前的绘制溢出，因此原生 Sticky 后代可以解析到外部的有效所有者。当内容超出视口时，视口必须在该轴成为有效所有者之前切换到其被请求的 `auto`/`hidden` 配对。公共的 `stickyContainment="always"` 选项可以在适配期间保留该边界，但包含必须是显式的，而不是滚动意图的附带结果。

### Delivery requirements

- **IR1 — 共享 hook 是行为的核心。** 共享工具 hook 必须拥有有效轴测量、观测、失效与所有者发布。`ScrollableArea` 与组件集成形式必须消费该核心，而不是创建并行的检测器。
- **IR2 — 行为不依赖 `ScrollableArea`。** 已经拥有视口与内容根的组件必须能够在不添加便捷组件、也不改变其语义外层元素的情况下采用这些 hook。
- **IR3 — `ScrollableArea` 是参考组合。** 该组件拥有并记录其视口/内容结构，应用共享的无障碍、链接、粘性所有者与滚动条呈现规则，并演示另一个拥有结构的组件如何集成这些 hook。它不得包含直接采用 hook 者无法获得的行为。
- **IR4 — 结构与 prop 组合保持显式。** hook 必须通过 prop getter 或等价的组合契约，接受调用方拥有的视口/内容 prop 与 ref。它必须组合 ref、事件处理器、class/style 输入与 ARIA，且不让展开顺序决定是丢失调用方还是丢失行为。组件拥有的无障碍与不可取消行为在已记录的冲突中胜出；可取消的处理器使用共享事件契约。该 hook 不会假装结构是不必要的，也不会悄悄包裹任意子元素。
- **IR5 — 公共 API 遵循意图。** 未来的 hook 与组件名称暴露语义化的滚动、链接、无障碍或呈现意图。原始 CSS 取值、观测器控制、容差旋钮与浏览器变通方案保持内部，除非另有准入决策证明调用方所有权。

### Candidate shared hook boundary

确切的名称与 TypeScript 拼写仍属 API 评审工作。候选边界如下：

```ts
type ScrollAxis = 'inline' | 'block' | 'both';

type KeyboardAccess =
  | {owner: 'content'}
  | {owner: 'viewport'; label: string; role?: 'group' | 'region'}
  | {
      owner: 'contentOrViewport';
      label: string;
      role?: 'group' | 'region';
    };

interface ScrollAxisState {
  isScrollable: boolean;
  atStart: boolean;
  atEnd: boolean;
}

interface UseScrollableAreaOptions {
  axis: ScrollAxis;
  keyboardAccess: KeyboardAccess;
  overscroll?: 'allow' | 'contain';
  stickyContainment?: 'whenScrollable' | 'always';
}

type ElementProps<E extends HTMLElement> = BaseProps<E> &
  React.RefAttributes<E>;

interface UseScrollableAreaResult {
  getViewportProps<E extends HTMLElement>(
    props: ElementProps<E>,
  ): ElementProps<E>;
  getContentProps<E extends HTMLElement>(
    props: ElementProps<E>,
  ): ElementProps<E>;
  state: {
    inline: ScrollAxisState;
    block: ScrollAxisState;
  };
}
```

每个 prop getter 接收采用方已经解析好的元素 prop 与公共 ref，通过共享的 prop/ref 工具把它们与 hook 的行为组合，并返回一个安全的展开对象。`getViewportProps` 消费调用方的 `xstyle`，并添加行为拥有的适配 clip、轴特定的活动溢出、显式 Sticky 包含、键盘、ARIA、事件、data-state、越界滚动与注册行为，但不选择视口尺寸或滚动条呈现。`getContentProps` 把内容观测与既有的内容 ref 和 prop 组合。无论是松散的 prop 包还是单独的 callback ref，都不会让展开顺序成为契约的一部分。

原生滚动条的宽度、颜色与边槽仍作为视口上的 CSS，而不是 hook 选项。可选的自定义呈现器与滚动阴影通过更窄的订阅消费同一套已注册度量，使普通所有者不会因每一个滚动偏移而重新渲染。Sticky 在已注册的 DOM 祖先链上使用私有的最近所有者消费者；采用方无需渲染 Provider。

显式的失效方法保持内部，除非真实采用方证明存在一种溢出变化，既不能被观测盒也不能被有界的平台信号检测到。

### Behavioral matrix

| 被请求轴 | inline 有效 | block 有效 | 有效所有者状态     | Sticky 所有权                               |
| -------- | ----------- | ---------- | ------------------ | ------------------------------------------- |
| `inline` | 否          | 不适用     | 无                 | 无 inline 所有者；block Sticky 跳过该候选   |
| `inline` | 是          | 不适用     | inline             | inline Sticky 在此解析；block Sticky 跳过它 |
| `block`  | 不适用      | 否         | 无                 | 无 block 所有者；inline Sticky 跳过该候选   |
| `block`  | 不适用      | 是         | block              | block Sticky 在此解析；inline Sticky 跳过它 |
| `both`   | 是/否       | 是/否      | 每个有效轴各自独立 | 每条 Sticky 边缘仅在其匹配的有效轴上解析    |

由于溢出计算值的耦合，浏览器仍可能把一个视口在两个物理轴上都归类为 CSS 滚动容器。这一平台事实并不改变本表中系统的所有者状态。

### Scrollbar presentation matrix

| 呈现      | 滚动机制                 | 渲染规则                                                 | 必需的回落                                      |
| --------- | ------------------------ | -------------------------------------------------------- | ----------------------------------------------- |
| 原生/默认 | 由浏览器在视口上拥有     | 平台滚动条；基于标准的宽度、颜色与边槽样式可对其加以修饰 | 忽略不受支持的样式并保留原生行为                |
| 原生/隐藏 | 由浏览器在视口上拥有     | 仅当另一处清晰的示能与键盘路径能暴露该溢出时才允许       | 在强制颜色下或替代品不可用时恢复原生呈现        |
| 自定义    | 由浏览器在同一视口上拥有 | 轨道/滑块镜像有效轴与实时偏移                            | 原生滚动、触摸、滚轮、键盘与程序化 API 仍为权威 |

### Platform support

- 基线实现必须使用 `ResizeObserver` 与 DOM 滚动几何，在 Astryx Core 支持的每个浏览器中工作。CSS 滚动状态查询是未来的优化，而不是唯一的实现，因为在本提案提出时，`scroll-state(scrollable: ...)` 在 Firefox 与 Safari 中仍不可用。
- `scrollbar-width`、`scrollbar-color` 与 `scrollbar-gutter` 处于 Astryx 的浏览器兼容窗口之内，构成受支持的原生呈现表面。强制颜色与平台滚动条偏好优先于装饰性匹配；不受支持或被忽略的取值仍降级为平台滚动条，且不改变所有权或访问方式。
- 浏览器证据必须覆盖 Chromium、Firefox 与真实的 Safari。它必须包含可用的经典与覆盖式滚动条、LTR 与 RTL、缩放、书写模式变化、隐藏到可见的过渡、异步内容、嵌套的正交与同轴区域，以及聚焦期间的有效状态变化。
- Chromium 证据必须覆盖两个对回归敏感的交互：Chrome 144 的[越界滚动行为变更](https://chromestatus.com/feature/5129635997941760)之后，对不溢出候选的包含行为；以及涉及被变换/透视祖先与经裁剪的圆角后代的命中测试，由 [Chromium issue 456164629](https://issues.chromium.org/issues/456164629) 表示。

## Current-state impact

- `family:layout-regions` 目前把滚动定义为显式且局部的：LayoutContent 与 LayoutPanel 拥有 `isScrollable`；Layout 的 `height="fill"` 包含区域滚动，而 `height="auto"` 让页面增长。新能力保留这些所有者，但区分被请求的滚动与有效的按轴滚动。
- LayoutContent 与 LayoutPanel 目前把同一个根元素同时用作地标、主题化表面、带内边距的内容盒与急切设置 `overflow: auto` 的视口。它们不暴露内部内容根。因此直接采用 hook 需要 Layout 就其内部被观测盒及其内边距/full-bleed 语义做出显式决策；通用 hook 不得悄悄插入那个包装元素。
- `family:layout-primitives` 目前让 Stack 与 StackItem 暴露组件特定的 `overflow: auto`；Grid 与 Center 不继承该行为。本提案不会自动为每个布局原语添加滚动。
- Popover 已经把内部滚动建立在测量到的溢出之上，并合并打开状态的观测。DropdownMenu 有单独的 block 轴辅助工具。Carousel 有单独的 inline 轴辅助工具。这些是这一共享需求的证据，而不是三套可接受的长期定义。
- Table、CodeBlock、Carousel 以及一些示例无条件地让滚动包装元素可键盘聚焦。采用时必须审查每个包装元素是始终预期溢出，还是应当遵循有效状态。
- Outline 已经通过组合计算 overflow 与实时几何来识别最近的有效 block 滚动祖先，但它执行的是时点查找，而不是发布可复用的实时所有者。

## Prior-art comparison

| 系统                              | 做对的地方                                                               | 对本提案的边界                                                                        |
| --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 原生 CSS overflow                 | 浏览器拥有滚动、输入、动量与原生滚动条无障碍                             | 轴的计算值相互耦合；原生 Sticky 会选择某个 CSS 滚动祖先，即使这与按轴的有效所有权冲突 |
| axe `scrollable-region-focusable` | 要求在测试键盘访问之前同时具备可测量的溢出与可滚动的计算 overflow 值     | 快照审计，而不是实时观测器或所有者注册表                                              |
| Radix ScrollArea                  | 拥有视口与真实内容盒，观测二者，并按轴分别推导溢出                       | 主要是自定义滚动条组件；未定义共享的 Sticky、越界滚动或有条件焦点策略                 |
| Zag Scroll Area                   | 拥有视口/内容结构，跟踪各轴、偏移、边缘以及尺寸变化驱动的滑块状态        | 状态机组件机制比 Astryx 最小可复用能力更宽泛                                          |
| Astryx 当前辅助工具               | Popover、menu、Carousel、Table 粘性列与 Outline 各自证明了该模型的一部分 | 轴/容差/失效行为重复，且没有共享的有效所有者上下文                                    |

有代表性的公开证据：

- [axe 有效滚动检测](https://github.com/dequelabs/axe-core/blob/4d306cbb7c456849c6f964444a6a7174d2be502a/lib/core/utils/get-scroll.js)
- [Radix 视口/内容结构](https://github.com/radix-ui/primitives/blob/f7ecd5ab16f5e1e820eb5786a1419a98a2d594ae/packages/react/scroll-area/src/scroll-area.tsx#L149-L311)
- [Radix 按轴溢出观测](https://github.com/radix-ui/primitives/blob/f7ecd5ab16f5e1e820eb5786a1419a98a2d594ae/packages/react/scroll-area/src/scroll-area.tsx#L481-L512)
- [Zag 视口/内容尺寸变化跟踪](https://github.com/chakra-ui/zag/blob/a40f3f34a2d8a7899885d20fda112e26a91ae50c/packages/machines/scroll-area/src/scroll-area.machine.ts#L460-L482)
- [CSS overflow 计算值耦合](https://drafts.csswg.org/css-overflow-3/#overflow-properties)
- [CSS 滚动状态查询](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Conditional_rules/Container_scroll-state_queries)
- [原生滚动条宽度](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-width)、[颜色](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color) 与 [边槽](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter)

## Verification

| 契约             | 验证方式                               | 代表性状态                                                                                                                                             | 变异或失败预期                                                                                   |
| ---------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| FR1–FR4          | 单元几何与计算样式测试，加上浏览器矩阵 | inline、block、both；适配、恰好适配、>1px 溢出；可滚动与不可滚动的计算值；水平、垂直与侧向书写模式；LTR 与 RTL                                         | 仅凭声明或多余几何就成为所有者，漏掉某个有效轴，或物理方向泄漏进契约                             |
| FR5–FR9          | 观测器生命周期与集成测试               | 视口尺寸变化、内容尺寸变化、异步资源、隐藏/显示、重新连接、经典滚动条                                                                                  | 状态保持陈旧、在不可测量时报称适配、出现循环，或发布冗余更新                                     |
| FR10, FR11, FR18 | 真实浏览器嵌套 Sticky 矩阵             | 任意流动位置；每条逻辑边缘；正交与同轴所有者；未激活的内层候选                                                                                         | Sticky 绑定到非有效或跨轴所有者、无法出现在流动中段，或对着错误的边界堆叠                        |
| FR12, FR13       | 键盘与无障碍树测试                     | 适配/溢出、被命名视口、原生链接/按钮委托、被排除的角色、嵌套所有者、正向/反向进入、指针/程序化焦点、动态资格、Chromium/WebKit 中完整的 Arrow/Page 范围 | 内容不可达、适配区域添加了无法解释的停留点、既有路径出现重复停留点、缺少命名，或焦点在变化时移动 |
| FR12 naming      | 无障碍树测试                           | 由所有者命名的 `group` 视口，分别来自调用方标签与翻译后的默认值；作为视口的页面唯一 `main` 地标，依赖其角色；作为视口的第二个 `main` 地标              | 非地标视口不是由其所有者命名的 `group`，或第二个 `main` 视口没有名称却通过了                     |
| FR14             | 滚轮/触摸/键盘链接浏览器测试           | 适配子项、活动子项、每条边缘、包含与链接                                                                                                               | 适配子项产生滚轮死区，或显式包含泄漏到未激活的轴                                                 |
| FR15, FR16       | 原生/自定义呈现与强制颜色测试          | 覆盖式/经典、细/默认、稳定边槽、隐藏/替代、自定义滑块                                                                                                  | 呈现创建了第二个所有者、遮蔽状态、丢失平台回退，或改变滚动机制                                   |
| FR17             | 类型/API 测试与浏览器测试夹具          | 被请求的 inline、block、both；尝试在相反轴上使用 visible                                                                                               | 公共 API 允许了平台会计算为不同语义的 CSS 组合                                                   |
| FR19             | Table 浏览器集成                       | 仅 inline、有界的双轴、粘性列、粘性表头、交叉单元格                                                                                                    | Table 插件观测到不同的所有者，或外部包装元素悄悄破坏粘性/无障碍行为                              |
| FR20             | ScrollableArea 组件与容器内边距测试    | 零/默认内边距、统一/按边覆盖、嵌套 bleed 使用方、受限与 full-bleed 视口                                                                                | 内容发布陈旧的内边距、嵌套 bleed 子元素补偿错误，或滚动在无显式意图时逃逸父级                    |
| FR21             | 真实浏览器适配/溢出 Sticky 过渡        | 适配默认、适配 `always`、内容增长、内容收缩、外部 block Sticky 所有者                                                                                  | 适配的默认视口悄悄捕获 Sticky、显式包含丢失，或溢出增长未能激活滚动                              |

## Decision log

### DEC-1 — Shared hooks own behavior; ScrollableArea is the reference composition

**引用：** `spec:AST-025/DEC-1`

**决策者：** `cixzhang`, `2026-09-11`

共享工具 hook 是有效轴测量、观测、失效与滚动所有者发布的规范所有者。拥有既有视口/内容结构的组件直接采用这些 hook。`ScrollableArea` 把同样的 hook 组合成一个便捷组件，并演示完整的默认组合；没有任何行为只能通过该组件获得。

这使滚动行为可复用，而不强迫 Layout 区域或 Table 这类拥有结构的组件经过一个以行为命名的包装元素。当构建者确实希望由系统拥有所需结构时，它也给出完整的默认方案。

已否决：把 `ScrollableArea` 作为唯一入口，因为那会要求额外的包装元素，并把一个行为组件变成组件特定结构的所有者。

### DEC-2 — ScrollableArea is an explicit container-padding participant

**引用：** `spec:AST-025/DEC-2`

**决策者：** `cixzhang`, `2026-09-11`

参考组件发布其内容盒的逻辑内边距，默认为零，使嵌套的 bleed 使用方收到实际应用的几何。视口 bleed 保持显式，而不是变为可滚动的副作用。这使 ScrollableArea 与共享容器系统对齐，而不让行为 hook 拥有内边距或布局。

已否决：自动逃逸父级内边距，因为添加滚动不得悄悄加宽容器的视觉边界。

### DEC-3 — Fitting scroll intent does not silently contain Sticky

**引用：** `spec:AST-025/DEC-3`

**决策者：** `cixzhang`, `2026-09-12`

共享 hook 在两个物理轴上应用 `clip`，直到被请求的内容超出其几何。这样能在不创建 CSS 滚动容器的情况下避免测量前的绘制溢出，因此适配区域不会悄悄拦截来自外部所有者的原生 Sticky。仅由几何决定的溢出状态会在测量有效所有权之前激活按书写模式解析的 `auto`/`hidden` 配对。

`stickyContainment="always"` 是面向那些刻意希望适配视口保持为 Sticky 边界的使用方的显式选择加入项。其 camelCase 枚举遵循公共 API 约定。

已否决：为每个被请求视口保留 `auto`/`hidden`，因为仅凭滚动意图就会改变 Sticky 行为，即使根本无法发生滚动。

已否决：适配期间不声明 overflow，因为内容可能在首次几何测量之前闪烁。

### DEC-4 — Shared automatic keyboard ownership delegates at entry

**引用：** `spec:AST-025/DEC-4`

**决策者：** `cixzhang`, `2026-09-13`

`keyboardAccess.owner="contentOrViewport"` 在一个共享 hook 中拥有自动键盘路径。组件不维护并行的可聚焦性检测器。最初的持续资格方案被聚焦时委托取代：溢出的视口仍是一个有名称的停留点，正向 Tab 进入会检查首个顺序后代。保守的委托集合是组合式控件、可编辑表面与嵌套滚动所有者之外的原生链接与按钮。正的 tabindex 顺序与未经证实的交互角色保留视口。

原生反向遍历在从被委托的首个子元素返回时会跳过视口。指针/程序化焦点停留在视口上。内容变化从不移动既有焦点；资格在下一次键盘进入时再次检查。原生滚动仍然负责 Arrow/Page 键与滚动链接。

已否决：在子树与祖先变更之后进行持续的键盘资格扫描，因为共享基础设施不应在空闲时承担该成本。几何观测保持独立。同样已否决：越过被排除的首个后代继续转发，因为那会改变使用方的顺序焦点顺序。

## Open questions

- **OQ1 — Layout 的 `isScrollable` 迁移如何被观测与排序？**（`human-api`）LayoutContent 与 LayoutPanel 会把其既有的 `isScrollable` 路径迁移到共享的受管行为。由于 `isScrollable` 默认为 true，实现必须在共享 hook 与 `ScrollableArea` 之上作为单独变更落地。先做原型并比较两种方案：单元素混合观测（视口加上直接子元素尺寸变化、子树变更、资源/字体、过渡与显式失效信号）与内部被观测内容盒。在取代当前行为之前，两条路径都需要针对异步与纯 CSS 几何变化、直接子元素选择器、flex/grid 子元素、百分比尺寸、full bleed、容器内边距与 ref 的兼容性证据。
