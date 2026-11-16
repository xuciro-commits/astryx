// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for motion.doc.mjs.
export const docsZh = {
  "title": "动效",
  "description": "用于动画和过渡的时长与缓动令牌。",
  "sections": [
    {
      "section": "Overview",
      "title": "概览",
      "content": [
        {
          "type": "prose",
          "text": "动效有两个目的：让界面更容易理解，也让界面更令人愉悦。面板以动画展开时，眼睛能够追踪发生了什么变化、新内容位于布局中的哪个位置。这些瞬间能降低认知负荷，让界面显得响应及时。"
        },
        {
          "type": "prose",
          "text": "同时，精心调校的动效能让应用具有一种用户能感觉到、却说不出来的精致与考究。"
        },
        {
          "type": "prose",
          "text": "设计系统提供时长和缓动令牌，让这些瞬间在整个应用中保持一致。"
        }
      ]
    },
    {
      "section": "Duration",
      "title": "时长",
      "content": [
        {
          "type": "prose",
          "text": "九个时长令牌，分为快、中、慢三档，另有 `--duration-exit`——标准的关闭时长，跟随 `--duration-fast`。"
        },
        null
      ]
    },
    {
      "section": "Easing",
      "title": "缓动",
      "content": [
        {
          "type": "prose",
          "text": "四条缓动曲线。`--ease-standard` 为减速曲线，用于状态变化。`--ease-entrance` 用于进入的元素，`--ease-move` 用于在屏幕上移动的元素；主题的 `character` 会同时设定这两者，在 `standard` 下它们等于 `--ease-standard`。`--ease-exit` 为加速曲线，用于离开的元素：它从静止开始移动并快速离开，使整个时长内都能看到运动轨迹，并且在任何 `character` 下都相同。"
        },
        null
      ]
    },
    {
      "section": "Where Motion Helps",
      "title": "动效在哪些地方有帮助",
      "content": [
        {
          "type": "prose",
          "text": "界面的某些部分受益于动画。面板、对话框和可折叠区块如果瞬间出现，会让人失去方向感，动画能给眼睛提供可跟随的线索。Toast 和通知只需要足够的进入动画引起注意，同时不要吓到用户。开关切换、选中高亮等状态变化配上短暂的过渡，会显得更有意图。"
        },
        {
          "type": "prose",
          "text": "共同点是：这些时刻用户需要理解发生了什么。"
        }
      ]
    },
    {
      "section": "Where Motion Hurts",
      "title": "动效在哪些地方有害",
      "content": [
        {
          "type": "prose",
          "text": "表格行的悬停、列表项的高亮、任何用户每分钟要做几十次的操作。给这些交互加上可感知的时长，会让界面显得总在追赶光标。让它们足够快，快到用户察觉不到延迟。"
        },
        {
          "type": "prose",
          "text": "阻塞交互的动画则更糟。如果用户必须等面板滑动结束才能点击里面的内容，动画就成了障碍。动效永远不应挡在用户和他们的下一步操作之间。"
        }
      ]
    },
    {
      "section": "Movement Principles",
      "title": "运动原则",
      "content": [
        {
          "type": "list",
          "items": [
            "并非所有元素都需要动画退出。用户正在远离的元素（例如工具提示、悬停卡片和下拉菜单）可以瞬间消失，因为用户的注意力已经转移。只有在有助于用户定位时，才为退出添加动画，例如面板关闭或对话框消失以露出下方内容。",
            "如果确实为退出添加动画，请与进入动画相匹配。从右侧滑入的面板应当向右滑出。",
            "方向应与操作一致。深入内容应感觉像向前移动，返回应感觉像回到原处。这能让用户始终清楚自己在应用结构中的位置。",
            "上下文相关的 UI 应当与其触发元素保持关联。下拉菜单应从打开它的按钮展开，弹出框应出现在它所描述的元素附近。这不适用于命令面板或 Toast 等全局 UI，它们有自己固定的位置。"
          ]
        }
      ]
    },
    {
      "section": "Respecting User Preferences",
      "title": "尊重用户偏好",
      "content": [
        {
          "type": "prose",
          "text": "有些用户对动效敏感；对一个人来说精致的动画，可能让另一个人感到不适。当操作系统的「减少动态效果」设置开启时，Astryx 组件在鼠标或触控板操作下会立即变化，在手指操作下则交叉淡入淡出而不是移动：只改变不透明度，时长 200 ms 或更短。就地变化的值（例如进度填充）在任何指针下都会立即采用新值。在你自己的动画中也应这样做：使用 `@media (prefers-reduced-motion: reduce)`，并为触摸交叉淡化添加 `(pointer: coarse)`。"
        }
      ]
    },
    {
      "section": "Animate with motion tokens",
      "title": "使用动效令牌制作动画",
      "content": [
        {
          "type": "prose",
          "text": "使用动效令牌设置过渡时长和缓动，这样当主题重新调整动效时，你的动画也会随之调整。让进入的元素使用 `--ease-entrance`，在屏幕上移动的元素使用 `--ease-move`，从而跟随主题的 `character`；让离开的元素使用 `--ease-exit`，它在任何 `character` 下都保持不变。"
        },
        {
          "type": "code",
          "label": "应用动效令牌"
        }
      ]
    },
    {
      "section": "Tune motion from the theme",
      "title": "从主题调整动效",
      "content": [
        {
          "type": "prose",
          "text": "主题通过 `defineTheme` 的 `motion` 中的两个调节项设定动效的质感。它们驱动 CSS 动效令牌，其中 `tempo` 还会为触摸动效的弹簧计时；这些弹簧目前不跟随 `character`。每个主题都会遵循每个人的「减少动态效果」设置，任何主题都不会放宽它。"
        },
        {
          "type": "list",
          "items": [
            "`tempo` 缩放所有动效时长：1 为 Astryx 自身的值，0.75 最快，1.5 最慢（超出范围的值会被限制到边界）。",
            "`character` 设定动效的活泼程度：`'crisp'` 减速且不越界，`'standard'` 为 Astryx 自身的值，`'expressive'` 在进入和移动时会轻微越界。退出和淡入淡出从不越界。"
          ]
        },
        {
          "type": "code",
          "label": "更快、更利落的主题"
        },
        {
          "type": "prose",
          "text": "有些动效从不跟随这些调节项，因为它们要跟踪手指或系统：手指跟踪、惯性与橡皮筋效果、屏幕键盘、按压模型的起始延迟、取消距离和点击闪光（其释放淡出跟随 tempo）、悬停意图延迟、手势阈值、Spinner 和 Skeleton 等忙碌指示器的循环，以及 200 ms 的「减少动态效果」交叉淡化。"
        },
        {
          "type": "prose",
          "text": "优先级从低到高：调节项，然后是为其设定的时长所用的时长比例（`fast`、`medium`、`slow`、`ratio`），最后是显式的 `tokens`。没有 `motion` 的主题渲染效果与之前完全一致。"
        }
      ]
    },
    {
      "section": "Best Practices",
      "title": "最佳实践",
      "content": [
        {
          "type": "list",
          "items": [
            "为涉及空间变化的过渡添加动画：面板打开、内容展开、元素进入屏幕。",
            "小型、频繁的交互使用快令牌。会重新排列布局的较大过渡使用中令牌。",
            "遵循操作系统级别的「减少动态效果」偏好。"
          ]
        },
        {
          "type": "list",
          "items": [
            "让悬停状态或高频交互显得落后于用户。",
            "让动画延迟用户与新内容交互的时机。过渡应当在下一次操作之前完成，或者不阻塞下一次操作。",
            "以与元素来源或去向相矛盾的方式移动元素。"
          ]
        }
      ]
    }
  ]
};
