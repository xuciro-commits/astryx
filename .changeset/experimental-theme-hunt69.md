---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会把每一种数量表述（"a quarter bigger"、"half again"、"2x"、"×2"、"x0"、"4 times"、"by a factor of 2"、"+50%"、"-25%"、"50 percent"、"½"）都读取为当前值的倍数，绝不会当作长度，也绝不会额外增加旋钮步长；保留像素的小数部分；按请求的方式缩放部件的行高与不透明度（"50% more transparent" 会降低不透明度并保留填充）；以精确的 token 值回答全主题圆角与边框宽度量（全主题的间距或文本量只能按步长调整时会说明）；当部件没有可缩放的宽度时会说明，而不是给出固定的上限；随其余部分一起缩放自有单侧内边距；保留 "2px rounder on hover" 移动及内边距步长的状态与变体；将带量的圆角百分比（"50% of now"、"20% bigger"）读取为精确半径，绝不会当作 CSS 百分比；当圆角量只能按步长调整时会说明；并把 "no inner spacing"、"zero padding" 和 "no gap" 读取为对应对象在该请求状态下的零值。

@josephfarina
