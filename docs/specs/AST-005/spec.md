---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-005
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-08-31
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture: [architecture:public-component-api]
affects_families: [family:navigation-destinations]
affects_contributing: []
affects_consumer_docs:
  [Link, Button, ClickableCard, Item, List, Token, Markdown]
---

# Safe navigation destinations

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "navigation": [
      "FR2",
      "FR3",
      "FR4",
      "FR6",
      "FR7",
      "FR8",
      "DEC-1",
      "DEC-2",
      "DEC-3"
    ]
  }
}
```

## Intent

一个人激活 Astryx 链接时，无论该链接由哪个组件绘制、导航是原生的还是命令式的，也无论框架路由器是否替换了原生锚点，都应获得相同的目标安全性。组件组合不得形成绕过这条共享规则的路径。

本规格接受共享的导航目标契约。`family:navigation-destinations` 记录了在原生、自定义路由器、命令式和 Markdown 导航中的采用情况。接受该契约本身并不确立实现或精确 head 验证。

## Non-goals

- 校验 URL 语法、要求使用绝对 URL，或把目标限制为主机允许列表。
- 为图片、媒体、已下载文件、CSS、fetch 或其他嵌入式资源 URL 定义内容策略。这些出口具有不同的能力与内容类型风险；来自已接受链接目标的下载仍受支持。Markdown 图片 URL 是例外：由 Markdown 的解析器按其链接规则决定（DEC-3）。
- 在控制权离开 Astryx 之后，对使用方拥有的 JSX、自定义 Markdown 插件输出或任意使用方回调进行清理。
- 取代内容安全策略（Content Security Policy）、路由器授权、服务端校验或应用级访问控制。
- 新增一个公共 prop，让组件绕过或配置该规则。
- 更改链接标签、target/rel 行为、禁用语义或普通 URL 解析。

## Requirements

- **FR1 — 一条规则覆盖每一处 Astryx 拥有的导航出口。** 在 Astryx 渲染、委派或以命令式方式激活由调用方控制的导航目标之前，该目标必须通过本规格中的契约。从原生锚点改为路由器组件或扩大可点击区域，不得削弱该契约。
- **FR2 — 检查遵循浏览器对 scheme 的规范化。** scheme 检查必须移除 ASCII 控制字符 `U+0000–U+001F` 与 `U+007F`、裁剪两端空白，并以不区分大小写的方式比较 ASCII scheme 文本。这可以防止被阻止的 scheme 被浏览器忽略的字符隐藏。
- **FR3 — 可执行文档 scheme 被阻止。** 以 `javascript:`、`vbscript:` 或 `data:text/html` 开头的规范化导航目标，不得成为可执行导航。该检查在查询、片段、target、修饰键或指针按键的差异能够选择另一个出口之前生效。解析器负责 Markdown 链接与图片 URL 的安全性：它还会在链接和图片中阻止任何媒体类型的每个 `data:` URL。渲染器仅在真正存在绕过路径时保留检查（DEC-3）。
- **FR4 — 普通目标继续可用。** 相对路径、同文档片段、协议相对 URL，以及 `http:`、`https:`、`mailto:`、`tel:` 和安全自定义 scheme 等普通 scheme，必须保留其既有导航行为，包括从已接受目标发起的下载。本契约不重写、不解析，也不对已接受目标做主机过滤。已接受的结构化路由器目标必须保留其对象标识。
- **FR5 — 原生、自定义与命令式路径都被覆盖。** 完整规则必须对 React DOM 锚点、通过 `LinkProvider` 或 `as` 接缝提供的自定义组件，以及包括 `window.open` 与 `window.location` 在内的命令式出口成立。React DOM 自身的清理器不构成原生锚点例外。中键点击与 Cmd/Ctrl 点击同样不是例外。
- **FR6 — 拒绝在导航边界处失效关闭。** 被阻止的目标必须以惰性方式渲染，并且不得触达任何命令式浏览器 API。对于被拒绝的目标，不得调用自定义路由器，包括以 `undefined` 替代被拒绝的值来调用。当保留非导航渲染与使用方回调不会激活被拒绝的目标时，组件可以保留它们。
- **FR7 — 路由器目标 prop 是相互独立的出口。** 当自定义链接组件可以同时接收 `href` 与 `to` 时，每个提供的值必须独立通过该规则。若任一值被拒绝，结果必须为惰性：不调用自定义路由器，也不回退到另一个目标，即使它是安全的。当两者都被接受时，显式的 `to` 保留其文档化的优先级。受支持的结构化目标必须遵守同一规则，包括每个带 scheme 的 `href`、`pathname` 或 `protocol` 字段，以及这些字段构成的目标。单独的 protocol 或未受检查的字段不得提供绕过该规则的路径。被接受的字段与对象标识保持不变。
- **FR8 — Markdown 的解析器应用共享规则并拥有其 URL 决定权。** Markdown 的解析器必须对每个链接与图片目标应用共享导航规则及其规范化，并且还必须拒绝所有 `data:` URL（DEC-3）。`<Markdown>` 只渲染它解析出的节点，并且仅在真正存在绕过路径时保留检查（若有）。Markdown 之外共享的 Core 导航管道仅拒绝共享的被阻止 scheme。
- **IR1 — 共享出口使用共享所有者。** 委派链接或以命令式方式导航的 Core 组件必须使用一个共享的策略所有者，而不是维护组件本地的被阻止 scheme 列表。Markdown 的解析器调用该共享策略所有者，并且只添加它自己的 `data:` 检查（DEC-3）；它不保留共享被阻止 scheme 列表的任何副本。
- **IR2 — 每个不同的出口都有对变异敏感的覆盖。** 当从原生锚点、自定义 `href`、自定义 `to`、受支持的结构化目标（包括 `protocol`）、新标签页、修饰键点击、中键点击、普通命令式导航或 Markdown 链接解析/渲染中移除防护时，验证必须失败。当自定义组件被以 `undefined` 或作为回退的另一目标调用时，被拒绝路由器相关的覆盖必须失败。
- **IR3 — 新的导航面加入该 family。** 接受由调用方控制的导航目标的新组件或 hook，必须在发布前加入 `family:navigation-destinations` 并复用共享所有者。

### Platform support

- 受支持的功能/引擎下限：Astryx Core 支持的每个浏览器与框架链接集成。
- 不受支持的行为：忽略已过滤目标 prop，或从其他调用方数据构造目标的自定义组件不在保证范围内；Astryx 不得声称调用方拥有的行为已被清理。
- 浏览器证据：真实 Chromium 验证每个被阻止的 scheme 在原生与命令式路径上保持惰性，以及普通的相对、外部、修饰键、中键点击和下载行为仍然可用。单元集成测试验证自定义路由器交接与对象标识；真实框架 SSR 验证拒绝渲染时不会调用需要目标的路由器。

## Current-state impact

`family:navigation-destinations` 是该行为的完整共享所有者。其成员覆盖每个接受或派生导航目标的当前 Core 组件，包括那些由公共成员拥有实际 `href` 的聚合组件记录。

实现与验证必须覆盖：

1. 原生锚点上的完整被阻止 scheme 规则，而不仅是 React DOM 自身的 `javascript:` 保护；
2. 自定义 `href` 与 `to`，包括受支持的结构化目标及其独立的 `protocol`，只要任一值被拒绝即以惰性方式渲染；
3. 每一处命令式与委派激活，同时保留已接受目标与使用方回调；
4. 合规的 Markdown 导航，其 Markdown 链接与图片 URL 由解析器决定（DEC-3）；以及
5. 在记录 family 采用完成之前的精确 head 证据。

不新增任何组件本地的公共 prop。例外行为属于本安全导航契约之外、由调用方拥有的自定义渲染，而不属于 `LinkProvider` 或 `as` 绕过。当组件为某个 `href` 或路由器接缝提供文档时，使用方文档应说明共享结果；它应链接到共享规则，而不是在每个 prop 行中重复 scheme 列表。

## Verification

| Contract           | Verification                               | Representative states                                                                                                                         | Mutation or failure expectation                                                                     |
| ------------------ | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| FR2, FR3, FR4, FR8 | 共享谓词与 Markdown 解析/渲染套件          | 混合大小写；嵌入的控制字符；相对/哈希；http(s)；mailto/tel；安全自定义 scheme；下载；被阻止的 scheme；Markdown 链接与图片中的每个 `data:` URL | 移除规范化或更改一个被阻止前缀，会使导航矩阵出现不一致                                              |
| FR5, FR6, FR7      | `useLinkComponent` 集成测试与框架 SSR 测试 | 原生锚点；provider；`as`；`href` 与 `to` 在任一组合下的安全/被拒绝；结构化 `pathname`/`href`/`protocol`；已接受的对象标识                     | 被拒绝的目标会调用路由器，包括以 `undefined` 或安全回退调用；已接受的目标丢失标识或优先级；SSR 抛错 |
| FR1, FR3, FR5, FR6 | `useClickableContainer` 集成测试           | 普通点击；`_blank`；Cmd/Ctrl 点击；中键点击；委派的交互式 ref                                                                                 | 被阻止的值触达 `window.open`/`window.location`，或普通导航路径停止工作                              |
| FR1, IR1, IR3      | Family 成员资格与源码使用审计              | 每个当前的 `useLinkComponent`、`useClickableContainer`、Markdown 以及直接的原生锚点目标所有者                                                 | 新的、由调用方控制的导航出口在该 family 之外发布，或重复了本地规则                                  |
| Browser contract   | 真实 Chromium 探针                         | 原生锚点上的所有被阻止前缀；自定义路由器替身；命令式同标签页/新标签页；修饰键与中键点击；已接受的目标与下载                                   | 脚本执行、发生被阻止的导航、被拒绝的目标获得链接激活，或普通浏览器功能退化                          |

### Completion criteria

只有当以下条件满足时，本规格才从 `accepted` 变为 `shipped`：

- `family:navigation-destinations` 中的每个采用缺口都已闭合，或记录为所有者明确批准的例外；
- 精确 head 测试覆盖原生锚点、结构化路由器目标、惰性路由器拒绝，以及每个不同的命令式与 Markdown 导航出口；
- 源码/成员审计未发现该 family 之外由调用方控制的 Core 导航出口；以及
- 使用方文档描述了共享结果，且没有暗示除 Markdown 图片之外的嵌入式资源或调用方拥有的渲染器也获得同一策略。

## Decision log

### DEC-1 — Destination safety follows the navigation sink

**参考：** `spec:AST-005/DEC-1`

**决策者：** `cixzhang`, `2026-08-31`

每一条能够激活由调用方控制的导航目标的 Astryx 拥有路径，都遵循同一条规范化的被阻止 scheme 规则。该保证在组件组合、自定义框架路由器、修饰键点击、中键点击与命令式导航下依然成立，因为这些是同一用户意图的替代出口。

已否决：仅依赖 React DOM。React 可以保护它自己渲染的 `href`，但不会检查传给自定义路由器的 prop，也不会中介 `window.open` 或 `window.location`。

### DEC-2 — Embedded resources remain a separate policy

**参考：** `spec:AST-005/DEC-2`

**决策者：** `cixzhang`, `2026-08-31`

导航目标与嵌入式资源是彼此独立的出口家族。本规格为导航阻止可执行文档 scheme，但不决定允许哪些图片来源、下载内容或获取的资源。来自已接受导航目标的下载继续可用。因此 Markdown 可以在符合共享导航矩阵的同时拒绝更广的资源集合。

已否决：对每个 URL 形态的值使用一个不加区分的“安全 URL”布尔值。这会掩盖导航文档与嵌入或获取资源之间的实质差异，并会意外地放宽或收窄无关的公共行为。

对于 Markdown 链接与图片，部分已被 DEC-3 取代。

### DEC-3 — Markdown's parser owns its URL safety and blocks every data: URL

**参考：** `spec:AST-005/DEC-3`

**决策者：** `cixzhang`, `2026-11-10`

Markdown 的解析器负责 Markdown 的 URL 安全性。它在共享导航规则之外，还阻止链接或图片中任何媒体类型的每个 `data:` URL，并且 `<Markdown>` 只渲染它解析出的节点，不做第二次 scheme 检查。于是解析器的公共树不会为自定义渲染器携带任何 `data:` URL。对于 Markdown 链接，这比 DEC-2 所指的共享导航矩阵更严格；对其他每个成员的共享规则不变。不来自解析源码的导航 URL（例如插件的 base URL）在进入处接受检查。

已否决：仅在 Markdown 图片中阻止 `data:`，这会在解析器的公共树中留下 `data:` 链接。已否决：在渲染器中进行第二次 scheme 检查，这会为仅由解析器产生的节点重复解析器的规则。

## Open questions

无。
