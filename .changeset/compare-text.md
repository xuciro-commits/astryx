---
'@astryxdesign/cli': patch
---

[fix] CLI 在每台机器上都以相同方式排列名称。构建、搜索、发现以及 CLI 的各个列表（例如 `astryx component --list`）此前使用宿主机的区域设置来打破并列，因此设置为其他语言的机器可能会选择不同的模板或以不同顺序打印列表。它们现在使用一种固定的文本顺序，并且有一条 lint 规则防止依赖区域设置的比较进入 CLI。

@josephfarina
