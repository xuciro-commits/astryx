---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：标题颜色、页面背景、按模式的渐变，以及包含多个变量的背景值。

- `color … --on heading`（也可通过 `--when level:N` 按层级设置）会写为标题的颜色 prop 所读取的文本颜色 token，仅作用于标题，因此能够显示；`how` 会用该命令回答 "headings in the accent color"。
- 部件背后的页面由 `app-shell` 绘制：`--on page`（或 `body`）会被拒绝，并给出 `app-shell` 命令；`how "page background"` 会为颜色提供 `--color-background-body`，并为颜色或渐变提供 `background … --on app-shell`。设置 `--color-background-body` 时，不再会在 Core 自身页面样式读取它的地方提示没有任何变化。
- 渐变背景可以在亮色与暗色之间不同：`background '<gradient>' --mode dark` 会仅在对应模式下绘制其中的每种颜色，并与另一模式的图层并列。
- 包含三个以上变量的背景值（`color-mix()` 搭配 `var()` 和色标位置、分层圆点）会按 CSS 读取，与使用纯色时的相同值一样。

@josephfarina
