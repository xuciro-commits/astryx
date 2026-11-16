# Astryx 仓库指南

Astryx 是一个公开的设计系统仓库。切勿提交内部链接、标识符、服务名称、私有运营说明或其他仅限 Meta 上下文的内容。

## 指令入口

本 `AGENTS.md` 是该仓库的规范指令入口，与具体工具无关。共享的 agent 指导应在此处添加或修改，而不是复制到特定工具的指令文件中。真正与路径相关的指导应放在嵌套的 `AGENTS.md` 中。

## 从这里开始

- 产品构建者：使用 `astryx docs`、组件 `{Name}.doc.mjs` 文件以及 `packages/cli/assets/docs/`。
- 贡献者：阅读 `CONTRIBUTING.md` 以及 `docs/README.md` 中链接的相关指导。
- CLI 输出：agent 会读取命令打印的每一个字节。要考虑答案有多长，并让 agent 测试改动，正如 `docs/contributing/cli-conventions.md`（“Output: keep answers short”）所说。
- Pull request：选择一个主要意图，并使用 `.github/PULL_REQUEST_TEMPLATE/` 下对应的模板；在打开或审查混合改动之前，先阅读 `docs/contributing/pull-requests.md`。在请求审查之前，请从全新的会话运行 `pnpm review:pre` 及其检查清单。
- 组件工作：推导审查的语义触发条件，用 `node scripts/review-global-baselines.mjs --authority-commit <base-sha> --review-head <head-sha> --triggers <comma-separated-triggers>` 加载匹配的 `current` 全局基线声明，然后读取组件的 `docs/specs/components/<ComponentRoot>/{Name}.spec.md`（若存在），以及它列出的任何 `module:*` 记录。先加载全局记录，再加载更窄的所有者记录，但当直接组件或 family 所有者管辖确切差异时，应优先解析它。全局路由只暴露所列的声明；它绝不会让整条记录管辖该组件或改动。在审查回执中保留每一条匹配的记录、声明、触发条件和匹配原因。
- 编辑某个路径之前，先运行 `pnpm specs:for <path>`。编辑之后、提交或推送之前，运行 `pnpm specs:for --diff origin/main` 并遵循每一条按关注点路由的声明。
- 任意路径：`pnpm specs:for <path>` 会列出链接到它的当前记录、决定这些记录的规范，以及其组件触发条件所路由的全局声明。它读取工作树，因此在 pull request 分支上会显示该分支提议的记录；它是查询，不是审查权威。它是对上述组件审查步骤的补充，而非替代。
- 组件本地视觉意图：仅当持久的本地意图必须在未来重新设计中保留时，才复用或修改当前组件/模块规范中可选的 `Design decisions` 表。将精确调参保留在代码/证据中，将共享规则保留在 `docs/design/` 中。DESIGNOWNER 作者可以在一个仅涉及外观的原子 PR 中，将该本地意图与像素和证据一并提交。外部贡献者遵循常规贡献流程，永远不会被要求撰写规范；缺失的权威由维护者负责。
- 在向组件添加新的 `data-*` 属性之前，将其视为公共 API：主题会基于 data 属性生成选择器。仅当当前记录指明它并说明原因时才添加（[`architecture:public-component-api`](docs/architecture/public-component-api.md) DEC-2）。对于动态的每实例样式，首先使用 StyleX 动态样式（`stylex.create({x: (v) => ({...})})`），它会设置一个私有 CSS 变量；绝不要仅为提供 CSS 而添加 data 属性。对于任何其他仅内部关注的问题，使用 INV23 下的私有 `data-astryx-*` 属性，或不使用属性。
- 层：锚定层仅通过 CSS 锚点定位跟随其锚点；脚本绝不会移动层来跟随锚点（[`architecture:layer-runtime`](docs/architecture/layer-runtime.md) INV21）。按下只缩放触发元素自身的视觉；层渲染在其外部，并锚定到未变换的盒子（INV22）。
- 跨组件工作：阅读 `docs/families/` 下的相关契约、`docs/design/` 下的适用设计规范，以及 `docs/architecture/` 下的当前架构。
- 有重大影响的共享系统改动：使用 `docs/specs/` 下的记录。
- 撰写或审查任何知识记录：对记录运行 `docs/contributing/spec-writing.md` 中的评分标准，并将结果放在 pull request 描述的 `## Writing rubric results` 下。记录以现在时描述系统；提案、历史、pull request、研究以及项目状态（目前已构建了什么、先做什么）都不应写入其中。审查时，对照报告的结果阅读记录；缺少这些结果的记录 pull request 是不完整的，因此在审查内容之前应先要求提供。
- 集成贡献工作：阅读 `docs/specs/AST-039/spec.md`。每个新的可发现项都拥有一个强类型、同名主干 `.doc.mjs`；根清单定位目录，绝不编目其项目。绝不要有目录文件（如 `themes/manifest.json`），也绝不要在清单中有逐项映射。

## 权威

知识记录会声明 `authority`：

- `draft`：不具权威性；仍可能需要证据或所有者审查；
- `current`：已明确批准且具有权威性；
- `archived`：仅作背景参考，需附原因（如 `superseded`、`withdrawn` 或 `historical`），若存在替代链接则一并提供。

只有 `current` 记录对实现和审查具有约束力。绝不要从已合并的代码、沉默、旧审查或现有 wiki 页面推断出批准。

## 判断边界

从代码、测试和浏览器证据中解决可检查的行为。仅当稳定的公共 API、主题契约、所有权边界、兼容性策略或真正主观的视觉方向仍未确定时，才询问人类。一次只问一个问题。

在起草、审查或实现提议的结果之前，使用提议的规范所有者/ID、受影响的路径和导出的符号，以及该行为的语义术语，搜索当前记录和未关闭的 pull request。默认应扩展或投影现有的规范所有者。仅为不同的事实边界创建新记录，并说明为什么现有所有者无法容纳它。不要为已完成、已有所有者或已被取代的工作创建新政策。

## 验证

在编辑知识记录或模板后运行 `pnpm check:knowledge`。实质性的模板形状变更需要提升 schema 版本并迁移活跃记录；仅更改模板指南不会重写已接受的历史。

## 自定义命令

### `/vibe-test [count]` - 运行 vibeability 测试

测试 AGENTS.md 在多大程度上帮助 LLM 生成正确的 Astryx 组件代码。

**用法：**

```
/vibe-test 5                    # Run 5 stratified sample tests (one-shot)
/vibe-test                      # Run all 21 tests (one-shot)
/vibe-test 5 --degradation      # Run 5 tests with degradation curve (10-turn)
```

**执行方式：**

1. 运行 `pnpm -F @astryxdesign/vibe-tests interactive --sample <count>` 设置迭代
2. 为每个测试提示生成并行子 agent：
   - 从 `results/<iteration>/tasks/{promptId}.json` 读取任务文件
   - 使用 Astryx 组件为提示生成代码（AGENTS.md 自动注入）
   - 自评成功/规避行为
   - 将 `.tsx` 结果写入 `results/<iteration>/results/{promptId}.tsx`
   - 将 `.json` 元数据写入 `results/<iteration>/results/{promptId}.json`
3. 触发 `gh workflow run vibe-screenshots.yml` 构建预览并捕获截图
4. 运行 `pnpm -F @astryxdesign/vibe-tests aggregate --iteration <id>` 查看结果

**降级模式（--degradation）：**
测试跨 10 轮对话的上下文保持能力，包含填充、干扰和恢复轮次。在第 0、6、8、10 轮进行探测以测量质量退化。结果以折线图显示每个测试的进展。

**结果格式：**

```json
{
  "id": "<iter>-<promptId>",
  "timestamp": "...",
  "model": "claude-code-interactive",
  "persona": "naive",
  "promptCategory": "...",
  "trajectoryDepth": 0,
  "prompt": "...",
  "response": "<code>",
  "evaluation": {"success": true, "componentsUsed": [...], "escapeHatches": [...]}
}
```

运行器还可以在结果元数据旁写入可选的 `<promptId>.provenance.json` sidecar。版本化、执行器中立的契约和回退行为记录在 `internal/vibe-tests/docs/execution-provenance.md`。

## AI 上下文

有关架构背景、决策和研究，请参阅 **[GitHub Wiki](https://github.com/meta/astryx/wiki)**：

- **决策** — API Conventions、Why StyleX、StyleX Distribution
- **架构** — System Architecture、Component Authoring Guide
- **研究** — AI + Design Systems、AI Model Trajectory、Swizzle Ergonomics
- **未来** — Animation System、RSC Utilities、Distribution Strategy

有关组件的具体文档，请参阅 `packages/core/src/` 下每个组件目录中的 `{Name}.doc.mjs` 文件（例如 `Button/Button.doc.mjs`）。这些是带有 JSDoc 类型注解的普通 JS 文件，导出一个 `ComponentDoc` 对象（通过 `@astryxdesign/cli/authoring` 提供类型）。

## 文档标准

文档存在于两个地方：

1. **文件头** — 每个源文件都有一个结构化的 JSDoc 头，包含 `@input`、`@output`、`@position`，最多约 12 行
2. **组件文档** — 每个组件目录中的 `{Name}.doc.mjs` 文件（props、功能、示例）

**更新协议**：修改代码时，保持文件头注释准确。留意 `SYNC:` 注释作为提醒。

**源码注释**（[`architecture:knowledge-contracts`](docs/architecture/knowledge-contracts.md#source-comments) INV29）：让代码通过命名、结构和控制流自我解释。注释只解释非显而易见的工作：原因、约束、不变量或浏览器怪癖。绝不要叙述代码、复述名称或类型，也不要引用 pull request、issue、日期或规范记录（`pnpm specs:for <path>` 可以找到记录）。当引用是文件与记录或声明的唯一链接时，在删除它之前先将该链接添加到记录中：对于整条记录，通过 `applies_to`、`verified_by` 或 `path-applicability:v1` 链接该文件；对于诸如 `AST-108 FR4` 的声明，在文件自身的组件、模块或主题记录中添加声明作用域的引用，例如 `system_specs: [spec:AST-108/FR4]`。使用 ASD-STE100 简化技术英语写作：句子简短，一个主题一句，主动语态，现在时。保留公共 JSDoc、说明其同步系统的 Effect 注释，以及工具读取的指令：lint 和 TypeScript 指令、`@pr-a11y` 行，以及任何其他由仓库工具解析的注释行。该记录中有一个前后对照的示例。

**受众**：每个 `.doc.mjs`，以及 `packages/cli/assets/docs/` 下的所有内容，都是为**使用** Astryx 构建的人而写，而不是为构建 Astryx 的人而写。内部审查评分标准、就绪门禁、审计清单和 lab→core 标准属于 wiki。当调用者使用公共创作质量评分标准来评估他们通过 Astryx 创建的产物，并且当前系统规范指派了该所有权时，该评分标准属于随附文档。[`packages/cli/assets/docs/README.md`](packages/cli/assets/docs/README.md) 中有测试以及各类材料应归属的页面。

## 快速参考

- **包管理器**：pnpm 11，由 `packageManager` 字段固定（安装选项见 CONTRIBUTING.md — Corepack 是其中一种，Node 25+ 不再内置它）
- **测试**：Vitest（测试与代码同目录）
- **组件**：`packages/core/`
- **Storybook**：`apps/storybook/`
- **包内导入**：导入定义模块（`'../List/List'`），绝不要导入文件夹的索引桶（`'../List'`）；公共消费者导入 `@astryxdesign/core`。`@astryx/no-internal-barrel-import` 会强制执行此规则。

## JSDoc 约定

- **`@example` 代码围栏必须使用普通的 ` ``` `，而不是 ` ```tsx `。**
  Storybook 的 autodocs 解析器无法正确处理 JSDoc 中带语言标签的围栏 — 代码块将无法渲染为正确的代码块。在 `@example` 块中始终使用不带标签的围栏。

<!-- STYLEX-CAPS:START -->

[StyleX v0.19.1 CSS Support]|Use CSS-native solutions. Don't build JS workarounds for supported features.
|AT-RULES: @media, @supports, @container (+named), @starting-style, @scope — YES
|AT-RULES: @layer, @property (explicit) — NO (compiles but invalid CSS output)
|PSEUDO-CLS: :hover, :focus, :focus-visible, :focus-within, :active, :disabled — YES
|PSEUDO-CLS: :first-child, :last-child, :nth-child(), :where(), :is(), :has(), :not() — YES
|PSEUDO-CLS: :placeholder-shown, :checked, :empty, :modal, :user-valid, :user-invalid — YES
|PSEUDO-EL: ::before, ::after, ::placeholder, ::selection, ::backdrop, ::marker, ::view-transition-_ — YES
|COMPOUND: ::backdrop+condition, RTL :is([dir="rtl"] _), nested @media+pseudo — YES
|VALUES: var(), calc(), clamp(), light-dark(), color-mix(), container-type/name — YES
|ANIM: transition (shorthand+individual), transitionBehavior:allow-discrete, animation longhands, stylex.keyframes — YES
|ANIM: animation shorthand — NO (use animationName/duration/timingFunction/etc.)
|WHEN: stylex.when.ancestor(':hover'/':focus-within'/':active'/':disabled') — YES
|WHEN: stylex.when.descendant(':hover'), siblingBefore(':checked'), siblingAfter(':checked'), anySibling(':hover') — YES
|WHEN: stylex.when.ancestor('[data-attr]') — YES
|NESTING: CSS nesting with & — NO (use stylex.when.ancestor/descendant/sibling for parent-child state)
|API: stylex.firstThatWorks() for CSS fallbacks (e.g. display: grid with flex fallback) — YES
|API: stylex.positionTry() for anchor positioning @position-try — YES
|API: stylex.types.color/length/etc for typed CSS variables in defineVars — YES
|API: stylex.defineConsts() for compile-time constants — YES
|DYNAMIC: Functions in stylex.create for runtime values — YES
|VARS: stylex.defineVars, stylex.createTheme (require .stylex.ts files) — YES
|LAYOUT: grid, flex+gap, aspect-ratio, overscrollBehavior, scrollbar-gutter/width — YES
|PATTERN: dialog entry animation -> @starting-style (not useState+rAF)
|PATTERN: parent hover child style -> stylex.when.ancestor(':hover', marker) (not CSS nesting). Use stylex.defineMarker() in a .stylex.ts file for scoped markers. Ancestor element MUST have marker.marker in its stylex.props() call. NEVER use stylex.defaultMarker() for form controls (CheckboxInput, RadioList, Switch) — it leaks hover/focus-within from outer containers like Popovers. Always use a component-scoped defineMarker() instead.
|PATTERN: hover on touch -> @media (hover: hover) guard
|PATTERN: zebra striping -> :nth-child(even) (not index%2 JS)
|PATTERN: container responsive -> @container (not ResizeObserver)
|PATTERN: CSS fallback values -> stylex.firstThatWorks() (not manual fallback)
|PATTERN: dynamic/runtime values -> stylex.create({ s: (val) => ({ prop: val }) }) (not inline styles)
|PATTERN: conditional styles -> stylex.props(condition && styles.x) (not className toggling)
|PATTERN: link elements -> useLinkComponent() (not hardcoded <a>). Consumers swap via LinkProvider for framework routers (Next.js, React Router)
|VERIFY: node internal/stylex-capabilities/scan.mjs

<!-- STYLEX-CAPS:END -->

<!-- ASTRYX-CLI:START -->

Astryx CLI|Run from repo root. Load agent docs before any component work.
astryx() { node packages/cli/clients/cli/bin/astryx.mjs "$@"; }
BOOTSTRAP (run every branch, <500ms):
astryx help # discover all commands and options
astryx docs # list available doc topics
astryx docs principles --dense # design rules, anti-patterns, xstyle, tokens
astryx docs tokens --dense # spacing, color, radius, typography, shadow
astryx docs theme --dense # theme provider, light/dark, overrides
astryx component --list # all components grouped by category
astryx template --list # available page templates
ON DEMAND:
astryx docs <topic> --index # section index: one line per section, with its key
astryx docs <topic> <section> # one section, by key or title
astryx component <Name> --dense # props, variants, usage, anatomy for one component
astryx template <name> # emit full page source
astryx template <name> --skeleton # layout skeleton with spatial annotations
astryx swizzle <Name> # eject component source for deep customization
astryx upgrade --from <old version> --apply # run version migration codemods
OPTIONS: --detail compact|brief less output | --dense token-efficient | --zh Chinese
RULE: always run bootstrap on each branch — docs reflect the branch's actual API
RULE: always run astryx component <Name> --dense before modifying a component
RULE: after @astryxdesign/core bump, always run astryx upgrade --from <old version> --apply

<!-- ASTRYX-CLI:END -->
