---
schema_version: 1
template_version: 1
kind: architecture
id: architecture:component-style-authoring
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-24
owners: [cixzhang]
applies_to: [packages/core/src/, packages/lab/src/]
verified_by:
  [
    internal/stylex-capabilities/scan.mjs,
    packages/core/src/theme/dynamicType.test.ts,
    packages/core/src/theme/Theme.test.tsx,
    internal/eslint-plugin-astryx/no-border-shorthand.test.mjs,
    internal/eslint-plugin-astryx/no-stylex-null-override.test.mjs,
    internal/eslint-plugin-astryx/no-style-only-wrapper.test.mjs,
  ]
deciding_specs:
  [
    spec:AST-080/DEC-4,
    spec:AST-080/DEC-5,
    spec:AST-017/DEC-26,
    spec:AST-017/DEC-29,
  ]
---

# Component style authoring architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "styling": ["INV1", "INV2", "INV3", "INV4", "INV5", "INV6", "INV7"]
  }
}
```

## Purpose

Astryx 组件样式应降级为有效、可维护的 CSS，能以可预测的方式与受支持的消费方样式组合，将关系状态限制在预期组件范围内，并避免没有运行时职责的 DOM 包装器。

本记录拥有七个组件级编写结果。它不重新定义语义 token、公开主题目标、可扩展 prop 轴、公开样式 props、图标解析、双向性或 React Server Component 边界。

## System model

组件拥有的样式始于 Core 或 Lab 组件源码，并通过仓库维护的 StyleX 管道降级。作者在三种工作之间选择：

1. **CSS 可解决的呈现。** 浏览器可以从 CSS 派生视觉状态、关系、响应式条件、回退或过渡。
2. **行为状态。** JavaScript 拥有 CSS 无法派生的信息或交互。组件只向 StyleX 暴露结果样式输入。
3. **有职责的结构。** DOM 元素存在是因为它拥有语义、行为、ref、格式化上下文或子元素边框盒之外的间距——而不仅仅是为了转移样式。

固定的 StyleX 能力注册表决定维护管道当前支持哪些语法和辅助函数。能力条目和 lint 匹配器是版本化的执行事实，不是永久的架构词汇。只有当注册表记录的 StyleX 版本与审计修订版安装的包匹配时，依赖能力的评审才可测试。不匹配是不可测试的，不是符合或违反的证据。

## Boundaries and invariants

- **INV1 — 组件本地样式通过 StyleX 降级。** 已发布的、组件拥有的样式声明使用仓库维护的 StyleX 降级路径。单独拥有的全局 CSS、主题编译器输出和消费方编写的样式保留在各自命名的所有者处，不在此不变量范围内。当维护的 StyleX 路径支持相同结果时，组件本地原始 CSS 仍在范围内。
- **INV2 — CSS 拥有 CSS 可解决的呈现。** 当固定的浏览器和 StyleX 能力集可以在 CSS 中派生视觉状态、关系、响应式条件、回退或过渡时，组件代码不得用 React 状态、Effect、观察器或动画帧记账来重建该呈现。JavaScript 仍适用于 CSS 无法派生的行为或信息。
- **INV3 — 声明保持有效且可静态组合。** 受支持的组件 StyleX 输入降级为有效、可维护的 CSS，并保持独立的属性组合，而不需要运行时属性移除或属性键去重语义。确切的简写、重置和 null 模式是版本化工具规则，而不是永久的架构词汇。
- **INV4 — 关系状态限定在组件范围。** 祖先、后代和兄弟样式仅对预期的组件拥有关系作出反应。来自无关外部容器的状态不得激活内部组件的视觉状态。作用域标记是当前机制，不是永久的契约措辞。
- **INV5 — 每个包装器都有命名职责。** 包装器只在以下情况下存在：它拥有语义角色、行为或 ref、子元素在不改变其契约的情况下无法吸收的格式化上下文，或子元素边框盒之外的间距。仅将样式转移到单个子元素的包装器在该子元素拥有兼容的可承载样式的 DOM 表面时可以移除。当子元素没有兼容表面时，包装器可以改为拥有该边界。仅源码清晰性不是规范性职责。
- **INV6 — 报告组件大小，并为仅触摸成本做预算。** 每个更改组件代码或样式的拉取请求都要报告基线对比头部的 gzip 大小：每个变更组件的导入所拉入的 JavaScript（包括其传递模块），以及该组件在其包样式表中的 gzip CSS 增量（`spec:AST-080` FR8）。仅在粗指针上运行并向一个组件添加超过 2 KB gzip JavaScript 或 1 KB gzip CSS 的功能会被标记。其拉取请求要么从共享内部触摸模块（`architecture:react-component-runtime` INV13）获取该 JavaScript——页面无论多少组件使用它们都只承载一次——要么证明成本合理。被标记的组件如果延迟加载由交互揭示的表面（`architecture:component-import-boundaries` INV1），则只计算其急切 JavaScript。对于被标记的 CSS，其拉取请求需证明成本合理，因为该 CSS 保留在包样式表中（`spec:AST-080` FR1、FR8）。大小是在默认压缩级别下的 gzip，1 KB 是 1,024 字节；按照 `spec:AST-080` FR8 测量 CSS 的方式，组件的 JavaScript 大小是一个 bundle 的 gzip 大小，该 bundle 包含其导入以及该导入到达的每个模块。共享 JavaScript 值表（例如手势或弹簧调优表）只向组件发送该组件使用的行：导入一个组件不会拉入只有其他组件读取的行。该规则仅涵盖调优表：StyleX 变量组遵循 `spec:AST-066` FR3，消息目录遵循 `architecture:internationalization` INV15。

- **INV7 — 组件由最小 DOM 构建。** 每个组件在静止和打开状态下，为其拥有的每个语义或交互角色渲染一个元素，为当前主题目标绘制的每个可主题化部件渲染一个元素（`architecture:component-theming-surface` INV4），并且仅在 INV5 命名其职责处使用包装器：语义角色（包括 ARIA 需求）、行为或 ref、格式化上下文、外部间距，或子元素无法承载的可承载样式的边界。状态和变体通过那些元素上的属性、类和样式表达，绝不通过额外元素。伪元素承载没有语义角色的装饰，绝不重复内容。内容只渲染一次：没有用于测量或预留空间的隐藏双胞胎，因为 CSS 可以在显示它的元素上调整大小并预留（INV2）。主题运行时可以在每个文档中拥有一个共享的、空的、aria-hidden 探测元素，位于每个组件 DOM 之外，仅用于读取平台文本大小；它不渲染内容，不是主题化目标，并随最后一个根 Theme 移除。一个层只挂载一个呈现。唯一的第二份副本是退出期间、呈现切换、从触发器提升（`architecture:layer-runtime` INV15）或工作表之间的交接（例如 `design:reduced-motion` DR2 要求的交叉淡入淡出；AppShell 在侧边导航折叠或展开期间的旧内容包裹（`component:AppShell` FR17）；SideNav 轨道在折叠或展开期间的旧状态（`component:SideNav` FR6）；或可重排条目被拖动时的一个移动预览（`design:ordered-collection-reordering`））中的一份瞬态副本；它由 Core 为其种类提供的一个机制创建，而不是由每个组件各自创建，并在过渡结束后 1 秒内移除。在该共享机制存在之前，层自身的退出、呈现切换或交接副本，或可重排集合自身的拖动预览，是已记录的符合性缺口，而不是例外。组件的变更优先移除或合并节点；任何添加的元素都要用变更前后的测量元素数量对照本不变量证明。由此产生两个预算：
  - **静止状态下的表面组件** — Button、IconButton、ToggleButton、Item 和其他列表行、SegmentedControl、Switch、Badge、文本和其他输入、CheckboxInput 以及单选控件：在任何指针下，除其角色、可主题化部件和 INV5 命名的包装器之外没有元素，也没有重复内容。特定指针的呈现是对相同元素的属性和样式的变更；伪元素仅作为装饰替代元素。
  - **打开状态下的层** — Popover、BottomSheet、DropdownMenu、ContextMenu、Lightbox 和 Dialog：挂载一个呈现，除上述瞬态副本外没有内容挂载两次，粗指针下的打开层元素数量最多与细指针下相同（超出部分仅按打开层允许量 `spec:AST-017` FR60 和 DEC-29 设定）。

  好：当分段控件的选中标签变粗时，该标签元素上的 CSS 保持分段宽度；Popover 只挂载其表面一次，并通过样式更改放置和呈现。坏：保留标签的隐藏第二份副本以预留其宽度；工作表和弹出层都挂载，其中一个隐藏；仅为了携带触摸样式而添加包装器。

  组件只能通过其拉取请求声明的例外超出预算，并说明为什么现有元素无法完成工作以及变更前后的测量元素数量。每个例外都作为其自己的所有者决策记录在组件当前记录中；当组件没有当前记录时，记录在本记录中；无论哪种方式都通过规范所有者批准门槛，且不会被静默接受。元素计数是组件故事在静止和打开状态下、在细指针和粗指针下的 `document.body.querySelectorAll('*').length`。

## Authoring guidance

以下指导有助于满足不变量，但不独立创建永久 API 或兼容性要求：

- 在添加原始 CSS 或 JavaScript 变通方案之前，检查 `internal/stylex-capabilities/CAPABILITIES.md`。优先使用受支持的 CSS 原生机制。
- 对方向敏感的样式使用逻辑属性和值。规范的双向性所有者决定例外和可观察的 RTL 行为。
- 使用当前 StyleX 版本和仓库 lint 规则接受的形式中的长写属性、回退和显式重置值。那些确切的接受形式可能在不改变 INV3 的情况下演变。
- 在交互所有者下，按悬停能力保护仅悬停的视觉增强，同时保留可操作的键盘、点击和触摸路径。
- 当不存在语义主题角色且值是命名的组件设计决策时，组件本地几何可以使用字面量。主题 token 权威决定可复用的语义角色是否应属于可移植 token 词汇表。
- 组合到宿主中的次要渲染路径可以依赖该宿主的结构和样式。INV5 适用于该路径的 DOM 所有者，而不是要求每个分支看起来像组件的默认渲染。

指导偏差只有在破坏上述不变量或其他当前所有者时才成为架构违规。

## Delegated authority

本记录不吸收相邻的审计规则：

- **图标和内联 SVG。** `architecture:icon-resolution-and-component-slots` 和 Icon 组件契约拥有语义字形解析。当内联 SVG 重新实现属于共享注册表的字形时，它是缺陷；当组件拥有语义和无障碍时，组件拥有的非字形矢量形状仍然允许。图标范围和全局/主题解析变更保留在图标和主题编写所有者处。
- **Token 和字面量。** `architecture:theme-tokens` 拥有可移植语义值。本记录不建立通用字面量允许列表。
- **目标、解剖结构和可扩展轴。** `architecture:component-theming-surface` 拥有目标准入、绘制解剖结构、继承/委托、反扩散、保证属性以及哪些视觉轴可以主题可扩展。
- **公开样式和 DOM 契约。** `architecture:public-component-api` 拥有 `BaseProps`、`xstyle`、`className`、`style`、ref 可达性，以及无根、拥有 SVG、提供者、覆盖层或其他非 DOM 拥有组件的例外。
- **双向性。** 单独的当前 RTL/方向性所有者必须定义通用逻辑方向结果。物理属性 lint 和辅助语法是执行证据，不是本记录提供的权威。
- **React 模块边界。** 单独的当前 RSC/模块边界所有者必须定义客户端入口点、指令放置、混合/服务器安全 barrel、构建输出保留和 RSC 可用导出。本记录不把 `'use client'` 放置变成样式策略。公开导入急切到达哪些模块，包括交互揭示的表面和可选能力，属于 `architecture:component-import-boundaries`。

## Audit-row routing

本记录为以下事项提供共享权威：

- **Q6 / T14：** 通过 INV5 的包装器职责和通过 INV7 的最小构建；
- **Q7** 背后的持久可组合性结果，通过 INV3；
- **T8：** 通过 INV1–INV2 的组件本地 StyleX 降级和 CSS 优先于 JS 的所有权；
- **T9** 背后的有效降级结果，通过 INV3；
- **T10：** 通过 INV2 的 CSS 优先于 JS 所有权；以及
- **T11：** 通过 INV4 的关系状态隔离。

其他预期行保留在现有或未来所有者处：

- **Q4 / T17：** 图标架构和 Icon 组件契约；
- **T2b：** 主题 token 架构；字面量示例仍是审计指导；
- **T13：** 未来当前双向性所有者加上 lint 执行；
- **T18：** 图标解析/范围和主题编写规范化；
- **T19：** 组件主题表面轴准入加上公开 API 可达性；
- **T20：** public-component-api 及其 BaseProps 执行；
- **T27：** component-theming-surface；数字目标计数区间仍是审计启发式；以及
- **T30：** 未来当前 RSC/模块边界所有者。

## Change coupling

当组件变更添加或修改以下内容时，触发聚焦的样式编写评审：

- 原始/全局样式表或组件本地非 StyleX 样式路径；
- 仅用于 CSS 可派生呈现的 JavaScript 状态、Effect、观察器或动画帧；
- 固定能力集之外的 StyleX 构造；
- 可能阻止独立消费方属性组合的简写/重置/null 行为；
- 祖先、后代或兄弟视觉状态；
- 围绕一个组件或一个视觉子元素的 DOM 包装器，或任何添加的元素、伪元素或挂载呈现（INV7）；
- 可能代表共享语义字形的组件拥有内联 SVG；或
- 仅在粗指针上运行的代码或样式，或组件读取的共享值表（INV6）。

评审检查此处拥有的不变量，并在给出结论之前遵循上述委托权威。

## Owning code

- `packages/core/src/` 和 `packages/lab/src/` — 组件拥有的 StyleX 声明和渲染结构。
- `internal/stylex-capabilities/` — 版本化的 StyleX 能力事实和扫描。
- `internal/eslint-plugin-astryx/` — 当前编写模式执行；lint 实现本身不定义永久架构。

## Deciding specs

- `spec:AST-080/DEC-4` — 每个拉取请求报告组件 JavaScript 和 CSS 大小；仅触摸的 JavaScript 超过 2 KB 或 CSS 超过 1 KB 会被标记，共享值表只发送组件使用的行（INV6）。
- `spec:AST-080/DEC-5` — 触摸原语来自共享内部触摸模块，或者成本被证明合理；没有组件懒加载自己的触摸原语（INV6）。
- `spec:AST-017/DEC-26` — 组件由最小 DOM 构建，有两个预算和所有者记录的例外路径；减少 DOM 是兼容的（INV7）。

图标、主题 token、组件主题化、公开 API、双向性和 RSC 所有者保留上述委托决策。

## Verification

| 不变量       | 证据                                                                                                                                 | 失败信号                                                                                                                                                                                                                                                                                                                                                         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1         | StyleX 能力扫描加组件源码变异                                                                                                        | 已发布组件样式绕过维护的降级路径且没有另一个命名所有者，包括该路径支持相同结果时的组件本地原始 CSS                                                                                                                                                                                                                                                               |
| INV2         | 等效 CSS/JS 变异夹具和真实浏览器呈现                                                                                                 | JavaScript 重建 CSS 可解决的呈现、闪烁中间状态，或与 CSS 条件不一致                                                                                                                                                                                                                                                                                              |
| INV3         | StyleX 编译夹具和独立消费方属性覆盖变异                                                                                              | 输入降级为无效 CSS，或更改一个受支持属性时无法在不移除另一个属性的情况下组合                                                                                                                                                                                                                                                                                     |
| INV4         | 跨 hover、focus-within、active 和 disabled 状态的嵌套无关所有者浏览器夹具                                                            | 外部组件状态激活内部组件的视觉处理                                                                                                                                                                                                                                                                                                                               |
| INV5         | 默认和宿主组合渲染路径中的包装器变异                                                                                                 | 移除包装器不改变任何语义、行为/ref、格式化上下文、边框外间距或所需可承载样式的 DOM 边界                                                                                                                                                                                                                                                                          |
| INV6         | 对照基线的拉取请求大小报告，带值表导入夹具                                                                                           | 变更组件没有基线对比头部的 gzip JavaScript 或 CSS 数字；每个组件仅触摸功能超过 2 KB gzip JavaScript 或 1 KB gzip CSS 却未被标记；导入组件拉入只有其他组件读取的值表行                                                                                                                                                                                            |
| INV7         | 故事元素计数（`document.body.querySelectorAll('*').length`）在静止和打开状态、细指针和粗指针下，基线对比头部，加上重复内容的渲染检查 | 超出组件角色、可主题化部件和 INV5 包装器的元素，或内容重复或隐藏的双胞胎；状态或变体渲染为额外元素；伪元素重复内容；层在瞬态副本之外挂载两个呈现，内容挂载两次，粗指针下元素多于细指针下（超出 `spec:AST-017` FR60 的允许量），瞬态副本由组件自身创建，或留下超过 1 秒；添加元素没有测量计数，或超出预算没有记录的所有者例外；第二个重排预览，或在放下后留下一个 |
| INV7（探测） | `dynamicType.test.ts` 共享探测、清理和能力门控用例；`Theme.test.tsx` 嵌套 Theme 和无能力用例                                         | 文档中有多个探测；嵌套 Theme 创建探测；最后一个根 Theme 卸载后留下探测；引擎没有 `font: -apple-system-body` 时仍有探测                                                                                                                                                                                                                                           |
| 能力注册表   | 对照已安装 StyleX 包生成注册表                                                                                                       | 记录和安装的 StyleX 版本不同，因此依赖能力的用例不可测试                                                                                                                                                                                                                                                                                                         |
