---
'@astryxdesign/cli': patch
---

[feat] `astryx doctor` 的文本输出过去会将每项检查打印为一块 `id:`、`status:`、`label:`、`message:` 和 `fix:` 行，汇总计数占四行。现在每项检查打印为一条记录：其状态（`[ok]`、`[warn]`、`[fail]`、`[info]`）位于一列，然后是 id、label、message 和 `fix`。标题下方的图例会以各自的 `--json` 键名标注每个字段，汇总计数在一行内打印。所有字段仍会打印，因此答案内容相同但占用空间更少：在小型应用上使用 `--built` 检查时约少 10%。JSON 输出不变。
@josephfarina
