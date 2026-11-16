---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how`：从间距更改中保留的部分会保留其 gap、padding 和 height（"more compact except buttons"；其自身的 padding 简写尚未被保留，因此 "bigger padding except cards" 会表示无法做到），而从边框更改中保留的部分会保留其边框宽度（"all borders thicker except on inputs"）；整个主题的阴影会基于每个共享阴影自身的图层进行调整，同时作用于两种模式或只作用于指定的那种（"make shadows darker in dark mode"）；部件自身的渐变及其自身的双模式填充会分别对每种颜色分步处理；按百分比设置的阴影会缩放其颜色；示例值的类型与属性所接受的类型一致；答案检查会按所要求的方式核对阴影的强度和颜色的透明度。

@josephfarina
