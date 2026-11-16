---
'@astryxdesign/cli': patch
---

[feat] `astryx component <Name>`（及其 `--props` 视图）会按每行一个 prop 列出，格式为 ``- `name`: `type` = `default` - description``，必填和实验性标记位于类型之后，而不是使用四列表格。联合类型保留书写时的竖线，且不会丢弃任何字段；`--json` 不变。

@josephfarina
