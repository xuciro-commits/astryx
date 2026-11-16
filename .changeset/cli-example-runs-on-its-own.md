---
'@astryxdesign/cli': patch
---

[feat] `astryx doctor integration validate`（以及 `integration check`）会列出每个不是 `kind: 'setup'` 但无法独立运行的组件示例——即文档页面或目录卡片将其作为实时预览运行的方式：无法编译的代码，例如顶层 `return` 或中途停止的代码（`example_does_not_compile`）；不渲染任何内容的代码（`example_renders_nothing`）；示例从未定义或导入的名称（`example_undefined_name`）；导入仅在服务器上运行的代码、其渲染的异步服务器组件，或读取 `process.env`（`example_server_only`）；以及导入相对路径或该包未声明的包（`example_import_unresolvable`）。每一项都是一个带修复建议的提示，现在会使 `integration check --strict --next` 失败，从下一个小版本起会使 `--strict` 失败，因此以前通过的构建不会失败。示例可以无需导入就使用其包所记录的组件、Core 记录的组件和 Hook、React 的导出以及浏览器全局变量。来自 `@astryxdesign/cli/authoring` 的 `previewableExample(example, scope)` 是同一规则，供将示例显示为实时预览的工具使用：它返回要打包的模块，或说明示例无法运行的原因。来自 `@astryxdesign/cli/api` 的 `integrationExampleScope(pkg)` 以 JSON 返回 Doctor 读取包示例时使用的范围，因此目录可以存储它，预览工具可以完全像 Doctor 一样读取每个示例。`showcase_not_standalone` 现在读取相同的包：像 `events` 这样仅由 `devDependencies` 安装的 Node 内置名称被视为仅限服务器，因为安装该包的应用无法获得它。

@josephfarina
