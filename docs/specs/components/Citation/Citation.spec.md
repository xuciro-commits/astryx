---
schema_version: 3
template_version: 7
kind: component
id: component:Citation
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
owners: [cixzhang]
review_triggers: [public-api, behavior, theming, accessibility, visual]
verified_by:
  [
    packages/core/src/Citation/Citation.test.tsx,
    packages/core/src/utils/safeUrl.test.ts,
    apps/storybook/stories/Citation.stories.tsx,
    apps/storybook/rtl-audit/verified-not-applicable.json,
    packages/core/src/theme/themingTargets.test.ts,
    .github/visual-baseline/manifest.json,
    scripts/check-knowledge.mjs,
  ]
modules: []
families: [family:navigation-destinations]
design_specs: []
architecture:
  [
    architecture:public-component-api,
    architecture:component-theming-surface,
    architecture:component-test-sufficiency,
    architecture:interaction-modality,
  ]
contributing: []
system_specs: [spec:AST-005]
---

# Citation component contract

## Contract at a glance

| Area                    | Contract                                                                                                                                                                                                                                  |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Public contract         | `Citation` 从 `@astryxdesign/core/Citation` 导出；`source` 与 `number` 为必填，`variant` 默认为 `label`。                                                                                                                                 |
| Behavior                | 被接受的来源 URL 会在新标签页中渲染为原生锚点。缺失或被拒绝的 URL 则以惰性 span 渲染相同的引用内容。label 与 number 变体都保持该导航决策。                                                                                                |
| End-user impact         | 读者获得一致的引用标签或编号引用，而不会被拦截的目标变成导航，装饰性的来源图标也不会被重复播报。                                                                                                                                          |
| Builder impact          | 构建方显式传入的 `role` 或 `aria-label` 本应到达根元素；目前组件的 role 与译名会取代它们（FR5 缺口）。                                                                                                                                    |
| Compatibility/readiness | 已发布行为记录为当前状态；没有 API、默认值或输出变化。有一处实现缺口列在 Current-state impact 下。                                                                                                                                        |
| Review checks           | 拒绝以下情况：被拦截的 URL 变成导航；被接受的 URL 失去原生锚点能力；Citation 为惰性引用添加交互或引用 role；调用方未提供时缺少惰性无障碍名称；装饰性图标被播报；透传或 ref 行为被丢弃；新增公共主题目标却没有权威依据。                   |
| Governing rules         | `family:navigation-destinations/FR1,FR3–FR5,FR7–FR8`；`architecture:public-component-api/INV1,INV5,INV6,INV8,INV9`；`architecture:component-theming-surface/INV3–INV6`；`architecture:component-test-sufficiency/INV1–INV7,INV10–INV11`。 |

本表是审查投影；下方正文具有权威性。

## Intent

以可读的标签或紧凑的编号呈现对来源的行内引用，并在任何目标到达原生锚点之前先应用共享的导航决策。

## Compatibility and migration

- 已发布默认值保留：`yes` —— `variant="label"`。
- 兼容性类别：记录已发布行为；没有公共 prop、默认值、DOM、目标或样式输出的变化。
- 受控/非受控行为：不适用；Citation 不拥有任何状态。
- 迁移决策：无

使用方迁移说明属于使用方文档与发布说明。

## Current-state impact

- **调用方的 `role` 与 `aria-label` 被取代（FR5）。** 调用方的 props 在组件的 `role` 与 `aria-label` 之前展开，因此调用方显式给出的值永远到不了根元素；而 `architecture:public-component-api` INV5 要求调用方的显式输入能够到达该元素。根契约测试目前把这种取代行为固定了下来。

## Ownership boundary

**Owns**

- 标签与编号的呈现、已接受链接与惰性 span 之间的渲染选择、无障碍引用命名、装饰性图标处理，以及 `citation` 根目标。
- 受支持的中性 DOM 与样式透传，包括指向所渲染锚点或 span 的 ref。

**Does not own / non-goals**

- 哪些导航方案被接受或被拦截 —— 由 `family:navigation-destinations` 与 `spec:AST-005` 拥有。
- 通用的图片或资源 URL 策略 —— 来源图片仍不在导航目标契约之内。
- Citation 装饰性包裹层之外的、由调用方提供的图标节点的语义或无障碍性。
- 引用排序、参考文献管理、内容出处，或周围的正文 —— 由产品调用点拥有。

## Public concepts

| Concept     | Closed values or states                 | Meaning                                                                                                    | Availability    | Default                       | Owner                            | Stability        | Invalid-value behavior     |
| ----------- | --------------------------------------- | ---------------------------------------------------------------------------------------------------------- | --------------- | ----------------------------- | -------------------------------- | ---------------- | -------------------------- |
| variant     | `label`, `number`                       | 选择可见的来源标题呈现或编号引用呈现。                                                                     | 每次渲染。      | `label`                       | `component:Citation`             | 稳定             | 由公共类型拒绝             |
| destination | accepted, missing, rejected             | 在共享导航决策之后选择原生锚点根或惰性 span 根。                                                           | 每个变体。      | `source.url` 缺失时为 missing | `family:navigation-destinations` | 当前 family 契约 | 被拒绝的目标以惰性方式渲染 |
| source icon | node, `src`, legacy string icon, absent | 在 label 变体中提供可选的装饰性来源图像。非字符串 node 优先于 `src`；否则 `src` 优先于旧式字符串图标 URL。 | 仅 label 变体。 | absent                        | `component:Citation`             | 已发布的兼容行为 | 普通的 React 渲染行为      |
| number      | numeric value                           | 提供引用序号，并参与译后的无障碍名称。                                                                     | 每个变体。      | 必填                          | `component:Citation`             | 稳定             | 由公共类型拒绝             |

## Behavioral and layout contract

| ID  | Invariant                                                                                                                                                                                                                                                                                            | Basis                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| FR1 | 被接受的 `source.url` 渲染为原生锚点，目标保持不变，带 `target="_blank"`、`rel="noopener noreferrer"`、`role="doc-noteref"`（除非调用方显式提供 `role`），以及译后的无障碍名称（除非调用方显式提供 `aria-label`）（FR5）；其 `title` 为来源标题，没有标题时则为编号。                                | 已发布的源码与测试；`family:navigation-destinations/FR1,FR3–FR5`                |
| FR2 | 缺失或被拒绝的目标以非交互 span 渲染所选的引用呈现；Citation 不会为其添加导航或引用 role。除非调用方显式提供 `role`，该 span 使用受支持的命名 role，因此其译后的标签，或调用方的 `aria-label`，能够到达辅助技术（FR5）。拒绝不会从 `source.url` 派生任何导航属性，不会发明禁用语义，也不会隐藏引用。 | 已发布的源码与测试；`family:navigation-destinations/FR4,FR7`；WAI-ARIA 命名规则 |
| FR3 | label 变体呈现来源标题、可选的装饰性来源图标以及截断；number 变体将提供的编号作为紧凑的可见引用呈现。                                                                                                                                                                                                | 已发布的源码、文档、测试与 stories                                              |
| FR4 | node 图标优先于 `src`，`src` 优先于旧式字符串 `icon`。每条图标路径在 `aria-hidden` 包裹层内都保持装饰性。                                                                                                                                                                                            | 已发布的兼容行为与测试                                                          |
| FR5 | 两个根分支都保留受支持的 DOM props、`className`、`style`、`xstyle`、`data-*` 属性与声明的 `HTMLElement` ref，且调用方显式的 `role` 或 `aria-label` 能够到达根元素（`architecture:public-component-api` INV5）。实现缺口：组件的 role 与译名会取代调用方的值（Current-state impact）。                | `architecture:public-component-api/INV5,INV6,INV8`；回归测试                    |
| FR6 | Citation 在绘制的根上保持一个公共 `citation` 目标，反映 `variant`，并且在未经批准的主题契约变更下不暴露任何内部图标或文本目标。                                                                                                                                                                      | 已发布的文档/源码；`architecture:component-theming-surface/INV3–INV6`           |
| FR7 | 组件自有的无障碍文本来自翻译目录；可见的来源文本与数字内容仍是调用方提供的数据。                                                                                                                                                                                                                     | 已发布的源码与 i18n 基础设施                                                    |

### Allowed variation

- **AV1 — 主题绘制。** `citation` 根目标可以更改受支持的视觉绘制，而不改变变体、目标、role 或无障碍名称行为。
- **AV2 — 调用方内容。** 来源标题、数字值、图片 URL 与 node 图标可以在已发布的公共类型范围内变化。
- **AV3 — 原生目标行为。** 被接受的相对、片段、协议相对、HTTP(S)、mailto、tel 以及安全的自定义目标保留原生浏览器处理与组件既有的新标签页关系。

### Representative states

| State                   | Required invariant                                                                                                    | Allowed variation            |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| linked label            | 原生锚点、来源标题、可选的装饰性图标、在没有调用方 `aria-label` 时使用译后的无障碍名称。                              | 来源内容与根主题绘制。       |
| linked number           | 原生锚点、数字可见引用、在没有调用方 `aria-label` 时使用译后的无障碍名称。                                            | 编号与根主题绘制。           |
| missing or rejected URL | 带有相同所选呈现的惰性 span；在没有调用方 `role` 时使用受支持的命名 role；Citation 不添加任何导航或引用 role 或属性。 | 来源内容与根主题绘制。       |
| node or image icon      | 图标保持装饰性，且仅出现在 label 变体中。                                                                             | 调用方自有的图形或来源图片。 |

### Transformation and precedence order

- **ORD1 — 目标。** `source.url` → 共享安全 URL 决策 → 原生锚点或惰性 span。
- **ORD2 — 图标。** 非字符串 `source.icon` → `source.src` → 旧式字符串 `source.icon` → 无图标。
- **ORD3 — 根 props。** 调用方透传 → 组件自有的测试 id 与导航属性，以及组件的 role 与名称，除非调用方提供自己的（FR5；目前是组件的取代调用方的，即 FR5 缺口） → 主题与样式组合。

### Performance and resources

- **PR1 — 纯渲染。** Citation 不拥有任何状态、Effect、监听器、observer、定时器或外部资源生命周期。
- **PR2 — 图片。** Citation 可能输出一张调用方提供的来源图片；抓取、校验与资源策略不由导航契约决定。

## Accessibility contract

- **AR1 — 链接引用。** 被接受的目标在调用方未提供 `role` 时暴露一个原生链接，带 `doc-noteref`，并在调用方未提供 `aria-label` 时使用译后的 `Citation {number}: {title}` 无障碍名称（FR5）。
- **AR2 — 惰性引用。** 对于缺失或被拒绝的目标，Citation 不添加交互或导航 role 或属性；调用方显式的 `role` 能够到达 span（FR5）。在没有调用方 `role`（FR5）时，惰性 span 使用 `role="group"`，使其译后的引用标签仍是无障碍名称，包括可见编号没有来源文本的情况。
- **AR3 — 装饰性来源标记。** 来源图片与 node 图标的绘制仍对无障碍树隐藏，以免与引用名称重复。
- **AR4 — 焦点归属。** 原生锚点仍是语义焦点所有者。Citation 不为惰性 span 添加焦点所有者。

## Design relationships

| Anatomy or state | Design requirement                                     | Representation authority                        | Hierarchy role | Component contract |
| ---------------- | ------------------------------------------------------ | ----------------------------------------------- | -------------- | ------------------ |
| Root             | 绘制标签 chip 或编号徽标，并拥有 `citation` 目标。     | observed shipped representation and public docs | 辅助性引用     | FR1–FR3, FR5–FR6   |
| Source icon      | 呈现可选的、由调用方提供的来源标识，不携带无障碍语义。 | observed shipped representation                 | 装饰性         | FR3–FR4, AR3       |
| Label or number  | 呈现来源标题或紧凑索引。                               | observed shipped representation                 | 主要引用内容   | FR3, FR7           |

Citation 仅暴露文档化的 `citation` 根目标。内部图标与文本部件没有公共目标。

## Family and system relationships

- `family:navigation-destinations` 拥有 `source.url` 的接受/拦截结果，包括原生锚点接收端以及对被接受浏览器行为的保留。
- `spec:AST-005` 拥有规范化的拦截 scheme 规则，由 family 投影到 Citation 上。
- `architecture:public-component-api` 拥有导出稳定性、透传、样式组合、ref 可达性以及组件自有 prop 的优先级。
- `architecture:component-theming-surface` 拥有公共目标资格与放置。
- `architecture:component-test-sufficiency` 拥有针对每个关键分支与公共承诺的变异敏感证据。
- `architecture:interaction-modality` 拥有共享模态行为，同时 Citation 的原生锚点仍是其自身的语义焦点所有者。

## Verification map

| Contract         | Verification                                                  | Representative states                                          | Mutation or failure expectation                                                                                                                         | Audit section               |
| ---------------- | ------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| FR1–FR2, AR1–AR2 | `Citation.test.tsx` 目标测试套件与 `safeUrl.test.ts` 矩阵     | 已接受、缺失、被拦截的 scheme、规范化后的拦截文本              | 被拦截的 URL 产生导航；被接受的 URL 失去其目标或原生能力；或在调用方未提供 `role` 时，惰性引用失去其受支持的命名 role。                                 | `audit:Citation/navigation` |
| FR3–FR4, AR3     | `Citation.test.tsx` 变体与图标测试套件                        | label、number、无图标、node 图标、`src`、旧式字符串图标        | 渲染出错误的可见变体；图标优先级改变；或装饰性来源绘制进入无障碍树。缺口：没有测试覆盖 label 的截断。缺口：没有测试覆盖 `src` 优先于旧式字符串 `icon`。 | `audit:Citation/behavior`   |
| FR5              | `Citation.test.tsx` 根契约套件与严格的类型/lint 校验          | 带 ref、DOM props、class、内联样式与 `xstyle` 的锚点与 span 根 | 任一分支丢弃受支持的透传或 ref 行为。缺口：根契约测试断言组件的 role 与名称取代调用方的 `role` 与 `aria-label`，这固定了 FR5 缺口。                     | `audit:Citation/api`        |
| FR6              | `Citation.test.tsx` 类名测试；`themingTargets.test.ts`        | 链接根与惰性根；两种变体                                       | 根目标从类名测试中消失即失败。`themingTargets.test.ts` 只能捕获被重命名或未文档化的目标。缺口：没有测试断言目标上对 `variant` 的反映。                  | `audit:Citation/theming`    |
| FR7              | `Citation.test.tsx` 无障碍名称断言                            | 链接型 label 与 number                                         | 名称丢失来源或编号上下文即失败。缺口：没有测试运行非英文目录，因此绕过翻译的文本仍能通过。                                                              | `audit:Citation/i18n`       |
| RTL N/A          | `verified-not-applicable.json` 的来源哈希记录                 | label 与 number 的 stories；链接/惰性来源路径；有图标/无图标   | 在没有 RTL 证据的情况下出现方向敏感的字形、物理行内位置、排序、滚动、覆盖层或水平键盘行为。                                                             | `audit:Citation/rtl`        |
| 全部             | `Citation.stories.tsx`；稳定的视觉基线 `core-citation--label` | 已文档化的变体与来源状态                                       | 变更后的 label 引用会作为变更返回以供审查。                                                                                                             | `audit:Citation/testing`    |
| AR4, PR1, PR2    | 源码审查                                                      | 链接根与惰性根；图片图标                                       | 缺口：如果 Citation 为惰性 span 添加焦点所有者、状态、effect 或监听器，或输出多于一张来源图片，没有任何自动化检查会失败。                               | `audit:Citation/behavior`   |

## Decision log

### DEC-1 — Inert references use a noninteractive naming role

**Reference:** `component:Citation/DEC-1`

**Decider:** `cixzhang`、`2026-10-01`

现有的惰性 span 使用 `role="group"`，使其译后的 `aria-label` 有效，同时不创建导航、焦点或视觉/DOM 子节点。无 role 的通用 span 无法被命名；`group` 是非交互、支持命名的 role，也是保留当前根与呈现的最小修复。

如果受支持的平台原语能够为惰性行内内容命名而不产生 group 边界播报，或者有证据表明 group 语义在大量引用阅读时会造成损害，则重新考虑该机制。

## Open questions

无。

## Content boundary

本文件不重复使用方 prop 表/示例、当前审查结果、实现步骤、导航系统理由或资源策略。它链接到各自的所有者。
