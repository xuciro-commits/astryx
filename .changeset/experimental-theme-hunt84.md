---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor`：输入读取器覆盖更多粘贴形式，修复仍只提供所输入的值（清理后）或对它的有据解读，绝不提供预设值。

- 部件属性或类型令牌上的标签会像拨盘上的标签一样读取：`padding 'hover: 4px' --on button` 提供 `--state hover`，`'dark: red'` 提供 `--mode dark`，`'card: 4px'` 提供 `--on card`，而属性自身的标签（`background-color: red`）就是该值。命名另一个设置的标签（`'accent: red'`）在令牌和部件属性上也会提供该设置，并且绝不会把字体设成它。
- 本身是某个标志自身名称的标签（`state: hover`、`part: card`、`variant: primary`、`mode: dark`）说明的是该标志的作用，而不是命名无关的部件。JSON 中一个带标签的条目（`{"color": "#e11d48"}`）会按其 CSS 形式读取，粘贴时带有令牌标签的值（`'--color-accent: #e11d48'`）不再被当作未知选项。
- 用单引号书写或省略花括号的、包含多个设置的对象，会按每个设置一行生成。
- 已保存的 `red / blue` 颜色会提供其 `light-dark()` 配对；已保存的、无颜色可饱和的鲜艳度只提供撤销。
- 整段字体栈放在一对引号中（`"Inter, serif"`）、字体族以 `|`、`;` 或 `/` 分隔、以及任何通用字体族前缺少逗号（`Inter, Georgia serif`、`georgia serif`）的情况，都会按预期的列表提供。`font: Inter, serif` 和 `fontFamily:` 标签会被读取。字体族中的 `\u0020` 和内容中的 `\x2022` 会按 CSS 读取转义的方式读取。
- `density roomy` 提供 `spacing roomy`，表示更多或更少空间的词也按此映射。附近没有任何内容的圆角和间距词，以及没有任何可读内容的大小令牌，会提供 `how`，而不是预设档位或令牌的默认值。
- 单位无法组合的 calc()（`8 + 2px`、`0.5rem * 1px`，其中每个 var() 取其回退值）会被拒绝。
- 颜色拨盘上的 `--mode night` 或 `day` 会提供单模式行，绝不会提供双模式行。
- 少一位的十六进制颜色会按原样被拒绝，不会凭空补一位；`navy blue` 提供 `navy`，`0xe11d48` 提供 `#e11d48`。

@josephfarina
