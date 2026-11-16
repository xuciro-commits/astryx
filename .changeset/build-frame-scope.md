---
'@astryxdesign/cli': patch
---

[fix] `astryx build` 仅当框架承载该模板类型的页面时，才将框架视为页面模板的依据。"Saved drafts in a modal with resume and delete row actions" 要求的是模态框中的草稿列表，而不是设置页面，因此它不再从设置对话框开始，而是从应用外壳开始，并使用套件中列出的各个部件。

@josephfarina
