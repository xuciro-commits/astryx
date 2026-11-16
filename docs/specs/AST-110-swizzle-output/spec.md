---
schema_version: 4
template_version: 2
kind: system-spec
id: spec:AST-110
authority: draft
archive_reason: null
superseded_by: null
approved_by: cixzhang
approved_at: 2026-10-31
phase: accepted
owners: [cixzhang, josephfarina]
affects_architecture: [architecture:cli-surface, architecture:layer-runtime]
affects_families: []
affects_contributing: []
affects_consumer_docs: [cli, styling-overview]
---

# Swizzle output system spec

<!-- path-applicability:v1 -->

```json
{
  "paths": [
    "packages/cli/api/swizzle/**",
    "packages/cli/clients/cli/commands/swizzle*"
  ]
}
```

<!-- Describe the system, not the project: present tense, what it does. No proposals, history, pull requests, or research in the record; see docs/contributing/spec-writing.md and report its rubric results in the pull request. -->

## Intent

产品团队运行 `astryx swizzle <Name>` 来拥有某个组件的源码。副本在其应用中无需任何修改即可构建，响应相同的主题目标与类名，并且在被改动之前表现得与它来源的包组件一致。Core 与 CLI 对 swizzle 提供的每个组件都保持这一点成立，仓库会在可能破坏它的改动合并之前加以证明。

## Non-goals

- 某个名称复制哪个组件，以及 `swizzle --list` 报告什么：`spec:AST-035` FR11–FR12 与 `architecture:cli-surface` INV28。
- 命令在哪里运行：`spec:AST-081` FR3。
- 产品如何为自己的代码配置 StyleX：这由构建包的选项与产品自身的 StyleX 配置负责。
- 让产品已改动过的副本与后续 Core 发行版保持同步。
- 把 Core 的内部辅助函数变成公共 API（`spec:AST-017` FR21、`architecture:public-component-api` INV12）。
- 满足本契约的等价内部实现仍然有效。
- 内部模块、文件、函数名、算法、数据结构、存储布局、清单、日志、锁、事务协议以及 CI 作业/工作流拓扑都属于架构或实现范畴，除非调用方或互操作系统的确有意把这一确切机制作为公共协议依赖。在那种情况下，应说明谁依赖它，以及为什么等价的实现无法满足契约。

## Requirements

- **FR1 — 被弹出（swizzle）的组件可独立构建。** 在与副本使用同一 Core 版本并带有 StyleX 编译器的项目中，`astryx swizzle <Name>` 的输出无需任何修改即可通过类型检查并打包。它只从所属包导入该包 `exports` 列出的路径，绝不导入 `./internal/*` 路径；例外是另一个 Astryx 包在其包导出中通过 `./internal/` 导出的 StyleX 模块，副本继续按该导出路径导入它，因为它的标识就是它的路径。被复制文件所导入的 npm 包是所属包自身的依赖；swizzle 按所属包声明的版本范围逐一报告它们，产品安装这些包之后副本即可构建。
- **FR2 — 它所需的辅助模块随之而来。** 组件所触及、且无法通过公共导出到达的每个模块都会被复制到输出中，并保持其相对于组件的文件夹布局，被复制的文件之间通过相对路径相互导入。来自另一个 Astryx 包的模块放在以该包命名的文件夹下，位于它在那个包源码中的路径处。所属包公开导出的符号从该公共路径导入。组件所导入的嵌套文件夹随它一同复制。输出只包含组件运行所需的源码：测试、story、spec 记录与组件文档不会被复制。当副本所需的某个辅助文件已由更早的 swizzle 存在于输出中时，完全相同的文件会被复用；不同的文件绝不覆盖，即使使用 `--overwrite` 也是如此，该选项只替换组件自身的文件：新辅助文件以带版本后缀的名称写在旁边，并且只有新副本的导入指向它；例外是私有属性所属模块及其导入的未导出样式模块，这些由 FR4 管辖。
- **FR3 — 共享运行时状态保持单一。** 其状态用于协调组件之间关系的模块（层栈、模态出口、交互模态、底部面板栈、`spec:AST-086` FR9 的通知通道）把该状态保存在每个文档一个的存储中，位于一个携带该存储协议版本的已注册键之下。处于同一协议版本的副本与包组件使用同一个存储，因此堆叠、Escape、焦点返回、模态与通知的表现与仅使用包组件时一致。处于另一协议版本的副本保有自己的存储，绝不读取形状不同的存储。把 provider 与其使用方连接起来的上下文也是协调状态：它的上下文对象位于同一种带版本的键之下，因此被复制的 `useToast` 能到达包中的 `LayerProvider`。同一个 React 上的多个 Core 副本共享每个上下文；上下文绝不跨同一进程中的两个 React 共享，因此一个请求绝不会读到另一个请求提供的值。跨模块标识对象的符号，例如 brand 或上下文键，注册在同一种键之下，因此副本与包对它的理解一致。每个这样的存储、brand 或注册表在每个页面上有一个带版本的槽位，而持有 React 组件或元素的槽位每个 React 一个。该规则在两个方向上都成立：包覆盖层中的副本，以及被复制 Dialog 或其他覆盖层中的包组件。已打开的复制模态中的包组件在该模态内部投递它的通知（`spec:AST-086` FR14），包的分组与布局上下文在副本的层边界处停止，正如在包的层边界处一样（`spec:AST-038` FR7）。状态仅用于缓存工作的模块可以由副本复制多份。
- **FR4 — 私有属性保持受控。** 组件所导入的每个私有 data 属性的所属模块（`architecture:public-component-api` INV23）随副本一同携带，因此调用方（包括副本自身）仍然绝不手写该属性。Swizzle 完整地复制所导入的所属模块，以及它导入的任何未导出样式模块：副本不被修改，只是对被包导出的模块的导入会像组件自身文件那样被重写为其包内子路径；未导出的依赖保持相同布局中的相对导入。重新 swizzle 会跳过已存在的相同副本，并在没有 `--overwrite` 时拒绝已改动的副本。
- **FR5 — 主题目标与类名保持不变。** 副本响应与该版本的包组件相同的主题目标，并输出相同的、有文档的类名、data 属性与自定义属性，因此主题、`xstyle` 与产品 CSS 以同样的方式到达它。Swizzle 用一个 `astryx-swizzle.json` 文件把其输出目录标记为 Astryx 源码，该文件写明所属包及其版本。它只向自己拥有的输出目录写入标记：副本自己创建的目录、空目录，或它此前标记过的目录。对于任何其他目录，它不写标记，并且 `swizzle.copy` 结果与命令的输出会说明该目录中有什么，以及如何手动添加标记。`@astryxdesign/build` 在其 library 通道中以库类名前缀编译已标记目录下的每个模块，输出到 `astryx-theme` 之下的 `astryx-base`，因此主题的组件覆盖对副本的作用与对包组件一致。这一位置安排适用于用 `@astryxdesign/build` 构建的产品。该标记是 swizzle 副本与构建包之间的协议；单靠路径规则无法区分副本与产品自身的代码。
- **FR6 — 行为与包一致。** 在产品改动它之前，副本的键盘处理、焦点、角色、名称、状态、通知与事件都与同一版本的包组件一致。
- **FR7 — 每个提供的组件都在合并之前得到证明。** 在组件包源码或 swizzle 副本的改动合并之前，swizzle 能复制的每个组件都会被弹出一个干净项目，做类型检查、用 StyleX 编译器打包，并在服务端渲染一次；失败通过一个必需检查阻断合并。发布检查对每个组件运行相同的证明，还会在真实浏览器中渲染每个副本。该证明不给 pull request 最慢的必需检查增加任何必需上下文，也不增加任何实际耗时。每个 swizzle 能复制的组件，指的是 `swizzle --list` 所提供的 Core 组件（`spec:AST-035` FR12），以及仓库中每个集成包的每个组件，以 `--package` 复制。当 FR3 所管辖的模块创建模块局部的 Symbol、WeakMap 或注册表，而不是已注册的共享键时，源码检查失败。

### Platform support

- 支持的功能/引擎下限：产品使用副本来源的同一 Core 版本，以及一个 StyleX 编译器；FR5 的层叠位置需要 `@astryxdesign/build`。浏览器支持范围即 Core 的支持范围。
- 不受支持的行为：没有 StyleX 编译器的项目在导入时失败，正如命令的输出所述。在原版 StyleX 插件上，副本的构建与行为符合 FR1 与 FR6 所述，但其规则落在产品的层中，位于 `astryx-theme` 之上。跨 Core 升级保留下来的副本不在 FR1 与 FR6 的范围之内。
- 浏览器证据：发布时对每个副本做真实浏览器渲染（FR7）；服务端渲染是 pull request 的冒烟证据。

## Current-state impact

- CLI 的 swizzle 副本沿组件的模块图进行（FR1–FR2、FR4），并且不写入任何测试、story、spec 或文档文件。CLI owner 实现并拥有这些改动。
- FR7 证明加入仓库现有的必需测试通道（`spec:AST-030` FR11），由共享的改动范围分类选出，并在单一的 pull request 报告中报告，完整证明在发布时执行。
- `architecture:layer-runtime`：层栈、模态出口以及层上下文（`LayerProvider` 及其使用方，例如 `useToast`）把其状态与上下文对象保存在带版本的键之下（FR3、DEC-2）。
- `useAnnounce` 把 `spec:AST-086` FR9 的通知通道保存在带版本的键之下，因此被复制的 Dialog 加入包的通知器，而不是挂载第二对 live region（FR3、DEC-2）。
- `swizzle.copy` 结果列出每个辅助文件，并说明它是被写入、被复用，还是以带版本后缀的名称写入（FR2），还列出副本所导入的每个 npm 依赖及其所属包声明的版本范围（FR1）。已存在的组件文件仍会以 `ERR_FILE_EXISTS` 失败，除非传入 `--overwrite`；已存在的辅助文件绝不会使命令失败，也绝不会被替换，无论是否传入 `--overwrite`（FR2），例外是所属模块及其未导出的样式模块，对于已改动的这些文件，命令在没有 `--overwrite` 时拒绝、有它时替换（FR4）。
- `@astryxdesign/build` 在 Turbopack 下的 Next 集成会在 library 通道中编译 `astryx-swizzle.json` 目录下的模块（FR5）。
- `swizzle` 命令文档为产品团队说明 FR1 与 FR6。

### Known gaps

- 副本把 `../X/file` 导入发送到公共的 `X` 入口，而该入口缺少内部辅助函数，并且深层 StyleX 模块不在 Core 的导出中（FR1、FR2）。
- 副本包含 spec 记录与测试文件，却漏掉嵌套文件夹（FR2），而且 `swizzle --list` 提供不是组件的文件夹（`spec:AST-035` FR12）。
- 在反方向上，被复制 Dialog 内部的包选择器在被复制的模态之外做通知（`spec:AST-086` FR14）（FR3）。
- 结果尚未报告每个共享模块是被写入、复用还是替换（FR2 的影响条目）；添加该回执字段由 CLI owner 决定。
- Core 的私有类型补充，例如 `focusVisible`，不随副本一同携带，而 unique symbol 在被复制的与被包的 AppShell 之间拆分标识（FR1、FR3）。
- 导入 npm 包（例如 d3 与 vega-util）的组件副本，在产品安装这些包之前无法构建，而 swizzle 不会列出它们（FR1）。
- `swizzle --list` 提供的某些名称与其文件夹的导出名称不同（Chat、NavMenu、Indicator、Resizable）（`spec:AST-035` FR12）。
- 使用原版 StyleX 插件的产品没有 library 通道设置，因此在那里副本的规则落在 `astryx-theme` 之上，主题的组件覆盖到达不了它（FR5）。
- 使本记录成为 current 的那个 pull request 会向本记录添加 `architecture:cli-surface` 指针。

## Verification

| Contract | Verification                                                                                                                                                                                                                                                                                                                  | Representative states                                                                                                                                                                                                                                                                                                     | Mutation or failure expectation                                                                                                                                                                                                                                                                                                  |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| FR1      | 把每个提供的组件弹出到一个干净项目；做类型检查并打包                                                                                                                                                                                                                                                                          | `swizzle --list` 中的每个组件；Core、Lab、Charts、RichText、Vega；一个导入 npm 依赖的组件                                                                                                                                                                                                                                 | 类型或解析错误，或导入了所属包 `exports` 中缺失的路径、或导入 `./internal/*`（除另一个 Astryx 包在那里导出的 StyleX 模块外，FR1），即失败；或副本所导入的某个依赖未被报告                                                                                                                                                        |
| FR2      | 每个输出的导入图                                                                                                                                                                                                                                                                                                              | `utils`、`hooks`、`Layer` 中的辅助模块；嵌套文件夹；同目录的测试与文档；更早的 swizzle 写下的辅助文件，相同的与不同的                                                                                                                                                                                                     | 被复制的文件导入了一个既不在输出中、也不是公共导出的模块，或复制了测试、story、spec 或文档，或覆盖了除所属模块（FR4）之外的既有辅助文件                                                                                                                                                                                          |
| FR3      | 一起渲染被复制的与包的层组件；检查存储；打开、堆叠并 Escape                                                                                                                                                                                                                                                                   | 包 Popover 之上的 Dialog；包 Dialog 之上的 BottomSheet；模态；包 `LayerProvider` 之下的被复制 `useToast`；在副本与包之间传递的带符号 brand 的对象；针对包的 `MarkdownPluginEntry` 做类型检查的已 swizzle Outline；在包组件旁做通知的被复制 Dialog；被复制 Dialog 内部报告结果计数的包选择器；被复制覆盖层内部的包分组控件 | 在任一方向（包之下有副本、副本之下有包）：一个文档中存在同一协议版本的两个存储，Escape 与焦点返回不同于仅使用包时，被复制的使用方错过了包的 provider，brand 检查失败，出现第二个 live region 而不是一个通知器（`spec:AST-086` FR9），通知逃出已打开的模态（`spec:AST-086` FR14），或分组上下文跨越了层边界（`spec:AST-038` FR7） |
| FR3      | `sharedContexts.test.tsx` 的“为每个 React 在其键下提供各自的上下文，且每个 React 一个”：第二个 React 实例加载共享上下文模块的一个副本                                                                                                                                                                                         | 同一 React 上的两个副本；同一进程中第二个 React 上的一个副本                                                                                                                                                                                                                                                              | 同一 React 上的两个副本得到不同的上下文，或第二个 React 上的副本得到同一个上下文对象，即失败                                                                                                                                                                                                                                     |
| FR3      | `sharedRealm.test.ts` 与 `sharedContexts.test.tsx`：每种共享状态形状的两次加载解析到同一个槽位，且绑定 React 的槽位每个 React 一个；FR7 的源码检查在遇到注册共享键之外的模块作用域状态时失败，除非其基线以原因或修复分组列出它。槽位使用字面量稳定名称；绑定 React 的槽位使用每个 React 的形式；brand 携带必需的 phantom 成员 | 同一 React 上的两次加载；第二个 React 上的一次加载                                                                                                                                                                                                                                                                        | 第二次加载得到自己的槽位，或绑定 React 的槽位跨越了 React                                                                                                                                                                                                                                                                        |
| FR4      | 扫描每个输出中的私有 data 属性名称与选择器；把被复制的所属模块与包中的对比                                                                                                                                                                                                                                                    | 触及所属模块的组件                                                                                                                                                                                                                                                                                                        | 输出中出现手写的私有属性名称或选择器，或被改动过的所属模块                                                                                                                                                                                                                                                                       |
| FR5      | 在带组件覆盖的主题下并排渲染包与副本；做比较                                                                                                                                                                                                                                                                                  | 默认；每个变体；一个主题组件覆盖；由 `@astryxdesign/build` 构建的副本                                                                                                                                                                                                                                                     | 主题覆盖、有文档的类名、data 属性或主题目标到达其中一个而未到达另一个                                                                                                                                                                                                                                                            |
| FR5      | 分别 swizzle 到新文件夹、空文件夹、已标记的文件夹，以及存放产品模块的文件夹；读取该文件夹与 `swizzle.copy` 结果                                                                                                                                                                                                               | 默认输出；`--output` 指向产品文件夹；一个装有不带标记的更早副本的文件夹                                                                                                                                                                                                                                                   | 标记落在存放产品模块的文件夹中，新的、空的或已标记的文件夹未被标记，或结果遗漏了被跳过文件夹中有什么                                                                                                                                                                                                                             |
| FR6      | 组件自身的交互与无障碍检查针对副本运行                                                                                                                                                                                                                                                                                        | 键盘、指针、屏幕阅读器树                                                                                                                                                                                                                                                                                                  | 在包上通过的检查在副本上失败                                                                                                                                                                                                                                                                                                     |
| FR7      | 必需测试通道的 swizzle 证明与发布时证明；两者都覆盖 Core 的清单，以及通过 `--package` 覆盖每个集成包的组件                                                                                                                                                                                                                    | 对组件源码的改动；对 swizzle 副本的改动；无关改动；Core、Lab、Charts、RichText、Vega                                                                                                                                                                                                                                      | 提供的组件在证明中缺失，失败未阻断，新增所需的上下文，证明为最慢的必需检查增加实际耗时，或证明使其作业超出 pull request 的时间预算                                                                                                                                                                                               |
| FR7      | `scripts/shared-identity.test.mjs` 针对 swizzle 所复制来源包的源码，对照其基线运行                                                                                                                                                                                                                                            | FR3 模块中模块局部的 `Symbol()` brand；`sharedKey` 下的同一个 brand；被导出的注册函数所写入的模块作用域注册表                                                                                                                                                                                                             | 模块局部的 brand 或注册表通过，`sharedKey` 的 brand 失败，或源码已不再拥有的基线条目仍被列出                                                                                                                                                                                                                                     |

Known verification gap: 只有 FR3 的共享上下文检查（`sharedContexts.test.tsx`）与 FR7 的源码检查（`scripts/shared-identity.test.mjs`）存在；其余行在 `main` 上没有检查。

## Decision log

### DEC-1 — Swizzle copies what a component needs and imports what is public

**Reference:** `spec:AST-110/DEC-1`

**Decider:** `cixzhang`, `2026-10-31`

能构建的副本是 swizzle 的全部价值所在，而组件所触及的辅助函数按 `spec:AST-017` FR21 属于内部。因此副本随身携带这些辅助函数，并且只导入公共路径，这样就不会为了让副本构建而把任何内部辅助函数变成公共 API。

已否决：导出副本所需的辅助函数，因为任何能从包路径到达的内容都是公共的（`architecture:public-component-api` INV12）。

### DEC-2 — Shared runtime state lives in versioned document stores

**Reference:** `spec:AST-110/DEC-2`

**Decider:** `cixzhang`, `2026-10-31`

副本是相同模块的第二份打包产物。Core 已经把交互模态与底部面板栈保存在每个文档一个的存储中，位于一个已注册且带版本的键之下，使重复的打包产物共享同一状态；FR3 把该规则应用到每个协调模块，因此复制模块绝不会拆分栈，也不需要新的公共入口。

已否决：绝不复制有状态模块，改为导入一个受控的包实例，因为这需要一个带兼容性承诺的公共运行时入口，而只有副本需要它；并且会让处于另一版本的副本缺少它所需的状态。

## Open questions

- 无。
