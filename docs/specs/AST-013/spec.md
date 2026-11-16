---
schema_version: 4
template_version: 1
kind: system-spec
id: spec:AST-013
authority: current
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-09-01
phase: accepted
owners: [cixzhang, imdreamrunner]
affects_architecture:
  [architecture:layer-runtime, architecture:public-component-api]
affects_families: [family:overlay-dismissal]
affects_contributing: [contributing:api-conventions]
affects_consumer_docs:
  [browser-support, useLayer, Popover, Toast, Dialog, useEntryAnimation]
---

# Browser and platform support system spec

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "platform": [
      "FR1",
      "FR3",
      "FR5",
      "FR6",
      "FR7",
      "FR8",
      "FR9",
      "FR10",
      "FR12",
      "FR13"
    ]
  }
}
```

## Intent

让稳定的 Astryx Web 组件在浏览器支持、原生特性采纳与缩减回退上拥有唯一所有者。组件规格继承这份共享基线，并且只记录显式的例外。

完全路径与回退路径都必须满足该组件当前的无障碍契约以及适用的 [WCAG 2.2 Level AA](https://www.w3.org/TR/WCAG22/) 要求。辅助技术证据仍由其他所有者负责。

## Non-goals

- 当用户结果等价时，要求相同的实现或像素。
- 为每一个缺失的浏览器特性做 polyfill。
- 取代 [AST-003](../AST-003/spec.md) 中的层专用契约，或 [AST-002](../AST-002/spec.md) 中的公共 API 准入规则。
- 在本规格的 pull request 中实现生成的行、使用方文档更新、CI 或发布工具。

## Requirements

- **FR1 — 一个滚动的兼容性模型。** 当前 Web Platform Baseline 是完全支持层级。Baseline 减两年是缩减回退层级。低于该层级，Astryx 不做任何支持承诺。
- **FR2 — 兼容性行是生成的。** 浏览器/版本行由已批准的 Baseline 数据与权威的浏览器发布数据生成；它们绝不作为手写的版本声明来维护。生成的行位于公共的 [Browser Support guide](../../../packages/cli/assets/docs/browser-support.doc.mjs) 中，并记录其来源与刷新日期。TypeScript 目标、构建目标与特性表都不是支持证据。
- **FR3 — 显式浏览器支持行始终包含在内。** 独立于生成的 Baseline 覆盖范围，Astryx 显式支持：
  - 桌面端最新稳定版 Chrome；
  - 最新稳定版 iOS 上的 Safari；以及
  - 对于触控形态，最新稳定版 Android 上的 Chrome（`spec:AST-094`）。

  “最新”指从权威浏览器发布数据中识别并刷新的当前稳定版本，而不是手写的版本。其他浏览器仍可由生成的 Baseline 兼容性行来表示；本决策不把桌面端 Safari 或 Firefox 命名为额外的显式支持行。

- **FR4 — 兼容性、显式支持与测试覆盖保持区分。** Browser Support 指南分别标注生成的 Baseline 兼容性、具名的显式支持与当前测试覆盖。浏览器被纳入生成的兼容性或显式支持，并不意味着在该浏览器中存在自动化测试通道或逐 pull request 的证明。
- **FR5 — 受支持的浏览器获得完整的必需行为。** 完全支持层级中的每个浏览器以及每条具名的显式支持行，都获得该组件当前的行为、无障碍、状态、渲染器与交互契约。缺失的原生特性不会静默收窄这些要求。
- **FR6 — 原生特性通过能力检测。** 组件检测它们所使用的 API 或 CSS 能力，而不是从浏览器名称推断该能力。只有在缺陷可复现、具备回归测试夹具并附有复核或移除条件时，才允许采用窄范围的引擎规避方案。
- **FR7 — 缩减回退保留任务。** 在 Baseline 减两年的层级中，组件要么提供等价行为，要么记录一份缩减回退。回退只能省略具名的增强，并且必须保留主要任务、适用的无障碍要求、稳定的状态与回调、清理以及重复使用。
- **FR8 — 缩减回退不得损坏。** 它不得抛出异常、渲染无效或 `NaN` 几何值、隐藏必要内容、使控件不可达、使焦点孤立或被困、阻塞周围页面、破坏受控状态、一直停留在挂起状态，或闪现虚假的打开、关闭、加载、定位或样式化状态。
- **FR9 — SSR 与 hydration 保持一致。** Core 组件具备 SSR 能力，除非其组件规格记录了 FR12 例外。客户端指令不会豁免某个组件，因为框架会在服务端渲染客户端组件。具备 SSR 能力的组件，在服务端渲染期间以及在水合服务端标记的客户端渲染期间，都不读取浏览器能力、几何、输入模态、绘制时机或 user-agent 状态。水合渲染产生的标记与服务端相同。水合后的增强从可用状态开始，并且不引入不匹配、损坏的中间状态或可见的虚假状态。
- **FR10 — 浏览器拥有的行为需要真实浏览器证据。** 源码、单元与 jsdom 测试可以证明防护逻辑与确定性状态。对布局、绘制、焦点、原生 Popover 或 Dialog 行为、顶层顺序、浏览器事件时机或 hydration 表现的改动，需要真实浏览器证据。当某项改动对具名浏览器作出声明、修复仅在该浏览器中复现的缺陷，或改变浏览器兼容性时，该证据必须来自声明所覆盖的真实浏览器。Chromium 不能替代 iOS Safari 的声明，Playwright WebKit 也不能证明 Safari 的行为。

  显式支持是一项维护承诺，而不是逐项改动的证明义务。常规改动使用与其声明相称的证据，并且无需在合入前证明每一个受支持的浏览器。在显式支持的浏览器中复现的缺陷，仍属 Astryx 调查与修复的责任；缺失自动化既不会收窄支持，也不能成为驳回的理由。

- **FR11 — 提高下限属于兼容性工作。** 移除受支持的浏览器、将其从完整行为降为缩减回退，或移除已记录的回退，需要所有者批准、[`spec:AST-017`](../AST-017/spec.md) 所要求的分类与生命周期、用户影响与迁移说明、更新后的生成行、针对兼容性声明所影响浏览器的真实浏览器证据，以及证明其余每条完全支持行与具名显式支持行仍获得完整必需行为的证据。
- **FR12 — 组件规格继承基线。** 组件规格链接 `spec:AST-013`，并且只记录更严格的要求或显式的例外。例外须指明受影响的能力、可观察的缩减、保留的 FR7–FR9 义务、证据、所有者与复核条件。
- **FR13 — 服务端渲染的元素跳过其挂载动画。** 存在于服务端标记中的元素在水合时处于其稳定状态，并且不播放在挂载时播放的动画（其入场动画）。该挂载动画只为客户端在水合后挂载的元素播放，或在仅客户端根中于首次绘制之后播放。已水合元素之后的打开、显示与状态转换不在本要求范围内，并且减少动效的行为不变。

### Platform support

- 完全支持：当前 Web Platform Baseline，加上 FR3 中具名的显式支持行。
- 缩减回退：Baseline 减两年，满足 FR7–FR9。
- 不支持：低于 Baseline 减两年；Astryx 不做支持承诺。
- 浏览器证据：浏览器拥有的行为需要真实浏览器证据。针对具名浏览器的特定声明需要该真实浏览器，而不是作为对每项改动的统一门禁。

## Current-state impact

公共指南目前有手写的 Baseline 层级与版本行。对生成的兼容性、显式支持与当前测试覆盖进行三方标注的必需工作仍属于实现工作。当前的自动化浏览器覆盖主要运行 Chromium；该覆盖既不定义也不收窄支持。常规改动可以带着与其声明相称的证据合入。在显式支持的浏览器中复现的缺陷，无论是否存在自动化测试通道，都应可处理。

`useEntryAnimation` 以及经由它的 FieldStatus，根据其首次渲染时捕获的首次绘制标记来决定是否播放动画。当标记在页面绘制之后水合时，水合渲染会产生服务端未发送的入场动画类，而该 hook 的使用方文档称其不支持服务端渲染。

其他已知的 FR9 与 FR13 缺口：CodeBlock 的折叠箭头在页面加载时播放其显现动画；并且 CodeBlock 在渲染期间根据浏览器能力与 user-agent 检查在 token-span 与 Highlight API 标记之间选择，因此水合渲染可能与服务端标记不同。

## Verification

| Contract  | Required evidence                                                                                                                                            | Failure signal                                                                                           |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| FR1–FR5   | 生成行检查，加上指南/包/支持/测试的对账                                                                                                                      | 手写或构建版本成为支持声明、显式支持行消失，或受支持行为被缩减                                           |
| FR6–FR8   | 特性存在/缺失测试与启用的回退测试夹具                                                                                                                        | 浏览器嗅探选择了常规行为，或回退不可用、不可访问、不稳定或明显损坏                                       |
| FR9, FR13 | 先服务端渲染再水合：无水合警告或可恢复错误、水合后的属性等于服务端标记、水合后的客户端挂载仍播放其挂载动画，外加真实浏览器的服务端渲染、水合与水合后测试夹具 | 标记出现分歧、在服务端或水合期间读取浏览器状态、服务端渲染的元素播放其挂载动画，或闪现虚假/损坏状态      |
| FR10      | 浏览器拥有行为的真实浏览器证据；针对特定声明、仅限浏览器的缺陷与兼容性改动使用该真实具名浏览器                                                               | 浏览器拥有的行为被归功于 jsdom、以另一引擎顶替具名浏览器声明，或受支持浏览器的缺陷因缺少测试通道而被驳回 |
| FR11–FR12 | 发布审查与知识记录检查                                                                                                                                       | 下限或回退未经兼容性处理即消失，或组件静默覆盖基线                                                       |

## Decision log

### DEC-1 — Rolling Baseline tiers plus official browser rows

**Reference:** `spec:AST-013/DEC-1`

**Decider:** `cixzhang`, `2026-09-01`

Astryx 使用当前 Web Platform Baseline 作为完全支持，使用 Baseline 减两年作为缩减回退，低于该层级不做承诺。桌面端最新稳定版 Chrome 与最新稳定版 iOS 上的 Safari 始终作为官方支持与测试行纳入，独立于生成的 Baseline 覆盖范围；触控形态再加上最新稳定版 Android 上的 Chrome（`spec:AST-094`）。生成的兼容性行与具名的官方测试矩阵仍是相互独立的公共事实。

### DEC-2 — Explicit support does not require proof on every change

**Reference:** `spec:AST-013/DEC-2`

**Decider:** `cixzhang`, `2026-09-02`

DEC-1 的具名浏览器行是显式支持行，而不是必需的自动化或逐项改动测试矩阵。Astryx 会调查并修复在这些浏览器中复现的缺陷，但常规改动无需在合入前证明每一个受支持的浏览器。当改动作出浏览器特定的声明、修复仅在该处复现的缺陷或改变兼容性时，需要真实浏览器证据。缺失自动化既不会收窄支持，也不能成为驳回已复现缺陷的理由。

### DEC-3 — Core hydrates to the server markup; server-rendered elements skip their mount animation

**Reference:** `spec:AST-013/DEC-3`

**Decider:** `cixzhang`, `2026-10-15`

Core 组件在服务端与进行水合的客户端渲染中渲染相同的标记（包括客户端组件），并且服务端渲染的元素保持稳定状态，而不播放其挂载动画。已否决：使用方文档中的“不支持 SSR”例外，因为 FR12 只在组件规格中记录例外。已否决：在水合之后才变为 true 的“已绘制”快照，因为它会让页面加载时已存在的元素播放动画。

## Open questions

无。
