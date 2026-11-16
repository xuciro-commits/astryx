---
'@astryxdesign/cli': patch
---

[feat] `astryx search` 只打印每个结果描述的第一句，而不是完整描述，因此包含 20 个结果的列表仍保持简短。组件、Hook 和文档结果的命令会打印完整文档；`--verbose` 和 `--json` 保留完整描述。

@josephfarina
