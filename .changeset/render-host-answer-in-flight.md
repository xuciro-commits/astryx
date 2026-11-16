---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental render` 会在页面进程的答复未能到达 CLI 时说明原因：答复已发送但未收到、进程在发送时结束，或进程结束时所处的阶段、经过的秒数以及剩余的内存。当页面进程无法发送答复时，错误现在会说明这一点。

@cixzhang
