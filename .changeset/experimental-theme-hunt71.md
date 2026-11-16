---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：名称、损坏的主题与中断。

- 以路径形式输入的主题名（`themes/brand`、`./t`、`t/`）会指向其结尾处的主题，并说明该主题是否已存在；主题名拼写错误时，会优先提供拼写最接近的主题（`brand-drak` 是 `brand-dark`，而不是 `brand`），camelCase 名称会转换为连字符形式（`brandDark` 是 `brand-dark`，`themePark` 是 `theme-park`），绝不会当作新主题。
- 拒绝信息会给出一个可行的命令：对一个设置无法读取且没有历史记录的主题执行 `undo`，会指向 `new <theme>`，而不是 `show`；损坏的 mode 或 base 不再把各自的修复推给对方（更改或移除某项设置会把该字段恢复为默认值并说明这一点）；没有对象或没有来源的设置条目属于 `new` 会搁置一旁的损坏项，正如拒绝信息所说。
- 仅包含 `desktop.ini` 的文件夹为空，就像仅包含 `Thumbs.db` 或 `.DS_Store` 的文件夹一样。
- 在单模式与双模式之间切换主题的 `undo` 会指出要添加或移除应用 `<Theme mode>` 的哪个值，就像 `set mode` 那样；`undo --help` 说明 `--mode` 会移除单模式主题中为某个模式保存的设置。
- 如果在更改后运行检查与图片生成时被停止（Ctrl-C），编辑器会说明更改已保存并构建，其余部分由 `show` 完成。

@josephfarina
