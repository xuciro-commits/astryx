---
'@astryxdesign/richtext': patch
---

[feat] 在 `RichTextEditor` 中，在列表项开头键入的 Markdown 块标记现在会重新标记该项并保留其文本：`- `、`1. ` 或 `[ ] ` 会在项目符号、编号和任务之间切换该项所在的列表，而 `# ` 或 `> ` 会将顶层项从列表中取出，作为标题或引用，列表其余部分在其后继续。每次更改都是一步撤销，可回到键入的标记状态。
@emilyhorsman @ernestt
