---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：设置条目的 `only` 以文本形式书写（`"false"`、`"true"`）时，会按其所表示的内容读取，并附带提示；任何其他不为 true 的值都会被拒绝，并给出移除该条目的 undo，从而使 `show` 与构建结果永不冲突。在设置之后输入主题（`set --color-accent '#123457' t`）会被拒绝，并给出把主题放在前面的同一 `set` 或 `undo`，绝不会给出以设置名作为主题的 `new`。`undo <theme> vibrancy` 会说明现在应用默认振动度。带有多个错误旋钮标志的 `new` 会建议一条命令来修复或丢弃其中每一个；`new --base` 会指向 `--like`；`show` 会给出一个可行的 show 及其帮助，以应对它不接受的选项。名称规则会列出它拒绝的每个保留名称（com0-com9、lpt0-lpt9，以及 com¹-com³、lpt¹-lpt³）。corners 接受 rem（以 px 保存），纯数字会得到 px 那一行。旋钮词不区分大小写（ROOMY、MORE、BOTH）。`set t 'corners pill'` 会按对象及其值读取。在只有一个主题的应用中未指定主题时，show 和 undo 会指出该主题。结果中的 compile 行会从命令运行所在的文件夹开始生效。

@josephfarina
