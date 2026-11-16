---
'@astryxdesign/core': patch
---

[fix] 当触发器自身的层处于打开状态时，按压不再缩放该触发器：打开菜单或 Popover 的 Button，以及 ghost 或 secondary 的 Selector、MultiSelector 或 ComplexSelector。在鼠标或手指下，已打开的层停留在未按压打开时所处的位置。没有弹层的展开按钮仍保留按压效果。

@vjeux
