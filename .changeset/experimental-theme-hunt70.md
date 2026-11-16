---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme`：构建或检查编辑器主题的每个命令都会说明 `src/themes/<theme>/` 中的应用副本何时落后：`compile` 会警告，副本滞后或消失时 `compile --check` 会失败，不产生任何更改的 `set` 仍会携带 `appCopyStale`。位于副本文件名处的你的链接或文件夹，会像你的文件一样阻止副本，无法写入的副本会说明原因（不可写、磁盘已满、文件夹位置存在文件）。描述符被删除的副本仍属于编辑器，并会被写回。编译副本的源会获取主题的锁并再次写入副本；副本消失时它会指明 `editor show`。副本字体样式表加载的字体不会被说成未加载。编辑器帮助和编译帮助会说明副本规则。

@josephfarina
