---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：每项修复都以相同方式识别所输入的值、设置、部件、状态或主题名或令牌名中的拼写错误：五个字母及以下的单词允许相差一个字母，更长的单词允许相差两个字母，两个字母互换计为一个。因此 `border-style line` 不再会收到 `none`，`display flxe` 会收到 `flex`，而绝不会是 `flow`；`nnone` 和 `normall` 仍会被纠正。`how` 问题中的单词保留各自的拼写识别方式。

@josephfarina
