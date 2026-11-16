---
'@astryxdesign/cli': patch
---

[feat] `astryx template --list` 会打印每个模板描述的第一句，因此目录大约缩短四分之一。`--json` 会保留完整描述，`astryx template <id> --skeleton` 会在模板布局上方打印其完整描述。`astryx build` 共用的首句规则不再在引号内的句点处结束句子，因此引用诸如 "2. Nov. 2026" 这类日期的描述在那里也能完整读取。

@josephfarina
