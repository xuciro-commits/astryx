---
'@astryxdesign/cli': patch
---

[perf] `upgrade` 让 jscodeshift 对每个解析器在每个 codemod 中只绑定一次，而不是每个文件绑定一次，此前这会为每个文件构建一份新的 jscodeshift 辅助函数副本。对含 240 个文件的应用执行升级约快 150 ms。输出不变。

@josephfarina
