---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor undo` 在 Node 22.13 上也会按名称拒绝作为文件而非文件夹的 `themes`（"themes in this app is a file, not a folder …"，并提示用 `ls -la themes` 查看其中内容）。此前在 CLI 支持的最旧 Node 版本上，它会改为以原始的 "ENOTDIR: not a directory" 错误停止。

@cixzhang
