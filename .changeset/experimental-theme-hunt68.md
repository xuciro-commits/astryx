---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how`：对部件填充使用 "lighter" 或 "darker" 时，会从其静止状态显示的填充出发（优先使用其自身设置；绝不使用按下时的叠加层），使用要求的量，并让半透明颜色保持半透明。"except" 会在同一个答案中让每个被排除的部件或变体保持其当前值（其自身阴影、其自身字重），当某部件完全不读取所更改的内容时会说明，当被排除的位置不是部件时也会说明。以词语命名的子部件和目录部件会指向该部件（"dialog header"、"dialog title"、"code block header"、"text inputs"、"date pickers"、"toggle buttons"、"select boxes"、"switches"）；Core 缺少的子部件（"card header"）会按整个部件回答，答案会说明这一点。"As round as"、"the same padding as" 和 "match" 只把另一个部件的值复制到第一个部件上（带数量的形式为 "twice as round as"）。每个子句保留自己的变体；文本更改列表中的裸尺寸表示字体大小；"headings 20% bigger" 会从每个标题级别自身的尺寸缩放；字体堆栈在部件上保持完整；方位词只写入那些内边距侧；名称中包含状态词的部件（"hover card"）就是该部件；"card text lighter" 和 "dialog text twice as big" 会得到命令；带有自身要求的第二个部件会保留该要求；与 `--theme` 所键入名称相近的主题名会提示同一问题。

@josephfarina
