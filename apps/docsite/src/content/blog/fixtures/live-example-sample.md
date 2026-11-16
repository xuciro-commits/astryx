---
title: 'Live example sample'
description: 'Test fixture for runnable tsx live blocks in blog posts. Never listed.'
date: '2026-11-01'
type: 'engineering'
authors:
  - 'cixzhang'
tags:
  - 'Docs'
draft: true
---

这个测试样例覆盖了 `tsx live` 代码块的所有情况。它仅在 canary 上提供，
博客索引、feed 和 sitemap 从不列出它。

## 一个可运行的示例

```tsx live
import {useState} from 'react';
import {Button} from '@astryxdesign/core/Button';
import {HStack} from '@astryxdesign/core/Layout';
import {Text} from '@astryxdesign/core/Text';

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <HStack gap={3} style={{alignItems: 'center'}}>
      <Button label="Add one" onClick={() => setCount(c => c + 1)} />
      <Text type="body" data-testid="count">
        Clicked {count} times
      </Text>
    </HStack>
  );
}
```

## 一个导入文章本地资源的示例

```tsx live
import {SampleCard} from './SampleCard';

export default function Spread() {
  return <SampleCard title="The Star" detail="Hope, renewal, calm" />;
}
```

## 出错的示例会留在其框架内

```tsx live
export default function Broken() {
  throw new Error('This example fails on purpose');
}
```

```tsx live
export default function DoesNotCompile( {
  return <div>never</div>;
}
```

## 一个普通代码块

```tsx
export default function NotLive() {
  return null;
}
```

在上述每个示例之后，文章仍会继续渲染。
