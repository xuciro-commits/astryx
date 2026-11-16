---
'@astryxdesign/core': patch
---

[fix] 图标、`useIcon` 以及组件图标插槽使用最近的 Theme 对象，因此注册或嵌套另一个同名主题不会替换它们的图案。提供者之外的图标仍保留已注册的根主题回退。
@korkt-kim
