---
'@astryxdesign/cli': patch
---

[perf] `doctor --built` 读取源文件更快：它解析每个文件时不把注释附加到语法节点，一次性清空注释，并且仅当文件文本可能包含 `require()` 和 `import()` 调用时才遍历该文件的语法树。在一个含 240 个文件的应用上，源码扫描耗时约减少三分之一。输出不变。

@josephfarina
