---
'@astryxdesign/core': patch
'@astryxdesign/cli': patch
---

[docs] MetadataListItem 的 prop 文档现在列出 `xstyle`、`className`、`style`、`ref` 和 `data-testid`，并说明每一项会作用到哪个元素：并排布局时作用于标签 `dt`，堆叠布局时作用于包装元素。`data-testid` 文档说明，并排项会将 `-label` 和 `-value` 放在它的两个单元格上。

@cixzhang
