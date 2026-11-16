---
'@astryxdesign/cli': patch
---

[feat] `astryx upgrade --list` 现在将每个 codemod 打印为一行，包含其名称和标题，列在其版本之下；仅在请求时运行的 codemod 会标注 `(optional)`，当所有 codemod 共享同一个包时只列出一次该包，而不是为每个 codemod 打印五行记录。现在每新增一个 codemod，列表只增加一行；当某个 codemod 开启新版本时，另加一个标题。`--json` 保持不变。

@josephfarina
