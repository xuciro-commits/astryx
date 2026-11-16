---
schema_version: 1
template_version: 1
kind: family
id: family:navigation-destinations
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
owners: [cixzhang, imdreamrunner]
review_triggers: [behavior, accessibility, public-api]
verified_by:
  [
    packages/core/src/utils/safeUrl.test.ts,
    packages/core/src/Markdown/parser.test.ts,
    packages/core/src/Markdown/urlSchemes.test.ts,
    packages/core/src/Markdown/Markdown.test.tsx,
    packages/core/src/Markdown/Markdown.renderBoundary.test.tsx,
    packages/core/src/Link/useLinkComponent.test.tsx,
    packages/core/src/Link/__tests__/Link.navigation.a11y.chromium.spec.ts,
    packages/core/src/Citation/Citation.test.tsx,
    packages/core/src/TopNav/TopNavMenu.test.tsx,
    apps/docsite/src/__tests__/link-navigation.test.ts,
    packages/core/src/hooks/useClickableContainer.test.tsx,
    packages/core/src/ClickableCard/ClickableCard.test.tsx,
    packages/core/src/DropdownMenu/DropdownMenu.test.tsx,
  ]
members:
  [
    component:Avatar,
    component:BreadcrumbItem,
    component:Button,
    component:Citation,
    component:ClickableCard,
    component:DropdownMenuItem,
    component:Item,
    component:Link,
    component:ListItem,
    component:Markdown,
    component:NavHeadingMenuItem,
    component:Pagination,
    component:SideNavHeading,
    component:SideNavItem,
    component:Tab,
    component:Token,
    component:TopNavHeading,
    component:TopNavItem,
    component:TopNavMenu,
    component:TopNavMegaMenuItem,
    component:TopNavMegaMenuFeaturedCard,
    component:TreeListItem,
  ]
architecture: [architecture:public-component-api]
contributing: []
deciding_specs: [spec:AST-005/DEC-1, spec:AST-005/DEC-2, spec:AST-005/DEC-3]
---

# Navigation destinations contract

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "navigation": ["FR1", "FR3", "FR4", "FR5"]
  }
}
```

## Intent

人们应当从每个接受或派生目标的 Astryx 组件获得相同的安全导航行为。组件的视觉角色、router 集成或扩大的点击目标，不得决定被阻止的目标是否能够执行。

## Membership rule

当 Astryx 接受或派生一个组件可以渲染、委托或激活为导航的目标时，该组件即属于此契约。成员资格遵循这一可观察的职责，而不是组件的视觉类别或它当前使用哪个共享 hook。

仅布局调用方拥有的链接的组件不加入。从 Astryx 拥有的 ID 创建固定的同文档链接的组件不加入，除非它还接受调用方控制的目标文本。调用方拥有的 JSX、插件渲染器和回调在 Astryx 移交控制之后属于边界之外。

- **当前成员：** Avatar；BreadcrumbItem；Button 链接模式；Citation；ClickableCard；DropdownMenuItem 链接行（以及它们在指针菜单和触摸面板中渲染的 data 模式条目）；Item；Link；ListItem；Markdown 链接；NavHeadingMenuItem；Pagination 页面链接；SideNavHeading 和 SideNavItem；导航模式下的 Tab；Token 链接模式；TopNavHeading、TopNavItem、TopNavMenu、TopNavMegaMenuItem 和 TopNavMegaMenuFeaturedCard；以及 TreeListItem。
- **协作者：** `useLinkComponent`、`LinkProvider`、`useClickableContainer`、React DOM 的原生 anchor 清理器，以及 Markdown 的解析器/渲染边界。
- **排除：** Outline 由 Astryx 生成的 `#id` 链接；AppShell 固定的跳到内容片段；作为 children 提供的任意链接；Markdown 插件输出；图片/媒体/资源 URL，但 Markdown 图片 URL 除外，它们由 Markdown 的解析器依据其链接规则决定（`spec:AST-005/DEC-3`）；以及仅组合成员而不接受或派生其目标的组件。

成员资格是开放式的。新发布的符合规则的 Core 组件必须添加到这里，即使它委托给现有成员或共享 hook 也是如此。

## Shared owner

- `spec:AST-005` 拥有适用于每个导航目标的规范化阻止 scheme 规则。此 family 拥有其在各成员上的应用。
- `useLinkComponent` 拥有向原生和自定义链接组件的目标交接，包括面向 router 的 `href` 和 `to` 接缝。已接受的结构化目标保留对象标识。被拒绝的目标会以惰性方式渲染，而不调用自定义组件。
- `useClickableContainer` 拥有从扩大表面发起的命令式导航，包括同标签页、新标签页、修饰键点击、中键点击和委托激活。每次激活都保留相同的接受/阻止结果。
- Markdown 拥有将不可信源解析为目标，并在渲染过程中保留相同导航决定的能力。Markdown 的解析器用一条规则为链接和图片拥有该决定：共享导航规则加上每个 `data:` URL。渲染器只渲染已解析的节点（`spec:AST-005/DEC-3`）。
- 原生 anchor 遵循完整的共享导航规则。React DOM 自身的清理不是任何被阻止 scheme 的例外。

## Canonical concepts

| 概念     | 值或状态                                     | 默认语义                                                  | 稳定性  |
| -------- | -------------------------------------------- | --------------------------------------------------------- | ------- |
| 目标来源 | 调用方 prop、解析内容、Astryx 派生           | 调用方/解析值需要检查；固定的 Astryx 片段在构造上是安全的 | current |
| 接收端   | 原生 anchor、自定义 router、命令式浏览器 API | 每个 Astryx 拥有的接收端都执行相同的导航决定              | current |
| 决定     | 接受或阻止                                   | 已接受的目标保留现有行为；被阻止的目标不导航              | current |
| 激活     | 普通、新标签页、修饰键、中键点击、编程式代理 | 激活方式不改变决定                                        | current |
| 资源类型 | 导航或嵌入/获取的资源                        | 此 family 只拥有导航                                      | current |

## Cross-component invariants

- **FR1 — 每个调用方控制的导航目标都在到达其接收端之前被决定。** 在共享规则运行之前，任何成员都不得渲染原生导航目标，或将其传递给自定义 router 或命令式浏览器 API。
- **FR2 — 替代渲染保留规则。** 通过 `LinkProvider` 或 `as` 替换原生 anchor 不会绕过目标处理。
- **FR3 — 替代激活保留规则。** `_blank`、Cmd/Ctrl 点击、中键点击、同标签页赋值和委托表面点击产生相同的接受/阻止决定。
- **FR4 — 被阻止的 scheme 不能执行。** 经过浏览器兼容的 scheme 规范化后，`javascript:`、`vbscript:` 和 `data:text/html` 不会成为导航，包括通过原生 anchor。解析器拥有 Markdown 链接和图片 URL 的安全性：它还会在链接和图片中阻止任何媒体类型的每个 `data:` URL。渲染器仅在存在真实绕过路径时保留检查。
- **FR5 — 已接受的目标保留浏览器行为。** 相对路径、片段、协议相对目标、HTTP(S)、mailto、tel 和安全的自定义 scheme 保留原生和 router 导航、目标、下载及浏览器可供性。已接受的结构化 router 目标保留其字段和对象标识。对于 Markdown，解析器拥有哪些链接和图片 URL 被接受；`data:` URL 不属于其中之一。
- **FR6 — 两个自定义 router prop 都是接收端。** 提供的 `href` 和显式 `to` 会被独立检查，包括受支持结构化形式的携带 scheme 的字段（`href`、`pathname` 和 `protocol`）以及它们形成的目标。如果任一提供的目标被拒绝，结果就是惰性的：即使使用 `undefined` 也不会调用自定义 router，并且不会回退到另一个目标。当每个提供的目标都被接受时，已接受的显式 `to` 值保留其文档化的优先级。
- **FR7 — 禁用与被拒绝是不同的。** 成员保留自己的禁用语义。拒绝目标会阻止导航，但不会凭空创建禁用状态、标签或视觉处理。
- **FR8 — 资源处理不继承导航策略。** 图片、媒体、CSS URL、fetch 目标和下载内容使用各自接收端特定的契约。已接受链接的现有下载行为会被保留。同时处理导航和资源的成员仅将本 family 应用于其导航路径。Markdown 是例外：其解析器也将其链接规则应用于图片 URL（`spec:AST-005/DEC-3`）。

## Allowed component variation

- **AV1 — 被拒绝的呈现。** Markdown 可以将被拒绝的源渲染为文本；自定义链接成员渲染惰性内容而不调用其自定义 router；扩大表面可以简单地省略导航。每个成员保留自己的非导航结构和无障碍契约。不提供组件绕过 prop；例外行为属于本契约之外的调用方拥有的自定义渲染。
- **AV2 — 原生与 router 导航。** 当成员的公共契约要求该模式时，成员可以使用 React DOM anchor、provider 级 router 组件、逐组件 `as` 覆盖或命令式浏览器 API。
- **AV3 — 目标词汇。** 公共 API 可以暴露 `href`、包含 `href` 的结构化条目数据、Citation 的 `url` 或解析后的 Markdown 语法。共享行为不要求重命名已发布的 prop。
- **AV4 — 目标与关系。** 目标被接受后，成员保留其现有的 `target`、`rel`、referrer、download 和外部链接呈现行为。
- **AV5 — 嵌入资源。** Citation 可以单独拥有图片或资源策略。Markdown 的图片 URL 遵循其解析器的链接规则（`spec:AST-005/DEC-3`）。两者都不改变本 family 对其他成员的导航矩阵。

## Representative matrix

| 成员与状态                                   | 共享不变量                                    | 有意的差异                                                      |
| -------------------------------------------- | --------------------------------------------- | --------------------------------------------------------------- |
| `component:Link` / 原生 anchor               | 所有三个被阻止的目标前缀保持惰性              | 已接受的目标保留原生 anchor 可供性                              |
| `component:Link` / 自定义 provider 或 `as`   | 任一被拒绝的 `href`/`to` 都会阻止 router 调用 | router 拥有已接受的客户端导航并接收未改变的对象                 |
| `component:ClickableCard` / 普通或修饰键点击 | 每个命令式或委托出口都使用相同的决定          | 可见的 Card 结构和嵌套交互处理保持在本地                        |
| `component:Token` / 带移除操作的链接         | 表面激活和隐藏链接保持一致                    | 移除操作仍然是独立的同级控件                                    |
| `component:Markdown` / 已解析链接            | 被阻止的源不会成为导航                        | 被拒绝的源可以渲染为文本；解析器决定链接和图片 URL              |
| 导航聚合 / 成员条目                          | 条目目标使用共享所有者                        | tree、tab、breadcrumb、side-nav、top-nav 和 menu 语义保持在本地 |
| `component:Citation` / 链接源                | 被阻止的 URL 不会执行                         | 原生 anchor 路径和引用呈现保持在本地                            |

## Adoption and exceptions

| 组件或表面                                      | 必需的采用                                                                                                         |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Markdown 已解析和已渲染的链接                   | 解析器应用共享导航决定，并额外阻止每个 `data:` URL；渲染器只渲染已解析节点。图片 URL 遵循相同的解析器规则（AV5）。 |
| 原生 React anchor，包括 Citation                | 完整的阻止 scheme 规则适用；仅靠 React DOM 的 `javascript:` 保护并不足够。                                         |
| `useLinkComponent` 自定义 provider 和 `as` 路径 | 两个提供的目标以及受支持的结构化形式（包括 `protocol`）都遵守规则；拒绝永远不会调用 router。                       |
| `useClickableContainer` 命令式路径              | 同标签页、新标签页、修饰键、中键点击和委托激活保持一致；非导航的消费方回调仍然可用。                               |
| 组合两个共享 hook 的组件                        | 委托目标和任何单独渲染的原生 anchor 都满足完整规则。                                                               |

这些是必需的结果，而不是已完成验证的声明。只有在 exact-head 证据覆盖每个适用行之后，采用才算完成。原生 anchor 的仅 React 检查、未检查的携带 scheme 的字段，或用 undefined 的被拒绝目标调用 router，都不是已批准的例外。

## Verification map

| 契约               | 验证                                                                                              | 代表性成员和状态                                                                                                             | 变异或失败预期                                                                                                   |
| ------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| FR4, FR5           | `safeUrl.test.ts`                                                                                 | 字符串和结构化目标；混合大小写；控制字符；相对、片段、协议相对、普通、安全自定义 scheme 和 `data:image/*`；单独的 `protocol` | 共享规则接受被阻止的目标或拒绝普通目标，包括协议与其 pathname 分离的情况。                                       |
| FR1, FR2, FR6      | `useLinkComponent.test.tsx` 和 `apps/docsite/src/__tests__/link-navigation.test.ts`               | 原生 Link、Button、导航成员；provider 和 `as`；任一组合中的安全/被拒绝 `href` 和 `to`；结构化目标和对象标识                  | 被拒绝的目标调用 router（包括使用 `undefined` 或回退），已接受对象失去标识，或真实 router 在渲染惰性内容时抛出。 |
| FR1, FR3, FR4, FR5 | `useClickableContainer.test.tsx` 和真实 Chromium 导航覆盖                                         | ClickableCard 和 Token 形态；原生 Link；普通、`_blank`、Cmd/Ctrl 点击、中键点击、委托激活；已接受的下载                      | 被拒绝的目标仍可激活，发生被阻止的原生、命令式或委托导航，或已接受的目标失去激活模式。                           |
| FR4, FR5           | `parser.test.ts`、`urlSchemes.test.ts`、`Markdown.test.tsx` 和 `Markdown.renderBoundary.test.tsx` | 解析过的、引用式、自动链接和转换后的内置链接；混合大小写；控制字符；普通 scheme；链接和图片中的每个 `data:` URL              | Markdown 在链接中接受被阻止的 scheme 或任何 `data:` URL，拒绝普通导航目标，或将被拒绝的节点渲染为导航。          |
| FR1, IR3           | `spec:AST-005` 所要求的源/成员审计                                                                | 每个调用方控制的 Core 导航目标                                                                                               | 新的接收端或携带目标的组件在此成员快照之外发布                                                                   |
| FR7, FR8           | 以成员为中心的行为和资源测试套件                                                                  | 禁用的链接模式；同一解析器规则下的 Markdown 链接和图片；Citation 链接与图片                                                  | 目标拒绝改变禁用语义，或导航策略悄悄变成资源策略                                                                 |

## Decision links

- `spec:AST-005/DEC-1` — 目标安全性遵循每个导航接收端。
- `spec:AST-005/DEC-2` — 嵌入资源保持为单独的策略。
- `spec:AST-005/DEC-3` — Markdown 的解析器拥有其 URL 安全性，并阻止每个 `data:` URL。

## Open questions

无。

## Content boundary

本文件拥有导航目标的成员资格、跨组件的接受/阻止结果以及共享接收端的采用。它不重复组件 prop 表、router 实现细节、组件局部的禁用或渲染行为、嵌入资源策略、当前审计结果或 system spec 的理由。
