---
'@astryxdesign/cli': patch
---

[fix] 当 `astryx build` 的排序器选中一个未列入词表的模板时，它现在会将该模板与挑选模型（pick model）的最佳已列页面进行比较——该模型在其他所有地方都负责选择页面——而不是与调用模型（call model）的最佳已列页面比较。

@josephfarina
