---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme compile`：编辑器主题成功编译后，始终会根据刚构建出的内容写入其应用副本，包括对 `<theme>.theme.ts` 的手工编辑，副本的字体样式表来自主题当前加载的字体（此后安装或移除的字体包；不发生任何更改的 `set` 也会刷新它）。`--check` 会按检出时写入的方式读取副本（CRLF 行尾可通过），仅在主题输出为最新时才比较（手工编辑过的主题输出会由输出检查指出），而过期的副本保持文档化的检查结果：`upToDate: false`、代码 `ERR_THEME_STALE` 以及说明原因的 `appCopyStale`。副本的源文件和文件夹不是编译目标，指向副本文件夹的 `--out`（任意大小写，带不带斜杠）会被拒绝，并建议执行不带 `--out` 的同一编译，被拒绝的编译不会写入副本。帮助中已说明这一点。

@josephfarina
