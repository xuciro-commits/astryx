# 为 @astryxdesign/cli 做贡献

面向 CLI 贡献者的架构、约定与操作手册。

## 架构

CLI 是围绕类型安全 API 函数的薄封装。每个命令遵循相同的模式：

```
User calls API function        User runs CLI
        |                            |
        v                            v
  api/component/component.mjs ◄─ clients/cli/commands/component.mjs
        |                            |
        v                            v
  { type, data }              jsonOut(response) or formatText(data)
```

两条路径运行相同的代码。CLI 处理程序只是增加了参数解析和输出格式化。

该包组织为四个产品接口面加一个共享底座（没有 `src/` — 它在重组中被解散）。顶层目录 _就是_ 模块边界：

```
packages/cli/
  api/                         # Programmatic API (exported as @astryxdesign/cli/api)
    index.mjs                  # barrel: command functions + re-exported .type.mjs types
    error.mjs  logger.mjs      # AstryxError (.suggestions + .code); the injectable logger
    component/component.mjs    # one dir per command; colocated <cmd>.type.mjs + tests
    json/                      # the ./json consumer surface — parse.mjs + index.d.ts
    ...                        # command-internal helpers take a `_` prefix (_adapter, _site, …)
  clients/                     # user-facing apps over api/ — MUST NOT be imported by api/
    cli/                       # the CLI app (room for a future clients/interactive/)
      bin/astryx.mjs           # entry: Node-version gate + top-level error boundary
      index.mjs                # program setup + JSON_SUPPORTED set + fallback hook
      commands/                # thin wrappers: parse args → one API call → render
      lib/                     # CLI-only support (cli-error, manifest, *-format, json-shim, …)
  authoring/                   # public authoring surface + colocated .d.ts
                               #   (./config ./doc ./template ./codemod ./integration)
  assets/                      # data/content the CLI ships
    codemods/  docs/  templates/
  foundation/                  # shared substrate (proven used by 2+ surfaces), by concern
    response/                  # json.mjs (emitter), parse's contract, base.d.ts, error-codes
    config/  discovery/  integrations/  text/  fs/  env/
    agent-docs/                # doc generator/injector (shared: init/upgrade/hook)
    schemas/                   # zod/JSON schemas
    xle/                       # the ./xle layout engine (self-contained, extract-ready)
  scripts/  test-utils/        # package tooling + the in-process CLI test harness
```

**硬性边界：** `api/` 从不从 `clients/` 导入。API 是可复用的核心；CLI 是它的一个消费者。任何两者共享的内容（文档生成、manifest、包管理器检测）都放在 `foundation/`（或者，如果仅 CLI 使用，放在 `clients/cli/lib/`），绝不放 `api/` 会向上触及的地方。有副作用的命令在 _API 中_ 执行实际操作并返回 `{type, data}` 回执；CLI 只选择如何渲染它以及设置什么退出码。

## 添加新命令

### 它需要 API 函数吗？

**需要**，如果该命令返回消费者可能想以编程方式获取的数据 — 组件文档、模板源码、列表、搜索结果。将逻辑放在 `api/`，从 `@astryxdesign/cli/api` 导出，并让 CLI 处理程序成为薄封装。

**不需要**，如果该命令纯交互或只在终端中有意义 — `init`（交互式提示）。交互式外壳可以放在 `cli/commands/`，但任何可复用核心（实际的脚手架工作）仍然属于 `api/`。

**经验法则：** 如果它支持 `--json`，就应该有一个 API 函数。一致性测试（`api-cli-parity-test.mjs`）会标记任何没有 API 覆盖的 `--json` 类型。

### 1. 编写 API 函数

在 `api/<command>/` 中添加一个包含所有逻辑的文件。成功时返回 `{ type, data }`，失败时抛出 `AstryxError`。CLI 处理程序应当没有任何逻辑 — 只是参数解析和文本格式化：

```javascript
// api/my-command/my-command.mjs
import {AstryxError} from '../error.mjs';

export async function myCommand(name, options = {}) {
  if (!name) {
    return {type: 'my-command.list', data: getAllItems()};
  }

  const item = findItem(name);
  if (!item) {
    throw new AstryxError(`Item "${name}" not found`, suggestions);
  }

  return {type: 'my-command.detail', data: item};
}
```

从 `api/index.mjs` 导出它：

```javascript
export {myCommand} from './my-command/my-command.mjs';
```

### 2. 创建 CLI 封装

CLI 处理程序只解析参数、调用 API 函数并格式化结果。这里没有业务逻辑：

```javascript
// cli/commands/my-command.mjs
import {jsonOut, jsonError} from '../../lib/json.mjs';
import {myCommand} from '../../api/my-command/my-command.mjs';

export function registerMyCommand(program) {
  program
    .command('my-command [name]')
    .description('Does something')
    .action(async (name, options) => {
      const json = program.opts().json || false;

      let result;
      try {
        result = await myCommand(name, options);
      } catch (e) {
        if (json) return jsonError(e.message, e.suggestions);
        console.error(e.message);
        process.exit(1);
      }

      if (json) return jsonOut(result.type, result.data);
      console.log(formatText(result));
    });
}
```

### 3. 定义响应类型

创建 `types/my-command.d.ts`：

```typescript
/** xds --json my-command */
export interface MyCommandListResponse {
  type: 'my-command.list';
  data: MyCommandListEntry[];
}

export interface MyCommandListEntry {
  name: string;
  description: string;
}

/** xds --json my-command <name> */
export interface MyCommandDetailResponse {
  type: 'my-command.detail';
  data: {name: string; content: string};
}
```

### 4. 接线

添加到 `types/index.d.ts`：

```typescript
export * from './my-command';
```

这是唯一的类型接线 — **没有中央响应联合**需要注册。每个响应 `type` 由各自命令函数的 `@returns`（唯一事实来源）保证；消费者直接导入每个命令的类型。

### 5. 就是这样

如果跳过类型步骤，命令仍然可以工作 — 当有人传入 `--json` 时，全局回退钩子会返回干净的 `CLIUnsupportedError`。不会崩溃，不会产生损坏的输出。

## 操作手册 — 常见变更

### 为组件添加 prop

CLI 中无需做任何事。Props 来自 `packages/core/src/` 中的 `.doc.mjs` 文件。CLI 在运行时读取它们。如果 `.doc.mjs` 更新，CLI 和 API 会自动反映该变更。

### 添加新组件

1. 在 `packages/core/src/{Name}/` 中创建组件
2. 在同一目录中添加 `{Name}.doc.mjs`（如果是子组件，则添加到父级的 `.doc.mjs`）
3. 完成 — CLI 自动发现它，API 自动发现它，一致性测试自动发现它

如果组件没有 `.doc.mjs`，`astryx component {Name}` 会返回干净的报错，CI 的冒烟测试会跳过它。

### 添加新文档主题

1. 在 `packages/cli/assets/docs/` 中添加 `{topic}.doc.mjs`
2. 完成 — 由 `astryx docs` 和 `docs()` API 函数自动发现

### 添加新模板

每个模板恰好是**两个文件** — 没有例外：

```
packages/cli/assets/templates/{name}/
├── page.tsx              ← the template code (single self-contained file)
└── template.doc.mjs      ← metadata (name, description, isReady)
```

1. 创建 `packages/cli/assets/templates/{name}/page.tsx`，包含一个默认导出的 React 组件
2. 创建 `packages/cli/assets/templates/{name}/template.doc.mjs`，包含 `doc` 导出（`TemplateDoc`）
3. 完成 — 由 `astryx template --list` 和 `template()` API 函数自动发现

**规则：**

- 不要额外文件 — 没有 CSS、没有图片、没有其他资产。所有内容都放在 `page.tsx` 中。
- 图片必须使用外部 URL（例如 Unsplash），而不是本地导入。
- 所有样式必须使用 StyleX 或内联样式，而不是单独的 CSS 文件。

### 为现有 API 函数添加新选项

1. 在 `api/{command}/{command}.mjs` 中为 API 函数添加该选项
2. 在 `cli/commands/{command}.mjs` 的 CLI 处理程序中传递它
3. 在 `api/{command}/{command}.type.mjs` 的 `{Command}Options` typedef 中添加该选项 — 此 JSDoc 是唯一事实来源；公共 `./api` 类型接口通过 `pnpm sync:api-types` 从它重新生成

### 添加新的响应类型（例如 `component.detail.variants`）

1. 在 `api/{command}/{command}.mjs` 中添加逻辑 — 返回 `{type: 'component.detail.variants', data: ...}`
2. 在 `api/{command}/{command}.type.mjs`（同目录的唯一事实来源）中为它添加 `@typedef`
3. 从函数的 `@returns` 引用它 — 没有中央联合需要更新；`./api` 类型接口从 JSDoc 重新生成
4. 一致性测试将自动检测新类型并验证 API=CLI

### 重命名或删除响应类型

这对 `@astryxdesign/cli/api` 消费者是破坏性变更。请升级版本。

### CI 自动捕获的内容

- **没有文档的新组件** → 冒烟测试会带消息跳过它（不是失败）
- **没有 API 覆盖的新 CLI `--json` 类型** → 一致性测试将其标记为覆盖缺口
- **API 和 CLI 返回不同数据** → 一致性测试失败并显示两个 payload
- **无效的 JSON 信封形状** → json 冒烟测试失败
- **类型不匹配** → `tsconfig.json-api.json` 类型检查失败

## 命名约定

### 响应类型：`{Command}{Mode}{SubMode?}Response`

| 部分    | 规则              | 示例                                                                              |
| ------- | ----------------- | --------------------------------------------------------------------------------- |
| Command | PascalCase 命令名 | `Component`, `Discover`, `ThemeBuild`                                             |
| Mode    | 响应所表示的内容  | `List`, `Brief`, `Detail`, `Search`, `Copy`, `Build`, `Run`, `Categories`, `File` |
| SubMode | Mode 的更窄视图   | `Props`, `Source`, `Doc`, `Section`                                               |
| 后缀    | 始终为 `Response` |                                                                                   |

### 条目类型：`{Command}{What}Entry`

数组中的子对象。没有 `Response` 后缀。

### 类型判别器：点分隔的小写

```
{command}.{mode}              -> component.list
{command}.{mode}.{submode}    -> component.detail.props
```

### 标志如何组合

`--json` 是输出格式，不是模式。所有其他标志仍然有效：

- `--json + --category X` 过滤相同的响应类型（不需要新类型）
- `--json + --lang zh` 在转储前应用翻译
- `--json + --props` 缩小到 `component.detail.props`（子模式）
- `--json + --source` 缩小到 `component.detail.source`（子模式）

## 回退钩子如何工作

1. 命令正常运行
2. 如果它调用了 `jsonOut()` 或 `jsonError()`，`process.__xdsJsonHandled` 为 `true` → 完成
3. 如果没有，`postAction` 钩子触发并输出 `CLIUnsupportedError`
4. 不知道 `--json` 的新命令会自动获得干净的报错

## 为 --json 抑制 stdout

当 `--json` 激活时，人类可读输出不得污染 stdout：

```javascript
// Simple commands: guard console.log
if (!json) console.log(`✓ Done`);

// Logger commands: skip term-log calls
if (!json) p.intro('Welcome');
if (!json) p.log.step('Running...');

// Side-effect commands: still run the work, just suppress output
// and collect results into a receipt object
```

## CI 执行

- `tsconfig.json-api.json` 根据 `.d.ts` 声明对 `json.mjs` 和 `parse.mjs` 进行类型检查
- `.github/scripts/cli-json-smoke-test.mjs` 验证每个 `--json` 命令输出具有正确信封形状的有效 JSON
- `.github/scripts/api-cli-parity-test.mjs` 验证编程 API 对每个命令返回与 `xds --json` 相同的数据
- 这三项都在每次 PR 的 `cli-smoke-test.yml` 工作流中运行

## 严格类型检查（checkJs + JSDoc）— 必需的 CI 关卡

CLI 以手写 `.mjs` 形式发布（没有构建步骤），但使用 TypeScript 的 `checkJs` 根据源码中的 JSDoc 注解进行类型检查。`tsconfig.strict.json` 会在**整个包**上运行编译器 — 每个表面（`api`、`clients`、`authoring`、`foundation`）加上 `assets/` 内容（codemods、docs 以及生成的 `templates` `.tsx` 源码）和 `scripts` — 在完整的 `strict` 下，包括 `noImplicitAny`，因此未注解的参数就是错误。

```bash
pnpm build   # once, so @astryxdesign/{core,charts,lab} dist types resolve
pnpm -F @astryxdesign/cli typecheck:strict
```

这是一个**必需的 CI 关卡**：它在每个 PR 和合并队列中运行（`ci.yml` 中的 `build` 检查），并在 `deploy.yml` 的合并后验证关卡中再次运行，因此 CLI 必须保持严格检查干净 — 新的未注解参数或类型错误会导致 CI 失败。推送前请在本地运行它。（生成的 `templates/**/*.tsx` 会导入已构建的工作区包，所以先运行 `pnpm build`，否则你会看到来自未构建 `dist` 输出的虚假“cannot find module”错误。）

## 路线图

两条计划工作轨道。两者都特意安排在薄 CLI 抽取稳定 _之后_，这样每个增量都能作为聚焦、完全验证的增量落地，而不是仓促完成、让细微行为变化从测试中溜走。

每个增量在提交前都必须通过相同的关卡：shape-lock IDENTICAL（`--json` payload 和人类文本保持逐字节相同）、`typecheck:strict` 0 错误且文件数量不减少、`typecheck:json-api`、vitest 套件，以及 api↔cli parity + json-smoke 脚本。

### 1. 完成薄 CLI / API 覆盖

目标：每个命令都可脚本化，每个 CLI 处理程序都是 `parse → one API call → render`。可复用核心位于 `api/`；CLI 只解析参数、渲染（`jsonOut` 或人类文本）并设置退出码。有副作用的命令在 API 中执行效果并返回 `{type, data}` 回执。

剩余命令，按顺序（最大/最高风险的故意一次处理一个）：

1. **`upgrade`**（约 860 行 — codemod 管道，约 10 种结果）。抽取到 `api/upgrade`，返回 `upgrade.run` 回执。使用**注入式 logger**模式：API 接受可选的 logger（默认 no-op），因此无论 CLI 是否渲染进度，工作都运行得完全一样；所有 `term-log` 调用留在 CLI 中。通过 `execFile` 运行 codemods + post-codemod 钩子，因此要精确保持 dry-run 与 `--apply` 的区别。
   - 在该 PR 中需要明确的开放决策：两个错误位置目前将元数据对象（`{agentDocs}` / `{receipt}`）作为 `jsonError` 的 _suggestions_ 参数传入，而 `toErrorEnvelope` 会静默丢弃它（它只转发数组形状的 suggestions）。要么保留丢弃行为（shape-lock 保持相同）**要么**将其作为有意、记录在案的附加变更来修复，把元数据放入回执的 `data`。无论如何都不要静默更改。
2. **`theme build`**（约 1275 行 — theme→CSS/TS 编译器，约 14 个文件写入点）。将编译器抽取到 `api/theme`，返回 build 回执；所有磁盘写入保留在 API 中，渲染保留在 CLI 中。规模大且有副作用 — 单独一轮。
3. **`init`**（约 195 行）。交互式提示保留在 CLI 侧；将脚手架核心抽取到 `api/init`，使非交互路径可脚本化。
4. **`blog --json`**：`blog` 目前发出 `blog.list` / `blog.detail` 但**没有 `blog.d.ts`** — 启用/锁定其 `--json` 表面还必须添加响应类型（在函数的 `@returns` / `types/blog.d.ts` 处）。小、低风险、纯收益。
5. **数据命令审计**（`component`、`docs`、`hook`、`template`）：确认重组后 CLI 侧不再残留业务逻辑。大部分已经很薄。

### 2. 用生成的声明替换手写 `.d.ts`

目前 API 的公共类型是 `types/` 中手写的 `.d.ts` 文件，通过约定 + CI 与 `.mjs` 实现保持同步。目标是让带注解的 `.mjs` 成为唯一事实来源，使类型漂移成为编译错误而不是审查时才发现。

已被证明可行：`.mjs` 文件中的 JSDoc `@typedef` 加上 `tsc --emitDeclarationOnly` 可生成正确的 `.d.ts`，而共享的 `.ts` 主干可以 `import type { XResult } from './x.mjs'` 并正确地进行类型检查和发出声明。

分阶段计划：

- **阶段 0（已完成）：** 每个 API 函数都获得精确的 `@returns
{Promise<XResult>}`，指向其导出的结果联合，这样不再匹配其声明类型的实现会无法通过 `typecheck:strict`。`discover` 和 `docs` 是参考模式；`build` 的 `search` 结果已经注解。
- **阶段 1 — 生成工具链：** 接通 `tsc --emitDeclarationOnly` → `dist/types/`，并证明生成的输出与当前手写 `.d.ts` 逐字节相同。无行为变更；这只建立生成器。
- **阶段 2 — 逐命令迁移：** 将每个命令的类型移入同目录的 `api/<cmd>/<cmd>.types.ts`（或 `.mjs` 中的 JSDoc typedef），更新 `base.ts` 的导入，并逐个删除 `types/<cmd>.d.ts`。从 **`blog`** 开始 — 它目前没有 `.d.ts`，所以这是纯收益，无需保持同步。
- **阶段 3 — 切换导出：** 将 `exports.types` 指向生成的输出，并停止手动提交生成的 `.d.ts`。
- **阶段 4 — 锁定：** 添加 CI 检查，使手写的逐命令 `.d.ts` 无法再次出现。
