---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：设置条目的模式用其他词写成（`Dark`、`night`、`Light`、`day`）时会被读作深色或浅色；来源用其他字母写成（`Dial`）或缺失时，会从实体读取（一个旋钮、一个 `--` token、某个部件属性）。一条说明会指出每个条目是如何读取的，下一次更改会按该方式保存，因此没有命令会被阻塞。模式或来源毫无意义的条目会被拒绝，并首先给出仅移除该条目的撤销，其次给出会丢失最后一次更改的回退步骤。当主题名称以路径形式输入（`./t`、`themes/t`）时，带该主题名称的 `set`、`undo` 和 `compile` 会在提供前由该命令检查，所有修复都放在一行内；工作文件夹之外的 `--out` 会被丢弃，并说明原因。

@josephfarina
