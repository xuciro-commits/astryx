# @astryxdesign/vega

Astryx Vega 封装：图表与数据可视化组件。

通过 Vega 运行时渲染 [Vega](https://vega.github.io/vega/) 与 [Vega-Lite](https://vega.github.io/vega-lite/) 规范。该组件会检查 `$schema`，以决定是进行编译（Vega-Lite）还是直接渲染（Vega），并在执行任一操作前校验 schema URL，同时以属性形式暴露完整的 Vega `parse()` 与 `View` 构造 API。

> **发布状态：仅 canary。** 本包**仅通过 `@canary` dist-tag** 发布到 npm —— 目前还没有稳定版（`latest`）发布。有关 canary 模式以及将其升级为公开稳定版发布的步骤，请参见下文的[发布](#发布)一节。

<!-- SYNC: 当本目录中的文件发生变化时，请更新本文档。 -->

## 文件清单

| 文件                | 角色     | 用途                                           |
| ------------------- | -------- | ---------------------------------------------- |
| `package.json`      | 配置     | 包元数据、依赖、构建脚本                       |
| `tsconfig.json`     | 配置     | TypeScript 编译器配置（继承根配置）            |
| `tsup.config.ts`    | 配置     | 构建配置：CJS + ESM + `.d.ts` 输出             |
| `src/index.ts`      | 统一导出 | 公共 API 接口                                  |
| `src/VegaChart.tsx` | 组件     | 检查 `$schema`，编译或渲染，管理 View 生命周期 |
| `src/viewInputs.ts` | 工具     | 检测控制 View 的属性值变化                     |
| `src/schema.ts`     | 工具     | 解析并校验 Vega/Vega-Lite `$schema` URL        |
| `src/types.ts`      | 类型     | 本包共享的 TypeScript 类型                     |

## 安装

Vega **仅**通过 `@canary` dist-tag 发布，因此必须显式指定该 tag。目前没有可安装的 `latest` 版本。

```bash
npm install @astryxdesign/vega@canary vega vega-lite
```

> Canary 构建跟随 `main` 的最新提交，最多每小时发布一次，也可按需发布（`0.x.y-canary.g<sha>`）。任意两个版本之间都可能出现破坏性变更 —— 如需稳定性，请锁定确切版本。

## 用法

### Vega-Lite 规范（自动编译）

```tsx
import {VegaChart} from '@astryxdesign/vega';

<VegaChart
  spec={{
    $schema: 'https://vega.github.io/schema/vega-lite/v5.json',
    mark: 'bar',
    data: {
      values: [
        {a: 'A', b: 28},
        {a: 'B', b: 55},
      ],
    },
    encoding: {
      x: {field: 'a', type: 'ordinal'},
      y: {field: 'b', type: 'quantitative'},
    },
  }}
/>;
```

### Vega 规范（直接渲染，不编译）

```tsx
<VegaChart
  spec={{
    $schema: 'https://vega.github.io/schema/vega/v5.json',
    marks: [...],
  }}
/>
```

### 完整配置

```tsx
<VegaChart
  spec={spec}
  parseConfig={{background: '#1a1a1a'}}
  parseOptions={{ast: true}}
  viewOptions={{
    renderer: 'canvas',
    logLevel: 1,
    tooltip: myTooltipHandler,
    locale: myLocale,
    loader: myLoader,
  }}
  onReady={view => {
    view.addSignalListener('highlight', (name, value) => {
      console.log('signal:', name, value);
    });
  }}
  onError={err => console.error('Chart error:', err.message)}
/>
```

## API

### `<VegaChart>`

| 属性             | 类型                             | 默认值 | 描述                                                 |
| ---------------- | -------------------------------- | ------ | ---------------------------------------------------- |
| `spec`           | `AnySpec`                        | --     | 带 `$schema` 的 Vega 或 Vega-Lite 规范（必填）       |
| `data`           | `ViewData`                       | --     | 初始数据集值：`{datasetName: tuples[]}`              |
| `compileOptions` | `CompileOptions`                 | --     | 传给 `compile(spec, options)` 的选项，仅限 Vega-Lite |
| `parseConfig`    | `Config`                         | --     | 传给 `parse(spec, config)` 的 Vega 配置              |
| `parseOptions`   | `ParseOptions`                   | --     | 传给 `parse(spec, config, options)` 的选项           |
| `viewOptions`    | `Omit<ViewOptions, 'container'>` | --     | 传给 `new View(runtime, options)` 的选项             |
| `className`      | `string`                         | --     | 容器 div 上的 CSS 类名                               |
| `style`          | `CSSProperties`                  | --     | 容器 div 上的内联样式                                |
| `onReady`        | `(view: View) => void`           | --     | 就绪时以活动的 Vega View 调用                        |
| `onError`        | `(err: Error) => void`           | --     | 在 schema 错误、编译失败或渲染失败时调用             |

`viewOptions` 直接映射到 [`ViewOptions`](https://vega.github.io/vega/docs/api/view/)，但省略了 `container`（始终由组件设置）。值得注意的字段：

| `viewOptions` 字段 | 类型                | 描述                         |
| ------------------ | ------------------- | ---------------------------- |
| `renderer`         | `'svg' \| 'canvas'` | 渲染后端（默认：`'svg'`）    |
| `hover`            | `boolean`           | 启用悬停编码（默认：`true`） |
| `logLevel`         | `number`            | Vega 日志详细程度            |
| `logger`           | `LoggerInterface`   | 自定义日志记录器             |
| `tooltip`          | `TooltipHandler`    | 自定义工具提示处理器         |
| `locale`           | `LocaleFormatters`  | 数字和时间格式区域设置       |
| `loader`           | `Loader`            | 自定义数据加载器             |
| `background`       | `Color`             | 图表背景色                   |

`compileOptions` 字段（仅适用于 Vega-Lite 规范，其他情况下忽略）：

| `compileOptions` 字段 | 类型                           | 描述                                        |
| --------------------- | ------------------------------ | ------------------------------------------- |
| `config`              | `VegaLiteConfig`               | 合并到规范自身 config 之上的 Vega-Lite 配置 |
| `logger`              | `LoggerInterface`              | 编译期间使用的自定义日志记录器              |
| `fieldTitle`          | `(fieldDef, config) => string` | 自定义字段标题格式化器                      |

`parseOptions` 字段：

| `parseOptions` 字段 | 类型      | 描述                                     |
| ------------------- | --------- | ---------------------------------------- |
| `ast`               | `boolean` | 在运行时中保留表达式 AST（对工具链有用） |

### View 生命周期

`<VegaChart>` 在挂载时构建 Vega `View`，在卸载时将其销毁。在此期间，仅当 `spec`、`compileOptions`、`parseConfig`、`parseOptions` 或 `viewOptions` **的值发生变化**时，才会重建 View —— 这些属性会与构建当前活动 View 时所用的值按值比较，而不是按引用比较。由此产生两点影响，而且这两点都不需要 `useMemo`，也不需要你刻意维持对象标识的稳定：

- 每次渲染时内联重建的对象字面量**不会**导致图表被销毁；
- 你**就地**修改的规范 —— 保存在 ref、模块常量中，或在多次渲染之间共享 —— **会**被识别，因为比较对象是构建 View 时取得的副本，而不是上一轮的属性。

这些属性中的函数（`tooltip` 处理器、`logger`、`loader`、`expr` 或 `fieldTitle`）以及类实例按引用比较，因为它们的行为存在于副本无法捕获的方法中：请替换该值，而不是修改它。

有两种结构无法复制以用于比较：重新进入自身路径上已有对象的子树（引用环），以及嵌套深度超过 100 层的子树。这些部分按**引用**比较，因此再次传入**同一个**对象是稳定的 —— 由循环规范构建的图表不会在每次渲染时重建 —— 而传入**新**对象即使其值相等也会重建 View。

两者付出的代价不同：

- **引用环不会隐藏任何内容。** 它的重入边指向副本已经遍历过的对象，因此循环规范中任何位置的就地编辑仍会被正常检测到。
- **超过 100 层时，就地编辑是不可见的** —— 引用没有变化，且下面的值从未被复制。要更新该处，请替换对象，或通过 `onReady` 驱动 View。

无论哪种情况，副本实际到达的所有内容都按值比较，因此即使规范的一部分不透明，其它位置的变更仍会被识别。

其余内容对生命周期均无影响：`data`、`className`、`style`、`onReady` 和 `onError` 永远不会重建 View。

### 数据加载

`data` 将数据集名称映射到元组数组，并在 View 初始化期间、首次渲染之前通过 `view.data(name, tuples)` 应用。它_不是响应式的_；挂载后的更改会被忽略，新的 `data` 对象本身永远不会重建 View。（当其他因素重建 View 时，新的 View 会加载当时 `data` 所持有的内容。）

要在渲染后动态更新数据，请使用 `onReady` 获取活动的 View 并自行驱动它：

```tsx
<VegaChart
  spec={spec}
  data={{
    table: [
      {category: 'A', value: 28},
      {category: 'B', value: 55},
    ],
  }}
  onReady={view => {
    // Later, update data dynamically:
    view.data('table', newRows);
    view.runAsync();
  }}
/>
```

### 不受信任的规范

Vega/Vega-Lite 规范是一段程序，而不仅仅是数据：Vega 会求值其中的表达式字符串（信号、事件流、编码、过滤器），并默认使用 Function 构造函数将其编译为 JavaScript。规范的 `data` 条目还可以指定 URL —— 包括由信号构建的动态 URL —— 默认加载器会使用页面的凭据获取它们。

`<VegaChart>` 使用 Vega 的默认设置渲染你提供的规范，因此这些默认设置定义了信任边界：**只传入你自己编写或审阅过的规范。** 如果规范来自用户、存储的文档或模型输出，请通过现有的透传选项启用安全求值模式 —— 这也是 Vega 自己对不受信任规范的建议：

```tsx
import {expressionInterpreter} from 'vega-interpreter';
import {loader} from 'vega';

<VegaChart
  spec={untrustedSpec}
  // Retain the expression AST and evaluate it interpreted (no Function
  // constructor). Slower, and a small subset of expressions is unsupported —
  // see the vega-interpreter README.
  parseOptions={{ast: true}}
  viewOptions={{
    expr: expressionInterpreter,
    // Restrict (or disable) what a spec may load. `mode: 'file'` with no
    // baseURL rejects everything; supply your own loader to allowlist hosts.
    loader: loader({mode: 'file'}),
  }}
/>;
```

`vega-interpreter` 是一个单独的包（`npm install vega-interpreter`）；请将其与省略 `'unsafe-eval'` 的 `Content-Security-Policy` 搭配使用，让边界由平台强制执行，而不仅靠配置。

### `parseSchema(schema)`（导出的工具函数）

解析并校验 Vega `$schema` URL。返回：

- 成功时：`{ok: true, library: 'vega' | 'vega-lite', version: string}`
- 若 URL 缺失、格式错误或指定了未知库：`{ok: false, error: string}`

## Schema 校验

`VegaChart` 在执行任何工作之前会校验 `spec.$schema`。在以下情况下，它会调用 `onError`（并且不渲染任何内容）：

- `$schema` 缺失或不是字符串
- URL 不符合预期格式（`schema/{library}/{version}.json`）
- 库名不是 `vega` 或 `vega-lite`

## 构建

```bash
pnpm -F @astryxdesign/vega build
```

## 发布

### Canary（当前自动发布）

`package.json` 保留 `"private": true` 以及 `"astryx": { "canaryOnly": true }` 标记。发布工作流（`.github/workflows/release.yml`）处理两种 dist-tag：

- **稳定版（`latest`）任务**会跳过所有 `private` **或** `canaryOnly` 的包，因此 Vega 绝不会被意外发布为稳定版。
- **canary 任务**最多每小时从 `main` 的最新提交运行一次，也可从 `main` 按需运行。仅在其临时的 CI 检出中（绝不写入 git），它会移除 `canaryOnly` 包的 `private` 标记，并将其以 `0.x.y-canary.g<short-sha>` 的形式发布到 `@canary` dist-tag，使用 npm OIDC 可信发布 + 来源证明（provenance）。

已提交的 `private: true` 是 npm 的硬性保障，确保绝不可能发生稳定版发布 —— **在有意执行下述升级步骤之前，请勿移除它。**

> **在 npm 上认领包名之前，第一个 canary 版本不会发布。** npm 无法为注册表中尚不存在的名称注册 OIDC 信任。`@astryxdesign` 的 npm 组织所有者必须认领该名称，并参照 [可信发布者设置](https://github.com/meta/astryx/blob/main/docs/release.md#trusted-publisher-setup) 一次性将 `release.yml` 注册为其可信发布者（这也适用于首次稳定版发布之前）。在此之前，该包的 CI canary 发布将会失败。

### 升级为公开稳定版（`latest`）发布

当 Vega 准备好作为稳定版公开发布时，请按顺序执行以下步骤。这与其它公开 `@astryxdesign/*` 包的发布方式一致 —— 权威流程参见 wiki 的 **Release-Process** 页面。

1. **移除仅 canary 的限制**（`packages/vega/package.json`）：
   - 删除 `"private": true`。
   - 删除 `"astryx": { "canaryOnly": true }` 块。

2. **加入版本组。** 将 `@astryxdesign/vega` 添加到 `.changeset/config.json` 的 `fixed` 数组中，使其与其余可发布包共同进行版本管理（它们都会提升到同一版本）。将 `version` 设置为与其他包当前已发布版本一致。

3. **确认包名已在 npm 上认领并获得信任**（见上方的引导说明框）。如果尚未完成，`@astryxdesign` 组织所有者需执行一次 —— 未认领/未受信任的名称会导致稳定版发布失败，情形与 canary 完全相同。

4. **添加 changeset**，使发布说明和版本提升包含 Vega：

   ```bash
   pnpm changeset:new
   ```

5. **合入更改，然后通过常规发布流程执行版本提升 + 发布**：
   - 合并移除限制的 PR（下一次每小时 canary，或从 `main` 派发的 canary，会将其发布）。
   - 运行版本提升 PR（`pnpm version-packages`，刷新 lockfile，合并）—— 这会在 `main` 上提升版本，但不会发布任何内容。
   - 触发稳定版 Release 工作流以发布 `latest` dist-tag：

     ```bash
     gh workflow run release.yml --ref main -f dry-run=true   # optional preview
     gh workflow run release.yml --ref main                   # publish latest
     gh run list --workflow=release.yml -L 3                   # watch
     ```

   发布无需令牌（npm OIDC 可信发布），并且有版本门控且幂等 —— 重新运行是安全的。无需手动 `npm publish`，也无需 npm 令牌。

稳定版发布后，`npm install @astryxdesign/vega`（不带 tag）将解析到稳定版；`@canary` tag 会继续跟踪 `main`。
