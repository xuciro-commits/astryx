---
'@astryxdesign/cli': patch
---

[perf] `component --list` 在可加载集成的项目中会像模板发现的记录那样在多次运行之间保留其列表，因此在那里重复列出会更快响应（使用大型 TypeScript 集成时约 220 毫秒）。新增、删除或编辑过的组件、文档或集成会在下一次运行时重新列出。

@josephfarina
