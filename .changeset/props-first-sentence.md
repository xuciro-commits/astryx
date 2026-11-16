---
'@astryxdesign/cli': patch
---

[feat] `astryx component <Name>` 会打印每个 prop 描述的第一句，其下方有一行指明可完整打印这些描述的命令：该读取自身的 selector 与 `--package` 范围加上 `--props`，因此会解析到同一个组件。当该行的开销超过截断所节省的开销时，读取会完整打印描述。`--props` 视图、`--json` 和 `astryx discover` 会保留每条描述的完整内容。

@josephfarina
