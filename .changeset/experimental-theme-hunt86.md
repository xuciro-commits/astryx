---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：按修复建议操作即可生效。当损坏的 mode 或 base 列表中还有第二个坏值时，会先给出该值的修复，同时也会按预期保存 mode 或 base；任何修复都不会提供会丢弃上一次更改的裸 `undo`。只有在设置了颜色旋钮时，才会以 set 形式提供已存储的振动度；无效果拒绝信息会指出某个 token 颜色，因为振动度不会改变它。以其他形式输入主题名的 `undo`（`tTheme`、`T`、`brand_dark`）会建议使用该主题名的同一 undo。带有重复连字符或末尾连字符的缺失名称会建议使用 `new` 接受的清理后名称。重复列出的标题 tracking 部分会用 `undo <theme> headings tracking` 撤销，也就是可行的形式。`--on` 中的末尾逗号或排版连字符（`text-input,`、`text–input`）会指向该部件，绝不会指向整个组。在 `new` 上使用亮色与暗色配对时，会按模式提供用户自己的颜色，绝不会使用内置颜色。在单模式主题中，为其自身模式重复的条目会保留该 `--mode`，现在它会替换两个条目。

@josephfarina
