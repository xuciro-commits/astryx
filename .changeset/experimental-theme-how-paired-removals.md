---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 只有在移除词之后的第二个条目本身带有移除词，或是普通可移除名词（如 "no shadows and borders"）时，才把它读作移除；带比较级或形容词的名词则是独立的问题："no shadow and rounder corners on cards" 会移除卡片的阴影并让它的圆角更圆，而 "no border and bigger padding on cards" 会增加内边距，绝不会变成没有内边距；移除仍作用于所指名的部件。

@josephfarina
