---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会对照问题的含义检查其答案：问题仅用于比较的部件（"rounder than buttons"、"darker than the page"）绝不会被更改，答案会说明这一点；禁令（"don't make the cards bigger"、"buttons should not be rounder"）不会更改任何内容，并说明哪些保持不变；关于值的问题（"how much padding do buttons have"、"what color is the button"）会回答当前值。比较只写入第一个部件，带上键入的偏移量（"4px rounder than buttons"）、其变体和状态，以及词语所指的属性（"button text the same color as the card text"、"input border the same color as the button background"）；应当匹配的两个部件会复制一个值，或说明它们已经匹配。"Except" 会保留精确的圆角更改、文本大小更改、部件旁的变体、小而柔和的变体，以及状态。单侧边框（"remove the top border"）、关闭图标和标题、"inputs with errors"、标题级别（"red h1"）、部件自身的圆角、两个按钮变体的文本颜色、省略的第二个子句（"… and darker when pressed"、"… and half on ghost ones"）以及 "buttons inside cards"（容器保留，答案会说明该部件在所有地方更改）都会按所问的内容读取。以其他大小写键入的主题名会保留该问题。

@josephfarina
