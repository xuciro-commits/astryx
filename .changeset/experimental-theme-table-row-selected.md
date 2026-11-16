---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：选中表格行的填充色就是 Core 绘制它时使用的令牌。

- 部件数据会读取 Core 在运行时设置状态时以内联方式写入的绘制值，因此处于 `selected` 状态的表格行会读取 `--color-accent-muted`。
- `how "selected table row light blue"` 会回答 `--color-accent-muted <color> --on table-row --state selected`；而对选中表格行设置背景会被该命令拒绝，因为 Core 的内联底色会将其遮盖。

@josephfarina
