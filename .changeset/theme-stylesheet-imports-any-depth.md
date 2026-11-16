---
'@astryxdesign/cli': patch
---

[fix] `theme build`（无论是否带 `--check` 或 `--family`）、`integration verify` 和 `doctor` 会加载这样的主题：它扩展了一个基础主题，而该基础主题的模块导入了自己的样式表，例如某个包的 `./themes/<slug>` 条目加载该主题的 CSS。Node 以前会在该导入处报错 `Unknown file extension ".css"` 并停止。在 Node 22.15 及更高版本中，主题任何模块导入的样式表现在都会作为空模块加载。Node 会从写入样式表导入的模块解析每个导入，因此缺失的样式表仍会失败。在 Node 22.13 和 22.14 上没有任何变化：主题构建（`theme build`、`integration verify`、`doctor` 的新鲜度检查）仍会在任何样式表导入处停止，而读取已构建的主题模块（`doctor`、`component`）仍只加载从该模块文件夹可解析的样式表。

@josephfarina
