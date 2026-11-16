---
'@astryxdesign/cli': patch
---

[perf] 通过 `@astryxdesign/cli/host` 的运行现在会像 `astryx` bin 的运行一样保留其收集到的内容，因此携带 CLI 的工具第二次 `search` 时会从保留的目录作答：约 0.47 秒，而非 1.4 秒。保留的条目会记录宿主传入的包集合、集成和命令名，因此同一文件夹中的托管运行与 bin 运行永远不会读到彼此的答案。答案不会改变。

@josephfarina
