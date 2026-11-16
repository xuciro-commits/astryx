---
'@astryxdesign/cli': patch
---

[feat] `astryx docs --list` 会列出所有文档主题：与不带主题运行 `astryx docs` 时打印的列表相同，文本形式如此，使用 `--json` 时则以 `docs.list` 形式给出。它过去会以 `unknown option '--list'` 失败，而 `component --list`、`template --list` 和 `hook --list` 各自都会列出其目录。其他所有 docs 标志与 `--list` 一起使用时的行为，与不带主题时相同；在 `--list` 旁同时给出主题或章节会以 `ERR_INVALID_ARGUMENT` 拒绝。`docs()` 接受相同的 `list` 选项。

@josephfarina
