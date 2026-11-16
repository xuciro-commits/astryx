---
schema_version: 1
template_version: 3
kind: architecture
id: architecture:rtl-audit-evidence
authority: current
archive_reason: null
superseded_by: null
approved_by: nynexman4464
approved_at: 2026-10-15
owners: [nynexman4464, cixzhang, imdreamrunner]
applies_to:
  [
    apps/storybook/rtl-audit/,
    scripts/component-packages.cjs,
    .github/workflows/ci.yml,
    .github/scripts/rtl-audit-coverage.test.mjs,
    .github/scripts/rtl-join.mjs,
    .github/scripts/rtl-report-completion.mjs,
    .github/scripts/rtl-shard-scope.mjs,
    .github/scripts/rtl-scorecard-summary.mjs,
    internal/eslint-plugin-astryx/no-physical-properties.js,
  ]
verified_by:
  [
    .github/scripts/rtl-audit-coarse-hit.browser.test.mjs,
    .github/scripts/rtl-audit-coverage.test.mjs,
    .github/scripts/rtl-scorecard-failures.test.mjs,
    .github/scripts/rtl-scorecard-summary.test.mjs,
    .github/scripts/rtl-join.test.mjs,
    .github/scripts/rtl-report-completion.test.mjs,
    .github/scripts/rtl-shard-scope.test.mjs,
    internal/eslint-plugin-astryx/no-physical-properties.test.mjs,
  ]
deciding_specs: []
---

# RTL audit evidence architecture

<!-- review-applicability:v1 -->

```json
{
  "scope": "global",
  "triggers": {
    "testing": [
      "INV1",
      "INV2",
      "INV3",
      "INV4",
      "INV6",
      "INV9",
      "INV10",
      "INV12",
      "INV13",
      "INV14",
      "INV16"
    ]
  }
}
```

## Contract at a glance

| 领域          | 契约                                                                                                                                                                                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 治理契约      | `design:bidirectionality` 定义正确的 RTL 行为意味着什么；组件契约负责局部语义、例外和验证。产品契约不变；本记录负责证据准入与时效性。                                                                                                                                                                          |
| 系统行为      | 活动清单中的每个组件都有交代；范围内可用的 story 以 LTR 和 RTL 渲染。结果区分已测量、已验证不适用（N/A）、覆盖缺口和行为失败。Lint 与渲染审计证明的是不同的主张。                                                                                                                                              |
| 最终用户影响  | 阅读 RTL 界面的用户受到真正观察到镜像、顺序、位置、几何和行为之证据的保护，而不是受到一份什么都没测量的绿色报告的保护。                                                                                                                                                                                        |
| 构建者影响    | 新增或变更的组件必须由适用的检查测量，或带有明确的缺口；行为失败没有允许列表。已验证 N/A 和既有债务的准入仍待所有者决策（OQ1、OQ2）。                                                                                                                                                                          |
| 兼容性/就绪度 | INV12–INV16 规定了 D1 fixture 元数据和稳定选择，以及 D5 图表绘图区声明（`rtlAudit.D5`），但尚非已发布的强制执行。组件级 N/A 准入、历史债务和必需检查的推广仍未解决；D7 按每个已配置原生目标的最小值强制执行。                                                                                                  |
| 评审检查项    | 拒绝以 lint 代替渲染证据（INV1）；拒绝把行为失败改贴标签的允许列表（INV3）；拒绝把全 N/A 计为 RTL 就绪（INV4）；拒绝组件因 story 移动而掉出清单（INV5）；拒绝没有红/绿变异凭证的新维度（INV9）；拒绝在有方向性控件/提示上使用 D1 排除，或拒绝缺少面向评审披露的 D1 排除或 D5 图表声明（INV12、INV13、INV16）。 |
| 治理规则      | 没有决定性的系统规范；适用 `architecture:knowledge-contracts` 的证据时效性与人工决策规则。                                                                                                                                                                                                                     |

本表是评审用的投影；下文正文具有权威性。

## Purpose

Astryx 需要能够区分三种主张的评审证据：

1. 组件的方向敏感行为确实被测量过；
2. RTL 确实不适用于该组件；或
3. RTL 适用性仍是未测量的债务。

一条通过的 lint 规则、一份全 N/A 的浏览器报告或一个已签入的例外，绝不能被认为证明了超出其观察范围的东西。参考 fixture 的维度级不适用与组件级的已验证 N/A 声明不同。前者描述单个 story 的语义；后者需要针对整个组件的证据。

当 RTL 测试、证据主张或豁免与变更相关时，全局 `testing` 路由提供共享证据和排除评审主张。它不提供组件行为或视觉意图：`design:bidirectionality` 负责那些关系，组件/模块契约负责局部状态及其验证映射。匹配此路由既不要求每个组件都实现审计运行器，也不把工作流拓扑、未解决的 N/A/债务准入或门禁推广决策作为通用组件规则引入。评审只在其声明的证据范围内应用被路由的主张；草稿路由仍然不具权威性。

## System model

```text
changed component or full-library sweep
  → discover the live component roster across every registered component package
  → render relevant stories LTR and RTL
  → run automatic relationship checks
  → run curated component checks
  → combine results per component
       measured
       verified N/A
       unexplained coverage gap
       optional known debt (unresolved proposal)
  → report behavior failures, stale evidence, and applicability state
```

Lint 与渲染审计互为补充：

- lint 拒绝那些仅凭声明即可证明方向性失败的源码模式；
- 浏览器检查证明计算后的几何、可见性、顺序、命中目标、滚动/拖拽行为和组合变换；
- 已验证 N/A 的证据（若被准入）只能证明经评审的源码和 story 当前没有暴露方向敏感关系。

## Boundaries and invariants

- **INV1 — 证据跟随主张。** 源码 lint 不得代替计算几何或交互。渲染截图不得代替键盘、拖拽、滚动或命中测试行为。当 story 未渲染某些状态时，浏览器关系检查不得声称每个组件状态都已执行。
- **INV2 — RTL 按关系来评分。** 方向性证据比较同一构建源码的 LTR 与 RTL 结果。像素一致性不是契约；语义镜像、顺序、侧边、几何和行为才是。
- **INV3 — 行为失败没有允许列表。** 当适用的自动或精选维度显示镜像、顺序、位置、几何或行为不正确时，结果就是一项发现。已知历史不会把不正确的 RTL 行为变成通过或 N/A。
- **INV4 — 全 N/A 不等于已测量。** 所有维度均为 N/A 的组件没有正向 RTL 证据。它要么在已准入的证据策略下被验证为不适用，要么仍然是覆盖缺口/债务。
- **INV5 — 活动源码清单决定覆盖范围。** 清单是每个注册为组件包的包中的每个公共组件，而不只是 Core 和 Lab。组件不能仅仅因为没有 story 或其 story 标题改变就从评审中消失。当组件在范围内时，缺少可渲染性本身就是覆盖缺口。
- **INV6 — 自动与精选覆盖共同组合。** 通用检查覆盖可广泛发现的图标、装饰和位置关系。组件特定选择器仅用于通用发现无法推断的语义，如顺序、滚动方向、覆盖层侧边或触摸目标归属。
- **INV7 — PR 范围与全清单范围回答不同的问题。** RTL 审计在合并到 `main` 后运行（一批推送在其最新提交处检查一次），并在每次发布前以全范围运行；拉取请求仅在带有 `ci:run-rtl` 标签时以受影响范围运行（spec:AST-030 FR12、DEC-7），否则只在默认的受影响组件检查中审计变更触及的组件。当拉取请求带标签运行时，它检查变更影响的组件；它可以按包分别运行，但 PR 结果是每个包范围的合并，缺少任一范围都不能通过。全范围运行检查活动清单和共享回归。两者不会悄然互相替代。
- **INV8 — 适用证据会使 N/A 失效。** 新的适用自动或精选维度必须使现有的已验证 N/A 声明过期。源码与 story 字节失效是一项提议的额外关闭要求，而不是当前仅依据理由的注册表的能力。
- **INV9 — 证据变异证明门禁有效。** 新的审计规则或维度必须证明相关缺陷在无规则时未被察觉、在规则生效后能被检测到。仅有通过的正常路径不能证明强制执行。
- **INV10 — 触摸目标证据包括尺寸和对齐。** 对于粗略指针目标，仅证明目标中心与可见控件匹配是不够的。浏览器证据还必须按照所属组件声明的最小尺寸测量有效/原生目标。D7 使用每个目标配置的最小值，在居中和命中测试之外同时强制执行两个原生维度；它不指定通用最小值。
- **INV11 — 审计状态不是产品意图。** 本架构负责证据准入与时效性。正确双向行为的人类含义属于 `design:bidirectionality`；组件契约负责局部语义、例外和验证。
- **INV12 — Fixture 适用性跟随语义角色。** D1 图标镜像适用于用作方向性控件或提示的图形。将调用方提供的左/右字形几何作为数据展示的参考 fixture 可以声明 D1 不适用。仅字形形状本身不会使样本成为方向性控件，排除不得隐藏适用的行为失败。INV16 中的人工评审与披露要求适用于显式排除。
- **INV13 — Story 排除是有类型的、已解析的，并默认失败（fail closed）。** 被准入的 story 元数据是 `rtlAudit.D1`（`applicable: false` 且带有解释 INV12 的非空 `reason`），以及 `rtlAudit.D5`（`physical: 'chart'` 且带有非空 `within` 绘图区选择器），后者声明一个其覆盖层保持物理位置的绘图区（`design:bidirectionality` DR5），而不关闭 D5。审计读取已解析的 Storybook 参数，包括常规的 story 覆盖 meta 的优先级。缺少渲染元数据、参数格式错误、不支持的维度键，以及没有理由的排除，必须产生错误而不是悄然跳过检查。解析后的 `rtlAudit` 对象为空表示没有排除；理由不是组件级批准。
- **INV14 — D1 排除只改变 D1。** D5 和 D6 必须仍然扫描每个范围内的 story，包括被 D1 排除的参考 fixture。其他组件 story 仍然是 D1 候选。如果所有 D1 候选都被排除，D1 报告 N/A，并列出被排除的 story 和理由；这不是已测量证据，也不关闭组件覆盖缺口或授予已验证 N/A。
- **INV15 — D1 选择与完成身份是稳定的。** 审计按 story 源码路径、源码导出顺序、再按 story id 对候选排序，并选择第一个未被显式排除出 D1 的候选。生成索引的插入顺序不得用于选择代表。当另一个候选运行或所有候选都被排除时，计划身份保持不变；被选中的 story 单独保留，以便报告指明实际运行的内容。包/分片合并必须核对精确的计划/完成身份，而不仅仅是数量相等。
- **INV16 — 有意的 D1 豁免需经评审并可见。** 新增或扩大显式 D1 排除，或更改被排除 story 的语义角色，必须通过常规拉取请求评审获得人工评审。新增一个继承 meta 级排除的 story 也算作扩大该排除。评审者检查每个受影响的 story，包括继承 meta 级参数的 story，并拒绝其图形充当方向性控件或提示的排除。非空理由只能证明元数据有效，不能证明不适用有效。面向评审的审计输出必须列出审计范围内所有已声明的 D1 排除，包括其规范组件、story id、维度和理由，包括未被选为 D1 代表的 story。`rtlAudit.D5` 物理区域声明接受同样的评审和披露：新增或扩大一项会被评审，输出列出每个声明及其组件、story id、类型和绘图区选择器。报告不得把缺少 D1 测量称为方向行为正确的证明。因未发现方向性图标而自动产生 N/A 不需要额外人工批准；未变更的豁免不会在每次审计运行时重新批准。本规则不接纳组件级已验证 N/A 或历史覆盖债务。

## Change coupling

对审计维度、组件发现、精选目标、适用性注册表、提议的证据哈希、工作流范围、摘要或 RTL lint 的变更必须评审本记录。

新的方向敏感组件契约必须将其要求映射到可执行证据，否则保留为显式缺口。如果所有者接纳带字节绑定关闭的已验证 N/A 或已知债务，实现必须将该证据绑定到规范源码、直接拥有的辅助文件/样式和拥有的 story，以便相关变更会失效过期，而不是悄然保留其旧分类。

组件级已验证 N/A 准入、历史覆盖债务基线和必需检查推广在所有者决定这些边界之前仍不属于已定案的主张。它们不阻止维度级 fixture 策略的主张范围内批准。D1 排除不隐含关于这些更广状态的任何决定。

### Audit dimensions

审计的 `D` 标识符命名的是仓库特定检查，而不是外部国际化标准。自动发现覆盖 D1、D5 和 D6；精选 story 目标提供其他维度。

| ID  | 观察到的关系                                                                                                                |
| --- | --------------------------------------------------------------------------------------------------------------------------- |
| D1  | 方向性图标镜像或交换一次。                                                                                                  |
| D2  | 上一/下一控件交换水平顺序。                                                                                                 |
| D3  | 方向性交互或滚动行为跟随活动方向。                                                                                          |
| D4  | 覆盖层或定位的可用性元素跟随其逻辑侧。                                                                                      |
| D5  | 定位元素相对于其父级镜像；在 story 声明的图表绘图区（`rtlAudit.D5`）内，它们保持物理位置（`design:bidirectionality` DR5）。 |
| D6  | 上下文方向性装饰恰好接受一次双向处理。                                                                                      |
| D7  | 粗略指针的原生输入尺寸、中心和命中测试满足所属目标契约。                                                                    |
| D8  | 逻辑行内内边距解析为镜像的物理边缘。                                                                                        |
| D9  | 成组圆角遵循声明的逻辑行内侧。                                                                                              |

D7 同时保留原生输入框和可见包装框。其 `minimumTargetSize` 宽度和高度来自精选目标所属的组件/组合契约；缺失或无效的尺寸会产生错误。

## Owning code

- `apps/storybook/rtl-audit/rtl-audit.mjs` — 渲染并比较 LTR/RTL 行为。
- `apps/storybook/rtl-audit/rtl-audit-coverage.mjs` — 发现活动清单并组合已测量、N/A 和缺口状态。
- `scripts/component-packages.cjs` — 组件包注册表，其公共组件构成清单。
- `apps/storybook/rtl-audit/targets.json` — 精选的 D2/D3/D4/D7/D8/D9 目标。
- `apps/storybook/rtl-audit/story-parameters.ts` — 计划中的类型化 D1 fixture 适用性接口，基础实现中不存在。
- `apps/storybook/.storybook/preview.tsx` — 计划在现有 Storybook 根上提供已解析 story 元数据，不在渲染 story 周围添加包装器或同级元素。
- `apps/storybook/stories/SVGIconRegistry.stories.tsx` — 参考字形数据；与 SVGIcon 所有者的关联和 D1 元数据等待 fixture 策略实现。
- `apps/storybook/rtl-audit/verified-not-applicable.json` — 候选已验证 N/A 注册表；其准入策略尚未解决（OQ1）。
- 历史覆盖债务准入尚未解决。本契约不包含额外的债务基线文件；缺失的测量仍然是可见缺口。
- `.github/workflows/ci.yml` — 受影响组件的 PR 审计，按组件包分片并合并为一个结果。
- `.github/scripts/rtl-join.mjs`、`rtl-report-completion.mjs` 和 `rtl-shard-scope.mjs` — 精确的包/分片范围与完成度核对。
- `.github/scripts/rtl-scorecard-summary.mjs` — 面向评审的评分卡投影；报告完整性和排除可见性仍是要求，而不是压制发现的授权。
- `.github/workflows/ci.yml` release-check — main 顶端每三小时及每个工作日发布切分前运行的全清单审计（`spec:AST-030` DEC-19）。
- `internal/eslint-plugin-astryx/no-physical-properties.js` — 源码可证明的物理/逻辑声明约束。
- `design:bidirectionality` — 人类产品意图，单独拥有。

已发布的 RTL 机制本身仍缺少一个规范架构所有者。后续的 `architecture:bidirectional-layout` 记录应负责 CSS 逻辑属性、`rtlStyles`、惰性 DOM 方向读取、居中辅助函数以及首绘/水合不变量。本证据记录不得被视为那个缺失的实现契约。

## Deciding specs

当前没有系统规范确定已验证 N/A 或已知债务的准入。当前知识架构要求证据时效性和明确的人工决策；本记录将剩余决策收敛为以下选项。

## Verification

| 不变量           | 证据                                                                                       | 失败信号                                                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| INV1、INV2、INV6 | 聚焦审计 fixture 加真实构建的 Storybook 变异                                               | 仅源码规则声称渲染正确，或关系缺陷保持绿色                                                                                                                |
| INV3             | 自动/精选失败测试和 RTL 评分卡测试                                                         | 已知不良 RTL 结果被当作预期或 N/A 压制                                                                                                                    |
| INV4、INV5       | 缺少 story 或无适用 story 的覆盖 fixture                                                   | 组件消失或全 N/A 被报告为 RTL 就绪                                                                                                                        |
| INV7             | PR 工作流范围测试和发布检查工作流测试                                                      | 变更组件被跳过，或全清单债务被误认为仅 PR 证据                                                                                                            |
| INV8             | 自动/精选适用性测试                                                                        | 新适用的维度使已验证 N/A 声明仍为当前                                                                                                                     |
| INV9             | 每个新维度的红/绿变异凭证                                                                  | 新维度只有通过的自证测试                                                                                                                                  |
| INV10            | 原生宽度/高度变异 fixture 加 LTR/RTL、sm/md 下的 D7 中心/命中检查                          | 过小的原生目标尽管包装几何合规仍保持绿色                                                                                                                  |
| INV12–INV16      | 候选 fixture 策略测试和构建的 Storybook 变异；基础实现不强制执行                           | 重排生成的 story 索引会改变 D1；格式错误/缺失的元数据被悄然跳过；fixture 退出会跳过 D5/D6 或关闭组件缺口；方向性控件/提示上的排除通过语义评审或被摘要遗漏 |
| D5 (DR5)         | 定位对评分和 `rtlAudit.D5` 验证测试，加上真实构建 Storybook 中已声明的 Recharts 主题 story | 镜像的图表 tooltip 通过，未声明的覆盖层被评分为物理，或格式错误的 `rtlAudit.D5` 声明被接受                                                                |

### Implementation state

基础审计实现现有的自动/精选检查和组件覆盖汇总。INV12–INV16 定义维度级 fixture 策略和稳定选择契约；它们的元数据传输和聚焦变异测试不属于基础实现。它们需要单独的实现验证。所有者可以在实现之前批准该预期契约，而不称其新检查已发布或强制执行。INV16 下完整的排除摘要覆盖仍是实现工作；仅审计通过不是对新增或变更豁免所需的评审。

### Candidate evidence states

| 状态         | 最低证据                                                                    | 可清除新增/变更组件？ | 当前决策状态       |
| ------------ | --------------------------------------------------------------------------- | --------------------- | ------------------ |
| 已测量       | 至少一个适用的关系或行为检查通过；每个适用的检查都通过                      | 是                    | 由当前审计行为确定 |
| 已验证 N/A   | 当前：经人工评审的理由；提议：带 fail-closed 失效的源码/辅助文件/story 证据 | 未解决                | 需要所有者决策     |
| 覆盖缺口     | 没有适用的测量，也没有已准入的当前 N/A 证据                                 | 否                    | 已确定             |
| 已知既有债务 | 提议的仅移除基线条目，在未变更时保持可见且不失败                            | 未解决                | 需要所有者决策     |
| 行为失败     | 适用维度失败                                                                | 否                    | 已确定；无压制     |
| 过期证据     | 当前：出现适用维度；提议：记录的证据字节变化                                | 否                    | 部分实现           |

### Current enforcement gaps

- 仅依据理由的已验证 N/A 注册表在自动/精选维度变为适用时会过期，但尚未把证据绑定到源码/辅助文件/story 字节。
- CI 摘要代码仍包含一条未使用的 `knownNotRtl` 标签路径，尽管报告不输出此类允许列表。请移除它，以免实现被解读为允许已知行为失败。
- 组件/组合记录和 AST-020 负责粗略指针的最小目标尺寸。本审计记录不指定通用像素最小值。

## Open decisions

### OQ1 — Is verified N/A an admitted closure state?

- **选项 A：** 当一项声明带有具体理由时准入已验证 N/A。在该选项成为当前之前，需增加对规范源码、直接拥有的辅助文件/样式和拥有的 story 的证据，以及 fail-closed 失效。这承认真正方向中立的组件，而不必制造无意义的浏览器测试。
- **选项 B：** 要求每个组件都有可执行的渲染测量。这消除了基于判断的 N/A，但会迫使对没有方向关系的组件进行人为检查。

### OQ2 — May pre-existing unexplained all-N/A enter removal-only known debt?

- **选项 A：** 将现有缺口快照为可见、不失败的债务，而新缺口、过期条目、行为失败以及未变为已测量/N/A 的移除继续失败。这允许逐步推广而不隐藏清单。
- **选项 B：** 让每个未解释缺口都保持失败。这更简单和严格，但在完整历史清单被测量或评审之前，审计会一直保持红色。

### OQ3 — When does RTL become a required merge check?

当前 PR 审计是软门禁。所有者必须在将其设为必需之前选择前置的清洁状态和稳定窗口。无论门禁状态如何，报告必须保持真实，行为失败不得改贴标签。
