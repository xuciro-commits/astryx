---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor how` 会对其答案做更多测量：被触及部件所显示的每个变体和状态（且仅限单模式主题所显示的模式）、基础主题为某个变体自有的规则、每个状态下的保留变体，以及无论以何种方式书写的绘制背景；带例外子句的普通答案也要遵守该例外。变体读取自身颜色的部件（"button text darker"、"buttons lighter"）会在每个模式下按变体从其自身颜色得到一个步骤。它还能回答：headings smaller（当字体刻度盘会改变字重时，每个级别使用其自身尺寸）、"the text 2px bigger"、"the card border 1px thicker"、写作 "48px by 48px" 的尺寸、任意属性的标题范围（"headings 1 through 3 bolder"）以及被排除的级别（"all headings red except h1"，h1 保持原样）、超过 6 的标题级别（会说明）、"the dialog the same color as the page"（页面自身的颜色；页面不变）、"no shadow and no border on dialogs"（该部件上的两者）、"0 steps more"（不改变）、"everywhere except"、更透明的背景（更低的 alpha）、对话框阴影从现有阴影出发变深、变浅或无模糊、"remove the card background"（透明）、从当前宽度出发的 "thicker borders"、指向另一个令牌的令牌、仅深色主题从其深色值取得的强调色、"rounder cards without shadows"、"slightly lighter than black"，以及关于部件字体、阴影、不透明度与填充的值问题，均按其命名的变体和模式作答。

@josephfarina
