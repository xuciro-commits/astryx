---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how`：内边距或间距的数量（"50% bigger"、"20% smaller"、"double"、"150%"）是基于部件当前取值计算出的精确值（其自身设置，否则是其规则或它读取的令牌；不相等内边距的每一侧分别缩放），绝不是 CSS 百分比内边距；并且在未给出数量时，具有精确内边距的部件会获得该内边距的一个步进（并说明这是一个步进），因为间距旋钮不会移动精确内边距。

@josephfarina
