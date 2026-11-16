---
'@astryxdesign/cli': patch
---

[feat] `astryx component <Name>`（以及通过 `astryx discover <package>/<Component>` 读取的集成组件）的 Theming 部分会将其 `defineTheme` 覆盖示例和标准 CSS 示例分别打印为一行，而不是多行代码块。出现的键和注释相同；`--json` 不变。

@josephfarina
