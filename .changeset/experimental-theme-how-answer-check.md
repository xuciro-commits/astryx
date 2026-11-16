---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会根据问题检查其建议的每条命令：命令必须做出措辞所要求的那类更改（要颜色就改颜色，要圆角就改半径，要尺寸就改 padding 或大小，以及边框宽度、字重、不透明度或阴影），按所说方式从当前值开始调整，并在删除时达到 none 或 0。不符合的命令会被排除，答案会明确说明它无法推断出什么；你输入的值始终按原样接受。

@josephfarina
