---
'@astryxdesign/cli': patch
---

[feat] `astryx component <Name>`、`astryx hook <name>` 以及通过 `astryx discover <package>/<Component>` 读取的集成组件，其最佳实践部分会在每一组具有相同指导的条目之前放置一行 `Do:` 或 `Don't:` 标签，而不是在每个条目上重复加粗徽标；空行分隔各组，因此每组仍是独立的 Markdown 列表。每个条目都保留其位置和指导；`--json` 保持不变。

@josephfarina
