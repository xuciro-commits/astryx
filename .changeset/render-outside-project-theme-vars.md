---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render` 可以在项目之外渲染页面，即使该页面的 StyleX 会读取 Astryx 主题变量（`@astryxdesign/core/theme/tokens.stylex`），许多模板都是这样。这类页面过去会以 "The page does not compile: Could not resolve the path to the imported file" 报错停止，因为 StyleX 编译器会在页面旁边查找 Core，而在项目之外那里并没有 Core。现在编译器会从 CLI 自身的 Core 获取页面所加载的主题文件，页面渲染结果与在项目内时相同。

@josephfarina
