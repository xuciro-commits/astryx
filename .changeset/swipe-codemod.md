---
'@astryxdesign/cli': patch
---

[feat] `astryx upgrade` 将 `Item` 和 `ListItem` 中已弃用的 `swipeActions` 和 `swipeBehavior` 属性改写为 `swipe={createSwipe(…)}`，其中每个条目都是对象字面量。没有 `id` 的条目会根据其所在侧和位置取一个，例如 `'trailing-0'`，因此结果可以编译。它会添加 `createSwipe` 导入。对于无法看到其条目的值和无法改写的 JSX 展开，它会报告并保持原样。

@vjeux
