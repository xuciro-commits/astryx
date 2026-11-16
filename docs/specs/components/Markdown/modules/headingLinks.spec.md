---
schema_version: 3
template_version: 2
kind: module
id: module:Markdown/headingLinks
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-03
owners: [cixzhang]
review_triggers: [public-api, behavior, accessibility, layout]
verified_by:
  [
    packages/core/src/Markdown/plugins/headingLinks.test.tsx,
    packages/core/src/Markdown/plugins/headingLinks.ssr.test.tsx,
    packages/core/src/Markdown/Markdown.public.test.ts,
    packages/core/src/Markdown/plugins/headingLinks.a11y.chromium.spec.ts,
    packages/core/src/Outline/parseOutlineFromMarkdown.test.ts,
    apps/storybook/stories/MarkdownHeadingLinks.stories.tsx,
  ]
parent_component: component:Markdown
references:
  [
    component:Markdown/DEC-2,
    module:Outline/parseOutlineFromMarkdown,
    spec:AST-002/DEC-8,
    spec:AST-036/DEC-11,
  ]
---

# Markdown heading-links module contract

## Contract at a glance

| 领域         | 契约                                                                                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 公共契约     | `createMarkdownHeadingLinks(options?)` 返回一个第一方条目，该条目从 `@astryxdesign/core/Markdown/plugins` 导出。                                                         |
| 行为         | 安装该条目会让每个渲染出的 h1–h6 获得确定且无冲突的 ID，并让每个内置标题获得一个行内尾随的 `#` 复制按钮。                                                                |
| 最终用户影响 | 读者可以复制持久可用的标题 URL 并获得即时确认，而不改变当前 hash、滚动位置或页面；传入的片段 URL 仍以标题 ID 为目标。                                                    |
| 构建者影响   | 构建者显式安装一个条目，并可提供稳定的标题命名空间与安全的 URL 基址。同一条目让派生于 Markdown 的 Outline ID 保持对齐，且仅限根级。                                      |
| 兼容性       | 增量的且默认关闭。没有该模块时，已发布的 Markdown/Outline 标题遍历、ID、DOM、样式以及自定义标题所有权均保持不变。                                                        |
| 审查检查     | 拒绝默认开启的行为、Markdown prop、仅 Outline 的命名空间、运行时 ID、模块本地条目状态、未经验证的仿制品、锚点/伪链接、定制的显现逻辑、强加的自定义结构，或产品化的导航。 |

该表是审查用的投影；下文正文才是权威依据。

## Intent

发布文档的构建者应当能够选择启用可移植、持久可用的标题链接，而不必把产品身份或导航策略变成永久的 Markdown prop。该模块拥有一个完整的第一方组合：身份投影、永久链接复制按钮的渲染、本地化，以及跨表面的证据。

## Compatibility and migration

- 已发布的默认行为保持不变：`yes`
- 兼容类别：增量的且选择性加入
- 迁移决策：`spec:AST-002/DEC-8`
- 现有构建者无需做任何事。希望获得全深度标题身份的构建者创建一个稳定条目，并将其传给 Markdown 以及同一来源的任何 Outline 派生。

## Ownership boundary

**负责**

- `createMarkdownHeadingLinks()` 与 `MarkdownHeadingLinksOptions`。
- 稳定的内部插件名，以及由不透明条目在兼容的 Core 包副本之间携带的、冻结的、带版本且经结构验证的配置。
- NFKC Unicode slug 生成、回退、已生成 ID 的预留、命名空间组合，以及全深度的变换后投影。
- 供 Markdown 与派生于 Markdown 的 Outline 使用的共享 ID、标签、经清理的永久链接基址，以及规范复制 URL。
- 内置的兄弟复制按钮渲染器、`useContainerReveal` 组合、i18n、交互样式、Storybook 示例、SSR 证明与浏览器证据。

**不负责 / 非目标**

- Markdown 的通用插件协议、解析器、变换顺序、默认标题样式，或已发布的、无插件时的根标题投影。
- Outline 的仅根级条目选择、hook API 或记忆化框架。
- 调用方自定义的 `components.heading` DOM、样式、无障碍或永久链接 UI。
- 产品专属的文档身份、版本化、宿主 URL 构造、查看器滚动、回调或路由。

## Public API and concepts

| 概念                           | 封闭取值或状态                               | 含义                                                           | 默认值   | 所有者                         | 稳定性 |
| ------------------------------ | -------------------------------------------- | -------------------------------------------------------------- | -------- | ------------------------------ | ------ |
| `createMarkdownHeadingLinks()` | 一个返回 `MarkdownPluginEntry<never>` 的工厂 | 安装一个可移植的模块条目，可被兼容的 Core 副本识别。           | 无       | `module:Markdown/headingLinks` | 稳定   |
| `headingIdPrefix`              | 字符串或省略                                 | 调用方拥有的稳定命名空间，以 `<prefix>--<slug>` 作为前缀拼接。 | 无前缀   | 调用方                         | 稳定   |
| `permalinkBaseUrl`             | 安全的导航 URL 或省略                        | 调用方拥有的基址，其现有片段会被生成的片段替换。               | 当前文档 | 调用方                         | 稳定   |
| 标题投影                       | 缺失或已安装                                 | 缺失时为已发布的仅根级身份；已安装时为模块拥有的全深度身份。   | 缺失     | 模块                           | 稳定   |
| 内置复制控件                   | 诚实的兄弟 `type="button"`                   | 复制规范 URL 而不导航，并显示 1.5 秒的对勾。                   | 缺失     | 模块                           | 稳定   |
| 自定义标题渲染器               | 调用方替换                                   | 仅接收生成的 ID，并保留完整的输出所有权。                      | 内置     | 调用方                         | 稳定   |

## Behavioral contract

| ID   | 不变式                                                                                                                                                                                                                                                                                                                                                   | 依据                                      |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| FR1  | 工厂与选项类型仅通过服务端安全的 `@astryxdesign/core/Markdown/plugins` 入口点导出。普通的不透明 `MarkdownPluginEntry<never>` 在共享的、经结构验证的 `Symbol.for` 协议信封内部携带冻结且带版本的模块配置，因此兼容的 Core 副本无需模块本地身份或状态即可识别它。                                                                                          | `spec:AST-036` FR1–FR5, DEC-11            |
| FR2  | `headingIdPrefix` 与 `permalinkBaseUrl` 仅接受字符串，并随条目传递。URL 基址使用 Markdown 的导航清理器，拒绝不安全的目标，并替换任何现有片段。使用方仅识别完全兼容的模块配置。合法但模块数据不兼容的通用同名插件保持普通的插件顺序，但不获得标题链接行为；格式错误的通用条目遵循既有的 Markdown/Outline 失败软化路径。直接的无效工厂参数仍可能抛出异常。 | `family:navigation-destinations`          |
| FR3  | 变换之后，每个深度的每个标题按文档顺序参与一次。标签使用规范的扩展文本投影。Slug 使用 NFKC、小写的 Unicode 字母/数字、引号移除、折叠连字符，以及 `section`。                                                                                                                                                                                             | `component:Markdown` FR13, FR16           |
| FR4  | 每个生成的 ID 都被预留。自然数字后缀绝不会与更早生成的 ID 冲突，也不会重新生成它。                                                                                                                                                                                                                                                                       | 模块身份所有权                            |
| FR5  | 省略该模块会保留已发布的根标题 ID、嵌套标题行为、DOM、样式、Outline 结果以及自定义渲染器所有权。                                                                                                                                                                                                                                                         | `component:Markdown` FR12                 |
| FR6  | 把同一条目传给 Markdown 与派生于 Markdown 的 Outline 会共享同一个投影。嵌套标题消耗身份与冲突，而 Outline 继续只选择根标题。                                                                                                                                                                                                                             | `module:Outline/parseOutlineFromMarkdown` |
| FR7  | 内置标题仍是一个语义 h1–h6，并获得一个诚实的兄弟 `type="button"`；自定义标题接收生成的 ID，不被强加任何包装器或控件。                                                                                                                                                                                                                                    | `component:Markdown` FR2–FR3              |
| FR8  | ID 在同步 SSR、水合、多个带命名空间的实例、重排序以及独立渲染之间都是确定的。                                                                                                                                                                                                                                                                            | 模块身份所有权                            |
| FR9  | 公共条目保持服务端安全且可 tree-shake；客户端渲染器保持为 Markdown 私有。产品身份、版本化、滚动、回调、路由以及宿主 URL 构造绝不进入该模块。                                                                                                                                                                                                             | 包导出与副作用约定                        |
| FR10 | 未修改的点击、点按、Enter 或 Space 会复制规范的绝对 URL，而不导航、不滚动、不改动 hash。成功时显示对勾与本地化的礼貌播报，持续 1.5 秒；失败时保持静默。标题行使用规范的 `useContainerReveal`、行高大小的流式布局、稳定的逻辑末端间距、互不重叠的 24px 粗略命中几何，以及一个仅键盘可见的焦点环。                                                         | 模块交互与布局所有权                      |

## Accessibility contract

- **AR1 — 标题语义保持完整。** 内置控件是兄弟元素，因此 h1–h6 的角色/名称不包含 `#`；作者编写的标题链接仍然有效。自定义标题只接收身份。
- **AR2 — 自定义所有权保持完整。** 自定义标题只接收身份，除 ID 之外的全部结构、样式与无障碍仍由其负责。
- **AR3 — 渲染器扩展使用规范的显现原语。** 其复制按钮在精细指针静止时视觉隐藏，但保持挂载、具名、位于无障碍树中，并处于 Tab 顺序内。悬停标题行任意位置，或将键盘焦点移入其中，会立即显示该标记。粗略指针/触摸可见性、减少动效与焦点保护遵循 `useContainerReveal`；模块不得添加并行的媒体查询、标记、令牌或公共显现 API。

## Copy-button reveal extension contract

渲染器扩展在内置标题行（显现所有者）上展开 `useContainerReveal().getContainerProps()`，并在其诚实的兄弟 `type="button"` 上展开 `getContentRevealProps({isLayoutPreserved: true})`。这产生确切的可观察状态：精细指针静止时隐藏；标题行任意部分被悬停时可见；按钮或行内另一后代拥有焦点时可见；无需 `display: none` 或 `visibility` 即可被键盘到达；并且在粗略/触摸输入下，在该 hook 既有的受支持语义范围内可见。流内控件盒具有其相邻标题行的计算块大小，因此它绝不会抬升标题行高或改变换行。位于最终视觉行末端的一个稳定逻辑行内槽位，让标题文本、控件与相邻控件在任一方向上互不重叠；显现以及 `#`/对勾的交换不改变任何行几何或间距。在粗略输入下，交互与焦点几何满足 24px AA 目标最小值，通过可溢出可见的内部几何居中于该行高盒，而不是流中的块大小。该扩展保持不被裁剪，且不会与标题文本、相邻控件或前后行重叠或抢占输入。指针激活不绘制键盘 focus-visible 环；键盘焦点只绘制一个规范的、未被裁剪的 Astryx 环。

未修改的点击、点按、Enter 或 Space 会复制规范的绝对永久链接，且绝不导航、滚动或改动当前 hash。标题 ID 仍是传入片段的目标。成功时把 `#` 换成 Astryx 的对勾图标 1.5 秒，并通过规范的礼貌实时区域播报一次本地化的 `Link copied`；失败时保持静默并让 `#` 保持不变。修改的/非主指针激活不会复制，按钮也不暴露锚点、在新标签页打开或链接上下文菜单语义。自定义标题仍在此渲染器契约之外。

## Design relationships

| 状态            | 设计要求                                                               | 表示权威            | 模块契约       |
| --------------- | ---------------------------------------------------------------------- | ------------------- | -------------- |
| 内置标题        | 在添加投影 ID 与兄弟复制控件的同时保留语义 h1–h6 内容。                | 当前源码与 Markdown | FR5, FR7, FR10 |
| 复制控件        | 在标题行盒中对齐 `#`/对勾；按规范显现，并且只扩展到 24px AA 命中下限。 | Button 与模块契约   | FR10           |
| 自定义标题      | 转发投影 ID，不包装、不添加兄弟呈现。                                  | 调用方              | FR7            |
| 无插件 Markdown | 逐字节保留已发布的仅根级身份与嵌套标题行为。                           | 当前源码与 Markdown | FR5            |

该模块不添加 Markdown 本地主题目标。按钮使用 Button 的现有目标；该行是私有布局。

## Parent and system relationships

- `component:Markdown` 拥有通用插件接缝、变换后的树、内置标题部件、默认的无插件投影，以及自定义渲染器替换接缝。
- `module:Outline/parseOutlineFromMarkdown` 拥有仅根级条目选择，并且仅在同一条目已安装时使用该模块的投影。
- `spec:AST-036` 拥有不透明插件协议；该第一方模块使用它，而不需要特权的公共能力。
- `spec:AST-002/DEC-8` 接纳该工厂而非宽泛的 Markdown prop，因为安装、命名空间与 URL 基址是 Astryx 无法推导的调用方决策。
- `family:navigation-destinations` 拥有 URL 接受/拦截策略；该模块拥有对可选基址的清理，以及复制规范 URL。

## Implementation plan and boundaries

1. 将服务端安全的工厂与身份投影保留在 `plugins/headingLinks.ts` 中；在共享的可移植插件信封内携带归一化的模块配置，并仅从 `plugins/index.ts` 导出工厂与选项类型。
2. 将渲染与 StyleX 私有保留在 `plugins/` 下；Markdown 的内置标题路径仅在投影提供规范 URL 时调用渲染器。默认与自定义渲染器路径保持不变。
3. 将模块测试、SSR 证明、Storybook 与 Playwright 证据保留在模块内；将通用/无插件测试保留在 Markdown 中，将根级选择保留在 Outline 中。

## Verification map

| 契约     | 验证                                                                                 | 代表性状态                                                                                    | 失败预期                                                                          |
| -------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| FR1–FR4  | 模块测试、公共 API 测试、类型检查、导出/包检查                                       | 公共入口/选项、重复副本、无效条目/URL、h1–h6、Unicode、后缀冲突                               | 导出漂移、选项丢失、错误识别、不安全 URL、不稳定的 slug 或重复 ID 即失败。        |
| FR5–FR7  | 模块测试加上 Markdown 与 Outline 集成测试                                            | 省略/已安装插件、根级/嵌套、诚实的兄弟按钮、自定义标题                                        | 默认行为改变、自定义输出被包装、控件伪造链接语义或 ID 分歧即失败。                |
| FR8–FR10 | SSR 测试、Storybook 与 `plugins/headingLinks.a11y.chromium.spec.ts`                  | 水合、复制/失败/计时器、无位置改动、静止/悬停/焦点/触摸、行高行、24px 目标、RTL/缩放/强制颜色 | 水合回退、反馈说谎/位移、布局增长、目标重叠、指针绘制键盘环或显现语义漂移即失败。 |
| 仓库     | 格式化、ESLint、知识/同步、i18n、Changeset 校验、core 类型检查、聚焦测试、pre-commit | 模块文件、语言环境目录、Markdown/Outline 接缝、docs/specs、Storybook、workflow                | 权威过期、未翻译的漂移、重复所有权、类型/lint 失败或无关 diff 阻断即失败。        |

## Decision log

### DEC-1 — Ship one first-party plugin factory

**引用：** `module:Markdown/headingLinks/DEC-1`

**决策者：** `cixzhang`、`2026-10-03`

一个工厂在保留不透明插件列表的同时，只暴露安装、可选的稳定命名空间与可选的安全 URL 基址。其配置搭载既有的可移植、带版本的插件信封，而不是创建模块的 WeakMap 或对象身份，因此重复的兼容 Core 副本能够达成一致。宽泛的 Markdown prop 或单独的 Outline 选项会把一个组合变成永久的并行 API，并可能在各个表面之间漂移。

兼容的重复副本使用完全相同的信封。模块数据缺失或不兼容的合法通用同名插件，会按调用方声明的顺序保持为普通插件，但绝不会获得该模块的 ID 投影。格式错误的通用信封遵循既有的使用方失败软化路径，因此 Markdown 与 Outline 保持已发布行为，而不是在渲染期间抛出异常。无效的直接工厂参数仍属程序错误。

已否决：模块本地的选项状态；把同名仿制品提升进该模块；因包版本偏差而在渲染时崩溃；默认开启的行为；Markdown 的布尔或命名空间 prop；单独的 Outline 身份选项；产品专属的工厂选项。

### DEC-2 — Own one all-depth identity projection

**引用：** `module:Markdown/headingLinks/DEC-2`

**决策者：** `cixzhang`、`2026-10-03`

每个变换后的标题以深度优先参与，使渲染目标与根级 Outline 条目共享同一个冲突序列。NFKC Unicode slug 生成与已生成 ID 的预留产生持久可读的片段。调用方命名空间是稳定数据；运行时树位置与 `useId` 不是。

已否决：仅根级的插件分配；分开的 Markdown/Outline slug 生成器；仅 ASCII 的 slug；可能重新生成自然数字后缀的冲突计数；运行时 ID。

### DEC-3 — The renderer extension is an honest revealed copy button

**引用：** `module:Markdown/headingLinks/DEC-3`

**决策者：** `cixzhang`、`2026-10-03`

渲染器扩展使用一个行内尾随的 `#` 兄弟元素，带有基线/逻辑间距、次要颜色与继承的字体排印。其主要动作是复制，因此它是真正的按钮，而不是抑制导航的锚点。`useContainerReveal` 拥有精细指针静止、标题行悬停、focus-within、粗略/触摸以及动效语义。其流内盒匹配标题行高，具有稳定的逻辑末端间距与互不重叠的 24px 粗略命中几何；指针激活不绘制键盘环。标题 ID 仍是传入片段的目标。

已否决：原生片段导航；复制加导航的锚点混合体；定制的显现媒体逻辑；产品路由；新的公共显现 API。

## Content boundary

该模块只读取变换后的标题节点，以及由经过验证的插件条目为当前文档调用所携带的调用方配置。它不会把文档内容、标签、目标、选项或生成的 ID 持久化到模块本地状态中。

## Open questions

无。
