---
'@astryxdesign/richtext': patch
---

[fix] 安装富文本包的应用不再在 `astryx search`、`component`、`template`、`theme`、`discover` 和 `upgrade` 上看到 "Warning: @astryxdesign/richtext has N integration issue(s)"。编辑器的内部插件现在位于 CLI 不会当作组件读取的文件夹中，因此集成检查不会报告任何问题。公共组件和导入保持不变。

@josephfarina
