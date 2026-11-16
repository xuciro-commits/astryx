---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：以 no- 或 not- 开头的 CSS 关键字拼写错误（`cursor not-alowed`、`background-repeat no-repat`）会像其他拼写错误一样被提示正确的关键字；真正的否定式（`cursor 'not pointer'`）仍然绝不会被提示它所否定的词。

@josephfarina
