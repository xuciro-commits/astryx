---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 通过同一个共享的颜色读取器读取每种阴影颜色，因此对于以 8 位十六进制书写阴影颜色的主题（butter、chocolate、gothic、matcha、stone、y2k），"make shadows darker"、"make shadows lighter" 和 "the shadows are too strong" 都能得到结果，每种颜色的 alpha 按其书写形式缩放。

@josephfarina
