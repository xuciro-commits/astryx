---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会在给出答案之前先测量其答案：每个建议的命令都会与主题一起在内存中构建（与 `set` 所做的构建相同；不写入任何内容），并且被触及部件在浅色和深色下显示的值必须按问题所问的方式改变问题所问的那类内容（更浅的填充在两种模式下都更浅，而文本和边框会为对比度而调整，所以在深色模式下它们朝相反方向变化；移除不会触及任何内容），同时它排除、比较或禁止的部件显示相同的值。不符合这一点的命令会被略去，答案会直接说明原因。它还会把 "besides"、"save for"、"but keep X as they are"、"X excepted" 和 "without changing X" 读作 except；把 "as well as" 读作 and；把 "compared to" 和 "versus" 读作比较；把 "don't let X get smaller" 和 "never round the inputs" 读作保持 X；把 "X shouldn't be so small" 读作要求；把 "remove the padding and border" 读作两个移除；把 "black on secondary buttons" 读作文本；把 "less sharp" 和 "less thick" 读作其反义；还会处理关于空间、间隙、阴影、背景和字体大小的值问题，以及问题之后紧跟要求的情况；把用冒号粘贴的设置读作其查找；"heading text lighter"；把 "the focus ring lighter" 读作其颜色；以及两种模式下更浅或更深的强调色。

@josephfarina
