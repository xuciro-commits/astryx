---
'@astryxdesign/core': patch
---

[fix] useHotkeys 文档不再推荐用 `shift+/` 打开帮助浮层。该 hook 会将最终按键与 `event.key` 比较，而在美式键盘布局上 Shift+/ 会产生 `?`，因此 `shift+/` 注册在那里永远不会触发。文档现在改用 `?`，并说明对于 shift 会改变其字符的标点键，应按其产生的字符来注册。行为没有变化。

@josephfarina
