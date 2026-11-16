# 本地 Storybook 启动可靠性调查

日期：2026-08-15

## 摘要

本地 Storybook 通常并不是编译失败。反复出现的失败模式是：`storybook dev` 在 manager 和 preview shell 可用后就宣布 Storybook 已就绪，而此时 Vite 仍在优化依赖，请求的 story 也仍在转换中。此时打开 URL，可能会看到一个 manager 搭配着不完整或无限加载的 preview。

冷 worktree 缓存使这在 Astryx 工作区中频繁发生。Storybook 的缓存存储在各自 worktree 内部，工作区将大型包别名指向源码，而默认开发命令总是请求端口 6006。这些选择叠加起来，使新建或刚更新的 worktree 需要很久才能可用，也很容易打开另一个 worktree 的过期服务器。

促使本次调查的 Bottom Sheet story 并不是编译失败。TypeScript、ESLint、格式检查和完整的生产 Storybook 构建全部通过。

## 本次事件中的证据

### Storybook 在优化完成前就报告就绪

开发服务器打印了：

```text
Storybook ready!
- Local: http://localhost:6007/
2.71 s for manager and 295 ms for preview
Vite [optimizer] bundling dependencies...
```

URL 是在 ready 横幅出现之后、最后一行 optimizer 输出稳定之前分享出去的。manager、`index.json` 和 story iframe shell 都返回 HTTP 200；这只能证明服务器和 HTML shell 可用，不能证明 story 模块已在浏览器中执行。

这是开发服务器的预期行为：story 及其依赖图中的很大一部分是按需转换的。因此，ready 横幅并不是可靠的“选中的 story 已渲染”信号。

### 该 worktree 需要重新优化依赖

启动时还打印了：

```text
Vite Re-optimizing dependencies because lockfile has changed
```

生成的 worktree 本地 optimizer 缓存包含 136 个生成文件。目前 Astryx 各 worktree 中共有 17 个独立的 Storybook 缓存根目录。新建 worktree、安装依赖、更新 lockfile、更改 Storybook 版本，或修改相关 Vite 配置，都会再产生一个冷缓存。

Vite 的元数据明确使用 lockfile 和解析后的配置哈希作为该缓存的键。因此，频繁 rebase 到 `main` 会让冷启动成为本地工作的常态，而不是例外事件。

### Astryx 具有庞大的转换图

完整构建成功了，但转换了 4,077 个模块，仅 Vite 构建就耗时 21.10 秒。插件耗时报告显示占比最大的是：

- Storybook 项目注解：53%
- Storybook mock 加载器：14%
- StyleX：13%
- React docgen：12%
- CSF 处理：6%

Storybook 配置将 Core、Lab、Charts、Vega 和 themes 别名指向各自的源码目录树。这对组件开发很有用，但冷启动的 preview 必须先处理大量源码和 StyleX 图，某些 story 才能渲染。

### 默认端口可能指向错误的 worktree

`apps/storybook/package.json` 硬编码了端口 6006。在本次事件中，端口 6006 已被来自 `bottom-sheet-orchestrator` worktree 的一个已运行两天的 Storybook 进程占用。请求的 preview 只好改用 6007。

如果没有精确端口检查和明确的 URL，开发者要么无法启动 Storybook，要么打开另一个 worktree 中看起来正常但已过期的 Storybook。

### 依赖安装会带来更多变动

该 worktree 中最初的格式化、lint 和 typecheck 命令对 pnpm 工作区进行了协调，并运行了 postinstall 钩子。并发调用还在 `husky install` 期间争用共享裸仓库的 Git 配置。这些命令最终都通过了，并没有导致 story 失败，但它们也是另一个理由：不要在首次使用依赖安装仍在进行时启动或评估 Storybook。

## 现有的缓解措施与无关警告

仓库已将 `optimizeDeps.holdUntilCrawlEnd` 设置为 `false`。这是 Vite 8 的有效选项，专门因为此前 StyleX 转换会让依赖爬取保持打开而添加。它缓解了最严重的 spinner 情形，但并不会让 ready 横幅等待选中的 story 渲染完成。

以下警告出现过，但并未导致完整构建失败：

- 未找到 `stories/**/*.mdx` 文件；
- `optimizeDeps.esbuildOptions` 在 Vite 8 中已弃用，改用 Rolldown 选项；
- Lexical 有 pure 注解标注位置警告；
- 某些生产 chunk 超过 500 kB；
- neutral 主题在开发环境中使用运行时样式注入。

它们不应被用作本地 preview 失败的证据。已弃用的 optimizer 配置值得清理，但它并未阻塞本次构建。

## 建议

### 1. 验证 story，而不是服务器横幅

对于本地审查自动化，不要一看到 Storybook 打印 `ready` 就分享 URL。加载确切的 story，并等待浏览器层面的断言，例如预期触发文本出现且没有 Storybook 错误画面。来自 `/`、`index.json` 或 `iframe.html` 的 HTTP 200 是不够的，因为这些都可能在 story 模块渲染之前就成功返回。

在无法使用浏览器自动化的地方，分享审查 URL 之前先执行完整的静态构建：

```sh
pnpm -F @astryxdesign/storybook build
```

只有该命令成功完成后，才提供 `apps/storybook/dist`。这种方式更慢，也没有热重载，但它能证明每个 story 都已编译。

### 2. 明确端口归属

开发时使用显式选择的一个空闲端口和 Storybook 的 `--exact-port` 选项。将 worktree 路径和最终 URL 一起打印出来。这样，过期的 6006 进程会变成明显的启动失败，而不是一个看似合理但错误的 preview。

### 3. 添加确定性的本地审查命令

添加一个仓库脚本，执行以下流程之一：

- 开发：选择一个未使用的端口，用 `--exact-port` 启动，导航到请求的 story ID，并等待浏览器层面的就绪断言；
- 静态审查：构建全部 Storybook，在未使用的端口上提供 `dist`，并验证请求的 story ID 存在于 `index.json` 中。

对于审查交接，静态流程是更好的默认选择。当用户需要热重载时，开发流程更好。

### 4. 启动前先稳定依赖安装

在新建 worktree 中启动并行的 lint、typecheck 或 Storybook 进程之前，先完整运行一次工作区安装/协调。避免同时运行多个首次使用的 pnpm 命令，因为它们的生命周期钩子共享裸仓库的 Git 配置。

### 5. 在更改优化配置前分析冷启动开发性能

当前的爬取规避方案仍受支持。不要因为 Vite 8 的弃用警告就移除它，该警告针对的是 `esbuildOptions`，而不是 `holdUntilCrawlEnd`。

作为一个独立的性能任务，衡量显式的 `optimizeDeps.include` 列表加上 `noDiscovery` 是否能改善冷启动。这样可以避免完整爬取，但只有在列出了 Storybook 所需的每一个 CommonJS 依赖时才安全。同时评估更窄的包子路径导入或别名，以减少单个 story 需要转换的 Core、Lab、Charts 和 Rich Text 源码量。

### 6. 迁移已弃用的 optimizer 目标配置

在验证等效的 Vite 8 Rolldown 配置后，移动或移除 Vite 7 时代的 `optimizeDeps.esbuildOptions.target` 设置。这是维护工作，不是眼下的可靠性修复，但它能让本地启动路径保持在受支持的配置上，并使未来的警告更易于处理。

## 结论

Storybook“没有完整构建”的反复印象是准确的，但主要问题在于交接时机和本地工作流，而不是 story 本身损坏。Astryx 的开发服务器有意采用惰性策略，其就绪信号对审查交接来说太早，而 worktree 本地缓存又让冷优化变得常见。浏览器层面的 story 就绪检查或完成的静态构建才是可靠的关口。
