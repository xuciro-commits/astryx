---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：粘贴的内容会按其本意读取，修复建议会带上给定的值。

- 修复建议绝不会提供一个输入中原本没有的现成值（某个灰度、某个紫色、`inter`、`system`、`1px`）：再次设置同一设置项的一行会带上键入或保存的值（经过清理），否则给出该设置项的 `how`。
- 带有并非该设置项自身名称的标签的值会被拒绝，并说明该词的含义，绝不会在丢弃该词的情况下设置：一个模式（`accent 'dark: #2563eb'` 会给出 `--color-accent '#2563eb' --mode dark`）、一个状态（在部件上用 `--state` 设置）、一种屏幕类型（不按屏幕设置）、一个部件（`--on <part>`）、一个标题级别（`headings 'h1: bold'` 会给出 `font-weight 700 --on heading --when level:1`），或一个它无法识别的词。值前面是该设置项自身的名称时，它就是该值（`font 'fontFamily: Inter, serif'`）；另一个设置项的 camelCase 或带引号的标签会指明它。
- 乘以带数字回退值的变量的尺寸（`calc(0.75rem * var(--x, 1))`）会被接受。
- 任意大小写的 CSS 函数名都能被读取（`LIGHT-DARK(…)`）；使用其他分隔符的 `light-dark()` 会提示改用逗号；字体列表在通用族前缺少逗号（`Georgia serif`）或通用族带空格（`sans serif`）时，会给出本意的列表。
- `#`、引号或空格前的反斜杠会被去掉；`content` 字符串中的 JavaScript 转义会按 CSS 的写法写出（`\u2022` 即 `\2022`）；JSON 数组和设计令牌对象（`{"$value": …}`、`{"value": 18, "unit": "px"}`）会按其值读取。
- `headings lighter` 表示字重 light；两个 headings 词各给出一行。
- 变更回执会把引号或空格标记写为其 CSS 转义，因此文本和 JSON 命名的是同一个值；以角括号保存的值会按带引号命名，而不是按空格命名。

@josephfarina
