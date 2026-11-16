---
'@astryxdesign/cli': patch
---

[perf] 发布的 CLI 会在发布时存储 Core 的组件列表与导入信息，并在已安装的 Core 文件未变化时使用它们，因此在没有集成的项目中 `component --list` 的响应快约 30 到 60 毫秒。若 Core 版本不同，或该列表读取的任何 Core 文件或文件夹发生变化，则仍像以前一样实时读取 Core。

@josephfarina
