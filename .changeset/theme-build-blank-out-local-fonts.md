---
'@astryxdesign/cli': patch
---

[fix] `astryx theme build` 会拒绝空白或仅含空格的 `--out`（过去会写出仅以这些空格命名的文件），并且其关于已指定但未加载字体的提示会排除本地主题自身字体样式表所加载的字体系列（源文件旁的 `<slug>.fonts.css`，即 `theme add` 导入的样式表）。`astryx theme build` 和 `astryx doctor` 还会把 Segoe UI Light、Semilight、Semibold 和 Black 视为系统字体，这些是 Windows 作为独立字体系列安装的字面，因此二者都不会再报告它们未加载。

@josephfarina
