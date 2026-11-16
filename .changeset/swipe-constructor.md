---
'@astryxdesign/core': patch
---

[feat] `Item` 和 `ListItem` 上的滑动操作来自单个属性 `swipe`，其值由 `createSwipe` 创建（来自 `@astryxdesign/core/Swipe` 或包根）：`swipe={createSwipe({leading, trailing, swipeBehavior})}`。每个操作都有一个 `id`，其 `onActivate` 接收 `{id, itemKey}`：即操作的 `id` 和 `ListItem` 的 `itemKey`。因此模块作用域中的一个定义可服务每一行；处理器需要组件状态的定义则应放在 `useMemo` 中。swipe 的类型携带这些 id，因此不存在的 id 会导致编译失败。具有相同 id 的新值会让已打开的行保持打开，而具有其他 id 的新值会将其关闭。swipe 的代码随 `createSwipe` 一起引入，因此设置了 `swipe` 的行在首次绘制时即可滑动，而从未导入它的应用不会打包任何相关代码。`swipeActions` 和 `swipeBehavior` 属性以及 `ItemSwipeAction` 和 `ItemSwipeActions` 类型已弃用（DEP-0017），并将在下一个小版本中移除。`ItemSwipeActionVariant` 和 `ItemSwipeBehavior` 保留，新 API 使用它们。在此之前，已弃用的属性继续有效，采用本版本为每一行提供的滑动行为；当同时设置 `swipe` 时，`swipe` 优先。`astryx upgrade` 会重写静态用法，并为每个操作提供一个 `id`。

之前：

```tsx
<ListItem
  label="Inbox"
  swipeActions={{trailing: [{label: 'Archive', onActivate: archive}]}}
  swipeBehavior="commit"
/>
```

之后：

```tsx
import {createSwipe} from '@astryxdesign/core/Swipe';

const inboxSwipe = createSwipe({
  trailing: [
    {
      id: 'archive',
      label: 'Archive',
      onActivate: ({itemKey}) => archive(itemKey),
    },
  ],
  swipeBehavior: 'commit',
});

<ListItem label="Inbox" itemKey={message.id} swipe={inboxSwipe} />;
```

@vjeux
