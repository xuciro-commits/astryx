---
'@astryxdesign/core': patch
---

[fix] MultiSelector 由调用方渲染的触发器会暴露其禁用状态并阻止调用方的激活处理函数，包括在只读或被 InputGroup 禁用时，同时仍可聚焦。
@korkt-kim
