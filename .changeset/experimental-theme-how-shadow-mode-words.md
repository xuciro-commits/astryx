---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会将模式短语理解为对阴影操作的限定，而不是操作本身："make shadows darker in light mode" 会使亮色模式下的阴影更强。仅亮色主题被问到暗色模式（或仅暗色主题被问到亮色模式）时，无论阴影结果以何种形式出现，都会被告知它只有一种模式。

@josephfarina
