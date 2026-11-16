---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 通过为以单值书写的阴影的指定模式提供一对 light-dark() 值来缩放它，因此在 chocolate 或 gothic 等主题上执行 "make shadows darker in dark mode" 会改变暗色阴影并保留亮色阴影。与现在看起来相同的阴影结果（颜色已达到最大强度）不会被提供。

@josephfarina
