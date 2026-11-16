---
'@astryxdesign/cli': patch
---

[fix] `astryx experimental render --reverse` 能在 script 标签被压缩器或其他工具改写的文件中找到内嵌源码：未加引号的 `type`（`<script type=application/x-astryx-source>`），或位于 `type` 之前的属性。这样的文件过去会被还原为根据其标记重建的页面（仅文本和布局），而不是准确的源码。

@josephfarina
