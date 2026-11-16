---
'@astryxdesign/cli': patch
---

[fix] 在 Windows 上，`astryx experimental render` 和实验性主题编辑器现在会转换页面自身的文件。渲染器曾将每个文件都视为项目之外的文件，因为模块加载器用正斜杠命名文件，而项目路径使用反斜杠，所以没有任何文件被转换。导入样式表的页面或主题随后会以 `Unknown file extension ".css"` 失败，StyleX、图片和 JSON 导入也没有被处理。

@prath47
