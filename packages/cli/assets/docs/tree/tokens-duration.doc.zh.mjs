// Copyright (c) Meta Platforms, Inc. and affiliates.

// Chinese translation overlay for tokens-duration.doc.mjs.
export const docsZh = {
  "title": "时长令牌",
  "description": "运动时长基础令牌。分为三个区间：快（微交互）、中（进入/退出）、慢（持续）。最小/最大变体由基础值 × 比例推导。主题的两个 `motion` 旋钮中，`tempo`（0.75–1.5）会缩放这里的每个时长；`character` 不改变时长。时长刻度对其设置的区间优先于 `tempo`，而显式的 `tokens` 优先于两者。`tempo` 不会缩放以下内容：手指跟踪、动量、橡皮筋效果、屏幕键盘、按压的起始延迟、取消距离和点击闪光、悬停意图延迟、手势阈值、Spinner 和 Skeleton 的循环，以及 200 ms 的 Reduce Motion 上限。",
  "sections": [
    {
      "section": "Duration Tokens",
      "title": "时长令牌",
      "content": [
        {
          "type": "prose",
          "text": "运动时长基础令牌。分为三个区间：快（微交互）、中（进入/退出）、慢（持续）。最小/最大变体由基础值 × 比例推导。主题的两个 `motion` 旋钮中，`tempo`（0.75–1.5）会缩放这里的每个时长；`character` 不改变时长。时长刻度对其设置的区间优先于 `tempo`，而显式的 `tokens` 优先于两者。`tempo` 不会缩放以下内容：手指跟踪、动量、橡皮筋效果、屏幕键盘、按压的起始延迟、取消距离和点击闪光、悬停意图延迟、手势阈值、Spinner 和 Skeleton 的循环，以及 200 ms 的 Reduce Motion 上限。"
        },
        {
          "type": "table",
          "headers": [
            "令牌",
            "Core 默认值"
          ],
          "rows": [
            [
              "--duration-fast-min",
              "130ms"
            ],
            [
              "--duration-fast",
              "175ms"
            ],
            [
              "--duration-fast-max",
              "230ms"
            ],
            [
              "--duration-medium-min",
              "310ms"
            ],
            [
              "--duration-medium",
              "410ms"
            ],
            [
              "--duration-medium-max",
              "550ms"
            ],
            [
              "--duration-slow-min",
              "730ms"
            ],
            [
              "--duration-slow",
              "975ms"
            ],
            [
              "--duration-slow-max",
              "1300ms"
            ],
            [
              "--duration-exit",
              "var(--duration-fast)"
            ]
          ]
        }
      ]
    }
  ]
};
