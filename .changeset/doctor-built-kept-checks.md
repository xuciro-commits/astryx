---
'@astryxdesign/cli': patch
---

[perf] `doctor --built <path>` 现在会像 `doctor` 一样读回 doctor 保留的检查结果（前提是每用户缓存文件夹已存在）：CLI 曾把 `--built` 后面的路径当作子命令，因此这些运行每次都会重新检查文档。在集成会添加文档的项目中，预热后的 `doctor --built` 大约快 200 ms；在仅含 Core 的项目中，差异在噪声范围内。构建本身仍会在每次运行时检查。检查结果不变；缓存行会计入保留的检查项。

@josephfarina
