---
'@astryxdesign/core': patch
---

[fix] 在从右到左的布局中，设置 `side="auto"` 的 MobileNav 会从触发器的行内边缘打开。当触发器持有焦点时，使用该焦点。当没有任何元素获得焦点时（例如页面加载后的首次打开），会通过其 `aria-controls` 找到触发器，该属性由 AppShell 的 `MobileNavToggle` 设置。没有 `aria-controls` 且从不获取焦点的自定义触发器仍会从 `end` 打开。

@mahmed74
