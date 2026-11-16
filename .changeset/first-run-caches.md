---
'@astryxdesign/cli': patch
---

[perf] 一台机器上首次运行 `search` 或 `build`，以及在可以加载集成的项目中首次运行 `component`、`template`、`theme`、`discover` 或 `docs` 时，现在会保留其收集到的内容，并且 Node 的编译缓存从首次运行起就会被写入。当 CLI 安装在项目中时，新机器上的第二条命令（通常是同一会话中的下一条）会读取这些内容，而不再重新收集：在带有集成的项目中，`search` 约快 1.7 秒，`component` 约快 0.8 秒。旁边没有 Core 的全局副本会在首次运行后开始安装其 Core，这会改变下一次运行所读取的内容，因此它从第三次运行起才会读取，与之前一样。答案不会改变；`doctor` 的 "Kept catalog cache" 行会统计首次运行现在保留的条目。

@josephfarina
