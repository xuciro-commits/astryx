---
'@astryxdesign/cli': patch
---

[fix] `astryx doctor` 不再因为某个主题源文件或生成的主题文件导入了主题，就报告该主题已接入：主题编辑器的设置模块、主题构建的产物，或仅为扩展而导入某个包主题的主题源文件都属于这种情况。此前，基于已安装主题包构建的编辑器主题（`--like <theme>`）会在应用没有渲染任何主题时，把 "no theme appears wired" 警告变成通过；现在只有应用自身对主题的导入，或应用传给 `Theme` 的主题才算数。

@josephfarina
