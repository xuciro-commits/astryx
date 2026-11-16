---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how`：部件字体大小、行高、字母间距、不透明度、宽度或边框宽度的精确量（"half"、"double"、"a quarter"、"a third"、"3 times"、"25% bigger"）是部件当前值的相应倍数，绝不是固定步长；"3 times bigger" 是一个量，绝不是 3px 的值；"double the border width" 会将其加倍（不使用双线样式，不设宽度上限）；"half as round" 按当前圆角缩放；没有可读取值的内边距或间隙的四分之一是向下一步，并说明是一步；分组自身的名称（"checks"）会被读取为该分组；带状态的量（"on hover"）会缩放该状态的值并保留该状态；对话框的页眉是对话框页眉，不是应用的顶栏（卡片或对话框的页脚同理）；而 "everything except cards" 排除的部件保持其当前值。

@josephfarina
