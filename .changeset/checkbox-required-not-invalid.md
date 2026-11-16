---
'@astryxdesign/core': patch
---

[fix] 必填的 `CheckboxInput` 在无人触碰之前不再被宣布为无效。Chromium 从首次渲染起就将未勾选的必填复选框报告为无效，导致屏幕阅读器在新表单的每个必填复选框上读出 "invalid"。无效状态现在遵循 `status`，与 `Switch` 上一样；原生验证仍会阻止在复选框未勾选时提交表单。

@duytbp
