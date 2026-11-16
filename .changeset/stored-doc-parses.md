---
'@astryxdesign/cli': patch
---

[perf] 已发布的 CLI 将随包发布的文档视为在发布时已通过 schema 校验，而不是在每次读取时逐个校验，因此 `docs` 的响应约提前 25 ms。被编辑过或未随包发布的文档仍按原方式校验。输出不变。

@josephfarina
