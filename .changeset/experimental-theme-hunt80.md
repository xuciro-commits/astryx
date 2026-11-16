---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：手动重复列出的设置现在会更改最后一个条目，也就是构建读取的那个，因此 "keep pill" 会保存并构建成 pill。以其他大小写或包名形式书写的损坏 mode 或 base（`Dark-Only`、`Neutral`、`@astryxdesign/theme-neutral`）会先由建议修复；更改其他设置时，会把它清理为预期的值，而不是将其重置。已存储的 `0.5` 振动度会以 50 提供。`new` 会像 `set` 一样清理每个标志值，因此 `--font '«Georgia»'` 会保存为 `"Georgia"`。`--on "text inputs"` 和 `--on "dialog header"` 会指向 text-input 与 dialog-header，而 `--when Variant:Primary` 或 `variant=primary` 会得到更正后的命令。编辑器写入、但缺少 `themes/<name>/` 文件夹的应用副本会被认定为编辑器创建的，并给出 `new <name>` 来重新创建。从应用复制的名称（`tTheme`、`tTheme.ts`、`brand.theme.ts`、`themes//t`、`BrandDark`、`Brand Dark`）会指向它们所指的主题，`new` 会说明该主题是否已存在。Ctrl-C 之后的提示会说明 `undo` 或 `new` 保存了什么，并给出项目自身的 CLI 命令。对另一种形式的内边距（单侧或简写）执行 undo 时，会建议与已保存内容匹配的 undo。

@josephfarina
