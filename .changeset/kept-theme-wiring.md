---
'@astryxdesign/cli': patch
---

[perf] `doctor` 会像文档检查一样，在多次运行之间保留对应用主题接线方式的扫描结果，因此重复运行 `doctor` 的响应约提前 20 到 35 ms。对应用源码、主题或主题包的编辑会在下一次运行时重新扫描。

@josephfarina
