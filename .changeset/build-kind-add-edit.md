---
'@astryxdesign/cli': patch
---

[fix] `astryx build` 会把以 “add” 开头并说明部件放置位置的请求（“add a filter row above the table”）理解为对构建器已有页面的更改，因此从应用外壳开始。“Add a dashboard to the app” 和 “add a new dashboard” 仍从页面模板开始。

@josephfarina
