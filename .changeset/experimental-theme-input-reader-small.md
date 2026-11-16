---
'@astryxdesign/cli': patch
---

[experimental] `astryx experimental theme editor set`：带单位的 `radius` 或 `rounded` 值会作为该尺寸应用到圆角（`radius 1rem` 得到 `corners 16px`），圆角无法读取的值会得到 `how corners`；写成常量数学表达式的文本尺寸（`calc(16px + 2px)`）会被计算出来，而没有单位的裸数字（`text-size 1.5`、`corners 0.5`）会得到 `how`，而不是猜测的尺寸；以百分比数学表达式写成的 color-mix 份额（`calc(50% * 1)`）会被读取；两个连写的颜色名称（`navyblue`）会提供第一个；`on button: pill`、标志的值与值写在一起（`state=hover 4px`），以及不带逗号的 `light: red dark: blue` 都会被读取；单引号中的字体列表（`['Inter', 'serif']`）会被读取；在仅有浅色或仅有深色的主题中，主题自身的模式标签即为值，另一种模式的标签会被拒绝，并指明该主题不显示的模式；`cursor hand` 在当前任何浏览器中都不生效，会被拒绝并给出 `pointer`。

@josephfarina
