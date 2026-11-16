---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how`：数量按人们说出来的方式读取。Zero、none 和 no 在任何位置都会把该属性设为 0 或 none（"card corners zero"、"zero border"、"opacity zero"、"no letter spacing"、"remove the top padding"），内边距的某一侧现在会读取自己的值。一个数量读取器把 "up 20%"、"increase by 50%"、"2/3"、"two thirds"、"three quarters"、"twice as small"、"a third again" 以及单独的 "½" 理解为当前值的份额；裸百分比圆角会被拒绝，并给出用于缩放圆角的命令。"Two steps bigger" 给出两个拨盘档位，"2 spacing units" 是间距单位令牌的两倍，内边距上的尺寸如 "24x16px" 就是该确切内边距，而内边距、间隙、圆角或文字大小上的 "+4px"、"-2px" 或 "4px more" 就是当前值加上或减去该长度。透明量设置不透明度（"half transparent"、"10% transparent"、"50% opacity"），"more opaque" 会提高它，而 "5% gray" 是 5% alpha 的灰色。颜色量应用于文本色和悬停色；warmer 和 cooler 移动色相，而不是亮度；lighter 和 darker 改变边框、分隔线和链接的颜色，并保留 rgb()、hsl() 和 oklch() 颜色的 alpha。small、secondary 和 supporting 文本以及 fine print 会改变辅助文本大小；"h1 800" 是字重；"h2 through h4" 会改变每个级别；"h1 800 and the other headings 600" 会设置所有其他级别；"h1 twice as big as body text" 和 "h3 the same size as h2" 取另一个尺寸乘以该数量；"and the active one blue" 保留该状态。更细的文本是更轻的字重，更锐利的阴影会把该部件阴影的模糊减半，更柔和的阴影则加倍，更细的滚动条表示没有滚动条部件，覆盖层的 lighter 或 darker 只改变其 alpha，wider 不再设置凭空捏造的 720px 宽度。`how paddingLeft`、`how borderRadius` 和其他 camelCase 名称会查找该属性。

@josephfarina
