---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental render` 和 `--reverse` 会说明某个文件无法读取，并给出原因（`EACCES: no permission`、传入的是文件夹或管道），同时使用新的错误码 `ERR_READ_FAILED`。它们过去会说文件不存在并使用 `ERR_FILE_NOT_FOUND`；文件确实不存在时仍保留该错误码。

@josephfarina
