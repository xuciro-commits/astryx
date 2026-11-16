---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：`src/themes/<theme>/` 中的应用副本会围绕你在其他名称下的文件写入（一个说明文件、一个交换文件）；只有你的文件位于副本的某个名称处，或位于通往该名称的路径上的链接，才会阻止它，此时每次更改的结果和 `wiring` 都会说明副本未更新及其原因。副本的 `<theme>.fonts.css` 始终存在（仅当主题不加载任何字体样式表时只含注释），因此应用主题模块对它的导入在字体或基准变化时仍然成立；`compile` 会写入整个副本，包括该文件。`new` 会拒绝主题命令会跳过的名称（`a--b`、`b-`），并建议清理后的名称。包命令会为编辑器主题给出正确答案：`eject` 说明其源已经属于你，而路径（`themes/<theme>`）会以命令名称作答。

@josephfarina
