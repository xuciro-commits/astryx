---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental render --reverse` 会以 `ERR_RENDER_SOURCE_DAMAGED` 拒绝两类损坏的 Astryx 页面，并且不写入任何内容，而不是返回一个看起来正常的页面。此前，在嵌入源码之前就被截断的渲染文件会从残留的标记部分重建后返回；现在会将其作为截断文件拒绝。合并后留下冲突标记的 Astryx 页面过去会不作提示地返回其中一方的源码；现在会被拒绝并指明冲突，以便你保留某一方的完整文件，或重新渲染合并后的页面。不是 Astryx 页面的文件仍会以 `ERR_RENDER_NOT_ASTRYX` 拒绝，无论是否带有冲突标记。

@josephfarina
