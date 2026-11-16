---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 分别通过一个共享读取器来读取模式短语、界限、阴影强度和禁止项，并让每个答案都接受实测检查："darker … in light mode" 会变得更暗；"weaker" 阴影会变得更柔和；"at least 2px"、"under 40px" 和 "no bigger than 12px" 会从当前值出发遵守该界限；"…, in dark mode" 和 "light mode #eee, dark mode #222" 会限定每个值的范围；"but leave inputs alone"、"don't touch inputs" 和 "keep their hover the same" 会保留该部件或状态；保留的部件会在每个变体和层级中检查；与部件一起输入的 token 会保留在该部件上；"blue card background" 是颜色，而不是蓝色变体；页面渐变会保留所指定的颜色；更细的边框从当前宽度向下一步；而指定模式的取值问题会读取该模式。

@josephfarina
