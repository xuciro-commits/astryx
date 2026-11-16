---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：对于编辑器拒绝的手工编辑设置项，只会提供能够解锁该主题的命令。保存时未指定轴的 `headings` 值是其字重部分，因此可用 `set <theme> headings <weight>` 或 `undo <theme> headings` 替换或移除它；放入设置列表的 `mode` 或 `base` 条目可通过 `undo <theme> mode`（或 `base`）移除，且不会为其提供任何 `set` 行（这些行设置主题自身的模式和基础）。

@josephfarina
