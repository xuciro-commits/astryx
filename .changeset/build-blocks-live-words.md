---
'@astryxdesign/cli': patch
---

[fix] `astryx build` 还会根据块的文档中使用、而其拟合词权重并不认识的单个词语（例如较新的 Core 块自己的术语）对块进行排序，因此使用这些词语的请求可以关联到该块。

@josephfarina
